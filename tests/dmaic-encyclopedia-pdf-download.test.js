'use strict';
// The DMAIC Formula Encyclopedia toolbar offers the quick-reference PDF as a
// direct download (it previously linked to a "request a format" form).
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const PDF_URL = '/assets/lessons/dmaic-formula-encyclopedia/dmaic-formula-encyclopedia-quick-reference.pdf';
const controller = fs.readFileSync(path.join(ROOT, 'dmaic-encyclopedia-fixes.js'), 'utf8');

function renderToolbar() {
  const dom = new JSDOM(`<!doctype html><html><body><main>
    <section class="validation-panel"></section>
    <section class="toolbar">
      <input id="searchInput"><select id="phaseFilter"></select><select id="examFilter"></select><select id="familyFilter"></select>
      <div class="button-row">
        <button class="btn primary" id="resetBtn">Reset filters</button>
        <button class="btn" id="highYieldBtn">High-yield only</button>
        <button class="btn" id="expandBtn">Expand details</button>
        <button class="btn" id="collapseBtn">Collapse details</button>
        <button class="btn" id="themeBtn">Dark mode</button>
        <button class="btn" onclick="window.print()">Print / PDF</button>
        <button class="btn warning" id="downloadBtn">Download this HTML</button>
      </div>
    </section>
    <div id="resultCount"></div><nav id="phaseNav"></nav><div id="formulaRoot"></div>
  </main></body></html>`, { runScripts: 'outside-only', url: 'https://upskillsprint.com/lessons/lean-six-sigma/dmaic-formula-encyclopedia' });
  const { window } = dom;
  window.eval(`var phaseMeta = { "Measure": { code: "M", color: "#0891b2", description: "Baseline." } };
    var formulas = [{ id: "M09", phase: "Measure", family: "Six Sigma Metrics", title: "Sigma-level conversion",
      exams: ["CSSBB"], high: true, eq: "Y = 1 - \\\\frac{DPMO}{10^6}", use: "Convert.", trap: "Shift.", source: "BoK" }];`);
  try { window.eval(controller); } catch (error) { /* math loading needs a browser; toolbar is built first */ }
  return window;
}

test('toolbar shows a Download PDF link in place of the format-request link', () => {
  const { document } = renderToolbar();
  const row = document.querySelector('.button-row');
  assert.ok(row, 'toolbar row exists');
  assert.equal(row.querySelector('a[href^="/request-topic"]'), null, 'old "Ask for HTML/PDF format" link is gone');
  assert.ok(!row.textContent.includes('Ask for HTML/PDF format'));
  const link = row.querySelector('a.upskill-pdf-download');
  assert.ok(link, 'download link is rendered');
  assert.equal(link.getAttribute('href'), PDF_URL);
  assert.equal(link.getAttribute('download'), 'DMAIC-Formula-Encyclopedia-Quick-Reference.pdf');
  assert.equal(link.textContent.trim(), 'Download PDF');
  assert.match(link.getAttribute('aria-label'), /^Download PDF/);
  assert.ok(link.classList.contains('upskill-format-request'), 'keeps the existing light/dark toolbar styling');
});

test('the linked PDF ships with the site', () => {
  const file = path.join(ROOT, PDF_URL.slice(1));
  assert.ok(fs.existsSync(file), `${PDF_URL} is committed`);
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.subarray(0, 5).toString('latin1'), '%PDF-', 'file is a PDF');
  assert.ok(bytes.length > 100 * 1024 && bytes.length < 10 * 1024 * 1024, 'size is sane for a download');
});

test('lesson loader cache-busts the updated controller and styles', () => {
  const shell = fs.readFileSync(path.join(ROOT, 'lessons/lean-six-sigma/dmaic-formula-encyclopedia.html'), 'utf8');
  assert.match(shell, /dmaic-encyclopedia-fixes\.js\?v=3'/);
  assert.match(shell, /dmaic-encyclopedia-fixes\.css\?v=3'/);
});
