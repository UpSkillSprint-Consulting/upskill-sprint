'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = fs.readFileSync(path.join(__dirname, '..', '.github/workflows/inject-contrast-fix.yml'), 'utf8');

test('contrast maintenance is manual and cannot append a CI-skipping commit to an approved PR', () => {
  assert.match(yaml, /^  workflow_dispatch:/m);
  assert.doesNotMatch(yaml, /^  (?:push|pull_request|pull_request_target|workflow_run):/m);
  assert.match(yaml, /contents: read/);
  assert.doesNotMatch(yaml, /contents: write|git (?:commit|push)|\[skip ci\]/);
  assert.match(yaml, /persist-credentials: false/);
  assert.match(yaml, /actions\/upload-artifact@v4/);
  assert.match(yaml, /npm test/);
});

test('contrast proposal is scoped to one real page and preserves final lesson overrides', () => {
  assert.match(yaml, /CONTRAST_PAGE: \$\{\{ inputs\.page \}\}/);
  assert.doesNotMatch(yaml, /rglob\(/);
  assert.match(yaml, /'test-bank-assets', 'tests', 'docs'/);
  assert.match(yaml, /HTML fragments are not eligible/);
  assert.match(yaml, /overrides\[-1\]\.start\(\) if overrides else closing/);
  assert.match(yaml, /git diff --check/);
});
