(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ExcelSprintLearning = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var DRILL = /^R([1-9]|10)-A([12])$/;
  var SKILL = /^level-([1-9]|10)$/;
  var RUN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var INTERVALS = [1, 3, 7, 14];
  var DAY = 86400000;
  function object(value) { return !!value && typeof value === 'object' && !Array.isArray(value); }
  function string(value, max) { return typeof value === 'string' && value.length <= max; }
  function date(value) { return string(value, 40) && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value)); }
  function result(value, depth) {
    if (depth > 3) return false;
    if (value === null || typeof value === 'boolean' || typeof value === 'number' && Number.isFinite(value)) return true;
    if (string(value, 20000)) return true;
    return Array.isArray(value) && value.length <= 300 && value.every(function (entry) { return result(entry, depth + 1); });
  }
  function fail() { throw new Error('The backup contains invalid placement or practice records.'); }
  function skillFor(id) { var match = DRILL.exec(id); return match ? 'level-' + match[1] : null; }
  function emptyState() { return { version: 1, diagnostic: null, diagnosticAnswers: {}, selectedView: 'overview', drills: {}, reviews: {} }; }
  function submissions(input) {
    if (!object(input) || !string(input.formula, 4096) || !result(input.result, 0)) fail();
    var copy = { formula: input.formula, result: JSON.parse(JSON.stringify(input.result)) };
    if (input.resultText !== undefined) { if (!string(input.resultText, 20000)) fail(); copy.resultText = input.resultText; }
    return copy;
  }
  function diagnosticReport(input) {
    if (!object(input) || input.type !== 'diagnostic' || !string(input.runId,36) || !RUN.test(input.runId) || input.completed !== true || !Number.isInteger(input.score) || input.score < 0 || input.score > 100 || !date(input.timestamp) || !string(input.receipt, 60000) || !input.receipt || !Array.isArray(input.skills) || input.skills.length !== 10) fail();
    var seen = new Set();
    var skills = input.skills.map(function (item) {
      if (!object(item) || !SKILL.test(item.skillId) || !Number.isInteger(item.level) || item.skillId !== 'level-' + item.level || seen.has(item.skillId) || ['correct', 'incorrect', 'skipped'].indexOf(item.status) < 0) fail();
      seen.add(item.skillId);
      return { skillId: item.skillId, level: item.level, status: item.status };
    }).sort(function (a, b) { return a.level - b.level; });
    if (input.score !== skills.filter(function (item) { return item.status === 'correct'; }).length * 10) fail();
    return { type: 'diagnostic', runId: input.runId, completed: true, score: input.score, skills: skills, timestamp: input.timestamp, receipt: input.receipt };
  }
  function drillReport(input, id) {
    if (!object(input) || input.type !== 'drill' || !string(input.runId,36) || !RUN.test(input.runId) || typeof id !== 'string' || input.drillId !== id || !DRILL.test(id) || input.skillId !== skillFor(id) || typeof input.correct !== 'boolean' || typeof input.submissionCorrect !== 'boolean' || !Number.isInteger(input.attempts) || input.attempts < 1 || input.attempts > 10000 || typeof input.firstAttemptCorrect !== 'boolean' || !string(input.hint, 4000) || !string(input.receipt, 60000) || !input.receipt) fail();
    if (input.completedAt !== undefined && !date(input.completedAt) || input.correct && !date(input.completedAt) || !input.correct && input.completedAt !== undefined || input.submissionCorrect && !input.correct) fail();
    var copy = { type: 'drill', runId: input.runId, drillId: id, skillId: input.skillId, correct: input.correct, submissionCorrect: input.submissionCorrect, attempts: input.attempts, firstAttemptCorrect: input.firstAttemptCorrect, hint: input.hint, receipt: input.receipt };
    if (input.completedAt !== undefined) copy.completedAt = input.completedAt;
    return copy;
  }
  function validateState(input) {
    if (!object(input) || input.version !== 1 || !object(input.drills) || Object.keys(input.drills).length > 20) fail();
    var state = emptyState();
    if (input.diagnostic !== undefined && input.diagnostic !== null) state.diagnostic = diagnosticReport(input.diagnostic);
    if (input.selectedView !== undefined) {
      if (typeof input.selectedView !== 'string' || input.selectedView !== 'overview' && input.selectedView !== 'diagnostic' && !DRILL.test(input.selectedView)) fail();
      state.selectedView = input.selectedView;
    }
    if (input.diagnosticAnswers !== undefined) {
      if (!object(input.diagnosticAnswers) || Object.keys(input.diagnosticAnswers).length > 10) fail();
      Object.keys(input.diagnosticAnswers).forEach(function (id) {
        var value = input.diagnosticAnswers[id];
        if (!/^q(?:[1-9]|10)$/.test(id) || value !== null && (typeof value !== 'string' || !/^[a-d]$/.test(value))) fail();
        state.diagnosticAnswers[id] = value;
      });
    }
    Object.keys(input.drills).forEach(function (id) {
      var record = input.drills[id];
      if (!DRILL.test(id) || !object(record)) fail();
      var copy = record.receipt ? drillReport(record, id) : {};
      if (!record.receipt && (record.type !== undefined || record.correct !== undefined || record.attempts !== undefined || record.completedAt !== undefined)) fail();
      if (record.submissions !== undefined) copy.submissions = submissions(record.submissions);
      else copy.submissions = { formula: '', result: '', resultText: '' };
      state.drills[id] = copy;
    });
    if (input.reviews !== undefined) {
      if (!object(input.reviews) || Object.keys(input.reviews).length > 10) fail();
      Object.keys(input.reviews).forEach(function (id) {
        var entry = input.reviews[id];
        if (!SKILL.test(id) || !object(entry) || !Number.isInteger(entry.stage) || entry.stage < 1 || entry.stage > 4 || !date(entry.nextReviewAt) || typeof entry.lastDrillId !== 'string' || !DRILL.test(entry.lastDrillId) || skillFor(entry.lastDrillId) !== id || !string(entry.lastRunId,36) || !RUN.test(entry.lastRunId) || !string(entry.lastReceipt, 60000) || !entry.lastReceipt || !date(entry.lastCompletedAt) || Date.parse(entry.nextReviewAt) !== Date.parse(entry.lastCompletedAt) + INTERVALS[entry.stage - 1] * DAY) fail();
        state.reviews[id] = { stage: entry.stage, nextReviewAt: entry.nextReviewAt, lastReceipt: entry.lastReceipt, lastRunId: entry.lastRunId, lastDrillId: entry.lastDrillId, lastCompletedAt: entry.lastCompletedAt };
      });
    }
    return state;
  }
  function applyDiagnostic(state, report) {
    var next = validateState(state);
    next.diagnostic = diagnosticReport(report);
    return next;
  }
  function nowDate(value) { var now = value === undefined ? new Date() : new Date(value); if (!Number.isFinite(now.getTime())) throw new Error('Choose a valid practice date.'); return now; }
  function dayStamp(value) {
    var parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Regina', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(nowDate(value));
    var fields = {}; parts.forEach(function (part) { fields[part.type] = part.value; });
    return fields.year + '-' + fields.month + '-' + fields.day;
  }
  function applyDrill(state, report, nowISO) {
    var next = validateState(state);
    var item = drillReport(report, report && report.drillId);
    var previous = next.drills[item.drillId];
    var review = next.reviews[item.skillId];
    nowDate(nowISO);
    var completed = item.completedAt && Date.parse(item.completedAt);
    var duplicate = previous && previous.correct && (previous.receipt === item.receipt || previous.runId === item.runId) || review && (review.lastReceipt === item.receipt || review.lastRunId === item.runId);
    next.drills[item.drillId] = Object.assign({}, item, { submissions: report.submissions !== undefined ? submissions(report.submissions) : previous && previous.submissions || { formula: '', result: '', resultText: '' } });
    // Only a newly graded correct submission changes this local review schedule.
    // Signed completion counters are copied verbatim and never recalculated here.
    if (item.correct && item.submissionCorrect && !duplicate && (!review || completed >= Date.parse(review.nextReviewAt) && item.drillId !== review.lastDrillId)) {
      var stage = review ? Math.min(review.stage + 1, 4) : 1;
      next.reviews[item.skillId] = { stage: stage, nextReviewAt: new Date(completed + INTERVALS[stage - 1] * DAY).toISOString(), lastReceipt: item.receipt, lastRunId: item.runId, lastDrillId: item.drillId, lastCompletedAt: item.completedAt };
    }
    return next;
  }
  function freshRun(state, id) {
    if (typeof id !== 'string' || !DRILL.test(id)) fail();
    var next = validateState(state);
    next.drills[id] = { submissions: { formula: '', result: '', resultText: '' } };
    return next;
  }
  function recommendations(state, catalog, coreCompletions, nowISO) {
    var learning = validateState(state);
    var now = nowDate(nowISO).getTime();
    var levels = catalog && Array.isArray(catalog.levels) ? catalog.levels : [];
    var skills = catalog && Array.isArray(catalog.skills) ? catalog.skills : [];
    var completions = Array.isArray(coreCompletions) ? coreCompletions : [];
    var completedIds = new Set(completions.map(function (item) { return item.packageId; }));
    var nextCore = null;
    for (var number = 1; number <= 50; number++) {
      var levelNumber = Math.floor((number - 1) / 5) + 1;
      var assignment = (number - 1) % 5 + 1;
      var packageId = 'L' + levelNumber + '-A' + assignment;
      if (completedIds.has(packageId)) continue;
      var coreLevel = levels.find(function (entry) { return entry.level === levelNumber; });
      var corePackage = coreLevel && (coreLevel.packages || []).find(function (entry) { return entry.id === packageId; });
      if (!coreLevel || coreLevel.available) nextCore = { packageId: packageId, title: corePackage && corePackage.title || 'Level ' + levelNumber + ' · Assignment ' + assignment, reason: 'Continue your core assignments in order.' };
      break;
    }
    var candidates = {};
    function solvedSince(skillId, timestamp) {
      var review = learning.reviews[skillId];
      if (review && Date.parse(review.lastCompletedAt) >= Date.parse(timestamp)) return true;
      return Object.keys(learning.drills).some(function (id) { var entry = learning.drills[id]; return skillFor(id) === skillId && entry.correct && date(entry.completedAt) && Date.parse(entry.completedAt) >= Date.parse(timestamp); });
    }
    function add(skillId, reason, priority) {
      var number = +(SKILL.exec(skillId) || [])[1];
      if (!number || candidates[skillId] && candidates[skillId].priority <= priority) return;
      var level = levels.find(function (entry) { return entry.level === number; });
      var skill = skills.find(function (entry) { return entry.id === skillId; });
      var review = learning.reviews[skillId];
      var due = !!(review && Date.parse(review.nextReviewAt) <= now);
      var wrong = ['R' + number + '-A1', 'R' + number + '-A2'].find(function (id) { var drill = learning.drills[id]; return drill && drill.receipt && !drill.correct; });
      var id = due && review ? 'R' + number + '-A' + (/-A1$/.test(review.lastDrillId) ? '2' : '1') : wrong || 'R' + number + '-A1';
      if (!wrong && !due && learning.drills[id] && learning.drills[id].correct) id = 'R' + number + '-A2';
      var training = catalog && catalog.learning && Array.isArray(catalog.learning.drills) ? catalog.learning.drills.find(function (entry) { return entry.id === id; }) : null;
      if (!training && skill && Array.isArray(skill.drills)) training = skill.drills.find(function (entry) { return entry.id === id; });
      candidates[skillId] = { id: id, skillId: skillId, level: number, title: training && training.title || (skill && skill.title || level && level.title || 'Level ' + number) + ' practice', reason: reason, due: due, stage: review ? review.stage : 0, priority: priority };
    }
    if (learning.diagnostic) learning.diagnostic.skills.forEach(function (skill) {
      if (skill.status !== 'correct' && !solvedSince(skill.skillId, learning.diagnostic.timestamp)) add(skill.skillId, skill.status === 'skipped' ? 'Review a skill you skipped in the diagnostic.' : 'Review a skill missed in the diagnostic.', 0);
    });
    completions.forEach(function (item) {
      var match = /^L([1-9]|10)-A[1-5]$/.exec(item.packageId);
      if (match && typeof item.firstAttemptScore === 'number' && item.firstAttemptScore < 70 && date(item.timestamp) && !solvedSince('level-' + match[1], item.timestamp)) add('level-' + match[1], 'Practise a core skill with a first-attempt score below 70%.', 1);
    });
    Object.keys(learning.drills).forEach(function (id) { var entry = learning.drills[id]; if (entry.receipt && !entry.correct) add(skillFor(id), 'Retry an unfinished practice drill.', 2); });
    Object.keys(learning.reviews).forEach(function (id) { if (Date.parse(learning.reviews[id].nextReviewAt) <= now) add(id, 'A spaced review is due.', 3); });
    var practice = Object.keys(candidates).map(function (id) { return candidates[id]; }).sort(function (a, b) { return a.priority - b.priority || a.level - b.level; }).map(function (item) { delete item.priority; return item; });
    return { nextCore: nextCore, practice: practice };
  }
  return { emptyState: emptyState, validateState: validateState, applyDiagnostic: applyDiagnostic, applyDrill: applyDrill, freshRun: freshRun, recommendations: recommendations, dayStamp: dayStamp };
});
