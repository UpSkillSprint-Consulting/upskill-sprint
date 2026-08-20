'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
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
  const exam = window.__TB.EXAMS.cssbb;
  const seen = new Set();
  return Object.values(exam.sets).flat().filter(question => {
    if (!question || !question.stem || seen.has(question.stem)) return false;
    seen.add(question.stem);
    return true;
  });
}

function writeStore(window, examStore) {
  window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({ version: 1, exams: { cssbb: examStore } }));
}

function seedQuestionState(question, timestamp, overrides) {
  const base = {
    id: hash(question.stem), stem: question.stem, sub: question.sub, attempts: 5, correct: 4,
    incorrect: 1, unanswered: 0, streak: 4, ease: 2.3, intervalDays: 4, dueAt: timestamp - 86400000,
    lastSeenAt: timestamp - 86400000, lastStatus: 'correct', mastery: 82, history: []
  };
  return Object.assign(base, overrides || {});
}

test('domainStats merges live pool size and blueprint weight with attempted mastery', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const bank = questions(window);
  const measureQuestions = bank.filter(q => q.sub === 'mea').slice(0, 4);
  const states = {};
  measureQuestions.forEach((question, index) => {
    states[hash(question.stem)] = seedQuestionState(question, timestamp, { mastery: 60 + index });
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
  teamMgmt.forEach(question => { states[hash(question.stem)] = seedQuestionState(question, timestamp, { mastery: 50, correct: 2, incorrect: 3 }); });
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
  bank.slice(0, 10).forEach(question => { states[hash(question.stem)] = seedQuestionState(question, timestamp); });
  writeStore(window, { questions: states, attempts: [], sessions: [] });

  const fromAnalytics = window.__TBAnalyticsDashboard.readinessSummary(timestamp);
  const fromHardening = window.__TBAdaptiveHardening.summary(timestamp);
  assert.deepEqual(fromAnalytics, fromHardening);
});

test('sessionTrend and studyHeatmap read real attempt history, not fabricated data', async () => {
  const { window } = await load();
  const day = 86400000;
  const now = Date.now();
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

  const heat = window.__TBAnalyticsDashboard.studyHeatmap(1);
  assert.equal(heat.length, 7);
  const totalCounted = heat.reduce((sum, d) => sum + d.count, 0);
  assert.equal(totalCounted, 10 + 8 + 20, 'every attempted question across sources is represented in the streak heatmap');
});

test('examAttemptSeries only counts source === exam-attempt and computes margin against the real pass line', async () => {
  const { window } = await load();
  const now = Date.now();
  const attempts = [
    { id: 'q1', at: now - 3000, source: 'adaptive-practice', total: 10, correct: 9 },
    { id: 'e1', at: now - 2000, source: 'exam-attempt', total: 165, correct: 99 },
    { id: 'e2', at: now - 1000, source: 'exam-attempt', total: 165, correct: 132 }
  ];
  writeStore(window, { questions: {}, attempts: attempts, sessions: [] });

  const series = window.__TBAnalyticsDashboard.examAttemptSeries();
  assert.equal(series.length, 2, 'quiz/adaptive sessions are excluded from exam analytics');
  assert.equal(series[0].pct, 60);
  assert.equal(series[0].margin, 60 - 70, 'margin is measured against the exam.pass threshold (70 for CSSBB)');
  assert.equal(series[1].pct, 80);
  assert.equal(series[1].margin, 10);
});

test('latestExamDomainBreakdown reconstructs per-domain results for only the most recent exam, by matching history timestamps', async () => {
  const { window } = await load();
  const timestamp1 = Date.now() - 5000;
  const timestamp2 = Date.now();
  const bank = questions(window);
  const measureQ = bank.find(q => q.sub === 'mea');
  const analyzeQ = bank.find(q => q.sub === 'ana');
  const states = {
    [hash(measureQ.stem)]: seedQuestionState(measureQ, timestamp2, {
      history: [
        { at: timestamp1, status: 'incorrect', source: 'exam-attempt', priorAttempts: 0, mastery: 40 },
        { at: timestamp2, status: 'correct', source: 'exam-attempt', priorAttempts: 1, mastery: 70 }
      ]
    }),
    [hash(analyzeQ.stem)]: seedQuestionState(analyzeQ, timestamp2, {
      history: [{ at: timestamp2, status: 'incorrect', source: 'exam-attempt', priorAttempts: 0, mastery: 30 }]
    })
  };
  const attempts = [
    { id: 'e1', at: timestamp1, source: 'exam-attempt', total: 1, correct: 0 },
    { id: 'e2', at: timestamp2, source: 'exam-attempt', total: 2, correct: 1 }
  ];
  writeStore(window, { questions: states, attempts: attempts, sessions: [] });

  const breakdown = window.__TBAnalyticsDashboard.latestExamDomainBreakdown();
  const measure = breakdown.find(item => item.id === 'mea');
  const analyze = breakdown.find(item => item.id === 'ana');
  assert.equal(measure.total, 1, 'only the history entry matching the most recent exam timestamp counts, not the earlier one');
  assert.equal(measure.correct, 1);
  assert.equal(analyze.total, 1);
  assert.equal(analyze.correct, 0);
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
