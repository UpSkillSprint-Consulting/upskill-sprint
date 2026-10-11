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

test('canonical chrome and encyclopedia structure follow the lesson guide, with no quiz', () => {
  const { dom, d } = setup();
  const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
  for (const section of ['### 4.1 Header', '### 4.2 Footer']) {
    const block = guide.slice(guide.indexOf(section)).match(/```html\n([\s\S]*?)\n```/)[1];
    assert.ok(html.includes(block), `must use exact ${section}`);
  }
  for (const tag of ['<link rel="stylesheet" href="/style.css">', '<link rel="stylesheet" href="/lessons-theme.css">', '<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>', '<script defer src="/assets/js/math.js"></script>']) {
    assert.ok(html.includes(tag));
  }
  assert.equal(d.querySelectorAll('main').length, 1);
  assert.equal(d.querySelectorAll('h1').length, 1);
  assert.equal(d.querySelector('main#lesson-content h1').textContent, title);
  assert.equal(d.querySelector('#lesson-content').dataset.creEncyclopedia, 'true');
  assert.ok(d.querySelector('.toolbar'));
  assert.ok(d.querySelector('#sectionFilter'));
  assert.ok(d.querySelector('#familyFilter'));
  assert.equal(d.querySelectorAll('.phase-section').length, 5);
  assert.ok(!html.includes('quiz-submit'));
  assert.ok(!html.includes('Check your understanding'));
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
  assert.equal(d.getElementById('searchInput').getAttribute('aria-label'), 'Search formulas');
  for (const region of d.querySelectorAll('.formula-box')) {
    assert.equal(region.getAttribute('tabindex'), '0');
    assert.equal(region.getAttribute('role'), 'region');
    assert.ok(region.getAttribute('aria-label'));
  }
  const declared = [...html.matchAll(/(^|\{|;)\s*(--[a-z0-9-]+)\s*:/g)].map((match) => match[2]);
  assert.ok(declared.length > 0);
  assert.ok(declared.every((name) => name.startsWith('--lesson-cre-fe-')));
  dom.window.close();
});

test('search, section, and family filters work like the formula encyclopedia', () => {
  const { dom, w, d } = setup('#search=arrhenius&from=lesson-search');
  const visible = () => Array.from(d.querySelectorAll('[data-formula-id]')).filter((card) => !card.hidden);
  assert.ok(d.querySelectorAll('[data-formula-id]').length >= 60);
  assert.equal(d.getElementById('searchInput').value, 'arrhenius');
  assert.ok(visible().length >= 3);
  assert.ok(visible().every((card) => card.dataset.haystack.includes('arrhenius')));
  assert.equal(d.querySelector('[data-section="II. Risk Management"] [data-formula-id]'), null);
  assert.match(d.querySelector('[data-section="II. Risk Management"]').textContent, /does not assign equation numbers/);
  w.filterCreFormulas('series-system');
  assert.equal(visible().length, 1);
  assert.equal(visible()[0].dataset.formulaId, 'CRE-10.1');
  assert.match(visible()[0].querySelector('.formula-box').textContent, /\\prod/);
  assert.match(d.querySelector('[data-formula-id="CRE-2.14"] .formula-box').textContent, /e\^\{-\\lambda t\}/);
  d.getElementById('sectionFilter').value = 'I. Reliability Fundamentals';
  d.getElementById('sectionFilter').dispatchEvent(new w.Event('change'));
  assert.equal(visible().length, 0);
  d.getElementById('resetBtn').click();
  assert.equal(visible().length, d.querySelectorAll('[data-formula-id]').length);
  d.getElementById('familyFilter').value = 'Probability';
  d.getElementById('familyFilter').dispatchEvent(new w.Event('change'));
  assert.ok(visible().length > 0);
  assert.ok(visible().every((card) => card.querySelector('.card-family').textContent === 'Probability'));
  d.getElementById('expandBtn').click();
  assert.ok(Array.from(d.querySelectorAll('details')).every((details) => details.open));
  const weibull = d.querySelector('[data-formula-id="CRE-WEI"] .formula-box').textContent;
  assert.match(weibull, /\\eta/);
  assert.match(weibull, /\\Gamma/);
  assert.match(d.querySelector('[data-formula-id="CRE-BIN"] .formula-box').textContent, /\\binom\{n\}\{x\}/);
  assert.match(d.querySelector('[data-formula-id="CRE-HUM"] .formula-box').textContent, /\\exp\\left\[-\\int/);
  assert.match(d.querySelector('[data-formula-id="CRE-LOGN"] .formula-box').textContent, /x\\sqrt\{2\\pi\\sigma\^\{2\}\}/);
  assert.equal(d.querySelector('[data-formula-id="CRE-10.11"] .card-title').textContent, 'Reliability, proportional hazards model');
  dom.window.close();
});

test('handbook gaps stay on the card and lesson search can open one formula', () => {
  const { dom, d } = setup();
  assert.match(d.querySelector('#scope-heading').nextElementSibling.textContent, /governing displays that have no equation number/);
  assert.match(d.querySelector('[data-formula-id="CRE-6.7"] .formula-box').textContent, /s_\{b_1\}/);
  assert.match(d.querySelector('[data-formula-id="CRE-6.7"] .formula-box').textContent, /SSE/);
  assert.match(d.querySelector('[data-formula-id="CRE-6.7"] .card-body').textContent, /two-sided critical value/);
  assert.match(d.querySelector('[data-formula-id="CRE-6.10"] .trap').textContent, /union symbol on both sides/);
  assert.match(d.querySelector('[data-formula-id="CRE-EXPM"] .formula-box').textContent, /\\nu=2r\+2/);
  assert.match(d.querySelector('[data-formula-id="CRE-EXPM"] .formula-box').textContent, /\\nu=2r/);
  assert.match(d.querySelector('[data-formula-id="CRE-WEI"] .formula-box').textContent, /\\mathrm\{SD\}\(X\)/);
  assert.match(d.querySelector('[data-formula-id="CRE-SSEX"] .trap').textContent, /one minus this reliability/);
  assert.match(d.querySelector('[data-formula-id="CRE-CRO"] .formula-box').textContent, /Z_\{t\+1\}\}\{P_\{t\+1\}/);
  assert.match(d.querySelector('[data-formula-id="CRE-CRO"] .card-body').textContent, /16\.62/);
  assert.match(d.querySelector('[data-formula-id="CRE-CRO"] .trap').textContent, /Z sub t over P sub t/);
  assert.match(d.querySelector('[data-formula-id="CRE-CP"] .formula-box').textContent, /\\hat\{P\}_p/);
  assert.match(d.querySelector('[data-formula-id="CRE-CP"] .formula-box').textContent, /1\.128/);
  assert.match(d.querySelector('[data-formula-id="CRE-CPK"] .card-title').textContent, /Ppk/);
  assert.match(d.querySelector('[data-formula-id="CRE-MCI"] .formula-box').textContent, /\\sqrt\{\\frac\{\\hat\{\\sigma\}\^\{2\}\}\{n\}\}/);
  assert.match(d.querySelector('[data-formula-id="CRE-PCI"] .formula-box').textContent, /z_\{\\alpha\/2\}/);
  assert.match(d.querySelector('[data-formula-id="CRE-NPROP"] .formula-box').textContent, /\\frac\{1\}\{4\}/);
  assert.match(d.querySelector('[data-formula-id="CRE-ZP"] .formula-box').textContent, /n\+2/);
  assert.equal(d.querySelector('[data-formula-id="CRE-GROW"] .card-family').textContent, 'System and life models');
  assert.equal(d.querySelector('[data-formula-id="CRE-W0"] .card-family').textContent, 'Design and demonstration');
  dom.window.close();

  const linked = setup('#section=formula-title-cre-km&search=kaplan-meier&from=lesson-search');
  const visible = () => Array.from(linked.d.querySelectorAll('[data-formula-id]')).filter((card) => !card.hidden);
  const kaplan = linked.d.getElementById('formula-title-cre-km').closest('[data-formula-id]');
  assert.equal(kaplan.hidden, false);
  assert.equal(linked.d.getElementById('searchInput').value, 'kaplan-meier');
  assert.ok(visible().every((card) => card.dataset.haystack.includes('kaplan-meier')));
  linked.dom.window.close();

  const forced = setup('#section=formula-title-cre-6-10&search=not-a-real-phrase&from=lesson-search');
  const addition = forced.d.getElementById('formula-title-cre-6-10').closest('[data-formula-id]');
  assert.equal(addition.hidden, false);
  assert.equal(forced.d.getElementById('searchInput').value, '');
  assert.equal(forced.d.querySelectorAll('[data-formula-id]:not([hidden])').length, 125);
  forced.dom.window.close();
});

test('a formula hash opens that card without also opening numbered neighbors', () => {
  const { dom, w, d } = setup('#formula=CRE-10.1');
  const visible = () => Array.from(d.querySelectorAll('[data-formula-id]')).filter((card) => !card.hidden);
  assert.equal(visible().length, 1);
  assert.equal(visible()[0].dataset.formulaId, 'CRE-10.1');
  d.getElementById('searchInput').value = 'parallel';
  d.getElementById('searchInput').dispatchEvent(new w.Event('input'));
  assert.ok(visible().length > 1);
  dom.window.close();
});
