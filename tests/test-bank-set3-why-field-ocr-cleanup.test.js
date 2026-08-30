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

// A well-formed BOK citation looks like [II.C.2] or [VII.C] -- a roman numeral
// (I-X), a dot, a single subsection letter, and optionally a dot and a single
// digit. Every citation in the corpus should match this shape after cleanup.
const CITATION_RE = /\[(I|II|III|IV|V|VI|VII|VIII|IX|X)\.[A-Z](\.\d)?\]$/;

test('Set 3 has no "why" field longer than 2000 characters (regression guard against the appended-reference-document corruption)', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.length, 694);
  const overLong = bank.filter(q => q.why.length > 2000);
  assert.deepEqual(Array.from(overLong.map(q => q.stem)), [], 'no why field should ever balloon past a normal explanation length');
});

test('the seven questions whose "why" field had an entire BOK reference document appended now end with a clean citation and nothing else', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const cases = [
    { number: 214, endsWith: '[II.C.2]' },
    { number: 249, endsWith: '[III.D.3]' },
    { number: 283, endsWith: '[IV.D.7]' },
    { number: 405, endsWith: '[V.F.7]' },
    { number: 449, endsWith: '[VI.D.3]' },
    { number: 489, endsWith: '[VII.C]' },
    { number: 694, endsWith: '[I.A.1]' }
  ];
  cases.forEach(({ number, endsWith }) => {
    const question = q(bank, number);
    assert.ok(question.why.length < 400, `Q${number} why field is a normal length (${question.why.length} chars), not a document dump`);
    assert.ok(question.why.endsWith(endsWith), `Q${number} why field ends with ${endsWith}, got: ...${question.why.slice(-60)}`);
    assert.doesNotMatch(question.why, /Section [IVX]+ (Team Management|Define|Measure|Analyze|Improve|Control)/, `Q${number} has no appended section-reference text`);
    assert.doesNotMatch(question.why, /ASQ Six Sigma Black Belt Certification Body of Knowledge/, `Q${number} has no appended BOK document`);
  });
});

test('every "why" field that ends in a bracketed BOK citation now has a well-formed citation -- no internal spaces, no stray digit-for-letter substitutions, no unclosed bracket', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const withCitation = bank.filter(q => /\[[^\]]*\]\s*$/.test(q.why));
  assert.ok(withCitation.length > 600, 'sanity: most Set 3 questions cite a BOK subsection');
  const malformed = withCitation.filter(q => !CITATION_RE.test(q.why));
  assert.deepEqual(
    Array.from(malformed.map(q => JSON.stringify({ stem: q.stem.slice(0, 60), tail: q.why.slice(-25) }))),
    [],
    'every citation matches [RomanNumeral.Letter(.Digit)] with no internal noise'
  );
});

test('specific previously-garbled citations are now correctly normalized (spot check across several distinct corruption patterns)', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  // "I1.C. 1" (digit-for-I plus stray space) -> "II.C.1"
  const q1 = q(bank, 193);
  assert.ok(q1);
  assert.ok(q1.why.endsWith('[II.C.1]'), q1.why.slice(-20));

  // "V.8.2" / "Vl.8.7" (8-for-B, and lowercase-l-for-I) -> "*.B.*"
  const bWords = bank.filter(q => /\[[IVX]+\.B(\.\d)?\]$/.test(q.why));
  assert.ok(bWords.length > 5, 'several citations now correctly resolve to a .B. (not .8.) subsection');

  // "VIII.AA" -> "VIII.A.4"
  const aaFixed = bank.filter(q => q.why.endsWith('[VIII.A.4]'));
  assert.ok(aaFixed.length >= 40, 'the VIII.A.4 citation (including former "VIII.AA" corruption) is now consistently well-formed');
});

test('the chi-square job-shop question\'s "why" narrative now states the critical value as a clean "5.991" instead of the split "5.99 1"', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const question = q(bank, 661);
  assert.match(question.stem, /χ² critical value = 5\.991/);
  assert.match(question.why, /χ² critical value = 5\.991/);
  assert.doesNotMatch(question.why, /5\.99\s1/);
});

test('the ROI question\'s "why" narrative no longer has a stray space after the thousands-comma in its restated cash-flow figures', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const question = q(bank, 214);
  assert.match(question.why, /\$40,000 [−-] \$25,000/);
  assert.doesNotMatch(question.why, /\$4 0,000/);
  assert.doesNotMatch(question.why, /\$25, 000/);
});

test('Set 3 still has exactly 694 questions, no duplicate stems, and no empty "why" fields after the OCR cleanup pass', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.length, 694);
  const stems = bank.map(q => q.stem);
  assert.equal(new Set(stems).size, stems.length, 'no duplicate stems');
  const empty = bank.filter(q => !q.why || !q.why.trim());
  assert.deepEqual(Array.from(empty), [], 'no empty why fields');
});
