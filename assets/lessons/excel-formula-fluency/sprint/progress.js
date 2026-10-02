(function (root, factory) {
  'use strict';
  var api = factory(typeof module === 'object' && module.exports ? require('./learning.js') : root.ExcelSprintLearning);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ExcelSprintProgress = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Learning) {
  'use strict';
  var KEY = 'upskillsprint.excel-sprint.v1';
  var LEARNING_KEY = KEY + '.learning-recovery';
  var RECOVERY_KEY = KEY + '.progress-recovery';
  // Full-course backups include exact copied results, checked snapshots and
  // signed receipts. A long but valid course record can exceed the old 2 MB cap.
  // UTF-8 and JSON escaping can use several bytes for each saved character.
  var MAX_BACKUP_BYTES = 128 * 1024 * 1024;
  var PACKAGE = /^(?:L(?:[1-9]|10)-A[1-5]|EX-A[1-3])$/;
  function emptyState() {
    var state = { version: 1, updatedAt: new Date().toISOString(), selectedPackageId: 'L1-A1', tokens: [], expertTokens: [], packages: {}, formulas: {}, activityDays: [], badges: [], noticeDismissed: false, backupReminder: null };
    if (Learning) state.learning = Learning.emptyState();
    return state;
  }
  function isObject(value) { return !!value && typeof value === 'object' && !Array.isArray(value); }
  function string(value, max) { return typeof value === 'string' && value.length <= max; }
  function boundedJSONText(value, max) { return string(value, max) && new TextEncoder().encode(value).length <= max; }
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
    if (input.expertTokens !== undefined && (!Array.isArray(input.expertTokens) || input.expertTokens.length > 3 || input.expertTokens.some(function (token) { return !string(token, 20000) || !token; }))) throw new Error('The backup contains invalid Expert Track proofs.');
    state.expertTokens = (input.expertTokens || []).slice();
    if (new Set(state.expertTokens).size !== state.expertTokens.length) throw new Error('The backup contains duplicate Expert Track proofs.');
    if (new Set(state.tokens).size !== state.tokens.length) throw new Error('The backup contains duplicate completion tokens.');
    if (input.selectedPackageId !== undefined && (typeof input.selectedPackageId !== 'string' || !PACKAGE.test(input.selectedPackageId))) throw new Error('The backup has an invalid assignment selection.');
    state.selectedPackageId = input.selectedPackageId || 'L1-A1';
    if (Object.keys(input.packages).length > 53) throw new Error('The backup contains too many assignments.');
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
        if (!/^(?:t[1-5]|bonus)$/.test(taskId) || !isObject(value) || !string(value.formula, 4096) || !safeResult(value.result, 0)) throw new Error('Invalid saved formula or result in backup.');
        copy.submissions[taskId] = { formula: value.formula, result: value.result };
        if (string(value.resultText, 20000)) copy.submissions[taskId].resultText = value.resultText;
      });
      Object.keys(item.tasks || {}).forEach(function (taskId) {
        var value = item.tasks[taskId];
        if (!/^(?:t[1-5]|bonus)$/.test(taskId) || !isObject(value) || typeof value.correct !== 'boolean' || !Number.isInteger(value.attempts) || !finite(value.attempts, 100000)) throw new Error('Invalid saved attempt record in backup.');
        copy.tasks[taskId] = { correct: value.correct, attempts: value.attempts, firstAttemptCorrect: value.firstAttemptCorrect === true ? true : value.firstAttemptCorrect === false ? false : null };
        if (string(value.hint, 4000)) copy.tasks[taskId].hint = value.hint;
        if (typeof value.submissionCorrect === 'boolean') copy.tasks[taskId].submissionCorrect = value.submissionCorrect;
        if (value.checkedSubmission !== undefined) {
          var checked = value.checkedSubmission;
          if (!isObject(checked) || !string(checked.formula, 4096) || !string(checked.resultText, 20000)) throw new Error('Invalid checked submission in backup.');
          copy.tasks[taskId].checkedSubmission = { formula: checked.formula, resultText: checked.resultText };
        }
      });
      state.packages[id] = copy;
    });
    if (Array.isArray(input.activityDays)) state.activityDays = input.activityDays.filter(function (day) { return /^\d{4}-\d{2}-\d{2}$/.test(day); }).slice(-1000);
    if (isObject(input.formulas)) Object.keys(input.formulas).forEach(function (name) {
      var value = input.formulas[name];
      if (/^[A-Z][A-Z0-9. /-]{0,60}$/.test(name) && isObject(value) && typeof value.packageId === 'string' && PACKAGE.test(value.packageId) && validDate(value.learnedAt)) state.formulas[name] = { packageId: value.packageId, learnedAt: value.learnedAt };
    });
    state.noticeDismissed = input.noticeDismissed === true;
    if (Number.isInteger(input.backupReminder) && input.backupReminder >= 1 && input.backupReminder <= 10) state.backupReminder = input.backupReminder;
    if (validDate(input.updatedAt)) state.updatedAt = input.updatedAt;
    if (input.storageRevision !== undefined) {
      if (!Number.isSafeInteger(input.storageRevision) || input.storageRevision < 1 || !string(input.storageWriteId, 80) || !/^[a-zA-Z0-9.-]+$/.test(input.storageWriteId)) throw new Error('Invalid saved progress revision.');
      state.storageRevision = input.storageRevision;
      state.storageWriteId = input.storageWriteId;
      if (input.storageGeneration !== undefined) {
        if (!string(input.storageGeneration,80) || !/^[a-zA-Z0-9.-]+$/.test(input.storageGeneration)) throw new Error('Invalid saved progress generation.');
        state.storageGeneration = input.storageGeneration;
      }
      if (input.storagePreviousGenerations !== undefined) {
        if (!Array.isArray(input.storagePreviousGenerations) || input.storagePreviousGenerations.length > 8 || input.storagePreviousGenerations.some(function (entry) { return !string(entry,80) || !/^[a-zA-Z0-9.-]+$/.test(entry); }) || new Set(input.storagePreviousGenerations).size !== input.storagePreviousGenerations.length) throw new Error('Invalid saved progress generation history.');
        state.storagePreviousGenerations = input.storagePreviousGenerations.slice();
      }
    }
    if (input.learning !== undefined) {
      if (!Learning) throw new Error('Placement and practice records could not be read. Reload the lesson before importing this backup.');
      state.learning = Learning.validateState(input.learning);
    }
    return state;
  }
  function parseBackup(text) {
    if (!boundedJSONText(text, MAX_BACKUP_BYTES)) throw new Error('Choose a progress JSON file smaller than ' + (MAX_BACKUP_BYTES / 1024 / 1024) + ' MB.');
    var parsed;
    try { parsed = JSON.parse(text); } catch (_) { throw new Error('The selected file is not valid JSON.'); }
    return validateState(parsed);
  }
  function packageNumber(id) { var match = /^L(\d+)-A(\d+)$/.exec(id); return match ? (+match[1] - 1) * 5 + +match[2] : 0; }
  function packageId(number) { return 'L' + (Math.floor((number - 1) / 5) + 1) + '-A' + ((number - 1) % 5 + 1); }
  function unlocked(id, completions, available) {
    if (!available || !/^L(?:[1-9]|10)-A[1-5]$/.test(id)) return false;
    var count = packageNumber(id);
    var verified = new Set(completions.map(function (item) { return item.packageId; }));
    for (var index = 1; index < count; index++) if (!verified.has(packageId(index))) return false;
    return true;
  }
  function applyPartial(state, report) {
    if (!isObject(report) || report.verified !== true || typeof report.packageId !== 'string' || !PACKAGE.test(report.packageId) || !string(report.receipt,60000) || !report.receipt || !Array.isArray(report.tasks) || !report.tasks.length || report.tasks.length > 5 || typeof report.completed !== 'boolean') throw new Error('The saved grading record could not be verified.');
    var tasks = {}, seen = new Set();
    function taskCopy(item, bonus) {
      if (!isObject(item) || typeof item.taskId !== 'string' || (bonus ? item.taskId !== 'bonus' : !/^t[1-5]$/.test(item.taskId)) || seen.has(item.taskId) || typeof item.correct !== 'boolean' || !Number.isInteger(item.attempts) || !finite(item.attempts,10000) || (item.attempts === 0 ? item.firstAttemptCorrect !== null || item.correct : typeof item.firstAttemptCorrect !== 'boolean') || item.hint !== null && item.hint !== undefined && !string(item.hint,4000)) throw new Error('The saved grading record could not be verified.');
      seen.add(item.taskId);
      var copy = {correct:item.correct,attempts:item.attempts,firstAttemptCorrect:item.firstAttemptCorrect};
      if (typeof item.hint === 'string') copy.hint = item.hint;
      tasks[item.taskId] = copy;
    }
    report.tasks.forEach(function (item) { taskCopy(item,false); });
    if (report.bonus !== undefined) taskCopy(report.bonus,true);
    var score = Math.round(report.tasks.filter(function (item) { return item.correct; }).length / report.tasks.length * 100);
    var firstScore = Math.round(report.tasks.filter(function (item) { return item.firstAttemptCorrect === true; }).length / report.tasks.length * 100);
    if (report.score !== score || report.firstAttemptScore !== firstScore || report.completed !== (score === 100)) throw new Error('The saved grading record could not be verified.');
    var next = validateState(state);
    var record = next.packages[report.packageId] || {submissions:{},tasks:{},timeMs:0};
    record.tasks = tasks;
    record.receipt = report.receipt;
    record.score = report.score;
    record.firstAttemptScore = report.firstAttemptScore;
    if (!report.completed) delete record.solvedAt;
    next.packages[report.packageId] = record;
    // Receipt checks restore historical counters, never current draft verdicts
    // or completion credit. A verified completion chain remains authoritative.
    return next;
  }
  function applyVerified(state, completions, catalog, expertCompletions) {
    var next = validateState(state);
    next.tokens = completions.map(function (item) { return item.completionToken; });
    next.expertTokens = (expertCompletions || []).map(function (item) { return item.completionToken; });
    next.formulas = {};
    next.badges = [];
    var verifiedIds = new Set(completions.concat(expertCompletions || []).map(function (item) { return item.packageId; }));
    Object.keys(next.packages).forEach(function (id) {
      var record = next.packages[id];
      if (verifiedIds.has(id) || record.receipt) return;
      // Bare local verdicts cannot establish that a grading run happened. Keep
      // the student's draft history, but require checks before claiming a pass.
      delete record.score;
      delete record.firstAttemptScore;
      delete record.solvedAt;
      Object.keys(record.tasks).forEach(function (taskId) {
        var checked = record.tasks[taskId].checkedSubmission;
        var task = {correct:false,attempts:0,firstAttemptCorrect:null};
        if (checked) task.checkedSubmission = checked;
        record.tasks[taskId] = task;
      });
    });
    completions.concat(expertCompletions || []).forEach(function (item) {
      if (!PACKAGE.test(item.packageId)) return;
      var record = next.packages[item.packageId] || { tasks: {}, submissions: {}, timeMs: 0 };
      var previousTasks = record.tasks;
      var bonus = previousTasks.bonus;
      record.tasks = Object.fromEntries(Object.keys(item.attempts).map(function (id) {
        var task = { correct: true, attempts: item.attempts[id], firstAttemptCorrect: !!(item.firstAttemptCorrect && item.firstAttemptCorrect[id]), hint: 'Correct. This task is complete.' };
        if (previousTasks[id] && previousTasks[id].checkedSubmission) task.checkedSubmission = previousTasks[id].checkedSubmission;
        if (previousTasks[id] && typeof previousTasks[id].submissionCorrect === 'boolean') task.submissionCorrect = previousTasks[id].submissionCorrect;
        return [id, task];
      }));
      if (bonus) record.tasks.bonus = bonus;
      record.score = item.score;
      record.firstAttemptScore = item.firstAttemptScore;
      record.solvedAt = new Date(item.timestamp).toISOString();
      next.packages[item.packageId] = record;
      var match = item.packageId.match(/^L(\d+)/);
      var level = match && catalog.levels.find(function (entry) { return entry.level === +match[1]; });
      var pkg = match ? level && level.packages.find(function (entry) { return entry.id === item.packageId; }) : catalog.expert && catalog.expert.packages.find(function (entry) { return entry.id === item.packageId; });
      (pkg && pkg.formulas || []).forEach(function (name) {
        if (!next.formulas[name]) next.formulas[name] = { packageId: item.packageId, learnedAt: record.solvedAt };
      });
    });
    for (var levelNumber = 1; levelNumber <= 10; levelNumber++) {
      if ([1, 2, 3, 4, 5].every(function (assignment) { return completions.some(function (item) { return item.packageId === 'L' + levelNumber + '-A' + assignment; }); })) next.badges.push('Level ' + levelNumber + ' complete');
    }
    if (expertCompletions && expertCompletions.length === 3) next.badges.push('Expert Track complete');
    return next;
  }
  function createStore(environment) {
    var env = environment || (typeof window !== 'undefined' ? window : {});
    var memory = emptyState();
    var database = null;
    var queue = Promise.resolve();
    var mode = 'memory';
    var warning = '';
    var lastSavedAt = 0;
    var lastLearningJSON = null;
    var lastLearningRevision = 0;
    var progressRevision = 0;
    var externalUpdate = false;
    var ownWrites = new Set();
    var writer = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    var writeNumber = 0;
    var lastContent = null;
    var generation = writer + '-initial';
    var previousGenerations = [];
    var setTimer = typeof env.setTimeout === 'function' ? env.setTimeout.bind(env) : setTimeout;
    var clearTimer = typeof env.clearTimeout === 'function' ? env.clearTimeout.bind(env) : clearTimeout;
    var STORAGE_TIMEOUT_MS = 3000;
    function storage() { try { return env.localStorage; } catch (_) { return null; } }
    function learningMirror(value) {
      if (!Learning || !isObject(value) || value.version !== 1 || !validDate(value.updatedAt)) throw new Error('Invalid practice recovery copy.');
      if (value.revision !== undefined && (!Number.isSafeInteger(value.revision) || value.revision < 0)) throw new Error('Invalid practice recovery revision.');
      return { version:1, updatedAt:value.updatedAt, revision:value.revision || 0, learning:Learning.validateState(value.learning) };
    }
    function parseMirror(raw) {
      if (!boundedJSONText(raw, MAX_BACKUP_BYTES)) throw new Error('Invalid practice recovery copy.');
      return learningMirror(JSON.parse(raw));
    }
    function protectedCopy(input) {
      if (!isObject(input) || input.version !== 1 || !Number.isSafeInteger(input.revision) || input.revision < 1 || !string(input.writeId, 80)) throw new Error('Invalid progress recovery copy.');
      var state = validateState(input.state);
      if (state.storageRevision !== input.revision || state.storageWriteId !== input.writeId) throw new Error('Invalid progress recovery copy.');
      return {version:1,revision:input.revision,writeId:input.writeId,state:state};
    }
    function parseProtected(raw) { if (!boundedJSONText(raw, MAX_BACKUP_BYTES + 512)) throw new Error('Invalid progress recovery copy.'); return protectedCopy(JSON.parse(raw)); }
    function content(state) { var copy = validateState(state); delete copy.updatedAt; delete copy.storageRevision; delete copy.storageWriteId; return JSON.stringify(copy); }
    function remember(id) { if (id) ownWrites.add(id); if (ownWrites.size > 128) ownWrites.delete(ownWrites.values().next().value); }
    function conflict(latest, state, baselineContent, baselineRevision) {
      // A surviving marked primary can be newer when only the recovery-key
      // write failed. An older copy cannot supersede that observed revision.
      var latestContent = latest && content(latest.state);
      var changedGeneration = latest && latest.state.storageGeneration && latest.state.storageGeneration !== (state.storageGeneration || memory.storageGeneration || generation);
      if (latest && !changedGeneration && latest.revision < (baselineRevision === undefined ? state.storageRevision || 0 : baselineRevision)) return false;
      return latest && !ownWrites.has(latest.writeId) && latest.writeId !== state.storageWriteId && (changedGeneration || latestContent !== content(state) && latestContent !== baselineContent);
    }
    function flagExternal() { externalUpdate = true; warning = 'Progress changed in another open lesson tab. Export this tab’s current work, then reload to use the latest saved progress.'; }
    function localProtected() {
      var local = storage(), latest = null;
      try { var raw = local && local.getItem(RECOVERY_KEY); if (raw) latest = parseProtected(raw); } catch (_) {}
      try {
        var primaryRaw = local && local.getItem(KEY), primary = primaryRaw && parseBackup(primaryRaw);
        if (primary && primary.storageRevision && (!latest || primary.storageRevision > latest.revision)) latest = {version:1,revision:primary.storageRevision,writeId:primary.storageWriteId,state:primary};
      } catch (_) {}
      return latest;
    }
    function status() {
      if (!externalUpdate && conflict(localProtected(), memory)) flagExternal();
      return {mode:mode,warning:warning,externalUpdate:externalUpdate};
    }
    function bounded(fallback, operation) {
      return new Promise(function (resolve) {
        var settled = false;
        var cancel = null;
        var timer = setTimer(function () {
          if (settled) return;
          settled = true;
          if (cancel) try { cancel(); } catch (_) {}
          resolve(fallback);
        }, STORAGE_TIMEOUT_MS);
        function done(value) { if (settled) return; settled = true; clearTimer(timer); resolve(value); }
        try { cancel = operation(done, function () { return settled; }); } catch (_) { done(fallback); }
      });
    }
    function closeDB(value) { if (database === value) database = null; try { value.close(); } catch (_) {} }
    function open() {
      return bounded(null, function (resolve, settled) {
        try {
          if (!env.indexedDB) return resolve(null);
          var request = env.indexedDB.open('upskillsprint-excel-sprint', 1);
          request.onupgradeneeded = function () { if (!request.result.objectStoreNames.contains('progress')) request.result.createObjectStore('progress'); };
          request.onsuccess = function () { if (settled()) closeDB(request.result); else resolve(request.result); };
          request.onerror = function () { resolve(null); };
          request.onblocked = function () { resolve(null); };
        } catch (_) { resolve(null); }
      });
    }
    function readDB(key) {
      return bounded(null, function (resolve) {
        if (!database) return resolve(null);
        var current = database;
        try {
          var transaction = current.transaction('progress', 'readonly');
          var request = transaction.objectStore('progress').get(key);
          request.onsuccess = function () { resolve(request.result || null); };
          request.onerror = function () { resolve(null); };
          transaction.onabort = transaction.onerror = function () { resolve(null); };
          return function () { try { transaction.abort(); } catch (_) {} closeDB(current); };
        } catch (_) { resolve(null); }
      });
    }
    function writeDB(value, recovery, preserveLearning, source, sourceLearningJSON, protectedState, replace, baselineContent, baselineRevision) {
      return bounded(false, function (resolve) {
        if (!database) return resolve(false);
        var current = database;
        try {
          var transaction = current.transaction('progress', 'readwrite');
          var savedMirror = recovery;
          function write() {
            transaction.objectStore('progress').put(value, KEY);
            if (savedMirror) transaction.objectStore('progress').put(savedMirror, LEARNING_KEY);
            protectedState.state = value;
            transaction.objectStore('progress').put(protectedState, RECOVERY_KEY);
          }
          function afterProtected() { if (recovery) {
            // Read and write the isolated mirror in one transaction, so a stale
            // tab also respects newer practice when localStorage is blocked.
            var request = transaction.objectStore('progress').get(LEARNING_KEY);
            request.onsuccess = function () {
              var latest = null;
              try { if (request.result) latest = learningMirror(request.result); } catch (_) {}
              if (latest && preserveLearning && latest.revision > recovery.revision) {
                savedMirror = latest;
                value.learning = latest.learning;
              } else if (latest && !preserveLearning && latest.revision >= recovery.revision) savedMirror.revision = latest.revision + 1;
              write();
            };
            request.onerror = function () { try { transaction.abort(); } catch (_) {} resolve(false); };
          } else write(); }
          var protectedRequest = transaction.objectStore('progress').get(RECOVERY_KEY);
          protectedRequest.onsuccess = function () {
            var latest = null;
            try { if (protectedRequest.result) latest = protectedCopy(protectedRequest.result); } catch (_) {}
            if (!replace && conflict(latest, value, baselineContent, baselineRevision)) {
              flagExternal();
              // Discard only this tab's provisional disk copy, keeping its DOM
              // work available for export while preserving the newer record.
              try {
                var local = storage(), currentLocal = localProtected();
                if (local && (!currentLocal || ownWrites.has(currentLocal.writeId))) {
                  local.setItem(RECOVERY_KEY, JSON.stringify(latest));
                  local.setItem(KEY, JSON.stringify(latest.state));
                }
              } catch (_) {}
              resolve(false);
              return;
            }
            if (latest) {
              progressRevision = Math.max(progressRevision, latest.revision);
              protectedState.revision = Math.max(protectedState.revision, latest.revision + (content(latest.state) !== content(value) || replace ? 1 : 0));
              value.storageRevision = protectedState.revision;
            }
            afterProtected();
          };
          protectedRequest.onerror = function () { try { transaction.abort(); } catch (_) {} resolve(false); };
          transaction.oncomplete = function () {
            if (externalUpdate) return resolve(false);
            progressRevision = Math.max(progressRevision, protectedState.revision);
            if (source && source.storageWriteId === value.storageWriteId) source.storageRevision = value.storageRevision;
            try {
              var primaryLocal = storage(), rawPrimary = primaryLocal && primaryLocal.getItem(KEY), parsedPrimary = rawPrimary && parseBackup(rawPrimary);
              if (primaryLocal && parsedPrimary && parsedPrimary.storageWriteId === value.storageWriteId) {
                primaryLocal.setItem(RECOVERY_KEY, JSON.stringify(protectedState));
                primaryLocal.setItem(KEY, JSON.stringify(value));
              }
            } catch (_) {}
            if (savedMirror) {
              lastLearningRevision = Math.max(lastLearningRevision, savedMirror.revision);
              if (JSON.stringify(memory.learning) === sourceLearningJSON) { memory.learning = savedMirror.learning; lastLearningJSON = JSON.stringify(memory.learning); }
              if (source && JSON.stringify(source.learning) === sourceLearningJSON) source.learning = Learning.validateState(savedMirror.learning);
              try {
                var local = storage(), raw = local && local.getItem(LEARNING_KEY), latestLocal = raw && parseMirror(raw);
                if (local && (!latestLocal || latestLocal.revision <= savedMirror.revision)) local.setItem(LEARNING_KEY, JSON.stringify(savedMirror));
              } catch (_) {}
            }
            resolve(true);
          };
          transaction.onerror = transaction.onabort = function () { resolve(false); };
          return function () { try { transaction.abort(); } catch (_) {} closeDB(current); };
        } catch (_) { resolve(false); }
      });
    }
    async function load(attempt) {
      attempt = Number.isInteger(attempt) ? attempt : 0;
      if (!database) database = await open();
      var candidates = [];
      var mirrors = [];
      var protectedCandidates = [];
      var stored = await Promise.all([readDB(KEY), Learning ? readDB(LEARNING_KEY) : Promise.resolve(null), readDB(RECOVERY_KEY)]);
      var dbValue = stored[0];
      if (dbValue) try { candidates.push({state:validateState(dbValue),priority:0,hasLearning:Object.prototype.hasOwnProperty.call(dbValue,'learning')}); } catch (_) { warning = 'Saved progress could not be read. Import a backup to recover it.'; }
      if (stored[1]) try { mirrors.push(Object.assign(learningMirror(stored[1]),{priority:0})); } catch (_) { warning = 'A practice recovery copy could not be read. Export a new backup.'; }
      if (stored[2]) try { protectedCandidates.push(Object.assign(protectedCopy(stored[2]),{priority:0})); } catch (_) { warning = 'A progress recovery copy could not be read. Export a new backup.'; }
      try {
        var local = storage();
        var raw = local && local.getItem(KEY);
        if (raw) { var parsed = parseBackup(raw); candidates.push({state:parsed,priority:1,hasLearning:Object.prototype.hasOwnProperty.call(JSON.parse(raw),'learning')}); }
      } catch (_) { warning = 'Saved progress could not be read. Import a backup to recover it.'; }
      if (Learning) try { var recoveryRaw = local && local.getItem(LEARNING_KEY); if (recoveryRaw) mirrors.push(Object.assign(parseMirror(recoveryRaw),{priority:1})); } catch (_) { warning = 'A practice recovery copy could not be read. Export a new backup.'; }
      try { var protectedRaw = local && local.getItem(RECOVERY_KEY); if (protectedRaw) protectedCandidates.push(Object.assign(parseProtected(protectedRaw),{priority:1})); } catch (_) { warning = 'A progress recovery copy could not be read. Export a new backup.'; }
      // localStorage is written synchronously before the queued database transaction.
      // On equal timestamps it therefore holds the latest surviving draft.
      if (candidates.length) {
        var chosen = candidates.sort(function (a, b) { return Date.parse(b.state.updatedAt) - Date.parse(a.state.updatedAt) || b.priority - a.priority; })[0];
        memory = chosen.state;
        lastSavedAt = Date.parse(memory.updatedAt);
        if (warning) warning = 'A damaged saved copy was recovered from another browser copy. Export a backup now.';
      }
      if (protectedCandidates.length) {
        var protectedLatest = protectedCandidates.sort(function (a,b) { return b.revision-a.revision || b.priority-a.priority; })[0];
        if (!chosen || !chosen.state.storageRevision || protectedLatest.revision >= chosen.state.storageRevision) {
          if (chosen && content(chosen.state) !== content(protectedLatest.state)) warning = 'The latest course progress was recovered after another open lesson tab replaced an older saved record. Export a fresh backup.';
          memory = protectedLatest.state;
          chosen = {state:memory,hasLearning:!!memory.learning};
          lastSavedAt = Date.parse(memory.updatedAt);
        }
      }
      progressRevision = memory.storageRevision || 0;
      generation = memory.storageGeneration || generation;
      previousGenerations = memory.storagePreviousGenerations || [];
      remember(memory.storageWriteId);
      // A higher marked primary selected during this initial read can survive
      // a failed reset recovery-key write. Remember only the superseded copies
      // we actually read; a later foreign generation still pauses this tab.
      protectedCandidates.forEach(function (entry) { if (entry.revision < progressRevision && (entry.state.storageGeneration === generation || previousGenerations.indexOf(entry.state.storageGeneration) >= 0)) remember(entry.writeId); });
      if (mirrors.length && (!chosen || !chosen.hasLearning)) {
        var recovered = mirrors.sort(function (a, b) { return b.revision-a.revision || Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || b.priority-a.priority; })[0];
        memory.learning = recovered.learning;
        lastSavedAt = Math.max(lastSavedAt, Date.parse(recovered.updatedAt));
        warning = 'Placement and practice were recovered after another open lesson tab replaced an older saved record. Export a fresh backup.';
      }
      // An explicitly modern empty record can be an intentional reset. Do not
      // revive an earlier mirror merely because its clock was ahead.
      if (chosen && chosen.hasLearning) mirrors.forEach(function (entry) { lastSavedAt = Math.max(lastSavedAt, Date.parse(entry.updatedAt)); });
      lastLearningJSON = Learning && memory.learning ? JSON.stringify(memory.learning) : null;
      if (mirrors.length) {
        var matching = mirrors.filter(function (entry) { return JSON.stringify(entry.learning) === lastLearningJSON; });
        lastLearningRevision = Math.max.apply(Math, (matching.length ? matching : mirrors).map(function (entry) { return entry.revision; })) + (matching.length ? 0 : 1);
      }
      mode = database ? 'indexedDB' : storage() ? 'localStorage' : 'memory';
      lastContent = content(memory);
      await save(memory);
      // The outgoing page can finish its final pagehide transaction while a
      // reload is reading. Before any student view is editable, read the newer
      // record again instead of presenting an immediately paused empty lesson.
      if (status().externalUpdate && attempt < 2) {
        externalUpdate = false;
        warning = '';
        return load(attempt + 1);
      }
      return memory;
    }
    function save(value, options) {
      var baselineContent = lastContent || content(memory);
      var baselineRevision = value.storageRevision || 0;
      var latestProtected = localProtected();
      if (!(options && options.replace) && (externalUpdate || conflict(latestProtected, value, baselineContent))) { flagExternal(); return Promise.resolve(status()); }
      if (options && options.replace) externalUpdate = false;
      if (latestProtected) progressRevision = Math.max(progressRevision,latestProtected.revision);
      var previousLearning = memory.learning;
      var priorGeneration = memory.storageGeneration || generation;
      memory = validateState(value);
      var incomingLearning = memory.learning && JSON.stringify(memory.learning);
      var preserveLearning = Learning && !(options && options.replace) && incomingLearning === lastLearningJSON;
      // A core-only autosave from a second modern tab must not replace newer practice.
      // Explicit import and reset deliberately replace both copies.
      if (preserveLearning) {
        if (previousLearning) memory.learning = previousLearning;
        try {
          var currentLocal = storage();
          var externalRaw = currentLocal && currentLocal.getItem(LEARNING_KEY);
          var external = externalRaw && parseMirror(externalRaw);
          if (external && (external.revision > lastLearningRevision || external.revision === lastLearningRevision && Date.parse(external.updatedAt) > lastSavedAt)) { memory.learning = external.learning; lastSavedAt = Math.max(lastSavedAt, Date.parse(external.updatedAt)); lastLearningRevision = external.revision; }
        } catch (_) {}
      } else if (Learning) {
        try {
          var revisionLocal = storage(), revisionRaw = revisionLocal && revisionLocal.getItem(LEARNING_KEY), latestRevision = revisionRaw && parseMirror(revisionRaw);
          if (latestRevision) lastLearningRevision = Math.max(lastLearningRevision, latestRevision.revision);
        } catch (_) {}
        lastLearningRevision++;
      }
      lastSavedAt = Math.max(Date.now(), lastSavedAt + 1);
      memory.updatedAt = new Date(lastSavedAt).toISOString();
      if (options && options.replace) {
        previousGenerations = [priorGeneration].concat(previousGenerations.filter(function (entry) { return entry !== priorGeneration; })).slice(0,8);
        generation = writer + '-replace-' + (++writeNumber);
      }
      memory.storageGeneration = generation;
      if (previousGenerations.length) memory.storagePreviousGenerations = previousGenerations.slice();
      else delete memory.storagePreviousGenerations;
      progressRevision++;
      memory.storageRevision = progressRevision;
      memory.storageWriteId = writer + '-' + (++writeNumber);
      remember(memory.storageWriteId);
      if (memory.learning && JSON.stringify(memory.learning) !== incomingLearning) value.learning = Learning.validateState(memory.learning);
      lastLearningJSON = memory.learning && JSON.stringify(memory.learning);
      value.updatedAt = memory.updatedAt;
      value.storageRevision = memory.storageRevision;
      value.storageWriteId = memory.storageWriteId;
      value.storageGeneration = memory.storageGeneration;
      if (memory.storagePreviousGenerations) value.storagePreviousGenerations = memory.storagePreviousGenerations.slice();
      else delete value.storagePreviousGenerations;
      var snapshot = JSON.parse(JSON.stringify(memory));
      lastContent = content(snapshot);
      var protectedState = {version:1,revision:progressRevision,writeId:snapshot.storageWriteId,state:snapshot};
      var recovery = Learning && snapshot.learning ? {version:1,updatedAt:snapshot.updatedAt,revision:lastLearningRevision,learning:snapshot.learning} : null;
      var savedLearningJSON = lastLearningJSON;
      // Write the small backup synchronously too, so pagehide cannot lose the latest draft.
      var localSaved = false;
      var local = storage();
      if (recovery) try { if (local) local.setItem(LEARNING_KEY, JSON.stringify(recovery)); } catch (_) {}
      try { if (local) { local.setItem(RECOVERY_KEY, JSON.stringify(protectedState)); localSaved = true; } } catch (_) {}
      try { if (local) { local.setItem(KEY, JSON.stringify(snapshot)); localSaved = true; } } catch (_) {}
      queue = queue.then(async function () {
        var dbSaved = externalUpdate && !(options && options.replace) ? false : await writeDB(snapshot, recovery, preserveLearning, value, savedLearningJSON, protectedState, !!(options && options.replace), baselineContent, baselineRevision);
        mode = dbSaved ? 'indexedDB' : localSaved ? 'localStorage' : 'memory';
        if (mode === 'memory') warning = 'Browser storage is unavailable. Progress lasts only while this page stays open. Export a backup before leaving.';
        else if (warning.indexOf('Browser storage') === 0) warning = '';
        return status();
      });
      return queue;
    }
    return { load: load, save: save, status: status };
  }
  return { KEY: KEY, LEARNING_KEY: LEARNING_KEY, RECOVERY_KEY: RECOVERY_KEY, MAX_BACKUP_BYTES: MAX_BACKUP_BYTES, emptyState: emptyState, validateState: validateState, parseBackup: parseBackup, packageNumber: packageNumber, packageId: packageId, unlocked: unlocked, applyPartial: applyPartial, applyVerified: applyVerified, createStore: createStore };
});
