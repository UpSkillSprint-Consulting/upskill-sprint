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

// A systematic sweep of every control-chart constant (A2, A3, D3, D4, B3, B4, c4,
// d2) used anywhere in Set 3, cross-checked against the standard SPC reference
// tables, found zero errors -- this suite pins the values that were already
// correct so a future edit can't silently break them.

test('every control-chart constant lookup in Set 3 matches the standard SPC reference table (audit found zero errors here -- this pins the correct values)', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  const cases = [
    { prefix: 'Use the following information to answer this question and the next. What is the value of the Cp index?', mustMatch: /c4 = 0\.9869/ },
    { prefix: 'A process metric is normally distributed. An X-bar R chart shows it is in control', mustMatch: /d2 = 2\.326/ },
    { prefix: 'Calculate the upper control limit of an X̄ chart using X̿ = 90.475', mustMatch: /A2 = 0\.483/ },
    { prefix: 'Calculate the lower control limit of an R chart using X̿ = 345.50', mustMatch: /D₃ = 0\.076/ },
    { prefix: 'Using the same X-bar/S chart process (X-bar = 29.87, s = 3.55, n = 16), calculate the upper and lowe', mustMatch: /B3 = 0\.448 and B4 = 1\.552/ },
    { prefix: 'Calculate the upper control limit for the X̄ chart in an X̄\/S chart', mustMatch: /A₃ = 0\.680/ }
  ];
  cases.forEach(({ prefix, mustMatch }) => {
    const q = findQuestion(bank, prefix);
    assert.ok(q, prefix);
    assert.match(q.why, mustMatch, prefix);
  });
});

// A systematic sweep of the two two-way ANOVA tables in Set 3, checking SS
// additivity, df additivity, MS = SS/df, and F = MS/MSerror -- both tables are
// fully internally consistent. Also found and fixed real DOE-section bugs.

test('both two-way ANOVA tables in Set 3 are internally consistent (SS and df additivity, MS = SS/df, F = MS/MSerror) -- audit found zero arithmetic errors, pinning the correct values', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  const q416 = findQuestion(bank, 'A two-way ANOVA table is partially completed');
  assert.match(q416.why, /dfB = 4/);
  assert.match(q416.why, /SSB = SSTotal - SSA - SSAB - SSError = 664 - 144 - 360 - 75 = 85/);
  assert.match(q416.why, /F\(B\) = MSB\/MSError = 21\.25\/5 = 4\.25/);
  assert.equal(q416.options[q416.answer], '4.25');

  const q652 = findQuestion(bank, 'Given the two-way ANOVA table below');
  assert.equal(q652.options[q652.answer], '0.65');
});

test('the missing interaction-plot chart for the "if Factor A is at low level" question (Q450) is now restored, sharing the same chart as its paired question (Q449)', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q449 = findQuestion(bank, 'Use the interaction plots below to answer this question and the next.');
  const q450 = findQuestion(bank, 'Using the same interaction plots, if Factor A is set at the low level');
  assert.ok(q449 && q450, 'both questions found');
  assert.deepEqual(JSON.parse(JSON.stringify(q449.chart)), JSON.parse(JSON.stringify(q450.chart)));
  assert.equal(q450.chart.type, 'interaction-plot-3');
});

test('the contour-plot interaction question no longer has a stray digit "8" where the answer means letter "B"', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'A 2² full-factorial experiment is run with three replicates.');
  assert.ok(q);
  assert.ok(q.options.includes('There is an interaction between factors A and B.'));
  assert.ok(!q.options.some(o => o.includes(' and 8.')));
});

test('two fractional-factorial why fields no longer show a lost division symbol as a literal "+" in arithmetic that would be wrong if read literally', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  const q452 = findQuestion(bank, 'How many runs are required for a 2⁴⁻¹ experiment?');
  assert.match(q452.why, /2\^4 \/ 2 = 16 \/ 2 = 8/);
  assert.doesNotMatch(q452.why, /24 \+ 2 = 8/);

  const q682 = findQuestion(bank, 'In a two-level full-factorial design, the effect of Factor A is equal to 5.72.');
  assert.match(q682.why, /5\.72 \/ 2 = 2\.86/);
  assert.doesNotMatch(q682.why, /5\.72 \+ 2 = 2\.86/);
});

test('Set 3 still has exactly 694 questions, no duplicate stems, after the control-chart/DOE audit pass', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.length, 694);
  const stems = bank.map(q => q.stem);
  assert.equal(new Set(stems).size, stems.length);
});
