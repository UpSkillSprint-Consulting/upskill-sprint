'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(){const ctx=vm.createContext({window:{}});for(let i=1;i<=10;i++)vm.runInContext(read('test-bank-nppe-mock-b-batch'+i+'.js'),ctx,{filename:'mock-b-batch'+i,timeout:5000});return ctx.window;}
test('Batch 10 appends exactly NPPE-371–380 with ten scored after whole-form redistribution',()=>{
 const w=load(),all=Array.from(w.NPPE_MOCK_B),items=Array.from(w.NPPE_MOCK_B_BATCH10);
 assert.equal(all.length,100);assert.equal(items.length,10);
 assert.deepEqual(items.map(x=>x.blueprint),['IV.9','III.7','II.3','III.8','IV.10','III.9','IV.11','II.4','III.10','I.1']);
 for(let k=1;k<=9;k++)assert.ok(Array.from(w['NPPE_MOCK_B_BATCH'+k]).every((q,i)=>q===all[(k-1)*10+i]));
 items.forEach((q,i)=>{
  const id=371+i;assert.equal(q.qid,'nppe:set-1:mock-b:'+id);assert.equal(q.legacyId,'NPPE-'+id);
  assert.equal(q.batch,10);assert.ok(q.version>=([372,380].includes(id)?2:1));assert.equal(q.author,'ChatGPT');assert.equal(q.authorSet,1);
  assert.equal(q.form,'set-1-mock-b');assert.equal(q.releaseStatus,'held');
  assert.equal(q.scored,true);assert.equal(q.experimental,false);
  assert.ok(q.stem&&q.learningObjective&&q.jurisdiction&&q.keyPoint&&q.trap&&q.questionFamily);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
  assert.equal(q.optionRationales.length,4);assert.ok(q.optionRationales.every(x=>x.length>=35));
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
  assert.ok(q.sources.some(s=>s.sourceType==='official-blueprint')&&q.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(q.sources.every(s=>s.title&&s.locator&&new URL(s.url).protocol==='https:'));
  assert.ok(q.why.includes('Sources:')&&q.why.includes('Key learning point:'));
 });
 assert.equal(new Set(all.map(x=>x.qid)).size,100);
 assert.equal(new Set(all.map(x=>x.questionFamily)).size,100);
 assert.equal(all.filter(x=>x.scored&&!x.experimental).length,94);
 assert.deepEqual(all.filter(x=>x.experimental).map(x=>x.legacyId),['NPPE-282','NPPE-296','NPPE-320','NPPE-337','NPPE-349','NPPE-355']);
 assert.deepEqual([0,1,2,3].map(i=>items.filter(q=>q.answer===i).length),[2,2,3,3]);
});
test('Batch 10 registration is idempotent and rejects conflicting or missing preceding banks',()=>{
 const w=load(),src=read('test-bank-nppe-mock-b-batch10.js'),before=JSON.stringify(w.NPPE_MOCK_B);
 vm.runInNewContext(src,{window:w});assert.equal(JSON.stringify(w.NPPE_MOCK_B),before);
 assert.throws(()=>vm.runInNewContext(src,{window:{}}),/Batches 1–9/);
 w.NPPE_MOCK_B[95].answer=(w.NPPE_MOCK_B[95].answer+1)%4;
 assert.throws(()=>vm.runInNewContext(src,{window:w}),/Conflicting/);
});
test('Mock B remains held and incomplete; no bank substitution or premature scoring',()=>{
 const w=load(),form={id:'set-1-mock-b',authorSet:1,kind:'mock',target:110,releaseHold:true},exam={formCatalog:[form],forms:{'set-1-mock-a':[{sentinel:true}]}};
 w.registerNPPEMockB(exam);
 assert.equal(exam.forms['set-1-mock-b'].length,100);assert.equal(form.releaseHold,true);
 assert.equal(exam.forms['set-1-mock-b'].length===form.target,false);
 assert.equal(exam.forms['set-1-mock-a'][0].sentinel,true);
 assert.throws(()=>w.registerNPPEMockB({formCatalog:[{...form,releaseHold:false}],forms:{}}),/held/);
 const build=read('scripts/build-exam-delivery.mjs');
 for(let i=1;i<=10;i++)assert.ok(build.includes('test-bank-nppe-mock-b-batch'+i+'.js'));
 for(let i=1;i<10;i++)assert.ok(build.indexOf('test-bank-nppe-mock-b-batch'+i+'.js')<build.indexOf('test-bank-nppe-mock-b-batch'+(i+1)+'.js'));
});
test('Batch 10 stems stay out of public shell and unrelated exam packages',async()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-mock-b10-'));
 try{
  for(const e of fs.readdirSync(root,{withFileTypes:true})){
   if(['.git','content','public-site','node_modules'].includes(e.name))continue;
   fs.symlinkSync(path.join(root,e.name),path.join(temp,e.name),e.isDirectory()?'dir':'file');
  }
  const built=await(await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
  const stems=Array.from(load().NPPE_MOCK_B_BATCH10,q=>q.stem);
  for(const stem of stems)assert.ok(!built.shell.includes(stem),'public shell leaked Batch 10');
  for(const exam of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp']){
   const raw=fs.readFileSync(path.join(built.output,exam+'.json'),'utf8');
   for(const stem of stems)assert.ok(!raw.includes(stem),'Batch 10 leaked into '+exam);
  }
  const pack=JSON.parse(fs.readFileSync(path.join(built.output,'nppe.json'),'utf8'));
  for(const stem of stems)assert.ok(pack.scripts.some(x=>x.includes(stem)),'Missing protected NPPE item');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
