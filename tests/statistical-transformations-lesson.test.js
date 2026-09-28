'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SLUG = 'statistical-transformations';
const RELATIVE_FILE = `lessons/data-analytics/${SLUG}.html`;
const ROUTE = `/lessons/data-analytics/${SLUG}`;
const FILE = path.join(ROOT, RELATIVE_FILE);
const html = fs.readFileSync(FILE, 'utf8');
const guide = fs.readFileSync(path.join(ROOT, 'docs', 'LESSON_CREATION_GUIDE.md'), 'utf8');
const catalog = fs.readFileSync(path.join(ROOT, 'chi-square-lesson-library.js'), 'utf8');
const staticDom = new JSDOM(html, { url: `https://upskillsprint.com${ROUTE}` });
const doc = staticDom.window.document;

function count(source, needle) {
  return source.split(needle).length - 1;
}

function normalizedText(element) {
  return element.textContent.replace(/\s+/g, ' ').trim();
}

function runtimeDom() {
  const dom = new JSDOM(html, {
    url: `https://upskillsprint.com${ROUTE}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  for (const script of dom.window.document.querySelectorAll('script:not([src])')) {
    dom.window.eval(script.textContent);
  }
  return dom;
}

function canonicalQuizGrader(source) {
  const match = source.match(
    /<script>\s*\(function \(\) \{\s*'use strict';\s*var form = document\.getElementById\('quiz-form'\)[\s\S]*?<\/script>/
  );
  assert.ok(match, 'canonical quiz grader is present');
  return match[0];
}

test('metadata, route, and Public access match the requested lesson contract', () => {
  assert.ok(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  const raw = html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/);
  assert.ok(raw, 'metadata block exists');
  const meta = JSON.parse(raw[1]);

  assert.deepEqual(
    {
      title: meta.title,
      slug: meta.slug,
      category: meta.category,
      category_slug: meta.category_slug,
      level: meta.level,
      lesson_type: meta.lesson_type,
      estimated_minutes: meta.estimated_minutes,
      interactive: meta.interactive,
      card_title: meta.card_title,
      suggested_github_path: meta.suggested_github_path
    },
    {
      title: 'Statistical Transformations',
      slug: SLUG,
      category: 'Data Analytics',
      category_slug: 'data-analytics',
      level: 'Beginner',
      lesson_type: 'General',
      estimated_minutes: 45,
      interactive: true,
      card_title: 'Statistical Transformations',
      suggested_github_path: RELATIVE_FILE
    }
  );
  assert.equal(meta.card_description.length > 20, true);
  assert.ok(Array.isArray(meta.search_keywords) && meta.search_keywords.length >= 5);
  assert.equal(new Set(meta.search_keywords).size, meta.search_keywords.length);
  assert.ok(meta.search_keywords.every(keyword => keyword === keyword.toLowerCase()));
  assert.equal(doc.title, meta.title);
  assert.equal(normalizedText(doc.querySelector('#lesson-content h1')), meta.title);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, `https://upskillsprint.com${ROUTE}`);

  for (const gate of ['data-require-auth', 'data-required-access', 'data-access-resource']) {
    assert.equal(doc.body.hasAttribute(gate), false, `Public lesson must not carry ${gate}`);
  }
});

test('shared assets, body integration, canonical chrome, and category return are exact', () => {
  for (const tag of [
    '<link rel="stylesheet" href="/style.css">',
    '<link rel="stylesheet" href="/lessons-theme.css">',
    '<script src="/theme.js"></script>',
    '<script src="/site-sections.js"></script>'
  ]) {
    assert.equal(count(html, tag), 1, `exactly one ${tag}`);
  }
  assert.ok(
    html.indexOf('/lessons-theme.css') < html.indexOf('id="statistical-transformations-style"'),
    'lesson CSS follows the shared stylesheets'
  );
  assert.equal(count(html, '<html'), 1);
  assert.equal(count(html, '<head>'), 1);
  assert.equal(count(html, '<body'), 1);
  assert.equal(doc.body.dataset.lessonPage, 'true');
  assert.equal(doc.body.dataset.category, 'data-analytics');
  assert.equal(doc.body.dataset.level, 'beginner');
  assert.equal(doc.body.dataset.interactive, 'true');
  assert.equal(doc.body.dataset.lessonType, 'general');
  assert.equal(doc.querySelectorAll('main#lesson-content').length, 1);
  assert.equal(doc.querySelector('#lesson-progress-widget'), null);
  assert.doesNotMatch(html, /YOUR PROGRESS/i);

  const expectedHeader = guide.split('### 4.1 Header')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  const expectedFooter = guide.split('### 4.2 Footer')[1].match(/```html\n([\s\S]*?)\n```/)[1];
  const actualHeader = html.match(/<input type="checkbox" id="mnav-check"[\s\S]*?<\/header>/)[0];
  const actualFooter = html.match(/<footer class="site">[\s\S]*?<\/footer>/)[0];
  assert.equal(actualHeader.trim(), expectedHeader.trim());
  assert.equal(actualFooter.trim(), expectedFooter.trim());

  const back = doc.querySelector('[aria-label="Return to lesson category"] a');
  assert.equal(back.getAttribute('href'), '/lessons#data-analytics');
  assert.match(back.textContent, /Back to Data Analytics lessons/);
});

test('lesson-owned styles stay scoped and preserve the dedicated minor-grid treatment', () => {
  const styles = [
    doc.getElementById('statistical-transformations-style'),
    doc.getElementById('statistical-transformations-dark')
  ];
  assert.ok(styles.every(Boolean), 'light and dark lesson styles exist');
  for (const style of styles) {
    for (const match of style.textContent.matchAll(/(--[\w-]+)\s*:/g)) {
      assert.match(match[1], /^--stat-transform-/, `${match[1]} is lesson-namespaced`);
    }
    function inspect(rules) {
      for (const rule of rules) {
        if (rule.selectorText) {
          for (const selector of rule.selectorText.split(/,(?![^()]*\))/)) {
            assert.match(
              selector.trim(),
              /#lesson-content|\[aria-label="Return to lesson category"\]/,
              `unscoped lesson selector: ${selector}`
            );
          }
        }
        if (rule.cssRules) inspect(rule.cssRules);
      }
    }
    inspect(style.sheet.cssRules);
  }
  assert.match(
    doc.getElementById('statistical-transformations-style').textContent,
    /\.axis-grid--minor\{[^}]*stroke-width:\.8/
  );
  assert.equal(doc.body.lastElementChild.id, 'statistical-transformations-dark');
});

test('the four transformations retain explanation, real use, rule, and interactive control', () => {
  const section = doc.getElementById('methods');
  const methods = [...section.querySelectorAll('details.method-row')];
  assert.equal(methods.length, 4);
  assert.deepEqual(methods.map(method => normalizedText(method.querySelector('.method-name strong'))), [
    'Log transformation',
    'Square root',
    'Reciprocal',
    'Scaling & centering'
  ]);
  assert.deepEqual(methods.map(method => normalizedText(method.querySelector('.method-formula'))), [
    '\\(y=\\log_{10}(x)\\)',
    '\\(y=\\sqrt{x}\\)',
    '\\(y=\\frac{1}{x}\\)',
    '\\(z=\\frac{x-\\bar{x}}{s}\\)'
  ]);
  for (const method of methods) {
    assert.ok(method.querySelector('.method-explanation h3'));
    assert.ok(method.querySelector('.use-case'));
    assert.ok(method.querySelector('.mini-mapping'));
    assert.match(method.textContent, /REAL USE/);
    assert.match(method.textContent, /Remember:/);
  }
  for (const key of ['log', 'sqrt', 'reciprocal', 'zscore']) {
    assert.ok(doc.querySelector(`button[data-transform="${key}"]`), `${key} control exists`);
  }
  assert.match(section.textContent, /Salary or house prices/);
  assert.match(section.textContent, /Defects per batch/);
  assert.match(section.textContent, /Production cycle time/);
  assert.match(section.textContent, /Machine learning/);
});

test('learner-facing equations use the repository MathJax and LaTeX convention', () => {
  const mathJax = doc.querySelector('script[src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js"]');
  assert.ok(mathJax);
  assert.equal(mathJax.hasAttribute('defer'), true);
  assert.match(html, /inlineMath:\s*\[\['\\\\\(', '\\\\\)'\]\]/);
  assert.match(html, /displayMath:\s*\[\['\\\\\[', '\\\\\]'\]\]/);
  assert.match(html, /processEscapes:\s*true/);
  assert.match(html, /svg:\s*\{\s*fontCache:\s*'global'\s*\}/);

  const transformEquations = [...doc.querySelectorAll('.transform-chip small')].map(normalizedText);
  assert.deepEqual(transformEquations, [
    '\\(y=x\\)',
    '\\(y=\\log_{10}(x)\\)',
    '\\(y=\\sqrt{x}\\)',
    '\\(y=\\frac{1}{x}\\)',
    '\\(z=\\frac{x-\\bar{x}}{s}\\)'
  ]);

  const quizText = normalizedText(doc.getElementById('quiz'));
  for (const equation of [
    '\\(\\log_{10}(\\text{salary})\\)',
    '\\(\\sqrt{x}\\)',
    '\\(\\frac{1}{x}\\)',
    '\\(z_i=\\frac{x_i-\\bar{x}}{s}\\)',
    '\\(0.2\\,\\text{item}\\,\\mathrm{min}^{-1}=12\\,\\text{items}\\,\\mathrm{h}^{-1}\\)'
  ]) {
    assert.ok(quizText.includes(equation), equation + ' appears as LaTeX');
  }
  assert.doesNotMatch(quizText, /log₁₀|√x|1 ÷ x|x̄/);
  assert.match(html, /setMathHtml\(\$\('#storyMethod'\),story\.storyMethod\)/);
  assert.match(html, /setMathHtml\(\$\('#mappingExamples'\)/);
  assert.match(html, /setMathHtml\(\$\('#meansStory'\)/);
});

test('transformation playground executes each rule and enforces zero-value constraints', () => {
  const dom = runtimeDom();
  const { document: runtimeDoc, Event } = dom.window;
  try {
    const expectedTitles = {
      log: 'After \\(\\log_{10}\\)',
      sqrt: 'After \\(\\sqrt{x}\\)',
      reciprocal: 'After \\(1/x\\)',
      zscore: 'After \\(z\\)-score'
    };
    for (const [key, title] of Object.entries(expectedTitles)) {
      runtimeDoc.querySelector('[data-dataset="salary"]').click();
      runtimeDoc.querySelector(`[data-transform="${key}"]`).click();
      assert.equal(runtimeDoc.getElementById('afterTitle').textContent, title);
      const svg = runtimeDoc.querySelector('#transformedHistogram svg[role="img"]');
      assert.ok(svg, `${key} renders an accessible SVG histogram`);
      assert.ok(svg.querySelector('title').textContent.length > 0);
      assert.ok(svg.querySelector('desc').textContent.length > 20);
    }

    runtimeDoc.querySelector('[data-dataset="defects"]').click();
    assert.equal(runtimeDoc.querySelector('[data-transform="sqrt"]').getAttribute('aria-pressed'), 'true');
    assert.equal(runtimeDoc.querySelector('[data-transform="log"]').getAttribute('aria-disabled'), 'true');
    assert.equal(runtimeDoc.querySelector('[data-transform="reciprocal"]').getAttribute('aria-disabled'), 'true');
    assert.equal(runtimeDoc.getElementById('afterTitle').textContent, 'After \\(\\sqrt{x}\\)');

    runtimeDoc.querySelector('[data-dataset="cycle"]').click();
    assert.equal(runtimeDoc.querySelector('[data-transform="reciprocal"]').getAttribute('aria-pressed'), 'true');
    assert.equal(runtimeDoc.getElementById('transformedUnit').textContent, '\\(\\text{items}\\,\\mathrm{min}^{-1}\\)');

    runtimeDoc.querySelector('[data-dataset="salary"]').click();
    runtimeDoc.querySelector('[data-transform="zscore"]').click();
    assert.equal(runtimeDoc.getElementById('transformedUnit').textContent, '\\(z=\\frac{x-\\bar{x}}{s}\\)');
    const slider = runtimeDoc.getElementById('outlierSlider');
    slider.value = '2.5';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    assert.equal(runtimeDoc.getElementById('outlierOutput').textContent, '2.5×');
    assert.equal(
      runtimeDoc.querySelector('#mappingExamples span:last-child b').textContent.replace(/[,\s\\()]/g, ''),
      '1025'
    );
    assert.ok(runtimeDoc.querySelector('#originalHistogram svg[role="img"]'));
    assert.ok(runtimeDoc.querySelector('#transformedHistogram svg[role="img"]'));
  } finally {
    dom.window.close();
  }
});

test('linear, semi-log, and log-log SVGs preserve points and draw both minor-grid directions', () => {
  const dom = runtimeDom();
  const runtimeDoc = dom.window.document;
  try {
    const storedPointRegion = runtimeDoc.querySelector('.axis-values');
    assert.equal(storedPointRegion.getAttribute('role'), 'region');
    assert.equal(storedPointRegion.tabIndex, 0);
    assert.match(storedPointRegion.getAttribute('aria-label'), /scroll horizontally/i);
    const storedPoints = [...storedPointRegion.querySelectorAll('code')].map(code => code.textContent);
    assert.deepEqual(storedPoints, [
      '(1,1)', '(5,8)', '(10,9)', '(50,55)', '(100,90)', '(500,600)', '(1000,1000)'
    ]);
    const expected = {
      linear: { vertical: 16, horizontal: 16, major: 8, equation: 'x: linear · y: linear' },
      semilog: { vertical: 16, horizontal: 24, major: 7, equation: 'x: linear · y: logarithmic' },
      loglog: { vertical: 24, horizontal: 24, major: 6, equation: 'x: logarithmic · y: logarithmic' }
    };

    for (const [mode, values] of Object.entries(expected)) {
      runtimeDoc.querySelector(`[data-axis="${mode}"]`).click();
      const chart = runtimeDoc.getElementById('axisChart');
      const svg = chart.querySelector('svg[role="img"]');
      assert.ok(svg, `${mode} renders an accessible SVG`);
      assert.match(svg.querySelector('desc').textContent, /major and minor grid lines on both axes/);
      assert.equal(chart.querySelectorAll('.axis-point').length, 7);
      assert.equal(chart.querySelectorAll('.axis-point[tabindex], .axis-point[role]').length, 0);
      assert.equal(runtimeDoc.querySelector(`[data-axis="${mode}"]`).getAttribute('aria-pressed'), 'true');
      assert.equal(runtimeDoc.getElementById('axisEquation').textContent, values.equation);

      const minor = [...chart.querySelectorAll('line.axis-grid--minor')];
      const vertical = minor.filter(line => line.getAttribute('x1') === line.getAttribute('x2'));
      const horizontal = minor.filter(line => line.getAttribute('y1') === line.getAttribute('y2'));
      assert.equal(vertical.length, values.vertical, `${mode} vertical minor-grid lines`);
      assert.equal(horizontal.length, values.horizontal, `${mode} horizontal minor-grid lines`);
      assert.equal(new Set(vertical.map(line => line.getAttribute('x1'))).size, values.vertical);
      assert.equal(new Set(horizontal.map(line => line.getAttribute('y1'))).size, values.horizontal);
      assert.equal(chart.querySelectorAll('line.axis-grid:not(.axis-grid--minor)').length, values.major);
      assert.deepEqual(
        [...runtimeDoc.querySelectorAll('.axis-values code')].map(code => code.textContent),
        storedPoints,
        `${mode} does not alter the stored data`
      );
    }
  } finally {
    dom.window.close();
  }
});

test('Statistics Implementation contains the four required parts and usable software guidance', () => {
  const section = doc.getElementById('statistics-implementation');
  assert.ok(section);
  assert.deepEqual([...section.querySelectorAll('article > h3')].map(heading => heading.textContent), [
    'Excel Functions', 'Excel Use Cases', 'Minitab Navigation', 'Exam Tips'
  ]);
  const table = section.querySelector('table');
  assert.ok(table);
  assert.deepEqual([...table.querySelectorAll('thead th')].map(cell => cell.textContent), [
    'Function', 'Syntax', 'Purpose', 'When to use it'
  ]);
  const wrapper = table.parentElement;
  assert.ok(wrapper.classList.contains('table-wrap'));
  assert.equal(wrapper.getAttribute('role'), 'region');
  assert.equal(wrapper.tabIndex, 0);
  assert.match(doc.getElementById('statistical-transformations-style').textContent, /\.table-wrap\{[^}]*overflow-x:auto/);
  for (const token of ['LOG10', 'SQRT', '=1/A2', 'STANDARDIZE', 'GEOMEAN', 'HARMEAN']) {
    assert.ok(section.textContent.includes(token), `${token} is documented`);
  }
  for (const route of [
    'Calc → Calculator',
    'Calc → Standardize',
    'Graph → Graph Builder → Scatterplot'
  ]) {
    assert.ok(section.textContent.includes(route), `${route} is documented`);
  }
  assert.match(section.textContent, /ASQ CSSBB\/CQE/);
  assert.match(section.textContent, /In real projects:/);
});

test('canonical five-question quiz reports unanswered, correct, and incorrect results', () => {
  assert.equal(
    html.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0],
    guide.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0]
  );
  assert.equal(canonicalQuizGrader(html), canonicalQuizGrader(guide));

  const dom = runtimeDom();
  const runtimeDoc = dom.window.document;
  try {
    const questions = [...runtimeDoc.querySelectorAll('#quiz .quiz-question')];
    assert.equal(questions.length, 5);
    for (const question of questions) {
      assert.ok(question.dataset.explanation);
      assert.ok(question.querySelector(`input[value="${question.dataset.answer}"]`));
      assert.ok(question.querySelectorAll('input[type="radio"]').length >= 3);
    }

    let reported = null;
    runtimeDoc.addEventListener('upskill-quiz-result', event => { reported = event.detail; });
    runtimeDoc.getElementById('quiz-submit').click();
    assert.deepEqual({ score: reported.score, total: reported.total }, { score: 0, total: 5 });
    assert.match(runtimeDoc.getElementById('quiz-result').textContent, /5 unanswered/);

    for (const question of questions) {
      question.querySelector(`input[value="${question.dataset.answer}"]`).checked = true;
    }
    runtimeDoc.getElementById('quiz-submit').click();
    assert.deepEqual({ score: reported.score, total: reported.total }, { score: 5, total: 5 });
    assert.equal(runtimeDoc.querySelectorAll('.quiz-question.is-correct').length, 5);

    questions[0].querySelector('input[value="a"]').checked = true;
    runtimeDoc.getElementById('quiz-submit').click();
    assert.deepEqual({ score: reported.score, total: reported.total }, { score: 4, total: 5 });
    assert.ok(questions[0].classList.contains('is-incorrect'));
  } finally {
    dom.window.close();
  }
});

test('catalog registration is unique, literal, and preserves the build insertion point', () => {
  const marker = "marker: 'data-statistical-transformations'";
  const route = `path: '${ROUTE}'`;
  assert.equal(count(catalog, marker), 1);
  assert.equal(count(catalog, route), 1);
  const start = catalog.indexOf(marker);
  const entry = catalog.slice(start, catalog.indexOf('    },', start));
  assert.match(entry, /sectionId: 'data-analytics'/);
  assert.match(entry, /topic: 'data-analytics'/);
  assert.match(entry, /level: 'beginner'/);
  assert.match(entry, /interactive: 'true'/);
  assert.match(entry, /<span>45 min<\/span>/);
  assert.match(entry, /title: 'Statistical Transformations'/);
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  assert.doesNotMatch(catalog, /(?:DecompressionStream|atob|eval)\s*\(/);
  assert.doesNotThrow(() => new Function(catalog), 'catalog remains plain parseable JavaScript');
  assert.ok(fs.existsSync(path.join(ROOT, `${ROUTE}.html`)), 'pretty catalog route resolves to the lesson file');
});
