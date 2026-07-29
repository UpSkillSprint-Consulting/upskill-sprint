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
  assert.deepEqual(errors, []);
});

test('a completed quiz creates one integrated feedback loop and one mastery dashboard', async () => {
  const { window, errors } = await load();
  const overview = await completeQuick(window);
  assert.equal(overview.querySelectorAll('#tb-feedback-loop').length, 1);
  assert.equal(overview.querySelectorAll('#tb-adaptive-mastery').length, 1);
  assert.ok(overview.querySelector('.tb-quality-audit'));
  assert.ok(overview.querySelector('.tb-mastery-reliability'));
  assert.equal(window.__TBPhaseIntegration.health().ok, true);
  assert.deepEqual(errors, []);
});

test('integrated dashboard and notebook use current effective mastery', async () => {
  const { window } = await load();
  const overview = await completeQuick(window);
  const store = window.__TBAdaptiveMastery.store();
  const data = store.exams.cssbb;
  const state = Object.values(data.questions)[0];
  state.lastSeenAt = Date.now() - 50 * 86400000;
  state.attempts = Math.max(state.attempts, 3);
  state.correct = state.attempts;
  state.streak = 3;
  state.lastStatus = 'correct';
  window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(store));
  window.__TBPhaseIntegration.refresh();
  await settle(window, 3);
  click(window, overview.querySelector('[data-open-notebook]'));
  await settle(window, 2);
  const notebook = overview.querySelector('#tb-adaptive-panel');
  assert.ok(notebook && !notebook.hidden);
  assert.match(notebook.textContent, /Effective mastery is recalculated/);
  assert.ok(notebook.querySelector('.tb-notebook-score b'));
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
