(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const ENHANCED_ATTR = 'data-upskill-set-controls';
  const RETAKE_STATE_SCRIPT = '/test-bank-retake-state.js';
  const RETAKE_RUNNER_SCRIPT = '/test-bank-retake-runner.js';
  const SETS = [
    { value: '1', label: '1', name: 'Set 1' },
    { value: '2', label: '2', name: 'Set 2' },
    { value: '3', label: '3', name: 'Set 3' },
    { value: 'mix', label: 'Mixed', name: 'Mixed (all sets)' }
  ];

  let scheduled = false;

  function appendScript(path, marker, onload) {
    const existing = document.querySelector('script[src="' + path + '"]');
    if (existing) {
      if (onload && existing.dataset.loaded === 'true') onload();
      else if (onload) existing.addEventListener('load', onload, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = path;
    script.async = false;
    script.setAttribute(marker, 'true');
    script.addEventListener('load', function () {
      script.dataset.loaded = 'true';
      if (onload) onload();
    }, { once: true });
    document.head.appendChild(script);
  }

  function loadRetakeConfiguration() {
    if (window.__TBRetakeConfiguration) return;
    const loadRunner = function () {
      appendScript(RETAKE_RUNNER_SCRIPT, 'data-upskill-retake-runner');
    };
    if (window.__TBRetakeState) loadRunner();
    else appendScript(RETAKE_STATE_SCRIPT, 'data-upskill-retake-state', loadRunner);
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
      button.addEventListener('click', function () { selectSet(overview, item.value); });
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
    enhanceCards();
  }

  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(enhance);
  }

  function initialize() {
    loadRetakeConfiguration();
    scheduleEnhance();
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;
    const observer = new MutationObserver(scheduleEnhance);
    observer.observe(overview, { childList: true });
  }

  window.__TBSetControls = Object.assign({}, window.__TBSetControls || {}, { enhance: enhanceCards });
  loadRetakeConfiguration();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
