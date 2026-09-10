'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const ROOT=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(ROOT,'test-bank-security-reset.js'),'utf8');
const edge=fs.readFileSync(path.join(ROOT,'netlify/edge-functions/test-bank-set-controls.js'),'utf8');
const migration=fs.readFileSync(path.join(ROOT,'supabase/migrations/20260910050000_add_security_reset_v1.sql'),'utf8');
const compatibility=fs.readFileSync(path.join(ROOT,'supabase/migrations/20260910050100_preserve_legacy_reservation_compat.sql'),'utf8');

function tick(){return new Promise(resolve=>setTimeout(resolve,0));}
function harness(options={}){
  const calls=[];
  const dom=new JSDOM('<!doctype html><body><div class="tb-data-actions"></div></body>',{url:'https://segment18.invalid/test-bank',runScripts:'outside-only'});
  const w=dom.window;
  let currentUser=options.user===undefined?{id:'owner-a'}:options.user;
  Object.defineProperty(w.navigator,'onLine',{configurable:true,get:()=>options.online!==false});
  w.URL.createObjectURL=()=> 'blob:fixture';w.URL.revokeObjectURL=()=>{};
  if(w.indexedDB)w.indexedDB.deleteDatabase=()=>({});
  const rpc=async(name,args)=>{
    calls.push({name,args});
    if(options.rpc)return options.rpc(name,args,calls);
    if(name==='fetch_test_bank_data_control_v1')return {data:[{generation:2,purged_at:'2026-09-10T04:00:00Z',server_time:'2026-09-10T04:00:01Z'}],error:null};
    if(name==='delete_test_bank_learning_data_v1')return {data:{generation:3,purgedAt:'2026-09-10T04:01:00Z',deleted:{learningEvents:8}},error:null};
    return {data:[],error:null};
  };
  w.UpskillAuth={getUser:()=>currentUser,getClient:()=>({rpc})};
  w.__TBUXAccessibility={announce:()=>{}};
  w.eval(source);
  return {w,calls,api:w.__TBSecurityData,close:()=>w.close(),setUser:value=>{currentUser=value;}};
}
function assertOutcome(actual,deleted,reason){
  assert.equal(Boolean(actual&&actual.deleted),deleted);
  assert.equal(actual&&actual.reason,reason);
}

test('18 security layer is injected after state modules and before accessibility',()=>{
  assert.match(edge,/SECURITY_RESET_SOURCE\s*=\s*'\/test-bank-security-reset\.js'/);
  const hardening=edge.indexOf('/test-bank-adaptive-mastery-hardening.js');
  const security=edge.indexOf('scriptTag(SECURITY_RESET_SOURCE)');
  const ux=edge.indexOf('scriptTag(UX_ACCESSIBILITY_SOURCE)');
  assert.ok(hardening>=0&&security>hardening&&ux>security,{hardening,security,ux});
});

test('18 patched mastery export does not reference vulnerable jsPDF 2.5.2',()=>{
  assert.equal(source.includes('jspdf@2.5.2'),false);
  assert.match(source,/jspdf@4\.2\.1\/\+esm/);
  assert.match(source,/window\.addEventListener\('click',[\s\S]*data-v2-export[\s\S]*stopImmediatePropagation/);
});

test('18 destructive deletion requires exact second-step confirmation and authentication',async t=>{
  const h=harness();t.after(h.close);
  assertOutcome(await h.api.deleteLearningData({}),false,'confirmation-required');
  assert.equal(h.calls.length,0);
  h.setUser(null);
  assertOutcome(await h.api.deleteLearningData({confirm:'DELETE'}),false,'not-signed-in');
  assert.equal(h.calls.length,0);
});

test('18 acknowledged server deletion advances generation before local learner state is cleared',async t=>{
  const h=harness();t.after(h.close);const w=h.w;
  w.localStorage.setItem('tb-learning-events-v2','old-ledger');
  w.localStorage.setItem('tb-attempt-history-v3','old-history');
  w.localStorage.setItem('tb-adaptive-mastery-v1','old-mastery');
  w.localStorage.setItem('unrelated-setting','keep-me');
  const result=await h.api.deleteLearningData({confirm:'DELETE'});
  assert.equal(result.deleted,true);assert.equal(result.generation,3);
  assert.deepEqual(h.calls.map(x=>x.name),['fetch_test_bank_data_control_v1','delete_test_bank_learning_data_v1']);
  assert.equal(h.calls[1].args.p_expected_generation,2);
  assert.equal(w.localStorage.getItem('tb-learning-events-v2'),null);
  assert.equal(w.localStorage.getItem('tb-attempt-history-v3'),null);
  assert.equal(w.localStorage.getItem('tb-adaptive-mastery-v1'),null);
  assert.equal(w.localStorage.getItem('unrelated-setting'),'keep-me');
  const marker=JSON.parse(w.localStorage.getItem('tb-adaptive-security-control'));
  assert.equal(marker.purgeGeneration,3);assert.equal(w.localStorage.getItem('tb-security-purge-ack-v1'),'3');
});

test('18 RPC error never clears local data or reports deletion success',async t=>{
  const h=harness({rpc:async(name)=>name==='fetch_test_bank_data_control_v1'?{data:[{generation:4}],error:null}:{data:null,error:{message:'synthetic denial'}}});t.after(h.close);
  h.w.localStorage.setItem('tb-attempt-history-v3','preserve');
  const result=await h.api.deleteLearningData({confirm:'DELETE'});
  assert.equal(result.deleted,false);assert.equal(h.w.localStorage.getItem('tb-attempt-history-v3'),'preserve');
});

test('18 complete-history export is annotated with server-verified purge generation',async t=>{
  const h=harness();t.after(h.close);
  h.w.__TBLearning={exportHistory:async()=>({available:true,eventCount:2,events:[{id:'a'},{id:'b'}]})};
  h.w.document.dispatchEvent(new h.w.CustomEvent('upskill-test-learning-synced'));
  await tick();
  const payload=await h.w.__TBLearning.exportHistory({examId:'cssbb'});
  assert.equal(payload.eventCount,2);assert.equal(payload.securityControl.generation,2);assert.equal(payload.securityControl.verified,true);
});

test('18 database migration keeps purge authority owner-scoped and blocks stale resurrection',()=>{
  assert.match(migration,/create table if not exists public\.test_bank_data_control/i);
  assert.match(migration,/using \(user_id = \(select auth\.uid\(\)\)\)/i);
  assert.match(migration,/delete_test_bank_learning_data_v1\(p_expected_generation bigint\)/i);
  assert.match(migration,/STALE_DATA_GENERATION/);
  assert.match(migration,/STALE_LEARNING_EVENT_AFTER_PURGE/);
  assert.match(migration,/STALE_PROGRESS_GENERATION/);
  assert.match(migration,/security_generation bigint not null default 0/i);
  assert.match(migration,/delete from public\.test_bank_learning_events where user_id=uid/i);
  assert.match(migration,/delete from public\.test_bank_session_versions where user_id=uid/i);
  assert.match(migration,/delete from public\.test_bank_new_question_claims where user_id=uid/i);
  assert.match(migration,/test_bank_security_tombstone_payload_v1/);
});

test('18 legacy reservation compatibility is explicit while Segment 16 stays authoritative',()=>{
  assert.match(migration,/revoke execute on function public\.reserve_test_bank_new_questions\(text,text\[\]\) from authenticated/i);
  assert.match(compatibility,/grant execute on function public\.reserve_test_bank_new_questions\(text,text\[\]\) to authenticated/i);
  assert.match(compatibility,/Segment16 product UI uses reserve_test_bank_new_questions_v2/);
});
