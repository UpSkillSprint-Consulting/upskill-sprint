(function () {
  'use strict';
  const byId = id => document.getElementById(id);
  const defaults = Array.from(document.querySelectorAll('.exam-card'), card => ({
    exam_key:card.dataset.exam, display_name:card.querySelector('h3').textContent,
    badge:card.querySelector('.exam-acronym').textContent,publication_status:card.dataset.publication,
    can_practice:false,access_status:'locked',request_revision:0
  }));
  const EXAM_PREVIEWS = ['cssbb','cssgb','pmp'];
  const labels = {granted:'Access granted',locked:'Locked',pending:'Request pending',expired:'Access expired',revoked:'Access revoked',declined:'Request declined',coming_soon:'Coming soon',loading:'Checking access',unavailable:'Access unavailable'};
  let auth, user = null, phase = 'loading', rows = defaults, version = 0, active = null, reading = null, busy = false, initialized = false;
  const notice = text => { byId('exam-directory-status').textContent = text; };
  const signIn = key => '/sign-in.html?next=' + encodeURIComponent('/exam-practice' + (key ? '#exam-'+key : ''));
  function node(tag,text,className) {
    const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el;
  }
  function lockIcon() {
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    for(const [key,value] of Object.entries({viewBox:'0 0 24 24',width:16,height:16,fill:'none',stroke:'currentColor','stroke-width':1.8,'aria-hidden':'true'})) svg.setAttribute(key,value);
    const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d','M5 10h14v11H5z M8 10V7a4 4 0 0 1 8 0v3');svg.appendChild(path);return svg;
  }
  function state(row) {
    if(row.publication_status==='coming_soon') return 'coming_soon';
    if(phase==='loading'||phase==='unavailable') return phase;
    if(phase==='signedout') return 'locked';
    // The endpoint remains authoritative; this additionally avoids offering an expired link.
    if(row.can_practice===true && (!row.expires_at || new Date(row.expires_at)>new Date())) return 'granted';
    if(row.request_status==='pending') return 'pending';
    if(row.can_practice===true && row.expires_at) return 'expired';
    return ['expired','revoked','declined'].includes(row.access_status)?row.access_status:'locked';
  }
  function button(text,action,row) {
    const el=node('button',text,'btn exam-card-action');el.type='button';el.disabled=busy;
    el.dataset.action=action;el.addEventListener('click',()=>changeRequest(row,action));return el;
  }
  function renderCard(row) {
    const status=state(row), card=node('article','','exam-card');card.id='exam-'+row.exam_key;
    card.dataset.exam=row.exam_key;card.dataset.state=status;card.dataset.publication=row.publication_status;
    card.appendChild(node('h3',row.display_name));
    const meta=node('p','','exam-card-meta'), pill=node('span','','exam-status');
    if(!['granted','coming_soon'].includes(status)) pill.appendChild(lockIcon());
    pill.appendChild(document.createTextNode(labels[status]));meta.append(node('span',row.badge,'exam-acronym'),pill);card.appendChild(meta);
    card.appendChild(node('p',status==='coming_soon'?'This certification is being prepared.':'All released sets · Timed or untimed','exam-card-detail'));
    if(status==='coming_soon') { card.appendChild(node('p','Requests open when this exam is released.','exam-card-note'));return card; }
    if(row.expires_at && phase==='ready') card.appendChild(node('p',(status==='expired'?'Expired ': 'Access expiry: ')+new Date(row.expires_at).toLocaleString(),'exam-card-detail'));
    const controls=node('div','','exam-card-controls');
    if(status==='granted') {
      const link=node('a','Start practicing →','btn btn-teal exam-card-action');link.href='/test-bank?exam='+encodeURIComponent(row.exam_key);
      controls.appendChild(link);
    } else if(phase==='signedout') {
      const link=node('a','Sign in to request access','btn exam-card-action');link.href=signIn(row.exam_key);controls.appendChild(link);
    } else if(phase!=='ready') {
      const disabled=node('button',phase==='loading'?'Checking access…':'Refresh to check access','btn exam-card-action');disabled.type='button';disabled.disabled=true;controls.appendChild(disabled);
    } else if(status==='pending') {
      controls.appendChild(node('p','Your request is with an administrator. Access stays locked until approved.','exam-card-note'));
      controls.appendChild(button('Cancel request','cancel',row));
    } else {
      const detail=status==='revoked'?'Your previous access was revoked. You can request a review.':status==='expired'?'Request renewed access to continue practicing.':status==='declined'?'Your previous request was declined. Contact us if you need help.':'Administrator approval is required to open this exam.';
      controls.appendChild(node('p',detail,'exam-card-note'));
      const request=button(['expired','revoked'].includes(status)?'Request renewed access':'Request access','request',row);
      const retryAt=row.requested_at?new Date(row.requested_at).getTime()+86400000:0;
      if(row.request_status && retryAt>Date.now()) {
        request.disabled=true;controls.appendChild(node('p','You can request again after '+new Date(retryAt).toLocaleString()+'.','exam-card-note'));
      }
      controls.appendChild(request);
    }
    // The free ExamPreviews are public; offer them to anyone without access to that exam.
    if(EXAM_PREVIEWS.includes(row.exam_key)&&status!=='granted'){const preview=node('a','Try 20 free questions (ExamPreview) →','exam-card-preview');preview.href='/exam-preview/'+row.exam_key;controls.appendChild(preview);}
    card.appendChild(controls);return card;
  }
  function filter() {
    const query=byId('exam-directory-search').value.trim().toLocaleLowerCase();let visible=0;
    document.querySelectorAll('.exam-card').forEach(card=>{
      const text=card.querySelector('h3').textContent+' '+card.querySelector('.exam-acronym').textContent;
      card.hidden=!!query&&!text.toLocaleLowerCase().includes(query);if(!card.hidden)visible++;
    });
    byId('exam-search-count').textContent=query?visible+' matching certification'+(visible===1?'':'s'):'';
    byId('exam-no-results').hidden=!query||visible>0;
    if(query) byId('my-exams-empty').hidden=true;
    else byId('my-exams-empty').hidden=byId('my-exams-grid').children.length>0;
  }
  function render() {
    document.body.dataset.directoryPhase=phase;
    for(const id of ['my-exams-grid','explore-exams-grid','upcoming-exams-grid']) byId(id).replaceChildren();
    let mine=0,pending=0,released=0,upcoming=0;
    rows.forEach(row=>{
      if(row.publication_status==='retired')return;
      const status=state(row);if(status==='granted')mine++;if(status==='pending')pending++;
      if(row.publication_status==='published')released++;else upcoming++;
      byId(status==='coming_soon'?'upcoming-exams-grid':status==='granted'?'my-exams-grid':'explore-exams-grid').appendChild(renderCard(row));
    });
    document.querySelector('.category-count').textContent=released+' released · '+upcoming+' coming soon';
    byId('my-exams-count').textContent=String(mine);byId('exam-requests-count').textContent=pending?pending+' pending request'+(pending===1?'':'s'):'';
    byId('my-exams-empty-title').textContent=phase==='loading'?'Checking your exams…':phase==='unavailable'?'We couldn’t confirm your access.':phase==='signedout'?'Your exams will appear here.':'No exams assigned yet.';
    byId('my-exams-empty-detail').textContent=phase==='loading'?'Your assigned certifications will appear here shortly.':phase==='unavailable'?'Use Refresh access to try again. Your exams stay closed until access is confirmed.':phase==='signedout'?'Sign in to see the certifications assigned to your account.':'Choose a certification below and request access from an administrator.';
    byId('exam-directory-signin').hidden=phase!=='signedout';
    byId('explore-exams-empty').hidden=byId('explore-exams-grid').children.length>0;
    byId('upcoming-exams').hidden=upcoming===0;
    byId('exam-directory-refresh').disabled=phase==='loading'||busy;
    byId('exam-directory-search').disabled=busy;
    filter();
  }
  function validRows(data) {
    if(!Array.isArray(data)||data.length>200)throw new Error('Invalid directory');
    const seen=new Set();
    for(const row of data) {
      if(!row || typeof row.exam_key!=='string'||!/^[a-z][a-z0-9_]{1,31}$/.test(row.exam_key)||seen.has(row.exam_key)||
        typeof row.display_name!=='string'||!row.display_name||typeof row.badge!=='string'||
        !['published','coming_soon','retired'].includes(row.publication_status)||typeof row.can_practice!=='boolean'||
        !Number.isSafeInteger(row.request_revision)||row.request_revision<0||
        (row.expires_at&&!Number.isFinite(new Date(row.expires_at).getTime()))||
        (row.requested_at&&!Number.isFinite(new Date(row.requested_at).getTime())))throw new Error('Invalid directory');
      seen.add(row.exam_key);
    }
    return data;
  }
  function invalidate() { version++;if(active)active.abort();active=null;reading=null;busy=false; }
  async function rpc(name,args) {
    const client=auth&&auth.getClient();if(!client)throw new Error('Account services unavailable');
    const controller=new AbortController();active=controller;let timer;
    try {
      const query=client.rpc(name,args).abortSignal(controller.signal);
      const result=await Promise.race([query,new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('The request timed out.'));},12000);})]);
      if(!result||result.error)throw Object.assign(new Error(result?.error?.message||'Unable to check access.'),{code:result?.error?.code});
      return result.data;
    } finally {clearTimeout(timer);if(active===controller)active=null;}
  }
  function load(afterMessage) {
    if(reading)return reading;
    if(!user) {phase='signedout';rows=defaults;render();notice('Sign in to see your assigned exams and request access.');return Promise.resolve();}
    const check=++version, userId=user.id;phase='loading';rows=defaults;render();notice('Checking your exam access…');
    const task=Promise.resolve().then(()=>{
      if(check!==version)return null;
      return rpc('get_my_exam_directory',{});
    }).then(data=>{
      if(check!==version||auth.getUser()?.id!==userId)return;
      rows=validRows(data);phase='ready';render();notice(afterMessage||'Your assigned exams are ready below. Request access to any other released certification.');
    }).catch(()=>{
      if(check!==version)return;phase='unavailable';rows=defaults;render();notice('We couldn’t check your access. Refresh to try again; no exams have been opened.');
    }).finally(()=>{if(reading===task)reading=null;});
    reading=task;return task;
  }
  async function changeRequest(row,operation) {
    if(phase!=='ready'||busy||!user||auth.getUser()?.id!==user.id)return;
    if(operation==='cancel'&&!window.confirm('Cancel your access request for '+row.display_name+'?'))return;
    const check=version;busy=true;render();notice(operation==='cancel'?'Cancelling your request…':'Sending your access request…');
    let text;
    try {
      const result=await rpc('request_exam_access',{requested_exam_key:row.exam_key,operation,expected_revision:row.request_revision});
      if(check!==version)return;
      text=result?.status==='pending'?'Request sent. An administrator will review it.':result?.status==='cancelled'?'Request cancelled.':'Your request status changed. Review the latest card below.';
    } catch(error) {
      if(check!==version)return;
      text=error.code==='40001'?'Your access changed. Review the refreshed status before trying again.':error.code==='22023'?error.message:'We couldn’t confirm the request result. Check the refreshed status before trying again.';
    }
    if(check!==version)return;
    busy=false;await load(text);
    if(user&&phase==='ready') document.querySelector('#exam-'+row.exam_key+' .exam-card-action')?.focus();
  }
  function sessionChanged(next) {
    invalidate();user=next;rows=defaults;phase=next?'loading':'signedout';byId('exam-directory-search').value='';render();
    Promise.resolve().then(()=>load());
  }
  function refresh() {
    if(busy||reading)return;
    if(!auth||!auth.isConfigured()) {phase='unavailable';rows=defaults;render();notice('Account services are unavailable. Reload this page to try again.');return;}
    const next=auth.getUser();if(next?.id!==user?.id)sessionChanged(next);else load();
  }
  byId('exam-directory-search').addEventListener('input',filter);
  byId('exam-directory-refresh').addEventListener('click',refresh);
  window.addEventListener('focus',refresh);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh();});
  window.addEventListener('pageshow',event=>{if(event.persisted){invalidate();refresh();}});
  function initialize() {
    if(initialized)return;auth=window.UpskillAuth;
    if(!auth||!auth.isConfigured()){phase='unavailable';render();notice('Account services are unavailable. Reload this page to try again.');return;}
    initialized=true;auth.onChange(sessionChanged);
  }
  if(window.UpskillAuth)initialize();else document.addEventListener('upskill-auth-ready',initialize,{once:true});
  setTimeout(()=>{if(phase==='loading'&&!reading){phase='unavailable';render();notice('Account services are taking too long. Use Refresh access to try again.');}},12000);
}());
