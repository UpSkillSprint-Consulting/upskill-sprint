(function () {
  'use strict';
  const TABLE = 'test_bank_progress_devices';
  const DEVICE_KEY = 'tb-account-sync-device-v1';
  const META_KEY = 'tb-account-sync-meta-v1';
  const USER_KEY = 'tb-account-sync-user-v1';
  const MASTER_KEY = 'tb-adaptive-mastery-v1';
  const HISTORY_KEY = 'tb-attempt-history-v3';
  const LOCAL_WATCH_MS = 3000;
  const REMOTE_POLL_MS = 15000;
  let syncing = false, lastDigest = '', timer = 0, nextRemoteAt = 0;
  let pendingReason = '', reloadForAccountSwitch = false;

  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
  function parse(v, fallback) { try { return JSON.parse(v); } catch (_) { return fallback; } }
  function stable(v) {
    if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
    if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
    return JSON.stringify(v);
  }
  function hash(v) { let out = 2166136261; String(v || '').split('').forEach(c => { out ^= c.charCodeAt(0); out = Math.imul(out, 16777619); }); return (out >>> 0).toString(36); }
  function uid() { return window.crypto && crypto.randomUUID ? crypto.randomUUID() : 'device-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12); }
  function deviceId() { let id = localStorage.getItem(DEVICE_KEY); if (!id) { id = uid(); localStorage.setItem(DEVICE_KEY, id); } return id; }
  function trackedKey(key) { return key === MASTER_KEY || key === HISTORY_KEY || key === 'tb-attempt-feedback-v2' || (/^tb-adaptive-[a-z0-9_-]+$/i.test(key) && !/session|sync|device|meta/i.test(key)); }
  function localPayload() {
    const values = {};
    for (let i = 0; i < localStorage.length; i += 1) { const key = localStorage.key(i); if (trackedKey(key)) values[key] = parse(localStorage.getItem(key), null); }
    return { schemaVersion: 1, values };
  }
  function timeValue(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const parsed = Date.parse(value || '');
    return Number.isFinite(parsed) ? parsed : 0;
  }
  function itemRank(item) {
    if (!item || typeof item !== 'object') return 0;
    return Math.max.apply(Math, ['updatedAt', 'completedAt', 'finishedAt', 'at', 'startedAt', 'createdAt'].map(key => timeValue(item[key])));
  }
  function mergeIdentifiedItem(left, right) {
    const rightWins = itemRank(right) >= itemRank(left);
    const older = rightWins ? left : right, newer = rightWins ? right : left;
    const output = Object.assign({}, clone(older), clone(newer));
    ['errors', 'records'].forEach(key => {
      if ((older && older[key]) || (newer && newer[key])) output[key] = Object.assign({}, clone(older && older[key] || {}), clone(newer && newer[key] || {}));
    });
    return output;
  }
  function mergeArray(a, b) {
    const output = [], positions = new Map(), values = new Set();
    (a || []).concat(b || []).forEach(item => {
      if (item && item.id) {
        const key = 'id:' + item.id;
        if (positions.has(key)) output[positions.get(key)] = mergeIdentifiedItem(output[positions.get(key)], item);
        else { positions.set(key, output.length); output.push(clone(item)); }
        return;
      }
      const key = 'value:' + hash(stable(item));
      if (!values.has(key)) { values.add(key); output.push(clone(item)); }
    });
    return output;
  }
  function mergeQuestion(a, b) {
    const state = clone(Number(a && a.lastSeenAt || 0) >= Number(b && b.lastSeenAt || 0) ? (a || b || {}) : (b || a || {}));
    const history = mergeArray(a && a.history, b && b.history).sort((x, y) => Number(x.at || 0) - Number(y.at || 0)).slice(-60);
    if (!history.length) return state;
    state.history = history; state.attempts = history.length;
    state.correct = history.filter(x => x.status === 'correct').length;
    state.incorrect = history.filter(x => x.status === 'incorrect').length;
    state.unanswered = history.filter(x => x.status === 'unanswered').length;
    state.lastSeenAt = Number(history[history.length - 1].at || state.lastSeenAt || 0);
    state.lastStatus = history[history.length - 1].status || state.lastStatus;
    let streak = 0; for (let i = history.length - 1; i >= 0 && history[i].status === 'correct'; i -= 1) streak += 1;
    state.streak = streak;
    const accuracy = state.correct / state.attempts, confidence = Math.min(state.attempts / 5, 1);
    const recency = Math.max(0, 1 - Math.max(0, (Date.now() - state.lastSeenAt) / 86400000) / 45);
    state.mastery = Math.max(0, Math.min(100, Math.round((.58 * accuracy + .24 * Math.min(streak / 4, 1) + .18 * recency) * (.62 + .38 * confidence) * 100)));
    return state;
  }
  function mergeMastery(a, b) {
    const output = { version: 1, exams: {} };
    const ids = new Set(Object.keys(a && a.exams || {}).concat(Object.keys(b && b.exams || {})));
    ids.forEach(id => {
      const left = a && a.exams && a.exams[id] || {}, right = b && b.exams && b.exams[id] || {};
      const exam = {
        questions: {},
        attempts: mergeArray(left.attempts, right.attempts)
          .sort((x, y) => Number(x.at || x.startedAt || 0) - Number(y.at || y.startedAt || 0))
          .slice(-60),
        sessions: mergeArray(left.sessions, right.sessions)
          .sort((x, y) => Number(x.startedAt || x.at || 0) - Number(y.startedAt || y.at || 0))
          .slice(-60)
      };
      new Set(Object.keys(left.questions || {}).concat(Object.keys(right.questions || {}))).forEach(q => { exam.questions[q] = mergeQuestion(left.questions && left.questions[q], right.questions && right.questions[q]); });
      output.exams[id] = exam;
    });
    return output;
  }
  function mergeHistory(a, b) { return { attempts: mergeArray(a && a.attempts, b && b.attempts).sort((x, y) => Number(x.startedAt || 0) - Number(y.startedAt || 0)).slice(-50) }; }
  function legacyRank(v) { return !v || typeof v !== 'object' ? -1 : Number(v.attempts || 0) * 1000 + Number(v.lastReadiness || 0); }
  function mergeValue(key, a, b) {
    if (a == null) return clone(b); if (b == null) return clone(a);
    if (key === MASTER_KEY) return mergeMastery(a, b);
    if (key === HISTORY_KEY) return mergeHistory(a, b);
    if (a && b && Array.isArray(a.attempts) && Array.isArray(b.attempts)) return Object.assign({}, a, b, { attempts: mergeArray(a.attempts, b.attempts) });
    return legacyRank(b) > legacyRank(a) ? clone(b) : clone(a);
  }
  function mergePayloads(payloads) {
    const merged = { schemaVersion: 1, values: {} };
    (payloads || []).forEach(payload => Object.keys(payload && payload.values || {}).forEach(key => { merged.values[key] = mergeValue(key, merged.values[key], payload.values[key]); }));
    return merged;
  }
  function applyPayload(payload) {
    let changed = false;
    Object.keys(payload && payload.values || {}).forEach(key => { if (stable(payload.values[key]) !== stable(parse(localStorage.getItem(key), null))) { localStorage.setItem(key, JSON.stringify(payload.values[key])); changed = true; } });
    return changed;
  }
  function context() { const auth = window.UpskillAuth; return { client: auth && auth.getClient ? auth.getClient() : null, user: auth && auth.getUser ? auth.getUser() : null }; }
  function clearTrackedPayload() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) { const key = localStorage.key(i); if (trackedKey(key)) keys.push(key); }
    keys.forEach(key => localStorage.removeItem(key));
    return keys.length > 0;
  }
  function prepareUser(userId) {
    const previous = localStorage.getItem(USER_KEY);
    const switched = Boolean(previous && previous !== userId);
    if (switched) { clearTrackedPayload(); reloadForAccountSwitch = true; }
    localStorage.setItem(USER_KEY, userId);
    return switched;
  }
  function currentUserIs(userId) {
    const auth = window.UpskillAuth, user = auth && auth.getUser ? auth.getUser() : null;
    return Boolean(user && user.id === userId);
  }
  async function sync(reason) {
    const ctx = context(); if (!ctx.client || !ctx.user) return { skipped: true };
    prepareUser(ctx.user.id);
    if (!navigator.onLine) return { skipped: true };
    if (syncing) { pendingReason = reason || 'queued'; return { queued: true }; }
    syncing = true;
    try {
      const id = deviceId(), initialLocal = localPayload();
      let result = await ctx.client.from(TABLE).select('device_id,payload,updated_at').order('updated_at', { ascending: true });
      if (result.error) throw result.error;
      if (!currentUserIs(ctx.user.id)) return { stale: true };
      const merged = mergePayloads((result.data || []).map(row => row.payload).concat([initialLocal, localPayload()]));
      const changed = applyPayload(merged);
      const mergedDigest = stable(merged);
      if (!currentUserIs(ctx.user.id)) return { stale: true };
      result = await ctx.client.from(TABLE).upsert({ user_id: ctx.user.id, device_id: id, payload: merged, updated_at: new Date().toISOString() }, { onConflict: 'user_id,device_id' });
      if (result.error) throw result.error;
      if (!currentUserIs(ctx.user.id)) return { stale: true };
      localStorage.setItem(META_KEY, JSON.stringify({ lastSyncedAt: new Date().toISOString(), reason: reason || 'automatic', status: 'synced' }));
      lastDigest = mergedDigest;
      nextRemoteAt = Date.now() + REMOTE_POLL_MS;
      document.dispatchEvent(new CustomEvent('upskill-test-progress-synced', { detail: { changed } }));
      /* Test-bank metrics are calculated during page initialization. Reload only
         when remote progress changed local state; the next merge is then stable,
         so later device updates can refresh the page without a one-time guard. */
      const shouldReload = changed || reloadForAccountSwitch;
      reloadForAccountSwitch = false;
      if (shouldReload) location.reload();
      return { changed };
    } catch (error) {
      if (currentUserIs(ctx.user.id)) localStorage.setItem(META_KEY, JSON.stringify({ lastAttemptAt: new Date().toISOString(), reason: reason || 'automatic', status: 'error', message: String(error && error.message || error) }));
      return { error };
    } finally {
      syncing = false;
      if (pendingReason) {
        const nextReason = pendingReason; pendingReason = '';
        Promise.resolve().then(() => sync(nextReason));
      }
    }
  }
  function watch() {
    clearInterval(timer); lastDigest = stable(localPayload());
    nextRemoteAt = Date.now() + REMOTE_POLL_MS;
    timer = setInterval(() => {
      const next = stable(localPayload());
      if (next !== lastDigest) { lastDigest = next; sync('local-change'); return; }
      /* Focus and online events cover common resumptions. Polling closes the
         remaining gap when two signed-in devices stay open at the same time. */
      if (Date.now() >= nextRemoteAt) {
        nextRemoteAt = Date.now() + REMOTE_POLL_MS;
        sync('remote-poll');
      }
    }, LOCAL_WATCH_MS);
  }
  function start() {
    const auth = window.UpskillAuth; if (!auth || !auth.onChange) return;
    auth.onChange(user => {
      if (user) sync('sign-in').then(watch);
      else {
        clearInterval(timer); pendingReason = ''; reloadForAccountSwitch = false;
        if (localStorage.getItem(USER_KEY)) clearTrackedPayload();
      }
    });
    addEventListener('online', () => sync('online')); addEventListener('focus', () => sync('focus'));
  }
  window.__TBAccountSync = { sync, mergePayloads, mergeMastery, localPayload, REMOTE_POLL_MS };
  if (window.UpskillAuth) start(); else document.addEventListener('upskill-auth-ready', start, { once: true });
}());
