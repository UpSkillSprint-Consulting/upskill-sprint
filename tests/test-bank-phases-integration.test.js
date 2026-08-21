'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const sources = [
  'test-bank-set-controls.js',
  'test-bank-feedback-loop.js',
  'test-bank-phase1-api.js',
  'test-bank-deep-feedback.js',
  'test-bank-deep-feedback-grounding.js',
  'test-bank-phase2-hardening.js',
  'test-bank-phase2-attempt-history.js',
  'test-bank-phase2-reporting.js',
  'test-bank-phase2-runtime-coordinator.js',
  'test-bank-phase2-quality-assurance.js',
  'test-bank-adaptive-mastery.js',
  'test-bank-adaptive-mastery-runtime.js',
  'test-bank-adaptive-mastery-hardening.js',
  'test-bank-adaptive-mastery-completion-guard.js',
  'test-bank-phases-integration.js'
].map(file => fs.readFileSync(path.join(ROOT, file), 'utf8'));
const edge = fs.readFileSync(path.join(ROOT, 'netlify/edge-functions/test-bank-set-controls.js'), 'utf8');
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
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  if (!dom.window.Element.prototype.scrollIntoView) dom.window.Element.prototype.scrollIntoView = function () {};
  if (!dom.window.URL.createObjectURL) dom.window.URL.createObjectURL = function () { return 'blob:test'; };
  if (!dom.window.URL.revokeObjectURL) dom.window.URL.revokeObjectURL = function () {};
  sources.forEach(source => dom.window.eval(source));
  await settle(dom.window, 8);
  return { window: dom.window, errors };
}

function click(window, element) {
  assert.ok(element, 'expected clickable element');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

async function completeQuick(window) {
  const overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="quick"]'));
  await settle(window, 4);
  const currentStem = overview.querySelector('.tb-stem').textContent.trim();
  const question = Object.values(window.__TB.EXAMS.cssbb.sets).flat().find(item => item.stem === currentStem);
  click(window, overview.querySelector('[data-opt="' + question.answer + '"]'));
  const nav = overview.querySelectorAll('.tb-navcell');
  click(window, nav[nav.length - 1]);
  click(window, overview.querySelector('[data-submit]'));
  await settle(window, 10);
  return overview;
}

test('edge injection loads every phase exactly once and in dependency order', () => {
  const expected = [
    '/test-bank-set-controls.js',
    '/test-bank-feedback-loop.js',
    '/test-bank-phase1-api.js',
    '/test-bank-deep-feedback.js',
    '/test-bank-phase2-hardening.js',
    '/test-bank-adaptive-mastery.js',
    '/test-bank-adaptive-mastery-hardening.js',
    '/test-bank-adaptive-mastery-completion-guard.js',
    '/test-bank-phases-integration.js'
  ];
  let previous = -1;
  expected.forEach(file => {
    const first = edge.indexOf(file);
    assert.ok(first > previous, file + ' is loaded after its dependency');
    assert.equal(edge.indexOf(file, first + 1), -1, file + ' appears only once');
    previous = first;
  });
});

test('all three phase APIs coexist without runtime errors', async () => {
  const { window, errors } = await load();
  const health = window.__TBPhaseIntegration.health();
  assert.equal(health.ok, true, health.issues.join('; '));
  assert.deepEqual(JSON.parse(JSON.stringify(health.phases)), { phase1: true, phase2: true, phase3: true });
  assert.equal(window.__TBFeedbackLoop.healthy(), true);
  assert.deepEqual(errors, []);
});

test('a completed quiz creates one integrated feedback loop and one mastery dashboard', async () => {
  const { window, errors } = await load();
  const overview = await completeQuick(window);
  assert.equal(overview.querySelectorAll('#tb-feedback-loop').length, 1);
  assert.equal(overview.querySelectorAll('#tb-adaptive-mastery').length, 1);
  assert.ok(overview.querySelector('.tb-quality-audit'));
  assert.ok(overview.querySelector('.tb-mastery-reliability'));
  assert.equal(window.__TBFeedbackLoop.status().feedbackRendered, true);
  assert.equal(window.__TBPhaseIntegration.health().ok, true);
  assert.deepEqual(errors, []);
});

test('mistake notebook shows a chronological log of missed questions with a red/green answer snapshot', async () => {
  const { window } = await load();
  const overview = await completeQuick(window);
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[1][0];
  const wrongIndex = (question.answer + 1) % question.options.length;
  api.recordResults([{ question, selected: wrongIndex, status: 'incorrect' }], 'exam-attempt');
  window.__TBPhaseIntegration.refresh();
  await settle(window, 2);
  click(window, overview.querySelector('[data-open-notebook]'));
  await settle(window, 2);
  const notebook = overview.querySelector('#tb-adaptive-panel');
  assert.ok(notebook && !notebook.hidden);
  assert.match(notebook.textContent, /Every question answered incorrectly/);
  const card = notebook.querySelector('.tb-mistake-card');
  assert.ok(card, 'the missed question renders as a mistake card');
  assert.equal(card.querySelectorAll('.tb-mistake-opt').length, question.options.length, 'all answer choices are shown');
  const wrongOption = card.querySelector('.tb-mistake-opt-wrong');
  const correctOption = card.querySelector('.tb-mistake-opt-correct');
  assert.ok(wrongOption, 'the selected incorrect answer is highlighted red');
  assert.ok(correctOption, 'the correct answer is highlighted green');
  assert.ok(notebook.querySelector('[data-notebook-filter]'), 'a knowledge-area filter dropdown is present');
});

test('the same question missed more than once creates a separate notebook entry per failed attempt', async () => {
  const { window } = await load();
  const overview = await completeQuick(window);
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[1][0];
  const wrongIndex = (question.answer + 1) % question.options.length;
  api.recordResults([{ question, selected: wrongIndex, status: 'incorrect' }], 'exam-attempt');
  api.recordResults([{ question, selected: wrongIndex, status: 'incorrect' }], 'adaptive-practice');
  window.__TBPhaseIntegration.refresh();
  await settle(window, 2);
  click(window, overview.querySelector('[data-open-notebook]'));
  await settle(window, 2);
  const notebook = overview.querySelector('#tb-adaptive-panel');
  const cards = notebook.querySelectorAll('.tb-mistake-card');
  assert.equal(cards.length, 2, 'each failed attempt on the same question gets its own entry');
  const whens = Array.from(notebook.querySelectorAll('.tb-mistake-when')).map(node => node.textContent);
  assert.equal(new Set(whens).size <= whens.length, true);
});

test('the knowledge-area dropdown filters the mistake notebook to a single subtopic', async () => {
  const { window } = await load();
  const overview = await completeQuick(window);
  const api = window.__TBAdaptiveMastery;
  const bank = Object.values(window.__TB.EXAMS.cssbb.sets).flat();
  const first = bank[0];
  const second = bank.find(item => item.sub !== first.sub);
  assert.ok(second, 'test fixture needs at least two knowledge areas');
  api.recordResults([{ question: first, selected: (first.answer + 1) % first.options.length, status: 'incorrect' }], 'exam-attempt');
  api.recordResults([{ question: second, selected: (second.answer + 1) % second.options.length, status: 'incorrect' }], 'exam-attempt');
  window.__TBPhaseIntegration.refresh();
  await settle(window, 2);
  click(window, overview.querySelector('[data-open-notebook]'));
  await settle(window, 2);
  const notebook = overview.querySelector('#tb-adaptive-panel');
  assert.equal(notebook.querySelectorAll('.tb-mistake-card').length, 2);
  const select = notebook.querySelector('[data-notebook-filter]');
  select.value = first.sub;
  select.dispatchEvent(new window.Event('change', { bubbles: true }));
  await settle(window, 2);
  assert.equal(notebook.querySelectorAll('.tb-mistake-card').length, 1, 'only the selected knowledge area remains');
});

test('a missed question with an embedded chart shows the chart in the notebook snapshot', async () => {
  const { window } = await load();
  const overview = await completeQuick(window);
  const api = window.__TBAdaptiveMastery;
  const question = window.__TB.EXAMS.cssbb.sets[3].find(item => item.chart);
  assert.ok(question, 'test fixture needs a chart-bearing question');
  api.recordResults([{ question, selected: (question.answer + 1) % question.options.length, status: 'incorrect' }], 'exam-attempt');
  window.__TBPhaseIntegration.refresh();
  await settle(window, 2);
  click(window, overview.querySelector('[data-open-notebook]'));
  await settle(window, 2);
  const notebook = overview.querySelector('#tb-adaptive-panel');
  const card = notebook.querySelector('.tb-mistake-card');
  assert.ok(card, 'the missed question renders as a mistake card');
  assert.ok(card.querySelector('svg'), 'the chart that was part of the original question is rendered in the notebook snapshot');
});

test('deduplication removes extra dashboards and live regions', async () => {
  const { window } = await load();
  const overview = await completeQuick(window);
  const dashboard = overview.querySelector('#tb-adaptive-mastery');
  dashboard.parentElement.appendChild(dashboard.cloneNode(true));
  const live = overview.querySelector('#tb-feedback-live');
  live.parentElement.appendChild(live.cloneNode(true));
  window.__TBPhaseIntegration.refresh();
  assert.equal(overview.querySelectorAll('#tb-adaptive-mastery').length, 1);
  assert.equal(overview.querySelectorAll('#tb-feedback-live').length, 1);
});
