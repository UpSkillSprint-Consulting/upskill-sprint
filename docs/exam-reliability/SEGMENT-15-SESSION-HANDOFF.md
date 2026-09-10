# Segment 15 — canonical active-session handoff

Status: **implemented for human review**, not merged or deployed. Baseline is `main` commit `463b844ae1e4e7022cde44b7645b2570b060d38f`, which includes Segments 01–14 and merged PR #180. This segment implements the C09 takeover contract without changing question identity, grading formulas, mastery, New-only allocation, historical evidence, or the Segment 13 deadline policy.

## Problem closed by this segment

Segments 12–14 provided browser-local lifecycle recovery, immutable version pins, trusted timing, durable learning evidence and incremental synchronization, but they deliberately did not provide an authoritative active-session transfer. The account snapshot intentionally excludes session keys, so a second device could recover history without safely assuming control of the exact in-progress examination. The missing contract pieces were a cloud-accepted resumable checkpoint, explicit writer ownership, atomic takeover, stale-writer rejection and a truthful boundary for local-only work.

## Design

`test_bank_session_checkpoints` stores one latest resumable checkpoint per owner/session. It is additive to the existing immutable version/result/event tables and references the existing `test_bank_session_versions` row. Authenticated clients have owner-scoped SELECT only; writes occur through narrowly scoped SECURITY DEFINER RPCs.

- `save_test_bank_session_checkpoint_v1` validates owner/session/exam/mode, writer epoch, checkpoint compare-and-swap revision, pinned start/deadline and the pinned core item manifest. It cannot extend a timed deadline.
- `fetch_test_bank_resumable_sessions_v1` returns only the authenticated owner's nonterminal checkpointed sessions.
- `takeover_test_bank_session_v1` locks runtime + checkpoint, checks expected writer epoch and checkpoint revision, and atomically advances writer epoch and server session revision when writer ownership changes. A retry by the same writer is idempotent.

Writer identity is a per-tab client identity composed from the existing stable browser-device ID plus a sessionStorage tab token. This prevents two tabs on one physical browser from silently acting as the same writer while preserving a stable device label for diagnostics.

The browser companion `test-bank-session-handoff.js` wraps, but does not replace, the Segment 12 lifecycle and Segment 14 transport. Lifecycle saves remain local-first; active checkpoints are coalesced and uploaded only after pending learning evidence has synchronized. There is no new polling interval and no full-ledger Start-path read. Focus, reconnect and the existing account-progress synchronization event trigger bounded ownership refresh.

A second client can explicitly take over. The server returns the last cloud-accepted checkpoint and original deadline. The client seeds the existing durable learning-session state with the returned writer epoch/server revision, rehydrates lifecycle state by canonical identity/version, re-runs Segment 13 trusted-time recovery for timed sessions, then invokes the existing lifecycle resume path. Adaptive sessions use the same checkpoint protocol and remain untimed.

## Local-only and stale work

No handoff claims that another device's unuploaded work transferred. If a stale browser has divergent local state or unsynchronized session learning events, the first takeover attempt stops with `LOCAL_UNUPLOADED_CHANGES`. The UI explains the boundary and requires an explicit second confirmation to use the cloud checkpoint. Before confirmed takeover, the stale local snapshot and pending events are preserved in owner-scoped conflict storage. Pending stale events are removed from the upload queue and local answer index before writer authority is adopted, preventing them from being relabelled under the new writer epoch. Their preserved conflict copy is not graded or uploaded automatically.

After ownership refresh, the old writer is blocked locally from draft, response, completion and abandonment calls. This is defense in depth: the Segment 07 server runtime remains authoritative and rejects the old writer epoch even if a stale client has not yet refreshed.

## Compatibility with Segments 01–14

- **Identity/versioning:** the existing session/version pin and ordered question/option identities are reused; no question IDs are changed.
- **Durability/ingestion:** the event ledger and idempotent receipt protocol remain canonical for learning/grading. Checkpoints are resumable UI state, not a parallel score/history source.
- **Reconciliation/grading/metrics/history:** no formulas or historical records are changed.
- **Lifecycle/timing:** Segment 12 restore is reused. Segment 13's original deadline and trusted-clock recovery are mandatory on timed takeover; takeover never creates extra time.
- **Incremental sync:** Segment 14 remains the only periodic account/learning catch-up loop. The handoff module adds no polling timer and no page reload synchronization.
- **New-only:** reservation semantics are unchanged; Segment 16 remains separate.

## Verification

The focused Node suite covers initial checkpointing, exact-once epoch advancement, same-writer idempotency, competing takeovers, stale-writer blocking, cloud-only restoration, explicit divergent-state confirmation, conflict preservation/quarantine, trusted-time recovery, expiry, owner mismatch, adaptive identity and offline fail-closed behavior.

The disposable PostgreSQL suite applies the complete repository schema before testing owner isolation, direct-write denial, checkpoint CAS, immutable deadline, explicit takeover, same-writer retry, stale checkpoint rejection, concurrent takeover, anonymous/other-owner denial, terminal takeover rejection and removal of terminal sessions from resumable fetch.

The browser lane uses two independent contexts in Chromium desktop and WebKit phone layout. It verifies device A checkpointing, device B takeover, preserved deadline/new writer epoch, stale device A write blocking, and visible cloud-only-transfer disclosure. WebKit layout is emulation, not physical iPhone acceptance; physical-device qualification remains Segment 19.

The dedicated `Exam session handoff / Segment 15 acceptance gate` runs focused + cumulative Node tests, the cumulative disposable database suite, Segment 15 database tests and two-browser acceptance. Existing repository-wide workflows still run on the PR.

## Rollout and recovery

Database first: deploy the additive Segment 15 migration before serving the frontend loader/module. Until the RPCs exist, the module fails closed and browser-local Segment 12 resume remains available; it must not claim a cloud transfer. Frontend rollback can leave the additive checkpoint table/functions in place because they do not change grading/history semantics. The migration does not rewrite learner evidence.

No production database migration or learner-data write is performed by this PR. Human merge, database deployment, frontend deployment and production verification are separate approvals. Segment 16 is not started by this work.
