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
  for (const a of doc.querySelectorAll('a[download]')) { assert.ok(fs.existsSync(path.join(root, a.getAttribute('href')))); assert.match(a.textContent, /\((CSV|XLSX|MPX), \d+ KB\)/); }
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

/* Original binary deliverables (supplied by Ernest, 26 Nov 2026). */
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const originals = {
  'realistic-rare-event-logs.xlsx': 'fe775a9ed0667a8e17f6f8f6c48c9d6f131a881fd8b30dc7edc0491b630d58c1',
  'rare-event-g-and-t-minitab-practice.xlsx': '27fb91f23a9f7b6390448614b3828e3f2b32f812338ec374b9efa1cea96fc866',
  'g-and-t-minitab-practice.mpx': '57615624bf0650662656ad046e88206fa289f7c42cc859b7eec612b0688dc938',
  'g-original-minitab.png': 'eb5c1044d3c3879ca21569810a50d50b04265d68e9c878c609110a70ad642fc5',
  't-original-minitab.png': 'bd6d36721b5325efbf4ff9766ce3b463890c7b2776adf59dcca7ce894b9f2875'
};
// Minimal ZIP reader (central directory) so the test needs no extra dependency.
function unzipEntries(buf) {
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const out = {};
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10), size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28), extra = buf.readUInt16LE(p + 30), comment = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42), name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + size);
    out[name] = method === 8 ? zlib.inflateRawSync(raw) : raw;
    p += 46 + nameLen + extra + comment;
  }
  return out;
}

test('original workbooks, Minitab project and screenshots are byte-identical to the supplied files', () => {
  for (const [f, sha] of Object.entries(originals)) {
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, f))).digest('hex'), sha, f);
  }
});

test('original files are offered as downloads with honest sizes and the pending notice is gone', () => {
  assert.doesNotMatch(html, /pending binary attachment/);
  for (const f of ['realistic-rare-event-logs.xlsx', 'rare-event-g-and-t-minitab-practice.xlsx', 'g-and-t-minitab-practice.mpx']) {
    const a = doc.querySelector('#re-original-assets a[href="/assets/lessons/' + slug + '/' + f + '"]');
    assert.ok(a && a.hasAttribute('download'), f);
    const kb = Math.round(fs.statSync(path.join(dir, f)).size / 1000); // same 1000-byte KB as the CSV labels
    assert.match(a.textContent, new RegExp('\\(' + f.split('.').pop().toUpperCase() + ', ' + kb + ' KB\\)'), f);
  }
});

test('raw-records workbook holds every CSV record and the exposure figures quoted in the lesson', () => {
  const x = unzipEntries(fs.readFileSync(path.join(dir, 'realistic-rare-event-logs.xlsx')));
  const strings = Object.entries(x).filter(([n]) => /^xl\/(sharedStrings|worksheets\/sheet\d+)\.xml$/.test(n)).map(([, b]) => b.toString('utf8')).join('\n');
  for (const r of rows('g-payment-dates.csv')) assert.ok(strings.includes('>' + r[1] + '<'), r[1]);
  for (const r of rows('t-pump-timestamps.csv')) assert.ok(strings.includes('>' + r[1] + '<'), r[1]);
  const book = x['xl/workbook.xml'].toString('utf8');
  for (const s of ['G Payment Exceptions', 'T Pump Trip Log', 'Daily Exposure', 'Answer Key']) assert.ok(book.includes('name="' + s + '"'), s);
  // Daily Exposure = third sheet: column B transactions, column C critical exceptions.
  const rel = x['xl/_rels/workbook.xml.rels'].toString('utf8');
  const rid = book.match(/name="Daily Exposure"[^>]*r:id="([^"]+)"/)[1];
  const target = rel.match(new RegExp('Id="' + rid + '"[^>]*Target="([^"]+)"'))?.[1] || rel.match(new RegExp('Target="([^"]+)"[^>]*Id="' + rid + '"'))[1];
  const sheet = x['xl/' + target.replace(/^\/?xl\//, '')].toString('utf8');
  const col = c => [...sheet.matchAll(new RegExp('<(?:x:)?c r="' + c + '(\\d+)"[^>]*>(?:<(?:x:)?f>[^<]*</(?:x:)?f>)?<(?:x:)?v>([^<]+)</(?:x:)?v>', 'g'))].filter(m => m[1] !== '1').map(m => Number(m[2]));
  const tx = col('B'), ex = col('C');
  assert.equal(tx.length, 423);
  const mean = tx.reduce((a, b) => a + b, 0) / tx.length;
  const sd = Math.sqrt(tx.reduce((a, b) => a + (b - mean) ** 2, 0) / (tx.length - 1));
  near(mean, 10000.47, 0.005);
  near(100 * sd / mean, 2.37, 0.005);
  assert.equal(Math.min(...tx), 9600);
  assert.equal(Math.max(...tx), 10398);
  assert.equal(ex.reduce((a, b) => a + b, 0), 38);
  assert.match(html, /averages 10,000\.47, with sample CV 2\.37% and range 9,600–10,398/);
});

test('Minitab project holds the five worksheets and the G and T charts the lesson describes', () => {
  const x = unzipEntries(fs.readFileSync(path.join(dir, 'g-and-t-minitab-practice.mpx')));
  const metaJson = Object.entries(x).find(([n]) => /project_metadata.*\.json$/.test(n))[1].toString('utf8');
  for (const s of ['G Practice', 'T Practice', 'Daily Exposure', 'T Pump Trip Log', 'G Payment Exceptions']) assert.ok(metaJson.includes('"Name": "' + s + '"') || metaJson.includes('"Name":"' + s + '"'), s);
  const all = Object.entries(x).filter(([n]) => /\/(graph|figure)\.json$/.test(n)).map(([, b]) => b.toString('utf8')).join('\n');
  for (const s of ['G Chart of Event_Date', 'T Chart of Trip_Date_Time', 'UCL=78.25', 'LCL=0"', 'UCL=46.25', 'LCL=0.01']) assert.ok(all.includes(s), s);
  // Footnote wording quoted in the lesson must match Minitab's own text for each chart.
  assert.ok(all.includes('An estimated historical parameter is used in the calculations.'));
  assert.ok(all.includes('At least one estimated historical parameter is used in the calculations.'));
  assert.ok(html.includes('“An estimated historical parameter is used in the calculations”'));
  assert.ok(html.includes('“At least one estimated historical parameter is used in the calculations”'));
});

/* Layout regressions reported 26 Nov 2026. */
test('chart SVG rules cannot resize MathJax SVG formulas inside figure captions', () => {
  const css = [...doc.querySelectorAll('style')].map(s => s.textContent).join('\n');
  // MathJax renders with tex-svg, so any descendant ".re-chart svg" rule would also hit the formula.
  assert.doesNotMatch(css, /\.re-chart\s+svg/);
  assert.match(css, /#lesson-content \.re-chart > svg\{display:block;width:100%;height:auto;overflow:visible\}/);
  for (const fig of doc.querySelectorAll('#lesson-content .re-chart')) for (const svg of fig.querySelectorAll('svg')) assert.equal(svg.parentElement, fig, 'chart SVGs must be direct children of .re-chart');
  assert.ok(doc.querySelector('#re-gexample').closest('.re-chart').querySelector('figcaption').textContent.includes('\\(p = 0.005\\)'));
});

test('every top-level section spans the same column, including the quiz', () => {
  const css = [...doc.querySelectorAll('style')].map(s => s.textContent).join('\n');
  assert.match(css, /#lesson-content \.re-shell>\.quiz-section\.re-section\{max-width:none\}/);
  assert.ok(doc.querySelector('.re-shell > section#quiz.quiz-section.re-section'));
});

test('control-chart labels keep clear of each other: ticks, axis title, unit, limit names', () => {
  const w = live();
  const svg = w.document.getElementById('re-tactual');
  const texts = [...svg.querySelectorAll('text')].map(t => ({ s: t.textContent, x: Number(t.getAttribute('x')), y: Number(t.getAttribute('y')) }));
  const ticks = texts.filter(t => /^\d+$/.test(t.s) && t.y > 200);
  assert.ok(ticks.length >= 5);
  for (const t of ticks) assert.equal(t.y, 214, 'tick numbers sit 18px under the plot');
  const title = texts.find(t => t.s === 'Minitab observation');
  assert.equal(title.y, 236);
  assert.ok(title.y - 214 >= 20, 'axis title clears the 13px tick numbers');
  assert.ok(texts.find(t => t.s === 'Days').y >= 13, 'unit label stays inside the viewBox');
  const lastTick = Math.max(...ticks.map(t => t.x));
  for (const n of ['LCL', 'CL', 'UCL']) assert.ok(texts.find(t => t.s === n).x >= lastTick + 12, n + ' clears the last tick number');
  // Each Test 1 point keeps its own label because 27 (long gap) and 28 (8 minutes) sit far apart vertically.
  assert.equal(texts.filter(t => t.s === '1').length, 2);
});

test('return-to-category block matches the lesson column and the quiz button meets the 44px target', () => {
  const css = [...doc.querySelectorAll('style')].map(s => s.textContent).join('\n');
  const shell = css.match(/\.re-shell\{width:(min\(100% - 32px,1120px\))/)[1];
  assert.ok(css.includes('body[data-lesson-page]>section[aria-label="Return to lesson category"]{width:' + shell + ';max-width:none!important;padding:0!important}'));
  assert.match(css, /@media\(max-width:520px\)\{body\[data-lesson-page\]>section\[aria-label="Return to lesson category"\]\{width:calc\(100% - 24px\)\}\}/);
  assert.match(css, /#quiz \.quiz-actions button\{min-height:44px\}/);
  assert.ok(doc.querySelector('main + section[aria-label="Return to lesson category"]'), '§8 block stays canonical, after main');
});

test('distribution charts right-align the last x tick so extreme slider values stay inside the chart', () => {
  assert.ok(html.includes('label(c,X(max*i/3),188,(max*i/3).toFixed(max<10?1:0),i===3?"end":"middle")'));
  const w = live();
  const p = w.document.getElementById('re-p');
  p.value = p.min; p.dispatchEvent(new w.Event('input'));
  const ticks = [...w.document.querySelectorAll('#re-gdist text')].filter(t => t.getAttribute('y') === '188');
  assert.equal(ticks.length, 4);
  assert.equal(ticks[3].getAttribute('text-anchor'), 'end');
});

test('phone layout: overflowing formulas show a swipe cue; narrow tables can wrap long formulas and identifiers', () => {
  const css = [...doc.querySelectorAll('style')].map(s => s.textContent).join('\n');
  assert.match(css, /#lesson-content \.re-math\[role="region"\]::after\{content:"Swipe sideways to see the whole formula \\2192";content:"Swipe sideways to see the whole formula \\2192" \/ "";display:block;position:sticky;left:0/);
  assert.ok(css.includes('#lesson-content .re-table table:not(:has(th:nth-child(4))) code{overflow-wrap:anywhere}'));
  assert.ok(css.includes('@media(max-width:520px){#lesson-content .re-table table{font-size:14px}#lesson-content .re-table th,#lesson-content .re-table td{padding:8px}'));
  assert.match(css, /\.re-table table:has\(th:nth-child\(4\)\)\{min-width:560px\}/);
  // CSS-only wrapping keeps search-index text intact (no <wbr>, which the index builder turns into spaces).
  assert.ok(!html.includes('<wbr>'));
  assert.ok(doc.querySelector('[aria-label="Excel checkpoints"]').textContent.includes('=NEGBINOM.DIST(78,1,0.08,TRUE)'));
});

test('formula regions are marked after the deferred math loader runs, not before it exists', async () => {
  // The inline lesson script runs before the deferred /assets/js/math.js, so it must wait for DOMContentLoaded.
  assert.ok(html.includes('if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",afterMath);else afterMath();'));
  assert.ok(html.includes('const wideObserver=window.ResizeObserver?new ResizeObserver(queueWide):null;'));
  let subscribed = 0;
  new JSDOM(html, { url: 'https://upskillsprint.com/lessons/quality-engineering/' + slug, runScripts: 'dangerously', beforeParse(win) {
    // Simulate the deferred loader: UpskillMath appears only after the inline scripts have run.
    win.document.addEventListener('readystatechange', () => {
      if (win.document.readyState === 'interactive' && !win.UpskillMath) win.UpskillMath = { ready: { then(fn) { subscribed++; return Promise.resolve(fn({ startup: { promise: Promise.resolve() } })); } } };
    });
  } });
  await new Promise(r => setTimeout(r, 30));
  assert.equal(subscribed, 1, 'lesson waits for the deferred math loader before marking wide formulas');
});
