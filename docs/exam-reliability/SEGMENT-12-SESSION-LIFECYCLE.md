# Segment 12 — Consolidated examination session lifecycle

Status: implemented for review. This segment is intentionally local-device lifecycle/reload recovery. Segment 13 remains responsible for trusted-clock/timer hardening and Segment 15 remains responsible for authoritative cross-device takeover.

## Contract alignment

The runtime adopts Contract v1 C03/C07/C08 lifecycle fields and transitions without changing scoring, mastery, readiness, history, question identity, or New-only allocation semantics established in Segments 01–11.

Supported lifecycle states are `created`, `in_progress`, `paused`, `finalizing`, `completed`, `expired`, and `abandoned`. Completed, expired, and abandoned are terminal. Timed sessions cannot pause. Finalization freezes the lifecycle until the existing durable completion operation succeeds; retry remains `finalizing`. A recovered finalizing session cannot be reopened or abandoned; it can only retry the exact frozen submission and then become `completed` or `expired`.

## Persisted recovery snapshot

`tb-exam-session-lifecycle-v1` stores owner-scoped local recovery state. It is deliberately not part of account snapshot synchronization. The snapshot includes:

- session, owner, exam, set, and mode identities;
- immutable bank, blueprint, grading, mastery, and timing policy references;
- ordered item IDs, canonical question IDs and revisions;
- revision-local option IDs/order and current draft selection;
- current item identity and flags;
- original start/deadline/timed policy;
- writer/reset epochs and session revision;
- the complete immutable version pin required to reconstruct historical question content.

Restore is identity/version based. Array position is used only inside the pinned session after item identities have validated; it is never used to look up today's question bank as historical identity.

## Runtime integration

The lifecycle adapter wraps the existing durable learning writer rather than creating a parallel grading/history system:

1. A successful durable `startSession(... returnResult:true)` creates the lifecycle snapshot.
2. A safely persisted draft updates only that item's revision-local selection.
3. Navigation/flag UI changes are copied from the live session through the existing `getFeedbackSnapshot()` closure and canonical question IDs.
4. Completion transitions to `finalizing` before calling the existing durable completion operation. The companion finalization adapter records the completion reason, keeps inputs frozen, rejects editable resume/abandon, and reconstructs the same pinned question revisions for idempotent retry. A failed save remains recoverable/finalizing; a successful operation becomes `completed` or `expired`.
5. Abandonment becomes terminal and removes the active pointer while retaining the terminal record for diagnostics/idempotency.
6. On reload, a same-owner editable session produces a resume notice. The exam/quick/focus adapter recreates the internal quiz through the existing UI start path while temporarily substituting the original immutable version pin and pinned questions. Previously saved drafts/flags are replayed into the UI without generating new learning attempts. A finalizing session instead renders a frozen-submission recovery action and never reopens editable inputs.

Adaptive practice keeps its established `tb-adaptive-session-v2` recovery implementation; Segment 12 does not rewrite that subsystem. This is the compatibility-adapter boundary required by the roadmap.

## Explicit boundaries

- No cross-device active-session takeover is claimed. The lifecycle key remains device-local; Segment 15 owns authoritative takeover/conflict handling.
- No trusted server-clock recovery is added. The original deadline is preserved; Segment 13 owns clock calibration, background timing, and expiry authority.
- No scoring, metrics, historical trend, question-ID, reservation, or Supabase schema changes are introduced.
- No learner history is reset or migrated.

## Acceptance checks

The Segment 12 unit suite verifies legal/illegal transitions, terminal-state protection, timed-pause rejection, owner isolation, active-pointer cleanup, canonical question matching, revision-local option restoration, pinned timing/configuration preservation, invalid current-item detection, and frozen finalization retry behavior.

A dedicated real-browser acceptance job runs Chromium desktop and WebKit phone layouts against the shipped page. For Quick, Focused, and Full Exam modes it starts a session, saves selections/flags/current position, reloads the page, resumes the exact pinned question order and deadline, verifies restoration creates no new learning events, submits once, reloads again, and verifies the terminal session does not reopen. WebKit phone is browser emulation, not a physical-iPhone acceptance claim. Existing repository suites remain cumulative and must stay green before merge.
