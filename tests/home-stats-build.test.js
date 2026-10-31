'use strict';
// scripts/build-home-stats.mjs publishes ONLY practice-question totals for the
// homepage box. These tests pin the counting rules and that no question content leaks.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ROOT = path.join(__dirname, '..');
const url = 'file://' + path.join(ROOT, 'scripts', 'build-home-stats.mjs');

test('only released exams count, once each', async () => {
  const { publishedExams } = await import(url);
  const page = fs.readFileSync(path.join(ROOT, 'exam-practice.html'), 'utf8');
  const exams = publishedExams(page);
  assert.equal(new Set(exams).size, exams.length);
  assert.ok(exams.includes('cssbb') && exams.includes('cqe'));
  const withSoon = page.replace('data-exam="cssbb" data-publication="published"', 'data-exam="cssbb" data-publication="coming_soon"');
  assert.ok(!publishedExams(withSoon).includes('cssbb'), 'coming-soon exams are not counted');
});

test('questions are counted once per exam by stem, across sets', async () => {
  const { countQuestions } = await import(url);
  const q = stem => ({ stem, options: ['a', 'b', 'c', 'd'], answer: 0 });
  const pkg = { scripts: [
    "window.__TB={EXAMS:{demo:{sets:{1:[" + JSON.stringify(q('A')) + "," + JSON.stringify(q('B')) + "],2:[" + JSON.stringify(q('B')) + "," + JSON.stringify(q('C')) + "]}}}};",
    'throw new Error("UI script that needs a real page");'
  ] };
  assert.equal(countQuestions(pkg, 'demo'), 3, 'B appears in two sets but counts once; a failing UI script is ignored');
  const bankOnly = { scripts: ["window.__TB={EXAMS:{nppe:{sets:{},bank:[" + JSON.stringify(q('X')) + "," + JSON.stringify(q('Y')) + "]}}};"] };
  assert.equal(countQuestions(bankOnly, 'nppe'), 2, 'exams without sets use their bank');
  assert.throws(() => countQuestions({ scripts: [] }, 'demo'), /did not register/);
});

test('the published file holds totals only, and they add up', async () => {
  const { buildHomeStats } = await import(url);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'home-stats-'));
  try {
    const stats = await buildHomeStats(dir);
    const raw = fs.readFileSync(path.join(dir, 'home-stats.json'), 'utf8');
    const file = JSON.parse(raw);
    assert.deepEqual(Object.keys(file).sort(), ['byExam', 'exams', 'questions']);
    assert.ok(Object.values(file.byExam).every(v => Number.isInteger(v) && v > 0));
    assert.equal(file.questions, Object.values(file.byExam).reduce((a, b) => a + b, 0));
    assert.equal(file.exams, Object.keys(file.byExam).length);
    assert.ok(file.questions > 1000, 'thousands of practice questions, got ' + file.questions);
    assert.ok(raw.length < 600, 'tiny file: no question content');
    assert.deepEqual(stats, file);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('build:site runs the stats step after the exam packages are built', () => {
  const build = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts['build:site'];
  const a = build.indexOf('build-exam-delivery.mjs'), b = build.indexOf('build-home-stats.mjs'), stage = build.indexOf('stage-public-site.mjs');
  assert.ok(stage > -1 && a > stage && b > a, 'order: stage site, build exam packages, then home stats');
});
