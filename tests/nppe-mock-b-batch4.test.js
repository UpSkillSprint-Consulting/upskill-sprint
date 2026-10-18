'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(){const c=vm.createContext({window:{}});for(let i=1;i<=4;i++)vm.runInContext(read('test-bank-nppe-mock-b-batch'+i+'.js'),c,{filename:'mock-b-batch'+i,timeout:5000});return c.window;}
test('Batch 4 has precisely ten original items, complete rationales, source locators, 40-item bank and reserved blueprint slots',()=>{
 const w=load(),all=Array.from(w.NPPE_MOCK_B),batch=Array.from(w.NPPE_MOCK_B_BATCH4);
 assert.equal(all.length,40);assert.equal(batch.length,10);
 assert.deepEqual(batch.map(x=>x.blueprint),['III.9','IV.8','II.3','III.10','IV.9','III.1','II.4','IV.10','I.4','III.2']);
 assert.ok(Array.from(w.NPPE_MOCK_B_BATCH1).every((x,i)=>x===all[i]));
 assert.ok(Array.from(w.NPPE_MOCK_B_BATCH2).every((x,i)=>x===all[10+i]));
 assert.ok(Array.from(w.NPPE_MOCK_B_BATCH3).every((x,i)=>x===all[20+i]));
 batch.forEach((q,i)=>{
  const id=311+i;assert.equal(q.qid,'nppe:set-1:mock-b:'+id);assert.equal(q.legacyId,'NPPE-'+id);
  assert.equal(q.batch,4);assert.equal(q.version,id===320?2:1);assert.equal(q.authorSet,1);assert.equal(q.author,'ChatGPT');
  assert.equal(q.form,'set-1-mock-b');assert.equal(q.releaseStatus,'held');assert.equal(q.scored,id!==320);assert.equal(q.experimental,id===320);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.optionRationales.length,4);
  assert.ok(q.optionRationales.every(t=>t.length>=40));
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
  assert.ok(q.sources.some(s=>s.sourceType==='official-blueprint'));
  assert.ok(q.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(q.sources.every(s=>s.title&&s.locator&&new URL(s.url).protocol==='https:'));
  assert.ok(q.jurisdiction&&q.learningObjective&&q.keyPoint&&q.trap&&q.why.includes('Sources:'));
 });
 assert.equal(new Set(all.map(x=>x.qid)).size,40);
 assert.equal(new Set(all.map(x=>x.questionFamily)).size,40);
 assert.deepEqual([0,1,2,3].map(k=>batch.filter(x=>x.answer===k).length),[2,2,4,2]);
});
test('Batch 4 is idempotent and rejects missing predecessor or conflicting content',()=>{
 const w=load(),code=read('test-bank-nppe-mock-b-batch4.js'),before=JSON.stringify(w.NPPE_MOCK_B);
 vm.runInNewContext(code,{window:w});assert.equal(JSON.stringify(w.NPPE_MOCK_B),before);
 assert.throws(()=>vm.runInNewContext(code,{window:{}}),/Batches 1–3/);
 w.NPPE_MOCK_B[32].answer=(w.NPPE_MOCK_B[32].answer+1)%4;
 assert.throws(()=>vm.runInNewContext(code,{window:w}),/Conflicting/);
});
test('Mock B remains held, 40/110, without silently borrowing other banks',()=>{
 const w=load(),catalog=[{id:'set-1-mock-b',authorSet:1,kind:'mock',target:110,releaseHold:true}],exam={formCatalog:catalog,forms:{'set-1-mock-a':[Object.freeze({sentinel:true})]}};
 w.registerNPPEMockB(exam);
 assert.equal(exam.forms['set-1-mock-b'].length,40);assert.equal(catalog[0].releaseHold,true);
 assert.equal(exam.forms['set-1-mock-b'].length===catalog[0].target,false);
 assert.equal(exam.forms['set-1-mock-a'][0].sentinel,true);
 assert.throws(()=>w.registerNPPEMockB({formCatalog:[{...catalog[0],releaseHold:false}],forms:{}}),/held/);
 const build=read('scripts/build-exam-delivery.mjs');
 for(let i=1;i<=4;i++)assert.ok(build.includes('test-bank-nppe-mock-b-batch'+i+'.js'));
 for(let i=1;i<4;i++)assert.ok(build.indexOf('test-bank-nppe-mock-b-batch'+i+'.js')<build.indexOf('test-bank-nppe-mock-b-batch'+(i+1)+'.js'));
});
test('Batch 4 stays in private NPPE package and out of public or other-exam delivery',async()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-mock-b4-'));
 try{
  for(const entry of fs.readdirSync(root,{withFileTypes:true})){
   if(['.git','content','public-site','node_modules'].includes(entry.name))continue;
   fs.symlinkSync(path.join(root,entry.name),path.join(temp,entry.name),entry.isDirectory()?'dir':'file');
  }
  const built=await(await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
  const stems=Array.from(load().NPPE_MOCK_B_BATCH4,x=>x.stem);
  for(const stem of stems)assert.ok(!built.shell.includes(stem),'public shell leaked Batch 4 question');
  for(const exam of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp']){
   const raw=fs.readFileSync(path.join(built.output,exam+'.json'),'utf8');
   for(const stem of stems)assert.ok(!raw.includes(stem),'Batch 4 content leaked into '+exam);
  }
  const packet=JSON.parse(fs.readFileSync(path.join(built.output,'nppe.json'),'utf8'));
  for(const stem of stems)assert.ok(packet.scripts.some(s=>s.includes(stem)),'Missing protected Batch 4 question');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
