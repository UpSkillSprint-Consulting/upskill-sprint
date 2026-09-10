(function () {
  'use strict';

  const VERSION = '2.0.0';
  const ALLOCATE_RPC = 'reserve_test_bank_new_questions_v2';
  const MARK_RPC = 'mark_test_bank_new_only_reservation_v2';
  const FETCH_RPC = 'fetch_test_bank_new_only_reservation_v2';
  const STORAGE_PREFIX = 'tb-new-only-allocation-v2:';
  const ACTIVE_PREFIX = 'tb-new-only-active-v2:';
  const REQUEST_TIMEOUT_MS = 10000;
  let installed = false;
  let lastDisplayedKey = '';

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function record(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  function user() { const auth = window.UpskillAuth; return auth && typeof auth.getUser === 'function' ? auth.getUser() : null; }
  function client() { const auth = window.UpskillAuth; return auth && typeof auth.getClient === 'function' ? auth.getClient() : null; }
  function online() { return typeof navigator === 'undefined' || navigator.onLine !== false; }
  function safeId(value) { const text = String(value == null ? '' : value).trim(); return /^[A-Za-z0-9:_-]{3,180}$/.test(text) ? text : ''; }
  function uuidish() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID().replace(/-/g, '');
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 16);
  }
  function emit(name, detail) { try { document.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch (error) {} }
  function readJson(key) { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (error) { return null; } }
  function writeJson(key, value) { try { sessionStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { return false; } }
  function removeKey(key) { try { sessionStorage.removeItem(key); } catch (error) {} }
  function planKey(ownerId, examId) { return STORAGE_PREFIX + ownerId + ':' + examId; }
  function activeKey(sessionId) { return ACTIVE_PREFIX + sessionId; }

  function withTimeout(request, label) {
    return new Promise(function (resolve, reject) {
      let done = false;
      const timer = setTimeout(function () {
        if (done) return;
        done = true;
        const error = new Error(label + ' timed out');
        error.code = 'TB_NEW_ONLY_TIMEOUT';
        reject(error);
      }, REQUEST_TIMEOUT_MS);
      Promise.resolve(request).then(function (value) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve(value);
      }, function (error) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        reject(error);
      });
    });
  }

  function questionIds(learning, examId, input) {
    const raw = Object.prototype.hasOwnProperty.call(input, 'questionIds') ? asArray(input.questionIds) : asArray(input.questions);
    const seen = new Set(), ids = [];
    raw.forEach(function (candidate) {
      const id = typeof candidate === 'string' ? safeId(candidate) : safeId(learning.questionId(examId, candidate));
      if (!id || seen.has(id)) return;
      seen.add(id); ids.push(id);
    });
    return ids;
  }

  function identityValid(examId, input) {
    if (!(window.__TB && window.__TB.questionIdentityPolicy === 'explicit-v1')) return true;
    const registry = window.__TBQuestionRegistry;
    const candidates = Object.prototype.hasOwnProperty.call(input, 'questionIds') ? input.questionIds : input.questions;
    return Boolean(registry && typeof registry.validateSelection === 'function' && registry.validateSelection(examId, candidates).valid);
  }

  function versionValid(examId, ids) {
    if (!(window.__TB && window.__TB.examVersionPolicy === 'catalog-v1')) return true;
    try {
      const registry = window.__TBQuestionRegistry;
      if (!window.__TBVersions || !window.__TBVersionCatalog || !registry || typeof registry.find !== 'function') return false;
      if (!window.__TB.EXAMS || !window.__TB.EXAMS[examId] || !window.__TBVersionCatalog.exams || !window.__TBVersionCatalog.exams[examId]) return false;
      window.__TBVersions.validateCandidates(
        examId,
        ids.map(function (id) { return registry.find(examId, id); }),
        window.__TB.EXAMS[examId],
        window.__TBVersionCatalog.exams[examId]
      );
      return true;
    } catch (error) { return false; }
  }

  function pendingPlan(ownerId, examId) {
    const plan = record(readJson(planKey(ownerId, examId)));
    return plan.ownerId === ownerId && plan.examId === examId && plan.plannedSessionId && plan.status === 'reserved' ? plan : null;
  }

  function newPlan(ownerId, examId) {
    return { schemaVersion: VERSION, ownerId, examId, plannedSessionId: 'new-only-' + uuidish(), requestId: 'request-' + uuidish(), reservationId: null, acceptedIds: [], status: 'reserved', createdAt: Date.now() };
  }

  function failure(reason, ids, ownerId, error) {
    return { reserved: false, ready: false, reason, acceptedIds: [], rejectedIds: ids, userId: ownerId || null, error: error ? String(error && error.message || error) : undefined };
  }

  async function reserve(learning, input) {
    input = record(input);
    const current = user(), remote = client(), examId = safeId(input.examId), ids = questionIds(learning, examId, input);
    if (!identityValid(examId, input)) return failure('invalid-question-identity', [], current && current.id);
    if (!versionValid(examId, ids)) return failure('invalid-exam-version', ids, current && current.id);
    if (!current || !remote) return failure('not-signed-in', ids, current && current.id);
    if (!online()) return failure('offline', ids, current.id);
    if (!examId || !ids.length || ids.length > 100) return failure('invalid-candidates', ids, current.id);
    if (typeof remote.rpc !== 'function') return failure('reservation-unavailable', ids, current.id);

    let plan = pendingPlan(current.id, examId);
    const reusedRequest = Boolean(plan);
    if (!plan) {
      plan = newPlan(current.id, examId);
      if (!writeJson(planKey(current.id, examId), plan)) return failure('local-plan-storage-failed', ids, current.id);
    }

    try {
      const result = await withTimeout(remote.rpc(ALLOCATE_RPC, { p_exam_id: examId, p_planned_session_id: plan.plannedSessionId, p_request_id: plan.requestId, p_question_ids: ids }), 'New-only allocation');
      if (result && result.error) throw result.error;
      const after = user();
      if (!after || after.id !== current.id) return failure('account-changed', ids, current.id);
      const rows = result && result.data;
      if (!Array.isArray(rows)) return failure('invalid-response', ids, current.id);
      const accepted = [], acceptedSet = new Set();
      let reservationId = '', serverReused = reusedRequest;
      rows.forEach(function (row) {
        row = record(row);
        const id = safeId(row.question_id);
        if (!id || acceptedSet.has(id)) return;
        acceptedSet.add(id); accepted.push(id);
        reservationId = reservationId || String(row.reservation_id || '');
        serverReused = serverReused || row.reused === true;
      });
      if (!accepted.length || !reservationId) {
        removeKey(planKey(current.id, examId));
        return failure('pool-exhausted', ids, current.id);
      }
      plan.reservationId = reservationId; plan.acceptedIds = accepted; plan.status = 'reserved'; plan.updatedAt = Date.now();
      writeJson(planKey(current.id, examId), plan);
      emit('tb:new-only-allocation', { state: 'reserved', examId, reservationId, plannedSessionId: plan.plannedSessionId, reused: serverReused, count: accepted.length });
      return { reserved: true, ready: true, reason: serverReused ? 'reservation-reused' : 'reserved', examId, userId: current.id, reservationId, plannedSessionId: plan.plannedSessionId, acceptedIds: accepted, rejectedIds: ids.filter(function (id) { return !acceptedSet.has(id); }), reused: serverReused };
    } catch (error) {
      const message = String(error && error.message || error || '');
      if (/NEW_ONLY_EXHAUSTED/i.test(message)) {
        removeKey(planKey(current.id, examId));
        emit('tb:new-only-allocation', { state: 'blocked', reason: 'pool-exhausted', examId });
        return failure('pool-exhausted', ids, current.id, error);
      }
      if (/NEW_ONLY_RESERVATION_ABANDONED/i.test(message)) {
        removeKey(planKey(current.id, examId));
        return failure('reservation-abandoned', ids, current.id, error);
      }
      const reason = error && error.code === 'TB_NEW_ONLY_TIMEOUT' ? 'timeout' : 'rpc-error';
      emit('tb:new-only-allocation', { state: 'blocked', reason, examId });
      return failure(reason, ids, current.id, error);
    }
  }

  function mark(reservationId, state, questionId) {
    const remote = client();
    if (!reservationId || !remote || typeof remote.rpc !== 'function' || !online()) return Promise.resolve({ marked: false, reason: 'unavailable' });
    return withTimeout(remote.rpc(MARK_RPC, { p_reservation_id: reservationId, p_state: state, p_question_id: questionId || null }), 'New-only lifecycle update').then(function (result) {
      if (result && result.error) throw result.error;
      emit('tb:new-only-allocation', { state, reservationId, questionId: questionId || null });
      return { marked: true, state };
    }).catch(function (error) {
      emit('tb:new-only-allocation-error', { state, reservationId, questionId: questionId || null, error: String(error && error.message || error) });
      return { marked: false, reason: error && error.code === 'TB_NEW_ONLY_TIMEOUT' ? 'timeout' : 'rpc-error' };
    });
  }

  function activeReservation(sessionId) {
    const active = record(readJson(activeKey(sessionId)));
    return active.sessionId === sessionId && active.reservationId ? active : null;
  }

  function bindStartedSession(learning, input, result) {
    const current = user();
    if (!current || !result || result.saved === false || !result.sessionId) return;
    const examId = safeId(input && input.examId), plan = examId ? pendingPlan(current.id, examId) : null;
    if (!plan || !plan.reservationId) return;
    const startedIds = questionIds(learning, examId, record(input));
    if (!startedIds.some(function (id) { return plan.acceptedIds.indexOf(id) !== -1; })) return;
    const active = Object.assign({}, plan, { sessionId: result.sessionId, status: 'delivered', deliveredAt: Date.now() });
    writeJson(activeKey(result.sessionId), active);
    removeKey(planKey(current.id, examId));
    mark(plan.reservationId, 'delivered', null);
  }

  function displayedQuestion() {
    const quiz = document.querySelector('#tb-overview .tb-quiz[data-question-id]');
    if (!quiz) return;
    const id = safeId(quiz.dataset.questionId);
    if (!id) return;
    let matched = null;
    try {
      for (let i = 0; i < sessionStorage.length; i += 1) {
        const key = sessionStorage.key(i);
        if (!key || key.indexOf(ACTIVE_PREFIX) !== 0) continue;
        const candidate = record(readJson(key));
        if (candidate.reservationId && asArray(candidate.acceptedIds).indexOf(id) !== -1) { matched = candidate; break; }
      }
    } catch (error) {}
    if (!matched) return;
    const marker = matched.reservationId + ':' + id;
    if (marker === lastDisplayedKey) return;
    lastDisplayedKey = marker;
    mark(matched.reservationId, 'displayed', id);
  }

  function installDisplayObserver() {
    if (!document.documentElement || window.__TBNewOnlyDisplayObserverV2) return;
    window.__TBNewOnlyDisplayObserverV2 = new MutationObserver(displayedQuestion);
    window.__TBNewOnlyDisplayObserverV2.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-question-id'] });
    displayedQuestion();
  }

  function install() {
    const learning = window.__TBLearning;
    if (!learning || installed) return false;
    installed = true;
    const original = {
      reserveNewQuestions: learning.reserveNewQuestions && learning.reserveNewQuestions.bind(learning),
      startSession: learning.startSession && learning.startSession.bind(learning),
      recordAnswer: learning.recordAnswer && learning.recordAnswer.bind(learning),
      abandonSession: learning.abandonSession && learning.abandonSession.bind(learning),
      completeSession: learning.completeSession && learning.completeSession.bind(learning)
    };
    learning.reserveNewQuestions = function (input) { return reserve(learning, input); };
    if (original.startSession) learning.startSession = function (input) { const result = original.startSession(input); bindStartedSession(learning, record(input), result); return result; };
    if (original.recordAnswer) learning.recordAnswer = function (input) {
      const result = original.recordAnswer(input), active = activeReservation(String(input && input.sessionId || ''));
      if (active && result && result.saved !== false && input && input.question) {
        const qid = safeId(learning.questionId(input.examId || active.examId, input.question));
        if (qid && active.acceptedIds.indexOf(qid) !== -1) mark(active.reservationId, 'answered', qid);
      }
      return result;
    };
    if (original.abandonSession) learning.abandonSession = function (input) {
      const sessionId = String(input && input.sessionId || ''), active = activeReservation(sessionId), result = original.abandonSession(input);
      if (active && result) { mark(active.reservationId, 'abandoned', null); removeKey(activeKey(sessionId)); }
      return result;
    };
    if (original.completeSession) learning.completeSession = function (input) {
      const sessionId = String(input && input.sessionId || ''), result = original.completeSession(input);
      if (result && result.saved !== false) removeKey(activeKey(sessionId));
      return result;
    };
    learning.newOnlyAllocationVersion = VERSION;
    installDisplayObserver();
    emit('tb:new-only-allocation-ready', { version: VERSION });
    return true;
  }

  window.__TBNewOnlyAllocationV2 = {
    version: VERSION,
    allocateRpc: ALLOCATE_RPC,
    markRpc: MARK_RPC,
    fetchRpc: FETCH_RPC,
    install,
    mark,
    pendingPlan: function (examId) { const current = user(); return current ? pendingPlan(current.id, safeId(examId)) : null; }
  };

  if (!install()) {
    document.addEventListener('DOMContentLoaded', install, { once: true });
    document.addEventListener('tb:learning-ready', install);
    window.addEventListener('upskill-auth-ready', install);
  }
}());
