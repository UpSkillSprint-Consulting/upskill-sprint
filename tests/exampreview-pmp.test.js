const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const PAGE = 'exam-preview/pmp.html';
const POOL = 'exam-preview/pmp-questions.json';
const CONSENT = 'Yes, email me when the complete PMP question bank is available, plus occasional UpSkill Sprint updates. I can unsubscribe at any time.';
const tick = (w, ms = 20) => new Promise(r => w.setTimeout(r, ms));

async function open({tools = ''} = {}) {
  const requests = [], errors = [];
  const html = read(PAGE).replace(/<script\b[^>]*src=[^>]*><\/script>/g, '')
    .replace('</body>', () => tools + '<script>' + read('exam-preview/exam-preview.js') + '</script></body>');
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {url: 'https://upskillsprint.com/exam-preview/pmp', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
    beforeParse(w) {
      w.HTMLElement.prototype.scrollIntoView = () => {};
      let seed = 11; w.__ExamPreviewRandom = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      w.fetch = async (url, init) => {
        requests.push({url: String(url), init});
        if (String(url) !== '/' + POOL) return {ok: false, status: 404, json: async () => ({})};
        return {ok: true, status: 200, json: async () => JSON.parse(read(POOL))};
      };
    }});
  return {w: dom.window, d: dom.window.document, requests, errors};
}

test('PMP ExamPreview: 20 untimed questions in the real exam markup, free pool only', async () => {
  const t = await open();
  const {d, w, requests} = t;
  assert.equal(d.body.hasAttribute('data-require-auth'), false);
  d.querySelector('[data-ep-start]').click(); await tick(w);
  assert.deepEqual(requests.map(r => r.url), ['/' + POOL]);
  assert.equal(requests[0].init.credentials, 'omit');
  assert.match(d.querySelector('.tb-quizprog').textContent, /Question 1 of 20/);
  assert.equal(d.querySelectorAll('.tb-navcell').length, 20);
  assert.equal(d.querySelector('.tb-timer').textContent, 'Untimed');
  assert.match(d.body.textContent, /Free PMP questions/);
  assert.match(d.querySelector('.tb-qtag').textContent, /^(People|Process|Business Environment) · \S/);
  const pool = JSON.parse(read(POOL));
  const q = w.__ExamPreview.state().session.items[0];
  assert.ok(d.querySelector('.tb-qtag').textContent.endsWith(pool.contents[q.id].content.ecoTask), 'ECO task shown like the real exam');
  assert.deepEqual(t.errors, []);
  w.close();
});

test('PMP results use the real PMP domains, then the PMP CTA and waitlist', async () => {
  const t = await open();
  const {d, w} = t;
  d.querySelector('[data-ep-start]').click(); await tick(w);
  const items = w.__ExamPreview.state().session.items;
  items.forEach((q, i) => {
    d.querySelector(`[data-opt="${q.answer}"]`).click();
    d.querySelector(i < items.length - 1 ? '[data-next]' : '[data-submit]').click();
  });
  assert.match(d.querySelector('.tb-score-result strong').textContent, /100% \(20\/20\)/);
  const heads = [...d.querySelectorAll('.tb-domblock .tb-domhead')].map(h => h.textContent);
  assert.equal(heads.length, 3);
  for (const n of ['People', 'Process', 'Business Environment']) assert.ok(heads.some(h => h.includes(n)), n);
  assert.doesNotMatch(d.getElementById('tb-overview').textContent, /Black Belt|CSSBB|165-question/);
  const cta = d.querySelector('[data-ep-cta]');
  assert.equal(cta.textContent, 'Get the complete PMP question bank');
  const f = d.querySelector('form[name="exampreview-waitlist"]');
  assert.equal(f.querySelector('input[name="exam"]').value, 'pmp');
  assert.equal(f.querySelector('input[name="exam-name"]').value, 'Project Management Professional (PMP)');
  const box = d.getElementById('ep-consent');
  assert.equal(box.checked, false); assert.equal(box.hasAttribute('checked'), false); assert.equal(box.required, true);
  assert.equal(d.querySelector('label[for="ep-consent"]').textContent.trim(), CONSENT);
  assert.equal(d.getElementById('ep-waitlist').hidden, true);
  cta.click();
  assert.equal(d.getElementById('ep-waitlist').hidden, false);
  w.close();
});

test('PMP pool is original, valid and passes the public-content audit', async () => {
  const pool = JSON.parse(read(POOL));
  assert.equal(pool.examId, 'pmp');
  assert.equal(pool.pool, 'exampreview-free');
  const ids = Object.keys(pool.contents);
  assert.equal(ids.length, 20);
  assert.ok(ids.every(id => /^pmp:exampreview:ep-pmp-\d{2}$/.test(id)));
  const subs = ids.map(id => pool.contents[id].content.sub);
  assert.deepEqual(['pmp-people', 'pmp-process', 'pmp-business'].map(s => subs.filter(x => x === s).length), [7, 8, 5]);
  const {freePoolProblem} = await import('../scripts/audit-exam-public-content.mjs');
  assert.equal(freePoolProblem(read(POOL), POOL), null);
  assert.match(freePoolProblem(read(POOL), 'exam-preview/cssbb-questions.json'), /non-ExamPreview/);
  const sources = ['test-bank.html', ...fs.readdirSync(root).filter(f => /^test-bank-.*\.js$/.test(f))];
  const paid = sources.flatMap(f => [...read(f).matchAll(/\b(?:q|stem)\s*:\s*"((?:[^"\\]|\\.)*)"/g)].map(m => m[1])).filter(x => x.length > 30);
  const words = s => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(x => x.length > 3));
  const jaccard = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
  const paidSets = paid.map(words);
  for (const id of ids) {
    const s = words(pool.contents[id].content.stem);
    assert.ok(Math.max(...paidSets.map(p => jaccard(s, p))) < 0.5, id + ' overlaps a paid stem');
  }
  assert.doesNotMatch(read(PAGE) + read('exam-preview/exam-preview.js'), /test-bank-pmp-set|["']?stem["']?\s*:\s*["'`]/);
});

test('PMP SEO, entry points, sitemap and privacy', () => {
  const html = read(PAGE);
  const desc = /<meta name="description" content="([^"]+)"/.exec(html)[1];
  assert.ok(desc.length >= 120 && desc.length <= 160);
  assert.match(html, /<link rel="canonical" href="https:\/\/upskillsprint\.com\/exam-preview\/pmp">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ld = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)[1]);
  assert.deepEqual(ld['@graph'].map(n => n['@type']), ['BreadcrumbList', 'Quiz']);
  assert.equal(ld['@graph'][1].url, 'https://upskillsprint.com/exam-preview/pmp');
  assert.equal(ld['@graph'][1].description, desc);
  assert.doesNotMatch(/<main[\s\S]*<\/main>/.exec(html)[0] + /<head>[\s\S]*<\/head>/.exec(html)[0], /CSSBB|Black Belt|Six Sigma/);
  const practice = read('exam-practice.html');
  assert.match(practice, /exam-preview-promo[\s\S]*href="\/exam-preview\/pmp"/);
  assert.match(practice, /id="exam-pmp"[\s\S]*?<a class="exam-card-preview" href="\/exam-preview\/pmp">/);
  assert.match(read('privacy.html'), /Project Management Professional/);
  assert.match(read('sitemap.xml'), /https:\/\/upskillsprint\.com\/exam-preview\/pmp</);
});

test('PMP ExamPreview shows the real PMP formula sheet, Tables and Calc', async () => {
  const {extractExamToolsJs} = await import('../scripts/build-exampreview.mjs');
  const generated = await extractExamToolsJs(root);
  assert.match(read(PAGE), /src="\/assets\/js\/math\.js"[\s\S]*src="\/exam-preview\/test-bank-pmp-formulas\.js"[\s\S]*src="\/exam-preview\/exam-tools\.js"[\s\S]*src="\/exam-preview\/exam-preview\.js"/);
  const t = await open({tools: ['test-bank-tables.js', 'test-bank-pmp-formulas.js'].map(f => '<script>' + read(f) + '</script>').join('') + '<script>' + generated + '</script>'});
  const {d, w, requests, errors} = t;
  d.querySelector('[data-ep-start]').click(); await tick(w);
  const labels = [...d.querySelectorAll('.tb-toolbar .tb-tbtn')].map(b => b.textContent.trim());
  for (const label of ['\u2630 Formulas', '\u25a4 Tables', '\u00f7 Calc']) assert.ok(labels.includes(label), label);
  d.querySelector('[data-formulas]').click();
  const pane = d.getElementById('tb-formulas');
  assert.equal(pane.hidden, false);
  assert.equal(pane.querySelector('.tb-refnote').textContent, 'Practice lookup. The real PMP exam does not provide this sheet.');
  assert.match(d.getElementById('tb-reflist').innerHTML, /pmp-formula-encyclopedia/);
  assert.doesNotMatch(d.getElementById('tb-reflist').textContent, /Cpk/);
  // The sheet follows the current question, as in the real exam.
  const items = w.__ExamPreview.state().session.items;
  const k = items.findIndex(q => q.sub === 'pmp-process');
  for (let i = 0; i < k; i++) d.querySelector('[data-next]').click();
  assert.match(d.getElementById('tb-reflist').textContent, /Process/);
  d.querySelector('[data-calc]').click();
  for (const key of ['6', '*', '7']) d.querySelector(`#tb-calc [data-k="${key}"]`).click();
  d.querySelector('#tb-calc [data-act="eq"]').click();
  assert.equal(d.getElementById('tb-calcdisp').textContent, '42');
  d.querySelector('[data-tables]').click(); await tick(w);
  assert.equal(d.getElementById('tb-tables').hidden, false);
  for (const r of requests) assert.match(r.url, /^(\/exam-preview\/pmp-questions\.json|\/reference-tables\/[a-z_]+\.json)$/);
  assert.deepEqual(errors, []);
  w.close();
});
