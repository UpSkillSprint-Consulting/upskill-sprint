'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'stress-mbb-set3-final175.mjs'), 'utf8');

test('full 175-question audit uses the established normal-click stabilization for the final review filter sweep', () => {
  assert.match(source, /async function stableClick\(locator\)/);
  assert.match(source, /scrollIntoView\(\{behavior:'instant',block:'center',inline:'nearest'\}\)/);
  assert.match(source, /await locator\.click\(\)/);
  assert.match(source, /review-filter-\$\{filter\}/);
  assert.match(source, /stableClick\(b\)/);
  assert.match(source, /getAttribute\('data-active-filter'\),filter/);
  assert.doesNotMatch(source, /force\s*:\s*true/);
  assert.doesNotMatch(source, /\.evaluate\([^)]*=>[^)]*\.click\(/);
});
