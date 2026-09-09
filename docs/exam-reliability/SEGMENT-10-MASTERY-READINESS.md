# Segment 10 — mastery, readiness, coverage, and review metrics

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
