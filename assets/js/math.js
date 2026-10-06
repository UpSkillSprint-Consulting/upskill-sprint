/*
 * Shared math renderer for UpSkill Sprint lessons.
 * Standard: docs/LESSON_CREATION_GUIDE.md section 22.
 *
 * Usage (in <head>, once per page, no other MathJax/KaTeX script on the page):
 *   <script defer src="/assets/js/math.js"></script>
 *
 * Write inline math as \( ... \) and display math as \[ ... \].
 * Dollar signs are never treated as math, so prices like $40 are safe.
 *
 * - MathJax is pinned to one version and loaded with Subresource Integrity.
 *   To upgrade: change VERSION, download the new es5/tex-svg.js, recompute
 *   the hash (openssl dgst -sha384 -binary tex-svg.js | openssl base64 -A),
 *   and update INTEGRITY and tests/shared-math-include.test.js together.
 * - SVG output draws with currentColor, so equations follow the page text
 *   colour in light and dark mode.
 * - Assistive MathML stays on: every equation carries hidden MathML for
 *   screen readers, and the MathJax menu (right-click / long-press) offers
 *   speech and the expression explorer.
 * - Content added after load: call window.UpskillMath.typeset([element]).
 */
(function () {
  'use strict';

  if (window.UpskillMath) return;

  var VERSION = '3.2.2';
  var SRC = 'https://cdn.jsdelivr.net/npm/mathjax@' + VERSION + '/es5/tex-svg.js';
  var INTEGRITY = 'sha384-KKWa9jJ1MZvssLeOoXG6FiOAZfAgmzsIIfw8BXwI9+kYm0lPCbC6yTQPBC00F1/L';

  if (window.MathJax && document.getElementById('MathJax-script')) {
    // A page-level MathJax is already set up; leave it alone.
    return;
  }

  var resolveReady;
  var rejectReady;
  var ready = new Promise(function (resolve, reject) {
    resolveReady = resolve;
    rejectReady = reject;
  });
  ready.catch(function (error) {
    if (window.console) window.console.warn('[UpskillMath]', error && error.message ? error.message : error);
  });

  window.MathJax = {
    tex: {
      inlineMath: [['\\(', '\\)']],
      displayMath: [['\\[', '\\]']],
      processEscapes: true
    },
    svg: {
      fontCache: 'global'
    },
    options: {
      menuOptions: {
        settings: {
          assistiveMml: true
        }
      }
    },
    startup: {
      ready: function () {
        window.MathJax.startup.defaultReady();
        window.MathJax.startup.promise.then(function () {
          resolveReady(window.MathJax);
        }, rejectReady);
      }
    }
  };

  window.UpskillMath = {
    version: VERSION,
    ready: ready,
    typeset: function (elements) {
      return ready.then(function (MathJax) {
        if (elements && typeof MathJax.typesetClear === 'function') MathJax.typesetClear(elements);
        return MathJax.typesetPromise(elements);
      });
    }
  };

  var script = document.createElement('script');
  script.id = 'MathJax-script';
  script.src = SRC;
  script.setAttribute('integrity', INTEGRITY);
  script.setAttribute('crossorigin', 'anonymous');
  script.setAttribute('referrerpolicy', 'no-referrer');
  script.async = true;
  script.onerror = function () {
    rejectReady(new Error('MathJax ' + VERSION + ' failed to load'));
  };
  (document.head || document.documentElement).appendChild(script);
})();
