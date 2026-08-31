'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const registrySource = fs.readFileSync(path.join(ROOT, 'test-bank-question-registry.js'), 'utf8');
const eventsSource = fs.readFileSync(path.join(ROOT, 'test-bank-learning-events.js'), 'utf8');
const privilegeMigrationSource = fs.readFileSync(path.join(ROOT, 'supabase/migrations/20260831051512_restrict_test_bank_learning_events_authenticated_privileges.sql'), 'utf8');

test('the corrective ledger migration removes inherited write privileges', () => {
  assert.match(privilegeMigrationSource, /revoke all on table public\.test_bank_learning_events from public, anon, authenticated/i);
  assert.match(privilegeMigrationSource, /grant select, insert on table public\.test_bank_learning_events to authenticated/i);
  const executableSql = privilegeMigrationSource.replace(/--.*$/gm, '');
  const grants = executableSql.match(/\bgrant[^;]+;/gi) || [];
  assert.deepEqual(grants.map(statement => statement.replace(/\s+/g, ' ').trim().toLowerCase()), [
    'grant select, insert on table public.test_bank_learning_events to authenticated;'
  ]);
});

function plain(value) { return JSON.parse(JSON.stringify(value)); }

function question(qid, stem, answer, sub) {
  return { qid: qid, stem: stem, options: ['A', 'B', 'C', 'D'], answer: answer, why: 'Because this is the stored explanation.', sub: sub || 'mea' };
}

function load(beforeLedger) {
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  const questions = [
    question('cssbb:test-001', 'Original wording that may later be corrected.', 0, 'mea'),
    question('cssbb:test-002', 'A second question.', 1, 'ana'),
    question('cssbb:test-003', 'A third question.', 2, 'imp'),
    question('cssbb:test-004', 'A question first delivered on another device.', 3, 'con')
  ];
  dom.window.__TB = {
    EXAMS: {
      cssbb: {
        questions: 165,
        sets: { 1: questions },
        bok: [{ subs: [
          { id: 'mea', name: 'Measure', w: 37 },
          { id: 'ana', name: 'Analyze', w: 31 },
          { id: 'imp', name: 'Improve', w: 24 },
          { id: 'con', name: 'Control', w: 18 }
        ] }]
      }
    }
  };
  dom.window.eval(registrySource);
  if (typeof beforeLedger === 'function') beforeLedger(dom.window, questions);
  dom.window.eval(eventsSource);
  return { dom: dom, window: dom.window, questions: questions };
}

function remoteRow(event) {
  if (event.event_id) {
    return {
      event_id: event.event_id,
      device_id: event.device_id,
      event_type: event.event_type,
      exam_id: event.exam_id,
      session_id: event.session_id,
      question_id: event.question_id,
      occurred_at: event.occurred_at,
      payload: event.payload
    };
  }
  return {
    event_id: event.id,
    device_id: event.deviceId,
    event_type: event.type,
    exam_id: event.examId,
    session_id: event.sessionId,
    question_id: event.questionId,
    occurred_at: new Date(event.occurredAt).toISOString(),
    payload: event.payload
  };
}

function fakeLearningService(rows, uploads, requests) {
  return {
    from(table) {
      assert.equal(table, 'test_bank_learning_events');
      return {
        upsert(batch, options) {
          assert.equal(options.onConflict, 'user_id,event_id');
          assert.equal(options.ignoreDuplicates, true);
          batch.forEach(row => {
            uploads.push(row);
            if (!rows.some(existing => existing.event_id === row.event_id && existing.user_id === row.user_id)) rows.push(Object.assign({}, row));
          });
          return Promise.resolve({ error: null });
        },
        select(columns) {
          assert.match(columns, /event_id/);
          const query = {
            eq(column, userId) {
              assert.equal(column, 'user_id');
              query.userId = userId;
              return query;
            },
            order() { return query; },
            limit() {
              return Promise.resolve({ data: rows.filter(row => row.user_id === query.userId).map(remoteRow), error: null });
            },
            range(from, to) {
              if (requests) requests.push({ from: from, to: to });
              return Promise.resolve({
                data: rows.filter(row => row.user_id === query.userId).slice(from, to + 1).map(remoteRow),
                error: null
              });
            }
          };
          return query;
        }
      };
    }
  };
}

/* Captures the exact request body before pausing the first write. This models
   the browser transport boundary: editing the local event after `upsert()`
   starts cannot retroactively alter what the account server received. */
function deferredLearningService(rows, uploads) {
  let uploadCalls = 0;
  let releaseFirstUpload = null;
  let firstUploadResolve;
  const firstUpload = new Promise(resolve => { firstUploadResolve = resolve; });

  function commit(batch) {
    batch.forEach(row => {
      const copy = plain(row);
      uploads.push(copy);
      if (!rows.some(existing => existing.event_id === copy.event_id && existing.user_id === copy.user_id)) rows.push(copy);
    });
  }

  return {
    client: {
      from(table) {
        assert.equal(table, 'test_bank_learning_events');
        return {
          upsert(batch, options) {
            assert.equal(options.onConflict, 'user_id,event_id');
            assert.equal(options.ignoreDuplicates, true);
            const captured = plain(batch);
            uploadCalls += 1;
            if (uploadCalls === 1) {
              firstUploadResolve(captured);
              return new Promise(resolve => {
                releaseFirstUpload = () => {
                  commit(captured);
                  resolve({ error: null });
                };
              });
            }
            commit(captured);
            return Promise.resolve({ error: null });
          },
          select() {
            const query = {
              eq(column, userId) { assert.equal(column, 'user_id'); query.userId = userId; return query; },
              order() { return query; },
              range(from, to) {
                return Promise.resolve({ data: rows.filter(row => row.user_id === query.userId).slice(from, to + 1).map(remoteRow), error: null });
              },
              limit(count) {
                return Promise.resolve({ data: rows.filter(row => row.user_id === query.userId).slice(0, count).map(remoteRow), error: null });
              }
            };
            return query;
          }
        };
      }
    },
    firstUpload,
    releaseFirstUpload() {
      assert.equal(typeof releaseFirstUpload, 'function', 'the first upload must be held before it is released');
      releaseFirstUpload();
    },
    calls() { return uploadCalls; }
  };
}

async function settleAsyncSync(window, turns) {
  const count = turns == null ? 4 : turns;
  for (let index = 0; index < count; index += 1) {
    await Promise.resolve();
    await new Promise(resolve => window.setTimeout(resolve, 0));
  }
}

test('the learning ledger records every delivered and submitted question before sync, retains canonical IDs after wording edits, and hands all results directly to mastery', () => {
  const { dom, window, questions } = load();
  try {
    const captured = [];
    window.__TBAdaptiveMastery = {
      recordResults(records, metadata) { captured.push({ records: records, metadata: metadata }); }
    };
    const api = window.__TBLearning;
    const startedAt = Date.UTC(2026, 7, 30, 12, 0, 0);
    const sessionId = api.startSession({
      examId: 'cssbb', sessionId: 'cssbb-session-001', questions: questions.slice(0, 3), mode: 'exam', timed: true, startedAt: startedAt
    });

    /* This is the exact class of content-only correction that used to turn a
       seen question into a new question when progress was keyed from its stem. */
    questions[0].stem = 'Corrected wording for the same question.';
    assert.equal(api.hasSeen('cssbb', questions[0]), true, 'the explicit stable qid survives a wording correction');

    const firstWriteAhead = api.recordAnswer({
      examId: 'cssbb', sessionId: sessionId, question: questions[0], index: 0, selected: 1, status: 'incorrect', at: startedAt + 1000
    });
    const revisedWriteAhead = api.recordAnswer({
      examId: 'cssbb', sessionId: sessionId, question: questions[0], index: 0, selected: 0, status: 'correct', at: startedAt + 2000
    });
    assert.equal(revisedWriteAhead.eventId, firstWriteAhead.eventId, 'a changed offline selection revises the pending write-ahead event rather than duplicating it');
    assert.equal(revisedWriteAhead.revised, true);

    const complete = api.completeSession({
      examId: 'cssbb', sessionId: sessionId, mode: 'exam', timed: true, completedAt: startedAt + 60000,
      records: [
        { question: questions[0], selected: 0, status: 'correct' },
        { question: questions[1], selected: 0, status: 'incorrect' },
        { question: questions[2], selected: null, status: 'unanswered' }
      ]
    });
    assert.equal(complete.sessionId, 'cssbb-session-001');
    assert.equal(complete.total, 3);
    assert.equal(complete.correct, 1);
    assert.equal(complete.saved, true, 'completion reports that its local write-ahead state was persisted');
    assert.equal(complete.retried, false);

    const store = api.store();
    assert.equal(store.events.filter(event => event.type === 'session_started').length, 1);
    assert.equal(store.events.filter(event => event.type === 'question_exposed').length, 3, 'all session questions are marked delivered, not only the DOM-visible one');
    assert.equal(store.events.filter(event => event.type === 'answer_recorded').length, 3, 'including unvisited/unanswered questions');
    const completionEvents = store.events.filter(event => event.type === 'session_completed');
    assert.equal(completionEvents.length, 1);
    assert.deepEqual(plain(completionEvents[0].payload.answers), [
      { questionId: 'cssbb:test-001', selected: 0, status: 'correct', sub: 'mea' },
      { questionId: 'cssbb:test-002', selected: 0, status: 'incorrect', sub: 'ana' },
      { questionId: 'cssbb:test-003', selected: null, status: 'unanswered', sub: 'imp' }
    ], 'completion preserves each answer’s immutable subtopic, including a blank answer');
    assert.deepEqual(
      Array.from(store.events.filter(event => event.type === 'answer_recorded'), event => event.questionId),
      ['cssbb:test-001', 'cssbb:test-002', 'cssbb:test-003']
    );
    assert.equal(new Set(store.events.map(event => event.id)).size, store.events.length, 'each append-only event has an idempotency key');
    assert.equal(JSON.parse(window.localStorage.getItem('tb-learning-events-v2')).events.length, store.events.length, 'events are written locally before an account upload occurs');

    assert.equal(captured.length, 1, 'session completion calls the learning API directly instead of screen-scraping the quiz DOM');
    assert.equal(captured[0].records.length, 3);
    assert.deepEqual(plain(captured[0].metadata), {
      source: 'exam-attempt', mode: 'exam', timed: true, sessionId: 'cssbb-session-001', at: startedAt + 60000,
      completed: true, eventIds: Array.from(store.events.filter(event => event.type === 'answer_recorded'), event => event.id)
    });

    const eventCountBeforeRetry = store.events.length;
    const retry = api.completeSession({ examId: 'cssbb', sessionId: sessionId, records: [] });
    assert.equal(retry.retried, true, 'a local persistence retry is explicit');
    assert.equal(retry.total, 3);
    assert.equal(api.store().events.length, eventCountBeforeRetry, 'retrying completion does not append duplicate answer or completion events');
    assert.equal(captured.length, 1, 'retrying completion does not re-derive mastery evidence');

    const summary = api.summary('cssbb');
    assert.equal(summary.uniqueSeen, 3);
    assert.equal(summary.answeredEvents, 2, 'answered counts exclude the unanswered audit marker');
    assert.equal(summary.completedSessions, 1);
  } finally {
    dom.window.close();
  }
});

test('a failed completion write does not project mastery or emit a completed result until its durable retry succeeds', () => {
  const { dom, window, questions } = load();
  const storagePrototype = Object.getPrototypeOf(window.localStorage);
  const originalSetItem = storagePrototype.setItem;
  try {
    const mastery = {
      results: [],
      recordResults(records, metadata) {
        this.results.push({ records: plain(records), metadata: plain(metadata) });
        window.document.dispatchEvent(new window.CustomEvent('tb:learning-recorded', { detail: metadata }));
      }
    };
    window.__TBAdaptiveMastery = mastery;
    let resultEvents = 0;
    window.document.addEventListener('tb:learning-recorded', function () { resultEvents += 1; });

    const api = window.__TBLearning;
    const startedAt = Date.UTC(2026, 7, 31, 9, 0, 0);
    const sessionId = api.startSession({
      examId: 'cssbb', sessionId: 'cssbb-completion-retry', questions: questions.slice(0, 2), mode: 'exam', timed: true, startedAt: startedAt
    });
    api.recordAnswer({
      examId: 'cssbb', sessionId: sessionId, question: questions[0], index: 0, selected: 0, status: 'correct', at: startedAt + 1000
    });

    let rejectCompletionWrite = true;
    storagePrototype.setItem = function (key, value) {
      if (key === 'tb-learning-events-v2' && rejectCompletionWrite) throw new Error('simulated localStorage quota failure');
      return originalSetItem.call(this, key, value);
    };
    const failed = api.completeSession({
      examId: 'cssbb', sessionId: sessionId, mode: 'exam', timed: true, completedAt: startedAt + 60000,
      records: [
        { question: questions[0], selected: 0, status: 'correct' },
        { question: questions[1], selected: 1, status: 'correct' }
      ]
    });

    assert.equal(failed.saved, false, 'the caller is told that the final local write-ahead save failed');
    assert.equal(mastery.results.length, 0, 'no mastery state is derived from a completion that is not durable');
    assert.equal(resultEvents, 0, 'no completed-result event is emitted before a durable save');
    assert.equal(api.store().events.filter(event => event.type === 'session_completed').length, 1, 'the in-memory outbox retains the completion for retry');

    rejectCompletionWrite = false;
    const retry = api.completeSession({ examId: 'cssbb', sessionId: sessionId, records: [] });
    assert.equal(retry.saved, true);
    assert.equal(retry.retried, true);
    assert.equal(mastery.results.length, 1, 'the first durable retry projects mastery exactly once');
    assert.equal(resultEvents, 1);
    assert.deepEqual(mastery.results[0].records.map(entry => entry.question.qid), ['cssbb:test-001', 'cssbb:test-002'], 'retry rebuilds records from immutable ledger snapshots');
    assert.deepEqual(mastery.results[0].records.map(entry => entry.status), ['correct', 'correct']);

    const duplicateRetry = api.completeSession({ examId: 'cssbb', sessionId: sessionId, records: [] });
    assert.equal(duplicateRetry.saved, true);
    assert.equal(mastery.results.length, 1, 'later retries do not duplicate the derived mastery result');
    assert.equal(resultEvents, 1);
  } finally {
    storagePrototype.setItem = originalSetItem;
    dom.window.close();
  }
});

test('known-user offline events upload once after reconnect, then remote-device exposure hydrates New-only state', async () => {
  const { dom, window, questions } = load();
  try {
    const user = { id: 'learner-001' };
    const accountRows = [];
    const uploads = [];
    let client = null;
    Object.defineProperty(window.navigator, 'onLine', { configurable: true, value: false });
    window.UpskillAuth = {
      getUser: () => user,
      getClient: () => client
    };
    const api = window.__TBLearning;
    const sessionId = api.startSession({
      examId: 'cssbb', sessionId: 'cssbb-session-offline', questions: questions.slice(0, 2), mode: 'quick', timed: false, startedAt: Date.UTC(2026, 7, 30, 13, 0, 0)
    });
    api.completeSession({
      examId: 'cssbb', sessionId: sessionId, mode: 'quick', timed: false,
      records: [
        { question: questions[0], selected: 0, status: 'correct' },
        { question: questions[1], selected: 0, status: 'incorrect' }
      ]
    });
    const beforeReconnect = api.status();
    assert.equal(beforeReconnect.signedIn, true);
    assert.ok(beforeReconnect.pending > 0, 'offline work is retained locally under the known account instead of being discarded');

    client = fakeLearningService(accountRows, uploads);
    Object.defineProperty(window.navigator, 'onLine', { configurable: true, value: true });
    const first = await api.sync('test-reconnect');
    assert.ok(first.synced > 0);
    const uploadedIds = uploads.map(row => row.event_id);
    assert.equal(new Set(uploadedIds).size, uploadedIds.length, 'the first account sync sends each event once');
    assert.equal(api.status().pending, 0, 'only a confirmed upload clears the pending status');

    await api.sync('repeat');
    assert.deepEqual(uploads.map(row => row.event_id), uploadedIds, 'retrying after acknowledgement does not re-upload local events');

    accountRows.push({
      user_id: user.id,
      event_id: 'phone-device-1',
      device_id: 'phone-device',
      event_type: 'question_exposed',
      exam_id: 'cssbb',
      session_id: 'cssbb-phone-session',
      question_id: 'cssbb:test-004',
      occurred_at: new Date(Date.UTC(2026, 7, 30, 14, 0, 0)).toISOString(),
      payload: { mode: 'practice', timed: false }
    });
    await api.sync('phone-hydration');
    assert.equal(api.hasSeen('cssbb', questions[3]), true, 'a question delivered on another device is excluded from New-only selection after hydration');
    assert.equal(api.summary('cssbb').uniqueSeen, 3, 'the cross-device event contributes exactly one additional unique question');
  } finally {
    dom.window.close();
  }
});

test('a New-only freshness request follows an already-running remote read with a second read, and refuses offline history', async () => {
  const { dom, window, questions } = load();
  try {
    const user = { id: 'freshness-gate-learner' };
    const rows = [];
    let reads = 0;
    let releaseStaleRead = null;
    const client = {
      from() {
        return {
          upsert() { return Promise.resolve({ error: null }); },
          select() {
            const query = {
              eq() { return query; },
              order() { return query; },
              range() {
                reads += 1;
                const snapshot = rows.slice();
                if (reads === 2) {
                  return new Promise(resolve => {
                    releaseStaleRead = () => resolve({ data: snapshot.map(remoteRow), error: null });
                  });
                }
                return Promise.resolve({ data: snapshot.map(remoteRow), error: null });
              },
              limit() { return Promise.resolve({ data: rows.slice().map(remoteRow), error: null }); }
            };
            return query;
          }
        };
      }
    };
    window.UpskillAuth = { getUser: () => user, getClient: () => client };
    const api = window.__TBLearning;
    await api.sync('initial-hydration');

    const background = api.sync('background-read');
    assert.equal(typeof releaseStaleRead, 'function', 'the background request has already captured its stale response');
    const fresh = api.ensureFreshHistory('new-only-start');
    rows.push({
      user_id: user.id,
      event_id: 'phone-written-after-background-select',
      device_id: 'phone-device',
      event_type: 'question_exposed',
      exam_id: 'cssbb',
      session_id: 'phone-session-freshness',
      question_id: questions[3].qid,
      occurred_at: new Date(Date.UTC(2026, 7, 31, 10, 0, 0)).toISOString(),
      payload: { mode: 'quick', timed: false }
    });
    releaseStaleRead();
    await background;
    const result = await fresh;

    assert.equal(result.ready, true);
    assert.ok(reads >= 3, 'the freshness gate makes a follow-up read instead of accepting the background response that started first');
    assert.equal(api.hasSeen('cssbb', questions[3]), true, 'the follow-up contains the question recorded by the other device');

    Object.defineProperty(window.navigator, 'onLine', { configurable: true, value: false });
    const offline = await api.ensureFreshHistory('new-only-offline');
    assert.deepEqual(plain(offline), { ready: false, reason: 'offline', userId: user.id });
  } finally {
    dom.window.close();
  }
});

test('existing mastery history is migrated to durable canonical exposure before New-only selection on another device', async () => {
  const accountRows = [];
  const uploads = [];
  const user = { id: 'legacy-learner-001' };
  const { dom, window, questions } = load((page, bank) => {
    const legacyKey = page.__TBQuestionRegistry.legacyStemHash(bank[0].stem);
    page.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({
      version: 1,
      exams: {
        cssbb: {
          questions: {
            [legacyKey]: { id: legacyKey, stem: bank[0].stem, sub: bank[0].sub, attempts: 4, correct: 3, incorrect: 1, lastSeenAt: Date.UTC(2026, 7, 29) }
          },
          attempts: [], sessions: []
        }
      }
    }));
    page.UpskillAuth = { getUser: () => user, getClient: () => fakeLearningService(accountRows, uploads) };
  });
  try {
    const api = window.__TBLearning;
    await api.sync('legacy-migration');
    assert.equal(api.status().hydrated, true);
    assert.equal(api.hasSeen('cssbb', questions[0]), true, 'a previously attempted legacy question never reappears as New');
    assert.ok(api.summary('cssbb').uniqueSeen >= 1);
    assert.ok(
      uploads.some(row => row.question_id === 'cssbb:test-001'),
      'the converted exposure is uploaded so a phone and laptop agree about historic progress'
    );
  } finally {
    dom.window.close();
  }
});

test('a legacy record seeded on one device is uploaded once and excludes the question on a clean second device', async () => {
  const accountRows = [];
  const uploads = [];
  const user = { id: 'legacy-two-device-learner' };
  const deviceA = load((page, bank) => {
    const legacyKey = page.__TBQuestionRegistry.legacyStemHash(bank[0].stem);
    page.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({
      version: 1,
      exams: {
        cssbb: {
          questions: {
            [legacyKey]: { id: legacyKey, stem: bank[0].stem, attempts: 1, correct: 1, lastSeenAt: Date.UTC(2026, 7, 29) }
          }
        }
      }
    }));
    page.UpskillAuth = { getUser: () => user, getClient: () => fakeLearningService(accountRows, uploads) };
  });
  const deviceB = load((page) => {
    page.UpskillAuth = { getUser: () => user, getClient: () => fakeLearningService(accountRows, uploads) };
  });
  try {
    await deviceA.window.__TBLearning.sync('legacy-device-a');
    assert.equal(deviceA.window.__TBLearning.status().hydrated, true);
    const migrated = accountRows.filter(row => row.question_id === 'cssbb:test-001');
    assert.equal(migrated.length, 1, 'device A appends exactly one deterministic migrated exposure');

    await deviceB.window.__TBLearning.sync('legacy-device-b');
    assert.equal(deviceB.window.__TBLearning.status().hydrated, true, 'an empty laptop becomes ready only after fetching the account ledger');
    assert.equal(deviceB.window.__TBLearning.hasSeen('cssbb', deviceB.questions[0]), true, 'device B never offers the historic question as New');
  } finally {
    deviceA.dom.window.close();
    deviceB.dom.window.close();
  }
});

test('an account snapshot migration remains fail-closed until its fresh progress event has been scanned', async () => {
  const accountRows = [];
  const uploads = [];
  const user = { id: 'legacy-progress-gate-learner' };
  let progressRequests = 0;
  const { dom, window, questions } = load((page, bank) => {
    const legacyKey = page.__TBQuestionRegistry.legacyStemHash(bank[0].stem);
    page.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({
      version: 1,
      exams: { cssbb: { questions: { [legacyKey]: { id: legacyKey, stem: bank[0].stem, attempts: 2, correct: 1, incorrect: 1 } } } }
    }));
    page.__TBAccountSync = { sync() { progressRequests += 1; return Promise.resolve({}); } };
    page.UpskillAuth = { getUser: () => user, getClient: () => fakeLearningService(accountRows, uploads) };
  });
  try {
    const api = window.__TBLearning;
    await api.sync('before-progress-event');
    assert.equal(api.status().hydrated, false, 'an old account-sync marker is not mistaken for a fresh progress snapshot');
    assert.equal(api.hasSeen('cssbb', questions[1]), true, 'New-only stays conservatively blocked while migration is incomplete');
    assert.ok(progressRequests > 0, 'the ledger requests the companion progress snapshot');

    window.document.dispatchEvent(new window.CustomEvent('upskill-test-progress-synced'));
    await new Promise(resolve => window.setTimeout(resolve, 0));
    await api.sync('after-progress-event');
    assert.equal(api.status().hydrated, true, 'the post-progress scan and fresh ledger fetch release New-only');
    assert.equal(api.hasSeen('cssbb', questions[0]), true);
  } finally {
    dom.window.close();
  }
});

test('an unresolved legacy identity never unlocks New-only selection', async () => {
  const accountRows = [];
  const uploads = [];
  const user = { id: 'legacy-unresolved-learner' };
  const { dom, window, questions } = load((page) => {
    page.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({
      version: 1,
      exams: {
        cssbb: {
          questions: {
            'no-longer-resolvable': { id: 'no-longer-resolvable', stem: 'A deleted historic question.', attempts: 3, incorrect: 3 }
          }
        }
      }
    }));
    page.UpskillAuth = { getUser: () => user, getClient: () => fakeLearningService(accountRows, uploads) };
  });
  try {
    await window.__TBLearning.sync('unresolved-legacy');
    assert.equal(window.__TBLearning.status().hydrated, false);
    assert.equal(window.__TBLearning.hasSeen('cssbb', questions[0]), true, 'fail-closed means no question can be served as New while historic identity is unresolved');
    assert.equal(uploads.some(row => row.question_id === questions[0].qid), false, 'the migration does not invent a canonical ID for ambiguous history');
  } finally {
    dom.window.close();
  }
});

test('remote ledger hydration paginates past 500 rows so every device receives the complete question history', async () => {
  const accountRows = [];
  const uploads = [];
  const requests = [];
  const user = { id: 'pagination-learner-001' };
  const { dom, window, questions } = load((page) => {
    page.UpskillAuth = { getUser: () => user, getClient: () => fakeLearningService(accountRows, uploads, requests) };
  });
  try {
    for (let index = 0; index < 501; index += 1) {
      accountRows.push({
        user_id: user.id,
        event_id: 'remote-page-' + String(index).padStart(3, '0'),
        device_id: 'phone-device',
        event_type: 'question_exposed',
        exam_id: 'cssbb',
        session_id: 'phone-session-' + index,
        question_id: index === 500 ? questions[3].qid : questions[0].qid,
        occurred_at: new Date(Date.UTC(2026, 7, 30, 14, 0, 0) + index).toISOString(),
        payload: { mode: 'practice', timed: false }
      });
    }
    await window.__TBLearning.sync('pagination');
    assert.deepEqual(requests, [{ from: 0, to: 499 }, { from: 500, to: 999 }]);
    assert.equal(window.__TBLearning.hasSeen('cssbb', questions[3]), true, 'the 501st remote event is not silently dropped after the first page');
    assert.equal(window.__TBLearning.status().hydrated, true);
  } finally {
    dom.window.close();
  }
});

test('a changed answer after the first upload becomes an immutable revision without inflating the unique-answer counter', async () => {
  const { dom, window, questions } = load();
  try {
    const user = { id: 'learner-002' };
    const accountRows = [];
    const uploads = [];
    let client = null;
    window.UpskillAuth = { getUser: () => user, getClient: () => client };
    const api = window.__TBLearning;
    const sessionId = api.startSession({
      examId: 'cssbb', sessionId: 'cssbb-revision-session', questions: [questions[0]], mode: 'quick', timed: false
    });
    const first = api.recordAnswer({
      examId: 'cssbb', sessionId: sessionId, question: questions[0], index: 0, selected: 1, status: 'incorrect'
    });
    client = fakeLearningService(accountRows, uploads);
    await api.sync('first-answer');

    const revised = api.recordAnswer({
      examId: 'cssbb', sessionId: sessionId, question: questions[0], index: 0, selected: 0, status: 'correct'
    });
    assert.equal(revised.revised, true);
    assert.notEqual(revised.eventId, first.eventId, 'the already-uploaded row remains immutable and receives a later revision event');
    const answers = api.store().events.filter(event => event.type === 'answer_recorded');
    assert.equal(answers.length, 2);
    assert.equal(answers[0].payload.status, 'incorrect');
    assert.equal(answers[1].payload.status, 'correct');
    assert.equal(api.summary('cssbb').answeredEvents, 1, 'one session/question pair still counts as one answer despite its revision history');

    await api.sync('revised-answer');
    assert.equal(new Set(uploads.map(row => row.event_id)).size, 4, 'each start/exposure/original/revision event uploads once');
  } finally {
    dom.window.close();
  }
});

test('an answer edited while its first upload is held is sent as a later immutable revision automatically', async () => {
  const { dom, window, questions } = load();
  try {
    const user = { id: 'in-flight-revision-learner' };
    const rows = [];
    const uploads = [];
    let client = null;
    window.UpskillAuth = { getUser: () => user, getClient: () => client };
    const api = window.__TBLearning;
    const sessionId = api.startSession({
      examId: 'cssbb', sessionId: 'in-flight-revision-session', questions: [questions[0]], mode: 'quick', timed: false
    });
    const first = api.recordAnswer({
      examId: 'cssbb', sessionId: sessionId, question: questions[0], index: 0, selected: 1, status: 'incorrect'
    });
    const service = deferredLearningService(rows, uploads);
    client = service.client;

    const syncing = api.sync('held-first-answer-upload');
    const initialBatch = await service.firstUpload;
    const initiallySent = initialBatch.find(row => row.event_type === 'answer_recorded');
    assert.equal(initiallySent.payload.status, 'incorrect', 'the transport captured the first answer before the edit');

    const revised = api.recordAnswer({
      examId: 'cssbb', sessionId: sessionId, question: questions[0], index: 0, selected: 0, status: 'correct'
    });
    assert.equal(revised.revised, true);
    service.releaseFirstUpload();
    await syncing;
    await settleAsyncSync(window);

    const remoteAnswers = rows.filter(row => row.event_type === 'answer_recorded' && row.session_id === sessionId);
    assert.equal(remoteAnswers.length, 2, 'the server retains both immutable answer revisions');
    assert.notEqual(remoteAnswers[0].event_id, remoteAnswers[1].event_id);
    assert.deepEqual(remoteAnswers.map(row => row.payload.status).sort(), ['correct', 'incorrect']);
    assert.equal(api.summary('cssbb').answeredEvents, 1, 'the later revision does not inflate the unique answer count');
    assert.equal(api.status().pendingForUser, 0, 'the revision is automatically followed up without a manual sync');
    assert.ok(service.calls() >= 2, 'the edit schedules a second upload after the held request settles');
    assert.notEqual(revised.eventId, first.eventId, 'once a request is in flight, the initial event is treated as immutable');
  } finally {
    dom.window.close();
  }
});

test('a session written during an in-flight upload is automatically sent in a follow-up batch', async () => {
  const { dom, window, questions } = load();
  try {
    const user = { id: 'in-flight-new-session-learner' };
    const rows = [];
    const uploads = [];
    let client = null;
    window.UpskillAuth = { getUser: () => user, getClient: () => client };
    const api = window.__TBLearning;
    const firstSession = api.startSession({
      examId: 'cssbb', sessionId: 'in-flight-first-session', questions: [questions[0]], mode: 'quick', timed: false
    });
    const service = deferredLearningService(rows, uploads);
    client = service.client;

    const syncing = api.sync('held-first-session-upload');
    await service.firstUpload;
    const secondSession = api.startSession({
      examId: 'cssbb', sessionId: 'in-flight-second-session', questions: [questions[1]], mode: 'quick', timed: false
    });
    assert.equal(firstSession, 'in-flight-first-session');
    assert.equal(secondSession, 'in-flight-second-session');
    service.releaseFirstUpload();
    await syncing;
    await settleAsyncSync(window);

    assert.ok(rows.some(row => row.event_type === 'session_started' && row.session_id === secondSession),
      'the second session start is not stranded after the first batch snapshot');
    assert.ok(rows.some(row => row.event_type === 'question_exposed' && row.session_id === secondSession),
      'the second session exposure is also sent automatically');
    assert.equal(api.status().pendingForUser, 0);
    assert.ok(service.calls() >= 2, 'a normal write during sync schedules a follow-up upload');
  } finally {
    dom.window.close();
  }
});

test('an active session stays bound to its original account across an A-to-B switch', async () => {
  const { dom, window, questions } = load();
  try {
    const userA = { id: 'account-a' };
    const userB = { id: 'account-b' };
    let currentUser = userA;
    let client = null;
    const rows = [];
    const uploads = [];
    window.UpskillAuth = { getUser: () => currentUser, getClient: () => client };
    const api = window.__TBLearning;
    const sessionId = api.startSession({
      examId: 'cssbb', sessionId: 'account-bound-session', questions: [questions[0]], mode: 'quick', timed: false
    });
    api.recordAnswer({
      examId: 'cssbb', sessionId: sessionId, question: questions[0], index: 0, selected: 1, status: 'incorrect'
    });
    client = fakeLearningService(rows, uploads);
    await api.sync('account-a-initial');

    currentUser = userB;
    api.recordAnswer({
      examId: 'cssbb', sessionId: sessionId, question: questions[0], index: 0, selected: 0, status: 'correct'
    });
    api.completeSession({
      examId: 'cssbb', sessionId: sessionId, mode: 'quick', timed: false,
      records: [{ question: questions[0], selected: 0, status: 'correct' }]
    });
    await api.sync('account-b-must-not-own-a-session');
    await settleAsyncSync(window, 2);

    const localBEvents = api.store().events.filter(event => event.scope === 'user:' + userB.id && event.sessionId === sessionId);
    assert.equal(localBEvents.length, 0, 'the second account cannot append evidence to account A’s live session');
    assert.equal(rows.some(row => row.user_id === userB.id && row.session_id === sessionId), false,
      'no account-B remote event reuses account A’s session ID');
    assert.equal(api.store().sessions[sessionId].status, 'active', 'the original owner can still resume the session');

    currentUser = userA;
    const completion = api.completeSession({
      examId: 'cssbb', sessionId: sessionId, mode: 'quick', timed: false,
      records: [{ question: questions[0], selected: 1, status: 'incorrect' }]
    });
    assert.ok(completion && completion.saved, 'account A can complete its own paused session');
    await api.sync('account-a-resume');
    assert.ok(rows.some(row => row.user_id === userA.id && row.event_type === 'session_completed' && row.session_id === sessionId));
  } finally {
    dom.window.close();
  }
});

test('a stale tab write merges a newly persisted outbox event instead of overwriting it', () => {
  const { dom, window, questions } = load();
  try {
    const api = window.__TBLearning;
    const sessionId = api.startSession({
      examId: 'cssbb', sessionId: 'cssbb-stale-tab-session', questions: [questions[0]], mode: 'quick', timed: false
    });
    const external = JSON.parse(window.localStorage.getItem('tb-learning-events-v2'));
    external.events.push({
      id: 'other-tab-event-001', version: 1, scope: 'anonymous', type: 'question_exposed',
      examId: 'cssbb', sessionId: 'other-tab-session', questionId: questions[1].qid,
      deviceId: 'other-tab-device', occurredAt: Date.UTC(2026, 7, 30, 16, 0, 0),
      payload: { mode: 'practice', timed: false }, syncedFor: []
    });
    window.localStorage.setItem('tb-learning-events-v2', JSON.stringify(external));

    const answer = api.recordAnswer({
      examId: 'cssbb', sessionId: sessionId, question: questions[0], index: 0, selected: 0, status: 'correct'
    });
    assert.equal(answer.saved, true);
    const ids = api.store().events.map(event => event.id);
    assert.ok(ids.includes('other-tab-event-001'), 'the externally written event survives the stale tab append');
    assert.ok(ids.includes(answer.eventId), 'the local answer event also survives');
    assert.equal(new Set(ids).size, ids.length, 'event IDs stay unique after the merge/retry write');
  } finally {
    dom.window.close();
  }
});
