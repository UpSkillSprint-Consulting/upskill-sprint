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

// --- OEE family (Q479-482): was missing all shared context -------------------
// Student-exam audit found these four questions relied entirely on numbers
// (7,000 good pieces, 195 scrap, 10,000 ideal run rate, shift/downtime figures)
// that only existed in a neighboring question's stem or in garbled why fields --
// never in each question's own text. idx480 and idx481 in particular gave zero
// data at all ("What is the value of the performance?").

test('the four OEE questions (availability/performance/quality/action) now share one reference table with the complete dataset', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q479 = findQuestion(bank, 'Use the following information to answer this question and the next three.');
  const q480 = findQuestion(bank, 'Using the same information, what is the value of the performance?');
  const q481 = findQuestion(bank, 'Using the same information, what is the value of the quality metric?');
  const q482 = findQuestion(bank, 'Using the same information, which of the following actions');
  assert.ok(q479 && q480 && q481 && q482, 'all four OEE questions found');

  [q480, q481, q482].forEach(q => {
    assert.deepEqual(JSON.parse(JSON.stringify(q.chart)), JSON.parse(JSON.stringify(q479.chart)), 'shares the exact same reference table as the first question');
  });

  const rows = Object.fromEntries(q479.chart.rows.map(r => [r[0], r[1]]));
  assert.equal(rows['Good pieces produced'], '7,000');
  assert.equal(rows['Scrap/rework pieces'], '195');
  assert.equal(rows['Ideal run rate'], '10,000 pieces in the planned production time');
});

test('the OEE quality question has a clean derivation and the action question selects the lowest OEE factor', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q481 = findQuestion(bank, 'Using the same information, what is the value of the quality metric?');
  const q482 = findQuestion(bank, 'Using the same information, which of the following actions');
  assert.match(q481.why, /7,000 \/ 7,195 = 0\.9729/);
  assert.equal(q481.options[q481.answer], '0.9729');
  assert.match(q482.why, /performance = 0\.8391/);
  assert.equal(q482.options[q482.answer], 'Increase the performance of the process.');
});

test('the OEE performance question uses consistent planned and operating times', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q480 = findQuestion(bank, 'Using the same information, what is the value of the performance?');
  assert.ok(q480.chart, 'now has the shared reference table');
  assert.equal(q480.options[q480.answer], '0.8391');
  assert.match(q480.why, /7,195\/373.*10,000\/435.*0\.8391/);
});

// --- Mechanical option-text fixes --------------------------------------------

test('the R-chart LCL question no longer has a stray letter "O" where the answer is genuinely 0', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'Calculate the lower control limit of an R chart using X̿ = 345.50');
  assert.ok(q);
  assert.ok(q.options.includes('0'), 'the zero option reads as a digit, not the letter O');
  assert.ok(!q.options.includes('O'));
});

test('the "four or more defects" question now shows \u2265 instead of a lost/replacement character', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'Thirty car hoods are inspected for paint defects.');
  assert.ok(q);
  assert.ok(q.options.includes('Pr (X \u2265 4).'));
  assert.ok(!q.options.some(o => o.includes('\ufffd')));
  assert.match(q.why, /Pr\(X\s*\u2265\s*4\)/);
});

test('percent-value options across four questions no longer have stray trailing commas or the garbled "\u00b0/c" percent sign', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const cases = [
    { prefix: 'According to Ebbinghaus', expected: ['21%', '28%', '34%', '50%'] },
    { prefix: 'Calculate the precision-to-tolerance ratio (PTR)', expected: ['13.5%', '27%', '37%', '75%'] },
    { prefix: 'A process output is normally distributed with μ = 53.7 inches', expected: ['20.3%', '25.2%', '75.4%', '80.0%'] },
    { prefix: 'A total of 345 units were inspected', expected: ['0.0435%', '4.35%', '15%', '23%'] }
  ];
  cases.forEach(({ prefix, expected }) => {
    const q = findQuestion(bank, prefix);
    assert.ok(q, prefix);
    assert.deepEqual(Array.from(q.options), expected);
    q.options.forEach(o => {
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
    { prefix: 'The net present value (NPV) of the cost', mustMatch: /750,000 \/ \$100,000 = 7\.5/ },
    { prefix: 'What is the denominator in the population variance formula?', mustMatch: /N is the denominator/ },
    { prefix: 'Given the sample set of data { 13.3, 14.5, -4.0, 23.9, 24.2}', mustMatch: /11\.47/ },
    { prefix: 'A process is running at a 5% defective rate', mustMatch: /0\.9885/ },
    { prefix: 'Two manufacturing lines produce a bioplastic sheet', mustMatch: /Line B has the lower yield/ },
    { prefix: 'A capability study was conducted on a normally distributed', mustMatch: /1\.35 x 0\.7633 = 1\.03/ },
    { prefix: 'Given the following information from an in-control p-chart, calculate the process capability: sum(np) = 55', mustMatch: /55 \/ 2800 = 0\.0196/ },
    { prefix: 'A customer order for 1000 quarters', mustMatch: /2400 minutes \/ 1000 pieces = 2\.4/ },
    { prefix: 'Calculate the upper control limit of an X̄ chart', mustMatch: /96\.4835/ },
    { prefix: 'Before an improvement project, the defective rate for a milling process was 4.9%', mustMatch: /−1\.32/ },
    { prefix: 'A new electric vehicle is evaluated for its maximum range', mustMatch: /t₀ = .*= 2\.52/ },
    { prefix: 'After adjustments to a packaging line', mustMatch: /47\.06.*48/ },
    { prefix: 'A quality engineer will test a sample of lightbulbs', mustMatch: /1067\.1.*1068/ }
  ];
  cases.forEach(({ prefix, mustMatch }) => {
    const q = findQuestion(bank, prefix);
    assert.ok(q, 'found: ' + prefix);
    assert.match(q.why, mustMatch, prefix);
    assert.doesNotMatch(q.why, /[\ufffd]/, prefix + ' has no replacement characters');
    assert.doesNotMatch(q.why, /�/, prefix);
  });
});

test('the p-chart process-capability question\'s stem no longer has the garbled "2, np = 55, 2, n = 2800" and instead reads "sum(np)"/"sum(n)"', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'Given the following information from an in-control p-chart');
  assert.ok(q);
  assert.match(q.stem, /sum\(np\) = 55, sum\(n\) = 2800/);
  assert.doesNotMatch(q.stem, /2, np = 55/);
});

test('Set 3 still has exactly 694 questions, no duplicate stems, after the missing-context and formula-cleanup pass', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.length, 694);
  const stems = bank.map(q => q.stem);
  assert.equal(new Set(stems).size, stems.length);
});
