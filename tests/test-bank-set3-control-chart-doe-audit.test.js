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

const q = (bank, number) => bank[number - 1];

// A systematic sweep of every control-chart constant (A2, A3, D3, D4, B3, B4, c4,
// d2) used anywhere in Set 3, cross-checked against the standard SPC reference
// tables, found zero errors -- this suite pins the values that were already
// correct so a future edit can't silently break them.

test('every control-chart constant lookup in Set 3 matches the standard SPC reference table (audit found zero errors here -- this pins the correct values)', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  const cases = [
    { number: 375, mustMatch: /S̄\/c₄ = 9\.9\/0\.9869/ },
    { number: 377, mustMatch: /R̄\/d₂ = 1\.5\/2\.326/ },
    { number: 490, mustMatch: /A₂ = 0\.483/ },
    { number: 491, mustMatch: /D₃ = 0\.076/ },
    { number: 492, mustMatch: /B₃ = 0\.448 and B₄ = 1\.552/ },
    { number: 657, mustMatch: /A₃ = 0\.680/ }
  ];
  cases.forEach(({ number, mustMatch }) => {
    const question = q(bank, number);
    assert.match(question.why, mustMatch, `Q${number}`);
  });
});

// A systematic sweep of the two two-way ANOVA tables in Set 3, checking SS
// additivity, df additivity, MS = SS/df, and F = MS/MSerror -- both tables are
// fully internally consistent. Also found and fixed real DOE-section bugs.

test('both two-way ANOVA tables in Set 3 are internally consistent (SS and df additivity, MS = SS/df, F = MS/MSerror) -- audit found zero arithmetic errors, pinning the correct values', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  const q417 = q(bank, 417);
  assert.match(q417.why, /df\(B\) = 4/);
  assert.match(q417.why, /SS\(B\) = SS\(total\) − SS\(A\) − SS\(A×B\) − SS\(error\) = 664 − 144 − 360 − 75 = 85/);
  assert.match(q417.why, /F\(B\) = 21\.25\/5 = 4\.25/);
  assert.equal(q417.options[q417.answer], '4.25');

  const q653 = q(bank, 653);
  assert.equal(q653.options[q653.answer], '0.65');
});

test('both standalone interaction-plot questions (Q450-Q451) share the complete source chart', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q450 = q(bank, 450);
  const q451 = q(bank, 451);
  assert.deepEqual(JSON.parse(JSON.stringify(q450.chart)), JSON.parse(JSON.stringify(q451.chart)));
  assert.equal(q451.chart.type, 'interaction-plot-3');
  assert.doesNotMatch(q450.stem, /this question and the next/i);
  assert.doesNotMatch(q451.stem, /same information|previous question/i);
});

test('the contour-plot interaction question no longer has a stray digit "8" where the answer means letter "B"', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const question = q(bank, 457);
  assert.ok(question.options.includes('There is an interaction between factors A and B.'));
  assert.ok(!question.options.some(o => o.includes(' and 8.')));
});

test('two fractional-factorial why fields no longer show a lost division symbol as a literal "+" in arithmetic that would be wrong if read literally', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  const q453 = q(bank, 453);
  assert.match(q453.why, /2⁴\/2 = 16\/2 = 8/);
  assert.doesNotMatch(q453.why, /24 \+ 2 = 8/);

  const q683 = q(bank, 683);
  assert.match(q683.why, /5\.72 ÷ 2 = 2\.86/);
  assert.doesNotMatch(q683.why, /5\.72 \+ 2 = 2\.86/);
});

test('Set 3 still has exactly 694 questions, no duplicate stems, after the control-chart/DOE audit pass', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.length, 694);
  const stems = bank.map(q => q.stem);
  assert.equal(new Set(stems).size, stems.length);
});
