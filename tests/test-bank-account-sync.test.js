'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const source = fs.readFileSync(path.join(__dirname, '..', 'test-bank-account-sync.js'), 'utf8');
function load() { const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only' }); dom.window.eval(source); return dom; }
function deferred() {
  let resolve;
  const promise = new Promise(resolvePromise => { resolve = resolvePromise; });
  return { promise, resolve };
}

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

function clearAdaptiveExam(dom, examId = 'cssbb') {
  const key = 'tb-adaptive-mastery-v1';
  const store = JSON.parse(dom.window.localStorage.getItem(key));
  delete store.exams[examId];
  dom.window.localStorage.setItem(key, JSON.stringify(store));
  dom.window.localStorage.removeItem('tb-adaptive-' + examId);
  return dom.window.__TBAccountSync.resetAdaptiveExam(examId);
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
test('syncing legacy progress does not recalculate mastery from the notebook-only history subset', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  const timestamp = Date.now();
  const history = [];
  for (let index = 0; index < 100; index += 1) history.push({ at: timestamp - 160 + index, status: 'correct' });
  for (let index = 0; index < 60; index += 1) history.push({ at: timestamp - 60 + index, status: 'incorrect' });
  const question = {
    attempts: 160,
    correct: 100,
    incorrect: 60,
    unanswered: 0,
    streak: 0,
    lastSeenAt: timestamp - 1,
    lastStatus: 'incorrect',
    mastery: 54,
    history
  };
  const left = { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: question } } } };
  const right = { version: 1, exams: {} };

  const result = merge(left, right).exams.cssbb.questions.q1;

  assert.equal(result.attempts, 160);
  assert.equal(result.correct, 100);
  assert.equal(result.incorrect, 60);
  assert.equal(result.unanswered, 0);
  assert.equal(result.mastery, 54);
  dom.window.close();
});
test('canonical mastery evidence merges concurrent device answers once and remains idempotent', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  const baseline = {
    at: 100, firstSeenAt: 10, attempts: 2, correct: 1, incorrect: 1, unanswered: 0,
    streak: 0, lastSeenAt: 100, lastStatus: 'incorrect'
  };
  const leftEvent = { id: 'device-a-answer', at: 200, status: 'correct', priorAttempts: 2 };
  const rightEvent = { id: 'device-b-answer', at: 200, status: 'incorrect', priorAttempts: 2 };
  const left = { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
    masteryBaseline: baseline, masteryHistory: [leftEvent], history: [leftEvent], lastSeenAt: 200
  } } } } };
  const right = { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
    masteryBaseline: baseline, masteryHistory: [rightEvent], history: [rightEvent], lastSeenAt: 201
  } } } } };

  const first = merge(left, right);
  const state = first.exams.cssbb.questions.q1;
  assert.equal(state.attempts, 4);
  assert.equal(state.correct, 2);
  assert.equal(state.incorrect, 2);
  assert.deepEqual(Array.from(state.masteryHistory, entry => entry.id), ['device-a-answer', 'device-b-answer']);
  assert.equal(state.lastStatus, 'incorrect');
  assert.equal(state.streak, 0);

  const reverse = merge(right, left).exams.cssbb.questions.q1;
  assert.deepEqual(Array.from(reverse.masteryHistory, entry => entry.id), ['device-a-answer', 'device-b-answer']);
  assert.equal(reverse.lastStatus, state.lastStatus, 'same-millisecond concurrent answers converge regardless of merge direction');
  assert.equal(reverse.streak, state.streak);

  const second = merge(first, first).exams.cssbb.questions.q1;
  assert.equal(second.attempts, 4, 're-merging the converged payload does not count either answer twice');
  assert.equal(second.masteryHistory.length, 2);
  dom.window.close();
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

test('a reset marker removes older mastery and legacy adaptive snapshots', () => {
  const dom = load();
  const result = dom.window.__TBAccountSync.mergePayloads([
    {
      schemaVersion: 1,
      values: {
        'tb-adaptive-mastery-v1': {
          version: 1,
          exams: {
            cssbb: {
              questions: { old: { history: [{ at: 100, status: 'correct' }], lastSeenAt: 100 } },
              attempts: [{ id: 'old-attempt', at: 100 }],
              sessions: [{ id: 'old-session', startedAt: 100 }]
            }
          }
        },
        'tb-adaptive-cssbb': {
          attempts: 1,
          lastReadiness: 80,
          lastAt: 100,
          history: [{ at: 100, readiness: 80 }],
          subState: { define: { at: 100, mastery: 80 } }
        }
      }
    },
    {
      schemaVersion: 2,
      values: { 'tb-adaptive-mastery-v1': { version: 1, exams: {} } },
      resets: { 'mastery-exam:cssbb': 150 }
    }
  ]);

  assert.equal(result.schemaVersion, 2);
  assert.equal(result.resets['mastery-exam:cssbb'], 150);
  assert.equal(Object.hasOwn(result.values['tb-adaptive-mastery-v1'].exams, 'cssbb'), false);
  assert.equal(Object.hasOwn(result.values, 'tb-adaptive-cssbb'), false);
  dom.window.close();
});

test('a reset marker preserves only adaptive activity recorded after the reset', () => {
  const dom = load();
  const result = dom.window.__TBAccountSync.mergePayloads([
    { schemaVersion: 2, values: {}, resets: { 'mastery-exam:cssbb': 150 } },
    {
      schemaVersion: 1,
      values: {
        'tb-adaptive-mastery-v1': {
          version: 1,
          exams: {
            cssbb: {
              questions: {
                mixed: {
                  history: [{ at: 100, status: 'incorrect' }, { at: 200, status: 'correct' }],
                  lastSeenAt: 200
                },
                old: { history: [{ at: 100, status: 'correct' }], lastSeenAt: 100 }
              },
              attempts: [{ id: 'old-attempt', at: 100 }, { id: 'new-attempt', at: 200 }],
              sessions: [{ id: 'old-session', startedAt: 100 }, { id: 'new-session', startedAt: 200 }]
            }
          }
        },
        'tb-adaptive-cssbb': {
          attempts: 2,
          history: [{ at: 100, readiness: 50 }, { at: 200, readiness: 75 }],
          subState: { old: { at: 100 }, fresh: { at: 200 } }
        }
      }
    }
  ]);
  const exam = result.values['tb-adaptive-mastery-v1'].exams.cssbb;

  assert.deepEqual(Array.from(exam.attempts, item => item.id), ['new-attempt']);
  assert.deepEqual(Array.from(exam.sessions, item => item.id), ['new-session']);
  assert.deepEqual(Object.keys(exam.questions), ['mixed']);
  assert.equal(exam.questions.mixed.attempts, 1);
  assert.equal(exam.questions.mixed.correct, 1);
  assert.equal(exam.questions.mixed.incorrect, 0);
  assert.deepEqual(Array.from(result.values['tb-adaptive-cssbb'].history, item => item.at), [200]);
  assert.deepEqual(Object.keys(result.values['tb-adaptive-cssbb'].subState), ['fresh']);
  dom.window.close();
});

test('a reset discards an indivisible pre-reset baseline and rebuilds only from post-reset mastery evidence', () => {
  const dom = load();
  const result = dom.window.__TBAccountSync.mergePayloads([{
    schemaVersion: 2,
    resets: { 'mastery-exam:cssbb': 250 },
    values: {
      'tb-adaptive-mastery-v1': {
        version: 1,
        exams: {
          cssbb: {
            attempts: [], sessions: [], questions: {
              q1: {
                masteryBaseline: {
                  at: 100, firstSeenAt: 10, attempts: 20, correct: 12, incorrect: 8, unanswered: 0,
                  streak: 0, lastSeenAt: 100, lastStatus: 'incorrect'
                },
                masteryHistory: [
                  { id: 'before-reset', at: 200, status: 'incorrect' },
                  { id: 'after-reset', at: 300, status: 'correct' }
                ],
                history: [
                  { id: 'before-reset', at: 200, status: 'incorrect' },
                  { id: 'after-reset', at: 300, status: 'correct' }
                ],
                lastSeenAt: 300
              }
            }
          }
        }
      }
    }
  }]);
  const state = result.values['tb-adaptive-mastery-v1'].exams.cssbb.questions.q1;
  assert.equal(state.masteryBaseline.attempts, 0);
  assert.deepEqual(Array.from(state.masteryHistory, entry => entry.id), ['after-reset']);
  assert.equal(state.attempts, 1);
  assert.equal(state.correct, 1);
  assert.equal(state.incorrect, 0);
  dom.window.close();
});

test('a signed-out reset does not create an account-scoped deletion marker', async () => {
  const dom = load();
  const result = await dom.window.__TBAccountSync.resetAdaptiveExam('cssbb');
  assert.equal(result.skipped, true);
  assert.deepEqual(Object.keys(dom.window.__TBAccountSync.localPayload().resets), []);
  dom.window.close();
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
  assert.match(source, /if \(accountSwitched\) reloadPage\(\)/);
  assert.match(source, /else if \(changed\) requestProgressRefresh\(\)/);
  assert.match(source, /new MutationObserver\(flushProgressRefresh\)/);
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

test('reset adaptive data converges across devices without stale progress returning', async () => {
  const service = fakeProgressService();
  const a = syncedDevice(service, 'user-1', 'q1');
  const b = syncedDevice(service, 'user-1', 'q2');

  await a.window.__TBAccountSync.sync('seed-a');
  await b.window.__TBAccountSync.sync('seed-b');
  await a.window.__TBAccountSync.sync('converge-before-reset');
  await clearAdaptiveExam(a);
  await b.window.__TBAccountSync.sync('receive-reset');
  await a.window.__TBAccountSync.sync('verify-reset');

  for (const dom of [a, b]) {
    const stored = JSON.parse(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
    assert.equal(Object.hasOwn(stored.exams, 'cssbb'), false);
    assert.ok(dom.window.__TBAccountSync.localPayload().resets['mastery-exam:cssbb'] > 0);
  }

  a.window.close(); b.window.close();
});

test('an offline adaptive reset syncs later and still defeats stale remote data', async () => {
  const service = fakeProgressService();
  const a = syncedDevice(service, 'user-1', 'q1');
  const b = syncedDevice(service, 'user-1', 'q2');

  await a.window.__TBAccountSync.sync('seed-a');
  await b.window.__TBAccountSync.sync('seed-b');
  Object.defineProperty(a.window.navigator, 'onLine', { configurable: true, value: false });
  const offlineResult = await clearAdaptiveExam(a);
  assert.equal(offlineResult.skipped, true);
  assert.ok(a.window.__TBAccountSync.localPayload().resets['mastery-exam:cssbb'] > 0);

  Object.defineProperty(a.window.navigator, 'onLine', { configurable: true, value: true });
  await a.window.__TBAccountSync.sync('back-online');
  await b.window.__TBAccountSync.sync('receive-offline-reset');
  await a.window.__TBAccountSync.sync('verify-offline-reset');

  for (const dom of [a, b]) {
    const stored = JSON.parse(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
    assert.equal(Object.hasOwn(stored.exams, 'cssbb'), false);
  }

  a.window.close(); b.window.close();
});

test('an adaptive reset recorded during an in-flight server read wins the merge', async () => {
  const selectResult = deferred();
  const dom = syncedDevice(fakeProgressService(), 'user-1', 'q1');
  let uploadedPayload = null;
  const client = {
    from() {
      return {
        select() { return { order() { return selectResult.promise; } }; },
        upsert(row) { uploadedPayload = JSON.parse(JSON.stringify(row.payload)); return Promise.resolve({ error: null }); }
      };
    }
  };
  dom.window.UpskillAuth = { getClient: () => client, getUser: () => ({ id: 'user-1' }) };
  const pending = dom.window.__TBAccountSync.sync('in-flight-reset');
  await Promise.resolve();
  const resetResult = await clearAdaptiveExam(dom);
  assert.equal(resetResult.queued, true);
  selectResult.resolve({
    error: null,
    data: [{
      device_id: 'stale-device',
      updated_at: new Date().toISOString(),
      payload: {
        schemaVersion: 1,
        values: {
          'tb-adaptive-mastery-v1': {
            version: 1,
            exams: {
              cssbb: {
                questions: { stale: { history: [{ at: 1, status: 'correct' }], lastSeenAt: 1 } },
                attempts: [],
                sessions: []
              }
            }
          }
        }
      }
    }]
  });
  await pending;
  await new Promise(resolve => setTimeout(resolve, 0));

  const stored = JSON.parse(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
  assert.equal(Object.hasOwn(stored.exams, 'cssbb'), false);
  assert.ok(uploadedPayload.resets['mastery-exam:cssbb'] > 0);
  assert.equal(Object.hasOwn(uploadedPayload.values['tb-adaptive-mastery-v1'].exams, 'cssbb'), false);
  dom.window.close();
});

test('an adaptive reset marker cannot cross account boundaries after a user switch', async () => {
  const service = fakeProgressService();
  const b = syncedDevice(service, 'user-b', 'account-b-question');
  await b.window.__TBAccountSync.sync('seed-account-b');

  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', virtualConsole
  });
  let userId = 'user-a';
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({
    version: 1,
    exams: { cssbb: { questions: {}, attempts: [], sessions: [] } }
  }));
  dom.window.eval(source);
  dom.window.UpskillAuth = {
    getClient: () => service.clientFor(userId),
    getUser: () => ({ id: userId })
  };
  await dom.window.__TBAccountSync.sync('seed-account-a');
  await dom.window.__TBAccountSync.resetAdaptiveExam('cssbb');
  assert.ok(dom.window.__TBAccountSync.localPayload().resets['mastery-exam:cssbb'] > 0);

  userId = 'user-b';
  await dom.window.__TBAccountSync.sync('switch-to-account-b');
  const stored = JSON.parse(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
  assert.deepEqual(Object.keys(stored.exams.cssbb.questions), ['account-b-question']);
  assert.deepEqual(Object.keys(dom.window.__TBAccountSync.localPayload().resets), []);

  dom.window.close(); b.window.close();
});
