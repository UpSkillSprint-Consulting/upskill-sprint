const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const slug = 'pmp-formula-encyclopedia';
const lessonPath = `/lessons/project-management/${slug}`;
const html = fs.readFileSync(path.join(root, `${lessonPath}.html`), 'utf8');
const title = 'PMP Formula Encyclopedia';

function setup(hash) {
  const dom = new JSDOM(html, { url: `https://upskillsprint.com${lessonPath}${hash || ''}`, runScripts: 'outside-only' });
  const { window: w } = dom;
  for (const script of w.document.scripts) {
    if (!script.src && script.type !== 'application/json') w.eval(script.textContent);
  }
  return { dom, w, d: w.document };
}

test('lesson is Public, registered in Project Management, and has its access SQL', () => {
  const { dom, d } = setup();
  assert.match(html, /^<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META/);
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
  assert.equal(meta.title, title);
  assert.equal(meta.slug, slug);
  assert.equal(meta.category, 'Project Management');
  assert.equal(meta.category_slug, 'project-management');
  assert.equal(meta.level, 'Advanced');
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.search_content, 'runtime');
  assert.equal(meta.estimated_minutes, 25);
  assert.equal(meta.suggested_github_path, `lessons/project-management/${slug}.html`);
  assert.ok(new Set(meta.search_keywords).size >= 5);
  assert.ok(meta.search_keywords.every((keyword) => keyword === keyword.toLowerCase()));
  assert.equal(d.title, `${title} | UpSkill Sprint`);
  assert.ok(d.title.length <= 65);
  assert.ok(d.querySelector('meta[name="description"]').content.length <= 165);
  assert.equal(d.querySelector('link[rel="canonical"]').href, `https://upskillsprint.com${lessonPath}`);
  assert.equal(d.querySelector('meta[property="og:title"]').content, d.title);
  assert.equal(d.querySelector('meta[property="og:description"]').content, d.querySelector('meta[name="description"]').content);
  assert.equal(d.body.dataset.category, 'project-management');
  assert.equal(d.body.dataset.level, 'advanced');
  assert.equal(d.body.dataset.interactive, 'true');
  assert.equal(d.getElementById('lesson-content').getAttribute('data-lesson-search-banner'), 'off');

  const sql = fs.readFileSync(path.join(root, 'supabase/public-pmp-formula-encyclopedia-access.sql'), 'utf8');
  assert.ok(sql.includes(`'lesson:${lessonPath}', 'public', '${title}'`));
  assert.match(sql, /on conflict \(resource_key\) do update/);
  assert.doesNotMatch(sql, /\b(create|alter|drop|grant)\b/i);

  const catalog = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
  assert.equal(catalog.split("marker: 'data-pmp-formula-encyclopedia'").length, 2);
  const entry = catalog.slice(catalog.indexOf("marker: 'data-pmp-formula-encyclopedia'")).split('}')[0];
  assert.ok(entry.includes(`path: '${lessonPath}'`));
  assert.ok(entry.includes("sectionId: 'project-management'"));
  assert.ok(entry.includes("topic: 'project-management'"));
  assert.ok(entry.includes("level: 'advanced'"));
  assert.ok(entry.includes('<span>25 min</span>'));
  assert.ok(entry.includes(`title: '${title}'`));
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.ok(sitemap.includes(`https://upskillsprint.com${lessonPath}`));
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
  assert.equal(d.querySelector('#lesson-content').dataset.pmpEncyclopedia, 'true');
  assert.ok(d.querySelector('.toolbar'));
  assert.ok(d.querySelector('#sectionFilter'));
  assert.ok(d.querySelector('#familyFilter'));
  assert.equal(d.querySelectorAll('.phase-section').length, 3);
  assert.ok(!html.includes('quiz-submit'));
  assert.ok(!html.includes('Check your understanding'));
  assert.ok(!html.includes('Skip to lesson content'));
  assert.ok(!html.includes('Want to save your progress and quiz scores for this lesson?'));
  assert.equal(d.querySelector('section[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#project-management');
  const ids = Array.from(d.querySelectorAll('[id]')).map((element) => element.id);
  assert.equal(new Set(ids).size, ids.length);
  const styles = Array.from(d.querySelectorAll('style'));
  assert.equal(styles[styles.length - 1].id, 'pmp-formula-encyclopedia-dark-overrides');
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
    assert.ok(!region.textContent.includes('$'));
  }
  const declared = [...html.matchAll(/(^|\{|;)\s*(--[a-z0-9-]+)\s*:/g)].map((match) => match[2]);
  assert.ok(declared.length > 0);
  assert.ok(declared.every((name) => name.startsWith('--lesson-pmp-fe-')));
  dom.window.close();
});

test('search, domain, and family filters keep an empty scored domain visible', () => {
  const { dom, w, d } = setup();
  const visible = () => Array.from(d.querySelectorAll('[data-formula-id]')).filter((card) => !card.hidden);
  assert.equal(d.querySelectorAll('[data-formula-id]').length, 24);
  assert.equal(d.querySelector('[data-section="People"] [data-formula-id]'), null);
  assert.equal(d.querySelector('[data-section="People"]').hidden, false);
  assert.match(d.querySelector('[data-section="People"]').textContent, /does not print a governing calculation|Neither the 6th nor the 8th edition prints a governing calculation/);
  w.filterPmpFormulas('cpi');
  assert.ok(visible().length >= 1);
  assert.ok(visible().every((card) => card.dataset.haystack.includes('cpi')));
  assert.equal(d.querySelector('[data-section="People"]').hidden, true);
  d.getElementById('sectionFilter').value = 'Process';
  d.getElementById('sectionFilter').dispatchEvent(new w.Event('change'));
  assert.ok(visible().every((card) => card.closest('[data-section]').dataset.section === 'Process'));
  d.getElementById('resetBtn').click();
  assert.equal(visible().length, 24);
  assert.equal(d.querySelector('[data-section="People"]').hidden, false);
  d.getElementById('familyFilter').value = 'Forecasting';
  d.getElementById('familyFilter').dispatchEvent(new w.Event('change'));
  assert.ok(visible().length > 0);
  assert.ok(visible().every((card) => card.querySelector('.card-family').textContent === 'Forecasting'));
  assert.equal(d.querySelector('[data-section="People"]').hidden, true);
  d.getElementById('sectionFilter').value = 'People';
  d.getElementById('familyFilter').value = '';
  d.getElementById('sectionFilter').dispatchEvent(new w.Event('change'));
  assert.equal(visible().length, 0);
  assert.equal(d.querySelector('[data-section="People"]').hidden, false);
  assert.equal(d.getElementById('formula-empty').hidden, true);
  d.getElementById('expandBtn').click();
  assert.ok(Array.from(d.querySelectorAll('details')).every((details) => details.open));
  assert.match(d.querySelector('[data-formula-id="PMP-CPI"] .formula-box').textContent, /\\frac\{EV\}\{AC\}/);
  assert.match(d.querySelector('[data-formula-id="PMP-EAC-BOTH"] .formula-box').textContent, /CPI\\times SPI/);
  assert.match(d.querySelector('[data-formula-id="PMP-BETA"] .formula-box').textContent, /4c_M/);
  assert.equal(d.querySelector('[data-formula-id="PMP-EMV"] .card-family').textContent, 'Risk');
  assert.match(d.querySelector('[data-formula-id="PMP-SIGMA"] .formula-box').textContent, /\\frac\{P-O\}\{6\}/);
  assert.equal(d.querySelector('[data-formula-id="PMP-SIGMA"] .card-family').textContent, 'Estimating');
  assert.match(d.querySelector('[data-formula-id="PMP-TF"] .formula-box').textContent, /LS-ES=LF-EF/);
  assert.match(d.querySelector('[data-formula-id="PMP-FF"] .formula-box').textContent, /ES_\{\\text\{successor\}\}-EF/);
  assert.match(d.querySelector('[data-formula-id="PMP-CH"] .formula-box').textContent, /n\(n-1\)/);
  assert.match(d.querySelector('[data-formula-id="PMP-NPV"] .formula-box').textContent, /CF_t/);
  assert.equal(d.querySelector('[data-formula-id="PMP-NPV"]').closest('[data-section]').dataset.section, 'Business Environment');
  assert.match(d.querySelector('[data-formula-id="PMP-ROI"] .formula-box').textContent, /benefit/);
  assert.match(d.querySelector('[data-formula-id="PMP-IRR"] .formula-box').textContent, /IRR/);
  assert.match(d.querySelector('[data-formula-id="PMP-PBP"] .formula-box').textContent, /Payback/);
  assert.match(d.querySelector('[data-formula-id="PMP-BCR"] .formula-box').textContent, /benefits/);
  for (const id of ['PMP-SIGMA', 'PMP-TF', 'PMP-FF', 'PMP-CH', 'PMP-NPV', 'PMP-ROI', 'PMP-IRR', 'PMP-PBP', 'PMP-BCR']) {
    assert.equal(d.querySelector(`[data-formula-id="${id}"] .tag`).textContent, 'Exam algebra');
  }
  assert.equal(d.querySelector('[data-formula-id="PMP-CPI"] .tag').textContent, 'Guide display');
  for (const id of ['PMP-PV', 'PMP-EV', 'PMP-AC', 'PMP-BAC']) {
    assert.equal(d.querySelector(`[data-formula-id="${id}"]`), null);
  }
  assert.match(html, /NPV, ROI, IRR, payback, and BCR are cards/);
  assert.doesNotMatch(html, /are not cards/);
  dom.window.close();
});

test('a section deep link and a formula hash each open one card', () => {
  const linked = setup('#section=formula-title-pmp-cpi&search=cpi&from=lesson-search');
  const visible = () => Array.from(linked.d.querySelectorAll('[data-formula-id]')).filter((card) => !card.hidden);
  const cpi = linked.d.getElementById('formula-title-pmp-cpi').closest('[data-formula-id]');
  assert.equal(cpi.hidden, false);
  assert.equal(linked.d.getElementById('searchInput').value, 'cpi');
  assert.ok(visible().every((card) => card.dataset.haystack.includes('cpi')));
  linked.dom.window.close();

  const forced = setup('#section=formula-title-pmp-emv&search=not-a-real-phrase&from=lesson-search');
  const emv = forced.d.getElementById('formula-title-pmp-emv').closest('[data-formula-id]');
  assert.equal(emv.hidden, false);
  assert.equal(forced.d.getElementById('searchInput').value, '');
  assert.equal(forced.d.querySelectorAll('[data-formula-id]:not([hidden])').length, 24);
  forced.dom.window.close();

  const hashed = setup('#formula=PMP-TCPI-BAC');
  const only = Array.from(hashed.d.querySelectorAll('[data-formula-id]')).filter((card) => !card.hidden);
  assert.equal(only.length, 1);
  assert.equal(only[0].dataset.formulaId, 'PMP-TCPI-BAC');
  hashed.d.getElementById('searchInput').value = 'forecast';
  hashed.d.getElementById('searchInput').dispatchEvent(new hashed.w.Event('input'));
  assert.ok(Array.from(hashed.d.querySelectorAll('[data-formula-id]')).filter((card) => !card.hidden).length > 1);
  hashed.dom.window.close();
});
