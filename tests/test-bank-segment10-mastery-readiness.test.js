'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const P=require('../test-bank-metrics-policy.js');
const DAY=86400000;
const NOW=Date.UTC(2026,8,9,3,0,0);

function q(id,sub){return {qid:'cssbb:s10:'+id,sub};}
function state(attempts,correct,streak,ageDays=0,extra={}){
  return Object.assign({attempts,correct,streak,lastSeenAt:NOW-ageDays*DAY,dueAt:NOW+DAY},extra);
}
function fixture(overrides={}){
  const questions=overrides.questions||[q('a','a'),q('b','a'),q('c','b'),q('d','b')];
  const states=overrides.states||new Map();
  const bok=overrides.bok||[
    {domain:'A',subs:[{id:'a',name:'A',w:80}]},
    {domain:'B',subs:[{id:'b',name:'B',w:20}]}
  ];
  return P.summarize({questions,bok,timestamp:NOW,stateFor:x=>states.get(x.qid)||{},evidenceCounts:overrides.evidenceCounts});
}

test('10 retained mastery coefficients reproduce frozen fresh-correct sequence',()=>{
  assert.equal(P.POLICY_VERSION,'baseline-confidence-v1');
  assert.deepEqual([1,2,3,4,5].map(n=>P.effectiveMastery(state(n,n,n))),[57,68,80,92,100]);
});

test('10 raw and blueprint-weighted question coverage are distinct with unequal weights',()=>{
  const questions=[q('a1','a'),q('a2','a'),q('b1','b'),q('b2','b')];
  const states=new Map([[questions[0].qid,state(1,1,1)],[questions[1].qid,state(1,1,1)]]);
  const out=fixture({questions,states});
  assert.equal(out.rawCoverage,50);
  assert.equal(out.weightedCoverage,80);
  assert.equal(out.coverage,80);
  assert.equal(out.attempted,2);
  assert.equal(out.total,4);
});

test('10 reservation delivery and display counts cannot increase coverage or readiness',()=>{
  const evidenceCounts={reserved:4,delivered:4,displayed:4,answered:0,mastered:0,reviews:0,notebookMistakes:0};
  const out=fixture({evidenceCounts});
  assert.equal(out.rawCoverage,0);assert.equal(out.weightedCoverage,0);assert.equal(out.readiness,0);
  assert.deepEqual(out.counts,evidenceCounts);
});

test('10 unattempted domains contribute zero readiness rather than disappearing from denominator',()=>{
  const questions=[q('a1','a'),q('a2','a'),q('b1','b'),q('b2','b')];
  const states=new Map([[questions[0].qid,state(5,5,5)],[questions[1].qid,state(5,5,5)]]);
  const out=fixture({questions,states});
  assert.equal(out.domains.find(d=>d.id==='A').readiness,100);
  assert.equal(out.domains.find(d=>d.id==='B').readiness,0);
  assert.equal(out.readiness,80);
});

test('10 blanks do not become answered interactions, coverage, mastery or mistakes',()=>{
  const questions=[q('a1','a'),q('b1','b')];
  const out=fixture({questions,evidenceCounts:{reserved:2,delivered:2,displayed:2,answered:0,mastered:0,reviews:0,notebookMistakes:0}});
  assert.equal(out.attempted,0);assert.equal(out.answers,0);assert.equal(out.mastered,0);assert.equal(out.rawCoverage,0);
});

test('10 repeated accepted answers change mastery evidence without inflating unique coverage',()=>{
  const questions=[q('a1','a'),q('b1','b')];
  const one=new Map([[questions[0].qid,state(1,1,1)]]);
  const five=new Map([[questions[0].qid,state(5,5,5)]]);
  const a=fixture({questions,states:one}),b=fixture({questions,states:five});
  assert.equal(a.rawCoverage,b.rawCoverage);assert.equal(a.attempted,b.attempted);
  assert.ok(b.attemptedMastery>a.attemptedMastery);assert.equal(a.answers,1);assert.equal(b.answers,5);
});

test('10 aging reduces retained mastery and readiness without changing coverage',()=>{
  const questions=[q('a1','a'),q('b1','b')];
  const fresh=new Map([[questions[0].qid,state(5,5,5,0)]]);
  const stale=new Map([[questions[0].qid,state(5,5,5,45)]]);
  const a=fixture({questions,states:fresh}),b=fixture({questions,states:stale});
  assert.equal(a.rawCoverage,b.rawCoverage);assert.ok(a.readiness>b.readiness);assert.ok(a.attemptedMastery>b.attemptedMastery);
});

test('10 missing or future answer time makes mastery/readiness unavailable instead of inventing age',()=>{
  const questions=[q('a1','a'),q('b1','b')];
  for(const lastSeenAt of [0,NOW+1]){
    const states=new Map([[questions[0].qid,{attempts:3,correct:3,streak:3,lastSeenAt,dueAt:null}]]);
    const out=fixture({questions,states});
    assert.equal(out.attemptedMastery,null);assert.equal(out.readiness,null);assert.equal(out.unknownMastery,1);
    assert.equal(out.metrics.readiness.complete,false);assert.equal(out.metrics.readiness.unknownEvidenceCount,1);
  }
});

test('10 unknown due date is not automatically due and is disclosed separately',()=>{
  const questions=[q('a1','a'),q('b1','b')];
  const states=new Map([[questions[0].qid,state(3,3,3,0,{dueAt:null})]]);
  const out=fixture({questions,states});
  assert.equal(out.due,0);assert.equal(out.unknownDue,1);assert.equal(out.metrics.dueQuestions.complete,false);
});

test('10 current-bank changes change coverage denominator but not accepted answer count',()=>{
  const q1=q('a1','a'),q2=q('b1','b'),q3=q('a2','a');
  const states=new Map([[q1.qid,state(1,1,1)]]);
  const before=fixture({questions:[q1,q2],states});
  const after=fixture({questions:[q1,q2,q3],states});
  assert.equal(before.attempted,after.attempted);assert.equal(before.answers,after.answers);
  assert.notEqual(before.rawCoverage,after.rawCoverage);
});

test('10 invalid mappings and zero-weight blueprints fail closed instead of silently equal weighting',()=>{
  assert.throws(()=>fixture({questions:[q('x','missing')]}),/outside blueprint/);
  assert.throws(()=>fixture({bok:[{domain:'A',subs:[{id:'a',w:0}]},{domain:'B',subs:[{id:'b',w:0}]}]}),/positive total/);
  assert.throws(()=>fixture({questions:[q('b','b')],bok:[{domain:'A',subs:[{id:'a',w:80}]},{domain:'B',subs:[{id:'b',w:20}]}]}),/no current-bank pool: A/);
});

test('10 metric envelopes expose formula version denominator timestamp and completeness',()=>{
  const out=fixture();
  for(const m of Object.values(out.metrics)){
    assert.equal(m.contractVersion,'1.0.0');assert.equal(m.formulaVersion,'baseline-confidence-v1');
    assert.equal(m.evaluatedAt,new Date(NOW).toISOString());assert.ok('denominator' in m);assert.ok('numerator' in m);assert.ok('complete' in m);
  }
  assert.equal(out.metrics.rawCoverage.denominator,4);
});

test('10 study priority is a blueprint-weighted gap heuristic with deterministic blueprint tie order',()=>{
  const out=fixture();
  assert.equal(out.studyPriority[0].id,'A');
  assert.equal(out.studyPriority[1].id,'B');
  assert.ok(out.studyPriority.every(x=>!Object.hasOwn(x,'gainPerHour')));
});

test('10 review and notebook counts remain separate evidence classes',()=>{
  const counts={reserved:9,delivered:8,displayed:7,answered:0,mastered:0,reviews:6,notebookMistakes:5};
  const out=fixture({evidenceCounts:counts});
  assert.equal(out.counts.reviews,6);assert.equal(out.counts.notebookMistakes,5);assert.equal(out.attempted,0);assert.equal(out.coverage,0);
});
