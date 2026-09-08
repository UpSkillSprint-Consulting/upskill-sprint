# Segment 07 — production database deployment

## Outcome

The production Supabase project received the approved additive Segment 05
catalog prerequisite and Segment 07 idempotent-ingestion migration on
2026-09-08. The repository migration filenames now match the migration versions
recorded by production, preventing a later migration runner from treating the
already-applied DDL as pending.

| Production migration | Purpose |
|---|---|
| `20260908213852_add_exam_version_catalog` | Immutable question/config/bank catalog, pinned sessions and original results |
| `20260908214508_add_idempotent_exam_ingestion` | Runtime state, canonical receipts, guarded transitions and ingestion RPC |

The reviewed catalog seed was published between those migrations. It contains
five releases and 3,189 question revisions: CMQ/OE 166, CQE 933, CSSBB 1,024,
CSSGB 616 and MBB 450.

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

After rollback, production retained zero smoke users, events, sessions or
receipts. The pre-deployment 8,659 legacy learning events remained 8,659.

Post-deployment grants and objects were also checked independently:

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
evidence; do not drop tables or delete learner history. Any schema reversal
requires a separately reviewed forward-recovery migration after confirming no
versioned sessions or receipts depend on the new objects.
