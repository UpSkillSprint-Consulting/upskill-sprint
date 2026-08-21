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
  const MASTERY_EVIDENCE_LIMIT = 500;
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
  function itemAfterReset(item, resetAt) { return Number(item && item.resetAt || 0) >= resetAt || itemRank(item) > resetAt; }
  function evidenceAfterReset(entry, resetAt) { return Number(entry && entry.resetAt || 0) >= resetAt || timeValue(entry && entry.at) > resetAt; }
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
  function evidenceOrder(left, right) {
    const time = Number(left && left.at || 0) - Number(right && right.at || 0);
    if (time) return time;
    const sequence = Number(left && left.priorAttempts || 0) - Number(right && right.priorAttempts || 0);
    if (sequence) return sequence;
    const leftKey = left && left.id ? 'id:' + left.id : 'value:' + hash(stable(left));
    const rightKey = right && right.id ? 'id:' + right.id : 'value:' + hash(stable(right));
    return leftKey.localeCompare(rightKey);
  }
  /* Incorrect attempts are kept in full across merges so the mistake notebook
     retains a complete cross-device record; other statuses are capped. */
  function trimQuestionHistory(history) {
    const sorted = (history || []).slice().sort(evidenceOrder);
    const incorrect = sorted.filter(x => x.status === 'incorrect');
    const other = sorted.filter(x => x.status !== 'incorrect').slice(-40);
    return incorrect.concat(other).sort(evidenceOrder).slice(-500);
  }
  function count(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
  }
  function emptyMasteryComponent() {
    return { deviceId: '', streamId: '', resetAt: 0, sequence: 0, at: 0, firstSeenAt: 0, attempts: 0, correct: 0, incorrect: 0, unanswered: 0, streak: 0, lastSeenAt: 0, lastStatus: 'new' };
  }
  function normalizeMasteryComponent(value) {
    const source = value && typeof value === 'object' ? value : {};
    return {
      deviceId: source.deviceId ? String(source.deviceId) : '',
      streamId: source.streamId ? String(source.streamId) : '',
      resetAt: Number(source.resetAt || 0),
      sequence: count(source.sequence),
      at: Number(source.at || source.lastSeenAt || 0),
      firstSeenAt: Number(source.firstSeenAt || 0),
      attempts: count(source.attempts),
      correct: count(source.correct),
      incorrect: count(source.incorrect),
      unanswered: count(source.unanswered),
      streak: count(source.streak),
      lastSeenAt: Number(source.lastSeenAt || source.at || 0),
      lastStatus: source.lastStatus || 'new'
    };
  }
  function assembleMasteryBaseline(legacy, devices, foldedIds) {
    const normalizedLegacy = normalizeMasteryComponent(legacy);
    const normalizedDevices = {};
    Object.keys(devices && typeof devices === 'object' ? devices : {}).sort().forEach(device => {
      const component = normalizeMasteryComponent(devices[device]);
      component.streamId = component.streamId || device;
      component.deviceId = component.deviceId || device;
      if (component.attempts || component.sequence) normalizedDevices[device] = component;
    });
    const components = [normalizedLegacy].concat(Object.keys(normalizedDevices).map(device => normalizedDevices[device]));
    let attempts = 0, correct = 0, incorrect = 0, unanswered = 0, firstSeenAt = 0, unknownFirstSeen = false;
    let latest = emptyMasteryComponent();
    components.forEach(component => {
      attempts += component.attempts; correct += component.correct; incorrect += component.incorrect; unanswered += component.unanswered;
      if (component.attempts && !component.firstSeenAt) unknownFirstSeen = true;
      else if (component.firstSeenAt && (!firstSeenAt || component.firstSeenAt < firstSeenAt)) firstSeenAt = component.firstSeenAt;
      if (component.lastSeenAt > latest.lastSeenAt || (component.lastSeenAt === latest.lastSeenAt && stable(component) > stable(latest))) latest = component;
    });
    return {
      at: latest.lastSeenAt,
      firstSeenAt: unknownFirstSeen ? 0 : firstSeenAt,
      attempts, correct, incorrect, unanswered,
      streak: latest.streak,
      lastSeenAt: latest.lastSeenAt,
      lastStatus: latest.lastStatus,
      legacy: normalizedLegacy,
      devices: normalizedDevices,
      foldedIds: Array.from(new Set((foldedIds || []).map(String))).slice(-MASTERY_EVIDENCE_LIMIT)
    };
  }
  function emptyMasteryBaseline() {
    return assembleMasteryBaseline(emptyMasteryComponent(), {}, []);
  }
  function normalizeMasteryBaseline(value) {
    const source = value && typeof value === 'object' ? value : {};
    if (source.legacy || source.devices) return assembleMasteryBaseline(source.legacy, source.devices, source.foldedIds);
    return assembleMasteryBaseline(source, {}, source.foldedIds);
  }
  function legacyMasteryBaseline(state) {
    const legacy = normalizeMasteryComponent({
      at: state && state.lastSeenAt,
      /* A legacy aggregate may include attempts no longer present in history,
         so its earliest observation is deliberately treated as unknown. */
      firstSeenAt: 0,
      attempts: state && state.attempts,
      correct: state && state.correct,
      incorrect: state && state.incorrect,
      unanswered: state && state.unanswered,
      streak: state && state.streak,
      lastSeenAt: state && state.lastSeenAt,
      lastStatus: state && state.lastStatus
    });
    return assembleMasteryBaseline(legacy, {}, []);
  }
  function hasAggregateCounters(state) {
    return Boolean(state && ['attempts', 'correct', 'incorrect', 'unanswered'].some(key => Object.prototype.hasOwnProperty.call(state, key) && Number.isFinite(Number(state[key]))));
  }
  function foldEvidenceIntoBaseline(baseline, entries) {
    const normalized = normalizeMasteryBaseline(baseline);
    const legacy = normalizeMasteryComponent(normalized.legacy);
    const devices = clone(normalized.devices || {});
    const foldedIds = (normalized.foldedIds || []).slice();
    (entries || []).forEach(entry => {
      const timestamp = Number(entry && entry.at || 0);
      const device = entry && entry.deviceId ? String(entry.deviceId) : '';
      const stream = entry && entry.streamId ? String(entry.streamId) : device;
      const sequence = count(entry && entry.sequence);
      let component = legacy;
      if (stream && sequence) {
        component = normalizeMasteryComponent(devices[stream]);
        if (sequence <= component.sequence) return;
        component.deviceId = device || component.deviceId;
        component.streamId = stream;
        component.resetAt = Math.max(component.resetAt, Number(entry && entry.resetAt || 0));
        component.sequence = sequence;
        devices[stream] = component;
      } else {
        const identity = entry && entry.id ? 'id:' + entry.id : 'value:' + hash(stable(entry));
        if (foldedIds.indexOf(identity) !== -1) return;
        foldedIds.push(identity);
      }
      component.attempts += 1;
      if (entry.status === 'correct') component.correct += 1;
      else if (entry.status === 'unanswered') component.unanswered += 1;
      else component.incorrect += 1;
      component.streak = entry.status === 'correct' ? component.streak + 1 : 0;
      if (!component.firstSeenAt || (timestamp && timestamp < component.firstSeenAt)) component.firstSeenAt = timestamp;
      if (timestamp >= component.lastSeenAt) { component.lastSeenAt = timestamp; component.lastStatus = entry.status || component.lastStatus; }
      component.at = Math.max(component.at, timestamp);
    });
    return assembleMasteryBaseline(legacy, devices, foldedIds);
  }
  function componentWins(left, right) {
    const a = normalizeMasteryComponent(left), b = normalizeMasteryComponent(right);
    if (b.sequence !== a.sequence) return b.sequence > a.sequence ? b : a;
    if (b.lastSeenAt !== a.lastSeenAt) return b.lastSeenAt > a.lastSeenAt ? b : a;
    if (b.attempts !== a.attempts) return b.attempts > a.attempts ? b : a;
    return stable(b) > stable(a) ? b : a;
  }
  function mergeMasteryBaselines(a, b) {
    const left = normalizeMasteryBaseline(a), right = normalizeMasteryBaseline(b);
    const devices = {};
    new Set(Object.keys(left.devices || {}).concat(Object.keys(right.devices || {}))).forEach(device => {
      devices[device] = componentWins(left.devices && left.devices[device], right.devices && right.devices[device]);
    });
    return assembleMasteryBaseline(
      componentWins(left.legacy, right.legacy),
      devices,
      (left.foldedIds || []).concat(right.foldedIds || [])
    );
  }
  function evidenceAlreadyFolded(baseline, entry) {
    const normalized = normalizeMasteryBaseline(baseline);
    const device = entry && entry.deviceId ? String(entry.deviceId) : '';
    const stream = entry && entry.streamId ? String(entry.streamId) : device;
    const sequence = count(entry && entry.sequence);
    if (stream && sequence) return sequence <= count(normalized.devices[stream] && normalized.devices[stream].sequence);
    const identity = entry && entry.id ? 'id:' + entry.id : 'value:' + hash(stable(entry));
    return (normalized.foldedIds || []).indexOf(identity) !== -1;
  }
  function partitionMasteryEvidence(history, overflowCount) {
    const grouped = {};
    (history || []).forEach(entry => {
      const device = entry && entry.deviceId ? String(entry.deviceId) : '';
      const stream = entry && entry.streamId ? String(entry.streamId) : device;
      const sequence = count(entry && entry.sequence);
      const key = stream && sequence ? 'stream:' + stream : 'legacy';
      grouped[key] = grouped[key] || [];
      grouped[key].push(entry);
    });
    const groups = Object.keys(grouped).sort().map(key => {
      const isDevice = key.indexOf('stream:') === 0;
      const items = grouped[key].slice().sort((left, right) => {
        if (isDevice) {
          const sequence = count(left && left.sequence) - count(right && right.sequence);
          if (sequence) return sequence;
        }
        return evidenceOrder(left, right);
      });
      return { items, index: 0 };
    });
    const overflow = [];
    while (overflow.length < overflowCount) {
      let chosen = null;
      groups.forEach(group => {
        const candidate = group.items[group.index];
        if (candidate && (!chosen || evidenceOrder(candidate, chosen.item) < 0)) chosen = { group, item: candidate };
      });
      if (!chosen) break;
      overflow.push(chosen.item);
      chosen.group.index += 1;
    }
    const retained = [];
    groups.forEach(group => { retained.push.apply(retained, group.items.slice(group.index)); });
    return { overflow, retained: retained.sort(evidenceOrder) };
  }
  function compactMasteryEvidence(baseline, history) {
    const normalized = normalizeMasteryBaseline(baseline);
    const sorted = (history || []).filter(entry => !evidenceAlreadyFolded(normalized, entry)).slice().sort(evidenceOrder);
    if (sorted.length <= MASTERY_EVIDENCE_LIMIT) return { baseline: normalized, history: sorted };
    const partitioned = partitionMasteryEvidence(sorted, sorted.length - MASTERY_EVIDENCE_LIMIT);
    return { baseline: foldEvidenceIntoBaseline(normalized, partitioned.overflow), history: partitioned.retained };
  }
  function canonicalMastery(state) {
    if (state && state.masteryBaseline && Array.isArray(state.masteryHistory)) {
      return compactMasteryEvidence(state.masteryBaseline, state.masteryHistory);
    }
    if (hasAggregateCounters(state)) return { baseline: legacyMasteryBaseline(state), history: [] };
    return { baseline: emptyMasteryBaseline(), history: clone(state && state.history || []) };
  }
  function rebuildQuestionState(state, canonical) {
    const compacted = compactMasteryEvidence(canonical && canonical.baseline, canonical && canonical.history);
    const baseline = compacted.baseline;
    let attempts = baseline.attempts, correct = baseline.correct, incorrect = baseline.incorrect, unanswered = baseline.unanswered;
    let streak = baseline.streak, lastSeenAt = baseline.lastSeenAt, lastStatus = baseline.lastStatus;
    compacted.history.forEach(entry => {
      attempts += 1;
      if (entry.status === 'correct') correct += 1;
      else if (entry.status === 'unanswered') unanswered += 1;
      else incorrect += 1;
      streak = entry.status === 'correct' ? streak + 1 : 0;
      if (Number(entry.at || 0) >= lastSeenAt) { lastSeenAt = Number(entry.at || 0); lastStatus = entry.status || lastStatus; }
    });
    state.masteryBaseline = baseline; state.masteryHistory = compacted.history;
    state.attempts = attempts; state.correct = correct; state.incorrect = incorrect; state.unanswered = unanswered;
    state.lastSeenAt = lastSeenAt; state.lastStatus = lastStatus; state.streak = streak;
    if (!attempts) state.mastery = 0;
    else {
      const accuracy = correct / attempts, confidence = Math.min(attempts / 5, 1);
      const recency = Math.max(0, 1 - Math.max(0, (Date.now() - lastSeenAt) / 86400000) / 45);
      state.mastery = Math.max(0, Math.min(100, Math.round((.58 * accuracy + .24 * Math.min(streak / 4, 1) + .18 * recency) * (.62 + .38 * confidence) * 100)));
    }
    return state;
  }
  function mergeQuestionEvidence(a, b) {
    const left = canonicalMastery(a), right = canonicalMastery(b);
    const baseline = mergeMasteryBaselines(left.baseline, right.baseline);
    const history = mergeArray(left.history, right.history).filter(entry => !evidenceAlreadyFolded(baseline, entry));
    return compactMasteryEvidence(baseline, history);
  }
  function mergeQuestion(a, b) {
    const state = clone(Number(a && a.lastSeenAt || 0) >= Number(b && b.lastSeenAt || 0) ? (a || b || {}) : (b || a || {}));
    state.history = trimQuestionHistory(mergeArray(a && a.history, b && b.history));
    return rebuildQuestionState(state, mergeQuestionEvidence(a, b));
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
  function filterMasteryBaselineAfterReset(baseline, resetAt) {
    const existing = normalizeMasteryBaseline(baseline);
    const legacyIsNew = existing.legacy.resetAt >= resetAt || existing.legacy.firstSeenAt > resetAt;
    const legacy = existing.legacy.attempts && legacyIsNew ? existing.legacy : emptyMasteryComponent();
    const devices = {};
    Object.keys(existing.devices || {}).forEach(device => {
      const component = existing.devices[device];
      if (component.attempts && (component.resetAt >= resetAt || component.firstSeenAt > resetAt)) devices[device] = component;
    });
    const allComponentsKept = legacy.attempts === existing.legacy.attempts && Object.keys(devices).length === Object.keys(existing.devices || {}).length;
    return assembleMasteryBaseline(legacy, devices, allComponentsKept ? existing.foldedIds : []);
  }
  function filterQuestionAfterReset(state, resetAt) {
    if (!state || typeof state !== 'object') return null;
    const history = (state.history || []).filter(entry => evidenceAfterReset(entry, resetAt));
    let canonical = { baseline: emptyMasteryBaseline(), history: [] };
    const hasCanonicalEvidence = Boolean(state.masteryBaseline && Array.isArray(state.masteryHistory));
    if (hasCanonicalEvidence) {
      const existing = canonicalMastery(state);
      canonical.baseline = filterMasteryBaselineAfterReset(existing.baseline, resetAt);
      canonical.history = existing.history.filter(entry => evidenceAfterReset(entry, resetAt));
      /* When an aggregate crosses the reset boundary it cannot be partitioned;
         rebuild only from post-reset event records, including notebook records
         retained by an older client. */
      if (canonical.baseline.attempts !== existing.baseline.attempts) canonical.history = mergeArray(canonical.history, history);
    } else {
      canonical.history = clone(history);
    }
    if (!hasCanonicalEvidence && !canonical.baseline.attempts && !canonical.history.length && timeValue(state.lastSeenAt) > resetAt) {
      const fallback = legacyMasteryBaseline(state);
      fallback.legacy.firstSeenAt = timeValue(state.lastSeenAt);
      canonical.baseline = assembleMasteryBaseline(fallback.legacy, {}, []);
    }
    if (!canonical.baseline.attempts && !canonical.history.length) return null;
    const output = clone(state);
    output.history = history;
    return rebuildQuestionState(output, canonical);
  }
  function filterMasteryExamAfterReset(exam, resetAt) {
    const source = exam && typeof exam === 'object' ? exam : {};
    const output = {
      questions: {},
      attempts: (source.attempts || []).filter(item => itemAfterReset(item, resetAt)).map(clone),
      sessions: (source.sessions || []).filter(item => itemAfterReset(item, resetAt)).map(clone)
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
