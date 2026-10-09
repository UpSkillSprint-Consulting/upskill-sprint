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

const BATCHES = [1, 2, 3];
const BATCH_CODES = { 1: /^III\.A\.[1-3]$/, 2: /^III\.A\.[4-7]$/, 3: /^III\.B\.[1-6]$/ };

test('CRE Set 1 has ten well-formed, uniquely identified questions per released batch', () => {
  assert.equal(BANK.length, BATCHES.length * 10);
  const ids = new Set();
  for (const q of BANK) {
    const m = q.qid.match(/^cre:set-1:b(\d{2})-q(\d{2})$/);
    assert.ok(m, `${q.qid} id format`);
    assert.equal(Number(m[1]), q.batch, `${q.qid} id carries its batch`);
    assert.equal(Number(m[2]), BANK.indexOf(q) + 1, `${q.qid} numbering is sequential and never renumbered`);
    assert.ok(!ids.has(q.qid), `duplicate ${q.qid}`);
    ids.add(q.qid);
    assert.equal(q.set, 1);
    assert.ok(BATCHES.includes(q.batch));
    assert.equal(q.sub, 'cre-statistics', `${q.qid} belongs to domain III`);
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
    assert.match(overview.textContent, new RegExp(`Set 1 currently contains ${BANK.length} of the planned 150`));
    assert.match(overview.textContent, new RegExp(`Batch ${BATCHES.length} of 15`));
    const area = overview.querySelector('[data-focusdom]');
    assert.ok(area, 'Focused Quiz area picker renders');
    assert.equal(area.value, 'cre-statistics', 'defaults to the area that has questions');
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
});

test('an area a released set does not cover is announced, never silently switched', async () => {
  const { dom, window, errors } = await openCre();
  try {
    click(window, window.document.querySelector('.tb-tile[data-exam="cre"]'));
    const overview = window.document.getElementById('tb-overview');
    // Set 1 opens on the area it covers (Domain III).
    assert.equal(overview.querySelector('[data-focusdom]').value, 'cre-statistics');
    // Set 1 has no Domain I items yet: keep the learner's choice and explain.
    const area = overview.querySelector('[data-focusdom]');
    area.value = 'cre-fundamentals';
    area.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(overview.querySelector('[data-focusdom]').value, 'cre-fundamentals');
    assert.equal(overview.querySelector('[data-mode="focus"]').disabled, true);
    assert.match(overview.textContent, /No questions are available in .*Reliability Fundamentals.*Choose another area or test set/);
    // Another set that covers the area makes it available, without changing the area.
    click(window, overview.querySelector('[data-quiz-set-kind="focus"][data-quiz-set="3"]'));
    assert.equal(overview.querySelector('[data-focusdom]').value, 'cre-fundamentals');
    click(window, overview.querySelector('[data-mode="focus"]'));
    const records = window.__TB.getFeedbackSnapshot().records;
    assert.ok(records.length > 0 && records.every((r) => r.question.qid.startsWith('cre:set-3:')));
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
        ['0.03', '0.97', '0.92', '0.04', 'Scrap', 'Ship'].forEach((t) => assert.ok(svg.textContent.includes(t), `${q.qid} tree shows ${t}`));
        assert.equal(svg.querySelectorAll('.cre-out').length, 6, 'six terminal outcomes');
      } else if (q.chart && q.chart.type === 'cre-weibull-plot') {
        const svg = quiz.querySelector('svg.cre-chart');
        assert.ok(svg, `${q.qid} draws Weibull paper`);
        assert.equal(svg.querySelectorAll('circle.tb-chart-dot').length, 10, 'ten plotted failures');
        assert.ok(svg.querySelector('path.tb-chart-line'), 'fitted line drawn');
        assert.ok(svg.querySelector('.cre-ref'), '63.2% reference line drawn');
      } else if (q.chart && q.chart.type === 'cre-xy-plot') {
        const svg = quiz.querySelector('svg.cre-chart');
        assert.ok(svg, `${q.qid} draws the x-y plot`);
        assert.equal(svg.querySelectorAll('path.tb-chart-line').length, q.chart.series.length);
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
