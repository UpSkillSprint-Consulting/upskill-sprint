'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');
const { installDurableLearning } = require('./helpers/test-bank-durable-learning');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'test-bank.html'), 'utf8');
const syncSource = fs.readFileSync(path.join(root, 'test-bank-account-sync.js'), 'utf8');
const learningSource = fs.readFileSync(path.join(root, 'test-bank-learning-events.js'), 'utf8');
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

test('a delayed sign-in merge never reloads or closes the active page', async t => {
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
    from(table) {
      if (table === 'test_bank_learning_events') {
        return {
          upsert() { return Promise.resolve({ error: null }); },
          select() {
            const query = {
              eq() { return query; },
              order() { return query; },
              range() { return Promise.resolve({ data: [], error: null }); },
              limit() { return Promise.resolve({ data: [], error: null }); }
            };
            return query;
          }
        };
      }
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
  await installDurableLearning(dom.window, { user, client });

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

  assert.equal(dom.window.__reloadCount, 0, 'remote progress never reloads an active exam');
  assert.ok(overview().querySelector('[data-opt]'), 'the active question remains on screen');

  overview().querySelector('[data-backsim]').click();
  await flush();
  assert.equal(dom.window.__reloadCount, 0, 'returning to the simulator does not release a queued background reload');
});

test('an unmappable retired legacy question performs one progress hand-off without a retry loop', async t => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://upskillsprint.com/test-bank.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true
  });
  t.after(() => dom.window.close());

  const user = { id: 'user-bounded-retry' };
  dom.window.localStorage.setItem('tb-account-sync-user-v1', user.id);
  dom.window.localStorage.setItem('tb-adaptive-mastery-v1', JSON.stringify({
    version: 1,
    exams: {
      legacy: {
        questions: {
          'unresolvable-question': { attempts: 1, lastSeenAt: 1 }
        }
      }
    }
  }));

  const client = {
    from() {
      return {
        upsert() { return Promise.resolve({ error: null }); },
        select() {
          const query = {
            eq() { return query; },
            order() { return query; },
            range() { return Promise.resolve({ data: [], error: null }); },
            limit() { return Promise.resolve({ data: [], error: null }); }
          };
          return query;
        }
      };
    }
  };
  dom.window.UpskillAuth = {
    getClient: () => client,
    getUser: () => user
  };

  let progressSyncCalls = 0;
  dom.window.__TBAccountSync = {
    sync() {
      progressSyncCalls += 1;
      return Promise.resolve().then(() => {
        dom.window.document.dispatchEvent(new dom.window.CustomEvent('upskill-test-progress-synced'));
        return { changed: false };
      });
    }
  };

  dom.window.eval(learningSource);
  await dom.window.__TBLearning.sync('bounded-retry-regression');
  for (let count = 0; count < 10; count += 1) await flush();

  assert.equal(progressSyncCalls, 1, 'the ledger requests one fresh account snapshot without recursively retrying');
  assert.equal(dom.window.__TBLearning.status().historyReady, true, 'a retired question does not permanently lock the current bank after the bounded hand-off');
});
