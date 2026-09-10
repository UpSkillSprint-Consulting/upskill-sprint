'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const ROOT=path.resolve(__dirname,'../..');
const playwrightRoot=process.env.SEG17_PLAYWRIGHT_PATH;
const axePath=process.env.SEG17_AXE_PATH;
if(!playwrightRoot||!axePath)throw new Error('SEG17_PLAYWRIGHT_PATH and SEG17_AXE_PATH are required');
const playwright=require(playwrightRoot);
const axeSource=fs.readFileSync(axePath,'utf8');
const engine=process.env.SEG17_ENGINE||'chromium';
const browserType=playwright[engine];if(!browserType)throw new Error('Unsupported browser '+engine);
const viewports=[{name:'phone-320',width:320,height:720},{name:'phone-390',width:390,height:844},{name:'tablet-820',width:820,height:1180},{name:'desktop-1440',width:1440,height:1000}];
let server,browser,base;
function contentType(file){return ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]||'application/octet-stream';}
async function main(){
  const checks=[];
  server=http.createServer((req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(p==='/')p='/test-bank.html';const file=path.resolve(ROOT,'.'+p);if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.setHeader('content-type',contentType(file));res.end(fs.readFileSync(file));}catch(error){res.writeHead(500);res.end(String(error));}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
  browser=await browserType.launch();
  for(const viewport of viewports){
    const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},colorScheme:'light',reducedMotion:'reduce'});
    const page=await context.newPage();page.setDefaultTimeout(15000);
    const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
    await page.goto(base+'/test-bank.html',{waitUntil:'load'});
    await page.addScriptTag({path:path.join(ROOT,'test-bank-ux-accessibility.js')});
    await page.addScriptTag({content:axeSource});
    await page.waitForFunction(()=>window.__TBUXAccessibility&&document.getElementById('tb-a11y-status'));
    const overflow=await page.evaluate(()=>{const root=document.documentElement,client=root.clientWidth,offenders=[];for(const el of document.querySelectorAll('body *')){const r=el.getBoundingClientRect();if(r.right>client+1||r.left<-1)offenders.push({tag:el.tagName,id:el.id||'',class:String(el.className||'').slice(0,100),left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth});if(offenders.length>=12)break;}return{scroll:root.scrollWidth,client,offenders};});
    if(overflow.scroll>overflow.client+1)console.error('OVERFLOW_DIAGNOSTIC '+JSON.stringify({viewport:viewport.name,...overflow}));
    assert.ok(overflow.scroll<=overflow.client+1,`${viewport.name}: horizontal overflow ${overflow.scroll}>${overflow.client}`);checks.push(viewport.name+': no horizontal page overflow');
    const unnamed=await page.evaluate(()=>Array.from(document.querySelectorAll('button,a[href],[role="button"],[role="tab"],input,select,textarea')).filter(el=>{if(el.closest('[hidden]'))return false;const name=(el.getAttribute('aria-label')||el.getAttribute('title')||el.textContent||el.value||'').trim();return !name;}).map(el=>el.outerHTML.slice(0,160)));
    assert.deepEqual(unnamed,[],viewport.name+': unnamed interactive controls');checks.push(viewport.name+': interactive controls have accessible names');
    const focusable=page.locator('button:not([disabled]),a[href],[role="button"][tabindex="0"],input:not([disabled]),select:not([disabled]),textarea:not([disabled])').first();
    if(await focusable.count()){await page.keyboard.press('Tab');const focused=await page.evaluate(()=>document.activeElement!==document.body&&document.activeElement!==document.documentElement);assert.equal(focused,true);checks.push(viewport.name+': keyboard Tab reaches a control');}
    const axe=await page.evaluate(async()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']},rules:{'color-contrast':{enabled:true}}}));
    const serious=axe.violations.filter(v=>v.impact==='critical'||v.impact==='serious');
    assert.deepEqual(serious.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,help:v.help})),[],viewport.name+': serious/critical axe violations');checks.push(viewport.name+': axe WCAG A/AA serious+critical gate passed');
    const aria=await page.locator('body').ariaSnapshot();assert.match(aria,/button|link|heading/i,viewport.name+': accessibility tree should expose semantic controls');checks.push(viewport.name+': ARIA tree exposes semantic structure');
    assert.deepEqual(pageErrors,[],viewport.name+': page errors');
    await context.close();
  }
  console.log(JSON.stringify({status:'passed',engine,tests:checks.length,checks},null,2));
}
main().catch(e=>{console.error(e&&e.stack||e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));});
