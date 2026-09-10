/* Segment 15: canonical active-session checkpoint, explicit takeover, and stale-writer guard.
 * Builds on Segments 12-14. Cloud handoff transfers only the last accepted checkpoint;
 * local-only divergent work is preserved as conflict evidence and is never merged silently. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.__TBSessionHandoff = factory(root, root.__TBSessionLifecycle);
}(typeof window === 'object' ? window : globalThis, function (root, lifecycle) {
  'use strict';

  const SCHEMA = 1;
  const CONTRACT = '1.0.0';
  const META_KEY = 'tb-session-handoff-meta-v1';
  const CONFLICT_KEY = 'tb-session-handoff-conflicts-v1';
  const DEVICE_KEY = 'tb-account-sync-device-v1';
  const CLIENT_KEY = 'tb-session-handoff-client-v1';
  const LEARNING_KEY = 'tb-learning-events-v2';
  const ADAPTIVE_KEY = 'tb-adaptive-session-v2';
  const FETCH_RPC = 'fetch_test_bank_resumable_sessions_v1';
  const SAVE_RPC = 'save_test_bank_session_checkpoint_v1';
  const TAKEOVER_RPC = 'takeover_test_bank_session_v1';
  const REQUEST_TIMEOUT_MS = 12000;
  const MAX_CONFLICTS_PER_OWNER = 20;
  const ACTIVE = new Set(['created','in_progress','paused']);
  const TERMINAL = new Set(['completed','expired','abandoned']);
  let installed = false;
  let bindAttempts = 0;
  let wrapped = false;
  let suppressCheckpoint = false;
  let refreshPromise = null;
  let checkpointTimer = 0;
  let checkpointQueued = null;
  let adaptiveObserver = null;
  let lastAdaptiveRaw = null;
  let lastError = null;
  const authorities = new Map();
  const originals = {};

  function bindLifecycle() { if(!lifecycle&&root&&root.__TBSessionLifecycle) lifecycle=root.__TBSessionLifecycle; return !!lifecycle; }
  function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function record(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  function asArray(value) { return Array.isArray(value) ? value : []; }
  function fail(code, message) { const e = new Error(message || code); e.code = code; throw e; }
  function validId(value, min) { return typeof value === 'string' && value.length >= (min || 1) && value.length <= 180 && /^[A-Za-z0-9:_-]+$/.test(value); }
  function currentUser() { const a=root&&root.UpskillAuth,u=a&&typeof a.getUser==='function'?a.getUser():null; return u&&u.id?u:null; }
  function client() { const a=root&&root.UpskillAuth; return a&&typeof a.getClient==='function'?a.getClient():null; }
  function online() { return !(root&&root.navigator&&root.navigator.onLine===false); }
  function uuid() { return root&&root.crypto&&typeof root.crypto.randomUUID==='function'?root.crypto.randomUUID():'c-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12); }
  function deviceId() {
    let id=''; try{id=String(root.localStorage.getItem(DEVICE_KEY)||'');}catch(_){}
    if(!validId(id,3)){id='device-'+uuid();try{root.localStorage.setItem(DEVICE_KEY,id);}catch(_){}}
    return id;
  }
  function clientId() {
    let token=''; try{token=String(root.sessionStorage.getItem(CLIENT_KEY)||'');}catch(_){}
    if(!validId(token,3)){token='tab-'+uuid();try{root.sessionStorage.setItem(CLIENT_KEY,token);}catch(_){}}
    const out=(deviceId()+':'+token).slice(0,180); return out;
  }
  function ownerKey() { const u=currentUser(); return u?String(u.id):''; }
  function parseStorage(key, fallback) { try { return JSON.parse(root.localStorage.getItem(key)||'null') || fallback; } catch(_) { return fallback; } }
  function writeStorage(key, value) {
    root.localStorage.setItem(key,JSON.stringify(value));
    const check=parseStorage(key,null); if(!check)fail('HANDOFF_STORAGE_UNCONFIRMED','Browser storage did not confirm the handoff write.'); return true;
  }
  function readMeta() { const v=parseStorage(META_KEY,{schemaVersion:SCHEMA,owners:{}}); return v&&v.schemaVersion===SCHEMA&&record(v.owners)?v:{schemaVersion:SCHEMA,owners:{}}; }
  function ownerMeta(create) { const u=ownerKey(),m=readMeta(); if(!u)return {root:m,owner:null}; if(!m.owners[u]&&create)m.owners[u]={sessions:{}}; return {root:m,owner:m.owners[u]||null}; }
  function saveMeta(sessionId, patch) {
    const x=ownerMeta(true); if(!x.owner)return null; x.owner.sessions=record(x.owner.sessions); x.owner.sessions[sessionId]=Object.assign({},record(x.owner.sessions[sessionId]),clone(patch||{})); writeStorage(META_KEY,x.root); return clone(x.owner.sessions[sessionId]);
  }
  function metaFor(sessionId) { const x=ownerMeta(false); return clone(x.owner&&record(x.owner.sessions)[sessionId]||null); }

  function conflictStore() { const v=parseStorage(CONFLICT_KEY,{schemaVersion:SCHEMA,owners:{}}); return v&&v.schemaVersion===SCHEMA&&record(v.owners)?v:{schemaVersion:SCHEMA,owners:{}}; }
  function preserveConflict(sessionId, reason, localSnapshot, pendingEvents) {
    const u=ownerKey(); if(!u)return null; const s=conflictStore(); s.owners[u]=asArray(s.owners[u]);
    const entry={id:'handoff-conflict-'+uuid(),sessionId:String(sessionId),reason:String(reason||'cloud-state-won'),preservedAt:new Date().toISOString(),localSnapshot:clone(localSnapshot||null),pendingEvents:clone(asArray(pendingEvents))};
    s.owners[u].push(entry); s.owners[u]=s.owners[u].slice(-MAX_CONFLICTS_PER_OWNER); writeStorage(CONFLICT_KEY,s); return clone(entry);
  }
  function conflicts(sessionId) { const u=ownerKey(),s=conflictStore(); return asArray(s.owners[u]).filter(x=>!sessionId||x.sessionId===sessionId).map(clone); }

  function remoteError(result, fallback) {
    if(result&&result.error){const e=new Error(result.error.message||fallback||'Remote handoff request failed');e.code=String(result.error.code||result.error.sqlState||'HANDOFF_REMOTE_ERROR');throw e;}
    return result&&Object.prototype.hasOwnProperty.call(result,'data')?result.data:result;
  }
  function withTimeout(request, label) {
    let controller=null,req=request;
    if(typeof root.AbortController==='function'&&req&&typeof req.abortSignal==='function'){controller=new root.AbortController();req=req.abortSignal(controller.signal);}
    return new Promise(function(resolve,reject){let done=false;const timer=root.setTimeout(function(){if(controller)controller.abort();const e=new Error((label||'Handoff request')+' timed out');e.code='TB_HANDOFF_TIMEOUT';finish(reject,e);},REQUEST_TIMEOUT_MS);
      function finish(cb,v){if(done)return;done=true;root.clearTimeout(timer);cb(v);} Promise.resolve(req).then(v=>finish(resolve,v),e=>finish(reject,e));});
  }
  async function rpc(name,args,label){const c=client();if(!c||typeof c.rpc!=='function')fail('HANDOFF_SERVICE_UNAVAILABLE','Authenticated handoff service is unavailable.');if(!online())fail('HANDOFF_OFFLINE','Reconnect before transferring an active session.');return remoteError(await withTimeout(c.rpc(name,args||{}),label||name),label);}

  function normalizeRow(row) {
    if(Array.isArray(row))row=row[0]||null; if(!row)return null;
    const out={
      sessionId:String(row.session_id||row.sessionId||''),examId:String(row.exam_id||row.examId||''),state:String(row.state||''),
      writerEpoch:Number(row.writer_epoch==null?row.writerEpoch:row.writer_epoch),writerClientId:String(row.writer_client_id||row.writerClientId||''),writerDeviceId:String(row.writer_device_id||row.writerDeviceId||''),
      checkpointRevision:Number(row.checkpoint_revision==null?row.checkpointRevision:row.checkpoint_revision),serverSessionRevision:Number(row.server_session_revision==null?row.serverSessionRevision:row.server_session_revision),
      snapshot:clone(row.snapshot||null),updatedAt:row.updated_at||row.updatedAt||null,serverTime:row.server_time||row.serverTime||null
    };
    if(!validId(out.sessionId,3)||!validId(out.examId,2)||!Number.isSafeInteger(out.writerEpoch)||out.writerEpoch<0||!Number.isSafeInteger(out.checkpointRevision)||out.checkpointRevision<1||!Number.isSafeInteger(out.serverSessionRevision)||out.serverSessionRevision<0||!out.snapshot)fail('MALFORMED_HANDOFF_RESPONSE');
    return out;
  }
  function validateEnvelope(value) {
    const v=record(value),u=currentUser();
    if(v.schemaVersion!==SCHEMA||v.contractVersion!==CONTRACT||!['core','adaptive'].includes(v.kind))fail('INVALID_HANDOFF_SNAPSHOT');
    if(!u||String(v.ownerId)!==String(u.id))fail('HANDOFF_OWNER_MISMATCH');
    if(!validId(String(v.sessionId||''),3)||!validId(String(v.examId||''),2)||!Number.isSafeInteger(v.writerEpoch)||v.writerEpoch<0)fail('INVALID_HANDOFF_IDENTITY');
    if(typeof v.timed!=='boolean'||!Number.isFinite(Date.parse(v.startedAt||'')))fail('INVALID_HANDOFF_TIMING');
    if(v.timed&&!Number.isFinite(Date.parse(v.deadlineAt||'')))fail('INVALID_HANDOFF_DEADLINE');
    if(!v.timed&&v.deadlineAt!=null)fail('INVALID_HANDOFF_DEADLINE');
    if(!v.payload||typeof v.payload!=='object')fail('INVALID_HANDOFF_PAYLOAD');
    return v;
  }
  function fullVersionPin(snapshot) {
    if(snapshot&&snapshot.versionPin)return clone(snapshot.versionPin);
    const learning=root.__TBLearning,state=learning&&typeof learning.store==='function'?learning.store():null;
    const s=state&&state.sessions&&snapshot&&state.sessions[snapshot.sessionId]; return s&&s.versionPin?clone(s.versionPin):null;
  }
  function coreEnvelope(snapshot) {
    const u=currentUser(); if(!u||!snapshot)return null; const snap=clone(snapshot); const pin=fullVersionPin(snap); if(pin&&!snap.versionPin)snap.versionPin=pin;
    return validateEnvelope({schemaVersion:SCHEMA,contractVersion:CONTRACT,kind:'core',ownerId:String(u.id),sessionId:snap.sessionId,examId:snap.examId,mode:snap.mode,state:snap.state,writerEpoch:Number(snap.writerEpoch||0),timed:!!snap.timed,startedAt:snap.startedAt,deadlineAt:snap.deadlineAt||null,payload:snap});
  }
  function adaptiveEnvelope() {
    const u=currentUser(); if(!u)return null; const a=parseStorage(ADAPTIVE_KEY,null); if(!a||a.complete||!a.learningSessionId||!a.versionPin)return null;
    const pin=a.versionPin; return validateEnvelope({schemaVersion:SCHEMA,contractVersion:CONTRACT,kind:'adaptive',ownerId:String(u.id),sessionId:String(a.learningSessionId),examId:String(a.examId||pin.examId||''),mode:'adaptive',state:'in_progress',writerEpoch:Number((learningSession(a.learningSessionId)||{}).writerEpoch||pin.writerEpoch||0),timed:false,startedAt:new Date(Number(a.startedAt)).toISOString(),deadlineAt:null,payload:clone(a)});
  }
  function transferSignature(v) {
    if(!v)return '';
    if(v.kind==='core'){const s=v.payload||{};return JSON.stringify({currentItemId:s.currentItemId||null,flags:asArray(s.flags).slice().sort(),items:asArray(s.orderedItems).map(i=>[i.itemId,i.selectedOptionId==null?null:i.selectedOptionId]),state:s.state});}
    const a=v.payload||{};return JSON.stringify({index:Number(a.index||0),answers:record(a.answers),checked:record(a.checked),complete:!!a.complete});
  }

  function learningState(){const l=root.__TBLearning;return l&&typeof l.store==='function'?l.store():null;}
  function learningSession(sessionId){const s=learningState();return s&&s.sessions&&s.sessions[sessionId]||null;}
  function pendingSessionEvents(sessionId) {
    const u=ownerKey(),s=learningState(); if(!u||!s)return [];
    return asArray(s.events).filter(e=>e&&e.sessionId===sessionId&&e.scope==='user:'+u&&asArray(e.syncedFor).indexOf(u)===-1);
  }
  function persistLearningState(state) { if(!state)return false; writeStorage(LEARNING_KEY,state); return true; }
  function adoptLearningSession(envelope,row) {
    const u=currentUser(),state=learningState(); if(!u||!state)fail('LEARNING_RUNTIME_UNAVAILABLE');
    const payload=envelope.payload;
    const ordered=envelope.kind==='core'?asArray(payload.orderedItems):asArray((payload.versionPin||{}).orderedItems);
    const prior=record(state.sessions[row.sessionId]);
    state.sessions[row.sessionId]=Object.assign({},prior,{
      id:row.sessionId,examId:row.examId,mode:envelope.kind==='adaptive'?'adaptive':String(envelope.mode||payload.mode||'practice'),timed:!!envelope.timed,
      ownerId:String(u.id),startedAt:Date.parse(envelope.startedAt),questionIds:ordered.map(i=>i.questionId).filter(Boolean),versionPin:clone(payload.versionPin||prior.versionPin||null),
      answerEvents:record(prior.answerEvents),drafts:record(prior.drafts),firstExposureByQuestion:record(prior.firstExposureByQuestion),status:'active',writerEpoch:row.writerEpoch,serverRevision:row.serverSessionRevision
    });
    persistLearningState(state); return clone(state.sessions[row.sessionId]);
  }
  function cleanPendingForCloudTakeover(sessionId,localSnapshot) {
    const pending=pendingSessionEvents(sessionId); if(!pending.length)return null;
    preserveConflict(sessionId,'unuploaded-learning-evidence-not-transferred',localSnapshot,pending);
    const state=learningState(),ids=new Set(pending.map(e=>e.id)),u=ownerKey();
    state.events=asArray(state.events).filter(e=>!ids.has(e.id));
    if(state.index&&state.index.knownEventIds)pending.forEach(e=>{delete state.index.knownEventIds[e.id];});
    pending.forEach(function(e){if(e.type!=='answer_recorded'||!e.questionId||!state.index)return;const scope=record(record(state.index.totals)['user:'+u]);const totals=record(scope[e.examId]);const answers=record(totals.answerStates);delete answers[e.sessionId+'|'+e.questionId];totals.answerStates=answers;totals.answers=Object.values(answers).filter(x=>x&&['correct','incorrect'].includes(x.status)).length;});
    persistLearningState(state);
    try { if(root.indexedDB){const req=root.indexedDB.open('tb-learning-events-mirror-v1',1);req.onsuccess=function(){const db=req.result;if(!db.objectStoreNames.contains('events')){db.close();return;}const tx=db.transaction('events','readwrite'),store=tx.objectStore('events');ids.forEach(id=>store.delete(id));tx.oncomplete=()=>db.close();tx.onerror=()=>db.close();};} } catch(_) {}
    return pending.length;
  }

  function localEnvelope(sessionId) {
    if(bindLifecycle()&&typeof lifecycle.load==='function'){const s=lifecycle.load(sessionId);if(s&&ACTIVE.has(s.state))return coreEnvelope(s);}
    const a=adaptiveEnvelope(); return a&&a.sessionId===sessionId?a:null;
  }
  function authorityFor(sessionId){return authorities.get(String(sessionId))||null;}
  function markAuthority(row,phase) {
    if(!row)return null;const a={sessionId:row.sessionId,examId:row.examId,phase:phase||'owned',writerEpoch:row.writerEpoch,writerClientId:row.writerClientId,writerDeviceId:row.writerDeviceId,checkpointRevision:row.checkpointRevision,serverSessionRevision:row.serverSessionRevision,updatedAt:row.updatedAt,serverTime:row.serverTime};authorities.set(row.sessionId,a);saveMeta(row.sessionId,a);return clone(a);
  }
  function stale(sessionId){const a=authorityFor(sessionId);return !!(a&&a.phase==='stale');}
  function guardResult(sessionId){return {sessionId:sessionId,saved:false,blocked:true,reason:'STALE_SESSION_WRITER'};}

  function wrapLearningGuards() {
    if(wrapped)return true;const l=root.__TBLearning;if(!l)return false;wrapped=true;
    ['recordDraft','recordAnswer','completeSession','abandonSession'].forEach(function(name){if(typeof l[name]!=='function')return;originals['learning_'+name]=l[name];l[name]=function(input){if(input&&stale(input.sessionId))return guardResult(input.sessionId);return originals['learning_'+name].apply(this,arguments);};});
    if(bindLifecycle()&&typeof lifecycle.resume==='function'){originals.lifecycleResume=lifecycle.resume;lifecycle.resume=function(sessionId){if(stale(sessionId))fail('STALE_SESSION_WRITER','This session continued in another browser. Take over from the cloud checkpoint before editing.');return originals.lifecycleResume.apply(lifecycle,arguments);};}
    return true;
  }

  async function fetchSessions(sessionId) {
    const u=currentUser(); if(!u)return [];
    const data=await rpc(FETCH_RPC,{p_session_id:sessionId||null},'Active-session fetch');
    return asArray(data).map(normalizeRow).filter(Boolean);
  }
  async function refresh(reason) {
    if(refreshPromise)return refreshPromise;
    refreshPromise=(async function(){try{
      if(!currentUser()||!online())return {ready:false,reason:currentUser()?'offline':'signed-out',sessions:[]};
      const rows=await fetchSessions(null),cid=clientId();
      rows.forEach(function(row){
        const local=localEnvelope(row.sessionId);
        if(local&&row.writerClientId&&row.writerClientId!==cid&&row.writerEpoch>=Number(local.writerEpoch||0))markAuthority(row,'stale');
        else if(row.writerClientId===cid)markAuthority(row,'owned');
        else markAuthority(row,'remote');
      });
      render(rows);lastError=null;return {ready:true,reason:reason||'refresh',sessions:rows.map(clone)};
    }catch(e){lastError=e;return {ready:false,reason:e.code||'error',error:e.message,sessions:[]};}finally{refreshPromise=null;}})();return refreshPromise;
  }

  async function syncLearningBeforeCheckpoint(sessionId) {
    const l=root.__TBLearning;if(!l||typeof l.sync!=='function')return true;
    const result=await l.sync('session-handoff-checkpoint');
    if(result&&result.conflict)fail('STALE_SESSION_WRITER',result.error||'Session writer conflict');
    if(result&&result.cancelled)fail('HANDOFF_SYNC_CANCELLED',result.reason||'Sync cancelled');
    const left=pendingSessionEvents(sessionId);if(left.length)fail('HANDOFF_PENDING_EVIDENCE','The cloud checkpoint cannot advance while session evidence is still pending.');return true;
  }
  async function saveCheckpoint(envelope) {
    validateEnvelope(envelope); if(!ACTIVE.has(envelope.state))return {saved:false,reason:'not-active'};
    const cid=clientId(),did=deviceId();
    await syncLearningBeforeCheckpoint(envelope.sessionId);
    let m=metaFor(envelope.sessionId),expected=Number(m&&m.checkpointRevision||0);
    const attempt=async()=>normalizeRow(await rpc(SAVE_RPC,{p_session_id:envelope.sessionId,p_writer_client_id:cid,p_writer_device_id:did,p_writer_epoch:Number(envelope.writerEpoch||0),p_expected_checkpoint_revision:expected,p_snapshot:envelope},'Session checkpoint save'));
    try{const row=await attempt();markAuthority(row,'owned');return {saved:true,row};}
    catch(e){if(String(e.code)==='40001'||String(e.code)==='23505'){const rows=await fetchSessions(envelope.sessionId),row=rows[0];if(row&&row.writerClientId===cid&&row.writerEpoch===Number(envelope.writerEpoch||0)){expected=row.checkpointRevision;const retry=await attempt();markAuthority(retry,'owned');return {saved:true,row:retry,retried:true};}if(row)markAuthority(row,'stale');}throw e;}
  }
  function queueCheckpoint(envelope) {
    if(suppressCheckpoint||!envelope||!currentUser()||!ACTIVE.has(envelope.state))return;
    checkpointQueued=clone(envelope);if(checkpointTimer)return;checkpointTimer=root.setTimeout(function(){checkpointTimer=0;const value=checkpointQueued;checkpointQueued=null;saveCheckpoint(value).catch(function(e){lastError=e;if(String(e.code)==='40001')refresh('checkpoint-conflict');});},200);
  }

  function cloudDiffersFromLocal(row,local) {
    if(!local||!row||!row.snapshot)return false;try{return transferSignature(validateEnvelope(local))!==transferSignature(validateEnvelope(row.snapshot));}catch(_){return true;}
  }
  function updateEnvelopeEpoch(envelope,epoch) {
    const out=clone(envelope);out.writerEpoch=epoch;if(out.kind==='core'&&out.payload){out.payload.writerEpoch=epoch;}return validateEnvelope(out);
  }
  function adoptCore(row,envelope) {
    if(!bindLifecycle())fail('SESSION_LIFECYCLE_UNAVAILABLE');const core=clone(envelope.payload);core.writerEpoch=row.writerEpoch;
    adoptLearningSession(updateEnvelopeEpoch(envelope,row.writerEpoch),row);
    suppressCheckpoint=true;try{lifecycle.save(core);}finally{suppressCheckpoint=false;}
    return core;
  }
  function adoptAdaptive(row,envelope) {
    const adaptive=clone(envelope.payload);adaptive.version=2;adaptive.learningSessionId=row.sessionId;adaptive.examId=row.examId;
    adoptLearningSession(updateEnvelopeEpoch(envelope,row.writerEpoch),row);writeStorage(ADAPTIVE_KEY,adaptive);return adaptive;
  }
  async function resumeAccepted(row) {
    let envelope=validateEnvelope(updateEnvelopeEpoch(row.snapshot,row.writerEpoch));
    if(envelope.kind==='core'){
      const core=adoptCore(row,envelope);
      if(core.timed){const timing=root.__TBSessionTiming||(lifecycle&&lifecycle.timing);if(!timing||typeof timing.recover!=='function')fail('TIMING_RECOVERY_REQUIRED');await timing.recover();if(typeof timing.isExpired==='function'&&timing.isExpired(core))fail('SESSION_DEADLINE_REACHED');}
      markAuthority(row,'owned'); return lifecycle.resume(row.sessionId);
    }
    adoptAdaptive(row,envelope);markAuthority(row,'owned');
    const tile=root.document&&root.document.querySelector('.tb-tile[data-exam="'+row.examId+'"]');if(tile&&!tile.classList.contains('active'))tile.click();
    const start=root.document&&root.document.querySelector('[data-start-adaptive]');if(start)start.click();
    return clone(envelope.payload);
  }

  async function takeover(sessionId, options) {
    options=options||{};if(!currentUser())fail('HANDOFF_SIGNED_OUT');if(!online())fail('HANDOFF_OFFLINE');
    const rows=await fetchSessions(sessionId),before=rows[0];if(!before)fail('NO_CLOUD_CHECKPOINT');if(TERMINAL.has(before.state))fail('SESSION_TERMINAL');
    const local=localEnvelope(sessionId),pending=pendingSessionEvents(sessionId),diverged=cloudDiffersFromLocal(before,local);
    if((pending.length||diverged)&&before.writerClientId!==clientId()&&!options.confirmCloudState){const e=new Error('This browser has local session changes that are not in the cloud checkpoint. They will not be transferred unless you explicitly choose the cloud checkpoint.');e.code='LOCAL_UNUPLOADED_CHANGES';e.pending=pending.length;e.diverged=diverged;throw e;}
    if((pending.length||diverged)&&before.writerClientId!==clientId()){
      preserveConflict(sessionId,'explicit-cloud-takeover',local,pending);if(pending.length)cleanPendingForCloudTakeover(sessionId,local);
    }
    const data=await rpc(TAKEOVER_RPC,{p_session_id:sessionId,p_writer_client_id:clientId(),p_writer_device_id:deviceId(),p_expected_writer_epoch:before.writerEpoch,p_expected_checkpoint_revision:before.checkpointRevision},'Session takeover');
    const after=normalizeRow(data);markAuthority(after,'owned');return resumeAccepted(after);
  }
  async function resumeCloud(sessionId) {
    const rows=await fetchSessions(sessionId),row=rows[0];if(!row)fail('NO_CLOUD_CHECKPOINT');if(row.writerClientId!==clientId())return takeover(sessionId);return resumeAccepted(row);
  }

  function render(rows) {
    if(!root.document)return;const host=root.document.getElementById('tb-overview');if(!host)return;
    host.querySelectorAll('[data-session-handoff]').forEach(n=>n.remove());
    asArray(rows).slice(0,3).forEach(function(row){const local=localEnvelope(row.sessionId),phase=(authorityFor(row.sessionId)||{}).phase; if(local&&phase==='owned')return;
      const box=root.document.createElement('section');box.className='tb-pane';box.setAttribute('data-session-handoff',row.sessionId);box.setAttribute('role',phase==='stale'?'alert':'status');
      const h=root.document.createElement('h3');h.style.marginTop='0';h.textContent=phase==='stale'?'This session continued in another browser.':'Continue a cloud-saved session?';
      const p=root.document.createElement('p');p.textContent='Only the latest cloud-accepted checkpoint transfers. The original deadline is preserved. Local changes that were never uploaded from another device are not included.';
      const b=root.document.createElement('button');b.type='button';b.className='btn btn-teal';b.setAttribute('data-handoff-takeover','');b.textContent=row.writerClientId===clientId()?'Resume cloud session':'Take over and continue';
      b.addEventListener('click',async function(){try{b.disabled=true;await resumeCloud(row.sessionId);}catch(e){if(e.code==='LOCAL_UNUPLOADED_CHANGES'&&!b.dataset.confirmCloud){b.dataset.confirmCloud='true';b.textContent='Use cloud state and take over';p.textContent='This browser has local changes that are not in the cloud checkpoint. They will be preserved locally as conflict evidence but will not overwrite the cloud state. Press again to confirm.';}else if(e.code==='LOCAL_UNUPLOADED_CHANGES'){await takeover(row.sessionId,{confirmCloudState:true});}else{lastError=e;p.textContent='Session transfer could not continue: '+e.message;} }finally{b.disabled=false;}});
      box.append(h,p,b);host.prepend(box);
    });
  }

  function wrapLifecycleSave() {
    if(!bindLifecycle()||originals.lifecycleSave)return false; originals.lifecycleSave=lifecycle.save;
    lifecycle.save=function(snapshot,options){const result=originals.lifecycleSave.apply(lifecycle,arguments);try{if(!suppressCheckpoint&&snapshot&&ACTIVE.has(snapshot.state))queueCheckpoint(coreEnvelope(snapshot));}catch(e){lastError=e;}return result;};return true;
  }
  function observeAdaptive() {
    if(!root.document||!root.MutationObserver)return false;const host=root.document.getElementById('tb-adaptive-panel');if(!host)return false;
    if(adaptiveObserver)adaptiveObserver.disconnect();adaptiveObserver=new root.MutationObserver(function(){const raw=root.localStorage.getItem(ADAPTIVE_KEY);if(raw&&raw!==lastAdaptiveRaw){lastAdaptiveRaw=raw;root.setTimeout(function(){try{const e=adaptiveEnvelope();if(e)queueCheckpoint(e);}catch(err){lastError=err;}},0);}});adaptiveObserver.observe(host,{subtree:true,childList:true,attributes:true});return true;
  }
  function attachEvents() {
    if(!root||!root.addEventListener)return;
    root.addEventListener('focus',function(){void refresh('focus');});root.addEventListener('online',function(){void refresh('online');});
    root.document&&root.document.addEventListener('upskill-auth-ready',function(){wrapLearningGuards();void refresh('auth-ready');});
    root.document&&root.document.addEventListener('upskill-test-progress-synced',function(){void refresh('progress-sync');});
    root.document&&root.document.addEventListener('tb:learning-updated',function(){root.setTimeout(function(){try{const e=adaptiveEnvelope();if(e)queueCheckpoint(e);}catch(err){lastError=err;}},0);});
  }
  function installBrowser() {
    if(installed||!root||!root.document)return false;
    if(!bindLifecycle()){if(bindAttempts++<100)root.setTimeout(installBrowser,50);return false;}
    installed=true;wrapLifecycleSave();wrapLearningGuards();attachEvents();
    const boot=function(){wrapLearningGuards();observeAdaptive();void refresh('boot');};if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});else root.queueMicrotask?root.queueMicrotask(boot):root.setTimeout(boot,0);return true;
  }

  const api={schemaVersion:SCHEMA,contractVersion:CONTRACT,rpcs:{fetch:FETCH_RPC,save:SAVE_RPC,takeover:TAKEOVER_RPC},deviceId,clientId,validateEnvelope,coreEnvelope,adaptiveEnvelope,fetchSessions,refresh,saveCheckpoint,takeover,resumeCloud,pendingSessionEvents,conflicts,authorityFor,adoptLearningSession,cleanPendingForCloudTakeover,installBrowser,status:function(){return {installed,clientId:clientId(),authorities:Array.from(authorities.values()).map(clone),lastError:lastError?{code:lastError.code||'ERROR',message:lastError.message}:null};}};
  if(bindLifecycle())lifecycle.handoff=api;wrapLifecycleSave();wrapLearningGuards();if(root&&root.document)installBrowser();return api;
}));
