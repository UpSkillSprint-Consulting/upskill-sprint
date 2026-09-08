(function () {
  'use strict';

  /* Canonical question identity is explicit in the live simulator. Registration
   * validates the entire bank before assigning any IDs; rejected candidates never
   * become partial pools. Legacy derivation is retained only for old non-live
   * adapters without the explicit-v1 policy, never for the strict import API.
   * Set membership and wording do not define identity. Catalog revisions follow
   * in Segment 05; no learner evidence is changed here. */
  const VERSION = 2;
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

  const own = function (value, key) { return Object.prototype.hasOwnProperty.call(value, key); };
  const fields = ['qid', 'questionId', 'id', 'question_id'];
  const isRecord = function (value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); };
  function explicitPolicy() { return Boolean(window.__TB && window.__TB.questionIdentityPolicy === 'explicit-v1'); }
  function declaration(question) {
    const values = fields.filter(function (key) { return own(question, key); }).map(function (key) { return question[key]; });
    if (!values.length) return { id: '', code: 'MISSING_ID' };
    if (values.some(function (id) { return typeof id !== 'string' || !/^[A-Za-z0-9:_-]{3,180}$/.test(id); })) return { id: '', code: 'INVALID_ID' };
    if (values.some(function (id) { return id !== values[0]; })) return { id: '', code: 'CONFLICTING_ID_FIELDS' };
    return { id: values[0], code: null };
  }
  function issue(code, examId, location, id, message) {
    return { code: code, examId: examId, location: location, questionId: id || null, message: message };
  }

  /* Pure, complete candidate validation. Nothing is assigned/cached/published until
     this succeeds. Mirror references in bank/another set are membership, not new
     identities; two different objects claiming one ID are ambiguous and rejected. */
  function inspect(examId, source, options) {
    const legacy = Boolean(options && options.legacy);
    const errors = [], questions = [], byId = new Map(), memberships = new Map(), origins = new Map();
    const domains = new Set();
    let published = false;
    function error(code, location, id, message) { errors.push(issue(code, examId, location, id, message)); }
    try {
      if (typeof examId !== 'string' || !/^[a-z][a-z0-9_-]{0,39}$/.test(examId)) error('INVALID_EXAM', 'exam', '', 'Use the configured certification namespace.');
      if (!isRecord(source)) error('INVALID_BANK', 'exam', '', 'The candidate bank must be an object.');
      else {
        published = own(source, 'sets') || own(source, 'bank');
        (Array.isArray(source.bok) ? source.bok : []).forEach(function (domain, domainIndex) {
          (Array.isArray(domain && domain.subs) ? domain.subs : []).forEach(function (sub) {
            if (!sub || typeof sub.id !== 'string' || !sub.id) { if (!legacy && published) error('INVALID_DOMAIN', 'bok[' + domainIndex + ']', '', 'A configured subtopic needs a nonempty ID.'); return; }
            if (domains.has(sub.id)) error('DUPLICATE_DOMAIN', 'bok[' + domainIndex + ']', '', 'Subtopic ' + sub.id + ' maps to more than one domain.');
            domains.add(sub.id);
          });
        });
        if (!legacy && published && !domains.size) error('MISSING_DOMAINS', 'bok', '', 'Configure the bank subtopics before publishing questions.');
        function visit(rows, setId, location) {
          if (!Array.isArray(rows)) { error('INVALID_SET', location, '', 'Every set/bank must be an array.'); return; }
          const inList = new Set();
          // Index iteration also catches sparse-array holes, unlike forEach.
          for (let index = 0; index < rows.length; index++) {
            const q = rows[index], where = location + '[' + index + ']';
            if (!isRecord(q)) { error('INVALID_QUESTION', where, '', 'Each question must be an object.'); continue; }
            const declared = declaration(q);
            let id = declared.id;
            if (declared.code) {
              if (legacy && declared.code === 'MISSING_ID') id = remembered(q) || sourceId(examId, setId, index, q);
              else { error(declared.code, where, '', 'Supply one explicit stable string ID; all supplied ID aliases must agree.'); continue; }
            }
            if (id.indexOf(examId + ':') !== 0 || id.length <= examId.length + 1) error('WRONG_NAMESPACE', where, id, 'Question ID must start with ' + examId + ': and retain its original identity.');
            const old = remembered(q);
            if (old && old !== id) error('IDENTITY_CHANGED', where, id, 'A registered object cannot be renamed. Preserve its original ID ' + old + '.');
            if (!legacy && (typeof q.sub !== 'string' || !domains.has(q.sub))) error('UNKNOWN_DOMAIN', where, id, 'Question subtopic must resolve to exactly one configured domain.');
            if (inList.has(id)) error('DUPLICATE_MEMBERSHIP', where, id, 'A question cannot occur twice in the same set/bank.');
            inList.add(id);
            if (byId.has(id) && byId.get(id) !== q) error('DUPLICATE_ID', where, id, 'Another question object already uses this ID at ' + origins.get(id) + '. Give a genuinely new question a new explicit ID.');
            if (!byId.has(id)) { byId.set(id, q); origins.set(id, where); questions.push(q); memberships.set(id, []); }
            if (setId !== 'bank' && memberships.get(id).indexOf(setId) < 0) memberships.get(id).push(setId);
          }
        }
        if (own(source, 'sets')) {
          if (!isRecord(source.sets)) error('INVALID_SETS', 'sets', '', 'Sets must be a map of arrays.');
          else Object.keys(source.sets).sort().forEach(function (setId) {
            if (!/^[A-Za-z0-9_-]{1,40}$/.test(setId) || ['__proto__', 'prototype', 'constructor'].indexOf(setId) >= 0) error('INVALID_SET_ID', 'sets', '', 'Use a safe, explicit set key.');
            visit(source.sets[setId], setId, 'sets.' + setId);
          });
        }
        if (own(source, 'bank')) visit(source.bank, 'bank', 'bank');
        if (published && !questions.length && !legacy) error('EMPTY_BANK', 'exam', '', 'No valid published questions were supplied.');
      }
    } catch (errorValue) { error('UNREADABLE_BANK', 'exam', '', 'The candidate could not be read safely. Use plain question data.'); }
    return { version: VERSION, examId: examId, source: source, published: published, valid: errors.length === 0,
      candidateTotal: questions.length, questions: questions, byId: byId, memberships: memberships,
      errors: errors, warnings: errors.map(function (entry) { return entry.code + ': ' + entry.message; }) };
  }

  // Cache identity/domain structure, not just the source object reference. Wording
  // is deliberately absent: editing prose is not a new identity. Each ID lookup
  // on an already remembered object stays O(1); bank reads detect in-place changes.
  function stamp(source) {
    try {
      if (!isRecord(source)) return [source];
      const result = [source, source.sets, source.bank, source.bok, explicitPolicy()];
      const lists = isRecord(source.sets) ? Object.keys(source.sets).sort().map(function (key) { result.push(key); return source.sets[key]; }) : [];
      lists.push(source.bank);
      lists.forEach(function (rows) {
        result.push(rows, Array.isArray(rows) ? rows.length : -1);
        if (Array.isArray(rows)) rows.forEach(function (q) {
          result.push(q, q && q.sub);
          fields.forEach(function (key) { result.push(q && own(q, key), q && q[key]); });
        });
      });
      (Array.isArray(source.bok) ? source.bok : []).forEach(function (d) {
        result.push(d, d && d.subs);
        (Array.isArray(d && d.subs) ? d.subs : []).forEach(function (sub) { result.push(sub && sub.id); });
      });
      return result;
    } catch (error) { return null; }
  }
  function sameStamp(a, b) { return a && b && a.length === b.length && a.every(function (value, i) { return value === b[i]; }); }
  function publicResult(registry) {
    const explicit = registry.valid ? registry.questions.filter(function (q) { return Boolean(declaration(q).id); }).length : 0;
    return { examId: registry.examId, valid: registry.valid, published: registry.published,
      total: registry.valid ? registry.questions.length : 0, candidateTotal: registry.candidateTotal,
      explicitIds: explicit, derivedLegacyIds: registry.valid ? registry.questions.length - explicit : 0,
      errors: registry.errors.map(function (e) { return Object.assign({}, e); }), warnings: registry.warnings.slice() };
  }
  function showErrors(examId, errors, rejectedImport) {
    if (!document || typeof document.createElement !== 'function' || !document.body) return;
    const text = (rejectedImport ? 'Question bank update rejected. The previous bank has not been changed. ' : 'This question bank is unavailable until its identity errors are corrected. ') +
      'Certification: ' + examId + '. ' + errors.length + ' issue(s). No learner history was reset.';
    let alert = document.getElementById('tb-question-identity-alert');
    const signature = text + JSON.stringify(errors.slice(0, 10));
    if (alert && alert.__identityMessage === signature) return;
    if (!alert) {
      alert = document.createElement('section'); alert.id = 'tb-question-identity-alert'; alert.setAttribute('role', 'alert'); alert.setAttribute('aria-live', 'assertive');
      alert.style.cssText = 'margin:12px auto;padding:16px;max-width:1100px;box-sizing:border-box;border:2px solid var(--ink);border-radius:10px;background:var(--card);color:var(--ink);overflow-wrap:anywhere';
      const hero = document.getElementById('tb-hero');
      if (hero && hero.parentNode) hero.parentNode.insertBefore(alert, hero.nextSibling); else document.body.insertBefore(alert, document.body.firstChild);
    }
    alert.__identityMessage = signature; alert.dataset.exam = examId; alert.replaceChildren();
    const heading = document.createElement('strong'); heading.textContent = text; alert.appendChild(heading);
    const details = document.createElement('details'), summary = document.createElement('summary'); summary.textContent = 'Validation details for the question-bank author'; details.appendChild(summary);
    errors.slice(0, 10).forEach(function (e) { const p = document.createElement('p'); p.textContent = e.code + ' · ' + e.location + (e.questionId ? ' · ' + e.questionId : '') + ': ' + e.message; details.appendChild(p); });
    if (errors.length > 10) { const more = document.createElement('p'); more.textContent = 'Showing the first 10 issues. The validation result contains all ' + errors.length + '.'; details.appendChild(more); }
    alert.appendChild(details);
  }
  function clearErrors(examId) {
    const alert = document.getElementById('tb-question-identity-alert');
    if (alert && alert.dataset.exam === examId) alert.remove();
  }
  function register(examId) {
    const source = examSource(examId), fingerprint = stamp(source), existing = cache.get(examId);
    if (existing && sameStamp(existing.fingerprint, fingerprint)) return existing;
    const registry = inspect(examId, source, { legacy: !explicitPolicy() });
    registry.fingerprint = fingerprint;
    if (registry.valid) registry.byId.forEach(function (question, id) { assign(question, id); });
    // Never expose a partial subset of a malformed bank as if it had registered.
    else { registry.questions = []; registry.byId = new Map(); showErrors(examId, registry.errors, false); }
    cache.set(examId, registry);
    return registry;
  }

  function idFor(examId, question) {
    if (!isRecord(question)) return '';
    const declared = declaration(question), known = remembered(question);
    if (declared.code && (explicitPolicy() || declared.code !== 'MISSING_ID')) return '';
    if (declared.id && (declared.id.indexOf(examId + ':') !== 0 || declared.id.length <= examId.length + 1 || (known && known !== declared.id))) return '';
    if (known) return known.indexOf(examId + ':') === 0 ? known : '';
    const registry = register(examId);
    if (!registry.valid && registry.published) return '';
    const registered = remembered(question);
    if (registered) return registered;
    // Explicit retired snapshots may still resolve by their original identity.
    if (declared.id) return assign(question, declared.id);
    if (explicitPolicy()) return ''; // no wording/position-derived live identities
    return assign(question, String(examId || 'unknown') + ':external:' + hash(String(question.stem || '') + '|' + JSON.stringify(question.options || [])));
  }

  function questionsFor(examId) { return register(examId).questions.slice(); }
  function find(examId, questionId) { return register(examId).byId.get(String(questionId || '')) || null; }
  function legacyStemHash(stem) { return hash(stem); }

  function ensure(examId) {
    const result = register(examId);
    if (!result.valid) { showErrors(examId, result.errors, false); return false; }
    clearErrors(examId); return true;
  }
  function validateSelection(examId, items, requireObjects) {
    const registry = register(examId), errors = registry.errors.slice(), ids = new Set();
    if (!Array.isArray(items) || !items.length) errors.push(issue('EMPTY_SELECTION', examId, 'items', '', 'Select at least one valid question.'));
    else Array.from(items).forEach(function (item, index) {
      const id = typeof item === 'string' ? item : isRecord(item) ? declaration(item).id : '';
      if (requireObjects && !isRecord(item)) errors.push(issue('INVALID_SELECTION_TYPE', examId, 'items[' + index + ']', id, 'A new session requires canonical question objects, not raw IDs.'));
      if (!id || !registry.byId.has(id)) errors.push(issue('UNKNOWN_SELECTION', examId, 'items[' + index + ']', id, 'Every planned ID must belong to the accepted certification bank.'));
      if (id && typeof item !== 'string' && registry.byId.has(id) && registry.byId.get(id) !== item) errors.push(issue('NONCANONICAL_QUESTION', examId, 'items[' + index + ']', id, 'A new session must use the accepted question object, not an altered copy.'));
      if (ids.has(id)) errors.push(issue('DUPLICATE_SELECTION', examId, 'items[' + index + ']', id, 'A session plan cannot contain the same question twice.'));
      ids.add(id);
    });
    if (errors.length) showErrors(examId, errors, false);
    return { valid: errors.length === 0, errors: errors };
  }

  /* Authoring/import boundary, not a new student upload feature. Only set data is
     accepted: exam/grading metadata is retained. All validation happens before the
     single synchronous publish. Deleting/retiring IDs and live-session replacement
     require the versioned catalog/lifecycle work in later segments. */
  function replaceBankUnchecked(examId, sets) {
    const source = examSource(examId), current = register(examId);
    function reject(errors) { showErrors(examId, errors, true); return { accepted: false, errors: errors }; }
    if (!source || !current.valid) return reject([issue('INVALID_CURRENT_BANK', examId, 'exam', '', 'Repair the current bank before applying an update.')]);
    const learning = window.__TBLearning;
    const storedSessions = learning && typeof learning.store === 'function' ? learning.store().sessions : {};
    if ((window.__TB.isExamSessionActive && window.__TB.isExamSessionActive(examId)) || Object.keys(storedSessions || {}).some(function (id) { const s = storedSessions[id]; return s && s.examId === examId && s.status === 'active'; })) {
      return reject([issue('ACTIVE_SESSION', examId, 'exam', '', 'Finish or abandon the active session before replacing its bank.')]);
    }
    // Detach arrays so later edits to an import buffer cannot mutate a published bank.
    const staged = Object.create(null);
    if (!isRecord(sets)) return reject([issue('INVALID_SETS', examId, 'sets', '', 'Supply a map of set arrays.')]);
    Object.keys(sets).forEach(function (id) { staged[id] = Array.isArray(sets[id]) ? sets[id].slice() : sets[id]; });
    const candidate = Object.assign({}, source, { sets: staged, bank: staged['1'] });
    const checked = inspect(examId, candidate), errors = checked.errors.slice();
    current.byId.forEach(function (_, id) { if (!checked.byId.has(id)) errors.push(issue('MISSING_EXISTING_ID', examId, 'sets', id, 'This update would remove an existing identity. Retirement requires an explicit catalog migration.')); });
    if (errors.length) return reject(errors);
    // Import content-shape validation prevents a valid ID masking an unrenderable row.
    function checkContent(rows, targetErrors) {
      rows.forEach(function (q) {
        if (typeof q.stem !== 'string' || !q.stem.trim() || !Array.isArray(q.options) || q.options.length !== 4 || Array.from(q.options).some(function (o) { return typeof o !== 'string' || !o.trim(); }) || !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3 || typeof q.why !== 'string' || !q.why.trim()) targetErrors.push(issue('INVALID_CONTENT', examId, 'question', declaration(q).id, 'Provide a stem, four nonempty options, answer index 0–3 and explanation.'));
      });
    }
    checkContent(checked.questions, errors);
    if (errors.length) return reject(errors);
    // Detach question/nested chart data while preserving intentional reference aliases.
    const copies = new Map(), detached = Object.create(null);
    Object.keys(staged).forEach(function (setId) {
      detached[setId] = staged[setId].map(function (q) {
        if (!copies.has(q)) copies.set(q, JSON.parse(JSON.stringify(q)));
        return copies.get(q);
      });
    });
    candidate.sets = detached; candidate.bank = detached['1'];
    const finalCheck = inspect(examId, candidate);
    const finalErrors = finalCheck.errors.slice();
    checkContent(finalCheck.questions, finalErrors);
    current.byId.forEach(function (_, id) { if (!finalCheck.byId.has(id)) finalErrors.push(issue('MISSING_EXISTING_ID', examId, 'sets', id, 'Serialization must not replace an existing identity.')); });
    if (finalErrors.length) return reject(finalErrors);
    window.__TB.EXAMS[examId] = candidate;
    cache.delete(examId); register(examId); clearErrors(examId);
    try { document.dispatchEvent(new CustomEvent('tb:question-bank-updated', { detail: { examId: examId, total: checked.questions.length } })); } catch (notificationError) { /* Publication is already committed; do not misreport a rejection. */ }
    return { accepted: true, total: checked.questions.length, errors: [] };
  }
  function replaceBank(examId, sets) {
    try { return replaceBankUnchecked(examId, sets); }
    catch (error) {
      const errors = [issue('UNREADABLE_IMPORT', examId, 'sets', '', 'The update must contain serializable question data. No update was applied.')];
      showErrors(examId, errors, true); return { accepted: false, errors: errors };
    }
  }
  window.__TBQuestionRegistry = {
    version: VERSION, register: register, idFor: idFor, questionsFor: questionsFor, find: find, legacyStemHash: legacyStemHash,
    inspect: function (examId, source) { return publicResult(inspect(examId, source)); },
    validate: function (examId) { return publicResult(register(examId)); },
    ensure: ensure, validateSelection: validateSelection, replaceBank: replaceBank,
    membershipsFor: function (examId, id) { const r = register(examId); return r.valid ? (r.memberships.get(id) || []).slice() : []; }
  };
  if (explicitPolicy()) Object.keys(window.__TB.EXAMS).forEach(function (examId) { register(examId); });
}());
