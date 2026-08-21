'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const source = fs.readFileSync(path.join(__dirname, '..', 'test-bank-account-sync.js'), 'utf8');
function load() { const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only' }); dom.window.eval(source); return dom; }
test('merges attempts by stable ID without double counting', () => {
  const dom = load();
  const result = dom.window.__TBAccountSync.mergePayloads([{ schemaVersion: 1, values: { 'tb-attempt-history-v3': { attempts: [{ id: 'a', startedAt: 1 }] } } }, { schemaVersion: 1, values: { 'tb-attempt-history-v3': { attempts: [{ id: 'a', startedAt: 1 }, { id: 'b', startedAt: 2 }] } } }]);
  assert.deepEqual(Array.from(result.values['tb-attempt-history-v3'].attempts, item => item.id), ['a', 'b']); dom.window.close();
});
test('combines question histories and rebuilds counts', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  const left = { version: 1, exams: { cssbb: { attempts: [{ id: 'x' }], sessions: [], questions: { q1: { history: [{ at: 1, status: 'correct' }], lastSeenAt: 1 } } } } };
  const right = { version: 1, exams: { cssbb: { attempts: [{ id: 'y' }], sessions: [], questions: { q1: { history: [{ at: 2, status: 'incorrect' }], lastSeenAt: 2 } } } } };
  const result = merge(left, right).exams.cssbb;
  assert.equal(result.attempts.length, 2); assert.equal(result.questions.q1.attempts, 2); assert.equal(result.questions.q1.correct, 1); assert.equal(result.questions.q1.incorrect, 1); dom.window.close();
});
test('selects deterministic legacy readiness snapshot', () => {
  const dom = load(); const result = dom.window.__TBAccountSync.mergePayloads([{ schemaVersion: 1, values: { 'tb-adaptive-cssbb': { attempts: 2, lastReadiness: 91 } } }, { schemaVersion: 1, values: { 'tb-adaptive-cssbb': { attempts: 4, lastReadiness: 77 } } }]);
  assert.equal(result.values['tb-adaptive-cssbb'].attempts, 4); assert.equal(result.values['tb-adaptive-cssbb'].lastReadiness, 77); dom.window.close();
});
test('SQL migration enables RLS and scopes policies to auth.uid()', () => {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'test-bank-progress.sql'), 'utf8');
  const policies = sql.match(/create policy[\s\S]*?;/gi) || [];
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /grant select, insert, update, delete .* to authenticated/i);
  assert.equal(policies.length, 4);
  policies.forEach(policy => assert.match(policy, /\(select auth\.uid\(\)\) = user_id/i));
  assert.doesNotMatch(sql, /service_role/i);
});
