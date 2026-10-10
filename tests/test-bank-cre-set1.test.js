'use strict';

/*
 * CRE Exam Set 1 — release gate.
 *  1. Question data integrity and ASQ-style item rules.
 *  2. Independent recomputation of every calculated answer (the key cannot drift from the math).
 *  3. Production delivery: the edge allowlist keeps the CRE scripts.
 *  4. Student journey: every question renders its evidence, and a full sitting scores correctly.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const PAGE_SOURCE = read('test-bank.html');
const EDGE_SOURCE = read('netlify/edge-functions/test-bank-mobile-picker.js');
const MEMORY_SOURCE = read('test-bank-memory-learning.js');
const CRE_SET1_SOURCE = read('test-bank-cre-set1.js');
const CRE_UI_SOURCE = read('test-bank-cre-ui.js');
const CRE_SET2_SOURCE = read('test-bank-cre-set2.js');
const CRE_SET2_UI_SOURCE = read('test-bank-cre-set2-ui.js');
const CRE_SET3_SOURCE = read('test-bank-cre-set3.js');

function loadBank() {
  const sandbox = { window: {} };
  vm.runInNewContext(CRE_SET1_SOURCE, sandbox);
  return sandbox.window.CRE_SET1;
}
const BANK = loadBank();
const byId = (id) => {
  const q = BANK.find((item) => item.qid === id);
  assert.ok(q, `missing ${id}`);
  return q;
};
const optionNumber = (text) => Number(String(text).replace(/[^0-9.\-]/g, ''));

/* ---------- 1. data integrity ---------- */

const BATCHES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const BATCH_CODES = { 1: /^III\.A\.[1-3]$/, 2: /^III\.A\.[4-7]$/, 3: /^III\.B\.[1-6]$/, 4: /^(III\.A\.[1-7]|III\.B\.[1-6]|IV\.A\.[1-5])$/, 5: /^IV\.(A\.[1-5]|B\.[1-6])$/, 6: /^IV\.(B\.[1-6]|C\.[1-5])$/, 7: /^IV\.C\.[1-5]$/, 8: /^II\.(A\.[1-3]|B\.[1-6])$/, 9: /^II\.(A\.[1-3]|B\.[1-6])$/, 10: /^(II\.C|I\.A\.[1-9])$/, 11: /^I\.(A\.[1-9]|B\.([1-9]|10))$/, 12: /^I\.B\.([1-9]|10)$/, 13: /^(I\.(A\.[1-9]|B\.([1-9]|10))|V\.A\.[1-7])$/, 14: /^V\.(A\.[1-7]|B\.[12]|C\.[1-3])$/, 15: /^V\.(A\.[1-7]|B\.[12]|C\.[1-3])$/ };
// BoK domain → engine area (the five shared CRE domains)
const DOMAIN_SUB = { I: 'cre-fundamentals', II: 'cre-risk', III: 'cre-statistics', IV: 'cre-testing', V: 'cre-lifecycle' };
// Focused Quiz opens on the first BoK area (in exam order) that the opening set covers
const FIRST_POPULATED = ['cre-fundamentals', 'cre-risk', 'cre-statistics', 'cre-testing', 'cre-lifecycle'].find((id) => BANK.some((q) => q.sub === id));

test('CRE Set 1 has ten well-formed, uniquely identified questions per released batch', () => {
  assert.equal(BANK.length, BATCHES.length * 10);
  const ids = new Set();
  for (const q of BANK) {
    const m = q.qid.match(/^cre:set-1:b(\d{2})-q(\d{2,3})$/);
    assert.ok(m, `${q.qid} id format`);
    assert.equal(Number(m[1]), q.batch, `${q.qid} id carries its batch`);
    assert.equal(Number(m[2]), BANK.indexOf(q) + 1, `${q.qid} numbering is sequential and never renumbered`);
    assert.ok(!ids.has(q.qid), `duplicate ${q.qid}`);
    ids.add(q.qid);
    assert.equal(q.set, 1);
    assert.ok(BATCHES.includes(q.batch));
    assert.equal(q.sub, DOMAIN_SUB[q.bok.code.split('.')[0]], `${q.qid} area matches its BoK domain`);
    assert.ok(q.bok.domain.startsWith(q.bok.code.split('.')[0] + '. '), `${q.qid} domain name matches its code`);
    assert.match(q.bok.code, BATCH_CODES[q.batch]);
    assert.equal(q.options.length, 4, `${q.qid} has four options`);
    assert.equal(new Set(q.options).size, 4, `${q.qid} options are distinct`);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, `${q.qid} answer index`);
    assert.equal(q.optionRationales.length, 4, `${q.qid} explains every option`);
    assert.match(q.optionRationales[q.answer], /^Correct\./, `${q.qid} rationale marks the key`);
    q.optionRationales.forEach((r, i) => { if (i !== q.answer) assert.doesNotMatch(r, /^Correct\./, `${q.qid} only one correct rationale`); });
    assert.ok(q.why.includes('<b>' + String.fromCharCode(65 + q.answer) + '.'), `${q.qid} explanation names the keyed letter`);
    assert.match(q.why, /tb-source-ref/, `${q.qid} cites its source`);
    assert.doesNotMatch(q.stem, /[<>]/, `${q.qid} stem is plain text (the engine escapes it)`);
    q.options.forEach((o) => assert.doesNotMatch(o, /all of the above|none of the above/i));
    assert.ok(['Easy', 'Medium', 'Hard', 'Very Hard'].includes(q.difficulty));
    assert.ok(q.keyPoint && q.trap, `${q.qid} has teaching fields`);
    if (q.quantitative) assert.ok(q.formula, `${q.qid} quantitative items show their formula`);
  }
});

for (const batch of BATCHES) {
  test(`batch ${batch} follows the planned difficulty mix, visual quota and balanced answer key`, () => {
    const rows = BANK.filter((q) => q.batch === batch);
    assert.equal(rows.length, 10);
    const count = (d) => rows.filter((q) => q.difficulty === d).length;
    assert.equal(count('Easy'), 1);
    assert.equal(count('Medium'), 3);
    assert.equal(count('Hard'), 4);
    assert.equal(count('Very Hard'), 2);
    assert.ok(rows.filter((q) => q.chart).length >= 4, 'at least four questions carry a visual');
    const letters = [0, 0, 0, 0];
    rows.forEach((q) => letters[q.answer]++);
    assert.ok(Math.max(...letters) <= 3 && Math.min(...letters) >= 2, `answer positions are balanced: ${letters}`);
  });
}

test('batch 4 completes Domain III at 35 questions and covers every IV.A planning topic', () => {
  const rows = BANK.filter((q) => q.batch === 4);
  assert.equal(rows.filter((q) => q.sub === 'cre-statistics').length, 5);
  assert.equal(BANK.filter((q) => q.sub === 'cre-statistics').length, 35, 'Domain III is complete');
  assert.deepEqual([...new Set(rows.filter((q) => q.sub === 'cre-testing').map((q) => q.bok.code))].sort(), ['IV.A.1', 'IV.A.2', 'IV.A.3', 'IV.A.4', 'IV.A.5']);
});

test('batch 5 adds three IV.A items and covers every IV.B testing topic', () => {
  const rows = BANK.filter((q) => q.batch === 5);
  assert.ok(rows.every((q) => q.sub === 'cre-testing'));
  assert.equal(rows.filter((q) => q.bok.code.startsWith('IV.A')).length, 3);
  assert.deepEqual([...new Set(rows.filter((q) => q.bok.code.startsWith('IV.B')).map((q) => q.bok.code))].sort(), ['IV.B.1', 'IV.B.2', 'IV.B.3', 'IV.B.4', 'IV.B.5', 'IV.B.6']);
});

test('batch 6 brings IV.B to 15 items, covers IV.B again, and opens IV.C', () => {
  const rows = BANK.filter((q) => q.batch === 6);
  assert.ok(rows.every((q) => q.sub === 'cre-testing'));
  assert.equal(rows.filter((q) => q.bok.code.startsWith('IV.B')).length, 8);
  assert.equal(BANK.filter((q) => q.bok.code.startsWith('IV.B')).length, 15);
  assert.equal([...new Set(rows.filter((q) => q.bok.code.startsWith('IV.B')).map((q) => q.bok.code))].sort().join(), 'IV.B.1,IV.B.2,IV.B.3,IV.B.4,IV.B.5,IV.B.6');
  assert.equal(rows.filter((q) => q.bok.code.startsWith('IV.C')).map((q) => q.bok.code).sort().join(), 'IV.C.1,IV.C.2');
});

test('batch 7 completes Domain IV at 35 and covers every IV.C topic', () => {
  assert.equal(BANK.filter((q) => q.sub === 'cre-testing').length, 35, 'Domain IV is complete');
  const ivc = BANK.filter((q) => q.bok.code.startsWith('IV.C'));
  assert.equal(ivc.length, 12);
  assert.equal([...new Set(ivc.map((q) => q.bok.code))].sort().join(), 'IV.C.1,IV.C.2,IV.C.3,IV.C.4,IV.C.5');
});

test('batch 8 opens Domain II with three II.A and seven II.B items', () => {
  const rows = BANK.filter((q) => q.batch === 8);
  assert.ok(rows.every((q) => q.sub === 'cre-risk'));
  assert.equal(rows.filter((q) => q.bok.code.startsWith('II.A')).length, 3);
  assert.equal([...new Set(rows.filter((q) => q.bok.code.startsWith('II.A')).map((q) => q.bok.code))].sort().join(), 'II.A.1,II.A.2,II.A.3');
  assert.equal(rows.filter((q) => q.bok.code.startsWith('II.B')).length, 7);
});

test('batch 9 brings Domain II to 20 with three II.A and seven II.B items', () => {
  const rows = BANK.filter((q) => q.batch === 9);
  assert.ok(rows.every((q) => q.sub === 'cre-risk'));
  assert.equal(rows.filter((q) => q.bok.code.startsWith('II.A')).length, 3);
  assert.equal([...new Set(rows.filter((q) => q.bok.code.startsWith('II.A')).map((q) => q.bok.code))].sort().join(), 'II.A.1,II.A.2,II.A.3');
  assert.equal(rows.filter((q) => q.bok.code.startsWith('II.B')).length, 7);
  assert.equal(BANK.filter((q) => q.sub === 'cre-risk' && q.batch <= 9).length, 20);
  const iib = new Set(BANK.filter((q) => q.bok.code.startsWith('II.B')).map((q) => q.bok.code));
  assert.equal([...iib].sort().join(), 'II.B.1,II.B.2,II.B.3,II.B.4,II.B.5,II.B.6', 'every II.B topic is covered');
});

test('batch 10 completes Domain II at 25 with five II.C items and opens Domain I with five I.A items', () => {
  const rows = BANK.filter((q) => q.batch === 10);
  assert.equal(rows.filter((q) => q.bok.code === 'II.C' && q.sub === 'cre-risk').length, 5);
  assert.equal(BANK.filter((q) => q.sub === 'cre-risk').length, 25, 'Domain II is complete');
  assert.equal([...new Set(BANK.filter((q) => q.sub === 'cre-risk').map((q) => q.bok.code.slice(0, 4)))].sort().join(), 'II.A,II.B,II.C');
  const ia = rows.filter((q) => q.bok.code.startsWith('I.A'));
  assert.equal(ia.length, 5);
  assert.ok(ia.every((q) => q.sub === 'cre-fundamentals' && q.bok.domain === 'I. Reliability Fundamentals'));
});

test('batch 11 completes the I.A topics and opens I.B', () => {
  const rows = BANK.filter((q) => q.batch === 11);
  assert.ok(rows.every((q) => q.sub === 'cre-fundamentals'));
  assert.equal(rows.filter((q) => q.bok.code.startsWith('I.A')).length, 5);
  assert.equal(rows.filter((q) => q.bok.code.startsWith('I.B')).length, 5);
  const ia = new Set(BANK.filter((q) => q.bok.code.startsWith('I.A')).map((q) => q.bok.code));
  assert.equal([...ia].sort().join(), 'I.A.1,I.A.2,I.A.3,I.A.4,I.A.5,I.A.6,I.A.7,I.A.8,I.A.9', 'every I.A topic is covered');
  assert.equal(BANK.filter((q) => q.sub === 'cre-fundamentals' && q.batch <= 11).length, 15);
});

test('batch 12 adds ten I.B items and covers every I.B topic', () => {
  const rows = BANK.filter((q) => q.batch === 12);
  assert.ok(rows.every((q) => q.sub === 'cre-fundamentals' && q.bok.code.startsWith('I.B')));
  const ib = new Set(BANK.filter((q) => q.bok.code.startsWith('I.B')).map((q) => q.bok.code));
  assert.equal([...ib].sort((a, b) => Number(a.split('.')[2]) - Number(b.split('.')[2])).join(), 'I.B.1,I.B.2,I.B.3,I.B.4,I.B.5,I.B.6,I.B.7,I.B.8,I.B.9,I.B.10', 'every I.B topic is covered');
  assert.equal(BANK.filter((q) => q.sub === 'cre-fundamentals' && q.batch <= 12).length, 25);
});

test('batch 13 completes Domain I at 29 and opens Domain V with six V.A items', () => {
  const rows = BANK.filter((q) => q.batch === 13);
  assert.equal(rows.filter((q) => q.sub === 'cre-fundamentals').length, 4);
  assert.equal(BANK.filter((q) => q.sub === 'cre-fundamentals').length, 29, 'Domain I is complete');
  const va = rows.filter((q) => q.sub === 'cre-lifecycle');
  assert.equal(va.length, 6);
  assert.ok(va.every((q) => q.bok.code.startsWith('V.A') && q.bok.domain === 'V. Lifecycle Reliability' && q.bok.subdomain === 'A. Reliability Design Techniques'));
  assert.equal([...new Set(va.map((q) => q.bok.code))].sort().join(), 'V.A.1,V.A.2,V.A.3,V.A.4,V.A.5');
});

test('batch 14 adds ten Domain V items across V.A, V.B and V.C', () => {
  const rows = BANK.filter((q) => q.batch === 14);
  assert.ok(rows.every((q) => q.sub === 'cre-lifecycle' && q.bok.domain === 'V. Lifecycle Reliability'));
  const by = (p) => rows.filter((q) => q.bok.code.startsWith(p)).length;
  assert.deepEqual([by('V.A'), by('V.B'), by('V.C')], [4, 3, 3]);
  const sub = { 'V.A': 'A. Reliability Design Techniques', 'V.B': 'B. Parts and Systems Development', 'V.C': 'C. Maintainability' };
  rows.forEach((q) => assert.equal(q.bok.subdomain, sub[q.bok.code.slice(0, 3)]));
  assert.equal(BANK.filter((q) => q.sub === 'cre-lifecycle' && q.batch <= 14).length, 16);
});

test('batch 15 completes Set 1 at 150 on the published 2025 CRE blueprint', () => {
  assert.equal(BANK.length, 150);
  const counts = Object.fromEntries(['cre-fundamentals', 'cre-risk', 'cre-statistics', 'cre-testing', 'cre-lifecycle'].map((id) => [id, BANK.filter((q) => q.sub === id).length]));
  assert.deepEqual(counts, { 'cre-fundamentals': 29, 'cre-risk': 25, 'cre-statistics': 35, 'cre-testing': 35, 'cre-lifecycle': 26 });
  const codes = new Set(BANK.map((q) => q.bok.code));
  ['V.A.1', 'V.A.2', 'V.A.3', 'V.A.4', 'V.A.5', 'V.A.6', 'V.A.7', 'V.B.1', 'V.B.2', 'V.C.1', 'V.C.2', 'V.C.3'].forEach((c) => assert.ok(codes.has(c), `${c} is covered`));
  const all = BANK.reduce((a, q) => { a[q.answer]++; return a; }, [0, 0, 0, 0]);
  assert.ok(Math.max(...all) - Math.min(...all) <= 3, `overall answer key is balanced: ${all}`);
});

test('every formula, symbol and variable is LaTeX per LESSON_CREATION_GUIDE §22', () => {
  // Plain-text math outside \( … \) or \[ … \] is not allowed: Greek letters, operators, superscripts,
  // x^2 / sqrt / sigma spellings, f(t)-style functions, single-letter assignments and capability indices.
  const MATH = /[α-ωΑ-Ω√×≈≤≥≠±∑∏∫∩∪Φ²³⁻⁰¹⁴⁵⁶⁷⁸⁹₀-₉̄̂]|\b(sqrt|sigma|mu|lambda|beta|eta|alpha|x-bar|p-hat)\b|\^|<=|>=|\b[A-Za-z]\(t\)|(?<![\w.-])[a-zA-Z]\s?[=<>]\s?[\d.]|\b(Cp|Cpk|Pp|Ppk)\b/;
  const outsideMath = (s) => String(s).replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, ' ');
  for (const q of BANK) {
    const fields = [q.stem, q.why.replace(/<span class="tb-source-ref">[\s\S]*?<\/span>/, ''), q.keyPoint, q.trap, q.formula || '',
      ...q.options, ...q.optionRationales, ...((q.chart && q.chart.type === 'data-table') ? [q.chart.title || '', ...q.chart.columns, ...q.chart.rows.flat()] : [])];
    for (const field of fields) {
      const text = outsideMath(field);
      const hit = text.match(MATH);
      assert.equal(hit, null, `${q.qid}: plain-text math "${hit && hit[0]}" in: ${String(field).slice(0, 90)}`);
      assert.doesNotMatch(String(field), /\$\$?[^$]+\$/, `${q.qid}: $ is never a math delimiter`);
      // delimiters must pair up
      assert.equal((String(field).match(/\\\(/g) || []).length, (String(field).match(/\\\)/g) || []).length, `${q.qid}: unbalanced \\( \\)`);
      assert.equal((String(field).match(/\\\[/g) || []).length, (String(field).match(/\\\]/g) || []).length, `${q.qid}: unbalanced \\[ \\]`);
      // raw < or > inside math could be read as HTML by the sanitizer; use \lt and \gt
      for (const m of String(field).matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) assert.doesNotMatch(m[1] ?? m[2], /[<>]/, `${q.qid}: use \\lt / \\gt inside math`);
    }
    // explanations with a worked calculation show it as display math, with a "where" sentence defining variables
    if (q.quantitative) {
      assert.match(q.why, /\\\[/, `${q.qid}: worked calculation is display math`);
      assert.match(q.why, /<p>where |[.,] where |Here, /i, `${q.qid}: variables are defined after the formula`);
    }
  }
});

test('numeric options are listed in ascending order', () => {
  for (const q of BANK) {
    const values = q.options.map(optionNumber);
    if (!values.every((v, i) => Number.isFinite(v) && /^[\d.,\s]+(cycles|ppm)?$/.test(q.options[i]))) continue;
    assert.deepEqual(values, values.slice().sort((a, b) => a - b), `${q.qid} options ascend`);
  }
});

/* ---------- 2. independent recomputation ---------- */

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const comb = (n, k) => factorial(n) / (factorial(k) * factorial(n - k));
const poissonPmf = (k, lam) => Math.exp(-lam) * lam ** k / factorial(k);
const poissonCdf = (k, lam) => Array.from({ length: k + 1 }, (_, i) => poissonPmf(i, lam)).reduce((a, b) => a + b, 0);
// Acklam's rational approximation of the standard normal quantile (|error| < 1.2e-9).
function normInv(p) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425;
  if (p < lo) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - lo) return -normInv(1 - p);
  const q = p - 0.5, r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
function normCdf(z) {
  // W. J. Cody-style erf approximation via the complementary series (|error| < 1.5e-7)
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2);
  return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}
// Upper 5% chi-square critical values (Appendix G).
const CHI2_05 = { 2: 5.991, 3: 7.815, 4: 9.488 };

function assertKeyed(q, value, tolerance) {
  const keyed = optionNumber(q.options[q.answer]);
  assert.ok(Math.abs(keyed - value) <= tolerance, `${q.qid}: keyed ${keyed} vs computed ${value}`);
  q.options.forEach((o, i) => {
    if (i !== q.answer) assert.ok(Math.abs(optionNumber(o) - value) > tolerance, `${q.qid}: distractor ${o} must not match the answer`);
  });
}

test('Q1 standard error of the mean is σ/√n', () => {
  const q = byId('cre:set-1:b01-q01');
  const se = 18000 / Math.sqrt(36);
  assert.equal(se, 3000);
  assert.match(q.options[q.answer], /3,000 cycles, and is approximately normal/);
});

test('Q2 P(South | Corrosion) from the contingency table, and dependence', () => {
  const q = byId('cre:set-1:b01-q02');
  const rows = q.chart.rows.map((r) => r.map((c) => Number(c)));
  const [north, south, total] = rows;
  assert.equal(north[2] + south[2], total[2]);
  const conditional = south[2] / total[2];
  const marginal = south[4] / total[4];
  assert.equal(conditional, 0.7);
  assert.notEqual(conditional, marginal);
  assert.match(q.options[q.answer], /^0\.70; .*dependent/);
});

test('Q3 outgoing defect level among shipped modules is read from the tree data', () => {
  const q = byId('cre:set-1:b01-q03');
  const [defect, good] = q.chart.children;
  const pD = Number(defect.p), pG = Number(good.p);
  const d1 = Number(defect.children[0].p), d2 = Number(defect.children[0].children[0].p);
  const f1 = Number(good.children[0].p), f2 = Number(good.children[0].children[0].p);
  const scrapD = pD * d1 * d2, scrapG = pG * f1 * f2;
  const shipDefect = pD - scrapD, ship = 1 - scrapD - scrapG;
  assertKeyed(q, shipDefect / ship * 1e6, 1);
  // the joint (un-normalized) escape probability is present as the intended distractor
  assert.ok(q.options.some((o) => Math.abs(optionNumber(o) - shipDefect * 1e6) < 1));
});

test('Q4 spares: smallest s with cumulative Poisson ≥ 0.95', () => {
  const q = byId('cre:set-1:b01-q04');
  const sheet = Object.fromEntries(q.chart.rows.map(([k, v]) => [k, Number(String(v).replace(/[^0-9.]/g, ''))]));
  const lam = sheet['Compressors running continuously'] * sheet['Seals per compressor'] * sheet['Resupply interval'] / sheet['Seal MTBF (constant failure rate)'];
  assert.equal(lam, 3.5);
  let s = 0;
  while (poissonCdf(s, lam) < 0.95) s++;
  assertKeyed(q, s, 0.01);
});

test('Q5 at-least-10-of-12 binomial', () => {
  const q = byId('cre:set-1:b01-q05');
  let p = 0;
  for (let k = 10; k <= 12; k++) p += comb(12, k) * 0.95 ** k * 0.05 ** (12 - k);
  assertKeyed(q, p, 0.00006);
});

test('Q6 expected fleet failures use Weibull conditional reliability from the output', () => {
  const q = byId('cre:set-1:b01-q06');
  const table = Object.fromEntries(q.chart.rows);
  const beta = Number(table['Shape \\(\\beta\\)']);
  const eta = Number(table['Scale \\(\\eta\\)'].replace(/[^0-9.]/g, ''));
  const R = (t) => Math.exp(-((t / eta) ** beta));
  assertKeyed(q, 40 * (1 - R(1000) / R(500)), 0.05);
  // the displayed MTTF and B10 agree with β and η (Γ(1 + 1/1.8) = 0.889287)
  assert.ok(Math.abs(eta * 0.8892866 - Number(table['Mean (MTTF)'].replace(/[^0-9.]/g, ''))) < 0.1);
  assert.ok(Math.abs(eta * (-Math.log(0.9)) ** (1 / beta) - Number(table['B10 life'].replace(/[^0-9.]/g, ''))) < 0.1);
});

test('Q7 lognormal B10 life', () => {
  const q = byId('cre:set-1:b01-q07');
  const b10 = Math.exp(8.987 + normInv(0.10) * 0.60);
  assertKeyed(q, b10, 5);
});

test('Q8 Kaplan-Meier estimate at 750 h from the test log', () => {
  const q = byId('cre:set-1:b01-q08');
  const log = q.chart.rows.map(([, hours, status]) => ({ t: Number(hours), failed: /^Failed/.test(status) })).sort((a, b) => a.t - b.t);
  let atRisk = log.length, r = 1;
  for (const row of log) {
    if (row.t > 750) break;
    if (row.failed) r *= (atRisk - 1) / atRisk;
    atRisk--;
  }
  assertKeyed(q, r, 0.0005);
});

test('Q9 chi-square goodness of fit: pooled statistic, df = k − 1 − m, decision', () => {
  const q = byId('cre:set-1:b01-q09');
  const counts = q.chart.rows[0].slice(1).map(Number);
  const n = counts.reduce((a, b) => a + b, 0);
  const lam = counts.reduce((sum, c, k) => sum + k * c, 0) / n;
  assert.equal(lam, 1.2);
  const expected = [0, 1, 2].map((k) => n * poissonPmf(k, lam));
  expected.push(n - expected.reduce((a, b) => a + b, 0));
  assert.ok(n * (1 - poissonCdf(3, lam)) < 5, 'the 4+ cell must be pooled');
  const observed = [counts[0], counts[1], counts[2], counts.slice(3).reduce((a, b) => a + b, 0)];
  const chi = observed.reduce((sum, o, i) => sum + (o - expected[i]) ** 2 / expected[i], 0);
  const df = observed.length - 1 - 1;
  assert.equal(df, 2);
  assert.ok(chi > CHI2_05[2] && chi < CHI2_05[3], 'the df choice decides the outcome, as intended');
  const keyed = q.options[q.answer];
  assert.ok(keyed.startsWith('\\(\\chi^2 = ' + chi.toFixed(2) + '\\) with 2 degrees of freedom'), keyed);
  assert.match(keyed, /reject the Poisson model/);
  assert.doesNotMatch(keyed, /fail to reject/);
});

test('Q10 Weibull slope from the plotted line is about 0.5', () => {
  const q = byId('cre:set-1:b01-q10');
  const { beta, eta } = q.chart.line;
  const t10 = eta * (-Math.log(0.9)) ** (1 / beta);
  const slope = (Math.log(-Math.log(1 - 0.632)) - Math.log(-Math.log(0.9))) / (Math.log(1000) - Math.log(t10));
  assert.ok(Math.abs(slope - 0.5) < 0.01);
  assert.ok(Math.abs(t10 - 11.1) < 0.1, 'stem quotes the 10% crossing at about 11 h');
  assert.ok(q.options[q.answer].startsWith('\\(\\beta \\approx 0.5\\): the hazard rate is decreasing (early-life failures)'));
  // plotted points are median ranks for n = 10
  q.chart.points.forEach(([, f], i) => assert.ok(Math.abs(f - 100 * (i + 1 - 0.3) / 10.4) < 0.06));
});

const tableOf = (q) => Object.fromEntries(q.chart.rows.map(([k, v]) => [k, v]));
const n_ = (s) => Number(String(s).replace(/[^0-9.\-]/g, ''));

test('Q11 conditional reliability from the plotted hazard function (area from 800 h to 1,500 h)', () => {
  const q = byId('cre:set-1:b02-q11');
  const pts = q.chart.series[0].points.map(([t, h]) => [t, h / 1e4]);
  const hAt = (t) => { for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [t0, h0] = pts[i - 1], [t1, h1] = pts[i]; return h0 + (h1 - h0) * (t - t0) / (t1 - t0); } return NaN; };
  const cum = (t) => { let H = 0; for (let u = 0; u < t; u += 1) H += (hAt(u) + hAt(u + 1)) / 2; return H; };
  const dH = cum(1500) - cum(800);
  assert.ok(Math.abs(dH - 0.53) < 1e-6);
  assert.match(q.stem, /already run 800 hours/);
  assertKeyed(q, Math.exp(-dH), 0.0006);
  assert.ok(q.options.includes(Math.exp(-cum(1500)).toFixed(3)), 'unconditional R(1500) is a distractor');
});

test('Q12 hazard = f/(1 − F) from the output, and it increases across the table', () => {
  const q = byId('cre:set-1:b02-q12');
  const hz = q.chart.rows.map(([, f, F]) => Number(f) / (1 - Number(F)));
  hz.slice(1).forEach((h, i) => assert.ok(h > hz[i], 'hazard increases'));
  const at800 = hz[3];
  assert.ok(Math.abs(at800 - 1.40e-3) < 0.005e-3);
  assert.ok(q.options[q.answer].startsWith('\\(h(800) \\approx 1.40 \\times 10^{-3}\\) per hour; the failure rate is increasing'));
  // the table is a genuine Weibull(β = 1.6, η = 1000) to the printed precision
  q.chart.rows.forEach(([t, f, F]) => {
    const x = n_(t) / 1000, R = Math.exp(-(x ** 1.6));
    assert.ok(Math.abs(1 - R - Number(F)) < 0.00006 && Math.abs(1.6 / 1000 * x ** 0.6 * R - Number(f)) < 0.0000006);
  });
});

test('Q13 zero-failure Weibull test: solve for test time with 12 stations', () => {
  const q = byId('cre:set-1:b02-q13');
  const plan = tableOf(q);
  const beta = Number(plan['Known Weibull shape \\(\\beta\\)']), n = Number(plan['Test stations available (one unit each)']);
  const k = (Math.log(1 - 0.90) / (n * Math.log(0.95))) ** (1 / beta);
  assertKeyed(q, 2000 * k, 10);
  assert.ok(!('Test time available per unit' in plan), 'test time is the unknown');
});

test('Q14 c = 0 and c = 1 binomial plans and their acceptance probability at R = 0.97', () => {
  const q = byId('cre:set-1:b02-q14');
  const accept = (n, c, p) => Array.from({ length: c + 1 }, (_, x) => comb(n, x) * p ** x * (1 - p) ** (n - x)).reduce((a, b) => a + b, 0);
  const size = (c) => { let n = 1; while (accept(n, c, 0.10) > 0.10) n++; return n; };
  const n0 = size(0), n1 = size(1);
  assert.deepEqual([n0, n1], [22, 38]);
  const a0 = accept(n0, 0, 0.03), a1 = accept(n1, 1, 0.03);
  const keyed = q.options[q.answer];
  assert.ok(keyed.includes(`\\(c = 0\\): ${n0} relays, accepted with probability ${a0.toFixed(2)}`), keyed);
  assert.ok(keyed.includes(`\\(c = 1\\): ${n1} relays, accepted with probability ${a1.toFixed(2)}`), keyed);
  q.options.forEach((o, i) => { if (i !== q.answer) assert.ok(!(o.includes(`${n1} relays, accepted with probability ${a1.toFixed(2)}`) && o.includes(a0.toFixed(2))), o); });
});

test('Q15 long-term fraction below LSL uses the overall sigma', () => {
  const q = byId('cre:set-1:b02-q15');
  const r = tableOf(q);
  const z = (Number(r['Sample mean']) - Number(r.LSL)) / Number(r['StDev (overall)']);
  const ppm = (1 - normCdf(z)) * 1e6;
  assertKeyed(q, ppm, 5);
  const rounded = (1 - normCdf(0.91 * 3)) * 1e6; // working from the printed Ppk
  const nearest = q.options.map(optionNumber).reduce((best, v, i, all) => (Math.abs(v - rounded) < Math.abs(all[best] - rounded) ? i : best), 0);
  assert.equal(nearest, q.answer, 'the rounded-Ppk route still lands nearest the key');
  assert.ok(Math.abs(z / 3 - 0.91) < 0.005, 'Ppk shown agrees with the data');
});

test('Q16 p chart with per-subgroup limits: only Wednesday signals', () => {
  const q = byId('cre:set-1:b02-q16');
  // spread into this realm: the data arrays come from the page's window
  const rows = [...q.chart.rows].map(([d, n, np, c]) => ({ d, n: Number(n), np: Number(np), c: Number(c) }));
  const N = rows.reduce((a, r) => a + r.n, 0);
  const pbar = rows.reduce((a, r) => a + r.np, 0) / N;
  const ucl = (n) => pbar + 3 * Math.sqrt(pbar * (1 - pbar) / n);
  const signals = rows.filter((r) => r.np / r.n > ucl(r.n)).map((r) => r.d);
  assert.deepEqual(signals, ['Wed']);
  const avgN = N / rows.length;
  assert.deepEqual(rows.filter((r) => r.np / r.n > ucl(avgN)).map((r) => r.d), ['Tue'], 'average-n limits reverse the conclusion');
  const ubar = rows.reduce((a, r) => a + r.c, 0) / N;
  assert.deepEqual(rows.filter((r) => r.c / r.n > ubar + 3 * Math.sqrt(ubar / r.n)).map((r) => r.d), ['Tue'], 'u-chart distractor is computed correctly');
  assert.ok(Math.abs(ucl(100) - 0.099) < 0.0005 && Math.abs(ucl(200) - 0.082) < 0.0005);
  assert.match(q.options[q.answer], /^\\\(p\\\) chart with limits for each day.*only Wednesday/);
});

test('Q17 additional unit-hours to reach a 2,000 h MTBF lower bound (time-terminated)', () => {
  const q = byId('cre:set-1:b02-q17');
  const T = q.chart.rows.reduce((a, r) => a + n_(r[1]), 0), r = q.chart.rows.reduce((a, row) => a + Number(row[2]), 0);
  assert.equal(T, 12000); assert.equal(r, 3);
  assert.ok(2 * T / 13.362 < 2000, 'not yet demonstrated');
  const more = 2000 * 13.362 / 2 - T; // χ²(0.10; 2r + 2 = 8) = 13.362, Appendix G
  assert.ok(Math.abs(more - 1362) < 1);
  assert.match(q.options[q.answer], /^About 1,360 h more/);
});

test('Q18 tolerance bound: not demonstrated at n = 20; smallest tabled n that passes is 30', () => {
  const q = byId('cre:set-1:b02-q18');
  const L = (n) => 74.6 - Number(q.chart.rows.find((r) => r[0] === String(n))[2]) * 2.1;
  assert.ok(L(20) < 68 && Math.abs(L(20) - 67.7) < 0.05);
  const pass = q.chart.rows.map((r) => Number(r[0])).filter((n) => L(n) >= 68);
  assert.equal(Math.min(...pass), 30);
  assert.ok(L(25) < 68 && L(25).toFixed(1) === '68.0', 'n = 25 is the rounding trap');
  assert.match(q.options[q.answer], /^Not demonstrated: the lower tolerance bound is 67\.7 ksi\..*30 is the smallest/);
});

test('Q19 requirement at 900 h judged on the interpolated lower bound', () => {
  const q = byId('cre:set-1:b02-q19');
  const rows = q.chart.rows.map(([t, est, lo]) => ({ t: n_(t), est: Number(est), lo: Number(lo) }));
  const interp = (key, t) => { const i = rows.findIndex((r) => r.t >= t); const a = rows[i - 1], b = rows[i]; return a[key] + (b[key] - a[key]) * (t - a.t) / (b.t - a.t); };
  assert.ok(interp('lo', 900) < 0.90 && interp('est', 900) > 0.90);
  assert.ok(Math.abs(interp('lo', 900) - 0.889) < 0.0006);
  const a = rows.find((r) => r.t === 750), b = rows.find((r) => r.t === 1000);
  const cross = a.t + (b.t - a.t) * (a.lo - 0.90) / (a.lo - b.lo);
  assert.ok(Math.abs(cross - 830) < 2);
  assert.match(q.options[q.answer], /^Not demonstrated: the interpolated 95% lower bound at 900 h is about 0\.889.*about 830 h/);
});

test('Q21 the claims cliff sits exactly at the end of the 12-month warranty', () => {
  const q = byId('cre:set-1:b03-q21');
  const pts = q.chart.series[0].points;
  const at = (m) => pts.find(([x]) => x === m)[1];
  assert.ok(at(12) > at(7), 'rising before the cliff (wear-out signal)');
  assert.ok(Math.max(...pts.filter(([x]) => x > 12).map(([, y]) => y)) < at(12) / 4, 'cliff after month 12');
  assert.match(q.options[q.answer], /^Claims stop being captured when warranty coverage ends/);
});

test('Q22 confirmed failures per unit-hour, NFF excluded, and a significant difference', () => {
  const q = byId('cre:set-1:b03-q22');
  const rows = q.chart.rows.map((row) => ({ f: n_(row[3]) - n_(row[4]), T: n_(row[1]) * n_(row[2]) }));
  const [a, b] = rows.map((r) => r.f / r.T * 1e6);
  assert.ok(Math.abs(a - 41.7) < 0.05 && Math.abs(b - 75.0) < 0.05);
  const r = rows[0].f + rows[1].f, pi0 = rows[1].T / (rows[0].T + rows[1].T);
  const z = (rows[1].f - r * pi0) / Math.sqrt(r * pi0 * (1 - pi0));
  assert.ok(z > 1.96 && Math.abs(z - 2.53) < 0.005);
  assert.ok(q.options[q.answer].includes('75.0 versus 41.7 confirmed failures') && /significant at the 5% level \(\\\(z \\approx 2\.5\\\)\)/.test(q.options[q.answer]));
});

test('Q24 Cox model: CI on the coefficient scale and the break-even temperature', () => {
  const q = byId('cre:set-1:b03-q24');
  const [coat, temp] = q.chart.rows.map((r) => Number(String(r[1]).replace('−', '-')));
  const se = Number(q.chart.rows[0][3]);
  const lo = Math.exp(coat - 1.96 * se), hi = Math.exp(coat + 1.96 * se);
  const T = 60 + 10 * (-coat / temp);
  assert.ok(Math.abs(T - 77.1) < 0.05);
  assert.equal(q.options[q.answer], `Coating hazard ratio ${lo.toFixed(2)} to ${hi.toFixed(2)}; above about ${Math.round(T)} °C.`);
});

test('Q27 Pareto cut on unplanned downtime (planned overhaul excluded)', () => {
  const q = byId('cre:set-1:b03-q27');
  const rows = q.chart.rows.map(([p, , d, planned]) => ({ p, d: n_(d) - n_(planned) })).sort((x, y) => y.d - x.d);
  const total = rows.reduce((a, r) => a + r.d, 0);
  assert.equal(total, 850);
  const pick = []; let cum = 0;
  for (const r of rows) { if (cum / total >= 0.70) break; pick.push(r.p); cum += r.d; }
  assert.deepEqual(pick, ['P-105', 'P-103', 'P-108', 'P-101']);
  assert.equal(q.options[q.answer], 'P-105, P-103, P-108 and P-101.');
  q.chart.rows.forEach(([p, f, d, planned, mttr]) => assert.ok(Math.abs((n_(d) - n_(planned)) / Number(f) - Number(mttr)) < 0.06, `${p} MTTR`));
});

test('Q28 life table from the Nevada chart (cohorts pooled by month in service)', () => {
  const q = byId('cre:set-1:b03-q28');
  const cohorts = q.chart.rows.map((r) => ({ n: n_(r[1]), claims: r.slice(2).map((c) => (c === '—' ? null : n_(c))).filter((c) => c !== null) }));
  let R = 1;
  for (let age = 0; age < 3; age++) {
    let risk = 0, fail = 0;
    for (const c of cohorts) if (c.claims.length > age) { risk += c.n - c.claims.slice(0, age).reduce((a, b) => a + b, 0); fail += c.claims[age]; }
    R *= 1 - fail / risk;
  }
  assertKeyed(q, (1 - R) * 100, 0.006);
});

test('Q23 and Q30 exhibits support their keys', () => {
  const q23 = byId('cre:set-1:b03-q23');
  assert.match(q23.chart.rows.find((r) => r[0] === 'U5')[1], /Removed at 400 h/);
  assert.match(q23.chart.rows.find((r) => r[0] === 'U7')[1], /250 h inspection was skipped; found failed at 500 h/);
  assert.match(q23.options[q23.answer], /^U1 and U7 are left-censored.*U2 and U6 are interval-censored.*U4 and U5 are right-censored \(at 1,000 h and 400 h\)\.$/);
  const q30 = byId('cre:set-1:b03-q30');
  q30.chart.rows.forEach((r) => assert.equal(Number(r[5]) > 0, r[4] === 'Implementation', `${r[0]}: recurrence iff closed without verification`));
  assert.match(q30.options[q30.answer], /remedial.*containment/);
});

test('Q31 Kaplan-Meier at 1,000 h with two suspensions; 5,000 h needs a parametric model', () => {
  const q = byId('cre:set-1:b04-q31');
  const log = [...q.chart.rows].flatMap(([unit, hours, status]) => {
    const n = /^S6 to S10$/.test(unit) ? 5 : 1;
    return Array.from({ length: n }, () => ({ t: n_(hours), failed: status === 'Failed' }));
  }).sort((a, b) => a.t - b.t);
  assert.equal(log.length, 10);
  let atRisk = 10, R = 1;
  for (const row of log) { if (row.failed) R *= (atRisk - 1) / atRisk; atRisk--; }
  assert.ok(Math.abs(R - 0.65625) < 1e-9);
  const keyed = q.options[q.answer];
  assert.ok(keyed.startsWith(`Reliability at 1,000 h is ${R.toFixed(3)}.`) && /parametric model/.test(keyed), keyed);
  assert.ok(Math.max(...log.map((r) => r.t)) < 5000, '5,000 h lies beyond every observation');
  // distractors: suspensions ignored (7/10), and an unchecked constant-hazard extrapolation (R^5)
  assert.ok(q.options.some((o) => o.startsWith('Reliability at 1,000 h is 0.700')));
  assert.ok(q.options.some((o) => o.includes(`about ${(R ** 5).toFixed(2)}`)));
});

test('Q32 lognormal B10 from the 50% and 84.1% points of the plotted line', () => {
  const q = byId('cre:set-1:b04-q32');
  const { median, sigma } = q.chart.line;
  const at = (f) => q.chart.markers.find((m) => m.f === f).t;
  assert.equal(at(50), median);
  assert.ok(Math.abs(Math.log(at(84.1) / at(50)) - sigma) < 1e-4, 'the 84.1% marker sits one sigma above the median');
  assertKeyed(q, median * Math.exp(normInv(0.10) * sigma), 1);
  // plotted points are median ranks for 12 failures and lie near the line
  q.chart.points.forEach(([t, f], i) => {
    assert.ok(Math.abs(f - 100 * (i + 1 - 0.3) / 12.4) < 0.06);
    assert.ok(Math.abs(Math.log(t / median) / sigma - normInv(f / 100)) < 0.08, `point ${i + 1} near the fitted line`);
  });
});

test('Q33 two-sided 90% lower limit is the one-sided 95% bound; B10 bound misses 3,000 h', () => {
  const q = byId('cre:set-1:b04-q33');
  const rows = [...q.chart.rows].map((r) => r.map(n_));
  const b10 = rows.find((r) => r[0] === 10);
  assert.ok(b10[2] < 3000 && b10[1] > 3000);
  // intervals are symmetric on the log scale, wider for lower percentiles, and follow one Weibull shape
  rows.forEach((r) => assert.ok(Math.abs(Math.log(r[1] / r[2]) - Math.log(r[3] / r[1])) < 0.01));
  const beta = (p1, p2, t1, t2) => Math.log(Math.log(1 - p2) / Math.log(1 - p1)) / Math.log(t2 / t1);
  assert.ok(Math.abs(beta(0.05, 0.10, rows[1][1], rows[2][1]) - beta(0.01, 0.10, rows[0][1], rows[2][1])) < 0.05);
  assert.match(q.options[q.answer], /^Not demonstrated: the lower limit of a two-sided 90% interval is a one-sided 95% lower bound/);
});

test('Q34 only Supplier C meets the quartile rule without an early outlier', () => {
  const q = byId('cre:set-1:b04-q34');
  const pass = [...q.chart.groups].filter((g) => g.q1 > 40);
  assert.equal(pass.map((g) => g.label).join(), 'Supplier B,Supplier C');
  const lowest = (g) => Math.min(g.min, ...(g.outliers || []));
  assert.equal(pass.reduce((best, g) => (lowest(g) > lowest(best) ? g : best)).label, 'Supplier C');
  q.chart.groups.forEach((g) => {
    assert.ok(g.min <= g.q1 && g.q1 <= g.median && g.median <= g.q3 && g.q3 <= g.max);
    // a valid box plot: whiskers stay inside the 1.5 × IQR fences, plotted outliers lie outside them
    const iqr = g.q3 - g.q1, lo = g.q1 - 1.5 * iqr, hi = g.q3 + 1.5 * iqr;
    assert.ok(g.min >= lo && g.max <= hi, `${g.label} whiskers inside the fences`);
    (g.outliers || []).forEach((o) => assert.ok(o < lo || o > hi, `${g.label} outlier ${o} is beyond a fence`));
  });
  assert.match(q.options[q.answer], /^Supplier C:/);
});

test('Q35 the zero readings flatten the fit: r ≈ 0.01 with them, strong without', () => {
  const q = byId('cre:set-1:b04-q35');
  const pts = q.chart.series[0].points;
  const r = (xy) => {
    const n = xy.length, mx = xy.reduce((a, p) => a + p[0], 0) / n, my = xy.reduce((a, p) => a + p[1], 0) / n;
    const sxy = xy.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0), sxx = xy.reduce((a, p) => a + (p[0] - mx) ** 2, 0), syy = xy.reduce((a, p) => a + (p[1] - my) ** 2, 0);
    return sxy / Math.sqrt(sxx * syy);
  };
  assert.equal(pts.length, 40);
  assert.equal(pts.filter((p) => p[1] === 0).length, 8);
  assert.ok(Math.abs(r(pts) - 0.01) < 0.005, 'the stem quotes the AI tool correctly');
  assert.ok(r(pts.filter((p) => p[1] > 0)) > 0.95);
  assert.match(q.options[q.answer], /sensor or logger dropouts/);
});

test('Q36 Duane projection to an instantaneous MTBF of 2,500 h', () => {
  const q = byId('cre:set-1:b04-q36');
  let T = 0, r = 0; const cum = [];
  for (const row of q.chart.rows) { T += n_(row[1]); r += n_(row[2]); cum.push([T, T / r]); }
  const [[T1, c1], , [T3, c3]] = cum;
  const b = Math.log(c3 / c1) / Math.log(T3 / T1);
  assert.ok(Math.abs(b - 0.369) < 0.001);
  const more = T3 * ((2500 * (1 - b)) / c3) ** (1 / b) - T3;
  assert.ok(Math.abs(more - 39500) < 100);
  assert.equal(q.options[q.answer], 'About 39,500 more hours');
  const cumOnly = T3 * (2500 / c3) ** (1 / b) - T3;
  assert.ok(q.options.includes(`About ${Math.round(cumOnly / 1000)},000 more hours`), 'cumulative-MTBF trap is offered');
});

test('Q37 the plan separates field-combined stresses and runs on overdue calibration', () => {
  const q = byId('cre:set-1:b04-q37');
  const row = (k) => [...q.chart.rows].find((r) => r[0].startsWith(k));
  assert.match(row('Vibration')[2], /after thermal cycling/);
  assert.match(row('Temperature')[1], /while the vehicle vibrates/);
  const months = (s) => n_(s.match(/(\d+) months/)[1]);
  assert.ok(months(row('Chamber')[2]) > months(row('Chamber')[1]), 'calibration is overdue');
  assert.match(q.options[q.answer], /at the same time.*recalibrate/);
  assert.ok(q.options.some((o, i) => i !== q.answer && /^Recalibrate/.test(o)), "a distractor fixes calibration alone");
});

test('Q38 heavy-user life in cycles, then the extended zero-failure sample size', () => {
  const q = byId('cre:set-1:b04-q38');
  const plan = tableOf(q);
  const perWeek = plan['Use at the 10th, 50th and 90th percentile user'].match(/\d+/g).map(Number);
  const weeks = n_(plan['Warranty life'].match(/\((\d+) weeks\)/)[1]);
  const beta = Number(plan['Known Weibull shape \\(\\beta\\)']), rig = n_(plan['Rig limit per latch']);
  const size = (cycles) => Math.ceil(Math.log(0.10) / ((rig / cycles) ** beta * Math.log(0.95)));
  assertKeyed(q, size(perWeek[2] * weeks), 0.01);
  assert.ok(q.options.includes(String(size(perWeek[1] * weeks))), 'median-user trap is offered');
});

test('Q40 B10 = 2 years with beta = 1.5 implies an MTTF of 8.1 years', () => {
  const q = byId('cre:set-1:b04-q40');
  const beta = 1.5, eta = 2 / (-Math.log(0.9)) ** (1 / beta);
  // Γ(1 + 1/β) by the Lanczos approximation
  const gamma = (z) => { const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; z -= 1; let x = c[0]; for (let i = 1; i < g + 2; i++) x += c[i] / (z + i); const t = z + g + 0.5; return Math.sqrt(2 * Math.PI) * t ** (z + 0.5) * Math.exp(-t) * x; };
  assertKeyed(q, eta * gamma(1 + 1 / beta), 0.05);
  assert.ok(q.options.includes(`${(2 / -Math.log(0.9)).toFixed(1)} years`), 'exponential trap is offered');
});

test('Q42 the smallest HALT operating margin is cold', () => {
  const q = byId('cre:set-1:b05-q42');
  const num = (s) => Number(String(s).replace('−', '-').replace(/[^0-9.\-]/g, ''));
  const margin = (r) => Math.abs(num(r[2]) - num(r[1])) / Math.abs(num(r[1]));
  const rows = [...q.chart.rows];
  const cold = rows.find((r) => r[0] === 'Cold step');
  assert.equal(Math.abs(num(cold[2]) - num(cold[1])), 5);
  rows.filter((r) => r !== cold).forEach((r) => assert.ok(Math.abs(num(r[2]) - num(r[1])) >= 25, `${r[0]} has a wide margin`));
  rows.forEach((r) => { if (r !== cold) assert.ok(margin(r) > margin(cold)); });
  assert.match(q.options[q.answer], /^Cold is the weak link/);
});

test('Q43 binomial upper bound on p interpolated from the table gives R ≥ 0.876', () => {
  const q = byId('cre:set-1:b05-q43');
  const binomLE1 = (n, p) => (1 - p) ** n + n * p * (1 - p) ** (n - 1);
  [...q.chart.rows].forEach(([p, v]) => assert.ok(Math.abs(binomLE1(30, Number(p)) - Number(v)) < 0.0006, `table row p = ${p}`));
  let lo = 0.01, hi = 0.5;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (binomLE1(30, mid) > 0.10) lo = mid; else hi = mid; }
  assert.ok(Math.abs(1 - lo - 0.876) < 0.001);
  assert.ok(q.options[q.answer].startsWith('Reliability at 500 cycles is at least about 0.876.'));
  assert.ok(q.options.some((o) => o.includes((0.1 ** (1 / 30)).toFixed(3))), 'zero-failure trap');
});

test('Q44 Arrhenius AF in kelvin and the zero-failure chi-square MTBF bound', () => {
  const q = byId('cre:set-1:b05-q44');
  const plan = tableOf(q);
  const c2k = (s) => n_(s) + 273.15;
  const AF = Math.exp((n_(plan['Activation energy']) / 8.617e-5) * (1 / c2k(plan['Use temperature']) - 1 / c2k(plan['Test temperature'])));
  assert.ok(Math.abs(AF - 77.7) < 0.1);
  const Teq = AF * n_(plan['Units on test']) * 1000;
  const L = 2 * Teq / 4.605; // χ²(0.10; 2r + 2 = 2), Appendix G
  assert.ok(Math.abs(L - 675000) < 1000);
  assert.equal(q.options[q.answer], 'About 675,000 h');
});

test('Q45 power-law exponent from the two same-mode levels only', () => {
  const q = byId('cre:set-1:b05-q45');
  const rows = [...q.chart.rows].map(([v, l, mode]) => ({ v: n_(v), l: n_(l), mode }));
  const same = rows.filter((r) => r.mode === rows[0].mode);
  assert.equal(same.length, 2, 'the highest stress changes failure mode');
  const b = Math.log(same[0].l / same[1].l) / Math.log(same[1].v / same[0].v);
  const L24 = same[0].l * (same[0].v / 24) ** b;
  assert.ok(Math.abs(L24 - 12136) < 5);
  assert.equal(q.options[q.answer], `About ${(Math.round(L24 / 100) * 100).toLocaleString('en-US')} h`);
});

test('Q47 producer and consumer risks from the Poisson OC curve', () => {
  const q = byId('cre:set-1:b05-q47');
  const accept = (mu) => [0, 1, 2].reduce((a, x) => a + Math.exp(-mu) * mu ** x / factorial(x), 0);
  const alpha = 1 - accept(12000 / 6000), beta = accept(12000 / 2000);
  assert.ok(Math.abs(alpha - 0.323) < 0.001 && Math.abs(beta - 0.062) < 0.001);
  q.chart.series[0].points.forEach(([m, pa]) => assert.ok(Math.abs(accept(12000 / m) - pa) < 0.0006, `OC point at ${m}`));
  assert.match(q.options[q.answer], /^Producer’s risk about 0\.32 and consumer’s risk about 0\.06\./);
});

test('Q48 linear-through-origin pseudo-failure times: two pads fail inside 40,000 km', () => {
  const q = byId('cre:set-1:b05-q48');
  const d = [5, 10, 15];
  const lives = [...q.chart.rows].map(([pad, ...w]) => ({ pad, life: 8 / (w.reduce((a, x, i) => a + d[i] * Number(x), 0) / 350) }));
  const failing = lives.filter((p) => p.life < 40).map((p) => p.pad).join();
  assert.equal(failing, 'Pad 3,Pad 5');
  assertKeyed(q, 2, 0.01);
});

test('Q49 availability counts every outage minute', () => {
  const q = byId('cre:set-1:b05-q49');
  const outage = [...q.chart.rows].reduce((a, r) => a + n_(r[2]), 0);
  assertKeyed(q, (1 - outage / 43200) * 100, 0.005);
});

test('Q50 each firmware activity is labelled with its software test method', () => {
  const q = byId('cre:set-1:b05-q50');
  const rows = [...q.chart.rows];
  assert.match(rows[0][1], /source code.*every branch/);
  assert.match(rows[1][1], /how often.*estimate field failure intensity/);
  assert.match(rows[2][1], /corrupts/);
  assert.match(rows[3][1], /Reruns the full existing test suite/);
  assert.equal(q.options[q.answer], '1 white-box; 2 operational profile; 3 fault injection; 4 regression');
});

const K_B = 8.617333e-5;
const arr = (ea, tUseC, tTestC) => Math.exp((ea / K_B) * (1 / (tUseC + 273.15) - 1 / (tTestC + 273.15)));

test('Q51 Arrhenius–Peck acceleration converts 1,000 test hours to 6.3 field years', () => {
  const q = byId('cre:set-1:b06-q51');
  const row = (k) => [...q.chart.rows].find((r) => r[0] === k);
  const [uT, sT] = row('Temperature').slice(1).map(n_), [uH, sH] = row('Relative humidity').slice(1).map(n_);
  const ea = n_(row('Activation energy')[1]), m = Number(row('Humidity exponent (Peck)')[1].replace('−', '-'));
  const AF = (uH / sH) ** m * arr(ea, uT, sT);
  assert.ok(Math.abs(AF - 55.1) < 0.1);
  assertKeyed(q, AF * 1000 / 8760, 0.05);
  assert.ok(q.options.includes(`${(arr(ea, uT, sT) * 1000 / 8760).toFixed(1)} years`), 'Arrhenius-only trap');
});

test('Q52 activation energy from two temperatures, then B10 at 40 °C', () => {
  const q = byId('cre:set-1:b06-q52');
  const [[t1, l1], [t2, l2]] = [...q.chart.rows].map((r) => [n_(r[0]), n_(r[1])]);
  assert.equal(q.chart.rows[0][2], q.chart.rows[1][2], 'same mechanism');
  assert.equal(q.chart.rows[0][3], q.chart.rows[1][3], 'same Weibull shape');
  const ea = K_B * Math.log(l2 / l1) / (1 / (t2 + 273.15) - 1 / (t1 + 273.15));
  assert.ok(Math.abs(ea - 0.639) < 0.001);
  const L40 = l2 * arr(ea, 40, t2);
  assert.ok(Math.abs(L40 - 94000) < 150);
  assert.equal(q.options[q.answer], 'About 94,000 h');
});

test('Q53 conditional field failures after burn-in', () => {
  const q = byId('cre:set-1:b06-q53');
  const plan = tableOf(q);
  const beta = Number(plan['Weibull shape \\(\\beta\\)']), eta = n_(plan['Weibull scale \\(\\eta\\)']);
  const R = (t) => Math.exp(-((t / eta) ** beta));
  assertKeyed(q, (1 - R(2168) / R(168)) * 100, 0.06);
  assert.ok(q.options.includes(`${((1 - R(2000)) * 100).toFixed(1)}%`), 'no-burn-in trap');
});

test('Q54 sequential test: continue now, accept after about 4,900 more hours', () => {
  const q = byId('cre:set-1:b06-q54');
  const lnD = Math.log(4000 / 2000), slope = (1 / 2000 - 1 / 4000) / lnD, a = Math.log(0.9 / 0.1) / lnD;
  assert.ok(Math.abs(slope - 3.607e-4) < 1e-7 && Math.abs(a - 3.17) < 0.005, 'stem lines match the plan');
  const acc = -a + slope * 15000, rej = a + slope * 15000;
  assert.ok(4 > acc && 4 < rej, 'continue region');
  const more = (4 + a) / slope - 15000;
  assert.ok(Math.abs(more - 4880) < 15);
  assert.match(q.options[q.answer], /^Continue testing; accept if no further failure occurs in about 4,900 more hours/);
  const [rej0] = q.chart.series[0].points; assert.ok(Math.abs(rej0[1] - a) < 0.01);
});

test('Q55 IEC 61124 plan B.6 for D = 2 at 10% risks', () => {
  const q = byId('cre:set-1:b06-q55');
  const plan = [...q.chart.rows].find((r) => Number(r[3]) === 2500 / 1250 && r[1] === '10' && r[2] === '10');
  assert.equal(plan[0], 'B.6');
  const T = Number(plan[4]) * 2500;
  assert.ok(Math.abs(T - 23675) < 0.5);
  assert.equal(q.options[q.answer], `23,675 h with up to ${plan[5]} failures; about ${(Math.round(T / 12 / 10) * 10).toLocaleString('en-US')} h per unit.`);
});

test('Q56 exponential lumen decay projected to L70', () => {
  const q = byId('cre:set-1:b06-q56');
  const alpha = -Math.log(0.96) / 6000;
  assertKeyed(q, -Math.log(0.70) / alpha, 60);
});

test('Q57 Jelinski–Moranda intensity and faults still to fix', () => {
  const q = byId('cre:set-1:b06-q57');
  const vals = [...q.chart.rows].map((r) => parseFloat(r[1]));
  const [N, phi, k, target] = vals;
  const lambda = phi * (N - k), more = Math.round((N - target / phi) - k);
  assert.ok(Math.abs(lambda - 0.009) < 1e-9 && more === 10);
  assert.equal(q.options[q.answer], `${lambda.toFixed(3)} per CPU-hour; ${more} more faults.`);
});

test('Q59 series system with a 2-of-3 and a 1-of-2 stage', () => {
  const q = byId('cre:set-1:b06-q59');
  const stageR = (st) => {
    const r = Number(st.blocks[0].r), n = st.blocks.length, kk = st.note ? Number(st.note.match(/^(\d+) of/)[1]) : n;
    let sum = 0; for (let i = kk; i <= n; i++) sum += comb(n, i) * r ** i * (1 - r) ** (n - i); return sum;
  };
  assertKeyed(q, q.chart.stages.reduce((a, st) => a * stageR(st), 1), 0.0006);
});

test('Q58 and Q60 evidence supports the keys', () => {
  const q58 = byId('cre:set-1:b06-q58');
  assert.match(q58.stem, /At every power-up.*checks its own memory/);
  assert.equal(q58.options[q58.answer], 'Built-in testing');
  const q60 = byId('cre:set-1:b06-q60');
  const obs = Object.fromEntries([...q60.chart.rows]);
  assert.match(obs['Operating temperature'], /no thermal cycling/);
  assert.match(obs['Bolts and flanges'], /No cracks.*no visible pitting/);
  assert.match(obs['Bolt length'], /Unchanged/);
  assert.match(q60.options[q60.answer], /^Creep under constant strain/);
});

test('Q61 bridge reliability by conditioning on the crossover', () => {
  const q = byId('cre:set-1:b07-q61');
  const r = Object.fromEntries(Object.entries(q.chart.bridge).map(([k, v]) => [k, Number(v.r)]));
  const par = (a, b) => 1 - (1 - a) * (1 - b);
  const works = par(r.A, r.C) * par(r.B, r.D), fails = par(r.A * r.B, r.C * r.D);
  const R = r.E * works + (1 - r.E) * fails;
  assertKeyed(q, R, 0.0006);
  // the three traps are each at least 0.015 away
  [works, fails, r.E * fails].forEach((v) => assert.ok(Math.abs(v - R) > 0.015));
});

test('Q62 two-unit cold standby with switch reliability 0.95', () => {
  const q = byId('cre:set-1:b07-q62');
  const lt = 1000 / 2000;
  assertKeyed(q, Math.exp(-lt) * (1 + 0.95 * lt), 0.0006);
  assert.ok(q.options.includes((Math.exp(-lt) * (1 + lt)).toFixed(3)), 'perfect-switch trap');
});

test('Q63 competing modes, conditional on 3,000 h survived', () => {
  const q = byId('cre:set-1:b07-q63');
  const H = (t) => (t / 8000) ** 3 + 2e-5 * t;
  assertKeyed(q, Math.exp(-(H(8000) - H(3000))), 0.0006);
});

test('Q64 Eyring factor = (Ts/Tu) × Arrhenius factor', () => {
  const q = byId('cre:set-1:b07-q64');
  const Tu = 328.15, Ts = 398.15, ar = Math.exp((0.90 / 8.617e-5) * (1 / Tu - 1 / Ts));
  assertKeyed(q, (Ts / Tu) * ar, 0.6);
  assert.ok(q.options.includes(String(Math.round(ar))), 'Arrhenius-only trap');
});

test('Q65 Coffin–Manson exponent from two ranges, extrapolated to 40 °C', () => {
  const q = byId('cre:set-1:b07-q65');
  const [[d1, n1], [d2, n2]] = [...q.chart.rows].slice(0, 2).map((r) => [n_(r[0]), n_(r[1])]);
  const b = Math.log(n2 / n1) / Math.log(d1 / d2);
  assert.ok(Math.abs(b - 2.465) < 0.001);
  assertKeyed(q, n1 * (d1 / 40) ** b / 730, 0.05);
});

test('Q66 corrosion depth summed over the warm and cold half-years', () => {
  const q = byId('cre:set-1:b07-q66');
  const rate = (c) => 0.010 * Math.exp((0.40 / 8.617e-5) * (1 / 293.15 - 1 / (c + 273.15)));
  const life = 0.50 / (0.5 * rate(5) + 0.5 * rate(35));
  assertKeyed(q, life, 0.05);
  assert.ok(q.options.includes('50.0 years'), 'mean-temperature trap');
});

test('Q67 parts count: quantities times pi-adjusted base rates', () => {
  const q = byId('cre:set-1:b07-q67');
  const lam = [...q.chart.rows].reduce((a, [, n, lb, pe, pq]) => a + Number(n) * Number(lb) * Number(pe) * Number(pq), 0);
  assert.ok(Math.abs(lam - 1.528) < 1e-9);
  assert.equal(q.options[q.answer], `About ${(Math.round(1e6 / lam / 1000) * 1000).toLocaleString('en-US')} h`);
});

test('Q68 Weibull inverse-transform draw', () => {
  const q = byId('cre:set-1:b07-q68');
  assertKeyed(q, 5000 * (-Math.log(1 - 0.75)) ** 0.5, 6);
});

test('Q69 digital twin is biased by a consistent factor (about 0.87)', () => {
  const q = byId('cre:set-1:b07-q69');
  const ratios = [...q.chart.rows].map((r) => n_(r[2]) / n_(r[1]));
  q.chart.rows.forEach((r, i) => assert.ok(Math.abs(Number(r[3]) - ratios[i]) < 0.0006, 'ratio column matches'));
  assert.ok(Math.max(...ratios) - Math.min(...ratios) < 0.01 && Math.abs(1 - ratios.reduce((a, b) => a + b) / ratios.length - 0.13) < 0.005);
  assert.match(q.options[q.answer], /about 13% below prediction/);
});

const money = (s) => Number(String(s).replace(/[^0-9.]/g, ''));

test('Q71 the only misclassified P-diagram entry is a customer-site condition marked as control', () => {
  const q = byId('cre:set-1:b08-q71');
  const bad = [...q.chart.rows].filter(([item, cls]) => /customer site/.test(item) && cls !== 'Noise factor');
  assert.equal(bad.length, 1);
  assert.ok(q.options[q.answer].startsWith(bad[0][0]));
});

test('Q72 expected annual loss ranks R2 first although its ordinal score does not', () => {
  const q = byId('cre:set-1:b08-q72');
  const rows = [...q.chart.rows].map(([r, p, c, l, sev, prod]) => ({ r, loss: Number(p) * money(c), score: Number(prod), l: Number(l), sev: Number(sev) }));
  rows.forEach((x) => assert.equal(x.l * x.sev, x.score, `${x.r} score product`));
  const byLoss = rows.slice().sort((a, b) => b.loss - a.loss), byScore = rows.slice().sort((a, b) => b.score - a.score);
  assert.equal(byLoss[0].r, 'R2'); assert.equal(byLoss[0].loss, 40000);
  assert.notEqual(byScore[0].r, 'R2', 'the ordinal score misranks it');
  assert.match(q.options[q.answer], /^R2: its expected loss is the largest/);
});

const evalTree = (n) => {
  if (!n.children || !n.children.length) return Number(n.p);
  const ps = n.children.map(evalTree);
  if (n.gate === 'AND') return ps.reduce((a, b) => a * b, 1);
  if (n.gate === 'VOTE') { const p = ps[0], m = ps.length; let s = 0; for (let i = n.k; i <= m; i++) s += comb(m, i) * p ** i * (1 - p) ** (m - i); return s; }
  return 1 - ps.reduce((a, b) => a * (1 - b), 1);
};

test('Q74 fault tree with AND, OR and 2-of-3 voting gates', () => {
  const q = byId('cre:set-1:b08-q74');
  assertKeyed(q, evalTree(q.chart.root), 0.00006);
});

test('Q75 repeated shared-bus event: minimal cut sets, not independent multiplication', () => {
  const q = byId('cre:set-1:b08-q75');
  const [ta, tb] = q.chart.root.children;
  const s = Number(ta.children[1].p), a = Number(ta.children[0].p), b = Number(tb.children[0].p);
  assert.equal(ta.children[1].label, tb.children[1].label, 'the same event appears under both trains');
  const exact = s + (1 - s) * a * b, naive = evalTree(q.chart.root);
  assertKeyed(q, exact, 0.00006);
  assert.ok(q.options.includes(naive.toFixed(4)), 'the independent-multiplication trap is offered');
});

test('Q76 the severity-10 mode is not the RPN leader', () => {
  const q = byId('cre:set-1:b08-q76');
  const rows = [...q.chart.rows].map(([m, , sev, o, d, rpn]) => ({ m, sev: Number(sev), o: Number(o), rpn: Number(rpn), d: Number(d) }));
  rows.forEach((r) => assert.equal(r.sev * r.o * r.d, r.rpn, `${r.m} RPN`));
  const top = rows.reduce((a, b) => (b.sev > a.sev ? b : a));
  assert.equal(top.sev, 10);
  assert.notEqual(rows.reduce((a, b) => (b.rpn > a.rpn ? b : a)).m, top.m);
  assert.ok(q.options[q.answer].startsWith(top.m.split(':')[0]));
});

test('Q78 FMECA category I item criticality', () => {
  const q = byId('cre:set-1:b08-q78');
  const lt = 40e-6 * 500;
  const cat1 = [...q.chart.rows].filter((r) => /^I \(/.test(r[1])).reduce((a, r) => a + Number(r[3]) * Number(r[2]) * lt, 0);
  assertKeyed(q, cat1, 0.0002);
});

test('Q79 beta-factor common cause dominates the redundant pair', () => {
  const q = byId('cre:set-1:b08-q79');
  const Q = 0.02, beta = 0.10;
  assertKeyed(q, ((1 - beta) * Q) ** 2 + beta * Q, 0.00002);
});

test('Q80 only H4 falls in a High cell of the risk matrix', () => {
  const q = byId('cre:set-1:b08-q80');
  const cols = { catastrophic: 1, critical: 2, marginal: 3 }, rows = { frequent: 0, probable: 1, occasional: 2, remote: 3 };
  const cell = (sev, prob) => q.chart.rows[rows[prob]][cols[sev]];
  const levels = { H1: cell('catastrophic', 'remote'), H2: cell('marginal', 'frequent'), H3: cell('critical', 'occasional'), H4: cell('critical', 'probable') };
  assert.equal(Object.entries(levels).filter(([, v]) => v === 'High').map(([k]) => k).join(), 'H4');
  assert.ok(q.options[q.answer].startsWith('H4'));
});

test('Q81 event-tree expected loss sums frequency times consequence over damage sequences', () => {
  const q = byId('cre:set-1:b09-q81');
  const ie = Number(q.chart.title.match(/\(([\d.]+) per year\)/)[1]);
  const cost = (o) => (/^No /.test(o) ? 0 : money(o) * (/M$/.test(o) ? 1e6 : /k$/.test(o) ? 1e3 : 1));
  const loss = (n, f) => (n.outcome ? f * cost(n.outcome) : [...n.children].reduce((a, c) => a + loss(c, f * Number(c.p)), 0));
  const tree = { children: q.chart.children };
  const exact = loss(tree, ie);
  const [, pumpFails] = q.chart.children, [, opFails] = pumpFails.children;
  const noRecovery = ie * Number(pumpFails.p) * loss(opFails, 1);
  assert.equal(Math.round(exact * 10) / 10, 99.5);
  assert.equal(q.options[q.answer], 'About $100');
  assert.ok(q.options.includes(`About $${Math.round(exact / ie)}`), 'missing-initiating-frequency trap is offered');
  assert.ok(q.options.includes(`About $${Math.round(noRecovery)}`), 'missing-recovery-branch trap is offered');
});

test('Q83 risk register entries map to operational, cybersecurity, strategic and financial', () => {
  const q = byId('cre:set-1:b09-q83');
  const [r1, r2, r3, r4] = [...q.chart.rows].map((r) => r[1]);
  assert.match(r1, /supplier delivery/); assert.match(r2, /authenticate/); assert.match(r3, /regulation/); assert.match(r4, /warranty reserve/);
  assert.equal(q.options[q.answer], '1 operational; 2 cybersecurity; 3 strategic; 4 financial');
});

test('Q84 FHA worksheet lacks only the out-of-time-or-sequence condition', () => {
  const q = byId('cre:set-1:b09-q84');
  const have = [...q.chart.rows].map((r) => r[0].split(':')[0]).join('|');
  assert.equal(have, 'Loss of function|Degraded function|Malfunction');
  assert.match(q.options[q.answer], /^Functioning out of time or out of sequence/);
});

test('Q85 beta-factor: diversity beats identical redundancy and better parts', () => {
  const q = byId('cre:set-1:b09-q85');
  const sys = (Q, beta, n) => ((1 - beta) * Q) ** n + beta * Q;
  const r = { A: sys(0.01, 0.10, 3), B: sys(0.01, 0.01, 2), C: sys(0.005, 0.10, 2), D: ((1 - 0.10) * 0.01 / 2) ** 2 + 0.10 * 0.01 };
  assert.equal(Math.round(sys(0.01, 0.10, 2) * 1e5), 108, 'present design 0.00108');
  assert.deepEqual(Object.fromEntries(Object.entries(r).map(([k, v]) => [k, Math.round(v * 1e5)])), { A: 100, B: 20, C: 52, D: 102 });
  const best = Object.entries(r).reduce((a, b) => (b[1] < a[1] ? b : a))[0];
  assert.equal('ABCD'[q.answer], best);
});

test('Q86 success tree of the pumping fault tree: OR at the top becomes AND inside, success 0.990', () => {
  const q = byId('cre:set-1:b09-q86');
  const success = 1 - evalTree(q.chart.root);
  assert.equal(Math.round(success * 1000) / 1000, 0.990);
  assert.equal(q.chart.root.children[1].gate, 'AND', '"both trains fail" is an AND gate');
  assert.equal(q.options[q.answer], 'An OR gate; system success 0.990.');
});

test('Q89 weighted Pugh totals: A +10, B +1, C +4', () => {
  const q = byId('cre:set-1:b09-q89');
  const v = (s) => Number(String(s).replace('−', '-'));
  const tot = [2, 3, 4].map((c) => [...q.chart.rows].reduce((a, r) => a + v(r[1]) * v(r[c]), 0));
  assert.deepEqual(tot, [10, 1, 4]);
  const plus = [2, 3, 4].map((c) => [...q.chart.rows].filter((r) => v(r[c]) > 0).length);
  assert.equal(plus.indexOf(Math.max(...plus)), 1, 'B has the most pluses (the trap)');
  assert.match(q.options[q.answer], /^Concept A: its weighted total is the highest/);
  assert.ok(q.options.every((o) => !/[+−-]\d/.test(o)), 'no option gives away a computed total');
});

test('Q90 halving D gives the largest reduction in top-event probability', () => {
  const q = byId('cre:set-1:b09-q90');
  const clone = () => JSON.parse(JSON.stringify(q.chart.root));
  const leaf = (t, name) => { const st = [t]; while (st.length) { const n = st.pop(); if (n.label === name) return n; (n.children || []).forEach((c) => st.push(c)); } };
  const base = evalTree(clone());
  const change = (name, p) => { const t = clone(); leaf(t, name).p = String(p); return evalTree(t); };
  const out = { A: change('C', 0), B: change('B', 0.05), C: change('D', 0.2), D: change('A', 0.15) };
  assert.equal(Math.round(base * 1e4), 2142);
  assert.deepEqual(Object.fromEntries(Object.entries(out).map(([k, x]) => [k, Math.round(x * 1e4)])), { A: 1728, B: 1765, C: 1606, D: 1891 });
  const best = Object.entries(out).reduce((a, b) => (b[1] < a[1] ? b : a))[0];
  assert.equal('ABCD'[q.answer], best);
});

test('Q91 the four responses map to transfer, terminate, treat and tolerate', () => {
  const q = byId('cre:set-1:b10-q91');
  const d = Object.fromEntries([...q.chart.rows].map(([k, v]) => [k, v]));
  assert.match(d['1'], /carries the warranty liability/); assert.match(d['2'], /needs no shaft seal/);
  assert.match(d['3'], /elastomer compound/); assert.match(d['4'], /take no action/);
  assert.equal(q.options[q.answer], '1 transfer; 2 terminate; 3 treat; 4 tolerate');
});

test('Q93 ALARP disproportion factor of 3 over a 5-year life requires M1 and M3', () => {
  const q = byId('cre:set-1:b10-q93');
  const ratio = [...q.chart.rows].map(([m, c, dl]) => [m.split(':')[0], money(c) / (5 * money(dl))]);
  assert.deepEqual(ratio.map(([, r]) => Math.round(r * 100) / 100), [0.4, 4, 2.5, 3.33]);
  const required = ratio.filter(([, r]) => r <= 3).map(([m]) => m);
  assert.equal(q.options[q.answer], required.join(' and '));
  assert.ok(q.options.includes('M1 only'), 'the break-even trap is offered');
});

test('Q94 overall residual risk exceeds its criterion although each hazard passes', () => {
  const q = byId('cre:set-1:b10-q94');
  const rates = [...q.chart.rows].map((r) => Number(r[1]));
  assert.ok(rates.every((x) => x <= 200), 'each hazard passes the individual criterion');
  const total = rates.reduce((a, b) => a + b, 0);
  assert.equal(total, 600);
  const unitYearsM = 20000 * 10 / 1e6;
  assert.equal(Math.round(total * unitYearsM), 120);
  assert.ok(total > 500);
  assert.match(q.options[q.answer], /^About 120 events; do not release, because the five hazards together exceed the limit of 500/);
  assert.ok(q.options.some((o) => o.startsWith(`About ${Math.round(Math.max(...rates) * unitYearsM)} `)), 'largest-hazard trap');
  assert.ok(q.options.some((o) => o.startsWith(`About ${Math.round(total / rates.length * unitYearsM)} `)), 'average trap');
});

test('Q95 mitigated loss rate counts uncovered outages plus the secondary risk', () => {
  const q = byId('cre:set-1:b10-q95');
  const [works, fails] = q.chart.children;
  const lossPerOutage = Number(fails.p) + Number(works.p) * Number(works.children[1].p);
  const outages = Number(q.chart.title.match(/\((\d+) per year\)/)[1]);
  const f = outages * lossPerOutage + 0.5;
  assertKeyed(q, f, 0.0005);
  assert.ok(q.options.includes((outages * lossPerOutage).toFixed(3)), 'secondary-risk-ignored trap');
});

test('Q97 critical path moves to A-D-E-H at 132 days after the slip and the crash', () => {
  const q = byId('cre:set-1:b10-q97');
  const acts = Object.fromEntries([...q.chart.rows].map(([id, , pre, d]) => [id, { pre: pre === '—' ? [] : pre.split(', '), d: Number(d) }]));
  const longest = (dur) => {
    const ef = {};
    const go = (id) => ef[id] ?? (ef[id] = Math.max(0, ...acts[id].pre.map(go)) + dur[id]);
    Object.keys(acts).forEach(go);
    return Math.max(...Object.values(ef));
  };
  const base = Object.fromEntries(Object.entries(acts).map(([k, v]) => [k, v.d]));
  assert.equal(longest(base), 135, 'planned duration');
  const now = { ...base, D: base.D + 15, E: base.E - 8 };
  assert.equal(longest(now), 132);
  const path = (ids, dur) => ids.split('').reduce((a, k) => a + dur[k], 0);
  assert.equal(path('ADEH', now), 132); assert.equal(path('BCEH', now), 127);
  assert.equal(path('BCEH', base) - path('ADEH', base), 10, 'D had 10 days of total slack');
  assert.equal(q.options[q.answer], '132 days; A–D–E–H becomes the critical path.');
});

test('Q100 OEE is availability times performance times quality', () => {
  const q = byId('cre:set-1:b10-q100');
  const d = Object.fromEntries([...q.chart.rows].map(([k, v]) => [k, n_(v)]));
  const planned = d['Shift length'] - d['Scheduled breaks'];
  const operating = planned - d['Changeover'] - d['Breakdown'];
  const total = d['Total pieces produced'], good = d['Good pieces'], rate = d['Ideal production rate'];
  const A = operating / planned, P = total / operating / rate, Q = good / total;
  const pct = (x) => `${(x * 100).toFixed(1)}%`;
  assert.equal(q.options[q.answer], pct(A * P * Q));
  assert.ok(q.options.includes(pct(A * P)), 'quality-omitted trap');
  assert.ok(q.options.includes(pct(A * (total / planned / rate) * Q)), 'planned-time trap');
  const shift = d['Shift length'], op2 = shift - d['Changeover'] - d['Breakdown'];
  assert.ok(q.options.includes(pct((op2 / shift) * (total / op2 / rate) * Q)), 'breaks-not-removed trap');
});

test('Q104 Weibull replacement interval: longest whole year with reliability of at least 0.95', () => {
  const q = byId('cre:set-1:b11-q104');
  const R = (t) => Math.exp(-((t / 6) ** 3));
  const tStar = 6 * (-Math.log(0.95)) ** (1 / 3);
  assert.equal(Math.round(tStar * 100) / 100, 2.23);
  const years = Math.floor(tStar);
  assert.ok(R(years) >= 0.95 && R(years + 1) < 0.95);
  assert.equal(q.options[q.answer], `Every ${years} years`);
});

test('Q105 FRACAS backlog: 13 open reports need about 6 more weeks at the closure rate', () => {
  const q = byId('cre:set-1:b11-q105');
  const [opened, closed] = [...q.chart.series].map((s) => [...s.points].map((p) => p[1]));
  const open12 = opened[11] - closed[11];
  const rate = (closed[11] - closed[5]) / 6;
  assert.equal(open12, 13);
  assert.equal(rate, 2);
  assert.ok(open12 / rate > 14 - 12, 'backlog cannot clear before the gate');
  assert.equal(opened[11] - opened[7], 3, 'arrivals are leveling off');
  assert.ok((open12 - (opened[5] - closed[5])) / 6 > -1, 'backlog shrinks by less than 1 a week');
  assert.match(q.options[q.answer], /^New reports are leveling off, but 13 remain open and the backlog shrinks by less than 1 a week/);
});

test('Q106 achieved availability uses MTBM and active corrective plus preventive time', () => {
  const q = byId('cre:set-1:b11-q106');
  const d = Object.fromEntries([...q.chart.rows].map(([k, v]) => [k, n_(v)]));
  const T = d['Operating time'], f = d['Corrective repairs (failures)'], cm = d['Active corrective repair time, total'];
  const pm = d['Preventive maintenance actions'], pmt = d['Active preventive maintenance time, total'], delay = d['Logistics and administrative delay, total'];
  const mtbm = T / (f + pm), mbar = (cm + pmt) / (f + pm);
  const Aa = mtbm / (mtbm + mbar), Ai = (T / f) / (T / f + cm / f), Ao = mtbm / (mtbm + (cm + pmt + delay) / (f + pm));
  const wrong = (T / f) / (T / f + mbar);
  assertKeyed(q, Aa, 0.00005);
  [Ai, Ao, wrong].forEach((v) => assert.ok(q.options.includes(v.toFixed(4)), `trap ${v.toFixed(4)} offered`));
});

test('Q107 MTBCF counts critical failures over total unit-hours', () => {
  const q = byId('cre:set-1:b11-q107');
  assertKeyed(q, 12 * 2000 / 3, 0.5);
  assert.ok(q.options.includes(`${Math.round(12 * 2000 / 9).toLocaleString('en-US')} h`), 'MTBF trap');
});

test('Q109 CAPA test by defect type: cracks fall and voids rise, both significantly', () => {
  const q = byId('cre:set-1:b11-q109');
  const rows = Object.fromEntries([...q.chart.rows].map(([k, a, b]) => [k, [Number(a), Number(b)]]));
  const z = ([a, b], n = 2000) => { const p = (a + b) / (2 * n); return (a / n - b / n) / Math.sqrt(p * (1 - p) * (2 / n)); };
  const zc = z(rows.Cracks), zv = z(rows.Voids), zt = z(rows.Total);
  assert.equal(rows.Cracks[0] + rows.Voids[0], rows.Total[0]);
  assert.equal(Math.round(zc * 100) / 100, 3.59);
  assert.equal(Math.round(-zv * 100) / 100, 2.93);
  assert.equal(Math.round(zt * 100) / 100, 0.46);
  assert.ok(zc > 1.96 && -zv > 1.96 && Math.abs(zt) < 1.96);
  assert.match(q.options[q.answer], /^Cracks fell significantly/);
});

test('Q110 the 5 Why chain stops at a person', () => {
  const q = byId('cre:set-1:b11-q110');
  const last = q.chart.rows[q.chart.rows.length - 2][1];
  assert.match(last, /technician/i);
  assert.match(q.chart.rows[q.chart.rows.length - 1][1], /retrain/);
  assert.match(q.options[q.answer], /^People blaming/);
});

test('Q111 lifecycle cost favors the pump that is dearest to buy', () => {
  const q = byId('cre:set-1:b12-q111');
  const life = 6000 * 10;
  const pumps = [...q.chart.rows].map(([id, price, mtbf, mttr]) => ({ id, price: n_(price), mtbf: n_(mtbf), mttr: n_(mttr) }));
  const lcc = (p, down = true) => p.price + (life / p.mtbf) * (800 + (down ? 200 * p.mttr : 0));
  const costs = Object.fromEntries(pumps.map((p) => [p.id, lcc(p)]));
  assert.deepEqual(costs, { A: 25000, B: 12500, C: 11400 });
  const best = pumps.reduce((a, b) => (lcc(b) < lcc(a) ? b : a));
  assert.equal(best.id, 'C');
  assert.match(q.options[q.answer], /^Pump C, with the lowest lifecycle cost at about \$11,400/);
  const noDown = pumps.reduce((a, b) => (lcc(b, false) < lcc(a, false) ? b : a));
  assert.equal(noDown.id, 'B', 'leaving out downtime picks B (the trap)');
  assert.ok(q.options.some((o) => o.includes(`$${lcc(noDown, false).toLocaleString('en-US')}`)));
});

test('Q113 achieved availability: frequent short PM beats run-to-failure', () => {
  const q = byId('cre:set-1:b12-q113');
  const [lam, pm, mamt] = [...q.chart.rows].map((r) => [Number(r[1]), Number(r[2])]);
  const A = [0, 1].map((i) => { const M = 1000 / (lam[i] + pm[i]); return M / (M + mamt[i]); });
  assert.equal(A[0].toFixed(4), '0.9877');
  assert.equal(A[1].toFixed(4), '0.9794');
  assert.ok(A[0] > A[1]);
  assert.equal(q.options[q.answer], `Strategy 1, ${A[0].toFixed(4)}`);
});

test('Q118 B10 life with a constant failure rate', () => {
  const q = byId('cre:set-1:b12-q118');
  assertKeyed(q, -50000 * Math.log(0.9), 1);
});

test('Q120 Poisson probability of 4 or fewer failures at the old rate', () => {
  const q = byId('cre:set-1:b12-q120');
  const mu = 24000 * 18 / 36000;
  assert.equal(mu, 12);
  assertKeyed(q, poissonCdf(4, mu), 0.00005);
  assert.ok(q.options.includes(poissonCdf(3, mu).toFixed(4)), 'P(X ≤ 3) trap');
  assert.ok(q.options.includes(poissonPmf(4, mu).toFixed(4)), 'P(X = 4) trap');
  assert.ok(q.options.includes((1 - poissonCdf(3, mu)).toFixed(4)), 'wrong-tail trap');
});

test('Q116 and Q119 exhibits match their keys', () => {
  const q116 = byId('cre:set-1:b12-q116');
  assert.match(q116.chart.rows[0][1], /Weibull model to field returns/);
  assert.match(q116.chart.rows[1][1], /measurement system and establish the baseline/);
  assert.equal(q116.options[q116.answer], '1 Analyze; 2 Measure; 3 Improve; 4 Control');
  const q119 = byId('cre:set-1:b12-q119');
  assert.ok(!q119.chart.rows.some((r) => /escape|inspection/i.test(r[1])), 'no escape point is recorded');
  assert.match(q119.options[q119.answer], /^D4 escape point/);
});

test('Q121 sterilizer days: two loads of 100 cycles at 4.5 h, whole cycles in an 18 h day', () => {
  const q = byId('cre:set-1:b13-q121');
  const d = Object.fromEntries([...q.chart.rows].map(([k, v]) => [k, n_(v)]));
  const loads = Math.ceil(d['Units on test'] / d['Sterilizer capacity']);
  const cycles = loads * d['Cycles required per unit'], ct = d['Cycle time, including functional check'], day = d['Sterilizer availability'];
  const byHours = Math.ceil(cycles * ct / day), byWholeCycles = Math.ceil(cycles / Math.floor(day / ct));
  assert.equal(byHours, byWholeCycles, 'continuous and whole-cycle schedules agree');
  assert.equal(q.options[q.answer], `${byHours} days`);
  assert.ok(q.options.includes(`${Math.ceil(cycles / 2 * ct / day)} days`), 'one load');
  assert.ok(q.options.includes(`${Math.ceil(cycles * ct / 24)} days`), 'round-the-clock');
  assert.ok(q.options.includes(`${Math.ceil(cycles * 4 / day)} days`), 'no functional check');
});

test('Q122 exponential maintainability: 95% of repairs within 6.0 h', () => {
  const q = byId('cre:set-1:b13-q122');
  assertKeyed(q, -2 * Math.log(0.05), 0.05);
});

test('Q125 zero-failure sample size at 90% confidence and 95% reliability', () => {
  const q = byId('cre:set-1:b13-q125');
  const n = (c, r) => Math.ceil(Math.log(1 - c) / Math.log(r));
  assertKeyed(q, n(0.9, 0.95), 0);
  assert.ok(q.options.includes(String(n(0.95, 0.9))), 'swapped trap');
  assert.ok(q.options.includes(String(n(0.95, 0.99))), 'high-risk plan');
});

test('Q126 cutting the dominant stress variation gives the largest z', () => {
  const q = byId('cre:set-1:b13-q126');
  const [[, mx, sx], [, my, sy]] = [...q.chart.rows].map((r) => r.map(Number));
  const z = (Mx, Sx, My, Sy) => (My - Mx) / Math.sqrt(Sx ** 2 + Sy ** 2);
  const opts = [z(mx, sx, 440, sy), z(mx, sx, my, 15), z(mx, 30, my, sy), z(290, sx, my, sy)];
  assert.equal(z(mx, sx, my, sy), 2.4);
  assert.deepEqual(opts.map((v) => Math.round(v * 100) / 100), [2.8, 2.81, 2.83, 2.6]);
  assert.equal(opts.indexOf(Math.max(...opts)), q.answer);
});

test('Q127 equal safety factors, very different interference', () => {
  const q = byId('cre:set-1:b13-q127');
  const rows = [...q.chart.rows].map((r) => r.slice(1).map(Number));
  rows.forEach(([mx, , my]) => assert.equal(my / mx, 1.5));
  const pf = ([mx, sx, my, sy]) => normCdf(-(my - mx) / Math.sqrt(sx ** 2 + sy ** 2));
  assert.equal(Math.round(pf(rows[1]) * 1000) / 1000, 0.039);
  assert.ok(pf(rows[0]) < 0.00003);
  assert.match(q.options[q.answer], /^About 0\.039/);
  assert.ok(q.options.some((o) => o.startsWith(`About ${normCdf(-150 / 60).toFixed(4)}`)), 'strength-only trap');
});

test('Q128 interaction effect of the replicated 2x2 experiment', () => {
  const q = byId('cre:set-1:b13-q128');
  const avg = [...q.chart.rows].map((r) => (Number(r[3]) + Number(r[4])) / 2);
  const [ll, hl, lh, hh] = avg;
  const ab = (ll + hh) / 2 - (hl + lh) / 2;
  assertKeyed(q, ab, 0.05);
  assert.ok(q.options.includes((ab / 2).toFixed(1)), 'coefficient trap');
  assert.ok(q.options.includes(((lh + hh) / 2 - (ll + hl) / 2).toFixed(1)), 'main effect B trap');
});

test('Q129 cheapest option that meets 0.86', () => {
  const q = byId('cre:set-1:b13-q129');
  const [r1, r2, r3] = [...q.chart.stages].map((s) => Number(s.blocks[0].r));
  const par = (r) => 1 - (1 - r) ** 2;
  const options = [{ r: r1 * par(r2) * r3, c: 3000 }, { r: r1 * r2 * 0.98, c: 2000 }, { r: r1 * r2 * par(r3), c: 2500 }, { r: 0.99 * r2 * 0.98, c: 3500 }];
  const ok = options.map((o, i) => ({ ...o, i })).filter((o) => o.r >= 0.86);
  assert.deepEqual(ok.map((o) => o.i), [0, 3]);
  assert.ok(options[2].r < 0.85, 'C falls short');
  assert.equal(ok.reduce((a, b) => (b.c < a.c ? b : a)).i, q.answer);
});

test('Q131 the half fraction with D = ABC aliases AB with CD (resolution IV)', () => {
  const q = byId('cre:set-1:b14-q131');
  const v = (s) => (s === '+1' ? 1 : -1);
  const rows = [...q.chart.rows].map((r) => r.slice(1).map(v));
  rows.forEach(([a, b, c, d]) => { assert.equal(d, a * b * c, 'D = ABC'); assert.equal(a * b, c * d, 'AB = CD'); });
  assert.equal(new Set(rows.map((r) => r.join())).size, 8);
  assert.equal(q.options[q.answer], 'CD; resolution IV');
});

test('Q133 detection over all faults, isolation over detected faults', () => {
  const q = byId('cre:set-1:b14-q133');
  const [n, nd, ni] = [...q.chart.rows].map((r) => Number(r[1]));
  assert.equal(q.options[q.answer], `Detection ${(nd / n).toFixed(3)}; isolation ${(ni / nd).toFixed(3)}`);
  assert.ok(q.options.some((o) => o.includes((ni / n).toFixed(3))), 'isolation-over-all trap');
});

test('Q134 FEA peak stress against the required factor of safety', () => {
  const q = byId('cre:set-1:b14-q134');
  assert.ok(240 / 210 < 1.5);
  assert.equal(240 / 1.5, 160);
  assert.match(q.options[q.answer], /160 MPa or less/);
});

test('Q135 Level B derating picks the 80 V rating', () => {
  const q = byId('cre:set-1:b14-q135');
  const need = 35 / 0.5;
  const ok = [50, 63, 80, 100].filter((v) => v >= need);
  assert.equal(q.options[q.answer], `${ok[0]} V`);
  assert.equal(`${[50, 63, 80, 100].find((v) => v >= 35 / 0.7)} V`, q.options[0], 'Level A trap');
});

test('Q138 spares: 20 scheduled plus the 95% Poisson quantile', () => {
  const q = byId('cre:set-1:b14-q138');
  const d = Object.fromEntries([...q.chart.rows].map(([k, v]) => [k, n_(v)]));
  const hours = d['Pumps in service'] * d['Operating hours per pump per year'] * d['Planning period'];
  const sched = hours / d['Scheduled replacement interval'];
  const mu = d['Failure rate'] * hours / 1e6;
  let r = 0; while (poissonCdf(r, mu) < 0.95) r++;
  assert.equal(sched, 20); assert.equal(mu, 6); assert.equal(r, 10);
  assert.equal(q.options[q.answer], String(sched + r));
  assert.ok(q.options.includes(String(sched + r - 1)) && q.options.includes(String(sched + mu)) && q.options.includes(String(r)));
});

test('Q139 four-year cost favors replacement', () => {
  const q = byId('cre:set-1:b14-q139');
  const [up, rate, energy] = [...q.chart.rows].map((r) => [n_(r[1]), n_(r[2])]);
  const [repair, replace] = [0, 1].map((i) => up[i] + 4 * rate[i] * 1800 + 4 * energy[i]);
  assert.equal(repair, 18000); assert.equal(replace, 17320);
  assert.match(q.options[q.answer], /^Replace, at about 17,300 dollars against about 18,000/);
});

test('Q140 optimum proof-test interval balances the two downtime terms', () => {
  const q = byId('cre:set-1:b14-q140');
  const lam = 1e-5, U = (t) => lam * t / 2 + 4 / t;
  const tStar = Math.sqrt(8 / lam);
  let best = 1; for (let t = 1; t < 5000; t++) if (U(t) < U(best)) best = t;
  assert.ok(Math.abs(best - tStar) <= 1);
  assert.equal(Math.round(U(tStar) * 10000) / 10000, 0.0089);
  assert.match(q.options[q.answer], /^About 890 h, giving about 0\.0089$/);
  [Math.sqrt(2 / lam), Math.sqrt(4 / lam), 2 * tStar].forEach((t) => assert.ok(U(t) > U(tStar)));
  assert.equal(Math.round(U(2 * tStar) * 10000) / 10000, Math.round(U(tStar / 2) * 10000) / 10000, 'mirror distractors share 0.0112');
});

test('Q141 MTTR allocation weights by failure rate', () => {
  const q = byId('cre:set-1:b15-q141');
  const rows = [...q.chart.rows].map((r) => r.slice(1).map(Number));
  const lam = rows.reduce((a, [l]) => a + l, 0);
  const t = rows.reduce((a, [l, m]) => a + l * m, 0) / lam;
  assert.equal(t, 81);
  assertKeyed(q, rows[1][1] / t * 60, 0.5);
  assert.ok(q.options.includes(`${rows[1][1] / (rows.reduce((a, [, m]) => a + m, 0) / 3) * 60} min`), 'unweighted-average trap');
});

test('Q142 the skilled crew saves 1,050 dollars once downtime is counted', () => {
  const q = byId('cre:set-1:b15-q142');
  const [rate, iso, rep] = [...q.chart.rows].map((r) => [Number(r[1]), Number(r[2])]);
  const total = (i) => (iso[i] + rep[i]) * (rate[i] + 300);
  assert.equal(total(1) - total(0), 1050);
  assert.equal(q.options[q.answer], `${(total(1) - total(0)).toLocaleString('en-US')} dollars`);
  assert.ok(q.options.includes(`${(iso[1] + rep[1]) * rate[1] - (iso[0] + rep[0]) * rate[0]} dollars`), 'labor-only trap');
});

test('Q145 age replacement only for the wear-out part', () => {
  const q = byId('cre:set-1:b15-q145');
  const beta = [...q.chart.rows].map((r) => Number(r[1].match(/\\beta = ([\d.]+)/)[1]));
  assert.deepEqual(beta, [1, 3.2]);
  assert.match(q.options[q.answer], /^Replace the bearing at a fixed age/);
});

test('Q146 one-way ANOVA F statistic', () => {
  const q = byId('cre:set-1:b15-q146');
  const rows = [...q.chart.rows].map((r) => r.slice(1).map(Number));
  const N = rows.reduce((a, [n]) => a + n, 0), k = rows.length;
  const grand = rows.reduce((a, [n, m]) => a + n * m, 0) / N;
  const ssTr = rows.reduce((a, [n, m]) => a + n * (m - grand) ** 2, 0);
  const ssE = rows.reduce((a, [n, , v]) => a + (n - 1) * v, 0);
  const F = (ssTr / (k - 1)) / (ssE / (N - k));
  assert.equal(F, 10);
  assert.ok(F > 3.89);
  assert.match(q.options[q.answer], /F = 10\.0\\\); significant/);
});

test('Q147 lognormal interference probability of failure', () => {
  const q = byId('cre:set-1:b15-q147');
  const [[, ms, ss], [, my, sy]] = [...q.chart.rows].map((r) => r.map(Number));
  const z = Math.log(my / ms) / Math.sqrt(ss ** 2 + sy ** 2);
  assertKeyed(q, normCdf(-z), 0.0006);
  assert.ok(q.options.includes(normCdf(-Math.log(my / ms) / ss).toFixed(3)), 'stress-only trap');
  assert.ok(q.options.includes(normCdf(-Math.log(my / ms) / (ss + sy)).toFixed(3)), 'added-SD trap');
});

test('Q150 cascading the system target by failure-rate weight', () => {
  const q = byId('cre:set-1:b15-q150');
  const w = 500 / (200 + 300 + 500);
  assertKeyed(q, 0.9 ** w, 0.00005);
  assert.ok(q.options.includes((0.9 ** (1 / 3)).toFixed(4)), 'equal-apportionment trap');
  assert.ok(q.options.includes(Math.exp(-500e-6 * 100).toFixed(4)), 'prediction trap');
});

/* ---------- 3. production delivery ---------- */

async function productionHtml() {
  const edge = (await import('data:text/javascript;base64,' + Buffer.from(EDGE_SOURCE).toString('base64'))).default;
  const response = await edge(new Request('https://upskillsprint.com/test-bank?exam=cre'), {
    next: async () => new Response(PAGE_SOURCE, { headers: { 'content-type': 'text/html; charset=utf-8' } })
  });
  return response.text();
}

test('the production edge function keeps both CRE scripts', async () => {
  const html = await productionHtml();
  assert.match(html, /<script src="\/test-bank-cre-set1\.js"><\/script>/);
  assert.match(html, /<script src="\/test-bank-cre-ui\.js"><\/script>/);
});

/* ---------- 4. student journey ---------- */

async function openCre() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (error) => errors.push(error.message));
  const html = (await productionHtml())
    .replace('<script src="/test-bank-memory-learning.js"></script>', () => `<script>${MEMORY_SOURCE}</script>`)
    .replace('<script src="/test-bank-cre-set1.js"></script>', () => `<script>${CRE_SET1_SOURCE}</script>`)
    .replace('<script src="/test-bank-cre-ui.js"></script>', () => `<script>${CRE_UI_SOURCE}</script>`)
    .replace('<script src="/test-bank-cre-set2.js"></script>', () => `<script>${CRE_SET2_SOURCE}</script>`)
    .replace('<script src="/test-bank-cre-set2-ui.js"></script>', () => `<script>${CRE_SET2_UI_SOURCE}</script>`)
    .replace('<script src="/test-bank-cre-set3.js"></script>', () => `<script>${CRE_SET3_SOURCE}</script>`);
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank?exam=cre',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) { window.HTMLElement.prototype.scrollIntoView = function () {}; }
  });
  await new Promise((resolve) => dom.window.addEventListener('load', resolve, { once: true }));
  return { dom, window: dom.window, errors };
}
const click = (window, element) => {
  assert.ok(element, 'expected the control to exist');
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
};

test('CRE is live with the 2025 BoK, and Focused Quiz defaults to a populated area', async () => {
  const { dom, window, errors } = await openCre();
  try {
    const exam = window.__TB.EXAMS.cre;
    assert.equal(exam.bank.length, BANK.length);
    assert.equal(exam.minutes, 258);
    assert.equal(JSON.stringify(exam.bok.map((d) => d.weight)), '[29,25,35,35,26]');
    const subs = new Set(exam.bok.flatMap((d) => d.subs.map((s) => s.id)));
    BANK.forEach((q) => assert.ok(subs.has(q.sub)));
    // Sets 1-3 share one five-domain BoK: every question in every set maps to a domain.
    assert.equal(exam.bok.length, 5, 'registerCRESet2 must not add duplicate domains');
    assert.equal(exam.sets[1].length, BANK.length);
    assert.ok(exam.sets[2].length > 0 && exam.sets[3].length > 0, 'Sets 2 and 3 remain available');
    for (const id of ['1', '2', '3']) {
      for (const q of exam.sets[id]) {
        assert.ok(exam.bok.some((d) => d.subs.some((s) => s.id === q.sub)), `${q.qid} (${q.sub}) maps to a BoK domain`);
      }
    }
    click(window, window.document.querySelector('.tb-tile[data-exam="cre"]'));
    const overview = window.document.getElementById('tb-overview');
    assert.equal(BANK.length, 150);
    assert.match(overview.textContent, /The 150-question Set 1 is complete \(Q001–Q150\) and follows the five-domain ASQ blueprint/);
    assert.doesNotMatch(overview.textContent, /Set 1 currently contains|of 15\)|planned questions/);
    const area = overview.querySelector('[data-focusdom]');
    assert.ok(area, 'Focused Quiz area picker renders');
    assert.equal(area.value, FIRST_POPULATED, 'defaults to the first area that has questions');
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
});

test('Set 1 now covers every BoK area, so each Focused Quiz area can start', async () => {
  const { dom, window, errors } = await openCre();
  try {
    click(window, window.document.querySelector('.tb-tile[data-exam="cre"]'));
    const overview = window.document.getElementById('tb-overview');
    assert.equal(overview.querySelector('[data-focusdom]').value, FIRST_POPULATED);
    for (const id of ['cre-fundamentals', 'cre-risk', 'cre-statistics', 'cre-testing', 'cre-lifecycle']) {
      assert.ok(BANK.some((q) => q.sub === id), `Set 1 has ${id} questions`);
      const area = overview.querySelector('[data-focusdom]');
      area.value = id;
      area.dispatchEvent(new window.Event('change', { bubbles: true }));
      assert.equal(overview.querySelector('[data-focusdom]').value, id);
      assert.equal(overview.querySelector('[data-mode="focus"]').disabled, false, `${id} can start`);
      assert.doesNotMatch(overview.textContent, /No questions are available in/);
    }
    const area = overview.querySelector('[data-focusdom]');
    area.value = 'cre-lifecycle';
    area.dispatchEvent(new window.Event('change', { bubbles: true }));
    click(window, overview.querySelector('[data-mode="focus"]'));
    const records = window.__TB.getFeedbackSnapshot().records;
    assert.ok(records.length > 0 && records.every((r) => r.question.sub === 'cre-lifecycle' && r.question.qid.startsWith('cre:set-1:')));
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
});

test('a full CRE sitting renders every visual and scores a perfect paper as 100%', async () => {
  const { dom, window, errors } = await openCre();
  try {
    click(window, window.document.querySelector('.tb-tile[data-exam="cre"]'));
    const overview = window.document.getElementById('tb-overview');
    click(window, overview.querySelector('[data-mode="full"]'));
    assert.ok(overview.querySelector('.tb-quiz'), 'full exam opens');
    const records = window.__TB.getFeedbackSnapshot().records;
    assert.equal(records.length, BANK.length);
    for (let i = 0; i < records.length; i++) {
      const q = records[i].question;
      const quiz = overview.querySelector('.tb-quiz');
      if (q.chart && q.chart.type === 'cre-prob-tree') {
        const svg = quiz.querySelector('svg.cre-chart');
        assert.ok(svg, `${q.qid} draws the probability tree`);
        const ps = [], outs = [];
        const walk = (n) => { if (n.p) ps.push(n.p); if (n.outcome) outs.push(n.outcome); (n.children || []).forEach(walk); };
        [...q.chart.children].forEach(walk);
        [...ps, ...outs].forEach((t) => assert.ok(svg.textContent.includes(t), `${q.qid} tree shows ${t}`));
        assert.equal(svg.querySelectorAll('.cre-out').length, outs.length, 'one mark per terminal outcome');
      } else if (q.chart && q.chart.type === 'cre-weibull-plot') {
        const svg = quiz.querySelector('svg.cre-chart');
        assert.ok(svg, `${q.qid} draws Weibull paper`);
        assert.equal(svg.querySelectorAll('circle.tb-chart-dot').length, 10, 'ten plotted failures');
        assert.ok(svg.querySelector('path.tb-chart-line'), 'fitted line drawn');
        assert.ok(svg.querySelector('.cre-ref'), '63.2% reference line drawn');
      } else if (q.chart && q.chart.type === 'cre-lognormal-plot') {
        const svg = quiz.querySelector('svg.cre-chart');
        assert.ok(svg, `${q.qid} draws lognormal paper`);
        assert.equal(svg.querySelectorAll('circle.tb-chart-dot').length, q.chart.points.length);
        assert.ok(svg.querySelector('path.tb-chart-line') && svg.querySelector('.cre-ref'), 'fitted line and 50% reference drawn');
      } else if (q.chart && q.chart.type === 'cre-box-plot') {
        const svg = quiz.querySelector('svg.cre-chart');
        assert.ok(svg, `${q.qid} draws the box plots`);
        assert.equal(svg.querySelectorAll('rect.tb-chart-box').length, q.chart.groups.length);
        assert.equal(svg.querySelectorAll('circle.tb-chart-outlier').length, q.chart.groups.reduce((a, g) => a + (g.outliers || []).length, 0));
      } else if (q.chart && q.chart.type === 'cre-fault-tree') {
        const svg = quiz.querySelector('svg.cre-chart');
        assert.ok(svg, `${q.qid} draws the fault tree`);
        const leaves = (n) => (n.children && n.children.length ? n.children.reduce((a, k) => a + leaves(k), 0) : 1);
        assert.equal(svg.querySelectorAll('.cre-ft-basic').length, leaves(q.chart.root));
        assert.ok(svg.querySelectorAll('.cre-ft-gate').length >= 1);
      } else if (q.chart && q.chart.type === 'cre-rbd') {
        const svg = quiz.querySelector('svg.cre-chart');
        assert.ok(svg, `${q.qid} draws the block diagram`);
        const blocks = q.chart.layout === 'bridge' ? 5 : q.chart.stages.reduce((a, st) => a + st.blocks.length, 0);
        assert.equal(svg.querySelectorAll('.cre-rbd-block').length, blocks);
        (q.chart.stages || []).filter((st) => st.note).forEach((st) => assert.ok(svg.textContent.includes(st.note), `${q.qid} shows ${st.note}`));
      } else if (q.chart && q.chart.type === 'cre-xy-plot') {
        const svg = quiz.querySelector('svg.cre-chart');
        assert.ok(svg, `${q.qid} draws the x-y plot`);
        // scatter series (line: false) draw points only
        assert.equal(svg.querySelectorAll('path.tb-chart-line').length, q.chart.series.filter((s) => s.line !== false).length);
        q.chart.yTicks.forEach((v) => assert.ok(svg.textContent.includes(String(v)), `${q.qid} y tick ${v}`));
      } else if (q.chart && q.chart.type === 'data-table') {
        const table = quiz.querySelector('table.tb-q-data-table');
        assert.ok(table, `${q.qid} renders its data table`);
        assert.equal(table.querySelectorAll('tbody tr').length, q.chart.rows.length);
      }
      assert.ok(quiz.textContent.includes(q.stem.slice(0, 40)), `${q.qid} shows its stem`);
      click(window, quiz.querySelector(`[data-opt="${q.answer}"]`));
      const next = overview.querySelector('[data-next]');
      if (next) click(window, next);
    }
    click(window, overview.querySelector('[data-submit]'));
    const result = overview.querySelector('[data-score-result]');
    assert.ok(result, 'result screen renders');
    assert.match(result.textContent, new RegExp(`\\(${BANK.length}/${BANK.length}\\)`));
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
});

test('typeset display math in Set 1 becomes a full-size, keyboard-scrollable region', async () => {
  const { dom, window, errors } = await openCre();
  try {
    click(window, window.document.querySelector('.tb-tile[data-exam="cre"]'));
    click(window, window.document.querySelector('#tb-overview [data-mode="full"]'));
    const quiz = window.document.querySelector('.tb-quiz');
    assert.match(quiz.dataset.questionId, /^cre:set-1:/);
    // Simulate MathJax inserting a display equation after the engine renders.
    const math = window.document.createElement('mjx-container');
    math.setAttribute('display', 'true');
    math.appendChild(window.document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    quiz.appendChild(math);
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    assert.equal(math.getAttribute('role'), 'region');
    assert.equal(math.tabIndex, 0);
    assert.match(math.getAttribute('aria-label'), /scroll sideways/);
    // The no-shrink rule must outrank #tb-feedback-loop svg { max-width: 100% } (an ID selector).
    const css = window.document.getElementById('cre-visuals-style').textContent;
    assert.match(css, /:is\(#tb-overview,#tb-feedback-loop,body\) [^{]*mjx-container\[display="true"\] > svg\{max-width:none\}/);
    // Wide exhibit tables: keyboard-reachable scroll region plus a phone swipe hint.
    const tableIndex = window.__TB.getFeedbackSnapshot().records.findIndex((r) => r.question.qid === 'cre:set-1:b03-q30');
    click(window, window.document.querySelector(`[data-goto="${tableIndex}"]`));
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    const wrap = window.document.querySelector('.tb-quiz .tb-q-chart-wrap');
    assert.equal(wrap.getAttribute('role'), 'region');
    assert.equal(wrap.tabIndex, 0);
    assert.match(wrap.getAttribute('aria-label'), /scroll sideways to see every column/);
    assert.match(css, /max-width:600px[^}]*th:nth-child\(4\)\)::before\{content:"Swipe sideways to see every column\."/);
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
});

test('a broken CRE visual falls back to its full text description', () => {
  const sandbox = { window: {} };
  vm.runInNewContext(CRE_UI_SOURCE, sandbox);
  const html = sandbox.window.__CREVisuals.render({ type: 'cre-weibull-plot', title: 'Plot', altText: 'Ten points near a line with slope 0.5.', xTicks: [], points: [] });
  assert.match(html, /Ten points near a line with slope 0\.5\./);
  assert.equal(sandbox.window.__CREVisuals.render({ type: 'cre-unknown' }), '');
});
