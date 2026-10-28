'use strict';
/* CQA Set 1: bank integrity, 2026 BoK registration and every learner mode. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');
const read = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const tick = w => new Promise(resolve => w.setTimeout(resolve, 55));
async function harness() {
  const edge = (await import('data:text/javascript;base64,' + Buffer.from(read('netlify/edge-functions/test-bank-mobile-picker.js')).toString('base64'))).default;
  const response = await edge(new Request('https://upskillsprint.com/test-bank'), {
    next: async () => new Response(read('test-bank.html'), {headers: {'content-type': 'text/html'}})
  });
  let html = await response.text();
  html = html.replace(/<script\b[^>]*src=["'](\/test-bank-[^"'?]+\.js)(?:\?[^"']*)?["'][^>]*>\s*<\/script>/gi, (tag, src) => {
    return '<script>' + read(src.slice(1)).replace(/<\/script/gi, '<\\/script') + '</script>';
  });
  const errors = [];
  let closeFrames = () => {};
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
    beforeParse(w) {
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.scrollTo = w.alert = () => {};
      w.confirm = () => true;
      const request = w.requestAnimationFrame.bind(w);
      const cancel = w.cancelAnimationFrame.bind(w);
      const frames = new Set();
      let closing = false;
      w.requestAnimationFrame = callback => {
        if (closing) return 0;
        const id = request(time => { frames.delete(id); if (!closing) callback(time); });
        frames.add(id);
        return id;
      };
      w.cancelAnimationFrame = id => { frames.delete(id); cancel(id); };
      closeFrames = () => { closing = true; frames.forEach(cancel); frames.clear(); };
    }
  });
  const w = dom.window;
  if (w.document.readyState !== 'complete') await new Promise(resolve => w.addEventListener('load', resolve, {once: true}));
  await tick(w);
  return {w, errors, close: async () => {
    w.__TBCurrentAttemptReview?.destroy?.();
    closeFrames();
    w.close();
    await Promise.resolve();
  }};
}
function click(w, selector) { const el=w.document.querySelector(selector); assert.ok(el, selector); el.click(); return el; }

function rawBank() {
  const sandbox = {};
  vm.runInNewContext(read('test-bank-cqa-set1.js'), {window: sandbox, globalThis: sandbox, self: sandbox});
  return sandbox.CQA_SET1;
}
const AREAS = {I:'cqa-fundamentals', II:'cqa-process', III:'cqa-competencies', IV:'cqa-program', V:'cqa-tools'};
const WEIGHTS = {'cqa-fundamentals':37, 'cqa-process':45, 'cqa-competencies':30, 'cqa-program':23, 'cqa-tools':15};

test('the CQA Set 1 source bank has 150 valid, unique four-option items', () => {
  const bank = rawBank();
  assert.equal(bank.length, 150);
  assert.equal(new Set(bank.map(q => q.qid)).size, 150, 'unique qids');
  assert.equal(new Set(bank.map(q => q.stem.trim().toLowerCase())).size, 150, 'unique stems');
  for (const q of bank) {
    assert.match(q.qid, /^cqa:set-1:/);
    assert.equal(q.set, 1);
    assert.ok(AREAS[String(q.bok).split('.')[0]], `${q.qid} maps to a 2026 BoK domain`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4, `${q.qid} options are distinct`);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, `${q.qid} answer key is valid`);
    assert.ok(q.stem && q.why, `${q.qid} has a stem and explanation`);
  }
});

test('CQA is registered as a live 150-item, 300-minute exam on the 2026 BoK weights', async () => {
  const h = await harness(), {w} = h;
  try {
    const e = w.__TB.EXAMS.cqa;
    assert.equal(e.bank.length, 150);
    assert.equal(e.sets[1], e.bank);
    assert.equal(e.questions, 150);
    assert.equal(e.minutes, 300);
    assert.equal(e.pass, 70);
    assert.deepEqual(Object.fromEntries(e.bok.map(d => [d.domain, d.weight])), WEIGHTS);
    for (const d of e.bok) assert.ok(w.__TB.DM[d.domain], `${d.domain} has a colour and label`);
    for (const q of e.bank) {
      assert.equal(q.sub, AREAS[q.bok.split('.')[0]], 'each item scores to its BoK domain');
      assert.match(q.topic, /^cqa-/, 'the fine subtopic is kept');
    }
    click(w, '.tb-tile[data-exam="cqa"]');
    assert.doesNotMatch(w.document.querySelector('.tb-tile[data-exam="cqa"]').textContent, /Coming soon/);
    assert.deepEqual(h.errors, []);
  } finally { await h.close(); }
});

for (const [mode, kind, expected] of [['full', 'exam', 150], ['quick', 'quick', null], ['focus', 'focus', null]]) {
  test(`CQA ${mode} mode starts and shows CQA questions`, async () => {
    const h = await harness(), {w} = h;
    try {
      click(w, '.tb-tile[data-exam="cqa"]');
      click(w, `[data-mode="${mode}"]`);
      const s = w.__TB.getFeedbackSnapshot();
      assert.equal(s.examId, 'cqa');
      assert.ok(s.records.length > 0);
      if (expected) assert.equal(s.records.length, expected);
      assert.ok(s.records.every(r => /^cqa:set-1:/.test(r.question.qid)));
      assert.ok(w.document.querySelector('.tb-quiz .tb-opt'), 'answer options render');
      for (const tool of ['data-formulas', 'data-tables', 'data-calc']) assert.ok(w.document.querySelector(`[${tool}]`), `${tool} button present`);
      if (mode === 'full') {
        const byArea = {};
        s.records.forEach(r => { byArea[r.question.sub] = (byArea[r.question.sub] || 0) + 1; });
        /* Set 1 is exactly 150 items, so the full exam uses the whole bank. Its split is 37/45/31/22/15,
           one item off the 2026 BoK (30 Competencies, 23 Program Management). */
        assert.deepEqual(byArea, {'cqa-fundamentals':37, 'cqa-process':45, 'cqa-competencies':31, 'cqa-program':22, 'cqa-tools':15});
      }
      assert.deepEqual(h.errors, []);
    } finally { await h.close(); }
  });
}

test('CQA diagnostic draws two items from each of the five BoK domains', async () => {
  const h = await harness(), {w} = h;
  try {
    click(w, '.tb-tile[data-exam="cqa"]');
    click(w, '[data-diag]');
    const s = w.__TB.getFeedbackSnapshot();
    assert.equal(s.examId, 'cqa');
    assert.equal(s.records.length, 10);
    assert.equal(new Set(s.records.map(r => r.question.sub)).size, 5);
    assert.deepEqual(h.errors, []);
  } finally { await h.close(); }
});
