const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
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
  // Exercise delivered question-content scripts, not a mock bank or engine.
  html = html.replace(/<script\b[^>]*src=["'](\/test-bank-[^"'?]+\.js)(?:\?[^"']*)?["'][^>]*>\s*<\/script>/gi, (tag, src) => {
    return '<script>' + read(src.slice(1)).replace(/<\/script/gi, '<\\/script') + '</script>';
  });
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {url: 'https://upskillsprint.com/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
    beforeParse(w) {
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.scrollTo = w.alert = () => {};
      w.confirm = () => true;
    }
  });
  const w = dom.window;
  if (w.document.readyState !== 'complete') await new Promise(resolve => w.addEventListener('load', resolve, {once: true}));
  await tick(w);
  return {w, errors, close: () => w.close()};
}
function start(w, exam, mode) {
  w.document.querySelector(`.tb-tile[data-exam="${exam}"]`).click();
  const actual = mode === 'focused' ? 'focus' : mode;
  const native = w.document.querySelector(`#tb-overview [data-mode="${actual}"]`);
  if (native) native.click();
  else {
    if (mode === 'focused') { w.document.querySelector('[data-start-focus]').click(); w.document.querySelector('#f-subtopic').value = 'ALL'; }
    const count = w.document.querySelector(mode === 'quick' ? '#f-quick-n' : '#f-n');
    if (count) count.value = '5';
    w.document.querySelector(mode === 'focused' ? '#f-startbtn' : mode === 'quick' ? '[data-start-quick]' : '[data-start-full]').click();
  }
  assert.ok(w.document.querySelector('.tb-quiz'), `${exam}/${mode} starts`);
  const data = w.__TB.getFeedbackSnapshot();
  assert.ok(data.records.length >= 3, 'at least three questions for correction coverage');
  return data;
}
function select(w, index, option) {
  w.document.querySelector(`[data-goto="${index}"]`).click();
  w.document.querySelector(`[data-opt="${option}"]`).click();
}
async function finish(w) {
  w.document.querySelector('[data-submit]').click();
  await tick(w);
  assert.ok(w.document.querySelector('[data-score-result], .tb-reshead'));
  assert.equal(w.document.querySelectorAll('#tb-feedback-loop').length, 1, 'exactly one review panel');
}
function click(w, selector) {
  const el = w.document.querySelector(selector);
  assert.ok(el, 'control exists: ' + selector);
  el.click();
}
function score(w) { return w.document.querySelector('[data-score-result], .tb-reshead').textContent; }
const certifications = ['cssbb','cssgb','cssyb','mbb','cmqoe','cqe'];
for (const exam of certifications) for (const mode of ['full','quick','focused']) {
  test(`post-exam review and correction: ${exam}/${mode}`, async () => {
    const h = await harness(), {w} = h;
    try {
      const before = start(w, exam, mode);
      const total = before.records.length;
      // Leave two incorrect and one unanswered, regardless of the native exam size.
      for (let i = 0; i < total - 1; i++) {
        const q = before.records[i].question;
        select(w, i, i < total - 3 ? q.answer : (q.answer + 1) % q.options.length);
      }
      await finish(w);
      const originalScore = score(w);
      click(w, '[data-open-review="all"]');
      assert.equal(w.document.querySelectorAll('.tb-review-card').length, total);
      assert.equal(w.document.querySelectorAll('.tb-review-navcell').length, total);
      assert.equal(w.document.querySelectorAll('.tb-review-card[data-review-status="correct"]').length, total - 3);
      assert.equal(w.document.querySelectorAll('.tb-review-card[data-review-status="incorrect"]').length, 2);
      assert.equal(w.document.querySelectorAll('.tb-review-card[data-review-status="unanswered"]').length, 1);
      for (const [filter, count] of [['missed',3],['incorrect',2],['unanswered',1],['correct',total - 3],['flagged',0]]) {
        click(w, `[data-review-tab="${filter}"]`);
        assert.equal(w.document.querySelectorAll('.tb-review-card').length, count);
      }
      click(w, `[data-review-goto="${total - 1}"]`);
      assert.equal(w.document.querySelectorAll('.tb-review-card').length, 1);
      assert.match(w.document.querySelector('.tb-answer-compare').textContent, /Not answered/);
      assert.equal(w.document.querySelector(`[data-review-goto="${total - 1}"]`).getAttribute('aria-current'), 'true');
      click(w, '[data-retry-missed]');
      assert.equal(w.document.querySelector('[data-retry-check]').disabled, true);
      assert.equal(w.document.querySelector('.tb-retry-feedback'), null, 'answers hidden until checked');
      const missed = before.records.slice(-3);
      for (let i = 0; i < missed.length; i++) {
        const q = missed[i].question;
        click(w, `[data-retry-opt="${i === 0 ? (q.answer + 1) % q.options.length : q.answer}"]`);
        click(w, '[data-retry-check]');
        assert.ok(w.document.querySelector('.tb-retry-feedback'));
        assert.ok([...w.document.querySelectorAll('[data-retry-opt]')].every(b => b.disabled));
        click(w, '[data-retry-next]');
      }
      assert.match(w.document.querySelector('.tb-correction-count').textContent, /2 of 3/);
      click(w, '[data-retry-remaining]');
      assert.match(w.document.querySelector('.tb-retry-head').textContent, /1 of 1/);
      click(w, `[data-retry-opt="${missed[0].question.answer}"]`);
      click(w, '[data-retry-check]'); click(w, '[data-retry-next]');
      assert.match(w.document.querySelector('#tb-retry-panel h3').textContent, /All missed questions corrected/);
      assert.equal(w.document.querySelector('[data-retry-remaining]'), null);
      assert.equal(score(w), originalScore, 'corrections never change the original exam result');
      click(w, '[data-retry-return]');
      assert.equal(w.document.querySelectorAll('.tb-review-card').length, 3, 'review retains original answers');
      click(w, '[data-back]'); await tick(w);
      assert.equal(w.document.querySelector('#tb-feedback-loop'), null);
      assert.deepEqual(h.errors, []);
    } finally { h.close(); }
  });
}
test('perfect, unanswered, retake and certification changes cannot reuse a previous review', async () => {
  const h = await harness(), {w} = h;
  try {
    let data = start(w, 'cssbb', 'quick');
    data.records.forEach((r, i) => select(w, i, r.question.answer));
    await finish(w);
    assert.equal(w.document.querySelector('[data-retry-missed]').disabled, true);
    click(w, '[data-open-review="missed"]');
    assert.match(w.document.querySelector('.tb-review-empty').textContent, /No questions/);
    click(w, '[data-retake]'); await tick(w); await finish(w);
    click(w, '[data-open-review="all"]');
    assert.equal(w.document.querySelectorAll('.tb-review-card[data-review-status="unanswered"]').length, w.__TB.getFeedbackSnapshot().records.length);
    click(w, '[data-back]'); await tick(w);
    data = start(w, 'cqe', 'focused');
    await finish(w); click(w, '[data-open-review="all"]');
    assert.equal(w.document.querySelectorAll('.tb-review-card').length, data.records.length);
    assert.ok(w.document.querySelector('.tb-review-card').textContent.includes(data.records[0].question.options[data.records[0].question.answer]));
    assert.deepEqual(h.errors, []);
  } finally { h.close(); }
});
test('snapshot completion supports flags, visual renderers, safe explanations and independent copies', async () => {
  const h = await harness(), {w} = h;
  try {
    const data = start(w, 'mbb', 'quick');
    await tick(w);
    data.records[0].flagged = true;
    data.records[0].question.why = '<b>Authored explanation</b><img src="javascript:bad" onerror="bad()"><script>bad()</script>';
    const originalRenderer = w.__TB.renderQuestionContent;
    w.__TB.renderQuestionContent = q => '<figure data-test-visual><svg role="img"></svg></figure><div class="tb-review-stem">' + q.stem + '</div>';
    w.document.querySelector('[data-submit]').click();
    w.document.dispatchEvent(new w.CustomEvent('tb:attempt-completed', {detail: data}));
    data.records[0].flagged = false;
    await tick(w);
    click(w, '[data-open-review="all"]'); click(w, '[data-review-tab="flagged"]');
    assert.equal(w.document.querySelectorAll('.tb-review-card').length, 1);
    assert.ok(w.document.querySelector('[data-test-visual] svg'));
    assert.ok(w.document.querySelector('.tb-explanation b'));
    assert.equal(w.document.querySelector('.tb-explanation script, .tb-explanation [onerror], .tb-explanation [src^="javascript:"]'), null);
    const link = w.document.querySelector('.tb-review-lesson');
    assert.equal(link.target, '_blank');
    assert.match(link.rel, /noopener/);
    w.__TB.renderQuestionContent = originalRenderer;
    w.eval(read('test-bank-current-attempt-review.js')); await tick(w);
    assert.equal(w.document.querySelectorAll('#tb-feedback-loop').length, 1, 'initialization is idempotent');
    assert.deepEqual(h.errors, []);
  } finally { h.close(); }
});
test('review is memory-only and the deployed edge injects it exactly once', async () => {
  const source = read('test-bank-current-attempt-review.js');
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|sendBeacon|\bfetch\s*\(|\.rpc\s*\(|__TBVersions/);
  const edgeSource = read('netlify/edge-functions/test-bank-mobile-picker.js');
  const edge = await import('data:text/javascript;base64,' + Buffer.from(edgeSource).toString('base64'));
  const input = '<html><head></head><body><script src="/test-bank-account-sync.js"></script><script src="/test-bank-cssgb-set-1.js"></script></body></html>';
  const run = html => edge.default(new Request('https://upskillsprint.com/test-bank'), {next: async () => new Response(html, {headers: {'content-type':'text/html'}})});
  const first = await (await run(input)).text();
  const second = await (await run(first)).text();
  for (const output of [first, second]) {
    assert.equal((output.match(/src="\/test-bank-current-attempt-review\.js"/g) || []).length, 1);
    assert.match(output, /test-bank-cssgb-set-1\.js/);
    assert.doesNotMatch(output, /test-bank-account-sync\.js/);
  }
});
