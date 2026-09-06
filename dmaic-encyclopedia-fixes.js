/* Controller for the legacy, compressed DMAIC formula data. No formula is HTML. */
(function () {
  'use strict';
  const main = document.querySelector('main');
  const root = document.getElementById('formulaRoot');
  if (!main || !root || main.dataset.dmaicEncyclopedia) return;
  if (typeof formulas === 'undefined' || typeof phaseMeta === 'undefined') return;
  main.id = 'lesson-content';
  main.tabIndex = -1;
  main.dataset.dmaicEncyclopedia = 'true';
  const byId = new Map(formulas.map(f => [f.id, f]));
  const controls = Object.fromEntries(['searchInput', 'phaseFilter', 'examFilter', 'familyFilter',
    'resetBtn', 'highYieldBtn', 'expandBtn', 'collapseBtn', 'themeBtn', 'resultCount', 'phaseNav']
    .map(id => [id, document.getElementById(id)]));
  const cards = new Map();
  const sections = new Map();
  const links = new Map();
  const indexes = new Map();
  const MATH_SOURCES = [
    'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js'
  ];
  let highOnly = false;
  let inputFrame = 0;
  let mathRun = null;
  let mathComplete = false;
  let attemptedMath = false;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function slug(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  function preparePage() {
    const title = element('h1', 'encyclopedia-title', 'DMAIC Formula Encyclopedia');
    main.prepend(title);
    const scope = main.querySelector('.validation-panel');
    if (scope) {
      scope.replaceChildren(element('h2', '', 'Scope summary'), element('p', '',
        'This encyclopedia summarizes formula families used for CSSBB, CQE, and CMBB study across Pre-DMAIC and the Define, Measure, Analyze, Improve, and Control phases. Coverage includes business measures, statistics, measurement systems, capability, hypothesis testing, regression, design of experiments, reliability, optimization, and process control.'));
    }
    const row = main.querySelector('.button-row');
    row.querySelectorAll('button').forEach(button => {
      if (button.id === 'downloadBtn' || button.hasAttribute('onclick')) button.remove();
    });
    const request = element('a', 'upskill-format-request', 'Ask for HTML/PDF format');
    request.href = '/request-topic?topic=DMAIC%20Formula%20Encyclopedia&format=HTML%2FPDF';
    row.append(request);
    controls.resultCount.setAttribute('role', 'status');
    controls.resultCount.setAttribute('aria-live', 'polite');
    controls.highYieldBtn.setAttribute('aria-pressed', 'false');
    // The existing site theme controller owns both switches and persistence.
    controls.themeBtn.setAttribute('data-theme-toggle', 'true');
    controls.themeBtn.setAttribute('role', 'switch');
    document.body.classList.remove('dark');
  }

  const status = element('div', 'math-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const statusText = element('span', '', 'Loading the equation renderer…');
  const retry = element('button', 'btn', 'Retry equations');
  retry.type = 'button';
  retry.hidden = true;
  status.append(statusText, retry);

  function buildCards() {
    root.replaceChildren();
    controls.phaseNav.replaceChildren();
    for (const [phase, meta] of Object.entries(phaseMeta)) {
      const option = element('option', '', phase); option.value = phase; controls.phaseFilter.append(option);
      const section = element('section', 'phase-section'); section.id = 'phase-' + slug(phase);
      const heading = element('div', 'phase-heading');
      const icon = element('div', 'phase-icon', meta.code); icon.style.backgroundColor = meta.color;
      const headingText = element('div');
      headingText.append(element('h2', '', phase), element('p', '', meta.description));
      heading.append(icon, headingText);
      const grid = element('div', 'cards'); section.append(heading, grid); root.append(section);
      const link = element('a', 'phase-link', phase); link.href = '#' + section.id;
      controls.phaseNav.append(link); sections.set(phase, { section, grid, description: headingText.lastChild, meta }); links.set(phase, link);
    }
    for (const family of [...new Set(formulas.map(f => f.family))].sort((a, b) => a.localeCompare(b))) {
      const option = element('option', '', family); option.value = family; controls.familyFilter.append(option);
    }
    for (const f of formulas) {
      const card = element('article', 'formula-card' + (f.high ? ' high-yield' : ''));
      card.dataset.formulaId = f.id;
      const head = element('div', 'card-head');
      const id = element('div', 'formula-id', f.id); id.style.backgroundColor = phaseMeta[f.phase].color;
      const titles = element('div', 'card-title-wrap');
      const title = element('h3', 'card-title', f.title); title.id = 'formula-title-' + f.id;
      card.setAttribute('aria-labelledby', title.id);
      titles.append(title, element('div', 'card-family', f.family + ' · ' + f.phase)); head.append(id, titles);
      if (f.high) { const star = element('span', 'star', '★'); star.setAttribute('aria-hidden', 'true'); head.append(star); }
      const tags = element('div', 'tags');
      [...f.exams, ...(f.high ? ['High yield'] : [])].forEach(tag => tags.append(element('span', 'tag', tag)));
      const box = element('div', 'formula-box');
      box.dataset.mathState = 'loading';
      box.setAttribute('aria-label', f.id + ': ' + f.title + '. Equation region; scroll horizontally when needed.');
      box.setAttribute('role', 'region');
      box.append(element('p', 'math-placeholder', 'Preparing equation…'));
      const body = element('div', 'card-body');
      for (const [label, text, klass] of [['Use:', f.use, ''], ['Exam trap:', f.trap, 'trap']]) {
        const p = element('p', klass); p.append(element('span', 'label', label), document.createTextNode(' ' + text)); body.append(p);
      }
      const details = element('details'); details.append(element('summary', '', 'Source alignment'), element('p', 'source', f.source)); body.append(details);
      card.append(head, tags, box, body); sections.get(f.phase).grid.append(card); cards.set(f.id, card);
      indexes.set(f.id, [f.id, f.phase, f.family, f.title, ...f.exams, f.eq, f.use, f.trap, f.source].join(' ').toLowerCase());
    }
    const empty = element('p', 'empty', 'No formulas match the selected filters.');
    empty.id = 'formula-empty'; empty.hidden = true; root.prepend(empty);
    controls.resultCount.closest('.result-summary').before(status);
  }

  function applyFilters() {
    if (inputFrame) { cancelAnimationFrame(inputFrame); inputFrame = 0; }
    const query = controls.searchInput.value.trim().toLowerCase();
    const phase = controls.phaseFilter.value, exam = controls.examFilter.value, family = controls.familyFilter.value;
    const counts = new Map(Object.keys(phaseMeta).map(p => [p, 0]));
    let count = 0;
    for (const f of formulas) {
      const visible = (!query || indexes.get(f.id).includes(query)) && (!phase || f.phase === phase) &&
        (!exam || f.exams.includes(exam)) && (!family || f.family === family) && (!highOnly || f.high);
      cards.get(f.id).hidden = !visible;
      if (visible) { count++; counts.set(f.phase, counts.get(f.phase) + 1); }
    }
    for (const [phase, { section, description, meta }] of sections) {
      const n = counts.get(phase); section.hidden = !n; links.get(phase).hidden = !n;
      description.textContent = meta.description + ' ' + n + ' formula ' + (n === 1 ? 'family.' : 'families.');
    }
    document.getElementById('formula-empty').hidden = count !== 0;
    controls.resultCount.textContent = count + ' formula families shown of ' + formulas.length;
    controls.searchInput.removeAttribute('aria-busy');
    requestAnimationFrame(updateOverflow);
  }

  function updateOverflow() {
    for (const card of cards.values()) {
      if (card.hidden || card.closest('.phase-section').hidden) continue;
      const box = card.querySelector('.formula-box');
      const overflows = box.scrollWidth > box.clientWidth + 2;
      box.classList.toggle('has-overflow', overflows);
      if (overflows) box.tabIndex = 0; else box.removeAttribute('tabindex');
    }
  }
  function syncTheme() {
    const dark = document.documentElement.dataset.theme === 'dark';
    document.body.classList.remove('dark');
    controls.themeBtn.textContent = dark ? 'Light mode' : 'Dark mode';
    controls.themeBtn.setAttribute('aria-checked', String(dark));
    controls.themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  function bindControls() {
    controls.searchInput.addEventListener('input', () => {
      controls.searchInput.setAttribute('aria-busy', 'true');
      if (inputFrame) cancelAnimationFrame(inputFrame);
      inputFrame = requestAnimationFrame(applyFilters);
    });
    controls.searchInput.addEventListener('search', applyFilters);
    controls.searchInput.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); controls.searchInput.value = ''; applyFilters(); }
      if (event.key === 'Enter') { event.preventDefault(); applyFilters(); }
    });
    ['phaseFilter', 'examFilter', 'familyFilter'].forEach(id => controls[id].addEventListener('change', applyFilters));
    controls.resetBtn.addEventListener('click', () => {
      ['searchInput', 'phaseFilter', 'examFilter', 'familyFilter'].forEach(id => { controls[id].value = ''; });
      highOnly = false; controls.highYieldBtn.textContent = 'High-yield only'; controls.highYieldBtn.setAttribute('aria-pressed', 'false'); applyFilters();
    });
    controls.highYieldBtn.addEventListener('click', () => {
      highOnly = !highOnly; controls.highYieldBtn.textContent = highOnly ? 'Show all formulas' : 'High-yield only';
      controls.highYieldBtn.setAttribute('aria-pressed', String(highOnly)); applyFilters();
    });
    controls.expandBtn.addEventListener('click', () => root.querySelectorAll('details').forEach(d => { d.open = true; }));
    controls.collapseBtn.addEventListener('click', () => root.querySelectorAll('details').forEach(d => { d.open = false; }));
    window.addEventListener('upskill:themechange', syncTheme);
    new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', updateOverflow);
    // A small-screen toolbar must not cover the entire reading viewport.
    const header = document.querySelector('header.site');
    if (header && window.ResizeObserver) {
      new ResizeObserver(() => main.style.setProperty('--sitebar-height', Math.ceil(header.getBoundingClientRect().height) + 'px')).observe(header);
    }
    syncTheme();
  }

  async function loadMathJax() {
    // Each attempt has one script and one startup promise. No concurrent typesetting.
    for (const src of MATH_SOURCES) {
      try {
        window.MathJax = {
          startup: { typeset: false },
          tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']], processEscapes: true, tags: 'none' },
          svg: { fontCache: 'local', scale: 1 },
          options: { enableMenu: false }
        };
        await new Promise((resolve, reject) => {
          const script = document.createElement('script'); script.src = src; script.async = true;
          script.dataset.dmaicMathjax = 'true';
          script.onload = resolve;
          script.onerror = () => { script.remove(); reject(new Error('Equation renderer could not be loaded.')); };
          document.head.append(script);
        });
        await window.MathJax.startup.promise;
        if (typeof window.MathJax.tex2svgPromise !== 'function') throw new Error('Equation renderer did not initialize.');
        return window.MathJax;
      } catch (error) {
        document.querySelectorAll('script[data-dmaic-mathjax]').forEach(script => script.remove());
      }
    }
    throw new Error('Both equation-renderer sources were unavailable.');
  }

  function startMath() {
    if (mathRun) return mathRun;
    mathRun = (async () => {
      mathComplete = false;
      retry.hidden = true; status.hidden = false; statusText.textContent = 'Loading the equation renderer…';
      main.dataset.mathStatus = 'loading';
      const slow = setTimeout(() => { if (!mathComplete) statusText.textContent = 'Equations are still loading. Search and filters remain available; please check your connection.'; }, 8000);
      let engine;
      try {
        const reusable = !attemptedMath && window.MathJax?.tex2svgPromise;
        attemptedMath = true;
        engine = reusable ? window.MathJax : await loadMathJax();
        await engine.startup.promise;
        let failures = 0;
        // Convert directly from the authoritative strings, not browser-parsed HTML.
        // Per-card conversion isolates a malformed formula and never rebuilds the grid.
        for (const [id, card] of cards) {
          const box = card.querySelector('.formula-box');
          try {
            const rendered = await engine.tex2svgPromise(byId.get(id).eq, { display: true });
            if (rendered.querySelector('[data-mjx-error], [data-mml-node="merror"], mjx-merror')) throw new Error('Invalid equation: ' + id);
            box.replaceChildren(rendered); box.dataset.mathState = 'ready';
          } catch (error) {
            failures++;
            box.replaceChildren(element('p', 'math-placeholder', 'This equation could not be displayed. Use Retry equations below the filters.'));
            box.dataset.mathState = 'error';
            console.error('DMAIC equation ' + id + ' could not be rendered.', error);
          }
        }
        if (failures) throw new Error(failures + ' equations need another rendering attempt.');
        mathComplete = true; main.dataset.mathStatus = 'ready';
        statusText.textContent = 'All ' + formulas.length + ' formula families are ready. Wide equations scroll horizontally.';
        updateOverflow();
      } catch (error) {
        main.dataset.mathStatus = 'error';
        statusText.textContent = 'Some equations could not be loaded. Check your connection, then retry. Your filters have been kept.';
        retry.hidden = false;
        for (const card of cards.values()) {
          const box = card.querySelector('.formula-box');
          if (box.dataset.mathState === 'loading') { box.dataset.mathState = 'error'; box.firstChild.textContent = 'Equation unavailable until the renderer loads.'; }
        }
      } finally { clearTimeout(slow); }
    })().finally(() => { mathRun = null; });
    return mathRun;
  }

  preparePage(); buildCards(); bindControls(); applyFilters();
  retry.addEventListener('click', startMath);
  startMath();
}());
