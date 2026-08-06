'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const enhancer = fs.readFileSync(path.join(ROOT, 'test-bank-feedback-loop.js'), 'utf8');

const windows = [];
afterEach(() => {
  windows.splice(0).forEach(window => {
    try { window.close(); } catch (error) {}
  });
});

function settle(window) {
  return new Promise(resolve => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
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
  dom.window.eval(enhancer);
  await settle(dom.window);
  return { window: dom.window, errors };
}

function click(window, element) {
  assert.ok(element, 'expected clickable element');
  element.dispatchEvent(new window.Event('click', { bubbles: true }));
}

function questionByStem(window, stem) {
  const exam = window.__TB.EXAMS.cssbb;
  const pools = Object.values(exam.sets || {}).flat().concat(exam.bank || []);
  return pools.find(question => question.stem === stem);
}

// Answer the FIRST question wrong, leave the rest unanswered, then submit.
// This guarantees at least one incorrect and one unanswered record, so the
// grid must be able to render all three statuses.
async function submitOneWrongRestSkipped(window) {
  const overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="quick"]'));
  await settle(window);

  const stem = overview.querySelector('.tb-stem').textContent.trim();
  const question = questionByStem(window, stem);
  assert.ok(question, 'current question resolves to the real bank');

  const wrong = (question.answer + 1) % question.options.length;
  click(window, overview.querySelector('[data-opt="' + wrong + '"]'));

  const nav = overview.querySelectorAll('.tb-navcell');
  click(window, nav[nav.length - 1]);
  click(window, overview.querySelector('[data-submit]'));
  await settle(window);

  return { overview, stem, total: nav.length };
}

test('the live quiz has no review grid before submit (gating)', async () => {
  const { window } = await loadEnhancedPage();
  const overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="quick"]'));
  await settle(window);

  assert.ok(overview.querySelector('.tb-quiz'), 'quiz is active');
  assert.equal(overview.querySelector('#tb-review-grid'), null, 'no review grid renders during the exam');
  assert.equal(overview.querySelector('.tb-review-navcell'), null, 'no colour-coded cells leak mid-exam');
});

test('opening review renders a colour-coded grid cell per question with a status glyph', async () => {
  const { window, errors } = await loadEnhancedPage();
  const { overview, total } = await submitOneWrongRestSkipped(window);

  click(window, overview.querySelector('[data-open-review="all"]'));

  const grid = overview.querySelector('#tb-review-grid');
  assert.ok(grid, 'review grid is present after submit');
  const cells = grid.querySelectorAll('.tb-review-navcell');
  assert.equal(cells.length, total, 'one grid cell per attempted question');

  const GLYPH = { correct: '\u2713', incorrect: '\u2717', unanswered: '\u2013' };
  let seenIncorrect = 0;
  let seenUnanswered = 0;
  cells.forEach(cell => {
    const status = ['correct', 'incorrect', 'unanswered'].find(s => cell.classList.contains(s));
    assert.ok(status, 'every cell carries exactly one status class');
    const glyph = cell.querySelector('.tb-rnc-glyph').textContent;
    assert.equal(glyph, GLYPH[status], status + ' cells show the ' + GLYPH[status] + ' glyph');
    if (status === 'incorrect') seenIncorrect += 1;
    if (status === 'unanswered') seenUnanswered += 1;
  });
  assert.ok(seenIncorrect >= 1, 'the wrong answer is flagged red/incorrect');
  assert.ok(seenUnanswered >= 1, 'skipped questions are flagged yellow/unanswered');
  assert.deepEqual(errors, []);
});

test('clicking a grid cell jumps to that single question and layers the "you are here" marker', async () => {
  const { window } = await loadEnhancedPage();
  const { overview } = await submitOneWrongRestSkipped(window);

  click(window, overview.querySelector('[data-open-review="all"]'));

  // Jump to the incorrect (first) question via its grid cell.
  const targetCell = overview.querySelector('.tb-review-navcell.incorrect');
  assert.ok(targetCell, 'an incorrect cell exists to jump to');
  const targetIndex = Number(targetCell.dataset.reviewGoto);
  click(window, targetCell);

  const list = overview.querySelector('#tb-review-list');
  const cards = list.querySelectorAll('.tb-review-card');
  assert.equal(cards.length, 1, 'jumping shows exactly one question, not a scroll list');
  assert.match(cards[0].querySelector('.tb-review-qno').textContent, new RegExp('Question ' + (targetIndex + 1) + '\\b'));

  // The jumped card marks the options: correct answer and the learner pick.
  assert.ok(cards[0].querySelector('.tb-review-option.is-correct'), 'correct option is marked on the jumped card');

  // "You are here" outline is layered ON TOP of the red status fill (both present).
  const cur = overview.querySelector('.tb-review-navcell.cur');
  assert.ok(cur, 'the jumped cell is marked current');
  assert.equal(Number(cur.dataset.reviewGoto), targetIndex, 'current marker is on the jumped cell');
  assert.ok(cur.classList.contains('incorrect'), 'status colour is retained under the current outline');
});
