'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const learning = fs.readFileSync(path.join(ROOT, 'test-bank-learning-events.js'), 'utf8');
const setControls = fs.readFileSync(path.join(ROOT, 'test-bank-set-controls.js'), 'utf8');
const STORE_KEY = 'tb-learning-events-v2';

function seededLedger(eventCount) {
  const events = [];
  const knownEventIds = {};
  for (let index = 0; index < eventCount; index += 1) {
    const id = 'confirmed-' + String(index).padStart(5, '0');
    const occurredAt = 1700000000000 + index;
    events.push({
      id,
      version: 1,
      scope: 'user:fixture',
      type: 'session_started',
      examId: 'cssbb',
      sessionId: 'old-session-' + index,
      questionId: null,
      deviceId: 'old-device',
      occurredAt,
      payload: { note: 'x'.repeat(180) },
      syncedFor: ['fixture']
    });
    knownEventIds[id] = occurredAt;
  }
  return {
    version: 2,
    deviceId: 'quota-device',
    sequence: eventCount,
    events,
    sessions: {},
    migration: {},
    index: { revision: 3, seen: {}, totals: {}, knownEventIds },
    sync: { remoteLoadedFor: {}, ledgerFetchedFor: {}, ledgerCursorFor: {}, lastSuccessAt: null, lastError: null, lastErrorAt: null }
  };
}

test('simulation start recovers from a mobile-style localStorage quota without dropping unsynced start events', () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="tb-overview"></div></body></html>', {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  const { window } = dom;
  const nativeSetItem = window.Storage.prototype.setItem;
  const seed = seededLedger(1400);
  nativeSetItem.call(window.localStorage, STORE_KEY, JSON.stringify(seed));

  const quotaCharacters = 120000;
  window.Storage.prototype.setItem = function (key, value) {
    if (key === STORE_KEY && String(value).length > quotaCharacters) {
      const error = new window.DOMException('The quota has been exceeded.', 'QuotaExceededError');
      throw error;
    }
    return nativeSetItem.call(this, key, value);
  };

  try {
    window.eval(learning);
    window.eval(setControls);
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

    const questions = Array.from({ length: 10 }, (_, index) => ({
      stem: 'Quota recovery question ' + index,
      options: ['A', 'B', 'C', 'D'],
      answer: 0,
      sub: 'fixture'
    }));

    const started = window.__TBLearning.startSession({
      examId: 'cssbb',
      questions,
      mode: 'quick',
      timed: false,
      returnResult: true
    });

    assert.equal(started.saved, true, 'the quota recovery retries the durable start successfully');
    assert.ok(started.sessionId, 'the recovered session keeps its original session id');

    const stored = JSON.parse(window.localStorage.getItem(STORE_KEY));
    const pending = stored.events.filter(event => !Array.isArray(event.syncedFor) || event.syncedFor.length === 0);
    const confirmed = stored.events.filter(event => Array.isArray(event.syncedFor) && event.syncedFor.length > 0);

    assert.equal(pending.length, 11, 'session_started plus ten question_exposed events remain in the write-ahead outbox');
    assert.ok(pending.every(event => event.sessionId === started.sessionId), 'every unsynced start event belongs to the recovered session');
    assert.ok(confirmed.length <= 200, 'only a bounded recent confirmed cache is retained after quota recovery');
    assert.ok(JSON.stringify(stored).length <= quotaCharacters, 'the recovered local projection fits within the simulated mobile quota');
  } finally {
    window.Storage.prototype.setItem = nativeSetItem;
    dom.window.close();
  }
});
