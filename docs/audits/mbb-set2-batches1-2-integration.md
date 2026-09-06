# PR 165 — Set 2, Batches 1 and 2 integration

Date: 2026-09-05. Scope: add the existing Batch 1 audit corrections (Q001–025) to the existing Batch 2 PR (Q026–050), without merging to main. This note supersedes the older reports' branch-scope statements that the other batch is excluded/not started; the original question-level reports are retained as historical audit evidence, not rewritten into new unconditional approvals.

## Exact sources and preservation

- Batch 1 source: `e88f28d29b3c8d16f53420cf23703761e275da9a` on `audit/mbb-set2-batch01`.
- Batch 2 source / previous PR head: `dc4e1588900647aab46d694c0caa17f2165e9efb`.
- Integrated application commit: `d7ada45711ba11ac9e589b3a4febd6d7878ef56d`.
- Deep equality verified: all 25 Batch 1 runtime question records match the committed Batch 1 source; all 150 remaining runtime question records match the previous PR head. Total remains 175, with unchanged IDs and answer positions. Questions 51–175 are unchanged from main.
- Batch 1 has 19 changed records relative to main: 001, 002, 005, 006, 009, 011, 012, 013, 014, 015, 016, 018, 019, 020, 021, 022, 023, 024, 025. This includes validation metadata-only changes and is based on the committed source, not the older 17-record candidate report.
- All 14 Batch 2 corrected records are retained: 026, 027, 028, 029, 031, 034, 036, 038, 040, 044, 045, 046, 048, 049.

## Integration changes

Added the Batch 1 question/explanation/context corrections, dedicated review JavaScript/CSS, deeper distractor explanations, tests, calculation records, duplicate check, solutions, trackers and report. The shared player and feedback/retry paths dispatch each batch to its own scoped renderer. The shared asset builder supports both batches; regeneration leaves all four Batch 2 generated packages byte-identical to the previous PR. The 20 added/updated Batch 1 integration files matched the locally tested SHA256 manifest on GitHub Actions. No encoded staging files, one-off assembly scripts or temporary workflows were added to this PR. No database, account, attempt-history or dependency changes were made.

## Checks performed on the combined application source

- Local targeted MBB and feedback regressions: **133 tests passed; 0 failed, cancelled or skipped**.
- GitHub Actions repeated the same **133/133 pass** after exact-file verification and regeneration of both batches. Run: https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/33985627978 . Artifact: https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/33985627978/artifacts/9975083232 .
- Command: `node --test --test-concurrency=1 tests/*mbb*.test.js tests/*feedback*.test.js`. This is a targeted suite, not a full-repository clearance.
- New combined Chromium integration run: **2,259 assertions passed; 318 question/layout records; zero JavaScript errors**. Desktop 1440x1000, tablet 768x1024, mobile 390x844.
- Each layout traversed all 50 questions, exercised all four choices, toggled flags, checked answer retention across Q25/Q26, submitted the independent audit keys, scored **50/50**, and reopened all 50 review cards. This accounts for 150 attempt and 150 review records.
- The remaining 18 records cover checked retries of Q5, Q20, Q23, Q31, Q36 and Q49 across the three layouts, including both capacity controls, Batch 1 focus readouts and Batch 2 observation selectors. All checked retry answers were accepted. No page overflow was detected in the tested states.
- Both actual feedback modules were loaded during this combined test. Batch 1's three stored distractor rationales and Batch 2's four option rationales were verified in review. No explanation/answer-review block appeared before submission.
- Representative integration screenshots were visually inspected; this integration run is not a new independent technical re-audit of all 50 items. The original question-level audit evidence remains in the two batch reports/trackers.

The accompanying integration evidence ZIP contains the browser runner, raw browser JSON, captured screens, local log, GitHub verification log, source-preservation result and file hashes. The standalone browser runner uses explicit offline fixtures; its 50-item slice exists only in the test process and does not change the published 175-question bank.

## Remaining release limits

The original Batch 1 source-range closure remains outstanding, particularly the full inherited Kubiak 408–414 / Advanced-source passages for Q025. Adding the corrections does not certify those passages as newly verified. Live authenticated login, durable cloud saves, cross-device synchronization and physical iPhone Safari are not established by offline Chromium tests. Human review and post-deployment smoke testing remain required; no production deployment or main-branch merge was performed.

Integration inspection also observed an existing automatic-summary limitation: the generic `extractKeyPoint` sentence splitter can truncate decimals in the generated Key learning point (for example Q5's `$1.9M`), although the full stored answer explanation remains intact. This is not introduced by combining the batches and is not covered by the passing assertions; it remains a student-facing review concern, not a reason to claim unconditional visual sign-off.

Unchanged dependency advisories and empirical psychometric limitations documented in the individual reports remain applicable. Neither this integration nor the targeted passing tests approve the entire 175-question bank. Batch 3 has not been started by this integration.
