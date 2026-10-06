'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const slug = 'confidence-prediction-tolerance-intervals';
const lessonPath = `/lessons/statistics/${slug}`;
const title = 'Confidence vs Prediction vs Tolerance Intervals';
const html = fs.readFileSync(path.join(root, `${lessonPath}.html`), 'utf8');
const staticDoc = new JSDOM(html).window.document;

function open() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const window = new JSDOM(html, {
    runScripts: 'dangerously', virtualConsole, url: `https://upskillsprint.com${lessonPath}`
  }).window;
  return { window, document: window.document, errors, C: window.CPTI };
}
function near(actual, expected, tol, label) {
  assert.ok(Math.abs(actual - expected) <= tol, `${label || ''} ${actual} should be within ${tol} of ${expected}`);
}
function set(window, id, value, type = 'input') {
  const el = window.document.getElementById(id);
  el.value = String(value);
  el.dispatchEvent(new window.Event(type, { bubbles: true }));
}
const text = (doc, id) => doc.getElementById(id).textContent;

test('metadata, head tags, access rule and catalog entry follow the lesson guide', () => {
  assert.match(html, /^<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META/);
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
  assert.equal(meta.title, title);
  assert.equal(meta.slug, slug);
  assert.equal(meta.category, 'Statistics');
  assert.equal(meta.category_slug, 'statistics');
  assert.equal(meta.level, 'Beginner');
  assert.equal(meta.lesson_type, 'General');
  assert.equal(meta.estimated_minutes, 45);
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.suggested_github_path, `lessons/statistics/${slug}.html`);
  assert.ok(new Set(meta.search_keywords).size >= 5);

  const docTitle = staticDoc.title;
  assert.ok(docTitle.endsWith(' | UpSkill Sprint'));
  assert.ok(docTitle.length <= 65, `title is ${docTitle.length} characters`);
  const description = staticDoc.querySelector('meta[name="description"]').content;
  assert.ok(description.length <= 165, `description is ${description.length} characters`);
  const canonical = `https://upskillsprint.com${lessonPath}`;
  assert.equal(staticDoc.querySelector('link[rel="canonical"]').href, canonical);
  assert.equal(staticDoc.querySelector('meta[property="og:url"]').content, canonical);
  assert.equal(staticDoc.querySelector('meta[property="og:title"]').content, docTitle);
  assert.equal(staticDoc.querySelector('meta[property="og:description"]').content, description);
  assert.equal(staticDoc.querySelector('meta[property="og:type"]').content, 'article');
  assert.ok(staticDoc.querySelector('meta[property="og:image"]').content.startsWith('https://'));
  assert.equal(staticDoc.querySelector('meta[name="twitter:card"]').content, 'summary');

  const body = staticDoc.body;
  assert.equal(body.dataset.lessonPage, 'true');
  assert.equal(body.dataset.category, 'statistics');
  assert.equal(body.dataset.level, 'beginner');
  assert.equal(body.dataset.interactive, 'true');
  assert.equal(body.dataset.lessonType, 'general');
  assert.equal(body.hasAttribute('data-require-auth'), false);

  const sql = fs.readFileSync(path.join(root, 'supabase/public-ci-pi-ti-intervals-access.sql'), 'utf8');
  assert.ok(sql.includes(`('lesson:${lessonPath}', 'public', '${title}', true, now())`));
  assert.match(sql, /on conflict \(resource_key\) do update/);
  assert.doesNotMatch(sql, /\b(create|alter|drop|grant)\b/i);

  const catalog = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
  assert.equal(catalog.split("marker: 'data-confidence-prediction-tolerance-intervals'").length, 2);
  const entry = catalog.slice(catalog.indexOf("marker: 'data-confidence-prediction-tolerance-intervals'"));
  const block = entry.slice(0, entry.indexOf('}'));
  assert.match(block, new RegExp(`path: '${lessonPath}'`));
  assert.match(block, /sectionId: 'statistics'/);
  assert.match(block, /topic: 'statistics'/);
  assert.match(block, /level: 'beginner'/);
  assert.match(block, /interactive: 'true'/);
  assert.match(block, /<span>45 min<\/span>/);
  assert.match(block, new RegExp(`title: '${title}'`));
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  assert.ok(catalog.indexOf("marker: 'data-confidence-prediction-tolerance-intervals'") < catalog.indexOf("marker: 'data-beyond-the-bell',"));
});

test('canonical chrome, quiz blocks, math include and page structure are exact', () => {
  const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
  for (const section of ['### 4.1 Header', '### 4.2 Footer', '### 7.1 Quiz styles', '### 7.3 Quiz grader']) {
    const block = guide.slice(guide.indexOf(section)).match(/```html\n([\s\S]*?)\n```/)[1];
    assert.ok(html.includes(block), `must use the exact ${section} block`);
  }
  for (const tag of ['<link rel="stylesheet" href="/style.css">', '<link rel="stylesheet" href="/lessons-theme.css">',
    '<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>', '<script defer src="/assets/js/math.js"></script>']) {
    assert.ok(html.includes(tag), `missing ${tag}`);
  }
  assert.ok(html.indexOf('<script src="/site-sections.js"></script>') < html.indexOf('<script defer src="/assets/js/math.js"></script>'));
  assert.ok(html.indexOf('<link rel="stylesheet" href="/lessons-theme.css">') < html.indexOf('<style id="cpti-lesson-style">'));
  assert.doesNotMatch(html, /window\.MathJax\s*=/, 'new lessons use the shared math include only');
  assert.doesNotMatch(html, /\$\$|\\\$/, 'no dollar-sign math delimiters');
  assert.equal(staticDoc.body.firstElementChild.id, 'mnav-check');
  assert.ok(!html.includes('Skip to lesson content'));
  assert.ok(!html.includes('Want to save your progress and quiz scores for this lesson?'));
  assert.equal(staticDoc.querySelectorAll('main').length, 1);
  assert.equal(staticDoc.querySelectorAll('main#lesson-content').length, 1);
  assert.equal(staticDoc.querySelectorAll('h1').length, 1);
  assert.equal(staticDoc.querySelector('main#lesson-content h1').textContent, title);
  assert.ok(staticDoc.querySelector('main#lesson-content #quiz'), 'quiz sits inside the main landmark');
  assert.equal(staticDoc.querySelectorAll('header.site').length, 1);
  assert.equal(staticDoc.querySelectorAll('footer.site').length, 1);
  const back = staticDoc.querySelector('section[aria-label="Return to lesson category"] a');
  assert.equal(back.getAttribute('href'), '/lessons#statistics');
  assert.match(back.textContent, /Back to Statistics lessons/);
  assert.ok(html.lastIndexOf('<style id="confidence-prediction-tolerance-intervals-dark-overrides">') > html.lastIndexOf('</script>'));

  const ids = [...staticDoc.querySelectorAll('[id]')].map(e => e.id);
  assert.equal(new Set(ids).size, ids.length, 'all ids are unique');
  for (const a of staticDoc.querySelectorAll('a[href^="#"]')) assert.ok(staticDoc.getElementById(a.getAttribute('href').slice(1)));

  let previous = 1;
  for (const h of staticDoc.querySelectorAll('main h1, main h2, main h3, main h4')) {
    const level = Number(h.tagName[1]);
    assert.ok(level <= previous + 1, `heading "${h.textContent}" skips a level`);
    previous = level;
  }

  for (const table of staticDoc.querySelectorAll('main table')) {
    const wrap = table.closest('.table-scroll');
    assert.ok(wrap, 'every table scrolls inside a named region');
    assert.equal(wrap.getAttribute('tabindex'), '0');
    assert.equal(wrap.getAttribute('role'), 'region');
    assert.ok(wrap.getAttribute('aria-label'));
    for (const th of table.querySelectorAll('th')) assert.ok(th.textContent.trim(), 'no empty table headers');
  }
  for (const control of staticDoc.querySelectorAll('main input:not([type="radio"]):not([type="checkbox"]), main select')) {
    assert.ok(staticDoc.querySelector(`label[for="${control.id}"]`), `${control.id} has a label`);
  }
  for (const svg of staticDoc.querySelectorAll('main svg[role="img"]')) {
    assert.equal(svg.querySelectorAll('a, button, input, [tabindex]').length, 0, 'role=img charts contain no focusable content');
    assert.ok(svg.getAttribute('aria-labelledby') && svg.querySelector('title'));
  }
  const css = html.match(/<style id="cpti-lesson-style">([\s\S]*?)<\/style>/)[1];
  const declared = [...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m => m[1]);
  assert.ok(declared.length > 10);
  for (const name of declared) assert.ok(name.startsWith('--cpti-'), `${name} must be namespaced`);
});

test('the Statistics Implementation section has all four required parts', () => {
  const impl = staticDoc.querySelector('#statistics-implementation');
  assert.ok(impl);
  const order = ['excel-functions', 'excel-use-cases', 'minitab-navigation', 'exam-tips'].map(id => {
    const el = impl.querySelector(`#${id}`);
    assert.ok(el, `missing #${id}`);
    return [...impl.querySelectorAll('[id]')].indexOf(el);
  });
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'parts appear in the required order');
  const headers = [...impl.querySelectorAll('table.cpti-fn thead th')].map(th => th.textContent.trim());
  assert.deepEqual(headers, ['Function', 'Syntax', 'Purpose', 'When to use it']);
  const functions = [...impl.querySelectorAll('table.cpti-fn tbody th code')].map(c => c.textContent);
  for (const fn of ['CONFIDENCE.T', 'CONFIDENCE.NORM', 'T.INV.2T', 'T.INV', 'NORM.S.INV', 'CHISQ.INV', 'CHISQ.INV.RT', 'STDEV.S']) {
    assert.ok(functions.includes(fn), `Excel table lists ${fn}`);
  }
  const minitab = impl.querySelector('#minitab-navigation').parentElement.textContent;
  for (const pathText of ['Stat → Basic Statistics → 1-Sample t', 'Stat → Quality Tools → Tolerance Intervals (Normal Distribution)',
    'Stat → Regression → Fitted Line Plot', 'Calc → Probability Distributions → t', 'Stat → Regression → Regression → Predict']) {
    assert.ok(minitab.includes(pathText), `Minitab path ${pathText}`);
  }
});

test('the statistics engine matches reference values (SciPy and Monte Carlo verified)', () => {
  const { window, C, errors } = open();
  const M = C.M;
  near(M.normInv(0.975), 1.959963984540054, 1e-7, 'z 0.975');
  near(M.normInv(0.995), 2.5758293035489, 1e-7, 'z 0.995');
  near(M.tInv(0.975, 19), 2.093024054408309, 1e-7, 't 19');
  near(M.tInv(0.995, 1), 63.65674116287399, 1e-5, 't 1');
  near(M.chi2Inv(0.05, 19), 10.117013063859044, 1e-6, 'chi2 0.05,19');
  near(M.chi2Inv(0.95, 1), 3.841458820694124, 1e-6, 'chi2 0.95,1');
  near(M.k2Howe(20, 0.99, 0.95), 3.617115, 1e-5, 'Howe');
  for (const [n, p, g, k] of [[10, 0.99, 0.95, 4.43691], [20, 0.99, 0.95, 3.62099], [30, 0.95, 0.95, 2.55489],
    [2, 0.95, 0.95, 36.5192], [100, 0.99, 0.99, 3.09757], [5, 0.9, 0.9, 3.49926]]) {
    near(M.k2Exact(n, p, g), k, k * 2e-5, `k2 n=${n}`);
  }
  assert.deepEqual(errors, []);
  window.close();
});

test('every worked-example number in the text agrees with the salmon data', () => {
  const { window, C } = open();
  const data = C.salmon;
  assert.equal(data.length, 20);
  const n = data.length, mean = data.reduce((a, b) => a + b, 0) / n;
  const s = Math.sqrt(data.reduce((a, x) => a + (x - mean) ** 2, 0) / (n - 1));
  near(mean, 5.5, 1e-12, 'mean');
  near(s, 0.8078561622884165, 1e-12, 's');
  const r = C.M.intervals(mean, s, n, 0.95, 0.99);
  const page = staticDoc.querySelector('main').textContent;
  const two = x => x.toFixed(2);
  assert.ok(page.includes(`between ${two(r.ci[0])} kg and ${two(r.ci[1])} kg`));
  assert.ok(page.includes(`between ${two(r.pi[0])} kg and ${two(r.pi[1])} kg`));
  assert.ok(page.includes(`between ${two(r.ti[0])} kg and ${two(r.ti[1])} kg`));
  assert.equal(two(r.ci[0]) + two(r.ci[1]), '5.125.88');
  assert.equal(two(r.pi[0]) + two(r.pi[1]), '3.777.23');
  assert.equal(two(r.ti[0]) + two(r.ti[1]), '2.578.43');
  assert.equal(r.ciHalf.toFixed(4), '0.3781');
  assert.equal(r.piHalf.toFixed(4), '1.7326');
  assert.equal(r.kHowe.toFixed(4), '3.6171');
  assert.equal(r.k.toFixed(3), '3.621');
  assert.equal((mean - r.kHowe * s).toFixed(2) + ' / ' + (mean + r.kHowe * s).toFixed(2), '2.58 / 8.42');
  const useCases = [...staticDoc.querySelectorAll('#excel-use-cases + p + .table-scroll tbody tr')]
    .map(tr => tr.lastElementChild.textContent.trim());
  assert.deepEqual(useCases, ['20', '5.50', s.toFixed(4), r.t.toFixed(4), r.ciHalf.toFixed(4),
    `${two(r.ci[0])} / ${two(r.ci[1])}`, r.piHalf.toFixed(4), `${two(r.pi[0])} / ${two(r.pi[1])}`,
    r.kHowe.toFixed(4), `${two(mean - r.kHowe * s)} / ${two(mean + r.kHowe * s)}`]);
  const minitab = staticDoc.querySelector('#minitab-navigation + .table-scroll').textContent;
  assert.ok(minitab.includes(`(${r.ci[0].toFixed(3)}, ${r.ci[1].toFixed(3)})`));
  assert.ok(minitab.includes(`(${r.ti[0].toFixed(3)}, ${r.ti[1].toFixed(3)})`));
  window.close();
});

test('the Interval Lab responds to sample size, presets, coverage and spec limits', () => {
  const { window, document, C, errors } = open();
  assert.equal(text(document, 'cpti-ci-val'), '5.12 to 5.88 kg');
  assert.equal(text(document, 'cpti-pi-val'), '3.77 to 7.23 kg');
  assert.equal(text(document, 'cpti-ti-val'), '2.57 to 8.43 kg');
  assert.ok(document.querySelectorAll('#cpti-lab-svg rect').length >= 3);
  assert.match(document.querySelector('#cpti-lab-svg title').textContent, /CI 5\.12 to 5\.88/);

  const before = C.lab.last.result;
  set(window, 'cpti-n', 200);
  const after = C.lab.last.result;
  assert.ok(after.ciHalf < before.ciHalf / 3, 'CI collapses with more data');
  assert.ok(after.piHalf > before.piHalf * 0.85, 'PI barely moves');
  assert.ok(after.piHalf > 1.96 * 0.80786, 'PI never drops below its floor');
  assert.ok(after.tiHalf > after.piHalf, 'TI stays widest at 99% coverage');

  set(window, 'cpti-cover', '0.90', 'change');
  assert.ok(C.lab.last.result.piHalf > C.lab.last.result.tiHalf);
  assert.match(text(document, 'cpti-lab-summary'), /PI is wider than the TI/);

  document.querySelector('input[name="cpti-preset"][value="pipe"]').checked = true;
  document.querySelector('input[name="cpti-preset"][value="pipe"]').dispatchEvent(new window.Event('change', { bubbles: true }));
  set(window, 'cpti-cover', '0.99', 'change');
  assert.equal(document.getElementById('cpti-specs').checked, true);
  assert.match(text(document, 'cpti-lab-summary'), /Inside spec/);
  assert.equal(text(document, 'cpti-ti-val'), '7.965 to 8.635 mm');
  set(window, 'cpti-n', 5);
  assert.match(text(document, 'cpti-lab-summary'), /Not shown to be inside spec/);
  assert.equal(document.querySelector('#cpti-lab-summary').className, 'cpti-verdict is-bad');

  document.getElementById('cpti-reset').click();
  assert.equal(document.getElementById('cpti-n').value, '30');
  assert.equal(document.getElementById('cpti-conf').value, '0.95');
  assert.deepEqual(errors, []);
  window.close();
});

test('the width chart and its table show each interval settling at its own floor', () => {
  const { window, document, C, errors } = open();
  C.updateWidthChart();
  const rows = [...document.querySelectorAll('#cpti-width-table tbody tr')].map(tr => [...tr.children].map(c => c.textContent));
  assert.equal(rows.length, 10);
  assert.deepEqual(rows.map(r => r[0]), ['2', '3', '5', '10', '20', '30', '50', '100', '200', '∞']);
  const last = rows[rows.length - 1];
  assert.deepEqual(last.slice(1), ['0', '1.960', '2.576']);
  for (let i = 1; i < rows.length - 1; i++) {
    for (let j = 1; j <= 3; j++) assert.ok(Number(rows[i][j]) < Number(rows[i - 1][j]), 'every multiplier falls as n grows');
  }
  const m20 = C.multipliers(20, 0.95, 0.99);
  near(m20.ci, 2.093024054408309 / Math.sqrt(20), 1e-6);
  near(m20.pi, 2.093024054408309 * Math.sqrt(1.05), 1e-6);
  near(m20.ti, 3.62099, 1e-4);
  assert.equal(document.querySelectorAll('#cpti-width-svg path').length, 3);
  assert.match(document.querySelector('#cpti-width-svg title').textContent, /At n = 20/);
  assert.deepEqual(errors, []);
  window.close();
});

test('the coverage simulator hits each target at the stated long-run rate', () => {
  const { window, document, C, errors } = open();
  C.sim.seed = 20261006;
  C.resetSim();
  assert.equal(text(document, 'cpti-tally-ci'), '0 of 0');
  const tally = C.runSim(4000);
  assert.equal(tally.total, 4000);
  for (const key of ['ci', 'pi', 'ti']) near(tally[key] / tally.total, 0.95, 0.02, `${key} hit rate`);
  assert.match(text(document, 'cpti-tally-ci'), /of 4000 \(/);
  assert.equal(C.sim.rows.length, 20);
  for (const view of ['pi', 'ti']) {
    document.querySelector(`input[name="cpti-sim-view"][value="${view}"]`).checked = true;
    document.querySelector(`input[name="cpti-sim-view"][value="${view}"]`).dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.match(document.querySelector('#cpti-sim-svg title').textContent, new RegExp(`last 20 ${view.toUpperCase()}s`));
  }
  set(window, 'cpti-sim-n', 30, 'change');
  assert.equal(C.sim.tally.total, 0, 'changing settings resets the tally');
  document.getElementById('cpti-sim-many').click();
  assert.equal(C.sim.tally.total, 100);
  assert.deepEqual(errors, []);
  window.close();
});

test('the scenario sorter gives feedback and keeps score', () => {
  const { document, C, errors, window } = open();
  const cards = [...document.querySelectorAll('#cpti-scenarios .cpti-scen')];
  assert.equal(cards.length, 8);
  cards[0].querySelector('button[data-choice="pi"]').click();
  assert.match(cards[0].querySelector('.cpti-scen-fb').textContent, /Not quite\. The answer is CI/);
  assert.equal(cards[0].querySelector('button[data-choice="pi"]').getAttribute('aria-pressed'), 'true');
  C.scenarios.forEach((sc, i) => cards[i].querySelector(`button[data-choice="${sc[1]}"]`).click());
  assert.equal(text(document, 'cpti-scen-score'), 'Score: 8 correct of 8 answered (8 total)');
  assert.deepEqual([...C.scenarios].map(sc => String(sc[1])), ['ci', 'pi', 'ti', 'ci', 'ti', 'pi', 'ci', 'ti']);
  assert.deepEqual(errors, []);
  window.close();
});

test('the quiz emits upskill-quiz-result for unanswered, wrong and all-correct submissions', () => {
  const { window, document, errors } = open();
  const events = [];
  document.addEventListener('upskill-quiz-result', e => events.push({ score: e.detail.score, total: e.detail.total }));
  const answers = ['b', 'c', 'a', 'd', 'b', 'c'];
  assert.equal(document.querySelectorAll('#quiz .quiz-question').length, answers.length);
  document.getElementById('quiz-submit').click();
  assert.deepEqual(events.pop(), { score: 0, total: 6 });
  assert.match(text(document, 'quiz-result'), /6 unanswered/);
  document.querySelector('#quiz-form input[name=q1][value=a]').checked = true;
  document.getElementById('quiz-submit').click();
  assert.deepEqual(events.pop(), { score: 0, total: 6 });
  answers.forEach((value, i) => { document.querySelector(`#quiz-form input[name=q${i + 1}][value=${value}]`).checked = true; });
  document.getElementById('quiz-submit').click();
  assert.deepEqual(events.pop(), { score: 6, total: 6 });
  assert.match(text(document, 'quiz-result'), /Score: 6 \/ 6/);
  for (const q of document.querySelectorAll('.quiz-question')) {
    assert.ok(q.querySelector(`input[value="${q.dataset.answer}"]`), 'every data-answer matches an option');
    assert.ok(q.dataset.explanation.length > 40);
  }
  assert.deepEqual(errors, []);
  window.close();
});
