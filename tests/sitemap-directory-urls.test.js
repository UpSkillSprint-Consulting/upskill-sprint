'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const loadSitemap = () => import(path.join(ROOT, 'scripts', 'build-sitemap.mjs'));

// Netlify answers /folder with a 301 to /folder/, so a directory page's
// sitemap entry and canonical must already carry the trailing slash.
test('directory index pages are listed with a trailing slash', async () => {
  const { sitemapEntry, withDirectorySlash } = await loadSitemap();
  assert.equal(withDirectorySlash('tools/x/how-to-use/index.html', 'https://upskillsprint.com/tools/x/how-to-use'),
    'https://upskillsprint.com/tools/x/how-to-use/');
  assert.equal(withDirectorySlash('tools/x.html', 'https://upskillsprint.com/tools/x'), 'https://upskillsprint.com/tools/x');
  const slashless = '<head><link rel="canonical" href="https://upskillsprint.com/tools/x/how-to-use"></head>';
  assert.equal(sitemapEntry('tools/x/how-to-use/index.html', slashless), 'https://upskillsprint.com/tools/x/how-to-use/');
  assert.equal(sitemapEntry('tools/x/how-to-use/index.html', '<head></head>'), 'https://upskillsprint.com/tools/x/how-to-use/');
  assert.equal(sitemapEntry('index.html', '<head></head>'), 'https://upskillsprint.com/');
});

test('tracked directory pages use a trailing-slash canonical', () => {
  const pages = [
    'tools/material-specification-compliance-checker/how-to-use/index.html',
    'tools/steel-phase-explorer/how-to-use/index.html'
  ];
  for (const page of pages) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
    assert.ok(canonical && canonical.endsWith('/'), `${page} canonical should end with a slash: ${canonical}`);
    const ogUrl = html.match(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/)?.[1];
    if (ogUrl) assert.equal(ogUrl, canonical, `${page} og:url should match its canonical`);
  }
  const builder = fs.readFileSync(path.join(ROOT, 'scripts', 'build-grade-specification-lookup.mjs'), 'utf8');
  assert.match(builder, /rel="canonical" href="https:\/\/upskillsprint\.com\/engineering-tools\/grade-specification-lookup\/"/);
  assert.match(builder, /rel="canonical" href="https:\/\/upskillsprint\.com\/engineering-tools\/grade-specification-lookup\/how-to-use\/"/);
});
