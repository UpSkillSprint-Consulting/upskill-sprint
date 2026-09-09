'use strict';
// Segment 14 database acceptance against the disposable PostgreSQL fixture.
// This script intentionally reuses the Segment 03 target guard and never
// accepts a remote host or a database other than segment03_test.
const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const { validateTarget } = require('./run-database.cjs');

const A = '10000000-0000-4000-8000-000000000001';
const B = '10000000-0000-4000-8000-000000000002';
const passed = [];

function cli(target) {
  return ['-X', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose', '-A', '-t',
    '-h', target.url.hostname, '-p', target.url.port || '5432', '-U', decodeURIComponent(target.url.username), 'segment03_test'];
}
function run(target, sql) {
  const result = spawnSync('psql', cli(target), { env: target.env, input: sql, encoding: 'utf8', timeout: 30000, maxBuffer: 4 * 1024 * 1024 });
  if (result.error) throw result.error;
  return result;
}
function ok(target, sql) {
  const result = run(target, sql);
  assert.equal(result.status, 0, (result.stderr || '').slice(-2000));
  return String(result.stdout || '').trim();
}
function role(user, sql, as = 'authenticated') {
  return `BEGIN; SET LOCAL ROLE ${as}; SET LOCAL request.jwt.claim.sub='${user || ''}';\n${sql}\nROLLBACK;`;
}
function check(name, fn) { fn(); passed.push(name); }
function denied(target, name, sql, code) {
  const result = run(target, sql);
  assert.notEqual(result.status, 0, name + ' should fail');
  assert.ok(String(result.stderr || '').includes(code), `${name}: expected SQLSTATE ${code}`);
  passed.push(name);
}
function concurrent(target, sql) {
  return new Promise((resolve, reject) => {
    let stdout = '', stderr = '';
    const child = spawn('psql', cli(target), { env: target.env });
    const timeout = setTimeout(() => child.kill('SIGKILL'), 30000);
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (status, signal) => { clearTimeout(timeout); resolve({ status, signal, stdout, stderr }); });
    child.stdin.end(sql);
  });
}

async function main() {
  const target = validateTarget(process.env.SEG03_DB_URL || '', process.env.SEG03_ALLOW_DISPOSABLE_DB);
  check('Segment 14 migration is installed', () => {
    const names = ok(target, `SELECT proname FROM pg_proc WHERE proname IN ('fetch_test_bank_learning_events_incremental_v1','fetch_test_bank_progress_devices_incremental_v1') ORDER BY proname;`);
    assert.match(names, /fetch_test_bank_learning_events_incremental_v1/);
    assert.match(names, /fetch_test_bank_progress_devices_incremental_v1/);
  });
  check('both durable channels have non-null server sequences', () => {
    assert.equal(ok(target, `SELECT count(*) FROM public.test_bank_learning_events WHERE sync_seq IS NULL;`), '0');
    assert.equal(ok(target, `SELECT count(*) FROM public.test_bank_progress_devices WHERE sync_seq IS NULL;`), '0');
  });
  check('learning server sequences are unique per owner', () => {
    assert.equal(ok(target, `SELECT count(*) FROM (SELECT user_id,sync_seq,count(*) FROM public.test_bank_learning_events GROUP BY user_id,sync_seq HAVING count(*)>1) q;`), '0');
  });
  check('progress server sequences are unique per owner', () => {
    assert.equal(ok(target, `SELECT count(*) FROM (SELECT user_id,sync_seq,count(*) FROM public.test_bank_progress_devices GROUP BY user_id,sync_seq HAVING count(*)>1) q;`), '0');
  });
  check('owner A incremental learning RPC returns only owner A rows', () => {
    const value = ok(target, role(A, `DO $$ DECLARE n bigint; BEGIN SELECT count(*) INTO n FROM public.fetch_test_bank_learning_events_incremental_v1(NULL,500); IF n < 1 THEN RAISE EXCEPTION 'expected owner A rows'; END IF; END $$;`));
    assert.equal(value, '');
  });
  check('owner B incremental learning RPC returns only owner B rows', () => {
    ok(target, role(B, `DO $$ DECLARE n bigint; BEGIN SELECT count(*) INTO n FROM public.fetch_test_bank_learning_events_incremental_v1(NULL,500); IF n < 1 THEN RAISE EXCEPTION 'expected owner B rows'; END IF; END $$;`));
  });
  denied(target, 'anonymous cannot execute learning cursor RPC', role(null, `SELECT * FROM public.fetch_test_bank_learning_events_incremental_v1(NULL,500);`, 'anon'), '42501');
  denied(target, 'anonymous cannot execute progress cursor RPC', role(null, `SELECT * FROM public.fetch_test_bank_progress_devices_incremental_v1(NULL,100);`, 'anon'), '42501');
  denied(target, 'authenticated clients cannot read sequence counters directly', role(A, `SELECT * FROM public.test_bank_sync_counters;`), '42501');
  denied(target, 'negative learning cursors fail closed', role(A, `SELECT * FROM public.fetch_test_bank_learning_events_incremental_v1(-1,500);`), '22023');
  denied(target, 'oversized progress pages fail closed', role(A, `SELECT * FROM public.fetch_test_bank_progress_devices_incremental_v1(NULL,101);`), '22023');

  const progressBefore = Number(ok(target, `SELECT sync_seq FROM public.test_bank_progress_devices WHERE user_id='${A}' AND device_id='fixture-device';`));
  ok(target, `BEGIN; SET LOCAL ROLE authenticated; SET LOCAL request.jwt.claim.sub='${A}'; UPDATE public.test_bank_progress_devices SET payload=jsonb_build_object('segment14','updated') WHERE user_id='${A}' AND device_id='fixture-device'; COMMIT;`);
  const progressAfter = Number(ok(target, `SELECT sync_seq FROM public.test_bank_progress_devices WHERE user_id='${A}' AND device_id='fixture-device';`));
  check('progress updates receive a newer server sequence', () => assert.ok(progressAfter > progressBefore));
  check('progress cursor returns the post-cursor update', () => {
    const rows = Number(ok(target, role(A, `SELECT count(*) FROM public.fetch_test_bank_progress_devices_incremental_v1(${progressBefore},100);`)));
    assert.ok(rows >= 1);
  });

  const eventOne = 'segment14-commit-order-a';
  const eventTwo = 'segment14-commit-order-b';
  ok(target, `DELETE FROM public.test_bank_learning_events WHERE user_id='${A}' AND event_id IN ('${eventOne}','${eventTwo}');`);
  const firstSql = `BEGIN; SET LOCAL ROLE authenticated; SET LOCAL request.jwt.claim.sub='${A}'; INSERT INTO public.test_bank_learning_events(user_id,event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,payload) VALUES('${A}','${eventOne}','segment14-db-a','question_exposed','cssbb','segment14-db-session-a','cssbb:segment14:db-a',clock_timestamp(),'{}'); SELECT pg_sleep(0.45); COMMIT;`;
  const secondSql = `BEGIN; SET LOCAL ROLE authenticated; SET LOCAL request.jwt.claim.sub='${A}'; INSERT INTO public.test_bank_learning_events(user_id,event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,payload) VALUES('${A}','${eventTwo}','segment14-db-b','question_exposed','cssbb','segment14-db-session-b','cssbb:segment14:db-b',clock_timestamp(),'{}'); COMMIT;`;
  const first = concurrent(target, firstSql);
  await new Promise(resolve => setTimeout(resolve, 100));
  const second = concurrent(target, secondSql);
  const results = await Promise.all([first, second]);
  results.forEach(result => assert.equal(result.status, 0, result.stderr));
  const sequences = ok(target, `SELECT event_id||':'||sync_seq FROM public.test_bank_learning_events WHERE user_id='${A}' AND event_id IN ('${eventOne}','${eventTwo}') ORDER BY sync_seq;`).split(/\s+/).filter(Boolean);
  check('concurrent commits preserve transaction-serialized learning cursor order', () => {
    assert.equal(sequences.length, 2);
    assert.ok(sequences[0].startsWith(eventOne + ':'), sequences.join(','));
    assert.ok(sequences[1].startsWith(eventTwo + ':'), sequences.join(','));
  });
  const firstSeq = Number(sequences[0].split(':').at(-1));
  check('a cursor after the first committed sequence returns the second concurrent event', () => {
    const ids = ok(target, role(A, `SELECT event_id FROM public.fetch_test_bank_learning_events_incremental_v1(${firstSeq},500) WHERE event_id IN ('${eventOne}','${eventTwo}') ORDER BY sync_seq;`));
    assert.equal(ids, eventTwo);
  });

  console.log(JSON.stringify({ status: 'passed', tests: passed.length, passed }, null, 2));
}

main().catch(error => { console.error(error && error.stack || error); process.exitCode = 1; });
