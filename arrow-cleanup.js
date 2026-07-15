(function () {
  'use strict';

  const ACTION = 'a,button,[role="button"],input[type="button"],input[type="submit"]';
  const LEAD = /^(?:[\s\u00a0]*(?:←|⟵|↩|↶|⬅|⇐|⟸|<-+)[\s\u00a0]*)+/u;
  const TRAIL = /(?:[\s\u00a0]*(?:→|⟶|➜|➝|➞|➡|⟹|-+>)[\s\u00a0]*)+$/u;
  const ONLY = /^(?:[\s\u00a0]*(?:←|⟵|↩|↶|⬅|⇐|⟸|→|⟶|➜|➝|➞|➡|⟹|<-+|-+>)[\s\u00a0]*)+$/u;
  const ROUTE = '/tools/material-specification-compliance-checker';
  const STORE = 'upskill-theme';
  let queued = false;

  function cleanPath(value) {
    return /\/index\.html$/i.test(value)
      ? value.replace(/index\.html$/i, '')
      : value.replace(/\.html$/i, '');
  }

  function currentPath() {
    return cleanPath(location.pathname).replace(/\/$/, '') || '/';
  }

  function isChecker() {
    return currentPath() === ROUTE;
  }

  function installGlobalStyle() {
    if (document.getElementById('uc-global-style')) return;
    const style = document.createElement('style');
    style.id = 'uc-global-style';
    style.textContent = '.uc-no-after::after,.uc-no-before::before{content:none!important;display:none!important}';
    document.head.appendChild(style);
  }

  function loadCheckerCss() {
    if (!isChecker() || document.querySelector('link[href="/material-checker-polish.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/material-checker-polish.css';
    document.head.appendChild(link);
  }

  function cleanAction(element) {
    if (!(element instanceof Element)) return;

    if (element instanceof HTMLInputElement) {
      const cleaned = element.value.replace(LEAD, '').replace(TRAIL, '').trim();
      if (cleaned !== element.value) element.value = cleaned;
    } else {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) nodes.push(node);

      for (let index = 0; index < nodes.length; index += 1) {
        if (!nodes[index].nodeValue || !nodes[index].nodeValue.trim()) continue;
        nodes[index].nodeValue = nodes[index].nodeValue.replace(LEAD, '').trimStart();
        break;
      }
      for (let index = nodes.length - 1; index >= 0; index -= 1) {
        if (!nodes[index].nodeValue || !nodes[index].nodeValue.trim()) continue;
        nodes[index].nodeValue = nodes[index].nodeValue.replace(TRAIL, '').trimEnd();
        break;
      }
    }

    try {
      const after = getComputedStyle(element, '::after').content.replace(/^["']|["']$/g, '').trim();
      const before = getComputedStyle(element, '::before').content.replace(/^["']|["']$/g, '').trim();
      element.classList.toggle('uc-no-after', ONLY.test(after));
      element.classList.toggle('uc-no-before', ONLY.test(before));
    } catch (error) {}

    if (element instanceof HTMLAnchorElement && !element.hasAttribute('download')) {
      const href = element.getAttribute('href');
      if (!href || href.startsWith('#') || /^(?:mailto:|tel:|javascript:|data:)/i.test(href)) return;
      try {
        const url = new URL(href, location.href);
        if (url.origin === location.origin && /\.html$/i.test(url.pathname)) {
          url.pathname = cleanPath(url.pathname);
          element.setAttribute('href', url.pathname + url.search + url.hash);
        }
      } catch (error) {}
    }
  }

  function cleanActions(root) {
    if (root instanceof Element && root.matches(ACTION)) cleanAction(root);
    if (root.querySelectorAll) root.querySelectorAll(ACTION).forEach(cleanAction);
  }

  function cleanUrls() {
    if (/\.html$/i.test(location.pathname)) {
      try {
        history.replaceState(history.state, document.title, cleanPath(location.pathname) + location.search + location.hash);
      } catch (error) {}
    }

    document.querySelectorAll('link[rel="canonical"],meta[property="og:url"]').forEach(function (element) {
      const raw = element.tagName === 'LINK' ? element.href : element.content;
      try {
        const url = new URL(raw, location.href);
        if (url.origin === location.origin && /\.html$/i.test(url.pathname)) {
          url.pathname = cleanPath(url.pathname);
          if (element.tagName === 'LINK') element.href = url.href;
          else element.content = url.href;
        }
      } catch (error) {}
    });
  }

  function preferredTheme() {
    try {
      const saved = localStorage.getItem(STORE);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (error) {}
    return matchMedia && matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  }

  function syncThemeControls() {
    const dark = document.documentElement.dataset.theme === 'dark';
    document.querySelectorAll('[data-theme-toggle],.uc-toggle').forEach(function (toggle) {
      toggle.setAttribute('aria-checked', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    });
  }

  function refreshGraphs(themeName) {
    const dark = themeName === 'dark';
    const paper = dark ? '#101a2b' : '#ffffff';
    const ink = dark ? '#f4f7fb' : '#172033';
    const muted = dark ? '#aab7ca' : '#65758b';
    const line = dark ? '#2b3b50' : '#d9e2ec';

    if (window.Plotly && Plotly.relayout) {
      document.querySelectorAll('.js-plotly-plot').forEach(function (plot) {
        try {
          Plotly.relayout(plot, {
            paper_bgcolor: paper,
            plot_bgcolor: paper,
            'font.color': ink,
            'xaxis.color': muted,
            'xaxis.gridcolor': line,
            'yaxis.color': muted,
            'yaxis.gridcolor': line
          });
        } catch (error) {}
      });
    }

    if (window.Chart && Chart.getChart) {
      document.querySelectorAll('canvas').forEach(function (canvas) {
        try {
          const chart = Chart.getChart(canvas);
          if (!chart) return;
          Object.values(chart.options.scales || {}).forEach(function (scale) {
            scale.ticks = scale.ticks || {};
            scale.grid = scale.grid || {};
            scale.ticks.color = muted;
            scale.grid.color = line;
          });
          if (chart.options.plugins?.legend?.labels) chart.options.plugins.legend.labels.color = ink;
          chart.update('none');
        } catch (error) {}
      });
    }

    dispatchEvent(new Event('resize'));
  }

  function applyTheme(themeName, save) {
    const resolved = themeName === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
    if (save) {
      try { localStorage.setItem(STORE, resolved); } catch (error) {}
    }
    syncThemeControls();
    refreshGraphs(resolved);
    try {
      dispatchEvent(new CustomEvent('upskill:themechange', { detail: { theme: resolved } }));
    } catch (error) {}
  }

  function navLinks() {
    const links = [
      ['/start-here', 'Start Here'],
      ['/lessons', 'Lessons'],
      ['/engineering-tools', 'Engineering Tools'],
      ['/services', 'Services'],
      ['/request-topic', 'Request a Topic'],
      ['/about', 'About'],
      ['/faq', 'FAQ'],
      ['/contact', 'Contact']
    ];
    return links.map(function (item) {
      return '<a href="' + item[0] + '"' + (item[0] === '/engineering-tools' ? ' aria-current="page"' : '') + '>' + item[1] + '</a>';
    }).join('');
  }

  function themeToggle() {
    return '<div class="uc-theme" aria-label="Colour theme">' +
      '<svg class="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>' +
      '<button type="button" class="uc-toggle" data-theme-toggle role="switch" aria-checked="false"><span class="uc-sr">Toggle dark and light mode</span></button>' +
      '<svg class="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>' +
      '</div>';
  }

  function installChrome() {
    if (!isChecker() || document.querySelector('.uc-sitebar')) return;

    document.documentElement.classList.add('upskill-material-checker');
    loadCheckerCss();

    const oldHeader = Array.from(document.querySelectorAll('header')).find(function (header) {
      return /UpSkill\s+Sprint/i.test(header.textContent || '');
    });
    if (oldHeader) oldHeader.classList.add('uc-old-header');

    const skip = document.createElement('a');
    skip.className = 'uc-skip';
    skip.href = '#uc-content';
    skip.textContent = 'Skip to tool content';

    const menuCheck = document.createElement('input');
    menuCheck.type = 'checkbox';
    menuCheck.id = 'uc-mnav';
    menuCheck.className = 'uc-mnav-check';
    menuCheck.setAttribute('aria-hidden', 'true');

    const header = document.createElement('header');
    header.className = 'uc-sitebar';
    header.innerHTML =
      '<a class="uc-brand" href="/"><img src="/assets/logo-icon.png" alt="UpSkill Sprint Consulting logo"><span>UpSkill Sprint Consulting</span></a>' +
      '<nav class="uc-desktop-nav" aria-label="Primary navigation">' + navLinks() + '</nav>' +
      '<div class="uc-actions">' + themeToggle() +
      '<label for="uc-mnav" class="uc-menu" aria-label="Open menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"></path></svg></label></div>';

    const mobile = document.createElement('nav');
    mobile.className = 'uc-mobile-nav';
    mobile.setAttribute('aria-label', 'Mobile navigation');
    mobile.innerHTML = navLinks();

    document.body.prepend(skip, menuCheck, header, mobile);

    const main = document.querySelector('main,[role="main"]');
    if (main) main.id = 'uc-content';
    applyTheme(preferredTheme(), false);
  }

  function textOf(element) {
    return (element?.textContent || element?.value || '').replace(/\s+/g, ' ').trim();
  }

  function closestSurface(element) {
    return element && (
      element.closest('section') ||
      element.closest('[class*="card"]') ||
      element.closest('[class*="panel"]') ||
      element.closest('[class*="summary"]') ||
      element.parentElement
    );
  }

  function classifyForms(root) {
    if (!root) return;

    root.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]),select,textarea').forEach(function (control) {
      (control.closest('label') || control.parentElement)?.classList.add('uc-field');
    });

    root.querySelectorAll('input[type="checkbox"],input[type="radio"]').forEach(function (control) {
      (control.closest('label') || control.parentElement)?.classList.add('uc-check');
    });

    const candidates = Array.from(root.querySelectorAll('div')).filter(function (container) {
      if (container.closest('table') || container.children.length < 2) return false;
      const controls = container.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]),select,textarea');
      const directGroups = Array.from(container.children).filter(function (child) {
        return child.querySelector?.('input:not([type="checkbox"]):not([type="radio"]),select,textarea');
      });
      return controls.length > 1 && directGroups.length > 1;
    });

    candidates.forEach(function (container) {
      if (!candidates.some(function (other) { return other !== container && container.contains(other); })) {
        container.classList.add('uc-grid');
      }
    });

    root.querySelectorAll('label').forEach(function (label) {
      const text = textOf(label);
      const holder = label.closest('.uc-field') || label.closest('div');
      if (holder && /original certified specification|target specification\s*\/\s*grade|material description/i.test(text)) {
        holder.classList.add('uc-wide');
      }
    });
  }

  function removeDemoControls() {
    document.querySelectorAll('button,[role="button"],input[type="button"],input[type="submit"]').forEach(function (button) {
      if (/1\.5\s*[×x]\s*72\s*plate\s*check/i.test(textOf(button))) button.remove();
    });
  }

  function classifyKpiDashboard() {
    const overallLabel = Array.from(document.querySelectorAll('*')).find(function (element) {
      return element.children.length === 0 && /^Overall result$/i.test(textOf(element));
    });
    if (!overallLabel) return;

    const overallCard = closestSurface(overallLabel);
    const dashboard = overallCard?.parentElement;
    if (!overallCard || !dashboard) return;

    const dashboardText = textOf(dashboard);
    if (!/Passed/i.test(dashboardText) || !/Failed/i.test(dashboardText)) return;

    dashboard.classList.add('uc-kpi-dashboard');
    overallCard.classList.add('uc-kpi-overall');

    Array.from(dashboard.children).forEach(function (card) {
      card.classList.add('uc-kpi-card');
      const text = textOf(card);
      if (/Passed/i.test(text)) card.classList.add('uc-kpi-passed');
      if (/Conditional|missing evidence/i.test(text)) card.classList.add('uc-kpi-conditional');
      if (/Failed/i.test(text)) card.classList.add('uc-kpi-failed');
      if (/Information|not assessed/i.test(text)) card.classList.add('uc-kpi-info');
    });

    Array.from(overallCard.querySelectorAll('*')).forEach(function (element) {
      if (/^(NOT ASSESSED|PASS|PASSED|FAIL|FAILED|CONDITIONAL)$/i.test(textOf(element))) {
        element.classList.add('uc-status-value');
      }
    });
  }

  function classifySections() {
    const title = Array.from(document.querySelectorAll('h1')).find(function (element) {
      return /Material Specification Compliance Checker/i.test(textOf(element));
    });
    const hero = title && (title.closest('section') || title.parentElement);
    if (hero) hero.classList.add('uc-hero');

    document.querySelectorAll('main>section,main>div>section,[role="main"]>section').forEach(function (section) {
      if (section !== hero && section.querySelector('h2,h3,input,select,textarea,table,button')) {
        section.classList.add('uc-card');
      }
    });

    const workbenchHeading = Array.from(document.querySelectorAll('h2,h3')).find(function (element) {
      return /Independent compliance workbench/i.test(textOf(element));
    });
    const workbench = closestSurface(workbenchHeading);
    if (workbench) {
      workbench.classList.add('uc-card', 'uc-workbench');
      const boxes = Array.from(workbench.querySelectorAll('input[type="checkbox"]'));
      const holders = boxes.map(function (box) { return box.closest('label') || box.parentElement; }).filter(Boolean);
      const common = holders[0]?.parentElement;
      if (common && holders.every(function (holder) { return holder.parentElement === common; })) {
        common.classList.add('uc-check-grid');
      }
    }

    document.querySelectorAll('section,[class*="card"],[class*="panel"],[class*="workbench"]').forEach(function (surface) {
      classifyForms(surface);
      surface.querySelectorAll('table').forEach(function (table) {
        table.parentElement?.classList.add('uc-table');
      });
    });

    document.querySelectorAll('h2,h3,h4,strong').forEach(function (element) {
      if (/Important engineering-use notice|Accuracy control/i.test(textOf(element))) {
        element.closest('div,aside,section')?.classList.add('uc-notice');
      }
    });

    document.querySelectorAll('p,div').forEach(function (element) {
      if (/Row-by-row units take priority/i.test(textOf(element)) && element.children.length < 3) {
        element.classList.add('uc-helper', 'uc-full');
      }
    });

    document.querySelectorAll('button,[role="button"],input[type="button"],input[type="submit"]').forEach(function (button) {
      if (/Evaluate selected sections/i.test(textOf(button))) button.classList.add('uc-primary');
      const parent = button.parentElement;
      if (parent?.querySelectorAll('button,[role="button"],input[type="button"],input[type="submit"]').length > 1) {
        parent.classList.add('uc-actions-row');
      }
    });
  }

  function installBackLink() {
    if (document.querySelector('.uc-back')) return;
    const back = document.createElement('div');
    back.className = 'uc-back';
    back.innerHTML = '<a href="/engineering-tools">Back to Engineering Tools</a>';
    const footer = document.querySelector('footer');
    if (footer?.parentNode) footer.parentNode.insertBefore(back, footer);
    else document.body.appendChild(back);
  }

  function polishChecker() {
    if (!isChecker()) return;
    document.documentElement.classList.add('upskill-material-checker');
    loadCheckerCss();
    installChrome();
    removeDemoControls();
    classifySections();
    classifyKpiDashboard();
    installBackLink();
    syncThemeControls();
  }

  function repairToolsPage() {
    if (currentPath() !== '/engineering-tools') return;
    [
      { id: 'materials-quality', path: '/tools/material-specification-compliance-checker', action: 'Open checker' },
      { id: 'engineering-calculators', path: '/tools/engineering-statistics-calculator', action: 'Open calculator' },
      { id: 'converters', path: '/tools/unit-converter', action: 'Open converter' }
    ].forEach(function (tool) {
      const card = document.getElementById(tool.id);
      if (!card) return;
      card.href = tool.path;
      card.classList.remove('is-planned');
      const status = card.querySelector('.tool-status');
      if (status) {
        status.textContent = 'Available';
        status.classList.add('available');
      }
      const action = card.querySelector('.tool-link');
      if (action) {
        action.textContent = tool.action;
        action.classList.remove('secondary');
        action.classList.add('primary');
      }
    });
  }

  function run() {
    cleanActions(document);
    cleanUrls();
    polishChecker();
    repairToolsPage();
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      run();
    });
  }

  function initialize() {
    installGlobalStyle();
    cleanUrls();

    if (isChecker()) {
      document.documentElement.classList.add('upskill-material-checker');
      loadCheckerCss();
      applyTheme(preferredTheme(), false);
    }

    run();

    document.addEventListener('click', function (event) {
      const toggle = event.target instanceof Element
        ? event.target.closest('[data-theme-toggle],.uc-toggle')
        : null;
      if (!toggle || !isChecker()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
    }, true);

    new MutationObserver(function (mutations) {
      if (mutations.some(function (mutation) {
        return mutation.type === 'characterData' || mutation.addedNodes.length;
      })) queue();
    }).observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true
    });

    addEventListener('load', queue, { once: true });
    setTimeout(queue, 250);
    setTimeout(queue, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
