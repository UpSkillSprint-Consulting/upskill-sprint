const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const PAGE = 'exam-preview/nppe.html';
const POOL = 'exam-preview/nppe-questions.json';
const CONSENT = 'Yes, email me when the complete NPPE question bank is available, plus occasional UpSkill Sprint updates. I can unsubscribe at any time.';
const tick = (w, ms = 20) => new Promise(r => w.setTimeout(r, ms));

async function open({tools = ''} = {}) {
  const requests = [], errors = [];
  const html = read(PAGE).replace(/<script\b[^>]*src=[^>]*><\/script>/g, '')
    .replace('</body>', () => tools + '<script>' + read('exam-preview/exam-preview.js') + '</script></body>');
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {url: 'https://upskillsprint.com/exam-preview/nppe', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
    beforeParse(w) {
      w.HTMLElement.prototype.scrollIntoView = () => {};
      let seed = 13; w.__ExamPreviewRandom = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      w.fetch = async (url, init) => {
        requests.push({url: String(url), init});
        if (String(url) !== '/' + POOL) return {ok: false, status: 404, json: async () => ({})};
        return {ok: true, status: 200, json: async () => JSON.parse(read(POOL))};
      };
    }});
  return {w: dom.window, d: dom.window.document, requests, errors};
}

test('NPPE ExamPreview: 20 untimed questions in the real exam markup, free pool only', async () => {
  const t = await open();
  const {d, w, requests} = t;
  assert.equal(d.body.hasAttribute('data-require-auth'), false);
  d.querySelector('[data-ep-start]').click(); await tick(w);
  assert.deepEqual(requests.map(r => r.url), ['/' + POOL]);
  assert.equal(requests[0].init.credentials, 'omit');
  assert.match(d.querySelector('.tb-quizprog').textContent, /Question 1 of 20/);
  assert.equal(d.querySelectorAll('.tb-navcell').length, 20);
  assert.equal(d.querySelector('.tb-timer').textContent, 'Untimed');
  assert.match(d.body.textContent, /Free NPPE questions/);
  assert.match(d.querySelector('.tb-qtag').textContent, /· (I|II|III|IV|V|VI)\. /);
  assert.deepEqual(t.errors, []);
  w.close();
});

test('NPPE results use the six NPPE blueprint areas, then the CTA and waitlist', async () => {
  const t = await open();
  const {d, w} = t;
  d.querySelector('[data-ep-start]').click(); await tick(w);
  const items = w.__ExamPreview.state().session.items;
  items.forEach((q, i) => {
    d.querySelector(`[data-opt="${q.answer}"]`).click();
    d.querySelector(i < items.length - 1 ? '[data-next]' : '[data-submit]').click();
  });
  assert.match(d.querySelector('.tb-score-result strong').textContent, /100% \(20\/20\)/);
  assert.equal(d.querySelectorAll('.tb-domblock').length, 6);
  const text = d.getElementById('tb-overview').textContent;
  for (const n of ['I. Professionalism', 'II. Ethics', 'III. Professional Practice', 'IV. Law for Professional Practice', 'V. Professional Law', 'VI. Regulation of Members & Discipline Processes']) assert.ok(text.includes(n), n);
  assert.doesNotMatch(text, /CSSBB|CSSGB|MBB|CQE|CQA|Black Belt|Quality Engineer|Quality Auditor|165-question|160-question|150-question/);
  assert.equal(d.querySelectorAll('.tb-review-card .tb-explanation').length, 20);
  const cta = d.querySelector('[data-ep-cta]');
  assert.equal(cta.textContent, 'Get the complete NPPE question bank');
  const f = d.querySelector('form[name="exampreview-waitlist"]');
  assert.equal(f.getAttribute('data-netlify'), 'true');
  assert.equal(f.querySelector('input[name="exam"]').value, 'nppe');
  assert.equal(f.querySelector('input[name="exam-name"]').value, 'National Professional Practice Examination (NPPE)');
  const box = d.getElementById('ep-consent');
  assert.equal(box.checked, false); assert.equal(box.hasAttribute('checked'), false); assert.equal(box.required, true);
  assert.equal(d.querySelector('label[for="ep-consent"]').textContent.trim(), CONSENT);
  assert.equal(d.getElementById('ep-waitlist').hidden, true);
  cta.click();
  assert.equal(d.getElementById('ep-waitlist').hidden, false);
  w.close();
});

test('NPPE pool is original, valid and passes the public-content audit', async () => {
  const pool = JSON.parse(read(POOL));
  assert.equal(pool.examId, 'nppe');
  assert.equal(pool.pool, 'exampreview-free');
  const ids = Object.keys(pool.contents);
  assert.equal(ids.length, 20);
  assert.ok(ids.every(id => /^nppe:exampreview:ep-nppe-\d{2}$/.test(id)));
  const {freePoolProblem} = await import('../scripts/audit-exam-public-content.mjs');
  assert.equal(freePoolProblem(read(POOL), POOL), null);
  assert.match(freePoolProblem(read(POOL), 'exam-preview/cssbb-questions.json'), /non-ExamPreview/);
  const sources = ['test-bank.html', ...fs.readdirSync(root).filter(f => /^test-bank-.*\.js$/.test(f))];
  const paid = sources.flatMap(f => [...read(f).matchAll(/\b(?:q|stem)\s*:\s*"((?:[^"\\]|\\.)*)"/g)].map(m => m[1])).filter(x => x.length > 30);
  const words = s => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(x => x.length > 3));
  const jaccard = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
  const paidSets = paid.map(words);
  for (const id of ids) {
    const stem = pool.contents[id].content.stem;
    assert.ok(!paid.includes(stem), id + ' duplicates a paid stem');
    const s = words(stem), max = Math.max(...paidSets.map(p => jaccard(s, p)));
    assert.ok(max < 0.5, `${id} overlaps a paid stem (${max.toFixed(2)})`);
  }
  assert.doesNotMatch(read(PAGE) + read('exam-preview/exam-preview.js'), /test-bank-nppe|NPPE_SET|["']?stem["']?\s*:\s*["'`]/);
});

test('NPPE SEO, related lessons, entry points, sitemap and privacy', () => {
  const html = read(PAGE);
  const desc = /<meta name="description" content="([^"]+)"/.exec(html)[1];
  assert.ok(desc.length >= 120 && desc.length <= 160);
  assert.match(html, /<link rel="canonical" href="https:\/\/upskillsprint\.com\/exam-preview\/nppe">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ld = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)[1]);
  assert.deepEqual(ld['@graph'].map(n => n['@type']), ['BreadcrumbList', 'Quiz']);
  assert.equal(ld['@graph'][1].url, 'https://upskillsprint.com/exam-preview/nppe');
  assert.equal(ld['@graph'][1].description, desc);
  assert.doesNotMatch(/<main[\s\S]*<\/main>/.exec(html)[0] + /<head>[\s\S]*<\/head>/.exec(html)[0], /CSSBB|CSSGB|Black Belt|MBB|CQE|CQA|Quality Engineer|Quality Auditor/);
  const related = /<section class="related-lessons[\s\S]*?<\/section>/.exec(html)[0];
  const links = [...related.matchAll(/href="(\/lessons\/[^"]+)"/g)].map(m => m[1]);
  assert.ok(links.length >= 5);
  for (const l of links) assert.ok(fs.existsSync(path.join(root, l + '.html')), l + ' exists');
  const practice = read('exam-practice.html');
  assert.match(practice, /exam-preview-promo[\s\S]*href="\/exam-preview\/nppe"/);
  assert.match(practice, /id="exam-nppe"[\s\S]*?<a class="exam-card-preview" href="\/exam-preview\/nppe">/);
  assert.match(read('exam-directory.js'), /EXAM_PREVIEWS = \[[^\]]*'nppe'/);
  assert.match(read('privacy.html'), /National Professional Practice Examination/);
  assert.match(read('sitemap.xml'), /https:\/\/upskillsprint\.com\/exam-preview\/nppe</);
});

test('NPPE ExamPreview shows no tool buttons: no Formulas, Tables or Calc, as the NPPE supplies none', async () => {
  assert.doesNotMatch(read(PAGE), /exam-tools\.js|test-bank-tables\.js|test-bank-formulas\.js|pmp-formulas/);
  const {extractExamToolsJs} = await import('../scripts/build-exampreview.mjs');
  // Even with the shared tools script present, the nppe config hides every tool.
  const t = await open({tools: '<script>' + await extractExamToolsJs(root) + '</script>'});
  const {d, w, errors} = t;
  d.querySelector('[data-ep-start]').click(); await tick(w);
  const labels = [...d.querySelectorAll('.tb-toolbar .tb-tbtn')].map(b => b.textContent.trim());
  assert.ok(!labels.some(l => /Formulas|Tables|Calc/.test(l)), labels.join(', '));
  for (const sel of ['[data-calc]', '[data-formulas]', '[data-tables]', '#tb-calc', '#tb-formulas', '#tb-tables']) assert.equal(d.querySelector(sel), null, sel);
  assert.deepEqual(errors, []);
  w.close();
});

test('the calc option is opt-in: other ExamPreviews and the paid exam keep Calc', () => {
  assert.match(read('exam-preview/exam-preview.js'), /CFG\.calc === false \? '' : '<button type="button" class="tb-tbtn" data-calc>/);
  assert.match(read('test-bank.html'), /data-calc/);
});

test('NPPE explanations keep the printed handbook page citation as a block-level source reference', async () => {
  const pool = JSON.parse(read(POOL));
  for (const [id, v] of Object.entries(pool.contents)) {
    assert.match(v.content.why, /<b>Blueprint:<\/b> (?:I|II|III|IV|V|VI)\.\d+\. See pp?\. \d+(?:–\d+)?(?: and \d+(?:–\d+)?)?\. <span class="tb-source-ref">Source: Andrews, Shaw &amp; McPhee, <i>Canadian Professional Engineering and Geoscience: Practice and Ethics<\/i>, 6th ed\. \(2019\), pp?\. \d+(?:–\d+)?(?: and \d+(?:–\d+)?)?\.<\/span>$/, id);
  }
  assert.match(read('exam-preview/exam-preview.css'), /body\[data-exam-preview="nppe"\] \.tb-source-ref\{display:block/);
  const t = await open();
  const {d, w} = t;
  d.querySelector('[data-ep-start]').click(); await tick(w);
  d.querySelector('[data-reveal]').click();
  const ref = d.querySelector('#tb-revealed-answer .tb-source-ref');
  assert.ok(ref, 'revealed answer shows the source reference');
  assert.equal(ref.attributes.length, 1);
  assert.match(ref.textContent, /^Source: Andrews, Shaw & McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed\. \(2019\), pp?\. \d+/);
  w.__ExamPreview.submit();
  assert.equal(d.querySelectorAll('.tb-review-card .tb-explanation .tb-source-ref').length, 20);
  w.close();
});

test('the NPPE source-reference span cannot carry other markup or attributes', async () => {
  const t = await open();
  const {d, w} = t;
  d.querySelector('[data-ep-start]').click(); await tick(w);
  const q = w.__ExamPreview.state().session.items[0];
  q.why = 'x <span class="tb-source-ref" onclick="alert(1)" style="color:red">ok</span> <span class="evil">y</span> <img src=x onerror=alert(1)>';
  d.querySelector('[data-reveal]').click();
  const box = d.getElementById('tb-revealed-answer');
  assert.equal(box.querySelectorAll('img, .evil, [onclick], [style]').length, 0);
  assert.equal(box.querySelectorAll('span.tb-source-ref').length, 1);
  w.close();
});
