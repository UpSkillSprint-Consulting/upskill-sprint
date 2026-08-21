'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'test-bank.html'), 'utf8');
const syncSource = fs.readFileSync(path.join(root, 'test-bank-account-sync.js'), 'utf8');
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

function deferred() {
  let resolve;
  const promise = new Promise(resolvePromise => { resolve = resolvePromise; });
  return { promise, resolve };
}

function remoteMastery(questionId) {
  return {
    schemaVersion: 2,
    resets: {},
    values: {
      'tb-adaptive-mastery-v1': {
        version: 1,
        exams: {
          cssbb: {
            attempts: [],
            sessions: [],
            questions: {
              [questionId]: {
                history: [{ at: 1, status: 'correct' }],
                lastSeenAt: 1
              }
            }
          }
        }
      }
    }
  };
}

test('a delayed sign-in merge cannot close an active exam', async t => {
  const selectResult = deferred();
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  t.after(() => dom.window.close());
  await new Promise(resolve => dom.window.addEventListener('load', resolve));

  let authChange;
  const user = { id: 'user-1' };
  const client = {
    from() {
      return {
        select() { return { order() { return selectResult.promise; } }; },
        upsert() { return Promise.resolve({ error: null }); }
      };
    }
  };
  dom.window.UpskillAuth = {
    getClient: () => client,
    getUser: () => user,
    onChange(callback) { authChange = callback; }
  };

  const reloadCalls = syncSource.match(/location\.reload\(\)/g) || [];
  assert.equal(reloadCalls.length, 1, 'the reload probe must cover the production call');
  dom.window.__reloadCount = 0;
  dom.window.eval(syncSource.replace(/location\.reload\(\)/g, 'window.__reloadCount += 1'));

  authChange(user);
  await flush();
  const overview = () => dom.window.document.getElementById('tb-overview');
  overview().querySelector('[data-diag]').click();
  assert.equal(dom.window.document.querySelector('.tb-shell').classList.contains('exam-mode'), true);

  selectResult.resolve({
    error: null,
    data: [{
      device_id: 'remote-device',
      updated_at: new Date().toISOString(),
      payload: remoteMastery('remote-question')
    }]
  });
  await flush();
  await flush();

  assert.equal(dom.window.__reloadCount, 0, 'remote progress refresh waits while the exam is active');
  assert.ok(overview().querySelector('[data-opt]'), 'the active question remains on screen');

  overview().querySelector('[data-backsim]').click();
  await flush();
  assert.equal(dom.window.__reloadCount, 1, 'one queued refresh runs after returning to the simulator');
});
