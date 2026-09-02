'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const registrySource = fs.readFileSync(path.join(ROOT, 'test-bank-question-registry.js'), 'utf8');
const eventsSource = fs.readFileSync(path.join(ROOT, 'test-bank-learning-events.js'), 'utf8');
const masterySource = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery.js'), 'utf8');
const phaseIntegrationSource = fs.readFileSync(path.join(ROOT, 'test-bank-phases-integration.js'), 'utf8');

function question(qid, stem, answer, sub) {
  return { qid, stem, options: ['A', 'B', 'C', 'D'], answer, why: 'Stored explanation.', sub };
}

function load(beforeSources) {
  const dom = new JSDOM('<!doctype html><body><main id="tb-overview"></main></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', pretendToBeVisual: true
  });
  const questions = [
    question('cssbb:active-001', 'Question still in the current bank.', 1, 'mea'),
    question('cssbb:active-002', 'A second current-bank question.', 2, 'ana'),
    /* Simulate a later live-bank wording update to an already attempted item. */
    question('cssbb:retired-001', 'Current revised wording must not replace the historic mistake.', 3, 'mea')
  ];
  dom.window.__TB = { EXAMS: { cssbb: {
    questions: 165,
    sets: { 1: questions },
    bok: [{ subs: [{ id: 'mea', name: 'Measure', w: 40 }, { id: 'ana', name: 'Analyze', w: 60 }] }]
  } } };
  if (typeof beforeSources === 'function') beforeSources(dom.window, questions);
  dom.window.eval(registrySource);
  dom.window.eval(eventsSource);
  dom.window.eval(masterySource);
  return { dom, window: dom.window, questions };
}

function remoteRow(event, userId) {
  return {
    user_id: userId,
    event_id: event.id,
    device_id: 'phone-device',
    event_type: event.type,
    exam_id: event.examId,
    session_id: event.sessionId,
    question_id: event.questionId,
    occurred_at: new Date(event.occurredAt).toISOString(),
    payload: event.payload
  };
}

function remoteLedgerClient(rows) {
  return {
    from(table) {
      assert.equal(table, 'test_bank_learning_events');
      return {
        upsert() { return Promise.resolve({ error: null }); },
        select() {
          const query = {
            eq(column, userId) { assert.equal(column, 'user_id'); query.userId = userId; return query; },
            order() { return query; },
            range(from, to) {
              return Promise.resolve({ data: rows.filter(row => row.user_id === query.userId).slice(from, to + 1), error: null });
            },
            limit(count) {
              return Promise.resolve({ data: rows.filter(row => row.user_id === query.userId).slice(0, count), error: null });
            }
          };
          return query;
        }
      };
    }
  };
}

function remoteSession(at) {
  return [
    {
      id: 'phone-answer-retired', type: 'answer_recorded', examId: 'cssbb', sessionId: 'phone-session-001',
      questionId: 'cssbb:retired-001', occurredAt: at - 1000,
      payload: {
        selected: 0, status: 'incorrect',
        snapshot: { stem: 'Retired wording retained by the notebook.', options: ['A', 'B', 'C', 'D'], answer: 3, why: 'The old explanation is retained.', sub: 'mea' }
      }
    },
    {
      id: 'phone-answer-active', type: 'answer_recorded', examId: 'cssbb', sessionId: 'phone-session-001',
      questionId: 'cssbb:active-001', occurredAt: at - 500,
      payload: { selected: 1, status: 'correct', snapshot: { stem: 'ignored because current bank wins', options: [], answer: 1, sub: 'mea' } }
    },
    {
      id: 'phone-complete-001', type: 'session_completed', examId: 'cssbb', sessionId: 'phone-session-001', occurredAt: at,
      payload: {
        mode: 'quick', timed: false, total: 2, correct: 1,
        answers: [
          { questionId: 'cssbb:retired-001', selected: 0, status: 'incorrect' },
          { questionId: 'cssbb:active-001', selected: 1, status: 'correct' }
        ]
      }
    }
  ];
}

test('remote completed ledger sessions hydrate mastery and the immutable mistake snapshot exactly once', () => {
  const { dom, window } = load();
  try {
    const api = window.__TBAdaptiveMastery;
    const at = Date.UTC(2026, 7, 30, 18, 0, 0);
    assert.equal(api.reconcileLearningEvents(remoteSession(at)), 1);
    assert.equal(api.reconcileLearningEvents(remoteSession(at)), 0, 'completed session ID is the derived-store idempotency key');

    const data = api.store().exams.cssbb;
    assert.equal(data.attempts.length, 1);
    assert.deepEqual(JSON.parse(JSON.stringify(data.attempts[0])), {
      id: 'phone-session-001', at, resetAt: 0, source: 'quick-quiz', mode: 'quick', timed: false,
      completed: true, total: 2, correct: 1, answered: 2, repeated: 0, newQuestions: 2
    });
    const retired = data.questions['cssbb:retired-001'];
    assert.equal(retired.incorrect, 1);
    assert.equal(retired.history[0].learningEventId, 'phone-answer-retired');
    assert.equal(retired.history[0].snapshot.stem, 'Retired wording retained by the notebook.');
    assert.equal(retired.history[0].snapshot.why, 'The old explanation is retained.');
    assert.equal(data.questions['cssbb:active-001'].correct, 1);

    api.renderStandalone(window.document.getElementById('tb-overview'));
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    window.document.querySelector('[data-open-notebook]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    const notebook = window.document.getElementById('tb-adaptive-panel').textContent;
    assert.match(notebook, /Retired wording retained by the notebook\./);
    assert.match(notebook, /The old explanation is retained\./);
    assert.doesNotMatch(notebook, /Current revised wording must not replace the historic mistake\./);
  } finally {
    dom.window.close();
  }
});

test('completion replaces provisional answer evidence and preserves New-only novelty through synchronization', () => {
  const { dom, window } = load();
  try {
    const api = window.__TBAdaptiveMastery;
    const at = Date.UTC(2026, 8, 1, 12, 0, 0);
    const answer = {
      id: 'new-only-answer-001', type: 'answer_recorded', examId: 'cssbb', sessionId: 'new-only-session-001',
      questionId: 'cssbb:active-001', occurredAt: at + 1000,
      payload: { selected: 1, status: 'correct' }
    };
    const events = [
      {
        id: 'new-only-exposure-001', type: 'question_exposed', examId: 'cssbb', sessionId: 'new-only-session-001',
        questionId: 'cssbb:active-001', occurredAt: at,
        payload: { mode: 'quick', filter: 'new-only', firstExposure: true }
      },
      answer,
      {
        id: 'new-only-complete-001', type: 'session_completed', examId: 'cssbb', sessionId: 'new-only-session-001',
        occurredAt: at + 2000,
        payload: {
          mode: 'quick', timed: false, filter: 'new-only', total: 1, correct: 1,
          answers: [{ questionId: 'cssbb:active-001', selected: 1, status: 'correct', firstExposure: true }],
          answerEventIds: ['new-only-answer-001']
        }
      }
    ];

    assert.equal(api.reconcileLearningEvents([answer]), 1, 'an in-progress answer is projected immediately');
    assert.equal(api.store().exams.cssbb.questions['cssbb:active-001'].attempts, 1);
    assert.equal(api.reconcileLearningEvents(events), 1, 'the later completion creates one session summary');

    let data = api.store().exams.cssbb;
    assert.equal(data.questions['cssbb:active-001'].attempts, 1, 'completion replaces rather than duplicates provisional evidence');
    assert.deepEqual(JSON.parse(JSON.stringify(data.attempts[0])), {
      id: 'new-only-session-001', at: at + 2000, resetAt: 0, source: 'quick-quiz', mode: 'quick', timed: false,
      completed: true, total: 1, correct: 1, answered: 1, repeated: 0, newQuestions: 1, filter: 'new-only'
    });

    const raw = api.store();
    raw.exams.cssbb.attempts[0].newQuestions = 0;
    raw.exams.cssbb.attempts[0].repeated = 1;
    window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(raw));
    assert.equal(api.reconcileLearningEvents(events), 0, 'repairing an existing summary does not import a duplicate session');
    data = api.store().exams.cssbb;
    assert.equal(data.attempts[0].newQuestions, 1, 'full-ledger reconciliation repairs an older incorrect trend row');
    assert.equal(data.attempts[0].repeated, 0);
    assert.equal(data.questions['cssbb:active-001'].attempts, 1);
  } finally {
    dom.window.close();
  }
});

test('an incomplete session keeps only its latest immutable answer revision', () => {
  const { dom, window } = load();
  try {
    const api = window.__TBAdaptiveMastery;
    const at = Date.UTC(2026, 8, 1, 13, 0, 0);
    const incorrect = {
      id: 'revision-answer-old', type: 'answer_recorded', examId: 'cssbb', sessionId: 'revision-session',
      questionId: 'cssbb:active-001', occurredAt: at,
      payload: { selected: 0, status: 'incorrect' }
    };
    const corrected = {
      id: 'revision-answer-new', type: 'answer_recorded', examId: 'cssbb', sessionId: 'revision-session',
      questionId: 'cssbb:active-001', occurredAt: at + 1000,
      payload: { selected: 1, status: 'correct' }
    };

    assert.equal(api.reconcileLearningEvents([incorrect]), 1);
    assert.equal(api.reconcileLearningEvents([incorrect, corrected]), 1, 'the newer revision replaces the provisional choice');
    const state = api.store().exams.cssbb.questions['cssbb:active-001'];
    assert.equal(state.attempts, 1);
    assert.equal(state.correct, 1);
    assert.equal(state.incorrect, 0);
    assert.equal(state.history.length, 1);
    assert.equal(state.history[0].learningEventId, 'revision-answer-new');
    assert.equal(api.reconcileLearningEvents([incorrect, corrected]), 0, 'replaying the full revision history is idempotent');
    assert.equal(api.store().exams.cssbb.questions['cssbb:active-001'].attempts, 1);
  } finally {
    dom.window.close();
  }
});

test('a durable incorrect answer from an incomplete session still hydrates mastery and the mistake notebook', () => {
  const { dom, window } = load();
  try {
    const at = Date.UTC(2026, 7, 30, 17, 0, 0);
    const api = window.__TBAdaptiveMastery;
    const events = [{
      id: 'phone-incomplete-answer-001', type: 'answer_recorded', examId: 'cssbb', sessionId: 'phone-abandoned-session',
      questionId: 'cssbb:retired-001', occurredAt: at,
      payload: {
        selected: 0, status: 'incorrect',
        snapshot: {
          stem: 'Mistake retained even though this session was not submitted.', options: ['A', 'B', 'C', 'D'], answer: 3,
          why: 'The answer event itself is durable learning evidence.', sub: 'mea'
        }
      }
    }];

    assert.equal(api.reconcileLearningEvents(events), 1, 'the answer row itself is projected without waiting for a session_completed event');
    const data = api.store().exams.cssbb;
    const state = data.questions['cssbb:retired-001'];
    assert.equal(state.incorrect, 1);
    assert.equal(state.history[0].snapshot.stem, 'Mistake retained even though this session was not submitted.');
    assert.equal(data.attempts.length, 0, 'an incomplete session is not promoted into a completed-test score');

    api.renderStandalone(window.document.getElementById('tb-overview'));
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    window.document.querySelector('[data-open-notebook]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    const notebook = window.document.getElementById('tb-adaptive-panel').textContent;
    assert.match(notebook, /Mistake retained even though this session was not submitted\./);
  } finally {
    dom.window.close();
  }
});

test('the phase-integration notebook click keeps an immutable remote mistake snapshot', () => {
  const { dom, window } = load();
  try {
    const at = Date.UTC(2026, 7, 30, 18, 0, 0);
    const api = window.__TBAdaptiveMastery;
    assert.equal(api.reconcileLearningEvents(remoteSession(at)), 1);
    api.renderStandalone(window.document.getElementById('tb-overview'));

    /* Phase integration registers a capture-phase notebook handler.  It must
       delegate to the same historical snapshot rather than replacing it with
       the current registry question before adaptive mastery sees the click. */
    window.eval(phaseIntegrationSource);
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    window.document.querySelector('[data-open-notebook]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

    const notebook = window.document.getElementById('tb-adaptive-panel').textContent;
    assert.match(notebook, /Retired wording retained by the notebook\./);
    assert.match(notebook, /The old explanation is retained\./);
    assert.doesNotMatch(notebook, /Current revised wording must not replace the historic mistake\./);
  } finally {
    dom.window.close();
  }
});

test('a reset marker prevents an older remote completed session from restoring mastery', () => {
  const { dom, window } = load();
  try {
    const at = Date.UTC(2026, 7, 30, 18, 0, 0);
    window.localStorage.setItem('tb-account-sync-resets-v1', JSON.stringify({ 'mastery-exam:cssbb': at + 1 }));
    assert.equal(window.__TBAdaptiveMastery.reconcileLearningEvents(remoteSession(at)), 0);
    const store = window.__TBAdaptiveMastery.store();
    assert.equal(store.exams && store.exams.cssbb, undefined);
  } finally {
    dom.window.close();
  }
});

test('remote full-exam reconciliation persists immutable domain totals even when only the completion payload remains', () => {
  const { dom, window } = load();
  try {
    const at = Date.UTC(2026, 7, 30, 19, 0, 0);
    const events = [{
      id: 'phone-full-complete-001', type: 'session_completed', examId: 'cssbb', sessionId: 'phone-full-session-001', occurredAt: at,
      payload: {
        mode: 'exam', timed: true, total: 165, correct: 1,
        answers: [
          { questionId: 'cssbb:active-001', sub: 'mea', selected: 1, status: 'correct' },
          { questionId: 'cssbb:retired-001', sub: 'mea', selected: null, status: 'unanswered' }
        ]
      }
    }];
    assert.equal(window.__TBAdaptiveMastery.reconcileLearningEvents(events), 1);
    const attempt = window.__TBAdaptiveMastery.store().exams.cssbb.attempts.find(item => item.id === 'phone-full-session-001');
    assert.deepEqual(JSON.parse(JSON.stringify(attempt.domainBreakdown)), [
      { id: 'mea', total: 2, correct: 1, incorrect: 0, unanswered: 1 }
    ]);
  } finally {
    dom.window.close();
  }
});

test('sync derives remote completed-session mastery before a local event-cache trim drops its old snapshots', async () => {
  const user = { id: 'reconcile-before-trim-user' };
  const at = Date.UTC(2026, 7, 30, 18, 0, 0);
  const { dom, window } = load(function (page) {
    const retained = Array.from({ length: 2500 }, function (_, index) {
      return {
        id: 'recent-confirmed-' + String(index).padStart(4, '0'), version: 1,
        scope: 'user:' + user.id, type: 'question_exposed', examId: 'cssbb',
        sessionId: 'recent-session-' + index, questionId: 'cssbb:active-002',
        deviceId: 'laptop-device', occurredAt: at + 10000 + index,
        payload: { mode: 'practice', timed: false }, syncedFor: [user.id]
      };
    });
    page.localStorage.setItem('tb-learning-events-v2', JSON.stringify({
      version: 2, deviceId: 'laptop-device', sequence: retained.length, events: retained,
      sessions: {}, migration: {}, index: { revision: 0, seen: {}, totals: {}, knownEventIds: {} },
      sync: { remoteLoadedFor: {}, ledgerFetchedFor: {} }
    }));
  });
  try {
    const rows = remoteSession(at).map(function (event) { return remoteRow(event, user.id); });
    window.UpskillAuth = { getUser: () => user, getClient: () => remoteLedgerClient(rows) };
    const syncEvents = [];
    window.document.addEventListener('upskill-test-learning-synced', function (event) { syncEvents.push(event.detail); });

    const result = await window.__TBLearning.sync('cross-device-before-trim');
    assert.equal(result.imported, 3);
    const data = window.__TBAdaptiveMastery.store().exams.cssbb;
    assert.equal(data.attempts.length, 1, 'the completed phone session was derived before local cache compaction');
    assert.equal(data.attempts[0].id, 'phone-session-001');
    assert.equal(data.questions['cssbb:retired-001'].history[0].snapshot.stem, 'Retired wording retained by the notebook.');
    assert.equal(window.__TBLearning.eventsForExam('cssbb').some(function (event) { return event.id === 'phone-complete-001'; }), false,
      'the test deliberately confirms the old remote completion was trimmed from the local event cache');
    assert.equal(syncEvents.length, 1);
    assert.equal(syncEvents[0].events.length, 3, 'the full normalized remote ledger is emitted for live analytics refreshes');
  } finally {
    dom.window.close();
  }
});
