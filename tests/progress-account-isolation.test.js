'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const progressSource = fs.readFileSync(path.join(root, 'progress.js'), 'utf8');

function flush() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

function deferred() {
  let resolve;
  const promise = new Promise(resolvePromise => { resolve = resolvePromise; });
  return { promise, resolve };
}

function progressRuntime(url, bodyHtml, options = {}) {
  const users = {
    a: { id: 'user-a', email: 'a@example.com' },
    b: { id: 'user-b', email: 'b@example.com' }
  };
  const reads = { 'user-a': [], 'user-b': [] };
  const writes = [];
  let activeUser = users.a;
  let authListener = null;

  const client = {
    from(table) {
      assert.equal(table, 'lesson_progress');
      const requestUserId = activeUser && activeUser.id;
      return {
        select() { return this; },
        eq() { return this; },
        maybeSingle() {
          const request = deferred();
          reads[requestUserId].push(request);
          return request.promise;
        },
        then(resolve, reject) {
          const request = deferred();
          reads[requestUserId].push(request);
          return request.promise.then(resolve, reject);
        },
        upsert(row) {
          const request = deferred();
          writes.push({ requestUserId, row, request });
          if (!options.deferWrites) request.resolve({ data: null, error: null });
          return request.promise;
        }
      };
    }
  };

  const dom = new JSDOM(`<!doctype html><html><head></head><body>${bodyHtml}</body></html>`, {
    url,
    runScripts: 'outside-only'
  });
  dom.window.UpskillAuth = {
    getClient: () => client,
    getUser: () => activeUser,
    isConfigured: () => true,
    onChange(callback) {
      authListener = callback;
      callback(activeUser);
    }
  };
  dom.window.eval(progressSource);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

  return {
    dom,
    reads,
    users,
    writes,
    switchTo(key) {
      activeUser = key ? users[key] : null;
      authListener(activeUser);
    }
  };
}

function lessonRow(userId, score, status = 'in_progress') {
  return {
    user_id: userId,
    lesson_slug: '/lessons/account-race',
    status,
    quiz_score: score,
    quiz_total: 5
  };
}

test('issue #5: a late lesson row cannot overwrite the active account after a switch', async () => {
  const runtime = progressRuntime(
    'https://upskillsprint.com/lessons/account-race.html',
    '<main></main><footer></footer>'
  );

  assert.equal(runtime.reads['user-a'].length, 1);
  runtime.switchTo('b');
  assert.equal(runtime.reads['user-b'].length, 1);

  runtime.reads['user-b'][0].resolve({
    data: lessonRow('user-b', 1),
    error: null
  });
  await flush();

  assert.equal(runtime.dom.window.UpskillProgress.getCurrent().user_id, 'user-b');
  assert.match(runtime.dom.window.document.querySelector('#lesson-progress-quiz').textContent, /1 of 5/);

  runtime.reads['user-a'][0].resolve({
    data: lessonRow('user-a', 5, 'completed'),
    error: null
  });
  await flush();

  assert.equal(runtime.dom.window.UpskillProgress.getCurrent().user_id, 'user-b');
  assert.match(runtime.dom.window.document.querySelector('#lesson-progress-quiz').textContent, /1 of 5/);
  assert.match(runtime.dom.window.document.querySelector('#lesson-progress-status').textContent, /In progress/);
});

test('issue #5: switching accounts clears the previous lesson row before the new read finishes', async () => {
  const runtime = progressRuntime(
    'https://upskillsprint.com/lessons/account-race.html',
    '<main></main><footer></footer>'
  );

  runtime.reads['user-a'][0].resolve({ data: lessonRow('user-a', 5, 'completed'), error: null });
  await flush();
  assert.equal(runtime.dom.window.UpskillProgress.getCurrent().user_id, 'user-a');

  runtime.switchTo('b');

  assert.equal(runtime.dom.window.UpskillProgress.getCurrent(), null);
  assert.match(runtime.dom.window.document.querySelector('#lesson-progress-status').textContent, /In progress/);
  assert.match(runtime.dom.window.document.querySelector('#lesson-progress-quiz').textContent, /Take the quiz/);
});

test('issue #5: signing out invalidates an unfinished lesson read', async () => {
  const runtime = progressRuntime(
    'https://upskillsprint.com/lessons/account-race.html',
    '<main></main><footer></footer>'
  );

  runtime.switchTo(null);
  runtime.reads['user-a'][0].resolve({ data: lessonRow('user-a', 5, 'completed'), error: null });
  await flush();

  assert.equal(runtime.dom.window.UpskillProgress.getCurrent(), null);
  assert.match(runtime.dom.window.document.querySelector('#lesson-progress-widget').textContent, /Sign in/);
  assert.equal(runtime.dom.window.document.querySelector('#lesson-progress-status'), null);
});

test('issue #5: an older same-account read cannot win an A-to-B-to-A race', async () => {
  const runtime = progressRuntime(
    'https://upskillsprint.com/lessons/account-race.html',
    '<main></main><footer></footer>'
  );

  runtime.switchTo('b');
  runtime.switchTo('a');
  assert.equal(runtime.reads['user-a'].length, 2);

  runtime.reads['user-a'][1].resolve({ data: lessonRow('user-a', 2), error: null });
  await flush();
  runtime.reads['user-a'][0].resolve({ data: lessonRow('user-a', 5, 'completed'), error: null });
  runtime.reads['user-b'][0].resolve({ data: lessonRow('user-b', 4, 'completed'), error: null });
  await flush();

  assert.equal(runtime.dom.window.UpskillProgress.getCurrent().user_id, 'user-a');
  assert.equal(runtime.dom.window.UpskillProgress.getCurrent().quiz_score, 2);
  assert.match(runtime.dom.window.document.querySelector('#lesson-progress-status').textContent, /In progress/);
});

test('issue #5: a late mark-complete save cannot replace the new account lesson row', async () => {
  const runtime = progressRuntime(
    'https://upskillsprint.com/lessons/account-race.html',
    '<main></main><footer></footer>',
    { deferWrites: true }
  );

  runtime.reads['user-a'][0].resolve({ data: lessonRow('user-a', 3), error: null });
  await flush();
  runtime.dom.window.document.querySelector('#lesson-progress-complete').click();
  assert.equal(runtime.writes.length, 1);
  assert.equal(runtime.writes[0].row.user_id, 'user-a');

  runtime.switchTo('b');
  runtime.reads['user-b'][0].resolve({ data: lessonRow('user-b', 1), error: null });
  await flush();
  runtime.writes[0].request.resolve({ data: null, error: null });
  await flush();

  assert.equal(runtime.dom.window.UpskillProgress.getCurrent().user_id, 'user-b');
  assert.equal(runtime.dom.window.UpskillProgress.getCurrent().quiz_score, 1);
  assert.match(runtime.dom.window.document.querySelector('#lesson-progress-quiz').textContent, /1 of 5/);
});

test('issue #6: a late lesson-index read cannot add the previous account badges', async () => {
  const runtime = progressRuntime(
    'https://upskillsprint.com/lessons.html',
    [
      '<main>',
      '<a data-lesson-item href="/lessons/account-a.html"><span class="lesson-meta"></span></a>',
      '<a data-lesson-item href="/lessons/account-b.html"><span class="lesson-meta"></span></a>',
      '</main>'
    ].join('')
  );

  assert.equal(runtime.reads['user-a'].length, 1);
  runtime.switchTo('b');
  assert.equal(runtime.reads['user-b'].length, 1);

  runtime.reads['user-b'][0].resolve({
    data: [{ lesson_slug: '/lessons/account-b', status: 'in_progress' }],
    error: null
  });
  await flush();

  const accountALink = runtime.dom.window.document.querySelector('a[href="/lessons/account-a.html"]');
  const accountBLink = runtime.dom.window.document.querySelector('a[href="/lessons/account-b.html"]');
  assert.equal(accountALink.querySelector('.lesson-progress-badge'), null);
  assert.equal(accountBLink.querySelector('.lesson-progress-badge').textContent, 'In progress');

  runtime.reads['user-a'][0].resolve({
    data: [{ lesson_slug: '/lessons/account-a', status: 'completed' }],
    error: null
  });
  await flush();

  assert.equal(accountALink.querySelector('.lesson-progress-badge'), null);
  assert.equal(accountBLink.querySelectorAll('.lesson-progress-badge').length, 1);
  assert.equal(accountBLink.querySelector('.lesson-progress-badge').textContent, 'In progress');
});

test('issue #6: switching accounts immediately removes already-rendered lesson badges', async () => {
  const runtime = progressRuntime(
    'https://upskillsprint.com/lessons.html',
    [
      '<main>',
      '<a data-lesson-item href="/lessons/account-a.html"><span class="lesson-meta"></span></a>',
      '<a data-lesson-item href="/lessons/account-b.html"><span class="lesson-meta"></span></a>',
      '</main>'
    ].join('')
  );

  runtime.reads['user-a'][0].resolve({
    data: [{ lesson_slug: '/lessons/account-a', status: 'completed' }],
    error: null
  });
  await flush();
  assert.equal(runtime.dom.window.document.querySelectorAll('.lesson-progress-badge').length, 1);

  runtime.switchTo('b');

  assert.equal(runtime.dom.window.document.querySelectorAll('.lesson-progress-badge').length, 0);
});

test('issue #6: only the newest index read can render after an A-to-B-to-A race', async () => {
  const runtime = progressRuntime(
    'https://upskillsprint.com/lessons.html',
    [
      '<main>',
      '<a data-lesson-item href="/lessons/account-a.html"><span class="lesson-meta"></span></a>',
      '<a data-lesson-item href="/lessons/old-account-a.html"><span class="lesson-meta"></span></a>',
      '<a data-lesson-item href="/lessons/account-b.html"><span class="lesson-meta"></span></a>',
      '</main>'
    ].join('')
  );

  runtime.switchTo('b');
  runtime.switchTo('a');
  runtime.reads['user-a'][1].resolve({
    data: [{ lesson_slug: '/lessons/account-a', status: 'in_progress' }],
    error: null
  });
  await flush();
  runtime.reads['user-a'][0].resolve({
    data: [{ lesson_slug: '/lessons/old-account-a', status: 'completed' }],
    error: null
  });
  runtime.reads['user-b'][0].resolve({
    data: [{ lesson_slug: '/lessons/account-b', status: 'completed' }],
    error: null
  });
  await flush();

  const badges = Array.from(runtime.dom.window.document.querySelectorAll('.lesson-progress-badge'));
  assert.equal(badges.length, 1);
  assert.equal(badges[0].closest('a').getAttribute('href'), '/lessons/account-a.html');
  assert.equal(badges[0].textContent, 'In progress');
});
