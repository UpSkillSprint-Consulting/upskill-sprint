from pathlib import Path

p=Path('test-bank-adaptive-mastery-hardening.js')
s=p.read_text()
old="""  function effectiveMastery(state, timestamp) {
    if (!state || !state.attempts) return 0;
"""
assert old in s
new="""  function effectiveMastery(state, timestamp) {
    const policy = window.__TBMetricPolicy;
    if (policy && typeof policy.effectiveMastery === 'function') return policy.effectiveMastery(state, timestamp);
    /* Compatibility fallback for isolated legacy fixtures. Production loads
       the versioned Segment 10 policy before this module. */
    if (!state || !state.attempts) return 0;
"""
s=s.replace(old,new,1)
old="""  function masterySummary(data, timestamp) {
    const questions = allQuestions();
"""
assert old in s
new="""  function masterySummary(data, timestamp) {
    const questions = allQuestions();
    const policy = window.__TBMetricPolicy;
    if (policy && typeof policy.summarize === 'function') {
      return policy.summarize({
        questions: questions,
        bok: (exam() && exam().bok) || [],
        timestamp: timestamp,
        stateFor: function (question) { return stateFor(question, data); }
      });
    }
"""
s=s.replace(old,new,1)
s=s.replace('<span>answered-pool coverage</span>','<span>blueprint-weighted question coverage</span>')
s=s.replace('Readiness discounts high scores based on a small evidence sample. Questions merely delivered are tracked separately and do not raise readiness. Effective mastery also decays as retrieval becomes stale.','Readiness is a blueprint-weighted coverage × mastery study heuristic, not a pass probability. Reserved, delivered or displayed questions are tracked separately and cannot raise question coverage or readiness. Effective mastery decays as retrieval becomes stale.')
s=s.replace("['Answered-pool coverage', summary.coverage + '% (' + summary.attempted + ' of ' + summary.total + ' questions)']","['Blueprint-weighted question coverage', summary.coverage + '% (raw: ' + (summary.rawCoverage == null ? 'Unavailable' : summary.rawCoverage.toFixed(1) + '%') + ')']")
s=s.replace("doc.text('Readiness discounts high scores based on a small answered evidence sample.', MARGIN_X, y);","doc.text('Readiness is a blueprint-weighted coverage × mastery study heuristic, not a pass probability.', MARGIN_X, y);")
s=s.replace("doc.text('Questions merely delivered do not raise readiness; mastery also decays as retrieval becomes stale.', MARGIN_X, y);","doc.text('Reserved, delivered or displayed questions do not raise coverage/readiness; mastery decays with age.', MARGIN_X, y);")
s=s.replace("downloadJSONFallback({ exportedAt: new Date(timestamp).toISOString(), examId: examId(), mastery: data });","downloadJSONFallback({ exportedAt: new Date(timestamp).toISOString(), examId: examId(), formulaVersion: summary.policyVersion || null, metrics: summary.metrics || null, summary: summary, mastery: data });")
p.write_text(s)

p=Path('netlify/edge-functions/test-bank-set-controls.js')
s=p.read_text()
needle='    \'<script src="/test-bank-adaptive-mastery-runtime.js" defer></script>\',\n    \'<script src="/test-bank-adaptive-mastery-hardening.js" defer></script>\','
assert needle in s
s=s.replace(needle,'    \'<script src="/test-bank-adaptive-mastery-runtime.js" defer></script>\',\n    \'<script src="/test-bank-metrics-policy.js" defer></script>\',\n    \'<script src="/test-bank-adaptive-mastery-hardening.js" defer></script>\',',1)
p.write_text(s)

p=Path('netlify/edge-functions/test-bank-mobile-picker.js')
s=p.read_text()
needle="    '/test-bank-adaptive-mastery-runtime.js',\n    '/test-bank-adaptive-mastery-hardening.js',"
assert needle in s
s=s.replace(needle,"    '/test-bank-adaptive-mastery-runtime.js',\n    '/test-bank-metrics-policy.js',\n    '/test-bank-adaptive-mastery-hardening.js',",1)
p.write_text(s)

Path('docs/exam-reliability/SEGMENT-10-MASTERY-READINESS.md').write_text('''# Segment 10 — mastery, readiness, coverage, and review metrics

## Scope
Segment 10 adopts contract C06 in runtime without changing the retained mastery coefficients or any Segment 01–09 identity, grading, durability, reconciliation, or server-ingestion contract. The canonical policy is `test-bank-metrics-policy.js`, versioned as `baseline-confidence-v1` under metric contract `1.0.0`.

## Implemented behavior
- Raw question coverage and blueprint-weighted question coverage are separate metrics with explicit denominators.
- Readiness is `sum(w_d * K_d * M_d)` over blueprint domains. Unattempted domains contribute zero. It is not attempted mastery × overall coverage and is not a pass probability.
- Attempted mastery is blueprint-weighted across domains that have answered evidence.
- The retained mastery formula and thresholds are unchanged: accuracy 0.58, streak 0.24, recency 0.18, confidence multiplier 0.62/0.38; mastered means at least three accepted nonblank responses and mastery >=80.
- Missing/future answer timestamps make mastery-derived metrics unavailable instead of inventing age. Unknown due dates are not automatically due.
- Positive-weight domains without a valid pool, missing mappings, duplicate subtopic IDs, and invalid/zero-total blueprint weights fail closed rather than silently switching to equal weights.
- Reserved, delivered, displayed, answered, mastered, review, and notebook-mistake counts remain distinct evidence classes. Reservation/open/display cannot raise answered-question coverage or readiness.
- Study priority is explicitly the contract heuristic `w_d * (100 - domain readiness)` with blueprint-order tie breaking. It is not measured gain per study hour.
- Metric envelopes expose metric ID, contract/formula version, exact value, numerator/denominator where meaningful, evaluation timestamp, completeness, and unknown-evidence count.
- UI/PDF wording identifies blueprint-weighted coverage and states that readiness is a study heuristic, not a pass probability. JSON fallback export includes formula version and metric envelopes.

## Preservation
No question IDs/content, scoring targets, historical grades, migration files, database schema, accepted learner evidence, reset semantics, dependencies, or timing policy are changed. Segment 09 remains authoritative for score and target decisions.

## Acceptance coverage
Dedicated Segment 10 tests cover unequal blueprint weights, unattempted domains, blanks, repeated responses, aging, unknown/future timestamps, unknown due dates, current-bank denominator changes, invalid metadata, metric traceability, separate evidence counts, and deterministic study-priority semantics. Existing full-suite and deploy-preview checks remain required.
''')

Path('.github/workflows/exam-mastery-readiness.yml').write_text('''name: Exam mastery and readiness
on:
  pull_request:
  workflow_dispatch:
permissions:
  contents: read
concurrency:
  group: exam-mastery-readiness-${{ github.ref }}
  cancel-in-progress: true
jobs:
  segment-10:
    runs-on: ubuntu-latest
    timeout-minutes: 12
    steps:
      - uses: actions/checkout@v4
        with: {persist-credentials: false}
      - uses: actions/setup-node@v4
        with: {node-version-file: '.node-version', cache: npm}
      - run: npm ci
      - name: Run Segment 10 and preserved metric regressions
        run: |
          node --test --test-concurrency=2 tests/test-bank-segment10-mastery-readiness.test.js tests/test-bank-adaptive-mastery.test.js tests/test-bank-analytics-dashboard.test.js tests/test-bank-segment09-grading.test.js
          node scripts/exam-reliability/build-catalog.cjs --check
''')
