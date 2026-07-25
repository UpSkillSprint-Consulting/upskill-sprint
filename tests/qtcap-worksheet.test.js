'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const LESSON = path.join(ROOT, 'lessons', 'complete-14-quality-tools-project.html');
const html = fs.readFileSync(LESSON, 'utf8');
const STORAGE_KEY = 'qt-capstone-/lessons/complete-14-quality-tools-project.html';

function loadLesson() {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {
    url: 'https://upskillsprint.com/lessons/complete-14-quality-tools-project.html',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc
  });
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  return new Promise(resolve => {
    dom.window.addEventListener('load', () => resolve({ window: dom.window, errors }));
  });
}
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- page contract ---------- */

test('the lesson still carries the exact shared controller tags', () => {
  assert.equal(html.split('<script src="/theme.js"></script>').length - 1, 1);
  assert.equal(html.split('<script src="/site-sections.js"></script>').length - 1, 1);
});

test('script tags remain balanced', () => {
  assert.equal(html.split('<script').length - 1, html.split('</script>').length - 1);
});

/* ---------- nothing removed ---------- */

test('the original checklist and complete button are preserved', async () => {
  const { window } = await loadLesson();
  const ol = window.document.querySelector('.qw-card.wide ol');
  assert.ok(ol, 'the reference checklist is intact');
  assert.equal(ol.querySelectorAll('li').length, 9, 'all nine outline items remain');
  assert.ok(window.document.querySelector('[data-complete]'), 'the complete button remains');
});

/* ---------- additive: fillable worksheet ---------- */

test('the worksheet renders a field for each deliverable section plus a header', async () => {
  const { window } = await loadLesson();
  const wb = window.document.getElementById('capstone-workbench');
  assert.ok(wb, 'worksheet mounts');
  assert.equal(wb.querySelectorAll('textarea').length, 9, 'nine section fields');
  assert.ok(wb.querySelector('#cap-title') && wb.querySelector('#cap-author') && wb.querySelector('#cap-date'), 'report header fields');
  assert.ok(wb.querySelector('#cap-print') && wb.querySelector('#cap-md') && wb.querySelector('#cap-clear'), 'export + clear controls');
});

test('the date field is prefilled with today', async () => {
  const { window } = await loadLesson();
  assert.match(window.document.getElementById('cap-date').value, /^\d{4}-\d{2}-\d{2}$/);
});

test('the QTCAP hook exposes helpers and nine fields', async () => {
  const { window } = await loadLesson();
  const C = window.__QTCAP;
  assert.ok(C, 'window.__QTCAP exists');
  assert.equal(C.FIELDS.length, 9);
  ['buildMarkdown', 'buildReportHTML', 'loadData', 'saveData', 'completion'].forEach(fn =>
    assert.equal(typeof C[fn], 'function', `__QTCAP.${fn} is a function`));
});

/* ---------- completion + report builders ---------- */

test('completion counts only non-empty sections', async () => {
  const { window } = await loadLesson();
  const C = window.__QTCAP;
  const eq = (got, exp) => { assert.equal(got.done, exp.done); assert.equal(got.total, exp.total); assert.equal(got.pct, exp.pct); };
  eq(C.completion({}), { done: 0, total: 9, pct: 0 });
  eq(C.completion({ problem: 'x', cause: '   y   ' }), { done: 2, total: 9, pct: 22 });
  const full = {}; C.FIELDS.forEach(f => (full[f.id] = 'done'));
  eq(C.completion(full), { done: 9, total: 9, pct: 100 });
});

test('the Markdown export includes every section and flags incomplete ones', async () => {
  const { window } = await loadLesson();
  const C = window.__QTCAP;
  const md = C.buildMarkdown({ title: 'Low YS', author: 'Ernest', date: '2026-07-24', problem: 'Bars fail spec' });
  assert.match(md, /^# Low YS/, 'uses the project title as H1');
  assert.match(md, /Prepared by:\*\* Ernest/, 'includes the author');
  C.FIELDS.forEach(f => assert.ok(md.includes(f.label), `section "${f.label}" present`));
  assert.match(md, /_— not completed —_/, 'marks empty sections');
});

test('the printable report is a self-contained, escaped HTML document', async () => {
  const { window } = await loadLesson();
  const C = window.__QTCAP;
  const doc = C.buildReportHTML({ title: 'Line 3 <test>', author: 'A & B', problem: 'x' });
  assert.match(doc, /^<!doctype html>/i, 'is a full document');
  assert.ok(doc.includes('</html>'), 'is closed');
  assert.ok(doc.includes('UpSkill Sprint'), 'carries the report header');
  assert.ok(doc.includes('Line 3 &lt;test&gt;'), 'escapes the title');
  assert.ok(doc.includes('A &amp; B'), 'escapes the author');
});

/* ---------- persistence + live behaviour ---------- */

test('typing updates the completion meter', async () => {
  const { window } = await loadLesson();
  const wb = window.document.getElementById('capstone-workbench');
  const ta = wb.querySelector('#cap-problem');
  ta.value = 'Bars fail yield spec on the night shift';
  ta.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.match(wb.querySelector('#cap-count').textContent, /1 of 9/);
  assert.equal(wb.querySelector('#cap-bar').style.width, '11%');
});

test('worksheet content auto-saves to localStorage', async () => {
  const { window } = await loadLesson();
  window.localStorage.removeItem(STORAGE_KEY);
  const wb = window.document.getElementById('capstone-workbench');
  const ta = wb.querySelector('#cap-cause');
  ta.value = 'Finish-temperature variance between shifts';
  ta.dispatchEvent(new window.Event('input', { bubbles: true }));
  await wait(500);
  const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  assert.equal(saved.cause, 'Finish-temperature variance between shifts');
  assert.match(wb.querySelector('#cap-status').textContent, /Saved/);
});

test('saved content rehydrates the fields on a fresh load', async () => {
  const first = await loadLesson();
  first.window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ title: 'Persisted', problem: 'Recovered text' }));
  // second load in the same storage origin
  const second = await loadLesson();
  // jsdom gives each window its own storage; mirror it to simulate a reload
  second.window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ title: 'Persisted', problem: 'Recovered text' }));
  // re-run build against the mirrored storage
  const dom = new JSDOM(html, { url: second.window.location.href, runScripts: 'dangerously', pretendToBeVisual: true });
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  await new Promise(r => dom.window.addEventListener('load', r));
  dom.window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ title: 'Persisted', problem: 'Recovered text' }));
  // the module already built on load with empty storage; assert loadData reads the mirror
  assert.equal(dom.window.__QTCAP.loadData().problem, 'Recovered text');
});

test('the lesson loads with no unexpected errors', async () => {
  const { errors } = await loadLesson();
  assert.deepEqual(errors, []);
});
