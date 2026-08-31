'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const pageHtml = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const formulaScript = fs.readFileSync(path.join(ROOT, 'test-bank-formulas.js'), 'utf8');
const windows = [];

afterEach(() => {
  windows.splice(0).forEach(window => {
    try { window.close(); } catch (error) {}
  });
});

function wait(window, ms = 55) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

function click(window, element, message = 'expected clickable element') {
  assert.ok(element, message);
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

async function loadPage() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(pageHtml, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  windows.push(dom.window);
  dom.window.eval(formulaScript);
  if (dom.window.document.readyState !== 'complete') {
    await new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true }));
  }
  await installDurableLearning(dom.window);
  await wait(dom.window);
  return { window: dom.window, document: dom.window.document, errors };
}

function selectExam(window, document, examId) {
  click(window, document.querySelector(`.tb-tile[data-exam="${examId}"]`));
  assert.equal(document.querySelector('.tb-tile.active').dataset.exam, examId);
}

function selectSet(window, document, set) {
  click(window, document.querySelector(`[data-set="${set}"]`));
  assert.ok(document.querySelector(`[data-set="${set}"].on`));
}

async function openPane(window, document) {
  click(window, document.querySelector('[data-formulas]'));
  await wait(window);
  const drawer = document.getElementById('tb-formulas');
  const list = document.getElementById('tb-reflist');
  assert.ok(drawer && !drawer.hidden, 'formula drawer opens');
  assert.ok(list && list.textContent.trim(), 'formula drawer contains content');
  return { drawer, list };
}

test('CQE formula pane works in timed and untimed full-exam sessions', async () => {
  for (const scenario of [
    { set: '1', timed: true },
    { set: '3', timed: false },
    { set: 'mix', timed: false }
  ]) {
    const { window, document, errors } = await loadPage();
    selectExam(window, document, 'cqe');
    selectSet(window, document, scenario.set);
    if (!scenario.timed) click(window, document.querySelector('[data-timed="0"]'));
    click(window, document.querySelector('[data-mode="full"]'));

    assert.ok(document.querySelector('.tb-quiz'), `${scenario.set}: full exam starts`);
    assert.equal(document.querySelectorAll('.tb-navcell').length, 160, `${scenario.set}: full exam has 160 questions`);
    const { list } = await openPane(window, document);
    assert.match(list.textContent, /Recommended for the current question/i);
    assert.match(list.querySelector('.tb-fcontextbar').textContent, /Exam Set [123]/i);
    assert.doesNotMatch(list.textContent, /No formula matches [“"]\s*[”"]/i);
    assert.deepEqual(errors, [], `${scenario.set}: no jsdom runtime errors`);

    window.close();
    windows.splice(windows.indexOf(window), 1);
  }
});

test('CQE formula pane works in the placement diagnostic', async () => {
  const { window, document, errors } = await loadPage();
  selectExam(window, document, 'cqe');
  selectSet(window, document, '2');
  click(window, document.querySelector('[data-diagtimed="0"]'));
  click(window, document.querySelector('[data-diag]'));

  assert.ok(document.querySelector('.tb-quiz'), 'diagnostic starts');
  const count = document.querySelectorAll('.tb-navcell').length;
  assert.ok(count >= 7 && count <= 20, `diagnostic is stratified and short; got ${count}`);
  const { list } = await openPane(window, document);
  assert.match(list.textContent, /Recommended for the current question/i);
  assert.match(list.querySelector('.tb-fcontextbar').textContent, /Exam Set 2/i);
  assert.deepEqual(errors, [], 'no jsdom runtime errors');
});

test('search no-result, clear, close, and reopen states recover correctly', async () => {
  const { window, document } = await loadPage();
  selectExam(window, document, 'cqe');
  click(window, document.querySelector('[data-mode="quick"]'));
  const { drawer, list } = await openPane(window, document);
  const search = document.getElementById('tb-refsearch');

  search.value = 'zzzz-no-such-cqe-formula-zzzz';
  search.dispatchEvent(new window.Event('input', { bubbles: true }));
  await wait(window);
  assert.match(list.textContent, /No formula matches/i);
  assert.match(list.textContent, /zzzz-no-such-cqe-formula-zzzz/i);

  search.value = '';
  search.dispatchEvent(new window.Event('input', { bubbles: true }));
  await wait(window);
  assert.match(list.textContent, /Recommended for the current question/i);
  assert.doesNotMatch(list.textContent, /No formula matches [“"]\s*[”"]/i);

  click(window, drawer.querySelector('[data-close="formulas"]'));
  assert.equal(drawer.hidden, true, 'close control hides the drawer');
  const reopened = await openPane(window, document);
  assert.match(reopened.list.textContent, /Recommended for the current question/i);
});

test('formula helper does not alter the existing CSSBB reference pane', async () => {
  const { window, document } = await loadPage();
  selectExam(window, document, 'cssbb');
  selectSet(window, document, '3');
  click(window, document.querySelector('[data-mode="quick"]'));
  const { list } = await openPane(window, document);

  assert.match(list.textContent, /Process capability/i);
  assert.match(list.textContent, /Cpk/i);
  assert.equal(list.querySelector('.tb-fcontextbar'), null, 'CQE contextual renderer stays isolated');
});

test('formula context resolves every CSSBB Set 3 domain within the active exam', async () => {
  const { window, document } = await loadPage();
  selectExam(window, document, 'cssbb');
  selectSet(window, document, '3');
  click(window, document.querySelector('[data-mode="quick"]'));
  const api = window.__TB_FORMULAS_TEST__;
  const bank = window.__TB.EXAMS.cssbb.sets[3];

  for (const sectionId of ['p1', 'p2', 'tm', 'def', 'mea', 'ana', 'imp', 'con', 'dfss']) {
    const index = bank.findIndex(question => question.sub === sectionId);
    assert.ok(index >= 0, `Set 3 contains ${sectionId}`);
    document.querySelector('.tb-stem').textContent = bank[index].stem;
    document.querySelector('.tb-qtag').textContent = bank[index].sub;
    const context = api.getContext();
    assert.equal(context.examId, 'cssbb', `${sectionId}: active exam`);
    assert.equal(context.set, '3', `${sectionId}: set`);
    assert.equal(context.bankIndex, index, `${sectionId}: bank index`);
    assert.equal(context.sectionId, sectionId, `${sectionId}: section`);
  }
});

test('formula context never binds a CSSBB stem to a colliding CQE question', async () => {
  const { window, document } = await loadPage();
  selectExam(window, document, 'cssbb');
  selectSet(window, document, '1');
  click(window, document.querySelector('[data-mode="quick"]'));
  const question = window.__TB.EXAMS.cssbb.sets[1].find(item => item.stem.startsWith('An inspector draws 5 pipes'));
  assert.ok(question, 'shared-stem CSSBB fixture exists');
  document.querySelector('.tb-stem').textContent = question.stem;
  document.querySelector('.tb-qtag').textContent = 'Measure · V. Measure';

  const context = window.__TB_FORMULAS_TEST__.getContext();
  assert.equal(context.examId, 'cssbb');
  assert.equal(context.set, '1');
  assert.equal(context.sectionId, 'mea');
  assert.equal(context.question, question);
});

test('formula context infers an unmatched CSSBB question from CSSBB section metadata', async () => {
  const { window, document } = await loadPage();
  selectExam(window, document, 'cssbb');
  selectSet(window, document, '3');
  click(window, document.querySelector('[data-mode="quick"]'));
  document.querySelector('.tb-stem').textContent = 'Unmatched CSSBB routing fixture';
  document.querySelector('.tb-qtag').textContent = 'Measure · V. Measure';

  const context = window.__TB_FORMULAS_TEST__.getContext();
  assert.equal(context.examId, 'cssbb');
  assert.equal(context.set, null);
  assert.equal(context.sectionId, 'mea');
  assert.equal(context.question.sub, 'mea');
});

test('formula pane supplies guidance without copying the hidden answer explanation', async () => {
  const { window, document } = await loadPage();
  selectExam(window, document, 'cqe');
  const api = window.__TB_FORMULAS_TEST__;
  const bank = window.__TB.EXAMS.cqe.sets[1];
  const index = bank.findIndex(question => api.formulasForQuestion(question).length > 0 && question.why);
  assert.ok(index >= 0, 'found a formula-backed question with feedback');
  const question = bank[index];

  click(window, document.querySelector('[data-mode="quick"]'));
  document.querySelector('.tb-stem').textContent = question.stem;
  document.querySelector('.tb-qtag').textContent = question.sub;
  document.getElementById('tb-formulas').hidden = false;
  api.renderContextualPane('');
  const text = document.getElementById('tb-reflist').textContent;

  assert.ok(api.formulasForQuestion(question).length > 0, 'question maps to a formula');
  assert.doesNotMatch(text, new RegExp(question.why.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  assert.match(text, /Use when:/i);
  assert.match(text, /Watch for:|Variables \/ basis:/i);
});

test('representative first and last questions from every CQE set map to the correct set and bank number', async () => {
  const { window, document } = await loadPage();
  selectExam(window, document, 'cqe');
  const api = window.__TB_FORMULAS_TEST__;

  click(window, document.querySelector('[data-mode="quick"]'));
  document.getElementById('tb-formulas').hidden = false;
  for (const set of ['1', '2', '3']) {
    const bank = window.__TB.EXAMS.cqe.sets[set];
    for (const index of [0, bank.length - 1]) {
      document.querySelector('.tb-stem').textContent = bank[index].stem;
      document.querySelector('.tb-qtag').textContent = bank[index].sub;
      api.renderContextualPane('');
      const context = api.getContext();
      assert.equal(context.set, set, `Set ${set} Q${index + 1}: set resolved`);
      assert.equal(context.bankIndex, index, `Set ${set} Q${index + 1}: bank index resolved`);
      assert.match(document.querySelector('.tb-fcontextbar').textContent, new RegExp(`Exam Set ${set}`));
      assert.match(document.querySelector('.tb-fcontextbar').textContent, new RegExp(`Bank Q${index + 1}`));
    }
  }
});

test('formula drawer retains responsive and accessible controls', async () => {
  const { window, document } = await loadPage();
  selectExam(window, document, 'cqe');
  click(window, document.querySelector('[data-mode="quick"]'));
  const { drawer } = await openPane(window, document);

  assert.equal(drawer.getAttribute('aria-label'), 'Formula and reference sheet');
  assert.equal(document.getElementById('tb-refsearch').getAttribute('aria-label'), 'Search formulas');
  assert.equal(drawer.querySelector('[data-close="formulas"]').getAttribute('aria-label'), 'Close');
  assert.match(pageHtml, /\.tb-drawer\{[^}]*max-width:92vw/);
  assert.match(pageHtml, /\.tb-drawer\[hidden\]\{display:none\}/);
  assert.match(formulaScript, /@media\(max-width:520px\)/);
});
