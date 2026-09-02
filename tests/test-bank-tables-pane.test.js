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

async function waitForTableRender(dom, timeoutMs = 2000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const document = dom.window.document;
    if (!document.querySelector('.tb-tbl-loading') && document.querySelector('.tb-tbl-table')) return;
    await wait(dom.window, 10);
  }
  assert.fail(`reference table did not render within ${timeoutMs}ms`);
}

async function buildTablesDom() {
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

  // Stub fetch to serve the real repo JSON files from disk, exactly as the
  // browser would over HTTP -- this exercises the real data, not a mock.
  dom.window.fetch = function (url) {
    const file = path.join(ROOT, url.replace(/^\//, ''));
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, contents) => {
        if (err) { reject(err); return; }
        resolve({
          ok: true,
          json: () => Promise.resolve(JSON.parse(contents))
        });
      });
    });
  };
  dom.window.CSS = dom.window.CSS || { escape: (s) => String(s).replace(/[^a-zA-Z0-9_-]/g, '\\$&') };

  dom.window.eval(tablesScript);
  await wait(dom.window);
  return dom;
}

function setKey(dom, id, value) {
  const el = dom.window.document.querySelector(`[data-tbl-key="${id}"]`);
  assert.ok(el, `expected an input for key "${id}"`);
  el.value = value;
}

function clickFind(dom) {
  const btn = dom.window.document.querySelector('[data-tbl-find]');
  assert.ok(btn, 'expected a Find button');
  btn.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
}

function resultText(dom) {
  const el = dom.window.document.querySelector('[data-tbl-result]');
  return el ? el.textContent : '';
}

test('registry exposes all 15 reference tables grouped into categories', async () => {
  const dom = await buildTablesDom();
  const reg = dom.window.__TBTables.registry;
  assert.equal(reg.length, 18, 'binomial/poisson PMF+CMF and tolerance one/two-sided count as separate registry entries over 15 data files');
  const files = new Set(reg.map(e => e.file));
  assert.equal(files.size, 15, 'should map back to exactly 15 underlying JSON files');
});

test('Tables panel opens, defaults to Z table, and renders a sticky-header grid', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await waitForTableRender(dom);
  const table = dom.window.document.querySelector('.tb-tbl-table');
  assert.ok(table, 'expected a rendered table on open');
  assert.match(table.querySelector('thead').textContent, /0\.00/);
});

test('Z table lookup: z=1.00 -> Phi(z)=0.8413 (matches the CSSBB Handbook appendix exactly)', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await waitForTableRender(dom);
  setKey(dom, 'z', '1.00');
  clickFind(dom);
  assert.match(resultText(dom), /0\.8413/);
  const hit = dom.window.document.querySelector('.tbl-hit');
  assert.ok(hit, 'expected the matching cell to be highlighted');
  assert.equal(hit.textContent.trim(), '0.8413');
});

test('t-distribution lookup: df=14, alpha=0.05 -> t=1.761 (matches the exam question in Design 2 mockup)', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await waitForTableRender(dom);
  const chip = [...dom.window.document.querySelectorAll('[data-tbl-select]')].find(b => b.textContent === "Student's t");
  assert.ok(chip, 'expected a chip for Student\'s t');
  chip.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await waitForTableRender(dom);
  setKey(dom, 'df', '14');
  setKey(dom, 'alpha', '0.05');
  clickFind(dom);
  assert.match(resultText(dom), /1\.761/);
});

test('F-distribution lookup: alpha=0.05, v1=4, v2=20 -> F=2.87 (matches the ANOVA example in Design 3 mockup)', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await waitForTableRender(dom);
  const chip = [...dom.window.document.querySelectorAll('[data-tbl-select]')].find(b => b.textContent === 'F Distribution');
  chip.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await waitForTableRender(dom);
  setKey(dom, 'alpha', '0.05');
  setKey(dom, 'v1', '4');
  setKey(dom, 'v2', '20');
  clickFind(dom);
  // stats.f.ppf(0.95, 4, 20) = 2.866 (3-decimal stored precision; rounds to the
  // book's printed 2.87 at 2 decimals)
  assert.match(resultText(dom), /2\.86/);
});

test('Control chart constants lookup: n=5 -> A2=0.577 (matches the SPC example in Design 4 mockup)', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await waitForTableRender(dom);
  const chip = [...dom.window.document.querySelectorAll('[data-tbl-select]')].find(b => b.textContent === 'Control Chart Constants');
  chip.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await waitForTableRender(dom);
  setKey(dom, 'n', '5');
  clickFind(dom);
  // Displayed at the standard 3-decimal textbook precision (0.577), even though
  // the underlying JSON stores it more precisely (0.5768...).
  assert.match(resultText(dom), /A2=0\.577\b/);
});

test('Binomial PMF lookup: n=10, x=3, p=0.30 -> matches scipy-validated value', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await waitForTableRender(dom);
  const chip = [...dom.window.document.querySelectorAll('[data-tbl-select]')].find(b => b.textContent === 'Binomial (PMF)');
  chip.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await waitForTableRender(dom);
  setKey(dom, 'n', '10');
  setKey(dom, 'x', '3');
  setKey(dom, 'p', '0.30');
  clickFind(dom);
  // stats.binom.pmf(3, 10, 0.30) = 0.2668
  assert.match(resultText(dom), /0\.2668/);
});

test('switching categories does not leak highlight state from the previous table', async () => {
  const dom = await buildTablesDom();
  dom.window.__TBTables.onOpen();
  await waitForTableRender(dom);
  setKey(dom, 'z', '1.00');
  clickFind(dom);
  assert.ok(dom.window.document.querySelector('.tbl-hit'));

  const chip = [...dom.window.document.querySelectorAll('[data-tbl-select]')].find(b => b.textContent === 'Chi-Square');
  chip.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await waitForTableRender(dom);
  assert.equal(dom.window.document.querySelectorAll('.tbl-hit').length, 0, 'new table should render with no stale highlight');
});
