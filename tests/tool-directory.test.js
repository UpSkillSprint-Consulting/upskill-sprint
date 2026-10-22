const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const {JSDOM}=require('jsdom');
const read=p=>readFileSync(join(__dirname,'..',p),'utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
const guidePaths={material_checker:'/tools/material-specification-compliance-checker/how-to-use/',material_lookup:'/engineering-tools/grade-specification-lookup/how-to-use/',steel_explorer:'/tools/steel-phase-explorer/how-to-use/'};
const publicGuides=s=>Object.entries(guidePaths).forEach(([key,path])=>assert.equal(s.card(key).querySelector('.tool-content a').getAttribute('href'),path));
const rows=()=>['material_checker','material_lookup','steel_explorer'].map(tool_key=>({tool_key,publication_status:'published',access_status:'locked',can_use:false,request_revision:0}));
function screen(handler){
  const dom=new JSDOM(read('engineering-tools.html'),{url:'https://example.invalid/engineering-tools',runScripts:'outside-only'});
  let current=null,change;const calls=[];
  dom.window.UpskillAuth={isConfigured:()=>true,getUser:()=>current,onChange:fn=>change=fn,getClient:()=>({rpc:(name,args)=>{
    calls.push({name,args});return {abortSignal:signal=>handler(name,args,signal)};
  }})};
  dom.window.eval(read('tool-directory.js'));
  return {dom,calls,card:key=>dom.window.document.querySelector('[data-tool="'+key+'"]'),
    async session(user){current=user;change(user);await flush();await flush();},
    status:()=>dom.window.document.getElementById('tool-directory-status').textContent};
}
test('anonymous users see three locks and sign-in links without personal database calls',async()=>{
  const s=screen(()=>{throw Error('unexpected RPC');});await s.session(null);
  assert.equal(s.calls.length,0);publicGuides(s);
  for(const row of rows()){
    const card=s.card(row.tool_key);assert.match(card.querySelector('.tool-status').textContent,/Locked/);
    assert.match(card.querySelector('.tool-access-controls a').textContent,/Sign in/);assert.equal(card.querySelector('button'),null);
  }s.dom.window.close();
});
test('request, cancellation, one grant and revocation render truthful per-tool actions',async()=>{
  let current=rows();
  const s=screen(async(name,args)=>{
    if(name==='request_tool_access'){
      const row=current.find(row=>row.tool_key===args.requested_tool_key);assert.equal(args.expected_revision,row.request_revision);
      row.request_revision++;row.request_status=args.operation==='cancel'?'cancelled':'pending';row.access_status=args.operation==='cancel'?'locked':'pending';return {data:{status:row.request_status}};
    }return {data:current.map(r=>({...r}))};
  });await s.session({id:'learner'});
  s.card('material_checker').querySelector('button').click();await flush();await flush();
  assert.equal(s.calls.at(-2).name,'request_tool_access');assert.match(s.card('material_checker').textContent,/Request pending/);
  assert.equal(s.card('material_checker').querySelector('.tool-access-controls a'),null);publicGuides(s);
  s.card('material_checker').querySelector('button').click();await flush();await flush();
  assert.match(s.status(),/cancelled/);publicGuides(s);
  current[0]={...current[0],can_use:true,access_status:'granted'};await s.session({id:'learner'});
  assert.match(s.card('material_checker').querySelector('.tool-access-controls a').href,/material-specification-compliance-checker$/);
  assert.equal(s.card('material_lookup').querySelector('.tool-access-controls a'),null);publicGuides(s);
  current[0]={...current[0],can_use:false,access_status:'revoked'};await s.session({id:'learner'});
  assert.match(s.card('material_checker').textContent,/Access revoked/);assert.equal(s.card('material_checker').querySelector('.tool-access-controls a'),null);publicGuides(s);s.dom.window.close();
});
test('late account results, malformed data and RPC failures cannot unlock a card',async()=>{
  let resolve;const pending=new Promise(r=>resolve=r);const s=screen(()=>pending);
  await s.session({id:'old'});await s.session(null);resolve({data:rows().map(r=>({...r,can_use:true,access_status:'granted'}))});await flush();
  assert.match(s.card('material_checker').querySelector('.tool-access-controls a').textContent,/Sign in/);s.dom.window.close();
  for(const data of [[],null,[...rows(),rows()[0]]]){
    const bad=screen(async()=>({data}));await bad.session({id:'learner'});
    assert.match(bad.status(),/couldn’t confirm/);assert.equal(bad.card('material_checker').querySelector('.tool-access-controls a'),null);bad.dom.window.close();
  }
});
test('both site-wide label writers preserve per-account locked and granted states',()=>{
  const s=screen(async()=>({data:rows()}));const {window}=s.dom;
  const site=read('site-sections.js'),cleanup=read('arrow-cleanup.js');
  window.eval("function isEngineeringToolsPage(){return true} function normalizedCurrentPath(){return '/engineering-tools'}"+
    site.slice(site.indexOf('  function activateToolCard('),site.indexOf('  function activateAvailableTools('))+
    cleanup.slice(cleanup.indexOf('  function repairEngineeringToolsCleanRoute('),cleanup.indexOf('  function scheduleScan(')));
  const before=s.card('material_checker').outerHTML;
  window.eval("activateToolCard({cardId:'materials-quality',path:'/wrong'});repairEngineeringToolsCleanRoute();");
  assert.equal(s.card('material_checker').outerHTML,before);s.dom.window.close();
});
