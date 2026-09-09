'use strict';
// Real PostgreSQL role tests against repository DDL, never a connected production project.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync,spawn}=require('node:child_process');
const {ROOT,output,write}=require('./evidence.cjs');
const A='10000000-0000-4000-8000-000000000001',B='10000000-0000-4000-8000-000000000002';
const passed=[],logs=[];let databaseVersion=null;
function validateTarget(value,authorization){
  if(authorization!=='1')throw Error('Explicit disposable-test authorization required');
  const u=new URL(value);
  if(!['postgres:','postgresql:'].includes(u.protocol)||!['127.0.0.1','localhost','[::1]'].includes(u.hostname)||u.pathname!=='/segment03_test'||u.search||u.hash)throw Error('Only loopback segment03_test is allowed');
  return {url:u,env:{...process.env,PGPASSWORD:decodeURIComponent(u.password)}};
}
function cli(target){return ['-X','-v','ON_ERROR_STOP=1','-v','VERBOSITY=verbose','-A','-t','-h',target.url.hostname,'-p',target.url.port||'5432','-U',decodeURIComponent(target.url.username),'segment03_test'];}
function run(target,sql){const r=spawnSync('psql',cli(target),{env:target.env,cwd:ROOT,input:sql,encoding:'utf8',timeout:30000,maxBuffer:3*1024*1024});logs.push({sql,exit:r.status,stdout:r.stdout,stderr:r.stderr,error:r.error?String(r.error):null});if(r.error)throw r.error;return r;}
function ok(target,sql){const r=run(target,sql);assert.equal(r.status,0,(r.stderr||'').slice(-1500));return r.stdout.trim();}
function role(user,sql,as='authenticated'){return `BEGIN; SET LOCAL ROLE ${as}; SET LOCAL request.jwt.claim.sub='${user||''}';\n${sql}\nROLLBACK;`;}
function expectDenied(target,name,sql,code){const r=run(target,sql);assert.notEqual(r.status,0,name);assert.ok((r.stderr||'').includes(code),name+': expected SQLSTATE '+code);passed.push(name);}
function expect(target,name,sql){ok(target,sql);passed.push(name);}
const requireCount=(query,n)=>`DO $$ DECLARE n bigint; BEGIN SELECT count(*) INTO n FROM (${query}) q; IF n <> ${n} THEN RAISE EXCEPTION 'ROW_SENTINEL expected ${n}, got %',n; END IF; END $$;`;
const insert=(owner,id='fixture-event-01',extra="'{}'::jsonb",type='question_exposed')=>`INSERT INTO public.test_bank_learning_events(user_id,event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,payload) VALUES('${owner}','${id}','fixture-device','${type}','cssbb','fixture-session','cssbb:fixture:0','2026-09-08T00:00:00Z',${extra})`;
function concurrent(target,sql){return new Promise((resolve,reject)=>{let stdout='',stderr='';const p=spawn('psql',cli(target),{env:target.env,cwd:ROOT});const timer=setTimeout(()=>p.kill('SIGKILL'),30000);p.stdout.on('data',b=>stdout+=b);p.stderr.on('data',b=>stderr+=b);p.on('error',reject);p.on('close',(exit,signal)=>{clearTimeout(timer);logs.push({sql,exit,signal,stdout,stderr});resolve({exit,signal,stdout,stderr});});p.stdin.end(sql);});}
async function main(){let target;try{
  target=validateTarget(process.env.SEG03_DB_URL||'',process.env.SEG03_ALLOW_DISPOSABLE_DB);
  databaseVersion=ok(target,"SELECT current_setting('server_version');");assert.ok(databaseVersion.startsWith('17.'),'Expected PostgreSQL17');
  ok(target,fs.readFileSync(path.join(ROOT,'tests/exam-reliability/database/bootstrap.sql'),'utf8'));
  const files=['supabase/test-bank-progress.sql',...fs.readdirSync(path.join(ROOT,'supabase/migrations')).filter(n=>n.endsWith('.sql')).sort().map(n=>'supabase/migrations/'+n)];
  for(const f of files)ok(target,fs.readFileSync(path.join(ROOT,f),'utf8'));passed.push('all repository test-bank DDL applied');
  ok(target,insert(A)+';'+insert(B)+';');
  expect(target,'actual authenticated role is neither owner nor bypass RLS',role(A,"DO $$ BEGIN IF current_user <> 'authenticated' OR EXISTS(SELECT 1 FROM pg_roles WHERE rolname=current_user AND (rolsuper OR rolbypassrls)) THEN RAISE EXCEPTION 'Wrong test role'; END IF; END $$;"));
  expect(target,'owner sees only own event',role(A,requireCount('SELECT * FROM public.test_bank_learning_events',1)));
  expect(target,'second owner sees own event, not first owner',role(B,requireCount('SELECT * FROM public.test_bank_learning_events',1)));
  expect(target,'owner A cannot read any other owner row',role(A,requireCount("SELECT * FROM public.test_bank_learning_events WHERE user_id <> '"+A+"'",0)));
  expect(target,'owner B cannot read any other owner row',role(B,requireCount("SELECT * FROM public.test_bank_learning_events WHERE user_id <> '"+B+"'",0)));
  expect(target,'missing authentication subject sees no rows',role(null,requireCount('SELECT * FROM public.test_bank_learning_events',0)));
  expect(target,'own append succeeds',role(A,insert(A,'fixture-event-02')+';'));
  expectDenied(target,'other-owner append denied',role(A,insert(B,'foreign-event-02')+';'),'42501');
  expectDenied(target,'anonymous SELECT denied',role(null,'SELECT * FROM public.test_bank_learning_events;','anon'),'42501');
  expectDenied(target,'anonymous INSERT denied',role(null,insert(A,'anon-event-02')+';','anon'),'42501');
  for(const action of ['UPDATE public.test_bank_learning_events SET payload=\'{}\';','DELETE FROM public.test_bank_learning_events;','TRUNCATE public.test_bank_learning_events;'])expectDenied(target,'immutable ledger: '+action,role(A,action),'42501');
  expect(target,'idempotent database insert preserves one logical ID',role(A,insert(A)+' ON CONFLICT(user_id,event_id) DO NOTHING;'+requireCount("SELECT * FROM public.test_bank_learning_events WHERE user_id='"+A+"'",1)));
  expectDenied(target,'unregistered logical event rejected',role(A,insert(A,'wrong-type-event',"'{}'::jsonb",'answer_draft_saved')+';'),'23514');
  expectDenied(target,'scalar payload rejected',role(A,insert(A,'scalar-event',"'42'::jsonb")+';'),'23514');
  expectDenied(target,'oversized payload rejected',role(A,insert(A,'large-event',"jsonb_build_object('x',repeat('x',66000))")+';'),'23514');
  const progress=`INSERT INTO public.test_bank_progress_devices(user_id,device_id,payload,updated_at) VALUES('${A}','fixture-device','{}','2000-01-01');`;
  expect(target,'own progress insert and server timestamp override',role(A,progress+`DO $$ BEGIN IF EXISTS(SELECT 1 FROM public.test_bank_progress_devices WHERE updated_at < now()-interval '1 hour') THEN RAISE EXCEPTION 'Client clock trusted'; END IF; END $$;`));
  expectDenied(target,'progress row cannot change owner',role(A,progress+`UPDATE public.test_bank_progress_devices SET user_id='${B}';`),'42501');
  for(const action of ['SELECT * FROM public.test_bank_new_question_claims;','DELETE FROM public.test_bank_new_question_claims;'])expectDenied(target,'claims restricted to RPC '+action,role(A,action),'42501');
  expect(target,'reservation deduplicates candidates and excludes previously delivered ID',role(A,requireCount("SELECT * FROM public.reserve_test_bank_new_questions('cssbb',ARRAY['cssbb:fixture:0','cssbb:fixture:1','cssbb:fixture:1'])",1)));
  expectDenied(target,'anonymous cannot execute reservation',role(null,"SELECT * FROM public.reserve_test_bank_new_questions('cssbb',ARRAY['cssbb:new:1']);",'anon'),'42501');
  expectDenied(target,'missing uid cannot execute reservation',role(null,"SELECT * FROM public.reserve_test_bank_new_questions('cssbb',ARRAY['cssbb:new:1']);"),'28000');
  expectDenied(target,'invalid reservation input rejected',role(A,"SELECT * FROM public.reserve_test_bank_new_questions('!',ARRAY['cssbb:new:1']);"),'22023');
  expectDenied(target,'exact reservation shortfall rolls back',role(A,"SELECT * FROM public.reserve_test_bank_new_questions_exact('cssbb',ARRAY['cssbb:fixture:0','cssbb:new:1'],2);"),'P0001');
  expect(target,'failed exact request claimed nothing',requireCount('SELECT * FROM public.test_bank_new_question_claims',0));
  // Deliberately weaken SELECT policy only inside a transaction, prove the detector fails,
  // then verify connection rollback restored it. No mutation leaves this throwaway DB.
  const mutant=`BEGIN; DROP POLICY "Learners read own learning events" ON public.test_bank_learning_events; CREATE POLICY "mutant" ON public.test_bank_learning_events FOR SELECT TO authenticated USING (true); SET LOCAL ROLE authenticated; SET LOCAL request.jwt.claim.sub='${A}'; ${requireCount('SELECT * FROM public.test_bank_learning_events',1)} ROLLBACK;`;
  const mr=run(target,mutant);assert.notEqual(mr.status,0);assert.match(mr.stderr,/ROW_SENTINEL/);passed.push('RLS mutant killed and transaction rolled back');
  expect(target,'clean policy restored after deliberate mutant',role(A,requireCount('SELECT * FROM public.test_bank_learning_events',1)));
  const reserve=`BEGIN; SET LOCAL ROLE authenticated; SET LOCAL request.jwt.claim.sub='${A}'; SELECT * FROM public.reserve_test_bank_new_questions_exact('cssbb',ARRAY['cssbb:race:1','cssbb:race:2'],2); SELECT pg_sleep(0.2); COMMIT;`;
  const race=await Promise.all([concurrent(target,reserve),concurrent(target,reserve)]);
  assert.equal(race.filter(r=>r.exit===0).length,1);assert.equal(race.filter(r=>r.exit!==0&&!r.signal&&r.stderr.includes('P0001')).length,1);passed.push('competing real SQL exact reservations yield one winner');
  expect(target,'race committed exactly two unique claims',requireCount('SELECT * FROM public.test_bank_new_question_claims',2));
  require('../../tests/exam-reliability/database/segment05-catalog.cjs').runChecks({ROOT,target,ok,run,role,expect,expectDenied,requireCount});
  await require('../../tests/exam-reliability/database/segment07-ingestion.cjs').runChecks({ROOT,target,ok,run,role,expect,expectDenied,requireCount,concurrent});
  await require('../../tests/exam-reliability/database/segment09-grading.cjs').runChecks({ROOT,target,ok,role,expect,expectDenied,requireCount});
  fs.writeFileSync(path.join(output(),'database.log'),JSON.stringify(logs,null,2));
  write('database',{status:'passed',tests:passed.length,failures:0,skipped:0,passed,databaseVersion,command:'node scripts/exam-reliability/run-database.cjs',limitations:['Disposable PostgreSQL17; repository migrations, not live schema parity.','auth.uid fixture; no JWT/Data API/production authorization claim.']});
}catch(e){fs.writeFileSync(path.join(output(),'database.log'),JSON.stringify(logs,null,2));write('database',{status:'failed',tests:passed.length,failures:1,skipped:0,error:e.stack,databaseVersion});process.exitCode=1;}console.log(JSON.stringify({tests:passed.length,passed:process.exitCode!==1}));}
module.exports={validateTarget};if(require.main===module)main();
