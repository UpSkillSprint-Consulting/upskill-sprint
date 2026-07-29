'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const hardening = fs.readFileSync(path.join(ROOT, 'test-bank-phase2-hardening.js'), 'utf8');
const reporting = fs.readFileSync(path.join(ROOT, 'test-bank-phase2-reporting.js'), 'utf8');
const formHtml = fs.readFileSync(path.join(ROOT, 'test-bank-report-form.html'), 'utf8');
const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (error) {} }));

async function load() {
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  if (!dom.window.Element.prototype.scrollIntoView) dom.window.Element.prototype.scrollIntoView = function () {};
  dom.window.eval(hardening);
  return dom.window;
}

function questions(window) {
  const exam = window.__TB.EXAMS.cssbb;
  return Object.values(exam.sets).flat();
}

test('key learning points end at a complete stored sentence rather than a character cut', async () => {
  const window = await load();
  const api = window.__TBPhase2Hardening;
  questions(window).forEach(question => {
    const point = api.keyPoint(question);
    const source = window.document.createElement('div');
    source.innerHTML = question.why || '';
    const text = source.textContent.replace(/\s+/g, ' ').trim();
    if (text) {
      assert.ok(text.startsWith(point) || text.includes(point), question.stem);
      assert.ok(!point.endsWith('…'), 'learning point is not mechanically truncated');
    } else {
      assert.match(point, /not available/i);
    }
  });
});

test('fallback option reviews are explicit evidence checks, not claimed expert rationales', async () => {
  const window = await load();
  const api = window.__TBPhase2Hardening;
  const question = questions(window).find(q => !q.distractors);
  const wrong = question.answer === 0 ? 1 : 0;
  const result = api.optionRationale(question, wrong, wrong);
  assert.equal(result.reviewed, false);
  assert.match(result.text, /stored answer key/i);
  assert.match(result.text, /option-specific expert rationale has not been stored/i);
  assert.ok(result.text.includes(question.options[question.answer]));
});

test('test-taking checks distinguish reviewed traps from transparent fallbacks', async () => {
  const window = await load();
  const api = window.__TBPhase2Hardening;
  const reviewed = api.testTakingCheck({ stem: 'Question', trap: 'Do not confuse repeatability with reproducibility.' });
  assert.equal(reviewed.reviewed, true);
  assert.equal(reviewed.title, 'Reviewed exam trap');
  const fallback = api.testTakingCheck({ stem: 'Which option is MOST appropriate?' });
  assert.equal(fallback.reviewed, false);
  assert.equal(fallback.title, 'Stem-reading check');
  assert.match(fallback.text, /MOST/);
});

test('similar-practice labels can distinguish reviewed concept metadata from subtopic fallback', async () => {
  const window = await load();
  const api = window.__TBPhase2Hardening;
  assert.equal(api.conceptId({ sub: 'mea', conceptId: 'gage-rr-repeatability' }), 'gage-rr-repeatability');
  assert.match(api.conceptId({ sub: 'mea', stem: 'Which statistic measures process spread?', why: 'Standard deviation measures spread.' }), /^mea:/);
});

test('the report intake is a Netlify form with a traceable report identifier', () => {
  const dom = new JSDOM(formHtml);
  const form = dom.window.document.querySelector('form[name="test-bank-question-report"][data-netlify="true"]');
  assert.ok(form);
  ['report-id', 'exam', 'issue-type', 'question', 'stored-answer', 'page', 'reviewer-note'].forEach(name => {
    assert.ok(form.querySelector('[name="' + name + '"]'), name + ' field exists');
  });
  assert.match(reporting, /Report received/);
  assert.match(reporting, /Reference/);
  dom.window.close();
});
