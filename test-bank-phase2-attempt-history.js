(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const STORE_KEY = 'tb-attempt-history-v3';
  const LABELS = {
    'concept-gap': 'did not know the concept',
    'similar-concepts': 'confused similar concepts',
    'formula-selection': 'selected the wrong formula',
    calculation: 'made a calculation error',
    misread: 'misread the question or qualifier',
    'changed-answer': 'changed a correct answer',
    guess: 'guessed',
    time: 'ran out of time'
  };

  let session = null;
  let lastMode = 'idle';
  let scheduled = false;

  function hash(value) {
    let output = 2166136261;
    String(value || '').split('').forEach(function (character) {
      output ^= character.charCodeAt(0);
      output = Math.imul(output, 16777619);
    });
    return (output >>> 0).toString(36);
  }

  /* summary() is reached from a MutationObserver. Replacing matching content
     still emits a child-list mutation, so keep its display writes stable. */
  function setTextIfChanged(node, value) {
    const next = String(value == null ? '' : value);
    if (node && node.textContent !== next) node.textContent = next;
  }

  function setHtmlIfChanged(node, value) {
    const next = String(value == null ? '' : value);
    if (node && node.innerHTML !== next) node.innerHTML = next;
  }

  function examId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function read() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
      return parsed && typeof parsed === 'object' ? parsed : { attempts: [] };
    } catch (error) {
      return { attempts: [] };
    }
  }

  function write(store) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (error) {}
  }

  function newSession() {
    const now = Date.now();
    session = {
      id: examId() + '-' + now.toString(36) + '-' + Math.random().toString(36).slice(2, 8),
      examId: examId(),
      startedAt: now,
      completedAt: null,
      errors: {}
    };
    const store = read();
    store.attempts = store.attempts || [];
    store.attempts.push(session);
    if (store.attempts.length > 50) store.attempts = store.attempts.slice(-50);
    write(store);
  }

  function saveSession() {
    if (!session) return;
    const store = read();
    store.attempts = store.attempts || [];
    const index = store.attempts.findIndex(function (attempt) { return attempt.id === session.id; });
    if (index >= 0) store.attempts[index] = session;
    else store.attempts.push(session);
    write(store);
  }

  function mode() {
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return 'idle';
    if (overview.querySelector('.tb-quiz') && !overview.querySelector('#' + FEEDBACK_ID + ' .tb-quiz')) return 'quiz';
    if (overview.querySelector('#' + FEEDBACK_ID)) return 'feedback';
    return 'idle';
  }

  function transition() {
    const nextMode = mode();
    if (nextMode === 'quiz' && lastMode !== 'quiz') newSession();
    if (nextMode === 'feedback' && session && !session.completedAt) {
      session.completedAt = Date.now();
      saveSession();
    }
    lastMode = nextMode;
  }

  function stemFor(select) {
    const card = select.closest('.tb-review-card');
    const stem = card && card.querySelector('.tb-review-stem');
    return stem ? stem.textContent.trim() : '';
  }

  function questionKeysFor(select) {
    const card = select.closest('.tb-review-card');
    const stem = stemFor(select);
    const registry = window.__TBQuestionRegistry;
    let id = card && card.dataset.questionId;
    if (!id && registry && typeof registry.questionsFor === 'function' && typeof registry.idFor === 'function') {
      const question = registry.questionsFor(examId()).find(function (item) { return item.stem === stem; });
      if (question) id = registry.idFor(examId(), question);
    }
    return { id: id || hash(stem), legacy: hash(stem) };
  }

  function summary() {
    const host = document.getElementById('tb-error-summary');
    if (!host || !session) return;
    const values = Object.values(session.errors || {}).filter(Boolean);
    if (!values.length) {
      setTextIfChanged(host, 'Classify missed questions to separate knowledge, calculation, reading, and time-management causes for this attempt.');
      return;
    }
    const counts = {};
    values.forEach(function (value) { counts[value] = (counts[value] || 0) + 1; });
    setHtmlIfChanged(host, '<strong>' + values.length + ' mistake' + (values.length === 1 ? '' : 's') + ' classified for this attempt:</strong> ' + Object.keys(counts).map(function (key) {
      return (LABELS[key] || key) + ' (' + counts[key] + ')';
    }).join(' · '));
  }

  function sync() {
    transition();
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback || !session) return;
    if (feedback.dataset.attemptId !== String(session.id)) feedback.dataset.attemptId = session.id;
    feedback.querySelectorAll('[data-error-class]').forEach(function (select) {
      const keys = questionKeysFor(select);
      if (!keys.id) return;
      const value = session.errors[keys.id] || session.errors[keys.legacy] || '';
      if (select.value !== value) select.value = value;
    });
    summary();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      sync();
    });
  }

  function initialize() {
    document.addEventListener('change', function (event) {
      const select = event.target.closest('[data-error-class]');
      if (!select) return;
      if (!session) newSession();
      const keys = questionKeysFor(select);
      if (!keys.id) return;
      if (select.value) session.errors[keys.id] = select.value;
      else delete session.errors[keys.id];
      if (keys.legacy !== keys.id) delete session.errors[keys.legacy];
      saveSession();
      summary();
    }, true);

    const overview = document.getElementById(OVERVIEW_ID);
    if (overview) new MutationObserver(schedule).observe(overview, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    schedule();
  }

  window.__TBAttemptHistory = {
    current: function () { return session ? JSON.parse(JSON.stringify(session)) : null; },
    store: read
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
