'use strict';
// The CRE Formula Encyclopedia toolbar offers its quick-reference PDF as a direct download.
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const PDF_URL = '/assets/lessons/cre-formula-encyclopedia/cre-formula-encyclopedia-quick-reference.pdf';
const html = fs.readFileSync(path.join(ROOT, 'lessons/quality-engineering/cre-formula-encyclopedia.html'), 'utf8');

test('toolbar has a Download PDF link to the quick reference', () => {
  const { document } = new JSDOM(html).window;
  const row = document.querySelector('[aria-label="Formula filters"] .button-row');
  assert.ok(row, 'toolbar button row exists');
  const links = row.querySelectorAll('a.pdf-download');
  assert.equal(links.length, 1, 'exactly one download link');
  const link = links[0];
  assert.equal(link.getAttribute('href'), PDF_URL);
  assert.equal(link.getAttribute('download'), 'CRE-Formula-Encyclopedia-Quick-Reference.pdf');
  assert.equal(link.textContent.trim(), 'Download PDF');
  assert.match(link.getAttribute('aria-label'), /^Download PDF/);
  assert.ok(link.classList.contains('btn'), 'uses the toolbar button styling');
  const icon = link.querySelector('svg');
  assert.ok(icon && icon.getAttribute('aria-hidden') === 'true', 'icon is decorative');
  // existing controls are kept
  for (const id of ['resetBtn', 'expandBtn', 'collapseBtn']) assert.ok(row.querySelector('#' + id), id + ' still present');
});

test('download button keeps its accent colours in light and dark themes', () => {
  assert.match(html, /\[data-cre-encyclopedia\] \.btn\.pdf-download\{[^}]*color:var\(--lesson-cre-fe-primary\)[^}]*white-space:nowrap|\[data-cre-encyclopedia\] \.btn\.pdf-download\{[^}]*white-space:nowrap[^}]*color:var\(--lesson-cre-fe-primary\)/);
  // must out-rank the later generic dark rule for .btn:not(.primary)
  assert.match(html, /html\[data-theme="dark"\] \[data-cre-encyclopedia\] \.button-row \.btn\.pdf-download\{[^}]*color:var\(--lesson-cre-fe-primary\);-webkit-text-fill-color:var\(--lesson-cre-fe-primary\);border-color:var\(--lesson-cre-fe-primary\)/);
});

test('the linked PDF ships with the site', () => {
  const file = path.join(ROOT, PDF_URL.slice(1));
  assert.ok(fs.existsSync(file), `${PDF_URL} is committed`);
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.subarray(0, 5).toString('latin1'), '%PDF-', 'file is a PDF');
  assert.ok(bytes.length > 100 * 1024 && bytes.length < 10 * 1024 * 1024, 'size is sane for a download');
});
