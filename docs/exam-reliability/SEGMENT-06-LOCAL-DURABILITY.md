# Segment 06 — crash-safe local answer capture

## Baseline and scope

This implementation branches from human-merged `main` at `851c6a6`, which
contains Segments 01–05 through PRs #172 and #173. It changes local browser
capture for full, diagnostic, quick, focused and adaptive sessions. It does not
change question content or IDs, grading formulae, server tables/RLS/RPCs,
learner records, dependencies, or production configuration.

The supplied `SPEC_DATA` document describes the separate steel-grade lookup
tool. It was inspected for scope and does not define examination events, so no
fields from that unrelated schema were introduced here.

## Root cause

The existing ledger correctly persisted option clicks before acknowledging the
UI, but represented each click as `answer_recorded`. If an upload began between
two pre-submission choice changes, both payloads became immutable answer-event
revisions. Later projections usually collapsed those revisions, but the capture
contract itself did not distinguish a draft choice from a scored response.

The core quiz also returned silently after some failed option writes, while the
adaptive paths exposed a recovery message. The status API had a boolean for the
latest write but no explicit local recovery state.

## Implementation

- `recordDraft()` stores one owner/session/question draft synchronously before
  the UI adopts the choice. Each item has a stable `draftId`; each changed save
  has its own stable `operationId`, schema/type, device, owner, sequence,
  revision, and client occurrence time. An unchanged retry retains its operation
  identity.
- Drafts live in the durable session record and never enter the deployed
  `test_bank_learning_events` enum or scored analytics stream. This preserves
  the Segment 02 `C02`/`C14` boundary and requires no database migration.
- Full, diagnostic, quick and focused quizzes commit answers only during
  finalization. Adaptive modes commit one scored response only when **Check
  answer** succeeds. Failed submission leaves the editable draft in place.
- A committed response carries the final `draftId`, `draftOperationId`, and
  `draftSelectedAt`, then clears the draft in the same confirmed local write.
- Multi-tab session merging compares draft revision, local sequence and
  operation identity deterministically. A completed answer wins over an older
  draft. Account ownership checks apply before any draft mutation.
- The status API exposes `recovery.required`, failure/recovery timestamps and
  the last error reason. All learner-facing capture paths fail closed with an
  actionable storage notice. Existing bounded quota compaction now retries
  drafts as well as starts, responses and completions.

## Acceptance evidence

Focused tests cover rapid edits, duplicate taps, stable operation retry, crash/
reload recovery, denied and quota-exhausted storage, account switching,
completion retry, multi-tab writes, and both adaptive implementations. Static
integration checks prevent core/adaptive option handlers from reverting to
pre-submission `answer_recorded` calls. The dedicated all-PR workflow is **Exam
local durability**.

Run locally:

```sh
npm ci
node --test --test-concurrency=1 \
  tests/test-bank-segment06-durability.test.js \
  tests/test-bank-learning-events.test.js \
  tests/test-bank-write-ahead-guard.test.js \
  tests/test-bank-mobile-storage-quota.test.js
node scripts/exam-reliability/run-node.cjs
```

## Boundaries and release order

This segment makes local acknowledgement conservative and recoverable. It does
not claim active-session cross-device handoff, authoritative server receipts,
atomic server finalization, complete session restoration, production
authorization parity, or physical iPhone acceptance. Those remain assigned to
Segments 07, 12, 15, 18–20. Human review/merge, deployment and production
verification remain separate states; no automatic merge is authorized.
