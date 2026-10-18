'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function load(){const c=vm.createContext({window:{}});for(let n=1;n<=5;n++)vm.runInContext(read('test-bank-nppe-mock-b-batch'+n+'.js'),c,{filename:'nppe-mock-b-batch'+n,timeout:5000});return c.window;}
test('Mock B Batch 5 supplies ten original, fully sourced and rationalized NPPE-321–330 items',()=>{
 const w=load(),all=Array.from(w.NPPE_MOCK_B),b=Array.from(w.NPPE_MOCK_B_BATCH5);
 assert.equal(all.length,50);assert.equal(b.length,10);
 assert.deepEqual(b.map(x=>x.blueprint),['V.4','VI.4','IV.11','II.1','III.3','IV.12','III.4','II.2','III.5','IV.13']);
 for(let n=1;n<5;n++)assert.ok(Array.from(w['NPPE_MOCK_B_BATCH'+n]).every((x,i)=>x===all[(n-1)*10+i]));
 for(let i=0;i<10;i++){
  const x=b[i],id=321+i;
  assert.equal(x.qid,'nppe:set-1:mock-b:'+id);assert.equal(x.legacyId,'NPPE-'+id);assert.equal(x.version,[322,324].includes(id)?2:1);assert.equal(x.batch,5);
  assert.equal(x.author,'ChatGPT');assert.equal(x.authorSet,1);assert.equal(x.form,'set-1-mock-b');assert.equal(x.releaseStatus,'held');
  assert.equal(x.scored,true);assert.equal(x.experimental,false);
  assert.ok(x.jurisdiction&&x.stem&&x.learningObjective&&x.keyPoint&&x.trap);
  assert.equal(x.options.length,4);assert.equal(new Set(x.options).size,4);assert.equal(x.optionRationales.length,4);
  assert.ok(x.optionRationales.every(t=>t.length>=35));assert.ok(Number.isInteger(x.answer)&&x.answer>=0&&x.answer<4);
  assert.ok(x.sources.some(s=>s.sourceType==='official-blueprint')&&x.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(x.sources.every(s=>s.title&&s.locator&&new URL(s.url).protocol==='https:'));
  assert.ok(x.why.includes('Sources:')&&x.why.includes('Key learning point:'));
 }
 assert.equal(new Set(all.map(x=>x.qid)).size,50);assert.equal(new Set(all.map(x=>x.questionFamily)).size,50);
 assert.equal(all.filter(x=>x.scored&&!x.experimental).length,47);
 assert.deepEqual([0,1,2,3].map(k=>b.filter(x=>x.answer===k).length),[1,2,4,3]);
});
test('Batch 5 reload is idempotent and fails closed for incomplete or modified prerequisites',()=>{
 const w=load(),src=read('test-bank-nppe-mock-b-batch5.js'),snapshot=JSON.stringify(w.NPPE_MOCK_B);
 vm.runInNewContext(src,{window:w});assert.equal(JSON.stringify(w.NPPE_MOCK_B),snapshot);
 assert.throws(()=>vm.runInNewContext(src,{window:{}}),/Batches 1–4/);
 w.NPPE_MOCK_B[44].answer=(w.NPPE_MOCK_B[44].answer+1)%4;
 assert.throws(()=>vm.runInNewContext(src,{window:w}),/Conflicting/);
});
test('Mock B remains strictly held and incomplete, loader order preserved',()=>{
 const w=load(),catalog=[{id:'set-1-mock-b',authorSet:1,kind:'mock',target:110,releaseHold:true}],exam={formCatalog:catalog,forms:{'set-1-mock-a':[{sentinel:true}]}};
 w.registerNPPEMockB(exam);assert.equal(exam.forms['set-1-mock-b'].length,50);assert.equal(catalog[0].releaseHold,true);
 assert.equal(exam.forms['set-1-mock-b'].length===catalog[0].target,false);assert.equal(exam.forms['set-1-mock-a'][0].sentinel,true);
 assert.throws(()=>w.registerNPPEMockB({formCatalog:[{...catalog[0],releaseHold:false}],forms:{}}),/held/);
 const build=read('scripts/build-exam-delivery.mjs');
 for(let n=1;n<=5;n++)assert.ok(build.includes('test-bank-nppe-mock-b-batch'+n+'.js'));
 for(let n=1;n<5;n++)assert.ok(build.indexOf('test-bank-nppe-mock-b-batch'+n+'.js')<build.indexOf('test-bank-nppe-mock-b-batch'+(n+1)+'.js'));
});
test('Batch 5 stays inside NPPE protected delivery and out of public shell and other exam packages',async()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-mock-b5-'));
 try{
  for(const entry of fs.readdirSync(root,{withFileTypes:true})){
   if(['.git','content','public-site','node_modules'].includes(entry.name))continue;
   fs.symlinkSync(path.join(root,entry.name),path.join(temp,entry.name),entry.isDirectory()?'dir':'file');
  }
  const delivery=await(await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
  const stems=Array.from(load().NPPE_MOCK_B_BATCH5,q=>q.stem);
  for(const stem of stems)assert.ok(!delivery.shell.includes(stem),'Public exam shell leaked NPPE B5');
  for(const key of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp']){
   const raw=fs.readFileSync(path.join(delivery.output,key+'.json'),'utf8');
   for(const stem of stems)assert.ok(!raw.includes(stem),'Batch 5 leaked into '+key);
  }
  const pack=JSON.parse(fs.readFileSync(path.join(delivery.output,'nppe.json'),'utf8'));
  for(const stem of stems)assert.ok(pack.scripts.some(code=>code.includes(stem)),'Missing protected Batch 5 item');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
