'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const root=path.resolve(__dirname,'..'), read=p=>fs.readFileSync(path.join(root,p),'utf8');
function banks(){
 const c={window:{}};
 for(const file of ['test-bank-nppe-diagnostic-batch2.js','test-bank-nppe-diagnostic.js','test-bank-nppe-diagnostic-batch3.js','test-bank-nppe-diagnostic-batch4.js','test-bank-nppe-diagnostic-batch5.js',...Array.from({length:12},(_,i)=>`test-bank-nppe-learning-batch${i+1}.js`),'test-bank-nppe-set2.js','test-bank-nppe-set3.js','test-bank-nppe-mock-a-batch1.js','test-bank-nppe-mock-a-batch2.js','test-bank-nppe-mock-a-batch3.js','test-bank-nppe-mock-a-batch4.js','test-bank-nppe-mock-a-batch5.js'])vm.runInNewContext(read(file),c);
 return c.window;
}
test('Mock A contains fifty original, sourced items, independent IDs and explicit scoring roles',()=>{
 const w=banks(),q=Array.from(w.NPPE_MOCK_A),old=[...w.NPPE_DIAGNOSTIC,...w.NPPE_LEARNING,...w.NPPE_SET2,...w.NPPE_SET3];
 assert.equal(q.length,50);assert.equal(old.length,390);
 assert.deepEqual(q.map(x=>x.legacyId),Array.from({length:50},(_,i)=>'NPPE-'+(171+i)));
 assert.deepEqual(q.map(x=>x.answer),[1,3,0,2,1,2,0,3,2,1,3,1,0,2,3,1,0,3,2,0,2,0,3,1,2,1,3,0,2,1,0,3,1,2,0,3,1,2,3,0,1,3,0,2,1,3,2,0,2,1]);
 assert.deepEqual(q.map(x=>x.blueprint),['I.2','II.3','II.4','III.5','III.5','III.7','IV.7','IV.1','V.1','VI.4','II.3','II.4','III.5','III.6','IV.2','IV.3','IV.13','V.2','VI.1','III.10','I.3','II.2','II.3','III.4','III.7','III.5','IV.4','IV.5','VI.2','I.2','V.1','II.3','III.2','III.6','III.7','IV.6','IV.9','IV.12','VI.1','IV.8','I.4','II.4','II.3','III.5','III.7','IV.10','IV.13','V.4','III.10','II.4']);
 assert.equal(q.filter(x=>x.scored&&!x.experimental).length,45);assert.equal(q.filter(x=>!x.scored&&x.experimental).length,5);
 const normalized=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 for(const x of q){
  assert.ok(x.qid==='nppe:set-1:mock-a:'+x.legacyId.slice(5)&&x.form==='set-1-mock-a'&&x.bank==='mock'&&x.authorSet===1&&x.original&&x.version===1);
  assert.equal(x.sub,{'I':'nppe-professionalism','II':'nppe-ethics','III':'nppe-practice','IV':'nppe-law','V':'nppe-professional-law','VI':'nppe-discipline'}[x.area],'registered domain subtopic for '+x.legacyId);
  assert.equal(x.options.length,4);assert.equal(new Set(x.options).size,4);assert.equal(x.optionRationales.length,4);assert.ok(x.optionRationales.every(r=>r.length>40));
  assert.ok(x.sources.some(s=>s.sourceType==='official-blueprint')&&x.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(x.sources.every(s=>s.locator&&s.title&&new URL(s.url).protocol==='https:'));
  assert.ok(x.jurisdiction&&x.learningObjective&&x.keyPoint&&x.trap&&x.why.includes('Sources:'));
  assert.ok(!old.some(o=>o.qid===x.qid||o.legacyId===x.legacyId||normalized(o.stem)===normalized(x.stem)||o.questionFamily===x.questionFamily));
 }
 for(const batch of [1,2,3,4,5]){
  const items=q.filter(x=>x.batch===batch);
  assert.equal(items.length,10);
  assert.ok(items.filter(x=>x.options[x.answer].length===Math.max(...x.options.map(o=>o.length))).length<=3,'longest-key cue in batch '+batch);
  const words=s=>s.split(/\s+/).length;
  assert.ok(items.filter(x=>words(x.options[x.answer])<Math.min(...x.options.filter((_,i)=>i!==x.answer).map(words))).length<=3,'shortest-key cue in batch '+batch);
 }
 assert.deepEqual([0,1,2,3].map(a=>q.filter(x=>x.answer===a).length),[12,13,13,12]);
 assert.deepEqual(['I','II','III','IV','V','VI'].map(a=>q.filter(x=>x.area===a).length),[4,10,15,13,4,4]);
 assert.deepEqual(q.filter(x=>x.experimental).map(x=>x.legacyId),['NPPE-180','NPPE-190','NPPE-200','NPPE-210','NPPE-220']);
});
test('Learning coverage review preserves totals and explicitly versions only eight revisions',()=>{
 const q=Array.from(banks().NPPE_LEARNING),revised=['NPPE-054','NPPE-056','NPPE-058','NPPE-063','NPPE-064','NPPE-099','NPPE-106','NPPE-159'];
 assert.equal(q.length,120);assert.deepEqual(q.filter(x=>x.editorialReviewedAt==='2026-10-16').map(x=>x.legacyId),revised);
 assert.deepEqual(['I','II','III','IV','V','VI'].map(d=>q.filter(x=>x.area===d).length),[10,22,36,32,10,10]);
 assert.ok(q.every(x=>x.version===(revised.includes(x.legacyId)||x.batch===3?2:1)));
 const expected=['I','II','III','IV','V','VI'].flatMap((d,i)=>Array.from({length:[4,4,10,14,4,4][i]},(_,j)=>d+'.'+(j+1)));
 assert.deepEqual([...new Set(q.map(x=>x.blueprint))].sort(),expected.sort());
 assert.equal(q.find(x=>x.legacyId==='NPPE-099').blueprint,'V.1');assert.equal(q.find(x=>x.legacyId==='NPPE-159').blueprint,'V.4');
 assert.match(q.find(x=>x.legacyId==='NPPE-106').stem,/continuing work/);
 assert.deepEqual(['understanding','application','analysis'].map(c=>q.filter(x=>x.cognitiveLevel===c).length),[23,79,18]);
 assert.deepEqual(['easy','medium','hard'].map(c=>q.filter(x=>x.difficulty===c).length),[23,97,0]);
});
test('Mock A registration is idempotent and refuses a conflicting bank or wrong catalog',()=>{
 const w=banks(),learning=w.NPPE_LEARNING,diag=w.NPPE_DIAGNOSTIC;
 const e={formCatalog:[{id:'set-1-mock-a',authorSet:1,kind:'mock',target:110}],forms:{'set-1-learning':learning,'set-1-diagnostic':diag}};
 w.registerNPPEMockA(e);w.registerNPPEMockA(e);
 assert.equal(e.forms['set-1-mock-a'],w.NPPE_MOCK_A);assert.equal(e.forms['set-1-learning'],learning);assert.equal(e.forms['set-1-diagnostic'],diag);
 e.forms['set-1-mock-a']=[];assert.throws(()=>w.registerNPPEMockA(e),/Conflicting/);
 e.formCatalog[0].authorSet=2;assert.throws(()=>w.registerNPPEMockA(e),/catalog/);
});
test('protected build carries Mock A only inside NPPE and never in public shell',async()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'mock-a-'));
 try{
  for(const e of fs.readdirSync(root,{withFileTypes:true}))if(!['.git','content','public-site','node_modules'].includes(e.name))fs.symlinkSync(path.join(root,e.name),path.join(temp,e.name),e.isDirectory()?'dir':'file');
  const build=await(await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
  const needles=['nppe:set-1:mock-a:','mock-a-essential-service-continuity-public-welfare',banks().NPPE_MOCK_A[0].stem,banks().NPPE_MOCK_A[10].stem,'mock-a-supervisor-addresses-sexist-project-chat',banks().NPPE_MOCK_A[20].stem,'mock-a-geoscience-groundwater-interpretation-not-only-extraction',...[...banks().NPPE_MOCK_A_BATCH4,...banks().NPPE_MOCK_A_BATCH5].flatMap(q=>[q.stem,q.questionFamily,q.legacyId])];
  for(const needle of needles)assert.ok(!build.shell.includes(needle));
  for(const exam of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp'])for(const needle of needles)assert.ok(!fs.readFileSync(path.join(build.output,exam+'.json'),'utf8').includes(needle));
  const packet=fs.readFileSync(path.join(build.output,'nppe.json'),'utf8');assert.ok(packet.includes('mock-a-essential-service-continuity-public-welfare'));assert.ok(packet.includes('mock-a-supervisor-addresses-sexist-project-chat'));assert.ok(packet.includes('mock-a-geoscience-groundwater-interpretation-not-only-extraction'));
  const scripts=JSON.parse(packet).scripts,context={window:{}};
  const a1=scripts.indexOf(read('test-bank-nppe-mock-a-batch1.js')),a2=scripts.indexOf(read('test-bank-nppe-mock-a-batch2.js')),a3=scripts.indexOf(read('test-bank-nppe-mock-a-batch3.js')),a4=scripts.indexOf(read('test-bank-nppe-mock-a-batch4.js')),a5=scripts.indexOf(read('test-bank-nppe-mock-a-batch5.js'));
  assert.ok(a1>=0&&a2>a1&&a3>a2&&a4>a3&&a5>a4,'protected packet must load the exact authoring scripts in dependency order');
  for(const code of [scripts[a1],scripts[a2],scripts[a3],scripts[a4],scripts[a5]])vm.runInNewContext(code,context);
  assert.equal(context.window.NPPE_MOCK_A.length,50);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});

test('Batch 2 append preserves all existing objects and rejects partial or conflicting reloads atomically',()=>{
 const w=banks(), before=JSON.stringify(w), first=w.NPPE_MOCK_A.slice(0,10);
 const code=read('test-bank-nppe-mock-a-batch2.js');
 vm.runInNewContext(code,{window:w});
 assert.equal(JSON.stringify(w),before);
 assert.ok(first.every((q,i)=>q===w.NPPE_MOCK_A[i]&&q===w.NPPE_MOCK_A_BATCH1[i]));
 assert.equal(w.NPPE_MOCK_A_BATCH2.length,10);
 const absent={window:{}};assert.throws(()=>vm.runInNewContext(code,absent),/Batch 1 must load/);
 w.NPPE_MOCK_A[10].answer=0;
 const conflict=JSON.stringify(w);assert.throws(()=>vm.runInNewContext(code,{window:w}),/Conflicting/);assert.equal(JSON.stringify(w),conflict);
 const partial=banks();partial.NPPE_MOCK_A.splice(15);
 const state=JSON.stringify(partial);assert.throws(()=>vm.runInNewContext(code,{window:partial}),/Conflicting/);assert.equal(JSON.stringify(partial),state);
});


test('Batch 3 preserves predecessor identities and the registration closure; reload failures are atomic',()=>{
 const code=read('test-bank-nppe-mock-a-batch3.js'),c={window:{}};
 for(const file of ['test-bank-nppe-mock-a-batch1.js','test-bank-nppe-mock-a-batch2.js'])vm.runInNewContext(read(file),c);
 const w=c.window, original=w.NPPE_MOCK_A, prior=original.slice(), json=JSON.stringify(prior);
 const e={formCatalog:[{id:'set-1-mock-a',authorSet:1,kind:'mock',target:110}],forms:{}};
 vm.runInNewContext(code,c);w.registerNPPEMockA(e);
 assert.equal(w.NPPE_MOCK_A,original);assert.equal(e.forms['set-1-mock-a'],original);assert.equal(original.length,30);
 assert.equal(JSON.stringify(original.slice(0,20)),json);
 assert.ok(prior.every((q,i)=>q===original[i]&&q===(i<10?w.NPPE_MOCK_A_BATCH1[i]:w.NPPE_MOCK_A_BATCH2[i-10])));
 const before=JSON.stringify(w);vm.runInNewContext(code,c);assert.equal(JSON.stringify(w),before);assert.equal(w.NPPE_MOCK_A_BATCH3.length,10);
 for(const missing of [{window:{}},{window:{NPPE_MOCK_A:[],NPPE_MOCK_A_BATCH1:[]}}])assert.throws(()=>vm.runInNewContext(code,missing),/Batches 1 and 2 must load/);
 for(const mutate of [w=>w.NPPE_MOCK_A.splice(25),w=>w.NPPE_MOCK_A[20].answer=0,w=>w.NPPE_MOCK_A.reverse(),w=>w.NPPE_MOCK_A.splice(20,10,...w.NPPE_MOCK_A.slice(20).reverse())]){
  const bad=banks();mutate(bad);const state=JSON.stringify(bad);
  assert.throws(()=>vm.runInNewContext(code,{window:bad}),/Conflicting|Unexpected/);assert.equal(JSON.stringify(bad),state);
 }
});


test('Batch 4 appends atomically, preserves all predecessor identities and retains registration closure',()=>{
 const code=read('test-bank-nppe-mock-a-batch4.js'),c={window:{}};
 for(const batch of [1,2,3])vm.runInNewContext(read(`test-bank-nppe-mock-a-batch${batch}.js`),c);
 const w=c.window,original=w.NPPE_MOCK_A,prior=original.slice(),json=JSON.stringify(prior);
 const e={formCatalog:[{id:'set-1-mock-a',authorSet:1,kind:'mock',target:110}],forms:{}};
 vm.runInNewContext(code,c);w.registerNPPEMockA(e);
 assert.equal(w.NPPE_MOCK_A,original);assert.equal(e.forms['set-1-mock-a'],original);assert.equal(original.length,40);
 assert.equal(JSON.stringify(original.slice(0,30)),json);
 assert.ok(prior.every((q,i)=>q===original[i]&&q===w['NPPE_MOCK_A_BATCH'+(Math.floor(i/10)+1)][i%10]));
 const before=JSON.stringify(w);vm.runInNewContext(code,c);assert.equal(JSON.stringify(w),before);assert.equal(w.NPPE_MOCK_A_BATCH4.length,10);
 for(const missing of [{window:{}},{window:{NPPE_MOCK_A:[],NPPE_MOCK_A_BATCH1:[]}}, {window:{...w,NPPE_MOCK_A_BATCH3:undefined}}])assert.throws(()=>vm.runInNewContext(code,missing),/Batches 1–3 must load/);
 for(const mutate of [w=>w.NPPE_MOCK_A.splice(35),w=>w.NPPE_MOCK_A[30].answer=1,w=>w.NPPE_MOCK_A.reverse(),w=>w.NPPE_MOCK_A.splice(30,10,...w.NPPE_MOCK_A.slice(30).reverse())]){
  const bad=banks();mutate(bad);const state=JSON.stringify(bad);
  assert.throws(()=>vm.runInNewContext(code,{window:bad}),/Conflicting|Unexpected/);assert.equal(JSON.stringify(bad),state);
 }
});

test('Batch 5 appends atomically, preserves all predecessor identities and retains registration closure',()=>{
 const code=read('test-bank-nppe-mock-a-batch5.js'),c={window:{}};
 for(const batch of [1,2,3,4])vm.runInNewContext(read(`test-bank-nppe-mock-a-batch${batch}.js`),c);
 const w=c.window,original=w.NPPE_MOCK_A,prior=original.slice(),json=JSON.stringify(prior);
 const e={formCatalog:[{id:'set-1-mock-a',authorSet:1,kind:'mock',target:110}],forms:{}};
 vm.runInNewContext(code,c);w.registerNPPEMockA(e);
 assert.equal(w.NPPE_MOCK_A,original);assert.equal(e.forms['set-1-mock-a'],original);assert.equal(original.length,50);
 assert.equal(JSON.stringify(original.slice(0,40)),json);
 assert.ok(prior.every((q,i)=>q===original[i]&&q===w['NPPE_MOCK_A_BATCH'+(Math.floor(i/10)+1)][i%10]));
 const before=JSON.stringify(w);vm.runInNewContext(code,c);assert.equal(JSON.stringify(w),before);assert.equal(w.NPPE_MOCK_A_BATCH5.length,10);
 for(const missing of [{window:{}},{window:{NPPE_MOCK_A:[],NPPE_MOCK_A_BATCH1:[]}}, {window:{...w,NPPE_MOCK_A_BATCH4:undefined}}])assert.throws(()=>vm.runInNewContext(code,missing),/Batches 1–4 must load/);
 for(const mutate of [w=>w.NPPE_MOCK_A.splice(45),w=>w.NPPE_MOCK_A[40].answer=0,w=>w.NPPE_MOCK_A.reverse(),w=>w.NPPE_MOCK_A.splice(40,10,...w.NPPE_MOCK_A.slice(40).reverse())]){
  const bad=banks();mutate(bad);const state=JSON.stringify(bad);
  assert.throws(()=>vm.runInNewContext(code,{window:bad}),/Conflicting|Unexpected/);assert.equal(JSON.stringify(bad),state);
 }
});
