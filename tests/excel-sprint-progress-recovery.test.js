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
  const transaction={abort(){metrics.aborted++;queueMicrotask(()=>transaction.onabort&&transaction.onabort());},objectStore(){return {get(key){const request={};if(!behavior.hangRead)queueMicrotask(()=>{if(behavior.beforeRead)behavior.beforeRead(key,mode);request.result=clone(data.get(key)||null);request.onsuccess&&request.onsuccess();});return request;},put(value,key){if(!behavior.hangWrite)data.set(key,clone(value));if(!behavior.hangWrite)queueMicrotask(()=>behavior.failWrite?transaction.onerror&&transaction.onerror():transaction.oncomplete&&transaction.oncomplete());}};}};
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
test('reload settles a final pagehide study-time save before pausing a fresh student view',async()=>{
 const local=localStore();const behavior={};const indexedDB=indexedStore({},behavior);const outgoing=P.createStore({localStorage:local,indexedDB});const prior=await outgoing.load();prior.tokens=Array.from({length:11},(_,i)=>'signed-'+i);prior.packages['L3-A1']={submissions:{},tasks:{},timeMs:1000};await outgoing.save(prior);
 let finalFlush;let armed=true;behavior.beforeRead=(key,mode)=>{if(armed&&key===P.RECOVERY_KEY&&mode==='readwrite'){armed=false;prior.packages['L3-A1'].timeMs+=1000;finalFlush=outgoing.save(prior);}};
 const incoming=P.createStore({localStorage:local,indexedDB});const resumed=await incoming.load();await finalFlush;assert.equal(resumed.tokens.length,11);assert.equal(incoming.status().externalUpdate,false);assert.equal(resumed.packages['L3-A1'].timeMs,2000);
});
test('bootstrap catch-up stays bounded and keeps a continuing external writer protected',async()=>{
 const local=localStore();const behavior={};const indexedDB=indexedStore({},behavior);const initial=P.createStore({localStorage:local,indexedDB});const state=await initial.load();state.tokens=['retained-proof'];state.packages['L1-A1']={submissions:{},tasks:{},timeMs:0};await initial.save(state);
 let races=0;behavior.beforeRead=(key,mode)=>{if(key!==P.RECOVERY_KEY||mode!=='readwrite'||races>=3)return;const latest=JSON.parse(local.getItem(P.RECOVERY_KEY));latest.revision++;latest.writeId='external-writer-'+(++races);latest.state.storageRevision=latest.revision;latest.state.storageWriteId=latest.writeId;latest.state.packages['L1-A1'].timeMs+=1000;local.setItem(P.RECOVERY_KEY,JSON.stringify(latest));local.setItem(P.KEY,JSON.stringify(latest.state));indexedDB.data.set(P.RECOVERY_KEY,clone(latest));indexedDB.data.set(P.KEY,clone(latest.state));};
 const incoming=P.createStore({localStorage:local,indexedDB});await incoming.load();assert.equal(races,3);assert.equal(incoming.status().externalUpdate,true);assert.equal(JSON.parse(local.getItem(P.KEY)).packages['L1-A1'].timeMs,3000);assert.deepEqual(JSON.parse(local.getItem(P.KEY)).tokens,['retained-proof']);
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
 const visible=clone(restored);visible.packages['L1-A1'].tasks.bonus.unverified=true;assert.match(D.render(visible,[verified],catalog),/Saved bonus history not verified/);assert.equal(restored.packages['L1-A1'].tasks.bonus.attempts,2);
 const invalid=clone(restored);invalid.packages['L1-A1'].tasks.t1.checkedSubmission.resultText='x'.repeat(20001);assert.throws(()=>P.validateState(invalid));
});
test('Regina streak dates and day labels stay correct through summer, year and leap-day boundaries',()=>{
 assert.equal(D.dayStamp('2026-10-02T05:59:59Z'),'2026-10-01');assert.equal(D.dayStamp('2026-10-02T06:00:00Z'),'2026-10-02');assert.equal(D.streak(['2026-09-30','2026-10-01'],'2026-10-02T05:59:59Z'),2);assert.equal(D.streak(['2026-09-30','2026-10-01'],'2026-10-02T06:00:00Z'),2);assert.equal(D.streak(['2026-12-30','2026-12-31','2027-01-01'],'2027-01-02T05:59:59Z'),3);assert.equal(D.streak(['2028-02-28','2028-02-29','2028-03-01'],'2028-03-02T05:59:59Z'),3);assert.equal(D.dayStamp(0),'1969-12-31');
});
test('dashboard distinguishes earned completion from a later incorrect check and an unchecked exact-text revision',()=>{
 const state=P.emptyState();state.packages['L1-A1']={tasks:{t1:{correct:true,submissionCorrect:false,attempts:1,firstAttemptCorrect:true,checkedSubmission:{formula:'=TEXT(1,"000")',resultText:'001'}}},submissions:{t1:{formula:'=TEXT(1,"000")',result:1,resultText:'001'}},timeMs:60000};
 const completion={packageId:'L1-A1',completionToken:'signed-core',score:100,firstAttemptScore:100,timestamp:'2026-10-02T12:00:00Z',attempts:{t1:1},firstAttemptCorrect:{t1:true}};
 const restored=P.applyVerified(state,[completion],catalog);let html=D.render(restored,[completion],catalog);
 assert.match(html,/>Completion score</);assert.doesNotMatch(html,/>Latest score</);assert.match(html,/Latest check incorrect; earlier pass retained/);assert.match(html,/1<small> \/ 50/);assert.match(html,/>100%<\/td>/);
 restored.packages['L1-A1'].submissions.t1.resultText='1';html=D.render(restored,[completion],catalog);assert.match(html,/Revised answer not checked; earlier pass retained/);assert.doesNotMatch(html,/Latest check incorrect; earlier pass retained/);
 const roundTrip=P.parseBackup(JSON.stringify(restored));assert.equal(roundTrip.packages['L1-A1'].submissions.t1.resultText,'1');assert.equal(roundTrip.packages['L1-A1'].tasks.t1.checkedSubmission.resultText,'001');assert.match(D.render(roundTrip,[completion],catalog),/Revised answer not checked/);
});
test('dashboard storage label agrees with durable, temporary and externally paused store status',async()=>{
 const blocked=P.createStore({localStorage:{getItem:()=>null,setItem(){throw new Error('QuotaExceededError');}}});const state=await blocked.load();assert.match(D.render(state,[],catalog,blocked.status()),/Temporary in this tab/);assert.doesNotMatch(D.render(state,[],catalog,blocked.status()),/Saved on this browser/);
 const local=localStore();const a=P.createStore({localStorage:local}),b=P.createStore({localStorage:local});const first=await a.load(),second=await b.load();assert.match(D.render(first,[],catalog,a.status()),/Saved on this browser/);second.selectedPackageId='L1-A2';await b.save(second);assert.match(D.render(first,[],catalog,a.status()),/Paused; newer progress in another tab/);
});
test('full-course backup can restore long UI-valid answers above the former two-megabyte limit',async()=>{
 const state=P.emptyState();state.tokens=Array.from({length:50},(_,i)=>'signed-core-'+i);state.expertTokens=['expert-1','expert-2','expert-3'];
 for(let number=1;number<=50;number++)state.packages[P.packageId(number)]={submissions:{t1:{formula:'=A1',result:'0'.repeat(16000),resultText:'0'.repeat(16000)},t2:{formula:'=A2',result:'1'.repeat(16000),resultText:'1'.repeat(16000)}},tasks:{},timeMs:0};
 state.packages['EX-A3']={submissions:{t1:{formula:'=TEXT(1,"000")',result:'001',resultText:'001'}},tasks:{},timeMs:0};state.learning=learningDraft('007\t0\n');
 const exported=JSON.stringify(P.validateState(state),null,2);assert.ok(Buffer.byteLength(exported)>2*1024*1024);const imported=P.parseBackup(exported);assert.deepEqual(imported.tokens,state.tokens);assert.deepEqual(imported.expertTokens,state.expertTokens);assert.equal(imported.packages['L10-A5'].submissions.t2.resultText,state.packages['L10-A5'].submissions.t2.resultText);assert.equal(imported.packages['EX-A3'].submissions.t1.resultText,'001');assert.equal(imported.learning.drills['R7-A2'].submissions.resultText,'007\t0\n');
 const local=localStore();const store=P.createStore({localStorage:local});await store.load();await store.save(imported,{replace:true});const resumed=await P.createStore({localStorage:local}).load();assert.equal(resumed.tokens.length,50);assert.equal(resumed.packages['L10-A5'].submissions.t2.resultText.length,16000);assert.deepEqual(resumed.expertTokens,state.expertTokens);
});
test('maximum UI-length Unicode drafts across all core, Expert and practice tasks fit their own backup limit',()=>{
 const state=P.emptyState(),formula='界'.repeat(4096),text='界'.repeat(16000),hint='界'.repeat(4000),timestamp='2026-10-02T12:00:00.000Z';let taskCount=0;
 for(let number=1;number<=53;number++){
  const id=number<=50?P.packageId(number):'EX-A'+(number-50),pkg=JSON.parse(fs.readFileSync('assets/lessons/excel-formula-fluency/sprint/packages/'+id+'.json'));
  const record={submissions:{},tasks:{},timeMs:0,receipt:'p'.repeat(60000)};
  for(const task of pkg.tasks.concat(pkg.bonus?[pkg.bonus]:[])){taskCount++;record.submissions[task.id]={formula,result:text,resultText:text};record.tasks[task.id]={correct:true,attempts:1,firstAttemptCorrect:true,hint,checkedSubmission:{formula,resultText:text}};}
  state.packages[id]=record;
 }
 state.tokens=Array.from({length:50},(_,i)=>String(i).padStart(2,'0')+'p'.repeat(19998));state.expertTokens=Array.from({length:3},(_,i)=>String(i)+'p'.repeat(19999));
 for(let level=1;level<=10;level++)for(let variant=1;variant<=2;variant++){
  const id='R'+level+'-A'+variant,runId=String(level*2+variant).padStart(8,'0')+'-0000-4000-8000-000000000000',receipt=String(level*2+variant)+'p'.repeat(59997);
  state.learning.drills[id]={type:'drill',runId,drillId:id,skillId:'level-'+level,correct:true,submissionCorrect:true,attempts:1,firstAttemptCorrect:true,hint,completedAt:timestamp,receipt,submissions:{formula,result:text,resultText:text}};
  if(variant===1)state.learning.reviews['level-'+level]={stage:1,nextReviewAt:'2026-10-03T12:00:00.000Z',lastReceipt:receipt,lastRunId:runId,lastDrillId:id,lastCompletedAt:timestamp};
 }
 const exported=JSON.stringify(P.validateState(state),null,2),bytes=Buffer.byteLength(exported);assert.equal(taskCount,265);assert.ok(bytes>32*1024*1024);assert.ok(bytes<P.MAX_BACKUP_BYTES);
 // JSON-escaped control characters are the larger valid-text representation.
 const escapedTextBound=bytes+(265*(4096*2+16000*3+4000)+20*(4096+16000*2+4000))*3;assert.ok(escapedTextBound<P.MAX_BACKUP_BYTES);
 const imported=P.parseBackup(exported);assert.equal(imported.packages['EX-A3'].submissions.t1.resultText,text);assert.equal(imported.packages['L10-A5'].tasks.bonus.checkedSubmission.formula,formula);assert.equal(imported.learning.drills['R10-A2'].submissions.resultText,text);assert.equal(imported.tokens.length,50);
});
test('a surviving full recovery record counts as durable storage when only the primary key fails',async()=>{
 const local=localStore();const originalWrite=local.setItem;local.setItem=(key,value)=>{if(key===P.KEY)throw new Error('primary key blocked');originalWrite(key,value);};
 const store=P.createStore({localStorage:local});const state=await store.load();state.tokens=['signed-core'];state.learning=learningDraft('retained via full recovery');await store.save(state);assert.equal(store.status().mode,'localStorage');assert.doesNotMatch(store.status().warning,/lasts only/);assert.match(D.render(state,[],catalog,store.status()),/Saved on this browser/);
 const recovered=await P.createStore({localStorage:local}).load();assert.deepEqual(recovered.tokens,['signed-core']);assert.equal(recovered.learning.drills['R7-A2'].submissions.resultText,'retained via full recovery');
});
test('unproven imported task flags cannot claim passed checks or first-attempt scores while drafts stay recoverable',()=>{
 const state=P.emptyState();state.packages['L1-A1']={score:100,firstAttemptScore:100,solvedAt:'2026-10-02T12:00:00Z',timeMs:60000,submissions:{t1:{formula:'=TEXT(1,"000")',result:'001',resultText:'001'}},tasks:{t1:{correct:true,attempts:7,firstAttemptCorrect:true,submissionCorrect:true,checkedSubmission:{formula:'=TEXT(1,"000")',resultText:'001'}},bonus:{correct:true,attempts:2,firstAttemptCorrect:true}}};
 const restored=P.applyVerified(P.parseBackup(JSON.stringify(state)),[],catalog,[]),record=restored.packages['L1-A1'];assert.equal(record.tasks.t1.correct,false);assert.equal(record.tasks.t1.attempts,0);assert.equal(record.tasks.t1.firstAttemptCorrect,null);assert.equal(record.tasks.bonus.correct,false);assert.equal(record.score,undefined);assert.equal(record.firstAttemptScore,undefined);assert.equal(record.solvedAt,undefined);assert.equal(record.timeMs,60000);assert.deepEqual(record.submissions,state.packages['L1-A1'].submissions);assert.deepEqual(record.tasks.t1.checkedSubmission,state.packages['L1-A1'].tasks.t1.checkedSubmission);assert.doesNotMatch(D.render(restored,[],catalog),/>Correct<\/td>|100%/);
 state.packages['L1-A1'].receipt='saved-grading-proof';const ongoing=P.applyVerified(state,[],catalog);assert.equal(ongoing.packages['L1-A1'].tasks.t1.attempts,7);assert.equal(ongoing.packages['L1-A1'].firstAttemptScore,100);
});
test('a newer surviving primary reloads without a false conflict when only the recovery-key write fails',async()=>{
 for(const withDatabase of [false,true]){
  const local=localStore(),environment={localStorage:local,...(withDatabase?{indexedDB:indexedStore()}: {})};const store=P.createStore(environment),state=await store.load(),write=local.setItem;
  local.setItem=(key,value)=>{if(key===P.RECOVERY_KEY)throw new Error('recovery key blocked');write(key,value);};state.packages['L1-A1']={submissions:{t1:{formula:'=TEXT(1,"000")',result:1,resultText:'001'}},tasks:{},timeMs:7000};await store.save(state);
  const incoming=P.createStore(environment),resumed=await incoming.load();assert.equal(incoming.status().externalUpdate,false);assert.equal(resumed.packages['L1-A1'].submissions.t1.resultText,'001');assert.equal(resumed.packages['L1-A1'].timeMs,7000);assert.notEqual(incoming.status().mode,'memory');
 }
});
test('the surviving modern primary protects an explicit reset from a stale tab when the recovery-key write fails',async()=>{
 const local=localStore(),a=P.createStore({localStorage:local}),stateA=await a.load(),b=P.createStore({localStorage:local}),stateB=await b.load();const write=local.setItem;
 local.setItem=(key,value)=>{if(key===P.RECOVERY_KEY)throw new Error('recovery key blocked');write(key,value);};stateA.tokens=['signed-core'];await a.save(stateA);await a.save(P.emptyState(),{replace:true});stateB.tokens=['stale-proof'];await b.save(stateB);
 assert.equal(b.status().externalUpdate,true);assert.deepEqual(JSON.parse(local.getItem(P.KEY)).tokens,[]);const incoming=P.createStore({localStorage:local});assert.deepEqual((await incoming.load()).tokens,[]);assert.equal(incoming.status().externalUpdate,false);
});
test('an intervening different writer at the observed revision still blocks an atomic save',async()=>{
 const behavior={},indexedDB=indexedStore({},behavior),store=P.createStore({indexedDB}),state=await store.load();let armed=true;
 behavior.beforeRead=(key,mode)=>{if(!armed||key!==P.RECOVERY_KEY||mode!=='readwrite')return;armed=false;const foreign=clone(indexedDB.data.get(P.RECOVERY_KEY));foreign.writeId='foreign-equal-revision';foreign.state.storageWriteId=foreign.writeId;foreign.state.tokens=['foreign-proof'];indexedDB.data.set(P.RECOVERY_KEY,foreign);indexedDB.data.set(P.KEY,clone(foreign.state));};
 state.tokens=['this-tab-draft-proof'];await store.save(state);assert.equal(store.status().externalUpdate,true);assert.deepEqual(state.tokens,['this-tab-draft-proof']);assert.deepEqual(indexedDB.data.get(P.KEY).tokens,['foreign-proof']);assert.deepEqual(indexedDB.data.get(P.RECOVERY_KEY).state.tokens,['foreign-proof']);
});
test('verified partial receipts replace local claims without treating saved drafts as freshly checked or earning completion',()=>{
 const state=P.emptyState();state.packages['L1-A1']={submissions:{t1:{formula:'=TEXT(1,"000")',result:'001',resultText:'001'}},tasks:{t1:{correct:true,attempts:99,firstAttemptCorrect:false,submissionCorrect:true,checkedSubmission:{formula:'=TEXT(1,"000")',resultText:'001'}}},timeMs:7000,receipt:'corrupted-local-proof',score:100,firstAttemptScore:0};
 const report={verified:true,packageId:'L1-A1',receipt:'signed-partial',score:25,firstAttemptScore:25,completed:false,tasks:[{taskId:'t1',correct:true,attempts:1,firstAttemptCorrect:true,hint:'Correct.'},...['t2','t3','t4'].map(taskId=>({taskId,correct:false,attempts:0,firstAttemptCorrect:null,hint:null}))],bonus:{taskId:'bonus',correct:false,attempts:2,firstAttemptCorrect:false,hint:'Revisit.'}};
 const next=P.applyPartial(state,report),record=next.packages['L1-A1'];assert.deepEqual(next.tokens,[]);assert.equal(record.tasks.t1.attempts,1);assert.equal(record.tasks.t1.firstAttemptCorrect,true);assert.equal(record.tasks.t1.submissionCorrect,undefined);assert.equal(record.tasks.t1.checkedSubmission,undefined);assert.equal(record.tasks.bonus.attempts,2);assert.equal(record.timeMs,7000);assert.deepEqual(record.submissions,state.packages['L1-A1'].submissions);assert.match(D.render(next,[],catalog),/Saved answer not checked; earlier pass retained/);assert.equal(state.packages['L1-A1'].tasks.t1.attempts,99);
 for(const bad of [{...report,verified:false},{...report,score:100},{...report,tasks:[...report.tasks,report.tasks[0]]}])assert.throws(()=>P.applyPartial(state,bad),/could not be verified/);
 const completion={packageId:'L1-A1',completionToken:'signed-core',score:100,firstAttemptScore:75,timestamp:'2026-10-02T12:00:00Z',attempts:{t1:1,t2:2,t3:1,t4:1},firstAttemptCorrect:{t1:true,t2:false,t3:true,t4:true}};
 const earned=P.applyVerified(next,[completion],catalog);assert.equal(earned.packages['L1-A1'].score,100);assert.equal(earned.packages['L1-A1'].tasks.t2.correct,true);assert.equal(earned.packages['L1-A1'].tasks.t2.attempts,2);assert.equal(earned.packages['L1-A1'].tasks.bonus.attempts,2);
});
test('a malformed array selection rejects before it can strand an imported assignment',()=>{
 const state=P.emptyState();for(const selection of [['L1-A1'],null,0,{}]){state.selectedPackageId=selection;assert.throws(()=>P.parseBackup(JSON.stringify(state)),/invalid assignment selection/);}
});
test('a new generation after cleared browser storage cannot be overwritten by an older high-revision tab',async()=>{
 const local=localStore(),older=P.createStore({localStorage:local}),state=await older.load();state.tokens=['earlier-proof'];for(let i=0;i<8;i++)await older.save(state);assert.ok(state.storageRevision>1);
 local.data.clear();const fresh=P.createStore({localStorage:local});await fresh.load();assert.equal(older.status().externalUpdate,true);await older.save(state);assert.deepEqual(JSON.parse(local.getItem(P.KEY)).tokens,[]);assert.equal((await P.createStore({localStorage:local}).load()).tokens.length,0);
});
test('a lower-revision foreign generation in the database survives a reload with an older local copy',async()=>{
 const local=localStore(),indexedDB=indexedStore(),older=P.createStore({localStorage:local,indexedDB}),state=await older.load();state.tokens=['older-proof'];for(let i=0;i<8;i++)await older.save(state);
 indexedDB.data.clear();const fresh=P.createStore({indexedDB});await fresh.load();const incoming=P.createStore({localStorage:local,indexedDB}),resumed=await incoming.load();assert.equal(incoming.status().externalUpdate,false);assert.deepEqual(resumed.tokens,[]);assert.deepEqual(indexedDB.data.get(P.KEY).tokens,[]);assert.deepEqual(JSON.parse(local.getItem(P.KEY)).tokens,[]);
});
