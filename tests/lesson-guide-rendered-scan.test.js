'use strict';
// Guards the §16 step 5b rendered layout scan and the §26.6 evidence rules in the lesson guide.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
const mathJs = fs.readFileSync(path.join(root, 'assets/js/math.js'), 'utf8');
const block = first => {
  const i = guide.indexOf('```js\n' + first);
  assert.ok(i >= 0, 'missing code block starting ' + first);
  return guide.slice(i + 6, guide.indexOf('\n```', i + 6));
};

test('scan and runner code blocks compile', () => {
  const scan = block('// rendered-lesson-scan.js');
  assert.doesNotThrow(() => new vm.Script(scan, { filename: 'rendered-lesson-scan.js' }));
  const runner = block('// run-rendered-scan.cjs');
  assert.doesNotThrow(() => new vm.Script('(function (require, process, __dirname) {' + runner + '\n})', { filename: 'run-rendered-scan.cjs' }));
});

test('the scan measures the properties §26.6 names', () => {
  const scan = block('// rendered-lesson-scan.js');
  for (const check of ['page overflow', 'untypeset math', 'inline formula too large', 'formula wider than its box',
    'formula overflows without a named scroll region (panels closed)', 'scroll area not keyboard-reachable',
    'section edge mismatch', 'chart text under 10px', 'chart text outside chart', 'chart labels overlap',
    'cramped table cell', 'narrow table scrolls on phone', 'image did not load', 'touch target under 44px', '[links] broken: '])
    assert.ok(scan.includes("'" + check), check);
  for (const view of ['[1280, 1600, 390]', "['light', 'dark']", "body > section", 'data-full-bleed', "m.querySelector('svg')"]) assert.ok(scan.includes(view), view);
});

test('the runner serves the MathJax version that /assets/js/math.js pins', () => {
  const version = mathJs.match(/VERSION = '([\d.]+)'/)[1];
  assert.ok(guide.includes('npm i puppeteer-core mathjax@' + version), 'install line must match math.js VERSION ' + version);
  assert.ok(guide.includes('(' + version + ' today)'));
  assert.match(block('// run-rendered-scan.cjs'), /cdn\\\.jsdelivr\\\.net\\\/npm\\\/mathjax@/);
});

test('guide requires both environments and records them', () => {
  assert.match(guide, /### 26\.6 Rendered evidence rules \(A04, A09–A11, A16\) \(MUST\)/);
  assert.match(guide, /on \*\*both\*\* the local\n\s+build and the deploy preview of the final head/);
  assert.ok(guide.includes('- Rendered scan §16 step 5b, local build (math rendered):'));
  assert.ok(guide.includes('- Rendered scan §16 step 5b, deploy preview:'));
  assert.ok(guide.includes('- run the step 5b rendered scan on the preview and paste its six-view summary into the PR.'));
  assert.ok(guide.includes('**Every top-level block must still share the lesson\'s left and right edges**'));
  assert.ok(guide.includes('### 22.7 Layout traps with rendered math (MUST)'));
  assert.ok(guide.includes('#quiz .quiz-actions button{min-height:44px}'));
  assert.ok(guide.includes('also run it once with that line removed, so axe sees the default state'));
});
