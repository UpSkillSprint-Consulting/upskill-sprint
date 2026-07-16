(function () {
  'use strict';

  const TOOL_PATH = '/engineering-tools/grade-specification-lookup';

  function pathEndsWith(path) {
    const current = window.location.pathname.replace(/\/+$/, '') || '/';
    const target = path.replace(/\/+$/, '') || '/';
    return current === target || current.endsWith(target);
  }

  function isEngineeringToolsPage() {
    return pathEndsWith('/engineering-tools') || pathEndsWith('/engineering-tools.html');
  }

  function isLessonsPage() {
    return pathEndsWith('/lessons') || pathEndsWith('/lessons.html');
  }

  function insertAfter(reference, node) {
    if (reference && reference.parentNode) {
      reference.parentNode.insertBefore(node, reference.nextSibling);
    }
  }

  function ensureToolDirectoryCard() {
    if (!isEngineeringToolsPage() || document.getElementById('grade-specification-lookup')) return;
    const directory = document.querySelector('.tool-directory');
    if (!directory) return;

    const card = document.createElement('a');
    card.id = 'grade-specification-lookup';
    card.href = TOOL_PATH;
    card.className = 'tool-row';
    card.setAttribute('aria-label', 'Open Grade Specification Lookup');
    card.innerHTML = `
      <div class="tool-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16v14H4zM8 9h8M8 13h5M16.5 16.5l2.5 2.5M18 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>
      </div>
      <div class="tool-content">
        <h2>Grade Specification Lookup</h2>
        <p>Reference CSA G40.21, CSA Z245.1, API 5L, and ASTM grade requirements; check test results; compare grades; and use shared engineering calculators.</p>
        <div class="tool-tags" aria-label="Lookup capabilities"><span>CSA</span><span>API</span><span>ASTM</span><span>Compliance</span><span>Calculators</span></div>
      </div>
      <span class="tool-status available">Available</span>
      <span class="tool-action primary tool-link">Open lookup</span>`;

    const materialCard = document.getElementById('materials-quality');
    if (materialCard && materialCard.parentNode === directory) insertAfter(materialCard, card);
    else directory.prepend(card);
  }

  function addEngineeringToolsTopic() {
    const jumpArea = document.querySelector('.topic-jump');
    if (jumpArea) {
      const existingChip = Array.from(jumpArea.querySelectorAll('a')).find(function (link) {
        return link.textContent.trim() === 'Engineering Tools';
      });
      if (existingChip) existingChip.href = '#engineering-tools';
      else {
        const chip = document.createElement('a');
        chip.href = '#engineering-tools';
        chip.className = 'chip';
        chip.textContent = 'Engineering Tools';
        jumpArea.appendChild(chip);
      }
    }

    const topicFilter = document.getElementById('topic-filter');
    if (topicFilter && !topicFilter.querySelector('option[value="engineering-tools"]')) {
      const option = document.createElement('option');
      option.value = 'engineering-tools';
      option.textContent = 'Engineering Tools';
      topicFilter.appendChild(option);
    }
  }

  function createLessonSection() {
    const section = document.createElement('section');
    section.className = 'lesson-category';
    section.id = 'engineering-tools';
    section.dataset.categorySection = '';
    section.dataset.topic = 'engineering-tools';
    section.innerHTML = `
      <div class="category-header">
        <h2>Engineering Tools</h2>
        <span class="category-count">1 tool</span>
      </div>
      <div class="lesson-list">
        <a class="lesson-row" href="${TOOL_PATH}" data-lesson-item data-topic="engineering-tools" data-level="intermediate" data-interactive="true" data-search="grade specification lookup steel CSA G40.21 CSA Z245.1 API 5L ASTM compliance checker calculators reverse lookup Charpy carbon equivalent elongation hydrotest engineering tools">
          <div>
            <div class="lesson-meta"><span>Intermediate</span><span>Interactive tool</span></div>
            <h3>Grade Specification Lookup</h3>
            <p>Reference steel-grade requirements, check test results, compare grades, and use CE, Charpy, elongation, hydrotest, and reverse-lookup tools.</p>
          </div>
          <span class="lesson-action">Open tool</span>
        </a>
      </div>`;
    return section;
  }

  function normalise(value) {
    return String(value || '').toLowerCase().trim();
  }

  function installFilterSync(section, row) {
    const searchInput = document.getElementById('lesson-search');
    const topicFilter = document.getElementById('topic-filter');
    const levelFilter = document.getElementById('level-filter');
    const interactiveFilter = document.getElementById('interactive-filter');
    const clearButton = document.getElementById('clear-filters');
    if (!searchInput || !topicFilter || !levelFilter || !interactiveFilter) return;

    function sync() {
      const query = normalise(searchInput.value);
      const topic = topicFilter.value;
      const level = levelFilter.value;
      const interactiveOnly = interactiveFilter.checked;
      const matches = (!query || normalise(row.dataset.search).includes(query)) &&
        (!topic || row.dataset.topic === topic) &&
        (!level || row.dataset.level === level) &&
        (!interactiveOnly || row.dataset.interactive === 'true');

      row.hidden = !matches;
      section.hidden = !matches;

      const allRows = Array.from(document.querySelectorAll('[data-lesson-item]'));
      const visibleCount = allRows.filter(function (item) { return !item.hidden; }).length;
      const resultsCount = document.getElementById('results-count');
      if (resultsCount) resultsCount.textContent = visibleCount + (visibleCount === 1 ? ' lesson' : ' lessons');

      const noResults = document.getElementById('no-results');
      const visibleEmpty = Array.from(document.querySelectorAll('[data-empty-category]')).some(function (item) { return !item.hidden; });
      if (noResults) noResults.hidden = visibleCount > 0 || visibleEmpty;
    }

    [searchInput, topicFilter, levelFilter, interactiveFilter].forEach(function (control) {
      control.addEventListener(control.type === 'search' ? 'input' : 'change', function () {
        window.setTimeout(sync, 0);
      });
    });
    if (clearButton) clearButton.addEventListener('click', function () { window.setTimeout(sync, 0); });
    sync();
  }

  function ensureLessonsEntry() {
    if (!isLessonsPage()) return;
    addEngineeringToolsTopic();
    let section = document.getElementById('engineering-tools');
    if (!section) {
      section = createLessonSection();
      const reference = document.getElementById('ai-for-work') || document.getElementById('no-results');
      if (reference && reference.parentNode) reference.parentNode.insertBefore(section, reference);
      else {
        const library = document.querySelector('.lesson-library .wrap');
        if (library) library.appendChild(section);
      }
    }
    const row = section.querySelector('[data-lesson-item]');
    if (row && section.dataset.gradeLookupFilterSync !== 'true') {
      section.dataset.gradeLookupFilterSync = 'true';
      installFilterSync(section, row);
    }
  }

  function initialize() {
    ensureToolDirectoryCard();
    ensureLessonsEntry();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
