(function () {
  'use strict';
  const TABLE = 'test_bank_progress_devices';
  const DEVICE_KEY = 'tb-account-sync-device-v1';
  const META_KEY = 'tb-account-sync-meta-v1';
  const USER_KEY = 'tb-account-sync-user-v1';
  const RESET_KEY = 'tb-account-sync-resets-v1';
  const MASTER_KEY = 'tb-adaptive-mastery-v1';
  const HISTORY_KEY = 'tb-attempt-history-v3';
  const MASTERY_RESET_PREFIX = 'mastery-exam:';
  const LOCAL_WATCH_MS = 3000;
  const REMOTE_POLL_MS = 15000;
  let syncing = false, lastDigest = '', timer = 0, nextRemoteAt = 0;
  let pendingReason = '', reloadForAccountSwitch = false;
  let pendingProgressRefresh = false, progressRefreshObserver = null;

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
    return { schemaVersion: 2, values, resets: readResetMarkers() };
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
  function validExamId(examId) { return /^[a-z0-9_-]{1,80}$/i.test(String(examId || '')); }
  function masteryResetScope(examId) { return validExamId(examId) ? MASTERY_RESET_PREFIX + examId : null; }
  function normalizeResetMarkers(value) {
    const output = {};
    Object.keys(value && typeof value === 'object' ? value : {}).forEach(scope => {
      const timestamp = Number(value[scope]);
      if (scope.indexOf(MASTERY_RESET_PREFIX) === 0 && validExamId(scope.slice(MASTERY_RESET_PREFIX.length)) && Number.isFinite(timestamp) && timestamp > 0) {
        output[scope] = timestamp;
      }
    });
    return output;
  }
  function readResetMarkers() { return normalizeResetMarkers(parse(localStorage.getItem(RESET_KEY), {})); }
  function mergeResetMarkers(payloads) {
    const output = {};
    (payloads || []).forEach(payload => {
      const resets = normalizeResetMarkers(payload && payload.resets);
      Object.keys(resets).forEach(scope => { output[scope] = Math.max(Number(output[scope] || 0), resets[scope]); });
    });
    return output;
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
  /* Incorrect attempts are kept in full across merges so the mistake notebook
     retains a complete cross-device record; other statuses are capped. */
  function trimQuestionHistory(history) {
    const sorted = (history || []).slice().sort((x, y) => Number(x.at || 0) - Number(y.at || 0));
    const incorrect = sorted.filter(x => x.status === 'incorrect');
    const other = sorted.filter(x => x.status !== 'incorrect').slice(-40);
    return incorrect.concat(other).sort((x, y) => Number(x.at || 0) - Number(y.at || 0)).slice(-500);
  }
  function rebuildQuestionState(state, history) {
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
  function mergeQuestion(a, b) {
    const state = clone(Number(a && a.lastSeenAt || 0) >= Number(b && b.lastSeenAt || 0) ? (a || b || {}) : (b || a || {}));
    const history = trimQuestionHistory(mergeArray(a && a.history, b && b.history));
    return rebuildQuestionState(state, history);
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
  function filterQuestionAfterReset(state, resetAt) {
    if (!state || typeof state !== 'object') return null;
    const history = (state.history || []).filter(entry => timeValue(entry && entry.at) > resetAt);
    if (history.length) return rebuildQuestionState(clone(state), history);
    return timeValue(state.lastSeenAt) > resetAt ? clone(state) : null;
  }
  function filterMasteryExamAfterReset(exam, resetAt) {
    const source = exam && typeof exam === 'object' ? exam : {};
    const output = {
      questions: {},
      attempts: (source.attempts || []).filter(item => itemRank(item) > resetAt).map(clone),
      sessions: (source.sessions || []).filter(item => itemRank(item) > resetAt).map(clone)
    };
    Object.keys(source.questions || {}).forEach(questionId => {
      const state = filterQuestionAfterReset(source.questions[questionId], resetAt);
      if (state) output.questions[questionId] = state;
    });
    return output;
  }
  function hasMasteryData(exam) {
    return Boolean(exam && (Object.keys(exam.questions || {}).length || (exam.attempts || []).length || (exam.sessions || []).length));
  }
  function filterLegacyAdaptiveAfterReset(value, resetAt) {
    if (!value || typeof value !== 'object') return null;
    const output = clone(value);
    output.history = (value.history || []).filter(item => timeValue(item && item.at) > resetAt);
    output.subState = {};
    Object.keys(value.subState || {}).forEach(subId => {
      if (timeValue(value.subState[subId] && value.subState[subId].at) > resetAt) output.subState[subId] = clone(value.subState[subId]);
    });
    if (!output.history.length && !Object.keys(output.subState).length) return null;
    output.attempts = output.history.length;
    if (output.history.length) output.lastAt = Math.max.apply(Math, output.history.map(item => timeValue(item && item.at)));
    return output;
  }
  function applyResetMarkers(payload) {
    payload.values = payload.values && typeof payload.values === 'object' ? payload.values : {};
    const resets = normalizeResetMarkers(payload && payload.resets);
    Object.keys(resets).forEach(scope => {
      const examId = scope.slice(MASTERY_RESET_PREFIX.length);
      const resetAt = resets[scope];
      const mastery = payload.values[MASTER_KEY];
      if (mastery && mastery.exams && mastery.exams[examId]) {
        const filtered = filterMasteryExamAfterReset(mastery.exams[examId], resetAt);
        if (hasMasteryData(filtered)) mastery.exams[examId] = filtered;
        else delete mastery.exams[examId];
      }
      const legacyKey = 'tb-adaptive-' + examId;
      if (Object.prototype.hasOwnProperty.call(payload.values, legacyKey)) {
        const filteredLegacy = filterLegacyAdaptiveAfterReset(payload.values[legacyKey], resetAt);
        if (filteredLegacy) payload.values[legacyKey] = filteredLegacy;
        else delete payload.values[legacyKey];
      }
    });
    return payload;
  }
  function legacyRank(v) { return !v || typeof v !== 'object' ? -1 : Number(v.attempts || 0) * 1000 + Number(v.lastReadiness || 0); }
  function mergeValue(key, a, b) {
    if (a == null) return clone(b); if (b == null) return clone(a);
    if (key === MASTER_KEY) return mergeMastery(a, b);
    if (key === HISTORY_KEY) return mergeHistory(a, b);
    if (a && b && Array.isArray(a.attempts) && Array.isArray(b.attempts)) return Object.assign({}, a, b, { attempts: mergeArray(a.attempts, b.attempts) });
    return legacyRank(b) > legacyRank(a) ? clone(b) : clone(a);
  }
  function mergePayloads(payloads) {
    const merged = { schemaVersion: 2, values: {}, resets: mergeResetMarkers(payloads) };
    (payloads || []).forEach(payload => Object.keys(payload && payload.values || {}).forEach(key => { merged.values[key] = mergeValue(key, merged.values[key], payload.values[key]); }));
    return applyResetMarkers(merged);
  }
  function applyPayload(payload) {
    let changed = false;
    const resets = normalizeResetMarkers(payload && payload.resets);
    if (stable(resets) !== stable(readResetMarkers())) {
      localStorage.setItem(RESET_KEY, JSON.stringify(resets));
      changed = true;
    }
    Object.keys(resets).forEach(scope => {
      const legacyKey = 'tb-adaptive-' + scope.slice(MASTERY_RESET_PREFIX.length);
      if (!Object.prototype.hasOwnProperty.call(payload.values || {}, legacyKey) && localStorage.getItem(legacyKey) != null) {
        localStorage.removeItem(legacyKey); changed = true;
      }
    });
    Object.keys(payload && payload.values || {}).forEach(key => { if (stable(payload.values[key]) !== stable(parse(localStorage.getItem(key), null))) { localStorage.setItem(key, JSON.stringify(payload.values[key])); changed = true; } });
    return changed;
  }
  function context() { const auth = window.UpskillAuth; return { client: auth && auth.getClient ? auth.getClient() : null, user: auth && auth.getUser ? auth.getUser() : null }; }
  function examModeActive() {
    const shell = document.querySelector('.tb-shell');
    return Boolean(shell && shell.classList.contains('exam-mode'));
  }
  function stopProgressRefreshObserver() {
    if (progressRefreshObserver) progressRefreshObserver.disconnect();
    progressRefreshObserver = null;
  }
  function reloadPage() { location.reload(); }
  function flushProgressRefresh() {
    if (!pendingProgressRefresh || examModeActive()) return false;
    pendingProgressRefresh = false;
    stopProgressRefreshObserver();
    reloadPage();
    return true;
  }
  function requestProgressRefresh() {
    if (!examModeActive()) { reloadPage(); return true; }
    pendingProgressRefresh = true;
    if (!progressRefreshObserver && typeof MutationObserver === 'function') {
      const shell = document.querySelector('.tb-shell');
      if (shell) {
        progressRefreshObserver = new MutationObserver(flushProgressRefresh);
        progressRefreshObserver.observe(shell, { attributes: true, attributeFilter: ['class'] });
      }
    }
    return false;
  }
  function clearTrackedPayload() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) { const key = localStorage.key(i); if (trackedKey(key)) keys.push(key); }
    if (localStorage.getItem(RESET_KEY) != null) keys.push(RESET_KEY);
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
  function resetAdaptiveExam(examId) {
    const ctx = context(), scope = masteryResetScope(examId);
    if (!ctx.user || !scope) return Promise.resolve({ skipped: true });
    prepareUser(ctx.user.id);
    const resets = readResetMarkers();
    resets[scope] = Math.max(Number(resets[scope] || 0), Date.now());
    localStorage.setItem(RESET_KEY, JSON.stringify(resets));
    return sync('adaptive-reset');
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
      /* Test-bank metrics are calculated during page initialization. A genuine
         account switch still reloads immediately to discard the old account's
         in-memory session. Ordinary progress merges wait until quiz/results mode
         ends so a delayed sign-in response cannot close an active exam. */
      const accountSwitched = reloadForAccountSwitch;
      reloadForAccountSwitch = false;
      if (accountSwitched) reloadPage();
      else if (changed) requestProgressRefresh();
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
        pendingProgressRefresh = false; stopProgressRefreshObserver();
        if (localStorage.getItem(USER_KEY)) clearTrackedPayload();
      }
    });
    addEventListener('online', () => sync('online')); addEventListener('focus', () => sync('focus'));
  }
  window.__TBAccountSync = { sync, mergePayloads, mergeMastery, localPayload, resetAdaptiveExam, REMOTE_POLL_MS };
  if (window.UpskillAuth) start(); else document.addEventListener('upskill-auth-ready', start, { once: true });
}());
