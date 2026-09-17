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

  function accessibleStorage(name) {
    try { return window[name]; } catch (_) { return null; }
  }

  function blockExamStorage() {
    // Storage objects use named-property setters. Assigning storage.setItem can
    // create a stored string instead of overriding the method in WebKit.
    // Intercept the methods on the shared prototype, and preserve their native
    // receiver and behaviour for every non-exam key (including account/theme).
    const prototype = window.Storage && window.Storage.prototype;
    if (!prototype) return;
    const get = prototype.getItem;
    const set = prototype.setItem;
    const remove = prototype.removeItem;
    Object.defineProperties(prototype, {
      getItem: {configurable: true, writable: true, value: function (key) {
        return isExamStorageKey(key) ? null : get.call(this, key);
      }},
      setItem: {configurable: true, writable: true, value: function (key, value) {
        if (!isExamStorageKey(key)) return set.call(this, key, value);
      }},
      removeItem: {configurable: true, writable: true, value: function (key) {
        return remove.call(this, key);
      }}
    });
  }

  clearOldExamStorage(accessibleStorage('localStorage'));
  clearOldExamStorage(accessibleStorage('sessionStorage'));
  blockExamStorage();

  function clone(value) {
    if (value == null) return value;
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
  }

  function questionId(examId, question) {
    const q = question || {};
    return String(q.qid || q.questionId || q.id || q.key || ((examId || 'exam') + ':' + (q.q || q.stem || 'question')));
  }

  /* The stateless delivery still needs deterministic scoring to open the
     result screen. Keep this small compatibility surface in memory: it grades
     only the current session and never writes learner data anywhere. */
  function classify(question, selected) {
    const q = question || {};
    if (!Array.isArray(q.options) || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      throw new Error('Invalid single-select answer key');
    }
    if (selected != null && (!Number.isInteger(selected) || selected < 0 || selected >= q.options.length)) {
      throw new Error('Invalid selected option');
    }
    return selected == null ? 'unanswered' : selected === q.answer ? 'correct' : 'incorrect';
  }

  function scoreRecords(records, configuration) {
    const counts = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
    const byDomain = {};
    const bySubtopic = {};
    (records || []).forEach((record) => {
      const question = record && record.question;
      const status = classify(question, record && record.selected);
      const subtopic = String(question.sub || 'general');
      let domain = null;
      if (configuration && Array.isArray(configuration.bok)) {
        const match = configuration.bok.find((area) => Array.isArray(area.subs) && area.subs.some((sub) => sub.id === question.sub));
        domain = match && match.domain || null;
      }
      counts.total += 1;
      counts[status] += 1;
      if (!bySubtopic[subtopic]) bySubtopic[subtopic] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
      bySubtopic[subtopic].total += 1;
      bySubtopic[subtopic][status] += 1;
      if (domain) {
        if (!byDomain[domain]) byDomain[domain] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
        byDomain[domain].total += 1;
        byDomain[domain][status] += 1;
      }
    });
    return Object.assign(counts, { byDomain: byDomain, bySubtopic: bySubtopic });
  }

  function scoreCounts(counts, siteTargetBps) {
    const total = Number(counts && counts.total);
    const correct = Number(counts && counts.correct);
    if (!Number.isSafeInteger(total) || total < 0 || !Number.isSafeInteger(correct) || correct < 0 || correct > total) {
      throw new Error('Invalid score counts');
    }
    const target = siteTargetBps == null ? null : Number(siteTargetBps);
    if (target != null && (!Number.isInteger(target) || target < 0 || target > 10000)) {
      throw new Error('Invalid site target');
    }
    const scorePercent = total ? 100 * correct / total : null;
    return {
      total: total,
      correct: correct,
      scorePercent: scorePercent,
      siteTargetBps: target,
      siteTargetMet: !total || target == null ? null : correct * 10000 >= total * target,
      margin: !total || target == null ? null : (correct * 10000 - total * target) / (total * 100)
    };
  }

  function formatScore(value, digits) {
    if (value == null || !Number.isFinite(value)) return 'Unavailable';
    const text = value.toFixed(digits == null ? 2 : digits);
    return (text.includes('.') ? text.replace(/0+$/, '').replace(/\.$/, '') : text) + '%';
  }

  const scoring = Object.freeze({
    classify: classify,
    scoreRecords: scoreRecords,
    scoreCounts: scoreCounts,
    formatScore: formatScore,
    reference: function () { return null; }
  });

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
      const grading = scoreRecords(input && input.records || []);
      if (row) {
        row.completedAt = Date.now();
        row.records = clone(input && input.records || []);
      }
      writeAheadSaved = true;
      return { saved: true, sessionId: id, grading: grading, memoryOnly: true };
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
  if (!window.__TBVersions) window.__TBVersions = scoring;
  window.__TBLearning = api;

  try {
    document.dispatchEvent(new CustomEvent('tb:learning-ready', { detail: { memoryOnly: true } }));
  } catch (_) {}
}());
