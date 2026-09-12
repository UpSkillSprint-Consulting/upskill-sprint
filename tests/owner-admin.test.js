const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = p => fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const vm = require('node:vm');
test('admin theme switch toggles both ways and persists via the shared controller', () => {
 const html=read('admin-access.html');
 assert.match(html, /class="theme-toggle" data-theme-toggle="true" role="switch"/);
 assert.ok(html.indexOf('class="theme-toggle"') < html.indexOf('id="admin-controls"'));
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
 const nodes = {};
 const node = id => nodes[id] || (nodes[id] = {hidden:true,value:'',disabled:false,events:{},children:[],
  addEventListener(event, fn) {this.events[event]=fn;}, replaceChildren() {this.children=[];}, appendChild(n) {this.children.push(n);}});
 let change;
 const auth={isConfigured:()=>true,getClient:()=>({rpc}),onChange:fn=>{change=fn;}};
 vm.runInNewContext(read('admin-access.js'), {document:{getElementById:node,createElement:()=>({})},window:{UpskillAuth:auth,confirm:()=>true}});
 return {node,change:user=>change(user)};
}
test('screen locks non-owner and signed-out users without searching', async () => {
 const s=screen(()=>Promise.resolve({error:{message:'Denied'}}));
 s.change(null); assert.equal(s.node('admin-controls').hidden,true);
 s.change({id:'other'}); await flush();
 assert.equal(s.node('admin-controls').hidden,true);
});
test('owner search and confirmed save are explicit and sign-out clears account', async () => {
 const calls=[];
 const account={found:true,email:'test@example.invalid',user_id:'target',effective_level:'registered',grant:null,history:[],is_owner:false};
 const s=screen((name,args)=>{calls.push(args); return Promise.resolve({data:args.operation==='status'?{owner:true}:account});});
 s.change({id:'owner'}); await flush();
 assert.equal(calls.length,1); assert.equal(s.node('admin-controls').hidden,false);
 s.node('account-email').value='test@example.invalid';
 s.node('admin-search').events.submit({preventDefault(){}}); await flush();
 assert.equal(calls[1].operation,'search');
 s.node('access-level').value='premium';
 s.node('admin-edit').events.submit({preventDefault(){}}); await flush();
 assert.equal(calls[2].operation,'save'); assert.equal(calls[2].target_id,'target');
 assert.equal(calls[2].new_level,'premium');
 s.change(null); assert.equal(s.node('admin-controls').hidden,true);
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
 assert.match(js,/window.confirm/);
 assert.match(js,/expected_grant:current.grant/);
 assert.match(js,/check !== revision/);
 assert.doesNotMatch(js,/setInterval|service_role|\.channel\(|innerHTML/);
 const html=read('admin-access.html');
 assert.match(html,/id="admin-controls" hidden/);
 assert.match(html,/aria-live="polite"/);
});
