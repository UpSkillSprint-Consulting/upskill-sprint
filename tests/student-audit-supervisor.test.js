'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { supervise } = require('../scripts/lib/student-audit-supervisor.cjs');
async function run(source, options = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-supervisor-'));
  try {
    const script = path.join(dir, 'fixture.cjs'), resultFile = path.join(dir, 'supervisor.json');
    fs.writeFileSync(script, source);
    const result = await supervise({ args: [script], cwd: dir, env: { ...process.env, AUDIT_SOURCE: 'fixture-sha' },
      resultFile, idleMs: 1500, totalMs: 10000, graceMs: 100, stdio: 'ignore', ...options });
    assert.deepEqual(JSON.parse(fs.readFileSync(resultFile)).status, result.status);
    assert.equal(JSON.parse(fs.readFileSync(resultFile)).source, 'fixture-sha');
    return result;
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
test('supervisor preserves a normal exit and records meaningful progress', async () => {
  const r = await run(`process.send({type:'student-audit-progress',operation:{label:'review-175',status:'passed'}},()=>process.exit(0));`);
  assert.equal(r.status, 'passed'); assert.equal(r.exitCode, 0); assert.equal(r.progressMessages, 1);
  assert.equal(r.lastOperation.label, 'review-175');
});
test('supervisor never changes the original failure exit to a pass', async () => {
  const r = await run('process.exit(7);'); assert.equal(r.status, 'failed'); assert.equal(r.exitCode, 7);
});
test('supervisor terminates an unresolved browser promise instead of waiting for the job limit', async () => {
  const r = await run(`process.send({type:'student-audit-progress',operation:{label:'review-140-dark-axe'}});setInterval(()=>{},1000);`);
  assert.equal(r.status, 'failed'); assert.equal(r.reason, 'AUDIT_NO_PROGRESS'); assert.equal(r.lastOperation.label, 'review-140-dark-axe');
});
test('supervisor survives a blocked audit event loop, not just a pending promise', async () => {
  const r = await run(`process.send({type:'student-audit-progress',operation:{label:'review-140'}});while(true){}`);
  assert.equal(r.status, 'failed'); assert.equal(r.reason, 'AUDIT_NO_PROGRESS');
});
test('a misleading completed report cannot excuse stalled browser teardown', async () => {
  const r = await run(`require('node:fs').writeFileSync('report.json',JSON.stringify({complete:true}));process.send({type:'student-audit-progress',operation:{label:'browser-close'}});setInterval(()=>{},1000);`);
  assert.equal(r.status, 'failed'); assert.equal(r.reason, 'AUDIT_NO_PROGRESS'); assert.equal(r.lastOperation.label, 'browser-close');
});
test('total runtime bound applies even when a faulty audit sends endless progress', async () => {
  const r = await run(`setInterval(()=>process.send({type:'student-audit-progress',operation:{label:'never-completes'}}),20);`, {idleMs:1500,totalMs:2500});
  assert.equal(r.status, 'failed'); assert.equal(r.reason, 'AUDIT_TOTAL_TIMEOUT'); assert.ok(r.progressMessages > 0);
});
test('a stubborn child ignoring graceful termination is killed', async () => {
  const r = await run(`process.on('SIGTERM',()=>{});setInterval(()=>{},1000);`);
  assert.equal(r.status, 'failed'); assert.equal(r.reason, 'AUDIT_NO_PROGRESS');
  // SIGKILL delivery is asynchronous: wait for the detached process to be reaped.
  for (let i=0;i<500;i++) { try { process.kill(r.pid,0); } catch(e) { assert.equal(e.code,'ESRCH'); return; } await new Promise(r=>setTimeout(r,10)); }
  assert.fail('Supervised process survived hard termination');
});

test('detached browser descendants are terminated without touching an unrelated process', async () => {
  const { spawn } = require('node:child_process');
  const unrelated = spawn(process.execPath, ['-e','setInterval(()=>{},1000)'], {detached:true,stdio:'ignore'});
  let browserPid;
  const alive = pid => {
    try { const stat=fs.readFileSync(`/proc/${pid}/stat`,'utf8');return stat.slice(stat.lastIndexOf(')')+2).split(' ')[0]!=='Z'; }
    catch(error){if(error.code==='ENOENT')return false;throw error;}
  };
  try {
    const r = await run(`const child=require('node:child_process').spawn(process.execPath,['-e',"process.on('SIGTERM',()=>{});setInterval(()=>{},1000)"],{detached:true,stdio:'ignore'});child.unref();process.send({type:'student-audit-progress',operation:{label:'detached-browser-hang',browserPid:child.pid}});while(true){}`);
    browserPid=r.lastOperation.browserPid;
    assert.equal(r.status,'failed');assert.equal(r.reason,'AUDIT_NO_PROGRESS');
    for(let i=0;i<100&&alive(browserPid);i++)await new Promise(resolve=>setTimeout(resolve,10));
    assert.equal(alive(browserPid),false,'Detached browser escaped parent-process-group cleanup');
    assert.equal(alive(unrelated.pid),true,'Unrelated process was terminated');
  } finally {
    for(const pid of [browserPid,unrelated.pid])if(pid){try{process.kill(-pid,'SIGKILL');}catch(error){if(error.code!=='ESRCH')throw error;}}
  }
});
