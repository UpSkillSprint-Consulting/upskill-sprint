const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const slug = 'excel-cube-functions';
const lessonPath = `/lessons/power-bi-excel-sql/${slug}`;
const html = fs.readFileSync(path.join(root, `${lessonPath}.html`), 'utf8');
const assets = path.join(root, 'assets/lessons', slug);
const title = 'Excel CUBE Functions: Beginner to Advanced';

function setup() {
  const dom = new JSDOM(html, { url: `https://upskillsprint.com${lessonPath}`, runScripts: 'outside-only' });
  const { window: w } = dom;
  for (const script of w.document.scripts) {
    if (!script.src && script.type !== 'application/json') w.eval(script.textContent);
  }
  return { dom, w, d: w.document };
}
function choose(w, d, id, value) {
  const el = d.getElementById(id);
  el.value = String(value);
  el.dispatchEvent(new w.Event(id === 'set-n' ? 'input' : 'change', { bubbles: true }));
}
function csvRows() {
  return fs.readFileSync(path.join(assets, 'cube-practice-tests.csv'), 'utf8').trim().split('\n').slice(1).map((line) => {
    const r = line.split(',');
    return [r[0], r[1], r[2], r[3], r[4], Number(r[5]), Number(r[6]), Number(r[7])];
  });
}
function sum(rows, idx, pred = () => true) { return rows.filter(pred).reduce((s, r) => s + r[idx], 0); }

test('lesson is Public, registered in the Power BI, Excel & SQL catalog, and has its access SQL', () => {
  const { dom, d } = setup();
  assert.match(html, /^<!DOCTYPE html>\n<html lang="en">\n<!-- UPSKILLSPRINT_LESSON_META/);
  const meta = JSON.parse(html.match(/<!-- UPSKILLSPRINT_LESSON_META\s*([\s\S]*?)-->/)[1]);
  assert.equal(meta.title, title);
  assert.equal(meta.slug, slug);
  assert.equal(meta.category, 'Power BI, Excel & SQL');
  assert.equal(meta.category_slug, 'power-bi-excel-sql');
  assert.equal(meta.level, 'Beginner');
  assert.equal(meta.interactive, true);
  assert.equal(meta.access_level, 'public');
  assert.equal(meta.estimated_minutes, 90);
  assert.equal(meta.suggested_github_path, `lessons/power-bi-excel-sql/${slug}.html`);
  assert.ok(new Set(meta.search_keywords).size >= 5);
  assert.ok(meta.search_keywords.every((k) => k === k.toLowerCase()));
  assert.equal(d.title, `${title} | UpSkill Sprint`);
  assert.ok(d.title.length <= 65);
  assert.ok(d.querySelector('meta[name="description"]').content.length <= 165);
  assert.equal(d.querySelector('link[rel="canonical"]').href, `https://upskillsprint.com${lessonPath}`);
  assert.equal(d.querySelector('meta[property="og:url"]').content, `https://upskillsprint.com${lessonPath}`);
  assert.equal(d.querySelector('meta[property="og:title"]').content, d.title);
  assert.equal(d.body.dataset.category, 'power-bi-excel-sql');
  assert.equal(d.body.dataset.level, 'beginner');
  assert.equal(d.body.dataset.interactive, 'true');
  assert.equal(d.body.hasAttribute('data-require-auth'), false);

  const sql = fs.readFileSync(path.join(root, 'supabase/public-excel-cube-functions-access.sql'), 'utf8');
  assert.ok(sql.includes(`'lesson:${lessonPath}', 'public', '${title}'`));
  assert.match(sql, /on conflict \(resource_key\) do update/);
  assert.doesNotMatch(sql, /\b(create|alter|drop|grant)\b/i);

  const catalog = fs.readFileSync(path.join(root, 'chi-square-lesson-library.js'), 'utf8');
  assert.equal(catalog.split("marker: 'data-excel-cube-functions'").length, 2);
  const entry = catalog.slice(catalog.indexOf("marker: 'data-excel-cube-functions'")).split('}')[0];
  assert.ok(entry.includes(`path: '${lessonPath}'`));
  assert.ok(entry.includes("sectionId: 'power-bi-excel-sql'"));
  assert.ok(entry.includes("topic: 'power-bi-excel-sql'"));
  assert.ok(entry.includes("level: 'beginner'"));
  assert.ok(entry.includes('<span>90 min</span>'));
  assert.ok(entry.includes(`title: '${title}'`));
  assert.ok(catalog.includes("marker: 'data-beyond-the-bell',"));
  dom.window.close();
});

test('canonical chrome, quiz blocks and page structure follow the lesson guide', () => {
  const { dom, d } = setup();
  const guide = fs.readFileSync(path.join(root, 'docs/LESSON_CREATION_GUIDE.md'), 'utf8');
  for (const section of ['### 4.1 Header', '### 4.2 Footer', '### 7.1 Quiz styles', '### 7.3 Quiz grader']) {
    const block = guide.slice(guide.indexOf(section)).match(/```html\n([\s\S]*?)\n```/)[1];
    assert.ok(html.includes(block), `must use exact ${section}`);
  }
  for (const tag of ['<link rel="stylesheet" href="/style.css">', '<link rel="stylesheet" href="/lessons-theme.css">', '<script src="/theme.js"></script>', '<script src="/site-sections.js"></script>']) assert.ok(html.includes(tag));
  assert.equal(d.querySelectorAll('main').length, 1);
  assert.ok(d.querySelector('main#lesson-content'));
  assert.equal(d.querySelectorAll('h1').length, 1);
  assert.equal(d.querySelector('main#lesson-content h1').textContent, title);
  assert.equal(d.querySelectorAll('header.site').length, 1);
  assert.equal(d.querySelectorAll('footer.site').length, 1);
  assert.ok(!html.includes('Skip to lesson content'));
  assert.ok(!html.includes('Want to save your progress and quiz scores for this lesson?'));
  assert.equal(d.querySelector('section[aria-label="Return to lesson category"] a').getAttribute('href'), '/lessons#power-bi-excel-sql');
  const ids = Array.from(d.querySelectorAll('[id]')).map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, 'all IDs must be unique');
  for (const link of d.querySelectorAll('.cube-toc a')) assert.ok(d.querySelector(link.getAttribute('href')), link.getAttribute('href'));
  // The final style block is the dark-mode override and nothing but scripts/styles follow the footer.
  const styles = Array.from(d.querySelectorAll('style'));
  assert.equal(styles[styles.length - 1].id, 'excel-cube-functions-dark-overrides');
  let node = d.querySelector('footer.site').nextElementSibling;
  while (node) { assert.ok(['SCRIPT', 'STYLE'].includes(node.tagName)); node = node.nextElementSibling; }
  // No skipped heading levels inside the lesson.
  let previous = 1;
  for (const h of d.querySelectorAll('#lesson-content h1, #lesson-content h2, #lesson-content h3, #lesson-content h4')) {
    const level = Number(h.tagName[1]);
    assert.ok(level <= previous + 1, `heading "${h.textContent}" skips a level`);
    previous = level;
  }
  // Every form control has a label; every scroll region is focusable and named.
  for (const control of d.querySelectorAll('#lesson-content select, #lesson-content input:not([type=radio])')) assert.ok(d.querySelector(`label[for="${control.id}"]`), control.id);
  for (const region of d.querySelectorAll('.cube-scroll')) {
    assert.equal(region.getAttribute('tabindex'), '0');
    assert.equal(region.getAttribute('role'), 'region');
    assert.ok(region.getAttribute('aria-label'));
  }
  // CSS custom properties are lesson-namespaced.
  const declared = [...html.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]);
  assert.ok(declared.length > 0);
  assert.ok(declared.every((name) => name.startsWith('--lesson-cube-')), 'only --lesson-cube-* properties may be declared');
  dom.window.close();
});

test('all seven CUBE functions have their own section with syntax', () => {
  const { dom, d } = setup();
  const syntax = {
    cubemember: '=CUBEMEMBER(connection, member_expression, [caption])',
    cubevalue: '=CUBEVALUE(connection, [member_expression1], [member_expression2], ...)',
    cubeset: '=CUBESET(connection, set_expression, [caption], [sort_order], [sort_by])',
    cubesetcount: '=CUBESETCOUNT(set)',
    cuberankedmember: '=CUBERANKEDMEMBER(connection, set_expression, rank, [caption])',
    cubememberproperty: '=CUBEMEMBERPROPERTY(connection, member_expression, property)',
    cubekpimember: '=CUBEKPIMEMBER(connection, kpi_name, kpi_property, [caption])'
  };
  for (const [id, text] of Object.entries(syntax)) {
    const section = d.querySelector(`#lesson-content section#${id}`);
    assert.ok(section, `section ${id}`);
    assert.ok(section.querySelector('h2'));
    assert.ok(section.textContent.includes(text), `syntax for ${id}`);
    assert.ok(d.querySelector('#cheat-sheet').textContent.includes(text), `cheat sheet lists ${id}`);
  }
  const sortRows = d.querySelectorAll('#cubeset table')[1].querySelectorAll('tbody tr');
  assert.equal(sortRows.length, 7);
  assert.equal(d.querySelector('#cubekpimember table').querySelectorAll('tbody tr').length, 6);
  dom.window.close();
});

test('practice files match the embedded data, and every number quoted in the text matches the data', () => {
  const { dom, d } = setup();
  const embedded = JSON.parse(d.getElementById('cube-practice-data').textContent);
  const rows = csvRows();
  assert.deepEqual(rows, embedded);
  assert.equal(rows.length, 96);
  assert.equal(new Set(rows.map((r) => r[0])).size, 96);
  const workbook = fs.readFileSync(path.join(assets, 'cube-practice-dataset.xlsx'));
  assert.equal(workbook.subarray(0, 2).toString(), 'PK');
  assert.ok(workbook.length < 10 * 1024 * 1024);
  for (const file of ['cube-practice-dataset.xlsx', 'cube-practice-tests.csv']) assert.ok(d.querySelector(`a[download][href="/assets/lessons/${slug}/${file}"]`));

  const text = d.getElementById('lesson-content').textContent.replace(/\s+/g, ' ');
  const fmt = (n) => n.toLocaleString('en-US');
  const totalPieces = sum(rows, 5);
  const totalRejects = sum(rows, 6);
  const x70 = (r) => r[4] === 'X70';
  const millA = (r) => r[2] === 'Mill A';
  const millB = (r) => r[2] === 'Mill B';
  const march = (r) => r[1] === '2026-03';
  assert.equal(totalPieces, 42130);
  assert.ok(text.includes(`Returns ${fmt(totalPieces)}, every joint`));
  assert.ok(text.includes(`Returns ${sum(rows, 6, x70)} rejected X70 joints (out of ${totalRejects} rejects overall)`));
  assert.ok(text.includes(`Returns ${sum(rows, 6, (r) => x70(r) && millA(r) && march(r))}. Swap`));
  assert.ok(text.includes(`you get ${sum(rows, 5, (r) => x70(r) && millA(r) && march(r))}`));
  assert.ok(text.includes(`returns ${sum(rows, 6, (r) => x70(r) && millA(r))}, the X70 rejects made on Mill A`));
  const x65 = sum(rows, 6, (r) => r[4] === 'X65');
  assert.ok(text.includes(`returns ${x65 + sum(rows, 6, x70)} (${x65} + ${sum(rows, 6, x70)})`));
  assert.ok(text.includes(`Answer: ${fmt(sum(rows, 5, millB))} pieces.`));
  assert.ok(text.includes(`Answer: ${sum(rows, 6, millB)} rejects. Mill A has ${sum(rows, 6, millA)}.`));
  assert.ok(text.includes(`${(totalRejects / totalPieces * 100).toFixed(2)}% when formatted as a percentage (${totalRejects} rejects out of ${fmt(totalPieces)} pieces)`));
  const marchX65 = sum(rows, 6, (r) => r[4] === 'X65' && march(r));
  const marchX70 = sum(rows, 6, (r) => x70(r) && march(r));
  assert.ok(text.includes(`Answer: ${marchX65 + marchX70} rejects (X65 had ${marchX65} and X70 had ${marchX70} in March)`));
  const byMonth = {};
  rows.forEach((r) => { byMonth[r[1]] = (byMonth[r[1]] || 0) + r[6]; });
  const fewest = Object.entries(byMonth).sort((a, b) => a[1] - b[1])[0];
  assert.ok(text.includes(`Answer: ${fewest[0]} with ${fewest[1]} rejects`));
  assert.ok(text.includes(`March has ${byMonth['2026-03']} rejects and February ${byMonth['2026-02']}, so M4 shows ${byMonth['2026-03'] - byMonth['2026-02']}`));
  const rate = (g) => sum(rows, 6, (r) => r[4] === g) / sum(rows, 5, (r) => r[4] === g);
  assert.ok(text.includes(`X65 at ${(rate('X65') * 100).toFixed(2)}% and X70 at ${(rate('X70') * 100).toFixed(2)}%`));
  assert.equal(['X52', 'X60', 'X65', 'X70'].filter((g) => rate(g) > 0.025).join(), 'X70');
  dom.window.close();
});

test('member expression checker validates against the practice model', () => {
  const { dom, w, d } = setup();
  const check = w.CubeLesson.checkExpression;
  assert.equal(check('[Tests].[Grade].&[X70]').ok, true);
  assert.equal(check('[Tests].[Grade].[X70]').ok, true);
  assert.equal(check('[Measures].[Reject Rate]').kind, 'measure');
  assert.equal(check('[Tests].[Grade].[All]').kind, 'all');
  assert.equal(check('[Tests].[Grade].[All].Children').kind, 'set');
  assert.equal(check('"[Tests].[Mill].&[Mill B]"').ok, true);
  for (const bad of ['[Tests].[Grade].&[X80]', '[Test].[Grade].&[X70]', '[Tests].[Colour].&[Red]', '[Measures].[Scrap]', '[Tests].[Mill].&Mill A', 'Grade X70', '']) {
    const r = check(bad);
    assert.equal(r.ok, false, bad);
    assert.equal(r.excel, '#N/A', bad);
  }
  const out = d.getElementById('expr-result');
  assert.match(out.textContent, /^Valid\./);
  [...d.querySelectorAll('#expr-checker [data-expr]')].find((b) => b.getAttribute('data-expr') === '[Tests].[Mill].&[Mill C]').click();
  assert.equal(d.getElementById('expr-input').value, '[Tests].[Mill].&[Mill C]');
  assert.match(out.textContent, /Excel returns #N\/A/);
  assert.ok(out.classList.contains('cube-is-error'));
  dom.window.close();
});

test('CUBEVALUE builder writes the formula and computes the Data Model answer', () => {
  const { dom, w, d } = setup();
  assert.equal(d.getElementById('cv-formula').textContent, '=CUBEVALUE("ThisWorkbookDataModel","[Measures].[Total Rejects]","[Tests].[Grade].&[X70]","[Tests].[Mill].&[Mill A]","[Tests].[Month].&[2026-03]")');
  assert.equal(d.getElementById('cv-result').textContent, '27');
  choose(w, d, 'cv-measure', 'Total Pieces');
  assert.equal(d.getElementById('cv-result').textContent, '867');
  choose(w, d, 'cv-grade', '');
  choose(w, d, 'cv-mill', '');
  choose(w, d, 'cv-month', '');
  assert.equal(d.getElementById('cv-formula').textContent, '=CUBEVALUE("ThisWorkbookDataModel","[Measures].[Total Pieces]")');
  assert.equal(d.getElementById('cv-result').textContent, '42,130');
  assert.match(d.getElementById('cv-note').textContent, /Grade, Mill, Shift, Month/);
  choose(w, d, 'cv-measure', 'Reject Rate');
  assert.match(d.getElementById('cv-result').textContent, /^0\.0212 \(2\.12%/);
  const { evaluate } = w.CubeLesson;
  assert.equal(evaluate('Total Rejects', { Grade: ['X65', 'X70'] }), 568);
  assert.ok(Math.abs(evaluate('Reject Rate', { Grade: ['X65', 'X70'] }) - 568 / (10509 + 10647)) < 1e-12);
  dom.window.close();
});

test('set builder reproduces CUBESET sort orders, CUBESETCOUNT and CUBERANKEDMEMBER', () => {
  const { dom, w, d } = setup();
  const captions = () => [...d.querySelectorAll('#set-tbody tr td:first-of-type')].map((td) => td.textContent);
  assert.deepEqual(captions(), ['X70', 'X65', 'X60']);
  assert.match(d.getElementById('set-formulas').textContent, /,2,"\[Measures\]\.\[Total Rejects\]"\)/);
  assert.match(d.getElementById('set-count').textContent, /CUBESETCOUNT returns 4/);
  choose(w, d, 'set-order', '1');
  assert.deepEqual(captions(), ['X52', 'X60', 'X65']);
  choose(w, d, 'set-order', '4');
  assert.deepEqual(captions(), ['X70', 'X65', 'X60']);
  assert.doesNotMatch(d.getElementById('set-formulas').textContent, /,4,"/);
  choose(w, d, 'set-n', '10');
  assert.equal(captions().length, 4);
  choose(w, d, 'set-dim', 'Month');
  choose(w, d, 'set-order', '1');
  choose(w, d, 'set-n', '1');
  assert.deepEqual(captions(), ['2026-06']);
  const set = w.CubeLesson.buildSet('Mill', 2, 'Total Rejects');
  assert.deepEqual(JSON.parse(JSON.stringify(set.map((m) => [m.caption, m.value]))), [['Mill B', 479], ['Mill A', 414]]);
  assert.deepEqual(JSON.parse(JSON.stringify(w.CubeLesson.buildSet('Shift', 0, 'Total Rejects').map((m) => m.caption))), ['Day', 'Night']);
  dom.window.close();
});

test('quiz emits upskill-quiz-result for unanswered, wrong and all-correct submissions', () => {
  const { dom, w, d } = setup();
  const events = [];
  d.addEventListener('upskill-quiz-result', (e) => events.push(JSON.parse(JSON.stringify(e.detail))));
  const questions = [...d.querySelectorAll('#quiz-form .quiz-question')];
  assert.ok(questions.length >= 4);
  for (const q of questions) {
    assert.ok(q.getAttribute('data-explanation').length > 20);
    assert.ok(q.querySelector(`input[value="${q.getAttribute('data-answer')}"]`));
  }
  d.getElementById('quiz-submit').click();
  assert.deepEqual(events.at(-1), { score: 0, total: questions.length });
  assert.match(d.getElementById('quiz-result').textContent, /unanswered/);
  questions.forEach((q) => { q.querySelector(`input:not([value="${q.getAttribute('data-answer')}"])`).checked = true; });
  d.getElementById('quiz-submit').click();
  assert.deepEqual(events.at(-1), { score: 0, total: questions.length });
  assert.equal(d.querySelectorAll('.quiz-question.is-incorrect').length, questions.length);
  questions.forEach((q) => { q.querySelector(`input[value="${q.getAttribute('data-answer')}"]`).checked = true; });
  d.getElementById('quiz-submit').click();
  assert.deepEqual(events.at(-1), { score: questions.length, total: questions.length });
  assert.match(d.querySelector('.quiz-feedback.good').textContent, /^Correct\./);
  w.close();
  dom.window.close();
});
