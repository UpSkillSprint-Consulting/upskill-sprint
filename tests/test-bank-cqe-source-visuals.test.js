'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');
const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const html = read('test-bank.html');
const bank = JSON.parse(JSON.stringify(vm.runInNewContext(html.match(/var CQE_SET3=(\[[\s\S]*?\n\s*\]);/)[1])));
const audit = JSON.parse(read('docs/audits/cqe-set3-source-audit.json'));
const expectedVisuals = [143,170,171,192,244,245,246,247,248,279,316,317,318,319,320,322,323,324,337,338,340,342,343,348,349,371,372,373,391,412,429,460,462,487,508,522,524,525,535,541,542,547,550,555,559,563,566,572,576,578,581,586,592,594,597,599,604,611];

test('all 613 questions have source matches and preserve unique stable identities', () => {
  assert.equal(bank.length, 613);
  assert.equal(new Set(bank.map(q => q.qid)).size, 613);
  assert.equal(new Set(bank.map(q => q.stem)).size, 613);
  assert.equal(audit.questions.length, 613);
  for (const [i, q] of bank.entries()) {
    const match = audit.questions[i];
    assert.equal(match.qid, q.qid);
    assert.equal(match.q, i + 1);
    assert.ok(match.sourceQuestion > 0);
    assert.ok(/^(I|II|III|IV|V|VI|VII|S2)$/.test(match.sourceSection));
    assert.equal(match.pdfPage - match.printedPage, 27);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.ok(q.stem && q.why);
    assert.doesNotMatch(q.stem + q.why, /\uFFFD/);
  }
});

test('every audited figure dependency resolves to a verified original PNG', () => {
  assert.equal(audit.assets.length, 47);
  assert.deepEqual(bank.flatMap((q,i) => q.chart ? [i+1] : []), expectedVisuals);
  const assetByPath = new Map(audit.assets.map(asset => [asset.src, asset]));
  const assigned = audit.assets.flatMap(asset => asset.questions).sort((a,b) => a-b);
  assert.deepEqual(assigned, expectedVisuals);
  for (const asset of audit.assets) {
    const data = fs.readFileSync(path.join(ROOT, asset.src));
    assert.equal(data.subarray(1,4).toString(), 'PNG');
    assert.equal(data.readUInt32BE(16), asset.width);
    assert.equal(data.readUInt32BE(20), asset.height);
    assert.equal(crypto.createHash('sha256').update(data).digest('hex'), asset.sha256);
    assert.ok(asset.cropPoints[2] > asset.cropPoints[0]);
    assert.ok(asset.cropPoints[3] > asset.cropPoints[1]);
  }
  for (const number of expectedVisuals) {
    const q = bank[number-1], asset = assetByPath.get(q.chart.src);
    assert.equal(q.chart.type, 'source-image');
    assert.ok(asset.questions.includes(number));
    assert.equal(audit.questions[number-1].visualAsset, q.chart.src);
    assert.equal(q.chart.width, asset.width);
    assert.equal(q.chart.height, asset.height);
    assert.ok(q.chart.alt.length > 25);
    assert.match(q.chart.src, /\/figure-\d{3}\.png$/, 'full-size URLs do not reveal an answer');
  }
});

test('shared evidence survives isolated question selection and invented sample histories are removed', () => {
  for (const group of [[244,245,525],[246,247,248],[316,317,318],[323,343,576],[324,586],[337,597]]) {
    const first = bank[group[0]-1].chart;
    for (const number of group) assert.deepEqual(bank[number-1].chart, first);
  }
  for (const number of [365,533,549]) assert.equal(bank[number-1].chart, undefined);
  for (const number of expectedVisuals) assert.doesNotMatch(bank[number-1].stem, /using the same (?:data|table|study)|from the same|previous question|previous problem/i);
  assert.match(bank[42-1].stem, /possible solutions/);
  assert.equal(bank[330-1].options[bank[330-1].answer], '2.402');
  assert.equal(bank[596-1].options[bank[596-1].answer], '±2.069');
  assert.match(bank[340-1].why, /3\.89/);
  assert.match(bank[549-1].why, /set to 0/);
  assert.match(bank[599-1].why, /inconsistent/);
});

async function harness() {
  const edge = (await import('data:text/javascript;base64,' + Buffer.from(read('netlify/edge-functions/test-bank-mobile-picker.js')).toString('base64'))).default;
  const response = await edge(new Request('https://upskillsprint.com/test-bank'), {
    next: async () => new Response(html, {headers: {'content-type':'text/html'}})
  });
  const productionHtml = (await response.text()).replace(/<script\b[^>]*src=["'](\/test-bank-[^"'?]+\.js)(?:\?[^"']*)?["'][^>]*>\s*<\/script>/gi,
    (_, src) => '<script>' + read(src.slice(1)).replace(/<\/script/gi, '<\\/script') + '</script>');
  const errors = [], frames = new Set();
  const vc = new VirtualConsole(); vc.on('jsdomError', error => errors.push(error.message));
  let cancel, closing = false;
  const dom = new JSDOM(productionHtml, {url:'https://upskillsprint.com/test-bank', runScripts:'dangerously', pretendToBeVisual:true, virtualConsole:vc,
    beforeParse(w) {
      w.HTMLElement.prototype.scrollIntoView = () => {}; w.scrollTo = w.alert = () => {}; w.confirm = () => true;
      const request = w.requestAnimationFrame.bind(w); cancel = w.cancelAnimationFrame.bind(w);
      w.requestAnimationFrame = callback => {
        if (closing) return 0;
        const id = request(t => { frames.delete(id); if (!closing) callback(t); }); frames.add(id); return id;
      };
      w.cancelAnimationFrame = id => { frames.delete(id); cancel(id); };
    }
  });
  const w = dom.window;
  if (w.document.readyState !== 'complete') await new Promise(resolve => w.addEventListener('load', resolve, {once:true}));
  await new Promise(resolve => w.setTimeout(resolve, 60));
  return {w, errors, close() { w.__TBCurrentAttemptReview?.destroy?.(); closing = true; frames.forEach(cancel); w.close(); }};
}
function click(w, selector) {
  const element = w.document.querySelector(selector); assert.ok(element, selector); element.click();
}
const tick = w => new Promise(resolve => w.setTimeout(resolve, 60));

test('all 58 originals render in the production quiz and review helper with accessible full-size links', async () => {
  const h = await harness();
  try {
    for (const number of expectedVisuals) for (const review of [false,true]) {
      const q = h.w.__TB.EXAMS.cqe.sets[3][number-1];
      const host = h.w.document.createElement('div'); host.innerHTML = h.w.__TB.renderQuestionContent(q, review);
      const image = host.querySelector('img.tb-source-image');
      assert.equal(image.getAttribute('src'), q.chart.src);
      assert.equal(image.alt, q.chart.alt);
      assert.equal(host.querySelectorAll('svg, table').length, 0, 'the exact crop replaces approximations and flattened tables');
      assert.equal(host.querySelector('.tb-source-figure').nextElementSibling.textContent, q.stem);
      assert.equal(host.querySelector('figcaption a').getAttribute('href'), q.chart.src);
    }
    const render = h.w.__TB.renderQuestionChart;
    const good = bank[142].chart;
    assert.equal(render({...good, src:'https://external.test/a.png'}), '');
    assert.equal(render({...good, src:'javascript:alert(1)'}), '');
    assert.equal(render({...good, width:NaN}), '');
    const escaped = render({...good, alt:'<script>alert(1)</script> "quoted"'});
    assert.doesNotMatch(escaped, /<script>/);
    assert.deepEqual(h.errors, []);
  } finally { h.close(); }
});

for (const mode of ['full','quick','focus']) for (const timed of [false,true]) {
  test(`CQE Set 3 ${mode}/${timed?'timed':'untimed'} retains originals through answer reveal, review and retry`, async () => {
    const h = await harness(), w = h.w;
    try {
      // A pool of audited questions makes the random draw deterministic with respect to evidence coverage.
      const exam = w.__TB.EXAMS.cqe;
      exam.sets[3] = exam.sets[3].filter(q => q.chart?.type === 'source-image');
      click(w, '.tb-tile[data-exam="cqe"]');
      click(w, mode === 'full' ? '[data-set="3"]' : `[data-quiz-set-kind="${mode}"][data-quiz-set="3"]`);
      if (mode === 'focus') {
        const area = w.document.querySelector('[data-focusdom]');
        area.value = exam.bok.find(item => item.subs.some(sub => sub.id === 'quant')).domain;
        area.dispatchEvent(new w.Event('change', {bubbles:true}));
      }
      click(w, `[data-timing-kind="${mode}"][data-timed="${timed?1:0}"]`);
      const native = w.document.querySelector(`#tb-overview [data-mode="${mode}"]`);
      if (native) native.click();
      else if (mode === 'full') click(w, '[data-start-full]');
      else if (mode === 'quick') { w.document.querySelector('#f-quick-n').value = '5'; click(w, '[data-start-quick]'); }
      else { click(w, '[data-start-focus]'); w.document.querySelector('#f-subtopic').value='ALL'; w.document.querySelector('#f-n').value='5'; click(w, '#f-startbtn'); }
      const original = w.__TB.getFeedbackSnapshot();
      assert.ok(original.records.length >= 5);
      const first = original.records[0].question;
      assert.equal(w.document.querySelector('.tb-quiz img.tb-source-image').getAttribute('src'), first.chart.src);
      if (!timed) { click(w, '[data-reveal]'); assert.equal(w.document.querySelector('.tb-quiz img.tb-source-image').getAttribute('src'), first.chart.src); }
      else assert.equal(w.document.querySelector('[data-reveal]'), null);
      click(w, `[data-goto="${original.records.length-1}"]`); click(w, '[data-submit]'); await tick(w);
      click(w, '[data-open-review="all"]'); await tick(w);
      assert.equal(w.document.querySelector('.tb-review-card img.tb-source-image').getAttribute('src'), first.chart.src);
      click(w, '[data-retry-missed]'); await tick(w);
      assert.equal(w.document.querySelector('#tb-feedback-loop img.tb-source-image').getAttribute('src'), first.chart.src);
      assert.deepEqual(h.errors, []);
    } finally { h.close(); }
  });
}
