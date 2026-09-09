# Segment 07 — production database deployment

## Outcome

The production Supabase project received the approved additive Segment 05
catalog prerequisite and Segment 07 idempotent-ingestion migration on
2026-09-08. PR #174 had already published the canonical repository migration
versions, so those committed versions are preserved:

| Canonical migration | Purpose |
|---|---|
| `20260908010000_add_exam_version_catalog` | Immutable question/config/bank catalog, pinned sessions and original results |
| `20260908180000_add_idempotent_exam_ingestion` | Runtime state, canonical receipts, guarded transitions and ingestion RPC |

The first authorized production application recorded transient migration ledger
versions `20260908213852` and `20260908214508`. During PR #175 review, those
ledger entries were repaired in place to the canonical versions above. The
repair changed migration metadata only: it did not execute the DDL again, alter
application tables, rewrite learner evidence, or rename the already-published
repository migrations. This keeps production aligned with environments that
already recorded the PR #174 versions and prevents divergent migration history.

The reviewed catalog seed was published between the schema applications. It
contains five releases and 3,189 question revisions: CMQ/OE 166, CQE 933,
CSSBB 1,024, CSSGB 616 and MBB 450.

## Production verification

The checked-in `scripts/exam-reliability/segment07-production-smoke.sql` uses
two synthetic authentication subjects inside one transaction, executes the
public RPC as the real `authenticated` Postgres role and always rolls back.
The production run verified:

- the first valid versioned start creates one event, runtime revision and receipt;
- replaying the exact operation returns the stored receipt without changing totals;
- conflicting operation-ID reuse is rejected;
- a foreign owner and unsupported schema are rejected;
- receipt/runtime RLS hides another owner's rows;
- browser roles cannot insert forged receipts directly.

Immediately after the rollback-only deployment smoke, production retained zero
smoke users, events, sessions or receipts and the pre-smoke 8,659 legacy
learning events were unchanged. Later legitimate site activity may increase the
normal learning-event, runtime and receipt counts; zero is not a steady-state
production invariant.

Post-deployment checks independently confirmed:

- the migration ledger records the canonical versions `20260908010000` and
  `20260908180000`, with no transient `20260908213852`/`20260908214508` entries;
- `authenticated` can execute `ingest_test_bank_operations_v1(jsonb)`;
- `anon` and `PUBLIC` cannot execute it;
- `authenticated` can owner-read receipts through RLS but has no direct INSERT;
- receipt and runtime tables have RLS enabled;
- production contains five catalog releases and 3,189 revisions.

## Advisor disposition and remaining boundaries

The Supabase security advisor reports the ingestion RPC because it is an
authenticated-callable `SECURITY DEFINER` function. This exposure is
intentional: the RPC is the controlled write boundary. Its `PUBLIC` and
`anon` grants are revoked, it requires `auth.uid()`, validates ownership and
the complete v1 envelope, and its private helper is not executable by browser
roles.

Other pre-existing advisor findings—leaked-password protection, reservation RPC
review, a claims table with no direct policies, and duplicate/index
recommendations—remain assigned to the broader security/performance work. This
deployment does not claim their closure.

This verification did not use or modify learner evidence. A rollback-only SQL
smoke cannot establish browser JWT transport, a real two-connection production
finalization race, active-device takeover or the Segment 20 observation window.
Those remain explicit Segments 15, 19 and 20 gates.

## Recovery

The schema is additive and the legacy append path remains compatible. If a
client rollback is required, retain the catalog, runtime, receipts and accepted
evidence; do not drop tables or delete learner history. Migration versions that
have been published and repaired to the canonical PR #174 ledger must remain
stable. Any schema reversal requires a separately reviewed forward-recovery
migration after confirming no versioned sessions or receipts depend on the new
objects.
