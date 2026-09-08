'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const m = require('./helpers/segment02-contract-model.cjs');
const examples = require('../docs/exam-reliability/contracts/v1/worked-examples.json').examples;
const ROOT = path.join(__dirname, '..');
const clone = value => JSON.parse(JSON.stringify(value));
function match(actual, expected, label = '') {
  if (typeof expected === 'number') { assert.equal(typeof actual, 'number', label); assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= 1e-10 * Math.max(1, Math.abs(expected)), label + ': ' + actual + ' != ' + expected); }
  else if (expected !== null && typeof expected === 'object' && !Array.isArray(expected)) {
    for (const [key, value] of Object.entries(expected)) { assert.ok(Object.hasOwn(actual, key), 'missing ' + key); match(actual[key], value, label + '.' + key); }
  } else assert.deepEqual(actual, expected, label);
}
function mbbTrend(input) {
  const items = Array.from({ length: input.total }, (_, i) => ({ itemId: 'i' + i, questionId: 'mbb:q' + i, domainId: 'd1', optionIds: ['a', 'b'], correctOptionId: 'a', selectedOptionId: i < input.correct ? 'a' : 'b' }));
  // Deliberately do not pass currentGenericLength to historical grading.
  return m.gradeSession({ manifest: { mode: 'exam', timed: true, expectedLength: input.total, siteTargetBps: input.targetBps }, items, terminalState: 'completed' });
}
for (const example of examples) test('Segment 02 ' + example.id + ': ' + example.calculation, () => {
  const fn = example.function === 'mbbTrend' ? mbbTrend : m[example.function];
  assert.equal(typeof fn, 'function');
  match(fn(clone(example.given)), example.expected, example.id);
});
const error = code => e => e instanceof m.ContractError && e.code === code;
const get = id => clone(examples.find(e => e.id === id).given);

test('contract shape, metric units and all Segment 01 traceability IDs are complete', () => {
  assert.equal(m.contract.contractVersion, '1.0.0');
  assert.equal(m.contract.runtimeAdopted, false);
  assert.equal(examples.length, 48);
  assert.equal(new Set(examples.map(e => e.id)).size, 48);
  assert.equal(m.contract.metrics.length, 30);
  assert.equal(new Set(m.contract.metrics.map(e => e.id)).size, 30);
  m.contract.metrics.forEach(metric => ['id','scope','numerator','denominator','unit'].forEach(k => assert.ok(metric[k])));
  const register = fs.readFileSync(path.join(ROOT, 'docs/exam-reliability/DEFECT-REGISTER.md'), 'utf8');
  const ids = [...new Set([...register.matchAll(/^\| (G\d+|R\d+|P\d+) \|/gm)].map(x => x[1]))].sort();
  assert.equal(ids.length, 39);
  assert.deepEqual(Object.keys(m.contract.defectContracts).sort(), ids);
  Object.values(m.contract.defectContracts).flat().forEach(id => assert.ok(Object.hasOwn(m.contract.rules, id), id));
  assert.ok(Object.isFrozen(m.contract.mastery));
});

test('immutable v1 contract, examples and rubric require a reviewed version/impact change', () => {
  // Frozen after local semantic review. Update only through the contract-change ADR.
  const expected = {"contract.json": "bff5a34eacff454e6e51285202ff88ee762d361a91dd7bbe85c0ef2b9c6245b5", "worked-examples.json": "10bfd959f06a073d45cd428f2811c1520197e035c3c8ff26173d11a520fafa59", "release-rubric.json": "d60acd9e646fad0fbf9f30c661a741b35d92cece48b2d41070cfd34a5d4b59e3", "CONTRACT.md": "c8ca4153508e055cecc235e8a3d260d3bddd639c274e0dec8f175b0ef9b32f72"};
  Object.entries(expected).forEach(([file, hash]) => {
    const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'docs/exam-reliability/contracts/v1', file))).digest('hex');
    assert.equal(actual, hash, 'Version/ADR review required: ' + file);
  });
});

test('all response permutations and identical retries preserve first/repeat and counts', () => {
  const input = get('E08'); const [a,b] = input.responses;
  for (const rows of [[a,b], [b,a], [a,a,b], [b,a,b], [a,b,b,a]]) {
    match(m.projectLearning({ ...input, responses: rows }), { answered: 2, first: 1, repeat: 1, unknown: 0 });
  }
  const conflict = { ...b, status: 'incorrect' };
  assert.throws(() => m.projectLearning({ ...input, responses: [a,b,conflict] }), error('conflicting_identity'));
  const slotConflict = { ...a, responseId: 'new-id-same-slot' };
  assert.throws(() => m.projectLearning({ ...input, responses: [a,slotConflict] }), error('duplicate_response_slot'));
});

test('missing scope, half-specified windows, unknown timezone and wrong manifest fail visibly', () => {
  const input = get('E08');
  for (const field of m.contract.scope.required) {
    const c = clone(input); delete c.scope[field];
    assert.throws(() => m.projectLearning(c), error('missing_scope_' + field));
  }
  for (const [patch, code] of [[{windowStartAt:0},'invalid_window'],[{reportingTimeZone:'not/a/timezone'},'invalid_timezone'],[{bankVersion:null},'missing_bank_version'],[{firstBasis:'epoch',epochId:null},'missing_first_epoch']]) {
    assert.throws(() => m.projectLearning({ ...input, scope:{...input.scope,...patch} }), error(code));
  }
  assert.throws(() => m.projectLearning({...input, responses:[{...input.responses[0], serverSequence:undefined}]}), error('invalid_integer'));
  for (const at of ['2026-02-30T00:00:00Z','2026-09-07','not-a-date']) assert.throws(()=>m.reportingDay({at,timeZone:'UTC'}),error('invalid_instant'));
});

test('grants of a later watermark cannot be silently counted at an earlier watermark', () => {
  const input = get('E08'); input.responses[1].serverSequence = 2; input.responses[2].serverSequence = 2;
  match(m.projectLearning({...input, scope:{...input.scope,evidenceWatermark:1}}), { answered:1,first:1,repeat:0 });
  match(m.projectLearning({...input, scope:{...input.scope,evidenceWatermark:2}}), { answered:2,first:1,repeat:1 });
});

test('grading rejects malformed totals, invented targets, duplicate identities and missing options', () => {
  for (const input of [{correct:1,total:0,targetBps:7000},{correct:-1,total:2,targetBps:7000},{correct:1.5,total:2,targetBps:7000},{correct:1,total:2,targetBps:NaN},{correct:1,total:2,targetBps:10001},{correct:1,total:2,targetBps:undefined}]) assert.throws(() => m.gradeCounts(input), m.ContractError);
  const input = get('E06');
  assert.throws(() => m.gradeSession({...input,items:[input.items[0],input.items[0]]}),error('duplicate_item'));
  assert.throws(() => m.gradeSession({...input,items:[input.items[0],{...input.items[1],questionId:input.items[0].questionId}]}),error('duplicate_question'));
  assert.throws(() => m.gradeSession({...input,manifest:{...input.manifest,expectedLength:100}}),error('length_mismatch'));
  assert.throws(() => m.gradeSession({...input,items:[{...input.items[0],selectedOptionId:'x'},input.items[1]]}),error('invalid_selection'));
  const blanks = input.items.map(q => ({...q,selectedOptionId:null}));
  match(m.gradeSession({...input,items:blanks}), {correct:0,answered:0,unanswered:2,scorePct:0,meetsTarget:false});
});

test('every possible result for the published full lengths satisfies independent target arithmetic', () => {
  for (const total of [100,110,150,160,165,175]) for (let correct = 0; correct <= total; correct += 1) {
    const result = m.gradeCounts({correct,total,targetBps:7000});
    // Independent integer minimum-correct construction (not the model's cross-product).
    assert.equal(result.meetsTarget, correct >= Math.ceil(7 * total / 10));
  }
});

test('mastery rejects incomplete metadata/blueprints rather than inventing weights or due dates', () => {
  const input = get('E32');
  assert.throws(() => m.weightedLearning({...input,domains:input.domains.map(d => ({...d,weight:0}))}), error('invalid_blueprint'));
  assert.throws(() => m.weightedLearning({...input,domains:[{...input.domains[0],pool:0,states:[]}]}), error('incomplete_blueprint'));
  assert.throws(() => m.weightedLearning({...input,domains:[{...input.domains[0],states:[{...input.domains[0].states[0],lastSeenAt:null}]}]}), error('unknown_mastery_evidence'));
  assert.throws(() => m.questionMastery({attempts:1,correct:2,streak:2,lastSeenAt:0,evaluationAt:0}), error('invalid_counts'));
  assert.throws(() => m.legacyPartition({answered:1,first:1,repeat:1}),error('invalid_legacy_counts'));
  const empty = m.weightedLearning({...input,domains:input.domains.map(d=>({...d,states:[]}))});
  match(empty,{unique:0,rawCoveragePct:0,weightedCoveragePct:0,attemptedMastery:null,readiness:0});
});

test('terminal sessions cannot reopen and timed pause/false expiry are forbidden', () => {
  for (const state of ['completed','expired','abandoned']) for (const action of ['start','resume','submit','pause','abandon','retry','accept_completion','accept_expiry']) assert.throws(() => m.transition({state,action,timed:true}),error('illegal_transition'));
  assert.throws(() => m.transition({state:'in_progress',action:'pause',timed:true}),error('timed_pause_forbidden'));
  assert.throws(() => m.transition({state:'in_progress',action:'deadline_reached',timed:true}),error('deadline_not_reached'));
  assert.throws(() => m.transition({state:'finalizing',action:'accept_completion',timed:true,reason:'deadline'}),error('wrong_terminal_reason'));
  assert.throws(() => m.remainingTime({timed:true,deadlineAt:60000,trustedNow:null}),error('clock_recovery_required'));
  assert.throws(() => m.remainingTime({timed:false,deadlineAt:60000,trustedNow:0}),error('untimed_deadline'));
});

test('lost acknowledgement, concurrent writers, owner change and reset epochs have fixed outcomes', () => {
  const input = get('E48');
  const receipt = {operationId:input.operation.operationId,canonical:m.stable(input.operation)};
  const advanced = {...input.state,revision:9,writerEpoch:3,receipts:[receipt]};
  assert.deepEqual(m.operationDecision({...input,state:advanced}),{duplicate:true,revision:9});
  assert.throws(()=>m.operationDecision({...input,state:advanced,operation:{...input.operation,payload:{selection:'b'}}}),error('operation_conflict'));
  assert.throws(()=>m.operationDecision({...input,principalId:'owner-b'}),error('owner_mismatch'));
  assert.throws(()=>m.operationDecision({...input,state:{...input.state,writerEpoch:3}}),error('stale_writer'));
  assert.throws(()=>m.operationDecision({...input,state:{...input.state,revision:5}}),error('stale_revision'));
  assert.throws(()=>m.operationDecision({...input,operation:{...input.operation,resetEpochId:'epoch-2'}}),error('reset_epoch_mismatch'));
  assert.throws(()=>m.operationDecision({...input,state:{...input.state,state:'completed'}}),error('terminal_session'));
});

test('active time rejects conflicting visit replays, stale-writer overlap and unknown items', () => {
  const input = get('E42'); const a=input.visits[0];
  assert.throws(()=>m.activeTime({...input,visits:[a,{...a,endAt:11000}]}),error('conflicting_identity'));
  assert.throws(()=>m.activeTime({...input,visits:[a,{...a,visitId:'overlap',writerEpoch:2,itemId:'i2'}]}),error('overlapping_active_visits'));
  assert.throws(()=>m.activeTime({...input,visits:[{...a,itemId:'wrong'}]}),error('unknown_timing_item'));
  assert.throws(()=>m.activeTime({...input,visits:[{...a,startAt:20000,endAt:10000}]}),error('negative_duration'));
  assert.deepEqual(m.activeTime({...input,visits:[]}),{milliseconds:0,knownItems:0,unknownItems:3,averageMs:null});
  assert.deepEqual(m.activeTime({...input,visits:[a,{...a,visitId:'unfinished',startAt:20000,endAt:null}]}),{milliseconds:0,knownItems:0,unknownItems:3,averageMs:null});
});

function snapshot() {
  return {contractVersion:'1.0.0',sessionId:'s1',ownerId:'owner-a',examId:'cssbb',setId:'1',mode:'exam',bankVersion:'b1',blueprintVersion:'bp1',gradingPolicyVersion:'g1',masteryPolicyVersion:'m1',timingPolicyVersion:'t1',expectedLength:1,siteTargetBps:7000,
    orderedItems:[{itemId:'i1',questionId:'cssbb:q1',questionRevision:'rev1',domainId:'d1',optionIds:['a','b'],optionOrder:['b','a'],selectedOptionId:null,effectiveAnsweredAt:null}],state:'in_progress',sessionRevision:1,writerEpoch:1,resetEpochId:'epoch-1',startedAt:0,deadlineAt:60000,timed:true,reportingTimeZoneAtStart:'America/Regina',currentItemId:'i1',flags:[]};
}
test('session snapshot validates versions, stable option IDs, flags, namespaces and all required fields', () => {
  assert.equal(m.validateSnapshot(snapshot()),true);
  for (const key of m.contract.session.snapshotRequired) { const s=snapshot();delete s[key];assert.throws(()=>m.validateSnapshot(s),error('missing_snapshot_'+key)); }
  for (const key of m.contract.session.itemRequired) { const s=snapshot();delete s.orderedItems[0][key];assert.throws(()=>m.validateSnapshot(s),error('missing_item_'+key)); }
  for(const [patch,code] of [[{contractVersion:'2.0.0'},'unsupported_contract'],[{deadlineAt:null},'invalid_integer'],[{state:'paused'},'timed_pause_forbidden'],[{flags:['i2']},'invalid_flags'],[{currentItemId:null},'missing_current_item']]) assert.throws(()=>m.validateSnapshot({...snapshot(),...patch}),error(code));
  const s=snapshot();s.orderedItems[0].optionOrder=['a','a'];assert.throws(()=>m.validateSnapshot(s),error('invalid_option_order'));
  const q=snapshot();q.orderedItems[0].questionId='cqe:q1';assert.throws(()=>m.validateSnapshot(q),error('invalid_question_namespace'));
});

test('logical event envelope versioning is explicit and does not widen deployed SQL enums', () => {
  const envelope={schemaVersion:1,operationId:'op1',ownerId:'owner-a',deviceId:'device-a',examId:'cssbb',sessionId:'s1',writerEpoch:1,expectedSessionRevision:1,resetEpochId:'epoch-1',type:'answer_draft_saved',clientOccurredAt:0,clientSequence:1,payload:{selectedOptionId:'a'}};
  assert.equal(m.validateEnvelope(envelope),true);
  assert.equal(m.validateEnvelope({...envelope,type:'learning_epoch_reset',sessionId:null,writerEpoch:null,expectedSessionRevision:null}),true);
  assert.throws(()=>m.validateEnvelope({...envelope,type:'learning_epoch_reset'}),error('invalid_reset_envelope'));
  for(const key of m.contract.evidence.operationRequired){const e={...envelope};delete e[key];assert.throws(()=>m.validateEnvelope(e),error('missing_operation_'+key));}
  assert.throws(()=>m.validateEnvelope({...envelope,schemaVersion:2}),error('unsupported_schema'));
  assert.throws(()=>m.validateEnvelope({...envelope,type:'random_event'}),error('invalid_event_type'));
  assert.throws(()=>m.validateEnvelope({...envelope,payload:[]}),error('invalid_payload'));
  assert.deepEqual(m.contract.evidence.deployedLegacyEvents,['session_started','question_exposed','answer_recorded','session_completed','session_abandoned']);
  assert.ok(!m.contract.evidence.deployedLegacyEvents.includes('answer_draft_saved'));
});

test('100-point release rubric is fixed and cannot average away missing proof or a blocker', () => {
  assert.deepEqual(m.rubric.areas.map(a=>a.points),[20,10,15,15,15,10,15]);
  assert.equal(m.rubric.awardedPoints,null);
  const criteria=m.rubric.areas.flatMap(a=>a.criteria);
  assert.equal(criteria.length,20);assert.equal(criteria.reduce((n,c)=>n+c.points,0),100);
  const evidence=criteria.map(c=>({criterionId:c.id,status:'passed',evidenceRef:'synthetic-test-proof',verifiedCommit:'a'.repeat(40),environment:c.requiredEnvironment||'isolated'}));
  assert.deepEqual(m.releaseScore({evidence,blockers:[]}),{earnedPoints:100,releaseReady:true,rating:10});
  assert.deepEqual(m.releaseScore({evidence:evidence.slice(0,-1),blockers:[]}),{earnedPoints:95,releaseReady:false,rating:null});
  for(const blocker of m.rubric.blockers) assert.deepEqual(m.releaseScore({evidence,blockers:[blocker]}),{earnedPoints:100,releaseReady:false,rating:null});
  const noProd=clone(evidence);noProd[19].environment='preview';assert.throws(()=>m.releaseScore({evidence:noProd,blockers:[]}),error('wrong_evidence_environment'));
  const noPhysical=clone(evidence);noPhysical[16].environment='isolated';assert.throws(()=>m.releaseScore({evidence:noPhysical,blockers:[]}),error('wrong_evidence_environment'));
  const missing=clone(evidence);delete missing[0].evidenceRef;assert.throws(()=>m.releaseScore({evidence:missing,blockers:[]}),error('missing_release_evidence'));
});

test('policy preserves New-only exclusions, original owner data and deadline semantics', () => {
  assert.equal(m.contract.retention.resetChangesNewOnly,false);
  assert.equal(m.contract.retention.abandonReleasesReservations,false);
  assert.equal(m.contract.retention.automaticReservationExpiry,false);
  assert.equal(m.contract.sync.pageReloadAllowed,false);
  assert.equal(m.contract.sync.fullLedgerDownloadOnStartAllowed,false);
  assert.equal(m.contract.session.timedPauseAllowed,false);
  assert.equal(m.contract.mastery.probabilityOfPassing,false);
  assert.equal(m.contract.session.missingTargetFallback,null);
});

test('scheduling policy preserves first/second/later review intervals and ease bounds', () => {
  assert.deepEqual(m.nextReview({status:'correct',streak:0,ease:2.3,intervalDays:0,evaluationAt:0}),{streak:1,intervalDays:1,ease:2.35,dueAt:86400000});
  assert.deepEqual(m.nextReview({status:'correct',streak:1,ease:2.35,intervalDays:1,evaluationAt:0}),{streak:2,intervalDays:3,ease:2.4,dueAt:259200000});
  assert.deepEqual(m.nextReview({status:'correct',streak:2,ease:2.4,intervalDays:3,evaluationAt:0}),{streak:3,intervalDays:7,ease:2.45,dueAt:604800000});
  assert.deepEqual(m.nextReview({status:'incorrect',streak:4,ease:1.3,intervalDays:20,evaluationAt:0}),{streak:0,intervalDays:1,ease:1.3,dueAt:86400000});
  assert.throws(()=>m.nextReview({status:'unanswered',streak:0,ease:2.3,intervalDays:0,evaluationAt:0}),error('invalid_review_status'));
});
