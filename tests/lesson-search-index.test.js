'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const BUILDER_URL = pathToFileURL(path.join(ROOT, 'scripts/build-lesson-search-index.mjs')).href;
const OUTPUT = path.join(ROOT, 'assets/search/lesson-search-index.json');
const context = require('../lesson-search-context.js');

let builder;
let index;

test.before(async () => {
  builder = await import(BUILDER_URL);
  index = builder.buildLessonSearchIndex(ROOT);
});

function allSearchText(searchIndex) {
  return searchIndex.lessons.flatMap(lesson => [
    lesson.title,
    lesson.description,
    ...lesson.keywords,
    ...lesson.sections.flatMap(section => [section.heading, ...section.breadcrumb, section.text])
  ]).join(' ');
}

function fixtureMetadata(relativePath, overrides = {}) {
  const slug = path.basename(relativePath, '.html');
  return JSON.stringify({
    title: 'Future lesson',
    slug,
    category: 'Statistics',
    category_slug: 'statistics',
    level: 'Beginner',
    estimated_minutes: 12,
    interactive: false,
    card_title: 'Future lesson',
    card_description: 'A lesson added after the search feature shipped.',
    search_keywords: ['future concept'],
    suggested_github_path: relativePath,
    ...overrides
  }, null, 2);
}

function writeFixtureFile(root, relativePath, contents) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-search-index-'));
  writeFixtureFile(root, 'lessons.html', `<!doctype html><main>
    <section class="lesson-category" id="statistics" data-category-section data-topic="statistics"><div class="lesson-list">
      <a data-lesson-item href="/lessons/statistics/static-future" data-topic="statistics"
        data-level="beginner" data-interactive="false" data-search="static remembered phrase">
        <div><div class="lesson-meta"><span>Beginner</span><span>12 min</span></div>
        <h3>Static future lesson</h3><p>Discovered from the rendered catalog row.</p></div>
      </a>
    </div></section>
  </main>`);
  writeFixtureFile(root, 'chi-square-lesson-library.js', `(() => {
    const LESSONS = [{
      marker: 'data-dynamic-future', sectionId: 'statistics',
      path: '/lessons/statistics/dynamic-future', topic: 'statistics', level: 'beginner',
      interactive: 'true', search: 'dynamic remembered phrase', meta: '<span>14 min</span>',
      title: 'Dynamic future lesson', description: 'Discovered from the literal lesson definitions.'
    }];
  })();`);
  writeFixtureFile(root, 'lessons/statistics/static-future.html', `<!doctype html>
    <!-- UPSKILLSPRINT_LESSON_META ${fixtureMetadata('lessons/statistics/static-future.html', {
      title: 'Static future lesson', card_title: 'Static future lesson'
    })} -->
    <main id="lesson-content"><h1>Static future lesson</h1><h2>Remembered static heading</h2>
    <p>This conventional lesson body is indexed without a lesson-specific resolver.</p></main>
    <script src="/site-sections.js"></script>`);
  writeFixtureFile(root, 'lessons/statistics/dynamic-future.html', `<!doctype html>
    <!-- UPSKILLSPRINT_LESSON_META ${fixtureMetadata('lessons/statistics/dynamic-future.html', {
      title: 'Dynamic future lesson', card_title: 'Dynamic future lesson', interactive: true,
      estimated_minutes: 14
    })} -->
    <main id="lesson-content"><h1>Dynamic future lesson</h1><h2>Remembered dynamic heading</h2>
    <p>This lesson was added to the literal catalog and is indexed automatically.</p></main>
    <script src="/site-sections.js"></script>`);
  return root;
}

test('checked-in index is byte-for-byte deterministic and current', () => {
  const first = builder.serializeLessonSearchIndex(index);
  const second = builder.serializeLessonSearchIndex(builder.buildLessonSearchIndex(ROOT));
  assert.equal(second, first);
  assert.equal(fs.readFileSync(OUTPUT, 'utf8'), first,
    'run node scripts/build-lesson-search-index.mjs after changing the lesson catalog or lesson content');
  assert.equal(index.lessonCount, index.lessons.length);
  assert.equal(index.sectionCount,
    index.lessons.reduce((total, lesson) => total + lesson.sections.length, 0));
});

test('every catalog entry is represented and every published lesson has searchable sections', () => {
  const catalog = builder.discoverCatalog(ROOT);
  assert.equal(index.lessonCount, catalog.length);
  assert.ok(index.contentLessonCount >= 46, 'expected all currently published lessons');
  for (const lesson of index.lessons) {
    assert.ok(lesson.id);
    assert.ok(lesson.path.startsWith('/'));
    assert.ok(lesson.title);
    assert.ok(lesson.topic);
    assert.ok(lesson.level);
    assert.equal(typeof lesson.interactive, 'boolean');
    if (lesson.contentAvailable) {
      assert.equal(lesson.placeholder, false);
      assert.ok(lesson.sections.length > 0, `${lesson.path} has searchable sections`);
    }
  }
});

test('coming-soon template cards remain distinct title records without indexing template prose', () => {
  const expectedPlaceholders = builder.discoverCatalog(ROOT).filter(lesson => lesson.placeholder);
  const placeholders = index.lessons.filter(lesson => lesson.path === '/lesson-template');
  assert.equal(placeholders.length, expectedPlaceholders.length);
  assert.equal(new Set(placeholders.map(lesson => lesson.id)).size, placeholders.length);
  for (const lesson of placeholders) {
    assert.equal(lesson.placeholder, true);
    assert.equal(lesson.contentAvailable, false);
    assert.deepEqual(lesson.sections, []);
  }
});

test('compressed and fragment-loaded lessons contribute their real content', () => {
  const byPath = new Map(index.lessons.map(lesson => [lesson.path, lesson]));
  const cases = [
    ['/lessons/statistics/chi-square-goodness-of-fit-test', /Observed counts/i],
    ['/lessons/statistics/beyond-the-bell-the-normal-distribution-and-its-relatives', /Central Limit Theorem/i],
    ['/lessons/introduction-to-design-of-experiment-doe', /factorial design tests every combination/i],
    ['/lessons/power-bi-excel-sql/minitab-control-chart-selection-analysis', /Laney U/i]
  ];
  for (const [lessonPath, expected] of cases) {
    const lesson = byPath.get(lessonPath);
    assert.ok(lesson, `${lessonPath} is indexed`);
    assert.match(lesson.sections.map(section => `${section.heading} ${section.text}`).join(' '), expected);
  }

  const dmaic = byPath.get('/lessons/lean-six-sigma/dmaic-formula-encyclopedia');
  assert.ok(dmaic);
  const formulaSections = dmaic.sections.filter(section => section.id.startsWith('formula-title-'));
  assert.equal(formulaSections.length, 111);
  assert.ok(formulaSections.every(section => /^formula-title-[A-Z]\d{2}$/.test(section.id)));
  assert.match(formulaSections.map(section => section.text).join(' '), /Revenue Growth/i);
});

test('long lesson sections preserve real tail content instead of truncating silently', () => {
  const resampling = index.lessons.find(lesson =>
    lesson.path === '/lessons/statistics/resampling-in-minitab');
  assert.ok(resampling);
  const longSection = resampling.sections.find(section =>
    section.heading === 'Bootstrap and randomization are cousins, not twins');
  assert.ok(longSection);
  assert.ok(longSection.text.length > 5_000, 'the source section is longer than the former cutoff');
  assert.match(longSection.text,
    /Higher numbers of resamples give smoother resampling distributions\./i);
});

test('semantic main headers and lesson footers stay searchable while site chrome is excluded', () => {
  const copq = index.lessons.find(lesson =>
    lesson.path === '/lessons/quality-engineering/cost-of-poor-quality');
  assert.ok(copq);
  const hero = copq.sections.find(section => section.heading === 'Cost of Poor Quality (COPQ)');
  assert.ok(hero, 'the h1 nested in main > header is indexed');
  assert.match(hero.text,
    /turns nonconformances into dollars leadership actually budgets against/i);

  const sections = builder.extractSections(`<!doctype html><main id="lesson-content">
    <header class="site lesson-sitebar"><h2>Global navigation</h2><p>Site chrome phrase.</p></header>
    <header><h1>Semantic lesson header</h1><p>Teaching copy in the lesson header.</p></header>
    <footer><h2>Semantic lesson footer</h2><p>Teaching copy in the lesson footer.</p></footer>
    <footer class="site"><h2>Global footer</h2><p>Footer chrome phrase.</p></footer>
  </main>`);
  const searchText = sections.map(section => `${section.heading} ${section.text}`).join(' ');
  assert.match(searchText, /Teaching copy in the lesson header/);
  assert.match(searchText, /Teaching copy in the lesson footer/);
  assert.doesNotMatch(searchText, /Site chrome phrase|Footer chrome phrase/);
});

test('quiz answers, scripts, and site chrome are excluded from searchable text', () => {
  const searchText = allSearchText(index);
  assert.doesNotMatch(searchText,
    /The log transformation compresses large positive values more than small ones/i);
  assert.doesNotMatch(searchText,
    /I-MR is appropriate because the response is continuous and there is one observation per coil/i);
  assert.doesNotMatch(searchText, /skillsprintconsulting@gmail\.com/i);
  assert.doesNotMatch(searchText, /function\s+applyFilters\s*\(/i);
});

test('all section anchors are unique within a lesson and kinds use the supported vocabulary', () => {
  for (const lesson of index.lessons) {
    const ids = lesson.sections.map(section => section.id);
    assert.equal(new Set(ids).size, ids.length, `${lesson.path} has unique anchors`);
    for (const section of lesson.sections) {
      assert.ok(section.heading);
      assert.ok(section.breadcrumb.length);
      assert.ok(section.text.length <= builder.MAX_SECTION_TEXT);
      assert.ok(section.excerpt.length <= 261);
      assert.ok(section.kinds.includes('section'));
      assert.ok(section.kinds.every(kind => ['section', 'example', 'formula'].includes(kind)));
    }
  }
});

test('sections beyond the high safety limit fail explicitly instead of being clipped', () => {
  const oversizedText = 'x'.repeat(builder.MAX_SECTION_TEXT + 1);
  assert.throws(
    () => builder.extractSections(
      `<!doctype html><main><h1>Oversized section</h1><p>${oversizedText}</p></main>`,
      { label: 'oversized fixture' }
    ),
    /Oversized section.*exceeding the 100000-character safety limit/i
  );
});

test('build-time generated anchors match the runtime lesson context algorithm', () => {
  const source = `<!doctype html><main id="lesson-content">
    <div id="lesson-section-control-limits"></div>
    <h1 id="authored">Café & Cpk</h1><h2>Control limits</h2><h2>Control limits</h2><h3>√</h3>
  </main>`;
  const runtimeDom = new JSDOM(source);
  const buildDom = new JSDOM(source);
  const runtimeRoot = runtimeDom.window.document.querySelector('main');
  const buildRoot = buildDom.window.document.querySelector('main');
  context.assignHeadingIds(runtimeRoot);
  builder.assignDeterministicHeadingIds(buildDom.window.document, buildRoot);
  assert.deepEqual(
    [...buildRoot.querySelectorAll('h1,h2,h3')].map(heading => heading.id),
    [...runtimeRoot.querySelectorAll('h1,h2,h3')].map(heading => heading.id)
  );
  runtimeDom.window.close();
  buildDom.window.close();
});

test('excluded quiz headings still reserve runtime collision suffixes', () => {
  const source = `<!doctype html><main id="lesson-content">
    <h2>Summary</h2>
    <section id="quiz"><h2>Summary</h2><p>The answer must not be indexed.</p></section>
    <h2>Summary</h2><p>The closing summary remains searchable.</p>
  </main>`;
  const runtimeDom = new JSDOM(source);
  context.assignHeadingIds(runtimeDom.window.document.querySelector('main'));
  const runtimeIds = [...runtimeDom.window.document.querySelectorAll('main > h2')]
    .map(heading => heading.id);
  const indexed = builder.extractSections(source);
  assert.deepEqual(indexed.map(section => section.id), runtimeIds);
  assert.equal(indexed.some(section => section.text.includes('answer must not be indexed')), false);
  runtimeDom.window.close();
});

test('new conventional lessons are automatically discovered from static and literal catalog entries', () => {
  const root = makeFixture();
  try {
    const futureIndex = builder.buildLessonSearchIndex(root);
    assert.equal(futureIndex.lessonCount, 2);
    assert.deepEqual(futureIndex.lessons.map(lesson => lesson.title), [
      'Static future lesson',
      'Dynamic future lesson'
    ]);
    assert.match(allSearchText(futureIndex), /Remembered static heading/);
    assert.match(allSearchText(futureIndex), /Remembered dynamic heading/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('dynamic catalog entries must map uniquely to a real catalog section', () => {
  function expectCatalogFailure(transform, pattern) {
    const root = makeFixture();
    try {
      const file = path.join(root, 'chi-square-lesson-library.js');
      fs.writeFileSync(file, transform(fs.readFileSync(file, 'utf8')));
      assert.throws(() => builder.discoverCatalog(root), pattern);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }

  expectCatalogFailure(
    source => source.replace("sectionId: 'statistics',", ''),
    /missing sectionId/i
  );
  expectCatalogFailure(
    source => source.replace("marker: 'data-dynamic-future'", "marker: 'dynamic future'"),
    /valid lowercase data-\* attribute/i
  );
  expectCatalogFailure(
    source => source.replace("marker: 'data-dynamic-future'", "marker: 'data-lesson-item'"),
    /marker is reserved/i
  );
  expectCatalogFailure(
    source => source.replace("topic: 'statistics'", "topic: 'data-analytics'"),
    /topic must exactly match sectionId/i
  );
  expectCatalogFailure(
    source => source.replace("sectionId: 'statistics'", "sectionId: 'missing-category'")
      .replace("topic: 'statistics'", "topic: 'missing-category'"),
    /topic does not match a lesson category section|sectionId does not exist/i
  );
  expectCatalogFailure(
    source => source.replace("interactive: 'true'", "interactive: 'sometimes'"),
    /interactive must be true or false/i
  );
  expectCatalogFailure(
    source => source.replace("level: 'beginner'", "level: 'expert'"),
    /level must be beginner, intermediate, or advanced/i
  );

  const staticCollisionRoot = makeFixture();
  try {
    const catalogFile = path.join(staticCollisionRoot, 'lessons.html');
    fs.writeFileSync(catalogFile, fs.readFileSync(catalogFile, 'utf8').replace(
      '<a data-lesson-item ',
      '<a data-lesson-item data-dynamic-future '
    ));
    assert.throws(() => builder.discoverCatalog(staticCollisionRoot), /marker already exists in static catalog markup/i);
  } finally {
    fs.rmSync(staticCollisionRoot, { recursive: true, force: true });
  }

  const duplicateRoot = makeFixture();
  try {
    writeFixtureFile(duplicateRoot, 'chi-square-lesson-library.js', `(() => {
      const LESSONS = [
        { marker: 'data-duplicate', sectionId: 'statistics', path: '/lessons/statistics/one',
          topic: 'statistics', level: 'beginner', interactive: 'false', title: 'One' },
        { marker: 'data-duplicate', sectionId: 'statistics', path: '/lessons/statistics/two',
          topic: 'statistics', level: 'beginner', interactive: 'false', title: 'Two' }
      ];
    })();`);
    assert.throws(() => builder.discoverCatalog(duplicateRoot), /Duplicate dynamic marker/i);
  } finally {
    fs.rmSync(duplicateRoot, { recursive: true, force: true });
  }

  const existingEmptyTopicRoot = makeFixture();
  try {
    const catalogFile = path.join(existingEmptyTopicRoot, 'lessons.html');
    fs.writeFileSync(catalogFile, fs.readFileSync(catalogFile, 'utf8').replace(
      '</main>',
      '<section class="lesson-category" id="exam-practice" data-empty-category data-topic="exam-practice"></section></main>'
    ));
    const libraryFile = path.join(existingEmptyTopicRoot, 'chi-square-lesson-library.js');
    fs.writeFileSync(libraryFile, fs.readFileSync(libraryFile, 'utf8')
      .replace("sectionId: 'statistics'", "sectionId: 'exam-practice'")
      .replace("topic: 'statistics'", "topic: 'exam-practice'"));
    const catalog = builder.discoverCatalog(existingEmptyTopicRoot);
    assert.equal(catalog.find(entry => entry.catalogKind === 'dynamic').topic, 'exam-practice');
  } finally {
    fs.rmSync(existingEmptyTopicRoot, { recursive: true, force: true });
  }
});

test('static catalog entries must use a supported topic and sit in its matching category section', () => {
  function expectStaticCatalogFailure(transform, pattern) {
    const root = makeFixture();
    try {
      const file = path.join(root, 'lessons.html');
      fs.writeFileSync(file, transform(fs.readFileSync(file, 'utf8')));
      assert.throws(() => builder.discoverCatalog(root), pattern);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }

  expectStaticCatalogFailure(
    source => source.replace('data-topic="statistics"\n        data-level',
      'data-topic="quality-engineering"\n        data-level'),
    /data-topic must match its category section/i
  );
  expectStaticCatalogFailure(
    source => source.replace('data-topic="statistics"\n        data-level',
      'data-topic="invented-topic"\n        data-level'),
    /data-topic must match its category section|topic does not match a lesson category section/i
  );
  expectStaticCatalogFailure(
    source => source.replace('id="statistics" data-category-section',
      'id="statistics"'),
    /must be inside a data-category-section lesson category/i
  );
  expectStaticCatalogFailure(
    source => source.replace('id="statistics" data-category-section data-topic="statistics"',
      'id="wrong-section" data-category-section data-topic="statistics"'),
    /category section.*matching id and data-topic|category section id must match its data-topic/i
  );
});

test('every production lesson HTML file is cataloged unless it is a verified redirect or fragment', () => {
  const unregisteredRoot = makeFixture();
  try {
    writeFixtureFile(unregisteredRoot, 'lessons/statistics/forgotten-future.html', `<!doctype html>
      <!-- UPSKILLSPRINT_LESSON_META ${fixtureMetadata('lessons/statistics/forgotten-future.html')} -->
      <main id="lesson-content"><h1>Forgotten future lesson</h1>
      <p>This otherwise valid lesson was accidentally omitted from the public catalog.</p></main>
      <script src="/site-sections.js"></script>`);
    assert.throws(() => builder.buildLessonSearchIndex(unregisteredRoot),
      /Lesson HTML file is not registered.*forgotten-future\.html/i);
  } finally {
    fs.rmSync(unregisteredRoot, { recursive: true, force: true });
  }

  const exemptRoot = makeFixture();
  try {
    writeFixtureFile(exemptRoot, 'lessons/statistics/legacy-future.html', `<!doctype html><html><head>
      <meta name="robots" content="noindex, nofollow">
      <meta http-equiv="refresh" content="0; url=/lessons/statistics/static-future">
      </head><body>Moved permanently.</body></html>`);
    writeFixtureFile(exemptRoot, 'lessons/assets/future-parts/part-01.html',
      '<section><h2>Runtime fragment</h2><p>Assembled only by a registered resolver.</p></section>');
    const futureIndex = builder.buildLessonSearchIndex(exemptRoot);
    assert.equal(futureIndex.lessonCount, 2);

    writeFixtureFile(exemptRoot, 'lessons/statistics/noindex-but-not-a-redirect.html', `<!doctype html>
      <meta name="robots" content="noindex"><main><h1>Hidden lesson</h1>
      <p>Noindex alone must not make a production lesson invisible to catalog coverage.</p></main>`);
    assert.throws(() => builder.buildLessonSearchIndex(exemptRoot),
      /Lesson HTML file is not registered.*noindex-but-not-a-redirect\.html/i);
  } finally {
    fs.rmSync(exemptRoot, { recursive: true, force: true });
  }

  const externalRedirectRoot = makeFixture();
  try {
    writeFixtureFile(externalRedirectRoot, 'lessons/statistics/external-redirect.html', `<!doctype html>
      <meta name="robots" content="noindex">
      <meta http-equiv="refresh" content="0; url=https://example.com/lessons/statistics/static-future">`);
    assert.throws(() => builder.buildLessonSearchIndex(externalRedirectRoot),
      /must point to a same-origin registered lesson/i);
  } finally {
    fs.rmSync(externalRedirectRoot, { recursive: true, force: true });
  }

  const badFragmentRoot = makeFixture();
  try {
    writeFixtureFile(badFragmentRoot, 'lessons/assets/future-parts/not-really-a-fragment.html', `<!doctype html>
      <!-- UPSKILLSPRINT_LESSON_META ${fixtureMetadata('lessons/assets/future-parts/not-really-a-fragment.html')} -->
      <main><h1>Misplaced lesson</h1><p>A real lesson cannot hide in the fragment directory.</p></main>`);
    assert.throws(() => builder.buildLessonSearchIndex(badFragmentRoot),
      /Only metadata-free partial HTML is allowed in fragment-only/i);

    writeFixtureFile(badFragmentRoot, 'lessons/assets/future-parts/not-really-a-fragment.html',
      '<!doctype html><html><head><title>Full document</title></head><body><main>Not a fragment.</main></body></html>');
    assert.throws(() => builder.buildLessonSearchIndex(badFragmentRoot),
      /Only metadata-free partial HTML is allowed in fragment-only/i);
  } finally {
    fs.rmSync(badFragmentRoot, { recursive: true, force: true });
  }
});

test('missing files, metadata path mistakes, and unknown loader shells fail instead of vanishing', () => {
  const root = makeFixture();
  try {
    fs.rmSync(path.join(root, 'lessons/statistics/static-future.html'));
    assert.throws(() => builder.buildLessonSearchIndex(root), /cannot be resolved/i);

    writeFixtureFile(root, 'lessons/statistics/static-future.html', `<!doctype html>
      <!-- UPSKILLSPRINT_LESSON_META ${fixtureMetadata('lessons/statistics/not-the-file.html')} -->
      <main><h1>Future lesson</h1><p>Enough ordinary content to be searchable.</p></main>
      <script src="/site-sections.js"></script>`);
    assert.throws(() => builder.buildLessonSearchIndex(root), /Metadata path mismatch/i);

    writeFixtureFile(root, 'lessons/statistics/static-future.html', `<!doctype html>
      <!-- UPSKILLSPRINT_LESSON_META ${fixtureMetadata('lessons/statistics/static-future.html', { level: 'Advanced' })} -->
      <main><h1>Future lesson</h1><p>Enough ordinary content to be searchable.</p></main>
      <script src="/site-sections.js"></script>`);
    assert.throws(() => builder.buildLessonSearchIndex(root), /Metadata level mismatch/i);

    writeFixtureFile(root, 'lessons/statistics/static-future.html', `<!doctype html>
      <!-- UPSKILLSPRINT_LESSON_META ${fixtureMetadata('lessons/statistics/static-future.html')} -->
      <main><h1>Loading future lesson</h1></main><script src="/assets/future-lesson-loader.js"></script>
      <script src="/site-sections.js"></script>`);
    assert.throws(() => builder.buildLessonSearchIndex(root), /Unsupported content loader/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('title-only shells and unregistered fetch-to-DOM loaders fail instead of appearing searchable', () => {
  const titleOnlyRoot = makeFixture();
  try {
    writeFixtureFile(titleOnlyRoot, 'lessons/statistics/static-future.html', `<!doctype html>
      <!-- UPSKILLSPRINT_LESSON_META ${fixtureMetadata('lessons/statistics/static-future.html', {
        title: 'Static future lesson', card_title: 'Static future lesson'
      })} -->
      <main id="lesson-content"><h1>A deceptively long title without teaching content</h1></main>
      <script src="/site-sections.js"></script>`);
    assert.throws(() => builder.buildLessonSearchIndex(titleOnlyRoot), /no searchable sections/i);
  } finally {
    fs.rmSync(titleOnlyRoot, { recursive: true, force: true });
  }

  const loaderRoot = makeFixture();
  try {
    writeFixtureFile(loaderRoot, 'lessons/statistics/static-future.html', `<!doctype html>
      <!-- UPSKILLSPRINT_LESSON_META ${fixtureMetadata('lessons/statistics/static-future.html', {
        title: 'Static future lesson', card_title: 'Static future lesson'
      })} -->
      <main id="lesson-content"><h1>Static future lesson</h1>
        <p>This shell has enough introductory copy to look searchable before its real lesson arrives.</p>
        <div id="future-host"></div></main>
      <script>fetch('/future-fragment').then(r => r.text()).then(html => {
        document.getElementById('future-host').innerHTML = html;
      });</script>
      <script src="/site-sections.js"></script>`);
    assert.throws(() => builder.buildLessonSearchIndex(loaderRoot), /Unsupported content loader/i);
  } finally {
    fs.rmSync(loaderRoot, { recursive: true, force: true });
  }
});

test('unknown runtime loader variants fail conservatively until a resolver is registered', () => {
  const loaders = [
    {
      name: 'fetch plus replaceChildren',
      code: `async function loadLesson() {
        const response = await fetch('/future-fragment.html');
        const markup = await response.text();
        const parsed = new DOMParser().parseFromString(markup, 'text/html');
        document.getElementById('future-host').replaceChildren(...parsed.body.childNodes);
      } loadLesson();`
    },
    {
      name: 'DOMParser injection through a helper',
      code: `const parsed = new DOMParser().parseFromString(window.futureMarkup, 'text/html');
        mountParsedLesson(document.getElementById('future-host'), parsed.body);`
    },
    {
      name: 'dynamic module mount',
      code: `import('/assets/future-lesson-content.js').then(module => {
        module.mount(document.getElementById('future-host'));
      });`
    },
    {
      name: 'externally loaded fragment script',
      external: '<script src="/assets/future-content-loader.js"></script>'
    }
  ];

  for (const loader of loaders) {
    const root = makeFixture();
    try {
      writeFixtureFile(root, 'lessons/statistics/static-future.html', `<!doctype html>
        <!-- UPSKILLSPRINT_LESSON_META ${fixtureMetadata('lessons/statistics/static-future.html', {
          title: 'Static future lesson', card_title: 'Static future lesson'
        })} -->
        <main id="lesson-content"><h1>Static future lesson</h1>
          <p>This introductory shell has enough prose to appear substantive, but the real lesson is loaded later.</p>
          <div id="future-host"></div></main>
        ${loader.code ? `<script>${loader.code}</script>` : loader.external}
        <script src="/site-sections.js"></script>`);
      assert.throws(() => builder.buildLessonSearchIndex(root), /Unsupported content loader/i,
        `${loader.name} must require a build-time resolver`);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

test('future lessons must load the shared deep-link runtime', () => {
  const root = makeFixture();
  try {
    const file = path.join(root, 'lessons/statistics/static-future.html');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('<script src="/site-sections.js"></script>', ''));
    assert.throws(() => builder.buildLessonSearchIndex(root), /missing site-sections\.js/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('runtime-injected lessons must declare and implement a build-time resolver', () => {
  const root = makeFixture();
  try {
    const file = path.join(root, 'lessons/statistics/static-future.html');
    const source = fs.readFileSync(file, 'utf8').replace(
      fixtureMetadata('lessons/statistics/static-future.html', {
        title: 'Static future lesson', card_title: 'Static future lesson'
      }),
      fixtureMetadata('lessons/statistics/static-future.html', {
        title: 'Static future lesson', card_title: 'Static future lesson', search_content: 'runtime'
      })
    );
    fs.writeFileSync(file, source);
    assert.throws(() => builder.buildLessonSearchIndex(root), /runtime search content but has no build-time resolver/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('duplicate real catalog paths fail even when their metadata agrees', () => {
  const root = makeFixture();
  try {
    const libraryFile = path.join(root, 'chi-square-lesson-library.js');
    const source = fs.readFileSync(libraryFile, 'utf8')
      .replace('/lessons/statistics/dynamic-future', '/lessons/statistics/static-future')
      .replace("interactive: 'true'", "interactive: 'false'")
      .replace('Dynamic future lesson', 'Static future lesson');
    fs.writeFileSync(libraryFile, source);
    assert.throws(() => builder.discoverCatalog(root), /Duplicate real catalog path/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
