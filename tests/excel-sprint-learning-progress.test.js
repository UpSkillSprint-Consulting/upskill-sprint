const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const runId=receipt=>crypto.createHash('md5').update(receipt).digest('hex').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
const L=require('../assets/lessons/excel-formula-fluency/sprint/learning.js');
const P=require('../assets/lessons/excel-formula-fluency/sprint/progress.js');
const catalog=JSON.parse(fs.readFileSync('assets/lessons/excel-formula-fluency/sprint/catalog.json'));
function diagnostic(statuses={},at='2026-10-01T12:00:00.000Z') {
 const skills=Array.from({length:10},(_,i)=>({skillId:`level-${i+1}`,level:i+1,status:statuses[i+1]||'correct'}));
 return {type:'diagnostic',runId:runId('diagnostic-proof'),completed:true,score:skills.filter(x=>x.status==='correct').length*10,skills,timestamp:at,receipt:'diagnostic-proof'};
}
function drill(id,receipt,at,extra={}) {return {type:'drill',runId:runId(receipt),drillId:id,skillId:`level-${id.match(/^R(\d+)/)[1]}`,correct:true,submissionCorrect:true,attempts:3,firstAttemptCorrect:false,hint:'Correct.',completedAt:at,receipt,...extra};}
test('legacy backup migration adds separate learning state and preserves core/Expert tokens',()=>{
 const old=P.emptyState(); delete old.learning; old.tokens=['core-proof'];old.expertTokens=['expert-proof'];
 const restored=P.parseBackup(JSON.stringify(old));assert.deepEqual(restored.tokens,old.tokens);assert.deepEqual(restored.expertTokens,old.expertTokens);assert.deepEqual(restored.learning,L.emptyState());
 restored.learning=L.applyDiagnostic(restored.learning,diagnostic({2:'skipped'}));
 restored.learning=L.applyDrill(restored.learning,drill('R2-A1','drill-proof','2026-10-01T13:00:00.000Z'),'2026-10-01T13:00:00.000Z');
 restored.learning.drills['R2-A1'].submissions={formula:'=SUM(A1:A3)',result:0,resultText:'0'};
 const reimported=P.parseBackup(JSON.stringify(restored));assert.deepEqual(reimported.learning,restored.learning);assert.deepEqual(reimported.tokens,['core-proof']);assert.deepEqual(reimported.expertTokens,['expert-proof']);
});
test('learning drafts and selected view persist through browser storage fallback',async()=>{
 let raw;const env={localStorage:{getItem:()=>raw,setItem:(_,value)=>raw=value}};const store=P.createStore(env);const state=await store.load();
 state.learning.selectedView='R10-A2';state.learning.diagnosticAnswers={q1:'a',q10:null};state.learning.drills['R10-A2']={submissions:{formula:'=LET(x,A1,x)',result:[[0,'001']],resultText:'0\t001'}};
 await store.save(state);const recovered=await P.createStore(env).load();assert.deepEqual(recovered.learning,state.learning);assert.equal(recovered.tokens.length,0);
});
test('review intervals advance only after fresh alternate correct grading when due, capped at fourteen days',()=>{
 let state=L.applyDrill(L.emptyState(),drill('R1-A1','p1','2026-10-01T12:00:00.000Z'),'2026-10-01T12:00:00.000Z');
 assert.deepEqual(state.reviews['level-1'],{stage:1,nextReviewAt:'2026-10-02T12:00:00.000Z',lastReceipt:'p1',lastRunId:runId('p1'),lastDrillId:'R1-A1',lastCompletedAt:'2026-10-01T12:00:00.000Z'});
 assert.equal(state.drills['R1-A1'].attempts,3);assert.equal(state.drills['R1-A1'].firstAttemptCorrect,false);
 state=L.applyDrill(state,drill('R1-A2','early','2026-10-01T18:00:00.000Z'),'2026-10-01T18:00:00.000Z');assert.equal(state.reviews['level-1'].stage,1);
 state=L.applyDrill(state,drill('R1-A1','same-variant','2026-10-02T12:00:00.000Z'),'2026-10-02T12:00:00.000Z');assert.equal(state.reviews['level-1'].stage,1);
 for(const [id,receipt,at,next,stage] of [
  ['R1-A2','p2','2026-10-02T12:00:00.000Z','2026-10-05T12:00:00.000Z',2],
  ['R1-A1','p3','2026-10-05T12:00:00.000Z','2026-10-12T12:00:00.000Z',3],
  ['R1-A2','p4','2026-10-12T12:00:00.000Z','2026-10-26T12:00:00.000Z',4],
  ['R1-A1','p5','2026-10-26T12:00:00.000Z','2026-11-09T12:00:00.000Z',4]
 ]){state=L.applyDrill(state,drill(id,receipt,at),at);assert.equal(state.reviews['level-1'].stage,stage);assert.equal(state.reviews['level-1'].nextReviewAt,next);}
});
test('same receipt, stale replay, wrong submission and freshRun do not advance review or fake attempts',()=>{
 const first=drill('R3-A1','one','2026-10-01T12:00:00.000Z',{attempts:4});let state=L.applyDrill(L.emptyState(),first,'2026-10-01T12:00:00.000Z');
 state=L.applyDrill(state,first,'2026-10-03T12:00:00.000Z');assert.equal(state.reviews['level-3'].stage,1);assert.equal(state.drills['R3-A1'].attempts,4);
 state=L.applyDrill(state,drill('R3-A2','replayed-token','2026-10-01T12:00:00.000Z'),'2026-10-03T12:00:00.000Z');assert.equal(state.reviews['level-3'].stage,1);
 state=L.applyDrill(state,drill('R3-A2','sticky-correct','2026-10-03T12:00:00.000Z',{submissionCorrect:false}),'2026-10-03T12:00:00.000Z');assert.equal(state.reviews['level-3'].stage,1);
 const schedule=state.reviews['level-3'];state=L.freshRun(state,'R3-A2');assert.equal(state.drills['R3-A2'].receipt,undefined);assert.deepEqual(state.reviews['level-3'],schedule);
 state=L.applyDrill(state,drill('R3-A2','failed',undefined,{correct:false,submissionCorrect:false,attempts:1,firstAttemptCorrect:false}),'2026-10-03T12:00:00.000Z');assert.equal(state.reviews['level-3'].stage,1);assert.equal(state.drills['R3-A2'].attempts,1);
 assert.equal(L.recommendations(state,catalog,[],'2026-10-03T12:00:00.000Z').practice[0].id,'R3-A2');
});
test('a changed receipt for one completed run retains one review stage',()=>{
 const one=drill('R4-A1','token-one','2026-10-01T12:00:00.000Z');
 let state=L.applyDrill(L.emptyState(),one,'2026-10-01T12:00:00.000Z');
 const two=drill('R4-A2','token-two','2026-10-02T12:00:00.000Z');
 state=L.applyDrill(state,two,'2026-10-02T12:00:00.000Z');
 const stage=state.reviews['level-4'];
 state=L.applyDrill(state,{...one,receipt:'changed-output-token'},'2026-10-10T12:00:00.000Z');
 assert.deepEqual(state.reviews['level-4'],stage);assert.equal(state.drills['R4-A1'].runId,one.runId);
});
test('first correct answer after a wrong answer in the same run starts review without duplicating later',()=>{
 const wrong=drill('R6-A1','wrong',undefined,{correct:false,submissionCorrect:false,attempts:1});
 let state=L.applyDrill(L.emptyState(),wrong,'2026-10-01T12:00:00.000Z');assert.equal(state.reviews['level-6'],undefined);
 const correct=drill('R6-A1','correct','2026-10-01T13:00:00.000Z',{runId:wrong.runId,attempts:2,firstAttemptCorrect:false});
 state=L.applyDrill(state,correct,'2026-10-01T13:00:00.000Z');assert.equal(state.reviews['level-6'].stage,1);assert.equal(state.drills['R6-A1'].attempts,2);
 const review=state.reviews['level-6'];state=L.applyDrill(state,{...correct,receipt:'updated-correct-receipt'},'2026-10-05T13:00:00.000Z');assert.deepEqual(state.reviews['level-6'],review);
});
test('due review selects alternate drill even if another fresh same-variant run is unfinished',()=>{
 let state=L.applyDrill(L.emptyState(),drill('R8-A1','complete','2026-10-01T12:00:00.000Z'),'2026-10-01T12:00:00.000Z');
 state=L.freshRun(state,'R8-A1');state=L.applyDrill(state,drill('R8-A1','wrong',undefined,{correct:false,submissionCorrect:false,attempts:1}),'2026-10-01T13:00:00.000Z');
 assert.equal(L.recommendations(state,catalog,[],'2026-10-01T14:00:00.000Z').practice[0].id,'R8-A1');
 const due=L.recommendations(state,catalog,[],'2026-10-02T12:00:00.000Z').practice[0];assert.equal(due.id,'R8-A2');assert.equal(due.due,true);
});
test('learning catalog supplies drill titles while core recommendation remains sequential',()=>{
 const learningCatalog=JSON.parse(fs.readFileSync('assets/lessons/excel-formula-fluency/sprint/learning/catalog.json'));
 const state=L.applyDiagnostic(L.emptyState(),diagnostic({7:'incorrect'}));
 const choices=L.recommendations(state,learningCatalog,[],'2026-10-01T12:00:00.000Z');
 assert.equal(choices.nextCore.packageId,'L1-A1');assert.equal(choices.practice[0].id,'R7-A1');assert.equal(choices.practice[0].title,learningCatalog.skills[6].drills[0].title);
 const all=Array.from({length:50},(_,i)=>({packageId:`L${Math.floor(i/5)+1}-A${i%5+1}`}));assert.equal(L.recommendations(state,learningCatalog,all,'2026-10-01T12:00:00.000Z').nextCore,null);
});
test('recommendations prioritize weak diagnostic, verified core weak scores, then due review and retain sequential core',()=>{
 let state=L.applyDiagnostic(L.emptyState(),diagnostic({2:'skipped',4:'incorrect'}));state=L.applyDrill(state,drill('R5-A1','five','2026-10-01T13:00:00.000Z'),'2026-10-01T13:00:00.000Z');
 const verified=[{packageId:'L1-A1',firstAttemptScore:50,timestamp:'2026-10-01T12:00:00.000Z'},{packageId:'L8-A1',firstAttemptScore:100,timestamp:'2026-10-01T12:00:00.000Z'}];
 const choices=L.recommendations(state,catalog,verified,'2026-10-03T13:00:00.000Z');assert.equal(choices.nextCore.packageId,'L1-A2');assert.deepEqual(choices.practice.map(x=>x.skillId),['level-2','level-4','level-1','level-5']);assert.equal(choices.practice[3].id,'R5-A2');assert.equal(choices.practice[3].due,true);
 state=L.applyDrill(state,drill('R2-A1','two','2026-10-03T13:00:00.000Z'),'2026-10-03T13:00:00.000Z');assert.ok(!L.recommendations(state,catalog,verified,'2026-10-03T13:00:00.000Z').practice.some(x=>x.skillId==='level-2'));
 assert.equal(L.recommendations(state,catalog,[], '2026-10-03T13:00:00.000Z').nextCore.packageId,'L1-A1');
});
test('local learning records cannot unlock core assignments or satisfy core verification',()=>{
 const state=P.emptyState();state.learning=L.applyDiagnostic(state.learning,diagnostic());state.learning=L.applyDrill(state.learning,drill('R10-A2','practice-only','2026-10-01T13:00:00.000Z'),'2026-10-01T13:00:00.000Z');
 assert.equal(P.unlocked('L2-A1',[],true),false);const applied=P.applyVerified(state,[],catalog,[]);assert.equal(applied.tokens.length,0);assert.equal(applied.expertTokens.length,0);assert.deepEqual(applied.badges,[]);assert.deepEqual(applied.learning,state.learning);
});
test('Regina day boundary remains fixed in winter and summer and rejects invalid dates',()=>{
 assert.equal(L.dayStamp('2026-10-02T05:59:59Z'),'2026-10-01');assert.equal(L.dayStamp('2026-10-02T06:00:00Z'),'2026-10-02');assert.equal(L.dayStamp('2026-07-01T05:59:59Z'),'2026-06-30');assert.equal(L.dayStamp('2026-01-01T06:00:00Z'),'2026-01-01');assert.throws(()=>L.dayStamp('invalid'));
});
test('signed completion schedules review despite a slow device clock and a fresh draft retains resolved skill evidence',()=>{
 const report=drill('R2-A1','server-time','2026-10-02T06:05:00.000Z',{attempts:1,firstAttemptCorrect:true});
 let state=L.applyDiagnostic(L.emptyState(),diagnostic({2:'skipped'},'2026-10-02T05:59:00.000Z'));
 state=L.applyDrill(state,report,'2026-10-02T06:00:00.000Z');assert.equal(state.reviews['level-2'].nextReviewAt,'2026-10-03T06:05:00.000Z');assert.equal(state.drills['R2-A1'].attempts,1);assert.equal(state.drills['R2-A1'].firstAttemptCorrect,true);
 state=L.freshRun(state,'R2-A1');const choices=L.recommendations(state,catalog,[],'2026-10-02T06:06:00.000Z');assert.ok(!choices.practice.some(x=>x.skillId==='level-2'));
 const due=L.recommendations(state,catalog,[],'2026-10-03T06:05:00.000Z').practice.find(x=>x.skillId==='level-2');assert.equal(due.id,'R2-A2');assert.equal(due.reason,'A spaced review is due.');
});
test('due boundaries and late review shift the next interval from the actual new completion date',()=>{
 let state=L.applyDrill(L.emptyState(),drill('R10-A1','december','2026-12-31T23:55:00.000Z'),'2026-12-31T23:55:00.000Z');
 assert.equal(state.reviews['level-10'].nextReviewAt,'2027-01-01T23:55:00.000Z');assert.equal(L.recommendations(state,catalog,[],'2027-01-01T23:54:59.999Z').practice.length,0);assert.equal(L.recommendations(state,catalog,[],'2027-01-01T23:55:00.000Z').practice[0].due,true);
 state=L.applyDrill(state,drill('R10-A2','late','2027-01-15T23:55:00.000Z'),'2027-01-15T23:55:00.000Z');assert.equal(state.reviews['level-10'].stage,2);assert.equal(state.reviews['level-10'].nextReviewAt,'2027-01-18T23:55:00.000Z');
 const leap=L.applyDrill(L.emptyState(),drill('R10-A1','leap','2028-02-28T12:00:00.000Z'),'2028-02-28T12:00:00.000Z');assert.equal(leap.reviews['level-10'].nextReviewAt,'2028-02-29T12:00:00.000Z');
});
test('malformed learning imports reject unknown IDs, unsafe drafts, inconsistent skill reports and edited review dates',()=>{
 for(const mutate of [
  s=>s.drills['R11-A1']={submissions:{formula:'',result:''}},
  s=>s.drills['R1-A3']={submissions:{formula:'',result:''}},
  s=>s.drills['L1-A1']={submissions:{formula:'',result:''}},
  s=>s.drills['R1-A1']={submissions:{formula:'x'.repeat(4097),result:''}},
  s=>s.drills['R1-A1']={submissions:{formula:'',result:{answer:0}}},
  s=>s.diagnosticAnswers={q11:'a'},
  s=>s.diagnosticAnswers={q1:'z'},
  s=>s.diagnosticAnswers={q1:['a']},
  s=>s.selectedView='EX-A1',
  s=>s.selectedView=['R1-A1'],
  s=>s.diagnostic={...diagnostic(),runId:[runId('diagnostic-proof')]},
  s=>s.diagnostic={...diagnostic(),skills:diagnostic().skills.map(x=>({...x,skillId:'level-1'}))},
  s=>s.diagnostic={...diagnostic(),score:90},
  s=>s.drills['R1-A1']=drill('R1-A1','proof','2026-10-01T12:00:00.000Z',{skillId:'level-2'}),
  s=>s.drills['R1-A1']=drill('R1-A1','proof','2026-10-01T12:00:00.000Z',{attempts:0}),
  s=>s.reviews['level-1']={stage:1,nextReviewAt:'2026-10-03T12:00:00.000Z',lastReceipt:'proof',lastRunId:runId('proof'),lastDrillId:'R1-A1',lastCompletedAt:'2026-10-01T12:00:00.000Z'}
 ]) {const state=L.emptyState();mutate(state);assert.throws(()=>L.validateState(state));}
});
