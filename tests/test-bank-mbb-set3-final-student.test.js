'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {JSDOM,VirtualConsole}=require('jsdom');
const {installDurableLearning}=require('./helpers/test-bank-durable-learning');
const root=path.join(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),wait=ms=>new Promise(r=>setTimeout(r,ms));
const ctx={window:{}};vm.runInNewContext(read('test-bank-mbb-set3.js'),ctx);const bank=JSON.parse(JSON.stringify(ctx.window.MBB_SET3));
async function player(options={}){
 let html=read('test-bank.html');for(const f of ['test-bank-mbb-set1.js','test-bank-mbb-set2.js','test-bank-mbb-set3.js'])html=html.replace('<script src="/'+f+'"></script>','<script>'+read(f)+'</script>');
 const ticks=[],errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://upskillsprint.com/test-bank.html',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.setInterval=(fn,ms)=>{ticks.push({fn,ms});return ticks.length;};w.clearInterval=()=>{};}}),w=dom.window;
 await new Promise(r=>w.addEventListener('load',r));await installDurableLearning(w);
 for(let b=1;b<=7;b++)w.eval(read('test-bank-mbb-set3-batch'+b+'-ui.js'));
 for(const f of ['test-bank-feedback-loop.js'].concat(options.deep?['test-bank-deep-feedback.js','test-bank-phase2-quality-assurance.js']:[]))w.eval(read(f));
 const click=s=>{const e=w.document.querySelector(s);assert.ok(e,s);e.click();};await wait(40);
 click('.tb-tile[data-exam="mbb"]');click('.tb-setpick [data-set="3"]');click('[data-mode="full"]');await wait(40);
 return {dom,w,ticks,errors,click};
}
test('timed expiry preserves all 175 review records, including 174 unvisited skipped items',async()=>{
 const p=await player();try{const {w,click,ticks}=p;const snapshot=w.__TB.getFeedbackSnapshot();assert.equal(snapshot.records.length,175);const first=snapshot.records[0].question;click('[data-opt="'+first.answer+'"]');click('[data-flag]');const now=w.Date.now();w.Date.now=()=>now+100000000;ticks.find(t=>t.fn.name==='tickTimer').fn();await wait(60);
 assert.match(w.document.querySelector('.tb-resverd').textContent,/1 of 175 correctly/);click('[data-open-review="all"]');assert.equal(w.document.querySelectorAll('.tb-review-card').length,175);assert.equal(w.document.querySelectorAll('.tb-review-card[data-review-status="unanswered"]').length,174);assert.equal(w.document.querySelectorAll('.tb-review-navcell').length,175);
 click('[data-review-tab="unanswered"]');assert.equal(w.document.querySelectorAll('.tb-review-card').length,174);click('[data-review-tab="flagged"]');assert.equal(w.document.querySelectorAll('.tb-review-card').length,1);assert.deepEqual(p.errors,[]);
 }finally{await wait(40);p.w.close();}
});
test('manual submission captures authoritative answers without synthetic navigation and scopes repeated sessions by ID',async()=>{
 const p=await player();try{const {w,click}=p;const snap=w.__TB.getFeedbackSnapshot();click('[data-opt="'+snap.records[0].question.answer+'"]');click('[data-goto="1"]');click('[data-opt="'+((snap.records[1].question.answer+1)%4)+'"]');click('[data-goto="174"]');let synthetic=0;w.document.addEventListener('click',e=>{if(e.target.closest('[data-goto]'))synthetic++;});click('[data-submit]');await wait(60);assert.equal(synthetic,0);click('[data-open-review="all"]');assert.equal(w.document.querySelectorAll('.tb-review-card').length,175);assert.equal(w.document.querySelectorAll('[data-review-status="correct"]').length,1);assert.equal(w.document.querySelectorAll('[data-review-status="incorrect"]').length,1);assert.equal(w.document.querySelectorAll('[data-review-status="unanswered"]').length,173);
 click('[data-retake]');await wait(50);const next=w.__TB.getFeedbackSnapshot();assert.notEqual(next.sessionId,snap.sessionId);assert.ok(next.records.every(r=>r.selected===null&&!r.flagged));click('[data-goto="174"]');click('[data-submit]');await wait(60);click('[data-open-review="all"]');assert.equal(w.document.querySelectorAll('[data-review-status="unanswered"]').length,175);assert.deepEqual(p.errors,[]);
 }finally{await wait(40);p.w.close();}
});
test('failed completion never publishes a completed review or claims a saved attempt',async()=>{
 const p=await player();try{const {w,click}=p;let completions=0;w.document.addEventListener('tb:attempt-completed',()=>completions++);w.__TBLearning.completeSession=()=>({saved:false});click('[data-goto="174"]');click('[data-submit]');await wait(40);assert.equal(completions,0);assert.equal(w.__TB.getFeedbackSnapshot().completed,false);assert.ok(w.document.querySelector('.tb-quiz'));assert.equal(w.document.querySelector('.tb-reshead'),null);assert.match(w.document.querySelector('#tb-learning-storage-notice').textContent,/could not be safely saved/);assert.deepEqual(p.errors,[]);
 }finally{await wait(40);p.w.close();}
});
test('feedback quality details recover when the badge was inserted before deep feedback',async()=>{
 const q=bank[0],dom=new JSDOM('<button class="tb-tile active" data-exam="mbb"></button><div id="tb-overview"><div id="tb-feedback-loop"><article class="tb-review-card" data-question-id="'+q.qid+'"><div class="tb-review-card-head"><div class="tb-review-badges"></div></div><div class="tb-review-stem"></div></article></div></div>',{url:'https://upskillsprint.com/test-bank.html',pretendToBeVisual:true,runScripts:'dangerously'}),w=dom.window;
 try{w.__TB={EXAMS:{mbb:{bank:[q]}}};w.document.querySelector('.tb-review-stem').textContent=q.stem;w.eval(read('test-bank-phase2-quality-assurance.js'));await wait(60);assert.equal(w.document.querySelectorAll('.tb-quality-badge').length,1);assert.equal(w.document.querySelectorAll('.tb-quality-details').length,0);w.document.querySelector('.tb-review-card').insertAdjacentHTML('beforeend','<div class="tb-deep-learning"></div>');await wait(60);assert.equal(w.document.querySelectorAll('.tb-quality-details').length,1);for(let i=0;i<20;i++)w.document.dispatchEvent(new w.CustomEvent('tb:review-rendered'));assert.equal(w.document.querySelectorAll('.tb-quality-badge').length,1);assert.equal(w.document.querySelectorAll('.tb-quality-details').length,1);
 }finally{w.close();}
});
test('every replacement review has immediate working details even when animation-frame enhancement is delayed',async()=>{
 const p=await player();try{const {w,click}=p;click('[data-goto="174"]');click('[data-submit]');await wait(60);click('[data-open-review="all"]');click('[data-review-tab="correct"]');for(const file of ['test-bank-deep-feedback.js','test-bank-phase2-quality-assurance.js'])w.eval(read(file));await wait(60);w.requestAnimationFrame=()=>1;
 for(let i=0;i<175;i++){click('[data-review-goto="'+i+'"]');const card=w.document.querySelector('.tb-review-card');assert.ok(card.querySelector('.tb-distractor-analysis'),String(i));assert.equal(card.querySelectorAll('.tb-distractor-row').length,3);assert.equal(card.querySelectorAll('.tb-quality-details').length,1);const summary=card.querySelector('.tb-distractor-analysis summary');summary.click();assert.ok(summary.parentElement.open);}
 assert.deepEqual(p.errors,[]);
 }finally{await wait(40);p.w.close();}
});
test('all 175 Set 3 review references are item-specific, safely encoded and open without replacing the exam',async()=>{
 const p=await player();try{const {w,click}=p;click('[data-goto="174"]');click('[data-submit]');await wait(60);click('[data-open-review="all"]');const lookup=new Map(bank.map(q=>[q.qid,q]));
 for(const card of w.document.querySelectorAll('.tb-review-card')){const q=lookup.get(card.dataset.questionId),source=q.auditSources[1]||q.auditSources[0],a=card.querySelector('a.tb-review-reference');assert.ok(a,q.qid);assert.equal(a.getAttribute('href'),source.url);assert.equal(a.textContent,'Reference: '+source.title);assert.equal(a.target,'_blank');assert.equal(a.rel,'noopener noreferrer');assert.match(a.getAttribute('aria-label'),/opens in a new tab/);}
 assert.deepEqual(p.errors,[]);
 }finally{await wait(40);p.w.close();}
});
test('Q1 guidance tests the actual clinical IT and reimbursement linkage, not an invented customer-convenience criterion',()=>{
 assert.doesNotMatch(bank[0].trap,/customer convenience/);assert.match(bank[0].trap,/clinical IT weakness and reimbursement exposure/);
});

test('Final audit allows only the documented Q1 hint repair; every other question byte, ID, key and trailer is preserved',()=>{
 const source=read('test-bank-mbb-set3.js');
 assert.equal(crypto.createHash('sha256').update(source.replace("Test the stated linkage between the clinical IT weakness and reimbursement exposure. A plausible strategic story is not a substitute for the documented mechanism.","Test both stated decision criteria: customer convenience and the documented reimbursement mechanism. A plausible strategic story is not a substitute for that evidence.")).digest('hex'),"606c8ba8732d51b74640575e44930a88ed4e949861cf55c463eccd07819e35a2");
});

test('review navigation avoids smooth-scroll races and related Set 3 practice retains the correct reference',async()=>{
 const p=await player();try{const {w,click}=p;click('[data-goto="174"]');click('[data-submit]');await wait(60);click('[data-open-review="all"]');click('[data-review-tab="correct"]');w.eval(read('test-bank-deep-feedback.js'));await wait(30);
 const header=w.document.querySelector('header.site');header.getBoundingClientRect=()=>({height:84});let scroll;
 const element=w.document.createElement('div');element.scrollIntoView=o=>scroll=o;w.__TBFeedbackPresentation.scrollTo(element);assert.equal(scroll.behavior,'instant');assert.equal(scroll.block,'start');assert.equal(element.style.scrollMarginTop,'100px');
 // Constrain this practice fixture to the audited bank, not unaudited Sets 1/2.
 w.__TB.EXAMS.mbb.bank=bank;w.__TB.EXAMS.mbb.sets={3:bank};if(w.__TBQuestionRegistry)w.__TBQuestionRegistry.questionsFor=()=>bank;
 click('[data-review-goto="0"]');const source=w.document.querySelector('.tb-review-card').dataset.questionId;click('[data-practice-similar="'+source+'"]');
 for(let i=0;i<5;i++){const panel=w.document.querySelector('#tb-similar-practice'),q=bank.find(q=>q.qid===panel.dataset.questionId);assert.ok(q);click('[data-similar-opt="'+q.answer+'"]');click('[data-similar-check]');const a=panel.querySelector('.tb-review-reference'),ref=q.auditSources[1]||q.auditSources[0];assert.ok(a);assert.equal(a.href,ref.url);assert.equal(a.target,'_blank');click('[data-similar-next]');}
 assert.match(w.document.querySelector('#tb-similar-practice').textContent,/Subtopic reinforced/);click('[data-close-similar]');assert.equal(w.document.querySelector('#tb-answer-review').hidden,false);assert.deepEqual(p.errors,[]);
 }finally{await wait(40);p.w.close();}
});


test('Full Exam retake retains its core listener when the Quick/Focused coordinator is loaded',async()=>{
 const p=await player();try{const {w,click}=p;for(const f of ['test-bank-retake-state.js','test-bank-retake-runner.js'])w.eval(read(f));const first=w.__TB.getFeedbackSnapshot();click('[data-opt="'+first.records[0].question.answer+'"]');click('[data-flag]');click('[data-goto="174"]');click('[data-submit]');await wait(100);
 const button=w.document.querySelector('[data-retake]');assert.ok(button);assert.match(button.textContent,/Full Exam/);assert.equal(button.dataset.upskillRetakeOwned,undefined);button.click();await wait(100);const next=w.__TB.getFeedbackSnapshot();assert.ok(w.document.querySelector('.tb-quiz'));assert.notEqual(next.sessionId,first.sessionId);assert.equal(next.records.length,175);assert.ok(next.records.every(r=>r.selected===null&&!r.flagged));assert.deepEqual(p.errors,[]);
 }finally{await wait(40);p.w.close();}
});

test('narrow-screen review copy wraps long terms instead of escaping its grid column',()=>{
 assert.ok(read('test-bank-deep-feedback.js').includes('.tb-error-diagnosis p{margin:7px 0 0;color:var(--ink);font-size:11.5px}'));
 const source=read('test-bank-feedback-loop.js');assert.ok(source.includes('.tb-review-option .tb-answer-copy,.tb-answer-compare strong,.tb-distractor-title{min-width:0;overflow-wrap:anywhere}'));
});


test('failed timeout save cannot change expired answers, and retry keeps the timeout reason',async()=>{
 const p=await player();try{const {w,click,ticks}=p;const first=w.__TB.getFeedbackSnapshot().records[0].question;click('[data-opt="'+first.answer+'"]');const complete=w.__TBLearning.completeSession;w.__TBLearning.completeSession=()=>({saved:false});const now=w.Date.now();w.Date.now=()=>now+100000000;ticks.find(t=>t.fn.name==='tickTimer').fn();await wait(30);click('[data-opt="'+((first.answer+1)%4)+'"]');assert.equal(w.__TB.getFeedbackSnapshot().records[0].selected,first.answer);assert.ok(w.document.querySelector('#tb-learning-storage-notice'));
 let reason;w.__TBLearning.completeSession=function(c){reason=c.completedReason;return complete.call(this,c);};click('[data-goto="174"]');click('[data-submit]');await wait(60);assert.equal(reason,'timed-out');assert.match(w.document.querySelector('.tb-resverd').textContent,/1 of 175 correctly/);assert.deepEqual(p.errors,[]);
 }finally{await wait(40);p.w.close();}
});
