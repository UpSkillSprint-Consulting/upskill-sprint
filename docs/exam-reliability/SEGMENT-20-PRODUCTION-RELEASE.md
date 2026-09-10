# Segment 20 — controlled production release, verification, observation, and final score

## Entry state

Segment 20 starts from exact human-merged `main` commit `b48b205fc355942956b25220881c32d949ac1224`, the merge of Segment 19 PR #185. Segments 01–19 remain authoritative and are not redefined by this release segment.

The current production frontend is already deployed from that exact commit, but the production database is behind the repository migration chain. The preflight snapshot in `verification/v1/segment20-production-preflight.json` records that mismatch without modifying learner data or pretending the release is complete.

Segment 20 is fail-closed. A green PR, a ready Netlify deploy, or a healthy Supabase project alone cannot produce a 10/10 rating. The release evaluator first requires Segment 19 physical-device and witnessed real-network evidence, then production schema/configuration parity, authorized smoke/reconciliation, recovery readiness, a clean observation window, and all 20 frozen rubric criteria against one exact release commit.

## Current production preflight

At the Segment 20 entry check:

- GitHub `main`: `b48b205fc355942956b25220881c32d949ac1224`.
- Netlify production deploy `6aa315ae4dbede0008122e10`: ready and serving the same commit.
- Supabase project: `ACTIVE_HEALTHY`, PostgreSQL 17.
- Production migration ledger: present through Segment 07 ingestion, but seven later repository migrations are missing.
- The trusted-clock, incremental-sync, session-handoff, New-only v2, and security-reset production capabilities are consequently absent.
- Supabase Auth leaked-password protection is reported disabled.
- Segment 19 physical-device evidence remains `pending_physical`.
- Segment 19 real-network evidence remains `pending_real_network`.

Therefore the release is **blocked at preflight**. No score is awarded while a frozen release blocker remains.

## Required database deployment order

The seven already-human-merged migrations must be deployed in repository order. Do not deploy the frontend ahead of them; in this case the frontend is already live, so restoring database compatibility is the first production action after release approval.

1. `20260909152000_add_exam_trusted_clock.sql`
2. `20260909195500_add_incremental_sync_cursors.sql`
3. `20260910010000_add_session_handoff_v1.sql`
4. `20260910030000_add_new_only_allocation_v2.sql`
5. `20260910050000_add_security_reset_v1.sql`
6. `20260910050100_preserve_legacy_reservation_compat.sql`
7. `20260910050200_harden_security_reset_concurrency.sql`

Use the canonical repository migration mechanism so production history retains the reviewed versions. Do not rename an already-published migration or use ad-hoc DDL that creates a second history for the same logical change. After each migration, verify its expected objects before proceeding. If a migration fails, stop; do not advance the client or mark later migrations complete.

### Compatibility checkpoints

After migration 1: authenticated trusted server-time RPC exists and anonymous execution remains denied.

After migration 2: server sequence counters/triggers and incremental learning/progress fetch RPCs exist; accepted learner history remains present and sequences are unique per owner/channel.

After migration 3: checkpoint table and save/fetch/takeover RPCs exist with owner isolation and original deadline preservation.

After migration 4: v2 New-only reservation tables/RPCs exist and permanent claim semantics remain intact.

After migrations 5–7: data-control generation, stale-device guards, deletion RPC, compatibility grants, and purge/event serialization exist. No destructive deletion smoke is run against a real learner account.

## Hosted Auth release configuration

Before security sign-off, enable and verify Supabase Auth leaked-password protection. This is a hosted Auth configuration and is not represented as a SQL migration. If the configured project/tooling cannot change it programmatically, a project administrator must enable it through the supported Supabase control surface and the release evidence must record the verified state.

The existing advisor notice for `test_bank_new_question_claims` with RLS/no direct policy is intentional only if direct learner table privileges remain revoked and the authoritative RPC path remains owner-bound. `SECURITY DEFINER` advisories are reviewed by function behavior; a warning is not cleared merely by changing its label. Any newly discovered callable function that accepts caller-controlled ownership is a release blocker.

Performance-advisor notices are not converted into last-minute schema changes solely to make an advisory count zero. Measure the frozen Segment 19 real-network budgets first. If an index/advisor becomes causally linked to a failed budget, fix it in a reviewed change and rerun the affected cumulative gates.

## Segment 19 completion prerequisite

Segment 20 cannot override Segment 19's evidence validator. Before production acceptance:

- physical iPhone Safari must pass;
- physical iPad Safari must pass, including touch and portrait/landscape;
- physical laptop Chrome and Firefox must pass;
- all frozen real-network performance budgets must have witnessed raw samples, required sample counts, exact recomputed p95/maximum, and correct network profiles.

WebKit emulation, localhost timing, synthetic latency, or mocked transport cannot be substituted for these records.

## Authorized production smoke and reconciliation

After schema/configuration compatibility is verified, run smoke checks using dedicated synthetic test identities only. Do not alter or inspect another learner's private evidence. The smoke must prove:

1. authenticated client transport reaches the production API;
2. trusted-clock calibration works and anonymous use is rejected;
3. incremental synchronization converges without page reload or evidence loss;
4. session checkpoint/takeover preserves pinned identity, order, state, and deadline;
5. New-only v2 allocation is owner/exam scoped and idempotent for the same planned session;
6. completed history reconciles first + repeat + unknown = answer interactions under the canonical projector;
7. a second authenticated synthetic owner cannot read or mutate the first owner's evidence.

Hard acceptance counts are zero for acknowledged evidence loss, duplicate canonical completion, cross-account exposure, and unexplained reconciliation.

Production smoke must be cleanup-safe. Cleanup may delete only explicitly created synthetic fixtures through supported owner-scoped mechanisms. It must never reset or rewrite real learner history to make counters match.

## Rollback and forward recovery

The release strategy treats additive database migrations as forward-compatible infrastructure. A frontend rollback must not drop accepted learner evidence, version archives, event receipts, checkpoints, reservations, security generations, or sync counters.

Before release acceptance, verify:

- a known-good frontend commit can be redeployed without destructive SQL rollback;
- the current production database backup/restore procedure has been successfully exercised or otherwise verified under the approved operations process;
- a forward-fix path exists for each migration stage;
- rollback does not re-enable a superseded insecure dependency path or bypass the server-side authorization model;
- operational ownership and escalation steps are documented.

If data integrity is in doubt, fail closed, preserve evidence, and stop new affected writes rather than deleting history.

## Observation window

A final release rating requires a clean **24-hour production observation window** after the compatible production release is active. The window begins only after the exact release commit, required database migrations, and hosted Auth configuration are verified.

Record periodic health checks covering application availability, authentication, error/exception signals, sync health, production database health, and the hard integrity invariants. Any confirmed in-scope incident resets the observation window after remediation and revalidation. Infrastructure events are not classified as application defects without reproduction, but unresolved ambiguity is not silently marked passed.

## Final 10/10 gate

`scripts/exam-reliability/segment20-release.cjs` composes the existing Segment 19 qualification helper with the frozen Segment 02 100-point rubric. It will return `qualified_10_of_10` only when all of the following are simultaneously true:

- Segment 19 automated, physical-device, and real-network evidence is qualified;
- production deploy commit exactly equals the scored release commit;
- Supabase is healthy and all required canonical migrations are present;
- trusted-clock, incremental-sync, handoff, New-only v2, and security-reset capabilities are live;
- leaked-password protection and production dependency audit are verified;
- unresolved production security release risks = 0;
- all seven production smoke checks pass;
- all four hard integrity counters remain zero;
- rollback, forward recovery, and backup/restore readiness are verified;
- the clean 24-hour observation window passes; and
- all 20 frozen rubric criteria have exact evidence against the same release commit, including AC17 in a physical-device environment and AC20 in production.

There is no partial credit. A blocked release has `rating: null`; it is never rounded up or described as 10/10.

## CI and human-control boundary

The `Exam production release - Segment 20` PR workflow validates the release evaluator, cumulative Segment 19 contract, complete repository tests, and production dependency audit. It does not receive production database credentials and does not mutate Supabase or Netlify.

This PR is the release-control implementation and review record. Human approval remains required before any production migration/configuration action. Because `main` currently auto-deploys through Netlify, merging a future application change must account for database-first compatibility. Segment 20 itself should not introduce unrelated product behavior changes.

## Exit criteria

Segment 20 is complete only after implementation **and** production acceptance. Until the pending physical/network evidence, seven production migrations, Auth configuration, production smoke, and 24-hour observation are completed, this segment remains open and the final rating remains unawarded.
