'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const phase1 = fs.readFileSync(path.join(ROOT, 'test-bank-feedback-loop.js'), 'utf8');
const phase2 = fs.readFileSync(path.join(ROOT, 'test-bank-deep-feedback.js'), 'utf8');
const history = fs.readFileSync(path.join(ROOT, 'test-bank-phase2-attempt-history.js'), 'utf8');
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
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  if (!dom.window.Element.prototype.scrollIntoView) dom.window.Element.prototype.scrollIntoView = function () {};
  await installDurableLearning(dom.window);
  dom.window.eval(phase1);
  dom.window.eval(phase2);
  dom.window.eval(history);
  await settle(dom.window);
  return dom.window;
}

async function loadHistoryOnly() {
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  dom.window.eval(history);
  await settle(dom.window, 3);
  return dom.window;
}

function click(window, element) {
  assert.ok(element);
  element.dispatchEvent(new window.Event('click', { bubbles: true }));
}

async function completeQuick(window) {
  const overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="quick"]'));
  await settle(window);
  const option = overview.querySelector('[data-opt]');
  click(window, option);
  const nav = overview.querySelectorAll('.tb-navcell');
  click(window, nav[nav.length - 1]);
  click(window, overview.querySelector('[data-submit]'));
  await settle(window, 6);
  return overview;
}

test('each quiz attempt receives a distinct history record', async () => {
  const window = await load();
  const overview = await completeQuick(window);
  const first = window.__TBAttemptHistory.current();
  assert.ok(first && first.id);
  assert.ok(first.completedAt);

  overview.innerHTML = '<div class="tb-quiz"><div class="tb-stem">Synthetic next-attempt question</div></div>';
  await settle(window, 5);
  const second = window.__TBAttemptHistory.current();
  assert.ok(second && second.id);
  assert.notEqual(second.id, first.id);
  assert.equal(second.completedAt, null);
});

test('error causes are stored under the current attempt rather than the question globally', async () => {
  const window = await load();
  const overview = await completeQuick(window);
  click(window, overview.querySelector('[data-open-review="missed"], [data-open-review="all"]'));
  await settle(window, 5);
  const select = overview.querySelector('[data-error-class]');
  if (!select) return;
  select.value = 'calculation';
  select.dispatchEvent(new window.Event('change', { bubbles: true }));
  const current = window.__TBAttemptHistory.current();
  assert.ok(Object.values(current.errors).includes('calculation'));
  const store = window.__TBAttemptHistory.store();
  assert.ok(store.attempts.some(attempt => attempt.id === current.id));
});

test('attempt-history summary becomes quiescent after feedback is synchronized', async () => {
  const window = await loadHistoryOnly();
  const overview = window.document.getElementById('tb-overview');
  // First create the session the history module will later summarize.
  overview.innerHTML = '<div class="tb-quiz"><div class="tb-stem">Synthetic question</div></div>';
  await settle(window, 4);
  overview.innerHTML = '<section id="tb-feedback-loop"><p id="tb-error-summary"></p></section>';
  await settle(window, 6);

  let mutations = 0;
  const observer = new window.MutationObserver(records => { mutations += records.length; });
  observer.observe(overview, { childList: true, subtree: true, characterData: true });
  await settle(window, 8);
  observer.disconnect();

  assert.equal(mutations, 0, 'unchanged summary text does not re-schedule the history observer');
});
