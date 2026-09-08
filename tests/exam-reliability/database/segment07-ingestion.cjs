'use strict';
const assert=require('node:assert/strict');
const V=require('../../../test-bank-versioning.js');
const A='10000000-0000-4000-8000-000000000001',B='10000000-0000-4000-8000-000000000002';
const literal=x=>"'"+String(x).replace(/'/g,"''")+"'";
const json=x=>literal(JSON.stringify(x))+'::jsonb';
const commit=sql=>sql.replace(/ROLLBACK;$/,'COMMIT;');

function publication(exam){const c=V.createExamCatalog('cssbb',exam,{source:'segment07 SQL regression'});return {catalog:c,payload:{schemaVersion:'1.0.0',examId:'cssbb',configVersion:c.configVersion,blueprintVersion:c.blueprintVersion,bankVersion:c.bankVersion,config:c.config,provenance:c.provenance,canonicalConfig:V.canonical({config:c.config,provenance:c.provenance}),canonicalBlueprint:V.canonical(c.config.bok),canonicalManifest:V.canonical({examId:'cssbb',questions:c.questions,sets:c.sets}),contents:Object.fromEntries(exam.sets[1].map(q=>[q.qid,{revision:c.questions[q.qid],content:V.content(q),canonicalContent:V.canonical(V.content(q))}]))}};}
function envelope(id,type,session,revision,eventPayload,questionId=null,owner=A){return {schemaVersion:'1.0.0',operationId:id,ownerId:owner,deviceId:'segment07-device',examId:'cssbb',sessionId:session,writerEpoch:0,expectedSessionRevision:revision,resetEpochId:null,type,clientOccurredAt:'2026-09-08T18:00:00.000Z',clientSequence:revision,payload:{questionId,eventPayload}};}
const ingest=operations=>`SELECT public.ingest_test_bank_operations_v1(${json(operations)});`;

async function runChecks({target,ok,role,expect,expectDenied,requireCount,concurrent}){
  const qs=[0,1].map(i=>({qid:'cssbb:segment07:'+i,stem:'Segment 07 SQL test '+i,sub:'s07',options:['A','B','C','D'],answer:i,why:'Synthetic server-ingestion fixture.'}));
  const exam={questions:2,minutes:2,pass:70,sets:{1:qs},bank:qs,bok:[{domain:'segment07-domain',weight:2,subs:[{id:'s07',w:2}]}]};
  const published=publication(exam);ok(target,`SELECT public.publish_test_bank_catalog(${json(published.payload)});`);
  function sessionData(session){
    const pin=V.pin({examId:'cssbb',sessionId:session,mode:'exam',setId:'1',questions:qs,timed:false,startedAt:Date.UTC(2026,8,8,18)},exam,published.catalog);
    const answers=qs.map((q,i)=>({questionId:q.qid,selected:i,status:'correct',sub:q.sub}));
    const grade=V.clone(V.grade(pin,qs.map((question,i)=>({question,selected:i}))));delete grade.answers;
    const completion={mode:'exam',timed:false,total:2,correct:2,answers,versionPin:V.reference(pin),grading:grade};
    const start={mode:'exam',timed:false,total:2,versionPin:V.wire(pin)};
    return {pin,start,completion,pre:[envelope(session+'-start','session_started',session,0,start),...qs.map((q,i)=>envelope(session+'-show-'+i,'question_displayed',session,i+1,{index:i,mode:'exam',timed:false,firstExposure:true,sub:q.sub},q.qid))]};
  }
  const one=sessionData('segment07-session-one'),batch=one.pre.concat(envelope('segment07-final-one','finalization_requested',one.pin.sessionId,3,one.completion));
  expect(target,'07 authenticated batch atomically creates one canonical completion and receipts',commit(role(A,ingest(batch)))+requireCount("SELECT * FROM public.test_bank_learning_events WHERE session_id='segment07-session-one' AND event_type='session_completed'",1)+requireCount("SELECT * FROM public.test_bank_versioned_results WHERE session_id='segment07-session-one' AND kind='original'",1)+requireCount("SELECT * FROM public.test_bank_operation_receipts WHERE session_id='segment07-session-one'",4));
  expect(target,'07 identical operation replay returns original receipts without changing totals',role(A,ingest(batch)+requireCount("SELECT * FROM public.test_bank_learning_events WHERE session_id='segment07-session-one'",4)+requireCount("SELECT * FROM public.test_bank_versioned_results WHERE session_id='segment07-session-one'",1)));
  expect(target,'07 receipt/runtime reads are isolated to their authenticated owner',role(B,requireCount("SELECT * FROM public.test_bank_operation_receipts WHERE session_id='segment07-session-one'",0)+requireCount("SELECT * FROM public.test_bank_session_runtime WHERE session_id='segment07-session-one'",0)));
  expectDenied(target,'07 anonymous callers cannot invoke the ingestion RPC',role(null,ingest(batch),'anon'),'42501');
  expectDenied(target,'07 browser roles cannot forge a server receipt',role(A,"INSERT INTO public.test_bank_operation_receipts(user_id,operation_id,payload_digest,exam_id,session_id,operation_type,session_revision,response) VALUES('"+A+"','forged-receipt-01',repeat('f',64),'cssbb','segment07-session-one','session_started',0,'{}');"),'42501');
  const conflict=V.clone(batch[0]);conflict.payload.eventPayload.total=99;
  expectDenied(target,'07 conflicting reuse of an accepted operation ID is rejected',role(A,ingest([conflict])),'23505');
  const terminalAlias=envelope('segment07-final-alias','finalization_requested',one.pin.sessionId,4,one.completion);
  expect(target,'07 same terminal payload under a second operation aliases the canonical completion',commit(role(A,ingest([terminalAlias])))+requireCount("SELECT * FROM public.test_bank_learning_events WHERE session_id='segment07-session-one' AND event_type='session_completed'",1)+`DO $$ BEGIN IF (SELECT response->>'applied' FROM public.test_bank_operation_receipts WHERE operation_id='segment07-final-alias')<>'false' THEN RAISE EXCEPTION 'Expected canonical alias receipt'; END IF; END $$;`);
  const terminalConflict=V.clone(terminalAlias);terminalConflict.operationId='segment07-final-conflict';terminalConflict.payload.eventPayload.answers[0].selected=1;
  expectDenied(target,'07 a conflicting second finalization cannot replace canonical answers',role(A,ingest([terminalConflict])),'23505');
  expectDenied(target,'07 direct legacy transport cannot append to a terminal versioned session',role(A,`INSERT INTO public.test_bank_learning_events(user_id,event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,payload) VALUES('${A}','segment07-late-answer','segment07-device','answer_recorded','cssbb','segment07-session-one','${qs[0].qid}',now(),'{}');`),'23514');
  const foreign=V.clone(one.pre[0]);foreign.operationId='segment07-foreign-owner';foreign.ownerId=B;
  expectDenied(target,'07 authenticated principal cannot submit another owner envelope',role(A,ingest([foreign])),'42501');
  const malformed=V.clone(one.pre[0]);malformed.operationId='segment07-bad-schema';malformed.schemaVersion='2.0.0';
  expectDenied(target,'07 unsupported schema is rejected before evidence changes',role(A,ingest([malformed])),'23514');
  const partial=sessionData('segment07-session-partial'),poison=V.clone(partial.pre[1]);poison.type='unsupported_future_type';
  expectDenied(target,'07 one invalid operation rolls back the entire submitted batch',commit(role(A,ingest([partial.pre[0],poison]))),'23514');
  expect(target,'07 failed batch left no partial session, event, result or receipt',requireCount("SELECT * FROM public.test_bank_learning_events WHERE session_id='segment07-session-partial'",0)+requireCount("SELECT * FROM public.test_bank_session_versions WHERE session_id='segment07-session-partial'",0)+requireCount("SELECT * FROM public.test_bank_operation_receipts WHERE session_id='segment07-session-partial'",0));
  expect(target,'07 rejected requests did not corrupt accepted evidence',requireCount("SELECT * FROM public.test_bank_learning_events WHERE session_id='segment07-session-one'",4)+requireCount("SELECT * FROM public.test_bank_versioned_results WHERE session_id='segment07-session-one'",1));

  const race=sessionData('segment07-session-race');
  expect(target,'07 race fixture reaches one locked in-progress revision',commit(role(A,ingest(race.pre)))+requireCount("SELECT * FROM public.test_bank_session_runtime WHERE session_id='segment07-session-race' AND state='in_progress' AND session_revision=3",1));
  const left=envelope('segment07-race-final-a','finalization_requested',race.pin.sessionId,3,race.completion),right=envelope('segment07-race-final-b','finalization_requested',race.pin.sessionId,3,race.completion);
  const attempts=await Promise.all([concurrent(target,commit(role(A,ingest([left])))),concurrent(target,commit(role(A,ingest([right]))))]);
  assert.equal(attempts.filter(x=>x.exit===0).length,2,'both same-payload contenders should receive a receipt');
  expect(target,'07 concurrent finalizers yield exactly one event/result and one canonical alias',requireCount("SELECT * FROM public.test_bank_learning_events WHERE session_id='segment07-session-race' AND event_type='session_completed'",1)+requireCount("SELECT * FROM public.test_bank_versioned_results WHERE session_id='segment07-session-race' AND kind='original'",1)+requireCount("SELECT * FROM public.test_bank_operation_receipts WHERE session_id='segment07-session-race' AND operation_type='finalization_requested'",2)+requireCount("SELECT * FROM public.test_bank_operation_receipts WHERE session_id='segment07-session-race' AND operation_type='finalization_requested' AND response->>'applied'='true'",1));
  expectDenied(target,'07 a post-terminal response is rejected by the server state machine',role(A,ingest([envelope('segment07-late-answer','response_committed',race.pin.sessionId,4,{index:0,status:'correct',selected:0,versionRef:{codec:1,configVersion:race.pin.configVersion,bankVersion:race.pin.bankVersion,questionRevision:race.pin.orderedItems[0].questionRevision},mode:'exam',timed:false,sub:qs[0].sub},qs[0].qid)])),'23514');
}
module.exports={runChecks};
