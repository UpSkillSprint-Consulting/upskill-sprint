const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const PAGE = 'exam-preview/cssbb.html';
const POOL = 'exam-preview/cssbb-questions.json';
const CONSENT = 'Yes, email me when the complete Black Belt question bank is available, plus occasional UpSkill Sprint updates. I can unsubscribe at any time.';
const tick = (w, ms = 20) => new Promise(r => w.setTimeout(r, ms));

async function open({failFetch = false, tools = ''} = {}) {
  // Inline only the ExamPreview engine. Site chrome scripts are not needed, and
  // fetch is stubbed so any request other than the free pool fails loudly.
  const requests = [];
  // The engine is deferred in the page, so run it after the body has parsed.
  const html = read(PAGE).replace(/<script\b[^>]*src=[^>]*><\/script>/g, '')
    .replace('</body>', () => tools + '<script>' + read('exam-preview/exam-preview.js') + '</script></body>');
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {url: 'https://upskillsprint.com/exam-preview/cssbb', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole,
    beforeParse(w) {
      w.HTMLElement.prototype.scrollIntoView = () => {};
      let seed = 7; w.__ExamPreviewRandom = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      w.fetch = async (url, init) => {
        requests.push({url: String(url), init});
        if (failFetch || String(url) !== '/exam-preview/cssbb-questions.json') return {ok: false, status: 404, json: async () => ({})};
        return {ok: true, status: 200, json: async () => JSON.parse(read(POOL))};
      };
    }});
  return {dom, w: dom.window, d: dom.window.document, requests, errors};
}
async function finish(t, pick = q => q.answer) {
  const {w, d} = t;
  d.querySelector('[data-ep-start]').click(); await tick(w);
  const n = w.__ExamPreview.state().session.items.length;
  for (let i = 0; i < n; i++) {
    const q = w.__ExamPreview.state().session.items[i];
    const choice = pick(q, i);
    if (choice != null) d.querySelector(`[data-opt="${choice}"]`).click();
    d.querySelector(i < n - 1 ? '[data-next]' : '[data-submit]').click();
  }
  return n;
}

test('ExamPreview loads without sign-in and requests only the free pool', async () => {
  const t = await open();
  const {d, w, requests} = t;
  assert.equal(d.body.hasAttribute('data-require-auth'), false);
  assert.equal(d.body.hasAttribute('data-required-access'), false);
  assert.doesNotMatch(read(PAGE), /require-auth\.js|exam-access-loader|supabase|exam-content/i);
  const code = read('exam-preview/exam-preview.js').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
  assert.doesNotMatch(code, /exam-content|supabase|access_token|Authorization/i);
  d.querySelector('[data-ep-start]').click(); await tick(w);
  assert.deepEqual(requests.map(r => r.url), ['/exam-preview/cssbb-questions.json']);
  assert.equal(requests[0].init.credentials, 'omit');
  assert.ok(d.querySelector('.tb-quiz .tb-opt'), 'question renders for an anonymous visitor');
  assert.deepEqual(t.errors, []);
  w.close();
});

test('ExamPreview serves exactly 20 untimed questions in the real exam markup', async () => {
  const t = await open();
  const {d, w} = t;
  d.querySelector('[data-ep-start]').click(); await tick(w);
  assert.match(d.querySelector('.tb-quizprog').textContent, /Question 1 of 20/);
  assert.equal(d.querySelectorAll('.tb-navcell').length, 20);
  assert.equal(d.querySelector('.tb-timer').textContent, 'Untimed');
  for (const cls of ['.tb-quiz', '.tb-quiztop', '.tb-toolbar', '.tb-progress', '.tb-qtag', '.tb-stem', '.tb-quizfoot', '.tb-status-key', '[data-flag]', '[data-reveal]'])
    assert.ok(d.querySelector(cls), cls + ' (from test-bank.html quizHTML) is present');
  assert.equal(d.querySelectorAll('.tb-opt').length, 4);
  assert.ok(d.querySelector('fieldset.tb-ep-question > legend.tb-stem'), 'each question is a fieldset with a legend');
  assert.equal(d.getElementById('ep-live').getAttribute('aria-live'), 'polite');
  const pool = JSON.parse(read(POOL));
  assert.equal(Object.keys(pool.contents).length, 20);
  w.close();
});

test('the CTA and waitlist appear only after results and explanations', async () => {
  const t = await open();
  const {d, w} = t;
  const form = () => d.getElementById('ep-waitlist');
  assert.equal(form().hidden, true);
  assert.equal(d.querySelector('[data-ep-cta]'), null);
  d.querySelector('[data-ep-start]').click(); await tick(w);
  assert.equal(d.querySelector('[data-ep-cta]'), null, 'no CTA during the quiz');
  assert.equal(form().hidden, true);
  for (let i = 0; i < 19; i++) d.querySelector('[data-next]').click();
  d.querySelector('[data-submit]').click();
  const cta = d.querySelector('[data-ep-cta]');
  assert.ok(cta);
  assert.equal(cta.textContent, 'Get the complete Black Belt question bank');
  const score = d.querySelector('.tb-score-result'), review = d.getElementById('tb-feedback-loop');
  assert.ok(score && review);
  assert.equal(d.querySelectorAll('.tb-review-card .tb-explanation').length, 20);
  assert.ok(score.compareDocumentPosition(cta) & w.Node.DOCUMENT_POSITION_FOLLOWING);
  assert.ok(review.compareDocumentPosition(cta) & w.Node.DOCUMENT_POSITION_FOLLOWING, 'CTA follows the explanations');
  assert.equal(form().hidden, true, 'form stays hidden until the CTA is selected');
  cta.click();
  assert.equal(form().hidden, false);
  assert.equal(cta.getAttribute('aria-expanded'), 'true');
  w.close();
});

test('waitlist is a Netlify form with consent unchecked by default and the approved wording', async () => {
  const t = await open();
  const {d, w} = t;
  const f = d.querySelector('form[name="exampreview-waitlist"]');
  assert.equal(f.getAttribute('data-netlify'), 'true');
  assert.equal(f.querySelector('input[name="form-name"]').value, 'exampreview-waitlist');
  assert.equal(f.getAttribute('method'), 'POST');
  const box = d.getElementById('ep-consent');
  assert.equal(box.type, 'checkbox');
  assert.equal(box.checked, false);
  assert.equal(box.hasAttribute('checked'), false);
  assert.equal(box.required, true);
  assert.equal(d.querySelector('label[for="ep-consent"]').textContent.trim(), CONSENT);
  assert.ok(d.querySelector('label[for="ep-email"] input[type="email"][required]'));
  assert.doesNotMatch(f.outerHTML, /card|payment|price|\$\d/i);
  await finish(t);
  assert.equal(d.getElementById('ep-consent').checked, false, 'still unchecked after the quiz');
  assert.equal(d.getElementById('ep-score-band').value, '80-100');
  w.close();
});

test('results grade answers and reveals like the real exam', async () => {
  const t = await open();
  const {d, w} = t;
  await finish(t, (q, i) => (i < 10 ? q.answer : (q.answer + 1) % 4));
  assert.match(d.querySelector('.tb-score-result strong').textContent, /50% \(10\/20\)/);
  assert.equal(d.querySelectorAll('.tb-review-card[data-review-status="correct"]').length, 10);
  assert.equal(d.querySelectorAll('.tb-domblock').length, 6);
  w.close();
});

test('free pool is original: no paid-bank ids or stems, and the public page carries no paid data', () => {
  const page = read(PAGE) + read('exam-preview/exam-preview.js') + read('exam-preview/exam-preview.css');
  assert.doesNotMatch(page, /cssbb:set-\d|legacy-\d|test-bank-cssbb|CSSBB_BANK|SET2_BANK|SET3_BANK/);
  assert.doesNotMatch(page, /["']?stem["']?\s*:\s*["'`]/, 'no question literals in the page or engine');
  const pool = JSON.parse(read(POOL));
  assert.equal(pool.pool, 'exampreview-free');
  const ids = Object.keys(pool.contents);
  assert.ok(ids.every(id => /^cssbb:exampreview:ep-cssbb-\d{2}$/.test(id)));
  // Paid stems live in the private simulator sources (test-bank.html and the
  // test-bank-*.js banks). Compare against every exam, not just CSSBB.
  const sources = ['test-bank.html', ...fs.readdirSync(root).filter(f => /^test-bank-.*\.js$/.test(f))];
  const paid = sources.flatMap(f => [...read(f).matchAll(/\b(?:q|stem)\s*:\s*"((?:[^"\\]|\\.)*)"/g)].map(m => m[1])).filter(x => x.length > 30);
  assert.ok(paid.length > 150, 'paid stems were found for comparison');
  const words = s => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(x => x.length > 3));
  const jaccard = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
  const paidSets = paid.map(words);
  for (const id of ids) {
    const stem = pool.contents[id].content.stem;
    assert.ok(!paid.includes(stem), id + ' duplicates a paid stem');
    const s = words(stem), max = Math.max(...paidSets.map(p => jaccard(s, p)));
    assert.ok(max < 0.5, `${id} overlaps a paid stem (${max.toFixed(2)})`);
  }
});

test('public-content audit allows only a genuine ExamPreview pool', async () => {
  const {freePoolProblem, FREE_POOL_PATHS} = await import('../scripts/audit-exam-public-content.mjs');
  assert.deepEqual([...FREE_POOL_PATHS], [POOL, 'exam-preview/pmp-questions.json', 'exam-preview/cssgb-questions.json']);
  assert.equal(freePoolProblem(read(POOL), POOL), null);
  assert.match(freePoolProblem(read(POOL), 'exam-preview/pmp-questions.json'), /non-ExamPreview/, 'a pool may hold only its own exam');
  assert.equal(freePoolProblem(read(POOL)), null);
  const forged = JSON.parse(read(POOL));
  forged.contents['cssbb:set-1:legacy-1'] = Object.values(forged.contents)[0];
  assert.match(freePoolProblem(JSON.stringify(forged)), /non-ExamPreview/);
  assert.match(freePoolProblem('{"pool":"paid"}'), /non-ExamPreview/);
});

test('ExamPreview styles are extracted from the real exam sources', async () => {
  const {extractExamUiCss} = await import('../scripts/build-exampreview.mjs');
  const css = await extractExamUiCss(root);
  for (const sel of ['.tb-quiz', '.tb-opt', '.tb-navcell', '.tb-reshead', '.tb-ring', '.tb-review-card', '#tb-feedback-loop'])
    assert.ok(css.includes(sel), sel + ' comes from the real exam styles');
  assert.ok(css.includes(/<style>([\s\S]*?)<\/style>/.exec(read('test-bank.html'))[1].trim()));
  assert.match(read(PAGE), /href="\/exam-preview\/exam-ui\.css"/);
  assert.match(read('package.json'), /stage-public-site\.mjs && node scripts\/build-exampreview\.mjs/);
});

test('ExamPreview SEO, entry points and privacy addition', () => {
  const html = read(PAGE);
  const desc = /<meta name="description" content="([^"]+)"/.exec(html)[1];
  assert.ok(desc.length >= 120 && desc.length <= 160, 'description length ' + desc.length);
  assert.ok(html.includes(`<meta property="og:description" content="${desc}">`));
  assert.match(html, /<link rel="canonical" href="https:\/\/upskillsprint\.com\/exam-preview\/cssbb">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ld = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)[1]);
  const types = ld['@graph'].map(n => n['@type']);
  assert.deepEqual(types, ['BreadcrumbList', 'Quiz']);
  assert.equal(ld['@graph'][1].description, desc);
  assert.equal(ld['@graph'][1].url, 'https://upskillsprint.com/exam-preview/cssbb');
  assert.match(read('exam-practice.html'), /href="\/exam-preview\/cssbb"/);
  assert.match(read('exam-directory.js'), /EXAM_PREVIEWS = \['cssbb','cssgb','pmp'\]/);
  assert.match(read('exam-directory.js'), /EXAM_PREVIEWS\.includes\(row\.exam_key\)&&status!=='granted'[^\n]*'\/exam-preview\/'\+row\.exam_key/);
  const privacy = read('privacy.html');
  assert.match(privacy, /id="exampreview-waitlist"/);
  assert.match(privacy, /we'll act on it within 10 business days\. We never sell your information\./);
  assert.match(read('sitemap.xml'), /https:\/\/upskillsprint\.com\/exam-preview\/cssbb</);
  const related = [...html.matchAll(/<section class="related-lessons[\s\S]*?<\/section>/g)][0][0];
  assert.match(related, /<ul>\s*<li><a href="\/lessons\/lean-six-sigma\/dmaic-formula-encyclopedia">DMAIC Formula Encyclopedia<\/a> — /, 'DMAIC encyclopedia is the first related lesson');
  assert.ok(fs.existsSync(path.join(root, 'lessons/lean-six-sigma/dmaic-formula-encyclopedia.html')));
});

test('ExamPreview has the real exam Formulas, Tables and Calc tools, with no paid or auth calls', async () => {
  const {extractExamToolsJs} = await import('../scripts/build-exampreview.mjs');
  const generated = await extractExamToolsJs(root);
  const page = read('test-bank.html');
  for (const marker of ['REFS={\n    cssbb:[', 'function calcEval(expr){', 'function buildTools(){', 'function toggleTool(name){'])
    assert.ok(page.includes(marker) && generated.includes(marker), marker + ' is lifted from the real exam');
  assert.match(read(PAGE), /src="\/test-bank-tables\.js"[\s\S]*src="\/exam-preview\/exam-tools\.js"[\s\S]*src="\/exam-preview\/exam-preview\.js"/);
  const t = await open({tools: '<script>' + read('test-bank-tables.js') + '</script><script>' + generated + '</script>'});
  const {d, w, requests, errors} = t;
  d.querySelector('[data-ep-start]').click(); await tick(w);
  const labels = [...d.querySelectorAll('.tb-toolbar .tb-tbtn')].map(b => b.textContent.trim());
  for (const label of ['\u2630 Formulas', '\u25a4 Tables', '\u00f7 Calc']) assert.ok(labels.includes(label), label);
  for (const b of d.querySelectorAll('[data-formulas],[data-tables],[data-calc]')) assert.equal(b.tagName, 'BUTTON');
  d.querySelector('[data-formulas]').click();
  assert.equal(d.getElementById('tb-formulas').hidden, false);
  assert.match(d.getElementById('tb-reflist').textContent, /Cpk/);
  d.querySelector('[data-tables]').click(); await tick(w);
  assert.equal(d.getElementById('tb-tables').hidden, false);
  assert.ok(d.querySelector('#tb-tables [data-tbl-mount]').children.length > 0);
  d.querySelector('[data-calc]').click();
  assert.equal(d.getElementById('tb-calc').hidden, false);
  for (const k of ['2', '+', '3']) d.querySelector(`#tb-calc [data-k="${k}"]`).click();
  d.querySelector('#tb-calc [data-act="eq"]').click();
  assert.equal(d.getElementById('tb-calcdisp').textContent, '5');
  d.querySelector('[data-quit]').click();
  for (const id of ['tb-formulas', 'tb-tables', 'tb-calc']) assert.equal(d.getElementById(id).hidden, true, id + ' closes on exit');
  for (const r of requests) assert.match(r.url, /^(\/exam-preview\/cssbb-questions\.json|\/reference-tables\/[a-z_]+\.json)$/);
  assert.ok(!requests.some(r => /exam-content|supabase|\.netlify\/functions/i.test(r.url)));
  assert.deepEqual(errors, []);
});
