'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const cmqScript = fs.readFileSync(path.join(ROOT, 'test-bank-cmq-set1.js'), 'utf8');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8')
  .replace('<script src="/test-bank-cmq-set1.js"></script>', `<script>${cmqScript}</script>`);

function loadPage() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc
  });
  return new Promise(resolve => dom.window.addEventListener('load', () => resolve({ dom, window: dom.window, errors })));
}

test('CMQ/OE Set 1 contains all 166 source questions with stable source numbering', async () => {
  const { dom, window, errors } = await loadPage();
  try {
    assert.deepEqual(errors, []);
    const exam = window.__TB.EXAMS.cmq;
    assert.equal(exam.bank.length, 166);
    assert.equal(exam.sets[1], exam.bank);
    assert.equal(exam.questions, 150, 'the full simulation draws 150 questions from the 166-question pool');
    assert.deepEqual(Array.from(exam.bank, question => question.sourceQuestion), Array.from({ length: 166 }, (_, i) => i + 1));
  } finally {
    dom.window.close();
  }
});

test('every CMQ/OE question is complete, unique, answerable, mapped, and explained', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.cmq;
    const validSubs = new Set(window.__TB.subUnits(exam).map(unit => unit.id));
    const stems = new Set();
    exam.bank.forEach((question, index) => {
      assert.ok(question.stem.trim().length >= 10, `Q${index + 1} has a complete stem`);
      assert.equal(question.options.length, 4, `Q${index + 1} has four choices`);
      assert.equal(new Set(question.options).size, 4, `Q${index + 1} has distinct choices`);
      assert.ok(question.options.every(option => option.trim().length >= 2), `Q${index + 1} has no empty choice`);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `Q${index + 1} has a valid answer`);
      assert.ok(validSubs.has(question.sub), `Q${index + 1} maps to a CMQ/OE BoK area`);
      assert.match(question.why, new RegExp(`Question ${index + 1}[.;]`), `Q${index + 1} retains its source reference`);
      assert.ok(!stems.has(question.stem), `Q${index + 1} has a unique stem`);
      stems.add(question.stem);
    });
  } finally {
    dom.window.close();
  }
});

test('known source defects are repaired into standalone student-ready questions', async () => {
  const { dom, window } = await loadPage();
  try {
    const bank = window.__TB.EXAMS.cmq.bank;
    const q12 = bank.find(question => question.sourceQuestion === 12);
    const q28 = bank.find(question => question.sourceQuestion === 28);
    const q73 = bank.find(question => question.sourceQuestion === 73);
    const q116 = bank.find(question => question.sourceQuestion === 116);
    const q137 = bank.find(question => question.sourceQuestion === 137);
    const q145 = bank.find(question => question.sourceQuestion === 145);
    assert.doesNotMatch(q12.stem, /uncovered the following/i, 'Q12 no longer refers to missing material');
    assert.match(q28.stem, /\$100,000.*\$300,000.*\$10,000/, 'Q28 supplies the data required to calculate ROI and RONA');
    assert.match(q73.stem, /mean, median, and mode/i, 'Q73 states all three requested statistics');
    assert.equal(q116.options.length, 4, 'Q116 restores the missing fourth combination choice');
    assert.match(q137.stem, /knowledge, skills, experience/i, 'Q137 restores the garbled leadership-traits list');
    assert.doesNotMatch(q145.stem, /behavior s/i, 'Q145 repairs the OCR-split word');
    assert.equal(q145.options[0], 'Gantt chart', 'Q145 repairs the misspelled chart name');
  } finally {
    dom.window.close();
  }
});

test('ambiguous or indefensible source items have one student-defensible answer', async () => {
  const { dom, window } = await loadPage();
  try {
    const bank = window.__TB.EXAMS.cmq.bank;
    const expected = new Map([[46, 2], [60, 2], [90, 2], [96, 3], [100, 1], [103, 3], [106, 1], [121, 3], [123, 3], [127, 1], [158, 1], [160, 0], [161, 2], [166, 2]]);
    for (const [sourceQuestion, answer] of expected) {
      const question = bank.find(item => item.sourceQuestion === sourceQuestion);
      assert.equal(question.answer, answer, `Q${sourceQuestion} has the reviewed answer`);
      assert.match(question.why, /because|means|defined|can |is |are |creates|needs|makes|addresses|support/i, `Q${sourceQuestion} explains the reviewed answer`);
    }
  } finally {
    dom.window.close();
  }
});

test('CMQ/OE launches all three live modes and Full Exam draws exactly 150 questions', async () => {
  const { dom, window } = await loadPage();
  try {
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="cmq"]'));
    const overview = window.document.getElementById('tb-overview');
    assert.equal(overview.querySelectorAll('[data-mode]').length, 3);
    assert.match(overview.textContent, /across all 7 areas/i, 'the diagnostic states the seven-area CMQ blueprint');
    assert.doesNotMatch(overview.textContent, /all nine areas|weighted to match the real exam/i, 'CMQ makes no incorrect area-count or sampling claim');
    assert.match(overview.textContent, /150 randomized questions across every available area/i, 'Full Exam accurately describes its randomized selection');
    click(overview.querySelector('[data-mode="full"]'));
    assert.equal(overview.querySelectorAll('.tb-navcell').length, 150);
    assert.match(overview.textContent, /Full Exam · timed/i, 'Full Exam retains its identity in the player');
    click(overview.querySelector('[data-backsim]'));
    click(overview.querySelector('[data-mode="quick"]'));
    assert.match(overview.textContent, /Quick Quiz · untimed/i, 'Quick Quiz retains its identity in the player');
    click(overview.querySelector('[data-backsim]'));
    click(overview.querySelector('[data-mode="focus"]'));
    assert.match(overview.textContent, /Focused Quiz · untimed/i, 'Focused Quiz retains its identity in the player');
  } finally {
    dom.window.close();
  }
});

test('a perfect CMQ Quick Quiz scores correctly and retakes the same mode', async () => {
  const { dom, window } = await loadPage();
  try {
    const overview = window.document.getElementById('tb-overview');
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="cmq"]'));
    click(overview.querySelector('[data-count="quick"][data-n="10"]'));
    click(overview.querySelector('[data-mode="quick"]'));
    const bank = window.__TB.EXAMS.cmq.bank;
    for (let index = 0; index < 10; index += 1) {
      const stem = overview.querySelector('.tb-stem').textContent;
      const question = bank.find(item => item.stem === stem);
      assert.ok(question, `rendered question ${index + 1} belongs to the CMQ bank`);
      click(overview.querySelector(`[data-opt="${question.answer}"]`));
      click(overview.querySelector(index < 9 ? '[data-next]' : '[data-submit]'));
    }
    assert.match(overview.textContent, /Quick Quiz result/i);
    assert.match(overview.textContent, /answered 10 of 10 correctly on this quick quiz/i);
    const retake = overview.querySelector('[data-retake]');
    assert.match(retake.textContent, /Retake Quick Quiz/i);
    click(retake);
    assert.match(overview.textContent, /Quick Quiz · untimed/i);
    assert.equal(overview.querySelectorAll('.tb-navcell').length, 10);
  } finally {
    dom.window.close();
  }
});
