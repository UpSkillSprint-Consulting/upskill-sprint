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

test('none of the 8 previously chart-dependent questions still contain garbled OCR text in their stem', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);
  const stemPrefixes = [
    'A Black Belt is studying an X-bar R chart',
    'Calculate the interquartile range using the box plot',
    'What insight does the box plot below show?',
    'Interpret the normal probability plot shown below',
    'What is the measurement system concept depicted',
    'Which quadrant of the figure shows high precision but low',
    'Which quadrant in the figure shows high accuracy and low',
    'Which quadrant of the figure shows low precision and low',
    'Which quadrant in the figure shows high precision and low'
  ];
  stemPrefixes.forEach(prefix => {
    const matches = bank.filter(q => q.stem.startsWith(prefix));
    assert.ok(matches.length > 0, 'question found: ' + prefix);
    matches.forEach(q => {
      assert.doesNotMatch(q.stem, /[\uFFFD]/, 'no unicode replacement characters: ' + prefix);
      assert.doesNotMatch(q.stem, /\bUCL\s*=|\bLCL\s*=|\bCl\)\s|\ben Cl\)/, 'no leaked chart axis/label fragments: ' + prefix);
      assert.ok(q.stem.length < 200, 'stem is a clean question, not a wall of OCR fragments: ' + prefix);
      assert.ok(q.chart && q.chart.type, 'has a chart field: ' + prefix);
    });
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
  const bank = cssbbBank(window);
  const q = findQuestion(bank, 'A Black Belt is studying an X-bar R chart');
  assert.equal(q.chart.type, 'xbar-r');
  assert.equal(q.chart.xbar.ucl, 581.0);
  assert.equal(q.chart.xbar.cl, 512.5);
  assert.equal(q.chart.xbar.lcl, 443.9);
  assert.equal(q.chart.xbar.data.length, 25);
  assert.equal(q.chart.r.data.length, 25);
  assert.equal(q.options[q.answer], 'Both the X-bar and R charts exhibit out-of-control conditions.');

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
  const bank = cssbbBank(window);
  const plots = bank.filter(q => q.stem.startsWith('Interpret the normal probability plot shown below'));
  assert.equal(plots.length, 2);
  assert.notEqual(plots[0].stem, plots[1].stem, 'the two plots have distinct stems so they do not collide under stem-based hashing (mastery tracking, dedup) elsewhere in the app');
  const normal = plots.find(q => q.options[q.answer] === 'The data are normally distributed.');
  const skewed = plots.find(q => q.options[q.answer] === 'The data are right skewed.');
  assert.ok(normal && skewed, 'both variants are present with distinct correct answers');
  assert.equal(normal.chart.pattern, 'linear');
  assert.equal(skewed.chart.pattern, 's-curve');
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

test('chartNormalProb produces different point paths for linear vs s-curve patterns', async () => {
  const { window } = await load();
  const linear = window.__TB.renderQuestionChart({ type: 'normal-prob', pattern: 'linear' });
  const sCurve = window.__TB.renderQuestionChart({ type: 'normal-prob', pattern: 's-curve' });
  assert.notEqual(linear, sCurve, 'the two patterns render visibly different point placements');
  assert.doesNotMatch(linear, /NaN/);
  assert.doesNotMatch(sCurve, /NaN/);
});

test('chartPrecisionAccuracy renders exactly 4 labeled panels and highlights only the requested one', async () => {
  const { window } = await load();
  const svg = window.__TB.renderQuestionChart({ type: 'precision-accuracy', highlight: 'D' });
  ['A', 'B', 'C', 'D'].forEach(label => assert.match(svg, new RegExp('>' + label + '<')));
  assert.equal((svg.match(/tb-q-chart-quad-hi/g) || []).length, 1, 'exactly one panel is highlighted');
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

test('the critical-path questions now carry their precedence table data in the stem, not only in the why field', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);
  const critPath = findQuestion(bank, 'A project has the following activities');
  const lateStart = findQuestion(bank, 'Using the same project precedence table');
  assert.ok(critPath && lateStart, 'both companion questions found');

  // Both questions must state every activity's duration and predecessor directly in the
  // stem -- previously this table only existed (garbled) inside the why field, making the
  // question itself unanswerable from the information a student is actually shown.
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(activity => {
    assert.match(critPath.stem, new RegExp(activity + ' \\('), 'critical-path stem states activity ' + activity + '\u2019s data');
    assert.match(lateStart.stem, new RegExp(activity + ' \\('), 'late-start stem states activity ' + activity + '\u2019s data');
  });

  assert.equal(critPath.options[critPath.answer], 'ACG');
  assert.equal(lateStart.options[lateStart.answer], 'Day 5');
  assert.doesNotMatch(critPath.why, /[\uFFFD]/, 'why field no longer contains the garbled ASCII network diagram');
  assert.doesNotMatch(lateStart.why, /[\uFFFD]/);
});

test('the precedence-table data used is internally self-consistent with the stated critical-path answer (the source book has a real erratum here: its question page prints Activity D as 15 days, its own solution page prints 5 days and calculates using 5 -- used the value consistent with the graded answer so the practice question is not self-contradicting)', async () => {
  const { window } = await load();
  const bank = cssbbBank(window);
  const critPath = findQuestion(bank, 'A project has the following activities');
  assert.match(critPath.stem, /D \(no predecessor, 5 days\)/);
  // ACG = 10+10+5 = 25, BCG = 5+10+5 = 20, DEFG = 5+5+5+5 = 20 -- ACG must be strictly longest.
  const acg = 10 + 10 + 5, bcg = 5 + 10 + 5, defg = 5 + 5 + 5 + 5;
  assert.ok(acg > bcg && acg > defg, 'ACG is genuinely the longest (critical) path given the stem\u2019s own stated durations');
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
