const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');
const slug = 'variance-covariance-correlation-and-coefficient-of-variation';
const html = fs.readFileSync(path.join(root, 'lessons/statistics', slug + '.html'), 'utf8');
const doc = new JSDOM(html).window.document;
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);

// Browser DOM textContent fingerprints of the original PR 168 lesson, including formatting whitespace.
// Source blob: 8f6f24e03c4be2fa2ba29aebae9b314f6b0d7287. Both original and fixed DOMs match.
test('Spread Lab preserves every character of teaching text and all 30 headings', () => {
  assert.equal(hash(doc.querySelector('#lesson-content').textContent), '229270599ac66652fd9d6957ea9d9413bd17925a0b8eae5135f7965f4955f662');
  assert.equal(hash(doc.querySelector('#quiz').textContent), 'b255dce5bf101aca285c65077115b3aeb8452b916f13af0ae594d8236eade21c');
  assert.equal(doc.querySelectorAll('#lesson-content :is(h1,h2,h3,h4), #quiz :is(h1,h2,h3,h4)').length, 30);
});

test('Spread Lab preserves all original formulas, datasets, calculations and quiz grading logic', () => {
  const scripts = [...doc.querySelectorAll('script:not([src]):not(#sl-presentation-controls)')];
  assert.equal(scripts.length, 2);
  assert.deepEqual(scripts.map(s => hash(s.textContent.replaceAll('--lesson-sl-', '--sl-'))), [
    'ac61d1b8ad560c052234fe1c7a72ee67ba253dacb9d47607e5bb686464cc780f',
    '420fc7efd459ae5901b87bca8eb6e5d5e9aecc93fa82c1a9d1d072666eb59246'
  ]);
  assert.equal(doc.querySelectorAll('.quiz-question').length, 6);
  assert.equal(doc.querySelectorAll('.katex-box').length, 36);
  for (const q of doc.querySelectorAll('.quiz-question')) {
    assert.ok(q.dataset.explanation);
    assert.ok(q.querySelector('input[value="' + q.dataset.answer + '"]'));
  }
});

test('Spread Lab matches canonical lesson metadata and protected site chrome', () => {
  const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
  const header = guide.match(/```html\n(<input type="checkbox" id="mnav-check"[\s\S]*?<\/header>)\n```/)[1];
  const footer = guide.match(/```html\n(<footer class="site">[\s\S]*?<\/footer>)\n```/)[1];
  assert.ok(html.includes(header));
  assert.ok(html.includes(footer));
  assert.equal(doc.title, meta.title);
  assert.equal(doc.querySelector('h1').textContent, meta.title);
  assert.equal(meta.slug, slug);
  assert.equal(meta.suggested_github_path, 'lessons/statistics/' + slug + '.html');
  assert.equal(doc.body.dataset.category, 'statistics');
  assert.equal(doc.body.dataset.level, 'intermediate');
  assert.equal(doc.body.dataset.lessonPage, 'true');
  assert.equal(doc.body.dataset.interactive, 'true');
  assert.equal(doc.body.dataset.lessonType, 'general');
  assert.equal(doc.querySelectorAll('#lesson-progress-widget').length, 0);
  assert.ok(html.includes('<script src="/site-sections.js"></script>'));
  assert.ok(html.includes('<script src="/theme.js"></script>'));
  assert.equal(doc.querySelector('#sl-back-link').getAttribute('href'), '/lessons#statistics');
});

test('Spread Lab styles cannot target protected chrome or redefine shared site tokens', () => {
  const ownedStyles = [...doc.querySelectorAll('style')].filter(s => s.id !== 'uss-quiz-style');
  const shared = fs.readFileSync(path.join(root, 'style.css'), 'utf8') + fs.readFileSync(path.join(root, 'lessons-theme.css'), 'utf8');
  const sharedTokens = new Set([...shared.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
  const ownedText = ownedStyles.map(s => s.textContent).join('\n');
  for (const m of ownedText.matchAll(/(--[\w-]+)\s*:/g)) {
    assert.match(m[1], /^--lesson-sl-/);
    assert.ok(!sharedTokens.has(m[1]), 'Shared token overridden: ' + m[1]);
  }
  function inspect(rules) {
    for (const rule of rules) {
      if (rule.selectorText) {
        for (const selector of rule.selectorText.split(/,(?![^()]*\))/)) {
          assert.match(selector, /#lesson-content|#quiz|#sl-back-link/, 'Unscoped lesson selector: ' + selector);
        }
      } else if (rule.cssRules) inspect(rule.cssRules);
    }
  }
  for (const style of ownedStyles) inspect(style.sheet.cssRules);
  assert.doesNotMatch(ownedText, /rgba\(238,\s*243,\s*241/);
  assert.equal(doc.body.lastElementChild.id, 'sl-dark-overrides');
});

test('Spread Lab labels its slider and provides keyboard-accessible overflow regions', () => {
  for (const input of doc.querySelectorAll('input[type="range"]')) {
    assert.ok(input.getAttribute('aria-label') || input.labels.length, 'Unnamed range input: ' + input.id);
  }
  for (const selector of ['.diagram-wrap', '.impl-scroll', 'table.compare']) {
    const target = doc.querySelector(selector);
    const region = target.matches('[role="region"]') ? target : target.parentElement;
    assert.equal(region.getAttribute('tabindex'), '0');
    assert.ok(region.getAttribute('aria-label'));
  }
  for (const id of ['guessPallets', 'guessPins']) {
    assert.equal(doc.getElementById(id).getAttribute('aria-controls'), 'guessReveal');
  }
  assert.ok(doc.getElementById('sl-presentation-controls'));
});

test('Spread Lab has one discoverable catalog entry and leaves the build insertion point intact', () => {
  const catalog = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
  assert.equal((catalog.match(/marker: 'data-variance-covariance-correlation-cv'/g) || []).length, 1);
  assert.ok(catalog.includes("path: '/lessons/statistics/" + slug + "'"));
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  assert.doesNotMatch(catalog, /eval\s*\(/);
});
