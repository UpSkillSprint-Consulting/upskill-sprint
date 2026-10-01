(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ExcelSprintProgress = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var KEY = 'upskillsprint.excel-sprint.v1';
  var MAX_BACKUP_BYTES = 2 * 1024 * 1024;
  var PACKAGE = /^L(?:[1-9]|10)-A[1-5]$/;
  function emptyState() {
    return { version: 1, updatedAt: new Date().toISOString(), selectedPackageId: 'L1-A1', tokens: [], packages: {}, formulas: {}, activityDays: [], badges: [], noticeDismissed: false, backupReminder: null };
  }
  function isObject(value) { return !!value && typeof value === 'object' && !Array.isArray(value); }
  function string(value, max) { return typeof value === 'string' && value.length <= max; }
  function finite(value, max) { return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= max; }
  function validDate(value) { return string(value, 40) && Number.isFinite(Date.parse(value)); }
  function safeResult(value, depth) {
    if (depth > 3) return false;
    if (value === null || typeof value === 'boolean' || typeof value === 'number' && Number.isFinite(value)) return true;
    if (typeof value === 'string') return value.length <= 20000;
    return Array.isArray(value) && value.length <= 300 && value.every(function (item) { return safeResult(item, depth + 1); });
  }
  function validateState(input) {
    if (!isObject(input) || input.version !== 1 || !Array.isArray(input.tokens) || input.tokens.length > 50 || !isObject(input.packages)) throw new Error('This is not an Excel Formula Sprint version 1 backup.');
    var state = emptyState();
    if (input.tokens.some(function (token) { return !string(token, 20000) || !token; })) throw new Error('The backup contains an invalid completion token.');
    state.tokens = input.tokens.slice();
    if (new Set(state.tokens).size !== state.tokens.length) throw new Error('The backup contains duplicate completion tokens.');
    if (input.selectedPackageId && !PACKAGE.test(input.selectedPackageId)) throw new Error('The backup has an invalid assignment selection.');
    state.selectedPackageId = input.selectedPackageId || 'L1-A1';
    if (Object.keys(input.packages).length > 50) throw new Error('The backup contains too many assignments.');
    Object.keys(input.packages).forEach(function (id) {
      var item = input.packages[id];
      if (!PACKAGE.test(id) || !isObject(item)) throw new Error('The backup contains an invalid assignment.');
      var copy = { submissions: {}, tasks: {}, timeMs: 0 };
      if (item.timeMs !== undefined && !finite(item.timeMs, 100000000000)) throw new Error('Invalid assignment time in backup.');
      copy.timeMs = item.timeMs || 0;
      ['score', 'firstAttemptScore'].forEach(function (field) {
        if (item[field] !== undefined) {
          if (!finite(item[field], 100)) throw new Error('Invalid score in backup.');
          copy[field] = item[field];
        }
      });
      if (item.receipt !== undefined) {
        if (!string(item.receipt, 60000)) throw new Error('Invalid grading receipt in backup.');
        copy.receipt = item.receipt;
      }
      if (item.solvedAt !== undefined) {
        if (!validDate(item.solvedAt)) throw new Error('Invalid completion date in backup.');
        copy.solvedAt = item.solvedAt;
      }
      ['submissions', 'tasks'].forEach(function (field) {
        if (item[field] !== undefined && (!isObject(item[field]) || Object.keys(item[field]).length > 6)) throw new Error('Invalid task records in backup.');
      });
      Object.keys(item.submissions || {}).forEach(function (taskId) {
        var value = item.submissions[taskId];
        if (!/^(?:t[1-5]|bonus)$/.test(taskId) || !isObject(value) || !string(value.formula, 4000) || !safeResult(value.result, 0)) throw new Error('Invalid saved formula or result in backup.');
        copy.submissions[taskId] = { formula: value.formula, result: value.result };
        if (string(value.resultText, 20000)) copy.submissions[taskId].resultText = value.resultText;
      });
      Object.keys(item.tasks || {}).forEach(function (taskId) {
        var value = item.tasks[taskId];
        if (!/^(?:t[1-5]|bonus)$/.test(taskId) || !isObject(value) || typeof value.correct !== 'boolean' || !Number.isInteger(value.attempts) || !finite(value.attempts, 100000)) throw new Error('Invalid saved attempt record in backup.');
        copy.tasks[taskId] = { correct: value.correct, attempts: value.attempts, firstAttemptCorrect: value.firstAttemptCorrect === true ? true : value.firstAttemptCorrect === false ? false : null };
        if (string(value.hint, 4000)) copy.tasks[taskId].hint = value.hint;
        if (typeof value.submissionCorrect === 'boolean') copy.tasks[taskId].submissionCorrect = value.submissionCorrect;
      });
      state.packages[id] = copy;
    });
    if (Array.isArray(input.activityDays)) state.activityDays = input.activityDays.filter(function (day) { return /^\d{4}-\d{2}-\d{2}$/.test(day); }).slice(-1000);
    if (isObject(input.formulas)) Object.keys(input.formulas).forEach(function (name) {
      var value = input.formulas[name];
      if (/^[A-Z][A-Z0-9. /-]{0,60}$/.test(name) && isObject(value) && PACKAGE.test(value.packageId) && validDate(value.learnedAt)) state.formulas[name] = { packageId: value.packageId, learnedAt: value.learnedAt };
    });
    state.noticeDismissed = input.noticeDismissed === true;
    if (Number.isInteger(input.backupReminder) && input.backupReminder >= 1 && input.backupReminder <= 10) state.backupReminder = input.backupReminder;
    if (validDate(input.updatedAt)) state.updatedAt = input.updatedAt;
    return state;
  }
  function parseBackup(text) {
    if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) throw new Error('Choose a progress JSON file smaller than 2 MB.');
    var parsed;
    try { parsed = JSON.parse(text); } catch (_) { throw new Error('The selected file is not valid JSON.'); }
    return validateState(parsed);
  }
  function packageNumber(id) { var match = /^L(\d+)-A(\d+)$/.exec(id); return match ? (+match[1] - 1) * 5 + +match[2] : 0; }
  function packageId(number) { return 'L' + (Math.floor((number - 1) / 5) + 1) + '-A' + ((number - 1) % 5 + 1); }
  function unlocked(id, completions, available) {
    if (!available || !PACKAGE.test(id)) return false;
    var count = packageNumber(id);
    var verified = new Set(completions.map(function (item) { return item.packageId; }));
    for (var index = 1; index < count; index++) if (!verified.has(packageId(index))) return false;
    return true;
  }
  function applyVerified(state, completions, catalog) {
    var next = validateState(state);
    next.tokens = completions.map(function (item) { return item.completionToken; });
    next.formulas = {};
    next.badges = [];
    completions.forEach(function (item) {
      if (!PACKAGE.test(item.packageId)) return;
      var record = next.packages[item.packageId] || { tasks: {}, submissions: {}, timeMs: 0 };
      record.tasks = Object.fromEntries(Object.keys(item.attempts).map(function (id) { return [id, { correct: true, attempts: item.attempts[id], firstAttemptCorrect: item.firstAttemptCorrect[id], hint: "Correct. This task is complete." }]; }));
      record.score = item.score;
      record.firstAttemptScore = item.firstAttemptScore;
      record.solvedAt = new Date(item.timestamp).toISOString();
      Object.keys(item.attempts || {}).forEach(function (taskId) {
        if (!/^t[1-5]$/.test(taskId) || !Number.isInteger(item.attempts[taskId])) return;
        var previous = record.tasks[taskId] || {};
        record.tasks[taskId] = { correct: true, attempts: item.attempts[taskId], firstAttemptCorrect: !!(item.firstAttemptCorrect && item.firstAttemptCorrect[taskId]), hint: previous.hint || 'Correct result verified.' };
      });
      next.packages[item.packageId] = record;
      var level = catalog.levels.find(function (entry) { return entry.level === +item.packageId.match(/^L(\d+)/)[1]; });
      var pkg = level && level.packages.find(function (entry) { return entry.id === item.packageId; });
      (pkg && pkg.formulas || []).forEach(function (name) {
        if (!next.formulas[name]) next.formulas[name] = { packageId: item.packageId, learnedAt: record.solvedAt };
      });
    });
    for (var levelNumber = 1; levelNumber <= 10; levelNumber++) {
      if ([1, 2, 3, 4, 5].every(function (assignment) { return completions.some(function (item) { return item.packageId === 'L' + levelNumber + '-A' + assignment; }); })) next.badges.push('Level ' + levelNumber + ' complete');
    }
    return next;
  }
  function createStore(environment) {
    var env = environment || (typeof window !== 'undefined' ? window : {});
    var memory = emptyState();
    var database = null;
    var queue = Promise.resolve();
    var mode = 'memory';
    var warning = '';
    function storage() { try { return env.localStorage; } catch (_) { return null; } }
    function open() {
      return new Promise(function (resolve) {
        try {
          if (!env.indexedDB) return resolve(null);
          var request = env.indexedDB.open('upskillsprint-excel-sprint', 1);
          request.onupgradeneeded = function () { if (!request.result.objectStoreNames.contains('progress')) request.result.createObjectStore('progress'); };
          request.onsuccess = function () { resolve(request.result); };
          request.onerror = function () { resolve(null); };
          request.onblocked = function () { resolve(null); };
        } catch (_) { resolve(null); }
      });
    }
    function readDB() {
      return new Promise(function (resolve) {
        if (!database) return resolve(null);
        try {
          var request = database.transaction('progress', 'readonly').objectStore('progress').get(KEY);
          request.onsuccess = function () { resolve(request.result || null); };
          request.onerror = function () { resolve(null); };
        } catch (_) { resolve(null); }
      });
    }
    function writeDB(value) {
      return new Promise(function (resolve) {
        if (!database) return resolve(false);
        try {
          var transaction = database.transaction('progress', 'readwrite');
          transaction.objectStore('progress').put(value, KEY);
          transaction.oncomplete = function () { resolve(true); };
          transaction.onerror = transaction.onabort = function () { resolve(false); };
        } catch (_) { resolve(false); }
      });
    }
    async function load() {
      database = await open();
      var candidates = [];
      var dbValue = await readDB();
      if (dbValue) try { candidates.push(validateState(dbValue)); } catch (_) { warning = 'Saved progress could not be read. Import a backup to recover it.'; }
      try { var local = storage(); var raw = local && local.getItem(KEY); if (raw) candidates.push(parseBackup(raw)); } catch (_) { warning = 'Saved progress could not be read. Import a backup to recover it.'; }
      if (candidates.length) memory = candidates.sort(function (a, b) { return Date.parse(b.updatedAt) - Date.parse(a.updatedAt); })[0];
      mode = database ? 'indexedDB' : storage() ? 'localStorage' : 'memory';
      await save(memory);
      return memory;
    }
    function save(value) {
      memory = validateState(value);
      memory.updatedAt = new Date().toISOString();
      var snapshot = JSON.parse(JSON.stringify(memory));
      // Write the small backup synchronously too, so pagehide cannot lose the latest draft.
      var localSaved = false;
      try { var local = storage(); if (local) { local.setItem(KEY, JSON.stringify(snapshot)); localSaved = true; } } catch (_) {}
      queue = queue.then(async function () {
        var dbSaved = await writeDB(snapshot);
        mode = dbSaved ? 'indexedDB' : localSaved ? 'localStorage' : 'memory';
        if (mode === 'memory') warning = 'Browser storage is unavailable. Progress lasts only while this page stays open. Export a backup before leaving.';
        else if (warning.indexOf('Browser storage') === 0) warning = '';
        return { mode: mode, warning: warning };
      });
      return queue;
    }
    return { load: load, save: save, status: function () { return { mode: mode, warning: warning }; } };
  }
  return { KEY: KEY, MAX_BACKUP_BYTES: MAX_BACKUP_BYTES, emptyState: emptyState, validateState: validateState, parseBackup: parseBackup, packageNumber: packageNumber, packageId: packageId, unlocked: unlocked, applyVerified: applyVerified, createStore: createStore };
});
