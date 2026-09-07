'use strict';

// Segment 01: observation and preservation only. No live API calls or learner data.
// Known defects are recorded as observations, not asserted as desired behavior.
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { JSDOM, VirtualConsole } = require('jsdom');
const ROOT = path.join(__dirname, '..');
const BANKS = ['test-bank-cmq-set1.js', 'test-bank-mbb-set1.js', 'test-bank-mbb-set2.js', 'test-bank-mbb-set3.js', 'test-bank-cssgb-set1.js', 'test-bank-cssgb-set2.js'];
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const emit = (name, value) => console.log('SEG01_' + name + ' ' + JSON.stringify(value));

async function load() {
  const errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error.message));
  const html = BANKS.reduce((page, file) => page.replace('<script src="/' + file + '"></script>', '<script>' + read(file) + '</script>'), read('test-bank.html'));
  const dom = new JSDOM(html, { url: 'https://segment01.invalid/test-bank', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: console });
  let timeout;
  try {
    await Promise.race([
      new Promise(resolve => dom.window.addEventListener('load', resolve, { once: true })),
      new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('Isolated baseline DOM failed to load')), 15000); })
    ]);
    dom.window.eval(read('test-bank-question-registry.js'));
    return { dom, window: dom.window, errors };
  } catch (error) {
    dom.window.close();
    throw error;
  } finally { clearTimeout(timeout); }
}

test('Segment 01: full published inventory remains explicitly identified', { timeout: 30000 }, async () => {
  const { dom, window, errors } = await load();
  try {
    assert.deepEqual(errors, []);
    const inventory = {};
    const globalIds = new Set();
    for (const [examId, exam] of Object.entries(window.__TB.EXAMS)) {
      const questions = Array.from(Object.values(exam.sets || {}).flat());
      if (!questions.length) continue;
      const validation = window.__TBQuestionRegistry.validate(examId);
      inventory[examId] = { total: questions.length, sets: Object.fromEntries(Object.entries(exam.sets).map(([id, rows]) => [id, rows.length])), explicitIds: validation.explicitIds, warnings: Array.from(validation.warnings), examLength: exam.n, practiceTarget: exam.pass };
      assert.equal(validation.explicitIds, questions.length);
      assert.deepEqual(Array.from(validation.warnings), []);
      for (const question of questions) {
        assert.equal(typeof question.qid, 'string');
        assert.ok(question.qid.startsWith(examId + ':'), 'Question namespace must match its exam');
        assert.ok(!globalIds.has(question.qid), 'Canonical ID must be globally unique: ' + question.qid);
        globalIds.add(question.qid);
      }
    }
    assert.ok(globalIds.size > 0);
    emit('INVENTORY', inventory);
    emit('CORE_API', Object.fromEntries(Object.entries(window.__TB).map(([key, value]) => [key, typeof value])));
  } finally { dom.window.close(); }
});

test('Segment 01: record privacy-safe source fingerprints and core timing/grading locations', () => {
  const files = ['test-bank.html', 'test-bank-question-registry.js', 'test-bank-learning-events.js', 'test-bank-account-sync.js', 'test-bank-adaptive-mastery.js', 'test-bank-adaptive-mastery-hardening.js', 'test-bank-analytics-dashboard.js', 'package-lock.json', '.node-version'];
  emit('FINGERPRINTS', files.map(file => ({ file, sha256: crypto.createHash('sha256').update(read(file)).digest('hex'), bytes: Buffer.byteLength(read(file)) })));
  const lines = read('test-bank.html').split('\n');
  emit('CORE_FUNCTIONS', lines.flatMap((line, index) => {
    const match = line.match(/^\s*(?:async\s+)?function\s+([\w$]+)\s*\(/);
    return match ? [{ line: index + 1, name: match[1] }] : [];
  }));
  const anchors = [];
  lines.forEach((line, index) => {
    if (/setInterval\(|clearInterval\(|performance\.now\(|Date\.now\(|\.pass\b|timeSpent|timeRemaining|elapsed|deadline/i.test(line) && line.length < 2500 && !/stem\s*:|"stem"\s*:/.test(line)) {
      anchors.push({ line: index + 1, source: line.trim() });
    }
  });
  emit('CORE_TIMING_GRADING_ANCHORS', anchors);
  assert.ok(anchors.length > 0);
});
