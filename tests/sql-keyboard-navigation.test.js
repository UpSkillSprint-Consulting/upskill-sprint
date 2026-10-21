'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { JSDOM } = require('jsdom');

function buildLesson(t) {
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
  return path.join(temporary, 'lessons/writing-your-first-sql-query');
}

test('generated SQL editor leaves Tab and Shift+Tab available for focus navigation', (t) => {
  const lesson = buildLesson(t);
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

test('SQL lab runs valid aliases and joins while preserving errors and read-only restrictions', async (t) => {
  const { DatabaseSync } = require('node:sqlite');
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  const lesson = buildLesson(t);
  const dom = new JSDOM(fs.readFileSync(`${lesson}.html`, 'utf8'), {
    url: 'https://upskillsprint.com/lessons/writing-your-first-sql-query',
    runScripts: 'outside-only'
  });
  t.after(() => dom.window.close());
  const { window } = dom;
  const document = window.document;
  // Use a real local SQLite engine through sql.js's interface; never fetch a CDN.
  window.initSqlJs = async () => ({ Database: class {
    run(query) { sqlite.exec(query); }
    exec(query) {
      const rows = sqlite.prepare(query).all();
      return rows.length ? [{ columns: Object.keys(rows[0]), values: rows.map(Object.values) }] : [];
    }
  } });
  document.head.appendChild = (script) => {
    queueMicrotask(() => script.onload());
    return script;
  };
  window.eval(fs.readFileSync(`${lesson}.js`, 'utf8'));
  await new Promise(setImmediate);
  assert.match(document.getElementById('db-status').textContent, /SQLite engine ready/);
  const run = (query) => {
    document.getElementById('sql-editor').value = query;
    document.getElementById('run-query').click();
    return document.getElementById('row-count').textContent;
  };
  const queries = [
    ['SELECT product grade FROM production_orders;', 18, 'grade'],
    ['SELECT product AS grade FROM production_orders;', 18, 'grade'],
    ['SELECT order_id FROM production_orders JOIN customers USING (customer_id);', 18, 'order_id'],
    ['SELECT order_id FROM production_orders NATURAL JOIN customers;', 18, 'order_id'],
    ['SELECT order_id FROM production_orders CROSS JOIN customers;', 144, 'order_id'],
    ['SELECT order_id FROM production_orders JOIN customers;', 144, 'order_id']
  ];
  for (const enabled of [true, false]) {
    document.getElementById('coach-toggle').checked = enabled;
    for (const [query, count, column] of queries) {
      assert.equal(run(query), `${count} rows`, query);
      assert.equal(document.querySelector('.results-table th').textContent, column);
    }
  }
  document.getElementById('coach-toggle').checked = true;
  assert.equal(run('SELECT product, FROM production_orders;'), 'Query failed');
  assert.match(document.getElementById('lab-feedback').textContent, /Syntax problem/);
  assert.equal(run('DELETE FROM production_orders;'), 'Query not run');
  assert.match(document.getElementById('lab-feedback').textContent, /Only read-only queries/);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM production_orders').get().n, 18);
  const explanations = document.getElementById('mistakes').textContent;
  assert.match(explanations, /returns product under the alias grade, not two columns/);
  assert.match(explanations, /NATURAL JOIN.*matches all shared column names/);
  assert.doesNotMatch(explanations, /one invalid expression|does not know how rows/);
});
