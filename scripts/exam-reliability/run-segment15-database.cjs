'use strict';
const assert=require('node:assert/strict');
const {spawn,spawnSync}=require('node:child_process');
const V=require('../../test-bank-versioning.js');
const {validateTarget}=require('./run-database.cjs');
const A='10000000-0000-4000-8000-000000000001',B='10000000-0000-4000-8000-000000000002';
const literal=x=>"'"+String(x).replace(/'/g,"''")+"'", json=x=>literal(JSON.stringify(x))+'::jsonb';
const passed=[];
function cli(t){return ['-X','-v','ON_ERROR_STOP=1','-v','VERBOSITY=verbose','-A','-t','-h',t.url.hostname,'-p',t.url.port||'5432','-U',decodeURIComponent(t.url.username),'segment03_test'];}
function run(t,sql){const r=spawnSync('psql',cli(t),{env:t.env,input:sql,encoding:'utf8',timeout:30000,maxBuffer:5*1024*1024});if(r.error)throw r.error;return r;}
function ok(t,sql){const r=run(t,sql);assert.equal(r.status,0,(r.stderr||'').slice(-2500));return String(r.stdout||'').trim();}
function role(user,sql,as='authenticated'){return `BEGIN; SET LOCAL ROLE ${as}; SET LOCAL request.jwt.claim.sub='${user||''}';\n${sql}\nROLLBACK;`;}
function commit(sql){return sql.replace(/ROLLBACK;$/,'COMMIT;');}
function denied(t,name,sql,code){const r=run(t,sql);assert.notEqual(r.status,0,name);assert.ok(String(r.stderr||'').includes(code),`${name}: expected ${code}\n${r.stderr}`);passed.push(name);}
function check(name,fn){fn();passed.push(name);}
function concurrent(t,sql){return new Promise((resolve,reject)=>{let stdout='',stderr='';const c=spawn('psql',cli(t),{env:t.env});const timer=setTimeout(()=>c.kill('SIGKILL'),30000);c.stdout.on('data',x=>stdout+=x);c.stderr.on('data',x=>stderr+=x);c.on('error',reject);c.on('close',(status,signal)=>{clearTimeout(timer);resolve({status,signal,stdout,stderr});});c.stdin.end(sql);});}
function publication(exam){const c=V.createExamCatalog('cssbb',exam,{source:'segment15 SQL regression'});return {catalog:c,payload:{schemaVersion:'1.0.0',examId:'cssbb',configVersion:c.configVersion,blueprintVersion:c.blueprintVersion,bankVersion:c.bankVersion,config:c.config,provenance:c.provenance,canonicalConfig:V.canonical({config:c.config,provenance:c.provenance}),canonicalBlueprint:V.canonical(c.config.bok),canonicalManifest:V.canonical({examId:'cssbb',questions:c.questions,sets:c.sets}),contents:Object.fromEntries(exam.sets[1].map(q=>[q.qid,{revision:c.questions[q.qid],content:V.content(q),canonicalContent:V.canonical(V.content(q))}]))}};}
function env(id,type,sid,rev,payload,qid=null,epoch=0){return {schemaVersion:'1.0.0',operationId:id,ownerId:A,deviceId:'segment15-device-a',examId:'cssbb',sessionId:sid,writerEpoch:epoch,expectedSessionRevision:rev,resetEpochId:null,type,clientOccurredAt:'2026-09-10T00:00:00.000Z',clientSequence:rev,payload:{questionId:qid,eventPayload:payload}};}
function handoff(pin,epoch=0,selected=null){return {schemaVersion:1,contractVersion:'1.0.0',kind:'core',ownerId:A,sessionId:pin.sessionId,examId:'cssbb',mode:'exam',state:'in_progress',writerEpoch:epoch,timed:true,startedAt:pin.startedAt,deadlineAt:pin.deadlineAt,payload:{schemaVersion:1,contractVersion:'1.0.0',sessionId:pin.sessionId,ownerId:A,examId:'cssbb',mode:'exam',state:'in_progress',sessionRevision:1,writerEpoch:epoch,timed:true,startedAt:pin.startedAt,deadlineAt:pin.deadlineAt,currentItemId:pin.orderedItems[0].itemId,flags:[],orderedItems:pin.orderedItems.map((i,n)=>({...i,selectedOptionId:n===0?selected:null,effectiveAnsweredAt:null})),versionPin:pin}};}
async function main(){const t=validateTarget(process.env.SEG03_DB_URL||'',process.env.SEG03_ALLOW_DISPOSABLE_DB);
  check('15 migration functions and checkpoint table exist',()=>{const x=ok(t,"SELECT count(*) FROM pg_proc WHERE proname IN ('fetch_test_bank_resumable_sessions_v1','save_test_bank_session_checkpoint_v1','takeover_test_bank_session_v1');");assert.equal(x,'3');assert.equal(ok(t,"SELECT count(*) FROM pg_class WHERE relname='test_bank_session_checkpoints';"),'1');});
  const qs=[0,1].map(i=>({qid:'cssbb:segment15:'+i,stem:'Segment 15 SQL '+i,sub:'s15',options:['A','B'],answer:i,why:'Synthetic handoff fixture.'}));
  const exam={questions:2,minutes:120,pass:70,sets:{1:qs},bank:qs,bok:[{domain:'s15-domain',weight:2,subs:[{id:'s15',w:2}]}]};const pub=publication(exam);ok(t,`SELECT public.publish_test_bank_catalog(${json(pub.payload)});`);
  const sid='segment15-session-one',pin=V.pin({examId:'cssbb',sessionId:sid,ownerId:A,mode:'exam',setId:'1',questions:qs,timed:true,limitSeconds:7200,startedAt:Date.parse('2026-09-10T00:00:00Z')},exam,pub.catalog);
  const start={mode:'exam',timed:true,total:2,limitSeconds:7200,versionPin:V.wire(pin)};
  ok(t,commit(role(A,`SELECT public.ingest_test_bank_operations_v1(${json([env('segment15-start','session_started',sid,0,start)])});`)));
  const snap=handoff(pin);
  check('15 owner saves first canonical checkpoint at epoch zero',()=>{const out=ok(t,commit(role(A,`SELECT public.save_test_bank_session_checkpoint_v1('${sid}','device-a:tab-a','device-a',0,0,${json(snap)});`)));assert.match(out,/checkpointRevision/);});
  check('15 owner reads its resumable checkpoint',()=>{assert.equal(ok(t,role(A,`SELECT count(*) FROM public.fetch_test_bank_resumable_sessions_v1('${sid}');`)),'1');});
  check('15 another owner cannot enumerate owner A checkpoint',()=>{assert.equal(ok(t,role(B,`SELECT count(*) FROM public.fetch_test_bank_resumable_sessions_v1('${sid}');`)),'0');});
  denied(t,'15 browser role cannot directly update checkpoint table',role(A,`UPDATE public.test_bank_session_checkpoints SET writer_epoch=99 WHERE session_id='${sid}';`),'42501');
  denied(t,'15 deadline extension is rejected',role(A,`SELECT public.save_test_bank_session_checkpoint_v1('${sid}','device-a:tab-a','device-a',0,1,jsonb_set(${json(snap)},'{deadlineAt}','\"2026-09-10T03:00:00.000Z\"'));`),'23514');
  check('15 explicit device B takeover increments epoch and revisions once',()=>{const out=ok(t,commit(role(A,`SELECT public.takeover_test_bank_session_v1('${sid}','device-b:tab-b','device-b',0,1);`)));assert.match(out,/writerEpoch.*1/);assert.equal(ok(t,`SELECT writer_epoch FROM public.test_bank_session_runtime WHERE user_id='${A}' AND session_id='${sid}';`),'1');});
  check('15 same writer retry is idempotent and does not increment epoch',()=>{ok(t,role(A,`SELECT public.takeover_test_bank_session_v1('${sid}','device-b:tab-b','device-b',1,2);`));assert.equal(ok(t,`SELECT writer_epoch FROM public.test_bank_session_runtime WHERE user_id='${A}' AND session_id='${sid}';`),'1');});
  denied(t,'15 stale device A checkpoint is rejected after takeover',role(A,`SELECT public.save_test_bank_session_checkpoint_v1('${sid}','device-a:tab-a','device-a',0,1,${json(snap)});`),'40001');
  const current=handoff(pin,1,'o0');
  check('15 current writer can save next checkpoint without changing deadline',()=>{ok(t,commit(role(A,`SELECT public.save_test_bank_session_checkpoint_v1('${sid}','device-b:tab-b','device-b',1,2,${json(current)});`)));assert.equal(ok(t,`SELECT snapshot->>'deadlineAt' FROM public.test_bank_session_checkpoints WHERE user_id='${A}' AND session_id='${sid}';`),pin.deadlineAt);});
  const raceArgs=id=>`SELECT public.takeover_test_bank_session_v1('${sid}','${id}:tab','${id}',1,3);`;
  const race=await Promise.all([concurrent(t,commit(role(A,raceArgs('device-c')))),concurrent(t,commit(role(A,raceArgs('device-d'))))]);
  check('15 concurrent takeovers have exactly one winner',()=>{assert.equal(race.filter(x=>x.status===0).length,1);assert.equal(race.filter(x=>x.status!==0&&x.stderr.includes('40001')).length,1);});
  check('15 concurrent takeover advances writer epoch exactly once',()=>assert.equal(ok(t,`SELECT writer_epoch FROM public.test_bank_session_runtime WHERE user_id='${A}' AND session_id='${sid}';`),'2'));
  denied(t,'15 anonymous cannot fetch resumable sessions',role(null,`SELECT * FROM public.fetch_test_bank_resumable_sessions_v1(NULL);`,'anon'),'42501');
  denied(t,'15 anonymous cannot save a checkpoint',role(null,`SELECT public.save_test_bank_session_checkpoint_v1('${sid}','anon:tab','anon',2,4,${json(handoff(pin,2))});`,'anon'),'42501');
  denied(t,'15 owner B cannot take over owner A session',role(B,`SELECT public.takeover_test_bank_session_v1('${sid}','device-z:tab','device-z',2,4);`),'42501');
  const rev=Number(ok(t,`SELECT session_revision FROM public.test_bank_session_runtime WHERE user_id='${A}' AND session_id='${sid}';`));const epoch=Number(ok(t,`SELECT writer_epoch FROM public.test_bank_session_runtime WHERE user_id='${A}' AND session_id='${sid}';`));
  ok(t,commit(role(A,`SELECT public.ingest_test_bank_operations_v1(${json([env('segment15-abandon','session_abandoned',sid,rev,{mode:'exam',timed:true,reason:'test',startedAt:Date.parse(pin.startedAt)},null,epoch)])});`)));
  denied(t,'15 terminal session cannot be taken over',role(A,`SELECT public.takeover_test_bank_session_v1('${sid}','device-z:tab','device-z',${epoch},4);`),'40001');
  check('15 terminal sessions disappear from resumable fetch',()=>assert.equal(ok(t,role(A,`SELECT count(*) FROM public.fetch_test_bank_resumable_sessions_v1('${sid}');`)),'0'));
  console.log(JSON.stringify({status:'passed',tests:passed.length,passed},null,2));
}
main().catch(e=>{console.error(e&&e.stack||e);process.exitCode=1;});
