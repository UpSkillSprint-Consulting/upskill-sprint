(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const STORAGE_KEY = 'tb-retake-configuration-v1';
  const VERSION = 1;
  let pendingRecipe = null;
  let activeRecipe = readRecipe();

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); } catch (error) { return value; }
  }

  function emit(name, detail) {
    try { document.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch (error) {}
  }

  function overview() { return document.getElementById(OVERVIEW_ID); }

  function activeExamId() {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    return active ? active.dataset.exam : '';
  }

  function activeSetValue() {
    const host = overview();
    const active = host && host.querySelector('.tb-setpick [data-set].on');
    return active ? active.dataset.set : '1';
  }

  function modeCard(kind) {
    const host = overview();
    const start = host && host.querySelector('[data-mode="' + kind + '"]');
    return start ? start.closest('.tb-mode') : null;
  }

  function pressed(control) {
    return Boolean(control && (control.classList.contains('on') || control.getAttribute('aria-pressed') === 'true'));
  }

  function clearTransientBlock() {
    const host = overview();
    if (!host) return;
    host.querySelectorAll('[data-retake-count-block]').forEach(function (node) { node.remove(); });
  }

  function showTransientBlock(message, kind) {
    Promise.resolve().then(function () {
      const host = overview();
      if (!host) return;
      clearTransientBlock();
      let error = host.querySelector('.tb-newonly-error:not([data-retake-error])');
      if (!error) {
        error = document.createElement('p');
        error.className = 'tb-newonly-error';
        const card = modeCard(kind);
        (card || host).appendChild(error);
      }
      error.dataset.retakeCountBlock = 'true';
      error.setAttribute('role', 'alert');
      error.textContent = message;
    });
  }

  function normalizeRecipe(value) {
    if (!value || typeof value !== 'object' || Number(value.version) !== VERSION) return null;
    const kind = value.kind === 'quick' || value.kind === 'focus' ? value.kind : '';
    const count = Math.round(Number(value.questionCount || value.requestedCount || value.actualCount || 0));
    const examId = String(value.examId || '').trim();
    const filter = value.filter === 'new-only' || value.filter === 'missed-only' ? value.filter : null;
    if (!kind || !examId || count < 1 || (value.newOnly && value.missedOnly)) return null;
    return {
      version: VERSION,
      examId: examId,
      setId: String(value.setId || '1'),
      kind: kind,
      questionCount: count,
      timed: value.timed === true,
      focusDomain: kind === 'focus' ? String(value.focusDomain || '') : null,
      focusLabel: kind === 'focus' ? String(value.focusLabel || '') : null,
      newOnly: filter ? filter === 'new-only' : value.newOnly === true,
      missedOnly: filter ? filter === 'missed-only' : value.missedOnly === true,
      filter: filter || (value.newOnly ? 'new-only' : value.missedOnly ? 'missed-only' : null),
      sessionId: value.sessionId ? String(value.sessionId) : null,
      retakeOfSessionId: value.retakeOfSessionId ? String(value.retakeOfSessionId) : null,
      capturedAt: Number(value.capturedAt || Date.now())
    };
  }

  function readRecipe() {
    try { return normalizeRecipe(JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')); } catch (error) { return null; }
  }

  function saveRecipe(value) {
    activeRecipe = normalizeRecipe(value);
    if (!activeRecipe) return null;
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(activeRecipe)); } catch (error) {}
    return activeRecipe;
  }

  function currentRecipe() {
    activeRecipe = normalizeRecipe(activeRecipe) || readRecipe();
    return activeRecipe;
  }

  function captureRecipe(kind) {
    const card = modeCard(kind);
    if (!card || (kind !== 'quick' && kind !== 'focus')) return null;
    const count = card.querySelector('[data-count="' + kind + '"][aria-pressed="true"], [data-count="' + kind + '"].on');
    const timing = card.querySelector('[data-timing-kind="' + kind + '"][aria-pressed="true"], [data-timing-kind="' + kind + '"].on');
    const focus = kind === 'focus' ? card.querySelector('[data-focusdom]') : null;
    const focusOption = focus && focus.options ? focus.options[focus.selectedIndex] : null;
    const newOnly = pressed(card.querySelector('[data-unseen="' + kind + '"]'));
    const missedOnly = pressed(card.querySelector('[data-missed="' + kind + '"]'));
    return normalizeRecipe({
      version: VERSION,
      examId: activeExamId(),
      setId: activeSetValue(),
      kind: kind,
      questionCount: count ? Number(count.dataset.n) : 0,
      timed: Boolean(timing && timing.dataset.timed === '1'),
      focusDomain: focus ? focus.value : null,
      focusLabel: focusOption ? focusOption.textContent.trim() : null,
      newOnly: newOnly,
      missedOnly: missedOnly,
      capturedAt: Date.now()
    });
  }

  function hookLearningStart() {
    const learning = window.__TBLearning;
    if (!learning || typeof learning.startSession !== 'function') return false;
    if (learning.startSession.__tbRetakeWrapped) return true;
    const original = learning.startSession;
    function wrapped(input) {
      const details = input && typeof input === 'object' ? input : {};
      const kind = details.mode === 'quick' || details.mode === 'focus' ? details.mode : '';
      let recipe = pendingRecipe;
      if (kind && (!recipe || recipe.kind !== kind || recipe.examId !== String(details.examId || ''))) recipe = captureRecipe(kind);
      if (!kind) pendingRecipe = null;
      const delivered = Array.isArray(details.questions) ? details.questions.length : null;
      if (kind && recipe && recipe.retakeOfSessionId && delivered != null && delivered !== recipe.questionCount) {
        const label = kind === 'focus' ? 'Focused Quiz' : 'Quick Quiz';
        const pool = recipe.newOnly ? 'new' : recipe.missedOnly ? 'previously missed' : 'eligible';
        const message = 'This retake needs ' + recipe.questionCount + ' questions, but only ' + delivered + ' ' + pool +
          ' question' + (delivered === 1 ? ' is' : 's are') + ' available. No shorter or unfiltered ' + label +
          ' was started. Adjust the setup to an available count.';
        pendingRecipe = null;
        showTransientBlock(message, kind);
        emit('tb:retake-start-blocked', {
          block: { reason: 'count-shortfall', requested: recipe.questionCount, available: delivered, message: message },
          recipe: clone(recipe)
        });
        return details.returnResult ? {
          sessionId: null,
          saved: false,
          retakeBlocked: true,
          reason: 'count-shortfall',
          requested: recipe.questionCount,
          available: delivered
        } : null;
      }
      clearTransientBlock();
      const result = original.apply(this, arguments);
      const sessionId = typeof result === 'string' ? result : result && result.sessionId;
      const saved = typeof result === 'string' || Boolean(result && result.saved !== false);
      if (kind && recipe && sessionId && saved) {
        const delivered = Array.isArray(details.questions) && details.questions.length ? details.questions.length : recipe.questionCount;
        const filter = details.filter === 'new-only' || details.filter === 'missed-only' ? details.filter : null;
        const committed = saveRecipe(Object.assign({}, recipe, {
          examId: String(details.examId || recipe.examId),
          kind: kind,
          questionCount: delivered,
          timed: Boolean(details.timed),
          newOnly: filter === 'new-only',
          missedOnly: filter === 'missed-only',
          filter: filter,
          sessionId: String(sessionId),
          capturedAt: Date.now()
        }));
        pendingRecipe = null;
        emit('tb:retake-recipe-saved', { recipe: clone(committed) });
      }
      return result;
    }
    wrapped.__tbRetakeWrapped = true;
    wrapped.__tbRetakeOriginal = original;
    learning.startSession = wrapped;
    return true;
  }

  window.__TBRetakeState = {
    version: VERSION,
    clone: clone,
    emit: emit,
    overview: overview,
    activeExamId: activeExamId,
    activeSetValue: activeSetValue,
    modeCard: modeCard,
    pressed: pressed,
    normalizeRecipe: normalizeRecipe,
    saveRecipe: saveRecipe,
    currentRecipe: currentRecipe,
    captureRecipe: captureRecipe,
    hookLearningStart: hookLearningStart,
    getPending: function () { return pendingRecipe; },
    setPending: function (value) { pendingRecipe = normalizeRecipe(value); return pendingRecipe; },
    clearPending: function () { pendingRecipe = null; }
  };

  document.addEventListener('tb:retake-error', clearTransientBlock);
  document.addEventListener('tb:retake-started', clearTransientBlock);
}());
