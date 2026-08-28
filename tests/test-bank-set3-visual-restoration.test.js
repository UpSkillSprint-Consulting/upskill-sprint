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

function findQuestion(bank, stemPrefix) {
  return bank.find(q => q.stem.startsWith(stemPrefix));
}

// Each of these questions was identified via a cross-reference against the
// source study-guide visual index as depending on a table/diagram that was
// missing from CSSBB Set 3. This suite pins the restored chart data so a
// future edit can't silently drop it again.

test('the ROI question now renders the Year/Cost/Benefit cash-flow table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'Using the cash flows shown, calculate the discounted return on investment (ROI)');
  assert.ok(q, 'question found');
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
  const typeQ = findQuestion(bank, 'Use the matrix diagram below to answer this question and the next. What type of matrix');
  const partBQ = findQuestion(bank, 'A manufacturer compares manufacturing sites, products, customers, and shipping companies');
  assert.ok(typeQ && partBQ);
  assert.deepEqual(JSON.parse(JSON.stringify(typeQ.chart)), JSON.parse(JSON.stringify(partBQ.chart)));
  assert.equal(typeQ.chart.type, 'matrix-diagram');
});

test('the software prioritization matrix question now renders its criterion-weighted data table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'A prioritization matrix was created by a team to choose which software product');
  assert.ok(q);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.columns), ['Product', 'Ease of Use (50%)', 'Low Cost (25%)', 'Time to Install (25%)']);
  assert.equal(q.chart.rows.length, 4);
  assert.equal(q.options[q.answer], 'Product C');
});

test('the work-location survey question now renders its preference table with the exact source percentages', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, "A survey was conducted to gather employees' opinions on work locations");
  assert.ok(q);
  assert.equal(q.chart.type, 'data-table');
  const rows = Object.fromEntries(q.chart.rows.map(r => [r[0], r[1]]));
  assert.equal(rows['In-office full-time'], '12%');
  assert.equal(rows['Hybrid'], '45%');
  assert.equal(rows['Work from home full-time'], '33%');
});

test('the "calculate the mean" question now renders the Bounds/Frequency table instead of cramped inline text', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'Calculate the mean using the frequency table shown below.');
  assert.ok(q);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.columns), ['Bounds', 'Frequency']);
  assert.deepEqual(Array.from(q.chart.rows).map(r => Array.from(r)), [['10-29', '14'], ['30-49', '10'], ['50-69', '5'], ['70-89', '4']]);
  assert.equal(q.options[q.answer], '38.89');
});

test('the u-chart capability comparison question now renders the Process/Capability table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'Four stable processes are monitored using u-charts');
  assert.ok(q);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.rows).map(r => Array.from(r)), [['A', '2.31'], ['B', '0.67'], ['C', '1.67'], ['D', '1.33']]);
  assert.equal(q.options[q.answer], 'Process B');
});

test('the defect-tally question now renders the Defect Type/Tally table with the Total row', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'Units are each inspected for four types of defects.');
  assert.ok(q);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.rows).map(r => Array.from(r)), [['A', '12'], ['B', '29'], ['C', '10'], ['D', '4'], ['Total', '55']]);
  assert.equal(q.options[q.answer], '0.105');
});

test('the chi-square goodness-of-fit (defect type) question now renders its historical-vs-observed table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'A Black Belt performs chi-square goodness-of-fit test with alpha = 0.05 to determine whether the distribution of defect types');
  assert.ok(q);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.columns), ['Defect Type', 'Length', 'Weight', 'Strength']);
  assert.equal(q.options[q.answer], 'The test statistic = 4.286 and the critical value = 5.991.');
});

test('all three FMEA questions (Q53-55) share one restored table matching the current-state and post-action RPNs used in their own why fields', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q1 = findQuestion(bank, 'Use the FMEA table below');
  const q2 = findQuestion(bank, 'Using the same FMEA table, give the rows');
  const q3 = findQuestion(bank, 'Using the same FMEA table, after action has been taken');
  assert.ok(q1 && q2 && q3, 'all three FMEA questions found');
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

test('both improve-phase prioritization matrix questions (Q61-62) share one restored table matching their own weighted-score why fields', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q1 = findQuestion(bank, 'A team scores four potential solutions against four weighted criteria');
  const q2 = findQuestion(bank, 'Using the same prioritization matrix, which potential solution');
  assert.ok(q1 && q2);
  assert.deepEqual(JSON.parse(JSON.stringify(q1.chart)), JSON.parse(JSON.stringify(q2.chart)));
  assert.equal(q1.chart.type, 'data-table');
  assert.equal(q1.options[q1.answer], 'Positive impact on the customer');
  assert.equal(q2.options[q2.answer], 'Solution B');
});

test('both Part B house-of-quality questions (Q75-76) highlight a box that actually exists in this renderer\'s 8-box diagram, and the highlighted box\'s own label matches what the question asks about', async () => {
  // chartHouseOfQuality hardcodes exactly 8 boxes (ids 1-8); there is no box 9.
  // Box 4 is labelled "Relationships" and box 2 is the roof, labelled "Correlations".
  // The original source-guide answer text ("Area 3" / "Area 9") used the textbook's
  // own numbering, which does not match this renderer's box ids -- copying those
  // numbers verbatim produced a highlight that pointed at the wrong box (Q75) or at
  // no box at all (Q76, box 9 doesn't exist). This pins the corrected, renderer-
  // consistent version instead.
  const { window } = await load();
  const bank = set3Bank(window);
  const q1 = findQuestion(bank, 'Use the house of quality diagram below to answer this question and the next. The relationship matrix');
  const q2 = findQuestion(bank, 'Using the same house of quality diagram, the relationship between technical requirements');
  assert.ok(q1 && q2);
  assert.equal(q1.chart.type, 'house-of-quality');

  const svg1 = window.__TB.renderQuestionChart(q1.chart);
  const svg2 = window.__TB.renderQuestionChart(q2.chart);

  // Q75 asks about "the relationship matrix" -- the renderer's box 4 is the one
  // literally labelled "Relationships", so the highlighted box must be box 4,
  // and "Area 4" must be an answerable option.
  assert.equal(q1.chart.highlight, '4');
  assert.match(svg1, /<text[^>]*>4<\/text>[\s\S]*?Relationships/);
  assert.equal(q1.options[q1.answer], 'Area 4');

  // Q76 asks about the correlations between technical requirements -- that's the
  // roof, which the renderer labels "Correlations (roof)" and ids as box 2.
  assert.equal(q2.chart.highlight, '2');
  assert.match(svg2, /<text[^>]*>2<\/text>[\s\S]*?Correlations/);
  assert.equal(q2.options[q2.answer], 'Area 2');

  // No option on either question should reference a box this diagram doesn't have.
  [q1, q2].forEach(q => {
    q.options.forEach(opt => {
      const n = opt.match(/Area (\d+)/)[1];
      assert.ok(Number(n) >= 1 && Number(n) <= 8, opt + ' refers to a box that exists in the 8-box diagram');
    });
  });
});

test('the Part B assembly-tolerance question (Q6) now renders the Part A/B/C dimension table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'Using the conventional method, calculate the total tolerance of the assembly shown below.');
  assert.ok(q);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.rows).map(r => Array.from(r)), [
    ['A', '1.20 \u00b1 0.05'],
    ['B', '2.50 \u00b1 0.10'],
    ['C', '2.0 \u00b1 0.50']
  ]);
  assert.equal(q.options[q.answer], '0.65');
});

test('the Part B two-way ANOVA question (Q108) now renders the completed source table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'Given the two-way ANOVA table below, what is the F-statistic for the AB interaction?');
  assert.ok(q);
  assert.equal(q.chart.type, 'data-table');
  const rows = Object.fromEntries(q.chart.rows.map(r => [r[0], r]));
  assert.deepEqual(Array.from(rows['Factor A']), ['Factor A', '344', '3', '114.67', '7.45']);
  assert.deepEqual(Array.from(rows['AB Interaction']), ['AB Interaction', '120', '12', '10', '?']);
  assert.equal(q.options[q.answer], '0.65');
});

test('the Part B chi-square job-shop question (Q116) now renders the last-year/last-month table', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'A job shop makes three metal parts.');
  assert.ok(q);
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.columns), ['', 'Part A', 'Part B', 'Part C']);
  assert.equal(q.options[q.answer], 'Chi-sq = 8.308, Chi-square critical = 5.991');
  q.options.forEach(o => assert.doesNotMatch(o, /\d\.\d+\s\d/, o + ' has no stray mid-number space'));
});

test('renderQuestionChart produces well-formed markup for every restored data-table chart with no NaN/undefined leakage', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const restoredStemPrefixes = [
    'Using the cash flows shown, calculate the discounted return on investment',
    'A prioritization matrix was created by a team to choose which software product',
    "A survey was conducted to gather employees' opinions on work locations",
    'Calculate the mean using the frequency table shown below.',
    'Four stable processes are monitored using u-charts',
    'Units are each inspected for four types of defects.',
    'A Black Belt performs chi-square goodness-of-fit test with alpha = 0.05 to determine whether the distribution of defect types',
    'Use the FMEA table below',
    'A team scores four potential solutions against four weighted criteria',
    'Using the conventional method, calculate the total tolerance of the assembly shown below.',
    'Given the two-way ANOVA table below',
    'A job shop makes three metal parts.'
  ];
  restoredStemPrefixes.forEach(prefix => {
    const q = findQuestion(bank, prefix);
    assert.ok(q, 'found: ' + prefix);
    const out = window.__TB.renderQuestionChart(q.chart);
    assert.doesNotMatch(out, /NaN/, prefix);
    assert.doesNotMatch(out, /undefined/, prefix);
    assert.match(out, /<table/, prefix + ' renders a table element');
  });
});

test('Set 3 still has exactly 694 questions after the visual-restoration pass', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.length, 694);
});

test('"using the same" follow-up questions never say "below" -- the shared visual was already introduced by the first question in the pair', async () => {
  // House style (established by the pre-existing Q19/Q46/etc. pairs): the first
  // question in a shared-visual pair says "...below" once; every follow-up question
  // says "Using the same X, ..." with no second "below". Two of the newly restored
  // pairs (Q13 and Q62) drifted from this convention on the first pass.
  const { window } = await load();
  const bank = set3Bank(window);
  const followUps = bank.filter(q => q.stem.startsWith('Using the same'));
  assert.ok(followUps.length > 5, 'sanity: there are several shared-visual follow-up questions');
  followUps.forEach(q => {
    assert.doesNotMatch(q.stem, /same [a-z ]+ below/i, q.stem);
  });
});

test('the two newly-restored house-of-quality questions (Q75-76) only offer "Area N" options that exist in this renderer\'s 8-box diagram', async () => {
  // Narrower, PR-scoped version of the box-existence guard above. NOTE: the two
  // pre-existing HOQ questions (idx253/254, shipped in an earlier PR, out of scope
  // here) also list "Area 9" as a distractor even though this renderer has no box 9
  // -- harmless since it's never the highlighted/correct box, but worth a mention
  // if this file is revisited. This test only covers the two questions this PR
  // actually restored, where the guard fully applies.
  const { window } = await load();
  const bank = set3Bank(window);
  const q1 = findQuestion(bank, 'Use the house of quality diagram below to answer this question and the next. The relationship matrix');
  const q2 = findQuestion(bank, 'Using the same house of quality diagram, the relationship between technical requirements');
  [q1, q2].forEach(q => {
    const svg = window.__TB.renderQuestionChart(q.chart);
    const boxIds = Array.from(svg.matchAll(/<text[^>]*font-weight="700"[^>]*>(\d+)<\/text>/g)).map(m => m[1]);
    q.options.forEach(opt => {
      const m = opt.match(/Area (\d+)/);
      assert.ok(m && boxIds.includes(m[1]), opt + ' references a box id that exists in this diagram (' + boxIds.join(',') + ')');
    });
    assert.ok(boxIds.includes(String(q.chart.highlight)), 'highlight ' + q.chart.highlight + ' matches a real box');
  });
});
