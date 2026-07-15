(function () {
  'use strict';

  const ACTION_SELECTOR = 'a, button, [role="button"], input[type="button"], input[type="submit"]';
  const LEADING_ARROW = /^(?:[\s\u00a0]*(?:←|⟵|↩|↶|⬅|⇐|⟸|<-+)[\s\u00a0]*)+/u;
  const TRAILING_ARROW = /(?:[\s\u00a0]*(?:→|⟶|➜|➝|➞|➡|⟹|-+>)[\s\u00a0]*)+$/u;
  const ARROW_ONLY = /^(?:[\s\u00a0]*(?:←|⟵|↩|↶|⬅|⇐|⟸|→|⟶|➜|➝|➞|➡|⟹|<-+|-+>)[\s\u00a0]*)+$/u;
  const AFTER_CLASS = 'upskill-remove-after-arrow';
  const BEFORE_CLASS = 'upskill-remove-before-arrow';
  const HTML_EXTENSION = /\.html$/i;
  const MATERIAL_CHECKER_ROUTE = '/tools/material-specification-compliance-checker';
  let scanScheduled = false;

  function cleanPathname(pathname) {
    if (/\/index\.html$/i.test(pathname)) return pathname.replace(/index\.html$/i, '');
    return pathname.replace(HTML_EXTENSION, '');
  }

  function normalizedCurrentPath() {
    return cleanPathname(window.location.pathname).replace(/\/$/, '') || '/';
  }

  function isMaterialChecker() {
    return normalizedCurrentPath() === MATERIAL_CHECKER_ROUTE;
  }

  function ensureStyles() {
    if (document.getElementById('upskill-arrow-cleanup-styles')) return;

    const style = document.createElement('style');
    style.id = 'upskill-arrow-cleanup-styles';
    style.textContent = `
      .${AFTER_CLASS}::after { content: none !important; display: none !important; }
      .${BEFORE_CLASS}::before { content: none !important; display: none !important; }

      .upskill-checker-brand-link {
        display:inline-flex!important;align-items:center!important;color:inherit!important;
        font-weight:700!important;text-decoration:none!important;text-underline-offset:0!important;
      }
      .upskill-checker-brand-link:hover,.upskill-checker-brand-link:focus,
      .upskill-checker-brand-link:visited {color:inherit!important;text-decoration:none!important}
      .upskill-checker-logo-slot {
        display:flex!important;align-items:center!important;justify-content:center!important;
        width:38px!important;height:38px!important;min-width:38px!important;padding:0!important;
        border:0!important;border-radius:0!important;background:transparent!important;
        box-shadow:none!important;overflow:visible!important;
      }
      .upskill-checker-logo-slot img {
        display:block!important;width:38px!important;height:38px!important;object-fit:contain!important;
      }
      .upskill-checker-brand-row {
        display:flex!important;align-items:center!important;justify-content:flex-start!important;
        gap:12px!important;width:min(100%,1200px)!important;margin:0 auto!important;
      }
      .upskill-checker-header {
        display:flex!important;align-items:center!important;justify-content:flex-start!important;
        width:100%!important;min-height:76px!important;padding:17px clamp(18px,4vw,40px)!important;
        box-sizing:border-box!important;
      }

      html.upskill-material-checker-polished {
        --uc-navy:#0b2545;--uc-navy-2:#123b64;--uc-teal:#0f8b8d;--uc-teal-dark:#087273;
        --uc-ink:#172033;--uc-muted:#5f6f86;--uc-line:#d7e1ec;--uc-paper:#ffffff;
        --uc-tint:#f4f8fc;--uc-warning:#fff7df;--uc-warning-line:#d99a00;
      }
      html.upskill-material-checker-polished body {
        background:#f3f7fb!important;color:var(--uc-ink)!important;
        font-family:Inter,"Segoe UI",Arial,sans-serif!important;font-size:15px!important;line-height:1.55!important;
      }
      html.upskill-material-checker-polished main,
      html.upskill-material-checker-polished .container,
      html.upskill-material-checker-polished .wrap {
        width:min(1180px,calc(100% - 32px))!important;margin-left:auto!important;margin-right:auto!important;
      }
      html.upskill-material-checker-polished h1,
      html.upskill-material-checker-polished h2,
      html.upskill-material-checker-polished h3 {
        font-family:Inter,"Segoe UI",Arial,sans-serif!important;letter-spacing:-.025em!important;
        color:var(--uc-ink)!important;
      }
      html.upskill-material-checker-polished h1 {
        font-size:clamp(38px,5.1vw,62px)!important;line-height:1.02!important;
        max-width:820px!important;margin:10px 0 18px!important;
      }
      html.upskill-material-checker-polished h2 {font-size:clamp(24px,2.8vw,32px)!important;line-height:1.18!important}
      html.upskill-material-checker-polished h3 {font-size:18px!important;line-height:1.3!important}
      html.upskill-material-checker-polished p {max-width:78ch}
      html.upskill-material-checker-polished .upskill-tool-hero {
        background:linear-gradient(135deg,#0b2545 0%,#0d4967 58%,#0f8b8d 100%)!important;
        color:#fff!important;padding:54px 0 42px!important;border-bottom:1px solid rgba(255,255,255,.15)!important;
      }
      html.upskill-material-checker-polished .upskill-tool-hero h1,
      html.upskill-material-checker-polished .upskill-tool-hero p,
      html.upskill-material-checker-polished .upskill-tool-hero span,
      html.upskill-material-checker-polished .upskill-tool-hero strong {
        color:#fff!important;text-shadow:none!important;
      }
      html.upskill-material-checker-polished .upskill-tool-hero p {
        color:#dceaf4!important;font-size:17px!important;line-height:1.65!important;
      }
      html.upskill-material-checker-polished .upskill-tool-hero .eyebrow {
        color:#8ff3ef!important;font-size:12px!important;font-weight:800!important;letter-spacing:.12em!important;
      }
      html.upskill-material-checker-polished .upskill-tool-hero a,
      html.upskill-material-checker-polished .upskill-tool-hero button,
      html.upskill-material-checker-polished .upskill-tool-hero [class*="chip"] {
        color:#fff!important;border-color:rgba(255,255,255,.28)!important;
        background:rgba(255,255,255,.08)!important;
      }
      html.upskill-material-checker-polished .upskill-tool-hero a:hover,
      html.upskill-material-checker-polished .upskill-tool-hero button:hover {
        background:rgba(255,255,255,.16)!important;
      }
      html.upskill-material-checker-polished section,
      html.upskill-material-checker-polished .card,
      html.upskill-material-checker-polished [class*="panel"],
      html.upskill-material-checker-polished [class*="workbench"] {
        border-color:var(--uc-line)!important;
      }
      html.upskill-material-checker-polished .upskill-tool-card {
        background:var(--uc-paper)!important;border:1px solid var(--uc-line)!important;border-radius:16px!important;
        box-shadow:0 8px 28px rgba(11,37,69,.06)!important;margin:22px auto!important;overflow:hidden!important;
      }
      html.upskill-material-checker-polished .upskill-tool-card > * {min-width:0}
      html.upskill-material-checker-polished .upskill-tool-card h2,
      html.upskill-material-checker-polished .upskill-tool-card h3 {margin-top:0!important}
      html.upskill-material-checker-polished label {
        display:block!important;color:var(--uc-ink)!important;font-size:12.5px!important;font-weight:750!important;
        line-height:1.35!important;margin-bottom:6px!important;
      }
      html.upskill-material-checker-polished input,
      html.upskill-material-checker-polished select,
      html.upskill-material-checker-polished textarea {
        width:100%!important;min-width:0!important;min-height:44px!important;padding:10px 12px!important;
        border:1px solid #c8d5e4!important;border-radius:9px!important;background:#fff!important;color:var(--uc-ink)!important;
        font:500 14px/1.35 Inter,"Segoe UI",Arial,sans-serif!important;box-shadow:none!important;
      }
      html.upskill-material-checker-polished input:focus,
      html.upskill-material-checker-polished select:focus,
      html.upskill-material-checker-polished textarea:focus {
        outline:3px solid rgba(15,139,141,.16)!important;border-color:var(--uc-teal)!important;
      }
      html.upskill-material-checker-polished button,
      html.upskill-material-checker-polished [role="button"],
      html.upskill-material-checker-polished input[type="button"],
      html.upskill-material-checker-polished input[type="submit"] {
        min-height:42px!important;border-radius:9px!important;font-weight:750!important;
        font-size:13.5px!important;line-height:1.2!important;padding:10px 15px!important;
      }
      html.upskill-material-checker-polished .upskill-primary-action {
        background:var(--uc-teal)!important;border-color:var(--uc-teal)!important;color:#fff!important;
        box-shadow:0 5px 14px rgba(15,139,141,.18)!important;
      }
      html.upskill-material-checker-polished .upskill-primary-action:hover {
        background:var(--uc-teal-dark)!important;border-color:var(--uc-teal-dark)!important;
      }
      html.upskill-material-checker-polished .upskill-form-grid {
        display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;
        gap:18px 14px!important;align-items:start!important;
      }
      html.upskill-material-checker-polished .upskill-form-grid > * {
        grid-column:span 3!important;min-width:0!important;max-width:none!important;
      }
      html.upskill-material-checker-polished .upskill-form-grid > .upskill-wide-field {grid-column:span 6!important}
      html.upskill-material-checker-polished .upskill-form-grid > .upskill-full-field {grid-column:1/-1!important}
      html.upskill-material-checker-polished .upskill-helper-copy {
        grid-column:1/-1!important;max-width:none!important;margin:0!important;padding:12px 14px!important;
        border-radius:10px!important;background:#eef6fb!important;color:var(--uc-muted)!important;
        font-size:12.5px!important;line-height:1.55!important;
      }
      html.upskill-material-checker-polished .upskill-action-row {
        display:flex!important;flex-wrap:wrap!important;gap:10px!important;align-items:center!important;
      }
      html.upskill-material-checker-polished .upskill-notice {
        width:min(1180px,calc(100% - 32px))!important;margin:18px auto!important;padding:16px 18px!important;
        border:1px solid #efd18a!important;border-left:4px solid var(--uc-warning-line)!important;
        border-radius:12px!important;background:var(--uc-warning)!important;color:#374151!important;
        box-shadow:none!important;
      }
      html.upskill-material-checker-polished .upskill-notice strong {display:block!important;margin-bottom:4px!important}
      html.upskill-material-checker-polished .upskill-scope-options {
        display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:10px!important;
      }
      html.upskill-material-checker-polished .upskill-scope-options > * {
        min-width:0!important;min-height:76px!important;padding:13px!important;border-radius:11px!important;
        background:#f5f8fc!important;border:1px solid var(--uc-line)!important;
      }
      html.upskill-material-checker-polished .upskill-section-heading {
        display:flex!important;align-items:flex-start!important;gap:12px!important;
      }
      html.upskill-material-checker-polished .upskill-section-number {
        display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 30px!important;
        width:30px!important;height:30px!important;border-radius:50%!important;background:#1672b8!important;color:#fff!important;
        font-weight:800!important;font-size:14px!important;
      }
      @media (max-width:980px) {
        html.upskill-material-checker-polished .upskill-scope-options {grid-template-columns:repeat(2,minmax(0,1fr))!important}
        html.upskill-material-checker-polished .upskill-form-grid > * {grid-column:span 6!important}
        html.upskill-material-checker-polished .upskill-form-grid > .upskill-wide-field {grid-column:1/-1!important}
      }
      @media (max-width:640px) {
        html.upskill-material-checker-polished main,
        html.upskill-material-checker-polished .container,
        html.upskill-material-checker-polished .wrap {width:min(100% - 20px,1180px)!important}
        html.upskill-material-checker-polished .upskill-scope-options {grid-template-columns:1fr!important}
        html.upskill-material-checker-polished .upskill-form-grid > * {grid-column:1/-1!important}
        html.upskill-material-checker-polished .upskill-action-row > * {width:100%!important}
        html.upskill-material-checker-polished .upskill-tool-hero {padding:38px 0 30px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function normalizePseudoContent(content) {
    if (!content || content === 'none' || content === 'normal') return '';
    return content.replace(/^[\'"]|[\'"]$/g, '').trim();
  }

  function cleanInputValue(element) {
    const cleanedValue = element.value.replace(LEADING_ARROW, '').replace(TRAILING_ARROW, '').trim();
    if (cleanedValue !== element.value) element.value = cleanedValue;
  }

  function removeTextArrows(element) {
    if (element instanceof HTMLInputElement) {
      cleanInputValue(element);
      return;
    }
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    for (let index = 0; index < textNodes.length; index += 1) {
      const textNode = textNodes[index];
      if (!textNode.nodeValue || !textNode.nodeValue.trim()) continue;
      textNode.nodeValue = textNode.nodeValue.replace(LEADING_ARROW, '').trimStart();
      break;
    }
    for (let index = textNodes.length - 1; index >= 0; index -= 1) {
      const textNode = textNodes[index];
      if (!textNode.nodeValue || !textNode.nodeValue.trim()) continue;
      textNode.nodeValue = textNode.nodeValue.replace(TRAILING_ARROW, '').trimEnd();
      break;
    }
  }

  function removePseudoElementArrow(element) {
    try {
      const afterContent = normalizePseudoContent(getComputedStyle(element, '::after').content);
      const beforeContent = normalizePseudoContent(getComputedStyle(element, '::before').content);
      element.classList.toggle(AFTER_CLASS, ARROW_ONLY.test(afterContent));
      element.classList.toggle(BEFORE_CLASS, ARROW_ONLY.test(beforeContent));
    } catch (error) {}
  }

  function cleanInternalLink(anchor) {
    if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download')) return;
    const rawHref = anchor.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || /^(?:mailto:|tel:|javascript:|data:)/i.test(rawHref)) return;
    try {
      const url = new URL(rawHref, window.location.href);
      if (url.origin !== window.location.origin || !HTML_EXTENSION.test(url.pathname)) return;
      url.pathname = cleanPathname(url.pathname);
      anchor.setAttribute('href', url.pathname + url.search + url.hash);
    } catch (error) {}
  }

  function cleanCanonicalAndSocialUrls() {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href) {
      try {
        const url = new URL(canonical.href, window.location.href);
        if (url.origin === window.location.origin && HTML_EXTENSION.test(url.pathname)) {
          url.pathname = cleanPathname(url.pathname);
          canonical.href = url.href;
        }
      } catch (error) {}
    }
    document.querySelectorAll('meta[property="og:url"]').forEach(function (meta) {
      try {
        const url = new URL(meta.content, window.location.href);
        if (url.origin === window.location.origin && HTML_EXTENSION.test(url.pathname)) {
          url.pathname = cleanPathname(url.pathname);
          meta.content = url.href;
        }
      } catch (error) {}
    });
  }

  function cleanBrowserAddress() {
    if (!HTML_EXTENSION.test(window.location.pathname)) return;
    const cleanUrl = cleanPathname(window.location.pathname) + window.location.search + window.location.hash;
    try { window.history.replaceState(window.history.state, document.title, cleanUrl); } catch (error) {}
  }

  function cleanAction(element) {
    if (!(element instanceof Element)) return;
    removeTextArrows(element);
    removePseudoElementArrow(element);
    if (element instanceof HTMLAnchorElement) cleanInternalLink(element);
  }

  function scan(rootNode) {
    if (!rootNode) return;
    if (rootNode instanceof Element && rootNode.matches(ACTION_SELECTOR)) cleanAction(rootNode);
    if (rootNode.querySelectorAll) rootNode.querySelectorAll(ACTION_SELECTOR).forEach(cleanAction);
  }

  function findCheckerBrandLink() {
    return Array.from(document.querySelectorAll('header a, nav a, [class*="header"] a, [class*="brand"] a')).find(function (link) {
      return /UpSkill\s+Sprint\s+Consulting/i.test(link.textContent || '');
    }) || null;
  }

  function alignMaterialCheckerHeader() {
    if (!isMaterialChecker()) return;
    const brandLink = findCheckerBrandLink();
    if (!brandLink) return;
    brandLink.classList.add('upskill-checker-brand-link');
    brandLink.setAttribute('href', '/');
    const header = brandLink.closest('header') || brandLink.closest('[class*="header"]');
    if (header) header.classList.add('upskill-checker-header');
    const brandRow = brandLink.parentElement;
    if (brandRow) brandRow.classList.add('upskill-checker-brand-row');

    const root = header || brandRow || document.body;
    const badge = Array.from(root.querySelectorAll('span,div,strong,b,a')).find(function (element) {
      if (!element || element === brandLink || brandLink.contains(element) || element.children.length) return false;
      return (element.textContent || '').trim().toUpperCase() === 'US';
    });
    if (badge && !badge.querySelector('img')) {
      const logo = document.createElement('img');
      logo.src = '/assets/logo-icon.png';
      logo.alt = 'UpSkill Sprint Consulting logo';
      logo.width = 38;
      logo.height = 38;
      badge.replaceChildren(logo);
      badge.classList.add('upskill-checker-logo-slot');
    }
  }

  function textIncludes(element, text) {
    return Boolean(element && (element.textContent || '').toLowerCase().includes(text.toLowerCase()));
  }

  function markCard(element) {
    const card = element && (
      element.closest('section') ||
      element.closest('[class*="card"]') ||
      element.closest('[class*="panel"]')
    );
    if (card) card.classList.add('upskill-tool-card');
    return card;
  }

  function polishMaterialChecker() {
    if (!isMaterialChecker()) return;

    document.documentElement.classList.add('upskill-material-checker-polished');

    const title = Array.from(document.querySelectorAll('h1')).find(function (el) {
      return textIncludes(el, 'Material Specification Compliance Checker');
    });
    const hero = title && (title.closest('section') || title.parentElement);
    if (hero) hero.classList.add('upskill-tool-hero');

    document.querySelectorAll('button, a, [role="button"]').forEach(function (control) {
      const text = (control.textContent || control.value || '').replace(/\s+/g, ' ').trim();
      if (/1\.5\s*[×x]\s*72\s*plate\s*check/i.test(text)) control.remove();
      if (/evaluate selected sections/i.test(text)) control.classList.add('upskill-primary-action');
    });

    Array.from(document.querySelectorAll('strong,h3,h4')).forEach(function (heading) {
      if (textIncludes(heading, 'Important engineering-use notice') || textIncludes(heading, 'Accuracy control')) {
        const notice = heading.closest('div,aside,section');
        if (notice) notice.classList.add('upskill-notice');
      }
    });

    const workbenchHeading = Array.from(document.querySelectorAll('h2,h3')).find(function (el) {
      return textIncludes(el, 'Independent compliance workbench');
    });
    const workbench = markCard(workbenchHeading);
    if (workbench) {
      const checkboxes = Array.from(workbench.querySelectorAll('input[type="checkbox"]'));
      const holders = checkboxes.map(function (box) {
        return box.closest('label') || box.parentElement;
      }).filter(Boolean);
      const common = holders.length && holders[0].parentElement;
      if (common && holders.every(function (holder) { return holder.parentElement === common; })) {
        common.classList.add('upskill-scope-options');
      }
      const evaluate = Array.from(workbench.querySelectorAll('button,[role="button"]')).find(function (el) {
        return textIncludes(el, 'Evaluate selected sections');
      });
      if (evaluate && evaluate.parentElement) evaluate.parentElement.classList.add('upskill-action-row');
    }

    Array.from(document.querySelectorAll('h2,h3')).forEach(function (heading) {
      if (/material and comparison scope/i.test(heading.textContent || '')) {
        const card = markCard(heading);
        const parent = heading.parentElement;
        if (parent) parent.classList.add('upskill-section-heading');
        const number = parent && Array.from(parent.children).find(function (child) {
          return /^1$/.test((child.textContent || '').trim());
        });
        if (number) number.classList.add('upskill-section-number');

        if (card) {
          const candidates = Array.from(card.querySelectorAll('div')).filter(function (el) {
            const controls = el.querySelectorAll('input,select,textarea');
            return controls.length >= 4 && el.children.length >= 3;
          });
          candidates.sort(function (a,b) { return a.children.length - b.children.length; });
          const grid = candidates[0];
          if (grid) grid.classList.add('upskill-form-grid');

          Array.from(card.querySelectorAll('p,div')).forEach(function (el) {
            if (textIncludes(el, 'Row-by-row units take priority') && el.children.length < 3) {
              el.classList.add('upskill-helper-copy','upskill-full-field');
            }
          });

          Array.from(card.querySelectorAll('label')).forEach(function (label) {
            const text = (label.textContent || '').trim();
            const holder = label.closest('div');
            if (!holder) return;
            if (/original certified specification|target specification \/ grade/i.test(text)) {
              holder.classList.add('upskill-wide-field');
            }
          });

          const actions = Array.from(card.querySelectorAll('button,[role="button"]')).filter(function (el) {
            return /load worked example|clear/i.test((el.textContent || '').trim());
          });
          if (actions.length && actions[0].parentElement) actions[0].parentElement.classList.add('upskill-action-row');
        }
      }
    });
  }

  function repairEngineeringToolsCleanRoute() {
    if (normalizedCurrentPath() !== '/engineering-tools') return;
    const tools = [
      {id:'materials-quality',path:'/tools/material-specification-compliance-checker',action:'Open checker',label:'Open Material Specification Compliance Checker'},
      {id:'engineering-calculators',path:'/tools/engineering-statistics-calculator',action:'Open calculator',label:'Open Engineering and Statistics Calculator',title:'Engineering &amp; Statistics Calculator',description:'Scientific calculations, descriptive statistics and regression, probability distributions, reliability metrics, and hypothesis-test workflows.'},
      {id:'converters',path:'/tools/unit-converter',action:'Open converter',label:'Open Engineering Unit Converter'}
    ];
    tools.forEach(function (tool) {
      const card = document.getElementById(tool.id);
      if (!card) return;
      card.setAttribute('href',tool.path);
      card.classList.remove('is-planned');
      card.setAttribute('aria-label',tool.label);
      const status = card.querySelector('.tool-status');
      if (status) { status.textContent='Available'; status.classList.add('available'); }
      const action = card.querySelector('.tool-link');
      if (action) { action.textContent=tool.action; action.classList.remove('secondary'); action.classList.add('primary'); }
      const heading = card.querySelector('.tool-content h2');
      if (heading && tool.title) heading.innerHTML=tool.title;
      const description = card.querySelector('.tool-content p');
      if (description && tool.description) description.textContent=tool.description;
    });
  }

  function runAll() {
    scan(document);
    cleanCanonicalAndSocialUrls();
    alignMaterialCheckerHeader();
    polishMaterialChecker();
    repairEngineeringToolsCleanRoute();
  }

  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    requestAnimationFrame(function () {
      scanScheduled = false;
      runAll();
    });
  }

  function initialize() {
    ensureStyles();
    cleanBrowserAddress();
    runAll();

    const observer = new MutationObserver(function (mutations) {
      const relevant = mutations.some(function (mutation) {
        return mutation.type === 'characterData' || mutation.addedNodes.length > 0;
      });
      if (relevant) scheduleScan();
    });
    observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
    window.addEventListener('load',scheduleScan,{once:true});
    window.setTimeout(scheduleScan,250);
    window.setTimeout(scheduleScan,900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',initialize,{once:true});
  } else {
    initialize();
  }
}());
