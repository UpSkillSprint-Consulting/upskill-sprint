/* Segment 12: versioned local examination lifecycle + reload recovery.
 * Cross-device takeover remains Segment 15; trusted clock hardening remains Segment 13. */
(function (root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.__TBSessionLifecycle = api;
}(typeof window === 'object' ? window : globalThis, function (root) {
  'use strict';

  const SCHEMA = 1;
  const CONTRACT = '1.0.0';
  const STORE_KEY = 'tb-exam-session-lifecycle-v1';
  const EDITABLE = ['created','in_progress','paused'];
  const ACTIVE = EDITABLE.concat(['finalizing']);
  const TERMINAL = ['completed','expired','abandoned'];
  const TRANSITIONS = Object.freeze({
    created: { start:'in_progress', abandon:'abandoned' },
    in_progress: { pause:'paused', submit:'finalizing', deadline_reached:'finalizing', abandon:'abandoned' },
    paused: { resume:'in_progress', submit:'finalizing', abandon:'abandoned' },
    finalizing: { accept_completion:'completed', accept_expiry:'expired', retry:'finalizing' },
    completed: {}, expired: {}, abandoned: {}
  });
  const UI_RESTORE_MODES = new Set(['exam','quick','focus']);
  let installed = false;
  let originals = null;
  let armedResume = null;
  let restoring = false;
  let lastError = null;

  function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function record(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  function asArray(value) { return Array.isArray(value) ? value : []; }
  function requireThat(ok, code, message) { if (!ok) { const e = new Error(message || code); e.code = code; throw e; } }
  function iso(value) { const d = new Date(value); requireThat(Number.isFinite(d.getTime()),'INVALID_SESSION_TIME'); return d.toISOString(); }
  function authOwner() {
    const auth = root && root.UpskillAuth;
    const user = auth && typeof auth.getUser === 'function' ? auth.getUser() : null;
    return user && user.id ? String(user.id) : 'anonymous';
  }
  function readStore(storage) {
    storage = storage || (root && root.localStorage);
    if (!storage) return { schemaVersion:SCHEMA, owners:{} };
    try {
      const raw = JSON.parse(storage.getItem(STORE_KEY) || 'null');
      if (!raw || raw.schemaVersion !== SCHEMA || !raw.owners || typeof raw.owners !== 'object') return { schemaVersion:SCHEMA, owners:{} };
      return raw;
    } catch (_) { return { schemaVersion:SCHEMA, owners:{} }; }
  }
  function writeStore(store, storage) {
    storage = storage || (root && root.localStorage);
    requireThat(storage && typeof storage.setItem === 'function','SESSION_STORAGE_UNAVAILABLE');
    storage.setItem(STORE_KEY, JSON.stringify(store));
    const check = JSON.parse(storage.getItem(STORE_KEY) || 'null');
    requireThat(check && check.schemaVersion === SCHEMA,'SESSION_STORAGE_UNCONFIRMED');
    return true;
  }
  function ownerBucket(store, owner, create) {
    const owners = store.owners || (store.owners={});
    if (!owners[owner] && create) owners[owner] = { activeSessionId:null, sessions:{} };
    return owners[owner] || { activeSessionId:null, sessions:{} };
  }
  function save(snapshot, options) {
    options = options || {};
    validateSnapshot(snapshot);
    const owner = String(snapshot.ownerId || options.ownerId || authOwner());
    const store = readStore(options.storage), bucket = ownerBucket(store,owner,true);
    bucket.sessions[snapshot.sessionId] = clone(snapshot);
    bucket.activeSessionId = ACTIVE.includes(snapshot.state) ? snapshot.sessionId : (bucket.activeSessionId === snapshot.sessionId ? null : bucket.activeSessionId);
    writeStore(store,options.storage);
    return clone(snapshot);
  }
  function load(sessionId, options) {
    options = options || {};
    const owner = String(options.ownerId || authOwner()), bucket = ownerBucket(readStore(options.storage),owner,false);
    const id = sessionId || bucket.activeSessionId;
    const value = id && bucket.sessions && bucket.sessions[id];
    if (!value) return null;
    try { validateSnapshot(value); return clone(value); } catch (e) { lastError=e; return null; }
  }
  function clearActive(sessionId, options) {
    options=options||{}; const owner=String(options.ownerId||authOwner()), store=readStore(options.storage),bucket=ownerBucket(store,owner,false);
    if (bucket.activeSessionId === sessionId) { bucket.activeSessionId=null; writeStore(store,options.storage); }
  }
  function transition(snapshot, action, patch) {
    validateSnapshot(snapshot);
    const next = TRANSITIONS[snapshot.state] && TRANSITIONS[snapshot.state][action];
    requireThat(next,'ILLEGAL_SESSION_TRANSITION',snapshot.state+' -> '+action+' is not allowed');
    if (action === 'pause') requireThat(snapshot.timed !== true,'TIMED_PAUSE_FORBIDDEN');
    const out = Object.assign({},clone(snapshot),clone(patch||{}),{state:next,updatedAt:new Date().toISOString()});
    out.sessionRevision = Math.max(Number(snapshot.sessionRevision||0)+1, Number(out.sessionRevision||0));
    validateSnapshot(out); return out;
  }
  function validateSnapshot(s) {
    requireThat(s && typeof s === 'object','INVALID_SESSION_SNAPSHOT');
    requireThat(s.schemaVersion===SCHEMA && s.contractVersion===CONTRACT,'UNSUPPORTED_SESSION_SCHEMA');
    ['sessionId','ownerId','examId','mode','state'].forEach(k=>requireThat(typeof s[k]==='string'&&s[k],'MISSING_SESSION_FIELD',k));
    requireThat(Object.prototype.hasOwnProperty.call(TRANSITIONS,s.state),'INVALID_SESSION_STATE');
    requireThat(Number.isSafeInteger(s.sessionRevision)&&s.sessionRevision>=0,'INVALID_SESSION_REVISION');
    requireThat(typeof s.timed==='boolean','INVALID_SESSION_TIMING');
    requireThat(!s.timed || s.state!=='paused','TIMED_PAUSE_FORBIDDEN');
    requireThat(Array.isArray(s.orderedItems)&&s.orderedItems.length>0,'INVALID_SESSION_ITEMS');
    const itemIds=new Set(),questionIds=new Set();
    s.orderedItems.forEach(function(item){
      requireThat(item&&typeof item.itemId==='string'&&item.itemId,'INVALID_SESSION_ITEM');
      requireThat(typeof item.questionId==='string'&&item.questionId.startsWith(s.examId+':'),'INVALID_SESSION_QUESTION');
      requireThat(!itemIds.has(item.itemId),'DUPLICATE_SESSION_ITEM'); itemIds.add(item.itemId);
      requireThat(!questionIds.has(item.questionId) || s.mode==='adaptive','DUPLICATE_SESSION_QUESTION'); questionIds.add(item.questionId);
      requireThat(Array.isArray(item.optionOrder)&&new Set(item.optionOrder).size===item.optionOrder.length,'INVALID_OPTION_ORDER');
    });
    requireThat(s.currentItemId===null || itemIds.has(s.currentItemId),'INVALID_CURRENT_ITEM');
    requireThat(Array.isArray(s.flags)&&s.flags.every(id=>itemIds.has(id)),'INVALID_FLAGS');
    if (s.deadlineAt!=null) iso(s.deadlineAt);
    if (s.startedAt!=null) iso(s.startedAt);
    return true;
  }
  function snapshotFromStart(input,result) {
    const pin=result&&result.versionPin; requireThat(pin&&Array.isArray(pin.orderedItems),'MISSING_VERSION_PIN');
    const owner=String(pin.ownerId||authOwner());
    const ordered=pin.orderedItems.map(function(item){return {
      itemId:item.itemId,questionId:item.questionId,questionRevision:item.questionRevision,domainId:item.domainId,
      optionIds:clone(item.optionIds||[]),optionOrder:clone(item.optionOrder||[]),selectedOptionId:null,effectiveAnsweredAt:null
    };});
    return {
      schemaVersion:SCHEMA,contractVersion:CONTRACT,sessionId:result.sessionId,ownerId:owner,examId:String(input.examId),setId:String(pin.setId||input.setId||'mix'),mode:String(input.mode||pin.mode||'practice'),
      bankVersion:pin.bankVersion||null,blueprintVersion:pin.blueprintVersion||null,configVersion:pin.configVersion||null,
      gradingPolicyVersion:pin.gradingPolicyVersion||null,masteryPolicyVersion:pin.masteryPolicyVersion||null,timingPolicyVersion:pin.timingPolicyVersion||null,
      expectedLength:Number(pin.expectedLength||ordered.length),siteTargetBps:pin.siteTargetBps==null?null:Number(pin.siteTargetBps),
      orderedItems:ordered,state:'in_progress',sessionRevision:Number(pin.sessionRevision||0),writerEpoch:Number(pin.writerEpoch||0),resetEpochId:pin.resetEpochId||null,
      startedAt:pin.startedAt||new Date().toISOString(),deadlineAt:pin.deadlineAt||null,timed:!!pin.timed,limitSeconds:pin.limitSeconds==null?null:Number(pin.limitSeconds),
      reportingTimeZoneAtStart:pin.reportingTimeZoneAtStart||'UTC',currentItemId:ordered[0]&&ordered[0].itemId||null,flags:[],filter:input.filter||null,
      versionPin:clone(pin),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()
    };
  }
  function updateDraft(snapshot,input) {
    requireThat(snapshot && EDITABLE.includes(snapshot.state),'SESSION_NOT_EDITABLE');
    const out=clone(snapshot),index=Number(input.index),item=out.orderedItems[index];
    requireThat(item && item.questionId === questionIdentity(input.examId,input.question),'SESSION_ITEM_MISMATCH');
    const selected=input.selected;
    item.selectedOptionId=selected==null?null:item.optionOrder[Number(selected)]||null;
    out.currentItemId=item.itemId; out.sessionRevision+=1; out.updatedAt=new Date().toISOString(); validateSnapshot(out); return out;
  }
  function questionIdentity(examId,q){
    const registry=root&&root.__TBQuestionRegistry;
    if(registry&&typeof registry.idFor==='function')return String(registry.idFor(examId,q)||'');
    return String(q&&(q.qid||q.questionId||q.id)||'');
  }
  function syncFromRuntime() {
    if (!root || !root.__TB || typeof root.__TB.getFeedbackSnapshot!=='function') return null;
    const feedback=root.__TB.getFeedbackSnapshot(); if(!feedback||!feedback.sessionId)return null;
    let snap=load(feedback.sessionId); if(!snap||!EDITABLE.includes(snap.state))return snap;
    const byQuestion=new Map(snap.orderedItems.map(x=>[x.questionId,x]));
    feedback.records.forEach(function(r){const id=questionIdentity(feedback.examId,r.question),item=byQuestion.get(id);if(!item)return;item.selectedOptionId=r.selected==null?null:item.optionOrder[Number(r.selected)]||null;});
    const flags=[];feedback.records.forEach(function(r){if(r.flagged){const item=byQuestion.get(questionIdentity(feedback.examId,r.question));if(item)flags.push(item.itemId);}});snap.flags=flags;
    const currentIndex=Number(feedback.currentIndex);
    if(Number.isSafeInteger(currentIndex)&&currentIndex>=0&&snap.orderedItems[currentIndex])snap.currentItemId=snap.orderedItems[currentIndex].itemId;
    else {
      const current=root.document&&root.document.querySelector('.tb-navcell.cur[data-goto]');
      const renderedIndex=current&&Number(current.dataset.goto);
      if(Number.isSafeInteger(renderedIndex)&&renderedIndex>=0&&snap.orderedItems[renderedIndex])snap.currentItemId=snap.orderedItems[renderedIndex].itemId;
    }
    snap.sessionRevision+=1;snap.updatedAt=new Date().toISOString();save(snap);return snap;
  }
  function reconstructQuestions(snapshot) {
    const versions=root.__TBVersions; requireThat(versions&&typeof versions.checkedPin==='function','VERSION_RUNTIME_UNAVAILABLE');
    const pin=versions.checkedPin(clone(snapshot.versionPin));
    return {pin:pin,questions:pin.contents.map(function(q,i){return versions.questionFor(pin,q,i).question;})};
  }
  function renderResumeNotice(snapshot) {
    if(!root.document||!snapshot||!EDITABLE.includes(snapshot.state)||!UI_RESTORE_MODES.has(snapshot.mode))return;
    if(root.__TB&&typeof root.__TB.isExamSessionActive==='function'&&root.__TB.isExamSessionActive(snapshot.examId))return;
    const host=root.document.getElementById('tb-overview');if(!host||host.querySelector('[data-session-resume]'))return;
    const box=root.document.createElement('section');box.className='tb-pane';box.setAttribute('data-session-resume','');box.setAttribute('role','status');
    const n=snapshot.orderedItems.length, answered=snapshot.orderedItems.filter(i=>i.selectedOptionId!=null).length;
    box.innerHTML='<div class="tb-sec">Saved session</div><h3 style="margin-top:0">Continue your '+escapeHtml(snapshot.mode)+' session?</h3><p>'+answered+' of '+n+' answered. Your question order, selections, flags and original '+(snapshot.timed?'deadline':'untimed policy')+' are preserved on this device.</p><div class="tb-cta"><button type="button" class="btn btn-teal" data-resume-session>Resume session</button><button type="button" class="tb-ghost" data-discard-session>Abandon saved session</button></div>';
    host.prepend(box);
    box.querySelector('[data-resume-session]').addEventListener('click',function(){resume(snapshot.sessionId);});
    box.querySelector('[data-discard-session]').addEventListener('click',function(){abandonSaved(snapshot.sessionId);box.remove();});
  }
  function escapeHtml(v){return String(v==null?'':v).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
  function click(selector){const el=root.document.querySelector(selector);requireThat(el,'RESUME_CONTROL_UNAVAILABLE',selector);el.click();return el;}
  function prepareControls(snapshot){
    const tile=root.document.querySelector('.tb-tile[data-exam="'+CSS.escape(snapshot.examId)+'"]');requireThat(tile,'RESUME_EXAM_UNAVAILABLE');if(!tile.classList.contains('active'))tile.click();
    const set=root.document.querySelector('[data-set="'+CSS.escape(snapshot.setId)+'"]');if(set&&!set.classList.contains('on'))set.click();
    const kind=snapshot.mode==='exam'?'full':snapshot.mode;
    const timing=root.document.querySelector('[data-timing-kind="'+kind+'"][data-timed="'+(snapshot.timed?'1':'0')+'"]');if(timing&&!timing.classList.contains('on'))timing.click();
    if((kind==='quick'||kind==='focus')){const count=root.document.querySelector('[data-count="'+kind+'"][data-n="'+snapshot.orderedItems.length+'"]');if(count&&!count.classList.contains('on'))count.click();}
    return kind;
  }
  function applyRuntimeSelections(snapshot) {
    const originalRecord= originals.recordDraft;
    restoring=true;
    root.__TBLearning.recordDraft=function(){return {saved:true,resumed:true};};
    try {
      snapshot.orderedItems.forEach(function(item,index){if(item.selectedOptionId==null&&!snapshot.flags.includes(item.itemId))return;click('.tb-navcell[data-goto="'+index+'"]');if(item.selectedOptionId!=null){const optionIndex=item.optionOrder.indexOf(item.selectedOptionId);requireThat(optionIndex>=0,'RESUME_OPTION_MISMATCH');click('[data-opt="'+optionIndex+'"]');}if(snapshot.flags.includes(item.itemId))click('[data-flag]');});
      const currentIndex=snapshot.orderedItems.findIndex(i=>i.itemId===snapshot.currentItemId);if(currentIndex>=0)click('.tb-navcell[data-goto="'+currentIndex+'"]');
    } finally { root.__TBLearning.recordDraft=wrappedRecordDraft(originalRecord); restoring=false; }
    syncFromRuntime();
  }
  function resume(sessionId) {
    const snapshot=load(sessionId);requireThat(snapshot&&EDITABLE.includes(snapshot.state),'NO_RESUMABLE_SESSION');requireThat(UI_RESTORE_MODES.has(snapshot.mode),'MODE_RESTORE_ADAPTER_UNAVAILABLE');
    const rebuilt=reconstructQuestions(snapshot),kind=prepareControls(snapshot);
    armedResume={sessionId:snapshot.sessionId,result:{sessionId:snapshot.sessionId,saved:true,retried:true,resumed:true,versionPin:rebuilt.pin,pinnedQuestions:rebuilt.questions}};
    try { click('[data-mode="'+(kind==='exam'?'full':kind)+'"]'); } finally { if(armedResume) armedResume=null; }
    requireThat(root.__TB&&root.__TB.isExamSessionActive(snapshot.examId),'RESUME_START_FAILED');
    applyRuntimeSelections(snapshot); return clone(snapshot);
  }
  function abandonSaved(sessionId) {
    let snap=load(sessionId);if(!snap)return null;if(TERMINAL.includes(snap.state))return snap;
    requireThat(EDITABLE.includes(snap.state),'ILLEGAL_SESSION_TRANSITION','A finalizing submission cannot be abandoned.');
    snap=transition(snap,'abandon');save(snap);
    const learning=root.__TBLearning;if(learning&&typeof learning.abandonSession==='function')learning.abandonSession({examId:snap.examId,sessionId:snap.sessionId,mode:snap.mode,reason:'discard-recovered-session'});
    return snap;
  }
  function wrappedRecordDraft(original) { return function(input){
    const snap=input&&load(input.sessionId);
    if(snap&&!EDITABLE.includes(snap.state))return {saved:false,blocked:true,reason:'SESSION_NOT_EDITABLE'};
    const result=original.apply(this,arguments);
    if(!restoring&&result&&result.saved!==false&&snap&&EDITABLE.includes(snap.state))save(updateDraft(snap,input));
    return result;
  }; }
  function wrapLearning() {
    const learning=root.__TBLearning;if(!learning||learning.__segment12LifecycleWrapped)return false;
    originals={startSession:learning.startSession,recordDraft:learning.recordDraft,completeSession:learning.completeSession,abandonSession:learning.abandonSession};
    requireThat(typeof originals.startSession==='function'&&typeof originals.recordDraft==='function'&&typeof originals.completeSession==='function','LEARNING_RUNTIME_UNAVAILABLE');
    learning.startSession=function(input){
      if(armedResume&&armedResume.sessionId){const out=armedResume.result;armedResume=null;return out;}
      const result=originals.startSession.apply(this,arguments);
      if(input&&input.mode!=='adaptive'&&input.returnResult&&result&&result.saved!==false&&result.versionPin){try{save(snapshotFromStart(input,result));}catch(e){lastError=e;}}
      return result;
    };
    learning.recordDraft=wrappedRecordDraft(originals.recordDraft);
    learning.completeSession=function(input){
      let snap=input&&load(input.sessionId);if(snap&&!TERMINAL.includes(snap.state)){
        try { if(snap.state!=='finalizing')snap=transition(snap,(snap.timed&&input.completedReason==='timed-out')?'deadline_reached':'submit');save(snap); } catch(e){lastError=e;}
      }
      if(input&&snap&&snap.startedAt)input=Object.assign({},input,{startedAt:Date.parse(snap.startedAt)});
      const result=originals.completeSession.call(this,input);
      if(result&&result.saved!==false&&snap){try{snap=load(snap.sessionId)||snap;if(snap.state==='finalizing')snap=transition(snap,(input&&input.completedReason==='timed-out')?'accept_expiry':'accept_completion');save(snap);}catch(e){lastError=e;}}
      return result;
    };
    if(typeof originals.abandonSession==='function')learning.abandonSession=function(input){
      let snap=input&&load(input.sessionId);
      if(snap&&snap.state==='finalizing')return {saved:false,blocked:true,reason:'FINALIZATION_IN_PROGRESS'};
      if(snap&&TERMINAL.includes(snap.state))return {saved:true,terminal:true,state:snap.state};
      const result=originals.abandonSession.apply(this,arguments);
      snap=input&&load(input.sessionId);
      if(snap&&EDITABLE.includes(snap.state)&&(!result||result.saved!==false)){try{snap=transition(snap,'abandon');save(snap);}catch(e){lastError=e;}}
      return result;
    };
    learning.__segment12LifecycleWrapped=true;return true;
  }
  function installBrowser() {
    if(installed||!root||!root.document)return false;installed=true;
    const boot=function(){try{wrapLearning();const snap=load();if(snap)renderResumeNotice(snap);}catch(e){lastError=e;}};
    if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
    root.document.addEventListener('click',function(event){if(!root.__TB||typeof root.__TB.getFeedbackSnapshot!=='function')return;const t=event.target&&event.target.closest&&event.target.closest('[data-goto],[data-next],[data-prev],[data-flag],[data-opt]');if(t)queueMicrotask(function(){try{syncFromRuntime();}catch(e){lastError=e;}});},true);
    root.document.addEventListener('tb:exam-changed',function(){queueMicrotask(function(){const snap=load();if(snap)renderResumeNotice(snap);});});
    root.addEventListener('pagehide',function(){try{syncFromRuntime();}catch(e){lastError=e;}});
    root.document.addEventListener('visibilitychange',function(){if(root.document.visibilityState==='hidden'){try{syncFromRuntime();}catch(e){lastError=e;}}});
    return true;
  }
  const api={schemaVersion:SCHEMA,contractVersion:CONTRACT,storeKey:STORE_KEY,states:Object.keys(TRANSITIONS),editableStates:EDITABLE.slice(),terminalStates:TERMINAL.slice(),transitions:clone(TRANSITIONS),validateSnapshot,transition,save,load,clearActive,snapshotFromStart,updateDraft,syncFromRuntime,resume,abandonSaved,installBrowser,status:function(){const snap=load();return {installed,active:snap?clone(snap):null,lastError:lastError?{code:lastError.code||'ERROR',message:lastError.message}:null,crossDeviceTakeover:false};}};
  if(root&&root.document)installBrowser();
  return api;
}));
