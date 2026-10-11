const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { JSDOM } = require('jsdom');
const root=join(__dirname,'..');
const read=name=>readFileSync(join(root,name),'utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r});return {promise,resolve};};
function account(overrides={}) {
  return {found:true,user_id:'learner-id',email:'learner@example.invalid',can_receive_grants:true,is_administrator:false,
    exams:[{exam_key:'pmp',display_name:'Project Management Professional',badge:'PMP',publication_status:'published',access_status:'locked',grant_revision:0,request_revision:0,grant_status:null,request_status:null,expires_at:null},
      {exam_key:'cqa',display_name:'Certified Quality Auditor',badge:'CQA',publication_status:'coming_soon',access_status:'coming_soon',grant_revision:0,request_revision:0}],history:[],...overrides};
}
function screen(handler=async()=>({data:account()})) {
  const dom=new JSDOM(read('admin-exam-access.html'),{runScripts:'outside-only',url:'https://example.invalid/admin-exam-access.html'});
  const {window}=dom; let change; const calls=[],confirmations=[];
  window.confirm=text=>{confirmations.push(text);return true;};
  window.UpskillAuth={isConfigured:()=>true,getUser:()=>({id:'admin'}),onChange:fn=>{change=fn;},getClient:()=>({rpc:async(name,args)=>{
    assert.equal(name,'admin_manage_exam_access');calls.push(args);
    if(args.operation==='status') return {data:{administrator:true}};
    return handler(args);
  }})};
  window.eval(read('admin-exam-access.js'));
  const el=id=>window.document.getElementById(id);
  const submit=(id,button)=>el(id).dispatchEvent(new window.SubmitEvent('submit',{cancelable:true,submitter:button?el(button):null}));
  return {dom,window,el,submit,calls,confirmations,change:user=>change(user),async search(){el('exam-member-email').value='learner@example.invalid';submit('exam-member-search');await flush();},async start(){change({id:'admin'});await flush();}};
}
test('signed-out and missing admin services never reveal controls; requests load explicitly',async()=>{
  const s=screen(); await s.start();
  assert.equal(s.el('exam-admin-controls').hidden,false); assert.equal(s.calls.length,1);
  s.change(null); assert.equal(s.el('exam-admin-controls').hidden,true);
  assert.match(s.el('exam-admin-status').textContent,/Sign in/); s.dom.window.close();
  const denied=screen(); denied.window.UpskillAuth.getClient=()=>({rpc:async()=>({error:{message:'denied'}})});
  await denied.start(); assert.equal(denied.el('exam-admin-controls').hidden,true); denied.dom.window.close();
});
test('grant confirmation includes learner, exam and expiry and sends both revisions',async()=>{
  const s=screen(); await s.start(); await s.search();
  s.window.document.querySelector('[data-exam=pmp]').click();
  s.el('exam-grant-expiry').value='2099-05-01T14:30';s.submit('exam-access-edit','exam-grant');await flush();
  const call=s.calls.at(-1);assert.equal(call.operation,'grant');assert.equal(call.target_id,'learner-id');assert.equal(call.requested_exam_key,'pmp');
  assert.equal(call.expected_grant_revision,0);assert.equal(call.expected_request_revision,0);assert.ok(call.expiry.endsWith('Z'));
  assert.match(s.confirmations[0],/learner@example.invalid.*PMP/);assert.match(s.confirmations[0],/Expiry/);s.dom.window.close();
});
test('cancelled confirmation and invalid expiry produce no writes',async()=>{
  const s=screen();await s.start();await s.search();s.window.document.querySelector('[data-exam=pmp]').click();
  s.el('exam-grant-expiry').value='2000-01-01T00:00';s.submit('exam-access-edit','exam-grant');assert.equal(s.calls.length,2);
  s.el('exam-grant-expiry').value='';s.window.confirm=()=>false;s.submit('exam-access-edit','exam-grant');assert.equal(s.calls.length,2);s.dom.window.close();
});
test('approval and decline use fresh account details after opening a request',async()=>{
  const pending=account();pending.exams[0].request_status='pending';pending.exams[0].request_revision=7;
  const s=screen(async args=>({data:args.operation==='requests'?{requests:[{user_id:'learner-id',email:pending.email,badge:'PMP',exam_key:'pmp',requested_at:'2026-01-01'}],next_cursor:null}:pending}));
  await s.start();s.el('exam-requests-refresh').click();await flush();s.el('exam-request-list').querySelector('button').click();await flush();
  assert.equal(s.calls.at(-1).operation,'account');assert.equal(s.el('exam-grant').hidden,true);assert.equal(s.el('exam-approve').hidden,false);
  s.submit('exam-access-edit','exam-decline');await flush();assert.equal(s.calls.at(-1).expected_request_revision,7);assert.equal(s.calls.at(-1).operation,'decline');
  assert.match(s.confirmations[0],/does not revoke/);assert.equal(s.el('exam-request-list').children.length,0);s.dom.window.close();
});
test('next-page cursor is passed unchanged and only one page is retained',async()=>{
  const cursor={after_time:'2026-01-01T00:00:00Z',after_user:'user',after_exam:'pmp'};
  const s=screen(async args=>({data:{requests:[],next_cursor:args.after_time?null:cursor}}));await s.start();
  s.el('exam-requests-refresh').click();await flush();s.el('exam-requests-next').click();await flush();
  assert.deepEqual(JSON.parse(JSON.stringify(s.calls.at(-1))),{operation:'requests',...cursor});assert.equal(s.el('exam-requests-next').hidden,true);s.dom.window.close();
});
test('account switches discard late personal data and an old completion cannot unlock new work',async()=>{
  const pending=deferred(),current=deferred();let n=0;
  const s=screen(()=>++n===1?pending.promise:current.promise);await s.start();s.el('exam-member-email').value='old@example.invalid';s.submit('exam-member-search');
  s.change({id:'new-admin'});await flush();s.el('exam-member-email').value='new@example.invalid';s.submit('exam-member-search');
  pending.resolve({data:account()});await flush();assert.equal(s.el('exam-member').hidden,true);assert.equal(s.el('exam-admin-controls').inert,true);
  current.resolve({data:account({email:'new@example.invalid'})});await flush();assert.equal(s.el('exam-member-title').textContent,'new@example.invalid');
  s.change(null);assert.equal(s.el('exam-member-title').textContent,'');assert.equal(s.el('exam-request-list').textContent,'');s.dom.window.close();
});
test('double submits are coalesced and failure clears stale editing state',async()=>{
  const pending=deferred();const s=screen(args=>args.operation==='grant'?pending.promise:Promise.resolve({data:account()}));
  await s.start();await s.search();s.window.document.querySelector('[data-exam=pmp]').click();
  s.submit('exam-access-edit','exam-grant');s.submit('exam-access-edit','exam-grant');assert.equal(s.calls.filter(c=>c.operation==='grant').length,1);
  pending.resolve({error:{message:'This exam access changed.',code:'40001'}});await flush();
  assert.equal(s.el('exam-access-edit').hidden,true);assert.equal(s.el('exam-member').hidden,true);assert.match(s.el('exam-admin-status').textContent,/Reload/);s.dom.window.close();
});
test('unpublished exams and administrator inheritance cannot be changed from the form',async()=>{
  const s=screen();await s.start();await s.search();s.window.document.querySelector('[data-exam=cqa]').click();
  assert.equal(s.el('exam-grant').disabled,true);s.submit('exam-access-edit','exam-grant');assert.equal(s.calls.length,2);s.dom.window.close();
  const a=account({is_administrator:true,can_receive_grants:false});a.exams[0].access_status='administrator';a.exams[0].grant_status='active';
  const admin=screen(async()=>({data:a}));await admin.start();await admin.search();admin.window.document.querySelector('[data-exam=pmp]').click();
  assert.equal(admin.el('exam-revoke').disabled,true);assert.equal(admin.el('exam-grant').disabled,true);admin.dom.window.close();
});
test('untrusted email and history render as text; there is no polling or local account storage',async()=>{
  const payload='<img src=x onerror=alert(1)>';
  const s=screen(async()=>({data:account({email:payload})}));await s.start();await s.search();
  assert.equal(s.el('exam-member-title').textContent,payload);assert.equal(s.el('exam-member-title').children.length,0);
  assert.doesNotMatch(read('admin-exam-access.js'),/innerHTML|setInterval|localStorage|sessionStorage|\.channel\(/);s.dom.window.close();
});
