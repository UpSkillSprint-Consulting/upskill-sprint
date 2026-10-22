const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const page = 'lessons/power-bi-excel-sql/minitab-control-chart-selection-analysis.html';
const fragDir = 'lessons/assets/minitab-control-chart-selection-analysis';

test('build pre-renders the Minitab guide with one H1 and the interactive forms', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'minitab-'));
  fs.mkdirSync(path.join(dir, path.dirname(page)), { recursive: true });
  fs.cpSync(fragDir, path.join(dir, fragDir), { recursive: true });
  fs.copyFileSync(page, path.join(dir, page));
  const { renderMinitabGuide } = await import('../scripts/render-minitab-guide.mjs');
  await renderMinitabGuide(dir);
  const html = fs.readFileSync(path.join(dir, page), 'utf8');
  const doc = new JSDOM(html).window.document;
  const root = doc.getElementById('lesson-fragment-root');
  assert.equal(root.dataset.prerendered, 'true');
  assert.equal(doc.querySelectorAll('h1').length, 1);
  assert.equal(doc.getElementById('lesson-loading'), null);
  for (const id of ['selector-form', 'imr-data', 'quiz-form', 'signal-lab']) assert.equal(doc.querySelectorAll('#' + id).length, 1, id);
  assert.ok(root.textContent.length > 20000);
  assert.ok(html.includes('<!-- UPSKILLSPRINT_LESSON_META'));
  fs.rmSync(dir, { recursive: true, force: true });
});
