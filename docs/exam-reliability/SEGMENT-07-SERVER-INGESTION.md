# Segment 07 — Idempotent server ingestion and finalization

## Outcome

Versioned exam evidence now uses `ingest_test_bank_operations_v1`. The RPC authenticates the JWT owner, validates the complete v1 envelope, serializes each session through a locked runtime row, checks the expected revision and writer epoch, inserts the existing immutable ledger event, and returns a durable receipt. A transaction either commits the whole operation batch or none of it.

The server independently validates the pinned catalog and grade through the Segment 05 trigger before a terminal result is accepted. The client marks versioned evidence cloud-accepted only after receiving one structurally complete receipt per operation. Connection success or a duplicate-ignore response is no longer sufficient.

## Invariants

- The key `(user_id, operation_id)` identifies one canonical operation payload.
- An identical retry returns the stored receipt without reapplying the event or advancing the session revision.
- Reusing an accepted operation ID with different canonical JSON fails with SQLSTATE `23505`.
- Versioned transitions are serialized by `SELECT ... FOR UPDATE` on `test_bank_session_runtime`.
- The first accepted terminal payload creates one legacy completion event, one immutable original result, and one terminal runtime state.
- A same-payload competing finalizer receives an alias receipt pointing to the existing canonical event; it creates no second event or result.
- A conflicting finalizer, stale revision, stale writer epoch, malformed envelope, unsupported schema, or foreign owner fails without partial evidence.
- Receipt and runtime tables are RLS-enabled, owner-readable, and not directly writable by browser roles.

## Compatibility boundary

Historical rows are not rewritten. The migration projects existing versioned sessions into runtime state without inventing receipts. Old clients may continue appending the deployed legacy enum while the release is coordinated; the strengthened triggers enforce immutable operation IDs and legal transitions for versioned sessions. Only the new receipt-bearing RPC qualifies as v1 `cloud_accepted` evidence.

Local drafts remain local under Segment 06. Active draft synchronization, takeover epochs, reset epochs, pause/resume/expiry operations, and multi-device writer transfer remain assigned to Segments 12–15. The current server writer epoch is deliberately zero until the takeover protocol is introduced.

## Deployment order

1. Confirm the Segment 05 catalog migration and seed are present.
2. Apply `20260908180000_add_idempotent_exam_ingestion.sql`.
3. Run the actual-role replay, conflict, ownership, malformed-input, and concurrent-finalization smoke checks.
4. Deploy the matching web revision.
5. Verify receipt creation and pending-outbox convergence with an authorized test account.

The schema-first order is backward compatible because the old append path remains during the transition. Do not deploy the new client before the RPC exists: versioned operations intentionally stay pending when the receipt endpoint is unavailable.

## Verification

- Node tests execute the shipped client against a strict fake RPC, prohibit versioned fallback to direct upsert, verify ordered revisions and receipts, and fail closed on incomplete receipt batches.
- PostgreSQL 17 tests apply every repository migration and catalog seed, execute as actual `authenticated`/`anon` roles, replay accepted batches, reject conflicting IDs and owners, and race two database sessions at the finalization boundary.
- The race acceptance condition is exactly one `session_completed` event and one `original` result, with the losing same-payload contender receiving a non-applied canonical alias receipt.
- Segment 01–06 and repository-wide tests remain cumulative gates.

No production migration, learner record, deployment, or merge is performed by this PR.
