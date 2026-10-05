const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const slug = 'introduction-to-symmetry-variability-and-multi-vari-charts-in-minitab';
const lessonPath = `/lessons/power-bi-excel-sql/${slug}`;
const html = fs.readFileSync(path.join(root, `${lessonPath}.html`), 'utf8');
const assets = path.join(root, 'assets/lessons', slug);
const title = 'Introduction to Symmetry Plot, Variability Chart and Multi-Vari Chart in Minitab';
function setup() {
  const dom = new JSDOM(html, {url: `https://upskillsprint.com${lessonPath}`, runScripts: 'outside-only'});
  const {window: w} = dom;
  for (const script of w.document.scripts) {
    if (!script.src && script.type !== 'application/json') w.eval(script.textContent);
  }
  return {dom, w, d: w.document};
}
function input(w, d, id, value, event = 'input') {
  d.getElementById(id).value = String(value);
  d.getElementById(id).dispatchEvent(new w.Event(event, {bubbles: true}));
}
function closeEnough(actual, expected) {assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} should equal ${expected}`);}

test('new lesson is explicitly Public in the requested Power BI, Excel & SQL category', () => {
  const {dom, d} = setup();
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
  assert.match(html, /^<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META/);
  assert.equal(meta.title, title);
  assert.equal(d.title, title);
  assert.equal(d.querySelector('h1').textContent, title);
  assert.equal(meta.slug, slug);
  assert.equal(meta.category, 'Power BI, Excel & SQL');
  assert.equal(meta.category_slug, 'power-bi-excel-sql');
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.lesson_type, 'General');
  assert.equal(meta.suggested_github_path, `lessons/power-bi-excel-sql/${slug}.html`);
  assert.equal(d.body.dataset.category, meta.category_slug);
  assert.equal(d.body.dataset.lessonType, 'general');
  assert.equal(d.body.hasAttribute('data-require-auth'), false);
  assert.equal(d.body.hasAttribute('data-access-resource'), false);
  assert.ok(meta.search_keywords.every(k => k === k.toLowerCase()));
  assert.ok(new Set(meta.search_keywords).size >= 5);
  const sql = fs.readFileSync(path.join(root, 'supabase/public-minitab-chart-lesson-access.sql'), 'utf8');
  assert.ok(sql.includes(`'lesson:${lessonPath}', 'public', '${title}'`));
  assert.match(sql, /on conflict \(resource_key\) do update/);
  const catalog = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
  assert.equal(catalog.split("marker: 'data-minitab-symmetry-variability-multi-vari'").length, 2);
  assert.ok(catalog.includes(`path: '${lessonPath}'`));
  assert.match(catalog, /marker: 'data-minitab-symmetry-variability-multi-vari',[\s\S]*?sectionId: 'power-bi-excel-sql'/);
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  dom.window.close();
});

test('canonical chrome is copied exactly, and the complete lesson is searchable in main', () => {
  const {dom, d} = setup();
  const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
  for (const section of ['### 4.1 Header', '### 4.2 Footer', '### 7.1 Quiz styles', '### 7.3 Quiz grader']) {
    const block = guide.slice(guide.indexOf(section)).match(/```html\n([\s\S]*?)\n```/)[1];
    assert.ok(html.includes(block), `must use exact ${section}`);
  }
  for (const tag of ['<link rel="stylesheet" href="/style.css">', '<link rel="stylesheet" href="/lessons-theme.css">', '<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>']) assert.ok(html.includes(tag));
  assert.ok(d.querySelector('main#lesson-content'));
  assert.equal(d.querySelectorAll('header.site').length, 1);
  assert.equal(d.querySelectorAll('footer.site').length, 1);
  assert.ok(!html.includes('Skip to lesson content'));
  assert.ok(!html.includes('Want to save your progress and quiz scores for this lesson?'));
  assert.equal(d.querySelector('section[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#power-bi-excel-sql');
  for (const id of ['chart-choice', 'practice-data', 'symmetry', 'variability', 'multi-vari', 'guided-practice', 'implementation', 'quiz', 'next-steps']) assert.ok(d.querySelector(`#lesson-content #${id}`));
  const ids = Array.from(d.querySelectorAll('[id]')).map(e => e.id);
  assert.equal(new Set(ids).size, ids.length, 'all IDs must be unique, including live SVG titles');
  for (const link of d.querySelectorAll('.mc-toc a')) assert.ok(d.querySelector(link.getAttribute('href')));
  dom.window.close();
});

test('all four supplied Minitab outputs and their explanations are collapsed initially', () => {
  const {dom, d} = setup();
  const details = [...d.querySelectorAll('details.mc-output')];
  assert.equal(details.length, 4);
  for (const output of details) {
    assert.equal(output.open, false);
    assert.equal(output.querySelector('summary').textContent.trim(), 'Review Minitab output');
    const img = output.querySelector('img');
    assert.ok(img.alt.length > 50);
    assert.ok(output.querySelector('h3[id]'));
    assert.ok(output.querySelectorAll('li').length >= 4);
    assert.ok(fs.statSync(path.join(root, img.getAttribute('src'))).size > 1000);
    output.open = true;
    assert.ok(output.open);
    output.open = false;
  }
  assert.equal(d.querySelector('#variability-output img').width, 1536);
  assert.match(d.querySelector('#variability-output').textContent, /optional SD chart is not shown/i);
  dom.window.close();
});

test('downloaded CSVs, embedded teaching values, and sampling design agree', () => {
  const {dom, d} = setup();
  const data = JSON.parse(d.querySelector('#mc-practice-data').textContent);
  const symmetry = fs.readFileSync(path.join(assets, 'Symmetry_Data.csv'), 'utf8').trim().split('\n').slice(1).map(row => row.split(',').map(Number));
  const factor = fs.readFileSync(path.join(assets, 'Factor_Data.csv'), 'utf8').trim().split('\n').slice(1).map(row => {const r=row.split(','); r[4]=Number(r[4]);return r;});
  assert.deepEqual(symmetry, data.symmetryRows);
  assert.deepEqual(factor, data.factorRows);
  assert.equal(symmetry.length, 30);
  assert.equal(factor.length, 60);
  assert.equal(new Set(factor.map(r => r[0])).size, 60);
  const counts = {};
  factor.forEach(r => {const key=r.slice(1,4).join('/');counts[key]=(counts[key]||0)+1;});
  assert.equal(Object.keys(counts).length, 12);
  assert.ok(Object.values(counts).every(n => n === 5));
  closeEnough(factor.reduce((s,r)=>s+r[4],0)/60, 9.5875);
  assert.ok(d.querySelector('#sampling-design').nextElementSibling.textContent.includes('independent datasets'));
  const workbook = fs.readFileSync(path.join(assets, 'minitab-chart-practice.xlsx'));
  assert.equal(workbook.subarray(0,2).toString(), 'PK');
  for (const file of ['minitab-chart-practice.xlsx','Symmetry_Data.csv','Factor_Data.csv']) assert.ok(d.querySelector(`a[download][href$="/${file}"]`));
  dom.window.close();
});

test('symmetry activity correctly orients both skew directions and does not equate symmetry with normality', () => {
  const {dom, w, d} = setup();
  assert.match(d.querySelector('#mc-pair-readout').textContent, /9.340.*9.720.*0.190.*0.190/);
  input(w,d,'mc-symmetry-data','downtime','change');
  assert.match(d.querySelector('#mc-symmetry-readout').textContent, /Median = 11.5 min.*Right-skewed/);
  assert.match(d.querySelector('#mc-pair-readout').textContent, /Distance above = 178.5.*distance below = 8.5/);
  let chosen = d.querySelector('#mc-symmetry-svg .mc-selected');
  assert.ok(Number(chosen.getAttribute('cx')) > 300);
  assert.ok(Number(chosen.getAttribute('cy')) > 300);
  input(w,d,'mc-symmetry-data','left','change');
  assert.match(d.querySelector('#mc-symmetry-readout').textContent, /Left-skewed/);
  assert.match(d.querySelector('#mc-pair-readout').textContent, /Distance above = 8.5.*distance below = 178.5/);
  input(w,d,'mc-symmetry-data','bimodal','change');
  assert.match(d.querySelector('#mc-symmetry-readout').textContent, /Symmetric but two-cluster/);
  assert.equal(d.querySelectorAll('#mc-symmetry-svg circle').length, 15);
  const bars = [...d.querySelectorAll('#mc-histogram-svg rect')];
  assert.equal(bars.reduce((n,b)=>n+(Number(b.getAttribute('height'))===0?1:0),0), 2);
  input(w,d,'mc-pair',0,'change');
  assert.match(d.querySelector('#mc-pair-readout').textContent, /Pair 1 of 15/);
  for (const t of d.querySelectorAll('#mc-histogram-svg text')) assert.ok(!t.textContent.includes('NaN'));
  dom.window.close();
});

test('variability activity moves cell means independently of ranges and SDs, and reset restores the source', () => {
  const {dom, w, d} = setup();
  function cells() {return [...d.querySelectorAll('#mc-cell-statistics tr')].map(tr=>[...tr.children].map(c=>c.textContent));}
  const base = cells();
  assert.equal(base.length, 12);
  assert.deepEqual(base[9], ['B','Night','Leading','5','9.680','0.160','0.06325']);
  input(w,d,'mc-mean-change',-.1);
  let changed = cells();
  assert.deepEqual(changed[9], ['B','Night','Leading','5','9.580','0.160','0.06325']);
  assert.deepEqual(changed.slice(0,9), base.slice(0,9));
  input(w,d,'mc-spread-change',2);
  changed = cells();
  assert.deepEqual(changed[9], ['B','Night','Leading','5','9.580','0.320','0.12649']);
  assert.equal(d.querySelectorAll('#mc-variability-svg circle').length, 60);
  // Extreme combined control settings must remain inside the fixed plotting area.
  for (const change of [-.18,.12]) {
    input(w,d,'mc-mean-change',change);
    for (const point of d.querySelectorAll('#mc-variability-svg circle')) assert.ok(Number(point.getAttribute('cy')) >= 55 && Number(point.getAttribute('cy')) <= 330);
  }
  d.getElementById('mc-variability-reset').click();
  assert.deepEqual(cells(), base);
  dom.window.close();
});

test('interaction activity calculates unequal and equal shift effects and updates the accessible table', () => {
  const {dom, w, d} = setup();
  assert.match(d.querySelector('#mc-interaction-readout').textContent, /Difference between shift changes = 0.150 mm/);
  d.getElementById('mc-equal-effects').click();
  assert.equal(d.querySelector('#mc-b-night-mean').textContent, '9.570');
  assert.match(d.querySelector('#mc-interaction-readout').textContent, /0.000 mm.*no Line × Shift interaction/);
  input(w,d,'mc-shift-effect',-.05);
  assert.equal(d.querySelector('#mc-b-night-mean').textContent, '9.510');
  assert.match(d.querySelector('#mc-interaction-readout').textContent, /−?\-0.060 mm/);
  d.getElementById('mc-interaction-reset').click();
  assert.equal(d.querySelector('#mc-b-night-mean').textContent, '9.720');
  assert.equal(d.querySelector('#mc-b-shift-change').textContent, '0.160');
  dom.window.close();
});

test('practice validation distinguishes blank, wrong and correct answers; canonical quiz emits progress events', () => {
  const {dom, w, d} = setup();
  const check=d.getElementById('mc-check-range');
  check.click();assert.match(d.querySelector('#mc-range-feedback').textContent, /Enter a numeric/);
  input(w,d,'mc-range-answer',0);check.click();assert.match(d.querySelector('#mc-range-feedback').textContent, /Try again/);
  input(w,d,'mc-range-answer',.160);check.click();assert.match(d.querySelector('#mc-range-feedback').textContent, /Correct/);
  const events=[];d.addEventListener('upskill-quiz-result',e=>events.push({score:e.detail.score,total:e.detail.total}));
  d.getElementById('quiz-submit').click();
  assert.match(d.querySelector('#quiz-result').textContent, /0 \/ 7.*7 unanswered/);
  for (const question of d.querySelectorAll('#quiz-form .quiz-question')) question.querySelector(`input[value="${question.dataset.answer}"]`).checked=true;
  d.getElementById('quiz-submit').click();
  assert.match(d.querySelector('#quiz-result').textContent, /7 \/ 7/);
  assert.equal(d.querySelectorAll('.quiz-question.is-correct').length, 7);
  d.querySelector('input[name=q1][value=a]').checked=true;d.getElementById('quiz-submit').click();
  assert.equal(d.querySelectorAll('.quiz-question.is-incorrect').length, 1);
  assert.deepEqual(events,[{score:0,total:7},{score:7,total:7},{score:6,total:7}]);
  input(w,d,'mc-question','spread','change');assert.match(d.querySelector('#mc-choice-feedback').textContent, /variability chart/);
  input(w,d,'mc-question','interaction','change');assert.match(d.querySelector('#mc-choice-feedback').textContent, /multi-vari chart/);
  dom.window.close();
});

test('lesson implements the full statistics workflow with keyboard-accessible responsive content', () => {
  const {dom, d} = setup();
  const implementation=d.getElementById('implementation');
  assert.deepEqual([...implementation.querySelectorAll('h3')].map(h=>h.textContent),['Excel Functions','Excel Use Cases','Minitab Navigation','Exam Tips']);
  for (const command of ['Stat → Quality Tools → Symmetry Plot','Stat → Quality Tools → Variability Chart','Stat → Quality Tools → Multi-Vari Chart']) assert.ok(implementation.textContent.includes(command));
  assert.ok(implementation.textContent.includes('ASQ CSSBB/CQE'));
  assert.ok(implementation.textContent.includes('E47:E51'));
  for (const table of d.querySelectorAll('.minitab-charts-lesson table')) {
    assert.ok(table.parentElement.classList.contains('mc-scroll'));
    assert.equal(table.parentElement.tabIndex,0);
    assert.ok(table.querySelector('caption'));
  }
  for (const control of d.querySelectorAll('.minitab-charts-lesson select,.minitab-charts-lesson input')) assert.ok(control.closest('label') || d.querySelector(`label[for="${control.id}"]`));
  for (const svg of d.querySelectorAll('.mc-plot svg')) {
    assert.equal(svg.getAttribute('role'),'img');
    assert.ok(svg.querySelector('title'));
    assert.ok(svg.querySelector('desc'));
  }
  const css=[...d.querySelectorAll('style:not(#uss-quiz-style)')].map(e=>e.textContent).join('\n');
  for (const match of css.matchAll(/(--[a-z0-9-]+)\s*:/g)) assert.ok(match[1].startsWith('--lesson-mc-'));
  for (const selector of ['header','footer','.site','.brand','.footer-grid','.desktop-nav']) assert.ok(!new RegExp(`(^|[},]\\s*)${selector.replaceAll('.','\\.')}\\s*[{,]`,'m').test(css));
  assert.equal(d.body.lastElementChild.id,'mc-dark-mode');
  assert.ok(d.querySelector('math[display=block]'));
  dom.window.close();
});
