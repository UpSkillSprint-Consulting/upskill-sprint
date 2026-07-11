(function () {
  'use strict';

  const REQUEST_URL = '/request-topic?topic=DMAIC%20Formula%20Encyclopedia&format=HTML%2FPDF';
  const REMOVED_HERO_BADGES = new Set([
    'mathjax stacked equations',
    'searchable',
    'print-ready'
  ]);
  let searchTimer = null;
  let searchInstalled = false;

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function addStyles() {
    if (document.getElementById('upskill-dmaic-fixes')) return;

    const style = document.createElement('style');
    style.id = 'upskill-dmaic-fixes';
    style.textContent = `
      [data-upskill-hidden="true"] { display: none !important; }

      #searchInput {
        transition: border-color .16s ease, box-shadow .16s ease, background-color .16s ease;
      }
      #searchInput.upskill-search-pending {
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px rgba(14, 165, 233, .12) !important;
      }
      #searchInput.upskill-search-running {
        cursor: progress !important;
      }

      .upskill-format-request {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 42px !important;
        padding: 10px 15px !important;
        border: 1px solid #f59e0b !important;
        border-radius: 9px !important;
        background: #fff7ed !important;
        color: #9a3412 !important;
        font-weight: 750 !important;
        text-decoration: none !important;
        white-space: nowrap !important;
      }
      .upskill-format-request:hover,
      .upskill-format-request:focus {
        background: #ffedd5 !important;
        color: #7c2d12 !important;
        text-decoration: none !important;
        outline: 3px solid rgba(245, 158, 11, .18) !important;
        outline-offset: 2px !important;
      }

      .upskill-scope-summary { padding: 22px 24px !important; }
      .upskill-scope-summary h2,
      .upskill-scope-summary h3 { margin: 0 0 9px !important; }
      .upskill-scope-summary p {
        margin: 0 !important;
        max-width: 1120px !important;
      }

      .upskill-finance-formulas {
        display: grid !important;
        gap: 16px !important;
        width: 100% !important;
        padding: 26px clamp(14px, 4vw, 34px) !important;
        color: #172033 !important;
        font-family: Georgia, "Times New Roman", serif !important;
        font-size: clamp(17px, 2vw, 22px) !important;
        line-height: 1.3 !important;
      }
      .upskill-formula-row {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        text-align: center !important;
      }
      .upskill-formula-label { white-space: nowrap !important; }
      .upskill-fraction {
        display: inline-grid !important;
        grid-template-rows: auto auto !important;
        align-items: center !important;
        min-width: 150px !important;
        text-align: center !important;
        vertical-align: middle !important;
      }
      .upskill-fraction > span:first-child {
        padding: 0 7px 3px !important;
        border-bottom: 1.5px solid currentColor !important;
      }
      .upskill-fraction > span:last-child { padding: 3px 7px 0 !important; }
      html[data-theme="dark"] .upskill-finance-formulas { color: #f4f7fb !important; }

      @media (max-width: 620px) {
        .upskill-formula-row {
          flex-direction: column !important;
          gap: 5px !important;
        }
        .upskill-fraction { min-width: min(100%, 250px) !important; }
      }
      @media print {
        .upskill-format-request { display: none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function removeUnwantedNavigationAndBadges() {
    document.querySelectorAll('.upskill-lesson-sitebar a, .upskill-lesson-sitebar button').forEach(function (element) {
      if (normalize(element.textContent) === 'back to home') element.remove();
    });

    document.querySelectorAll('.header-badge, .chip, .badge, .pill, a, button, [role="button"], li, span').forEach(function (element) {
      if (!REMOVED_HERO_BADGES.has(normalize(element.textContent))) return;
      const removable = element.closest('.header-badge, a, button, [role="button"], li') || element;
      removable.remove();
    });
  }

  function replaceDownloadControls() {
    const controls = Array.from(document.querySelectorAll('a, button, [role="button"]'));
    const targets = controls.filter(function (element) {
      const text = normalize(element.textContent);
      return text === 'print / pdf' || text === 'print/pdf' ||
        text === 'download this html' || text === 'download html';
    });

    if (!targets.length) return;

    const first = targets[0];
    const request = document.createElement('a');
    request.href = REQUEST_URL;
    request.className = 'upskill-format-request';
    request.textContent = 'Ask for HTML/PDF format';
    request.setAttribute('aria-label', 'Request the DMAIC Formula Encyclopedia in HTML or PDF format');

    first.replaceWith(request);
    targets.slice(1).forEach(function (element) { element.remove(); });
  }

  function replaceScopeSection() {
    const heading = Array.from(document.querySelectorAll('h1, h2, h3, h4')).find(function (element) {
      return normalize(element.textContent) === 'validation statement and scope';
    });
    if (!heading) return;

    let panel = heading.parentElement;
    while (panel && panel !== document.body) {
      const text = normalize(panel.textContent);
      if (text.includes('formula coverage') && text.includes('excluded duplication')) break;
      panel = panel.parentElement;
    }
    if (!panel || panel === document.body) panel = heading.parentElement;
    if (!panel || panel.dataset.upskillScopeFixed === 'true') return;

    panel.dataset.upskillScopeFixed = 'true';
    panel.classList.add('upskill-scope-summary');
    panel.innerHTML = `
      <h2>Scope summary</h2>
      <p>This encyclopedia summarizes formula families used for CSSBB, CQE, and CMBB study across Pre-DMAIC and the Define, Measure, Analyze, Improve, and Control phases. Coverage includes business measures, statistics, measurement systems, capability, hypothesis testing, regression, design of experiments, reliability, optimization, and process control.</p>`;
  }

  function financeFormulaMarkup() {
    return `
      <div class="upskill-finance-formulas" role="group" aria-label="Revenue growth, market share, and profit margin formulas">
        <div class="upskill-formula-row">
          <span class="upskill-formula-label">Revenue Growth (%)</span><span>=</span>
          <span class="upskill-fraction"><span>R<sub>t</sub> − R<sub>t−1</sub></span><span>R<sub>t−1</sub></span></span>
          <span>× 100</span>
        </div>
        <div class="upskill-formula-row">
          <span class="upskill-formula-label">Market Share (%)</span><span>=</span>
          <span class="upskill-fraction"><span>Organization Sales</span><span>Total Market Sales</span></span>
          <span>× 100</span>
        </div>
        <div class="upskill-formula-row">
          <span class="upskill-formula-label">Gross Margin (%)</span><span>=</span>
          <span class="upskill-fraction"><span>Revenue − COGS</span><span>Revenue</span></span>
          <span>× 100</span>
        </div>
        <div class="upskill-formula-row">
          <span class="upskill-formula-label">Operating Margin (%)</span><span>=</span>
          <span class="upskill-fraction"><span>Operating Income</span><span>Revenue</span></span>
          <span>× 100</span>
        </div>
        <div class="upskill-formula-row">
          <span class="upskill-formula-label">Net Margin (%)</span><span>=</span>
          <span class="upskill-fraction"><span>Net Income</span><span>Revenue</span></span>
          <span>× 100</span>
        </div>
      </div>`;
  }

  function replaceFinanceFormulas() {
    const title = Array.from(document.querySelectorAll('h1, h2, h3, h4, strong')).find(function (element) {
      return normalize(element.textContent) === 'revenue growth, market share and profit margins';
    });
    if (!title) return;

    let card = title.parentElement;
    while (card && card !== document.body) {
      const text = normalize(card.textContent);
      if (text.includes('gross margin') && text.includes('operating margin') && text.includes('exam trap')) break;
      card = card.parentElement;
    }
    if (!card || card === document.body || card.dataset.upskillFinanceFixed === 'true') return;

    const mathNodes = Array.from(card.querySelectorAll('mjx-container'));
    let host = null;

    if (mathNodes.length) {
      host = mathNodes[0];
      while (host && host !== card && !mathNodes.every(function (node) { return host.contains(node); })) {
        host = host.parentElement;
      }
    }

    if (!host || host === card) {
      const candidates = Array.from(card.querySelectorAll('div, section, p')).filter(function (element) {
        const text = normalize(element.textContent);
        return text.includes('revenue growth') && text.includes('market share') &&
          text.includes('gross margin') && text.includes('operating margin') && text.includes('net margin');
      });
      candidates.sort(function (a, b) {
        return a.querySelectorAll('*').length - b.querySelectorAll('*').length;
      });
      host = candidates[0] || null;
    }

    if (!host || host === card) return;
    host.outerHTML = financeFormulaMarkup();
    card.dataset.upskillFinanceFixed = 'true';
  }

  function installFastSearch() {
    if (searchInstalled) return;

    const input = document.getElementById('searchInput');
    if (!input) return;

    try {
      formulas.forEach(function (formula) {
        formula.__upskillSearchText = [
          formula.id,
          formula.phase,
          formula.family,
          formula.title,
          formula.exams.join(' '),
          formula.eq,
          formula.use,
          formula.trap,
          formula.source
        ].join(' ').toLowerCase();
      });

      filteredFormulas = function fastFilteredFormulas() {
        const query = input.value.trim().toLowerCase();
        const phase = document.getElementById('phaseFilter').value;
        const exam = document.getElementById('examFilter').value;
        const family = document.getElementById('familyFilter').value;

        return formulas.filter(function (formula) {
          return (
            (!query || formula.__upskillSearchText.includes(query)) &&
            (!phase || formula.phase === phase) &&
            (!exam || formula.exams.includes(exam)) &&
            (!family || formula.family === family) &&
            (!highYieldOnly || formula.high)
          );
        });
      };
    } catch (error) {
      console.warn('Search index optimization was not applied.', error);
    }

    function runSearchNow() {
      window.clearTimeout(searchTimer);
      input.classList.remove('upskill-search-pending');
      input.classList.add('upskill-search-running');
      input.setAttribute('aria-busy', 'true');

      window.requestAnimationFrame(function () {
        try {
          render();
        } finally {
          window.setTimeout(function () {
            input.classList.remove('upskill-search-running');
            input.removeAttribute('aria-busy');
            replaceFinanceFormulas();
          }, 0);
        }
      });
    }

    function scheduleSearch(event) {
      event.stopImmediatePropagation();
      window.clearTimeout(searchTimer);
      input.classList.add('upskill-search-pending');
      input.setAttribute('aria-busy', 'true');

      searchTimer = window.setTimeout(runSearchNow, input.value ? 140 : 0);
    }

    input.addEventListener('input', scheduleSearch, true);
    input.addEventListener('search', scheduleSearch, true);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopImmediatePropagation();
        runSearchNow();
      }
      if (event.key === 'Escape' && input.value) {
        event.preventDefault();
        event.stopImmediatePropagation();
        input.value = '';
        runSearchNow();
      }
    }, true);

    searchInstalled = true;
  }

  function observeFormulaRoot() {
    const root = document.getElementById('formulaRoot');
    if (!root || root.dataset.upskillObserved === 'true') return;

    root.dataset.upskillObserved = 'true';
    const observer = new MutationObserver(function (mutations) {
      if (!mutations.some(function (mutation) { return mutation.addedNodes.length || mutation.removedNodes.length; })) return;
      window.requestAnimationFrame(replaceFinanceFormulas);
    });
    observer.observe(root, { childList: true, subtree: false });
  }

  function blockLegacyDownloads(event) {
    const target = event.target instanceof Element ? event.target.closest('a, button, [role="button"]') : null;
    if (!target) return;

    const text = normalize(target.textContent);
    const isLegacyDownload = text === 'print / pdf' || text === 'print/pdf' ||
      text === 'download this html' || text === 'download html';

    if (isLegacyDownload) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  function applyStaticFixes() {
    addStyles();
    removeUnwantedNavigationAndBadges();
    replaceDownloadControls();
    replaceScopeSection();
    replaceFinanceFormulas();
    installFastSearch();
    observeFormulaRoot();
  }

  function initialize() {
    document.addEventListener('click', blockLegacyDownloads, true);
    applyStaticFixes();

    [200, 600, 1200, 2500].forEach(function (delay) {
      window.setTimeout(applyStaticFixes, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
