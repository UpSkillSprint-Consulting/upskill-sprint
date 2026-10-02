(function (root, factory) {
  'use strict';
  var api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ExcelSprintLearningApp = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';
  var BASE = '/assets/lessons/excel-formula-fluency/sprint/learning/';
  var ENDPOINT = '/api/excel-sprint/learning';
  function escape(value) { return String(value === null || value === undefined ? '' : value).replace(/[&<>"']/g, function (character) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]; }); }
  function parseResult(text, type) {
    var value = String(text).replace(/\r/g, '');
    if (type === 'array') value = value.replace(/\n$/, '');
    else value = value.trim();
    if (!value.trim()) throw new Error('Enter the result Excel produced.');
    if (value.length > 16000) throw new Error('Paste only the requested output range.');
    if (type === 'number') {
      if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value) || !Number.isFinite(Number(value))) throw new Error('Enter a number without units or thousands separators.');
      return Number(value);
    }
    if (type === 'array') {
      var rows = value.split('\n').map(function (row) { return row.split('\t'); });
      if (rows.length > 300 || rows.some(function (row) { return row.length > 20; })) throw new Error('Separate columns with tabs and rows with new lines.');
      return rows;
    }
    return value;
  }
  function resultText(submission) {
    if (!submission) return '';
    if (typeof submission.resultText === 'string') return submission.resultText;
    if (Array.isArray(submission.result)) return submission.result.map(function (row) { return Array.isArray(row) ? row.join('\t') : row; }).join('\n');
    return submission.result === null || submission.result === undefined ? '' : String(submission.result);
  }
  function mount(options) {
    var element = options.element, L = root.ExcelSprintLearning;
    if (!element || !L) return {refresh:function () {},collectDrafts:function () {},destroy:function () {}};
    var catalog = null, currentDrill = null, drillCache = new Map(), verifiedReports = new Map(), models = new Map();
    var destroyed = false, busy = false, checking = false, refreshSequence = 0, view = 'overview', deferredRender = false;
    var message = '', messageError = false, verificationWarning = '', lastReceiptFingerprint = '', lastCoreFingerprint = '';
    var now = typeof options.now === 'function' ? options.now : function () { return new Date().toISOString(); };
    function localState() { return L.validateState(options.getState() || L.emptyState()); }
    function save(next) { if (!destroyed) return options.saveState(next); }
    function notice(text, error) { message = text || ''; messageError = !!error; renderNotice(); }
    function renderNotice() {
      var target = element.querySelector('[data-learning-message]');
      if (!target) return;
      target.textContent = message; target.hidden = !message;
      target.className = 'sprint-message' + (messageError ? ' sprint-message-error' : '');
      target.setAttribute('role', messageError ? 'alert' : 'status');
    }
    function trustedState() {
      var next = localState();
      next.diagnostic = next.diagnostic && verifiedReports.get(next.diagnostic.receipt) || null;
      Object.keys(next.drills || {}).forEach(function (id) {
        var saved = next.drills[id], report = saved.receipt && verifiedReports.get(saved.receipt);
        next.drills[id] = report && report.type === 'drill' && report.drillId === id ? Object.assign({}, report, {submissions:saved.submissions || {}}) : {submissions:saved.submissions || {}};
      });
      Object.keys(next.reviews || {}).forEach(function (skillId) {
        var review = next.reviews[skillId], report = verifiedReports.get(review.lastReceipt);
        if (!report || report.type !== 'drill' || !report.correct || report.skillId !== skillId || report.drillId !== review.lastDrillId || report.completedAt !== review.lastCompletedAt || report.runId !== review.lastRunId) delete next.reviews[skillId];
      });
      return next;
    }
    function matches(report, expected, token) {
      return !!report && report.type === expected.type && report.receipt === token && (expected.type !== 'drill' || report.drillId === expected.drillId);
    }
    function allReceipts(state) {
      var entries = [];
      if (state.diagnostic && state.diagnostic.receipt) entries.push({type:'diagnostic',token:state.diagnostic.receipt});
      Object.keys(state.drills || {}).forEach(function (id) { if (state.drills[id].receipt) entries.push({type:'drill',drillId:id,token:state.drills[id].receipt}); });
      // A review anchor can outlive the current draft or an early fresh run of its variant.
      Object.keys(state.reviews || {}).forEach(function (id) { var review = state.reviews[id]; if (review.lastReceipt) entries.push({type:'drill',drillId:review.lastDrillId,token:review.lastReceipt}); });
      return entries.filter(function (entry, index) { return entries.findIndex(function (other) { return other.token === entry.token; }) === index; });
    }
    function receiptFingerprint(state) { return JSON.stringify(allReceipts(state)); }
    function coreFingerprint() { return JSON.stringify((options.getCompletions() || []).map(function (item) { return item.packageId; })); }
    function collectDrafts() {
      if (destroyed || !catalog) return;
      var state = localState(), changed = false;
      if (view === 'diagnostic' && element.querySelector('[data-learning-diagnostic]')) {
        state.diagnosticAnswers = state.diagnosticAnswers || {};
        catalog.diagnostic.questions.forEach(function (question) {
          var selected = element.querySelector('input[name="learning-' + question.id + '"]:checked');
          var answer = selected && selected.value !== 'skip' ? selected.value : null;
          if (state.diagnosticAnswers[question.id] !== answer) { state.diagnosticAnswers[question.id] = answer; changed = true; }
        });
      }
      if (currentDrill && view === currentDrill.id) {
        var formula = element.querySelector('[data-learning-formula]'), result = element.querySelector('[data-learning-result]');
        if (formula && result) {
          var parsed;
          try { parsed = parseResult(result.value, currentDrill.task.type); } catch (_) { parsed = result.value; }
          var draft = {formula:formula.value,result:parsed,resultText:result.value};
          state.drills[currentDrill.id] = state.drills[currentDrill.id] || {};
          if (JSON.stringify(state.drills[currentDrill.id].submissions) !== JSON.stringify(draft)) { state.drills[currentDrill.id].submissions = draft; changed = true; }
        }
      }
      if (changed) save(state);
    }
    function setView(nextView) {
      collectDrafts(); view = nextView;
      var state = localState(); state.selectedView = view; save(state);
    }
    function heading() {
      return '<div class="sprint-learning-heading"><div><p class="sprint-eyebrow">Placement and focused practice</p><h3 id="sprint-learning-heading">Find your next learning step</h3><p>Check your starting point, practise a weak skill, and return for a short review.</p></div>' + (view !== 'overview' ? '<button type="button" class="sprint-button" data-learning-action="overview"' + (busy ? ' disabled' : '') + '>Back to learning plan</button>' : '') + '</div><p class="sprint-muted">Placement and practice guide your learning. They do not unlock core assignments or count toward certificates.</p><div data-learning-message class="sprint-message" role="status" aria-live="polite" hidden></div>';
    }
    function dateLabel(value) {
      if (!value) return '';
      try { return new Intl.DateTimeFormat('en-CA', {timeZone:'America/Regina',year:'numeric',month:'short',day:'numeric'}).format(new Date(value)); } catch (_) { return ''; }
    }
    function diagnosticReport(report) {
      if (!report) return '';
      var labels = {correct:'Correct answer',incorrect:'Needs practice',skipped:'Unassessed'};
      return '<div class="sprint-learning-report"><h4>Your latest placement check</h4><p>' + escape(report.score) + '% correct · ' + escape(dateLabel(report.timestamp)) + '. This is a starting-point check, not proof of formula mastery.</p><ul class="sprint-learning-skill-results">' + report.skills.map(function (skill) {
        var item = catalog.skills.find(function (entry) { return entry.id === skill.skillId; });
        return '<li><span>Level ' + escape(skill.level) + ' · ' + escape(item && item.title || skill.skillId) + '</span><strong>' + escape(labels[skill.status] || 'Unassessed') + '</strong></li>';
      }).join('') + '</ul></div>';
    }
    function renderOverview() {
      var state = trustedState(), recommendations = L.recommendations(state, catalog, options.getCompletions() || [], now());
      var nextCore = recommendations.nextCore, hasDraft = Object.keys(state.diagnosticAnswers || {}).length > 0;
      element.innerHTML = heading() + '<div class="sprint-inline-actions"><button type="button" class="sprint-button sprint-primary" data-learning-action="diagnostic">' + (hasDraft ? 'Continue placement check' : state.diagnostic ? 'Retake placement check' : 'Take the 10-question placement check') + '</button>' + (hasDraft ? '<button type="button" class="sprint-link-button" data-learning-action="new-diagnostic">Discard placement draft and start again</button>' : '') + '<span class="sprint-muted">About 10 minutes · one question per level · skipping is allowed</span></div>' +
        (checking ? '<p class="sprint-muted" role="status">Checking saved placement and practice results…</p>' : '') +
        (verificationWarning ? '<div class="sprint-message sprint-message-error" role="status"><p>' + escape(verificationWarning) + '</p><button type="button" class="sprint-button" data-learning-action="verify">Retry saved-result verification</button></div>' : '') + diagnosticReport(state.diagnostic) +
        '<div class="sprint-learning-core"><h4>Your next core assignment</h4>' + (nextCore ? '<p>' + escape(nextCore.packageId) + ' · ' + escape(nextCore.title || 'Continue the core path') + '</p><p class="sprint-muted">' + escape(nextCore.reason) + '</p><button type="button" class="sprint-button" data-learning-core="' + escape(nextCore.packageId) + '">Continue core path</button>' : '<p>All 50 core assignments are complete. Keep skills fresh with focused practice.</p>') + '</div>' +
        '<h4>Focused practice and review</h4><p class="sprint-muted">Reviews are due after 1, 3, 7 and 14 days. Dates use Regina time. Return here to see what is due.</p><div class="sprint-learning-grid">' + recommendations.practice.map(function (item) {
          var saved = state.drills[item.id], unfinished = saved && !saved.correct && (saved.receipt || saved.submissions && (saved.submissions.formula || resultText(saved.submissions))), fresh = item.due && !unfinished || saved && saved.correct;
          return '<article class="sprint-learning-card"><p class="sprint-eyebrow">Level ' + escape(item.level) + (item.due ? ' · Review due' : '') + '</p><h5>' + escape(item.title) + '</h5><p>' + escape(item.reason) + '</p><button type="button" class="sprint-button' + (item.due ? ' sprint-primary' : '') + '" data-learning-drill="' + escape(item.id) + '"' + (fresh ? ' data-learning-fresh="true"' : '') + '>' + (item.due ? unfinished ? 'Continue due review' : 'Start due review' : saved && saved.correct ? 'Practise again' : unfinished ? 'Continue practice' : 'Start practice') + '</button></article>';
        }).join('') + '</div>' + (!recommendations.practice.length ? '<p class="sprint-muted">No reviews are due right now. Choose a skill below for fresh practice.</p>' : '') +
        '<details class="sprint-learning-all-skills"><summary>Choose a skill to practise</summary><p>All 20 practice datasets are available. Pick either variant; core assignments still follow their usual sequence.</p><div class="sprint-learning-grid">' + catalog.skills.map(function (skill) {
          return '<article class="sprint-learning-card"><p class="sprint-eyebrow">Level ' + escape(skill.level) + '</p><h5>' + escape(skill.title) + '</h5><div class="sprint-inline-actions">' + skill.drills.map(function (drill, index) { return '<button type="button" class="sprint-button" data-learning-drill="' + escape(drill.id) + '">Variant ' + (index + 1) + ' · ' + escape(drill.title) + '</button>'; }).join('') + '</div></article>';
        }).join('') + '</div></details>';
      renderNotice();
    }
    function renderDiagnostic() {
      var state = localState(), answers = state.diagnosticAnswers || {};
      element.innerHTML = heading() + '<form data-learning-diagnostic><h4>' + escape(catalog.diagnostic.title) + '</h4><p>Choose one answer for each question. Choose “Skip / unsure” if you have not learned that skill. Unanswered questions are also marked unassessed.</p>' + catalog.diagnostic.questions.map(function (question, index) {
        return '<fieldset class="sprint-learning-question"><legend>' + (index + 1) + '. Level ' + escape(question.level) + ' · ' + escape(question.prompt) + '</legend>' + question.options.concat([{id:'skip',text:'Skip / unsure — leave this skill unassessed'}]).map(function (option) {
          var checked = answers[question.id] === option.id || answers[question.id] === null && option.id === 'skip';
          return '<label class="sprint-learning-option"><input type="radio" name="learning-' + escape(question.id) + '" value="' + escape(option.id) + '"' + (checked ? ' checked' : '') + (busy ? ' disabled' : '') + '><span>' + escape(option.text) + '</span></label>';
        }).join('') + '</fieldset>';
      }).join('') + '<button type="submit" class="sprint-button sprint-primary"' + (busy ? ' disabled' : '') + '>' + (busy ? 'Checking placement…' : 'Show my learning plan') + '</button></form>';
      renderNotice();
    }
    function datasetMarkup(dataset) {
      return '<section class="sprint-dataset"><h4>Practice dataset</h4><p class="sprint-muted">Fictitious data. Use the downloaded workbook, or paste copied data into a sheet named Data with headings in row 1.</p><div class="sprint-inline-actions">' +
        (dataset.xlsx ? '<a class="sprint-button" href="' + escape(dataset.xlsx) + '" download>Download practice .xlsx</a>' : '') + (dataset.csv ? '<a class="sprint-button" href="' + escape(dataset.csv) + '" download>Download .csv</a>' : '') + '<button type="button" class="sprint-button" data-learning-action="copy">Copy data for Excel</button></div><div class="sprint-table-scroll" tabindex="0" role="region" aria-label="Practice data table"><table><caption>Data · ' + dataset.rows.length + ' rows</caption><thead><tr>' + dataset.headers.map(function (header) { return '<th scope="col">' + escape(header) + '</th>'; }).join('') + '</tr></thead><tbody>' + dataset.rows.map(function (row) { return '<tr>' + row.map(function (cell) { return '<td>' + escape(cell) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' + (dataset.columns && dataset.columns.length ? '<details><summary>Column meanings</summary><dl class="sprint-dictionary">' + dataset.columns.map(function (column) { return '<div><dt>' + escape(column.name) + '</dt><dd>' + escape(column.description) + '</dd></div>'; }).join('') + '</dl></details>' : '') + '</section>';
    }
    function modelMarkup(data) {
      if (!data) return '';
      return '<div class="sprint-solutions"><h5>One model formula</h5><div class="sprint-formula-block"><code>' + escape(data.model) + '</code></div>' + (data.alternatives || []).map(function (alternative) { return '<p>Another approach</p><div class="sprint-formula-block"><code>' + escape(typeof alternative === 'string' ? alternative : alternative.formula || alternative.model) + '</code></div>'; }).join('') + '<p class="sprint-muted">Compare the logic and references with your own formula. These formulas were not executed in your workbook by this checker.</p></div>';
    }
    function renderDrill() {
      if (!currentDrill) return;
      var drill = currentDrill, local = localState().drills[drill.id] || {}, state = trustedState(), report = state.drills[drill.id] || {}, draft = local.submissions || {};
      var unverified = !!local.receipt && !report.receipt, complete = report.correct === true;
      var formulas = drill.lesson.formulas || drill.lesson.functions || [];
      element.innerHTML = heading() + '<div class="sprint-learning-drill-heading"><p class="sprint-eyebrow">Level ' + escape(drill.level) + ' · Focused practice · ' + escape(drill.id) + '</p><h4>' + escape(drill.title) + '</h4><p>' + escape(drill.scenario) + '</p></div>' +
        '<section class="sprint-lesson"><p>' + escape(drill.lesson.intro) + '</p><div class="sprint-lesson-functions">' + formulas.map(function (formula) { return '<article class="sprint-function"><h5>' + escape(formula.name) + '</h5><p>' + escape(formula.explanation || formula.purpose) + '</p><div class="sprint-formula-block"><code>' + escape(formula.syntax) + '</code></div><p>Example: <code>' + escape(formula.example) + '</code> → ' + escape(Array.isArray(formula.result) ? JSON.stringify(formula.result) : formula.result) + '</p></article>'; }).join('') + '</div></section>' + datasetMarkup(drill.dataset) +
        (unverified ? '<div class="sprint-message sprint-message-error" role="status"><p>The saved practice result is not verified yet. Your formula and output are still saved.</p><div class="sprint-inline-actions"><button type="button" class="sprint-button" data-learning-action="verify"' + (busy ? ' disabled' : '') + '>Retry verification</button><button type="button" class="sprint-button" data-learning-action="fresh"' + (busy ? ' disabled' : '') + '>Start a fresh attempt</button></div></div>' : '') +
        '<form data-learning-grade class="sprint-task"><h5>Your practice task</h5><p>' + escape(drill.task.prompt) + '</p><p>Output: <code>' + escape(drill.task.output) + '</code>. ' + (drill.task.type === 'array' ? 'Paste the exact range with tabs between columns and new lines between rows. Text identifiers and blank cells are kept.' : 'Enter the result from Excel without units.') + '</p><div class="sprint-task-fields"><div><label for="learning-formula">Your Excel formula</label><textarea id="learning-formula" data-learning-formula spellcheck="false" maxlength="4096"' + (busy || complete ? ' readonly' : '') + '>' + escape(draft.formula) + '</textarea></div><div><label for="learning-result">Excel result</label><textarea id="learning-result" data-learning-result spellcheck="false" maxlength="16000"' + (busy || complete ? ' readonly' : '') + '>' + escape(resultText(draft)) + '</textarea></div></div><div class="sprint-learning-feedback" role="status" aria-live="polite">' + (report.receipt ? '<p class="' + (complete ? 'sprint-status-good' : 'sprint-task-error') + '">' + (complete ? 'Practice complete' : 'Not correct yet') + ' · ' + report.attempts + (report.attempts === 1 ? ' attempt' : ' attempts') + '</p><p>' + escape(report.hint) + '</p>' : '') + '</div><div class="sprint-inline-actions"><button type="submit" class="sprint-button sprint-primary"' + (busy || complete || unverified ? ' disabled' : '') + '>' + (busy ? 'Checking result…' : 'Check my result') + '</button>' + (complete ? '<button type="button" class="sprint-button" data-learning-action="solutions"' + (busy ? ' disabled' : '') + '>Compare model formulas</button><button type="button" class="sprint-button" data-learning-action="fresh"' + (busy ? ' disabled' : '') + '>Start fresh practice</button>' : '') + '</div><p class="sprint-muted">Checks compare your submitted output and formula syntax. Run the formula in Excel to test how it behaves with the data.</p>' + modelMarkup(models.get(report.receipt)) + '</form>' +
        (state.reviews[drill.skillId] ? '<p class="sprint-notice">Next review: ' + escape(dateLabel(state.reviews[drill.skillId].nextReviewAt)) + ' (Regina time). Open your learning plan for the next dataset.</p>' : '');
      renderNotice();
    }
    function render() {
      if (destroyed || !catalog) return;
      if (view === 'diagnostic') renderDiagnostic();
      else if (currentDrill && view === currentDrill.id) renderDrill();
      else renderOverview();
    }
    function refreshRender() {
      var focused = element.ownerDocument.activeElement;
      if (focused && element.contains(focused) && focused.matches('textarea, input')) { deferredRender = true; return; }
      collectDrafts(); deferredRender = false; render();
    }
    function focusView() {
      var target = element.querySelector('.sprint-learning-drill-heading h4') || element.querySelector('[data-learning-diagnostic] h4') || element.querySelector('#sprint-learning-heading');
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({preventScroll:true}); }
    }
    function focusFeedback() {
      var target = messageError ? element.querySelector('[data-learning-message]') : element.querySelector('.sprint-learning-feedback');
      if (target && target.textContent) { target.setAttribute('tabindex', '-1'); target.focus({preventScroll:true}); }
    }
    async function openDrill(id, fresh) {
      if (busy || destroyed || !/^R(?:[1-9]|10)-A[12]$/.test(id)) return;
      collectDrafts(); busy = true; notice('Loading practice dataset…');
      try {
        var drill = drillCache.get(id) || await options.request(BASE + 'drills/' + id + '.json');
        if (destroyed) return;
        if (!drill || drill.id !== id || !drill.task || !drill.dataset) throw new Error('The practice dataset is incomplete. Try again.');
        drillCache.set(id, drill);
        if (fresh) save(L.freshRun(localState(), id));
        currentDrill = drill; setView(id); notice('');
      } catch (error) { if (!destroyed) notice(error.message, true); }
      finally { if (!destroyed) { busy = false; render(); focusView(); } }
    }
    async function submitDiagnostic() {
      if (busy || destroyed) return;
      collectDrafts(); var state = localState();
      var answers = catalog.diagnostic.questions.map(function (question) { return {questionId:question.id,optionId:state.diagnosticAnswers[question.id] || null}; });
      busy = true; notice(''); renderDiagnostic();
      try {
        var report = await options.request(ENDPOINT, {action:'diagnostic',answers:answers});
        if (destroyed) return;
        if (!report || report.type !== 'diagnostic' || report.completed !== true || !report.receipt || !Array.isArray(report.skills) || report.skills.length !== catalog.diagnostic.questions.length) throw new Error('The placement response was incomplete. Your choices are saved; try again.');
        var next = L.applyDiagnostic(localState(), report); verifiedReports.set(report.receipt, report);
        next.diagnosticAnswers = {}; next.selectedView = 'overview'; view = 'overview'; save(next);
        notice('Your placement check is ready. Skipped skills remain unassessed.');
      } catch (error) { if (!destroyed) notice(error.message, true); }
      finally { if (!destroyed) { busy = false; render(); focusView(); } }
    }
    async function submitDrill() {
      if (busy || destroyed || !currentDrill) return;
      collectDrafts(); var drill = currentDrill, saved = localState().drills[drill.id] || {}, draft = saved.submissions || {};
      if (saved.receipt && !verifiedReports.has(saved.receipt)) { notice('Verify the saved result or start a fresh attempt before checking.', true); return; }
      var parsed;
      try {
        if (!/^\s*=\s*\S/.test(draft.formula || '')) throw new Error('Enter a formula beginning with =.');
        parsed = parseResult(resultText(draft), drill.task.type);
      } catch (error) { notice(error.message, true); return; }
      busy = true; notice(''); renderDrill();
      try {
        var report = await options.request(ENDPOINT, {action:'grade',drillId:drill.id,formula:draft.formula,result:parsed,receipt:saved.receipt});
        if (destroyed) return;
        if (!report || report.type !== 'drill' || report.drillId !== drill.id || report.skillId !== drill.skillId || !report.receipt || typeof report.correct !== 'boolean') throw new Error('The practice response was incomplete. Your work is saved; try again.');
        var source = localState(); source.reviews = trustedState().reviews;
        var next = L.applyDrill(source, report, now()); verifiedReports.set(report.receipt, report); save(next);
        notice(report.correct ? 'Practice result checked. Your next review is on the learning plan.' : 'Your work is saved. Use the hint, revise the formula in Excel, and try again.');
      } catch (error) { if (!destroyed) notice(error.message, true); }
      finally { if (!destroyed) { busy = false; render(); focusFeedback(); } }
    }
    async function showSolutions() {
      if (busy || destroyed || !currentDrill) return;
      var id = currentDrill.id, report = trustedState().drills[id];
      if (!report || !report.correct) { notice('Complete this practice task before comparing model formulas.', true); return; }
      if (models.has(report.receipt)) { renderDrill(); return; }
      collectDrafts(); busy = true; notice('Loading model formulas…'); renderDrill();
      try {
        var data = await options.request(ENDPOINT, {action:'solutions',drillId:id,token:report.receipt});
        if (destroyed) return;
        if (!data || data.drillId !== id || typeof data.model !== 'string' || data.alternatives !== undefined && !Array.isArray(data.alternatives)) throw new Error('The model formula was unavailable. Try again.');
        models.set(report.receipt, data); notice('');
      } catch (error) { if (!destroyed) notice(error.message, true); }
      finally { if (!destroyed) { busy = false; renderDrill(); var heading = element.querySelector('.sprint-solutions h5'); if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({preventScroll:true}); } else focusFeedback(); } }
    }
    async function copyData() {
      if (!currentDrill) return;
      var data = currentDrill.dataset, text = [data.headers].concat(data.rows).map(function (row) { return row.map(function (cell) { var value = cell === null || cell === undefined ? '' : String(cell); return /[\t\n\r"]/.test(value) ? '"' + value.replace(/"/g, '""') + '"' : value; }).join('\t'); }).join('\n');
      try {
        if (!root.navigator.clipboard || !root.navigator.clipboard.writeText) throw new Error('Clipboard access is unavailable. Download the workbook or CSV instead.');
        await root.navigator.clipboard.writeText(text);
        if (!destroyed) notice('Data copied. Paste into Data!A1 in Excel.');
      } catch (error) { if (!destroyed) notice(error.message || 'Copy failed. Download the workbook or CSV instead.', true); }
    }
    async function refresh(force) {
      if (destroyed) return;
      var sequence = ++refreshSequence;
      try {
        if (!catalog) {
          element.innerHTML = '<p class="sprint-loading" role="status">Loading placement and focused practice…</p>';
          catalog = await options.request(BASE + 'catalog.json');
          if (destroyed || sequence !== refreshSequence) return;
          if (!catalog || catalog.version !== 1 || !catalog.diagnostic || !Array.isArray(catalog.diagnostic.questions) || !Array.isArray(catalog.skills)) throw new Error('Placement and practice are unavailable. Try again.');
          view = localState().selectedView || 'overview';
          if (/^R(?:[1-9]|10)-A[12]$/.test(view)) {
            currentDrill = await options.request(BASE + 'drills/' + view + '.json');
            if (destroyed || sequence !== refreshSequence) return;
            drillCache.set(view, currentDrill);
          }
        }
        var state = localState(), fingerprint = receiptFingerprint(state), core = coreFingerprint();
        if (!force && fingerprint === lastReceiptFingerprint && core === lastCoreFingerprint) return;
        lastCoreFingerprint = core;
        var entries = allReceipts(state), pending = entries.filter(function (entry) { return !verifiedReports.has(entry.token); });
        checking = pending.length > 0;
        if (!busy && (view === 'overview' || !element.querySelector('[data-learning-grade], [data-learning-diagnostic]'))) refreshRender();
        var eligible = pending.filter(function (entry) { return typeof entry.token === 'string' && entry.token.length > 0 && entry.token.length <= 6000; });
        var failed = eligible.length !== pending.length;
        // Receipts are checked independently so one unavailable result does not hide other verified practice.
        if (eligible.length) {
          try {
            var batch = await options.request(ENDPOINT, {action:'verify-many',tokens:eligible.map(function (entry) { return entry.token; })});
            if (destroyed || sequence !== refreshSequence) return;
            if (!batch || !Array.isArray(batch.results)) throw new Error('Saved results could not be verified.');
            eligible.forEach(function (expected) {
              var result = batch.results.find(function (entry) { return entry.token === expected.token; });
              if (!result || result.verified !== true || !matches(result.report, expected, expected.token)) { failed = true; return; }
              verifiedReports.set(expected.token, result.report);
            });
          } catch (_) { if (destroyed || sequence !== refreshSequence) return; failed = true; }
        }
        if (destroyed || sequence !== refreshSequence) return;
        checking = false; lastReceiptFingerprint = fingerprint;
        verificationWarning = failed ? 'Some saved learning results could not be verified. Drafts are kept. Retry verification, retake placement, or start fresh practice.' : '';
        // Leave active text fields and radio focus intact during ordinary core-summary updates.
        if (!busy && (view === 'overview' || pending.length)) refreshRender();
      } catch (error) {
        if (!destroyed && sequence === refreshSequence) {
          checking = false; catalog = null;
          element.innerHTML = '<h3>Placement and focused practice</h3><div class="sprint-message sprint-message-error" role="alert">' + escape(error.message) + '</div><button type="button" class="sprint-button" data-learning-action="verify">Try again</button>';
        }
      }
    }
    function click(event) {
      var target = event.target.closest('[data-learning-action], [data-learning-drill], [data-learning-core]');
      if (!target || !element.contains(target) || target.disabled || busy) return;
      if (target.hasAttribute('data-learning-drill')) { openDrill(target.getAttribute('data-learning-drill'), target.getAttribute('data-learning-fresh') === 'true'); return; }
      if (target.hasAttribute('data-learning-core')) { collectDrafts(); options.openCore(target.getAttribute('data-learning-core')); return; }
      var action = target.getAttribute('data-learning-action');
      if (action === 'overview') { setView('overview'); currentDrill = null; notice(''); render(); focusView(); }
      if (action === 'diagnostic' || action === 'new-diagnostic') {
        collectDrafts(); var state = localState(); if (action === 'new-diagnostic') state.diagnosticAnswers = {}; state.selectedView = 'diagnostic'; save(state); view = 'diagnostic'; currentDrill = null; notice(''); render(); focusView();
      }
      if (action === 'verify') refresh(true);
      if (action === 'fresh' && currentDrill) { save(L.freshRun(localState(), currentDrill.id)); notice('Fresh practice started. This run has its own attempts.'); renderDrill(); element.querySelector('[data-learning-formula]').focus({preventScroll:true}); }
      if (action === 'solutions') showSolutions();
      if (action === 'copy') copyData();
    }
    function submit(event) {
      if (event.target.hasAttribute('data-learning-diagnostic')) { event.preventDefault(); submitDiagnostic(); }
      if (event.target.hasAttribute('data-learning-grade')) { event.preventDefault(); submitDrill(); }
    }
    function input(event) { if (event.target.matches('[data-learning-formula], [data-learning-result], [data-learning-diagnostic] input')) collectDrafts(); }
    function focusout() { if (deferredRender) root.setTimeout(function () { if (!destroyed && !busy) refreshRender(); }, 0); }
    element.addEventListener('click', click); element.addEventListener('submit', submit); element.addEventListener('input', input); element.addEventListener('change', input); element.addEventListener('focusout', focusout);
    refresh();
    return {refresh:refresh,collectDrafts:collectDrafts,destroy:function () { destroyed = true; refreshSequence++; element.removeEventListener('click', click); element.removeEventListener('submit', submit); element.removeEventListener('input', input); element.removeEventListener('change', input); element.removeEventListener('focusout', focusout); }};
  }
  return {mount:mount,parseResult:parseResult};
});
