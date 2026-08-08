'use strict';

// Regression guard for the Model Tuning & Evaluation poster pack.
// The lesson ships ONE combined PDF containing all four posters (one poster
// per page). This verifies the lesson links to that single PDF, and that the
// file exists, is a real PDF, is not a placeholder stub, and has >= 4 pages.

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const LESSON = path.join(ROOT, 'lessons', 'data-analytics', 'model-tuning-and-evaluation.html');
const DOWNLOAD_PREFIX = '/downloads/model-tuning-and-evaluation/';
const MIN_POSTER_BYTES = 300 * 1024;
const MIN_PDF_PAGES = 4;

function pdfHrefsFromLesson() {
  const html = fs.readFileSync(LESSON, 'utf8');
  const re = new RegExp('href="(' + DOWNLOAD_PREFIX.replace(/\//g, '\\/') + '[^"]+\\.pdf)"', 'g');
  const hrefs = new Set();
  let m;
  while ((m = re.exec(html)) !== null) hrefs.add(m[1]);
  return [...hrefs];
}

test('lesson links to exactly one combined poster PDF', () => {
  const hrefs = pdfHrefsFromLesson();
  assert.equal(hrefs.length, 1, `expected one combined PDF, got ${hrefs.length}: ${hrefs.join(', ')}`);
});

test('the poster PDF exists, is a real PDF, and is not a placeholder stub', () => {
  const [href] = pdfHrefsFromLesson();
  const abs = path.join(ROOT, href.replace(/^\//, ''));
  assert.ok(fs.existsSync(abs), `missing poster file: ${href}`);
  const buf = fs.readFileSync(abs);
  assert.ok(buf.length > MIN_POSTER_BYTES, `poster ${href} is ${buf.length} bytes, expected > ${MIN_POSTER_BYTES}`);
  assert.equal(buf.subarray(0, 5).toString('latin1'), '%PDF-', `poster ${href} is not a %PDF-`);
});

test('the combined poster PDF has at least four pages (one per poster)', () => {
  const [href] = pdfHrefsFromLesson();
  const abs = path.join(ROOT, href.replace(/^\//, ''));
  const bytes = fs.readFileSync(abs).toString('latin1');
  const matches = bytes.match(/\/Type\s*\/Page(?![s])/g) || [];
  assert.ok(matches.length >= MIN_PDF_PAGES, `expected >= ${MIN_PDF_PAGES} page objects, found ${matches.length}`);
});
