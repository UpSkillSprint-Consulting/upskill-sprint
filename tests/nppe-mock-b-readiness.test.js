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
 assert.equal(fs.existsSync(path.join(root,'test-bank-nppe-mock-b-batch1.js')),false,'No premature Mock B content');
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
 assert.match(doc,/0\/110/);
});
test('Mock B already has a separate form slot and held/empty forms fail closed',()=>{
 const page=read('test-bank.html'),runtime=read('scripts/nppe-diagnostic-runtime.mjs');
 assert.match(page,/set-1-mock-b/);
 assert.match(page,/releaseHold:true/);
 assert.match(runtime,/if\(!formReady\(e,setId\)\)return \[\]/);
 assert.match(runtime,/if\(!formReady\(e,id\)\)/);
 assert.match(runtime,/session\.setId==='set-1-learning'/);
});
