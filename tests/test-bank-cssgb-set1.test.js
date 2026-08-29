'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const cmqScript = fs.readFileSync(path.join(ROOT, 'test-bank-cmq-set1.js'), 'utf8');
const cssgbScript = fs.readFileSync(path.join(ROOT, 'test-bank-cssgb-set1.js'), 'utf8');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8')
  .replace('<script src="/test-bank-cmq-set1.js"></script>', `<script>${cmqScript}</script>`)
  .replace('<script src="/test-bank-cssgb-set1.js"></script>', `<script>${cssgbScript}</script>`);

function loadPage() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank.html', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc });
  return new Promise(resolve => dom.window.addEventListener('load', () => resolve({ dom, window: dom.window, errors })));
}

test('CSSGB Set 1 contains 101 source questions plus nine ASQ-BoK supplements', async () => {
  const { dom, window, errors } = await loadPage();
  try {
    assert.deepEqual(errors, []);
    const exam = window.__TB.EXAMS.cssgb;
    assert.equal(exam.bank.length, 110);
    assert.equal(exam.questions, 110);
    assert.equal(exam.minutes, 258, 'uses the current ASQ computer-based exam time');
    assert.equal(exam.sets[1], exam.bank);
    assert.deepEqual(Array.from(exam.bank, q => q.sourceGlobalQuestion), Array.from({ length: 110 }, (_, i) => i + 1));
    assert.deepEqual(Array.from(new Set(exam.bank.map(q => q.sourceSection))), [
      'Overview: Six Sigma and the Organization', 'Define Phase', 'Measure Phase', 'Analyze Phase', 'Improve Phase', 'Control Phase'
    ]);
    const sectionCounts = Object.fromEntries(Array.from(new Set(exam.bank.map(q => q.sourceSection)), section => [section, exam.bank.filter(q => q.sourceSection === section).length]));
    assert.deepEqual(sectionCounts, {
      'Overview: Six Sigma and the Organization': 13, 'Define Phase': 23, 'Measure Phase': 24,
      'Analyze Phase': 18, 'Improve Phase': 17, 'Control Phase': 15
    });
    const supplements = exam.bank.filter(q => q.sourceType === 'ASQ BoK Supplement');
    assert.equal(supplements.length, 9);
    assert.deepEqual(Array.from(supplements, q => q.sourceGlobalQuestion), [102, 103, 104, 105, 106, 107, 108, 109, 110]);
    assert.ok(supplements.every(q => q.bokReference && /ASQ CSSGB Body of Knowledge/.test(q.why)));
  } finally { dom.window.close(); }
});

test('all 101 book questions retain the verified physical PDF page boundaries', async () => {
  const { dom, window } = await loadPage();
  try {
    const pageRanges = {
      'Overview: Six Sigma and the Organization': [[1, 7, 27], [8, 13, 28]],
      'Define Phase': [[1, 7, 44], [8, 14, 45], [15, 21, 46], [22, 23, 47]],
      'Measure Phase': [[1, 6, 70], [7, 11, 71], [12, 18, 72], [19, 24, 73]],
      'Analyze Phase': [[1, 6, 89], [7, 12, 90], [13, 15, 91]],
      'Improve Phase': [[1, 6, 102], [7, 13, 103], [14, 15, 104]],
      'Control Phase': [[1, 6, 117], [7, 11, 118]
      ]
    };
    const sourceQuestions = window.__TB.EXAMS.cssgb.bank.filter(question => question.sourceType !== 'ASQ BoK Supplement');
    sourceQuestions.forEach(question => {
      const range = pageRanges[question.sourceSection].find(([first, last]) => question.sourceQuestion >= first && question.sourceQuestion <= last);
      assert.ok(range, `source range exists for global question ${question.sourceGlobalQuestion}`);
      assert.equal(question.sourcePdfPage, range[2], `global question ${question.sourceGlobalQuestion} maps to physical PDF page ${range[2]}`);
    });
  } finally { dom.window.close(); }
});

test('every CSSGB question is complete, unique, mapped, cited, and student-answerable', async () => {
  const { dom, window } = await loadPage();
  try {
    const exam = window.__TB.EXAMS.cssgb;
    const validSubs = new Set(window.__TB.subUnits(exam).map(unit => unit.id));
    const stems = new Set();
    exam.bank.forEach((q, index) => {
      assert.ok(q.stem.trim().length >= 10, `Q${index + 1} has a complete stem`);
      assert.equal(q.options.length, 4, `Q${index + 1} has four choices`);
      assert.equal(new Set(q.options).size, 4, `Q${index + 1} has four distinct choices`);
      assert.ok(q.options.every(option => option.trim().length >= 1), `Q${index + 1} has no empty choice`);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, `Q${index + 1} has a valid answer`);
      assert.ok(validSubs.has(q.sub), `Q${index + 1} maps to a CSSGB BoK area`);
      if (q.sourceType === 'ASQ BoK Supplement') {
        assert.match(q.why, new RegExp(q.bokReference.replace('.', '\\.')), `Q${index + 1} retains its ASQ BoK map`);
      } else {
        assert.match(q.why, new RegExp(`Question ${q.sourceQuestion} \\(PDF p\\. ${q.sourcePdfPage}\\)`), `Q${index + 1} retains its exact source map`);
      }
      assert.ok(!stems.has(q.stem), `Q${index + 1} has a unique stem`);
      assert.doesNotMatch(`${q.stem} ${q.options.join(' ')} ${q.why}`, /[�™»]|\b(?:iinasafer|Werkpine|cohduaing|pxpressing|measureme nts|observati)\b|groups of :|spreadsheet\s+s\s+specific|in finished|system\. utilization/i, `Q${index + 1} contains no known OCR debris`);
      assert.doesNotMatch(q.why, /<\s*[A-Z]\s*</, `Q${index + 1} escapes mathematical inequalities before HTML rendering`);
      const renderedWhy = window.document.createElement('div');
      renderedWhy.innerHTML = q.why;
      assert.ok(renderedWhy.textContent.includes(q.options[q.answer]), `Q${index + 1} renders its complete keyed answer in the explanation`);
      stems.add(q.stem);
    });
  } finally { dom.window.close(); }
});

test('reviewed numerical and source-defect repairs have defensible answers', async () => {
  const { dom, window } = await loadPage();
  try {
    const bank = window.__TB.EXAMS.cssgb.bank;
    const by = (section, number) => bank.find(q => q.sourceSection === section && q.sourceQuestion === number);
    assert.equal(by('Overview: Six Sigma and the Organization', 11).options[by('Overview: Six Sigma and the Organization', 11).answer], '480');
    assert.equal(by('Define Phase', 10).options[by('Define Phase', 10).answer], '$72,000');
    assert.equal(by('Define Phase', 16).options[by('Define Phase', 16).answer], '0.15 DPU');
    assert.equal(by('Define Phase', 17).options[by('Define Phase', 17).answer], '60,000 DPMO');
    assert.equal(by('Define Phase', 18).options[by('Define Phase', 18).answer], '54%');
    assert.equal(by('Measure Phase', 5).options[by('Measure Phase', 5).answer], 'I and IV');
    assert.equal(by('Measure Phase', 12).options[by('Measure Phase', 12).answer], '97.5%');
    assert.equal(by('Measure Phase', 21).options[by('Measure Phase', 21).answer], 'Approximately 11%');
    assert.match(by('Measure Phase', 21).why, /printed guide.*inconsistent/i);
    assert.equal(by('Measure Phase', 23).options[by('Measure Phase', 23).answer], '1/3');
    assert.equal(by('Improve Phase', 6).options[by('Improve Phase', 6).answer], '16');
    assert.equal(by('Measure Phase', 24).options[by('Measure Phase', 24).answer], 'The process has adequate potential spread but is poorly centered relative to the specifications.');
    assert.equal(by('Improve Phase', 5).options[by('Improve Phase', 5).answer], 'Hours of preparation');
  } finally { dom.window.close(); }
});

test('CSSGB exam tools include a populated formula sheet and working calculator', async () => {
  const { dom, window, errors } = await loadPage();
  try {
    const overview = window.document.getElementById('tb-overview');
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="cssgb"]'));
    click(overview.querySelector('[data-mode="full"]'));

    click(overview.querySelector('[data-formulas]'));
    assert.equal(window.document.getElementById('tb-formulas').hidden, false);
    assert.ok(window.document.querySelectorAll('#tb-reflist .tb-refitem').length > 0, 'formula drawer is populated');

    click(overview.querySelector('[data-calc]'));
    const calc = window.document.getElementById('tb-calc');
    assert.equal(calc.hidden, false);
    click(calc.querySelector('[data-k="2"]'));
    click(calc.querySelector('[data-k="+"]'));
    click(calc.querySelector('[data-k="3"]'));
    click(calc.querySelector('[data-act="eq"]'));
    assert.equal(window.document.getElementById('tb-calcdisp').textContent, '5');
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
});

test('CSSGB launches the full 110-question simulation plus Quick and Focused modes', async () => {
  const { dom, window } = await loadPage();
  try {
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="cssgb"]'));
    const overview = window.document.getElementById('tb-overview');
    assert.equal(overview.querySelectorAll('[data-mode]').length, 3);
    click(overview.querySelector('[data-mode="full"]'));
    assert.equal(overview.querySelectorAll('.tb-navcell').length, 110);
    assert.match(overview.textContent, /Full Exam · timed/i);
    click(overview.querySelector('[data-backsim]'));
    click(overview.querySelector('[data-mode="quick"]'));
    assert.match(overview.textContent, /Quick Quiz · untimed/i);
    click(overview.querySelector('[data-backsim]'));
    click(overview.querySelector('[data-mode="focus"]'));
    assert.match(overview.textContent, /Focused Quiz · untimed/i);
  } finally { dom.window.close(); }
});

test('a student can answer and submit every CSSGB question with complete rendered content', async () => {
  const { dom, window, errors } = await loadPage();
  try {
    const overview = window.document.getElementById('tb-overview');
    const click = element => element.dispatchEvent(new window.Event('click', { bubbles: true }));
    click(window.document.querySelector('.tb-tile[data-exam="cssgb"]'));
    click(overview.querySelector('[data-mode="full"]'));

    const bankByStem = new Map(window.__TB.EXAMS.cssgb.bank.map(question => [question.stem, question]));
    for (let index = 0; index < 110; index += 1) {
      assert.match(overview.querySelector('.tb-quizprog').textContent, new RegExp(`Question ${index + 1} of 110`));
      const stem = overview.querySelector('.tb-stem').textContent.trim();
      const question = bankByStem.get(stem);
      assert.ok(question, `rendered question ${index + 1} maps back to the bank`);
      const renderedOptions = Array.from(overview.querySelectorAll('[data-opt]'), option => option.lastElementChild.textContent.trim());
      assert.deepEqual(renderedOptions, Array.from(question.options), `question ${index + 1} renders all choices without truncation`);
      click(overview.querySelector(`[data-opt="${question.answer}"]`));
      assert.equal(overview.querySelectorAll('.tb-navcell.done').length, index + 1, `question ${index + 1} records the student's answer`);
      if (index < 109) click(overview.querySelector('[data-next]'));
    }

    click(overview.querySelector('[data-submit]'));
    assert.match(overview.querySelector('.tb-resverd p').textContent, /answered 110 of 110 correctly/i);
    assert.equal(overview.querySelectorAll('.tb-domblock').length, 6, 'results include every CSSGB domain');
    assert.ok(Array.from(overview.querySelectorAll('.tb-domp')).every(score => score.textContent.trim() === '100%'), 'every domain scores 100% when every keyed answer is selected');
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
});
