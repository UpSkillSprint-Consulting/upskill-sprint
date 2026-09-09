/* Segment 12 finalization adapter.
 * Loaded after test-bank-session-lifecycle.js. Keeps a failed submission frozen,
 * retries the same session id, and never reopens a finalizing/terminal session. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else factory(root, root.__TBSessionLifecycle);
}(typeof window === 'object' ? window : globalThis, function (root, lifecycle) {
  'use strict';
  if (!lifecycle || lifecycle.__segment12FinalizationHardened) return lifecycle;

  const editable = new Set(['created','in_progress','paused']);
  const originalResume = lifecycle.resume;
  const originalAbandon = lifecycle.abandonSaved;
  let learningWrapped = false;
  let authSubscribed = false;
  let hostObserver = null;
  let recoveryScheduled = false;

  function fail(code, message) { const error = new Error(message || code); error.code = code; throw error; }
  function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function current(sessionId) { return lifecycle.load(sessionId); }

  lifecycle.resume = function (sessionId) {
    const snapshot = current(sessionId);
    if (!snapshot || !editable.has(snapshot.state)) fail('NO_RESUMABLE_SESSION');
    const result = originalResume.call(lifecycle, sessionId);
    try {
      if (root.document && root.CustomEvent) root.document.dispatchEvent(new root.CustomEvent('tb:learning-session-started', { detail: { sessionId:snapshot.sessionId, examId:snapshot.examId, mode:snapshot.mode, resumed:true } }));
    } catch (_) {}
    return result;
  };

  lifecycle.abandonSaved = function (sessionId) {
    const snapshot = current(sessionId);
    if (!snapshot) return null;
    if (snapshot.state === 'finalizing') fail('ILLEGAL_SESSION_TRANSITION','A finalizing submission cannot be abandoned. Retry the frozen submission.');
    return originalAbandon.call(lifecycle, sessionId);
  };

  lifecycle.retryFinalization = function (sessionId) {
    const snapshot = current(sessionId);
    if (!snapshot || snapshot.state !== 'finalizing') fail('NO_FINALIZATION_TO_RETRY');
    const versions = root.__TBVersions;
    const learning = root.__TBLearning;
    if (!versions || typeof versions.checkedPin !== 'function' || typeof versions.questionFor !== 'function') fail('VERSION_RUNTIME_UNAVAILABLE');
    if (!learning || typeof learning.completeSession !== 'function') fail('LEARNING_RUNTIME_UNAVAILABLE');
    const pin = versions.checkedPin(clone(snapshot.versionPin));
    const questions = pin.contents.map(function (q,index) { return versions.questionFor(pin,q,index).question; });
    const records = questions.map(function (question,index) {
      const item = snapshot.orderedItems[index];
      const selected = item && item.selectedOptionId != null ? item.optionOrder.indexOf(item.selectedOptionId) : -1;
      const answer = selected < 0 ? null : selected;
      return { question:question, selected:answer, status:versions.classify(question,answer) };
    });
    return learning.completeSession({
      examId:snapshot.examId, sessionId:snapshot.sessionId, mode:snapshot.mode,
      timed:snapshot.timed, filter:snapshot.filter || null, startedAt:Date.parse(snapshot.startedAt),
      completedReason:snapshot.completionReason || 'submitted', records:records
    });
  };

  function wrapLearning() {
    const learning = root.__TBLearning;
    if (learningWrapped || !learning || typeof learning.completeSession !== 'function') return false;
    learningWrapped = true;
    const previous = learning.completeSession;
    learning.completeSession = function (input) {
      const snapshot = input && current(input.sessionId);
      if (snapshot && !lifecycle.terminalStates.includes(snapshot.state) && snapshot.state !== 'finalizing') {
        try {
          const action = snapshot.timed && input.completedReason === 'timed-out' ? 'deadline_reached' : 'submit';
          lifecycle.save(lifecycle.transition(snapshot, action, { completionReason:input.completedReason || 'submitted' }));
        } catch (_) {}
      } else if (snapshot && snapshot.state === 'finalizing' && !snapshot.completionReason) {
        try { snapshot.completionReason = input.completedReason || 'submitted'; snapshot.sessionRevision += 1; snapshot.updatedAt = new Date().toISOString(); lifecycle.save(snapshot); } catch (_) {}
      }
      return previous.call(this,input);
    };
    return true;
  }

  function getHost() {
    return root.document && root.document.getElementById('tb-overview');
  }

  function ensureBox() {
    const host = getHost();
    if (!host) return null;
    let box = host.querySelector('[data-session-resume]');
    if (!box) {
      box = root.document.createElement('section');
      box.className = 'tb-pane';
      box.setAttribute('data-session-resume','');
      box.setAttribute('role','status');
      host.prepend(box);
    }
    return box;
  }

  function renderEditable(snapshot, box) {
    const answered = snapshot.orderedItems.filter(function (item) { return item.selectedOptionId != null; }).length;
    box.textContent = '';
    const kicker = root.document.createElement('div'); kicker.className='tb-sec'; kicker.textContent='Saved session';
    const title = root.document.createElement('h3'); title.style.marginTop='0'; title.textContent='Continue your ' + snapshot.mode + ' session?';
    const copy = root.document.createElement('p'); copy.textContent = answered + ' of ' + snapshot.orderedItems.length + ' answered. Your question order, selections, flags and original ' + (snapshot.timed ? 'deadline' : 'untimed policy') + ' are preserved on this device.';
    const actions = root.document.createElement('div'); actions.className='tb-cta';
    const resume = root.document.createElement('button'); resume.type='button'; resume.className='btn btn-teal'; resume.setAttribute('data-resume-session',''); resume.textContent='Resume session';
    const abandon = root.document.createElement('button'); abandon.type='button'; abandon.className='tb-ghost'; abandon.setAttribute('data-discard-session',''); abandon.textContent='Abandon saved session';
    resume.addEventListener('click', function () { lifecycle.resume(snapshot.sessionId); });
    abandon.addEventListener('click', function () { lifecycle.abandonSaved(snapshot.sessionId); box.remove(); });
    actions.append(resume,abandon); box.append(kicker,title,copy,actions);
  }

  function renderFinalizing(snapshot, box) {
    const answered = snapshot.orderedItems.filter(function (item) { return item.selectedOptionId != null; }).length;
    box.textContent='';
    const kicker=root.document.createElement('div');kicker.className='tb-sec';kicker.textContent='Submission recovery';
    const title=root.document.createElement('h3');title.style.marginTop='0';title.textContent='Your submission is still finalizing.';
    const copy=root.document.createElement('p');copy.textContent=answered+' of '+snapshot.orderedItems.length+' answers are frozen. This submission cannot be reopened or abandoned because that could create conflicting terminal results.';
    const actions=root.document.createElement('div');actions.className='tb-cta';
    const retry=root.document.createElement('button');retry.type='button';retry.className='btn btn-teal';retry.setAttribute('data-retry-finalization','');retry.textContent='Retry saving submission';
    retry.addEventListener('click',function(){try{const result=lifecycle.retryFinalization(snapshot.sessionId);if(result&&result.saved!==false){box.textContent='';const done=root.document.createElement('p');done.textContent='Your frozen submission was saved successfully. It is terminal and cannot be submitted twice.';box.append(done);}}catch(error){box.setAttribute('data-session-recovery-error',error.code||'ERROR');}});
    actions.append(retry);box.append(kicker,title,copy,actions);
  }

  lifecycle.ensureRecoveryNotice = function (ownerId) {
    if (!root.document || !ownerId) return false;
    const snapshot = lifecycle.load(null,{ownerId:String(ownerId)});
    if (!snapshot || lifecycle.terminalStates.includes(snapshot.state)) return false;
    const runtimeActive = root.__TB && typeof root.__TB.isExamSessionActive === 'function' && root.__TB.isExamSessionActive(snapshot.examId);
    const existing = root.document.querySelector('[data-session-resume]');
    if (runtimeActive) { if (existing) existing.remove(); return false; }
    if (existing) {
      if (snapshot.state === 'finalizing') renderFinalizing(snapshot,existing);
      return true;
    }
    const box = ensureBox();
    if (!box) return false;
    if (snapshot.state === 'finalizing') renderFinalizing(snapshot,box);
    else if (editable.has(snapshot.state)) renderEditable(snapshot,box);
    else { box.remove(); return false; }
    return true;
  };

  function repairNotice() {
    const auth = root.UpskillAuth;
    const user = auth && typeof auth.getUser === 'function' ? auth.getUser() : null;
    if (user && user.id) lifecycle.ensureRecoveryNotice(String(user.id));
  }

  function scheduleRecovery() {
    if (recoveryScheduled) return;
    recoveryScheduled = true;
    queueMicrotask(function () { recoveryScheduled=false; repairNotice(); });
  }

  function observeRecoveryHost() {
    const host = getHost();
    if (!host || !root.MutationObserver) return false;
    if (hostObserver) hostObserver.disconnect();
    hostObserver = new root.MutationObserver(function () {
      if (!host.querySelector('[data-session-resume]')) scheduleRecovery();
    });
    hostObserver.observe(host,{childList:true});
    return true;
  }

  function afterUiSettles() {
    const run = function () { observeRecoveryHost(); repairNotice(); };
    if (typeof root.requestAnimationFrame === 'function') root.requestAnimationFrame(function(){root.requestAnimationFrame(run);});
    else root.setTimeout(run,0);
  }

  function signalOwnerRecovery(user) {
    if (!root.document || !user || !user.id) return;
    queueMicrotask(function () {
      try {
        root.document.dispatchEvent(new root.CustomEvent('tb:exam-changed', { detail:{ reason:'segment12-auth-resolved', ownerId:String(user.id) } }));
        queueMicrotask(function(){lifecycle.ensureRecoveryNotice(String(user.id));afterUiSettles();});
      } catch (_) {}
    });
  }

  function subscribeAuth() {
    if (authSubscribed) return true;
    const auth = root.UpskillAuth;
    if (!auth || typeof auth.onChange !== 'function') return false;
    authSubscribed = true;
    auth.onChange(function (user) { signalOwnerRecovery(user); });
    const currentUser = typeof auth.getUser === 'function' ? auth.getUser() : null;
    if (currentUser) signalOwnerRecovery(currentUser);
    return true;
  }

  lifecycle.__segment12FinalizationHardened = true;
  wrapLearning();
  if (root.document) {
    const boot = function () { wrapLearning(); subscribeAuth(); observeRecoveryHost(); queueMicrotask(repairNotice); afterUiSettles(); };
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', boot, {once:true});
    else queueMicrotask(boot);
    root.document.addEventListener('upskill-auth-ready', function () { subscribeAuth(); repairNotice(); afterUiSettles(); }, {once:true});
    root.addEventListener('load', afterUiSettles, {once:true});
  }
  return lifecycle;
}));
