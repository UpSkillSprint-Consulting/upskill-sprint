'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(){const c=vm.createContext({window:{}});for(let i=1;i<=3;i++)vm.runInContext(read('test-bank-nppe-mock-b-batch'+i+'.js'),c,{filename:'mock-b-batch'+i,timeout:5000});return c.window;}
test('Mock B Batch 3 loads exactly NPPE-301–310, preserving 20 preceding objects and four reasoned alternatives',()=>{
 const w=load(),q=Array.from(w.NPPE_MOCK_B),batch=Array.from(w.NPPE_MOCK_B_BATCH3);
 assert.equal(q.length,30);assert.equal(batch.length,10);
 assert.deepEqual(batch.map(x=>x.blueprint),['III.6','IV.6','II.1','III.7','III.8','IV.7','I.3','V.3','VI.3','II.2']);
 assert.ok(Array.from(w.NPPE_MOCK_B_BATCH1).every((x,i)=>x===q[i]));
 assert.ok(Array.from(w.NPPE_MOCK_B_BATCH2).every((x,i)=>x===q[10+i]));
 batch.forEach((x,i)=>{
  const id=301+i;assert.equal(x.qid,'nppe:set-1:mock-b:'+id);assert.equal(x.legacyId,'NPPE-'+id);
  assert.equal(x.version,id===309?2:1);assert.equal(x.batch,3);assert.equal(x.authorSet,1);assert.equal(x.author,'ChatGPT');assert.equal(x.form,'set-1-mock-b');assert.equal(x.releaseStatus,'held');
  assert.equal(x.scored,true);assert.equal(x.experimental,false);assert.ok(['understanding','application','analysis'].includes(x.cognitiveLevel));
  assert.equal(x.options.length,4);assert.equal(new Set(x.options).size,4);assert.equal(x.optionRationales.length,4);
  assert.ok(x.optionRationales.every(a=>a.length>=35));assert.ok(Number.isInteger(x.answer)&&x.answer>=0&&x.answer<4);
  assert.ok(x.sources.some(s=>s.sourceType==='official-blueprint'));assert.ok(x.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(x.sources.every(s=>s.title&&s.locator&&new URL(s.url).protocol==='https:'));
  assert.ok(x.why.includes('Sources:')&&x.learningObjective&&x.keyPoint&&x.trap&&x.jurisdiction);
 });
 assert.equal(new Set(q.map(x=>x.qid)).size,30);assert.equal(new Set(q.map(x=>x.questionFamily)).size,30);
 assert.deepEqual([0,1,2,3].map(k=>batch.filter(x=>x.answer===k).length),[2,2,3,3]);
});
test('Batch 3 repeated load is idempotent and conflicting or out-of-order banks fail closed',()=>{
 const w=load(),code=read('test-bank-nppe-mock-b-batch3.js'),before=JSON.stringify(w.NPPE_MOCK_B);
 vm.runInNewContext(code,{window:w});assert.equal(JSON.stringify(w.NPPE_MOCK_B),before);
 assert.throws(()=>vm.runInNewContext(code,{window:{}}),/Batches 1–2/);
 w.NPPE_MOCK_B[22].answer=(w.NPPE_MOCK_B[22].answer+1)%4;assert.throws(()=>vm.runInNewContext(code,{window:w}),/Conflicting/);
});
test('30-item partial Mock B remains held and cannot satisfy full-form count',()=>{
 const w=load(),form={id:'set-1-mock-b',authorSet:1,kind:'mock',target:110,releaseHold:true},exam={formCatalog:[form],forms:{}};
 w.registerNPPEMockB(exam);assert.equal(exam.forms['set-1-mock-b'].length,30);assert.equal(form.releaseHold,true);
 assert.equal(exam.forms['set-1-mock-b'].length===form.target,false);
 assert.throws(()=>w.registerNPPEMockB({formCatalog:[{...form,releaseHold:false}],forms:{}}),/held/);
 const build=read('scripts/build-exam-delivery.mjs');
 assert.ok(build.includes('test-bank-nppe-mock-b-batch3.js'));
 assert.ok(build.indexOf('test-bank-nppe-mock-b-batch1.js')<build.indexOf('test-bank-nppe-mock-b-batch2.js'));
 assert.ok(build.indexOf('test-bank-nppe-mock-b-batch2.js')<build.indexOf('test-bank-nppe-mock-b-batch3.js'));
});

test('protected delivery contains Batch 3 only in NPPE, not public shell or other packages',async()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-mock-b3-'));
 try{
  for(const entry of fs.readdirSync(root,{withFileTypes:true})){
   if(['.git','content','public-site','node_modules'].includes(entry.name))continue;
   fs.symlinkSync(path.join(root,entry.name),path.join(temp,entry.name),entry.isDirectory()?'dir':'file');
  }
  const built=await(await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
  const stems=Array.from(load().NPPE_MOCK_B_BATCH3,x=>x.stem);
  for(const stem of stems)assert.ok(!built.shell.includes(stem),'Public shell leaked a Batch 3 stem');
  for(const exam of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp']){
   const raw=fs.readFileSync(path.join(built.output,exam+'.json'),'utf8');
   for(const stem of stems)assert.ok(!raw.includes(stem),'Batch 3 content leaked to '+exam);
  }
  const pack=JSON.parse(fs.readFileSync(path.join(built.output,'nppe.json'),'utf8'));
  for(const stem of stems)assert.ok(pack.scripts.some(code=>code.includes(stem)),'Missing protected item');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
