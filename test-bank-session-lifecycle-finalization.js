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

  function repairNotice() {
    if (!root.document) return;
    const snapshot = lifecycle.load();
    if (!snapshot || snapshot.state !== 'finalizing') return;
    const box = root.document.querySelector('[data-session-resume]');
    if (!box) return;
    const answered = snapshot.orderedItems.filter(function (item) { return item.selectedOptionId != null; }).length;
    box.innerHTML = '<div class="tb-sec">Submission recovery</div><h3 style="margin-top:0">Your submission is still finalizing.</h3><p>' + answered + ' of ' + snapshot.orderedItems.length + ' answers are frozen. This submission cannot be reopened or abandoned because that could create conflicting terminal results.</p><div class="tb-cta"><button type="button" class="btn btn-teal" data-retry-finalization>Retry saving submission</button></div>';
    const button = box.querySelector('[data-retry-finalization]');
    if (button) button.addEventListener('click', function () {
      try {
        const result = lifecycle.retryFinalization(snapshot.sessionId);
        if (result && result.saved !== false) box.innerHTML = '<div class="tb-sec">Submission saved</div><p>Your frozen submission was saved successfully. It is terminal and cannot be submitted twice.</p>';
      } catch (error) {
        box.setAttribute('data-session-recovery-error', error.code || 'ERROR');
      }
    });
  }

  lifecycle.__segment12FinalizationHardened = true;
  wrapLearning();
  if (root.document) {
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', function () { wrapLearning(); queueMicrotask(repairNotice); }, {once:true});
    else queueMicrotask(repairNotice);
  }
  return lifecycle;
}));
