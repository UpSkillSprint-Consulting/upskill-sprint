from pathlib import Path

p=Path('tests/test-bank-analytics-dashboard.test.js')
s=p.read_text()

needle="""const hardening = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery-hardening.js'), 'utf8');
const analytics = fs.readFileSync(path.join(ROOT, 'test-bank-analytics-dashboard.js'), 'utf8');
"""
assert needle in s
s=s.replace(needle,"""const hardening = fs.readFileSync(path.join(ROOT, 'test-bank-adaptive-mastery-hardening.js'), 'utf8');
const historyPolicy = fs.readFileSync(path.join(ROOT, 'test-bank-history-policy.js'), 'utf8');
const analytics = fs.readFileSync(path.join(ROOT, 'test-bank-analytics-dashboard.js'), 'utf8');
""",1)
needle="""  dom.window.eval(mastery);
  dom.window.eval(hardening);
  dom.window.eval(analytics);
"""
assert needle in s
s=s.replace(needle,"""  dom.window.eval(mastery);
  dom.window.eval(hardening);
  dom.window.eval(historyPolicy);
  dom.window.eval(analytics);
""",1)

old="""test('sessionTrend and studyHeatmap read real attempt history, not fabricated data', async () => {
  const { window } = await load();
  const day = 86400000;
  /* Keep fixture activity safely in the page's trailing window even if the
     host and jsdom realms straddle midnight while this test is running. */
  const now = Date.now() - 3 * day;
  const attempts = [
    { id: 'a1', at: now - 2 * day, source: 'adaptive-practice', total: 10, correct: 6, newQuestions: 3, repeated: 7 },
    { id: 'a2', at: now - day, source: 'quiz', total: 8, correct: 8, newQuestions: 8, repeated: 0 },
    { id: 'a3', at: now, source: 'exam-attempt', total: 20, correct: 15, newQuestions: 5, repeated: 15 }
  ];
  writeStore(window, { questions: {}, attempts: attempts, sessions: [] });

  const trend = window.__TBAnalyticsDashboard.sessionTrend(10);
  assert.equal(trend.length, 3);
  assert.equal(trend[0].pct, 60);
  assert.equal(trend[2].pct, 75);
  assert.equal(trend[2].source, 'exam-attempt');

  /* Two weeks avoids a UTC-midnight boundary between the host test process and
     the page realm while still exercising the trailing activity window. */
  const heat = window.__TBAnalyticsDashboard.studyHeatmap(2);
  assert.equal(heat.length, 14);
  const totalCounted = heat.reduce((sum, d) => sum + d.count, 0);
  assert.equal(totalCounted, 10 + 8 + 20, 'every attempted question across sources is represented in the streak heatmap');
});
"""
assert old in s
new="""test('session trend preserves stored history while answer activity never fabricates dates from completion timestamps', async () => {
  const { window } = await load();
  const day = 86400000;
  const now = Date.now() - 3 * day;
  const attempts = [
    { id: 'a1', at: now - 2 * day, source: 'adaptive-practice', total: 10, answered: 10, correct: 6, newQuestions: 3, repeated: 7 },
    { id: 'a2', at: now - day, source: 'quiz', total: 8, answered: 8, correct: 8, newQuestions: 8, repeated: 0 },
    { id: 'a3', at: now, source: 'exam-attempt', mode: 'exam', total: 20, answered: 20, correct: 15, newQuestions: 5, repeated: 15 }
  ];
  writeStore(window, { questions: {}, attempts: attempts, sessions: [] });
  window.__TBLearning = { eventsForExam: () => [] };

  const trend = window.__TBAnalyticsDashboard.sessionTrend(10);
  assert.equal(trend.length, 3, 'raw historical session projection remains available for compatibility');
  assert.equal(trend[0].pct, 60);
  assert.equal(trend[2].pct, 75);
  assert.equal(trend[2].source, 'exam-attempt');
  const practice = window.__TBAnalyticsDashboard.practiceSessionTrend(10);
  assert.deepEqual(Array.from(practice, row => row.id), ['a1', 'a2'], 'exam-authored sessions never enter the practice cohort');

  const activity = window.__TBAnalyticsDashboard.studyActivity(2);
  assert.equal(activity.days.length, 14);
  assert.equal(activity.days.reduce((sum, d) => sum + d.count, 0), 0, 'completion timestamps are not substituted for missing answer dates');
  assert.equal(activity.unknownAnswers, 38, 'known answer counts with missing answer-time evidence remain explicitly unknown');
  assert.equal(activity.complete, false);
});
"""
s=s.replace(old,new,1)

old="""test('studyHeatmap counts submitted answers rather than planned blanks in an attempt', async () => {
  const { window } = await load();
  const at = Date.now() - 3 * 86400000;
  writeStore(window, {
    questions: {},
    attempts: [{ id: 'partial-session', at: at, source: 'exam-attempt', total: 10, answered: 2, correct: 1 }],
    sessions: []
  });

  const day = window.__TBAnalyticsDashboard.studyHeatmap(2).find(entry => entry.count > 0);
  assert.ok(day, 'the recent attempt day is represented in the rolling grid');
  assert.equal(day.count, 2, 'eight unanswered planned items are not presented as study activity');
});
"""
assert old in s
new="""test('studyHeatmap counts final submitted answer events rather than planned blanks or completion time', async () => {
  const { window } = await load();
  const at = Date.now() - 3 * 86400000;
  writeStore(window, {
    questions: {},
    attempts: [{ id: 'partial-session', at: at + 3600000, source: 'exam-attempt', mode: 'exam', total: 10, answered: 2, correct: 1 }],
    sessions: []
  });
  window.__TBLearning = { eventsForExam: () => [
    { id: 'answer-1', type: 'answer_recorded', sessionId: 'partial-session', questionId: 'q1', occurredAt: at, payload: { status: 'correct' } },
    { id: 'answer-2', type: 'answer_recorded', sessionId: 'partial-session', questionId: 'q2', occurredAt: at + 1000, payload: { status: 'incorrect' } }
  ] };

  const activity = window.__TBAnalyticsDashboard.studyActivity(2);
  const day = activity.days.find(entry => entry.count > 0);
  assert.ok(day, 'the answer-event day is represented in the rolling grid');
  assert.equal(day.count, 2, 'eight unanswered planned items are not presented as study activity');
  assert.equal(activity.unknownAnswers, 0);
  assert.equal(activity.complete, true);
});
"""
s=s.replace(old,new,1)
p.write_text(s)
