# Exam reliability program

## Current execution boundary

Segments 01–03 were human-merged through PR #172, Segments 04–05 through PR #173, and Segments 06–08 through PR #174. The Segment 05 catalog prerequisite and Segment 07 server-ingestion migration were deployed and rollback-smoke-verified on 2026-09-08. Later segments are not signed off. Review, merge, deployment and physical/production acceptance remain separate gates.

Application baseline: `990e385350ae63d76cfc1e3940c3644859cc636a`. Segments 01–03 add baseline evidence, contracts and verification infrastructure. Segment 04 changes identity validation/runtime guards but no question content/IDs, learner history, dependency pins or live database objects. Product rating does not increase merely for adding tests or documenting defects.

## Records

- [Segment 08 history reconciliation](SEGMENT-08-RECONCILIATION.md): canonical first/repeat/unknown projection, source-disagreement diagnostics, current-bank/date/reset scope, and a write-free deterministic dry run.

- [Segment 07 server ingestion](SEGMENT-07-SERVER-INGESTION.md): authenticated idempotent operation receipts, serialized session transitions and atomic finalization.
- [Segment 07 production deployment](SEGMENT-07-PRODUCTION-DEPLOYMENT.md): exact migration ledger, five-certification catalog counts, rollback-only role smoke and remaining production boundaries.

- [Segment 06 local durability](SEGMENT-06-LOCAL-DURABILITY.md): owner-scoped durable drafts, explicit scored submission, fail-closed storage recovery and no database-enum expansion.

- [WebKit full-review stability](WEBKIT-REVIEW-STABILITY.md): reproduced DOM/focus repair, same-document scan safeguards, independent process deadlines, and all-profile evidence acceptance on every PR. This follow-up does not include unfinished Segment 06 work.

- [Segment 05 versions/catalog](SEGMENT-05-VERSIONS.md): immutable releases, original results, official-format disclosures and mandatory schema/seed/client release order. The historical S04-B01/cancelled checks remain preserved; the stability follow-up defines the new full-run acceptance gate.

- [Segment 04 identity repair](SEGMENT-04-IDENTITY.md): atomic validation/imports, stable identity and the exact scope of G09 repair.

- [Segment 03 framework](SEGMENT-03-FRAMEWORK.md): cumulative runtime, mutation, database-role and browser gates, methodology and explicit boundaries.
- [Frozen test profiles](verification/v1/profiles.json): layouts, physical devices, networks, workloads, acceptance budgets and evidence retention.
- [Segment 02 contract](contracts/v1/CONTRACT.md), [decisions](SEGMENT-02-DECISIONS.md) and [report](SEGMENT-02-REPORT.md).
- [Dependency triage](SEGMENT-02-SECURITY-TRIAGE.md): installed/CDN reachability distinctions; R14 remains open.
- [Hand-worked examples](contracts/v1/worked-examples.json) and [release rubric](contracts/v1/release-rubric.json).
- [20-segment execution index](ROADMAP.md).
- [Segment 01 baseline](SEGMENT-01-BASELINE.md), [defect/verification register](DEFECT-REGISTER.md), [machine-readable baseline](segment-01-baseline.json), and [read-only schema query](segment-01-schema.sql).

Historical reports retain the status and evidence of their original segment; this README and the current PR verification record hold the current execution status.

## Reproduce and review

Use the existing Node 22 environment and locked dependencies:

```sh
npm ci
node --test --test-concurrency=1 tests/test-bank-segment01-*.test.js tests/test-bank-segment02-*.test.js tests/test-bank-segment03-*.test.js
node scripts/exam-reliability/run-mutations.cjs
node scripts/exam-reliability/run-node.cjs
npm test
```

The framework workflow provisions its own disposable PostgreSQL and pinned test-only browser tools. It has read-only repository permission and does not receive production learner credentials. See the Segment 03 document for guards and exact commands.

Segment 01 `OBSERVATION` rows record existing behavior, including known defects. They are not desired-behavior acceptance passes. Preservation tests protect sound behavior; Segment 02's independent examples define target policies; Segment 03 verifies real code paths and test sensitivity. Later repairs must add desired-behavior regressions and close the matching register entry with evidence. Never turn a known-bug observation into an assertion that the wrong behavior must remain wrong.

One segment is active at a time. Recheck source/deployment and open PRs before each step. Keep cumulative tests and accepted contracts; do not reset learner records, renumber questions, weaken tests or attach unrelated refactors. Changes to a contract/profile require an explicit version/impact review and revalidation of dependent gates.

Before approval, verify the exact-head **Full test suite**, **Exam reliability baseline**, **Exam reliability contracts**, and **Exam reliability framework / Segment 03 cumulative gate**, and **Exam question identity**, **Exam version catalog**, and **MBB complete student acceptance**. The new aggregate rejects missing/failed lanes and mixed revisions. It reports CI status; this segment does not change administrative branch-protection rules. A reviewer must not merge a red/missing gate. Dependency advisories are not resolved by a green test job.

JSDOM, a mocked service and emulated mobile browsers are not physical-device, JWT/Data API or production-authorization acceptance. Actual PostgreSQL role tests exercise the repository DDL in a disposable database, not live-schema parity. Screenshots are evidence, not a complete visual/WCAG approval. The unresolved product findings remain open in their assigned segments.

Explicit stacking instructions supersede the earlier separate-merge sequence without claiming human approval or deployment. Segment 04 was explicitly authorized as a new PR; Segment 05 was explicitly requested on this PR; stacking is not acceptance of the open Segment 04 blocker. No automatic merge, production writes or future release rating are authorized by a passing framework run.

The [Linux WebKit renderer repair](WEBKIT-RENDERER-REPAIR.md) documents the CPU audit policy, remaining deferred-focus race correction and engine-only reuse. Its final acceptance requires complete exact-head runs; the earlier watchdogs alone were not proof of a native stall fix.

## Segment 09 review

[Canonical grading implementation and verification scope](SEGMENT-09-GRADING.md) extends the merged Segments 01–08 without modifying their contracts or production migration records. Exact new-PR status and CI evidence are recorded in that PR; no automatic merge or Segment 10 work follows.
