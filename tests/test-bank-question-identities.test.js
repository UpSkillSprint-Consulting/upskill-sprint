'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const registrySource = fs.readFileSync(path.join(ROOT, 'test-bank-question-registry.js'), 'utf8');

function embedQuestionBanks(html) {
  return ['test-bank-cmq-set1.js', 'test-bank-mbb-set1.js', 'test-bank-mbb-set2.js', 'test-bank-cssgb-set1.js', 'test-bank-cssgb-set2.js'].reduce((page, file) => {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
    return page.replace('<script src="/' + file + '"></script>', '<script>' + source + '</script>');
  }, html);
}

function hash(value) {
  let output = 2166136261;
  String(value == null ? '' : value).split('').forEach(character => {
    output ^= character.charCodeAt(0);
    output = Math.imul(output, 16777619);
  });
  return (output >>> 0).toString(36);
}

async function load() {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(embedQuestionBanks(fs.readFileSync(path.join(ROOT, 'test-bank.html'), 'utf8')), {
    url: 'https://upskillsprint.com/test-bank',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  dom.window.eval(registrySource);
  return { dom, window: dom.window, errors };
}

test('every published question has a literal, unique ID that preserves the prior registry identity', async () => {
  const { dom, window, errors } = await load();
  try {
    assert.deepEqual(errors, []);
    const expectedTotals = { cssbb: 1024, mbb: 175, cssgb: 616, cqe: 933, cmq: 166 };
    let total = 0;

    Object.entries(expectedTotals).forEach(([examId, expectedTotal]) => {
      const exam = window.__TB.EXAMS[examId];
      const all = Array.from(Object.values(exam.sets).flat());
      assert.equal(all.length, expectedTotal, examId + ' retains its complete published pool');
      assert.ok(all.every(question => typeof question.qid === 'string' && question.qid.length > 0), examId + ' has no position-only IDs');
      assert.equal(new Set(all.map(question => question.qid)).size, all.length, examId + ' has no duplicate canonical IDs');

      Object.entries(exam.sets).forEach(([setId, questions]) => {
        Array.from(questions).forEach((question, index) => {
          let expected;
          if (examId === 'cssgb') {
            expected = 'cssgb:set-' + setId + ':source-' + question.sourceGlobalQuestion + ':' + hash(String(question.sourceSection).toLowerCase());
          } else if (examId === 'mbb' && setId === '2') {
            expected = 'mbb:set-2:original-' + String(index + 1).padStart(3, '0');
          } else if (examId === 'cmq' || examId === 'mbb') {
            expected = examId + ':set-' + setId + ':source-' + question.sourceQuestion;
          } else {
            expected = examId + ':set-' + setId + ':legacy-' + (index + 1);
          }
          assert.equal(question.qid, expected, examId + ' Set ' + setId + ' question ' + (index + 1) + ' retains its migration-safe ID');
        });
      });

      const validation = window.__TBQuestionRegistry.validate(examId);
      assert.equal(validation.total, expectedTotal);
      assert.equal(validation.explicitIds, expectedTotal);
      assert.equal(validation.derivedLegacyIds, 0);
      assert.deepEqual(Array.from(validation.warnings), []);
      total += expectedTotal;
    });

    assert.equal(total, 2914, 'the complete live question inventory is explicitly identified');
  } finally {
    dom.window.close();
  }
});

test('an imported question cannot change an existing question ID by changing array position', async () => {
  const { dom, window } = await load();
  try {
    const set = window.__TB.EXAMS.cssbb.sets[1];
    const existing = set[1];
    const expectedId = existing.qid;
    set.unshift({
      qid: 'cssbb:set-1:imported-0001', sub: 'p1', stem: 'A newly imported question.',
      options: ['A', 'B', 'C', 'D'], answer: 0, why: 'Fixture only.', set: 1
    });
    assert.equal(existing.qid, expectedId);
    assert.equal(window.__TBQuestionRegistry.idFor('cssbb', existing), expectedId);
  } finally {
    dom.window.close();
  }
});
