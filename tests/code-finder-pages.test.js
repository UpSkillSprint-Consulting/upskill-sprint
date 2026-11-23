const {test, before} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync, existsSync, mkdtempSync, rmSync} = require('node:fs');
const {join} = require('node:path');
const {tmpdir} = require('node:os');
const {JSDOM} = require('jsdom');

const ROOT = join(__dirname, '..');
const read = path => readFileSync(join(ROOT, path), 'utf8');
const json = name => JSON.parse(read('data/code-finder/' + name + '.json'));
const guide = read('docs/LESSON_CREATION_GUIDE.md');
const block = heading => guide.split(heading)[1].split('```html\n')[1].split('```')[0].trim();
let lib, built, dir;
const doc = path => new JSDOM(built.pages.get(path)).window.document;

before(async () => {
  lib = await import('../scripts/build-code-finder-pages.mjs');
  dir = mkdtempSync(join(tmpdir(), 'cf-pages-'));
  built = await lib.buildCodeFinderPages(dir);
  process.on('exit', () => rmSync(dir, {recursive: true, force: true}));
});

test('every code, pack and equivalent pair gets a page, plus the hub', () => {
  const records = json('standards').standards;
  for (const record of records) assert.ok(built.pages.has(lib.codePath(record.id)), record.id);
  for (const pack of json('scenarios').packs) assert.ok(built.pages.has(`/codes/pack/${pack.slug}/`), pack.slug);
  assert.ok(built.pages.has('/codes/'));
  assert.ok(built.pages.has('/codes/compare/api-5l-vs-iso-3183/'));
  assert.ok(built.pages.has('/codes/category/welding/'));
  assert.ok(built.pages.has('/codes/industry/oil-gas-midstream/'));
  assert.equal(built.counts.codes, records.length);
  assert.ok(existsSync(join(dir, 'codes/api/5l/index.html')), 'written to disk as directory indexes');
});

test('code paths are stable and readable', () => {
  assert.equal(lib.codePath('api-5l'), '/codes/api/5l/');
  assert.equal(lib.codePath('csa-z245-1'), '/codes/csa/z245-1/');
  assert.equal(lib.codePath('iso-iec-17025'), '/codes/iso/iec-17025/');
  assert.equal(lib.comparePath('iso-3183', 'api-5l'), '/codes/compare/api-5l-vs-iso-3183/', 'order-independent');
});

test('every page meets the SEO rules: title, description, canonical, one H1, valid JSON-LD', () => {
  for (const [path] of built.pages) {
    const d = doc(path);
    const title = d.title;
    assert.ok(title.endsWith(' | UpSkill Sprint') && title.length <= 65, `${path} title "${title}"`);
    const desc = d.querySelector('meta[name="description"]').content;
    assert.ok(desc.length >= 100 && desc.length <= 165, `${path} description ${desc.length}`);
    const canonical = d.querySelector('link[rel="canonical"]').href;
    assert.equal(canonical, 'https://upskillsprint.com' + path);
    assert.equal(d.querySelector('meta[property="og:url"]').content, canonical);
    assert.equal(d.querySelector('meta[property="og:description"]').content, desc);
    assert.equal(d.querySelectorAll('h1').length, 1, path);
    const ld = JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent);
    const crumbs = ld['@graph'][0].itemListElement;
    assert.equal(crumbs[crumbs.length - 1].item, canonical, path);
    assert.equal(ld['@graph'][1].url, canonical);
  }
});

test('pages carry the canonical chrome and the required site scripts', () => {
  const html = built.pages.get('/codes/api/5l/');
  assert.ok(html.includes(block('### 4.1 Header')), 'header matches guide §4.1');
  assert.ok(html.includes(block('### 4.2 Footer')), 'footer matches guide §4.2');
  for (const tag of ['<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>', '<body class="osx-page"', '/assets/osiris-tool-theme.css'])
    assert.ok(html.includes(tag), tag);
});

test('every internal link on every page goes to a generated page or a real repo page', () => {
  const missing = new Set();
  for (const [path] of built.pages) {
    for (const a of doc(path).querySelectorAll('main a[href^="/"], .cf-back a')) {
      const href = a.getAttribute('href').split(/[?#]/)[0];
      if (built.pages.has(href)) continue;
      const file = href.replace(/^\//, '').replace(/\/$/, '');
      if (!file || [file + '.html', join(file, 'index.html'), file].some(c => existsSync(join(ROOT, c)))) continue;
      missing.add(`${path} -> ${href}`);
    }
  }
  assert.deepEqual([...missing], []);
});

test('a code page states check status honestly and shows where it is mandatory', () => {
  const fiveL = doc('/codes/api/5l/');
  assert.match(fiveL.querySelector('.cf-check-ok').textContent, /Checked against the publisher on 2026-11-20\. Current edition: 47th \(2026\)/);
  assert.match(fiveL.body.textContent, /PHMSA requires it through 49 CFR 192\.7, which calls for a fixed edition: 46th \(2018\)/);
  assert.ok(fiveL.querySelector('a[href="/codes/compare/api-5l-vs-iso-3183/"]'));
  assert.ok(fiveL.querySelector('a[href="/codes/pack/line-pipe-mill-qc/"]'));
  const sixA = doc('/codes/api/6a/');
  assert.match(sixA.querySelector('.cf-check-todo').textContent, /Not yet checked/);
  assert.equal(sixA.body.textContent.includes('Current edition'), false, 'no edition claimed for an unchecked code');
});

test('pack pages keep the consult box for regulated work only', () => {
  assert.ok(doc('/codes/pack/pipeline-integrity/').querySelector('.cf-consult'));
  assert.equal(doc('/codes/pack/storage-tanks/').querySelector('.cf-consult'), null);
  assert.equal(doc('/codes/pack/pipeline-integrity/').querySelectorAll('.cf-pack-why').length, 7);
});

test('compare pages exist only for equivalent or similar pairs', () => {
  const records = json('standards').standards;
  const pairs = new Set();
  for (const r of records) for (const rel of r.relations) if (rel.type === 'equivalent' || rel.type === 'similar') pairs.add([r.id, rel.to].sort().join('|'));
  const comparePages = [...built.pages.keys()].filter(path => path.startsWith('/codes/compare/'));
  assert.equal(comparePages.length, pairs.size);
  assert.equal(built.pages.has('/codes/compare/astm-a370-vs-astm-e8/'), false, '"references" is not a comparison');
});

test('titles and descriptions are trimmed at word boundaries, and text is escaped', () => {
  const long = lib.pageTitle('API 579-1/ASME FFS-1: Fitness-For-Service with a very long extra title that keeps going');
  assert.ok(long.length <= 65 && long.endsWith('… | UpSkill Sprint'), long);
  assert.equal(lib.pageTitle('Short'), 'Short | UpSkill Sprint');
  assert.ok(lib.metaDescription('x '.repeat(120)).length <= 160);
  assert.equal(lib.esc('<script>"&'), '&lt;script&gt;&quot;&amp;');
  for (const html of built.pages.values()) assert.equal((html.match(/<script\b/g) || []).length, 4, 'only the site scripts and JSON-LD');
});

test('the build generates the pages after staging and before the sitemap, and the snapshot lists them', () => {
  const build = JSON.parse(read('package.json')).scripts['build:site'];
  const at = step => build.indexOf(`node scripts/${step}.mjs`);
  assert.ok(at('stage-public-site') < at('build-code-finder-pages') && at('build-code-finder-pages') < at('build-sitemap'));
  assert.ok(at('build-code-finder-pages') < at('inject-skip-link'), 'pages get the skip link');
  const sitemap = read('sitemap.xml');
  for (const [path, html] of built.pages) {
    const listed = sitemap.includes(`<loc>https://upskillsprint.com${path}</loc>`);
    assert.equal(listed, !noindex(html), `${path} ${listed ? 'is listed but noindex' : 'is indexable but missing from sitemap.xml'}`);
  }
});

// ---------- Thin-content guard ----------
const noindex = html => html.includes('<meta name="robots" content="noindex, follow">');

test('only code pages with our own key points are indexed; thin ones stay live as noindex, follow', () => {
  for (const record of json('standards').standards) {
    const html = built.pages.get(lib.codePath(record.id));
    const rich = (record.keyPoints || []).length >= 3;
    assert.equal(noindex(html), !rich, record.id);
    assert.equal(html.includes(`What ${record.designation.replace(/&/g, '&amp;')} covers</h2>`), rich, record.id + ' key points section');
  }
  const rich = json('standards').standards.filter(r => (r.keyPoints || []).length >= 3).length;
  assert.ok(rich >= 50, `first enrichment batch: ${rich}`);
  assert.equal(built.counts.indexed, [...built.pages.values()].filter(html => !noindex(html)).length);
});

test('an enriched page shows what the code covers and practical tips', () => {
  const d = doc('/codes/api/5l/');
  const covers = [...d.querySelectorAll('h2')].find(h => h.textContent === 'What API Spec 5L covers');
  assert.ok(covers);
  assert.ok(covers.nextElementSibling.querySelectorAll('li').length >= 3);
  assert.ok([...d.querySelectorAll('h2')].some(h => h.textContent === 'Practical tips'));
});

test('hub, category, industry and pack pages are always indexed and still link to thin code pages', () => {
  for (const path of ['/codes/', '/codes/category/welding/', '/codes/industry/oil-gas/', '/codes/pack/storage-tanks/'])
    assert.equal(noindex(built.pages.get(path)), false, path);
  assert.ok(doc('/codes/').querySelector('a[href="/codes/api/6a/"]'), 'noindex pages remain reachable (follow)');
});

test('a comparison is indexed only when both codes are enriched', () => {
  assert.equal(noindex(built.pages.get('/codes/compare/api-5l-vs-iso-3183/')), false);
  assert.ok(doc('/codes/compare/api-5l-vs-iso-3183/').querySelector('.cf-compare-points'));
  const thinPair = [...built.pages.keys()].find(path => path.startsWith('/codes/compare/') && noindex(built.pages.get(path)));
  assert.ok(thinPair, 'at least one comparison waits for enrichment');
});

test('publisher lists use Oxford-free Canadian grammar for 1, 2 or 3+ names', () => {
  assert.equal(lib.formatCanadianList(['ASTM']), 'ASTM');
  assert.equal(lib.formatCanadianList(['ASTM', 'ISO']), 'ASTM and ISO');
  assert.equal(lib.formatCanadianList(['API', 'CSA', 'ISO']), 'API, CSA and ISO');
  assert.equal(lib.formatCanadianList(['API', 'CSA', 'ASTM', 'ISO']), 'API, CSA, ASTM and ISO');
  assert.equal(lib.formatCanadianList([]), '');
  const order = ['API', 'CSA', 'ASTM', 'ISO'];
  assert.equal(lib.facetCodesPhrase([{body: 'ASTM'}], order), '1 ASTM code');
  assert.equal(lib.facetCodesPhrase([{body: 'ISO'}, {body: 'ASTM'}, {body: 'ASTM'}], order), '3 ASTM and ISO codes');
  assert.equal(lib.publishersPresent([{body: 'ISO'}, {body: 'API'}], order).join(), 'API,ISO');
});

test('category and industry descriptions name only the publishers on that page', () => {
  const chemistry = doc('/codes/category/chemistry-analysis/');
  const chemDesc = chemistry.querySelector('meta[name="description"]').content;
  assert.match(chemDesc, /^5 ASTM codes for chemistry and analysis/);
  assert.doesNotMatch(chemDesc, /API|CSA|ISO/);
  assert.equal(chemistry.querySelector('meta[property="og:description"]').content, chemDesc);

  const fuel = doc('/codes/category/fuel-gas/').querySelector('meta[name="description"]').content;
  assert.match(fuel, /^3 CSA codes for fuel gas/);
  assert.doesNotMatch(fuel, /API|ASTM|ISO/);

  const mechanical = doc('/codes/category/mechanical-testing/').querySelector('meta[name="description"]').content;
  assert.match(mechanical, /^14 ASTM and ISO codes for mechanical testing/);
  assert.doesNotMatch(mechanical, /API|CSA,/);
  assert.doesNotMatch(mechanical, /, and /); // Oxford-free

  const welding = doc('/codes/category/welding/').querySelector('meta[name="description"]').content;
  assert.match(welding, /^11 API, CSA, ASTM and ISO codes for welding/);
  assert.doesNotMatch(welding, /ASTM, and ISO/);

  const nuclear = doc('/codes/industry/nuclear/').querySelector('meta[name="description"]').content;
  assert.match(nuclear, /^1 CSA code for nuclear, with a plain-language summary/);
  assert.doesNotMatch(nuclear, /API|ASTM|ISO|codes /);

  const aerospace = doc('/codes/industry/aerospace/').querySelector('meta[name="description"]').content;
  assert.match(aerospace, /^5 ASTM and ISO codes for aerospace/);
  assert.doesNotMatch(aerospace, /API|CSA/);

  const oil = doc('/codes/industry/oil-gas/').querySelector('meta[name="description"]').content;
  assert.match(oil, /API, CSA, ASTM and ISO codes for oil and gas/);

  // The hub still names every publisher, because every publisher is on that page.
  const hub = doc('/codes/').querySelector('meta[name="description"]').content;
  assert.match(hub, /API, CSA, ASTM and ISO codes and standards/);
});
