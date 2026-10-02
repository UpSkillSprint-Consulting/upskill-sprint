(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ExcelSprintDashboard = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function escape(value) { return String(value === undefined ? '' : value).replace(/[&<>"']/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]; }); }
  function minutes(milliseconds) { return Math.max(0, Math.round((milliseconds || 0) / 60000)) + ' min'; }
  function dayStamp(value) {
    var date = new Date(value === undefined ? Date.now() : value);
    if (!Number.isFinite(date.getTime())) throw new Error('Choose a valid study date.');
    // Regina stays at UTC minus six hours throughout the year.
    return new Date(date.getTime() - 21600000).toISOString().slice(0, 10);
  }
  function streak(days, now) {
    var unique = new Set(days || []);
    var date = new Date(dayStamp(now) + 'T12:00:00Z');
    function day(value) { return value.toISOString().slice(0, 10); }
    if (!unique.has(day(date))) date.setUTCDate(date.getUTCDate() - 1);
    var count = 0;
    while (unique.has(day(date))) { count++; date.setUTCDate(date.getUTCDate() - 1); }
    return count;
  }
  function trend(records) {
    if (!records.length) return '<p class="sprint-muted">Your first-attempt trend appears after your first graded submission.</p>';
    var width = Math.max(360, records.length * 64 + 60);
    var points = records.map(function (item, index) { return (46 + index * ((width - 78) / Math.max(1, records.length - 1))) + ',' + (150 - item.record.firstAttemptScore * 1.15); });
    return '<div class="sprint-chart-scroll"><svg viewBox="0 0 ' + width + ' 190" role="img" aria-labelledby="sprint-trend-title sprint-trend-desc"><title id="sprint-trend-title">First-attempt score trend</title><desc id="sprint-trend-desc">Scores from zero to one hundred. Exact values are available in the table below.</desc>' +
      [0, 50, 100].map(function (score) { var y = 150 - score * 1.15; return '<line class="sprint-gridline" x1="40" y1="' + y + '" x2="' + (width - 15) + '" y2="' + y + '"></line><text x="30" y="' + (y + 4) + '" text-anchor="end">' + score + '</text>'; }).join('') +
      '<polyline class="sprint-trend-line" points="' + points.join(' ') + '"></polyline>' + records.map(function (item, index) { var coords = points[index].split(','); return '<circle class="sprint-trend-dot" cx="' + coords[0] + '" cy="' + coords[1] + '" r="4"></circle><text x="' + coords[0] + '" y="177" text-anchor="middle">' + escape(item.id) + '</text>'; }).join('') + '</svg></div>';
  }
  function render(state, completions, catalog) {
    var solved = new Set(completions.map(function (item) { return item.packageId; }));
    var entries = catalog.levels.flatMap(function (level) { return level.packages.map(function (pkg) { return { id: pkg.id, pkg: pkg, record: state.packages[pkg.id] }; }); });
    var coreSolved = completions.filter(function (item) { return /^L/.test(item.packageId); }).length;
    var expertSolved = completions.length - coreSolved;
    entries = entries.concat((catalog.expert && catalog.expert.packages || []).map(function (pkg) { return {id:pkg.id,pkg:pkg,record:state.packages[pkg.id]}; }));
    var scored = entries.filter(function (item) { return item.record && Number.isFinite(item.record.firstAttemptScore); });
    var time = entries.reduce(function (total, item) { return total + (item.record && item.record.timeMs || 0); }, 0);
    var attempts = entries.reduce(function (total, item) { return total + Object.values(item.record && item.record.tasks || {}).reduce(function (value, task) { return value + task.attempts; }, 0); }, 0);
    var weak = scored.filter(function (item) { return item.record.firstAttemptScore < 70; });
    var formulaNames = Object.keys(state.formulas).sort();
    return '<div class="sprint-dashboard-head"><div><p class="sprint-eyebrow">Your learning record</p><h3>Progress dashboard</h3></div><span class="sprint-status">Saved on this browser</span></div>' +
      '<div class="sprint-stats"><div><strong>' + coreSolved + '<small> / 50</small></strong><span>Core assignments verified</span></div><div><strong>' + expertSolved + '<small> / 3</small></strong><span>Expert capstones verified</span></div><div><strong>' + formulaNames.length + '</strong><span>Formulas learned</span></div><div><strong>' + minutes(time) + '</strong><span>Active study time · ' + streak(state.activityDays) + '-day streak</span></div></div>' +
      '<h4>First-attempt scores</h4><p class="sprint-muted">The score reflects how many required tasks you got right on their first submission. It becomes final when the assignment is complete.</p>' + trend(scored) +
      (scored.length ? '<div class="sprint-table-scroll"><table><caption class="sprint-sr-only">Assignment scores and study time</caption><thead><tr><th scope="col">Assignment</th><th scope="col">First attempt</th><th scope="col">Latest score</th><th scope="col">Study time</th><th scope="col">Status</th></tr></thead><tbody>' + scored.map(function (item) { return '<tr><th scope="row"><button type="button" class="sprint-link-button" data-sprint-open="' + escape(item.id) + '">' + escape(item.id) + '</button></th><td>' + item.record.firstAttemptScore + '%</td><td>' + item.record.score + '%</td><td>' + minutes(item.record.timeMs) + '</td><td>' + (solved.has(item.id) ? 'Solved' : 'In progress') + '</td></tr>'; }).join('') + '</tbody></table></div>' : '') +
      '<details class="sprint-attempts"><summary>Attempts per task (' + attempts + ' total)</summary>' + (attempts ? '<div class="sprint-table-scroll"><table><thead><tr><th scope="col">Assignment</th><th scope="col">Task</th><th scope="col">Attempts</th><th scope="col">Result</th></tr></thead><tbody>' + entries.flatMap(function (item) { return Object.entries(item.record && item.record.tasks || {}).filter(function (entry) { return entry[1].attempts > 0; }).map(function (entry) { return '<tr><th scope="row">' + escape(item.id) + '</th><td>' + escape(entry[0] === 'bonus' ? 'Bonus' : 'Task ' + entry[0].slice(1)) + '</td><td>' + entry[1].attempts + '</td><td>' + (entry[1].correct ? 'Correct' : 'Revisit') + '</td></tr>'; }); }).join('') + '</tbody></table></div>' : '<p>No graded attempts yet.</p>') + '</details>' +
      '<div class="sprint-dashboard-columns"><div><h4>Areas to revisit</h4>' + (weak.length ? '<ul class="sprint-review-list">' + weak.map(function (item) { return '<li><button type="button" class="sprint-link-button" data-sprint-open="' + escape(item.id) + '">' + escape(item.id + ' · ' + item.pkg.title) + '</button><span class="sprint-muted">' + escape(item.pkg.formulas.join(', ')) + '</span></li>'; }).join('') + '</ul>' : '<p class="sprint-muted">Assignments scoring below 70% on first attempts will appear here.</p>') + '</div><div><h4>Formulas learned</h4><label for="sprint-formula-search">Search your formula library</label><input type="search" id="sprint-formula-search" placeholder="For example, SUMIFS" autocomplete="off"><ul class="sprint-formula-list">' + formulaNames.map(function (name) { var entry = state.formulas[name]; return '<li data-sprint-formula="' + escape(name.toLowerCase()) + '"><button type="button" class="sprint-link-button" data-sprint-open="' + escape(entry.packageId) + '">' + escape(name) + '</button><span>' + escape(entry.packageId) + ' · ' + escape(dayStamp(entry.learnedAt)) + '</span></li>'; }).join('') + '</ul><p id="sprint-formula-empty" class="sprint-muted"' + (formulaNames.length ? ' hidden' : '') + '>No matching learned formulas yet.</p></div></div>' +
      (state.badges.length ? '<div class="sprint-badges" aria-label="Milestones">' + state.badges.map(function (badge) { return '<span class="sprint-status sprint-status-good">' + escape(badge) + '</span>'; }).join('') + '</div>' : '');
  }
  return { escape: escape, minutes: minutes, dayStamp: dayStamp, streak: streak, render: render };
});
