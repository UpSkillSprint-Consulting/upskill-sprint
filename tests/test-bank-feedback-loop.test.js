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

async function submitPartiallyAnsweredQuickQuiz(window) {
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

  return { overview, stem, question, wrong, total: nav.length };
}

test('results add the essential feedback loop with answer-review actions and counts', async () => {
  const { window, errors } = await loadEnhancedPage();
  const { overview, total } = await submitPartiallyAnsweredQuickQuiz(window);

  const feedback = overview.querySelector('#tb-feedback-loop');
  assert.ok(feedback, 'feedback loop is inserted after results');
  assert.ok(feedback.querySelector('[data-open-review="missed"]'), 'primary missed-question review action exists');
  assert.ok(feedback.querySelector('[data-open-review="all"]'), 'review-all action exists');
  assert.ok(feedback.querySelector('[data-retry-missed]'), 'retry-missed action exists');

  const stats = feedback.querySelector('.tb-feedback-stats').textContent;
  assert.match(stats, /incorrect/);
  assert.match(stats, /unanswered/);
  assert.equal(
    Number(feedback.querySelector('[data-review-tab="all"] span').textContent),
    total,
    'all attempted questions are available for review'
  );
  assert.deepEqual(errors, []);
});

test('missed-question review shows the learner answer, correct answer, explanation, and lesson link', async () => {
  const { window } = await loadEnhancedPage();
  const { overview, stem, question } = await submitPartiallyAnsweredQuickQuiz(window);

  click(window, overview.querySelector('[data-open-review="missed"]'));

  const review = overview.querySelector('#tb-answer-review');
  assert.equal(review.hidden, false, 'answer review opens');
  const card = Array.from(review.querySelectorAll('.tb-review-card'))
    .find(item => item.querySelector('.tb-review-stem').textContent.trim() === stem);
  assert.ok(card, 'the missed question appears in review');
  assert.match(card.querySelector('.tb-review-status').textContent, /Incorrect/);
  assert.match(card.querySelector('.tb-answer-compare').textContent, /Your answer/);
  assert.match(card.querySelector('.tb-answer-compare').textContent, /Correct answer/);
  assert.ok(card.querySelector('.tb-explanation-copy').textContent.trim().length > 20, 'explanation is shown');
  assert.ok(card.querySelector('.tb-review-lesson').getAttribute('href').startsWith('/lessons'), 'lesson routing is shown');
  assert.ok(card.textContent.includes(question.options[question.answer]), 'correct option text is visible');
});

test('retry missed questions launches a correction quiz and reveals feedback after checking', async () => {
  const { window } = await loadEnhancedPage();
  const { overview } = await submitPartiallyAnsweredQuickQuiz(window);

  click(window, overview.querySelector('[data-retry-missed]'));
  const panel = overview.querySelector('#tb-retry-panel');
  assert.equal(panel.hidden, false, 'correction quiz opens');
  assert.match(panel.textContent, /Retry missed questions/);

  const retryStem = panel.querySelector('.tb-review-stem').textContent.trim();
  const question = questionByStem(window, retryStem);
  assert.ok(question, 'retry question resolves to the bank');

  click(window, panel.querySelector('[data-retry-opt="' + question.answer + '"]'));
  click(window, panel.querySelector('[data-retry-check]'));

  assert.match(panel.querySelector('.tb-retry-feedback').textContent, /Correct/);
  assert.ok(panel.querySelector('.tb-explanation-copy').textContent.trim().length > 20, 'retry explanation is shown');
});
