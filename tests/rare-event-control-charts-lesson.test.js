'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.join(__dirname,'..');
const slug = 'rare-event-control-charts';
const html = fs.readFileSync(path.join(root,'lessons/quality-engineering',slug+'.html'),'utf8');
const dir = path.join(root,'assets/lessons',slug);
const rows = name => fs.readFileSync(path.join(dir,name),'utf8').trim().split(/\r?\n/).slice(1).map(x=>x.split(','));
function gaps(r) {return r.slice(1).map((v,i)=>(Date.parse(v[2].replace(' ','T')+(v[2].length===10?'T00:00Z':'Z'))-Date.parse(r[i][2].replace(' ','T')+(r[i][2].length===10?'T00:00Z':'Z')))/86400000);}
function near(a,b,t=1e-5){assert.ok(Math.abs(a-b)<t,a+' != '+b);}
test('rare-event lesson metadata and public access',()=>{assert.ok(html.startsWith('<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META'));const m=JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)\s*-->/)[1]);assert.equal(m.slug,slug);assert.equal(m.access_level,'public');assert.equal(m.category_slug,'quality-engineering');assert.equal((html.match(/<main id="lesson-content">/g)||[]).length,1);assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.match(html,/upskill-quiz-result/);assert.match(html,/Statistics Implementation/);});
test('raw records preserve ordering and interval numbering',()=>{const g=rows('g-payment-dates.csv'),t=rows('t-pump-timestamps.csv');assert.equal(g.length,38);assert.equal(t.length,38);const gg=gaps(g),tt=gaps(t);assert.equal(gg.length,37);assert.equal(tt.length,37);assert.ok(gg.every(x=>x>=0));assert.ok(tt.every(x=>x>0));assert.equal(gg[25],87);assert.deepEqual(gg.slice(27,30),[0,0,0]);near(tt[25],52.09513888888889);near(tt[26]*1440,8);near(gg.slice(0,25).reduce((a,b)=>a+b,0)/25,12.12);near(tt.slice(0,25).reduce((a,b)=>a+b,0)/25,5.76025);});
test('fixed limit checkpoints and independent tests 1, 2 and Benneyan',()=>{const p=.08,F=x=>1-(1-p)**(x+1),quant=q=>{const hi=Math.ceil(Math.log(1-q)/Math.log(1-p))-1,lo=hi-1;return Math.max(0,lo+(q-F(lo))/(F(hi)-F(lo)));};const g=[quant(.00135),quant(.5),quant(.99865)],t=[-7*Math.log(.99865),7*Math.log(2),-7*Math.log(.00135)];near(g[0],0);near(g[1],7.32,.01);near(g[2],78.25,.01);near(t[1],4.85,.01);near(t[2],46.25,.01);const gs=gaps(rows('g-payment-dates.csv')),ts=gaps(rows('t-pump-timestamps.csv'));const beyond=(data,lim)=>data.flatMap((x,i)=>x<lim[0]||x>lim[2]?[i+2]:[]);assert.deepEqual(beyond(gs,g),[27]);assert.deepEqual(beyond(ts,t),[27,28]);const run=(data,cl)=>{let n=0,side=0,out=[];data.forEach((x,i)=>{const s=Math.sign(x-cl);n=s===0?0:s===side?n+1:1;side=s;if(n>=9)out.push(i+2);});return out;};assert.deepEqual(run(gs,g[1]),[36,37,38]);assert.deepEqual(run(ts,t[1]),[36,37,38]);const r=Math.ceil(Math.log(.00135)/Math.log(p));assert.equal(r,3);});
test('original binary deliverables present before publication',()=>{for(const f of ['realistic-rare-event-logs.xlsx','rare-event-g-and-t-minitab-practice.xlsx','g-and-t-minitab-practice.mpx','g-original-minitab.webp','t-original-minitab.webp'])assert.ok(fs.existsSync(path.join(dir,f)),f+' missing — keep draft');});

test('both original Minitab screenshots are embedded and explained outside answer disclosures',()=>{for(const [k,w,h] of [['g',772,515],['t',725,483]]){const block=html.match(new RegExp('<section id="'+k+'-minitab-output"[\\s\\S]*?</section>'));assert.ok(block);assert.ok(block[0].includes('src="/assets/lessons/'+slug+'/'+k+'-original-minitab.webp"'));assert.ok(block[0].includes('width="'+w+'" height="'+h+'"'));assert.ok(block[0].includes('Test 1'));assert.ok(block[0].includes('Test 2'));assert.ok(block[0].includes('Conclusion'));assert.ok(fs.existsSync(path.join(dir,k+'-original-minitab.webp')));}});

/* Guide and persona-audit enhancements (26 Nov 2026). */
const { JSDOM } = require('jsdom');
const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
const catalog = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
const guideBlock = h => { const a = guide.indexOf(h); const b = guide.indexOf('```html', a); return guide.slice(b + 7, guide.indexOf('\n```', b + 7)).trim(); };
const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)\s*-->/)[1]);
const doc = new JSDOM(html).window.document;
const live = () => new JSDOM(html, { url: 'https://upskillsprint.com/lessons/quality-engineering/' + slug, runScripts: 'dangerously' }).window;

test('canonical chrome, quiz styles and grader are byte-identical to the guide; quiz inside main', () => {
  for (const h of ['### 4.1 Header', '### 4.2 Footer', '### 7.1 Quiz styles', '### 7.3 Quiz grader']) assert.ok(html.includes(guideBlock(h)), h);
  assert.ok(doc.querySelector('main#lesson-content #quiz'));
  assert.equal(doc.querySelectorAll('#quiz .quiz-question').length, 10);
});

test('minutes, catalog and the §24 text budget agree', () => {
  const i = catalog.indexOf("marker: 'data-rare-event-control-charts'");
  const entry = catalog.slice(catalog.lastIndexOf('{', i), catalog.indexOf('}', i) + 1);
  assert.ok(entry.includes('<span>' + meta.estimated_minutes + ' min</span>'));
  assert.match(doc.querySelector('.re-kicker').textContent, new RegExp(meta.estimated_minutes + ' min'));
  const clone = doc.querySelector('main#lesson-content').cloneNode(true);
  clone.querySelectorAll('script, style, svg, #quiz').forEach(e => e.remove());
  const words = clone.textContent.replace(/\\\[[\s\S]*?\\\]/g, ' M ').replace(/\\\([\s\S]*?\\\)/g, ' M ').split(/\s+/).filter(Boolean).length;
  assert.ok(words <= meta.estimated_minutes * 50, words + ' words');
  for (const p of doc.querySelectorAll('main p')) assert.ok(p.textContent.replace(/\\\([\s\S]*?\\\)/g, ' M ').split(/\s+/).filter(Boolean).length <= 60, p.textContent.slice(0, 50));
});

test('variables and formulas in prose are LaTeX (§22)', () => {
  const clone = doc.querySelector('main#lesson-content').cloneNode(true);
  clone.querySelectorAll('script, style, svg, code, select, [aria-hidden="true"]').forEach(e => e.remove());
  const text = clone.textContent.replace(/\\\[[\s\S]*?\\\]/g, ' ').replace(/\\\([\s\S]*?\\\)/g, ' ');
  assert.doesNotMatch(text, /\b(theta|lambda|beta|eta|Phi|Gamma) is\b|\bp ?= ?0\.\d|[≈≤≥]|X̄/);
});

test('the charts plot exactly the CSV records, with Minitab-matching signals', () => {
  const w = live(), d = w.document;
  const g = JSON.parse(d.getElementById('re-gactual').dataset.values), t = JSON.parse(d.getElementById('re-tactual').dataset.values);
  const expG = gaps(rows('g-payment-dates.csv')), expT = gaps(rows('t-pump-timestamps.csv'));
  assert.equal(g.length, 37); assert.equal(t.length, 37);
  g.forEach((v, i) => near(v, expG[i], 1e-6)); t.forEach((v, i) => near(v, expT[i], 1e-6));
  assert.equal(d.getElementById('re-gactual').dataset.signals, '27,31,36,37,38');
  assert.equal(d.getElementById('re-tactual').dataset.signals, '27,28,36,37,38');
  const gl = JSON.parse(d.getElementById('re-gactual').dataset.limits), tl = JSON.parse(d.getElementById('re-tactual').dataset.limits);
  near(gl[1], 7.32196, 1e-4); near(gl[2], 78.25369, 1e-4); near(tl[0], 0.009456, 1e-5); near(tl[2], 46.25355, 1e-4);
  for (const el of d.querySelectorAll('main svg *')) assert.ok(!/^#|var\(/.test(el.getAttribute('fill') || '') && !/^#|var\(/.test(el.getAttribute('stroke') || ''), 'colour attribute on ' + el.tagName);
  assert.equal(d.querySelectorAll('#re-hazards text.hz-label').length, 3, 'hazard curves labelled directly');
  w.close();
});

test('Statistics Implementation (§11.1), contents chips and footnote guidance', () => {
  const p = doc.getElementById('re-implementation');
  assert.equal(p.tagName, 'DETAILS'); assert.ok(!p.hasAttribute('open'));
  const sm = p.querySelector('summary');
  assert.ok(sm.querySelector('h2') && sm.querySelector('.re-hint') && sm.querySelector('.re-kicker'));
  for (const id of ['re-excel', 're-excel-cases', 're-minitab', 're-exam']) assert.ok(p.querySelector('#' + id), id);
  assert.match(p.textContent, /NEGBINOM\.DIST/); assert.match(p.textContent, /MTBF/);
  assert.match(html, /@keyframes lesson-rare-event-nudge/); assert.match(html, /prefers-reduced-motion:reduce\)\{#lesson-content \.re-impl:not\(\[open\]\) \.re-hint\{animation:none\}/);
  const chips = [...doc.querySelectorAll('.re-toc a')];
  assert.ok(chips.length >= 10);
  for (const a of chips) assert.ok(doc.getElementById(a.getAttribute('href').slice(1)), a.getAttribute('href'));
  assert.match(doc.getElementById('g-minitab-output').textContent, /estimated historical parameter/);
  assert.match(doc.getElementById('t-minitab-output').textContent, /estimated historical parameter/);
  const w = live(); w.location.hash = '#re-exam'; w.dispatchEvent(new w.Event('hashchange'));
  assert.equal(w.document.getElementById('re-implementation').open, true); w.close();
});

test('downloads, data dictionary and related lessons', () => {
  for (const a of doc.querySelectorAll('a[download]')) { assert.ok(fs.existsSync(path.join(root, a.getAttribute('href')))); assert.match(a.textContent, /\(CSV, \d+ KB\)/); }
  const described = [...doc.querySelectorAll('[aria-label="Data dictionary for the two CSV files"] tbody tr td:first-child')].map(td => td.textContent);
  for (const f of ['g-payment-dates.csv', 't-pump-timestamps.csv']) for (const col of fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/)[0].split(',')) assert.ok(described.includes(col), col);
  const rel = [...doc.querySelectorAll('.related-lessons li')];
  assert.ok(rel.length >= 3 && rel.length <= 5);
  for (const li of rel) { assert.ok(fs.existsSync(path.join(root, li.querySelector('a').getAttribute('href') + '.html'))); assert.match(li.textContent, / — \S/); }
});
test('formula boxes are not static landmarks; only overflowing ones become named regions; controls fit phones', () => {
  assert.equal(doc.querySelectorAll('.re-math[role="region"]').length, 0, 'no duplicate "Formula" landmarks or idle tab stops');
  assert.match(html, /function markWide\(\)/);
  assert.match(html, /#lesson-content \.re-controls select\{width:100%;max-width:100%\}/);
  const labels = [...doc.querySelectorAll('[role="region"][aria-label]')].map(e => e.getAttribute('aria-label'));
  assert.equal(new Set(labels).size, labels.length, 'region names are unique');
});
