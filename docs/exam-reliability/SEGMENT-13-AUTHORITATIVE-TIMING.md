# Segment 13 — Authoritative exam timing and active-question visits

Status: implemented for human review on `fix/segment-13-authoritative-timing`. Base: `main` at `51a70e015ae0277ebb5024a7845945a5411b4843`, the human-merged Segment 12 commit. This segment does not merge itself, deploy the migration, perform cross-device takeover, or claim physical-device qualification.

## Dependency alignment

Segments 01–12 are treated as immutable prerequisites. Segment 13 keeps the Segment 12 lifecycle states, owner-scoped local recovery, pinned question/configuration identity, frozen finalization retry, and immutable `deadlineAt`. It does not alter grading, mastery/readiness formulas, question identifiers, history reconciliation, server ingestion, or the New-only reservation path.

The normative timing rules are Contract v1 C07:

- timed sessions keep the authoritative deadline captured at start and cannot pause;
- callback counts and an adjustable device wall clock are not timing authority;
- while a page remains open, trusted server calibration plus monotonic elapsed is authoritative;
- after reload, trustworthy current time must be re-established; an offline/unverifiable restart is fail-closed and must not grant extra time;
- deadline expiry freezes/finalizes once;
- active-question time counts only visible in-progress visits, commits the preceding interval on hide, excludes hidden time, supports revisits without overlap, clips at the deadline, and preserves unknown evidence as unknown rather than zero.

Segment 15 still owns cross-device active-session takeover. Segment 19 still owns physical iPhone/iPad and frozen performance qualification.

## Root causes addressed

1. Core countdown logic already used `deadline - Date.now()` rather than callback decrementing, so browser suspension caught up correctly, but a user/device clock change could move remaining time backward or forward.
2. Segment 12 persisted the original deadline but intentionally did not establish trusted current time after restart.
3. `test-bank-phase2-hardening.js` and `test-bank-phase2-runtime-coordinator.js` returned early from their timing commit after `visibilitychange` had already set `document.hidden=true`, dropping the last visible interval. They also used adjustable wall time, maintained separate timing maps, and averaged only values at least one second long.

## Trusted clock protocol

`get_test_bank_server_time_v1(text)` is a read-only authenticated PostgreSQL RPC. It returns the database `clock_timestamp()` and does not persist the diagnostic reason or mutate learner data. `PUBLIC` and `anon` execution are revoked; `authenticated` receives execute permission, and the function itself requires a non-null `auth.uid()`.

The browser measures monotonic time immediately before and after the RPC. The returned server time is anchored to the monotonic request midpoint; half the round-trip is retained as uncertainty. Once calibrated, `Date.now()` for the page is supplied by that server anchor plus `performance.now()` elapsed. This keeps the existing core timer path compatible while removing direct dependence on later device-wall-clock edits.

The immutable session `deadlineAt` is never recalculated during resynchronization. Recalibration changes the estimate of current time, not the deadline.

### Deployment order

The database migration **must be deployed before the frontend bundle that requires it**. Deploying the client first would make new timed starts fail closed because a trusted clock cannot be established. Rollback of the frontend is safe while the read-only RPC remains deployed; the additive RPC can be removed only after no supported client depends on it.

## Recovery behavior

- New timed starts are blocked when trusted time is unavailable.
- A timed session that reloads while the clock service is unreachable remains saved, but `resume()` and answer edits return `TIMING_RECOVERY_REQUIRED`.
- Reconnect calls `recoverTiming()`/`__TBSessionTiming.recover()`, recalibrates, and resumes against the same original deadline.
- Wall-versus-monotonic discontinuity beyond one second triggers re-verification. If it cannot be verified while offline, the session enters timing-recovery-required rather than falling back to the adjustable wall clock.
- If trustworthy time is already at or beyond the deadline, the timing adapter commits the active visit and drives the existing frozen finalization path. Repeated checks cannot create a second canonical completion.

This is intentionally fail-closed. It may temporarily prevent a timed answer when timing authority cannot be proven; it never grants additional exam time to hide an uncertainty.

## Canonical active-question timing

`test-bank-session-timing.js` owns one active visit per lifecycle session. A visit is identified by session, writer epoch, and local visit counter. It records canonical `questionId`/`itemId`, trusted start/end timestamps where available, a duration, and a reason.

- Navigation commits the prior visit before the next begins.
- `visibilitychange` commits **before** hidden time starts; hidden time is excluded.
- Returning visible begins a new visit, so revisits accumulate without overlapping intervals.
- `pagehide`, submission, expiry, and lifecycle changes commit the open visit.
- Timed visits are clipped to the immutable deadline.
- Zero-length measured visits stay measured; absent/ambiguous timing remains unknown.
- The summary reports measured-item coverage and averages all known measured items, including valid zero durations.

The two Phase-2 feedback modules now consume the canonical timing summary when it is present. Their repaired monotonic fallback remains only for compatibility if the Segment 13 module is absent. This removes competing authoritative maps and the hide-event loss while preserving existing feedback/error-classification behavior.

## Test coverage

### Unit/integration

`tests/test-bank-segment13-timing.test.js` verifies:

- server-calibrated monotonic time is unaffected by a 120-second device-wall rollback;
- recalibration cannot change `deadlineAt`;
- offline/unverifiable restart blocks timed resume and edits;
- premature `timed-out` finalization is rejected and post-deadline finalization is normalized to timed-out;
- visible time commits on hide, hidden time is excluded, and revisits accumulate;
- visits clip at the deadline and known zero-duration observations remain measured;
- question identities remain canonical with one active visit at a time;
- untimed visit measurement uses monotonic time without requiring the trusted-clock RPC.

The dedicated workflow also reruns Segment 01 timing observations, quiz timing, Phase-2 runtime, Segment 12 lifecycle tests, and the full repository test command.

### Disposable database

The existing PostgreSQL 17.6 reliability harness applies every repository migration, including the clock RPC. The Segment 13 workflow then verifies an authenticated call succeeds and an `anon` call fails. This is a disposable database test, not live Supabase deployment evidence.

### Browser acceptance

Chromium desktop and WebKit phone-layout runs use the shipped test-bank page and native browser storage with a synthetic authenticated service. They verify:

1. trusted clock is available before a timed Quick Quiz;
2. canonical active-question time is collected;
3. reload keeps the exact deadline and reduces remaining time by trusted elapsed time;
4. unavailable clock service after restart produces recovery-required and blocks resume;
5. reconnect restores timing authority without changing the deadline;
6. advancing authoritative server time beyond the deadline finalizes once.

WebKit phone layout is emulation, not physical iPhone evidence. Live JWT/Data API authorization, production schema parity, actual device sleep behavior, cross-device handoff, and long-run drift remain later acceptance boundaries.

## Files changed by Segment 13

- `test-bank-session-timing.js` — trusted clock, expiry enforcement, active-visit authority.
- `test-bank-adaptive-mastery-completion-guard.js` — loads timing after Segment 12 lifecycle/finalization adapters.
- `test-bank-phase2-hardening.js` — consumes canonical visit timing; repaired fallback.
- `test-bank-phase2-runtime-coordinator.js` — consumes canonical visit timing; repaired fallback.
- `supabase/migrations/20260909152000_add_exam_trusted_clock.sql` — authenticated read-only server-clock RPC.
- `tests/test-bank-segment13-timing.test.js` — deterministic timing/recovery tests.
- `tests/helpers/segment03-harness.cjs` — synthetic clock-RPC compatibility for cumulative browser gates.
- `scripts/exam-reliability/run-session-timing-browser.cjs` — browser recovery/expiry acceptance.
- `.github/workflows/exam-session-timing.yml` — unit/database/browser cumulative gate.
- `docs/exam-reliability/SEGMENT-13-AUTHORITATIVE-TIMING.md` and roadmap status.

## Explicit non-goals / remaining gates

- No active-session ownership transfer between devices (Segment 15).
- No incremental-sync redesign (Segment 14).
- No New-only allocation change (Segment 16).
- No broad dashboard/UX/accessibility redesign (Segment 17).
- No claim that disposable-role tests equal production security verification (Segment 18).
- No physical iOS, WAN stress, or final timer-drift certification yet (Segment 19).
- No automatic merge, production migration, or 10/10 release score (Segment 20).
