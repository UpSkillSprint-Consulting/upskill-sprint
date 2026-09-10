# Exam reliability program

## Current execution boundary

Segments 01–18 are human-merged on `main`; Segment 18 was merged through PR #184 at `f8e4c11741743fd83a73a4bf131b8dfa15940d40`. Segment 19 is implemented for qualification/review in PR #185 on `fix/segment-19-qualification`. Segment 20 has not started. Review, merge, production database deployment, frontend deployment, hosted Auth configuration, physical-device qualification and final production acceptance remain separate gates.

The original program baseline remains `990e385350ae63d76cfc1e3940c3644859cc636a`. The cumulative program now covers baseline/contracts/framework, identity/versioning, local/server durability, reconciliation, grading/metrics/history, lifecycle/timing, incremental synchronization, canonical session handoff, authoritative New-only allocation, UX/accessibility, security/reset/deletion, and the Segment 19 independent qualification candidate. Product rating does not increase merely because code or tests are committed.

## Records

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

## Segment 19 reproduce and review

Use Node 22 and locked application dependencies:

```sh
npm ci
node --check scripts/exam-reliability/segment19-qualification.cjs
node --check scripts/exam-reliability/run-segment19-load.cjs
node --test --test-concurrency=1 tests/test-bank-segment19-qualification.test.js
node scripts/exam-reliability/run-segment19-load.cjs
npm test
npm audit --omit=dev --audit-level=high
```

The dedicated **Exam qualification - Segment 19** workflow additionally provisions disposable PostgreSQL 17.6, applies the full repository migration chain, reruns cumulative authorization/concurrency suites, dumps with PostgreSQL 17 tools, restores into a separate clean database, verifies critical tables/RPCs/RLS, and executes Chromium desktop, Firefox desktop, WebKit phone-layout and WebKit tablet-layout browser qualification. Chromium desktop and WebKit phone-layout also rerun the canonical Segment 15 handoff acceptance.

The load runner enforces the frozen 10,000-event normal history, 100,000-event stress history, 1,000 pending operations, **1,000 completed sessions**, and two-device convergence floors. These are qualification workloads using synthetic owners and isolated services; they do not masquerade as production WAN evidence.

## Physical-device and network evidence

Segment 19 intentionally cannot be declared fully qualified from CI emulation alone. The physical-device validator requires actual iPhone Safari, iPad Safari, laptop Chrome and laptop Firefox records with exact hardware/OS/browser/time/observer provenance. `emulated:true` is rejected.

The real-network validator separately requires all frozen Segment 19 performance budgets to be populated from witnessed real-network measurements. It recomputes p95/maximum from the raw sample arrays using `profiles.json`, validates the expected network profile, requires the frozen minimum sample count, and rejects synthetic/emulated evidence. Localhost timings, CI network injection and mock transport are not accepted as real-network evidence.

Until both evidence sets pass, the release helper reports `pending_physical` or `pending_network`, never `qualified`. This is a deliberate release-control boundary, not an unfinished software defect.

## Program controls

One segment is active at a time. Recheck source/deployment and open PRs before each step. Preserve accepted contracts and cumulative gates; do not reset learner evidence to make metrics agree, renumber questions, weaken tests, or attach unrelated refactors. Changes to a versioned contract/profile require explicit impact review.

Before Segment 19 approval, verify the exact current PR head and every cumulative workflow that applies, including **Full test suite**, baseline/contracts/framework, identity/versioning, Segments 06–18 gates, and **Exam qualification - Segment 19 / Segment 19 automated qualification gate**. A reviewer must not merge a red, cancelled, skipped or missing gate.

No automatic merge, production migration, hosted-auth change, learner-data write, or final release rating is authorized by a passing PR. Segment 20 remains responsible for production rollout, exact live source/schema/configuration verification, authorized smoke/reconciliation, observation and final 10/10 evidence.
