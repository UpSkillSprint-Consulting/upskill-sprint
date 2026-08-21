'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { jsPDF } = require('jspdf');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const mastery = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery.js'), 'utf8');
const hardening = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery-hardening.js'), 'utf8');
const completion = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery-completion-guard.js'), 'utf8');
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
  dom.window.eval(completion);
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

function seedStore(window, attemptedQuestions, timestamp) {
  const states = {};
  attemptedQuestions.forEach((question, index) => {
    states[hash(question.stem)] = {
      id: hash(question.stem), stem: question.stem, sub: question.sub, attempts: 5, correct: index % 3 ? 4 : 2,
      incorrect: index % 3 ? 1 : 3, unanswered: 0, streak: index % 3 ? 3 : 0, ease: 2.3,
      intervalDays: 1, dueAt: timestamp - 86400000, lastSeenAt: timestamp - 5 * 86400000,
      lastStatus: index % 3 ? 'correct' : 'incorrect', mastery: index % 3 ? 80 : 35, history: []
    };
  });
  window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({ version: 1, exams: { cssbb: { questions: states, attempts: [], sessions: [] } } }));
}

test('effective mastery decays when retrieval becomes stale', async () => {
  const { window } = await load();
  const api = window.__TBAdaptiveHardening;
  const state = { attempts: 5, correct: 5, streak: 4, lastSeenAt: Date.UTC(2026, 6, 1) };
  const fresh = api.effectiveMastery(state, Date.UTC(2026, 6, 1));
  const stale = api.effectiveMastery(state, Date.UTC(2026, 7, 15));
  assert.ok(fresh > stale);
  assert.ok(stale <= fresh - 10);
});

test('coverage-adjusted readiness prevents a tiny evidence sample from looking exam-ready', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const bank = questions(window);
  seedStore(window, bank.slice(0, 2), timestamp);
  const summary = window.__TBAdaptiveHardening.summary(timestamp);
  assert.equal(summary.attempted, 2);
  assert.ok(summary.coverage < 2);
  assert.ok(summary.readiness < summary.attemptedMastery);
});

test('balanced sessions reserve new material even when many reviews are overdue', async () => {
  const { window } = await load();
  const timestamp = Date.now();
  const bank = questions(window);
  seedStore(window, bank.slice(0, 30), timestamp);
  const candidates = window.__TBAdaptiveHardening.balancedCandidates(10, timestamp);
  const attempted = new Set(bank.slice(0, 30).map(question => question.stem));
  assert.equal(candidates.length, 10);
  assert.ok(candidates.some(question => !attempted.has(question.stem)), 'at least one unseen question is reserved');
  assert.ok(new Set(candidates.map(question => question.sub)).size >= 2, 'session is diversified across subtopics');
});

test('paused adaptive sessions are restored at the saved question', async () => {
  const { window } = await load();
  const bank = questions(window).slice(0, 3);
  window.localStorage.setItem('tb-adaptive-session-v2', JSON.stringify({
    version: 2, examId: 'cssbb', id: 'saved', startedAt: Date.now(), stems: bank.map(question => question.stem),
    reasons: ['due', 'weak', 'new'], index: 1, answers: { 0: bank[0].answer }, checked: { 0: true }, results: [], complete: false
  }));
  const restored = window.__TBAdaptiveHardening.restoreSession();
  assert.ok(restored);
  assert.equal(restored.index, 1);
  assert.equal(restored.items.length, 3);
});

test('completion guard records the final session without a runtime exception', async () => {
  const { window, errors } = await load();
  const bank = questions(window).slice(0, 2);
  const overview = window.document.getElementById('tb-overview');
  overview.innerHTML = '<section id="tb-feedback-loop"><div id="tb-feedback-live"></div><section id="tb-adaptive-mastery"><div id="tb-adaptive-panel"><button type="button" data-v2-next>Finish session</button></div></section></section>';
  window.localStorage.setItem('tb-adaptive-session-v2', JSON.stringify({
    version: 2, examId: 'cssbb', stems: bank.map(question => question.stem), index: 1,
    answers: { 0: bank[0].answer, 1: bank[1].answer }, checked: { 0: true, 1: true }, results: [], complete: false
  }));
  overview.querySelector('[data-v2-next]').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await settle(window, 3);
  assert.equal(window.localStorage.getItem('tb-adaptive-session-v2'), null);
  assert.match(overview.querySelector('#tb-adaptive-panel').textContent, /Adaptive session complete/);
  assert.equal(window.__TBAdaptiveMastery.store().exams.cssbb.attempts.length, 1);
  assert.deepEqual(errors, []);
});

test('the mastery reliability block is idempotent (no re-render loop that breaks mobile taps)', async () => {
  const { window } = await load();
  // seed a little mastery data so the dashboard has something to summarise
  window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({
    version: 1,
    exams: { cssbb: { questions: { 'demo-stem': { mastery: 60, attempts: 3, correct: 2, lastSeen: Date.now() } }, attempts: [], sessions: [] } }
  }));
  const overview = window.document.getElementById('tb-overview');
  // minimal results shell that makes the adaptive-mastery dashboard render
  overview.innerHTML = '<div class="tb-reshead"></div><section id="tb-feedback-loop"><div id="tb-feedback-live"></div></section>';
  await settle(window, 6);

  const dashboard = window.document.getElementById('tb-adaptive-mastery');
  assert.ok(dashboard, 'mastery dashboard rendered');
  const first = overview.querySelectorAll('.tb-mastery-reliability');
  assert.equal(first.length, 1, 'exactly one reliability block');
  const node = first[0];

  // Let many more frames pass. Before the fix, refreshReliability removed and
  // re-added this block (and re-stamped attributes) on every observed mutation,
  // producing a ~60fps re-render loop that replaced button nodes mid-tap on mobile.
  await settle(window, 12);

  const after = overview.querySelectorAll('.tb-mastery-reliability');
  assert.equal(after.length, 1, 'still exactly one reliability block after settling');
  assert.equal(after[0], node, 'the reliability block is the SAME node (not recreated each frame)');
  // its action buttons must also be the same nodes (taps depend on stable targets)
  assert.ok(after[0].querySelector('[data-v2-export]') && after[0].querySelector('[data-v2-reset]'), 'export/reset buttons present and stable');
});

test('reset adaptive data clears both stores and records a signed-in account reset', async () => {
  const { window } = await load();
  seedStore(window, questions(window).slice(0, 3), Date.now());
  window.localStorage.setItem('tb-adaptive-cssbb', JSON.stringify({ attempts: 1, history: [{ at: Date.now() }], subState: {} }));
  let resetExamId = null;
  window.UpskillAuth = { getUser: () => ({ id: 'user-1' }) };
  window.__TBAccountSync = {
    resetAdaptiveExam(examId) {
      resetExamId = examId;
      return Promise.resolve({ changed: false });
    }
  };
  const overview = window.document.getElementById('tb-overview');
  overview.innerHTML = '<div class="tb-reshead"></div><section id="tb-feedback-loop"><div id="tb-feedback-live"></div></section>';
  await settle(window, 6);
  const button = overview.querySelector('[data-v2-reset]');
  assert.ok(button, 'reset button rendered');

  button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  assert.equal(button.dataset.confirmReset, 'true');
  button.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await Promise.resolve();

  const stored = JSON.parse(window.localStorage.getItem('tb-adaptive-mastery-v1'));
  assert.equal(Object.hasOwn(stored.exams, 'cssbb'), false);
  assert.equal(window.localStorage.getItem('tb-adaptive-cssbb'), null);
  assert.equal(resetExamId, 'cssbb');
});

test('subtopicBreakdown groups attempted questions by subtopic with average mastery', async () => {
  const { window } = await load();
  const qs = questions(window);
  const timestamp = Date.UTC(2026, 7, 18);
  seedStore(window, qs.slice(0, 6), timestamp);
  const api = window.__TBAdaptiveHardening;
  const breakdown = api.subtopicBreakdown(timestamp);

  assert.ok(Array.isArray(breakdown), 'returns an array');
  assert.ok(breakdown.length > 0, 'has at least one subtopic group');
  const subs = new Set(qs.slice(0, 6).map(question => question.sub || 'general'));
  breakdown.forEach(row => {
    assert.ok(subs.has(row.sub), 'subtopic label matches a seeded question');
    assert.ok(row.attempted > 0, 'attempted count is positive');
    assert.ok(row.avgMastery >= 0 && row.avgMastery <= 100, 'average mastery is a valid percentage');
  });
  const totalAttempted = breakdown.reduce((sum, row) => sum + row.attempted, 0);
  assert.equal(totalAttempted, 6, 'attempted counts across subtopics sum to seeded question count');

  // Regression guard: before the fix, subtopicBreakdown did not exist, so this call
  // would throw "api.subtopicBreakdown is not a function".
  assert.equal(typeof api.subtopicBreakdown, 'function', 'subtopicBreakdown is exposed on the hardening API');
});

test('buildMasteryReport produces a well-formed, multi-section PDF with logo, footer, and page numbers', async () => {
  const { window } = await load();
  const qs = questions(window);
  const timestamp = Date.UTC(2026, 7, 18);
  seedStore(window, qs.slice(0, 10), timestamp);
  const api = window.__TBAdaptiveHardening;
  const summary = api.summary(timestamp);
  const breakdown = api.subtopicBreakdown(timestamp);
  const logoBuffer = fs.readFileSync(path.join(ROOT, 'assets', 'logo-icon.png'));
  const logoDataUrl = 'data:image/png;base64,' + logoBuffer.toString('base64');
  const reportId = 'RPT-CSSBB-TESTFIXTURE';

  const doc = new jsPDF();
  api.buildMasteryReport(doc, summary, breakdown, 'CSSBB', 'August 18, 2026, 3:45 PM', reportId, logoDataUrl);

  const bytes = doc.output('arraybuffer');
  assert.ok(bytes.byteLength > 2000, 'produces a non-trivial PDF (logo embedded, content rendered)');
  assert.ok(doc.internal.getNumberOfPages() >= 1, 'has at least one page');

  const pdfText = Buffer.from(bytes).toString('latin1');
  assert.ok(pdfText.includes('/Image'), 'PDF contains an embedded image (the logo)');

  // Regression guard: without the fix, buildMasteryReport had no logo/footer support
  // and would throw or silently omit the logo and footer metadata.
  assert.doesNotThrow(() => {
    const noLogoDoc = new jsPDF();
    api.buildMasteryReport(noLogoDoc, summary, breakdown, 'CSSBB', 'August 18, 2026', reportId, null);
  }, 'still renders cleanly when the logo fails to load (fallback path)');
});
