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
const enhancer = fs.readFileSync(path.join(ROOT, 'test-bank-set-controls.js'), 'utf8');

const windows = [];
afterEach(() => {
  windows.splice(0).forEach(window => {
    try { window.close(); } catch (error) {}
  });
});

function settle(window, frames = 2) {
  return new Promise(resolve => {
    function next(remaining) {
      if (!remaining) return resolve();
      window.requestAnimationFrame(() => next(remaining - 1));
    }
    next(frames);
  });
}

async function loadEnhancedPage() {
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
  await installDurableLearning(dom.window);
  dom.window.eval(enhancer);
  await settle(dom.window);
  return { window: dom.window, errors };
}

function click(window, element) {
  element.dispatchEvent(new window.Event('click', { bubbles: true }));
}

function modeCard(window, index) {
  return window.document.querySelectorAll('#tb-overview .tb-mode')[index];
}

test('Quick and Focused Quiz expose Set 1, Set 2, Set 3, and Mixed controls', async () => {
  const { window, errors } = await loadEnhancedPage();

  const quickLabels = Array.from(modeCard(window, 1).querySelectorAll('[data-quiz-set="quick"]'))
    .map(button => button.textContent.trim());
  const focusLabels = Array.from(modeCard(window, 2).querySelectorAll('[data-quiz-set="focus"]'))
    .map(button => button.textContent.trim());

  assert.deepEqual(quickLabels, ['1', '2', '3', 'Mixed']);
  assert.deepEqual(focusLabels, ['1', '2', '3', 'Mixed']);
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /Set 1/);
  assert.match(modeCard(window, 2).querySelector('.tb-mode-sum').textContent, /Set 1/);
  assert.deepEqual(errors, []);
});

test('entity-containing area names do not create a perpetual summary mutation loop', async () => {
  const { window } = await loadEnhancedPage();
  const summary = modeCard(window, 2).querySelector('.tb-mode-sum');
  assert.match(summary.textContent, /Enterprise & Leadership/);

  let mutations = 0;
  const observer = new window.MutationObserver(items => { mutations += items.length; });
  observer.observe(summary, { childList: true, subtree: true, characterData: true });
  await settle(window, 6);
  observer.disconnect();

  assert.equal(mutations, 0, 'the stable summary is not rewritten on every animation frame');
});

test('a durable-learning browse repaint is enhanced once without recursively observing its own controls', async () => {
  const { window } = await loadEnhancedPage();
  window.document.dispatchEvent(new window.CustomEvent('tb:learning-updated', { detail: { reason: 'test-repaint' } }));
  await new Promise(resolve => window.setTimeout(resolve, 0));
  await settle(window, 6);

  const quick = modeCard(window, 1);
  assert.equal(quick.querySelectorAll('[data-quiz-set="quick"]').length, 4, 'the replacement browse view is enhanced exactly once');
  assert.match(quick.querySelector('.tb-mode-sum').textContent, /Set 1/);
});

test('selecting a Quick Quiz set routes the quiz directly to that question bank', async () => {
  const { window } = await loadEnhancedPage();

  click(window, modeCard(window, 1).querySelector('[data-quiz-set="quick"][data-set-value="2"]'));
  await settle(window);

  assert.ok(window.document.querySelector('.tb-setpick [data-set="2"].on'), 'the source set selector is Set 2');
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /Set 2/);

  click(window, modeCard(window, 1).querySelector('[data-mode="quick"]'));
  const stem = window.document.querySelector('#tb-overview .tb-stem').textContent.trim();
  const set2Stems = new Set(window.__TB.EXAMS.cssbb.sets[2].map(question => question.stem));
  assert.ok(set2Stems.has(stem), 'the displayed question comes from Set 2');
});

test('selecting a Focused Quiz set routes the focused drill directly to that set', async () => {
  const { window } = await loadEnhancedPage();

  click(window, modeCard(window, 2).querySelector('[data-quiz-set="focus"][data-set-value="3"]'));
  await settle(window);

  assert.ok(window.document.querySelector('.tb-setpick [data-set="3"].on'), 'the source set selector is Set 3');
  assert.match(modeCard(window, 2).querySelector('.tb-mode-sum').textContent, /Set 3/);

  click(window, modeCard(window, 2).querySelector('[data-mode="focus"]'));
  const stem = window.document.querySelector('#tb-overview .tb-stem').textContent.trim();
  const set3Stems = new Set(window.__TB.EXAMS.cssbb.sets[3].map(question => question.stem));
  assert.ok(set3Stems.has(stem), 'the displayed focused question comes from Set 3');
});

test('Mixed pools all available sets through the existing simulator engine', async () => {
  const { window } = await loadEnhancedPage();

  click(window, modeCard(window, 1).querySelector('[data-quiz-set="quick"][data-set-value="mix"]'));
  await settle(window);

  assert.ok(window.document.querySelector('.tb-setpick [data-set="mix"].on'));
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /Mixed \(all sets\)/);
  assert.match(modeCard(window, 2).querySelector('.tb-mode-sum').textContent, /Mixed \(all sets\)/);
});
