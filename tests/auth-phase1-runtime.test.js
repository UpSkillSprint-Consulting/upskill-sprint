'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const authSource = fs.readFileSync(path.join(root, 'auth.js'), 'utf8');
const profileSource = fs.readFileSync(path.join(root, 'profile.js'), 'utf8');
const profilePageHtml = fs.readFileSync(path.join(root, 'profile.html'), 'utf8');
const profilePageMatch = profilePageHtml.match(/<script id="profile-page-script">([\s\S]*?)<\/script>/);
if (!profilePageMatch) throw new Error('profile page script not found');
const profilePageSource = profilePageMatch[1];

function flush() { return new Promise(resolve => setTimeout(resolve, 0)); }

function deferred() {
  let resolve;
  const promise = new Promise(resolvePromise => { resolve = resolvePromise; });
  return { promise, resolve };
}

function runtime(options = {}) {
  const calls = { updatePayloads: [], authUpdates: [], signups: [], accessReads: 0 };
  const user = {
    id: 'user-1',
    email: 'learner@example.com',
    user_metadata: { display_name: 'Metadata Name' }
  };
  let profile = {
    user_id: user.id,
    display_name: 'Canonical Name',
    timezone: 'America/Regina',
    newsletter_opt_in: false,
    newsletter_consent_at: null,
    terms_accepted_at: '2026-08-01T00:00:00.000Z',
    onboarding_completed: false,
    created_at: '2026-08-01T00:00:00.000Z',
    updated_at: '2026-08-01T00:00:00.000Z'
  };

  function resultChain(data) {
    return {
      eq() { return this; },
      select() { return this; },
      maybeSingle() { return Promise.resolve({ data, error: null }); },
      single() { return Promise.resolve({ data, error: null }); }
    };
  }

  const client = {
    rpc(name) {
      assert.equal(name, 'current_access_level');
      calls.accessReads += 1;
      return options.accessResult ? options.accessResult() : Promise.resolve({ data: 'registered', error: null });
    },
    auth: {
      onAuthStateChange(callback) { client.auth.callback = callback; },
      getSession() {
        if (options.sessionError) return Promise.reject(new Error('network unavailable'));
        return Promise.resolve({ data: { session: { user } } });
      },
      signUp(payload) { calls.signups.push(payload); return Promise.resolve({ data: { user }, error: null }); },
      signInWithPassword() { return Promise.resolve({ data: { user }, error: null }); },
      signOut() { return Promise.resolve({ data: null, error: null }); },
      resetPasswordForEmail() { return Promise.resolve({ data: {}, error: null }); },
      resend() { return Promise.resolve({ data: {}, error: null }); },
      updateUser(payload) { calls.authUpdates.push(payload); return Promise.resolve({ data: { user }, error: null }); }
    },
    from(table) {
      assert.equal(table, 'profiles');
      return {
        select() { return resultChain(profile); },
        insert(payload) { profile = { ...profile, ...payload }; return resultChain(profile); },
        update(payload) {
          calls.updatePayloads.push(payload);
          profile = { ...profile, ...payload, updated_at: '2026-08-21T00:00:00.000Z' };
          return resultChain(profile);
        }
      };
    }
  };

  const dom = new JSDOM('<!doctype html><html><head></head><body><header class="site"><a class="header-cta"></a></header></body></html>', {
    url: 'https://upskillsprint.com/',
    runScripts: 'outside-only'
  });
  dom.window.UPSKILLSPRINT_SUPABASE_CONFIG = {
    url: 'https://project.supabase.co',
    anonKey: 'public-anon-key'
  };
  dom.window.supabase = { createClient: () => client };
  if (options.profileAccess) {
    const status = dom.window.document.createElement('p');
    status.id = 'profile-access-level';
    status.setAttribute('data-account-access', '');
    dom.window.document.body.appendChild(status);
    // profile.html ships no administration links; auth.js injects one only for a verified administrator.
    assert.doesNotMatch(profilePageHtml, /href="\/admin|data-admin-only/);
  }
  dom.window.eval(authSource);
  dom.window.eval(profileSource);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return { dom, calls, user, client };
}

test('Account menu displays every effective access tier and refreshes only on demand', async () => {
  for (const [key, label] of Object.entries({ public: 'Public', registered: 'Registered member', premium: 'Premium member', special: 'Special access', administrator: 'Administrator' })) {
    const { dom, calls } = runtime({ accessResult: () => Promise.resolve({ data: key }) });
    await flush();
    assert.equal(calls.accessReads, 0);
    dom.window.document.querySelector('[aria-controls="account-menu-panel"]').click();
    await flush();
    assert.equal(dom.window.document.querySelector('[data-account-access]').textContent, 'Access level: ' + label);
    assert.equal(calls.accessReads, 1);
    dom.window.close();
  }
});

test('Account access failure is explicit and reopening retries', async () => {
  let result = { error: new Error('offline') };
  const { dom } = runtime({ accessResult: () => Promise.resolve(result) });
  await flush();
  const toggle = dom.window.document.querySelector('[aria-controls="account-menu-panel"]');
  toggle.click();
  await flush();
  assert.match(dom.window.document.querySelector('[data-account-access]').textContent, /unavailable/);
  result = { data: 'premium' };
  toggle.click();
  toggle.click();
  await flush();
  assert.match(dom.window.document.querySelector('[data-account-access]').textContent, /Premium member/);
  dom.window.close();
});

test('Profile shows access on load without opening Account', async () => {
  const { dom, calls } = runtime({ profileAccess: true });
  await flush();
  assert.equal(dom.window.document.getElementById('profile-access-level').textContent, 'Access level: Registered member');
  assert.equal(calls.accessReads, 1);
  dom.window.close();
});

test('Account access response cannot restore a signed-out user’s tier', async () => {
  const pending = deferred();
  const { dom, client } = runtime({ accessResult: () => pending.promise });
  await flush();
  dom.window.document.querySelector('[aria-controls="account-menu-panel"]').click();
  await flush();
  client.auth.callback('SIGNED_OUT', null);
  pending.resolve({ data: 'administrator' });
  await flush();
  assert.equal(dom.window.document.querySelector('[data-account-access]'), null);
  dom.window.close();
});

function assertAdminLinks(window, visible) {
  // Exactly one "Admin" link to the hub exists only while the server confirms administrator;
  // otherwise it is absent from the DOM (not merely hidden), and no other admin link is ever rendered.
  const links = window.document.querySelectorAll('a[href="/admin"]');
  assert.equal(links.length, visible ? 1 : 0);
  if (visible) {
    assert.equal(links[0].textContent, 'Admin');
    assert.equal(links[0].parentElement.previousElementSibling.id, 'profile-access-level');
  }
  assert.equal(window.document.querySelectorAll('a[href^="/admin-"], a[href^="/admin."], [data-admin-only]').length, 0);
}

test('profile administration links start hidden and only the verified administrator tier reveals them', async () => {
  for (const tier of ['public', 'registered', 'premium', 'special', 'administrator']) {
    const { dom, calls, user } = runtime({ profileAccess: true, accessResult: () => Promise.resolve({ data: tier }) });
    user.user_metadata.role = 'administrator'; // Editable claims must not reveal the links.
    assertAdminLinks(dom.window, false);
    await flush();
    assertAdminLinks(dom.window, tier === 'administrator');
    assert.equal(calls.accessReads, 1, 'reuse the profile access check without another request');
    dom.window.close();
  }
});

test('administration links hide immediately on sign-out and account switches, ignoring stale administrator responses', async () => {
  const stale = deferred(), learner = deferred();
  let response = Promise.resolve({ data: 'administrator' });
  const { dom, client, user } = runtime({ profileAccess: true, accessResult: () => response });
  await flush();
  assertAdminLinks(dom.window, true);
  response = stale.promise;
  client.auth.callback('TOKEN_REFRESHED', { user });
  assertAdminLinks(dom.window, false);
  await flush();
  response = learner.promise;
  client.auth.callback('SIGNED_IN', { user: { id: 'learner-2', user_metadata: { role: 'administrator' } } });
  assertAdminLinks(dom.window, false);
  stale.resolve({ data: 'administrator' });
  await flush();
  assertAdminLinks(dom.window, false);
  learner.resolve({ data: 'premium' });
  await flush();
  assertAdminLinks(dom.window, false);
  response = Promise.resolve({ data: 'administrator' });
  client.auth.callback('SIGNED_IN', { user });
  await flush();
  assertAdminLinks(dom.window, true);
  client.auth.callback('SIGNED_OUT', null);
  assertAdminLinks(dom.window, false);
  dom.window.close();
});

test('revoked, failed, invalid, and unresolved access checks keep administration links hidden', async () => {
  let response = Promise.resolve({ data: 'administrator' });
  const { dom, client, user } = runtime({ profileAccess: true, accessResult: () => response });
  await flush();
  assertAdminLinks(dom.window, true);
  for (const result of [{ data: 'registered' }, { error: new Error('unavailable') }, { data: 'unknown' }, null]) {
    response = Promise.resolve(result);
    client.auth.callback('TOKEN_REFRESHED', { user });
    assertAdminLinks(dom.window, false);
    await flush();
    assertAdminLinks(dom.window, false);
  }
  response = Promise.reject(new Error('network unavailable'));
  client.auth.callback('TOKEN_REFRESHED', { user });
  await flush();
  assertAdminLinks(dom.window, false);
  const pending = deferred();
  response = pending.promise;
  client.auth.callback('TOKEN_REFRESHED', { user });
  await flush();
  assertAdminLinks(dom.window, false);
  client.auth.callback('SIGNED_OUT', null);
  pending.resolve({ data: 'administrator' });
  await flush();
  assertAdminLinks(dom.window, false);
  dom.window.close();
});

function profileRaceRuntime(options = {}) {
  const users = {
    a: {
      id: 'user-a',
      email: 'a@example.com',
      user_metadata: { display_name: 'Account A' }
    },
    b: {
      id: 'user-b',
      email: 'b@example.com',
      user_metadata: { display_name: 'Account B' }
    }
  };
  const profiles = {
    'user-a': {
      user_id: 'user-a',
      display_name: 'Account A',
      timezone: 'America/Regina',
      newsletter_opt_in: false
    },
    'user-b': {
      user_id: 'user-b',
      display_name: 'Account B',
      timezone: 'America/Regina',
      newsletter_opt_in: false
    }
  };
  const profileUpdate = deferred();
  const authUpdate = deferred();
  const calls = { authUpdates: [], profileUpdates: [] };
  let activeUser = users.a;
  let authListener = null;

  function selectChain() {
    let userId = null;
    return {
      eq(_column, value) { userId = value; return this; },
      maybeSingle() { return Promise.resolve({ data: profiles[userId] || null, error: null }); },
      single() { return Promise.resolve({ data: profiles[userId] || null, error: null }); }
    };
  }

  function updateChain(payload) {
    let userId = null;
    return {
      eq(_column, value) { userId = value; return this; },
      select() { return this; },
      single() {
        calls.profileUpdates.push({ userId, payload });
        const finish = () => {
          profiles[userId] = { ...profiles[userId], ...payload };
          return { data: profiles[userId], error: null };
        };
        return options.deferProfileUpdate ? profileUpdate.promise.then(finish) : Promise.resolve(finish());
      }
    };
  }

  const client = {
    auth: {
      updateUser(payload) {
        calls.authUpdates.push({ userId: activeUser && activeUser.id, payload });
        const result = { data: { user: activeUser }, error: null };
        return options.deferAuthUpdate ? authUpdate.promise.then(() => result) : Promise.resolve(result);
      }
    },
    from(table) {
      assert.equal(table, 'profiles');
      return {
        select() { return selectChain(); },
        update(payload) { return updateChain(payload); }
      };
    }
  };

  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://upskillsprint.com/profile.html',
    runScripts: 'outside-only'
  });
  dom.window.UpskillAuth = {
    getUser: () => activeUser,
    getClient: () => client,
    onChange(callback) {
      authListener = callback;
      callback(activeUser);
    }
  };
  dom.window.eval(profileSource);

  return {
    dom,
    users,
    calls,
    profileUpdate,
    authUpdate,
    switchUser(user) {
      activeUser = user;
      authListener(user);
    }
  };
}

function accountSwitchMenuRuntime(options = {}) {
  const users = {
    a: { id: 'user-a', email: 'a@example.com', user_metadata: { display_name: 'Metadata A' } },
    b: { id: 'user-b', email: 'b@example.com', user_metadata: { display_name: 'Metadata B' } }
  };
  const profiles = {
    'user-a': { user_id: 'user-a', display_name: 'Canonical A', timezone: 'America/Regina', newsletter_opt_in: false },
    'user-b': { user_id: 'user-b', display_name: 'Canonical B', timezone: 'America/Regina', newsletter_opt_in: false }
  };
  const aProfile = deferred();
  const bProfile = deferred();
  let aProfileRequests = 0;
  let authCallback = null;

  function selectChain() {
    let userId = null;
    return {
      eq(_column, value) { userId = value; return this; },
      maybeSingle() {
        if (userId === users.a.id && options.deferInitialA && aProfileRequests++ === 0) {
          return aProfile.promise;
        }
        if (userId === users.b.id) return bProfile.promise;
        return Promise.resolve({ data: profiles[userId], error: null });
      },
      single() { return Promise.resolve({ data: profiles[userId], error: null }); }
    };
  }

  const client = {
    auth: {
      onAuthStateChange(callback) { authCallback = callback; },
      getSession() { return Promise.resolve({ data: { session: { user: users.a } } }); },
      signOut() { return Promise.resolve({ data: null, error: null }); }
    },
    from(table) {
      assert.equal(table, 'profiles');
      return {
        select() { return selectChain(); },
        insert() { throw new Error('unexpected profile insert'); }
      };
    }
  };
  const dom = new JSDOM('<!doctype html><html><head></head><body><header class="site"><a class="header-cta"></a></header></body></html>', {
    url: 'https://upskillsprint.com/', runScripts: 'outside-only'
  });
  dom.window.UPSKILLSPRINT_SUPABASE_CONFIG = { url: 'https://project.supabase.co', anonKey: 'public-anon-key' };
  dom.window.supabase = { createClient: () => client };
  dom.window.eval(authSource);
  dom.window.eval(profileSource);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

  return {
    dom,
    users,
    aProfile,
    bProfile,
    switchToB() { authCallback('SIGNED_IN', { user: users.b }); },
    refreshA() { authCallback('TOKEN_REFRESHED', { user: users.a }); }
  };
}

function profilePageSwitchRuntime(options = {}) {
  const users = {
    a: { id: 'user-a', email: 'a@example.com', user_metadata: { display_name: 'Metadata A' } },
    b: { id: 'user-b', email: 'b@example.com', user_metadata: { display_name: 'Metadata B' } }
  };
  const profiles = {
    'user-a': { user_id: 'user-a', display_name: 'Canonical A', timezone: 'America/Regina', newsletter_opt_in: true },
    'user-b': { user_id: 'user-b', display_name: 'Canonical B', timezone: 'UTC', newsletter_opt_in: false }
  };
  const aProfile = deferred();
  const bProfile = deferred();
  const bRetryProfile = deferred();
  const profileUpdate = deferred();
  const updates = [];
  let aProfileRequests = 0;
  let bProfileRequests = 0;
  let activeUser = users.a;
  let authCallback = null;

  function selectChain() {
    let userId = null;
    return {
      eq(_column, value) { userId = value; return this; },
      maybeSingle() {
        if (userId === users.a.id && options.deferInitialA && aProfileRequests++ === 0) {
          return aProfile.promise;
        }
        if (userId === users.b.id) {
          if (options.retryB && bProfileRequests++ > 0) return bRetryProfile.promise;
          return bProfile.promise;
        }
        return Promise.resolve({ data: profiles[userId], error: null });
      },
      single() { return Promise.resolve({ data: profiles[userId], error: null }); }
    };
  }

  function updateChain(payload) {
    let userId = null;
    return {
      eq(_column, value) { userId = value; return this; },
      select() { return this; },
      single() {
        updates.push({ userId, payload });
        const finish = () => {
          profiles[userId] = { ...profiles[userId], ...payload };
          return { data: profiles[userId], error: null };
        };
        return options.deferProfileUpdate ? profileUpdate.promise.then(finish) : Promise.resolve(finish());
      }
    };
  }

  const client = {
    auth: {
      onAuthStateChange(callback) { authCallback = callback; },
      getSession() { return Promise.resolve({ data: { session: { user: users.a } } }); },
      updateUser() { return Promise.resolve({ data: { user: activeUser }, error: null }); },
      signOut() { return Promise.resolve({ data: null, error: null }); }
    },
    from(table) {
      assert.equal(table, 'profiles');
      return {
        select() { return selectChain(); },
        update(payload) { return updateChain(payload); },
        insert() { throw new Error('unexpected profile insert'); }
      };
    }
  };
  const dom = new JSDOM(profilePageHtml, {
    url: 'https://upskillsprint.com/profile.html', runScripts: 'outside-only'
  });
  dom.window.UPSKILLSPRINT_SUPABASE_CONFIG = { url: 'https://project.supabase.co', anonKey: 'public-anon-key' };
  dom.window.supabase = { createClient: () => client };
  dom.window.eval(authSource);
  dom.window.eval(profileSource);
  dom.window.eval(profilePageSource);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

  return {
    dom,
    aProfile,
    bProfile,
    bRetryProfile,
    profileUpdate,
    updates,
    switchToB() {
      activeUser = users.b;
      authCallback('SIGNED_IN', { user: users.b });
    },
    switchToA() {
      activeUser = users.a;
      authCallback('SIGNED_IN', { user: users.a });
    },
    refreshActiveUser() {
      authCallback('TOKEN_REFRESHED', { user: activeUser });
    },
    signOut() {
      activeUser = null;
      authCallback('SIGNED_OUT', null);
    }
  };
}

test('restored session renders the canonical profile name and email', async () => {
  const { dom } = runtime();
  await flush(); await flush(); await flush();
  assert.equal(dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical Name');
  assert.equal(dom.window.document.querySelector('#account-menu-email').textContent, 'learner@example.com');
  assert.equal(dom.window.document.querySelector('#account-menu-profile').getAttribute('href'), '/profile.html');
  dom.window.close();
});

test('account switching never pairs the new user with the previous user profile', async () => {
  const runtime = accountSwitchMenuRuntime();
  await flush(); await flush(); await flush();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical A');

  runtime.switchToB();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-email').textContent, 'b@example.com');
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Metadata B');
  assert.equal(runtime.dom.window.UpskillProfile.getCurrent(), null);

  runtime.bProfile.resolve({ data: {
    user_id: 'user-b', display_name: 'Canonical B', timezone: 'America/Regina', newsletter_opt_in: false
  }, error: null });
  await flush(); await flush();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical B');
  runtime.dom.window.document.dispatchEvent(new runtime.dom.window.CustomEvent('upskill-profile-change', {
    detail: { profile: { user_id: 'user-a', display_name: 'Late Canonical A' } }
  }));
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical B');
  runtime.dom.window.close();
});

test('a failed new-account profile load cannot restore the previous account name', async () => {
  const runtime = accountSwitchMenuRuntime();
  await flush(); await flush(); await flush();
  runtime.switchToB();
  runtime.bProfile.resolve({ data: null, error: new Error('profile unavailable') });
  await flush(); await flush();

  assert.equal(runtime.dom.window.document.querySelector('#account-menu-email').textContent, 'b@example.com');
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Metadata B');
  assert.equal(runtime.dom.window.UpskillProfile.getCurrent(), null);
  runtime.dom.window.close();
});

test('same-user token refresh retains the matching canonical profile', async () => {
  const runtime = accountSwitchMenuRuntime();
  await flush(); await flush(); await flush();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical A');

  runtime.refreshA();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical A');
  await flush();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical A');
  runtime.dom.window.close();
});

test('a late profile response cannot overwrite a rapid switch back to the first account', async () => {
  const runtime = accountSwitchMenuRuntime();
  await flush(); await flush(); await flush();
  runtime.switchToB();
  runtime.refreshA();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-email').textContent, 'a@example.com');
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Metadata A');
  await flush(); await flush();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical A');

  runtime.bProfile.resolve({ data: {
    user_id: 'user-b', display_name: 'Late Canonical B', timezone: 'America/Regina', newsletter_opt_in: false
  }, error: null });
  await flush(); await flush();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-email').textContent, 'a@example.com');
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical A');
  assert.equal(runtime.dom.window.UpskillProfile.getCurrent().user_id, 'user-a');
  runtime.dom.window.close();
});

test('an older same-account response cannot win an A-to-B-to-A request race', async () => {
  const runtime = accountSwitchMenuRuntime({ deferInitialA: true });
  await flush(); await flush();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Metadata A');

  runtime.switchToB();
  runtime.refreshA();
  await flush(); await flush();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical A');

  runtime.aProfile.resolve({ data: {
    user_id: 'user-a', display_name: 'Stale Canonical A', timezone: 'America/Regina', newsletter_opt_in: false
  }, error: null });
  await flush(); await flush();
  assert.equal(runtime.dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical A');
  assert.equal(runtime.dom.window.UpskillProfile.getCurrent().display_name, 'Canonical A');
  runtime.dom.window.close();
});

test('profile page clears and locks account A fields while account B loads', async () => {
  const runtime = profilePageSwitchRuntime();
  await flush(); await flush(); await flush();
  const document = runtime.dom.window.document;
  assert.equal(document.querySelector('#profile-display-name').value, 'Canonical A');
  assert.equal(document.querySelector('#profile-email').value, 'a@example.com');
  assert.equal(document.querySelector('#profile-newsletter').checked, true);

  runtime.switchToB();
  assert.equal(document.querySelector('#profile-display-name').value, '');
  assert.equal(document.querySelector('#profile-email').value, '');
  assert.equal(document.querySelector('#profile-newsletter').checked, false);
  assert.equal(document.querySelector('#profile-submit').disabled, true);
  assert.equal(document.querySelector('#profile-display-name').disabled, true);
  assert.equal(document.querySelector('#profile-timezone').disabled, true);
  assert.equal(document.querySelector('#profile-newsletter').disabled, true);
  assert.equal(document.querySelector('#profile-form').getAttribute('aria-busy'), 'true');

  runtime.bProfile.resolve({ data: {
    user_id: 'user-b', display_name: 'Canonical B', timezone: 'UTC', newsletter_opt_in: false
  }, error: null });
  await flush(); await flush();
  assert.equal(document.querySelector('#profile-display-name').value, 'Canonical B');
  assert.equal(document.querySelector('#profile-email').value, 'b@example.com');
  assert.equal(document.querySelector('#profile-submit').disabled, false);
  assert.equal(document.querySelector('#profile-display-name').disabled, false);
  assert.equal(document.querySelector('#profile-newsletter').disabled, false);
  assert.equal(document.querySelector('#profile-form').getAttribute('aria-busy'), 'false');
  runtime.dom.window.close();
});

test('a failed account B profile load leaves no account A data in the form', async () => {
  const runtime = profilePageSwitchRuntime();
  await flush(); await flush(); await flush();
  runtime.switchToB();
  runtime.bProfile.resolve({ data: null, error: new Error('profile unavailable') });
  await flush(); await flush();
  const document = runtime.dom.window.document;

  assert.equal(document.querySelector('#profile-display-name').value, '');
  assert.equal(document.querySelector('#profile-email').value, '');
  assert.equal(document.querySelector('#profile-newsletter').checked, false);
  assert.equal(document.querySelector('#profile-submit').disabled, true);
  assert.match(document.querySelector('#profile-status').textContent, /could not be loaded/i);
  runtime.dom.window.close();
});

test('a submit during an account switch cannot copy account A form data into account B', async () => {
  const runtime = profilePageSwitchRuntime();
  await flush(); await flush(); await flush();
  const document = runtime.dom.window.document;
  runtime.switchToB();
  document.querySelector('#profile-display-name').value = 'Canonical A';
  document.querySelector('#profile-newsletter').checked = true;
  document.querySelector('#profile-form').dispatchEvent(new runtime.dom.window.Event('submit', {
    bubbles: true, cancelable: true
  }));

  runtime.bProfile.resolve({ data: {
    user_id: 'user-b', display_name: 'Canonical B', timezone: 'UTC', newsletter_opt_in: false
  }, error: null });
  await flush(); await flush(); await flush();
  assert.equal(runtime.updates.length, 0);
  assert.equal(document.querySelector('#profile-display-name').value, 'Canonical B');
  assert.equal(document.querySelector('#profile-newsletter').checked, false);
  runtime.dom.window.close();
});

test('profile page ignores an older account A response after an A-to-B-to-A race', async () => {
  const runtime = profilePageSwitchRuntime({ deferInitialA: true });
  await flush(); await flush();
  const document = runtime.dom.window.document;
  runtime.switchToB();
  runtime.switchToA();
  await flush(); await flush();
  assert.equal(document.querySelector('#profile-display-name').value, 'Canonical A');

  runtime.aProfile.resolve({ data: {
    user_id: 'user-a', display_name: 'Stale Canonical A', timezone: 'UTC', newsletter_opt_in: false
  }, error: null });
  await flush(); await flush();
  assert.equal(document.querySelector('#profile-display-name').value, 'Canonical A');
  assert.equal(document.querySelector('#profile-newsletter').checked, true);
  runtime.dom.window.close();
});

test('an account A save completion cannot unlock or repopulate the account B form', async () => {
  const runtime = profilePageSwitchRuntime({ deferProfileUpdate: true });
  await flush(); await flush(); await flush();
  const document = runtime.dom.window.document;
  document.querySelector('#profile-display-name').value = 'Updated Canonical A';
  document.querySelector('#profile-form').dispatchEvent(new runtime.dom.window.Event('submit', {
    bubbles: true, cancelable: true
  }));
  await flush();
  assert.equal(runtime.updates.length, 1);

  runtime.switchToB();
  assert.equal(document.querySelector('#profile-display-name').value, '');
  assert.equal(document.querySelector('#profile-submit').disabled, true);
  runtime.profileUpdate.resolve();
  await flush(); await flush();
  assert.equal(document.querySelector('#profile-display-name').value, '');
  assert.equal(document.querySelector('#profile-email').value, '');
  assert.equal(document.querySelector('#profile-submit').disabled, true);

  runtime.bProfile.resolve({ data: {
    user_id: 'user-b', display_name: 'Canonical B', timezone: 'UTC', newsletter_opt_in: false
  }, error: null });
  await flush(); await flush();
  assert.equal(document.querySelector('#profile-display-name').value, 'Canonical B');
  assert.equal(document.querySelector('#profile-email').value, 'b@example.com');
  assert.equal(document.querySelector('#profile-submit').disabled, false);
  runtime.dom.window.close();
});

test('same-user token refresh preserves unsaved profile form edits', async () => {
  const runtime = profilePageSwitchRuntime();
  await flush(); await flush(); await flush();
  const document = runtime.dom.window.document;
  document.querySelector('#profile-display-name').value = 'Unsaved Account A';
  document.querySelector('#profile-newsletter').checked = false;

  runtime.refreshActiveUser();
  await flush(); await flush();
  assert.equal(document.querySelector('#profile-display-name').value, 'Unsaved Account A');
  assert.equal(document.querySelector('#profile-newsletter').checked, false);
  assert.equal(document.querySelector('#profile-submit').disabled, false);
  runtime.dom.window.close();
});

test('sign-out immediately clears and locks every account-owned profile field', async () => {
  const runtime = profilePageSwitchRuntime();
  await flush(); await flush(); await flush();
  const document = runtime.dom.window.document;
  assert.equal(document.querySelector('#profile-display-name').value, 'Canonical A');

  runtime.signOut();
  assert.equal(document.querySelector('#profile-display-name').value, '');
  assert.equal(document.querySelector('#profile-email').value, '');
  assert.equal(document.querySelector('#profile-newsletter').checked, false);
  assert.equal(document.querySelector('#profile-display-name').disabled, true);
  assert.equal(document.querySelector('#profile-timezone').disabled, true);
  assert.equal(document.querySelector('#profile-newsletter').disabled, true);
  assert.equal(document.querySelector('#profile-submit').disabled, true);
  assert.equal(document.querySelector('#profile-form').getAttribute('aria-busy'), 'true');
  runtime.dom.window.close();
});

test('same-user auth refresh retries a failed profile load without restoring account A data', async () => {
  const runtime = profilePageSwitchRuntime({ retryB: true });
  await flush(); await flush(); await flush();
  const document = runtime.dom.window.document;
  runtime.switchToB();
  runtime.bProfile.resolve({ data: null, error: new Error('profile unavailable') });
  await flush(); await flush();
  assert.equal(document.querySelector('#profile-display-name').value, '');
  assert.match(document.querySelector('#profile-status').textContent, /could not be loaded/i);

  runtime.refreshActiveUser();
  assert.equal(document.querySelector('#profile-display-name').value, '');
  assert.equal(document.querySelector('#profile-submit').disabled, true);
  assert.match(document.querySelector('#profile-status').textContent, /loading your profile/i);
  runtime.bRetryProfile.resolve({ data: {
    user_id: 'user-b', display_name: 'Canonical B', timezone: 'UTC', newsletter_opt_in: false
  }, error: null });
  await flush(); await flush();
  assert.equal(document.querySelector('#profile-display-name').value, 'Canonical B');
  assert.equal(document.querySelector('#profile-email').value, 'b@example.com');
  assert.equal(document.querySelector('#profile-submit').disabled, false);
  runtime.dom.window.close();
});

test('profile save sends only editable fields and refreshes the menu', async () => {
  const { dom, calls } = runtime();
  await flush(); await flush();
  const saved = await dom.window.UpskillProfile.save({
    display_name: 'Updated Learner',
    timezone: 'America/Regina',
    newsletter_opt_in: true
  });
  assert.deepEqual(JSON.parse(JSON.stringify(calls.updatePayloads[0])), {
    display_name: 'Updated Learner',
    timezone: 'America/Regina',
    newsletter_opt_in: true
  });
  assert.equal(saved.display_name, 'Updated Learner');
  assert.equal(dom.window.document.querySelector('#account-menu-name').textContent, 'Updated Learner');
  assert.deepEqual(JSON.parse(JSON.stringify(calls.authUpdates[0].data)), {
    display_name: 'Updated Learner',
    full_name: 'Updated Learner',
    timezone: 'America/Regina'
  });
  dom.window.close();
});

test('profile save cannot publish stale data or update metadata after an account switch', async () => {
  const race = profileRaceRuntime({ deferProfileUpdate: true });
  await flush();
  const savePromise = race.dom.window.UpskillProfile.save({
    display_name: 'Updated Account A',
    timezone: 'America/Regina',
    newsletter_opt_in: true
  });
  const rejectedSave = assert.rejects(savePromise, /account changed while the profile was being saved/i);
  await flush();

  race.switchUser(race.users.b);
  await flush();
  assert.equal(race.dom.window.UpskillProfile.getCurrent().user_id, 'user-b');

  race.profileUpdate.resolve();
  await rejectedSave;
  assert.equal(race.dom.window.UpskillProfile.getCurrent().user_id, 'user-b');
  assert.equal(race.calls.authUpdates.length, 0);
  assert.equal(race.calls.profileUpdates[0].userId, 'user-a');
  race.dom.window.close();
});

test('profile save cannot republish stale data when auth metadata completes after an account switch', async () => {
  const race = profileRaceRuntime({ deferAuthUpdate: true });
  await flush();
  const savePromise = race.dom.window.UpskillProfile.save({
    display_name: 'Updated Account A',
    timezone: 'America/Regina',
    newsletter_opt_in: true
  });
  const rejectedSave = assert.rejects(savePromise, /account changed while the profile was being saved/i);
  await flush();
  assert.equal(race.calls.authUpdates[0].userId, 'user-a');

  race.switchUser(race.users.b);
  await flush();
  race.authUpdate.resolve();
  await rejectedSave;
  assert.equal(race.dom.window.UpskillProfile.getCurrent().user_id, 'user-b');
  race.dom.window.close();
});

test('signup sends explicit consent, profile metadata, and CAPTCHA', async () => {
  const { dom, calls } = runtime();
  await flush();
  await dom.window.UpskillAuth.signUp('new@example.com', 'Long unique phrase 2026!', {
    displayName: 'New Learner',
    timezone: 'America/Regina',
    newsletterOptIn: true,
    termsAccepted: true,
    captchaToken: 'captcha-token'
  });
  const options = calls.signups[0].options;
  assert.equal(options.captchaToken, 'captcha-token');
  assert.deepEqual(JSON.parse(JSON.stringify(options.data)), {
    display_name: 'New Learner',
    full_name: 'New Learner',
    timezone: 'America/Regina',
    newsletter_opt_in: true,
    terms_accepted: true
  });
  dom.window.close();
});

test('session restoration failure settles as signed out', async () => {
  const { dom } = runtime({ sessionError: true });
  let observed = 'pending';
  dom.window.UpskillAuth.onChange(user => { observed = user; });
  await flush(); await flush();
  assert.equal(observed, null);
  assert.equal(dom.window.document.querySelector('#account-menu-signin').textContent, 'Sign in');
  dom.window.close();
});

test('change-password button disables while sending and reports in aria-live', async () => {
  const dom = new JSDOM(profilePageHtml, { url: 'https://sprint.example/profile', runScripts: 'outside-only' });
  const w = dom.window;
  w.eval(authSource);
  w.eval(profileSource);
  w.eval(profilePageSource);
  const btn = w.document.getElementById('profile-change-password');
  const status = w.document.getElementById('profile-password-status');
  assert.ok(btn, 'button present');
  assert.equal(status.getAttribute('aria-live'), 'polite');
  dom.window.close();
});

test('feature detection hides learning fields when columns are missing', async () => {
  const dom = new JSDOM(profilePageHtml, { url: 'https://sprint.example/profile', runScripts: 'outside-only' });
  const w = dom.window;
  w.UpskillAuth = {
    getUser: () => ({ id: 'u1', email: 'a@b.c' }),
    getClient: () => ({ from: () => ({ select: () => ({ limit: () => Promise.resolve({ error: { message: 'missing' } }) }) }) }),
    onChange: () => {}
  };
  w.UpskillProfile = { onChange: () => {}, getCurrent: () => null, browserTimezone: () => 'UTC', load: () => Promise.resolve(null), setExtraColumns: () => {}, hasExtraColumns: () => false };
  w.eval(profilePageSource);
  await flush(); await flush();
  assert.equal(w.document.getElementById('profile-learning').querySelector('label').hidden, true);
  assert.equal(w.document.getElementById('profile-learning-note').hidden, false);
  dom.window.close();
});

test('download with no pending request has a null deletion_request', async () => {
  const dom = new JSDOM(profilePageHtml, { url: 'https://sprint.example/profile', runScripts: 'outside-only' });
  const w = dom.window;
  let captured = null;
  w.URL.createObjectURL = (blob) => { captured = blob; return 'blob:test'; };
  w.URL.revokeObjectURL = () => {};
  w.UpskillAuth = {
    getUser: () => ({ id: 'u1', email: 'a@b.c' }),
    getClient: () => ({ from: () => ({ select: () => ({ eq: () => ({ eq: () => Promise.resolve({ data: [] }) }) }) }) }),
    onChange: () => {}
  };
  w.UpskillProfile = { onChange: () => {}, getCurrent: () => ({ display_name: 'Ada' }), browserTimezone: () => 'UTC', load: () => Promise.resolve(null), setExtraColumns: () => {}, hasExtraColumns: () => false };
  w.eval(profilePageSource);
  w.document.getElementById('profile-download').click();
  await flush(); await flush();
  const json = JSON.parse(await captured.text());
  assert.equal(json.deletion_request, null);
  dom.window.close();
});

test('change password disables the button and shows a status', async () => {
  const dom = new JSDOM(profilePageHtml, { url: 'https://sprint.example/profile', runScripts: 'outside-only' });
  const w = dom.window;
  let resetCalled = false;
  w.UpskillAuth = {
    getUser: () => ({ id: 'u1', email: 'a@b.c' }),
    getClient: () => ({}),
    resetPassword: () => { resetCalled = true; return Promise.resolve(); },
    onChange: () => {}
  };
  w.eval(profilePageSource);
  const btn = w.document.getElementById('profile-change-password');
  const status = w.document.getElementById('profile-password-status');
  btn.click();
  assert.equal(btn.disabled, true);
  await flush();
  assert.equal(resetCalled, true);
  assert.match(status.textContent, /Check your email/);
  dom.window.close();
});

test('missing columns hide learning and email sections', async () => {
  const dom = new JSDOM(profilePageHtml, { url: 'https://sprint.example/profile', runScripts: 'outside-only' });
  const w = dom.window;
  w.UpskillAuth = {
    getUser: () => ({ id: 'u1', email: 'a@b.c' }),
    getClient: () => ({ from: () => ({ select: () => ({ limit: () => Promise.resolve({ error: { message: 'column role does not exist' } }) }) }) }),
    onChange: () => {}
  };
  w.UpskillProfile = { onChange: () => {}, getCurrent: () => null, browserTimezone: () => 'UTC', load: () => Promise.resolve(null) };
  w.eval(profilePageSource);
  await flush(); await flush();
  const learning = w.document.getElementById('profile-learning');
  const note = w.document.getElementById('profile-learning-note');
  assert.equal(learning.querySelector('label').hidden, true);
  assert.equal(note.hidden, false);
  dom.window.close();
});

test('download builds JSON from data', async () => {
  const dom = new JSDOM(profilePageHtml, { url: 'https://sprint.example/profile', runScripts: 'outside-only' });
  const w = dom.window;
  let captured = null;
  w.URL.createObjectURL = (blob) => { captured = blob; return 'blob:test'; };
  w.URL.revokeObjectURL = () => {};
  w.UpskillAuth = {
    getUser: () => ({ id: 'u1', email: 'a@b.c' }),
    getClient: () => ({ from: () => ({ select: () => ({ eq: () => ({ eq: () => Promise.resolve({ data: [{ status: 'pending', requested_at: '2026-01-01' }] }) }) }) }) }),
    onChange: () => {}
  };
  w.UpskillProfile = { onChange: () => {}, getCurrent: () => ({ display_name: 'Ada' }), browserTimezone: () => 'UTC', load: () => Promise.resolve(null), setExtraColumns: () => {}, hasExtraColumns: () => false };
  w.eval(profilePageSource);
  w.document.getElementById('profile-download').click();
  await flush(); await flush();
  assert.ok(captured, 'blob captured');
  const json = JSON.parse(await captured.text());
  assert.equal(json.email, 'a@b.c');
  assert.equal(json.profile.display_name, 'Ada');
  assert.equal(json.progress.lessons_completed, null);
  assert.match(json.progress.note, /not tracked/);
  assert.equal(json.deletion_request.status, 'pending');
  dom.window.close();
});

test('deletion 23505 shows the pending message', async () => {
  const dom = new JSDOM(profilePageHtml, { url: 'https://sprint.example/profile', runScripts: 'outside-only' });
  const w = dom.window;
  w.confirm = () => true;
  w.UpskillAuth = {
    getUser: () => ({ id: 'u1', email: 'a@b.c' }),
    getClient: () => ({ from: () => ({ insert: () => Promise.resolve({ error: { code: '23505' } }) }) }),
    onChange: () => {}
  };
  w.UpskillProfile = { onChange: () => {}, getCurrent: () => null, browserTimezone: () => 'UTC', load: () => Promise.resolve(null) };
  w.eval(profilePageSource);
  const btn = w.document.getElementById('profile-delete-request');
  btn.click();
  await flush();
  const status = w.document.getElementById('profile-data-status');
  assert.match(status.textContent, /already have a deletion request pending/);
  assert.equal(btn.disabled, true);
  dom.window.close();
});

test('pending status clears when the account switches', async () => {
  const dom = new JSDOM(profilePageHtml, { url: 'https://sprint.example/profile', runScripts: 'outside-only' });
  const w = dom.window;
  let user = { id: 'a', email: 'a@b.c' };
  let pending = true;
  const listeners = [];
  w.UpskillAuth = {
    getUser: () => user,
    getClient: () => ({ from: (table) => ({
      select: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ data: table === 'account_deletion_requests' && pending ? [{ status: 'pending' }] : [] }),
          single: () => Promise.resolve({ data: null, error: null })
        }),
        limit: () => Promise.resolve({ error: null })
      })
    }) }),
    onChange: (fn) => listeners.push(fn)
  };
  w.UpskillProfile = { onChange: () => {}, getCurrent: () => null, browserTimezone: () => 'UTC', load: () => Promise.resolve(null) };
  w.eval(profilePageSource);
  await flush(); await flush();
  const btn = w.document.getElementById('profile-delete-request');
  const status = w.document.getElementById('profile-data-status');
  assert.match(status.textContent, /pending/);
  assert.equal(btn.disabled, true);
  user = { id: 'b', email: 'b@b.c' };
  pending = false;
  listeners.forEach(fn => fn(user));
  await flush(); await flush();
  assert.equal(status.textContent, '');
  assert.equal(btn.disabled, false);
  dom.window.close();
});

test('base schema loads and saves without the new columns', async () => {
  const dom = new JSDOM('<!doctype html><html><body><span id="name"></span></body></html>', { url: 'https://sprint.example/', runScripts: 'outside-only' });
  const w = dom.window;
  const selected = [];
  w.UpskillAuth = {
    getUser: () => ({ id: 'u1', email: 'a@b.c', user_metadata: { display_name: 'Ada' } }),
    getClient: () => ({
      from: () => ({
        select: (cols) => {
          selected.push(cols);
          if (/role|industry|target_certification|exam_practice|monthly_digest/.test(cols)) {
            return { eq: () => ({ single: () => Promise.resolve({ error: { code: '42703', message: 'column does not exist' } }) }) };
          }
          return { eq: () => ({ single: () => Promise.resolve({ data: { user_id: 'u1', display_name: 'Ada', timezone: 'UTC', newsletter_opt_in: false }, error: null }), maybeSingle: () => Promise.resolve({ data: { user_id: 'u1', display_name: 'Ada', timezone: 'UTC', newsletter_opt_in: false }, error: null }) }) };
        }
      })
    }),
    onChange: (fn) => fn({ id: 'u1' })
  };
  w.eval(profileSource);
  await flush(); await flush();
  assert.ok(selected.every(c => !/role|industry|target_certification|exam_practice|monthly_digest/.test(c)), 'no new columns requested');
  assert.equal(w.UpskillProfile.getCurrent().display_name, 'Ada');
  dom.window.close();
});

// Exercise the real shared controller before the page script, with auth arriving
// while the schema probe is pending. A single-listener fake hides the early load.
for (const migrated of [true, false]) {
  test(migrated
    ? 'extras survive a name-only save when detection finishes after auth'
    : 'base-schema page survives delayed detection and a name-only save', async (t) => {
    const dom = new JSDOM(profilePageHtml, { url: 'https://sprint.example/profile', runScripts: 'outside-only' });
    t.after(() => dom.window.close());
    const w = dom.window;
    const extraColumns = ['role', 'industry', 'target_certification', 'exam_practice_opt_in', 'monthly_digest_opt_in'];
    const stored = {
      user_id: 'u1', display_name: 'Ada', timezone: 'UTC', newsletter_opt_in: true,
      newsletter_consent_at: '2026-01-01T00:00:00Z', terms_accepted_at: null,
      onboarding_completed: true, created_at: null, updated_at: null,
      role: 'Manager', industry: 'Steel', target_certification: 'CQA',
      exam_practice_opt_in: true, monthly_digest_opt_in: true
    };
    const schema = new Set(Object.keys(stored).filter(key => migrated || !extraColumns.includes(key)));
    const selected = [];
    const fetches = [];
    const listeners = [];
    let user = null;
    let sessionKnown = false;
    let saved = null;
    let resolveDetection;
    const detection = new Promise(resolve => { resolveDetection = resolve; });
    function resultFor(columns) {
      const missing = columns.find(column => !schema.has(column));
      return missing
        ? { data: null, error: { code: '42703', message: `column ${missing} does not exist` } }
        : { data: Object.fromEntries(columns.map(column => [column, stored[column]])), error: null };
    }
    function rowQuery(columns) {
      return { single: () => Promise.resolve(resultFor(columns)), maybeSingle: () => Promise.resolve(resultFor(columns)) };
    }
    const client = {
      auth: { updateUser: () => Promise.resolve({ data: { user }, error: null }) },
      from: (table) => {
        if (table === 'account_deletion_requests') {
          return { select: () => ({ eq: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }) }) };
        }
        assert.equal(table, 'profiles', 'only expected tables are queried');
        return {
          select: (columnList) => {
            const columns = columnList.split(',').map(column => column.trim());
            selected.push(columns);
            return {
              limit: (count) => {
                assert.equal(columnList, 'role');
                assert.equal(count, 0);
                return detection;
              },
              eq: (key, value) => {
                assert.equal(key, 'user_id');
                assert.equal(value, stored.user_id);
                fetches.push(columns);
                return rowQuery(columns);
              }
            };
          },
          update: (payload) => {
            assert.ok(Object.keys(payload).every(key => schema.has(key)), 'updates contain only existing columns');
            saved = { ...payload };
            Object.assign(stored, payload);
            return { eq: (key, value) => {
              assert.equal(key, 'user_id');
              assert.equal(value, stored.user_id);
              return { select: columns => rowQuery(columns.split(',')) };
            } };
          }
        };
      }
    };
    w.UpskillAuth = {
      getUser: () => user,
      getClient: () => client,
      // Mirror auth.js: retain every listener; replay current user only once
      // the session is known, including registrations after the schema probe.
      onChange: (listener) => {
        listeners.push(listener);
        if (sessionKnown) listener(user);
      }
    };
    w.eval(profileSource);
    w.eval(profilePageSource);
    assert.equal(listeners.length, 2, 'shared controller and deletion-status listeners are retained before detection');
    user = { id: 'u1', email: 'a@b.c' };
    sessionKnown = true;
    listeners.slice().forEach(listener => listener(user));
    await flush(); await flush();
    assert.equal(fetches.length, 1, 'auth triggers a profile fetch before detection resolves');
    assert.ok(fetches[0].includes('display_name'));
    assert.ok(extraColumns.every(column => !fetches[0].includes(column)), 'first profile fetch uses only base columns');
    assert.equal(w.UpskillProfile.getCurrent().display_name, 'Ada', 'base fetch has resolved before detection');
    assert.equal(w.UpskillProfile.getCurrent().role, undefined, 'strict projection does not leak extra columns');
    resolveDetection(migrated ? { data: [], error: null } : resultFor(['role']));
    await flush(); await flush();
    assert.equal(listeners.length, 3, 'page load listener joins both earlier auth listeners');
    t.diagnostic('profile selects in order: ' + selected.map(columns => columns.join(',')).join(' -> '));
    if (migrated) {
      assert.ok(fetches.slice(1).some(columns => extraColumns.every(column => columns.includes(column))),
        'after detection the cached base profile must be refetched with all extras');
      assert.equal(w.document.getElementById('profile-role').value, stored.role, 'form shows stored role');
      assert.equal(w.document.getElementById('profile-industry').value, stored.industry, 'form shows stored industry');
      assert.equal(w.document.getElementById('profile-certification').value, stored.target_certification, 'form shows stored certification');
      assert.equal(w.document.getElementById('profile-exam-email').checked, stored.exam_practice_opt_in, 'form shows stored exam opt-in');
      assert.equal(w.document.getElementById('profile-digest').checked, stored.monthly_digest_opt_in, 'form shows stored digest opt-in');
    } else {
      assert.ok(fetches.every(columns => extraColumns.every(column => !columns.includes(column))), 'missing columns are never fetched (apart from the detection probe)');
      assert.equal(w.UpskillProfile.hasExtraColumns(), false);
    }
    const expectedExtras = Object.fromEntries(extraColumns.map(column => [column, stored[column]]));
    w.document.getElementById('profile-display-name').value = 'Ada L';
    w.document.getElementById('profile-form').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    await flush(); await flush();
    assert.ok(saved, 'save happened');
    assert.equal(saved.display_name, 'Ada L');
    for (const column of extraColumns) {
      if (migrated) assert.equal(saved[column], expectedExtras[column], `${column} unchanged`);
      else assert.equal(Object.hasOwn(saved, column), false, `${column} is absent from base-schema update`);
    }
    assert.match(w.document.getElementById('profile-status').textContent, /up to date/, 'save completed successfully');
  });
}
