'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(){const ctx=vm.createContext({window:{}});for(let i=1;i<=8;i++)vm.runInContext(read('test-bank-nppe-mock-b-batch'+i+'.js'),ctx,{filename:'mock-b-batch'+i,timeout:5000});return ctx.window;}
test('Mock B Batch 8 adds complete NPPE-351–360 while preserving prior 70 objects',()=>{
 const w=load(),all=Array.from(w.NPPE_MOCK_B),items=Array.from(w.NPPE_MOCK_B_BATCH8);
 assert.equal(all.length,80);assert.equal(items.length,10);
 assert.deepEqual(items.map(q=>q.blueprint),['IV.4','II.3','III.2','IV.5','I.3','III.3','V.3','VI.3','IV.6','II.4']);
 for(let batch=1;batch<=7;batch++)assert.ok(Array.from(w['NPPE_MOCK_B_BATCH'+batch]).every((q,i)=>q===all[(batch-1)*10+i]));
 items.forEach((q,i)=>{
  const id=351+i;assert.equal(q.qid,'nppe:set-1:mock-b:'+id);assert.equal(q.legacyId,'NPPE-'+id);assert.equal(q.version,1);assert.equal(q.batch,8);
  assert.equal(q.author,'ChatGPT');assert.equal(q.authorSet,1);assert.equal(q.form,'set-1-mock-b');
  assert.equal(q.releaseStatus,'held');assert.equal(q.scored,true);assert.equal(q.experimental,false);
  assert.ok(q.jurisdiction&&q.stem&&q.learningObjective&&q.keyPoint&&q.trap);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);
  assert.ok(q.optionRationales.every(r=>r.length>=35));assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
  assert.ok(q.sources.some(s=>s.sourceType==='official-blueprint')&&q.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(q.sources.every(s=>s.title&&s.locator&&new URL(s.url).protocol==='https:'));
  assert.ok(q.why.includes('Sources:')&&q.why.includes('Key learning point:'));
 });
 assert.equal(new Set(all.map(x=>x.qid)).size,80);assert.equal(new Set(all.map(x=>x.questionFamily)).size,80);
 assert.equal(all.filter(x=>x.scored&&!x.experimental).length,80);
 assert.deepEqual([0,1,2,3].map(i=>items.filter(q=>q.answer===i).length),[1,3,3,3]);
});
test('Batch 8 reloading is idempotent; incomplete or conflicting prerequisites fail closed',()=>{
 const w=load(),code=read('test-bank-nppe-mock-b-batch8.js'),before=JSON.stringify(w.NPPE_MOCK_B);
 vm.runInNewContext(code,{window:w});assert.equal(JSON.stringify(w.NPPE_MOCK_B),before);
 assert.throws(()=>vm.runInNewContext(code,{window:{}}),/Batches 1–7/);
 w.NPPE_MOCK_B[74].answer=(w.NPPE_MOCK_B[74].answer+1)%4;
 assert.throws(()=>vm.runInNewContext(code,{window:w}),/Conflicting/);
});
test('Mock B remains held with 80/110, preserving Mock A and loading in order',()=>{
 const w=load(),form={id:'set-1-mock-b',authorSet:1,kind:'mock',target:110,releaseHold:true},exam={formCatalog:[form],forms:{'set-1-mock-a':[{sentinel:true}]}};
 w.registerNPPEMockB(exam);
 assert.equal(exam.forms['set-1-mock-b'].length,80);assert.equal(form.releaseHold,true);
 assert.equal(exam.forms['set-1-mock-a'][0].sentinel,true);
 assert.equal(exam.forms['set-1-mock-b'].length===form.target,false);
 assert.throws(()=>w.registerNPPEMockB({formCatalog:[{...form,releaseHold:false}],forms:{}}),/held/);
 const build=read('scripts/build-exam-delivery.mjs');
 for(let i=1;i<=8;i++)assert.ok(build.includes('test-bank-nppe-mock-b-batch'+i+'.js'));
 for(let i=1;i<8;i++)assert.ok(build.indexOf('test-bank-nppe-mock-b-batch'+i+'.js')<build.indexOf('test-bank-nppe-mock-b-batch'+(i+1)+'.js'));
});
test('Batch 8 questions appear only in private NPPE delivery, not public shell or unrelated banks',async()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-mock-b8-'));
 try{
  for(const entry of fs.readdirSync(root,{withFileTypes:true})){
   if(['.git','content','public-site','node_modules'].includes(entry.name))continue;
   fs.symlinkSync(path.join(root,entry.name),path.join(temp,entry.name),entry.isDirectory()?'dir':'file');
  }
  const built=await(await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
  const stems=Array.from(load().NPPE_MOCK_B_BATCH8,x=>x.stem);
  for(const stem of stems)assert.ok(!built.shell.includes(stem),'Public NPPE shell leaked Batch 8 stem');
  for(const exam of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp']){
   const raw=fs.readFileSync(path.join(built.output,exam+'.json'),'utf8');
   for(const stem of stems)assert.ok(!raw.includes(stem),'Mock B8 leaked into '+exam);
  }
  const nppe=JSON.parse(fs.readFileSync(path.join(built.output,'nppe.json'),'utf8'));
  for(const stem of stems)assert.ok(nppe.scripts.some(s=>s.includes(stem)),'Protected NPPE package missing Batch 8');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
