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

  /* A payload's primary nav is a snapshot of the menu from the day it was
     compressed, so it goes stale whenever site-nav.js changes (old tab names,
     missing exams, the retired contact address). site-nav.js is the single
     source of menu content: redraw every primary nav in the payload from it,
     keeping the payload's current tab. */
  function refreshPrimaryNav(lesson) {
    var api = window.USSNav;
    if (!api || typeof api.markup !== 'function') return;
    lesson.querySelectorAll('nav.desktop-nav, nav.mobile-nav').forEach(function (nav) {
      var kind = nav.classList.contains('mobile-nav') ? 'mobile' : 'desktop';
      var current = nav.querySelector('[data-nav-tab][aria-current="page"]');
      nav.setAttribute('data-nav-root', kind);
      nav.setAttribute('aria-label', 'Main');
      nav.innerHTML = api.markup(kind, current ? current.getAttribute('data-nav-tab') : '');
    });
  }

  /* site-nav.js is deferred on the loader page, so it may not have run yet
     when the payload arrives. Wait for it (deferred scripts finish before
     DOMContentLoaded), but never hold the lesson back for long. */
  function siteNavReady() {
    if (window.USSNav || document.readyState === 'complete' || !document.querySelector('script[src*="site-nav.js"]')) {
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
      window.addEventListener('load', resolve, { once: true });
    });
  }

  function carryMetadata(html) {
    var lesson = new DOMParser().parseFromString(html, 'text/html');
    refreshPrimaryNav(lesson);
    var selector = 'title, meta[name="description"], link[rel~="canonical"], meta[property^="og:"], meta[name^="twitter:"]';
    // The public loader owns the SEO tags; older payloads must not override them.
    lesson.head.querySelectorAll(selector).forEach(function (tag) { tag.remove(); });
    document.head.querySelectorAll(selector).forEach(function (tag) {
      lesson.head.appendChild(lesson.importNode(tag, true));
    });
    // Structured data: the wrapper's JSON-LD is authoritative when present;
    // otherwise any payload-only graphs are kept as they are.
    var ld = 'script[type="application/ld+json"]';
    var wrapperLd = document.head.querySelectorAll(ld);
    if (wrapperLd.length) {
      lesson.querySelectorAll(ld).forEach(function (tag) { tag.remove(); });
      wrapperLd.forEach(function (tag) {
        lesson.head.appendChild(lesson.importNode(tag, true));
      });
    }
    return '<!DOCTYPE html>\n' + lesson.documentElement.outerHTML;
  }

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
    return Promise.race([Promise.all(resources.map(preload).concat(siteNavReady())), timeout]).then(function () {
      html = carryMetadata(html);
      // Read the theme before document.open() removes the current <html>.
      var lessonHtml = carryTheme(html);
      document.open();
      document.write(lessonHtml);
      document.close();
    });
  };
}());
