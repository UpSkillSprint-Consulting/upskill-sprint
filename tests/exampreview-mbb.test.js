const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const PAGE = 'exam-preview/mbb.html';
const POOL = 'exam-preview/mbb-questions.json';
const CONSENT = 'Yes, email me when the complete Master Black Belt question bank is available, plus occasional UpSkill Sprint updates. I can unsubscribe at any time.';
const tick = (w, ms = 20) => new Promise(r => w.setTimeout(r, ms));

async function open({tools = ''} = {}) {
  const requests = [], errors = [];
  const html = read(PAGE).replace(/<script\b[^>]*src=[^>]*><\/script>/g, '')
    .replace('</body>', () => tools + '<script>' + read('exam-preview/exam-preview.js') + '</script></body>');
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {url: 'https://upskillsprint.com/exam-preview/mbb', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
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

test('MBB ExamPreview: 20 untimed questions in the real exam markup, free pool only', async () => {
  const t = await open();
  const {d, w, requests} = t;
  assert.equal(d.body.hasAttribute('data-require-auth'), false);
  d.querySelector('[data-ep-start]').click(); await tick(w);
  assert.deepEqual(requests.map(r => r.url), ['/' + POOL]);
  assert.equal(requests[0].init.credentials, 'omit');
  assert.match(d.querySelector('.tb-quizprog').textContent, /Question 1 of 20/);
  assert.equal(d.querySelectorAll('.tb-navcell').length, 20);
  assert.equal(d.querySelector('.tb-timer').textContent, 'Untimed');
  assert.match(d.body.textContent, /Free MBB questions/);
  assert.match(d.querySelector('.tb-qtag').textContent, /· (I|II|III|IV|V|VI)\. /);
  assert.deepEqual(t.errors, []);
  w.close();
});

test('MBB results use the real Master Black Belt Body of Knowledge, then the CTA and waitlist', async () => {
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
  for (const n of ['I. Enterprise-Wide Planning', 'II. Organizational Competencies for Deployment', 'III. Project Portfolio Management', 'IV. Training Design and Delivery', 'V. Coaching and Mentoring Responsibilities', 'VI. Advanced Data Management and Analytic Methods']) assert.ok(text.includes(n), n);
  assert.doesNotMatch(text, /CSSBB|CSSGB|165-question|110-question|Green Belt question bank/);
  assert.equal(d.querySelectorAll('.tb-review-card .tb-explanation').length, 20);
  const cta = d.querySelector('[data-ep-cta]');
  assert.equal(cta.textContent, 'Get the complete Master Black Belt question bank');
  const f = d.querySelector('form[name="exampreview-waitlist"]');
  assert.equal(f.getAttribute('data-netlify'), 'true');
  assert.equal(f.querySelector('input[name="exam"]').value, 'mbb');
  assert.equal(f.querySelector('input[name="exam-name"]').value, 'Lean Six Sigma Master Black Belt (MBB)');
  const box = d.getElementById('ep-consent');
  assert.equal(box.checked, false); assert.equal(box.hasAttribute('checked'), false); assert.equal(box.required, true);
  assert.equal(d.querySelector('label[for="ep-consent"]').textContent.trim(), CONSENT);
  assert.equal(d.getElementById('ep-waitlist').hidden, true);
  cta.click();
  assert.equal(d.getElementById('ep-waitlist').hidden, false);
  w.close();
});

test('MBB pool is original, valid and passes the public-content audit', async () => {
  const pool = JSON.parse(read(POOL));
  assert.equal(pool.examId, 'mbb');
  assert.equal(pool.pool, 'exampreview-free');
  const ids = Object.keys(pool.contents);
  assert.equal(ids.length, 20);
  assert.ok(ids.every(id => /^mbb:exampreview:ep-mbb-\d{2}$/.test(id)));
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
  assert.doesNotMatch(read(PAGE) + read('exam-preview/exam-preview.js'), /test-bank-mbb|MBB_SET|["']?stem["']?\s*:\s*["'`]/);
});

test('MBB SEO, related lessons, entry points, sitemap and privacy', () => {
  const html = read(PAGE);
  const desc = /<meta name="description" content="([^"]+)"/.exec(html)[1];
  assert.ok(desc.length >= 120 && desc.length <= 160);
  assert.match(html, /<link rel="canonical" href="https:\/\/upskillsprint\.com\/exam-preview\/mbb">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ld = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)[1]);
  assert.deepEqual(ld['@graph'].map(n => n['@type']), ['BreadcrumbList', 'Quiz']);
  assert.equal(ld['@graph'][1].url, 'https://upskillsprint.com/exam-preview/mbb');
  assert.equal(ld['@graph'][1].description, desc);
  assert.doesNotMatch(/<main[\s\S]*<\/main>/.exec(html)[0] + /<head>[\s\S]*<\/head>/.exec(html)[0], /CSSBB|CSSGB|Green Belt/);
  const related = /<section class="related-lessons[\s\S]*?<\/section>/.exec(html)[0];
  const links = [...related.matchAll(/href="(\/lessons\/[^"]+)"/g)].map(m => m[1]);
  assert.ok(links.length >= 5);
  for (const l of links) assert.ok(fs.existsSync(path.join(root, l + '.html')), l + ' exists');
  const practice = read('exam-practice.html');
  assert.match(practice, /exam-preview-promo[\s\S]*href="\/exam-preview\/mbb"/);
  assert.match(practice, /id="exam-mbb"[\s\S]*?<a class="exam-card-preview" href="\/exam-preview\/mbb">/);
  assert.match(read('exam-directory.js'), /EXAM_PREVIEWS = \[[^\]]*'mbb'/);
  assert.match(read('privacy.html'), /Lean Six Sigma Master Black Belt/);
  assert.match(read('sitemap.xml'), /https:\/\/upskillsprint\.com\/exam-preview\/mbb</);
});

test('MBB ExamPreview has the real MBB Formulas (Black Belt sheet plus MBB groups), Tables and Calc', async () => {
  const {extractExamToolsJs} = await import('../scripts/build-exampreview.mjs');
  const generated = await extractExamToolsJs(root);
  const page = read('test-bank.html');
  const mbbStart = page.indexOf('  REFS.mbb=REFS.cssbb.concat(['), mbbEnd = page.indexOf('  function factorial(');
  assert.ok(mbbStart > 0 && mbbEnd > mbbStart, 'real MBB sheet found in test-bank.html');
  assert.ok(generated.includes(page.slice(mbbStart, mbbEnd).trim()), 'MBB sheet is lifted verbatim from the real exam');
  assert.match(read(PAGE), /src="\/test-bank-tables\.js"[\s\S]*src="\/exam-preview\/exam-tools\.js"[\s\S]*src="\/exam-preview\/exam-preview\.js"/);
  const t = await open({tools: '<script>' + read('test-bank-tables.js') + '</script><script>' + generated + '</script>'});
  const {d, w, requests, errors} = t;
  d.querySelector('[data-ep-start]').click(); await tick(w);
  const labels = [...d.querySelectorAll('.tb-toolbar .tb-tbtn')].map(b => b.textContent.trim());
  for (const label of ['\u2630 Formulas', '\u25a4 Tables', '\u00f7 Calc']) assert.ok(labels.includes(label), label);
  for (const b of d.querySelectorAll('[data-formulas],[data-tables],[data-calc]')) assert.equal(b.tagName, 'BUTTON');
  d.querySelector('[data-formulas]').click();
  assert.equal(d.getElementById('tb-formulas').hidden, false);
  const refText = d.getElementById('tb-reflist').textContent;
  for (const f of [/Cpk/, /Variance inflation factor/, /D-optimality/, /Mixture constraint/, /Parallel reliability/, /Kappa/, /MAD/, /MSD/, /MAPE/, /Simplex ratio test/, /Internal rate of return/]) assert.match(refText, f);
  d.querySelector('[data-tables]').click(); await tick(w);
  assert.equal(d.getElementById('tb-tables').hidden, false);
  assert.ok(d.querySelector('#tb-tables [data-tbl-mount]').children.length > 0);
  d.querySelector('[data-calc]').click();
  for (const k of ['2', '+', '3']) d.querySelector(`#tb-calc [data-k="${k}"]`).click();
  d.querySelector('#tb-calc [data-act="eq"]').click();
  assert.equal(d.getElementById('tb-calcdisp').textContent, '5');
  for (const r of requests) assert.match(r.url, /^(\/exam-preview\/mbb-questions\.json|\/reference-tables\/[a-z_]+\.json)$/);
  assert.deepEqual(errors, []);
  w.close();
});
