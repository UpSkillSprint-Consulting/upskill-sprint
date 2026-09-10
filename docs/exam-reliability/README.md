# Exam reliability program

## Current execution boundary

Segments 01–13 are present on `main` at Segment 14 entry commit `c41e7b95f3b4abc5df3ceb8977de9b48f70fb618`; Segment 13 was merged through PR #179. Segment 14 is implemented for review on `fix/segment-14-incremental-sync` and must be reviewed, merged, migrated and production-verified separately. Segments 15–20 have not started. Review, merge, database deployment, frontend deployment and physical/production acceptance remain separate gates.

The original program baseline remains `990e385350ae63d76cfc1e3940c3644859cc636a`. The cumulative program now includes baseline/contracts/framework, identity/versioning, local/server durability, reconciliation, grading/metrics/history, lifecycle/timing, and the Segment 14 incremental-sync candidate. Product rating does not increase merely because code or tests are committed.

## Records

- [Segment 14 incremental synchronization](SEGMENT-14-INCREMENTAL-SYNC.md): transaction-serialized server sequence cursors, safe catch-up, cancellation, bounded retry, idle-device catch-up, truthful combined status, rollout/recovery and remaining boundaries.
- [Segment 13 authoritative timing](SEGMENT-13-AUTHORITATIVE-TIMING.md): persisted timing policy/deadline, trusted clock recovery, background/reload/offline handling, active-time accounting and Segment 15 takeover boundary.
- [Segment 08 history reconciliation](SEGMENT-08-RECONCILIATION.md): canonical first/repeat/unknown projection, source-disagreement diagnostics, current-bank/date/reset scope, and a write-free deterministic dry run.
- [Segment 07 server ingestion](SEGMENT-07-SERVER-INGESTION.md): authenticated idempotent operation receipts, serialized session transitions and atomic finalization.
- [Segment 07 production deployment](SEGMENT-07-PRODUCTION-DEPLOYMENT.md): exact migration ledger, five-certification catalog counts, rollback-only role smoke and remaining production boundaries.
- [Segment 06 local durability](SEGMENT-06-LOCAL-DURABILITY.md): owner-scoped durable drafts, explicit scored submission, fail-closed storage recovery and no database-enum expansion.
- [WebKit full-review stability](WEBKIT-REVIEW-STABILITY.md): reproduced DOM/focus repair, same-document scan safeguards, independent process deadlines, and all-profile evidence acceptance on every PR.
- [Segment 05 versions/catalog](SEGMENT-05-VERSIONS.md): immutable releases, original results, official-format disclosures and mandatory schema/seed/client release order.
- [Segment 04 identity repair](SEGMENT-04-IDENTITY.md): atomic validation/imports, stable identity and the exact scope of G09 repair.
- [Segment 03 framework](SEGMENT-03-FRAMEWORK.md): cumulative runtime, mutation, database-role and browser gates, methodology and explicit boundaries.
- [Frozen test profiles](verification/v1/profiles.json): layouts, physical devices, networks, workloads, acceptance budgets and evidence retention.
- [Segment 02 contract](contracts/v1/CONTRACT.md), [decisions](SEGMENT-02-DECISIONS.md) and [report](SEGMENT-02-REPORT.md).
- [Dependency triage](SEGMENT-02-SECURITY-TRIAGE.md): installed/CDN reachability distinctions; R14 remains open.
- [Hand-worked examples](contracts/v1/worked-examples.json) and [release rubric](contracts/v1/release-rubric.json).
- [20-segment execution index](ROADMAP.md).
- [Segment 01 baseline](SEGMENT-01-BASELINE.md), [defect/verification register](DEFECT-REGISTER.md), [machine-readable baseline](segment-01-baseline.json), and [read-only schema query](segment-01-schema.sql).

Historical reports retain the status and evidence of their original segment; this README, roadmap and the current PR verification record hold the current execution status.

## Reproduce and review

Use the existing Node 22 environment and locked dependencies:

```sh
npm ci
node --test --test-concurrency=1 \
  tests/test-bank-segment14-incremental-sync.test.js \
  tests/test-bank-segment14-sync-policy.test.js \
  tests/test-bank-account-sync.test.js \
  tests/test-bank-learning-events.test.js \
  tests/test-bank-segment03-runtime.test.js \
  tests/test-bank-segment13-timing.test.js
node scripts/exam-reliability/run-mutations.cjs
node scripts/exam-reliability/run-node.cjs
npm test
```

The cumulative framework provisions disposable PostgreSQL and pinned test-only browser tools. Segment 14's dedicated `Exam incremental sync` workflow also applies the complete repository schema to disposable PostgreSQL 17.6 before its server-sequence/concurrency checks, then runs Chromium desktop and WebKit phone-layout browser flows. No production learner credentials are required or used by these CI fixtures.

Segment 01 `OBSERVATION` rows record existing behavior, including known defects. They are not desired-behavior acceptance passes. Preservation tests protect sound behavior; Segment 02's independent examples define target policies; Segment 03 verifies real code paths and test sensitivity. Later repairs must add desired-behavior regressions and close the matching register entry with evidence. Never turn a known-bug observation into an assertion that the wrong behavior must remain wrong.

One segment is active at a time. Recheck source/deployment and open PRs before each step. Keep cumulative tests and accepted contracts; do not reset learner records, renumber questions, weaken tests or attach unrelated refactors. Changes to a contract/profile require an explicit version/impact review and revalidation of dependent gates.

Before Segment 14 approval, verify the exact-head **Full test suite**, **Exam reliability baseline**, **Exam reliability contracts**, **Exam reliability framework / Segment 03 cumulative gate**, **Exam question identity**, **Exam version catalog**, all cumulative Segment 06–13 gates that run on the PR, and the new **Exam incremental sync / Segment 14 acceptance gate**. A reviewer must not merge a red or missing required evidence run. Dependency advisories are not resolved by a green test job.

JSDOM, a mocked service and emulated mobile browsers are not physical-device, JWT/Data API or production-authorization acceptance. Actual PostgreSQL role tests exercise repository DDL in a disposable database, not live-schema parity. Screenshots are evidence, not a complete visual/WCAG approval. The unresolved product findings remain open in their assigned segments.

No automatic merge, production migration, learner-data write or future release rating is authorized by a passing PR. For Segment 14 specifically, the database migration must be deployed and verified **before** the frontend/edge policy that enables `server-sequence-v1`. The additive sequence schema may remain in place if the frontend is rolled back.

## Segment 09 review

[Canonical grading implementation and verification scope](SEGMENT-09-GRADING.md) extends the merged Segments 01–08 without modifying their contracts or production migration records.

## Segment 14 review

[Incremental synchronization and convergence](SEGMENT-14-INCREMENTAL-SYNC.md) starts from the exact merged Segment 13 `main` state. It does not implement active-session takeover, change New-only allocation semantics, alter question identity/content, reset learner evidence, or weaken authoritative timing. Segment 15 does not start automatically after this PR.
