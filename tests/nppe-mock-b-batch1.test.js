'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ROOT=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
function load(){const context=vm.createContext({window:{}});vm.runInContext(read('test-bank-nppe-mock-b-batch1.js'),context);return context.window;}
test('Mock B Batch 1 has exactly ten independently keyed sourced objects and reserved IDs',()=>{
 const w=load(),q=Array.from(w.NPPE_MOCK_B);assert.equal(q.length,10);assert.equal(w.NPPE_MOCK_B_BATCH1.length,10);
 const expected=['I.1','II.1','III.1','IV.1','V.1','VI.1','III.2','IV.2','II.2','III.3'];assert.deepEqual(q.map(x=>x.blueprint),expected);
 for(let i=0;i<10;i++){const x=q[i],id=281+i;
  assert.equal(x.legacyId,'NPPE-'+id);assert.equal(x.qid,'nppe:set-1:mock-b:'+id);
  assert.equal(x.version,1);assert.equal(x.author,'ChatGPT');assert.equal(x.authorSet,1);
  assert.equal(x.form,'set-1-mock-b');assert.equal(x.scored,true);assert.equal(x.experimental,false);
  assert.equal(x.releaseStatus,'held');assert.equal(x.options.length,4);assert.equal(x.optionRationales.length,4);
  assert.ok(x.options.every(Boolean)&&new Set(x.options).size===4);
  assert.ok(Number.isInteger(x.answer)&&x.answer>=0&&x.answer<=3);
  assert.ok(x.sources.some(s=>s.sourceType==='official-blueprint'));
  assert.ok(x.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(x.sources.every(s=>s.title&&s.locator&&new URL(s.url).protocol==='https:'));
  assert.ok(x.why.includes('Sources:')&&x.keyPoint&&x.trap&&x.learningObjective);
 }
 assert.equal(new Set(q.map(x=>x.questionFamily)).size,10);
});
test('Mock B registrar is idempotent, isolated and refuses unheld form or conflicting content',()=>{
 const w=load(),form={id:'set-1-mock-b',authorSet:1,kind:'mock',target:110,releaseHold:true};
 const exam={formCatalog:[form],forms:{'set-1-mock-a':[{sentinel:true}]}};
 w.registerNPPEMockB(exam);w.registerNPPEMockB(exam);
 assert.equal(exam.forms['set-1-mock-b'],w.NPPE_MOCK_B);assert.equal(exam.forms['set-1-mock-a'][0].sentinel,true);
 exam.forms['set-1-mock-b']=[];assert.throws(()=>w.registerNPPEMockB(exam),/Conflicting/);
 exam.forms['set-1-mock-b']=w.NPPE_MOCK_B;form.releaseHold=false;
 assert.throws(()=>w.registerNPPEMockB(exam),/held/);
});
test('protected NPPE build references Mock B and non-NPPE banks stay separate',()=>{
 const build=read('scripts/build-exam-delivery.mjs'),runtime=read('scripts/nppe-diagnostic-runtime.mjs');
 assert.match(build,/test-bank-nppe-mock-b-batch1\.js/);
 assert.match(runtime,/window\.registerNPPEMockB\(EXAMS\.nppe\)/);
 assert.match(runtime,/if\(!formReady\(e,setId\)\)return \[\]/);
});

test('protected delivery contains Mock B only in NPPE, never public shell or other exams',async()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'nppe-mock-b-'));
 try{
  for(const entry of fs.readdirSync(ROOT,{withFileTypes:true})){
   if(['.git','content','public-site','node_modules'].includes(entry.name))continue;
   fs.symlinkSync(path.join(ROOT,entry.name),path.join(temp,entry.name),entry.isDirectory()?'dir':'file');
  }
  const delivery=await(await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
  const stem=load().NPPE_MOCK_B[0].stem;
  assert.ok(!delivery.shell.includes(stem));assert.ok(!delivery.shell.includes('nppe:set-1:mock-b:281'));
  for(const key of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp']){
   const raw=fs.readFileSync(path.join(delivery.output,key+'.json'),'utf8');
   assert.ok(!raw.includes(stem),'Mock B leaked into '+key);
  }
  const packet=JSON.parse(fs.readFileSync(path.join(delivery.output,'nppe.json'),'utf8'));
  assert.ok(packet.scripts.some(x=>x.includes(stem)));
  assert.ok(packet.scripts.some(x=>x.includes('registerNPPEMockB(EXAMS.nppe)')));
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
