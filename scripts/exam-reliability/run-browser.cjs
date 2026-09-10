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
function authScript(owner){return `(()=>{window.__TB_INCREMENTAL_SYNC_V1=true;const send=request=>window.__seg03Transport(request);const c=(${client.toString()})(send);const user={id:${JSON.stringify(owner)},org:'segment03-browser-harness'};window.UpskillAuth={getUser:()=>user,getClient:()=>c,isConfigured:()=>true,onChange:cb=>{queueMicrotask(()=>cb(user));return ()=>{};}};})()`;}
async function context(owner){
  const c=await browser.newContext({viewport:{width:profile.width,height:profile.height},isMobile:profile.mobile,hasTouch:profile.touch,deviceScaleFactor:1,serviceWorkers:'block',timezoneId:'America/Los_Angeles',locale:'en-US'});
  await c.exposeBinding('__seg03Transport',(_,request)=>svc.exchange(owner,request));
  const auth=authScript(owner);await c.addInitScript(auth);
  await c.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==base){blocked.push(u.origin);return route.abort();}if(u.pathname==='/auth.js')return route.fulfill({body:auth,contentType:'text/javascript'});if(u.hostname==='example.com')return route.abort();return route.continue();});
  await c.tracing.start({screenshots:true,snapshots:true,sources:false});return c;
}
async function open(c){const page=await c.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));page.on('crash',()=>errors.push('browser page crash'));page.on('framecrashed',()=>errors.push('browser frame crash'));const start=performance.now();
  await page.goto(base+'/test-bank.html');
  await page.waitForFunction(()=>window.__TB && window.__TBLearning && window.__TBAccountSync && window.__TBRetakeConfiguration && document.body.classList.contains('auth-ready'));
  // Both startup hydrators can schedule browse replacement. Finish their real
  // promises and enhancement frames before interacting; do not retry lost clicks.
  await page.evaluate(async()=>{
    const account=await __TBAccountSync.syncAfterCurrent('fixture-ready');
    if(account&&account.error)throw new Error('Synthetic account hydration failed');
    await __TBLearning.sync('fixture-ready');
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  });
  const ms=performance.now()-start;timings.push(ms);assert.equal(budget('smoke_ready',[ms]).status,'passed');return page;
}
async function shot(page,name){await page.screenshot({path:path.join(directory,name+'.png'),fullPage:true});}
async function sync(page){await page.evaluate(async()=>{await __TBLearning.sync('browser-fixture');});}
async function summary(page,exam){return page.evaluate(e=>__TBLearning.summary(e,{},__TBQuestionRegistry.questionsFor(e).map(q=>q.qid)),exam);}
async function quick(page,exam){
  await page.locator('.tb-tile[data-exam="'+exam+'"]').click();
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.locator('[data-count="quick"][data-n="10"]').click();
  await page.waitForFunction(()=>document.querySelector('[data-count="quick"][data-n="10"]')?.getAttribute('aria-pressed')==='true');
  await page.locator('[data-mode="quick"]').click();
  await page.locator('.tb-quiz').waitFor();
  assert.equal(await page.locator('.tb-navcell').count(),10,'Selected ten-item plan must exist before grading');
  const answer=await page.evaluate(e=>{const id=document.querySelector('.tb-quiz').dataset.questionId;return __TBQuestionRegistry.find(e,id).answer;},exam);
  await page.locator('[data-opt="'+answer+'"]').click();
  await page.locator('.tb-navcell').last().click();
  await page.locator('[data-submit]').click();
  await page.locator('.tb-resverd').waitFor();
  assert.match(await page.locator('.tb-resverd').innerText(),/1 of 10 correctly/);
}
async function main(){let failure=null;
try{
  server=http.createServer((req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!path.extname(p))p+='.html';const f=path.resolve(ROOT,'.'+p);if(!f.startsWith(ROOT)){res.writeHead(403);return res.end();}return fs.createReadStream(f).on('error',()=>{res.writeHead(404);res.end();}).pipe(res);}catch(e){res.writeHead(500);res.end();}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
  browser=await playwright[profile.engine].launch();
  for(const exam of profiles.workloads.requiredExamIds){const c=await context('browser-'+exam);try{const p=await open(c);
    const rejected=await p.evaluate(id=>{const e=__TB.EXAMS[id],before=JSON.stringify(__TBLearning.store());const sets=Object.fromEntries(Object.entries(e.sets).map(([k,rows])=>[k,rows.slice()]));sets[1].push({...sets[1][0]});const r=__TBQuestionRegistry.replaceBank(id,sets);return {accepted:r.accepted,same:e===__TB.EXAMS[id],evidenceSame:before===JSON.stringify(__TBLearning.store()),valid:__TBQuestionRegistry.validate(id).valid};},exam);
    assert.deepEqual(rejected,{accepted:false,same:true,evidenceSame:true,valid:true});await p.locator('#tb-question-identity-alert[role="alert"]').waitFor();checks.push(exam+': invalid import rejected');
    for(const theme of ['light','dark']){await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);await shot(p,exam+'-identity-error-'+theme);}
    if(exam==='cssbb'){const accepted=await p.evaluate(()=>__TBQuestionRegistry.replaceBank('cssbb',__TB.EXAMS.cssbb.sets));assert.equal(accepted.accepted,true);await p.locator('#tb-question-identity-alert').waitFor({state:'detached'});checks.push('cssbb: valid import accepted');}
    await quick(p,exam);await sync(p);const s=await summary(p,exam);assert.equal(s.answeredEvents,1);assert.equal(s.completedSessions,1);checks.push(exam+': real UI one correct/nine blanks');
    const gradingEvidence=await p.evaluate(id=>{
      const view=document.querySelector('[data-score-result]'), snapshot=__TB.getFeedbackSnapshot();
      const fractions=[...document.querySelector('.tb-breakdown').textContent.matchAll(/\((\d+)\/(\d+)\)/g)].map(x=>[Number(x[1]),Number(x[2])]);
      const statuses=snapshot.records.map(r=>__TBVersions.classify(r.question,r.selected));
      const history=__TBAdaptiveMastery.store().exams[id].attempts.find(a=>a.id===snapshot.sessionId);
      return {score:Number(view.dataset.scorePercent),target:view.dataset.targetMet,hasDisclaimer:view.textContent.includes('not an official certification pass/fail'),
        numerator:fractions.reduce((n,x)=>n+x[0],0),denominator:fractions.reduce((n,x)=>n+x[1],0),
        correct:statuses.filter(s=>s==='correct').length,blanks:statuses.filter(s=>s==='unanswered').length,
        historyTotal:history.total,historyCorrect:history.correct,originalTotal:snapshot.grading.total,originalBlanks:snapshot.grading.unanswered};
    },exam);
    assert.deepEqual(gradingEvidence,{score:10,target:'false',hasDisclaimer:true,numerator:1,denominator:10,correct:1,blanks:9,historyTotal:10,historyCorrect:1,originalTotal:10,originalBlanks:9});checks.push(exam+': grading calculations verified');
    const versionEvidence=await p.evaluate(async id=>{
      const store=__TBLearning.store(),done=store.events.filter(e=>e.type==='session_completed'&&e.examId===id).at(-1);
      const start=store.events.find(e=>e.type==='session_started'&&e.sessionId===done.sessionId),wire=start.payload.versionPin;
      const archive=await __TBVersions.loadHistory(wire,window.fetch.bind(window)),historical=__TBVersions.historicalQuestions(wire,archive.bank);
      const current=__TB.EXAMS[id],oldTarget=current.pass,oldLength=current.questions,q=__TBQuestionRegistry.find(id,wire.items[0][0]),oldAnswer=q.answer;
      const before=JSON.stringify(done.payload.grading);
      try {current.pass=99;current.questions=1;q.answer=(oldAnswer+1)%q.options.length;
        const retry=__TBLearning.completeSession({examId:id,sessionId:done.sessionId,records:[]});
        return {codec:wire.codec,items:wire.items.length,expected:wire.expectedLength,originalKey:historical[0].answer===oldAnswer,archiveConfig:archive.config.configVersion===wire.configVersion,referenceOnly:retry.error===undefined,immutable:true,correct:done.payload.grading.correct};
      } finally {current.pass=oldTarget;current.questions=oldLength;q.answer=oldAnswer;}
    },exam);
    assert.deepEqual(versionEvidence,{codec:1,items:10,expected:10,originalKey:true,archiveConfig:true,referenceOnly:true,immutable:true,correct:1});checks.push(exam+': immutable archives and original questions verified');
    for(const theme of ['light','dark']){await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);await shot(p,exam+'-result-'+theme);} // screenshots are evidence, not visual approval
    await p.reload();await p.waitForFunction(()=>window.__TBLearning);await sync(p);assert.equal((await summary(p,exam)).answeredEvents,1);checks.push(exam+': history survives native reload');
    await p.locator('.tb-tile[data-exam="'+exam+'"]').click();await p.locator('[data-mode="full"]').click();await p.locator('#tb-timer').waitFor();const before=await p.locator('#tb-timer').textContent();
    const timingPin=await p.evaluate(id=>{const session=Object.values(__TBLearning.store().sessions).filter(s=>s.examId===id&&s.status!=='completed').at(-1);if(!session||!session.versionPin)throw new Error('Active session with versionPin required');const x=session.versionPin;return {valid:!!__TBVersions.checkedPin(x)};},exam);
    const blocked=await p.evaluate(id=>__TBQuestionRegistry.replaceBank(id,__TB.EXAMS[id].sets),exam);assert.equal(blocked.accepted,false);assert.ok(blocked.errors.some(e=>e.code==='ACTIVE_SESSION'));checks.push(exam+': active session blocks replace-bank');
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
}catch(e){failure=e.stack;const esc=(failure||'').toString().replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A');console.log('::error::'+profile.id+': '+esc.slice(0,3000));}
finally{const browserVersion=browser?browser.version():null;if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));write(lane,{status:failure?'failed':'passed',tests:checks.length,failures:failure?1:0,skipped:0,checks,error:failure,pageErrors:errors,blockedExternalOrigins:[...new Set(blocked)],timings,profile,playwrightVersion:pkg.version,browserVersion,command:`SEG03_BROWSER_PROFILE=${profile.id} node scripts/exam-reliability/run-browser.cjs`,limitations:['Auth and remote persistence are synthetic; no live Supabase or Data API.','WebKit phone/tablet layouts are emulation, not iOS devices.','External resources blocked; screenshots retained, no visual or WCAG sign-off.','Cross-context history sync only, not active-session takeover.']});
console.log(JSON.stringify({lane,checks:checks.length,failure}));if(failure)process.exitCode=1;}
}
main();
