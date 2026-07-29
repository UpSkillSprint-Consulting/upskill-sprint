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

test('adaptive selection prioritizes due and weak questions while including new material', async () => {
  const { window } = await load();
  const api = window.__TBAdaptiveMastery;
  const questions = window.__TB.EXAMS.cssbb.sets[1].slice(0, 4);
  api.recordResults([
    { question: questions[0], selected: (questions[0].answer + 1) % questions[0].options.length, status: 'incorrect' },
    { question: questions[1], selected: questions[1].answer, status: 'correct' }
  ], 'test-seed');
  const candidates = api.adaptiveCandidates(5);
  assert.ok(candidates.length === 5);
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
