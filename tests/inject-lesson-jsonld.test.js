'use strict';

// Every public lesson carries one LearningResource + BreadcrumbList graph. Lessons
// without a hand-written graph get one at build time (scripts/inject-lesson-jsonld.mjs),
// derived only from the page's own title, description, canonical and lesson meta.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const injectorUrl = 'file://' + path.join(ROOT, 'scripts', 'inject-lesson-jsonld.mjs');
const SITE = 'https://upskillsprint.com';
const ALLOWED_RESOURCE_KEYS = new Set(['@type', 'name', 'description', 'url', 'learningResourceType', 'educationalLevel', 'isAccessibleForFree', 'provider']);

function lessonPage({ meta, head = '', body = '<main id="lesson-content"><h1>Pareto</h1></main>', bodyAttrs = '' } = {}) {
  const metaBlock = meta === undefined ? '' : `<!-- UPSKILLSPRINT_LESSON_META\n${typeof meta === 'string' ? meta : JSON.stringify(meta)}\n-->\n`;
  return `<!DOCTYPE html>\n<html lang="en">\n${metaBlock}<head>\n<meta charset="utf-8">\n` +
    (head || '<title>Pareto &amp; Friends | UpSkill Sprint</title>\n<meta name="description" content="Build &amp; read a Pareto chart.">\n' +
      `<link rel="canonical" href="${SITE}/lessons/pareto">\n`) +
    `</head>\n<body${bodyAttrs}>${body}</body>\n</html>\n`;
}

/** All JSON-LD graphs in a page, parsed; throws if any block is not valid JSON. */
function graphs(html) {
  const doc = new JSDOM(html).window.document;
  return [...doc.querySelectorAll('script[type="application/ld+json"]')].map((s) => ({ inHead: !!s.closest('head'), data: JSON.parse(s.textContent) }));
}
function nodesOf(data) { return data['@graph'] || [data]; }
function lessonNodes(html) {
  const all = graphs(html);
  const lr = all.filter((g) => nodesOf(g.data).some((n) => n['@type'] === 'LearningResource'));
  return { all, lr };
}

test('injects one BreadcrumbList + LearningResource graph in <head>, from the page only', async () => {
  const { injectLessonJsonLd } = await import(injectorUrl);
  const out = injectLessonJsonLd(lessonPage({ meta: { title: 'Pareto', level: 'Beginner', estimated_minutes: 18, search_keywords: ['pareto'] } }), 'lessons/pareto.html');
  const { all } = lessonNodes(out);
  assert.equal(all.length, 1);
  assert.ok(all[0].inHead);
  const ld = all[0].data;
  assert.equal(ld['@context'], 'https://schema.org');
  assert.equal(ld['@graph'].length, 2);
  const [crumbs, resource] = ld['@graph'];
  assert.deepEqual(crumbs, { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
    { '@type': 'ListItem', position: 2, name: 'Lessons', item: SITE + '/lessons' },
    { '@type': 'ListItem', position: 3, name: 'Pareto & Friends', item: SITE + '/lessons/pareto' }
  ] });
  assert.deepEqual(resource, {
    '@type': 'LearningResource', name: 'Pareto & Friends', description: 'Build & read a Pareto chart.',
    url: SITE + '/lessons/pareto', learningResourceType: 'Lesson', educationalLevel: 'Beginner', isAccessibleForFree: true,
    provider: { '@type': 'Organization', name: 'UpSkill Sprint Consulting', url: SITE + '/' }
  });
  assert.ok(!('timeRequired' in resource) && !('keywords' in resource) && !('teaches' in resource), 'no invented facts');
  assert.equal(injectLessonJsonLd(out, 'lessons/pareto.html'), null, 'running the build twice never adds a second graph');
});

test('educationalLevel only when meta has level; access follows meta access_level', async () => {
  const { injectLessonJsonLd } = await import(injectorUrl);
  const resource = (html) => JSON.parse(new JSDOM(html).window.document.querySelector('script[type="application/ld+json"]').textContent)['@graph'][1];

  const noLevel = resource(injectLessonJsonLd(lessonPage({ meta: { title: 'Pareto' } })));
  assert.ok(!('educationalLevel' in noLevel));
  assert.equal(noLevel.isAccessibleForFree, true, 'missing access_level is public');

  assert.equal(resource(injectLessonJsonLd(lessonPage({ meta: { access_level: 'public' } }))).isAccessibleForFree, true);
  for (const tier of ['registered', 'premium', 'special', 'administrator']) {
    assert.equal(resource(injectLessonJsonLd(lessonPage({ meta: { level: 'Advanced', access_level: tier } }))).isAccessibleForFree, false, tier);
  }
  assert.ok(!('isAccessibleForFree' in resource(injectLessonJsonLd(lessonPage({ meta: { access_level: 'mystery' } })))), 'unknown tier: say nothing');
  assert.ok(!('isAccessibleForFree' in resource(injectLessonJsonLd(lessonPage({ meta: '{ not json' })))), 'unreadable meta: say nothing');
  const gated = resource(injectLessonJsonLd(lessonPage({ meta: { level: 'Beginner' }, bodyAttrs: ' data-require-auth' })));
  assert.ok(!('isAccessibleForFree' in gated), 'a sign-in gated body never claims free access without meta saying so');
  assert.equal(resource(injectLessonJsonLd(lessonPage())).isAccessibleForFree, true, 'no meta block at all: treated as missing');
});

test('reads attributes in any order, decodes entities and keeps the JSON script-safe', async () => {
  const { injectLessonJsonLd } = await import(injectorUrl);
  // Same head shape as the generated Binomial/Poisson lesson: href before rel.
  const head = `<link href="${SITE}/lessons/statistics/binomial" rel="canonical"/>\n<title>Binomial &amp; Poisson | UpSkill Sprint</title>\n` +
    `<meta content="Uses &lt;/script&gt; safely &#8212; Little&#x2019;s Law." name="description">\n`;
  const out = injectLessonJsonLd(lessonPage({ head, meta: { level: 'Beginner' } }), 'lessons/statistics/binomial.html');
  assert.doesNotMatch(out.split('application/ld+json')[1].split('</script>')[0], /<\/?script/i, 'no raw tags inside the JSON text');
  const resource = JSON.parse(new JSDOM(out).window.document.querySelector('script[type="application/ld+json"]').textContent)['@graph'][1];
  assert.equal(resource.name, 'Binomial & Poisson');
  assert.equal(resource.url, SITE + '/lessons/statistics/binomial');
  assert.equal(resource.description, 'Uses </script> safely — Little’s Law.');
});

test('falls back to the sitemap URL only when a page has no canonical', async () => {
  const { injectLessonJsonLd } = await import(injectorUrl);
  const head = '<title>No Canonical | UpSkill Sprint</title>\n<meta name="description" content="A lesson.">\n';
  const out = injectLessonJsonLd(lessonPage({ head }), 'lessons/statistics/no-canonical.html');
  assert.equal(JSON.parse(new JSDOM(out).window.document.querySelector('script[type="application/ld+json"]').textContent)['@graph'][1].url,
    SITE + '/lessons/statistics/no-canonical');
});

test('leaves graphs, redirects, noindex pages, fragments and incomplete pages alone', async () => {
  const { injectLessonJsonLd, shouldInject } = await import(injectorUrl);
  const existing = lessonPage({ head: '<title>X | UpSkill Sprint</title><meta name="description" content="d">' +
    '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"LearningResource","name":"X"}]}</script>' });
  assert.equal(injectLessonJsonLd(existing), null, 'hand-written LearningResource wins');
  assert.equal(injectLessonJsonLd(lessonPage({ head: '<title>X | UpSkill Sprint</title><meta name="description" content="d"><meta name="robots" content="noindex">' })), null);
  assert.equal(injectLessonJsonLd(lessonPage({ head: '<meta http-equiv="refresh" content="0; url=/lessons/x"><title>X</title><meta name="description" content="d">' })), null);
  assert.equal(injectLessonJsonLd(lessonPage({ head: '<title>X | UpSkill Sprint</title>' })), null, 'no description');
  assert.equal(injectLessonJsonLd(lessonPage({ head: '<meta name="description" content="d">' })), null, 'no title');
  assert.equal(injectLessonJsonLd(lessonPage({ head: '<title>X</title><meta name="description" content="d"><link rel="canonical" href="https://example.com/x">' })), null, 'off-site canonical');
  assert.equal(injectLessonJsonLd('<section><h2>fragment</h2></section>'), null);
  assert.equal(injectLessonJsonLd(lessonPage({ head: '<title>X</title><meta name="description" content="d"><script>const t = "<title>Fake</title></head>";</script>' }), 'lessons/x.html')
    .match(/application\/ld\+json/g).length, 1, 'markup inside scripts is not read as the head');
  assert.equal(shouldInject('lessons/assets/minitab/fragment.html'), false);
  assert.equal(shouldInject('test-bank-assets/x.html'), false);
  assert.equal(shouldInject('about.html'), false, 'lessons only');
  assert.equal(shouldInject(path.join('lessons', 'statistics', 'x.html')), true);
});

test('a payload-swap loader carries the injected graph into the written lesson', async () => {
  const { injectLessonJsonLd } = await import(injectorUrl);
  const loader = injectLessonJsonLd(lessonPage({ meta: { level: 'Intermediate' } }), 'lessons/pareto.html');
  const dom = new JSDOM(loader, { url: SITE + '/lessons/pareto', runScripts: 'outside-only' });
  const w = dom.window;
  try {
    const append = w.document.head.appendChild.bind(w.document.head);
    w.document.head.appendChild = (tag) => { const r = append(tag); if (tag.rel === 'preload') queueMicrotask(() => tag.dispatchEvent(new w.Event('load'))); return r; };
    w.eval(fs.readFileSync(path.join(ROOT, 'lesson-payload-swap.js'), 'utf8'));
    await w.upskillWriteLessonDocument('<!doctype html><html><head><title>Old</title></head><body><main><h1>Lesson</h1></main></body></html>');
    const types = [...w.document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => nodesOf(JSON.parse(s.textContent)).map((n) => n['@type']));
    assert.deepEqual(types.sort(), ['BreadcrumbList', 'LearningResource']);
  } finally { w.close(); }
});

test('build:site runs the lesson JSON-LD injector after the sitemap and before the skip link', () => {
  const build = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts['build:site'];
  const sitemap = build.indexOf('build-sitemap.mjs'), ld = build.indexOf('inject-lesson-jsonld.mjs'), skip = build.indexOf('inject-skip-link.mjs');
  assert.ok(sitemap > -1 && ld > sitemap && skip > ld);
  assert.ok(build.indexOf('stage-public-site.mjs') < ld, 'runs on the staged site');
  assert.equal(build.split('inject-lesson-jsonld.mjs').length, 2, 'wired once');
});

// Lesson pages written by build:site generators before staging. They are not in git,
// so a plain test run only sees them when the build has already been run here.
// Their head shape is covered by the fixture test above.
const BUILD_GENERATED = new Set([
  SITE + '/lessons/statistics/binomial-poisson-exponential-distributions', // scripts/build-binomial-poisson-exponential-lesson.mjs
  SITE + '/lessons/writing-your-first-sql-query' // scripts/build-interactive-sql-lesson.mjs
]);

test('every sitemap lesson URL has exactly one valid LearningResource + BreadcrumbList graph after staging', async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-jsonld-site-'));
  try {
    const stage = await import('file://' + path.join(ROOT, 'scripts', 'stage-public-site.mjs'));
    await stage.stagePublicSite(ROOT, out);
    await (await import('file://' + path.join(ROOT, 'scripts', 'render-minitab-guide.mjs'))).renderMinitabGuide(out);
    await (await import('file://' + path.join(ROOT, 'scripts', 'render-js-lessons.mjs'))).renderJsLessons(out);
    const before = new Map();
    const lessonFiles = [];
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
    for (const file of walk(path.join(out, 'lessons')).filter((f) => f.endsWith('.html'))) {
      const html = fs.readFileSync(file, 'utf8');
      lessonFiles.push(file);
      if (html.includes('LearningResource')) before.set(file, html);
    }
    const { injectLessonJsonLdAll } = await import(injectorUrl);
    const added = await injectLessonJsonLdAll(out);
    assert.ok(added >= 40, `added ${added}`);
    assert.equal(await injectLessonJsonLdAll(out), 0, 'idempotent');
    for (const [file, html] of before) assert.equal(fs.readFileSync(file, 'utf8'), html, `${path.relative(out, file)} hand-written graph untouched`);

    const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
    const urls = [...sitemap.matchAll(/<loc>(https:\/\/upskillsprint\.com\/lessons\/[^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.ok(urls.length >= 59, `${urls.length} lesson URLs in sitemap.xml`);
    let checked = 0;
    for (const url of urls) {
      const rel = url.slice(SITE.length + 1);
      const file = [path.join(out, rel + '.html'), path.join(out, rel, 'index.html')].find((f) => fs.existsSync(f));
      if (!file) { assert.ok(BUILD_GENERATED.has(url), `${url} has a staged page`); continue; }
      const html = fs.readFileSync(file, 'utf8');
      const { lr } = lessonNodes(html);
      assert.equal(lr.length, 1, `${rel}: one LearningResource graph`);
      assert.ok(lr[0].inHead, `${rel}: graph is in <head>`);
      const nodes = nodesOf(lr[0].data);
      assert.equal(lr[0].data['@context'], 'https://schema.org', rel);
      assert.equal(nodes.filter((n) => n['@type'] === 'LearningResource').length, 1, `${rel}: one LearningResource`);
      assert.equal(nodes.filter((n) => n['@type'] === 'BreadcrumbList').length, 1, `${rel}: one BreadcrumbList`);
      const resource = nodes.find((n) => n['@type'] === 'LearningResource');
      assert.equal(resource.url, url, `${rel}: LearningResource url is the sitemap URL`);
      assert.ok(resource.name && resource.description, `${rel}: name and description`);
      const crumbs = nodes.find((n) => n['@type'] === 'BreadcrumbList').itemListElement;
      assert.equal(crumbs.at(-1).item, url, `${rel}: breadcrumb ends at the lesson`);
      if (!before.has(file)) {
        for (const key of Object.keys(resource)) assert.ok(ALLOWED_RESOURCE_KEYS.has(key), `${rel}: generated graph has no extra fact "${key}"`);
        const doc = new JSDOM(html).window.document;
        assert.equal(resource.description, doc.querySelector('meta[name="description"]').content.trim(), `${rel}: description from the page`);
        assert.equal(resource.name, doc.title.replace(/\s*\|\s*UpSkill Sprint\s*$/, ''), `${rel}: name from the title`);
      }
      checked++;
    }
    assert.ok(checked >= 57, `checked ${checked} lessons`);
  } finally {
    fs.rmSync(out, { recursive: true, force: true });
  }
});
