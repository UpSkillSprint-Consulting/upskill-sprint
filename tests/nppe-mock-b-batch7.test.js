'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(){const c=vm.createContext({window:{}});for(let n=1;n<=7;n++)vm.runInContext(read('test-bank-nppe-mock-b-batch'+n+'.js'),c,{filename:'mock-b-batch'+n,timeout:5000});return c.window;}
test('Mock B Batch 7 adds ten distinct sourced NPPE-341–350 and preserves all prior objects',()=>{
 const w=load(),all=Array.from(w.NPPE_MOCK_B),items=Array.from(w.NPPE_MOCK_B_BATCH7);
 assert.equal(all.length,70);assert.equal(items.length,10);
 assert.deepEqual(items.map(x=>x.blueprint),['IV.2','II.1','III.9','I.2','V.2','VI.2','IV.3','III.10','II.2','III.1']);
 for(let n=1;n<=6;n++)assert.ok(Array.from(w['NPPE_MOCK_B_BATCH'+n]).every((q,i)=>q===all[(n-1)*10+i]));
 items.forEach((q,i)=>{
  const id=341+i;assert.equal(q.qid,'nppe:set-1:mock-b:'+id);assert.equal(q.legacyId,'NPPE-'+id);
  assert.equal(q.batch,7);assert.equal(q.version,[345,349].includes(id)?2:1);assert.equal(q.author,'ChatGPT');assert.equal(q.authorSet,1);assert.equal(q.form,'set-1-mock-b');
  assert.equal(q.releaseStatus,'held');assert.equal(q.scored,id!==349);assert.equal(q.experimental,id===349);
  assert.ok(q.jurisdiction&&q.stem&&q.learningObjective&&q.keyPoint&&q.trap);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);
  assert.ok(q.optionRationales.every(r=>r.length>=35));assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
  assert.ok(q.sources.some(s=>s.sourceType==='official-blueprint')&&q.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(q.sources.every(s=>s.title&&s.locator&&new URL(s.url).protocol==='https:'));assert.ok(q.why.includes('Sources:'));
 });
 assert.equal(new Set(all.map(q=>q.qid)).size,70);assert.equal(new Set(all.map(q=>q.questionFamily)).size,70);
 assert.deepEqual([0,1,2,3].map(i=>items.filter(q=>q.answer===i).length),[1,3,2,4]);
});
test('Batch 7 repeated loading is atomic and refuses missing or conflicting predecessors',()=>{
 const w=load(),code=read('test-bank-nppe-mock-b-batch7.js'),before=JSON.stringify(w.NPPE_MOCK_B);
 vm.runInNewContext(code,{window:w});assert.equal(JSON.stringify(w.NPPE_MOCK_B),before);
 assert.throws(()=>vm.runInNewContext(code,{window:{}}),/Batches 1–6/);
 w.NPPE_MOCK_B[66].answer=(w.NPPE_MOCK_B[66].answer+1)%4;
 assert.throws(()=>vm.runInNewContext(code,{window:w}),/Conflicting/);
});
test('70-item partial Mock B remains held and separate from Mock A',()=>{
 const w=load(),form={id:'set-1-mock-b',authorSet:1,kind:'mock',target:110,releaseHold:true},exam={formCatalog:[form],forms:{'set-1-mock-a':[{sentinel:true}]}};
 w.registerNPPEMockB(exam);assert.equal(exam.forms['set-1-mock-b'].length,70);assert.equal(form.releaseHold,true);
 assert.equal(exam.forms['set-1-mock-a'][0].sentinel,true);assert.equal(exam.forms['set-1-mock-b'].length===form.target,false);
 assert.throws(()=>w.registerNPPEMockB({formCatalog:[{...form,releaseHold:false}],forms:{}}),/held/);
 const build=read('scripts/build-exam-delivery.mjs');
 for(let n=1;n<=7;n++)assert.ok(build.includes('test-bank-nppe-mock-b-batch'+n+'.js'));
 for(let n=1;n<7;n++)assert.ok(build.indexOf('test-bank-nppe-mock-b-batch'+n+'.js')<build.indexOf('test-bank-nppe-mock-b-batch'+(n+1)+'.js'));
});
test('Batch 7 question stems are present only in protected NPPE delivery',async()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-mock-b7-'));
 try{
  for(const e of fs.readdirSync(root,{withFileTypes:true})){
   if(['.git','content','public-site','node_modules'].includes(e.name))continue;
   fs.symlinkSync(path.join(root,e.name),path.join(temp,e.name),e.isDirectory()?'dir':'file');
  }
  const built=await(await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
  const stems=Array.from(load().NPPE_MOCK_B_BATCH7,q=>q.stem);
  for(const stem of stems)assert.ok(!built.shell.includes(stem),'public NPPE shell leaked stem');
  for(const exam of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp']){
   const raw=fs.readFileSync(path.join(built.output,exam+'.json'),'utf8');
   for(const stem of stems)assert.ok(!raw.includes(stem),'Mock B7 leaked to '+exam);
  }
  const nppe=JSON.parse(fs.readFileSync(path.join(built.output,'nppe.json'),'utf8'));
  for(const stem of stems)assert.ok(nppe.scripts.some(s=>s.includes(stem)),'Missing protected Batch 7 stem');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
