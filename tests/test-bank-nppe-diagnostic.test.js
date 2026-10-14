'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const ROOT=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const EXPECTED_COUNT=30, EXPECTED_MINUTES=41;
const PREFIX='nppe:set-1:diagnostic:';
const DIAGNOSTIC_FILES=['test-bank-nppe-diagnostic-batch2.js','test-bank-nppe-diagnostic.js','test-bank-nppe-diagnostic-batch3.js'];
let build,packet,workspace;
test.before(async()=>{
  workspace=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'nppe-diagnostic-'));
  for(const entry of fs.readdirSync(ROOT,{withFileTypes:true})) {
    if(['.git','content','public-site','node_modules'].includes(entry.name))continue;
    fs.symlinkSync(path.join(ROOT,entry.name),path.join(workspace,entry.name),entry.isDirectory()?'dir':'file');
  }
  build=await (await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(workspace);
  packet=JSON.parse(fs.readFileSync(path.join(build.output,'nppe.json'),'utf8'));
});
test.after(()=>{if(workspace)fs.rmSync(workspace,{recursive:true,force:true});});
function bank(){const ctx={window:{}};vm.runInNewContext(DIAGNOSTIC_FILES.map(read).join('\n'),ctx);return ctx.window;}
async function browser(){
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(build.shell,{url:'https://upskillsprint.com/test-bank?exam=nppe',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 dom.window.scrollTo=()=>{};dom.window.HTMLElement.prototype.scrollIntoView=()=>{};dom.window.confirm=()=>true;
 packet.scripts.forEach(code=>dom.window.eval(code));
 await new Promise(resolve=>setTimeout(resolve,50));
 return {dom,win:dom.window,doc:dom.window.document,errors};
}
test('three diagnostic batches have thirty unique scored items and complete reasoning',()=>{
 const qs=bank().NPPE_DIAGNOSTIC;
 assert.equal(qs.length,EXPECTED_COUNT);assert.equal(new Set(qs.map(q=>q.qid)).size,EXPECTED_COUNT);
 const counts={};
 qs.forEach((q,i)=>{
  assert.equal(q.qid,PREFIX+String(i+1).padStart(3,'0'));
  assert.equal(q.form,'set-1-diagnostic');assert.equal(q.authorSet,1);assert.equal(q.original,true);assert.equal(q.scored,true);assert.equal(q.experimental,false);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert.ok(q.sources.length&&q.why&&q.keyPoint&&q.learningObjective);
  assert.ok(q.optionRationales.every(s=>s.length>35));counts[q.area]=(counts[q.area]||0)+1;
 });
 assert.deepEqual(counts,{I:3,II:6,III:9,IV:6,V:3,VI:3});
 assert.deepEqual(Array.from(qs,q=>q.batch),Array(10).fill(1).concat(Array(10).fill(2),Array(10).fill(3)));
});
test('Batch 3 maps to verified blueprint subtopics, carries source types and remains editorially calibrated only',()=>{
 const qs=Array.from(bank().NPPE_DIAGNOSTIC_BATCH3);
 assert.equal(qs.length,10);
 assert.deepEqual(qs.map(q=>q.blueprint),['I.4','II.2','II.4','III.4','III.5','III.6','IV.6','IV.8','V.4','VI.3']);
 assert.deepEqual(qs.map(q=>q.answer),[2,0,3,1,0,2,3,0,1,3]);
 assert.equal(qs.filter(q=>q.difficulty==='easy').length,2);
 assert.equal(qs.filter(q=>q.difficulty==='medium').length,6);
 assert.equal(qs.filter(q=>q.difficulty==='hard').length,2);
 assert.equal(new Set(qs.map(q=>q.questionFamily)).size,10);
 for(const q of qs){
  assert.match(q.blueprintVersion,/2017/);assert.match(q.difficultyBasis,/not empirically calibrated/);
  assert.match(q.reviewStatus,/not independently validated/);
  for(const source of q.sources){assert.ok(source.sourceType&&source.title&&source.locator);if(source.url)assert.equal(new URL(source.url).protocol,'https:');}
  assert.doesNotMatch(q.why,/<script|onerror\s*=/i);
 }
 assert.match(qs[4].stem,/hypothetical/i);assert.match(qs[7].jurisdiction,/Ontario/);assert.match(qs[9].jurisdiction,/British Columbia/);
});
test('Batch 3 registration preserves all earlier question objects and rejects missing or partial predecessors',()=>{
 const ctx={window:{}};
 vm.runInNewContext(DIAGNOSTIC_FILES.slice(0,2).map(read).join('\n'),ctx);
 const original=ctx.window.NPPE_DIAGNOSTIC;
 const before=JSON.stringify(original),references=Array.from(original);
 vm.runInNewContext(read(DIAGNOSTIC_FILES[2]),ctx);
 assert.equal(ctx.window.NPPE_DIAGNOSTIC,original);
 assert.equal(original.length,EXPECTED_COUNT);
 assert.equal(JSON.stringify(original.slice(0,20)),before);
 references.forEach((q,i)=>assert.equal(original[i],q));
 ctx.window.installNPPEDiagnosticBatch3();
 vm.runInNewContext(read(DIAGNOSTIC_FILES[2]),ctx);
 assert.equal(original.length,EXPECTED_COUNT);
 assert.throws(()=>vm.runInNewContext(read(DIAGNOSTIC_FILES[2]),{window:{}}),/Batches 1/);
 assert.throws(()=>vm.runInNewContext(read(DIAGNOSTIC_FILES[2]),{window:{NPPE_DIAGNOSTIC:original.slice(0,19)}}),/Batches 1/);
 const invalid=JSON.parse(before);invalid[0].authorSet=2;
 assert.throws(()=>vm.runInNewContext(read(DIAGNOSTIC_FILES[2]),{window:{NPPE_DIAGNOSTIC:invalid}}),/earlier Diagnostic/);
 original[29].stem='Conflicting replacement';
 assert.throws(()=>ctx.window.installNPPEDiagnosticBatch3(),/Conflicting/);
});
test('diagnostic registration is idempotent and cannot overwrite another author form',()=>{
 const ctx={window:{},console};vm.runInNewContext(read('test-bank-nppe-set2.js')+'\n'+read('test-bank-nppe-set3.js'),ctx);
 const e={formCatalog:[{id:'set-1-diagnostic',authorSet:1}],forms:{},sets:{},setPlans:{},mockLaunchable:{}};
 ctx.window.registerNPPESet2(e);ctx.window.registerNPPESet3(e);
 const beforeD=JSON.stringify(e.forms['mock-d']),beforeE=JSON.stringify(e.forms['mock-e']);
 const api=bank();api.registerNPPEDiagnostic(e);api.registerNPPEDiagnostic(e);
 assert.equal(e.forms['set-1-diagnostic'].length,EXPECTED_COUNT);assert.equal(e.diagnostic.complete,false);assert.equal(e.diagnostic.target,50);
 assert.equal(JSON.stringify(e.forms['mock-d']),beforeD);assert.equal(JSON.stringify(e.forms['mock-e']),beforeE);
 const all=[...e.forms['mock-d'],...e.forms['mock-e'],...e.forms['set-1-diagnostic']];
 assert.equal(new Set(all.map(q=>q.qid)).size,250);
 const earlierStems=new Set(all.filter(q=>q.batch!==3||q.form!=='set-1-diagnostic').map(q=>q.stem.trim().toLowerCase()));
 for(const q of api.NPPE_DIAGNOSTIC_BATCH3)assert.equal(earlierStems.has(q.stem.trim().toLowerCase()),false,q.qid);
 assert.throws(()=>api.registerNPPEDiagnostic({formCatalog:[{id:'set-1-diagnostic',authorSet:2}]}));
});
test('build delivers Diagnostic only in the NPPE authorized package and no questions in the public shell',()=>{
 assert.match(packet.scripts.join('\n'),/nppe:set-1:diagnostic:/);
 assert.match(packet.scripts.join('\n'),/NPPE_DIAGNOSTIC_BATCH3/);
 assert.doesNotMatch(build.shell,/nppe:set-1:diagnostic:|NPPE_DIAGNOSTIC|A municipality asks a project team/);
 for(const key of Object.keys(build.sizes).filter(k=>k!=='nppe'))assert.doesNotMatch(fs.readFileSync(path.join(build.output,key+'.json'),'utf8'),/NPPE_DIAGNOSTIC|nppe:set-1:diagnostic:/);
 assert.ok(build.sizes.nppe<5500000);
});
test('partial Diagnostic displays actual 30 count and 41 minutes; other forms retain readiness',async()=>{
 const {dom,doc,win,errors}=await browser();try{
  assert.equal(doc.querySelector('[data-set="set-1-diagnostic"] .tb-sets').textContent,String(EXPECTED_COUNT));
  assert.equal(doc.querySelector('[data-set="mock-d"] .tb-sets').textContent,'110');
  assert.equal(doc.querySelector('[data-set="mock-e"] .tb-sets').textContent,'110');
  for(const id of ['set-1-learning','set-1-mock-a','set-1-mock-b','set-1-mock-c'])assert.equal(doc.querySelector('[data-set="'+id+'"]').disabled,true);
  assert.match(doc.getElementById('tb-overview').textContent,/30 of 50 planned/);
  assert.match(doc.getElementById('tb-overview').textContent,new RegExp(EXPECTED_MINUTES+' minutes'));
  assert.match(doc.querySelector('[data-mode="full"]').textContent,/Start Diagnostic/);
  assert.equal(doc.querySelector('[data-mode="quick"]'),null);
  assert.equal(win.__TB.EXAMS.nppe.forms['mock-d'].length,110);assert.deepEqual(errors,[]);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('timed Diagnostic uses thirty own-bank items for forty-one minutes without answer aids',async()=>{
 const {dom,doc,win,errors}=await browser();try{
  doc.querySelector('[data-mode="full"]').click();
  assert.match(doc.querySelector('#tb-timer').textContent,/^4[01]:[0-5][0-9]$/);
  const snap=win.__TB.getFeedbackSnapshot();assert.equal(snap.records.length,EXPECTED_COUNT);
  assert.ok(snap.records.every(r=>r.question.form==='set-1-diagnostic'));
  assert.equal(snap.records.filter(r=>r.question.batch===3).length,10);
  assert.equal(doc.querySelectorAll('[data-goto]').length,EXPECTED_COUNT);
  assert.equal(doc.querySelector('[data-reveal]'),null);assert.equal(doc.querySelector('[data-formulas]'),null);assert.equal(doc.querySelector('.tb-qtag'),null);
  assert.equal(doc.querySelector('[data-tables]'),null);assert.equal(doc.querySelector('[data-calc]'),null);
  assert.equal(win.__TB.revealCurrentAnswer(),false);
  doc.querySelector('[data-opt="1"]').click();doc.querySelector('[data-flag]').click();doc.querySelector('[data-next]').click();doc.querySelector('[data-goto="0"]').click();
  assert.equal(doc.querySelector('[data-opt="1"]').getAttribute('aria-pressed'),'true');assert.equal(doc.querySelector('[data-flag]').getAttribute('aria-pressed'),'true');
  assert.deepEqual(errors,[]);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('untimed Diagnostic scores 30/30 and provides source-supported review only after submission',async()=>{
 const {dom,doc,win,errors}=await browser();try{
  doc.querySelector('[data-timing-kind="full"][data-timed="0"]').click();doc.querySelector('[data-mode="full"]').click();
  assert.equal(doc.querySelector('.tb-timer').textContent,'Untimed');assert.equal(doc.querySelector('#tb-feedback-loop'),null);
  assert.equal(win.__TB.revealCurrentAnswer(),false);
  for(let i=0;i<EXPECTED_COUNT;i++){
   const qid=doc.querySelector('.tb-quiz').dataset.questionId;
   const item=win.__TB.getFeedbackSnapshot().records.find(r=>r.question.qid===qid);
   doc.querySelector('[data-opt="'+item.question.answer+'"]').click();
   doc.querySelector(i===EXPECTED_COUNT-1?'[data-submit]':'[data-next]').click();
  }
  await new Promise(resolve=>setTimeout(resolve,80));
  assert.match(doc.querySelector('[data-score-result]').textContent,/100% \(30\/30\)/);
  assert.match(doc.querySelector('[data-score-result]').textContent,/Test set: Diagnostic/);
  assert.equal(doc.querySelectorAll('.tb-domblock').length,6);
  assert.doesNotMatch(doc.querySelector('#tb-overview').textContent,/Coverage-adjusted readiness/);
  assert.match(doc.querySelector('#tb-overview').textContent,/not an official scaled NPPE score/);
  assert.ok(doc.querySelector('#tb-feedback-loop'));
  doc.querySelector('[data-open-review="all"]').click();
  assert.match(doc.querySelector('#tb-feedback-loop').textContent,/Sources:/);
  assert.match(doc.querySelector('#tb-feedback-loop').textContent,/primary-legislation/);
  assert.equal(doc.querySelectorAll('.tb-review-card').length,EXPECTED_COUNT);
  doc.querySelector('[data-retake]').click();assert.equal(win.__TB.getFeedbackSnapshot().records.length,EXPECTED_COUNT);assert.equal(doc.querySelector('.tb-timer').textContent,'Untimed');
  assert.deepEqual(errors,[]);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('Mock D stays separate with 110 items and 150 minutes; empty forms cannot substitute Diagnostic',async()=>{
 const {dom,doc,win,errors}=await browser();try{
  const empty=doc.querySelector('[data-set="set-1-mock-a"]');
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
  assert.equal(doc.querySelector('#nppe-banks-1').hidden,true);assert.equal(doc.querySelector('#nppe-banks-2').hidden,false);
  assert.match(doc.querySelector('[data-mode="full"]').textContent,/Start Mock D/);
  doc.querySelector('[data-nppe-owner="2"]').dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  assert.equal(doc.querySelector('#nppe-banks-2').hidden,true);assert.equal(doc.querySelector('#nppe-banks-3').hidden,false);
  assert.equal(doc.activeElement.id,'nppe-owner-3');assert.match(doc.querySelector('[data-mode="full"]').textContent,/Start Mock E/);
  doc.activeElement.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
  assert.equal(doc.activeElement.id,'nppe-owner-1');assert.match(doc.querySelector('[data-mode="full"]').textContent,/Start Diagnostic/);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('Mock E retains its own 100 scored and 10 experimental items without Diagnostic leakage',async()=>{
 const {dom,doc,win}=await browser();try{
  doc.querySelector('[data-nppe-owner="3"]').click();doc.querySelector('[data-mode="full"]').click();
  const records=win.__TB.getFeedbackSnapshot().records;
  assert.equal(records.length,110);assert.ok(records.every(r=>r.question.form==='mock-e'&&r.question.authorSet===3));
  assert.equal(records.filter(r=>r.question.scored!==false&&r.question.experimental!==true).length,100);
  assert.match(doc.querySelector('#tb-timer').textContent,/^2:([23][0-9]):[0-5][0-9]$/);
 }finally{dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}
});
test('public staging excludes all Diagnostic authoring files and detects an accidental NPPE directory',async()=>{
 const {stagePublicSite}=await import('../scripts/stage-public-site.mjs');
 const {auditExamPublicContent}=await import('../scripts/audit-exam-public-content.mjs');
 const temp=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'nppe-release-'));
 try{
  const source=path.join(temp,'source'),publish=path.join(temp,'public');
  fs.mkdirSync(path.join(source,'nppe'),{recursive:true});
  fs.writeFileSync(path.join(source,'index.html'),'<h1>Home</h1>');
  fs.writeFileSync(path.join(source,'nppe/build_mock_e.py'),'# private authoring');
  for(const name of DIAGNOSTIC_FILES)fs.writeFileSync(path.join(source,name),'// private bank');
  await stagePublicSite(source,publish);
  assert.equal(fs.existsSync(path.join(publish,'nppe')),false);
  for(const name of DIAGNOSTIC_FILES)assert.equal(fs.existsSync(path.join(publish,name)),false);
  fs.mkdirSync(path.join(publish,'nppe'));
  assert.equal((await auditExamPublicContent(publish)).status,'blocked');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
