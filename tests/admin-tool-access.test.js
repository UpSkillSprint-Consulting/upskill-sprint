import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

const resources = [
  ['tools/material-specification-compliance-checker.html', 'tool:/tools/material-specification-compliance-checker'],
  ['tools/steel-phase-explorer.html', 'tool:/tools/steel-phase-explorer']
];

test('administrator tool pages opt into the Supabase resource gate', () => {
  for (const [path, resource] of resources) {
    const html = read(path);
    assert.match(html, /data-required-access="administrator"/);
    assert.ok(html.includes('data-access-resource="' + resource + '"'));
  }

  const builder = read('scripts/build-grade-specification-lookup.mjs');
  assert.match(builder, /data-required-access=\\"administrator\\"/);
  assert.match(builder, /tool:\/engineering-tools\/grade-specification-lookup/);
  assert.match(builder, /access-control\.js/);
});

test('the access gate asks Supabase and fails closed', () => {
  const gate = read('access-control.js');
  assert.match(gate, /rpc\('can_access_content'/);
  assert.match(gate, /requested_resource_key: resourceKey/);
  assert.doesNotMatch(gate, /user_metadata|app_metadata/);
  assert.match(gate, /access=unavailable/);
  assert.match(gate, /access=administrator/);

  const loader = read('site-sections.js');
  assert.match(loader, /'\/access-control\.js', '\/require-auth\.js'/);
});

test('the database migration seeds all three tools at administrator level', () => {
  const sql = read('supabase/access-levels.sql');
  const keys = [
    'tool:/tools/material-specification-compliance-checker',
    'tool:/engineering-tools/grade-specification-lookup',
    'tool:/tools/steel-phase-explorer'
  ];
  for (const key of keys) assert.ok(sql.includes(key));
  assert.equal((sql.match(/'administrator'/g) || []).length >= 4, true);
});

test('the tool directory identifies all three protected tools', () => {
  const html = read('engineering-tools.html');
  for (const id of ['materials-quality', 'material-specification-lookup', 'steel-phase-explorer']) {
    assert.match(html, new RegExp('id="' + id + '"[^>]+data-required-access="administrator"'));
  }
  assert.equal((html.match(/>Administrator<\/span>/g) || []).length, 3);
});
