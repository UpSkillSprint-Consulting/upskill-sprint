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
  const calls = { updatePayloads: [], authUpdates: [], signups: [] };
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
  dom.window.eval(authSource);
  dom.window.eval(profileSource);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return { dom, calls, user };
}

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
