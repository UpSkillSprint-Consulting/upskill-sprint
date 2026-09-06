# PR #165 — Batch 3 restoration and Batches 1–4 integration

**Status: recovered corrections integrated and passed the recorded offline candidate checks. Human review and production acceptance remain separate.**

Baseline: PR #165 at `8bb8a4818a1f9f8d49d26ead5f04dc3f53c05185`. The integration adds Set 2 Questions 51–75 to the existing Batches 1, 2 and 4. It neither changes main nor authorizes an automatic merge or production deployment. Questions 101–175 are outside the audit scope.

## Recovery provenance

The surviving Batch 3 GitHub branch contained only a source snapshot, not its previously reported corrections. The saved final desktop/mobile question images were inspected for all 25 items. Visible corrections were restored from those images; missing nonvisual rationales and the scoped renderer were reconstructed and independently checked. This is **not** claimed to be a byte-for-byte recovery of the lost candidate or its unverified test outputs. This directory records the newly reconstructed, tested source. Each tracker entry retains the saved final-image SHA-256 and before/after question hashes.

Original source locators are retained, not newly certified against every inherited textbook page. Added/reconstructed assumptions and explanations are identified as audit analysis. Q72 uses an explicitly authored synthetic balanced experiment, not recovered textbook raw data.

## Question scope

**17 changed records:** Q51, Q52, Q53, Q56, Q59, Q60, Q61, Q64, Q65, Q66, Q68, Q69, Q70, Q71, Q72, Q73, Q74.
**8 unchanged records:** Q54, Q55, Q57, Q58, Q62, Q63, Q67, Q75.
Stable IDs remain `mbb:set-2:original-051` through `075`; no answer-position index changes. The key-position distribution remains A/B/C/D = 6/6/7/6.

| Question | Key | Recovery decision |
|---|---|---|
| 51 | C | Remove pre-classified SWOT/PEST answers from the evidence table. |
| 52 | A | Remove padded distractor wording while retaining the incompatible-local-target error. |
| 53 | D | Add the unfunded-backfill gate; shorten padded distractors; classify selection as Evaluate. |
| 54 | B | Saved final screen agrees with the existing substantive record; retained unchanged. |
| 55 | C | Saved final screen agrees with the existing substantive record; retained unchanged. |
| 56 | A | Restore the saved fleet-inventory scenario, stable fill-rate denominator and bounded causal inference; eliminate another call-target vignette. |
| 57 | D | Saved final screen agrees with the existing substantive record; retained unchanged. |
| 58 | B | Saved final screen agrees with the existing substantive record; retained unchanged. |
| 59 | C | Make emergency/deadline exceptions to collaboration-first explicit. |
| 60 | A | Restore role accountability with concise wording and Evaluate classification. |
| 61 | D | Correct the false three-discretionary-project rationale, state additive comparable NPVs and fixed scored capacity; add working reset. |
| 62 | B | Saved final screen agrees with the existing substantive record; retained unchanged. |
| 63 | C | Saved final screen agrees with the existing substantive record; retained unchanged. |
| 64 | A | Clarify annual avoided workload, cash basis and rounding of the unsupported combined NPV. |
| 65 | C | Replace causal conclusion labels with assessment observations. |
| 66 | D | Classify selection of an existing evaluation design as Evaluate, not Create. |
| 67 | B | Saved final screen agrees with the existing substantive record; retained unchanged. |
| 68 | C | State alpha and causal claim; make supplied p-value scope explicit. |
| 69 | A | Distinguish SDs from variance components, variance contribution from study variation and unrounded acceptance rule; remove solution column. |
| 70 | D | Remove unverifiable goodness-of-fit p-values and stipulate adequate Weibull model with exact bin conventions. |
| 71 | B | Identify pointwise diagnostic scope; avoid uniquely prescribing an AR model from ACF alone. |
| 72 | C | Reconstruct saved balanced ten-team-per-cell synthetic study and ANOVA; recalculate p-values and distinguish interaction from equivalence. |
| 73 | A | State exact bin endpoint convention and remove answer-total clues in alternative text. |
| 74 | D | Remove redundant replication answers and clarify distinct units/dashes. |
| 75 | B | Saved final screen agrees with the existing substantive record; retained unchanged. |

## Independent numerical checks

- Q61: include mandatory R in the 12-BB-month limit; exhaustive feasible-subset enumeration uniquely selects R+A+D, using 12 months and $3.1 million risk-adjusted NPV.
- Q64: the supplied annuity factor gives hard-cash NPV of $131,358; improperly counting all avoided workload would produce $923,833, approximately $924,000, not $923,000.
- Q69: gage variance = 2.00 µm²; total = 22.25 µm²; gage/total SD ratio = 29.9812676%, versus variance contribution = 8.9887640%. The stated organization-specific criterion uses the unrounded ratio.
- Q70: the stipulated Weibull model gives P(T>8) = 0.07143153635221014. The (a,b] bin convention gives 14/200 = 7.0% empirically, not an exact population tail probability. Unreconstructable goodness-of-fit p-values were removed.
- Q72: 40 independent teams in a balanced 2×2 fixed-effects model; MSE 49 pp² and error df 36. Method/workload/interaction SS = 810/1210/490; F = 16.530612/24.693878/10.000000; p = 0.000248703/0.0000165014/0.003173018. Simple effects are 2 and 16 percentage points; a small observed effect is not proof of equivalence.
- Q73: 310 of 2,000 simulated values are negative (15.5%); the bin-midpoint mean estimate is $1.235 million.
- Q74: v=4, b=4, k=3, r=3 and λ=2; each treatment pair appears in two blocks.

## Integration and preservation

All **150 question records outside Batch 3** remain deeply equal to the baseline, including Batches 1, 2 and 4. All **175 answer indices** and the total count of 175 remain unchanged. All **24 non-Batch-3 generated asset files** remain byte-identical, even after regenerating all seven visual packages. No learner histories or identifiers are rewritten.

The earlier Batch 4 preservation test expected pre-audit Batch 3 values. It now verifies the explicitly recorded new Batch 3 question/asset hashes while retaining all other original preservation assertions; the test does not simply skip the newly modified range.

Shared player, review, retry and generator dispatch select the Batch 3 renderer only for its stable IDs. Tables and chart evidence, visible conditions, keyboard/touch selectors and post-answer distractor explanations are retained. The Batch 4 decimal-preserving deep-feedback and grounding modules are unchanged.

## Current, reproducible checks

**Node targeted MBB/feedback suites: 216/216 passed; zero failed, cancelled or skipped.** This includes 37 new restoration/integration checks. It is not a full-repository CI sign-off.

- batch3_player: **1395 assertions passed; 159 question/layout records; zero JavaScript errors.** Modes: attempt 75, review 75, retry 9.
- batch3_secondary: **978 assertions passed; 160 question/layout records; zero JavaScript errors.** Modes: fallback 60, attempt 50, review 50.
- combined100: **2325 assertions passed; 612 question/layout records; zero JavaScript errors.** Modes: attempt 300, review 300, retry 12.

Batch 3 player tests exercise all four choices per item, flags, navigation retention, calculator/formulas, 25/25 scores, complete answer review and checked retries of Q56/Q61/Q71 at desktop, tablet and mobile widths. Supplemental checks include all ten static visuals in two themes at three widths, dark-mobile and 320px attempt/review states, expanded data tables, and horizontal reachability.

The separate 100-question smoke traverses Q1–100 in order on desktop/tablet/mobile, scores recorded independent audit answers 100/100, reopens every review, checks cross-batch retention, and runs one mixed retry queue covering Q5/Q36/Q61/Q84. This is an integration test, not a new substantive audit of prior batches.

`browser-summary.json` contains source and result hashes. `preservation.json` pins the unaffected records/assets. `restored-hashes.json` pins the new Batch 3 expectations. `independent-calculations.json` and `question-audit-tracker.json` contain the numerical evidence and individual decisions. GitHub verification is reported separately after the pipeline completes.

## Outstanding limits

Offline browser fixtures do not verify live authentication, cloud durability, cross-device synchronization, real iPhone Safari or final production deployment. Human review and live acceptance remain required. Original source-page limitations, notably earlier Batch 1 Q25, are not silently closed. No learner-response data were used for item difficulty, discrimination, DIF or exam-reliability calibration. Unchanged dependency advisories remain a separate security concern.

The earlier reports remain historical records. Their statements that Batch 3 is missing are superseded by this integration only when its commit is added to PR #165. There is no full-175-question release approval, no main merge and no automatic merge. **Batch 5 has not started.**
