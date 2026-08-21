const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('profile migration enforces owner-only RLS and explicit grants', () => {
  const sql = read('supabase/auth-phase1.sql');
  assert.match(sql, /alter table public\.profiles enable row level security/i);
  assert.match(sql, /revoke all on table public\.profiles from public, anon, authenticated/i);
  assert.match(sql, /grant select on table public\.profiles to authenticated/i);
  assert.match(sql, /grant insert \(user_id, display_name, timezone, newsletter_opt_in, onboarding_completed\)/i);
  assert.match(sql, /grant update \(display_name, timezone, newsletter_opt_in, onboarding_completed\)/i);
  assert.match(sql, /using \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.match(sql, /with check \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.doesNotMatch(sql, /grant .* delete/i);
});

test('profile trigger has a locked search path and records explicit consent', () => {
  const sql = read('supabase/auth-phase1.sql');
  assert.match(sql, /security definer\s+set search_path = ''/i);
  assert.match(sql, /case when requested_newsletter then now\(\) else null end/i);
  assert.match(sql, /newsletter_consent_at/i);
  assert.match(sql, /terms_accepted_at/i);
  assert.match(sql, /on conflict \(user_id\) do nothing/i);
});

test('profile audit fields are server-managed and immutable to the browser', () => {
  const sql = read('supabase/auth-phase1.sql');
  const profile = read('profile.js');
  assert.match(sql, /create or replace function public\.set_profile_audit_fields\(\)/i);
  assert.match(sql, /new\.terms_accepted_at := old\.terms_accepted_at/i);
  assert.match(sql, /new\.updated_at := now\(\)/i);
  assert.doesNotMatch(sql, /grant (?:insert|update) \([^)]*(?:terms_accepted_at|newsletter_consent_at|created_at|updated_at)/i);
  assert.doesNotMatch(profile, /newsletter_consent_at:\s*optedIn/);
  assert.doesNotMatch(profile, /updated_at:\s*new Date/);
});

test('signup collects a name and requires legal acknowledgement', () => {
  const signup = read('signup.html');
  assert.match(signup, /id="create-account-name"[^>]+required/);
  assert.match(signup, /id="create-account-terms" required/);
  assert.match(signup, /href="\/terms\.html"/);
  assert.match(signup, /href="\/privacy\.html"/);
  assert.doesNotMatch(signup, /id="create-account-newsletter"\s+checked/);
  assert.match(signup, /newsletterOptIn: newsletter\.checked/);
  assert.match(signup, /termsAccepted: true/);
});

test('auth controller sends profile metadata and optional CAPTCHA tokens', () => {
  const auth = read('auth.js');
  assert.match(auth, /display_name: options\.displayName/);
  assert.match(auth, /terms_accepted: Boolean\(options\.termsAccepted\)/);
  assert.match(auth, /authOptions\.captchaToken = options\.captchaToken/);
  assert.match(auth, /payload\.options = \{ captchaToken: captchaToken \}/);
  assert.match(auth, /options\.captchaToken = captchaToken/);
  assert.match(auth, /getSession\(\)\.then[\s\S]*?\.catch\(/);
});

test('account menu shows canonical name, email, and profile link', () => {
  const auth = read('auth.js');
  assert.match(auth, /profile && profile\.display_name/);
  assert.match(auth, /account-menu-name/);
  assert.match(auth, /account-menu-email/);
  assert.match(auth, /Profile & preferences/);
  assert.match(auth, /upskill-profile-change/);
});

test('site-wide scripts preserve auth dependency order', () => {
  const source = read('site-sections.js');
  const expected = "['/supabase-config.js', '/vendor/supabase.js', '/auth.js', '/profile.js', '/auth-forms.js', '/progress.js', '/require-auth.js']";
  assert.ok(source.includes(expected));
});

test('password assessment enforces long, non-common passwords', () => {
  const source = read('auth-forms.js');
  const sandbox = {
    window: {},
    document: {
      readyState: 'loading',
      addEventListener() {},
      dispatchEvent() {}
    },
    CustomEvent: function CustomEvent() {}
  };
  vm.runInNewContext(source, sandbox);
  const forms = sandbox.window.UpskillAuthForms;
  assert.equal(forms.MIN_PASSWORD_LENGTH, 12);
  assert.equal(forms.passwordAssessment('password1234').valid, false);
  assert.equal(forms.passwordAssessment('short').valid, false);
  assert.equal(forms.passwordAssessment('Long unique phrase 2026!').valid, true);
});

test('recovery response does not reveal whether an account exists', () => {
  const reset = read('reset-password.html');
  assert.match(reset, /If an account exists for that address/);
  assert.doesNotMatch(reset, /No account exists/i);
});

test('profile page is gated and supports name and consent updates', () => {
  const profile = read('profile.html');
  assert.match(profile, /<body data-require-auth>/);
  assert.match(profile, /id="profile-display-name"/);
  assert.match(profile, /id="profile-newsletter"/);
  assert.match(profile, /UpskillProfile\.save/);
});
