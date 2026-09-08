'use strict';
// Independent process watchdog: unlike Promise.race it still runs when the
// audit's JS event loop is blocked. It never retries or converts a failure to a pass.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { performance } = require('node:perf_hooks');
const { randomUUID } = require('node:crypto');

function atomicJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

function supervise({ command = process.execPath, args, cwd = process.cwd(), env = process.env,
  resultFile, idleMs = 90000, totalMs = 35 * 60000, graceMs = 5000, stdio = 'inherit' }) {
  assert.ok(Array.isArray(args) && args.every(x => typeof x === 'string'));
  for (const x of [idleMs, totalMs, graceMs]) assert.ok(Number.isFinite(x) && x > 0);
  assert.equal(typeof resultFile, 'string');
  assert.equal(process.platform, 'linux', 'Owned browser cleanup requires the Linux CI runner and /proc');
  const scope = randomUUID();
  const childEnv = { ...env, UPSKILL_AUDIT_SCOPE: scope };
  const started = performance.now();
  const state = { schemaVersion: 1, source: env.AUDIT_SOURCE || '', status: 'running',
    idleLimitMs: idleMs, totalLimitMs: totalMs, lastOperation: null, progressMessages: 0 };
  const persist = () => atomicJson(resultFile, { ...state, elapsedMs: Math.round(performance.now() - started) });
  persist();
  return new Promise(resolve => {
    const child = spawn(command, args, { cwd, env: childEnv, detached: true,
      stdio: [stdio === 'ignore' ? 'ignore' : 'inherit', stdio, stdio, 'ipc'] });
    state.pid = child.pid;
    let lastProgress = performance.now(), stopping = false, finished = false;
    const killGroup = signal => {
      // Playwright launches detached browser process groups. Killing only the
      // Node audit's group leaves those alive. All owned descendants inherit a
      // unique scope marker, including after reparenting. Never match by process
      // name, port or an unverified PID supplied by the child.
      const marker = `UPSKILL_AUDIT_SCOPE=${scope}`;
      for (const name of fs.readdirSync('/proc')) {
        if (!/^[0-9]+$/.test(name) || Number(name) === process.pid) continue;
        let owned = false;
        try {
          const before = fs.readFileSync(`/proc/${name}/stat`, 'utf8');
          const fields = before.slice(before.lastIndexOf(')') + 2).split(' ');
          const environment = fs.readFileSync(`/proc/${name}/environ`, 'utf8');
          if (!environment.split('\0').includes(marker)) continue;
          owned = true;
          // Check process start time as well as scope before signaling. A reused
          // PID cannot inherit the old audit's cleanup authority.
          const after = fs.readFileSync(`/proc/${name}/stat`, 'utf8');
          const current = after.slice(after.lastIndexOf(')') + 2).split(' ');
          if (current[19] !== fields[19]) continue;
          const pid = Number(name), group = Number(current[2]);
          process.kill(group === pid ? -pid : pid, signal);
          state.cleanupSignals = (state.cleanupSignals || 0) + 1;
        } catch (error) {
          // Unrelated processes may be unreadable; disappearing owned processes
          // have already exited. No environment contents are recorded anywhere.
          if (!['ENOENT','ESRCH'].includes(error.code) && (owned || !['EACCES','EPERM'].includes(error.code))) {
            state.status = 'failed'; state.reason ||= 'AUDIT_CLEANUP_FAILED';
            state.killError = String(error);
          }
        }
      }
    };
    const cleanup = () => {
      clearInterval(watchdog);
      for (const [signal, handler] of Object.entries(signalHandlers)) process.removeListener(signal, handler);
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      cleanup();
      persist();
      resolve({ ...state });
    };
    const stop = reason => {
      if (stopping || finished) return;
      stopping = true;
      state.status = 'failed';
      state.reason = reason;
      persist();
      // Kill only the marked audit tree, including detached browser groups.
      killGroup('SIGTERM');
      // Always execute the hard kill even if Node exits first: the browser may not.
      setTimeout(() => { killGroup('SIGKILL'); finish(); }, graceMs);
    };
    const signalHandlers = Object.fromEntries(['SIGTERM', 'SIGINT'].map(signal => [signal, () => stop(`AUDIT_CANCELLED: ${signal}`)]));
    for (const [signal, handler] of Object.entries(signalHandlers)) process.on(signal, handler);
    const watchdog = setInterval(() => {
      const now = performance.now();
      if (now - started >= totalMs) stop('AUDIT_TOTAL_TIMEOUT');
      else if (now - lastProgress >= idleMs) stop('AUDIT_NO_PROGRESS');
    }, Math.min(1000, Math.max(10, Math.min(idleMs, totalMs) / 10)));
    child.on('message', message => {
      if (finished || stopping || message?.type !== 'student-audit-progress') return;
      if (typeof message.operation !== 'object' || message.operation === null) return;
      lastProgress = performance.now();
      state.lastOperation = message.operation;
      state.progressMessages++;
      persist();
    });
    child.on('error', error => {
      state.status = 'failed'; state.reason = 'AUDIT_SPAWN_ERROR'; state.error = String(error);
      if (!stopping) finish();
    });
    child.on('exit', (code, signal) => {
      state.exitCode = code; state.signal = signal;
      if (stopping) { persist(); return; }
      state.status = code === 0 && !signal ? 'passed' : 'failed';
      if (state.status === 'failed') state.reason = 'AUDIT_CHILD_FAILED';
      // Remove scope-marked detached browsers even after an early audit exit;
      // unrelated processes have a different or absent scope marker.
      killGroup('SIGKILL');
      finish();
    });
  });
}
module.exports = { supervise, atomicJson };
