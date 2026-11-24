'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const slug = 'cusum-vs-ewma-control-charts';
const pagePath = 'lessons/quality-engineering/' + slug + '.html';
const html = fs.readFileSync(path.join(root, pagePath), 'utf8');
const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
const doc = new JSDOM(html).window.document;
const assets = path.join(root, 'assets/lessons', slug);

function guideBlock(heading) {
  const start = guide.indexOf(heading);
  assert.ok(start >= 0, 'guide heading: ' + heading);
  const begin = guide.indexOf('```html', start);
  const end = guide.indexOf('\n```', begin + 7);
  assert.ok(begin >= 0 && end > begin, 'fenced HTML in guide');
  return guide.slice(begin + 7, end).trim();
}

test('guild: canonical metadata, head, unique landmarks, and full site chrome', () => {
  assert.match(html, /^<!doctype html>\s*<html lang="en">\s*<!-- UPSKILLSPRINT_LESSON_META/i);
  const metadata = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)\s*-->/)[1]);
  assert.equal(metadata.slug, slug);
  assert.equal(metadata.lesson_type, 'General');
  assert.equal(metadata.category_slug, 'quality-engineering');
  assert.equal(metadata.estimated_minutes, 35);
  assert.ok(metadata.search_keywords.length >= 5);
  assert.equal(doc.querySelectorAll('main#lesson-content').length, 1);
  assert.equal(doc.querySelectorAll('#lesson-content h1').length, 1);
  assert.ok(html.includes(guideBlock('### 4.1 Header')));
  assert.ok(html.includes(guideBlock('### 4.2 Footer')));
  assert.ok(doc.querySelector('body[data-lesson-type="general"]'));
  assert.ok(doc.querySelector('script[src="/theme.js"]'));
  assert.ok(doc.querySelector('script[src="/site-sections.js"]'));
  assert.ok(doc.querySelector('script[src="/assets/js/math.js"]'));
  const ids = [...doc.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('guild: SEO, structured data and verified related lessons', () => {
  assert.ok(doc.title.endsWith(' | UpSkill Sprint'));
  assert.ok(doc.title.length <= 65);
  const description = doc.querySelector('meta[name="description"]').content;
  assert.ok(description.length >= 120 && description.length <= 165);
  for (const key of ['og:type','og:title','og:description','og:image','og:url']) {
    assert.ok(doc.querySelector('meta[property="' + key + '"]'));
  }
  assert.equal(doc.querySelector('meta[property="og:description"]').content, description);
  assert.equal(doc.querySelector('meta[name="twitter:card"]').content, 'summary');
  assert.match(doc.querySelector('meta[name="upskill:email-teaser"]').content, /^.{40,160}$/);
  const ld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  assert.ok(ld['@graph'].some(item => item['@type'] === 'BreadcrumbList'));
  assert.ok(ld['@graph'].some(item => item['@type'] === 'LearningResource'));
  assert.equal(doc.querySelectorAll('.related-lessons a').length, 3);
});

test('guild: visual-first poster, interactive calculator, native assets and documented data', () => {
  assert.ok(doc.querySelector('.lesson-poster svg[role="img"]'));
  assert.equal(doc.querySelectorAll('#live-cusum, #live-ewma').length, 2);
  for (const name of [
    'pipe-cusum-original-minitab.png','pipe-ewma-reconstructed.png',
    'reactor-cusum-reconstructed.png','reactor-ewma-reconstructed.png',
    'fill-cusum-reconstructed.png','fill-ewma-reconstructed.png',
    'ore-cusum-original-minitab.png','ore-ewma-reconstructed.png'
  ]) {
    assert.ok(doc.querySelector('img[src="/assets/lessons/' + slug + '/' + name + '"]'));
    const bytes = fs.readFileSync(path.join(assets, name));
    assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])), name);
    assert.ok(bytes.length < 500_000, name);
  }
  const csv = fs.readFileSync(path.join(assets, 'CUSUM_EWMA_Minitab_Practice_Data.csv'), 'utf8');
  const lines = csv.trim().split(/\r?\n/);
  assert.equal(lines.length, 101);
  assert.equal(Number(lines[45].split(',')[4]), 1.398);
  assert.ok(fs.existsSync(path.join(assets, 'CUSUM_EWMA_Minitab_Practice_Workbook.xlsx')));
  assert.ok(fs.existsSync(path.join(assets, 'CUSUM_EWMA_Minitab_Practice.mpx')));
  assert.doesNotMatch(html, /data:image\/|base64,/);
});

test('guild: interactive lab, reveal answer, reset and quiz progress event', () => {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const win = new JSDOM(html,{url:'https://upskillsprint.com/lessons/quality-engineering/' + slug,runScripts:'dangerously',virtualConsole}).window;
  const d = win.document;
  const n = d.getElementById('lab-n');
  assert.ok(n.textContent.trim() !== '—');
  d.getElementById('preset-spike').click();
  assert.match(d.getElementById('readings').value, /6\.549/);
  d.getElementById('calc-reset').click();
  assert.doesNotMatch(d.getElementById('readings').value, /6\.549/);
  d.getElementById('sigma').value = '-1';
  d.getElementById('calc-update').click();
  assert.match(d.getElementById('lab-status').textContent, /σ > 0/);
  d.getElementById('sigma').value='0.04';
  d.getElementById('calc-update').click();
  assert.equal(d.getElementById('reveal-answer').getAttribute('aria-expanded'),'false');
  d.getElementById('reveal-answer').click();
  assert.equal(d.getElementById('reveal-answer').getAttribute('aria-expanded'),'true');
  const panel=d.getElementById('cusum-ewma-implementation');
  assert.equal(panel.open,false);
  win.location.hash='#cusum-ewma-minitab';
  win.dispatchEvent(new win.Event('hashchange'));
  assert.equal(panel.open,true);
  let scoreEvent=null;
  d.addEventListener('upskill-quiz-result',e=>scoreEvent=e.detail);
  d.getElementById('quiz-submit').click();
  assert.equal(scoreEvent.score,0); assert.equal(scoreEvent.total,5);
  for(const [i,value] of ['b','c','a','b','c'].entries()) {
    d.querySelector('#quiz-form input[name="q'+(i+1)+'"][value="'+value+'"]').checked=true;
  }
  d.getElementById('quiz-submit').click();
  assert.equal(scoreEvent.score,5); assert.equal(scoreEvent.total,5);
  d.getElementById('quiz-reset').click();
  assert.equal(d.querySelectorAll('#quiz-form input:checked').length,0);
  assert.deepEqual(errors,[]);
  win.close();
});

test('guild: statistical implementation and source registration', () => {
  const p=doc.getElementById('cusum-ewma-implementation');
  assert.ok(p && !p.hasAttribute('open'));
  assert.ok(p.querySelector('summary h2'));
  for(const id of ['cusum-ewma-excel-functions','cusum-ewma-excel-use-cases','cusum-ewma-minitab','cusum-ewma-exam-tips']) assert.ok(p.querySelector('#'+id));
  assert.equal(doc.querySelectorAll('#quiz .quiz-question').length,5);
  assert.ok(html.includes('lesson-cusum-ewma-nudge'));
  assert.ok(html.includes('prefers-reduced-motion'));
  assert.ok(html.includes(String.raw`\[ C_i^{+}`));
  const catalog=fs.readFileSync(path.join(root,'chi-square-lesson-library.js'),'utf8');
  assert.ok(catalog.includes("marker: 'data-cusum-ewma-control-charts'"));
  assert.ok(catalog.includes("path: '/lessons/quality-engineering/cusum-vs-ewma-control-charts'"));
});

test('guild: public access decision has an idempotent, unapplied SQL handoff', () => {
  const metadata=JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)\s*-->/)[1]);
  assert.equal(metadata.access_level, 'public');
  const key='lesson:/lessons/quality-engineering/cusum-vs-ewma-control-charts';
  const sql=fs.readFileSync(path.join(root, 'supabase/public-cusum-ewma-access.sql'), 'utf8');
  assert.ok(sql.includes(key));
  assert.match(sql, /'public'/);
  assert.match(sql, /on conflict \(resource_key\) do update/i);
  assert.doesNotMatch(html, /data-require-auth|data-required-access|data-access-resource/);
});

test('guild: all horizontal calculation tables support keyboard access and named regions', () => {
  const regions=[...doc.querySelectorAll('#lesson-content .table-wrap')];
  assert.ok(regions.length >= 8, 'expected calculations and comparison tables');
  for (const region of regions) {
    assert.equal(region.getAttribute('role'),'region');
    assert.equal(region.getAttribute('tabindex'),'0');
    assert.ok((region.getAttribute('aria-label')||'').trim().length > 5);
  }
});
