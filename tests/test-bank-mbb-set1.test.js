'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const ROOT = path.join(__dirname, '..');
const mbbScript = fs.readFileSync(path.join(ROOT, 'test-bank-mbb-set1.js'), 'utf8');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8')
  .replace('<script src="/test-bank-mbb-set1.js"></script>', `<script>${mbbScript}</script>`);

async function loadPage() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  await installDurableLearning(dom.window);
  return { dom, window: dom.window, errors };
}

test('MBB Set 1 contains only the 100-question supplied simulated examination', async () => {
  const { dom, window, errors } = await loadPage();
  try {
    assert.deepEqual(errors, []);
    const exam = window.__TB.EXAMS.mbb;
    assert.equal(exam.questions, 100);
    assert.equal(exam.minutes, 150, 'the source simulation retains its 2.5-hour limit');
    assert.equal(exam.pass, 70);
    assert.equal(exam.bank.length, 100);
    assert.equal(exam.sets[1], exam.bank);
    assert.deepEqual(Object.keys(exam.sets), ['1'], 'the separate practice examination was not added as a set');
    assert.deepEqual(Array.from(exam.bank, question => question.sourceQuestion), Array.from({ length: 100 }, (_, index) => index + 1));
    assert.ok(exam.bank.every(question => question.sourceAssessment === 'Simulated Examination Questions for Parts I–VI'));
    assert.ok(exam.bank.every(question => !/practice examination/i.test(question.sourceAssessment)));
  } finally {
    dom.window.close();
  }
});

test('every MBB item is complete, stable, answerable, mapped, and explained', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.mbb;
    const validSubs = new Set(window.__TB.subUnits(exam).map(unit => unit.id));
    const stems = new Set();
    exam.bank.forEach((question, index) => {
      const number = index + 1;
      assert.equal(question.qid, `mbb:set-1:source-${number}`);
      assert.equal(question.set, 1);
      assert.equal(question.options.length, 4, `Q${number} has four choices`);
      assert.equal(new Set(question.options).size, 4, `Q${number} has four distinct choices`);
      assert.ok(question.options.every(option => option.trim().length >= 2), `Q${number} has no empty choice`);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `Q${number} has one valid keyed answer`);
      assert.ok(validSubs.has(question.sub), `Q${number} maps to an MBB Body of Knowledge domain`);
      assert.ok(question.why.length >= 80, `Q${number} has a useful rationale`);
      assert.match(question.why, new RegExp(`Question ${number};`), `Q${number} retains its source reference`);
      assert.doesNotMatch(question.options.join(' '), /(?:all|none) of the above/i, `Q${number} avoids all/none-of-the-above choices`);
      assert.doesNotMatch(question.stem + question.options.join(' '), /[Â�\u0007]/, `Q${number} contains no extraction artifacts`);
      assert.ok(!stems.has(question.stem), `Q${number} has a unique stem`);
      stems.add(question.stem);
    });
  } finally {
    dom.window.close();
  }
});

test('the MBB blueprint uses the six current domains and sums to 100 percent', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.mbb;
    assert.equal(exam.bok.length, 6);
    assert.deepEqual(Array.from(exam.bok, area => area.weight), [20, 20, 15, 10, 10, 25]);
    assert.equal(exam.bok.reduce((sum, area) => sum + area.weight, 0), 100);
    const counts = Object.fromEntries(Array.from(new Set(exam.bank.map(question => question.sub))).map(sub => [sub, exam.bank.filter(question => question.sub === sub).length]));
    assert.deepEqual(counts, {
      'mbb-analytics': 26,
      'mbb-enterprise': 14,
      'mbb-portfolio': 22,
      'mbb-org': 21,
      'mbb-coaching': 8,
      'mbb-training': 9
    });
  } finally {
    dom.window.close();
  }
});

test('source combination answers and defective source items are normalized for student use', async () => {
  const { dom, window } = await loadPage();
  try {
    const bank = window.__TB.EXAMS.mbb.bank;
    const byNumber = number => bank.find(question => question.sourceQuestion === number);
    [15, 32, 38, 39, 43, 45, 52, 53, 63, 67, 83, 85, 88, 91, 92, 94, 97].forEach(number => {
      assert.equal(byNumber(number).options.length, 4, `Q${number} is normalized from a source combination/all/none key`);
    });
    assert.match(byNumber(45).options[byNumber(45).answer], /assess the current culture/i, 'Q45 replaces an indefensible none-of-the-above key');
    assert.match(byNumber(68).stem, /Tuckman/i, 'Q68 removes the double-ambiguous team-stage choices');
    assert.match(byNumber(74).options[byNumber(74).answer], /percent agreement and kappa/i, 'Q74 distinguishes discrete from continuous MSA');
    assert.match(byNumber(93).why, /VIF is at least 1/i, 'Q93 repairs the impossible source VIF interpretation');
  } finally {
    dom.window.close();
  }
});

test('the two source-dependent MBB questions render independently verifiable responsive tables', async () => {
  const { dom, window } = await loadPage();
  try {
    const bank = window.__TB.EXAMS.mbb.bank;
    const q76 = bank.find(question => question.sourceQuestion === 76);
    const q91 = bank.find(question => question.sourceQuestion === 91);
    assert.equal(q76.chart.type, 'data-table');
    assert.equal(q91.chart.type, 'data-table');
    assert.deepEqual(Array.from(q91.chart.columns), ['Basis', 'RHS', 'x1', 'x2', 'x3', 'x4', 'x5']);
    assert.deepEqual(Array.from(q91.chart.rows[2]), ['x2', '$67,000', '0', '1', '0.75', '−0.50', '0']);
    [q76, q91].forEach(question => {
      const host = window.document.createElement('div');
      host.innerHTML = window.__TB.renderQuestionChart(question.chart);
      const table = host.querySelector('table.tb-q-data-table');
      assert.ok(table, `Q${question.sourceQuestion} renders a semantic table`);
      assert.equal(table.querySelectorAll('th').length, question.chart.columns.length);
      assert.equal(table.querySelectorAll('tbody tr').length, question.chart.rows.length);
      assert.doesNotMatch(table.textContent, /correct|answer/i, 'the visual does not reveal the key');
    });
  } finally {
    dom.window.close();
  }
});

test('MBB uses the same live simulation controls and full-exam player as CSSBB', async () => {
  const { dom, window } = await loadPage();
  try {
    const overview = window.document.getElementById('tb-overview');
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="mbb"]'));
    assert.match(overview.textContent, /Master Black Belt — Exam Simulation/);
    assert.equal(overview.querySelectorAll('[data-mode]').length, 3, 'Full Exam, Quick Quiz, and Focused Quiz are live');
    assert.ok(overview.querySelector('[data-diag]'), 'placement diagnostic is available');
    assert.ok(overview.querySelector('[data-timing-group="full"]'), 'timed and untimed Full Exam controls are available');
    assert.ok(overview.querySelector('[data-unseen="quick"]'), 'New questions only is available');
    assert.ok(overview.querySelector('[data-missed="quick"]'), 'Missed questions only is available');
    assert.equal(overview.querySelectorAll('[data-focusdom] option').length, 6, 'Focused Quiz exposes all six MBB domains');

    click(overview.querySelector('[data-mode="full"]'));
    assert.equal(overview.querySelectorAll('.tb-navcell').length, 100);
    assert.match(overview.textContent, /Full Exam · timed/i);
    assert.ok(window.document.getElementById('tb-timer'), 'the 150-minute countdown is active');
    assert.ok(overview.querySelector('[data-flag]'), 'mark-for-review is available');
    assert.ok(overview.querySelector('[data-formulas]'), 'formula reference is available');
    assert.ok(overview.querySelector('[data-calc]'), 'calculator is available');
  } finally {
    dom.window.close();
  }
});
