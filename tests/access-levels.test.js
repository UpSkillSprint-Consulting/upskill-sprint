const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const sql = fs.readFileSync(
  path.resolve(__dirname, '../supabase/access-levels.sql'),
  'utf8'
);

test('defines the five ordered access levels', () => {
  for (const key of ['public', 'registered', 'premium', 'special', 'administrator']) {
    assert.match(sql, new RegExp("\\('" + key + "',\\s*\\d+", 'i'));
  }
});

test('keeps access grants server-managed and owner-readable', () => {
  assert.match(sql, /alter table public\.user_access_grants enable row level security/i);
  assert.match(sql, /using \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.doesNotMatch(sql, /grant (?:insert|update|delete).*user_access_grants.*(?:anon|authenticated)/i);
});

test('authorization is deny-by-default and honours expiry', () => {
  assert.match(sql, /expires_at is null or grant_row\.expires_at > now\(\)/i);
  assert.match(sql, /create or replace function public\.can_access_content/i);
  assert.match(sql, /false\s*\n\s*\);/i);
});

test('authorization functions are invoker-safe with locked search paths', () => {
  const functions = sql.match(/create or replace function[\s\S]*?\$\$;/gi) || [];
  assert.equal(functions.length, 3);
  for (const fn of functions) {
    assert.match(fn, /security invoker/i);
    assert.match(fn, /set search_path = ''/i);
  }
  assert.doesNotMatch(sql, /security definer/i);
});

test('unknown or inactive content cannot be accessed accidentally', () => {
  assert.match(sql, /where rule\.resource_key = requested_resource_key[\s\S]*rule\.is_active/i);
  assert.match(sql, /comment on function public\.can_access_content\(text\)[\s\S]*Deny-by-default/i);
});
