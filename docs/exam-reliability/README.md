# Exam reliability program

## Current execution boundary

Segments 01–17 are human-merged on `main`. Segment 18 starts from exact merged Segment 17 commit `545315d79b18305137bea22612fc7bfe4f8bb388` and is implemented for review in PR #184 on `fix/segment-18-security-reset`. Segments 19–20 have not started. Review, merge, database deployment, frontend deployment, hosted Auth configuration, physical-device qualification and final production acceptance remain separate gates.

The original program baseline remains `990e385350ae63d76cfc1e3940c3644859cc636a`. The cumulative program now covers baseline/contracts/framework, identity/versioning, local/server durability, reconciliation, grading/metrics/history, lifecycle/timing, incremental synchronization, canonical session handoff, authoritative New-only allocation, UX/accessibility, and the Segment 18 security/data-control candidate. Product rating does not increase merely because code or tests are committed.

## Records

- [Segment 18 security/reset](SEGMENT-18-SECURITY-RESET.md): owner-scoped deletion generation, stale-device resurrection guards, export hardening, actual restricted-role database tests, dependency reachability and production-configuration boundaries.
- [Segment 17 UX/accessibility](SEGMENT-17-UX-ACCESSIBILITY.md): terminology, responsive/keyboard/screen-reader and WCAG-oriented acceptance while preserving prior exam behavior.
- [Segment 16 New-only allocation](SEGMENT-16-NEW-ONLY-ALLOCATION.md): authoritative v2 reservation/allocation behavior and concurrency controls.
- [Segment 15 canonical session handoff](SEGMENT-15-SESSION-HANDOFF.md): owner-scoped cloud checkpoints, explicit writer takeover, preserved deadline/version state and stale-writer rejection.
- [Segment 14 incremental synchronization](SEGMENT-14-INCREMENTAL-SYNC.md): server sequence cursors, safe catch-up, cancellation, bounded retry and truthful combined status.
- [Segment 13 authoritative timing](SEGMENT-13-AUTHORITATIVE-TIMING.md): persisted timing policy/deadline, trusted clock recovery, background/reload/offline handling and active-time accounting.
- [Segment 12 session lifecycle](SEGMENT-12-SESSION-LIFECYCLE.md): valid state transitions and identity/version-based restoration.
- [Segment 11 trends/history](SEGMENT-11-TRENDS-HISTORY.md): historical trend, timezone and complete-history behavior.
- [Segment 10 mastery/readiness](SEGMENT-10-MASTERY-READINESS.md): accuracy, mastery, readiness and coverage semantics.
- [Segment 09 grading](SEGMENT-09-GRADING.md): canonical grading, exact counts and unrounded threshold policy.
- [Segment 08 history reconciliation](SEGMENT-08-RECONCILIATION.md): canonical first/repeat/unknown projection and write-free reconciliation.
- [Segment 07 server ingestion](SEGMENT-07-SERVER-INGESTION.md): authenticated idempotent operation receipts and atomic finalization.
- [Segment 07 production deployment](SEGMENT-07-PRODUCTION-DEPLOYMENT.md): historical deployment record and remaining production boundaries.
- [Segment 06 local durability](SEGMENT-06-LOCAL-DURABILITY.md): owner-scoped durable drafts and fail-closed local persistence.
- [Segment 05 versions/catalog](SEGMENT-05-VERSIONS.md): immutable releases, original results and schema/seed/client rollout order.
- [Segment 04 identity repair](SEGMENT-04-IDENTITY.md): atomic validation/imports and stable identity.
- [Segment 03 framework](SEGMENT-03-FRAMEWORK.md): cumulative runtime, mutation, database-role and browser gates.
- [Frozen test profiles](verification/v1/profiles.json): layouts, physical devices, networks, workloads, budgets and evidence retention.
- [Segment 02 contract](contracts/v1/CONTRACT.md), [decisions](SEGMENT-02-DECISIONS.md), [report](SEGMENT-02-REPORT.md) and [dependency triage](SEGMENT-02-SECURITY-TRIAGE.md).
- [20-segment execution index](ROADMAP.md) and [Segment 01 defect register](DEFECT-REGISTER.md).

Historical reports retain the state and evidence of their original segment; this README, roadmap and current PR record hold the current execution boundary.

## Segment 18 reproduce and review

Use Node 22 and locked application dependencies:

```sh
npm ci
node --check test-bank-security-reset.js
node --check scripts/exam-reliability/run-segment18-database.cjs
node --test --test-concurrency=1 \
  tests/test-bank-segment18-security-reset.test.js \
  tests/test-bank-segment17-ux-accessibility.test.js \
  tests/test-bank-segment16-new-only-allocation.test.js \
  tests/test-bank-segment15-session-handoff.test.js \
  tests/test-bank-segment14-incremental-sync.test.js \
  tests/test-bank-segment13-timing.test.js \
  tests/test-bank-segment12-session-lifecycle.test.js \
  tests/test-bank-segment11-trends-history.test.js \
  tests/test-bank-segment10-mastery-readiness.test.js \
  tests/test-bank-segment09-grading.test.js
npm test
npm audit --omit=dev --audit-level=high
```

The dedicated **Exam security and data controls** workflow also provisions disposable PostgreSQL 17.6, applies every repository migration through Segment 18, reruns the preserved Segment 03 database gate, then executes focused Segment 18 owner/RLS/RPC/deletion/stale-device checks. The test database is loopback-only and contains synthetic owners; no production learner credentials or records are used.

Segment 18 adds a full learning-history deletion path. It is deliberately distinct from the existing per-exam adaptive study reset: a reset changes the learner's current study view while retaining immutable lifetime evidence; full deletion removes the signed-in owner's persisted exam-learning evidence and leaves only a generation tombstone required to stop stale offline devices from resurrecting deleted data. Local state is cleared only after the server acknowledges the generation advance.

The current product's Segment 16 UI continues to use `reserve_test_bank_new_questions_v2`. Legacy reservation functions remain temporarily callable because the preserved Segment 03 compatibility gate exercises them; their authenticated `auth.uid()` owner boundary is tested rather than weakening prior coverage. Segment 18 does not redefine New-only allocation semantics.

The reachable student mastery-export path is intercepted before the legacy document handler and uses jsPDF 4.2.1, with JSON fallback if the patched PDF runtime cannot load. The CI security job separately blocks high/critical **production** dependency advisories and retains the complete audit output for review; a green application test does not by itself close dependency risk.

## Production and security boundaries

At Segment 18 implementation entry, the connected Supabase project was healthy but its migration ledger was behind the repository's later reliability migrations. This PR does **not** deploy migrations or modify real learner history. Production database-first rollout and exact live-schema verification remain separately authorized work.

The connected Supabase security advisor also reported leaked-password protection disabled in hosted Auth. That is a project configuration item rather than a repository SQL migration, so this PR documents it instead of claiming it was changed. Final security sign-off requires that setting and actual client/JWT/Data API behavior to be verified in the deployed environment.

JSDOM, disposable PostgreSQL roles and browser emulation are not physical iPhone/iPad, real JWT/PostgREST, or final production authorization acceptance. Screenshots and automated accessibility checks are evidence, not complete human/assistive-technology qualification. Those remaining boundaries belong to Segments 19–20.

## Program controls

One segment is active at a time. Recheck source/deployment and open PRs before each step. Preserve accepted contracts and cumulative gates; do not reset learner evidence to make metrics agree, renumber questions, weaken tests, or attach unrelated refactors. Changes to a versioned contract/profile require explicit impact review.

Before Segment 18 approval, verify the exact current PR head and every cumulative workflow that applies, including **Full test suite**, baseline/contracts/framework, identity/versioning, Segments 06–17 gates, and **Exam security and data controls / Segment 18 acceptance gate**. A reviewer must not merge a red, cancelled, skipped or missing gate.

No automatic merge, production migration, hosted-auth change, learner-data write, or future release rating is authorized by a passing PR. Segment 19 does not start automatically.