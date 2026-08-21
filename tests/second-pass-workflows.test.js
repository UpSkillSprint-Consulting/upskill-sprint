'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.resolve(__dirname, '..');
const authSource = fs.readFileSync(path.join(root, 'auth.js'), 'utf8');
const syncSource = fs.readFileSync(path.join(root, 'test-bank-account-sync.js'), 'utf8');
const flush = () => new Promise(resolve => setTimeout(resolve, 0));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};

function authRaceRuntime(sessionPromise, immediateSession) {
  const user = { id: 'user-1', email: 'learner@example.com' };
  const client = {
    auth: {
      onAuthStateChange(callback) {
        client.auth.callback = callback;
        if (immediateSession) callback('INITIAL_SESSION', { user });
      },
      getSession() { return sessionPromise; },
      signUp() { return Promise.resolve({ data: {}, error: null }); },
      signInWithPassword() { return Promise.resolve({ data: { user }, error: null }); },
      signOut() { return Promise.resolve({ data: null, error: null }); },
      resetPasswordForEmail() { return Promise.resolve({ data: {}, error: null }); },
      resend() { return Promise.resolve({ data: {}, error: null }); },
      updateUser() { return Promise.resolve({ data: { user }, error: null }); }
    }
  };
  const dom = new JSDOM('<!doctype html><html><head></head><body><header class="site"><a class="header-cta"></a></header></body></html>', {
    url: 'https://upskillsprint.com/sign-in', runScripts: 'outside-only'
  });
  dom.window.UPSKILLSPRINT_SUPABASE_CONFIG = { url: 'https://project.supabase.co', anonKey: 'public-key' };
  dom.window.supabase = { createClient: () => client };
  dom.window.eval(authSource);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return { dom, client, user };
}

test('a rejected stale restoration cannot erase a newer signed-in session', async () => {
  const restore = deferred();
  const { dom, client, user } = authRaceRuntime(restore.promise);
  await flush();
  client.auth.callback('SIGNED_IN', { user });
  restore.reject(new Error('stale network failure'));
  await flush(); await flush();
  assert.equal(dom.window.UpskillAuth.getUser().id, user.id);
  dom.window.close();
});

test('a stale null restoration cannot erase a newer signed-in session', async () => {
  const restore = deferred();
  const { dom, client, user } = authRaceRuntime(restore.promise);
  await flush();
  client.auth.callback('SIGNED_IN', { user });
  restore.resolve({ data: { session: null } });
  await flush(); await flush();
  assert.equal(dom.window.UpskillAuth.getUser().id, user.id);
  dom.window.close();
});

test('a synchronous initial-session event survives a later restoration failure', async () => {
  const restore = deferred();
  const { dom, user } = authRaceRuntime(restore.promise, true);
  restore.reject(new Error('late restoration failure'));
  await flush(); await flush();
  assert.equal(dom.window.UpskillAuth.getUser().id, user.id);
  dom.window.close();
});

function mastery(questionIds) {
  const questions = {};
  questionIds.forEach((id, index) => {
    questions[id] = { history: [{ at: index + 1, status: 'correct' }], lastSeenAt: index + 1 };
  });
  return { version: 1, exams: { cssbb: { attempts: [], sessions: [], questions } } };
}

test('a local answer recorded during a server read is not overwritten', async () => {
  const selectResult = deferred();
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', virtualConsole
  });
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(mastery(['q1'])));
  dom.window.eval(syncSource);
  const client = {
    from() {
      return {
        upsert() { return Promise.resolve({ error: null }); },
        select() { return { order() { return selectResult.promise; } }; }
      };
    }
  };
  dom.window.UpskillAuth = { getClient: () => client, getUser: () => ({ id: 'user-1' }) };
  const pending = dom.window.__TBAccountSync.sync('race-test');
  await flush();
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(mastery(['q1', 'q2'])));
  selectResult.resolve({
    error: null,
    data: [{ device_id: 'remote-device', updated_at: new Date().toISOString(), payload: {
      schemaVersion: 1, values: { 'tb-adaptive-mastery-v1': mastery(['q1']) }
    } }]
  });
  await pending;
  const stored = JSON.parse(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
  assert.equal(Object.hasOwn(stored.exams.cssbb.questions, 'q2'), true);
  dom.window.close();
});

test('newer completed version wins when the same attempt id exists on two devices', () => {
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only'
  });
  dom.window.eval(syncSource);
  const active = { id: 'attempt-1', examId: 'cssbb', startedAt: 10, completedAt: null, errors: {} };
  const completed = { id: 'attempt-1', examId: 'cssbb', startedAt: 10, completedAt: 20, errors: { q1: 'misread' } };
  const merged = dom.window.__TBAccountSync.mergePayloads([
    { schemaVersion: 1, values: { 'tb-attempt-history-v3': { attempts: [active] } } },
    { schemaVersion: 1, values: { 'tb-attempt-history-v3': { attempts: [completed] } } }
  ]);
  const attempt = merged.values['tb-attempt-history-v3'].attempts[0];
  assert.equal(attempt.completedAt, 20);
  assert.equal(attempt.errors.q1, 'misread');
  dom.window.close();
});

test('switching accounts in one browser cannot copy the first account progress', async () => {
  const rows = new Map();
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', virtualConsole
  });
  let currentUser = { id: 'user-a' };
  function clientFor(userId) {
    return {
      from() {
        return {
          upsert(row) {
            assert.equal(row.user_id, userId);
            rows.set(userId + ':' + row.device_id, JSON.parse(JSON.stringify(row)));
            return Promise.resolve({ error: null });
          },
          select() {
            return { order() { return Promise.resolve({
              error: null,
              data: Array.from(rows.values()).filter(row => row.user_id === userId)
            }); } };
          }
        };
      }
    };
  }
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(mastery(['account-a-question'])));
  dom.window.eval(syncSource);
  dom.window.UpskillAuth = {
    getClient: () => clientFor(currentUser.id),
    getUser: () => currentUser
  };
  await dom.window.__TBAccountSync.sync('account-a');

  rows.set('user-b:other-device', {
    user_id: 'user-b', device_id: 'other-device', updated_at: new Date().toISOString(),
    payload: { schemaVersion: 1, values: { 'tb-adaptive-mastery-v1': mastery(['account-b-question']) } }
  });
  currentUser = { id: 'user-b' };
  await dom.window.__TBAccountSync.sync('account-b');

  const stored = JSON.parse(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
  assert.deepEqual(Object.keys(stored.exams.cssbb.questions), ['account-b-question']);
  const bRows = Array.from(rows.values()).filter(row => row.user_id === 'user-b');
  bRows.forEach(row => {
    const questions = row.payload.values['tb-adaptive-mastery-v1'].exams.cssbb.questions;
    assert.equal(Object.hasOwn(questions, 'account-a-question'), false);
  });
  dom.window.close();
});

test('remote polling runs at the configured interval while a device remains open', async () => {
  let clock = 1000;
  let tick = null;
  const rows = new Map();
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', virtualConsole
  });
  dom.window.Date.now = () => clock;
  dom.window.setInterval = callback => { tick = callback; return 1; };
  dom.window.clearInterval = () => {};
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(mastery(['q1'])));
  const client = {
    from() {
      return {
        upsert(row) {
          rows.set(row.device_id, JSON.parse(JSON.stringify(row)));
          return Promise.resolve({ error: null });
        },
        select() {
          return { order() { return Promise.resolve({ error: null, data: Array.from(rows.values()) }); } };
        }
      };
    }
  };
  dom.window.UpskillAuth = {
    getClient: () => client,
    getUser: () => ({ id: 'user-1' }),
    onChange(callback) { callback({ id: 'user-1' }); }
  };
  dom.window.eval(syncSource);
  for (let i = 0; i < 5 && !tick; i += 1) await flush();
  assert.equal(typeof tick, 'function');
  rows.set('other-device', {
    user_id: 'user-1', device_id: 'other-device', updated_at: new Date().toISOString(),
    payload: { schemaVersion: 1, values: { 'tb-adaptive-mastery-v1': mastery(['q2']) } }
  });
  clock += dom.window.__TBAccountSync.REMOTE_POLL_MS;
  tick();
  await flush(); await flush();
  const stored = JSON.parse(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
  assert.deepEqual(Object.keys(stored.exams.cssbb.questions).sort(), ['q1', 'q2']);
  const meta = JSON.parse(dom.window.localStorage.getItem('tb-account-sync-meta-v1'));
  assert.equal(meta.reason, 'remote-poll');
  dom.window.close();
});

test('sign-out clears account progress and the same account restores it from remote', async () => {
  const rows = new Map();
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', virtualConsole
  });
  let currentUser = { id: 'user-1' };
  let authChange;
  const client = {
    from() {
      return {
        upsert(row) {
          rows.set(row.device_id, JSON.parse(JSON.stringify(row)));
          return Promise.resolve({ error: null });
        },
        select() {
          return { order() { return Promise.resolve({ error: null, data: Array.from(rows.values()) }); } };
        }
      };
    }
  };
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(mastery(['saved-question'])));
  dom.window.UpskillAuth = {
    getClient: () => client,
    getUser: () => currentUser,
    onChange(callback) { authChange = callback; }
  };
  dom.window.eval(syncSource);
  authChange(currentUser);
  await flush(); await flush();
  assert.ok(rows.size > 0);

  currentUser = null;
  authChange(null);
  assert.equal(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'), null);

  currentUser = { id: 'user-1' };
  authChange(currentUser);
  await flush(); await flush();
  const restored = JSON.parse(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
  assert.deepEqual(Object.keys(restored.exams.cssbb.questions), ['saved-question']);
  dom.window.close();
});

test('an in-flight sync for one account cannot apply after switching accounts', async () => {
  const aSelect = deferred();
  const bRows = [{
    user_id: 'user-b', device_id: 'b-device', updated_at: new Date().toISOString(),
    payload: { schemaVersion: 1, values: { 'tb-adaptive-mastery-v1': mastery(['b-question']) } }
  }];
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', virtualConsole
  });
  let currentUser = { id: 'user-a' };
  let aUpserts = 0;
  let bUpserts = 0;
  const clients = {
    'user-a': {
      from() { return {
        select() { return { order() { return aSelect.promise; } }; },
        upsert() { aUpserts += 1; return Promise.resolve({ error: null }); }
      }; }
    },
    'user-b': {
      from() { return {
        select() { return { order() { return Promise.resolve({ error: null, data: bRows }); } }; },
        upsert(row) {
          bUpserts += 1;
          const questions = row.payload.values['tb-adaptive-mastery-v1'].exams.cssbb.questions;
          assert.equal(Object.hasOwn(questions, 'a-question'), false);
          return Promise.resolve({ error: null });
        }
      }; }
    }
  };
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(mastery(['a-question'])));
  dom.window.eval(syncSource);
  dom.window.UpskillAuth = {
    getClient: () => clients[currentUser.id],
    getUser: () => currentUser
  };
  const aPending = dom.window.__TBAccountSync.sync('account-a');
  await flush();
  currentUser = { id: 'user-b' };
  const bQueued = await dom.window.__TBAccountSync.sync('account-b');
  assert.equal(bQueued.queued, true);
  aSelect.resolve({ error: null, data: [{
    user_id: 'user-a', device_id: 'a-device', updated_at: new Date().toISOString(),
    payload: { schemaVersion: 1, values: { 'tb-adaptive-mastery-v1': mastery(['a-question']) } }
  }] });
  assert.equal((await aPending).stale, true);
  for (let i = 0; i < 8 && bUpserts === 0; i += 1) await flush();
  assert.equal(aUpserts, 0);
  assert.equal(bUpserts, 1);
  const stored = JSON.parse(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
  assert.deepEqual(Object.keys(stored.exams.cssbb.questions), ['b-question']);
  dom.window.close();
});

test('offline progress remains local and converges when connectivity returns', async () => {
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', virtualConsole
  });
  let online = false;
  Object.defineProperty(dom.window.navigator, 'onLine', { configurable: true, get: () => online });
  let requests = 0;
  const client = {
    from() { return {
      select() { return { order() { requests += 1; return Promise.resolve({ error: null, data: [] }); } }; },
      upsert() { requests += 1; return Promise.resolve({ error: null }); }
    }; }
  };
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(mastery(['offline-question'])));
  dom.window.eval(syncSource);
  dom.window.UpskillAuth = { getClient: () => client, getUser: () => ({ id: 'user-1' }) };
  assert.equal((await dom.window.__TBAccountSync.sync('offline')).skipped, true);
  assert.equal(requests, 0);
  assert.ok(dom.window.localStorage.getItem('tb-adaptive-mastery-v1'));
  online = true;
  assert.equal(typeof (await dom.window.__TBAccountSync.sync('online')).changed, 'boolean');
  assert.equal(requests, 2);
  const meta = JSON.parse(dom.window.localStorage.getItem('tb-account-sync-meta-v1'));
  assert.equal(meta.status, 'synced');
  dom.window.close();
});

test('a transient server error is reported and a later retry succeeds', async () => {
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', virtualConsole
  });
  let fail = true;
  const client = {
    from() { return {
      select() { return { order() {
        return Promise.resolve(fail ? { error: new Error('temporary outage') } : { error: null, data: [] });
      } }; },
      upsert() { return Promise.resolve({ error: null }); }
    }; }
  };
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(mastery(['q1'])));
  dom.window.eval(syncSource);
  dom.window.UpskillAuth = { getClient: () => client, getUser: () => ({ id: 'user-1' }) };
  assert.ok((await dom.window.__TBAccountSync.sync('first')).error);
  assert.equal(JSON.parse(dom.window.localStorage.getItem('tb-account-sync-meta-v1')).status, 'error');
  fail = false;
  assert.equal(typeof (await dom.window.__TBAccountSync.sync('retry')).changed, 'boolean');
  assert.equal(JSON.parse(dom.window.localStorage.getItem('tb-account-sync-meta-v1')).status, 'synced');
  dom.window.close();
});

test('stable data does not trigger a reload on every remote poll', async () => {
  const rows = [];
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only', virtualConsole
  });
  const client = {
    from() { return {
      select() { return { order() { return Promise.resolve({ error: null, data: rows }); } }; },
      upsert(row) {
        rows.splice(0, rows.length, JSON.parse(JSON.stringify(row)));
        return Promise.resolve({ error: null });
      }
    }; }
  };
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify(mastery(['q1'])));
  dom.window.eval(syncSource);
  dom.window.UpskillAuth = { getClient: () => client, getUser: () => ({ id: 'user-1' }) };
  assert.equal(typeof (await dom.window.__TBAccountSync.sync('initial')).changed, 'boolean');
  assert.equal((await dom.window.__TBAccountSync.sync('poll-1')).changed, false);
  assert.equal((await dom.window.__TBAccountSync.sync('poll-2')).changed, false);
  dom.window.close();
});

test('merged histories retain the application limits and newest records', () => {
  const dom = new JSDOM('<!doctype html><body></body>', {
    url: 'https://upskillsprint.com/test-bank', runScripts: 'outside-only'
  });
  dom.window.eval(syncSource);
  const make = (prefix, count, offset, timeKey) => Array.from({ length: count }, (_, index) => ({
    id: prefix + index,
    [timeKey]: offset + index
  }));
  const mergedMastery = dom.window.__TBAccountSync.mergeMastery(
    { exams: { cssbb: { attempts: make('a', 60, 0, 'at'), sessions: make('s-a', 60, 0, 'startedAt'), questions: {} } } },
    { exams: { cssbb: { attempts: make('b', 60, 60, 'at'), sessions: make('s-b', 60, 60, 'startedAt'), questions: {} } } }
  ).exams.cssbb;
  assert.equal(mergedMastery.attempts.length, 60);
  assert.equal(mergedMastery.attempts[0].id, 'b0');
  assert.equal(mergedMastery.sessions.length, 60);
  assert.equal(mergedMastery.sessions[0].id, 's-b0');
  const questionHistory = dom.window.__TBAccountSync.mergeMastery(
    { exams: { cssbb: { attempts: [], sessions: [], questions: { q1: { history: make('q-a', 30, 0, 'at'), lastSeenAt: 29 } } } } },
    { exams: { cssbb: { attempts: [], sessions: [], questions: { q1: { history: make('q-b', 30, 30, 'at'), lastSeenAt: 59 } } } } }
  ).exams.cssbb.questions.q1.history;
  // Non-incorrect entries (no status set here) are capped at the newest 40 once merged.
  assert.equal(questionHistory.length, 40);
  assert.equal(questionHistory[0].id, 'q-a20');
  const mergedHistory = dom.window.__TBAccountSync.mergePayloads([
    { values: { 'tb-attempt-history-v3': { attempts: make('h-a', 50, 0, 'startedAt') } } },
    { values: { 'tb-attempt-history-v3': { attempts: make('h-b', 50, 50, 'startedAt') } } }
  ]).values['tb-attempt-history-v3'].attempts;
  assert.equal(mergedHistory.length, 50);
  assert.equal(mergedHistory[0].id, 'h-b0');
  dom.window.close();
});
