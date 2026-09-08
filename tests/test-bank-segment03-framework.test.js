'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {gate,budget,lanes,profiles,digest}=require('../scripts/exam-reliability/evidence.cjs');
const {validateTarget}=require('../scripts/exam-reliability/run-database.cjs');
const sha='a'.repeat(40);
const records=()=>lanes.map(lane=>({lane,exactCommit:sha,status:'passed',tests:1,failures:0,skipped:0,environment:'isolated'}));
test('gate: missing/stale/failed/skipped evidence cannot produce green aggregate',()=>{
  assert.equal(gate(records(),sha).status,'passed');
  assert.throws(()=>gate(records().slice(1),sha),/Missing/);
  for(const patch of [{status:'failed'},{exactCommit:'b'.repeat(40)},{tests:0},{tests:null},{skipped:1},{failures:1},{environment:'physical_device'}]){const r=records();r[0]={...r[0],...patch};assert.throws(()=>gate(r,sha));}
  assert.throws(()=>gate([...records(),records()[0]],sha),/duplicate/);
});
test('budget: independent nearest-rank p95, inadequate samples and exceeded budgets fail',()=>{
  assert.equal(budget('quick_start',[],3).status,'not_due');
  assert.throws(()=>budget('quick_start',[100],19),/Insufficient/);
  assert.equal(budget('quick_start',Array(30).fill(1900),19).status,'passed');
  assert.equal(budget('quick_start',[...Array(28).fill(1900),2100,2200],19).status,'failed');
  assert.equal(budget('smoke_ready',[15001],3).status,'failed');
  assert.throws(()=>budget('unknown',[1],3));
});
test('safety: database runner rejects remote hosts, query overrides and arbitrary DB names',()=>{
  assert.equal(validateTarget('postgresql://postgres:test@127.0.0.1:5432/segment03_test','1').url.hostname,'127.0.0.1');
  for(const url of ['postgresql://x@production.example/segment03_test','postgresql://x@127.0.0.1/postgres','postgresql://x@127.0.0.1/segment03_test?host=production','file:///segment03_test'])assert.throws(()=>validateTarget(url,'1'));
  assert.throws(()=>validateTarget('postgresql://x@127.0.0.1/segment03_test','0'));
});
test('coverage: browser engines, all certifications, future modes and physical boundaries are explicit',()=>{
  assert.deepEqual(profiles.automation.map(x=>x.engine),['chromium','firefox','webkit','webkit']);
  assert.ok(profiles.automation.every(x=>x.physical===false));
  assert.equal(profiles.workloads.requiredExamIds.length,5);assert.equal(profiles.workloads.requiredModes.length,7);
  assert.ok(profiles.physicalAcceptance.length>=3);assert.equal(profiles.evidence.automaticRetries,0);
});

test('profiles: frozen v1 budgets require an explicit version/impact review to change',()=>{
  assert.equal(digest(path.join(__dirname,'../docs/exam-reliability/verification/v1/profiles.json')),'25bd172f0dee92d42ea9659b5dccbb2f9b919c3a0af22eb7d1b14ce03f19d8a8');
});
