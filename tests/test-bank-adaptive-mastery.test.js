'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const phase1 = fs.readFileSync(path.join(ROOT, 'test-bank-feedback-loop.js'), 'utf8');
const mastery = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery.js'), 'utf8');
const runtime = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery-runtime.js'), 'utf8');
const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (error) {} }));

function settle(window, frames = 5) {
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
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  if (!dom.window.Element.prototype.scrollIntoView) dom.window.Element.prototype.scrollIntoView = function () {};
  dom.window.eval(phase1);
  dom.window.eval(mastery);
  dom.window.eval(runtime);
  await settle(dom.window);
  return { window: dom.window, errors };
}

function click(window, element) {
  assert.ok(element, 'expected clickable element');
  element.dispatchEvent(new window.Event('click', { bubbles: true }));
}

async function completeQuick(window) {
  const overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="quick"]'));
  await settle(window, 3);
  const currentQuestion = window.__TB.EXAMS.cssbb.sets[1].find(question => question.stem === overview.querySelector('.tb-stem').textContent.trim());
  click(window, overview.querySelector('[data-opt="' + currentQuestion.answer + '"]'));
  const nav = overview.querySelectorAll('.tb-navcell');
  click(window, nav[nav.length - 1]);
  click(window, overview.querySelector('[data-submit]'));
  await settle(window, 7);
  return overview;
}

test('mastery increases with repeated correct retrieval and schedules expanding intervals', async () => {
  const { window } = await load();
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[1][0];
  const state = {
    id: 'q', stem: question.stem, sub: question.sub, attempts: 0, correct: 0, incorrect: 0, unanswered: 0,
    streak: 0, ease: 2.3, intervalDays: 0, dueAt: 0, lastSeenAt: 0, lastStatus: 'new', mastery: 0, history: []
  };
  const t0 = Date.UTC(2026, 6, 29);
  api.applyResult(state, question, 'correct', question.answer, 'test', t0);
  const firstMastery = state.mastery;
  assert.equal(state.intervalDays, 1);
  api.applyResult(state, question, 'correct', question.answer, 'test', t0 + 86400000);
  assert.ok(state.mastery > firstMastery);
  assert.equal(state.intervalDays, 3);
  api.applyResult(state, question, 'correct', question.answer, 'test', t0 + 4 * 86400000);
  assert.ok(state.intervalDays >= 4);
  assert.equal(state.streak, 3);
});

test('an incorrect answer resets the success streak and schedules near-term review', async () => {
  const { window } = await load();
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[1][0];
  const state = {
    id: 'q', stem: question.stem, sub: question.sub, attempts: 3, correct: 3, incorrect: 0, unanswered: 0,
    streak: 3, ease: 2.45, intervalDays: 7, dueAt: 0, lastSeenAt: Date.UTC(2026, 6, 28), lastStatus: 'correct', mastery: 80, history: []
  };
  const timestamp = Date.UTC(2026, 6, 29);
  api.applyResult(state, question, 'incorrect', 0, 'test', timestamp);
  assert.equal(state.streak, 0);
  assert.equal(state.intervalDays, 1);
  assert.equal(state.dueAt, timestamp + 86400000);
  assert.equal(state.lastStatus, 'incorrect');
});

test('recording a new answer migrates legacy aggregates without losing older correct attempts', async () => {
  const { window } = await load();
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[1][0];
  const timestamp = Date.UTC(2026, 6, 29);
  const history = [];
  for (let index = 0; index < 40; index += 1) history.push({ at: timestamp - 100 + index, status: 'correct' });
  for (let index = 0; index < 60; index += 1) history.push({ at: timestamp - 60 + index, status: 'incorrect' });
  const state = {
    id: 'legacy-q', stem: question.stem, sub: question.sub,
    attempts: 160, correct: 100, incorrect: 60, unanswered: 0,
    streak: 0, ease: 2.3, intervalDays: 1, dueAt: timestamp,
    lastSeenAt: timestamp - 1, lastStatus: 'incorrect', mastery: 54, history
  };

  api.applyResult(state, question, 'correct', question.answer, 'test', timestamp);

  assert.equal(state.masteryBaseline.attempts, 160);
  assert.equal(state.masteryHistory.length, 1);
  assert.match(state.masteryHistory[0].id, /^mastery-/);
  assert.equal(state.attempts, 161);
  assert.equal(state.correct, 101);
  assert.equal(state.incorrect, 60);
  assert.equal(state.streak, 1);
});

test('mastery evidence compaction preserves exact counters and trailing streak state', async () => {
  const { window } = await load();
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[1][0];
  const state = {
    id: 'q', stem: question.stem, sub: question.sub, attempts: 0, correct: 0, incorrect: 0, unanswered: 0,
    streak: 0, ease: 2.3, intervalDays: 0, dueAt: 0, lastSeenAt: 0, lastStatus: 'new', mastery: 0,
    history: [], masteryBaseline: {
      at: 0, firstSeenAt: 0, attempts: 0, correct: 0, incorrect: 0, unanswered: 0,
      streak: 0, lastSeenAt: 0, lastStatus: 'new'
    }, masteryHistory: []
  };
  const startedAt = Date.UTC(2026, 0, 1);
  for (let index = 0; index < 520; index += 1) {
    const status = index % 2 === 0 ? 'correct' : 'incorrect';
    api.applyResult(state, question, status, status === 'correct' ? question.answer : (question.answer + 1) % question.options.length, 'stress', startedAt + index);
  }
  assert.equal(state.masteryBaseline.attempts, 20);
  assert.equal(state.masteryHistory.length, 500);
  assert.equal(state.attempts, 520);
  assert.equal(state.correct, 260);
  assert.equal(state.incorrect, 260);
  assert.equal(state.streak, 0);
  assert.equal(state.lastStatus, 'incorrect');
});

test('adaptive selection prioritizes due and weak questions while including new material', async () => {
  const { window } = await load();
  const api = window.__TBAdaptiveMastery;
  const questions = window.__TB.EXAMS.cssbb.sets[1].slice(0, 4);
  api.recordResults([
    { question: questions[0], selected: (questions[0].answer + 1) % questions[0].options.length, status: 'incorrect' },
    { question: questions[1], selected: questions[1].answer, status: 'correct' }
  ], 'test-seed');
  const candidates = api.adaptiveCandidates(5);
  assert.equal(candidates.length, 5);
  assert.equal(candidates[0].stem, questions[0].stem, 'the weakest attempted item is prioritized');
  assert.ok(candidates.some(question => ![questions[0].stem, questions[1].stem].includes(question.stem)), 'new questions are included');
});

test('completed attempts create the adaptive dashboard, history, and mastery map', async () => {
  const { window, errors } = await load();
  const overview = await completeQuick(window);
  const dashboard = overview.querySelector('#tb-adaptive-mastery');
  assert.ok(dashboard);
  assert.match(dashboard.textContent, /Adaptive mastery/);
  assert.ok(dashboard.querySelector('[data-start-adaptive]'));
  assert.ok(dashboard.querySelector('[data-open-notebook]'));
  const store = window.__TBAdaptiveMastery.store();
  const exam = store.exams.cssbb;
  assert.ok(exam.attempts.length >= 1);
  assert.ok(Object.keys(exam.questions).length >= 1);
  assert.deepEqual(errors, []);
});

test('adaptive practice updates repeated-question improvement and the mistake notebook', async () => {
  const { window } = await load();
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[1][0];
  api.recordResults([{ question, selected: (question.answer + 1) % question.options.length, status: 'incorrect' }], 'first');
  api.recordResults([{ question, selected: question.answer, status: 'correct' }], 'repeat');
  const improvement = api.improvement();
  assert.equal(improvement.firstTotal, 1);
  assert.equal(improvement.repeatTotal, 1);
  assert.equal(improvement.first, 0);
  assert.equal(improvement.repeat, 100);
  const summary = api.summary();
  assert.equal(summary.attempted, 1);
  assert.ok(summary.notebook >= 1, 'item remains in notebook until sustained mastery is reached');
});

test('improvement metrics use the balanced mastery ledger after notebook history trims old correct answers', async () => {
  const { window } = await load();
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[1][0];
  for (let index = 0; index < 50; index += 1) {
    api.recordResults([{ question, selected: question.answer, status: 'correct' }], 'evidence-test');
  }
  const state = Object.values(api.store().exams.cssbb.questions).find(candidate => candidate.stem === question.stem);
  assert.equal(state.history.length, 40, 'the notebook archive keeps its bounded non-error snapshot');
  assert.equal(state.masteryHistory.length, 50, 'mastery evidence retains every status symmetrically');
  const improvement = api.improvement();
  assert.equal(improvement.firstTotal, 1);
  assert.equal(improvement.repeatTotal, 49);
  assert.equal(improvement.first, 100);
  assert.equal(improvement.repeat, 100);
});

test('adaptive completion remains visible after the dashboard refreshes', async () => {
  const { window } = await load();
  const overview = await completeQuick(window);
  click(window, overview.querySelector('[data-start-adaptive]'));
  await settle(window, 3);
  let panel = overview.querySelector('#tb-adaptive-panel');
  for (let index = 0; index < 10; index += 1) {
    const stem = panel.querySelector('.tb-adaptive-stem').textContent.trim();
    const item = Object.values(window.__TB.EXAMS.cssbb.sets).flat().find(candidate => candidate.stem === stem);
    click(window, panel.querySelector('[data-adaptive-opt="' + item.answer + '"]'));
    click(window, panel.querySelector('[data-adaptive-check]'));
    await settle(window, 2);
    click(window, panel.querySelector('[data-adaptive-next]'));
    await settle(window, 3);
    panel = overview.querySelector('#tb-adaptive-panel');
    if (/Adaptive session complete/i.test(panel.textContent)) break;
  }
  assert.equal(panel.hidden, false);
  assert.match(panel.textContent, /Adaptive session complete/);
  assert.match(panel.textContent, /mastery map has been updated/i);
});

test('the mistake notebook renders a chronological, filterable log of every incorrect attempt with a red/green snapshot', async () => {
  const { window } = await load();
  const overview = await completeQuick(window);
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[1][0];
  const wrongIndex = (question.answer + 1) % question.options.length;
  api.recordResults([{ question, selected: wrongIndex, status: 'incorrect' }], 'exam-attempt');
  api.recordResults([{ question, selected: wrongIndex, status: 'incorrect' }], 'adaptive-practice');
  click(window, overview.querySelector('[data-open-notebook]'));
  await settle(window, 2);
  const notebook = overview.querySelector('#tb-adaptive-panel');
  assert.ok(notebook && !notebook.hidden);
  const cards = notebook.querySelectorAll('.tb-mistake-card');
  assert.equal(cards.length, 2, 'each failed attempt gets its own chronological entry');
  assert.ok(cards[0].querySelector('.tb-mistake-opt-wrong'), 'selected wrong answer is highlighted red');
  assert.ok(cards[0].querySelector('.tb-mistake-opt-correct'), 'correct answer is highlighted green');
  assert.equal(cards[0].querySelectorAll('.tb-mistake-opt').length, question.options.length);
  assert.ok(notebook.querySelector('[data-notebook-filter]'), 'knowledge-area filter dropdown is present');
});

test('the "why" explanation renders its authored inline HTML instead of showing raw tags', async () => {
  const { window } = await load();
  const overview = await completeQuick(window);
  const api = window.__TBAdaptiveMastery;
  const bank = Object.values(window.__TB.EXAMS.cssbb.sets).flat();
  const question = bank.find(item => item.why && /<[a-z]+>/i.test(item.why));
  assert.ok(question, 'test fixture needs a question whose explanation contains inline HTML markup');
  api.recordResults([{ question, selected: (question.answer + 1) % question.options.length, status: 'incorrect' }], 'exam-attempt');
  click(window, overview.querySelector('[data-open-notebook]'));
  await settle(window, 2);
  const notebook = overview.querySelector('#tb-adaptive-panel');
  const why = notebook.querySelector('.tb-mistake-why');
  assert.ok(why, 'the why block is rendered');
  assert.doesNotMatch(why.textContent, /<[a-z]+>/i, 'the authored emphasis tag renders as markup, not literal visible text');
});

test('every incorrect attempt on a question is retained for the notebook, not truncated by the history cap', async () => {
  const { window } = await load();
  await completeQuick(window);
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[1][1];
  const wrongIndex = (question.answer + 1) % question.options.length;
  for (let index = 0; index < 35; index += 1) {
    api.recordResults([{ question, selected: wrongIndex, status: 'incorrect' }], 'exam-attempt');
  }
  const store = api.store();
  const state = Object.values(store.exams.cssbb.questions).find(candidate => candidate.stem === question.stem);
  const incorrectEntries = state.history.filter(entry => entry.status === 'incorrect');
  assert.equal(incorrectEntries.length, 35, 'no incorrect attempt is dropped once the count exceeds the old 30-entry cap');
});
