(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  let scheduled = false;

  function stripHtml(value) {
    const holder = document.createElement('div');
    holder.innerHTML = String(value == null ? '' : value);
    return (holder.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function literalKeyPoint(explanation) {
    if (window.__TB && window.__TB.firstFeedbackSentence) return window.__TB.firstFeedbackSentence(explanation);
    const text = stripHtml(explanation);
    if (!text) return 'A stored learning point is not available for this question yet.';
    return (text.match(/[\s\S]+?(?:[.!?](?=\s|$)|$)/) || [text])[0].trim();
  }
  function questionKeyPoint(question) {
    if (window.__TB && window.__TB.feedbackKeyPoint) return window.__TB.feedbackKeyPoint(question);
    return stripHtml(question && question.keyPoint) || literalKeyPoint(question && question.why);
  }

  function installApiGuard() {
    if (window.__TBDeepFeedback) window.__TBDeepFeedback.extractKeyPoint = literalKeyPoint;
  }

  function currentExamId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function currentExam() {
    return window.__TB && window.__TB.EXAMS ? window.__TB.EXAMS[currentExamId()] : null;
  }

  function questionId(question) {
    const registry = window.__TBQuestionRegistry;
    if (registry && typeof registry.idFor === 'function') return registry.idFor(currentExamId(), question);
    return question && question.questionId || question && question.qid || question && question.id || String(question && question.stem || '');
  }

  function questionMap() {
    const map = new Map();
    const exam = currentExam();
    function add(question) {
      if (!question || !question.stem) return;
      const id = questionId(question);
      if (!map.has(id)) map.set(id, question);
      if (!map.has('legacy:' + question.stem)) map.set('legacy:' + question.stem, question);
    }
    if (exam && exam.sets) Object.keys(exam.sets).forEach(function (key) { (exam.sets[key] || []).forEach(add); });
    if (exam && exam.bank) exam.bank.forEach(add);
    return map;
  }

  function lookupQuestion(questions, identity, stem) {
    return questions.get(identity) || questions.get('legacy:' + (stem || identity || '')) || null;
  }

  function setTextIfChanged(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

  function replaceReviewPoints(root, questions) {
    root.querySelectorAll('.tb-review-card').forEach(function (card) {
      const stem = card.querySelector('.tb-review-stem');
      const point = card.querySelector('.tb-key-point');
      if (!stem || !point) return;
      const question = lookupQuestion(questions, card.dataset.questionId, stem.textContent.trim());
      if (question) setTextIfChanged(point, questionKeyPoint(question));
    });
  }

  function replaceSimilarPoint(root, questions) {
    const panel = root.querySelector('#tb-similar-practice');
    if (!panel) return;
    const stem = panel.querySelector('.tb-review-stem');
    if (!stem) return;
    const question = lookupQuestion(questions, panel.dataset.questionId, stem.textContent.trim());
    if (!question) return;

    panel.querySelectorAll('.tb-deep-label').forEach(function (label) {
      if (label.textContent.trim() !== 'Key learning point') return;
      setTextIfChanged(label.nextElementSibling, questionKeyPoint(question));
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
