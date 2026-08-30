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

// A second, deeper student-exam audit pass found three more appended-BOK-document
// corruptions that the original PR #114 sweep missed because it only searched for
// the marker at the very end of the why field (or filtered by length > 1500 chars).
// These three had the marker mid-string or under the length threshold.

test('three more why fields with an appended BOK section/Part-B-intro document are now clean, normal-length explanations', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const cases = [
    { number: 189, endsWith: '[I.B.3]' },
    { number: 535, endsWith: '[VIII.D.2]' },
    { number: 548, endsWith: '[IX.C]' }
  ];
  cases.forEach(({ number, endsWith }) => {
    const question = q(bank, number);
    assert.ok(question.why.length < 200, `Q${number} why field is now a normal length (${question.why.length} chars)`);
    assert.ok(question.why.endsWith(endsWith));
    assert.doesNotMatch(question.why, /Section [IVX]+|Part B Simulated Exam|\(Understand\)|\(Apply\)/, `Q${number}`);
  });
});

test('no Set 3 why field contains an appended BOK section, Part-B-intro, or full document marker anywhere in the corpus', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const markers = /Section [IVX]+ [A-Z]|Part B Simulated Exam|ASQ Six Sigma Black Belt Certification Body of Knowledge|BoKSection|\(Understand\)|\(Apply\)|\(Analyze\)/;
  const offenders = bank.filter(q => markers.test(q.why)).map(q => q.stem.slice(0, 50));
  assert.deepEqual(Array.from(offenders), []);
});

test('eight why fields with a malformed or misplaced BOK citation (internal spacing, or a citation stranded mid-sentence before trailing garbled formula text) now end cleanly with a well-formed citation and no leftover formula fragments', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const strictCitation = /\[(I|II|III|IV|V|VI|VII|VIII|IX|X)\.[A-Z](\.\d)?\]$/;
  const numbers = [332, 371, 372, 374, 381, 400, 402, 398];
  numbers.forEach(number => {
    const question = q(bank, number);
    assert.match(question.why, strictCitation, `Q${number}: ${question.why.slice(-30)}`);
  });
});

test('three why fields with correct answers but deep OCR formula garbling (c-chart, u-chart, and sigma-from-CI derivations) are now clean and reproduce their own already-correct answers', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  const cChart = q(bank, 512);
  assert.match(cChart.why, /5\.22/);
  assert.equal(cChart.options[cChart.answer], '[0, 5.22]');

  const uChart = q(bank, 515);
  assert.match(uChart.why, /0\.419/);
  assert.equal(uChart.options[uChart.answer], '[0, 0.419]');

  const ciSigma = q(bank, 672);
  assert.match(ciSigma.why, /6\.85/);
  assert.equal(ciSigma.options[ciSigma.answer], '6.85');
});

test('three option-text formatting bugs are fixed: two stray-space-after-dollar-sign options and one stray-space-in-decimal distractor', async () => {
  const { window } = await load();
  const bank = set3Bank(window);

  const q207 = q(bank, 207);
  assert.equal(q207.options[q207.answer], '$3,105');
  assert.ok(!q207.options.some(o => /\$\s\d/.test(o)));

  const q345 = q(bank, 345);
  assert.ok(q345.options.includes('14,190'));

  const q680 = q(bank, 680);
  assert.ok(q680.options.includes('0.9315'));
  assert.ok(!q680.options.some(o => /\d\s\d/.test(o)));
});

test('the garbled "\u00b0/c" percent sign is fully gone from Set 3 (a stem and a why field had it, beyond the two options already fixed in an earlier PR)', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  const offenders = bank.filter(q =>
    q.stem.includes('\u00b0/c') || q.why.includes('\u00b0/c') || q.options.some(o => o.includes('\u00b0/c'))
  );
  assert.deepEqual(Array.from(offenders.map(q => q.stem.slice(0, 40))), []);
});

test('ANSWER-KEY CORRECTION: the continuous-compounding NPV question now marks the option that actually matches continuous compounding, not the one matching discrete annual compounding', async () => {
  // The stem explicitly and unambiguously says "continuous compounding." The math
  // for continuous compounding (A * e^(-rt)) gives $13,304, which was present as
  // a distractor option while the marked answer ($13,335) was the result of
  // discrete annual compounding (A / (1+r)^n) -- the wrong method for what the
  // question asks. This is a genuine answer-key error, not an OCR/formatting
  // issue, corrected after independently verifying both calculations.
  const { window } = await load();
  const bank = set3Bank(window);
  const question = q(bank, 210);
  assert.match(question.stem, /continuously compounded/);
  assert.equal(question.options[question.answer], '$13,304');
  assert.match(question.why, /exp\[−\(0\.04\)\(3\)\]/);
  assert.ok(!question.options.some(o => /\$\s\d/.test(o)), 'no stray space after $ remains in any option');
});

test('Set 3 still has exactly 694 questions, no duplicate stems, after this second audit pass', async () => {
  const { window } = await load();
  const bank = set3Bank(window);
  assert.equal(bank.length, 694);
  const stems = bank.map(q => q.stem);
  assert.equal(new Set(stems).size, stems.length);
});
