(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const ENHANCED_ATTR = 'data-upskill-set-controls';
  const LEARNING_STORE_KEY = 'tb-learning-events-v2';
  const RECOVERY_KEEP_CONFIRMED_EVENTS = 200;
  const RECOVERY_KEEP_FINISHED_SESSIONS = 50;
  const SETS = [
    { value: '1', label: '1', name: 'Set 1' },
    { value: '2', label: '2', name: 'Set 2' },
    { value: '3', label: '3', name: 'Set 3' },
    { value: 'mix', label: 'Mixed', name: 'Mixed (all sets)' }
  ];

  let scheduled = false;

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function asRecord(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }

  function compactLearningStateForQuotaRecovery(state) {
    if (!state || typeof state !== 'object') return false;

    const events = asArray(state.events);
    const pending = [];
    const confirmed = [];
    events.forEach(function (event) {
      if (asArray(event && event.syncedFor).length) confirmed.push(event);
      else pending.push(event);
    });

    confirmed.sort(function (left, right) {
      return Number(left && left.occurredAt || 0) - Number(right && right.occurredAt || 0) ||
        String(left && left.id || '').localeCompare(String(right && right.id || ''));
    });

    const retainedConfirmed = confirmed.slice(-RECOVERY_KEEP_CONFIRMED_EVENTS).map(function (event) {
      if (!event || !event.payload || !event.payload.snapshot) return event;
      const compacted = Object.assign({}, event, { payload: Object.assign({}, event.payload) });
      delete compacted.payload.snapshot;
      return compacted;
    });
    state.events = retainedConfirmed.concat(pending).sort(function (left, right) {
      return Number(left && left.occurredAt || 0) - Number(right && right.occurredAt || 0) ||
        String(left && left.id || '').localeCompare(String(right && right.id || ''));
    });

    const pendingSessions = new Set(pending.map(function (event) { return String(event && event.sessionId || ''); }).filter(Boolean));
    const sessions = asRecord(state.sessions);
    const active = [];
    const finished = [];
    Object.keys(sessions).forEach(function (id) {
      const session = sessions[id];
      if (!session || session.status === 'active' || pendingSessions.has(String(id))) active.push([id, session]);
      else finished.push([id, session]);
    });
    finished.sort(function (left, right) {
      const a = Number(left[1] && (left[1].completedAt || left[1].abandonedAt || left[1].startedAt) || 0);
      const b = Number(right[1] && (right[1].completedAt || right[1].abandonedAt || right[1].startedAt) || 0);
      return a - b;
    });
    state.sessions = {};
    active.concat(finished.slice(-RECOVERY_KEEP_FINISHED_SESSIONS)).forEach(function (entry) {
      state.sessions[entry[0]] = entry[1];
    });

    /* seen/totals are the compact durable projection used by New-only and
       analytics. knownEventIds is only a dedupe cache; keeping IDs for the
       retained local events is sufficient because incremental Supabase sync
       uses its received_at cursor for older rows. */
    if (state.index && typeof state.index === 'object') {
      const known = {};
      state.events.forEach(function (event) {
        if (event && event.id) known[event.id] = Number(event.occurredAt || Date.now());
      });
      state.index.knownEventIds = known;
    }

    try {
      localStorage.setItem(LEARNING_STORE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      return false;
    }
  }

  function installLearningStorageRecovery() {
    const learning = window.__TBLearning;
    if (!learning || learning.__mobileQuotaRecoveryInstalled) return;
    if (typeof learning.store !== 'function') return;

    function retryAfterCompaction(method, input, failedResult) {
      if (!failedResult || failedResult.saved !== false) return failedResult;
      const state = learning.store();
      if (!compactLearningStateForQuotaRecovery(state)) return failedResult;
      const retryInput = Object.assign({}, input || {});
      if (failedResult.sessionId && !retryInput.sessionId) retryInput.sessionId = failedResult.sessionId;
      if (method === 'startSession') retryInput.returnResult = true;
      return originals[method](retryInput);
    }

    const originals = {
      startSession: typeof learning.startSession === 'function' ? learning.startSession.bind(learning) : null,
      recordAnswer: typeof learning.recordAnswer === 'function' ? learning.recordAnswer.bind(learning) : null,
      completeSession: typeof learning.completeSession === 'function' ? learning.completeSession.bind(learning) : null
    };

    if (originals.startSession) {
      learning.startSession = function (input) {
        return retryAfterCompaction('startSession', input, originals.startSession(input));
      };
    }
    if (originals.recordAnswer) {
      learning.recordAnswer = function (input) {
        return retryAfterCompaction('recordAnswer', input, originals.recordAnswer(input));
      };
    }
    if (originals.completeSession) {
      learning.completeSession = function (input) {
        return retryAfterCompaction('completeSession', input, originals.completeSession(input));
      };
    }

    learning.__mobileQuotaRecoveryInstalled = true;
  }

  function activeSetValue(overview) {
    const active = overview.querySelector('.tb-setpick [data-set].on');
    return active ? active.dataset.set : '1';
  }

  function availableSets(overview) {
    return SETS.filter(function (item) {
      return Boolean(overview.querySelector('.tb-setpick [data-set="' + item.value + '"]'));
    });
  }

  function selectSet(overview, value) {
    const source = overview.querySelector('.tb-setpick [data-set="' + value + '"]');
    if (source) source.click();
  }

  function normalizeCompletedSetProgress(overview) {
    Array.from(overview.querySelectorAll('.tb-setpick [data-set] .tb-sets')).forEach(function (summary) {
      const match = summary.textContent.trim().match(/^(\d+)\s+of\s+(\d+)(?:\s*·.*)?$/i);
      if (!match || match[1] !== match[2]) return;

      const text = match[1] + ' questions';
      if (summary.textContent !== text) summary.textContent = text;
    });
  }

  function createSetControls(overview, kind) {
    const current = activeSetValue(overview);

    const row = document.createElement('div');
    row.className = 'tb-fieldrow';

    const label = document.createElement('span');
    label.className = 'tb-fieldrow-label';
    label.textContent = 'Set';
    row.appendChild(label);

    const value = document.createElement('div');
    value.className = 'tb-fieldrow-value';

    const group = document.createElement('span');
    group.className = 'tb-counts';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', (kind === 'quick' ? 'Quick Quiz' : 'Focused Quiz') + ' question set');

    availableSets(overview).forEach(function (item) {
      const button = document.createElement('button');
      const selected = item.value === current;
      button.type = 'button';
      button.className = 'tb-count' + (selected ? ' on' : '');
      button.dataset.quizSet = kind;
      button.dataset.setValue = item.value;
      button.setAttribute('aria-pressed', String(selected));
      button.textContent = item.label;
      if (item.value === 'mix') button.style.minWidth = '68px';
      button.addEventListener('click', function () {
        selectSet(overview, item.value);
      });
      group.appendChild(button);
    });

    value.appendChild(group);
    row.appendChild(value);
    return row;
  }

  function enhanceCard(overview, card, kind) {
    const description = card.querySelector('.tb-mode-head p');
    const controls = card.querySelector('.tb-mode-controls');
    if (!controls) return;

    // "New questions only" and "Missed questions only" both always draw from the pooled
    // Mixed bank, independent of this Set picker, so the Set choice is moot while either is on.
    const unseenActive = controls.getAttribute('data-unseen-active') === 'true';
    const missedActive = controls.getAttribute('data-missed-active') === 'true';
    const poolOverrideActive = unseenActive || missedActive;

    if (description) {
      const names = availableSets(overview).map(function (item) { return item.name; });
      const choices = names.length > 1
        ? names.slice(0, -1).join(', ') + ', or ' + names[names.length - 1]
        : names[0];
      const nextDescription = kind === 'quick'
        ? 'Choose ' + choices + ', then draw a randomized sample across the whole Body of Knowledge.'
        : 'Choose ' + choices + ', then drill one Body of Knowledge area.';
      if (description.textContent !== nextDescription) description.textContent = nextDescription;
    }

    if (!controls.hasAttribute(ENHANCED_ATTR)) {
      controls.setAttribute(ENHANCED_ATTR, 'true');
      controls.insertBefore(createSetControls(overview, kind), controls.firstChild);
    }

    const setButtonTitle = unseenActive
      ? 'Ignored while New questions only is on — that always draws from Mixed.'
      : missedActive
        ? 'Ignored while Missed questions only is on — that always draws from Mixed.'
        : '';
    Array.prototype.forEach.call(controls.querySelectorAll('[data-quiz-set="' + kind + '"]'), function (button) {
      button.disabled = poolOverrideActive;
      button.setAttribute('aria-disabled', String(poolOverrideActive));
      button.title = setButtonTitle;
    });

    // The core simulator owns the summary, including Set, filtered counts, and timed duration.
    // This enhancer only mirrors the page-level Set choice inside each quiz card.
  }

  function enhanceCards() {
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview || !overview.querySelector('.tb-setpick [data-set]')) return;

    normalizeCompletedSetProgress(overview);

    Array.from(overview.querySelectorAll('.tb-mode')).forEach(function (card) {
      const title = card.querySelector('h4');
      if (!title) return;
      const name = title.textContent.trim();
      if (name === 'Quick Quiz') enhanceCard(overview, card, 'quick');
      if (name === 'Focused Quiz') enhanceCard(overview, card, 'focus');
    });
  }

  function enhance() {
    scheduled = false;
    installLearningStorageRecovery();
    enhanceCards();
  }

  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(enhance);
  }

  function initialize() {
    installLearningStorageRecovery();
    scheduleEnhance();
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;

    const observer = new MutationObserver(scheduleEnhance);
    /* Core browse renders replace the overview's direct children. Watching the
       complete subtree also sees this enhancer's own inserted Set controls and
       description text, which recursively schedules another enhancement frame
       forever after a durable-learning repaint. */
    observer.observe(overview, { childList: true });
  }

  /* Core filter changes can replace only the nested modes container, which is
     outside the observer's direct-child scope. This idempotent hook restores
     Set controls synchronously before an incomplete card can be painted. */
  window.__TBSetControls = Object.assign({}, window.__TBSetControls || {}, {
    enhance: enhanceCards
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());