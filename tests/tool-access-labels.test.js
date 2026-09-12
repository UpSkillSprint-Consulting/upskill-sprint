const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../site-sections.js'), 'utf8');
const activation = source.slice(source.indexOf('  function activateToolCard('), source.indexOf('  function activateAvailableTools('));

function activate(level) {
  const classes = {add() {}, remove() {}};
  const status = {classList: classes};
  const action = {classList: classes};
  const card = {classList: classes, getAttribute: () => level,
    querySelector: selector => ({'.tool-status': status, '.tool-link': action})[selector],
    setAttribute(key, value) { this[key] = value; }};
  const context = {isEngineeringToolsPage: () => true, document: {getElementById: () => card}};
  vm.runInNewContext(activation + '\nactivateToolCard({cardId:"materials-quality",path:"/tools/material-specification-compliance-checker",actionText:"Open checker",ariaLabel:"Open checker"});', context);
  return {status, action, card};
}
test('startup preserves Administrator badge and button on restricted tool cards', () => {
  const {status, action, card} = activate('administrator');
  assert.equal(status.textContent, 'Administrator');
  assert.equal(action.textContent, 'Administrator access');
  assert.match(card['aria-label'], /Administrator access required/);
});
test('public tools retain their normal action and availability', () => {
  const {status, action} = activate(null);
  assert.equal(status.textContent, 'Available');
  assert.equal(action.innerHTML, 'Open checker');
});
test('homepage checker preview matches the directory access wording', () => {
  const preview = source.slice(source.indexOf('<a href="${MATERIAL_CHECKER_PATH}"'), source.indexOf('<a href="${CALCULATOR_PATH}"'));
  assert.match(preview, />Administrator<\/p>/);
  assert.match(preview, />Administrator access<\/span>/);
  assert.doesNotMatch(preview, /Open checker|>Available</);
});
