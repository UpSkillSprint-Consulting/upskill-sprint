(function () {
  'use strict';

  /*
   * Canonical, read-only history projection (contract v1).
   *
   * The durable event ledger and the older mastery snapshot overlap.  This
   * projector resolves that overlap by stable evidence identity, classifies
   * first/repeat only after building all-history question streams, and keeps
   * an explicit unknown bucket whenever compacted or missing evidence cannot
   * prove the first interaction.  It never rewrites learner evidence.
   */
  const VERSION = '1.0.0';

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function record(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  function whole(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
  }
  function scored(status) { return status === 'correct' || status === 'incorrect'; }
  function timestamp(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : null;
  }
  function compare(left, right) {
    const leftAt = left.at == null ? Number.MAX_SAFE_INTEGER : left.at;
    const rightAt = right.at == null ? Number.MAX_SAFE_INTEGER : right.at;
    return leftAt - rightAt || Number(left.sequence || 0) - Number(right.sequence || 0) || String(left.id).localeCompare(String(right.id));
  }
  function inWindow(item, options) {
    if (item.at == null) return options.from == null && options.to == null;
    return (options.from == null || item.at >= options.from) && (options.to == null || item.at < options.to);
  }
  function questionId(item, fallback) {
    const source = record(item);
    return String(source.questionId || source.qid || source.id || fallback || '');
  }
  function statusOf(item) {
    const source = record(item);
    const payload = record(source.payload);
    return String(payload.status || source.status || '');
  }

  function ledgerInteractions(events) {
    const byId = {};
    asArray(events).forEach(function (raw, index) {
      const event = record(raw);
      if (event.type !== 'answer_recorded' || !questionId(event) || !scored(statusOf(event))) return;
      const id = String(event.id || event.eventId || 'ledger-row-' + index);
      if (!byId[id] || compare(byId[id], event) <= 0) byId[id] = event;
    });
    /* Multiple answer revisions inside one session/question are one scored
       interaction. The final immutable revision is the evidence used by the
       completion path. */
    const logical = {};
    Object.keys(byId).sort().forEach(function (id) {
      const event = byId[id];
      const qid = questionId(event);
      const key = String(event.sessionId || event.operationId || id) + '|' + qid;
      const candidate = {
        id: id, questionId: qid, sessionId: String(event.sessionId || ''), status: statusOf(event),
        at: timestamp(event.occurredAt || event.at), sequence: Number(event.clientSequence || event.sequence || 0),
        source: 'ledger', original: event
      };
      if (!logical[key] || compare(logical[key], candidate) <= 0) logical[key] = candidate;
    });
    /* Older clients can leave a canonical completion while its answer row is
       absent from the bounded local cache. Completion answers fill that gap;
       for the same session/question they replace, rather than add to, the
       mutable pre-completion answer revision. */
    asArray(events).forEach(function (raw, eventIndex) {
      const event = record(raw);
      if (event.type !== 'session_completed') return;
      asArray(record(event.payload).answers).forEach(function (rawAnswer, answerIndex) {
        const answer = record(rawAnswer);
        const qid = questionId(answer);
        const status = statusOf(answer);
        if (!qid || !scored(status)) return;
        const id = String(event.id || event.eventId || 'completion-' + eventIndex) + ':' + qid;
        const key = String(event.sessionId || id) + '|' + qid;
        logical[key] = {
          id: id, questionId: qid, sessionId: String(event.sessionId || ''), status: status,
          at: timestamp(event.occurredAt || event.at), sequence: Number(event.clientSequence || event.sequence || answerIndex),
          source: 'completion', original: answer
        };
      });
    });
    return Object.keys(logical).sort().map(function (key) { return logical[key]; });
  }

  function collect(options) {
    const states = record(options.questionStates);
    const ledger = ledgerInteractions(options.events);
    const byQuestion = {};
    const ledgerIds = {};
    const ledgerSessions = {};
    ledger.forEach(function (item) {
      byQuestion[item.questionId] = byQuestion[item.questionId] || { details: [], opaque: 0, opaqueCorrect: 0, opaqueIncorrect: 0, sourceAttempts: 0, legacyIds: {} };
      byQuestion[item.questionId].details.push(item);
      ledgerIds[item.id] = true;
      if (item.sessionId) ledgerSessions[item.sessionId + '|' + item.questionId] = true;
    });

    Object.keys(states).sort().forEach(function (key) {
      const state = record(states[key]);
      const qid = questionId(state, key);
      if (!qid) return;
      const group = byQuestion[qid] = byQuestion[qid] || { details: [], opaque: 0, opaqueCorrect: 0, opaqueIncorrect: 0, sourceAttempts: 0, legacyIds: {} };
      const history = Array.isArray(state.masteryHistory) ? state.masteryHistory : asArray(state.history);
      let unmatched = 0;
      history.forEach(function (raw, index) {
        const entry = record(raw);
        if (!scored(String(entry.status || ''))) return;
        const eventId = String(entry.learningEventId || '');
        const sessionId = String(entry.attemptId || entry.sessionId || '');
        if ((eventId && ledgerIds[eventId]) || (sessionId && ledgerSessions[sessionId + '|' + qid])) return;
        const legacyId = String(entry.id || '');
        const legacyKey = legacyId ? 'id:' + legacyId : (sessionId ? 'session:' + sessionId : 'row:' + index);
        if (group.legacyIds[legacyKey]) return;
        group.legacyIds[legacyKey] = true;
        group.details.push({
          id: String(entry.id || qid + '-legacy-' + index), questionId: qid, sessionId: sessionId,
          status: String(entry.status), at: timestamp(entry.at), sequence: Number(entry.sequence || 0),
          source: 'legacy-detail', original: entry
        });
        unmatched += 1;
      });
      const stateAttempts = whole(state.attempts);
      group.sourceAttempts = Math.max(group.sourceAttempts, stateAttempts);
      const represented = group.details.length;
      /* A compacted baseline or an aggregate larger than its retained detail
         proves the number of interactions, but not which one was first. */
      group.opaque = Math.max(group.opaque, whole(record(state.masteryBaseline).attempts), Math.max(0, stateAttempts - represented));
      const representedCorrect = group.details.filter(function (item) { return item.status === 'correct'; }).length;
      const representedIncorrect = group.details.filter(function (item) { return item.status === 'incorrect'; }).length;
      group.opaqueCorrect = Math.max(group.opaqueCorrect, Math.max(0, whole(state.correct) - representedCorrect));
      group.opaqueIncorrect = Math.max(group.opaqueIncorrect, Math.max(0, whole(state.incorrect) - representedIncorrect));
      group.legacyDetails = whole(group.legacyDetails) + unmatched;
    });
    return { groups: byQuestion, ledger: ledger };
  }

  function emptyResult() {
    return {
      version: VERSION, answered: 0, uniqueAnswered: 0, first: 0, repeat: 0, unknown: 0,
      correct: 0, incorrect: 0, firstCorrect: 0, repeatCorrect: 0, unknownCorrect: 0,
      unattributedTime: 0, complete: true, diagnostics: [], sourceCounts: { ledger: 0, mastery: 0 }
    };
  }

  function project(input) {
    const options = Object.assign({ events: [], questionStates: {}, currentQuestionIds: null, from: null, to: null, epochStart: null }, record(input));
    options.from = timestamp(options.from);
    options.to = timestamp(options.to);
    options.epochStart = timestamp(options.epochStart);
    const collected = collect(options);
    const current = Array.isArray(options.currentQuestionIds) ? new Set(options.currentQuestionIds.map(String)) : null;
    const result = emptyResult();
    const classifications = [];

    Object.keys(collected.groups).sort().forEach(function (qid) {
      if (current && !current.has(qid)) return;
      const group = collected.groups[qid];
      const details = group.details.slice().sort(compare).filter(function (item) {
        return options.epochStart == null || (item.at != null && item.at >= options.epochStart);
      });
      const opaque = whole(group.opaque);
      const allCount = opaque + details.length;
      if (!allCount) return;
      result.uniqueAnswered += 1;
      result.sourceCounts.mastery += Math.max(whole(group.sourceAttempts), whole(group.legacyDetails));

      if (opaque && options.epochStart != null) {
        result.complete = false;
        result.unattributedTime += opaque;
      } else if (opaque) {
        result.complete = false;
        if (options.from == null && options.to == null) {
          result.unknown += 1;
          result.repeat += Math.max(0, opaque - 1);
          result.answered += opaque;
          result.correct += Math.min(opaque, whole(group.opaqueCorrect));
          result.incorrect += Math.min(Math.max(0, opaque - whole(group.opaqueCorrect)), whole(group.opaqueIncorrect));
          classifications.push({ questionId: qid, classification: 'unknown', count: 1, source: 'legacy-aggregate', at: null });
          if (opaque > 1) classifications.push({ questionId: qid, classification: 'repeat', count: opaque - 1, source: 'legacy-aggregate', at: null });
        } else result.unattributedTime += opaque;
      }

      details.forEach(function (item, index) {
        const incompleteLedger = options.historyComplete === false && item.source !== 'legacy-detail';
        const classification = opaque ? 'repeat' : (index === 0 ? (incompleteLedger ? 'unknown' : 'first') : 'repeat');
        if (!inWindow(item, options)) return;
        result.answered += 1;
        result[classification] += 1;
        if (item.status === 'correct') {
          result.correct += 1;
          result[classification + 'Correct'] += 1;
        } else result.incorrect += 1;
        classifications.push({ questionId: qid, classification: classification, count: 1, source: item.source, status: item.status, at: item.at, evidenceId: item.id });
      });
    });

    const detailedLedger = collected.ledger.filter(function (item) { return !current || current.has(item.questionId); }).length;
    result.sourceCounts.ledger = Math.max(detailedLedger, whole(options.ledgerAggregate));
    const opaqueLedger = Math.max(0, result.sourceCounts.ledger - result.answered);
    if (opaqueLedger) {
      result.complete = false;
      if (options.from == null && options.to == null && options.epochStart == null) {
        result.answered += opaqueLedger;
        result.unknown += opaqueLedger;
      } else result.unattributedTime += opaqueLedger;
      result.diagnostics.push({
        code: 'compacted-ledger-detail', severity: 'warning', count: opaqueLedger,
        message: 'Accepted ledger totals exceed locally retained detail; the interactions remain counted with unknown classification.'
      });
    }
    if (result.sourceCounts.ledger && result.sourceCounts.mastery && result.sourceCounts.ledger !== result.sourceCounts.mastery) {
      result.diagnostics.push({
        code: 'source-count-mismatch', severity: 'warning',
        ledger: result.sourceCounts.ledger, mastery: result.sourceCounts.mastery,
        message: 'Durable ledger and legacy mastery projections differ; the canonical union preserves identifiable evidence and reports the mismatch.'
      });
    }
    if (result.unknown) result.diagnostics.push({ code: 'unknown-first-provenance', severity: 'warning', count: result.unknown, message: 'Compacted or incomplete history cannot prove the first interaction.' });
    if (result.unattributedTime) result.diagnostics.push({ code: 'unattributed-time', severity: 'warning', count: result.unattributedTime, message: 'Legacy interactions without timestamps are excluded from this date window.' });
    result.classifications = classifications;
    result.uniqueAnswered = new Set(classifications.map(function (item) { return item.questionId; })).size;
    result.complete = result.complete && result.unknown === 0 && result.unattributedTime === 0;
    return result;
  }

  function dryRun(input) {
    const projection = project(input);
    return {
      mode: 'dry-run', writes: 0, version: VERSION,
      projection: projection,
      stableOperationKeys: projection.classifications.map(function (item, index) {
        return ['reconcile', VERSION, item.questionId, item.evidenceId || item.source, item.classification, index].join(':');
      })
    };
  }

  window.__TBHistoryReconciliation = { version: VERSION, project: project, dryRun: dryRun };
}());
