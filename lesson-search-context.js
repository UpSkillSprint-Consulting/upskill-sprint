(function (root, factory) {
  'use strict';

  var api = factory(root);

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.LessonSearchContext = api;
    api.init();
  }
}(typeof window !== 'undefined' ? window : null, function (root) {
  'use strict';

  var GENERATED_ID_ATTRIBUTE = 'data-lesson-search-generated-id';
  var TARGET_ATTRIBUTE = 'data-lesson-search-target';
  var HIGHLIGHT_ATTRIBUTE = 'data-lesson-search-highlight';
  var BANNER_ID = 'lesson-search-context';
  var STYLE_ID = 'lesson-search-context-styles';
  var HEADING_SELECTOR = 'h1, h2, h3, h4';
  var SKIP_HIGHLIGHT_SELECTOR = [
    'script', 'style', 'noscript', 'template', 'svg', 'math',
    'code', 'pre', 'kbd', 'samp', 'form', 'input', 'textarea',
    'select', 'option', 'button', '.MathJax', 'mjx-container',
    '[class*="mathjax" i]', '[id*="mathjax" i]',
    '.quiz', '.quiz-section', '#quiz', '[id*="quiz" i]',
    '[class*="quiz" i]', '[data-search-exclude]', '[aria-hidden="true"]',
    '[' + HIGHLIGHT_ATTRIBUTE + ']'
  ].join(',');
  var STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'do', 'does',
    'for', 'from', 'how', 'i', 'in', 'is', 'it', 'of', 'on', 'or', 'the',
    'this', 'to', 'use', 'what', 'when', 'where', 'which', 'with', 'you'
  ]);

  function normalizeHeadingSlug(value) {
    var text = String(value == null ? '' : value).trim();

    if (typeof text.normalize === 'function') {
      text = text.normalize('NFKD');
    }

    text = text
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' and ')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return text || 'section';
  }

  function headingElements(scope) {
    if (!scope || typeof scope.querySelectorAll !== 'function') return [];
    var headings = Array.prototype.slice.call(scope.querySelectorAll(HEADING_SELECTOR));
    if (scope.nodeType === 1 && typeof scope.matches === 'function' && scope.matches(HEADING_SELECTOR)) {
      headings.unshift(scope);
    }
    return headings;
  }

  /**
   * Assign stable, human-readable anchors to lesson headings.
   *
   * Author-provided IDs are always preserved. Generated IDs are recalculated in
   * document order so an asynchronously inserted lesson produces the same IDs as
   * the build-time search index. Duplicate heading names receive -2, -3, and so on.
   */
  function assignHeadingIds(scope) {
    if (!scope) return [];

    var doc = scope.nodeType === 9 ? scope : scope.ownerDocument;
    if (!doc || typeof doc.querySelectorAll !== 'function') return [];

    var headings = headingElements(scope);
    var generatedHeadings = new Set(headings.filter(function (heading) {
      return heading.getAttribute(GENERATED_ID_ATTRIBUTE) === 'true';
    }));
    var usedIds = new Set();

    Array.prototype.forEach.call(doc.querySelectorAll('[id]'), function (element) {
      if (!generatedHeadings.has(element) && element.id) usedIds.add(element.id);
    });

    var assignments = [];
    headings.forEach(function (heading) {
      var wasGenerated = generatedHeadings.has(heading);
      if (heading.id && !wasGenerated) {
        usedIds.add(heading.id);
        return;
      }

      var base = 'lesson-section-' + normalizeHeadingSlug(heading.textContent);
      var candidate = base;
      var suffix = 2;

      while (usedIds.has(candidate)) {
        candidate = base + '-' + suffix;
        suffix += 1;
      }

      heading.id = candidate;
      heading.setAttribute(GENERATED_ID_ATTRIBUTE, 'true');
      usedIds.add(candidate);
      assignments.push({ element: heading, id: candidate });
    });

    return assignments;
  }

  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch (error) {
      return value;
    }
  }

  function parseHash(hash) {
    var raw = String(hash || '').replace(/^#/, '');
    if (!raw) return { section: '', search: '', from: '', parameterized: false };

    var parameterized = /(?:^|&)(?:section|search|from)=/.test(raw);
    if (!parameterized) {
      return {
        section: safeDecode(raw).slice(0, 240),
        search: '',
        from: '',
        parameterized: false
      };
    }

    var params = new URLSearchParams(raw);
    return {
      section: String(params.get('section') || '').trim().slice(0, 240),
      search: String(params.get('search') || '').trim().slice(0, 160),
      from: String(params.get('from') || '').trim().slice(0, 40),
      parameterized: true
    };
  }

  function lessonRoot(doc) {
    return doc.getElementById('lesson-content') ||
      doc.querySelector('main[data-lesson-page], [data-lesson-page] main, main, article') ||
      doc.body;
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightTerms(query) {
    var cleaned = String(query || '').trim().replace(/\s+/g, ' ');
    if (!cleaned) return [];

    var candidates = [];
    if (cleaned.length <= 80 && cleaned.indexOf(' ') !== -1) candidates.push(cleaned);

    cleaned.split(/\s+/).forEach(function (part) {
      var term = part.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9./+\-]+$/g, '');
      if (!term || term.length > 48) return;
      if (term.length < 2 && !/\d/.test(term)) return;
      if (STOP_WORDS.has(term.toLowerCase())) return;
      candidates.push(term);
    });

    var seen = new Set();
    return candidates
      .filter(function (term) {
        var key = term.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort(function (left, right) { return right.length - left.length; })
      .slice(0, 12);
  }

  function clearHighlights(doc) {
    Array.prototype.forEach.call(doc.querySelectorAll('[' + HIGHLIGHT_ATTRIBUTE + ']'), function (mark) {
      var parent = mark.parentNode;
      if (!parent) return;
      parent.replaceChild(doc.createTextNode(mark.textContent || ''), mark);
      if (typeof parent.normalize === 'function') parent.normalize();
    });
  }

  function nearestHighlightScope(target) {
    if (!target || target.nodeType !== 1) return target;
    return target.closest('[data-search-section], .formula-card, .lesson-card, section, article') ||
      target.parentElement || target;
  }

  function isSkippedTextNode(node, boundary) {
    var parent = node.parentElement;
    if (!parent || !node.nodeValue || !node.nodeValue.trim()) return true;
    var skipped = parent.closest(SKIP_HIGHLIGHT_SELECTOR);
    return Boolean(skipped);
  }

  function highlightQuery(doc, target, query) {
    clearHighlights(doc);

    var terms = highlightTerms(query);
    if (!terms.length || !target) return 0;

    var boundary = nearestHighlightScope(target);
    if (!boundary || typeof doc.createTreeWalker !== 'function') return 0;
    if (boundary.matches && boundary.matches(SKIP_HIGHLIGHT_SELECTOR)) return 0;

    var expression;
    try {
      expression = new RegExp(terms.map(escapeRegExp).join('|'), 'giu');
    } catch (error) {
      expression = new RegExp(terms.map(escapeRegExp).join('|'), 'gi');
    }

    var walker = doc.createTreeWalker(
      boundary,
      root && root.NodeFilter ? root.NodeFilter.SHOW_TEXT : 4,
      null
    );
    var nodes = [];
    var current;

    while ((current = walker.nextNode()) && nodes.length < 4000) {
      if (!isSkippedTextNode(current, boundary)) nodes.push(current);
    }

    var matchCount = 0;
    nodes.some(function (node) {
      if (matchCount >= 40) return true;

      expression.lastIndex = 0;
      var text = node.nodeValue;
      var match;
      var lastIndex = 0;
      var fragment = null;

      while ((match = expression.exec(text)) && matchCount < 40) {
        if (!fragment) fragment = doc.createDocumentFragment();
        if (match.index > lastIndex) fragment.appendChild(doc.createTextNode(text.slice(lastIndex, match.index)));

        var mark = doc.createElement('mark');
        mark.setAttribute(HIGHLIGHT_ATTRIBUTE, 'true');
        mark.textContent = match[0];
        fragment.appendChild(mark);
        matchCount += 1;
        lastIndex = match.index + match[0].length;

        if (match[0].length === 0) expression.lastIndex += 1;
      }

      if (fragment) {
        if (lastIndex < text.length) fragment.appendChild(doc.createTextNode(text.slice(lastIndex)));
        node.parentNode.replaceChild(fragment, node);
      }

      return matchCount >= 40;
    });

    return matchCount;
  }

  function ensureStyles(doc) {
    if (doc.getElementById(STYLE_ID)) return;

    var style = doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '#' + BANNER_ID + '{display:flex;align-items:center;justify-content:space-between;gap:16px;' +
      'width:min(1120px,calc(100% - 32px));margin:18px auto;padding:12px 14px;border:1px solid var(--line,#cbd5e1);' +
      'border-left:4px solid var(--teal,#0f766e);border-radius:10px;background:var(--card,#fff);' +
      'color:var(--ink,#172033);font:600 13px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
      'box-shadow:0 4px 16px rgba(15,23,42,.08)}' +
      '#' + BANNER_ID + ' p{margin:0;color:inherit}' +
      '#' + BANNER_ID + ' a{flex:0 0 auto;color:var(--teal,#0f766e);font-weight:750;text-decoration:underline;' +
      'text-underline-offset:3px}' +
      '[' + TARGET_ATTRIBUTE + ']{scroll-margin-top:96px}' +
      '[' + TARGET_ATTRIBUTE + ']:focus{outline:3px solid var(--teal,#0f766e);' +
      'outline-offset:6px;border-radius:3px}' +
      'mark[' + HIGHLIGHT_ATTRIBUTE + ']{padding:.04em .14em;border-radius:.2em;background:#fde68a;color:#3f2d00;' +
      'box-decoration-break:clone;-webkit-box-decoration-break:clone}' +
      '@media(max-width:640px){#' + BANNER_ID + '{align-items:flex-start;flex-direction:column;gap:8px;width:calc(100% - 24px);' +
      'margin:12px auto;padding:11px 12px}}' +
      '@media(prefers-reduced-motion:reduce){[' + TARGET_ATTRIBUTE + ']{scroll-behavior:auto}}';

    (doc.head || doc.documentElement).appendChild(style);
  }

  function backToResultsHref(context) {
    if (!context.search) return '/lessons';
    return '/lessons#search=' + encodeURIComponent(context.search);
  }

  function ensureBanner(doc, context, target) {
    var shouldShow = context.parameterized && (
      context.from === 'lesson-search' || Boolean(context.search) || Boolean(context.section)
    );
    var existing = doc.getElementById(BANNER_ID);

    if (!shouldShow) {
      if (existing) existing.remove();
      return null;
    }

    var banner = existing || doc.createElement('aside');
    banner.id = BANNER_ID;
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Lesson search match');

    if (!existing) {
      var message = doc.createElement('p');
      message.setAttribute('aria-live', 'polite');
      banner.appendChild(message);

      var link = doc.createElement('a');
      link.textContent = 'Back to search results';
      link.addEventListener('click', function (event) {
        try {
          var referrer = doc.referrer ? new URL(doc.referrer, root.location.href) : null;
          if (referrer && referrer.origin === root.location.origin && /\/lessons(?:\.html)?\/?$/.test(referrer.pathname) && root.history.length > 1) {
            event.preventDefault();
            root.history.back();
          }
        } catch (error) {
          // The ordinary link remains a complete, safe fallback.
        }
      });
      banner.appendChild(link);
    }

    var label = target && String(target.textContent || '').replace(/\s+/g, ' ').trim();
    var messageNode = banner.querySelector('p');
    var messageText;
    if (context.search) {
      messageText = label
        ? 'Showing “' + label.slice(0, 100) + '” for your search: “' + context.search + '”.'
        : 'Showing the closest section for your search: “' + context.search + '”.';
    } else {
      messageText = label
        ? 'Opened the lesson section “' + label.slice(0, 120) + '”.'
        : 'Opened a section from lesson search.';
    }

    banner.querySelector('a').href = backToResultsHref(context);

    if (!existing) {
      var main = lessonRoot(doc);
      if (main && main.parentNode) main.parentNode.insertBefore(banner, main);
      else doc.body.insertBefore(banner, doc.body.firstChild);
      root.setTimeout(function () {
        messageNode.textContent = messageText;
      }, 0);
    } else {
      messageNode.textContent = messageText;
    }

    return banner;
  }

  /**
   * Make a deep-linked heading visible before it is focused.
   *
   * Ordinary URL fragments open a parent <details> automatically in modern
   * browsers, but lesson search uses a parameterized hash so it can preserve
   * the query and return link. Lessons also use several tab and reveal-panel
   * patterns. The event and data attribute below provide a stable contract for
   * future custom widgets, while the generic fallbacks cover existing lessons.
   *
   * Custom widgets may either:
   *   - listen for `upskill:lesson-search-reveal`, or
   *   - put `data-search-reveal-control="#button-id"` on a hidden ancestor.
   */
  function revealTarget(doc, target) {
    if (!doc || !target) return;

    if (root && typeof root.CustomEvent === 'function') {
      target.dispatchEvent(new root.CustomEvent('upskill:lesson-search-reveal', {
        bubbles: true,
        detail: { target: target, sectionId: target.id || '' }
      }));
    }

    var ancestors = [];
    var current = target.parentElement;
    while (current && current !== doc.documentElement) {
      ancestors.push(current);
      current = current.parentElement;
    }
    ancestors.reverse();

    ancestors.forEach(function (ancestor) {
      if (ancestor.tagName === 'DETAILS') ancestor.open = true;

      var controls = [];
      var declaredControl = ancestor.getAttribute('data-search-reveal-control');
      if (declaredControl) {
        try {
          var declared = doc.querySelector(declaredControl);
          if (declared) controls.push(declared);
        } catch (error) {
          var declaredById = doc.getElementById(declaredControl.replace(/^#/, ''));
          if (declaredById) controls.push(declaredById);
        }
      }

      if (ancestor.id) {
        Array.prototype.forEach.call(doc.querySelectorAll('[aria-controls]'), function (control) {
          if (control.getAttribute('aria-controls') === ancestor.id) controls.push(control);
        });
      }

      var chartKey = ancestor.getAttribute('data-chart-detail');
      if (chartKey) {
        Array.prototype.forEach.call(doc.querySelectorAll('[data-open-chart]'), function (control) {
          if (control.getAttribute('data-open-chart') === chartKey) controls.push(control);
        });
      }

      var seenControls = new Set();
      controls.forEach(function (control) {
        if (seenControls.has(control)) return;
        seenControls.add(control);
        if (control.getAttribute('role') === 'tab') {
          var tablist = control.closest('[role="tablist"]');
          if (tablist) {
            Array.prototype.forEach.call(tablist.querySelectorAll('[role="tab"]'), function (tab) {
              tab.setAttribute('aria-selected', tab === control ? 'true' : 'false');
              tab.setAttribute('tabindex', tab === control ? '0' : '-1');
            });
          }
        }
        if (control.hasAttribute('aria-expanded')) control.setAttribute('aria-expanded', 'true');
        if (typeof control.click === 'function') control.click();
      });

      if (ancestor.hasAttribute('hidden')) ancestor.hidden = false;
      if (ancestor.getAttribute('aria-hidden') === 'true') ancestor.setAttribute('aria-hidden', 'false');
      if (ancestor.classList.contains('hidden')) ancestor.classList.remove('hidden');
      if (ancestor.getAttribute('role') === 'tabpanel') ancestor.classList.add('active');
      if (ancestor.style && ancestor.style.display === 'none') ancestor.style.removeProperty('display');

      if (root && typeof root.getComputedStyle === 'function' &&
          root.getComputedStyle(ancestor).display === 'none') {
        ancestor.style.setProperty('display', 'block');
      }
    });
  }

  function focusAndScroll(target) {
    if (!target) return;

    target.setAttribute(TARGET_ATTRIBUTE, 'true');
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.setAttribute('data-lesson-search-added-tabindex', 'true');
    }

    var reduceMotion = root && typeof root.matchMedia === 'function' &&
      root.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof target.scrollIntoView === 'function') {
      try {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      } catch (error) {
        target.scrollIntoView();
      }
    }

    if (typeof target.focus === 'function') {
      try {
        target.focus({ preventScroll: true });
      } catch (error) {
        target.focus();
      }
    }
  }

  function clearPreviousTarget(doc) {
    Array.prototype.forEach.call(doc.querySelectorAll('[' + TARGET_ATTRIBUTE + ']'), function (target) {
      target.removeAttribute(TARGET_ATTRIBUTE);
      if (target.getAttribute('data-lesson-search-added-tabindex') === 'true') {
        target.removeAttribute('tabindex');
        target.removeAttribute('data-lesson-search-added-tabindex');
      }
    });
  }

  function init() {
    if (!root || !root.document) return null;

    var doc = root.document;
    var state = root.__upskillLessonSearchContextState || {
      handledSignature: '',
      scheduled: false,
      observer: null,
      observing: false
    };
    root.__upskillLessonSearchContextState = state;

    function signature(context) {
      return [context.section, context.search, context.from, context.parameterized ? 'params' : 'raw'].join('|');
    }

    function stopObserving() {
      if (state.observer) state.observer.disconnect();
      state.observing = false;
    }

    function observeUntilResolved() {
      if (state.observing || typeof root.MutationObserver !== 'function') return;
      if (!state.observer) state.observer = new root.MutationObserver(schedule);
      state.observer.observe(doc, { childList: true, subtree: true });
      state.observing = true;
    }

    function process() {
      state.scheduled = false;
      if (!doc.defaultView || !doc.documentElement) return false;
      var contentRoot = lessonRoot(doc);
      if (!contentRoot) return false;

      var context = parseHash(root.location.hash);
      if (!context.section) {
        stopObserving();
        return false;
      }

      assignHeadingIds(contentRoot);
      ensureStyles(doc);

      var target = doc.getElementById(context.section);
      if (!target) {
        observeUntilResolved();
        return false;
      }

      // Dynamic lesson content has arrived. Stop observing before highlighting
      // and banners mutate the DOM, and avoid rescanning interactive lessons for
      // the remainder of the visit.
      stopObserving();

      var currentSignature = signature(context);
      if (state.handledSignature === currentSignature && target.hasAttribute(TARGET_ATTRIBUTE)) return true;

      clearPreviousTarget(doc);
      // Mark the target before highlighting mutates the DOM. This prevents the
      // observer from reprocessing the same hash while animation frames are
      // waiting to perform the visual scroll.
      target.setAttribute(TARGET_ATTRIBUTE, 'true');
      revealTarget(doc, target);
      clearHighlights(doc);
      highlightQuery(doc, target, context.search);
      ensureBanner(doc, context, target);
      state.handledSignature = currentSignature;

      var scheduleFrame = typeof root.requestAnimationFrame === 'function'
        ? root.requestAnimationFrame.bind(root)
        : function (callback) { return root.setTimeout(callback, 0); };
      scheduleFrame(function () {
        scheduleFrame(function () { focusAndScroll(target); });
      });

      return true;
    }

    function schedule() {
      if (state.scheduled) return;
      state.scheduled = true;
      if (root.Promise && typeof root.Promise.resolve === 'function') {
        root.Promise.resolve().then(process);
      } else {
        root.setTimeout(process, 0);
      }
    }

    if (!state.hashListenerInstalled) {
      root.addEventListener('hashchange', function () {
        stopObserving();
        state.handledSignature = '';
        clearPreviousTarget(doc);
        clearHighlights(doc);
        var banner = doc.getElementById(BANNER_ID);
        if (banner) banner.remove();
        schedule();
      });
      state.hashListenerInstalled = true;
    }

    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', schedule, { once: true });
    }
    schedule();
    return state;
  }

  function destroy() {
    if (!root) return;
    var state = root.__upskillLessonSearchContextState;
    if (state && state.observer) state.observer.disconnect();
    if (state) state.observing = false;
  }

  return {
    GENERATED_ID_ATTRIBUTE: GENERATED_ID_ATTRIBUTE,
    assignHeadingIds: assignHeadingIds,
    clearHighlights: clearHighlights,
    destroy: destroy,
    highlightQuery: highlightQuery,
    highlightTerms: highlightTerms,
    init: init,
    normalizeHeadingSlug: normalizeHeadingSlug,
    parseHash: parseHash,
    revealTarget: revealTarget
  };
}));
