(function(){
  'use strict';
  const cards=Array.from(document.querySelectorAll('[data-tool]'));
  const byId=id=>document.getElementById(id);
  const labels={locked:'Locked',pending:'Request pending',granted:'Access granted',expired:'Access expired',revoked:'Access revoked',declined:'Request declined',loading:'Checking access',unavailable:'Access unavailable'};
  let auth,user=null,rows=[],phase='loading',version=0,active=null,reading=null,busy=false,initialized=false;
  const notice=text=>{byId('tool-directory-status').textContent=text;};
  function node(tag,text,className){const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el;}
  function lock(){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    for(const [k,v]of Object.entries({viewBox:'0 0 24 24',width:16,height:16,fill:'none',stroke:'currentColor','stroke-width':1.8,'aria-hidden':'true'}))svg.setAttribute(k,v);
    const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d','M5 10h14v11H5z M8 10V7a4 4 0 0 1 8 0v3');svg.append(p);return svg;
  }
  function render(){
    cards.forEach(card=>{
      const row=rows.find(r=>r.tool_key===card.dataset.tool);
      const state=phase==='ready'?(row?.can_use?'granted':row?.access_status||'locked'):phase==='signedout'?'locked':phase;
      const status=card.querySelector('.tool-status'),controls=card.querySelector('.tool-access-controls');
      status.dataset.state=state;status.replaceChildren();if(state!=='granted')status.append(lock());status.append(document.createTextNode(labels[state]||'Locked'));
      controls.replaceChildren();
      function link(text,href,primary=false){const a=node('a',text,'tool-action'+(primary?' primary':''));a.href=href;controls.append(a);}
      function action(text,operation){const b=node('button',text,'tool-action');b.type='button';b.disabled=busy;b.addEventListener('click',()=>change(row,operation));controls.append(b);return b;}
      if(state==='granted'){
        link('Open tool →',card.dataset.toolRoute,true);
        if(row.expires_at)controls.append(node('p','Access expires: '+new Date(row.expires_at).toLocaleString()));
      }else if(phase==='signedout')link('Sign in to request access','/sign-in.html?next='+encodeURIComponent('/engineering-tools#'+card.id));
      else if(phase!=='ready'){
        const b=node('button',phase==='loading'?'Checking access…':'Refresh to check access','tool-action');b.type='button';b.disabled=true;controls.append(b);
      }else if(state==='pending'){
        controls.append(node('p','Awaiting administrator approval. The tool stays locked.'));action('Cancel request','cancel');
      }else{
        controls.append(node('p',state==='revoked'?'Your previous access was revoked.':state==='expired'?'Your access has expired.':state==='declined'?'Your previous request was declined.':'Administrator approval is required.'));
        const b=action(['revoked','expired'].includes(state)?'Request renewed access':'Request access','request');
        const retry=row?.requested_at?new Date(row.requested_at).getTime()+86400000:0;
        if(row?.request_status&&retry>Date.now()){b.disabled=true;controls.append(node('p','You can request again after '+new Date(retry).toLocaleString()+'.'));}
      }
    });
    byId('tool-directory-refresh').disabled=phase==='loading'||busy;
  }
  function valid(data){
    if(!Array.isArray(data)||data.length!==cards.length)throw Error('Invalid tool directory');
    const keys=new Set(cards.map(c=>c.dataset.tool)),seen=new Set();
    for(const row of data){
      if(!row||!keys.has(row.tool_key)||seen.has(row.tool_key)||typeof row.can_use!=='boolean'||!['locked','pending','granted','expired','revoked','declined'].includes(row.access_status)||
        row.publication_status!=='published'||!Number.isSafeInteger(row.request_revision)||row.request_revision<0||
        row.expires_at&&!Number.isFinite(new Date(row.expires_at).getTime())||row.requested_at&&!Number.isFinite(new Date(row.requested_at).getTime()))throw Error('Invalid tool directory');
      seen.add(row.tool_key);
    }return data;
  }
  async function rpc(name,args){
    const client=auth?.getClient();if(!client)throw Error('Accounts unavailable');
    const controller=new AbortController();active=controller;let timer;
    try{
      const response=await Promise.race([client.rpc(name,args).abortSignal(controller.signal),new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('Timed out'));},12000);})]);
      if(!response||response.error)throw Object.assign(Error(response?.error?.message||'Request failed'),{code:response?.error?.code});
      return response.data;
    }finally{clearTimeout(timer);if(active===controller)active=null;}
  }
  function load(message){
    if(reading)return reading;
    if(!user){phase='signedout';rows=[];render();notice('Sign in to see your assigned tools and request access.');return Promise.resolve();}
    const check=++version,id=user.id;phase='loading';rows=[];render();notice('Checking your tool access…');
    const task=Promise.resolve().then(()=>{if(check===version)return rpc('get_my_tool_directory',{});}).then(data=>{
      if(check!==version||auth.getUser()?.id!==id)return;rows=valid(data);phase='ready';render();
      const count=rows.filter(row=>row.can_use).length;notice(message||count+' of 3 protected tools available to your account. Request access to any locked tool below.');
    }).catch(()=>{if(check!==version)return;rows=[];phase='unavailable';render();notice('We couldn’t confirm tool access. Refresh to try again.');})
      .finally(()=>{if(reading===task)reading=null;});
    reading=task;return task;
  }
  async function change(row,operation){
    if(!row||phase!=='ready'||busy||!user||auth.getUser()?.id!==user.id)return;
    const check=version;busy=true;render();notice(operation==='request'?'Sending your tool access request…':'Cancelling your request…');
    let message;
    try{
      const result=await rpc('request_tool_access',{requested_tool_key:row.tool_key,operation,expected_revision:row.request_revision});
      if(check!==version)return;message=result?.status==='pending'?'Request sent. An administrator will review it.':result?.status==='cancelled'?'Request cancelled.':'Review your refreshed access below.';
    }catch(error){if(check!==version)return;message=error.code==='22023'?error.message:error.code==='40001'?'Your access changed. Review the refreshed status.':'We couldn’t confirm the result. Review the refreshed status before retrying.';}
    busy=false;await load(message);
    if(phase==='ready')document.querySelector('[data-tool="'+row.tool_key+'"] .tool-action')?.focus();
  }
  function invalidate(){version++;if(active)active.abort();active=null;reading=null;busy=false;}
  function changed(next){invalidate();user=next;rows=[];phase=next?'loading':'signedout';render();Promise.resolve().then(()=>load());}
  function refresh(){if(busy||reading)return;if(!auth?.isConfigured()){phase='unavailable';rows=[];render();return;}const next=auth.getUser();if(next?.id!==user?.id)changed(next);else load();}
  function install(){if(initialized)return;auth=window.UpskillAuth;if(!auth?.isConfigured()){phase='unavailable';render();return;}initialized=true;auth.onChange(changed);}
  render();byId('tool-directory-refresh').addEventListener('click',refresh);
  window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh();});
  window.addEventListener('pageshow',event=>{if(event.persisted){invalidate();refresh();}});
  if(window.UpskillAuth)install();else document.addEventListener('upskill-auth-ready',install,{once:true});
  setTimeout(()=>{if(!initialized){phase='unavailable';render();notice('Account services are unavailable. Reload to try again.');}},12000);
}());
