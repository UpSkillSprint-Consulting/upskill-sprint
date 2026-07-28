'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const phase2 = fs.readFileSync(path.join(ROOT, 'test-bank-deep-feedback.js'), 'utf8');
const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (error) {} }));

async function load() {
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  if (!dom.window.Element.prototype.scrollIntoView) dom.window.Element.prototype.scrollIntoView = function () {};
  dom.window.eval(phase2);
  return dom.window;
}

function questions(window) {
  const exam = window.__TB.EXAMS.cssbb;
  const seen = new Set();
  return Object.values(exam.sets || {}).flat().concat(exam.bank || []).filter(question => {
    if (!question || !question.stem || seen.has(question.stem)) return false;
    seen.add(question.stem);
    return true;
  });
}

function plain(window, value) {
  const node = window.document.createElement('div');
  node.innerHTML = String(value || '');
  return node.textContent.replace(/\s+/g, ' ').trim();
}

test('accuracy-count: all three CSSBB sets are in the validation pool', async () => {
  const window = await load();
  assert.equal(questions(window).length, 495);
});

test('accuracy-keypoint: every learning point is a literal excerpt of its stored explanation', async () => {
  const window = await load();
  questions(window).forEach(question => {
    const source = plain(window, question.why);
    const point = window.__TBDeepFeedback.extractKeyPoint(question.why).replace(/…$/, '');
    assert.ok(source.includes(point), question.stem);
  });
});

test('accuracy-distractor: every fallback is explicitly non-speculative', async () => {
  const window = await load();
  questions(window).forEach(question => {
    question.options.forEach((option, index) => {
      if (index === question.answer) return;
      const result = window.__TBDeepFeedback.distractorReason(question, index, null);
      assert.ok(result.text.length > 20, question.stem);
      if (!question.distractors) {
        assert.equal(result.validated, false, question.stem);
        assert.match(result.text, /validated answer and explanation|validated explanation/i, question.stem);
      }
    });
  });
});

test('accuracy-similar: recommended practice never leaves the source subtopic', async () => {
  const window = await load();
  questions(window).forEach(question => {
    window.__TBDeepFeedback.similarCandidates(question, 5).forEach(candidate => {
      assert.equal(candidate.sub, question.sub, question.stem);
      assert.notEqual(candidate.stem, question.stem, question.stem);
    });
  });
});
