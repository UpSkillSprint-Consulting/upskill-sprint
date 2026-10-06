(function () {
  'use strict';

  const TOOLS_PATH = '/engineering-tools.html';
  const EXAM_PRACTICE_PATH = '/exam-practice';
  const MATERIAL_CHECKER_PATH = '/tools/material-specification-compliance-checker.html';
  const CALCULATOR_PATH = '/tools/engineering-statistics-calculator.html';
  const UNIT_CONVERTER_PATH = '/tools/unit-converter.html';
  const ARROW_CLEANUP_PATH = '/arrow-cleanup.js';
  const CHI_SQUARE_LIBRARY_PATH = '/chi-square-lesson-library.js';
  const LESSON_SEARCH_CONTEXT_PATH = '/lesson-search-context.js';

  function loadArrowCleanup() {
    if (document.querySelector('script[src="' + ARROW_CLEANUP_PATH + '"]')) return;
    const script = document.createElement('script');
    script.src = ARROW_CLEANUP_PATH;
    script.defer = true;
    document.head.appendChild(script);
  }

  function loadChiSquareLessonLibrary() {
    if (!isLessonsPage() || document.querySelector('script[src="' + CHI_SQUARE_LIBRARY_PATH + '"]')) return;
    const script = document.createElement('script');
    script.src = CHI_SQUARE_LIBRARY_PATH;
    document.head.appendChild(script);
  }

  function loadLessonSearchContext() {
    if (!isLessonDetailPage() || document.querySelector('script[src="' + LESSON_SEARCH_CONTEXT_PATH + '"]')) return;
    const script = document.createElement('script');
    script.src = LESSON_SEARCH_CONTEXT_PATH;
    script.defer = true;
    document.head.appendChild(script);
  }

  function loadAuthScripts() {
    const AUTH_SCRIPTS = ['/supabase-config.js', '/vendor/supabase.js', '/auth.js', '/profile.js', '/auth-forms.js', '/progress.js', '/access-control.js', '/require-auth.js'];
    AUTH_SCRIPTS.forEach(function (path) {
      if (document.querySelector('script[src="' + path + '"]')) return;
      const script = document.createElement('script');
      script.src = path;
      script.async = false; /* preserve execution order */
      document.head.appendChild(script);
    });
  }

  function installArrowCleanupWriteHook() {
    if (Document.prototype.__upskillArrowCleanupWriteHookInstalled) return;

    const nativeWrite = Document.prototype.write;
    Document.prototype.write = function () {
      const chunks = Array.prototype.slice.call(arguments);

      if (
        chunks.length === 1 &&
        typeof chunks[0] === 'string' &&
        chunks[0].includes('</body>') &&
        !chunks[0].includes(ARROW_CLEANUP_PATH)
      ) {
        chunks[0] = chunks[0].replace(
          '</body>',
          '<script src="' + ARROW_CLEANUP_PATH + '"><\/script></body>'
        );
      }

      return nativeWrite.apply(this, chunks);
    };

    Document.prototype.__upskillArrowCleanupWriteHookInstalled = true;
  }

  function pathEndsWith(path) {
    return window.location.pathname === path || window.location.pathname.endsWith(path);
  }

  function isEngineeringToolsPage() {
    return pathEndsWith(TOOLS_PATH) || pathEndsWith('/engineering-tools');
  }

  function isLessonsPage() {
    const path = window.location.pathname.replace(/\/+$/, '');
    return path.endsWith('/lessons.html') || path.endsWith('/lessons');
  }

  function redirectLegacyExamPractice() {
    if (!isLessonsPage() || window.location.hash !== '#exam-practice') return false;
    window.location.replace(EXAM_PRACTICE_PATH + window.location.search);
    return true;
  }

  function openLinkedCertification() {
    const path = window.location.pathname.replace(/\/+$/, '').replace(/\.html$/i, '');
    if (!path.endsWith('/test-bank')) return;
    const exam = (new URLSearchParams(window.location.search).get('exam') || '').trim().toLowerCase();
    if (!exam) return;
    // Use the delivered catalog so future certifications inherit deep links.
    // Opening a certification shows its overview; starting an attempt remains
    // the learner's explicit action through the normal exam controls.
    const tile = Array.from(document.querySelectorAll('.tb-tile[data-exam]')).find(function (item) {
      return item.dataset.exam.toLowerCase() === exam;
    });
    if (tile && !tile.classList.contains('active')) tile.click();
  }

  function isLessonDetailPage() {
    const path = window.location.pathname.replace(/\.html$/i, '').replace(/\/+$/, '');
    return path.startsWith('/lessons/') && path !== '/lessons';
  }

  function isHomePage() {
    const path = window.location.pathname;
    return path === '/' || path.endsWith('/index.html');
  }

  function createToolsLink(currentPage) {
    const link = document.createElement('a');
    link.href = TOOLS_PATH;
    link.textContent = 'Engineering Tools';
    if (currentPage) link.setAttribute('aria-current', 'page');
    return link;
  }

  function insertAfter(reference, node) {
    if (reference && reference.parentNode) {
      reference.parentNode.insertBefore(node, reference.nextSibling);
    }
  }

  function addToolsLinkToNav(nav) {
    if (!nav || nav.querySelector('a[href*="engineering-tools.html"], a[href="/engineering-tools"]')) return;
    const lessonLink = Array.from(nav.querySelectorAll('a')).find(function (link) {
      return link.textContent.trim() === 'Lessons';
    });
    const toolsLink = createToolsLink(isEngineeringToolsPage());
    if (lessonLink) insertAfter(lessonLink, toolsLink);
    else nav.appendChild(toolsLink);
  }

  function addToolsLinkToFooter() {
    const heading = Array.from(document.querySelectorAll('footer h4, footer .footer-heading')).find(function (item) {
      return item.textContent.trim().toLowerCase() === 'quick links';
    });
    if (!heading) return;

    const column = heading.parentElement;
    if (!column || column.querySelector('a[href*="engineering-tools.html"], a[href="/engineering-tools"]')) return;
    const lessonLink = Array.from(column.querySelectorAll('a')).find(function (link) {
      return link.textContent.trim() === 'Lessons';
    });
    const toolsLink = createToolsLink(false);
    if (lessonLink) insertAfter(lessonLink, toolsLink);
    else column.appendChild(toolsLink);
  }

  /* ------------------------------------------------------------------
     Shared site chrome: one primary navigation and one footer.
     Every public page loads this file, so the header links and the
     footer are normalised here instead of in each page's markup.
     Pages that must stay minimal (printable certificate, admin gate,
     Netlify form stub) opt out with <body data-site-chrome="minimal">.
     Pages shown inside an iframe never get extra chrome.
     ------------------------------------------------------------------ */
  const SITE_NAV_LINKS = [
    ['Start Here', '/start-here'],
    ['Lessons', '/lessons'],
    ['Exam Practice & Quizzes', EXAM_PRACTICE_PATH],
    ['Engineering Tools', TOOLS_PATH],
    ['Services', '/services'],
    ['Request a Topic', '/request-topic'],
    ['About', '/about'],
    ['FAQ', '/faq'],
    ['Contact', '/contact']
  ];
  const FOOTER_TOPIC_LINKS = [
    ['Data Analytics', '/lessons#data-analytics'],
    ['Quality Engineering', '/lessons#quality-engineering'],
    ['Lean Six Sigma', '/lessons#lean-six-sigma'],
    ['Statistics', '/lessons#statistics'],
    ['Power BI, Excel & SQL', '/lessons#power-bi-excel-sql'],
    ['Project Management', '/lessons#project-management'],
    ['Business Decision-Making', '/lessons#business-decision-making'],
    ['AI for Work', '/lessons#ai-for-work']
  ];
  const FOOTER_QUICK_LINKS = [['Home', '/']].concat(SITE_NAV_LINKS);
  const SITE_CHROME_STYLE_ID = 'uss-site-chrome-styles';
  const MENU_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';

  function isFramed() {
    try { return window.self !== window.top; } catch (error) { return true; }
  }

  function siteChromeDisabled() {
    return !document.body || isFramed() || document.body.getAttribute('data-site-chrome') === 'minimal';
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function currentNavLabel() {
    const path = window.location.pathname.replace(/\.html$/i, '').replace(/\/index$/i, '/').replace(/\/+$/, '') || '/';
    if (path === '/test-bank' || path.startsWith('/test-bank/')) return 'Exam Practice & Quizzes';
    if (path === '/lessons' || path.startsWith('/lessons/') || path.startsWith('/lesson/')) return 'Lessons';
    if (path === '/engineering-tools' || path.startsWith('/engineering-tools/') || path.startsWith('/tools/')) return 'Engineering Tools';
    const match = SITE_NAV_LINKS.find(function (item) { return item[1].replace(/\.html$/i, '') === path; });
    return match ? match[0] : '';
  }

  function linkLabel(link) {
    return link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function navLinksMarkup() {
    const current = currentNavLabel();
    return SITE_NAV_LINKS.map(function (item) {
      return '<a href="' + item[1] + '"' + (item[0] === current ? ' aria-current="page"' : '') + '>' + escapeHtml(item[0]) + '</a>';
    }).join('');
  }

  /* Add any primary link a page's own nav is missing, in the shared order. */
  function normalizeSiteNav(nav) {
    if (!nav) return;
    const existing = Array.from(nav.querySelectorAll('a'));
    let previous = null;
    SITE_NAV_LINKS.forEach(function (item) {
      let link = existing.find(function (candidate) { return linkLabel(candidate) === item[0].toLowerCase(); });
      if (!link && item[1] === TOOLS_PATH) {
        link = existing.find(function (candidate) { return /engineering-tools(\.html)?$/.test(candidate.getAttribute('href') || ''); });
      }
      if (!link) {
        link = item[1] === TOOLS_PATH ? createToolsLink(isEngineeringToolsPage()) : document.createElement('a');
        if (item[1] !== TOOLS_PATH) {
          link.href = item[1];
          link.textContent = item[0];
          if (currentNavLabel() === item[0]) link.setAttribute('aria-current', 'page');
        }
        if (previous) insertAfter(previous, link);
        else nav.insertBefore(link, nav.firstChild);
      }
      previous = link;
    });
  }

  function hasThemeToggle() {
    return !!document.querySelector('[data-theme-toggle], #theme-toggle, .theme-toggle, .themebtn');
  }

  function themeToggleMarkup() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return '<button type="button" class="theme-toggle" data-theme-toggle="true" role="switch" aria-checked="' + dark + '" aria-label="' +
      (dark ? 'Switch to light mode' : 'Switch to dark mode') + '" title="' + (dark ? 'Switch to light mode' : 'Switch to dark mode') +
      '"><span class="sr-only">Toggle dark and light mode</span></button>';
  }

  /* After the shared chrome is in place, a page's own page-level <header> or
     <footer> (a tool title bar, a lesson's back-link strip) would be a second
     banner/contentinfo landmark. Keep the element, drop the duplicate role. */
  function demoteDuplicateLandmarks(tagName) {
    Array.from(document.querySelectorAll(tagName + ':not(.site)')).forEach(function (element) {
      if (element.hasAttribute('role')) return;
      if (element.parentElement && element.parentElement.closest('article, aside, main, nav, section, [role="main"], [role="region"], [role="article"], [role="complementary"], [role="navigation"]')) return;
      element.setAttribute('role', 'none');
    });
  }

  /* Pages with no site header at all get the shared one (not sticky, so it
     never fights a page's own sticky toolbar). */
  function ensureSiteHeader() {
    if (siteChromeDisabled()) return;
    const header = document.querySelector('header.site');
    if (header) {
      // A site header without primary navigation (only a back link) gets the shared nav.
      if (!header.querySelector('nav.desktop-nav')) {
        const nav = document.createElement('nav');
        nav.className = 'desktop-nav uss-injected-nav';
        nav.setAttribute('aria-label', 'Primary navigation');
        nav.innerHTML = navLinksMarkup();
        const brand = header.querySelector('.brand-stack, .brand, .brand-link');
        const anchor = brand && brand.parentElement === header ? brand : null;
        if (anchor) insertAfter(anchor, nav);
        else header.insertBefore(nav, header.firstChild);
      }
      return;
    }

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'uss-mnav-check';
    toggle.className = 'mnav-check uss-mnav-check';
    toggle.setAttribute('aria-hidden', 'true');

    const siteHeader = document.createElement('header');
    siteHeader.className = 'site uss-site-chrome uss-site-header';
    siteHeader.innerHTML =
      '<a class="brand" href="/"><img src="/assets/logo-icon.png" alt="UpSkill Sprint Consulting logo"><span>UpSkill Sprint Consulting</span></a>' +
      '<nav class="desktop-nav" aria-label="Primary navigation">' + navLinksMarkup() + '</nav>' +
      '<div class="header-actions">' + (hasThemeToggle() ? '' : themeToggleMarkup()) +
      '<label for="uss-mnav-check" class="mobile-menu-btn">' + MENU_ICON + '</label></div>';

    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav uss-site-chrome uss-mobile-nav';
    mobileNav.setAttribute('aria-label', 'Primary navigation (mobile)');
    mobileNav.innerHTML = navLinksMarkup();

    const first = document.body.firstChild;
    document.body.insertBefore(mobileNav, first);
    document.body.insertBefore(siteHeader, mobileNav);
    document.body.insertBefore(toggle, siteHeader);
    demoteDuplicateLandmarks('header');
    ensureSiteChromeStyles();
  }

  function footerColumn(title, links) {
    return '<div><h2 class="footer-heading">' + escapeHtml(title) + '</h2>' + links.map(function (item) {
      return '<a href="' + item[1] + '">' + escapeHtml(item[0]) + '</a>';
    }).join('') + '</div>';
  }

  function siteFooterMarkup() {
    return '<div class="uss-footer-wrap"><div class="footer-grid">' +
      '<div><div class="brand"><img src="/assets/logo-icon.png" alt="UpSkill Sprint Consulting logo"><span>UpSkill Sprint Consulting</span></div>' +
      '<p class="footer-tagline">Practical learning for quality, data, process improvement, and business problem-solving.</p></div>' +
      footerColumn('Quick Links', FOOTER_QUICK_LINKS) +
      footerColumn('Topics', FOOTER_TOPIC_LINKS) +
      '<div><h2 class="footer-heading">Contact</h2><a href="mailto:skillsprintconsulting@gmail.com">skillsprintconsulting@gmail.com</a><p>Saskatchewan, Canada</p></div>' +
      '</div></div>' +
      '<div class="footer-bottom"><span>&copy; ' + new Date().getFullYear() + ' UpSkill Sprint Consulting</span>' +
      '<div><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Use</a></div></div>';
  }

  /* One footer everywhere: existing site footers are rebuilt from the shared
     markup, and pages without one get it appended. */
  function ensureSiteFooter() {
    if (siteChromeDisabled()) return;
    let footers = Array.from(document.querySelectorAll('footer.site'));
    if (!footers.length) {
      const footer = document.createElement('footer');
      footer.className = 'site';
      document.body.appendChild(footer);
      footers = [footer];
    }
    footers.forEach(function (footer) {
      if (footer.getAttribute('data-uss-footer') === 'shared') return;
      footer.classList.add('uss-site-chrome', 'uss-site-footer');
      footer.setAttribute('data-uss-footer', 'shared');
      footer.innerHTML = siteFooterMarkup();
    });
    demoteDuplicateLandmarks('footer');
    ensureSiteChromeStyles();
  }

  /* Self-contained styles so the shared chrome looks the same on pages that
     do not load /style.css (tools, starter kit, Excel sprint introduction). */
  function ensureSiteChromeStyles() {
    if (document.getElementById(SITE_CHROME_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = SITE_CHROME_STYLE_ID;
    style.textContent = `
      .uss-site-chrome { --uss-ink: #101828; --uss-line: #e3e7ee; --uss-card: #ffffff; --uss-teal: #0e7490; --uss-teal-dark: #0a5a70; --uss-navy: #0f2a43; --uss-pad: 56px; box-sizing: border-box; font-family: 'Work Sans', Arial, sans-serif; line-height: 1.5; }
      html[data-theme="dark"] .uss-site-chrome { --uss-ink: #f4f7fb; --uss-line: #2b3b50; --uss-card: #111c2d; --uss-teal: #2bb7c9; --uss-teal-dark: #67d4df; --uss-navy: #102a43; }
      .uss-site-chrome *, .uss-site-chrome *::before, .uss-site-chrome *::after { box-sizing: border-box; }
      .uss-site-chrome a { text-decoration: none; }
      .uss-mnav-check { display: none !important; }

      header.site.uss-site-header { position: relative; top: auto; z-index: 20; width: 100%; max-width: none; align-self: stretch; grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 0; padding: 18px 20px; border: 0; border-bottom: 1px solid var(--uss-line); border-radius: 0; background: rgba(255,255,255,0.94); box-shadow: none; color: var(--uss-ink); text-align: left; }
      html[data-theme="dark"] header.site.uss-site-header { background: rgba(11,18,32,0.94); }
      .uss-site-header .brand { display: flex; align-items: center; gap: 10px; min-width: 0; color: var(--uss-ink); }
      .uss-site-chrome .brand img { display: block; height: 32px; width: auto; margin: 0; }
      .uss-site-chrome .brand span { font-family: 'Source Serif 4', Georgia, serif; font-size: 17px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .uss-site-header nav.desktop-nav { display: flex; gap: 18px; margin: 0; padding: 0; font-size: 13.5px; font-weight: 600; white-space: nowrap; background: none; border: 0; }
      .uss-site-header nav.desktop-nav a { padding: 6px 2px; border-bottom: 2px solid transparent; color: var(--uss-ink); }
      .uss-site-header nav.desktop-nav a:hover, .uss-site-header nav.desktop-nav a[aria-current="page"] { border-bottom-color: var(--uss-teal); color: var(--uss-teal-dark); }
      .uss-site-header .header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; flex-shrink: 0; }
      .uss-site-header label.mobile-menu-btn { display: none; align-items: center; justify-content: center; width: 36px; height: 36px; border: 1px solid #cfd4dc; border-radius: 4px; background: var(--uss-card); color: var(--uss-ink); cursor: pointer; flex-shrink: 0; }
      html[data-theme="dark"] .uss-site-header label.mobile-menu-btn { border-color: var(--uss-line); }
      nav.mobile-nav.uss-mobile-nav { display: none; width: 100%; grid-column: 1 / -1; flex-direction: column; margin: 0; padding: 0; border-bottom: 1px solid var(--uss-line); background: var(--uss-card); }
      nav.mobile-nav.uss-mobile-nav a { padding: 14px 20px; font-size: 14.5px; font-weight: 600; border-bottom: 1px solid var(--uss-line); color: var(--uss-ink); }
      header.site nav.uss-injected-nav { display: flex; gap: 18px; font-size: 13.5px; font-weight: 600; white-space: nowrap; }
      header.site nav.uss-injected-nav a { padding: 6px 2px; border-bottom: 2px solid transparent; color: var(--ink, #101828); text-decoration: none; }
      header.site nav.uss-injected-nav a:hover, header.site nav.uss-injected-nav a[aria-current="page"] { border-bottom-color: var(--teal, #0e7490); color: var(--teal-dark, #0a5a70); }
      /* With the shared nav present on wide screens, the header's own back link is redundant. */
      @media (min-width: 1441px) { header.site:has(nav.uss-injected-nav) .back-link { display: none; } }
      @media (max-width: 1440px) {
        header.site nav.desktop-nav { display: none; }
        header.site label.mobile-menu-btn { display: flex; }
        .uss-mnav-check:checked ~ nav.mobile-nav.uss-mobile-nav { display: flex; }
      }
      @media (max-width: 760px) { header.site.uss-site-header { padding: 14px 16px; } }
      @media (max-width: 640px) { .uss-site-chrome .brand span { font-size: 15px; } }
      @media (max-width: 560px) { .uss-site-header .brand span { display: none; } }

      footer.site.uss-site-footer { display: block; width: 100%; max-width: none; flex: none; align-self: stretch; grid-column: 1 / -1; margin: 0; padding: 56px 0 32px; border: 0; border-top: 1px solid var(--uss-line); border-radius: 0; background: var(--uss-navy); box-shadow: none; color: #cbd5e1; font-size: 16px; text-align: left; }
      .uss-site-footer .uss-footer-wrap { display: block; width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 var(--uss-pad); }
      .uss-site-footer .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 40px; }
      .uss-site-footer .brand { display: flex; align-items: center; gap: 10px; margin: 0 0 14px; color: #ffffff; }
      .uss-site-footer .brand span { color: #ffffff; }
      .uss-site-footer .footer-tagline { max-width: 260px; margin: 0; font-size: 13.5px; line-height: 1.6; color: #cbd5e1; }
      .uss-site-footer .footer-grid p { margin: 0; font-size: 13.5px; color: #cbd5e1; }
      .uss-site-footer .footer-heading { display: block; margin: 0 0 12px; padding: 0; border: 0; font-family: inherit; font-size: 12.5px; font-weight: 700; line-height: inherit; letter-spacing: 0.06em; text-transform: uppercase; color: #ffffff; background: none; }
      .uss-site-footer .footer-heading::before, .uss-site-footer .footer-heading::after { content: none; }
      .uss-site-footer .footer-grid a { display: block; margin: 0 0 8px; font-size: 13.5px; color: #cbd5e1; border: 0; }
      .uss-site-footer .footer-grid a:hover, .uss-site-footer .footer-bottom a:hover { color: #ffffff; }
      .uss-site-footer .footer-bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; max-width: 1120px; margin: 32px auto 0; padding: 20px var(--uss-pad) 0; border-top: 1px solid rgba(255,255,255,0.15); font-size: 12.5px; color: #94a3b8; }
      .uss-site-footer .footer-bottom a { display: inline; margin: 0 0 0 16px; color: #94a3b8; }
      @media (max-width: 900px) { .uss-site-chrome { --uss-pad: 32px; } .uss-site-footer .footer-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 640px) { .uss-site-chrome { --uss-pad: 20px; } .uss-site-footer .footer-grid { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(style);
  }

  /* Mobile menu: every header uses a CSS checkbox toggle (input.mnav-check + label.mobile-menu-btn).
     aria-label is not allowed on a <label> without a role (axe aria-prohibited-attr), and the
     checkbox is display:none and aria-hidden, so keyboard and screen-reader users could not open
     the menu. The static markup stays as it is (lesson tests lock the guide's header block).
     At runtime, the label loses aria-label and is hidden from assistive technology as a
     pointer-only duplicate, and a real <button aria-expanded> is added next to it inside the
     header. The button is visually hidden. While it has focus, the hamburger icon shows the
     focus ring. It drives the same checkbox, so the CSS menu works unchanged. It only exists
     for assistive technology while the mobile button is on screen. Escape closes the menu. */
  const MENU_STYLE_ID = 'uss-mobile-menu-a11y';
  const menuControls = [];

  function ensureMenuStyles() {
    if (document.getElementById(MENU_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = MENU_STYLE_ID;
    style.textContent =
      'button.uss-menu-toggle { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }' +
      'button.uss-menu-toggle[hidden] { display: none; }' +
      'label.mobile-menu-btn.uss-menu-focus { outline: 3px solid #0e7490; outline-offset: 2px; }' +
      'html[data-theme="dark"] label.mobile-menu-btn.uss-menu-focus { outline-color: #7dd3fc; }';
    document.head.appendChild(style);
  }

  function menuNavFor(box) {
    let node = box.nextElementSibling;
    while (node) {
      if (node.matches && node.matches('nav.mobile-nav')) return node;
      node = node.nextElementSibling;
    }
    return null;
  }

  function syncMobileMenuControls() {
    menuControls.forEach(function (control) {
      const shown = control.label.getClientRects().length > 0 && window.getComputedStyle(control.label).visibility !== 'hidden';
      if (!shown && document.activeElement === control.button) control.button.blur();
      control.button.hidden = !shown;
      control.button.setAttribute('aria-expanded', control.box.checked ? 'true' : 'false');
    });
  }

  function enhanceMobileMenuButtons() {
    if (!document.body) return;
    ensureMenuStyles();
    let added = false;
    document.querySelectorAll('label.mobile-menu-btn').forEach(function (label) {
      if (label.getAttribute('data-uss-menu') === 'enhanced') return;
      label.setAttribute('data-uss-menu', 'enhanced');
      const name = (label.getAttribute('aria-label') || '').trim() || 'Open menu';
      label.removeAttribute('aria-label');
      const box = label.htmlFor ? document.getElementById(label.htmlFor) : null;
      if (!box || box.type !== 'checkbox') return;
      label.setAttribute('aria-hidden', 'true');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'uss-menu-toggle';
      button.textContent = name;
      button.setAttribute('aria-expanded', box.checked ? 'true' : 'false');
      const nav = menuNavFor(box);
      if (nav && nav.id) button.setAttribute('aria-controls', nav.id);
      label.parentNode.insertBefore(button, label);
      const control = { label: label, box: box, button: button };
      button.addEventListener('click', function () {
        box.checked = !box.checked;
        box.dispatchEvent(new Event('change', { bubbles: true }));
      });
      button.addEventListener('focus', function () { label.classList.add('uss-menu-focus'); });
      button.addEventListener('blur', function () { label.classList.remove('uss-menu-focus'); });
      box.addEventListener('change', syncMobileMenuControls);
      menuControls.push(control);
      added = true;
    });
    if (!added) return;
    syncMobileMenuControls();
    if (!window.__ussMobileMenuListeners) {
      window.__ussMobileMenuListeners = true;
      let frame = 0;
      window.addEventListener('resize', function () {
        if (frame) return;
        frame = window.requestAnimationFrame(function () { frame = 0; syncMobileMenuControls(); });
      });
      document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        menuControls.forEach(function (control) {
          if (!control.box.checked) return;
          control.box.checked = false;
          control.box.dispatchEvent(new Event('change', { bubbles: true }));
          if (!control.button.hidden) control.button.focus();
        });
      });
    }
  }

  function ensureNavigation() {
    ensureSiteHeader();
    document.querySelectorAll('header.site nav.desktop-nav, nav.mobile-nav').forEach(normalizeSiteNav);
    document.querySelectorAll('nav.desktop-nav, nav.mobile-nav').forEach(addToolsLinkToNav);
    ensureSiteFooter();
    addToolsLinkToFooter();
    const examBreadcrumb = currentNavLabel() === 'Exam Practice & Quizzes' && document.querySelector('.tb-crumb a');
    if (examBreadcrumb) {
      examBreadcrumb.href = EXAM_PRACTICE_PATH;
      examBreadcrumb.textContent = 'Exam Practice & Quizzes';
    }
    enhanceMobileMenuButtons();
  }

  function buildHomeToolsSection() {
    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'engineering-tools-preview';
    section.innerHTML = `
      <div class="wrap">
        <p class="eyebrow">Engineering tools</p>
        <h2 style="font-size:28px;margin:0 0 12px;max-width:700px;">Calculators, converters, and technical checkers.</h2>
        <p style="font-size:15.5px;line-height:1.7;color:var(--muted);margin:0 0 32px;max-width:760px;">Practical tools for materials, quality, engineering calculations, statistics, and unit conversion.</p>
        <div class="grid-3">
          <a href="${MATERIAL_CHECKER_PATH}" class="card" style="color:var(--ink);">
            <div class="icon-badge badge-teal"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.92,4h-1.87V2.69c0-0.3-0.24-0.54-0.54-0.54H6.09c-0.3,0-0.54,0.24-0.54,0.54V4H3.67C3,4,2.46,4.54,2.46,5.21v15.42 c0,0.67,0.55,1.22,1.22,1.22h9.25c0.67,0,1.22-0.55,1.22-1.22V5.21C14.14,4.54,13.59,4,12.92,4z M11.43,6.16 c0.07-0.11,0.1-0.24,0.09-0.36h0.44c0.21,0,0.38,0.17,0.38,0.38v13.5c0,0.21-0.17,0.38-0.38,0.38H4.64 c-0.21,0-0.38-0.17-0.38-0.38V6.18c0-0.21,0.17-0.38,0.38-0.38h0.44C5.06,5.92,5.09,6.05,5.17,6.16c0.11,0.16,0.29,0.25,0.48,0.25 h5.31C11.14,6.41,11.32,6.32,11.43,6.16z M10.95,5.85H5.64L5.63,5.83l0.26-0.65h4.81l0.26,0.65l0.26-0.1L10.95,5.85z M10.49,2.71 v1.91H6.11V2.71H10.49z M13.57,20.64c0,0.36-0.29,0.66-0.66,0.66H3.67c-0.36,0-0.66-0.29-0.66-0.66V5.21 c0-0.36,0.29-0.66,0.66-0.66h1.86L5.26,5.23H4.64c-0.52,0-0.95,0.42-0.95,0.95v13.5c0,0.52,0.42,0.95,0.95,0.95h7.32 c0.52,0,0.95-0.42,0.95-0.95V6.18c0-0.52-0.42-0.95-0.95-0.95h-0.63l-0.27-0.67h1.86c0.36,0,0.66,0.29,0.66,0.66V20.64z"/><circle cx="8.3" cy="3.66" r="0.31"/><path d="M5.61,9.41C5.67,9.46,5.74,9.5,5.82,9.5c0,0,0.01,0,0.01,0c0.07,0,0.15-0.03,0.2-0.08l1.24-1.24 c0.11-0.11,0.11-0.29,0-0.4c-0.11-0.11-0.29-0.11-0.4,0L5.84,8.81L5.42,8.34c-0.1-0.12-0.28-0.13-0.4-0.02 C4.91,8.42,4.89,8.59,5,8.71L5.61,9.41z"/><path d="M8.02,7.98c0,0.16,0.13,0.28,0.28,0.28h3.09c0.16,0,0.28-0.13,0.28-0.28S11.54,7.7,11.38,7.7H8.3 C8.14,7.7,8.02,7.83,8.02,7.98z"/><path d="M11.38,8.94H8.3c-0.16,0-0.28,0.13-0.28,0.28S8.14,9.5,8.3,9.5h3.09c0.16,0,0.28-0.13,0.28-0.28S11.54,8.94,11.38,8.94z" /><path d="M5.61,13.11c0.05,0.06,0.12,0.09,0.2,0.09c0,0,0.01,0,0.01,0c0.07,0,0.15-0.03,0.2-0.08l1.24-1.24 c0.11-0.11,0.11-0.29,0-0.4c-0.11-0.11-0.29-0.11-0.4,0l-1.02,1.02l-0.42-0.47c-0.1-0.12-0.28-0.13-0.4-0.02 c-0.12,0.1-0.13,0.28-0.02,0.4L5.61,13.11z"/><path d="M11.38,11.41H8.3c-0.16,0-0.28,0.13-0.28,0.28s0.13,0.28,0.28,0.28h3.09c0.16,0,0.28-0.13,0.28-0.28 S11.54,11.41,11.38,11.41z"/><path d="M11.38,12.65H8.3c-0.16,0-0.28,0.13-0.28,0.28s0.13,0.28,0.28,0.28h3.09c0.16,0,0.28-0.13,0.28-0.28 S11.54,12.65,11.38,12.65z"/><path d="M6.95,15.2c-0.11-0.11-0.29-0.11-0.4,0l-0.42,0.42L5.72,15.2c-0.11-0.11-0.29-0.11-0.4,0s-0.11,0.29,0,0.4l0.42,0.42 l-0.42,0.42c-0.11,0.11-0.11,0.29,0,0.4c0.05,0.05,0.13,0.08,0.2,0.08s0.14-0.03,0.2-0.08l0.42-0.42l0.42,0.42 c0.05,0.05,0.13,0.08,0.2,0.08s0.14-0.03,0.2-0.08c0.11-0.11,0.11-0.29,0-0.4l-0.42-0.42l0.42-0.42 C7.06,15.49,7.06,15.31,6.95,15.2z"/><path d="M11.38,15.12H8.3c-0.16,0-0.28,0.13-0.28,0.28s0.13,0.28,0.28,0.28h3.09c0.16,0,0.28-0.13,0.28-0.28 S11.54,15.12,11.38,15.12z"/><path d="M11.38,16.35H8.3c-0.16,0-0.28,0.13-0.28,0.28s0.13,0.28,0.28,0.28h3.09c0.16,0,0.28-0.13,0.28-0.28 S11.54,16.35,11.38,16.35z"/><path d="M8.3,18.2H5.27c-0.16,0-0.28,0.13-0.28,0.28s0.13,0.28,0.28,0.28H8.3c0.16,0,0.28-0.13,0.28-0.28S8.45,18.2,8.3,18.2z"/><path d="M11.38,18.2h-1.24c-0.16,0-0.28,0.13-0.28,0.28s0.13,0.28,0.28,0.28h1.24c0.16,0,0.28-0.13,0.28-0.28 S11.54,18.2,11.38,18.2z"/><path d="M21.44,7.06c-0.12-0.2-0.3-0.36-0.51-0.45l0.02-0.09c0.08-0.29-0.09-0.58-0.38-0.66l-1.29-0.35 c-0.14-0.04-0.29-0.02-0.41,0.05c-0.13,0.07-0.21,0.19-0.25,0.33l-2.97,11.09l0,0l-0.1,0.38l-0.07,0.26v0c0,0,0,0,0,0l-0.07,0.25 c-0.01,0.03-0.01,0.06-0.01,0.09l0.11,2.52c0.01,0.2,0.14,0.37,0.34,0.42c0.04,0.01,0.08,0.02,0.12,0.02 c0.15,0,0.3-0.08,0.38-0.21l1.36-2.13c0.02-0.02,0.03-0.05,0.03-0.08l0.14-0.51l1.25-4.65c0.08,0.09,0.18,0.15,0.3,0.18l0.02,0 l0.32-1.19l-0.02,0c-0.12-0.03-0.24-0.03-0.35,0.01l1.39-5.17c0.07,0.04,0.13,0.1,0.17,0.18c0.07,0.12,0.09,0.26,0.05,0.4 l-1.55,5.79l0.54,0.15l1.55-5.79C21.62,7.61,21.58,7.31,21.44,7.06z M19.15,6.07L20.4,6.4l-0.97,3.63L18.18,9.7L19.15,6.07z M17.44,17.47l-0.05,0.19l-0.12,0.44l-1.25-0.33l0.11-0.43l1.9-7.08l1.25,0.33L17.44,17.47L17.44,17.47z M16.05,20.13l-0.08-1.8 l1.05,0.28L16.05,20.13z"/></svg></div>
            <p style="font-size:11.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin:0 0 10px;">Administrator</p>
            <h3 style="font-size:17px;margin:0 0 10px;">Material Specification Compliance Checker</h3>
            <p style="font-size:14px;color:var(--muted);margin:0 0 16px;">Compare chemistry and mechanical test results against selected CSA or ASTM requirements.</p>
            <span style="font-size:13.5px;font-weight:600;">Administrator access</span>
          </a>
          <a href="${CALCULATOR_PATH}" class="card" style="color:var(--ink);">
            <div class="icon-badge badge-navy"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.91,8.17h-3.18V3.28c0-1.03-0.76-1.88-1.7-1.88H7.11c-0.36,0-0.7,0.13-0.97,0.35L1.76,5.45 C1.53,5.64,1.36,5.89,1.28,6.17c0,0.01,0,0.01,0,0.02C1.24,6.32,1.22,6.46,1.22,6.6v14.12c0,1.03,0.76,1.88,1.7,1.88h14.01 c0.99,0,1.8-0.81,1.8-1.8v-2.01h3.18c0.48,0,0.87-0.39,0.87-0.87V9.04C22.78,8.56,22.39,8.17,21.91,8.17z M17.19,18.23v-1.95h2.23 v1.95H17.19z M14.4,13.76h2.23v1.95H14.4V13.76z M14.4,13.2v-1.95h2.23v1.95H14.4z M14.4,16.27h2.23v1.95h-1.92 c-0.17,0-0.31-0.14-0.31-0.31V16.27z M19.43,15.71h-2.23v-1.95h2.23V15.71z M17.19,13.2v-1.95h2.23v1.95H17.19z M19.99,11.25h2.23 v1.95h-2.23V11.25z M22.22,9.04v1.65H14.4V9.04c0-0.17,0.14-0.31,0.31-0.31h7.2C22.08,8.73,22.22,8.87,22.22,9.04z M2.12,5.88 L6,2.61v2.92c0,0.24-0.19,0.43-0.43,0.43H2.03C2.06,5.93,2.09,5.9,2.12,5.88z M3.69,11.17c0.1,0.05,0.21,0.04,0.3-0.03l0.64-0.49 l0.3,0.21l-0.27,0.76c-0.04,0.11-0.01,0.23,0.07,0.3c0.34,0.34,0.62,0.73,0.84,1.17c0.05,0.1,0.15,0.16,0.26,0.16l0.82-0.02 l0.11,0.35l-0.67,0.46c-0.09,0.06-0.14,0.17-0.12,0.28c0.04,0.26,0.06,0.5,0.06,0.72S6,15.49,5.96,15.75 c-0.02,0.11,0.03,0.22,0.12,0.28l0.67,0.46l-0.11,0.35l-0.82-0.02v0c-0.08-0.01-0.15,0.03-0.21,0.08 c-0.02,0.02-0.04,0.05-0.05,0.07c-0.22,0.44-0.5,0.83-0.85,1.17c-0.05,0.05-0.08,0.12-0.08,0.2c0,0.03,0.01,0.06,0.02,0.09 l0.27,0.77l-0.3,0.21l-0.64-0.5c-0.08-0.07-0.21-0.08-0.3-0.03c-0.42,0.22-0.89,0.37-1.37,0.44c-0.09,0.01-0.17,0.07-0.21,0.15 c-0.01,0.01-0.01,0.03-0.02,0.05l-0.23,0.78l-0.07,0V17.5c0.58-0.03,1.13-0.25,1.57-0.66c0.5-0.47,0.79-1.13,0.79-1.81 c0-0.74-0.33-1.44-0.9-1.91c-0.41-0.34-0.93-0.53-1.45-0.56V9.74l0.07,0l0.23,0.78c0,0.02,0.01,0.03,0.02,0.05 c0.04,0.08,0.12,0.14,0.21,0.15C2.79,10.79,3.26,10.94,3.69,11.17z M1.78,13.12c0.4,0.03,0.79,0.17,1.1,0.43 c0.44,0.36,0.7,0.9,0.7,1.48c0,0.53-0.22,1.04-0.61,1.4c-0.33,0.31-0.74,0.48-1.18,0.5V13.12z M18.16,20.8 c0,0.68-0.56,1.24-1.24,1.24H2.92c-0.58,0-1.06-0.51-1.13-1.16l0.27,0c0.12,0,0.23-0.08,0.27-0.2l0.24-0.82 c0.42-0.08,0.83-0.21,1.21-0.39l0.67,0.52c0.1,0.08,0.24,0.08,0.34,0l0.64-0.46c0.1-0.07,0.14-0.2,0.1-0.32l-0.28-0.8 c0.29-0.31,0.54-0.65,0.75-1.03l0.85,0.02c0.12,0,0.24-0.08,0.28-0.19l0.24-0.75c0.04-0.12-0.01-0.25-0.11-0.32l-0.7-0.48 c0.03-0.22,0.05-0.43,0.05-0.64s-0.01-0.41-0.05-0.63l0.7-0.48c0.1-0.07,0.15-0.2,0.11-0.32l-0.24-0.75 c-0.04-0.12-0.15-0.2-0.28-0.19l-0.85,0.02c-0.21-0.38-0.46-0.72-0.75-1.03l0.28-0.8c0.04-0.12,0-0.25-0.1-0.32l-0.64-0.46 c-0.1-0.07-0.24-0.07-0.34,0l-0.67,0.52c-0.38-0.18-0.79-0.31-1.21-0.39L2.33,9.38c-0.04-0.12-0.14-0.2-0.27-0.2l-0.28,0V6.6 c0-0.02,0-0.05,0-0.07h3.78c0.55,0,0.99-0.44,0.99-0.99V2.14c0.16-0.12,0.35-0.18,0.55-0.18h9.92c0.63,0,1.14,0.59,1.14,1.31v4.89 h-3.46c-0.48,0-0.87,0.39-0.87,0.87v8.88c0,0.48,0.39,0.87,0.87,0.87h3.46V20.8z M21.91,18.23h-1.92v-4.47h2.23v4.16 C22.22,18.09,22.08,18.23,21.91,18.23z"/></svg></div>
            <p style="font-size:11.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin:0 0 10px;">Available</p>
            <h3 style="font-size:17px;margin:0 0 10px;">Engineering &amp; Statistics Calculator</h3>
            <p style="font-size:14px;color:var(--muted);margin:0 0 16px;">Use a scientific calculator, descriptive statistics, probability distributions, reliability metrics, and hypothesis tests.</p>
            <span style="font-size:13.5px;font-weight:600;">Open calculator &rarr;</span>
          </a>
          <a href="${UNIT_CONVERTER_PATH}" class="card" style="color:var(--ink);">
            <div class="icon-badge badge-teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h13"/><path d="M13 3l4 4-4 4"/><path d="M21 17H8"/><path d="M11 21l-4-4 4-4"/></svg></div>
            <p style="font-size:11.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin:0 0 10px;">Available</p>
            <h3 style="font-size:17px;margin:0 0 10px;">Unit Converter</h3>
            <p style="font-size:14px;color:var(--muted);margin:0 0 16px;">Convert SI, Imperial, and common industry units used in technical work.</p>
            <span style="font-size:13.5px;font-weight:600;">Open converter &rarr;</span>
          </a>
        </div>
        <div style="margin-top:26px;">
          <a href="${TOOLS_PATH}" class="btn btn-outline">Browse all Engineering Tools</a>
        </div>
      </div>`;
    return section;
  }

  function ensureHomeContent() {
    if (!isHomePage()) return;

    const chooseGrid = document.querySelector('.section.tint .grid-2');
    if (chooseGrid && !chooseGrid.querySelector('a[href*="engineering-tools.html"], a[href="/engineering-tools"]')) {
      const card = document.createElement('a');
      card.href = TOOLS_PATH;
      card.className = 'card';
      card.style.cssText = 'color:var(--ink);grid-column:1/-1;';
      card.innerHTML = '<h3 style="font-size:17px;margin:0 0 8px;">I need an engineering or statistics tool</h3><p style="font-size:14.5px;color:var(--muted);margin:0;">Explore material checkers, scientific and statistical calculations, and unit converters.</p>';
      chooseGrid.appendChild(card);
    }

    const popularHeading = Array.from(document.querySelectorAll('h2')).find(function (heading) {
      return heading.textContent.trim() === 'Browse by category.';
    });
    if (popularHeading) {
      const section = popularHeading.closest('section');
      const chipHolder = section && section.querySelector('div[style*="flex-wrap"]');
      if (chipHolder && !chipHolder.querySelector('a[href*="engineering-tools.html"], a[href="/engineering-tools"]')) {
        const chip = document.createElement('a');
        chip.href = TOOLS_PATH;
        chip.className = 'chip';
        chip.textContent = 'Engineering Tools';
        chipHolder.appendChild(chip);
      }
    }

    if (!document.getElementById('engineering-tools-preview')) {
      const servicesEyebrow = Array.from(document.querySelectorAll('p.eyebrow')).find(function (item) {
        return item.textContent.trim().toLowerCase() === 'services';
      });
      const servicesSection = servicesEyebrow && servicesEyebrow.closest('section');
      if (servicesSection && servicesSection.parentNode) {
        servicesSection.parentNode.insertBefore(buildHomeToolsSection(), servicesSection);
      }
    }
  }

  function ensureLessonsLibraryLink() {
    if (!isLessonsPage()) return;
    const jumpArea = document.querySelector('section .wrap div[style*="flex-wrap"]');
    if (!jumpArea || jumpArea.querySelector('a[href*="engineering-tools.html"], a[href="/engineering-tools"]')) return;
    const link = document.createElement('a');
    link.href = TOOLS_PATH;
    link.className = 'chip';
    link.textContent = 'Engineering Tools';
    jumpArea.appendChild(link);
  }

  function enhanceLessonsHierarchy() {
    if (!isLessonsPage() || document.getElementById('upskill-lessons-hierarchy')) return;

    const style = document.createElement('style');
    style.id = 'upskill-lessons-hierarchy';
    style.textContent = `
      .lesson-category {
        padding-top: 58px;
      }
      .lesson-category + .lesson-category {
        margin-top: 8px;
      }
      .category-header {
        position: relative;
        align-items: center;
        margin-bottom: 0;
        padding: 0 0 15px;
        border-bottom: 2px solid var(--line);
      }
      .category-header::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 64px;
        height: 2px;
        background: var(--teal);
      }
      .category-header h2 {
        margin: 0;
        color: var(--ink);
        font-size: clamp(25px, 3vw, 30px);
        line-height: 1.2;
      }
      .category-count {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        padding: 5px 10px;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: var(--tint);
        color: var(--ink-soft);
        font-size: 11.5px;
        font-weight: 700;
        white-space: nowrap;
      }
      .lesson-list {
        position: relative;
        margin: 15px 0 0 30px;
        padding-left: 22px;
        border-left: 3px solid var(--teal);
        border-bottom: 0;
      }
      .lesson-row {
        position: relative;
        min-height: 108px;
        padding: 23px 18px;
        border-top: 1px solid var(--line);
        border-radius: 8px;
      }
      .lesson-row:first-child {
        border-top-color: transparent;
      }
      .lesson-row::before {
        content: '';
        position: absolute;
        top: 31px;
        left: -30px;
        width: 11px;
        height: 11px;
        border: 3px solid var(--paper);
        border-radius: 50%;
        background: var(--teal);
        box-shadow: 0 0 0 1px var(--teal);
      }
      .lesson-row:hover,
      .lesson-row:focus-visible {
        padding-right: 22px;
        padding-left: 22px;
        background: var(--tint);
        color: var(--ink);
        outline: none;
      }
      .lesson-row h3 {
        font-size: 18.5px;
      }
      .lesson-meta {
        margin-bottom: 9px;
      }
      .lesson-action {
        align-self: center;
        padding-left: 18px;
      }
      .lesson-category .empty-topic {
        margin: 15px 0 0 30px;
        padding: 22px 18px 22px 25px;
        border-top: 0;
        border-bottom: 1px solid var(--line);
        border-left: 3px solid var(--teal);
        background: var(--tint);
      }
      html[data-theme="dark"] .lesson-row::before {
        border-color: var(--paper);
      }
      @media (max-width: 700px) {
        .lesson-category {
          padding-top: 46px;
        }
        .category-header {
          align-items: flex-end;
          gap: 12px;
          padding-bottom: 13px;
        }
        .category-header h2 {
          font-size: 25px;
        }
        .lesson-list {
          margin-left: 12px;
          padding-left: 15px;
          border-left-width: 2px;
        }
        .lesson-row {
          min-height: 0;
          padding: 20px 10px 20px 13px;
          border-radius: 6px;
        }
        .lesson-row::before {
          top: 27px;
          left: -21px;
          width: 9px;
          height: 9px;
          border-width: 2px;
        }
        .lesson-row:hover,
        .lesson-row:focus-visible {
          padding-right: 12px;
          padding-left: 15px;
        }
        .lesson-action {
          padding-left: 0;
        }
        .lesson-category .empty-topic {
          margin-left: 12px;
          padding: 19px 14px 19px 18px;
          border-left-width: 2px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function activateToolCard(options, catalogDocument) {
    if (!catalogDocument && !isEngineeringToolsPage()) return;
    const card = (catalogDocument || document).getElementById(options.cardId);
    if (!card) return;

    card.href = options.path;
    card.classList.remove('is-planned');
    const status = card.querySelector('.tool-status');
    const action = card.querySelector('.tool-link');
    const heading = card.querySelector('.tool-content h2');
    const description = card.querySelector('.tool-content p');
    const administratorOnly = card.getAttribute('data-required-access') === 'administrator';

    if (heading && options.title) heading.innerHTML = options.title;
    if (description && options.description) description.textContent = options.description;
    if (status) {
      status.textContent = administratorOnly ? 'Administrator' : 'Available';
      status.classList.add('available');
    }
    if (action) {
      if (administratorOnly) action.textContent = 'Administrator access';
      else action.innerHTML = options.actionText;
      action.classList.remove('secondary');
      action.classList.add('primary');
    }
    card.setAttribute('aria-label', administratorOnly ? options.ariaLabel + ' — Administrator access required' : options.ariaLabel);
  }

  function activateAvailableTools(catalogDocument) {
    activateToolCard({
      cardId: 'materials-quality',
      path: MATERIAL_CHECKER_PATH,
      actionText: 'Open checker &rarr;',
      ariaLabel: 'Open Material Specification Compliance Checker'
    }, catalogDocument);
    activateToolCard({
      cardId: 'engineering-calculators',
      path: CALCULATOR_PATH,
      title: 'Engineering &amp; Statistics Calculator',
      description: 'Scientific calculations, descriptive statistics and regression, 16 probability distributions, reliability metrics, and nine hypothesis-test workflows.',
      actionText: 'Open calculator &rarr;',
      ariaLabel: 'Open Engineering and Statistics Calculator'
    }, catalogDocument);
    activateToolCard({
      cardId: 'converters',
      path: UNIT_CONVERTER_PATH,
      actionText: 'Open converter &rarr;',
      ariaLabel: 'Open Engineering Unit Converter'
    }, catalogDocument);

    if (!catalogDocument && isEngineeringToolsPage()) {
      const note = document.querySelector('.directory-note');
      if (note) note.textContent = 'Tools marked Administrator require administrator access. Each tool explains its assumptions and keeps the calculation method visible.';
    }
  }

  window.UpskillToolCounts = function (catalogDocument) {
    activateAvailableTools(catalogDocument);
    return catalogDocument.querySelectorAll('.tool-row:not(.is-planned) .tool-status.available').length;
  };

  function enhanceLeadMagnetCapture() {
    if (!isHomePage()) return;

    const form = document.querySelector('form[name="lead-magnet"]');
    const input = form && form.querySelector('.lead-email');
    const button = form && form.querySelector('button[type="submit"]');
    if (!form || !input || !button || form.dataset.enhanced === 'true') return;

    form.dataset.enhanced = 'true';
    form.className = 'lead-capture';
    form.removeAttribute('style');

    input.removeAttribute('style');
    input.type = 'text';
    input.inputMode = 'email';
    input.id = 'starter-kit-email';
    input.autocomplete = 'off';
    input.autocapitalize = 'none';
    input.spellcheck = false;
    input.placeholder = 'you@example.com';
    input.setAttribute('pattern', '^[^ @]+@[^ @]+[.][^ @]+$');
    input.setAttribute('title', 'Enter a valid email address, such as name@example.com');
    input.setAttribute('data-1p-ignore', 'true');
    input.setAttribute('data-bwignore', 'true');
    input.setAttribute('data-lpignore', 'true');
    input.setAttribute('data-form-type', 'other');

    button.classList.add('lead-capture-submit');

    const row = document.createElement('div');
    row.className = 'lead-capture-row';
    const field = document.createElement('label');
    field.className = 'lead-capture-field';
    field.htmlFor = input.id;
    const labelText = document.createElement('span');
    labelText.textContent = 'Email address';

    input.parentNode.insertBefore(row, input);
    field.appendChild(labelText);
    field.appendChild(input);
    row.appendChild(field);
    row.appendChild(button);

    const note = document.createElement('p');
    note.className = 'lead-capture-note';
    note.textContent = 'Free download. No spam. Unsubscribe at any time.';
    form.appendChild(note);

    if (!document.getElementById('lead-capture-styles')) {
      const style = document.createElement('style');
      style.id = 'lead-capture-styles';
      style.textContent = `
        .lead-capture{width:min(100%,680px);margin:0 auto;padding:18px;border:1px solid var(--line);border-radius:10px;background:var(--card);box-shadow:0 10px 28px rgba(15,42,67,.08);text-align:left}
        .lead-capture-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:end}
        .lead-capture-field{display:flex;min-width:0;flex-direction:column;gap:7px;color:var(--ink);font-size:13px;font-weight:600}
        .lead-capture .lead-email{display:block;width:100%;min-width:0;height:50px;margin:0;padding:0 15px;appearance:none;border:1px solid #cfd4dc;border-radius:var(--radius);background:var(--paper)!important;color:var(--ink);font:400 15px/1 'Work Sans',Arial,sans-serif;box-shadow:inset 0 1px 2px rgba(16,24,40,.04)}
        .lead-capture .lead-email::placeholder{color:#8792a2}.lead-capture .lead-email:focus{border-color:var(--teal);box-shadow:0 0 0 3px rgba(14,116,144,.14);outline:none}
        .lead-capture-submit{min-width:168px;height:50px;padding-top:0;padding-bottom:0}.lead-capture-note{margin:10px 0 0;color:var(--muted);font-size:12px;line-height:1.45;text-align:center}
        html[data-theme="dark"] .lead-capture{box-shadow:0 12px 30px rgba(0,0,0,.24)}html[data-theme="dark"] .lead-capture .lead-email{border-color:var(--line)!important}
        @media(max-width:600px){.lead-capture{padding:16px}.lead-capture-row{grid-template-columns:1fr}.lead-capture-submit{width:100%;min-width:0}}
      `;
      document.head.appendChild(style);
    }
  }

  function initializeSiteSections() {
    if (redirectLegacyExamPractice()) return;
    if (isLessonsPage()) window.addEventListener('hashchange', redirectLegacyExamPractice);
    loadArrowCleanup();
    loadAuthScripts();
    ensureNavigation();
    openLinkedCertification();
    ensureHomeContent();
    ensureLessonsLibraryLink();
    loadChiSquareLessonLibrary();
    loadLessonSearchContext();
    enhanceLessonsHierarchy();
    activateAvailableTools();
    enhanceLeadMagnetCapture();
    /* Some lesson scripts build their own header after this runs. */
    window.addEventListener('load', enhanceMobileMenuButtons, { once: true });
  }

  installArrowCleanupWriteHook();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSiteSections, { once: true });
  } else {
    initializeSiteSections();
  }
}());
