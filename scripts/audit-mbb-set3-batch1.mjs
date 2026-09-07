// Real-player audit. Only canonical Q1–25 are semantically reviewed.
// Authentication and remote persistence are isolated fixtures; no learner account is used.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {chromium,webkit} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const require=createRequire(import.meta.url);
const {emptyClient}=require('../tests/helpers/test-bank-durable-learning.js');
const root=process.cwd(),out=path.join(root,'audit-results');fs.mkdirSync(out,{recursive:true});
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('test-bank-mbb-set3.js','utf8'),sandbox);
const questions=JSON.parse(JSON.stringify(sandbox.window.MBB_SET3)).slice(0,25);
const report={scope:'Canonical Set 3 Q1–25',backend:'isolated authentication and remote-persistence fixture',cases:[],failures:[],pageErrors:[]};
const save=()=>fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify(report,null,2));
const server=http.createServer((req,res)=>{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!path.extname(p))p+='.html';const f=path.resolve(root,'.'+p);if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const auth='window.UpskillAuth={isConfigured:()=>true,onChange:(cb)=>{queueMicrotask(()=>cb({id:"audit-set3-isolated"}));return ()=>{};},getUser:()=>({id:"audit-set3-isolated"}),getClient:()=>('+emptyClient.toString()+')()};';
async function geometry(page,selector){return page.locator(selector).evaluate(host=>{
  const clipped=[...host.querySelectorAll('.tb-stem,.tb-review-stem,.tb-opt,.tb-answer-copy,.tb-explanation-copy,th,td,dd')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>({tag:e.tagName,text:e.textContent.slice(0,90),scroll:e.scrollWidth,width:e.clientWidth}));
  const svgText=[...host.querySelectorAll('svg text')].map(t=>{const a=t.getBoundingClientRect(),s=t.closest('svg').getBoundingClientRect();return {text:t.textContent,outside:a.left<s.left-2||a.right>s.right+2||a.top<s.top-2||a.bottom>s.bottom+2};}).filter(x=>x.outside);
  return {pageOverflow:document.documentElement.scrollWidth>innerWidth+2,clipped,svgText,questionTop:host.getBoundingClientRect().top,selectedAnnounced:[...host.querySelectorAll('.tb-opt')].every(b=>b.hasAttribute('aria-pressed')||b.hasAttribute('aria-checked'))};
});}
try{
for(const engine of ['chromium','webkit']){
 const browser=await ({chromium,webkit}[engine]).launch();
 for(const layout of ['desktop','mobile']){
  const viewport=layout==='desktop'?{width:1440,height:1000}:{width:390,height:844};
  const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:layout==='mobile',hasTouch:layout==='mobile',colorScheme:'light'});
  const page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>report.pageErrors.push({engine,layout,message:e.message}));
  await page.route('**/auth.js',r=>r.fulfill({body:auth,contentType:'text/javascript'}));
  await page.route(/https:\/\/[^/]*supabase\.[^/]+\/.*/,r=>r.fulfill({body:'[]',contentType:'application/json'}));
  await page.addInitScript(auth);
  try{
   await page.goto(base+'/test-bank.html',{waitUntil:'load'});await page.waitForFunction(()=>window.__TB&&window.__TBLearning);
   await page.evaluate(auth);await page.evaluate(async()=>{await __TBLearning.sync('test-hydrate');await new Promise(r=>setTimeout(r,0));const start=__TBLearning.startSession;__TBLearning.startSession=function(c){window.__AUDIT_ORDER=c.questions.map(q=>q.qid);return start.call(this,c);};});
   await page.locator('.tb-tile[data-exam="mbb"]').click();await page.locator('.tb-setpick [data-set="3"]').click();await page.locator('[data-mode="full"]').click();
   await page.locator('.tb-quiz').waitFor();const order=await page.evaluate(()=>__AUDIT_ORDER);assert.equal(order.length,175);assert.equal(await page.locator('.tb-navcell').count(),175);assert.ok(await page.locator('#tb-timer').isVisible());
   for(let i=0;i<questions.length;i++){
    const q=questions[i],index=order.indexOf(q.qid),label=engine+'-'+layout+'-q'+String(i+1).padStart(2,'0');
    assert.ok(index>=0);await page.locator('[data-goto="'+index+'"]').click();await page.waitForFunction(id=>document.querySelector('.tb-quiz')?.dataset.questionId===id,q.qid);
    assert.equal((await page.locator('.tb-stem').innerText()).trim(),q.stem);
    for(let choice=0;choice<4;choice++){
      const option=page.locator('.tb-opt[data-opt="'+choice+'"]');assert.ok((await option.innerText()).includes(q.options[choice]));
      if(choice===1){await option.focus();await page.keyboard.press('Space');}else await option.click();
      assert.equal(await page.locator('.tb-opt.sel').getAttribute('data-opt'),String(choice));
    }
    await page.locator('.tb-opt[data-opt="'+q.answer+'"]').click();
    if(i===0){await page.locator('[data-flag]').click();assert.ok(await page.locator('[data-flag].on').isVisible());}
    // Reopen after navigating away to another audited item; validate persisted selection.
    const other=order.indexOf(questions[(i+1)%25].qid);await page.locator('[data-goto="'+other+'"]').click();await page.locator('[data-goto="'+index+'"]').click();
    assert.equal(await page.locator('.tb-opt.sel').getAttribute('data-opt'),String(q.answer));
    const navigation=await geometry(page,'.tb-quiz');
    for(const theme of ['light','dark']){
      await page.evaluate(t=>{document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;},theme);
      await page.locator('.tb-quiz').scrollIntoViewIfNeeded();await page.locator('.tb-quiz').screenshot({path:path.join(out,label+'-'+theme+'.png')});
      const g=await geometry(page,'.tb-quiz');const axe=await new AxeBuilder({page}).include('.tb-quiz').withTags(['wcag2a','wcag2aa']).analyze();
      report.cases.push({engine,layout,theme,number:i+1,qid:q.qid,phase:'question',fourChoicesSelected:true,keyboardSpace:true,reopenedSelection:true,geometry:g,navigation,axe:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});save();
    }
    if(i===2){for(const name of ['calc','formulas','tables']){await page.locator('[data-'+name+']').click();assert.ok(await page.locator('#tb-'+name).isVisible());await page.locator('[data-close="'+name+'"]').click();}}
   }
   // Full-session result calculation: audited 25 correct, the 150 unaudited items deliberately unanswered.
   await page.locator('[data-goto="174"]').click();await page.locator('[data-submit]').click();await page.locator('#tb-answer-review').waitFor();
   assert.match(await page.locator('.tb-resverd').innerText(),/25 of 175 correctly/);
   await page.locator('[data-review-tab="all"]').click();
   for(let i=0;i<questions.length;i++){
    const q=questions[i],index=order.indexOf(q.qid);await page.locator('[data-review-goto="'+index+'"]').click();
    const card=page.locator('.tb-review-card');assert.equal(await card.getAttribute('data-question-id'),q.qid);assert.equal(await card.getAttribute('data-review-status'),'correct');
    assert.equal((await card.locator('.tb-explanation-copy').innerText()).trim(),q.why);
    const copy=await card.innerText();const rationales=q.optionRationales.map(r=>copy.includes(r));
    for(const theme of ['light','dark']){
      await page.evaluate(t=>{document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;},theme);
      await card.screenshot({path:path.join(out,engine+'-'+layout+'-q'+String(i+1).padStart(2,'0')+'-review-'+theme+'.png')});
      const axe=await new AxeBuilder({page}).include('.tb-review-card').withTags(['wcag2a','wcag2aa']).analyze();
      report.cases.push({engine,layout,theme,number:i+1,qid:q.qid,phase:'review',status:'correct',rationales,geometry:await geometry(page,'.tb-review-card'),axe:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});save();
    }
   }
   report.cases.push({engine,layout,phase:'session',result:'25/175',auditedQuestions:25,untouchedUnanswered:150,flagPersisted:true});
  }catch(e){report.failures.push({engine,layout,error:e.stack});await page.screenshot({path:path.join(out,engine+'-'+layout+'-failure.png'),fullPage:true}).catch(()=>{});fs.writeFileSync(path.join(out,engine+'-'+layout+'-failure.html'),await page.content());save();}
  finally{await context.close();}
 }
 await browser.close();
}
}finally{server.close();save();}
if(report.failures.length)process.exitCode=1;
console.log(JSON.stringify({cases:report.cases.length,failures:report.failures,pageErrors:report.pageErrors},null,2));
