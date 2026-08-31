(function () {
  'use strict';

  /*
   * One canonical identity for every live test-bank question.
   *
   * Earlier learning features keyed progress from question wording.  That made a
   * harmless wording correction look like a brand-new question and also caused
   * distinct questions with the same stem to collapse into one record.  The
   * registry deliberately assigns an ID once from the authoritative exam/set
   * position (or a supplied qid/questionId) and makes that ID available to every
   * learning feature.
   *
   * New imported questions should supply `qid` (or `questionId`).  Existing
   * banks are assigned deterministic legacy IDs so historical progress can be
   * migrated without changing hundreds of source questions in one release.
   */
  const VERSION = 1;
  const objectIds = typeof WeakMap === 'function' ? new WeakMap() : null;
  const cache = new Map();

  function hash(value) {
    let output = 2166136261;
    String(value == null ? '' : value).split('').forEach(function (character) {
      output ^= character.charCodeAt(0);
      output = Math.imul(output, 16777619);
    });
    return (output >>> 0).toString(36);
  }

  function cleanId(value) {
    const text = String(value == null ? '' : value).trim();
    return /^[A-Za-z0-9:_-]{3,180}$/.test(text) ? text : '';
  }

  function examSource(examId) {
    return window.__TB && window.__TB.EXAMS ? window.__TB.EXAMS[examId] : null;
  }

  function suppliedId(question) {
    if (!question || typeof question !== 'object') return '';
    return cleanId(question.questionId || question.qid || question.id || question.question_id);
  }

  function assign(question, id) {
    if (!question || !id) return '';
    if (objectIds) objectIds.set(question, id);
    try {
      Object.defineProperty(question, '__tbQuestionId', {
        value: id,
        configurable: true,
        enumerable: false,
        writable: true
      });
    } catch (error) {
      try { question.__tbQuestionId = id; } catch (ignored) {}
    }
    return id;
  }

  function remembered(question) {
    if (!question) return '';
    const fromObject = objectIds && objectIds.get(question);
    return cleanId(fromObject || question.__tbQuestionId);
  }

  function sourceId(examId, setId, index, question) {
    const explicit = suppliedId(question);
    if (explicit) return explicit;
    const sourceQuestion = Number(question && (question.sourceGlobalQuestion || question.sourceQuestion));
    const sourceSection = question && question.sourceSection ? hash(String(question.sourceSection).toLowerCase()) : '';
    if (Number.isFinite(sourceQuestion) && sourceQuestion > 0) {
      return examId + ':set-' + setId + ':source-' + sourceQuestion + (sourceSection ? ':' + sourceSection : '');
    }
    return examId + ':set-' + setId + ':legacy-' + (index + 1);
  }

  function register(examId) {
    const source = examSource(examId);
    if (!source) return { version: VERSION, examId: examId, questions: [], byId: new Map(), warnings: [] };
    const existing = cache.get(examId);
    if (existing && existing.source === source) return existing;

    const questions = [];
    const byId = new Map();
    const warnings = [];
    const added = new Set();

    function add(question, setId, index) {
      if (!question || typeof question !== 'object') return;
      let id = remembered(question) || sourceId(examId, setId, index, question);
      if (!id) id = examId + ':unknown:' + hash(String(question.stem || '') + '|' + index);
      assign(question, id);
      if (byId.has(id) && byId.get(id) !== question) {
        warnings.push('Duplicate question ID ' + id + ' in ' + examId + '. Add an explicit qid to the new question.');
        return;
      }
      byId.set(id, question);
      if (!added.has(id)) {
        added.add(id);
        questions.push(question);
      }
    }

    const sets = source.sets && typeof source.sets === 'object' ? source.sets : null;
    if (sets) {
      Object.keys(sets).sort(function (a, b) { return Number(a) - Number(b) || String(a).localeCompare(String(b)); }).forEach(function (setId) {
        const set = Array.isArray(sets[setId]) ? sets[setId] : [];
        set.forEach(function (question, index) { add(question, setId, index); });
      });
    }
    (Array.isArray(source.bank) ? source.bank : []).forEach(function (question, index) {
      add(question, question && question.set != null ? String(question.set) : 'bank', index);
    });

    const registry = { version: VERSION, examId: examId, source: source, questions: questions, byId: byId, warnings: warnings };
    cache.set(examId, registry);
    return registry;
  }

  function idFor(examId, question) {
    const known = remembered(question);
    if (known) return known;
    const registry = register(examId);
    if (question && registry.byId) {
      for (const entry of registry.byId.entries()) if (entry[1] === question) return entry[0];
    }
    const explicit = suppliedId(question);
    if (explicit) return assign(question, explicit);
    /* Fallback only for a question outside the published bank (for example a
       test fixture). It is intentionally deterministic, but live imports must
       use qid/questionId so wording edits retain identity. */
    return assign(question, String(examId || 'unknown') + ':external:' + hash(String(question && question.stem || '') + '|' + JSON.stringify(question && question.options || [])));
  }

  function questionsFor(examId) { return register(examId).questions.slice(); }
  function find(examId, questionId) { return register(examId).byId.get(String(questionId || '')) || null; }
  function legacyStemHash(stem) { return hash(stem); }

  window.__TBQuestionRegistry = {
    version: VERSION,
    register: register,
    idFor: idFor,
    questionsFor: questionsFor,
    find: find,
    legacyStemHash: legacyStemHash,
    validate: function (examId) {
      const registry = register(examId);
      const explicit = registry.questions.filter(function (question) { return Boolean(suppliedId(question)); }).length;
      return {
        examId: examId,
        total: registry.questions.length,
        explicitIds: explicit,
        derivedLegacyIds: registry.questions.length - explicit,
        warnings: registry.warnings.slice()
      };
    }
  };
}());
