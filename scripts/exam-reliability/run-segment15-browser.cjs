'use strict';
const assert=require('node:assert/strict');
const http=require('node:http');
const path=require('node:path');
const tools=process.env.SEG15_PLAYWRIGHT_PATH;
if(!tools)throw Error('SEG15_PLAYWRIGHT_PATH required');
const pw=require(tools);
const engine=process.env.SEG15_ENGINE||'chromium';
const mobile=process.env.SEG15_MOBILE==='1';
const checks=[];

class Service{
  constructor(){this.row=null;this.epoch=0;this.serverRevision=4;}
  call(name,a){
    if(name==='fetch_test_bank_resumable_sessions_v1')return this.row&&(!a.p_session_id||a.p_session_id===this.row.session_id)?[structuredClone(this.row)]:[];
    if(name==='save_test_bank_session_checkpoint_v1'){
      if(a.p_writer_epoch!==this.epoch)throw Object.assign(Error('stale epoch'),{code:'40001'});
      if(this.row&&(a.p_writer_client_id!==this.row.writer_client_id||a.p_expected_checkpoint_revision!==this.row.checkpoint_revision))throw Object.assign(Error('stale checkpoint'),{code:'40001'});
      const rev=this.row?this.row.checkpoint_revision+1:1;
      this.row={session_id:a.p_session_id,exam_id:'cssbb',state:'in_progress',writer_epoch:this.epoch,writer_client_id:a.p_writer_client_id,writer_device_id:a.p_writer_device_id,checkpoint_revision:rev,server_session_revision:this.serverRevision,snapshot:structuredClone(a.p_snapshot),updated_at:new Date().toISOString(),server_time:new Date().toISOString()};
      return this.json();
    }
    if(name==='takeover_test_bank_session_v1'){
      if(!this.row||a.p_expected_writer_epoch!==this.epoch||a.p_expected_checkpoint_revision!==this.row.checkpoint_revision)throw Object.assign(Error('stale takeover'),{code:'40001'});
      if(a.p_writer_client_id!==this.row.writer_client_id){this.epoch++;this.serverRevision++;this.row.writer_epoch=this.epoch;this.row.writer_client_id=a.p_writer_client_id;this.row.writer_device_id=a.p_writer_device_id;this.row.checkpoint_revision++;this.row.server_session_revision=this.serverRevision;this.row.snapshot.writerEpoch=this.epoch;}
      return this.json();
    }
    throw Error('unknown RPC '+name);
  }
  json(){const r=this.row;return {sessionId:r.session_id,examId:r.exam_id,state:r.state,writerEpoch:r.writer_epoch,writerClientId:r.writer_client_id,writerDeviceId:r.writer_device_id,checkpointRevision:r.checkpoint_revision,serverSessionRevision:r.server_session_revision,snapshot:structuredClone(r.snapshot),updatedAt:r.updated_at,serverTime:r.server_time};}
}

const service=new Service();
const startedAt=new Date(Date.now()-60000).toISOString();
const deadlineAt=new Date(Date.now()+2*60*60*1000).toISOString();
const initial={schemaVersion:1,contractVersion:'1.0.0',sessionId:'cssbb:browser:s15',ownerId:'browser-owner',examId:'cssbb',mode:'exam',state:'in_progress',sessionRevision:1,writerEpoch:0,timed:true,startedAt,deadlineAt,currentItemId:'i0',flags:[],orderedItems:[{itemId:'i0',questionId:'cssbb:q1',questionRevision:'r1',optionIds:['o0','o1'],optionOrder:['o0','o1'],selectedOptionId:null,effectiveAnsweredAt:null}],versionPin:{sessionId:'cssbb:browser:s15',ownerId:'browser-owner',examId:'cssbb',mode:'exam',timed:true,startedAt,deadlineAt,orderedItems:[{itemId:'i0',questionId:'cssbb:q1',questionRevision:'r1',optionOrder:['o0','o1']}],contents:[{qid:'cssbb:q1',options:['A','B'],answer:0}]}};

function startOrigin(){
  const server=http.createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end('<!doctype html><html><head><meta charset="utf-8"></head><body><div id="tb-overview"></div><div id="tb-adaptive-panel"></div></body></html>');});
  return new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',()=>resolve({server,url:'http://127.0.0.1:'+server.address().port+'/'}));});
}

async function page(browser,device,url){
  const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile});
  const p=await ctx.newPage();
  await p.exposeFunction('__rpc',async(name,args)=>{try{return {data:service.call(name,args),error:null};}catch(e){return {data:null,error:{message:e.message,code:e.code||'ERROR'}};}});
  await p.goto(url,{waitUntil:'domcontentloaded'});
  await p.evaluate(({device,initial})=>{
    localStorage.setItem('tb-account-sync-device-v1',device);
    let active=device==='device-A'?structuredClone(initial):null;
    const learning={version:2,events:[],sessions:{},index:{knownEventIds:{},totals:{},seen:{}}};
    window.UpskillAuth={getUser:()=>({id:'browser-owner'}),getClient:()=>({rpc:(n,a)=>window.__rpc(n,a)})};
    window.__TBLearning={store:()=>learning,sync:async()=>({pending:0}),recordDraft:i=>({saved:true,sessionId:i.sessionId}),recordAnswer:i=>({saved:true,sessionId:i.sessionId}),completeSession:i=>({saved:true,sessionId:i.sessionId}),abandonSession:i=>({saved:true,sessionId:i.sessionId})};
    window.__TBSessionTiming={recover:async()=>({ready:true}),isExpired:()=>false};
    window.__TBSessionLifecycle={terminalStates:['completed','expired','abandoned'],save:s=>(active=structuredClone(s)),load:id=>active&&(!id||id===active.sessionId)?structuredClone(active):null,resume:id=>({resumed:id}),validateSnapshot:()=>true};
  },{device,initial});
  await p.addScriptTag({path:path.resolve(__dirname,'../../test-bank-session-handoff.js')});
  return {ctx,p};
}

(async()=>{
  let browser,origin;
  try{
    origin=await startOrigin();
    browser=await pw[engine].launch();
    const a=await page(browser,'device-A',origin.url),b=await page(browser,'device-B',origin.url);
    const env=await a.p.evaluate(()=>__TBSessionHandoff.coreEnvelope(__TBSessionLifecycle.load('cssbb:browser:s15')));
    await a.p.evaluate(e=>__TBSessionHandoff.saveCheckpoint(e),env);
    checks.push('device A cloud checkpoint');
    await b.p.evaluate(()=>__TBSessionHandoff.takeover('cssbb:browser:s15'));
    const bstate=await b.p.evaluate(()=>__TBSessionLifecycle.load('cssbb:browser:s15'));
    assert.equal(bstate.deadlineAt,initial.deadlineAt);
    assert.equal(bstate.writerEpoch,1);
    checks.push('device B explicit takeover preserves deadline and advances epoch');
    await a.p.evaluate(()=>__TBSessionHandoff.refresh('browser-test'));
    const blocked=await a.p.evaluate(()=>__TBLearning.recordDraft({sessionId:'cssbb:browser:s15'}));
    assert.equal(blocked.reason,'STALE_SESSION_WRITER');
    checks.push('device A stale writer blocked');
    const card=await a.p.locator('[data-session-handoff="cssbb:browser:s15"]').innerText();
    assert.match(card,/cloud-accepted checkpoint/);
    assert.match(card,/not included/);
    checks.push('learner disclosure describes cloud-only transfer');
    await a.ctx.close();await b.ctx.close();
    console.log(JSON.stringify({status:'passed',engine,mobile,tests:checks.length,checks},null,2));
  }catch(e){console.error(e.stack||e);process.exitCode=1;}
  finally{if(browser)await browser.close();if(origin)await new Promise(r=>origin.server.close(r));}
})();
