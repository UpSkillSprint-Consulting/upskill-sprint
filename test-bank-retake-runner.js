(function () {
  'use strict';

  const state = window.__TBRetakeState;
  if (!state || window.__TBRetakeConfiguration) return;
  const WAIT_MS = 4000;
  let retakeBusy = false;
  let listenerInstalled = false;

  function nextFrame() {
    return new Promise(function (resolve) {
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(resolve);
      else setTimeout(resolve, 0);
    });
  }

  async function waitFor(getter, message, timeout) {
    const started = Date.now();
    const limit = timeout == null ? WAIT_MS : timeout;
    while (Date.now() - started < limit) {
      let value = null;
      try { value = getter(); } catch (error) {}
      if (value) return value;
      await nextFrame();
    }
    throw new Error(message);
  }

  function setupReady() {
    const host = state.overview();
    return host && host.querySelector('[data-mode="quick"]') ? host : null;
  }

  async function clickAndWait(target, getter, message) {
    if (!target) throw new Error(message);
    target.click();
    return waitFor(getter, message);
  }

  async function restoreExam(recipe) {
    const active = document.querySelector('.tb-tile.active[data-exam]');
    if (active && active.dataset.exam === recipe.examId) return;
    await clickAndWait(
      document.querySelector('.tb-tile[data-exam="' + recipe.examId + '"]'),
      function () {
        const selected = document.querySelector('.tb-tile.active[data-exam]');
        return selected && selected.dataset.exam === recipe.examId;
      },
      'The certification used by this quiz is unavailable. No replacement quiz was started.'
    );
  }

  async function restoreSet(recipe) {
    const host = await waitFor(setupReady, 'The quiz setup screen is unavailable. No replacement quiz was started.');
    const picker = host.querySelector('.tb-setpick');
    if (!picker) {
      if (recipe.setId === '1') return;
      throw new Error('The saved question set is unavailable. No replacement quiz was started.');
    }
    const selector = '[data-set="' + recipe.setId + '"]';
    const target = picker.querySelector(selector);
    if (!target) throw new Error('The saved question set is unavailable. No replacement quiz was started.');
    if (target.classList.contains('on')) return;
    await clickAndWait(target, function () {
      const replacement = state.overview().querySelector('.tb-setpick ' + selector);
      return replacement && replacement.classList.contains('on');
    }, 'The saved question set could not be restored. No replacement quiz was started.');
  }

  async function restoreFocus(recipe) {
    if (recipe.kind !== 'focus') return;
    const select = await waitFor(function () { return state.overview().querySelector('[data-focusdom]'); }, 'The Focused Quiz area control is unavailable. No replacement quiz was started.');
    if (!Array.from(select.options).some(function (option) { return option.value === recipe.focusDomain; })) {
      throw new Error('The saved Body of Knowledge area is unavailable. No replacement quiz was started.');
    }
    if (select.value === recipe.focusDomain) return;
    select.value = recipe.focusDomain;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await waitFor(function () {
      const replacement = state.overview().querySelector('[data-focusdom]');
      return replacement && replacement.value === recipe.focusDomain;
    }, 'The saved Body of Knowledge area could not be restored. No replacement quiz was started.');
  }

  async function restoreTiming(recipe) {
    const selector = '[data-timing-kind="' + recipe.kind + '"][data-timed="' + (recipe.timed ? '1' : '0') + '"]';
    const target = state.overview().querySelector(selector);
    if (!target) throw new Error('The saved timing option is unavailable. No replacement quiz was started.');
    if (state.pressed(target)) return;
    await clickAndWait(target, function () { return state.pressed(state.overview().querySelector(selector)); }, 'The saved timing option could not be restored. No replacement quiz was started.');
  }

  function filterMessage(recipe) {
    if (recipe.newOnly) return 'New questions only is not available for this account. No unfiltered quiz was started.';
    if (recipe.missedOnly) return 'No missed questions remain for this configuration. No unfiltered quiz was started.';
    return 'The saved quiz configuration cannot currently be started. No replacement quiz was substituted.';
  }

  async function restoreToggle(recipe, filter, desired) {
    const attribute = filter === 'new-only' ? 'data-unseen' : 'data-missed';
    const selector = '[' + attribute + '="' + recipe.kind + '"]';
    let target = state.overview().querySelector(selector);
    if (!target) throw new Error('A saved quiz filter is unavailable. No replacement quiz was started.');
    if (state.pressed(target) === desired) return;
    if (target.disabled) {
      try {
        target = await waitFor(function () {
          const replacement = state.overview().querySelector(selector);
          return replacement && !replacement.disabled ? replacement : null;
        }, filterMessage(recipe), 1200);
      } catch (error) {
        throw new Error(filterMessage(recipe));
      }
    }
    target.click();
    await waitFor(function () { return state.pressed(state.overview().querySelector(selector)) === desired; }, filterMessage(recipe));
  }

  function markCustomCount(kind, count) {
    const card = state.modeCard(kind);
    const seed = card && card.querySelector('[data-count="' + kind + '"]');
    const group = seed && seed.closest('.tb-counts');
    if (!group) return null;
    group.querySelectorAll('[data-count="' + kind + '"]').forEach(function (button) {
      button.classList.remove('on');
      button.setAttribute('aria-pressed', 'false');
    });
    const custom = document.createElement('button');
    custom.type = 'button';
    custom.className = 'tb-count on';
    custom.dataset.count = kind;
    custom.dataset.n = String(count);
    custom.dataset.retakeCustomCount = 'true';
    custom.setAttribute('aria-pressed', 'true');
    custom.title = 'Question count preserved from the completed quiz.';
    custom.textContent = String(count);
    group.appendChild(custom);
    return custom;
  }

  async function restoreCount(recipe) {
    const selector = '[data-count="' + recipe.kind + '"][data-n="' + recipe.questionCount + '"]';
    const exact = state.overview().querySelector(selector);
    if (exact) {
      if (state.pressed(exact)) return;
      await clickAndWait(exact, function () { return state.pressed(state.overview().querySelector(selector)); }, 'The saved question count could not be restored. No replacement quiz was started.');
      return;
    }
    const card = state.modeCard(recipe.kind);
    const seed = card && card.querySelector('[data-count="' + recipe.kind + '"]');
    if (!seed) throw new Error('The saved question count is unavailable. No replacement quiz was started.');
    /* Core listeners read data-n at click time. Reuse one wired button to set an
       exact completed count that is not one of the standard 10/20/30/50 choices. */
    seed.dataset.n = String(recipe.questionCount);
    seed.click();
    await waitFor(setupReady, 'The saved question count could not be restored. No replacement quiz was started.');
    if (!state.pressed(markCustomCount(recipe.kind, recipe.questionCount))) {
      throw new Error('The saved question count could not be restored. No replacement quiz was started.');
    }
  }

  async function restoreRecipe(recipe) {
    await restoreExam(recipe);
    await waitFor(setupReady, 'The quiz setup screen is unavailable. No replacement quiz was started.');
    await restoreSet(recipe);
    await restoreFocus(recipe);
    await restoreTiming(recipe);
    await restoreToggle(recipe, 'new-only', recipe.newOnly);
    await restoreToggle(recipe, 'missed-only', recipe.missedOnly);
    /* Count is last because each earlier control re-renders the cards. */
    await restoreCount(recipe);
    const restored = state.captureRecipe(recipe.kind);
    if (!restored || restored.examId !== recipe.examId || restored.setId !== recipe.setId ||
        restored.questionCount !== recipe.questionCount || restored.timed !== recipe.timed ||
        restored.focusDomain !== recipe.focusDomain || restored.filter !== recipe.filter) {
      throw new Error('The completed quiz settings could not be verified. No replacement quiz was started.');
    }
    return restored;
  }

  function examFor(recipe) {
    return window.__TB && window.__TB.EXAMS && window.__TB.EXAMS[recipe.examId];
  }

  function combinedBank(exam) {
    if (!exam || !exam.sets || !exam.sets[1]) return exam && Array.isArray(exam.bank) ? exam.bank.slice() : [];
    const output = [];
    ['1', '2', '3'].forEach(function (setId) {
      if (Array.isArray(exam.sets[setId])) output.push.apply(output, exam.sets[setId]);
    });
    return output;
  }

  function questionDomain(exam, question) {
    const domain = exam.bok.find(function (item) {
      return item.subs.some(function (subtopic) { return subtopic.id === question.sub; });
    });
    return domain && domain.domain;
  }

  function eligibleCount(recipe) {
    const exam = examFor(recipe);
    if (!exam) return null;
    let questions;
    if (recipe.newOnly) {
      const learning = window.__TBLearning;
      const status = learning && typeof learning.status === 'function' ? learning.status() : null;
      /* The reservation RPC stays authoritative while account history hydrates. */
      if (!learning || typeof learning.hasSeen !== 'function' || !status || !status.historyReady) return null;
      questions = combinedBank(exam).filter(function (question) { return !learning.hasSeen(recipe.examId, question); });
    } else if (recipe.missedOnly) {
      const mastery = window.__TBAdaptiveMastery;
      if (!mastery || typeof mastery.missedFilter !== 'function') return null;
      questions = mastery.missedFilter(combinedBank(exam).slice());
      if (!Array.isArray(questions)) return null;
    } else if (!exam.sets || !exam.sets[1]) {
      questions = Array.isArray(exam.bank) ? exam.bank.slice() : [];
    } else {
      questions = recipe.setId === 'mix' ? combinedBank(exam) : (exam.sets[recipe.setId] || []).slice();
    }
    if (recipe.kind === 'focus') {
      questions = questions.filter(function (question) { return questionDomain(exam, question) === recipe.focusDomain; });
    }
    return questions.length;
  }

  function clearErrors() {
    const host = state.overview();
    if (host) host.querySelectorAll('[data-retake-error]').forEach(function (node) { node.remove(); });
  }

  function showError(message, kind) {
    const host = state.overview();
    if (!host) return;
    clearErrors();
    const error = document.createElement('p');
    error.className = 'tb-newonly-error tb-retake-error';
    error.dataset.retakeError = 'true';
    error.setAttribute('role', 'alert');
    error.tabIndex = -1;
    error.textContent = message;
    const card = kind ? state.modeCard(kind) : null;
    const actions = host.querySelector('.tb-planacts');
    (card || actions || host).appendChild(error);
    try { error.focus(); } catch (focusError) {}
  }

  function shortfallMessage(recipe, available) {
    const label = recipe.kind === 'focus' ? 'Focused Quiz' : 'Quick Quiz';
    const pool = recipe.newOnly ? 'new' : recipe.missedOnly ? 'previously missed' : 'eligible';
    return 'This retake needs ' + recipe.questionCount + ' questions, but only ' + available + ' ' + pool +
      ' question' + (available === 1 ? ' is' : 's are') + ' available. No shorter or unfiltered ' + label +
      ' was started. Adjust the setup to an available count.';
  }

  function resultKind(button) {
    const label = String(button && button.textContent || '');
    return /Focused Quiz/i.test(label) ? 'focus' : /Quick Quiz/i.test(label) ? 'quick' : '';
  }

  function recipeSummary(recipe) {
    const parts = [recipe.setId === 'mix' ? 'Mixed' : 'Set ' + recipe.setId];
    if (recipe.kind === 'focus' && recipe.focusLabel) parts.push(recipe.focusLabel);
    parts.push(recipe.questionCount + ' questions', recipe.timed ? 'Timed' : 'Untimed');
    if (recipe.newOnly) parts.push('New questions only');
    if (recipe.missedOnly) parts.push('Missed questions only');
    return parts.join(' · ');
  }

  function decorateRetake() {
    const host = state.overview();
    const button = host && host.querySelector('[data-retake]');
    if (!button) return;
    const recipe = state.currentRecipe();
    const valid = Boolean(recipe && recipe.kind === resultKind(button) && recipe.examId === state.activeExamId());
    button.dataset.retakeConfigured = String(valid);
    button.title = valid
      ? 'Start a fresh attempt with the same settings: ' + recipeSummary(recipe) + '.'
      : 'The original quiz settings are unavailable; no generic retake will be substituted.';
  }

  async function runRetake(recipe, button) {
    if (retakeBusy) return false;
    retakeBusy = true;
    const originalText = button.textContent;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Preparing retake…';
    clearErrors();
    try {
      state.hookLearningStart();
      const back = state.overview().querySelector('[data-back]');
      if (!back) throw new Error('The completed result is no longer active. No replacement quiz was started.');
      back.click();
      await waitFor(setupReady, 'The quiz setup screen is unavailable. No replacement quiz was started.');
      const restored = await restoreRecipe(recipe);
      const available = eligibleCount(restored);
      if (available != null && available < restored.questionCount) throw new Error(shortfallMessage(restored, available));
      const start = state.overview().querySelector('[data-mode="' + recipe.kind + '"]');
      if (!start || start.disabled) throw new Error(filterMessage(recipe));
      state.setPending(Object.assign({}, restored, { retakeOfSessionId: recipe.sessionId || null }));
      start.click();
      const outcome = await waitFor(function () {
        const quiz = state.overview().querySelector('.tb-quiz');
        if (quiz) return { quiz: quiz };
        const coreError = state.overview().querySelector('.tb-newonly-error:not([data-retake-error])');
        return coreError && coreError.textContent.trim() ? { error: coreError.textContent.trim() } : null;
      }, 'The replacement quiz did not start in time. No different quiz was substituted.', 15000);
      if (outcome.error) throw new Error(outcome.error + ' No different quiz was substituted.');
      const started = state.currentRecipe();
      state.emit('tb:retake-started', {
        previousSessionId: recipe.sessionId || null,
        sessionId: started && started.sessionId || null,
        recipe: state.clone(started || restored)
      });
      return true;
    } catch (error) {
      state.clearPending();
      const message = String(error && error.message || error || 'The retake could not be started.');
      showError(message, recipe.kind);
      state.emit('tb:retake-error', { error: message, recipe: state.clone(recipe) });
      return false;
    } finally {
      retakeBusy = false;
      if (button.isConnected) {
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = originalText;
      }
    }
  }

  function handleClick(event) {
    const target = event.target && event.target.closest ? event.target : null;
    if (!target) return;
    const retake = target.closest('[data-retake]');
    if (retake && resultKind(retake)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const recipe = state.currentRecipe();
      if (!recipe || recipe.kind !== resultKind(retake) || recipe.examId !== state.activeExamId()) {
        showError('The completed quiz settings are unavailable, so no generic replacement was started.', null);
      } else {
        void runRetake(recipe, retake);
      }
      return;
    }
    const start = target.closest('[data-mode="quick"], [data-mode="focus"]');
    if (!start || start.disabled) return;
    state.hookLearningStart();
    const captured = state.captureRecipe(start.dataset.mode);
    if (!captured) return;
    const pending = state.getPending();
    const previous = retakeBusy && pending && pending.retakeOfSessionId;
    state.setPending(previous ? Object.assign({}, captured, { retakeOfSessionId: previous }) : captured);
  }

  function scheduleDecorate() {
    if (scheduleDecorate.pending) return;
    scheduleDecorate.pending = true;
    nextFrame().then(function () {
      scheduleDecorate.pending = false;
      decorateRetake();
    });
  }

  function initialize() {
    state.hookLearningStart();
    scheduleDecorate();
    const host = state.overview();
    if (!host) return;
    if (!listenerInstalled) {
      listenerInstalled = true;
      document.addEventListener('click', handleClick, true);
      ['tb:learning-storage-ready', 'tb:learning-sync-status', 'upskill-auth-ready'].forEach(function (name) {
        document.addEventListener(name, state.hookLearningStart);
      });
    }
    new MutationObserver(scheduleDecorate).observe(host, { childList: true });
  }

  window.__TBRetakeConfiguration = {
    version: state.version,
    capture: function (kind) {
      state.setPending(state.captureRecipe(kind));
      return state.clone(state.getPending());
    },
    current: function () { return state.clone(state.currentRecipe()); },
    retake: function () {
      const button = state.overview() && state.overview().querySelector('[data-retake]');
      const recipe = state.currentRecipe();
      return button && recipe ? runRetake(recipe, button) : Promise.resolve(false);
    },
    status: function () {
      return {
        hooked: state.hookLearningStart(),
        inProgress: retakeBusy,
        hasRecipe: Boolean(state.currentRecipe()),
        pending: Boolean(state.getPending())
      };
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
