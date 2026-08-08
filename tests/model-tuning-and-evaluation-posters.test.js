'use strict';

// Regression guard for the Model Tuning & Evaluation wall posters.
// Verifies every poster the lesson links to actually exists on disk, is a
// real PDF, and is substantially larger than a placeholder stub.

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const LESSON = path.join(ROOT, 'lessons', 'data-analytics', 'model-tuning-and-evaluation.html');
const DOWNLOAD_PREFIX = '/downloads/model-tuning-and-evaluation/';

const MIN_POSTER_BYTES = 100 * 1024;
const EXPECTED_POSTER_COUNT = 4;

function posterHrefsFromLesson() {
  const html = fs.readFileSync(LESSON, 'utf8');
  const re = new RegExp('href="(' + DOWNLOAD_PREFIX.replace(/\//g, '\\/') + '[^"]+\\.pdf)"', 'g');
  const hrefs = new Set();
  let m;
  while ((m = re.exec(html)) !== null) hrefs.add(m[1]);
  return [...hrefs];
}

test('lesson links to exactly four wall poster PDFs', () => {
  assert.equal(posterHrefsFromLesson().length, EXPECTED_POSTER_COUNT);
});

test('every referenced poster PDF exists, is a real PDF, and is not a placeholder stub', () => {
  for (const href of posterHrefsFromLesson()) {
    const abs = path.join(ROOT, href.replace(/^\//, ''));
    assert.ok(fs.existsSync(abs), `missing poster file: ${href}`);
    const stat = fs.statSync(abs);
    assert.ok(
      stat.size > MIN_POSTER_BYTES,
      `poster ${href} is ${stat.size} bytes — looks like a placeholder stub, expected > ${MIN_POSTER_BYTES}`
    );
    const header = fs.readFileSync(abs).subarray(0, 5).toString('latin1');
    assert.equal(header, '%PDF-', `poster ${href} does not start with a %PDF- header`);
  }
});
