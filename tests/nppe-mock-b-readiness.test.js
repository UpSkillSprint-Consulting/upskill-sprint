'use strict';
/** Mock B pre-authoring gate: no questions are created or released by these tests. */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const batchPaths=Array.from({length:11},(_,i)=>'test-bank-nppe-mock-a-batch'+(i+1)+'.js');
function loadExisting(){
 const context=vm.createContext({window:{},console});
 const files=['test-bank-nppe-diagnostic-batch2.js','test-bank-nppe-diagnostic.js','test-bank-nppe-diagnostic-batch3.js','test-bank-nppe-diagnostic-batch4.js','test-bank-nppe-diagnostic-batch5.js',...Array.from({length:12},(_,i)=>'test-bank-nppe-learning-batch'+(i+1)+'.js'),'test-bank-nppe-set2.js','test-bank-nppe-set3.js',...batchPaths];
 for(const file of files)vm.runInContext(read(file),context,{filename:file,timeout:5000});
 return context.window;
}
test('Mock B ID range is reserved and existing 500 objects have no collision',()=>{
 const w=loadExisting();
 const pools=[w.NPPE_DIAGNOSTIC,w.NPPE_LEARNING,w.NPPE_MOCK_A,w.NPPE_SET2,w.NPPE_SET3].map(x=>Array.from(x));
 assert.deepEqual(pools.map(x=>x.length),[50,120,110,110,110]);
 const all=pools.flat(),canonical=new Set(all.map(x=>x.qid)),legacy=new Set(all.map(x=>x.legacyId));
 assert.equal(all.length,500);assert.equal(canonical.size,500);
 for(let id=281;id<=390;id++){
  assert.equal(canonical.has('nppe:set-1:mock-b:'+id),false,'Mock B canonical ID '+id);
  assert.equal(legacy.has('NPPE-'+id),false,'Mock B legacy ID '+id);
 }
 assert.equal(fs.existsSync(path.join(root,'test-bank-nppe-mock-b-batch1.js')),true,'Batch 1 must exist');
});
test('Mock B authoring plan respects current published ranges and batch arithmetic',()=>{
 const doc=read('docs/nppe-mock-b-development-plan.md');
 const allocations=[[8,1],[20,2],[30,3],[26,2],[8,1],[8,1]];
 assert.equal(allocations.reduce((s,[n])=>s+n,0),100);
 assert.equal(allocations.reduce((s,[,n])=>s+n,0),10);
 const ranges=[[7,10],[17,21],[27,32],[23,28],[7,10],[7,10]];
 allocations.forEach(([scored],i)=>assert.ok(scored>=ranges[i][0]&&scored<=ranges[i][1]));
 for(let n=1;n<=11;n++){
  const first=281+(n-1)*10,last=first+9;
  assert.match(doc,new RegExp('\\b'+first+'[–-]'+last+'\\b'));
 }
 assert.match(doc,/releaseHold:true/);
 assert.match(doc,/70\/110/);
});
test('Mock B already has a separate form slot and held/empty forms fail closed',()=>{
 const page=read('test-bank.html'),runtime=read('scripts/nppe-diagnostic-runtime.mjs');
 assert.match(page,/set-1-mock-b/);
 assert.match(page,/releaseHold:true/);
 assert.match(runtime,/if\(!formReady\(e,setId\)\)return \[\]/);
 assert.match(runtime,/session\.setId==='set-1-learning'/);
});

test('Mock B 110-row planning ledger is complete, segregated and all 40 numbered topics have scored coverage',()=>{
 const rows=read('docs/nppe-mock-b-allocation-ledger.csv').trim().split(/\r?\n/).map(s=>s.split(','));
 assert.equal(rows.length,111);
 const [header,...data]=rows;
 assert.deepEqual(header.slice(0,6),['item_id','batch','blueprint','domain','planned_scoring_role','authoring_status']);
 const domains=['I','II','III','IV','V','VI'],expectedScored=[8,20,30,26,8,8],expectedUnscored=[1,2,3,2,1,1];
 const topicTargets=[4,4,10,14,4,4];
 const seen=new Set();
 data.forEach((row,i)=>{
  const id='NPPE-'+(281+i);assert.equal(row[0],id);assert.ok(!seen.has(id));seen.add(id);
  assert.equal(Number(row[1]),Math.floor(i/10)+1);
  assert.equal(row[3],row[2].split('.')[0]);assert.equal(row[5],i<70?'authored_held':'not_started');
  assert.ok(['scored','simulated_unscored'].includes(row[4]));
  assert.ok(domains.includes(row[3]));
 });
 assert.equal(data.filter(r=>r[4]==='scored').length,100);
 assert.equal(data.filter(r=>r[4]==='simulated_unscored').length,10);
 domains.forEach((domain,i)=>{
  assert.equal(data.filter(r=>r[3]===domain&&r[4]==='scored').length,expectedScored[i]);
  assert.equal(data.filter(r=>r[3]===domain&&r[4]==='simulated_unscored').length,expectedUnscored[i]);
  const topics=new Set(data.filter(r=>r[3]===domain&&r[4]==='scored').map(r=>r[2]));
  for(let j=1;j<=topicTargets[i];j++)assert.ok(topics.has(domain+'.'+j));
 });
});
