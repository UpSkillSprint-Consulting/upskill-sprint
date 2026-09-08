'use strict';
// Independent expectations exercise the real shared implementation, not the
// Segment 02 specification model. No production accounts, data or requests.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {live,read}=require('./helpers/segment04-identity.cjs');
const {installDurableLearning}=require('./helpers/test-bank-durable-learning.js');
const {makeSandbox}=require('./helpers/segment01-sandbox.cjs');
const {readExams}=require('../scripts/exam-reliability/build-catalog.cjs');
const V=require('../test-bank-versioning.js');
const plain=x=>JSON.parse(JSON.stringify(x));
const STAMP=Date.UTC(2026,8,8,12);
const IDS=['cssbb','cqe','mbb','cssgb','cmq'];
function fixture({count=3,target=70,mode='exam',timed=true,id='cssbb',sessionId='segment09-fixture'}={}) {
  const questions=Array.from({length:count},(_,i)=>({qid:`${id}:segment09:${i}`,sub:i%2?'two':'one',stem:'Synthetic question '+i,options:['A','B','C','D'],answer:i%4,why:'Synthetic rationale.'}));
  const exam={questions:count,minutes:10,pass:target,sets:{1:questions},bank:questions,bok:[{domain:'first',subs:[{id:'one',name:'Original first subtopic',w:1}]},{domain:'second',subs:[{id:'two',name:'Original second subtopic',w:1}]}]};
  const catalog=V.createExamCatalog(id,exam,{source:'independent Segment 09 fixture'});
  const pin=V.pin({examId:id,sessionId,questions,setId:'1',mode,timed,limitSeconds:timed?600:null,startedAt:STAMP},exam,catalog);
  const records=questions.map((question,i)=>({question,selected:i===0?question.answer:i===1?(question.answer+1)%4:null}));
  return {questions,exam,catalog,pin,records};
}
function attempt(f,extra={}) {
  const grading=V.grade(f.pin,f.records);
  return {id:f.pin.sessionId,at:STAMP,mode:f.pin.mode,timed:f.pin.timed,completed:true,total:grading.total,correct:grading.correct,versionPin:V.reference(f.pin),grading,...extra};
}
function analytics() {
  const s=makeSandbox();['test-bank-question-registry.js','test-bank-adaptive-mastery.js','test-bank-adaptive-mastery-hardening.js','test-bank-analytics-dashboard.js'].forEach(s.load);
  return s;
}
async function ui(t) {
  const f=await live();t.after(()=>f.dom.window.close());
  await installDurableLearning(f.w);
  for(const name of ['test-bank-history-reconciliation.js','test-bank-adaptive-mastery.js','test-bank-adaptive-mastery-hardening.js','test-bank-analytics-dashboard.js','test-bank-feedback-loop.js'])f.w.eval(read(name));
  if(!f.w.Element.prototype.scrollIntoView)f.w.Element.prototype.scrollIntoView=function(){};
  return f;
}
const settle=w=>new Promise(resolve=>w.requestAnimationFrame(()=>w.requestAnimationFrame(resolve)));

const examples=JSON.parse(read('docs/exam-reliability/contracts/v1/worked-examples.json')).examples.filter(e=>e.function==='gradeCounts');
for(const e of examples)test('09 frozen independent grading example '+e.id,()=>{
  const g=V.scoreCounts(e.given,e.given.targetBps);
  const actual={scorePct:g.scorePercent,displayPct:g.scorePercent==null?null:Math.round(g.scorePercent),meetsTarget:g.siteTargetMet,marginPct:g.margin,bucket:V.scoreBucket(g)};
  for(const [key,value]of Object.entries(e.expected))if(typeof value==='number')assert.ok(Math.abs(actual[key]-value)<1e-10,`${e.id}/${key}`);else assert.equal(actual[key],value,e.id+'/'+key);
});
for(const total of [100,110,150,160,165,175])test(`09 exhaustive score/target/bucket boundaries for ${total} items`,()=>{
  for(let correct=0;correct<=total;correct++)for(const bps of [0,6500,7000,8000,9999,10000,null]) {
    const result=V.scoreCounts({correct,total},bps);
    assert.equal(result.siteTargetMet,bps===null?null:correct*10000>=total*bps);
    assert.equal(result.scorePercent,100*correct/total);
    const thresholds=[50,60,70,80,90];let bucket=thresholds.findIndex(p=>correct*100<total*p);if(bucket===-1)bucket=5;
    assert.equal(V.scoreBucket(result),bucket);
    if(bps!==null)assert.ok(Math.abs(result.margin-(correct*10000-total*bps)/(total*100))<1e-12);
  }
});
test('09 safe-integer counts cannot cross a target or histogram edge through floating rounding',()=>{
  const total=Number.MAX_SAFE_INTEGER,correct=6305039478318693; // floor(total*0.7), still below the exact edge
  const result=V.scoreCounts({total,correct},7000);
  assert.equal(BigInt(correct)*10n<BigInt(total)*7n,true);
  assert.equal(result.siteTargetMet,false);assert.ok(result.margin<0);assert.equal(V.scoreBucket(result),2);
});
test('09 invalid count/target inputs are rejected, not clamped, coerced or divided by zero',()=>{
  for(const input of [{correct:-1,total:3},{correct:4,total:3},{correct:1.5,total:3},{correct:'1',total:3},{correct:true,total:3},{correct:0,total:Infinity},{correct:0,total:Number.MAX_SAFE_INTEGER+1},{correct:1,total:3,incorrect:0,unanswered:0}])assert.throws(()=>V.scoreCounts(input,7000));
  for(const target of [undefined,'7000',7000.5,-1,10001,NaN])assert.throws(()=>V.scoreCounts({correct:1,total:2},target));
  assert.deepEqual(V.scoreCounts({correct:0,total:0},7000),{correct:0,total:0,scorePercent:null,siteTargetBps:7000,siteTargetMet:null,margin:null});
  assert.equal(V.formatScore(null),'Unavailable');assert.equal(V.formatScore(50),'50%');assert.equal(V.formatScore(115/165*100),'69.7%');
});
test('09 one single-select classifier handles keys, changed/cleared selection and invalid options',()=>{
  const q=fixture().questions[0];assert.equal(V.classify(q,0),'correct');assert.equal(V.classify(q,1),'incorrect');assert.equal(V.classify(q,null),'unanswered');
  for(const selected of [-1,4,'0',true,0.5])assert.throws(()=>V.classify(q,selected));
  assert.throws(()=>V.classify({...q,answer:4},null));
  const f=fixture(),groups=V.scoreRecords(f.records,f.pin.configuration),grade=V.grade(f.pin,f.records);
  for(const key of ['correct','incorrect','unanswered','total','byDomain'])assert.deepEqual(groups[key],grade[key]);
  assert.deepEqual(groups.bySubtopic.one,{total:2,correct:1,incorrect:0,unanswered:1});
  assert.throws(()=>V.aggregateStatuses([{status:'guessed'}]));assert.throws(()=>V.aggregateStatuses([{status:'correct',subId:'__proto__'}]));
});
test('09 exact original grade remains immutable, rejects missing/duplicated/reordered items',()=>{
  const f=fixture(),g=V.grade(f.pin,f.records);assert.equal(Object.isFrozen(g.byDomain.first),true);
  const copied=plain(f.records);copied[0].question.answer=3;copied[0].status='incorrect';
  assert.deepEqual(V.grade(f.pin,copied),g,'the original pin, not the current supplied key/status, is authoritative');
  for(const records of [f.records.slice(0,2),f.records.slice().reverse(),[f.records[0],f.records[0],f.records[2]]])assert.throws(()=>V.grade(f.pin,records));
  assert.equal(g.correct+g.incorrect+g.unanswered,g.total);
});
test('09 original full-exam target, length, labels and margin ignore changed current configuration',()=>{
  const f=fixture({count:165}),records=f.questions.map((question,i)=>({question,selected:i<115?question.answer:null}));f.records=records;
  const a=attempt(f),s=analytics();s.setExamData({attempts:[a]});
  const first=plain(s.context.__TBAnalyticsDashboard.examAttemptSeries());assert.equal(first.length,1);
  s.exam.pass=0;s.exam.questions=1;s.exam.bok[0].domain='reclassified';
  assert.deepEqual(plain(s.context.__TBAnalyticsDashboard.examAttemptSeries()),first);
  assert.equal(first[0].siteTargetMet,false);assert.ok(first[0].margin<0);assert.equal(first[0].pct,70);
  assert.deepEqual(plain(s.context.__TBAnalyticsDashboard.scoreBuckets(first)).map(b=>b.count),[0,0,1,0,0,0]);
});
test('09 unknown legacy scores remain available without fabricated full-exam eligibility or target',()=>{
  const a={id:'legacy',mode:'exam',timed:true,completed:true,total:165,correct:115,at:STAMP};
  const s=analytics();s.setExamData({attempts:[a]});const before=s.localStorage.getItem('tb-adaptive-mastery-v1');
  assert.equal(s.context.__TBAnalyticsDashboard.examAttemptSeries().length,0);
  const legacy=plain(s.context.__TBAnalyticsDashboard.legacyExamAttempts());assert.equal(legacy.length,1);assert.equal(legacy[0].scorePercent,100*115/165);assert.equal(legacy[0].siteTargetBps,null);assert.equal(legacy[0].margin,null);assert.equal(legacy[0].expectedLength,null);
  s.exam.pass=50;s.exam.questions=165;assert.deepEqual(plain(s.context.__TBAnalyticsDashboard.legacyExamAttempts()),legacy);
  assert.equal(s.localStorage.getItem('tb-adaptive-mastery-v1'),before,'rendering cannot rewrite old evidence');
});
test('09 cancelled, unfinished, quick, adaptive and untimed sessions never enter the full-exam trend',()=>{
  const base=attempt(fixture());assert.equal(V.assessAttempt(base).eligible,true);
  for(const patch of [{completed:false},{state:'abandoned'},{state:'finalizing'},{completedReason:'cancelled'}]){const g=V.assessAttempt({...base,...patch});assert.equal(g.eligible,false);assert.equal(g.available,false);}
  for(const mode of ['quick','focus','diagnostic','practice','adaptive']){const f=fixture({mode,timed:mode!=='adaptive'});assert.equal(V.assessAttempt(attempt(f)).eligible,false);}
  assert.equal(V.assessAttempt(attempt(fixture({timed:false}))).eligible,false);
  assert.equal(V.assessAttempt({...base,completed:false,state:'expired'}).eligible,false,'conflicting terminal fields require reconciliation');
  assert.equal(V.assessAttempt({...base,completed:true,state:'expired',completedReason:'timed-out'}).eligible,true);
});
test('09 corrupt grading metadata fails visibly instead of silently reinterpreting counts',()=>{
  const base=attempt(fixture());
  for(const mutate of [a=>a.grading.correct=3,a=>a.grading.byDomain.first.total=8,a=>a.grading.siteTargetMet=true,a=>a.versionPin.siteTargetBps=0,a=>a.versionPin.gradingPolicyVersion='other',a=>a.grading.expectedLength=175,a=>a.timed=false]){
    const x=plain(base);mutate(x);const g=V.assessAttempt(x);assert.equal(g.available,false);assert.equal(g.eligible,false);assert.ok(g.diagnostic);
  }
});
test('09 complete original groups survive cache compaction; incomplete evidence does not become a 100% score',()=>{
  const f=fixture(),a=attempt(f),s=analytics(),groups=V.scoreRecords(f.records,f.pin.configuration).bySubtopic;
  a.domainBreakdown=Object.entries(groups).map(([id,c])=>({id,name:'Pinned '+id,...c}));s.setExamData({attempts:[a],questions:{}});s.context.__TBLearning={eventsForExam:()=>[]};
  const out=plain(s.context.__TBAnalyticsDashboard.latestExamDomainBreakdown());assert.equal(out.reduce((n,d)=>n+d.total,0),3);assert.equal(out.find(d=>d.id==='one').scorePercent,50);
  const invalid=plain(a);delete invalid.grading;invalid.domainBreakdown=[{id:'one',total:1,correct:1}];s.setExamData({attempts:[invalid],questions:{}});
  assert.equal(s.context.__TBAnalyticsDashboard.latestExamDomainBreakdown().length,0,'one answered item must not replace a three-item denominator');
});
test('09 duplicated versioned completion IDs are not double-counted; complete original grade is the fallback',()=>{
  const f=fixture(),a=attempt(f),s=analytics();s.setExamData({attempts:[a]});
  const answers=[0,0,2].map(i=>({questionId:f.questions[i].qid,sub:f.questions[i].sub,selected:null,status:'unanswered'}));
  s.context.__TBLearning={eventsForExam:()=>[{id:'bad',type:'session_completed',sessionId:a.id,occurredAt:STAMP,payload:{total:3,correct:1,versionPin:a.versionPin,grading:a.grading,answers}}]};
  const rows=plain(s.context.__TBAnalyticsDashboard.latestExamDomainBreakdown());assert.equal(rows.reduce((n,x)=>n+x.total,0),3);assert.equal(rows.reduce((n,x)=>n+x.correct,0),1);
});
test('09 all published certifications and set lengths agree across grade, subtopics and full-exam qualification',async()=>{
  const exams=await readExams();let sets=0;
  for(const id of IDS){const exam=exams[id],catalog=V.createExamCatalog(id,exam,{source:'independent all-published-sets test'});
    for(const [setId,pool]of Object.entries(exam.sets)){
      const count=exam.fullExamQuestionsBySet?.[setId]||exam.questions,questions=pool.slice(0,count);assert.equal(questions.length,count,id+'/'+setId+' enough published items');
      const pin=V.pin({examId:id,sessionId:`s09-${id}-${setId}`,questions,setId,mode:'exam',timed:true,limitSeconds:1000,startedAt:STAMP},exam,catalog);
      const records=questions.map((question,i)=>({question,selected:i%3===0?question.answer:i%3===1?(question.answer+1)%question.options.length:null}));
      const g=V.grade(pin,records),groups=V.scoreRecords(records,pin.configuration);
      assert.equal(g.total,count);assert.equal(g.correct,Math.ceil(count/3));assert.equal(g.incorrect,Math.floor((count+1)/3));assert.equal(g.unanswered,Math.floor(count/3));
      assert.deepEqual(g.byDomain,groups.byDomain);assert.equal(Object.values(groups.bySubtopic).reduce((n,d)=>n+d.total,0),count);
      assert.equal(V.assessAttempt({completed:true,total:g.total,correct:g.correct,mode:'exam',timed:true,versionPin:V.reference(pin),grading:g}).eligible,true);sets++;
      if(id==='mbb'&&['2','3'].includes(setId))assert.equal(g.expectedLength,175);
    }
  }assert.ok(sets>=10);
});
for(const id of IDS)test('09 shipped '+id+' UI, history and review agree on exact counts in all core modes',async t=>{
  const {w,errors}=await ui(t);const exam=w.__TB.EXAMS[id],questions=exam.sets[1].slice(0,3),keys=questions.map(q=>q.answer);
  w.document.querySelector(`.tb-tile[data-exam="${id}"]`).click();
  for(const mode of ['quick','focus','diagnostic','practice','exam']){
    assert.equal(w.__TBSegment04Probe.begin(exam,questions,mode,mode==='exam',mode==='exam'?600:null),true);
    w.document.querySelector('[data-opt="'+keys[0]+'"]').click();
    w.document.querySelector('[data-goto="1"]').click();w.document.querySelector('[data-opt="'+((keys[1]+1)%questions[1].options.length)+'"]').click();
    w.document.querySelector('[data-goto="2"]').click();w.document.querySelector('[data-submit]').click();
    await settle(w);
    const displayed=w.document.querySelector('[data-score-result]');assert.ok(displayed,mode);assert.equal(displayed.dataset.targetMet,'false');assert.match(displayed.textContent,/33\.33%/);assert.match(displayed.textContent,/1\/3/);assert.match(displayed.textContent,/1 incorrect.*1 unanswered/);
    const snapshot=w.__TB.getFeedbackSnapshot();assert.deepEqual([snapshot.grading.total,snapshot.grading.correct,snapshot.grading.incorrect,snapshot.grading.unanswered],[3,1,1,1]);
    const fractions=[...w.document.querySelector('.tb-breakdown').textContent.matchAll(/\((\d+)\/(\d+)\)/g)].map(x=>[Number(x[1]),Number(x[2])]);
    assert.ok(fractions.length>0,mode+' visible exact fractions');assert.equal(fractions.reduce((n,x)=>n+x[0],0),1);assert.equal(fractions.reduce((n,x)=>n+x[1],0),3);
    const done=w.__TBLearning.eventsForExam(id).filter(e=>e.type==='session_completed').at(-1);const history=w.__TBAdaptiveMastery.store().exams[id].attempts.find(a=>a.id===done.sessionId);
    assert.ok(history);assert.deepEqual([history.total,history.correct],[3,1]);assert.equal(history.domainBreakdown.reduce((n,d)=>n+d.total,0),3);
    const initialEvents=w.__TBLearning.eventsForExam(id).length;
    const review=w.document.querySelector('[data-open-review="all"]');assert.ok(review);review.click();await settle(w);
    const cards=Array.from(w.document.querySelectorAll('.tb-review-card')).map(x=>x.dataset.reviewStatus).sort();assert.deepEqual(cards,['correct','incorrect','unanswered']);
    assert.equal(w.__TBLearning.eventsForExam(id).length,initialEvents,'read-only review adds no graded attempt');
    w.__TBLearning.completeSession({examId:id,sessionId:done.sessionId,records:questions.map(question=>({question,selected:question.answer}))});
    assert.equal(w.__TBLearning.eventsForExam(id).filter(e=>e.type==='session_completed'&&e.sessionId===done.sessionId).length,1);
  }assert.deepEqual(errors,[]);
});
test('09 clearing a saved draft before finalization leaves blanks, not incorrect learning interactions',async t=>{
  const {w}=await ui(t);const e=w.__TB.EXAMS.cssbb,qs=e.sets[1].slice(0,2);
  const started=w.__TBLearning.startSession({examId:'cssbb',questions:qs,mode:'quick',timed:false,returnResult:true});assert.equal(started.saved,true);
  for(const selected of [qs[0].answer,null])assert.equal(w.__TBLearning.recordDraft({examId:'cssbb',sessionId:started.sessionId,index:0,question:qs[0],selected}).saved,true);
  const final=w.__TBLearning.completeSession({examId:'cssbb',sessionId:started.sessionId,records:qs.map(question=>({question,selected:null}))});
  assert.equal(final.saved,true);assert.equal(final.grading.unanswered,2);assert.equal(final.grading.correct,0);
  assert.equal(w.__TBLearning.summary('cssbb').answeredEvents,0);
});

test('09 malformed retained history cannot crash valid score projections or replace original groups',()=>{
  const f=fixture(),a=attempt(f),s=analytics();s.setExamData({attempts:[null,7,[],a]});
  assert.equal(s.context.__TBAnalyticsDashboard.examAttemptSeries().length,1);
  assert.equal(s.context.__TBAnalyticsDashboard.sessionTrend().length,1);
  const unsafePin=JSON.parse('{"constructor":"untrusted"}');
  s.context.__TBLearning={eventsForExam:()=>[{id:'bad-pin',type:'session_completed',sessionId:a.id,occurredAt:STAMP,payload:{versionPin:unsafePin}}]};
  const rows=plain(s.context.__TBAnalyticsDashboard.latestExamDomainBreakdown());
  assert.equal(rows.reduce((n,d)=>n+d.total,0),3);assert.equal(rows.reduce((n,d)=>n+d.correct,0),1);
  assert.equal(V.assessAttempt(null).available,false);
});
