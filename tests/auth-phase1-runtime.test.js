'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const authSource = fs.readFileSync(path.join(root, 'auth.js'), 'utf8');
const profileSource = fs.readFileSync(path.join(root, 'profile.js'), 'utf8');

function flush() { return new Promise(resolve => setTimeout(resolve, 0)); }

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

test('restored session renders the canonical profile name and email', async () => {
  const { dom } = runtime();
  await flush(); await flush(); await flush();
  assert.equal(dom.window.document.querySelector('#account-menu-name').textContent, 'Canonical Name');
  assert.equal(dom.window.document.querySelector('#account-menu-email').textContent, 'learner@example.com');
  assert.equal(dom.window.document.querySelector('#account-menu-profile').getAttribute('href'), '/profile.html');
  dom.window.close();
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
