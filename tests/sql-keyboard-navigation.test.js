'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { JSDOM } = require('jsdom');

test('generated SQL editor leaves Tab and Shift+Tab available for focus navigation', (t) => {
  const root = path.join(__dirname, '..');
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'sql-keyboard-'));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  fs.mkdirSync(path.join(temporary, '.tmp'));
  for (let part = 1; part <= 4; part += 1) {
    const file = `.tmp/sql-lesson.part${part}`;
    fs.copyFileSync(path.join(root, file), path.join(temporary, file));
  }
  fs.copyFileSync(path.join(root, 'lessons.html'), path.join(temporary, 'lessons.html'));
  execFileSync(process.execPath, [path.join(root, 'scripts/build-interactive-sql-lesson.mjs')], {
    cwd: temporary, stdio: 'pipe'
  });
  const lesson = path.join(temporary, 'lessons/writing-your-first-sql-query');
  const dom = new JSDOM(fs.readFileSync(`${lesson}.html`, 'utf8'), {
    url: 'https://upskillsprint.com/lessons/writing-your-first-sql-query',
    runScripts: 'outside-only'
  });
  t.after(() => dom.window.close());
  const { window } = dom;
  // External scripts are not fetched; exercise the actual generated editor handler.
  window.eval(fs.readFileSync(`${lesson}.js`, 'utf8'));
  const editor = window.document.getElementById('sql-editor');
  editor.focus();
  editor.setSelectionRange(0, 6);
  const original = editor.value;
  for (const shiftKey of [false, true]) {
    const event = new window.KeyboardEvent('keydown', {
      key: 'Tab', shiftKey, bubbles: true, cancelable: true
    });
    editor.dispatchEvent(event);
    assert.equal(event.defaultPrevented, false);
    assert.equal(editor.value, original);
    assert.deepEqual([editor.selectionStart, editor.selectionEnd], [0, 6]);
  }
  assert.match(window.document.getElementById('editor-help').textContent, /Shift\+Tab/);
  for (const modifier of ['ctrlKey', 'metaKey']) {
    const event = new window.KeyboardEvent('keydown', {
      key: 'Enter', [modifier]: true, bubbles: true, cancelable: true
    });
    editor.dispatchEvent(event);
    assert.equal(event.defaultPrevented, true, 'the run-query shortcut remains available');
  }
});
