'use strict';
const assert=require('node:assert/strict');
const {spawn,spawnSync}=require('node:child_process');
const {validateTarget}=require('./run-database.cjs');
const A='10000000-0000-4000-8000-000000000001';
const B='10000000-0000-4000-8000-000000000002';
const EXAM='segment16exam';
const passed=[];
function cli(t){return ['-X','-q','-v','ON_ERROR_STOP=1','-v','VERBOSITY=verbose','-A','-t','-h',t.url.hostname,'-p',t.url.port||'5432','-U',decodeURIComponent(t.url.username),'segment03_test'];}
function run(t,sql){const r=spawnSync('psql',cli(t),{env:t.env,input:sql,encoding:'utf8',timeout:30000,maxBuffer:5*1024*1024});if(r.error)throw r.error;return r;}
function ok(t,sql){const r=run(t,sql);assert.equal(r.status,0,(r.stderr||'').slice(-3000));return String(r.stdout||'').trim();}
function role(user,sql,as='authenticated'){return `BEGIN; SET LOCAL ROLE ${as}; SET LOCAL request.jwt.claim.sub='${user||''}';\n${sql}\nROLLBACK;`;}
function commit(sql){return sql.replace(/ROLLBACK;$/,'COMMIT;');}
function denied(t,name,sql,code){const r=run(t,sql);assert.notEqual(r.status,0,name);assert.ok(String(r.stderr||'').includes(code),`${name}: expected ${code}\n${r.stderr}`);passed.push(name);}
function check(name,fn){fn();passed.push(name);}
function concurrent(t,sql){return new Promise((resolve,reject)=>{let stdout='',stderr='';const c=spawn('psql',cli(t),{env:t.env});const timer=setTimeout(()=>c.kill('SIGKILL'),30000);c.stdout.on('data',x=>stdout+=x);c.stderr.on('data',x=>stderr+=x);c.on('error',reject);c.on('close',(status,signal)=>{clearTimeout(timer);resolve({status,signal,stdout:String(stdout).trim(),stderr});});c.stdin.end(sql);});}
function allocate(user,plan,req,ids){return role(user,`SELECT reservation_id,planned_session_id,question_id,item_state,reused FROM public.reserve_test_bank_new_questions_v2('${EXAM}','${plan}','${req}',ARRAY[${ids.map(x=>`'${x}'`).join(',')}]);`);}
async function main(){
  const t=validateTarget(process.env.SEG03_DB_URL||'',process.env.SEG03_ALLOW_DISPOSABLE_DB);
  ok(t,`DELETE FROM public.test_bank_new_only_reservation_items WHERE reservation_id IN (SELECT reservation_id FROM public.test_bank_new_only_reservations WHERE exam_id='${EXAM}'); DELETE FROM public.test_bank_new_only_reservations WHERE exam_id='${EXAM}'; DELETE FROM public.test_bank_new_question_claims WHERE exam_id='${EXAM}'; DELETE FROM public.test_bank_learning_events WHERE exam_id='${EXAM}';`);
  check('16 schema and RPC boundary exist',()=>{
    assert.equal(ok(t,"SELECT count(*) FROM pg_proc WHERE proname IN ('reserve_test_bank_new_questions_v2','mark_test_bank_new_only_reservation_v2','fetch_test_bank_new_only_reservation_v2');"),'3');
    assert.equal(ok(t,"SELECT count(*) FROM pg_class WHERE relname IN ('test_bank_new_only_reservations','test_bank_new_only_reservation_items');"),'2');
  });
  denied(t,'16 authenticated role cannot read reservation headers directly',role(A,'SELECT * FROM public.test_bank_new_only_reservations;'),'42501');
  denied(t,'16 authenticated role cannot read reservation items directly',role(A,'SELECT * FROM public.test_bank_new_only_reservation_items;'),'42501');
  denied(t,'16 anonymous allocation is denied',role(null,`SELECT * FROM public.reserve_test_bank_new_questions_v2('${EXAM}','anon-plan','anon-request',ARRAY['${EXAM}:q1']);`,'anon'),'42501');

  const first=ok(t,commit(allocate(A,'plan-a','request-a',[`${EXAM}:q1`,`${EXAM}:q2`])));
  const rid=first.split('\n')[0].split('|')[0];
  check('16 first authoritative allocation permanently claims candidates',()=>{
    assert.ok(/segment16exam:q1/.test(first)&&/segment16exam:q2/.test(first));
    assert.equal(ok(t,`SELECT count(*) FROM public.test_bank_new_question_claims WHERE user_id='${A}' AND exam_id='${EXAM}';`),'2');
    assert.equal(ok(t,`SELECT count(*) FROM public.test_bank_learning_events WHERE user_id='${A}' AND exam_id='${EXAM}';`),'0');
  });
  check('16 interrupted Start reuses exact planned-session reservation without new claims',()=>{
    const retry=ok(t,commit(allocate(A,'plan-a','request-retry',[`${EXAM}:q1`,`${EXAM}:q2`,`${EXAM}:q3`])));
    assert.match(retry,/\|t(?:\n|$)/);
    assert.equal(ok(t,`SELECT count(*) FROM public.test_bank_new_question_claims WHERE user_id='${A}' AND exam_id='${EXAM}';`),'2');
    assert.equal(ok(t,`SELECT count(*) FROM public.test_bank_new_only_reservation_items WHERE reservation_id='${rid}';`),'2');
  });
  check('16 lifecycle separates delivery display and answer monotonically',()=>{
    ok(t,commit(role(A,`SELECT * FROM public.mark_test_bank_new_only_reservation_v2('${rid}','delivered',NULL);`)));
    ok(t,commit(role(A,`SELECT * FROM public.mark_test_bank_new_only_reservation_v2('${rid}','displayed','${EXAM}:q1');`)));
    ok(t,commit(role(A,`SELECT * FROM public.mark_test_bank_new_only_reservation_v2('${rid}','answered','${EXAM}:q1');`)));
    ok(t,commit(role(A,`SELECT * FROM public.mark_test_bank_new_only_reservation_v2('${rid}','delivered','${EXAM}:q1');`)));
    assert.equal(ok(t,`SELECT state FROM public.test_bank_new_only_reservation_items WHERE reservation_id='${rid}' AND question_id='${EXAM}:q1';`),'answered');
    assert.equal(ok(t,`SELECT state FROM public.test_bank_new_only_reservation_items WHERE reservation_id='${rid}' AND question_id='${EXAM}:q2';`),'delivered');
  });
  denied(t,'16 another owner cannot mutate reservation lifecycle',role(B,`SELECT * FROM public.mark_test_bank_new_only_reservation_v2('${rid}','displayed','${EXAM}:q2');`),'42501');
  check('16 another owner cannot fetch owner A planned reservation',()=>assert.equal(ok(t,role(B,"SELECT count(*) FROM public.fetch_test_bank_new_only_reservation_v2('plan-a');")),'0'));

  const abandon=ok(t,commit(allocate(A,'plan-abandon','request-abandon',[`${EXAM}:q3`])));
  const abandonRid=abandon.split('\n')[0].split('|')[0];
  const before=ok(t,`SELECT count(*) FROM public.test_bank_new_question_claims WHERE user_id='${A}' AND exam_id='${EXAM}';`);
  ok(t,commit(role(A,`SELECT * FROM public.mark_test_bank_new_only_reservation_v2('${abandonRid}','abandoned',NULL);`)));
  check('16 abandonment never releases lifetime New-only claim',()=>{
    assert.equal(ok(t,`SELECT state FROM public.test_bank_new_only_reservations WHERE reservation_id='${abandonRid}';`),'abandoned');
    assert.equal(ok(t,`SELECT count(*) FROM public.test_bank_new_question_claims WHERE user_id='${A}' AND exam_id='${EXAM}';`),before);
  });

  const raceIds=[`${EXAM}:race1`,`${EXAM}:race2`];
  const race=await Promise.all([
    concurrent(t,commit(allocate(A,'race-plan-one','race-request-one',raceIds))),
    concurrent(t,commit(allocate(A,'race-plan-two','race-request-two',raceIds)))
  ]);
  check('16 two online devices cannot obtain overlapping authoritative allocations',()=>{
    assert.equal(race.filter(x=>x.status===0).length,1,'exactly one competing allocation should win shared candidates');
    assert.equal(race.filter(x=>x.status!==0&&/NEW_ONLY_EXHAUSTED/.test(x.stderr)).length,1,'loser must receive explicit exhaustion');
    assert.equal(ok(t,`SELECT count(*) FROM public.test_bank_new_question_claims WHERE user_id='${A}' AND exam_id='${EXAM}' AND question_id LIKE '${EXAM}:race%';`),'2');
  });
  denied(t,'16 exhausted fresh plan fails explicitly and atomically',allocate(A,'exhausted-plan','exhausted-request',raceIds),'P0001');
  check('16 exhausted allocation leaves no empty reservation header',()=>assert.equal(ok(t,`SELECT count(*) FROM public.test_bank_new_only_reservations WHERE user_id='${A}' AND exam_id='${EXAM}' AND planned_session_id='exhausted-plan';`),'0'));
  check('16 owner isolation permits another account to reserve same canonical IDs',()=>{
    const other=ok(t,commit(allocate(B,'owner-b-plan','owner-b-request',raceIds)));
    assert.ok(/segment16exam:race1/.test(other));
    assert.equal(ok(t,`SELECT count(*) FROM public.test_bank_new_question_claims WHERE user_id='${B}' AND exam_id='${EXAM}';`),'2');
  });
  console.log(JSON.stringify({status:'passed',tests:passed.length,passed},null,2));
}
main().catch(e=>{console.error(e&&e.stack||e);process.exitCode=1;});
