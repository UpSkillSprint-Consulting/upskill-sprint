const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
function luminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v, 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return channels.reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
}
test('solid status foreground/background pairs exceed 4.5:1 text contrast', () => {
  for (const [name, foreground, background] of [
    ['correct', 'ffffff', '15803d'], ['incorrect', 'ffffff', 'dc2626'],
    ['revealed', 'ffffff', '1d4ed8'], ['answered', 'ffffff', '0e7490'],
    ['flagged', '172b3a', 'ff9500']
  ]) {
    const values = [luminance(foreground), luminance(background)].sort((a,b) => b-a);
    const ratio = (values[0]+.05)/(values[1]+.05);
    assert.ok(ratio >= 4.5, `${name}: ${ratio.toFixed(2)}:1`);
    assert.ok((read('test-bank.html') + read('test-bank-current-attempt-review.js')).includes(`background:#${background}`));
  }
});
test('filled review states retain icons and independent orange flags', () => {
  const review = read('test-bank-current-attempt-review.js');
  assert.match(review, /correct: '\\u2713', incorrect: '\\u2717'/);
  assert.match(review, /r\.revealed \? '<svg/);
  assert.match(review, /\.tb-rnc-flag,\.tb-review-status.flagged\{background:#ff9500;color:#172b3a/);
  assert.match(review, /\.tb-review-gridkey\{color:var\(--ink/);
});
