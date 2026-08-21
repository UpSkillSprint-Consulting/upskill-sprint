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
test('an offline older answer survives after another device compacts its mastery evidence', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  const retained = [];
  for (let at = 101; at <= 600; at += 1) {
    retained.push({ id: 'device-a-' + at, deviceId: 'device-a', sequence: at, at, status: at % 2 ? 'correct' : 'incorrect' });
  }
  const compacted = {
    version: 1,
    exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
      masteryBaseline: {
        at: 100, firstSeenAt: 1, attempts: 100, correct: 50, incorrect: 50, unanswered: 0,
        streak: 0, lastSeenAt: 100, lastStatus: 'incorrect',
        legacy: { at: 0, firstSeenAt: 0, attempts: 0, correct: 0, incorrect: 0, unanswered: 0, streak: 0, lastSeenAt: 0, lastStatus: 'new' },
        devices: {
          'device-a': { sequence: 100, at: 100, firstSeenAt: 1, attempts: 100, correct: 50, incorrect: 50, unanswered: 0, streak: 0, lastSeenAt: 100, lastStatus: 'incorrect' }
        }
      },
      masteryHistory: retained,
      history: retained,
      lastSeenAt: 600
    } } } }
  };
  const offlineEvent = { id: 'device-b-1', deviceId: 'device-b', sequence: 1, at: 50, status: 'incorrect' };
  const offline = {
    version: 1,
    exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
      masteryBaseline: { at: 0, firstSeenAt: 0, attempts: 0, correct: 0, incorrect: 0, unanswered: 0, streak: 0, lastSeenAt: 0, lastStatus: 'new', legacy: {}, devices: {} },
      masteryHistory: [offlineEvent], history: [offlineEvent], lastSeenAt: 50
    } } } }
  };

  const state = merge(compacted, offline).exams.cssbb.questions.q1;

  assert.equal(state.attempts, 601, 'the compacted aggregate and the previously unseen offline event are both counted');
  assert.equal(state.correct, 300);
  assert.equal(state.incorrect, 301);
  assert.ok(state.masteryHistory.some(entry => entry.id === 'device-b-1'), 'the offline answer remains explicit in its own bounded stream tail');
  dom.window.close();
});
test('compacted per-device components merge without dropping or double-counting evidence', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  function component(sequence, correct, incorrect, lastSeenAt) {
    return { sequence, at: lastSeenAt, firstSeenAt: 1, attempts: correct + incorrect, correct, incorrect, unanswered: 0, streak: 0, lastSeenAt, lastStatus: 'incorrect' };
  }
  function payload(devices, history) {
    return { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
      masteryBaseline: { legacy: {}, devices }, masteryHistory: history || [], history: history || [], lastSeenAt: 500
    } } } } };
  }
  const left = payload({ 'device-a': component(100, 50, 50, 100) });
  const right = payload({ 'device-b': component(80, 40, 40, 80) });
  const merged = merge(left, right).exams.cssbb.questions.q1;
  assert.equal(merged.attempts, 180);
  assert.equal(merged.correct, 90);
  assert.equal(merged.incorrect, 90);
  assert.deepEqual(Object.keys(merged.masteryBaseline.devices), ['device-a', 'device-b']);

  const alreadyFolded = { id: 'device-a-100', deviceId: 'device-a', sequence: 100, at: 100, status: 'incorrect' };
  const duplicate = merge(left, payload({}, [alreadyFolded])).exams.cssbb.questions.q1;
  assert.equal(duplicate.attempts, 100, 'an event at or below a device watermark is already represented in that component');
  assert.equal(duplicate.masteryHistory.length, 0);
  dom.window.close();
});
test('three 700-answer devices converge under different merge orders and repeated syncs', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  function status(sequence) { return sequence % 3 === 0 ? 'correct' : sequence % 3 === 1 ? 'incorrect' : 'unanswered'; }
  function devicePayload(device, timestampFor) {
    const counts = { correct: 0, incorrect: 0, unanswered: 0 };
    for (let sequence = 1; sequence <= 200; sequence += 1) counts[status(sequence)] += 1;
    const component = {
      sequence: 200, at: timestampFor(200), firstSeenAt: Math.min(timestampFor(1), timestampFor(200)), attempts: 200,
      correct: counts.correct, incorrect: counts.incorrect, unanswered: counts.unanswered,
      streak: 0, lastSeenAt: timestampFor(200), lastStatus: status(200)
    };
    const history = [];
    for (let sequence = 201; sequence <= 700; sequence += 1) {
      history.push({ id: device + '-' + sequence, deviceId: device, sequence, at: timestampFor(sequence), status: status(sequence), priorAttempts: sequence - 1 });
    }
    return { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
      masteryBaseline: { legacy: {}, devices: { [device]: component } }, masteryHistory: history, history, lastSeenAt: timestampFor(700)
    } } } } };
  }
  const a = devicePayload('device-a', sequence => 1000 + sequence);
  const b = devicePayload('device-b', sequence => 4000 - sequence);
  const c = devicePayload('device-c', sequence => 7000 + sequence);
  const leftFirst = merge(merge(a, b), c);
  const rightFirst = merge(a, merge(b, c));
  for (const value of [leftFirst, rightFirst]) {
    const state = value.exams.cssbb.questions.q1;
    assert.equal(state.attempts, 2100);
    assert.equal(state.correct, 699);
    assert.equal(state.incorrect, 702);
    assert.equal(state.unanswered, 699);
    assert.equal(state.masteryHistory.length, 1500, 'each of the three streams retains its own bounded 500-event tail');
  }
  assert.deepEqual(
    JSON.parse(JSON.stringify(leftFirst)),
    JSON.parse(JSON.stringify(rightFirst)),
    'alternate merge grouping produces the same compacted representation, not only the same counters'
  );
  let repeated = leftFirst;
  for (let index = 0; index < 25; index += 1) repeated = merge(repeated, [a, b, c][index % 3]);
  assert.equal(repeated.exams.cssbb.questions.q1.attempts, 2100);
  assert.equal(repeated.exams.cssbb.questions.q1.masteryHistory.length, 1500);
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

test('a reset keeps only compacted device components created entirely after the reset', () => {
  const dom = load();
  const result = dom.window.__TBAccountSync.mergePayloads([{
    schemaVersion: 2,
    resets: { 'mastery-exam:cssbb': 250 },
    values: {
      'tb-adaptive-mastery-v1': {
        version: 1,
        exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
          attempts: 25, correct: 15, incorrect: 10, unanswered: 0, lastSeenAt: 400,
          masteryBaseline: {
            legacy: { at: 100, firstSeenAt: 0, attempts: 20, correct: 12, incorrect: 8, unanswered: 0, streak: 0, lastSeenAt: 100, lastStatus: 'incorrect' },
            devices: {
              'device-a': { sequence: 5, at: 400, firstSeenAt: 300, attempts: 5, correct: 3, incorrect: 2, unanswered: 0, streak: 0, lastSeenAt: 400, lastStatus: 'incorrect' }
            }
          },
          masteryHistory: [], history: []
        } } } }
      }
    }
  }]);
  const state = result.values['tb-adaptive-mastery-v1'].exams.cssbb.questions.q1;
  assert.equal(state.attempts, 5);
  assert.equal(state.correct, 3);
  assert.equal(state.incorrect, 2);
  assert.equal(Object.hasOwn(state.masteryBaseline.devices, 'device-a'), true);
  assert.equal(state.masteryBaseline.legacy.attempts, 0);
  dom.window.close();
});

test('a post-reset answer from the same browser is not suppressed by its stale pre-reset watermark', () => {
  const dom = load();
  const postResetEvents = [];
  for (let sequence = 1; sequence <= 50; sequence += 1) {
    postResetEvents.push({
      id: 'new-stream-' + sequence, deviceId: 'device-a', streamId: 'stream-after-reset', sequence,
      at: 300 + sequence, status: 'correct'
    });
  }
  const result = dom.window.__TBAccountSync.mergePayloads([
    {
      schemaVersion: 2,
      resets: { 'mastery-exam:cssbb': 250 },
      values: { 'tb-adaptive-mastery-v1': { version: 1, exams: { cssbb: {
        attempts: [], sessions: [], questions: { q1: {
          masteryBaseline: { legacy: {}, devices: {} }, masteryHistory: postResetEvents, history: postResetEvents, lastSeenAt: 350
        } }
      } } } }
    },
    {
      schemaVersion: 1,
      values: { 'tb-adaptive-mastery-v1': { version: 1, exams: { cssbb: {
        attempts: [], sessions: [], questions: { q1: {
          attempts: 100, correct: 50, incorrect: 50, unanswered: 0, lastSeenAt: 200,
          masteryBaseline: {
            legacy: {},
            devices: {
              'device-a': { deviceId: 'device-a', streamId: 'device-a', sequence: 100, at: 200, firstSeenAt: 1, attempts: 100, correct: 50, incorrect: 50, unanswered: 0, streak: 0, lastSeenAt: 200, lastStatus: 'incorrect' }
            }
          },
          masteryHistory: [], history: []
        } }
      } } } }
    }
  ]);
  const state = result.values['tb-adaptive-mastery-v1'].exams.cssbb.questions.q1;
  assert.equal(state.attempts, 50);
  assert.equal(state.correct, 50);
  assert.equal(state.incorrect, 0);
  assert.equal(state.masteryHistory[0].streamId, 'stream-after-reset');
  dom.window.close();
});

test('a post-reset answer survives when the device clock moves behind the reset timestamp', () => {
  const dom = load();
  const event = {
    id: 'clock-behind-1', deviceId: 'device-a', streamId: 'clock-behind-stream', sequence: 1,
    resetAt: 250, at: 100, status: 'correct'
  };
  const result = dom.window.__TBAccountSync.mergePayloads([{
    schemaVersion: 2,
    resets: { 'mastery-exam:cssbb': 250 },
    values: { 'tb-adaptive-mastery-v1': { version: 1, exams: { cssbb: {
      attempts: [], sessions: [], questions: { q1: {
        masteryBaseline: { legacy: {}, devices: {} }, masteryHistory: [event], history: [event], lastSeenAt: 100
      } }
    } } } }
  }]);
  const state = result.values['tb-adaptive-mastery-v1'].exams.cssbb.questions.q1;
  assert.equal(state.attempts, 1);
  assert.equal(state.correct, 1);
  assert.equal(state.masteryHistory[0].resetAt, 250);
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

test('same-timestamp question schedule metadata converges regardless of merge direction', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  function payload(question) {
    return { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: question } } } };
  }
  const left = payload({
    ease: 1.9, intervalDays: 1, dueAt: 200,
    history: [{ id: 'answer-a', at: 100, status: 'incorrect' }], lastSeenAt: 100
  });
  const right = payload({
    ease: 2.4, intervalDays: 4, dueAt: 500,
    history: [{ id: 'answer-b', at: 100, status: 'correct' }], lastSeenAt: 100
  });

  const forward = merge(left, right).exams.cssbb.questions.q1;
  const reverse = merge(right, left).exams.cssbb.questions.q1;
  assert.deepEqual(
    { ease: forward.ease, intervalDays: forward.intervalDays, dueAt: forward.dueAt },
    { ease: reverse.ease, intervalDays: reverse.intervalDays, dueAt: reverse.dueAt }
  );
  dom.window.close();
});

test('same-timestamp question schedule metadata converges across merge grouping', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  function payload(id, ease, intervalDays, dueAt, status) {
    return { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
      ease, intervalDays, dueAt,
      history: [{ id: 'answer-' + id, at: 100, status }], lastSeenAt: 100
    } } } } };
  }
  const a = payload('a', 1.8, 1, 200, 'incorrect');
  const b = payload('b', 2.2, 3, 400, 'correct');
  const c = payload('c', 2.5, 5, 600, 'correct');
  const leftGrouped = merge(merge(a, b), c).exams.cssbb.questions.q1;
  const rightGrouped = merge(a, merge(b, c)).exams.cssbb.questions.q1;
  assert.deepEqual(
    { ease: leftGrouped.ease, intervalDays: leftGrouped.intervalDays, dueAt: leftGrouped.dueAt },
    { ease: rightGrouped.ease, intervalDays: rightGrouped.intervalDays, dueAt: rightGrouped.dueAt }
  );
  dom.window.close();
});

test('same-timestamp bounded attempt and session lists converge at their caps', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  function items(prefix, count, field) {
    return Array.from({ length: count }, (_, index) => ({ id: prefix + index, [field]: 100 }));
  }
  function payload(prefix) {
    return { version: 1, exams: { cssbb: {
      attempts: items(prefix + '-attempt-', 35, 'startedAt'),
      sessions: items(prefix + '-session-', 35, 'startedAt'),
      questions: {}
    } } };
  }
  const left = payload('left'), right = payload('right');
  const forward = merge(left, right).exams.cssbb;
  const reverse = merge(right, left).exams.cssbb;

  assert.deepEqual(Array.from(forward.attempts, item => item.id), Array.from(reverse.attempts, item => item.id));
  assert.deepEqual(Array.from(forward.sessions, item => item.id), Array.from(reverse.sessions, item => item.id));

  const historyLeft = { schemaVersion: 2, values: { 'tb-attempt-history-v3': { attempts: items('left-history-', 30, 'startedAt') } } };
  const historyRight = { schemaVersion: 2, values: { 'tb-attempt-history-v3': { attempts: items('right-history-', 30, 'startedAt') } } };
  const historyForward = dom.window.__TBAccountSync.mergePayloads([historyLeft, historyRight]);
  const historyReverse = dom.window.__TBAccountSync.mergePayloads([historyRight, historyLeft]);
  assert.deepEqual(
    Array.from(historyForward.values['tb-attempt-history-v3'].attempts, item => item.id),
    Array.from(historyReverse.values['tb-attempt-history-v3'].attempts, item => item.id)
  );
  dom.window.close();
});

test('folded legacy evidence IDs converge when their bounded union exceeds the cap', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  function payload(prefix) {
    return { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
      masteryBaseline: {
        legacy: {}, devices: {},
        foldedIds: Array.from({ length: 300 }, (_, index) => prefix + index)
      },
      masteryHistory: [], history: [], lastSeenAt: 0
    } } } } };
  }
  const left = payload('left-'), right = payload('right-');
  const forward = merge(left, right).exams.cssbb.questions.q1.masteryBaseline.foldedIds;
  const reverse = merge(right, left).exams.cssbb.questions.q1.masteryBaseline.foldedIds;
  assert.deepEqual(Array.from(forward), Array.from(reverse));
  dom.window.close();
});

test('equal-ranked legacy snapshots and same-ID attempts converge deterministically', () => {
  const dom = load(), mergePayloads = dom.window.__TBAccountSync.mergePayloads;
  const legacyA = { schemaVersion: 2, values: { 'tb-adaptive-cssbb': { attempts: 4, lastReadiness: 80, lastAt: 100, mode: 'a' } } };
  const legacyB = { schemaVersion: 2, values: { 'tb-adaptive-cssbb': { attempts: 4, lastReadiness: 80, lastAt: 100, mode: 'b' } } };
  assert.deepEqual(
    mergePayloads([legacyA, legacyB]).values['tb-adaptive-cssbb'],
    mergePayloads([legacyB, legacyA]).values['tb-adaptive-cssbb']
  );

  const attemptA = { schemaVersion: 2, values: { 'tb-attempt-history-v3': { attempts: [{ id: 'same', startedAt: 100, status: 'a' }] } } };
  const attemptB = { schemaVersion: 2, values: { 'tb-attempt-history-v3': { attempts: [{ id: 'same', startedAt: 100, status: 'b' }] } } };
  assert.deepEqual(
    mergePayloads([attemptA, attemptB]).values['tb-attempt-history-v3'],
    mergePayloads([attemptB, attemptA]).values['tb-attempt-history-v3']
  );
  dom.window.close();
});

test('attempt-feedback object maps merge every device record and converge', () => {
  const dom = load(), mergePayloads = dom.window.__TBAccountSync.mergePayloads;
  const left = { schemaVersion: 2, values: { 'tb-attempt-feedback-v2': { attempts: {
    left: { startedAt: 100, completedAt: 200, errors: { q1: 'concept' }, times: { q1: 1000 } },
    shared: { startedAt: 300, completedAt: 350, errors: { q2: 'guess' }, times: { q2: 500 } }
  } } } };
  const right = { schemaVersion: 2, values: { 'tb-attempt-feedback-v2': { attempts: {
    right: { startedAt: 400, completedAt: 500, errors: { q3: 'calculation' }, times: { q3: 1500 } },
    shared: { startedAt: 300, completedAt: 450, errors: { q2: 'concept', q4: 'guess' }, times: { q2: 800, q4: 600 } }
  } } } };

  const forward = mergePayloads([left, right]).values['tb-attempt-feedback-v2'];
  const reverse = mergePayloads([right, left]).values['tb-attempt-feedback-v2'];
  assert.deepEqual(forward, reverse);
  assert.deepEqual(Object.keys(forward.attempts), ['left', 'right', 'shared']);
  assert.equal(forward.attempts.shared.completedAt, 450);
  assert.deepEqual(JSON.parse(JSON.stringify(forward.attempts.shared.errors)), { q2: 'concept', q4: 'guess' });
  assert.deepEqual(JSON.parse(JSON.stringify(forward.attempts.shared.times)), { q2: 800, q4: 600 });
  dom.window.close();
});

test('compaction never advances a stream watermark across a missing sequence', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  function payload(events) {
    return { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
      masteryBaseline: { legacy: {}, devices: {} },
      masteryHistory: events,
      history: events,
      lastSeenAt: Math.max.apply(Math, events.map(event => event.at))
    } } } } };
  }
  const gapped = Array.from({ length: 501 }, (_, index) => {
    const sequence = index + 2;
    return { id: 'stream-a-' + sequence, deviceId: 'device-a', streamId: 'stream-a', sequence, at: sequence, status: 'correct' };
  });
  const missingFirst = [{
    id: 'stream-a-1', deviceId: 'device-a', streamId: 'stream-a', sequence: 1, at: 1, status: 'incorrect'
  }];

  const state = merge(payload(gapped), payload(missingFirst)).exams.cssbb.questions.q1;
  assert.equal(state.attempts, 502, 'the late sequence 1 answer is counted instead of hidden behind a sequence 2 watermark');
  assert.equal(state.correct, 501);
  assert.equal(state.incorrect, 1);
  assert.equal(state.masteryBaseline.devices['stream-a'].sequence, 2, 'compaction resumes only after sequences 1 and 2 form a verified prefix');
  assert.equal(state.masteryBaseline.devices['stream-a'].attempts, 2);
  assert.equal(state.masteryHistory.length, 500);
  dom.window.close();
});

test('malformed list fields and question snapshots cannot abort a valid progress merge', () => {
  const dom = load(), mergePayloads = dom.window.__TBAccountSync.mergePayloads;
  const corrupt = { schemaVersion: 2, values: {
    'tb-attempt-history-v3': { attempts: { not: 'an array' } },
    'tb-adaptive-mastery-v1': { version: 1, exams: { cssbb: {
      attempts: { not: 'an array' }, sessions: 'not-an-array',
      questions: { q1: 'damaged-state', q2: ['also-damaged'] }
    } } }
  } };
  const goodEvent = { id: 'good-answer', at: 200, status: 'correct' };
  const good = { schemaVersion: 2, values: {
    'tb-attempt-history-v3': { attempts: [{ id: 'good-attempt', startedAt: 200 }] },
    'tb-adaptive-mastery-v1': { version: 1, exams: { cssbb: {
      attempts: [{ id: 'good-summary', at: 200 }], sessions: [{ id: 'good-session', startedAt: 200 }],
      questions: { q1: { history: [goodEvent], lastSeenAt: 200 } }
    } } }
  } };

  const result = mergePayloads([corrupt, good]);
  const exam = result.values['tb-adaptive-mastery-v1'].exams.cssbb;
  assert.deepEqual(Array.from(result.values['tb-attempt-history-v3'].attempts, item => item.id), ['good-attempt']);
  assert.deepEqual(Array.from(exam.attempts, item => item.id), ['good-summary']);
  assert.deepEqual(Array.from(exam.sessions, item => item.id), ['good-session']);
  assert.equal(exam.questions.q1.attempts, 1);
  assert.equal(Object.hasOwn(exam.questions, 'q2'), false, 'an invalid question snapshot is ignored instead of becoming empty progress');
  dom.window.close();
});

test('identical mastery evidence produces the same persisted score on different sync dates', () => {
  const early = load(), late = load();
  const answeredAt = Date.UTC(2026, 0, 1);
  early.window.Date.now = () => answeredAt;
  late.window.Date.now = () => answeredAt + 45 * 86400000;
  const event = { id: 'answer-1', at: answeredAt, status: 'correct' };
  const payload = { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
    history: [event], lastSeenAt: answeredAt
  } } } } };

  const earlyState = early.window.__TBAccountSync.mergeMastery(payload, { version: 1, exams: {} }).exams.cssbb.questions.q1;
  const lateState = late.window.__TBAccountSync.mergeMastery(payload, { version: 1, exams: {} }).exams.cssbb.questions.q1;
  assert.equal(earlyState.mastery, lateState.mastery, 'wall-clock time must not change the persisted merge result');
  early.window.close(); late.window.close();
});

test('remote payload values cannot write outside the tracked progress-key allowlist', () => {
  const dom = load(), mergePayloads = dom.window.__TBAccountSync.mergePayloads;
  const result = mergePayloads([{ schemaVersion: 2, values: {
    'unrelated-site-setting': { poisoned: true },
    'tb-account-sync-user-v1': 'different-user',
    'tb-attempt-history-v3': { attempts: [{ id: 'allowed', startedAt: 100 }] }
  } }]);

  assert.deepEqual(Object.keys(result.values), ['tb-attempt-history-v3']);
  assert.equal(result.values['tb-attempt-history-v3'].attempts[0].id, 'allowed');
  dom.window.close();
});

test('a newer feedback snapshot can clear stale nested classifications and times', () => {
  const dom = load(), mergePayloads = dom.window.__TBAccountSync.mergePayloads;
  const older = { schemaVersion: 2, values: { 'tb-attempt-feedback-v2': { attempts: { shared: {
    startedAt: 100, completedAt: 200, updatedAt: 200,
    errors: { q1: 'guess' }, times: { q1: 1200 }
  } } } } };
  const newer = { schemaVersion: 2, values: { 'tb-attempt-feedback-v2': { attempts: { shared: {
    startedAt: 100, completedAt: 200, updatedAt: 300,
    errors: {}, times: {}
  } } } } };

  const result = mergePayloads([newer, older]).values['tb-attempt-feedback-v2'].attempts.shared;
  assert.deepEqual(JSON.parse(JSON.stringify(result.errors)), {});
  assert.deepEqual(JSON.parse(JSON.stringify(result.times)), {});
  assert.equal(result.updatedAt, 300);
  dom.window.close();
});

test('disjoint legacy evidence ledgers never collapse into one unverifiable aggregate', () => {
  const dom = load(), merge = dom.window.__TBAccountSync.mergeMastery;
  function payload(prefix) {
    const events = Array.from({ length: 600 }, (_, index) => ({
      id: prefix + index, at: 1000 + index, status: index % 2 ? 'correct' : 'incorrect'
    }));
    return { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: { q1: {
      masteryBaseline: { legacy: {}, devices: {} }, masteryHistory: events, history: events, lastSeenAt: 1599
    } } } } };
  }

  const left = payload('left-'), right = payload('right-');
  const forward = merge(left, right).exams.cssbb.questions.q1;
  const reverse = merge(right, left).exams.cssbb.questions.q1;
  assert.equal(forward.attempts, 1200);
  assert.equal(forward.correct, 600);
  assert.equal(forward.incorrect, 600);
  assert.equal(forward.masteryHistory.length, 1200, 'legacy events remain explicit because they have no merge-safe stream watermark');
  assert.deepEqual(JSON.parse(JSON.stringify(forward)), JSON.parse(JSON.stringify(reverse)));
  dom.window.close();
});

test('three-way feedback merges cannot resurrect an omitted older nested map', () => {
  const dom = load(), mergePayloads = dom.window.__TBAccountSync.mergePayloads;
  function payload(record) {
    return { schemaVersion: 2, values: { 'tb-attempt-feedback-v2': { attempts: { shared: record } } } };
  }
  const a = payload({
    id: 'shared', updatedAt: 3, completedAt: 4, label: 'latest-a',
    errors: { q2: 'concept' }, times: { q1: 3000 }, records: { q2: 'keep' }
  });
  const b = payload({
    id: 'shared', updatedAt: 4, completedAt: 0, label: 'latest-b',
    errors: { q0: 'guess' }, times: { q1: 3000 }
  });
  const older = payload({
    id: 'shared', updatedAt: 0, completedAt: 0, label: 'old',
    times: { q2: 3000 }, records: { q1: 'must-not-return' }
  });

  const leftGrouped = mergePayloads([mergePayloads([a, b]), older]);
  const rightGrouped = mergePayloads([a, mergePayloads([b, older])]);
  assert.deepEqual(JSON.parse(JSON.stringify(leftGrouped)), JSON.parse(JSON.stringify(rightGrouped)));
  assert.deepEqual(
    JSON.parse(JSON.stringify(leftGrouped.values['tb-attempt-feedback-v2'].attempts.shared.records)),
    { q2: 'keep' }
  );
  dom.window.close();
});

test('distinct no-ID records survive even when their former 32-bit identities collide', () => {
  const dom = load(), mergePayloads = dom.window.__TBAccountSync.mergePayloads;
  /* These canonical records both hash to 1lsms3h under the previous FNV-1a
     deduplication key, despite containing different timestamps and statuses. */
  const left = { schemaVersion: 2, values: { 'tb-attempt-history-v3': { attempts: [
    { startedAt: 19150, status: 'legacy-19150' }
  ] } } };
  const right = { schemaVersion: 2, values: { 'tb-attempt-history-v3': { attempts: [
    { startedAt: 69939, status: 'legacy-69939' }
  ] } } };

  const result = mergePayloads([left, right]).values['tb-attempt-history-v3'];
  assert.equal(result.attempts.length, 2);
  assert.deepEqual(Array.from(result.attempts, item => item.status), ['legacy-19150', 'legacy-69939']);
  dom.window.close();
});

test('reserved JSON record keys remain own data properties instead of mutating merge-map prototypes', () => {
  const dom = load(), mergePayloads = dom.window.__TBAccountSync.mergePayloads;
  const ordinary = { schemaVersion: 2, values: {
    'tb-attempt-feedback-v2': { attempts: { normal: { id: 'normal', updatedAt: 1 } } },
    'tb-adaptive-mastery-v1': { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions: {} } } },
    'tb-adaptive-cssbb': { attempts: [{ id: 'normal' }], lastReadiness: 1 }
  } };
  const reserved = JSON.parse('{"schemaVersion":2,"values":{' +
    '"tb-attempt-feedback-v2":{"attempts":{"__proto__":{"id":"__proto__","updatedAt":5,"errors":{"__proto__":"classification"}}}},' +
    '"tb-adaptive-mastery-v1":{"version":1,"exams":{"__proto__":{"attempts":[],"sessions":[],"questions":{"__proto__":{"history":[],"lastSeenAt":0}}}}},' +
    '"tb-adaptive-cssbb":{"attempts":[{"id":"reserved"}],"lastReadiness":2,"__proto__":{"polluted":true}}' +
  '}}');

  const result = mergePayloads([ordinary, reserved]).values;
  const attempts = result['tb-attempt-feedback-v2'].attempts;
  assert.equal(Object.prototype.hasOwnProperty.call(attempts, '__proto__'), true);
  assert.equal(Object.getPrototypeOf(attempts).id, undefined);
  assert.equal(Object.prototype.hasOwnProperty.call(attempts.__proto__.errors, '__proto__'), true);
  assert.equal(attempts.__proto__.errors.__proto__, 'classification');

  const exams = result['tb-adaptive-mastery-v1'].exams;
  assert.equal(Object.prototype.hasOwnProperty.call(exams, '__proto__'), true);
  assert.equal(Object.getPrototypeOf(exams).questions, undefined);
  assert.equal(Object.prototype.hasOwnProperty.call(exams.__proto__.questions, '__proto__'), true);

  const legacy = result['tb-adaptive-cssbb'];
  assert.equal(Object.prototype.hasOwnProperty.call(legacy, '__proto__'), true);
  assert.equal(Object.getPrototypeOf(legacy).polluted, undefined);
  assert.equal(legacy.__proto__.polluted, true);
  dom.window.close();
});
