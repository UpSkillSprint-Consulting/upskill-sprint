(function () {
  'use strict';
  const tool=document.body.dataset.toolShell;
  const host=document.getElementById('tool-access-content');
  const status=document.getElementById('tool-access-status');
  const route=window.location.pathname;
  let auth,userId,revision=0,frame=null,blobs=[],controller=null,checking=null,installed=false,authTimer;
  function dispose() {
    if(frame)frame.remove();frame=null;
    blobs.forEach(url=>URL.revokeObjectURL(url));blobs=[];
  }
  function show(title,detail,signIn=false,retry=false) {
    if(frame){frame.hidden=true;frame.inert=true;}
    status.hidden=false;status.replaceChildren();
    const h=document.createElement('h1');h.textContent=title;
    const p=document.createElement('p');p.textContent=detail;status.append(h,p);
    if(signIn){const a=document.createElement('a');a.href='/sign-in.html?next='+encodeURIComponent(route);a.textContent='Sign in';status.append(a);}
    if(retry){const b=document.createElement('button');b.type='button';b.textContent='Check access again';b.addEventListener('click',()=>window.location.reload());status.append(b);}
    const a=document.createElement('a');a.href='/engineering-tools';a.textContent='View tool access';status.append(a);
  }
  function unlock(){status.hidden=true;if(frame){frame.hidden=false;frame.inert=false;}}
  function deny(error) {
    revision++;if(controller)controller.abort();dispose();
    const code=error?.status;
    show(code===403?'🔒 This tool is locked':code===401?'Sign in to open this tool':'We could not check your access',
      code===403?'An administrator must grant access to this tool. You can request access from Engineering Tools.':code===401?'Use the account your administrator approved.':'The tool stays closed until access is confirmed. Please try again.',code===401,true);
  }
  async function request(checkOnly) {
    const version=revision,expected=userId,client=auth.getClient();
    if(!client)throw {status:503};
    const result=await client.auth.getSession(),session=result?.data?.session;
    if(version!==revision||result.error||!session?.access_token||session.user.id!==expected)throw {status:401};
    const current=new AbortController();controller=current;
    const timer=setTimeout(()=>current.abort(),12000);
    try {
      const response=await fetch('/.netlify/functions/tool-content?tool='+encodeURIComponent(tool)+(checkOnly?'&check=1':''),{
        headers:{Authorization:'Bearer '+session.access_token},credentials:'omit',cache:'no-store',signal:current.signal
      });
      if(!response.ok)throw {status:response.status};
      const data=await response.json();
      if(version!==revision||auth.getUser()?.id!==expected)throw {status:401};
      if(data?.tool!==tool||checkOnly&&data.allowed!==true)throw {status:503};
      return data;
    }finally{clearTimeout(timer);if(controller===current)controller=null;}
  }
  function check(){
    if(!checking){const task=request(true).finally(()=>{if(checking===task)checking=null;});checking=task;}
    return checking;
  }
  function documentFor(packet) {
    if(packet.version!==1||packet.tool!==tool||typeof packet.html!=='string'||!packet.assets)throw {status:503};
    const urls={},visiting=new Set(),paths=Object.keys(packet.assets);
    function rewrite(source){for(const path of paths)if(source.includes(path))source=source.split(path).join(asset(path));return source;}
    function asset(path){
      if(urls[path])return urls[path];
      const entry=packet.assets[path];
      if(visiting.has(path)||!entry||!['text/javascript','text/css'].includes(entry.type)||typeof entry.source!=='string')throw {status:503};
      visiting.add(path);
      const content=rewrite(entry.source);
      visiting.delete(path);
      // Keep filenames in the fragment for the existing ordered module loaders.
      const url=URL.createObjectURL(new Blob([content],{type:entry.type}));blobs.push(url);
      urls[path]=url+'#'+path;return urls[path];
    }
    let html=rewrite(packet.html);
    const prefix='upskill-tool:'+tool+':'+userId+':';
    // Only application scripts use these adapters. Auth/theme storage is unchanged.
    // Never import a former account's unscoped browser workspace automatically.
    const bootstrap=`(function(){
      var prefix=${JSON.stringify(prefix)};
      function scoped(store){return {getItem:function(k){return store.getItem(prefix+k)},setItem:function(k,v){store.setItem(prefix+k,v)},removeItem:function(k){store.removeItem(prefix+k)},clear:function(){Object.keys(store).filter(function(k){return k.indexOf(prefix)===0}).forEach(function(k){store.removeItem(k)})},key:function(n){return Object.keys(store).filter(function(k){return k.indexOf(prefix)===0})[n]?.slice(prefix.length)},get length(){return Object.keys(store).filter(function(k){return k.indexOf(prefix)===0}).length}}}
      window.ToolLocalStorage=scoped(window.localStorage);window.ToolSessionStorage=scoped(window.sessionStorage);
      document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var id=a.getAttribute('href').slice(1),target=document.getElementById(id);if(target){e.preventDefault();target.scrollIntoView();}});
    }());`;
    const base=window.location.href.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    html=html.replace(/<head\b[^>]*>/i,tag=>tag+'<base href="'+base+'" target="_top"><script>'+bootstrap+'</script>');
    return html;
  }
  async function load() {
    const version=revision;
    show('Opening your tool','Checking access and loading your workspace…');
    try {
      const envelope=await request(false);
      if(envelope.version!==1||envelope.encoding!=='gzip'||typeof envelope.data!=='string'||!window.DecompressionStream)throw {status:503};
      const bytes=Uint8Array.from(atob(envelope.data),c=>c.charCodeAt(0));
      const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
      const packet=JSON.parse(await new Response(stream).text());
      if(version!==revision||auth.getUser()?.id!==userId)return;
      const html=documentFor(packet);
      frame=document.createElement('iframe');frame.id='tool-workspace';frame.title='Engineering tool workspace';frame.hidden=true;
      frame.addEventListener('load',()=>{if(version===revision)unlock();},{once:true});
      frame.srcdoc=html;host.replaceChildren(frame);
    }catch(error){if(version===revision)deny(error);}
  }
  function changed(user){
    clearTimeout(authTimer);
    const next=user?.id||null;if(next===userId)return;
    revision++;if(controller)controller.abort();checking=null;dispose();userId=next;
    const version=revision;
    Promise.resolve().then(()=>{if(version!==revision)return;if(!userId)deny({status:401});else load();});
  }
  function resume(){
    if(!frame||document.visibilityState==='hidden')return;
    const version=revision;show('Checking tool access','Checking your access before returning to the tool.');
    check().then(()=>{if(version===revision)unlock();}).catch(error=>{if(version===revision)deny(error);});
  }
  function install(){
    if(installed||!window.UpskillAuth)return;installed=true;auth=window.UpskillAuth;
    if(!auth.isConfigured()){deny({status:503});return;}
    auth.onChange(changed);
  }
  authTimer=setTimeout(()=>{if(!frame)deny({status:503});},12000);
  document.addEventListener('upskill-auth-ready',install,{once:true});install();
  window.addEventListener('focus',resume);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')resume();});
  window.addEventListener('pageshow',event=>{if(event.persisted)resume();});
  window.addEventListener('pagehide',()=>{if(frame){frame.hidden=true;frame.inert=true;}});
}());
