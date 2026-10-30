/* Lessons page browse layer.
   - Restores search and filters from the URL (?q=&topic=&level=&duration=&tool=&interactive=1)
     and keeps the URL in sync, so a filtered view can be shared or bookmarked.
   - Collapses each category to its first 3 lessons with a "Show all (N)" button
     while nothing is searched or filtered. Without JS every lesson stays visible.
   - Folds the filters behind one "Filters" button on narrow screens.
   Loaded after lesson-search.js but before DOMContentLoaded, so restored values
   are in place when the search module initializes. */
(function () {
  'use strict';
  var doc = document;
  var PREVIEW = 3;
  var FIELDS = { q: 'lesson-search', topic: 'topic-filter', level: 'level-filter', duration: 'duration-filter', tool: 'tools-filter' };
  var library = doc.getElementById('lesson-library');
  if (!library) return;
  function el(id) { return doc.getElementById(id); }

  function restoreFromUrl() {
    var params;
    try { params = new URLSearchParams(window.location.search); } catch (_e) { return; }
    Object.keys(FIELDS).forEach(function (key) {
      var field = el(FIELDS[key]);
      var value = (params.get(key) || '').slice(0, 160);
      if (!field || !value) return;
      if (field.tagName === 'SELECT' && !Array.prototype.some.call(field.options, function (o) { return o.value === value; })) return;
      field.value = value;
    });
    var interactive = el('interactive-filter');
    if (interactive && params.get('interactive') === '1') interactive.checked = true;
  }

  function activeCount() {
    var n = 0;
    Object.keys(FIELDS).forEach(function (key) {
      var field = el(FIELDS[key]);
      if (field && String(field.value || '').trim()) n += 1;
    });
    var interactive = el('interactive-filter');
    if (interactive && interactive.checked) n += 1;
    return n;
  }

  function writeUrl() {
    if (!window.history || typeof window.history.replaceState !== 'function') return;
    var params = new URLSearchParams(window.location.search);
    Object.keys(FIELDS).forEach(function (key) {
      var field = el(FIELDS[key]);
      var value = field ? String(field.value || '').trim() : '';
      if (value) params.set(key, value); else params.delete(key);
    });
    var interactive = el('interactive-filter');
    if (interactive && interactive.checked) params.set('interactive', '1'); else params.delete('interactive');
    var query = params.toString();
    var url = window.location.pathname + (query ? '?' + query : '') + window.location.hash;
    try { window.history.replaceState(window.history.state, '', url); } catch (_e) { /* ignore */ }
  }

  function updateMode() {
    var count = activeCount();
    library.classList.toggle('is-filtering', count > 0);
    library.classList.toggle('is-browsing', count === 0);
    var badge = el('filters-toggle-count');
    if (badge) {
      var filterOnly = count - (String((el('lesson-search') || {}).value || '').trim() ? 1 : 0);
      badge.textContent = filterOnly > 0 ? '(' + filterOnly + ')' : '';
    }
  }

  function setupCollapse() {
    var sections = doc.querySelectorAll('[data-category-section]');
    Array.prototype.forEach.call(sections, function (section) {
      var rows = section.querySelectorAll('[data-lesson-item]');
      Array.prototype.forEach.call(rows, function (row, i) { row.classList.toggle('is-extra', i >= PREVIEW); });
      var existing = section.querySelector('.show-all-lessons');
      if (rows.length <= PREVIEW + 1) {
        section.removeAttribute('data-collapsed');
        Array.prototype.forEach.call(rows, function (row) { row.classList.remove('is-extra'); });
        if (existing) existing.remove();
        return;
      }
      var list = section.querySelector('.lesson-list');
      if (!list) return;
      if (!list.id) list.id = (section.id || 'topic') + '-lesson-list';
      var heading = section.querySelector('h2');
      var name = heading ? heading.textContent.trim() : 'this topic';
      var button = existing;
      if (!button) {
        button = doc.createElement('button');
        button.type = 'button';
        button.className = 'show-all-lessons';
        button.setAttribute('aria-controls', list.id);
        button.addEventListener('click', function () {
          var open = section.getAttribute('data-collapsed') !== 'true';
          section.setAttribute('data-collapsed', open ? 'true' : 'false');
          label(button, section, name);
          if (!open) {
            var first = section.querySelectorAll('[data-lesson-item]')[PREVIEW];
            if (first && typeof first.focus === 'function') first.focus();
          }
        });
        list.parentNode.insertBefore(button, list.nextSibling);
        section.setAttribute('data-collapsed', 'true');
      }
      label(button, section, name);
    });
  }

  function label(button, section, name) {
    var total = section.querySelectorAll('[data-lesson-item]').length;
    var collapsed = section.getAttribute('data-collapsed') === 'true';
    button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    var key = (collapsed ? 'more' : 'less') + total;
    if (button.getAttribute('data-label-key') === key) return;
    button.setAttribute('data-label-key', key);
    button.textContent = collapsed ? 'Show all (' + total + ')' : 'Show fewer';
    var hidden = doc.createElement('span');
    hidden.className = 'sr-only';
    hidden.textContent = ' ' + name + ' lessons';
    button.appendChild(hidden);
  }

  function tileCounts() {
    Array.prototype.forEach.call(doc.querySelectorAll('[data-topic-tile]'), function (tile) {
      var topic = tile.getAttribute('data-topic-tile');
      var n = doc.querySelectorAll('[data-lesson-item][data-topic="' + topic + '"]').length;
      var span = tile.querySelector('.topic-tile-count');
      if (!n) { if (span) span.remove(); return; }
      if (!span) { span = doc.createElement('span'); span.className = 'topic-tile-count'; tile.appendChild(span); }
      if (span.textContent !== String(n)) span.textContent = String(n);
      tile.setAttribute('aria-label', tile.firstChild.textContent.trim() + ', ' + n + (n === 1 ? ' lesson' : ' lessons'));
    });
  }

  function setupFilterToggle() {
    var toggle = el('filters-toggle');
    if (!toggle) return;
    toggle.hidden = false;
    library.classList.add('has-filter-toggle');
    toggle.addEventListener('click', function () {
      var open = !library.classList.contains('filters-open');
      library.classList.toggle('filters-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (activeCount() - (String((el('lesson-search') || {}).value || '').trim() ? 1 : 0) > 0) {
      library.classList.add('filters-open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  // Jumping to a topic tile shows that topic in full.
  doc.addEventListener('click', function (event) {
    var tile = event.target && event.target.closest && event.target.closest('[data-topic-tile]');
    if (!tile) return;
    var section = el(tile.getAttribute('data-topic-tile'));
    var button = section && section.querySelector('.show-all-lessons');
    if (button && section.getAttribute('data-collapsed') === 'true') button.click();
  });

  var timer = 0;
  function onChange() {
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { writeUrl(); updateMode(); }, 150);
  }

  restoreFromUrl();
  var form = el('lesson-filters');
  if (form) { form.addEventListener('input', onChange); form.addEventListener('change', onChange); }
  var clear = el('clear-filters');
  if (clear) clear.addEventListener('click', function () { window.setTimeout(onChange, 0); });

  function ready() {
    setupCollapse();
    tileCounts();
    setupFilterToggle();
    updateMode();
    // Rows can be added after load by chi-square-lesson-library.js.
    if (typeof MutationObserver === 'function') {
      var pending = 0;
      new MutationObserver(function () {
        window.clearTimeout(pending);
        pending = window.setTimeout(function () { setupCollapse(); tileCounts(); }, 50);
      }).observe(library, { childList: true, subtree: true });
    }
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
}());
