(function(){
  'use strict';

  const VERSION='1.0.0';
  const CONTROL_RPC='fetch_test_bank_data_control_v1';
  const DELETE_RPC='delete_test_bank_learning_data_v1';
  const SECURITY_KEY='tb-adaptive-security-control';
  const ACK_KEY='tb-security-purge-ack-v1';
  const RELOAD_KEY='tb-security-purge-reload-v1';
  const PATCHED_PDF_SOURCE='https://cdn.jsdelivr.net/npm/jspdf@4.2.1/+esm';
  const EXAMS=['cssbb','cqe','cssgb','cmq','mbb'];
  let deleting=false;
  let controlPromise=null;

  function auth(){return window.UpskillAuth||null;}
  function user(){const a=auth();return a&&typeof a.getUser==='function'?a.getUser():null;}
  function client(){const a=auth();return a&&typeof a.getClient==='function'?a.getClient():null;}
  function online(){return typeof navigator==='undefined'||navigator.onLine!==false;}
  function announce(message,urgent){
    if(window.__TBUXAccessibility&&typeof window.__TBUXAccessibility.announce==='function')window.__TBUXAccessibility.announce(message,urgent);
    document.dispatchEvent(new CustomEvent('tb:security-status',{detail:{message:String(message||''),urgent:Boolean(urgent)}}));
  }
  function parse(value,fallback){try{return JSON.parse(value);}catch(_){return fallback;}}
  function marker(){return parse(localStorage.getItem(SECURITY_KEY),null);}
  function markerGeneration(){const value=marker();const n=Number(value&&value.purgeGeneration);return Number.isSafeInteger(n)&&n>=0?n:0;}
  function acknowledgedGeneration(){const n=Number(localStorage.getItem(ACK_KEY));return Number.isSafeInteger(n)&&n>=0?n:0;}
  function setAcknowledged(generation){localStorage.setItem(ACK_KEY,String(Math.max(0,Number(generation)||0)));}

  function isLearnerStateKey(key){
    return key==='tb-learning-events-v2'||key==='tb-adaptive-mastery-v1'||key==='tb-attempt-history-v3'||key==='tb-attempt-feedback-v2'||
      key.indexOf('tb-adaptive-')===0||key.indexOf('tb-session-')===0||key.indexOf('tb-new-only-')===0||
      key.indexOf('tb-exam-session-')===0||key.indexOf('tb-timing-')===0;
  }
  function clearLocalLearnerState(control){
    const keep={purgeGeneration:Number(control&&control.generation)||0,purgedAt:control&&control.purgedAt||null,attempts:[]};
    const keys=[];for(let i=0;i<localStorage.length;i+=1)keys.push(localStorage.key(i));
    keys.forEach(function(key){if(key&&key!==SECURITY_KEY&&isLearnerStateKey(key))try{localStorage.removeItem(key);}catch(_){}});
    try{localStorage.setItem(SECURITY_KEY,JSON.stringify(keep));setAcknowledged(keep.purgeGeneration);}catch(_){}
    if(typeof indexedDB!=='undefined'&&indexedDB&&typeof indexedDB.deleteDatabase==='function'){
      try{indexedDB.deleteDatabase('tb-learning-events-mirror-v1');}catch(_){}
    }
    return keep;
  }
  function reloadAfterPurge(generation){
    try{
      const token=String(Math.max(0,Number(generation)||0));
      if(sessionStorage.getItem(RELOAD_KEY)===token)return false;
      sessionStorage.setItem(RELOAD_KEY,token);
      window.location.reload();
      return true;
    }catch(_){return false;}
  }

  async function fetchControl(force){
    if(controlPromise&&!force)return controlPromise;
    const u=user(),c=client();
    if(!u||!c||typeof c.rpc!=='function')return {available:false,reason:'not-signed-in',generation:0,purgedAt:null};
    if(!online())return {available:false,reason:'offline',generation:markerGeneration(),purgedAt:marker()&&marker().purgedAt||null};
    controlPromise=Promise.resolve(c.rpc(CONTROL_RPC,{})).then(function(result){
      if(result&&result.error)throw result.error;
      const row=Array.isArray(result&&result.data)?result.data[0]:result&&result.data;
      const generation=Number(row&&row.generation)||0;
      if(!Number.isSafeInteger(generation)||generation<0)throw new Error('Invalid security-control generation');
      return {available:true,generation:generation,purgedAt:row&&row.purged_at||row&&row.purgedAt||null,serverTime:row&&row.server_time||row&&row.serverTime||null,userId:u.id};
    }).finally(function(){controlPromise=null;});
    return controlPromise;
  }

  async function deleteLearningData(options){
    options=options&&typeof options==='object'?options:{};
    if(options.confirm!=='DELETE')return {deleted:false,reason:'confirmation-required'};
    if(deleting)return {deleted:false,reason:'already-running'};
    const u=user(),c=client();if(!u||!c||typeof c.rpc!=='function')return {deleted:false,reason:'not-signed-in'};
    if(!online())return {deleted:false,reason:'offline'};
    deleting=true;
    try{
      const before=await fetchControl(true);if(!before.available)return {deleted:false,reason:before.reason||'control-unavailable'};
      const result=await c.rpc(DELETE_RPC,{p_expected_generation:before.generation});
      if(result&&result.error)throw result.error;
      const data=Array.isArray(result&&result.data)?result.data[0]:result&&result.data;
      const generation=Number(data&&data.generation);
      if(!Number.isSafeInteger(generation)||generation!==before.generation+1)throw new Error('Deletion acknowledgement did not advance data generation');
      const control={generation:generation,purgedAt:data&&data.purgedAt||data&&data.purged_at||null};
      clearLocalLearnerState(control);
      document.dispatchEvent(new CustomEvent('tb:learning-data-deleted',{detail:{generation:generation,purgedAt:control.purgedAt}}));
      const reloadScheduled=reloadAfterPurge(generation);
      announce(reloadScheduled?'All exam learning history for this account was deleted. Reloading this browser to finish clearing live state.':'All exam learning history for this account was deleted. Local learner storage was cleared.',false);
      return {deleted:true,generation:generation,purgedAt:control.purgedAt,deletedCounts:data&&data.deleted||{},reloadScheduled:reloadScheduled};
    }catch(error){announce('Learning-history deletion failed. No local success is being claimed.',true);return {deleted:false,reason:'rpc-error',error:String(error&&error.message||error)};}
    finally{deleting=false;}
  }

  function reconcileRemotePurge(){
    const current=marker();const generation=Number(current&&current.purgeGeneration)||0;
    if(!generation||generation<=acknowledgedGeneration())return false;
    clearLocalLearnerState({generation:generation,purgedAt:current&&current.purgedAt||null});
    reloadAfterPurge(generation);
    return true;
  }

  function wrapHistoryExport(){
    const learning=window.__TBLearning;if(!learning||learning.__securityExportWrapped||typeof learning.exportHistory!=='function')return;
    const original=learning.exportHistory.bind(learning);
    learning.exportHistory=async function(input){
      const control=await fetchControl(true).catch(function(){return {available:false};});
      const payload=await original(input);
      return Object.assign({},payload,{securityControl:{generation:control.available?control.generation:markerGeneration(),purgedAt:control.available?control.purgedAt:(marker()&&marker().purgedAt||null),verified:Boolean(control.available)}});
    };
    learning.__securityExportWrapped=true;
  }

  function downloadJson(data,name){
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(href);},0);
  }
  async function secureMasteryExport(){
    const hardening=window.__TBAdaptiveHardening;
    if(!hardening||typeof hardening.summary!=='function'||typeof hardening.buildMasteryReport!=='function')throw new Error('Mastery report builder is unavailable');
    const timestamp=Date.now();const summary=hardening.summary(timestamp);const breakdown=hardening.subtopicBreakdown(timestamp);const exam=(window.__TB&&window.__TB.activeExamId)||summary.examId||'exam';
    try{
      const module=await import(PATCHED_PDF_SOURCE);const doc=new module.jsPDF();const dateStr=new Date(timestamp).toLocaleString('en-US',{year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'2-digit'});const reportId='RPT-'+String(exam).toUpperCase()+'-'+timestamp.toString(36).toUpperCase();
      hardening.buildMasteryReport(doc,summary,breakdown,String(exam).toUpperCase(),dateStr,reportId,null);doc.save('upskillsprint-'+exam+'-mastery-'+new Date(timestamp).toISOString().slice(0,10)+'.pdf');
      announce('Adaptive learning PDF prepared with the patched PDF runtime.',false);return {exported:true,format:'pdf',runtime:'jspdf@4.2.1'};
    }catch(error){downloadJson({exportedAt:new Date(timestamp).toISOString(),examId:exam,summary:summary,breakdown:breakdown,pdfRuntimeFailure:String(error&&error.message||error)},'upskillsprint-'+exam+'-mastery-'+new Date(timestamp).toISOString().slice(0,10)+'.json');announce('PDF export was unavailable, so a JSON report was prepared instead.',false);return {exported:true,format:'json-fallback'};}
  }

  function installExportShield(){
    if(window.__TB_SECURITY_EXPORT_SHIELD)return;window.__TB_SECURITY_EXPORT_SHIELD=true;
    window.addEventListener('click',function(event){const target=event.target&&event.target.closest&&event.target.closest('[data-v2-export]');if(!target)return;event.preventDefault();event.stopImmediatePropagation();secureMasteryExport().catch(function(error){announce('Mastery export failed: '+String(error&&error.message||error),true);});},true);
  }

  function ensureDeleteControl(){
    const actions=document.querySelector('.tb-data-actions');if(!actions||actions.querySelector('[data-security-delete-history]'))return;
    const button=document.createElement('button');button.type='button';button.className='tb-ghost danger';button.setAttribute('data-security-delete-history','');button.textContent='Delete all learning history';actions.appendChild(button);
  }
  function installDeleteControl(){
    document.addEventListener('click',function(event){const button=event.target&&event.target.closest&&event.target.closest('[data-security-delete-history]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();if(button.dataset.confirmDelete!=='true'){button.dataset.confirmDelete='true';button.textContent='Confirm delete all learning history';announce('Press the delete button again to permanently delete all exam learning history for this account.',true);return;}button.disabled=true;deleteLearningData({confirm:'DELETE'}).finally(function(){button.disabled=false;button.dataset.confirmDelete='';button.textContent='Delete all learning history';});},true);
  }

  function initialize(){
    wrapHistoryExport();installExportShield();installDeleteControl();ensureDeleteControl();
    document.addEventListener('upskill-test-progress-synced',reconcileRemotePurge);
    window.addEventListener('upskill-test-progress-synced',reconcileRemotePurge);
    document.addEventListener('upskill-test-learning-synced',wrapHistoryExport);
    const observer=new MutationObserver(function(){ensureDeleteControl();wrapHistoryExport();});observer.observe(document.body,{childList:true,subtree:true});
    reconcileRemotePurge();
  }

  window.__TBSecurityData={version:VERSION,fetchControl:fetchControl,deleteLearningData:deleteLearningData,clearLocalLearnerState:clearLocalLearnerState,reconcileRemotePurge:reconcileRemotePurge,secureMasteryExport:secureMasteryExport,patchedPdfSource:PATCHED_PDF_SOURCE};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
}());
