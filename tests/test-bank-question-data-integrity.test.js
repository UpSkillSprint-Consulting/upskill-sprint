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
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole });
  windows.push(dom.window);
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  return { window: dom.window, errors };
}

function allExamsUniqueQuestions(window) {
  const output = {};
  Object.keys(window.__TB.EXAMS).forEach(examId => {
    const e = window.__TB.EXAMS[examId];
    const seen = new Set();
    output[examId] = [].concat(e.bank || [], Object.values(e.sets || {}).flat()).filter(q => {
      if (!q || seen.has(q.stem)) return false;
      seen.add(q.stem);
      return true;
    });
  });
  return output;
}

function findByStemPrefix(banks, examId, prefix) {
  return banks[examId].find(q => q.stem.startsWith(prefix));
}

/* ---------- structural integrity, every exam ---------- */

test('every question in every exam has exactly 4 non-empty options and a valid answer index', async () => {
  const { window } = await load();
  const banks = allExamsUniqueQuestions(window);
  Object.keys(banks).forEach(examId => {
    banks[examId].forEach(q => {
      assert.ok(q.stem && q.stem.trim(), examId + ': empty stem');
      assert.ok(Array.isArray(q.options) && q.options.length === 4, examId + ': bad option count for "' + q.stem.slice(0, 60) + '"');
      q.options.forEach((o, i) => assert.ok(o && String(o).trim(), examId + ': empty option ' + i + ' for "' + q.stem.slice(0, 60) + '"'));
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3, examId + ': bad answer index (' + q.answer + ') for "' + q.stem.slice(0, 60) + '"');
      assert.ok(q.why && q.why.trim(), examId + ': empty why for "' + q.stem.slice(0, 60) + '"');
    });
  });
});

test('no question has duplicate option text (case-sensitive; "N" vs "n - 1" style case-only distinctions are intentional and excluded)', async () => {
  const { window } = await load();
  const banks = allExamsUniqueQuestions(window);
  const dupes = [];
  Object.keys(banks).forEach(examId => {
    banks[examId].forEach(q => {
      const seen = new Set();
      q.options.forEach(o => {
        const key = String(o).trim();
        if (seen.has(key)) dupes.push(examId + ': "' + q.stem.slice(0, 60) + '"');
        seen.add(key);
      });
    });
  });
  assert.deepEqual(Array.from(dupes), []);
});

/* ---------- regression guard for the whole class of stray-dash artifacts ---------- */

test('no stray leftover dash artifacts remain in any stem or option (regression guard for a batch-compilation bug that left 24 CQE questions with dangling "\u2013" characters)', async () => {
  const { window } = await load();
  const banks = allExamsUniqueQuestions(window);
  // These are the only three known-legitimate uses of a standalone en/em dash in the
  // whole bank: two parenthetical asides and one minus sign in an equation. Anything
  // else matching the stray-dash pattern is a real bug.
  const allowlist = new Set([
    'The in-control average run length (ARL\u2080) of a standard 3\u03c3 Shewhart chart \u2014 the average points between false alarms \u2014 is approximately:',
    'A designer needs a pipe coating that is both hard (scratch resistance) and flexible (bend without cracking) \u2014 a classic physical contradiction. The methodology built specifically to resolve such contradictions without compromise is:',
    'The fitted regression equation for two variables x and y is y\u02c6 = 2.5x \u2013 8. What is the slope of this equation?'
  ]);
  const offenders = [];
  Object.keys(banks).forEach(examId => {
    banks[examId].forEach(q => {
      if (allowlist.has(q.stem)) return;
      const stemHit = / [\u2013\u2014] /.test(' ' + q.stem + ' ') || /\s[\u2013\u2014]\s*$/.test(q.stem.trim());
      const optHit = q.options.some(o => / [\u2013\u2014]\s*$/.test(' ' + String(o)) || /^\s*[\u2013\u2014]\s/.test(String(o)));
      if (stemHit || optHit) offenders.push(examId + ': "' + q.stem.slice(0, 70) + '"');
    });
  });
  assert.deepEqual(Array.from(offenders), []);
});

/* ---------- specific questions fixed in this pass ---------- */

test('the multiple regression model question now states the actual equation instead of omitting it', async () => {
  const { window } = await load();
  const banks = allExamsUniqueQuestions(window);
  const q = findByStemPrefix(banks, 'cssbb', 'A Black Belt estimates a regression model to be');
  assert.ok(q, 'question found');
  assert.match(q.stem, /[−-]32\.5.*12\.0x.*0\.45x.*3\.9x/, 'the full regression equation is now in the stem, not just the why field');
  assert.equal(q.options[q.answer], 'Multiple linear regression model');
});

test('the Cp/Cpk question uses proper subscript notation instead of displaced "p pk" text', async () => {
  const { window } = await load();
  const banks = allExamsUniqueQuestions(window);
  const q = findByStemPrefix(banks, 'cqe', 'A stable, normally distributed process has specifications 21.35');
  assert.ok(q, 'question found');
  assert.doesNotMatch(q.stem, /\bp\s+pk\b/, 'no more displaced subscript letters trailing the sentence');
  assert.match(q.stem, /C\u209aC\u209a\u2096|C\u209a\s+and\s+C\u209a\u2096/, 'stem asks for Cp and Cpk using real subscript characters');
  q.options.forEach(o => assert.doesNotMatch(String(o), /\bp\s+pk\b/, 'options use subscripts, not displaced trailing letters'));
});

test('the hypothesis-test question on \u03bc1 - \u03bc2 uses proper subscripts and every option correctly reads H\u2080, not a bare dangling "H"', async () => {
  const { window } = await load();
  const banks = allExamsUniqueQuestions(window);
  const q = findByStemPrefix(banks, 'cqe', 'Suppose that the p-value of a hypothesis test on \u00b5');
  assert.ok(q, 'question found');
  assert.match(q.stem, /\u00b5\u2081\s*[\u2212-]\s*\u00b5\u2082/, 'mu subscripts render correctly and are not displaced to the end of the sentence');
  assert.doesNotMatch(q.stem, /\d\s+\d\s+can be made/, 'the displaced "1 2" digits are gone from the stem');
  q.options.forEach(o => {
    assert.match(String(o), /H\u2080/, 'every option correctly reads H-naught with a real subscript zero');
    assert.doesNotMatch(String(o), /H\s;/, 'no dangling "H ;" with a missing subscript');
  });
});

test('the 24 CQE questions with stray dash artifacts remain fully answerable and unchanged in meaning (spot-check a representative sample)', async () => {
  const { window } = await load();
  const banks = allExamsUniqueQuestions(window);
  const steelRod = findByStemPrefix(banks, 'cqe', 'The diameter of a steel rod is a quality characteristic');
  assert.equal(steelRod.stem, 'The diameter of a steel rod is a quality characteristic of interest. Samples of size twelve will be selected in the subgroups. Which of the following control charts is preferred to monitor the process variability?');
  assert.deepEqual(Array.from(steelRod.options), ['X\u0304 and R chart', 'X\u0304 and s chart', 'p-chart', 'c-chart']);
  assert.equal(steelRod.options[steelRod.answer], 'X\u0304 and s chart');

  const hospital = findByStemPrefix(banks, 'cqe', 'A hospital is monitoring the surgeries');
  assert.ok(!hospital.stem.endsWith('\u2013'), 'trailing dash removed from the hospital p-chart question');

  const pChart = findByStemPrefix(banks, 'cqe', 'A factory collected data on the number of nonconforming parts and constructed a p-chart');
  assert.match(pChart.stem, /the average fraction of nonconforming parts was p\u0304 = 0\.037/, 'mid-sentence dash removed and p\u0304 overline notation applied, sentence reads cleanly');
});
