# Segment 16 — Authoritative New-only Allocation

## Objective

Segment 16 closes the New-only allocation gap without changing the learner evidence, grading, timing, synchronization, or handoff contracts established in Segments 01–15.

The server is the authority for whether a canonical question ID can be allocated to an owner/exam. A browser-side eligibility calculation is never treated as an allocation. Reservation, delivery, actual display, and answered learning remain distinct lifecycle states.

## Frozen compatibility rules

- Lifetime exclusion is preserved. Once an owner/exam question ID is reserved, delivered, displayed, or answered, it remains excluded from future New-only allocation.
- Abandonment does not release a permanent New-only claim. There is no automatic reservation expiry or recycling policy in v2.
- A valid interrupted Start retries the same `planned_session_id` and receives the same reservation; it is not a fresh allocation.
- Allocation failure, timeout, authentication loss, account switching, malformed responses, and pool exhaustion all fail closed with an explicit reason. No protected quiz should silently hang or fall back to a stale local list.
- Reservation alone does not create a session, answer, score, mastery change, readiness gain, or history completion.
- Segment 14 incremental sync remains unchanged. Segment 16 does not call `ensureFreshHistory`, add full-ledger Start-path reads, add polling, or reload the page.
- Segment 15 writer ownership, checkpoint, takeover, and deadline semantics are unchanged.
- Segment 04 canonical identity and Segment 05 catalog-version validation still execute before a v2 reservation request.

## Server protocol

Migration `20260910030000_add_new_only_allocation_v2.sql` adds owner-scoped reservation metadata and item lifecycle state while retaining `test_bank_new_question_claims` as the permanent exclusion key.

`reserve_test_bank_new_questions_v2` authenticates with `auth.uid()`, validates bounded inputs, serializes competing allocations per owner/exam using a transaction advisory lock, checks both permanent claims and durable learning events, and atomically inserts the winning claim set. A retry of the same owner/exam/planned-session returns the existing allocation.

`mark_test_bank_new_only_reservation_v2` advances item state monotonically through `reserved -> delivered -> displayed -> answered`. An abandoned session may mark the reservation header `abandoned`, but no claim row is removed. `fetch_test_bank_new_only_reservation_v2` exposes only the authenticated owner's planned reservation through the RPC boundary. The backing tables have RLS enabled and no direct browser grants.

## Client protocol

`test-bank-new-only-allocation-v2.js` wraps the existing learning API after `test-bank-learning-events.js` loads. It preserves the existing return shape used by Quick and Focused Start flows while adding `reservationId`, `plannedSessionId`, and reuse metadata.

A planned-session ID and request ID are written to tab-scoped `sessionStorage` before the RPC. Therefore a reload/interruption before durable session creation can retry the same server reservation without allocating a second set. After `startSession` reports a durable save, the allocation is marked delivered and bound to that learning session. A MutationObserver marks an item displayed only when the quiz DOM reports that canonical question ID as the visible item. A durably saved answer advances that item to answered. Abandonment marks lifecycle state but cannot release the permanent claim.

## Verification

The dedicated Segment 16 suite covers:

- schema/RPC existence and direct-table denial;
- owner isolation and anonymous denial;
- permanent claim creation with no learning-event side effect;
- same planned-session idempotent retry after interrupted Start;
- monotonic reservation/delivery/display/answer lifecycle;
- abandonment without claim release;
- concurrent same-owner/same-exam allocations with no overlap;
- explicit exhausted-pool failure with no empty reservation artifact;
- independent owner scope;
- client identity and catalog-version gates;
- explicit RPC/exhaustion failure reasons;
- cumulative New-only, Segment 15 handoff, Segment 14 sync, Segment 13 timing, Segment 12 lifecycle and full repository tests.

The existing Segment 03 cumulative workflow continues to supply the broader multi-browser/runtime/database regression gate on every pull request.

## Rollout

Database first. Deploy and verify `20260910030000_add_new_only_allocation_v2.sql` before serving `test-bank-new-only-allocation-v2.js`. The client must fail closed if the v2 RPC is unavailable; it must not downgrade to a local-only New-only promise.

The migration is additive and does not rewrite question IDs, learner events, scores, mastery history, existing claims, checkpoints, or session deadlines. Rolling back the frontend can leave the additive reservation metadata in place without releasing historical New-only exclusions.

This PR does not deploy the production migration, modify learner data, merge itself, or implement Segment 17.
