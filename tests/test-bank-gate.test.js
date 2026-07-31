'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

/* The certification test bank (exam simulations, practice, quizzes) is gated
   with the same soft sign-in gate as the engineering tools: it opts in via a
   data-require-auth <body> attribute and relies on require-auth.js, which is
   loaded site-wide by site-sections.js. The gate's behaviour itself is covered
   by tests/require-auth-gate.test.js; these guard this page's opt-in. */

test('the certification test bank opts into the sign-in gate', () => {
  assert.match(read('test-bank.html'), /<body[^>]*\bdata-require-auth\b/,
    'test-bank.html must carry data-require-auth');
});

test('the test bank loads the shared gate loader so the gate can run', () => {
  assert.match(read('test-bank.html'), /<script src="\/site-sections\.js">/,
    'site-sections.js present so require-auth.js is loaded');
});

test('the report-intake form is intentionally left public', () => {
  assert.doesNotMatch(read('test-bank-report-form.html'), /data-require-auth/,
    'the report intake is a form target, not part of the gated exam surface');
});
