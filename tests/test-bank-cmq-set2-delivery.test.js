'use strict';
// Regression guard for the protected delivery path learners actually receive:
// the private CMQ package must carry Sets 2 and 3 and render Set 1, Set 2, the partial Set 3 and Mixed.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.join(__dirname, '..');

test('private CMQ/OE package renders Set 1, Set 2, the partial Set 3 and Mixed', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cmq-set2-delivery-'));
  try {
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (['.git', 'content', 'public-site', 'node_modules'].includes(entry.name)) continue;
      fs.symlinkSync(path.join(root, entry.name), path.join(temp, entry.name), entry.isDirectory() ? 'dir' : 'file');
    }
    const built = await (await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(temp);
    const pkg = JSON.parse(fs.readFileSync(path.join(built.output, 'cmq.json'), 'utf8'));
    assert.ok(pkg.scripts.some(code => code.includes('global.CMQ_SET2=')), 'CMQ package carries the Set 2 bank');
    assert.ok(pkg.scripts.some(code => code.includes('global.CMQ_SET3=')), 'CMQ package carries the Set 3 bank');
    const html = fs.readFileSync(path.join(root, 'test-bank.html'), 'utf8').replace(/<script\b[\s\S]*?<\/script>/gi, '');
    const dom = new JSDOM(html, { url: 'https://upskillsprint.com/test-bank?exam=cmq', runScripts: 'outside-only', pretendToBeVisual: true });
    const w = dom.window;
    w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {} }));
    w.scrollTo = () => {};
    pkg.scripts.forEach(code => w.eval(code));
    w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 300));
    const doc = w.document;
    const full = [...doc.querySelectorAll('#tb-overview .tb-setpick [data-set]')];
    assert.deepEqual(full.map(b => [b.dataset.set, b.querySelector('.tb-sets').textContent, b.disabled]),
      [['1', '166', false], ['2', '165', false], ['3', '120', false], ['mix', '451', false]]);
    for (const kind of ['quick', 'focus']) {
      const quiz = [...doc.querySelectorAll('[data-quiz-set-kind="' + kind + '"]')];
      assert.deepEqual(quiz.map(b => [b.dataset.quizSet, b.disabled]),
        [['1', false], ['2', false], ['3', false], ['mix', false]], kind + ' quiz set choices');
      assert.equal(quiz[3].title, '451 available questions');
    }
    // Set 3 is a partial, batch-released set: it can be chosen and says how many of 165 are live.
    full[2].click();
    await new Promise(resolve => setTimeout(resolve, 50));
    const pressed = [...doc.querySelectorAll('#tb-overview .tb-setpick [data-set][aria-pressed="true"]')].map(b => b.dataset.set);
    assert.deepEqual(pressed, ['3'], 'Set 3 can be the Full Exam set');
    assert.match(doc.querySelector('#tb-overview .tb-setnote').textContent, /120 of 165 planned questions/);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
