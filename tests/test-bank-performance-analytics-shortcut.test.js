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
const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (error) {} }));

function settle(window, frames = 6) {
  return new Promise(resolve => {
    function next(count) {
      if (!count) return resolve();
      window.requestAnimationFrame(() => next(count - 1));
    }
    next(frames);
  });
}

// Seeds a "returning" diagnostic state (matches the shape test-bank.html expects from
// loadState/keyFor: tb-adaptive-<examId>) so diagnosticHTML() renders the readiness card
// with the Performance Analytics button, exactly as a real returning user would see it
// on a fresh page load with no live in-session attempt underway.
//
// test-bank.html's initial renderMain() runs synchronously while the document is still
// parsing, before the window 'load' event fires, so localStorage written afterward needs
// an explicit re-render to be picked up. Clicking a [data-diagtimed] toggle (present on
// both the first-time and returning diagnostic card) calls renderMain() again without
// touching any state this suite cares about.
function seedReturningDiagnostic(window, overrides) {
  const state = Object.assign({
    attempts: 3,
    lastReadiness: 91,
    subState: {}
  }, overrides || {});
  window.localStorage.setItem('tb-adaptive-cssbb', JSON.stringify(state));
  const toggle = window.document.querySelector('[data-diagtimed]');
  if (toggle) toggle.dispatchEvent(new window.Event('click', { bubbles: true }));
}

function seedMasteryStore(window, overrides) {
  const examStore = Object.assign({ questions: {}, attempts: [], sessions: [] }, overrides || {});
  window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({ version: 1, exams: { cssbb: examStore } }));
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
  return { window: dom.window, errors };
}

function click(window, element) {
  assert.ok(element, 'expected clickable element');
  element.dispatchEvent(new window.Event('click', { bubbles: true }));
}

test('a returning user (no live attempt) sees a Performance Analytics button on the diagnostic card', async () => {
  const { window } = await load();
  seedReturningDiagnostic(window);
  window.eval(mastery);
  window.eval(analytics);
  await settle(window);

  const button = window.document.querySelector('[data-perf-analytics]');
  assert.ok(button, 'Performance Analytics button is rendered on the returning diagnostic card');
  assert.equal(button.textContent, 'Performance Analytics');
  assert.ok(!window.document.getElementById('tb-adaptive-mastery'), 'mastery dashboard is not mounted until requested');
});

test('the first-time diagnostic card (no attempts yet) does not show Performance Analytics', async () => {
  const { window } = await load();
  window.eval(mastery);
  window.eval(analytics);
  await settle(window);

  assert.ok(!window.document.querySelector('[data-perf-analytics]'), 'no attempts yet means nothing to analyze');
});

test('clicking Performance Analytics mounts the mastery dashboard from persisted state alone', async () => {
  const { window } = await load();
  seedReturningDiagnostic(window);
  seedMasteryStore(window, {
    questions: {
      q1: { id: 'q1', stem: 'stem', sub: 'mea', attempts: 4, correct: 3, incorrect: 1, mastery: 74, history: [] }
    }
  });
  window.eval(mastery);
  window.eval(analytics);
  await settle(window);

  click(window, window.document.querySelector('[data-perf-analytics]'));
  await settle(window);

  const dashboard = window.document.getElementById('tb-adaptive-mastery');
  assert.ok(dashboard, 'mastery dashboard mounts without any live in-session attempt or results screen');
  assert.ok(!window.document.getElementById('tb-feedback-loop'), 'no post-quiz feedback section exists to depend on');
});

test('clicking Performance Analytics also opens the Full analytics panel in the same click', async () => {
  const { window } = await load();
  seedReturningDiagnostic(window);
  seedMasteryStore(window);
  window.eval(mastery);
  window.eval(analytics);
  await settle(window);

  click(window, window.document.querySelector('[data-perf-analytics]'));
  await settle(window);

  const panel = window.document.getElementById('tb-analytics-panel');
  assert.ok(panel, 'Full analytics panel is created');
  assert.ok(!panel.hidden, 'Full analytics panel is opened automatically, not left for a second click');
  assert.match(panel.textContent, /complete study picture/i);
});

test('clicking Performance Analytics a second time re-uses the existing dashboard instead of duplicating it', async () => {
  const { window } = await load();
  seedReturningDiagnostic(window);
  seedMasteryStore(window);
  window.eval(mastery);
  window.eval(analytics);
  await settle(window);

  const button = window.document.querySelector('[data-perf-analytics]');
  click(window, button);
  await settle(window);
  click(window, button);
  await settle(window);

  assert.equal(window.document.querySelectorAll('#tb-adaptive-mastery').length, 1, 'exactly one mastery dashboard exists');
  assert.equal(window.document.querySelectorAll('#tb-analytics-panel').length, 1, 'exactly one analytics panel exists');
});

test('renderStandalone reads the same persisted mastery data used elsewhere, not a placeholder', async () => {
  const { window } = await load();
  seedMasteryStore(window, {
    questions: {
      q1: { id: 'q1', stem: 'stem', sub: 'mea', attempts: 5, correct: 5, incorrect: 0, mastery: 95, history: [] }
    }
  });
  window.eval(mastery);
  await settle(window);

  const container = window.document.createElement('div');
  window.document.getElementById('tb-overview').appendChild(container);
  const node = window.__TBAdaptiveMastery.renderStandalone(container);

  assert.ok(node, 'returns the mounted node');
  assert.equal(node.id, 'tb-adaptive-mastery');
  assert.equal(container.contains(node), true, 'mounts into the given container');

  const fromApi = window.__TBAdaptiveMastery.summary();
  assert.match(node.textContent, new RegExp(fromApi.overall + '%'), 'displayed mastery matches the real summary, not a stub');
});

test('renderStandalone is idempotent and returns null without a container', async () => {
  const { window } = await load();
  seedMasteryStore(window);
  window.eval(mastery);
  await settle(window);

  assert.equal(window.__TBAdaptiveMastery.renderStandalone(null), null);

  const containerA = window.document.createElement('div');
  const containerB = window.document.createElement('div');
  window.document.getElementById('tb-overview').appendChild(containerA);
  window.document.getElementById('tb-overview').appendChild(containerB);

  const first = window.__TBAdaptiveMastery.renderStandalone(containerA);
  const second = window.__TBAdaptiveMastery.renderStandalone(containerB);
  assert.equal(first, second, 'a second call returns the existing node rather than mounting a duplicate');
  assert.equal(containerB.children.length, 0, 'the already-mounted node is not moved or duplicated into the new container');
});

// --- Persistence across re-renders -----------------------------------------
// renderMain() replaces #tb-overview's innerHTML wholesale on every browse-view render
// (toggling Timed/Untimed, switching Set, switching exams all call it). The diagnostic
// card's own Timed/Untimed toggle sits directly next to Performance Analytics, so this
// is not a rare edge case -- it is the very next click most users would make.

test('toggling Timed/Untimed right after opening analytics does not wipe it out', async () => {
  const { window } = await load();
  seedReturningDiagnostic(window);
  seedMasteryStore(window);
  window.eval(mastery);
  window.eval(analytics);
  await settle(window);

  click(window, window.document.querySelector('[data-perf-analytics]'));
  await settle(window);
  click(window, window.document.querySelector('[data-diagtimed="0"]'));
  await settle(window);

  assert.ok(window.document.getElementById('tb-adaptive-mastery'), 'mastery dashboard survives the very next click in the same card');
  const panel = window.document.getElementById('tb-analytics-panel');
  assert.ok(panel && !panel.hidden, 'Full analytics panel is restored and still open, not left for a second click');
});

test('repeated re-renders while analytics is open never duplicate the mount', async () => {
  const { window } = await load();
  seedReturningDiagnostic(window);
  seedMasteryStore(window);
  window.eval(mastery);
  window.eval(analytics);
  await settle(window);

  click(window, window.document.querySelector('[data-perf-analytics]'));
  await settle(window);
  for (let i = 0; i < 4; i += 1) {
    click(window, window.document.querySelector('[data-diagtimed]'));
    await settle(window);
  }

  assert.equal(window.document.querySelectorAll('#tb-adaptive-mastery').length, 1);
  assert.equal(window.document.querySelectorAll('#tb-analytics-panel').length, 1);
  assert.equal(window.document.querySelectorAll('#tb-analytics-entry').length, 1);
});

test('switching the Set selector while analytics is open restores it for the newly selected set', async () => {
  const { window } = await load();
  seedReturningDiagnostic(window);
  seedMasteryStore(window);
  window.eval(mastery);
  window.eval(analytics);
  await settle(window);

  click(window, window.document.querySelector('[data-perf-analytics]'));
  await settle(window);
  const setBtn = window.document.querySelector('[data-set]');
  if (setBtn) {
    click(window, setBtn);
    await settle(window);
    assert.ok(window.document.getElementById('tb-adaptive-mastery'), 'survives a Set switch');
  }
});

test('resetting adaptive data does not resurrect a zombie analytics panel on the next render', async () => {
  const { window } = await load();
  seedReturningDiagnostic(window);
  seedMasteryStore(window);
  window.eval(mastery);
  window.eval(hardening);
  window.eval(analytics);
  await settle(window);

  click(window, window.document.querySelector('[data-perf-analytics]'));
  await settle(window);
  assert.ok(window.document.getElementById('tb-adaptive-mastery'), 'analytics opened before reset');

  const resetBtn = window.document.querySelector('[data-v2-reset]');
  assert.ok(resetBtn, 'reset button is present inside the mounted dashboard');
  click(window, resetBtn); // arm
  await settle(window);
  click(window, resetBtn); // confirm
  await settle(window);

  assert.ok(!window.document.getElementById('tb-adaptive-mastery'), 'reset removes the panel immediately');
  assert.equal(window.localStorage.getItem('tb-adaptive-cssbb'), null, 'diagnostic state actually cleared, not just the panel');

  // The diag card itself only re-reads state on the next renderMain(); the stale
  // "returning" card's own toggle is what a real user would still see and click.
  click(window, window.document.querySelector('[data-diagtimed]'));
  await settle(window);

  assert.ok(!window.document.querySelector('[data-perf-analytics]'), 'card correctly reverts to the first-time state after re-render');
  assert.ok(!window.document.getElementById('tb-adaptive-mastery'), 'no zombie panel resurrected after reset');
});

test('switching exams while analytics is open does not leak the previous exam data into the new one', async () => {
  const { window } = await load();
  seedReturningDiagnostic(window);
  seedMasteryStore(window);
  window.eval(mastery);
  window.eval(analytics);
  await settle(window);

  click(window, window.document.querySelector('[data-perf-analytics]'));
  await settle(window);
  assert.ok(window.document.getElementById('tb-adaptive-mastery'), 'cssbb analytics mounted');

  const cqeTile = window.document.querySelector('.tb-tile[data-exam="cqe"]');
  assert.ok(cqeTile, 'a second exam tile exists to switch to');
  click(window, cqeTile);
  await settle(window);

  assert.ok(!window.document.querySelector('[data-perf-analytics]'), 'cqe has no returning diagnostic state, so no button');
  assert.ok(!window.document.getElementById('tb-adaptive-mastery'), 'cssbb analytics does not leak onto the cqe view');
});

test('retaking the diagnostic to completion restores analytics with the updated attempt count on return to browse', async () => {
  const { window } = await load();
  seedReturningDiagnostic(window, { attempts: 1, lastReadiness: 40 });
  seedMasteryStore(window);
  window.eval(mastery);
  window.eval(analytics);
  await settle(window);

  click(window, window.document.querySelector('[data-perf-analytics]'));
  await settle(window);
  assert.ok(window.document.getElementById('tb-adaptive-mastery'), 'analytics opened');

  click(window, window.document.querySelector('[data-diag]'));
  await settle(window, 3);
  assert.equal(window.document.getElementById('tb-adaptive-mastery'), null, 'analytics correctly disappears while a live quiz is in progress');

  const navCells = window.document.querySelectorAll('.tb-navcell');
  click(window, navCells[navCells.length - 1]);
  await settle(window);
  click(window, window.document.querySelector('[data-submit]'));
  await settle(window, 8);

  const backBtn = window.document.querySelector('[data-back]');
  assert.ok(backBtn, 'landed on a results screen with a way back to browse');
  click(window, backBtn);
  await settle(window);

  const newState = JSON.parse(window.localStorage.getItem('tb-adaptive-cssbb'));
  assert.equal(newState.attempts, 2, 'the retake actually recorded a new attempt');
  assert.ok(window.document.getElementById('tb-adaptive-mastery'), 'analytics auto-restores with fresh data after the retake, using the flag set before the retake began');
});
