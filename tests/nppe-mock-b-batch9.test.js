'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(){const ctx=vm.createContext({window:{}});for(let i=1;i<=9;i++)vm.runInContext(read('test-bank-nppe-mock-b-batch'+i+'.js'),ctx,{filename:'mock-b-batch'+i,timeout:5000});return ctx.window;}
test('Mock B Batch 9 appends NPPE-361–370, preserves original eighty, and explains all options',()=>{
 const w=load(),all=Array.from(w.NPPE_MOCK_B),items=Array.from(w.NPPE_MOCK_B_BATCH9);
 assert.equal(all.length,90);assert.equal(items.length,10);
 assert.deepEqual(items.map(q=>q.blueprint),['III.4','IV.7','II.1','III.5','IV.8','III.6','II.2','I.4','V.4','VI.4']);
 for(let n=1;n<=8;n++)assert.ok(Array.from(w['NPPE_MOCK_B_BATCH'+n]).every((q,i)=>q===all[(n-1)*10+i]));
 items.forEach((q,i)=>{
  const id=361+i;assert.equal(q.qid,'nppe:set-1:mock-b:'+id);assert.equal(q.legacyId,'NPPE-'+id);
  assert.equal(q.batch,9);assert.equal(q.version,id===362?2:1);assert.equal(q.author,'ChatGPT');assert.equal(q.authorSet,1);
  assert.equal(q.form,'set-1-mock-b');assert.equal(q.releaseStatus,'held');assert.equal(q.scored,true);assert.equal(q.experimental,false);
  assert.ok(q.jurisdiction&&q.stem&&q.learningObjective&&q.keyPoint&&q.trap&&q.questionFamily);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);
  assert.ok(q.optionRationales.every(x=>x.length>=35));assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
  assert.ok(q.sources.some(s=>s.sourceType==='official-blueprint'));assert.ok(q.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(q.sources.every(s=>s.title&&s.locator&&new URL(s.url).protocol==='https:'));
  assert.ok(q.why.includes('Sources:')&&q.why.includes('Key learning point:'));
 });
 assert.equal(new Set(all.map(q=>q.qid)).size,90);
 assert.equal(new Set(all.map(q=>q.questionFamily)).size,90);
 assert.equal(all.filter(q=>q.scored&&!q.experimental).length,84);
 assert.deepEqual([0,1,2,3].map(i=>items.filter(q=>q.answer===i).length),[1,2,4,3]);
});
test('Batch 9 repeated loading is idempotent and missing/conflicting prerequisites fail closed',()=>{
 const w=load(),src=read('test-bank-nppe-mock-b-batch9.js'),before=JSON.stringify(w.NPPE_MOCK_B);
 vm.runInNewContext(src,{window:w});assert.equal(JSON.stringify(w.NPPE_MOCK_B),before);
 assert.throws(()=>vm.runInNewContext(src,{window:{}}),/Batches 1–8/);
 w.NPPE_MOCK_B[85].answer=(w.NPPE_MOCK_B[85].answer+1)%4;
 assert.throws(()=>vm.runInNewContext(src,{window:w}),/Conflicting/);
});
test('Batch 9 cannot bypass release hold or borrow from Mock A',()=>{
 const w=load(),form={id:'set-1-mock-b',authorSet:1,kind:'mock',target:110,releaseHold:true},exam={formCatalog:[form],forms:{'set-1-mock-a':[{sentinel:true}]}};
 w.registerNPPEMockB(exam);
 assert.equal(exam.forms['set-1-mock-b'].length,90);
 assert.equal(form.releaseHold,true);
 assert.equal(exam.forms['set-1-mock-b'].length===form.target,false);
 assert.equal(exam.forms['set-1-mock-a'][0].sentinel,true);
 assert.throws(()=>w.registerNPPEMockB({formCatalog:[{...form,releaseHold:false}],forms:{}}),/held/);
 const build=read('scripts/build-exam-delivery.mjs');
 for(let i=1;i<=9;i++)assert.ok(build.includes('test-bank-nppe-mock-b-batch'+i+'.js'));
 for(let i=1;i<9;i++)assert.ok(build.indexOf('test-bank-nppe-mock-b-batch'+i+'.js')<build.indexOf('test-bank-nppe-mock-b-batch'+(i+1)+'.js'));
});
test('Batch 9 stems are isolated to protected NPPE package, not public shell or unrelated exam content',async()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-mock-b9-'));
 try{
  for(const entry of fs.readdirSync(root,{withFileTypes:true})){
   if(['.git','content','public-site','node_modules'].includes(entry.name))continue;
   fs.symlinkSync(path.join(root,entry.name),path.join(temp,entry.name),entry.isDirectory()?'dir':'file');
  }
  const built=await(await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
  const stems=Array.from(load().NPPE_MOCK_B_BATCH9,x=>x.stem);
  for(const stem of stems)assert.ok(!built.shell.includes(stem),'Public shell leaked Batch 9');
  for(const exam of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp']){
   const raw=fs.readFileSync(path.join(built.output,exam+'.json'),'utf8');
   for(const stem of stems)assert.ok(!raw.includes(stem),'Batch 9 leaked into '+exam);
  }
  const packageNPPE=JSON.parse(fs.readFileSync(path.join(built.output,'nppe.json'),'utf8'));
  for(const stem of stems)assert.ok(packageNPPE.scripts.some(s=>s.includes(stem)),'Missing protected Batch 9 item');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
