(function () {
  'use strict';

  const OVERVIEW_ID = 'tb-overview';
  const ENHANCED_ATTR = 'data-upskill-set-controls';
  const SETS = [
    { value: '1', label: '1', name: 'Set 1' },
    { value: '2', label: '2', name: 'Set 2' },
    { value: '3', label: '3', name: 'Set 3' },
    { value: 'mix', label: 'Mixed', name: 'Mixed (all sets)' }
  ];

  let scheduled = false;

  function activeSetValue(overview) {
    const active = overview.querySelector('.tb-setpick [data-set].on');
    return active ? active.dataset.set : '1';
  }

  function activeSetName(value) {
    const match = SETS.find(function (item) { return item.value === value; });
    return match ? match.name : 'Set 1';
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

  function createSetControls(overview, kind) {
    const current = activeSetValue(overview);
    const fragment = document.createDocumentFragment();

    const label = document.createElement('span');
    label.className = 'tb-ctl-label';
    label.textContent = 'Set';
    fragment.appendChild(label);

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

    fragment.appendChild(group);
    return fragment;
  }

  function appendBold(parent, value) {
    const bold = document.createElement('b');
    bold.textContent = value;
    parent.appendChild(bold);
  }

  function updateSummary(card, kind, setName) {
    const summary = card.querySelector('.tb-mode-sum');
    if (!summary) return;

    const boldValues = Array.from(summary.querySelectorAll('b')).map(function (node) {
      return node.textContent.trim();
    });
    const count = boldValues[0] || '20';
    const area = kind === 'focus' ? (boldValues[1] || 'the selected area') : '';
    const desiredText = kind === 'quick'
      ? 'Random ' + count + ' questions from ' + setName + ' across the whole Body of Knowledge.'
      : 'Random ' + count + ' questions from ' + area + ' in ' + setName + '.';

    if (summary.textContent.replace(/\s+/g, ' ').trim() === desiredText) return;

    summary.replaceChildren();
    summary.append('Random ');
    appendBold(summary, count);
    summary.append(' questions from ');
    if (kind === 'focus') {
      appendBold(summary, area);
      summary.append(' in ');
    }
    appendBold(summary, setName);
    summary.append(kind === 'quick' ? ' across the whole Body of Knowledge.' : '.');
  }

  function enhanceCard(overview, card, kind, setName) {
    const description = card.querySelector('.tb-mode-head p');
    const controls = card.querySelector('.tb-mode-controls');
    if (!controls) return;

    // "New questions only" and "Missed questions only" both always draw from the pooled
    // Mixed bank, independent of this Set picker, so the Set choice is moot while either is on.
    const unseenActive = controls.getAttribute('data-unseen-active') === 'true';
    const missedActive = controls.getAttribute('data-missed-active') === 'true';
    const poolOverrideActive = unseenActive || missedActive;

    if (description) {
      const nextDescription = kind === 'quick'
        ? 'Choose Set 1, Set 2, Set 3, or Mixed, then draw a randomized sample across the whole Body of Knowledge.'
        : 'Choose Set 1, Set 2, Set 3, or Mixed, then drill one Body of Knowledge area.';
      if (description.textContent !== nextDescription) description.textContent = nextDescription;
    }

    if (!controls.hasAttribute(ENHANCED_ATTR)) {
      controls.setAttribute(ENHANCED_ATTR, 'true');
      controls.insertBefore(createSetControls(overview, kind), controls.firstChild);
    }

    const setButtonTitle = unseenActive
      ? 'Ignored while New questions only is on \u2014 that always draws from Mixed.'
      : missedActive
        ? 'Ignored while Missed questions only is on \u2014 that always draws from Mixed.'
        : '';
    Array.prototype.forEach.call(controls.querySelectorAll('[data-quiz-set="' + kind + '"]'), function (button) {
      button.disabled = poolOverrideActive;
      button.setAttribute('aria-disabled', String(poolOverrideActive));
      button.title = setButtonTitle;
    });

    // The core script owns the summary text while "New questions only" or "Missed questions
    // only" is on (it needs to report the live unseen/missed question count); don't fight it.
    if (poolOverrideActive) return;
    updateSummary(card, kind, setName);
  }

  function enhance() {
    scheduled = false;
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview || !overview.querySelector('.tb-setpick [data-set]')) return;

    const activeName = activeSetName(activeSetValue(overview));
    Array.from(overview.querySelectorAll('.tb-mode')).forEach(function (card) {
      const title = card.querySelector('h4');
      if (!title) return;
      const name = title.textContent.trim();
      if (name === 'Quick Quiz') enhanceCard(overview, card, 'quick', activeName);
      if (name === 'Focused Quiz') enhanceCard(overview, card, 'focus', activeName);
    });
  }

  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(enhance);
  }

  function initialize() {
    scheduleEnhance();
    const overview = document.getElementById(OVERVIEW_ID);
    if (!overview) return;

    const observer = new MutationObserver(scheduleEnhance);
    observer.observe(overview, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
