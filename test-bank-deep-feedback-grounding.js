(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const MAX_POINT_LENGTH = 280;
  let scheduled = false;

  function stripHtml(value) {
    const holder = document.createElement('div');
    holder.innerHTML = String(value == null ? '' : value);
    return (holder.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function literalKeyPoint(explanation) {
    const text = stripHtml(explanation);
    if (!text) return 'A stored learning point is not available for this question yet.';
    if (text.length <= MAX_POINT_LENGTH) return text;

    const slice = text.slice(0, MAX_POINT_LENGTH - 1);
    const lastSpace = slice.lastIndexOf(' ');
    const boundary = lastSpace >= 180 ? lastSpace : slice.length;
    return slice.slice(0, boundary).trimEnd() + '…';
  }

  function installApiGuard() {
    if (window.__TBDeepFeedback) window.__TBDeepFeedback.extractKeyPoint = literalKeyPoint;
  }

  function currentExam() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    const examId = active ? active.dataset.exam : 'cssbb';
    return window.__TB && window.__TB.EXAMS ? window.__TB.EXAMS[examId] : null;
  }

  function questionMap() {
    const map = new Map();
    const exam = currentExam();
    function add(question) {
      if (question && question.stem && !map.has(question.stem)) map.set(question.stem, question);
    }
    if (exam && exam.sets) Object.keys(exam.sets).forEach(function (key) { (exam.sets[key] || []).forEach(add); });
    if (exam && exam.bank) exam.bank.forEach(add);
    return map;
  }

  function replaceReviewPoints(root, questions) {
    root.querySelectorAll('.tb-review-card').forEach(function (card) {
      const stem = card.querySelector('.tb-review-stem');
      const point = card.querySelector('.tb-key-point');
      if (!stem || !point) return;
      const question = questions.get(stem.textContent.trim());
      if (question) point.textContent = literalKeyPoint(question.why);
    });
  }

  function replaceSimilarPoint(root, questions) {
    const panel = root.querySelector('#tb-similar-practice');
    if (!panel) return;
    const stem = panel.querySelector('.tb-review-stem');
    if (!stem) return;
    const question = questions.get(stem.textContent.trim());
    if (!question) return;

    panel.querySelectorAll('.tb-deep-label').forEach(function (label) {
      if (label.textContent.trim() !== 'Key learning point') return;
      const point = label.nextElementSibling;
      if (point) point.textContent = literalKeyPoint(question.why);
    });
  }

  function apply() {
    scheduled = false;
    installApiGuard();
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;
    const questions = questionMap();
    replaceReviewPoints(overview, questions);
    replaceSimilarPoint(overview, questions);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(apply);
  }

  function initialize() {
    installApiGuard();
    schedule();
    const overview = document.getElementById(OVERVIEW_ID);
    if (overview) new MutationObserver(schedule).observe(overview, { childList: true, subtree: true });
  }

  window.__TBFeedbackGrounding = { literalKeyPoint: literalKeyPoint };
  installApiGuard();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
