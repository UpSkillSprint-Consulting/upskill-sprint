'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const set1Script = fs.readFileSync(path.join(ROOT, 'test-bank-cssgb-set1.js'), 'utf8');
const set2Script = fs.readFileSync(path.join(ROOT, 'test-bank-cssgb-set2.js'), 'utf8');
const cmqScript = fs.readFileSync(path.join(ROOT, 'test-bank-cmq-set1.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(set1Script, context);
vm.runInContext(set2Script, context);
const SET1 = context.window.CSSGB_SET1;
const SET2 = context.window.CSSGB_SET2;

const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8')
  .replace('<script src="/test-bank-cmq-set1.js"></script>', `<script>${cmqScript}</script>`)
  .replace('<script src="/test-bank-cssgb-set1.js"></script>', `<script>${set1Script}</script>`)
  .replace('<script src="/test-bank-cssgb-set2.js"></script>', `<script>${set2Script}</script>`);

let windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (_) {} }));

function loadPage() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  windows.push(dom.window);
  return new Promise(resolve => dom.window.addEventListener('load', () => resolve({ window: dom.window, errors })));
}

function click(window, element) {
  assert.ok(element, 'expected a clickable element');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
}

function openCssgb(window) {
  click(window, window.document.querySelector('.tb-tile[data-exam="cssgb"]'));
  return window.document.getElementById('tb-overview');
}

test('Set 2 is a complete, independently mapped 110-question bank', () => {
  assert.equal(SET2.length, 110);
  assert.equal(new Set(SET2.map(question => question.stem.trim().toLowerCase())).size, 110, 'no duplicate Set 2 stems');
  const set1Stems = new Set(SET1.map(question => question.stem.trim().toLowerCase()));
  SET2.forEach((question, index) => {
    assert.equal(question.set, 2, `question ${index + 1} belongs to Set 2`);
    assert.equal(question.sourceGlobalQuestion, index + 1, `question ${index + 1} has a stable global mapping`);
    assert.equal(question.options.length, 4, `question ${index + 1} has four options`);
    assert.equal(new Set(question.options.map(option => option.trim().toLowerCase())).size, 4, `question ${index + 1} options are distinct`);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `question ${index + 1} has a valid key`);
    assert.match(question.why, new RegExp(`<b>${'ABCD'[question.answer]}\\.`), `question ${index + 1} explanation identifies its keyed choice`);
    assert.match(question.why, /The ASQ Certified Six Sigma Green Belt Study Guide \(2024\)/, `question ${index + 1} cites the source`);
    assert.ok(question.sourcePrintPage >= 4 && question.sourcePrintPage <= 171, `question ${index + 1} has a plausible print page`);
    assert.match(question.bokReference, /^[IVX]+(?:\.[A-Z0-9]+)+$/, `question ${index + 1} has a BoK reference`);
    assert.ok(!set1Stems.has(question.stem.trim().toLowerCase()), `question ${index + 1} does not repeat Set 1`);
    assert.doesNotMatch(`${question.stem} ${question.options.join(' ')} ${question.why}`, /(?:\bundefined\b|\bNaN\b|\.jpe?g|\ufffd)/i, `question ${index + 1} contains no extraction debris`);
  });
});

test('all 100 Part B questions and the 10 selected Part A questions retain exact source coordinates', () => {
  const partB = SET2.slice(0, 100);
  assert.deepEqual(Array.from(partB, question => question.sourceQuestion), Array.from({ length: 100 }, (_, index) => index + 1));
  assert.ok(partB.every(question => question.sourcePart === 'Part B: Practice Exam'));
  assert.ok(partB.every(question => question.sourceEpubFile === 'OEBPS/xhtml/part2.xhtml'));
  assert.equal(Math.min(...partB.map(question => question.sourcePrintPage)), 149);
  assert.equal(Math.max(...partB.map(question => question.sourcePrintPage)), 171);
  assert.equal(partB.map(question => 'ABCD'[question.answer]).join(''),
    'ABBCBCADCDDADDACABBDBDABBABDBABBBABDCBDDBCBCAACCBBBBBCBCDCAACABCACDCCBBADBDDADBDAADCBCACDADCBBDBACDC');

  const expectedAdditions = [
    ['OEBPS/xhtml/chapter1.xhtml', 3, 4, 'D'],
    ['OEBPS/xhtml/chapter2.xhtml', 7, 23, 'A'],
    ['OEBPS/xhtml/chapter2.xhtml', 14, 24, 'D'],
    ['OEBPS/xhtml/chapter3.xhtml', 3, 47, 'B'],
    ['OEBPS/xhtml/chapter3.xhtml', 11, 48, 'B'],
    ['OEBPS/xhtml/chapter4.xhtml', 22, 88, 'A'],
    ['OEBPS/xhtml/chapter4.xhtml', 55, 95, 'A'],
    ['OEBPS/xhtml/chapter5.xhtml', 6, 111, 'C'],
    ['OEBPS/xhtml/chapter5.xhtml', 29, 117, 'D'],
    ['OEBPS/xhtml/chapter6.xhtml', 53, 137, 'B']
  ];
  assert.deepEqual(Array.from(SET2.slice(100), question => [
    question.sourceEpubFile, question.sourceQuestion, question.sourcePrintPage, 'ABCD'[question.answer]
  ]), expectedAdditions);
});

test('the final 110-question domain mix closely preserves the official 100-question weighting', () => {
  const counts = {};
  SET2.forEach(question => { counts[question.sub] = (counts[question.sub] || 0) + 1; });
  assert.deepEqual(counts, {
    'cssgb-org': 12,
    'cssgb-define': 22,
    'cssgb-control': 16,
    'cssgb-improve': 18,
    'cssgb-analyze': 20,
    'cssgb-measure': 22
  });
  const partBCounts = {};
  SET2.slice(0, 100).forEach(question => { partBCounts[question.sub] = (partBCounts[question.sub] || 0) + 1; });
  assert.deepEqual(partBCounts, {
    'cssgb-org': 11,
    'cssgb-define': 20,
    'cssgb-control': 15,
    'cssgb-improve': 16,
    'cssgb-analyze': 18,
    'cssgb-measure': 20
  }, 'the source Part B exam exactly follows its six-domain weighting');
});

test('calculation-heavy and image-dependent questions retain their reviewed answers', () => {
  const expectedCorrectOptions = new Map([
    [16, '32'], [18, '4.51'], [24, 'The test statistic = 4.286, and the critical value = 5.991.'],
    [27, '0.3915'], [29, '1, 3, 4, 2'], [34, '0.82%'], [36, '22.13'],
    [38, '1.235'], [43, 'Reject H0 since p < α.'], [58, '385.3'], [61, '[0, 5.22]'],
    [64, '1.33'], [65, 'The mean response will decrease by 7.5 units.'], [67, '25 / n'],
    [85, '27%'], [91, '1320'], [92, 'Factor A high, Factor B low'],
    [96, '4, 2, 1, 3, 5'], [99, 'H₀: μD = 0 vs. H₁: μD > 0'], [100, '21']
  ]);
  expectedCorrectOptions.forEach((expected, number) => {
    const question = SET2[number - 1];
    assert.equal(question.options[question.answer], expected, `Part B question ${number}`);
  });
  assert.equal(SET2[36].options[SET2[36].answer], 'FCalc > F(4, 24, 0.05), Reject H0.', 'ANOVA decision uses the correct degrees of freedom');
  assert.match(SET2[37].stem, /R-bar = 16\.25/, 'lost mathematical notation was restored in question 38');
  assert.match(SET2[95].stem, /1\. Build the sequence.+5\. Verify/, 'the five flowcharting steps omitted by text extraction were restored');
});

test('all required source visuals are represented with accessible repo-native charts', async () => {
  const chartNumbers = Array.from(SET2, (question, index) => question.chart ? index + 1 : null).filter(Boolean);
  assert.deepEqual(chartNumbers, [13, 24, 29, 36, 37, 65, 92]);
  assert.deepEqual(Array.from(SET2.filter(question => question.chart), question => question.chart.type), [
    'vsm-supermarket', 'data-table', 'data-table', 'data-table', 'data-table', 'main-effects-plot', 'two-level-interaction'
  ]);
  const { window, errors } = await loadPage();
  assert.deepEqual(errors, []);
  SET2.filter(question => question.chart).forEach((question, index) => {
    const rendered = window.__TB.renderQuestionChart(question.chart);
    assert.ok(rendered.length > 100, `visual ${index + 1} renders`);
    assert.doesNotMatch(rendered, /(?:undefined|NaN|<img|\.jpe?g)/i, `visual ${index + 1} is self-contained and valid`);
    const fragment = JSDOM.fragment(rendered);
    assert.ok(fragment.querySelector('table, svg[role="img"]'), `visual ${index + 1} is semantic`);
  });
});

test('CSSGB exposes Set 1, Set 2, and Mixed and routes a Set 2 quick quiz correctly', async () => {
  const { window, errors } = await loadPage();
  const overview = openCssgb(window);
  assert.deepEqual(errors, []);
  const selectors = Array.from(overview.querySelectorAll('.tb-setpick [data-set]'));
  assert.deepEqual(selectors.map(button => button.dataset.set), ['1', '2', 'mix']);
  assert.match(selectors[0].textContent, /110 questions/);
  assert.match(selectors[1].textContent, /110 questions/);
  assert.match(selectors[2].textContent, /220 pooled/);
  click(window, overview.querySelector('[data-set="2"]'));
  const rerendered = window.document.getElementById('tb-overview');
  assert.ok(rerendered.querySelector('[data-set="2"].on'));
  click(window, rerendered.querySelector('[data-mode="quick"]'));
  assert.match(window.document.querySelector('.tb-quizprog').textContent, /Question 1 of 20/);
  const stem = window.document.querySelector('.tb-stem').textContent;
  assert.ok(SET2.some(question => question.stem === stem), 'the quick quiz drew from Set 2');
  assert.ok(!SET1.some(question => question.stem === stem), 'the question was not drawn from Set 1');
});

test('Set 2 focused practice reaches every mapped domain without leakage', async () => {
  const expected = {
    enterprise: { sub: 'cssgb-org', count: 12 },
    define: { sub: 'cssgb-define', count: 22 },
    measure: { sub: 'cssgb-measure', count: 22 },
    analyze: { sub: 'cssgb-analyze', count: 20 },
    improve: { sub: 'cssgb-improve', count: 18 },
    control: { sub: 'cssgb-control', count: 16 }
  };
  const byStem = new Map(SET2.map(question => [question.stem, question]));
  const { window, errors } = await loadPage();
  let overview = openCssgb(window);
  click(window, overview.querySelector('[data-set="2"]'));

  for (const [domain, spec] of Object.entries(expected)) {
    overview = window.document.getElementById('tb-overview');
    click(window, overview.querySelector('[data-count="focus"][data-n="50"]'));
    overview = window.document.getElementById('tb-overview');
    const selector = overview.querySelector('[data-focusdom]');
    selector.value = domain;
    selector.dispatchEvent(new window.Event('change', { bubbles: true }));
    overview = window.document.getElementById('tb-overview');
    click(window, overview.querySelector('[data-mode="focus"]'));
    assert.equal(window.document.querySelectorAll('.tb-navcell').length, spec.count, `${domain} contains every available Set 2 question`);
    for (let index = 0; index < spec.count; index += 1) {
      click(window, window.document.querySelector(`[data-goto="${index}"]`));
      const question = byStem.get(window.document.querySelector('.tb-stem').textContent);
      assert.ok(question && question.sub === spec.sub, `${domain} focused question ${index + 1} stays in its domain`);
    }
    click(window, window.document.querySelector('[data-backsim]'));
  }
  assert.deepEqual(errors, []);
});

test('Mixed full exam uses the 220-question pool while preserving the 110-question exam length', async () => {
  const { window, errors } = await loadPage();
  let overview = openCssgb(window);
  click(window, overview.querySelector('[data-set="mix"]'));
  overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-timed="0"]'));
  window.Math.random = () => 0.5;
  overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="full"]'));
  assert.equal(window.document.querySelectorAll('.tb-navcell').length, 110);
  const set1Stems = new Set(SET1.map(question => question.stem));
  const set2Stems = new Set(SET2.map(question => question.stem));
  const seenSets = new Set();
  for (let index = 0; index < 110; index += 1) {
    click(window, window.document.querySelector(`[data-goto="${index}"]`));
    const stem = window.document.querySelector('.tb-stem').textContent;
    if (set1Stems.has(stem)) seenSets.add(1);
    if (set2Stems.has(stem)) seenSets.add(2);
  }
  assert.deepEqual([...seenSets].sort(), [1, 2], 'the deterministic Mixed draw includes both source sets');
  assert.deepEqual(errors, []);
});

test('a student can complete every Set 2 question correctly without a broken or omitted item', async () => {
  const { window, errors } = await loadPage();
  let overview = openCssgb(window);
  click(window, overview.querySelector('[data-set="2"]'));
  overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-timed="0"]'));
  overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="full"]'));
  assert.equal(window.document.querySelectorAll('.tb-navcell').length, 110, 'all 110 questions entered the full exam');

  const byStem = new Map(SET2.map(question => [question.stem, question]));
  for (let index = 0; index < 110; index += 1) {
    const stem = window.document.querySelector('.tb-stem').textContent;
    const question = byStem.get(stem);
    assert.ok(question, `rendered question ${index + 1} belongs to Set 2`);
    const options = window.document.querySelectorAll('.tb-opt');
    assert.equal(options.length, 4, `rendered question ${index + 1} has all four choices`);
    click(window, options[question.answer]);
    if (index < 109) click(window, window.document.querySelector('[data-next]'));
  }
  click(window, window.document.querySelector('[data-submit]'));
  const results = window.document.getElementById('tb-overview').textContent;
  assert.match(results, /100%/, 'the source answer mapping produces a perfect score');
  assert.match(results, /answered 110 of 110 correctly/i, 'all questions were scored');
  assert.deepEqual(errors, [], 'the entire student journey generated no runtime errors');
});
