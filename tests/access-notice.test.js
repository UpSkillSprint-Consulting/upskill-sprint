const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../access-control.js'), 'utf8');
function render(reason) {
  const nodes = [];
  function element() {
    return {children: [], setAttribute(k,v) { this[k] = v; }, style: {},
      appendChild(child) { this.children.push(child); }, focus() {this.focused = true;},
      scrollIntoView() {this.scrolled = true;}};
  }
  const mount = {insertBefore(node) {nodes.push(node);}, firstChild: null};
  vm.runInNewContext(source, {URLSearchParams, document: {
    readyState: 'complete', body: {getAttribute: () => null},
    getElementById: id => id === 'access-notice' ? nodes[0] : null,
    querySelector: () => mount, createElement: element
  }, window: {location: {search: '?access=' + encodeURIComponent(reason)}}});
  return nodes;
}
for (const [key, label] of [['premium','Premium member or higher'], ['administrator','Administrator']]) {
  test(key + ' denial explains access and offers owner contact', () => {
    const notice = render(key)[0];
    assert.ok(notice);
    assert.match(notice.children[1].textContent, /doesn’t have access/);
    assert.ok(notice.children[1].textContent.includes(label));
    assert.match(notice.children[2].href, /^mailto:skillsprintconsulting@gmail.com\?subject=/);
    assert.equal(notice['aria-labelledby'], 'access-notice-title');
    assert.equal(notice.focused, true);
    assert.equal(notice.scrolled, true);
  });
}
test('outages show a retry message, not an upgrade requirement', () => {
  const notice = render('unavailable')[0];
  assert.match(notice.children[1].textContent, /try opening the item again/);
  assert.doesNotMatch(notice.children[1].textContent, /higher access/);
});
test('unknown and hostile query values do not render notices', () => {
  for (const value of ['', 'constructor', '__proto__', '<script>alert(1)</script>']) {
    assert.equal(render(value).length, 0);
  }
});
