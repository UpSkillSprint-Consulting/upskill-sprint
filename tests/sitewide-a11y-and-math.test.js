const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const read = (file) => fs.readFileSync(file, 'utf8');

function runInPage(html, scriptFile) {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://upskillsprint.com/lessons/example' });
  dom.window.eval(read(scriptFile));
  return dom;
}

test('shared lesson CSS fixes dark-mode contrast for the copy-exact quiz kicker and back link', () => {
  const css = read('lessons-theme.css');
  assert.match(css, /html\[data-theme="dark"\]\s+\.quiz-section\s+\.lesson-kicker\s*\{\s*color:\s*#7dd3fc;?\s*\}/);
  assert.match(css, /html\[data-theme="dark"\]\s+\[aria-label="Return to lesson category"\]\s+a\s*\{\s*color:\s*#7dd3fc\s*!important;?\s*\}/);
});

test('mobile menu: label loses the prohibited aria-label and a real button drives the menu', () => {
  const html = `<!doctype html><html><head></head><body>
    <input type="checkbox" id="mnav" class="mnav-check" aria-hidden="true">
    <header class="site"><div class="wrap"><nav class="desktop-nav" aria-label="Main navigation"><a href="/">Home</a></nav>
    <div class="header-actions">
    <label for="mnav" class="mobile-menu-btn" aria-label="Open menu"><svg aria-hidden="true"></svg></label></div></div></header>
    <main id="main"><h1>Lesson</h1></main><footer class="site"></footer></body></html>`;
  const dom = runInPage(html, 'site-sections.js');
  const doc = dom.window.document;
  doc.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  const label = doc.querySelector('label[for="mnav"]');
  assert.equal(label.hasAttribute('aria-label'), false, 'aria-label is not allowed on <label>');
  assert.equal(label.getAttribute('aria-hidden'), 'true', 'label is a pointer-only duplicate');
  const button = label.previousElementSibling;
  assert.ok(button && button.matches('button.uss-menu-toggle[type="button"]'), 'button inserted next to the label');
  assert.ok(button.closest('header'), 'button sits inside the banner landmark');
  assert.equal(button.textContent, 'Open menu');
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  const box = doc.getElementById('mnav');
  button.click();
  assert.equal(box.checked, true);
  assert.equal(button.getAttribute('aria-expanded'), 'true');
  doc.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(box.checked, false);
  assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(box.getAttribute('aria-hidden'), 'true', 'checkbox stays hidden from assistive technology');
  assert.ok(doc.getElementById('uss-mobile-menu-a11y'), 'menu a11y styles injected');
});

test('site-sections injected header markup no longer puts aria-label on the label', () => {
  const source = read('site-sections.js');
  assert.doesNotMatch(source, /class="mobile-menu-btn" aria-label=/);
  assert.match(source, /function enhanceMobileMenuButtons\(\)/);
});

test('lesson progress widget is created inside a complementary landmark', () => {
  const source = read('progress.js');
  assert.match(source, /document\.createElement\('aside'\);\s*container\.id = 'lesson-progress-widget';\s*container\.setAttribute\('aria-label', 'Lesson progress'\);/);
  assert.match(source, /function labelWidgetLandmark\(element\)/);
});

test('shared math include pins MathJax 3 with SRI and only \\( \\) / \\[ \\] delimiters', () => {
  const dom = runInPage('<!doctype html><html><head></head><body><p>\\(x\\)</p></body></html>', 'assets/js/math.js');
  const { window } = dom;
  const script = window.document.getElementById('MathJax-script');
  assert.ok(script, 'MathJax script appended');
  assert.equal(script.getAttribute('src'), 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js');
  assert.match(script.getAttribute('integrity'), /^sha384-[A-Za-z0-9+/]{64}$/);
  assert.equal(script.getAttribute('crossorigin'), 'anonymous');
  const config = window.MathJax;
  assert.deepEqual(JSON.parse(JSON.stringify(config.tex.inlineMath)), [['\\(', '\\)']]);
  assert.deepEqual(JSON.parse(JSON.stringify(config.tex.displayMath)), [['\\[', '\\]']]);
  assert.doesNotMatch(JSON.stringify(config.tex), /\$/);
  assert.equal(config.options.menuOptions.settings.assistiveMml, true);
  assert.equal(typeof window.UpskillMath.typeset, 'function');
  assert.equal(window.UpskillMath.version, '3.2.2');
});

test('proof lesson uses only the shared math include', () => {
  const html = read('lessons/statistics/understanding-dot-notation.html');
  assert.match(html, /<script defer src="\/assets\/js\/math\.js"><\/script>/);
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net\/npm\/mathjax/);
  assert.doesNotMatch(html, /window\.MathJax\s*=/);
});
