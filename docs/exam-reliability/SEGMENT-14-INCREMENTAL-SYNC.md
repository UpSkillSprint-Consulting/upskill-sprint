# Segment 14 — incremental synchronization and convergence

## Scope and entry state

Segment 14 starts from `main` commit `c41e7b95f3b4abc5df3ceb8977de9b48f70fb618`, which contains the merged Segment 13 work from PR #179 and therefore preserves the cumulative Segments 01–13 contracts, tests, grading, reconciliation, lifecycle and authoritative-timing behavior. This segment does not implement Segment 15 active-session takeover or Segment 16 allocation-policy changes.

The accepted Segment 14 boundary is: keep synchronization incremental, make catch-up cursors safe under concurrent writes, bound retries and requests, actively cancel obsolete work, expose truthful sync states, preserve the authoritative New-only reservation path, and never reintroduce a full-ledger dependency into Start or use page reload as ordinary synchronization.

## Root causes addressed

The pre-Segment-14 learning ledger paged by received timestamp plus OFFSET. The account snapshot channel used a timestamp cursor. Those strategies can become ambiguous when writes arrive while a multi-page read is in flight, and timestamps alone are not a sufficient commit-order cursor. Requests had a timeout, but obsolete requests were not actively cancelled on account/offline transitions. Learning retries did not have an explicit terminal attempt count. The two persistence channels also exposed separate status without one conservative combined state.

The repair deliberately does **not** turn browser clocks into sync authority. It also does not add another periodic timer. The account snapshot channel already performs the existing bounded 60-second remote poll; each successful account poll triggers a coalesced incremental learning-ledger catch-up.

## Server protocol: transaction-serialized sequence cursors

Migration `20260909195500_add_incremental_sync_cursors.sql` adds `sync_seq` to both durable channels and a private per-user counter table. Existing rows are deterministically backfilled once. New writes receive their sequence inside `BEFORE` triggers.

A transaction-scoped PostgreSQL advisory lock is taken per user and channel before the sequence counter is incremented. The lock is held until commit/rollback. As a result, another transaction for the same user/channel cannot obtain a later visible cursor and commit ahead of the earlier writer. This avoids the classic "read advanced past an uncommitted row" failure that can affect naïve timestamp or sequence allocators.

The two authenticated RPCs are:

- `fetch_test_bank_learning_events_incremental_v1(p_after_sync_seq, p_limit)` — maximum page 500.
- `fetch_test_bank_progress_devices_incremental_v1(p_after_sync_seq, p_limit)` — maximum page 100.

Both are `SECURITY INVOKER`, derive ownership from `auth.uid()`, reject invalid cursors/page sizes, expose no counter-table access, and return rows in ascending `sync_seq`. A null cursor intentionally replays the owner history. That makes a legacy timestamp-only browser cursor safe: it may re-read idempotent rows once, but it cannot skip server-sequenced evidence.

The event ledger's existing idempotent identity and the progress channel's merge semantics remain unchanged. Sequence numbers are synchronization order, not question identity, grading evidence, session revision or learner-facing time.

## Client catch-up and durability

`test-bank-learning-events.js` and `test-bank-account-sync.js` use server-sequence RPCs when `test-bank-incremental-sync-policy.js` enables protocol v1. Legacy direct-query paths remain as compatibility code, but production test-bank routes inject the new policy before the sync modules.

A catch-up buffers its pages and advances the durable cursor only after the full bounded read succeeds. A failure on page N therefore leaves the previous durable cursor intact; the next attempt replays from the last acknowledged position. Pages are required to be strictly increasing and bounded, and an excessive page count fails closed.

The existing New-only reservation RPC remains the authoritative allocation path. The Segment 14 regression guard scans all Start-path modules and edge loaders to ensure no `ensureFreshHistory()` full-ledger dependency has been added to Start.

## Cancellation, retries and status

Both durable channels give each remote request the existing 12-second timeout and attach it to a parent synchronization `AbortController` where the Supabase query supports `abortSignal`. Account changes, sign-out and offline transitions cancel obsolete in-flight work rather than allowing it to overwrite the new account/network state.

Learning synchronization uses at most six transient retry attempts with exponential delay. Authorization/schema/cursor errors, explicit cancellation and server conflict results are not converted into indefinite retries. Session conflicts (`40001`/`23505`) are reported as a dedicated conflict state for the later ownership/takeover work rather than hidden as a generic transient network error.

The status contract distinguishes `signed-out`, `idle`, `syncing`, `pending`, `retry-wait`, `offline`, `cancelled`, `conflict`, `error`, `awaiting-legacy-migration` and `synced`. `syncedAsOf` is exposed only when the relevant channel is online, has no pending work or conflict, and is actually clean. `window.__TBSyncStatus` combines account and learning states conservatively; one stale green component cannot mask another component that is pending, offline or conflicting.

## Idle active-device convergence

The existing account channel keeps `REMOTE_POLL_MS = 60000`. On its successful `upskill-test-progress-synced` event, the Segment 14 policy requests one coalesced `__TBLearning.sync('account-poll-catch-up')`. Overlapping poll events share the same in-flight catch-up. This gives an otherwise-idle signed-in browser a periodic remote-ledger catch-up without a second polling timer and without putting a ledger read on quiz Start.

The frozen Segment 03 five-second active-sync performance target is a Segment 19 qualification budget. Segment 14 does not claim that 60-second fallback polling meets that future WAN/device target; focus, online, authentication and local writes can trigger synchronization earlier.

## Reload policy

Learning synchronization contains no `location.reload()` path. Account synchronization retains the pre-existing reload only after an actual account switch, where clearing account-scoped local projections is intentional. Routine polling, local changes, focus, reconnect and catch-up do not navigate or reload the examination page.

## Tests and evidence

Segment 14 adds focused tests for:

- more than 1,000 remote learning rows across multiple pages;
- a later server-sequenced row whose wall-clock timestamp is older than earlier rows;
- failed second-page recovery without durable-cursor advancement;
- legacy cursor safe replay and upgrade;
- active cancellation of a stalled fetch;
- explicit conflict state;
- offline pending state with no false `syncedAsOf`;
- independent progress-channel server sequence;
- combined status precedence and coalesced idle catch-up;
- source guards protecting New-only Start and no learning reload;
- real PostgreSQL owner/RPC permissions, cursor validation, monotonic update sequences, and two concurrent transactions proving serialized commit-order allocation.

The dedicated `Exam incremental sync` workflow runs the focused Node suite, applies the complete repository schema to disposable PostgreSQL 17.6 before Segment 14 database acceptance, and runs Chromium desktop plus WebKit phone-layout browser flows. The existing full repository, baseline, contract and multi-browser reliability workflows remain cumulative PR gates.

Browser emulation is not physical iPhone/iPad acceptance. The disposable database models `auth.uid()` but is not a live Supabase Data API/JWT test. Those remain Segment 18/19 evidence requirements.

## Migration and rollout order

Production rollout must be database-first:

1. Apply and verify `20260909195500_add_incremental_sync_cursors.sql`.
2. Confirm both authenticated incremental RPCs and sequence triggers exist.
3. Deploy the frontend/edge policy that enables `server-sequence-v1`.
4. Verify read-only/current-account catch-up and pending/synced status in production.

If the client is deployed before the migration, the missing RPC fails closed and local outbox evidence remains durable, but synchronization cannot become green. That is a recoverable state, not the intended rollout sequence.

The migration is additive to learner evidence. Rollback of the frontend can leave `sync_seq`, counters, indexes and RPCs in place; legacy clients ignore them. Do not drop the sequence columns/counters during an emergency frontend rollback because doing so provides no recovery benefit and creates unnecessary table rewrite/data risk.

## Boundaries deliberately left open

- Segment 15: canonical active-session handoff/takeover and stale-writer ownership across devices.
- Segment 16: New-only exhaustion/abandonment policy and broader allocation acceptance.
- Segment 17: complete learner-facing sync-state UX/accessibility treatment.
- Segment 18: live client-role/JWT/Data API security and reset/deletion qualification.
- Segment 19: physical devices, long-history/WAN stress and frozen latency budgets.
- Segment 20: human-approved migration/deployment, exact live revisions and observation window.

No learner history is reset, question ID is changed, grading formula is altered, or previously merged timing/session contract is weakened by Segment 14. A green PR is implementation evidence, not production deployment or a 10/10 release rating.
