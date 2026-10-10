const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const slug = 'cre-formula-encyclopedia';
const lessonPath = `/lessons/quality-engineering/${slug}`;
const html = fs.readFileSync(path.join(root, `${lessonPath}.html`), 'utf8');
const title = 'Reliability Formula Encyclopedia';

function setup(hash) {
  const dom = new JSDOM(html, { url: `https://upskillsprint.com${lessonPath}${hash || ''}`, runScripts: 'outside-only' });
  const { window: w } = dom;
  for (const script of w.document.scripts) {
    if (!script.src && script.type !== 'application/json') w.eval(script.textContent);
  }
  return { dom, w, d: w.document };
}

test('lesson is Public, registered in Quality Engineering, and has its access SQL', () => {
  const { dom, d } = setup();
  assert.match(html, /^<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META/);
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
  assert.equal(meta.title, title);
  assert.equal(meta.slug, slug);
  assert.equal(meta.category, 'Quality Engineering');
  assert.equal(meta.category_slug, 'quality-engineering');
  assert.equal(meta.level, 'Advanced');
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.estimated_minutes, 35);
  assert.equal(meta.suggested_github_path, `lessons/quality-engineering/${slug}.html`);
  assert.ok(new Set(meta.search_keywords).size >= 5);
  assert.ok(meta.search_keywords.every((keyword) => keyword === keyword.toLowerCase()));
  assert.equal(d.title, `${title} | UpSkill Sprint`);
  assert.ok(d.title.length <= 65);
  assert.ok(d.querySelector('meta[name="description"]').content.length <= 165);
  assert.equal(d.querySelector('link[rel="canonical"]').href, `https://upskillsprint.com${lessonPath}`);
  assert.equal(d.querySelector('meta[property="og:title"]').content, d.title);
  assert.equal(d.querySelector('meta[property="og:description"]').content, d.querySelector('meta[name="description"]').content);
  assert.equal(d.body.dataset.category, 'quality-engineering');
  assert.equal(d.body.dataset.level, 'advanced');
  assert.equal(d.body.dataset.interactive, 'true');
  assert.equal(d.body.hasAttribute('data-require-auth'), false);

  const sql = fs.readFileSync(path.join(root, 'supabase/public-cre-formula-encyclopedia-access.sql'), 'utf8');
  assert.ok(sql.includes(`'lesson:${lessonPath}', 'public', '${title}'`));
  assert.match(sql, /on conflict \(resource_key\) do update/);
  assert.doesNotMatch(sql, /\b(create|alter|drop|grant)\b/i);

  const catalog = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
  assert.equal(catalog.split("marker: 'data-cre-formula-encyclopedia'").length, 2);
  const entry = catalog.slice(catalog.indexOf("marker: 'data-cre-formula-encyclopedia'")).split('}')[0];
  assert.ok(entry.includes(`path: '${lessonPath}'`));
  assert.ok(entry.includes("sectionId: 'quality-engineering'"));
  assert.ok(entry.includes("topic: 'quality-engineering'"));
  assert.ok(entry.includes("level: 'advanced'"));
  assert.ok(entry.includes('<span>35 min</span>'));
  assert.ok(entry.includes(`title: '${title}'`));
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  dom.window.close();
});

test('canonical chrome, quiz blocks and page structure follow the lesson guide', () => {
  const { dom, d } = setup();
  const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
  for (const section of ['### 4.1 Header', '### 4.2 Footer', '### 7.1 Quiz styles', '### 7.3 Quiz grader']) {
    const block = guide.slice(guide.indexOf(section)).match(/```html\n([\s\S]*?)\n```/)[1];
    assert.ok(html.includes(block), `must use exact ${section}`);
  }
  for (const tag of ['<link rel="stylesheet" href="/style.css">', '<link rel="stylesheet" href="/lessons-theme.css">', '<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>', '<script defer src="/assets/js/math.js"></script>']) {
    assert.ok(html.includes(tag));
  }
  assert.equal(d.querySelectorAll('main').length, 1);
  assert.equal(d.querySelectorAll('h1').length, 1);
  assert.equal(d.querySelector('main#lesson-content h1').textContent, title);
  assert.ok(!html.includes('Skip to lesson content'));
  assert.ok(!html.includes('Want to save your progress and quiz scores for this lesson?'));
  assert.equal(d.querySelector('section[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#quality-engineering');
  const ids = Array.from(d.querySelectorAll('[id]')).map((element) => element.id);
  assert.equal(new Set(ids).size, ids.length);
  const styles = Array.from(d.querySelectorAll('style'));
  assert.equal(styles[styles.length - 1].id, 'cre-formula-encyclopedia-dark-overrides');
  let node = d.querySelector('footer.site').nextElementSibling;
  while (node) { assert.ok(['SCRIPT', 'STYLE'].includes(node.tagName)); node = node.nextElementSibling; }
  let previous = 1;
  for (const heading of d.querySelectorAll('#lesson-content h1, #lesson-content h2, #lesson-content h3')) {
    const level = Number(heading.tagName[1]);
    assert.ok(level <= previous + 1, heading.textContent);
    previous = level;
  }
  const search = d.getElementById('formula-search');
  assert.ok(d.querySelector('label[for="formula-search"]'));
  for (const region of d.querySelectorAll('.cre-eq')) {
    assert.equal(region.getAttribute('tabindex'), '0');
    assert.equal(region.getAttribute('role'), 'region');
    assert.ok(region.getAttribute('aria-label'));
  }
  const declared = [...html.matchAll(/(^|\{|;)\s*(--[a-z0-9-]+)\s*:/g)].map((match) => match[2]);
  assert.ok(declared.length > 0);
  assert.ok(declared.every((name) => name.startsWith('--lesson-cre-fe-')));
  dom.window.close();
});

test('search filters the numbered handbook formulas and the quiz reports a score', () => {
  const { dom, w, d } = setup('#search=arrhenius');
  const visible = () => Array.from(d.querySelectorAll('[data-formula]')).filter((card) => !card.hidden);
  assert.ok(d.querySelectorAll('[data-formula]').length >= 60);
  assert.ok(visible().length >= 3);
  assert.ok(visible().every((card) => card.dataset.haystack.includes('arrhenius')));
  assert.equal(d.querySelector('[data-section="II. Risk Management"] [data-formula]'), null);
  assert.match(d.querySelector('[data-section="II. Risk Management"]').textContent, /does not assign equation numbers/);
  w.filterCreFormulas('series-system');
  assert.equal(visible().length, 1);
  assert.equal(visible()[0].dataset.formula, 'CRE-10.1');
  const series = d.querySelector('[data-formula="CRE-10.1"] .cre-eq').textContent;
  assert.match(series, /\\prod/);
  assert.match(d.querySelector('[data-formula="CRE-2.14"] .cre-eq').textContent, /e\^\{-\\lambda t\}/);

  const events = [];
  d.addEventListener('upskill-quiz-result', (event) => events.push(event.detail));
  d.getElementById('quiz-submit').click();
  assert.equal(events[0].score, 0);
  assert.equal(events[0].total, 4);
  for (const [name, value] of [['q1', 'b'], ['q2', 'a'], ['q3', 'c'], ['q4', 'b']]) {
    d.querySelector(`input[name="${name}"][value="${value}"]`).checked = true;
  }
  d.getElementById('quiz-submit').click();
  assert.equal(events[1].score, 4);
  dom.window.close();
});
