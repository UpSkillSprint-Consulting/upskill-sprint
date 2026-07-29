(function () {
  'use strict';

  const SESSION_KEY = 'tb-adaptive-session-v2';

  function readSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (error) { return null; }
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (error) {}
  }

  function questionMap() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    const examId = active ? active.dataset.exam : 'cssbb';
    const exam = window.__TB && window.__TB.EXAMS ? window.__TB.EXAMS[examId] : null;
    const map = new Map();
    function add(question) { if (question && question.stem && !map.has(question.stem)) map.set(question.stem, question); }
    if (exam && exam.sets) Object.keys(exam.sets).forEach(function (key) { (exam.sets[key] || []).forEach(add); });
    if (exam && exam.bank) exam.bank.forEach(add);
    return map;
  }

  function complete(saved) {
    const map = questionMap();
    const items = (saved.stems || []).map(function (stem) { return map.get(stem); }).filter(Boolean);
    const results = items.map(function (question, index) {
      const selected = saved.answers && saved.answers[index] != null ? Number(saved.answers[index]) : null;
      return { question: question, selected: selected, status: selected == null ? 'unanswered' : selected === question.answer ? 'correct' : 'incorrect' };
    });
    if (window.__TBAdaptiveMastery && results.length) window.__TBAdaptiveMastery.recordResults(results, 'adaptive-practice-v2');
    const correct = results.filter(function (result) { return result.status === 'correct'; }).length;
    const panel = document.getElementById('tb-adaptive-panel');
    if (panel) {
      panel.hidden = false;
      panel.innerHTML = '<div class="tb-adaptive-summary"><div class="tb-ring big" style="--p:' + Math.round(correct / Math.max(results.length, 1) * 100) + '"><span>' + correct + '<small>/' + results.length + '</small></span></div><div><div class="tb-diag-kick">Adaptive session complete</div><h3>Your mastery map has been updated.</h3><p>This session combined due retrieval, low-mastery reinforcement, subtopic diversity, and controlled new material.</p><div class="tb-adaptive-actions"><button type="button" class="btn btn-teal" data-v2-new>Build another session</button><button type="button" class="tb-ghost" data-v2-close>Return to results</button></div></div></div>';
      panel.tabIndex = -1;
      panel.focus();
    }
    clearSession();
    const live = document.getElementById('tb-feedback-live');
    if (live) live.textContent = 'Adaptive session complete. ' + correct + ' of ' + results.length + ' correct.';
    document.dispatchEvent(new CustomEvent('tb:adaptive-complete', { detail: { correct: correct, total: results.length } }));
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
