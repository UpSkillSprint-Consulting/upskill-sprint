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
  var stateLoaded = false;
  var stateLoadFailed = false;
  var catalog;
  var completions = [];
  var expertCompletions = [];
  var learnerName = '';
  var stateEpoch = 0;
  var packageLoadSequence = 0;
  var coachingStatusCheck = 0;
  var checkingCoaching = false;
  var latestCertificate = null;
  var certificateError = '';
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
  var receiptCache = new Map();
  var receiptStatus = new Map();
  var learningApp = null;
  var storageConflict = false;
  var initialHash = window.location.hash;
  var initialAnchorCancelled = false;
  function releasedCount() { return catalog.levels.filter(function (level) { return level.available; }).reduce(function (n, level) { return n + level.packages.length; }, 0); }
  var NOTICE = 'Your progress is saved in this browser only. Clearing browser data or switching devices will lose it unless you export a backup.';

  async function request(url, body) {
    var changesProgress = body !== undefined && (['/api/excel-sprint/grade', '/api/excel-sprint/coach', '/api/excel-sprint/certificate'].includes(url) || url === '/api/excel-sprint/learning' && ['grade', 'diagnostic'].includes(body.action));
    if (changesProgress && !await mutationReady()) throw new Error('Progress changed in another tab. Export this tab’s drafts, then reload the latest progress before continuing.');
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timeout = controller ? setTimeout(function () { controller.abort(); }, 20000) : null;
    try {
      var response = await fetch(url, body === undefined ? { signal: controller && controller.signal } : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller && controller.signal, cache: 'no-store' });
      var data;
      try { data = await response.json(); } catch (_) { throw new Error('The service returned an unreadable response. Please try again.'); }
      if (!response.ok) { var serviceError = new Error(data.message || data.error || 'The service is unavailable. Your saved work is still here. Please try again.'); serviceError.status = response.status; throw serviceError; }
      if (changesProgress && !await mutationReady()) throw new Error('Progress changed in another tab while this request was running. Your drafts are still available for export. Reload the latest progress before continuing.');
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
    var status = store.status();
    if (status.externalUpdate && !storageConflict) {
      storageConflict = true;
      stateEpoch++;
      packageLoadSequence++;
      coachingStatusCheck++;
      checkingCoaching = false;
      busy = false;
      var assignment = mount.querySelector('#sprint-assignment');
      if (assignment && !currentPackage) assignment.innerHTML = '<p class="sprint-message" role="status">Assignment loading paused because progress changed in another tab. Export this tab’s saved work, then reload the latest progress.</p>';
    }
    var target = mount.querySelector('#sprint-storage-warning');
    if (storageConflict && !target) {
      bootstrapRecovery();
      target = mount.querySelector('#sprint-storage-warning');
    }
    if (target) {
      if (storageConflict) {
        if (!target.querySelector('[data-sprint-action="reload-progress"]')) target.innerHTML = '<p><strong>Progress changed in another open tab.</strong> This tab is paused to protect the latest work. Export a backup of this tab’s drafts before reloading.</p><button type="button" class="sprint-button sprint-primary" data-sprint-action="reload-progress">Reload latest progress</button>';
        target.hidden = false;
      } else { target.textContent = status.warning; target.hidden = !status.warning; }
    }
    return !storageConflict;
  }
  async function persist(options) {
    if (!storageNotice()) return;
    try { await store.save(state, options); storageNotice(); } catch (_) {
      var target = mount.querySelector('#sprint-storage-warning');
      if (target) { target.hidden = false; target.textContent = 'Your work could not be saved. Export a backup before leaving this page.'; }
    }
  }
  async function mutationReady() {
    if (!storageNotice()) return false;
    collectDrafts();
    flushTime();
    await persist();
    return storageNotice();
  }
  function record(id) {
    if (!state.packages[id]) state.packages[id] = { submissions: {}, tasks: {}, timeMs: 0 };
    return state.packages[id];
  }
  function receiptPending(id) { var saved = state.packages[id]; return !!(saved && saved.receipt && receiptCache.get(id) !== saved.receipt); }
  function canCheck(id) { return canOpen(id) && !receiptPending(id); }
  function visibleRecord(id) {
    var saved = record(id);
    if (!receiptPending(id)) {
      if (!saved.receipt && completed(id) && saved.tasks.bonus) { var local = Object.assign({}, saved, {tasks:Object.assign({}, saved.tasks)}); local.tasks.bonus = Object.assign({}, saved.tasks.bonus, {unverified:true}); return local; }
      return saved;
    }
    var copy = Object.assign({}, saved, {tasks:{}});
    if (completed(id)) Object.keys(saved.tasks).forEach(function (taskId) { if (taskId !== 'bonus') { copy.tasks[taskId] = Object.assign({}, saved.tasks[taskId]); delete copy.tasks[taskId].checkedSubmission; delete copy.tasks[taskId].submissionCorrect; } });
    else { delete copy.score; delete copy.firstAttemptScore; delete copy.solvedAt; }
    return copy;
  }
  function visibleState() {
    var copy = Object.assign({}, state, {packages:Object.assign({}, state.packages)});
    Object.keys(copy.packages).forEach(function (id) { copy.packages[id] = visibleRecord(id); });
    return copy;
  }
  function findPackage(id) {
    if (isExpert(id)) {
      var expert = catalog.expert && catalog.expert.packages.find(function (pkg) { return pkg.id === id; });
      return expert ? {level:{available:true},pkg:expert} : null;
    }
    for (var index = 0; index < catalog.levels.length; index++) {
      var level = catalog.levels[index];
      var item = level.packages.find(function (pkg) { return pkg.id === id; });
      if (item) return { level: level, pkg: item };
    }
    return null;
  }
  function canOpen(id) {
    var item = findPackage(id);
    if (isExpert(id)) return !!item && verified && catalog.expert.requiredCoreIds.every(function (key) { return completed(key); }) && catalog.expert.packages.slice(0, +id.slice(-1) - 1).every(function (pkg) { return completed(pkg.id); });
    return !!item && verified && P.unlocked(id, completions, item.level.available);
  }
  function canRead(id) {
    var item = findPackage(id);
    return canOpen(id) || !verified && !!item && item.level.available && !!state.packages[id];
  }
  function isExpert(id) { return /^EX-A[1-3]$/.test(id); }
  function completed(id) { return completions.concat(expertCompletions).find(function (entry) { return entry.packageId === id; }); }
  function previousId(id) { return isExpert(id) ? id === 'EX-A1' ? 'L6-A5' : 'EX-A' + (+id.slice(-1) - 1) : P.packageId(P.packageNumber(id) - 1); }
  function nextId(id) { return isExpert(id) ? 'EX-A' + (+id.slice(-1) + 1) : P.packageNumber(id) === releasedCount() ? null : P.packageId(P.packageNumber(id) + 1); }
  function dayStamp() {
    return D.dayStamp();
  }
  async function restoreInitialAnchor(epoch) {
    if (!/^#sprint-(?:assignment|learning|expert|dashboard|certificates)$/.test(initialHash) || initialAnchorCancelled) return;
    // Practice can still change the height above the lower Sprint sections after
    // the core lesson has loaded. Finish its bootstrap before restoring the URL.
    if (learningApp) await learningApp.refresh();
    var schedule = typeof window.requestAnimationFrame === 'function' ? window.requestAnimationFrame.bind(window) : function (callback) { window.setTimeout(callback, 0); };
    schedule(function () {
      if (epoch !== stateEpoch || initialAnchorCancelled || window.location.hash !== initialHash) return;
      var target = document.getElementById(initialHash.slice(1));
      if (!target || !mount.contains(target)) return;
      target.setAttribute('tabindex', '-1');
      target.focus({preventScroll:true});
      target.scrollIntoView({behavior:'auto',block:'start'});
    });
  }
  function studyDay() { var day = dayStamp(); if (!state.activityDays.includes(day)) state.activityDays.push(day); }
  function flushTime() {
    if (activeSince !== null && currentPackage) {
      record(currentPackage.id).timeMs += Math.max(0, Date.now() - activeSince);
      activeSince = document.hidden ? null : Date.now();
    }
  }
  function collectDrafts() {
    if (learningApp) learningApp.collectDrafts();
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
    if (!storageNotice()) { message('Export this tab’s drafts, then reload the latest progress before requesting coaching.', true); return; }
    if (!canCheck(currentPackage.id)) { message('Verify saved progress and task history before requesting formula coaching.', true); return; }
    collectDrafts();
    var pkg = currentPackage, saved = record(pkg.id), input = saved.submissions[taskId];
    message('');
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
      var previous = completed(previousId(pkg.id));
      var response = await request('/api/excel-sprint/coach', { packageId: pkg.id, taskId: taskId, formula: snapshot.formula, result: result, receipt: saved.receipt, predecessorToken: previous && previous.completionToken });
      if (response.packageId !== pkg.id || response.taskId !== taskId || !response.feedback) throw new Error('The coaching response was incomplete. Try again later.');
      collectDrafts();
      var latest = record(pkg.id).submissions[taskId];
      if (latest && latest.formula === snapshot.formula && resultText(latest) === snapshot.resultText) coachCache.set(pkg.id + ':' + taskId, { formula: snapshot.formula, resultText: snapshot.resultText, response: response });
      else message('Your answer changed during the review. Request coaching again for the revised formula.');
    } catch (error) { message(error.message, true); }
    finally { collectDrafts(); busy = false; if (!storageConflict) renderAssignment(); }
  }
  async function retryCoaching() {
    collectDrafts();
    busy = true;
    message('Checking formula coaching availability…');
    try {
      coachingAvailable = (await request('/api/excel-sprint/coaching-status')).available === true;
      message(coachingAvailable ? 'Formula coaching is available. Check a task, then choose Review my formula.' : 'Formula coaching is temporarily unavailable. Try again later; result checks remain available.');
    } catch (error) { message(error.message, true); }
    finally { collectDrafts(); busy = false; if (!storageConflict) renderAssignment(); }
  }
  function coachingNotice() {
    if (coachingAvailable) return 'After checking a task, choose Review my formula for AI feedback on logic, references, readability and efficiency. Your formula and result are sent for this review. AI suggestions can be mistaken; verify them in Excel.';
    return (checkingCoaching ? 'Checking optional formula coaching. ' : 'Formula coaching is temporarily unavailable. ') + 'Result checks remain available. <button type="button" class="sprint-link-button" data-sprint-action="retry-coaching">Retry formula coaching</button>';
  }
  async function checkCoachingInBackground(epoch) {
    var check = ++coachingStatusCheck;
    checkingCoaching = true;
    try { var result = await request('/api/excel-sprint/coaching-status'); if (epoch !== stateEpoch || check !== coachingStatusCheck) return; coachingAvailable = result.available === true; }
    catch (_) { if (epoch !== stateEpoch || check !== coachingStatusCheck) return; coachingAvailable = false; }
    if (epoch !== stateEpoch || check !== coachingStatusCheck) return;
    checkingCoaching = false;
    var notice = mount.querySelector('.sprint-coaching-notice');
    if (notice) notice.innerHTML = coachingNotice();
    if (!currentPackage || !coachingAvailable) return;
    currentPackage.tasks.concat(currentPackage.bonus ? [currentPackage.bonus] : []).forEach(function (task) {
      var checkButton = mount.querySelector('[data-sprint-check="' + task.id + '"]');
      if (!checkButton || mount.querySelector('[data-sprint-coach="' + task.id + '"]')) return;
      var status = visibleRecord(currentPackage.id).tasks[task.id];
      checkButton.insertAdjacentHTML('afterend', '<button type="button" class="sprint-button sprint-secondary" data-sprint-coach="' + esc(task.id) + '"' + (busy || !canCheck(currentPackage.id) || !status || status.unverified || !status.attempts ? ' disabled' : '') + '>Review my formula</button>');
    });
  }
  function backupTextPanel() {
    return '<section id="sprint-backup-text-panel" class="sprint-notice" aria-labelledby="sprint-backup-text-heading" hidden><h4 id="sprint-backup-text-heading">Save your progress as text</h4><p>Copy the complete text into a plain text file. Save it with a .json extension, then use Import backup to restore it.</p><label for="sprint-backup-text">Complete progress JSON</label><textarea id="sprint-backup-text" rows="8" readonly spellcheck="false"></textarea><div class="sprint-inline-actions"><button type="button" class="sprint-button" data-sprint-action="copy-backup-text">Copy backup text</button><button type="button" class="sprint-button" data-sprint-action="close-backup-text">Close backup text</button></div></section>';
  }
  function bootstrapRecovery() {
    if (!mount.querySelector('#sprint-bootstrap-recovery')) mount.innerHTML = '<section id="sprint-bootstrap-recovery" aria-label="Saved progress recovery"><div id="sprint-storage-warning" class="sprint-message sprint-message-error" role="alert"></div><p id="sprint-bootstrap-backup-status" role="status"></p><div class="sprint-inline-actions"><button type="button" class="sprint-button" data-sprint-action="export">Export backup</button><button type="button" class="sprint-button" data-sprint-action="backup-text">Show backup text</button></div>' + backupTextPanel() + '<div id="sprint-message" class="sprint-message" role="status" aria-live="polite" hidden></div></section>';
    mount.querySelector('#sprint-bootstrap-backup-status').textContent = stateLoaded ? 'This tab’s saved assignment work is available for export. Reload to continue with the latest progress.' : stateLoadFailed ? 'Saved work could not be read in this tab. Reload the latest progress or use a previously exported backup.' : 'Reading this tab’s saved work. Backup export will be available when it finishes. You can reload the latest progress now.';
    mount.querySelectorAll('[data-sprint-action="export"], [data-sprint-action="backup-text"]').forEach(function (button) { button.disabled = !stateLoaded; });
  }
  function shell() {
    if (learningApp && learningApp.destroy) learningApp.destroy();
    learningApp = null;
    mount.innerHTML = '<div class="sprint-hero"><div><p class="sprint-eyebrow">Excel Formula Sprint · Microsoft 365</p><h2 id="sprint-heading">Learn it. Build it.<br><span>Prove it in Excel.</span></h2><p>Build formula fluency through short lessons and realistic, fictitious datasets. Each assignment unlocks when every required task is correct.</p></div><div class="sprint-hero-stats"><strong>10<span>levels</span></strong><strong>50<span>assignment packages</span></strong><p>All 10 levels are ready.<br>50 assignments, from foundations to integrated dashboards.</p></div></div>' +
      '<div id="sprint-first-notice" class="sprint-notice"' + (state.noticeDismissed ? ' hidden' : '') + '><p>' + NOTICE + '</p><button type="button" data-sprint-action="dismiss-notice">Got it</button></div>' +
      '<div id="sprint-storage-warning" class="sprint-message sprint-message-error" role="alert" hidden></div>' +
      '<div class="sprint-toolbar"><a href="#sprint-assignment" class="sprint-button sprint-primary">Start / continue assignment</a><a href="#sprint-learning" class="sprint-button sprint-secondary">Placement &amp; practice</a><a href="#sprint-expert" class="sprint-button sprint-secondary">Expert Track</a><a href="#sprint-certificates" class="sprint-button sprint-secondary">Certificates</a><a href="#sprint-dashboard" class="sprint-button sprint-secondary">Your dashboard</a><button type="button" class="sprint-button sprint-secondary" data-sprint-action="export">Export backup</button><label class="sprint-button sprint-secondary" for="sprint-import">Import backup<input type="file" id="sprint-import" accept=".json,application/json" class="sprint-sr-only"></label><button type="button" class="sprint-link-button" data-sprint-action="reset" aria-controls="sprint-reset-confirm" aria-expanded="false">Reset progress</button></div>' +
      '<div class="sprint-inline-actions"><button type="button" class="sprint-link-button" data-sprint-action="backup-text">Show backup text</button><span class="sprint-muted">Use this if a backup download does not appear.</span></div>' + backupTextPanel() +
      '<div id="sprint-reset-confirm" class="sprint-notice" hidden><p>Reset all Excel Formula Sprint progress saved in this browser? Export a backup first if you want to keep it.</p><div class="sprint-inline-actions"><button type="button" class="sprint-button sprint-danger" data-sprint-action="confirm-reset">Yes, reset Sprint progress</button><button type="button" class="sprint-button sprint-secondary" data-sprint-action="cancel-reset">Keep my progress</button></div></div>' +
      '<div id="sprint-backup-reminder" class="sprint-notice" hidden></div>' +
      '<div id="sprint-message" class="sprint-message" role="status" aria-live="polite" hidden></div>' +
      '<section id="sprint-learning" class="sprint-learning" aria-label="Placement and targeted practice"></section>' +
      '<div class="sprint-path-heading"><div><p class="sprint-eyebrow">The full path</p><h3>Choose your next assignment</h3></div><div><p id="sprint-verification" class="sprint-muted">Checking saved completions…</p><button type="button" class="sprint-link-button" data-sprint-action="verify" id="sprint-verify-button" hidden>Verify saved progress</button></div></div><div id="sprint-map" class="sprint-map"></div>' +
      '<section id="sprint-expert" class="sprint-expert" aria-label="Expert Track capstones"></section>' +
      '<div id="sprint-assignment" class="sprint-assignment" tabindex="-1" aria-live="polite"></div>' +
      '<section id="sprint-dashboard" class="sprint-dashboard" aria-label="Excel Sprint progress dashboard"></section>' +
      '<section id="sprint-certificates" class="sprint-certificates" aria-label="Completion certificates"></section>' +
      '<p class="sprint-release-note">All 50 core assignments, placement guidance, targeted practice and the full Levels 1–10 certificate are available. Expert Track v1 is a separate three-capstone route after Levels 1–6. Existing Formula Fluency learning material remains below as a reference.</p>';
    if (window.ExcelSprintLearningApp) learningApp = window.ExcelSprintLearningApp.mount({
      element: mount.querySelector('#sprint-learning'),
      getState: function () { return state.learning; },
      saveState: function (learning) { state.learning = learning; return persist(); },
      getCompletions: function () { return completions; },
      canChangeProgress: storageNotice,
      openCore: function (id) {
        if (busy) { message('Wait for the result check to finish before changing assignments.'); return; }
        return openPackage(id, true);
      },
      request: request
    });
    renderSummary();
    storageNotice();
  }
  function renderSummary() {
    if (learningApp) learningApp.refresh();
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
    mount.querySelector('#sprint-dashboard').innerHTML = D.render(visibleState(), completions.concat(expertCompletions), catalog, store.status());
    renderExpert();
    renderCertificates();
    var verificationText = mount.querySelector('#sprint-verification');
    verificationText.textContent = verified ? 'Saved completions verified' : state.tokens.length ? 'Reconnect to verify saved completions' : 'Begin with L1-A1';
    mount.querySelector('#sprint-verify-button').hidden = verified || !state.tokens.length;
    var reminder = mount.querySelector('#sprint-backup-reminder');
    reminder.hidden = !state.backupReminder;
    if (state.backupReminder) reminder.innerHTML = '<p><strong>Level ' + state.backupReminder + ' complete.</strong> Export a backup so you can restore this milestone on another browser.</p><div class="sprint-inline-actions"><button type="button" class="sprint-button sprint-primary" data-sprint-action="export">Export progress backup</button><button type="button" class="sprint-link-button" data-sprint-action="dismiss-backup">Remind me next level</button></div>';
  }
  function renderExpert() {
    var expert = catalog.expert;
    if (!expert) return;
    mount.querySelector('#sprint-expert').innerHTML = '<p class="sprint-eyebrow">Apply your skills</p><h3>Expert Track</h3><p>Three integrated capstones: reconcile a release queue, aggregate duplicate Charpy measurements and audit an inventory dashboard. Unlock after all 30 core assignments in Levels 1–6 are verified.</p><p class="sprint-muted">' + Math.min(completions.length, 30) + ' / 30 prerequisite assignments · ' + expertCompletions.length + ' / 3 capstones verified. Each capstone has four required tasks and an optional bonus.</p><div class="sprint-expert-grid">' + expert.packages.map(function (pkg) {
      var open = canOpen(pkg.id), solved = !!completed(pkg.id), readable = canRead(pkg.id);
      return '<article><p class="sprint-eyebrow">' + esc(pkg.id) + '</p><h4>' + esc(pkg.title) + '</h4><p>' + esc(pkg.formulas.join(' + ')) + '</p><span class="sprint-status' + (solved ? ' sprint-status-good' : '') + '">' + (solved ? 'Solved · verified' : open ? 'Ready' : 'Locked') + '</span><p><button type="button" class="sprint-button sprint-secondary" data-sprint-open="' + esc(pkg.id) + '"' + (!readable || busy ? ' disabled' : '') + '>' + (solved ? 'Review capstone' : 'Open capstone') + '</button></p></article>';
    }).join('') + '</div>';
  }
  function renderCertificates() {
    var coreReady = verified && completions.length >= 30;
    mount.querySelector('#sprint-certificates').innerHTML = '<p class="sprint-eyebrow">Your completion record</p><h3>Certificates</h3><p>Earn a Levels 1–6 certificate after 30 core assignments, a full Levels 1–10 certificate after all 50, or an Expert Track certificate after the first 30 and all three capstones. Every required task must pass. Bonuses and first-attempt scores do not block an award.</p><label for="sprint-certificate-name">Learner name to display</label><input id="sprint-certificate-name" type="text" maxlength="80" autocomplete="name" value="' + esc(learnerName) + '"' + (busy ? ' disabled' : '') + '><p class="sprint-muted">This name is self-reported and will appear in the shareable proof. Certificates verify submitted results and signed progress; they do not verify identity or Excel formula execution.</p><div class="sprint-inline-actions"><button type="button" class="sprint-button sprint-secondary" data-sprint-action="certificate-levels-1-6"' + (!coreReady || busy ? ' disabled' : '') + '>Create Levels 1–6 certificate</button><button type="button" class="sprint-button sprint-primary" data-sprint-action="certificate-expert-track-v1"' + (!coreReady || expertCompletions.length !== 3 || busy ? ' disabled' : '') + '>Create Expert Track certificate</button><button type="button" class="sprint-button sprint-primary" data-sprint-action="certificate-full-path"' + (!verified || completions.length !== 50 || busy ? ' disabled' : '') + '>Create Levels 1–10 certificate</button><a class="sprint-button sprint-secondary" href="/excel-sprint-certificate">Verify a certificate</a></div><p class="sprint-muted">The full Levels 1–10 award requires all 50 core assignments. Expert capstones are a separate optional award.</p><div id="sprint-certificate-result">' + (certificateError ? '<p id="sprint-certificate-error" class="sprint-message sprint-message-error" role="alert" tabindex="-1">' + esc(certificateError) + '</p>' : '') + (latestCertificate ? '<div class="sprint-completion"><h4>' + esc(latestCertificate.certificate.title) + '</h4><p>' + esc(latestCertificate.certificate.learnerName) + ' · ' + esc(latestCertificate.certificate.scope) + '</p><div class="sprint-inline-actions"><a class="sprint-button sprint-primary" href="/excel-sprint-certificate#proof=' + encodeURIComponent(latestCertificate.certificateToken) + '" target="_blank" rel="noopener">Open certificate / save as PDF</a><button type="button" class="sprint-button sprint-secondary" data-sprint-action="certificate-download">Download signed proof</button></div><p class="sprint-muted">Keep the proof to verify or reprint the certificate later. Export a progress backup separately to restore assignments.</p></div>' : '') + '</div>';
  }
  async function createCertificate(award) {
    if (!storageNotice()) { message('Reload the latest progress before creating a certificate. This tab’s drafts are available for export.', true); return; }
    var nameInput = mount.querySelector('#sprint-certificate-name');
    learnerName = nameInput.value;
    certificateError = '';
    if (!learnerName.trim()) {
      certificateError = 'Enter the learner name to display on your certificate.';
      nameInput.setAttribute('aria-invalid', 'true');
      nameInput.setAttribute('aria-describedby', 'sprint-certificate-error');
      var error = mount.querySelector('#sprint-certificate-error');
      if (!error) { mount.querySelector('#sprint-certificate-result').insertAdjacentHTML('afterbegin', '<p id="sprint-certificate-error" class="sprint-task-error" role="alert"></p>'); error = mount.querySelector('#sprint-certificate-error'); }
      error.textContent = certificateError; error.hidden = false; nameInput.focus(); return;
    }
    collectDrafts();
    busy = true;
    renderCertificates();
    message('Verifying every required completion for your certificate…');
    try {
      var response = await request('/api/excel-sprint/certificate', {award:award,learnerName:learnerName,tokens:state.tokens,expertTokens:state.expertTokens});
      if (!response.certificate || response.certificate.award !== award || typeof response.certificateToken !== 'string') throw new Error('The certificate response was incomplete. Try again.');
      latestCertificate = response;
      message('Certificate created. Open it to print or save as PDF, and keep the signed proof.');
    } catch (error) { certificateError = error.message; message(error.message, true); }
    finally {
      busy = false;
      var previousFocus = document.activeElement;
      var refocus = previousFocus === document.body || mount.querySelector('#sprint-certificates').contains(previousFocus);
      renderCertificates();
      if (certificateError && refocus) mount.querySelector('#sprint-certificate-error').focus({preventScroll:true});
      else if (refocus) { var heading = mount.querySelector('#sprint-certificate-result h4'); if (heading) { heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true}); } }
    }
  }
  function downloadCertificate() {
    if (!latestCertificate) return;
    var blob = new Blob([JSON.stringify({type:'excel-sprint-certificate',version:1,certificateToken:latestCertificate.certificateToken},null,2)], {type:'application/json'});
    var url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'Excel-Sprint-certificate-' + latestCertificate.certificate.certificateId + '.json'; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    message('Signed proof download requested. Check your browser’s Downloads and keep the .json file.');
  }
  function draftChanged(status, input) {
    return !!(status && (status.checkedSubmission ? status.checkedSubmission.formula !== (input && input.formula || '') || status.checkedSubmission.resultText !== resultText(input) : status.attempts && input && (input.formula || resultText(input))));
  }
  function taskFeedback(status, input) {
    if (status && status.unverified) return '<p class="sprint-task-feedback sprint-unchecked" role="status"><strong>Saved bonus history not verified.</strong> Your optional history is retained. Check the bonus result to verify the current answer.</p>';
    if (!status || !status.attempts) return '';
    var changed = draftChanged(status, input);
    var revisedIncorrect = status.correct && status.submissionCorrect === false;
    return '<p class="sprint-task-feedback' + (changed ? ' sprint-unchecked' : status.correct && !revisedIncorrect ? ' sprint-correct' : ' sprint-incorrect') + '" role="status"><strong>' + (changed ? 'Revised answer not checked' : revisedIncorrect ? 'Revised answer not correct' : status.correct ? 'Correct' : 'Not yet correct') + (revisedIncorrect && !changed ? '.</strong> This revised output does not match. Your earlier correct result remains recorded (' + status.attempts + ' recorded attempt' + (status.attempts === 1 ? '' : 's') + ').' : ' · ' + status.attempts + ' attempt' + (status.attempts === 1 ? '' : 's') + '.</strong> ' + (changed ? 'Your draft changed after its last check. Check the revised answer to get new feedback.' + (status.correct ? ' Your earlier correct result remains recorded.' : '') : esc(status.hint || ''))) + '</p>';
  }
  function updateDraftFeedback(taskId) {
    if (!currentPackage) return;
    var formula = mount.querySelector('[data-sprint-formula-input="' + taskId + '"]'), result = mount.querySelector('[data-sprint-result-input="' + taskId + '"]'), target = mount.querySelector('[data-sprint-feedback="' + taskId + '"]');
    if (!formula || !result || !target) return;
    var status = visibleRecord(currentPackage.id).tasks[taskId], input = {formula:formula.value,resultText:result.value};
    target.innerHTML = taskFeedback(status, input);
    formula.closest('fieldset').classList.toggle('is-correct', !!(status && !status.unverified && status.correct && status.submissionCorrect !== false && !draftChanged(status, input)));
    var badge = mount.querySelector('[data-sprint-passed="' + taskId + '"]');
    if (badge) badge.textContent = draftChanged(status, input) || status.submissionCorrect === false ? 'Earlier check passed' : 'Passed';
  }
  function taskMarkup(task, number, optional) {
    var saved = visibleRecord(currentPackage.id);
    var input = saved.submissions[task.id];
    var status = saved.tasks[task.id];
    if (status && status.unverified) status = Object.assign({}, status, {correct:false});
    var typeLabel = task.type === 'array' ? 'Spilled array / output range' : task.type === 'number' ? 'Number' : 'Text';
    var feedback = '<div data-sprint-feedback="' + esc(task.id) + '" aria-live="polite">' + taskFeedback(status, input) + '</div>';
    return '<fieldset class="sprint-task' + (status && !status.unverified && status.correct && status.submissionCorrect !== false && !draftChanged(status, input) ? ' is-correct' : '') + '"><legend>' + (optional ? 'Optional bonus' : 'Task ' + number) + '</legend><p>' + esc(task.prompt) + '</p><div class="sprint-task-meta"><span>Output: <code>' + esc(task.output) + '</code></span><span>Result type: ' + typeLabel + '</span></div><label for="sprint-formula-' + task.id + '">Your Excel formula</label><textarea id="sprint-formula-' + task.id + '" data-sprint-formula-input="' + task.id + '" rows="2" maxlength="4096" spellcheck="false" placeholder="= Your formula" aria-describedby="sprint-help-' + task.id + ' sprint-error-' + task.id + '">' + esc(input && input.formula || '') + '</textarea><label for="sprint-result-' + task.id + '">Result produced in Excel</label><textarea id="sprint-result-' + task.id + '" data-sprint-result-input="' + task.id + '" aria-describedby="sprint-help-' + task.id + ' sprint-error-' + task.id + '" rows="' + (task.type === 'array' ? 4 : 2) + '" maxlength="16000" spellcheck="false" placeholder="' + (task.type === 'array' ? 'Paste the output range from Excel' : task.type === 'number' ? 'For example, 12.75' : 'Paste the resulting text') + '">' + esc(resultText(input)) + '</textarea><p id="sprint-help-' + task.id + '" class="sprint-input-help">' + (task.type === 'array' ? 'Copy the requested cells from Excel. Keep rows on separate lines and columns separated by tabs.' : task.type === 'number' ? 'Use a decimal point if needed. Enter the value without units or thousands separators.' : 'Enter the text exactly as it appears in Excel.') + '</p><p class="sprint-input-error" id="sprint-error-' + task.id + '" data-sprint-task-error="' + task.id + '" role="alert" hidden></p><div class="sprint-task-actions"><button type="button" class="sprint-button sprint-secondary" data-sprint-check="' + task.id + '"' + (busy || !canCheck(currentPackage.id) ? ' disabled' : '') + '>' + (status && status.correct ? 'Check revised answer' : optional ? 'Check bonus' : 'Check task') + '</button>' + (coachingAvailable ? '<button type="button" class="sprint-button sprint-secondary" data-sprint-coach="' + task.id + '"' + (busy || !canCheck(currentPackage.id) || !status || status.unverified || !status.attempts ? ' disabled' : '') + '>Review my formula</button>' : '') + (status && status.correct ? '<span class="sprint-status sprint-status-good" data-sprint-passed="' + task.id + '">' + (draftChanged(status, input) || status.submissionCorrect === false ? 'Earlier check passed' : 'Passed') + '</span>' : '') + '</div>' + feedback + '<div data-sprint-coach-panel="' + task.id + '" class="sprint-coaching" aria-live="polite">' + coachMarkup(task.id, input) + '</div></fieldset>';
  }
  function renderAssignment() {
    var pkg = currentPackage;
    var target = mount.querySelector('#sprint-assignment');
    if (!pkg) return;
    var isSolved = !!completed(pkg.id);
    var lesson = pkg.lesson;
    var dataset = pkg.dataset;
    target.innerHTML = '<div class="sprint-assignment-heading"><div><p class="sprint-eyebrow">' + esc(pkg.id) + (isExpert(pkg.id) ? ' · Expert Track · Capstone ' : ' · Level ' + pkg.level + ' · Assignment ') + pkg.assignment + '</p><h3>' + esc(pkg.title) + '</h3><p class="sprint-muted">' + pkg.minutes + ' min · ' + esc(pkg.formulas.join(' + ')) + '</p></div><span class="sprint-status' + (isSolved ? ' sprint-status-good' : '') + '">' + (isSolved ? 'Solved · verified' : 'In progress') + '</span></div><p class="sprint-scenario">' + esc(pkg.scenario) + '</p>' +
      '<div class="sprint-lesson"><h4>Learn the formulas</h4><p>' + esc(lesson.intro) + '</p><div class="sprint-lesson-functions">' + lesson.functions.map(function (item) { return '<article class="sprint-function"><h5>' + esc(item.name) + '</h5><p>' + esc(item.purpose) + '</p><div class="sprint-formula-block"><code>' + esc(item.syntax) + '</code></div><p class="sprint-muted">' + esc(item.arguments) + '</p><div class="sprint-worked-example"><span class="sprint-eyebrow">Worked example</span><div class="sprint-formula-block"><code>' + esc(item.example) + '</code></div><p>Result: <strong>' + esc(item.result) + '</strong></p></div><p><strong>Use it for:</strong> ' + esc(item.useCase) + '</p><p><strong>Watch for:</strong> ' + esc(item.mistake) + '</p></article>'; }).join('') + '</div><p class="sprint-combine"><strong>Combine what you know.</strong> ' + esc(lesson.combine) + '</p></div>' +
      '<div class="sprint-dataset"><div class="sprint-dataset-heading"><div><h4>Your assignment dataset</h4><p>' + dataset.rowCount + ' fictitious records · Excel table <code>' + esc(dataset.tableName) + '</code></p></div><div class="sprint-inline-actions"><a class="sprint-button sprint-primary" href="' + esc(dataset.xlsx) + '" download>Download .xlsx</a><a class="sprint-button sprint-secondary" href="' + esc(dataset.csv) + '" download>Download .csv</a><button type="button" class="sprint-button sprint-secondary" data-sprint-action="copy">Copy for Excel</button></div></div><p class="sprint-muted">Open the workbook in Microsoft 365 Excel and solve the tasks there. The workbook has a data dictionary and an Answers sheet. For CSV or copied data, name the data sheet <code>Data</code>, create the table named above from the headings and records only, and add an <code>Answers</code> sheet. Keep the training footer outside the table.</p><div class="sprint-table-scroll" tabindex="0" role="region" aria-label="Assignment dataset, scroll horizontally for all columns"><table><caption>' + esc(pkg.id) + ' practice data</caption><thead><tr>' + dataset.headers.map(function (header) { return '<th scope="col">' + esc(header) + '</th>'; }).join('') + '</tr></thead><tbody>' + dataset.rows.map(function (row) { return '<tr>' + row.map(function (cell) { return '<td>' + esc(cell) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div><p class="sprint-data-footer">Fictitious data for training purposes.</p>' +
      (dataset.parameters && dataset.parameters.length ? '<div class="sprint-parameters"><h5>Parameters sheet</h5><p>For CSV or copied data, create a sheet named <code>Parameters</code> with these exact values and cells.</p><div class="sprint-table-scroll"><table><thead><tr><th scope="col">Cell</th><th scope="col">Parameter</th><th scope="col">Value</th></tr></thead><tbody>' + dataset.parameters.map(function (parameter) { return '<tr><td>' + esc(parameter.cell) + '</td><td>' + esc(parameter.name) + '</td><td>' + esc(parameter.value) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' : '') + supportingSheets(dataset) + '<details><summary>Column dictionary</summary><dl class="sprint-dictionary">' + dataset.columns.map(function (column) { return '<div><dt>' + esc(column.name) + '</dt><dd>' + esc(column.description) + '</dd></div>'; }).join('') + '</dl></details></div>' +
      receiptNotice(pkg.id) + '<div class="sprint-task-section"><h4>Prove your mastery</h4><p>Submit both your formula and its Excel result. Checks compare your submitted output and basic formula structure. Test the calculation in Excel. Use commas or semicolons as required by your Excel settings. Enter spill formulas outside Excel Tables and leave the spill range clear. Keep full precision unless the task asks for rounding. Full solution reviews unlock after all required tasks pass.</p><p class="sprint-coaching-notice">' + coachingNotice() + '</p><div class="sprint-required-tasks">' + pkg.tasks.map(function (task, index) { return taskMarkup(task, index + 1, false); }).join('') + '</div><div class="sprint-grade-actions"><button type="button" class="sprint-button sprint-primary" data-sprint-action="grade-all"' + (busy || isSolved || !canCheck(pkg.id) ? ' disabled' : '') + '>' + (busy ? 'Checking…' : isSolved ? 'All required tasks passed' : !canCheck(pkg.id) ? 'Verify saved progress to continue' : 'Check all unfinished tasks') + '</button><span class="sprint-muted">' + pkg.tasks.filter(function (task) { return visibleRecord(pkg.id).tasks[task.id] && visibleRecord(pkg.id).tasks[task.id].correct; }).length + ' / ' + pkg.tasks.length + ' required tasks passed</span></div></div>' +
      (pkg.bonus ? '<details class="sprint-bonus"><summary>Optional stretch challenge</summary><p class="sprint-muted">The bonus does not block progress.</p>' + taskMarkup(pkg.bonus, 0, true) + '</details>' : '') +
      '<div class="sprint-solutions">' + (isSolved ? '<div class="sprint-completion"><h4>Assignment complete</h4><p>Every required task passed. Your first-attempt score: <strong>' + record(pkg.id).firstAttemptScore + '%</strong>.</p><div class="sprint-inline-actions"><button type="button" class="sprint-button sprint-secondary" data-sprint-action="solutions">Review model solutions</button>' + (canOpen(nextId(pkg.id)) ? '<button type="button" class="sprint-button sprint-primary" data-sprint-open="' + nextId(pkg.id) + '">Continue to next assignment →</button>' : '<a class="sprint-button sprint-primary" href="#sprint-certificates">View certificate eligibility</a>') + '</div></div><div id="sprint-models"></div>' : '<p class="sprint-muted">Model solutions become available after this assignment is solved.</p>') + '</div>';
    renderSummary();
  }
  async function verifyTokens(tokens, expertTokens) {
    expertTokens = expertTokens || [];
    if (!tokens.length && !expertTokens.length) return {verified:true,completions:[],expertCompletions:[]};
    var response = await request('/api/excel-sprint/verify', {tokens:tokens,expertTokens:expertTokens});
    if (response.verified !== true || !Array.isArray(response.completions) || response.completions.length !== tokens.length) throw new Error('The saved completion record could not be verified. Import a valid backup or begin again.');
    if (!Array.isArray(response.expertCompletions) || response.expertCompletions.length !== expertTokens.length) throw new Error('The saved Expert Track record could not be verified.');
    return response;
  }
  async function verifySaved() {
    if (!storageNotice()) return false;
    var epoch = stateEpoch, tokens = state.tokens.slice(), expertTokens = state.expertTokens.slice();
    try {
      var response = await verifyTokens(tokens, expertTokens);
      if (!storageNotice()) return false;
      if (epoch !== stateEpoch || JSON.stringify(tokens) !== JSON.stringify(state.tokens) || JSON.stringify(expertTokens) !== JSON.stringify(state.expertTokens)) return false;
      completions = response.completions;
      expertCompletions = response.expertCompletions;
      verified = true;
      state = P.applyVerified(state, completions, catalog, expertCompletions);
      await persist();
    } catch (error) {
      if (epoch !== stateEpoch || JSON.stringify(tokens) !== JSON.stringify(state.tokens) || JSON.stringify(expertTokens) !== JSON.stringify(state.expertTokens)) return false;
      completions = [];
      expertCompletions = [];
      verified = false;
      message(error.message + ' Saved answers and time remain available in your backup.', true);
    }
    renderSummary();
    return true;
  }
  function receiptNotice(id) {
    var pending = receiptPending(id), status = receiptStatus.get(id);
    if (!pending && (!status || status.kind !== 'invalid')) return '';
    var checking = status && status.kind === 'checking';
    var text = !canOpen(id) ? 'Saved task history is waiting for your completion record to be verified. Your answers and time are retained.' : checking ? 'Verifying saved task history. Your answers remain editable.' : pending ? 'Saved task history has not been verified. Your answers and time are retained; retry before checking another result.' : 'The saved task receipt could not be verified. Your answers and time are retained. Check your results to start a fresh verified attempt.';
    return '<div id="sprint-receipt-status" class="sprint-notice" role="status"><p>' + esc(text) + '</p>' + (pending ? '<button type="button" class="sprint-button sprint-secondary" data-sprint-action="verify-receipt"' + (checking || busy || !canOpen(id) ? ' disabled' : '') + '>Retry saved task verification</button>' : '') + '</div>';
  }
  async function verifyReceipt(pkg, focusRetry) {
    if (!pkg || !receiptPending(pkg.id) || !canOpen(pkg.id) || !storageNotice()) return;
    var id = pkg.id, receipt = record(id).receipt, epoch = stateEpoch, sequence = packageLoadSequence;
    var previous = completed(previousId(id)), predecessor = previous && previous.completionToken, accepted = false;
    function current() { var latestPrevious = completed(previousId(id)); return epoch === stateEpoch && sequence === packageLoadSequence && currentPackage && currentPackage.id === id && record(id).receipt === receipt && (latestPrevious && latestPrevious.completionToken) === predecessor; }
    collectDrafts();
    receiptStatus.set(id, {kind:'checking'});
    var notice = mount.querySelector('#sprint-receipt-status');
    if (notice) notice.outerHTML = receiptNotice(id);
    try {
      if (receipt.length > 12000) { var invalidReceipt = new Error('The saved task receipt is too long.'); invalidReceipt.status = 403; throw invalidReceipt; }
      var response = await request('/api/excel-sprint/verify', {action:'receipt',packageId:id,receipt:receipt,predecessorToken:predecessor});
      if (!current() || !storageNotice()) return;
      if (!response || response.verified !== true || response.packageId !== id || response.receipt !== receipt || !Array.isArray(response.tasks) || response.tasks.length !== pkg.tasks.length || !pkg.tasks.every(function (task) { return response.tasks.some(function (item) { return item.taskId === task.id; }); })) throw new Error('Saved task history could not be read. Retry verification; your answers are retained.');
      collectDrafts();
      state = P.applyPartial(state, response);
      state = P.applyVerified(state, completions, catalog, expertCompletions);
      receiptCache.set(id, receipt);
      receiptStatus.delete(id);
      accepted = true;
      // A completed grading receipt can recover its omitted proof only at the
      // next sequential position; credit still requires the normal chain check.
      var chain = isExpert(id) ? state.expertTokens : state.tokens;
      var position = isExpert(id) ? +id.slice(-1) : P.packageNumber(id);
      if (response.completed && typeof response.completionToken === 'string' && !completed(id) && position === chain.length + 1) {
        if (!chain.includes(response.completionToken)) chain.push(response.completionToken);
        verified = false;
        await persist();
        var verification = await verifyTokens(state.tokens, state.expertTokens);
        if (!current() || !storageNotice()) return;
        collectDrafts();
        completions = verification.completions; expertCompletions = verification.expertCompletions; verified = true;
        state = P.applyVerified(state, completions, catalog, expertCompletions);
      }
      await persist();
    } catch (error) {
      if (!current() || !storageNotice()) return;
      collectDrafts();
      if (!accepted && error.status === 403) {
        delete record(id).receipt;
        record(id).tasks = {};
        state = P.applyVerified(state, completions, catalog, expertCompletions);
        receiptCache.delete(id); receiptStatus.set(id, {kind:'invalid'});
        await persist();
      } else { receiptStatus.set(id, {kind:'unavailable'}); if (accepted && !verified) message(error.message + ' Your completion proof is saved. Choose Verify saved progress to recover it.', true); }
    } finally {
      if (!storageConflict && epoch === stateEpoch && sequence === packageLoadSequence && currentPackage && currentPackage.id === id) {
        var focused = document.activeElement, fieldId = focused && focused.closest('#sprint-assignment') && focused.matches('[data-sprint-formula-input], [data-sprint-result-input]') ? focused.id : '';
        var start = fieldId ? focused.selectionStart : null, end = fieldId ? focused.selectionEnd : null;
        collectDrafts(); renderAssignment();
        var field = fieldId && document.getElementById(fieldId);
        if (field) { field.focus({preventScroll:true}); field.setSelectionRange(start, end); }
        else if (focusRetry && document.activeElement === document.body) { var destination = mount.querySelector('#sprint-receipt-status') || mount.querySelector('.sprint-task-section h4'); if (destination) { destination.setAttribute('tabindex','-1'); destination.focus({preventScroll:true}); } }
      }
    }
  }
  async function openPackage(id, focus) {
    if (!storageNotice()) { message('Export this tab’s drafts, then reload the latest progress before changing assignments.', true); return; }
    if (!canRead(id)) { message('Complete the previous required assignments to unlock this package.', true); return; }
    collectDrafts();
    flushTime();
    activeSince = null;
    var epoch = stateEpoch, sequence = ++packageLoadSequence;
    state.selectedPackageId = id;
    await persist();
    if (!storageNotice()) return;
    if (epoch !== stateEpoch || sequence !== packageLoadSequence) return;
    loadingId = id;
    var target = mount.querySelector('#sprint-assignment');
    target.innerHTML = '<p class="sprint-loading" role="status">Loading ' + esc(id) + '…</p>';
    try {
      var pkg = packageCache.get(id) || await request(BASE + 'packages/' + id + '.json');
      if (loadingId !== id || epoch !== stateEpoch || sequence !== packageLoadSequence) return;
      if (!pkg || pkg.id !== id || !pkg.lesson || !pkg.dataset || !Array.isArray(pkg.tasks)) throw new Error('This assignment could not be loaded. Please try again.');
      packageCache.set(id, pkg);
      currentPackage = pkg;
      record(id);
      activeSince = document.hidden ? null : Date.now();
      renderAssignment();
      if (focus) target.focus({ preventScroll: true });
      if (focus) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      await verifyReceipt(pkg);
      if (loadingId !== id || epoch !== stateEpoch || sequence !== packageLoadSequence) return;
    } catch (error) {
      if (loadingId !== id || epoch !== stateEpoch || sequence !== packageLoadSequence) return;
      currentPackage = null;
      target.innerHTML = '<p class="sprint-message sprint-message-error" role="alert">' + esc(error.message) + '</p><button type="button" class="sprint-button sprint-primary" data-sprint-open="' + esc(id) + '">Retry loading assignment</button>';
    }
  }
  async function grade(taskIds) {
    if (busy || !currentPackage) return;
    if (!storageNotice()) { message('Export this tab’s drafts, then reload the latest progress before checking another result.', true); return; }
    if (!canCheck(currentPackage.id)) { message('Reconnect and verify saved progress and task history before submitting this assignment.', true); return; }
    var pkg = currentPackage;
    var submissions = [];
    var checkedDrafts = {};
    var pendingCompletionVerification = false;
    var firstInvalid = null;
    var epoch = stateEpoch;
    var valid = true;
    collectDrafts();
    pkg.tasks.concat(pkg.bonus ? [pkg.bonus] : []).forEach(function (task) {
      if (!taskIds.includes(task.id)) return;
      var errorTarget = mount.querySelector('[data-sprint-task-error="' + task.id + '"]');
      errorTarget.hidden = true;
      var formulaInput = mount.querySelector('[data-sprint-formula-input="' + task.id + '"]');
      var resultInput = mount.querySelector('[data-sprint-result-input="' + task.id + '"]');
      formulaInput.removeAttribute('aria-invalid'); resultInput.removeAttribute('aria-invalid');
      var invalidField = formulaInput;
      try {
        var formula = formulaInput.value.trim();
        if (!formula || formula[0] !== '=' || formula.length < 2) throw new Error('Enter your Excel formula beginning with =.');
        invalidField = resultInput;
        checkedDrafts[task.id] = {formula:formulaInput.value,resultText:resultInput.value};
        submissions.push({ taskId: task.id, formula: formula, result: parseResult(resultInput.value, task.type) });
      } catch (error) { valid = false; invalidField.setAttribute('aria-invalid', 'true'); if (!firstInvalid) firstInvalid = invalidField; errorTarget.textContent = error.message; errorTarget.hidden = false; }
    });
    flushTime();
    persist();
    if (!valid) { message('Finish the highlighted formula and result fields before checking.', true); if (firstInvalid) firstInvalid.focus(); return; }
    if (!submissions.length) { message('All required tasks have already passed.'); return; }
    busy = true;
    mount.querySelectorAll('[data-sprint-check], [data-sprint-coach], [data-sprint-action="grade-all"], [data-sprint-open]').forEach(function (button) { button.disabled = true; });
    message('Checking your submitted results…');
    try {
      var saved = record(pkg.id);
      var predecessor = completed(previousId(pkg.id));
      var response = await request('/api/excel-sprint/grade', { packageId: pkg.id, submissions: submissions, predecessorToken: predecessor && predecessor.completionToken, receipt: saved.receipt });
      if (epoch !== stateEpoch || !currentPackage || currentPackage.id !== pkg.id) return;
      if (response.packageId !== pkg.id || !Array.isArray(response.tasks) || typeof response.receipt !== 'string') throw new Error('The grading response was incomplete. Your previous progress has been kept.');
      collectDrafts();
      saved.receipt = response.receipt;
      receiptCache.set(pkg.id, response.receipt); receiptStatus.delete(pkg.id);
      saved.score = response.score;
      saved.firstAttemptScore = response.firstAttemptScore;
      response.tasks.concat(response.bonus ? [response.bonus] : []).forEach(function (task) { saved.tasks[task.taskId] = Object.assign({}, saved.tasks[task.taskId], task); if (checkedDrafts[task.taskId]) saved.tasks[task.taskId].checkedSubmission = checkedDrafts[task.taskId]; });
      studyDay();
      if (response.completed && response.completionToken) {
        var previouslyComplete = !!completed(pkg.id);
        var oldCount = completions.length;
        var pendingTokens = (isExpert(pkg.id) ? state.expertTokens : state.tokens).slice();
        if (!completed(pkg.id) && !pendingTokens.includes(response.completionToken)) pendingTokens.push(response.completionToken);
        if (isExpert(pkg.id)) state.expertTokens = pendingTokens;
        else state.tokens = pendingTokens;
        verified = false;
        pendingCompletionVerification = true;
        var verification = await verifyTokens(state.tokens, state.expertTokens);
        if (epoch !== stateEpoch || !currentPackage || currentPackage.id !== pkg.id) return;
        collectDrafts();
        completions = verification.completions;
        expertCompletions = verification.expertCompletions;
        verified = true;
        pendingCompletionVerification = false;
        state = P.applyVerified(state, completions, catalog, expertCompletions);
        if (!isExpert(pkg.id) && completions.length > oldCount && completions.length % 5 === 0) state.backupReminder = completions.length / 5;
        if (response.tasks.some(function (task) { return taskIds.includes(task.taskId) && task.submissionCorrect === false; })) message('The revised answer needs more work. Your earlier assignment completion and unlocked progress remain recorded.');
        else if (response.bonus && taskIds.includes(response.bonus.taskId)) message(response.bonus.submissionCorrect === false ? (response.bonus.correct ? 'The revised bonus result does not match. Your earlier correct bonus result and assignment completion remain recorded.' : 'The bonus result does not match yet. Your completed assignment and unlocked progress remain recorded.') : 'Bonus result correct. Your completed assignment and unlocked progress remain recorded.');
        else if (previouslyComplete) message('Your checked revision is correct. Your recorded assignment completion and unlocked progress remain available.');
        else message(isExpert(pkg.id) && expertCompletions.length === 3 ? 'Expert Track complete. Your Expert Track certificate is available below.' : completions.length === releasedCount() && !isExpert(pkg.id) ? 'All 50 core assignments are complete. Your full Levels 1–10 certificate is available below.' : 'Assignment complete. All required tasks are correct and your next assignment is unlocked.');
      } else message('Results checked. Review the feedback beside each submitted task.');
      if (taskIds.some(function (id) { return draftChanged(record(pkg.id).tasks[id], record(pkg.id).submissions[id]); })) message(mount.querySelector('#sprint-message').textContent + ' Your latest edits are saved but have not been checked.');
      await persist();
    } catch (error) { if (epoch === stateEpoch) { collectDrafts(); message(error.message + (pendingCompletionVerification ? ' Your result check is saved. Choose Verify saved progress before continuing or checking revised answers.' : ''), true); await persist(); } }
    finally { if (epoch === stateEpoch) { collectDrafts(); busy = false; renderAssignment(); var feedback = mount.querySelector('[data-sprint-feedback="' + taskIds[0] + '"]'); if (feedback && feedback.textContent) { feedback.setAttribute('tabindex', '-1'); feedback.focus({preventScroll:true}); } } }
  }
  async function solutions() {
    if (!currentPackage || !completed(currentPackage.id)) return;
    var pkg = currentPackage, epoch = stateEpoch, token = completed(pkg.id).completionToken;
    var target = mount.querySelector('#sprint-models');
    target.innerHTML = '<p role="status">Loading solution review…</p>';
    try {
      var models = solutionCache.get(pkg.id) || await request('/api/excel-sprint/solutions', { packageId: pkg.id, completionToken: token });
      if (epoch !== stateEpoch || !currentPackage || currentPackage.id !== pkg.id || !completed(pkg.id) || completed(pkg.id).completionToken !== token) return;
      if (!models || !Array.isArray(models.tasks) || models.tasks.length !== pkg.tasks.length) throw new Error('The model review was incomplete. Try again.');
      solutionCache.set(pkg.id, models);
      target = mount.querySelector('#sprint-models');
      if (!target) return;
      target.innerHTML = '<h4>Model solutions and alternatives</h4>' + models.tasks.concat(models.bonus ? [models.bonus] : []).map(function (task) { return '<article class="sprint-model"><h5>' + (task.taskId === 'bonus' ? 'Optional bonus' : 'Task ' + esc(task.taskId.slice(1))) + '</h5><div class="sprint-formula-block"><code>' + esc(task.model) + '</code></div>' + (task.note ? '<p class="sprint-muted">' + esc(task.note) + '</p>' : '') + (task.alternatives && task.alternatives.length ? '<p class="sprint-muted">Alternative approaches</p>' + task.alternatives.map(function (formula) { return '<div class="sprint-formula-block"><code>' + esc(formula) + '</code></div>'; }).join('') : '') + '</article>'; }).join('');
      if (document.activeElement === mount.querySelector('[data-sprint-action="solutions"]')) { var heading = target.querySelector('h4'); heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true}); }
    } catch (error) { if (epoch === stateEpoch && currentPackage && currentPackage.id === pkg.id) { target = mount.querySelector('#sprint-models'); if (target) target.innerHTML = '<p class="sprint-message sprint-message-error" role="alert">' + esc(error.message) + '</p>'; } }
  }
  function exportBackup() {
    if (!stateLoaded) { message(stateLoadFailed ? 'Saved work could not be read. Reload the latest progress or use a previously exported backup.' : 'Saved work is still loading. Wait for backup export or reload the latest progress.', true); return; }
    collectDrafts();
    flushTime();
    persist();
    try {
      var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'Excel-Formula-Sprint-progress-' + dayStamp() + '.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      message('Backup download requested. Check your browser’s Downloads. If no file appears, choose Show backup text.');
    } catch (_) { showBackupText(); message('The backup download could not start. Copy the complete backup text and save it as a .json file.', true); }
  }
  function showBackupText() {
    if (!stateLoaded) { message(stateLoadFailed ? 'Saved work could not be read. Reload the latest progress or use a previously exported backup.' : 'Saved work is still loading. Wait for backup export or reload the latest progress.', true); return false; }
    collectDrafts(); flushTime(); persist();
    var panel = mount.querySelector('#sprint-backup-text-panel'), input = mount.querySelector('#sprint-backup-text');
    if (!panel || !input) return false;
    panel.hidden = false; input.value = JSON.stringify(state, null, 2); input.focus({preventScroll:true}); input.select();
    return true;
  }
  async function copyBackupText() {
    if (!showBackupText()) return;
    var input = mount.querySelector('#sprint-backup-text');
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(input.value);
      message('Backup text copied. Save it in a plain text file with a .json extension.');
    } catch (_) { input.focus(); input.select(); message('Automatic copy is unavailable. The complete backup text is selected; copy it manually and save it as a .json file.'); }
  }
  async function importBackup(file) {
    if (!file || busy) return;
    if (!await mutationReady()) { message('Export this tab’s drafts and reload the latest progress before importing a backup.', true); return; }
    busy = true;
    message('Validating the backup and its completed assignments…');
    try {
      if (file.size > P.MAX_BACKUP_BYTES) throw new Error('Choose a progress JSON file smaller than ' + Math.round(P.MAX_BACKUP_BYTES / 1024 / 1024) + ' MB.');
      var candidate = P.parseBackup(await file.text());
      var response = await verifyTokens(candidate.tokens, candidate.expertTokens);
      if (!await mutationReady()) { message('Progress changed while the backup was being checked. Your current work has not been replaced. Export this tab’s drafts, then reload the latest progress.', true); return; }
      // The current record is replaced only after the whole imported chain verifies.
      collectDrafts();
      flushTime();
      activeSince = null;
      if (learningApp && learningApp.destroy) learningApp.destroy();
      learningApp = null;
      stateEpoch++;
      packageLoadSequence++;
      checkingCoaching = false;
      coachingStatusCheck++;
      completions = response.completions;
      expertCompletions = response.expertCompletions;
      verified = true;
      state = P.applyVerified(candidate, completions, catalog, expertCompletions);
      state.noticeDismissed = true;
      if (!canOpen(state.selectedPackageId)) state.selectedPackageId = P.packageId(Math.min(completions.length + 1, releasedCount()));
      solutionCache.clear();
      coachCache.clear();
      receiptCache.clear(); receiptStatus.clear();
      latestCertificate = null;
      certificateError = '';
      currentPackage = null;
      await persist({replace:true});
      shell();
      await openPackage(state.selectedPackageId, false);
      message('Backup restored. Verified completions and saved assignment work are available.');
    } catch (error) { message(error.message + ' Your current progress has not been replaced.', true); }
    finally {
      busy = false;
      if (!storageConflict) {
        if (currentPackage) { collectDrafts(); renderAssignment(); }
        else renderSummary();
      }
      var input = mount.querySelector('#sprint-import');
      if (input) input.value = '';
    }
  }
  async function copyDataset(sheetName) {
    if (!currentPackage) return;
    var pkg = currentPackage, epoch = stateEpoch;
    var target = mount.querySelector('#sprint-assignment .sprint-dataset');
    var data = currentPackage.dataset;
    if (sheetName) data = (data.sheets || []).find(function (sheet) { return sheet.name === sheetName; });
    if (!data) return;
    var tsv = [data.headers].concat(data.rows).map(function (row) { return row.map(function (value) { var text = String(value); return /[\t\n\r"]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text; }).join('\t'); }).join('\n') + '\n\n' + (data.disclaimer || 'Fictitious data for training purposes.');
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard is unavailable');
      await navigator.clipboard.writeText(tsv);
      if (epoch !== stateEpoch || !currentPackage || currentPackage.id !== pkg.id || !target || !target.isConnected) return;
      message('Dataset copied. Paste into cell A1 of ' + (sheetName || 'Data') + ' in Excel, keeping the footer outside the data table.');
    } catch (_) {
      if (epoch !== stateEpoch || !currentPackage || currentPackage.id !== pkg.id || !target || !target.isConnected) return;
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
    var download = event.target.closest('a[download]');
    if (download && !download.closest('#sprint-learning')) message('Download requested. Check your browser’s Downloads. Dataset copy and CSV options are also available.');
    var opener = event.target.closest('[data-sprint-open]');
    if (opener && !opener.disabled && !busy) { await openPackage(opener.dataset.sprintOpen, true); return; }
    var check = event.target.closest('[data-sprint-check]');
    if (check && !check.disabled) { await grade([check.dataset.sprintCheck]); return; }
    var coach = event.target.closest('[data-sprint-coach]');
    if (coach && !coach.disabled) { await reviewFormula(coach.dataset.sprintCoach); return; }
    var button = event.target.closest('[data-sprint-action]');
    if (!button) return;
    var action = button.dataset.sprintAction;
    if (action === 'reload-progress') { window.location.reload(); return; }
    if (action === 'export') exportBackup();
    if (action === 'backup-text') showBackupText();
    if (action === 'copy-backup-text') await copyBackupText();
    if (action === 'close-backup-text') { mount.querySelector('#sprint-backup-text-panel').hidden = true; var trigger = mount.querySelector('[data-sprint-action="backup-text"]'); if (trigger) trigger.focus(); }
    if (!storageNotice() && !['export','backup-text','copy-backup-text','close-backup-text','copy','solutions','certificate-download','cancel-reset'].includes(action)) { message('Export this tab’s drafts, then reload the latest progress before continuing.', true); return; }
    if (busy) { if (!['export','backup-text','copy-backup-text','close-backup-text'].includes(action)) message('A request is still running. Your drafts are saved; wait for it to finish before changing Sprint progress.'); return; }
    if (action === 'grade-all') await grade(currentPackage.tasks.filter(function (task) { return !(visibleRecord(currentPackage.id).tasks[task.id] && visibleRecord(currentPackage.id).tasks[task.id].correct); }).map(function (task) { return task.id; }));
    if (action === 'solutions') await solutions();
    if (action === 'retry-coaching') await retryCoaching();
    if (action === 'certificate-levels-1-6') await createCertificate('levels-1-6');
    if (action === 'certificate-expert-track-v1') await createCertificate('expert-track-v1');
    if (action === 'certificate-full-path') await createCertificate('full-path');
    if (action === 'certificate-download') downloadCertificate();
    if (action === 'verify') { if (await verifySaved() && currentPackage) { collectDrafts(); renderAssignment(); await verifyReceipt(currentPackage); } }
    if (action === 'verify-receipt') await verifyReceipt(currentPackage, true);
    if (action === 'copy') await copyDataset(button.dataset.sprintSheet);
    if (action === 'dismiss-notice') { state.noticeDismissed = true; mount.querySelector('#sprint-first-notice').hidden = true; await persist(); }
    if (action === 'dismiss-backup') { state.backupReminder = null; await persist(); renderSummary(); }
    if (action === 'reset') { mount.querySelector('#sprint-reset-confirm').hidden = false; button.setAttribute('aria-expanded', 'true'); mount.querySelector('[data-sprint-action="cancel-reset"]').focus(); }
    if (action === 'cancel-reset') { mount.querySelector('#sprint-reset-confirm').hidden = true; var reset = mount.querySelector('[data-sprint-action="reset"]'); reset.setAttribute('aria-expanded','false'); reset.focus(); }
    if (action === 'confirm-reset') {
      if (!await mutationReady()) { message('Export this tab’s drafts and reload the latest progress before resetting it.', true); return; }
      stateEpoch++;
      packageLoadSequence++;
      checkingCoaching = false;
      coachingStatusCheck++;
      if (learningApp && learningApp.destroy) learningApp.destroy();
      learningApp = null;
      state = P.emptyState();
      completions = [];
      expertCompletions = [];
      latestCertificate = null;
      certificateError = '';
      verified = true;
      currentPackage = null;
      activeSince = null;
      solutionCache.clear();
      coachCache.clear();
      receiptCache.clear(); receiptStatus.clear();
      await persist({replace:true});
      shell();
      await openPackage('L1-A1', true);
      message('Excel Formula Sprint progress reset. Begin again with L1-A1.');
    }
  });
  mount.addEventListener('change', function (event) { if (event.target.id === 'sprint-import') importBackup(event.target.files[0]); });
  mount.addEventListener('input', function (event) {
    if (event.target.id === 'sprint-certificate-name') { learnerName = event.target.value; certificateError = ''; event.target.removeAttribute('aria-invalid'); event.target.removeAttribute('aria-describedby'); var error = mount.querySelector('#sprint-certificate-error'); if (error) error.hidden = true; return; }
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
      updateDraftFeedback(taskId);
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
  window.addEventListener('storage', function (event) { if (!event.key || event.key === P.KEY || event.key.indexOf(P.KEY + '.') === 0) storageNotice(); });
  ['pointerdown','keydown','wheel','touchstart','input'].forEach(function (type) {
    document.addEventListener(type, function () { initialAnchorCancelled = true; }, {once:true,passive:true});
  });
  window.addEventListener('online', async function () {
    if (verified || busy || !catalog) return;
    await verifySaved();
    if (verified && canOpen(state.selectedPackageId)) await openPackage(state.selectedPackageId, false);
  });
  setInterval(function () { if (currentPackage && !document.hidden) { flushTime(); collectDrafts(); persist(); } }, 15000);
  async function initialize() {
    var epoch = ++stateEpoch;
    if (learningApp && learningApp.destroy) learningApp.destroy();
    learningApp = null;
    mount.innerHTML = '<p class="sprint-loading" role="status">Loading Excel Formula Sprint…</p>';
    try {
      var loadedState = store.load().then(function (saved) {
        // Retain the read snapshot even when a foreign save cancels catalog
        // loading. No editable lesson exists before this read finishes.
        if (epoch === stateEpoch || storageConflict && !mount.querySelector('#sprint-assignment')) {
          state = saved;
          stateLoaded = true;
          stateLoadFailed = false;
          if (storageConflict) { bootstrapRecovery(); storageNotice(); }
        }
        return saved;
      }, function (error) {
        stateLoadFailed = true;
        if (storageConflict && !mount.querySelector('#sprint-assignment')) { bootstrapRecovery(); storageNotice(); }
        throw error;
      });
      var values = await Promise.allSettled([loadedState, request(BASE + 'catalog.json')]);
      if (epoch !== stateEpoch) return;
      if (values[0].status === 'rejected') throw values[0].reason;
      state = values[0].value;
      if (values[1].status === 'rejected') throw values[1].reason;
      catalog = values[1].value;
      if (!catalog || !Array.isArray(catalog.levels) || catalog.levels.length !== 10) throw new Error('The curriculum could not be loaded.');
      checkingCoaching = true;
      shell();
      checkCoachingInBackground(epoch);
      await verifySaved();
      if (epoch !== stateEpoch) return;
      if (!canRead(state.selectedPackageId)) state.selectedPackageId = 'L1-A1';
      await openPackage(state.selectedPackageId, false);
      if (epoch === stateEpoch) restoreInitialAnchor(epoch);
    } catch (error) {
      if (epoch !== stateEpoch) return;
      mount.innerHTML = '<p class="sprint-message sprint-message-error" role="alert">' + esc(error.message) + '</p><p>Saved work remains in this browser. You can export it while the course is unavailable.</p><div class="sprint-inline-actions"><button type="button" class="sprint-button sprint-primary" id="sprint-retry-init">Retry loading Sprint</button><button type="button" class="sprint-button" data-sprint-action="export">Export backup</button><button type="button" class="sprint-button" data-sprint-action="backup-text">Show backup text</button></div>' + backupTextPanel() + '<div id="sprint-storage-warning" class="sprint-message sprint-message-error" role="alert" hidden></div><div id="sprint-message" class="sprint-message" role="status" aria-live="polite" hidden></div>';
      mount.querySelector('#sprint-retry-init').addEventListener('click', initialize);
      storageNotice();
    }
  }
  initialize();
})();
