'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

/* Source banks are authoring inputs. The build emits an empty public shell;
   exam-access-delivery.test.js verifies the actual server protection. */
test('the certification simulator opts into per-exam delivery', () => {
  assert.match(read('test-bank.html'), /<body[^>]*data-exam-delivery="source"/);
});

test('the test bank loads the shared gate loader so the gate can run', () => {
  assert.match(read('test-bank.html'), /<script src="\/site-sections\.js">/,
    'site-sections.js present so require-auth.js is loaded');
});

test('the report-intake form is intentionally left public', () => {
  assert.doesNotMatch(read('test-bank-report-form.html'), /data-require-auth/,
    'the report intake is a form target, not part of the gated exam surface');
});
