'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '..', 'test-bank-incremental-sync-policy.js'), 'utf8');

function load(initialStorage) {
  const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://segment14.invalid/test-bank', runScripts: 'outside-only' });
  Object.entries(initialStorage || {}).forEach(([key, value]) => dom.window.localStorage.setItem(key, value));
  dom.window.eval(source);
  return dom;
}

test('a successful account poll triggers one coalesced learning-ledger catch-up', async t => {
  const dom = load(); t.after(() => dom.window.close());
  let calls = 0;
  let release;
  dom.window.__TBLearning = {
    sync(reason) {
      calls += 1;
      assert.equal(reason, 'account-poll-catch-up');
      return new Promise(resolve => { release = resolve; });
    }
  };

  dom.window.document.dispatchEvent(new dom.window.CustomEvent('upskill-test-progress-synced'));
  dom.window.document.dispatchEvent(new dom.window.CustomEvent('upskill-test-progress-synced'));
  await Promise.resolve();
  assert.equal(calls, 1, 'overlapping account polls share one ledger catch-up');

  const finishingFirst = dom.window.__TBSyncStatus.catchUpLearningAfterProgress();
  release({ synced: true });
  await finishingFirst;
  /* Promise resolution and the outer finally are separate scheduling turns in
     Node/JSDOM. Wait for the policy's cleanup rather than assuming a fixed
     number of microtasks, then prove a later poll starts fresh work. */
  await new Promise(resolve => dom.window.setTimeout(resolve, 0));

  dom.window.document.dispatchEvent(new dom.window.CustomEvent('upskill-test-progress-synced'));
  await Promise.resolve();
  assert.equal(calls, 2, 'a later poll begins a new incremental catch-up');
  release({ synced: true });
  await dom.window.__TBSyncStatus.catchUpLearningAfterProgress();
});

test('background catch-up failures are contained while the learning runtime owns error status', async t => {
  const dom = load(); t.after(() => dom.window.close());
  dom.window.__TBLearning = { sync() { return Promise.reject(new Error('synthetic network failure')); } };
  const result = await dom.window.__TBSyncStatus.catchUpLearningAfterProgress();
  assert.deepEqual(JSON.parse(JSON.stringify(result)), { error: 'synthetic network failure' });
});

test('combined status never claims synced while a component is pending, offline, conflicting, or missing', t => {
  const dom = load(); t.after(() => dom.window.close());
  const emit = (name, detail) => dom.window.document.dispatchEvent(new dom.window.CustomEvent(name, { detail }));

  emit('tb:account-sync-status', { phase: 'synced', online: true, pending: 0, syncedAsOf: '2026-09-09T20:40:00.000Z' });
  assert.equal(dom.window.__TBSyncStatus.status().syncedAsOf, null, 'both channels must be known before a green timestamp exists');
  emit('tb:learning-sync-status', { phase: 'synced', online: true, pending: 0, syncedAsOf: '2026-09-09T20:39:00.000Z' });
  assert.equal(dom.window.__TBSyncStatus.status().phase, 'synced');
  assert.equal(dom.window.__TBSyncStatus.status().syncedAsOf, '2026-09-09T20:39:00.000Z');

  emit('tb:learning-sync-status', { phase: 'pending', online: true, pending: 2, syncedAsOf: null });
  assert.equal(dom.window.__TBSyncStatus.status().phase, 'pending');
  assert.equal(dom.window.__TBSyncStatus.status().syncedAsOf, null);
  emit('tb:learning-sync-status', { phase: 'offline', online: false, pending: 2, syncedAsOf: null });
  assert.equal(dom.window.__TBSyncStatus.status().phase, 'offline');
  emit('tb:learning-sync-status', { phase: 'conflict', online: true, pending: 0, conflict: { code: '40001' }, syncedAsOf: null });
  assert.equal(dom.window.__TBSyncStatus.status().phase, 'conflict');
  assert.equal(dom.window.__TBSyncStatus.status().syncedAsOf, null);
});

test('policy advertises the server-sequence protocol used by both durable channels', t => {
  const dom = load(); t.after(() => dom.window.close());
  assert.equal(dom.window.__TB_INCREMENTAL_SYNC_V1, true);
  assert.equal(dom.window.__TBSyncStatus.version, 'server-sequence-v1');
});

test('cross-account auth clears stale cursor/digest metadata before account sync can relabel it', t => {
  const stale = JSON.stringify({
    userId: 'owner-a',
    remoteCursor: { syncSeq: 912 },
    uploadedDigest: 'owner-a-digest',
    syncedAsOf: '2026-09-09T20:00:00.000Z'
  });
  const dom = load({
    'tb-account-sync-user-v1': 'owner-a',
    'tb-account-sync-meta-v1': stale
  });
  t.after(() => dom.window.close());
  let authChange = null;
  const user = { id: 'owner-b' };
  dom.window.UpskillAuth = {
    getUser: () => user,
    onChange(callback) { authChange = callback; }
  };
  dom.window.document.dispatchEvent(new dom.window.CustomEvent('upskill-auth-ready'));
  assert.equal(dom.window.localStorage.getItem('tb-account-sync-meta-v1'), null, 'new owner cannot inherit the prior cursor/digest');
  assert.equal(typeof authChange, 'function');

  dom.window.localStorage.setItem('tb-account-sync-meta-v1', JSON.stringify({ userId: 'owner-b', remoteCursor: { syncSeq: 3 } }));
  authChange({ id: 'owner-b' });
  assert.equal(JSON.parse(dom.window.localStorage.getItem('tb-account-sync-meta-v1')).remoteCursor.syncSeq, 3, 'same-owner cursor remains durable');
  dom.window.localStorage.setItem('tb-account-sync-user-v1', 'owner-b');
  authChange({ id: 'owner-c' });
  assert.equal(dom.window.localStorage.getItem('tb-account-sync-meta-v1'), null, 'later account switches are sanitized before sync');
});
