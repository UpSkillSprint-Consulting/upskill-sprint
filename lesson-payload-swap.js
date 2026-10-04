/*
 * Shared helper for lessons that ship as a compressed payload and replace the
 * loader page with document.write() (issue #6).
 *
 * document.open() wipes the loader immediately, but the written lesson cannot
 * paint until its render-blocking stylesheets and head scripts have loaded.
 * In between, the browser shows an empty white page, even in dark mode. This
 * helper warms the cache for those resources while the loader is still on
 * screen and carries the current theme and page background into the written
 * document, so the swap goes straight from the loader to the lesson.
 */
(function () {
  'use strict';

  var PRELOAD_TIMEOUT_MS = 4000;

  function blockingResources(html) {
    var head = html.split(/<\/head>/i)[0];
    var items = [];
    head.replace(/<link\b[^>]*>/gi, function (tag) {
      var href = tag.match(/\bhref=["']([^"']+)["']/i);
      if (href && /\brel=["']stylesheet["']/i.test(tag)) items.push({ href: href[1], as: 'style' });
      return tag;
    });
    head.replace(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi, function (tag, src) {
      if (!/\b(async|defer)\b/i.test(tag) && !/type=["']module["']/i.test(tag)) items.push({ href: src, as: 'script' });
      return tag;
    });
    return items;
  }

  function preload(item) {
    return new Promise(function (resolve) {
      var link = document.createElement('link');
      link.rel = 'preload';
      link.as = item.as;
      link.href = item.href;
      link.onload = link.onerror = resolve;
      document.head.appendChild(link);
    });
  }

  function carryTheme(html) {
    var theme = document.documentElement && document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    return html
      .replace(/<html\b([^>]*)>/i, function (tag, attrs) {
        return /\bdata-theme=/i.test(attrs) ? tag : '<html' + attrs + ' data-theme="' + theme + '">';
      })
      .replace(/<head\b[^>]*>/i, function (tag) {
        return tag + '<style id="lesson-swap-background">html{background:#ffffff}html[data-theme="dark"]{background:#0b1220}</style>';
      });
  }

  window.upskillWriteLessonDocument = function (html) {
    var resources = blockingResources(html);
    var timeout = new Promise(function (resolve) { setTimeout(resolve, PRELOAD_TIMEOUT_MS); });
    return Promise.race([Promise.all(resources.map(preload)), timeout]).then(function () {
      // Read the theme before document.open() removes the current <html>.
      var lessonHtml = carryTheme(html);
      document.open();
      document.write(lessonHtml);
      document.close();
    });
  };
}());
