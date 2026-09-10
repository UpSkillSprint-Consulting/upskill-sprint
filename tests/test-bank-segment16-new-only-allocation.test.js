'use strict';
const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const ROOT=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(ROOT,'test-bank-new-only-allocation-v2.js'),'utf8');
const migration=fs.readFileSync(path.join(ROOT,'supabase/migrations/20260910030000_add_new_only_allocation_v2.sql'),'utf8');
const edge=fs.readFileSync(path.join(ROOT,'netlify/edge-functions/test-bank-set-controls.js'),'utf8');

function tick(w,ms=5){return new Promise(r=>w.setTimeout(r,ms));}
function fixture(options={}){
  const dom=new JSDOM('<!doctype html><html><body><div id="tb-overview"></div></body></html>',{url:'https://upskillsprint.com/test-bank',runScripts:'dangerously',pretendToBeVisual:true});
  const w=dom.window, calls=[], actions=[];
  const owner={id:'segment16-owner'};
  const reservationId='11111111-1111-4111-8111-111111111111';
  const client={rpc(name,args){
    calls.push({name,args});
    if(options.rpc)return Promise.resolve(options.rpc(name,args,calls));
    if(name==='reserve_test_bank_new_questions_v2')return Promise.resolve({data:(args.p_question_ids||[]).map(question_id=>({reservation_id:reservationId,planned_session_id:args.p_planned_session_id,question_id,item_state:'reserved',reused:false})),error:null});
    return Promise.resolve({data:[],error:null});
  }};
  w.UpskillAuth={getUser:()=>owner,getClient:()=>client};
  w.__TBLearning={
    questionId(examId,q){return typeof q==='string'?q:q.qid;},
    reserveNewQuestions(){throw new Error('legacy reservation path must be replaced');},
    startSession(input){actions.push(['start',input]);return {sessionId:input.sessionId||'session-16',saved:true};},
    recordAnswer(input){actions.push(['answer',input]);return {eventId:'answer-16',saved:true};},
    abandonSession(input){actions.push(['abandon',input]);return input.sessionId;},
    completeSession(input){actions.push(['complete',input]);return {sessionId:input.sessionId,saved:true};}
  };
  w.__TB={questionIdentityPolicy:'explicit-v1',EXAMS:{cssbb:{bank:[]}}};
  w.__TBQuestionRegistry={
    validateSelection(examId,candidates){return {valid:examId==='cssbb'&&Array.isArray(candidates)&&candidates.length>0};},
    find(examId,id){return {qid:id,stem:id,options:['A','B'],answer:0,sub:'fixture'};}
  };
  w.eval(source);
  return {dom,w,calls,actions,reservationId};
}

test('Segment 16 migration is additive, owner scoped and permanently excludes reservations',()=>{
  assert.match(migration,/create table if not exists public\.test_bank_new_only_reservations/i);
  assert.match(migration,/create table if not exists public\.test_bank_new_only_reservation_items/i);
  assert.match(migration,/pg_advisory_xact_lock\s*\(/i);
  assert.match(migration,/insert into public\.test_bank_new_question_claims/i);
  assert.match(migration,/not exists[\s\S]*test_bank_learning_events/i);
  assert.doesNotMatch(migration,/delete\s+from\s+public\.test_bank_new_question_claims/i);
  assert.match(migration,/revoke all on table public\.test_bank_new_only_reservations from public, anon, authenticated/i);
  assert.match(migration,/grant execute on function public\.reserve_test_bank_new_questions_v2/i);
});

test('Segment 16 edge loading preserves Segment 14 ordering and installs allocation after learning',()=>{
  const policy=edge.indexOf("scriptTag(POLICY_SOURCE)");
  const learning=edge.indexOf("scriptTag(LEARNING_SYNC_SOURCE)");
  const allocation=edge.indexOf("scriptTag(NEW_ONLY_ALLOCATION_SOURCE)");
  assert.ok(policy>=0&&learning>policy&&allocation>learning);
});

test('reservation is authoritative but does not create answered/mastery/readiness evidence',async t=>{
  const f=fixture();t.after(()=>f.dom.window.close());
  const ids=['cssbb:s16:1','cssbb:s16:2'];
  const result=await f.w.__TBLearning.reserveNewQuestions({examId:'cssbb',questionIds:ids});
  assert.equal(result.ready,true);assert.deepEqual(Array.from(result.acceptedIds),ids);
  assert.equal(f.calls.length,1);assert.equal(f.calls[0].name,'reserve_test_bank_new_questions_v2');
  assert.equal(f.actions.length,0,'allocation alone must not create a learning/session action');
  assert.equal(source.includes('ensureFreshHistory('),false,'Segment 16 must not reintroduce a Start-path full-ledger fetch');
});

test('interrupted Start retries the exact same planned-session allocation',async t=>{
  let firstPlan='';
  const f=fixture({rpc(name,args){
    if(name!=='reserve_test_bank_new_questions_v2')return {data:[],error:null};
    if(!firstPlan)firstPlan=args.p_planned_session_id;
    assert.equal(args.p_planned_session_id,firstPlan);
    return {data:[{reservation_id:'22222222-2222-4222-8222-222222222222',planned_session_id:firstPlan,question_id:'cssbb:s16:1',item_state:'reserved',reused:f.calls.length>1}],error:null};
  }});t.after(()=>f.dom.window.close());
  const a=await f.w.__TBLearning.reserveNewQuestions({examId:'cssbb',questionIds:['cssbb:s16:1']});
  const b=await f.w.__TBLearning.reserveNewQuestions({examId:'cssbb',questionIds:['cssbb:s16:1']});
  assert.equal(a.plannedSessionId,b.plannedSessionId);assert.equal(b.reason,'reservation-reused');
  assert.equal(f.calls.filter(c=>c.name==='reserve_test_bank_new_questions_v2').length,2);
});

test('durable start, actual display, answer and abandonment publish distinct lifecycle states',async t=>{
  const f=fixture();t.after(()=>f.dom.window.close());
  const q={qid:'cssbb:s16:1',stem:'fixture',options:['A','B'],answer:0};
  const allocation=await f.w.__TBLearning.reserveNewQuestions({examId:'cssbb',questions:[q]});
  assert.ok(allocation.reservationId);
  f.w.__TBLearning.startSession({examId:'cssbb',sessionId:'session-16',questions:[q]});
  await tick(f.w);
  assert.ok(f.calls.some(c=>c.name==='mark_test_bank_new_only_reservation_v2'&&c.args.p_state==='delivered'&&c.args.p_question_id===null));
  const quiz=f.w.document.createElement('div');quiz.className='tb-quiz';quiz.dataset.questionId=q.qid;f.w.document.getElementById('tb-overview').appendChild(quiz);
  await tick(f.w);
  assert.ok(f.calls.some(c=>c.name==='mark_test_bank_new_only_reservation_v2'&&c.args.p_state==='displayed'&&c.args.p_question_id===q.qid));
  f.w.__TBLearning.recordAnswer({examId:'cssbb',sessionId:'session-16',question:q,selected:0});
  await tick(f.w);
  assert.ok(f.calls.some(c=>c.name==='mark_test_bank_new_only_reservation_v2'&&c.args.p_state==='answered'&&c.args.p_question_id===q.qid));
  f.w.__TBLearning.abandonSession({examId:'cssbb',sessionId:'session-16'});
  await tick(f.w);
  assert.ok(f.calls.some(c=>c.name==='mark_test_bank_new_only_reservation_v2'&&c.args.p_state==='abandoned'));
});

test('pool exhaustion and RPC failure fail closed with explicit reasons',async t=>{
  const exhausted=fixture({rpc(name){return name==='reserve_test_bank_new_questions_v2'?{data:[],error:{code:'P0001',message:'NEW_ONLY_EXHAUSTED'}}:{data:[],error:null};}});t.after(()=>exhausted.dom.window.close());
  const a=await exhausted.w.__TBLearning.reserveNewQuestions({examId:'cssbb',questionIds:['cssbb:s16:1']});
  assert.equal(a.ready,false);assert.equal(a.reason,'pool-exhausted');
  const failed=fixture({rpc(){return {data:[],error:{code:'57014',message:'transport failed'}};}});t.after(()=>failed.dom.window.close());
  const b=await failed.w.__TBLearning.reserveNewQuestions({examId:'cssbb',questionIds:['cssbb:s16:2']});
  assert.equal(b.ready,false);assert.equal(b.reason,'rpc-error');
});

test('Segment 5 version validation remains ahead of allocation',async t=>{
  const f=fixture();t.after(()=>f.dom.window.close());
  f.w.__TB.examVersionPolicy='catalog-v1';
  f.w.__TBVersionCatalog={exams:{cssbb:{}}};
  f.w.__TBVersions={validateCandidates(){throw new Error('revision mismatch');}};
  const result=await f.w.__TBLearning.reserveNewQuestions({examId:'cssbb',questionIds:['cssbb:s16:1']});
  assert.equal(result.reason,'invalid-exam-version');assert.equal(f.calls.length,0);
});
