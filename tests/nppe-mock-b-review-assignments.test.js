'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {items}=require('../scripts/nppe-mock-b-review-packets.cjs');
const {prepareAssignments,legalPool,historicalCueIds,pools}=require('../scripts/nppe-mock-b-review-assignments.cjs');
function fixture(){
 const questions=items(),sourceRevision='a'.repeat(40);
 const manifest={form:'set-1-mock-b',sourceRevision,items:questions.map(q=>({
  id:q.legacyId,qid:q.qid,version:q.version,
  sha256:crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex'),
  scored:q.scored,simulatedUnscored:q.experimental}))};
 return {questions,manifest};
}
test('110 reviewer assignment records match exact item versions/hashes, without pretending to assign humans',()=>{
 const {questions,manifest}=fixture(),p=prepareAssignments(questions,manifest);
 assert.equal(p.rows.length,110);assert.equal(p.queue.length,111);
 assert.equal(p.blind.length,111);assert.equal(p.roster.length,pools.length+1);
 assert.deepEqual(p.counts,{'L-CAN':85,'L-ON':11,'L-QC':4,'L-SK':3,'L-BC':7});
 for(let i=1;i<p.queue.length;i++){
  const r=p.queue[i],m=manifest.items[i-1];
  assert.equal(r[0],m.id);assert.equal(r[1],m.qid);
  assert.equal(r[2],m.version);assert.equal(r[3],m.sha256);
  assert.deepEqual(r.slice(14,19),Array(5).fill('unassigned'));
  assert.deepEqual(r.slice(19,25),Array(6).fill('pending'));
  assert.equal(r[26],'pending');
 }
 assert.ok(p.roster.slice(1).every(x=>x[4]===''&&x[13]==='unassigned'));
 assert.ok(p.rows.every(x=>x.stage==='awaiting_reviewer_assignment'));
});
test('eight historical cue items remain prioritized without external approval',()=>{
 const {questions,manifest}=fixture(),p=prepareAssignments(questions,manifest);
 const ids=p.rows.filter(x=>x.priorityReason==='historical_cue_author_revised').map(x=>Number(x.id.slice(5)));
 assert.deepEqual(ids,[...historicalCueIds].sort((a,b)=>a-b));
 assert.ok(p.rows.some(x=>x.priorityReason==='legal_source_priority'));
 assert.ok(!p.blind[0].includes('correctOption'));
});
test('provincial legal routing and stale-version rejection are fail closed',()=>{
 assert.equal(legalPool('Québec private law'),'L-QC');
 assert.equal(legalPool('Ontario construction'),'L-ON');
 assert.equal(legalPool('Saskatchewan profession'),'L-SK');
 assert.equal(legalPool('British Columbia regulator'),'L-BC');
 assert.equal(legalPool('Canada federal statute'),'L-CAN');
 const {questions,manifest}=fixture();
 assert.throws(()=>prepareAssignments(questions,{...manifest,sourceRevision:'notcommit'}),/pinned Mock B/);
 assert.throws(()=>prepareAssignments(questions.slice(1),manifest),/110 source items/);
 const modified={...manifest,items:manifest.items.map((x,i)=>i===7?{...x,sha256:'0'.repeat(64)}:x)};
 assert.throws(()=>prepareAssignments(questions,modified),/Changed or unpinned/);
});
