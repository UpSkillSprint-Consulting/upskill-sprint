const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { JSDOM } = require('jsdom');

test('build pre-renders every lesson card into lessons.html without duplicates', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'directories-'));
  for (const f of ['lessons.html', 'chi-square-lesson-library.js']) fs.copyFileSync(f, path.join(dir, f));
  const source = fs.readFileSync('lessons.html', 'utf8');
  const { renderPublicDirectories } = await import('../scripts/render-public-directories.mjs');
  await renderPublicDirectories(dir);
  const html = fs.readFileSync(path.join(dir, 'lessons.html'), 'utf8');
  const doc = new JSDOM(html).window.document;
  const rows = [...doc.querySelectorAll('#lesson-library [data-lesson-item]')];
  const hrefs = rows.map(a => a.getAttribute('href').replace(/^\//, '').replace(/\.html$/, ''));
  assert.equal(new Set(hrefs).size, hrefs.length);
  const library = fs.readFileSync('chi-square-lesson-library.js', 'utf8');
  for (const [, p] of library.matchAll(/path: '([^']+)'/g)) assert.ok(hrefs.includes(p.slice(1)), p);
  // Everything before the library section, including the JSON-LD, is unchanged.
  const cut = source.indexOf('<section class="lesson-library"');
  assert.equal(html.slice(0, cut), source.slice(0, cut));
  assert.ok(html.includes('"@type": "CollectionPage"') || html.includes('"@type":"CollectionPage"'));
  fs.rmSync(dir, { recursive: true, force: true });
});
