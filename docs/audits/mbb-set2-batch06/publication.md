# Batch 6 publication — PR #165 now includes Batches 1–6

**Batch 6 (Questions 126–150) is committed to the existing PR #165.** The PR now includes Batches 1–6, Questions 1–150 of ASQ Master Black Belt Simulation Exam — Set 2. No merge to main, automatic merge, production deployment or learner-history rewrite was performed. Human review and live acceptance remain required. Batch 7 has not started.

## Exact candidate and scope

Previous PR head: `25d47ccfd57b6b4ae49c322650148fac5008caad`.
Batch 6 application commit: `c2686526b7c087c3dd083f3646048857265114a9`.
PR head branch: `audit/mbb-set2-batch02`, advanced without force-pushing.

All **26 source/test/asset/audit files match the locally tested candidate byte-for-byte**. This publication note is one additional documentation-only file. Temporary transport files and the helper workflow are excluded from the application's ancestry and final PR diff.

All 25 Batch 6 question records were corrected, including editorial/source/context changes. Stable IDs remain `mbb:set-2:original-126` through `150`. **Q150 is rekeyed from B to D (index 1 to 3)**; the original key contradicted its own explanation. The remaining 174 answer indices and all 150 records outside this batch are preserved. All 24 non-Batch-6 generated asset files remain byte-identical after complete regeneration. The pool remains 175 questions; Q151–175 are unchanged and unaudited in this batch.

The Batch 7 regression file changes only its global 175-question key-distribution assertion, to accommodate Q150. This is not an audit or edit of any Batch 7 question. Earlier preservation tests verify the new pinned Batch 6 hashes rather than skipping the range.

## Remote verification completed

[GitHub verification run](https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/34008795388)

[Verification artifact, 14-day retention](https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/34008795388/artifacts/9981823308)

GitHub checked the exact baseline and compressed/decoded payload, reconstructed the candidate, installed locked dependencies, regenerated all seven visual packages and verified **26/26 SHA-256 file matches**. It independently confirmed exactly 25 changed question records and the sole answer-index change, Q150. It then passed **317/317 targeted MBB and feedback tests**, with zero failures, cancellations or skips, before committing the candidate to a clean review branch. The downloaded artifact was reconciled against every local candidate-file hash and the resulting commit.

Command: `node --test --test-concurrency=1 tests/*mbb*.test.js tests/*feedback*.test.js`

The same 317 tests passed locally, including 49 new Batch 6 checks. A fresh local baseline replay and `git diff --check` passed. This is targeted validation, not a claim that the separate full-repository PR CI has passed.

## Rendered candidate evidence

| Run | Assertions passed | Traversed states | JavaScript errors |
|---|---:|---:|---:|
| Batch 6 exam/review/retry | 1,395 | 162 | 0 |
| Batch 6 dark/narrow/static fallbacks | 939 | 154 | 0 |
| Combined Batches 1–6 | 3,561 | 918 | 0 |

The completed local actual-player runs exercised all 25 Batch 6 questions and reviews, all four choices, flags, navigation retention, calculator/formula controls and three interactive retries on desktop, tablet and mobile. Each full batch scored 25/25. Separate Q150 retry states explicitly reject the old B and accept D in all three layouts.

The combined run traversed all Q1–150 and every review in all three layouts, scored the independently adjudicated audit keys **150/150**, checked cross-batch retention and exercised a mixed retry queue. Supplemental testing includes 54 static visual/theme/width combinations, 50 dark-mobile and 50 narrow-320px attempt/review states. Every final desktop/mobile Batch 6 question pair and every final desktop answer review was visually inspected individually; supplemental state counts are not claims of individual manual screenshot inspection.

Raw browser results and source hashes were reverified for publication. No additional browser execution on GitHub is claimed. The final non-rendered visual specification's six-decimal kappa annotation was corrected to 0.383097 before packaging; browser-loaded JS/HTML remained identical and all 317 targeted tests were rerun afterward, as documented in `browser-summary.json`.

## Remaining limits

Offline authentication and in-memory storage do not establish live login, durable cloud writes, cross-device synchronization or physical iPhone Safari behavior. Source verification is bounded in the tracker; not every page of every inherited range is certified. Earlier source-closure concerns and Batch 3 recovery provenance remain applicable. Q131/Q142 replacements are explicitly audit-authored scenarios.

Historical learner answers and stored attempt scores are not rewritten or automatically re-equated. Any historical-score remediation for Q150 requires a separate reviewed policy. No empirical item difficulty, discrimination, DIF or exam-reliability calibration is inferred without learner-response data.

Locked dependency installation again reported **11 advisories (6 moderate, 4 high, 1 critical)** in the unchanged dependency tree. No dependency upgrade or security clearance is part of this audit. The full 175-question bank is not approved by this partial audit.

Historical reports are retained as evidence. Their older statements about unstarted later batches are superseded only by actual commits and publication notes, not by broader source-verification claims. **Human review and merge only; Batch 7 has not begun.**
