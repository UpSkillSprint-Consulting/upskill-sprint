const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const ROOT = path.join(__dirname, '..');
const TOKEN = 'header.learner.signature';
const req = (query='exam=cssgb', token=TOKEN, method='GET') => new Request('https://upskillsprint.com/.netlify/functions/exam-content?'+query, {
  method, headers:token ? { Authorization:'Bearer '+token } : {}
});
let createHandler, build;
test.before(async () => {
  ({ createHandler } = await import('../netlify/functions/exam-content.mjs'));
  const builder = await import('../scripts/build-exam-delivery.mjs');
  await (await import('../scripts/stage-public-site.mjs')).stagePublicSite();
  build = await builder.buildExamDelivery();
});

test('runtime settings accept only HTTPS and publishable/anon keys, never a service credential',async()=>{
  const {settings} = await import('../netlify/functions/exam-content.mjs');
  const original = global.Netlify;
  const key = role => 'header.'+Buffer.from(JSON.stringify({role})).toString('base64url')+'.signature';
  try {
    for (const [url,pub,valid] of [
      ['https://project.supabase.co','sb_publishable_test',true],
      ['https://project.supabase.co',key('anon'),true],
      ['https://project.supabase.co',key('service_role'),false],
      ['https://project.supabase.co','sb_secret_test',false],
      ['http://project.supabase.co','sb_publishable_test',false],
      ['https://user:password@project.supabase.co','sb_publishable_test',false],
      ['https://project.supabase.co/arbitrary','sb_publishable_test',false]
    ]) {
      global.Netlify={env:{get:name=>({SUPABASE_URL:url,SUPABASE_PUBLISHABLE_KEY:pub})[name]}};
      assert.equal(!!settings(),valid);
    }
  } finally { if(original===undefined)delete global.Netlify;else global.Netlify=original; }
});

test('bundled public configuration matches browser sign-in; incomplete overrides fail closed',async()=>{
  const {settings} = await import('../netlify/functions/exam-content.mjs');
  const original=global.Netlify;
  const dom=new JSDOM('',{runScripts:'outside-only'});
  try {
    dom.window.eval(await fs.readFile(path.join(ROOT,'supabase-config.js'),'utf8'));
    const browser=dom.window.UPSKILLSPRINT_SUPABASE_CONFIG;
    delete global.Netlify;
    assert.deepEqual(settings(),{url:browser.url,key:browser.anonKey});
    global.Netlify={env:{get:()=>undefined}};
    assert.deepEqual(settings(),{url:browser.url,key:browser.anonKey});
    for(const values of [{SUPABASE_URL:'https://other.supabase.co'},{SUPABASE_PUBLISHABLE_KEY:'sb_publishable_other'},{SUPABASE_PUBLISHABLE_KEY:''},
      {SUPABASE_URL:'',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_other'},
      {SUPABASE_URL:'https://other.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_secret_never'}]) {
      global.Netlify={env:{get:name=>values[name]}};
      assert.equal(settings(),null);
    }
  } finally {dom.window.close();if(original===undefined)delete global.Netlify;else global.Netlify=original;}
});

function handler(decision = true, options = {}) {
  const calls = [], reads = [];
  const run = createHandler({
    getSettings:() => ({ url:'https://test.supabase.co', key:'sb_publishable_test' }),
    request:async (url, init) => { calls.push({url,init}); return new Response(JSON.stringify(decision), { status:200 }); },
    loadPackage:async exam => { reads.push(exam); return JSON.stringify({ exam }); },
    ...options
  });
  return { run, calls, reads };
}

test('anonymous, malformed and token-in-query requests cannot read private content', async () => {
  const h = handler();
  for (const request of [req('exam=cssgb',null), req('exam=cssgb','forged'), req('exam=cssgb&access_token='+TOKEN)]) {
    const response = await h.run(request);
    assert.ok([400,401].includes(response.status));
    assert.match(response.headers.get('cache-control'), /no-store/);
  }
  assert.equal(h.calls.length,0); assert.deepEqual(h.reads,[]);
});

test('unknown, coming-soon, duplicate, traversal and forged user selectors fail before database reads', async () => {
  const h = handler();
  for (const query of ['exam=cqa','exam=unknown','exam=../cqe','exam=CSSGB','exam=cssgb&exam=cqe','exam=cssgb&user_id=admin','exam=cssgb&check=0']) {
    assert.ok([400,404].includes((await h.run(req(query))).status));
  }
  assert.equal((await h.run(req('exam=cssgb',TOKEN,'POST'))).status,405);
  assert.equal((await h.run(req('exam=cssgb',TOKEN,'HEAD'))).status,405);
  assert.equal(h.calls.length,0); assert.deepEqual(h.reads,[]);
});

test('a caller-scoped server RPC decides the exact exam; only literal true releases its package', async () => {
  const h = handler();
  const response = await h.run(req());
  assert.equal(response.status,200); assert.deepEqual(h.reads,['cssgb']);
  const {url,init} = h.calls[0];
  assert.equal(url,'https://test.supabase.co/rest/v1/rpc/can_access_exam');
  assert.deepEqual(JSON.parse(init.body),{requested_exam_key:'cssgb'});
  assert.equal(init.headers.Authorization,'Bearer '+TOKEN);
  assert.equal(init.headers.apikey,'sb_publishable_test');
  assert.equal(init.cache,'no-store'); assert.equal(init.redirect,'error');
  assert.ok(init.signal instanceof AbortSignal);
  for (const name of ['Cache-Control','CDN-Cache-Control','Netlify-CDN-Cache-Control']) assert.match(response.headers.get(name),/no-store/);
  assert.equal(response.headers.get('vary'),'Authorization');
  assert.equal(response.headers.get('access-control-allow-origin'),null);
  for (const value of [false,null,'true',[true],{allowed:true}]) {
    const denied = handler(value);
    assert.equal((await denied.run(req())).status,value===false?403:503);
    assert.deepEqual(denied.reads,[]);
  }
});

test('cross-exam requests and later revocation never reuse a previous allow decision', async () => {
  let allowed = true;
  const h = handler(true,{ request:async (_url,init) => new Response(JSON.stringify(allowed && JSON.parse(init.body).requested_exam_key==='cssgb')) });
  assert.equal((await h.run(req())).status,200);
  assert.equal((await h.run(req('exam=pmp'))).status,403);
  allowed = false;
  assert.equal((await h.run(req())).status,403);
  assert.equal((await h.run(req('exam=cssgb&check=1'))).status,403);
  assert.deepEqual(h.reads,['cssgb']);
});

test('start/resume checks perform authorization without loading any question package', async () => {
  const h = handler();
  assert.deepEqual(await (await h.run(req('exam=cssgb&check=1'))).json(),{allowed:true,exam:'cssgb'});
  assert.equal(h.calls.length,1); assert.deepEqual(h.reads,[]);
});

test('invalid JWTs, missing RPC, invalid JSON, network timeout and missing settings fail closed', async () => {
  for (const status of [401,403,404,429,500]) {
    const h = handler(true,{request:async()=>new Response('error',{status})});
    assert.equal((await h.run(req())).status,status===401?401:503); assert.deepEqual(h.reads,[]);
  }
  for (const request of [async()=>{throw new DOMException('timeout','TimeoutError');},async()=>new Response('invalid json')]) {
    const h = handler(true,{request}); assert.equal((await h.run(req())).status,503); assert.deepEqual(h.reads,[]);
  }
  const h = handler(true,{getSettings:()=>null});
  assert.equal((await h.run(req())).status,503); assert.equal(h.calls.length,0);
  const missing = handler(true,{loadPackage:async()=>{throw new Error('file missing');}});
  const response = await missing.run(req()); assert.equal(response.status,503); assert.doesNotMatch(await response.text(),/file missing/);
});

test('deployment configuration bundles private files and shell carries no old premium gate or questions', async () => {
  const config = await fs.readFile(path.join(ROOT,'netlify.toml'),'utf8');
  assert.match(config,/\[functions\."exam-content"\][\s\S]*?included_files = \["content\/exam-delivery-generated\/\*\.json"\]/);
  assert.match(build.shell,/data-exam-delivery="shell"/);
  assert.match(build.shell,/exam-access-loader\.js/);
  assert.doesNotMatch(build.shell,/data-required-access|data-access-resource|var EXAMS|var SET1|test-bank-.*\.js["']/);
  for (const size of Object.values(build.sizes)) assert.ok(size < 5_500_000);
});

test('public build contains no bank files, private assets or source maps; calculator tables remain available', async()=>{
  const {auditExamPublicContent} = await import('../scripts/audit-exam-public-content.mjs');
  const audit = await auditExamPublicContent(path.join(ROOT,'public-site'));
  assert.deepEqual(audit.findings,[]);
  for (const name of ['content','supabase','netlify','test-bank-assets','test-bank-cre-set2.js','test-bank-pmp-bank2.js']) {
    await assert.rejects(fs.stat(path.join(ROOT,'public-site',name)),{code:'ENOENT'});
  }
  assert.ok((await fs.stat(path.join(ROOT,'public-site/test-bank-tables.js'))).isFile());
});

async function openPackage(exam) {
  const packet = JSON.parse(await fs.readFile(path.join(build.output,exam+'.json'),'utf8'));
  const errors = [];
  const console = new VirtualConsole(); console.on('jsdomError',error=>errors.push(error.message));
  const dom = new JSDOM(build.shell, { url:'https://upskillsprint.com/test-bank?exam='+exam,runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:console });
  await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
  const w = dom.window;
  w.HTMLElement.prototype.scrollIntoView = function() {};
  let checks = 0;
  const assetUrls = new Map(Object.keys(packet.assets).map((name,i)=>[name,'blob:https://upskillsprint.com/asset-'+i]));
  w.__ExamAccess = { exam, isAssetUrl:url=>[...assetUrls.values()].includes(url), start:action=>{checks++; return action();} };
  for (let source of packet.scripts) {
    for (const [name,url] of assetUrls) source = source.split('/'+name).join(url).split(name).join(url);
    w.eval(source);
  }
  await new Promise(resolve => setImmediate(resolve));
  return { dom, w, packet, errors, checks:()=>checks };
}
function closeDom(dom) { dom.window.__TBCurrentAttemptReview?.destroy(); dom.window.close(); }
const click = (w,node) => { assert.ok(node,'expected quiz control'); node.dispatchEvent(new w.MouseEvent('click',{bubbles:true})); };

for (const exam of ['cssbb','mbb','cssgb','cqe','cmq','cre','pmp']) {
  test(`private ${exam} package retains only its own banks and renders all released sets`, async () => {
    const {dom,w,packet,errors} = await openPackage(exam);
    try {
      assert.equal(w.__TB_MEMORY_ONLY,true);
      assert.equal(w.document.querySelector('.tb-tile.active').dataset.exam,exam);
      assert.equal(w.document.querySelectorAll('.tb-tile').length,1,'only the selected certification is shown');
      assert.equal(w.document.querySelector('#tb-mobile-cert-select'),null,'no cross-certification mobile menu');
      assert.equal(w.document.querySelector('.tb-crumb a').getAttribute('href'),'/exam-practice');
      const exams = w.__TB.EXAMS;
      for (const [key,definition] of Object.entries(exams)) {
        const banks = [definition.bank,...Object.values(definition.sets||{})].filter(Array.isArray);
        if (key !== exam) assert.ok(banks.every(bank=>bank.length===0),`${key} must not be delivered to ${exam}`);
        else {
          assert.ok(banks.some(bank=>bank.length>0));
          for (const bank of banks) for (const question of bank) assert.match(question.qid,new RegExp('^'+exam+':'));
        }
      }
      for (const asset of Object.keys(packet.assets)) assert.ok(asset.startsWith(exam==='cqe'?'test-bank-assets/cqe-':'test-bank-assets/mbb-'));
      if (exam === 'cqe') {
        const question = exams.cqe.sets[3].find(q=>q.chart?.type==='source-image');
        assert.match(w.__TB.renderQuestionChart(question.chart),/src="blob:https:\/\/upskillsprint\.com\/asset-/);
        assert.equal(w.__TB.renderQuestionChart({...question.chart,src:'https://untrusted.example/image.png'}),'');
      }
      assert.deepEqual(errors,[]);
    } finally { closeDom(dom); }
  });
}

for (const mode of ['full','quick','focus','diagnostic']) {
  test(`protected ${mode} mode starts after a check and scores an untimed reveal as incorrect`, async () => {
    const app = await openPackage('cssgb'); const {dom,w,errors} = app;
    try {
      const host = w.document.getElementById('tb-overview');
      // Quick/Focused default untimed; Full/Diagnostic cover timed completion.
      click(w, mode==='diagnostic'?host.querySelector('[data-diag]'):host.querySelector(`[data-mode="${mode}"]`));
      assert.equal(app.checks(),1);
      assert.ok(host.querySelector('.tb-quiz'));
      const reveal = host.querySelector('[data-reveal]');
      if (mode==='quick'||mode==='focus') {
        assert.ok(reveal,'untimed reveal control'); click(w,reveal);
      }
      const navigation = host.querySelectorAll('[data-goto]');
      click(w,navigation[navigation.length-1]);
      click(w,host.querySelector('[data-submit]'));
      assert.ok(host.querySelector('[data-score-result]'));
      const snapshot = w.__TB.getFeedbackSnapshot();
      assert.equal(snapshot.completed,true);
      if (reveal) { assert.equal(snapshot.records[0].revealed,true); assert.equal(snapshot.grading.correct,0); }
      assert.deepEqual(errors,[]);
    } finally { closeDom(dom); }
  });
}

const settle = () => new Promise(resolve => setImmediate(resolve));
async function loaderApp({ signedIn=true, status=200, pending=false } = {}) {
  const errors = [], requests = [], revoked = [];
  const console = new VirtualConsole();
  console.on('jsdomError',error=>{ if (!error.message.includes('navigation')) errors.push(error.message); });
  const dom = new JSDOM(build.shell,{url:'https://upskillsprint.com/test-bank?exam=cssgb',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:console});
  await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
  const w=dom.window;
  w.HTMLElement.prototype.scrollIntoView=function(){};
  w.AbortController=AbortController;
  let current=signedIn?{id:'learner'}:null, change, nextStatus=status, release;
  const packet = JSON.parse(await fs.readFile(path.join(build.output,'cssgb.json'),'utf8'));
  w.URL.createObjectURL=()=> 'blob:https://upskillsprint.com/'+Math.random();
  w.URL.revokeObjectURL=url=>revoked.push(url);
  w.UpskillAuth={isConfigured:()=>true,getUser:()=>current,getClient:()=>({auth:{getSession:async()=>({data:{session:current?{user:current,access_token:TOKEN}:null}})}}),onChange:fn=>{change=fn;fn(current);}};
  w.fetch=async(url,init)=>{
    requests.push({url,init});
    if(pending)await new Promise(resolve=>{release=resolve;});
    return new Response(JSON.stringify(nextStatus===200?(url.includes('check=1')?{allowed:true,exam:'cssgb'}:packet):{message:'denied'}),{status:nextStatus});
  };
  w.eval(await fs.readFile(path.join(ROOT,'exam-access-loader.js'),'utf8'));
  await settle(); await settle();
  return {dom,w,errors,requests,revoked,release:()=>release(),status:value=>{nextStatus=value;},change:user=>{current=user;change(user);}};
}

test('signed-out and locked users see a useful message without executing or storing questions',async()=>{
  for (const options of [{signedIn:false},{status:403},{status:401},{status:503}]) {
    const app=await loaderApp(options);
    try {
      assert.equal(app.w.__TB,undefined);
      assert.equal(app.w.document.body.classList.contains('exam-access-ready'),false);
      assert.ok(app.w.document.querySelector('#exam-access-status a[href="/exam-practice"]'));
      assert.equal(app.w.localStorage.length,0); assert.equal(app.w.sessionStorage.length,0);
      assert.equal(app.requests.length,options.signedIn===false?0:1);
      if(options.status===403)assert.match(app.w.document.getElementById('exam-access-status').textContent,/locked/);
      assert.deepEqual(app.errors,[]);
    } finally { closeDom(app.dom); }
  }
});

test('page loader starts a mode through a fresh check, deduplicates clicks and denies a revoked start',async()=>{
  const app=await loaderApp();const {w}=app;
  try {
    assert.equal(w.document.body.classList.contains('exam-access-ready'),true);
    assert.equal(app.requests.length,1);
    assert.match(app.requests[0].init.headers.Authorization,/^Bearer /);
    assert.equal(app.requests[0].init.cache,'no-store');
    const host=w.document.getElementById('tb-overview');
    const quick=host.querySelector('[data-mode="quick"]');
    click(w,quick);click(w,quick);
    await settle();await settle();
    assert.ok(host.querySelector('.tb-quiz'));
    assert.equal(app.requests.filter(r=>r.url.includes('check=1')).length,1);
    assert.equal(w.localStorage.length,0);assert.equal(w.sessionStorage.length,0);
    app.status(403);
    let started=false;
    await w.__ExamAccess.start(()=>{started=true;});
    assert.equal(started,false);
    assert.equal(w.document.body.classList.contains('exam-access-ready'),false);
    assert.match(w.document.getElementById('exam-access-status').textContent,/locked/);
    assert.deepEqual(app.errors,[]);
  } finally { closeDom(app.dom); }
});

test('sign-out or account change while a package is in flight cannot execute the old response',async()=>{
  const app=await loaderApp({pending:true});
  try {
    assert.equal(app.requests.length,1);
    app.change(null);await settle();app.release();await settle();await settle();
    assert.equal(app.w.__TB,undefined);
    assert.equal(app.w.document.body.classList.contains('exam-access-ready'),false);
    assert.match(app.w.document.getElementById('exam-access-status').textContent,/Sign in/);
    assert.deepEqual(app.errors,[]);
  } finally { closeDom(app.dom); }
});

test('loaded account switches clear the visible simulator and prevent more starts',async()=>{
  for (const user of [null,{id:'different-learner'}]) {
    const app=await loaderApp();
    try {
      app.change(user);await settle();
      assert.equal(app.w.document.body.classList.contains('exam-access-ready'),false);
      let ran=false;await app.w.__ExamAccess.start(()=>{ran=true;});assert.equal(ran,false);
      assert.equal(app.requests.length,1);
      assert.deepEqual(app.errors,[]);
    } finally { closeDom(app.dom); }
  }
});

test('returning to the tab rechecks access without polling or further content delivery',async()=>{
  const app=await loaderApp();
  try {
    app.status(403);
    app.w.dispatchEvent(new app.w.Event('focus'));await settle();await settle();
    assert.equal(app.requests.length,2);assert.match(app.requests[1].url,/check=1/);
    assert.equal(app.w.document.body.classList.contains('exam-access-ready'),false);
    assert.deepEqual(app.errors,[]);
  } finally { closeDom(app.dom); }
});
