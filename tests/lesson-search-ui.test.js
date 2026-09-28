const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const coreSource = fs.readFileSync(path.join(root, 'lesson-search-core.js'), 'utf8');
const uiSource = fs.readFileSync(path.join(root, 'lesson-search.js'), 'utf8');

const index = {
  version: 1,
  lessons: [
    {
      id: 'statistical-transformations',
      path: '/lessons/statistical-transformations',
      title: 'Statistical Transformations',
      description: 'Choose a transformation or average for the problem in front of you.',
      topic: 'statistics',
      level: 'beginner',
      minutes: 18,
      interactive: true,
      keywords: ['average', 'mean', 'transformation'],
      sections: [
        {
          id: 'lesson-section-harmonic-mean',
          heading: 'Harmonic mean',
          breadcrumb: ['Average', 'Harmonic mean'],
          kinds: ['section', 'formula', 'example'],
          text: 'Use the harmonic mean to average speeds over equal-distance trips.'
        },
        {
          id: 'lesson-section-log-transformation',
          heading: 'Log transformation',
          breadcrumb: ['Transformations', 'Log transformation'],
          kinds: ['section', 'example'],
          text: 'Use a log transformation for salary data with a long right tail.'
        }
      ]
    },
    {
      id: 'control-charts',
      path: '/lessons/control-charts-explained',
      title: 'Control Charts, Explained',
      description: 'Learn statistical process control with a practical process example.',
      topic: 'lean-six-sigma',
      level: 'beginner',
      minutes: 15,
      interactive: true,
      keywords: ['SPC', 'statistical process control'],
      sections: [
        {
          id: 'lesson-section-common-cause',
          heading: 'Common-cause variation',
          breadcrumb: ['Control charts', 'Common-cause variation'],
          kinds: ['section'],
          text: 'A stable process contains only common-cause variation.'
        }
      ]
    }
  ]
};

function fixture() {
  return `<!doctype html><html><body>
    <main id="lesson-library"><div class="wrap">
      <form id="lesson-filters" class="library-tools">
        <div class="filter-field lesson-search-shell">
          <label for="lesson-search">Search lessons</label>
          <input id="lesson-search" type="search">
          <div id="lesson-search-suggestions" hidden></div>
        </div>
        <select id="topic-filter"><option value="">All topics</option><option value="statistics">Statistics</option><option value="lean-six-sigma">Lean Six Sigma</option></select>
        <select id="level-filter"><option value="">All levels</option><option value="beginner">Beginner</option></select>
        <input id="interactive-filter" type="checkbox">
        <button id="clear-filters" type="button">Clear</button>
      </form>
      <div class="library-status"><span id="results-count" aria-live="polite"></span></div>
      <section id="featured-section"></section>
      <section data-category-section data-topic="statistics"><div class="lesson-list">
        <a href="/lessons/statistical-transformations" data-lesson-item data-topic="statistics" data-level="beginner" data-interactive="true" data-search="statistical transformations average mean">
          <div><div class="lesson-meta"><span>Beginner</span><span>18 min read</span></div><h3>Statistical Transformations</h3><p>Choose the right transformation.</p></div>
        </a>
      </div></section>
      <section data-category-section data-topic="lean-six-sigma"><div class="lesson-list">
        <a href="/lessons/control-charts-explained" data-lesson-item data-topic="lean-six-sigma" data-level="beginner" data-interactive="true" data-search="control charts spc">
          <div><div class="lesson-meta"><span>Beginner</span><span>15 min read</span></div><h3>Control Charts, Explained</h3><p>Learn process control.</p></div>
        </a>
      </div></section>
      <section id="no-results" hidden><h2>No matches</h2><p>Try again.</p></section>
    </div></main>
  </body></html>`;
}

async function setup() {
  const dom = new JSDOM(fixture(), {
    url: 'https://example.test/lessons.html',
    runScripts: 'outside-only',
    pretendToBeVisual: true
  });
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  dom.window.fetch = async function () {
    return { ok: true, json: async function () { return index; } };
  };
  dom.window.eval(coreSource);
  dom.window.eval(uiSource);
  dom.window.UpskillLessonSearch.init({ index });
  await new Promise(function (resolve) { dom.window.setTimeout(resolve, 10); });
  return dom;
}

async function enterQuery(dom, query) {
  const input = dom.window.document.getElementById('lesson-search');
  input.focus();
  input.value = query;
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  await new Promise(function (resolve) { dom.window.setTimeout(resolve, 150); });
  return input;
}

test('deep links keep the student query in the URL hash, not the query string', async () => {
  const dom = await setup();
  const href = dom.window.UpskillLessonSearch.createDeepLink(
    '/lessons/statistical-transformations',
    'lesson-section-harmonic-mean',
    'equal distance trips'
  );
  assert.equal(href.includes('?'), false);
  assert.match(href, /#section=lesson-section-harmonic-mean&search=equal\+distance\+trips&from=lesson-search$/);
  dom.window.close();
});

test('return links restore the remembered search without treating ordinary anchors as queries', async () => {
  const dom = await setup();
  const search = dom.window.UpskillLessonSearch.searchFromLocationHash;
  assert.equal(search({ hash: '#search=equal+distance+trips' }), 'equal distance trips');
  assert.equal(search({ hash: '#section=statistics&search=harmonic%20mean&from=lesson-search' }), 'harmonic mean');
  assert.equal(search({ hash: '#statistics' }), '');
  dom.window.close();
});

test('the progressive fallback keeps title mode limited to lesson titles', async () => {
  const dom = await setup();
  const fallback = dom.window.UpskillLessonSearch.fallbackSearch;
  assert.equal(fallback(index, 'average', { mode: 'titles' }).totalLessons, 0,
    'a keyword-only match must not appear in title mode');
  assert.equal(fallback(index, 'statistical', { mode: 'titles' }).results[0].title,
    'Statistical Transformations');
  dom.window.close();
});

test('natural-language search groups results by lesson and links to the exact section', async () => {
  const dom = await setup();
  dom.window.document.getElementById('topic-filter').value = 'statistics';
  await enterQuery(dom, 'Which average should I use for equal-distance trips?');
  const document = dom.window.document;
  assert.equal(document.querySelectorAll('.lesson-search-card').length, 1);
  assert.equal(document.querySelector('.lesson-search-card-title').textContent.trim(), 'Statistical Transformations');
  const link = document.querySelector('.lesson-search-hit-link');
  assert.match(link.getAttribute('href'), /section=lesson-section-harmonic-mean/);
  assert.equal(document.getElementById('results-count').textContent, '1 lesson · 1 matching section');
  assert.ok(document.querySelector('.lesson-search-hit-excerpt mark'));
  dom.window.close();
});

test('combobox suggestions support arrow-key navigation and expose an active option', async () => {
  const dom = await setup();
  const input = await enterQuery(dom, 'SPC');
  const document = dom.window.document;
  assert.equal(input.getAttribute('aria-expanded'), 'true');
  const options = [...document.querySelectorAll('#lesson-search-suggestions [role="option"]')];
  assert.ok(options.length > 0);
  assert.ok(options.every(option => option.parentElement.id === 'lesson-search-suggestions'));
  assert.ok(options.every(option => option.tabIndex === -1));
  input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  const activeId = input.getAttribute('aria-activedescendant');
  assert.ok(activeId);
  assert.equal(document.getElementById(activeId).getAttribute('aria-selected'), 'true');
  input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(input.getAttribute('aria-expanded'), 'false');
  dom.window.close();
});

test('ArrowUp starts at the final suggestion and rerenders clear stale active descendants', async () => {
  const dom = await setup();
  const input = await enterQuery(dom, 'SPC');
  const document = dom.window.document;
  const options = [...document.querySelectorAll('#lesson-search-suggestions [role="option"]')];
  input.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  assert.equal(input.getAttribute('aria-activedescendant'), options.at(-1).id);

  input.value = 'mean';
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  await new Promise(function (resolve) { dom.window.setTimeout(resolve, 150); });
  assert.equal(input.hasAttribute('aria-activedescendant'), false);
  dom.window.close();
});

test('mode chips narrow matches to formulas without changing the query', async () => {
  const dom = await setup();
  const input = await enterQuery(dom, 'mean');
  const formulaButton = dom.window.document.querySelector('[data-search-mode="formulas"]');
  formulaButton.click();
  await new Promise(function (resolve) { dom.window.setTimeout(resolve, 150); });
  assert.equal(input.value, 'mean');
  assert.equal(formulaButton.getAttribute('aria-pressed'), 'true');
  assert.equal(dom.window.document.querySelector('.lesson-search-hit-kind').textContent, 'Formula');
  dom.window.close();
});

test('catalog-ready events make a newly added lesson searchable without controller changes', async () => {
  const dom = await setup();
  const document = dom.window.document;
  const list = document.querySelector('[data-topic="statistics"] .lesson-list');
  const row = document.createElement('a');
  row.href = '/lessons/future-forecasting-lesson';
  row.setAttribute('data-lesson-item', '');
  row.dataset.topic = 'statistics';
  row.dataset.level = 'beginner';
  row.dataset.interactive = 'false';
  row.dataset.search = 'future forecasting lesson demand planning';
  row.innerHTML = '<div><h3>Future Forecasting Lesson</h3><p>Plan demand with a forecast.</p></div>';
  list.appendChild(row);
  document.dispatchEvent(new dom.window.Event('upskill:lesson-catalog-ready'));
  await new Promise(function (resolve) { dom.window.setTimeout(resolve, 90); });
  await enterQuery(dom, 'demand planning');
  assert.match(document.querySelector('.lesson-search-card-title').textContent, /Future Forecasting Lesson/);
  dom.window.close();
});
