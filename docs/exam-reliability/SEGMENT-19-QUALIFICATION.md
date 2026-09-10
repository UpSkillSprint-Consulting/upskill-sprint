# Segment 19 — independent qualification, load, recovery, and device evidence

## Entry state

Segment 19 starts from `main` commit `f8e4c11741743fd83a73a4bf131b8dfa15940d40`, the human merge of Segment 18 PR #184. Segments 01–18 are prerequisites and remain authoritative for metrics, identity/versioning, durability, reconciliation, grading/history, lifecycle/timing, incremental synchronization, handoff, New-only allocation, accessibility, security, deletion/reset, and dependency controls.

This segment does not redefine those contracts. It qualifies them under cumulative load, recovery, multi-browser, and migration scenarios and introduces a hard distinction between automated browser emulation and physical-device evidence.

## Qualification layers

### Automated CI qualification

The dedicated `Exam qualification - Segment 19` workflow runs on every PR and contains four fail-closed layers:

1. **Node + workload:** complete repository tests, focused Segments 12–18 regressions, Segment 19 qualification-contract tests, production dependency audit, 10,000-event normal history, 100,000-event stress history, and 1,000 pending operations.
2. **Database + recovery:** fresh PostgreSQL 17.6 install, all repository migrations, preserved Segment 03/14/15/16/18 authorization/concurrency suites, then a binary `pg_dump` / clean-database `pg_restore` recovery and post-restore presence checks for the critical ledger, progress, handoff, deletion-control tables and RPCs.
3. **Browser matrix:** Chromium desktop, Firefox desktop, WebKit phone layout, and WebKit tablet layout. Each executes the preserved real-page Segment 03 browser qualification across CSSBB, CQE, MBB, CSSGB and CMQ/OE; Chromium desktop and WebKit phone also rerun the canonical Segment 15 two-context handoff acceptance.
4. **Aggregate gate:** any failed, cancelled, skipped, or incomplete required job blocks the Segment 19 automated gate.

The workflow intentionally reuses earlier accepted tests rather than creating parallel grading, sync, timing, handoff, security, or New-only implementations.

## Frozen workloads and budgets

Segment 19 consumes the unchanged Segment 03 `verification/v1/profiles.json` contract. It does not raise or remove a failed limit to make qualification pass. The frozen workloads remain:

- 10,000 normal remote events;
- 100,000 stress remote events;
- 1,000 pending operations;
- 1,000 completed sessions;
- two concurrent devices;
- all five certification families; and
- full exam, quick, focus, diagnostic, practice, adaptive, and review modes.

The qualification helper rejects a report that omits any required certification, mode, budget, workload floor, zero-loss/zero-duplicate/zero-cross-account invariant, history reconciliation invariant, migration/recovery status, or contains a confirmed unresolved in-scope defect.

Frozen performance budget evaluation uses the existing nearest-rank p95 rule and minimum-sample counts. The Segment 19 helper makes those budgets mandatory in final qualification evidence; inadequate samples are an error, not a pass.

## Physical-device evidence boundary

Physical evidence is required for final Segment 19 qualification and remains deliberately separate from CI emulation. The evidence validator requires distinct records for:

- iPhone Safari;
- iPad Safari;
- laptop Chrome; and
- laptop Firefox.

Every record must state an exact physical device, OS, browser, execution time, observer, and passing status. `physical:false` or `emulated:true` is rejected. A successful WebKit phone/tablet CI job therefore cannot be relabelled as an iPhone/iPad test.

Until those witnessed/device-capable records exist, the release helper reports `pending_physical`, not `qualified`. This is intentional and prevents Segment 20 from awarding a 10/10 score using emulation alone.

## Recovery and migration acceptance

The database job first applies every repository migration to a disposable database and reruns the cumulative restricted-role/concurrency controls. It then creates a binary backup, restores it into a separate clean database, and verifies the restored critical schema surface. No production database is modified.

This verifies that the repository migration chain produces a recoverable database image. It does not claim production backup policy, point-in-time recovery, live Supabase configuration parity, or deployment success; those remain Segment 20 production-release requirements.

## Security and privacy

The qualification workflow uses synthetic owners and disposable infrastructure. It does not contain learner credentials, service-role tokens, production JWTs, or real learner evidence. The Segment 18 production-dependency high/critical audit remains cumulative.

Live JWT/PostgREST/Data API behavior and hosted Supabase Auth configuration must be verified against the deployed environment before final production sign-off. Segment 19 does not weaken that Segment 18 boundary.

## Acceptance definition

Segment 19 implementation is reviewable when:

- the new qualification helper and tests pass;
- the complete repository regression remains green;
- normal/stress/pending workload checks pass at the frozen floors;
- the disposable fresh-install and backup/restore chain passes;
- all four browser profiles pass the five-certification real-page matrix;
- representative desktop and phone-layout handoff passes;
- the production dependency gate remains green; and
- no prior accepted contract/test is removed or weakened.

**Segment 19 itself is not fully qualified until the required physical-device evidence and frozen real-network performance evidence are supplied and pass.** That distinction is recorded in code so it cannot be erased by wording in a PR description.

## Segment 20 boundary

Segment 20 remains the only production-release segment. It owns human-approved deployment sequencing, production migrations/configuration, exact live source/schema verification, authorized production smoke/reconciliation, observation-window evidence, rollback/forward-recovery readiness, and the final 10/10 score.

No automatic merge, production migration, learner-data mutation, hosted-auth change, or release-score increase is authorized by Segment 19 CI.
