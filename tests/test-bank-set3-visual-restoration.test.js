'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');

const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (error) {} }));

async function load() {
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  return { window: dom.window };
}

function set3Bank(window) {
  return window.__TB.EXAMS.cssbb.sets[3];
}

function question(bank, number) {
  assert.ok(Number.isInteger(number) && number >= 1 && number <= bank.length, `valid Set 3 question number: ${number}`);
  return bank[number - 1];
}

// Each of these questions was identified via a cross-reference against the
// source study-guide visual index as depending on a table/diagram that was
// missing from CSSBB Set 3. This suite pins the restored chart data so a
// future edit can't silently drop it again.

test('the ROI question now renders the Year/Cost/Benefit cash-flow table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = question(bank, 211);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.columns), ['Year', 'Cost', 'Benefit']);
  assert.deepEqual(Array.from(q.chart.rows).map(r => Array.from(r)), [
    ['0', '$75,000', '$150,000'],
    ['1', '$15,000', '$45,000'],
    ['2', '$15,000', '$45,000']
  ]);
  assert.equal(q.options[q.answer], '127.1%');
  q.options.forEach(o => assert.doesNotMatch(o, /\d,\s\d/, o + ' has no stray space after the thousands comma'));
});

test('the "what type of matrix" question now shares the same matrix-diagram chart as its paired Part B question', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const typeQ = question(bank, 272);
  const partBQ = question(bank, 273);
  assert.match(typeQ.stem, /matrix diagram below/i);
  assert.match(partBQ.stem, /matrix diagram below/i);
  assert.deepEqual(JSON.parse(JSON.stringify(typeQ.chart)), JSON.parse(JSON.stringify(partBQ.chart)));
  assert.equal(typeQ.chart.type, 'matrix-diagram');
});

test('the software prioritization matrix question now renders its criterion-weighted data table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = question(bank, 275);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.columns), ['Product', 'Ease of Use (50%)', 'Low Cost (25%)', 'Time to Install (25%)']);
  assert.equal(q.chart.rows.length, 4);
  assert.equal(q.options[q.answer], 'Product C');
});

test('the work-location survey question now renders its preference table with the exact source percentages', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = question(bank, 321);
  assert.equal(q.chart.type, 'data-table');
  const rows = Object.fromEntries(q.chart.rows.map(r => [r[0], r[1]]));
  assert.equal(rows['In-office full-time'], '12%');
  assert.equal(rows['Hybrid'], '45%');
  assert.equal(rows['Work from home full-time'], '33%');
});

test('the "calculate the mean" question now renders the Bounds/Frequency table instead of cramped inline text', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = question(bank, 335);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.columns), ['Bounds', 'Frequency']);
  assert.deepEqual(Array.from(q.chart.rows).map(r => Array.from(r)), [['10–29', '14'], ['30–49', '10'], ['50–69', '5'], ['70–89', '4']]);
  assert.equal(q.options[q.answer], '38.89');
});

test('the u-chart capability comparison question now renders the Process/Capability table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = question(bank, 391);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.rows).map(r => Array.from(r)), [['A', '2.31'], ['B', '0.67'], ['C', '1.67'], ['D', '1.33']]);
  assert.equal(q.options[q.answer], 'Process B');
});

test('the defect-tally question now renders the Defect Type/Tally table with the Total row', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = question(bank, 398);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.rows).map(r => Array.from(r)), [['A', '12'], ['B', '29'], ['C', '10'], ['D', '4'], ['Total', '55']]);
  assert.equal(q.options[q.answer], '0.105');
});

test('the chi-square goodness-of-fit (defect type) question now renders its historical-vs-observed table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = question(bank, 419);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.columns), ['Defect Type', 'Length', 'Weight', 'Strength']);
  assert.equal(q.options[q.answer], 'The test statistic = 4.286 and the critical value = 5.991.');
  assert.match(q.stem, /χ²crit = 5\.991/);
  assert.match(q.why, /χ² = .*4\.286/);
});

test('Q434-Q436 each carry the complete FMEA table and match their current-state and post-action answers', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q1 = question(bank, 434);
  const q2 = question(bank, 435);
  const q3 = question(bank, 436);
  [q1, q2, q3].forEach(q => assert.match(q.stem, /FMEA table below/i));
  assert.deepEqual(JSON.parse(JSON.stringify(q1.chart)), JSON.parse(JSON.stringify(q2.chart)));
  assert.deepEqual(JSON.parse(JSON.stringify(q2.chart)), JSON.parse(JSON.stringify(q3.chart)));
  // Row 3 has severity 10 (highest) with RPNs tied at 150 -- matches q1's why field
  const row3 = q1.chart.rows.find(r => r[0] === '3');
  assert.equal(row3[1], '10'); // severity (current)
  assert.equal(row3[4], '150'); // RPN (current)
  // After action, Row 1 has the highest RPN at 60 -- matches q3's why field
  const row1 = q1.chart.rows.find(r => r[0] === '1');
  assert.equal(row1[8], '60'); // RPN (after)
  assert.equal(q1.options[q1.answer], '3');
  assert.equal(q3.options[q3.answer], 'Row 1');
});

test('Q487-Q488 each carry the complete prioritization matrix and match their weighted-score explanations', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q1 = question(bank, 487);
  const q2 = question(bank, 488);
  [q1, q2].forEach(q => assert.match(q.stem, /prioritization matrix.*below/i));
  assert.deepEqual(JSON.parse(JSON.stringify(q1.chart)), JSON.parse(JSON.stringify(q2.chart)));
  assert.equal(q1.chart.type, 'data-table');
  assert.equal(q1.options[q1.answer], 'Positive impact on the customer');
  assert.equal(q2.options[q2.answer], 'Solution B');
});

test('Q254, Q255, Q620, and Q621 use one neutral nine-area house-of-quality diagram with source numbering', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const questions = [254, 255, 620, 621].map(number => question(bank, number));
  const expectedAnswers = ['Area 7', 'Area 1', 'Area 3', 'Area 9'];

  questions.forEach((q, index) => {
    assert.equal(q.chart.type, 'house-of-quality');
    assert.deepEqual(Object.keys(q.chart), ['type'], 'the unanswered diagram has no answer-revealing highlight metadata');
    assert.match(q.stem, /numbered house-of-quality diagram below/i);
    assert.equal(q.options[q.answer], expectedAnswers[index]);

    const svg = window.__TB.renderQuestionChart(q.chart);
    assert.match(svg, /Area 9 is the triangular roof/);
    assert.doesNotMatch(svg, /highlight|Relationships|Correlations|Target values|Customer requirements/i);
    const areaIds = Array.from(svg.matchAll(/data-hoq-area="(\d+)"/g), match => Number(match[1])).sort((a, b) => a - b);
    assert.deepEqual(areaIds, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    q.options.forEach(option => {
      const match = option.match(/^Area (\d)$/);
      assert.ok(match && areaIds.includes(Number(match[1])), `${option} maps to a visible numbered area`);
    });
  });

  const rendered = questions.map(q => window.__TB.renderQuestionChart(q.chart));
  rendered.slice(1).forEach(svg => assert.equal(svg, rendered[0], 'all four questions render the same neutral source diagram'));
});

test('Q540-Q541 render the component tolerance table and keep exact ± half-width choices', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const conventional = question(bank, 540);
  const statistical = question(bank, 541);
  assert.deepEqual(JSON.parse(JSON.stringify(conventional.chart)), JSON.parse(JSON.stringify(statistical.chart)));
  assert.equal(conventional.chart.type, 'data-table');
  assert.deepEqual(Array.from(conventional.chart.rows).map(r => Array.from(r)), [
    ['A', '±0.5'],
    ['B', '±0.2'],
    ['C', '±0.3']
  ]);
  assert.deepEqual(Array.from(conventional.options), ['±0.62', '±1.0', '±2.0', '±6.8']);
  assert.deepEqual(Array.from(statistical.options), ['±0.62', '±1.0', '±2.0', '±6.8']);
  assert.equal(conventional.options[conventional.answer], '±1.0');
  assert.equal(statistical.options[statistical.answer], '±0.62');
});

test('Q653 renders the completed two-way ANOVA source table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = question(bank, 653);
  assert.equal(q.chart.type, 'data-table');
  const rows = Object.fromEntries(q.chart.rows.map(r => [r[0], r]));
  assert.deepEqual(Array.from(rows['Factor A']), ['Factor A', '344', '3', '114.67', '7.45']);
  assert.deepEqual(Array.from(rows['AB Interaction']), ['AB Interaction', '120', '12', '10', '?']);
  assert.equal(q.options[q.answer], '0.65');
});

test('Q661 renders its job-shop data and uses consistent chi-square notation', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = question(bank, 661);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.columns), ['', 'Part A', 'Part B', 'Part C']);
  assert.deepEqual(Array.from(q.chart.rows).map(r => Array.from(r)), [
    ["Last year's percentage", '25%', '50%', '25%'],
    ["Last month's observed units", '340', '600', '360'],
    ["Last month's expected units", '325.0', '650.0', '325.0']
  ]);
  assert.equal(q.options[q.answer], 'χ² = 8.308; χ² critical value = 5.991');
  assert.match(q.stem, /χ² critical value = 5\.991/);
  assert.match(q.why, /χ² = .*8\.308/);
  q.options.forEach(o => assert.doesNotMatch(o, /\d\.\d+\s\d/, o + ' has no stray mid-number space'));
});

test('renderQuestionChart produces well-formed markup for every restored data-table chart with no NaN/undefined leakage', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const restoredQuestionNumbers = [211, 275, 321, 335, 391, 398, 419, 434, 435, 436, 487, 488, 540, 541, 653, 661];
  restoredQuestionNumbers.forEach(number => {
    const q = question(bank, number);
    const out = window.__TB.renderQuestionChart(q.chart);
    assert.doesNotMatch(out, /NaN/, `Q${number}`);
    assert.doesNotMatch(out, /undefined/, `Q${number}`);
    assert.match(out, /<table/, `Q${number} renders a table element`);
  });
});

test('Set 3 still has exactly 694 questions after the visual-restoration pass', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.length, 694);
});

test('shared-chart questions are independently worded and each embeds the complete visual', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.filter(q => /\busing the same\b/i.test(q.stem)).length, 0);

  const sharedGroups = [
    [254, 255],
    [272, 273],
    [434, 435, 436],
    [487, 488],
    [540, 541],
    [620, 621]
  ];
  sharedGroups.forEach(group => {
    const questions = group.map(number => question(bank, number));
    questions.forEach((q, index) => {
      assert.match(q.stem, /(below|shown)/i, `Q${group[index]} identifies its own visual`);
      assert.ok(q.chart, `Q${group[index]} embeds its visual`);
    });
    const firstChart = JSON.parse(JSON.stringify(questions[0].chart));
    questions.slice(1).forEach((q, index) => {
      assert.deepEqual(JSON.parse(JSON.stringify(q.chart)), firstChart, `Q${group[index + 1]} carries the shared chart`);
    });
  });
});
