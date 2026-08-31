(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const LEGACY_STORE = 'tb-attempt-feedback-v2';
  let mode = 'idle';
  let stem = '';
  let startedAt = 0;
  let times = Object.create(null);
  let scheduled = false;

  function currentExamId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : 'cssbb';
  }

  function legacyHash(value) {
    let hash = 2166136261;
    const text = String(value || '');
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function questionIdForStem(value, suppliedId) {
    if (suppliedId) return suppliedId;
    const registry = window.__TBQuestionRegistry;
    if (registry && typeof registry.questionsFor === 'function' && typeof registry.idFor === 'function') {
      const question = registry.questionsFor(currentExamId()).find(function (item) { return item.stem === value; });
      if (question) return registry.idFor(currentExamId(), question);
    }
    return legacyHash(value);
  }

  function currentMode() {
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return 'idle';
    const feedback = overview.querySelector('#' + FEEDBACK_ID);
    const quiz = overview.querySelector('.tb-quiz');
    if (quiz && !quiz.closest('#' + FEEDBACK_ID)) return 'quiz';
    if (feedback) return 'feedback';
    return 'idle';
  }

  function currentStem() {
    const overview = document.getElementById(OVERVIEW_ID);
    const quiz = overview && overview.querySelector('.tb-quiz');
    if (!quiz || quiz.closest('#' + FEEDBACK_ID)) return '';
    const node = quiz.querySelector('.tb-stem');
    return node ? questionIdForStem(node.textContent.trim(), quiz.dataset.questionId || node.dataset.questionId) : '';
  }

  function commit() {
    if (!stem || !startedAt || document.hidden) return;
    const elapsed = Date.now() - startedAt;
    if (elapsed >= 250) times[stem] = (times[stem] || 0) + elapsed;
    startedAt = Date.now();
  }

  function format(ms) {
    if (!ms || ms < 1000) return 'Not reliably tracked';
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return seconds + ' sec';
    return Math.floor(seconds / 60) + ' min' + (seconds % 60 ? ' ' + (seconds % 60) + ' sec' : '');
  }

  function resetLegacyErrors() {
    try {
      const data = JSON.parse(localStorage.getItem(LEGACY_STORE));
      if (!data || !data.attempts) return;
      Object.keys(data.attempts).forEach(function (key) {
        if (data.attempts[key]) {
          data.attempts[key].errors = {};
          data.attempts[key].updatedAt = Date.now();
        }
      });
      localStorage.setItem(LEGACY_STORE, JSON.stringify(data));
    } catch (error) {}
  }

  function mirrorError(select) {
    try {
      const data = JSON.parse(localStorage.getItem(LEGACY_STORE));
      if (!data || !data.attempts) return;
      const keys = Object.keys(data.attempts);
      if (!keys.length) return;
      const latest = keys.sort(function (a, b) {
        return Number(data.attempts[a].startedAt || 0) - Number(data.attempts[b].startedAt || 0);
      }).pop();
      const card = select.closest('.tb-review-card');
      const stemNode = card && card.querySelector('.tb-review-stem');
      if (!stemNode || !data.attempts[latest]) return;
      const value = stemNode.textContent.trim();
      const key = questionIdForStem(value, card.dataset.questionId);
      const legacy = legacyHash(value);
      data.attempts[latest].errors = data.attempts[latest].errors || {};
      if (select.value) data.attempts[latest].errors[key] = select.value;
      else delete data.attempts[latest].errors[key];
      if (legacy !== key) delete data.attempts[latest].errors[legacy];
      data.attempts[latest].updatedAt = Date.now();
      localStorage.setItem(LEGACY_STORE, JSON.stringify(data));
    } catch (error) {}
  }

  function renderTimes() {
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback) return;
    feedback.querySelectorAll('.tb-review-card').forEach(function (card) {
      const stemNode = card.querySelector('.tb-review-stem');
      const timeNode = card.querySelector('.tb-deep-summary strong');
      if (stemNode && timeNode) {
        const next = format(times[questionIdForStem(stemNode.textContent.trim(), card.dataset.questionId)] || 0);
        if (timeNode.textContent !== next) timeNode.textContent = next;
      }
    });
    const values = Object.values(times).filter(function (value) { return value >= 1000; });
    const averageNode = feedback.querySelector('.tb-phase2-time strong');
    if (averageNode) {
      const next = values.length ? format(values.reduce(function (a, b) { return a + b; }, 0) / values.length) : 'Not reliably tracked';
      if (averageNode.textContent !== next) averageNode.textContent = next;
    }
  }

  function transition() {
    const nextMode = currentMode();
    if (nextMode === 'quiz' && mode !== 'quiz') {
      times = Object.create(null);
      stem = '';
      startedAt = 0;
      resetLegacyErrors();
    }

    const nextStem = nextMode === 'quiz' ? currentStem() : '';
    if (nextStem !== stem) {
      commit();
      stem = nextStem;
      startedAt = nextStem ? Date.now() : 0;
    }

    if (mode === 'quiz' && nextMode === 'feedback') commit();
    mode = nextMode;
    if (nextMode === 'feedback') renderTimes();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      transition();
    });
  }

  function initialize() {
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) commit();
      else if (stem) startedAt = Date.now();
    });
    document.addEventListener('change', function (event) {
      const select = event.target.closest('[data-error-class]');
      if (select) mirrorError(select);
    }, true);
    const overview = document.getElementById(OVERVIEW_ID);
    if (overview) new MutationObserver(schedule).observe(overview, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    schedule();
  }

  window.__TBPhase2Runtime = {
    getTimes: function () { return Object.assign({}, times); },
    format: format
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
