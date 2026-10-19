'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {auditMockB}=require('../scripts/nppe-mock-b-whole-form-audit.cjs');
test('complete Mock B whole-form audit preserves 110/100/10, domain and topic coverage, independently held roles',()=>{
 const a=auditMockB();
 assert.deepEqual(a.failures,[],a.failures.join('; '));
 assert.equal(a.items,110);assert.equal(a.scored,100);assert.equal(a.experimental,10);
 assert.equal(a.scoredTopics,40);
 assert.deepEqual(a.unscoredIds,[282,296,320,337,349,355,382,386,389,390]);
 assert.deepEqual(a.domains,{I:[8,1],II:[20,2],III:[30,3],IV:[26,2],V:[8,1],VI:[8,1]});
 assert.equal(a.keys.reduce((x,y)=>x+y,0),110);
 assert.equal(a.keyLengthRanks.reduce((x,y)=>x+y,0),110);
 if(Math.max(...a.keyLengthRanks)>45)assert.ok(a.warnings.some(x=>x.includes('predictable length rank')));
 assert.equal(a.otherBanks.length,5);
 assert.deepEqual(a.otherBanks.map(x=>x.count),[110,120,50,110,110]);
 assert.ok(Array.isArray(a.nearDuplicateCandidates));
});
