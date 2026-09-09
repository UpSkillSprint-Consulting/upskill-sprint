# Segment 09 — canonical scoring, original domains and site practice targets

## Scope and entry state

Implemented for review on a **new** PR from merged Segments 01–08 at `a1a844562e0313dff9a467876cab344db35dad6f`. The execution branch is `fix/segment-09-canonical-grading`. Exact head, tested merge revision and passing/failing job conclusions belong in the PR evidence record, not a self-referential assertion in source.

This is the approved Segment 09 and the runtime adoption of contract C05. It does not implement Segment 10's mastery/readiness redesign, Segment 11's timezone/pagination work, Segment 12/13's session/timer repairs, or active-device takeover. No automatic merge or production changes are authorized. PR #175's production-deployment records and migration renames remain separate; this PR introduces no SQL migration or dependency upgrade and does not overwrite them.

## Findings and changes

The Segment 05 pinned grader already computed original keys, exact counts and the unrounded practice target correctly. Its wire format and grading-policy version are retained. The remaining defects were in consumers: the result page displayed cumulative domain ratios as if they were current-exam fractions, charts rounded before binning/comparison, legacy history substituted current configuration, and some adaptive/review paths repeated the scoring policy.

`test-bank-versioning.js` now exposes the shared, independently tested `classify`, `aggregateStatuses`, `scoreRecords`, `scoreCounts`, `assessAttempt`, `scoreBucket` and `formatScore` operations. The existing `grade` delegates to these operations while preserving the immutable original-result fields and published catalog/configuration hashes. The database's separate grader remains an independent validator of the same policy, not JavaScript evaluated inside SQL.

- **Counts:** every presented item is correct, incorrect or unanswered exactly once. Blanks stay in the exam and domain denominator without becoming answered learning interactions. Count/target inputs are validated rather than clamped or coerced. Zero/unknown denominators are unavailable. Draft changes/clears do not create additional scored responses.
- **Practice target:** `correct * 10000 >= total * targetBps` is compared with exact integer arithmetic. Display formatting never decides the verdict, score band or margin. A known zero target is not mistaken for an absent target. Unknown historical targets stay unknown. `115/165` displays approximately `69.7%`, remains below a 70% site target, has a negative margin, and stays in the `60–<70%` band even where a chart's compact label rounds to 70.
- **Result page:** session score, exact correct/total, incorrect/unanswered counts and the saved site-target verdict are explicitly distinct from readiness. The score breakdown uses the actual session aggregate, not `cumAggFrom()`'s ratios. A real `1/2` is displayed as `1/2`, not `0.5/1`. The cumulative study plan is retained separately; its wording no longer suggests an official grading cutoff. The page states that the site practice target is not an official certification pass/fail result and that cloud acceptance is reported separately.
- **Review/adaptive:** new single-select decisions and result counters delegate to the shared policy. Pinned questions, original option order and stored original grades remain authoritative. Read-only review does not manufacture another learning attempt; terminal retries retain the original grade.
- **Historical scores:** eligible full-exam trends use the saved mode, timing and set-specific expected length, not current `exam.questions` or `exam.pass`. Valid MBB Set 2/3 records with 175 pinned items remain eligible. Untimed, quick/focused/adaptive, unfinished and abandoned work does not become a completed timed exam. Expired finalized exams retain their terminal reason. Conflicting or malformed grade evidence is withheld with a diagnostic, not silently regraded.
- **Legacy boundary:** a legacy result with known correct/total retains its score. With no captured original length/target it is shown separately, explicitly unverified for full-exam qualification and target comparison. No target or original format is invented, and no history is deleted to achieve agreement.
- **Domains:** canonical completion groups must reconcile to the original total/correct count. Versioned duplicate item IDs are invalid; a valid immutable grade or complete persisted breakdown can supply the fallback. Partial mastery history is not substituted for a complete exam denominator. Original matching configuration/saved labels are retained; unavailable historical labels fall back to their IDs rather than today's reclassification.

The analytics screen is a **saved local history projection**, which can include pending own-device results. Its text does not claim every displayed row is cloud-accepted. The underlying receipt/finalization protocol from Segment 07 is unchanged. A complete cross-device acceptance-status UX remains Segment 14; this segment does not infer a server acknowledgement from connection health.

## Evidence and test design

`tests/test-bank-segment09-grading.test.js` adopts the frozen C05 hand-worked examples against runtime code, without importing the specification model. It exhausts all correct-count outcomes for lengths 100, 110, 150, 160, 165 and 175 against seven target states (including zero, 70%, 100% and unknown), checks exact histogram boundaries and safe-integer arithmetic, and validates malformed, empty, partial and abandoned inputs.

All **12 published sets across all five certifications** are pinned and graded with independently counted correct/incorrect/blank patterns. The runtime result, domain/subtopic sums and full-exam qualification must agree. Actual JSDOM core flows exercise quick, focused, diagnostic, weak-area practice and exam mode for every certification, comparing visible fractions, original grade, feedback review and persisted history. Additional tests cover clearing a saved draft, immutable retry, incomplete domain evidence, duplicate completion identities, unknown legacy provenance and changes to today's target/length/taxonomy.

The existing four-profile browser runner adds score-card, practice-target disclaimer, exact fraction, blank, review and history assertions to its preserved Chromium/Firefox/WebKit phone/tablet interactions. The existing disposable PostgreSQL runner adds full published-set RPC finalizations, independent stored-grade checks, exact edge scores, unknown target and idempotent replay. No earlier authorization, identity, versioning, durability, reconciliation or browser assertions are removed.

Old manual-JSDOM/sandbox fixtures now load the same versioning prerequisite as production. Several previous analytics/domain tests supplied a two-question sample while declaring a 165-question complete examination, or assumed an invented current target for unversioned history. Their fixtures now explicitly capture complete synthetic original policies; all prior substantive assertions for identity, blanks, taxonomy and compaction remain, with dedicated tests ensuring incomplete/unknown legacy evidence is not relabelled as complete. Baseline observations remain observations; their existing preservation assertions are unchanged.

The new `Exam canonical grading` workflow runs on every PR, checks catalog drift, executes the Segment 09 and prior foundational regressions, and preserves logs. The full repository suite, cumulative seven-lane framework, SQL role tests and full student audit remain required. Exact final counts are recorded only after actual execution.

## Deployment and recovery

No new migration, catalog publication, question-content revision or browser dependency is required. After human review/merge, deploy the reviewed client bundle as a unit. Existing versioning/catalog/ingestion prerequisites from Segments 05/07 must remain installed. PR #175 records their separate production rollout; do not replay DDL merely because a filename differs between the branches.

Rollback is a client rollback, retaining all accepted learner evidence and immutable catalogs/results. The original grade wire schema has not changed. No learner-history reset, destructive backfill or automatic regrade is included. Uncertain older results remain available under explicit evidence limitations rather than having their original score overwritten.

## Remaining boundaries

Physical iPhone/iPad acceptance, live browser JWT/Data API transport, live schema parity, production observation, extensive accessibility/visual certification and WAN/stress performance are not established by local/browser emulation or disposable SQL tests. Dependency advisories remain open. This segment does not award a 10/10 platform rating or start Segment 10.

## Finding traceability

| Register finding | Segment 09 disposition |
|---|---|
| G05 — rounded margins/current-policy reinterpretation | Exact count arithmetic is shared; pinned targets remain unchanged; absent targets are disclosed, not substituted. |
| G06 — duplicate completion/domain denominator | Versioned duplicates are rejected; complete original grade fallback is allowed. Partial/invalid legacy breakdowns cannot masquerade as full denominators. |
| G11 — MBB 175-item full histories hidden by generic 100 length | Eligibility uses each saved set-specific length, with all 12 published sets covered. |
| G12 — cumulative proportion shown as a current-exam fraction | Current session counts drive the result breakdown; cumulative learning remains separate. |
| Preserved P01–P07 and Segments 04–08 | Inventory/catalog hashes, original grading wire fields, durable drafts, receipt protocol and answer-reconciliation semantics remain protected by their cumulative tests. |

Unverified production evidence and later-segment defects are not closed by this document. The separate PR #175 deployment register updates are not duplicated here.

## Final review safeguards

Historical assessment also checks supplied session/result identity, optional pin digest and the analytics certification scope. A completed flag cannot override created, cancelled, paused, abandoned or finalizing state. These checks withhold inconsistent derived history without changing original ledger evidence or the grading wire schema.

The Firefox trace from framework run 34289938696 recorded a twenty-item plan in a test that requested ten, before any score assertion. The browser fixture now waits for both actual startup hydration promises and enhancement frames, verifies the selected count, and checks the ten-item plan before answering. It retains the original result, blank, history and synchronization assertions and does not retry a missed click. This is an explicit test setup prerequisite, not a claim that all early-hydration user interactions or physical-device behavior have been qualified.

Grading CI retains the exact tested commit/tree, file fingerprints, scoped source archive and logs. Source fingerprints make later continuation independent of a stale local checkout. No credentials, production learner data or font files are added to the review evidence.
