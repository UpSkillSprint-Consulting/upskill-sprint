'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const setControls = fs.readFileSync(path.join(ROOT, 'test-bank-set-controls.js'), 'utf8');
const mastery = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery.js'), 'utf8');

const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (error) {} }));

function settle(window, frames = 6) {
  return new Promise(resolve => {
    function next(remaining) { if (!remaining) return resolve(); window.requestAnimationFrame(() => next(remaining - 1)); }
    next(frames);
  });
}

async function loadPage(withSetControls = true) {
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
  dom.window.eval(mastery);
  if (withSetControls) dom.window.eval(setControls);
  await settle(dom.window);
  return { window: dom.window, errors };
}

function modeCard(window, index) {
  return window.document.querySelectorAll('#tb-overview .tb-mode')[index];
}

function fieldrowLabels(card) {
  return Array.from(card.querySelectorAll('.tb-mode-controls .tb-fieldrow-label')).map(el => el.textContent);
}

test('Quick Quiz renders one labeled row per control group, in order: Set, Questions, Timing, Filters', async () => {
  const { window, errors } = await loadPage();
  const card = modeCard(window, 1);
  const controls = card.querySelector('.tb-mode-controls');
  assert.ok(controls.classList.contains('stacked'), 'uses the stacked layout');
  assert.deepEqual(fieldrowLabels(card), ['Set', 'Questions', 'Timing', 'Filters']);
  assert.deepEqual(errors, []);
});

test('Focused Quiz renders one labeled row per control group, in order: Set, Area, Questions, Timing, Filters', async () => {
  const { window } = await loadPage();
  const card = modeCard(window, 2);
  assert.deepEqual(fieldrowLabels(card), ['Set', 'Area', 'Questions', 'Timing', 'Filters']);
});

test('each fieldrow value cell contains exactly the controls that used to be inline, nothing missing', async () => {
  const { window } = await loadPage();
  const quick = modeCard(window, 1);
  const rows = quick.querySelectorAll('.tb-mode-controls .tb-fieldrow');
  assert.equal(rows.length, 4);

  const [setRow, questionsRow, timingRow, filtersRow] = rows;
  assert.equal(setRow.querySelectorAll('[data-quiz-set="quick"]').length, 4, 'Set row has all 4 set buttons (1/2/3/Mixed)');
  assert.equal(questionsRow.querySelectorAll('[data-count="quick"]').length, 4, 'Questions row has all 4 count options (10/20/30/50)');
  assert.equal(timingRow.querySelectorAll('[data-timing-kind="quick"]').length, 2, 'Timing row has both Timed/Untimed buttons');
  assert.ok(timingRow.querySelector('.tb-ctl-label') === null, 'Timing control no longer renders its own embedded label -- the fieldrow supplies it instead');
  assert.ok(filtersRow.querySelector('[data-unseen="quick"]'), 'Filters row has the New questions only toggle');
  assert.ok(filtersRow.querySelector('[data-missed="quick"]'), 'Filters row has the Missed questions only toggle');
});

test('Full Exam card is untouched -- keeps its original flat layout and embedded Timing label', async () => {
  const { window } = await loadPage();
  const full = modeCard(window, 0);
  const controls = full.querySelector('.tb-mode-controls');
  assert.ok(!controls.classList.contains('stacked'), 'Full Exam does not use the new stacked layout');
  assert.ok(controls.querySelector('.tb-ctl-label'), 'Full Exam\'s Timing control still renders its own embedded label as before');
  assert.equal(controls.querySelectorAll('.tb-fieldrow').length, 0, 'no fieldrow wrappers introduced here');
});

test('all interactive controls keep working after the restructure: Set, Questions, Timing, and both Filter toggles', async () => {
  const { window } = await loadPage();
  const quick = modeCard(window, 1);

  quick.querySelector('[data-count="quick"][data-n="10"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  await settle(window);
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /Random <b>10<\/b> questions|Random 10 questions/);

  modeCard(window, 1).querySelector('[data-timing-kind="quick"][data-timed="1"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  await settle(window);
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /Timed:/);

  modeCard(window, 1).querySelector('[data-unseen="quick"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  await settle(window);
  assert.match(modeCard(window, 1).querySelector('.tb-mode-sum').textContent, /new question|attempted every question/i);

  const setButton = modeCard(window, 1).querySelector('[data-quiz-set="quick"][data-set-value="2"]');
  assert.ok(setButton.disabled, 'Set buttons still correctly disable while New questions only is active');
});

test('without test-bank-set-controls.js loaded, the Questions row is still first (Set row simply never gets injected)', async () => {
  const { window } = await loadPage(false);
  const card = modeCard(window, 1);
  assert.deepEqual(fieldrowLabels(card), ['Questions', 'Timing', 'Filters'], 'gracefully degrades to the core rows when the companion script is absent');
});
