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

test('Set 2 contains every Part A and Part B question as a 506-question source bank', () => {
  assert.equal(SET2.length, 506, '406 Part A questions plus 100 Part B questions');
  assert.equal(new Set(SET2.map(question => question.stem.trim().toLowerCase())).size, 506, 'no duplicate Set 2 stems');
  const set1Stems = new Set(SET1.map(question => question.stem.trim().toLowerCase()));
  SET2.forEach((question, index) => {
    assert.ok(question.stem.trim(), `question ${index + 1} has a visible stem`);
    assert.equal(question.set, 2, `question ${index + 1} belongs to Set 2`);
    assert.equal(question.sourceGlobalQuestion, index + 1, `question ${index + 1} has a stable global mapping`);
    assert.equal(question.options.length, 4, `question ${index + 1} has four options`);
    assert.ok(question.options.every(option => option.trim()), `question ${index + 1} has no empty option`);
    assert.equal(new Set(question.options.map(option => option.trim().toLowerCase())).size, 4, `question ${index + 1} options are distinct`);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `question ${index + 1} has a valid key`);
    assert.match(question.why, new RegExp(`<b>${'ABCD'[question.answer]}\\.`), `question ${index + 1} explanation identifies its keyed choice`);
    assert.match(question.why, /The ASQ Certified Six Sigma Green Belt Study Guide \(2024\)/, `question ${index + 1} cites the source`);
    assert.ok(question.sourcePrintPage >= 4 && question.sourcePrintPage <= 171, `question ${index + 1} has a plausible print page`);
    assert.match(question.bokReference, /^[IVX]+(?:\.[A-Z0-9]+)+$/, `question ${index + 1} has a BoK reference`);
    assert.ok(!set1Stems.has(question.stem.trim().toLowerCase()), `question ${index + 1} does not repeat Set 1`);
    assert.doesNotMatch(`${question.stem} ${question.options.join(' ')} ${question.why}`, /(?:\bundefined\b|\bNaN\b|\[\[IMG|\.jpe?g|\ufffd)/i, `question ${index + 1} contains no extraction debris`);
    const visibleFeedback = JSDOM.fragment(question.why).textContent.replace(/\s+/g, ' ').trim();
    assert.ok(visibleFeedback.includes(question.options[question.answer]), `question ${index + 1} visibly identifies the complete keyed answer`);
  });
});

test('all 100 Part B and all 406 Part A questions retain source coordinates and reviewed answer keys', () => {
  const partB = SET2.slice(0, 100);
  assert.deepEqual(Array.from(partB, question => question.sourceQuestion), Array.from({ length: 100 }, (_, index) => index + 1));
  assert.ok(partB.every(question => question.sourcePart === 'Part B: Practice Exam'));
  assert.ok(partB.every(question => question.sourceEpubFile === 'OEBPS/xhtml/part2.xhtml'));
  assert.equal(Math.min(...partB.map(question => question.sourcePrintPage)), 149);
  assert.equal(Math.max(...partB.map(question => question.sourcePrintPage)), 171);
  assert.equal(partB.map(question => 'ABCD'[question.answer]).join(''),
    'ABBCBCADCDDADDACABBDBDABBABDBABBBABDCBDDBCBCAACCBBBBBCBCDCAACABCACDCCBBADBDDADBDAADCBCACDADCBBDBACDC');

  const expectedChapters = {
    'OEBPS/xhtml/chapter1.xhtml': { count: 51, pages: [4, 14], answers: 'BADDCBDCDAAABCCDCAAADBCABBCCBABABDDBBBCADACCDBDCCAB' },
    'OEBPS/xhtml/chapter2.xhtml': { count: 75, pages: [21, 37], answers: 'ADBDCCAABBBABDBCCBAADADDBCDABBABCBDBDAABCBDBBBCADBCDCCBCBBBBADDCCBACDABABCA' },
    'OEBPS/xhtml/chapter3.xhtml': { count: 103, pages: [45, 69], answers: 'ADBDCDABBABBCCCDDCACDADBACBADBBCABBABACABBDCABBCBCCABBCACBACABCDBABDBCACAADCACBBBCBDBAABDBABAADDDBCAACA' },
    'OEBPS/xhtml/chapter4.xhtml': { count: 71, pages: [82, 99], answers: 'CDBABCBAACDABADCCBBACABABBDBACDBCBCDAADDDDDCCACBBACCACABBDADBABCDDBAAAD' },
    'OEBPS/xhtml/chapter5.xhtml': { count: 44, pages: [110, 120], answers: 'ADAABCBDCBACCAAADDCCAAACCADCDCABCAACABACAACB' },
    'OEBPS/xhtml/chapter6.xhtml': { count: 62, pages: [126, 139], answers: 'ABDACDAABBDABCACBBBDADCBCCBCDCABCBADCCBABADACBDCADACBACBDADAAB' }
  };
  const partA = SET2.slice(100);
  assert.equal(partA.length, 406);
  assert.ok(partA.every(question => question.sourcePart === 'Part A: Sample Questions by BoK'));
  for (const [sourceEpubFile, expected] of Object.entries(expectedChapters)) {
    const questions = partA.filter(question => question.sourceEpubFile === sourceEpubFile);
    assert.equal(questions.length, expected.count, `${sourceEpubFile} has every source question`);
    assert.deepEqual(Array.from(questions, question => question.sourceQuestion), Array.from({ length: expected.count }, (_, index) => index + 1));
    assert.deepEqual([Math.min(...questions.map(question => question.sourcePrintPage)), Math.max(...questions.map(question => question.sourcePrintPage))], expected.pages);
    assert.equal(questions.map(question => 'ABCD'[question.answer]).join(''), expected.answers, `${sourceEpubFile} preserves the reviewed answer-key sequence`);
  }
});

test('student-facing corrections resolve documented source errors and ambiguous wording', () => {
  function partA(chapter, number) {
    return SET2.find(question => question.sourceEpubFile === `OEBPS/xhtml/chapter${chapter}.xhtml` && question.sourceQuestion === number);
  }

  const kpi = partA(1, 11);
  assert.equal(kpi.options[kpi.answer], 'Key Performance Indicator');
  assert.match(kpi.stem, /standard ASQ quality terminology/);
  assert.match(kpi.why, /book keys Key Process Indicator.+corrected here/);

  const binomial = partA(3, 31);
  assert.equal(binomial.options[binomial.answer], '0.3543');
  assert.ok(Math.abs(6 * 0.10 * (0.90 ** 5) - 0.3543) < 0.00001);
  assert.match(binomial.why, /book's printed key says 0\.3281/);

  const capability = partA(3, 95);
  assert.equal(capability.options[capability.answer], 'A process producing a consistent output within specifications');
  assert.match(capability.why, /capability measures are predictive only after the process is stable/);

  const variance = partA(4, 39);
  assert.equal(variance.options[variance.answer], 'F₀ = 2.94, Fcrit = 2.40, Reject H₀.');
  assert.match(variance.why, /two-sided F test/);
  assert.match(variance.why, /α\/2 = 0\.05/);

  const pairedT = partA(4, 42);
  assert.match(pairedT.why, /left-tail cutoff is −2\.132/);
  assert.doesNotMatch(pairedT.why, /\|t\|/);

  const fiveWhys = partA(4, 65);
  assert.match(fiveWhys.stem, /repeatedly asking why/);
  assert.match(fiveWhys.why, /distinct from the 5W1H/);
  assert.doesNotMatch(partA(4, 60).why, /also called the 5W1H/);

  const faultTree = partA(4, 66);
  assert.match(faultTree.why, /AND\/OR gate logic/);
  assert.match(faultTree.why, /not simply added together/);

  const uCenter = partA(6, 27);
  assert.equal(uCenter.options[uCenter.answer], '0.155');
  assert.ok(Math.abs(240 / 1550 - 0.1548387) < 0.0000001);
  const uLimits = partA(6, 28);
  assert.equal(uLimits.options[uLimits.answer], '[0, 0.419]');
  assert.match(uLimits.why, /240\/1550/);
  assert.doesNotMatch(uLimits.why, /previous question/i);

  assert.equal(partA(5, 24).options[2], 'pilot testing.');
  assert.match(partA(6, 36).options[3], /approved document-control review/);
  assert.match(partA(6, 45).stem, /independent registrar/);
});

test('Set 2 feedback is self-contained and free of known extraction artifacts', () => {
  const combined = SET2.map(question => `${question.stem} ${question.options.join(' ')} ${question.why}`).join('\n');
  assert.doesNotMatch(combined, /(?:as shown in the previous question|preceding table|see the sketch below|0\.40\.We|piloting testing|0\.3543\.\.)/i);
  assert.doesNotMatch(combined, /Average ₐ Range Ṝₐ/);
  assert.match(SET2.find(question => question.sourceGlobalQuestion === 302).why, /\(20\.6 \+ 19\.8 \+ 18\.4\) \/ 3 = 19\.6/);
});

test('the full source bank preserves every chapter and the Part B exam domain weighting', () => {
  const counts = {};
  SET2.forEach(question => { counts[question.sub] = (counts[question.sub] || 0) + 1; });
  assert.deepEqual(counts, {
    'cssgb-org': 62,
    'cssgb-define': 95,
    'cssgb-control': 77,
    'cssgb-improve': 60,
    'cssgb-analyze': 89,
    'cssgb-measure': 123
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

test('all 73 required source visuals are represented with accessible repo-native charts', async () => {
  const chartNumbers = Array.from(SET2, (question, index) => question.chart ? index + 1 : null).filter(Boolean);
  assert.equal(chartNumbers.length, 73);
  assert.deepEqual(chartNumbers.slice(0, 7), [13, 24, 29, 36, 37, 65, 92], 'all existing Part B visuals remain present');
  const chartTypes = new Set(SET2.filter(question => question.chart).map(question => question.chart.type));
  assert.deepEqual([...chartTypes].sort(), [
    'bias-diagram', 'data-table', 'distribution-labels', 'fishbone-labels', 'fta-diagram',
    'interaction-plot-3', 'labeled-boxplot', 'main-effects-plot', 'multi-vari', 'normal-prob',
    'scatter-quadrant', 'two-level-interaction', 'two-tail-test', 'vsm-supermarket',
    'vsm-symbol', 'wbs-diagram'
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

test('CSSGB exposes the full 506-question Set 2 pool and routes a quick quiz correctly', async () => {
  const { window, errors } = await loadPage();
  const overview = openCssgb(window);
  assert.deepEqual(errors, []);
  const selectors = Array.from(overview.querySelectorAll('.tb-setpick [data-set]'));
  assert.deepEqual(selectors.map(button => button.dataset.set), ['1', '2', 'mix']);
  assert.match(selectors[0].textContent, /110 questions/);
  assert.match(selectors[1].textContent, /506 questions/);
  assert.match(selectors[2].textContent, /616 pooled/);
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
    enterprise: { sub: 'cssgb-org', pool: 62 },
    define: { sub: 'cssgb-define', pool: 95 },
    measure: { sub: 'cssgb-measure', pool: 123 },
    analyze: { sub: 'cssgb-analyze', pool: 89 },
    improve: { sub: 'cssgb-improve', pool: 60 },
    control: { sub: 'cssgb-control', pool: 77 }
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
    assert.equal(SET2.filter(question => question.sub === spec.sub).length, spec.pool, `${domain} exposes its complete source pool`);
    assert.equal(window.document.querySelectorAll('.tb-navcell').length, 50, `${domain} starts the requested 50-question practice session`);
    for (let index = 0; index < 50; index += 1) {
      click(window, window.document.querySelector(`[data-goto="${index}"]`));
      const question = byStem.get(window.document.querySelector('.tb-stem').textContent);
      assert.ok(question && question.sub === spec.sub, `${domain} focused question ${index + 1} stays in its domain`);
    }
    click(window, window.document.querySelector('[data-backsim]'));
  }
  assert.deepEqual(errors, []);
});

test('every one of the 506 Set 2 questions renders and accepts its keyed option in the student UI', async () => {
  const { window, errors } = await loadPage();
  let overview = openCssgb(window);
  click(window, overview.querySelector('[data-set="2"]'));
  overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-timed="0"]'));
  window.Math.random = () => 0.999999; // make the in-place shuffle a no-op

  const original = Array.from(window.CSSGB_SET2);
  const covered = new Set();
  for (let start = 0; start < original.length; start += 110) {
    const batch = original.slice(start, start + 110);
    const batchSet = new Set(batch);
    const fill = original.filter(question => !batchSet.has(question)).slice(0, 110 - batch.length);
    const leading = new Set(batch.concat(fill));
    const reordered = batch.concat(fill, original.filter(question => !leading.has(question)));
    window.CSSGB_SET2.splice(0, window.CSSGB_SET2.length, ...reordered);

    overview = window.document.getElementById('tb-overview');
    click(window, overview.querySelector('[data-mode="full"]'));
    assert.equal(window.document.querySelectorAll('.tb-navcell').length, 110);

    for (let index = 0; index < batch.length; index += 1) {
      click(window, window.document.querySelector(`[data-goto="${index}"]`));
      const expected = batch[index];
      assert.equal(window.document.querySelector('.tb-stem').textContent, expected.stem, `question ${expected.sourceGlobalQuestion} stem renders completely`);
      assert.deepEqual(
        Array.from(window.document.querySelectorAll('.tb-opt > span:last-child'), node => node.textContent),
        Array.from(expected.options),
        `question ${expected.sourceGlobalQuestion} options render completely`
      );
      if (expected.chart) assert.ok(window.document.querySelector('.tb-q-chart-wrap'), `question ${expected.sourceGlobalQuestion} visual renders`);
      click(window, window.document.querySelector(`[data-opt="${expected.answer}"]`));
      assert.ok(window.document.querySelector(`.tb-opt.sel[data-opt="${expected.answer}"]`), `question ${expected.sourceGlobalQuestion} keyed option is selectable`);
      covered.add(expected.sourceGlobalQuestion);
    }

    click(window, window.document.querySelector('[data-backsim]'));
  }

  assert.equal(covered.size, 506, 'every Set 2 source question was exercised');
  assert.deepEqual(errors, []);
});

test('Mixed full exam uses the 616-question pool while preserving the 110-question exam length', async () => {
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

test('a student can complete a 110-question Set 2 exam drawn from the full source pool', async () => {
  const { window, errors } = await loadPage();
  let overview = openCssgb(window);
  click(window, overview.querySelector('[data-set="2"]'));
  overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-timed="0"]'));
  overview = window.document.getElementById('tb-overview');
  click(window, overview.querySelector('[data-mode="full"]'));
  assert.equal(window.document.querySelectorAll('.tb-navcell').length, 110, 'the full exam remains a realistic 110-question sitting');

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
