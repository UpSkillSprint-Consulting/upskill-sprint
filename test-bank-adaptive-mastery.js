(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const STORE_KEY = 'tb-adaptive-mastery-v1';
  const DEVICE_KEY = 'tb-account-sync-device-v1';
  const RESET_KEY = 'tb-account-sync-resets-v1';
  const MASTERY_RESET_PREFIX = 'mastery-exam:';
  const STYLE_ID = 'tb-adaptive-mastery-styles';
  const DAY = 86400000;
  const MASTERY_THRESHOLD = 80;
  const SESSION_SIZE = 10;
  const MASTERY_EVIDENCE_LIMIT = 500;

  let scheduled = false;
  let ledgerReconciliationScheduled = false;
  let attempt = null;
  let adaptive = null;
  let notebookFilter = 'all';

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function isRecord(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
  function asRecord(value) { return isRecord(value) ? value : {}; }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>\"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function chartHtml(chart) {
    return (window.__TB && window.__TB.renderQuestionChart) ? window.__TB.renderQuestionChart(chart) : '';
  }

  function announce(message) {
    const live = document.getElementById('tb-feedback-live');
    if (live) live.textContent = message;
  }

  function writeAheadSaved(result) {
    if (result && typeof result === 'object' && result.saved === false) return false;
    const learning = window.__TBLearning;
    const status = learning && typeof learning.status === 'function' ? learning.status() : null;
    return !(status && status.writeAheadSaved === false);
  }

  /* Adaptive practice is learning evidence, not a local-only convenience.
     Never allow a session to begin, mutate, or finish unless its durable
     write-ahead ledger is available.  Otherwise an asset/load failure would
     quietly recreate the exact cross-device data loss this release fixes. */
  function learningLedger(method) {
    const learning = window.__TBLearning;
    return learning && typeof learning[method] === 'function' ? learning : null;
  }

  function durableLearningUnavailable() {
    announce('Adaptive practice is temporarily unavailable because secure learning storage has not loaded. Please refresh and try again.');
  }

  function stripHtml(value) {
    const node = document.createElement('div');
    node.innerHTML = String(value == null ? '' : value);
    return (node.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function hash(value) {
    let output = 2166136261;
    String(value || '').split('').forEach(function (character) {
      output ^= character.charCodeAt(0);
      output = Math.imul(output, 16777619);
    });
    return (output >>> 0).toString(36);
  }

  function registry() { return window.__TBQuestionRegistry || null; }

  function questionId(question) {
    const helper = registry();
    if (helper && typeof helper.idFor === 'function') return helper.idFor(examId(), question);
    return hash(question && question.stem);
  }

  function now() { return Date.now(); }

  function syncDeviceId() {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : 'device-' + now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  }

  function currentResetAt() {
    try {
      const markers = JSON.parse(localStorage.getItem(RESET_KEY) || '{}');
      const value = Number(markers && markers[MASTERY_RESET_PREFIX + examId()] || 0);
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch (error) {
      return 0;
    }
  }

  function examId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function exam() {
    return window.__TB && window.__TB.EXAMS ? window.__TB.EXAMS[examId()] : null;
  }

  function allQuestions() {
    const helper = registry();
    if (helper && typeof helper.questionsFor === 'function') return helper.questionsFor(examId());
    const source = exam();
    const output = [];
    const seen = new Set();
    function add(question) {
      const id = questionId(question);
      if (!question || !question.stem || seen.has(id)) return;
      seen.add(id);
      output.push(question);
    }
    if (source && source.sets) Object.keys(source.sets).forEach(function (key) { asArray(source.sets[key]).forEach(add); });
    if (source && source.bank) asArray(source.bank).forEach(add);
    return output;
  }

  function questionByIdentity(identity, legacyStem) {
    const helper = registry();
    if (helper && typeof helper.find === 'function' && identity) {
      const found = helper.find(examId(), identity);
      if (found) return found;
    }
    return allQuestions().find(function (question) {
      return questionId(question) === identity || question.stem === legacyStem || question.stem === identity;
    }) || null;
  }

  function questionByStem(stem) {
    return questionByIdentity(stem, stem);
  }

  function readStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
      if (!isRecord(parsed) || parsed.version !== 1) return { version: 1, exams: {} };
      parsed.exams = asRecord(parsed.exams);
      return parsed;
    } catch (error) {
      return { version: 1, exams: {} };
    }
  }

  function writeStore(store) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (error) {}
  }

  function examStore(store) {
    store.exams = asRecord(store.exams);
    const id = examId();
    const current = asRecord(store.exams[id]);
    current.questions = asRecord(current.questions);
    current.attempts = asArray(current.attempts);
    current.sessions = asArray(current.sessions);
    store.exams[id] = current;
    return current;
  }

  function initialQuestionState(question) {
    return {
      id: questionId(question),
      questionId: questionId(question),
      stem: question.stem,
      sub: question.sub || 'general',
      attempts: 0,
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      streak: 0,
      ease: 2.3,
      intervalDays: 0,
      dueAt: 0,
      lastSeenAt: 0,
      lastStatus: 'new',
      mastery: 0,
      history: [],
      masteryBaseline: emptyMasteryBaseline(),
      masteryHistory: []
    };
  }

  function count(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
  }

  function evidenceOrder(left, right) {
    const time = Number(left && left.at || 0) - Number(right && right.at || 0);
    if (time) return time;
    const sequence = Number(left && left.priorAttempts || 0) - Number(right && right.priorAttempts || 0);
    if (sequence) return sequence;
    return String(left && left.id || '').localeCompare(String(right && right.id || ''));
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
    Object.keys(devices && typeof devices === 'object' ? devices : {}).sort().forEach(function (device) {
      const component = normalizeMasteryComponent(devices[device]);
      component.streamId = component.streamId || device;
      component.deviceId = component.deviceId || device;
      if (component.attempts || component.sequence) normalizedDevices[device] = component;
    });
    const keys = ['legacy'].concat(Object.keys(normalizedDevices));
    let attempts = 0, correct = 0, incorrect = 0, unanswered = 0, firstSeenAt = 0, unknownFirstSeen = false;
    let latest = emptyMasteryComponent(), latestKey = '';
    keys.forEach(function (key) {
      const component = key === 'legacy' ? normalizedLegacy : normalizedDevices[key];
      attempts += component.attempts; correct += component.correct; incorrect += component.incorrect; unanswered += component.unanswered;
      if (component.attempts && !component.firstSeenAt) unknownFirstSeen = true;
      else if (component.firstSeenAt && (!firstSeenAt || component.firstSeenAt < firstSeenAt)) firstSeenAt = component.firstSeenAt;
      if (component.lastSeenAt > latest.lastSeenAt || (component.lastSeenAt === latest.lastSeenAt && key > latestKey)) { latest = component; latestKey = key; }
    });
    return {
      at: latest.lastSeenAt,
      firstSeenAt: unknownFirstSeen ? 0 : firstSeenAt,
      attempts: attempts,
      correct: correct,
      incorrect: incorrect,
      unanswered: unanswered,
      streak: latest.streak,
      lastSeenAt: latest.lastSeenAt,
      lastStatus: latest.lastStatus,
      legacy: normalizedLegacy,
      devices: normalizedDevices,
      foldedIds: Array.from(new Set(asArray(foldedIds).map(String))).slice(-MASTERY_EVIDENCE_LIMIT)
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
      at: state.lastSeenAt,
      /* Legacy aggregates can include events no longer present in the notebook
         archive, so their true first observation is intentionally unknown. */
      firstSeenAt: 0,
      attempts: state.attempts,
      correct: state.correct,
      incorrect: state.incorrect,
      unanswered: state.unanswered,
      streak: state.streak,
      lastSeenAt: state.lastSeenAt,
      lastStatus: state.lastStatus
    });
    return assembleMasteryBaseline(legacy, {}, []);
  }

  function foldEvidenceIntoBaseline(baseline, entries) {
    const normalized = normalizeMasteryBaseline(baseline);
    const legacy = normalizeMasteryComponent(normalized.legacy);
    const devices = {};
    Object.keys(normalized.devices || {}).forEach(function (device) { devices[device] = normalizeMasteryComponent(normalized.devices[device]); });
    const foldedIds = asArray(normalized.foldedIds).slice();
    asArray(entries).forEach(function (entry) {
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
        const identity = entry && entry.id ? 'id:' + entry.id : 'value:' + hash(JSON.stringify(entry));
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

  function evidenceAlreadyFolded(baseline, entry) {
    const normalized = normalizeMasteryBaseline(baseline);
    const device = entry && entry.deviceId ? String(entry.deviceId) : '';
    const stream = entry && entry.streamId ? String(entry.streamId) : device;
    const sequence = count(entry && entry.sequence);
    if (stream && sequence) return sequence <= count(normalized.devices[stream] && normalized.devices[stream].sequence);
    const identity = entry && entry.id ? 'id:' + entry.id : 'value:' + hash(JSON.stringify(entry));
    return asArray(normalized.foldedIds).indexOf(identity) !== -1;
  }

  function partitionMasteryEvidence(baseline, history) {
    const grouped = {};
    asArray(history).forEach(function (entry) {
      const device = entry && entry.deviceId ? String(entry.deviceId) : '';
      const stream = entry && entry.streamId ? String(entry.streamId) : device;
      const sequence = count(entry && entry.sequence);
      const key = stream && sequence ? 'stream:' + stream : 'legacy';
      grouped[key] = grouped[key] || [];
      grouped[key].push(entry);
    });
    const groups = Object.keys(grouped).sort().map(function (key) {
      const isDevice = key.indexOf('stream:') === 0;
      const items = grouped[key].slice().sort(function (left, right) {
        if (isDevice) {
          const sequence = count(left && left.sequence) - count(right && right.sequence);
          if (sequence) return sequence;
        }
        return evidenceOrder(left, right);
      });
      /* Legacy entries have no source watermark, so compacting them creates an
         aggregate that cannot be safely unioned with another device's. */
      let foldableCount = 0;
      if (isDevice) {
        const stream = key.slice('stream:'.length);
        let expected = count(baseline && baseline.devices && baseline.devices[stream] && baseline.devices[stream].sequence) + 1;
        foldableCount = 0;
        while (foldableCount < items.length && count(items[foldableCount] && items[foldableCount].sequence) === expected) {
          foldableCount += 1;
          expected += 1;
        }
      }
      return { items: items, foldableCount: foldableCount };
    });
    const overflow = [];
    const retained = [];
    groups.forEach(function (group) {
      const requested = Math.max(0, group.items.length - MASTERY_EVIDENCE_LIMIT);
      const folded = Math.min(requested, group.foldableCount);
      overflow.push.apply(overflow, group.items.slice(0, folded));
      retained.push.apply(retained, group.items.slice(folded));
    });
    return { overflow: overflow, retained: retained.sort(evidenceOrder) };
  }

  function compactMasteryEvidence(baseline, history) {
    const normalized = normalizeMasteryBaseline(baseline);
    const sorted = asArray(history).filter(function (entry) { return !evidenceAlreadyFolded(normalized, entry); }).slice().sort(evidenceOrder);
    const partitioned = partitionMasteryEvidence(normalized, sorted);
    return { baseline: foldEvidenceIntoBaseline(normalized, partitioned.overflow), history: partitioned.retained };
  }

  function ensureMasteryEvidence(state) {
    if (state.masteryBaseline && Array.isArray(state.masteryHistory)) {
      return compactMasteryEvidence(state.masteryBaseline, state.masteryHistory);
    }
    return { baseline: legacyMasteryBaseline(state), history: [] };
  }

  function nextEvidenceIdentity(state) {
    const device = syncDeviceId();
    const resetAt = currentResetAt();
    const baseline = normalizeMasteryBaseline(state.masteryBaseline);
    let stream = '', latestAt = -1;
    Object.keys(baseline.devices || {}).forEach(function (key) {
      const component = baseline.devices[key];
      if (component.deviceId === device && component.resetAt === resetAt && component.lastSeenAt >= latestAt) { stream = key; latestAt = component.lastSeenAt; }
    });
    asArray(state.masteryHistory).forEach(function (entry) {
      if (String(entry && entry.deviceId || '') === device && Number(entry && entry.resetAt || 0) === resetAt && Number(entry.at || 0) >= latestAt) {
        stream = String(entry.streamId || entry.deviceId);
        latestAt = Number(entry.at || 0);
      }
    });
    if (!stream) {
      const random = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
      stream = device + '-' + random;
    }
    let sequence = count(baseline.devices[stream] && baseline.devices[stream].sequence);
    asArray(state.masteryHistory).forEach(function (entry) {
      if (String(entry && (entry.streamId || entry.deviceId) || '') === stream) sequence = Math.max(sequence, count(entry.sequence));
    });
    sequence += 1;
    return { id: 'mastery-' + stream + '-' + sequence, deviceId: device, streamId: stream, resetAt: resetAt, sequence: sequence };
  }

  /* A completed ledger answer has a durable, account-wide identity.  Reusing
     that identity in the derived mastery store is important: a laptop can
     derive the same completed phone session before the older snapshot sync
     arrives, and the two copies must merge as one answer rather than double
     the learner's evidence.  Each session/question pair is a small independent
     stream so normal evidence compaction remains safe as the ledger grows. */
  function learningEvidenceIdentity(metadata, questionIdentity) {
    const eventId = metadata && metadata.learningEventId ? String(metadata.learningEventId) : '';
    if (!eventId) return null;
    const sessionId = metadata && metadata.sessionId ? String(metadata.sessionId) : 'session';
    return {
      id: 'ledger-' + eventId,
      deviceId: '',
      streamId: 'ledger:' + sessionId + ':' + String(questionIdentity || 'question'),
      resetAt: currentResetAt(),
      sequence: 1
    };
  }

  function rebuildMasteryState(state, timestamp) {
    const canonical = compactMasteryEvidence(state.masteryBaseline, state.masteryHistory);
    const baseline = canonical.baseline;
    let attempts = baseline.attempts;
    let correct = baseline.correct;
    let incorrect = baseline.incorrect;
    let unanswered = baseline.unanswered;
    let streak = baseline.streak;
    let lastSeenAt = baseline.lastSeenAt;
    let lastStatus = baseline.lastStatus;
    canonical.history.forEach(function (entry) {
      attempts += 1;
      if (entry.status === 'correct') correct += 1;
      else if (entry.status === 'unanswered') unanswered += 1;
      else incorrect += 1;
      streak = entry.status === 'correct' ? streak + 1 : 0;
      if (Number(entry.at || 0) >= lastSeenAt) {
        lastSeenAt = Number(entry.at || 0);
        lastStatus = entry.status || lastStatus;
      }
    });
    state.masteryBaseline = baseline;
    state.masteryHistory = canonical.history;
    state.attempts = attempts;
    state.correct = correct;
    state.incorrect = incorrect;
    state.unanswered = unanswered;
    state.streak = streak;
    state.lastSeenAt = lastSeenAt;
    state.lastStatus = lastStatus;
    state.mastery = calculateMastery(state, timestamp);
    return state;
  }

  function calculateMastery(state, timestamp) {
    if (!state || !state.attempts) return 0;
    const accuracy = state.correct / state.attempts;
    const confidence = Math.min(state.attempts / 5, 1);
    const streak = Math.min(state.streak / 4, 1);
    const ageDays = state.lastSeenAt ? Math.max(0, (timestamp - state.lastSeenAt) / DAY) : 60;
    const recency = Math.max(0, 1 - ageDays / 45);
    const raw = (0.58 * accuracy + 0.24 * streak + 0.18 * recency) * (0.62 + 0.38 * confidence);
    return Math.max(0, Math.min(100, Math.round(raw * 100)));
  }

  function nextSchedule(state, status, timestamp) {
    const correct = status === 'correct';
    if (!correct) {
      state.streak = 0;
      state.intervalDays = 1;
      state.ease = Math.max(1.3, Number((state.ease - 0.2).toFixed(2)));
      state.dueAt = timestamp + DAY;
      return;
    }
    state.streak += 1;
    if (state.streak === 1) state.intervalDays = 1;
    else if (state.streak === 2) state.intervalDays = 3;
    else state.intervalDays = Math.max(4, Math.round(Math.max(state.intervalDays, 3) * state.ease));
    state.ease = Math.min(2.8, Number((state.ease + 0.05).toFixed(2)));
    state.dueAt = timestamp + state.intervalDays * DAY;
  }

  /* Incorrect attempts are retained in full so the mistake notebook remains a
     complete chronological record. Correct/unanswered evidence is capped to
     bound storage growth without erasing historic mistakes. */
  function trimHistory(history) {
    const sorted = asArray(history).slice().sort(evidenceOrder);
    const incorrect = sorted.filter(function (entry) { return entry.status === 'incorrect'; });
    const other = sorted.filter(function (entry) { return entry.status !== 'incorrect'; }).slice(-40);
    return incorrect.concat(other).sort(evidenceOrder);
  }

  function questionSnapshot(question) {
    if (!question || typeof question !== 'object') return null;
    return {
      questionId: questionId(question),
      stem: String(question.stem || ''),
      options: asArray(question.options).map(String),
      answer: Number(question.answer),
      why: String(question.why || ''),
      sub: String(question.sub || 'general'),
      chart: question.chart || null
    };
  }

  function applyResult(state, question, status, selected, source, timestamp, metadata) {
    const canonical = ensureMasteryEvidence(state);
    state.masteryBaseline = canonical.baseline;
    state.masteryHistory = canonical.history;
    rebuildMasteryState(state, timestamp);
    const priorAttempts = state.attempts;
    const identity = learningEvidenceIdentity(metadata, questionId(question)) || nextEvidenceIdentity(state);
    nextSchedule(state, status, timestamp);
    const entry = {
      id: identity.id,
      deviceId: identity.deviceId,
      streamId: identity.streamId,
      resetAt: identity.resetAt,
      sequence: identity.sequence,
      at: timestamp,
      status: status,
      selected: selected,
      source: source,
      attemptId: metadata && metadata.sessionId || null,
      learningEventId: metadata && metadata.learningEventId || null,
      snapshot: questionSnapshot(question),
      priorAttempts: priorAttempts,
      mastery: 0
    };
    state.history = trimHistory(asArray(state.history).concat([entry]));
    state.masteryHistory = state.masteryHistory.concat([entry]);
    rebuildMasteryState(state, timestamp);
    entry.mastery = state.mastery;
    return state;
  }

  function boundedWhole(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
  }

  /* A completed full exam has a distinct immutable score record.  Keep its
     domain denominator separate from mastery evidence: unanswered questions
     do not change mastery, but absolutely do count in the scored exam. */
  function domainBreakdownFromRecords(records) {
    const totals = {};
    asArray(records).forEach(function (result) {
      const question = result && result.question;
      if (!question) return;
      const sub = String(question.sub || 'general');
      const status = result.status === 'correct' || result.status === 'incorrect' || result.status === 'unanswered'
        ? result.status
        : result.selected == null ? 'unanswered' : result.selected === Number(question.answer) ? 'correct' : 'incorrect';
      totals[sub] = totals[sub] || { id: sub, total: 0, correct: 0, incorrect: 0, unanswered: 0 };
      totals[sub].total += 1;
      totals[sub][status] += 1;
    });
    return Object.keys(totals).sort().map(function (id) { return totals[id]; });
  }

  function normaliseDomainBreakdown(source) {
    const raw = Array.isArray(source) ? source : [];
    const totals = {};
    raw.forEach(function (item) {
      if (!isRecord(item)) return;
      const id = String(item.id || item.sub || '');
      if (!id) return;
      const total = boundedWhole(item.total);
      const correct = Math.min(total, boundedWhole(item.correct));
      const unanswered = Math.min(Math.max(0, total - correct), boundedWhole(item.unanswered));
      const suppliedIncorrect = boundedWhole(item.incorrect);
      const incorrect = suppliedIncorrect
        ? Math.min(Math.max(0, total - correct - unanswered), suppliedIncorrect)
        : Math.max(0, total - correct - unanswered);
      totals[id] = { id: id, total: total, correct: correct, incorrect: incorrect, unanswered: unanswered };
    });
    return Object.keys(totals).sort().map(function (id) { return totals[id]; }).filter(function (item) { return item.total > 0; });
  }

  function isCompletedFullTimedExam(metadata, total) {
    if (!metadata || metadata.mode !== 'exam' || metadata.timed !== true || metadata.completed === false) return false;
    const expected = Number(exam() && exam().questions || 0);
    return !expected || Number(total) === expected;
  }

  function recordResults(records, source) {
    records = asArray(records);
    if (!records.length) return null;
    const metadata = isRecord(source) ? source : { source: source };
    const sourceLabel = metadata.source || 'practice';
    const timestamp = Number(metadata.at || now());
    const store = readStore();
    const data = examStore(store);
    const attemptId = metadata.sessionId || examId() + '-' + timestamp.toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    const existing = metadata.sessionId && asArray(data.attempts).find(function (entry) { return entry && entry.id === attemptId; });
    /* A phone/laptop may both hydrate the same immutable completed session.
       The session ID is the idempotency key for the derived mastery record. */
    if (existing) return existing;
    const declaredTotal = Number(metadata.total);
    const declaredCorrect = Number(metadata.correct);
    const summary = {
      id: attemptId, at: timestamp, resetAt: currentResetAt(), source: sourceLabel,
      mode: metadata.mode || null, timed: metadata.timed == null ? null : Boolean(metadata.timed),
      completed: metadata.completed !== false,
      total: Number.isFinite(declaredTotal) && declaredTotal >= records.length ? declaredTotal : records.length,
      correct: 0, repeated: 0, newQuestions: 0
    };

    records.forEach(function (result, index) {
      const question = result.question;
      if (!question) return;
      /* A test can be completed or timed out with some questions blank. Those
         blanks belong in the immutable session score, but they are not answer
         evidence: they must not inflate total-answer counts or depress mastery
         as if the learner submitted an incorrect choice. */
      if (result.status === 'unanswered') return;
      const key = questionId(question);
      const legacyKey = hash(question.stem);
      let state = isRecord(data.questions[key]) ? data.questions[key] : (isRecord(data.questions[legacyKey]) ? data.questions[legacyKey] : initialQuestionState(question));
      if (key !== legacyKey && data.questions[legacyKey] === state) delete data.questions[legacyKey];
      state.id = key;
      state.questionId = key;
      if (state.attempts) summary.repeated += 1;
      else summary.newQuestions += 1;
      if (result.status === 'correct') summary.correct += 1;
      data.questions[key] = applyResult(state, question, result.status, result.selected, sourceLabel, timestamp, {
        sessionId: attemptId,
        learningEventId: asArray(metadata.eventIds)[index] || null
      });
    });

    /* A retired question can lack both a current registry entry and an older
       snapshot. Its evidence cannot be reconstructed, but the immutable
       completion score should still remain accurate in the exam history. */
    if (Number.isFinite(declaredCorrect) && declaredCorrect >= 0 && declaredCorrect <= summary.total) {
      summary.correct = Math.floor(declaredCorrect);
    }

    if (isCompletedFullTimedExam(metadata, summary.total)) {
      const supplied = normaliseDomainBreakdown(metadata.domainBreakdown);
      const derived = supplied.length ? supplied : domainBreakdownFromRecords(records);
      if (derived.length) summary.domainBreakdown = derived;
    }

    data.attempts = asArray(data.attempts).concat([summary]).slice(-500);
    writeStore(store);
    try { document.dispatchEvent(new CustomEvent('tb:learning-recorded', { detail: summary })); } catch (error) {}
    return summary;
  }

  function ledgerSource(mode) {
    if (mode === 'exam') return 'exam-attempt';
    if (mode === 'quick') return 'quick-quiz';
    if (mode === 'focus') return 'focused-quiz';
    if (mode === 'diagnostic') return 'diagnostic';
    if (mode === 'practice') return 'weak-area-practice';
    return 'adaptive-practice';
  }

  function ledgerEventAfter(left, right) {
    if (!left) return true;
    const leftAt = Number(left.occurredAt || 0);
    const rightAt = Number(right && right.occurredAt || 0);
    return rightAt > leftAt || (rightAt === leftAt && String(right && right.id || '') > String(left.id || ''));
  }

  function ledgerNumber(value) {
    if (value == null || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function ledgerQuestion(identity, answerEvent) {
    const helper = registry();
    const snapshot = asRecord(asRecord(answerEvent && answerEvent.payload).snapshot);
    if (snapshot.stem && asArray(snapshot.options).length) {
      /* Prefer the immutable answer-time content over today's registry entry:
         a wording or explanation correction must not rewrite a learner's
         historic mistake notebook. */
      return {
        questionId: String(identity || ''),
        stem: String(snapshot.stem || ''),
        options: asArray(snapshot.options).map(String),
        answer: Number(snapshot.answer),
        why: String(snapshot.why || ''),
        sub: String(snapshot.sub || 'general'),
        chart: snapshot.chart || null
      };
    }
    return helper && typeof helper.find === 'function' ? helper.find(examId(), identity) : null;
  }

  function ledgerAnswerStatus(answer, question) {
    const status = String(answer && answer.status || '');
    if (status === 'correct' || status === 'incorrect' || status === 'unanswered') return status;
    const selected = ledgerNumber(answer && answer.selected);
    return selected == null ? 'unanswered' : selected === Number(question && question.answer) ? 'correct' : 'incorrect';
  }

  /* Convert immutable session-completed rows into the same record shape used
     by a live quiz.  The completed payload is canonical when an answer was
     revised after its first write-ahead upload; the answer event supplies the
     immutable question snapshot for the mistake notebook. */
  function normaliseLedgerEvent(event) {
    const source = asRecord(event);
    return {
      id: String(source.id || source.event_id || ''),
      type: String(source.type || source.event_type || ''),
      examId: String(source.examId || source.exam_id || ''),
      sessionId: String(source.sessionId || source.session_id || ''),
      questionId: source.questionId || source.question_id ? String(source.questionId || source.question_id) : null,
      occurredAt: Number(source.occurredAt || Date.parse(source.occurred_at || '') || 0),
      payload: asRecord(source.payload)
    };
  }

  function ledgerDomainBreakdown(answers, answersBySession, sessionId) {
    const finalByQuestion = {};
    asArray(answers).forEach(function (answer) {
      const item = asRecord(answer);
      const id = String(item.questionId || '');
      if (id) finalByQuestion[id] = item;
    });
    const totals = {};
    Object.keys(finalByQuestion).sort().forEach(function (id) {
      const answer = finalByQuestion[id];
      const answerEvent = answersBySession[String(sessionId) + '|' + id] || null;
      const payload = asRecord(answerEvent && answerEvent.payload);
      const snapshot = asRecord(payload.snapshot);
      const question = ledgerQuestion(id, answerEvent);
      const sub = String(answer.sub || payload.sub || snapshot.sub || question && question.sub || 'general');
      const status = ledgerAnswerStatus(answer, question);
      totals[sub] = totals[sub] || { id: sub, total: 0, correct: 0, incorrect: 0, unanswered: 0 };
      totals[sub].total += 1;
      totals[sub][status] += 1;
    });
    return Object.keys(totals).sort().map(function (id) { return totals[id]; });
  }

  function completedLedgerSessions(sourceEvents) {
    const learning = window.__TBLearning;
    const rawEvents = sourceEvents == null
      ? (learning && typeof learning.eventsForExam === 'function' ? learning.eventsForExam(examId()) : [])
      : sourceEvents;
    const events = asArray(rawEvents).map(normaliseLedgerEvent).filter(function (event) {
      return event.examId === examId();
    }).sort(function (left, right) {
      return Number(left && left.occurredAt || 0) - Number(right && right.occurredAt || 0) || String(left && left.id || '').localeCompare(String(right && right.id || ''));
    });
    const answersBySession = {};
    const completed = [];
    events.forEach(function (event) {
      if (!event || !event.sessionId) return;
      const sessionId = String(event.sessionId);
      if (event.type === 'answer_recorded' && event.questionId) {
        const key = sessionId + '|' + String(event.questionId);
        if (ledgerEventAfter(answersBySession[key], event)) answersBySession[key] = event;
      }
      if (event.type === 'session_completed') completed.push(event);
    });
    return completed.map(function (event) {
      const payload = asRecord(event.payload);
      let answers = asArray(payload.answers).map(function (answer) { return asRecord(answer); });
      if (!answers.length) {
        answers = Object.keys(answersBySession).filter(function (key) {
          return key.indexOf(String(event.sessionId) + '|') === 0;
        }).map(function (key) {
          const answerEvent = answersBySession[key];
          const answerPayload = asRecord(answerEvent && answerEvent.payload);
          return {
            questionId: answerEvent.questionId,
            selected: answerPayload.selected,
            status: answerPayload.status,
            sub: String(answerPayload.sub || asRecord(answerPayload.snapshot).sub || 'general')
          };
        });
      }
      const seen = {};
      const records = [];
      const eventIds = [];
      const completionEventIds = asArray(payload.answerEventIds);
      answers.forEach(function (answer, answerIndex) {
        const identity = String(answer.questionId || '');
        if (!identity || seen[identity]) return;
        seen[identity] = true;
        const answerEvent = answersBySession[String(event.sessionId) + '|' + identity] || null;
        const question = ledgerQuestion(identity, answerEvent);
        if (!question) return;
        records.push({ question: question, selected: ledgerNumber(answer.selected), status: ledgerAnswerStatus(answer, question) });
        eventIds.push(answerEvent && answerEvent.id || completionEventIds[answerIndex] || null);
      });
      return {
        id: String(event.sessionId),
        at: Number(event.occurredAt || 0),
        mode: String(payload.mode || 'practice'),
        timed: Boolean(payload.timed),
        total: Number(payload.total || records.length),
        correct: payload.correct,
        records: records,
        eventIds: eventIds,
        domainBreakdown: ledgerDomainBreakdown(answers, answersBySession, event.sessionId)
      };
    });
  }

  /* The append-only account ledger is the cross-device source of truth.  Its
     derived mastery record is idempotent by completed session ID, so this can
     run after every phone/laptop hydration without waiting for the legacy
     browser-snapshot merger.  Reset markers intentionally win over older
     ledger sessions and prevent a reset from resurrecting prior evidence. */
  function reconcileLearningLedger(sourceEvents) {
    const resetAt = currentResetAt();
    let imported = 0;
    completedLedgerSessions(sourceEvents).forEach(function (session) {
      if (!session.id || !session.records.length || (resetAt && session.at <= resetAt)) return;
      const store = readStore();
      const data = examStore(store);
      const exists = asArray(data.attempts).some(function (entry) { return entry && entry.id === session.id; });
      if (exists) return;
      const result = recordResults(session.records, {
        source: ledgerSource(session.mode),
        mode: session.mode,
        timed: session.timed,
        sessionId: session.id,
        at: session.at || now(),
        completed: true,
        total: session.total,
        correct: session.correct,
        eventIds: session.eventIds,
        domainBreakdown: session.domainBreakdown
      });
      if (result) imported += 1;
    });
    return imported;
  }

  function scheduleLedgerReconciliation() {
    if (ledgerReconciliationScheduled) return;
    ledgerReconciliationScheduled = true;
    window.setTimeout(function () {
      ledgerReconciliationScheduled = false;
      reconcileLearningLedger();
    }, 0);
  }

  function captureCurrent() {
    /* The core quiz itself now uses the ledger.  Do not retain this historical
       DOM-scrape fallback: it could create local-only mastery evidence when
       the ledger script failed to load. */
    return;
  }

  function finalizeAttempt() {
    /* Completion is derived by the durable ledger after its write-ahead save;
       never scrape the DOM into a local-only history as a fallback. */
    return;
  }

  function stateFor(question, data) {
    const state = data.questions[questionId(question)] || data.questions[hash(question.stem)];
    return isRecord(state) ? state : initialQuestionState(question);
  }

  function unattemptedFilter(questions) {
    const store = readStore();
    const data = examStore(store);
    return asArray(questions).filter(function (question) {
      if (window.__TBLearning && typeof window.__TBLearning.hasSeen === 'function') return question && !window.__TBLearning.hasSeen(examId(), question);
      return question && stateFor(question, data).attempts === 0;
    });
  }

  // "Historically missed": any question with at least one incorrect attempt, ever -- even if
  // later answered correctly and now well-mastered. Distinct from the Mistake Notebook's
  // "still shaky" definition (last-attempt-wrong OR below the mastery threshold), which drops
  // a question once it's been nailed a couple of times in a row.
  function missedFilter(questions) {
    const store = readStore();
    const data = examStore(store);
    return asArray(questions).filter(function (question) {
      return question && stateFor(question, data).incorrect > 0;
    });
  }

  function dueQuestions(data, timestamp) {
    return allQuestions().filter(function (question) {
      const state = stateFor(question, data);
      return state.attempts > 0 && state.dueAt <= timestamp;
    });
  }

  function weakQuestions(data) {
    return allQuestions().filter(function (question) {
      const state = stateFor(question, data);
      return state.attempts > 0 && state.mastery < MASTERY_THRESHOLD;
    }).sort(function (a, b) {
      return stateFor(a, data).mastery - stateFor(b, data).mastery;
    });
  }

  function adaptiveCandidates(data, limit) {
    const timestamp = now();
    const due = dueQuestions(data, timestamp);
    const weak = weakQuestions(data);
    const unseen = allQuestions().filter(function (question) {
      return window.__TBLearning && typeof window.__TBLearning.hasSeen === 'function'
        ? !window.__TBLearning.hasSeen(examId(), question)
        : !stateFor(question, data).attempts;
    });
    const chosen = [];
    const seen = new Set();

    function add(question) {
      const id = questionId(question);
      if (!question || seen.has(id) || chosen.length >= limit) return;
      seen.add(id);
      chosen.push(question);
    }

    due.sort(function (a, b) { return stateFor(a, data).dueAt - stateFor(b, data).dueAt; }).forEach(add);
    weak.forEach(add);
    const newTarget = Math.max(1, Math.round(limit * 0.2));
    unseen.slice(0, newTarget).forEach(add);
    allQuestions().sort(function (a, b) { return stateFor(a, data).mastery - stateFor(b, data).mastery; }).forEach(add);
    return chosen.slice(0, limit);
  }

  function masterySummary(data, timestamp) {
    timestamp = Number(timestamp || now());
    const states = Object.values(data.questions || {});
    const attempted = states.filter(function (state) { return state.attempts > 0; });
    /* Use the same time-aware estimate that drives readiness, rather than a
       score frozen at the last answer. A question is mastered only after
       three answered retrievals at 80%+ effective mastery. */
    const overall = attempted.length ? Math.round(attempted.reduce(function (sum, state) { return sum + calculateMastery(state, timestamp); }, 0) / attempted.length) : 0;
    const mastered = attempted.filter(function (state) { return state.attempts >= 3 && calculateMastery(state, timestamp) >= MASTERY_THRESHOLD; }).length;
    const due = attempted.filter(function (state) { return state.dueAt <= timestamp; }).length;
    const notebook = attempted.filter(function (state) { return state.lastStatus !== 'correct' || calculateMastery(state, timestamp) < MASTERY_THRESHOLD; }).length;
    return { overall: overall, mastered: mastered, due: due, attempted: attempted.length, notebook: notebook };
  }

  function subtopicName(subId) {
    let name = subId || 'General';
    const source = exam();
    (source && source.bok ? source.bok : []).some(function (domain) {
      return (domain.subs || []).some(function (sub) {
        if (sub && typeof sub === 'object' && sub.id === subId) { name = sub.name || sub.id; return true; }
        return false;
      });
    });
    return name;
  }

  function lessonFor(subId) {
    let result = { href: '/lessons', name: 'Review related lessons' };
    const source = exam();
    (source && source.bok ? source.bok : []).some(function (domain) {
      return (domain.subs || []).some(function (sub) {
        if (sub && typeof sub === 'object' && sub.id === subId) {
          result = { href: sub.lesson || '/lessons', name: sub.lessonName || 'Review related lesson' };
          return true;
        }
        return false;
      });
    });
    return result;
  }

  function weakSubtopics(data) {
    const groups = {};
    Object.values(data.questions || {}).forEach(function (state) {
      if (!state.attempts) return;
      groups[state.sub] = groups[state.sub] || { total: 0, count: 0, due: 0 };
      groups[state.sub].total += state.mastery;
      groups[state.sub].count += 1;
      if (state.dueAt <= now()) groups[state.sub].due += 1;
    });
    return Object.keys(groups).map(function (sub) {
      return { sub: sub, mastery: Math.round(groups[sub].total / groups[sub].count), due: groups[sub].due };
    }).sort(function (a, b) { return a.mastery - b.mastery; }).slice(0, 5);
  }

  function improvement(data) {
    let firstCorrect = 0;
    let firstTotal = 0;
    let repeatCorrect = 0;
    let repeatTotal = 0;
    Object.values(data.questions || {}).forEach(function (state) {
      const evidence = Array.isArray(state.masteryHistory) ? state.masteryHistory : asArray(state.history);
      evidence.forEach(function (entry) {
        if (!Number.isFinite(Number(entry.priorAttempts))) return;
        if (Number(entry.priorAttempts) === 0) {
          firstTotal += 1;
          if (entry.status === 'correct') firstCorrect += 1;
        } else {
          repeatTotal += 1;
          if (entry.status === 'correct') repeatCorrect += 1;
        }
      });
    });
    return {
      first: firstTotal ? Math.round(firstCorrect / firstTotal * 100) : 0,
      repeat: repeatTotal ? Math.round(repeatCorrect / repeatTotal * 100) : 0,
      firstTotal: firstTotal,
      repeatTotal: repeatTotal
    };
  }

  function trend(data) {
    return asArray(data.attempts).slice(-8).map(function (entry) {
      return entry.total ? Math.round(entry.correct / entry.total * 100) : 0;
    });
  }

  function dashboardMarkup(data) {
    const summary = masterySummary(data);
    const weak = weakSubtopics(data);
    const gains = improvement(data);
    const bars = trend(data);
    return '<section id="tb-adaptive-mastery" class="tb-mastery" aria-labelledby="tb-mastery-title">' +
      '<div class="tb-mastery-head"><div><div class="tb-diag-kick">Phase 3 · Adaptive mastery</div><h2 id="tb-mastery-title">Turn every attempt into a targeted study plan.</h2><p>Mastery combines accuracy, repeated success, recency, and evidence volume. It is a learning estimate—not an exam guarantee.</p></div>' +
      '<div class="tb-mastery-ring" style="--p:' + summary.overall + '"><strong>' + summary.overall + '%</strong><span>estimated mastery</span></div></div>' +
      '<div class="tb-mastery-stats"><div data-mastery-metric="due"><strong>' + summary.due + '</strong><span>reviews due</span></div><div data-mastery-metric="mastered"><strong>' + summary.mastered + '</strong><span>questions mastered</span></div><div data-mastery-metric="notebook"><strong>' + summary.notebook + '</strong><span>notebook items</span></div><div data-mastery-metric="attempted"><strong>' + summary.attempted + '</strong><span>questions attempted</span></div></div>' +
      '<div class="tb-mastery-actions"><button type="button" class="btn btn-teal" data-start-adaptive>Start adaptive practice</button><button type="button" class="tb-ghost" data-open-notebook>Open mistake notebook</button><button type="button" class="tb-ghost" data-open-mastery-details>View mastery details</button></div>' +
      '<div class="tb-mastery-grid">' +
        '<section><div class="tb-sec">Weakest subtopics</div><div class="tb-weak-list">' + (weak.length ? weak.map(function (item) { return '<div><span>' + esc(subtopicName(item.sub)) + '</span><b>' + item.mastery + '%</b><i style="--p:' + item.mastery + '"></i></div>'; }).join('') : '<p>Complete an attempt to build your mastery map.</p>') + '</div></section>' +
        '<section><div class="tb-sec">Learning improvement</div><div class="tb-improvement"><div><span>First encounters</span><strong>' + gains.first + '%</strong><small>' + gains.firstTotal + ' answers</small></div><div><span>Repeated questions</span><strong>' + gains.repeat + '%</strong><small>' + gains.repeatTotal + ' answers</small></div></div></section>' +
        '<section><div class="tb-sec">Recent attempt trend</div><div class="tb-trend" aria-label="Recent attempt accuracy">' + (bars.length ? bars.map(function (value) { return '<i style="--p:' + value + '" title="' + value + '%"><span></span></i>'; }).join('') : '<p>No attempt history yet.</p>') + '</div></section>' +
      '</div><div id="tb-adaptive-panel" class="tb-adaptive-panel" hidden></div></section>';
  }

  function renderDashboard() {
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback || document.getElementById('tb-adaptive-mastery')) return;
    const store = readStore();
    const data = examStore(store);
    feedback.insertAdjacentHTML('beforeend', dashboardMarkup(data));
  }

  // Same mount as renderDashboard, but into an arbitrary container instead of requiring
  // #tb-feedback-loop (which only exists right after a live, in-session results screen).
  // Reads the same persisted mastery store, so it works from a fresh page load too.
  // Idempotent: returns the existing #tb-adaptive-mastery node if one is already mounted.
  function renderStandalone(container) {
    if (!container) return null;
    const existing = document.getElementById('tb-adaptive-mastery');
    if (existing) return existing;
    ensureStyles();
    const store = readStore();
    const data = examStore(store);
    const holder = document.createElement('div');
    holder.innerHTML = dashboardMarkup(data);
    const node = holder.firstElementChild;
    if (!node) return null;
    container.appendChild(node);
    return node;
  }

  function adaptiveQuestionMarkup(question, index, total) {
    const store = readStore();
    const data = examStore(store);
    const state = stateFor(question, data);
    const selected = adaptive.answers[index];
    const checked = adaptive.checked[index];
    const options = question.options.map(function (option, optionIndex) {
      let cls = 'tb-adaptive-option';
      if (selected === optionIndex) cls += ' selected';
      if (checked && optionIndex === question.answer) cls += ' correct';
      if (checked && selected === optionIndex && optionIndex !== question.answer) cls += ' wrong';
      return '<button type="button" class="' + cls + '" data-adaptive-opt="' + optionIndex + '"' + (checked ? ' disabled' : '') + '><span>' + String.fromCharCode(65 + optionIndex) + '</span>' + esc(option) + '</button>';
    }).join('');
    const status = selected == null ? 'unanswered' : selected === question.answer ? 'correct' : 'incorrect';
    return '<div class="tb-adaptive-head"><div><div class="tb-diag-kick">Adaptive practice · ' + (index + 1) + ' of ' + total + '</div><h3>' + esc(subtopicName(question.sub)) + '</h3></div><div class="tb-adaptive-mastery-chip">Current mastery <strong>' + state.mastery + '%</strong></div></div>' +
      chartHtml(question.chart) + '<div class="tb-adaptive-stem">' + esc(question.stem) + '</div><div class="tb-adaptive-options">' + options + '</div>' +
      (checked ? '<div class="tb-adaptive-feedback ' + status + '"><strong>' + (status === 'correct' ? 'Correct.' : 'Not yet.') + '</strong><div>' + (question.why || 'A stored explanation is not available.') + '</div></div>' : '') +
      '<div class="tb-adaptive-actions">' + (!checked ? '<button type="button" class="btn btn-teal" data-adaptive-check' + (selected == null ? ' disabled' : '') + '>Check answer</button>' : '<button type="button" class="btn btn-teal" data-adaptive-next>' + (index === total - 1 ? 'Finish session' : 'Next question') + '</button>') + '<button type="button" class="tb-ghost" data-close-adaptive>Close</button></div>';
  }

  function adaptiveSummaryMarkup() {
    const total = adaptive.items.length;
    const correct = adaptive.items.reduce(function (count, question, index) { return count + (adaptive.answers[index] === question.answer ? 1 : 0); }, 0);
    return '<div class="tb-adaptive-summary"><div class="tb-ring big" style="--p:' + Math.round(correct / Math.max(total, 1) * 100) + '"><span>' + correct + '<small>/' + total + '</small></span></div><div><div class="tb-diag-kick">Adaptive session complete</div><h3>Your mastery map has been updated.</h3><p>The next review dates, weak-area ranking, mistake notebook, and repeated-question trend now reflect this session.</p><div class="tb-adaptive-actions"><button type="button" class="btn btn-teal" data-restart-adaptive>Build another session</button><button type="button" class="tb-ghost" data-close-adaptive>Return to results</button></div></div></div>';
  }

  function renderAdaptive() {
    const panel = document.getElementById('tb-adaptive-panel');
    if (!panel || !adaptive) return;
    panel.hidden = false;
    panel.innerHTML = adaptive.complete ? adaptiveSummaryMarkup() : adaptiveQuestionMarkup(adaptive.items[adaptive.index], adaptive.index, adaptive.items.length);
    panel.tabIndex = -1;
    panel.focus();
  }

  function startAdaptive() {
    const store = readStore();
    const data = examStore(store);
    const items = adaptiveCandidates(data, SESSION_SIZE);
    const learning = learningLedger('startSession');
    if (!learning) { durableLearningUnavailable(); return; }
    const started = learning.startSession({ examId: examId(), questions: items, mode: 'adaptive', timed: false, returnResult: true });
    const sessionId = started && typeof started === 'object' ? started.sessionId : started;
    if (!started || !writeAheadSaved(started)) {
      announce('Adaptive practice could not be saved on this device. Check available browser storage, then try again.');
      return;
    }
    adaptive = { id: sessionId, items: items, index: 0, answers: {}, checked: {}, results: [], complete: false };
    renderAdaptive();
  }

  function finishAdaptiveQuestion() {
    const question = adaptive.items[adaptive.index];
    const selected = adaptive.answers[adaptive.index];
    const status = selected == null ? 'unanswered' : selected === question.answer ? 'correct' : 'incorrect';
    /* Completion can deliberately remain on this final question when the
       ledger's local write-ahead save fails. Keep the retry idempotent rather
       than appending the same answer every time Finish is pressed. */
    adaptive.results[adaptive.index] = { question: question, selected: selected, status: status };
  }

  function finishAdaptiveSession() {
    const learning = learningLedger('completeSession');
    if (!learning || !adaptive.id) { durableLearningUnavailable(); return false; }
    const completed = learning.completeSession({ examId: examId(), sessionId: adaptive.id, mode: 'adaptive', timed: false, records: adaptive.results });
    if (!completed || !writeAheadSaved(completed)) {
      announce('Your completed adaptive session is still waiting for a safe local save. Please try finishing it again.');
      return false;
    }
    adaptive.complete = true;
    renderAdaptive();
    return true;
  }

  /* Flattens every stored incorrect attempt, across every question, into a
     single chronological log entry list (most recent first). Each entry
     carries the question object (for the full stem/options/answer snapshot)
     alongside the knowledge-area id and when/how the attempt happened. */
  function mistakeEntries(data) {
    const rows = [];
    Object.keys(data.questions || {}).forEach(function (key) {
      const state = data.questions[key];
      asArray(state.history).forEach(function (entry) {
        if (entry.status !== 'incorrect') return;
        const snapshot = asRecord(entry && entry.snapshot);
        /* An incorrect answer is a historical record. Prefer its immutable
           answer-time snapshot whenever it has enough content to render; a
           later edit to the live test bank must not rewrite the notebook. */
        const hasSnapshot = Boolean(snapshot.stem && asArray(snapshot.options).length);
        const question = hasSnapshot ? snapshot : questionByIdentity(state.questionId || state.id || key, state.stem);
        if (!question || !question.stem || !asArray(question.options).length) return;
        rows.push({ question: question, sub: state.sub, at: entry.at, selected: entry.selected, source: entry.source });
      });
    });
    return rows.sort(function (a, b) { return (b.at || 0) - (a.at || 0); });
  }

  function mistakeKnowledgeAreas(entries) {
    const seen = {};
    const list = [];
    entries.forEach(function (entry) {
      if (seen[entry.sub]) return;
      seen[entry.sub] = true;
      list.push(entry.sub);
    });
    return list.sort(function (a, b) { return subtopicName(a).localeCompare(subtopicName(b)); });
  }

  function formatAttemptWhen(timestamp) {
    return timestamp ? new Date(timestamp).toLocaleString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Unknown date';
  }

  function sourceLabel(source) {
    if (source === 'adaptive-practice' || source === 'adaptive-practice-v2') return 'Adaptive practice';
    if (source === 'exam-attempt') return 'Timed full exam';
    if (source === 'quick-quiz') return 'Quick quiz';
    if (source === 'focused-quiz') return 'Focused quiz';
    if (source === 'diagnostic') return 'Placement diagnostic';
    if (source === 'weak-area-practice') return 'Weak-area practice';
    return source ? esc(source) : 'Practice';
  }

  function mistakeOptionMarkup(question, entry) {
    return question.options.map(function (option, optionIndex) {
      let cls = 'tb-mistake-opt';
      if (optionIndex === question.answer) cls += ' tb-mistake-opt-correct';
      if (entry.selected === optionIndex && optionIndex !== question.answer) cls += ' tb-mistake-opt-wrong';
      const tag = optionIndex === question.answer ? '<em>Correct answer</em>' : (entry.selected === optionIndex ? '<em>Your answer</em>' : '');
      return '<li class="' + cls + '"><span>' + String.fromCharCode(65 + optionIndex) + '</span><div>' + esc(option) + tag + '</div></li>';
    }).join('');
  }

  function mistakeCardMarkup(entry) {
    const question = entry.question;
    const lesson = lessonFor(entry.sub);
    return '<article class="tb-mistake-card">' +
      '<div class="tb-mistake-meta"><span class="tb-mistake-sub">' + esc(subtopicName(entry.sub)) + '</span><span class="tb-mistake-when">' + formatAttemptWhen(entry.at) + ' · ' + sourceLabel(entry.source) + '</span></div>' +
      chartHtml(question.chart) +
      '<div class="tb-mistake-stem">' + esc(question.stem) + '</div>' +
      '<ol class="tb-mistake-options">' + mistakeOptionMarkup(question, entry) + '</ol>' +
      (question.why ? '<div class="tb-mistake-why"><strong>Why:</strong> ' + question.why + '</div>' : '') +
      '<a class="tb-mistake-link" href="' + esc(lesson.href) + '">Review: ' + esc(lesson.name) + '</a>' +
      '</article>';
  }

  function notebookMarkup(data, filter) {
    const entries = mistakeEntries(data);
    const areas = mistakeKnowledgeAreas(entries);
    const activeFilter = filter && areas.indexOf(filter) !== -1 ? filter : 'all';
    const shown = activeFilter === 'all' ? entries : entries.filter(function (entry) { return entry.sub === activeFilter; });
    const filterOptions = '<option value="all">All knowledge areas</option>' + areas.map(function (sub) {
      return '<option value="' + esc(sub) + '"' + (sub === activeFilter ? ' selected' : '') + '>' + esc(subtopicName(sub)) + '</option>';
    }).join('');
    return '<div class="tb-notebook-head"><div><div class="tb-diag-kick">Mistake notebook</div><h3>Every question answered incorrectly</h3><p>A complete, chronological record of missed questions across every test and practice attempt. Entries stay here as a permanent study log, even after a question is later answered correctly.</p></div><button type="button" class="tb-ghost" data-close-adaptive>Close</button></div>' +
      (entries.length ? '<div class="tb-notebook-filter"><label for="tb-notebook-filter-select">Knowledge area</label><select id="tb-notebook-filter-select" data-notebook-filter>' + filterOptions + '</select><span class="tb-notebook-count">' + shown.length + ' of ' + entries.length + ' missed attempt' + (entries.length === 1 ? '' : 's') + '</span></div>' : '') +
      '<div class="tb-notebook-list">' + (shown.length ? shown.map(mistakeCardMarkup).join('') : '<p class="tb-review-empty">' + (entries.length ? 'No missed questions in this knowledge area yet.' : 'Your mistake notebook is empty.') + '</p>') + '</div>';
  }

  function detailsMarkup(data) {
    const summary = masterySummary(data);
    return '<div class="tb-notebook-head"><div><div class="tb-diag-kick">Mastery model details</div><h3>How your estimate is calculated</h3></div><button type="button" class="tb-ghost" data-close-adaptive>Close</button></div>' +
      '<div class="tb-mastery-explain"><p><strong>Accuracy (58%)</strong> measures the proportion answered correctly.</p><p><strong>Success streak (24%)</strong> rewards repeated correct retrieval rather than one lucky answer.</p><p><strong>Recency (18%)</strong> gradually lowers confidence when knowledge has not been retrieved recently.</p><p><strong>Evidence adjustment</strong> limits high mastery from a small sample. A question is counted as mastered only after at least three answered attempts and an effective estimate of ' + MASTERY_THRESHOLD + '% or higher.</p><p><strong>Current scope:</strong> ' + summary.attempted + ' questions attempted. This estimate supports study prioritization; it does not predict an official examination result.</p></div>';
  }

  function renderNotebook() {
    const panel = document.getElementById('tb-adaptive-panel');
    if (!panel || panel.hidden) return;
    const store = readStore();
    panel.innerHTML = notebookMarkup(examStore(store), notebookFilter);
  }

  function openNotebook() {
    const panel = document.getElementById('tb-adaptive-panel');
    if (!panel) return;
    notebookFilter = 'all';
    panel.hidden = false;
    renderNotebook();
    panel.tabIndex = -1;
    panel.focus();
  }

  function openDetails() {
    const panel = document.getElementById('tb-adaptive-panel');
    const store = readStore();
    if (!panel) return;
    panel.hidden = false;
    panel.innerHTML = detailsMarkup(examStore(store));
    panel.tabIndex = -1;
    panel.focus();
  }

  function closePanel() {
    const panel = document.getElementById('tb-adaptive-panel');
    if (panel) { panel.hidden = true; panel.innerHTML = ''; }
  }

  function refreshDashboard() {
    const current = document.getElementById('tb-adaptive-mastery');
    if (!current) return;
    const parent = current.parentElement;
    current.remove();
    const store = readStore();
    const holder = document.createElement('div');
    holder.innerHTML = dashboardMarkup(examStore(store));
    parent.appendChild(holder.firstElementChild);
  }

  /* A remote phone/laptop reconciliation can change the derived mastery store
     while the analytics dashboard is already open. Update the four summary
     counters in place: rebuilding the whole dashboard here would remove an
     open radar/notebook and make live sync look broken. */
  function refreshDashboardMetrics() {
    const current = document.getElementById('tb-adaptive-mastery');
    if (!current) return;
    const summary = masterySummary(examStore(readStore()), now());
    ['due', 'mastered', 'notebook', 'attempted'].forEach(function (key) {
      const node = current.querySelector('[data-mastery-metric="' + key + '"] strong');
      const value = String(summary[key] == null ? 0 : summary[key]);
      if (node && node.textContent !== value) node.textContent = value;
    });
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '.tb-mastery{margin-top:22px;padding:20px;border:1px solid var(--line);border-radius:13px;background:linear-gradient(180deg,color-mix(in srgb,#6656b5 7%,var(--card)),var(--card))}.tb-mastery-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.tb-mastery-head h2{font-family:"Source Serif 4",serif;font-size:23px;color:var(--ink);margin:3px 0 7px}.tb-mastery-head p{max-width:72ch;color:var(--muted);font-size:13px;line-height:1.55;margin:0}.tb-mastery-ring{--p:0;width:104px;height:104px;flex:0 0 auto;border-radius:50%;display:grid;place-content:center;text-align:center;background:conic-gradient(#6656b5 calc(var(--p)*1%),var(--line) 0);position:relative}.tb-mastery-ring:before{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--card)}.tb-mastery-ring strong,.tb-mastery-ring span{position:relative}.tb-mastery-ring strong{font-size:24px;color:var(--ink)}.tb-mastery-ring span{font-size:9px;color:var(--muted);text-transform:uppercase}.tb-mastery-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:16px 0}.tb-mastery-stats div{padding:12px;border:1px solid var(--line);border-radius:9px;background:var(--card);text-align:center}.tb-mastery-stats strong{display:block;color:var(--ink);font-size:21px}.tb-mastery-stats span{color:var(--muted);font-size:10.5px}.tb-mastery-actions,.tb-adaptive-actions{display:flex;flex-wrap:wrap;gap:9px}.tb-mastery-grid{display:grid;grid-template-columns:1.25fr .9fr .85fr;gap:12px;margin-top:16px}.tb-mastery-grid>section{padding:14px;border:1px solid var(--line);border-radius:10px;background:var(--card)}.tb-weak-list{display:grid;gap:9px;margin-top:10px}.tb-weak-list>div{display:grid;grid-template-columns:1fr auto;gap:4px 10px;align-items:center;font-size:12px;color:var(--ink)}.tb-weak-list b{font-size:11px}.tb-weak-list i{grid-column:1/-1;height:5px;border-radius:999px;background:linear-gradient(90deg,#6656b5 calc(var(--p)*1%),var(--line) 0)}.tb-improvement{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.tb-improvement>div{padding:10px;border-radius:8px;background:var(--tint)}.tb-improvement span,.tb-improvement small{display:block;color:var(--muted);font-size:10px}.tb-improvement strong{display:block;color:var(--ink);font-size:22px;margin:3px 0}.tb-trend{height:90px;display:flex;align-items:flex-end;gap:5px;margin-top:10px}.tb-trend i{flex:1;height:100%;display:flex;align-items:flex-end;background:var(--tint);border-radius:4px;overflow:hidden}.tb-trend i span{display:block;width:100%;height:calc(var(--p)*1%);background:#6656b5}.tb-adaptive-panel{margin-top:20px;padding-top:20px;border-top:1px solid var(--line);outline:none}.tb-adaptive-head,.tb-notebook-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:14px}.tb-adaptive-head h3,.tb-notebook-head h3,.tb-adaptive-summary h3{font-family:"Source Serif 4",serif;color:var(--ink);font-size:21px;margin:2px 0}.tb-adaptive-mastery-chip{padding:8px 10px;border:1px solid var(--line);border-radius:8px;color:var(--muted);font-size:11px}.tb-adaptive-mastery-chip strong{color:var(--ink)}.tb-adaptive-stem{color:var(--ink);font-size:16px;font-weight:600;line-height:1.5;margin-bottom:13px}.tb-adaptive-options{display:grid;gap:8px}.tb-adaptive-option{display:flex;gap:10px;align-items:flex-start;width:100%;padding:12px;border:1px solid var(--line);border-radius:9px;background:var(--tint);color:var(--ink);font:inherit;text-align:left;cursor:pointer}.tb-adaptive-option span{width:24px;height:24px;display:grid;place-items:center;border:1px solid var(--line);border-radius:6px;font-size:11px;font-weight:700}.tb-adaptive-option.selected{border-color:#6656b5}.tb-adaptive-option.correct{border-color:#1f9d6b;background:color-mix(in srgb,#1f9d6b 9%,var(--card))}.tb-adaptive-option.wrong{border-color:#c0453f;background:color-mix(in srgb,#c0453f 8%,var(--card))}.tb-adaptive-feedback{margin:12px 0;padding:12px;border-radius:9px;color:var(--ink);font-size:13px;line-height:1.5}.tb-adaptive-feedback.correct{border:1px solid rgba(31,157,107,.35);background:color-mix(in srgb,#1f9d6b 9%,var(--card))}.tb-adaptive-feedback.incorrect{border:1px solid rgba(192,69,63,.3);background:color-mix(in srgb,#c0453f 7%,var(--card))}.tb-adaptive-actions{margin-top:14px}.tb-adaptive-summary{display:flex;align-items:center;gap:20px}.tb-notebook-filter{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:14px}.tb-notebook-filter label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}.tb-notebook-filter select{padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);font:inherit;font-size:12.5px}.tb-notebook-count{color:var(--muted);font-size:11.5px;margin-left:auto}.tb-notebook-list{display:grid;gap:14px}.tb-mistake-card{padding:16px;border:1px solid var(--line);border-radius:11px;background:var(--card)}.tb-mistake-meta{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin-bottom:10px}.tb-mistake-sub{color:var(--teal);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}.tb-mistake-when{color:var(--muted);font-size:11px}.tb-mistake-stem{color:var(--ink);font-size:14.5px;font-weight:600;line-height:1.5;margin-bottom:11px}.tb-mistake-options{display:grid;gap:7px;margin:0 0 11px;padding:0;list-style:none}.tb-mistake-opt{display:flex;gap:10px;align-items:flex-start;padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--tint);color:var(--ink);font-size:13px;line-height:1.45}.tb-mistake-opt span{width:22px;height:22px;flex:0 0 auto;display:grid;place-items:center;border:1px solid var(--line);border-radius:6px;font-size:10.5px;font-weight:700;background:var(--card)}.tb-mistake-opt em{display:block;margin-top:3px;font-style:normal;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}.tb-mistake-opt-correct{border-color:#1f9d6b;background:color-mix(in srgb,#1f9d6b 12%,var(--card))}.tb-mistake-opt-correct em{color:#1f9d6b}.tb-mistake-opt-wrong{border-color:#c0453f;background:color-mix(in srgb,#c0453f 10%,var(--card))}.tb-mistake-opt-wrong em{color:#c0453f}.tb-mistake-why{padding:11px;border-radius:8px;background:var(--tint);color:var(--muted);font-size:12.5px;line-height:1.5;margin-bottom:10px}.tb-mistake-why strong{color:var(--ink)}.tb-mistake-link{color:var(--teal);font-size:12px;font-weight:600}.tb-mastery-explain{display:grid;gap:9px}.tb-mastery-explain p{margin:0;padding:11px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--muted);font-size:12.5px;line-height:1.5}.tb-mastery-explain strong{color:var(--ink)}@media(max-width:820px){.tb-mastery-grid{grid-template-columns:1fr}.tb-mastery-stats{grid-template-columns:1fr 1fr}}@media(max-width:560px){.tb-mastery-head,.tb-adaptive-head,.tb-notebook-head,.tb-adaptive-summary{flex-direction:column}.tb-mastery-ring{width:90px;height:90px}.tb-mastery-stats{grid-template-columns:1fr 1fr}}';
    document.head.appendChild(style);
  }

  function handleClick(event) {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.hasAttribute('data-start-adaptive') || target.hasAttribute('data-restart-adaptive')) { startAdaptive(); return; }
    if (target.hasAttribute('data-open-notebook')) { openNotebook(); return; }
    if (target.hasAttribute('data-open-mastery-details')) { openDetails(); return; }
    if (target.hasAttribute('data-close-adaptive')) {
      if (adaptive && !adaptive.complete && window.__TBLearning && typeof window.__TBLearning.abandonSession === 'function') {
        window.__TBLearning.abandonSession({ examId: examId(), sessionId: adaptive.id, mode: 'adaptive', reason: 'closed' });
      }
      closePanel(); return;
    }
    if (target.dataset.adaptiveOpt != null && adaptive && !adaptive.checked[adaptive.index]) {
      const selected = Number(target.dataset.adaptiveOpt);
      const question = adaptive.items[adaptive.index];
      const learning = learningLedger('recordAnswer');
      if (!learning || !adaptive.id) { durableLearningUnavailable(); return; }
      const saved = learning.recordAnswer({
        examId: examId(), sessionId: adaptive.id, mode: 'adaptive', timed: false,
        index: adaptive.index, question: question, selected: selected,
        status: selected === question.answer ? 'correct' : 'incorrect'
      });
      if (!saved || !writeAheadSaved(saved)) {
        announce('That answer could not be saved on this device. Please try again after freeing browser storage.');
        return;
      }
      adaptive.answers[adaptive.index] = selected;
      renderAdaptive();
      return;
    }
    if (target.hasAttribute('data-adaptive-check') && adaptive && adaptive.answers[adaptive.index] != null) {
      adaptive.checked[adaptive.index] = true;
      renderAdaptive();
      return;
    }
    if (target.hasAttribute('data-adaptive-next') && adaptive) {
      finishAdaptiveQuestion();
      if (adaptive.index < adaptive.items.length - 1) { adaptive.index += 1; renderAdaptive(); }
      else if (finishAdaptiveSession()) refreshDashboard();
    }
  }

  function enhance() {
    scheduled = false;
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;
    captureCurrent();
    if (overview.querySelector('.tb-reshead') && document.getElementById(FEEDBACK_ID)) {
      finalizeAttempt();
      renderDashboard();
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(enhance);
  }

  function initialize() {
    ensureStyles();
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;
    document.addEventListener('click', function (event) {
      const navigation = event.target.closest('.tb-navcell,.tb-opt,[data-flag]');
      if (navigation && overview.contains(navigation)) captureCurrent();
      handleClick(event);
    });
    document.addEventListener('change', function (event) {
      const select = event.target.closest('[data-notebook-filter]');
      if (!select) return;
      notebookFilter = select.value;
      renderNotebook();
    });
    /* Remote ledger rows arrive independently of DOM mutations.  Rebuild the
       derived store as soon as they do, so the notebook, readiness, and radar
       are useful on a newly signed-in phone or laptop before snapshot sync
       finishes. */
    ['upskill-test-learning-synced', 'tb:learning-history-ready', 'tb:exam-changed'].forEach(function (name) {
      document.addEventListener(name, scheduleLedgerReconciliation);
    });
    ['tb:learning-recorded', 'upskill-test-learning-synced', 'upskill-test-progress-synced'].forEach(function (name) {
      document.addEventListener(name, refreshDashboardMetrics);
    });
    new MutationObserver(schedule).observe(overview, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    schedule();
    scheduleLedgerReconciliation();
  }

  window.__TBAdaptiveMastery = {
    calculateMastery: calculateMastery,
    nextSchedule: nextSchedule,
    applyResult: applyResult,
    adaptiveCandidates: function (limit) { const store = readStore(); return adaptiveCandidates(examStore(store), limit || SESSION_SIZE); },
    summary: function (timestamp) { const store = readStore(); return masterySummary(examStore(store), timestamp || now()); },
    improvement: function () { const store = readStore(); return improvement(examStore(store)); },
    store: readStore,
    recordResults: recordResults,
    questionId: questionId,
    allQuestions: allQuestions,
    unattemptedFilter: unattemptedFilter,
    missedFilter: missedFilter,
    reconcileLearningLedger: reconcileLearningLedger,
    reconcileLearningEvents: reconcileLearningLedger,
    renderStandalone: renderStandalone
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
