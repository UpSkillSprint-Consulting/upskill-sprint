const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');
const { PGlite } = require('@electric-sql/pglite');

// Real local PostgreSQL execution, never a hosted project or a production account.
const root = join(__dirname, '..');
const migration = readdirSync(join(root, 'supabase/migrations')).find(n => n.endsWith('_exam_access_foundation.sql'));
const users = {
  premium: '00000000-0000-4000-a000-000000000001',
  learner: '00000000-0000-4000-a000-000000000002',
  other: '00000000-0000-4000-a000-000000000003',
  admin: '00000000-0000-4000-a000-000000000004',
  special: '00000000-0000-4000-a000-000000000005',
  expiredAdmin: '00000000-0000-4000-a000-000000000006'
};
let db;
before(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon;
    create role authenticated;
    create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
    $$;
    grant usage on schema auth to anon, authenticated;
  `);
  await db.exec(readFileSync(join(root, 'supabase/access-levels.sql'), 'utf8'));
  await db.exec(readFileSync(join(root, 'supabase/premium-simulator-access.sql'), 'utf8'));
  await db.exec(readFileSync(join(root, 'supabase/migrations', migration), 'utf8'));
  for (const id of Object.values(users)) await db.query('insert into auth.users(id) values($1)', [id]);
  await db.query(`insert into public.user_access_grants(user_id,access_key) values
    ($1,'premium'),($2,'administrator'),($3,'special')`, [users.premium, users.admin, users.special]);
  await db.query(`insert into public.user_access_grants(user_id,access_key,granted_at,expires_at)
    values($1,'administrator',now()-interval '2 days',now()-interval '1 day')`, [users.expiredAdmin]);
});
after(async () => { if (db) await db.close(); });

async function asUser(user, fn, role = 'authenticated') {
  await db.exec(`set role ${role}`);
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [user || '']);
  try { return await fn(); }
  finally {
    await db.exec('reset role');
    await db.query("select set_config('request.jwt.claim.sub','',false)");
  }
}
async function allowed(exam) {
  return (await db.query('select public.can_access_exam($1) as allowed', [exam])).rows[0].allowed;
}
async function status(exam) {
  return (await db.query('select * from public.get_my_exam_access() where exam_key=$1', [exam])).rows[0];
}
async function grant(user, exam, options = {}) {
  await db.query(`insert into public.user_exam_grants(user_id,exam_key,granted_by,granted_at,expires_at)
    values($1,$2,$3,$4::timestamptz,$5::timestamptz)`,
  [user, exam, users.admin, options.start || '2020-01-01T00:00:00Z', options.expiry || null]);
}

test('foundation leaves the existing Premium rule intact and creates no learner grants', async () => {
  assert.equal((await db.query('select count(*)::int as n from public.user_exam_grants')).rows[0].n, 0);
  assert.equal((await db.query('select count(*)::int as n from public.exam_catalog')).rows[0].n, 8);
  await asUser(users.premium, async () => {
    assert.equal((await db.query("select public.can_access_content('exam:/test-bank') as allowed")).rows[0].allowed, true);
    assert.equal(await allowed('pmp'), false);
    assert.equal((await status('pmp')).access_status, 'locked');
  });
});

test('anonymous users see metadata but cannot read grants, requests, or call personal RPCs', async () => {
  await asUser(null, async () => {
    assert.equal((await db.query('select count(*)::int as n from public.exam_catalog')).rows[0].n, 8);
    for (const sql of ['select * from public.user_exam_grants', 'select * from public.exam_access_requests',
      'select * from public.get_my_exam_access()', "select public.can_access_exam('pmp')"]) {
      await assert.rejects(db.query(sql), { code: '42501' });
    }
  }, 'anon');
  await asUser(null, async () => assert.equal(await allowed('pmp'), false));
});

test('one explicit grant authorizes only its exam, independently of Premium membership', async () => {
  await grant(users.learner, 'pmp');
  await asUser(users.learner, async () => {
    assert.equal(await allowed('pmp'), true);
    assert.equal(await allowed('cqe'), false);
    assert.equal((await status('pmp')).access_status, 'granted');
    assert.equal((await status('pmp')).grant_revision, 1);
  });
  await asUser(users.other, async () => {
    assert.equal(await allowed('pmp'), false);
    assert.equal((await db.query('select * from public.user_exam_grants')).rows.length, 0);
  });
  for (const user of [users.premium, users.special]) await asUser(user, async () => assert.equal(await allowed('pmp'), false));
});

test('current administrators can access published exams; expired administrator roles cannot', async () => {
  await asUser(users.admin, async () => {
    assert.equal(await allowed('cqe'), true);
    assert.equal(await allowed('cqa'), false);
  });
  await asUser(users.expiredAdmin, async () => assert.equal(await allowed('cqe'), false));
});

test('unknown, malformed, wildcard, missing and upcoming exam keys never authorize', async () => {
  await grant(users.learner, 'cqa');
  for (const user of [users.learner, users.admin]) await asUser(user, async () => {
    for (const key of [null, '', '*', 'PMP', 'pmp OR 1=1', 'future-exam', 'cqa']) assert.equal(await allowed(key), false);
    assert.equal((await status('cqa')).access_status, 'coming_soon');
  });
});

test('a future published certification defaults to locked and does not inherit another grant', async () => {
  await db.exec("insert into public.exam_catalog(exam_key,display_name,badge,publication_status) values('future','Future certification','FUT','published')");
  await asUser(users.learner, async () => assert.equal(await allowed('future'), false));
});

test('expiry is evaluated at read time, including exactly at expiry, without a background job', async () => {
  await grant(users.learner, 'cqe', { expiry: '2020-01-02T00:00:00Z' });
  await asUser(users.learner, async () => {
    assert.equal(await allowed('cqe'), false);
    assert.equal((await status('cqe')).access_status, 'expired');
  });
  await db.exec('begin');
  try {
    await db.query(`insert into public.user_exam_grants(user_id,exam_key,granted_at,expires_at)
      values($1,'cre',now()-interval '1 hour',now())`, [users.learner]);
    await asUser(users.learner, async () => assert.equal(await allowed('cre'), false));
  } finally { await db.exec('rollback'); }
});

test('revocation takes effect on the next authorization read and advances revision', async () => {
  await db.query(`update public.user_exam_grants set status='revoked',revoked_at=now(),revoked_by=$1
    where user_id=$2 and exam_key='pmp'`, [users.admin, users.learner]);
  await asUser(users.learner, async () => {
    assert.equal(await allowed('pmp'), false);
    assert.equal((await status('pmp')).access_status, 'revoked');
    assert.equal((await status('pmp')).grant_revision, 2);
  });
});

test('pending and approved requests alone never authorize; duplicate requests are bounded', async () => {
  await db.query("insert into public.exam_access_requests(user_id,exam_key) values($1,'cssbb')", [users.learner]);
  await asUser(users.learner, async () => {
    assert.equal((await status('cssbb')).access_status, 'pending');
    assert.equal(await allowed('cssbb'), false);
  });
  await assert.rejects(db.query("insert into public.exam_access_requests(user_id,exam_key) values($1,'cssbb')", [users.learner]), { code: '23505' });
  await db.query("update public.exam_access_requests set status='approved',reviewed_at=now(),reviewed_by=$1 where user_id=$2 and exam_key='cssbb'", [users.admin, users.learner]);
  await asUser(users.learner, async () => assert.equal(await allowed('cssbb'), false));
  await asUser(users.other, async () => assert.equal((await db.query('select * from public.exam_access_requests')).rows.length, 0));
});

test('neither learners nor administrators can write permission or request tables directly', async () => {
  for (const user of [users.learner, users.admin]) await asUser(user, async () => {
    for (const table of ['user_exam_grants', 'exam_access_requests']) {
      await assert.rejects(db.query(`insert into public.${table}(user_id,exam_key) values($1,'mbb')`, [user]), { code: '42501' });
      await assert.rejects(db.query(`update public.${table} set exam_key='mbb'`), { code: '42501' });
      await assert.rejects(db.query(`delete from public.${table}`), { code: '42501' });
    }
    await assert.rejects(db.query("update public.exam_catalog set publication_status='published'"), { code: '42501' });
    await assert.rejects(db.query('select * from exam_access_private.events'), { code: '42501' });
  });
});

test('grant and request identity cannot be reassigned even by a future privileged writer', async () => {
  for (const table of ['user_exam_grants', 'exam_access_requests']) {
    await assert.rejects(db.query(`update public.${table} set user_id=$1 where user_id=$2`, [users.other, users.learner]), { code: '23514' });
  }
});

test('invalid expiry, revoked state and duplicate grants are rejected by database constraints', async () => {
  await assert.rejects(grant(users.learner, 'pmp'), { code: '23505' });
  await assert.rejects(grant(users.learner, 'mbb', { start: '2026-01-02T00:00:00Z', expiry: '2026-01-01T00:00:00Z' }), { code: '23514' });
  await assert.rejects(db.query("update public.user_exam_grants set status='revoked' where user_id=$1 and exam_key='cqa'", [users.learner]), { code: '23514' });
});

test('audit records only changes; repeat authorization reads and no-op updates add no events', async () => {
  const count = async () => (await db.query('select count(*)::int as n from exam_access_private.events')).rows[0].n;
  const beforeCount = await count();
  await asUser(users.learner, async () => { for (let i = 0; i < 10; i++) await allowed('pmp'); });
  await db.query("update public.user_exam_grants set status=status where user_id=$1", [users.learner]);
  assert.equal(await count(), beforeCount);
  const events = (await db.query("select * from exam_access_private.events where exam_key='pmp' order by id")).rows;
  assert.equal(events[0].next_status, 'active');
  assert.equal(events[1].previous_status, 'active');
  assert.equal(events[1].next_status, 'revoked');
  assert.equal(events[1].actor_source, 'database');
});

test('all foundation tables use RLS and client-callable RPCs run as invoker', async () => {
  const tables = (await db.query("select relname,relrowsecurity from pg_class where relname in ('exam_catalog','user_exam_grants','exam_access_requests','events') and relkind='r'")).rows;
  assert.equal(tables.length, 4);
  assert.ok(tables.every(row => row.relrowsecurity));
  const functions = (await db.query("select proname,prosecdef from pg_proc where proname in ('can_access_exam','get_my_exam_access')")).rows;
  assert.equal(functions.length, 2);
  assert.ok(functions.every(row => !row.prosecdef));
  for (const name of ['record_grant_change()', 'bump_revision()']) {
    assert.equal((await db.query("select has_function_privilege('authenticated',$1,'EXECUTE') as allowed", ['exam_access_private.'+name])).rows[0].allowed, false);
  }
});

test('audit trigger rejects a learner identity even inside a privileged write path', async () => {
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [users.learner]);
  try { await assert.rejects(grant(users.learner, 'cre'), { code: '42501' }); }
  finally { await db.query("select set_config('request.jwt.claim.sub','',false)"); }
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [users.admin]);
  try { await grant(users.learner, 'cre'); }
  finally { await db.query("select set_config('request.jwt.claim.sub','',false)"); }
  const event = (await db.query("select actor_id,actor_source from exam_access_private.events where exam_key='cre' order by id desc limit 1")).rows[0];
  assert.equal(event.actor_id, users.admin);
  assert.equal(event.actor_source, 'administrator');
  await asUser(users.admin, async () => {
    assert.ok((await db.query('select * from public.user_exam_grants')).rows.length > 0);
    const personal = (await db.query('select * from public.get_my_exam_access()')).rows;
    assert.ok(personal.every(row => row.grant_revision === null));
  });
});

test('SQL migrations and test tooling are excluded from the public site build', async () => {
  const { excludedDirectories } = await import('../scripts/stage-public-site.mjs');
  for (const directory of ['supabase','exam-catalog','tests','scripts','node_modules']) assert.ok(excludedDirectories.has(directory));
});

test('Step 5: zero, one and multiple grants remain exact through fresh caller contexts', async () => {
  await db.exec('begin');
  try {
    await asUser(users.other, async () => assert.equal((await db.query('select * from public.get_my_exam_access() where can_practice')).rows.length, 0));
    await grant(users.other, 'pmp');
    await asUser(users.other, async () => assert.deepEqual((await db.query('select exam_key from public.get_my_exam_access() where can_practice order by exam_key')).rows.map(r => r.exam_key), ['pmp']));
    await grant(users.other, 'cssbb');
    // A new caller context models a new authenticated server request, not browser/device QA.
    await asUser(users.other, async () => assert.deepEqual((await db.query('select exam_key from public.get_my_exam_access() where can_practice order by exam_key')).rows.map(r => r.exam_key), ['cssbb','pmp']));
    await asUser(users.premium, async () => assert.equal(await allowed('pmp'), false));
    await asUser(null, async () => assert.equal(await allowed('pmp'), false));
    await asUser(users.other, async () => assert.equal(await allowed('pmp'), true));
  } finally { await db.exec('rollback'); }
});

test('Step 5: pending renewals keep revoked and expired permissions denied', async () => {
  await db.exec('begin');
  try {
    await db.query("insert into public.exam_access_requests(user_id,exam_key) values($1,'pmp'),($1,'cqe')", [users.learner]);
    await asUser(users.learner, async () => {
      for (const exam of ['pmp','cqe']) {
        const row = await status(exam);
        assert.equal(row.access_status, 'pending');
        assert.equal(row.can_practice, false);
      }
    });
  } finally { await db.exec('rollback'); }
});

test('Step 5: retirement overrides both explicit grants and administrator access', async () => {
  await db.exec('begin');
  try {
    await db.exec("update public.exam_catalog set publication_status='retired' where exam_key='cre'");
    for (const user of [users.learner,users.admin]) await asUser(user, async () => assert.equal(await allowed('cre'), false));
    await asUser(users.learner, async () => assert.equal(await status('cre'), undefined));
    await asUser(users.admin, async () => assert.equal((await status('cre')).access_status, 'retired'));
  } finally { await db.exec('rollback'); }
});

test('Step 5: forged membership metadata cannot authorize an exam', async () => {
  await asUser(users.premium, async () => {
    await db.query("select set_config('request.jwt.claims',$1,false)", [JSON.stringify({ user_metadata: { role: 'administrator', exam_access: ['pmp'] } })]);
    try { assert.equal(await allowed('pmp'), false); }
    finally { await db.query("select set_config('request.jwt.claims','',false)"); }
  });
});
