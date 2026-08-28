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

// "Gp"/"Gpk"/"Gpm" was a systematic OCR misread of "Cp"/"Cpk"/"Cpm" (the actual
// ASQ-standard process capability index names) scattered across ~14 Measure-domain
// capability questions. One question even used both spellings for the same concept
// in the same sentence ("has a Gp = 1.75 and a Cpk = 1.0"), confirming it was never
// an intentional alternate notation.

test('no Set 3 question uses the "Gp"/"Gpk"/"Gpm" misspelling anywhere in its stem, options, or why field', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const offenders = [];
  bank.forEach(q => {
    [q.stem, q.why, ...q.options].forEach(text => {
      if (/\b[Gg][Pp][KkMm]?\b/.test(text)) offenders.push(q.stem.slice(0, 60) + ' :: ' + text.slice(0, 80));
    });
  });
  assert.deepEqual(Array.from(offenders), []);
});

test('the capability-index questions shown in the reported screenshots now read "Cp"/"Cpk" correctly', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  const q1 = findQuestion(bank, 'The numerator of the Cp formula is also referred to as:');
  assert.ok(q1, 'found: numerator of the Cp formula');

  const q2 = findQuestion(bank, 'What does a negative Cpk signify?');
  assert.ok(q2, 'found: negative Cpk');
  assert.ok(q2.options.includes('The Cp value is less than 1.'));

  const q3 = findQuestion(bank, 'Use the following information to answer this question and the next. What is the value of the Cp index?');
  assert.ok(q3, 'found: value of the Cp index');

  const q4 = findQuestion(bank, 'A normally distributed, in-control, process output has a Cp = 1.75');
  assert.ok(q4, 'found: Cp=1.75/Cpk=1.0 question (previously mixed "Gp" and "Cp" in the same sentence)');
});

test('the confidence-bound-on-Cpk question no longer has the standalone "erk" OCR fragment (now reads "Cpk = 1.35")', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'A capability study was conducted on a normally distributed process metric using 28 subgroups');
  assert.ok(q);
  assert.match(q.why, /n = 28, Cpk = 1\.35/);
  assert.doesNotMatch(q.why, /\berk\b/);
});

test('the Box-Cox transformation question now has clean, correct answer options instead of garbled OCR text', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'What Box-Cox transformation is used to transform data from a Poisson to a normal distribution?');
  assert.ok(q);
  assert.deepEqual(Array.from(q.options), ['Y = \u221aX', 'Y = ln(X)', 'Y = X\u00b2', 'Y = 1/X']);
  assert.equal(q.options[q.answer], 'Y = \u221aX');
  assert.doesNotMatch(q.why, /\)\(/, 'why field has no leftover garbled parenthesis notation');
});

test('the two visible answer options that used a checkmark instead of a radical sign now show \u221a correctly', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  const q1 = findQuestion(bank, 'What is the denominator in the population variance formula?');
  assert.ok(q1);
  assert.ok(q1.options.includes('\u221aN'));
  assert.ok(!q1.options.some(o => o.includes('\u2713')));

  const q2 = findQuestion(bank, 'In a two-level full-factorial design, the effect of Factor A is equal to - 12.4.');
  assert.ok(q2);
  assert.ok(q2.options.some(o => o.includes('\u221aMSE')));
  assert.ok(!q2.options.some(o => o.includes('\u2713')));
});

test('Set 3 still has exactly 694 questions after the naming/notation cleanup pass', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.length, 694);
});

// --- Data-table visual styling -------------------------------------------------
// Reported feedback: table text should be center-aligned, and both vertical and
// horizontal lines should clearly separate columns/rows for a cleaner look.

test('the data-table CSS centers all header and cell text and draws a vertical divider between every column', async () => {
  const { window } = await load();
  const styleText = Array.from(window.document.querySelectorAll('style'))
    .map(s => s.textContent).join('\n');

  const thRule = styleText.match(/\.tb-q-data-table th\{[^}]*\}/);
  const tdRule = styleText.match(/\.tb-q-data-table td\{[^}]*\}/);
  assert.ok(thRule && tdRule, 'both th and td rules exist');

  assert.match(thRule[0], /text-align:center/, 'header cells are center-aligned');
  assert.match(tdRule[0], /text-align:center/, 'body cells are center-aligned');
  assert.match(thRule[0], /border-right:1px solid var\(--line\)/, 'header cells have a vertical divider');
  assert.match(tdRule[0], /border-right:1px solid var\(--line\)/, 'body cells have a vertical divider');

  // last-child cells should not double up on the outer table border
  assert.match(styleText, /\.tb-q-data-table th:last-child\{border-right:none\}/);
  assert.match(styleText, /\.tb-q-data-table td:last-child\{border-right:none\}/);
});

test('a rendered data-table chart produces correct underlying table markup (structural regression guard, independent of the CSS styling change above)', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q = findQuestion(bank, 'Using the cash flows shown, calculate the discounted return on investment (ROI)');
  assert.ok(q);
  const html2 = window.__TB.renderQuestionChart(q.chart);
  assert.match(html2, /<table class="tb-q-data-table">/);
  assert.match(html2, /<th>Year<\/th>/);
  assert.match(html2, /<td class="tb-q-num">\$75,000<\/td>/);
});

// --- Cp index / natural tolerance pair (Q121-122) ------------------------------
// Reported via a screenshot of the source study guide: these two questions share
// a "Use the following information to answer 121 and 122" data block (X-bar,
// s-bar, n, spec limits) that was missing entirely from the site. The why fields
// also had a numeric OCR error -- "s-bar = 39.9" -- that doesn't match the given
// answer keys; the correct value (confirmed by the source screenshot and by the
// math working out to the existing correct answers) is "s-bar = 9.9".

test('the Cp-index and natural-tolerance questions (Q121-122) now share a reference table with the correct s-bar value', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q1 = findQuestion(bank, 'Use the following information to answer this question and the next. What is the value of the Cp index?');
  const q2 = findQuestion(bank, 'Using the same information, what is the estimated natural tolerance?');
  assert.ok(q1 && q2, 'both questions found');

  assert.deepEqual(JSON.parse(JSON.stringify(q1.chart)), JSON.parse(JSON.stringify(q2.chart)), 'both questions share the identical reference table');
  assert.equal(q1.chart.type, 'data-table');

  const rows = Object.fromEntries(q1.chart.rows.map(r => [r[0], r[1]]));
  assert.equal(rows['X̄'], '904.5');
  assert.equal(rows['S̄'], '9.9');
  assert.equal(rows['Subgroup size, n'], '20');
  assert.equal(rows['Specification'], '900 \u00b1 50');
});

test('the Cp-index/natural-tolerance why fields no longer state the incorrect "s-bar = 39.9" and instead show the math that actually produces the existing correct answers', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const q1 = findQuestion(bank, 'Use the following information to answer this question and the next. What is the value of the Cp index?');
  const q2 = findQuestion(bank, 'Using the same information, what is the estimated natural tolerance?');

  [q1, q2].forEach(q => {
    assert.doesNotMatch(q.why, /39\.9/, 'no leftover incorrect s-bar value');
    assert.match(q.why, /s-bar = 9\.9/);
    assert.match(q.why, /10\.03/, 'sigma-hat = 9.9 / 0.9869 = 10.03 is shown');
  });

  assert.equal(q1.options[q1.answer], '1.66');
  assert.match(q1.why, /100 \/ 60\.19 = 1\.66/);

  assert.equal(q2.options[q2.answer], '60.19');
  assert.match(q2.why, /6 x 10\.03 = 60\.19/);
});
