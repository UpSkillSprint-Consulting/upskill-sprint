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

// --- OEE family (Q480-483): was missing all shared context -------------------
// Student-exam audit found these four questions relied entirely on numbers
// (7,000 good pieces, 195 scrap, 10,000 ideal run rate, shift/downtime figures)
// that only existed in a neighboring question's stem or in garbled why fields --
// never in each question's own text. Each randomized question must now stand on
// its own while displaying the same complete source-data table.

test('the four OEE questions (availability/performance/quality/action) now share one reference table with the complete dataset', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q480 = q(bank, 480);
  const q481 = q(bank, 481);
  const q482 = q(bank, 482);
  const q483 = q(bank, 483);

  [q481, q482, q483].forEach(question => {
    assert.deepEqual(JSON.parse(JSON.stringify(question.chart)), JSON.parse(JSON.stringify(q480.chart)), 'shares the exact same reference table as the first question');
  });

  [q480, q481, q482, q483].forEach((question) => {
    assert.match(question.stem, /injection-molding shift summarized below/i);
    assert.doesNotMatch(question.stem, /same information|previous|next/i);
  });

  const rows = Object.fromEntries(q480.chart.rows.map(r => [r[0], r[1]]));
  assert.equal(rows['Good pieces produced'], '7,000');
  assert.equal(rows['Scrap/rework pieces'], '195');
  assert.equal(rows['Planned output at ideal rate'], '10,000 pieces per 435 planned minutes');
});

test('the OEE quality question has a clean derivation and the action question selects the lowest OEE factor', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q482 = q(bank, 482);
  const q483 = q(bank, 483);
  assert.match(q482.why, /7,000 \/ 7,195 = 0\.9729/);
  assert.equal(q482.options[q482.answer], '0.9729');
  assert.match(q483.why, /performance = 0\.8391/);
  assert.equal(q483.options[q483.answer], 'Increase the performance of the process.');
});

test('the OEE performance question uses consistent planned and operating times', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q481 = q(bank, 481);
  assert.ok(q481.chart, 'has the complete reference table');
  assert.equal(q481.options[q481.answer], '0.8391');
  assert.match(q481.why, /7,195\/373.*10,000\/435.*0\.8391/);
});

// --- Mechanical option-text fixes --------------------------------------------

test('the R-chart LCL question no longer has a stray letter "O" where the answer is genuinely 0', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const question = q(bank, 491);
  assert.ok(question.options.includes('0'), 'the zero option reads as a digit, not the letter O');
  assert.ok(!question.options.includes('O'));
});

test('the "four or more defects" question now shows \u2265 instead of a lost/replacement character', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const question = q(bank, 610);
  assert.ok(question.options.includes('P(X \u2265 4)'));
  assert.ok(!question.options.some(o => o.includes('\ufffd')));
  assert.match(question.why, /Pr\(X\s*\u2265\s*4\)/);
});

test('percent-value options across four questions no longer have stray trailing commas or the garbled "\u00b0/c" percent sign', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const cases = [
    { number: 245, expected: ['21%', '28%', '34%', '50%'] },
    { number: 295, expected: ['13.5%', '27%', '37%', '75%'] },
    { number: 356, expected: ['20.3%', '25.2%', '75.4%', '80.0%'] },
    { number: 396, expected: ['0.0435%', '4.35%', '15%', '23%'] }
  ];
  cases.forEach(({ number, expected }) => {
    const question = q(bank, number);
    assert.deepEqual(Array.from(question.options), expected, `Q${number}`);
    question.options.forEach(o => {
      assert.doesNotMatch(o, /,\s*$/, o + ' has no trailing comma');
      assert.doesNotMatch(o, /\u00b0\/c/, o + ' has no garbled percent sign');
    });
  });
});

// --- Deep formula-garbling cleanup (why fields only, answers unchanged) -----

test('thirteen questions with deep OCR formula garbling in their why fields now have clean, readable explanations that reproduce their own already-correct answers', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const cases = [
    { number: 211, mustMatch: /\$130,782 \/ \$102,891 = 1\.271/ },
    { number: 320, mustMatch: /σ² = Σ\(xᵢ − μ\)²\/N/ },
    { number: 333, mustMatch: /11\.47/ },
    { number: 358, mustMatch: /0\.9885/ },
    { number: 359, mustMatch: /Line B has the lower yield/ },
    { number: 386, mustMatch: /1\.0305.*1\.03/ },
    { number: 388, mustMatch: /55\/2,800 = 0\.0196/ },
    { number: 475, mustMatch: /2,400 minutes\/1,000 pieces = 2\.4/ },
    { number: 490, mustMatch: /96\.4835/ },
    { number: 658, mustMatch: /−1\.32/ },
    { number: 667, mustMatch: /t₀ = .*= 2\.52/ },
    { number: 670, mustMatch: /47\.06.*48/ },
    { number: 681, mustMatch: /1,067\.11.*1,068/ }
  ];
  cases.forEach(({ number, mustMatch }) => {
    const question = q(bank, number);
    assert.match(question.why, mustMatch, `Q${number}`);
    assert.doesNotMatch(question.why, /[\ufffd]/, `Q${number} has no replacement characters`);
  });
});

test('the p-chart process-capability question uses clean summation notation', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const question = q(bank, 388);
  assert.match(question.stem, /Σnp = 55 and Σn = 2,800/);
  assert.doesNotMatch(question.stem, /2, np = 55/);
});

test('Set 3 still has exactly 694 questions, no duplicate stems, after the missing-context and formula-cleanup pass', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.length, 694);
  const stems = bank.map(q => q.stem);
  assert.equal(new Set(stems).size, stems.length);
});
