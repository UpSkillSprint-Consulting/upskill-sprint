const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const CHI = 'lessons/statistics/chi-square-goodness-of-fit-test.html';
const BELL = 'lessons/statistics/beyond-the-bell-the-normal-distribution-and-its-relatives.html';
const DOE = 'lessons/introduction-to-design-of-experiment-doe.html';
const SEO = 'title, meta[name="description"], link[rel~="canonical"], meta[property^="og:"], meta[name^="twitter:"]';

let site;
test.before(async () => {
  site = fs.mkdtempSync(path.join(os.tmpdir(), 'js-lessons-'));
  for (const item of [CHI, BELL, DOE, 'assets/lessons/chi-square-goodness-of-fit',
    'assets/lessons/beyond-the-bell', 'assets/lessons/introduction-to-design-of-experiment-doe']) {
    fs.cpSync(item, path.join(site, item), { recursive: true });
  }
  const { renderJsLessons } = await import('../scripts/render-js-lessons.mjs');
  await renderJsLessons(site);
});
test.after(() => fs.rmSync(site, { recursive: true, force: true }));

const staged = file => fs.readFileSync(path.join(site, file), 'utf8');
// Parse only: no scripts run, as a crawler without JavaScript would see it.
const noJs = file => new JSDOM(staged(file)).window.document;
const headings = doc => Array.from(doc.querySelectorAll('h1, h2'), h => h.textContent.trim());
const once = (list, text) => assert.equal(list.filter(h => h.includes(text)).length, 1, text);

for (const [name, file, h1, keys] of [
  ['Chi-square', CHI, 'Chi-Square Goodness-of-Fit Test',
    ['Big idea', 'Should you use this test?', 'Live chi-square calculator', 'Degrees of freedom']],
  ['Beyond the Bell', BELL, 'Beyond the Bell: The Normal Distribution and Its Relatives',
    ['Learning objectives', 'Prerequisites', 'The family map in plain English']]
]) {
  test(`${name}: teaching content is in the staged HTML without JavaScript`, () => {
    const doc = noJs(file);
    const list = headings(doc);
    assert.equal(doc.querySelectorAll('h1').length, 1);
    assert.equal(doc.querySelector('h1').textContent.trim(), h1);
    for (const key of keys) once(list, key);
    assert.equal(doc.getElementById('loader'), null, 'loader shell is gone');
    assert.ok(!staged(file).includes('upskillWriteLessonDocument'), 'no document replacement remains');
    assert.ok(!staged(file).includes('lesson-payload-swap.js'));
    assert.ok(doc.body.textContent.split(/\s+/).length > 700);
    assert.equal(doc.documentElement.dataset.prerendered, 'true');
    assert.ok(staged(file).includes('<!-- UPSKILLSPRINT_LESSON_META'));
  });

  test(`${name}: the wrapper's SEO tags win, exactly once each`, () => {
    const wrapper = new JSDOM(fs.readFileSync(file, 'utf8')).window.document;
    const expected = Array.from(wrapper.head.querySelectorAll(SEO), t => t.outerHTML).sort();
    const actual = Array.from(noJs(file).head.querySelectorAll(SEO), t => t.outerHTML).sort();
    assert.deepEqual(actual, expected);
  });
}

test('DOE: content and styles are inlined, with no runtime fragment fetches', () => {
  const doc = noJs(DOE);
  const host = doc.getElementById('doeLessonContent');
  assert.equal(host.dataset.prerendered, 'true');
  assert.equal(doc.querySelectorAll('#doe-lesson-styles').length, 1);
  assert.equal(doc.getElementById('doe-lesson-app').type, 'text/plain');
  const list = headings(doc);
  assert.equal(doc.querySelectorAll('h1').length, 1);
  for (const key of ['What DOE is designed to reveal', 'Build and analyze a 2² full factorial design',
    'Plan the real experiment correctly']) once(list, key);
  assert.equal(host.querySelector('noscript'), null);
  assert.ok(host.textContent.split(/\s+/).length > 700);
});

test('DOE: loader runs the inlined app once and does not fetch or duplicate content', async () => {
  const html = staged(DOE).replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, '');
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  const w = dom.window;
  const before = w.document.getElementById('doeLessonContent').innerHTML;
  let fetches = 0;
  w.fetch = () => { fetches++; return Promise.reject(new Error('no fetch')); };
  w.document.getElementById('doe-lesson-app').textContent = 'window.__doeRuns = (window.__doeRuns || 0) + 1;';
  w.eval(fs.readFileSync('assets/lessons/introduction-to-design-of-experiment-doe/loader.js', 'utf8'));
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(w.__doeRuns, 1);
  assert.equal(fetches, 0);
  assert.equal(w.document.getElementById('doeLessonContent').innerHTML, before);
  assert.equal(w.document.querySelectorAll('#doe-lesson-styles').length, 1);
  w.close();
});

test('DOE: the source page still works without the build step', () => {
  const loader = fs.readFileSync('assets/lessons/introduction-to-design-of-experiment-doe/loader.js', 'utf8');
  assert.match(loader, /content-1\.txt/);
  assert.ok(!fs.readFileSync(DOE, 'utf8').includes('data-prerendered'));
});
