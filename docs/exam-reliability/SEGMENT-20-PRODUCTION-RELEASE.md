# Segment 20 — controlled production release, verification, observation, and final score

## Entry state

Segment 20 starts from exact human-merged `main` commit `b48b205fc355942956b25220881c32d949ac1224`, the merge of Segment 19 PR #185. Segments 01–19 remain authoritative and are not redefined by this release segment.

At Segment 20 entry, the production frontend already served that exact commit while the production database was seven reviewed migrations behind the repository release chain. The database compatibility rollout has since been completed in repository order, and the current preflight/evidence snapshots record the live state without rewriting learner evidence.

Segment 20 remains fail-closed. A green PR, a ready Netlify deploy, a completed migration rollout, or a healthy Supabase project alone cannot produce a 10/10 rating. The release evaluator requires Segment 19 physical-device and witnessed real-network evidence, exact production schema/configuration parity, authorized browser/JWT smoke and reconciliation, recovery readiness, a clean observation window, and all 20 frozen rubric criteria against one exact release commit.

## Current production preflight

Current verified state:

- GitHub `main`: `b48b205fc355942956b25220881c32d949ac1224`.
- Netlify production deploy `6aa315ae4dbede0008122e10`: ready and serving that same commit.
- Supabase project: `ACTIVE_HEALTHY`, PostgreSQL 17.
- All seven reviewed Segment 13–18 release migrations are present in production under their canonical repository versions.
- Trusted clock, incremental sync, session handoff, New-only v2, and security reset are live.
- A rollback-only restricted-`authenticated`-role smoke passed for trusted clock, incremental learning/progress retrieval, handoff/New-only retrieval, data-control access, and cross-account isolation; no synthetic learner writes were persisted.
- The complete production migration history is preserved, including the accepted pre-Segment-07 historical entries and the Segment 07 canonical catalog/ingestion entries.
- Security-advisor RLS/no-policy findings were reviewed and the flagged tables expose no direct `anon` or `authenticated` CRUD privileges.
- The 11 authenticated `SECURITY DEFINER` findings were reviewed as intentional owner-bound RPC boundaries; the private ingestion helper explicitly rejects caller-controlled ownership not equal to `auth.uid()`.
- Supabase Auth leaked-password protection remains disabled.
- Segment 19 physical-device evidence remains `pending_physical`.
- Segment 19 real-network evidence remains `pending_real_network`.
- Authenticated browser/JWT write/finalization and full production reconciliation smoke remain pending.
- Recovery sign-off and the clean 24-hour production observation window remain pending.

Therefore production compatibility is no longer blocked by migration drift, but **final production acceptance remains blocked**. No score is awarded while any frozen release blocker remains.

## Completed database deployment record

The seven already-human-merged migrations were deployed in repository order:

1. `20260909152000_add_exam_trusted_clock.sql`
2. `20260909195500_add_incremental_sync_cursors.sql`
3. `20260910010000_add_session_handoff_v1.sql`
4. `20260910030000_add_new_only_allocation_v2.sql`
5. `20260910050000_add_security_reset_v1.sql`
6. `20260910050100_preserve_legacy_reservation_compat.sql`
7. `20260910050200_harden_security_reset_concurrency.sql`

Supabase initially assigned deployment-time migration IDs during application. Those migration-history entries were normalized to the canonical reviewed repository versions without rerunning DDL, altering application tables, or rewriting learner records. The live ledger now retains the complete accepted historical production sequence and all required release versions.

### Verified compatibility checkpoints

After migration 1: authenticated trusted server-time RPC exists and anonymous execution remains denied.

After migration 2: server sequence counters/triggers and incremental learning/progress fetch RPCs exist; accepted learner history remains present and sequence ownership is enforced.

After migration 3: checkpoint table and save/fetch/takeover RPCs exist with owner isolation and original deadline preservation.

After migration 4: v2 New-only reservation tables/RPCs exist and permanent claim semantics remain intact.

After migrations 5–7: data-control generation, stale-device guards, deletion RPC, compatibility grants, and purge/event serialization exist. No destructive deletion smoke was run against a real learner account.

The restricted-role rollback-only production smoke verified the non-destructive portions of these boundaries. It does not substitute for the required browser/JWT write/finalization and reconciliation smoke.

## Hosted Auth release configuration

Before security sign-off, Supabase Auth leaked-password protection must be enabled and verified. This is a hosted Auth configuration and is not represented as a SQL migration. The connected Supabase tooling used for this release can inspect the resulting advisor state but does not expose a safe Auth-config mutation action, so the setting must be changed through a supported Supabase administration surface and then independently rechecked.

The current advisor review distinguishes intentional RPC exposure from unresolved security risk. The RLS/no-policy tables have no direct browser CRUD grants; the authenticated `SECURITY DEFINER` functions use `auth.uid()`-bound ownership or delegate to the private ingestion helper that explicitly checks `owner == auth.uid()`. Any newly discovered callable function that accepts caller-controlled ownership without an equivalent authorization check is a release blocker.

Performance-advisor notices are not converted into last-minute schema changes solely to make an advisory count zero. Measure the frozen Segment 19 real-network budgets first. If an index/advisor becomes causally linked to a failed budget, fix it in a reviewed change and rerun the affected cumulative gates.

## Segment 19 completion prerequisite

Segment 20 cannot override Segment 19's evidence validator. Before production acceptance:

- physical iPhone Safari must pass;
- physical iPad Safari must pass, including touch and portrait/landscape;
- physical laptop Chrome and Firefox must pass;
- all frozen real-network performance budgets must have witnessed raw samples, required sample counts, exact recomputed p95/maximum, and correct network profiles.

WebKit emulation, localhost timing, synthetic latency, or mocked transport cannot be substituted for these records.

## Authorized production smoke and reconciliation

Schema compatibility has passed, so the remaining full smoke must use dedicated synthetic test identities through the actual authenticated client/JWT path. Do not alter or inspect another learner's private evidence. The smoke must prove:

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

A final release rating requires a clean **24-hour production observation window** after the exact release prerequisites are verified. The release evaluator requires timestamps for production deployment, database verification, and security verification; `observation.startedAt` cannot precede the latest of those prerequisites, and `observation.endedAt` cannot be in the future.

Record periodic health checks covering application availability, authentication, error/exception signals, sync health, production database health, and the hard integrity invariants. Any confirmed in-scope incident resets the observation window after remediation and revalidation. Infrastructure events are not classified as application defects without reproduction, but unresolved ambiguity is not silently marked passed.

## Final 10/10 gate

`scripts/exam-reliability/segment20-release.cjs` composes the existing Segment 19 qualification helper with the frozen Segment 02 100-point rubric. It returns `qualified_10_of_10` only when all of the following are simultaneously true:

- Segment 19 automated, physical-device, and real-network evidence is qualified;
- production deploy commit exactly equals the scored release commit;
- Supabase is healthy, every required release migration is present, and no unreviewed migration drift is accepted;
- trusted-clock, incremental-sync, handoff, New-only v2, and security-reset capabilities are live;
- leaked-password protection and production dependency audit are verified;
- unresolved production security release risks = 0;
- the production smoke contains exactly one passing record for each of the seven required smoke paths and no contradictory duplicate records;
- all four hard integrity counters remain zero;
- rollback, forward recovery, and backup/restore readiness are verified;
- the clean 24-hour observation window is anchored to verified release prerequisites and passes; and
- all 20 frozen rubric criteria have unique exact evidence against the same release commit, including AC17 in a physical-device environment and AC20 in production.

There is no partial credit. A blocked release has `rating: null`; it is never rounded up or described as 10/10.

## CI and human-control boundary

The `Exam production release - Segment 20` PR workflow validates the release evaluator, cumulative Segment 19 contract, complete repository tests, production dependency audit, and truthfulness of the versioned current preflight. It does not receive production database credentials and does not mutate Supabase or Netlify.

The production database migration rollout is already complete and recorded. Remaining hosted Auth configuration, physical/network evidence, authenticated browser/JWT production smoke, recovery acceptance, and final observation remain separately controlled release actions. Segment 20 does not introduce unrelated product behavior changes.

## Exit criteria

Segment 20 is complete only after implementation **and** production acceptance. The schema/migration compatibility stage is complete. Until leaked-password protection, Segment 19 physical/network evidence, authenticated browser/full reconciliation smoke, recovery readiness, the clean 24-hour observation window, and all exact rubric evidence are complete, this segment remains open and the final rating remains unawarded.
