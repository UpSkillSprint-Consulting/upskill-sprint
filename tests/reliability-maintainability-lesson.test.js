'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const RELATIVE_FILE = 'lessons/quality-engineering/introduction-to-reliability-and-maintainability.html';
const FILE = path.join(ROOT, RELATIVE_FILE);
const html = fs.readFileSync(FILE, 'utf8');
const guide = fs.readFileSync(path.join(ROOT, 'docs', 'LESSON_CREATION_GUIDE.md'), 'utf8');
const catalog = fs.readFileSync(path.join(ROOT, 'chi-square-lesson-library.js'), 'utf8');
const sharedCss = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8')
  + '\n' + fs.readFileSync(path.join(ROOT, 'lessons-theme.css'), 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

function count(source, needle) {
  return source.split(needle).length - 1;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function quizGrader(source) {
  const match = source.match(/<script>\s*\(function \(\) \{\s*'use strict';\s*var form = document\.getElementById\('quiz-form'\)[\s\S]*?<\/script>/);
  assert.ok(match, 'canonical quiz grader is present');
  return match[0];
}

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(part => parseInt(part, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const first = luminance(a), second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

test('metadata, route, and public access match the lesson request', () => {
  assert.ok(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
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
      suggested_github_path: meta.suggested_github_path
    },
    {
      title: 'Introduction to Reliability and Maintainability',
      slug: 'introduction-to-reliability-and-maintainability',
      category: 'Quality Engineering',
      category_slug: 'quality-engineering',
      level: 'Intermediate',
      lesson_type: 'General',
      estimated_minutes: 60,
      interactive: true,
      suggested_github_path: RELATIVE_FILE
    }
  );
  assert.equal(doc.title, meta.title);
  assert.equal(doc.querySelector('#lesson-content h1').textContent, meta.title);
  assert.equal(meta.card_title, meta.title);
  assert.ok(meta.card_description.length > 20);
  assert.ok(meta.search_keywords.length >= 5);
  assert.equal(new Set(meta.search_keywords).size, meta.search_keywords.length);
  assert.ok(meta.search_keywords.every(keyword => keyword === keyword.toLowerCase()));
  assert.equal(doc.querySelector('link[rel="canonical"]').href,
    'https://upskillsprint.com/lessons/quality-engineering/introduction-to-reliability-and-maintainability');
  for (const gate of ['data-require-auth', 'data-required-access', 'data-access-resource']) {
    assert.equal(doc.body.hasAttribute(gate), false, 'public lesson must not use ' + gate);
  }
});

test('canonical assets, body integration, site chrome, and category return are exact', () => {
  for (const tag of [
    '<link rel="stylesheet" href="/style.css">',
    '<link rel="stylesheet" href="/lessons-theme.css">',
    '<script src="/theme.js"></script>',
    '<script src="/site-sections.js"></script>'
  ]) assert.equal(count(html, tag), 1, 'exactly one ' + tag);
  assert.ok(html.indexOf('/lessons-theme.css') < html.indexOf('id="reliability-lesson-style"'));
  assert.equal(count(html, '<html'), 1);
  assert.equal(count(html, '<head>'), 1);
  assert.equal(count(html, '<body'), 1);
  assert.equal(doc.body.getAttribute('data-lesson-page'), 'true');
  assert.equal(doc.body.dataset.category, 'quality-engineering');
  assert.equal(doc.body.dataset.level, 'intermediate');
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
  const returnSection = doc.querySelector('[aria-label="Return to lesson category"]');
  assert.equal(returnSection.querySelector('a').getAttribute('href'), '/lessons#quality-engineering');
  assert.match(returnSection.textContent, /Back to Quality Engineering lessons/);
});

test('all supplied teaching content and headings are preserved apart from the requested title rename', () => {
  const copy = doc.querySelector('#lesson-content').cloneNode(true);
  copy.querySelector('#pdf-cdf-relationship-explorer').remove();
  copy.querySelector('#sec-statistics-implementation').remove();
  copy.querySelector('a[href="#sec-statistics-implementation"]').closest('li').remove();
  copy.querySelector('h1').textContent = 'Calculus of Reliability';
  const originalText = copy.textContent.replace(/\s+/g, ' ').trim();
  assert.equal(originalText.length, 21366);
  assert.equal(sha256(originalText), 'f58fe5216040b49c57f4d8d1026fc517f255855cb102fe6228877c09d887499c');

  copy.querySelector('h1').textContent = 'Introduction to Reliability and Maintainability';
  const headings = [...copy.querySelectorAll('h1,h2,h3,h4')].map(element => [element.tagName, element.textContent.trim()]);
  assert.deepEqual(headings, [
    ['H1', 'Introduction to Reliability and Maintainability'],
    ['H2', 'What Is Reliability? What Is Maintainability?'],
    ['H4', 'Reliability'], ['H4', 'Maintainability'],
    ['H3', "The vocabulary, defined before it's used"],
    ['H4', 'Non-repairable item'], ['H4', 'Repairable item'],
    ['H2', 'Repairable vs. Non-Repairable Systems'],
    ['H4', 'Non-repairable'], ['H4', 'Repairable'],
    ['H2', 'Model Controls'], ['H2', 'Core Calculus Relationship'],
    ['H3', 'CDF → PDF via differentiation'], ['H3', 'PDF → CDF via integration'],
    ['H3', 'Extending to Reliability'], ['H3', 'Hazard Rate — the conditional rate'],
    ['H3', 'Tying it back together (integrate to recover R)'], ['H3', 'Summary Chain'],
    ['H3', 'Worked example'], ['H2', 'The Bathtub Curve'],
    ['H2', 'Failure Rate vs. ROCOF'], ['H4', 'Hazard rate h(x)'], ['H4', 'ROCOF ρ(t)'],
    ['H2', 'Maintainability'], ['H2', 'Maintainability Controls'],
    ['H2', 'Availability'], ['H2', 'Availability Calculator'], ['H2', 'Index Summary']
  ]);
});

test('lesson CSS is isolated from shared chrome and supplies accessible theme contrast', () => {
  const ownStyles = ['reliability-lesson-style', 'reliability-dark-overrides']
    .map(id => doc.getElementById(id));
  const sharedProperties = new Set([...sharedCss.matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1]));
  const sharedClasses = new Set([...sharedCss.matchAll(/\.([A-Za-z][\w-]*)/g)].map(match => match[1]));
  const protectedSelectors = [
    'header', 'footer', '.site', '.brand', '.footer-grid', '.footer-bottom', '.desktop-nav',
    '.lesson-sitebar', '.theme-toggle', '.theme-control', '.mobile-menu-btn', '.header-actions'
  ];
  for (const style of ownStyles) {
    for (const match of style.textContent.matchAll(/(--[\w-]+)\s*:/g)) {
      assert.ok(match[1].startsWith('--reliability-'), match[1] + ' must be namespaced');
      assert.equal(sharedProperties.has(match[1]), false, match[1] + ' collides with site CSS');
    }
    function inspect(rules) {
      for (const rule of rules) {
        if (rule.selectorText) {
          for (const selector of protectedSelectors) {
            const escaped = selector.replace('.', '\\.');
            assert.doesNotMatch(rule.selectorText, new RegExp('(^|[\\s,>+~])' + escaped + '(?=[$\\s.#:[>+~])'), rule.selectorText);
          }
        }
        if (rule.style && /(?:^|;)\s*background(?:-color)?\s*:/.test(rule.style.cssText)) {
          assert.match(rule.style.cssText, /(?:^|;)\s*color\s*:/, rule.selectorText + ' needs an intentional text color');
        }
        if (rule.cssRules) inspect(rule.cssRules);
      }
    }
    inspect(style.sheet.cssRules);
  }
  const lessonClasses = new Set([...ownStyles[0].textContent.matchAll(/\.([A-Za-z][\w-]*)/g)].map(match => match[1]));
  assert.deepEqual([...lessonClasses].filter(name => sharedClasses.has(name)), []);
  assert.ok(html.lastIndexOf('id="reliability-dark-overrides"') > html.lastIndexOf('</script>'));
  assert.equal(doc.body.lastElementChild.id, 'reliability-dark-overrides');

  const pairs = [
    ['#17324a', '#eef4f8', 4.5], ['#3f5e75', '#eef4f8', 4.5], ['#075f78', '#eef4f8', 4.5],
    ['#71879a', '#eef4f8', 3], ['#71879a', '#ffffff', 3],
    ['#e8f1f7', '#071120', 4.5], ['#b2c6d8', '#071120', 4.5], ['#5bc5e2', '#071120', 4.5],
    ['#526f8a', '#0d1b30', 3], ['#04141f', '#5bc5e2', 4.5]
  ];
  for (const [foreground, background, minimum] of pairs) {
    assert.ok(contrast(foreground, background) >= minimum, `${foreground} on ${background}`);
  }
});

test('charts, controls, tables, and responsive behavior have accessibility guards', () => {
  const ids = [...doc.querySelectorAll('[id]')].map(element => element.id);
  assert.equal(new Set(ids).size, ids.length, 'element ids must be unique');
  for (const link of doc.querySelectorAll('#toc a[href^="#"]')) {
    assert.ok(doc.getElementById(link.hash.slice(1)), link.hash + ' must resolve');
  }
  assert.equal(doc.querySelectorAll('#lesson-content table').length, 6);
  for (const table of doc.querySelectorAll('#lesson-content table')) {
    const wrapper = table.parentElement;
    assert.ok(wrapper.classList.contains('reliability-table-scroll'));
    assert.equal(wrapper.getAttribute('role'), 'region');
    assert.ok(wrapper.getAttribute('aria-label'));
    assert.equal(wrapper.tabIndex, 0);
  }
  const css = doc.getElementById('reliability-lesson-style').textContent;
  assert.match(css, /\.reliability-table-scroll\s*\{[^}]*overflow-x:auto/);
  assert.match(css, /@media \(max-width:640px\)/);
  for (const input of doc.querySelectorAll('#lesson-content input[type="range"]')) {
    assert.ok(input.getAttribute('aria-label'));
    const steps = (+input.value - +input.min) / +input.step;
    assert.ok(Math.abs(steps - Math.round(steps)) < 1e-8, input.id + ' default must align to its step');
  }
  for (const button of doc.querySelectorAll('button')) assert.equal(button.type, 'button');
  for (const graphic of doc.querySelectorAll('#lesson-content canvas, #lesson-content svg')) {
    assert.equal(graphic.getAttribute('role'), 'img');
    assert.ok(graphic.getAttribute('aria-label'));
  }
  assert.doesNotMatch(html, /var\(--reliability-(?:survival|hazard)-color\)[0-9a-fA-F]{2}/);
  assert.doesNotMatch(html, /ctx\.strokeStyle\s*=\s*['"]#1b3350/);
  assert.match(html, /window\.addEventListener\('upskill:themechange'/);
  assert.match(css, /\.gauge-label\s*\{[^}]*background:var\(--reliability-panel\)[^}]*color:var\(--reliability-text\)/);
  assert.match(doc.getElementById('reliability-dark-overrides').textContent,
    /\.quiz-section \.lesson-kicker\s*\{[^}]*color:#7dd3fc/);
});

test('all shipped interactives initialize and update from their real event handlers', () => {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .filter(match => !match[0].includes(' src='))
    .map(match => match[1]);
  assert.equal(scripts.length, 2);
  for (const script of scripts) assert.doesNotThrow(() => new Function(script));

  const runtime = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = runtime;
  const noop = () => {};
  const context = new Proxy({
    measureText: text => ({ width: String(text).length * 6 }),
    createLinearGradient: () => ({ addColorStop: noop })
  }, {
    get(target, property) { return property in target ? target[property] : noop; },
    set(target, property, value) { target[property] = value; return true; }
  });
  window.HTMLCanvasElement.prototype.getContext = () => context;
  window.HTMLCanvasElement.prototype.getBoundingClientRect = function () {
    return { width: 420, height: +this.height || 220, top: 0, left: 0, right: 420, bottom: +this.height || 220 };
  };
  window.SVGSVGElement.prototype.getBoundingClientRect = function () {
    return { width: 520, height: 310, top: 0, left: 0, right: 520, bottom: 310 };
  };
  window.SVGSVGElement.prototype.setPointerCapture = noop;
  window.SVGSVGElement.prototype.releasePointerCapture = noop;
  window.SVGSVGElement.prototype.hasPointerCapture = () => false;
  try {
    for (const script of scripts) window.eval(script);
    const runtimeDoc = window.document;
    assert.equal(runtimeDoc.querySelector('#betaVal').textContent, '2.00');
    assert.equal(runtimeDoc.querySelector('#out-mttr').textContent, '4.79 h');
    assert.equal(runtimeDoc.querySelector('#stat-avail').textContent, '98.52%');
    assert.equal(runtimeDoc.querySelectorAll('#svg-avail-timeline rect').length, 8);
    assert.equal(runtimeDoc.querySelector('#pdf-cdf-probability').textContent, '68.27%');
    assert.equal(runtimeDoc.querySelectorAll('#pdf-cdf-pdf-plot [data-bound]').length, 2);
    assert.equal(runtimeDoc.querySelectorAll('#pdf-cdf-cdf-plot [data-bound]').length, 2);

    runtimeDoc.querySelector('.preset-btn[data-b="0.6"]').click();
    assert.equal(runtimeDoc.querySelector('#beta').value, '0.6');
    assert.equal(runtimeDoc.querySelector('#betaVal').textContent, '0.60');

    const mtbf = runtimeDoc.querySelector('#mtbf');
    const mttr = runtimeDoc.querySelector('#mttr');
    mtbf.value = '100';
    mttr.value = '25';
    mttr.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.equal(runtimeDoc.querySelector('#stat-avail').textContent, '80.00%');
    assert.equal(runtimeDoc.querySelector('#availLabel').textContent, '80.00% available');

    const pdfPlot = runtimeDoc.querySelector('#pdf-cdf-pdf-plot');
    const x1Handle = pdfPlot.querySelector('[data-bound="x1"]');
    function pointerEvent(type, clientX) {
      const event = new window.MouseEvent(type, { bubbles: true, clientX });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      return event;
    }
    x1Handle.dispatchEvent(pointerEvent('pointerdown', 235));
    pdfPlot.dispatchEvent(pointerEvent('pointermove', 279));
    pdfPlot.dispatchEvent(pointerEvent('pointerup', 279));
    assert.equal(runtimeDoc.querySelector('#pdf-cdf-x1').value, '0.0');
    assert.equal(runtimeDoc.querySelector('#pdf-cdf-x1-value').textContent, '0.0');

    const x2Handle = runtimeDoc.querySelector('#pdf-cdf-cdf-plot [data-bound="x2"]');
    x2Handle.dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowLeft' }));
    assert.equal(runtimeDoc.querySelector('#pdf-cdf-x2').value, '0.9');

    assert.doesNotThrow(() => window.dispatchEvent(new window.Event('upskill:themechange')));
  } finally {
    window.close();
  }
});

test('PDF and CDF teaching addition explains and links area, accumulation, slope, and reliability', () => {
  const section = doc.getElementById('pdf-cdf-relationship-explorer');
  assert.ok(section);
  assert.match(section.textContent, /The PDF shows where values are concentrated/);
  assert.match(section.textContent, /The slope of the CDF at any point equals the height of the PDF/);
  assert.match(section.textContent, /probability interval is the shaded area under the PDF/);
  assert.match(section.textContent, /The same calculus relationship applies to the Weibull failure-time model/);
  for (const id of ['pdf-cdf-mean', 'pdf-cdf-sd', 'pdf-cdf-x1', 'pdf-cdf-x2']) {
    assert.ok(section.querySelector('#' + id));
  }
  assert.equal(section.querySelectorAll('svg[role="img"][aria-describedby="pdf-cdf-drag-instruction"]').length, 2);
  assert.equal(section.querySelectorAll('.reliability-table-scroll[role="region"][tabindex="0"] table').length, 1);
  assert.match(html, /addEventListener\('pointerdown'/);
  assert.match(html, /addEventListener\('pointermove'/);
  assert.match(html, /setRelationshipBound\(activeDrag\.bound/);
  assert.match(html, /role=\"slider\" aria-label=\"\$\{ariaLabel\}\"/);
});

test('Statistics Implementation contains the four required parts and verified software routes', () => {
  const section = doc.getElementById('sec-statistics-implementation');
  assert.ok(section);
  assert.deepEqual([...section.querySelectorAll('h3')].slice(0, 4).map(heading => heading.textContent), [
    'Excel Functions', 'Excel Use Cases', 'Minitab Navigation', 'Exam Tips'
  ]);
  for (const functionName of ['WEIBULL.DIST', 'EXPON.DIST', 'LOGNORM.DIST', 'GAMMA']) {
    assert.match(section.textContent, new RegExp(functionName.replace('.', '\\.')));
  }
  for (const route of [
    'Stat → Reliability/Survival → Distribution Analysis (Right Censoring) → Distribution ID Plot',
    'Stat → Reliability/Survival → Distribution Analysis (Right Censoring) → Parametric Distribution Analysis',
    'Stat → Reliability/Survival → Repairable System Analysis → Parametric Growth Curve'
  ]) assert.ok(section.textContent.includes(route), route);
  assert.match(section.textContent, /ASQ CSSBB and CQE/);
  assert.equal(section.querySelectorAll('a[href*="support.microsoft.com"]').length, 4);
  assert.equal(section.querySelectorAll('a[href*="support.minitab.com"]').length, 1);
});

test('canonical quiz styles and grader are exact, and all eight questions score correctly', () => {
  assert.equal(
    html.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0],
    guide.match(/<style id="uss-quiz-style">[\s\S]*?<\/style>/)[0]
  );
  assert.equal(quizGrader(html), quizGrader(guide));
  const quiz = html.match(/<section class="quiz-section"[\s\S]*?<\/section>/)[0];
  const grader = quizGrader(html).replace(/^<script>/, '').replace(/<\/script>$/, '');
  const quizDom = new JSDOM('<!DOCTYPE html><html><body>' + quiz + '</body></html>', { runScripts: 'outside-only' });
  try {
    const quizDoc = quizDom.window.document;
    const questions = [...quizDoc.querySelectorAll('.quiz-question')];
    assert.equal(questions.length, 8);
    for (const question of questions) {
      assert.ok(question.dataset.explanation);
      assert.equal(question.querySelectorAll('input[type="radio"]').length, 4);
      question.querySelector('input[value="' + question.dataset.answer + '"]').checked = true;
    }
    let reported = null;
    quizDoc.addEventListener('upskill-quiz-result', event => { reported = event.detail; });
    quizDom.window.eval(grader);
    quizDoc.getElementById('quiz-submit').click();
    assert.deepEqual({ score: reported.score, total: reported.total }, { score: 8, total: 8 });
    assert.match(quizDoc.getElementById('quiz-result').textContent, /Score: 8 \/ 8/);
    const first = questions[0];
    first.querySelector('input:checked').checked = false;
    first.querySelector('input[value="a"]').checked = true;
    quizDoc.getElementById('quiz-submit').click();
    assert.equal(reported.score, 7);
    assert.ok(first.classList.contains('is-incorrect'));
  } finally {
    quizDom.window.close();
  }
});

test('lesson is registered once as a readable Quality Engineering catalog entry', () => {
  const marker = "marker: 'data-introduction-to-reliability-and-maintainability'";
  const route = "path: '/lessons/quality-engineering/introduction-to-reliability-and-maintainability'";
  assert.equal(count(catalog, marker), 1);
  assert.equal(count(catalog, route), 1);
  const entry = catalog.slice(catalog.indexOf(marker), catalog.indexOf('    },', catalog.indexOf(marker)));
  assert.match(entry, /sectionId: 'quality-engineering'/);
  assert.match(entry, /topic: 'quality-engineering'/);
  assert.match(entry, /level: 'intermediate'/);
  assert.match(entry, /interactive: 'true'/);
  assert.match(entry, /title: 'Introduction to Reliability and Maintainability'/);
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  assert.doesNotMatch(catalog, /(?:atob|eval)\s*\(/);
  assert.doesNotThrow(() => new Function(catalog), 'catalog remains parseable plain JavaScript');
});
