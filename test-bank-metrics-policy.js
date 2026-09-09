(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.__TBMetricPolicy = api;
}(typeof window === 'object' ? window : globalThis, function () {
  'use strict';

  const CONTRACT_VERSION = '1.0.0';
  const POLICY_VERSION = 'baseline-confidence-v1';
  const DAY = 86400000;
  const MASTERY_THRESHOLD = 80;

  function fail(message) { const error = new Error(message); error.code = 'INVALID_METRIC_EVIDENCE'; throw error; }
  function finite(value) { return typeof value === 'number' && Number.isFinite(value); }
  function safeCount(value, name) { if (!Number.isSafeInteger(value) || value < 0) fail('Invalid ' + name); return value; }
  function percent(numerator, denominator) { return denominator > 0 ? 100 * numerator / denominator : null; }
  function clamp(value, lo, hi) { return Math.max(lo, Math.min(hi, value)); }

  function effectiveMastery(state, timestamp) {
    const row = state || {};
    const attempts = safeCount(Number(row.attempts || 0), 'attempt count');
    if (!attempts) return 0;
    const correct = safeCount(Number(row.correct || 0), 'correct count');
    if (correct > attempts) fail('Correct count exceeds attempts');
    const streak = safeCount(Number(row.streak || 0), 'streak');
    if (!finite(timestamp)) fail('Invalid evaluation timestamp');
    if (!finite(Number(row.lastSeenAt)) || Number(row.lastSeenAt) <= 0 || Number(row.lastSeenAt) > timestamp) return null;
    const ageDays = Math.max(0, (timestamp - Number(row.lastSeenAt)) / DAY);
    const accuracy = correct / attempts;
    const confidence = Math.min(attempts / 5, 1);
    const streakFactor = Math.min(streak / 4, 1);
    const recency = Math.max(0, 1 - ageDays / 45);
    const raw = (0.58 * accuracy + 0.24 * streakFactor + 0.18 * recency) * (0.62 + 0.38 * confidence);
    return clamp(Math.round(raw * 100), 0, 100);
  }

  function normalizeBlueprint(bok) {
    if (!Array.isArray(bok) || !bok.length) fail('Missing blueprint');
    const domains = [];
    const bySub = new Map();
    bok.forEach(function (domain, domainIndex) {
      if (!domain || typeof domain.domain !== 'string' || !domain.domain) fail('Invalid blueprint domain');
      if (!Array.isArray(domain.subs) || !domain.subs.length) fail('Domain has no subtopics');
      let weight = 0;
      domain.subs.forEach(function (sub) {
        if (!sub || typeof sub.id !== 'string' || !sub.id || bySub.has(sub.id)) fail('Invalid or duplicate subtopic');
        const w = Number(sub.w);
        if (!finite(w) || w < 0) fail('Invalid blueprint weight');
        weight += w;
        bySub.set(sub.id, domain.domain);
      });
      domains.push({ id: domain.domain, name: domain.name || domain.domain, weight: weight, order: domainIndex });
    });
    const totalWeight = domains.reduce(function (sum, d) { return sum + d.weight; }, 0);
    if (!(totalWeight > 0)) fail('Blueprint weights must have a positive total');
    domains.forEach(function (d) { d.weightFraction = d.weight / totalWeight; });
    return { domains: domains, bySub: bySub, totalWeight: totalWeight };
  }

  function metric(metricId, value, numerator, denominator, unit, evaluatedAt, complete, unknownEvidenceCount, extra) {
    return Object.assign({
      metricId: metricId,
      contractVersion: CONTRACT_VERSION,
      formulaVersion: POLICY_VERSION,
      value: value,
      numerator: numerator,
      denominator: denominator,
      unit: unit,
      evaluatedAt: new Date(evaluatedAt).toISOString(),
      complete: complete !== false,
      unknownEvidenceCount: Number(unknownEvidenceCount || 0)
    }, extra || {});
  }

  function summarize(input) {
    input = input || {};
    const timestamp = Number(input.timestamp);
    if (!finite(timestamp)) fail('Invalid evaluation timestamp');
    if (!Array.isArray(input.questions)) fail('Missing question population');
    if (typeof input.stateFor !== 'function') fail('Missing question-state resolver');
    const blueprint = normalizeBlueprint(input.bok);
    const groups = new Map(blueprint.domains.map(function (d) {
      return [d.id, { id:d.id, name:d.name, weight:d.weight, weightFraction:d.weightFraction, order:d.order, pool:0, attempted:0, masterySum:0, unknownMastery:0 }];
    }));

    let answeredUnique = 0, answers = 0, mastered = 0, due = 0, unknownDue = 0, unknownMastery = 0;
    input.questions.forEach(function (question) {
      const sub = question && (question.sub || 'general');
      const domainId = blueprint.bySub.get(sub);
      if (!domainId) fail('Question maps outside blueprint: ' + String(sub));
      const group = groups.get(domainId);
      group.pool += 1;
      const state = input.stateFor(question) || {};
      const attempts = safeCount(Number(state.attempts || 0), 'attempt count');
      if (!attempts) return;
      answeredUnique += 1;
      answers += attempts;
      group.attempted += 1;
      const mastery = effectiveMastery(state, timestamp);
      if (mastery == null) { group.unknownMastery += 1; unknownMastery += 1; }
      else {
        group.masterySum += mastery;
        if (attempts >= 3 && mastery >= MASTERY_THRESHOLD) mastered += 1;
      }
      if (finite(Number(state.dueAt)) && Number(state.dueAt) > 0) { if (Number(state.dueAt) <= timestamp) due += 1; }
      else unknownDue += 1;
    });

    blueprint.domains.forEach(function (domain) {
      if (domain.weight > 0 && groups.get(domain.id).pool <= 0) fail('Positive-weight domain has no current-bank pool: ' + domain.id);
    });

    let weightedCoverageFraction = 0;
    let attemptedWeight = 0;
    let attemptedMasteryWeighted = 0;
    let readiness = 0;
    let readinessComplete = true;
    const domains = blueprint.domains.map(function (domain) {
      const g = groups.get(domain.id);
      const coverageFraction = g.pool ? g.attempted / g.pool : 0;
      weightedCoverageFraction += domain.weightFraction * coverageFraction;
      let meanMastery = null;
      if (g.attempted) {
        if (g.unknownMastery) readinessComplete = false;
        else meanMastery = g.masterySum / g.attempted;
      }
      if (g.attempted && meanMastery != null) {
        attemptedWeight += domain.weightFraction;
        attemptedMasteryWeighted += domain.weightFraction * meanMastery;
        readiness += domain.weightFraction * coverageFraction * meanMastery;
      } else if (g.attempted) readinessComplete = false;
      const domainReadiness = meanMastery == null ? (g.attempted ? null : 0) : coverageFraction * meanMastery;
      return {
        id:g.id,name:g.name,weight:g.weight,weightFraction:g.weightFraction,pool:g.pool,attempted:g.attempted,
        coverage:100*coverageFraction,meanMastery:meanMastery,readiness:domainReadiness,unknownMastery:g.unknownMastery,order:g.order
      };
    });

    const total = input.questions.length;
    const rawCoverage = percent(answeredUnique, total);
    const weightedCoverage = 100 * weightedCoverageFraction;
    const attemptedMastery = attemptedWeight > 0 && readinessComplete ? attemptedMasteryWeighted / attemptedWeight : (attemptedWeight > 0 ? null : null);
    const readinessValue = readinessComplete ? readiness : null;

    const counts = Object.assign({ reserved:0, delivered:0, displayed:0, answered:answeredUnique, mastered:mastered, reviews:0, notebookMistakes:0 }, input.evidenceCounts || {});
    ['reserved','delivered','displayed','answered','mastered','reviews','notebookMistakes'].forEach(function (key) { safeCount(Number(counts[key] || 0), key + ' count'); });

    const priorities = domains.map(function (d) {
      return { id:d.id, name:d.name, order:d.order, priority:d.readiness == null ? null : d.weightFraction * (100 - d.readiness) };
    }).sort(function (a,b) {
      if (a.priority == null && b.priority == null) return a.order-b.order;
      if (a.priority == null) return 1;
      if (b.priority == null) return -1;
      return b.priority-a.priority || a.order-b.order;
    });

    const complete = unknownMastery === 0;
    const metrics = {
      rawCoverage: metric('learning.raw_question_coverage', rawCoverage, answeredUnique, total, 'percent', timestamp, true, 0),
      weightedCoverage: metric('learning.blueprint_weighted_coverage', weightedCoverage, null, null, 'percent', timestamp, true, 0, { denominatorDefinition:'blueprint-weighted current-bank question pool' }),
      attemptedMastery: metric('learning.attempted_mastery', attemptedMastery, null, null, 'percent', timestamp, complete, unknownMastery),
      readiness: metric('learning.blueprint_weighted_readiness', readinessValue, null, null, 'percent', timestamp, complete, unknownMastery),
      answeredQuestions: metric('learning.answered_unique_questions', answeredUnique, answeredUnique, total, 'questions', timestamp, true, 0),
      masteredQuestions: metric('learning.mastered_questions', mastered, mastered, total, 'questions', timestamp, complete, unknownMastery),
      dueQuestions: metric('learning.due_questions', due, due, answeredUnique, 'questions', timestamp, unknownDue===0, unknownDue)
    };

    return {
      policyVersion: POLICY_VERSION,
      contractVersion: CONTRACT_VERSION,
      evaluatedAt: new Date(timestamp).toISOString(),
      attemptedMastery: attemptedMastery == null ? null : Math.round(attemptedMastery),
      rawCoverage: rawCoverage,
      weightedCoverage: weightedCoverage,
      coverage: Math.round(weightedCoverage),
      readiness: readinessValue == null ? null : Math.round(readinessValue),
      attempted: answeredUnique,
      total: total,
      mastered: mastered,
      due: due,
      answers: answers,
      evidenceConfidence: weightedCoverage,
      unknownMastery: unknownMastery,
      unknownDue: unknownDue,
      counts: counts,
      domains: domains,
      studyPriority: priorities,
      metrics: metrics
    };
  }

  return Object.freeze({
    CONTRACT_VERSION: CONTRACT_VERSION,
    POLICY_VERSION: POLICY_VERSION,
    MASTERY_THRESHOLD: MASTERY_THRESHOLD,
    effectiveMastery: effectiveMastery,
    summarize: summarize,
    normalizeBlueprint: normalizeBlueprint
  });
}));
