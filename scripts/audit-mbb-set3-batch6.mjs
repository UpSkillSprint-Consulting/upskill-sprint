// Real-player audit of canonical Set 3 Q126–150, not a replacement renderer.
// Authentication and remote persistence are isolated fixtures, not a production sync test.
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
const root=process.cwd(),out=path.join(root,'audit-results-batch6');fs.mkdirSync(out,{recursive:true});
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('test-bank-mbb-set3.js','utf8'),sandbox);
const questions=JSON.parse(JSON.stringify(sandbox.window.MBB_SET3)).slice(125,150);
const report={interactions:[],scope:'Canonical Set 3 Q126–150',backend:'isolated authentication and remote-persistence fixture',cases:[],failures:[],pageErrors:[]};
const save=()=>fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify(report,null,2));
const server=http.createServer((req,res)=>{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!path.extname(p))p+='.html';const f=path.resolve(root,'.'+p);if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const auth=`(()=>{const user={id:'audit-set3-isolated',email:'audit@example.invalid'};const c=(${emptyClient.toString()})();const from=c.from.bind(c);c.from=function(table){const t=from(table),select=t.select.bind(t);t.select=function(...args){const q=select(...args);q.maybeSingle=q.single=()=>Promise.resolve({data:table==='profiles'?{user_id:user.id,display_name:'Isolated audit',timezone:'America/Regina',onboarding_completed:true}:null,error:null});return q;};return t;};window.UpskillAuth={isConfigured:()=>true,onChange:cb=>{queueMicrotask(()=>cb(user));return ()=>{};},getUser:()=>user,getClient:()=>c};})();`;
// Bring the intended control into view, then click normally. This avoids racing
// Playwright auto-scroll against the player's smooth review navigation.
// No force click, DOM click dispatch, or application event handler is bypassed.
async function stableClick(locator){
  await locator.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center',inline:'nearest'}));
  await new Promise(resolve=>setTimeout(resolve,180));
  await locator.click();
}

async function checkVisual(page,q,host,phase,label){
 if(!q.chart)return;const c=q.chart,t=c.type==='data-table'?c:c.evidence;
 assert.equal(await host.locator('caption').innerText(),t.title);
 const rows=host.locator('.mbbs3b6-table tbody tr');assert.equal(await rows.count(),t.rows.length);
 for(let i=0;i<t.rows.length;i++)assert.deepEqual(await rows.nth(i).locator('th,td').allTextContents(),t.rows[i].map(String));
 assert.equal(await host.locator('.mbbs3b6-table thead th[scope="col"]').count(),t.columns.length);
 assert.equal(await host.locator('.mbbs3b6-table tbody th[scope="row"]').count(),t.rows.length);
 const expectedCounts={'regression-diagnostic':9,'time-series':28,'main-effects-plot':4,'interaction-plot':4,'doe-cube':8,'data-table':0};
 assert.equal(await host.locator('circle[data-point]').count(),expectedCounts[c.type]);
 if(c.type!=='data-table'){
  assert.equal(await host.locator('svg[role="img"]').count(),c.panels?c.panels.length:1);
  if(c.panels){
   for(let j=0;j<c.panels.length;j++){
    const p=c.panels[j],S=host.locator('svg').nth(j),R=p.refs.some(r=>r.y!==undefined)?500:620;
    const actual=await S.locator('circle[data-point]').evaluateAll(ps=>ps.map(e=>({x:+e.dataset.x,y:+e.dataset.y,cx:+e.getAttribute('cx'),cy:+e.getAttribute('cy')})));
    const expected=p.series.flatMap(series=>series.values.map((v,i)=>({x:p.xs[i],y:v})));
    assert.equal(actual.length,expected.length);
    actual.forEach((v,i)=>{assert.equal(v.x,expected[i].x);assert.equal(v.y,expected[i].y);assert.ok(Math.abs(v.cx-(70+(v.x-p.range[0])/(p.range[1]-p.range[0])*(R-70)))<1e-7);assert.ok(Math.abs(v.cy-(270-(v.y-p.range[2])/(p.range[3]-p.range[2])*220))<1e-7);});
   }
  }else{
   const actual=await host.locator('circle[data-point]').evaluateAll(ps=>ps.map(e=>({a:+e.dataset.a,b:+e.dataset.b,c:+e.dataset.c,y:+e.dataset.y})));
   assert.deepEqual(actual,c.vertices.map(p=>({a:p.a,b:p.b,c:p.c,y:p.value})));
  }
 }
 const regions=host.locator('.mbbs3b6-scroll'),access=[];
 for(let i=0;i<await regions.count();i++){
  const area=regions.nth(i);await area.evaluate(e=>e.scrollLeft=0);await area.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(180);
  const keyboard=await area.evaluate(e=>({needed:e.scrollWidth>e.clientWidth+2,moved:e.scrollLeft>0}));assert.ok(!keyboard.needed||keyboard.moved);
  await area.evaluate(e=>e.scrollLeft=e.scrollWidth);const right=await area.evaluate(e=>({needed:e.scrollWidth>e.clientWidth+2,moved:e.scrollLeft>0}));assert.ok(!right.needed||right.moved);
  await area.screenshot({path:path.join(out,label+'-'+phase+'-region'+i+'-right.png')});await area.evaluate(e=>e.scrollLeft=0);access.push({keyboard,right});
 }
 report.interactions.push({qid:q.qid,phase,type:c.type,tableCellsVerified:true,captionVerified:true,columnAndRowHeaders:true,actualPointCount:expectedCounts[c.type],regions:access});save();
}
async function geometry(page,selector){return page.locator(selector).evaluate(host=>{
 const clipped=[...host.querySelectorAll('.tb-stem,.tb-review-stem,.tb-opt,.tb-answer-copy,.tb-explanation-copy,.tb-key-point,.tb-exam-trap,.tb-deep-label,.tb-accuracy-note,th,td,dd')].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>({tag:e.tagName,text:e.textContent.slice(0,90),scroll:e.scrollWidth,width:e.clientWidth}));
 const svgText=[...host.querySelectorAll('svg text')].map(t=>{const a=t.getBoundingClientRect(),s=t.closest('svg').getBoundingClientRect();return {text:t.textContent,outside:a.left<s.left-2||a.right>s.right+2||a.top<s.top-2||a.bottom>s.bottom+2};}).filter(x=>x.outside);
 const labelCollisions=[...host.querySelectorAll('svg')].flatMap(svg=>[...svg.querySelectorAll('text')].flatMap(t=>{const a=t.getBoundingClientRect();return [...svg.querySelectorAll('circle[data-point]')].filter(p=>{const b=p.getBoundingClientRect();return Math.min(a.right,b.right)-Math.max(a.left,b.left)>2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2;}).map(p=>({label:t.textContent,x:p.dataset.x,y:p.dataset.y}));}));
 const cubeEdgeCollisions=[...host.querySelectorAll('text[data-cube-label]')].flatMap(t=>{
  const r=t.getBoundingClientRect(),svg=t.closest('svg'),m=svg.getScreenCTM();
  return [...svg.querySelectorAll('line')].filter(l=>{
   const pt=(x,y)=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f});
   const a=pt(+l.getAttribute('x1'),+l.getAttribute('y1')),b=pt(+l.getAttribute('x2'),+l.getAttribute('y2'));
   let lo=0,hi=1;
   for(const [x,d,min,max] of [[a.x,b.x-a.x,r.left,r.right],[a.y,b.y-a.y,r.top+1,r.bottom-1]]){
    if(Math.abs(d)<1e-9){if(x<min||x>max)return false;}else{let u=(min-x)/d,v=(max-x)/d;if(u>v)[u,v]=[v,u];lo=Math.max(lo,u);hi=Math.min(hi,v);if(lo>hi)return false;}
   }return true;
  }).map(()=>t.textContent);
 });
 return {pageOverflow:document.documentElement.scrollWidth>innerWidth+2,cubeEdgeCollisions,labelCollisions,clipped,svgText,questionTop:host.getBoundingClientRect().top,selectedAnnounced:[...host.querySelectorAll('.tb-opt')].every(b=>b.hasAttribute('aria-pressed')||b.hasAttribute('aria-checked'))};
});}
const engines=process.env.AUDIT_ENGINE?[process.env.AUDIT_ENGINE]:['chromium','webkit'];
const layouts=process.env.AUDIT_LAYOUT?[process.env.AUDIT_LAYOUT]:['desktop','mobile'];
try{
for(const engine of engines){
 assert.ok(['chromium','webkit'].includes(engine));const browser=await ({chromium,webkit}[engine]).launch();
 for(const layout of layouts){
  assert.ok(['desktop','mobile'].includes(layout));const viewport=layout==='desktop'?{width:1440,height:1000}:{width:390,height:844};
  const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:layout==='mobile',hasTouch:layout==='mobile',colorScheme:'light'});
  const page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>report.pageErrors.push({engine,layout,message:e.message}));
  await page.route('**/auth.js',r=>r.fulfill({body:auth,contentType:'text/javascript'}));
  await page.route(/https:\/\/[^/]*supabase\.[^/]+\/.*/,r=>r.fulfill({body:'[]',contentType:'application/json'}));
  await page.addInitScript(auth);
  try{
   await page.goto(base+'/test-bank.html',{waitUntil:'load'});await page.waitForFunction(()=>window.__TB&&window.__TBLearning&&document.body.classList.contains('auth-ready'));
   await page.evaluate(async()=>{await __TBLearning.sync('test-hydrate');await new Promise(r=>setTimeout(r,0));const start=__TBLearning.startSession;__TBLearning.startSession=function(c){window.__AUDIT_ORDER=c.questions.map(q=>q.qid);return start.call(this,c);};});
   await page.locator('.tb-tile[data-exam="mbb"]').click();await page.locator('.tb-setpick [data-set="3"]').click();await page.locator('[data-mode="full"]').click();
   await page.locator('.tb-quiz').waitFor();const order=await page.evaluate(()=>__AUDIT_ORDER);assert.equal(order.length,175);assert.equal(await page.locator('.tb-navcell').count(),175);assert.ok(await page.locator('#tb-timer').isVisible());const clock=await page.locator('#tb-timer').innerText();await page.waitForTimeout(1150);assert.notEqual(await page.locator('#tb-timer').innerText(),clock);
   for(let i=0;i<questions.length;i++){
    const q=questions[i],index=order.indexOf(q.qid),label=engine+'-'+layout+'-q'+String(i+126).padStart(2,'0');
    assert.ok(index>=0);await page.locator('[data-goto="'+index+'"]').click();await page.waitForFunction(id=>document.querySelector('.tb-quiz')?.dataset.questionId===id,q.qid);
    assert.equal((await page.locator('.tb-stem').innerText()).trim(),q.stem);
    for(let choice=0;choice<4;choice++){
     const option=page.locator('.tb-opt[data-opt="'+choice+'"]');assert.ok((await option.innerText()).includes(q.options[choice]));
     if(choice===1){await option.focus();await page.keyboard.press('Space');}else await option.click();
     assert.equal(await page.locator('.tb-opt.sel').getAttribute('data-opt'),String(choice));
    }
    await page.locator('.tb-opt[data-opt="'+q.answer+'"]').click();
    if(i===0){await page.locator('[data-flag]').click();assert.ok(await page.locator('[data-flag].on').isVisible());}
    const other=order.indexOf(questions[(i+1)%25].qid);await page.locator('[data-goto="'+other+'"]').click();await page.locator('[data-goto="'+index+'"]').click();
    assert.equal(await page.locator('.tb-opt.sel').getAttribute('data-opt'),String(q.answer));
    if(i===0)assert.ok(await page.locator('[data-flag].on').isVisible());
    await checkVisual(page,q,page.locator('.tb-quiz'),'question',label);
    const navigation=await geometry(page,'.tb-quiz');
    for(const theme of ['light','dark']){
     await page.evaluate(t=>{document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;},theme);
     await page.locator('.tb-quiz').scrollIntoViewIfNeeded();await page.locator('.tb-quiz').screenshot({path:path.join(out,label+'-'+theme+'.png'),style:'header.site{visibility:hidden!important}'});
     const g=await geometry(page,'.tb-quiz');const axe=await new AxeBuilder({page}).include('.tb-quiz').withTags(['wcag2a','wcag2aa']).analyze();
     report.cases.push({engine,layout,theme,number:i+126,qid:q.qid,phase:'question',fourChoicesSelected:true,keyboardSpace:true,reopenedSelection:true,geometry:g,navigation,axe:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});save();
     if(layout==='mobile'&&q.chart){const area=page.locator('.mbbs3b6-scroll').first();const scroll=await area.evaluate(e=>{e.scrollLeft=e.scrollWidth;return {needed:e.scrollWidth>e.clientWidth+2,moved:e.scrollLeft>0};});assert.ok(!scroll.needed||scroll.moved);await area.screenshot({path:path.join(out,label+'-'+theme+'-visual-right.png')});await area.evaluate(e=>e.scrollLeft=0);}
    }
    if(i===2){for(const name of ['calc','formulas','tables']){await page.locator('[data-'+name+']').click();assert.ok(await page.locator('#tb-'+name).isVisible());await page.locator('[data-close="'+name+'"]').click();}}
   }
   await page.locator('[data-goto="174"]').click();await page.locator('[data-submit]').click();await page.locator('[data-open-review="all"]').click();await page.locator('#tb-answer-review').waitFor();
   assert.match(await page.locator('.tb-resverd').innerText(),/25 of 175 correctly/);
   await stableClick(page.locator('[data-review-tab="correct"]'));
   for(let i=0;i<questions.length;i++){
    const q=questions[i],index=order.indexOf(q.qid);await page.locator('[data-review-goto="'+index+'"]').click();
    const card=page.locator('.tb-review-card');assert.equal(await card.getAttribute('data-question-id'),q.qid);assert.equal(await card.getAttribute('data-review-status'),'correct');
    assert.equal((await card.locator('.tb-explanation-copy').innerText()).trim(),q.why);
    assert.equal((await card.locator('.tb-exam-trap').innerText()).trim(),q.trap);
    const details=card.locator('.tb-distractor-analysis');await stableClick(details.locator('summary'));assert.ok(await details.getAttribute('open')!==null);
    const wrong=q.options.map((_,j)=>j).filter(j=>j!==q.answer);const rows=details.locator('.tb-distractor-row');assert.equal(await rows.count(),3);
    for(let j=0;j<3;j++)assert.equal((await rows.nth(j).locator('p').innerText()).trim(),q.optionRationales[wrong[j]]);
    await stableClick(card.locator('.tb-quality-details summary'));assert.ok((await card.locator('.tb-quality-details').innerText()).includes('All distractor rationales'));
    const box=card.locator('.tb-report-box');assert.equal(await box.isVisible(),false);
    await stableClick(card.locator('[data-report-question]'));assert.equal(await box.isVisible(),true);
    await box.locator('[data-report-type]').selectOption({label:'Other'});await box.locator('[data-report-note]').fill('Isolated audit check; no message is sent.');
    await stableClick(box.locator('[data-prepare-report]'));const mail=await box.locator('[data-report-link]').getAttribute('href');assert.ok(mail.startsWith('mailto:'));assert.ok(decodeURIComponent(mail).includes(q.stem));
    await stableClick(card.locator('[data-report-question]'));assert.equal(await box.isVisible(),false);
    await checkVisual(page,q,card,'review',engine+'-'+layout+'-q'+(i+126));
    const copy=await card.innerText();const rationales=q.optionRationales.map(r=>copy.includes(r));
    for(const theme of ['light','dark']){
     await page.evaluate(t=>{document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;},theme);
     await card.screenshot({path:path.join(out,engine+'-'+layout+'-q'+String(i+126).padStart(2,'0')+'-review-'+theme+'.png'),style:'header.site{visibility:hidden!important}'});
     const axe=await new AxeBuilder({page}).include('.tb-review-card').withTags(['wcag2a','wcag2aa']).analyze();
     report.cases.push({engine,layout,theme,number:i+126,qid:q.qid,phase:'review',status:'correct',reviewedTip:true,expandedDistractors:true,issueFormToggle:true,preparedUnsentReport:true,rationales,geometry:await geometry(page,'.tb-review-card'),axe:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});save();
    }
   }
   report.cases.push({engine,layout,phase:'session',result:'25/175',auditedQuestions:25,untouchedUnanswered:150,flagPersisted:true});
  }catch(e){report.failures.push({engine,layout,error:e.stack});await page.screenshot({path:path.join(out,engine+'-'+layout+'-failure.png'),fullPage:true}).catch(()=>{});try{fs.writeFileSync(path.join(out,engine+'-'+layout+'-failure.html'),await page.content());}catch{}save();}
  finally{await context.close();}
 }
 await browser.close();
}
}finally{server.close();save();}
const bad=report.cases.filter(c=>c.geometry&&(c.geometry.pageOverflow||c.geometry.clipped.length||c.geometry.svgText.length||c.geometry.labelCollisions.length||c.geometry.cubeEdgeCollisions.length||!c.geometry.selectedAnnounced)||(c.rationales&&!c.rationales.every(Boolean))||(c.axe&&c.axe.length));
if(report.failures.length||report.pageErrors.length||bad.length||report.cases.filter(c=>c.geometry).length!==engines.length*layouts.length*100)process.exitCode=1;
console.log('Recorded quality-gate failures:',bad.length);
console.log(JSON.stringify({cases:report.cases.length,failures:report.failures,pageErrors:report.pageErrors},null,2));
