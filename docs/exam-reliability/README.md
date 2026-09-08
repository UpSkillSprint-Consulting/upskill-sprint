# Exam reliability program

## Current execution boundary

Segments 01, 02 and 03 are implemented for joint human review in PR #172 on `audit/segment-01-baseline`. Ernest explicitly requested adding Segments 02 and 03 to that existing PR. None is represented as merged or deployed; Segments 04–20 have not started. Review/merge, deployment and physical/production acceptance are separate gates.

Application baseline: `990e385350ae63d76cfc1e3940c3644859cc636a`. These segments add baseline evidence, contracts and verification infrastructure. They do not change production application code, question content/IDs, learner history, application dependency pins or live database objects. Product rating does not increase merely for adding tests or documenting defects.

## Records

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

Before approval, verify the exact-head **Full test suite**, **Exam reliability baseline**, **Exam reliability contracts**, and **Exam reliability framework / Segment 03 cumulative gate**. The new aggregate rejects missing/failed lanes and mixed revisions. It reports CI status; this segment does not change administrative branch-protection rules. A reviewer must not merge a red/missing gate. Dependency advisories are not resolved by a green test job.

JSDOM, a mocked service and emulated mobile browsers are not physical-device, JWT/Data API or production-authorization acceptance. Actual PostgreSQL role tests exercise the repository DDL in a disposable database, not live-schema parity. Screenshots are evidence, not a complete visual/WCAG approval. The unresolved product findings remain open in their assigned segments.

Explicit stacking instructions supersede the earlier separate-merge sequence without claiming human approval or deployment. Segment 04 does not start automatically. No automatic merge, production writes or future release rating are authorized by a passing framework run.
