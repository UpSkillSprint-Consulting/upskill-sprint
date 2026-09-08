'use strict';
// Real browser/IndexedDB and shipped page, synthetic auth/remote service. No production requests.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {performance}=require('node:perf_hooks');
const {ROOT,output,write,profiles,budget}=require('./evidence.cjs');
const {Service,client}=require('../../tests/helpers/segment03-harness.cjs');
const profile=profiles.automation.find(p=>p.id===process.env.SEG03_BROWSER_PROFILE);
if(!profile)throw Error('A declared browser profile is required');
const toolRoot=process.env.SEG03_PLAYWRIGHT_PATH;
if(!toolRoot)throw Error('Pinned test-only Playwright path is required');
const playwright=require(toolRoot),pkg=require(path.join(toolRoot,'package.json'));
assert.equal(pkg.version,profiles.testTools.playwright);
const lane='browser-'+profile.id,svc=new Service(),checks=[],errors=[],blocked=[],timings=[],navigations=[];
const directory=path.join(output(),lane);fs.mkdirSync(directory,{recursive:true});
let browser,server,base;
function authScript(owner){return `(()=>{const send=request=>window.__seg03Transport(request);const c=(${client.toString()})(send);const user={id:${JSON.stringify(owner)},email:'audit@example.invalid'};window.UpskillAuth={getUser:()=>user,getClient:()=>c,isConfigured:()=>true,onChange:cb=>{queueMicrotask(()=>cb(user));return ()=>{};}};})();`;}
async function context(owner){
  const c=await browser.newContext({viewport:{width:profile.width,height:profile.height},isMobile:profile.mobile,hasTouch:profile.touch,deviceScaleFactor:1,serviceWorkers:'block',timezoneId:'America/Regina'});
  await c.exposeBinding('__seg03Transport',(_,request)=>svc.exchange(owner,request));
  const auth=authScript(owner);await c.addInitScript(auth);
  await c.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==base){blocked.push(u.origin);return route.abort();}if(u.pathname==='/auth.js')return route.fulfill({body:auth,contentType:'text/javascript'});return route.continue();});
  await c.tracing.start({screenshots:true,snapshots:true,sources:false});return c;
}
async function open(c){const page=await c.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));page.on('crash',()=>errors.push('browser page crash'));page.on('framenavigated',f=>{if(f===page.mainFrame())navigations.push(f.url());});await page.clock.install();const start=performance.now();await page.goto(base+'/test-bank.html',{waitUntil:'load'});
  await page.waitForFunction(()=>window.__TB && window.__TBLearning && document.body.classList.contains('auth-ready'));
  await page.evaluate(async()=>{await __TBLearning.sync('fixture-ready');await new Promise(r=>setTimeout(r,0));});
  const ms=performance.now()-start;timings.push(ms);assert.equal(budget('smoke_ready',[ms]).status,'passed');return page;
}
async function shot(page,name){await page.screenshot({path:path.join(directory,name+'.png'),fullPage:true});}
async function sync(page){await page.evaluate(async()=>{await __TBLearning.sync('browser-fixture');});}
async function summary(page,exam){return page.evaluate(e=>__TBLearning.summary(e,{},__TBQuestionRegistry.questionsFor(e).map(q=>q.qid)),exam);}
async function quick(page,exam){await page.locator('.tb-tile[data-exam="'+exam+'"]').click();await page.locator('[data-count="quick"][data-n="10"]').click();await page.locator('[data-mode="quick"]').click();await page.locator('.tb-quiz').waitFor();const answer=await page.evaluate(e=>{const id=document.querySelector('.tb-quiz').dataset.questionId;return __TBQuestionRegistry.find(e,id).answer;},exam);await page.locator('[data-opt="'+answer+'"]').click();await page.locator('.tb-navcell').last().click();await page.locator('[data-submit]').click();await page.locator('.tb-resverd').waitFor();assert.match(await page.locator('.tb-resverd').innerText(),/1 of 10 correctly/);}
async function main(){let failure=null;
try{
  server=http.createServer((req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!path.extname(p))p+='.html';const f=path.resolve(ROOT,'.'+p);if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()||!['.html','.js','.css','.svg','.png','.jpg','.webp','.ico','.json'].includes(path.extname(f))){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));}catch{res.writeHead(400);res.end();}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
  browser=await playwright[profile.engine].launch();
  for(const exam of profiles.workloads.requiredExamIds){const c=await context('browser-'+exam);try{const p=await open(c);
    const rejected=await p.evaluate(id=>{const e=__TB.EXAMS[id],before=JSON.stringify(__TBLearning.store());const sets=Object.fromEntries(Object.entries(e.sets).map(([k,rows])=>[k,rows.slice()]));sets[1].push({...sets[1][0]});const r=__TBQuestionRegistry.replaceBank(id,sets);return {accepted:r.accepted,same:e===__TB.EXAMS[id],evidenceSame:before===JSON.stringify(__TBLearning.store()),valid:__TBQuestionRegistry.validate(id).valid};},exam);
    assert.deepEqual(rejected,{accepted:false,same:true,evidenceSame:true,valid:true});await p.locator('#tb-question-identity-alert[role="alert"]').waitFor();checks.push(exam+': invalid import rejects atomically with visible error');
    for(const theme of ['light','dark']){await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);await shot(p,exam+'-identity-error-'+theme);}
    if(exam==='cssbb'){const accepted=await p.evaluate(()=>__TBQuestionRegistry.replaceBank('cssbb',__TB.EXAMS.cssbb.sets));assert.equal(accepted.accepted,true);await p.locator('#tb-question-identity-alert').waitFor({state:'detached'});checks.push('cssbb: accepted identity-preserving update remains usable');}
    await quick(p,exam);await sync(p);const s=await summary(p,exam);assert.equal(s.answeredEvents,1);assert.equal(s.completedSessions,1);checks.push(exam+': real UI one correct/nine blanks');
    for(const theme of ['light','dark']){await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);await shot(p,exam+'-result-'+theme);} // screenshots are evidence, not visual approval
    await p.reload();await p.waitForFunction(()=>window.__TBLearning);await sync(p);assert.equal((await summary(p,exam)).answeredEvents,1);checks.push(exam+': history survives native reload');
    await p.locator('.tb-tile[data-exam="'+exam+'"]').click();await p.locator('[data-mode="full"]').click();await p.locator('#tb-timer').waitFor();const before=await p.locator('#tb-timer').textContent();await p.clock.fastForward(31000);assert.notEqual(await p.locator('#tb-timer').textContent(),before);checks.push(exam+': full exam starts and deadline ticks');
    const blocked=await p.evaluate(id=>__TBQuestionRegistry.replaceBank(id,__TB.EXAMS[id].sets),exam);assert.equal(blocked.accepted,false);assert.ok(blocked.errors.some(e=>e.code==='ACTIVE_SESSION'));await p.locator('.tb-quiz').waitFor();checks.push(exam+': active session rejects bank replacement');
    await shot(p,exam+'-timed');
  }finally{await c.tracing.stop({path:path.join(directory,exam+'-trace.zip')});await c.close();}}
  const ca=await context('browser-shared'),cb=await context('browser-shared');try{
    const a=await open(ca);await quick(a,'cssbb');await sync(a);
    const b=await open(cb);assert.equal((await summary(b,'cssbb')).answeredEvents,1);checks.push('independent browser context receives accepted history');
    await cb.setOffline(true);
    const pending=await b.evaluate(()=>{const qs=__TB.EXAMS.cssbb.sets[1].slice(0,2);const id=__TBLearning.startSession({examId:'cssbb',sessionId:'browser-offline-session',questions:qs,mode:'quick'});__TBLearning.completeSession({examId:'cssbb',sessionId:id,records:[{question:qs[0],selected:qs[0].answer,status:'correct'},{question:qs[1],selected:null,status:'unanswered'}]});return __TBLearning.status().pending;});
    assert.ok(pending>0);await cb.setOffline(false);await sync(b);await sync(a);assert.equal((await summary(a,'cssbb')).answeredEvents,2);checks.push('offline native outbox converges on reconnect');
    await b.waitForFunction(async()=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('tb-learning-events-mirror-v1');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});try{if(!db.objectStoreNames.contains('events'))return false;return await new Promise((resolve,reject)=>{const r=db.transaction('events','readonly').objectStore('events').count();r.onsuccess=()=>resolve(r.result>0);r.onerror=()=>reject(r.error);});}finally{db.close();}});checks.push('native IndexedDB contains mirrored event evidence');
    const n=navigations.length;await sync(a);await sync(b);assert.equal(navigations.length,n);checks.push('synchronization does not navigate/reload the page');await shot(b,'two-context-history');
  }finally{await ca.tracing.stop({path:path.join(directory,'shared-a-trace.zip')});await cb.tracing.stop({path:path.join(directory,'shared-b-trace.zip')});await ca.close();await cb.close();}
  assert.deepEqual(errors,[],'Unhandled browser errors');
}catch(e){failure=e.stack;}
finally{const browserVersion=browser?browser.version():null;if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));write(lane,{status:failure?'failed':'passed',tests:checks.length,failures:failure?1:0,skipped:0,checks,error:failure,pageErrors:errors,blockedExternalOrigins:[...new Set(blocked)],timings,profile,playwrightVersion:pkg.version,browserVersion,command:`SEG03_BROWSER_PROFILE=${profile.id} node scripts/exam-reliability/run-browser.cjs`,limitations:['Auth and remote persistence are synthetic; no live Supabase or Data API.','WebKit phone/tablet layouts are emulation, not iOS devices.','External resources blocked; screenshots retained, no visual or WCAG sign-off.','Cross-context history sync only, not active-session takeover.']});}
console.log(JSON.stringify({lane,checks:checks.length,failure}));if(failure)process.exitCode=1;}
main();
