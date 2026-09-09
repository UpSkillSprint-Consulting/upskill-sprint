'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const source = fs.readFileSync(path.join(__dirname, '..', 'test-bank-incremental-sync-policy.js'), 'utf8');

function load() {
  const dom = new JSDOM('<!doctype html><body></body>', { url: 'https://segment14.invalid/test-bank', runScripts: 'outside-only' });
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
  release({ synced: true });
  await Promise.resolve();
  await Promise.resolve();
  dom.window.document.dispatchEvent(new dom.window.CustomEvent('upskill-test-progress-synced'));
  await Promise.resolve();
  assert.equal(calls, 2, 'a later poll begins a new incremental catch-up');
  release({ synced: true });
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
