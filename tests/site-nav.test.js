'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const navApi = require(path.join(ROOT, 'site-nav.js'));

const TAB_LABELS = ['Start Here', 'Lessons', 'Exam Practice', 'Engineering Tools', 'Services', 'About'];
const TAB_HREFS = ['/start-here', '/lessons', '/exam-practice', '/engineering-tools', '/services', '/about'];

function pageDom(file, url) {
  const dom = new JSDOM(read(file), { url, pretendToBeVisual: true, runScripts: 'outside-only' });
  dom.window.eval(read('site-nav.js'));
  return dom;
}

function fileFor(urlPath) {
  const clean = urlPath.split('#')[0].replace(/\/$/, '');
  if (!clean) return 'index.html';
  const rel = clean.replace(/^\//, '');
  for (const candidate of [rel + '.html', rel + '/index.html', rel]) {
    if (fs.existsSync(path.join(ROOT, candidate))) return candidate;
  }
  if (rel.startsWith('engineering-tools/grade-specification-lookup')) return 'scripts/build-grade-specification-lookup.mjs';
  return null;
}

test('six primary tabs render with directory links and closed chevrons', () => {
  const dom = pageDom('index.html', 'https://upskillsprint.com/');
  const doc = dom.window.document;
  const links = [...doc.querySelectorAll('nav.desktop-nav .nav-tab-link')];
  assert.deepEqual(links.map((link) => link.textContent.trim()), TAB_LABELS);
  assert.deepEqual(links.map((link) => link.getAttribute('href')), TAB_HREFS);
  const buttons = [...doc.querySelectorAll('nav.desktop-nav .nav-chevron')];
  assert.equal(buttons.length, 6);
  buttons.forEach((button) => {
    assert.equal(button.getAttribute('aria-expanded'), 'false');
    assert.ok(button.getAttribute('aria-controls'));
    assert.equal(doc.getElementById(button.getAttribute('aria-controls')).hidden, true);
  });
  assert.equal(doc.querySelector('nav.desktop-nav').getAttribute('aria-label'), 'Main');
  dom.window.close();
});

test('a chevron opens its panel, closes the other panel, and Escape returns focus', () => {
  const dom = pageDom('lessons.html', 'https://upskillsprint.com/lessons');
  const doc = dom.window.document;
  const buttons = [...doc.querySelectorAll('nav.desktop-nav .nav-chevron')];
  const lessons = buttons[1];
  const exam = buttons[2];
  lessons.click();
  assert.equal(lessons.getAttribute('aria-expanded'), 'true');
  assert.equal(doc.getElementById(lessons.getAttribute('aria-controls')).hidden, false);
  exam.click();
  assert.equal(lessons.getAttribute('aria-expanded'), 'false');
  assert.equal(doc.getElementById(lessons.getAttribute('aria-controls')).hidden, true);
  assert.equal(exam.getAttribute('aria-expanded'), 'true');
  doc.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(exam.getAttribute('aria-expanded'), 'false');
  assert.equal(doc.getElementById(exam.getAttribute('aria-controls')).hidden, true);
  assert.equal(doc.activeElement, exam);
  exam.click();
  doc.body.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  assert.equal(exam.getAttribute('aria-expanded'), 'false');
  dom.window.close();
});

test('every dropdown href points at a real page and every anchor exists', () => {
  const seen = new Set();
  for (const href of navApi.hrefs()) {
    if (seen.has(href) || href.startsWith('mailto:')) continue;
    seen.add(href);
    const [urlPath, hash] = href.split('#');
    const file = fileFor(urlPath);
    assert.ok(file, `missing page for ${href}`);
    if (!hash || !file.endsWith('.html')) continue;
    const html = read(file);
    assert.match(html, new RegExp(`id=["']${hash}["']`), `${href} anchor missing in ${file}`);
  }
});

test('lesson menu counts follow the rendered catalog, including Soon for empty topics', () => {
  const dom = new JSDOM(read('lessons.html'), {
    url: 'https://upskillsprint.com/lessons',
    pretendToBeVisual: true,
    runScripts: 'outside-only'
  });
  dom.window.eval(read('chi-square-lesson-library.js'));
  dom.window.eval(read('site-nav.js'));
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  const doc = dom.window.document;
  assert.equal(doc.documentElement.getAttribute('data-lesson-catalog-ready'), 'true');
  let total = 0;
  for (const section of doc.querySelectorAll('.lesson-category[id]')) {
    const count = section.querySelectorAll('[data-lesson-item]').length;
    total += count;
    const shown = doc.querySelector(`nav.desktop-nav [data-nav-count="${section.id}"]`);
    assert.ok(shown, section.id);
    const soon = shown.parentElement.querySelector('[data-nav-soon]');
    if (count === 0) {
      assert.equal(shown.hidden, true, section.id);
      assert.equal(soon.hidden, false, section.id);
    } else {
      assert.equal(shown.hidden, false, section.id);
      assert.equal(shown.textContent, String(count), section.id);
      assert.equal(soon.hidden, true, section.id);
    }
  }
  assert.equal(doc.querySelector('nav.desktop-nav [data-nav-total]').textContent, `${total} lessons`);
  assert.equal(doc.querySelector('nav.desktop-nav [data-nav-total-link]').textContent, `View all ${total} lessons →`);
  dom.window.close();
});

test('mobile menu: a tap does not move focus (no stray focus ring), the keyboard still does', () => {
  const open = (dom, inputEvent) => {
    const { window } = dom;
    const doc = window.document;
    const check = doc.querySelector('input.mnav-check');
    doc.body.dispatchEvent(new window.Event(inputEvent, { bubbles: true }));
    check.checked = true;
    check.dispatchEvent(new window.Event('change', { bubbles: true }));
    return doc;
  };
  const tapped = pageDom('index.html', 'https://upskillsprint.com/');
  const tapDoc = open(tapped, 'pointerdown');
  assert(tapDoc.body.classList.contains('nav-drawer-open'));
  assert(!tapDoc.activeElement.classList.contains('nav-acc-btn'), 'a tap must not focus the first menu item');
  tapped.window.close();

  const keyed = pageDom('index.html', 'https://upskillsprint.com/');
  const keyDoc = open(keyed, 'keydown');
  assert(keyDoc.activeElement.classList.contains('nav-acc-btn'), 'keyboard users land on the first menu item');
  keyed.window.close();
});

test('mobile menu: the header is pinned while the drawer is open, so the close button never scrolls away', () => {
  const css = read('site-nav.css');
  const rule = css.match(/body\.nav-drawer-open header\.site,\s*body:has\(\.mnav-check:checked\) header\.site\s*\{([^}]*)\}/);
  assert(rule, 'open-drawer header rule');
  const body = rule[1].replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(body, /position:\s*fixed/);
  assert.match(body, /top:\s*0/);
  assert.match(body, /z-index:\s*50/);
  // The drawer's own scrolling must not chain into the page behind it.
  assert.match(css, /nav\.mobile-nav\[data-nav-root="mobile"\]\s*\{[^}]*overscroll-behavior:\s*contain/);
});

test('mobile menu: section cards keep a clean name, a description, a library icon and a derived count', () => {
  const dom = pageDom('index.html', 'https://upskillsprint.com/');
  const doc = dom.window.document;
  const sprite = read('assets/nav-icons.svg');
  const cards = [...doc.querySelectorAll('nav.mobile-nav .nav-acc')];
  assert.equal(cards.length, navApi.tabs.length);
  cards.forEach((card, i) => {
    const tab = navApi.tabs[i];
    const button = card.querySelector('.nav-acc-btn');
    // The button text is only the label, so its accessible name stays short and
    // other code that reads tab labels keeps working.
    assert.equal(button.textContent.trim(), TAB_LABELS[i]);
    const sub = doc.getElementById(button.getAttribute('aria-describedby'));
    assert.ok(sub && sub.textContent.trim(), `${tab.id} subtitle`);
    const use = card.querySelector('.nav-badge use');
    const id = use.getAttribute('href').split('#')[1];
    assert.equal(use.getAttribute('href'), `/assets/nav-icons.svg#${id}`);
    assert.match(sprite, new RegExp(`<symbol id="${id}" viewBox="0 0 24 24">`), `${id} symbol`);
    assert.equal(card.querySelector('.nav-badge').getAttribute('aria-hidden'), 'true');
    const meta = card.querySelector('.nav-acc-meta');
    if (tab.unit) {
      const n = tab.items.filter((item) => (tab.id === 'exam' ? item[2] : item[1])).length;
      assert.equal(meta.textContent, `${n} ${n === 1 ? tab.unit[0] : tab.unit[1]}`);
    } else {
      assert.equal(meta, null);
    }
  });
  // Sprite icons carry no baked-in colours (guide §13.1): CSS sets currentColor.
  assert.doesNotMatch(sprite, /class="st\d"|<style|fill="#/);
  dom.window.close();
});

test('mobile menu: the poster replaces the old bottom bar and Account is not duplicated', () => {
  const dom = pageDom('index.html', 'https://upskillsprint.com/');
  const doc = dom.window.document;
  const nav = doc.querySelector('nav.mobile-nav');
  assert.equal(nav.querySelector('.nav-drawer-footer'), null);
  assert.equal(nav.querySelector('a[href="/sign-in"]'), null, 'Account lives in the header, not twice');
  const poster = nav.querySelector('.nav-poster');
  assert.ok(poster);
  assert.equal(poster, nav.lastElementChild);
  assert.ok(poster.hasAttribute('data-contrast-ignore'), 'white-on-gradient text must not be repainted');
  assert.equal(poster.querySelectorAll('.nav-poster-steps li').length, 3);
  const cta = poster.querySelector('a.nav-poster-cta');
  assert.equal(cta.getAttribute('href'), '/lessons');
  // Following the poster link closes the drawer like any other menu link.
  const check = doc.querySelector('input.mnav-check');
  check.checked = true;
  check.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  cta.addEventListener('click', (event) => event.preventDefault());
  cta.click();
  assert.equal(check.checked, false);
  assert.equal(doc.body.classList.contains('nav-drawer-open'), false);
  dom.window.close();
});

test('mobile menu: the Lessons card count becomes the live lesson total once the catalog renders', () => {
  const dom = new JSDOM(read('lessons.html'), {
    url: 'https://upskillsprint.com/lessons',
    pretendToBeVisual: true,
    runScripts: 'outside-only'
  });
  const meta = () => dom.window.document.querySelector('nav.mobile-nav [data-nav-total-meta]');
  assert.equal(meta().textContent, '8 topics');
  dom.window.eval(read('chi-square-lesson-library.js'));
  dom.window.eval(read('site-nav.js'));
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  const total = dom.window.document.querySelectorAll('.lesson-category[id] [data-lesson-item]').length;
  assert.ok(total > 0);
  assert.equal(meta().textContent, `${total} lessons`);
  dom.window.close();
});

test('mobile menu: every page carries the current stamped markup (run scripts/sync-site-nav.mjs after menu edits)', () => {
  const fallback = read('site-sections.js').match(/var USS_NAV_FALLBACK = (\{[\s\S]*?\});\n/);
  assert.ok(fallback);
  assert.equal(JSON.parse(fallback[1]).mobile, navApi.markup('mobile', ''));
  for (const file of ['index.html', 'lessons.html', 'about.html', 'lessons/statistics/understanding-dot-notation.html']) {
    const html = read(file);
    const inner = html.match(/<nav[^>]*data-nav-root="mobile"[^>]*>([\s\S]*?)<\/nav>/);
    assert.ok(inner, file);
    assert.ok(inner[1].includes('class="nav-poster"'), `${file} is stamped with the card menu`);
    assert.ok(!inner[1].includes('nav-drawer-footer'), `${file} has no stale bottom bar`);
  }
});
