'use strict';
// Uses the existing real-role disposable database runner. No new DDL and no
// production access. JavaScript and PostgreSQL both face hand-counted answers.
const assert=require('node:assert/strict');
const V=require('../../../test-bank-versioning.js');
const {artifacts,readExams}=require('../../../scripts/exam-reliability/build-catalog.cjs');
const {publication}=require('./segment05-catalog.cjs');
const A='10000000-0000-4000-8000-000000000001';
const literal=x=>"'"+String(x).replace(/'/g,"''")+"'";
const json=x=>literal(JSON.stringify(x))+'::jsonb';
async function runChecks({target,ok,role,expect,expectDenied,requireCount}){
  const {catalog}=await artifacts(),exams=await readExams();
  const commit=sql=>sql.replace(/ROLLBACK;$/,'COMMIT;');
  let fixtures=0;
  function complete(examId,setId,exam,cat,questions,label,category){
    const sid='segment09-'+label;
    const pin=V.pin({examId,sessionId:sid,setId,questions,mode:'exam',timed:true,limitSeconds:600,startedAt:Date.UTC(2026,8,8,12)},exam,cat);
    const expected={total:questions.length,correct:0,incorrect:0,unanswered:0,byDomain:{}};
    const answers=questions.map((q,i)=>{
      const status=category(i),selected=status==='unanswered'?null:status==='correct'?q.answer:(q.answer+1)%q.options.length;
      expected[status]++;
      const d=exam.bok.find(d=>d.subs.some(s=>s.id===q.sub)).domain;
      if(!expected.byDomain[d])expected.byDomain[d]={total:0,correct:0,incorrect:0,unanswered:0};
      expected.byDomain[d].total++;expected.byDomain[d][status]++;
      return {questionId:q.qid,selected,status,sub:q.sub};
    });
    const g=V.clone(V.grade(pin,questions.map((question,i)=>({question,selected:answers[i].selected}))));delete g.answers;
    const targetBps=pin.siteTargetBps,verdict=targetBps===null?null:expected.correct*10000>=expected.total*targetBps;
    for(const k of ['total','correct','incorrect','unanswered','byDomain'])assert.deepEqual(g[k],expected[k],label+' JS '+k);
    assert.equal(g.siteTargetMet,verdict);
    function op(type,revision,payload){return {schemaVersion:'1.0.0',operationId:sid+'-'+revision,ownerId:A,deviceId:'segment09-sql-device',examId,sessionId:sid,writerEpoch:0,expectedSessionRevision:revision,resetEpochId:null,type,clientOccurredAt:'2026-09-08T12:00:00.000Z',clientSequence:revision,payload:{questionId:null,eventPayload:payload}};}
    const operations=[op('session_started',0,{mode:'exam',timed:true,total:questions.length,versionPin:V.wire(pin)}),op('finalization_requested',1,{mode:'exam',timed:true,total:questions.length,correct:expected.correct,answers,versionPin:V.reference(pin),grading:g})];
    const ingest='SELECT public.ingest_test_bank_operations_v1('+json(operations)+');';
    expect(target,'09 real-role finalization '+label,commit(role(A,ingest)));
    const server=JSON.parse(ok(target,"SELECT grade FROM public.test_bank_versioned_results WHERE user_id='"+A+"' AND session_id="+literal(sid)+" AND kind='original';"));
    for(const k of ['total','correct','incorrect','unanswered','byDomain'])assert.deepEqual(server[k],expected[k],label+' SQL '+k);
    assert.equal(server.siteTargetMet,verdict);assert.equal(server.siteTargetBps,targetBps);assert.equal(server.expectedLength,pin.expectedLength);
    assert.ok(Math.abs(server.scorePercent-100*expected.correct/expected.total)<1e-10);
    expect(target,'09 replay retains one original grade '+label,role(A,ingest+requireCount("SELECT * FROM public.test_bank_versioned_results WHERE session_id="+literal(sid),1)));
    fixtures++;
  }
  for(const id of ['cssbb','cqe','mbb','cssgb','cmq']){
    const e=exams[id];
    for(const [setId,all]of Object.entries(e.sets)){
      const n=e.fullExamQuestionsBySet?.[setId]||e.questions;
      complete(id,setId,e,catalog.exams[id],all.slice(0,n),id+'-set-'+setId,i=>['correct','incorrect','unanswered'][i%3]);
    }
  }
  const e=exams.cssbb,qs=e.sets[1].slice(0,165);
  for(const correct of [0,115,116,165])complete('cssbb','1',e,catalog.exams.cssbb,qs,'cssbb-edge-'+correct,i=>i<correct?'correct':'unanswered');
  const small={questions:2,minutes:2,pass:null,sets:{1:[0,1].map(i=>({qid:'cssbb:segment09-unknown:'+i,sub:'s09',stem:'Synthetic unknown-target question '+i,options:['A','B'],answer:0,why:'Synthetic.'}))},bok:[{domain:'s09',subs:[{id:'s09',w:1}]}]};small.bank=small.sets[1];
  const pub=publication(small);ok(target,'SELECT public.publish_test_bank_catalog('+json(pub)+');');
  const c=V.createExamCatalog('cssbb',small,{source:'synthetic SQL regression'});
  complete('cssbb','1',small,c,small.sets[1],'unknown-target',i=>i?'unanswered':'correct');
  expect(target,'09 all independent grading fixtures remain distinct canonical originals',requireCount("SELECT * FROM public.test_bank_versioned_results WHERE session_id LIKE 'segment09-%' AND kind='original'",fixtures));
}
module.exports={runChecks};
