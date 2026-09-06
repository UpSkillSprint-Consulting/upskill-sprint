/* Presentation/behavior validation: original teaching content is the fixed baseline. */
'use strict';
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const assert = require('node:assert/strict'), cp = require('node:child_process'), crypto = require('node:crypto');
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const ROOT = process.cwd(), SLUG = 'signal-or-noise-arl-nelson-rules-control-limit-design';
const FILE = 'lessons/lean-six-sigma/' + SLUG + '.html', ROUTE = '/' + FILE.replace(/\.html$/, '');
const OUT = path.join(ROOT, 'artifacts/signal-noise');
const html = fs.readFileSync(FILE, 'utf8');
const original = cp.execFileSync('git', ['show', 'ddad4f1900392b2d250d0df8b8902dcb543f208d:' + FILE], {encoding:'utf8'});
fs.mkdirSync(OUT, {recursive:true});
const report = {revision:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(), cases:[], failures:[], matrix:[], baseline:{}, preview:null};
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
function save() {
 fs.writeFileSync(path.join(OUT,'report.json'), JSON.stringify(report,null,2));
 fs.writeFileSync(path.join(OUT,'SUMMARY.md'), '# Signal or Noise validation\n\nRevision: '+report.revision+'\n\nPassed checks: '+report.cases.filter(c=>c.pass).length+'\n\nFailures: '+report.failures.length+'\n\n'+report.cases.map(c=>(c.pass?'PASS ':'FAIL ')+c.name+(c.error?' — '+c.error:'')).join('\n'));
}
async function check(name,fn) {try{await fn();report.cases.push({name,pass:true});console.log('PASS',name);}catch(e){report.cases.push({name,pass:false,error:e.message});report.failures.push(name+': '+e.message);console.error('FAIL',name,e.message);}save();}
const control = html.replace(/<style id="signal-noise-style">[\s\S]*?<\/style>/,'').replace(/<style id="signal-noise-dark-overrides">[\s\S]*?<\/style>/,'');
const server = http.createServer((req,res)=>{
 const u = new URL(req.url,'http://localhost');let name=decodeURIComponent(u.pathname);if(!path.extname(name))name+='.html';
 const file=path.resolve(ROOT,'.'+name);if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 let body=fs.readFileSync(file);if(name==='/'+FILE)body=u.searchParams.has('baseline')?original:u.searchParams.has('control')?control:html;
 const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'};
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(body);
});
async function open(browser,width,theme,url){
 const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
 await context.addInitScript(t=>{localStorage.setItem('upskill-theme',t);let seed=42;Math.random=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);window.quizEvents=[];document.addEventListener('upskill-quiz-result',e=>window.quizEvents.push(e.detail));},theme);
 await context.addInitScript(()=>{
   window.lessonDrawingBounds={};
   for(const method of ['clearRect','moveTo','lineTo','arc']){
     const original=CanvasRenderingContext2D.prototype[method];
     CanvasRenderingContext2D.prototype[method]=function(...args){
       const id=this.canvas.id;
       if(id==='cusumCanvas'||id.startsWith('spark-')){
         if(method==='clearRect')window.lessonDrawingBounds[id]={minX:Infinity,minY:Infinity,maxX:-Infinity,maxY:-Infinity,width:this.canvas.width,height:this.canvas.height};
         else {const r=method==='arc'?args[2]:0,b=window.lessonDrawingBounds[id];if(b){b.minX=Math.min(b.minX,args[0]-r);b.minY=Math.min(b.minY,args[1]-r);b.maxX=Math.max(b.maxX,args[0]+r);b.maxY=Math.max(b.maxY,args[1]+r);}}
       }
       return original.apply(this,args);
     };
   }
 });
 const page=await context.newPage(), errors=[];page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url,{waitUntil:'load',timeout:60000});await page.waitForSelector('#lesson-progress-widget',{timeout:30000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);
 return {context,page,errors};
}
async function chrome(page){return page.evaluate(()=>{
 const selectors=['body','header.site','header.site .brand','header.site .brand span','.desktop-nav','.desktop-nav a','.theme-control','.theme-toggle','footer.site','footer.site .wrap','footer.site .brand span','.footer-grid','.footer-bottom','#lesson-progress-widget','#lesson-progress-widget .lp-card','#lesson-progress-widget p','#lesson-progress-widget a'];
 const props=['color','backgroundColor','fontFamily','fontSize','fontWeight','lineHeight','paddingTop','paddingRight','paddingBottom','paddingLeft','maxWidth','gap','display','opacity'];
 return Object.fromEntries(selectors.map(sel=>{const e=document.querySelector(sel);if(!e)return[sel,null];const c=getComputedStyle(e);return[sel,Object.fromEntries(props.map(p=>[p,c[p]]))];}));
});}
async function layout(page){return page.evaluate(()=>{
 function scroller(e){for(let n=e.parentElement;n&&n.id!=='lesson-content'&&n.id!=='quiz';n=n.parentElement){const c=getComputedStyle(n),r=n.getBoundingClientRect();if(['auto','scroll'].includes(c.overflowX)&&r.left>=-1&&r.right<=innerWidth+1)return true;}return false;}
 const outside=[...document.querySelectorAll('#lesson-content *,#quiz *')].filter(e=>{if(!e.getClientRects().length||e instanceof SVGElement)return false;const r=e.getBoundingClientRect();return r.width>0&&(r.left < -2||r.right>innerWidth+2)&&!scroller(e);}).slice(0,12).map(e=>({id:e.id,tag:e.tagName,cls:e.className,text:e.textContent.slice(0,70)}));
 const head=document.querySelector('header.site').getBoundingClientRect(), nav=document.querySelector('nav.toc').getBoundingClientRect(),part=document.querySelector('section.part.active');
 return{width:innerWidth,theme:document.documentElement.dataset.theme,part:part.id,overflow:document.documentElement.scrollWidth>innerWidth+1,outside,headingTop:part.querySelector('h2').getBoundingClientRect().top,headerBottom:head.bottom,navTop:nav.top,navBottom:nav.bottom,headers:document.querySelectorAll('header.site').length,footers:document.querySelectorAll('footer.site').length,progress:document.querySelectorAll('#lesson-progress-widget').length};
});}
async function contrasts(page){return page.evaluate(()=>{
 const rgb=s=>{const v=s.match(/[\d.]+/g)?.map(Number)||[0,0,0];return[v[0],v[1],v[2],v.length>3?v[3]:1];};
 const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>{const v=[lum(a),lum(b)].sort((a,b)=>a-b);return(v[1]+.05)/(v[0]+.05);};
 function bg(e){const a=[];for(let n=e;n;n=n.parentElement){const c=rgb(getComputedStyle(n).backgroundColor);a.push(c);if(c[3]===1)break;}return a.reverse().reduce((b,c)=>c.slice(0,3).map((v,i)=>v*c[3]+b[i]*(1-c[3])),[255,255,255]);}
 const selectors='#lesson-content button,#lesson-content select,#lesson-content .math span,#lesson-content .readout,#lesson-content .tag,#quiz .lesson-kicker,#quiz .quiz-actions button,#signal-noise-return a';
 const failures=[...document.querySelectorAll(selectors)].filter(e=>e.getClientRects().length&&e.textContent.trim()).map(e=>({id:e.id,cls:e.className,text:e.textContent.slice(0,60),ratio:ratio(rgb(getComputedStyle(e).color),bg(e))})).filter(x=>x.ratio<4.49);
 for(const e of document.querySelectorAll('#lesson-content input[type=range],#lesson-content select')){
   if(!e.getClientRects().length)continue;
   const c=getComputedStyle(e),border=e.tagName==='SELECT';
   const control=rgb(border?c.borderTopColor:c.backgroundColor);
   const contrast=ratio(control,bg(e.parentElement));
   if(contrast<2.99)failures.push({id:e.id,type:'control-boundary',ratio:contrast});
   if(border){const inner=ratio(control,bg(e));if(inner<2.99)failures.push({id:e.id,type:'inner-control-boundary',ratio:inner});}
 }
 return failures;
});}
async function axe(page,name){const r=await new AxeBuilder({page}).include('#lesson-content').include('#quiz').include('#signal-noise-return').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();fs.writeFileSync(path.join(OUT,name+'-axe.json'),JSON.stringify(r.violations,null,2));assert.deepEqual(r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),[]);}
async function range(page,id,value){await page.locator('#'+id).fill(String(value));await page.locator('#'+id).dispatchEvent('input');}
async function part(page,id){await page.locator('nav.toc button[data-target="'+id+'"]').click();await page.waitForTimeout(80);assert.equal(await page.locator('section.part.active').getAttribute('id'),id);}
async function snapshot(page){return page.evaluate(()=>({headings:[...document.querySelectorAll('#lesson-content h1,#lesson-content h2,#lesson-content h3,#lesson-content h4,#quiz h2,#quiz h3')].map(e=>e.textContent),main:document.querySelector('#lesson-content').textContent,quiz:document.querySelector('#quiz').textContent,formulas:[...document.querySelectorAll('#lesson-content .math')].map(e=>e.textContent),rules:document.querySelectorAll('#testCards .test-card').length,selfChecks:document.querySelectorAll('#selfCheckQuiz .quiz-item').length}));}
async function drawingBounds(page){return page.evaluate(()=>Object.entries(window.lessonDrawingBounds).filter(([id,b])=>b.minX < -1 || b.minY < -1 || b.maxX > b.width+1 || b.maxY > b.height+1));}
async function commonInputs(page){await page.evaluate(()=>{document.getElementById('shiftSlider').value='1.5';document.getElementById('limitSelect').value='3';document.getElementById('cusumShiftSlider').value='0.5';updateBoth();updateCusumPair();});}
const injected=/<div data-netlify-deploy-id="[a-f0-9]{24}" data-netlify-site-id="82c1a97f-bb8d-4e7b-8367-fe93d7ce1657" data-vcs="github" style="position:fixed">\s*<script async src="\/\.netlify\/scripts\/cdp"><\/script>\s*<\/div>\n(?=<\/body>)/g;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch();
 try{
  await check('Rendered teaching content and all formulas match the original at common inputs',async()=>{
   const a=await open(browser,1440,'light',base+ROUTE+'?baseline'),b=await open(browser,1440,'light',base+ROUTE);
   try{await commonInputs(a.page);await commonInputs(b.page);const x=await snapshot(a.page),y=await snapshot(b.page);report.baseline={headings:x.headings.length,rules:x.rules,selfChecks:x.selfChecks,formulas:x.formulas.length,mainCharacters:x.main.length,quizCharacters:x.quiz.length,mainHash:hash(x.main),quizHash:hash(x.quiz)};assert.deepEqual(y,x);}finally{await a.context.close();await b.context.close();}
  });
  for(const theme of ['light','dark']) for(const width of [320,390,768,1440]){
   const tag=theme+'-'+width, {context,page,errors}=await open(browser,width,theme,base+ROUTE);
   try{
    await check(tag+' protected site chrome',async()=>{const c=await open(browser,width,theme,base+ROUTE+'?control');try{assert.deepEqual(await chrome(page),await chrome(c.page));}finally{await c.context.close();}assert.equal(await page.locator('#lesson-progress-widget').count(),1);});
    await check(tag+' default slider values match readouts',async()=>{for(const [id,label] of [['shiftSlider','shiftVal'],['cusumShiftSlider','cusumShiftVal'],['nPoints','nPointsVal']])assert.equal(Number(await page.locator('#'+id).inputValue()),parseFloat(await page.locator('#'+label).innerText()),id);});
    for(const id of ['p1','p2','p3','p4','p5','p6']){
     await part(page,id);
     await check(tag+' '+id+' layout, focus and sticky clearance',async()=>{const r=await layout(page);report.matrix.push(r);assert.equal(r.overflow,false);assert.deepEqual(r.outside,[]);assert(r.headingTop>=r.navBottom-1,'Heading hidden under navigation');assert(r.navTop>=r.headerBottom-1,'Lesson nav covers site header');assert.equal(r.headers,1);assert.equal(r.footers,1);assert.equal(r.progress,1);if(id==='p6'){const heights=await page.locator('#p6 tr').evaluateAll(rows=>rows.map(e=>e.getBoundingClientRect().height));assert(heights.every(h=>h<260),'Software table rows are excessively tall: '+heights.join(','));}assert.equal(await page.locator('nav.toc [aria-current="step"]').getAttribute('data-target'),id);});
     await check(tag+' '+id+' text contrast and accessibility',async()=>{assert.deepEqual(await contrasts(page),[]);await axe(page,tag+'-'+id);});
     if(width===390||width===1440){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(OUT,tag+'-'+id+'-full.png'),fullPage:true});}
    }
    await check(tag+' calculator, both limits and random resampling',async()=>{await part(page,'p1');for(const lim of ['2','3']){await page.locator('#limitSelect').selectOption(lim);for(const shift of [0,1.5,4]){await range(page,'shiftSlider',shift);assert.equal(parseFloat(await page.locator('#shiftVal').innerText()),shift);assert.match(await page.locator('#arlMath').innerText(),/ARL₁ =/);}}const before=await page.locator('#runCanvas').evaluate(e=>e.toDataURL());await page.locator('#resampleRun').click();assert.notEqual(await page.locator('#runCanvas').evaluate(e=>e.toDataURL()),before);});
    await check(tag+' eight Nelson derivations',async()=>{await part(page,'p2');const buttons=page.locator('#testCards .derive-toggle');assert.equal(await buttons.count(),8);for(const b of await buttons.all()){await b.click();assert.equal(await b.getAttribute('aria-expanded'),'true');await b.click();assert.equal(await b.getAttribute('aria-expanded'),'false');}});
    await check(tag+' simulation endpoints and clear',async()=>{await part(page,'p3');for(const n of [50,1000]){await range(page,'nPoints',n);await page.locator('#runSim').click();const a=Number(await page.locator('#stat2').innerText()),b=Number(await page.locator('#stat3').innerText());assert(a>=b&&a<=n&&b>=0);}await page.locator('#clearSim').click();assert.equal(await page.locator('#stat3').innerText(),'0');assert.equal(await page.locator('#stat2').innerText(),'0');assert.equal(await page.locator('#statRatio').innerText(),'—');});
    await check(tag+' CUSUM endpoints and resampling',async()=>{await part(page,'p4');for(const x of [0,0.75,3]){await range(page,'cusumShiftSlider',x);assert.equal(parseFloat(await page.locator('#cusumShiftVal').innerText()),x);assert.deepEqual(await drawingBounds(page),[]);}const before=await page.locator('#cusumCanvas').evaluate(e=>e.toDataURL());await page.locator('#resampleCusum').click();assert.notEqual(await page.locator('#cusumCanvas').evaluate(e=>e.toDataURL()),before);});
    await check(tag+' five self-check disclosures',async()=>{await part(page,'p5');const buttons=page.locator('#selfCheckQuiz .quiz-q');assert.equal(await buttons.count(),5);for(const b of await buttons.all()){await b.click();assert.equal(await b.getAttribute('aria-expanded'),'true');await b.click();assert.equal(await b.getAttribute('aria-expanded'),'false');}});
    await check(tag+' quiz unanswered, correct and incorrect feedback',async()=>{await page.locator('#quiz-submit').click();assert.equal(await page.locator('#quiz .quiz-feedback.warn').count(),6);for(const correct of [true,false]){await page.evaluate(c=>document.querySelectorAll('#quiz .quiz-question').forEach(q=>{const inputs=[...q.querySelectorAll('input')];inputs.find(i=>(i.value===q.dataset.answer)===c).checked=true;}),correct);await page.locator('#quiz-submit').click();assert.match(await page.locator('#quiz-result').innerText(),correct?/Score: 6 \/ 6/:/Score: 0 \/ 6/);assert.deepEqual(await page.evaluate(()=>window.quizEvents.at(-1)),{score:correct?6:0,total:6});await axe(page,tag+'-quiz-'+correct);}if(width===390||width===1440)await page.locator('#quiz').screenshot({path:path.join(OUT,tag+'-quiz.png')});});
    await check(tag+' keyboard access and theme switch',async()=>{await part(page,'p1');const slider=page.locator('#shiftSlider');await slider.focus();await page.keyboard.press('ArrowLeft');assert(await slider.evaluate(e=>getComputedStyle(e).outlineStyle!=='none'&&parseFloat(getComputedStyle(e).outlineWidth)>=2));await page.locator('[data-theme-toggle]').click();assert.equal(await page.locator('html').getAttribute('data-theme'),theme==='dark'?'light':'dark');await page.locator('[data-theme-toggle]').click();assert.equal(await page.locator('html').getAttribute('data-theme'),theme);});
    await check(tag+' diagram containment, deep links and section buttons',async()=>{
      await part(page,'p2');assert.deepEqual(await drawingBounds(page),[]);
      if(width===390||width===1440)await page.locator('#testCards .test-card').first().screenshot({path:path.join(OUT,tag+'-outlier-detail.png')});
      await part(page,'p4');for(const shift of [0,0.75,1.5,3]){await range(page,'cusumShiftSlider',shift);for(let i=0;i<8;i++){await page.locator('#resampleCusum').click();assert.deepEqual(await drawingBounds(page),[]);}}
      if(width===390||width===1440)await page.locator('#p4 .card').screenshot({path:path.join(OUT,tag+'-cusum-shift3.png')});
      await page.locator('#p4 .nav-btns button').last().click();assert.equal(await page.locator('section.part.active').getAttribute('id'),'p5');
      await page.evaluate(()=>{location.hash='p6';});await page.waitForTimeout(100);assert.equal(await page.locator('section.part.active').getAttribute('id'),'p6');
    });
    await check(tag+' no JavaScript errors',async()=>assert.deepEqual(errors,[]));
   }finally{await context.close();}
  }
  const preview=process.env.SIGNAL_NOISE_PREVIEW_URL;
  if(preview)await check('Actual Netlify preview source and desktop/mobile themes',async()=>{
   let response,body;for(let i=0;i<24;i++){try{response=await fetch(preview+ROUTE,{signal:AbortSignal.timeout(15000)});body=await response.text();if(response.ok&&body.replace(injected,'')===html)break;}catch(e){report.preview={error:e.message};}await new Promise(r=>setTimeout(r,10000));}
   assert(response?.ok,'Preview did not respond successfully');fs.writeFileSync(path.join(OUT,'preview-response.html'),body);assert.equal(hash(body.replace(injected,'')),hash(html),'Preview does not match the reviewed source');report.preview={url:preview+ROUTE,sourceMatches:true};
   for(const theme of ['light','dark'])for(const width of [390,1440]){const {context,page,errors}=await open(browser,width,theme,preview+ROUTE);try{await part(page,'p2');assert.deepEqual((await layout(page)).outside,[]);await part(page,'p4');await page.locator('#resampleCusum').click();await part(page,'p1');await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:path.join(OUT,'preview-'+theme+'-'+width+'.png'),fullPage:true});assert.deepEqual(errors,[]);}finally{await context.close();}}
  });
 }finally{await browser.close();server.close();save();}
 if(report.failures.length)process.exitCode=1;
})().catch(e=>{report.failures.push(e.stack);save();console.error(e);server.close();process.exitCode=1;});
