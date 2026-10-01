(function () {
  'use strict';
  var mount = document.getElementById('excel-sprint-app');
  if (!mount || !window.ExcelSprintProgress || !window.ExcelSprintDashboard) return;
  var P = window.ExcelSprintProgress;
  var D = window.ExcelSprintDashboard;
  var esc = D.escape;
  var BASE = '/assets/lessons/excel-formula-fluency/sprint/';
  var store = P.createStore(window);
  var state = P.emptyState();
  var catalog;
  var completions = [];
  var currentPackage;
  var verified = false;
  var busy = false;
  var loadingId = '';
  var activeSince = null;
  var draftTimer;
  var packageCache = new Map();
  var solutionCache = new Map();
  var coachingAvailable = false;
  var coachCache = new Map();
  function releasedCount() { return catalog.levels.filter(function (level) { return level.available; }).reduce(function (n, level) { return n + level.packages.length; }, 0); }
  var NOTICE = 'Your progress is saved in this browser only. Clearing browser data or switching devices will lose it unless you export a backup.';

  async function request(url, body) {
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timeout = controller ? setTimeout(function () { controller.abort(); }, 20000) : null;
    try {
      var response = await fetch(url, body === undefined ? { signal: controller && controller.signal } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller && controller.signal, cache: 'no-store' });
      var data;
      try { data = await response.json(); } catch (_) { throw new Error('The service returned an unreadable response. Please try again.'); }
      if (!response.ok) throw new Error(data.message || data.error || 'The service is unavailable. Your saved work is still here. Please try again.');
      return data;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('The request timed out. Your work is saved; try again when the connection is stable.');
      if (error instanceof TypeError) throw new Error('Cannot reach the service. Check your connection and try again.');
      throw error;
    } finally { if (timeout) clearTimeout(timeout); }
  }
  function message(text, error) {
    var target = mount.querySelector('#sprint-message');
    if (!target) return;
    target.textContent = text || '';
    target.hidden = !text;
    target.className = 'sprint-message' + (error ? ' sprint-message-error' : '');
    target.setAttribute('role', error ? 'alert' : 'status');
  }
  function storageNotice() {
    var target = mount.querySelector('#sprint-storage-warning');
    if (!target) return;
    var status = store.status();
    target.textContent = status.warning;
    target.hidden = !status.warning;
  }
  async function persist() {
    try { await store.save(state); storageNotice(); } catch (_) {
      var target = mount.querySelector('#sprint-storage-warning');
      if (target) { target.hidden = false; target.textContent = 'Your work could not be saved. Export a backup before leaving this page.'; }
    }
  }
  function record(id) {
    if (!state.packages[id]) state.packages[id] = { submissions: {}, tasks: {}, timeMs: 0 };
    return state.packages[id];
  }
  function findPackage(id) {
    for (var index = 0; index < catalog.levels.length; index++) {
      var level = catalog.levels[index];
      var item = level.packages.find(function (pkg) { return pkg.id === id; });
      if (item) return { level: level, pkg: item };
    }
    return null;
  }
  function canOpen(id) {
    var item = findPackage(id);
    return !!item && P.unlocked(id, completions, item.level.available);
  }
  function canRead(id) {
    var item = findPackage(id);
    return canOpen(id) || !verified && !!item && item.level.available && !!state.packages[id];
  }
  function completed(id) { return completions.find(function (entry) { return entry.packageId === id; }); }
  function dayStamp() {
    var now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  }
  function studyDay() { var day = dayStamp(); if (!state.activityDays.includes(day)) state.activityDays.push(day); }
  function flushTime() {
    if (activeSince !== null && currentPackage) {
      record(currentPackage.id).timeMs += Math.max(0, Date.now() - activeSince);
      activeSince = document.hidden ? null : Date.now();
    }
  }
  function collectDrafts() {
    if (!currentPackage) return;
    var saved = record(currentPackage.id);
    currentPackage.tasks.concat(currentPackage.bonus ? [currentPackage.bonus] : []).forEach(function (task) {
      var formula = mount.querySelector('[data-sprint-formula-input="' + task.id + '"]');
      var result = mount.querySelector('[data-sprint-result-input="' + task.id + '"]');
      if (!formula || !result) return;
      var parsed;
      try { parsed = parseResult(result.value, task.type); } catch (_) { parsed = result.value; }
      if (formula.value || result.value) saved.submissions[task.id] = { formula: formula.value, result: parsed, resultText: result.value };
      else delete saved.submissions[task.id];
    });
  }
  function parseCell(text) {
    var trimmed = text.trim();
    if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed)) return Number(trimmed);
    return trimmed;
  }
  function parseResult(text, type) {
    var value = text.replace(/\r/g, '');
    if (type === 'array') value = value.replace(/\n$/, '');
    else value = value.trim();
    if (!value.trim()) throw new Error('Enter the result Excel produced.');
    if (value.length > 16000) throw new Error('The result is too long. Paste only the requested output range.');
    if (type === 'number') {
      var parsed = parseCell(value);
      if (typeof parsed !== 'number' || !Number.isFinite(parsed)) throw new Error('Enter a number with a decimal point if needed, without units or thousands separators.');
      return parsed;
    }
    if (type === 'array') {
      var rows = value.split('\n').map(function (row) { return row.split('\t'); });
      if (rows.length > 300 || rows.some(function (row) { return row.length > 20; })) throw new Error('Paste only the requested output range, with columns separated by tabs and rows by new lines.');
      return rows;
    }
    return value;
  }
  function resultText(saved) {
    if (!saved) return '';
    if (saved.resultText !== undefined) return saved.resultText;
    if (Array.isArray(saved.result)) return saved.result.map(function (row) { return Array.isArray(row) ? row.join('\t') : row; }).join('\n');
    return String(saved.result === null ? '' : saved.result);
  }
  function supportingSheets(dataset) {
    return (dataset.sheets || []).map(function (sheet) {
      return '<details class="sprint-supporting-sheet"><summary>' + esc(sheet.name) + ' sheet · ' + sheet.rows.length + ' rows</summary><p>For CSV or copied data, create a sheet named <code>' + esc(sheet.name) + '</code> and put its headings in row 1.</p><div class="sprint-inline-actions"><a class="sprint-button sprint-secondary" href="' + esc(sheet.csv) + '" download>Download ' + esc(sheet.name) + ' .csv</a><button type="button" class="sprint-button sprint-secondary" data-sprint-action="copy" data-sprint-sheet="' + esc(sheet.name) + '">Copy ' + esc(sheet.name) + ' for Excel</button></div><div class="sprint-table-scroll" tabindex="0"><table><caption>' + esc(sheet.name) + ' · fictitious data</caption><thead><tr>' + sheet.headers.map(function (header) { return '<th scope="col">' + esc(header) + '</th>'; }).join('') + '</tr></thead><tbody>' + sheet.rows.map(function (row) { return '<tr>' + row.map(function (cell) { return '<td>' + esc(cell) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></details>';
    }).join('');
  }
  function coachMarkup(taskId, input) {
    var cached = coachCache.get(currentPackage.id + ':' + taskId);
    if (!cached || !input || cached.formula !== input.formula || cached.resultText !== resultText(input)) return '';
    var labels = { logic: 'Logic', robustness: 'Robustness', references: 'References', readability: 'Readability', efficiency: 'Efficiency', nextStep: 'Next step' };
    return '<h5>Formula coaching</h5><p class="sprint-muted">' + (cached.response.submissionCorrect ? 'Your submitted output matches.' : 'Your submitted output does not yet match.') + ' AI suggestions do not change your score.</p><dl>' + Object.keys(labels).map(function (field) { return '<div><dt>' + labels[field] + '</dt><dd>' + esc(cached.response.feedback[field]) + '</dd></div>'; }).join('') + '</dl>';
  }
  async function reviewFormula(taskId) {
    if (busy || !currentPackage || !coachingAvailable) return;
    if (!canOpen(currentPackage.id)) { message('Verify saved progress before requesting formula coaching.', true); return; }
    collectDrafts();
    var pkg = currentPackage, saved = record(pkg.id), input = saved.submissions[taskId];
    var task = pkg.tasks.concat(pkg.bonus ? [pkg.bonus] : []).find(function (item) { return item.id === taskId; });
    if (!task || !saved.tasks[taskId] || !saved.tasks[taskId].attempts) { message('Check this task’s result once before requesting formula coaching.', true); return; }
    var panel = mount.querySelector('[data-sprint-coach-panel="' + taskId + '"]');
    try {
      if (!input || !/^\s*=\s*\S/.test(input.formula)) throw new Error('Enter a formula beginning with =.');
      var result = parseResult(resultText(input), task.type);
      var cached = coachCache.get(pkg.id + ':' + taskId);
      if (cached && cached.formula === input.formula && cached.resultText === resultText(input)) { panel.innerHTML = coachMarkup(taskId, input); return; }
      var snapshot = { formula: input.formula, resultText: resultText(input) };
      busy = true;
      mount.querySelectorAll('[data-sprint-check], [data-sprint-coach], [data-sprint-action="grade-all"], [data-sprint-open]').forEach(function (button) { button.disabled = true; });
      panel.textContent = 'Reviewing your formula…';
      await persist();
      var previous = completed(P.packageId(P.packageNumber(pkg.id) - 1));
      var response = await request('/api/excel-sprint/coach', { packageId: pkg.id, taskId: taskId, formula: snapshot.formula, result: result, receipt: saved.receipt, predecessorToken: previous && previous.completionToken });
      if (response.packageId !== pkg.id || response.taskId !== taskId || !response.feedback) throw new Error('The coaching response was incomplete. Try again later.');
      collectDrafts();
      var latest = record(pkg.id).submissions[taskId];
      if (latest && latest.formula === snapshot.formula && resultText(latest) === snapshot.resultText) coachCache.set(pkg.id + ':' + taskId, { formula: snapshot.formula, resultText: snapshot.resultText, response: response });
      else message('Your answer changed during the review. Request coaching again for the revised formula.');
    } catch (error) { message(error.message, true); }
    finally { collectDrafts(); busy = false; renderAssignment(); }
  }
  function shell() {
    mount.innerHTML = '<div class="sprint-hero"><div><p class="sprint-eyebrow">Excel Formula Sprint · Microsoft 365</p><h2 id="sprint-heading">Learn it. Build it.<br><span>Prove it in Excel.</span></h2><p>Build formula fluency through short lessons and realistic, fictitious datasets. Each assignment unlocks when every required task is correct.</p></div><div class="sprint-hero-stats"><strong>10<span>levels</span></strong><strong>50<span>assignment packages</span></strong><p>Levels 1–6 are ready now.<br>30 assignments, from foundations to dynamic arrays.</p></div></div>' +
      '<div id="sprint-first-notice" class="sprint-notice"' + (state.noticeDismissed ? ' hidden' : '') + '><p>' + NOTICE + '</p><button type="button" data-sprint-action="dismiss-notice">Got it</button></div>' +
      '<div id="sprint-storage-warning" class="sprint-message sprint-message-error" role="alert" hidden></div>' +
      '<div class="sprint-toolbar"><a href="#sprint-assignment" class="sprint-button sprint-primary">Start / continue assignment</a><a href="#sprint-dashboard" class="sprint-button sprint-secondary">Your dashboard</a><button type="button" class="sprint-button sprint-secondary" data-sprint-action="export">Export backup</button><label class="sprint-button sprint-secondary" for="sprint-import">Import backup<input type="file" id="sprint-import" accept=".json,application/json" class="sprint-sr-only"></label><button type="button" class="sprint-link-button" data-sprint-action="reset">Reset progress</button></div>' +
      '<div id="sprint-reset-confirm" class="sprint-notice" hidden><p>Reset all Excel Formula Sprint progress saved in this browser? Export a backup first if you want to keep it.</p><div class="sprint-inline-actions"><button type="button" class="sprint-button sprint-danger" data-sprint-action="confirm-reset">Yes, reset Sprint progress</button><button type="button" class="sprint-button sprint-secondary" data-sprint-action="cancel-reset">Keep my progress</button></div></div>' +
      '<div id="sprint-backup-reminder" class="sprint-notice" hidden></div>' +
      '<div id="sprint-message" class="sprint-message" role="status" aria-live="polite" hidden></div>' +
      '<div class="sprint-path-heading"><div><p class="sprint-eyebrow">The full path</p><h3>Choose your next assignment</h3></div><div><p id="sprint-verification" class="sprint-muted">Checking saved completions…</p><button type="button" class="sprint-link-button" data-sprint-action="verify" id="sprint-verify-button" hidden>Verify saved progress</button></div></div><div id="sprint-map" class="sprint-map"></div>' +
      '<div id="sprint-assignment" class="sprint-assignment" tabindex="-1" aria-live="polite"></div>' +
      '<section id="sprint-dashboard" class="sprint-dashboard" aria-label="Excel Sprint progress dashboard"></section>' +
      '<p class="sprint-release-note">Coming in future releases: Levels 7–10, reinforcement drills, placement tests, Expert Track and a verified completion certificate. Existing Formula Fluency learning material remains below as a reference.</p>';
    renderSummary();
    storageNotice();
  }
  function renderSummary() {
    mount.querySelector('#sprint-map').innerHTML = catalog.levels.map(function (level) {
      var levelSolved = level.packages.filter(function (pkg) { return completed(pkg.id); }).length;
      return '<div class="sprint-level' + (!level.available ? ' sprint-level-upcoming' : '') + '"><div class="sprint-level-title"><span class="sprint-level-number">' + level.level + '</span><div><h4>' + esc(level.title) + '</h4><span class="sprint-muted">' + (level.available ? levelSolved + ' / 5 solved' : 'Future release') + '</span></div></div><p class="sprint-level-formulas">' + esc(level.formulas.join(' · ')) + '</p><div class="sprint-package-grid">' + level.packages.map(function (pkg, index) {
        var solved = !!completed(pkg.id);
        var open = canOpen(pkg.id);
        var started = state.packages[pkg.id] && (Object.keys(state.packages[pkg.id].submissions).length || Object.keys(state.packages[pkg.id].tasks).length);
        var readable = canRead(pkg.id);
        var status = !level.available ? 'Upcoming' : solved ? 'Solved' : !open && readable ? 'Saved lesson. Reconnect to verify progress' : !open ? 'Locked' : started ? 'In progress' : 'Ready';
        return '<button type="button" class="sprint-package' + (solved ? ' is-solved' : started && open ? ' is-started' : '') + (currentPackage && currentPackage.id === pkg.id ? ' is-selected' : '') + '" data-sprint-open="' + esc(pkg.id) + '" aria-label="' + esc(pkg.id + ': ' + pkg.title + '. ' + status) + '" title="' + esc(pkg.title + ' · ' + status) + '"' + (!readable ? ' disabled' : '') + (currentPackage && currentPackage.id === pkg.id ? ' aria-current="step"' : '') + '><span>A' + (index + 1) + '</span><small>' + (solved ? '✓' : !open ? '&#128274;' : '→') + '</small></button>';
      }).join('') + '</div><span class="sprint-map-legend">' + (level.available ? 'Sequential mastery gate' : 'Content in development') + '</span></div>';
    }).join('');
    mount.querySelector('#sprint-dashboard').innerHTML = D.render(state, completions, catalog);
    var verificationText = mount.querySelector('#sprint-verification');
    verificationText.textContent = verified ? 'Saved completions verified' : state.tokens.length ? 'Reconnect to verify saved completions' : 'Begin with L1-A1';
    mount.querySelector('#sprint-verify-button').hidden = verified || !state.tokens.length;
    var reminder = mount.querySelector('#sprint-backup-reminder');
    reminder.hidden = !state.backupReminder;
    if (state.backupReminder) reminder.innerHTML = '<p><strong>Level ' + state.backupReminder + ' complete.</strong> Export a backup so you can restore this milestone on another browser.</p><div class="sprint-inline-actions"><button type="button" class="sprint-button sprint-primary" data-sprint-action="export">Export progress backup</button><button type="button" class="sprint-link-button" data-sprint-action="dismiss-backup">Remind me next level</button></div>';
  }
  function taskMarkup(task, number, optional) {
    var saved = record(currentPackage.id);
    var input = saved.submissions[task.id];
    var status = saved.tasks[task.id];
    var typeLabel = task.type === 'array' ? 'Spilled array / output range' : task.type === 'number' ? 'Number' : 'Text';
    var feedback = status && status.attempts ? '<p class="sprint-task-feedback' + (status.correct ? ' sprint-correct' : ' sprint-incorrect') + '" role="status"><strong>' + (status.correct ? 'Correct' : 'Not yet correct') + ' · ' + status.attempts + ' attempt' + (status.attempts === 1 ? '' : 's') + '.</strong> ' + esc(status.hint || '') + (status.submissionCorrect === false && status.correct ? ' Your earlier correct result remains recorded.' : '') + '</p>' : '';
    return '<fieldset class="sprint-task' + (status && status.correct ? ' is-correct' : '') + '"><legend>' + (optional ? 'Optional bonus' : 'Task ' + number) + '</legend><p>' + esc(task.prompt) + '</p><div class="sprint-task-meta"><span>Output: <code>' + esc(task.output) + '</code></span><span>Result type: ' + typeLabel + '</span></div><label for="sprint-formula-' + task.id + '">Your Excel formula</label><textarea id="sprint-formula-' + task.id + '" data-sprint-formula-input="' + task.id + '" rows="2" maxlength="4096" spellcheck="false" placeholder="= Your formula" aria-describedby="sprint-help-' + task.id + '">' + esc(input && input.formula || '') + '</textarea><label for="sprint-result-' + task.id + '">Result produced in Excel</label><textarea id="sprint-result-' + task.id + '" data-sprint-result-input="' + task.id + '" rows="' + (task.type === 'array' ? 4 : 2) + '" maxlength="16000" spellcheck="false" placeholder="' + (task.type === 'array' ? 'Paste the output range from Excel' : task.type === 'number' ? 'For example, 12.75' : 'Paste the resulting text') + '">' + esc(resultText(input)) + '</textarea><p id="sprint-help-' + task.id + '" class="sprint-input-help">' + (task.type === 'array' ? 'Copy the requested cells from Excel. Keep rows on separate lines and columns separated by tabs.' : task.type === 'number' ? 'Use a decimal point if needed. Enter the value without units or thousands separators.' : 'Enter the text exactly as it appears in Excel.') + '</p><p class="sprint-input-error" data-sprint-task-error="' + task.id + '" role="alert" hidden></p><div class="sprint-task-actions"><button type="button" class="sprint-button sprint-secondary" data-sprint-check="' + task.id + '"' + (busy ? ' disabled' : '') + '>' + (status && status.correct ? 'Check revised answer' : optional ? 'Check bonus' : 'Check task') + '</button>' + (coachingAvailable ? '<button type="button" class="sprint-button sprint-secondary" data-sprint-coach="' + task.id + '"' + (busy || !status || !status.attempts ? ' disabled' : '') + '>Review my formula</button>' : '') + (status && status.correct ? '<span class="sprint-status sprint-status-good">Passed</span>' : '') + '</div>' + feedback + '<div data-sprint-coach-panel="' + task.id + '" class="sprint-coaching" aria-live="polite">' + coachMarkup(task.id, input) + '</div></fieldset>';
  }
  function renderAssignment() {
    var pkg = currentPackage;
    var target = mount.querySelector('#sprint-assignment');
    if (!pkg) return;
    var isSolved = !!completed(pkg.id);
    var lesson = pkg.lesson;
    var dataset = pkg.dataset;
    target.innerHTML = '<div class="sprint-assignment-heading"><div><p class="sprint-eyebrow">' + esc(pkg.id) + ' · Level ' + pkg.level + ' · Assignment ' + pkg.assignment + '</p><h3>' + esc(pkg.title) + '</h3><p class="sprint-muted">' + pkg.minutes + ' min · ' + esc(pkg.formulas.join(' + ')) + '</p></div><span class="sprint-status' + (isSolved ? ' sprint-status-good' : '') + '">' + (isSolved ? 'Solved · verified' : 'In progress') + '</span></div><p class="sprint-scenario">' + esc(pkg.scenario) + '</p>' +
      '<div class="sprint-lesson"><h4>Learn the formulas</h4><p>' + esc(lesson.intro) + '</p><div class="sprint-lesson-functions">' + lesson.functions.map(function (item) { return '<article class="sprint-function"><h5>' + esc(item.name) + '</h5><p>' + esc(item.purpose) + '</p><div class="sprint-formula-block"><code>' + esc(item.syntax) + '</code></div><p class="sprint-muted">' + esc(item.arguments) + '</p><div class="sprint-worked-example"><span class="sprint-eyebrow">Worked example</span><div class="sprint-formula-block"><code>' + esc(item.example) + '</code></div><p>Result: <strong>' + esc(item.result) + '</strong></p></div><p><strong>Use it for:</strong> ' + esc(item.useCase) + '</p><p><strong>Watch for:</strong> ' + esc(item.mistake) + '</p></article>'; }).join('') + '</div><p class="sprint-combine"><strong>Combine what you know.</strong> ' + esc(lesson.combine) + '</p></div>' +
      '<div class="sprint-dataset"><div class="sprint-dataset-heading"><div><h4>Your assignment dataset</h4><p>' + dataset.rowCount + ' fictitious records · Excel table <code>' + esc(dataset.tableName) + '</code></p></div><div class="sprint-inline-actions"><a class="sprint-button sprint-primary" href="' + esc(dataset.xlsx) + '" download>Download .xlsx</a><a class="sprint-button sprint-secondary" href="' + esc(dataset.csv) + '" download>Download .csv</a><button type="button" class="sprint-button sprint-secondary" data-sprint-action="copy">Copy for Excel</button></div></div><p class="sprint-muted">Open the workbook in Microsoft 365 Excel and solve the tasks there. The workbook has a data dictionary and an Answers sheet. For CSV or copied data, name the data sheet <code>Data</code>, create the table named above from the headings and records only, and add an <code>Answers</code> sheet. Keep the training footer outside the table.</p><div class="sprint-table-scroll" tabindex="0" role="region" aria-label="Assignment dataset, scroll horizontally for all columns"><table><caption>' + esc(pkg.id) + ' practice data</caption><thead><tr>' + dataset.headers.map(function (header) { return '<th scope="col">' + esc(header) + '</th>'; }).join('') + '</tr></thead><tbody>' + dataset.rows.map(function (row) { return '<tr>' + row.map(function (cell) { return '<td>' + esc(cell) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div><p class="sprint-data-footer">Fictitious data for training purposes.</p>' +
      (dataset.parameters && dataset.parameters.length ? '<div class="sprint-parameters"><h5>Parameters sheet</h5><p>For CSV or copied data, create a sheet named <code>Parameters</code> with these exact values and cells.</p><div class="sprint-table-scroll"><table><thead><tr><th scope="col">Cell</th><th scope="col">Parameter</th><th scope="col">Value</th></tr></thead><tbody>' + dataset.parameters.map(function (parameter) { return '<tr><td>' + esc(parameter.cell) + '</td><td>' + esc(parameter.name) + '</td><td>' + esc(parameter.value) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' : '') + supportingSheets(dataset) + '<details><summary>Column dictionary</summary><dl class="sprint-dictionary">' + dataset.columns.map(function (column) { return '<div><dt>' + esc(column.name) + '</dt><dd>' + esc(column.description) + '</dd></div>'; }).join('') + '</dl></details></div>' +
      '<div class="sprint-task-section"><h4>Prove your mastery</h4><p>Submit both your formula and its Excel result. Results determine your score; a formula must be present and well formed. Full solution reviews unlock after all required tasks pass.</p><p class="sprint-coaching-notice">' + (coachingAvailable ? 'After checking a task, choose Review my formula for AI feedback on logic, references, readability and efficiency. Your formula and result are sent for this review. AI suggestions can be mistaken; verify them in Excel.' : 'Formula coaching is temporarily unavailable. You can still check results and continue learning.') + '</p><div class="sprint-required-tasks">' + pkg.tasks.map(function (task, index) { return taskMarkup(task, index + 1, false); }).join('') + '</div><div class="sprint-grade-actions"><button type="button" class="sprint-button sprint-primary" data-sprint-action="grade-all"' + (busy || isSolved ? ' disabled' : '') + '>' + (busy ? 'Checking…' : isSolved ? 'All required tasks passed' : 'Check all unfinished tasks') + '</button><span class="sprint-muted">' + pkg.tasks.filter(function (task) { return record(pkg.id).tasks[task.id] && record(pkg.id).tasks[task.id].correct; }).length + ' / ' + pkg.tasks.length + ' required tasks passed</span></div></div>' +
      (pkg.bonus ? '<details class="sprint-bonus"><summary>Optional stretch challenge</summary><p class="sprint-muted">The bonus does not block progress.</p>' + taskMarkup(pkg.bonus, 0, true) + '</details>' : '') +
      '<div class="sprint-solutions">' + (isSolved ? '<div class="sprint-completion"><h4>Assignment complete</h4><p>Every required task passed. Your first-attempt score: <strong>' + record(pkg.id).firstAttemptScore + '%</strong>.</p><div class="sprint-inline-actions"><button type="button" class="sprint-button sprint-secondary" data-sprint-action="solutions">Review model solutions</button>' + (canOpen(P.packageId(P.packageNumber(pkg.id) + 1)) ? '<button type="button" class="sprint-button sprint-primary" data-sprint-open="' + P.packageId(P.packageNumber(pkg.id) + 1) + '">Continue to next assignment →</button>' : '<span class="sprint-muted">You have completed all currently released assignments.</span>') + '</div></div><div id="sprint-models"></div>' : '<p class="sprint-muted">Model solutions become available after this assignment is solved.</p>') + '</div>';
    renderSummary();
  }
  async function verifyTokens(tokens) {
    if (!tokens.length) return { verified: true, completions: [] };
    var response = await request('/api/excel-sprint/verify', { tokens: tokens });
    if (response.verified !== true || !Array.isArray(response.completions) || response.completions.length !== tokens.length) throw new Error('The saved completion record could not be verified. Import a valid backup or begin again.');
    return response;
  }
  async function verifySaved() {
    try {
      var response = await verifyTokens(state.tokens);
      completions = response.completions;
      verified = true;
      state = P.applyVerified(state, completions, catalog);
      await persist();
    } catch (error) {
      completions = [];
      verified = false;
      message(error.message + ' Saved answers and time remain available in your backup.', true);
    }
    renderSummary();
  }
  async function openPackage(id, focus) {
    if (!canRead(id)) { message('Complete the previous required assignments to unlock this package.', true); return; }
    collectDrafts();
    flushTime();
    activeSince = null;
    state.selectedPackageId = id;
    await persist();
    loadingId = id;
    var target = mount.querySelector('#sprint-assignment');
    target.innerHTML = '<p class="sprint-loading" role="status">Loading ' + esc(id) + '…</p>';
    try {
      var pkg = packageCache.get(id) || await request(BASE + 'packages/' + id + '.json');
      if (loadingId !== id) return;
      if (!pkg || pkg.id !== id || !pkg.lesson || !pkg.dataset || !Array.isArray(pkg.tasks)) throw new Error('This assignment could not be loaded. Please try again.');
      packageCache.set(id, pkg);
      currentPackage = pkg;
      record(id);
      activeSince = document.hidden ? null : Date.now();
      renderAssignment();
      if (focus) target.focus({ preventScroll: true });
      if (focus) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      if (loadingId !== id) return;
      currentPackage = null;
      target.innerHTML = '<p class="sprint-message sprint-message-error" role="alert">' + esc(error.message) + '</p><button type="button" class="sprint-button sprint-primary" data-sprint-open="' + esc(id) + '">Retry loading assignment</button>';
    }
  }
  async function grade(taskIds) {
    if (busy || !currentPackage) return;
    if (!canOpen(currentPackage.id)) { message('Reconnect and verify saved progress before submitting this assignment.', true); return; }
    var pkg = currentPackage;
    var submissions = [];
    var valid = true;
    collectDrafts();
    pkg.tasks.concat(pkg.bonus ? [pkg.bonus] : []).forEach(function (task) {
      if (!taskIds.includes(task.id)) return;
      var errorTarget = mount.querySelector('[data-sprint-task-error="' + task.id + '"]');
      errorTarget.hidden = true;
      var formulaInput = mount.querySelector('[data-sprint-formula-input="' + task.id + '"]');
      var resultInput = mount.querySelector('[data-sprint-result-input="' + task.id + '"]');
      try {
        var formula = formulaInput.value.trim();
        if (!formula || formula[0] !== '=' || formula.length < 2) throw new Error('Enter your Excel formula beginning with =.');
        submissions.push({ taskId: task.id, formula: formula, result: parseResult(resultInput.value, task.type) });
      } catch (error) { valid = false; errorTarget.textContent = error.message; errorTarget.hidden = false; }
    });
    flushTime();
    persist();
    if (!valid) { message('Finish the highlighted formula and result fields before checking.', true); return; }
    if (!submissions.length) { message('All required tasks have already passed.'); return; }
    busy = true;
    mount.querySelectorAll('[data-sprint-check], [data-sprint-coach], [data-sprint-action="grade-all"], [data-sprint-open]').forEach(function (button) { button.disabled = true; });
    message('Checking your submitted results…');
    try {
      var saved = record(pkg.id);
      var predecessor = completed(P.packageId(P.packageNumber(pkg.id) - 1));
      var response = await request('/api/excel-sprint/grade', { packageId: pkg.id, submissions: submissions, predecessorToken: predecessor && predecessor.completionToken, receipt: saved.receipt });
      if (response.packageId !== pkg.id || !Array.isArray(response.tasks) || typeof response.receipt !== 'string') throw new Error('The grading response was incomplete. Your previous progress has been kept.');
      saved.receipt = response.receipt;
      saved.score = response.score;
      saved.firstAttemptScore = response.firstAttemptScore;
      response.tasks.concat(response.bonus ? [response.bonus] : []).forEach(function (task) { saved.tasks[task.taskId] = task; });
      studyDay();
      if (response.completed && response.completionToken) {
        var oldCount = completions.length;
        var pendingTokens = state.tokens.slice();
        if (!completed(pkg.id)) pendingTokens.push(response.completionToken);
        state.tokens = pendingTokens;
        verified = false;
        var verification = await verifyTokens(pendingTokens);
        completions = verification.completions;
        verified = true;
        state = P.applyVerified(state, completions, catalog);
        if (completions.length > oldCount && completions.length % 5 === 0) state.backupReminder = completions.length / 5;
        message(completions.length === releasedCount() ? 'Assignment complete. You have solved all ' + releasedCount() + ' currently released assignments.' : 'Assignment complete. All required tasks are correct and your next assignment is unlocked.');
      } else message('Results checked. Review the feedback beside each submitted task.');
      await persist();
    } catch (error) { message(error.message, true); await persist(); }
    finally { busy = false; renderAssignment(); }
  }
  async function solutions() {
    if (!currentPackage || !completed(currentPackage.id)) return;
    var pkg = currentPackage;
    var target = mount.querySelector('#sprint-models');
    target.innerHTML = '<p role="status">Loading solution review…</p>';
    try {
      var models = solutionCache.get(pkg.id) || await request('/api/excel-sprint/solutions', { packageId: pkg.id, completionToken: completed(pkg.id).completionToken });
      if (!currentPackage || currentPackage.id !== pkg.id) return;
      solutionCache.set(pkg.id, models);
      target.innerHTML = '<h4>Model solutions and alternatives</h4>' + models.tasks.concat(models.bonus ? [models.bonus] : []).map(function (task) { return '<article class="sprint-model"><h5>' + (task.taskId === 'bonus' ? 'Optional bonus' : 'Task ' + esc(task.taskId.slice(1))) + '</h5><div class="sprint-formula-block"><code>' + esc(task.model) + '</code></div>' + (task.note ? '<p class="sprint-muted">' + esc(task.note) + '</p>' : '') + (task.alternatives && task.alternatives.length ? '<p class="sprint-muted">Alternative approaches</p>' + task.alternatives.map(function (formula) { return '<div class="sprint-formula-block"><code>' + esc(formula) + '</code></div>'; }).join('') : '') + '</article>'; }).join('');
    } catch (error) { target.innerHTML = '<p class="sprint-message sprint-message-error" role="alert">' + esc(error.message) + '</p>'; }
  }
  function exportBackup() {
    collectDrafts();
    flushTime();
    persist();
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'Excel-Formula-Sprint-progress-' + dayStamp() + '.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    message('Progress backup downloaded. Keep it somewhere you can find it later.');
  }
  async function importBackup(file) {
    if (!file || busy) return;
    busy = true;
    message('Validating the backup and its completed assignments…');
    try {
      if (file.size > P.MAX_BACKUP_BYTES) throw new Error('Choose a progress JSON file smaller than 2 MB.');
      var candidate = P.parseBackup(await file.text());
      var response = await verifyTokens(candidate.tokens);
      // The current record is replaced only after the whole imported chain verifies.
      collectDrafts();
      flushTime();
      activeSince = null;
      completions = response.completions;
      verified = true;
      state = P.applyVerified(candidate, completions, catalog);
      state.noticeDismissed = true;
      if (!canOpen(state.selectedPackageId)) state.selectedPackageId = P.packageId(Math.min(completions.length + 1, releasedCount()));
      solutionCache.clear();
      coachCache.clear();
      currentPackage = null;
      await persist();
      shell();
      await openPackage(state.selectedPackageId, false);
      message('Backup restored. Verified completions and saved assignment work are available.');
    } catch (error) { message(error.message + ' Your current progress has not been replaced.', true); }
    finally { busy = false; var input = mount.querySelector('#sprint-import'); if (input) input.value = ''; }
  }
  async function copyDataset(sheetName) {
    if (!currentPackage) return;
    var data = currentPackage.dataset;
    if (sheetName) data = (data.sheets || []).find(function (sheet) { return sheet.name === sheetName; });
    if (!data) return;
    var tsv = [data.headers].concat(data.rows).map(function (row) { return row.map(function (value) { var text = String(value); return /[\t\n\r"]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text; }).join('\t'); }).join('\n') + '\n\n' + (data.disclaimer || 'Fictitious data for training purposes.');
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard is unavailable');
      await navigator.clipboard.writeText(tsv);
      message('Dataset copied. Paste into cell A1 of ' + (sheetName || 'Data') + ' in Excel, keeping the footer outside the data table.');
    } catch (_) {
      var target = mount.querySelector('.sprint-dataset');
      var previous = mount.querySelector('#sprint-copy-fallback');
      if (previous) previous.remove();
      var container = document.createElement('div');
      container.id = 'sprint-copy-fallback';
      container.innerHTML = '<label for="sprint-tsv">Copy this tab-separated dataset manually</label><textarea id="sprint-tsv" rows="6" readonly></textarea>';
      target.appendChild(container);
      var area = container.querySelector('textarea');
      area.value = tsv;
      area.focus();
      area.select();
      message('Automatic clipboard access is unavailable. Copy the selected data manually.');
    }
  }
  mount.addEventListener('click', async function (event) {
    var opener = event.target.closest('[data-sprint-open]');
    if (opener && !opener.disabled && !busy) { await openPackage(opener.dataset.sprintOpen, true); return; }
    var check = event.target.closest('[data-sprint-check]');
    if (check && !check.disabled) { await grade([check.dataset.sprintCheck]); return; }
    var coach = event.target.closest('[data-sprint-coach]');
    if (coach && !coach.disabled) { await reviewFormula(coach.dataset.sprintCoach); return; }
    var button = event.target.closest('[data-sprint-action]');
    if (!button) return;
    var action = button.dataset.sprintAction;
    if (action === 'export') exportBackup();
    if (busy) return;
    if (action === 'grade-all') await grade(currentPackage.tasks.filter(function (task) { return !(record(currentPackage.id).tasks[task.id] && record(currentPackage.id).tasks[task.id].correct); }).map(function (task) { return task.id; }));
    if (action === 'solutions') await solutions();
    if (action === 'verify') { await verifySaved(); if (currentPackage) renderAssignment(); }
    if (action === 'copy') await copyDataset(button.dataset.sprintSheet);
    if (action === 'dismiss-notice') { state.noticeDismissed = true; mount.querySelector('#sprint-first-notice').hidden = true; await persist(); }
    if (action === 'dismiss-backup') { state.backupReminder = null; await persist(); renderSummary(); }
    if (action === 'reset') { mount.querySelector('#sprint-reset-confirm').hidden = false; }
    if (action === 'cancel-reset') mount.querySelector('#sprint-reset-confirm').hidden = true;
    if (action === 'confirm-reset') {
      state = P.emptyState();
      completions = [];
      verified = true;
      currentPackage = null;
      activeSince = null;
      solutionCache.clear();
      coachCache.clear();
      await persist();
      shell();
      await openPackage('L1-A1', false);
      message('Excel Formula Sprint progress reset. Begin again with L1-A1.');
    }
  });
  mount.addEventListener('change', function (event) { if (event.target.id === 'sprint-import') importBackup(event.target.files[0]); });
  mount.addEventListener('input', function (event) {
    if (event.target.id === 'sprint-formula-search') {
      var query = event.target.value.trim().toLowerCase();
      var found = 0;
      mount.querySelectorAll('[data-sprint-formula]').forEach(function (item) { item.hidden = !item.dataset.sprintFormula.includes(query); if (!item.hidden) found++; });
      mount.querySelector('#sprint-formula-empty').hidden = found > 0;
      return;
    }
    if (event.target.matches('[data-sprint-formula-input], [data-sprint-result-input]')) {
      var taskId = event.target.dataset.sprintFormulaInput || event.target.dataset.sprintResultInput;
      if (currentPackage) coachCache.delete(currentPackage.id + ':' + taskId);
      var panel = mount.querySelector('[data-sprint-coach-panel="' + taskId + '"]');
      if (panel) panel.textContent = '';
      clearTimeout(draftTimer);
      draftTimer = setTimeout(function () { collectDrafts(); persist(); }, 400);
    }
  });
  document.addEventListener('visibilitychange', function () {
    collectDrafts();
    flushTime();
    activeSince = !document.hidden && currentPackage ? Date.now() : null;
    persist();
  });
  window.addEventListener('pagehide', function () { collectDrafts(); flushTime(); activeSince = null; persist(); });
  window.addEventListener('online', async function () {
    if (verified || busy || !catalog) return;
    await verifySaved();
    if (verified && canOpen(state.selectedPackageId)) await openPackage(state.selectedPackageId, false);
  });
  setInterval(function () { if (currentPackage && !document.hidden) { flushTime(); collectDrafts(); persist(); } }, 15000);
  async function initialize() {
    mount.innerHTML = '<p class="sprint-loading" role="status">Loading Excel Formula Sprint…</p>';
    try {
      var values = await Promise.all([store.load(), request(BASE + 'catalog.json')]);
      state = values[0];
      catalog = values[1];
      if (!catalog || !Array.isArray(catalog.levels) || catalog.levels.length !== 10) throw new Error('The curriculum could not be loaded.');
      try { coachingAvailable = (await request('/api/excel-sprint/coaching-status')).available === true; } catch (_) { coachingAvailable = false; }
      shell();
      await verifySaved();
      if (!canRead(state.selectedPackageId)) state.selectedPackageId = 'L1-A1';
      await openPackage(state.selectedPackageId, false);
    } catch (error) {
      mount.innerHTML = '<p class="sprint-message sprint-message-error" role="alert">' + esc(error.message) + '</p><button type="button" class="sprint-button sprint-primary" id="sprint-retry-init">Retry loading Sprint</button>';
      mount.querySelector('#sprint-retry-init').addEventListener('click', initialize);
    }
  }
  initialize();
})();
