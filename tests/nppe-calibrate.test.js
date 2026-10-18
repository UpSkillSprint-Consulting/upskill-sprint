'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {analyze,wilson,correlation}=require('../scripts/nppe-calibrate.cjs');
const mk=()=>{
 const items=Array.from({length:110},(_,i)=>({id:'NPPE-'+(171+i),version:1,sha256:String(i).padStart(64,'0'),scored:i<100,simulatedUnscored:i>=100,answerIndex:i%4}));
 return {manifest:{sourceRevision:'synthetic-fixture',items},keyed:{items},responses:items.map(q=>({itemId:q.id,version:1,status:'answered',answer:q.answerIndex,seconds:12}))};
};
test('synthetic first-attempt analysis excludes experimental questions from reliability',()=>{
 const x=mk(),attempts=[0,1,2,3].map(i=>({attemptId:'synthetic-'+i,cohort:'first_unassisted',formRevision:'synthetic-fixture',responses:x.responses.map((r,j)=>({...r,answer:j<i*25?(r.answer+1)%4:r.answer}))}));
 const r=analyze(x.manifest,x.keyed,attempts);
 assert.equal(r.primaryAttempts,4);assert.equal(r.items.length,110);
 assert.equal(r.items[0].nAnswered,4);assert.equal(r.completeScoredAttempts,4);
 assert.equal(r.items[109].correctedItemRest,null);assert.equal(r.items[109].simulatedUnscored,true);
 assert.equal(r.items[0].distractorCounts.reduce((a,b)=>a+b,0),4);
 assert.ok(r.kr20!==null);
});
test('tiny samples and zero variance yield undefined correlation/reliability rather than zero',()=>{
 const x=mk(),a={attemptId:'synthetic-one',cohort:'first_unassisted',formRevision:'synthetic-fixture',responses:x.responses};
 const r=analyze(x.manifest,x.keyed,[a]);assert.equal(r.kr20,null);assert.equal(r.items[0].correctedItemRest,null);
 assert.equal(correlation([1,1,1],[1,2,3]),null);
 assert.deepEqual(wilson(0,0),null);
});
test('rejects duplicate IDs, wrong revision, answer and statuses',()=>{
 const x=mk(),a={attemptId:'a',cohort:'first_unassisted',formRevision:'synthetic-fixture',responses:x.responses};
 assert.throws(()=>analyze(x.manifest,x.keyed,[a,a]),/duplicate attemptId/);
 assert.throws(()=>analyze(x.manifest,x.keyed,[{...a,formRevision:'other'}]),/revision mismatch/);
 assert.throws(()=>analyze(x.manifest,x.keyed,[{...a,responses:[...x.responses.slice(1),{...x.responses[0],answer:7}]}]),/Invalid selected answer/);
});
test('omitted and not reached remain distinct; repeats are excluded',()=>{
 const x=mk(),r=x.responses.map((v,i)=>i===0?{...v,status:'omitted',answer:null}:i===1?{...v,status:'not_reached',answer:null}:v);
 const a={attemptId:'a',cohort:'first_unassisted',formRevision:'synthetic-fixture',responses:r},b={...a,attemptId:'b',cohort:'repeat'};
 const v=analyze(x.manifest,x.keyed,[a,b]);
 assert.equal(v.primaryAttempts,1);assert.equal(v.excluded.length,1);assert.equal(v.items[0].omitted,1);assert.equal(v.items[1].notReached,1);
 assert.equal(v.completeScoredAttempts,0);assert.equal(v.kr20,null);
});

test('item-rest correlations exclude partial scored forms, not count missing as wrong',()=>{
 const x=mk();
 const full=(n)=>({attemptId:'complete-'+n,cohort:'first_unassisted',formRevision:'synthetic-fixture',responses:x.responses.map((r,j)=>({...r,answer:(j<25*n?(r.answer+1)%4:r.answer)}))});
 const incomplete={...full(0),attemptId:'missing',responses:x.responses.map((r,j)=>j===4?{...r,status:'omitted',answer:null}:r)};
 const r=analyze(x.manifest,x.keyed,[full(0),full(1),full(2),incomplete]);
 assert.equal(r.primaryAttempts,4);assert.equal(r.completeScoredAttempts,3);
 assert.equal(r.items[0].correctedItemRestN,3);
 assert.equal(r.items[4].nAnswered,3);
 assert.equal(r.items[4].correctedItemRestN,3);
});
