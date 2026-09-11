import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync('test-bank.html', 'utf8');
const edge = fs.readFileSync('netlify/edge-functions/test-bank-mobile-picker.js', 'utf8');
const memory = fs.readFileSync('test-bank-memory-learning.js', 'utf8');
const resetMigration = fs.readFileSync('supabase/migrations/20260911031000_reset_test_bank_to_profile_only.sql', 'utf8');

assert.match(memory, /window\.__TB_MEMORY_ONLY\s*=\s*true/, 'memory-only runtime marker is required');
assert.match(memory, /window\.__TBLearning\s*=\s*api/, 'memory-only learning compatibility API is required');
assert.match(memory, /window\.__TBVersions\s*=\s*scoring/, 'memory-only delivery must retain current-session scoring');
assert.match(memory, /scoreRecords/, 'memory-only delivery must aggregate result-screen scores');
assert.doesNotMatch(memory, /supabase/i, 'memory-only runtime must not depend on Supabase');
assert.doesNotMatch(memory, /fetch\s*\(/, 'memory-only runtime must not perform network writes');
assert.match(edge, /stripPersistedExamRuntime/, 'edge delivery must strip persisted exam runtime');
assert.match(edge, /keepTestBankScript/, 'edge delivery must use an explicit static-content allowlist');
assert.match(edge, /test-bank-memory-learning\.js/, 'edge delivery must inject memory-only runtime');
assert.match(edge, /data-unseen/, 'delivery must remove New-only controls');
assert.match(edge, /data-missed/, 'delivery must remove Missed-question controls');
assert.match(edge, /tb-analytics/, 'delivery must remove analytics UI');
assert.match(resetMigration, /test_bank_%/, 'cleanup migration must target test-bank relations');
assert.match(resetMigration, /lesson_progress/, 'cleanup migration must remove lesson progress persistence');
assert.doesNotMatch(resetMigration, /DROP\s+TABLE[^;]*profiles/i, 'cleanup migration must never drop profiles');

assert.match(html, /Certification Test Bank/i, 'test-bank page must remain present');
assert.match(html, /Full Exam/i, 'Full Exam mode must remain present');
assert.match(html, /Quick Quiz/i, 'Quick Quiz mode must remain present');
assert.match(html, /Focused Quiz/i, 'Focused Quiz mode must remain present');

for (const file of [
  'test-bank-cmq-set1.js',
  'test-bank-cssgb-set1.js',
  'test-bank-mbb-set1.js',
  'test-bank-formulas.js',
  'test-bank-tables.js',
  'supabase/auth-phase1.sql'
]) {
  assert.ok(fs.existsSync(file), `required static/account dependency must remain: ${file}`);
}

for (const file of [
  'test-bank-learning-events.js',
  'test-bank-account-sync.js',
  'test-bank-adaptive-mastery.js',
  'test-bank-analytics-dashboard.js',
  'test-bank-session-lifecycle.js',
  'test-bank-session-timing.js',
  'test-bank-session-handoff.js',
  'test-bank-new-only-allocation-v2.js',
  'test-bank-history-reconciliation.js',
  'test-bank-set-controls.js'
]) {
  assert.ok(!fs.existsSync(file), `obsolete persisted runtime must be removed: ${file}`);
}

console.log('Stateless test-bank validation passed: static questions retained; persistence, analytics and history runtime removed.');
