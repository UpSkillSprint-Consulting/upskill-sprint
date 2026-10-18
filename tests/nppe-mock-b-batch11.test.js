'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(){const ctx=vm.createContext({window:{}});for(let i=1;i<=11;i++)vm.runInContext(read('test-bank-nppe-mock-b-batch'+i+'.js'),ctx,{filename:'mock-b-batch'+i,timeout:5000});return ctx.window;}
test('Final Mock B Batch 11 contains 381–390, correct blueprint, rationales and stable predecessor identities',()=>{
 const w=load(),all=Array.from(w.NPPE_MOCK_B),batch=Array.from(w.NPPE_MOCK_B_BATCH11);
 assert.equal(all.length,110);assert.equal(batch.length,10);
 assert.deepEqual(batch.map(x=>x.blueprint),['V.1','VI.1','IV.12','II.1','III.1','IV.13','III.2','II.2','IV.14','III.3']);
 for(let n=1;n<=10;n++)assert.ok(Array.from(w['NPPE_MOCK_B_BATCH'+n]).every((q,i)=>q===all[(n-1)*10+i]));
 batch.forEach((q,i)=>{
  const id=381+i;
  assert.equal(q.qid,'nppe:set-1:mock-b:'+id);assert.equal(q.legacyId,'NPPE-'+id);
  assert.equal(q.batch,11);assert.equal(q.version,[381,384,385,387,388].includes(id)?2:1);assert.equal(q.author,'ChatGPT');assert.equal(q.authorSet,1);assert.equal(q.form,'set-1-mock-b');
  assert.equal(q.releaseStatus,'held');assert.equal(q.scored,[381,383,384,385,387,388].includes(id));assert.equal(q.experimental,[382,386,389,390].includes(id));
  assert.ok(q.jurisdiction&&q.stem&&q.learningObjective&&q.keyPoint&&q.trap&&q.questionFamily);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);
  assert.ok(q.optionRationales.every(s=>s.length>=35));assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
  assert.ok(q.sources.some(s=>s.sourceType==='official-blueprint')&&q.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(q.sources.every(s=>s.title&&s.locator&&new URL(s.url).protocol==='https:'));
  assert.ok(q.why.includes('Sources:')&&q.why.includes('Key learning point:'));
 });
 assert.equal(new Set(all.map(q=>q.qid)).size,110);
 assert.equal(new Set(all.map(q=>q.questionFamily)).size,110);
 assert.equal(all.filter(q=>q.scored===true&&q.experimental!==true).length,100);
 assert.deepEqual(all.filter(q=>q.experimental===true).map(q=>q.legacyId),['NPPE-282','NPPE-296','NPPE-320','NPPE-337','NPPE-349','NPPE-355','NPPE-382','NPPE-386','NPPE-389','NPPE-390']);
 const plan=read('docs/nppe-mock-b-allocation-ledger.csv').trim().split(/\r?\n/).slice(1).map(row=>row.split(','));
 assert.equal(plan.length,110);
 for(let i=0;i<110;i++){
  assert.equal(all[i].legacyId,plan[i][0]);
  assert.equal(all[i].blueprint,plan[i][2]);
  assert.equal(plan[i][4],all[i].experimental?'simulated_unscored':'scored');
  assert.equal(plan[i][5],'authored_held');
 }
});
test('Batch 11 reloading is idempotent and missing or conflicting prerequisites fail closed',()=>{
 const w=load(),src=read('test-bank-nppe-mock-b-batch11.js'),snapshot=JSON.stringify(w.NPPE_MOCK_B);
 vm.runInNewContext(src,{window:w});assert.equal(JSON.stringify(w.NPPE_MOCK_B),snapshot);
 assert.throws(()=>vm.runInNewContext(src,{window:{}}),/Batches 1–10/);
 w.NPPE_MOCK_B[105].answer=(w.NPPE_MOCK_B[105].answer+1)%4;
 assert.throws(()=>vm.runInNewContext(src,{window:w}),/Conflicting/);
});
test('Completed Mock B is still held and must not affect other Set 1 mock',()=>{
 const w=load(),form={id:'set-1-mock-b',authorSet:1,kind:'mock',target:110,releaseHold:true},exam={formCatalog:[form],forms:{'set-1-mock-a':[{sentinel:true}]}};
 w.registerNPPEMockB(exam);
 assert.equal(exam.forms['set-1-mock-b'].length,110);assert.equal(form.releaseHold,true);
 assert.equal(exam.forms['set-1-mock-a'][0].sentinel,true);
 assert.throws(()=>w.registerNPPEMockB({formCatalog:[{...form,releaseHold:false}],forms:{}}),/held/);
 const build=read('scripts/build-exam-delivery.mjs');
 for(let i=1;i<=11;i++)assert.ok(build.includes('test-bank-nppe-mock-b-batch'+i+'.js'));
 for(let i=1;i<11;i++)assert.ok(build.indexOf('test-bank-nppe-mock-b-batch'+i+'.js')<build.indexOf('test-bank-nppe-mock-b-batch'+(i+1)+'.js'));
});
test('Final Mock B questions remain NPPE-private; no public shell or cross-exam leak',async()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-mock-b11-'));
 try{
  for(const e of fs.readdirSync(root,{withFileTypes:true})){
   if(['.git','content','public-site','node_modules'].includes(e.name))continue;
   fs.symlinkSync(path.join(root,e.name),path.join(temp,e.name),e.isDirectory()?'dir':'file');
  }
  const built=await(await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
  const stems=Array.from(load().NPPE_MOCK_B_BATCH11,q=>q.stem);
  for(const stem of stems)assert.ok(!built.shell.includes(stem),'Public shell leaked Mock B11 item');
  for(const exam of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp']){
   const raw=fs.readFileSync(path.join(built.output,exam+'.json'),'utf8');
   for(const stem of stems)assert.ok(!raw.includes(stem),'Mock B11 leaked into '+exam);
  }
  const pack=JSON.parse(fs.readFileSync(path.join(built.output,'nppe.json'),'utf8'));
  for(const stem of stems)assert.ok(pack.scripts.some(script=>script.includes(stem)),'Missing B11 private item');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
