const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');
const { PGlite } = require('@electric-sql/pglite');
const root = join(__dirname,'..');
const ids = {admin:'00000000-0000-4000-a000-000000000001',learner:'00000000-0000-4000-a000-000000000002',other:'00000000-0000-4000-a000-000000000003',expired:'00000000-0000-4000-a000-000000000004',banned:'00000000-0000-4000-a000-000000000005',unconfirmed:'00000000-0000-4000-a000-000000000006'};
let db;
before(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create schema auth;
    create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,banned_until timestamptz);
    create index users_email on auth.users(lower(email));
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth to anon,authenticated;`);
  await db.exec(readFileSync(join(root,'supabase/access-levels.sql'),'utf8'));
  for (const suffix of ['_exam_access_foundation.sql','_exam_access_admin.sql']) {
    const file=readdirSync(join(root,'supabase/migrations')).find(n=>n.endsWith(suffix));
    await db.exec(readFileSync(join(root,'supabase/migrations',file),'utf8'));
  }
  for (const [name,id] of Object.entries(ids)) await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())',[id,name+'@example.invalid']);
  await db.query(`insert into public.user_access_grants(user_id,access_key) values($1,'administrator'),($2,'administrator'),($3,'administrator'),($4,'premium')`,[ids.admin,ids.expired,ids.banned,ids.other]);
  await db.query("update public.user_access_grants set granted_at=now()-interval '2 days',expires_at=now()-interval '1 day' where user_id=$1",[ids.expired]);
  await db.query("update auth.users set banned_until=now()+interval '1 day' where id=$1",[ids.banned]);
  await db.query('update auth.users set email_confirmed_at=null where id=$1',[ids.unconfirmed]);
});
beforeEach(async()=>db.exec('delete from public.exam_access_requests; delete from public.user_exam_grants; delete from exam_access_private.events;'));
after(async()=>{ if(db) await db.close(); });
async function asUser(user,fn,role='authenticated') {
  await db.exec('set role '+role); await db.query("select set_config('request.jwt.claim.sub',$1,false)",[user||'']);
  try { return await fn(); } finally { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub','',false)"); }
}
async function admin(args={},actor=ids.admin) {
  return asUser(actor,async()=> (await db.query(`select public.admin_manage_exam_access($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) as data`,
    [args.operation||'status',args.account_email??null,args.target_id??ids.learner,args.requested_exam_key??'pmp',args.expiry??null,args.expected_grant_revision??0,args.expected_request_revision??0,args.after_time??null,args.after_user??null,args.after_exam??null])).rows[0].data);
}
async function request(actor=ids.learner,operation='request',revision=0,exam='pmp') {
  return asUser(actor,async()=> (await db.query('select public.request_exam_access($1,$2,$3) as data',[exam,operation,revision])).rows[0].data);
}
const exam=(data,key='pmp')=>data.exams.find(e=>e.exam_key===key);
const count=async(table)=>(await db.query('select count(*)::int as n from '+table)).rows[0].n;

test('admin authorization rejects anonymous, Premium, expired/banned admins and forged metadata',async()=>{
  for(const user of [null,ids.learner,ids.other,ids.expired,ids.banned]) for(const operation of ['status','search','account','requests','grant','approve','decline','revoke','prune']) {
    await assert.rejects(admin({operation,account_email:'learner@example.invalid'},user),{code:'42501'});
  }
  await asUser(null,()=>assert.rejects(db.query("select public.admin_manage_exam_access('status')"),{code:'42501'}),'anon');
  await asUser(ids.learner,async()=>{
    await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({user_metadata:{role:'administrator'}})]);
    await assert.rejects(db.query("select exam_access_private.manage_exam_access('status',null,null,null,null,null,null,null,null,null)"),{code:'42501'});
  });
  assert.deepEqual(await admin(),{administrator:true});
});
test('full email search returns one account and safe metadata without changing membership',async()=>{
  assert.equal((await admin({operation:'search',account_email:'  LEARNER@example.invalid '})).found,true);
  assert.equal((await admin({operation:'search',account_email:'learner'})).found,false);
  assert.equal((await admin({operation:'search',account_email:'%@example.invalid'})).found,false);
  assert.equal((await admin({operation:'account',target_id:ids.admin})).is_administrator,true);
  assert.equal(await count('public.user_exam_grants'),0);
  assert.equal(await count('exam_access_private.events'),0);
});
test('grant is exact, revisioned, audited, and independent of membership',async()=>{
  const result=await admin({operation:'grant',expiry:'2099-01-01T00:00:00Z'});
  assert.equal(exam(result).grant_revision,1); assert.equal(exam(result).access_status,'granted');
  assert.equal(exam(result,'cqe').access_status,'locked');
  const allowed=await asUser(ids.learner,()=>db.query("select public.can_access_exam('pmp') as pmp,public.can_access_exam('cqe') as cqe,public.current_access_level() as level"));
  assert.deepEqual(allowed.rows[0],{pmp:true,cqe:false,level:'registered'});
  assert.equal(result.history[0].actor_id,ids.admin);
  assert.equal(result.history[0].event_kind,'grant');
});
test('stale edits, absent revisions and invalid inputs fail without overwriting a grant',async()=>{
  await admin({operation:'grant'});
  await assert.rejects(admin({operation:'revoke'}),{code:'40001'});
  await asUser(ids.admin,()=>assert.rejects(db.query("select public.admin_manage_exam_access('revoke',target_id=>$1,requested_exam_key=>'pmp')",[ids.learner]),{code:'40001'}));
  for(const key of ['*','PMP','unknown','cqa']) await assert.rejects(admin({operation:'grant',requested_exam_key:key}),{code:'22023'});
  for(const expiry of ['2000-01-01','infinity','-infinity']) await assert.rejects(admin({operation:'grant',expiry,expected_grant_revision:1}),{code:'22023'});
  assert.equal(exam(await admin({operation:'account'})).grant_revision,1);
  assert.equal(await count('exam_access_private.events'),1);
});
test('no-op saves do not increment revisions or add history; expiry and revoke take effect',async()=>{
  await admin({operation:'grant'});
  await admin({operation:'grant',expected_grant_revision:1});
  assert.equal(await count('exam_access_private.events'),1);
  assert.equal(exam(await admin({operation:'account'})).grant_revision,1);
  await admin({operation:'grant',expected_grant_revision:1,expiry:'2099-01-01'});
  const revoked=await admin({operation:'revoke',expected_grant_revision:2});
  assert.equal(exam(revoked).grant_revision,3); assert.equal(exam(revoked).access_status,'revoked');
  assert.equal((await asUser(ids.learner,()=>db.query("select public.can_access_exam('pmp') as allowed"))).rows[0].allowed,false);
  await admin({operation:'revoke',expected_grant_revision:3}); assert.equal(await count('exam_access_private.events'),3);
});
test('learner requests are caller-only, idempotent and bounded; approved status cannot be forged',async()=>{
  assert.deepEqual(await request(),{exam_key:'pmp',status:'pending',revision:1});
  assert.equal((await request(ids.learner,'request',1)).revision,1);
  assert.equal(await count('public.exam_access_requests'),1); assert.equal(await count('exam_access_private.events'),0);
  await assert.rejects(request(ids.learner,'approved',1),{code:'22023'});
  await assert.rejects(request(ids.learner,'request',0),{code:'40001'});
  await assert.rejects(request(ids.learner,'request',0,'cqa'),{code:'22023'});
  for(const user of [null,ids.banned,ids.unconfirmed]) await assert.rejects(request(user),{code:'42501'});
  await asUser(ids.other,async()=>assert.equal((await db.query('select * from public.exam_access_requests')).rows.length,0));
  assert.equal((await request(ids.learner,'cancel',1)).revision,2);
  await assert.rejects(request(ids.learner,'request',2),{code:'22023'});
  await db.query("update public.exam_access_requests set requested_at=now()-interval '2 days' where user_id=$1",[ids.learner]);
  assert.equal((await request(ids.learner,'request',3)).status,'pending');
  assert.equal(await count('public.exam_access_requests'),1); assert.equal(await count('public.user_exam_grants'),0);
});
test('approval grants exactly one exam and records both decisions atomically',async()=>{
  await request();
  await assert.rejects(admin({operation:'approve',expected_request_revision:1,expiry:'2000-01-01'}),{code:'22023'});
  assert.equal(await count('public.user_exam_grants'),0);
  assert.equal(exam(await admin({operation:'account'})).request_status,'pending');
  const result=await admin({operation:'approve',expected_request_revision:1});
  assert.equal(exam(result).request_status,'approved'); assert.equal(exam(result).access_status,'granted');
  assert.equal(result.history.length,2); assert.ok(result.history.every(e=>e.actor_id===ids.admin));
  assert.equal(await count('public.user_exam_grants'),1);
  await assert.rejects(admin({operation:'decline',expected_request_revision:1}),{code:'40001'});
  await assert.rejects(request(ids.learner,'request',2),{code:'22023'});
});
test('approval rolls back its grant if request review fails',async()=>{
  await request();
  await db.exec(`create function exam_access_private.test_reject_review() returns trigger language plpgsql as $$ begin raise exception 'test review failure'; end $$;
    create trigger test_reject_review before update on public.exam_access_requests for each row execute function exam_access_private.test_reject_review();`);
  try { await assert.rejects(admin({operation:'approve',expected_request_revision:1}),/test review failure/); }
  finally { await db.exec('drop trigger test_reject_review on public.exam_access_requests; drop function exam_access_private.test_reject_review();'); }
  assert.equal(await count('public.user_exam_grants'),0); assert.equal(await count('exam_access_private.events'),0);
  assert.equal(exam(await admin({operation:'account'})).request_status,'pending');
});
test('decline never grants; cancellation and fresh requests invalidate stale administrator review',async()=>{
  await request(); await request(ids.learner,'cancel',1);
  await assert.rejects(admin({operation:'approve',expected_request_revision:1}),{code:'40001'});
  await db.query("update public.exam_access_requests set requested_at=now()-interval '2 days' where user_id=$1",[ids.learner]);
  await request(ids.learner,'request',3);
  const result=await admin({operation:'decline',expected_request_revision:4});
  assert.equal(exam(result).request_status,'declined'); assert.equal(await count('public.user_exam_grants'),0);
  assert.equal(result.history[0].event_kind,'request');
});
test('direct grant closes a pending request and cannot overwrite an unseen request',async()=>{
  await request(); await assert.rejects(admin({operation:'grant'}),{code:'40001'});
  const result=await admin({operation:'grant',expected_request_revision:1});
  assert.equal(exam(result).request_status,'approved'); assert.equal(exam(result).access_status,'granted');
});
test('administrator inheritance and invalid learner accounts cannot be granted or revoked through this API',async()=>{
  for(const target of [ids.admin,ids.banned,ids.unconfirmed]) await assert.rejects(admin({operation:'grant',target_id:target}),{code:'22023'});
  await assert.rejects(admin({operation:'revoke',target_id:ids.admin}),{code:'22023'});
  assert.equal(await count('public.user_exam_grants'),0);
});
test('pending queue uses capped keyset pages with deterministic ties',async()=>{
  await db.exec(`insert into auth.users(id,email,email_confirmed_at) select ('10000000-0000-4000-a000-'||lpad(i::text,12,'0'))::uuid,'queue'||i||'@example.invalid',now() from generate_series(1,30) i;
    insert into public.exam_access_requests(user_id,exam_key,requested_at) select id,'pmp','2026-01-01' from auth.users where email like 'queue%';`);
  const first=await admin({operation:'requests'}); assert.equal(first.requests.length,25); assert.ok(first.next_cursor);
  const second=await admin({operation:'requests',...first.next_cursor}); assert.equal(second.requests.length,5); assert.equal(second.next_cursor,null);
  assert.equal(new Set([...first.requests,...second.requests].map(r=>r.user_id)).size,30);
  await assert.rejects(admin({operation:'requests',after_user:ids.learner}),{code:'22023'});
});
test('history has a hard per-exam cap and cleanup deletes only old audit rows in bounded batches',async()=>{
  for(let i=0;i<24;i++) await admin({operation:i%2?'revoke':'grant',expected_grant_revision:i});
  assert.equal(await count('exam_access_private.events'),20);
  await db.exec('alter table exam_access_private.events disable trigger exam_events_trim');
  try { await db.query(`insert into exam_access_private.events(user_id,exam_key,actor_source,operation,changed_at)
    select $1,'pmp','database','UPDATE',now()-interval '91 days' from generate_series(1,220)`,[ids.other]); }
  finally { await db.exec('alter table exam_access_private.events enable trigger exam_events_trim'); }
  assert.equal((await admin({operation:'prune'})).removed,200);
  assert.equal((await admin({operation:'prune'})).removed,20);
  assert.equal((await admin({operation:'prune'})).removed,0);
  assert.equal(await count('exam_access_private.events'),20); assert.equal(await count('public.user_exam_grants'),1);
});
test('facades are invoker; helpers and all direct grant/request writes remain blocked',async()=>{
  const funcs=(await db.query("select prosecdef from pg_proc where proname in ('admin_manage_exam_access','request_exam_access') and pronamespace='public'::regnamespace")).rows;
  assert.equal(funcs.length,2); assert.ok(funcs.every(f=>!f.prosecdef));
  for(const user of [ids.admin,ids.learner]) await asUser(user,async()=>{
    for(const table of ['user_exam_grants','exam_access_requests']) await assert.rejects(db.query(`insert into public.${table}(user_id,exam_key) values($1,'pmp')`,[user]),{code:'42501'});
    await assert.rejects(db.query('select * from exam_access_private.events'),{code:'42501'});
    await assert.rejects(db.query('select exam_access_private.prune_history()'),{code:'42501'});
    await assert.rejects(db.query('update public.user_access_grants set access_key=\'administrator\''),{code:'42501'});
  });
});
