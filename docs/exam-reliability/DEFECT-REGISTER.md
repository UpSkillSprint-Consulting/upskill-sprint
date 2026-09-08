# Exam reliability — defect and verification register

Baseline: `990e385350ae63d76cfc1e3940c3644859cc636a`, 2026-09-07. None of these product issues is repaired by PR #172. `G` IDs map to emitted executable probes; `R` entries map to source/schema/UI inspection or an explicit future verification procedure. Severity is engineering triage, not a measured failure rate. High means history, timing or metric integrity; Medium means interpretation/recoverability; Low means presentation/maintenance. Security advisory severity is separately supplied by the dependency report.

## Executable observations

| ID | Disposition / severity | Evidence and exact reproduction | Repair owner and closing gate |
|---|---|---|---|
| G01 | Confirmed classification defect / High | `improvement()` counts each `priorAttempts=0`. Two records for one canonical Q produce first=2/repeat=0. A persisted screenshot-matching snapshot has 30 states with 36 excess first labels. | 02, 08, 10: one first per scoped canonical history; provenance-aware unknowns; no evidence reset. |
| G02 | Confirmed scope/evidence mismatch / Medium | Improvement iterates all stored question keys and detailed history, unlike current-bank readiness, and does not account for compacted baseline evidence. Fixture includes a retired key and compacted attempt. | 08, 10, 11: named common scopes; complete or explicitly unknown first/repeat accounting. |
| G03 | Confirmed hidden reconciliation disagreement / High | `learningSummary()` receives derived=2, ledger=9, displays 9 without a discrepancy field. | 08, 10, 14: canonical projection plus observable disagreement, not unexplained max. |
| G04 | Confirmed local-date defect / Medium | Regina 2026-09-07 23:30 is placed under UTC 2026-09-08. `studyHeatmap()` mixes UTC keys and local grid construction. | 02, 11: consistent selected reporting timezone and answer-date boundaries. |
| G05 | Confirmed chart rounding/version defect / Medium | 115/165=69.6969%, chart margin=0 at target70; changing target80 changes old margin; changing configured length hides old attempt. No core false-pass claim. | 05, 09, 11: unrounded comparisons, pinned attempt policy, stable historical interpretation. |
| G06 | Confirmed malformed-payload recovery defect / Medium | Same Q appears correct then incorrect in a completion. `completionDomainBreakdown()` intends last-value dedupe but returns total2/correct1, not total1/correct0. Current bank has no duplicate IDs. | 07–09: validate/dedupe canonical payload; fix aggregate reference update; retain definitive final answer. |
| G07 | Confirmed cache/handoff limitation / High | Merge two snapshots each containing 75 attempts: mastery list becomes60, legacy history50. `tb-adaptive-session-v2` excluded from payload. Cloud deletion is not established. | 11, 12, 14, 15: complete paginated history and explicit resumable-session path; preserve valid cache bounds separately. |
| G08 | Confirmed storage-denial failure / Medium | Throw from localStorage.getItem; analytics `readStore()` calls it outside try, so sessionTrend throws. | 06, 10, 17: safe failure UI and recovery, no false empty/healthy state. |
| G09 | Confirmed future-import hazard / Medium | Two distinct question objects share an ID; registry warns and registers only one. No current inventory collision. | 04: reject invalid import visibly/atomically without renumbering valid IDs. |
| G10 | Confirmed core recovery/clock limitations / High | Move clock back120s in a60s exam =>180s left. After Segment 06, reload preserves the unsubmitted choice as a durable draft (not a scored answer), but the core active session UI is still null. | 12, 13, 15: stable policy/deadline authority, safe restore/takeover and stale-writer rules. |
| G11 | Confirmed MBB history-filter defect / High | Core Set3 target=175; insert completed/timed/exam175 summary; examAttemptSeries returns no attempt because generic MBB length=100. Set2 uses the same175 override. | 05, 09, 11: accept pinned set-specific length; preserve mixed100 and legitimate175 sessions. |
| G12 | Confirmed misleading score fraction/scope / Medium | Submit1 correct+1 blank in p1; actual aggregate1/2 but result breakdown reads50% (0.5/1) from retained latest-domain proportions. Other retained domains can be from previous attempts. | 09, 10, 17: exact current-exam counts and separately labelled learning-history proportions. |
| G13 | Not reproduced in selected DST fixture / Verification | New York seven-day grid ending2026-11-03 has seven expected distinct UTC keys. This does not negate G04 or certify all timezones/DST transitions. | 03, 11, 19: add timezone/calendar boundary matrix; do not claim duplicate-day defect from this result. |
| G14 | Confirmed per-question timing defect / High | In phase2 hardening and runtime coordinator, seed10s visible work, set document.hidden=true, invoke visibility-handler commit path =>0ms saved. Commit rejects hidden before saving preceding interval. | 12, 13: commit visible visit on hide, exclude background, unify owner/persisted timing, test revisits/average denominator. |

## Additional audit coverage and verification assignments

| ID | Disposition | Basis / next verification | Owner and closing gate |
|---|---|---|---|
| R01 | Confirmed label mismatch / Medium | Hardening summary coverage is blueprint-weighted; reliability panel calls it answered-pool coverage. Fixture proves80% weighted vs50% raw. | 02, 10, 17: separate labels, denominators and export fields. |
| R02 | Confirmed ordering defect / Low | Full CSSBB inventory's configured order and screenshot place IX DFSS before VIII Control. | 17: approved domain order everywhere without changing IDs. |
| R03 | UX interpretation risk / Medium | Radar compares domain blueprint share with learning readiness; share is not a mastery target. | 10, 17: comparable scales/explicit semantics and accessible alternatives. |
| R04 | Confirmed unsupported wording / Medium | Leverage=weight*(100-readiness); explanation implies benefit per study hour although model contains no learning-rate/time estimate. | 10, 17: honest priority label or validated additional model. |
| R05 | Confirmed activity-definition mismatch / Medium | Heatmap counts session-summary answers on completion date, not individual response dates. Session trend mixes modes and sizes. | 02, 11: answer-date activity; distinguish trend types and session sample sizes. |
| R06 | Required interpretation contract | 55% estimated mastery,92% first accuracy,34% readiness and zero mastered can coexist under the current heuristic. This is not a pass probability or evidence of a broken score formula. | 02, 10, 17: retain sound behavior; disclose estimate/coverage/minimum-repeat rules; do not tune to inflate scores. |
| R07 | Version/validation hardening risk / High | Question IDs are text in events with no catalog FK; question snapshots help but do not constitute a complete versioned bank/grading/session contract. | 04, 05, 07: compatible catalog/API validation, retired aliases, versioned historical decisions. |
| R08 | Server concurrency implementation complete; production verification pending / High | Segment 07 adds canonical payload receipts, row-locked session revisions, conflicting-operation rejection, and concurrent-finalization database tests. Two same-payload finalizers converge on one completion/result; conflicting payloads fail atomically. Live Supabase parity and later takeover epochs remain unverified. | 07 implemented; retain 15 and 19 for takeover and production qualification. |
| R09 | Unverified authorization/reset acceptance / High | RLS and own-user grants/policies inspected; service-role metadata reads do not test actual anonymous/other-user/stale-offline clients. | 03, 18, 19: prove denial/isolation, original outbox ownership and no reset resurrection. |
| R10 | Unverified physical-device acceptance / High | JSDOM/VM evidence is not iPhone/iPad/laptop takeover, suspension, eviction or private-mode acceptance. | 03, 12–15, 19: witnessed/device-capable matrix with explicit offline limits. |
| R11 | Sync/performance verification / High | Incremental learning synchronization, bounded requests and reservation RPC already exist. Account polling is60s. Do not reintroduce Start-path full refresh or assume every connection indicator means caught up. | 03, 14, 16, 19: frozen latency/resource budgets, cursor safety, New-only concurrent/exhausted/offline tests, meaningful synced-as-of state. |
| R12 | Migration traceability risk / Medium |12 installed migration entries vs7 repository migration files; some names/timestamps differ. Different names alone do not prove semantic drift. | 03, 05, 19: compare actual definitions/effects, version lineage and reproducible recovery. |
| R13 | Confirmed redundant index / Low | Two event indexes both cover(user_id,occurred_at,event_id) under different names. | 14, 19: validate plan/dependency impact before removing redundancy through reviewed migration. |
| R14 | Confirmed dependency advisories / Triage required | Captured npm audit:11 packages,1 critical/4 high/6 moderate. Direct jspdf(dev) and @netlify/blobs(prod) included; exploitability not established. No dependency updates in01. | Early02/03 triage;18 closure: installed reachability, compatible upgrade, cumulative regressions and release risk resolution. |
| R15 | Unverified full visual/accessibility acceptance / Medium | Supplied screenshots establish labels/order; no new physical theme/reflow/assistive-device sign-off. Preserve earlier approved chart/print fixes. | 17, 19: responsive/theme/reflow/keyboard/screen-reader/manual acceptance with evidence. |
| R16 | Unverified complete history/export guarantee / High | Local lists are capped at several layers; detailed mistakes/compacted baselines and cloud events are different records. A short UI list is not a lifetime archive. | 08, 11, 18, 19: paginate and reconcile authorized exports; disclose legacy unknowns; prove recovery/reset semantics. |
| R17 | Official configuration provenance unresolved | All configured site targets are70; exam/set length and blueprint values captured, not certified against current official sources in01. MBB Set3 explicitly discloses a practice-bank format. | 02, 05, 09: verify official provenance separately from site practice targets and non-official set formats. |
| R18 | Multiple timing owners / Integration risk | Deep-feedback, phase2-hardening and runtime-coordinator maintain separate maps and can update time labels. Runtime averages values>=1s; hardening persists its own times. G14 isolates a confirmed failure, not every visible overwrite. | 12, 13, 19: one specified active-time policy, stable identity, revisits/background and persisted/rendered agreement. |

## Sound behavior to preserve

| ID | Verified/intended behavior | Evidence and future protection |
|---|---|---|
| P01 | Stable published IDs | Full3189 inventory plus existing insertion/identity tests. Preserve under04/05. |
| P02 | Confidence-discounted mastery | Fresh1..5 correct returns57,68,80,92,100; zero mastered after one retrieval is intentional. Freeze versioned interpretation in02/10. |
| P03 | Weighted coverage/readiness | Synthetic80/20 blueprint with one of two questions answered gives80weighted coverage,50raw,46readiness. Do not equate rounded summary products with exact domain calculation. |
| P04 | Blanks and local idempotency | One correct+one blank is1/2 scored but one answered mastery item; retry same completion does not double project. Retain09/07 regressions. |
| P05 | Deadline catch-up |60s timer after45s clock advance shows15s; expiry and repeat submission produce one local completion. Fix clock authority without reverting to callback counting. |
| P06 | Durable evidence vs session restoration | Recorded answer survives same-account storage reload while core session does not. Repair resume without claiming the ledger lost that answer. |
| P07 | Reservation is not an answer | Planned delivery intentionally protects New-only and does not increase answered readiness; distinguish reservation/display/answer terms in02/10/16. |

## Segment 01 gate and future updates

Every concern in the preceding audit is mapped above. Only baseline/evidence infrastructure is delivered now. A later segment closes an entry only with its desired-behavior regression, relevant cross-device/security acceptance, reviewer decision and deployed verification where required. Reopen affected entries when contracts change; never delete inconvenient history or relabel a risk as fixed because a harness passes.


## Segment 04 disposition update (historical baseline above retained)

- **G09:** implemented for review in PR #173. Whole-bank validation rejects duplicate/malformed candidates atomically; no partial pool is exposed; the previous accepted bank and learner evidence survive rejected imports. New desired-behavior tests and all-profile browser rejection checks are required before approval. Production closure awaits human merge/deploy verification.
- **P01:** all 3,189 published identities/domain mappings preserved; sorted-ID digests, all-bank reorder/wording tests, namespaces and membership checks added. No renumbering or question content edits.
- **R07:** client identity/membership boundary improved only. Versioned catalog, database references, retirement aliases and historical grading remain Segments 05/07. No other finding is closed by this work.

See [Segment 04 implementation and limits](SEGMENT-04-IDENTITY.md). Segments 01–03 were human-merged in PR #172; their original evidence is not rewritten.

## Segment 05 disposition update (prior observations retained)

- **G05/G11:** new versioned attempts use original target and set-specific expected length; original unrounded comparisons are persisted. Legacy unknown policies are not fabricated; full legacy reconciliation/visual grading adoption remain 08/09/11.
- **R07/P01:** immutable content/config/bank/blueprint catalogs, explicit retirement aliases, ownership/FKs and separate privileged regrades are implemented for review. Original 3,189 IDs/content are unchanged. Mandatory ingestion protocol, receipts and writer epochs remain 07.
- **S04-B01:** still open. Original failed WebKit-mobile full-student check and cancelled Batch 3 job remain recorded in PR #173. New versioning acceptance does not diagnose that failure.

No production closure is asserted. See [Segment 05](SEGMENT-05-VERSIONS.md).


## PR173 WebKit stability follow-up (historical failures retained)

- **S04-B01:** the answer DOM replacement and queued focus-stealing regressions are reproduced on the Segment 05 parent and corrected by `b03ebcd`. The exact historical missing pointer event is not retrospectively explained.
- **Full-review stall:** the old run reached 175 questions/139 reviews without bounded internal operation evidence. Same-document axe execution retains the engine/rules with pre/post no-frame guards and equivalence checks. Independent process supervision now bounds even blocked-event-loop/teardown stalls and preserves the last operation.
- **Acceptance:** all original profiles plus an independent second WebKit-mobile full session, both edge profiles, unchanged focus/save assertions and the new fail-closed evidence gate must pass on the candidate revision. The new gate rejects missing, stale, shortened, failed, cancelled and skipped evidence. A previous failed/cancelled run is not changed to passing.

See [WebKit review stability](WEBKIT-REVIEW-STABILITY.md). Current execution results are in PR #173; production/device closure and later roadmap defects remain separate.

The related older Batch 4 WebKit-mobile cancellation on b03 (run
34225393136, job 102058141685) is retained as historical evidence. All seven
batch audit drivers now share the bounded scanner, locked tools and external
watchdog. Completion requires fresh passing browser results, not relabelling
that cancelled report. See WEBKIT-REVIEW-STABILITY.md for artifact provenance.
