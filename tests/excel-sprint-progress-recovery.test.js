const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const P=require('../assets/lessons/excel-formula-fluency/sprint/progress.js');
const L=require('../assets/lessons/excel-formula-fluency/sprint/learning.js');
const D=require('../assets/lessons/excel-formula-fluency/sprint/dashboard.js');
const catalog=JSON.parse(fs.readFileSync('assets/lessons/excel-formula-fluency/sprint/catalog.json'));
const clone=value=>JSON.parse(JSON.stringify(value));
function localStore(entries={}) {const data=new Map(Object.entries(entries));return {data,getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};}
function indexedStore(entries={},behavior={}) {
 const data=new Map(Object.entries(entries));const metrics={closed:0,aborted:0};let openedRequest;
 const db={objectStoreNames:{contains:()=>true},createObjectStore(){},close(){metrics.closed++;},transaction(_name,mode){
  const transaction={abort(){metrics.aborted++;queueMicrotask(()=>transaction.onabort&&transaction.onabort());},objectStore(){return {get(key){const request={};if(!behavior.hangRead)queueMicrotask(()=>{request.result=clone(data.get(key)||null);request.onsuccess&&request.onsuccess();});return request;},put(value,key){if(!behavior.hangWrite)data.set(key,clone(value));if(!behavior.hangWrite)queueMicrotask(()=>behavior.failWrite?transaction.onerror&&transaction.onerror():transaction.oncomplete&&transaction.oncomplete());}};}};
  return transaction;
 }};
 return {data,metrics,get openedRequest(){return openedRequest;},open(){openedRequest={};if(!behavior.hangOpen)queueMicrotask(()=>{openedRequest.result=db;openedRequest.onsuccess&&openedRequest.onsuccess();});return openedRequest;},db};
}
const quickTimers={setTimeout:callback=>setImmediate(callback),clearTimeout:timer=>clearImmediate(timer)};
function learningDraft(text='latest answer') {const learning=L.emptyState();learning.selectedView='R7-A2';learning.drills['R7-A2']={submissions:{formula:'=SUM(A1:A3)',result:0,resultText:text}};return learning;}
function seeded() {const state=P.emptyState();state.tokens=['core-proof'];state.expertTokens=['expert-proof'];state.learning=learningDraft();state.updatedAt='2026-10-01T12:00:00.000Z';return state;}
function mirror(learning,updatedAt='2026-10-01T12:00:00.000Z') {return {version:1,updatedAt,learning};}
test('same-millisecond refresh prefers the latest synchronous draft over a stale database snapshot',async()=>{
 const stale=seeded();stale.learning=learningDraft('older answer');const latest=seeded();
 const local=localStore({[P.KEY]:JSON.stringify(latest)});const indexedDB=indexedStore({[P.KEY]:stale});
 const recovered=await P.createStore({localStorage:local,indexedDB}).load();assert.equal(recovered.learning.drills['R7-A2'].submissions.resultText,'latest answer');assert.deepEqual(recovered.tokens,['core-proof']);assert.deepEqual(recovered.expertTokens,['expert-proof']);
});
test('fast autosaves have distinct timestamps and the latest editable work survives reload',async()=>{
 const local=localStore();const store=P.createStore({localStorage:local});const state=await store.load();const originalNow=Date.now;Date.now=()=>Date.parse('2026-10-02T12:00:00Z');
 try {state.learning=learningDraft('first');await store.save(state);const first=JSON.parse(local.getItem(P.KEY)).updatedAt;state.learning=learningDraft('last');await store.save(state);const last=JSON.parse(local.getItem(P.KEY)).updatedAt;assert.ok(Date.parse(last)>Date.parse(first));assert.equal((await P.createStore({localStorage:local}).load()).learning.drills['R7-A2'].submissions.resultText,'last');}finally{Date.now=originalNow;}
});
test('an older open lesson tab cannot erase learning by rewriting the old unified record',async()=>{
 const local=localStore();const indexedDB=indexedStore();const original=P.createStore({localStorage:local,indexedDB});const state=await original.load();state.tokens=['core-proof'];state.expertTokens=['expert-proof'];state.learning=learningDraft('retained practice');await original.save(state);
 assert.equal(JSON.parse(local.getItem(P.LEARNING_KEY)).learning.drills['R7-A2'].submissions.resultText,'retained practice');assert.equal(indexedDB.data.get(P.LEARNING_KEY).learning.drills['R7-A2'].submissions.resultText,'retained practice');
 const old=seeded();delete old.learning;old.updatedAt='2026-10-03T12:00:00.000Z';local.setItem(P.KEY,JSON.stringify(old));indexedDB.data.set(P.KEY,clone(old));
 const store=P.createStore({localStorage:local,indexedDB});const recovered=await store.load();assert.equal(recovered.learning.drills['R7-A2'].submissions.resultText,'retained practice');assert.deepEqual(recovered.tokens,old.tokens);assert.deepEqual(recovered.expertTokens,old.expertTokens);assert.match(store.status().warning,/recovered/);
});
test('learning recovery works through either storage copy and modern explicit empty state stays empty',async()=>{
 for(const source of ['local','database']){
  const old=seeded();delete old.learning;const recovery=mirror(learningDraft('isolated recovery'));
  const local=localStore({[P.KEY]:JSON.stringify(old),...(source==='local'?{[P.LEARNING_KEY]:JSON.stringify(recovery)}:{})});
  const indexedDB=indexedStore(source==='database'?{[P.LEARNING_KEY]:recovery}:{});
  assert.equal((await P.createStore({localStorage:local,indexedDB}).load()).learning.drills['R7-A2'].submissions.resultText,'isolated recovery');
 }
 const modern=P.emptyState();modern.updatedAt='2026-10-01T12:00:00.000Z';const local=localStore({[P.KEY]:JSON.stringify(modern),[P.LEARNING_KEY]:JSON.stringify(mirror(learningDraft('do not revive'),'2026-10-03T12:00:00.000Z'))});
 const recovered=await P.createStore({localStorage:local}).load();assert.deepEqual(recovered.learning,L.emptyState());assert.deepEqual(JSON.parse(local.getItem(P.LEARNING_KEY)).learning,L.emptyState());
});
test('a stale modern core-only autosave preserves newer practice and leaves current work available for export',async()=>{
 const local=localStore();const a=P.createStore({localStorage:local}), b=P.createStore({localStorage:local});const stateA=await a.load(),stateB=await b.load();
 stateB.learning=learningDraft('from another tab');await b.save(stateB);stateA.selectedPackageId='L1-A2';await a.save(stateA);
 assert.equal(a.status().externalUpdate,true);assert.equal(stateA.selectedPackageId,'L1-A2');assert.deepEqual(stateA.learning,L.emptyState());assert.equal(JSON.parse(local.getItem(P.KEY)).learning.drills['R7-A2'].submissions.resultText,'from another tab');
 stateA.selectedPackageId='L1-A3';await a.save(stateA);assert.equal(JSON.parse(local.getItem(P.KEY)).learning.drills['R7-A2'].submissions.resultText,'from another tab');
 const reset=P.emptyState();await a.save(reset,{replace:true});assert.deepEqual((await P.createStore({localStorage:local}).load()).learning,L.emptyState());
});
test('IndexedDB-only stale tabs preserve newer practice atomically and deliberate reset still clears it',async()=>{
 const indexedDB=indexedStore();const a=P.createStore({indexedDB}),b=P.createStore({indexedDB});const stateA=await a.load(),stateB=await b.load();
 stateA.learning=learningDraft('saved without localStorage');await a.save(stateA);stateB.selectedPackageId='L1-A2';await b.save(stateB);
 assert.equal(b.status().externalUpdate,true);assert.deepEqual(stateB.learning,L.emptyState());assert.equal(indexedDB.data.get(P.KEY).learning.drills['R7-A2'].submissions.resultText,'saved without localStorage');
 const restored=await P.createStore({indexedDB}).load();assert.equal(restored.learning.drills['R7-A2'].submissions.resultText,'saved without localStorage');
 await b.save(P.emptyState(),{replace:true});assert.deepEqual((await P.createStore({indexedDB}).load()).learning,L.emptyState());
});
test('old writers with or without learning support cannot roll eleven core proofs and newer drafts back to ten',async()=>{
 for(const knowsLearning of [false,true]) {
  const start=P.emptyState();start.tokens=Array.from({length:10},(_,i)=>'signed-core-'+i);const local=localStore({[P.KEY]:JSON.stringify(start)});const indexedDB=indexedStore();const store=P.createStore({localStorage:local,indexedDB});const fresh=await store.load();
  const old=clone(fresh);delete old.storageRevision;delete old.storageWriteId;delete old.storageGeneration;if(!knowsLearning)delete old.learning;
  fresh.tokens.push('signed-core-10');fresh.packages['L3-A1']={submissions:{t1:{formula:'=SUM(A1:A3)',result:0,resultText:'0'}},tasks:{},timeMs:30000};fresh.learning=learningDraft('new practice');await store.save(fresh);
  old.updatedAt='2026-10-09T12:00:00.000Z';local.setItem(P.KEY,JSON.stringify(old));indexedDB.data.set(P.KEY,old);
  const recovered=await P.createStore({localStorage:local,indexedDB}).load();assert.equal(recovered.tokens.length,11);assert.equal(recovered.tokens[10],'signed-core-10');assert.equal(recovered.packages['L3-A1'].submissions.t1.resultText,'0');assert.equal(recovered.learning.drills['R7-A2'].submissions.resultText,'new practice');
 }
});
test('modern stale core and Expert autosaves cannot overwrite newer proofs or combine different chains',async()=>{
 const start=P.emptyState();start.tokens=Array.from({length:30},(_,i)=>'shared-'+i);start.expertTokens=['expert-1'];const local=localStore({[P.KEY]:JSON.stringify(start)});const a=P.createStore({localStorage:local}),b=P.createStore({localStorage:local});const stateA=await a.load(),stateB=await b.load();
 stateA.tokens.push('shared-30');stateA.expertTokens.push('expert-2');await a.save(stateA);
 stateB.packages['L1-A1']={submissions:{t1:{formula:'=1',result:1,resultText:'my unsaved edit'}},tasks:{},timeMs:60000};await b.save(stateB);assert.equal(b.status().externalUpdate,true);assert.match(b.status().warning,/another open lesson tab/);
 assert.equal(stateB.tokens.length,30);assert.equal(stateB.packages['L1-A1'].submissions.t1.resultText,'my unsaved edit');const recovered=await P.createStore({localStorage:local}).load();assert.equal(recovered.tokens.length,31);assert.deepEqual(recovered.expertTokens,['expert-1','expert-2']);
 stateB.tokens=['another-chain'];await b.save(stateB);assert.equal(JSON.parse(local.getItem(P.KEY)).tokens.length,31);
});
test('mixed-access tabs never let a stale local primary defeat the newer protected database record',async()=>{
 const indexedDB=indexedStore();const local=localStore();const a=P.createStore({indexedDB}),b=P.createStore({localStorage:local,indexedDB});const stateA=await a.load(),stateB=await b.load();
 stateA.learning=learningDraft('database latest');stateA.tokens=['new-proof'];await a.save(stateA);stateB.selectedPackageId='L1-A2';await b.save(stateB);assert.equal(b.status().externalUpdate,true);
 const recovered=await P.createStore({localStorage:local,indexedDB}).load();assert.equal(recovered.tokens[0],'new-proof');assert.equal(recovered.learning.drills['R7-A2'].submissions.resultText,'database latest');
});
test('explicit reset has a fresh barrier even when another tab originally loaded the same empty course',async()=>{
 const local=localStore();const a=P.createStore({localStorage:local}),b=P.createStore({localStorage:local});const stateA=await a.load(),stateB=await b.load();
 stateA.tokens=['earned-proof'];await a.save(stateA);await a.save(P.emptyState(),{replace:true});stateB.tokens=['stale-old-path-proof'];await b.save(stateB);assert.equal(b.status().externalUpdate,true);assert.deepEqual((await P.createStore({localStorage:local}).load()).tokens,[]);
});
test('intentional import without learning and reset replace recovery copies and never revive removed work',async()=>{
 const local=localStore();const indexedDB=indexedStore();const store=P.createStore({localStorage:local,indexedDB});let state=await store.load();state.learning=learningDraft('old data');await store.save(state);
 const old=P.emptyState();delete old.learning;old.tokens=['restored-core'];const imported=P.parseBackup(JSON.stringify(old));await store.save(imported,{replace:true});
 const recovered=await P.createStore({localStorage:local,indexedDB}).load();assert.deepEqual(recovered.learning,L.emptyState());assert.deepEqual(recovered.tokens,['restored-core']);assert.deepEqual(indexedDB.data.get(P.LEARNING_KEY).learning,L.emptyState());
});
test('corrupt primary copy recovers complete drafts from its other storage copy without silently claiming loss',async()=>{
 const valid=seeded();const local=localStore({[P.KEY]:'invalid json'});const indexedDB=indexedStore({[P.KEY]:valid});const store=P.createStore({localStorage:local,indexedDB});const recovered=await store.load();assert.deepEqual(recovered.tokens,valid.tokens);assert.deepEqual(recovered.learning,valid.learning);assert.match(store.status().warning,/damaged saved copy was recovered/);assert.doesNotThrow(()=>P.parseBackup(local.getItem(P.KEY)));
});
test('blocked or hanging database operations fall back without locking the lesson',async()=>{
 for(const behavior of [{hangOpen:true},{hangRead:true},{hangWrite:true}]) {
  const valid=seeded();const local=localStore({[P.KEY]:JSON.stringify(valid)});const indexedDB=indexedStore({[P.KEY]:valid},behavior);const store=P.createStore({localStorage:local,indexedDB,...quickTimers});
  const recovered=await store.load();assert.deepEqual(recovered.tokens,valid.tokens);assert.equal(store.status().mode,'localStorage');recovered.learning=learningDraft('still editable');await store.save(recovered);assert.equal(JSON.parse(local.getItem(P.KEY)).learning.drills['R7-A2'].submissions.resultText,'still editable');
  if(behavior.hangOpen){indexedDB.openedRequest.result=indexedDB.db;indexedDB.openedRequest.onsuccess();assert.equal(indexedDB.metrics.closed,1);}
 }
});
test('storage quota failures warn about memory-only work and a failed transaction does not poison later autosaves',async()=>{
 const quota={getItem:()=>null,setItem(){throw new Error('QuotaExceededError');}};const memory=P.createStore({localStorage:quota});const state=await memory.load();state.learning=learningDraft('temporary');await memory.save(state);assert.equal(memory.status().mode,'memory');assert.match(memory.status().warning,/Export a backup/);
 const indexedDB=indexedStore();const durable=P.createStore({localStorage:quota,indexedDB});const saved=await durable.load();saved.learning=learningDraft('durable');await durable.save(saved);assert.equal(durable.status().mode,'indexedDB');assert.equal(indexedDB.data.get(P.KEY).learning.drills['R7-A2'].submissions.resultText,'durable');
 const local=localStore();const failing=indexedStore({}, {failWrite:true});const fallback=P.createStore({localStorage:local,indexedDB:failing});const next=await fallback.load();next.learning=learningDraft('one');await fallback.save(next);next.learning=learningDraft('two');await fallback.save(next);assert.equal(fallback.status().mode,'localStorage');assert.equal(JSON.parse(local.getItem(P.KEY)).learning.drills['R7-A2'].submissions.resultText,'two');
});
test('verification preserves bonus history and checked snapshots while restoring immutable required counters',()=>{
 const state=P.emptyState();state.packages['L1-A1']={tasks:{t1:{correct:false,submissionCorrect:false,attempts:99,firstAttemptCorrect:false,checkedSubmission:{formula:'=SUM(A1:A3)',resultText:'001'}},bonus:{correct:true,attempts:2,firstAttemptCorrect:false,hint:'Correct bonus.'}},submissions:{t1:{formula:'=SUM(A1:A3)',result:'001',resultText:'001'}},timeMs:0};
 const verified={packageId:'L1-A1',completionToken:'signed-core',score:100,firstAttemptScore:75,timestamp:'2026-10-02T05:59:59Z',attempts:{t1:1,t2:2,t3:1,t4:1},firstAttemptCorrect:{t1:true,t2:false,t3:true,t4:true}};
 const restored=P.applyVerified(state,[verified],catalog);assert.equal(restored.packages['L1-A1'].tasks.t1.attempts,1);assert.equal(restored.packages['L1-A1'].tasks.t1.firstAttemptCorrect,true);assert.equal(restored.packages['L1-A1'].tasks.t1.correct,true);assert.equal(restored.packages['L1-A1'].tasks.t1.submissionCorrect,false);assert.deepEqual(restored.packages['L1-A1'].tasks.t1.checkedSubmission,{formula:'=SUM(A1:A3)',resultText:'001'});assert.equal(restored.packages['L1-A1'].tasks.bonus.attempts,2);assert.deepEqual(P.parseBackup(JSON.stringify(restored)).packages['L1-A1'].tasks,restored.packages['L1-A1'].tasks);
 assert.match(D.render(restored,[verified],catalog),/Bonus/);assert.match(D.render(restored,[verified],catalog),/2026-10-01/);
 const invalid=clone(restored);invalid.packages['L1-A1'].tasks.t1.checkedSubmission.resultText='x'.repeat(20001);assert.throws(()=>P.validateState(invalid));
});
test('Regina streak dates and day labels stay correct through summer, year and leap-day boundaries',()=>{
 assert.equal(D.dayStamp('2026-10-02T05:59:59Z'),'2026-10-01');assert.equal(D.dayStamp('2026-10-02T06:00:00Z'),'2026-10-02');assert.equal(D.streak(['2026-09-30','2026-10-01'],'2026-10-02T05:59:59Z'),2);assert.equal(D.streak(['2026-09-30','2026-10-01'],'2026-10-02T06:00:00Z'),2);assert.equal(D.streak(['2026-12-30','2026-12-31','2027-01-01'],'2027-01-02T05:59:59Z'),3);assert.equal(D.streak(['2028-02-28','2028-02-29','2028-03-01'],'2028-03-02T05:59:59Z'),3);assert.equal(D.dayStamp(0),'1969-12-31');
});
