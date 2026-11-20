const {test, afterEach} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync, existsSync} = require('node:fs');
const {join} = require('node:path');
const {JSDOM} = require('jsdom');

const ROOT = join(__dirname, '..');
const read = path => readFileSync(join(ROOT, path), 'utf8');
const PAGE = read('tools/code-finder/index.html');
const guide = read('docs/LESSON_CREATION_GUIDE.md');
const block = heading => guide.split(heading)[1].split('```html\n')[1].split('```')[0];
const flush = () => new Promise(resolve => setTimeout(resolve, 0));
const open = [];
afterEach(() => { while (open.length) open.pop().window.close(); });

// Boot the page in jsdom with fetch served from data/code-finder/.
async function boot(search = '', mutate) {
  const dom = new JSDOM(PAGE, {url: 'https://upskillsprint.com/tools/code-finder/' + search, runScripts: 'outside-only', pretendToBeVisual: true});
  open.push(dom);
  const {window} = dom;
  window.fetch = async url => {
    const file = join(ROOT, url.replace(/^\//, ''));
    if (!existsSync(file)) return {ok: false, status: 404, json: async () => ({})};
    let body = JSON.parse(readFileSync(file, 'utf8'));
    if (mutate) body = mutate(url, body) || body;
    return {ok: true, status: 200, json: async () => body};
  };
  window.eval(read('tools/code-finder/code-finder-engine.js'));
  window.eval(read('tools/code-finder/code-finder-app.js'));
  await window.CodeFinderApp.init();
  await flush();
  const doc = window.document;
  return {
    window, doc,
    status: () => doc.getElementById('cf-status').textContent,
    cards: () => [...doc.querySelectorAll('#cf-results .cf-card')],
    designations: () => [...doc.querySelectorAll('#cf-results .cf-desig')].map(node => node.textContent),
    async search(text) {
      doc.getElementById('cf-q').value = text;
      doc.getElementById('cf-form').dispatchEvent(new window.Event('submit', {cancelable: true}));
      await flush();
    },
    async check(facet, value, on = true) {
      const box = doc.querySelector(`#cf-facets input[data-cf-facet="${facet}"][data-cf-value="${value}"]`);
      assert.ok(box, `no ${facet}=${value} checkbox`);
      box.checked = on;
      box.dispatchEvent(new window.Event('change', {bubbles: true}));
      await flush();
    }
  };
}

// ---------- Static page requirements ----------
test('head carries the SEO tags the guide requires for a tool page', () => {
  const dom = new JSDOM(PAGE);
  const doc = dom.window.document;
  const title = doc.title;
  assert.match(title, / \| UpSkill Sprint$/);
  assert.ok(title.length <= 65, `title is ${title.length} chars`);
  const desc = doc.querySelector('meta[name="description"]').content;
  assert.ok(desc.length >= 120 && desc.length <= 165, `description is ${desc.length} chars`);
  const canonical = doc.querySelector('link[rel="canonical"]').href;
  assert.equal(canonical, 'https://upskillsprint.com/tools/code-finder/');
  assert.equal(doc.querySelector('meta[property="og:url"]').content, canonical);
  assert.equal(doc.querySelector('meta[property="og:title"]').content, title);
  assert.equal(doc.querySelector('meta[property="og:description"]').content, desc);
  assert.equal(doc.querySelector('meta[property="og:image"]').content, 'https://upskillsprint.com/assets/logo-og.png');
  assert.equal(doc.querySelectorAll('h1').length, 1);
  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  const types = ld['@graph'].map(node => node['@type']);
  assert.deepEqual(types, ['BreadcrumbList', 'WebApplication']);
  const app = ld['@graph'][1];
  assert.equal(app.url, canonical);
  assert.equal(app.description, desc);
  assert.equal(app.offers.price, '0');
  assert.equal(ld['@graph'][0].itemListElement[1].item, 'https://upskillsprint.com/engineering-tools');
  dom.window.close();
});

test('page uses the canonical chrome, required scripts and the OSIRIS theme', () => {
  assert.ok(PAGE.includes(block('### 4.1 Header').trim()), 'header differs from guide §4.1');
  assert.ok(PAGE.includes(block('### 4.2 Footer').trim()), 'footer differs from guide §4.2');
  for (const tag of ['<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>',
    '<link rel="stylesheet" href="/assets/osiris-tool-theme.css">', '<body class="osx-page"'])
    assert.ok(PAGE.includes(tag), tag);
  assert.match(PAGE, /<main id="code-finder-tool" class="osx-tool/);
  assert.ok(PAGE.indexOf('/assets/osiris-tool-theme.css') < PAGE.indexOf('/tools/code-finder/code-finder.css'), 'tool CSS after theme');
  assert.match(PAGE, /<script src="\/tools\/code-finder\/code-finder-app.js" defer><\/script>/);
});

test('tool CSS only defines --cf- properties and never repaints site tokens', () => {
  const css = read('tools/code-finder/code-finder.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const declared = [...css.matchAll(/(?:^|[;{\s])(--[\w-]+)\s*:/g)].map(match => match[1]);
  assert.ok(declared.length > 0);
  assert.deepEqual(declared.filter(name => !name.startsWith('--cf-')), []);
  for (const banned of ['.card', '.chip', '.callout', '.interactive', '.result-panel'])
    assert.ok(!new RegExp('\\' + banned + '(?![\\w-])').test(css), banned + ' is restyled by theme.js');
});

test('every internal link on the page points at a real page', () => {
  const dom = new JSDOM(PAGE);
  const links = [...dom.window.document.querySelectorAll('main a[href^="/"], .cf-back a')].map(a => a.getAttribute('href'));
  assert.ok(links.length >= 8);
  for (const href of links) {
    const path = href.split('#')[0].replace(/^\//, '').replace(/\/$/, '');
    const found = [path + '.html', join(path, 'index.html'), path].some(candidate => candidate && existsSync(join(ROOT, candidate)));
    assert.ok(found, href);
  }
  dom.window.close();
});

test('the tool is listed on Engineering Tools and in the sitemap snapshot', () => {
  const tools = new JSDOM(read('engineering-tools.html')).window.document;
  const row = tools.getElementById('code-finder');
  assert.ok(row, 'tool row missing');
  assert.equal(row.querySelector('a.tool-action').getAttribute('href'), '/tools/code-finder/');
  assert.ok(read('sitemap.xml').includes('<loc>https://upskillsprint.com/tools/code-finder/</loc>'));
});

// ---------- Behaviour ----------
test('loads the catalog and lists every code before any search', async () => {
  const page = await boot();
  const total = JSON.parse(read('data/code-finder/standards.json')).standards.length;
  assert.equal(page.doc.querySelector('[data-cf-root]').dataset.cfReady, 'true');
  assert.match(page.status(), new RegExp(`Showing all ${total} codes`));
  assert.equal(page.cards().length, 30, 'first page of results');
  assert.match(page.doc.getElementById('cf-more').textContent, new RegExp(`of ${total - 30} remaining`));
});

test('a search ranks the right codes, explains why, and updates the URL', async () => {
  const page = await boot();
  await page.search('CVN');
  assert.match(page.status(), /match "CVN"\. Also searched: cvn\./);
  assert.ok(page.designations().slice(0, 3).includes('ASTM E23'));
  assert.ok(page.cards()[0].querySelector('.cf-why').textContent.includes('Means "cvn"'));
  assert.equal(page.window.location.search, '?q=CVN');
});

test('facet filters narrow results, show as removable chips, and survive a reload', async () => {
  let page = await boot();
  await page.check('bodies', 'ISO');
  assert.ok(page.designations().every(name => name.startsWith('ISO') || name.startsWith('IEC')));
  const chip = page.doc.querySelector('#cf-active .cf-chip');
  assert.equal(chip.getAttribute('aria-label'), 'Remove filter: ISO');
  assert.equal(page.window.location.search, '?body=ISO');
  page = await boot('?body=ISO&category=statistics-spc');
  assert.match(page.status(), /match your filters/);
  assert.ok(page.cards().length > 0);
  page.doc.querySelector('#cf-active .cf-chip[aria-label="Remove filter: ISO"]').click();
  await flush();
  assert.equal(page.window.location.search, '?category=statistics-spc');
  assert.equal(page.doc.querySelectorAll('#cf-active .cf-chip').length, 1);
});

test('no matches shows help instead of a blank list', async () => {
  const page = await boot();
  await page.search('zzqxv blorf');
  assert.equal(page.cards().length, 0);
  assert.equal(page.doc.getElementById('cf-empty').hidden, false);
  page.doc.querySelector('#cf-empty [data-cf-clear]').click();
  await flush();
  assert.equal(page.doc.getElementById('cf-empty').hidden, true);
  assert.equal(page.doc.getElementById('cf-q').value, '');
});

test('cards show check status honestly and fill details only when opened', async () => {
  const page = await boot();
  await page.search('5L');
  const card = page.cards()[0];
  assert.equal(card.querySelector('.cf-desig').textContent, 'API Spec 5L');
  assert.match(card.querySelector('.cf-check-ok').textContent, /Checked Nov 20, 2026 · current edition 47th/);
  assert.ok([...card.querySelectorAll('.cf-pill')].some(p => p.textContent === 'Mandatory in places'));
  const details = card.querySelector('.cf-details');
  assert.equal(details.querySelector('.cf-details-body').children.length, 0, 'lazy');
  details.open = true;
  details.dispatchEvent(new page.window.Event('toggle'));
  assert.match(details.textContent, /PHMSA requires it through 49 CFR 192\.7, which calls for a fixed edition: 46th \(2018\)/);
  assert.match(details.textContent, /Equivalent ISO 3183/);
  await page.search('api 6a');
  assert.match(page.cards()[0].querySelector('.cf-check-todo').textContent, /Not yet checked/);
});

test('a related-code button jumps to that code', async () => {
  const page = await boot();
  await page.search('5L');
  const details = page.cards()[0].querySelector('.cf-details');
  details.open = true;
  details.dispatchEvent(new page.window.Event('toggle'));
  [...details.querySelectorAll('.cf-relations button')].find(b => b.textContent === 'ISO 3183').click();
  await flush();
  assert.equal(page.doc.getElementById('cf-q').value, 'ISO 3183');
  assert.equal(page.designations()[0], 'ISO 3183');
  assert.equal(page.doc.activeElement.id, 'code-iso-3183');
});

test('catalog text is rendered as text, never as markup', async () => {
  const page = await boot('', (url, body) => {
    if (url.endsWith('standards.json')) body.standards[0].summary = '<img src=x onerror="window.pwned=1"> summary';
    return body;
  });
  await page.search('5L');
  assert.equal(page.doc.querySelector('#cf-results img'), null);
  assert.match(page.cards()[0].querySelector('.cf-summary').textContent, /<img src=x/);
  assert.equal(page.window.pwned, undefined);
});

test('on phones the filter panel moves into a dialog and comes back when closed', async () => {
  const page = await boot();
  const filters = page.doc.getElementById('cf-filters');
  page.doc.getElementById('cf-open-filters').click();
  assert.equal(filters.parentElement.id, 'cf-sheet');
  const apply = page.doc.querySelector('[data-cf-close-sheet]');
  assert.match(apply.textContent, /^Show \d+ codes$/);
  apply.click();
  const sheet = page.doc.getElementById('cf-sheet');
  if (typeof sheet.close !== 'function') sheet.dispatchEvent(new page.window.Event('close'));
  assert.equal(filters.parentElement.id, 'cf-filter-slot');
  assert.equal(page.doc.activeElement.id, 'cf-open-filters');
});

test('a failed data load says so instead of spinning forever', async () => {
  const dom = new JSDOM(PAGE, {url: 'https://upskillsprint.com/tools/code-finder/', runScripts: 'outside-only'});
  open.push(dom);
  dom.window.fetch = async () => ({ok: false, status: 500, json: async () => ({})});
  dom.window.eval(read('tools/code-finder/code-finder-engine.js'));
  dom.window.eval(read('tools/code-finder/code-finder-app.js'));
  await dom.window.CodeFinderApp.init();
  assert.match(dom.window.document.getElementById('cf-status').textContent, /did not load/);
});
