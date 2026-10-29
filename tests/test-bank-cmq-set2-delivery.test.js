'use strict';
// Regression guard for the protected delivery path learners actually receive:
// the private CMQ package must carry Set 2 and render Set 1, Set 2 and Mixed.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');

test('private CMQ/OE package renders Set 1, Set 2 and Mixed selectors', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cmq-set2-delivery-'));
  try {
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (['.git', 'content', 'public-site', 'node_modules'].includes(entry.name)) continue;
      fs.symlinkSync(path.join(root, entry.name), path.join(temp, entry.name), entry.isDirectory() ? 'dir' : 'file');
    }
    const built = await (await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
    const pkg = JSON.parse(fs.readFileSync(path.join(built.output, 'cmq.json'), 'utf8'));
    assert.ok(pkg.scripts.some(code => code.includes('global.CMQ_SET2=')), 'CMQ package carries the Set 2 bank');
    const html = fs.readFileSync(path.join(root, 'test-bank.html'), 'utf8').replace(/<script\b[\s\S]*?<\/script>/gi, '');
    const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank?exam=cmq', runScripts: 'outside-only', pretendToBeVisual: true });
    const w = dom.window;
    w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {} }));
    w.scrollTo = () => {};
    pkg.scripts.forEach(code => w.eval(code));
    w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 300));
    const buttons = [...w.document.querySelectorAll('#tb-overview .tb-setpick [data-set]')];
    assert.deepEqual(buttons.map(b => b.dataset.set), ['1', '2', 'mix']);
    assert.ok(buttons.every(b => !b.disabled), 'all three sets are selectable');
    assert.equal(buttons[1].querySelector('.tb-sets').textContent, String(w.CMQ_SET2.length));
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
