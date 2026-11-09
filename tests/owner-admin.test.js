const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = p => fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
test('admin theme switch toggles both ways and persists via the shared controller', () => {
 // The switch is now rendered by the shared admin header (admin-shell.js) after the owner check.
 const html=read('admin-access.html'), shellSource=read('admin-shell.js');
 assert.match(shellSource, /el\('button', 'theme-toggle'\)/);
 assert.match(shellSource, /setAttribute\('data-theme-toggle', 'true'\)/);
 assert.match(shellSource, /setAttribute\('role', 'switch'\)/);
 assert.ok(html.indexOf('src="/theme.js"') > -1 && html.indexOf('src="/admin-shell.js"') < html.indexOf('src="/admin-access.js"'));
 const events={}, saved={};
 class Element {constructor(){this.dataset={};this.attrs={};} closest(){return this;} setAttribute(k,v){this.attrs[k]=v;}}
 const toggle=new Element();
 const root={dataset:{},style:{}};
 const meta={};
 vm.runInNewContext(read('theme.js'), {Element,CustomEvent:class {},
   localStorage:{getItem:k=>saved[k]||'dark',setItem:(k,v)=>{saved[k]=v;}},
   document:{documentElement:root,readyState:'loading',head:{appendChild(){}},
     querySelector:()=>meta, querySelectorAll:()=>[toggle],getElementById:()=>null,
     createElement:()=>({}),addEventListener:(event,fn)=>{events[event]=fn;}},
   window:{location:{pathname:'/admin-access'},matchMedia:()=>({matches:false}),dispatchEvent(){},addEventListener(){}}
 });
 assert.equal(root.dataset.theme,'dark');
 events.click({target:toggle,preventDefault(){}});
 assert.equal(root.dataset.theme,'light');assert.equal(saved['upskill-theme'],'light');
 assert.equal(toggle.attrs['aria-checked'],'false');
 events.click({target:toggle,preventDefault(){}});
 assert.equal(root.dataset.theme,'dark');assert.equal(saved['upskill-theme'],'dark');
 assert.equal(toggle.attrs['aria-label'],'Switch to light mode');
});
const flush = () => new Promise(resolve => setImmediate(resolve));
function screen(rpc) {
 const dom=new JSDOM(read('admin-access.html'),{runScripts:'outside-only',url:'https://example.invalid/admin-access'});
 const {window}=dom; let change;
 window.confirm=()=>{throw new Error('Native browser confirmation must not be used');};
 window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
 window.HTMLDialogElement.prototype.close=function(){this.open=false;};
 const shell={mounts:[],denied:[],toasts:[]};
 window.UpskillAdminShell={mount:o=>{shell.mounts.push(JSON.parse(JSON.stringify(o)));},unmount(){},
  renderDenied:(c,o)=>{shell.denied.push(JSON.parse(JSON.stringify(o)));c.replaceChildren(Object.assign(window.document.createElement('section'),{className:'adm-denied'}));},
  checkOwner:()=>{throw new Error('the page runs its own owner check');},toast:(m,o)=>{shell.toasts.push({message:m,tone:o.tone});}};
 window.UpskillAuth={isConfigured:()=>true,getClient:()=>({rpc}),onChange:fn=>{change=fn;}};
 window.eval(read('admin-access.js'));
 const node=id=>window.document.getElementById(id);
 return {dom,window,node,shell,change:user=>change(user)};
}
test('screen locks non-owner and signed-out users without searching', async () => {
 const calls=[];
 const s=screen((name,args)=>{calls.push([name,args.operation]);return Promise.resolve({error:{message:'Denied'}});});
 s.change(null); assert.equal(s.node('admin-controls'),null);
 assert.deepEqual(s.shell.denied.at(-1),{signedOut:true,next:'/admin-access'});
 s.change({id:'other'}); await flush();
 assert.equal(s.node('admin-controls'),null); assert.deepEqual(s.shell.mounts,[]);
 assert.deepEqual(s.shell.denied.at(-1),{signedOut:false,next:'/admin-access'});
 assert.deepEqual(calls,[['owner_manage_access','status']]);
 s.dom.window.close();
});
test('owner search and confirmed save are explicit and sign-out clears account', async () => {
 const calls=[];
 const account={found:true,email:'test@example.invalid',user_id:'target',effective_level:'registered',grant:null,history:[],is_owner:false};
 const s=screen((name,args)=>{assert.equal(name,'owner_manage_access');calls.push(args); return Promise.resolve({data:args.operation==='status'?{owner:true}:account});});
 s.change({id:'owner'}); await flush();
 assert.equal(calls.length,1); assert.equal(s.node('admin-controls').hidden,false);
 assert.deepEqual(s.shell.mounts,[{page:'accounts',isOwner:true}]);
 s.node('account-email').value='test@example.invalid';
 s.node('admin-search').dispatchEvent(new s.window.Event('submit',{cancelable:true})); await flush();
 assert.equal(calls[1].operation,'search');
 s.node('access-level-premium').checked=true;
 s.node('admin-edit').dispatchEvent(new s.window.Event('submit',{cancelable:true})); await flush();
 assert.equal(calls.length,2,'nothing is saved before confirmation');
 assert.equal(s.node('access-confirm-dialog').open,true);
 assert.match(s.node('access-confirm-summary').textContent,/test@example\.invalid[\s\S]*Premium/);
 s.node('access-confirm-ok').click(); await flush();
 assert.equal(calls[2].operation,'save'); assert.equal(calls[2].target_id,'target');
 assert.equal(calls[2].new_level,'premium'); assert.equal(calls[2].expected_grant,null);
 assert.equal(s.shell.toasts.at(-1).tone,'success');
 s.change(null); assert.equal(s.node('admin-controls'),null);
 assert.doesNotMatch(s.window.document.body.textContent,/test@example\.invalid/);
 s.dom.window.close();
});
test('owner RPC facade is invoker-safe and implementation checks identity', () => {
 const sql=read('supabase/owner-access-admin.sql');
 assert.match(sql,/actor_id uuid := auth.uid\(\)/);
 assert.match(sql,/Only the site owner/);
 assert.match(sql,/public.owner_manage_access[\s\S]*security invoker/);
 assert.match(sql,/revoke all on function public.owner_manage_access[\s\S]*from public,anon,authenticated/);
 assert.match(sql,/alter table access_private.access_history enable row level security/);
 assert.doesNotMatch(sql,/user_metadata|raw_user_meta_data/);
});
test('save validates level, expiry, owner lockout and stale state and records history', () => {
 const sql=read('supabase/owner-access-admin.sql');
 for(const text of ['for update','Owner access cannot be changed','expiry<=now()','old_grant is distinct from expected_grant','insert into access_private.access_history','limit 10']) assert.ok(sql.includes(text));
});
test('admin UI has explicit search/save, no polling and no secret keys', () => {
 const js=read('admin-access.js');
 // The native confirm() was replaced by the confirmation <dialog>; the browser prompt must not return.
 assert.match(js,/showModal\(\)/);
 assert.doesNotMatch(js,/window\.confirm|\bconfirm\(/);
 assert.match(js,/expected_grant:current.grant/);
 assert.match(js,/check !== revision/);
 assert.doesNotMatch(js,/setInterval|service_role|\.channel\(|innerHTML/);
 const html=read('admin-access.html');
 // Controls are no longer shipped hidden: they are absent until the owner check passes.
 assert.doesNotMatch(html,/admin-controls|<form|<input|<select|<button/);
 assert.match(html,/aria-live="polite"/);
});
