// Full-session student audit. Only authentication and remote persistence are fixtures.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import runtime from './lib/student-audit-runtime.cjs';
const {bounded,analyzeSingleDocument,verifyCoverage}=runtime;
const tools=createRequire(path.join(process.env.AUDIT_TOOLS_DIR||process.cwd(),'package.json'));
const {chromium,webkit}=tools('playwright');
const axeModule=tools('@axe-core/playwright');
const AxeBuilder=axeModule.default||axeModule;
const require=createRequire(import.meta.url);
const {emptyClient}=require('../tests/helpers/test-bank-durable-learning.js');
const root=process.cwd(),out=path.join(root,process.env.AUDIT_OUT||'audit-results-final175');fs.mkdirSync(out,{recursive:true});
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('test-bank-mbb-set3.js','utf8'),sandbox);
const bank=JSON.parse(JSON.stringify(sandbox.window.MBB_SET3));assert.equal(bank.length,175);
const engine=process.env.AUDIT_ENGINE||'chromium',layout=process.env.AUDIT_LAYOUT||'mobile',mixed=process.env.AUDIT_MIXED==='1';
const report={engine,layout,mixed,accessibilityRequired:process.env.AUDIT_AXE==='1',accessibilityScans:0,toolVersions:{playwright:tools('playwright/package.json').version,axe:tools('axe-core').version,node:process.version},source:process.env.AUDIT_SOURCE||'',questions:[],reviews:[],visuals:[],failures:[],pageErrors:[],timings:[],scope:'All 175 canonical Set 3 items in one uninterrupted session',backend:'isolated fixtures'};
const save=()=>fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
const phase=(label,fn,ms=60000)=>bounded(label,fn,ms,s=>{report.operation={...report.current,...s};if(s.status==='failed')report.failedOperation=report.operation;save();});
const server=http.createServer((req,res)=>{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!path.extname(p))p+='.html';const f=path.resolve(root,'.'+p);if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const auth=`(()=>{const user={id:'audit-final175-isolated',email:'audit@example.invalid'};const c=(${emptyClient.toString()})();const from=c.from.bind(c);c.from=function(table){const t=from(table),select=t.select.bind(t);t.select=function(...args){const q=select(...args);q.maybeSingle=q.single=()=>Promise.resolve({data:table==='profiles'?{user_id:user.id,display_name:'Final exam audit',timezone:'America/Regina',onboarding_completed:true}:null,error:null});return q;};return t;};window.UpskillAuth={isConfigured:()=>true,onChange:cb=>{queueMicrotask(()=>cb(user));return ()=>{};},getUser:()=>user,getClient:()=>c};})();`;
async function geometry(host){return host.evaluate(h=>({pageOverflow:document.documentElement.scrollWidth>innerWidth+2,clipped:[...h.querySelectorAll('.tb-stem,.tb-review-stem,.tb-opt,.tb-answer-copy,.tb-explanation-copy,.tb-key-point,.tb-exam-trap,th,td,dd')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>({text:e.textContent.slice(0,90),width:e.clientWidth,scroll:e.scrollWidth})),svgOutside:[...h.querySelectorAll('svg text')].filter(t=>{const a=t.getBoundingClientRect(),b=t.closest('svg').getBoundingClientRect();return a.left<b.left-2||a.right>b.right+2||a.top<b.top-2||a.bottom>b.bottom+2;}).map(e=>e.textContent)}));}
async function visual(host,q,n,phase){if(!q.chart)return;const data=q.chart.type==='data-table'?q.chart:q.chart.evidence;const b=Math.ceil(n/25),prefix='.mbbs3b'+b;let tables=0;
 if(data?.rows){const rows=host.locator(prefix+'-table tbody tr');assert.equal(await rows.count(),data.rows.length);for(let i=0;i<data.rows.length;i++)assert.deepEqual(await rows.nth(i).locator('th,td').allTextContents(),data.rows[i].map(String));tables=data.rows.length;}
 const regions=host.locator(prefix+'-scroll');for(let i=0;i<await regions.count();i++){const r=regions.nth(i);const closed=r.locator('xpath=ancestor::details[not(@open)]').first();if(await closed.count())await closed.locator('summary').first().click();await r.focus();await r.press('ArrowRight');await r.evaluate(e=>e.scrollLeft=e.scrollWidth);const a=await r.evaluate(e=>({needed:e.scrollWidth>e.clientWidth+2,position:e.scrollLeft}));assert.ok(!a.needed||a.position>0);if(!mixed)await r.screenshot({path:path.join(out,`q${n}-${phase}-region${i}-right.png`)});await r.evaluate(e=>e.scrollLeft=0);}
 const sliders=host.locator('input[type="range"]');for(let j=0;j<await sliders.count();j++){const s=sliders.nth(j),before=await s.inputValue();const svgBefore=await host.locator('svg').first().innerHTML();await s.focus();await s.press('End');await s.press('Home');const now=await s.inputValue();assert.notEqual(now,before);assert.notEqual(await host.locator('svg').first().innerHTML(),svgBefore);const reset=host.getByRole('button',{name:/Reset/});if(await reset.count()){await reset.first().click();assert.equal(await s.inputValue(),before);}}
 report.visuals.push({number:n,qid:q.qid,phase,type:q.chart.type,tableRows:tables,scrollRegions:await regions.count(),sliders:await sliders.count()});save();}
async function snapshots(page,host,n,phaseName){
 const checks=[];
 for(const theme of ['light','dark']){
  await phase(`${phaseName}-${n}-${theme}-theme`,()=>page.evaluate(t=>{document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;},theme));
  const g=await phase(`${phaseName}-${n}-${theme}-geometry`,()=>geometry(host));
  let violations=[],a11y;
  if(report.accessibilityRequired){
   const a=await phase(`${phaseName}-${n}-${theme}-axe`,()=>analyzeSingleDocument(page,AxeBuilder,phaseName==='question'?'.tb-quiz':'.tb-review-card'));
   violations=a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
   a11y={completed:true,passedRules:a.passes.length,incompleteRules:a.incomplete.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),inapplicableRules:a.inapplicable.length,engine:a.testEngine};
   report.accessibilityScans++;save();
  }
  if(!mixed)await phase(`${phaseName}-${n}-${theme}-screenshot`,()=>host.screenshot({path:path.join(out,`q${n}-${phaseName}-${theme}.png`),style:'header.site{visibility:hidden!important}',timeout:20000}));
  checks.push({theme,geometry:g,violations,a11y});
 }
 return checks;
}
let browser,context,page;try{
 browser=await ({chromium,webkit}[engine]).launch();
 if(report.accessibilityRequired){
  await phase('accessibility-engine-self-test',async()=>{
   const c=await browser.newContext(),p=await c.newPage();
   try{await p.setContent('<!doctype html><html lang="en"><title>Audit fixture</title><body><main id="audit-fixture"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"><button></button></main></body></html>');
    const modern=await new AxeBuilder({page:p}).include('#audit-fixture').withTags(['wcag2a','wcag2aa']).analyze();
    const direct=await analyzeSingleDocument(p,AxeBuilder,'#audit-fixture');
    for(const k of ['violations','passes','incomplete','inapplicable'])assert.deepEqual(direct[k].map(r=>r.id).sort(),modern[k].map(r=>r.id).sort(),k+' differs between axe execution paths');
    assert.ok(direct.violations.some(v=>v.id==='image-alt'));assert.ok(direct.violations.some(v=>v.id==='button-name'));
    report.accessibilitySelfTest={passed:true,violationsDetected:direct.violations.map(v=>v.id)};
   }finally{await c.close();}
  });
 }
 context=await browser.newContext({viewport:layout==='desktop'?{width:1440,height:1000}:{width:Number(process.env.AUDIT_WIDTH)||390,height:844},isMobile:layout!=='desktop',hasTouch:layout!=='desktop',deviceScaleFactor:1});page=await context.newPage();page.setDefaultTimeout(20000);
 page.on('pageerror',e=>report.pageErrors.push(e.message));page.on('crash',()=>{report.failures.push({error:'page crash'});save();});await page.route('**/auth.js',r=>r.fulfill({body:auth,contentType:'text/javascript'}));await page.route(/https:\/\/[^/]*supabase\.[^/]+\/.*/,r=>r.fulfill({body:'[]',contentType:'application/json'}));await page.addInitScript(auth);
 await page.addInitScript(()=>{window.__AUDIT_TRACE=[];document.addEventListener('click',e=>{const b=e.target.closest('button,summary');if(b){window.__AUDIT_TRACE.push({t:Date.now(),text:b.textContent.slice(0,60),attrs:[...b.attributes].map(a=>[a.name,a.value]),card:document.querySelector('.tb-review-card')?.dataset.questionId});if(__AUDIT_TRACE.length>50)__AUDIT_TRACE.shift();}},true);});
 await page.goto(base+'/test-bank.html',{waitUntil:'load'});await page.waitForFunction(()=>window.__TB&&window.__TBLearning&&document.body.classList.contains('auth-ready'));
 await page.evaluate(async()=>{await __TBLearning.sync('test-hydrate');await new Promise(r=>setTimeout(r,0));const f=__TBLearning.startSession;__TBLearning.startSession=function(c){window.__AUDIT_ORDER=c.questions.map(q=>q.qid);return f.call(this,c);};});
 await page.locator('.tb-tile[data-exam="mbb"]').click();await page.locator('.tb-setpick [data-set="3"]').click();await page.locator('[data-mode="full"]').click();await page.locator('.tb-quiz').waitFor();const order=await page.evaluate(()=>__AUDIT_ORDER);assert.equal(new Set(order).size,175);const clock=await page.locator('#tb-timer').innerText();await page.waitForTimeout(1150);assert.notEqual(await page.locator('#tb-timer').innerText(),clock);
 for(let i=0;i<175;i++){const q=bank[i],index=order.indexOf(q.qid),n=i+1;report.current={phase:'question',n,qid:q.qid};save();await phase(`question-${n}-interaction`,async()=>{await page.locator(`[data-goto="${index}"]`).click();await page.waitForFunction(id=>document.querySelector('.tb-quiz')?.dataset.questionId===id,q.qid);const host=page.locator('.tb-quiz');assert.equal((await host.locator('.tb-stem').innerText()).trim(),q.stem);
  const selected=mixed?(i%3===2?null:i%3===0?q.answer:(q.answer+1)%4):q.answer;
  if(selected!==null){for(let c=0;c<4;c++){const opt=host.locator(`[data-opt="${c}"]`);assert.ok((await opt.innerText()).includes(q.options[c]));if(c===1){await opt.focus();await opt.press('Space');}else await opt.click();assert.equal(await page.locator('.tb-opt.sel').getAttribute('data-opt'),String(c));assert.equal(await opt.getAttribute('aria-pressed'),'true');assert.equal(await opt.evaluate(e=>document.activeElement===e),true,'Selected option must retain focus');}await page.locator(`[data-opt="${selected}"]`).click();}
  if(i%25===0)await page.locator('[data-flag]').click();
  const other=order.indexOf(bank[(i+1)%175].qid);await page.locator(`[data-goto="${other}"]`).click();await page.locator(`[data-goto="${index}"]`).click();assert.equal(await page.locator('.tb-opt.sel').count(),selected===null?0:1);if(selected!==null)assert.equal(await page.locator('.tb-opt.sel').getAttribute('data-opt'),String(selected));
  });await phase(`question-${n}-visual`,()=>visual(page.locator('.tb-quiz'),q,n,'question'));const checks=await snapshots(page,page.locator('.tb-quiz'),n,'question');report.questions.push({number:n,qid:q.qid,selected:mixed?(i%3===2?null:i%3===0?q.answer:(q.answer+1)%4):q.answer,checks,reopened:true});save();if(n%25===0)console.log('Answered/reopened',n);
  if(i===2)for(const drawer of ['calc','formulas','tables']){await page.locator(`[data-${drawer}]`).click();assert.ok(await page.locator('#tb-'+drawer).isVisible());await page.locator(`[data-close="${drawer}"]`).click();}
 }
 await page.locator('[data-goto="174"]').click();let t=Date.now();await phase('submit-175',()=>page.locator('[data-submit]').click());await page.locator('[data-open-review="all"]').waitFor();report.timings.push({action:'submit175',ms:Date.now()-t});const correct=mixed?59:175;assert.match(await page.locator('.tb-resverd').innerText(),new RegExp(correct+' of 175 correctly'));report.verdict=await page.locator('.tb-resverd').innerText();
 t=Date.now();await page.locator('[data-open-review="all"]').click();await page.locator('.tb-review-card').first().waitFor();report.timings.push({action:'openFullReview',ms:Date.now()-t});assert.equal(await page.locator('.tb-review-card').count(),175);
 for(let i=0;i<175;i++){const q=bank[i],index=order.indexOf(q.qid),n=i+1;report.current={phase:'review',n,qid:q.qid};save();t=Date.now();await phase(`review-${n}-interaction`,async()=>{await page.locator(`[data-review-goto="${index}"]`).click();await page.waitForFunction(id=>document.querySelector('.tb-review-card')?.dataset.questionId===id,q.qid);const card=page.locator('.tb-review-card');const refs=q.auditSources.slice(1).concat(q.auditSources.slice(0,1));const link=card.locator('a.tb-review-reference');assert.equal(await link.getAttribute('href'),refs[0].url);assert.equal(await link.getAttribute('target'),'_blank');assert.equal(await link.getAttribute('rel'),'noopener noreferrer');const status=mixed?(i%3===2?'unanswered':i%3===0?'correct':'incorrect'):'correct';assert.equal(await card.getAttribute('data-review-status'),status);assert.equal((await card.locator('.tb-explanation-copy').innerText()).trim(),q.why);
  const details=card.locator('.tb-distractor-analysis');await details.locator('summary').click();assert.notEqual(await details.getAttribute('open'),null);const wrong=[0,1,2,3].filter(j=>j!==q.answer);for(let j=0;j<3;j++)assert.equal((await details.locator('.tb-distractor-row p').nth(j).innerText()).trim(),q.optionRationales[wrong[j]]);
  await card.locator('.tb-quality-details summary').click();await card.locator('[data-report-question]').click();assert.ok(await card.locator('.tb-report-box').isVisible());await card.locator('[data-report-note]').fill('Isolated audit; no email will be sent.');await card.locator('[data-prepare-report]').click();assert.match(await card.locator('[data-report-link]').getAttribute('href'),/^mailto:/);await card.locator('[data-report-question]').click();assert.equal(await card.locator('.tb-report-box').isVisible(),false);
  if(status!=='correct'){await card.locator('[data-error-class]').selectOption({index:1});}
  });const card=page.locator('.tb-review-card'),status=mixed?(i%3===2?'unanswered':i%3===0?'correct':'incorrect'):'correct';await phase(`review-${n}-visual`,()=>visual(card,q,n,'review'));const checks=await snapshots(page,card,n,'review');report.reviews.push({number:n,qid:q.qid,status,keyPoint:await card.locator('.tb-key-point').innerText(),trap:await card.locator('.tb-exam-trap').innerText(),reference:await card.locator('.tb-review-lesson').innerText(),ms:Date.now()-t,checks});save();if(n%25===0)console.log('Reviewed',n);
 }
 for(const filter of ['all','correct','incorrect','unanswered','flagged']){const b=page.locator(`[data-review-tab="${filter}"]`);if(await b.count()){await b.click();const expected=filter==='all'?175:filter==='flagged'?7:filter==='correct'?correct:mixed?58:0;assert.equal(await page.locator('.tb-review-card').count(),expected);}}
 verifyCoverage(report);report.complete=true;
}catch(e){
 report.failures.push({current:report.current,operation:report.failedOperation,error:e.stack});save();
 // Preserve the original failure even if the browser is no longer responsive.
 try{report.trace=await bounded('failure-trace',()=>page.evaluate(()=>window.__AUDIT_TRACE),3000);}catch(error){report.traceError=String(error);}
 try{fs.writeFileSync(path.join(out,'failure.html'),await bounded('failure-html',()=>page.content(),3000));}catch(error){report.htmlError=String(error);}
 try{await bounded('failure-screenshot',()=>page.screenshot({path:path.join(out,'failure.png'),fullPage:true,timeout:3000}),4000);}catch(error){report.screenshotError=String(error);}
}finally{
 save();
 const killTimer=setTimeout(()=>{report.failures.push({error:'Browser teardown exceeded 15 seconds'});save();process.exit(1);},15000);killTimer.unref();
 try{if(context)await bounded('context-close',()=>context.close(),5000);if(browser)await bounded('browser-close',()=>browser.close(),5000);clearTimeout(killTimer);}catch(error){report.failures.push({error:String(error)});process.exitCode=1;}
 server.closeAllConnections();server.close();save();
}
const bad=[...report.questions,...report.reviews].flatMap(r=>(r.checks||[]).filter(c=>c.geometry.pageOverflow||c.geometry.clipped.length||c.geometry.svgOutside.length||c.violations.length).map(c=>({number:r.number,...c})));
report.qualityFailures=bad;save();console.log(JSON.stringify({questions:report.questions.length,reviews:report.reviews.length,complete:report.complete,failures:report.failures,qualityFailures:bad.length,pageErrors:report.pageErrors},null,2));if(!report.complete||report.failures.length||bad.length||report.pageErrors.length)process.exitCode=1;
