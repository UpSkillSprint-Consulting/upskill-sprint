'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const pageHtml = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const formulaScript = fs.readFileSync(path.join(ROOT, 'test-bank-formulas.js'), 'utf8');
const pmpScript = fs.readFileSync(path.join(ROOT, 'test-bank-pmp-formulas.js'), 'utf8');
const lessonHtml = fs.readFileSync(path.join(ROOT, 'lessons/project-management/pmp-formula-encyclopedia.html'), 'utf8');
const ASQ_NOTE = 'Open-book practice: several ASQ exams allow the official handbook. The skill is finding what you need fast — so practise the lookup under time.';

function encyclopediaFormulas() {
  return JSON.parse(lessonHtml.match(/<script id="pmp-formula-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
}

function build(question) {
  const dom = new JSDOM(`<!doctype html><html><head></head><body>
    <button class="tb-tile active" data-exam="pmp">PMP</button>
    <h1 id="tb-herotitle">PMI Project Management Professional (PMP)</h1>
    <div id="tb-overview">
      <div class="tb-quizprog">Question 1 of 30 · 0 answered</div>
      <div class="tb-qtag">People · Engage stakeholders</div>
      <div class="tb-stem">${question.stem}</div>
      <button type="button" data-formulas>Formulas</button>
    </div>
    <aside id="tb-formulas" aria-label="Formula and reference sheet">
      <input id="tb-refsearch" value="">
      <div id="tb-reflist"></div>
      <p class="tb-refnote">${ASQ_NOTE}</p>
    </aside>
  </body></html>`, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously' });
  dom.window.__TB = {
    REFS: {},
    EXAMS: { pmp: { sets: { 1: [question] }, bok: [] } },
    isExamSessionActive: function (examId) { return examId === 'pmp'; }
  };
  dom.window.eval(formulaScript);
  dom.window.eval(pmpScript);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return dom;
}

test('the exam page loads the PMP formula sheet from the encyclopedia', () => {
  assert.match(pageHtml, /<script defer src="\/test-bank-pmp-formulas\.js"><\/script>/);
  assert.match(pageHtml, /current==='pmp'&&window\.__TB_PMP_FORMULAS/);
  const lesson = encyclopediaFormulas();
  const dom = build({ sub: 'pmp-people', stem: 'A conceptual people prompt.', options: ['A', 'B'], why: 'Net present value would be the wrong signal to read from the solution.' });
  const sheet = dom.window.__TB_PMP_FORMULAS;
  assert.equal(sheet.formulas.length, lesson.length);
  assert.equal(sheet.formulas.length, 24);
  assert.deepEqual(Array.from(sheet.formulas, (item) => String(item.id)), lesson.map((item) => item.id));
  sheet.formulas.forEach((item, index) => {
    assert.equal(item.latex, lesson[index].latex);
    assert.equal(item.title, lesson[index].title);
    assert.equal(item.section, lesson[index].section);
  });
  for (const id of ['PMP-PV', 'PMP-EV', 'PMP-AC', 'PMP-BAC']) {
    assert.equal(sheet.formulas.some((item) => item.id === id), false);
  }
  assert.equal(dom.window.__TB.REFS.pmp.length, 3);
  assert.match(dom.window.__TB.REFS.pmp[0].items[0].f, /Neither guide prints a People formula/i);
  dom.window.close();
});

test('a People question does not paint an empty formula match', () => {
  const dom = build({
    sub: 'pmp-people',
    stem: 'On the Harbor compliance program, the audit liaison wants a weekly note that everything is fine. What should you do?',
    options: ['A', 'B'],
    why: 'Use net present value. The worked value is 1800.'
  });
  dom.window.__TB_PMP_FORMULAS.renderContextualPane('');
  const host = dom.window.document.getElementById('tb-reflist');
  assert.match(host.textContent, /People domain has no calculation/i);
  assert.match(host.textContent, /Recommended for the current question/i);
  assert.equal(host.querySelector('[data-formula-id]'), null);
  assert.doesNotMatch(host.textContent, /No formula matches [“"]\s*[”"]/i);
  assert.doesNotMatch(host.textContent, /net present value/i);
  assert.doesNotMatch(host.textContent, /1800/);
  const link = host.querySelector('a[href*="#section-pe"]');
  assert.equal(link.getAttribute('href'), '/lessons/project-management/pmp-formula-encyclopedia#section-pe');
  assert.equal(link.target, '_blank');
  assert.equal(dom.window.document.querySelector('.tb-refnote').textContent, 'Practice lookup. The real PMP exam does not provide this sheet.');
  dom.window.close();
});

test('a stem that names CPI recommends that card and does not reveal the answer', () => {
  const dom = build({
    sub: 'pmp-process',
    stem: 'The cost performance index is 0.82. What should you do?',
    options: ['A', 'B'],
    why: 'The worked index is 0.82 and that sentence must not appear in the sheet.'
  });
  const typeset = [];
  dom.window.UpskillMath = {
    typeset: function (nodes) {
      typeset.push(nodes[0]);
      return Promise.resolve();
    }
  };
  dom.window.__TB_FORMULAS_TEST__.renderContextualPane('');
  const host = dom.window.document.getElementById('tb-reflist');
  const current = host.querySelector('.is-current');
  assert.equal(current.dataset.formulaId, 'PMP-CPI');
  assert.match(current.querySelector('.tb-fmath').textContent, /\\\[CPI=\\frac\{EV\}\{AC\}\\\]/);
  assert.doesNotMatch(current.textContent, /that sentence must not appear/);
  const link = current.querySelector('a');
  assert.equal(link.target, '_blank');
  assert.equal(link.rel, 'noopener');
  assert.equal(link.getAttribute('href'), '/lessons/project-management/pmp-formula-encyclopedia#formula=PMP-CPI');
  assert.equal(typeset.length, 1);
  assert.equal(typeset[0].id, 'tb-reflist');
  assert.equal(host.querySelectorAll('[data-formula-id="PMP-CPI"]').length, 1);
  dom.window.close();
});

test('total float does not recommend free float, and the answer text is not a signal', () => {
  const dom = build({
    sub: 'pmp-process',
    stem: 'A second path has 3 days of total float. What should you do?',
    why: 'Free float and net present value are named only in this solution.'
  });
  const api = dom.window.__TB_PMP_FORMULAS;
  const picked = api.recommend(dom.window.__TB_FORMULAS_TEST__.getContext().question.stem, api.questionSection({ sub: 'pmp-process' }));
  assert.deepEqual(Array.from(picked, (item) => String(item.id)), ['PMP-TF']);
  const fromSolution = api.recommend(dom.window.__TB_FORMULAS_TEST__.getContext().question.why, api.questionSection({ sub: 'pmp-process' }));
  assert.equal(fromSolution.some((item) => item.id === 'PMP-NPV'), true);
  assert.equal(picked.some((item) => item.id === 'PMP-NPV' || item.id === 'PMP-FF'), false);
  dom.window.close();
});

test('search crosses domains and a miss names the query', () => {
  const dom = build({ sub: 'pmp-people', stem: 'What should you do?', why: 'No formula.' });
  const api = dom.window.__TB_PMP_FORMULAS;
  api.renderContextualPane('payback');
  const host = dom.window.document.getElementById('tb-reflist');
  assert.equal(host.querySelector('[data-formula-id]').dataset.formulaId, 'PMP-PBP');
  assert.match(host.querySelector('[data-formula-id] a').getAttribute('href'), /#formula=PMP-PBP$/);
  api.renderContextualPane('zzzz-no-such-formula');
  assert.match(host.textContent, /No formula matches “zzzz-no-such-formula”/);
  dom.window.close();
});

test('leaving PMP restores the ASQ formula note', () => {
  const dom = build({ sub: 'pmp-process', stem: 'What should you do?' });
  dom.window.__TB_FORMULAS_TEST__.renderContextualPane('');
  const note = dom.window.document.querySelector('.tb-refnote');
  assert.match(note.textContent, /real PMP exam does not provide this sheet/);
  dom.window.document.querySelector('.tb-tile').setAttribute('data-exam', 'cssbb');
  dom.window.__TB_FORMULAS_TEST__.renderContextualPane('');
  assert.equal(note.textContent, ASQ_NOTE);
  dom.window.close();
});
