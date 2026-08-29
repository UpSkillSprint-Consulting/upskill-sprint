'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const { afterEach } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const cmqScript = fs.readFileSync(path.join(ROOT, 'test-bank-cmq-set1.js'), 'utf8');
const cssgbScript = fs.readFileSync(path.join(ROOT, 'test-bank-cssgb-set1.js'), 'utf8');
const html = fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8')
  .replace('<script src="/test-bank-cmq-set1.js"></script>', `<script>${cmqScript}</script>`)
  .replace('<script src="/test-bank-cssgb-set1.js"></script>', `<script>${cssgbScript}</script>`);

const CERTS = ['CSSBB', 'CSSGB', 'CQE', 'CQA', 'CMQ', 'CRE'];

let _windows = [];
afterEach(() => { _windows.splice(0).forEach(w => { try { w.close(); } catch (e) {} }); });

function loadPage() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/test-bank.html',
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc
  });
  _windows.push(dom.window);
  return new Promise(res => dom.window.addEventListener('load', () => res({ window: dom.window, errors })));
}

/* ---------- site integration & contract ---------- */

test('carries the exact shared controller tags and balanced scripts', () => {
  assert.equal(html.split('<script src="/theme.js"></script>').length - 1, 1);
  assert.equal(html.split('<script src="/site-sections.js"></script>').length - 1, 1);
  assert.equal(html.split('<script').length - 1, html.split('</script>').length - 1);
});

test('uses the standard site shell (header, mobile nav, footer)', async () => {
  const { window } = await loadPage();
  assert.ok(window.document.querySelector('header.site'), 'site header present');
  assert.ok(window.document.querySelector('nav.mobile-nav'), 'mobile nav present');
  assert.ok(window.document.querySelector('footer.site'), 'site footer present');
  assert.ok(window.document.querySelector('link[href="style.css"]'), 'links the site stylesheet');
});

/* ---------- the certification picker (right rail) ---------- */

test('the rail lists all six certifications', async () => {
  const { window } = await loadPage();
  const tiles = Array.from(window.document.querySelectorAll('.tb-tile'));
  assert.equal(tiles.length, 6);
  const badges = tiles.map(t => t.querySelector('.tb-badge').textContent);
  CERTS.forEach(c => assert.ok(badges.includes(c), `rail includes ${c}`));
});

test('only CQA and CRE remain Coming soon; CSSBB, CSSGB, CQE, and CMQ are live', async () => {
  const { window } = await loadPage();
  const tiles = Array.from(window.document.querySelectorAll('.tb-tile'));
  const soon = tiles.filter(t => /Coming soon/.test(t.textContent));
  assert.equal(soon.length, 2, 'two exams still coming soon');
  const cssbb = tiles.find(t => t.dataset.exam === 'cssbb');
  assert.doesNotMatch(cssbb.textContent, /Coming soon/, 'CSSBB is live, not coming soon');
  assert.match(cssbb.textContent, /3 exam sets/i, "tile advertises the set count");
  const cqe = tiles.find(t => t.dataset.exam === 'cqe');
  assert.doesNotMatch(cqe.textContent, /Coming soon/, 'CQE is live now');
  assert.match(cqe.textContent, /3 exam sets/i, "CQE tile advertises the set count");
  const cmq = tiles.find(t => t.dataset.exam === 'cmq');
  assert.doesNotMatch(cmq.textContent, /Coming soon/, 'CMQ/OE is live now');
  assert.match(cmq.textContent, /150 questions/i, 'CMQ/OE tile advertises the full-exam count');
  const cssgb = tiles.find(t => t.dataset.exam === 'cssgb');
  assert.doesNotMatch(cssgb.textContent, /Coming soon/, 'CSSGB is live now');
  assert.match(cssgb.textContent, /110 questions/i, 'CSSGB tile advertises the complete computer-based simulation count');
});

test('CSSBB is backed by the full 165-question bank across all nine ASQ areas', async () => {
  const { window } = await loadPage();
  const e = window.__TB.EXAMS.cssbb;
  assert.equal(e.bank.length, 165, 'the full exam set is loaded');
  const areas = {}; e.bank.forEach(q => { areas[q.sub] = (areas[q.sub] || 0) + 1; });
  assert.deepEqual(areas, { p1: 12, p2: 10, tm: 18, def: 15, mea: 37, ana: 22, imp: 21, con: 17, dfss: 13 }, 'ASQ BoK weighting preserved');
  // every question maps to a real BoK area and has a valid answer
  const units = new Set(window.__TB.subUnits(e).map(u => u.id));
  e.bank.forEach(q => {
    assert.ok(units.has(q.sub), 'question maps to a real area');
    assert.ok(q.answer >= 0 && q.answer < q.options.length, 'valid answer index');
  });
});

/* ---------- adaptive engine ---------- */

test('readiness score spans the range and rewards mastery', async () => {
  const { window } = await loadPage();
  const TB = window.__TB, e = TB.EXAMS.cssbb, units = TB.subUnits(e);
  const right = {}, wrong = {};
  e.bank.forEach((q, i) => { right[i] = q.answer; wrong[i] = (q.answer + 1) % 4; });
  const rR = TB.readiness(units, TB.subAgg(e.bank, right), e.pass);
  const rW = TB.readiness(units, TB.subAgg(e.bank, wrong), e.pass);
  assert.ok(rR.readiness >= 90, 'all-correct is near-certain to pass');
  assert.ok(rW.readiness <= 10, 'all-wrong is near-certain to fail');
  assert.ok(rR.readiness > rW.readiness, 'more mastery => higher readiness');
});

test('the study plan ranks by weakness x BoK weight and allocates study time', async () => {
  const { window } = await loadPage();
  const TB = window.__TB, e = TB.EXAMS.cssbb, units = TB.subUnits(e);
  // miss everything in Measure (the heaviest area, 37/165), ace the rest
  const ans = {};
  e.bank.forEach((q, i) => { ans[i] = (q.sub === 'mea') ? (q.answer + 1) % 4 : q.answer; });
  const plan = TB.studyPlan(units, TB.subAgg(e.bank, ans));
  assert.ok(plan.length > 0, 'plan produced');
  assert.equal(plan[0].id, 'mea', 'the weakest heavy area ranks first');
  assert.ok(plan[0].timePct >= plan[plan.length - 1].timePct, 'time allocation is weakness-weighted');
  const sum = plan.reduce((a, p) => a + p.timePct, 0);
  assert.ok(Math.abs(sum - 100) <= 3, 'time percentages sum to ~100');
  assert.ok(plan[0].lesson && plan[0].lessonName, 'each plan item links to a lesson');
});

test('SM-2 spaced repetition lengthens intervals on success and resets on failure', async () => {
  const { window } = await loadPage();
  const TB = window.__TB;
  const a = TB.sm2(null, 5), b = TB.sm2(a, 5), c = TB.sm2(b, 5);
  assert.equal(a.interval, 1);
  assert.equal(b.interval, 6);
  assert.ok(c.interval > b.interval, 'interval grows with repeated success');
  assert.equal(TB.sm2(c, 1).interval, 1, 'a failed recall resets the interval');
});

test('the placement diagnostic produces a readiness score, a plan, and persists', async () => {
  const { window } = await loadPage();
  window.localStorage.removeItem('tb-adaptive-cssbb');
  const ov = () => window.document.getElementById('tb-overview');
  const click = el => el.dispatchEvent(new window.Event('click', { bubbles: true }));
  click(ov().querySelector('[data-diagtimed="0"]')); // untimed, so no interval
  click(ov().querySelector('[data-diag]'));
  assert.ok(ov().querySelector('.tb-quiz'), 'diagnostic player opens');
  const total = ov().querySelectorAll('.tb-navcell').length;
  assert.ok(total >= 9 && total <= 30, 'a short stratified placement (~18), not the full 165, got ' + total);
  for (let i = 0; i < total; i++) {
    click(ov().querySelectorAll('.tb-opt')[0]);
    const nx = ov().querySelector('[data-next]');
    if (nx) click(nx); else break;
  }
  click(ov().querySelector('[data-submit]'));
  assert.ok(ov().querySelector('.tb-ring.big'), 'readiness ring shown');
  assert.ok(ov().querySelectorAll('.tb-planrow').length > 0, 'study plan shown');
  assert.ok(ov().querySelector('[data-practice2]'), 'weakness-weighted practice offered');
  const st = JSON.parse(window.localStorage.getItem('tb-adaptive-cssbb'));
  assert.equal(st.attempts, 1, 'attempt persisted');
  assert.ok(Object.keys(st.subState).length >= 8, 'per-area SM-2 state persisted');
  assert.ok(typeof st.lastReadiness === 'number', 'readiness persisted');
  click(ov().querySelector('[data-back]'));
  assert.match(ov().textContent, /Readiness \d+%/, 'returning banner shows saved readiness');
});

test('weakness-weighted practice draws from the bank favouring weak subtopics', async () => {
  const { window } = await loadPage();
  const TB = window.__TB, e = TB.EXAMS.cssbb;
  // pretend everything weak in analyze/hyp
  const agg = {}; e.bank.forEach(q => { agg[q.sub] = agg[q.sub] || { c: 0, t: 1 }; });
  agg['hyp'] = { c: 0, t: 2 };
  const picks = TB.weightedPick(e.bank, agg, 8, { hyp: 1 });
  assert.equal(picks.length, 8, 'returns the requested number of questions');
  picks.forEach(q => assert.ok(e.bank.includes(q), 'questions come from the real bank'));
});

/* ---------- the exam overview ---------- */

test('CSSBB offers three live practice modes; coming-soon exams stay gated', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  const click = el => el.dispatchEvent(new window.Event('click', { bubbles: true }));
  const titles = Array.from(ov().querySelectorAll('.tb-mode h4')).map(h => h.textContent);
  assert.equal(titles.length, 3, 'three modes present');
  assert.match(titles[0], /Full Exam/);
  // CSSBB: live launch buttons, no coming-soon on the modes
  const modeBtns = ov().querySelectorAll('[data-mode]');
  assert.equal(modeBtns.length, 3, 'a live Start per mode');
  assert.equal(ov().querySelectorAll('.tb-start').length, 0, 'no coming-soon placeholders on a live exam');
  // a coming-soon exam still gates its modes
  click(window.document.querySelector('.tb-tile[data-exam="cqa"]'));
  assert.equal(ov().querySelectorAll('[data-mode]').length, 0, 'CQA modes are not launchable');
  assert.equal(ov().querySelectorAll('.tb-start').length, 3, 'CQA modes show coming-soon');
});

test('Full Exam toggles between a strict timed limit and untimed', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  const fullSum = () => ov().querySelector('.tb-mode .tb-mode-sum').textContent;
  assert.match(fullSum(), /Strict .* limit/, 'defaults to a strict timed limit');
  ov().querySelector('[data-timed="0"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.match(fullSum(), /No time limit/, 'untimed removes the limit');
});

test('quiz question count is selectable for both quiz types', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  // preset options exist
  assert.ok(ov().querySelector('[data-count="quick"][data-n="10"]'), 'quick quiz has count options');
  assert.ok(ov().querySelector('[data-count="focus"][data-n="50"]'), 'focused quiz has count options');
  ov().querySelector('[data-count="quick"][data-n="30"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.match(ov().querySelectorAll('.tb-mode-sum')[1].textContent, /30 questions/, 'quick count updates');
  ov().querySelector('[data-count="focus"][data-n="50"]').dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.match(ov().querySelectorAll('.tb-mode-sum')[2].textContent, /50 questions/, 'focused count updates');
});

test('Focused Quiz lets you pick any Body-of-Knowledge area', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  const sel = ov().querySelector('[data-focusdom]');
  assert.ok(sel, 'area selector present');
  assert.ok(sel.options.length >= 5, 'populated from the exam BoK domains');
  sel.value = sel.options[1].value;
  sel.dispatchEvent(new window.Event('change'));
  const label = sel.options[1].textContent;
  assert.ok(ov().querySelectorAll('.tb-mode-sum')[2].textContent.includes(label), 'summary reflects the chosen area');
});

test('the overview shows the Body of Knowledge weighting and domains', async () => {
  const { window } = await loadPage();
  const ov = window.document.getElementById('tb-overview');
  assert.ok(ov.querySelector('.tb-weightbar'), 'weighting bar present');
  const segs = ov.querySelectorAll('.tb-weightbar span');
  const domains = ov.querySelectorAll('.tb-dl');
  assert.ok(segs.length >= 5, 'multiple BoK segments');
  assert.equal(segs.length, domains.length, 'legend matches the bar');
});

test('picking a certification switches the overview', async () => {
  const { window } = await loadPage();
  const cre = Array.from(window.document.querySelectorAll('.tb-tile')).find(t => t.dataset.exam === 'cre');
  cre.dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.match(window.document.getElementById('tb-overview').textContent, /Reliability Engineer/);
  // the rail re-renders on selection, so re-query for the active tile
  const active = window.document.querySelector('.tb-tile.active');
  assert.ok(active && active.dataset.exam === 'cre', 'the picked tile is active');
});

test('BoK weightings for each exam sum to 100%', async () => {
  const { window } = await loadPage();
  const tiles = Array.from(window.document.querySelectorAll('.tb-tile'));
  for (const t of tiles) {
    t.dispatchEvent(new window.Event('click', { bubbles: true }));
    const pcts = Array.from(window.document.querySelectorAll('#tb-overview .tb-dl .w'))
      .map(w => parseInt(w.textContent, 10));
    const sum = pcts.reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sum - 100) <= 2, `${t.dataset.exam} weightings ~100% (got ${sum})`);
  }
});

/* ---------- links & errors ---------- */

test('every local .html link on the page resolves to a real file (no dead links)', async () => {
  const { window } = await loadPage();
  const bad = Array.from(window.document.querySelectorAll('a[href]'))
    .map(a => a.getAttribute('href'))
    .filter(h => /\.html$/.test(h))
    .map(h => h.replace(/^\//, '').replace(/#.*$/, ''))
    .filter(rel => !fs.existsSync(path.join(ROOT, rel)));
  assert.deepEqual([...new Set(bad)], [], 'no dead .html links');
});

test('the page loads with no runtime errors', async () => {
  const { errors } = await loadPage();
  assert.deepEqual(errors, []);
});

/* ---------- exam realism (#2) ---------- */

test('the calculator evaluates expressions with correct precedence and functions', async () => {
  const { window } = await loadPage();
  const { calcEval } = window.__TB;
  assert.equal(calcEval('2+3*4'), 14);
  assert.equal(calcEval('(2+3)*4'), 20);
  assert.equal(calcEval('sqrt(16)'), 4);
  assert.equal(calcEval('5!'), 120);
  assert.ok(Math.abs(calcEval('ln(e)') - 1) < 1e-9);
  assert.ok(Math.abs(calcEval('log(1000)') - 3) < 1e-9);
  assert.throws(() => calcEval('2++'), 'invalid input throws');
});

test('a timed diagnostic shows a countdown paced to the real exam', async () => {
  const { window } = await loadPage();
  window.localStorage.removeItem('tb-adaptive-cssbb');
  const ov = () => window.document.getElementById('tb-overview');
  const click = el => el.dispatchEvent(new window.Event('click', { bubbles: true }));
  assert.ok(ov().querySelector('[data-diagtimed="1"]'), 'timing toggle present');
  click(ov().querySelector('[data-diag]'));
  const timer = window.document.getElementById('tb-timer');
  assert.ok(timer, 'countdown timer present');
  assert.match(timer.textContent, /^\d+:\d\d$/, 'shows MM:SS');
  // ~18-question placement at CSSBB pace (270min/165q) ~= 29 min
  const mins = parseInt(timer.textContent, 10);
  assert.ok(mins >= 20 && mins <= 30, 'paced to the exam (~29 min), got ' + mins);
});

test('untimed mode is offered and shows no countdown', async () => {
  const { window } = await loadPage();
  window.localStorage.removeItem('tb-adaptive-cssbb');
  const ov = () => window.document.getElementById('tb-overview');
  const click = el => el.dispatchEvent(new window.Event('click', { bubbles: true }));
  click(ov().querySelector('[data-diagtimed="0"]'));
  click(ov().querySelector('[data-diag]'));
  assert.ok(ov().querySelector('.tb-timer.untimed'), 'untimed label shown, no countdown');
});

test('mark-and-review flags a question in the navigator', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  const click = el => el.dispatchEvent(new window.Event('click', { bubbles: true }));
  click(ov().querySelector('[data-diag]'));
  click(ov().querySelector('[data-flag]'));
  assert.ok(ov().querySelector('.tb-navcell.flag'), 'the question is flagged in the nav grid');
  assert.match(ov().textContent, /1 flagged/, 'the flagged count shows');
});

test('the formula reference drawer opens and search filters it', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  const click = el => el.dispatchEvent(new window.Event('click', { bubbles: true }));
  click(ov().querySelector('[data-diag]'));
  click(ov().querySelector('[data-formulas]'));
  const drawer = window.document.getElementById('tb-formulas');
  assert.ok(drawer && !drawer.hidden, 'drawer opens');
  const all = window.document.querySelectorAll('#tb-reflist .tb-refitem').length;
  assert.ok(all >= 10, 'the sheet has a real set of formulas');
  const search = window.document.getElementById('tb-refsearch');
  search.value = 'cpk';
  search.dispatchEvent(new window.Event('input'));
  const filtered = window.document.querySelectorAll('#tb-reflist .tb-refitem').length;
  assert.ok(filtered > 0 && filtered < all, 'search narrows the list');
});

test('the in-app calculator computes from its keypad and survives navigation', async () => {
  const { window } = await loadPage();
  const ov = () => window.document.getElementById('tb-overview');
  const click = el => el.dispatchEvent(new window.Event('click', { bubbles: true }));
  click(ov().querySelector('[data-diag]'));
  click(ov().querySelector('[data-calc]'));
  const key = label => click(Array.from(window.document.querySelectorAll('.tb-ck')).find(x => x.textContent === label));
  ['(', '2', '+', '3', ')', '\u00d7', '4'].forEach(key);
  click(Array.from(window.document.querySelectorAll('.tb-ck')).find(x => x.getAttribute('data-act') === 'eq'));
  assert.equal(window.document.getElementById('tb-calcdisp').textContent, '20');
  // persists across question navigation (lives in a persistent layer)
  click(ov().querySelector('[data-next]'));
  assert.equal(window.document.getElementById('tb-calc').hidden, false, 'calculator stays open');
  assert.equal(window.document.getElementById('tb-calcdisp').textContent, '20', 'its value is preserved');
});
