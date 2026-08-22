'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const quality = fs.readFileSync(path.join(ROOT, 'test-bank-phase2-quality-assurance.js'), 'utf8');
const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (error) {} }));

async function load() {
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  dom.window.eval(quality);
  return dom.window;
}

function uniqueQuestions(window) {
  const exam = window.__TB.EXAMS.cssbb;
  const seen = new Set();
  return Object.values(exam.sets).flat().filter(question => {
    if (!question || !question.stem || seen.has(question.stem)) return false;
    seen.add(question.stem);
    return true;
  });
}

test('all CSSBB questions receive an explicit feedback quality level', async () => {
  const window = await load();
  const api = window.__TBFeedbackQuality;
  const questions = uniqueQuestions(window);
  assert.equal(questions.length, 1024);
  questions.forEach(question => {
    assert.ok(['expert-reviewed', 'bank-grounded', 'review-required'].includes(api.qualityLevel(question).level));
  });
});

test('expert-reviewed status requires complete review metadata and every distractor rationale', async () => {
  const window = await load();
  const api = window.__TBFeedbackQuality;
  const complete = {
    stem: 'Reviewed question?',
    options: ['Correct', 'Wrong one', 'Wrong two'],
    answer: 0,
    why: 'Correct is supported by the governing rule.',
    sub: 'review',
    reviewSource: 'Approved reference, section 1',
    reviewedBy: 'Qualified reviewer',
    reviewedAt: '2026-07-29',
    keyPoint: 'Use the governing rule.',
    trap: 'Do not reverse the rule.',
    conceptId: 'governing-rule',
    distractors: { 1: 'Wrong one reverses the rule.', 2: 'Wrong two applies an unrelated rule.' }
  };
  assert.equal(api.qualityLevel(complete).level, 'expert-reviewed');
  delete complete.reviewSource;
  assert.equal(api.qualityLevel(complete).level, 'bank-grounded');
});

test('structural defects are never labelled bank-grounded or expert-reviewed', async () => {
  const window = await load();
  const api = window.__TBFeedbackQuality;
  const broken = { stem: 'Broken?', options: ['A', 'A'], answer: 7, why: '', sub: '' };
  const result = api.qualityLevel(broken);
  assert.equal(result.level, 'review-required');
  assert.ok(result.issues.includes('invalid answer index'));
  assert.ok(result.issues.includes('duplicate options'));
  assert.ok(result.issues.includes('missing explanation'));
});

test('bank audit counts every unique CSSBB question and reports valid totals', async () => {
  const window = await load();
  const report = window.__TBFeedbackQuality.audit();
  assert.equal(report.total, 1024);
  assert.equal(report.expertReviewed + report.bankGrounded + report.reviewRequired, report.total);
  assert.ok(report.structurallyValid <= report.total);
});
