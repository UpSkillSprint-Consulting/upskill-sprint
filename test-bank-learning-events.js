(function () {
  'use strict';

  /*
   * Durable, append-only learning-event ledger.
   *
   * Every learner action is first written synchronously to a local outbox.
   * IndexedDB mirrors the full ledger (including snapshots) so localStorage
   * quota pressure cannot silently discard study history. Account sync then
   * uploads immutable, idempotent rows to Supabase and hydrates events made on
   * a different phone or computer. The existing account snapshot merger stays
   * active during the migration for older study history.
   */
  const STORE_KEY = 'tb-learning-events-v2';
  const DEVICE_KEY = 'tb-account-sync-device-v1';
  const LEGACY_MASTERY_KEY = 'tb-adaptive-mastery-v1';
  const ACCOUNT_SYNC_USER_KEY = 'tb-account-sync-user-v1';
  const TABLE = 'test_bank_learning_events';
  const NEW_ONLY_RESERVATION_RPC = 'reserve_test_bank_new_questions';
  const VERSION = 2;
  const MAX_LOCAL_EVENTS = 2500;
  const BATCH_SIZE = 100;
  const REMOTE_PAGE_SIZE = 500;
  const MIRROR_DB = 'tb-learning-events-mirror-v1';
  const MIRROR_META_STORE = 'meta';
  const MIRROR_EVENTS_STORE = 'events';
  const MIRROR_STATE_KEY = 'state';
  const LEGACY_MIGRATION_VERSION = 1;

  let cachedState = null;
  let mirrorPromise = null;
  let mirrorWriteTimer = 0;
  let mirrorWriteSnapshot = null;
  let mirrorHydrated = false;
  let mirrorAvailable = null;
  let syncPromise = null;
  let syncUserId = '';
  let queuedSyncReason = '';
  let pendingWriteRevision = 0;
  /* A New-only draw needs a fetch which was explicitly requested by that
     draw, not merely a successful hydration that may be minutes old. The
     counter is intentionally in-memory: it represents this tab's completed
     remote reads and is only used to prove a new read happened after a gate
     request began. */
  let remoteFetchRevision = 0;
  let freshHistoryPromise = null;
  let freshHistoryUserId = '';
  let progressSnapshotPromise = null;
  let progressSnapshotUserId = '';
  let retryTimer = 0;
  let retryAttempts = 0;
  let lastUserId = '';
  let lastWriteAheadSaved = true;
  let lastWriteAheadAt = null;
  let authListenerAttached = false;
  let initialized = false;

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function record(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  function now() { return Date.now(); }
  function iso(timestamp) { return new Date(timestamp || now()).toISOString(); }
  function online() { return typeof navigator === 'undefined' || navigator.onLine !== false; }
  function safeId(value, fallback) {
    const text = String(value == null ? '' : value).trim();
    return /^[A-Za-z0-9:_-]{3,180}$/.test(text) ? text : fallback;
  }
  function uuid() {
    return window.crypto && typeof window.crypto.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : 'dev-' + now().toString(36) + '-' + Math.random().toString(36).slice(2, 14);
  }
  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch (error) {}
  }
  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (error) { return value; }
  }

  function freshState() {
    return {
      version: VERSION,
      deviceId: '',
      sequence: 0,
      events: [],
      sessions: {},
      migration: {},
      index: { revision: 3, seen: {}, totals: {}, knownEventIds: {} },
      sync: { remoteLoadedFor: {}, ledgerFetchedFor: {}, lastSuccessAt: null, lastError: null, lastErrorAt: null }
    };
  }

  function normaliseIndex(value) {
    const raw = record(value);
    return {
      revision: Number(raw.revision || 0),
      seen: record(raw.seen),
      totals: record(raw.totals),
      knownEventIds: record(raw.knownEventIds)
    };
  }

  function normaliseState(value) {
    const parsed = record(value);
    const state = Object.assign(freshState(), parsed);
    state.version = VERSION;
    state.deviceId = safeId(state.deviceId, '');
    state.sequence = Math.max(0, Number(state.sequence || 0));
    state.events = asArray(state.events).filter(function (event) { return event && event.id; });
    state.sessions = record(state.sessions);
    state.migration = record(state.migration);
    state.index = normaliseIndex(state.index);
    /* Earlier ledger revisions counted unanswered audit markers as answers.
       Rebuild once from the event log so summaries resolve the latest scored
       answer for each session/question pair. */
    if (state.index.revision < 3) state.index = freshState().index;
    state.sync = Object.assign(freshState().sync, record(state.sync));
    state.sync.remoteLoadedFor = record(state.sync.remoteLoadedFor);
    state.sync.ledgerFetchedFor = record(state.sync.ledgerFetchedFor);
    state.events.forEach(function (event) { indexEvent(state, event, true); });
    return state;
  }

  function read() {
    if (cachedState) return cachedState;
    try { cachedState = normaliseState(JSON.parse(localStorage.getItem(STORE_KEY) || '')); } catch (error) { cachedState = freshState(); }
    return cachedState;
  }

  function mergeSessionState(current, incoming) {
    const left = record(current);
    const right = record(incoming);
    if (!left.id) return clone(right);
    if (!right.id) return left;
    const rank = { active: 1, abandoned: 2, completed: 3 };
    const status = Number(rank[right.status] || 0) > Number(rank[left.status] || 0) ? right.status : left.status;
    const answerEvents = Object.assign({}, record(right.answerEvents), record(left.answerEvents));
    const questionIds = Array.from(new Set(asArray(right.questionIds).concat(asArray(left.questionIds))));
    const starts = [Number(left.startedAt || 0), Number(right.startedAt || 0)].filter(function (value) { return value > 0; });
    return Object.assign({}, right, left, {
      status: status,
      answerEvents: answerEvents,
      questionIds: questionIds,
      startedAt: starts.length ? Math.min.apply(null, starts) : 0,
      completedAt: Math.max(Number(left.completedAt || 0), Number(right.completedAt || 0)) || null,
      abandonedAt: Math.max(Number(left.abandonedAt || 0), Number(right.abandonedAt || 0)) || null
    });
  }

  function mergeFreshStoredState(state) {
    let stored;
    try { stored = normaliseState(JSON.parse(localStorage.getItem(STORE_KEY) || '')); } catch (error) { return state; }
    if (!stored || (!stored.events.length && !stored.sequence)) return state;
    const byId = new Map();
    stored.events.concat(state.events).forEach(function (event) {
      if (!event || !event.id) return;
      const existing = byId.get(event.id);
      if (!existing || Number(event.occurredAt || 0) >= Number(existing.occurredAt || 0)) byId.set(event.id, event);
    });
    state.events = Array.from(byId.values()).sort(function (left, right) {
      return Number(left.occurredAt || 0) - Number(right.occurredAt || 0) || String(left.id).localeCompare(String(right.id));
    });
    state.sequence = Math.max(Number(state.sequence || 0), Number(stored.sequence || 0));
    if (!state.deviceId) state.deviceId = stored.deviceId;
    Object.keys(stored.sessions).forEach(function (id) { state.sessions[id] = mergeSessionState(state.sessions[id], stored.sessions[id]); });
    mergeIndex(state, stored.index);
    state.migration = Object.assign({}, record(stored.migration), record(state.migration));
    state.sync = Object.assign({}, record(stored.sync), record(state.sync));
    state.sync.remoteLoadedFor = Object.assign({}, record(record(stored.sync).remoteLoadedFor), record(record(state.sync).remoteLoadedFor));
    state.sync.ledgerFetchedFor = Object.assign({}, record(record(stored.sync).ledgerFetchedFor), record(record(state.sync).ledgerFetchedFor));
    return state;
  }

  function writeLocal(state) {
    try {
      /* A second tab can have appended an event since this tab read the cache.
         Merge just before each synchronous write, then verify/retry so neither
         outbox is silently overwritten by a stale shared sequence snapshot. */
      for (let attempt = 0; attempt < 3; attempt += 1) {
        mergeFreshStoredState(state);
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
        const confirmed = normaliseState(JSON.parse(localStorage.getItem(STORE_KEY) || ''));
        const expected = new Set(state.events.map(function (event) { return event.id; }));
        const actual = new Set(confirmed.events.map(function (event) { return event.id; }));
        if (Array.from(expected).every(function (id) { return actual.has(id); })) return { saved: true, error: null };
        mergeFreshStoredState(state);
      }
      return { saved: false, error: new Error('Concurrent tab write could not be confirmed') };
    } catch (error) {
      return { saved: false, error: error };
    }
  }

  function deviceId(state) {
    let id = safeId(state.deviceId, '');
    if (!id) {
      try { id = safeId(localStorage.getItem(DEVICE_KEY), ''); } catch (error) {}
    }
    if (!id) id = uuid();
    state.deviceId = id;
    try { localStorage.setItem(DEVICE_KEY, id); } catch (error) {}
    return id;
  }

  function activeUser() {
    const auth = window.UpskillAuth;
    const user = auth && typeof auth.getUser === 'function' ? auth.getUser() : null;
    return user && user.id ? user : null;
  }

  function registry() { return window.__TBQuestionRegistry || null; }
  function questionId(examId, question) {
    const helper = registry();
    if (helper && typeof helper.idFor === 'function') return helper.idFor(examId, question);
    let hash = 2166136261;
    String(question && question.stem || '').split('').forEach(function (character) { hash ^= character.charCodeAt(0); hash = Math.imul(hash, 16777619); });
    return String(examId || 'unknown') + ':legacy:' + (hash >>> 0).toString(36);
  }

  function legacyHash(value) {
    let output = 2166136261;
    String(value == null ? '' : value).split('').forEach(function (character) {
      output ^= character.charCodeAt(0);
      output = Math.imul(output, 16777619);
    });
    return (output >>> 0).toString(36);
  }

  function readLegacyMastery() {
    try {
      const parsed = JSON.parse(localStorage.getItem(LEGACY_MASTERY_KEY) || '');
      return parsed && parsed.version === 1 && record(parsed.exams) ? parsed : { version: 1, exams: {} };
    } catch (error) {
      return { version: 1, exams: {} };
    }
  }

  function legacyMasteryOwner() {
    try { return String(localStorage.getItem(ACCOUNT_SYNC_USER_KEY) || ''); } catch (error) { return ''; }
  }

  function legacyMigration(state) {
    state.migration = record(state.migration);
    const migration = record(state.migration.legacyMasteryV1);
    migration.version = LEGACY_MIGRATION_VERSION;
    migration.scans = record(migration.scans);
    migration.seeded = record(migration.seeded);
    state.migration.legacyMasteryV1 = migration;
    return migration;
  }

  function legacyScan(migration, userId) {
    const current = record(migration.scans[userId]);
    const scan = Object.assign({
      sourceDigest: '',
      scannedAt: null,
      postProgressScannedAt: null,
      progressScanRequired: false,
      progressScanned: false,
      resolved: false,
      complete: false,
      durable: false,
      seeded: 0,
      unresolved: 0,
      ownerMismatch: false
    }, current);
    migration.scans[userId] = scan;
    return scan;
  }

  function seenInScope(state, scope, examId, id) {
    return Object.prototype.hasOwnProperty.call(scopeIndex(state, scope, String(examId), false).seen, id);
  }

  function legacyQuestionResolver(examId) {
    const helper = registry();
    if (!helper || typeof helper.questionsFor !== 'function' || typeof helper.idFor !== 'function') return null;
    const byId = {};
    const byStemHash = {};
    const byStem = {};
    asArray(helper.questionsFor(examId)).forEach(function (question) {
      const id = safeId(helper.idFor(examId, question), '');
      if (!id) return;
      byId[id] = id;
      byStemHash[legacyHash(question && question.stem)] = id;
      byStem[String(question && question.stem || '')] = id;
    });
    return function (key, item) {
      const state = record(item);
      const candidates = [state.questionId, state.id, key];
      const stems = [state.stem];
      asArray(state.history).forEach(function (entry) {
        const history = record(entry);
        const snapshot = record(history.snapshot);
        candidates.push(history.questionId, snapshot.questionId, snapshot.id, snapshot.qid);
        stems.push(history.stem, snapshot.stem);
      });
      for (let index = 0; index < candidates.length; index += 1) {
        const candidate = String(candidates[index] == null ? '' : candidates[index]);
        if (byId[candidate]) return byId[candidate];
        if (byStemHash[candidate]) return byStemHash[candidate];
      }
      for (let index = 0; index < stems.length; index += 1) {
        const stem = String(stems[index] || '');
        if (byStem[stem] || byStemHash[legacyHash(stem)]) return byStem[stem] || byStemHash[legacyHash(stem)];
      }
      return '';
    };
  }

  function hasLegacyEvidence(item) {
    const state = record(item);
    return Number(state.attempts || 0) > 0 || Number(state.correct || 0) > 0 || Number(state.incorrect || 0) > 0 || Number(state.unanswered || 0) > 0 || Number(state.firstSeenAt || 0) > 0 || Number(state.lastSeenAt || 0) > 0 || asArray(state.history).length > 0;
  }

  function legacyEvidenceTimestamp(item) {
    const state = record(item);
    const first = Number(state.firstSeenAt || 0);
    const last = Number(state.lastSeenAt || 0);
    const history = asArray(state.history);
    const historyAt = history.length ? Math.min.apply(null, history.map(function (entry) { return Number(record(entry).at || 0); }).filter(Boolean)) : 0;
    return first || historyAt || last || now();
  }

  function legacyDigest(store) {
    const values = [];
    Object.keys(record(store.exams)).sort().forEach(function (examId) {
      const questions = record(record(store.exams[examId]).questions);
      Object.keys(questions).sort().forEach(function (key) {
        const item = record(questions[key]);
        values.push([examId, key, item.questionId || item.id || '', item.stem || '', item.attempts || 0, item.correct || 0, item.incorrect || 0, item.unanswered || 0, item.firstSeenAt || 0, item.lastSeenAt || 0, asArray(item.history).length].join('|'));
      });
    });
    return legacyHash(values.join('\n')) + '-' + legacyHash(values.join('\u0000').split('').reverse().join(''));
  }

  function unresolvedLegacyAggregateCount(store) {
    let unresolved = 0;
    try {
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index) || '';
        const match = /^tb-adaptive-([a-z0-9_-]+)$/i.exec(key);
        if (!match) continue;
        const value = record(JSON.parse(localStorage.getItem(key) || '{}'));
        const hasAggregateEvidence = Number(value.attempts || 0) > 0 || asArray(value.history).length > 0 || Object.keys(record(value.subState)).length > 0;
        if (!hasAggregateEvidence) continue;
        const questions = record(record(record(store.exams)[match[1]]).questions);
        const hasQuestionEvidence = Object.keys(questions).some(function (questionKey) { return hasLegacyEvidence(questions[questionKey]); });
        if (!hasQuestionEvidence) unresolved += 1;
      }
    } catch (error) {
      /* A blocked storage read is indistinguishable from an unknown historic
         aggregate, so keep New-only conservative rather than guessing. */
      unresolved += 1;
    }
    return unresolved;
  }

  function legacyMigrationEventId(userId, examId, canonicalId) {
    const base = String(userId) + '|' + String(examId) + '|' + String(canonicalId) + '|v' + LEGACY_MIGRATION_VERSION;
    return 'legacy-v' + LEGACY_MIGRATION_VERSION + '-' + legacyHash(base) + '-' + legacyHash(base.split('').reverse().join(''));
  }

  function legacyMigrationPending(state, userId) {
    return state.events.some(function (event) {
      return event.scope === 'user:' + userId && event.payload && event.payload.legacyMigration === true && asArray(event.syncedFor).indexOf(userId) === -1;
    });
  }

  /* Seed only durable exposure records. Legacy question state remains intact;
     this is a read-only bridge into the append-only ledger, not a destructive
     rewrite of the learner's historic mastery data. */
  function migrateLegacyMastery(state, userId, options) {
    options = record(options);
    const migration = legacyMigration(state);
    const scan = legacyScan(migration, userId);
    const owner = legacyMasteryOwner();
    const store = readLegacyMastery();
    const digest = legacyDigest(store);
    const scope = 'user:' + userId;
    const awaitProgress = Boolean(options.awaitProgress);
    /* A historic account-sync meta record is not proof that this page has
       applied a fresh snapshot for the current sign-in. Only the explicit
       progress-sync event may release the signed-in New-only gate. */
    const afterProgress = Boolean(options.afterProgress);
    const sourceChanged = Boolean(scan.sourceDigest && scan.sourceDigest !== digest);
    scan.scannedAt = now();
    scan.sourceDigest = digest;
    scan.ownerMismatch = Boolean(owner && owner !== userId);
    if (scan.ownerMismatch) {
      scan.complete = false;
      scan.durable = false;
      scan.progressScanRequired = true;
      scan.progressScanned = false;
      return { changed: false, seeded: 0, complete: false, blocked: 'account-mismatch', progressScanRequired: true };
    }
    if (awaitProgress && !afterProgress && (!scan.progressScanned || sourceChanged)) {
      scan.progressScanRequired = true;
      scan.progressScanned = false;
    }
    if (afterProgress) {
      scan.progressScanned = true;
      scan.progressScanRequired = false;
      scan.postProgressScannedAt = now();
    } else if (!awaitProgress) {
      /* No account snapshot merger is available, so this direct local scan is
         the relevant migration scan for this device. */
      scan.progressScanned = true;
      scan.progressScanRequired = false;
      scan.postProgressScannedAt = now();
    }
    let seeded = 0;
    let unresolved = unresolvedLegacyAggregateCount(store);
    Object.keys(record(store.exams)).sort().forEach(function (examId) {
      const resolver = legacyQuestionResolver(examId);
      const questions = record(record(store.exams[examId]).questions);
      if (Object.keys(questions).length && !resolver) {
        unresolved += Object.keys(questions).length;
        return;
      }
      migration.seeded[scope] = record(migration.seeded[scope]);
      migration.seeded[scope][examId] = record(migration.seeded[scope][examId]);
      Object.keys(questions).sort().forEach(function (key) {
        const item = record(questions[key]);
        if (!hasLegacyEvidence(item)) return;
        const canonicalId = resolver ? safeId(resolver(key, item), '') : '';
        if (!canonicalId) { unresolved += 1; return; }
        if (migration.seeded[scope][examId][canonicalId] || seenInScope(state, scope, examId, canonicalId)) {
          migration.seeded[scope][examId][canonicalId] = true;
          return;
        }
        const eventId = legacyMigrationEventId(userId, examId, canonicalId);
        const event = nextEvent(state, 'question_exposed', {
          eventId: eventId,
          examId: examId,
          sessionId: 'legacy-v' + LEGACY_MIGRATION_VERSION + '-' + legacyHash(examId),
          questionId: canonicalId,
          at: legacyEvidenceTimestamp(item),
          payload: {
            legacyMigration: true,
            legacyStore: 'tb-adaptive-mastery-v1',
            attempts: Math.max(0, Number(item.attempts || 0)),
            correct: Math.max(0, Number(item.correct || 0)),
            incorrect: Math.max(0, Number(item.incorrect || 0)),
            unresolvedLegacyKey: String(key)
          }
        });
        if (event) {
          migration.seeded[scope][examId][canonicalId] = true;
          seeded += 1;
        }
      });
    });
    scan.seeded = Math.max(0, Number(scan.seeded || 0)) + seeded;
    scan.unresolved = unresolved;
    scan.resolved = unresolved === 0;
    scan.complete = scan.resolved && !legacyMigrationPending(state, userId);
    scan.durable = scan.complete;
    return {
      changed: seeded > 0,
      seeded: seeded,
      complete: scan.complete,
      durable: scan.durable,
      unresolved: unresolved,
      progressScanRequired: Boolean(scan.progressScanRequired)
    };
  }

  function markLegacyMigrationAcknowledged(state, userId) {
    const migration = legacyMigration(state);
    const scan = legacyScan(migration, userId);
    scan.complete = Boolean(scan.resolved && !legacyMigrationPending(state, userId));
    scan.durable = scan.complete;
    return scan.durable;
  }

  function legacySeenIds(examId, user) {
    const owner = legacyMasteryOwner();
    if (user && owner && owner !== user.id) return [];
    const resolver = legacyQuestionResolver(examId);
    if (!resolver) return [];
    const questions = record(record(readLegacyMastery().exams[examId]).questions);
    const ids = [];
    Object.keys(questions).forEach(function (key) {
      if (!hasLegacyEvidence(questions[key])) return;
      const id = safeId(resolver(key, questions[key]), '');
      if (id) ids.push(id);
    });
    return ids;
  }

  function scopeForUser(user) { return user && user.id ? 'user:' + user.id : 'anonymous'; }
  function scopeIndex(state, scope, examId, create) {
    const index = state.index;
    if (create) {
      index.seen[scope] = record(index.seen[scope]);
      index.seen[scope][examId] = record(index.seen[scope][examId]);
      index.totals[scope] = record(index.totals[scope]);
      index.totals[scope][examId] = Object.assign({ answers: 0, answerStates: {}, completedSessions: 0, firstEventAt: null, lastEventAt: null }, record(index.totals[scope][examId]));
      index.totals[scope][examId].answerStates = record(index.totals[scope][examId].answerStates);
    }
    return {
      seen: record(record(index.seen[scope])[examId]),
      totals: record(record(index.totals[scope])[examId])
    };
  }

  function indexEvent(state, event, forceSeen) {
    if (!event || !event.id) return false;
    const known = state.index.knownEventIds;
    const isNew = !known[event.id];
    if (isNew) known[event.id] = Number(event.occurredAt || now());
    const scope = String(event.scope || 'anonymous');
    const examId = String(event.examId || 'unknown');
    const current = scopeIndex(state, scope, examId, true);
    const occurredAt = Number(event.occurredAt || now());
    const totals = current.totals;
    totals.firstEventAt = totals.firstEventAt == null ? occurredAt : Math.min(Number(totals.firstEventAt), occurredAt);
    totals.lastEventAt = totals.lastEventAt == null ? occurredAt : Math.max(Number(totals.lastEventAt), occurredAt);
    if (event.questionId && (event.type === 'question_exposed' || event.type === 'answer_recorded')) {
      const existing = current.seen[event.questionId];
      current.seen[event.questionId] = existing == null ? occurredAt : Math.min(Number(existing), occurredAt);
    }
    if (event.type === 'answer_recorded' && event.questionId) {
      const answerKey = String(event.sessionId || 'session') + '|' + String(event.questionId);
      const candidate = { eventId: String(event.id), occurredAt: occurredAt, status: String(record(event.payload).status || 'unanswered') };
      const previous = record(totals.answerStates[answerKey]);
      if (!previous.eventId || candidate.occurredAt > Number(previous.occurredAt || 0) || (candidate.occurredAt === Number(previous.occurredAt || 0) && candidate.eventId >= String(previous.eventId))) {
        totals.answerStates[answerKey] = candidate;
      }
      totals.answers = Object.keys(totals.answerStates).filter(function (key) {
        const status = totals.answerStates[key].status;
        return status === 'correct' || status === 'incorrect';
      }).length;
    }
    if (isNew) {
      if (event.type === 'session_completed') totals.completedSessions = Math.max(0, Number(totals.completedSessions || 0)) + 1;
    }
    return isNew || Boolean(forceSeen);
  }

  function mergeIndex(target, source) {
    const from = normaliseIndex(source);
    Object.keys(from.knownEventIds).forEach(function (id) {
      if (!target.index.knownEventIds[id]) target.index.knownEventIds[id] = from.knownEventIds[id];
    });
    Object.keys(from.seen).forEach(function (scope) {
      Object.keys(record(from.seen[scope])).forEach(function (examId) {
        const targetSeen = scopeIndex(target, scope, examId, true).seen;
        Object.keys(record(from.seen[scope][examId])).forEach(function (id) {
          const timestamp = Number(from.seen[scope][examId][id] || now());
          targetSeen[id] = targetSeen[id] == null ? timestamp : Math.min(Number(targetSeen[id]), timestamp);
        });
      });
    });
    Object.keys(from.totals).forEach(function (scope) {
      Object.keys(record(from.totals[scope])).forEach(function (examId) {
        const targetTotals = scopeIndex(target, scope, examId, true).totals;
        const sourceTotals = record(from.totals[scope][examId]);
        Object.keys(record(sourceTotals.answerStates)).forEach(function (answerKey) {
          const candidate = record(sourceTotals.answerStates[answerKey]);
          const previous = record(targetTotals.answerStates[answerKey]);
          if (!previous.eventId || Number(candidate.occurredAt || 0) > Number(previous.occurredAt || 0) || (Number(candidate.occurredAt || 0) === Number(previous.occurredAt || 0) && String(candidate.eventId) >= String(previous.eventId))) {
            targetTotals.answerStates[answerKey] = candidate;
          }
        });
        targetTotals.answers = Object.keys(targetTotals.answerStates).filter(function (answerKey) {
          const status = targetTotals.answerStates[answerKey].status;
          return status === 'correct' || status === 'incorrect';
        }).length;
        targetTotals.completedSessions = Math.max(Number(targetTotals.completedSessions || 0), Number(sourceTotals.completedSessions || 0));
        if (sourceTotals.firstEventAt != null) targetTotals.firstEventAt = targetTotals.firstEventAt == null ? Number(sourceTotals.firstEventAt) : Math.min(Number(targetTotals.firstEventAt), Number(sourceTotals.firstEventAt));
        if (sourceTotals.lastEventAt != null) targetTotals.lastEventAt = targetTotals.lastEventAt == null ? Number(sourceTotals.lastEventAt) : Math.max(Number(targetTotals.lastEventAt), Number(sourceTotals.lastEventAt));
      });
    });
  }

  function nextEvent(state, type, fields) {
    mergeFreshStoredState(state);
    const user = activeUser();
    const device = deviceId(state);
    const suppliedId = safeId(fields && fields.eventId, '');
    if (suppliedId) {
      const existing = state.events.find(function (event) { return event.id === suppliedId; });
      if (existing) return existing;
    }
    state.sequence = Math.max(0, Number(state.sequence || 0)) + 1;
    const timestamp = Number(fields && fields.at || now());
    const event = {
      /* Device+sequence remains useful ordering metadata, but UUID entropy is
         required because two tabs can read the same sequence before either
         commits its localStorage merge. */
      id: suppliedId || device + '-' + state.sequence.toString(36) + '-' + uuid(),
      version: 1,
      scope: scopeForUser(user),
      type: type,
      examId: safeId(fields && fields.examId, 'unknown'),
      sessionId: safeId(fields && fields.sessionId, 'session-' + state.sequence.toString(36)),
      questionId: fields && fields.questionId ? safeId(fields.questionId, '') : null,
      deviceId: device,
      occurredAt: timestamp,
      payload: record(fields && fields.payload),
      syncedFor: []
    };
    state.events.push(event);
    indexEvent(state, event);
    return event;
  }

  function trim(state) {
    if (state.events.length <= MAX_LOCAL_EVENTS) return;
    /* Confirmed records remain in IndexedDB and the account ledger. Never
       remove records that have not been acknowledged by an account. */
    /* Remote pages are appended in fetch order, which is not necessarily the
       same as the local insertion order. Evict by immutable event time so an
       old phone session cannot displace a newer laptop cache entry merely
       because it was hydrated later. */
    const confirmed = state.events.filter(function (event) { return asArray(event.syncedFor).length > 0; })
      .sort(function (left, right) { return left.occurredAt - right.occurredAt || left.id.localeCompare(right.id); });
    const pending = state.events.filter(function (event) { return asArray(event.syncedFor).length === 0; });
    const confirmedCapacity = Math.max(0, MAX_LOCAL_EVENTS - pending.length);
    /* Array#slice(-0) is Array#slice(0), which retains every confirmed item.
       When pending records already consume the full cache, retain none. */
    state.events = (confirmedCapacity ? confirmed.slice(-confirmedCapacity) : []).concat(pending)
      .sort(function (left, right) { return left.occurredAt - right.occurredAt || left.id.localeCompare(right.id); });
  }

  function compactConfirmedPayloads(state) {
    state.events.forEach(function (event) {
      if (!asArray(event.syncedFor).length || !event.payload || !event.payload.snapshot) return;
      event.payload = Object.assign({}, event.payload);
      delete event.payload.snapshot;
    });
  }

  function mirrorSupported() { return typeof window.indexedDB !== 'undefined'; }

  function openMirror() {
    if (mirrorPromise) return mirrorPromise;
    if (!mirrorSupported()) {
      mirrorAvailable = false;
      return Promise.reject(new Error('IndexedDB is unavailable'));
    }
    mirrorPromise = new Promise(function (resolve, reject) {
      let request;
      try { request = window.indexedDB.open(MIRROR_DB, 1); } catch (error) { reject(error); return; }
      request.onupgradeneeded = function () {
        const db = request.result;
        if (!db.objectStoreNames.contains(MIRROR_META_STORE)) db.createObjectStore(MIRROR_META_STORE, { keyPath: 'key' });
        if (!db.objectStoreNames.contains(MIRROR_EVENTS_STORE)) db.createObjectStore(MIRROR_EVENTS_STORE, { keyPath: 'id' });
      };
      request.onsuccess = function () { mirrorAvailable = true; resolve(request.result); };
      request.onerror = function () { mirrorAvailable = false; reject(request.error || new Error('Unable to open IndexedDB')); };
      request.onblocked = function () { mirrorAvailable = false; reject(new Error('IndexedDB is blocked by another browser tab')); };
    }).catch(function (error) { mirrorPromise = null; throw error; });
    return mirrorPromise;
  }

  function mirrorMeta(state) {
    return {
      version: VERSION,
      deviceId: state.deviceId,
      sequence: state.sequence,
      sessions: state.sessions,
      migration: state.migration,
      index: state.index,
      sync: state.sync
    };
  }

  function writeMirror(snapshot) {
    return openMirror().then(function (db) {
      return new Promise(function (resolve, reject) {
        let transaction;
        try { transaction = db.transaction([MIRROR_META_STORE, MIRROR_EVENTS_STORE], 'readwrite'); } catch (error) { reject(error); return; }
        transaction.objectStore(MIRROR_META_STORE).put({ key: MIRROR_STATE_KEY, value: snapshot.meta });
        snapshot.events.forEach(function (event) { transaction.objectStore(MIRROR_EVENTS_STORE).put(event); });
        transaction.oncomplete = function () { resolve(); };
        transaction.onerror = function () { reject(transaction.error || new Error('Unable to write IndexedDB mirror')); };
        transaction.onabort = function () { reject(transaction.error || new Error('IndexedDB mirror write was aborted')); };
      });
    });
  }

  function queueMirror(state, events) {
    if (!mirrorSupported()) return;
    mirrorWriteSnapshot = {
      meta: clone(mirrorMeta(state)),
      events: clone(asArray(events))
    };
    if (mirrorWriteTimer) return;
    mirrorWriteTimer = setTimeout(function () {
      const snapshot = mirrorWriteSnapshot;
      mirrorWriteTimer = 0;
      mirrorWriteSnapshot = null;
      if (!snapshot) return;
      writeMirror(snapshot).catch(function (error) {
        emit('tb:learning-storage-error', { storage: 'indexeddb', error: error });
      });
    }, 0);
  }

  function hydrateMirror() {
    if (!mirrorSupported() || mirrorHydrated) return Promise.resolve(false);
    return openMirror().then(function (db) {
      return new Promise(function (resolve, reject) {
        let transaction;
        try { transaction = db.transaction([MIRROR_META_STORE, MIRROR_EVENTS_STORE], 'readonly'); } catch (error) { reject(error); return; }
        const metaRequest = transaction.objectStore(MIRROR_META_STORE).get(MIRROR_STATE_KEY);
        const eventsRequest = transaction.objectStore(MIRROR_EVENTS_STORE).getAll();
        transaction.oncomplete = function () { resolve({ meta: metaRequest.result && metaRequest.result.value, events: eventsRequest.result || [] }); };
        transaction.onerror = function () { reject(transaction.error || new Error('Unable to read IndexedDB mirror')); };
        transaction.onabort = function () { reject(transaction.error || new Error('IndexedDB mirror read was aborted')); };
      });
    }).then(function (mirror) {
      const state = read();
      const remoteMeta = normaliseState(record(mirror.meta));
      if (!state.deviceId && remoteMeta.deviceId) state.deviceId = remoteMeta.deviceId;
      state.sequence = Math.max(state.sequence, remoteMeta.sequence);
      state.sessions = Object.assign({}, remoteMeta.sessions, state.sessions);
      state.migration = Object.assign({}, remoteMeta.migration, state.migration);
      mergeIndex(state, remoteMeta.index);
      asArray(mirror.events).forEach(function (event) { mergeEvent(state, event, event.scope && event.scope.indexOf('user:') === 0 ? event.scope.slice(5) : '', true); });
      mirrorHydrated = true;
      persist(state, 'mirror-restored', true);
      emit('tb:learning-storage-ready', { storage: 'indexeddb', recovered: asArray(mirror.events).length });
      return true;
    }).catch(function (error) {
      mirrorAvailable = false;
      emit('tb:learning-storage-error', { storage: 'indexeddb', error: error });
      return false;
    });
  }

  function persist(state, reason, skipMirror) {
    const fullEvents = state.events.slice();
    if (!skipMirror) queueMirror(state, fullEvents);
    trim(state);
    let result = writeLocal(state);
    if (!result.saved) {
      /* Remote-confirmed immutable snapshots already have two durable copies
         (account + IndexedDB). Keep unsynced payloads intact and compact only
         those confirmed local cache records before retrying localStorage. */
      compactConfirmedPayloads(state);
      result = writeLocal(state);
    }
    lastWriteAheadSaved = result.saved;
    lastWriteAheadAt = now();
    cachedState = state;
    const detail = { reason: reason || 'local', saved: result.saved, pending: pendingCount(state), indexedDb: mirrorAvailable };
    emit('tb:learning-updated', detail);
    emit('tb:learning-data-changed', detail);
    if (!result.saved) emit('tb:learning-storage-error', { storage: 'localStorage', error: result.error });
    return result.saved;
  }

  function pendingCount(state, userId) {
    const id = userId || (activeUser() && activeUser().id) || '';
    if (!id) return state.events.filter(function (event) { return asArray(event.syncedFor).length === 0; }).length;
    return state.events.filter(function (event) {
      return event.scope === 'user:' + id && asArray(event.syncedFor).indexOf(id) === -1;
    }).length;
  }

  function anonymousPendingCount(state) {
    return state.events.filter(function (event) { return event.scope === 'anonymous' && asArray(event.syncedFor).length === 0; }).length;
  }

  function activeSessionId(examId, supplied) {
    return safeId(supplied, safeId(examId, 'exam') + ':session:' + now().toString(36) + '-' + Math.random().toString(36).slice(2, 8));
  }

  function sessionFor(state, input) {
    const sessionId = activeSessionId(input.examId, input.sessionId);
    const existing = record(state.sessions[sessionId]);
    const session = Object.assign({
      id: sessionId,
      examId: safeId(input.examId, 'unknown'),
      mode: String(input.mode || 'practice'),
      timed: Boolean(input.timed),
      startedAt: Number(input.startedAt || now()),
      questionIds: [],
      answerEvents: {},
      status: 'active'
    }, existing);
    session.answerEvents = record(session.answerEvents);
    return session;
  }

  function sessionBelongsToActiveUser(session) {
    const user = activeUser();
    /* Anonymous sessions are intentionally local-only until an explicit claim.
       Signed-in sessions must never be continued by a different account on a
       shared browser. */
    return Boolean(session && (!session.ownerId || (user && session.ownerId === user.id)));
  }

  function startSession(input) {
    input = record(input);
    const state = read();
    const sessionId = activeSessionId(input.examId, input.sessionId);
    const existing = record(state.sessions[sessionId]);
    if (existing.id && !sessionBelongsToActiveUser(existing)) return input.returnResult ? { sessionId: sessionId, saved: false, rejected: true } : null;
    if (existing.status === 'active' || existing.status === 'completed' || existing.status === 'abandoned') {
      const saved = input.returnResult ? persist(state, 'session-start-retry') : lastWriteAheadSaved;
      if (input.returnResult) scheduleSync('session-start-retry');
      return input.returnResult ? { sessionId: sessionId, saved: saved, retried: true } : sessionId;
    }
    const questions = asArray(input.questions);
    const startedAt = Number(input.startedAt || now());
    state.sessions[sessionId] = {
      id: sessionId,
      examId: safeId(input.examId, 'unknown'),
      mode: String(input.mode || 'practice'),
      timed: Boolean(input.timed),
      ownerId: (activeUser() && activeUser().id) || null,
      startedAt: startedAt,
      questionIds: questions.map(function (question) { return questionId(input.examId, question); }),
      answerEvents: {},
      status: 'active'
    };
    nextEvent(state, 'session_started', {
      examId: input.examId,
      sessionId: sessionId,
      at: startedAt,
      payload: { mode: String(input.mode || 'practice'), timed: Boolean(input.timed), total: questions.length, limitSeconds: input.limitSeconds == null ? null : Number(input.limitSeconds) }
    });
    /* Selecting a set counts as exposure. This makes “new questions only”
       conservative: an abandoned set is never silently served again. */
    questions.forEach(function (question, index) {
      nextEvent(state, 'question_exposed', {
        examId: input.examId,
        sessionId: sessionId,
        questionId: questionId(input.examId, question),
        at: startedAt,
        payload: { index: index, mode: String(input.mode || 'practice'), timed: Boolean(input.timed), sub: question && question.sub || 'general' }
      });
    });
    const saved = persist(state, 'session-started');
    if (saved) emit('tb:learning-session-started', { sessionId: sessionId, examId: input.examId, mode: String(input.mode || 'practice') });
    scheduleSync('session-started');
    return input.returnResult ? { sessionId: sessionId, saved: saved, retried: false } : sessionId;
  }

  function sourceForMode(mode) {
    if (mode === 'exam') return 'exam-attempt';
    if (mode === 'quick') return 'quick-quiz';
    if (mode === 'focus') return 'focused-quiz';
    if (mode === 'diagnostic') return 'diagnostic';
    if (mode === 'practice') return 'weak-area-practice';
    return 'adaptive-practice';
  }

  function answerPayload(question, entry, session, index) {
    const selected = entry && entry.selected != null ? Number(entry.selected) : null;
    const status = entry && (entry.status === 'correct' || entry.status === 'incorrect' || entry.status === 'unanswered')
      ? entry.status
      : selected == null ? 'unanswered' : selected === Number(question && question.answer) ? 'correct' : 'incorrect';
    return {
      index: Number(index || 0),
      status: status,
      selected: selected,
      correctAnswer: Number(question && question.answer),
      mode: String(entry && entry.mode || session.mode || 'practice'),
      timed: entry && entry.timed != null ? Boolean(entry.timed) : Boolean(session.timed),
      sub: question && question.sub || 'general',
      /* Immutable study snapshot: the notebook still shows exactly what a
         learner saw even after later question wording or explanation updates. */
      snapshot: {
        stem: String(question && question.stem || ''),
        options: asArray(question && question.options).map(String),
        answer: Number(question && question.answer),
        why: String(question && question.why || ''),
        sub: String(question && question.sub || 'general'),
        chart: question && question.chart || null
      }
    };
  }

  function findEvent(state, id) {
    return state.events.find(function (event) { return event.id === id; }) || null;
  }

  /*
   * Write-ahead answer capture. It is idempotent for a session/question pair:
   * repeated clicks never create duplicate answer events. Before an event is
   * uploaded, a changed selection replaces the pending payload. Once it is
   * immutable on the account, final submission carries the canonical answers
   * in its session_completed payload for reconciliation.
   */
  function recordAnswer(input) {
    input = record(input);
    const question = input.question;
    if (!question || !input.sessionId) return null;
    const state = read();
    const session = sessionFor(state, input);
    if (!sessionBelongsToActiveUser(session)) return null;
    if (session.status === 'completed' || session.status === 'abandoned') return null;
    const id = questionId(input.examId || session.examId, question);
    const timestamp = Number(input.at || now());
    const payload = answerPayload(question, input, session, input.index);
    const existingId = session.answerEvents[id];
    let event = existingId && findEvent(state, existingId);
    if (event) {
      const changed = event.payload.selected !== payload.selected || event.payload.status !== payload.status;
      if (changed && asArray(event.syncedFor).length === 0 && asArray(event.uploadingFor).length === 0) {
        event.payload = payload;
        event.occurredAt = timestamp;
      }
      if (changed && (asArray(event.syncedFor).length > 0 || asArray(event.uploadingFor).length > 0)) {
        /* The account ledger is append-only. A changed answer after an earlier
           upload becomes a later answer_recorded revision, so an abandoned
           session still retains the learner's final choice. */
        event = nextEvent(state, 'answer_recorded', {
          examId: input.examId || session.examId,
          sessionId: session.id,
          questionId: id,
          at: timestamp,
          payload: payload
        });
      }
      indexEvent(state, event, true);
      session.answerEvents[id] = event.id;
      state.sessions[session.id] = session;
      const saved = persist(state, changed ? 'answer-revised' : 'answer-duplicate');
      scheduleSync(changed ? 'answer-revised' : 'answer-duplicate');
      return { eventId: event.id, duplicate: !changed, revised: changed, saved: saved };
    }
    event = nextEvent(state, 'answer_recorded', {
      examId: input.examId || session.examId,
      sessionId: session.id,
      questionId: id,
      at: timestamp,
      payload: payload
    });
    session.answerEvents[id] = event.id;
    state.sessions[session.id] = session;
    const saved = persist(state, 'answer-recorded');
    scheduleSync('answer-recorded');
    return { eventId: event.id, duplicate: false, saved: saved };
  }

  function finalAnswerEvents(state, input, session, records, timestamp) {
    const ids = [];
    const canonical = [];
    records.forEach(function (entry, index) {
      const question = entry && entry.question;
      if (!question) return;
      const id = questionId(input.examId || session.examId, question);
      const payload = answerPayload(question, entry, session, index);
      const existingId = session.answerEvents[id];
      let existing = existingId && findEvent(state, existingId);
      if (existing) {
        /* Keep a not-yet-uploaded event accurate if a learner changes an
           answer. Uploaded events remain immutable; completion is canonical. */
        if (asArray(existing.syncedFor).length === 0 && (existing.payload.selected !== payload.selected || existing.payload.status !== payload.status)) {
          existing.payload = payload;
          existing.occurredAt = timestamp;
        } else if (asArray(existing.syncedFor).length > 0 && (existing.payload.selected !== payload.selected || existing.payload.status !== payload.status)) {
          existing = nextEvent(state, 'answer_recorded', {
            examId: input.examId || session.examId,
            sessionId: session.id,
            questionId: id,
            at: timestamp,
            payload: payload
          });
          session.answerEvents[id] = existing.id;
        }
        indexEvent(state, existing, true);
        ids.push(existing.id);
      } else {
        const created = nextEvent(state, 'answer_recorded', {
          examId: input.examId || session.examId,
          sessionId: session.id,
          questionId: id,
          at: timestamp,
          payload: payload
        });
        session.answerEvents[id] = created.id;
        ids.push(created.id);
      }
      /* Keep the blueprint subtopic with the completion record.  The
         session_completed event is the immutable scoring source for a full
         exam, so its domain breakdown must not depend on a later bank edit
         or on an answer-recorded event remaining in the compact local cache. */
      canonical.push({
        questionId: id,
        selected: payload.selected,
        status: payload.status,
        sub: String(payload.sub || payload.snapshot && payload.snapshot.sub || 'general')
      });
    });
    return { ids: ids, canonical: canonical };
  }

  function completionEventForSession(state, sessionId) {
    let latest = null;
    state.events.forEach(function (event) {
      if (!event || event.type !== 'session_completed' || event.sessionId !== sessionId) return;
      if (!latest || Number(event.occurredAt || 0) >= Number(latest.occurredAt || 0)) latest = event;
    });
    return latest;
  }

  function answerEventForCompletion(state, sessionId, questionId, preferredId) {
    const preferred = preferredId && findEvent(state, preferredId);
    if (preferred && preferred.type === 'answer_recorded') return preferred;
    let latest = null;
    state.events.forEach(function (event) {
      if (!event || event.type !== 'answer_recorded' || event.sessionId !== sessionId || event.questionId !== questionId) return;
      if (!latest || Number(event.occurredAt || 0) >= Number(latest.occurredAt || 0)) latest = event;
    });
    return latest;
  }

  /* Completion can be retried after a localStorage quota/error.  The
     completion event and its immutable answer snapshots are enough to rebuild
     the old mastery projection without trusting the caller to keep the quiz
     records in memory. */
  function recordsForCompletedSession(state, session, completion, supplied) {
    const original = asArray(supplied);
    if (original.length) return original;
    const payload = record(completion && completion.payload);
    const answers = asArray(payload.answers);
    const answerIds = asArray(payload.answerEventIds);
    const helper = registry();
    return answers.map(function (answer, index) {
      answer = record(answer);
      const id = String(answer.questionId || '');
      if (!id) return null;
      const answerEvent = answerEventForCompletion(state, session.id, id, answerIds[index]);
      const answerPayload = record(answerEvent && answerEvent.payload);
      const snapshot = record(answerPayload.snapshot);
      let question = null;
      if (snapshot.stem && asArray(snapshot.options).length) {
        question = {
          qid: id,
          stem: String(snapshot.stem || ''),
          options: asArray(snapshot.options).map(String),
          answer: Number(snapshot.answer),
          why: String(snapshot.why || ''),
          sub: String(snapshot.sub || 'general'),
          chart: snapshot.chart || null
        };
      } else if (helper && typeof helper.find === 'function') {
        question = helper.find(session.examId, id);
      }
      if (!question) return null;
      return {
        question: question,
        selected: answer.selected == null ? null : Number(answer.selected),
        status: answer.status === 'correct' || answer.status === 'incorrect' || answer.status === 'unanswered'
          ? answer.status
          : answer.selected == null ? 'unanswered' : Number(answer.selected) === Number(question.answer) ? 'correct' : 'incorrect'
      };
    }).filter(Boolean);
  }

  function deriveCompletedMastery(state, session, completion, suppliedRecords) {
    const current = record(state.sessions[session.id]);
    if (current.masteryDerived || current.masteryDeriving) return false;
    const mastery = window.__TBAdaptiveMastery;
    if (!mastery || typeof mastery.recordResults !== 'function') return false;
    const records = recordsForCompletedSession(state, current, completion, suppliedRecords);
    if (!records.length) {
      current.masteryDerived = true;
      state.sessions[current.id] = current;
      return false;
    }
    const payload = record(completion && completion.payload);
    current.masteryDeriving = true;
    state.sessions[current.id] = current;
    try {
      mastery.recordResults(records, {
        source: sourceForMode(payload.mode || current.mode),
        mode: payload.mode || current.mode || 'practice',
        timed: Boolean(payload.timed == null ? current.timed : payload.timed),
        sessionId: current.id,
        at: Number(completion && completion.occurredAt || current.completedAt || now()),
        completed: true,
        eventIds: asArray(payload.answerEventIds)
      });
      current.masteryDerived = true;
      return true;
    } finally {
      delete current.masteryDeriving;
      state.sessions[current.id] = current;
    }
  }

  function completeSession(input) {
    input = record(input);
    const state = read();
    const session = sessionFor(state, input);
    if (!sessionBelongsToActiveUser(session)) return null;
    if (session.status === 'completed') {
      /* A caller may retry after a failed localStorage write. The immutable
         completion event is already in the in-memory outbox. Only a confirmed
         retry is allowed to project it into mastery; that keeps a storage
         failure from claiming a completed test which is not durable yet. */
      const saved = persist(state, 'session-completion-retry');
      const completion = completionEventForSession(state, session.id);
      if (saved) {
        deriveCompletedMastery(state, session, completion, input.records);
        scheduleSync('session-completion-retry');
      }
      return Object.assign({ sessionId: session.id }, record(session.result), { saved: saved, retried: true });
    }
    const timestamp = Number(input.completedAt || now());
    const records = asArray(input.records);
    const finalised = finalAnswerEvents(state, input, session, records, timestamp);
    const correct = finalised.canonical.filter(function (answer) { return answer.status === 'correct'; }).length;
    nextEvent(state, 'session_completed', {
      examId: input.examId || session.examId,
      sessionId: session.id,
      at: timestamp,
      payload: {
        mode: String(input.mode || session.mode || 'practice'),
        timed: Boolean(input.timed == null ? session.timed : input.timed),
        total: finalised.canonical.length,
        correct: correct,
        startedAt: Number(session.startedAt || input.startedAt || timestamp),
        completedReason: String(input.completedReason || 'submitted'),
        /* This is the final answer truth when a learner changes a selection
           after its write-ahead event was already uploaded. */
        answers: finalised.canonical,
        answerEventIds: finalised.ids
      }
    });
    const result = { total: finalised.canonical.length, correct: correct };
    state.sessions[session.id] = Object.assign({}, session, { status: 'completed', completedAt: timestamp, result: result, masteryDerived: false });
    const saved = persist(state, 'session-completed');

    /* The ledger's write-ahead save is the boundary between an in-progress
       submission and a completed result.  Do not mutate mastery, dispatch its
       result event, or sync a completion that local storage rejected. */
    if (saved) {
      deriveCompletedMastery(state, state.sessions[session.id], completionEventForSession(state, session.id), records);
      scheduleSync('session-completed');
    }
    return Object.assign({ sessionId: session.id }, result, { saved: saved, retried: false });
  }

  function abandonSession(input) {
    input = record(input);
    if (!input.sessionId) return null;
    const state = read();
    const session = sessionFor(state, input);
    if (!sessionBelongsToActiveUser(session)) return null;
    if (session.status === 'completed' || session.status === 'abandoned') return null;
    const timestamp = Number(input.at || now());
    nextEvent(state, 'session_abandoned', {
      examId: input.examId || session.examId,
      sessionId: session.id,
      at: timestamp,
      payload: { mode: String(input.mode || session.mode || 'practice'), timed: Boolean(session.timed), reason: String(input.reason || 'exited'), startedAt: Number(session.startedAt || timestamp) }
    });
    state.sessions[session.id] = Object.assign({}, session, { status: 'abandoned', abandonedAt: timestamp });
    persist(state, 'session-abandoned');
    scheduleSync('session-abandoned');
    return session.id;
  }

  function localScopes() {
    const user = activeUser();
    /* Anonymous records require explicit claimant consent; never expose a
       shared browser's unsigned activity to whichever account signs in next. */
    return user ? ['user:' + user.id] : ['anonymous'];
  }

  function legacyMigrationReadyForUser(state, user) {
    if (!user) return true;
    const scan = legacyScan(legacyMigration(state), user.id);
    return Boolean(scan.complete && scan.durable && scan.progressScanned && !scan.progressScanRequired);
  }

  function historyReadyForUser(state, user) {
    return !user || Boolean(record(state.sync.remoteLoadedFor)[user.id] && legacyMigrationReadyForUser(state, user));
  }

  function localEventsForExam(examId) {
    const state = read();
    const allowed = localScopes();
    return state.events.filter(function (event) { return event.examId === examId && allowed.indexOf(event.scope) !== -1; });
  }

  function eventsForExam(examId) {
    return clone(localEventsForExam(examId).sort(function (left, right) {
      return Number(left.occurredAt) - Number(right.occurredAt) || String(left.id).localeCompare(String(right.id));
    }));
  }

  function seenQuestionIds(examId) {
    const state = read();
    const ids = new Set();
    localScopes().forEach(function (scope) {
      Object.keys(scopeIndex(state, scope, String(examId), false).seen).forEach(function (id) { ids.add(id); });
    });
    legacySeenIds(String(examId), activeUser()).forEach(function (id) { ids.add(id); });
    return Array.from(ids).sort();
  }

  function hasSeen(examId, question) {
    const state = read();
    const user = activeUser();
    /* Fail closed for signed-in learners until their account ledger has been
       hydrated. It can temporarily yield no “new only” questions, but never
       leaks an old question before phone/laptop history arrives. */
    if (!historyReadyForUser(state, user)) return true;
    const id = questionId(examId, question);
    return seenQuestionIds(String(examId)).indexOf(id) !== -1;
  }

  function summary(examId, fallbackStates) {
    const state = read();
    const allowed = localScopes();
    const seen = new Set();
    let answeredEvents = 0;
    let completedSessions = 0;
    let firstEventAt = null;
    let lastEventAt = null;
    allowed.forEach(function (scope) {
      const current = scopeIndex(state, scope, String(examId), false);
      Object.keys(current.seen).forEach(function (id) { seen.add(id); });
      answeredEvents += Number(current.totals.answers || 0);
      completedSessions += Number(current.totals.completedSessions || 0);
      if (current.totals.firstEventAt != null) firstEventAt = firstEventAt == null ? Number(current.totals.firstEventAt) : Math.min(firstEventAt, Number(current.totals.firstEventAt));
      if (current.totals.lastEventAt != null) lastEventAt = lastEventAt == null ? Number(current.totals.lastEventAt) : Math.max(lastEventAt, Number(current.totals.lastEventAt));
    });
    legacySeenIds(String(examId), activeUser()).forEach(function (id) { seen.add(id); });
    Object.keys(record(fallbackStates)).forEach(function (key) {
      const item = fallbackStates[key];
      if (item && Number(item.attempts || 0) > 0) seen.add(String(item.questionId || item.id || key));
    });
    return {
      uniqueSeen: seen.size,
      answeredEvents: answeredEvents,
      completedSessions: completedSessions,
      pending: pendingCount(state),
      anonymousPending: anonymousPendingCount(state),
      historyReady: historyReadyForUser(state, activeUser()),
      firstEventAt: firstEventAt,
      lastEventAt: lastEventAt
    };
  }

  function dbRows(events, userId) {
    return events.map(function (event) {
      return {
        user_id: userId,
        event_id: event.id,
        device_id: event.deviceId,
        event_type: event.type,
        exam_id: event.examId,
        session_id: event.sessionId,
        question_id: event.questionId,
        occurred_at: iso(event.occurredAt),
        payload: event.payload
      };
    });
  }

  function mergeEvent(state, event, userId, forceLocal) {
    if (!event || !event.id) return false;
    const id = String(event.id);
    const known = Boolean(state.index.knownEventIds[id]);
    const local = state.events.some(function (existing) { return existing.id === id; });
    if (!local && (!known || forceLocal)) {
      const imported = Object.assign({}, event, {
        id: id,
        version: 1,
        scope: userId ? 'user:' + userId : String(event.scope || 'anonymous'),
        payload: record(event.payload),
        syncedFor: userId ? [userId] : asArray(event.syncedFor)
      });
      state.events.push(imported);
      indexEvent(state, imported);
      return true;
    }
    /* An event may have been compacted out of localStorage but remains in the
       IndexedDB mirror. Its durable index still drives New Only/readiness. */
    if (event && !known) indexEvent(state, event, true);
    return false;
  }

  function eventFromRemoteRow(row, userId) {
    return {
      id: String(row.event_id), version: 1, scope: 'user:' + userId,
      type: String(row.event_type), examId: String(row.exam_id), sessionId: String(row.session_id),
      questionId: row.question_id ? String(row.question_id) : null, deviceId: String(row.device_id || ''),
      occurredAt: Date.parse(row.occurred_at) || now(), payload: record(row.payload), syncedFor: [userId]
    };
  }

  function mergeRemoteRows(state, rows, userId) {
    let changed = false;
    asArray(rows).forEach(function (row) {
      if (!row || !row.event_id) return;
      changed = mergeEvent(state, eventFromRemoteRow(row, userId), userId) || changed;
    });
    return changed;
  }

  async function fetchRemoteRows(client, userId) {
    const rows = [];
    let offset = 0;
    while (true) {
      let query = client.from(TABLE).select('event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,payload')
        .eq('user_id', userId).order('occurred_at', { ascending: true }).order('event_id', { ascending: true });
      const supportsRange = typeof query.range === 'function';
      query = supportsRange ? query.range(offset, offset + REMOTE_PAGE_SIZE - 1) : query.limit(REMOTE_PAGE_SIZE);
      const result = await query;
      if (result && result.error) throw result.error;
      const page = asArray(result && result.data);
      rows.push.apply(rows, page);
      if (page.length < REMOTE_PAGE_SIZE || !supportsRange) break;
      offset += page.length;
    }
    return rows;
  }

  function syncStatus(state, phase, userId, error) {
    const detail = {
      phase: phase,
      userId: userId || null,
      pending: pendingCount(state, userId),
      anonymousPending: anonymousPendingCount(state),
      online: online(),
      error: error || null
    };
    emit('tb:learning-sync-status', detail);
    return detail;
  }

  function reconcileRemoteEvents(events) {
    const mastery = window.__TBAdaptiveMastery;
    if (!mastery || typeof mastery.reconcileLearningEvents !== 'function') return;
    try { mastery.reconcileLearningEvents(clone(events)); } catch (error) {
      emit('tb:learning-reconciliation-error', { error: error });
    }
  }

  function scanLegacyAfterProgressSync(reason) {
    const user = activeUser();
    if (!user || (legacyMasteryOwner() && legacyMasteryOwner() !== user.id)) return null;
    const state = read();
    const wasReady = historyReadyForUser(state, user);
    const migration = migrateLegacyMastery(state, user.id, { afterProgress: true });
    markLegacyMigrationAcknowledged(state, user.id);
    if (!historyReadyForUser(state, user)) delete state.sync.remoteLoadedFor[user.id];
    persist(state, 'legacy-mastery-progress-scan');
    /* Even a scan with no new rows needs one ledger fetch after the account
       snapshot merge before New-only becomes available. */
    if (migration.changed || !wasReady || !historyReadyForUser(state, user)) scheduleSync('legacy-progress-scan-' + (reason || 'account-sync'));
    return migration;
  }

  function requestFreshProgressSnapshot(reason) {
    const account = window.__TBAccountSync;
    const user = activeUser();
    if (!user || !account || typeof account.sync !== 'function') return Promise.resolve({ skipped: true });
    if (progressSnapshotPromise && progressSnapshotUserId === user.id) return progressSnapshotPromise;
    progressSnapshotUserId = user.id;
    progressSnapshotPromise = Promise.resolve(account.sync('learning-legacy-migration-' + (reason || 'automatic'))).then(function (result) {
      /* A skipped/error result cannot prove a fresh snapshot was merged; keep
         New-only locked until account sync subsequently emits its event. */
      if (result && (result.error || result.skipped || result.stale)) {
        const current = activeUser();
        if (current && current.id === user.id) syncStatus(read(), 'awaiting-progress-sync', user.id, result.error || null);
      }
      return result;
    }).catch(function (error) {
      const current = activeUser();
      if (current && current.id === user.id) syncStatus(read(), 'awaiting-progress-sync', user.id, error);
      return { error: error };
    }).finally(function () {
      if (progressSnapshotUserId === user.id) {
        progressSnapshotPromise = null;
        progressSnapshotUserId = '';
      }
    });
    return progressSnapshotPromise;
  }

  /* A normal caller that arrives while a sync is in progress can safely share
     that sync.  The exception is the account-progress callback: it carries a
     freshly merged legacy snapshot, so it must be scanned after the current
     fetch completes.  Queueing every caller caused background writes to issue
     duplicate remote pagination requests. */
  function requiresFollowUpSync(reason) {
    return String(reason || '').indexOf('legacy-progress-scan-') === 0;
  }

  async function sync(reason) {
    const user = activeUser();
    const auth = window.UpskillAuth;
    const client = auth && typeof auth.getClient === 'function' ? auth.getClient() : null;
    if (!user || !client) return { skipped: true, reason: 'not-signed-in' };
    if (!online()) {
      syncStatus(read(), 'offline', user.id);
      return { skipped: true, reason: 'offline', pending: pendingCount(read(), user.id) };
    }
    if (syncPromise) {
      if (syncUserId === user.id) {
        if (requiresFollowUpSync(reason)) queuedSyncReason = reason;
        return syncPromise;
      }
      return syncPromise.catch(function () {}).then(function () { return sync(reason); });
    }
    const userId = user.id;
    const writeRevisionAtStart = pendingWriteRevision;
    lastUserId = userId;
    syncUserId = userId;
    syncPromise = (async function () {
      const state = read();
      syncStatus(state, 'syncing', userId);
      const localScope = 'user:' + userId;
      const awaitProgress = Boolean(window.__TBAccountSync && typeof window.__TBAccountSync.sync === 'function');
      const legacyMigration = migrateLegacyMastery(state, userId, { awaitProgress: awaitProgress });
      markLegacyMigrationAcknowledged(state, userId);
      if (!legacyMigrationReadyForUser(state, user)) delete state.sync.remoteLoadedFor[userId];
      /* Persist the synthetic exposure outbox before it is eligible for an
         upload. This prevents historic mastery from being treated as new if
         the tab closes between migration and Supabase acknowledgement. */
      persist(state, 'legacy-mastery-scan');
      const pending = state.events.filter(function (event) {
        return event.scope === localScope && asArray(event.syncedFor).indexOf(userId) === -1;
      });
      for (let index = 0; index < pending.length; index += BATCH_SIZE) {
        if (!activeUser() || activeUser().id !== userId) throw new Error('Account changed while learning records were syncing');
        const batch = pending.slice(index, index + BATCH_SIZE);
        batch.forEach(function (event) { event.uploadingFor = asArray(event.uploadingFor).concat([userId]); });
        const result = await client.from(TABLE).upsert(dbRows(batch, userId), {
          onConflict: 'user_id,event_id',
          ignoreDuplicates: true
        });
        if (result && result.error) throw result.error;
        const ids = new Set(batch.map(function (event) { return event.id; }));
        state.events.forEach(function (event) {
          if (ids.has(event.id) && event.scope === localScope && asArray(event.syncedFor).indexOf(userId) === -1) event.syncedFor = asArray(event.syncedFor).concat([userId]);
          if (ids.has(event.id)) event.uploadingFor = asArray(event.uploadingFor).filter(function (id) { return id !== userId; });
        });
        markLegacyMigrationAcknowledged(state, userId);
        persist(state, 'sync-acknowledged');
      }
      /* Events written after the first pending snapshot must be uploaded by
         this same call; callers awaiting sync must not need a second click or
         navigation to make their answer durable. */
      if (pendingWriteRevision > writeRevisionAtStart) {
        const followUpPending = state.events.filter(function (event) {
          return event.scope === localScope && asArray(event.syncedFor).indexOf(userId) === -1;
        });
        for (let index = 0; index < followUpPending.length; index += BATCH_SIZE) {
          const batch = followUpPending.slice(index, index + BATCH_SIZE);
          batch.forEach(function (event) { event.uploadingFor = asArray(event.uploadingFor).concat([userId]); });
          const result = await client.from(TABLE).upsert(dbRows(batch, userId), { onConflict: 'user_id,event_id', ignoreDuplicates: true });
          if (result && result.error) throw result.error;
          const ids = new Set(batch.map(function (event) { return event.id; }));
          state.events.forEach(function (event) {
            if (ids.has(event.id) && event.scope === localScope && asArray(event.syncedFor).indexOf(userId) === -1) event.syncedFor = asArray(event.syncedFor).concat([userId]);
            if (ids.has(event.id)) event.uploadingFor = asArray(event.uploadingFor).filter(function (id) { return id !== userId; });
          });
          persist(state, 'sync-follow-up-acknowledged');
        }
      }
      if (!activeUser() || activeUser().id !== userId) throw new Error('Account changed before learning history could be refreshed');
      const remoteRows = await fetchRemoteRows(client, userId);
      if (!activeUser() || activeUser().id !== userId) throw new Error('Account changed while learning history was being refreshed');
      remoteFetchRevision += 1;
      mergeRemoteRows(state, remoteRows, userId);
      const remoteEvents = remoteRows.filter(function (row) { return row && row.event_id; }).map(function (row) { return eventFromRemoteRow(row, userId); });
      /* Reconcile full remote history before the local cache is compacted. */
      reconcileRemoteEvents(remoteEvents);
      markLegacyMigrationAcknowledged(state, userId);
      state.sync.ledgerFetchedFor[userId] = now();
      const legacyReady = legacyMigrationReadyForUser(state, user);
      if (legacyReady) state.sync.remoteLoadedFor[userId] = true;
      else delete state.sync.remoteLoadedFor[userId];
      state.sync.lastSuccessAt = now();
      state.sync.lastError = null;
      state.sync.lastErrorAt = null;
      persist(state, 'sync-merged');
      retryAttempts = 0;
      const hydrated = historyReadyForUser(state, user);
      const detail = { reason: reason || 'automatic', pending: pendingCount(state, userId), userId: userId, imported: remoteRows.length, hydrated: hydrated, events: remoteEvents };
      emit('upskill-test-learning-synced', detail);
      if (hydrated) emit('tb:learning-history-ready', detail);
      syncStatus(state, hydrated ? 'synced' : 'awaiting-legacy-migration', userId);
      /* Ask the account snapshot merger exactly once for each migration scan.
         Its progress event marks the scan complete and queues one final ledger
         fetch. Permanently unresolved legacy IDs remain fail-closed without
         recursively bouncing between the two synchronizers. */
      if (awaitProgress && legacyMigration.progressScanRequired) requestFreshProgressSnapshot(reason);
      return { synced: pending.length, pending: pendingCount(state, userId), imported: remoteRows.length, hydrated: hydrated, legacySeeded: legacyMigration.seeded };
    }()).catch(function (error) {
      const state = read();
      state.sync.lastError = String(error && error.message || error || 'Learning sync failed');
      state.sync.lastErrorAt = now();
      persist(state, 'sync-error');
      emit('tb:learning-sync-error', { error: error, pending: pendingCount(state, userId), userId: userId });
      syncStatus(state, 'error', userId, state.sync.lastError);
      throw error;
    }).finally(function () {
      const followUp = queuedSyncReason;
      queuedSyncReason = '';
      syncPromise = null;
      syncUserId = '';
      if (followUp) Promise.resolve().then(function () { scheduleSync(followUp); });
    });
    return syncPromise;
  }

  /*
   * New-only is a promise about the *current account ledger*, not a promise
   * about whatever happened to be in localStorage when the card rendered.
   * Always do an account-scoped round trip immediately before a New-only
   * selection. If a background sync was already running when the gate was
   * requested, make one more round trip after it: that prevents a response
   * which was already on its way from being mistaken for a user-requested
   * freshness check. Offline, auth, migration, and transport failures all
   * return ready:false so callers can fail closed without guessing.
   */
  function ensureFreshHistory(reason) {
    const user = activeUser();
    const auth = window.UpskillAuth;
    const client = auth && typeof auth.getClient === 'function' ? auth.getClient() : null;
    if (!user || !client) return Promise.resolve({ ready: false, reason: 'not-signed-in', userId: user && user.id || null });
    if (!online()) {
      syncStatus(read(), 'offline', user.id);
      return Promise.resolve({ ready: false, reason: 'offline', userId: user.id });
    }
    if (freshHistoryPromise && freshHistoryUserId === user.id) return freshHistoryPromise;

    const userId = user.id;
    const fetchRevisionBefore = remoteFetchRevision;
    const syncWasInFlight = Boolean(syncPromise && syncUserId === userId);
    freshHistoryUserId = userId;
    freshHistoryPromise = (async function () {
      try {
        await sync('new-only-fresh-' + (reason || 'selection'));
        /* A sync that pre-dated this request could have started its SELECT
           before another device finished writing. Fetch once more after it
           settles, rather than using that potentially stale response. */
        if (syncWasInFlight) await sync('new-only-fresh-follow-up-' + (reason || 'selection'));
        const current = activeUser();
        const state = read();
        const fetchedAt = Number(record(state.sync.ledgerFetchedFor)[userId] || 0);
        const ready = Boolean(
          current && current.id === userId &&
          remoteFetchRevision > fetchRevisionBefore &&
          fetchedAt > 0 &&
          historyReadyForUser(state, current)
        );
        return {
          ready: ready,
          reason: ready ? 'fresh' : 'history-not-ready',
          userId: userId,
          fetchedAt: fetchedAt || null,
          remoteFetchRevision: remoteFetchRevision
        };
      } catch (error) {
        return {
          ready: false,
          reason: 'sync-error',
          userId: userId,
          error: String(error && error.message || error || 'Learning sync failed')
        };
      }
    }()).finally(function () {
      freshHistoryPromise = null;
      freshHistoryUserId = '';
    });
    return freshHistoryPromise;
  }

  /*
   * New-only selection has one last race that a fresh event-ledger fetch
   * cannot close: another device can select the same ID between that fetch and
   * this tab beginning its session.  The account database owns the definitive
   * compare-and-claim key, so callers send only their candidate IDs to its
   * narrowly-scoped RPC and use *only* the IDs returned as accepted.
   *
   * This intentionally does not optimistically mark local history as seen.
   * `startSession` still writes the durable question_exposed events before the
   * quiz opens; if that write-ahead step fails, the permanent server claim is
   * conservative rather than risking the question being handed out twice.
   */
  function reservationIds(examId, input) {
    const hasExplicitIds = Object.prototype.hasOwnProperty.call(input, 'questionIds');
    const candidates = hasExplicitIds ? asArray(input.questionIds) : asArray(input.questions);
    const ids = [];
    const known = new Set();
    candidates.forEach(function (candidate) {
      const id = typeof candidate === 'string'
        ? safeId(candidate, '')
        : safeId(questionId(examId, candidate), '');
      if (!id || known.has(id)) return;
      known.add(id);
      ids.push(id);
    });
    return ids;
  }

  function reserveNewQuestions(input) {
    input = record(input);
    const user = activeUser();
    const auth = window.UpskillAuth;
    const client = auth && typeof auth.getClient === 'function' ? auth.getClient() : null;
    const examId = safeId(input.examId, '');
    const ids = reservationIds(examId, input);
    const state = read();

    if (!user || !client) {
      return Promise.resolve({ reserved: false, ready: false, reason: 'not-signed-in', acceptedIds: [], rejectedIds: ids });
    }
    if (!online()) {
      syncStatus(state, 'offline', user.id);
      return Promise.resolve({ reserved: false, ready: false, reason: 'offline', acceptedIds: [], rejectedIds: ids, userId: user.id });
    }
    if (!examId || !ids.length || ids.length > 100) {
      return Promise.resolve({ reserved: false, ready: false, reason: 'invalid-candidates', acceptedIds: [], rejectedIds: ids, userId: user.id });
    }
    /* The server key protects the final race; local hydration protects the
       earlier one by keeping already-recorded account history out of the
       candidate list before it reaches the RPC. */
    if (!historyReadyForUser(state, user)) {
      return Promise.resolve({ reserved: false, ready: false, reason: 'history-not-ready', acceptedIds: [], rejectedIds: ids, userId: user.id });
    }
    if (typeof client.rpc !== 'function') {
      return Promise.resolve({ reserved: false, ready: false, reason: 'reservation-unavailable', acceptedIds: [], rejectedIds: ids, userId: user.id });
    }

    return Promise.resolve(client.rpc(NEW_ONLY_RESERVATION_RPC, {
      p_exam_id: examId,
      p_question_ids: ids
    })).then(function (result) {
      if (result && result.error) throw result.error;
      const current = activeUser();
      if (!current || current.id !== user.id) {
        return { reserved: false, ready: false, reason: 'account-changed', acceptedIds: [], rejectedIds: ids, userId: user.id };
      }
      const rows = result && result.data;
      /* A table-returning PostgreSQL RPC returns an array.  Do not infer a
         success from an unrecognised response shape, because that could let a
         malformed transport response start a supposedly protected quiz. */
      if (!Array.isArray(rows)) {
        return { reserved: false, ready: false, reason: 'invalid-response', acceptedIds: [], rejectedIds: ids, userId: user.id };
      }
      const requested = new Set(ids);
      const accepted = [];
      const acceptedSet = new Set();
      rows.forEach(function (row) {
        const id = typeof row === 'string' ? row : row && row.question_id;
        if (!requested.has(id) || acceptedSet.has(id)) return;
        acceptedSet.add(id);
        accepted.push(id);
      });
      return {
        reserved: true,
        ready: true,
        reason: 'reserved',
        examId: examId,
        userId: user.id,
        acceptedIds: accepted,
        rejectedIds: ids.filter(function (id) { return !acceptedSet.has(id); })
      };
    }).catch(function (error) {
      return {
        reserved: false,
        ready: false,
        reason: 'rpc-error',
        acceptedIds: [],
        rejectedIds: ids,
        userId: user.id,
        error: String(error && error.message || error || 'New-only reservation failed')
      };
    });
  }

  function scheduleSync(reason) {
    if (retryTimer) { clearTimeout(retryTimer); retryTimer = 0; }
    /* A write can happen after the current upload has snapshotted its pending
       batch. The active sync compares this revision at completion and queues
       one follow-up only for writes that truly occurred during that sync. */
    pendingWriteRevision += 1;
    Promise.resolve().then(function () { return sync(reason); }).catch(function () {
      retryAttempts = Math.min(retryAttempts + 1, 6);
      const delay = Math.min(60000, 1000 * Math.pow(2, retryAttempts));
      retryTimer = setTimeout(function () { retryTimer = 0; scheduleSync('retry'); }, delay);
    });
  }

  /* Anonymous activity is never silently bound to the next account on a
     shared device. A future signed-in UI may explicitly offer recovery and
     call this method after the learner confirms ownership. */
  function claimAnonymousEvents() {
    const user = activeUser();
    if (!user) return { claimed: 0, reason: 'not-signed-in' };
    const state = read();
    const anonymous = state.events.filter(function (event) { return event.scope === 'anonymous'; });
    anonymous.forEach(function (event) { event.scope = 'user:' + user.id; });
    if (anonymous.length) {
      /* Rebuild event indexes because scope participates in every aggregate. */
      state.index = freshState().index;
      state.events.forEach(function (event) { indexEvent(state, event, true); });
      state.migration.explicitAnonymousClaimedFor = user.id;
      state.migration.explicitAnonymousClaimedAt = now();
      persist(state, 'anonymous-events-claimed');
      scheduleSync('anonymous-events-claimed');
    }
    return { claimed: anonymous.length, userId: user.id };
  }

  function status() {
    const state = read();
    const user = activeUser();
    const hydrated = historyReadyForUser(state, user);
    return {
      signedIn: Boolean(user),
      userId: user && user.id || null,
      pending: pendingCount(state),
      pendingForUser: user ? pendingCount(state, user.id) : 0,
      anonymousPending: anonymousPendingCount(state),
      totalLocalEvents: state.events.length,
      lastUserId: lastUserId || null,
      online: online(),
      historyReady: hydrated,
      hydrated: hydrated,
      lastSyncAt: state.sync.lastSuccessAt || null,
      lastLedgerFetchAt: user ? Number(record(state.sync.ledgerFetchedFor)[user.id] || 0) || null : null,
      remoteFetchRevision: remoteFetchRevision,
      freshSyncInFlight: Boolean(freshHistoryPromise && freshHistoryUserId === (user && user.id)),
      lastError: state.sync.lastError || null,
      /* `true` means the most recent learner action made it through the
         synchronous localStorage write-ahead path before its API returned.
         A caller can fail the UI closed if browser storage is unavailable;
         IndexedDB remains an asynchronous secondary mirror. */
      writeAheadSaved: lastWriteAheadSaved,
      writeAheadAt: lastWriteAheadAt,
      storage: { localStorage: true, indexedDb: mirrorAvailable, indexedDbHydrated: mirrorHydrated }
    };
  }

  function attachAuthListener() {
    const auth = window.UpskillAuth;
    if (!auth || typeof auth.onChange !== 'function' || authListenerAttached) return false;
    authListenerAttached = true;
    auth.onChange(function (user) {
      if (user) {
        lastUserId = user.id;
        scheduleSync('auth-change');
      } else {
        /* Deliberately do not clear any local events. User-scoped entries stay
           in the local durable outbox and are not exposed to another account
           by localScopes(); a later sign-in can finish the upload. */
        emit('tb:learning-sync-status', { phase: 'signed-out', pending: pendingCount(read()), anonymousPending: anonymousPendingCount(read()) });
      }
    });
    if (activeUser()) scheduleSync('auth-listener-attached');
    return true;
  }

  function initialize() {
    if (initialized) { attachAuthListener(); return; }
    initialized = true;
    attachAuthListener();
    /* auth.js is injected by the site shell after this module on some pages. */
    document.addEventListener('upskill-auth-ready', function () { attachAuthListener(); if (activeUser()) scheduleSync('auth-ready'); });
    window.addEventListener('upskill-auth-ready', function () { attachAuthListener(); if (activeUser()) scheduleSync('auth-ready'); });
    document.addEventListener('upskill-test-progress-synced', function () { scanLegacyAfterProgressSync('account-progress-synced'); });
    window.addEventListener('upskill-test-progress-synced', function () { scanLegacyAfterProgressSync('account-progress-synced'); });
    window.addEventListener('online', function () { scheduleSync('online'); });
    window.addEventListener('focus', function () { scheduleSync('focus'); });
    window.addEventListener('pagehide', function () { scheduleSync('pagehide'); });
    window.addEventListener('storage', function (event) {
      if (event.key === STORE_KEY && !syncPromise) cachedState = null;
    });
    hydrateMirror().then(function () { if (activeUser()) scheduleSync('mirror-hydrated'); });
    if (activeUser()) scheduleSync('startup');
  }

  window.__TBLearning = {
    version: VERSION,
    startSession: startSession,
    recordAnswer: recordAnswer,
    completeSession: completeSession,
    abandonSession: abandonSession,
    claimAnonymousEvents: claimAnonymousEvents,
    hasSeen: hasSeen,
    summary: summary,
    status: status,
    sync: sync,
    ensureFreshHistory: ensureFreshHistory,
    reserveNewQuestions: reserveNewQuestions,
    store: read,
    eventsForExam: eventsForExam,
    seenQuestionIds: seenQuestionIds,
    questionId: questionId
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
