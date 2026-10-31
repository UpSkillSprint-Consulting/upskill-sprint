const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { PGlite } = require('@electric-sql/pglite');

// Real local PostgreSQL execution of the lesson-email migration (never a hosted project).
const root = join(__dirname, '..');
const MIGRATION = join(root, 'supabase/migrations/20261031180000_lesson_announcement_emails.sql');

const U = (n) => `00000000-0000-4000-a000-${String(n).padStart(12, '0')}`;
const users = {
  optedIn: U(1),
  optedOut: U(2),
  unconfirmed: U(3),
  banned: U(4),
  deleted: U(5),
  optedIn2: U(6)
};

let db;

async function json(sql, params = []) {
  const { rows } = await db.query(sql, params);
  return Object.values(rows[0])[0];
}

const feed = (...items) => JSON.stringify(items.map(([path, title, email]) => ({ path, title, email: email || 'announce' })));
const BASE = [['/lessons/a', 'Lesson A'], ['/lessons/b', 'Lesson B'], ['/lessons/c', 'Lesson C']];

before(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated; create role service_role;
    create schema auth;
    create table auth.users(
      id uuid primary key, email text, email_confirmed_at timestamptz,
      banned_until timestamptz, deleted_at timestamptz, raw_user_meta_data jsonb
    );
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  `);
  await db.exec(readFileSync(join(root, 'supabase/auth-phase1.sql'), 'utf8'));
  await db.exec(readFileSync(MIGRATION, 'utf8'));
});

after(async () => { if (db) await db.close(); });

beforeEach(async () => {
  await db.exec(`
    truncate newsletter_private.unsubscribe_events, newsletter_private.deliveries,
             newsletter_private.lessons, newsletter_private.campaigns cascade;
    update newsletter_private.runner_lease set holder = null, expires_at = '-infinity';
    delete from public.profiles; delete from auth.users;
  `);
  for (const [name, id] of Object.entries(users)) {
    // The real signup trigger (auth-phase1.sql) creates the profile and records consent.
    await db.query('insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values($1,$2,now(),$3)',
      [id, `${name}@example.invalid`, { display_name: `User ${name}`, newsletter_opt_in: name !== 'optedOut' }]);
  }
  await db.query('update auth.users set email_confirmed_at=null where id=$1', [users.unconfirmed]);
  await db.query("update auth.users set banned_until=now()+interval '1 day' where id=$1", [users.banned]);
  await db.query('update auth.users set deleted_at=now() where id=$1', [users.deleted]);
});

test('first sync records a baseline and announces nothing', async () => {
  const result = await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE)]);
  assert.equal(result.bootstrapped, 3);
  assert.deepEqual(result.pending, []);
  const { rows } = await db.query("select count(*)::int n from newsletter_private.lessons where status='baseline'");
  assert.equal(rows[0].n, 3);
});

test('a new path becomes pending once; re-syncing does not duplicate it', async () => {
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE)]);
  const first = await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE, ['/lessons/d', 'Lesson D'])]);
  assert.equal(first.inserted, 1);
  assert.deepEqual(first.pending.map((p) => p.path), ['/lessons/d']);
  const again = await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE, ['/lessons/d', 'Lesson D'])]);
  assert.equal(again.inserted, 0);
  assert.deepEqual(again.pending.map((p) => p.path), ['/lessons/d']);
});

test('skip-tagged, renamed and withdrawn lessons are never announced', async () => {
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE)]);
  // b moves to a new path with the same title; e is tagged skip; f is new.
  const r1 = await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(
    ['/lessons/a', 'Lesson A'], ['/lessons/c', 'Lesson C'], ['/lessons/new-home/b', 'lesson b'],
    ['/lessons/e', 'Lesson E', 'skip'], ['/lessons/f', 'Lesson F'])]);
  assert.equal(r1.renamed, 1);
  assert.equal(r1.skipped, 1);
  assert.deepEqual(r1.pending.map((p) => p.path), ['/lessons/f']);
  // f is reverted before it is announced.
  const r2 = await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(
    ['/lessons/a', 'Lesson A'], ['/lessons/c', 'Lesson C'], ['/lessons/new-home/b', 'lesson b'], ['/lessons/e', 'Lesson E', 'skip'])]);
  assert.equal(r2.withdrawn, 1);
  assert.deepEqual(r2.pending, []);
});

test('invalid feeds are rejected before anything changes', async () => {
  await assert.rejects(db.query('select public.lesson_email_sync_feed($1::jsonb)', ['{}']), /JSON array/);
  await assert.rejects(db.query('select public.lesson_email_sync_feed($1::jsonb)', ['[]']), /between 1 and 2000/);
  await assert.rejects(db.query('select public.lesson_email_sync_feed($1::jsonb)', [feed(['javascript:alert(1)', 'x'])]), /invalid lesson entry/);
  await assert.rejects(db.query('select public.lesson_email_sync_feed($1::jsonb)', [feed(['/lessons/x', 'X', 'maybe'])]), /invalid lesson entry/);
  await assert.rejects(db.query('select public.lesson_email_sync_feed($1::jsonb)', [feed(['/lessons/x', 'X'], ['/lessons/x', 'X again'])]), /repeats a lesson path/);
  const { rows } = await db.query('select count(*)::int n from newsletter_private.lessons');
  assert.equal(rows[0].n, 0);
});

test('live campaign: eligible recipients only, exactly once, lessons marked sent', async () => {
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE)]);
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE, ['/lessons/d', 'Lesson D'])]);
  const opened = await json(`select public.lesson_email_open_campaign('live','live:lesson-d',array['/lessons/d'],'New lesson: Lesson D','{}'::jsonb,'deploy','dep1')`);
  assert.equal(opened.created, true);
  assert.equal(opened.recipient_count, 2, 'only the two opted-in, confirmed, active accounts');

  const dup = await json(`select public.lesson_email_open_campaign('live','live:lesson-d',array['/lessons/d'],'x','{}'::jsonb,'sweep',null)`);
  assert.deepEqual(dup, { created: false, reason: 'duplicate' });
  const reclaimed = await json(`select public.lesson_email_open_campaign('live','live:lesson-d2',array['/lessons/d'],'x','{}'::jsonb,'sweep',null)`);
  assert.deepEqual(reclaimed, { created: false, reason: 'not_pending' });

  const batch = (await db.query('select * from public.lesson_email_next_batch($1,100)', [opened.id])).rows;
  assert.deepEqual(batch.map((r) => r.user_id).sort(), [users.optedIn, users.optedIn2]);
  assert.ok(batch.every((r) => r.email.endsWith('@example.invalid')));

  await db.query('select public.lesson_email_record_results($1,$2::jsonb)', [opened.id, JSON.stringify(
    batch.map((r) => ({ user_id: r.user_id, outcome: 'sent', resend_id: 'rs_' + r.user_id.slice(-1) })))]);
  const done = await json('select public.lesson_email_finish_campaign($1)', [opened.id]);
  assert.equal(done.done, true);
  assert.equal(done.status, 'sent');
  assert.equal(done.sent, 2);
  const { rows } = await db.query("select status, announced_at from newsletter_private.lessons where lesson_path='/lessons/d'");
  assert.equal(rows[0].status, 'sent');
  assert.ok(rows[0].announced_at);
  const after = await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE, ['/lessons/d', 'Lesson D'])]);
  assert.deepEqual(after.pending, [], 'a sent lesson is never pending again');
});

test('retry keeps a recipient queued; unsubscribe mid-campaign skips them', async () => {
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE)]);
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE, ['/lessons/d', 'Lesson D'])]);
  const opened = await json(`select public.lesson_email_open_campaign('live','live:lesson-d',array['/lessons/d'],'s','{}'::jsonb,'deploy',null)`);
  await db.query('select public.lesson_email_record_results($1,$2::jsonb)', [opened.id, JSON.stringify([
    { user_id: users.optedIn, outcome: 'retry', error: 'HTTP 429' },
    { user_id: users.optedIn2, outcome: 'sent', resend_id: 'rs_2' }])]);
  const partial = await json('select public.lesson_email_finish_campaign($1)', [opened.id]);
  assert.equal(partial.done, false);
  assert.equal(partial.queued, 1);

  const active = await json('select public.lesson_email_active_campaigns()');
  assert.deepEqual(active.map((c) => c.id), [opened.id]);

  assert.equal(await json("select public.newsletter_unsubscribe($1,'one_click',$2)", [users.optedIn, opened.id]), 'unsubscribed');
  assert.equal(await json("select public.newsletter_unsubscribe($1,'link',null)", [users.optedIn]), 'already');
  const profile = (await db.query('select newsletter_opt_in, newsletter_consent_at from public.profiles where user_id=$1', [users.optedIn])).rows[0];
  assert.equal(profile.newsletter_opt_in, false);
  assert.equal(profile.newsletter_consent_at, null);

  const batch = (await db.query('select * from public.lesson_email_next_batch($1,100)', [opened.id])).rows;
  assert.equal(batch.length, 0);
  const done = await json('select public.lesson_email_finish_campaign($1)', [opened.id]);
  assert.equal(done.status, 'sent');
  assert.equal(done.skipped, 1);
  const events = (await db.query('select count(*)::int n from newsletter_private.unsubscribe_events where user_id=$1', [users.optedIn])).rows[0].n;
  assert.equal(events, 2);
});

test('a campaign that reached nobody is failed for review and can be released', async () => {
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE)]);
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE, ['/lessons/d', 'Lesson D'])]);
  const opened = await json(`select public.lesson_email_open_campaign('live','live:lesson-d',array['/lessons/d'],'s','{}'::jsonb,'deploy',null)`);
  const batch = (await db.query('select * from public.lesson_email_next_batch($1,100)', [opened.id])).rows;
  await db.query('select public.lesson_email_record_results($1,$2::jsonb)', [opened.id,
    JSON.stringify(batch.map((r) => ({ user_id: r.user_id, outcome: 'failed', error: 'HTTP 422' })))]);
  const done = await json('select public.lesson_email_finish_campaign($1)', [opened.id]);
  assert.equal(done.status, 'failed');
  const status = (await db.query("select status from newsletter_private.lessons where lesson_path='/lessons/d'")).rows[0].status;
  assert.equal(status, 'sending', 'never re-announced automatically');
  assert.equal(await json("select public.lesson_email_release(array['/lessons/d'])"), 1);
  const again = await json(`select public.lesson_email_open_campaign('live','live:lesson-d',array['/lessons/d'],'s','{}'::jsonb,'manual',null)`);
  assert.equal(again.created, true, 'a failed campaign does not block its retry');
});

test('hold, release and skip owner tools', async () => {
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE)]);
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE, ['/lessons/d', 'D'], ['/lessons/e', 'E'])]);
  assert.equal(await json("select public.lesson_email_hold(array['/lessons/d','/lessons/e'],'cap')"), 2);
  assert.equal(await json("select public.lesson_email_hold(array['/lessons/d'],'cap')"), 0, 'already held: no second alert');
  assert.equal(await json("select public.lesson_email_release(array['/lessons/d'])"), 1);
  assert.equal(await json("select public.lesson_email_skip(array['/lessons/e'])"), 1);
  const synced = await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE, ['/lessons/d', 'D'], ['/lessons/e', 'E'])]);
  assert.deepEqual(synced.pending.map((p) => [p.path, p.approved]), [['/lessons/d', true]]);
  const status = await json('select public.lesson_email_status()');
  assert.equal(status.eligible_recipients, 2);
  assert.equal(status.lessons_by_status.skipped, 1);
});

test('test campaigns never consume lessons and are deduplicated', async () => {
  await json('select public.lesson_email_sync_feed($1::jsonb)', [feed(...BASE)]);
  const t1 = await json(`select public.lesson_email_open_campaign('test','test:lesson-a',array['/lessons/a'],'s','{}'::jsonb,'manual',null)`);
  assert.equal(t1.created, true);
  await db.query('select public.lesson_email_finish_test($1,true,1,null)', [t1.id]);
  const t2 = await json(`select public.lesson_email_open_campaign('test','test:lesson-a',array['/lessons/a'],'s','{}'::jsonb,'sweep',null)`);
  assert.equal(t2.created, false);
  const status = (await db.query("select status from newsletter_private.lessons where lesson_path='/lessons/a'")).rows[0].status;
  assert.equal(status, 'baseline');
  const deliveries = (await db.query('select count(*)::int n from newsletter_private.deliveries')).rows[0].n;
  assert.equal(deliveries, 0);
});

test('runner lease is exclusive until it expires or is released', async () => {
  assert.equal(await json("select public.lesson_email_acquire_lease('a',60)"), true);
  assert.equal(await json("select public.lesson_email_acquire_lease('b',60)"), false);
  assert.equal(await json("select public.lesson_email_acquire_lease('a',60)"), true, 'holder may renew');
  await db.query("select public.lesson_email_release_lease('a')");
  assert.equal(await json("select public.lesson_email_acquire_lease('b',60)"), true);
  await assert.rejects(db.query("select public.lesson_email_acquire_lease('c',5)"), /between 10 and 1800/);
});

test('the migration contains no destructive statements', () => {
  const sql = readFileSync(MIGRATION, 'utf8').replace(/--.*$/gm, '');
  assert.doesNotMatch(sql, /\b(drop|truncate)\b|\bdelete\s+from\b/i);
});

test('nothing is executable by anon or authenticated', async () => {
  const { rows } = await db.query(`
    select p.proname, r.rolname
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    cross join (select rolname from pg_roles where rolname in ('anon','authenticated')) r
    where (p.proname like 'lesson_email_%' or p.proname = 'newsletter_unsubscribe' or n.nspname = 'newsletter_private')
      and has_function_privilege(r.rolname, p.oid, 'execute')`);
  assert.deepEqual(rows, []);
  const tables = await db.query(`
    select c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='newsletter_private' and c.relkind='r' and not c.relrowsecurity`);
  assert.deepEqual(tables.rows, [], 'RLS enabled on every private table');
  const svc = await db.query("select has_function_privilege('service_role','public.lesson_email_sync_feed(jsonb)','execute') ok");
  assert.equal(svc.rows[0].ok, true);
});
