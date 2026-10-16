'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {JSDOM, VirtualConsole} = require('jsdom');
const ROOT = path.resolve(__dirname, '..');
let workspace, build, packet;
const wait = () => new Promise(resolve => setTimeout(resolve, 70));
const scored = record => record.question.scored !== false && record.question.experimental !== true;

test.before(async () => {
  workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'nppe-policy-'));
  for (const entry of fs.readdirSync(ROOT, {withFileTypes: true})) {
    if (['.git', 'content', 'public-site', 'node_modules'].includes(entry.name)) continue;
    fs.symlinkSync(path.join(ROOT, entry.name), path.join(workspace, entry.name), entry.isDirectory() ? 'dir' : 'file');
  }
  build = await (await import('../scripts/build-exam-delivery.mjs')).buildExamDelivery(workspace);
  packet = JSON.parse(fs.readFileSync(path.join(build.output, 'nppe.json'), 'utf8'));
});
test.after(() => { if (workspace) fs.rmSync(workspace, {recursive: true, force: true}); });

async function harness() {
  const errors = [], console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(build.shell, {
    url: 'https://upskillsprint.com/test-bank?exam=nppe',
    runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: console
  });
  const w = dom.window, d = w.document;
  w.scrollTo = w.alert = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.confirm = () => true;
  const request = w.requestAnimationFrame.bind(w), cancel = w.cancelAnimationFrame.bind(w);
  const frames = new Set();
  let closing = false;
  w.requestAnimationFrame = callback => {
    if (closing) return 0;
    const id = request(time => { frames.delete(id); if (!closing) callback(time); });
    frames.add(id); return id;
  };
  w.cancelAnimationFrame = id => { frames.delete(id); cancel(id); };
  packet.scripts.forEach(source => w.eval(source));
  await wait();
  return {w, d, errors, close() {
    w.__TBCurrentAttemptReview?.destroy?.();
    closing = true; frames.forEach(cancel); frames.clear(); w.close();
  }};
}
function click(d, selector) {
  const el = d.querySelector(selector);
  assert.ok(el, 'Missing control: ' + selector);
  assert.equal(el.disabled, false, 'Disabled control: ' + selector);
  el.click();
}

test('delivered NPPE forms withhold answers in both timing modes and score only eligible items', async parent => {
  const catalog = await harness();
  const exam = catalog.w.__TB.EXAMS.nppe;
  const forms = Array.from(exam.formCatalog)
    .filter(form => ['diagnostic', 'mock'].includes(form.kind) && (exam.forms[form.id] || []).length > 0 && (form.kind !== 'mock' || exam.forms[form.id].length === form.target))
    .map(form => ({id: form.id, owner: form.authorSet, kind: form.kind, count: exam.forms[form.id].length}));
  assert.ok(forms.some(form => form.id === 'set-1-diagnostic'), 'Diagnostic must be covered');
  assert.ok(forms.some(form => form.id === 'mock-d'), 'Mock D must be covered');
  assert.ok(forms.some(form => form.id === 'mock-e'), 'Mock E must be covered');
  catalog.close();
  for (const form of forms) for (const timed of [true, false]) {
    await parent.test(form.id + (timed ? '/timed' : '/untimed'), async () => {
      const h = await harness(), {w, d} = h;
      try {
        click(d, '[data-nppe-owner="' + form.owner + '"]');
        click(d, '[data-set="' + form.id + '"]');
        click(d, '[data-timing-kind="full"][data-timed="' + (timed ? '1' : '0') + '"]');
        click(d, '[data-mode="full"]');
        const original = w.__TB.getFeedbackSnapshot(), records = Array.from(original.records);
        assert.equal(original.setId, form.id);
        assert.equal(records.length, form.count);
        assert.ok(records.every(record => record.question.form === form.id && record.question.authorSet === form.owner));
        assert.equal(d.querySelector('[data-reveal]'), null);
        assert.equal(d.querySelector('#tb-feedback-loop'), null);
        assert.equal(d.querySelector('#tb-revealed-answer'), null);
        assert.equal(w.__TB.revealCurrentAnswer(), false, 'programmatic reveal is denied as well');
        assert.ok(records.every(record => !record.revealed));
        if (!timed) assert.equal(d.querySelector('.tb-timer').textContent, 'Untimed');
        const eligible = records.map((record, index) => ({record, index})).filter(({record}) => scored(record));
        const expectedTotal = form.kind === 'mock' ? 100 : records.length;
        assert.equal(eligible.length, expectedTotal);
        assert.equal(records.length - eligible.length, form.kind === 'mock' ? 10 : 0);
        assert.ok(eligible.length >= 2);
        const first = eligible[0], second = eligible[1];
        click(d, '[data-goto="' + first.index + '"]');
        click(d, '[data-opt="' + first.record.question.answer + '"]');
        click(d, '[data-flag]');
        assert.equal(w.__TB.revealCurrentAnswer(), false);
        click(d, '[data-goto="' + second.index + '"]');
        click(d, '[data-opt="' + ((second.record.question.answer + 1) % 4) + '"]');
        // A correctly answered experimental item must not increase the raw score.
        const experimentalIndex = records.findIndex(record => !scored(record));
        if (experimentalIndex >= 0) {
          click(d, '[data-goto="' + experimentalIndex + '"]');
          click(d, '[data-opt="' + records[experimentalIndex].question.answer + '"]');
        }
        click(d, '[data-goto="' + (records.length - 1) + '"]');
        click(d, '[data-submit]');
        await wait();
        const result = w.__TB.getFeedbackSnapshot();
        assert.equal(result.grading.total, expectedTotal);
        assert.equal(result.grading.correct, 1);
        assert.equal(result.grading.incorrect, 1);
        assert.equal(result.grading.unanswered, expectedTotal - 2);
        assert.equal(result.grading.revealed, 0);
        assert.equal(result.grading.correct + result.grading.incorrect + result.grading.unanswered, expectedTotal);
        assert.match(d.querySelector('[data-score-result]').textContent, new RegExp('\\(1/' + expectedTotal + '\\)'));
        assert.match(d.querySelector('#tb-overview').textContent, /not an official scaled NPPE score/);
        assert.equal(d.querySelectorAll('#tb-feedback-loop').length, 1);
        click(d, '[data-open-review="all"]');
        assert.ok(d.querySelectorAll('.tb-review-card').length > 0, 'post-submission answer review is available');
        assert.equal(d.querySelectorAll('.tb-review-card.revealed').length, 0);
        assert.deepEqual(h.errors, []);
      } finally { h.close(); }
    });
  }
});

// Partial authoring must never turn into a short full mock or borrow a ready form.
test('partial Mock A is visible, disabled and cannot substitute another bank', async () => {
 const h=await harness(), {w,d}=h;
 try {
  const e=w.__TB.EXAMS.nppe;
  assert.equal(e.forms['set-1-mock-a'].length,60);
  assert.equal(e.formCatalog.find(f=>f.id==='set-1-mock-a').target,110);
  const control=d.querySelector('[data-set="set-1-mock-a"]');
  assert.equal(control.disabled,true);
  assert.equal(control.querySelector('.tb-sets').textContent,'60');
  control.dispatchEvent(new w.Event('click'));
  assert.equal(w.__TB.getFeedbackSnapshot(),null);
  assert.equal(d.querySelector('[data-mode="full"]').disabled,true);
  d.querySelector('[data-mode="full"]').dispatchEvent(new w.Event('click'));
  assert.equal(d.querySelector('.tb-quiz'),null);
  assert.equal(e.forms['set-1-learning'].length,120);
  assert.equal(e.forms['set-1-diagnostic'].length,50);
  for(const id of ['mock-d','mock-e'])assert.equal(e.forms[id].length,110);
  assert.deepEqual(h.errors,[]);
 } finally {h.close();}
});
