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

test('CRE Set 1 batch 1 has ten well-formed, uniquely identified questions', () => {
  assert.equal(BANK.length, 10);
  const ids = new Set();
  for (const q of BANK) {
    assert.match(q.qid, /^cre:set-1:b01-q\d{2}$/);
    assert.ok(!ids.has(q.qid), `duplicate ${q.qid}`);
    ids.add(q.qid);
    assert.equal(q.set, 1);
    assert.equal(q.batch, 1);
    assert.equal(q.sub, 'cre-statistics', `${q.qid} belongs to domain III`);
    assert.match(q.bok.code, /^III\.A\.[1-3]$/);
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
    assert.ok(q.keyPoint && q.trap && q.formula, `${q.qid} has teaching fields`);
  }
});

test('batch 1 follows the planned difficulty mix, visual quota and balanced answer key', () => {
  const count = (d) => BANK.filter((q) => q.difficulty === d).length;
  assert.equal(count('Easy'), 1);
  assert.equal(count('Medium'), 3);
  assert.equal(count('Hard'), 4);
  assert.equal(count('Very Hard'), 2);
  assert.ok(BANK.filter((q) => q.chart).length >= 4, 'at least four questions carry a visual');
  const letters = [0, 0, 0, 0];
  BANK.forEach((q) => letters[q.answer]++);
  assert.ok(Math.max(...letters) <= 3 && Math.min(...letters) >= 2, `answer positions are balanced: ${letters}`);
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
  const beta = Number(table['Shape (β)']);
  const eta = Number(table['Scale (η)'].replace(/[^0-9.]/g, ''));
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
  assert.match(keyed, new RegExp('χ² = ' + chi.toFixed(2).replace('.', '\\.') + ' with 2 degrees of freedom'));
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
  assert.match(q.options[q.answer], /^β ≈ 0\.5: the hazard rate is decreasing/);
  // plotted points are median ranks for n = 10
  q.chart.points.forEach(([, f], i) => assert.ok(Math.abs(f - 100 * (i + 1 - 0.3) / 10.4) < 0.06));
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
    .replace('<script src="/test-bank-memory-learning.js"></script>', `<script>${MEMORY_SOURCE}</script>`)
    .replace('<script src="/test-bank-cre-set1.js"></script>', `<script>${CRE_SET1_SOURCE}</script>`)
    .replace('<script src="/test-bank-cre-ui.js"></script>', `<script>${CRE_UI_SOURCE}</script>`)
    .replace('<script src="/test-bank-cre-set2.js"></script>', `<script>${CRE_SET2_SOURCE}</script>`)
    .replace('<script src="/test-bank-cre-set2-ui.js"></script>', `<script>${CRE_SET2_UI_SOURCE}</script>`)
    .replace('<script src="/test-bank-cre-set3.js"></script>', `<script>${CRE_SET3_SOURCE}</script>`);
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
    assert.equal(exam.bank.length, 10);
    assert.equal(exam.minutes, 258);
    assert.equal(JSON.stringify(exam.bok.map((d) => d.weight)), '[29,25,35,35,26]');
    const subs = new Set(exam.bok.flatMap((d) => d.subs.map((s) => s.id)));
    BANK.forEach((q) => assert.ok(subs.has(q.sub)));
    // Sets 1-3 share one five-domain BoK: every question in every set maps to a domain.
    assert.equal(exam.bok.length, 5, 'registerCRESet2 must not add duplicate domains');
    assert.equal(exam.sets[1].length, 10);
    assert.ok(exam.sets[2].length > 0 && exam.sets[3].length > 0, 'Sets 2 and 3 remain available');
    for (const id of ['1', '2', '3']) {
      for (const q of exam.sets[id]) {
        assert.ok(exam.bok.some((d) => d.subs.some((s) => s.id === q.sub)), `${q.qid} (${q.sub}) maps to a BoK domain`);
      }
    }
    click(window, window.document.querySelector('.tb-tile[data-exam="cre"]'));
    const overview = window.document.getElementById('tb-overview');
    assert.match(overview.textContent, /Set 1 currently contains 10 of the planned 150/);
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
    assert.equal(overview.querySelector('[data-focusdom]').value, 'cre-statistics');
    // Set 3 batch 1 has no Domain III items: keep the learner's area and explain.
    click(window, overview.querySelector('[data-quiz-set-kind="focus"][data-quiz-set="3"]'));
    assert.equal(overview.querySelector('[data-focusdom]').value, 'cre-statistics');
    assert.equal(overview.querySelector('[data-mode="focus"]').disabled, true);
    assert.match(overview.textContent, /No questions are available in .*Probability and Statistics for Reliability.*Choose another area or test set/);
    const area = overview.querySelector('[data-focusdom]');
    area.value = 'cre-fundamentals';
    area.dispatchEvent(new window.Event('change', { bubbles: true }));
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
    assert.equal(records.length, 10);
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
    assert.match(result.textContent, /\(10\/10\)/);
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
