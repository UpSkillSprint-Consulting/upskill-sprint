'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SOURCE = fs.readFileSync(path.join(ROOT, 'lesson-search-context.js'), 'utf8');
const context = require('../lesson-search-context.js');

function settle(window, delay = 45) {
  return new Promise(resolve => window.setTimeout(resolve, delay));
}

async function waitFor(window, predicate, timeout = 2000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (predicate()) return;
    await settle(window, 25);
  }
  assert.fail('timed out waiting for lesson search context');
}

function browserFixture(hash) {
  const dom = new JSDOM(
    '<!doctype html><html><head></head><body data-lesson-page="true"><main id="lesson-content"></main></body></html>',
    {
      url: 'https://upskillsprint.com/lessons/example' + hash,
      runScripts: 'dangerously',
      pretendToBeVisual: true
    }
  );
  dom.window.HTMLElement.prototype.scrollIntoView = function () {
    this.setAttribute('data-test-scrolled', 'true');
  };
  dom.window.eval(SOURCE);
  return dom;
}

test('heading slugs are normalized consistently for punctuation and Unicode', () => {
  assert.equal(context.normalizeHeadingSlug('  Café & Cpk: What’s next?  '), 'cafe-and-cpk-what-s-next');
  assert.equal(context.normalizeHeadingSlug('√'), 'section');
  assert.equal(context.normalizeHeadingSlug(''), 'section');
});

test('heading IDs preserve authored anchors and resolve collisions deterministically', () => {
  const dom = new JSDOM(`<!doctype html><main id="lesson-content">
    <div id="lesson-section-control-limits"></div>
    <h1 id="overview">Overview</h1>
    <h2>Control limits</h2>
    <h2>Control limits</h2>
    <h3></h3>
  </main>`);
  const main = dom.window.document.querySelector('main');

  context.assignHeadingIds(main);
  const headings = [...main.querySelectorAll('h1,h2,h3')];
  assert.deepEqual(headings.map(heading => heading.id), [
    'overview',
    'lesson-section-control-limits-2',
    'lesson-section-control-limits-3',
    'lesson-section-section'
  ]);

  context.assignHeadingIds(main);
  assert.deepEqual(headings.map(heading => heading.id), [
    'overview',
    'lesson-section-control-limits-2',
    'lesson-section-control-limits-3',
    'lesson-section-section'
  ]);
  assert.equal(headings[0].hasAttribute('data-lesson-search-generated-id'), false);
  dom.window.close();
});

test('generated IDs are recalculated in document order when content arrives asynchronously', () => {
  const dom = new JSDOM('<!doctype html><main><h2>Example</h2></main>');
  const main = dom.window.document.querySelector('main');
  context.assignHeadingIds(main);

  const first = main.querySelector('h2');
  assert.equal(first.id, 'lesson-section-example');

  const earlier = dom.window.document.createElement('h2');
  earlier.textContent = 'Example';
  main.prepend(earlier);
  context.assignHeadingIds(main);

  assert.equal(earlier.id, 'lesson-section-example');
  assert.equal(first.id, 'lesson-section-example-2');
  dom.window.close();
});

test('parameterized search links wait for dynamic content, highlight safely, and expose a return link', async () => {
  const dom = browserFixture('#section=lesson-section-control-limits&search=control%20limits&from=lesson-search');
  const { document } = dom.window;
  const main = document.getElementById('lesson-content');

  const section = document.createElement('section');
  section.innerHTML = `
    <h2>Control limits</h2>
    <p>Control limits distinguish common-cause variation.</p>
    <pre>control limits must not be marked here</pre>
    <div class="MathJax">control limits must not be marked here</div>
    <form><label>control limits must not be marked here <input value="control limits"></label></form>
    <div class="quiz-section"><p>control limits must not be marked here</p></div>`;
  main.appendChild(section);
  await waitFor(dom.window, () => section.querySelector('h2').getAttribute('data-test-scrolled') === 'true');

  const heading = section.querySelector('h2');
  assert.equal(heading.id, 'lesson-section-control-limits');
  assert.equal(heading.getAttribute('data-test-scrolled'), 'true');
  assert.equal(document.activeElement, heading);
  assert.ok(section.querySelectorAll('mark[data-lesson-search-highlight]').length >= 2);
  assert.equal(section.querySelector('pre mark'), null);
  assert.equal(section.querySelector('.MathJax mark'), null);
  assert.equal(section.querySelector('form mark'), null);
  assert.equal(section.querySelector('.quiz-section mark'), null);

  const banner = document.getElementById('lesson-search-context');
  assert.ok(banner, 'search context banner is present');
  assert.equal(banner.getAttribute('role'), 'region');
  assert.match(banner.textContent, /Control limits/);
  assert.equal(
    banner.querySelector('a').getAttribute('href'),
    '/lessons#search=control%20limits'
  );
  dom.window.LessonSearchContext.destroy();
  dom.window.close();
});

test('a standard raw anchor is focused after its target is injected', async () => {
  const dom = browserFixture('#worked-example');
  const { document } = dom.window;
  const heading = document.createElement('h2');
  heading.id = 'worked-example';
  heading.textContent = 'Worked example';
  document.getElementById('lesson-content').appendChild(heading);
  await waitFor(dom.window, () => heading.getAttribute('data-test-scrolled') === 'true');

  assert.equal(heading.getAttribute('data-test-scrolled'), 'true');
  assert.equal(document.activeElement, heading);
  assert.equal(document.getElementById('lesson-search-context'), null);
  dom.window.LessonSearchContext.destroy();
  dom.window.close();
});

test('an exact-section link opens nested details and activates its hidden tab panel', async () => {
  const dom = browserFixture('#section=lesson-section-hidden-method&search=hidden%20method&from=lesson-search');
  const { document } = dom.window;
  const main = document.getElementById('lesson-content');
  const tab = document.createElement('button');
  tab.id = 'method-tab';
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', 'method-panel');
  tab.setAttribute('aria-selected', 'false');
  tab.setAttribute('tabindex', '-1');
  tab.addEventListener('click', () => {
    document.getElementById('method-panel').hidden = false;
  });
  const tablist = document.createElement('div');
  tablist.setAttribute('role', 'tablist');
  tablist.appendChild(tab);
  main.appendChild(tablist);

  const panel = document.createElement('div');
  panel.id = 'method-panel';
  panel.hidden = true;
  panel.className = 'tab-panel';
  panel.setAttribute('role', 'tabpanel');
  panel.innerHTML = '<details><summary>More methods</summary><h2>Hidden method</h2><p>The hidden method is now readable.</p></details>';
  main.appendChild(panel);
  await waitFor(dom.window, () => panel.querySelector('h2').getAttribute('data-test-scrolled') === 'true');

  const details = panel.querySelector('details');
  const heading = panel.querySelector('h2');
  assert.equal(panel.hidden, false);
  assert.equal(panel.classList.contains('active'), true);
  assert.equal(tab.getAttribute('aria-selected'), 'true');
  assert.equal(details.open, true);
  assert.equal(document.activeElement, heading);
  assert.equal(heading.getAttribute('data-test-scrolled'), 'true');
  dom.window.LessonSearchContext.destroy();
  dom.window.close();
});

test('future widgets can reveal a search target through the event and declarative control contract', async () => {
  const dom = browserFixture('#section=lesson-section-future-panel&from=lesson-search');
  const { document } = dom.window;
  const main = document.getElementById('lesson-content');
  const control = document.createElement('button');
  control.id = 'future-panel-control';
  main.appendChild(control);
  const panel = document.createElement('section');
  panel.className = 'hidden';
  panel.style.display = 'none';
  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('data-search-reveal-control', '#future-panel-control');
  panel.innerHTML = '<h2>Future panel</h2><p>A custom widget can respond before focus moves.</p>';
  main.appendChild(panel);

  let revealEvents = 0;
  panel.addEventListener('upskill:lesson-search-reveal', event => {
    revealEvents += 1;
    assert.equal(event.detail.target, panel.querySelector('h2'));
  });
  await waitFor(dom.window, () => document.activeElement === panel.querySelector('h2'));

  assert.equal(revealEvents, 1);
  assert.equal(panel.classList.contains('hidden'), false);
  assert.notEqual(dom.window.getComputedStyle(panel).display, 'none');
  assert.equal(panel.getAttribute('aria-hidden'), 'false');
  assert.equal(document.activeElement, panel.querySelector('h2'));
  dom.window.LessonSearchContext.destroy();
  dom.window.close();
});

test('hash parsing supports both search parameters and ordinary anchors', () => {
  assert.deepEqual(context.parseHash('#section=part-2&search=gage+r%26r&from=lesson-search'), {
    section: 'part-2',
    search: 'gage r&r',
    from: 'lesson-search',
    parameterized: true
  });
  assert.deepEqual(context.parseHash('#already-authored'), {
    section: 'already-authored',
    search: '',
    from: '',
    parameterized: false
  });
});

test('lesson pages without a section hash do not keep a document-wide observer active', async () => {
  const dom = browserFixture('');
  await settle(dom.window, 20);
  const state = dom.window.__upskillLessonSearchContextState;
  assert.equal(state.observing, false);
  dom.window.document.getElementById('lesson-content').innerHTML = '<h2>Ordinary interaction update</h2>';
  await settle(dom.window, 20);
  assert.equal(state.observing, false);
  dom.window.LessonSearchContext.destroy();
  dom.window.close();
});

test('the mutation observer disconnects as soon as an asynchronous target resolves', async () => {
  const dom = browserFixture('#section=lesson-section-late-content&from=lesson-search');
  await settle(dom.window, 20);
  const state = dom.window.__upskillLessonSearchContextState;
  assert.equal(state.observing, true);

  dom.window.document.getElementById('lesson-content').innerHTML = '<h2>Late content</h2>';
  await waitFor(dom.window, () => dom.window.document.activeElement.id === 'lesson-section-late-content');
  assert.equal(state.observing, false);
  assert.equal(dom.window.document.activeElement.id, 'lesson-section-late-content');
  dom.window.LessonSearchContext.destroy();
  dom.window.close();
});
