'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const source = fs.readFileSync(path.join(__dirname, '..', 'test-bank-account-sync.js'), 'utf8');
function load() { const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only' }); dom.window.eval(source); return dom; }

function fakeProgressService() {
  const rows = new Map();
  return {
    clientFor(userId) {
      return {
        from(table) {
          assert.equal(table, 'test_bank_progress_devices');
          return {
            upsert(row) {
              assert.equal(row.user_id, userId, 'client may write only its authenticated user id');
              rows.set(userId + ':' + row.device_id, JSON.parse(JSON.stringify(row)));
              return Promise.resolve({ error: null });
            },
            select() {
              return {
                order() {
                  return Promise.resolve({
                    error: null,
                    data: Array.from(rows.values())
                      .filter(row => row.user_id === userId)
                      .sort((a, b) => String(a.updated_at).localeCompare(String(b.updated_at)))
                  });
                }
              };
            }
          };
        }
      };
    }
  };
}

function syncedDevice(service, userId, questionId) {
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'outside-only',
    virtualConsole
  });
  const mastery = {
    version: 1,
    exams: {
      cssbb: {
        attempts: [],
        sessions: [],
        questions: {
          [questionId]: { history: [{ at: Date.now(), status: 'correct' }], lastSeenAt: Date.now() }
        }
      }
    }
  };
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(mastery));
  dom.window.eval(source);
  dom.window.UpskillAuth = {
    getClient: () => service.clientFor(userId),
    getUser: () => ({ id: userId })
  };
  return dom;
}
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
test('merging two devices retains every incorrect attempt in a question history, not just the most recent 30', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  const leftHistory = [];
  for (let index = 0; index < 20; index += 1) leftHistory.push({ at: index, status: 'incorrect' });
  const rightHistory = [];
  for (let index = 20; index < 40; index += 1) rightHistory.push({ at: index, status: 'incorrect' });
  const left = { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: { history: leftHistory, lastSeenAt: 19 } } } } };
  const right = { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: { history: rightHistory, lastSeenAt: 39 } } } } };
  const result = merge(left, right).exams.cssbb.questions.q1;
  const incorrectEntries = result.history.filter(entry => entry.status === 'incorrect');
  assert.equal(incorrectEntries.length, 40, 'no incorrect attempt from either device is dropped once the merged count exceeds the old 30-entry cap');
  dom.window.close();
});
test('selects deterministic legacy readiness snapshot', () => {
  const dom = load(); const result = dom.window.__TBAccountSync.mergePayloads([{ schemaVersion: 1, values: { 'tb-adaptive-cssbb': { attempts: 2, lastReadiness: 91 } } }, { schemaVersion: 1, values: { 'tb-adaptive-cssbb': { attempts: 4, lastReadiness: 77 } } }]);
  assert.equal(result.values['tb-adaptive-cssbb'].attempts, 4); assert.equal(result.values['tb-adaptive-cssbb'].lastReadiness, 77); dom.window.close();
});
test('SQL migration enables RLS and scopes policies to auth.uid()', () => {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'test-bank-progress.sql'), 'utf8');
  const policies = sql.match(/create policy[\s\S]*?;/gi) || [];
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /revoke all .* from public, anon, authenticated/i);
  assert.match(sql, /grant select, insert, update .* to authenticated/i);
  assert.doesNotMatch(sql, /grant .*\b(delete|truncate|references|trigger)\b/i);
  assert.equal(policies.length, 3);
  policies.forEach(policy => assert.match(policy, /\(select auth\.uid\(\)\) = user_id/i));
  assert.doesNotMatch(sql, /service_role/i);
});

test('polls for remote progress and permits every later remote refresh', () => {
  const dom = load();
  assert.equal(dom.window.__TBAccountSync.REMOTE_POLL_MS, 15000);
  assert.match(source, /sync\('remote-poll'\)/);
  assert.match(source, /const shouldReload = changed \|\| reloadForAccountSwitch/);
  assert.match(source, /if \(shouldReload\) location\.reload\(\)/);
  assert.doesNotMatch(source, /tb-account-sync-reloaded/);
  dom.window.close();
});

test('two devices converge without leaking another user progress', async () => {
  const service = fakeProgressService();
  const a = syncedDevice(service, 'user-1', 'q1');
  const b = syncedDevice(service, 'user-1', 'q2');
  const other = syncedDevice(service, 'user-2', 'private-q');

  await Promise.all([
    a.window.__TBAccountSync.sync('test-concurrent'),
    b.window.__TBAccountSync.sync('test-concurrent'),
    other.window.__TBAccountSync.sync('test-isolation')
  ]);
  await Promise.all([
    a.window.__TBAccountSync.sync('test-converge'),
    b.window.__TBAccountSync.sync('test-converge')
  ]);

  for (const dom of [a, b]) {
    const stored = JSON.parse(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
    assert.deepEqual(Object.keys(stored.exams.cssbb.questions).sort(), ['q1', 'q2']);
    assert.equal(Object.hasOwn(stored.exams.cssbb.questions, 'private-q'), false);
  }
  const privateStored = JSON.parse(other.window.localStorage.getItem('tb-adaptive-mastery-v1'));
  assert.deepEqual(Object.keys(privateStored.exams.cssbb.questions), ['private-q']);

  a.window.close(); b.window.close(); other.window.close();
});
