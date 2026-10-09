/*
 * Shared equation rendering for the material tools.
 *
 * The calculators keep their authoritative numeric expressions in JavaScript
 * data.  This small presentation layer turns the expressions that are exposed
 * to users into real TeX before MathJax typesets them.  The original readable
 * wording remains available through aria-labels and the TeX source itself, so
 * the page still communicates when a renderer is unavailable.
 */
(() => {
  'use strict';

  const MATH_SOURCES = [
    'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js'
  ];

  const CE_IIW = String.raw`\mathrm{CE}_{\mathrm{IIW}} = C + \frac{\mathrm{Mn}}{6} + \frac{\mathrm{Cr}+\mathrm{Mo}+V}{5} + \frac{\mathrm{Ni}+\mathrm{Cu}}{15}`;
  const CE_CSA = String.raw`\mathrm{CE}_{\mathrm{CSA}} = C + F\left(\frac{\mathrm{Mn}}{6} + \frac{\mathrm{Si}}{24} + \frac{\mathrm{Cu}}{15} + \frac{\mathrm{Ni}}{20} + \frac{\mathrm{Cr}+\mathrm{Mo}+V+\mathrm{Nb}}{5} + 5B\right),\quad F = \begin{cases}0.53,&C<0.06\\0.75+0.25\tanh\!\left(20(C-0.12)\right),&C\ge 0.06\end{cases}`;
  const P_CM = String.raw`P_{\mathrm{cm}} = C + \frac{\mathrm{Si}}{30} + \frac{\mathrm{Mn}+\mathrm{Cu}+\mathrm{Cr}}{20} + \frac{\mathrm{Ni}}{60} + \frac{\mathrm{Mo}}{15} + \frac{V}{10} + 5B`;
  const HYDRO = String.raw`P = \frac{2St}{D}`;

  const FORMULA_PATTERNS = [
    {
      regex: /\bC\s*\+\s*Mn\s*\/\s*6\s*\+\s*\(\s*Cr\s*\+\s*Mo\s*\+\s*V\s*\)\s*\/\s*5\s*\+\s*\(\s*Ni\s*\+\s*Cu\s*\)\s*\/\s*15\b/i,
      tex: CE_IIW
    },
    {
      regex: /\bCE[_\s-]*IIW\s*=\s*C\s*\+\s*Mn\s*\/\s*6\s*\+\s*\(\s*Cr\s*\+\s*Mo\s*\+\s*V\s*\)\s*\/\s*5\s*\+\s*\(\s*Ni\s*\+\s*Cu\s*\)\s*\/\s*15\b/i,
      tex: CE_IIW
    },
    {
      regex: /\bC\s*\+\s*Si\s*\/\s*30\s*\+\s*\(\s*Mn\s*\+\s*Cu\s*\+\s*Cr\s*\)\s*\/\s*20\s*\+\s*Ni\s*\/\s*60\s*\+\s*Mo\s*\/\s*15\s*\+\s*V\s*\/\s*10\s*\+\s*5B\b/i,
      tex: P_CM
    },
    {
      regex: /\bPcm\s*=\s*C\s*\+\s*Si\s*\/\s*30\s*\+\s*\(\s*Mn\s*\+\s*Cu\s*\+\s*Cr\s*\)\s*\/\s*20\s*\+\s*Ni\s*\/\s*60\s*\+\s*Mo\s*\/\s*15\s*\+\s*V\s*\/\s*10\s*\+\s*5B\b/i,
      tex: P_CM
    },
    {
      regex: /\bC\s*\+\s*F\s*[×x*]\s*\(\s*Mn\s*\/\s*6\s*\+\s*Si\s*\/\s*24\s*\+\s*Cu\s*\/\s*15\s*\+\s*Ni\s*\/\s*20\s*\+\s*\(\s*Cr\s*\+\s*Mo\s*\+\s*V\s*\+\s*Nb\s*\)\s*\/\s*5\s*\+\s*5B\s*\)/i,
      tex: CE_CSA
    },
    {
      regex: /\bCSA\s+CE\s*=\s*C\s*\+\s*F\s*[×x*]\s*\(.*?\)\s*;\s*F\s*=.*$/i,
      tex: CE_CSA
    },
    {
      regex: /\be(?:_min)?\s*=\s*(?:1940|1244\.71)\s*[×x*]?\s*A\^?0\.2\s*(?:÷|\/)\s*U\^?0\.9\b/i,
      tex: match => /1244\.71/i.test(match) ? String.raw`e_{\min} = \frac{1244.71\,A^{0.2}}{U^{0.9}}` : String.raw`e_{\min} = \frac{1940\,A^{0.2}}{U^{0.9}}`
    },
    {
      regex: /\be(?:_min)?\s*=\s*(\d+(?:\.\d+)?)\s*[×x*]\s*(\d+(?:\.\d+)?)\^?([0-9.]+)\s*(?:÷|\/)\s*(\d+(?:\.\d+)?)\^?([0-9.]+)\b/i,
      tex: (_match, groups) => String.raw`e_{\min} = \frac{${groups[1]}\,(${groups[2]})^{${groups[3]}}}{(${groups[4]})^{${groups[5]}}}`
    },
    {
      regex: /\be(?:_min)?\s*=\s*C\s*[×x*]\s*\(?A(?:_[A-Za-z]+)?\^?0\.2\s*\/\s*U\^?0\.9\)?\b/i,
      tex: String.raw`e_{\min} = \frac{C\,A^{0.2}}{U^{0.9}}`
    },
    {
      regex: /^e(?:_min)?\s*=\s*C\s*[·×x*]\s*\(?A(?:_([A-Za-z]+))?\^?([0-9.]+)\s*\/\s*U\^?([0-9.]+)\)?(?:,\s*C\s*=\s*([0-9.]+))?$/i,
      tex: (_match, groups) => String.raw`e_{\min} = C\,\frac{A${groups[1] ? String.raw`_{\mathrm{${groups[1]}}}` : ''}^{${groups[2]}}}{U^{${groups[3]}}}${groups[4] ? String.raw`,\quad C = ${groups[4]}` : ''}`
    },
    {
      regex: /\bP\s*=\s*2\s*[·×x*]?\s*S\s*[·×x*]?\s*t\s*\/\s*D\b/i,
      tex: HYDRO
    },
    {
      regex: /\b2\s*S\s*t\s*\/\s*D\b/i,
      tex: String.raw`\frac{2St}{D}`
    },
    {
      regex: /\bSub-size requirement\s*=\s*Full-size requirement\s*[×x*]\s*Stored factor\b/i,
      tex: String.raw`\text{Sub-size requirement} = \text{Full-size requirement}\times\text{stored factor}`
    },
    {
      regex: /\btMin\s*<\s*thickness\s*≤\s*tMax\b/i,
      tex: String.raw`t_{\min} < t \le t_{\max}`
    },
    {
      regex: /\bYield strength\s*\/\s*tensile strength\b/i,
      tex: String.raw`\frac{R_{\mathrm{e}}}{R_{\mathrm{m}}}`
    },
    {
      regex: /\b(?:Outside diameter|Width)\s*\/\s*thickness\b/i,
      tex: match => /^Width/i.test(match) ? String.raw`\frac{w}{t}` : String.raw`\frac{D}{t}`
    },
    {
      regex: /\b(\d+(?:\.\d+)?)\s*J\s*[×x*]\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)\s*J\b/i,
      tex: (_match, groups) => String.raw`${groups[1]}\,\mathrm{J}\times${groups[2]}=${groups[3]}\,\mathrm{J}`
    }
  ];

  function supportedPage() {
    return document.querySelector('body.grade-spec-tool-page, body.grade-spec-guide-page, body[data-tool-page="material-specification-compliance-checker"]');
  }

  function normalise(value) {
    return String(value == null ? '' : value).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function formulaForText(value) {
    const raw = normalise(value);
    if (!raw) return null;
    for (const pattern of FORMULA_PATTERNS) {
      pattern.regex.lastIndex = 0;
      const match = raw.match(pattern.regex);
      if (match && match.index === 0 && match[0].length === raw.length) {
        return typeof pattern.tex === 'function' ? pattern.tex(match[0], match) : pattern.tex;
      }
    }

    // The governing lookup data stores the right-hand side without a label.
    if (/^C\s*\+\s*Mn\s*\/\s*6\s*\+\s*\(Cr\s*\+\s*Mo\s*\+\s*V\)\s*\/\s*5\s*\+\s*\(Ni\s*\+\s*Cu\)\s*\/\s*15$/i.test(raw)) return CE_IIW;
    if (/^C\s*\+\s*Si\s*\/\s*30\s*\+\s*\(Mn\s*\+\s*Cu\s*\+\s*Cr\)\s*\/\s*20\s*\+\s*Ni\s*\/\s*60\s*\+\s*Mo\s*\/\s*15\s*\+\s*V\s*\/\s*10\s*\+\s*5B$/i.test(raw)) return P_CM;
    if (/^C\s*\+\s*F\s*[×x*]/i.test(raw)) return CE_CSA;
    if (/^P\s*=\s*2\s*[·×x*]?\s*S\s*[·×x*]?\s*t\s*\/\s*D$/i.test(raw)) return HYDRO;
    if (/^e(?:_min)?\s*=\s*\d+(?:\.\d+)?\s*[×x*]?\s*A\^?0\.2\s*(?:÷|\/)\s*U\^?0\.9$/i.test(raw)) {
      return /1244\.71/i.test(raw) ? String.raw`e_{\min} = \frac{1244.71\,A^{0.2}}{U^{0.9}}` : String.raw`e_{\min} = \frac{1940\,A^{0.2}}{U^{0.9}}`;
    }
    return null;
  }

  function mathElement(tex, fallback, display = false) {
    const element = document.createElement(display ? 'div' : 'span');
    element.className = display ? 'math-display' : 'math-inline';
    element.dataset.upskillMath = 'true';
    element.dataset.latex = tex;
    element.setAttribute('aria-label', fallback || tex);
    element.textContent = display ? `\\[${tex}\\]` : `\\(${tex}\\)`;
    return element;
  }

  function decorateFormulaElement(element) {
    if (!(element instanceof Element) || element.dataset.upskillMathDone === 'true') return false;
    if (element.closest('pre')) return false;
    const htmlSource = element.innerHTML
      .replace(/<sub>\s*([^<]+?)\s*<\/sub>/gi, '_$1')
      .replace(/<sup>\s*([^<]+?)\s*<\/sup>/gi, '^$1')
      .replace(/<[^>]*>/g, '');
    const raw = normalise(htmlSource || element.textContent);
    const tex = element.dataset.latex || formulaForText(raw);
    if (!tex) return false;
    const fallback = raw;
    element.replaceChildren(mathElement(tex, fallback, element.classList.contains('formula-box')));
    element.dataset.upskillMathDone = 'true';
    element.setAttribute('aria-label', fallback);
    return true;
  }

  function decorateKnownText(root) {
    let changed = false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    for (const textNode of nodes) {
      const parent = textNode.parentElement;
      if (!parent || parent.closest('[data-upskill-math], mjx-container, script, style, textarea, input, select, option, pre')) continue;
      const value = textNode.nodeValue || '';
      let cursor = 0;
      let fragment = null;
      while (cursor < value.length) {
        let next = null;
        for (const pattern of FORMULA_PATTERNS) {
          pattern.regex.lastIndex = 0;
          const match = pattern.regex.exec(value.slice(cursor));
          if (!match) continue;
          if (!next || match.index < next.index) next = {pattern, match, index: match.index};
        }
        if (!next) break;
        const absolute = cursor + next.index;
        if (!fragment) fragment = document.createDocumentFragment();
        if (absolute > cursor) fragment.append(value.slice(cursor, absolute));
        const tex = typeof next.pattern.tex === 'function' ? next.pattern.tex(next.match[0], next.match) : next.pattern.tex;
        fragment.append(mathElement(tex, next.match[0]));
        cursor = absolute + next.match[0].length;
        changed = true;
      }
      if (fragment) {
        if (cursor < value.length) fragment.append(value.slice(cursor));
        textNode.replaceWith(fragment);
      }
    }
    return changed;
  }

  function decorate(root) {
    let changed = false;
    root.querySelectorAll('.formula, .formula-rule > .formula, .calc-result code, .snapshot-formula code').forEach((element) => {
      changed = decorateFormulaElement(element) || changed;
    });
    changed = decorateKnownText(root) || changed;
    return changed;
  }

  let loadPromise;
  function loadMathJax() {
    if (window.MathJax?.tex2svgPromise && window.MathJax?.typesetPromise) return Promise.resolve(window.MathJax);
    if (loadPromise) return loadPromise;
    loadPromise = (async () => {
      for (const source of MATH_SOURCES) {
        try {
          window.MathJax = {
            startup: {typeset: false},
            tex: {inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']], processEscapes: true, tags: 'none'},
            svg: {fontCache: 'local', scale: 1},
            options: {enableMenu: false, skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']}
          };
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = source;
            script.async = true;
            script.dataset.upskillMathjax = 'true';
            script.onload = resolve;
            script.onerror = () => { script.remove(); reject(new Error('Equation renderer could not be loaded.')); };
            document.head.append(script);
          });
          await Promise.race([
            window.MathJax.startup.promise,
            new Promise((_, reject) => window.setTimeout(() => reject(new Error('Equation renderer timed out.')), 15000))
          ]);
          if (typeof window.MathJax.typesetPromise !== 'function') throw new Error('Equation renderer did not initialize.');
          window.MathJax.startup.document.updateDocument();
          return window.MathJax;
        } catch (_error) {
          document.querySelectorAll('script[data-upskill-mathjax]').forEach(script => script.remove());
        }
      }
      throw new Error('Equation renderer unavailable.');
    })();
    return loadPromise;
  }

  let typesetQueued = false;
  let typesetting = false;
  async function typeset(root) {
    if (typesetting || !root) return;
    typesetting = true;
    try {
      const math = await loadMathJax();
      await math.typesetPromise([root]);
      root.querySelectorAll('[data-upskill-math="true"]').forEach(element => { element.dataset.upskillMathTypeset = 'true'; });
      root.dataset.mathRenderer = 'ready';
    } catch (_error) {
      root.dataset.mathRenderer = 'fallback';
    } finally {
      typesetting = false;
    }
  }

  function schedule(root) {
    if (typesetQueued) return;
    typesetQueued = true;
    window.setTimeout(() => {
      typesetQueued = false;
      if (decorate(root)) typeset(root);
      else if (root.querySelector('[data-upskill-math="true"]:not([data-upskill-math-typeset])')) typeset(root);
    }, 0);
  }

  function init() {
    const root = supportedPage();
    if (!root) return;
    // Lookup has a single #app subtree; the standalone checker renders into
    // several siblings, so observe the page body in that case.
    const observeRoot = root.querySelector('#app') || root;
    const observer = new MutationObserver(() => schedule(observeRoot));
    observer.observe(observeRoot, {subtree: true, childList: true, characterData: true});
    window.UpSkillMaterialMath = {decorate: () => { decorate(observeRoot); schedule(observeRoot); }, typeset: () => typeset(observeRoot), formulaForText};
    schedule(observeRoot);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
