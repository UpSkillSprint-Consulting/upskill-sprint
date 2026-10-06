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
  assert.equal(new Set(ids).size, ids.length, 'all IDs must be unique');
  for (const link of d.querySelectorAll('.mc-toc a')) assert.ok(d.querySelector(link.getAttribute('href')));
  dom.window.close();
});

test('all five supplied Minitab outputs and their explanations are collapsed initially', () => {
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
  assert.equal(d.querySelectorAll('details.mc-output img').length, 5);
  assert.equal(d.querySelectorAll('#variability-output img').length, 2);
  assert.ok(d.querySelector('#variability-output #variability-sd-output-heading'));
  assert.match(d.querySelector('#variability-output').textContent, /arithmetic mean of the twelve cell SDs/);
  assert.doesNotMatch(d.querySelector('#variability-output').textContent, /SD chart is not shown/);
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

test('lesson embeds original output images and never renders replacement charts', () => {
  const {dom, d} = setup();
  assert.equal(d.querySelectorAll('#lesson-content svg,#lesson-content canvas,.mc-plot').length, 0);
  assert.equal(d.querySelectorAll('#lesson-content input[type=range]').length, 0);
  const script = d.getElementById('mc-interactions').textContent;
  assert.doesNotMatch(script, /createElementNS|svgNode|function chart|function symmetry|function variability|function interaction/);
  const crypto = require('node:crypto');
  const originals = {
    'symmetry-wall.png': 'image(5).png', 'symmetry-downtime.png': 'image(7).png',
    'variability-wall.png': 'image(8).png', 'multi-vari-wall.png': 'image(9).png', 'variability-standard-deviation.png': 'image(10).png'
  };
  // Lock the five original supplied image bytes, independent of local uploads.
  const hashes = {"symmetry-wall.png": "f9c43609f4741f94269590bf9fd6c98e8fb791a305747009072b2ad2f2ec3ae2", "symmetry-downtime.png": "5740ffeb057d2daaed05ec4f1e033af31a76357cf86811c7c9adc9f87ffc625b", "variability-wall.png": "1672fe6065b0ff42ce22f1f937d2d92481b7e5a28bf11296be383c23c93b7b17", "multi-vari-wall.png": "a16c9e78231af08f5a6575ccda5bdc0bf33dec19676e0ba8eca909639b0e0a91"};
  hashes["variability-standard-deviation.png"] = "02b5bfb1a84719d00665e1189718cccd17eef3361820ebc54a7d5d0c53aebb01";
  for (const file of Object.keys(originals)) {
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(assets,file))).digest('hex'), hashes[file]);
    assert.ok(d.querySelector(`details.mc-output img[src$="/${file}"]`));
  }
  dom.window.close();
});

test('nonvisual prediction activities explain symmetry, spread and interaction without changing outputs', () => {
  const {dom, w, d} = setup();
  const sources = [...d.querySelectorAll('details.mc-output img')].map(i=>i.src);
  for (const [key,wrong,correct,evidence] of [
    ['symmetry','above','below',/178.5.*8.5.*below the diagonal/],
    ['variability','all','mean',/0.100.*range and sample SD stay the same/],
    ['multi-vari','proof','interaction',/0.150.*statistical significance requires/]
  ]) {
    assert.equal(d.getElementById(`mc-${key}-feedback`).textContent,'');
    input(w,d,`mc-${key}-prediction`,wrong,'change');
    assert.match(d.getElementById(`mc-${key}-feedback`).textContent,/Review your reasoning/);
    input(w,d,`mc-${key}-prediction`,correct,'change');
    const feedback=d.getElementById(`mc-${key}-feedback`).textContent;
    assert.match(feedback,/Correct/);assert.match(feedback,evidence);
  }
  assert.deepEqual([...d.querySelectorAll('details.mc-output img')].map(i=>i.src), sources);
  assert.equal(d.querySelectorAll('details.mc-output[open]').length,0);
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
