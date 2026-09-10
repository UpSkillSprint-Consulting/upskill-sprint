# Approved 20-segment plan — execution index

This is a repository continuation index of Ernest's approved v1.0 roadmap, not a replacement of its detailed acceptance criteria. Source document: `UpSkillSprint_20_Segment_Remediation_Roadmap.md`, 27,331 bytes, SHA-256 `1292ac605252d6697ed9794115cced05023f11e3558aa44214bb5685cb0173af`. The original planning snapshot remains a supplied project artifact; the current execution state is maintained in README and the segment reports.

Scope: all published certifications/sets; full, focused/custom, quick and adaptive modes; associated review, history, identity, metrics, timing, durable evidence, synchronization, security and accessibility. Preserve unrelated lessons and previously approved fixes. A 10/10 engineering release score requires evidence, not a promise of no future bugs or a validated ASQ pass predictor.

| Segment | Work and acceptance boundary | State |
|---|---|---|
| 01 — Baseline | Pin source/deployment/schema/inventory; inspect core timing/grading; reproduce concerns; assign every finding or explicit verification task. No product repair. | Human-merged in PR #172 |
| 02 — Contracts | Define answer/selection/save/grade/first/repeat/reservation/display/completion, scopes, blank handling, resets, timezones, thresholds, versions and offline conflicts. Approve hand-worked examples and release rubric. | Human-merged in PR #172; runtime adoption remains per segment |
| 03 — Verification framework | Preserve existing tests; add independent expected results, deterministic clocks, database/client-role and browser fixtures, failure injection and controlled concurrency. Freeze performance/device budgets and evidence requirements. | Human-merged in PR #172; cumulative gate retained |
| 04 — Identity | Validate every ID, namespace, domain and import; preserve identity under reordering/editing. Malformed imports must fail visibly, not remove valid questions silently. | Human-merged in PR #173; production verification pending |
| 05 — Versions/catalog | Pin content, bank, blueprint, grading, timing, length and site target to a session; verify official-source configuration; preserve retired aliases and original results. Add compatible ownership/validation constraints. | Human-merged; production schema and five-certification catalog published 2026-09-08 |
| 06 — Local durability | Harden the existing outbox; distinct draft and scored interactions; persist before acknowledging; handle storage/crash/offline/account ownership failures without invented attempts. | Human-merged in PR #174 |
| 07 — Server ingestion | Validate ownership and operation/version contracts; enforce idempotent replay and atomic finalization. Concurrent/lost-ack submissions must yield one canonical completion. | Human-merged in PR #174; production migration and rollback-only smoke verified 2026-09-08 |
| 08 — Reconciliation | Rebuild deterministic projections from ledger, completion, legacy baselines and reset epochs. Reconcile first/repeat/unique scope, retain unknown provenance, dry-run conversions, never reset evidence to align counters. | Human-merged in PR #174; no production evidence rewrite |
| 09 — Grading | One grading policy across results/history/review; exact counts and unrounded threshold comparisons; blanks and domain totals; historical pinned configuration; explicit site-target terminology. | Human-merged in PR #176 |
| 10 — Learning metrics | Distinguish accuracy, estimated mastery, raw/weighted coverage, readiness, due/mastered/notebook and reservation counts. Every number has a named formula, scope, denominator and evaluation timestamp. | Human-merged in PR #177 |
| 11 — Trends/history | Separate practice/full-exam trends; answer-date activity in a consistent reporting timezone; complete paginated history and scoped exports; unknown legacy dates/durations stay unknown. | Human-merged in PR #177 |
| 12 — Session lifecycle | Define valid state transitions and identity/version-based restoration of question/option order, position, answers, flags and policy. Preserve all supported modes. | Human-merged in PR #178 |
| 13 — Timing | Persist authoritative timing policy/deadline and clock recovery; handle background/reload/offline/expiry; separate active question visits from total exam time without double counting. | Human-merged in PR #179; production migration deployed and capability verified in Segment 20 |
| 14 — Incremental sync | Preserve existing incremental/reservation work; safe cursors/catch-up/retries/cancellation; meaningful pending/offline/synced-as-of/error states. No full-ledger Start-path regression or page-refresh sync. | Human-merged in PR #180; production migration deployed and capability verified in Segment 20 |
| 15 — Handoff | Canonical resumable session with explicit takeover/version ownership; preserve latest cloud-accepted state/deadline; reject stale writes and disclose unuploaded offline limitations. | Human-merged in PR #181; production migration deployed and capability verified in Segment 20 |
| 16 — New-only | Authoritative, concurrency-safe allocation across eligible exams/modes; explicit reserved/displayed/answered and abandonment policies; no silent Start hangs or readiness gains from reservation alone. | Human-merged in PR #182; v2 production allocation capability verified in Segment 20 |
| 17 — UX/accessibility | Consistent terms/order/scales and error states; manual plus automated responsive, keyboard, screen-reader and agreed WCAG 2.2 AA review; preserve approved visuals/themes/print. | Human-merged in PR #183 |
| 18 — Security/reset | Test actual client roles, grants/RLS/RPCs, cross-account/anonymous/token/stale-device behavior, deletion/reset/export, pending owner data and dependency reachability. No service-role success masquerading as authorization proof. | Human-merged in PR #184 at `f8e4c11741743fd83a73a4bf131b8dfa15940d40`; production migrations/capabilities verified in Segment 20, hosted Auth leaked-password protection still open |
| 19 — Qualification | All exams/modes, long histories, failures, concurrency, migration/recovery and frozen performance budgets; actual iPhone/iPad evidence distinct from browser emulation; no unresolved confirmed in-scope defects. | Human-merged in PR #185 at `b48b205fc355942956b25220881c32d949ac1224`; automated qualification retained, physical-device and real-network evidence still pending |
| 20 — Production release | Human-approved rollout/migrations/compatibility/recovery; exact live revisions, authorized smoke/reconciliation and observation window; score only verified production acceptance. Remain open if any gate fails. | Release-control implementation in PR #186; database compatibility rollout and restricted-role smoke complete; blocked by hosted Auth leaked-password protection, pending Segment 19 physical/network evidence, authenticated browser/full reconciliation smoke, recovery sign-off, and 24-hour observation |

## Program controls

One active segment; one versioned contract before dependent work; cumulative regression gates; explicit impact decision before any contract revision. Segment number does not override dependencies. Database additions must be backward-compatible, migration/recovery tested and human authorized. Security begins with each affected change, not only at Segment 18. Never classify an infrastructure failure as an application defect without reproduction.

Each segment report must contain baseline/head/PR, root cause, affected modules/exams/modes, exact changes, new and cumulative tests, migration/recovery implications, untested boundaries and review/merge/deployment status. No automatic merge. Future confirmation of a previously unverified risk adds a desired-behavior regression before repair.

## Frozen rubric v1 — Segment 02 review candidate

Metrics/scoring/interpretation 20; identity/versioning 10; lifecycle/timing 15; durable history/recovery 15; cross-device/offline/concurrency 15; UX/accessibility 10; security/performance/release operations 15; total 100.

Lost acknowledged evidence, duplicate canonical completion, cross-account access, unexplained reconciliations, missing required device/authorization evidence or unsupported pass-probability claims are release blockers, not weaknesses that can be averaged away. All 100 points must be evidenced before a 10/10 release rating.

Segment 02 was stacked on PR #172 by explicit user instruction; see [ADR-002-A](SEGMENT-02-DECISIONS.md). Its [normative contract](contracts/v1/CONTRACT.md), [48 worked examples](contracts/v1/worked-examples.json), and [20-criterion rubric](contracts/v1/release-rubric.json) remain the policy baseline.

Segment 03 was stacked on the same PR. Its [framework](SEGMENT-03-FRAMEWORK.md) preserves the earlier contracts and observations. The CI gate is not a physical-device, production-security, or final-release sign-off.

Segment 04 was a new PR from the human-merged prerequisites. See [identity repair](SEGMENT-04-IDENTITY.md). Later catalog/versioning and remaining release criteria remain cumulative.

Segment 05 was stacked on PR #173; see [versioning implementation and deployment boundaries](SEGMENT-05-VERSIONS.md).

Segment 07 was stacked on Segment 06 in merged PR #174. Its production schema deployment and rollback-only authenticated-role smoke are recorded in [the production deployment report](SEGMENT-07-PRODUCTION-DEPLOYMENT.md). Later live learner-flow observation, concurrent-connection qualification, takeover epochs and final production acceptance remain in Segments 15, 19 and 20.

Segment 08 was stacked on the same PR. See [deterministic history reconciliation](SEGMENT-08-RECONCILIATION.md). Its conversion tool is write-free; no production learner evidence is changed.

Segments 09–18 are human-merged. Segment 19 was human-merged through PR #185 and its automated CI qualification remains cumulative. See [Segment 19 qualification](SEGMENT-19-QUALIFICATION.md). Physical-device and witnessed real-network evidence are still required by its fail-closed validator.

Segment 20 starts from exact `main` commit `b48b205fc355942956b25220881c32d949ac1224`. See [Segment 20 production release](SEGMENT-20-PRODUCTION-RELEASE.md), the versioned [production preflight](verification/v1/segment20-production-preflight.json), and [production evidence](verification/v1/segment20-production-evidence.json). The seven reviewed Segment 13–18 migrations are deployed and the critical schema capabilities are live. The release evaluator still cannot issue a 10/10 rating until hosted Auth, authenticated production smoke/reconciliation, recovery, observation, physical-device, real-network, and all frozen rubric evidence pass against one exact release commit.
