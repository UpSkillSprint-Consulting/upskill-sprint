'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const ROOT=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const DIAG=['test-bank-nppe-diagnostic-batch2.js','test-bank-nppe-diagnostic.js','test-bank-nppe-diagnostic-batch3.js','test-bank-nppe-diagnostic-batch4.js','test-bank-nppe-diagnostic-batch5.js'];
let workspace,build,packet;
test.before(async()=>{
  workspace=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-learning-'));
  for(const entry of fs.readdirSync(ROOT,{withFileTypes:true})){
    if(['.git','content','public-site','node_modules'].includes(entry.name))continue;
    fs.symlinkSync(path.join(ROOT,entry.name),path.join(workspace,entry.name),entry.isDirectory()?'dir':'file');
  }
  build=await (await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(workspace);
  packet=JSON.parse(fs.readFileSync(path.join(build.output,'nppe.json'),'utf8'));
});
test.after(()=>{if(workspace)fs.rmSync(workspace,{recursive:true,force:true});});
function learning(){const context={window:{}};vm.runInNewContext(read('test-bank-nppe-learning-batch1.js'),context);return context.window;}
function fullLearning(){const context={window:{}};vm.runInNewContext(read('test-bank-nppe-learning-batch1.js')+'\n'+read('test-bank-nppe-learning-batch2.js'),context);return context.window;}
function learningThree(){const context={window:{}};vm.runInNewContext(read('test-bank-nppe-learning-batch1.js')+'\n'+read('test-bank-nppe-learning-batch2.js')+'\n'+read('test-bank-nppe-learning-batch3.js'),context);return context.window;}
function learningFour(){const context={window:{}};vm.runInNewContext([1,2,3,4].map(i=>read('test-bank-nppe-learning-batch'+i+'.js')).join('\n'),context);return context.window;}
function learningAll(){const context={window:{}};vm.runInNewContext([1,2,3,4,5].map(i=>read('test-bank-nppe-learning-batch'+i+'.js')).join('\n'),context);return context.window;}
function legacyDiagnostic(){const context={window:{}};vm.runInNewContext(DIAG.map(read).join('\n'),context);return Array.from(context.window.NPPE_DIAGNOSTIC);}
async function browser(){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(build.shell,{url:'https://upskillsprint.com/test-bank?exam=nppe',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 dom.window.scrollTo=()=>{};dom.window.HTMLElement.prototype.scrollIntoView=()=>{};dom.window.confirm=()=>true;
 packet.scripts.forEach(code=>dom.window.eval(code));
 await new Promise(resolve=>setTimeout(resolve,70));
 return {dom,win:dom.window,doc:dom.window.document,errors,close(){dom.window.__TBCurrentAttemptReview?.destroy();dom.window.close();}};
}
function pickLearning(doc){doc.querySelector('[data-set="set-1-learning"]').click();}
test('Batch 1 contains ten original single-answer legal learning questions with all four previously missing blueprint tags',()=>{
 const q=Array.from(learning().NPPE_LEARNING_BATCH1);
 assert.equal(q.length,10);
 assert.deepEqual(q.map(x=>x.legacyId),Array.from({length:10},(_,i)=>'NPPE-'+String(i+51).padStart(3,'0')));
 assert.deepEqual(q.map(x=>x.blueprint),['IV.1','IV.1','IV.10','IV.10','IV.13','IV.13','IV.13','IV.14','IV.14','IV.14']);
 assert.deepEqual(q.map(x=>x.answer),[0,1,2,3,1,2,3,2,0,0]);
 assert.deepEqual(Object.fromEntries('ABCD'.split('').map((l,i)=>[l,q.filter(x=>x.answer===i).length])),{A:3,B:2,C:3,D:2});
 assert.ok(q.every(x=>x.form==='set-1-learning'&&x.authorSet===1&&x.batch===1&&x.bank==='learning'&&x.scored&&!x.experimental));
 assert.equal(new Set(q.map(x=>x.qid)).size,10);
 assert.equal(new Set(q.map(x=>x.questionFamily)).size,10);
 assert.ok(q.every(x=>x.options.length===4&&new Set(x.options).size===4&&x.optionRationales.length===4&&x.optionRationales.every(r=>r.length>40)));
 assert.ok(q.every(x=>x.sources.some(s=>s.sourceType==='official-blueprint')&&x.sources.some(s=>s.sourceType==='textbook'||s.sourceType==='historical-textbook-caution')));
 assert.ok(q.every(x=>x.sources.some(s=>s.sourceType!=='textbook'&&s.sourceType!=='historical-textbook-caution'&&s.sourceType!=='official-blueprint')));
 assert.ok(q.every(x=>x.sources.every(s=>s.sourceType&&s.title&&s.locator&&(!s.url||new URL(s.url).protocol==='https:'))));
 assert.ok(q.every(x=>x.learningObjective&&x.keyPoint&&x.trap&&x.why.includes('Sources:')));
 const longest=q.filter(x=>x.options[x.answer].length===Math.max(...x.options.map(a=>a.length))).length;
 assert.ok(longest<=3,'Answer-length bias detected: '+longest+'/10 correct options are longest');
 const earlier=legacyDiagnostic();assert.equal(earlier.length,50);
 const normalized=new Set(earlier.map(x=>x.stem.trim().toLowerCase()));
 assert.ok(q.every(x=>!normalized.has(x.stem.trim().toLowerCase())));
 assert.match(q[2].sources.find(s=>s.sourceType==='historical-textbook-caution').limitation,/NAFTA-era/);
 assert.match(q[3].sources.find(s=>s.sourceType==='historical-textbook-caution').limitation,/treaty supremacy/);
});
test('Batch 2 contributes ten original sourced questions across all six NPPE domains',()=>{
 const api=fullLearning(),all=Array.from(api.NPPE_LEARNING),batch1=Array.from(api.NPPE_LEARNING_BATCH1),batch2=Array.from(api.NPPE_LEARNING_BATCH2);
 assert.equal(all.length,20);assert.equal(batch1.length,10);assert.equal(batch2.length,10);
 assert.deepEqual(batch2.map(q=>q.legacyId),Array.from({length:10},(_,i)=>'NPPE-'+String(61+i).padStart(3,'0')));
 assert.deepEqual(batch2.map(q=>q.blueprint),['I.2','II.2','II.4','III.5','III.6','III.8','IV.2','IV.3','V.2','VI.4']);
 assert.deepEqual(batch2.map(q=>q.answer),[2,0,3,1,0,3,2,1,0,2]);
 assert.deepEqual(Object.fromEntries('ABCD'.split('').map((l,i)=>[l,batch2.filter(q=>q.answer===i).length])),{A:3,B:2,C:3,D:2});
 const domains={};for(const q of batch2)domains[q.area]=(domains[q.area]||0)+1;
 assert.deepEqual(domains,{I:1,II:2,III:3,IV:2,V:1,VI:1});
 assert.equal(new Set(all.map(q=>q.qid)).size,20);
 assert.equal(new Set(all.map(q=>q.questionFamily)).size,20);
 assert.ok(batch2.every(q=>q.form==='set-1-learning'&&q.bank==='learning'&&q.authorSet===1&&q.batch===2&&q.scored===true&&!q.experimental));
 assert.ok(batch2.every(q=>q.options.length===4&&new Set(q.options).size===4&&q.optionRationales.length===4&&q.optionRationales.every(r=>r.length>50)));
 assert.ok(batch2.every(q=>q.sources.some(s=>s.sourceType==='official-blueprint')&&q.sources.some(s=>s.sourceType==='textbook')));
 // Conceptual ethical theory (II.2) is textbook/blueprint-grounded; legal and regulatory items also need current primary guidance.
 assert.ok(batch2.every(q=>q.blueprint==='II.2'||q.sources.some(s=>s.sourceType.includes('regulator')||s.sourceType.includes('guidance')||s.sourceType.includes('court')||s.sourceType.includes('historical-government'))));
 assert.ok(batch2.every(q=>q.sources.every(s=>s.sourceType&&s.title&&s.locator&&(!s.url||new URL(s.url).protocol==='https:'))));
 assert.ok(batch2.every(q=>q.learningObjective&&q.keyPoint&&q.trap&&q.why.includes('Sources:')));
 assert.equal(batch2.filter(q=>q.options[q.answer].length===Math.max(...q.options.map(x=>x.length))).length,2);
 const old=legacyDiagnostic();
 assert.ok(batch2.every(q=>!old.some(d=>d.stem.trim().toLowerCase()===q.stem.trim().toLowerCase())));
 assert.match(batch2[5].jurisdiction,/British Columbia/);
 assert.match(batch2[8].jurisdiction,/British Columbia/);
 assert.match(batch2[9].jurisdiction,/Saskatchewan/);
 assert.match(batch2[8].sources[0].limitation,/Current BC firm regulation expressly includes internal practice/);
 assert.match(batch2[7].sources[0].limitation,/Supreme Court|SCC|Antrim/);
 assert.match(batch2[8].why,/Historical limitation:.*Current BC firm regulation/);
});
test('Batch 2 extension is append-only, idempotent and blocks incomplete or conflicting predecessors',()=>{
 const context={window:{}};
 vm.runInNewContext(read('test-bank-nppe-learning-batch1.js'),context);
 const original=context.window.NPPE_LEARNING,earlier=Array.from(original),before=JSON.stringify(original);
 vm.runInNewContext(read('test-bank-nppe-learning-batch2.js'),context);
 assert.equal(context.window.NPPE_LEARNING,original);
 assert.equal(original.length,20);
 assert.equal(context.window.NPPE_LEARNING_BATCH1.length,10);
 assert.equal(JSON.stringify(original.slice(0,10)),before);
 earlier.forEach((q,i)=>assert.equal(original[i],q));
 context.window.installNPPELearningBatch2();
 vm.runInNewContext(read('test-bank-nppe-learning-batch2.js'),context);
 assert.equal(original.length,20);
 assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch2.js'),{window:{}}),/Batch 1/);
 assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch2.js'),{window:{NPPE_LEARNING:original.slice(0,9)}}),/Batch 1/);
 const bad=JSON.parse(before);bad[0].authorSet=2;
 assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch2.js'),{window:{NPPE_LEARNING:bad}}),/Conflicting previous/);
 original[19].stem='A conflicting replacement';
 assert.throws(()=>context.window.installNPPELearningBatch2(),/Conflicting Learning Batch 2/);
});
test('Batch 3 adds ten unique original learning items in the planned six-domain pattern',()=>{
 const api=learningThree(),all=Array.from(api.NPPE_LEARNING),batch1=Array.from(api.NPPE_LEARNING_BATCH1),batch2=Array.from(api.NPPE_LEARNING_BATCH2),batch3=Array.from(api.NPPE_LEARNING_BATCH3);
 assert.equal(all.length,30);assert.equal(batch1.length,10);assert.equal(batch2.length,10);assert.equal(batch3.length,10);
 assert.deepEqual(batch3.map(q=>q.legacyId),Array.from({length:10},(_,i)=>'NPPE-'+String(71+i).padStart(3,'0')));
 assert.deepEqual(batch3.map(q=>q.blueprint),['I.3','II.3','II.4','III.1','III.5','III.8','IV.6','IV.7','V.2','VI.3']);
 assert.deepEqual(batch3.map(q=>q.answer),[1,3,0,2,1,3,0,2,1,2]);
 assert.deepEqual(Object.fromEntries('ABCD'.split('').map((k,i)=>[k,batch3.filter(q=>q.answer===i).length])),{A:2,B:3,C:3,D:2});
 const domains={};batch3.forEach(q=>{domains[q.area]=(domains[q.area]||0)+1;});
 assert.deepEqual(domains,{I:1,II:2,III:3,IV:2,V:1,VI:1});
 assert.equal(batch3.filter(q=>q.difficulty==='easy').length,2);
 assert.equal(batch3.filter(q=>q.difficulty==='medium').length,8);
 assert.equal(batch3.filter(q=>q.difficulty==='hard').length,0);
 assert.equal(batch3.filter(q=>q.cognitiveLevel==='understanding').length,2);
 assert.equal(batch3.filter(q=>q.cognitiveLevel==='application').length,8);
 assert.equal(batch3.filter(q=>q.cognitiveLevel==='analysis').length,0);
 assert.equal(new Set(all.map(q=>q.qid)).size,30);assert.equal(new Set(all.map(q=>q.questionFamily)).size,30);
 assert.ok(batch3.every(q=>q.bank==='learning'&&q.form==='set-1-learning'&&q.authorSet===1&&q.scored===true&&!q.experimental&&q.batch===3));
 assert.ok(batch3.every(q=>q.options.length===4&&new Set(q.options).size===4&&q.optionRationales.length===4&&q.optionRationales.every(x=>x.length>40)));
 assert.ok(batch3.every(q=>q.sources.length>=2&&q.sources.some(s=>s.sourceType==='official-blueprint')));
 assert.ok(batch3.every(q=>q.sources.every(s=>s.title&&s.locator&&s.sourceType&&(!s.url||new URL(s.url).protocol==='https:'))));
 assert.ok(batch3.every(q=>q.learningObjective&&q.keyPoint&&q.trap&&q.why.includes('Sources:')));
 assert.ok(batch3.filter(q=>q.options[q.answer].length===Math.max(...q.options.map(x=>x.length))).length<=3);
 const words=s=>s.trim().split(/\s+/).length;
 assert.ok(batch3.filter(q=>words(q.options[q.answer])<Math.min(...q.options.filter((_,i)=>i!==q.answer).map(words))).length<=3,'Shortest-answer cue detected');
 assert.match(batch3[0].questionFamily,/national-guidance-regulator-adoption/);
 assert.match(batch3[8].questionFamily,/good-character/);
 assert.ok(batch3[6].sources.some(s=>s.sourceType==='primary-legislation-bc-example'));
 assert.ok(batch3[7].sources.some(s=>s.sourceType==='primary-legislation'));
 const old=legacyDiagnostic();assert.equal(old.length,50);
 assert.ok(batch3.every(q=>!old.some(r=>r.stem.trim().toLowerCase()===q.stem.trim().toLowerCase())));
 assert.ok(batch3.every(q=>!batch1.concat(batch2).some(r=>r.stem.trim().toLowerCase()===q.stem.trim().toLowerCase())));
 assert.match(batch3[5].jurisdiction,/British Columbia/);
 assert.match(batch3[5].questionFamily,/retention.*legacy/);
 assert.match(batch3[6].questionFamily,/binding-arbitral-award/);
 assert.match(batch3[6].stem,/binding arbitration/);
 assert.ok(!batch3[6].stem.includes('mediator'));
 assert.match(batch3[9].jurisdiction,/British Columbia/);
});
test('Batch 3 appends without rewriting previous Learning objects, is idempotent, and refuses corrupted imports',()=>{
 const ctx={window:{}};
 vm.runInNewContext(read('test-bank-nppe-learning-batch1.js')+'\n'+read('test-bank-nppe-learning-batch2.js'),ctx);
 const original=ctx.window.NPPE_LEARNING,previous=Array.from(original),snapshot=JSON.stringify(original);
 assert.equal(original.length,20);
 vm.runInNewContext(read('test-bank-nppe-learning-batch3.js'),ctx);
 assert.equal(original.length,30);assert.equal(ctx.window.NPPE_LEARNING,original);
 assert.equal(JSON.stringify(original.slice(0,20)),snapshot);
 previous.forEach((q,i)=>assert.equal(original[i],q));
 assert.equal(ctx.window.NPPE_LEARNING_BATCH1.length,10);
 assert.equal(ctx.window.NPPE_LEARNING_BATCH2.length,10);
 ctx.window.installNPPELearningBatch3();
 vm.runInNewContext(read('test-bank-nppe-learning-batch3.js'),ctx);
 assert.equal(original.length,30);
 assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch3.js'),{window:{}}),/Batches 1/);
 assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch3.js'),{window:{NPPE_LEARNING:original.slice(0,19)}}),/Batches 1/);
 const changed=JSON.parse(snapshot);changed[15].authorSet=2;
 assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch3.js'),{window:{NPPE_LEARNING:changed}}),/Conflicting previous/);
 original[29].stem='Conflicting replacement';
 assert.throws(()=>ctx.window.installNPPELearningBatch3(),/Conflicting Learning Batch 3/);
});
test('Batch 4 adds ten sourced original questions with balanced keys and qualified legal assumptions',()=>{
 const api=learningFour(),all=Array.from(api.NPPE_LEARNING),q=Array.from(api.NPPE_LEARNING_BATCH4);
 assert.equal(all.length,40);assert.equal(q.length,10);
 assert.deepEqual(q.map(x=>x.legacyId),Array.from({length:10},(_,i)=>'NPPE-'+String(81+i).padStart(3,'0')));
 assert.deepEqual(q.map(x=>x.blueprint),['I.4','II.2','II.3','III.1','III.7','III.10','IV.4','IV.5','V.3','VI.1']);
 assert.deepEqual(Object.fromEntries('ABCD'.split('').map((key,i)=>[key,q.filter(x=>x.answer===i).length])),{A:3,B:2,C:2,D:3});
 assert.deepEqual(['I','II','III','IV','V','VI'].map(d=>q.filter(x=>x.area===d).length),[1,2,3,2,1,1]);
 assert.deepEqual(['I','II','III','IV','V','VI'].map(d=>all.filter(x=>x.area===d).length),[3,6,9,16,3,3]);
 assert.equal(q.filter(x=>x.difficulty==='easy'&&x.cognitiveLevel==='understanding').length,2);
 assert.equal(q.filter(x=>x.difficulty==='medium'&&x.cognitiveLevel==='application').length,8);
 assert.ok(q.every(x=>x.version===1&&x.batch===4&&x.bank==='learning'&&x.form==='set-1-learning'&&x.authorSet===1&&x.original&&x.scored&&!x.experimental));
 assert.equal(new Set(all.map(x=>x.qid)).size,40);assert.equal(new Set(all.map(x=>x.questionFamily)).size,40);
 assert.ok(q.every(x=>x.options.length===4&&new Set(x.options).size===4&&Number.isInteger(x.answer)&&x.answer>=0&&x.answer<4));
 assert.ok(q.every(x=>x.optionRationales.length===4&&x.optionRationales.every(r=>r.length>40)));
 assert.ok(q.every(x=>x.sources.length>=2&&x.sources.some(source=>source.sourceType==='official-blueprint')));
 assert.ok(q.every(x=>x.sources.every(source=>source.title&&source.locator&&source.sourceType&&(!source.url||new URL(source.url).protocol==='https:'))));
 assert.ok(q.every(x=>x.learningObjective&&x.keyPoint&&x.trap&&x.jurisdiction&&x.why.includes('Sources:')));
 assert.ok(q.every(x=>/not empirically calibrated/.test(x.difficultyBasis)&&/independent legal\/SME/.test(x.reviewStatus)));
 assert.ok(q.filter(x=>x.options[x.answer].length===Math.max(...x.options.map(option=>option.length))).length<=3,'Longest-answer cue');
 const words=x=>x.trim().split(/\s+/).length;
 assert.ok(q.filter(x=>words(x.options[x.answer])<Math.min(...x.options.filter((_,i)=>i!==x.answer).map(words))).length<=3,'Shortest-answer cue');
 assert.match(q[6].stem,/Québec.*without contractual modification/);
 assert.ok(q[6].sources.some(source=>source.sourceType==='primary-legislation-quebec'));
 assert.match(q[6].why,/Verification note:.*Full consolidated HTML retrieval was unavailable/);
 assert.match(q[7].stem,/Ontario.*non-union, indefinite-term.*provincially regulated/);
 assert.ok(q[7].sources.some(source=>source.sourceType==='primary-court-decision'));
 assert.match(q[8].jurisdiction,/Ontario.*12\(3\)\(b\)/);
 assert.match(q[9].jurisdiction,/British Columbia/);
 const ctx={window:{}};vm.runInNewContext(read('test-bank-nppe-set2.js')+'\n'+read('test-bank-nppe-set3.js'),ctx);
 const earlier=legacyDiagnostic().concat(all.slice(0,30),Array.from(ctx.window.NPPE_SET2),Array.from(ctx.window.NPPE_SET3));
 assert.equal(earlier.length,300);
 const normalize=x=>x.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 assert.ok(q.every(x=>!earlier.some(old=>normalize(old.stem)===normalize(x.stem)||old.questionFamily===x.questionFamily)));
});
test('Batch 4 preserves all thirty predecessors and rejects incomplete, altered or duplicate registrations',()=>{
 const ctx={window:{}};vm.runInNewContext([1,2,3].map(i=>read('test-bank-nppe-learning-batch'+i+'.js')).join('\n'),ctx);
 const bank=ctx.window.NPPE_LEARNING,refs=Array.from(bank),snapshot=JSON.stringify(bank);
 vm.runInNewContext(read('test-bank-nppe-learning-batch4.js'),ctx);
 assert.equal(ctx.window.NPPE_LEARNING,bank);assert.equal(bank.length,40);
 assert.equal(JSON.stringify(bank.slice(0,30)),snapshot);refs.forEach((q,i)=>assert.equal(bank[i],q));
 ctx.window.installNPPELearningBatch4();vm.runInNewContext(read('test-bank-nppe-learning-batch4.js'),ctx);assert.equal(bank.length,40);
 assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch4.js'),{window:{}}),/Batches 1/);
 assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch4.js'),{window:{NPPE_LEARNING:refs.slice(0,29)}}),/Batches 1/);
 for(const field of ['qid','authorSet','form','bank','batch']){
   const changed=JSON.parse(snapshot);changed[24][field]='conflicting';
   assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch4.js'),{window:{NPPE_LEARNING:changed}}),/Conflicting previous/);
 }
 bank[39].stem='Conflicting replacement';assert.throws(()=>ctx.window.installNPPELearningBatch4(),/Conflicting Learning Batch 4/);
});
test('Batch 5 covers the planned domains with original questions and qualified source metadata',()=>{
 const api=learningAll(),all=Array.from(api.NPPE_LEARNING),q=Array.from(api.NPPE_LEARNING_BATCH5);
 assert.equal(all.length,50);assert.equal(q.length,10);
 assert.deepEqual(q.map(x=>x.legacyId),Array.from({length:10},(_,i)=>'NPPE-'+String(91+i).padStart(3,'0')));
 assert.deepEqual(q.map(x=>x.blueprint),['I.3','II.4','II.3','III.5','III.5','III.9','IV.7','IV.12','V.2','VI.4']);
 assert.deepEqual(Object.fromEntries('ABCD'.split('').map((key,i)=>[key,q.filter(x=>x.answer===i).length])),{A:2,B:3,C:3,D:2});
 assert.deepEqual(['I','II','III','IV','V','VI'].map(d=>q.filter(x=>x.area===d).length),[1,2,3,2,1,1]);
 assert.deepEqual(['I','II','III','IV','V','VI'].map(d=>all.filter(x=>x.area===d).length),[4,8,12,18,4,4]);
 assert.deepEqual(['understanding','application','analysis'].map(level=>q.filter(x=>x.cognitiveLevel===level).length),[2,6,2]);
 assert.deepEqual(['easy','medium','hard'].map(level=>q.filter(x=>x.difficulty===level).length),[2,8,0]);
 assert.equal(new Set(all.map(x=>x.qid)).size,50);assert.equal(new Set(all.map(x=>x.questionFamily)).size,50);
 assert.ok(q.every(x=>x.version===1&&x.batch===5&&x.bank==='learning'&&x.form==='set-1-learning'&&x.authorSet===1&&x.original&&x.scored&&!x.experimental));
 assert.ok(q.every(x=>x.options.length===4&&new Set(x.options).size===4&&Number.isInteger(x.answer)&&x.answer>=0&&x.answer<4));
 assert.ok(q.every(x=>x.optionRationales.length===4&&x.optionRationales.every(r=>r.length>40)));
 assert.ok(q.every(x=>x.sources.length>=2&&x.sources.some(source=>source.sourceType==='official-blueprint')));
 assert.ok(q.every(x=>x.sources.every(source=>source.title&&source.locator&&source.sourceType&&(!source.url||new URL(source.url).protocol==='https:'))));
 assert.ok(q.every(x=>x.learningObjective&&x.keyPoint&&x.trap&&x.jurisdiction&&x.why.includes('Sources:')));
 assert.ok(q.every(x=>/not empirically calibrated/.test(x.difficultyBasis)&&/independent legal\/SME/.test(x.reviewStatus)));
 assert.ok(q.filter(x=>x.options[x.answer].length===Math.max(...x.options.map(option=>option.length))).length<=3,'Longest-answer cue');
 const words=x=>x.trim().split(/\s+/).length;
 assert.ok(q.filter(x=>words(x.options[x.answer])<Math.min(...x.options.filter((_,i)=>i!==x.answer).map(words))).length<=3,'Shortest-answer cue');
 assert.match(q[3].jurisdiction,/not asserted to regulate this non-nuclear/);
 assert.match(q[5].stem,/enforcement officer.*425\.1/);
 assert.match(q[6].why,/Historical limitation:.*adjacent publication/);
 assert.ok([q[5],q[6],q[7]].every(x=>x.sources.some(source=>source.sourceType==='primary-legislation')));
 assert.match(q[7].jurisdiction,/duty, not whether all elements of a criminal offence/);
 assert.match(q[8].jurisdiction,/Ontario.*independent responsibility/);
 const ctx={window:{}};vm.runInNewContext(read('test-bank-nppe-set2.js')+'\n'+read('test-bank-nppe-set3.js'),ctx);
 const earlier=legacyDiagnostic().concat(all.slice(0,40),Array.from(ctx.window.NPPE_SET2),Array.from(ctx.window.NPPE_SET3));assert.equal(earlier.length,310);
 const normalize=x=>x.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 assert.ok(q.every(x=>!earlier.some(old=>normalize(old.stem)===normalize(x.stem)||old.questionFamily===x.questionFamily)));
});
test('Batch 5 appends to forty unchanged predecessors and rejects corrupt or conflicting imports',()=>{
 const ctx={window:{}};vm.runInNewContext([1,2,3,4].map(i=>read('test-bank-nppe-learning-batch'+i+'.js')).join('\n'),ctx);
 const bank=ctx.window.NPPE_LEARNING,refs=Array.from(bank),snapshot=JSON.stringify(bank);
 vm.runInNewContext(read('test-bank-nppe-learning-batch5.js'),ctx);
 assert.equal(ctx.window.NPPE_LEARNING,bank);assert.equal(bank.length,50);
 assert.equal(JSON.stringify(bank.slice(0,40)),snapshot);refs.forEach((q,i)=>assert.equal(bank[i],q));
 ctx.window.installNPPELearningBatch5();vm.runInNewContext(read('test-bank-nppe-learning-batch5.js'),ctx);assert.equal(bank.length,50);
 assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch5.js'),{window:{}}),/Batches 1/);
 assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch5.js'),{window:{NPPE_LEARNING:refs.slice(0,39)}}),/Batches 1/);
 for(const field of ['qid','authorSet','form','bank','batch']){
  const changed=JSON.parse(snapshot);changed[34][field]='conflicting';
  assert.throws(()=>vm.runInNewContext(read('test-bank-nppe-learning-batch5.js'),{window:{NPPE_LEARNING:changed}}),/Conflicting previous/);
 }
 bank[49].stem='Conflicting replacement';assert.throws(()=>ctx.window.installNPPELearningBatch5(),/Conflicting Learning Batch 5/);
});
test('all fifty Learning questions register without modifying Diagnostic, Mock D or Mock E',()=>{
 const api=learningAll(),diags=[{qid:'diagnostic'}],mockD=[{qid:'mock-d'}],mockE=[{qid:'mock-e'}];
 const catalog=[{id:'set-1-learning',authorSet:1,kind:'learning',target:120}];
 const exam={formCatalog:catalog,forms:{'set-1-diagnostic':diags,'mock-d':mockD,'mock-e':mockE},fullExamQuestionsBySet:{}};
 api.registerNPPELearning(exam);api.registerNPPELearning(exam);
 assert.equal(exam.forms['set-1-learning'].length,50);
 assert.equal(exam.learning.available,50);assert.equal(exam.learning.target,120);assert.equal(exam.learning.complete,false);
 assert.equal(exam.forms['set-1-diagnostic'],diags);assert.equal(exam.forms['mock-d'],mockD);assert.equal(exam.forms['mock-e'],mockE);
 assert.equal(new Set(exam.forms['set-1-learning'].map(q=>q.qid)).size,50);
});
test('Learning registration is idempotent, author-owned, and does not change other banks',()=>{
 const api=learning();const d=[{qid:'diag'}],mockD=[{qid:'mock-d'}],mockE=[{qid:'mock-e'}];
 const e={formCatalog:[{id:'set-1-learning',kind:'learning',authorSet:1,target:120}],forms:{'set-1-diagnostic':d,'mock-d':mockD,'mock-e':mockE},fullExamQuestionsBySet:{}};
 api.registerNPPELearning(e);api.registerNPPELearning(e);
 assert.equal(e.forms['set-1-learning'].length,10);assert.equal(e.learning.target,120);assert.equal(e.learning.available,10);assert.equal(e.learning.complete,false);
 assert.equal(e.forms['set-1-diagnostic'],d);assert.equal(e.forms['mock-d'],mockD);assert.equal(e.forms['mock-e'],mockE);
 assert.throws(()=>api.registerNPPELearning({formCatalog:[{id:'set-1-learning',kind:'learning',authorSet:2}]}),/Set 1/);
 assert.throws(()=>api.registerNPPELearning({formCatalog:[{id:'set-1-learning',kind:'mock',authorSet:1}]}),/Set 1/);
 e.forms['set-1-learning']=[{qid:'corrupt'}];
 assert.throws(()=>api.registerNPPELearning(e),/Conflicting/);
});
test('protected delivery contains Learning only in NPPE package; public shell and other exams contain no learning keys',()=>{
 assert.match(packet.scripts.join('\n'),/NPPE_LEARNING_BATCH1/);
 assert.match(packet.scripts.join('\n'),/NPPE_LEARNING_BATCH2/);
 assert.match(packet.scripts.join('\n'),/NPPE_LEARNING_BATCH3/);
 assert.match(packet.scripts.join('\n'),/NPPE_LEARNING_BATCH4/);
 assert.match(packet.scripts.join('\n'),/NPPE_LEARNING_BATCH5/);
 assert.doesNotMatch(build.shell,/NPPE_LEARNING_BATCH1|NPPE_LEARNING_BATCH2|NPPE_LEARNING_BATCH3|NPPE_LEARNING_BATCH4|NPPE_LEARNING_BATCH5|nppe:set-1:learning:|A provincial statute authorizes a regulator|Before a town votes on a major water-treatment upgrade|A graduate of an accredited Canadian engineering program/);
 for(const exam of Object.keys(build.sizes).filter(x=>x!=='nppe')){
   assert.doesNotMatch(fs.readFileSync(path.join(build.output,exam+'.json'),'utf8'),/NPPE_LEARNING_BATCH1|NPPE_LEARNING_BATCH2|NPPE_LEARNING_BATCH3|NPPE_LEARNING_BATCH4|NPPE_LEARNING_BATCH5|nppe:set-1:learning:/);
 }
 assert.ok(build.sizes.nppe<5500000);
});
test('Set 1 Learning becomes available with 50 of 120, while Diagnostic and Mocks retain independent counts',async()=>{
 const h=await browser();const {doc,win,errors}=h;try{
  assert.equal(doc.querySelector('[data-set="set-1-learning"] .tb-sets').textContent,'50');
  assert.equal(doc.querySelector('[data-set="set-1-diagnostic"] .tb-sets').textContent,'50');
  assert.equal(doc.querySelector('[data-set="mock-d"] .tb-sets').textContent,'110');
  assert.equal(doc.querySelector('[data-set="mock-e"] .tb-sets').textContent,'110');
  for(const id of ['set-1-mock-a','set-1-mock-b','set-1-mock-c'])assert.equal(doc.querySelector('[data-set="'+id+'"]').disabled,true);
  pickLearning(doc);
  assert.match(doc.querySelector('#tb-overview').textContent,/50 of 120 planned/);
  assert.match(doc.querySelector('#tb-overview').textContent,/69 minutes/);
  assert.match(doc.querySelector('#tb-overview').textContent,/Partial learning bank/);
  assert.match(doc.querySelector('[data-mode="full"]').textContent,/Start Learning/);
  assert.equal(win.__TB.EXAMS.nppe.learning.target,120);
  assert.deepEqual(errors,[]);
 }finally{h.close();}
});
test('timed Learning hides answers, validates scope and permits only own fifty questions',async()=>{
 const h=await browser();const {doc,win,errors}=h;try{
  pickLearning(doc);doc.querySelector('[data-mode="full"]').click();
  const snap=win.__TB.getFeedbackSnapshot();
  assert.equal(snap.records.length,50);
  assert.ok(snap.records.every(r=>r.question.form==='set-1-learning'&&r.question.authorSet===1));
  assert.match(doc.querySelector('#tb-timer').textContent,/^(1:09:00|1:08:5[0-9])$/);
  assert.equal(doc.querySelector('[data-reveal]'),null);
  assert.equal(win.__TB.revealCurrentAnswer(),false);
  assert.equal(doc.querySelector('#tb-feedback-loop'),null);
  assert.deepEqual(errors,[]);
 }finally{h.close();}
});
test('untimed Learning allows assisted reveal without disclosing answers from other NPPE banks',async()=>{
 const h=await browser();const {doc,win,errors}=h;try{
  pickLearning(doc);doc.querySelector('[data-timing-kind="full"][data-timed="0"]').click();
  doc.querySelector('[data-mode="full"]').click();
  assert.equal(doc.querySelector('.tb-timer').textContent,'Untimed');
  const reveal=doc.querySelector('[data-reveal]');
  assert.ok(reveal,'Learning reveal control should exist in untimed mode');
  reveal.click();
  const snap=win.__TB.getFeedbackSnapshot();
  assert.equal(snap.records.filter(r=>r.revealed===true).length,1);
  assert.equal(snap.records.length,50);
  assert.match(doc.querySelector('.tb-quiz').textContent,/Reveal|Answer|Correct/i);
  assert.deepEqual(errors,[]);
 }finally{h.close();}
});
test('unassisted Learning submission gives 50/50 raw score with wrong-option explanations for all items',async()=>{
 const h=await browser();const {doc,win,errors}=h;try{
  pickLearning(doc);doc.querySelector('[data-timing-kind="full"][data-timed="0"]').click();doc.querySelector('[data-mode="full"]').click();
  const records=win.__TB.getFeedbackSnapshot().records;
  for(let i=0;i<records.length;i++){
    const id=doc.querySelector('.tb-quiz').dataset.questionId;
    const q=records.find(r=>r.question.qid===id)?.question;
    assert.ok(q,id);
    doc.querySelector('[data-opt="'+q.answer+'"]').click();
    doc.querySelector(i===records.length-1?'[data-submit]':'[data-next]').click();
  }
  await new Promise(resolve=>setTimeout(resolve,100));
  assert.match(doc.querySelector('[data-score-result]').textContent,/100% \(50\/50\)/);
  assert.match(doc.querySelector('#tb-overview').textContent,/Learning scores measure practice accuracy/);
  assert.doesNotMatch(doc.querySelector('#tb-overview').textContent,/Scored results exclude the ten experimental items/);
  doc.querySelector('[data-open-review="all"]').click();
  assert.equal(doc.querySelectorAll('.tb-review-card').length,50);
  assert.equal(doc.querySelectorAll('.tb-review-rationales').length,50);
  for(const {question:q} of records){
    const card=doc.querySelector('.tb-review-card[data-question-id="'+q.qid+'"]');
    assert.ok(card,q.qid);
    assert.equal(card.querySelectorAll('.tb-review-rationales p').length,3,q.qid);
    for(const rationale of q.optionRationales)assert.ok(card.textContent.includes(rationale),q.qid+' missing rationale');
  }
  assert.match(doc.querySelector('#tb-feedback-loop').textContent,/Why the other options are incorrect/);
  assert.match(doc.querySelector('#tb-feedback-loop').textContent,/CUSMA|treaty/);
  assert.deepEqual(errors,[]);
 }finally{h.close();}
});
test('Learning domain results preserve distinct denominators with one incorrect response per domain',async()=>{
 const h=await browser();const {doc,win}=h;try{
  pickLearning(doc);doc.querySelector('[data-mode="full"]').click();
  const records=win.__TB.getFeedbackSnapshot().records,seen=new Set();
  for(let i=0;i<records.length;i++){
    doc.querySelector('[data-goto="'+i+'"]').click();
    const q=records[i].question,wrong=!seen.has(q.area);seen.add(q.area);
    doc.querySelector('[data-opt="'+(wrong?(q.answer+1)%4:q.answer)+'"]').click();
  }
  doc.querySelector('[data-submit]').click();
  assert.match(doc.querySelector('[data-score-result]').textContent,/88% \(44\/50\)/);
  const domains=[...doc.querySelectorAll('.tb-domblock')],totals=[4,8,12,18,4,4];
  assert.equal(domains.length,6);
  domains.forEach((domain,i)=>{
    assert.ok(domain.textContent.includes('('+(totals[i]-1)+'/'+totals[i]+')'));
    assert.equal(domain.querySelector('.tb-domp').textContent,Math.round((totals[i]-1)/totals[i]*100)+'%');
  });
 }finally{h.close();}
});
test('Diagnostic and Mocks retain answer-reveal protection and independent author selectors',async()=>{
 const h=await browser();const {doc,win,errors}=h;try{
  doc.querySelector('[data-timing-kind="full"][data-timed="0"]').click();doc.querySelector('[data-mode="full"]').click();
  assert.equal(win.__TB.revealCurrentAnswer(),false);
  assert.equal(doc.querySelector('[data-reveal]'),null);
  assert.equal(win.__TB.getFeedbackSnapshot().records.length,50);
  assert.deepEqual(errors,[]);
 }finally{h.close();}
});
test('static site staging and audit reject Learning authoring JS even if contents contain no detectable questions',async()=>{
 const {stagePublicSite}=await import('../scripts/stage-public-site.mjs');
 const {auditExamPublicContent}=await import('../scripts/audit-exam-public-content.mjs');
 const t=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-learning-stage-'));
 try{
  const input=path.join(t,'in'),output=path.join(t,'out');fs.mkdirSync(input);fs.writeFileSync(path.join(input,'index.html'),'<h1>test</h1>');
  for(let number=1;number<=5;number++)fs.writeFileSync(path.join(input,'test-bank-nppe-learning-batch'+number+'.js'),'// private bank');
  await stagePublicSite(input,output);
  for(let number=1;number<=5;number++)assert.equal(fs.existsSync(path.join(output,'test-bank-nppe-learning-batch'+number+'.js')),false);
  fs.writeFileSync(path.join(output,'test-bank-nppe-learning-batch5.js'),'// private bank');
  const audit=await auditExamPublicContent(output);
  assert.equal(audit.status,'blocked');
  assert.ok(audit.findings.some(f=>f.path==='test-bank-nppe-learning-batch5.js'));
 }finally{fs.rmSync(t,{recursive:true,force:true});}
});
