# Metric, evidence and session contract v1.0.0

Status: **implemented specification / human review candidate**, not a claim that the current runtime conforms. The normative machine constants, IDs, field lists and transition table are in `contract.json`; independently hand-worked expected results are in `worked-examples.json`. `release-rubric.json` fixes the release criteria. Read these together. The specification model under `tests/helpers/` is not an application service and must never be imported into the browser or server.

Source basis: the approved roadmap's **Segment 02 — Approve the metric, event, and session contracts**; Segment 01's pinned code inspection and G01–G14/R01–R18/P01–P07 register. Retained formulas are explicitly identified below. The remaining choices are versioned engineering policy decisions made in this segment for review, not statements that the earlier code already works this way. Official certification-configuration verification remains Segment 05. The unrelated steel-grade SPEC_DATA contract is not an exam schema and is not changed.

## C01 — Scope and result envelope

Every metric carries its `metricId`, `contractVersion`, exact value and numerator/denominator, unit, `scope`, evaluation timestamp, evidence watermark, completeness, pending-operation count and unknown-evidence count. A rendered label may shorten the name but cannot change the definition. Counts are nonnegative integers. Percentages with a zero or unknown denominator are `null`/unavailable, not zero percent. A known zero numerator over a known positive denominator is zero percent.

Scope explicitly identifies authenticated owner, exam, population, manifest version, learning epoch, first-answer basis, optional date window, reporting timezone, as-of time and applied server watermark. `current_bank` means unique question IDs in the specified manifest at evaluation; it includes all published sets unless the view explicitly names a smaller manifest. Historical-all counts include retired IDs and have **no current-pool denominator**. Set membership and question revision never create a new canonical question identity.

The dashboard's current learning view uses the current manifest and active adaptive epoch. Lifetime history, lifetime delivery exclusions and exam results are separate scopes. `epochId:null` means lifetime, not “use whichever epoch is local.” With a date window, both bounds are required and the interval is **[start, end)**. First/repeat classification is done before window filtering. “First in this window” is not a permitted alias for lifetime-first. Export the full scope; devices cannot silently substitute their own locale/timezone or current bank for it.

A complete result requires complete canonical evidence through its stated watermark. A partial view may display a labelled known count/lower bound plus missing or undated evidence; it cannot claim a definitive lifetime/date-window total. If exact compacted counts survive but chronology does not, retain the exact counts and mark only unsupported breakdowns unknown. Never resolve ledger/projection disagreement with `max()` or by resetting records. Emit a discrepancy and rebuild under Segment 08.

The 30-entry metric dictionary in `contract.json` is the normative counter/denominator inventory. New metrics require a versioned addition and an independent worked example.

## C02 — Selection, saving, acknowledgement and grading

**Selected answer** is the current draft option. **Locally saved answer** means that operation and recovery state have actually been persisted to the owner-scoped durable outbox. **Cloud-accepted answer** means receipt of the specific operation from the authorized server; connection health or an upload being sent is insufficient. These stages alone do not manufacture a graded learning response.

A **graded response** is the assessment of a pinned item at an explicit assessment boundary. For exam, quick, focus/custom, diagnostic and weak-area practice, this boundary is session finalization. Draft edits can be saved/synced while running; one final nonblank response per item contributes once. For adaptive practice it is the explicit answer-check action; previously checked responses remain learning evidence if that adaptive session is later abandoned. Showing review or feedback is not a new attempt. An explicit retry creates a new item instance/assessment opportunity, not a new question ID.

A blank is an `unanswered` scored item in an immutable exam result. It contributes to the exam/domain denominator, but not answered interactions, raw accuracy, first/repeat, question coverage or mastery. A selection cleared before finalization produces a blank, not both a wrong and an unanswered response. A timed-out blank is not a user-submitted incorrect answer. In-progress and abandoned exam drafts remain recoverable evidence without being represented as graded responses.

A locally graded offline snapshot may be shown as **provisional, pending acceptance**. Canonical cloud totals count only accepted final responses. A local preview may include that owner's pending work only if visibly separated; it cannot masquerade as a cloud-synced count. Old `answer_recorded` rows are not automatically rewritten under this new rule; C14 governs their reconciliation.

## C03 — Identity, pinned configuration and wire fields

IDs are opaque, stable nonempty identifiers. Preserve every existing published canonical question ID. Namespacing must match the exam. Never derive identity from array position, current wording or display number. Question identity is separate from question revision, bank/blueprint membership, session ID, item-instance ID, response ID and operation ID. Option identity/order is pinned within the question revision; a legacy ordinal can be translated only with its original snapshot, never today's reordered choices.

A session captures every field in `session.snapshotRequired`; each `orderedItems` entry captures `session.itemRequired`. This includes actual set-specific `expectedLength`, bank and blueprint versions, grading/mastery/timing policy versions, site target in integer basis points or explicitly unknown, question revisions, ordered option IDs, current item, flags, selected option, timing, writer epoch, revision and learning reset epoch. Catalog references must resolve to immutable versions or preserved legacy snapshots. Revision changes must not orphan historical IDs.

IDs are strings; option order/flags/ordered items are arrays; revisions and counters are nonnegative safe integers; booleans are actual booleans. Serialised timestamps are ISO-8601 UTC instants or explicit null. The small specification model uses UTC epoch milliseconds for arithmetic, not a new deployed wire format. `siteTargetBps` is null or an integer 0–10000 (7000 means70%). Questions and options cannot repeat within their lists; adaptive may repeat a question only with a new item ID. The reviewed model validates required fields, option permutations, namespace, selection, state and timing. It is not a complete hostile-input server validator.

Substantive question corrections preserve the original result. An explicit regrade is a separately versioned result with provenance, never a silent replacement. MBB Set2/3 can legitimately pin175 while mixed/Set1 pin100; historical qualification uses that captured length, not the present generic exam length.

## C04 — First, repeat and legacy uncertainty

The default first-question key is `(ownerId, examId, questionId)` across lifetime canonical responses. Delivery, selection, review and draft changes are not responses. Exactly one response is first when complete, ordered evidence establishes it; every later response is a repeat. Retakes on another device or session do not reset this classification. Identical operation/response replay contributes zero additional interactions.

Order qualified answers by `(effectiveAnsweredAt, sessionId, itemId, responseId)` using binary lexicographic ID comparison for ties, not locale collation. Tie-breaking supplies deterministic projection order, not a claim about physically simultaneous actions. A late accepted older response may change derived first/repeat labels at a new watermark without changing immutable answers or scores. Client wall-clock time alone is not authoritative.

Lifetime-first and first-since-reset are distinct named bases. Selecting an epoch filters contributions; it does not erase a lifetime prior answer. Explicit `firstBasis:epoch` requires the epoch ID and calculates the earliest response inside that epoch. Calculate the chosen basis before date filtering.

For complete all-history, lifetime-basis evidence in one population: answered=first+repeat; first=unique answered questions. That second identity does **not** apply to a date window or a reset-filtered lifetime-first view. Generally answered=known first+known repeat+unknown first/repeat. Missing prior chronology cannot be replaced by a stored `priorAttempts=0`. A known later record can be a repeat even when the earliest surviving record is unknown. Compacted-baseline counts require stable provenance and overlap reconciliation; do not add an aggregate and the same detailed records twice. The reference model demonstrates unknown partitions, not the production legacy migration algorithm (Segment08).

First/repeat accuracy uses correct known-first/known-repeat responses over that corresponding known denominator. Publish sample sizes and unknowns. Changes in question mix make this a descriptive comparison, not a causal estimate of learning gain.

## C05 — Grading, thresholds and trends

V1 single-select grading gives each pinned item exactly one category: correct, incorrect, unanswered. All have equal score weight. Every question/domain total and correct count must reconcile to the immutable session total. Duplicate question/item IDs in a finalized full exam fail validation; malformed legacy duplicate recovery must be explicit, use a definitive final value and log the discrepancy, not inflate denominators.

Score=100*correct/total. Test the target using exact arithmetic `correct*10000 >= total*siteTargetBps`, not a rounded display percentage. Target is a **site practice target**, not the certification body's official scaled pass score. An unknown historical target remains unavailable. Score margin is exact score percentage minus pinned target percentage; histogram boundaries also use unrounded score. 115/165 remains below70% and in the60–69% bucket even when its displayed score rounds to70%.

A full-exam trend accepts only mode=exam, timed=true, completed or expired canonical sessions whose actual score length matches **their pinned expected length**. Expiry is a scored terminal outcome with its reason shown separately. Untimed simulations, quick/focused/adaptive/diagnostic practice and abandoned work never silently enter that trend. Cohorts disclose exam, set, bank/blueprint/policy version, size and timing differences. Historical targets and lengths never change when today's configuration is edited.

## C06 — Learning formulas, coverage and scheduling

Retain the Segment01-tested question mastery formula, not a tuned replacement. For n accepted nonblank responses, c correct, trailing correct streak s and valid last-answer age a in days:

`M = round(100 * (.58*c/n + .24*min(s/4,1) + .18*max(0,1-a/45)) * (.62+.38*min(n/5,1)))`, clamped0–100.

No responses contribute zero to readiness, but attempted-mastery with no attempted denominator is unavailable. Unknown last-answer time yields unavailable mastery rather than an invented age; an unknown due date is not automatically due. Invalid/future timing requires reconciliation. The preserved per-question rounding gives57,68,80,92,100 for one through five fresh correct retrievals. Do not additionally round domain means or coverage before aggregation.

Let domain weight fractions sum to1, pool size P_d, distinct answered questions A_d, coverage K_d=A_d/P_d and mean attempted-question mastery M_d. Then raw coverage=100*sum(A_d)/sum(P_d); weighted coverage=100*sum(w_d*K_d); attempted mastery=sum(w_d*M_d)/sum(w_d) over domains with attempts; readiness=sum(w_d*K_d*M_d). Unattempted domains contribute zero readiness. Readiness is generally **not attempted mastery multiplied by overall coverage**. Positive-weight domains without a valid pool, invalid mappings or missing weights are a configuration error, not a silent equal-weight fallback. Versioned equal weights would require an explicitly approved blueprint.

A question is mastered with at least3 responses and M>=80; due requires a known schedule<=evaluationAt. Mistake records count incorrect responses; questions with mistakes count unique identities and are labelled separately. Scheduling retains the baseline wrong=next day/ease-0.2 bounded1.3, correct streak1=1day, streak2=3days, later `max(4,round(max(previous interval,3)*ease))`, ease+0.05 bounded2.8; initial ease2.3. Pin scheduling policy with the mastery policy. Reset starts fresh scheduling in its new epoch. This is not official SM-2 equivalence or psychometric validation.

Study priority=w_d*(100-domain readiness), a gap-weight heuristic with deterministic blueprint-order tie breaking. It is not measured gain per hour. Radar quantities must share a meaningful scale; blueprint share is not a target mastery percentage. Coverage is not a statistical confidence interval, and readiness/mastery are not validated pass probabilities.

## C07 — Time and offline expiry

Timed mode has an unchanged authoritative deadline captured at start. It continues while hidden, screen-locked or offline, and cannot pause. Untimed mode has no deadline and may explicitly pause/resume where the existing mode UI supports it. Adaptive/review remain untimed in v1; this contract does not add unsupported controls. Full timed trend qualification never includes a pause-permitted timing policy.

Within a running client use calibrated server time plus monotonic elapsed time, not countdown callback counts or an adjustable device clock alone. After restart/handoff, fetch the authoritative deadline/current time. An offline restarted client unable to establish trustworthy elapsed time must show recovery required rather than grant extra time. Trusted resynchronization must not extend the original deadline. Exact drift/tolerance and network profiles are frozen in Segment03, not guessed from unit-test timing.

At now>=deadline, reject further canonical answer edits, freeze the expiry snapshot and finalize once. Offline expiry can produce a local provisional result awaiting server acceptance. The server validates ownership/version and the supported pre-deadline evidence protocol; unprovable timing is surfaced as conflict, not silently backdated. Acceptance after the deadline does not by itself make a demonstrably pre-deadline frozen submission late. Competing submit/expiry requests share the same terminal idempotency boundary.

Active visible question time is distinct from total session elapsed time. A visit is measured while in-progress, visible and showing that item; no claim of mental engagement or idle detection is implied. Commit the preceding visible interval **on hide**, then exclude hidden/paused time; start a new visit on return. Deduplicate visit IDs, include revisits, clip at deadline, and reject overlapping concurrent writer intervals for reconciliation. Average=sum of known active item durations/number of items with known durations, including known zeros. Unknown durations remain null and the measured-item coverage is shown. Never equate missing legacy time with zero or silently average only values>=1second. Elapsed time uses trusted start/terminal instants, subtracting only explicitly allowed untimed pauses.

## C08 — Lifecycle and finalization

The complete allowed transition table is in `session.transitions`. Created->in-progress requires a valid pinned plan and durable start operation. In-progress can pause only untimed, resume only from paused, submit into finalizing, or explicitly abandon. Deadline expiry takes precedence over a late abandon/submit. Finalizing freezes inputs, allows retries and becomes completed for accepted submitted work or expired for accepted deadline work. Completed/expired/abandoned are terminal; retry/review creates a new opportunity rather than reopening them.

No locally failed save, network timeout, upload attempt or receipt-lost retry is a successful canonical completion. A pending failure remains finalizing with an actionable sync/error state. The final server transaction commits one definitive answer list, score and terminal record; local/model idempotency tests do not prove that server guarantee. Accepted adaptive responses survive abandonment; abandoned exam drafts are not terminal scores.

## C09 — Operations, conflicts and takeover

New logical event envelopes use the required fields in `evidence.operationRequired`; receipts use `receiptRequired`. Owner and exam are always explicit. For the exam-wide learning-epoch reset, session ID, writer epoch and expected session revision are null; resetEpochId is the expected current epoch for server compare-and-swap. It is not a fabricated session. Other envelopes belong to a planned or existing session; reserve a stable planned-session ID before requesting allocation. Logical accepted/completed/reset facts require authoritative validation and cannot be trusted just because a client sent that event name. Operation ID and original payload are frozen across retry. Canonical payload normalization must cover all semantic fields, including nulls and order-significant arrays; no transient retry metadata enters that payload. The authoritative receipt records the canonical digest. Authenticate actual principal and owner/session relationship before exposing even a duplicate receipt.

Same owner+operation ID+same canonical payload returns the original receipt without reapplying or advancing revision—even after a later takeover or terminal state. Reusing the ID with another payload is a conflict. New writes require the expected session revision, current writer epoch and the reset epoch pinned to that session. Reject stale writer/revision instead of last-write-wins merging. Concurrent finalizations resolve to one accepted terminal record, not separate counts.

Takeover is explicit and atomically advances writer ownership/epoch. A second device can restore only the cloud-accepted snapshot and original deadline; never claim offline first-device drafts were transferred. A returning stale writer retains owner-scoped conflict evidence for recovery but cannot overwrite canonical answers. Old-epoch sessions may finish in their original epoch if otherwise valid; a reset does not let them write into the new epoch. Owner switching must not attach old pending evidence to the next account.

## C10 — Reservation, delivery and display

A reservation is an authoritative claim of a canonical question ID. Delivery means assignment in a committed session plan. Display means actual visible presentation. These are separate from selection and answered learning. Deployed `question_exposed` is conservatively treated as delivery/exclusion unless genuine display can be established.

Preserve the existing lifetime exclusion guarantee: New-only excludes any reserved, delivered, displayed or answered question for that owner/exam. Merely abandoning a plan or resetting adaptive mastery does not release it. There is no automatic reservation expiry or release in v1. Any later release capability needs an explicit versioned policy and concurrency proof. A valid existing same-session reservation can restore that session; it is not a fresh allocation. If authoritative allocation is unavailable, block/retry clearly rather than promise uniqueness from a stale local list. An eligibility calculation only authorizes an atomic reservation request, not a successful allocation.

## C11 — Reset, retention and privacy

Adaptive reset is an authenticated server epoch change, not evidence deletion or a client clock cutoff. Current-epoch learning/scheduling restarts; lifetime answers, completed examination scores, mistakes/history and New-only exclusions remain under their explicit scopes. Old offline work remains tied to its original owner/session/epoch and cannot resurrect cleared current-epoch projections. Reset acknowledgement, not a local label change, establishes the new epoch across devices.

Cloud canonical history is retained until explicit authorized deletion or a separately approved retention policy. Cache windows50/60/500 are not retention policies. Pending operations must not be silently truncated; disclose storage-denial/quota/eviction limitations and never promise recovery from browser data that has actually been erased. Anonymous history imports require explicit authorization and stable idempotent import identity. Account deletion is a distinct authenticated/tombstoned workflow, tested for offline resurrection and reflected in exports; “immutable evidence” is not an excuse to ignore it. Legal retention compliance is not certified by this technical contract.

## C12 — Truthful sync

A network connection alone is not synced. `synced_as_of` requires correct owner, receipts for all relevant submitted operations, complete paginated catch-up through a declared server commit watermark and no unresolved conflict/error. Pending, syncing, offline, conflict and error remain distinct. A receipt says the server accepted one operation; it does not prove another device has received it. Stable server sequence/watermark must support incremental catch-up and late-arriving older answers; client occurrence time is not a safe synchronization cursor.

Preserve the existing incremental/reservation work. Do not put a full-ledger download into Start, poll complete history merely to refresh a badge, or reload the page to reconcile data. Exact convergence budgets are a Segment03 profile gate.

## C13 — Activity, dates, history and exports

Persist UTC instants and an account-saved IANA reporting timezone. When none has been selected, use and label UTC; do not infer a different default on each device. Freeze the selected reporting timezone per report/export; changing it re-bins activity without changing events or lifetime totals. Enumerate calendar dates rather than subtracting fixed24hour intervals from local midnight.

For core finalization, activity uses the qualified time of the final nonblank selection, preserved through its draft operation; it does not use the later session completion/upload time. For adaptive practice, use the explicit check time. Keep client occurrence, calibrated effective answer, receive and accept times separate, with time-quality metadata. Legacy observed timestamps retain their provenance; missing or untrustworthy answer dates are an undated bucket, not invented completion dates. Exports disclose both unknown date counts and the applied watermark.

History is paginated independently of display/cache lists. Distinguish full-exam trend from short/mixed practice history, show size/timing/versions, and expose completion reason. `completed_sessions` includes accepted submitted+expired sessions with both reason subtotals; it excludes abandoned/finalizing drafts. Export exact counts, pinned configuration, scopes, quality flags and canonical IDs; authorization and private fields are checked separately in Segment18.

## C14 — Compatibility and adoption boundary

Logical names in this contract are **not** new permitted values in the current five-value SQL event enum. No new envelope is sent to production in Segment02. Use versioned adapters and additive migrations in the owning later segments. Unsupported major versions fail visibly; unknown minor versions require a registered compatible reader. Extra diagnostic fields must not silently redefine semantics; preserve them with source provenance or reject at the command boundary.

Legacy mapping rules in `contract.json` retain original evidence. Never rewrite `question_exposed` into actual display, infer every `answer_recorded` edit is a retrieval, substitute today's length/target/revision for unknown history, or throw away retired IDs. A future schema/algorithm change requires a new version, written impact decision, compatibility/recovery plan and reopening dependent checks. Existing files and baseline fingerprints remain the historical observation record, not target contract acceptance.

Adoption order:04 identity,05 catalog versions,06 local capture,07 server acceptance,08 deterministic reconciliation,09 grading,10 learning projections,11 history,12 lifecycle,13 timing,14 sync,15 handoff,16 allocation,17 labels/accessibility,18 security/retention. Until its adopting segment passes, the register's product defect remains open. Modules must consume the same policy version and publish the same envelope once adopted; they cannot fork formulas or reinterpret fields privately. Segment03 installs broader runtime/database/browser conformance gates against these expectations.

## C15 — Frozen release rubric and review

The seven weights remain20/10/15/15/15/10/15, total100. Twenty named5-point criteria require actual linked evidence, the exact verified commit and the appropriate environment. Physical-device and production-only criteria cannot be satisfied by emulation or a preview build. No automatic points are awarded for this contract, CI success, code volume or segment completion.

Any unresolved confirmed in-scope defect, acknowledged evidence loss, duplicate terminal result, cross-account exposure, unexplained reconciliation, missing required physical-device/authorization evidence, unsupported pass-probability claim, unverified compatibility or unresolved security release risk blocks10/10 even with100 claimed points. Evidence content requires independent review; the specification's scorer checks shape/completeness, not the truth of an arbitrary proof string.

User authorization to implement/push Segment02 on PR172 permits stacking it after Segment01 without waiting for a separate merge. It does not retrospectively mark Segment01 merged, grant human approval of all newly chosen policies, authorize later segments or deploy product changes. Those states remain separately recorded in the segment report and PR.
