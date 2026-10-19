'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {items}=require('../scripts/nppe-mock-b-review-packets.cjs');
const {analyze}=require('../scripts/nppe-calibrate.cjs');
function fixture(){
 const canon=items(),sourceRevision='mock-b-synthetic-test-revision';
 const keyed=canon.map(q=>({
  id:q.legacyId,qid:q.qid,version:q.version,
  sha256:crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex'),
  scored:q.scored,simulatedUnscored:q.experimental,answerIndex:q.answer
 }));
 const keyedPacket={sourceRevision,items:keyed};
 const digest=crypto.createHash('sha256').update(JSON.stringify(keyedPacket)).digest('hex');
 return {sourceRevision,manifest:{schema:'nppe-mock-b-review-v1',form:'set-1-mock-b',itemCount:110,scored:100,simulatedUnscored:10,sourceRevision,keyedPacketSha256:digest,items:keyed.map(({id,qid,version,sha256,scored,simulatedUnscored})=>({id,qid,version,sha256,scored,simulatedUnscored}))},keyed:keyedPacket};
}
function attempt(f,id,adjust){
 return {attemptId:id,cohort:'first_unassisted',formRevision:f.sourceRevision,
  responses:f.keyed.items.map((q,i)=>({itemId:q.id,version:q.version,status:'answered',answer:adjust?adjust(q,i):q.answerIndex,seconds:30}))};
}
test('Mock B version-pinned calibration fixtures preserve 100 scored and 10 simulated-unscored',()=>{
 const f=fixture();assert.equal(f.keyed.items.length,110);
 assert.equal(f.keyed.items.filter(q=>q.scored&&!q.simulatedUnscored).length,100);
 assert.equal(f.keyed.items.filter(q=>q.simulatedUnscored&&!q.scored).length,10);
 const responses=[
  attempt(f,'synthetic-1',(q,i)=>q.simulatedUnscored?(q.answerIndex+1)%4:q.answerIndex),
  attempt(f,'synthetic-2',(q,i)=>i<25?(q.answerIndex+1)%4:q.answerIndex),
  attempt(f,'synthetic-3',(q,i)=>i<55?(q.answerIndex+1)%4:q.answerIndex),
  attempt(f,'synthetic-4',(q,i)=>i<80?(q.answerIndex+1)%4:q.answerIndex)
 ];
 const result=analyze(f.manifest,f.keyed,responses);
 assert.equal(result.schema,'nppe-mock-b-calibration-v1');assert.equal(result.form,'set-1-mock-b');
 assert.equal(result.items.length,110);assert.equal(result.primaryAttempts,4);
 assert.equal(result.completeScoredAttempts,4);
 assert.equal(result.items.filter(x=>x.simulatedUnscored).length,10);
 const first=result.items.find(x=>x.itemId==='NPPE-282');
 assert.equal(first.simulatedUnscored,true);assert.equal(first.correctedItemRest,null);
 assert.ok(result.kr20!==null);
});
test('Mock B calibration rejects stale item versions and form revisions',()=>{
 const f=fixture(),good=attempt(f,'synthetic-1');
 assert.throws(()=>analyze(f.manifest,f.keyed,[{...good,formRevision:'stale'}]),/revision mismatch/i);
 const stale={...good,responses:good.responses.map((q,i)=>i===9?{...q,version:q.version+1}:q)};
 assert.throws(()=>analyze(f.manifest,f.keyed,[stale]),/Invalid item ID\/version/);
 const tampered={...f.manifest,items:f.manifest.items.map((q,i)=>i===0?{...q,sha256:'0'.repeat(64)}:q)};
 assert.throws(()=>analyze(tampered,f.keyed,[good]),/Manifest mismatch/);
});
test('Mock B cannot infer pilot reliability from a single synthetic case',()=>{
 const f=fixture(),r=analyze(f.manifest,f.keyed,[attempt(f,'synthetic-only')]);
 assert.equal(r.primaryAttempts,1);assert.equal(r.kr20,null);
 assert.ok(r.items.every(x=>x.correctedItemRest==null));
});

test('Mock B calibration fails closed on keyed tampering, role drift and duplicate manifest IDs',()=>{
 const f=fixture(),a=attempt(f,'synthetic-only');
 const altered={...f.keyed,items:f.keyed.items.map((q,i)=>i===0?{...q,answerIndex:(q.answerIndex+1)%4}:q)};
 assert.throws(()=>analyze(f.manifest,altered,[a]),/Keyed packet digest mismatch/);
 const roleChanged={...f.keyed,items:f.keyed.items.map((q,i)=>i===0?{...q,scored:false,simulatedUnscored:true}:q)};
 const updatedDigest=crypto.createHash('sha256').update(JSON.stringify(roleChanged)).digest('hex');
 assert.throws(()=>analyze({...f.manifest,keyedPacketSha256:updatedDigest},roleChanged,[a]),/Scoring role mismatch/);
 const duplicated={...f.manifest,items:[f.manifest.items[0],...f.manifest.items.slice(0,-1)]};
 assert.throws(()=>analyze(duplicated,f.keyed,[a]),/Expected 110 unique/);
 assert.throws(()=>analyze({...f.manifest,keyedPacketSha256:undefined},f.keyed,[a]),/requires keyed packet/);
});
