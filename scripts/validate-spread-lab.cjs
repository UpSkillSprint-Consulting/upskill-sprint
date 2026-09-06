/* Browser checks for lesson chrome isolation, accessibility, math rendering and controls. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const cp = require('node:child_process');
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const ROOT = process.cwd();
const SLUG = 'variance-covariance-correlation-and-coefficient-of-variation';
const LESSON = 'lessons/statistics/' + SLUG + '.html';
const ROUTE = '/' + LESSON.replace(/\.html$/, '');
const OUT = path.join(ROOT, 'artifacts/spread-lab');
fs.mkdirSync(OUT, { recursive: true });
const html = fs.readFileSync(LESSON, 'utf8');
let baseline;
try { baseline = cp.execFileSync('git', ['show', '0aeded7ce7739838bbb1ed370f68f2f2089ae6df:' + LESSON], { encoding: 'utf8' }); } catch (_) { baseline = null; }
const report = { cases: [], baseline: [], matrix: [], preview: null, failures: [] };
function save() {
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(OUT, 'SUMMARY.md'), '# Spread Lab browser validation\n\n' +
    'Passed checks: ' + report.cases.filter(c => c.pass).length + '\n\n' +
    'Failures: ' + report.failures.length + '\n\n' +
    report.cases.map(c => '- ' + (c.pass ? 'PASS' : 'FAIL') + ': ' + c.name + (c.error ? ' — ' + c.error : '')).join('\n') +
    '\n\nPreview: ' + JSON.stringify(report.preview) + '\n');
}
async function check(name, fn) {
  try { await fn(); report.cases.push({ name, pass: true }); console.log('PASS', name); }
  catch (e) { report.cases.push({ name, pass: false, error: e.message }); report.failures.push(name + ': ' + e.message); console.error('FAIL', name, e.message); }
  save();
}
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let name = decodeURIComponent(url.pathname);
  if (!path.extname(name)) name += '.html';
  const file = path.resolve(ROOT, '.' + name);
  if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  const type = { '.js':'text/javascript', '.css':'text/css', '.html':'text/html', '.png':'image/png', '.svg':'image/svg+xml', '.json':'application/json', '.woff2':'font/woff2' }[path.extname(file)] || 'text/plain';
  let body = fs.readFileSync(file);
  if (name === '/' + LESSON) {
    if (url.searchParams.has('baseline') && baseline) body = baseline;
    if (url.searchParams.has('chrome-control')) body = html.replace(/<style>\s*[\s\S]*?<\/style>/, '').replace(/<style id="sl-dark-overrides">[\s\S]*?<\/style>/, '');
  }
  res.setHeader('Content-Type', type); res.end(body);
});
const katexDist = path.join(path.dirname(require.resolve('katex/package.json')), 'dist');
let base;
async function open(browser, width, url) {
  const context = await browser.newContext({ viewport:{ width, height:1000 }, colorScheme:'light', reducedMotion:'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // Same pinned KaTeX distribution as the lesson's CDN URL; the site files remain real.
  await page.route('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/**', async route => {
    const relative = new URL(route.request().url()).pathname.split('/dist/')[1];
    const target = path.resolve(katexDist, relative || '');
    if (!target.startsWith(katexDist + path.sep) || !fs.existsSync(target)) return route.abort();
    await route.fulfill({ path: target, contentType: target.endsWith('.js') ? 'text/javascript' : target.endsWith('.css') ? 'text/css' : undefined });
  });
  await page.goto(url, { waitUntil:'load', timeout:60000 });
  await page.waitForSelector('#lesson-progress-widget', { timeout:30000 });
  await page.waitForFunction(() => document.querySelectorAll('[data-rendered="true"]').length === 41, null, { timeout:30000 });
  await page.evaluate(() => document.fonts.ready);
  return { context, page, errors };
}
async function setTheme(page, theme) {
  const actual = await page.locator('html').getAttribute('data-theme');
  if (actual !== theme) await page.locator('[data-theme-toggle="true"]').click();
  await page.waitForFunction(t => document.documentElement.dataset.theme === t, theme);
  await page.waitForTimeout(250);
}
async function chromeStyles(page) {
  return page.evaluate(() => {
    const selectors = ['header.site', 'header.site .brand', 'header.site .brand span', '.desktop-nav', '.desktop-nav a', '.theme-control', '.theme-toggle', 'footer.site', 'footer.site .wrap', 'footer.site .brand', 'footer.site .brand span', '.footer-grid', '.footer-bottom', '#lesson-progress-widget', '#lesson-progress-widget .lp-card', '#lesson-progress-widget p', '#lesson-progress-widget a'];
    const properties = ['fontFamily','fontSize','fontWeight','lineHeight','color','backgroundColor','paddingTop','paddingRight','paddingBottom','paddingLeft','borderRadius','opacity','display','gap','maxWidth'];
    return Object.fromEntries(selectors.map(selector => {
      const e = document.querySelector(selector); if (!e) return [selector, null];
      const c = getComputedStyle(e), r = e.getBoundingClientRect();
      return [selector, Object.fromEntries([...properties.map(p => [p,c[p]]), ['width',Math.round(r.width*100)/100], ['height',Math.round(r.height*100)/100]])];
    }));
  });
}
async function audit(page) {
  return page.evaluate(() => {
    const rgb = s => { const a = s.match(/[\d.]+/g)?.map(Number) || [0,0,0]; return [a[0],a[1],a[2],a.length > 3 ? a[3] : 1]; };
    function background(e) {
      const layers=[]; for(let n=e;n;n=n.parentElement){const c=rgb(getComputedStyle(n).backgroundColor);layers.push(c);if(c[3]===1)break;}
      return layers.reverse().reduce((b,c)=>c.slice(0,3).map((v,i)=>v*c[3]+b[i]*(1-c[3])),[255,255,255]);
    }
    const lum = c => c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
    const ratio = (a,b) => {const l=[lum(a),lum(b)].sort((a,b)=>a-b);return(l[1]+.05)/(l[0]+.05);};
    const textContrast = e => ratio(rgb(getComputedStyle(e).color),background(e));
    function inScrollContainer(e) {
      for(let n=e.parentElement;n && n.id!=='lesson-content' && n.id!=='quiz';n=n.parentElement){
        const c=getComputedStyle(n),r=n.getBoundingClientRect();
        if(['auto','scroll','hidden'].includes(c.overflowX) && r.left>=-1 && r.right<=innerWidth+1)return true;
      }
      return false;
    }
    const outside = [...document.querySelectorAll('#lesson-content *,#quiz *')].filter(e => {
      if(e.closest('.katex-mathml') || !e.getClientRects().length || e instanceof SVGElement)return false;
      const r=e.getBoundingClientRect();
      return r.width>0 && (r.left < -2 || r.right>innerWidth+2) && !inScrollContainer(e);
    }).slice(0,20).map(e=>({tag:e.tagName,id:e.id,cls:e.className,rect:{left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right},text:e.textContent.slice(0,70)}));
    const visibleText = [...document.querySelectorAll('#lesson-content p,#lesson-content .readout span,#lesson-content .nav-dots a,#lesson-content .cv-badge,#lesson-content .path-block,#lesson-content .fn,#quiz .lesson-kicker')].filter(e=>e.getClientRects().length && e.textContent.trim());
    const badContrast = visibleText.map(e=>({text:e.textContent.slice(0,90),ratio:textContrast(e)})).filter(x=>x.ratio<4.49);
    const graphics = [...document.querySelectorAll('#lesson-content .track .axis,#lesson-content .track .mean-line')].filter(e=>e.getClientRects().length).map(e=>({cls:e.className,ratio:ratio(rgb(getComputedStyle(e).backgroundColor),background(e.parentElement))}));
    return { theme:document.documentElement.dataset.theme,width:innerWidth,documentOverflow:document.documentElement.scrollWidth>innerWidth+1,outside,badContrast,graphics,
      rendered:document.querySelectorAll('[data-rendered="true"]').length,mathErrors:document.querySelectorAll('.katex-error').length,
      headings:[...document.querySelectorAll('#lesson-content :is(h1,h2,h3,h4),#quiz :is(h1,h2,h3,h4)')].length,
      navContrast:[...document.querySelectorAll('#navDots a')].map(e=>textContrast(e)),
      heroLabel:document.getElementById('heroSlider').getAttribute('aria-label'),
      headerCount:document.querySelectorAll('header.site').length,footerCount:document.querySelectorAll('footer.site').length,progressCount:document.querySelectorAll('#lesson-progress-widget').length };
  });
}
async function hoverContrast(page, selector) {
  await page.locator(selector).hover();
  await page.waitForTimeout(180);
  return page.locator(selector).evaluate(e => {
    const rgb=s=>(s.match(/[\d.]+/g)||[]).map(Number).slice(0,3);
    const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
    const c=getComputedStyle(e),v=[lum(rgb(c.color)),lum(rgb(c.backgroundColor))].sort((a,b)=>a-b);
    return {color:c.color,background:c.backgroundColor,ratio:(v[1]+.05)/(v[0]+.05)};
  });
}
async function interactions(page) {
  for (const id of ['heroSlider','varSlider','cvSlider','covSlider','corrSlider']) {
    for (const value of await page.locator('#'+id).evaluate(e=>[e.min,(Number(e.min)+Number(e.max))/2,e.max])) {
      await page.locator('#'+id).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));},value);
      assert.doesNotMatch(await page.locator('#lesson-content').innerText(), /\b(?:NaN|Infinity)\b/);
    }
  }
  assert.equal(await page.locator('#corrVal').innerText(),'1.000');
  for (const id of ['varShuffle','covShuffle','corrShuffle']) await page.locator('#'+id).click();
  const prior = await page.locator('#dispRange').innerText();
  await page.locator('#outlierToggle').check();
  assert.notEqual(await page.locator('#dispRange').innerText(), prior);
  await page.locator('#outlierToggle').uncheck();
  assert.equal(await page.locator('#dispRange').innerText(), prior);
  await page.locator('#guessPallets').click();
  assert.match(await page.locator('#guessResponse').innerText(), /Reasonable guess/);
  await page.locator('#guessPins').click();
  assert.match(await page.locator('#guessResponse').innerText(), /Good instinct/);
  assert.equal(await page.locator('#guessPins').getAttribute('aria-expanded'),'true');
  await page.evaluate(() => {window.auditQuizEvents=[];document.addEventListener('upskill-quiz-result',e=>window.auditQuizEvents.push(e.detail));});
  await page.locator('#quiz-submit').click();
  assert.match(await page.locator('#quiz-result').innerText(), /6 unanswered/);
  await page.evaluate(() => document.querySelectorAll('.quiz-question').forEach(q=>q.querySelector('input[value="'+q.dataset.answer+'"]').click()));
  await page.locator('#quiz-submit').click();
  assert.match(await page.locator('#quiz-result').innerText(), /6 \/ 6/);
  assert.deepEqual(await page.evaluate(()=>window.auditQuizEvents.at(-1)),{score:6,total:6});
  await page.locator('input[name="q1"][value="a"]').check();
  await page.locator('#quiz-submit').click();
  assert.match(await page.locator('#quiz-result').innerText(), /5 \/ 6/);
  assert.equal(await page.locator('.quiz-question.is-incorrect').count(),1);
  assert.equal(await page.locator('.quiz-question.is-correct').count(),5);
}
(async () => {
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  base='http://127.0.0.1:'+server.address().port;
  const browser = await chromium.launch();
  try {
    if (baseline) {
      for (const theme of ['light','dark']) {
        const session=await open(browser,390,base+ROUTE+'?baseline=1');
        try {
          await setTheme(session.page,theme);
          const result=await audit(session.page);
          result.hover=await hoverContrast(session.page,'#guessPallets');
          report.baseline.push(result);
          await session.page.screenshot({path:path.join(OUT,'baseline-'+theme+'-mobile.png'),fullPage:true});
        } finally {await session.context.close();}
      }
    }
    for(const width of [320,390,768,1440]) {
      for(const theme of ['light','dark']) {
        const name=theme+'-'+width;
        let session;
        await check(name+' loads with all 41 formulas and one progress card', async()=>{
          session=await open(browser,width,base+ROUTE); await setTheme(session.page,theme);
          const state=await audit(session.page);report.matrix.push(state);
          assert.equal(state.rendered,41);assert.equal(state.mathErrors,0);assert.equal(state.headings,30);
          assert.equal(state.headerCount,1);assert.equal(state.footerCount,1);assert.equal(state.progressCount,1);
          assert.ok(state.heroLabel);assert.deepEqual(session.errors,[]);
        });
        if(!session)continue;
        const page=session.page;
        try {
          await check(name+' preserves shared header/footer/navigation/progress styles',async()=>{
            const expected=await open(browser,width,base+ROUTE+'?chrome-control=1');
            try{await setTheme(expected.page,theme);assert.deepEqual(await chromeStyles(page),await chromeStyles(expected.page));}
            finally{await expected.context.close();}
          });
          await check(name+' all sliders, shuffles, toggle, disclosures and quiz states',()=>interactions(page));
          await check(name+' mobile containment and readable text/graphics',async()=>{
            await page.evaluate(()=>scrollTo(0,0));
            const result=await audit(page);fs.writeFileSync(path.join(OUT,name+'-layout.json'),JSON.stringify(result,null,2));
            assert.equal(result.documentOverflow,false);assert.deepEqual(result.outside,[]);
            assert.deepEqual(result.badContrast,[]);
            assert.ok(result.graphics.every(g=>g.ratio>=2.99),JSON.stringify(result.graphics.filter(g=>g.ratio<2.99)));
          });
          await check(name+' no serious/critical accessibility or contrast violations',async()=>{
            const results=await new AxeBuilder({page}).include('#lesson-content').include('#quiz').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
            fs.writeFileSync(path.join(OUT,name+'-axe.json'),JSON.stringify(results.violations,null,2));
            assert.deepEqual(results.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),[]);
          });
          await check(name+' buttons remain readable on hover and have keyboard focus',async()=>{
            for(const selector of ['#guessPallets','#guessPins']) {
              const contrast=await hoverContrast(page,selector);assert.ok(contrast.ratio>=4.49,selector+' '+JSON.stringify(contrast));
              await page.keyboard.press('Tab');await page.locator(selector).focus();
              const focus=await page.locator(selector).evaluate(e=>({width:getComputedStyle(e).outlineWidth,style:getComputedStyle(e).outlineStyle}));
              assert.ok(parseFloat(focus.width)>=2);assert.notEqual(focus.style,'none');
            }
          });
          await check(name+' sticky lesson navigation stays below site header',async()=>{
            await page.evaluate(()=>scrollTo(0,1200));await page.waitForTimeout(150);
            const r=await page.evaluate(()=>({header:document.querySelector('header.site').getBoundingClientRect().bottom,rail:document.querySelector('.progress-rail').getBoundingClientRect().top}));
            assert.ok(r.rail>=r.header-1,JSON.stringify(r));
          });
          await page.evaluate(()=>scrollTo(0,0));
          await page.screenshot({path:path.join(OUT,name+'-full.png'),fullPage:true});
          if(width===390||width===1440){for(const section of ['variance','together','implementation','quiz'])await page.locator('#'+section).screenshot({path:path.join(OUT,name+'-'+section+'.png')});}
        }finally{await session.context.close();}
      }
    }
    // Preview validation is explicit and fails rather than silently certifying a stale deployment.
    const preview=process.env.SPREAD_LAB_PREVIEW_URL;
    if(preview){
      await check('Netlify deploy preview contains the exact reviewed lesson',async()=>{
        let body='';
        for(let i=0;i<12;i++){const response=await fetch(preview+ROUTE);body=await response.text();if(body===html)break;await new Promise(r=>setTimeout(r,5000));}
        assert.equal(body,html,'Preview is missing, transformed, or not yet at the reviewed revision');
        report.preview={url:preview+ROUTE,sourceMatches:true,matrix:[]};
      });
      if(report.preview?.sourceMatches){for(const width of [390,1440])for(const theme of ['light','dark']){
        await check('Netlify '+theme+'-'+width+' rendered smoke test',async()=>{
          const session=await open(browser,width,preview+ROUTE);
          try{await setTheme(session.page,theme);const r=await audit(session.page);assert.equal(r.rendered,41);assert.equal(r.mathErrors,0);assert.equal(r.progressCount,1);assert.deepEqual(r.outside,[]);assert.deepEqual(r.badContrast,[]);report.preview.matrix.push({width,theme,pass:true});await session.page.screenshot({path:path.join(OUT,'preview-'+theme+'-'+width+'.png'),fullPage:true});}
          finally{await session.context.close();}
        });
      }}
    }
  }catch(e){report.failures.push('Fatal: '+e.stack);console.error(e);}
  finally{save();await browser.close();server.close();}
  if(report.failures.length)process.exitCode=1;
})();
