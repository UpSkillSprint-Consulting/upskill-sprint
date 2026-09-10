# Exam reliability program

## Current execution boundary

Segments 01–19 are human-merged on `main`; Segment 19 was merged through PR #185 at `b48b205fc355942956b25220881c32d949ac1224`. Segment 20 is implemented for release-control review on `release/segment-20-production`, but production acceptance is intentionally blocked until its external evidence and production prerequisites pass.

The original program baseline remains `990e385350ae63d76cfc1e3940c3644859cc636a`. The cumulative program covers baseline/contracts/framework, identity/versioning, local/server durability, reconciliation, grading/metrics/history, lifecycle/timing, incremental synchronization, canonical session handoff, authoritative New-only allocation, UX/accessibility, security/reset/deletion, independent qualification, and now the fail-closed production release gate. Product rating does not increase merely because code or tests are committed.

## Records

- [Segment 20 production release](SEGMENT-20-PRODUCTION-RELEASE.md): database-first compatibility plan, hosted Auth requirement, production smoke/reconciliation, rollback/forward recovery, 24-hour observation, and exact 10/10 release gate.
- [Segment 20 production preflight](verification/v1/segment20-production-preflight.json): read-only production snapshot showing the current blockers; it is not a deployment approval.
- [Segment 19 qualification](SEGMENT-19-QUALIFICATION.md): all-certification/mode qualification, frozen workload enforcement, clean backup/restore, browser/handoff reruns, physical-device evidence boundary and real-network evidence boundary.
- [Segment 19 physical evidence](verification/v1/segment19-physical-evidence.json): must be completed from actual iPhone/iPad/laptop testing; emulation is rejected.
- [Segment 19 network evidence](verification/v1/segment19-network-evidence.json): must be completed from witnessed real-network measurements; synthetic latency is rejected.
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
- [Segment 07 server ingestion](SEGMENT-07-SERVER-INGESTION.md) and [production deployment record](SEGMENT-07-PRODUCTION-DEPLOYMENT.md).
- [Segment 06 local durability](SEGMENT-06-LOCAL-DURABILITY.md).
- [Segment 05 versions/catalog](SEGMENT-05-VERSIONS.md).
- [Segment 04 identity repair](SEGMENT-04-IDENTITY.md).
- [Segment 03 framework](SEGMENT-03-FRAMEWORK.md) and [frozen test profiles](verification/v1/profiles.json).
- [Segment 02 contract](contracts/v1/CONTRACT.md), [decisions](SEGMENT-02-DECISIONS.md), [report](SEGMENT-02-REPORT.md) and [dependency triage](SEGMENT-02-SECURITY-TRIAGE.md).
- [20-segment execution index](ROADMAP.md) and [Segment 01 defect register](DEFECT-REGISTER.md).

Historical reports retain the state and evidence of their original segment; this README, roadmap and current PR record hold the current execution boundary.

## Segment 20 reproduce and review

Use Node 22 and locked application dependencies:

```sh
npm ci
node --check scripts/exam-reliability/segment20-release.cjs
node --test --test-concurrency=1 tests/test-bank-segment19-qualification.test.js tests/test-bank-segment20-release.test.js
npm test
npm audit --omit=dev --audit-level=high
```

The dedicated **Exam production release - Segment 20** workflow runs the release-contract checks, complete repository regression, production dependency high/critical audit, and a fail-closed assertion that the committed preflight does not misrepresent pending production work as accepted.

The release evaluator composes the existing Segment 19 validator. It cannot bypass missing physical-device or real-network evidence. Once Segment 19 is qualified, it additionally requires exact Netlify release-commit parity, all canonical production migrations and critical schema capabilities, hosted Auth leaked-password protection, zero unresolved security release risk, authorized production smoke/reconciliation, recovery readiness, a clean 24-hour observation window, and all 20 frozen rubric criteria against one release commit.

## Current production preflight

At Segment 20 entry, Netlify production is ready and serves exact `main` commit `b48b205fc355942956b25220881c32d949ac1224`, while the connected Supabase project is healthy but missing seven already-human-merged repository migrations from Segments 13–18. Read-only capability checks confirm trusted clock, incremental sync, session handoff, New-only v2, and security reset are not yet present in production.

Supabase Auth leaked-password protection is also not verified enabled. Segment 19 physical-device and real-network evidence files remain pending. Production smoke/reconciliation and the observation window therefore have not started. These are release blockers, not documentation defects to be hidden or averaged away.

## Program controls

One segment is active at a time. Recheck source/deployment and open PRs before each step. Preserve accepted contracts and cumulative gates; do not reset learner evidence to make metrics agree, renumber questions, weaken tests, or attach unrelated refactors. Changes to a versioned contract/profile require explicit impact review.

A reviewer must not merge a red, cancelled, skipped or missing gate. Segment 20 code does not itself deploy the seven database migrations or alter hosted Auth configuration. Those production actions remain human-controlled and must preserve canonical migration history.

No 10/10 rating is awarded until the evaluator has evidence for all 100 rubric points and no blocker. Physical/emulated, preview/production, CI/real-network, and implementation/deployment states remain distinct throughout the release record.
