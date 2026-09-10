'use strict';
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const {validateTarget}=require('./run-database.cjs');
const A='10000000-0000-4000-8000-000000000001';
const B='10000000-0000-4000-8000-000000000002';
const passed=[];
function cli(t){return ['-X','-q','-v','ON_ERROR_STOP=1','-v','VERBOSITY=verbose','-A','-t','-h',t.url.hostname,'-p',t.url.port||'5432','-U',decodeURIComponent(t.url.username),'segment03_test'];}
function run(t,sql){const r=spawnSync('psql',cli(t),{env:t.env,input:sql,encoding:'utf8',timeout:30000,maxBuffer:6*1024*1024});if(r.error)throw r.error;return r;}
function ok(t,sql){const r=run(t,sql);assert.equal(r.status,0,(r.stderr||'').slice(-3500));return String(r.stdout||'').trim();}
function role(user,sql,as='authenticated'){return `BEGIN; SET LOCAL ROLE ${as}; SET LOCAL request.jwt.claim.sub='${user||''}';\n${sql}\nROLLBACK;`;}
function commit(sql){return sql.replace(/ROLLBACK;$/,'COMMIT;');}
function denied(t,name,sql,code){const r=run(t,sql);assert.notEqual(r.status,0,name);assert.ok(String(r.stderr||'').includes(code),`${name}: expected ${code}\n${r.stderr}`);passed.push(name);}
function check(name,fn){fn();passed.push(name);}
function count(t,sql,n){check(sql,()=>assert.equal(ok(t,`SELECT count(*) FROM (${sql}) q;`),String(n)));}
const stalePayload=`jsonb_build_object('schemaVersion',2,'values',jsonb_build_object('tb-adaptive-security-control',jsonb_build_object('attempts',jsonb_build_array(),'purgeGeneration',1,'purgedAt',(SELECT purged_at FROM public.test_bank_data_control WHERE user_id='${A}')),'tb-attempt-history-v3',jsonb_build_object('attempts',jsonb_build_array(jsonb_build_object('id','old-attempt'))))),'resets','{}'::jsonb)`;
const cleanPayload=`private.test_bank_security_tombstone_payload_v1(1,(SELECT purged_at FROM public.test_bank_data_control WHERE user_id='${A}'))`;
async function main(){
  const t=validateTarget(process.env.SEG03_DB_URL||'',process.env.SEG03_ALLOW_DISPOSABLE_DB);
  check('18 data-control table, purge RPCs and stale guards exist',()=>{
    assert.equal(ok(t,"SELECT count(*) FROM pg_class WHERE relname='test_bank_data_control';"),'1');
    assert.equal(ok(t,"SELECT count(*) FROM pg_proc WHERE proname IN ('fetch_test_bank_data_control_v1','delete_test_bank_learning_data_v1','test_bank_guard_post_purge_event_v1','test_bank_guard_progress_generation_v1');"),'4');
  });
  check('18 public SECURITY DEFINER entry points pin search_path',()=>{
    const bad=ok(t,`SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prosecdef AND has_function_privilege('authenticated',p.oid,'EXECUTE') AND NOT EXISTS (SELECT 1 FROM unnest(coalesce(p.proconfig,array[]::text[])) c WHERE c LIKE 'search_path=%');`);
    assert.equal(bad,'0');
  });
  denied(t,'18 anonymous cannot fetch data-control state',role(null,'SELECT * FROM public.fetch_test_bank_data_control_v1();','anon'),'42501');
  denied(t,'18 anonymous cannot purge learning data',role(null,'SELECT public.delete_test_bank_learning_data_v1(0);','anon'),'42501');
  check('18 owner A initially sees generation zero',()=>assert.match(ok(t,role(A,'SELECT generation FROM public.fetch_test_bank_data_control_v1();')),/^0$/m));
  check('18 owner B initially sees independent generation zero',()=>assert.match(ok(t,role(B,'SELECT generation FROM public.fetch_test_bank_data_control_v1();')),/^0$/m));

  ok(t,`DELETE FROM public.test_bank_learning_events WHERE event_id LIKE 'seg18-%'; DELETE FROM public.test_bank_new_question_claims WHERE exam_id='cssbb' AND question_id LIKE 'cssbb:seg18:%'; DELETE FROM public.test_bank_progress_devices WHERE device_id LIKE 'seg18-%';`);
  ok(t,`INSERT INTO public.test_bank_learning_events(user_id,event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,payload) VALUES
    ('${A}','seg18-event-a','seg18-device-a','question_exposed','cssbb','seg18-session-a','cssbb:seg18:q1',clock_timestamp()-interval '1 hour','{}'),
    ('${B}','seg18-event-b','seg18-device-b','question_exposed','cssbb','seg18-session-b','cssbb:seg18:q1',clock_timestamp()-interval '1 hour','{}');
    INSERT INTO public.test_bank_new_question_claims(user_id,exam_id,question_id) VALUES('${A}','cssbb','cssbb:seg18:q1'),('${B}','cssbb','cssbb:seg18:q1') ON CONFLICT DO NOTHING;
    INSERT INTO public.test_bank_progress_devices(user_id,device_id,payload) VALUES('${A}','seg18-device-a',jsonb_build_object('schemaVersion',2,'values',jsonb_build_object('tb-attempt-history-v3',jsonb_build_object('attempts',jsonb_build_array(jsonb_build_object('id','old-attempt')))),'resets','{}'::jsonb)),('${B}','seg18-device-b','{}'::jsonb) ON CONFLICT(user_id,device_id) DO UPDATE SET payload=excluded.payload;`);

  const deleted=ok(t,commit(role(A,'SELECT public.delete_test_bank_learning_data_v1(0);')));
  check('18 authenticated CAS purge advances generation exactly once',()=>{const payload=JSON.parse(deleted);assert.equal(payload.generation,1);assert.ok(payload.purgedAt);});
  count(t,`SELECT * FROM public.test_bank_learning_events WHERE user_id='${A}'`,0);
  count(t,`SELECT * FROM public.test_bank_new_question_claims WHERE user_id='${A}'`,0);
  count(t,`SELECT * FROM public.test_bank_learning_events WHERE user_id='${B}' AND event_id='seg18-event-b'`,1);
  count(t,`SELECT * FROM public.test_bank_new_question_claims WHERE user_id='${B}' AND question_id='cssbb:seg18:q1'`,1);
  check('18 purge leaves a server-authored control tombstone',()=>{
    assert.equal(ok(t,`SELECT generation FROM public.test_bank_data_control WHERE user_id='${A}';`),'1');
    assert.equal(ok(t,`SELECT count(*) FROM public.test_bank_progress_devices WHERE user_id='${A}' AND device_id='security-control-v1' AND security_generation=1;`),'1');
  });
  check('18 another owner cannot read A purge control through RLS',()=>assert.equal(ok(t,role(B,`SELECT count(*) FROM public.test_bank_data_control WHERE user_id='${A}';`)),'0'));
  denied(t,'18 stale CAS deletion is rejected',role(A,'SELECT public.delete_test_bank_learning_data_v1(0);'),'40001');
  denied(t,'18 pre-purge offline event cannot be resurrected',role(A,`INSERT INTO public.test_bank_learning_events(user_id,event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,payload) VALUES('${A}','seg18-stale-event','seg18-device-a','question_exposed','cssbb','seg18-session-old','cssbb:seg18:old',(SELECT purged_at-interval '1 second' FROM public.test_bank_data_control WHERE user_id='${A}'),'{}');`),'40001');
  check('18 genuinely post-purge learning event remains permitted',()=>ok(t,commit(role(A,`INSERT INTO public.test_bank_learning_events(user_id,event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,payload) VALUES('${A}','seg18-new-event','seg18-device-a','question_exposed','cssbb','seg18-session-new','cssbb:seg18:new',clock_timestamp()+interval '1 second','{}');`))));
  denied(t,'18 stale progress snapshot without purge marker is rejected',role(A,`UPDATE public.test_bank_progress_devices SET payload=jsonb_build_object('schemaVersion',2,'values',jsonb_build_object('tb-attempt-history-v3',jsonb_build_object('attempts',jsonb_build_array(jsonb_build_object('id','resurrect')))),'resets','{}'::jsonb) WHERE user_id='${A}' AND device_id='seg18-device-a';`),'40001');
  check('18 first stale snapshot with current marker is sanitized and remains unacknowledged',()=>{
    ok(t,commit(role(A,`UPDATE public.test_bank_progress_devices SET payload=${stalePayload} WHERE user_id='${A}' AND device_id='seg18-device-a';`)));
    assert.equal(ok(t,`SELECT security_generation FROM public.test_bank_progress_devices WHERE user_id='${A}' AND device_id='seg18-device-a';`),'0');
    assert.equal(ok(t,`SELECT (payload->'values') ? 'tb-attempt-history-v3' FROM public.test_bank_progress_devices WHERE user_id='${A}' AND device_id='seg18-device-a';`),'f');
  });
  check('18 clean tombstone acknowledgement advances device generation',()=>{
    ok(t,commit(role(A,`UPDATE public.test_bank_progress_devices SET payload=${cleanPayload} WHERE user_id='${A}' AND device_id='seg18-device-a';`)));
    assert.equal(ok(t,`SELECT security_generation FROM public.test_bank_progress_devices WHERE user_id='${A}' AND device_id='seg18-device-a';`),'1');
  });
  check('18 legacy reservation compatibility still enforces authenticated owner scope',()=>{
    const result=ok(t,role(A,"SELECT count(*) FROM public.reserve_test_bank_new_questions('cssbb',ARRAY['cssbb:seg18:legacy']);"));
    assert.match(result,/^[01]$/m);
  });
  check('18 Segment16 v2 allocation remains executable to authenticated learners',()=>assert.equal(ok(t,"SELECT has_function_privilege('authenticated','public.reserve_test_bank_new_questions_v2(text,text,text,text[])','EXECUTE');"),'t'));
  check('18 data-control table has no authenticated mutation grant',()=>{
    assert.equal(ok(t,"SELECT has_table_privilege('authenticated','public.test_bank_data_control','INSERT') OR has_table_privilege('authenticated','public.test_bank_data_control','UPDATE') OR has_table_privilege('authenticated','public.test_bank_data_control','DELETE');"),'f');
  });
  console.log(JSON.stringify({status:'passed',tests:passed.length,passed},null,2));
}
main().catch(error=>{console.error(error&&error.stack||error);process.exitCode=1;});
