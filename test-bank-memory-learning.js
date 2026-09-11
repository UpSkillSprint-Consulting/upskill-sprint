(function () {
  'use strict';

  const sessions = new Map();
  let counter = 0;
  let writeAheadSaved = true;

  function isExamStorageKey(key) {
    const value = String(key || '').toLowerCase();
    return value.startsWith('tb-') || value.startsWith('test-bank') || value.startsWith('upskill-test-bank');
  }

  function clearOldExamStorage(storage) {
    if (!storage) return;
    const keys = [];
    try {
      for (let i = 0; i < storage.length; i += 1) {
        const key = storage.key(i);
        if (isExamStorageKey(key)) keys.push(key);
      }
      keys.forEach((key) => storage.removeItem(key));
    } catch (_) {}
  }

  function blockExamStorage(storage) {
    if (!storage) return;
    try {
      const originalGet = storage.getItem.bind(storage);
      const originalSet = storage.setItem.bind(storage);
      const originalRemove = storage.removeItem.bind(storage);
      storage.getItem = function (key) {
        return isExamStorageKey(key) ? null : originalGet(key);
      };
      storage.setItem = function (key, value) {
        if (isExamStorageKey(key)) return;
        return originalSet(key, value);
      };
      storage.removeItem = function (key) {
        if (isExamStorageKey(key)) return;
        return originalRemove(key);
      };
    } catch (_) {}
  }

  clearOldExamStorage(window.localStorage);
  clearOldExamStorage(window.sessionStorage);
  blockExamStorage(window.localStorage);
  blockExamStorage(window.sessionStorage);

  function clone(value) {
    if (value == null) return value;
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
  }

  function questionId(examId, question) {
    const q = question || {};
    return String(q.qid || q.questionId || q.id || q.key || ((examId || 'exam') + ':' + (q.q || q.stem || 'question')));
  }

  function makeSessionId() {
    counter += 1;
    return 'memory-' + Date.now().toString(36) + '-' + counter.toString(36);
  }

  const api = {
    memoryOnly: true,
    status: function () {
      return {
        signedIn: false,
        userId: null,
        hydrated: true,
        writeAheadSaved: writeAheadSaved,
        pending: 0,
        anonymousPending: 0,
        mode: 'memory-only'
      };
    },
    questionId: questionId,
    startSession: function (input) {
      const sessionId = makeSessionId();
      sessions.set(sessionId, {
        sessionId: sessionId,
        examId: input && input.examId || null,
        mode: input && input.mode || null,
        timed: !!(input && input.timed),
        answers: {},
        startedAt: Date.now()
      });
      writeAheadSaved = true;
      return { saved: true, sessionId: sessionId, memoryOnly: true };
    },
    recordAnswer: function (input) {
      const row = input && sessions.get(String(input.sessionId || ''));
      if (row) row.answers[String(input.index)] = {
        questionId: questionId(input.examId, input.question),
        selected: input.selected,
        status: input.status
      };
      writeAheadSaved = true;
      return { saved: true, memoryOnly: true };
    },
    recordDraft: function () {
      writeAheadSaved = true;
      return { saved: true, memoryOnly: true };
    },
    completeSession: function (input) {
      const id = String(input && input.sessionId || '');
      const row = sessions.get(id);
      if (row) {
        row.completedAt = Date.now();
        row.records = clone(input && input.records || []);
      }
      writeAheadSaved = true;
      return { saved: true, sessionId: id, memoryOnly: true };
    },
    abandonSession: function (input) {
      const id = String(input && input.sessionId || input || '');
      sessions.delete(id);
      writeAheadSaved = true;
      return { saved: true, sessionId: id, memoryOnly: true };
    },
    hasSeen: function () { return false; },
    seenQuestionIds: function () { return []; },
    missedQuestionIds: function () { return []; },
    store: function () {
      return { events: [], sessions: {}, index: { seen: {}, knownEventIds: {} } };
    },
    sync: function () {
      return Promise.resolve({ ok: true, saved: true, pending: 0, memoryOnly: true });
    }
  };

  window.__TB_MEMORY_ONLY = true;
  window.__TBLearning = api;

  try {
    document.dispatchEvent(new CustomEvent('tb:learning-ready', { detail: { memoryOnly: true } }));
  } catch (_) {}
}());
