/* Segment 13: trusted-clock exam timing and canonical active-question visits.
 * Segment 15 still owns cross-device takeover. This module never changes the
 * deadline captured by the versioned session; it only supplies trustworthy now.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.__TBSessionTiming = factory(root, root.__TBSessionLifecycle);
}(typeof window === 'object' ? window : globalThis, function (root, lifecycle) {
  'use strict';

  const SCHEMA = 1;
  const RPC = 'get_test_bank_server_time_v1';
  const CLOCK_SKEW_TOLERANCE_MS = 1000;
  const CLOCK_REFRESH_MS = 60000;
  const TICK_MS = 250;
  const MAX_VISITS = 10000;
  const TERMINAL = new Set(['completed','expired','abandoned']);
  const nativeDateNow = root && root.Date && typeof root.Date.now === 'function' ? root.Date.now.bind(root.Date) : Date.now.bind(Date);
  const performanceNow = root && root.performance && typeof root.performance.now === 'function' ? root.performance.now.bind(root.performance) : function () { return nativeDateNow(); };
  let calibration = null;
  let lastCalibrationError = null;
  let recoveryRequired = false;
  let recoveryReason = null;
  let wrapped = false;
  let installed = false;
  let timer = null;
  let observer = null;
  let visit = null;
  let visitCounter = 0;
  let expiringSessionId = null;
  let lastContinuity = { wall:nativeDateNow(), mono:performanceNow() };
  let nativeDateNowInstalled = false;
  let originals = null;
  let authClockObserverInstalled = false;

  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
  function fail(code, message) { const e = new Error(message || code); e.code = code; throw e; }
  function finite(v) { return Number.isFinite(Number(v)); }
  function authUser() {
    const auth = root && root.UpskillAuth;
    return auth && typeof auth.getUser === 'function' ? auth.getUser() : null;
  }
  function authClient() {
    const auth = root && root.UpskillAuth;
    return auth && typeof auth.getClient === 'function' ? auth.getClient() : null;
  }
  function currentSnapshot() {
    return lifecycle && typeof lifecycle.load === 'function' ? lifecycle.load() : null;
  }
  function monotonicNow() { return Number(performanceNow()); }
  function trustedNow() {
    if (!calibration || !finite(calibration.serverAtMonoMs) || !finite(calibration.monoAtMs)) return null;
    return calibration.serverAtMonoMs + (monotonicNow() - calibration.monoAtMs);
  }
  function effectiveNow() {
    const value = trustedNow();
    return value == null ? nativeDateNow() : Math.round(value);
  }
  function installTrustedDateNow() {
    if (nativeDateNowInstalled || !root || !root.Date) return false;
    root.Date.now = function () { return effectiveNow(); };
    nativeDateNowInstalled = true;
    return true;
  }
  function fullExamTimedSelected(button) {
    if (!root || !root.document) return true;
    const scope=button && typeof button.closest==='function' ? button.closest('.tb-mode') : null;
    const timed=(scope || root.document).querySelector('[data-timing-kind="full"][data-timed="1"]');
    if (!timed) return true;
    return timed.getAttribute('aria-pressed')==='true' || !!(timed.classList && timed.classList.contains('on'));
  }
  function syncTimedStartControls() {
    if (!root || !root.document) return;
    root.document.querySelectorAll('[data-mode="full"]').forEach(function (button) {
      if (!('disabled' in button)) return;
      const blocked = fullExamTimedSelected(button) && (recoveryRequired || trustedNow()==null);
      if (blocked) {
        if (button.getAttribute('data-timing-clock-wait')!=='true') {
          button.setAttribute('data-timing-clock-was-disabled',button.disabled?'1':'0');
          button.setAttribute('data-timing-clock-wait','true');
        }
        button.disabled=true;
        button.setAttribute('aria-disabled','true');
        return;
      }
      if (button.getAttribute('data-timing-clock-wait')==='true') {
        const wasDisabled=button.getAttribute('data-timing-clock-was-disabled')==='1';
        button.disabled=wasDisabled;
        if (!wasDisabled) button.removeAttribute('aria-disabled');
        button.removeAttribute('data-timing-clock-wait');
        button.removeAttribute('data-timing-clock-was-disabled');
      }
    });
  }
  function clockState() {
    return {
      schemaVersion:SCHEMA,
      ready:trustedNow()!=null,
      recoveryRequired:recoveryRequired,
      recoveryReason:recoveryReason,
      source:calibration && calibration.source || null,
      calibratedAt:calibration && calibration.calibratedAt || null,
      roundTripMs:calibration && calibration.roundTripMs || null,
      uncertaintyMs:calibration && calibration.uncertaintyMs || null,
      lastError:lastCalibrationError ? { code:lastCalibrationError.code || 'CLOCK_SYNC_FAILED', message:lastCalibrationError.message } : null
    };
  }
  function parseServerTime(data) {
    let raw = data;
    if (Array.isArray(raw)) raw = raw[0];
    if (raw && typeof raw === 'object') raw = raw.serverTime || raw.server_time || raw.now || raw.currentTime;
    const ms = typeof raw === 'number' ? raw : Date.parse(String(raw || ''));
    if (!Number.isFinite(ms)) fail('MALFORMED_SERVER_TIME','Trusted clock RPC returned an invalid timestamp.');
    return ms;
  }
  async function calibrate(reason) {
    const user = authUser(), client = authClient();
    if (!user || !user.id || !client || typeof client.rpc !== 'function') {
      const e = new Error('Authenticated trusted-clock service is unavailable.'); e.code='CLOCK_SERVICE_UNAVAILABLE';
      lastCalibrationError=e; syncTimedStartControls(); throw e;
    }
    const t0 = monotonicNow();
    let response;
    try { response = await client.rpc(RPC, { p_reason:String(reason || 'runtime').slice(0,64) }); }
    catch (error) { lastCalibrationError=error; syncTimedStartControls(); throw error; }
    const t1 = monotonicNow();
    if (!response || response.error) {
      const e = new Error(response && response.error && response.error.message || 'Trusted-clock RPC failed.'); e.code='CLOCK_SYNC_FAILED';
      lastCalibrationError=e; syncTimedStartControls(); throw e;
    }
    const serverMs = parseServerTime(response.data);
    const midpoint = (t0 + t1) / 2;
    const rtt = Math.max(0,t1-t0);
    calibration = {
      schemaVersion:SCHEMA,
      source:'authenticated_database_clock',
      userId:String(user.id),
      serverAtMonoMs:serverMs,
      monoAtMs:midpoint,
      roundTripMs:rtt,
      uncertaintyMs:rtt/2,
      calibratedAt:new Date(serverMs).toISOString(),
      nativeWallAtCalibrationMs:nativeDateNow()
    };
    lastCalibrationError=null;
    recoveryRequired=false;
    recoveryReason=null;
    lastContinuity={wall:nativeDateNow(),mono:monotonicNow()};
    installTrustedDateNow();
    syncTimedStartControls();
    persistClockMetadata();
    checkDeadline('clock-calibrated');
    dispatch('tb:timing-calibrated',clockState());
    return clockState();
  }
  function markRecoveryRequired(reason) {
    recoveryRequired=true;
    recoveryReason=String(reason || 'trusted-clock-recovery-required');
    syncTimedStartControls();
    commitVisit('clock-recovery-required');
    renderRecoveryMessage();
    dispatch('tb:timing-recovery-required',{reason:recoveryReason});
  }
  function continuityCheck() {
    const wall=nativeDateNow(), mono=monotonicNow();
    const wallDelta=wall-lastContinuity.wall, monoDelta=mono-lastContinuity.mono;
    lastContinuity={wall,mono};
    if (Math.abs(wallDelta-monoDelta)>CLOCK_SKEW_TOLERANCE_MS) {
      if (root && root.navigator && root.navigator.onLine === false) markRecoveryRequired('clock-discontinuity-offline');
      else calibrate('clock-discontinuity').catch(function(){ markRecoveryRequired('clock-discontinuity-unverified'); });
      return false;
    }
    return true;
  }
  function persistClockMetadata() {
    const snap=currentSnapshot();
    if (!snap || !calibration || !lifecycle || typeof lifecycle.save !== 'function' || TERMINAL.has(snap.state)) return;
    const next=clone(snap);
    next.clockCalibration={schemaVersion:SCHEMA,source:calibration.source,calibratedAt:calibration.calibratedAt,roundTripMs:Math.round(calibration.roundTripMs),uncertaintyMs:Math.ceil(calibration.uncertaintyMs)};
    next.updatedAt=new Date(effectiveNow()).toISOString();
    try { lifecycle.save(next); } catch (_) {}
  }
  function deadlineMs(snapshot) {
    const ms=snapshot && snapshot.deadlineAt != null ? Date.parse(snapshot.deadlineAt) : NaN;
    return Number.isFinite(ms) ? ms : null;
  }
  function remainingMs(snapshot) {
    if (!snapshot || !snapshot.timed) return null;
    const deadline=deadlineMs(snapshot), now=trustedNow();
    if (deadline==null || now==null) return null;
    return Math.max(0,deadline-now);
  }
  function isExpired(snapshot) {
    if (!snapshot || !snapshot.timed) return false;
    const deadline=deadlineMs(snapshot), now=trustedNow();
    return deadline!=null && now!=null && now>=deadline;
  }
  function canEdit(snapshot) {
    if (!snapshot || TERMINAL.has(snapshot.state) || snapshot.state==='finalizing') return false;
    if (!snapshot.timed) return snapshot.state==='in_progress' || snapshot.state==='paused';
    return !recoveryRequired && trustedNow()!=null && !isExpired(snapshot) && snapshot.state==='in_progress';
  }
  function fmt(ms) {
    if (ms==null) return '--:--';
    const seconds=Math.max(0,Math.ceil(ms/1000));
    const m=Math.floor(seconds/60),s=seconds%60;
    return m+':'+String(s).padStart(2,'0');
  }
  function renderTimer(snapshot) {
    if (!root || !root.document || !snapshot || !snapshot.timed) return;
    const node=root.document.getElementById('tb-timer');
    if (!node) return;
    if (recoveryRequired || trustedNow()==null) {
      if (node.textContent!=='Clock recovery required') node.textContent='Clock recovery required';
      node.setAttribute('data-timing-recovery-required','true');
      return;
    }
    node.removeAttribute('data-timing-recovery-required');
    const text=fmt(remainingMs(snapshot));
    if (node.textContent!==text) node.textContent=text;
  }
  function timingEvidence(snapshot, create) {
    if (!snapshot) return null;
    if (!snapshot.timingEvidence && create) snapshot.timingEvidence={schemaVersion:SCHEMA,visits:[],questionTotalsMs:{},measuredQuestionIds:[],unknownVisitCount:0,visitCounter:0};
    const t=snapshot.timingEvidence;
    if (t && (!Array.isArray(t.visits) || !t.questionTotalsMs || !Array.isArray(t.measuredQuestionIds))) {
      if (!create) return null;
      snapshot.timingEvidence={schemaVersion:SCHEMA,visits:[],questionTotalsMs:{},measuredQuestionIds:[],unknownVisitCount:0,visitCounter:0};
    }
    return snapshot.timingEvidence;
  }
  function activeItem(snapshot) {
    if (!snapshot || !Array.isArray(snapshot.orderedItems) || !root || !root.document) return null;
    const quiz=root.document.querySelector('#tb-overview .tb-quiz[data-question-id]');
    if (!quiz || quiz.closest('#tb-feedback-loop')) return null;
    const qid=String(quiz.dataset.questionId||'');
    return snapshot.orderedItems.find(function(i){return i.questionId===qid;}) || snapshot.orderedItems.find(function(i){return i.itemId===snapshot.currentItemId;}) || null;
  }
  function startVisit(reason) {
    const snap=currentSnapshot();
    if (!snap || snap.state!=='in_progress' || (root.document && root.document.hidden)) return null;
    const item=activeItem(snap); if (!item) return null;
    if (visit && visit.sessionId===snap.sessionId && visit.itemId===item.itemId) return visit;
    commitVisit('item-change');
    const nowTrusted=snap.timed?trustedNow():effectiveNow();
    visitCounter+=1;
    visit={visitId:snap.sessionId+':'+String(snap.writerEpoch||0)+':'+visitCounter,sessionId:snap.sessionId,itemId:item.itemId,questionId:item.questionId,startMono:monotonicNow(),startTrusted:nowTrusted,reason:String(reason||'visible')};
    return clone(visit);
  }
  function commitVisit(reason) {
    if (!visit) return null;
    const active=visit; visit=null;
    const snap=lifecycle && lifecycle.load ? lifecycle.load(active.sessionId) : null;
    if (!snap || snap.sessionId!==active.sessionId) return null;
    const evidence=timingEvidence(snap,true);
    if (evidence.visits.some(function(v){return v.visitId===active.visitId;})) return null;
    const endMono=monotonicNow();
    let endTrusted=snap.timed?trustedNow():(active.startTrusted==null?effectiveNow():active.startTrusted+Math.max(0,endMono-active.startMono));
    let duration=null;
    if (snap.timed) {
      if (active.startTrusted!=null && endTrusted!=null) {
        const deadline=deadlineMs(snap); if (deadline!=null) endTrusted=Math.min(endTrusted,deadline);
        duration=Math.max(0,Math.round(endTrusted-active.startTrusted));
      }
    } else if (finite(active.startMono) && finite(endMono)) {
      duration=Math.max(0,Math.round(endMono-active.startMono));
    }
    if (duration==null) evidence.unknownVisitCount=Number(evidence.unknownVisitCount||0)+1;
    else {
      evidence.questionTotalsMs[active.questionId]=Number(evidence.questionTotalsMs[active.questionId]||0)+duration;
      if (!evidence.measuredQuestionIds.includes(active.questionId)) evidence.measuredQuestionIds.push(active.questionId);
    }
    const row={visitId:active.visitId,itemId:active.itemId,questionId:active.questionId,startedAt:active.startTrusted==null?null:new Date(active.startTrusted).toISOString(),endedAt:endTrusted==null?null:new Date(endTrusted).toISOString(),durationMs:duration,reason:String(reason||'commit')};
    evidence.visits.push(row);
    if (evidence.visits.length>MAX_VISITS) evidence.visits=evidence.visits.slice(evidence.visits.length-MAX_VISITS);
    evidence.visitCounter=Math.max(Number(evidence.visitCounter||0),visitCounter);
    snap.timingEvidence=evidence;
    snap.updatedAt=new Date(effectiveNow()).toISOString();
    try { lifecycle.save(snap); } catch (_) {}
    dispatch('tb:timing-updated',summary(snap));
    return clone(row);
  }
  function questionTimes(snapshot) {
    const snap=snapshot || currentSnapshot();
    const evidence=timingEvidence(snap,false);
    return clone(evidence && evidence.questionTotalsMs || {});
  }
  function hasQuestionTime(questionId,snapshot) {
    const snap=snapshot || currentSnapshot(); const evidence=timingEvidence(snap,false);
    return !!(evidence && evidence.measuredQuestionIds && evidence.measuredQuestionIds.includes(String(questionId)));
  }
  function summary(snapshot) {
    const snap=snapshot || currentSnapshot(); const evidence=timingEvidence(snap,false);
    const totals=evidence ? Object.values(evidence.questionTotalsMs).filter(function(v){return finite(v)&&Number(v)>=0;}).map(Number) : [];
    const measured=evidence ? evidence.measuredQuestionIds.length : 0;
    const totalItems=snap && Array.isArray(snap.orderedItems) ? snap.orderedItems.length : 0;
    return {schemaVersion:SCHEMA,sessionId:snap&&snap.sessionId||null,questionTotalsMs:clone(evidence&&evidence.questionTotalsMs||{}),measuredItems:measured,totalItems:totalItems,coverage:totalItems?measured/totalItems:null,averageActiveMs:totals.length?totals.reduce(function(a,b){return a+b;},0)/totals.length:null,unknownVisitCount:Number(evidence&&evidence.unknownVisitCount||0),elapsedMs:elapsedMs(snap)};
  }
  function elapsedMs(snapshot, terminalAt) {
    if (!snapshot || !snapshot.startedAt) return null;
    const start=Date.parse(snapshot.startedAt); if(!Number.isFinite(start)) return null;
    let end=terminalAt==null ? (snapshot.timed?trustedNow():effectiveNow()) : (typeof terminalAt==='number'?terminalAt:Date.parse(terminalAt));
    if (!Number.isFinite(end)) return null;
    if (snapshot.timed) { const deadline=deadlineMs(snapshot); if(deadline!=null)end=Math.min(end,deadline); }
    return Math.max(0,Math.round(end-start));
  }
  function syncVisible(reason) {
    const snap=currentSnapshot();
    if (!snap || snap.state!=='in_progress' || (root.document && root.document.hidden)) { commitVisit(reason||'not-visible'); return; }
    const item=activeItem(snap);
    if (!item) { commitVisit(reason||'no-item'); return; }
    if (!visit || visit.sessionId!==snap.sessionId || visit.itemId!==item.itemId) startVisit(reason||'item-visible');
  }
  function dispatch(name,detail) {
    try { if (root && root.document && root.CustomEvent) root.document.dispatchEvent(new root.CustomEvent(name,{detail:clone(detail)})); } catch (_) {}
  }
  function renderRecoveryMessage() {
    if (!root || !root.document) return;
    const host=root.document.querySelector('[data-session-resume]') || root.document.getElementById('tb-overview');
    if (!host || host.querySelector('[data-timing-recovery-message]')) return;
    const p=root.document.createElement('p');p.setAttribute('data-timing-recovery-message','');p.setAttribute('role','status');p.textContent='The exam clock must be re-verified before this timed session can continue. Reconnect and retry clock recovery; the original deadline will not be extended.';
    host.prepend(p);
  }
  function expireActiveSession(reason) {
    const snap=currentSnapshot();
    if (!snap || !snap.timed || TERMINAL.has(snap.state) || snap.state==='finalizing' || !isExpired(snap)) return false;
    if (expiringSessionId===snap.sessionId) return false;
    expiringSessionId=snap.sessionId;
    commitVisit('deadline');
    renderTimer(snap);
    const submit=root.document&&root.document.querySelector('#tb-overview [data-submit]');
    if (submit) {
      try { submit.click(); } finally { root.setTimeout(function(){expiringSessionId=null;},1000); }
      return true;
    }
    expiringSessionId=null;
    dispatch('tb:timing-expiry-pending',{sessionId:snap.sessionId,reason:reason||'deadline'});
    return false;
  }
  function checkDeadline(reason) {
    continuityCheck();
    const snap=currentSnapshot();
    if (!snap || !snap.timed) return false;
    renderTimer(snap);
    if (recoveryRequired || trustedNow()==null) return false;
    if (isExpired(snap)) return expireActiveSession(reason);
    return false;
  }
  function wrapLearning() {
    const learning=root && root.__TBLearning;
    if (wrapped || !learning || typeof learning.startSession!=='function' || typeof learning.recordDraft!=='function' || typeof learning.completeSession!=='function') return false;
    wrapped=true;
    originals={startSession:learning.startSession,recordDraft:learning.recordDraft,completeSession:learning.completeSession};
    learning.startSession=function(input) {
      if (input && input.timed && (recoveryRequired || trustedNow()==null)) return {saved:false,blocked:true,reason:'TIMING_RECOVERY_REQUIRED'};
      const result=originals.startSession.apply(this,arguments);
      if (input && input.timed && result && result.saved!==false) queueMicrotask(function(){persistClockMetadata();syncVisible('session-start');});
      return result;
    };
    learning.recordDraft=function(input) {
      const snap=input&&lifecycle&&lifecycle.load?lifecycle.load(input.sessionId):currentSnapshot();
      if (snap&&snap.timed) {
        if (recoveryRequired || trustedNow()==null) return {saved:false,blocked:true,reason:'TIMING_RECOVERY_REQUIRED'};
        if (isExpired(snap)) { expireActiveSession('draft-after-deadline'); return {saved:false,blocked:true,reason:'DEADLINE_REACHED'}; }
      }
      return originals.recordDraft.apply(this,arguments);
    };
    learning.completeSession=function(input) {
      let snap=input&&lifecycle&&lifecycle.load?lifecycle.load(input.sessionId):currentSnapshot();
      if (snap&&snap.timed) {
        if (recoveryRequired || trustedNow()==null) return {saved:false,blocked:true,reason:'TIMING_RECOVERY_REQUIRED'};
        const expired=isExpired(snap);
        if (input&&input.completedReason==='timed-out'&&!expired) return {saved:false,blocked:true,reason:'DEADLINE_NOT_REACHED'};
        if (expired) input=Object.assign({},input,{completedReason:'timed-out'});
        commitVisit(expired?'deadline':'submit');
      } else commitVisit('submit');
      const result=originals.completeSession.call(this,input);
      if (result&&result.saved!==false) queueMicrotask(function(){syncVisible('completion');});
      return result;
    };
    learning.__segment13TimingWrapped=true;
    return true;
  }
  function wrapLifecycleResume() {
    if (!lifecycle || lifecycle.__segment13TimingResumeWrapped || typeof lifecycle.resume!=='function') return false;
    const original=lifecycle.resume;
    lifecycle.resume=function(sessionId) {
      const snap=lifecycle.load(sessionId);
      if (snap&&snap.timed&&(recoveryRequired||trustedNow()==null)) fail('TIMING_RECOVERY_REQUIRED','Reconnect so the original exam deadline can be verified before resuming.');
      if (snap&&snap.timed&&isExpired(snap)) { expireActiveSession('resume-after-deadline'); fail('SESSION_DEADLINE_REACHED','The saved timed session has reached its original deadline.'); }
      const out=original.apply(lifecycle,arguments);queueMicrotask(function(){syncVisible('resume');});return out;
    };
    lifecycle.__segment13TimingResumeWrapped=true;return true;
  }
  async function recover() {
    try { return await calibrate('explicit-recovery'); }
    catch (error) { markRecoveryRequired('trusted-clock-unavailable'); throw error; }
  }
  function bootClock() {
    const snap=currentSnapshot();
    const timed=!!(snap&&snap.timed&&!TERMINAL.has(snap.state));
    syncTimedStartControls();
    if (root.navigator&&root.navigator.onLine===false) {
      if (timed) markRecoveryRequired('offline-restart');
      return Promise.resolve(clockState());
    }
    return calibrate(timed?'timed-recovery':'page-ready').catch(function(error){if(timed)markRecoveryRequired('trusted-clock-unavailable');return clockState();});
  }
  function installAuthClockObserver() {
    if (authClockObserverInstalled) return true;
    const auth=root && root.UpskillAuth;
    if (!auth || typeof auth.onChange!=='function') return false;
    authClockObserverInstalled=true;
    auth.onChange(function(user) {
      const currentId=user&&user.id?String(user.id):null;
      const calibratedId=calibration&&calibration.userId?String(calibration.userId):null;
      if (!currentId) {
        calibration=null;
        lastCalibrationError=null;
        recoveryRequired=false;
        recoveryReason=null;
        syncTimedStartControls();
        return;
      }
      if (calibratedId && calibratedId!==currentId) calibration=null;
      bootClock().then(function(){syncTimedStartControls();});
    });
    return true;
  }
  function initializeBrowser() {
    if (installed || !root || !root.document) return false;installed=true;
    wrapLearning();wrapLifecycleResume();installAuthClockObserver();syncTimedStartControls();
    const start=function(){wrapLearning();wrapLifecycleResume();installAuthClockObserver();syncTimedStartControls();bootClock().then(function(){syncTimedStartControls();syncVisible('boot');checkDeadline('boot');});};
    if (root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',start,{once:true});else queueMicrotask(start);
    root.document.addEventListener('upskill-auth-ready',function(){installAuthClockObserver();syncTimedStartControls();bootClock();});
    root.document.addEventListener('tb:learning-session-started',function(){wrapLearning();queueMicrotask(function(){persistClockMetadata();syncVisible('learning-started');});});
    root.document.addEventListener('visibilitychange',function(){
      if (root.document.hidden) { commitVisit('hidden'); lastContinuity={wall:nativeDateNow(),mono:monotonicNow()}; }
      else { continuityCheck(); if(recoveryRequired&&root.navigator&&root.navigator.onLine!==false)calibrate('visibility-return').catch(function(){}); queueMicrotask(function(){syncVisible('visible');checkDeadline('visible');}); }
    },true);
    root.addEventListener('pagehide',function(){commitVisit('pagehide');},{capture:true});
    root.addEventListener('online',function(){calibrate('online').catch(function(){});});
    root.addEventListener('offline',function(){lastContinuity={wall:nativeDateNow(),mono:monotonicNow()};syncTimedStartControls();});
    root.document.addEventListener('click',function(e){const t=e.target&&e.target.closest&&e.target.closest('[data-goto],[data-next],[data-prev],[data-submit],[data-timing-kind="full"]');if(t)queueMicrotask(function(){syncTimedStartControls();syncVisible('navigation');});},true);
    const host=root.document.getElementById('tb-overview');if(host&&root.MutationObserver){observer=new root.MutationObserver(function(){queueMicrotask(function(){syncTimedStartControls();syncVisible('mutation');renderTimer(currentSnapshot());});});observer.observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-pressed','data-question-id','hidden']});}
    timer=root.setInterval(function(){wrapLearning();syncTimedStartControls();checkDeadline('tick');syncVisible('tick');},TICK_MS);
    return true;
  }

  const api={schemaVersion:SCHEMA,rpc:RPC,clockState,calibrate,recover,trustedNow,effectiveNow,monotonicNow,remainingMs,isExpired,canEdit,questionTimes,hasQuestionTime,summary,elapsedMs,startVisit,commitVisit,syncVisible,checkDeadline,markRecoveryRequired,installBrowser:initializeBrowser,status:function(){return {clock:clockState(),activeVisit:clone(visit),session:currentSnapshot()&&currentSnapshot().sessionId||null,wrapped:wrapped,installed:installed};}};
  if (lifecycle) {
    lifecycle.timing=api;
    lifecycle.recoverTiming=recover;
  }
  if (root&&root.document)initializeBrowser();
  return api;
}));
