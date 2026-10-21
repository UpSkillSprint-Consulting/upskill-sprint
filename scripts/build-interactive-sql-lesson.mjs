import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const payloadFiles = [1, 2, 3, 4].map((part) =>
  path.join(root, '.tmp', `sql-lesson.part${part}`)
);

for (const payloadFile of payloadFiles) {
  if (!fs.existsSync(payloadFile)) {
    throw new Error(`Missing SQL lesson payload: ${path.relative(root, payloadFile)}`);
  }
}

const encoded = payloadFiles
  .map((payloadFile) => fs.readFileSync(payloadFile, 'utf8').trim())
  .join('');

const archivePath = path.join(os.tmpdir(), 'upskillsprint-sql-lesson.tar.gz');
fs.writeFileSync(archivePath, Buffer.from(encoded, 'base64'));

const lessonsDir = path.join(root, 'lessons');
fs.mkdirSync(lessonsDir, { recursive: true });

/* Build containers do not necessarily allow chown to the UID/GID recorded in
   the source archive. The lesson files do not depend on archived ownership. */
const extraction = spawnSync('tar', ['--no-same-owner', '-xzf', archivePath, '-C', lessonsDir], {
  cwd: root,
  encoding: 'utf8'
});

if (extraction.status !== 0) {
  throw new Error(`Unable to extract SQL lesson assets: ${extraction.stderr || extraction.stdout}`);
}

// Keep native Tab/Shift+Tab navigation available in the generated editor.
const sqlScriptPath = path.join(lessonsDir, 'writing-your-first-sql-query.js');
let sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');
const tabIndentation = `    if (event.key === "Tab") {
      event.preventDefault();
      var start = editor.selectionStart, end = editor.selectionEnd;
      editor.value = editor.value.slice(0, start) + "  " + editor.value.slice(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
    }
`;
if (!sqlScript.includes(tabIndentation)) {
  throw new Error('The SQL editor Tab handler was not found in the source payload.');
}
sqlScript = sqlScript.replace(tabIndentation, '');

// Aliases and joins without ON can be valid SQL; let SQLite parse them.
const invalidSyntaxGuards = [
  String.raw`    if (/\bJOIN\b/i.test(normalized) && !/\bON\b/i.test(normalized)) return { title: "JOIN condition is missing", body: "JOIN adds another table, but ON must explain how rows in the two tables match.", correction: "JOIN customers AS c\n  ON p.customer_id = c.customer_id" };`,
  String.raw`    var selectMatch = normalized.match(/^SELECT\s+([\s\S]+?)\s+FROM\b/i);
    if (selectMatch) {
      var known = "(?:order_id|customer_id|product|grade|line|quantity|status|scrap_tonnes|test_id|test_type|result_value|unit|test_status|test_date|customer_name|region|industry)";
      var missingComma = new RegExp("\\b" + known + "\\s+" + known + "\\b", "i");
      if (missingComma.test(selectMatch[1]) && selectMatch[1].indexOf(",") < 0) return { title: "A comma may be missing", body: "Separate each selected column with a comma.", correction: "SELECT order_id, product, grade\nFROM production_orders;" };
    }`
];
for (const guard of invalidSyntaxGuards) {
  if (!sqlScript.includes(guard)) throw new Error('The obsolete SQL syntax guard was not found.');
  sqlScript = sqlScript.replace(`${guard}\n`, '');
}
fs.writeFileSync(sqlScriptPath, sqlScript);

// Keep search and social titles concise without changing the uploaded lesson.
const sqlLessonPath = path.join(lessonsDir, 'writing-your-first-sql-query.html');
let sqlLesson = fs.readFileSync(sqlLessonPath, 'utf8');
const syntaxCorrections = [
  ['<th>Why it fails</th>', '<th>What happens</th>'],
  ['<tr><td>Missing comma</td><td>SQL reads two column names as one invalid expression.</td><td><code>SELECT product, grade</code></td></tr>',
    '<tr><td>Missing comma when two columns were intended</td><td><code>SELECT product grade</code> is valid: it returns product under the alias grade, not two columns.</td><td>Use <code>SELECT product, grade</code> for two columns, or <code>SELECT product AS grade</code> for an explicit alias.</td></tr>'],
  ['<tr><td>Join without <code>ON</code></td><td>The database does not know how rows in the two tables correspond.</td><td><code>ON p.customer_id = c.customer_id</code></td></tr>',
    '<tr><td>Unintended all-pairs join</td><td>In SQLite, a plain <code>JOIN</code> without <code>ON</code> or <code>USING</code> returns every pair of rows. <code>CROSS JOIN</code> does this deliberately; <code>NATURAL JOIN</code> instead matches all shared column names.</td><td>For related orders and customers, use <code>ON p.customer_id = c.customer_id</code> or <code>USING (customer_id)</code>. Check the intended relationship and row count.</td></tr>'],
  ['<strong>JOIN</strong> connects tables through a valid key relationship stated in an ON condition.',
    '<strong>JOIN</strong> combines tables. Use <code>ON</code> or <code>USING</code> for an explicit matching condition; use <code>CROSS JOIN</code> when every pair of rows is intended.']
];
for (const [original, replacement] of syntaxCorrections) {
  if (!sqlLesson.includes(original)) throw new Error('The SQL syntax explanation was not found.');
  sqlLesson = sqlLesson.replace(original, replacement);
}
const headEnd = sqlLesson.indexOf('</head>');
if (headEnd < 0) throw new Error('SQL lesson head was not found.');
const editorHelp = 'Press Control Enter or Command Enter to run the query. Press Tab to indent.';
if (!sqlLesson.includes(editorHelp)) throw new Error('SQL editor help was not found.');
fs.writeFileSync(sqlLessonPath, sqlLesson.slice(0, headEnd).replaceAll(
  'Writing Your First SQL Query: Interactive SQL Lab | UpSkill Sprint Consulting',
  'Your First SQL Query: Interactive Lab | UpSkill Sprint'
) + sqlLesson.slice(headEnd).replace(editorHelp,
  'Press Control Enter or Command Enter to run the query. Use spaces to indent. Press Tab or Shift+Tab to move between controls.'
));

const catalogPath = path.join(root, 'lessons.html');
const catalog = fs.readFileSync(catalogPath, 'utf8');

const placeholder = `            <a class="lesson-row" href="lesson-template.html" data-lesson-item data-topic="power-bi-excel-sql" data-level="beginner" data-interactive="false" data-search="first sql query select where join database">
              <div>
                <div class="lesson-meta"><span>Beginner</span><span>10 min read</span><span>SQL</span></div>
                <h3>Writing Your First SQL Query</h3>
                <p>Learn SELECT, WHERE, and JOIN—enough SQL to start pulling your own data.</p>
              </div>
              <span class="lesson-action">Start lesson <span class="lesson-arrow" aria-hidden="true">&rarr;</span></span>
            </a>`;

const replacement = `            <a class="lesson-row" href="/lessons/writing-your-first-sql-query" data-lesson-item data-topic="power-bi-excel-sql" data-level="beginner" data-interactive="true" data-search="first sql query select from where order by group by having join limit sqlite sql server database live editor practice quiz interactive">
              <div>
                <div class="lesson-meta"><span>Beginner</span><span>Interactive</span><span>35 min read</span><span>SQL</span></div>
                <h3>Writing Your First SQL Query</h3>
                <p>Write and run SQL in a live browser lab while learning SELECT, FROM, WHERE, ORDER BY, GROUP BY, HAVING, JOIN, and LIMIT.</p>
              </div>
              <span class="lesson-action">Start lesson <span class="lesson-arrow" aria-hidden="true">&rarr;</span></span>
            </a>`;

if (!catalog.includes(placeholder)) {
  throw new Error('The Writing Your First SQL Query placeholder card was not found in lessons.html.');
}

fs.writeFileSync(catalogPath, catalog.replace(placeholder, replacement), 'utf8');

for (const payloadFile of payloadFiles) {
  fs.rmSync(payloadFile, { force: true });
}

try {
  fs.rmdirSync(path.join(root, '.tmp'));
} catch {
  // Leave the directory in place when another temporary build asset uses it.
}

fs.rmSync(archivePath, { force: true });

console.log('Interactive SQL lesson installed and lesson catalog updated.');
