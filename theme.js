(function () {
  'use strict';

  const STORAGE_KEY = 'upskill-theme';
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const MATERIAL_CHECKER_PATH = '/tools/material-specification-compliance-checker.html';

  function installMaterialCheckerBrandFix() {
    if (!window.location.pathname.endsWith(MATERIAL_CHECKER_PATH)) return;
    if (Document.prototype.__upskillBrandFixInstalled) return;

    const nativeWrite = Document.prototype.write;

    function brandFixScript() {
      return `<script>
        (function () {
          function replaceInitialsWithLogo() {
            var scopes = Array.prototype.slice.call(document.querySelectorAll('header, nav, [class*="header"], [class*="brand"]'));
            var candidates = [];

            scopes.forEach(function (scope) {
              candidates.push(scope);
              candidates = candidates.concat(Array.prototype.slice.call(scope.querySelectorAll('span, div, a, strong')));
            });

            var badge = candidates.find(function (element) {
              if (!element || element.children.length || element.textContent.trim().toUpperCase() !== 'US') return false;
              var rect = element.getBoundingClientRect();
              return rect.top < 180 && rect.width <= 90 && rect.height <= 90;
            });

            if (!badge) return false;

            var logo = document.createElement('img');
            logo.src = '/assets/logo-icon.png';
            logo.alt = 'UpSkill Sprint Consulting logo';
            logo.width = 38;
            logo.height = 38;
            logo.style.cssText = 'display:block;width:38px;height:38px;object-fit:contain;';

            badge.replaceChildren(logo);
            badge.setAttribute('aria-label', 'UpSkill Sprint Consulting');
            badge.style.cssText += ';display:flex;align-items:center;justify-content:center;width:40px;height:40px;min-width:40px;padding:0;border:0;border-radius:0;background:transparent;box-shadow:none;overflow:visible;';
            return true;
          }

          function startBrandFix() {
            if (replaceInitialsWithLogo()) return;
            var attempts = 0;
            var timer = window.setInterval(function () {
              attempts += 1;
              if (replaceInitialsWithLogo() || attempts >= 100) window.clearInterval(timer);
            }, 100);
          }

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startBrandFix, { once: true });
          } else {
            startBrandFix();
          }
        }());
      <\/script>`;
    }

    Document.prototype.write = function () {
      const chunks = Array.prototype.slice.call(arguments);
      if (chunks.length === 1 && typeof chunks[0] === 'string' && chunks[0].includes('</body>')) {
        chunks[0] = chunks[0].replace('</body>', brandFixScript() + '</body>');
      }
      return nativeWrite.apply(this, chunks);
    };

    Document.prototype.__upskillBrandFixInstalled = true;
  }

  installMaterialCheckerBrandFix();

  function readSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'dark' || saved === 'light' ? saved : null;
    } catch (error) {
      return null;
    }
  }

  function preferredTheme() {
    return readSavedTheme() || (systemTheme.matches ? 'dark' : 'light');
  }

  function ensureThemeStyles() {
    if (document.getElementById('upskill-global-theme-styles')) return;

    const style = document.createElement('style');
    style.id = 'upskill-global-theme-styles';
    style.textContent = `
      html[data-theme="dark"] {
        color-scheme: dark;
        --ink: #f4f7fb;
        --ink-soft: #d2dbea;
        --muted: #a9b6c8;
        --line: #2b3b50;
        --paper: #0b1220;
        --card: #111c2d;
        --tint: #0f1a2b;
        --teal: #2bb7c9;
        --teal-dark: #67d4df;
        --amber: #f0c36a;
        --navy: #102a43;
        --formula-bg: #102a31;
        --practice-bg: #102a22;
        --warning-bg: #2a2312;
        --danger-bg: #2b171b;
        --info-bg: #10233a;
        --lp-bg: #0b1220;
        --lp-surface: #111c2d;
        --lp-surface-soft: #0f1a2b;
        --lp-text: #f4f7fb;
        --lp-muted: #a9b6c8;
        --lp-border: #2b3b50;
        --lp-navy: #dbeafe;
        --lp-teal: #2bb7c9;
        --lp-teal-dark: #67d4df;
        --lp-formula-bg: #102a31;
        --lp-practice-bg: #102a22;
        --lp-warning-bg: #2a2312;
        --lp-danger-bg: #2b171b;
        --lp-info-bg: #10233a;
      }

      html[data-theme="dark"] body { background: var(--paper) !important; color: var(--ink) !important; }
      html[data-theme="dark"] header.site { background: rgba(11,18,32,.95) !important; border-color: var(--line) !important; }
      html[data-theme="dark"] nav.mobile-nav { background: var(--card) !important; border-color: var(--line) !important; }
      html[data-theme="dark"] label.mobile-menu-btn { background: var(--card) !important; color: var(--ink) !important; border-color: var(--line) !important; }
      html[data-theme="dark"] label.mobile-menu-btn svg { stroke: currentColor !important; }
      html[data-theme="dark"] .section.tint { background: var(--tint) !important; }
      html[data-theme="dark"] .card,
      html[data-theme="dark"] .chip,
      html[data-theme="dark"] details.faq,
      html[data-theme="dark"] .example-box,
      html[data-theme="dark"] .quiz,
      html[data-theme="dark"] .concept-card,
      html[data-theme="dark"] .rule-side,
      html[data-theme="dark"] .jump-nav a,
      html[data-theme="dark"] .interactive,
      html[data-theme="dark"] .calculator,
      html[data-theme="dark"] .result-panel,
      html[data-theme="dark"] .canvas-wrap,
      html[data-theme="dark"] .quiz-question,
      html[data-theme="dark"] .lesson-wrapper .card,
      html[data-theme="dark"] .lesson-wrapper table,
      html[data-theme="dark"] .lesson-wrapper .example-box,
      html[data-theme="dark"] .lesson-wrapper .calculator,
      html[data-theme="dark"] .lesson-wrapper .result-panel,
      html[data-theme="dark"] .lesson-wrapper .canvas-wrap,
      html[data-theme="dark"] .lesson-wrapper .quiz-question {
        background: var(--card) !important;
        color: var(--ink) !important;
        border-color: var(--line) !important;
      }
      html[data-theme="dark"] .interactive { background-image: none !important; }
      html[data-theme="dark"] input,
      html[data-theme="dark"] select,
      html[data-theme="dark"] textarea,
      html[data-theme="dark"] .lesson-wrapper input,
      html[data-theme="dark"] .lesson-wrapper select,
      html[data-theme="dark"] .lesson-wrapper textarea {
        background: var(--card) !important;
        color: var(--ink) !important;
        border-color: var(--line) !important;
      }
      html[data-theme="dark"] input::placeholder,
      html[data-theme="dark"] textarea::placeholder { color: #8391a5 !important; }
      html[data-theme="dark"] table { background: var(--card) !important; }
      html[data-theme="dark"] td { color: var(--ink-soft) !important; border-color: var(--line) !important; }
      html[data-theme="dark"] th { background: #17324d !important; color: #fff !important; }
      html[data-theme="dark"] .callout { color: var(--ink-soft) !important; }
      html[data-theme="dark"] .callout strong { color: var(--ink) !important; }
      html[data-theme="dark"] .callout-info { background: var(--info-bg) !important; }
      html[data-theme="dark"] .callout-formula { background: var(--formula-bg) !important; }
      html[data-theme="dark"] .callout-practice { background: var(--practice-bg) !important; }
      html[data-theme="dark"] .callout-warning { background: var(--warning-bg) !important; }
      html[data-theme="dark"] .callout-danger { background: var(--danger-bg) !important; }
      html[data-theme="dark"] .lesson-wrapper { background: var(--lp-bg) !important; color: var(--lp-text) !important; }
      html[data-theme="dark"] .lesson-wrapper .page { background: var(--lp-bg) !important; }
      html[data-theme="dark"] .lesson-wrapper p,
      html[data-theme="dark"] .lesson-wrapper li { color: var(--lp-muted); }
      html[data-theme="dark"] .lesson-wrapper h2,
      html[data-theme="dark"] .lesson-wrapper h3 { color: var(--lp-navy); }
      html[data-theme="dark"] .btn-primary { background: #e6f4f7 !important; color: #0b1220 !important; }
      html[data-theme="dark"] .btn-outline { color: var(--ink) !important; border-color: var(--line) !important; }
      html[data-theme="dark"] .hero-visual text { fill: var(--ink-soft) !important; }
      html[data-theme="dark"] .hero-visual [fill="#0f2a43"] { fill: #7dd3fc !important; }
      html[data-theme="dark"] .hero-visual [stroke="#0f2a43"] { stroke: #7dd3fc !important; }
      html[data-theme="dark"] .hero-visual [fill="#0e7490"] { fill: #2dd4bf !important; }
      html[data-theme="dark"] .hero-visual [stroke="#0e7490"] { stroke: #2dd4bf !important; }

      .header-actions { display: flex; align-items: center; justify-content: flex-end; gap: 10px; flex-shrink: 0; }
      .theme-control { display: inline-flex; align-items: center; gap: 7px; }
      .theme-icon { color: var(--muted); transition: color .2s ease, opacity .2s ease; }
      .theme-icon-sun { color: #b7791f; }
      html[data-theme="dark"] .theme-icon-sun { color: #667085; }
      html[data-theme="dark"] .theme-icon-moon { color: #7dd3fc; }
      .theme-toggle {
        position: relative; width: 48px; height: 26px; padding: 0; border: 1px solid #c7ced8;
        border-radius: 999px; background: #d0d5dd; cursor: pointer; flex-shrink: 0;
        box-shadow: inset 0 1px 2px rgba(15,23,42,.12);
        transition: background-color .2s ease, border-color .2s ease;
      }
      .theme-toggle::after {
        content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
        border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(15,23,42,.28);
        transition: transform .2s ease;
      }
      html[data-theme="dark"] .theme-toggle { background: var(--teal); border-color: var(--teal); }
      html[data-theme="dark"] .theme-toggle::after { transform: translateX(22px); background: #f8fafc; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

      @media (max-width: 760px) { .header-cta { display: none !important; } header.site { padding: 14px 16px; } }
      @media (max-width: 640px) { .theme-control { gap: 0; } .theme-control .theme-icon { display: none; } .brand span { font-size: 15px; } }
      @media (max-width: 430px) { .brand span { display: none; } }
    `;
    document.head.appendChild(style);
  }

  function updateMetaTheme(isDark) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = isDark ? '#0b1220' : '#ffffff';
  }

  function syncToggle(isDark) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.setAttribute('aria-checked', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  function applyTheme(theme, savePreference) {
    const isDark = theme === 'dark';
    root.dataset.theme = isDark ? 'dark' : 'light';
    updateMetaTheme(isDark);
    syncToggle(isDark);

    if (savePreference) {
      try {
        localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
      } catch (error) {
        // The switch still works for the current visit.
      }
    }
  }

  function themeControlMarkup() {
    return `
      <div class="theme-control" aria-label="Colour theme">
        <svg class="theme-icon theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
        </svg>
        <button type="button" id="theme-toggle" class="theme-toggle" role="switch" aria-checked="false" aria-label="Switch to dark mode" title="Switch to dark mode">
          <span class="sr-only">Toggle dark and light mode</span>
        </button>
        <svg class="theme-icon theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>`;
  }

  function ensureToggle() {
    const header = document.querySelector('header.site');
    if (!header) return;

    let toggle = document.getElementById('theme-toggle');
    if (!toggle) {
      let actions = header.querySelector('.header-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'header-actions';
        const mobileButton = header.querySelector('label.mobile-menu-btn');
        const cta = header.querySelector('.header-cta');
        if (mobileButton) actions.appendChild(mobileButton);
        if (cta) actions.appendChild(cta);
        header.appendChild(actions);
      }

      const holder = document.createElement('div');
      holder.innerHTML = themeControlMarkup().trim();
      actions.insertBefore(holder.firstElementChild, actions.firstChild);
      toggle = document.getElementById('theme-toggle');
    }

    if (toggle && !toggle.dataset.themeBound) {
      toggle.dataset.themeBound = 'true';
      toggle.addEventListener('click', function () {
        applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
      });
    }

    syncToggle(root.dataset.theme === 'dark');
  }

  ensureThemeStyles();
  applyTheme(preferredTheme(), false);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureToggle, { once: true });
  } else {
    ensureToggle();
  }

  systemTheme.addEventListener('change', function (event) {
    if (readSavedTheme()) return;
    applyTheme(event.matches ? 'dark' : 'light', false);
  });
}());
