'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const ROOT = path.resolve(__dirname, '..');
const learningSource = fs.readFileSync(path.join(ROOT, 'test-bank-learning-events.js'), 'utf8');
const accountSource = fs.readFileSync(path.join(ROOT, 'test-bank-account-sync.js'), 'utf8');
const policySource = fs.readFileSync(path.join(ROOT, 'test-bank-incremental-sync-policy.js'), 'utf8');

function plain(value) { return JSON.parse(JSON.stringify(value)); }
function deferred() { let resolve, reject; const promise = new Promise((res, rej) => { resolve = res; reject = rej; }); return { promise, resolve, reject }; }
function learningRow(index, at, syncSeq) {
  return {
    user_id: 'segment14-user', event_id: 'segment14-event-' + String(index).padStart(5, '0'), device_id: 'segment14-device',
    event_type: 'question_exposed', exam_id: 'cssbb', session_id: 'segment14-session', question_id: 'cssbb:segment14:' + index,
    occurred_at: at, received_at: at, sync_seq: syncSeq == null ? index + 1 : syncSeq, payload: {}
  };
}
function incrementalLearningClient(rows, options = {}) {
  const calls = [];
  let fetches = 0;
  return {
    calls,
    rpc(name, args) {
      calls.push({ name, args: plain(args || {}) });
      if (name !== 'fetch_test_bank_learning_events_incremental_v1') throw new Error('Unexpected RPC ' + name);
      fetches += 1;
      if (options.stall) return options.stall(fetches);
      if (options.errorAt === fetches) return Promise.resolve({ data: null, error: options.error || { message: 'synthetic page failure' } });
      const after = Number(args && args.p_after_sync_seq || 0);
      const ordered = rows.slice().sort((a, b) => Number(a.sync_seq) - Number(b.sync_seq));
      const page = ordered.filter(row => Number(row.sync_seq) > after).slice(0, Number(args.p_limit || 500));
      if (typeof options.afterPage === 'function') options.afterPage(fetches, rows, page);
      return Promise.resolve({ data: plain(page), error: null });
    },
    from() { throw new Error('Segment 14 server-sequence mode must not use direct learning-table pagination'); }
  };
}
function learningFixture(client) {
  const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://segment14.invalid/test-bank', runScripts: 'outside-only' });
  Object.defineProperty(dom.window.document, 'readyState', { get: () => 'loading', configurable: true });
  dom.window.__TB_INCREMENTAL_SYNC_V1 = true;
  dom.window.eval(learningSource);
  dom.window.UpskillAuth = { getUser: () => ({ id: 'segment14-user' }), getClient: () => client };
  return dom;
}
function accountFixture(client) {
  const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://segment14.invalid/test-bank', runScripts: 'outside-only' });
  dom.window.__TB_INCREMENTAL_SYNC_V1 = true;
  dom.window.eval(accountSource);
  dom.window.UpskillAuth = { getUser: () => ({ id: 'segment14-user' }), getClient: () => client };
  return dom;
}

test('learning catch-up uses a monotonic server sequence and includes a row committed after page one', async t => {
  const base = Date.parse('2026-09-09T20:00:00.000Z');
  const rows = Array.from({ length: 1001 }, (_, i) => learningRow(i, new Date(base + Math.floor(i / 10)).toISOString(), i + 1));
  let inserted = false;
  const client = incrementalLearningClient(rows, { afterPage(fetch, store) {
    if (fetch !== 1 || inserted) return;
    store.push(learningRow(99999, new Date(base - 60000).toISOString(), 1002));
    inserted = true;
  } });
  const dom = learningFixture(client); t.after(() => dom.window.close());
  const result = await dom.window.__TBLearning.sync('segment14-catch-up');
  assert.equal(result.imported, 1002);
  assert.equal(client.calls.filter(call => call.name === 'fetch_test_bank_learning_events_incremental_v1').length, 3);
  const cursor = plain(dom.window.__TBLearning.store().sync.ledgerCursorFor['segment14-user']);
  assert.equal(cursor.syncSeq, 1002);
  assert.equal(dom.window.__TBLearning.status().cursorMode, 'server-sequence-v1');
  assert.equal(dom.window.__TBLearning.status().syncState, 'synced');
  assert.ok(dom.window.__TBLearning.status().syncedAsOf);
});

test('a failed later page never advances the durable ledger cursor and a retry catches up completely', async t => {
  const base = Date.parse('2026-09-09T20:10:00.000Z');
  const rows = Array.from({ length: 1001 }, (_, i) => learningRow(i, new Date(base + i).toISOString(), i + 1));
  const client = incrementalLearningClient(rows, { errorAt: 2 });
  const dom = learningFixture(client); t.after(() => dom.window.close());
  await assert.rejects(dom.window.__TBLearning.sync('segment14-failed-page'), error => Boolean(error && error.message === 'synthetic page failure'));
  assert.equal(dom.window.__TBLearning.store().sync.ledgerCursorFor['segment14-user'], undefined);
  assert.equal(dom.window.__TBLearning.status().syncedAsOf, null);
  client.rpc = incrementalLearningClient(rows).rpc;
  const result = await dom.window.__TBLearning.sync('segment14-retry-complete');
  assert.equal(result.imported, 1001);
  assert.equal(dom.window.__TBLearning.seenQuestionIds('cssbb').length, 1001);
});

test('a legacy timestamp cursor upgrades by replaying once and storing the server sequence', async t => {
  const at = '2026-09-09T20:20:00.000Z';
  const rows = [learningRow(1, at, 1), learningRow(2, at, 2), learningRow(3, '2026-09-09T20:20:00.001Z', 3)];
  const client = incrementalLearningClient(rows);
  const dom = learningFixture(client); t.after(() => dom.window.close());
  const store = dom.window.__TBLearning.store();
  store.sync.ledgerCursorFor['segment14-user'] = at;
  dom.window.localStorage.setItem('tb-learning-events-v2', JSON.stringify(store));
  const result = await dom.window.__TBLearning.sync('segment14-legacy-cursor');
  assert.equal(result.imported, 3);
  const args = client.calls.find(call => call.name === 'fetch_test_bank_learning_events_incremental_v1').args;
  assert.equal(args.p_after_sync_seq, null, 'timestamp-only cursors never skip server-sequenced rows');
  assert.equal(dom.window.__TBLearning.store().sync.ledgerCursorFor['segment14-user'].syncSeq, 3);
});

test('an account change actively cancels a stalled learning fetch instead of waiting for its timeout', async t => {
  let aborted = 0;
  const stall = () => {
    const wait = deferred();
    const query = {
      abortSignal(signal) {
        signal.addEventListener('abort', () => { aborted += 1; wait.reject(Object.assign(new Error('aborted'), { name: 'AbortError' })); }, { once: true });
        return query;
      },
      then(resolve, reject) { return wait.promise.then(resolve, reject); }
    };
    return query;
  };
  const client = incrementalLearningClient([], { stall });
  const dom = learningFixture(client); t.after(() => dom.window.close());
  const running = dom.window.__TBLearning.sync('segment14-stalled');
  await Promise.resolve();
  const cancelled = dom.window.__TBLearning.cancelSync('account-changed');
  assert.equal(cancelled.cancelled, true);
  const result = await running;
  assert.equal(result.cancelled, true);
  assert.equal(aborted, 1);
  assert.equal(dom.window.__TBLearning.status().syncState, 'cancelled');
});

test('conflicts are visible terminal sync states and are not treated as transient retry errors', async t => {
  const client = incrementalLearningClient([], { errorAt: 1, error: { code: '40001', message: 'stale session revision' } });
  const dom = learningFixture(client); t.after(() => dom.window.close());
  const result = await dom.window.__TBLearning.sync('segment14-conflict');
  assert.equal(result.conflict, true);
  const status = plain(dom.window.__TBLearning.status());
  assert.equal(status.syncState, 'conflict');
  assert.equal(status.conflict.code, '40001');
  assert.equal(status.syncedAsOf, null);
  assert.equal(status.retry.exhausted, false);
});

test('offline pending work has an explicit state and can never claim synced-as-of', async t => {
  const client = incrementalLearningClient([]);
  const dom = learningFixture(client); t.after(() => dom.window.close());
  Object.defineProperty(dom.window.navigator, 'onLine', { configurable: true, value: false });
  dom.window.__TBLearning.startSession({ examId: 'cssbb', sessionId: 'segment14-offline-session', questions: [{ qid: 'cssbb:segment14:offline', stem: 'offline' }], mode: 'quick' });
  await Promise.resolve();
  const status = plain(dom.window.__TBLearning.status());
  assert.equal(status.syncState, 'offline');
  assert.ok(status.pendingForUser > 0);
  assert.equal(status.syncedAsOf, null);
  assert.equal(status.retry.maxAttempts, 6);
});

function incrementalProgressClient(rows) {
  const calls = [], uploads = [];
  return {
    calls, uploads,
    rpc(name, args) {
      calls.push({ name, args: plain(args || {}) });
      assert.equal(name, 'fetch_test_bank_progress_devices_incremental_v1');
      const after = Number(args && args.p_after_sync_seq || 0);
      const ordered = rows.slice().sort((a, b) => Number(a.sync_seq) - Number(b.sync_seq));
      return Promise.resolve({ data: plain(ordered.filter(row => Number(row.sync_seq) > after).slice(0, Number(args.p_limit || 100))), error: null });
    },
    from(table) {
      assert.equal(table, 'test_bank_progress_devices');
      return { upsert(row) { uploads.push(plain(row)); return Promise.resolve({ data: null, error: null }); } };
    }
  };
}

test('mergeable account progress uses its own server sequence and exposes a truthful status', async t => {
  const rows = [
    { user_id: 'segment14-user', device_id: 'remote-a', payload: { schemaVersion: 2, values: {} }, updated_at: '2026-09-09T20:30:00.000Z', sync_seq: 1 },
    { user_id: 'segment14-user', device_id: 'remote-b', payload: { schemaVersion: 2, values: {} }, updated_at: '2026-09-09T20:30:00.000Z', sync_seq: 2 }
  ];
  const client = incrementalProgressClient(rows);
  const dom = accountFixture(client); t.after(() => dom.window.close());
  const first = await dom.window.__TBAccountSync.sync('segment14-account-first');
  assert.ifError(first.error);
  assert.equal(first.cursorMode, 'server-sequence-v1');
  const meta = JSON.parse(dom.window.localStorage.getItem('tb-account-sync-meta-v1'));
  assert.equal(meta.remoteCursor.syncSeq, 2);
  const second = await dom.window.__TBAccountSync.sync('segment14-account-second');
  assert.equal(second.fetched, 0);
  const status = plain(dom.window.__TBAccountSync.status());
  assert.equal(status.syncState, 'synced');
  assert.ok(status.syncedAsOf);
  assert.equal(status.cursorMode, 'server-sequence-v1');
});

test('the combined status gives pending/offline/conflict precedence over a stale green component', t => {
  const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://segment14.invalid/test-bank', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  dom.window.eval(policySource);
  dom.window.document.dispatchEvent(new dom.window.CustomEvent('tb:account-sync-status', { detail: { phase: 'synced', online: true, pending: 0, syncedAsOf: '2026-09-09T20:40:00.000Z' } }));
  dom.window.document.dispatchEvent(new dom.window.CustomEvent('tb:learning-sync-status', { detail: { phase: 'pending', online: true, pending: 2, syncedAsOf: null } }));
  assert.equal(dom.window.__TBSyncStatus.status().phase, 'pending');
  assert.equal(dom.window.__TBSyncStatus.status().syncedAsOf, null);
  dom.window.document.dispatchEvent(new dom.window.CustomEvent('tb:learning-sync-status', { detail: { phase: 'conflict', online: true, pending: 0, conflict: { code: '40001' } } }));
  assert.equal(dom.window.__TBSyncStatus.status().phase, 'conflict');
});

test('source guard: no New-only Start path reintroduces a full-ledger refresh and ordinary sync cannot reload the page', () => {
  const files = [
    'test-bank.html', 'test-bank-phase2-runtime-coordinator.js', 'test-bank-adaptive-mastery-runtime.js',
    'test-bank-set-controls.js', 'netlify/edge-functions/test-bank-mobile-picker.js', 'netlify/edge-functions/test-bank-set-controls.js'
  ];
  files.forEach(file => {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
    assert.doesNotMatch(source, /\.ensureFreshHistory\s*\(/, file + ' must not make full history hydration a Start dependency');
  });
  assert.match(learningSource, /NEW_ONLY_RESERVATION_RPC\s*=\s*'reserve_test_bank_new_questions'/);
  assert.match(learningSource, /MAX_RETRY_ATTEMPTS\s*=\s*6/);
  assert.match(learningSource, /retryAttempts\s*>=\s*MAX_RETRY_ATTEMPTS/);
  assert.match(learningSource, /p_after_sync_seq/);
  assert.match(accountSource, /REMOTE_POLL_MS\s*=\s*60000/);
  assert.match(accountSource, /p_after_sync_seq/);
  assert.match(accountSource, /if \(accountSwitched\) reloadPage\(\)/);
  assert.doesNotMatch(learningSource, /location\.reload\s*\(/);
});
