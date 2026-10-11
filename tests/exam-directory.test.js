const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const {JSDOM}=require('jsdom');
const read=name=>readFileSync(join(__dirname,'..',name),'utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r;});return {promise,resolve};};
function screen(t,handler) {
  const dom=new JSDOM(read('exam-practice.html'),{url:'https://upskillsprint.com/exam-practice',runScripts:'outside-only',pretendToBeVisual:true});
  t.after(()=>dom.window.close());const w=dom.window;let user,change;const calls=[],timers=new Map();
  const realTimer=w.setTimeout.bind(w);w.setTimeout=(fn,delay)=>{const id=realTimer(fn,delay);timers.set(id,{fn,delay});return id;};
  const realClear=w.clearTimeout.bind(w);w.clearTimeout=id=>{timers.delete(id);realClear(id);};
  let data=Array.from(w.document.querySelectorAll('.exam-card'),card=>({exam_key:card.dataset.exam,display_name:card.querySelector('h3').textContent,badge:card.querySelector('.exam-acronym').textContent,publication_status:card.dataset.publication,access_status:'locked',can_practice:false,expires_at:null,request_status:null,request_revision:0,requested_at:null}));
  w.confirm=()=>true;
  w.UpskillAuth={isConfigured:()=>true,getUser:()=>user,onChange:fn=>{change=fn;},getClient:()=>({rpc:(name,args)=>{
    const call={name,args,signal:null};calls.push(call);
    const promise=Promise.resolve().then(()=>handler?handler(name,args):({data:JSON.parse(JSON.stringify(data))}));
    promise.abortSignal=signal=>{call.signal=signal;return promise;};return promise;
  }})};
  w.eval(read('exam-directory.js'));
  return {w,dom,calls,get rows(){return data},set rows(value){data=value},el:id=>w.document.getElementById(id),card:key=>w.document.querySelector('[data-exam="'+key+'"]'),
    async signIn(next={id:'learner'}){user=next;change(next);await flush();},
    timeout(){for(const [id,timer] of Array.from(timers)){if(timer.delay===12000){w.clearTimeout(id);timer.fn();}}},
    async refresh(){w.document.getElementById('exam-directory-refresh').click();await flush();}};
}
test('signed-out catalog stays public, locked and request-free with zero database calls',async t=>{
  const s=screen(t);await s.signIn(null);
  assert.equal(s.calls.length,0);assert.equal(s.w.document.querySelectorAll('.exam-card').length,8);
  assert.equal(s.w.document.querySelectorAll('main a[href^="/test-bank"]').length,0);
  assert.equal(s.card('pmp').dataset.state,'locked');assert.match(s.card('pmp').querySelector('a').href,/sign-in/);
  assert.equal(s.card('cqa').querySelector('button,a'),null);
});
test('one read shows only explicitly granted exams first; all others retain lock icons',async t=>{
  const s=screen(t);Object.assign(s.rows.find(r=>r.exam_key==='pmp'),{can_practice:true,access_status:'granted'});
  await s.signIn();assert.equal(s.calls.length,1);assert.equal(s.calls[0].name,'get_my_exam_directory');
  assert.deepEqual(JSON.parse(JSON.stringify(s.calls[0].args)),{});assert.equal(s.el('my-exams-count').textContent,'1');
  assert.equal(s.el('my-exams-grid').children[0].dataset.exam,'pmp');
  assert.equal(s.card('pmp').querySelector('a').getAttribute('href'),'/test-bank?exam=pmp');
  assert.ok(s.card('cqe').querySelector('.exam-status svg'));assert.equal(s.card('cqe').querySelector('a'),null);
});
test('zero, multiple and administrator grants use the same authoritative rows',async t=>{
  const s=screen(t);await s.signIn({id:'learner',user_metadata:{role:'administrator'}});
  assert.equal(s.el('my-exams-count').textContent,'0');assert.match(s.el('my-exams-empty-title').textContent,/No exams/);
  for(const row of s.rows) if(['pmp','cqe'].includes(row.exam_key))row.can_practice=true;
  await s.refresh();assert.equal(s.el('my-exams-count').textContent,'2');
  for(const row of s.rows)row.can_practice=row.publication_status==='published';
  await s.refresh();assert.equal(s.el('my-exams-count').textContent,'7');assert.equal(s.el('explore-exams-empty').hidden,false);
});
test('pending, expired, revoked and declined remain denied with appropriate actions',async t=>{
  const s=screen(t);
  Object.assign(s.rows[0],{access_status:'pending',request_status:'pending',request_revision:3});
  Object.assign(s.rows[1],{access_status:'expired',expires_at:'2020-01-01'});
  Object.assign(s.rows[2],{access_status:'revoked'});Object.assign(s.rows[3],{access_status:'declined'});
  await s.signIn();
  for(const [i,status] of ['pending','expired','revoked','declined'].entries())assert.equal(s.card(s.rows[i].exam_key).dataset.state,status);
  assert.equal(s.w.document.querySelectorAll('main a[href^="/test-bank"]').length,0);
  assert.equal(s.card('cssbb').querySelector('[data-action=cancel]').textContent,'Cancel request');
  assert.equal(s.el('exam-requests-count').textContent,'1 pending request');
});
test('request sends caller-scoped exam and revision then rereads status without unlocking',async t=>{
  let s; s=screen(t,(name,args)=>{
    if(name==='request_exam_access'){Object.assign(s.rows.find(r=>r.exam_key===args.requested_exam_key),{request_status:'pending',request_revision:1});return {data:{status:'pending'}};}
    return {data:structuredClone(s.rows)};
  });await s.signIn();s.card('pmp').querySelector('button').click();await flush();await flush();
  assert.deepEqual(JSON.parse(JSON.stringify(s.calls[1].args)),{requested_exam_key:'pmp',operation:'request',expected_revision:0});
  assert.equal(s.calls[2].name,'get_my_exam_directory');assert.equal(s.card('pmp').dataset.state,'pending');
  assert.equal(s.el('my-exams-count').textContent,'0');assert.match(s.el('exam-directory-status').textContent,/Request sent/);
});
test('cancellation requires confirmation and respects the observed revision',async t=>{
  let s;s=screen(t,(name,args)=>{
    if(name==='request_exam_access'){Object.assign(s.rows[0],{request_status:'cancelled',request_revision:5,requested_at:new Date().toISOString()});return {data:{status:'cancelled'}};}
    return {data:structuredClone(s.rows)};
  });Object.assign(s.rows[0],{request_status:'pending',request_revision:4});await s.signIn();
  s.w.confirm=()=>false;s.card('cssbb').querySelector('button').click();assert.equal(s.calls.length,1);
  s.w.confirm=()=>true;s.card('cssbb').querySelector('button').click();await flush();await flush();
  assert.equal(s.calls[1].args.expected_revision,4);assert.equal(s.calls[1].args.operation,'cancel');
  assert.equal(s.card('cssbb').querySelector('button').disabled,true);assert.match(s.card('cssbb').textContent,/request again after/);
});
test('stale decisions and uncertain writes refresh authoritative state before retry',async t=>{
  let s;s=screen(t,name=>name==='request_exam_access'?{error:{code:'40001',message:'Conflict'}}:{data:structuredClone(s.rows)});
  await s.signIn();s.card('pmp').querySelector('button').click();await flush();await flush();
  assert.equal(s.calls.length,3);assert.match(s.el('exam-directory-status').textContent,/access changed/);
  assert.equal(s.el('my-exams-count').textContent,'0');
});
test('late responses never expose a previous account; sign-out removes start links immediately',async t=>{
  const pending=deferred();let n=0;let s;s=screen(t,()=>++n===1?pending.promise:{data:structuredClone(s.rows)});
  await s.signIn();const firstSignal=s.calls[0].signal;
  await s.signIn({id:'other'});assert.equal(firstSignal.aborted,true);
  const granted=structuredClone(s.rows);granted[0].can_practice=true;pending.resolve({data:granted});await flush();
  assert.equal(s.el('my-exams-count').textContent,'0');
  s.rows[0].can_practice=true;await s.refresh();assert.equal(s.el('my-exams-count').textContent,'1');
  await s.signIn(null);assert.equal(s.el('my-exams-count').textContent,'0');assert.equal(s.w.document.querySelectorAll('main a[href^="/test-bank"]').length,0);
});
test('RPC errors, malformed rows and timeouts fail closed; retry can recover',async t=>{
  let response={error:{message:'RPC missing'}};const s=screen(t,()=>response);await s.signIn();assert.equal(s.w.document.body.dataset.directoryPhase,'unavailable');
  for(const bad of [null,{},[{...s.rows[0],can_practice:'true'}],[s.rows[0],s.rows[0]]]){
    response={data:bad};await s.refresh();assert.equal(s.w.document.body.dataset.directoryPhase,'unavailable');
  }
  response={data:structuredClone(s.rows)};await s.refresh();assert.equal(s.w.document.body.dataset.directoryPhase,'ready');
  const h=screen(t,()=>new Promise(()=>{}));await h.signIn();h.timeout();await flush();assert.equal(h.w.document.body.dataset.directoryPhase,'unavailable');assert.equal(h.calls[0].signal.aborted,true);
});
test('search is local, escaped and matches full certification names and acronyms',async t=>{
  const s=screen(t);await s.signIn();const input=s.el('exam-directory-search');
  input.value='master black';input.dispatchEvent(new s.w.Event('input'));
  assert.equal(s.w.document.querySelectorAll('.exam-card:not([hidden])').length,1);assert.equal(s.card('mbb').hidden,false);
  input.value='nonexistent';input.dispatchEvent(new s.w.Event('input'));assert.equal(s.el('exam-no-results').hidden,false);assert.equal(s.calls.length,1);
  s.rows[0].display_name='<img src=x onerror=alert(1)>';input.value='';await s.refresh();assert.equal(s.card('cssbb').querySelector('h3').children.length,0);
});
test('focus and visibility rechecks coalesce; renewed expiry is not assumed from a cached grant',async t=>{
  let pending;let s;s=screen(t,()=>pending?pending.promise:{data:structuredClone(s.rows)});
  s.rows[0].can_practice=true;s.rows[0].expires_at='2000-01-01';await s.signIn();assert.equal(s.card('cssbb').dataset.state,'expired');
  pending=deferred();s.w.dispatchEvent(new s.w.Event('focus'));s.w.document.dispatchEvent(new s.w.Event('visibilitychange'));await flush();assert.equal(s.calls.length,2);
  pending.resolve({data:structuredClone(s.rows)});await flush();assert.equal(s.el('my-exams-count').textContent,'0');
});
test('double request clicks are blocked and account switching during a write discards its result',async t=>{
  const pending=deferred();let s;s=screen(t,name=>name==='request_exam_access'?pending.promise:{data:structuredClone(s.rows)});
  await s.signIn();const button=s.card('pmp').querySelector('button');button.click();button.click();await flush();
  assert.equal(s.calls.filter(c=>c.name==='request_exam_access').length,1);
  await s.signIn(null);pending.resolve({data:{status:'pending'}});await flush();assert.equal(s.w.document.body.dataset.directoryPhase,'signedout');
  assert.match(s.el('exam-directory-status').textContent,/Sign in/);
});
test('coming-soon and retired exams never expose practice, even with an unexpected allow flag',async t=>{
  const s=screen(t);s.rows[7].can_practice=true;s.rows[0].publication_status='retired';s.rows[0].can_practice=true;
  await s.signIn();assert.equal(s.card('cssbb'),null);assert.equal(s.card('cqa').querySelector('a,button'),null);
  assert.doesNotMatch(read('exam-directory.js'),/localStorage|sessionStorage|setInterval|\.channel\(|innerHTML/);
});
