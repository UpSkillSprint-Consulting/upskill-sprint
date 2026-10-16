'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const root=path.resolve(__dirname,'..'), read=p=>fs.readFileSync(path.join(root,p),'utf8');
function banks(){
 const c={window:{}};
 for(const file of ['test-bank-nppe-diagnostic-batch2.js','test-bank-nppe-diagnostic.js','test-bank-nppe-diagnostic-batch3.js','test-bank-nppe-diagnostic-batch4.js','test-bank-nppe-diagnostic-batch5.js',...Array.from({length:12},(_,i)=>`test-bank-nppe-learning-batch${i+1}.js`),'test-bank-nppe-set2.js','test-bank-nppe-set3.js','test-bank-nppe-mock-a-batch1.js'])vm.runInNewContext(read(file),c);
 return c.window;
}
test('Mock A starts with ten original, sourced items, independent IDs and explicit scoring roles',()=>{
 const w=banks(),q=Array.from(w.NPPE_MOCK_A),old=[...w.NPPE_DIAGNOSTIC,...w.NPPE_LEARNING,...w.NPPE_SET2,...w.NPPE_SET3];
 assert.equal(q.length,10);assert.equal(old.length,390);
 assert.deepEqual(q.map(x=>x.legacyId),Array.from({length:10},(_,i)=>'NPPE-'+(171+i)));
 assert.deepEqual(q.map(x=>x.answer),[1,3,0,2,1,2,0,3,2,1]);
 assert.deepEqual(q.map(x=>x.blueprint),['I.2','II.3','II.4','III.5','III.5','III.7','IV.7','IV.1','V.1','VI.4']);
 assert.equal(q.filter(x=>x.scored&&!x.experimental).length,9);assert.equal(q.filter(x=>!x.scored&&x.experimental).length,1);
 const normalized=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 for(const x of q){
  assert.ok(x.qid==='nppe:set-1:mock-a:'+x.legacyId.slice(5)&&x.form==='set-1-mock-a'&&x.bank==='mock'&&x.authorSet===1&&x.original&&x.version===1);
  assert.equal(x.options.length,4);assert.equal(new Set(x.options).size,4);assert.equal(x.optionRationales.length,4);assert.ok(x.optionRationales.every(r=>r.length>40));
  assert.ok(x.sources.some(s=>s.sourceType==='official-blueprint')&&x.sources.some(s=>s.sourceType!=='official-blueprint'));
  assert.ok(x.sources.every(s=>s.locator&&s.title&&new URL(s.url).protocol==='https:'));
  assert.ok(x.jurisdiction&&x.learningObjective&&x.keyPoint&&x.trap&&x.why.includes('Sources:'));
  assert.ok(!old.some(o=>o.qid===x.qid||o.legacyId===x.legacyId||normalized(o.stem)===normalized(x.stem)||o.questionFamily===x.questionFamily));
 }
 assert.ok(q.filter(x=>x.options[x.answer].length===Math.max(...x.options.map(o=>o.length))).length<=3,'longest-key cue');
 const words=s=>s.split(/\s+/).length;
 assert.ok(q.filter(x=>words(x.options[x.answer])<Math.min(...x.options.filter((_,i)=>i!==x.answer).map(words))).length<=3,'shortest-key cue');
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
  const needles=['nppe:set-1:mock-a:','mock-a-essential-service-continuity-public-welfare',banks().NPPE_MOCK_A[0].stem];
  for(const needle of needles)assert.ok(!build.shell.includes(needle));
  for(const exam of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp'])for(const needle of needles)assert.ok(!fs.readFileSync(path.join(build.output,exam+'.json'),'utf8').includes(needle));
  const packet=fs.readFileSync(path.join(build.output,'nppe.json'),'utf8');assert.ok(packet.includes('mock-a-essential-service-continuity-public-welfare'));
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
