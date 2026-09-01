'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const tablesScript = fs.readFileSync(path.join(ROOT, 'test-bank-tables.js'), 'utf8');

function wait(window, ms = 30) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

async function buildTablesDom(opts = {}) {
  const dom = new JSDOM(`<!doctype html><html><head></head><body>
    <div id="tb-toollayer">
      <aside id="tb-tables" aria-label="Reference tables">
        <div data-tbl-mount></div>
      </aside>
    </div>
  </body></html>`, {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });

  const delayMap = opts.delayMap || {};
  dom.window.fetch = function (url) {
    const file = path.join(ROOT, url.replace(/^\//, ''));
    const delay = delayMap[path.basename(file)] || 0;
    return new Promise((resolve, reject) => {
      const doRead = () => fs.readFile(file, 'utf8', (err, contents) => {
        if (err) { reject(err); return; }
        resolve({ ok: true, json: () => Promise.resolve(JSON.parse(contents)) });
      });
      if (delay) dom.window.setTimeout(doRead, delay); else doRead();
    });
  };
  dom.window.CSS = dom.window.CSS || { escape: (s) => String(s).replace(/[^a-zA-Z0-9_-]/g, '\\$&') };

  dom.window.eval(tablesScript);
  await wait(dom.window);
  return dom;
}

function chipFor(dom, label) {
  return [...dom.window.document.querySelectorAll('[data-tbl-select]')].find(b => b.textContent === label);
}
function setKey(dom, id, value) {
  const el = dom.window.document.querySelector(`[data-tbl-key="${id}"]`);
  if (!el) return false;
  el.value = value;
  return true;
}
function clickFind(dom) {
  const btn = dom.window.document.querySelector('[data-tbl-find]');
  if (!btn) return;
  btn.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
}
function resultText(dom) {
  const el = dom.window.document.querySelector('[data-tbl-result]');
  return el ? el.textContent : '';
}

/* =======================================================================
 * 1. EVERY category renders without throwing, and its lookup bar has the
 *    expected number of input fields.
 * ===================================================================== */
test('STRESS: all 15 categories load and render without error', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await wait(dom.window);
  const reg = dom.window.__TBTables.registry;
  for (const entry of reg) {
    const chip = chipFor(dom, entry.label);
    assert.ok(chip, `missing chip for ${entry.label}`);
    chip.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    await wait(dom.window, 60);
    const body = dom.window.document.querySelector('[data-tbl-body]');
    assert.ok(!/tb-tbl-error/.test(body.innerHTML), `${entry.label} rendered an error state`);
    const table = body.querySelector('.tb-tbl-table');
    assert.ok(table, `${entry.label} did not render a table`);
    const keyInputs = body.querySelectorAll('[data-tbl-key]');
    assert.equal(keyInputs.length, entry.keys.length, `${entry.label} expected ${entry.keys.length} key inputs, got ${keyInputs.length}`);
  }
});

/* =======================================================================
 * 2. Boundary values: at/beyond table limits should degrade gracefully
 *    (clamp to nearest valid row), never throw.
 * ===================================================================== */
test('STRESS: boundary values beyond table range degrade gracefully instead of crashing', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await wait(dom.window);

  // t-table: df way beyond the table's max (120) should clamp to the "inf" row
  chipFor(dom, "Student's t").dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60);
  setKey(dom, 'df', '999999');
  setKey(dom, 'alpha', '0.05');
  assert.doesNotThrow(() => clickFind(dom));
  assert.match(resultText(dom), /1\.6[45]/, 'df=999999 should resolve to the t(inf) row (~1.645 at alpha=0.05)');

  // Chi-square: df beyond max (100)
  chipFor(dom, 'Chi-Square').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60);
  setKey(dom, 'df', '500');
  setKey(dom, 'alpha', '0.05');
  assert.doesNotThrow(() => clickFind(dom));
  assert.notEqual(resultText(dom), '', 'should still produce a result, not blank/crash');

  // Control chart constants: n=1 is a genuine mathematical edge case (c4 formula
  // divides by (n-1), which is 0 at n=1) -- must not crash or produce NaN in the UI
  chipFor(dom, 'Control Chart Constants').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60);
  setKey(dom, 'n', '1');
  assert.doesNotThrow(() => clickFind(dom));
  // n=1 is below the table's minimum (n starts at 2) -- should report no match, not crash
  const n1Result = resultText(dom);
  assert.ok(!/NaN/.test(n1Result), 'n=1 must not surface NaN to the student');

  // Binomial: n beyond table max (10)
  chipFor(dom, 'Binomial (PMF)').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60);
  setKey(dom, 'n', '500');
  setKey(dom, 'x', '3');
  setKey(dom, 'p', '0.30');
  assert.doesNotThrow(() => clickFind(dom));
  assert.match(resultText(dom), /no exact match/i, 'n beyond table range should say no match, not silently guess');
});

/* =======================================================================
 * 3. Malformed / empty input must never silently resolve to a WRONG,
 *    confident-looking answer -- this is the highest-stakes failure mode
 *    for an exam tool (a wrong answer that LOOKS right).
 * ===================================================================== */
test('STRESS: empty/non-numeric input never produces a false-confident match', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await wait(dom.window);

  // F distribution (matrix shape) with row field left blank
  chipFor(dom, 'F Distribution').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60);
  setKey(dom, 'alpha', '0.05');
  setKey(dom, 'v1', '');
  setKey(dom, 'v2', '');
  assert.doesNotThrow(() => clickFind(dom));
  assert.match(resultText(dom), /no exact match/i, 'BUG: blank F-table inputs must not silently resolve to a value');

  // Duncan's (matrix shape) with row field left blank
  chipFor(dom, "Duncan's Multiple Range").dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60);
  setKey(dom, 'alpha', '0.05');
  setKey(dom, 'p', '');
  setKey(dom, 'df', '');
  assert.doesNotThrow(() => clickFind(dom));
  assert.match(resultText(dom), /no exact match/i, "BUG: blank Duncan's inputs must not silently resolve to a value");

  // Studentized range (matrix shape) with non-numeric garbage
  chipFor(dom, 'Studentized Range (Tukey q)').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60);
  setKey(dom, 'alpha', '0.05');
  setKey(dom, 'k', 'abc');
  setKey(dom, 'df', 'xyz');
  assert.doesNotThrow(() => clickFind(dom));
  assert.match(resultText(dom), /no exact match/i, 'BUG: garbage input to Tukey q must not silently resolve to a value');

  // Tolerance factors (toleranceFactors shape) with blank n
  chipFor(dom, 'Tolerance Factors (One-Sided)').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60);
  setKey(dom, 'gamma', '0.95');
  setKey(dom, 'P', '0.95');
  setKey(dom, 'n', '');
  assert.doesNotThrow(() => clickFind(dom));
  assert.match(resultText(dom), /no exact match/i, 'BUG: blank tolerance-factor n must not silently resolve to a value');
});

/* =======================================================================
 * 4. Rapid interaction ordering: fast category switching must not race
 *    (a slow-resolving fetch for a table the student already navigated
 *    away from must not clobber the table they're now looking at).
 * ===================================================================== */
test('STRESS: rapid category switching does not let a stale fetch clobber the current view', async () => {
  // Z table's fetch is artificially delayed well past when the student
  // has already moved on to Chi-Square.
  const dom = await buildTablesDom({ delayMap: { 'z_table.json': 200 } });
  dom.window.__TBTables.onOpen(); // opens on Z by default, kicks off the slow fetch
  await wait(dom.window, 10);

  chipFor(dom, 'Chi-Square').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60); // chi-square (no artificial delay) resolves first

  const bodyAfterChiSquare = dom.window.document.querySelector('[data-tbl-body]').innerHTML;
  assert.match(bodyAfterChiSquare, /Chi-Square|chi2|degrees of freedom/i, 'expected chi-square to be showing');

  // Now let the slow Z fetch resolve -- it must NOT clobber the Chi-Square view
  // the student has since navigated to.
  await wait(dom.window, 250);
  const bodyAfterZResolves = dom.window.document.querySelector('[data-tbl-body]').innerHTML;
  assert.match(bodyAfterZResolves, /degrees of freedom/i, 'expected Chi-Square to still be showing');
  assert.doesNotMatch(bodyAfterZResolves, /Phi\(z\)/i, 'BUG: the late-arriving Z-table fetch overwrote the Chi-Square view the student had already navigated to');
});

/* =======================================================================
 * 5. Repeated open/close/reopen must not duplicate event listeners
 *    (which would cause multiple highlights or multiple result writes
 *    per single click after several open/close cycles).
 * ===================================================================== */
test('STRESS: repeated open/close cycles do not duplicate listeners', async () => {
  const dom = await buildTablesDom();
  for (let i = 0; i < 5; i++) {
    dom.window.__TBTables.onOpen();
    await wait(dom.window, 40);
  }
  setKey(dom, 'z', '1.00');
  clickFind(dom);
  await wait(dom.window, 20);
  const hits = dom.window.document.querySelectorAll('.tbl-hit');
  assert.equal(hits.length, 1, `expected exactly 1 highlighted cell after 5 reopen cycles, got ${hits.length} (listener duplication)`);
  // result text should not be duplicated/concatenated either
  const text = resultText(dom);
  const occurrences = (text.match(/0\.8413/g) || []).length;
  assert.equal(occurrences, 1, `result text should contain the answer once, found it ${occurrences} times`);
});

/* =======================================================================
 * 6. Rapid repeated Find clicks on the same table must not accumulate
 *    highlights or duplicate result text.
 * ===================================================================== */
test('STRESS: rapid repeated Find clicks do not accumulate highlights', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await wait(dom.window);
  setKey(dom, 'z', '2.00');
  for (let i = 0; i < 8; i++) clickFind(dom);
  await wait(dom.window, 20);
  const hits = dom.window.document.querySelectorAll('.tbl-hit');
  assert.equal(hits.length, 1, `8 rapid Find clicks should still leave exactly 1 highlighted cell, got ${hits.length}`);
});

/* =======================================================================
 * 7. Fetch failure must show a clear error, not a silent blank panel or
 *    an unhandled promise rejection.
 * ===================================================================== */
test('STRESS: a failed fetch surfaces a visible error instead of failing silently', async () => {
  const dom = await buildTablesDom();
  dom.window.fetch = function () { return Promise.reject(new Error('simulated network failure')); };
  dom.window.eval(tablesScript); // re-register with the now-failing fetch
  dom.window.__TBTables.onOpen();
  await wait(dom.window, 80);
  const body = dom.window.document.querySelector('[data-tbl-body]');
  assert.match(body.innerHTML, /tb-tbl-error/, 'expected a visible error state when the table data fails to load');
  assert.match(body.textContent, /could not load/i);
});

/* =======================================================================
 * 8. Accuracy spot-checks across MULTIPLE points per table (not just one),
 *    covering every shape type, cross-checked against the same values
 *    independently validated in the data-generation pipeline.
 * ===================================================================== */
test('STRESS: multi-point accuracy check across every table shape', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await wait(dom.window);

  const cases = [
    { label: 'Standard Normal (Z)', keys: { z: '-1.96' }, expect: /0\.0250/ },
    { label: 'Standard Normal (Z)', keys: { z: '0.00' }, expect: /0\.5000|0\.5\b/ },
    { label: "Student's t", keys: { df: '1', alpha: '0.05' }, expect: /6\.314/ },
    { label: "Student's t", keys: { df: '30', alpha: '0.01' }, expect: /2\.457/ },
    { label: 'Chi-Square', keys: { df: '1', alpha: '0.05' }, expect: /3\.841/ },
    { label: 'Poisson (PMF)', keys: { x: '0', lambda: '1.00' }, expect: /0\.3679/ },
    { label: 'Exponential', keys: { x: '1.0' }, expect: /0\.63212/ },
    { label: 'Sigma Level / DPMO', keys: { sigma: '6.0' }, expect: /3\.4/ },
    { label: 'Median Ranks', keys: { i: '1', n: '1' }, expect: /0\.5/ },
  ];

  for (const c of cases) {
    const chip = chipFor(dom, c.label);
    assert.ok(chip, `missing chip: ${c.label}`);
    chip.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    await wait(dom.window, 60);
    for (const [k, v] of Object.entries(c.keys)) setKey(dom, k, v);
    clickFind(dom);
    assert.match(resultText(dom), c.expect, `${c.label} with ${JSON.stringify(c.keys)} did not match ${c.expect}`);
  }
});

/* =======================================================================
 * 8b. Z-table specific sweep: this is the single most commonly used table
 *     on the exam, and the negative side had a real bug that a single
 *     spot-check (z=1.0, the original basic test) never would have caught.
 *     Exhaustively cross-check many positive AND negative values against
 *     the same scipy-validated source of truth used to build the data.
 * ===================================================================== */
test('STRESS: Z-table sweep, positive and negative, cross-checked against known Phi(z) values', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await wait(dom.window);

  // Known-correct Phi(z) values (standard normal CDF), spanning both signs,
  // row boundaries, and mid-row offsets.
  const cases = [
    ['-3.00', '0.0013'], ['-2.58', '0.0049'], ['-2.00', '0.0228'],
    ['-1.96', '0.0250'], ['-1.65', '0.0495'], ['-1.00', '0.1587'],
    ['-0.50', '0.3085'], ['-0.01', '0.4960'], ['0.00', '0.5000'],
    ['0.01', '0.5040'], ['0.50', '0.6915'], ['1.00', '0.8413'],
    ['1.65', '0.9505'], ['1.96', '0.9750'], ['2.00', '0.9772'],
    ['2.58', '0.9951'], ['3.00', '0.9987'],
  ];

  chipFor(dom, 'Standard Normal (Z)').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60);

  for (const [z, expected] of cases) {
    setKey(dom, 'z', z);
    clickFind(dom);
    assert.match(resultText(dom), new RegExp(expected.replace('.', '\\.')), `z=${z} expected Phi(z)~${expected}, got: ${resultText(dom)}`);
  }
});

/* =======================================================================
 * 9. Matrix-shape alpha/gamma switching, done repeatedly, must always
 *    reflect the CURRENTLY selected alpha -- not a stale one.
 * ===================================================================== */
test('STRESS: repeated alpha switching on a matrix table always reflects the latest selection', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await wait(dom.window);
  chipFor(dom, 'F Distribution').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 60);

  const alphaSequence = ['0.01', '0.10', '0.05', '0.99', '0.05'];
  for (const a of alphaSequence) {
    const sel = dom.window.document.querySelector('[data-tbl-key="alpha"]');
    sel.value = a;
    sel.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await wait(dom.window, 30);
  }
  setKey(dom, 'v1', '4');
  setKey(dom, 'v2', '20');
  clickFind(dom);
  // last alpha in sequence is 0.05 -> F(0.05,4,20) = 2.866
  assert.match(resultText(dom), /2\.86/, 'after 5 alpha switches ending on 0.05, result should reflect alpha=0.05, not a stale earlier selection');
});

/* =======================================================================
 * 10. Random number table renders as a real, well-formed grid (not just
 *     "doesn't throw" -- verify actual digit-block structure).
 * ===================================================================== */
test('STRESS: random number table renders 50 well-formed rows', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await wait(dom.window);
  chipFor(dom, 'Random Number Table').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await wait(dom.window, 80);
  const rows = dom.window.document.querySelectorAll('.tb-tbl-table tbody tr');
  assert.equal(rows.length, 50, `expected 50 rows, got ${rows.length}`);
  const firstLineNumber = rows[0].querySelector('th').textContent.trim();
  assert.equal(firstLineNumber, '1', 'first row should be line 1');
});
