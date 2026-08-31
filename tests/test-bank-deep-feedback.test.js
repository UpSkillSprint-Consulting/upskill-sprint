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
const phase1 = fs.readFileSync(path.join(ROOT, 'test-bank-feedback-loop.js'), 'utf8');
const phase2 = fs.readFileSync(path.join(ROOT, 'test-bank-deep-feedback.js'), 'utf8');
const grounding = fs.readFileSync(path.join(ROOT, 'test-bank-deep-feedback-grounding.js'), 'utf8');

const windows = [];
afterEach(() => {
  windows.splice(0).forEach(window => {
    try { window.close(); } catch (error) {}
  });
});

function settle(window, frames = 3) {
  return new Promise(resolve => {
    function next(remaining) {
      if (!remaining) return resolve();
      window.requestAnimationFrame(() => next(remaining - 1));
    }
    next(frames);
  });
}

async function loadPage() {
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
  if (!dom.window.Element.prototype.scrollIntoView) {
    dom.window.Element.prototype.scrollIntoView = function () {};
  }
  await installDurableLearning(dom.window);
  dom.window.eval(phase1);
  dom.window.eval(phase2);
  dom.window.eval(grounding);
  await settle(dom.window);
  return { window: dom.window, errors };
}

async function loadDeepFeedbackOnly() {
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  dom.window.eval(phase2);
  await settle(dom.window, 3);
  return dom.window;
}

function click(window, element) {
  assert.ok(element, 'expected clickable element');
  element.dispatchEvent(new window.Event('click', { bubbles: true }));
}

function allQuestions(window) {
  const exam = window.__TB.EXAMS.cssbb;
  const seen = new Set();
  return Object.values(exam.sets || {}).flat().concat(exam.bank || []).filter(question => {
    if (!question || !question.stem || seen.has(question.stem)) return false;
    seen.add(question.stem);
    return true;
  });
}

function questionByStem(window, stem) {
  return allQuestions(window).find(question => question.stem === stem);
}

function plain(window, htmlText) {
  const node = window.document.createElement('div');
  node.innerHTML = String(htmlText || '');
  return node.textContent.replace(/\s+/g, ' ').trim();
}

async function submitWithOneWrong(window) {
  const overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="quick"]'));
  await settle(window);

  const stem = overview.querySelector('.tb-stem').textContent.trim();
  const question = questionByStem(window, stem);
  const wrong = (question.answer + 1) % question.options.length;
  window.__TBDeepFeedback.recordTimeForQuestion(stem, 42000);
  click(window, overview.querySelector('[data-opt="' + wrong + '"]'));

  const nav = overview.querySelectorAll('.tb-navcell');
  click(window, nav[nav.length - 1]);
  click(window, overview.querySelector('[data-submit]'));
  await settle(window, 5);
  return { overview, stem, question, wrong };
}

async function openMissedReview(window) {
  const data = await submitWithOneWrong(window);
  click(window, data.overview.querySelector('[data-open-review="missed"]'));
  await settle(window, 4);
  const card = Array.from(data.overview.querySelectorAll('.tb-review-card')).find(item => {
    return item.querySelector('.tb-review-stem').textContent.trim() === data.stem;
  });
  assert.ok(card, 'review card for the deliberately missed question exists');
  return { ...data, card };
}

test('Phase 2 adds explanation-grounded learning points, exam traps, time, and transparent distractor analysis', async () => {
  const { window, errors } = await loadPage();
  const { overview, question, card } = await openMissedReview(window);

  assert.ok(overview.querySelector('.tb-phase2-intro'), 'deep-learning introduction is shown');
  assert.match(card.querySelector('.tb-deep-summary').textContent, /4[23] sec/);
  assert.match(card.querySelector('.tb-deep-summary').textContent, /Validated question bank/);

  const keyPoint = card.querySelector('.tb-key-point').textContent.trim();
  const source = plain(window, question.why);
  assert.ok(source.startsWith(keyPoint.replace(/…$/, '')) || source.includes(keyPoint.replace(/…$/, '')), 'key point is extracted from the validated explanation');
  assert.ok(card.querySelector('.tb-exam-trap').textContent.trim().length > 30, 'a conservative exam-trap coaching statement is shown');

  const rows = card.querySelectorAll('.tb-distractor-row');
  assert.equal(rows.length, question.options.length - 1, 'every wrong option is covered');
  assert.match(card.querySelector('.tb-accuracy-note').textContent, /specific distractor explanations are displayed only when stored/i);
  assert.ok(Array.from(rows).some(row => /does not invent|validated option-specific rationale/i.test(row.textContent)), 'distractor feedback is explicitly accuracy-gated');
  assert.deepEqual(errors, []);
});

test('learner error classification is saved and summarized', async () => {
  const { window } = await loadPage();
  const { overview, stem, card } = await openMissedReview(window);
  const select = card.querySelector('[data-error-class]');
  assert.ok(select, 'error-cause selector is available for missed questions');
  select.value = 'similar-concepts';
  select.dispatchEvent(new window.Event('change', { bubbles: true }));

  assert.equal(window.__TBDeepFeedback.classificationValue(stem), 'similar-concepts');
  assert.match(overview.querySelector('#tb-error-summary').textContent, /confused similar concepts/i);
  const stored = JSON.parse(window.localStorage.getItem('tb-error-classifications-v1'));
  assert.ok(Object.values(stored).includes('similar-concepts'), 'classification persists in this browser');
});

test('similar-question practice draws only from the same validated subtopic and excludes the reviewed question', async () => {
  const { window } = await loadPage();
  const { overview, question, card } = await openMissedReview(window);
  const candidates = window.__TBDeepFeedback.similarCandidates(question, 5);
  assert.ok(candidates.length > 0, 'the bank contains same-subtopic practice questions');
  candidates.forEach(candidate => {
    assert.equal(candidate.sub, question.sub);
    assert.notEqual(candidate.stem, question.stem);
  });

  click(window, card.querySelector('[data-practice-similar]'));
  await settle(window, 3);
  const panel = overview.querySelector('#tb-similar-practice');
  assert.equal(panel.hidden, false);
  const practiceStem = panel.querySelector('.tb-review-stem').textContent.trim();
  const practiceQuestion = questionByStem(window, practiceStem);
  assert.equal(practiceQuestion.sub, question.sub, 'displayed practice question is from the same subtopic');

  click(window, panel.querySelector('[data-similar-opt="' + practiceQuestion.answer + '"]'));
  click(window, panel.querySelector('[data-similar-check]'));
  assert.match(panel.querySelector('.tb-similar-feedback').textContent, /Correct/);
  assert.ok(panel.querySelector('.tb-similar-feedback').textContent.includes(plain(window, practiceQuestion.why).slice(0, 25)), 'feedback uses the existing validated explanation');
});

test('question issue reporting prepares a traceable email with the stored answer and question text', async () => {
  const { window } = await loadPage();
  const { question, card } = await openMissedReview(window);
  click(window, card.querySelector('[data-report-question]'));
  const box = card.querySelector('.tb-report-box');
  assert.equal(box.hidden, false);
  box.querySelector('[data-report-type]').value = 'Explanation concern';
  box.querySelector('[data-report-note]').value = 'Please verify the reasoning shown for this item.';
  click(window, box.querySelector('[data-prepare-report]'));
  const link = box.querySelector('[data-report-link]');
  assert.equal(link.hidden, false);
  assert.ok(link.href.startsWith('mailto:skillsprintconsulting@gmail.com'));
  assert.ok(decodeURIComponent(link.href).includes(question.stem));
  assert.ok(decodeURIComponent(link.href).includes(question.options[question.answer]));
});

test('accuracy gate remains grounded across the complete live CSSBB bank', async () => {
  const { window } = await loadPage();
  const api = window.__TBDeepFeedback;
  const questions = allQuestions(window);
  assert.equal(questions.length, 1024, 'all three live CSSBB sets are validated');

  questions.forEach(question => {
    const source = plain(window, question.why);
    const rendered = api.extractKeyPoint(question.why);
    const point = rendered.replace(/…$/, '');
    if (source) assert.ok(source.includes(point), 'key point is drawn from the bank explanation');
    else assert.match(rendered, /not available/i, 'missing explanations are disclosed rather than invented');

    question.options.forEach((option, index) => {
      if (index === question.answer) return;
      const result = api.distractorReason(question, index, null);
      assert.ok(result.text.length > 20);
      if (!question.distractors) {
        assert.equal(result.validated, false);
        assert.match(result.text, /validated answer and explanation|validated explanation/i);
      }
    });

    api.similarCandidates(question, 5).forEach(candidate => {
      assert.equal(candidate.sub, question.sub);
      assert.notEqual(candidate.stem, question.stem);
    });
  });
});

test('deep-feedback summary becomes quiescent after its first render', async () => {
  const window = await loadDeepFeedbackOnly();
  const overview = window.document.getElementById('tb-overview');
  // The phase-two intro marker prevents unrelated header insertion; this
  // isolates the summary write that previously kept its observer alive.
  overview.innerHTML = '<section id="tb-feedback-loop"><div class="tb-phase2-intro"><p id="tb-error-summary"></p></div></section>';
  await settle(window, 6);

  let mutations = 0;
  const observer = new window.MutationObserver(records => { mutations += records.length; });
  observer.observe(overview, { childList: true, subtree: true, characterData: true });
  await settle(window, 8);
  observer.disconnect();

  assert.equal(mutations, 0, 'matching summary text does not continually replace its text node');
});
