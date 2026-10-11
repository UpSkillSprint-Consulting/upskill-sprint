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
  for (const suffix of ['_exam_access_foundation.sql','_exam_access_admin.sql','_exam_access_directory.sql','_tool_access.sql','_exam_access_active_accounts.sql']) {
    const file=readdirSync(join(root,'supabase/migrations')).find(n=>n.endsWith(suffix));
    await db.exec(readFileSync(join(root,'supabase/migrations',file),'utf8'));
  }
  for (const [name,id] of Object.entries(ids)) await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())',[id,name+'@toolple.invalid']);
  await db.query(`insert into public.user_access_grants(user_id,access_key) values($1,'administrator'),($2,'administrator'),($3,'administrator'),($4,'premium')`,[ids.admin,ids.expired,ids.banned,ids.other]);
  await db.query("update public.user_access_grants set granted_at=now()-interval '2 days',expires_at=now()-interval '1 day' where user_id=$1",[ids.expired]);
  await db.query("update auth.users set banned_until=now()+interval '1 day' where id=$1",[ids.banned]);
  await db.query('update auth.users set email_confirmed_at=null where id=$1',[ids.unconfirmed]);
});
beforeEach(async()=>db.exec('delete from public.tool_access_requests; delete from public.user_tool_grants; delete from tool_access_private.events;'));
after(async()=>{ if(db) await db.close(); });
test('tool grants are separate from exam grants and the legacy workspace check enforces them',async()=>{
  const keys=['material_checker','material_lookup','steel_explorer'];
  const resources=['tool:/tools/material-specification-compliance-checker','tool:/engineering-tools/grade-specification-lookup','tool:/tools/steel-phase-explorer'];
  for(let i=0;i<keys.length;i++){
    await admin({operation:'grant',requested_tool_key:keys[i],expiry:'2099-01-01'});
    await asUser(ids.learner,async()=>{
      assert.equal((await db.query('select public.can_access_content($1) as allowed',[resources[i]])).rows[0].allowed,true);
      assert.equal((await db.query("select public.can_access_exam('cssbb') as allowed")).rows[0].allowed,false);
    });
    await asUser(ids.other,async()=>assert.equal((await db.query('select public.can_access_content($1) as allowed',[resources[i]])).rows[0].allowed,false));
    await admin({operation:'revoke',requested_tool_key:keys[i],expected_grant_revision:1});
    await asUser(ids.learner,async()=>assert.equal((await db.query('select public.can_access_content($1) as allowed',[resources[i]])).rows[0].allowed,false));
    await asUser(null,async()=>assert.equal((await db.query('select public.can_access_content($1) as allowed',[resources[i]])).rows[0].allowed,false),'anon');
  }
  assert.equal((await db.query('select count(*)::int as n from public.user_exam_grants')).rows[0].n,0);
});
test('tool delivery denies natural expiry and invalidated accounts',async()=>{
  await admin({operation:'grant'});
  await db.query("update auth.users set banned_until=now()+interval '1 hour' where id=$1",[ids.learner]);
  try{await asUser(ids.learner,async()=>assert.equal((await db.query("select public.can_access_tool('material_checker') as allowed")).rows[0].allowed,false));}
  finally{await db.query('update auth.users set banned_until=null where id=$1',[ids.learner]);}
  await db.query("update public.user_tool_grants set granted_at=now()-interval '2 hours',expires_at=now()-interval '1 hour' where user_id=$1",[ids.learner]);
  await asUser(ids.learner,async()=>assert.equal((await db.query("select public.can_access_tool('material_checker') as allowed")).rows[0].allowed,false));
});
test('exam delivery and directory deny invalidated accounts with existing grants or admin roles',async()=>{
  await db.exec('begin');
  try {
    for(const user of [ids.learner,ids.unconfirmed])await db.query("insert into public.user_exam_grants(user_id,exam_key) values($1,'cssbb')",[user]);
    await asUser(ids.learner,async()=>assert.equal((await db.query("select public.can_access_exam('cssbb') as allowed")).rows[0].allowed,true));
    await db.query("update auth.users set banned_until=now()+interval '1 hour' where id=$1",[ids.learner]);
    for(const user of [ids.learner,ids.banned,ids.unconfirmed,'00000000-0000-4000-a000-999999999999'])await asUser(user,async()=>{
      assert.equal((await db.query("select public.can_access_exam('cssbb') as allowed")).rows[0].allowed,false);
      const row=(await db.query("select * from public.get_my_exam_directory() where exam_key='cssbb'")).rows[0];
      assert.equal(row.can_practice,false);assert.equal(row.access_status,'locked');
    });
    await asUser(ids.admin,async()=>assert.equal((await db.query("select public.can_access_exam('cssbb') as allowed")).rows[0].allowed,true));
    await db.query('update auth.users set banned_until=now() where id=$1',[ids.learner]);
    await asUser(ids.learner,async()=>assert.equal((await db.query("select public.can_access_exam('cssbb') as allowed")).rows[0].allowed,true));
  }finally{await db.exec('rollback');}
});
async function asUser(user,fn,role='authenticated') {
  await db.exec('set role '+role); await db.query("select set_config('request.jwt.claim.sub',$1,false)",[user||'']);
  try { return await fn(); } finally { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub','',false)"); }
}
async function admin(args={},actor=ids.admin) {
  return asUser(actor,async()=> (await db.query(`select public.admin_manage_tool_access($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) as data`,
    [args.operation||'status',args.account_email??null,args.target_id??ids.learner,args.requested_tool_key??'material_checker',args.expiry??null,args.expected_grant_revision??0,args.expected_request_revision??0,args.after_time??null,args.after_user??null,args.after_tool??null])).rows[0].data);
}
async function request(actor=ids.learner,operation='request',revision=0,tool='material_checker') {
  return asUser(actor,async()=> (await db.query('select public.request_tool_access($1,$2,$3) as data',[tool,operation,revision])).rows[0].data);
}
const tool=(data,key='material_checker')=>data.tools.find(e=>e.tool_key===key);
const count=async(table)=>(await db.query('select count(*)::int as n from '+table)).rows[0].n;

test('directory combines only the caller permissions and request revisions in one read',async()=>{
  await request();await request(ids.other,'request',0,'material_lookup');
  const directory=await asUser(ids.learner,()=>db.query('select * from public.get_my_tool_directory()'));
  assert.equal(directory.rows.length,3);
  assert.equal(directory.rows.find(r=>r.tool_key==='material_checker').request_revision,1);
  assert.equal(directory.rows.find(r=>r.tool_key==='material_checker').request_status,'pending');
  assert.equal(directory.rows.find(r=>r.tool_key==='material_checker').can_use,false);
  assert.equal(directory.rows.find(r=>r.tool_key==='material_lookup').request_revision,0);
  assert.equal(directory.rows.find(r=>r.tool_key==='material_lookup').request_status,null);
  await admin({operation:'approve',expected_request_revision:1});
  const approved=await asUser(ids.learner,()=>db.query("select * from public.get_my_tool_directory() where tool_key='material_checker'"));
  assert.equal(approved.rows[0].can_use,true);assert.equal(approved.rows[0].request_revision,2);
  assert.equal(await count('public.user_tool_grants'),1);assert.equal(await count('public.tool_access_requests'),2);
  const beforeEvents=await count('tool_access_private.events');
  await asUser(ids.admin,async()=>{
    const rows=(await db.query('select * from public.get_my_tool_directory()')).rows;
    assert.ok(rows.every(row=>row.request_revision===0));
    assert.equal(rows.filter(row=>row.can_use).length,3);
  });
  assert.equal(await count('tool_access_private.events'),beforeEvents);
  await asUser(null,()=>assert.rejects(db.query('select * from public.get_my_tool_directory()'),{code:'42501'}),'anon');
  assert.equal((await db.query("select prosecdef from pg_proc where proname='get_my_tool_directory'")).rows[0].prosecdef,false);
});

test('admin authorization rejects anonymous, Premium, expired/banned admins and forged metadata',async()=>{
  for(const user of [null,ids.learner,ids.other,ids.expired,ids.banned]) for(const operation of ['status','search','account','requests','grant','approve','decline','revoke','prune']) {
    await assert.rejects(admin({operation,account_email:'learner@toolple.invalid'},user),{code:'42501'});
  }
  await asUser(null,()=>assert.rejects(db.query("select public.admin_manage_tool_access('status')"),{code:'42501'}),'anon');
  await asUser(ids.learner,async()=>{
    await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({user_metadata:{role:'administrator'}})]);
    await assert.rejects(db.query("select tool_access_private.manage_tool_access('status',null,null,null,null,null,null,null,null,null)"),{code:'42501'});
  });
  assert.deepEqual(await admin(),{administrator:true});
});
test('full email search returns one account and safe metadata without changing membership',async()=>{
  assert.equal((await admin({operation:'search',account_email:'  LEARNER@toolple.invalid '})).found,true);
  assert.equal((await admin({operation:'search',account_email:'learner'})).found,false);
  assert.equal((await admin({operation:'search',account_email:'%@toolple.invalid'})).found,false);
  assert.equal((await admin({operation:'account',target_id:ids.admin})).is_administrator,true);
  assert.equal(await count('public.user_tool_grants'),0);
  assert.equal(await count('tool_access_private.events'),0);
});
test('grant is exact, revisioned, audited, and independent of membership',async()=>{
  const result=await admin({operation:'grant',expiry:'2099-01-01T00:00:00Z'});
  assert.equal(tool(result).grant_revision,1); assert.equal(tool(result).access_status,'granted');
  assert.equal(tool(result,'material_lookup').access_status,'locked');
  const allowed=await asUser(ids.learner,()=>db.query("select public.can_access_tool('material_checker') as material_checker,public.can_access_tool('material_lookup') as material_lookup,public.current_access_level() as level"));
  assert.deepEqual(allowed.rows[0],{material_checker:true,material_lookup:false,level:'registered'});
  assert.equal(result.history[0].actor_id,ids.admin);
  assert.equal(result.history[0].event_kind,'grant');
});
test('stale edits, absent revisions and invalid inputs fail without overwriting a grant',async()=>{
  await admin({operation:'grant'});
  await assert.rejects(admin({operation:'revoke'}),{code:'40001'});
  await asUser(ids.admin,()=>assert.rejects(db.query("select public.admin_manage_tool_access('revoke',target_id=>$1,requested_tool_key=>'material_checker')",[ids.learner]),{code:'40001'}));
  for(const key of ['*','PMP','unknown','cqa']) await assert.rejects(admin({operation:'grant',requested_tool_key:key}),{code:'22023'});
  for(const expiry of ['2000-01-01','infinity','-infinity']) await assert.rejects(admin({operation:'grant',expiry,expected_grant_revision:1}),{code:'22023'});
  assert.equal(tool(await admin({operation:'account'})).grant_revision,1);
  assert.equal(await count('tool_access_private.events'),1);
});
test('no-op saves do not increment revisions or add history; expiry and revoke take effect',async()=>{
  await admin({operation:'grant'});
  await admin({operation:'grant',expected_grant_revision:1});
  assert.equal(await count('tool_access_private.events'),1);
  assert.equal(tool(await admin({operation:'account'})).grant_revision,1);
  await admin({operation:'grant',expected_grant_revision:1,expiry:'2099-01-01'});
  const revoked=await admin({operation:'revoke',expected_grant_revision:2});
  assert.equal(tool(revoked).grant_revision,3); assert.equal(tool(revoked).access_status,'revoked');
  assert.equal((await asUser(ids.learner,()=>db.query("select public.can_access_tool('material_checker') as allowed"))).rows[0].allowed,false);
  await admin({operation:'revoke',expected_grant_revision:3}); assert.equal(await count('tool_access_private.events'),3);
});
test('learner requests are caller-only, idempotent and bounded; approved status cannot be forged',async()=>{
  assert.deepEqual(await request(),{tool_key:'material_checker',status:'pending',revision:1});
  assert.equal((await request(ids.learner,'request',1)).revision,1);
  assert.equal(await count('public.tool_access_requests'),1); assert.equal(await count('tool_access_private.events'),0);
  await assert.rejects(request(ids.learner,'approved',1),{code:'22023'});
  await assert.rejects(request(ids.learner,'request',0),{code:'40001'});
  await assert.rejects(request(ids.learner,'request',0,'cqa'),{code:'22023'});
  for(const user of [null,ids.banned,ids.unconfirmed]) await assert.rejects(request(user),{code:'42501'});
  await asUser(ids.other,async()=>assert.equal((await db.query('select * from public.tool_access_requests')).rows.length,0));
  assert.equal((await request(ids.learner,'cancel',1)).revision,2);
  await assert.rejects(request(ids.learner,'request',2),{code:'22023'});
  await db.query("update public.tool_access_requests set requested_at=now()-interval '2 days' where user_id=$1",[ids.learner]);
  assert.equal((await request(ids.learner,'request',3)).status,'pending');
  assert.equal(await count('public.tool_access_requests'),1); assert.equal(await count('public.user_tool_grants'),0);
});
test('approval grants exactly one tool and records both decisions atomically',async()=>{
  await request();
  await assert.rejects(admin({operation:'approve',expected_request_revision:1,expiry:'2000-01-01'}),{code:'22023'});
  assert.equal(await count('public.user_tool_grants'),0);
  assert.equal(tool(await admin({operation:'account'})).request_status,'pending');
  const result=await admin({operation:'approve',expected_request_revision:1});
  assert.equal(tool(result).request_status,'approved'); assert.equal(tool(result).access_status,'granted');
  assert.equal(result.history.length,2); assert.ok(result.history.every(e=>e.actor_id===ids.admin));
  assert.equal(await count('public.user_tool_grants'),1);
  await assert.rejects(admin({operation:'decline',expected_request_revision:1}),{code:'40001'});
  await assert.rejects(request(ids.learner,'request',2),{code:'22023'});
});
test('approval rolls back its grant if request review fails',async()=>{
  await request();
  await db.exec(`create function tool_access_private.test_reject_review() returns trigger language plpgsql as $$ begin raise exception 'test review failure'; end $$;
    create trigger test_reject_review before update on public.tool_access_requests for each row execute function tool_access_private.test_reject_review();`);
  try { await assert.rejects(admin({operation:'approve',expected_request_revision:1}),/test review failure/); }
  finally { await db.exec('drop trigger test_reject_review on public.tool_access_requests; drop function tool_access_private.test_reject_review();'); }
  assert.equal(await count('public.user_tool_grants'),0); assert.equal(await count('tool_access_private.events'),0);
  assert.equal(tool(await admin({operation:'account'})).request_status,'pending');
});
test('decline never grants; cancellation and fresh requests invalidate stale administrator review',async()=>{
  await request(); await request(ids.learner,'cancel',1);
  await assert.rejects(admin({operation:'approve',expected_request_revision:1}),{code:'40001'});
  await db.query("update public.tool_access_requests set requested_at=now()-interval '2 days' where user_id=$1",[ids.learner]);
  await request(ids.learner,'request',3);
  const result=await admin({operation:'decline',expected_request_revision:4});
  assert.equal(tool(result).request_status,'declined'); assert.equal(await count('public.user_tool_grants'),0);
  assert.equal(result.history[0].event_kind,'request');
});
test('direct grant closes a pending request and cannot overwrite an unseen request',async()=>{
  await request(); await assert.rejects(admin({operation:'grant'}),{code:'40001'});
  const result=await admin({operation:'grant',expected_request_revision:1});
  assert.equal(tool(result).request_status,'approved'); assert.equal(tool(result).access_status,'granted');
});
test('administrator inheritance and invalid learner accounts cannot be granted or revoked through this API',async()=>{
  for(const target of [ids.admin,ids.banned,ids.unconfirmed]) await assert.rejects(admin({operation:'grant',target_id:target}),{code:'22023'});
  await assert.rejects(admin({operation:'revoke',target_id:ids.admin}),{code:'22023'});
  assert.equal(await count('public.user_tool_grants'),0);
});
test('pending queue uses capped keyset pages with deterministic ties',async()=>{
  await db.exec(`insert into auth.users(id,email,email_confirmed_at) select ('10000000-0000-4000-a000-'||lpad(i::text,12,'0'))::uuid,'queue'||i||'@toolple.invalid',now() from generate_series(1,30) i;
    insert into public.tool_access_requests(user_id,tool_key,requested_at) select id,'material_checker','2026-01-01' from auth.users where email like 'queue%';`);
  const first=await admin({operation:'requests'}); assert.equal(first.requests.length,25); assert.ok(first.next_cursor);
  const second=await admin({operation:'requests',...first.next_cursor}); assert.equal(second.requests.length,5); assert.equal(second.next_cursor,null);
  assert.equal(new Set([...first.requests,...second.requests].map(r=>r.user_id)).size,30);
  await assert.rejects(admin({operation:'requests',after_user:ids.learner}),{code:'22023'});
});
test('history has a hard per-tool cap and cleanup deletes only old audit rows in bounded batches',async()=>{
  for(let i=0;i<24;i++) await admin({operation:i%2?'revoke':'grant',expected_grant_revision:i});
  assert.equal(await count('tool_access_private.events'),20);
  await db.exec('alter table tool_access_private.events disable trigger tool_events_trim');
  try { await db.query(`insert into tool_access_private.events(user_id,tool_key,actor_source,operation,changed_at)
    select $1,'material_checker','database','UPDATE',now()-interval '91 days' from generate_series(1,220)`,[ids.other]); }
  finally { await db.exec('alter table tool_access_private.events enable trigger tool_events_trim'); }
  assert.equal((await admin({operation:'prune'})).removed,200);
  assert.equal((await admin({operation:'prune'})).removed,20);
  assert.equal((await admin({operation:'prune'})).removed,0);
  assert.equal(await count('tool_access_private.events'),20); assert.equal(await count('public.user_tool_grants'),1);
});
test('facades are invoker; helpers and all direct grant/request writes remain blocked',async()=>{
  const funcs=(await db.query("select prosecdef from pg_proc where proname in ('admin_manage_tool_access','request_tool_access') and pronamespace='public'::regnamespace")).rows;
  assert.equal(funcs.length,2); assert.ok(funcs.every(f=>!f.prosecdef));
  for(const user of [ids.admin,ids.learner]) await asUser(user,async()=>{
    for(const table of ['user_tool_grants','tool_access_requests']) await assert.rejects(db.query(`insert into public.${table}(user_id,tool_key) values($1,'material_checker')`,[user]),{code:'42501'});
    await assert.rejects(db.query('select * from tool_access_private.events'),{code:'42501'});
    await assert.rejects(db.query('select tool_access_private.prune_history()'),{code:'42501'});
    await assert.rejects(db.query('update public.user_access_grants set access_key=\'administrator\''),{code:'42501'});
  });
});
