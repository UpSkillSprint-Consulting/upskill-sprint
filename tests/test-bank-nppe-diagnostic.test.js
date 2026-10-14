'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const ROOT=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
let build,packet,workspace;
test.before(async()=>{
  workspace=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'nppe-diagnostic-'));
  for(const entry of fs.readdirSync(ROOT,{withFileTypes:true})) {
    if(['content','public-site','node_modules'].includes(entry.name))continue;
    fs.symlinkSync(path.join(ROOT,entry.name),path.join(workspace,entry.name),entry.isDirectory()?'dir':'file');
  }
  build=await (await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(workspace);
  packet=JSON.parse(fs.readFileSync(path.join(build.output,'nppe.json'),'utf8'));
});
test.after(()=>{if(workspace)fs.rmSync(workspace,{recursive:true,force:true});});
function bank(){const ctx={window:{}};vm.runInNewContext(read('test-bank-nppe-diagnostic-batch2.js')+'\n'+read('test-bank-nppe-diagnostic.js'),ctx);return ctx.window;}
async function browser(){
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(build.shell,{url:'https://upskillsprint.com/test-bank?exam=nppe',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 dom.window.scrollTo=()=>{};dom.window.HTMLElement.prototype.scrollIntoView=()=>{};dom.window.confirm=()=>true;
 packet.scripts.forEach(code=>dom.window.eval(code));
 await new Promise(resolve=>setTimeout(resolve,50));
 return {dom,win:dom.window,doc:dom.window.document,errors};
}
test('batches 1 and 2 contain twenty original scored questions, all six domains, unique IDs and complete reasoning',()=>{
 const qs=bank().NPPE_DIAGNOSTIC;
 assert.equal(qs.length,20);assert.equal(new Set(qs.map(q=>q.qid)).size,10);
 const counts={};
 qs.forEach((q,i)=>{
  assert.equal(q.qid,'nppe:set-1:diagnostic:'+String(i+1).padStart(3,'0'));
  assert.equal(q.form,'set-1-diagnostic');assert.equal(q.authorSet,1);assert.equal(q.original,true);assert.equal(q.scored,true);assert.equal(q.experimental,false);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert.ok(q.sources.length&&q.why&&q.keyPoint&&q.learningObjective);
  assert.ok(q.optionRationales.every(s=>s.length>35));counts[q.area]=(counts[q.area]||0)+1;
 });
 assert.deepEqual(counts,{I:2,II:4,III:6,IV:4,V:2,VI:2});\n assert.deepEqual(qs.map(q=>q.batch),Array(10).fill(1).concat(Array(10).fill(2)));
});
test('diagnostic registration is idempotent and cannot overwrite another author form',()=>{
 const ctx={window:{},console};vm.runInNewContext(read('test-bank-nppe-set2.js'),ctx);
 const e={formCatalog:[{id:'set-1-diagnostic',authorSet:1}],forms:{},sets:{},setPlans:{},mockLaunchable:{}};
 ctx.window.registerNPPESet2(e);const before=JSON.stringify(e.forms['mock-d']);
 const api=bank();api.registerNPPEDiagnostic(e);api.registerNPPEDiagnostic(e);
 assert.equal(e.forms['set-1-diagnostic'].length,20);assert.equal(e.diagnostic.complete,false);assert.equal(e.diagnostic.target,50);
 assert.equal(JSON.stringify(e.forms['mock-d']),before);
 assert.equal(new Set([...e.forms['mock-d'],...e.forms['set-1-diagnostic']].map(q=>q.qid)).size,130);
 assert.throws(()=>api.registerNPPEDiagnostic({formCatalog:[{id:'set-1-diagnostic',authorSet:2}]}));
});
test('build delivers diagnostic only in the NPPE authorized package and no questions in the public shell',()=>{
 assert.match(packet.scripts.join('\n'),/nppe:set-1:diagnostic:/);
 assert.doesNotMatch(build.shell,/nppe:set-1:diagnostic:|NPPE_DIAGNOSTIC|An engineer supervising a technical assessment/);
 for(const key of Object.keys(build.sizes).filter(k=>k!=='nppe')) assert.doesNotMatch(fs.readFileSync(path.join(build.output,key+'.json'),'utf8'),/NPPE_DIAGNOSTIC|nppe:set-1:diagnostic:/);
 assert.ok(build.sizes.nppe<5500000);
});
test('partial Diagnostic displays actual 10 count; the other six forms retain ownership and readiness',async()=>{
 const {dom,doc,win,errors}=await browser();try{
  assert.equal(doc.querySelector('[data-set="set-1-diagnostic"] .tb-sets').textContent,'20');
  assert.equal(doc.querySelector('[data-set="mock-d"] .tb-sets').textContent,'110');
  assert.equal(doc.querySelector('[data-set="mock-e"] .tb-sets').textContent,'110');
  for(const id of ['set-1-learning','set-1-mock-a','set-1-mock-b','set-1-mock-c'])assert.equal(doc.querySelector('[data-set="'+id+'"]').disabled,true);
  assert.match(doc.getElementById('tb-overview').textContent,/20 of 50 planned/);
  assert.match(doc.getElementById('tb-overview').textContent,/28 minutes/);
  assert.match(doc.querySelector('[data-mode="full"]').textContent,/Start Diagnostic/);
  assert.equal(doc.querySelector('[data-mode="quick"]'),null);
  assert.equal(win.__TB.EXAMS.nppe.forms['mock-d'].length,110);assert.deepEqual(errors,[]);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('timed Diagnostic launches exactly twenty of its own questions for twenty-eight minutes without answer aids',async()=>{
 const {dom,doc,win,errors}=await browser();try{
  doc.querySelector('[data-mode="full"]').click();
  assert.match(doc.querySelector('#tb-timer').textContent,/^2[78]:[0-5][0-9]$/);
  const snap=win.__TB.getFeedbackSnapshot();assert.equal(snap.records.length,20);
  assert.ok(snap.records.every(r=>r.question.form==='set-1-diagnostic'));
  assert.equal(doc.querySelectorAll('[data-goto]').length,20);
  assert.equal(doc.querySelector('[data-reveal]'),null);assert.equal(doc.querySelector('[data-formulas]'),null);assert.equal(doc.querySelector('.tb-qtag'),null);
  assert.equal(doc.querySelector('[data-tables]'),null);assert.equal(doc.querySelector('[data-calc]'),null);
  doc.querySelector('[data-opt="1"]').click();doc.querySelector('[data-flag]').click();doc.querySelector('[data-next]').click();doc.querySelector('[data-goto="0"]').click();
  assert.equal(doc.querySelector('[data-opt="1"]').getAttribute('aria-pressed'),'true');assert.equal(doc.querySelector('[data-flag]').getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[]);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('untimed Diagnostic scores 20/20, reports all domains and provides source-supported answer review only after submission',async()=>{
 const {dom,doc,win,errors}=await browser();try{
  doc.querySelector('[data-timing-kind="full"][data-timed="0"]').click();doc.querySelector('[data-mode="full"]').click();
  assert.equal(doc.querySelector('.tb-timer').textContent,'Untimed');assert.equal(doc.querySelector('#tb-feedback-loop'),null);
  for(let i=0;i<20;i++){
   const qid=doc.querySelector('.tb-quiz').dataset.questionId;
   const item=win.__TB.getFeedbackSnapshot().records.find(r=>r.question.qid===qid);
   doc.querySelector('[data-opt="'+item.question.answer+'"]').click();
   doc.querySelector(i===19?'[data-submit]':'[data-next]').click();
  }
  await new Promise(resolve=>setTimeout(resolve,80));
  assert.match(doc.querySelector('[data-score-result]').textContent,/100% \(20\/20\)/);
  assert.match(doc.querySelector('[data-score-result]').textContent,/Test set: Diagnostic/);
  assert.equal(doc.querySelectorAll('.tb-domblock').length,6);
  assert.doesNotMatch(doc.querySelector('#tb-overview').textContent,/Coverage-adjusted readiness/);
  assert.match(doc.querySelector('#tb-overview').textContent,/not an official scaled NPPE score/);
  assert.ok(doc.querySelector('#tb-feedback-loop'));
  doc.querySelector('[data-open-review="all"]').click();
  assert.match(doc.querySelector('#tb-feedback-loop').textContent,/Sources:/);
  doc.querySelector('[data-retake]').click();assert.equal(win.__TB.getFeedbackSnapshot().records.length,20);assert.equal(doc.querySelector('.tb-timer').textContent,'Untimed');
  assert.deepEqual(errors,[]);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('Mock D launch stays 110 separate questions for 150 minutes; empty forms cannot substitute diagnostic questions',async()=>{
 const {dom,doc,win,errors}=await browser();try{
  const empty=doc.querySelector('[data-set="set-1-mock-a"]');
  // Simulate a forged click event, bypassing the disabled native button.
  empty.dispatchEvent(new win.Event('click'));
  assert.equal(doc.querySelector('[data-mode="full"]').disabled,true);
  doc.querySelector('[data-mode="full"]').dispatchEvent(new win.Event('click'));assert.equal(doc.querySelector('.tb-quiz'),null);
  doc.querySelector('[data-set="mock-d"]').click();doc.querySelector('[data-mode="full"]').click();
  const snap=win.__TB.getFeedbackSnapshot();assert.equal(snap.records.length,110);assert.ok(snap.records.every(r=>r.question.form==='mock-d'&&r.question.authorSet===2));
  assert.match(doc.querySelector('#tb-timer').textContent,/^2:([23][0-9]):[0-5][0-9]$/);
  assert.deepEqual(errors,[]);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('NPPE endpoint retains anonymous, revoked and unconfirmed denial before package access',async()=>{
 const {createHandler}=await import('../netlify/functions/exam-content.mjs');
 let decision=false,reads=0;
 const handler=createHandler({getSettings:()=>({url:'https://example.supabase.co',key:'sb_publishable_test'}),request:async()=>new Response(JSON.stringify(decision)),loadPackage:async exam=>{assert.equal(exam,'nppe');reads++;return '{}';}});
 const req=auth=>new Request('https://upskillsprint.com/.netlify/functions/exam-content?exam=nppe',{headers:auth?{Authorization:'Bearer header.learner.signature'}:{}});
 assert.equal((await handler(req(false))).status,401);assert.equal((await handler(req(true))).status,403);assert.equal(reads,0);
 decision=true;assert.equal((await handler(req(true))).status,200);assert.equal(reads,1);
 decision=false;assert.equal((await handler(req(true))).status,403);assert.equal(reads,1);
 assert.match(read('supabase/migrations/20261014005000_nppe_exam_catalog.sql'),/'coming_soon'/);
});
test('runtime integration fails closed when an authoring anchor changes',async()=>{
 const {integrateNPPEDiagnostic}=await import('../scripts/nppe-diagnostic-runtime.mjs');
 assert.throws(()=>integrateNPPEDiagnostic('changed runtime'),/anchor changed/);
});
test('author tabs isolate visible banks and support arrow-key navigation',async()=>{
 const {dom,doc}=await browser();try{
  assert.equal(doc.querySelector('#nppe-banks-1').hidden,false);
  assert.equal(doc.querySelector('#nppe-banks-2').hidden,true);
  assert.equal(doc.querySelector('#nppe-banks-3').hidden,true);
  doc.querySelector('[data-nppe-owner="2"]').click();
  assert.equal(doc.querySelector('#nppe-banks-1').hidden,true);
  assert.equal(doc.querySelector('#nppe-banks-2').hidden,false);
  assert.match(doc.querySelector('[data-mode="full"]').textContent,/Start Mock D/);
  doc.querySelector('[data-nppe-owner="2"]').dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  assert.equal(doc.querySelector('#nppe-banks-2').hidden,true);
  assert.equal(doc.querySelector('#nppe-banks-3').hidden,false);
  assert.equal(doc.activeElement.id,'nppe-owner-3');
  assert.match(doc.querySelector('[data-mode="full"]').textContent,/Start Mock E/);
  doc.activeElement.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
  assert.equal(doc.activeElement.id,'nppe-owner-1');
  assert.match(doc.querySelector('[data-mode="full"]').textContent,/Start Diagnostic/);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('Mock E launches its own 100 scored and 10 experimental items without diagnostic leakage',async()=>{
 const {dom,doc,win}=await browser();try{
  doc.querySelector('[data-nppe-owner="3"]').click();
  doc.querySelector('[data-mode="full"]').click();
  const records=win.__TB.getFeedbackSnapshot().records;
  assert.equal(records.length,110);
  assert.ok(records.every(r=>r.question.form==='mock-e'&&r.question.authorSet===3));
  assert.equal(records.filter(r=>r.question.scored!==false&&r.question.experimental!==true).length,100);
  assert.match(doc.querySelector('#tb-timer').textContent,/^2:([23][0-9]):[0-5][0-9]$/);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('public staging excludes NPPE authoring files and audit detects accidental NPPE staging',async()=>{
 const {stagePublicSite}=await import('../scripts/stage-public-site.mjs');
 const {auditExamPublicContent}=await import('../scripts/audit-exam-public-content.mjs');
 const temp=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'nppe-release-'));
 try{
  const source=path.join(temp,'source'),publish=path.join(temp,'public');
  fs.mkdirSync(path.join(source,'nppe'),{recursive:true});
  fs.writeFileSync(path.join(source,'index.html'),'<h1>Home</h1>');
  fs.writeFileSync(path.join(source,'nppe/build_mock_e.py'),'# private authoring');
  fs.writeFileSync(path.join(source,'test-bank-nppe-diagnostic.js'),'// private bank');
  await stagePublicSite(source,publish);
  assert.equal(fs.existsSync(path.join(publish,'nppe')),false);
  assert.equal(fs.existsSync(path.join(publish,'test-bank-nppe-diagnostic.js')),false);
  fs.mkdirSync(path.join(publish,'nppe'));
  assert.equal((await auditExamPublicContent(publish)).status,'blocked');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
