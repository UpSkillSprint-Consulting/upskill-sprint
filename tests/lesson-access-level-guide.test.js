const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const guide = fs.readFileSync(
  path.resolve(__dirname, '../docs/LESSON_CREATION_GUIDE.md'),
  'utf8'
);

test('new lessons and tools require an explicit access-level decision', () => {
  assert.match(
    guide,
    /before creating any new lesson or engineering tool/i
  );
  assert.match(
    guide,
    /MUST pause and ask[\s\S]*Which access level should this new lesson or tool use:/i
  );
  assert.match(
    guide,
    /Do not assume `Public`[\s\S]*begin implementation until[\s\S]*user answers/i
  );
});

test('the mandatory prompt lists every supported access level', () => {
  const prompt = guide.match(
    /Which access level should this new lesson or tool use:[\s\S]*?Administrator\?/
  );
  assert.ok(prompt, 'mandatory access-level prompt is missing');
  for (const level of ['Public', 'Registered', 'Premium', 'Special', 'Administrator']) {
    assert.match(prompt[0], new RegExp('\\b' + level + '\\b'));
  }
});

test('the pre-submit checklist and anti-patterns enforce the decision', () => {
  assert.match(guide, /Pre-submit checklist[\s\S]*Access level was explicitly supplied/i);
  assert.match(guide, /Anti-patterns[\s\S]*without an explicit user-selected access level/i);
  assert.match(guide, /Defaulting new content to Public/i);
});
