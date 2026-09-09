(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const FEEDBACK_ID = 'tb-feedback-loop';
  const LEGACY_STORE = 'tb-attempt-feedback-v2';
  let mode = 'idle';
  let sessionId = '';
  let stem = '';
  let startedAt = 0;
  let times = Object.create(null);
  let scheduled = false;

  function timing() { return window.__TBSessionTiming || null; }
  function clockNow() {
    const api = timing();
    if (api && typeof api.monotonicNow === 'function') return api.monotonicNow();
    return window.performance && typeof window.performance.now === 'function' ? window.performance.now() : Date.now();
  }
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
    if (!stem || !startedAt) return;
    const end = clockNow();
    const elapsed = Math.max(0, end - startedAt);
    times[stem] = Number(times[stem] || 0) + elapsed;
    startedAt = document.hidden ? 0 : end;
  }
  function format(ms, known) {
    if (!known || ms == null || !Number.isFinite(Number(ms))) return 'Not reliably tracked';
    const seconds = Math.max(0, Math.round(Number(ms) / 1000));
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
      const latest = keys.sort(function (a, b) { return Number(data.attempts[a].startedAt || 0) - Number(data.attempts[b].startedAt || 0); }).pop();
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
  function displayTimes() {
    const api = timing();
    return api && typeof api.questionTimes === 'function' ? api.questionTimes() : Object.assign({}, times);
  }
  function isKnown(id) {
    const api = timing();
    return api && typeof api.hasQuestionTime === 'function' ? api.hasQuestionTime(id) : Object.prototype.hasOwnProperty.call(times,id);
  }
  function renderTimes() {
    const feedback = document.getElementById(FEEDBACK_ID);
    if (!feedback) return;
    const current = displayTimes();
    feedback.querySelectorAll('.tb-review-card').forEach(function (card) {
      const stemNode = card.querySelector('.tb-review-stem');
      const timeNode = card.querySelector('.tb-deep-summary strong');
      if (stemNode && timeNode) {
        const id = questionIdForStem(stemNode.textContent.trim(), card.dataset.questionId);
        const next = format(current[id], isKnown(id));
        if (timeNode.textContent !== next) timeNode.textContent = next;
      }
    });
    const averageNode = feedback.querySelector('.tb-phase2-time strong');
    if (averageNode) {
      const api = timing();
      const canonical = api && typeof api.summary === 'function' ? api.summary() : null;
      const values = Object.keys(current).map(function (key) { return Number(current[key]); }).filter(Number.isFinite);
      const average = canonical ? canonical.averageActiveMs : (values.length ? values.reduce(function (a,b){return a+b;},0)/values.length : null);
      const next = format(average, average != null);
      if (averageNode.textContent !== next) averageNode.textContent = next;
      if (canonical) averageNode.setAttribute('data-measured-items', String(canonical.measuredItems));
    }
  }
  function transition() {
    const nextMode = currentMode();
    if (nextMode === 'quiz' && mode !== 'quiz') {
      times = Object.create(null); stem = ''; startedAt = 0; resetLegacyErrors();
    }
    const nextStem = nextMode === 'quiz' ? currentStem() : '';
    if (nextStem !== stem) {
      commit(); stem = nextStem; startedAt = nextStem && !document.hidden ? clockNow() : 0;
    }
    if (mode === 'quiz' && nextMode === 'feedback') commit();
    mode = nextMode;
    if (nextMode === 'feedback') renderTimes();
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () { scheduled = false; transition(); });
  }
  function initialize() {
    document.addEventListener('tb:learning-session-started', function (event) {
      const nextSessionId = event && event.detail && String(event.detail.sessionId || '');
      if (!nextSessionId || nextSessionId === sessionId) return;
      sessionId = nextSessionId; times = Object.create(null); stem = ''; startedAt = 0; resetLegacyErrors(); schedule();
    });
    document.addEventListener('tb:timing-updated', renderTimes);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { commit(); startedAt = 0; }
      else if (stem) startedAt = clockNow();
    });
    document.addEventListener('change', function (event) { const select = event.target.closest('[data-error-class]'); if (select) mirrorError(select); }, true);
    const overview = document.getElementById(OVERVIEW_ID);
    if (overview) new MutationObserver(schedule).observe(overview, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    schedule();
  }
  window.__TBPhase2Runtime = {
    getTimes: displayTimes,
    format: function (ms) { return format(ms, ms != null); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
