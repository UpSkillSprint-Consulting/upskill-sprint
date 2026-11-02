'use strict';

// Every public page gets exactly one working "skip" link: the build adds
// "Skip to main content" (scripts/inject-skip-link.mjs) wherever a page has none.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const injectorUrl = 'file://' + path.join(ROOT, 'scripts', 'inject-skip-link.mjs');
const page = (body, head = '<title>x</title>') => `<!doctype html><html lang="en"><head>${head}</head><body class="p">${body}</body></html>`;

function skipLinks(doc) {
  return [...doc.querySelectorAll('a[href^="#"]')].filter((a) => /^\s*Skip\b/i.test(a.textContent));
}

test('adds one skip link as the first element, targeting the page main', async () => {
  const { injectSkipLink } = await import(injectorUrl);
  const out = injectSkipLink(page('<header>Nav</header><main id="lesson-content">Hi</main><footer>f</footer>'));
  const doc = new JSDOM(out).window.document;
  const links = skipLinks(doc);
  assert.equal(links.length, 1);
  assert.equal(doc.body.firstElementChild, links[0]);
  assert.equal(links[0].textContent, 'Skip to main content');
  assert.equal(links[0].getAttribute('href'), '#lesson-content');
  assert.equal(doc.getElementById('lesson-content').tagName, 'MAIN');
  assert.equal(doc.querySelectorAll('#uss-skip-link-style').length, 1);
  assert.equal(injectSkipLink(out), null, 'running the build twice never adds a second link');
});

test('gives an unnamed main an id, and never reuses an id already on the page', async () => {
  const { injectSkipLink } = await import(injectorUrl);
  const doc = new JSDOM(injectSkipLink(page('<main class="wrap">Hi</main>'))).window.document;
  assert.equal(doc.querySelector('main').id, 'main-content');
  assert.equal(skipLinks(doc)[0].getAttribute('href'), '#main-content');
  assert.equal(injectSkipLink(page('<div id="main-content"></div><main>Hi</main>')), null);
});

test('leaves pages that already have a skip link, shells, redirects and lesson loaders alone', async () => {
  const { injectSkipLink } = await import(injectorUrl);
  assert.equal(injectSkipLink(page('<a class="skip-link" href="#lesson-content">Skip to lesson content</a><main id="lesson-content"></main>')), null);
  assert.equal(injectSkipLink(page('<a class="skip" href="#tool">Skip to checker</a><main id="tool"></main>')), null);
  assert.equal(injectSkipLink(page('<section id="tool-access-status"></section><div id="tool-access-content"></div>')), null, 'no main: tool shell');
  assert.equal(injectSkipLink(page('<main id="loader"></main><script src="/lesson-payload-swap.js"></script>')), null);
  assert.equal(injectSkipLink('<div>fragment without a body</div>'), null);
});

test('ignores markup inside scripts, styles and comments', async () => {
  const { injectSkipLink } = await import(injectorUrl);
  const html = page('<main id="lesson-content">Hi</main><script>const report = "<body><main class=\\"wrap\\"><a href=\\"#x\\">Skip it</a>";</script><!-- <main> -->');
  const doc = new JSDOM(injectSkipLink(html)).window.document;
  assert.equal(skipLinks(doc).length, 1);
  assert.match(doc.querySelector('script').textContent, /<body><main class=\\"wrap\\">/, 'script text is untouched');
});

test('the link is hidden until keyboard focus, then shown with high contrast', async () => {
  const { SKIP_LINK_STYLE } = await import(injectorUrl);
  assert.match(SKIP_LINK_STYLE, /\.uss-skip-link\{position:fixed;[^}]*top:-200px;[^}]*background:#0d1b30;color:#fff;/);
  assert.match(SKIP_LINK_STYLE, /\.uss-skip-link:focus\{top:12px;/);
  assert.doesNotMatch(SKIP_LINK_STYLE, /display:none\}(?!\})/, 'not display:none, so it stays focusable');
});

test('build:site runs the skip-link injector after the other page injectors', () => {
  const build = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts['build:site'];
  const ticker = build.indexOf('inject-site-ticker.mjs'), skip = build.indexOf('inject-skip-link.mjs');
  assert.ok(ticker > -1 && skip > ticker);
});

test('the shared site header is inserted after the skip link, not above it', () => {
  const dom = new JSDOM(page('<a class="uss-skip-link" href="#main-content">Skip to main content</a>\n<main id="main-content"><h1>T</h1></main>'), {
    url: 'https://upskillsprint.com/privacy', runScripts: 'outside-only', pretendToBeVisual: true
  });
  const { window } = dom;
  window.IntersectionObserver = class { observe() {} disconnect() {} };
  window.eval(fs.readFileSync(path.join(ROOT, 'site-sections.js'), 'utf8'));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  const doc = window.document;
  assert.ok(doc.querySelector('header.site'), 'shared header injected');
  assert.equal(doc.body.firstElementChild.className, 'uss-skip-link');
  dom.window.close();
});

// Pages whose skip target is filled in by their own script at runtime (the weekly audit
// confirms the target exists after render). Static check only, so list them explicitly.
const RUNTIME_TARGETS = new Set(['lessons/7-management-planning-tools.html', 'lessons/complete-14-quality-tools-project.html']);

test('every staged public page has exactly one skip link with a matching target', async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'skip-link-site-'));
  try {
    await (await import('file://' + path.join(ROOT, 'scripts', 'stage-public-site.mjs'))).stagePublicSite(ROOT, out);
    await (await import('file://' + path.join(ROOT, 'scripts', 'build-exampreview.mjs'))).buildExamPreview(ROOT, out);
    const { injectSkipLinks } = await import(injectorUrl);
    assert.ok(await injectSkipLinks(out) > 40);
    const { sitemapEntry } = await import('file://' + path.join(ROOT, 'scripts', 'build-sitemap.mjs'));
    let checked = 0;
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
    for (const file of walk(out).filter((f) => f.endsWith('.html'))) {
      const rel = path.relative(out, file).split(path.sep).join('/');
      const html = fs.readFileSync(file, 'utf8');
      if (rel.startsWith('lessons/assets/') || rel.startsWith('test-bank-assets/') || !/<\/body>/i.test(html)) continue;
      if (!sitemapEntry(rel, html)) continue; // redirects and noindex pages are not public pages
      if (html.includes('/lesson-payload-swap.js') || html.includes('data-tool-shell=')) continue; // replaced at runtime
      const doc = new JSDOM(html).window.document;
      const links = skipLinks(doc);
      assert.equal(links.length, 1, `${rel} has exactly one skip link`);
      if (!RUNTIME_TARGETS.has(rel)) {
        const target = doc.getElementById(decodeURIComponent(links[0].getAttribute('href').slice(1)));
        assert.ok(target, `${rel} skip link has a target`);
        assert.ok(target.tagName === 'MAIN' || target.closest('main') || target.querySelector('main'), `${rel} skip link reaches the main content`);
      }
      checked++;
    }
    assert.ok(checked > 70, `checked ${checked} pages`);
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});
