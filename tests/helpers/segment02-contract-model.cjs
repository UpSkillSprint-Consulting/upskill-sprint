'use strict';
// Executable specification ONLY. No production imports, browser, storage or network.
// Later runtime implementations must be checked against the independently written
// fixture expectations; importing this test model into the application is forbidden.
const contract = require('../../docs/exam-reliability/contracts/v1/contract.json');
const rubric = require('../../docs/exam-reliability/contracts/v1/release-rubric.json');
function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
freeze(contract); freeze(rubric);
class ContractError extends Error { constructor(code) { super(code); this.code = code; } }
function requireThat(value, code) { if (!value) throw new ContractError(code); }
function integer(value, code = 'invalid_integer') { requireThat(Number.isSafeInteger(value) && value >= 0, code); return value; }
function text(value, code = 'invalid_identity') { requireThat(typeof value === 'string' && value.trim() === value && value.length > 0, code); return value; }
function stable(value) {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stable(value[k])).join(',') + '}';
  return JSON.stringify(value);
}
function unique(rows, key) {
  const seen = new Map();
  rows.forEach(row => { const id = text(row[key]); if (seen.has(id)) requireThat(stable(seen.get(id)) === stable(row), 'conflicting_identity'); else seen.set(id, row); });
  return [...seen.values()];
}
const percent = (n, d) => d ? 100 * n / d : null;
function gradeCounts({ correct, total, targetBps }) {
  integer(total); integer(correct); requireThat(correct <= total, 'invalid_counts');
  requireThat(targetBps === null || (Number.isSafeInteger(targetBps) && targetBps >= 0 && targetBps <= 10000), 'invalid_target');
  const scorePct = percent(correct, total);
  const meetsTarget = !total || targetBps === null ? null : BigInt(correct) * 10000n >= BigInt(total) * BigInt(targetBps);
  const bucket = !total ? null : [50, 60, 70, 80, 90].findIndex(bound => BigInt(correct) * 100n < BigInt(total) * BigInt(bound));
  return { correct, total, scorePct, displayPct: scorePct === null ? null : Math.round(scorePct), meetsTarget,
    marginPct: scorePct === null || targetBps === null ? null : scorePct - targetBps / 100,
    bucket: bucket === -1 ? 5 : bucket };
}
function gradeSession({ manifest, items, terminalState }) {
  requireThat(contract.session.modes.includes(manifest.mode) && manifest.mode !== 'review', 'invalid_mode');
  requireThat(contract.session.fullExamTrend.terminalStates.includes(terminalState), 'not_final');
  requireThat(typeof manifest.timed === 'boolean', 'invalid_timing');
  requireThat(terminalState !== 'expired' || manifest.timed, 'invalid_expiry');
  requireThat(!(manifest.mode === 'adaptive' && manifest.timed), 'invalid_timing');
  requireThat(items.length === integer(manifest.expectedLength), 'length_mismatch');
  requireThat(new Set(items.map(q => q.itemId)).size === items.length, 'duplicate_item');
  if (manifest.mode !== 'adaptive') requireThat(new Set(items.map(q => q.questionId)).size === items.length, 'duplicate_question');
  const domains = Object.create(null);
  let correct = 0, incorrect = 0, unanswered = 0;
  items.forEach(q => {
    text(q.itemId); text(q.questionId); text(q.domainId);
    requireThat(Array.isArray(q.optionIds) && q.optionIds.length > 0 && new Set(q.optionIds).size === q.optionIds.length, 'invalid_options');
    q.optionIds.forEach(id => text(id));
    requireThat(q.optionIds.includes(q.correctOptionId), 'invalid_answer_key');
    requireThat(q.selectedOptionId === null || q.optionIds.includes(q.selectedOptionId), 'invalid_selection');
    const status = q.selectedOptionId === null ? 'unanswered' : q.selectedOptionId === q.correctOptionId ? 'correct' : 'incorrect';
    if (status === 'correct') correct += 1; else if (status === 'incorrect') incorrect += 1; else unanswered += 1;
    const d = domains[q.domainId] || (domains[q.domainId] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 });
    d.total += 1; d[status] += 1;
  });
  return { ...gradeCounts({ correct, total: items.length, targetBps: manifest.siteTargetBps }), incorrect, unanswered,
    answered: correct + incorrect, domains: { ...domains },
    examTrendEligible: manifest.mode === 'exam' && manifest.timed && items.length > 0 };
}
function validateScope(scope) {
  contract.scope.required.forEach(k => requireThat(Object.hasOwn(scope, k), 'missing_scope_' + k));
  text(scope.ownerId); requireThat(contract.supportedExams.includes(scope.examId), 'invalid_exam');
  requireThat(contract.scope.populations.includes(scope.population), 'invalid_population');
  requireThat(contract.scope.firstBases.includes(scope.firstBasis), 'invalid_first_basis');
  requireThat(contract.scope.completeness.includes(scope.completeness), 'invalid_completeness');
  requireThat(scope.epochId === null || typeof scope.epochId === 'string' && scope.epochId.length > 0, 'invalid_epoch');
  requireThat(scope.firstBasis !== 'epoch' || scope.epochId !== null, 'missing_first_epoch');
  requireThat(scope.population !== 'current_bank' || typeof scope.bankVersion === 'string' && scope.bankVersion.length > 0, 'missing_bank_version');
  integer(scope.evaluationAt); integer(scope.evidenceWatermark);
  requireThat((scope.windowStartAt === null) === (scope.windowEndAt === null), 'invalid_window');
  if (scope.windowStartAt !== null) { integer(scope.windowStartAt); integer(scope.windowEndAt); requireThat(scope.windowStartAt < scope.windowEndAt, 'invalid_window'); }
  reportingDay({ at: 0, timeZone: scope.reportingTimeZone });
}
function projectLearning({ scope, responses, currentQuestionIds, historyComplete }) {
  validateScope(scope); requireThat(typeof historyComplete === 'boolean', 'missing_history_completeness');
  requireThat(Array.isArray(currentQuestionIds) && new Set(currentQuestionIds).size === currentQuestionIds.length, 'invalid_population_ids');
  currentQuestionIds.forEach(q => requireThat(typeof q === 'string' && q.startsWith(scope.examId + ':'), 'invalid_question_namespace'));
  // Filter owner before reading/deduplicating evidence; other users' conflicts must
  // neither leak information nor alter this owner's projection.
  const candidates = responses.filter(r => r.ownerId === scope.ownerId && r.examId === scope.examId && r.acceptance === 'cloud_accepted');
  candidates.forEach(r => integer(r.serverSequence));
  let rows = unique(candidates.filter(r => r.serverSequence <= scope.evidenceWatermark), 'responseId');
  const slots = new Set();
  rows.forEach(r => {
    text(r.sessionId); text(r.itemId); text(r.epochId); integer(r.serverSequence);
    requireThat(typeof r.questionId === 'string' && r.questionId.startsWith(scope.examId + ':'), 'invalid_question_namespace');
    requireThat(contract.evidence.gradeStatuses.includes(r.status), 'invalid_grade_status');
    requireThat(r.at === null || Number.isSafeInteger(r.at) && r.at >= 0 && r.at <= scope.evaluationAt, 'invalid_answer_time');
    const slot = stable([r.ownerId, r.sessionId, r.itemId]);
    requireThat(!slots.has(slot), 'duplicate_response_slot'); slots.add(slot);
  });
  rows = rows.filter(r => r.status !== 'unanswered');
  const groups = new Map();
  rows.forEach(r => {
    if (scope.firstBasis === 'epoch' && r.epochId !== scope.epochId) return;
    const group = groups.get(r.questionId) || []; group.push(r); groups.set(r.questionId, group);
  });
  const classifications = new Map();
  const lexical = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  groups.forEach(group => {
    const known = group.filter(r => r.at !== null).sort((a, b) => a.at - b.at || lexical(a.sessionId, b.sessionId) || lexical(a.itemId, b.itemId) || lexical(a.responseId, b.responseId));
    const unknown = group.filter(r => r.at === null);
    known.forEach((r, i) => classifications.set(r.responseId, i > 0 ? 'repeat' : historyComplete && !unknown.length ? 'first' : 'unknown'));
    unknown.forEach(r => classifications.set(r.responseId, 'unknown'));
  });
  const population = new Set(currentQuestionIds);
  let scoped = rows.filter(r => (scope.epochId === null || r.epochId === scope.epochId) && (scope.population === 'historical_all' || population.has(r.questionId)));
  const unattributedTime = scoped.filter(r => r.at === null).length;
  if (scope.windowStartAt !== null) scoped = scoped.filter(r => r.at !== null && r.at >= scope.windowStartAt && r.at < scope.windowEndAt);
  let first = 0, repeat = 0, unknown = 0, correct = 0, firstCorrect = 0, repeatCorrect = 0;
  scoped.forEach(r => {
    const label = classifications.get(r.responseId);
    requireThat(label, 'unclassified_response');
    if (r.status === 'correct') correct += 1;
    if (label === 'first') { first += 1; if (r.status === 'correct') firstCorrect += 1; }
    else if (label === 'repeat') { repeat += 1; if (r.status === 'correct') repeatCorrect += 1; }
    else unknown += 1;
  });
  const uniqueQuestions = new Set(scoped.map(r => r.questionId)).size;
  return { answered: scoped.length, unique: uniqueQuestions, correct, first, repeat, unknown,
    accuracy: percent(correct, scoped.length), firstAccuracy: percent(firstCorrect, first), repeatAccuracy: percent(repeatCorrect, repeat),
    rawCoveragePct: scope.population === 'current_bank' ? percent(uniqueQuestions, currentQuestionIds.length) : null,
    unattributedTime, complete: historyComplete && scope.completeness === 'complete' && unknown === 0 && !(scope.windowStartAt !== null && unattributedTime) };
}
function legacyPartition({ answered, first, repeat }) {
  [answered, first, repeat].forEach(v => integer(v)); requireThat(first + repeat <= answered, 'invalid_legacy_counts');
  return { answered, first, repeat, unknown: answered - first - repeat };
}
function questionMastery({ attempts, correct, streak, lastSeenAt, evaluationAt }) {
  [attempts, correct, streak, evaluationAt].forEach(v => integer(v));
  requireThat(correct <= attempts && streak <= correct, 'invalid_counts');
  if (!attempts) return 0;
  if (lastSeenAt === null) return null;
  integer(lastSeenAt); requireThat(lastSeenAt <= evaluationAt, 'invalid_answer_time');
  const p = contract.mastery;
  const ageDays = (evaluationAt - lastSeenAt) / p.dayMilliseconds;
  const raw = (p.accuracyWeight * correct / attempts + p.streakWeight * Math.min(streak / p.streakCap, 1) + p.recencyWeight * Math.max(0, 1 - ageDays / p.recencyDays)) * (p.confidenceBase + p.confidenceIncrement * Math.min(attempts / p.confidenceAttempts, 1));
  return Math.max(0, Math.min(100, Math.round(raw * 100)));
}
function weightedLearning({ domains, evaluationAt }) {
  integer(evaluationAt); requireThat(Array.isArray(domains) && domains.length > 0, 'invalid_blueprint');
  requireThat(new Set(domains.map(d => d.id)).size === domains.length, 'invalid_blueprint');
  domains.forEach(d => { text(d.id); requireThat(Number.isFinite(d.weight) && d.weight >= 0, 'invalid_blueprint'); integer(d.pool); requireThat(d.weight === 0 || d.pool > 0, 'incomplete_blueprint'); requireThat(Array.isArray(d.states) && d.states.length <= d.pool, 'invalid_pool'); });
  const totalWeight = domains.reduce((sum, d) => sum + d.weight, 0); requireThat(totalWeight > 0, 'invalid_blueprint');
  let pool = 0, unique = 0, weightedCoverage = 0, readiness = 0, attemptedWeight = 0, attemptedSum = 0, mastered = 0, due = 0, unknownDue = 0;
  domains.forEach(d => {
    const weight = d.weight / totalWeight;
    d.states.forEach(s => questionMastery({ ...s, evaluationAt }));
    const attempted = d.states.filter(s => s.attempts > 0);
    const scores = attempted.map(s => questionMastery({ ...s, evaluationAt }));
    requireThat(scores.every(s => s !== null), 'unknown_mastery_evidence');
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const coverage = d.pool ? attempted.length / d.pool : 0;
    pool += d.pool; unique += attempted.length; weightedCoverage += weight * coverage * 100; readiness += weight * coverage * avg;
    if (attempted.length) { attemptedWeight += weight; attemptedSum += weight * avg; }
    attempted.forEach((s, i) => {
      if (s.attempts >= contract.mastery.masteredMinAttempts && scores[i] >= contract.mastery.masteredMinScore) mastered += 1;
      if (s.dueAt === null) unknownDue += 1;
      else { integer(s.dueAt); if (s.dueAt <= evaluationAt) due += 1; }
    });
  });
  return { pool, unique, rawCoveragePct: percent(unique, pool), weightedCoveragePct: weightedCoverage,
    attemptedMastery: attemptedWeight ? attemptedSum / attemptedWeight : null, readiness, mastered, due, unknownDue,
    displayReadiness: Math.round(readiness), displayWeightedCoverage: Math.round(weightedCoverage) };
}
function reportingDay({ at, timeZone }) {
  text(timeZone, 'invalid_timezone');
  let formatter;
  try { formatter = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }); } catch { throw new ContractError('invalid_timezone'); }
  if (at === null) return null;
  const instant = typeof at === 'string' ? Date.parse(at) : at; requireThat(Number.isSafeInteger(instant), 'invalid_instant');
  if (typeof at === 'string') { requireThat(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(at), 'invalid_instant'); const normalized = at.includes('.') ? at : at.replace('Z', '.000Z'); requireThat(new Date(instant).toISOString() === normalized, 'invalid_instant'); }
  const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(p => [p.type, p.value]));
  return parts.year + '-' + parts.month + '-' + parts.day;
}
function calendarDays({ startDate, count }) {
  integer(count); requireThat(count <= 3660 && /^\d{4}-\d{2}-\d{2}$/.test(startDate), 'invalid_calendar_range');
  const date = new Date(startDate + 'T12:00:00Z'); requireThat(Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === startDate, 'invalid_calendar_date');
  const out = [];
  for (let i = 0; i < count; i += 1) { out.push(date.toISOString().slice(0, 10)); date.setUTCDate(date.getUTCDate() + 1); }
  return out;
}
function transition({ state, action, timed, deadlineReached = false, reason = null }) {
  requireThat(typeof timed === 'boolean', 'invalid_timing');
  if (timed && deadlineReached && state === 'in_progress' && ['submit', 'abandon'].includes(action)) action = 'deadline_reached';
  requireThat(Object.hasOwn(contract.session.transitions, state) && Object.hasOwn(contract.session.transitions[state], action), 'illegal_transition');
  if (action === 'pause') requireThat(!timed, 'timed_pause_forbidden');
  if (action === 'deadline_reached') requireThat(timed && deadlineReached, 'deadline_not_reached');
  if (action === 'accept_expiry') requireThat(timed && reason === 'deadline', 'wrong_terminal_reason');
  if (action === 'accept_completion') requireThat(reason === 'submitted', 'wrong_terminal_reason');
  return contract.session.transitions[state][action];
}
function operationDecision({ state, operation, principalId }) {
  requireThat(principalId === state.ownerId && operation.ownerId === state.ownerId, 'owner_mismatch');
  requireThat(operation.sessionId === state.sessionId, 'session_mismatch');
  text(operation.operationId); integer(operation.writerEpoch); integer(operation.expectedSessionRevision);
  const receipt = (state.receipts || []).find(r => r.operationId === operation.operationId);
  const canonical = stable(operation);
  if (receipt) { requireThat(receipt.canonical === canonical, 'operation_conflict'); return { duplicate: true, revision: state.revision }; }
  requireThat(operation.writerEpoch === state.writerEpoch, 'stale_writer');
  requireThat(operation.expectedSessionRevision === state.revision, 'stale_revision');
  requireThat(operation.resetEpochId === state.resetEpochId, 'reset_epoch_mismatch');
  requireThat(!contract.session.terminalStates.includes(state.state), 'terminal_session');
  return { duplicate: false, revision: integer(integer(state.revision) + 1) };
}
function reservationDecision({ online, matchingSessionReservation, previouslyExcluded }) {
  [online, matchingSessionReservation, previouslyExcluded].forEach(x => requireThat(typeof x === 'boolean', 'invalid_reservation_state'));
  if (matchingSessionReservation) return 'resume_existing_reservation';
  if (!online) return 'block_authoritative_allocation_unavailable';
  if (previouslyExcluded) return 'exclude';
  return 'request_atomic_reservation'; // Request is not a successful allocation.
}
function remainingTime({ timed, deadlineAt, trustedNow }) {
  requireThat(typeof timed === 'boolean', 'invalid_timing');
  if (!timed) { requireThat(deadlineAt === null, 'untimed_deadline'); return null; }
  integer(deadlineAt); requireThat(trustedNow !== null, 'clock_recovery_required'); integer(trustedNow);
  return Math.max(0, deadlineAt - trustedNow);
}
function activeTime({ itemIds, visits, deadlineAt }) {
  requireThat(new Set(itemIds).size === itemIds.length, 'duplicate_item'); itemIds.forEach(id => text(id));
  if (deadlineAt !== null) integer(deadlineAt);
  const sums = new Map(); const intervals = []; const incomplete = new Set();
  unique(visits, 'visitId').forEach(v => {
    requireThat(itemIds.includes(v.itemId), 'unknown_timing_item'); integer(v.writerEpoch);
    integer(v.startAt); requireThat(typeof v.visible === 'boolean', 'invalid_visibility');
    if (v.endAt === null) { if (v.visible) incomplete.add(v.itemId); return; } integer(v.endAt); requireThat(v.endAt >= v.startAt, 'negative_duration');
    if (!v.visible) return;
    const end = deadlineAt === null ? v.endAt : Math.min(v.endAt, deadlineAt);
    const duration = Math.max(0, end - v.startAt);
    sums.set(v.itemId, (sums.get(v.itemId) || 0) + duration);
    if (duration > 0) intervals.push([v.startAt, end]);
  });
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i += 1) requireThat(intervals[i][0] >= intervals[i - 1][1], 'overlapping_active_visits');
  incomplete.forEach(id => sums.delete(id));
  const milliseconds = [...sums.values()].reduce((a, b) => a + b, 0);
  return { milliseconds, knownItems: sums.size, unknownItems: itemIds.length - sums.size, averageMs: sums.size ? milliseconds / sums.size : null };
}
function releaseScore({ evidence, blockers }) {
  requireThat(Array.isArray(evidence) && Array.isArray(blockers), 'invalid_evidence');
  const criteria = rubric.areas.flatMap(a => a.criteria); const byId = new Map(criteria.map(c => [c.id, c]));
  requireThat(new Set(evidence.map(e => e.criterionId)).size === evidence.length, 'duplicate_criterion');
  let earnedPoints = 0;
  evidence.forEach(e => {
    requireThat(byId.has(e.criterionId), 'unknown_criterion');
    requireThat(['passed', 'failed', 'not_verified'].includes(e.status), 'invalid_evidence_status');
    if (e.status !== 'passed') return;
    rubric.evidenceRequired.forEach(k => requireThat(typeof e[k] === 'string' && e[k].length > 0, 'missing_release_evidence'));
    requireThat(/^[0-9a-f]{40}$/.test(e.verifiedCommit), 'invalid_evidence_commit');
    requireThat(rubric.allowedEnvironments.includes(e.environment), 'invalid_evidence_environment');
    const c = byId.get(e.criterionId);
    requireThat(!c.requiredEnvironment || c.requiredEnvironment === e.environment, 'wrong_evidence_environment');
    earnedPoints += c.points;
  });
  const releaseReady = earnedPoints === rubric.totalPoints && blockers.length === 0;
  return { earnedPoints, releaseReady, rating: releaseReady ? 10 : null };
}
function validateEnvelope(input) {
  requireThat(input && typeof input === 'object' && !Array.isArray(input), 'invalid_envelope');
  contract.evidence.operationRequired.forEach(k => requireThat(Object.hasOwn(input, k), 'missing_operation_' + k));
  requireThat(input.schemaVersion === contract.schemaMajor, 'unsupported_schema');
  ['operationId', 'ownerId', 'deviceId', 'resetEpochId'].forEach(k => text(input[k]));
  requireThat(contract.supportedExams.includes(input.examId), 'invalid_exam'); integer(input.clientSequence);
  if (input.type === 'learning_epoch_reset') requireThat(input.sessionId === null && input.writerEpoch === null && input.expectedSessionRevision === null, 'invalid_reset_envelope');
  else { text(input.sessionId); integer(input.writerEpoch); integer(input.expectedSessionRevision); }
  requireThat(contract.evidence.logicalEvents.includes(input.type), 'invalid_event_type');
  requireThat(input.payload && typeof input.payload === 'object' && !Array.isArray(input.payload), 'invalid_payload');
  if (input.clientOccurredAt !== null) integer(input.clientOccurredAt);
  return true;
}
function validateSnapshot(input) {
  requireThat(input && typeof input === 'object' && !Array.isArray(input), 'invalid_snapshot');
  contract.session.snapshotRequired.forEach(k => requireThat(Object.hasOwn(input, k), 'missing_snapshot_' + k));
  requireThat(input.contractVersion === contract.contractVersion, 'unsupported_contract');
  ['sessionId', 'ownerId', 'examId', 'setId', 'bankVersion', 'blueprintVersion', 'gradingPolicyVersion', 'masteryPolicyVersion', 'timingPolicyVersion', 'resetEpochId'].forEach(k => text(input[k]));
  requireThat(contract.supportedExams.includes(input.examId), 'invalid_exam');
  requireThat(contract.session.modes.includes(input.mode), 'invalid_mode');
  requireThat(contract.session.states.includes(input.state), 'invalid_state');
  requireThat(typeof input.timed === 'boolean' && (!['review', 'adaptive'].includes(input.mode) || !input.timed), 'invalid_timing');
  requireThat(!(input.state === 'paused' && input.timed), 'timed_pause_forbidden');
  integer(input.sessionRevision); integer(input.writerEpoch); integer(input.expectedLength);
  requireThat(input.expectedLength > 0 && Array.isArray(input.orderedItems) && input.orderedItems.length === input.expectedLength, 'length_mismatch');
  gradeCounts({ correct: 0, total: input.expectedLength, targetBps: input.siteTargetBps });
  reportingDay({ at: 0, timeZone: input.reportingTimeZoneAtStart });
  if (input.state !== 'created') integer(input.startedAt);
  else requireThat(input.startedAt === null, 'created_start_time');
  if (input.timed && input.state !== 'created') { integer(input.deadlineAt); requireThat(input.deadlineAt > input.startedAt, 'invalid_deadline'); }
  else requireThat(input.deadlineAt === null, 'unexpected_deadline');
  const ids = new Set(), questions = new Set();
  input.orderedItems.forEach(q => {
    contract.session.itemRequired.forEach(k => requireThat(Object.hasOwn(q, k), 'missing_item_' + k));
    ['itemId', 'questionId', 'questionRevision', 'domainId'].forEach(k => text(q[k]));
    requireThat(q.questionId.startsWith(input.examId + ':'), 'invalid_question_namespace');
    requireThat(!ids.has(q.itemId), 'duplicate_item'); ids.add(q.itemId);
    if (input.mode !== 'adaptive') requireThat(!questions.has(q.questionId), 'duplicate_question'); questions.add(q.questionId);
    requireThat(Array.isArray(q.optionIds) && q.optionIds.length > 0 && new Set(q.optionIds).size === q.optionIds.length, 'invalid_options'); q.optionIds.forEach(v => text(v));
    requireThat(Array.isArray(q.optionOrder) && stable([...q.optionOrder].sort()) === stable([...q.optionIds].sort()), 'invalid_option_order');
    requireThat(q.selectedOptionId === null || q.optionIds.includes(q.selectedOptionId), 'invalid_selection');
    if (q.effectiveAnsweredAt !== null) integer(q.effectiveAnsweredAt);
  });
  requireThat(input.currentItemId === null || ids.has(input.currentItemId), 'invalid_current_item');
  requireThat(!['in_progress', 'paused'].includes(input.state) || input.currentItemId !== null, 'missing_current_item');
  requireThat(Array.isArray(input.flags) && new Set(input.flags).size === input.flags.length && input.flags.every(id => ids.has(id)), 'invalid_flags');
  return true;
}
function nextReview({ status, streak, ease, intervalDays, evaluationAt }) {
  requireThat(['correct', 'incorrect'].includes(status), 'invalid_review_status');
  integer(streak); integer(intervalDays); integer(evaluationAt);
  const p = contract.mastery.schedule;
  requireThat(Number.isFinite(ease) && ease >= p.minimumEase && ease <= p.maximumEase, 'invalid_ease');
  let nextStreak, days, nextEase;
  if (status === 'incorrect') { nextStreak = 0; days = p.firstDays; nextEase = Math.max(p.minimumEase, Number((ease - p.wrongEaseDecrement).toFixed(2))); }
  else { nextStreak = streak + 1; days = nextStreak === 1 ? p.firstDays : nextStreak === 2 ? p.secondDays : Math.max(p.laterMinimumDays, Math.round(Math.max(intervalDays, p.secondDays) * ease)); nextEase = Math.min(p.maximumEase, Number((ease + p.correctEaseIncrement).toFixed(2))); }
  const dueAt = evaluationAt + days * contract.mastery.dayMilliseconds; integer(dueAt);
  return { streak: nextStreak, intervalDays: days, ease: nextEase, dueAt };
}
module.exports = { nextReview, validateEnvelope, validateSnapshot, contract, rubric, ContractError, stable, gradeCounts, gradeSession, validateScope, projectLearning, legacyPartition,
  questionMastery, weightedLearning, reportingDay, calendarDays, transition, operationDecision, reservationDecision, remainingTime, activeTime, releaseScore };
