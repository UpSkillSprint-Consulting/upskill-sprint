'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(){const context=vm.createContext({window:{}});vm.runInContext(read('test-bank-nppe-mock-b-batch1.js'),context);vm.runInContext(read('test-bank-nppe-mock-b-batch2.js'),context);return context.window;}
test('Mock B Batch 2 contains exactly ten original, sourced, held questions and preserves Batch 1 identities',()=>{
 const w=load(),items=Array.from(w.NPPE_MOCK_B),q=Array.from(w.NPPE_MOCK_B_BATCH2);
 assert.equal(items.length,20);assert.equal(q.length,10);
 assert.deepEqual(q.map(x=>x.blueprint),['IV.3','II.3','III.4','IV.4','I.2','V.2','VI.2','III.5','II.4','IV.5']);
 assert.ok(w.NPPE_MOCK_B_BATCH1.every((x,i)=>x===items[i]));
 q.forEach((x,i)=>{
  const n=291+i;assert.equal(x.qid,'nppe:set-1:mock-b:'+n);assert.equal(x.legacyId,'NPPE-'+n);
  assert.ok(x.version>=([296,300].includes(n)?2:1));assert.equal(x.authorSet,1);assert.equal(x.form,'set-1-mock-b');assert.equal(x.releaseStatus,'held');assert.equal(x.scored,n!==296);assert.equal(x.experimental,n===296);
  assert.equal(x.options.length,4);assert.equal(new Set(x.options).size,4);assert.equal(x.optionRationales.length,4);
  assert.ok(x.optionRationales.every(y=>y.length>=35));assert.ok(x.sources.some(y=>y.sourceType==='official-blueprint'));assert.ok(x.sources.some(y=>y.sourceType!=='official-blueprint'));
  assert.ok(x.sources.every(y=>y.title&&y.locator&&new URL(y.url).protocol==='https:'));assert.ok(x.why.includes('Sources:'));
 });
 assert.equal(new Set(items.map(x=>x.qid)).size,20);assert.equal(new Set(items.map(x=>x.questionFamily)).size,20);
 assert.equal(items.filter(x=>x.scored&&!x.experimental).length,18);
});
test('Mock B Batch 2 reload is idempotent and rejects malformed or conflicted prerequisites',()=>{
 const w=load(),before=JSON.stringify(w.NPPE_MOCK_B),batch=read('test-bank-nppe-mock-b-batch2.js');
 vm.runInNewContext(batch,{window:w});assert.equal(JSON.stringify(w.NPPE_MOCK_B),before);
 const malformed={window:{}};assert.throws(()=>vm.runInNewContext(batch,malformed),/Batch 1/);
 w.NPPE_MOCK_B[12].answer=(w.NPPE_MOCK_B[12].answer+1)%4;
 assert.throws(()=>vm.runInNewContext(batch,{window:w}),/Conflicting/);
});
test('Mock B remains nonlaunchable with 20/110 and explicit catalog hold',()=>{
 const w=load(),form={id:'set-1-mock-b',authorSet:1,kind:'mock',target:110,releaseHold:true};
 const exam={formCatalog:[form],forms:{}};w.registerNPPEMockB(exam);
 assert.equal(exam.forms['set-1-mock-b'].length,20);assert.equal(form.releaseHold,true);
 assert.equal(read('scripts/build-exam-delivery.mjs').includes('test-bank-nppe-mock-b-batch2.js'),true);
 assert.throws(()=>w.registerNPPEMockB({formCatalog:[{...form,releaseHold:false}],forms:{}}),/held/);
});
