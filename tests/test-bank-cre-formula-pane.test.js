'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const pageHtml = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const formulaScript = fs.readFileSync(path.join(ROOT, 'test-bank-formulas.js'), 'utf8');
const creScript = fs.readFileSync(path.join(ROOT, 'test-bank-cre-formulas.js'), 'utf8');
const lessonHtml = fs.readFileSync(path.join(ROOT, 'lessons/quality-engineering/cre-formula-encyclopedia.html'), 'utf8');

function encyclopediaFormulas() {
  return JSON.parse(lessonHtml.match(/<script id="cre-formula-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
}

function build(question) {
  const dom = new JSDOM(`<!doctype html><html><head></head><body>
    <button class="tb-tile active" data-exam="cre">CRE</button>
    <h1 id="tb-herotitle">ASQ Certified Reliability Engineer</h1>
    <div id="tb-overview">
      <div class="tb-quizprog">Question 1 of 20 · 0 answered</div>
      <div class="tb-qtag">Probability and Statistics for Reliability · III. Probability and Statistics for Reliability</div>
      <div class="tb-stem">${question.stem}</div>
      <button type="button" data-formulas>Formulas</button>
    </div>
    <aside id="tb-formulas" aria-label="Formula and reference sheet">
      <input id="tb-refsearch" value="">
      <div id="tb-reflist"></div>
    </aside>
  </body></html>`, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously' });
  dom.window.__TB = {
    REFS: {},
    EXAMS: { cre: { sets: { 1: [question] }, bok: [] } },
    isExamSessionActive: function (examId) { return examId === 'cre'; }
  };
  dom.window.eval(formulaScript);
  dom.window.eval(creScript);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return dom;
}

test('the exam page loads the CRE formula sheet from the encyclopedia', () => {
  assert.match(pageHtml, /<script defer src="\/test-bank-cre-formulas\.js"><\/script>/);
  const lesson = encyclopediaFormulas();
  const dom = build({ sub: 'cre-statistics', stem: 'A conceptual reliability prompt with no named model.', options: ['A', 'B'], why: 'Kaplan-Meier would be the wrong signal to read from the solution.' });
  const sheet = dom.window.__TB_CRE_FORMULAS;
  assert.equal(sheet.formulas.length, lesson.length);
  const ids = [];
  for (const item of sheet.formulas) ids.push(String(item.id));
  assert.deepEqual(ids, lesson.map((item) => item.id));
  assert.equal(dom.window.__TB.REFS.cre.length, 5);
  assert.match(dom.window.__TB.REFS.cre[1].items[0].f, /do not assign equation numbers/i);
  dom.window.close();
});

test('CRE formula cards use handbook LaTeX for MathJax, not a plain-text stand-in', () => {
  const dom = build({
    sub: 'cre-statistics',
    stem: 'Estimate the slope with a two-sided test statistic.',
    options: ['A', 'B'],
    why: 'The slope test is not the answer key.'
  });
  const typeset = [];
  dom.window.UpskillMath = {
    typeset: function (nodes) {
      typeset.push(nodes[0]);
      return Promise.resolve();
    }
  };
  dom.window.__TB_CRE_FORMULAS.renderContextualPane('');
  const card = dom.window.document.querySelector('[data-formula-id="CRE-6.7"] .tb-fmath');
  assert.ok(card);
  assert.match(card.textContent, /\\\[\\begin\{aligned\}/);
  assert.match(card.textContent, /s_\{b_1\}/);
  assert.doesNotMatch(card.textContent, /s_\(b/);
  assert.equal(typeset.length, 1);
  assert.equal(typeset[0].id, 'tb-reflist');
  dom.window.close();
});

test('the open Kaplan-Meier question recommends that card and does not reveal the worked answer', () => {
  const question = {
    sub: 'cre-statistics',
    stem: 'Ten prototype pumps were run on a test stand. Some were removed early for unrelated reasons (suspensions), and the test ended at 800 hours. Using the Kaplan-Meier (product-limit) method, what is the estimated reliability at 750 hours?',
    options: ['0.20', '0.36', '0.405', '0.50'],
    why: 'The worked estimate is 0.36 after the suspensions leave the risk set.',
    answer: 1
  };
  const dom = build(question);
  dom.window.__TB_CRE_FORMULAS.renderContextualPane('');
  const host = dom.window.document.getElementById('tb-reflist');
  const text = host.textContent;
  assert.match(text, /Recommended for the current question/i);
  assert.match(text, /Kaplan-Meier reliability/);
  assert.equal(host.querySelector('.is-current').dataset.formulaId, 'CRE-KM');
  assert.equal(host.querySelectorAll('[data-formula-id="CRE-KM"]').length, 1);
  assert.doesNotMatch(host.querySelector('.is-current').textContent, /0\.36/);
  assert.doesNotMatch(text, /worked estimate/i);
  assert.doesNotMatch(text, /No formula matches [“"]\s*[”"]/i);
  const link = host.querySelector('.is-current a');
  assert.equal(link.target, '_blank');
  assert.equal(link.rel, 'noopener');
  assert.match(link.getAttribute('href'), /#formula=CRE-KM$/);
  dom.window.close();
});

test('a solution that names Kaplan-Meier does not recommend it when the stem does not', () => {
  const dom = build({
    sub: 'cre-statistics',
    stem: 'Estimate the reliability at 750 hours from the pump log.',
    why: 'Use the Kaplan-Meier product-limit method. The answer is 0.36.'
  });
  const picked = dom.window.__TB_CRE_FORMULAS.recommend(dom.window.__TB_FORMULAS_TEST__.getContext().question.stem, { id: 'cre-statistics' });
  assert.equal(picked.some((item) => item.id === 'CRE-KM'), false);
  dom.window.close();
});

test('Set 3 statistics codes and risk questions use the five scored sections', () => {
  const dom = build({
    sub: 'cre-risk',
    stem: 'Which FMEA column records how hard a failure is to detect before it reaches the customer?',
    why: 'Detection is a ranking, not a numbered handbook equation.'
  });
  const api = dom.window.__TB_CRE_FORMULAS;
  assert.equal(api.questionSection({ sub: 'cre-stats' }).id, 'cre-statistics');
  assert.equal(api.questionSection({ sub: 'cre-lead' }).id, 'cre-fundamentals');
  assert.equal(api.questionSection({ sub: 'cre-model', bok: 'IV.B.1' }).id, 'cre-testing');
  assert.equal(api.questionSection({ bok: 'V.A.5' }).id, 'cre-lifecycle');
  api.renderContextualPane('');
  const text = dom.window.document.getElementById('tb-reflist').textContent;
  assert.match(text, /does not assign equation numbers/i);
  assert.equal(dom.window.document.querySelectorAll('#tb-reflist [data-formula-id]').length, 0);
  api.renderContextualPane('weibull');
  const searched = dom.window.document.getElementById('tb-reflist');
  assert.match(searched.textContent, /Weibull distribution/);
  assert.ok(searched.querySelector('[data-formula-id="CRE-WEI"] a').getAttribute('href').includes('#formula=CRE-WEI'));
  dom.window.close();
});
