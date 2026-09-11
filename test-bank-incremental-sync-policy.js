(function () {
  'use strict';

  const VERSION = 'server-sequence-v1';
  const ACCOUNT_META_KEY = 'tb-account-sync-meta-v1';
  const ACCOUNT_USER_KEY = 'tb-account-sync-user-v1';
  const BANNER_ID = 'tb-sync-recovery-banner';
  const components = { account: null, learning: null };
  let pollCatchUp = null;
  let authSanitizerAttached = false;

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

  function renderSyncBanner(status) {
    if (!document.body) { window.setTimeout(function () { renderSyncBanner(status); }, 0); return; }
    let banner = document.getElementById(BANNER_ID);
    const pending = Math.max(0, Number(status && status.pending || 0));
    const phase = String(status && status.phase || 'idle');
    const visible = pending > 0 || ['offline','retry-wait','error','conflict'].indexOf(phase) !== -1;
    if (!visible) { if (banner) banner.remove(); return; }
    if (!banner) {
      banner = document.createElement('section');
      banner.id = BANNER_ID;
      banner.className = 'tb-pane tb-sync-recovery';
      banner.setAttribute('data-status','');
      const overview = document.getElementById('tb-overview');
      if (overview && overview.parentNode) overview.parentNode.insertBefore(banner, overview);
      else document.body.prepend(banner);
    }
    banner.setAttribute('role', phase === 'conflict' || phase === 'error' ? 'alert' : 'status');
    banner.replaceChildren();
    const title = document.createElement('strong');
    const copy = document.createElement('span');
    const actions = document.createElement('span');
    actions.className = 'tb-sync-recovery-actions';
    if (phase === 'conflict') {
      title.textContent = 'Session recovery needed';
      copy.textContent = pending + ' study record' + (pending === 1 ? ' is' : 's are') + ' safely stored on this device but cannot sync until the active-session conflict is resolved.';
    } else if (phase === 'offline') {
      title.textContent = 'Saved on this device';
      copy.textContent = pending + ' study record' + (pending === 1 ? ' will' : 's will') + ' sync when this device reconnects.';
    } else if (phase === 'error' || phase === 'retry-wait') {
      title.textContent = 'Progress sync needs attention';
      copy.textContent = pending + ' study record' + (pending === 1 ? ' remains' : 's remain') + ' saved on this device. Retry the account sync before starting another session.';
    } else {
      title.textContent = phase === 'syncing' ? 'Syncing saved progress' : 'Progress waiting to sync';
      copy.textContent = pending + ' study record' + (pending === 1 ? ' is' : 's are') + ' saved on this device.';
    }
    banner.append(title, copy);
    const retry = document.createElement('button');
    retry.type = 'button'; retry.className = 'tb-ghost'; retry.textContent = 'Retry sync';
    retry.addEventListener('click', function () {
      const learning = window.__TBLearning;
      if (learning && typeof learning.sync === 'function') void learning.sync('manual-recovery');
    });
    actions.appendChild(retry);
    if (phase === 'conflict') {
      const review = document.createElement('button');
      review.type = 'button'; review.className = 'btn btn-teal'; review.textContent = 'Review session recovery';
      review.addEventListener('click', function () {
        try { document.dispatchEvent(new CustomEvent('tb:session-handoff-review')); } catch (error) {}
        const handoff = window.__TBSessionHandoff;
        if (handoff && typeof handoff.refresh === 'function') void handoff.refresh('manual-review');
      });
      actions.appendChild(review);
    }
    banner.appendChild(actions);
  }

  function publish(component, detail) {
    components[component] = clone(detail || {});
    const status = combined();
    renderSyncBanner(status);
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

  /* Account-sync metadata contains the durable server cursor and last uploaded
     digest. Those values are owner-scoped and must never be relabelled for a
     different authenticated account, even when the new account's first remote
     request fails. The policy executes before the sync runtimes in production,
     so its auth listener clears only stale transport metadata; the account
     runtime still owns tracked-payload clearing and the intentional account-
     switch reload. */
  function sanitizeAccountMetadata(user) {
    const userId = user && user.id ? String(user.id) : '';
    if (!userId) return false;
    let meta = null;
    try { meta = JSON.parse(localStorage.getItem(ACCOUNT_META_KEY) || 'null'); } catch (error) { meta = null; }
    const previousUser = String(localStorage.getItem(ACCOUNT_USER_KEY) || '');
    const metaUser = meta && meta.userId ? String(meta.userId) : '';
    if ((metaUser && metaUser !== userId) || (previousUser && previousUser !== userId)) {
      localStorage.removeItem(ACCOUNT_META_KEY);
      return true;
    }
    return false;
  }

  function attachAccountMetadataGuard() {
    const auth = window.UpskillAuth;
    if (!auth) return false;
    try { sanitizeAccountMetadata(typeof auth.getUser === 'function' ? auth.getUser() : null); } catch (error) {}
    if (!authSanitizerAttached && typeof auth.onChange === 'function') {
      authSanitizerAttached = true;
      try { auth.onChange(function (user) { sanitizeAccountMetadata(user); }); } catch (error) { authSanitizerAttached = false; }
    }
    return true;
  }

  document.addEventListener('tb:account-sync-status', function (event) { publish('account', event && event.detail); });
  document.addEventListener('tb:learning-sync-status', function (event) { publish('learning', event && event.detail); });
  /* Account sync already performs the bounded 60-second remote poll. Reuse
     that successful poll as the idle-device trigger for the append-only
     learning ledger instead of adding another interval or a Start-path read. */
  document.addEventListener('upskill-test-progress-synced', function () { void catchUpLearningAfterProgress(); });
  document.addEventListener('upskill-auth-ready', attachAccountMetadataGuard);

  window.__TB_INCREMENTAL_SYNC_V1 = true;
  window.__TBSyncStatus = Object.freeze({
    version: VERSION,
    status: combined,
    components: function () { return clone(components); },
    catchUpLearningAfterProgress: catchUpLearningAfterProgress,
    sanitizeAccountMetadata: sanitizeAccountMetadata
  });

  /* Segment 15 is an additive companion to the Segment 14 transport policy.
     Load it once without adding another poll loop or moving any history fetch
     back onto the quiz Start path. The handoff module waits for lifecycle,
     learning, authentication and timing runtimes as needed. */
  function loadSessionHandoff() {
    if (window.__TBSessionHandoff || document.querySelector('script[data-segment15-handoff]')) return;
    const script = document.createElement('script');
    script.src = '/test-bank-session-handoff.js';
    script.async = false;
    script.dataset.segment15Handoff = 'true';
    script.addEventListener('error', function () { console.error('[exam-session-handoff] session transfer adapter failed to load'); }, { once: true });
    document.head.appendChild(script);
  }

  attachAccountMetadataGuard();
  if (window.__TBSessionLifecycle) loadSessionHandoff();
  else window.addEventListener('load', loadSessionHandoff, { once: true });
  try { document.dispatchEvent(new CustomEvent('tb:incremental-sync-policy-ready', { detail: { version: VERSION } })); } catch (error) {}
}());
