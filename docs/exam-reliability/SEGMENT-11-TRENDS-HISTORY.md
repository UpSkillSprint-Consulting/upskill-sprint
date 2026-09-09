# Segment 11 — trends, reporting dates, complete history, and exports

Segment 11 separates practice trends from pinned full-exam trends, moves activity to answer-event dates, uses one explicit reporting timezone, and removes the 500-entry local projection as the lifetime-history/export boundary.

## Runtime rules
- The Trend tab is practice-only. Eligible completed timed full examinations remain in Exam attempts and are never mixed into the practice sparkline.
- Daily activity is derived from the final nonblank `answer_recorded` event for each session/question. A later revision replaces an earlier revision for that session/question. Session completion dates are not used as answer dates.
- The dashboard reporting timezone is the newest valid pinned `reportingTimeZoneAtStart`; otherwise it is explicitly UTC. Grouping and displayed heatmap calendar keys use that same timezone.
- Legacy answers without a reliable answer timestamp remain unknown and are disclosed; they are never assigned to the completion date. Missing duration remains unknown and is not synthesized here (timing repair remains Segment 13).
- `__TBLearning.historyPage()` reads the authenticated owner's ledger directly with deterministic `received_at,event_id` ordering and bounded pages. `exportHistory()` walks those pages so the local 500-attempt/cache limits are not represented as lifetime history.
- Complete-history export is a separate JSON action from the mastery PDF/report. Its envelope includes scope, owner/exam, page count, event count, ordering, timestamps and explicit legacy limitations.

## Review closure
The final review pass also preserves unavailable mastery evidence end-to-end: missing/future mastery timestamps render as `Unavailable`, do not become `null%`, do not receive a false 0% ring value, and do not dilute subtopic/domain aggregates. The corresponding Codex review threads are resolved only after this behavior passed the focused regression gate.

## Preservation
No learner evidence is rewritten or deleted. No question IDs/content, grading policy, mastery coefficients, timing policy, database migration, dependency version, reset semantics or New-only reservation behavior changes. Segment 09 remains authoritative for historical full-exam eligibility; Segment 10 remains authoritative for mastery/readiness formulas.
