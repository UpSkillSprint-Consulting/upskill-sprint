from pathlib import Path
import re

# Learning ledger: authenticated, owner-scoped pagination and complete JSON export.
p=Path('test-bank-learning-events.js'); s=p.read_text()
s=s.replace("occurredAt: Date.parse(row.occurred_at) || now(), payload: record(row.payload), syncedFor: [userId]","occurredAt: Date.parse(row.occurred_at) || now(), receivedAt: Date.parse(row.received_at) || null, payload: record(row.payload), syncedFor: [userId]",1)
anchor="""  function syncStatus(state, phase, userId, error) {
"""
assert anchor in s
insert="""  async function historyPage(input) {
    input = record(input);
    const user = activeUser();
    const auth = window.UpskillAuth;
    const client = auth && typeof auth.getClient === 'function' ? auth.getClient() : null;
    const requestedExamId = safeId(input.examId, '');
    const offset = Math.max(0, Number.isSafeInteger(Number(input.offset)) ? Number(input.offset) : 0);
    const limit = Math.max(1, Math.min(200, Number.isSafeInteger(Number(input.limit)) ? Number(input.limit) : 100));
    if (!user || !client) return { available:false, reason:'not-signed-in', events:[], offset:offset, limit:limit, nextOffset:null, complete:false };
    if (!online()) return { available:false, reason:'offline', events:[], offset:offset, limit:limit, nextOffset:null, complete:false };
    let query = client.from(TABLE).select('event_id,device_id,event_type,exam_id,session_id,question_id,occurred_at,received_at,payload').eq('user_id', user.id);
    if (requestedExamId) query = query.eq('exam_id', requestedExamId);
    query = query.order('received_at', {ascending:true}).order('event_id', {ascending:true});
    if (typeof query.range === 'function') query = query.range(offset, offset + limit - 1);
    else query = query.limit(limit);
    const result = await runRemoteRequest(query, 'Learning-history page');
    if (result && result.error) throw result.error;
    const rows = asArray(result && result.data), events = rows.map(function(row){ return eventFromRemoteRow(row, user.id); });
    return {
      available:true, reason:'ok', ownerId:user.id, examId:requestedExamId || null,
      offset:offset, limit:limit, events:events, complete:rows.length < limit,
      nextOffset:rows.length < limit ? null : offset + rows.length,
      scope:{population:'historical-all', ownerId:user.id, examId:requestedExamId || null, order:['receivedAt','eventId']}
    };
  }

  async function exportHistory(input) {
    input = record(input);
    const limit = 200, collected = [];
    let offset = 0, pageCount = 0, scope = null;
    while (true) {
      if (++pageCount > 1000) throw new Error('History export exceeded the bounded page limit');
      const page = await historyPage({examId:input.examId, offset:offset, limit:limit});
      if (!page.available) return Object.assign({}, page, {exportedAt:iso(now()), events:[]});
      scope = page.scope; collected.push.apply(collected, page.events);
      if (page.complete || page.nextOffset == null) break;
      offset = page.nextOffset;
    }
    return {
      available:true, schemaVersion:'1.0.0', exportedAt:iso(now()), scope:scope,
      pageSize:limit, pages:pageCount, eventCount:collected.length, events:collected,
      limitations:{legacyMissingDatesRemainUnknown:true, legacyMissingDurationsRemainUnknown:true, localCacheIsNotLifetimeBoundary:true}
    };
  }

"""
s=s.replace(anchor,insert+anchor,1)
s=s.replace("    eventsForExam: eventsForExam,\n    seenQuestionIds: seenQuestionIds,","    eventsForExam: eventsForExam,\n    historyPage: historyPage,\n    exportHistory: exportHistory,\n    seenQuestionIds: seenQuestionIds,",1)
p.write_text(s)

# Analytics: separate practice/full-exam trends; answer-time activity in a single pinned reporting timezone.
p=Path('test-bank-analytics-dashboard.js'); s=p.read_text()
s=s.replace("  function hardening() {\n    return window.__TBAdaptiveHardening || null;\n  }","  function hardening() {\n    return window.__TBAdaptiveHardening || null;\n  }\n\n  function historyPolicy() { return window.__TBHistoryPolicy || null; }",1)
marker="""  function studyHeatmap(weeks) {
"""
start=s.index(marker); end=s.index("  // Only completed, timed, published-length full-exam simulations belong in", start)
replacement="""  function reportingTimeZone() {
    const policy=historyPolicy();
    return policy && policy.pickReportingTimeZone ? policy.pickReportingTimeZone(attemptEntries(),'UTC') : 'UTC';
  }

  function practiceSessionTrend(limit) {
    const policy=historyPolicy();
    if (!policy || typeof policy.practiceTrend!=='function') return sessionTrend(limit).filter(function(row){return row.source!=='exam-attempt';});
    return policy.practiceTrend({attempts:attemptEntries(), examId:examId(), limit:limit || TREND_LIMIT, assessAttempt:window.__TBVersions.assessAttempt});
  }

  function studyActivity(weeks) {
    const policy=historyPolicy(), learning=window.__TBLearning;
    const zone=reportingTimeZone();
    if (!policy || typeof policy.answerActivity!=='function') return {timeZone:zone,days:[],knownAnswers:0,unknownAnswers:0,unknownSessions:0,complete:false};
    return policy.answerActivity({
      events:learning&&typeof learning.eventsForExam==='function'?learning.eventsForExam(examId()):[],
      attempts:attemptEntries(), timeZone:zone, weeks:weeks || HEATMAP_WEEKS, now:Date.now()
    });
  }

  function studyHeatmap(weeks) { return studyActivity(weeks).days; }

"""
s=s[:start]+replacement+s[end:]
s=s.replace("    const trend = sessionTrend(TREND_LIMIT);\n    const heat = studyHeatmap(HEATMAP_WEEKS);","    const trend = practiceSessionTrend(TREND_LIMIT);\n    const activity = studyActivity(HEATMAP_WEEKS);\n    const heat = activity.days;",1)
s=s.replace("'<div class=\"tb-an-label\">Accuracy across your last ' + trend.length + ' sessions</div>'","'<div class=\"tb-an-label\">Practice accuracy across your last ' + trend.length + ' practice sessions</div>'",1)
s=s.replace("(trend.length ? svgPolyline(trend.map(function (t) { return t.pct; }), 560, 140, 10) : '<p class=\"tb-an-empty\">No sessions yet — complete a quiz or adaptive session to start the trend line.</p>') +","(trend.length ? svgPolyline(trend.map(function (t) { return t.pct; }), 560, 140, 10) : '<p class=\"tb-an-empty\">No practice sessions yet — completed full exams are shown separately in Exam attempts.</p>') +",1)
s=s.replace("'<div class=\"tb-an-label\" style=\"margin-top:18px\">Study streak — last ' + HEATMAP_WEEKS + ' weeks</div>' +","'<div class=\"tb-an-label\" style=\"margin-top:18px\">Answer activity — last ' + HEATMAP_WEEKS + ' weeks</div><p class=\"tb-an-desc\">Reporting timezone: ' + esc(activity.timeZone) + '. Activity uses final answer-event dates, not session completion dates.' + (activity.unknownAnswers || activity.unknownSessions ? ' ' + activity.unknownAnswers + ' answer(s) and ' + activity.unknownSessions + ' legacy session(s) have insufficient date evidence and are not assigned to a day.' : '') + '</p>' +",1)
s=s.replace("Ranked by blueprint weight &times; readiness gap — where an hour of study moves your score the most.","Ranked by blueprint weight &times; readiness gap — a study-priority heuristic, not measured gain per hour.")
s=s.replace("    sessionTrend: sessionTrend,\n    studyHeatmap: studyHeatmap,","    sessionTrend: sessionTrend,\n    practiceSessionTrend: practiceSessionTrend,\n    studyActivity: studyActivity,\n    reportingTimeZone: reportingTimeZone,\n    studyHeatmap: studyHeatmap,",1)
p.write_text(s)

# Mastery panel: separate complete-history export from summary/PDF export.
p=Path('test-bank-adaptive-mastery-hardening.js'); s=p.read_text()
s=s.replace("<button type=\"button\" class=\"tb-ghost\" data-v2-export>Export learning data</button><button type=\"button\" class=\"tb-ghost danger\" data-v2-reset>","<button type=\"button\" class=\"tb-ghost\" data-v2-export>Export mastery report</button><button type=\"button\" class=\"tb-ghost\" data-v2-export-history>Export complete history</button><button type=\"button\" class=\"tb-ghost danger\" data-v2-reset>",1)
anchor="""  function resetData(button) {
"""
assert anchor in s
insert="""  function exportCompleteHistory() {
    const learning=window.__TBLearning;
    if(!learning || typeof learning.exportHistory!=='function') { announce('Complete history export is unavailable until secure learning storage loads.'); return; }
    announce('Preparing complete paginated history…');
    learning.exportHistory({examId:examId()}).then(function(payload){
      if(!payload || payload.available===false) throw new Error(payload && payload.reason || 'history unavailable');
      const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
      const link=document.createElement('a');link.href=URL.createObjectURL(blob);
      link.download='upskillsprint-'+examId()+'-complete-history-'+new Date().toISOString().slice(0,10)+'.json';
      document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(link.href);},0);
      announce('Complete history export prepared: '+payload.eventCount+' event'+(payload.eventCount===1?'':'s')+' across '+payload.pages+' page'+(payload.pages===1?'':'s')+'.');
    }).catch(function(error){announce('Complete history export failed: '+String(error&&error.message||error));});
  }

"""
s=s.replace(anchor,insert+anchor,1)
s=s.replace("    if (target.hasAttribute('data-v2-export')) { event.preventDefault(); event.stopImmediatePropagation(); exportData(); return; }","    if (target.hasAttribute('data-v2-export')) { event.preventDefault(); event.stopImmediatePropagation(); exportData(); return; }\n    if (target.hasAttribute('data-v2-export-history')) { event.preventDefault(); event.stopImmediatePropagation(); exportCompleteHistory(); return; }",1)
p.write_text(s)

# Inject history policy before analytics in both delivery paths.
for name in ['netlify/edge-functions/test-bank-set-controls.js','netlify/edge-functions/test-bank-mobile-picker.js']:
    p=Path(name); s=p.read_text()
    if name.endswith('set-controls.js'):
        needle='    \'<script src="/test-bank-adaptive-mastery-hardening.js" defer></script>\',\n    \'<script src="/test-bank-analytics-dashboard.js" defer></script>\','
        assert needle in s
        s=s.replace(needle,'    \'<script src="/test-bank-adaptive-mastery-hardening.js" defer></script>\',\n    \'<script src="/test-bank-history-policy.js" defer></script>\',\n    \'<script src="/test-bank-analytics-dashboard.js" defer></script>\',',1)
    else:
        needle="    '/test-bank-adaptive-mastery-hardening.js',\n    '/test-bank-analytics-dashboard.js',"
        assert needle in s
        s=s.replace(needle,"    '/test-bank-adaptive-mastery-hardening.js',\n    '/test-bank-history-policy.js',\n    '/test-bank-analytics-dashboard.js',",1)
    p.write_text(s)

Path('docs/exam-reliability/SEGMENT-11-TRENDS-HISTORY.md').write_text('''# Segment 11 — trends, reporting dates, complete history, and exports

Segment 11 separates practice trends from pinned full-exam trends, moves activity to answer-event dates, uses one explicit reporting timezone, and removes the 500-entry local projection as the lifetime-history/export boundary.

## Runtime rules
- The Trend tab is practice-only. Eligible completed timed full examinations remain in Exam attempts and are never mixed into the practice sparkline.
- Daily activity is derived from the final nonblank `answer_recorded` event for each session/question. A later revision replaces an earlier revision for that session/question. Session completion dates are not used as answer dates.
- The dashboard reporting timezone is the newest valid pinned `reportingTimeZoneAtStart`; otherwise it is explicitly UTC. Grouping and displayed heatmap calendar keys use that same timezone.
- Legacy answers without a reliable answer timestamp remain unknown and are disclosed; they are never assigned to the completion date. Missing duration remains unknown and is not synthesized here (timing repair remains Segment 13).
- `__TBLearning.historyPage()` reads the authenticated owner's ledger directly with deterministic `received_at,event_id` ordering and bounded pages. `exportHistory()` walks those pages so the local 500-attempt/cache limits are not represented as lifetime history.
- Complete-history export is a separate JSON action from the mastery PDF/report. Its envelope includes scope, owner/exam, page count, event count, ordering, timestamps and explicit legacy limitations.

## Preservation
No learner evidence is rewritten or deleted. No question IDs/content, grading policy, mastery coefficients, timing policy, database migration, dependency version, reset semantics or New-only reservation behavior changes. Segment 09 remains authoritative for historical full-exam eligibility; Segment 10 remains authoritative for mastery/readiness formulas.
''')
