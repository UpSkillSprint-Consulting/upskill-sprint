import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync('test-bank.html', 'utf8');
const edge = fs.readFileSync('netlify/edge-functions/test-bank-mobile-picker.js', 'utf8');
const memory = fs.readFileSync('test-bank-memory-learning.js', 'utf8');

assert.match(memory, /window\.__TB_MEMORY_ONLY\s*=\s*true/, 'memory-only runtime marker is required');
assert.match(memory, /window\.__TBLearning\s*=\s*api/, 'memory-only learning compatibility API is required');
assert.doesNotMatch(memory, /supabase/i, 'memory-only runtime must not depend on Supabase');
assert.doesNotMatch(memory, /fetch\s*\(/, 'memory-only runtime must not perform network writes');
assert.match(edge, /stripPersistedExamRuntime/, 'edge delivery must strip persisted exam runtime');
assert.match(edge, /keepTestBankScript/, 'edge delivery must use an explicit static-content allowlist');
assert.match(edge, /test-bank-memory-learning\.js/, 'edge delivery must inject memory-only runtime');
assert.match(edge, /\^\\\/test-bank-/, 'edge delivery must strip non-allowlisted test-bank scripts by prefix');
assert.match(html, /Certification Test Bank/i, 'test-bank page must remain present');
assert.match(html, /Full Exam/i, 'Full Exam mode must remain present');
assert.match(html, /Quick Quiz/i, 'Quick Quiz mode must remain present');
assert.match(html, /Focused Quiz/i, 'Focused Quiz mode must remain present');

for (const file of [
  'test-bank-cmq-set1.js',
  'test-bank-cssgb-set1.js',
  'test-bank-mbb-set1.js',
  'test-bank-formulas.js',
  'test-bank-tables.js'
]) {
  assert.ok(fs.existsSync(file), `static question/content dependency must remain: ${file}`);
}

console.log('Stateless test-bank validation passed: static questions retained, persistence runtime stripped.');
