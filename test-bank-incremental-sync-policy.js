(function () {
  'use strict';

  const VERSION = 'server-sequence-v1';
  const components = { account: null, learning: null };
  let pollCatchUp = null;

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (error) { return value; }
  }

  function timestamp(value) {
    const parsed = typeof value === 'number' ? value : Date.parse(value || '');
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  function phaseRank(phase) {
    return {
      conflict: 90,
      error: 80,
      offline: 70,
      'retry-wait': 65,
      pending: 60,
      syncing: 50,
      cancelled: 40,
      'awaiting-legacy-migration': 35,
      synced: 20,
      idle: 10,
      'signed-out': 0
    }[phase] == null ? 10 : {
      conflict: 90,
      error: 80,
      offline: 70,
      'retry-wait': 65,
      pending: 60,
      syncing: 50,
      cancelled: 40,
      'awaiting-legacy-migration': 35,
      synced: 20,
      idle: 10,
      'signed-out': 0
    }[phase];
  }

  function combined() {
    const values = [components.account, components.learning].filter(Boolean);
    let phase = values.length ? 'idle' : 'idle';
    values.forEach(function (item) {
      const candidate = String(item.phase || item.state || 'idle');
      if (phaseRank(candidate) > phaseRank(phase)) phase = candidate;
    });
    const pending = values.reduce(function (total, item) { return total + Math.max(0, Number(item.pending || 0)); }, 0);
    if (pending > 0 && phaseRank(phase) < phaseRank('pending')) phase = 'pending';
    const online = values.every(function (item) { return item.online !== false; });
    if (!online) phase = 'offline';
    const syncTimes = values.map(function (item) { return timestamp(item.syncedAsOf); }).filter(Boolean);
    const clean = values.length === 2 && online && pending === 0 && values.every(function (item) {
      return !item.error && !item.conflict && ['synced', 'idle'].indexOf(String(item.phase || item.state || 'idle')) !== -1;
    });
    const syncedAt = clean && syncTimes.length === values.length ? Math.min.apply(null, syncTimes) : null;
    return {
      version: VERSION,
      phase: phase,
      online: online,
      pending: pending,
      syncedAsOf: syncedAt ? new Date(syncedAt).toISOString() : null,
      components: clone(components)
    };
  }

  function publish(component, detail) {
    components[component] = clone(detail || {});
    const status = combined();
    try { document.dispatchEvent(new CustomEvent('tb:sync-status', { detail: status })); } catch (error) {}
    return status;
  }

  function catchUpLearningAfterProgress() {
    const learning = window.__TBLearning;
    if (!learning || typeof learning.sync !== 'function') return Promise.resolve({ skipped: true, reason: 'learning-runtime-unavailable' });
    if (pollCatchUp) return pollCatchUp;
    pollCatchUp = Promise.resolve().then(function () {
      return learning.sync('account-poll-catch-up');
    }).catch(function (error) {
      /* The learning runtime publishes the authoritative error/conflict state.
         Never turn a background catch-up rejection into an unhandled promise. */
      return { error: String(error && error.message || error || 'Learning catch-up failed') };
    }).finally(function () {
      pollCatchUp = null;
    });
    return pollCatchUp;
  }

  document.addEventListener('tb:account-sync-status', function (event) { publish('account', event && event.detail); });
  document.addEventListener('tb:learning-sync-status', function (event) { publish('learning', event && event.detail); });
  /* Account sync already performs the bounded 60-second remote poll. Reuse
     that successful poll as the idle-device trigger for the append-only
     learning ledger instead of adding another interval or a Start-path read. */
  document.addEventListener('upskill-test-progress-synced', function () { void catchUpLearningAfterProgress(); });

  window.__TB_INCREMENTAL_SYNC_V1 = true;
  window.__TBSyncStatus = Object.freeze({
    version: VERSION,
    status: combined,
    components: function () { return clone(components); },
    catchUpLearningAfterProgress: catchUpLearningAfterProgress
  });

  try { document.dispatchEvent(new CustomEvent('tb:incremental-sync-policy-ready', { detail: { version: VERSION } })); } catch (error) {}
}());
