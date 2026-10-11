const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const {gunzipSync}=require('node:zlib');
const {JSDOM}=require('jsdom');
const ROOT=path.join(__dirname,'..');
let createHandler,TOOLS;
const token='header.learner.signature';
const req=(query='tool=material_checker',authorization='Bearer '+token,method='GET')=>new Request('https://example.invalid/.netlify/functions/tool-content?'+query,{method,headers:authorization?{Authorization:authorization}:{}});
test.before(async()=>{
  ({createHandler}=await import('../netlify/functions/tool-content.mjs'));
  ({TOOLS}=await import('../content/tool-catalog.mjs'));
  execFileSync(process.execPath,['scripts/build-grade-specification-lookup.mjs'],{cwd:ROOT,stdio:'pipe'});
  await (await import('../scripts/stage-public-site.mjs')).stagePublicSite();
  await (await import('../scripts/build-tool-delivery.mjs')).buildToolDelivery();
});
function handler(value=true,options={}){
  const calls=[],reads=[];
  return {calls,reads,run:createHandler({getSettings:()=>({url:'https://test.supabase.co',key:'sb_publishable_test'}),request:async(url,init)=>{calls.push({url,init});return new Response(JSON.stringify(value));},loadPackage:async tool=>{reads.push(tool);return JSON.stringify({tool});},...options})};
}
test('anonymous, malformed, duplicate, traversal, forged-account and method requests fail before package reads',async()=>{
  const h=handler();
  for(const request of [req('tool=material_checker',''),req('tool=material_checker','Bearer forged'),req('tool=../material_checker'),req('tool=cssbb'),req('tool=material_checker&tool=steel_explorer'),req('tool=material_checker&user_id=admin'),req('tool=material_checker&access_token='+token),req('tool=material_checker&check=0'),req('tool=material_checker',undefined,'POST')]){
    assert.ok([400,401,404,405].includes((await h.run(request)).status));
  }assert.equal(h.calls.length,0);assert.equal(h.reads.length,0);
});
test('every package requires a fresh exact caller decision and disables browser/CDN caching',async()=>{
  const h=handler();
  for(const key of Object.keys(TOOLS)){
    const response=await h.run(req('tool='+key));assert.equal(response.status,200);assert.equal(h.reads.at(-1),key);
    const call=h.calls.at(-1);assert.equal(call.url,'https://test.supabase.co/rest/v1/rpc/can_access_tool');
    assert.deepEqual(JSON.parse(call.init.body),{requested_tool_key:key});assert.equal(call.init.headers.Authorization,'Bearer '+token);
    for(const name of ['cache-control','cdn-cache-control','netlify-cdn-cache-control'])assert.match(response.headers.get(name),/no-store/);
  }
  await h.run(req('tool=material_checker&check=1'));assert.equal(h.calls.length,4);assert.equal(h.reads.length,3);
});
test('revocation, expiry, invalid sessions and backend uncertainty never release a package',async()=>{
  for(const [value,status] of [[false,403],[null,503],['true',503],[{allowed:true},503]]){
    const h=handler(value);assert.equal((await h.run(req())).status,status);assert.equal(h.reads.length,0);
  }
  for(const status of [401,403,500]){
    const h=handler(true,{request:async()=>new Response('{}',{status})});assert.equal((await h.run(req())).status,status===401?401:503);assert.equal(h.reads.length,0);
  }
});
test('three public URLs contain only locked shells; runtime and lookup data are private',async()=>{
  await (await import('../scripts/audit-tool-public-content.mjs')).auditToolPublicContent();
  for(const [key,tool] of Object.entries(TOOLS)){
    const envelope=await fs.readFile(path.join(ROOT,'content/tool-delivery-generated',key+'.json'),'utf8');
    assert.ok(Buffer.byteLength(envelope)<5_500_000);
    const packet=JSON.parse(gunzipSync(Buffer.from(JSON.parse(envelope).data,'base64')));
    assert.equal(packet.tool,key);assert.ok(packet.html.length>1000);
    assert.doesNotMatch(packet.html,/data-required-access="administrator"/);
    for(const asset of Object.values(packet.assets))if(asset.type==='text/javascript')assert.doesNotMatch(asset.source,/\blocalStorage\b/);
    if(key==='material_lookup'){assert.match(packet.html,/SPEC_DATA/);assert.match(packet.html,/ToolLocalStorage/);}
  }
});
const tick=()=>new Promise(r=>setTimeout(r,10));
async function until(fn){for(let i=0;i<300;i++){if(fn())return;await tick();}assert.ok(fn(),'Expected loader state within 3 seconds');}
async function loader(key,suffix=''){
  const html=await fs.readFile(path.join(ROOT,'public-site',TOOLS[key].page),'utf8');
  const envelope=JSON.parse(await fs.readFile(path.join(ROOT,'content/tool-delivery-generated',key+'.json'),'utf8'));
  const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://example.invalid'+TOOLS[key].route+suffix});
  const {window}=dom;let user=null,change,allow=true,sequence=0;const revoked=[];
  Object.assign(window,{Blob,Response,DecompressionStream,TextDecoder});
  window.URL.createObjectURL=()=>('blob:https://example.invalid/'+(++sequence));window.URL.revokeObjectURL=url=>revoked.push(url);
  window.UpskillAuth={isConfigured:()=>true,getUser:()=>user,onChange:fn=>change=fn,getClient:()=>({auth:{getSession:async()=>({data:{session:user?{user,access_token:token}:null}})}})};
  window.fetch=async url=>new Response(JSON.stringify(url.includes('check=1')?{allowed:allow,tool:key}:envelope),{status:allow?200:403});
  window.eval(await fs.readFile(path.join(ROOT,'tool-access-loader.js'),'utf8'));
  return {dom,window,revoked,session:next=>{user=next;change(next);},deny:()=>allow=false};
}
test('all three real packages resolve dynamic modules and create an isolated authorized document',async()=>{
  for(const key of Object.keys(TOOLS)){
    const s=await loader(key);s.session({id:'learner'});
    await until(()=>s.window.document.querySelector('iframe')||s.window.document.querySelector('h1').textContent.includes('could not'));
    const frame=s.window.document.querySelector('iframe');assert.ok(frame,key+' must load');
    assert.match(frame.srcdoc,/upskill-tool:/);assert.match(frame.srcdoc,/<base href=/);
    assert.doesNotMatch(frame.srcdoc,/<script[^>]+src="\/tools\/(?:steel-phase|material-checker|material-specification)/);
    const doc=new JSDOM(frame.srcdoc,{runScripts:'outside-only',url:'https://example.invalid/'});
    doc.window.localStorage.setItem('legacy','old account');
    doc.window.eval(doc.window.document.querySelector('script').textContent);
    assert.equal(doc.window.ToolLocalStorage.getItem('legacy'),null);
    doc.window.ToolLocalStorage.setItem('draft','new');assert.equal(doc.window.localStorage.getItem('upskill-tool:'+key+':learner:draft'),'new');
    doc.window.close();s.dom.window.close();
  }
});
test('return-time revocation removes the frame and its blobs; account switches discard old work immediately',async()=>{
  const s=await loader('material_checker');s.session({id:'learner'});await until(()=>s.window.document.querySelector('iframe'));
  s.deny();s.window.dispatchEvent(new s.window.Event('focus'));
  await until(()=>s.window.document.querySelector('h1').textContent.includes('locked'));
  assert.equal(s.window.document.querySelector('iframe'),null);assert.ok(s.revoked.length);s.dom.window.close();
  const changed=await loader('steel_explorer');changed.session({id:'first'});await until(()=>changed.window.document.querySelector('iframe'));
  changed.session(null);assert.equal(changed.window.document.querySelector('iframe'),null);
  await until(()=>changed.window.document.querySelector('h1').textContent.includes('Sign in'));changed.dom.window.close();
});
test('protected Steel Explorer preserves shared scenario URLs inside its document',async()=>{
  const scenario={name:'Shared steel scenario'};
  const encoded=Buffer.from(JSON.stringify(scenario)).toString('base64');
  const href='https://example.invalid'+TOOLS.steel_explorer.route+'#spx='+encoded;
  const s=await loader('steel_explorer','#spx='+encoded);s.session({id:'learner'});
  await until(()=>s.window.document.querySelector('iframe'));
  const doc=new JSDOM(s.window.document.querySelector('iframe').srcdoc,{runScripts:'outside-only'});
  assert.equal(doc.window.document.baseURI,href);
  const envelope=JSON.parse(await fs.readFile(path.join(ROOT,'content/tool-delivery-generated/steel_explorer.json'),'utf8'));
  const packet=JSON.parse(gunzipSync(Buffer.from(envelope.data,'base64')));
  const app=packet.assets['/tools/steel-phase-explorer-app.js'].source;
  doc.window.serializable=()=>scenario;
  doc.window.eval(app.slice(app.indexOf('function shareUrl()'),app.indexOf('function copyLink()')));
  assert.equal(doc.window.shareUrl(),href);
  doc.window.close();s.dom.window.close();
});
