/* global LessonSearchCore */
/*
 * Smart lesson search UI for UpSkill Sprint.
 *
 * This file is intentionally a progressive enhancement. The original lesson
 * links and filters remain the source of truth for catalog browsing; the
 * generated content index adds section-level discovery when it is available.
 */
(function lessonSearchModule(root, factory) {
  'use strict';

  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.UpskillLessonSearch = api;

  if (root && root.document) {
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', function () { api.init(); }, { once: true });
    } else {
      api.init();
    }
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function lessonSearchFactory(root) {
  'use strict';

  const INDEX_URL = '/assets/search/lesson-search-index.json';
  const ANALYTICS_URL = '/.netlify/functions/lesson-search-analytics';
  const SEARCH_DELAY_MS = 90;
  const ANALYTICS_DELAY_MS = 850;
  const INITIAL_RESULT_LIMIT = 12;
  const RESULT_LIMIT_INCREMENT = 12;
  const INITIAL_SECTION_LIMIT = 3;
  const MODES = [
    { value: 'all', label: 'All' },
    { value: 'titles', label: 'Titles' },
    { value: 'sections', label: 'Sections' },
    { value: 'examples', label: 'Examples' },
    { value: 'formulas', label: 'Formulas' }
  ];
  const TOPIC_LABELS = {
    'data-analytics': 'Data Analytics',
    'exam-practice': 'Exam Practice',
    'quality-engineering': 'Quality Engineering',
    'lean-six-sigma': 'Lean Six Sigma',
    statistics: 'Statistics',
    'power-bi-excel-sql': 'Power BI, Excel & SQL',
    'project-management': 'Project Management',
    'business-decision-making': 'Business Decision-Making',
    'ai-for-work': 'AI for Work'
  };

  let activeInstance = null;

  function safeString(value) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  }

  function titleCase(value) {
    return safeString(value)
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, function (letter) { return letter.toUpperCase(); });
  }

  function canonicalPath(path, baseHref) {
    try {
      const url = new URL(path || '/', baseHref || (root.location && root.location.href) || 'https://upskillsprint.com/');
      return url.pathname.replace(/\/+$/, '').replace(/\.html$/i, '') || '/';
    } catch (_error) {
      return safeString(path).replace(/[?#].*$/, '').replace(/\/+$/, '').replace(/\.html$/i, '') || '/';
    }
  }

  function createDeepLink(path, sectionId, query, baseHref) {
    let url;
    try {
      url = new URL(path || '/', baseHref || (root.location && root.location.href) || 'https://upskillsprint.com/');
    } catch (_error) {
      url = new URL('/', 'https://upskillsprint.com/');
    }
    const hash = new URLSearchParams();
    if (safeString(sectionId)) hash.set('section', safeString(sectionId));
    if (safeString(query)) hash.set('search', safeString(query).slice(0, 160));
    hash.set('from', 'lesson-search');
    url.hash = hash.toString();

    if (root.location && url.origin === root.location.origin) {
      return url.pathname + url.search + url.hash;
    }
    return url.href;
  }

  function searchFromLocationHash(locationObject) {
    const raw = safeString(locationObject && locationObject.hash).replace(/^#/, '');
    if (!raw || !/(?:^|&)search=/.test(raw)) return '';
    try {
      return safeString(new URLSearchParams(raw).get('search')).slice(0, 160);
    } catch (_error) {
      return '';
    }
  }

  function appendHighlightedText(element, text, queryOrRanges, core) {
    const value = String(text == null ? '' : text);
    let segments = [{ text: value, highlighted: false }];
    if (core && typeof core.highlightText === 'function') {
      try {
        segments = core.highlightText(value, queryOrRanges);
      } catch (_error) {
        segments = [{ text: value, highlighted: false }];
      }
    }
    for (const segment of segments) {
      if (!segment || !segment.text) continue;
      if (segment.highlighted) {
        const mark = element.ownerDocument.createElement('mark');
        mark.textContent = segment.text;
        element.appendChild(mark);
      } else {
        element.appendChild(element.ownerDocument.createTextNode(segment.text));
      }
    }
  }

  function rowToLesson(row, baseHref) {
    const titleElement = row.querySelector('h2, h3, h4');
    const descriptionElement = row.querySelector('p');
    const metadata = Array.from(row.querySelectorAll('.lesson-meta span')).map(function (item) {
      return safeString(item.textContent);
    });
    const href = row.getAttribute('href') || row.href || '';
    const title = safeString(titleElement && titleElement.textContent) || safeString(row.dataset.search).split(' ').slice(0, 8).join(' ');
    const minuteText = metadata.find(function (item) { return /\bmin(?:ute)?s?\b/i.test(item); }) || '';
    const minutesMatch = minuteText.match(/\d+/);
    return {
      id: (canonicalPath(href, baseHref) + '-' + title).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase(),
      path: href,
      title: title,
      description: safeString(descriptionElement && descriptionElement.textContent),
      topic: safeString(row.dataset.topic),
      level: safeString(row.dataset.level),
      minutes: minutesMatch ? Number(minutesMatch[0]) : null,
      interactive: row.dataset.interactive === 'true',
      keywords: safeString(row.dataset.search),
      contentAvailable: !/lesson-template(?:\.html)?(?:[?#]|$)/i.test(href),
      sections: []
    };
  }

  function createCatalogIndex(documentObject) {
    const baseHref = documentObject.baseURI;
    return {
      version: 1,
      lessons: Array.from(documentObject.querySelectorAll('[data-lesson-item]')).map(function (row) {
        return rowToLesson(row, baseHref);
      })
    };
  }

  function unpackLessons(index) {
    if (Array.isArray(index)) return index;
    if (index && Array.isArray(index.lessons)) return index.lessons;
    if (index && Array.isArray(index.documents)) return index.documents;
    return [];
  }

  function lessonIdentity(lesson, baseHref) {
    const path = canonicalPath(lesson.path || lesson.href || lesson.url, baseHref);
    // Multiple "coming soon" cards may share lesson-template.html. Keep each
    // card distinct while still de-duplicating real lesson paths.
    if (/\/lesson-template$/i.test(path)) return path + '|' + safeString(lesson.title).toLowerCase();
    return path;
  }

  function mergeIndexes(remoteIndex, catalogIndex, baseHref) {
    const remoteLessons = unpackLessons(remoteIndex);
    const catalogLessons = unpackLessons(catalogIndex);
    const catalogByIdentity = new Map(catalogLessons.map(function (lesson) {
      return [lessonIdentity(lesson, baseHref), lesson];
    }));
    const merged = [];
    const seen = new Set();

    for (const lesson of remoteLessons) {
      const identity = lessonIdentity(lesson, baseHref);
      const catalogLesson = catalogByIdentity.get(identity);
      // The live catalog owns filtering metadata because it may contain a
      // correction made after the last index build. The generated index owns
      // extracted section content. This also lets newly published cards appear
      // immediately, then gain full content search on the next build.
      const value = Object.assign({}, lesson, catalogLesson || {});
      value.keywords = []
        .concat(Array.isArray(lesson.keywords) ? lesson.keywords : [lesson.keywords])
        .concat(catalogLesson && catalogLesson.keywords ? [catalogLesson.keywords] : [])
        .filter(Boolean);
      value.sections = Array.isArray(lesson.sections) ? lesson.sections : [];
      value.contentAvailable = lesson.contentAvailable !== false;
      merged.push(value);
      seen.add(identity);
    }
    for (const lesson of catalogLessons) {
      const identity = lessonIdentity(lesson, baseHref);
      if (seen.has(identity)) continue;
      merged.push(lesson);
      seen.add(identity);
    }

    return Object.assign({}, remoteIndex && !Array.isArray(remoteIndex) ? remoteIndex : {}, {
      version: (remoteIndex && remoteIndex.version) || 1,
      lessons: merged
    });
  }

  function catalogSignature(index, baseHref) {
    return unpackLessons(index).map(function (lesson) {
      return [
        lessonIdentity(lesson, baseHref),
        safeString(lesson.title),
        safeString(lesson.topic),
        safeString(lesson.level),
        Boolean(lesson.interactive)
      ].join('|');
    }).sort().join('\n');
  }

  function fallbackNormalize(value) {
    return safeString(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+#]+/g, ' ').trim();
  }

  function fallbackSearch(index, query, options) {
    const normalized = fallbackNormalize(query);
    const tokens = normalized.split(' ').filter(function (token) {
      return token.length > 1 && !['the', 'and', 'for', 'with', 'how', 'what', 'which', 'lesson'].includes(token);
    });
    const settings = options || {};
    const results = [];

    for (const lesson of unpackLessons(index)) {
      if (settings.topic && lesson.topic !== settings.topic) continue;
      if (settings.level && lesson.level !== settings.level) continue;
      if (settings.interactive === 'interactive' && !lesson.interactive) continue;

      const title = fallbackNormalize(lesson.title);
      const metadata = fallbackNormalize([lesson.keywords, lesson.description].flat().join(' '));
      let score = title.includes(normalized) ? 160 : 0;
      score += tokens.reduce(function (total, token) {
        const metadataScore = settings.mode === 'titles' ? 0 : (metadata.includes(token) ? 16 : 0);
        return total + (title.includes(token) ? 48 : 0) + metadataScore;
      }, 0);
      const sections = [];
      if (settings.mode !== 'titles') {
        for (const section of Array.isArray(lesson.sections) ? lesson.sections : []) {
          const kinds = Array.isArray(section.kinds) ? section.kinds.map(fallbackNormalize) : [];
          if (settings.mode === 'examples' && !kinds.includes('example')) continue;
          if (settings.mode === 'formulas' && !kinds.includes('formula')) continue;
          const heading = fallbackNormalize([section.heading, section.breadcrumb].join(' '));
          const body = fallbackNormalize([section.text, section.excerpt].join(' '));
          let sectionScore = heading.includes(normalized) ? 100 : (body.includes(normalized) ? 45 : 0);
          sectionScore += tokens.reduce(function (total, token) {
            return total + (heading.includes(token) ? 24 : 0) + (body.includes(token) ? 5 : 0);
          }, 0);
          if (!sectionScore) continue;
          sections.push({
            id: section.id,
            heading: section.heading,
            breadcrumb: section.breadcrumb,
            kinds: section.kinds || [],
            score: sectionScore,
            matchType: heading.includes(normalized) || body.includes(normalized) ? 'phrase' : 'exact',
            excerpt: safeString(section.excerpt || section.text || section.heading).slice(0, 240),
            highlightRanges: []
          });
        }
      }
      sections.sort(function (left, right) { return right.score - left.score; });
      if (settings.mode === 'sections' || settings.mode === 'examples' || settings.mode === 'formulas') score = 0;
      if (!score && !sections.length) continue;
      results.push(Object.assign({}, lesson, {
        score: score + (sections[0] ? sections[0].score : 0),
        matchType: title.includes(normalized) ? 'phrase' : 'exact',
        excerpt: sections[0] ? sections[0].excerpt : lesson.description,
        highlightRanges: [],
        totalSectionMatches: sections.length,
        sections: sections.slice(0, Number(settings.sectionsPerLesson) || 12),
        lesson: lesson
      }));
    }
    results.sort(function (left, right) { return right.score - left.score || safeString(left.title).localeCompare(safeString(right.title)); });
    return {
      query: query,
      mode: settings.mode || 'all',
      totalLessons: results.length,
      totalSections: results.reduce(function (total, result) { return total + result.totalSectionMatches; }, 0),
      results: results.slice(0, Number(settings.limit) || 100),
      suggestions: []
    };
  }

  function isProductionAnalyticsAllowed() {
    if (!root.location || !root.navigator) return false;
    const hostname = root.location.hostname.toLowerCase();
    if (hostname !== 'upskillsprint.com' && hostname !== 'www.upskillsprint.com') return false;
    if (root.navigator.globalPrivacyControl === true) return false;
    if (root.navigator.doNotTrack === '1' || root.doNotTrack === '1') return false;
    return typeof root.fetch === 'function';
  }

  function sendAnalytics(payload) {
    if (!isProductionAnalyticsAllowed()) return;
    let body;
    try {
      body = JSON.stringify(payload);
    } catch (_error) {
      return;
    }
    if (body.length > 4000) return;
    try {
      root.fetch(ANALYTICS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        credentials: 'omit',
        cache: 'no-store',
        keepalive: true
      }).catch(function () {});
    } catch (_error) {
      // Search must remain usable if analytics is unavailable.
    }
  }

  function init(configuration) {
    const documentObject = root.document;
    if (!documentObject) return null;
    const input = documentObject.getElementById('lesson-search');
    if (!input) return null;
    if (input.dataset.smartLessonSearch === 'true' && activeInstance) return activeInstance;

    const config = configuration || {};
    const core = config.core || root.LessonSearchCore || null;
    const topicFilter = documentObject.getElementById('topic-filter');
    const levelFilter = documentObject.getElementById('level-filter');
    const interactiveFilter = documentObject.getElementById('interactive-filter');
    const clearButton = documentObject.getElementById('clear-filters');
    const resultsCount = documentObject.getElementById('results-count');
    const noResults = documentObject.getElementById('no-results');
    const filterForm = documentObject.getElementById('lesson-filters') || input.closest('form');
    const library = documentObject.getElementById('lesson-library');
    const featuredSection = documentObject.getElementById('featured-section');

    if (!topicFilter || !levelFilter || !interactiveFilter || !clearButton || !resultsCount || !noResults || !filterForm) return null;
    input.dataset.smartLessonSearch = 'true';
    if (!safeString(input.value)) input.value = searchFromLocationHash(root.location);

    const initialCatalogIndex = createCatalogIndex(documentObject);
    const state = {
      core: core,
      remoteIndex: null,
      index: initialCatalogIndex,
      catalogSignature: catalogSignature(initialCatalogIndex, documentObject.baseURI),
      indexState: 'loading',
      mode: 'all',
      activeSuggestion: -1,
      suggestions: [],
      suppressSuggestions: false,
      currentResponse: null,
      renderTimer: 0,
      analyticsTimer: 0,
      mutationTimer: 0,
      warmHandle: 0,
      warmHandleType: '',
      visibleLimit: INITIAL_RESULT_LIMIT,
      lastSearchSignature: '',
      lastCommittedQuery: '',
      lastCommittedSignature: '',
      destroyed: false
    };

    const ui = setupInterface(documentObject, {
      input: input,
      form: filterForm,
      resultsCount: resultsCount,
      noResults: noResults
    });

    function filterState() {
      return {
        topic: topicFilter.value || '',
        level: levelFilter.value || '',
        interactive: interactiveFilter.checked ? 'interactive' : 'all',
        mode: state.mode
      };
    }

    function searchOptions() {
      const filters = filterState();
      return {
        mode: filters.mode,
        topic: filters.topic,
        level: filters.level,
        interactive: filters.interactive,
        limit: 120,
        sectionsPerLesson: 16,
        excerptLength: 230
      };
    }

    function runSearch(query) {
      cancelWarmIndex();
      if (state.core && typeof state.core.searchIndex === 'function') {
        try {
          return state.core.searchIndex(state.index, query, searchOptions());
        } catch (_error) {
          return fallbackSearch(state.index, query, searchOptions());
        }
      }
      return fallbackSearch(state.index, query, searchOptions());
    }

    function syncCatalogIndex() {
      const catalogIndex = createCatalogIndex(documentObject);
      const signature = catalogSignature(catalogIndex, documentObject.baseURI);
      if (signature === state.catalogSignature) return false;
      state.catalogSignature = signature;
      state.index = mergeIndexes(state.remoteIndex || state.index, catalogIndex, documentObject.baseURI);
      warmIndex();
      return true;
    }

    function warmIndex() {
      if (!state.core || typeof state.core.prepareIndex !== 'function') return;
      cancelWarmIndex();
      const indexToWarm = state.index;
      const prepare = function () {
        state.warmHandle = 0;
        state.warmHandleType = '';
        if (state.destroyed || state.index !== indexToWarm) return;
        try {
          state.core.prepareIndex(indexToWarm);
        } catch (_error) {
          // The unprepared index remains fully searchable.
        }
      };
      if (typeof root.requestIdleCallback === 'function') {
        state.warmHandleType = 'idle';
        state.warmHandle = root.requestIdleCallback(prepare, { timeout: 1500 });
      } else {
        state.warmHandleType = 'timeout';
        state.warmHandle = root.setTimeout(prepare, 0);
      }
    }

    function cancelWarmIndex() {
      if (!state.warmHandle) return;
      if (state.warmHandleType === 'idle' && typeof root.cancelIdleCallback === 'function') {
        root.cancelIdleCallback(state.warmHandle);
      } else {
        root.clearTimeout(state.warmHandle);
      }
      state.warmHandle = 0;
      state.warmHandleType = '';
    }

    function scheduleRender(resetLimit) {
      if (resetLimit !== false) state.visibleLimit = INITIAL_RESULT_LIMIT;
      root.clearTimeout(state.renderTimer);
      state.renderTimer = root.setTimeout(render, SEARCH_DELAY_MS);
    }

    function render() {
      if (state.destroyed) return;
      const query = safeString(input.value).slice(0, 160);
      const signature = [query, topicFilter.value, levelFilter.value, interactiveFilter.checked, state.mode].join('|');
      if (signature !== state.lastSearchSignature) state.visibleLimit = INITIAL_RESULT_LIMIT;
      state.lastSearchSignature = signature;

      if (!query) {
        state.currentResponse = null;
        closeSuggestions();
        renderCatalog();
        cancelAnalyticsCommit();
        return;
      }

      const response = runSearch(query);
      state.currentResponse = response;
      renderSearchResults(response, query);
      renderSuggestions(response, query);
      scheduleAnalyticsCommit(query, response);
    }

    function renderCatalog() {
      ui.results.hidden = true;
      ui.results.setAttribute('aria-busy', 'false');
      if (ui.notice) ui.notice.hidden = true;
      const topic = topicFilter.value;
      const level = levelFilter.value;
      const interactiveOnly = interactiveFilter.checked;
      const detailedFilter = Boolean(level || interactiveOnly);
      const hasAnyFilter = Boolean(topic || detailedFilter);
      let visibleCount = 0;

      const rows = Array.from(documentObject.querySelectorAll('[data-lesson-item]'));
      for (const row of rows) {
        const visible = (!topic || row.dataset.topic === topic) &&
          (!level || row.dataset.level === level) &&
          (!interactiveOnly || row.dataset.interactive === 'true');
        row.hidden = !visible;
        if (visible) visibleCount += 1;
      }

      for (const section of documentObject.querySelectorAll('[data-category-section]')) {
        section.hidden = !Array.from(section.querySelectorAll('[data-lesson-item]')).some(function (row) { return !row.hidden; });
      }
      for (const section of documentObject.querySelectorAll('[data-empty-category]')) {
        section.hidden = detailedFilter || Boolean(topic && section.dataset.topic !== topic);
      }

      const hasVisibleEmptySection = Array.from(documentObject.querySelectorAll('[data-empty-category]')).some(function (section) {
        return !section.hidden;
      });
      if (featuredSection) featuredSection.hidden = hasAnyFilter;
      noResults.hidden = visibleCount > 0 || hasVisibleEmptySection;
      if (!noResults.hidden) renderNoResults('', []);
      resultsCount.textContent = visibleCount + (visibleCount === 1 ? ' lesson' : ' lessons');
    }

    function renderSearchResults(response, query) {
      hideCatalogSections();
      const results = Array.isArray(response && response.results) ? response.results : [];
      const totalLessons = Number(response && response.totalLessons) || results.length;
      const totalSections = Number(response && response.totalSections) || results.reduce(function (total, result) {
        return total + (Number(result.totalSectionMatches) || (Array.isArray(result.sections) ? result.sections.length : 0));
      }, 0);

      ui.results.hidden = false;
      ui.results.setAttribute('aria-busy', 'false');
      ui.resultList.textContent = '';
      ui.resultsTitle.textContent = '';
      ui.resultsTitle.appendChild(documentObject.createTextNode('Matches for '));
      const quote = documentObject.createElement('q');
      quote.textContent = query;
      ui.resultsTitle.appendChild(quote);

      const visibleResults = results.slice(0, state.visibleLimit);
      visibleResults.forEach(function (result, index) {
        ui.resultList.appendChild(createResultCard(result, query, index + 1));
      });

      if (results.length > visibleResults.length) {
        const more = documentObject.createElement('button');
        more.type = 'button';
        more.className = 'lesson-search-load-more';
        more.textContent = 'Show ' + Math.min(RESULT_LIMIT_INCREMENT, results.length - visibleResults.length) + ' more lessons';
        more.addEventListener('click', function () {
          state.visibleLimit += RESULT_LIMIT_INCREMENT;
          renderSearchResults(state.currentResponse, safeString(input.value));
          const nextMore = ui.resultList.querySelector('.lesson-search-load-more');
          if (nextMore) {
            nextMore.focus();
          } else {
            ui.resultsTitle.tabIndex = -1;
            ui.resultsTitle.focus();
          }
        });
        ui.resultList.appendChild(more);
      }

      noResults.hidden = totalLessons > 0;
      if (!totalLessons) renderNoResults(query, response && response.suggestions);
      const shownLessons = visibleResults.length;
      resultsCount.textContent = (shownLessons < totalLessons ?
        'Showing ' + shownLessons + ' of ' + totalLessons + ' lessons' :
        totalLessons + (totalLessons === 1 ? ' lesson' : ' lessons')) +
        (totalSections ? ' · ' + totalSections + (totalSections === 1 ? ' matching section' : ' matching sections') : '');

      if (state.indexState === 'error') {
        ui.notice.hidden = false;
        ui.notice.textContent = 'Lesson-content search is temporarily unavailable. Results currently use lesson titles and summaries.';
      } else {
        ui.notice.hidden = true;
      }
    }

    function createResultCard(result, query, rank) {
      const lesson = result.lesson || result;
      const card = documentObject.createElement('article');
      card.className = 'lesson-search-card';

      const header = documentObject.createElement('div');
      header.className = 'lesson-search-card-header';
      const meta = documentObject.createElement('p');
      meta.className = 'lesson-search-card-meta';
      [TOPIC_LABELS[result.topic || lesson.topic] || titleCase(result.topic || lesson.topic), titleCase(result.level || lesson.level),
        (result.interactive || lesson.interactive) ? 'Interactive' : '', formatMinutes(result.minutes || lesson.minutes)]
        .filter(Boolean).forEach(function (label) {
          const span = documentObject.createElement('span');
          span.textContent = label;
          meta.appendChild(span);
        });
      header.appendChild(meta);

      const title = documentObject.createElement('h3');
      title.className = 'lesson-search-card-title';
      const titleLink = documentObject.createElement('a');
      const sections = Array.isArray(result.sections) ? result.sections : [];
      const bestSection = sections[0];
      titleLink.href = createDeepLink(result.path || lesson.path, bestSection && bestSection.id, query, documentObject.baseURI);
      appendHighlightedText(titleLink, result.title || lesson.title || 'Untitled lesson', query, state.core);
      decorateTrackedLink(titleLink, result, bestSection, rank);
      title.appendChild(titleLink);
      header.appendChild(title);

      const descriptionText = safeString(result.description || lesson.description);
      if (descriptionText) {
        const description = documentObject.createElement('p');
        description.className = 'lesson-search-card-description';
        appendHighlightedText(description, descriptionText, query, state.core);
        header.appendChild(description);
      }
      card.appendChild(header);

      if (sections.length) {
        const list = documentObject.createElement('ol');
        list.className = 'lesson-search-hit-list';
        sections.forEach(function (section, sectionIndex) {
          const item = createSectionHit(result, section, query, rank);
          if (sectionIndex >= INITIAL_SECTION_LIMIT) item.hidden = true;
          list.appendChild(item);
        });
        card.appendChild(list);

        if (sections.length > INITIAL_SECTION_LIMIT) {
          const moreSections = documentObject.createElement('button');
          moreSections.type = 'button';
          moreSections.className = 'lesson-search-more';
          const hiddenCount = sections.length - INITIAL_SECTION_LIMIT;
          const totalMatchCount = Number(result.totalSectionMatches) || sections.length;
          const unavailableCount = Math.max(0, totalMatchCount - sections.length);
          moreSections.textContent = 'Show ' + hiddenCount + ' more matching ' + (hiddenCount === 1 ? 'section' : 'sections') +
            (unavailableCount ? ' (+' + unavailableCount + ' in the lesson)' : '');
          moreSections.setAttribute('aria-expanded', 'false');
          moreSections.addEventListener('click', function () {
            const expanded = moreSections.getAttribute('aria-expanded') === 'true';
            Array.from(list.children).forEach(function (item, itemIndex) {
              if (itemIndex >= INITIAL_SECTION_LIMIT) item.hidden = expanded;
            });
            moreSections.setAttribute('aria-expanded', String(!expanded));
            moreSections.textContent = expanded ?
              'Show ' + hiddenCount + ' more matching ' + (hiddenCount === 1 ? 'section' : 'sections') :
              'Show fewer sections';
          });
          card.appendChild(moreSections);
        }
      }
      return card;
    }

    function createSectionHit(result, section, query, rank) {
      const item = documentObject.createElement('li');
      item.className = 'lesson-search-hit';
      const link = documentObject.createElement('a');
      link.className = 'lesson-search-hit-link';
      link.href = createDeepLink(result.path || (result.lesson && result.lesson.path), section.id, query, documentObject.baseURI);

      const topLine = documentObject.createElement('div');
      topLine.className = 'lesson-search-hit-topline';
      const kind = documentObject.createElement('span');
      kind.className = 'lesson-search-hit-kind';
      kind.textContent = matchLabel(section, false);
      topLine.appendChild(kind);
      const heading = documentObject.createElement('span');
      heading.className = 'lesson-search-hit-heading';
      appendHighlightedText(heading, section.heading || 'Lesson section', query, state.core);
      topLine.appendChild(heading);
      link.appendChild(topLine);

      const breadcrumbText = Array.isArray(section.breadcrumb) ? section.breadcrumb.join(' › ') : safeString(section.breadcrumb);
      if (breadcrumbText && breadcrumbText !== safeString(section.heading)) {
        const breadcrumb = documentObject.createElement('p');
        breadcrumb.className = 'lesson-search-hit-breadcrumb';
        breadcrumb.textContent = breadcrumbText;
        link.appendChild(breadcrumb);
      }

      const excerptText = safeString(section.excerpt || (section.section && section.section.text) || section.heading);
      if (excerptText) {
        const excerpt = documentObject.createElement('p');
        excerpt.className = 'lesson-search-hit-excerpt';
        appendHighlightedText(excerpt, excerptText, section.highlightRanges && section.highlightRanges.length ? section.highlightRanges : query, state.core);
        link.appendChild(excerpt);
      }
      decorateTrackedLink(link, result, section, rank);
      item.appendChild(link);
      return item;
    }

    function decorateTrackedLink(link, result, section, rank) {
      link.dataset.searchResultLink = 'true';
      link.dataset.resultRank = String(rank);
      link.dataset.sectionId = safeString(section && section.id);
      link.dataset.matchType = analyticsMatchType(result, section);
      link.addEventListener('click', function () {
        const query = safeString(input.value).slice(0, 100);
        if (!query) return;
        let targetPath = '/';
        try { targetPath = new URL(link.href, documentObject.baseURI).pathname; } catch (_error) {}
        sendAnalytics({
          event: 'result_selected',
          query: query,
          targetPath: targetPath,
          sectionId: link.dataset.sectionId,
          rank: Number(link.dataset.resultRank) || 1,
          matchType: link.dataset.matchType,
          resultCount: Number(state.currentResponse && state.currentResponse.totalLessons) || 0
        });
      });
    }

    function renderNoResults(query, suggestions) {
      noResults.textContent = '';
      const heading = documentObject.createElement('h2');
      heading.textContent = query ? 'No exact match for “' + query + '”' : 'No matching lessons found';
      noResults.appendChild(heading);
      const copy = documentObject.createElement('p');
      copy.className = 'lesson-search-empty-copy';
      copy.textContent = query ?
        'Try a shorter phrase, another spelling, or search all topics. You can search by a formula, software name, example, or question.' :
        'Try a broader selection or clear one of the filters.';
      noResults.appendChild(copy);

      const values = Array.isArray(suggestions) ? suggestions.filter(Boolean).slice(0, 5) : [];
      const filters = filterState();
      if (values.length || filters.topic || filters.level || filters.interactive !== 'all') {
        const recovery = documentObject.createElement('div');
        recovery.className = 'lesson-search-recovery';
        const label = documentObject.createElement('p');
        label.className = 'lesson-search-recovery-label';
        label.textContent = values.length ? 'Try one of these:' : 'A filter may be hiding a match:';
        recovery.appendChild(label);
        values.forEach(function (suggestion) {
          const button = documentObject.createElement('button');
          button.type = 'button';
          button.textContent = suggestion;
          button.addEventListener('click', function () {
            input.value = suggestion;
            scheduleRender();
            input.focus();
          });
          recovery.appendChild(button);
        });
        if (filters.topic || filters.level || filters.interactive !== 'all') {
          const allTopics = documentObject.createElement('button');
          allTopics.type = 'button';
          allTopics.textContent = 'Search without filters';
          allTopics.addEventListener('click', function () {
            topicFilter.value = '';
            levelFilter.value = '';
            interactiveFilter.checked = false;
            scheduleRender();
            input.focus();
          });
          recovery.appendChild(allTopics);
        }
        noResults.appendChild(recovery);
      }
    }

    function hideCatalogSections() {
      documentObject.querySelectorAll('[data-category-section], [data-empty-category]').forEach(function (section) {
        section.hidden = true;
      });
      if (featuredSection) featuredSection.hidden = true;
    }

    function renderSuggestions(response, query) {
      if (state.suppressSuggestions || documentObject.activeElement !== input || query.length < 2) {
        closeSuggestions();
        return;
      }
      const suggestions = [];
      const seen = new Set();
      const results = Array.isArray(response && response.results) ? response.results : [];
      for (let index = 0; index < results.length && suggestions.length < 6; index += 1) {
        const result = results[index];
        const section = Array.isArray(result.sections) ? result.sections[0] : null;
        const label = safeString(section && section.heading) || safeString(result.title);
        const key = fallbackNormalize(label + '|' + (result.path || ''));
        if (!label || seen.has(key)) continue;
        seen.add(key);
        suggestions.push({
          type: 'result',
          label: label,
          context: section ? safeString(result.title) : (TOPIC_LABELS[result.topic] || titleCase(result.topic)),
          kind: section ? matchLabel(section, false) : 'Lesson',
          href: createDeepLink(result.path, section && section.id, query, documentObject.baseURI),
          result: result,
          section: section,
          rank: index + 1
        });
      }
      if (!suggestions.length && Array.isArray(response && response.suggestions)) {
        for (const value of response.suggestions.slice(0, 5)) {
          const label = safeString(value);
          if (!label || seen.has(fallbackNormalize(label))) continue;
          seen.add(fallbackNormalize(label));
          suggestions.push({ type: 'query', label: label, context: 'Search suggestion', kind: 'Try this' });
        }
      }
      state.suggestions = suggestions;
      state.activeSuggestion = -1;
      input.removeAttribute('aria-activedescendant');
      ui.suggestions.textContent = '';
      if (!suggestions.length) {
        closeSuggestions();
        return;
      }

      ui.suggestions.setAttribute('aria-label', suggestions[0].type === 'result'
        ? 'Likely lesson and section matches'
        : 'Related search suggestions');
      suggestions.forEach(function (suggestion, index) {
        const option = documentObject.createElement('div');
        option.className = 'lesson-search-suggestion';
        option.id = 'lesson-search-suggestion-' + index;
        option.setAttribute('role', 'option');
        option.setAttribute('aria-selected', 'false');
        option.tabIndex = -1;
        option.dataset.suggestionIndex = String(index);
        const copy = documentObject.createElement('span');
        copy.className = 'lesson-search-suggestion-copy';
        const title = documentObject.createElement('span');
        title.className = 'lesson-search-suggestion-title';
        appendHighlightedText(title, suggestion.label, query, state.core);
        copy.appendChild(title);
        const context = documentObject.createElement('span');
        context.className = 'lesson-search-suggestion-context';
        context.textContent = suggestion.context;
        copy.appendChild(context);
        option.appendChild(copy);
        const kind = documentObject.createElement('span');
        kind.className = 'lesson-search-suggestion-kind';
        kind.textContent = suggestion.kind;
        option.appendChild(kind);
        option.addEventListener('mousedown', function (event) { event.preventDefault(); });
        option.addEventListener('click', function () { activateSuggestion(index); });
        ui.suggestions.appendChild(option);
      });
      ui.suggestions.hidden = false;
      markSuggestionsOpen();
      input.setAttribute('aria-expanded', 'true');
      ui.suggestionStatus.textContent = suggestions.length + (suggestions.length === 1 ? ' suggestion available.' : ' suggestions available.') + ' Use the up and down arrow keys to review them.';
    }

    function markSuggestionsOpen() {
      // CSS keeps the list in normal layout flow. This avoids brittle measured
      // offsets and custom-property scope across sibling containers.
      filterForm.classList.add('lesson-search-suggestions-open');
    }

    function closeSuggestions() {
      state.activeSuggestion = -1;
      state.suggestions = [];
      ui.suggestions.hidden = true;
      filterForm.classList.remove('lesson-search-suggestions-open');
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      ui.suggestionStatus.textContent = '';
    }

    function setActiveSuggestion(index) {
      const options = Array.from(ui.suggestions.querySelectorAll('[role="option"]'));
      if (!options.length) return;
      state.activeSuggestion = (index + options.length) % options.length;
      options.forEach(function (option, optionIndex) {
        option.setAttribute('aria-selected', String(optionIndex === state.activeSuggestion));
      });
      const active = options[state.activeSuggestion];
      input.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    }

    function activateSuggestion(index) {
      const suggestion = state.suggestions[index];
      if (!suggestion) return;
      if (suggestion.type === 'query') {
        input.value = suggestion.label;
        closeSuggestions();
        render();
        input.focus();
        return;
      }
      if (suggestion.href) {
        const section = suggestion.section;
        let targetPath = '/';
        try { targetPath = new URL(suggestion.href, documentObject.baseURI).pathname; } catch (_error) {}
        sendAnalytics({
          event: 'result_selected',
          query: safeString(input.value).slice(0, 100),
          targetPath: targetPath,
          sectionId: safeString(section && section.id),
          rank: Number(suggestion.rank) || 1,
          matchType: analyticsMatchType(suggestion.result || {}, section),
          resultCount: Number(state.currentResponse && state.currentResponse.totalLessons) || 0
        });
        root.location.assign(suggestion.href);
      }
    }

    function scheduleAnalyticsCommit(query, response) {
      cancelAnalyticsCommit();
      const safeQuery = safeString(query).slice(0, 100);
      if (safeQuery.length < 2) return;
      const filters = filterState();
      const signature = [safeQuery, filters.topic, filters.level, filters.interactive, filters.mode].join('|');
      if (signature === state.lastCommittedSignature) return;
      state.analyticsTimer = root.setTimeout(function () {
        if (safeString(input.value).slice(0, 100) !== safeQuery) return;
        if (state.lastCommittedQuery && state.lastCommittedQuery !== safeQuery) {
          sendAnalytics({
            event: 'search_reformulated',
            previousQuery: state.lastCommittedQuery,
            query: safeQuery
          });
        }
        sendAnalytics({
          event: 'search_committed',
          query: safeQuery,
          resultCount: Number(response && response.totalLessons) || 0,
          sectionCount: Number(response && response.totalSections) || 0,
          topic: filters.topic,
          level: filters.level,
          interactive: filters.interactive,
          mode: filters.mode
        });
        state.lastCommittedQuery = safeQuery;
        state.lastCommittedSignature = signature;
      }, ANALYTICS_DELAY_MS);
    }

    function cancelAnalyticsCommit() {
      root.clearTimeout(state.analyticsTimer);
      state.analyticsTimer = 0;
    }

    function setMode(mode) {
      if (!MODES.some(function (item) { return item.value === mode; })) return;
      state.mode = mode;
      ui.modeButtons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.dataset.searchMode === mode));
      });
      scheduleRender();
    }

    function onInput() {
      state.suppressSuggestions = false;
      scheduleRender();
    }

    function onFilterChange() {
      state.suppressSuggestions = true;
      closeSuggestions();
      root.clearTimeout(state.renderTimer);
      render();
    }

    function onInputKeydown(event) {
      if (event.key === 'ArrowDown' && !ui.suggestions.hidden) {
        event.preventDefault();
        setActiveSuggestion(state.activeSuggestion + 1);
      } else if (event.key === 'ArrowUp' && !ui.suggestions.hidden) {
        event.preventDefault();
        setActiveSuggestion(state.activeSuggestion < 0 ? state.suggestions.length - 1 : state.activeSuggestion - 1);
      } else if (event.key === 'Enter' && state.activeSuggestion >= 0 && !ui.suggestions.hidden) {
        event.preventDefault();
        activateSuggestion(state.activeSuggestion);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        closeSuggestions();
        root.clearTimeout(state.renderTimer);
        render();
      } else if (event.key === 'Escape' && !ui.suggestions.hidden) {
        event.preventDefault();
        closeSuggestions();
      }
    }

    function onClear(event) {
      if (event) event.preventDefault();
      input.value = '';
      topicFilter.value = '';
      levelFilter.value = '';
      interactiveFilter.checked = false;
      setMode('all');
      render();
      input.focus();
    }

    function onInputFocus() {
      state.suppressSuggestions = false;
      if (safeString(input.value) && state.currentResponse) renderSuggestions(state.currentResponse, safeString(input.value));
    }

    function onInputBlur() {
      root.setTimeout(closeSuggestions, 120);
    }

    function onModeClick(event) {
      state.suppressSuggestions = true;
      closeSuggestions();
      try {
        event.currentTarget.focus({ preventScroll: true });
      } catch (_error) {
        event.currentTarget.focus();
      }
      setMode(event.currentTarget.dataset.searchMode);
    }

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onInputKeydown);
    input.addEventListener('focus', onInputFocus);
    input.addEventListener('blur', onInputBlur);
    topicFilter.addEventListener('change', onFilterChange);
    levelFilter.addEventListener('change', onFilterChange);
    interactiveFilter.addEventListener('change', onFilterChange);
    clearButton.addEventListener('click', onClear, true);
    ui.modeButtons.forEach(function (button) {
      button.addEventListener('click', onModeClick);
    });

    function handleCatalogReady() {
      syncCatalogIndex();
      scheduleRender(false);
    }
    documentObject.addEventListener('upskill:lesson-catalog-ready', handleCatalogReady);
    root.addEventListener('upskill:lesson-catalog-ready', handleCatalogReady);

    let observer = null;
    if (root.MutationObserver && library) {
      observer = new root.MutationObserver(function (records) {
        const addedLesson = records.some(function (record) {
          return Array.from(record.addedNodes).some(function (node) {
            return node.nodeType === 1 && (node.matches('[data-lesson-item]') || node.querySelector('[data-lesson-item]'));
          });
        });
        if (!addedLesson) return;
        root.clearTimeout(state.mutationTimer);
        state.mutationTimer = root.setTimeout(handleCatalogReady, 60);
      });
      observer.observe(library, { childList: true, subtree: true });
    }

    activeInstance = {
      render: render,
      refreshIndex: handleCatalogReady,
      getState: function () {
        return {
          mode: state.mode,
          indexState: state.indexState,
          lessonCount: unpackLessons(state.index).length,
          response: state.currentResponse
        };
      },
      destroy: function () {
        state.destroyed = true;
        cancelAnalyticsCommit();
        root.clearTimeout(state.renderTimer);
        root.clearTimeout(state.mutationTimer);
        cancelWarmIndex();
        if (observer) observer.disconnect();
        input.removeEventListener('input', onInput);
        input.removeEventListener('keydown', onInputKeydown);
        input.removeEventListener('focus', onInputFocus);
        input.removeEventListener('blur', onInputBlur);
        topicFilter.removeEventListener('change', onFilterChange);
        levelFilter.removeEventListener('change', onFilterChange);
        interactiveFilter.removeEventListener('change', onFilterChange);
        clearButton.removeEventListener('click', onClear, true);
        ui.modeButtons.forEach(function (button) {
          button.removeEventListener('click', onModeClick);
        });
        documentObject.removeEventListener('upskill:lesson-catalog-ready', handleCatalogReady);
        root.removeEventListener('upskill:lesson-catalog-ready', handleCatalogReady);
        input.dataset.smartLessonSearch = '';
        activeInstance = null;
      }
    };

    if (safeString(input.value)) render();
    else renderCatalog();
    loadIndex(config.indexUrl || INDEX_URL).then(function (remoteIndex) {
      if (state.destroyed) return;
      state.remoteIndex = remoteIndex;
      state.index = mergeIndexes(remoteIndex, createCatalogIndex(documentObject), documentObject.baseURI);
      state.catalogSignature = catalogSignature(createCatalogIndex(documentObject), documentObject.baseURI);
      state.indexState = 'ready';
      warmIndex();
      render();
    }).catch(function () {
      if (state.destroyed) return;
      state.indexState = 'error';
      syncCatalogIndex();
      warmIndex();
      render();
    });

    return activeInstance;

    function loadIndex(url) {
      if (config.index) return Promise.resolve(config.index);
      if (typeof root.fetch !== 'function') return Promise.reject(new Error('Fetch unavailable'));
      return root.fetch(url, { credentials: 'same-origin', cache: 'no-cache' }).then(function (response) {
        if (!response.ok) throw new Error('Search index request failed with ' + response.status);
        return response.json();
      }).then(function (payload) {
        if (!unpackLessons(payload).length) throw new Error('Search index contains no lessons');
        return payload;
      });
    }
  }

  function setupInterface(documentObject, elements) {
    const input = elements.input;
    const form = elements.form;
    let shell = input.closest('.lesson-search-shell');
    const label = input.closest('label') || (input.parentElement && input.parentElement.querySelector('label[for="' + input.id + '"]'));
    if (!shell) {
      shell = documentObject.createElement('div');
      shell.className = 'lesson-search-shell';
      if (label && label.parentNode) {
        label.parentNode.insertBefore(shell, label);
        shell.appendChild(label);
      } else {
        input.parentNode.insertBefore(shell, input);
        shell.appendChild(input);
      }
    }
    if (label) {
      const labelText = label.querySelector('span');
      if (labelText) labelText.textContent = 'Search lessons and lesson content';
    }

    let suggestions = documentObject.getElementById('lesson-search-suggestions');
    if (!suggestions) {
      suggestions = documentObject.createElement('div');
      suggestions.id = 'lesson-search-suggestions';
      shell.appendChild(suggestions);
    }
    suggestions.classList.add('lesson-search-suggestions');
    suggestions.setAttribute('role', 'listbox');
    suggestions.setAttribute('aria-label', 'Lesson search suggestions');
    suggestions.hidden = true;

    let privacy = documentObject.getElementById('lesson-search-privacy');
    if (!privacy) {
      privacy = documentObject.createElement('p');
      privacy.id = 'lesson-search-privacy';
      privacy.className = 'lesson-search-privacy';
      privacy.appendChild(documentObject.createTextNode('Search terms may be used in privacy-preserving aggregate analytics. Do not enter personal information. '));
      const privacyLink = documentObject.createElement('a');
      privacyLink.href = '/privacy.html#lesson-search-analytics';
      privacyLink.textContent = 'Privacy details';
      privacy.appendChild(privacyLink);
      shell.appendChild(privacy);
    } else if (!privacy.querySelector('a')) {
      privacy.appendChild(documentObject.createTextNode(' '));
      const privacyLink = documentObject.createElement('a');
      privacyLink.href = '/privacy.html#lesson-search-analytics';
      privacyLink.textContent = 'Privacy details';
      privacy.appendChild(privacyLink);
    }

    let suggestionStatus = documentObject.getElementById('lesson-search-suggestion-status');
    if (!suggestionStatus) {
      suggestionStatus = documentObject.createElement('span');
      suggestionStatus.id = 'lesson-search-suggestion-status';
      suggestionStatus.className = 'sr-only';
      suggestionStatus.setAttribute('aria-live', 'polite');
      shell.appendChild(suggestionStatus);
    }

    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-haspopup', 'listbox');
    input.setAttribute('aria-controls', suggestions.id);
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), privacy.id, suggestionStatus.id].filter(Boolean).join(' '));
    input.placeholder = 'Try a phrase, formula, example, or question…';
    input.autocomplete = 'off';
    input.spellcheck = true;
    input.maxLength = 160;

    let modes = documentObject.getElementById('lesson-search-modes');
    if (!modes) {
      modes = documentObject.createElement('div');
      modes.id = 'lesson-search-modes';
      form.insertAdjacentElement('afterend', modes);
    }
    modes.classList.add('lesson-search-modes');
    modes.setAttribute('role', 'group');
    modes.setAttribute('aria-label', 'Search in');
    if (!modes.querySelector('[data-search-mode]')) {
      const modeLabel = documentObject.createElement('span');
      modeLabel.className = 'lesson-search-mode-label';
      modeLabel.textContent = 'Search in:';
      modes.appendChild(modeLabel);
      MODES.forEach(function (mode, index) {
        const button = documentObject.createElement('button');
        button.type = 'button';
        button.className = 'lesson-search-mode';
        button.dataset.searchMode = mode.value;
        button.setAttribute('aria-pressed', String(index === 0));
        button.textContent = mode.label;
        modes.appendChild(button);
      });
    }

    let results = documentObject.getElementById('lesson-search-results');
    if (!results) {
      results = documentObject.createElement('section');
      results.id = 'lesson-search-results';
      const status = elements.resultsCount.closest('.library-status');
      (status || modes).insertAdjacentElement('afterend', results);
    }
    results.classList.add('lesson-search-results');
    results.setAttribute('aria-labelledby', 'lesson-search-results-heading');
    results.hidden = true;

    let resultsTitle = documentObject.getElementById('lesson-search-results-heading');
    let resultsHeader = results.querySelector('.lesson-search-results-header');
    if (!resultsHeader) {
      resultsHeader = documentObject.createElement('div');
      resultsHeader.className = 'lesson-search-results-header';
      const headingCopy = documentObject.createElement('div');
      const kicker = documentObject.createElement('p');
      kicker.className = 'lesson-search-results-kicker';
      kicker.textContent = 'Best matching lessons and sections';
      headingCopy.appendChild(kicker);
      if (!resultsTitle) {
        resultsTitle = documentObject.createElement('h2');
        resultsTitle.id = 'lesson-search-results-heading';
      } else {
        resultsTitle.remove();
      }
      resultsTitle.classList.remove('sr-only');
      resultsTitle.classList.add('lesson-search-results-title');
      headingCopy.appendChild(resultsTitle);
      resultsHeader.appendChild(headingCopy);
      results.insertBefore(resultsHeader, results.firstChild);
    } else if (!resultsTitle) {
      resultsTitle = documentObject.createElement('h2');
      resultsTitle.id = 'lesson-search-results-heading';
      resultsTitle.className = 'lesson-search-results-title';
      resultsHeader.appendChild(resultsTitle);
    }

    let notice = documentObject.getElementById('lesson-search-index-notice');
    if (!notice) {
      notice = documentObject.createElement('p');
      notice.id = 'lesson-search-index-notice';
      notice.className = 'lesson-search-index-notice';
      notice.hidden = true;
      resultsHeader.insertAdjacentElement('afterend', notice);
    }

    let resultList = documentObject.getElementById('lesson-search-result-list');
    if (!resultList) {
      resultList = documentObject.createElement('div');
      resultList.id = 'lesson-search-result-list';
      results.appendChild(resultList);
    }
    resultList.classList.add('lesson-search-results-list');

    return {
      shell: shell,
      suggestions: suggestions,
      suggestionStatus: suggestionStatus,
      modes: modes,
      modeButtons: Array.from(modes.querySelectorAll('[data-search-mode]')),
      results: results,
      resultsTitle: resultsTitle,
      resultList: resultList,
      notice: notice,
      privacy: privacy
    };
  }

  function matchLabel(match, isLesson) {
    const kinds = Array.isArray(match && match.kinds) ? match.kinds.map(function (kind) { return safeString(kind).toLowerCase(); }) : [];
    if (kinds.includes('formula')) return 'Formula';
    if (kinds.includes('example')) return 'Example';
    if (isLesson) return 'Lesson';
    const type = safeString(match && match.matchType).toLowerCase();
    if (type === 'typo') return 'Spelling match';
    if (type === 'semantic') return 'Related concept';
    if (type === 'phrase') return 'Exact phrase';
    return 'Section';
  }

  function analyticsMatchType(result, section) {
    const kinds = Array.isArray(section && section.kinds) ? section.kinds.map(function (kind) {
      return safeString(kind).toLowerCase();
    }) : [];
    if (kinds.includes('formula')) return 'formula';
    if (kinds.includes('example')) return 'example';

    const reasons = []
      .concat(Array.isArray(section && section.reasons) ? section.reasons : [])
      .concat(Array.isArray(result && result.reasons) ? result.reasons : []);
    const allowedFields = ['heading', 'body', 'title', 'keywords', 'description'];
    const reason = reasons.find(function (item) {
      return item && allowedFields.includes(safeString(item.field).toLowerCase());
    });
    if (reason) {
      const field = safeString(reason.field).toLowerCase();
      return field === 'keywords' ? 'keyword' : field;
    }
    if (safeString((section && section.matchType) || result.matchType).toLowerCase() === 'semantic') return 'semantic';
    return section ? 'heading' : 'title';
  }

  function formatMinutes(value) {
    if (value == null || value === '') return '';
    if (typeof value === 'number' || /^\d+$/.test(String(value))) return String(value) + ' min';
    return safeString(value);
  }

  return Object.freeze({
    INDEX_URL: INDEX_URL,
    MODES: Object.freeze(MODES.map(function (mode) { return Object.freeze(Object.assign({}, mode)); })),
    init: init,
    canonicalPath: canonicalPath,
    createDeepLink: createDeepLink,
    searchFromLocationHash: searchFromLocationHash,
    appendHighlightedText: appendHighlightedText,
    createCatalogIndex: createCatalogIndex,
    mergeIndexes: mergeIndexes,
    fallbackSearch: fallbackSearch,
    isProductionAnalyticsAllowed: isProductionAnalyticsAllowed
  });
}));
