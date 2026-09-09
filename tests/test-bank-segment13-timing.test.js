'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const timingFactory=require('../test-bank-session-timing.js');

function snapshot(overrides={}){
  return Object.assign({schemaVersion:1,contractVersion:'1.0.0',sessionId:'s13',ownerId:'u13',examId:'cssbb',setId:'1',mode:'exam',state:'in_progress',sessionRevision:1,writerEpoch:2,resetEpochId:null,startedAt:'2026-09-09T15:00:00.000Z',deadlineAt:'2026-09-09T15:30:00.000Z',timed:true,limitSeconds:1800,currentItemId:'s13:0',flags:[],orderedItems:[{itemId:'s13:0',questionId:'cssbb:q1',questionRevision:'r1',optionOrder:['o0','o1'],optionIds:['o0','o1']},{itemId:'s13:1',questionId:'cssbb:q2',questionRevision:'r1',optionOrder:['o0','o1'],optionIds:['o0','o1']}],timingPolicyVersion:'timing-v1'},overrides);
}
function makeEnv(options={}){
  const dom=new JSDOM('<!doctype html><body><div id="tb-overview"><div class="tb-quiz" data-question-id="cssbb:q1"><div class="tb-stem">Q1</div><button data-submit>Submit</button></div><div id="tb-timer"></div></div></body>',{url:'https://timing.invalid/test-bank',pretendToBeVisual:true});
  const w=dom.window;let wall=Date.parse('2026-09-09T15:00:00.000Z'),mono=1000,current=snapshot(options.snapshot||{}),rpcTime=Date.parse(options.serverTime||'2026-09-09T15:00:00.000Z');
  w.Date.now=()=>wall;Object.defineProperty(w.performance,'now',{value:()=>mono,configurable:true});
  Object.defineProperty(w.navigator,'onLine',{value:options.online!==false,writable:true,configurable:true});
  const calls=[];
  w.UpskillAuth={getUser:()=>({id:'u13'}),getClient:()=>({rpc:async(name,args)=>{calls.push({name,args});if(options.rpcError)return {data:null,error:{message:'offline'}};return {data:{protocolVersion:1,serverTime:new Date(rpcTime).toISOString(),userId:'u13'},error:null};}})};
  const lifecycle={terminalStates:['completed','expired','abandoned'],load:id=>id&&id!==current.sessionId?null:JSON.parse(JSON.stringify(current)),save:s=>{current=JSON.parse(JSON.stringify(s));return s;},resume:id=>({sessionId:id,resumed:true})};
  const learningCalls=[];
  w.__TBLearning={startSession:input=>({saved:true,sessionId:input.sessionId||current.sessionId}),recordDraft:input=>({saved:true,input}),completeSession:input=>{learningCalls.push(JSON.parse(JSON.stringify(input)));return {saved:true};}};
  // Avoid background intervals in unit tests while still exercising browser wrappers.
  w.setInterval=()=>1;w.clearInterval=()=>{};
  const api=timingFactory(w,lifecycle);
  return {dom,w,api,lifecycle,calls,learningCalls,get:()=>current,set:s=>{current=s;},advance:ms=>{mono+=ms;wall+=ms;},shiftWall:ms=>{wall+=ms;},setServer:ms=>{rpcTime=ms;},setQuestion:id=>{w.document.querySelector('.tb-quiz').dataset.questionId=id;current.currentItemId=current.orderedItems.find(x=>x.questionId===id).itemId;},close:()=>dom.window.close()};
}

test('trusted clock uses authenticated server time plus monotonic elapsed, not adjustable wall clock',async t=>{
  const e=makeEnv();t.after(e.close);await e.api.calibrate('unit');
  const start=e.api.trustedNow();e.advance(10000);e.shiftWall(-120000);
  assert.equal(Math.round(e.api.trustedNow()-start),10000);
  assert.equal(e.w.Date.now(),Math.round(e.api.trustedNow()));
  assert.equal(e.calls.at(-1).name,'get_test_bank_server_time_v1');
});

test('deadline remains immutable and trusted resynchronization cannot rewrite it',async t=>{
  const e=makeEnv();t.after(e.close);const deadline=e.get().deadlineAt;await e.api.calibrate('first');
  e.setServer(Date.parse('2026-09-09T15:05:00.000Z'));await e.api.calibrate('resync');
  assert.equal(e.get().deadlineAt,deadline);
});

test('timed resume and edits fail closed until an offline restart can re-establish trusted time',async t=>{
  const e=makeEnv({online:false,rpcError:true});t.after(e.close);
  e.api.markRecoveryRequired('offline-restart');
  assert.equal(e.api.status().clock.recoveryRequired,true);
  assert.throws(()=>e.lifecycle.resume('s13'),err=>err.code==='TIMING_RECOVERY_REQUIRED');
  const draft=e.w.__TBLearning.recordDraft({sessionId:'s13'});
  assert.deepEqual({saved:draft.saved,reason:draft.reason},{saved:false,reason:'TIMING_RECOVERY_REQUIRED'});
});

test('timed-out finalization before the trusted deadline is rejected; after deadline reason is forced to timed-out',async t=>{
  const e=makeEnv({snapshot:{deadlineAt:'2026-09-09T15:00:05.000Z'}});t.after(e.close);await e.api.calibrate('unit');
  const early=e.w.__TBLearning.completeSession({sessionId:'s13',timed:true,completedReason:'timed-out',records:[]});
  assert.equal(early.reason,'DEADLINE_NOT_REACHED');assert.equal(e.learningCalls.length,0);
  e.advance(6000);
  const late=e.w.__TBLearning.completeSession({sessionId:'s13',timed:true,completedReason:'submitted',records:[]});
  assert.equal(late.saved,true);assert.equal(e.learningCalls.length,1);assert.equal(e.learningCalls[0].completedReason,'timed-out');
});

test('active visit commits the visible interval on hide, excludes hidden time, and accumulates revisits',async t=>{
  const e=makeEnv();t.after(e.close);await e.api.calibrate('unit');
  e.api.startVisit('visible');e.advance(10000);e.api.commitVisit('hidden');
  e.advance(20000);e.api.startVisit('visible-again');e.advance(5000);e.api.commitVisit('navigate');
  const s=e.api.summary();assert.equal(s.questionTotalsMs['cssbb:q1'],15000);assert.equal(s.measuredItems,1);assert.equal(e.get().timingEvidence.visits.length,2);
});

test('visits are clipped at the immutable deadline and known zero durations remain measured',async t=>{
  const e=makeEnv({snapshot:{deadlineAt:'2026-09-09T15:00:12.000Z'}});t.after(e.close);await e.api.calibrate('unit');
  e.api.startVisit('q1');e.advance(10000);e.api.commitVisit('q1-end');
  e.setQuestion('cssbb:q2');e.api.startVisit('q2');e.api.commitVisit('zero-known');
  e.api.startVisit('q2-again');e.advance(5000);e.api.commitVisit('deadline');
  const s=e.api.summary();assert.equal(s.questionTotalsMs['cssbb:q1'],10000);assert.equal(s.questionTotalsMs['cssbb:q2'],2000);assert.equal(s.measuredItems,2);assert.equal(s.averageActiveMs,6000);assert.equal(s.coverage,1);
});

test('question timing uses canonical IDs and only one active visit can exist at a time',async t=>{
  const e=makeEnv();t.after(e.close);await e.api.calibrate('unit');
  e.api.startVisit('q1');e.advance(3000);e.setQuestion('cssbb:q2');e.api.syncVisible('change');e.advance(4000);e.api.commitVisit('done');
  const s=e.api.summary();assert.deepEqual(s.questionTotalsMs,{'cssbb:q1':3000,'cssbb:q2':4000});assert.equal(e.get().timingEvidence.visits.length,2);
});

test('untimed active visits use monotonic elapsed without requiring the trusted-clock RPC',t=>{
  const e=makeEnv({snapshot:{timed:false,deadlineAt:null,mode:'focus'}});t.after(e.close);
  e.api.startVisit('untimed');e.advance(2500);e.shiftWall(90000);e.api.commitVisit('untimed-end');
  assert.equal(e.api.summary().questionTotalsMs['cssbb:q1'],2500);
});
