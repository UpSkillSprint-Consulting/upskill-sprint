# Segment 08 — Deterministic history reconciliation

## Outcome

The analytics and mastery surfaces now use one versioned, read-only projector for answer totals and first/repeat classification. It builds canonical question histories before applying current-bank, date-window, or reset-epoch scope. It does not trust legacy `priorAttempts` labels and no longer chooses the larger of the mastery-derived and ledger-derived counters.

For the reproduced 698-interaction/649-question snapshot, the deterministic projection is 649 first answers and 49 repeats. The 36 records incorrectly labelled first are reclassified from chronology; the existing 13 known repeats remain repeats. No question state, ledger event, or learner record is deleted or rewritten.

## Evidence precedence and overlap

1. A canonical `session_completed.payload.answers` entry is the final answer for its session/question.
2. Otherwise, the latest immutable `answer_recorded` revision for that session/question is used.
3. Legacy detail is included only when its learning-event or session identity does not overlap durable evidence.
4. A compacted baseline or an aggregate count larger than retained detail remains counted, but its unprovable first interaction is classified `unknown`.

Thus, for one all-history population:

`answered = first + repeat + unknown`

With complete provenance, `unknown = 0` and `first = unique answered questions`. Date-window filters are applied after lifetime classification, while an explicit reset epoch establishes a new scoped history.

## Diagnostics and migration safety

When ledger and legacy source totals differ, the learner-facing analytics panel reports the disagreement and displays the canonical union. Unknown provenance is shown rather than silently assigned to first or repeat accuracy.

`scripts/exam-reliability/segment08-reconcile.cjs` accepts a privacy-safe exported JSON fixture and emits a deterministic dry-run plan. It has no database or browser-storage write path, reports `writes: 0`, and gives each proposed classification a stable operation key. Running it repeatedly with identical evidence produces identical output and cannot double-count or mutate history.

No production data migration is included or applied. Any future approved conversion must first match this dry-run projection, preserve source evidence, and use the stable keys for idempotence.

## Verification and boundaries

The Segment 08 suite covers the screenshot-sized fixture, duplicate event IDs, answer revisions, canonical completions, ledger/mastery overlap, compacted baselines, incomplete hydration, retired IDs, date windows, reset epochs, deterministic reruns, and production script ordering. The existing Segment 06–07 and cumulative repository gates remain required.

This segment repairs answer-history reconciliation only. Grading adoption, complete paginated exports, reporting timezone, cross-device active-session transfer, and production Supabase parity remain assigned to later segments. The supplied steel-grade specification schema is unrelated and unchanged.
