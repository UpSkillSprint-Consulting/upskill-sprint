'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const V=require('../test-bank-versioning.js');
const {makeSandbox}=require('./helpers/segment01-sandbox.cjs');
const copy=x=>JSON.parse(JSON.stringify(x));
function original(examId='cssbb') {
  const q={qid:examId+':s09:identity',sub:'one',stem:'Synthetic identity fixture',options:['A','B'],answer:0};
  const exam={questions:1,minutes:1,pass:70,sets:{1:[q]},bok:[{domain:'domain',subs:[{id:'one',name:'Original domain',w:1}]}]};
  const catalog=V.createExamCatalog(examId,exam,{source:'synthetic scope fixture'});
  const pin=V.pin({examId,sessionId:'identity-'+examId,questions:[q],setId:'1',mode:'exam',timed:true,limitSeconds:60,startedAt:Date.UTC(2026,8,8)},exam,catalog);
  const grading=V.grade(pin,[{question:q,selected:0}]);
  return {id:pin.sessionId,examId,total:1,correct:1,mode:'exam',timed:true,completed:true,at:Date.UTC(2026,8,8),versionPin:V.reference(pin),grading};
}
test('09 saved result identity cannot be attached to a different session or certification',()=>{
  const base=original();assert.equal(V.assessAttempt(base,'cssbb').eligible,true);
  for(const change of [x=>x.id='foreign',x=>x.sessionId='foreign',x=>x.examId='cqe',x=>x.grading.resultId='foreign:original',x=>x.versionPin.sessionId='foreign']) {
    const x=copy(base);change(x);const before=JSON.stringify(x),view=V.assessAttempt(x,'cssbb');
    assert.equal(view.available,false);assert.equal(view.eligible,false);assert.ok(view.diagnostic);assert.equal(JSON.stringify(x),before);
  }
  assert.equal(V.assessAttempt(original('mbb'),'cssbb').available,false);
  const x=copy(base);x.versionPin.pinDigest='different';assert.equal(V.assessAttempt(x).available,false);
});
test('09 a completed flag cannot override a created, cancelled or nonterminal state',()=>{
  const a=original();for(const state of ['created','in_progress','paused','finalizing','abandoned','cancelled','canceled']) {
    const g=V.assessAttempt({...a,state});assert.equal(g.available,false,state);assert.equal(g.eligible,false,state);
  }
  assert.equal(V.assessAttempt({...a,state:'expired',completedReason:'timed-out'}).eligible,true);
});
test('09 certification-scoped analytics withhold a valid grade stored under the wrong certification',()=>{
  const s=makeSandbox();['test-bank-question-registry.js','test-bank-adaptive-mastery.js','test-bank-adaptive-mastery-hardening.js','test-bank-analytics-dashboard.js'].forEach(s.load);
  const valid=original(),foreign=original('mbb');s.setExamData({attempts:[valid,foreign]});
  const before=s.localStorage.getItem('tb-adaptive-mastery-v1');
  assert.equal(s.context.__TBAnalyticsDashboard.examAttemptSeries().length,1);
  const trend=s.context.__TBAnalyticsDashboard.sessionTrend();
  assert.equal(trend.filter(x=>x.available).length,1);
  assert.equal(trend.filter(x=>!x.available&&x.scorePercent===null).length,1);
  assert.equal(s.localStorage.getItem('tb-adaptive-mastery-v1'),before);
});
