(function () {
  'use strict';

  const SESSION_KEY = 'tb-adaptive-session-v2';

  function readSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (error) { return null; }
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (error) {}
  }

  function announce(message) {
    const live = document.getElementById('tb-feedback-live');
    if (live) live.textContent = message;
  }

  function writeAheadSaved(result) {
    if (result && typeof result === 'object' && result.saved === false) return false;
    const learning = window.__TBLearning;
    const status = learning && typeof learning.status === 'function' ? learning.status() : null;
    return !(status && status.writeAheadSaved === false);
  }

  function activeExamId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function questionIdentity(examId, question) {
    const helper = window.__TBQuestionRegistry;
    if (helper && typeof helper.idFor === 'function') return String(helper.idFor(examId, question) || '');
    return String(question && (question.qid || question.questionId || question.id || question.stem) || '');
  }

  function questionMap(id) {
    const examId = id || activeExamId();
    const exam = window.__TB && window.__TB.EXAMS ? window.__TB.EXAMS[examId] : null;
    const byId = new Map();
    const byStem = new Map();
    function add(question) {
      if (!question || !question.stem) return;
      const identity = questionIdentity(examId, question);
      if (identity && !byId.has(identity)) byId.set(identity, question);
      if (!byStem.has(question.stem)) byStem.set(question.stem, question);
    }
    if (exam && exam.sets) Object.keys(exam.sets).forEach(function (key) { (exam.sets[key] || []).forEach(add); });
    if (exam && exam.bank) exam.bank.forEach(add);
    return { byId: byId, byStem: byStem };
  }

  function complete(saved) {
    const savedExamId = String(saved && saved.examId || activeExamId());
    const map = questionMap(savedExamId);
    const ids = Array.isArray(saved && saved.questionIds) ? saved.questionIds : [];
    const stems = Array.isArray(saved && saved.stems) ? saved.stems : [];
    const total = Math.max(ids.length, stems.length);
    const results = Array.from({ length: total }, function (_, index) {
      const id = ids[index] == null ? '' : String(ids[index]);
      /* Modern paused sessions retain canonical question IDs. Stem matching is
         only a backwards-compatible fallback for pre-registry sessions, so a
         wording correction cannot lose or shift completion evidence. */
      const question = (id && map.byId.get(id)) || (stems[index] && map.byStem.get(stems[index])) || null;
      if (!question) return null;
      const selected = saved.answers && saved.answers[index] != null ? Number(saved.answers[index]) : null;
      return { question: question, selected: selected, status: selected == null ? 'unanswered' : selected === question.answer ? 'correct' : 'incorrect' };
    }).filter(Boolean);
    const learning = window.__TBLearning;
    if (!learning || typeof learning.completeSession !== 'function' || !saved.learningSessionId || !results.length) {
      announce('Your saved adaptive session cannot be completed until secure learning storage is available. Please refresh and try again.');
      return false;
    }
    const completed = learning.completeSession({ examId: savedExamId, sessionId: saved.learningSessionId, mode: 'adaptive', timed: false, startedAt: saved.startedAt, records: results });
    if (!completed || !writeAheadSaved(completed)) {
      announce('Your completed adaptive session is still waiting for a safe local save. Please try finishing it again.');
      return false;
    }
    const correct = results.filter(function (result) { return result.status === 'correct'; }).length;
    const panel = document.getElementById('tb-adaptive-panel');
    if (panel) {
      panel.hidden = false;
      panel.innerHTML = '<div class="tb-adaptive-summary"><div class="tb-ring big" style="--p:' + Math.round(correct / Math.max(results.length, 1) * 100) + '"><span>' + correct + '<small>/' + results.length + '</small></span></div><div><div class="tb-diag-kick">Adaptive session complete</div><h3>Your mastery map has been updated.</h3><p>This session combined due retrieval, low-mastery reinforcement, subtopic diversity, and controlled new material.</p><div class="tb-adaptive-actions"><button type="button" class="btn btn-teal" data-v2-new>Build another session</button><button type="button" class="tb-ghost" data-v2-close>Return to results</button></div></div></div>';
      panel.tabIndex = -1;
      panel.focus();
    }
    clearSession();
    announce('Adaptive session complete. ' + correct + ' of ' + results.length + ' correct.');
    document.dispatchEvent(new CustomEvent('tb:adaptive-complete', { detail: { correct: correct, total: results.length } }));
    return true;
  }

  window.addEventListener('click', function (event) {
    const button = event.target.closest && event.target.closest('[data-v2-next]');
    if (!button) return;
    const saved = readSession();
    if (!saved || saved.index < (saved.stems || []).length - 1) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    complete(saved);
  }, true);

  window.__TBAdaptiveCompletionGuard = { complete: complete, readSession: readSession };
}());
