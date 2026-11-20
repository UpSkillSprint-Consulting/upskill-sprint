/* Code Finder page controller.
 * Loads data/code-finder/*.json, runs CodeFinderEngine, and renders the
 * search box, facet filters (a bottom sheet on phones), result cards and
 * shareable URL state. All text goes in with textContent, never innerHTML.
 */
(function () {
  'use strict';

  var DATA = '/data/code-finder/';
  var PAGE = 30;
  var MOBILE = '(max-width: 900px)';
  var FACET_UI = [
    {key: 'industries', label: 'Industry', open: true},
    {key: 'categories', label: 'Category', open: true},
    {key: 'useCases', label: 'What are you doing?', open: false},
    {key: 'bodies', label: 'Publisher', open: false},
    {key: 'docTypes', label: 'Document type', open: false},
    {key: 'jurisdictions', label: 'Where', open: false}
  ];
  var SHOW_FIRST = 6;
  var DOC_TYPE_NOTE = {
    specification: 'Product or material requirements',
    'test-method': 'How to run a test',
    practice: 'Recommended way of working',
    guide: 'Background and options',
    code: 'Rules for design, build or inspection',
    'management-system': 'Requirements for how an organization runs',
    'technical-report': 'Information only',
    regulation: 'Law or regulation'
  };

  var E = window.CodeFinderEngine;
  var root, els = {}, index = null, state = null, shown = PAGE, expandedFacets = {}, typingTimer = null;

  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      var value = attrs[key];
      if (value === null || value === undefined || value === false) return;
      if (key === 'text') node.textContent = value;
      else if (key === 'class') node.className = value;
      else if (key.indexOf('on') === 0) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? '' : value);
    });
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  function formatDate(iso) {
    var parts = iso.split('-');
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[Number(parts[1]) - 1] + ' ' + Number(parts[2]) + ', ' + parts[0];
  }

  function labelOf(facet, slug) { return (index.labels[facet] && index.labels[facet][slug]) || slug; }
  function filterCount() {
    return E.FACETS.reduce(function (sum, facet) { return sum + ((state.filters[facet] || []).length); }, 0);
  }

  // ---------- Loading ----------
  function load() {
    var files = ['taxonomy', 'standards', 'synonyms'];
    return Promise.all(files.map(function (name) {
      return fetch(DATA + name + '.json', {credentials: 'same-origin'}).then(function (response) {
        if (!response.ok) throw new Error(name + ' ' + response.status);
        return response.json();
      });
    })).then(function (parts) {
      return {taxonomy: parts[0], standards: parts[1], synonyms: parts[2]};
    });
  }

  // ---------- URL ----------
  function writeUrl(mode) {
    var query = E.stateToParams(state);
    var url = location.pathname + (query ? '?' + query : '');
    if (url === location.pathname + location.search) return;
    try { history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url); } catch (error) { /* file:// or sandbox */ }
  }

  // ---------- Render ----------
  function run(mode) {
    var output = E.search(index, state.q, state.filters, {sort: state.sort});
    renderStatus(output);
    renderActive();
    renderFacets(output.counts);
    renderResults(output);
    if (mode) writeUrl(mode);
    return output;
  }

  function renderStatus(output) {
    var n = output.total, text;
    var noun = n === 1 ? 'code' : 'codes';
    if (output.hasQuery) text = n + ' ' + noun + ' match "' + state.q.trim() + '"';
    else if (filterCount()) text = n + ' ' + noun + ' match your filters';
    else text = 'Showing all ' + n + ' codes. Search or filter to narrow the list.';
    if (output.synonyms.length) text += '. Also searched: ' + output.synonyms.join(', ');
    els.status.textContent = text + '.';
    var count = filterCount();
    els.filterCount.hidden = !count;
    els.filterCount.textContent = count ? ' (' + count + ')' : '';
    els.openFilters.setAttribute('aria-label', count ? 'Filters, ' + count + ' on' : 'Filters');
    els.apply.textContent = 'Show ' + n + ' ' + noun;
  }

  function renderActive() {
    els.active.textContent = '';
    var chips = [];
    E.FACETS.forEach(function (facet) {
      (state.filters[facet] || []).forEach(function (slug) {
        chips.push(h('button', {type: 'button', class: 'cf-chip', 'aria-label': 'Remove filter: ' + labelOf(facet, slug),
          onclick: function () { toggle(facet, slug, false); focusStatus(); }}, [labelOf(facet, slug), h('span', {'aria-hidden': 'true', text: ' ×'})]));
      });
    });
    els.active.hidden = !chips.length;
    if (chips.length) {
      chips.forEach(function (chip) { els.active.appendChild(chip); });
      els.active.appendChild(h('button', {type: 'button', class: 'cf-link-btn', text: 'Clear all', onclick: clearAll}));
    }
  }

  function facetEntries(key) {
    if (key === 'bodies') return index.catalog.taxonomy.bodies.map(function (body) { return {slug: body.code, label: body.code + ' (' + body.name + ')'}; });
    return index.catalog.taxonomy.facets[key];
  }

  function renderFacets(counts) {
    var focusedValue = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.cfValue : null;
    var focusedFacet = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.cfFacet : null;
    els.facets.textContent = '';
    FACET_UI.forEach(function (ui) {
      var selected = state.filters[ui.key] || [];
      var entries = facetEntries(ui.key).filter(function (entry) {
        return (counts[ui.key][entry.slug] || 0) > 0 || selected.indexOf(entry.slug) !== -1;
      });
      if (!entries.length) return;
      var showAll = expandedFacets[ui.key] || entries.length <= SHOW_FIRST + 2;
      var list = h('ul', {class: 'cf-facet-list'});
      entries.forEach(function (entry, i) {
        var checked = selected.indexOf(entry.slug) !== -1;
        if (!showAll && i >= SHOW_FIRST && !checked) return;
        var input = h('input', {type: 'checkbox', value: entry.slug, checked: checked, 'data-cf-facet': ui.key, 'data-cf-value': entry.slug,
          onchange: function (event) { toggle(ui.key, entry.slug, event.target.checked); }});
        list.appendChild(h('li', {class: entry.parent ? 'cf-facet-child' : null}, [
          h('label', {class: 'cf-check'}, [input, h('span', {class: 'cf-check-label', text: entry.label || entry.slug}),
            h('span', {class: 'cf-count osx-value', text: String(counts[ui.key][entry.slug] || 0)})])
        ]));
      });
      var more = null;
      if (!showAll) {
        more = h('button', {type: 'button', class: 'cf-link-btn', text: 'Show all ' + entries.length,
          onclick: function () { expandedFacets[ui.key] = true; renderFacets(counts); }});
      }
      var details = h('details', {class: 'cf-facet', open: ui.open || selected.length > 0 || expandedFacets[ui.key] ? true : null}, [
        h('summary', {}, [ui.label, selected.length ? h('span', {class: 'cf-facet-on', text: ' · ' + selected.length + ' on'}) : null]),
        list, more]);
      details.addEventListener('toggle', function () { ui.open = details.open; });
      els.facets.appendChild(details);
    });
    if (focusedValue) {
      var again = els.facets.querySelector('[data-cf-facet="' + focusedFacet + '"][data-cf-value="' + focusedValue + '"]');
      if (again) again.focus();
    }
  }

  function pill(text, kind) { return h('span', {class: 'osx-pill cf-pill' + (kind ? ' cf-pill-' + kind : ''), text: text}); }

  function verifiedLine(record) {
    if (!E.isStale(record)) {
      return h('p', {class: 'cf-check-ok'}, [h('span', {class: 'cf-flag', 'aria-hidden': 'true', text: '✓'}),
        ' Checked ' + formatDate(record.verified) + (record.edition ? ' · current edition ' + record.edition : '')]);
    }
    return h('p', {class: 'cf-check-todo'}, [h('span', {class: 'cf-flag', 'aria-hidden': 'true', text: '!'}),
      record.verified ? ' Last checked ' + formatDate(record.verified) + '. Confirm the current edition.' : ' Not yet checked. Confirm the current edition with the publisher.']);
  }

  function adoptionsBlock(record) {
    if (!record.adoptions.length) return null;
    return h('div', {class: 'cf-adoptions'}, [h('h4', {text: 'Where it is mandatory'}), h('ul', {}, record.adoptions.map(function (a) {
      var style = a.style === 'dated' ? 'a fixed edition: ' + a.editionCited : 'each new edition (' + a.editionCited + ')';
      return h('li', {}, [h('strong', {text: labelOf('jurisdictions', a.jurisdiction) + ': '}),
        a.regulator + ' requires it through ' + a.instrument + ', which calls for ' + style + '. Checked ' + formatDate(a.verified) + '.']);
    }))]);
  }

  function detailsBody(record) {
    var body = h('div', {class: 'cf-details-grid'});
    var row = function (term, values) {
      if (!values.length) return;
      body.appendChild(h('div', {class: 'cf-dl'}, [h('h4', {text: term}), h('p', {text: values.join(', ')})]));
    };
    row('Industries', record.industries.map(function (s) { return labelOf('industries', s); }));
    row('Categories', record.categories.map(function (s) { return labelOf('categories', s); }));
    row('Use it to', record.useCases.map(function (s) { return labelOf('useCases', s); }));
    row('Region', record.jurisdictions.map(function (s) { return labelOf('jurisdictions', s); }));
    var parts = [body, adoptionsBlock(record)];
    var rel = E.related(index, record.id).filter(function (item) { return index.byId[item.to]; });
    if (rel.length) {
      parts.push(h('div', {class: 'cf-relations'}, [h('h4', {text: 'Related codes'}), h('ul', {}, rel.map(function (item) {
        var other = index.byId[item.to];
        return h('li', {}, [h('span', {class: 'cf-rel-type', text: item.label}), ' ',
          h('button', {type: 'button', class: 'cf-link-btn', text: other.designation, 'aria-label': 'Show ' + other.designation + ', ' + other.title,
            onclick: function () { openRecord(other); }}),
          item.note ? h('span', {class: 'cf-rel-note', text: ' · ' + item.note}) : null]);
      }))]));
    }
    var learn = record.learning.map(function (entry) {
      return h('li', {}, [h('a', {href: entry.href, text: (entry.type === 'tool' ? 'Tool: ' : 'Lesson: ') + entry.label})]);
    });
    if (learn.length) parts.push(h('div', {class: 'cf-learn'}, [h('h4', {text: 'Learn it on UpSkill Sprint'}), h('ul', {}, learn)]));
    var bodyInfo = index.catalog.taxonomy.bodies.filter(function (b) { return b.code === record.body; })[0];
    if (bodyInfo) parts.push(h('p', {class: 'cf-publisher'}, [h('a', {href: bodyInfo.catalog, rel: 'noopener', target: '_blank',
      text: 'Find ' + record.designation + ' in the ' + bodyInfo.name + ' catalog'}), h('span', {class: 'cf-sr', text: ' (opens in a new tab)'})]));
    return parts;
  }

  function card(item) {
    var record = item.record;
    var node = els.template.content.firstElementChild.cloneNode(true);
    node.querySelector('.cf-desig').textContent = record.designation;
    var pills = node.querySelector('.cf-pills');
    pills.appendChild(pill(record.body, 'body'));
    pills.appendChild(pill(labelOf('docTypes', record.docType), null));
    if (record.adoptions.length) pills.appendChild(pill('Mandatory in places', 'law'));
    node.querySelector('.cf-card-title').textContent = record.title;
    node.querySelector('.cf-summary').textContent = record.summary;
    var meta = node.querySelector('.cf-meta');
    meta.appendChild(verifiedLine(record));
    if (item.reasons.length) {
      meta.appendChild(h('p', {class: 'cf-why'}, [h('span', {class: 'osx-label', text: 'Why it matched '})].concat(
        item.reasons.map(function (reason) { return h('span', {class: 'cf-why-chip', text: reason}); }))));
    }
    var article = node.querySelector('.cf-card');
    article.id = 'code-' + record.id;
    article.setAttribute('aria-label', record.designation + ', ' + record.title);
    node.querySelector('.cf-details summary').setAttribute('title', DOC_TYPE_NOTE[record.docType] || '');
    var details = node.querySelector('.cf-details');
    var filled = false;
    details.addEventListener('toggle', function () {
      if (!details.open || filled) return;
      filled = true;
      var target = node.querySelector('.cf-details-body');
      detailsBody(record).forEach(function (part) { if (part) target.appendChild(part); });
    });
    return node;
  }

  function renderResults(output) {
    els.results.textContent = '';
    var slice = output.results.slice(0, shown);
    var frag = document.createDocumentFragment();
    slice.forEach(function (item) { frag.appendChild(card(item)); });
    els.results.appendChild(frag);
    els.empty.hidden = output.total > 0;
    var left = output.total - slice.length;
    els.more.hidden = left <= 0;
    els.more.textContent = 'Show ' + Math.min(left, PAGE) + ' more of ' + left + ' remaining';
  }

  // ---------- Actions ----------
  function toggle(facet, slug, on) {
    var list = (state.filters[facet] || []).filter(function (value) { return value !== slug; });
    if (on) list.push(slug);
    state.filters[facet] = list;
    shown = PAGE;
    run('push');
  }

  function clearAll() {
    state = {q: '', filters: {}, sort: state.sort};
    els.q.value = '';
    shown = PAGE;
    run('push');
    els.q.focus();
  }

  function setQuery(q, mode) {
    state.q = q;
    els.q.value = q;
    shown = PAGE;
    run(mode || 'push');
  }

  function openRecord(record) {
    state.filters = {};
    setQuery(record.designation);
    var target = document.getElementById('code-' + record.id);
    if (target) {
      var details = target.querySelector('.cf-details');
      if (details) details.open = true;
      target.setAttribute('tabindex', '-1');
      target.focus();
      if (target.scrollIntoView) target.scrollIntoView({block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth'});
    }
  }

  function focusStatus() { els.status.setAttribute('tabindex', '-1'); }
  function reducedMotion() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  // ---------- Mobile filter sheet ----------
  // One filter panel; on phones it moves into a native <dialog> so focus is
  // trapped, Esc closes it and the page behind is inert.
  function openSheet() {
    els.sheet.appendChild(els.filters);
    if (typeof els.sheet.showModal === 'function') els.sheet.showModal(); else els.sheet.setAttribute('open', '');
    var first = els.filters.querySelector('summary, input');
    if (first) first.focus();
  }
  function closeSheet() {
    if (els.sheet.open || els.sheet.hasAttribute('open')) {
      if (typeof els.sheet.close === 'function') els.sheet.close(); else els.sheet.removeAttribute('open');
    }
  }
  function onSheetClose() {
    els.slot.appendChild(els.filters);
    els.openFilters.focus();
  }

  function bind() {
    els.form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearTimeout(typingTimer);
      setQuery(els.q.value.slice(0, 120), 'push');
    });
    els.q.addEventListener('input', function () {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(function () { state.q = els.q.value.slice(0, 120); shown = PAGE; run('replace'); }, 180);
    });
    root.querySelectorAll('[data-cf-example]').forEach(function (button) {
      button.addEventListener('click', function () { state.filters = {}; setQuery(button.getAttribute('data-cf-example')); });
    });
    root.querySelectorAll('[data-cf-clear]').forEach(function (button) { button.addEventListener('click', clearAll); });
    els.sort.addEventListener('change', function () { state.sort = els.sort.value; run('replace'); });
    els.more.addEventListener('click', function () {
      var first = shown;
      shown += PAGE;
      run();
      var next = els.results.children[first];
      if (next) { var link = next.querySelector('summary'); if (link) link.focus(); }
    });
    els.openFilters.addEventListener('click', openSheet);
    els.sheet.addEventListener('close', onSheetClose);
    els.sheet.addEventListener('click', function (event) { if (event.target === els.sheet) closeSheet(); });
    root.querySelector('[data-cf-close-sheet]').addEventListener('click', closeSheet);
    if (window.matchMedia) {
      var mq = window.matchMedia(MOBILE);
      var onChange = function () { if (!mq.matches) closeSheet(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
    }
    window.addEventListener('popstate', function () {
      state = E.paramsToState(location.search, index);
      els.q.value = state.q;
      els.sort.value = state.sort;
      shown = PAGE;
      run();
    });
  }

  var started = null;
  // Safe to call more than once: the page wires itself up a single time.
  function init() {
    if (started) return started;
    root = document.querySelector('[data-cf-root]');
    if (!root || !E) return Promise.resolve();
    started = boot();
    return started;
  }

  function boot() {
    ['form', 'q', 'status', 'sort', 'active', 'facets', 'results', 'empty', 'more', 'sheet', 'filters'].forEach(function (id) {
      els[id] = document.getElementById('cf-' + id);
    });
    els.slot = document.getElementById('cf-filter-slot');
    els.openFilters = document.getElementById('cf-open-filters');
    els.filterCount = root.querySelector('[data-cf-filter-count]');
    els.apply = root.querySelector('[data-cf-close-sheet]');
    els.template = document.getElementById('cf-card-template');
    return load().then(function (catalog) {
      index = E.buildIndex(catalog);
      state = E.paramsToState(location.search, index);
      els.q.value = state.q;
      els.sort.value = state.sort;
      bind();
      root.setAttribute('data-cf-ready', 'true');
      run();
    }).catch(function () {
      els.status.textContent = 'The code list did not load. Check your connection and refresh the page.';
      root.setAttribute('data-cf-ready', 'error');
    });
  }

  window.CodeFinderApp = {init: init};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
