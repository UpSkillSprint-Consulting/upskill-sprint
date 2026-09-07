/* Regressions for PR170: print/theme atomicity and real keyboard scrolling.
   No production account, data writes, forced clicks, or synthetic key dispatch. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium,webkit}=require('playwright');
const read=p=>fs.readFileSync(path.resolve(p),'utf8');
const out=path.resolve('artifacts/pr170-rendering');fs.mkdirSync(out,{recursive:true});
const engine=process.env.AUDIT_ENGINE||'chromium',records=[];
const styles=read('style.css'),fixes=read('dmaic-encyclopedia-fixes.css');
const playerStyles=read('test-bank.html').match(/<style>([\s\S]*?)<\/style>/)[1];
const rgb=s=>(s.match(/[\d.]+/g)||[]).map(Number).slice(0,3);
const lum=a=>a.map(v=>(v/=255)<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
function contrast(a,b){const x=[lum(rgb(a)),lum(rgb(b))].sort((a,b)=>a-b);return (x[1]+.05)/(x[0]+.05);}
(async()=>{
 const browser=await ({chromium,webkit}[engine]).launch(process.env.BROWSER_EXECUTABLE_PATH?{executablePath:process.env.BROWSER_EXECUTABLE_PATH}:{});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  for(const theme of ['light','dark']){
   await page.emulateMedia({media:'screen'});
   await page.setContent('<!doctype html><html data-theme="'+(theme==='light'?'dark':'light')+'"><head><style>'+styles+'</style><style>'+fixes+'</style></head><body class="dmaic-encyclopedia-page"><main data-dmaic-encyclopedia><span class="formula-id">P01</span><span class="phase-icon">D</span></main></body></html>');
   // Stretch the actual body transition to make an interrupted transition
   // deterministic; the product print rule must win without sleeping it away.
   await page.addStyleTag({content:'body.dmaic-encyclopedia-page{transition:background-color 30s linear,color 30s linear}'});
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   await page.evaluate(t=>{document.documentElement.dataset.theme=t;void document.body.offsetWidth;},theme);
   await page.emulateMedia({media:'print'});
   const palette=await page.evaluate(()=>({paper:getComputedStyle(document.body).backgroundColor,transition:getComputedStyle(document.body).transitionProperty,badges:[...document.querySelectorAll('.formula-id,.phase-icon')].map(e=>({color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor}))}));
   assert.equal(palette.paper,'rgb(255, 255, 255)');assert.equal(palette.transition,'none');
   palette.badges.forEach(b=>{assert.equal(b.color,'rgb(0, 0, 0)');assert.equal(b.background,'rgb(255, 255, 255)');});
   records.push({kind:'immediate-print',engine,from:theme,...palette});
  }
  await page.emulateMedia({media:'screen'});
  await page.setContent('<!doctype html><html data-theme="light"><head><style>'+styles+'</style><style>'+playerStyles+'</style></head><body><button class="tb-backsim">Back to Exam Simulator</button></body></html>');
  await page.addScriptTag({content:read('test-bank-feedback-loop.js')});
  for(let i=0;i<20;i++){
   const theme=i%2?'light':'dark';
   const palette=await page.evaluate(t=>{document.documentElement.dataset.theme=t;const s=getComputedStyle(document.querySelector('.tb-backsim'));return {color:s.color,background:s.backgroundColor,transition:s.transitionProperty};},theme);
   assert.equal(palette.transition,'none');assert.ok(contrast(palette.color,palette.background)>=4.5,JSON.stringify(palette));
   records.push({kind:'immediate-back-button',engine,theme,contrast:contrast(palette.color,palette.background)});
  }
  await page.close();
  for(const width of [320,390,1440]){
   const p=await browser.newPage({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600});
   await p.setContent('<!doctype html><html data-theme="light"><head><style>'+styles+'</style></head><body><main id="fixture" style="max-width:800px;padding:12px"></main><div style="height:2000px"></div></body></html>');
   await p.addScriptTag({content:read('test-bank-mbb-set3.js')});
   await p.addScriptTag({content:read('test-bank-mbb-set3-batch6-ui.js')});
   const ids=await p.evaluate(()=>MBB_SET3.slice(125,150).filter(q=>q.chart).map(q=>q.qid));assert.equal(ids.length,8);
   for(const review of [false,true])for(const qid of ids){
    await p.evaluate(({qid,review})=>{document.getElementById('fixture').innerHTML=__MBBSet3Batch6UI.render(MBB_SET3.find(q=>q.qid===qid),review);},{qid,review});
    const regions=p.locator('.mbbs3b6-scroll');
    for(let i=0;i<await regions.count();i++){
     const region=regions.nth(i);
     await region.scrollIntoViewIfNeeded();await region.focus();
     const max=await region.evaluate(e=>e.scrollWidth-e.clientWidth);
     if(max>2){
      await region.press('ArrowRight');assert.equal(await region.evaluate(e=>e.scrollLeft),Math.min(40,max));
      await region.press('End');assert.equal(await region.evaluate(e=>e.scrollLeft),max);
      await region.press('ArrowLeft');assert.equal(await region.evaluate(e=>e.scrollLeft),Math.max(0,max-40));
      await region.press('Home');assert.equal(await region.evaluate(e=>e.scrollLeft),0);
     }
     records.push({kind:'keyboard-region',engine,width,qid,review,region:i,overflow:max>2,keys:max>2?['ArrowRight','End','ArrowLeft','Home']:[]});
    }
   }
   await p.close();
  }
  fs.writeFileSync(path.join(out,engine+'.json'),JSON.stringify({passed:true,engine,records},null,2));
  console.log(JSON.stringify({passed:true,engine,records:records.length,print:records.filter(r=>r.kind==='immediate-print').length,themeSwitches:20,scrollRegions:records.filter(r=>r.kind==='keyboard-region').length}));
 }catch(error){fs.writeFileSync(path.join(out,engine+'.json'),JSON.stringify({passed:false,engine,error:error.stack,records},null,2));throw error;}
 finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
