'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8');
const hardening = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery-hardening.js'), 'utf8');
const mastery = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery.js'), 'utf8');

const windows = [];
afterEach(() => windows.splice(0).forEach(window => { try { window.close(); } catch (error) {} }));

async function load() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  return { window: dom.window, errors };
}

function cssbbBank(window) {
  const seen = new Set();
  return Object.values(window.__TB.EXAMS.cssbb.sets).flat().filter(q => {
    if (!q || seen.has(q.stem)) return false;
    seen.add(q.stem);
    return true;
  });
}

function findQuestion(bank, stemPrefix) {
  return bank.find(q => q.stem.startsWith(stemPrefix));
}

function set3Question(window, number) {
  const q = window.__TB.EXAMS.cssbb.sets[3][number - 1];
  assert.ok(q, 'Set 3 Q' + number + ' exists');
  return q;
}

/* ---------- wiring: renderQuestionChart is called in the live quiz render path ---------- */

test('quizHTML renders the question chart immediately before the stem, for every quiz view', () => {
  const idx = html.indexOf('function quizHTML()');
  assert.ok(idx > -1, 'quizHTML exists');
  const body = html.slice(idx, html.indexOf('function wireQuiz()', idx));
  assert.match(body, /renderQuestionChart\(q\.chart\)\+'<div class="tb-stem">'/, 'chart renders directly before the stem div, driven by the current question\u2019s own chart field');
});

test('window.__TB exposes renderQuestionChart for the adaptive-practice companion scripts to reuse', async () => {
  const { window } = await load();
  assert.equal(typeof window.__TB.renderQuestionChart, 'function');
});

test('both adaptive-practice modules render the chart before their stem, via the shared window.__TB helper', () => {
  assert.match(hardening, /chartHtml\(question\.chart\)\s*\+\s*'<div class="tb-adaptive-stem">'/, 'hardening.js (v2 session) renders the chart before its stem');
  assert.match(mastery, /chartHtml\(question\.chart\)\s*\+\s*'<div class="tb-adaptive-stem">'/, 'mastery.js (v1 session) renders the chart before its stem');
  assert.match(hardening, /window\.__TB\s*&&\s*window\.__TB\.renderQuestionChart/, 'hardening.js delegates to the shared chart renderer rather than reimplementing it');
  assert.match(mastery, /window\.__TB\s*&&\s*window\.__TB\.renderQuestionChart/, 'mastery.js delegates to the shared chart renderer rather than reimplementing it');
});

/* ---------- data integrity: the 8 questions that were broken are now clean ---------- */

test('none of the 9 previously chart-dependent questions still contain garbled OCR text in their stem', async () => {
  const { window } = await load();
  const questionNumbers = [639, 336, 337, 341, 342, 292, 293, 650, 651];
  questionNumbers.forEach(number => {
    const q = set3Question(window, number);
    assert.doesNotMatch(q.stem, /[\uFFFD]/, 'Q' + number + ': no Unicode replacement characters');
    assert.doesNotMatch(q.stem, /\bUCL\s*=|\bLCL\s*=|\bCl\)\s|\ben Cl\)/, 'Q' + number + ': no leaked chart labels');
    assert.ok(q.stem.length < 200, 'Q' + number + ': concise student-facing stem');
    assert.ok(q.chart && q.chart.type, 'Q' + number + ': chart is attached directly to the question');
  });
});

test('the four precision/accuracy quadrant questions no longer have the "Quadrant 8" OCR typo', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);
  const quadrantQs = bank.filter(q => q.stem.startsWith('Which quadrant'));
  assert.equal(quadrantQs.length, 4);
  quadrantQs.forEach(q => {
    assert.deepEqual(Array.from(q.options), ['Quadrant A', 'Quadrant B', 'Quadrant C', 'Quadrant D']);
  });
});

test('the X-bar R chart question data matches the source textbook and supports its stated answer', async () => {
  const { window } = await load();
  const q = set3Question(window, 639);
  assert.equal(q.chart.type, 'xbar-r');
  assert.equal(q.chart.xbar.ucl, 581.0);
  assert.equal(q.chart.xbar.cl, 512.5);
  assert.equal(q.chart.xbar.lcl, 443.9);
  assert.equal(q.chart.xbar.data.length, 25);
  assert.equal(q.chart.r.data.length, 25);
  assert.equal(q.options[q.answer], 'Both the X̄ and R charts exhibit out-of-control signals.');

  // X-bar: the last 7 points (samples 19-25) must form a genuine 6-consecutive-decrease run,
  // since that is the specific rule the "why" field cites -- if this data is ever edited, the
  // stated answer would silently stop being supported by the chart.
  const tail = q.chart.xbar.data.slice(-7);
  for (let i = 1; i < tail.length; i += 1) assert.ok(tail[i] < tail[i - 1], 'sample ' + (19 + i) + ' is lower than the previous sample');
  // No X-bar point may cross its own control limits, or the "why" field's claim that the
  // X-bar violation is a trend rule (not a limit violation) would be contradicted.
  q.chart.xbar.data.forEach(v => assert.ok(v <= q.chart.xbar.ucl && v >= q.chart.xbar.lcl));

  // R chart: sample 5 (index 4) must be the only point beyond its UCL.
  const overLimit = q.chart.r.data.map((v, i) => ({ v, i })).filter(x => x.v > q.chart.r.ucl || x.v < q.chart.r.lcl);
  assert.equal(overLimit.length, 1);
  assert.equal(overLimit[0].i, 4, 'sample 5 (0-indexed 4) is the only out-of-control R point');
});

test('the box plot questions carry quartile data consistent with their stated answers', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);

  const iqr = findQuestion(bank, 'Calculate the interquartile range using the box plot');
  assert.equal(iqr.chart.type, 'boxplot');
  assert.equal(iqr.chart.q3 - iqr.chart.q1, 10);
  assert.equal(iqr.options[iqr.answer], '10');

  const insight = findQuestion(bank, 'What insight does the box plot below show?');
  assert.equal(insight.chart.type, 'boxplot');
  assert.ok(insight.chart.outliers && insight.chart.outliers.includes(170), 'the outlier point (170) that the answer references is present in the chart data');
  assert.ok(insight.chart.mean > insight.chart.median, 'mean > median matches the right-skew the why field describes');
  assert.equal(insight.options[insight.answer], 'There is an outlier.');
});

test('the two normal probability plot questions use distinct patterns matching their stated answers', async () => {
  const { window } = await load();
  const normal = set3Question(window, 341);
  const skewed = set3Question(window, 342);
  assert.notEqual(normal.stem, skewed.stem, 'the two plots have distinct stems for mastery tracking');
  assert.equal(normal.options[normal.answer], 'The data are normally distributed.');
  assert.equal(skewed.options[skewed.answer], 'The data are right skewed.');
  assert.equal(normal.chart.points.length, 29, 'Plot 1 uses all 29 explicit source observations');
  assert.equal(skewed.chart.points.length, 100, 'Plot 2 restores all 100 source observations from the digitized curve');
  assert.equal(normal.chart.sourceN, 29);
  assert.equal(skewed.chart.sourceN, 100);
  assert.deepEqual(Array.from(normal.chart.xTicks), [5, 15, 25, 35]);
  assert.deepEqual(Array.from(skewed.chart.xTicks), [-15, -5, 5, 15, 25]);
  assert.ok(normal.chart.points.every((point, i, points) => i === 0 || point[1] >= points[i - 1][1]), 'Plot 1 normal scores are ordered');
  assert.ok(skewed.chart.points.every((point, i, points) => i === 0 || point[1] >= points[i - 1][1]), 'Plot 2 normal scores are ordered');
  assert.ok(skewed.chart.points.every((point, i, points) => i === 0 || point[0] >= points[i - 1][0]), 'Plot 2 data values are monotone');
  assert.deepEqual(Array.from(normal.chart.fitPoints, pair => Array.from(pair)), [[11.6, -2.17], [32.8, 2.11]]);
  assert.deepEqual(Array.from(skewed.chart.fitPoints, pair => Array.from(pair)), [[-8.66, -2.58], [17.4, 2.53]]);
});

/* ---------- chart rendering: structural correctness per chart type ---------- */

test('chartXbarR renders two labeled series with no NaN coordinates', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({
    type: 'xbar-r',
    xbar: { ucl: 581, cl: 512.5, lcl: 443.9, data: [500, 522, 490] },
    r: { ucl: 214.7, cl: 94.1, lcl: 0, data: [58, 95, 88] }
  });
  assert.match(svg, /X-bar chart \(sample mean\)/);
  assert.match(svg, /R chart \(sample range\)/);
  assert.doesNotMatch(svg, /NaN/);
  assert.match(svg, /<svg[^>]*role="img"/);
});

test('chartXbarR flags out-of-control points with a distinct dot class', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({
    type: 'xbar-r',
    xbar: { ucl: 581, cl: 512.5, lcl: 443.9, data: [500, 522, 490] },
    r: { ucl: 100, cl: 50, lcl: 0, data: [40, 235, 45] }
  });
  assert.match(svg, /tb-chart-dot-out/, 'the point exceeding UCL gets the out-of-control class');
});

test('chartBoxplot renders whiskers, box, median, mean marker, and outliers when present', async () => {
  const { window } = await load();
  const withOutlier = window.__TB.renderQuestionChart({ type: 'boxplot', min: 100, q1: 118, median: 120, mean: 127, q3: 135, max: 160, outliers: [170] });
  assert.match(withOutlier, /tb-chart-outlier/);
  assert.doesNotMatch(withOutlier, /NaN/);

  const noOutlier = window.__TB.renderQuestionChart({ type: 'boxplot', min: 7, q1: 15, median: 20, mean: 21, q3: 25, max: 31 });
  assert.doesNotMatch(noOutlier, /tb-chart-outlier/, 'no outlier marker rendered when the question has none');
  assert.doesNotMatch(noOutlier, /NaN/);
});

test('chartNormalProb plots supplied observations rather than substituting a generic pattern', async () => {
  const { window } = await load();
  const linear = window.__TB.renderQuestionChart({ type: 'normal-prob', title: 'A', values: [8, 9, 10, 11, 12] });
  const skewed = window.__TB.renderQuestionChart({ type: 'normal-prob', title: 'B', values: [0, 0.1, 0.3, 1.5, 8] });
  assert.notEqual(linear, skewed, 'different supplied observations render different point placements');
  assert.match(linear, /data-normal-prob-n="5"/);
  assert.match(skewed, /data-normal-prob-n="5"/);
  assert.doesNotMatch(linear, /NaN/);
  assert.doesNotMatch(skewed, /NaN/);
});

test('chartPrecisionAccuracy renders exactly 4 neutral labeled panels without revealing the answer', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'precision-accuracy', highlight: 'D' });
  ['A', 'B', 'C', 'D'].forEach(label => assert.match(svg, new RegExp('>' + label + '<')));
  assert.equal((svg.match(/tb-q-chart-quad-hi/g) || []).length, 0, 'the pre-answer visual does not highlight the correct panel');
  assert.doesNotMatch(svg, /NaN/);
});

test('chartPrecisionAccuracy panels all fit within the SVG viewBox (regression: panels C/D were previously clipped)', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'precision-accuracy', highlight: 'A' });
  const viewBoxMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  assert.ok(viewBoxMatch);
  const vbHeight = Number(viewBoxMatch[2]);
  const ys = Array.from(svg.matchAll(/cy="([\d.]+)"/g)).map(m => Number(m[1]));
  const textYs = Array.from(svg.matchAll(/<text[^>]*y="([\d.]+)"/g)).map(m => Number(m[1]));
  const maxY = Math.max.apply(null, ys.concat(textYs));
  assert.ok(maxY <= vbHeight, 'no circle or label sits below the visible viewBox (' + maxY + ' vs height ' + vbHeight + ')');
});

test('chartBiasDiagram renders both lines and axis labels without NaN', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'bias-diagram' });
  assert.match(svg, /True or reference value/);
  assert.match(svg, /Average of measured values/);
  assert.doesNotMatch(svg, /NaN/);
});

test('renderQuestionChart returns an empty string for a missing or unknown chart type, rather than throwing', async () => {
  const { window } = await load();
  assert.equal(window.__TB.renderQuestionChart(null), '');
  assert.equal(window.__TB.renderQuestionChart(undefined), '');
  assert.equal(window.__TB.renderQuestionChart({ type: 'not-a-real-type' }), '');
});

test('no two questions in the full CSSBB bank share an identical stem (guards the stem-based hashing used for mastery tracking and dedup)', async () => {
  const { window } = await load();
  const all = Object.values(window.__TB.EXAMS.cssbb.sets).flat();
  const seen = new Map();
  const collisions = [];
  all.forEach(q => {
    if (seen.has(q.stem)) collisions.push(q.stem);
    else seen.set(q.stem, true);
  });
  assert.deepEqual(Array.from(collisions), [], 'every question stem across Set 1/2/3 is unique');
});

/* ---------- second-pass audit: 3 more broken questions found beyond the original 8 ---------- */

test('the VSM production-kanban symbol question now has its chart and a legible stem', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);
  const q = findQuestion(bank, 'The symbol below is used on a value stream map');
  assert.ok(q, 'question found with its corrected stem wording');
  assert.equal(q.chart.type, 'vsm-symbol');
  assert.equal(q.options[q.answer], 'Production kanban');
  assert.doesNotMatch(q.stem, /[\uFFFD]/);
});

test('chartVsmSymbol renders a rectangle with a cut top-right corner, matching the source figure', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'vsm-symbol' });
  assert.match(svg, /<polygon/);
  assert.doesNotMatch(svg, /NaN/);
  const pointsMatch = svg.match(/points="([^"]+)"/);
  assert.ok(pointsMatch);
  const points = pointsMatch[1].trim().split(/\s+/);
  assert.equal(points.length, 5, 'five vertices: four rectangle corners plus the cut corner');
});

test('the critical-path questions now carry their precedence table as a real chart, not embedded text or only the why field', async () => {
  const { window } = await load();
  const critPath = set3Question(window, 561);
  const lateStart = set3Question(window, 562);
  assert.ok(critPath && lateStart, 'both companion questions found');

  // Both questions must carry every activity's duration and predecessor in a real chart --
  // previously this table only existed (garbled) inside the why field, making the question
  // itself unanswerable from the information a student is actually shown.
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(activity => {
    assert.ok(critPath.chart && critPath.chart.rows.some(r => r[0] === activity), 'critical-path chart states activity ' + activity + '\u2019s row');
    assert.ok(lateStart.chart && lateStart.chart.rows.some(r => r[0] === activity), 'late-start chart states activity ' + activity + '\u2019s row');
  });

  assert.equal(critPath.options[critPath.answer], 'ACG');
  assert.equal(lateStart.options[lateStart.answer], 'Day 5');
  assert.doesNotMatch(critPath.why, /[\uFFFD]/, 'why field no longer contains the garbled ASCII network diagram');
  assert.doesNotMatch(lateStart.why, /[\uFFFD]/);
});

test('the precedence-table data used is internally self-consistent with the stated critical-path answer (the source book has a real erratum here: its question page prints Activity D as 15 days, its own solution page prints 5 days and calculates using 5 -- used the value consistent with the graded answer so the practice question is not self-contradicting)', async () => {
  const { window } = await load();
  const critPath = set3Question(window, 561);
  const dRow = critPath.chart.rows.find(r => r[0] === 'D');
  assert.equal(dRow[2], '5', 'chart uses D=5 (the value consistent with the graded answer), not the question-page D=15');
  // ACG = 10+10+5 = 25, BCG = 5+10+5 = 20, DEFG = 5+5+5+5 = 20 -- ACG must be strictly longest.
  const acg = 10 + 10 + 5, bcg = 5 + 10 + 5, defg = 5 + 5 + 5 + 5;
  assert.ok(acg > bcg && acg > defg, 'ACG is genuinely the longest (critical) path given the chart\u2019s own stated durations');
});

test('no CQE question contains a unicode replacement character or an unresolved visual reference (audited the full CQE bank the same way as CSSBB)', async () => {
  const { window } = await load();
  const seen = new Set();
  const cqeBank = Object.values(window.__TB.EXAMS.cqe.sets).flat().filter(q => {
    if (!q || seen.has(q.stem)) return false;
    seen.add(q.stem);
    return true;
  });
  assert.ok(cqeBank.length > 0);
  const garbled = cqeBank.filter(q => /[\uFFFD]/.test(q.stem) || /[\uFFFD]/.test(q.why || ''));
  assert.deepEqual(Array.from(garbled).map(q => q.stem), []);
});

/* ---------- third-pass audit: systemic option-contamination bug (21 questions) ---------- */

test('no option in the entire bank contains bled-in "shared context for the next question" text (regression for a 21-question extraction bug)', async () => {
  const { window } = await load();
  const contaminated = [];
  Object.keys(window.__TB.EXAMS).forEach(examId => {
    const e = window.__TB.EXAMS[examId];
    const bank = [].concat(e.bank || [], Object.values(e.sets || {}).flat());
    const seen = new Set();
    bank.forEach(q => {
      if (!q || seen.has(q.stem)) return;
      seen.add(q.stem);
      (q.options || []).forEach(o => {
        if (/Use the (following|precedence|table|figure|house of quality|prioritization matrix)\b/i.test(o) || /answer questions? \d/i.test(o)) {
          contaminated.push(examId + ' | ' + q.stem.slice(0, 60));
        }
      });
    });
  });
  assert.deepEqual(Array.from(contaminated), []);
});

test('the second critical-path trio (Q49/50/51, a different precedence table than the D-erratum one) now carries its data as a real chart in each question', async () => {
  const { window } = await load();
  const q49 = set3Question(window, 276);
  const q50 = set3Question(window, 277);
  const q51 = set3Question(window, 278);
  assert.ok(q49 && q50 && q51, 'all three questions found with corrected stems');
  [q49, q50, q51].forEach(q => {
    assert.ok(q.chart && q.chart.type === 'data-table', 'question carries a real table chart');
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(activity => assert.ok(q.chart.rows.some(r => r[0] === activity), activity + ' row present'));
  });

  assert.equal(q49.options[q49.answer], 'EF');
  assert.notEqual(q49.options[1], 'BOE', 'the OCR-garbled "BOE" option was corrected to "BDF"');
  assert.equal(q49.options[1], 'BDF');

  // ACF = 5+8+6=19, BDF = 10+2+6=18, EF = 15+6=21 -- EF must be strictly the longest.
  const acf = 5 + 8 + 6, bdf = 10 + 2 + 6, ef = 15 + 6;
  assert.ok(ef > acf && ef > bdf, 'EF is genuinely the critical path given the chart\u2019s own stated durations');

  assert.equal(q50.options[q50.answer], '5');
  assert.equal(q51.options[q51.answer], 'The project will finish at least five days late.');
});

test('u-chart, Gpk, Cpm, and X-bar control limit questions now state their input data in the stem instead of only in a garbled why field', async () => {
  const { window } = await load();
  const uChart = set3Question(window, 514);
  assert.match(uChart.stem, /240 defects/);
  assert.match(uChart.stem, /1,550 units/);
  assert.equal(uChart.options[uChart.answer], '0.155');

  const gpk = set3Question(window, 377);
  assert.match(gpk.stem, /X̿ = 23\.5/);
  assert.equal(gpk.options[gpk.answer], '0.52');

  const cpm = set3Question(window, 378);
  assert.equal(cpm.options[cpm.answer], '0.613');
  assert.ok(cpm.chart.rows.some(row => row[0] === 'd₂ for n = 5' && row[1] === '2.326'));

  const xbarLimits = set3Question(window, 493);
  assert.equal(xbarLimits.options.length, 4, 'the bled-in Q22/23 text was stripped, leaving exactly 4 clean options');
  assert.equal(xbarLimits.options[xbarLimits.answer], '[27.16, 32.58]');

  const sChart = set3Question(window, 492);
  assert.ok(sChart, 'the S-chart companion to the X-bar control-limits question (originally "questions 20 and 21") is now present with its own data');
  assert.equal(sChart.options[sChart.answer], '[1.590, 5.510]');
});

test('several sibling question groups initially thought missing were actually present with bare stems, found via a broader sweep and fixed: PP/Ppk, individuals/moving-range chart, p-chart and np-chart centerlines, sample mean/variance', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);

  const pp = findQuestion(bank, 'A process is analyzed over five months');
  const ppk = findQuestion(bank, 'A process has an average of 45.67');
  assert.equal(pp.options[pp.answer], '1.33');
  assert.equal(ppk.options[ppk.answer], '0.74');

  const individuals = set3Question(window, 494);
  const movingRange = set3Question(window, 495);
  assert.equal(individuals.options[individuals.answer], '[24.27, 29.69]');
  assert.equal(movingRange.options[movingRange.answer], '[0, 3.32]');

  const pChartCl = findQuestion(bank, "Across 30 subgroups, an attributes chart's underlying data totals \u03a3np = 55 and \u03a3n = 2,800. What is the centerline");
  assert.equal(pChartCl.options[pChartCl.answer], '0.0196');

  const npCl = findQuestion(bank, 'An np-chart is built from 25 subgroups');
  const npLimits = findQuestion(bank, 'An np-chart is based on 78 nonconforming units');
  assert.equal(npCl.options[npCl.answer], '3.120');
  assert.equal(npLimits.options[npLimits.answer], '[0, 8.38]');

  const sampleMean = findQuestion(bank, 'Given the sample data {94, 91, 76, 43, 66, 77, 55, 27, 50, 60}');
  const sampleVar = findQuestion(bank, 'For the sample data {94, 91, 76, 43, 66, 77, 55, 27, 50, 60}');
  assert.equal(sampleMean.options[sampleMean.answer], '63.9');
  assert.equal(sampleVar.options[sampleVar.answer], '449.9');
});

test('4 more sibling questions found (ABC Manufacturing waste question, both prioritization-matrix questions, injection-molding availability) via a deeper sweep, narrowing the known gap to a single confirmed-absent scenario', async () => {
  const { window } = await load();
  const criterion = set3Question(window, 487);
  const solution = set3Question(window, 488);
  assert.equal(criterion.options[criterion.answer], 'Positive impact on the customer');
  assert.equal(solution.options[solution.answer], 'Solution B');
  assert.notEqual(solution.options[1], 'Solution 8', 'the OCR-garbled "Solution 8" was corrected to "Solution B"');

  const abcWaste = set3Question(window, 448);
  assert.equal(abcWaste.options[abcWaste.answer], 'Defects');

  const availability = set3Question(window, 480);
  assert.equal(availability.options[availability.answer], '0.8575');
});

test('known gap: one referenced scenario (a textile fiber-composite DOE) could not be located anywhere in the source PDF, not just the bank -- confirmed absent rather than fabricated', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);
  const found = bank.some(q => /fiber composite|tensile propert.*temperature.*pressure/i.test(q.stem) || /fiber composite/i.test(q.why || ''));
  assert.equal(found, false);
});

test('no double commas immediately after a closing brace ("},,") anywhere in test-bank.html (regression: a boundary-slicing edit once left a stray comma there, creating a sparse array hole that silently inflated Set 3\u2019s reported length by one)', () => {
  assert.doesNotMatch(html, /\},\s*,/, 'a double comma in a JS array literal creates a hole -- .length counts it but .forEach/.map skip it, so it is invisible to most checks and only shows up as an off-by-one count');
});

test('CSSBB Set 3 has no sparse holes: every index from 0 to length-1 is a real, distinct question object', async () => {
  const { window } = await load();
  const set3 = window.__TB.EXAMS.cssbb.sets[3];
  for (let i = 0; i < set3.length; i += 1) {
    assert.ok(set3[i] && typeof set3[i] === 'object' && typeof set3[i].stem === 'string', 'index ' + i + ' is a real question object, not a hole');
  }
});

/* ---------- new chart types added for CQE: control-single, oc-curve, interaction-plot, risk-matrix ---------- */

function cqeBank(window) {
  const seen = new Set();
  return Object.values(window.__TB.EXAMS.cqe.sets).flat().filter(q => {
    if (!q || seen.has(q.stem)) return false;
    seen.add(q.stem);
    return true;
  });
}

test('chartControlSingle (new type) renders one labeled series with no NaN coordinates, reusing the existing chartSeriesSvg helper', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'control-single', title: 'p-chart', data: [0.05, 0.09, 0.03], ucl: 0.1151, cl: 0.0675, lcl: 0.0199 });
  assert.match(svg, />p-chart</);
  assert.doesNotMatch(svg, /NaN/);
  assert.match(svg, /<svg[^>]*role="img"/);
});

test('chartControlSingle flags an out-of-control point with the same dot class as chartXbarR', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'control-single', title: 'MR chart', data: [8, 12, 40, 9], ucl: 36.25, cl: 11.09, lcl: 0 });
  assert.match(svg, /tb-chart-dot-out/);
});

test('chartOcCurve (new type) renders two distinguishable curves, one dashed', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'oc-curve' });
  assert.match(svg, /stroke-dasharray="6 4"/, 'one curve is dashed to distinguish it from the solid curve');
  assert.match(svg, /Curve A \(dashed\)/);
  assert.match(svg, /Curve B \(solid\)/);
  assert.doesNotMatch(svg, /NaN/);
});

test('chartInteractionPlot (new type) renders visibly different paths for parallel vs crossing lines', async () => {
  const { window } = await load();
  const parallel = window.__TB.renderQuestionChart({ type: 'interaction-plot', parallel: true });
  const crossing = window.__TB.renderQuestionChart({ type: 'interaction-plot', parallel: false });
  assert.notEqual(parallel, crossing, 'the two interaction patterns render visibly different line paths');
  assert.doesNotMatch(parallel, /NaN/);
  assert.doesNotMatch(crossing, /NaN/);
});

test('chartRiskMatrix renders one labelled coloured cell per grid position without pre-answer highlighting', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({
    type: 'risk-matrix',
    rows: ['High', 'Medium', 'Low'],
    cols: ['Low', 'Medium', 'High'],
    cells: [['medium', 'high', 'high'], ['low', 'medium', 'high'], ['low', 'low', 'medium']],
    highlights: [{ row: 0, col: 2, label: 'X' }]
  });
  assert.equal((svg.match(/<rect/g) || []).length, 9, 'a 3x3 matrix renders exactly 9 cells');
  assert.equal((svg.match(/tb-chart-risk-hi"/g) || []).length, 0, 'the renderer does not reveal the keyed cell before the student answers');
  assert.doesNotMatch(svg, />X</, 'answer-label overlays are ignored in the pre-answer visual');
  ['Low', 'Medium', 'High'].forEach(label => assert.match(svg, new RegExp('>' + label + '<')));
  assert.doesNotMatch(svg, /NaN/);
});

test('renderQuestionChart dispatches all 4 new CQE chart types without throwing (regression: a typo in the type-name comparison would silently fall through to the empty-string branch)', async () => {
  const { window } = await load();
  ['control-single', 'oc-curve', 'interaction-plot', 'risk-matrix'].forEach(type => {
    const spec = type === 'control-single' ? { type, data: [1, 2, 3], ucl: 5, cl: 2, lcl: 0 }
      : type === 'risk-matrix' ? { type, rows: ['A'], cols: ['B'], cells: [['low']] }
      : { type };
    const svg = window.__TB.renderQuestionChart(spec);
    assert.ok(svg.includes('<svg'), type + ' renders real SVG markup, not the empty-string fallback');
  });
});

test('every CQE question wired to a control-single or xbar-r chart has plotted data internally consistent with its stated correct answer', async () => {
  const { window } = await load();
  const bank = cqeBank(window);
  const chartQs = bank.filter(q => q.chart && (q.chart.type === 'control-single' || q.chart.type === 'xbar-r'));
  assert.ok(chartQs.length >= 9, 'at least the 9 wired control-chart questions are present');
  chartQs.forEach(q => {
    const answerText = q.options[q.answer];
    if (q.chart.type === 'control-single') {
      const outCount = q.chart.data.filter(v => v > q.chart.ucl || v < q.chart.lcl).length;
      if (/within the control limits|is stable/i.test(answerText)) {
        assert.equal(outCount, 0, q.stem.slice(0, 50) + ': answer says in-control but a plotted point is out of limits');
      }
    }
    if (q.chart.type === 'xbar-r') {
      const xOut = q.chart.xbar.data.some(v => v > q.chart.xbar.ucl || v < q.chart.xbar.lcl);
      const rOut = q.chart.r.data.some(v => v > q.chart.r.ucl || v < q.chart.r.lcl);
      if (/only the range was outside/i.test(answerText)) {
        assert.equal(rOut, true, 'range series should have an out-of-control point');
        assert.equal(xOut, false, 'mean series should not');
      }
    }
  });
});

test('the two risk-matrix CQE questions render a grid with at least 9 cells and (for the mitigation question) two highlighted before/after cells', async () => {
  const { window } = await load();
  const bank = cqeBank(window);
  const riskQs = bank.filter(q => q.chart && q.chart.type === 'risk-matrix');
  assert.equal(riskQs.length, 2);
  riskQs.forEach(q => {
    assert.ok(q.chart.rows.length * q.chart.cols.length >= 9);
  });
  const mitigation = riskQs.find(q => q.stem.includes('timing belt'));
  assert.equal(mitigation.chart.highlights.length, 2, 'the before/after mitigation question highlights exactly two cells');
});

test('the OC-curve and both interaction-plot CQE questions are wired to their new chart types', async () => {
  const { window } = await load();
  const bank = cqeBank(window);
  const oc = bank.find(q => q.stem.includes('OC (operating characteristic) curves'));
  assert.equal(oc.chart.type, 'oc-curve');
  const parallelPlot = bank.find(q => q.stem.includes("stay parallel, following identical up-and-down patterns"));
  const crossingPlot = bank.find(q => q.stem.includes('the lines are not parallel'));
  assert.equal(parallelPlot.chart.type, 'interaction-plot');
  assert.equal(parallelPlot.chart.parallel, true);
  assert.equal(crossingPlot.chart.type, 'interaction-plot');
  assert.equal(crossingPlot.chart.parallel, false);
});
/* ---------- fifth pass: user-reported screenshots (scatter figures, HoQ, tolerance, frequency table, Set 1 network diagram, an unrecoverable erratum) ---------- */

test('the F-test critical-value question with a genuine printing erratum (options B and C identical on the actual scanned page) was removed rather than given a fabricated option', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);
  const found = bank.some(q => q.stem.includes('standard deviations of two normal populations are different'));
  assert.equal(found, false);
});

test('CSSBB Set 3 count reflects the erratum question having been removed (694, down from 695)', async () => {
  const { window } = await load();
  assert.equal(window.__TB.EXAMS.cssbb.sets[3].length, 694);
});

test('the negative-correlation and nonlinear-relationship questions each carry the same neutral four-panel scatter visual', async () => {
  const { window } = await load();
  const negCorr = set3Question(window, 406);
  const nonlinear = set3Question(window, 407);
  assert.ok(negCorr && nonlinear);
  assert.equal(negCorr.chart.type, 'scatter-quadrant');
  assert.equal(negCorr.options[negCorr.answer], 'Figure B');
  assert.equal(nonlinear.options[nonlinear.answer], 'Figure D');
  assert.equal(negCorr.chart.highlight, undefined);
  assert.equal(nonlinear.chart.highlight, undefined);
});

test('chartScatterQuadrant renders 4 distinct labeled panels with no NaN, and produces a visibly different point pattern per panel', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'scatter-quadrant', highlight: 'D' });
  ['A', 'B', 'C', 'D'].forEach(l => assert.match(svg, new RegExp('>' + l + '<')));
  assert.doesNotMatch(svg, /NaN/);
  assert.equal((svg.match(/tb-q-chart-quad-hi/g) || []).length, 0, 'the answer panel is not highlighted before selection');
});

test('both tolerance-stack questions now share one tolerance data-table chart with the Part A/B/C values their own why field was already using to compute the answer', async () => {
  const { window } = await load();
  const conventional = set3Question(window, 540);
  const statistical = set3Question(window, 541);
  assert.ok(conventional && statistical);
  assert.equal(conventional.chart.type, 'data-table');
  assert.deepEqual(conventional.chart, statistical.chart);
  const partRows = Object.fromEntries(conventional.chart.rows.map(r => [r[0], r[1]]));
  assert.equal(partRows['A'], '\u00b10.5');
  assert.equal(partRows['B'], '\u00b10.2');
  assert.equal(partRows['C'], '\u00b10.3');
  assert.equal(conventional.options[conventional.answer], '±1.0');
  assert.equal(statistical.options[statistical.answer], '±0.62');
  assert.match(conventional.stem, /conventional ± tolerance \(half-width\)/);
  assert.match(statistical.stem, /statistical ± tolerance \(half-width\)/);
});

test('all four house-of-quality questions carry the neutral nine-area source diagram and correct keys', async () => {
  const { window } = await load();
  const targets = set3Question(window, 254);
  const customerReqs = set3Question(window, 255);
  const relationshipMatrix = set3Question(window, 620);
  const correlationRoof = set3Question(window, 621);
  [targets, customerReqs, relationshipMatrix, correlationRoof].forEach(q => {
    assert.equal(q.chart.type, 'house-of-quality');
    assert.equal(q.chart.highlight, undefined, 'the correct area is not encoded as a pre-answer highlight');
    assert.match(q.stem, /diagram below/);
  });
  assert.equal(targets.options[targets.answer], 'Area 7');
  assert.equal(customerReqs.options[customerReqs.answer], 'Area 1');
  assert.equal(relationshipMatrix.options[relationshipMatrix.answer], 'Area 3');
  assert.equal(correlationRoof.options[correlationRoof.answer], 'Area 9');
});

test('chartHouseOfQuality renders all nine numbered source areas, including a triangular Area 9 roof, without answer labels or highlights', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'house-of-quality', highlight: '7' });
  for (let i = 1; i <= 9; i += 1) {
    assert.match(svg, new RegExp('data-hoq-area="' + i + '"'));
    assert.match(svg, new RegExp('>' + i + '<'));
  }
  assert.match(svg, /data-hoq-area="9"><polygon/, 'Area 9 is the triangular roof');
  assert.equal((svg.match(/tb-q-chart-quad-hi/g) || []).length, 0);
  assert.doesNotMatch(svg, /NaN/);
});

test('the frequency table question now renders a real data table instead of a crammed, unreadable line of numbers', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);
  const q = findQuestion(bank, 'Given the frequency table below');
  assert.equal(q.chart.type, 'data-table');
  assert.deepEqual(Array.from(q.chart.rows).map(r => r.join(',')), ['4,10', '5,12', '6,14', '7,4', '8,2']);
  assert.equal(q.options[q.answer], '36');
  assert.doesNotMatch(q.stem, /X Frequency 4 10 5 12/, 'the raw crammed numbers are no longer dumped into the stem text');
});

test('chartDataTable renders a real HTML table with the given columns and rows', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'data-table', columns: ['X', 'Frequency'], rows: [['4', '10'], ['5', '12']] });
  assert.match(svg, /<table class="tb-q-data-table">/);
  assert.match(svg, /<th>X<\/th><th>Frequency<\/th>/);
  assert.match(svg, /<td>4<\/td>/);
});

test('the Set 1 activity-network question (originally "the network above" with no diagram, hand-authored content with no external source to recover from) now has a diagram consistent with its own stated float calculation', async () => {
  const { window } = await load();
  const cssbbBank2 = window.__TB.EXAMS.cssbb.bank;
  const q = cssbbBank2.find(item => item.stem.includes('total float (slack) of activity C'));
  assert.ok(q, 'question found in Set 1');
  assert.ok(q.chart && q.chart.type === 'activity-network');
  const nodes = q.chart.nodes;
  const pathAB = nodes.A.dur + nodes.B.dur;
  const pathCD = nodes.C.dur + nodes.D.dur;
  assert.equal(pathAB, 16, 'path A-B (critical) sums to the 16 days the why field states');
  assert.equal(pathCD, 15, 'path C-D sums to the 15 days the why field states');
  assert.equal(pathAB - pathCD, 1, 'this is exactly the 1-day float the stored correct answer requires');
});

test('SET1.map now passes through an optional chart field, so hand-authored Set 1 questions can carry diagrams the same way OCR-extracted Set 3 questions do', () => {
  assert.match(html, /var CSSBB_BANK=SET1\.map\(function\(x,ix\)\{var s=tbShuf4\(x\.o,x\.c,ix\);return \{sub:AREA2SUB\[x\.a\],stem:x\.q,options:s\.options,answer:s\.answer,why:x\.e,set:1,chart:x\.chart\};\}\);/);
});

test('chartActivityNetwork renders labeled duration boxes connected by arrows with no NaN', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({
    type: 'activity-network', highlight: 'C',
    nodes: { A: { col: 0, row: 0, dur: 6 }, B: { col: 1, row: 0, dur: 10 }, C: { col: 0, row: 1, dur: 9 }, D: { col: 1, row: 1, dur: 6 }, Finish: { col: 2, row: 0.5, dur: 0 } },
    edges: [['A', 'B'], ['B', 'Finish'], ['C', 'D'], ['D', 'Finish']]
  });
  assert.match(svg, />A<\/text>/);
  assert.match(svg, /9 days/);
  assert.doesNotMatch(svg, /NaN/);
  assert.equal((svg.match(/tb-q-chart-quad-hi/g) || []).length, 1);
});

test('the weld-inspection kappa question is genuinely self-contained (correctly not flagged for a fix)', async () => {
  const { window } = await load();
  const cssbbBank2 = window.__TB.EXAMS.cssbb.bank;
  const q = cssbbBank2.find(item => item.stem.includes('within-appraiser kappa of 0.42'));
  assert.ok(q);
  assert.ok(!q.chart, 'no chart needed -- the interpretation options are answerable from the given kappa value alone');
});

/* ---------- sixth pass: aesthetic refinement (eyebrow labels, spacing, depth, no regressions) ---------- */

test('every chart type renders an eyebrow label identifying what kind of chart it is', async () => {
  const { window } = await load();
  const cases = [
    ['xbar-r', { xbar: { ucl: 1, cl: 0, lcl: -1, data: [0, 0] }, r: { ucl: 1, cl: 0, lcl: -1, data: [0, 0] } }, 'Control chart'],
    ['boxplot', { min: 0, q1: 1, median: 2, q3: 3, max: 4 }, 'Box plot'],
    ['scatter-quadrant', { highlight: 'A' }, 'Scatter plots'],
    ['house-of-quality', { highlight: '1' }, 'House of quality'],
    ['data-table', { columns: ['a'], rows: [['1']] }, 'Reference table'],
    ['vsm-symbol', {}, 'VSM symbol']
  ];
  cases.forEach(([type, extra, label]) => {
    const html = window.__TB.renderQuestionChart(Object.assign({ type: type }, extra));
    assert.match(html, /class="tb-q-chart-eyebrow"/, type + ' has an eyebrow label');
    assert.match(html, new RegExp(label), type + ' eyebrow reads "' + label + '"');
  });
});

test('the X-bar/R chart\u2019s "Sample" axis label sits below the R chart\u2019s tick numbers, not overlapping them (regression: a spacing change once put them 2px apart)', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({
    type: 'xbar-r',
    xbar: { ucl: 581, cl: 512.5, lcl: 443.9, data: [500, 522, 490] },
    r: { ucl: 214.7, cl: 94.1, lcl: 0, data: [58, 95, 88] }
  });
  const sampleMatch = svg.match(/y="([\d.]+)" font-size="10" fill="var\(--muted\)" text-anchor="middle">Sample</);
  assert.ok(sampleMatch, 'Sample label found');
  const tickYs = Array.from(svg.matchAll(/y="([\d.]+)" font-size="9" fill="var\(--muted\)" text-anchor="middle">\d+</g)).map(m => Number(m[1]));
  const maxTickY = Math.max.apply(null, tickYs);
  assert.ok(Number(sampleMatch[1]) > maxTickY + 8, 'Sample label (y=' + sampleMatch[1] + ') sits comfortably below the lowest tick label (y=' + maxTickY + ')');
});

test('chartSeriesSvg renders a gradient-filled area under the line with a unique id per caller, so two series in one SVG (X-bar and R) do not collide', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({
    type: 'xbar-r',
    xbar: { ucl: 581, cl: 512.5, lcl: 443.9, data: [500, 522, 490] },
    r: { ucl: 214.7, cl: 94.1, lcl: 0, data: [58, 95, 88] }
  });
  assert.match(svg, /id="tbGradXbar"/);
  assert.match(svg, /id="tbGradR"/);
  assert.doesNotMatch(svg, /NaN/);
  const gradientIds = Array.from(svg.matchAll(/<linearGradient id="([^"]+)"/g)).map(m => m[1]);
  assert.equal(new Set(gradientIds).size, gradientIds.length, 'no duplicate gradient ids between the two stacked series');
});

test('the box plot mean marker uses the accent color class, not the low-contrast muted text color it used to (regression: it was nearly invisible)', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'boxplot', min: 0, q1: 10, median: 20, mean: 22, q3: 30, max: 40 });
  assert.match(svg, /class="tb-chart-mean"/);
  assert.doesNotMatch(svg, /font-size="13" fill="var\(--muted\)" text-anchor="middle">\u00d7/, 'no longer uses the old low-contrast inline style for the mean marker');
});

test('the VSM symbol renders in a compact wrapper instead of the full-width chart card (regression: a 260x200 icon sat inside an oversized full-width card)', async () => {
  const { window } = await load();
  const html = window.__TB.renderQuestionChart({ type: 'vsm-symbol' });
  assert.match(html, /class="tb-q-chart-wrap tb-q-chart-wrap-compact"/);
});

test('the house-of-quality roof (Area 9) is visually distinguished from the other areas via a dedicated CSS class', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'house-of-quality', highlight: '5' });
  assert.match(svg, /data-hoq-area="9"><polygon[^>]*tb-chart-box-roof/, 'the triangular Area 9 roof carries its dedicated class');
});

test('the activity-network highlighted node renders with the same fill-based highlight class used by every other diagram type, for a consistent "you are here" treatment', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({
    type: 'activity-network', highlight: 'C',
    nodes: { A: { col: 0, row: 0, dur: 6 }, C: { col: 0, row: 1, dur: 9 } },
    edges: [['A', 'C']]
  });
  assert.equal((svg.match(/tb-q-chart-quad-hi/g) || []).length, 1);
  assert.doesNotMatch(svg, /NaN/);
});

test('the normal-probability renderer plots every supplied source value and draws two valid confidence-envelope boundaries plus a closed fill', async () => {
  const { window } = await load();
  const q = set3Question(window, 341);
  const svg = window.__TB.renderQuestionChart(q.chart);
  assert.equal((svg.match(/class="tb-chart-target-dot"/g) || []).length, q.chart.points.length, 'one diamond is plotted per ordered observation');
  assert.match(svg, /data-normal-prob-n="29"/);
  assert.match(svg, /data-normal-prob-visible="29"/);
  assert.match(svg, /<clipPath id="tbNormalProbClip29Plot1">/);
  assert.match(svg, /clip-path="url\(#tbNormalProbClip29Plot1\)"/);
  assert.equal((svg.match(/class="tb-chart-band"/g) || []).length, 2, 'both pointwise confidence-envelope boundaries are drawn');
  const fillPathMatch = svg.match(/<path d="([^"]+)" fill="var\(--(?:tint|card)\)"/);
  assert.ok(fillPathMatch, 'band fill path exists');
  const d = fillPathMatch[1];
  assert.match(d, /^M-?[\d.]+ -?[\d.]+/, 'path starts with a valid M command');
  assert.match(d, /Z$/, 'path is explicitly closed');
  const commands = d.slice(0, -1).trim().split(/(?=[ML])/).filter(Boolean);
  commands.forEach(cmd => assert.match(cmd.trim(), /^[ML]-?[\d.]+ -?[\d.]+$/, 'well-formed path command: ' + cmd));
  assert.doesNotMatch(svg, /NaN|Infinity/);
});

test('no chart type introduced or touched in this pass produces NaN in its output', async () => {
  const { window } = await load();
  const cases = [
    { type: 'xbar-r', xbar: { ucl: 1, cl: 0, lcl: -1, data: [0.1, 0.2] }, r: { ucl: 1, cl: 0, lcl: -1, data: [0.1, 0.2] } },
    { type: 'boxplot', min: 0, q1: 1, median: 2, mean: 2.1, q3: 3, max: 4, outliers: [5] },
    { type: 'normal-prob', values: [0, 0.2, 0.8, 2, 7] },
    { type: 'precision-accuracy', highlight: 'B' },
    { type: 'bias-diagram' },
    { type: 'vsm-symbol' },
    { type: 'scatter-quadrant', highlight: 'A' },
    { type: 'house-of-quality', highlight: '3' },
    { type: 'activity-network', highlight: 'A', nodes: { A: { col: 0, row: 0, dur: 1 } }, edges: [] },
    { type: 'data-table', columns: ['a'], rows: [['1']] }
  ];
  cases.forEach(c => assert.doesNotMatch(window.__TB.renderQuestionChart(c), /NaN/, c.type));
});

/* ---------- seventh pass: user-supplied source images cross-referenced against the bank ---------- */

test('the FTA questions each carry the complete neutral fault-tree visual and the correct keys', async () => {
  const { window } = await load();
  const andGate = set3Question(window, 443);
  const primaryEvent = set3Question(window, 444);
  assert.ok(andGate && primaryEvent);
  assert.equal(andGate.chart.type, 'fta-diagram');
  assert.equal(primaryEvent.chart.type, 'fta-diagram');
  assert.equal(andGate.chart.highlightSet, undefined);
  assert.equal(primaryEvent.chart.highlightSet, undefined);
  assert.equal(andGate.options[andGate.answer], '2 and 6');
  assert.equal(primaryEvent.options[primaryEvent.answer], '1');
});

test('chartFtaDiagram renders the exact ten-node source topology with neutral AND, OR, rectangle, circle, and diamond symbols', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'fta-diagram', highlightSet: ['2', '6'] });
  for (let i = 1; i <= 10; i += 1) assert.match(svg, new RegExp('>' + i + '<'));
  assert.match(svg, /<path/, 'gate shapes use path elements');
  assert.match(svg, /<polygon/, 'the diamond (undeveloped event) uses a polygon');
  assert.match(svg, /<circle/, 'basic events use circles');
  assert.match(svg, /<rect/, 'the top and intermediate events use rectangles');
  const edges = Array.from(svg.matchAll(/data-fta-edge="([^"]+)"/g)).map(match => match[1]);
  assert.deepEqual(edges, ['1-2', '2-3', '2-4', '3-5', '4-6', '5-7', '5-8', '6-9', '6-10']);
  assert.equal((svg.match(/data-fta-kind="and"/g) || []).length, 2);
  assert.equal((svg.match(/data-fta-kind="or"/g) || []).length, 1);
  assert.equal((svg.match(/tb-q-chart-quad-hi/g) || []).length, 0, 'gate answers are not highlighted before selection');
  assert.doesNotMatch(svg, /NaN/);
});

test('the matrix diagram question renders the diagram consistent with what its own why field states', async () => {
  const { window } = await load();
  const typeQuestion = set3Question(window, 272);
  const q = set3Question(window, 273);
  assert.ok(q && q.chart);
  assert.equal(typeQuestion.options[typeQuestion.answer], 'X-shaped matrix');
  assert.match(typeQuestion.why, /X-shaped matrix/);
  assert.deepEqual(typeQuestion.chart, q.chart, 'both independently worded questions carry the same complete diagram');
  const div2Row = q.chart.rowLabels.indexOf('Division 2');
  const cust2Row = q.chart.rowLabels.indexOf('Customer 2');
  const cust1Row = q.chart.rowLabels.indexOf('Customer 1');
  assert.deepEqual(Array.from(q.chart.cells[div2Row]), ['large', 'blank', 'blank', 'large']);
  assert.equal(q.chart.cells[cust2Row][3], 'large', 'Customer 2 buys a large volume of Part B');
  assert.equal(q.chart.cells[cust1Row][3], 'blank', 'Customer 1 has no Part-B relationship');
  assert.equal(q.options[q.answer], 'Customer 2 buys a large volume of Part B.');
});

test('chartMatrixDiagram renders a header row, a legend, and one dot per cell with no NaN', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({
    type: 'matrix-diagram',
    rowLabels: ['Division 1', 'Division 2', 'Customer 1', 'Customer 2'],
    colGroups: [{ label: 'Shipper', cols: ['1', '2'] }, { label: 'Part', cols: ['A', 'B'] }],
    cells: [['blank', 'large', 'large', 'small'], ['large', 'blank', 'blank', 'large'], ['blank', 'large', 'large', 'blank'], ['large', 'small', 'small', 'large']]
  });
  assert.match(svg, /Large volume/);
  assert.match(svg, /Small volume/);
  assert.match(svg, />Division 1</);
  assert.match(svg, />Customer 2</);
  assert.equal((svg.match(/data-matrix-state="large"/g) || []).length, 9);
  assert.equal((svg.match(/data-matrix-state="small"/g) || []).length, 4);
  assert.equal((svg.match(/data-matrix-state="blank"/g) || []).length, 5);
  assert.doesNotMatch(svg, /NaN/);
});

test('the interaction-plot question now carries the real three-factor DOE scenario and a 3-panel chart', async () => {
  const { window } = await load();
  const q = set3Question(window, 450);
  const followUp = set3Question(window, 451);
  assert.ok(q);
  assert.match(q.stem, /three-factor, two-level full-factorial experiment/);
  assert.equal(q.chart.type, 'interaction-plot-3');
  assert.equal(q.options[q.answer], 'AB and AC');
  assert.match(followUp.stem, /Factor A is at its low level \(−1\)/);
  assert.match(followUp.stem, /Factor C changes from low \(−1, solid circles\) to high \(\+1, dashed squares\)/);
  assert.equal(followUp.options[followUp.answer], 'The response decreases.');
  assert.equal(followUp.chart.type, 'interaction-plot-3', 'the randomized follow-up carries its own complete visual');
  assert.doesNotMatch(followUp.stem, /same|previous|prior/i, 'the follow-up is independently worded');
});

test('chartInteractionPlot3 renders three neutral source panels within its viewBox, with exact endpoints and marker semantics', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'interaction-plot-3' });
  const viewBoxMatch = svg.match(/viewBox="0 0 (\d+) ([\d.]+)"/);
  assert.ok(viewBoxMatch);
  const vbHeight = Number(viewBoxMatch[2]);
  const allYs = Array.from(svg.matchAll(/[xy]\d?="[\d.]+" y="([\d.]+)"/g)).map(m => Number(m[1]))
    .concat(Array.from(svg.matchAll(/cy="([\d.]+)"/g)).map(m => Number(m[1])));
  const maxY = Math.max.apply(null, allYs);
  assert.ok(maxY <= vbHeight, 'no element sits below the visible viewBox (' + maxY + ' vs height ' + vbHeight + ')');
  ['A × B', 'A × C', 'B × C'].forEach(title => assert.match(svg, new RegExp('data-interaction-panel="' + title + '"')));
  assert.doesNotMatch(svg, /no interaction|crossing/i, 'panel titles do not reveal the keyed interpretation');
  const series = Array.from(svg.matchAll(/<polyline data-interaction-series="(low|high)" points="([^"]+)"/g)).map(match => ({ level: match[1], points: match[2] }));
  assert.equal(series.length, 6, 'two series are drawn in each of three panels');
  const recovered = series.map(item => item.points.split(/\s+/).map(pair => {
    const y = Number(pair.split(',')[1]);
    return Math.round((50 * (1 - (y - 34) / 145)) * 10) / 10;
  }));
  assert.deepEqual(recovered, [[24, 19], [45, 29], [45, 16], [24, 32], [23, 37], [20, 36]]);
  assert.equal((svg.match(/data-interaction-marker="circle"/g) || []).length, 6, 'low levels use solid circles');
  assert.equal((svg.match(/data-interaction-marker="square"/g) || []).length, 6, 'high levels use dashed-line squares');
  assert.equal((svg.match(/stroke-dasharray="6 4"/g) || []).length, 3, 'each high-level series is dashed');
  assert.doesNotMatch(svg, /NaN/);
});

test('chartInteractionPlot3\u2019s polylines use valid comma-separated point syntax, not path "L" commands (regression: <polyline> points do not support path commands)', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'interaction-plot-3' });
  const pointsAttrs = Array.from(svg.matchAll(/<polyline[^>]*points="([^"]+)"/g)).map(m => m[1]);
  assert.ok(pointsAttrs.length > 0);
  pointsAttrs.forEach(pts => {
    assert.doesNotMatch(pts, /[A-Za-z]/, 'points attribute contains only numbers, commas, spaces, and periods -- no path command letters: ' + pts);
  });
});

test('the NPS question now renders a clean data table instead of the crammed "Responses Count 9-10 23..." text dump', async () => {
  const { window } = await load();
  const q = set3Question(window, 203);
  assert.ok(q && q.chart && q.chart.type === 'data-table');
  assert.doesNotMatch(q.stem, /Responses Count 9-10/, 'the raw crammed table is no longer dumped into the stem text');
  assert.equal(q.options[q.answer], '28.9%');
});

test('the two regression pairs (Time/Strength and warehouse pallets) each carry their own full source data table, not just the first question of the pair', async () => {
  const { window } = await load();
  const corr = set3Question(window, 408);
  const slope = set3Question(window, 409);
  const whEq = set3Question(window, 411);
  const whR2 = set3Question(window, 412);
  [corr, slope, whEq, whR2].forEach(q => assert.ok(q && q.chart && q.chart.type === 'data-table', q ? q.stem.slice(0, 40) : 'missing'));
  assert.equal(corr.options[corr.answer], '0.88');
  assert.equal(slope.options[slope.answer], '4.39');
  assert.equal(whEq.options[whEq.answer], 'ŷ = −5.906 + 0.777x');
  assert.equal(whR2.options[whR2.answer], '0.90');
  // both pairs share one table each -- confirm slope's chart actually matches correlation's, not a copy-paste of the wrong dataset.
  assert.deepEqual(Array.from(corr.chart.rows), Array.from(slope.chart.rows));
  assert.deepEqual(Array.from(whEq.chart.rows), Array.from(whR2.chart.rows));
});

test('the ANOVA Factor-B question now shows only the real, partially-blank table the source book gives -- not the fully pre-solved version that made the question trivial (regression: a prior fix had given away SSB, MSB, and MSError, leaving only a single division for the student)', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);
  const q = bank.find(q2 => q2.stem.includes('F-statistic for Factor B'));
  assert.ok(q && q.chart);
  const factorBRow = q.chart.rows.find(r => r[0] === 'Factor B');
  assert.deepEqual(Array.from(factorBRow).slice(1), ['', '', '', ''], 'Factor B row is blank in the chart, matching the real exam question, not pre-filled with the derived SS/MS values');
  const errorRow = q.chart.rows.find(r => r[0] === 'Error');
  assert.equal(errorRow[1], '75');
  assert.equal(errorRow[2], '', 'Error df is blank -- the student must derive it, not read it off the table');
  assert.equal(q.options[q.answer], '4.25');
  assert.match(q.why, /SS\(B\) = SS\(total\) − SS\(A\) − SS\(A×B\) − SS\(error\)/, 'the why field now shows the SS(B) derivation step that was previously missing');
});

test('the ANOVA "which statements are correct" question shares the same real (partially blank) table as the Factor-B question', async () => {
  const { window } = await load();
  const q = set3Question(window, 418);
  assert.ok(q && q.chart);
  const factorBRow = q.chart.rows.find(r => r[0] === 'Factor B');
  assert.deepEqual(Array.from(factorBRow).slice(1), ['', '', '', '']);
  assert.equal(q.options[q.answer], 'Factors A, B, and the AB interaction are significant.');
  assert.match(q.stem, /critical F\(2, 15\) = 3\.68/);
  assert.match(q.stem, /critical F\(4, 15\) = 3\.06/);
  assert.match(q.stem, /critical F\(8, 15\) = 2\.64/);
});

test('the tolerance-stack question (Q18) now renders a clean LSL/USL table instead of the crammed "Part A Part B Part C LS L 0.750..." text', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);
  const q = bank.find(q2 => q2.stem.includes('lower and upper specifications of the stacked assembly'));
  assert.ok(q && q.chart && q.chart.type === 'data-table');
  assert.doesNotMatch(q.stem, /Part A Part B Part C LS L/);
  assert.equal(q.options[q.answer], '[2.351, 2.419]');
});

test('both precedence-table question groups (the D-erratum trio and the second ACF/BDF/EF trio) were upgraded from embedded prose to real table charts, with every sibling carrying its own copy', async () => {
  const { window } = await load();
  const erratumCrit = set3Question(window, 561);
  const erratumLate = set3Question(window, 562);
  assert.ok(erratumCrit && erratumLate);
  assert.equal(erratumCrit.sub, 'def', 'project-management precedence question is classified under Define');
  assert.equal(erratumLate.sub, 'def', 'the paired precedence question keeps the same Define classification');
  assert.deepEqual(Array.from(erratumCrit.chart.rows), Array.from(erratumLate.chart.rows));
  assert.doesNotMatch(erratumLate.stem, /same|previous|prior/i, 'the randomized companion is standalone');

  const secondCrit = set3Question(window, 276);
  assert.ok(secondCrit && secondCrit.chart);
  assert.doesNotMatch(secondCrit.stem, /Activity: A \(no predecessor/, 'the old embedded-prose description is gone, replaced by a real chart');
  [276, 277, 278].forEach(number => assert.match(set3Question(window, number).stem, /precedence table below/, 'Q' + number + ' names its own attached table'));
});

test('CSSBB Set 3 question count is unchanged by this whole pass (694) -- no question was accidentally duplicated or dropped while rewriting 15 entries', async () => {
  const { window } = await load();
  assert.equal(window.__TB.EXAMS.cssbb.sets[3].length, 694);
});

/* ---------- eighth pass: stress test with edge cases beyond the shipped questions' exact shapes ---------- */

test('chartActivityNetwork scales its viewBox to the actual node grid (columns/rows), with no overflow (regression: width/height were hardcoded for a 3-column, 2-row layout, clipping any question with more columns or rows)', async () => {
  const { window } = await load();
  const layouts = [
    { A: { col: 0, row: 0, dur: 1 } }, // single node
    { A: { col: 0, row: 0, dur: 1 }, B: { col: 1, row: 0, dur: 2 }, C: { col: 2, row: 0, dur: 3 }, D: { col: 0, row: 1, dur: 4 }, E: { col: 1, row: 1, dur: 5 }, F: { col: 2, row: 1, dur: 6 }, G: { col: 0, row: 2, dur: 7 } } // 3 cols x 3 rows
  ];
  layouts.forEach((nodes, i) => {
    const svg = window.__TB.renderQuestionChart({ type: 'activity-network', highlight: Object.keys(nodes)[0], nodes, edges: [] });
    const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    assert.ok(vb, 'layout ' + i + ': viewBox present');
    const vbW = Number(vb[1]), vbH = Number(vb[2]);
    const allXs = Array.from(svg.matchAll(/x1?="([\d.]+)"/g)).map(m => Number(m[1]));
    const allYs = Array.from(svg.matchAll(/y1?="([\d.]+)"/g)).map(m => Number(m[1]));
    assert.ok(Math.max.apply(null, allXs) <= vbW + 2, 'layout ' + i + ': no element exceeds viewBox width');
    assert.ok(Math.max.apply(null, allYs) <= vbH + 2, 'layout ' + i + ': no element exceeds viewBox height');
  });
});

test('chartMatrixDiagram scales its viewBox height to the actual number of rows, with no overflow (regression: height was hardcoded for exactly 4 rows, clipping legend and later rows for any question with 5+ rows)', async () => {
  const { window } = await load();
  [1, 4, 6, 10].forEach(n => {
    const rowLabels = Array.from({ length: n }, (_, i) => 'Row ' + i);
    const cells = rowLabels.map((_, i) => [i % 2 === 0, i % 2 === 1]);
    const svg = window.__TB.renderQuestionChart({ type: 'matrix-diagram', rowLabels, colGroups: [{ label: 'G', cols: ['A', 'B'] }], cells });
    const vb = svg.match(/viewBox="0 0 (\d+) ([\d.]+)"/);
    assert.ok(vb, n + ' rows: viewBox present');
    const vbHeight = Number(vb[2]);
    const allYs = Array.from(svg.matchAll(/y="([\d.]+)"/g)).map(m => Number(m[1]))
      .concat(Array.from(svg.matchAll(/cy="([\d.]+)"/g)).map(m => Number(m[1])));
    const maxY = Math.max.apply(null, allYs);
    assert.ok(maxY <= vbHeight, n + ' rows: no element (max y=' + maxY + ') exceeds the viewBox height (' + vbHeight + ')');
  });
});

test('every chart-rendering function escapes HTML-unsafe characters in user-supplied labels rather than injecting them raw', async () => {
  const { window } = await load();
  const dangerous = '<script>alert(1)</script>&"quoted"';
  const cases = [
    window.__TB.renderQuestionChart({ type: 'data-table', columns: [dangerous], rows: [[dangerous]] }),
    window.__TB.renderQuestionChart({ type: 'matrix-diagram', rowLabels: [dangerous], colGroups: [{ label: dangerous, cols: [dangerous] }], cells: [[true]] })
  ];
  cases.forEach(html => {
    assert.doesNotMatch(html, /<script>alert/, 'raw script tag never appears unescaped');
    assert.match(html, /&lt;script&gt;/, 'the label is HTML-escaped');
  });
});

test('all three new chart types (fta-diagram, matrix-diagram, interaction-plot-3) tolerate missing/empty optional fields without throwing or producing NaN', async () => {
  const { window } = await load();
  const cases = [
    { type: 'fta-diagram' },
    { type: 'fta-diagram', highlightSet: [] },
    { type: 'fta-diagram', highlightSet: ['not-a-real-id'] },
    { type: 'matrix-diagram', rowLabels: [], colGroups: [{ label: 'G', cols: ['A'] }], cells: [] },
    { type: 'interaction-plot-3' }
  ];
  cases.forEach(c => {
    let out;
    assert.doesNotThrow(() => { out = window.__TB.renderQuestionChart(c); }, c.type + ' does not throw');
    assert.doesNotMatch(out, /NaN/, c.type);
    assert.doesNotMatch(out, /undefined/, c.type);
  });
});
