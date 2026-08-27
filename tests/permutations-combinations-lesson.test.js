'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const LESSON_PATH = path.join(ROOT, 'lessons', 'statistics', 'permutations-and-combinations.html');
const LESSON_URL = '/lessons/statistics/permutations-and-combinations';
const html = fs.readFileSync(LESSON_PATH, 'utf8');

function lessonMeta(source) {
  const match = source.match(/<html lang="en">\s*<!--\s*UPSKILLSPRINT_LESSON_META\s*\n([\s\S]*?)\n-->/);
  assert.ok(match, 'lesson metadata block exists immediately after <html lang="en">');
  return JSON.parse(match[1]);
}

function bodyBeforeMain(source) {
  const bodyStart = source.indexOf('<body ');
  const mainStart = source.indexOf('<main id="lesson-content"');
  return source.slice(bodyStart, mainStart);
}

test('lesson metadata, file identity, and required page attributes follow the guide', () => {
  const meta = lessonMeta(html);
  assert.equal(meta.title, 'Permutations & Combinations');
  assert.equal(meta.slug, 'permutations-and-combinations');
  assert.equal(meta.category, 'Statistics');
  assert.equal(meta.category_slug, 'statistics');
  assert.equal(meta.level, 'Beginner');
  assert.equal(meta.lesson_type, 'General');
  assert.equal(meta.estimated_minutes, 25);
  assert.equal(meta.interactive, true);
  assert.equal(meta.suggested_github_path, 'lessons/statistics/permutations-and-combinations.html');
  assert.ok(meta.search_keywords.length >= 5);
  assert.match(html, /<title>Permutations &amp; Combinations<\/title>/);
  assert.match(html, /<h1 id="lesson-title">Permutations &amp; Combinations<\/h1>/);
  assert.match(html, /<body[^>]*data-lesson-page="true"[^>]*data-category="statistics"[^>]*data-level="beginner"[^>]*data-interactive="true"[^>]*data-lesson-type="general"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/upskillsprint\.com\/lessons\/statistics\/permutations-and-combinations">/);
});

test('canonical lesson chrome is exact: no skip link and no extra header CTA', () => {
  assert.match(html, /<link rel="stylesheet" href="\/style\.css">/);
  assert.match(html, /<link rel="stylesheet" href="\/lessons-theme\.css">/);
  assert.match(html, /<script src="\/theme\.js"><\/script>/);
  assert.match(html, /<script src="\/site-sections\.js"><\/script>/);
  const preMain = bodyBeforeMain(html);
  assert.match(preMain, /<body[^>]*>\s*<input type="checkbox" id="mnav-check" class="mnav-check" aria-hidden="true">\s*<header class="site lesson-sitebar">/);
  assert.doesNotMatch(preMain, /skip-link|Skip to lesson content/);
  assert.doesNotMatch(preMain, /Browse lessons|header-cta/);
  const nav = preMain.match(/<nav class="desktop-nav"[\s\S]*?<\/nav>/)[0];
  const labels = [...nav.matchAll(/<a [^>]*>([^<]+)<\/a>/g)].map(m => m[1]);
  assert.deepEqual(labels, ['Start Here','Lessons','Engineering Tools','Services','Request a Topic','About','FAQ','Contact']);
  assert.equal((html.match(/<footer class="site">/g) || []).length, 1);
  assert.match(html, /<section aria-label="Return to lesson category" style="max-width:900px;margin:26px auto;padding:0 20px;text-align:left">\s*<a href="\/lessons#statistics"/);
});

test('original teaching sequence and interactive tools remain present', () => {
  [
    'The master decision table',
    'The most important distinction is order',
    'Permutation WITHOUT replacement / repetition',
    'Combination WITHOUT replacement / repetition',
    'With replacement vs without replacement',
    'Permutation WITH repetition / replacement',
    'Combination WITH repetition',
    'Repeated identical objects',
    'The table worth memorizing',
    'Do not calculate first',
    'Fast exam decision tree',
    'Interactive mastery practice',
    'The one memory sentence'
  ].forEach(text => assert.ok(html.includes(text), `preserves lesson content: ${text}`));
  [
    'The easiest way to master permutations and combinations is to stop memorizing formulas first',
    'Why divide by r!? Because permutations count every arrangement of the same group.',
    'With replacement usually means repetition is allowed.',
    'Almost every basic counting problem becomes much easier once you answer'
  ].forEach(text => assert.ok(html.includes(text), `preserves body teaching text: ${text}`));
  ['permViz','combViz','repTokens','pChoices'].forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
});

test('Statistics Implementation contains the four required parts in order with verified tool syntax', () => {
  const start = html.indexOf('id="statistics-implementation"');
  assert.ok(start >= 0, 'Statistics Implementation section exists');
  const section = html.slice(start, html.indexOf('</section>', start) + 10);
  const parts = ['Excel Functions','Excel Use Cases','Minitab Navigation','Exam Tips'];
  let cursor = -1;
  for (const part of parts) {
    const next = section.indexOf(part);
    assert.ok(next > cursor, `${part} exists in required order`);
    cursor = next;
  }
  ['FACT(number)','PERMUT(number, number_chosen)','PERMUTATIONA(number, number_chosen)','COMBIN(number, number_chosen)','COMBINA(number, number_chosen)','MULTINOMIAL(number1, [number2], ...)'].forEach(value => assert.ok(section.includes(value), `Excel syntax present: ${value}`));
  assert.ok(section.includes('Calc → Calculator'));
  ['FACTORIAL(5)','PERMUTATIONS(5,3)','COMBINATIONS(5,3)','COMBINATIONS(4+3-1,3)'].forEach(value => assert.ok(section.includes(value), `Minitab expression present: ${value}`));
});

test('mandatory comprehension quiz uses canonical structure and progress event', () => {
  assert.match(html, /<section class="quiz-section" id="quiz"/);
  assert.match(html, /<h2 id="quiz-heading">Check your understanding<\/h2>/);
  assert.match(html, /<form id="quiz-form">/);
  assert.match(html, /id="quiz-submit"/);
  assert.match(html, /id="quiz-result" role="status" aria-live="polite"/);
  assert.equal((html.match(/class="quiz-question" data-answer=/g) || []).length, 6);
  assert.match(html, /new CustomEvent\('upskill-quiz-result'/);
});

test('lesson CSS is namespaced, collision-resistant, responsive, and dark override is final', () => {
  const customProperties = [...html.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)].map(m => m[1]);
  assert.ok(customProperties.length > 0);
  assert.deepEqual([...new Set(customProperties.filter(name => !name.startsWith('--lesson-pc-')))], []);
  assert.match(html, /color-scheme:light dark/);
  assert.match(html, /\.pc-lesson \.tablewrap\{[^}]*overflow-x:auto/);
  assert.match(html, /@media\(max-width:760px\)/);
  assert.doesNotMatch(html.match(/<style>[\s\S]*?<\/style>/)[0], /header\.site|footer\.site|\.desktop-nav|\.theme-control/);
  const dark = html.lastIndexOf('<style id="pc-dark-mode-overrides">');
  const lastScript = html.lastIndexOf('</script>');
  const closeBody = html.lastIndexOf('</body>');
  assert.ok(dark > lastScript && dark < closeBody, 'self-styled dark override block is last before </body>');
});

test('counting functions produce the lesson worked-example answers', () => {
  const functions = ['fact','nPr','nCr'].map(name => {
    const match = html.match(new RegExp(`function ${name}\\(n(?:,r)?\\)\\{[^\\n]+\\}`));
    assert.ok(match, `${name} function is present`);
    return match[0];
  }).join('\n');
  const api = Function(`${functions}; return { fact, nPr, nCr };`)();
  assert.equal(api.fact(5), 120);
  assert.equal(api.nPr(5,3), 60);
  assert.equal(api.nCr(5,3), 10);
  assert.equal(api.nCr(6,3), 20);
});

test('live visuals, mastery practice, and comprehension quiz execute without runtime errors', () => {
  const runtimeHtml = html
    .replace(/<script>\s*window\.MathJax\s*=\s*\{[\s\S]*?<\/script>/, '')
    .replace(/<script[^>]+\bsrc="[^"]+"[^>]*><\/script>/g, '');
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  virtualConsole.on('error', error => errors.push(String(error)));
  const dom = new JSDOM(runtimeHtml, {
    runScripts: 'dangerously', pretendToBeVisual: true,
    url: 'https://upskillsprint.com/lessons/statistics/permutations-and-combinations', virtualConsole,
    beforeParse(window) {
      window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
      window.MathJax = { typesetPromise: () => Promise.resolve(), typesetClear() {} };
    }
  });
  const { document } = dom.window;
  ['permPause','combPause','repPause'].forEach(id => document.getElementById(id).click());
  const setRange = (id,value) => { const input=document.getElementById(id); input.value=String(value); input.dispatchEvent(new dom.window.Event('input',{bubbles:true})); };
  setRange('permN',5);setRange('permR',3);assert.match(document.getElementById('permFormula').textContent,/= 60/);
  document.getElementById('permDraw').click();document.getElementById('permDraw').click();document.getElementById('permDraw').click();
  assert.equal(document.querySelectorAll('#permSlots .filled').length,3);
  assert.equal(new Set([...document.querySelectorAll('#permSlots .filled')].map(node=>node.textContent)).size,3);
  setRange('combN',5);setRange('combR',3);assert.match(document.getElementById('combFormula').textContent,/= 10/);
  setRange('repN',4);setRange('repR',3);assert.match(document.getElementById('repFormula').textContent,/= 64/);
  document.querySelectorAll('#pChoices button')[2].click();assert.match(document.getElementById('pFeedback').textContent,/^Correct\./);assert.equal(document.getElementById('pNext').disabled,false);
  let reported=null;document.addEventListener('upskill-quiz-result',event=>{reported=event.detail;},{once:true});
  const answers=['b','c','d','a','b','c'];
  answers.forEach((value,index)=>{document.querySelector(`input[name="q${index+1}"][value="${value}"]`).checked=true;});
  document.getElementById('quiz-submit').click();
  assert.deepEqual(JSON.parse(JSON.stringify(reported)),{score:6,total:6});
  assert.match(document.getElementById('quiz-result').textContent,/Score: 6 \/ 6/);
  dom.window.close();assert.deepEqual(errors,[]);
});

test('lesson is registered literally in the JS catalog, not hardcoded in lessons.html', () => {
  const catalog = fs.readFileSync(path.join(ROOT,'chi-square-lesson-library.js'),'utf8');
  const marker = "marker: 'data-permutations-combinations'";
  assert.equal((catalog.match(new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g')) || []).length,1);
  assert.match(catalog, /marker: 'data-permutations-combinations',[\s\S]*?sectionId: 'statistics',[\s\S]*?path: '\/lessons\/statistics\/permutations-and-combinations',[\s\S]*?topic: 'statistics',[\s\S]*?level: 'beginner',[\s\S]*?interactive: 'true'/);
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell'"), 'generated lesson insertion point remains intact');
  const libraryHtml = fs.readFileSync(path.join(ROOT,'lessons.html'),'utf8');
  assert.equal((libraryHtml.match(new RegExp(LESSON_URL,'g')) || []).length,0,'lesson is not manually hardcoded in lessons.html');
  const sitemap = fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8');
  const canonical = `https://upskillsprint.com${LESSON_URL}`;
  assert.equal((sitemap.match(new RegExp(canonical,'g')) || []).length,1);
});
