'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const registry = fs.readFileSync(path.join(ROOT, 'test-bank-question-registry.js'), 'utf8');
const mastery = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery.js'), 'utf8');
const hardening = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery-hardening.js'), 'utf8');
const analytics = fs.readFileSync(path.join(ROOT, 'test-bank-analytics-dashboard.js'), 'utf8');
const edge = fs.readFileSync(path.join(ROOT, 'netlify/edge-functions/test-bank-set-controls.js'), 'utf8');
const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (error) {} }));

function settle(window, frames = 4) {
  return new Promise(resolve => {
    function next(count) {
      if (!count) return resolve();
      window.requestAnimationFrame(() => next(count - 1));
    }
    next(frames);
  });
}

async function load() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  if (!dom.window.Element.prototype.scrollIntoView) dom.window.Element.prototype.scrollIntoView = function () {};
  dom.window.eval(registry);
  dom.window.eval(mastery);
  dom.window.eval(hardening);
  dom.window.eval(analytics);
  await settle(dom.window);
  return { window: dom.window, errors };
}

function hash(value) {
  let output = 2166136261;
  String(value || '').split('').forEach(character => {
    output ^= character.charCodeAt(0);
    output = Math.imul(output, 16777619);
  });
  return (output >>> 0).toString(36);
}

function questions(window) {
  return window.__TBQuestionRegistry.questionsFor('cssbb');
}

function writeStore(window, examStore) {
  window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({ version: 1, exams: { cssbb: examStore } }));
}

function seedQuestionState(question, timestamp, overrides) {
  const base = {
    id: windowQuestionId(question), questionId: windowQuestionId(question), stem: question.stem, sub: question.sub, attempts: 5, correct: 4,
    incorrect: 1, unanswered: 0, streak: 4, ease: 2.3, intervalDays: 4, dueAt: timestamp - 86400000,
    lastSeenAt: timestamp - 86400000, lastStatus: 'correct', mastery: 82, history: []
  };
  return Object.assign(base, overrides || {});
}

function windowQuestionId(question) {
  /* Fixtures should exercise the canonical identity path, not just the legacy
     wording-hash fallback.  The registry has already stamped these objects. */
  return question.__tbQuestionId || question.qid || question.questionId || hash(question.stem);
}

test('domainStats merges live pool size and blueprint weight with attempted mastery', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const bank = questions(window);
  const measureQuestions = bank.filter(q => q.sub === 'mea').slice(0, 4);
  const states = {};
  measureQuestions.forEach((question, index) => {
    states[windowQuestionId(question)] = seedQuestionState(question, timestamp, { mastery: 60 + index });
  });
  writeStore(window, { questions: states, attempts: [], sessions: [] });

  const stats = window.__TBAnalyticsDashboard.domainStats(timestamp);
  const measure = stats.find(item => item.id === 'mea');
  assert.ok(measure, 'measure domain present');
  assert.equal(measure.attempted, 4);
  assert.equal(measure.weight, 37, 'blueprint weight for Measure matches the ASQ CSSBB BoK (37/165)');
  assert.ok(measure.poolSize >= 4, 'pool size reflects the live question bank, not a hardcoded constant');
  assert.ok(measure.coverage > 0 && measure.coverage <= 100);

  const untouched = stats.find(item => item.id === 'tm');
  assert.equal(untouched.attempted, 0);
  assert.equal(untouched.avgMastery, 0);
});

test('topLeverage ranks unattempted, heavily-weighted domains above a weak but lightly-weighted one', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const bank = questions(window);
  const teamMgmt = bank.filter(q => q.sub === 'tm').slice(0, 3);
  const states = {};
  teamMgmt.forEach(question => { states[windowQuestionId(question)] = seedQuestionState(question, timestamp, { mastery: 50, correct: 2, incorrect: 3 }); });
  writeStore(window, { questions: states, attempts: [], sessions: [] });

  const ranked = window.__TBAnalyticsDashboard.topLeverage(timestamp, 9);
  const measureRank = ranked.findIndex(item => item.id === 'mea');
  const teamRank = ranked.findIndex(item => item.id === 'tm');
  assert.ok(measureRank < teamRank, 'Measure (weight 37, 0% attempted => 100% gap) outranks Team Mgmt (weight 18, weak but attempted)');
  assert.equal(ranked[0].leverage, ranked[0].weight * ranked[0].gap);
});

test('readinessSummary delegates to the hardening module rather than recomputing a divergent formula', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const bank = questions(window);
  const states = {};
  bank.slice(0, 10).forEach(question => { states[windowQuestionId(question)] = seedQuestionState(question, timestamp); });
  writeStore(window, { questions: states, attempts: [], sessions: [] });

  const fromAnalytics = window.__TBAnalyticsDashboard.readinessSummary(timestamp);
  const fromHardening = window.__TBAdaptiveHardening.summary(timestamp);
  assert.deepEqual(fromAnalytics, fromHardening);
});

test('readiness is blueprint-weighted domain mastery times coverage, and keeps answer count distinct from unique questions', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const bank = questions(window);
  const question = bank.find(item => item.sub === 'mea');
  const measurePool = bank.filter(item => item.sub === 'mea').length;
  const meta = window.__TB.EXAMS.cssbb.bok.flatMap(domain => domain.subs);
  const totalWeight = meta.reduce((sum, item) => sum + item.w, 0);
  const measureWeight = meta.find(item => item.id === 'mea').w;
  const states = {
    [windowQuestionId(question)]: seedQuestionState(question, timestamp, {
      attempts: 5, correct: 5, incorrect: 0, unanswered: 0, streak: 5, lastSeenAt: timestamp, dueAt: timestamp + 86400000
    })
  };
  writeStore(window, { questions: states, attempts: [], sessions: [] });

  const summary = window.__TBAnalyticsDashboard.readinessSummary(timestamp);
  const expected = Math.round(measureWeight / totalWeight * (1 / measurePool) * 100);
  assert.equal(summary.attemptedMastery, 100, 'mastery is based on the attempted question itself');
  assert.equal(summary.coverage, expected, 'coverage applies the official blueprint weight to the actual pool coverage');
  assert.equal(summary.readiness, expected, 'a 100% result on one Measure question cannot imply broad exam readiness');
  assert.equal(summary.attempted, 1, 'unique attempted questions are shown separately');
  assert.equal(summary.answers, 5, 'total answer events remain available and are not mislabeled as questions seen');
});

test('delivering a whole domain cannot inflate answered coverage or readiness before its questions are answered', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const bank = questions(window);
  const measureQuestions = bank.filter(item => item.sub === 'mea');
  const answered = measureQuestions[0];
  const states = {
    [windowQuestionId(answered)]: seedQuestionState(answered, timestamp, {
      attempts: 5, correct: 5, incorrect: 0, unanswered: 0, streak: 5, lastSeenAt: timestamp, dueAt: timestamp + 86400000
    })
  };
  writeStore(window, { questions: states, attempts: [], sessions: [] });

  /* A full practice/exam start deliberately emits exposure records for all
     selected questions so New-only cannot serve them again. Those records are
     delivery history, not answer evidence. */
  window.__TBLearning = {
    seenQuestionIds: () => measureQuestions.map(windowQuestionId),
    eventsForExam: () => [],
    summary: () => ({ uniqueSeen: measureQuestions.length, answeredEvents: 1, completedSessions: 0, pending: 0 })
  };

  const measure = window.__TBAnalyticsDashboard.domainStats(timestamp).find(item => item.id === 'mea');
  assert.equal(measure.attempted, 1);
  assert.equal(measure.coverage, Math.round(100 / measureQuestions.length), 'domain coverage is one answered item, not every delivered item');

  const meta = window.__TB.EXAMS.cssbb.bok.flatMap(domain => domain.subs);
  const totalWeight = meta.reduce((sum, item) => sum + item.w, 0);
  const measureWeight = meta.find(item => item.id === 'mea').w;
  const expected = Math.round(measureWeight / totalWeight * (1 / measureQuestions.length) * 100);
  const summary = window.__TBAnalyticsDashboard.readinessSummary(timestamp);
  assert.equal(summary.coverage, expected, 'readiness coverage remains based on unique answered questions');
  assert.equal(summary.readiness, expected, 'a single answer cannot become domain-ready merely because a set was delivered');
  assert.equal(window.__TBAnalyticsDashboard.learningSummary(summary).uniqueSeen, measureQuestions.length, 'delivered questions remain visible as a separate metric');
});

test('sessionTrend and studyHeatmap read real attempt history, not fabricated data', async () => {
  const { window } = await load();
  const day = 86400000;
  /* Keep fixture activity safely in the page's trailing window even if the
     host and jsdom realms straddle midnight while this test is running. */
  const now = Date.now() - 3 * day;
  const attempts = [
    { id: 'a1', at: now - 2 * day, source: 'adaptive-practice', total: 10, correct: 6, newQuestions: 3, repeated: 7 },
    { id: 'a2', at: now - day, source: 'quiz', total: 8, correct: 8, newQuestions: 8, repeated: 0 },
    { id: 'a3', at: now, source: 'exam-attempt', total: 20, correct: 15, newQuestions: 5, repeated: 15 }
  ];
  writeStore(window, { questions: {}, attempts: attempts, sessions: [] });

  const trend = window.__TBAnalyticsDashboard.sessionTrend(10);
  assert.equal(trend.length, 3);
  assert.equal(trend[0].pct, 60);
  assert.equal(trend[2].pct, 75);
  assert.equal(trend[2].source, 'exam-attempt');

  /* Two weeks avoids a UTC-midnight boundary between the host test process and
     the page realm while still exercising the trailing activity window. */
  const heat = window.__TBAnalyticsDashboard.studyHeatmap(2);
  assert.equal(heat.length, 14);
  const totalCounted = heat.reduce((sum, d) => sum + d.count, 0);
  assert.equal(totalCounted, 10 + 8 + 20, 'every attempted question across sources is represented in the streak heatmap');
});

test('sessionTrend selects the newest chronological attempts with a deterministic same-time order', async () => {
  const { window } = await load();
  const at = Date.now();
  /* Deliberately use remote arrival order, not chronological order. The two
     equal-time rows have distinct percentages so the ID tie-breaker is
     observable even though the public trend view only exposes chart values. */
  writeStore(window, {
    questions: {},
    attempts: [
      { id: 'late', at: at + 4000, source: 'quick-quiz', total: 4, correct: 4 },
      { id: 'old', at: at + 1000, source: 'quick-quiz', total: 4, correct: 1 },
      { id: 'same-b', at: at + 3000, source: 'quick-quiz', total: 4, correct: 3 },
      { id: 'same-a', at: at + 3000, source: 'quick-quiz', total: 4, correct: 2 }
    ],
    sessions: []
  });

  const trend = window.__TBAnalyticsDashboard.sessionTrend(3);
  assert.deepEqual(trend.map(entry => entry.pct), [50, 75, 100],
    'a late-arriving older attempt cannot displace the true newest three or draw the chart backwards');
  assert.deepEqual(trend.map(entry => entry.at), [at + 3000, at + 3000, at + 4000]);
});

test('studyHeatmap counts submitted answers rather than planned blanks in an attempt', async () => {
  const { window } = await load();
  const at = Date.now() - 3 * 86400000;
  writeStore(window, {
    questions: {},
    attempts: [{ id: 'partial-session', at: at, source: 'exam-attempt', total: 10, answered: 2, correct: 1 }],
    sessions: []
  });

  const day = window.__TBAnalyticsDashboard.studyHeatmap(2).find(entry => entry.count > 0);
  assert.ok(day, 'the recent attempt day is represented in the rolling grid');
  assert.equal(day.count, 2, 'eight unanswered planned items are not presented as study activity');
});

test('examAttemptSeries only counts completed, timed, full-length exam simulations and preserves their attempt IDs', async () => {
  const { window } = await load();
  const now = Date.now();
  const fullLength = window.__TB.EXAMS.cssbb.questions;
  const attempts = [
    { id: 'adaptive', at: now - 7000, source: 'exam-attempt', mode: 'adaptive', timed: true, completed: true, total: fullLength, correct: fullLength },
    { id: 'untimed', at: now - 6000, source: 'exam-attempt', mode: 'exam', timed: false, completed: true, total: fullLength, correct: fullLength },
    { id: 'abandoned', at: now - 5000, source: 'exam-attempt', mode: 'exam', timed: true, completed: false, total: fullLength, correct: fullLength },
    { id: 'short-quiz', at: now - 4000, source: 'exam-attempt', mode: 'exam', timed: true, completed: true, total: 20, correct: 20 },
    { id: 'e1', at: now - 2000, source: 'exam-attempt', mode: 'exam', timed: true, completed: true, total: fullLength, correct: Math.round(fullLength * 0.6) },
    { id: 'e2', at: now - 1000, source: 'exam-attempt', mode: 'exam', timed: true, completed: true, total: fullLength, correct: Math.round(fullLength * 0.8) }
  ];
  writeStore(window, { questions: {}, attempts: attempts, sessions: [] });

  const series = window.__TBAnalyticsDashboard.examAttemptSeries();
  assert.deepEqual(Array.from(series, entry => entry.id), ['e1', 'e2'], 'adaptive, untimed, abandoned, and short quiz sessions are excluded from exam analytics');
  assert.equal(series[0].pct, 60);
  assert.equal(series[0].margin, 60 - 70, 'margin is measured against the exam.pass threshold (70 for CSSBB)');
  assert.equal(series[1].pct, 80);
  assert.equal(series[1].margin, 10);
});

test('latestExamDomainBreakdown reconstructs only the most recent full exam by immutable attempt ID, even when timestamps collide', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const fullLength = window.__TB.EXAMS.cssbb.questions;
  const bank = questions(window);
  const measureQ = bank.find(q => q.sub === 'mea');
  const analyzeQ = bank.find(q => q.sub === 'ana');
  const states = {
    [windowQuestionId(measureQ)]: seedQuestionState(measureQ, timestamp, {
      history: [
        { at: timestamp, status: 'incorrect', source: 'exam-attempt', attemptId: 'e1', priorAttempts: 0, mastery: 40 },
        { at: timestamp, status: 'correct', source: 'exam-attempt', attemptId: 'e2', priorAttempts: 1, mastery: 70 }
      ]
    }),
    [windowQuestionId(analyzeQ)]: seedQuestionState(analyzeQ, timestamp, {
      history: [{ at: timestamp, status: 'incorrect', source: 'exam-attempt', attemptId: 'e2', priorAttempts: 0, mastery: 30 }]
    })
  };
  const attempts = [
    { id: 'e1', at: timestamp, source: 'exam-attempt', mode: 'exam', timed: true, completed: true, total: fullLength, correct: 0 },
    { id: 'e2', at: timestamp + 1, source: 'exam-attempt', mode: 'exam', timed: true, completed: true, total: fullLength, correct: 1 }
  ];
  writeStore(window, { questions: states, attempts: attempts, sessions: [] });

  const breakdown = window.__TBAnalyticsDashboard.latestExamDomainBreakdown();
  const measure = breakdown.find(item => item.id === 'mea');
  const analyze = breakdown.find(item => item.id === 'ana');
  assert.equal(measure.total, 1, 'only the history entry carrying the most recent exam ID counts, not the earlier same-timestamp entry');
  assert.equal(measure.correct, 1);
  assert.equal(analyze.total, 1);
  assert.equal(analyze.correct, 0);
});

test('historic full-exam domains and notebook labels use the answer-time snapshot instead of a later reclassification', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const fullLength = window.__TB.EXAMS.cssbb.questions;
  const historic = questions(window).find(question => question.sub === 'mea');
  const state = seedQuestionState(historic, timestamp, {
    /* Simulate the live taxonomy moving the question after the learner sat
       the exam. The historic answer must remain assigned to Measure. */
    sub: 'ana',
    history: [{
      at: timestamp,
      status: 'incorrect',
      selected: historic.answer === 0 ? 1 : 0,
      source: 'exam-attempt',
      attemptId: 'historic-reclassified-full',
      snapshot: {
        questionId: windowQuestionId(historic), stem: 'Historic Measure wording.', options: historic.options,
        answer: historic.answer, why: 'Historic Measure explanation.', sub: 'mea'
      }
    }]
  });
  writeStore(window, {
    questions: { [windowQuestionId(historic)]: state },
    attempts: [{
      id: 'historic-reclassified-full', at: timestamp, source: 'exam-attempt', mode: 'exam', timed: true,
      completed: true, total: fullLength, correct: 0
    }],
    sessions: []
  });
  window.__TBLearning = { eventsForExam: () => [] };

  const breakdown = window.__TBAnalyticsDashboard.latestExamDomainBreakdown();
  const measure = breakdown.find(item => item.id === 'mea');
  assert.ok(measure, 'legacy full-exam fallback keeps the historic Measure denominator');
  assert.equal(measure.total, 1);
  assert.equal(breakdown.some(item => item.id === 'ana'), false, 'a later taxonomy move cannot rewrite the old score');

  showDashboard(window);
  await settle(window, 4);
  window.document.querySelector('[data-open-notebook]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 1);
  const card = window.document.querySelector('.tb-mistake-card');
  assert.ok(card);
  assert.match(card.textContent, /V\. Measure/, 'the notebook metadata follows the immutable snapshot subtopic too');
  assert.doesNotMatch(card.textContent, /VI\. Analyze/);
});

test('latestExamDomainBreakdown counts an unanswered full-exam item from the immutable completion payload', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const fullLength = window.__TB.EXAMS.cssbb.questions;
  const bank = questions(window);
  const answered = bank.find(q => q.sub === 'mea');
  const blank = bank.filter(q => q.sub === 'mea').find(q => windowQuestionId(q) !== windowQuestionId(answered));
  const states = {
    /* This intentionally looks like the old derived history: only the one
       answered item remains. If the dashboard reads mastery history instead
       of the completion record, it will incorrectly report 1/1 (100%). */
    [windowQuestionId(answered)]: seedQuestionState(answered, timestamp, {
      history: [{ at: timestamp, status: 'correct', source: 'exam-attempt', attemptId: 'full-ledger-1', priorAttempts: 0, mastery: 70 }]
    })
  };
  writeStore(window, {
    questions: states,
    attempts: [{ id: 'full-ledger-1', at: timestamp, source: 'exam-attempt', mode: 'exam', timed: true, completed: true, total: fullLength, correct: 1 }],
    sessions: []
  });
  window.__TBLearning = {
    eventsForExam: () => [{
      id: 'complete-ledger-1', type: 'session_completed', examId: 'cssbb', sessionId: 'full-ledger-1', occurredAt: timestamp,
      payload: {
        mode: 'exam', timed: true, total: fullLength, correct: 1,
        answers: [
          { questionId: windowQuestionId(answered), sub: 'mea', selected: answered.answer, status: 'correct' },
          { questionId: windowQuestionId(blank), sub: 'mea', selected: null, status: 'unanswered' }
        ]
      }
    }]
  };

  const measure = window.__TBAnalyticsDashboard.latestExamDomainBreakdown().find(item => item.id === 'mea');
  assert.ok(measure);
  assert.equal(measure.total, 2, 'the blank full-exam item remains in the domain denominator');
  assert.equal(measure.correct, 1);
  assert.equal(measure.pct, 50, '1 correct plus 1 unanswered is 50%, not 100%');
});

test('latestExamDomainBreakdown keeps the persisted immutable domain denominator after ledger event cache compaction', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const fullLength = window.__TB.EXAMS.cssbb.questions;
  const bank = questions(window);
  const answered = bank.find(q => q.sub === 'mea');
  const states = {
    [windowQuestionId(answered)]: seedQuestionState(answered, timestamp, {
      history: [{ at: timestamp, status: 'correct', source: 'exam-attempt', attemptId: 'trimmed-full-1', priorAttempts: 0, mastery: 70 }]
    })
  };
  writeStore(window, {
    questions: states,
    attempts: [{
      id: 'trimmed-full-1', at: timestamp, source: 'exam-attempt', mode: 'exam', timed: true, completed: true, total: fullLength, correct: 1,
      domainBreakdown: [{ id: 'mea', total: 2, correct: 1, incorrect: 0, unanswered: 1 }]
    }],
    sessions: []
  });
  /* This mimics the bounded local ledger cache after the immutable completion
     event has already been reconciled into the persisted attempt. */
  window.__TBLearning = { eventsForExam: () => [] };

  const measure = window.__TBAnalyticsDashboard.latestExamDomainBreakdown().find(item => item.id === 'mea');
  assert.ok(measure);
  assert.equal(measure.total, 2);
  assert.equal(measure.correct, 1);
  assert.equal(measure.pct, 50, 'the compacted completion event cannot turn 1 correct + 1 blank into 100%');
});

test('scoreBuckets tallies exam scores into the correct histogram bucket', async () => {
  const { window } = await load();
  const series = [{ pct: 45 }, { pct: 58 }, { pct: 65 }, { pct: 72 }, { pct: 88 }, { pct: 95 }, { pct: 71 }];
  const buckets = window.__TBAnalyticsDashboard.scoreBuckets(series);
  assert.deepEqual(Array.from(buckets).map(b => b.count), [1, 1, 1, 2, 1, 1]);
});

function showDashboard(window) {
  const overview = window.document.getElementById('tb-overview');
  overview.innerHTML = '<div class="tb-reshead"></div><section id="tb-feedback-loop"><div id="tb-feedback-live"></div></section>';
}

test('the analytics button appears in the dashboard and opening it renders the readiness tab by default', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  const button = window.document.querySelector('[data-open-analytics]');
  assert.ok(button, 'Full analytics button is injected into the mastery dashboard actions');
  button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const panel = window.document.getElementById('tb-analytics-panel');
  assert.ok(panel && !panel.hidden);
  assert.ok(panel.querySelector('.tb-an-ring'), 'readiness ring renders by default');
  assert.ok(panel.querySelector('.tb-an-radar'), 'domain radar renders on the readiness tab');
});

test('an open radar re-renders immediately when the learning ledger announces new evidence', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const panel = window.document.getElementById('tb-analytics-panel');
  const before = panel.querySelector('.tb-an-radar-mastery').getAttribute('points');
  const timestamp = Date.now();
  const measureQuestions = questions(window).filter(item => item.sub === 'mea').slice(0, 5);
  const states = {};
  measureQuestions.forEach(question => {
    states[windowQuestionId(question)] = seedQuestionState(question, timestamp, {
      attempts: 5, correct: 5, incorrect: 0, streak: 5, lastSeenAt: timestamp
    });
  });
  writeStore(window, {
    questions: states,
    attempts: [], sessions: []
  });
  window.document.dispatchEvent(new window.CustomEvent('tb:learning-updated', { detail: { reason: 'test' } }));
  await settle(window, 4);
  const livePanel = window.document.getElementById('tb-analytics-panel');
  assert.ok(livePanel && !livePanel.hidden, 'an open analytics panel stays open when durable learning data changes');
  const after = livePanel.querySelector('.tb-an-radar-mastery').getAttribute('points');
  assert.notEqual(after, before, 'the dashboard subscribes to durable-learning changes instead of waiting for an unrelated DOM mutation');
});

test('a durable reconciliation refreshes open mastery details, weak topics, improvement, and trend in place', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  const dashboard = window.document.getElementById('tb-adaptive-mastery');
  const panel = window.document.getElementById('tb-adaptive-panel');
  window.document.querySelector('[data-open-mastery-details]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.match(panel.textContent, /Current scope:\s*0 questions attempted/);
  assert.match(dashboard.querySelector('.tb-weak-list').textContent, /Complete an attempt/);
  assert.match(dashboard.querySelector('.tb-trend').textContent, /No attempt history yet/);

  const timestamp = Date.now();
  const question = questions(window).find(item => item.sub === 'mea');
  writeStore(window, {
    questions: {
      [windowQuestionId(question)]: seedQuestionState(question, timestamp, {
        attempts: 1, correct: 0, incorrect: 1, unanswered: 0, streak: 0, mastery: 35,
        lastStatus: 'incorrect', lastSeenAt: timestamp, dueAt: timestamp - 1,
        history: [{ at: timestamp, status: 'incorrect', selected: 1, priorAttempts: 0, source: 'quick-quiz' }]
      })
    },
    attempts: [{ id: 'reconciled-remote-attempt', at: timestamp, source: 'quick-quiz', total: 1, correct: 0 }],
    sessions: []
  });
  window.document.dispatchEvent(new window.CustomEvent('tb:learning-recorded', { detail: { reason: 'remote-reconciliation' } }));
  await settle(window, 4);

  assert.equal(window.document.getElementById('tb-adaptive-mastery'), dashboard, 'an open panel is preserved rather than rebuilt away');
  assert.equal(window.document.getElementById('tb-adaptive-panel'), panel);
  assert.match(panel.textContent, /Current scope:\s*1 questions attempted/, 'open details are live after remote evidence arrives');
  assert.doesNotMatch(dashboard.querySelector('.tb-weak-list').textContent, /Complete an attempt/);
  assert.match(dashboard.querySelector('.tb-weak-list').textContent, /Measure/);
  assert.match(dashboard.querySelector('.tb-improvement').textContent, /1 answers/);
  assert.equal(dashboard.querySelectorAll('.tb-trend i').length, 1, 'the visible trend gains the reconciled attempt without closing details');
});

test('an open dashboard does not replace its own radar forever through its mutation observer', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 3);
  const panel = window.document.getElementById('tb-analytics-panel');
  const radar = panel.querySelector('.tb-an-radar');
  assert.ok(radar, 'radar starts rendered');

  /* The dashboard observes #tb-overview, which includes the panel it draws.
     Its own innerHTML write must not schedule another render every frame. */
  await settle(window, 12);
  assert.equal(panel.querySelector('.tb-an-radar'), radar, 'the radar node stays stable when no learning data changes');
});

test('clicking a tab switches the rendered panel content', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const domainsTab = window.document.querySelector('[data-analytics-tab="domains"]');
  domainsTab.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const panel = window.document.getElementById('tb-analytics-panel');
  assert.ok(panel.querySelector('.tb-an-domain-list'), 'domains tab content is rendered after clicking its tab');
  assert.equal(panel.querySelectorAll('.tb-an-domain-row').length, 9, 'all 9 ASQ BoK subtopics are listed');
});

test('the exam attempts tab shows an empty state until a timed exam has been completed', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  window.document.querySelector('[data-analytics-tab="exam"]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const panel = window.document.getElementById('tb-analytics-panel');
  assert.ok(panel.textContent.includes('have not completed a full timed exam'));
});

test('closing the panel hides and clears it', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  window.document.querySelector('[data-close-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const panel = window.document.getElementById('tb-analytics-panel');
  assert.ok(panel.hidden);
  assert.equal(panel.innerHTML, '');
});

test('edge injection includes the analytics script exactly once, after hardening and before the completion guard', () => {
  const hardeningIndex = edge.indexOf('/test-bank-adaptive-mastery-hardening.js');
  const analyticsIndex = edge.indexOf('/test-bank-analytics-dashboard.js');
  const guardIndex = edge.indexOf('/test-bank-adaptive-mastery-completion-guard.js');
  assert.ok(hardeningIndex > -1 && analyticsIndex > -1 && guardIndex > -1);
  assert.ok(hardeningIndex < analyticsIndex, 'analytics dashboard loads after the hardening module it depends on');
  assert.ok(analyticsIndex < guardIndex, 'analytics dashboard loads before the completion guard');
  assert.equal(edge.indexOf('/test-bank-analytics-dashboard.js', analyticsIndex + 1), -1, 'script is injected only once');
});

test('starting adaptive practice while the analytics panel is open closes it, so the two panels never show at once', async () => {
  const { window } = await load();
  await installDurableLearning(window);
  showDashboard(window);
  await settle(window, 6);

  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  assert.ok(!window.document.getElementById('tb-analytics-panel').hidden, 'analytics panel starts open');

  window.document.querySelector('[data-start-adaptive]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  assert.ok(window.document.getElementById('tb-analytics-panel').hidden, 'analytics panel closes the moment an adaptive session starts');
  assert.ok(!window.document.getElementById('tb-adaptive-panel').hidden, 'the adaptive practice panel it owns is the one left visible');
});

test('opening the mistake notebook or mastery details closes the analytics panel', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);

  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  window.document.querySelector('[data-open-notebook]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  assert.ok(window.document.getElementById('tb-analytics-panel').hidden, 'analytics panel closes when the mistake notebook opens');
  assert.ok(!window.document.getElementById('tb-adaptive-panel').hidden, 'mistake notebook is shown in its own panel');

  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  window.document.querySelector('[data-open-mastery-details]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  assert.ok(window.document.getElementById('tb-analytics-panel').hidden, 'analytics panel closes when mastery details opens');
});

test('completing an adaptive practice session does not leave the analytics panel silently reopened after the dashboard is rebuilt', async () => {
  const { window } = await load();
  await installDurableLearning(window);
  showDashboard(window);
  await settle(window, 6);

  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);

  window.document.querySelector('[data-start-adaptive]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);

  let guard = 0;
  while (guard < 15) {
    guard += 1;
    const adaptivePanel = window.document.getElementById('tb-adaptive-panel');
    if (!adaptivePanel) break;
    const option = adaptivePanel.querySelector('[data-adaptive-opt]');
    if (option) {
      option.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
      await settle(window, 1);
    }
    const check = adaptivePanel.querySelector('[data-adaptive-check]');
    if (check) {
      check.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
      await settle(window, 1);
    }
    const next = adaptivePanel.querySelector('[data-adaptive-next]');
    if (next) {
      next.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
      await settle(window, 2);
    }
    if (!option && !check && !next) break;
  }
  await settle(window, 8);

  const analyticsPanel = window.document.getElementById('tb-analytics-panel');
  if (analyticsPanel) {
    assert.ok(analyticsPanel.hidden, 'refreshDashboard() rebuilding the host element must not resurrect an analytics panel the user closed by navigating away');
  }
});

test('resetting adaptive data (which also destroys and removes #tb-adaptive-mastery) does not leave a phantom analytics panel', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);

  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  assert.ok(!window.document.getElementById('tb-analytics-panel').hidden, 'analytics panel starts open');

  const resetButton = window.document.querySelector('[data-v2-reset]');
  assert.ok(resetButton, 'reset button is present');
  resetButton.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  resetButton.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); // confirm
  await settle(window, 8);

  const analyticsPanel = window.document.getElementById('tb-analytics-panel');
  assert.ok(!analyticsPanel, 'the whole dashboard (including our panel) was removed by reset, and nothing resurrects it silently');
});

test('domains and readiness tabs degrade gracefully instead of showing a confusing blank grid when an exam has no object-style BoK domains', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  window.window.__TB.EXAMS.cssbb.bok = []; // simulate an exam whose BoK data hasn't been authored in the id/weight format yet

  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  let panel = window.document.getElementById('tb-analytics-panel');
  assert.ok(panel.textContent.includes('not available for this exam yet'), 'readiness tab explains the gap instead of rendering an empty radar');
  assert.equal(panel.querySelectorAll('.tb-an-radar').length, 0);

  window.document.querySelector('[data-analytics-tab="domains"]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  panel = window.document.getElementById('tb-analytics-panel');
  assert.ok(panel.textContent.includes('not available for this exam yet'), 'domains tab explains the gap instead of a blank zero-stat grid');
  assert.equal(panel.querySelectorAll('.tb-an-domain-row').length, 0);
});

test('the domains tab describes the real exam length instead of a CSSBB-specific hardcoded number', async () => {
  const { window } = await load();
  const original = window.__TB.EXAMS.cssbb.questions;
  window.__TB.EXAMS.cssbb.questions = 123; // arbitrary, distinct from the real 165, to prove it's read dynamically
  showDashboard(window);
  await settle(window, 6);
  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  window.document.querySelector('[data-analytics-tab="domains"]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const panel = window.document.getElementById('tb-analytics-panel');
  assert.ok(panel.textContent.includes('123-question exam blueprint'), 'reads exam.questions live rather than a hardcoded 165');
  window.__TB.EXAMS.cssbb.questions = original;
});

test('switching to a different exam tile while the analytics panel is open does not leave a phantom panel behind', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);

  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  assert.ok(!window.document.getElementById('tb-analytics-panel').hidden, 'analytics panel starts open on CSSBB');

  const cqeTile = window.document.querySelector('.tb-tile[data-exam="cqe"]');
  assert.ok(cqeTile, 'CQE tile is present in the rail');
  cqeTile.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 8);

  const panelAfterSwitch = window.document.getElementById('tb-analytics-panel');
  if (panelAfterSwitch) {
    assert.ok(panelAfterSwitch.hidden, 'switching exams rebuilds #tb-overview entirely; the old panel must not resurrect on the new exam');
  }
});

test('radar chart does not produce NaN coordinates if a hypothetical exam has all-zero blueprint weights', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const bank = Object.values(window.__TB.EXAMS.cssbb.sets).flat().filter((q, i, arr) => arr.findIndex(x => x.stem === q.stem) === i);
  const originalBok = window.__TB.EXAMS.cssbb.bok;
  window.__TB.EXAMS.cssbb.bok = [{ domain: 'test', weight: 0, subs: [{ id: 'p1', name: 'Zero-weight domain', w: 0 }, { id: 'mea', name: 'Also zero', w: 0 }] }];
  showDashboard(window);
  await settle(window, 6);
  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const panel = window.document.getElementById('tb-analytics-panel');
  assert.ok(!panel.innerHTML.includes('NaN'), 'radar SVG must not render NaN coordinates when every domain weight rounds to 0%');
  window.__TB.EXAMS.cssbb.bok = originalBok;
});

test('radar axis labels carry the full domain name for hover/focus/tap, with a native <title> tooltip as well', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const panel = window.document.getElementById('tb-analytics-panel');
  const axes = panel.querySelectorAll('.tb-an-radar-axis');
  assert.equal(axes.length, 9, 'one hoverable axis group per CSSBB BoK domain');
  const measureAxis = Array.from(axes).find(a => a.getAttribute('data-radar-name') === 'V. Measure');
  assert.ok(measureAxis, 'the Measure axis carries its full BoK name');
  assert.ok(measureAxis.querySelector('title'), 'native SVG title tooltip is present for desktop hover');
  assert.equal(measureAxis.querySelector('title').textContent, 'V. Measure');
  assert.equal(measureAxis.getAttribute('tabindex'), '0', 'axis is keyboard-focusable');
});

test('hovering, focusing, or tapping a radar axis updates the caption with the full name; leaving resets it', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const panel = window.document.getElementById('tb-analytics-panel');
  const caption = panel.querySelector('[data-radar-caption]');
  const defaultText = caption.textContent;
  const measureAxis = Array.from(panel.querySelectorAll('.tb-an-radar-axis')).find(a => a.getAttribute('data-radar-name') === 'V. Measure');

  measureAxis.dispatchEvent(new window.Event('pointerenter'));
  assert.equal(caption.textContent, 'V. Measure', 'hovering the Measure axis shows its full name in the caption');
  measureAxis.dispatchEvent(new window.Event('pointerleave'));
  assert.equal(caption.textContent, defaultText, 'leaving resets the caption to the default prompt');

  measureAxis.dispatchEvent(new window.Event('focus'));
  assert.equal(caption.textContent, 'V. Measure', 'keyboard-focusing the axis also shows its full name');
  measureAxis.dispatchEvent(new window.Event('blur'));
  assert.equal(caption.textContent, defaultText);

  measureAxis.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(caption.textContent, 'V. Measure', 'tapping (click) the axis shows its full name for touch devices without hover');
});

test('switching tabs and back re-wires the radar tooltip listeners on the freshly rendered DOM', async () => {
  const { window } = await load();
  showDashboard(window);
  await settle(window, 6);
  window.document.querySelector('[data-open-analytics]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  window.document.querySelector('[data-analytics-tab="domains"]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  window.document.querySelector('[data-analytics-tab="readiness"]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 2);
  const panel = window.document.getElementById('tb-analytics-panel');
  const caption = panel.querySelector('[data-radar-caption]');
  const analyzeAxis = Array.from(panel.querySelectorAll('.tb-an-radar-axis')).find(a => a.getAttribute('data-radar-name') === 'VI. Analyze');
  analyzeAxis.dispatchEvent(new window.Event('pointerenter'));
  assert.equal(caption.textContent, 'VI. Analyze', 'tooltip listeners work on the re-rendered radar after navigating away and back');
});
