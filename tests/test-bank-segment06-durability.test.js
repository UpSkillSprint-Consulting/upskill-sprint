'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('Segment 06 keeps core choices as drafts until finalization', () => {
  const source = read('test-bank.html');
  const optionHandler = source.slice(source.indexOf("querySelectorAll('[data-opt]')"), source.indexOf("querySelectorAll('[data-goto]')"));
  assert.match(optionHandler, /recordDraft\s*\(/);
  assert.doesNotMatch(optionHandler, /recordAnswer\s*\(/);
  assert.match(source, /completeSession\s*\(\{examId:current/);
});

test('Segment 06 adaptive modes separate saved choices from explicit checks', () => {
  ['test-bank-adaptive-mastery.js', 'test-bank-adaptive-mastery-hardening.js'].forEach(file => {
    const source = read(file);
    const optionStart = file.includes('hardening') ? source.lastIndexOf('dataset.v2Option') : source.lastIndexOf('dataset.adaptiveOpt');
    const checkStart = file.includes('hardening') ? source.lastIndexOf("data-v2-check") : source.lastIndexOf("data-adaptive-check");
    const optionHandler = source.slice(optionStart, checkStart);
    assert.match(optionHandler, /recordDraft/);
    assert.doesNotMatch(optionHandler, /recordAnswer/);
    assert.match(source, /could not be submitted safely/);
  });
});

test('Segment 06 exposes owner-scoped draft persistence and recovery status', () => {
  const source = read('test-bank-learning-events.js');
  assert.match(source, /function recordDraft\s*\(/);
  assert.match(source, /type:\s*'answer_draft_saved'/);
  assert.match(source, /ownerId:\s*session\.ownerId/);
  assert.match(source, /draftOperationId/);
  assert.match(source, /recovery:\s*clone\(localRecovery\)/);
  assert.match(source, /recordDraft:\s*recordDraft/);
});

test('local drafts do not expand the deployed server event enum', () => {
  const migration = read('supabase/migrations/20260830235559_create_test_bank_learning_events.sql');
  assert.doesNotMatch(migration, /answer_draft_saved/);
  assert.match(read('docs/exam-reliability/contracts/v1/contract.json'), /"deployedLegacyEvents"/);
});
