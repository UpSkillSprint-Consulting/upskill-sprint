# ASQ Master Black Belt Simulation Exam — Set 3
## Batch 6: canonical Questions 126–150

**Final batch status: Passed after corrections in the tested review build.**

All 25 items were individually reviewed, independently answered, corrected, rendered and reopened. This is the Batch 6 completion record for PR #170. Human review and merge remain required. No merge or production deployment was performed. Stop at Q150; Batch 7 has not been started.

**Whole-PR readiness is not approved.** The separate Batch 3 WebKit-desktop check remains unsuccessful at the tested PR head. Batch 6's own additional PR-merge WebKit-mobile check initially timed out, then passed an unchanged retry; its original failure remains documented rather than counted as a passing result.

## Scope and evidence identity

The question numbers refer to canonical `MBB_SET3` order, not a student's shuffled session order. Stable IDs identify the exact items: `mbb:set-3:d6-016` through `mbb:set-3:d6-040`.

Baseline before Batch 6: `11fa54352c3f8148576fb87c816e1bf36dae96ba`. Final tested application: `7384e94d823a0cf9ef36ca4b2be2d0e327a58148`. Subsequent head `62e818279b7b5821d8de76c6d73c00e949017218` adds only the read-only Batch 6 workflow. The final completion commit changes audit documentation only. The tested PR merge is `f6ecb42cd9608966f4a0e5241a48e6bd1b0ece48` against main `e15578514c6c2ebbd022c17f6ee9befad20f9dc6`.

[Accepted exact-source validation](https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/34120698342). Every test job checked out the final application commit, as verified from each artifact's `tested-commit.txt`. Artifact IDs, archive hashes, job identities and failed-run dispositions are in `browser-summary.json`.

Q1–125 and Q151–175 remain byte-for-byte unchanged. All 175 question IDs and answer positions are preserved. Protected prefix SHA-256: `f022ebd5a43e01f81ea10e9ebe5a7f0f98f16b46bf1ef294e959d8f7c572ba5c`. Protected suffix SHA-256: `fdbb6f31fbeae47aafea3f47e2ea5d1452d5b5dae00cbfec2e8a32489d9e10d3`. Earlier suffix guards were advanced only for the newly authorized range; Batch 6 independently protects all earlier question bytes.

## Required findings record

| Category | Verified result |
|---|---|
| Individually reviewed, independently answered and retested | 25/25: Q126–150 |
| Passed without changes | 0 |
| Corrected | 25 |
| Incorrect stored answer positions / positions changed | 0 / 0; preserving positions does not certify the original keyed wording |
| Material keyed-content/interpretation defects | Q139's significance claim; Q143's overbroad curvature statement; Q137's unsupported practical-triviality conclusion; Q144's incomplete visual and implied additivity; further qualifications recorded per item |
| Incorrect answer-letter references in original explanations | None found |
| Author-instruction leakage | Q137's reference to the original assignment removed |
| Explicit dependence on other question IDs | None found in this batch; all revised cases remain independent |
| Missing units, assumptions, definitions and context | Corrected individually, including OR event/reference coding, VIF convention, residual time order, model-versus-observation status, factor generators, replication/error degrees of freedom and experimental units |
| ASQ source alignment | Replaced imprecise generic locators with explicit VI.B/VI.C alignment; Q131's response-surface topic mapped to VI.C.3 |
| Explicit option-specific rationales | 100, covering every choice |
| Exact normalized duplicate stems involving this batch | 0 against 450 MBB stems across Sets 1–3 |
| Related decision tasks | Distinguished VIF interpretation/report reconciliation, temporal/selection/model-comparison validation, alias/foldover tasks and curvature/DSD estimation; shared competencies remain intentional |
| Visual questions retained and corrected | 8: Q127, Q128, Q129, Q134, Q138, Q139, Q142, Q144 |
| Visual composition | Three table-only items; five graphical items with exact numerical alternatives |
| Sliders | None in this batch; none removed or claimed as tested |
| Confirmed graphical correction during development | DOE cube labels separated from edges; collision checks added |
| Functional/retest concern | One additional PR-merge WebKit-mobile timeout opening option analysis; unchanged retry passed, underlying cause not established |

## Individual disposition

Each row passed after correction in the tested review build. Full original and corrected content, all 100 rationales, independent solutions and item-specific findings remain in `revisions.json`. Newly supplied scenario assumptions and illustrative data are visible in the revised question or visual, not represented as original source facts.

| Q | Stable ID suffix | Key | Specific correction and independent conclusion |
|---|---|---|---|
| 126 | d6-016 | C | Separate observational training fit, independent prediction validation and causal identification; R² = 0.89 does not identify intervention effects. |
| 127 | d6-017 | A | Label the retained nine residual points as an excerpt; distinguish heteroscedastic coefficient inference from prediction intervals and qualify OLS unbiasedness by the mean/exogeneity assumptions. |
| 128 | d6-018 | B | Use VIF as a predictor-dependence/variance diagnostic, not proof of the unique cause of unstable signs; distinguish variance inflation from its square-root standard-error multiplier and avoid automatic deletion. |
| 129 | d6-019 | A | Specify failure as the event, long/short indicator coding and no other predictors; retained counts give OR 2.3468, risk ratio 1.8889 and risk difference 16 percentage points. |
| 130 | d6-020 | D | Investigate drift, leakage and complexity rather than declaring a unique cause; time-respecting development and a fresh final evaluation are needed after the original holdout guides revisions. |
| 131 | d6-021 | A | Supply a quadratic equation and safe region; eigenvalues −4 and −10 classify a fitted maximum of 80%, not a proven global physical-process optimum. |
| 132 | d6-022 | B | Make the binary outcome and 12 events explicit; 40 candidate predictors plus an intercept challenge the information base, and selection before cross-validation leaks validation outcomes. |
| 133 | d6-023 | D | Limit the VIF bound to conventional centered, intercept-containing OLS; a 0.60 tolerance would imply VIF 1.6667, not a valid VIF below one. |
| 134 | d6-024 | B | Replace raw-trend inference with an explicitly illustrative valid OLS residual diagnostic. Preserve all 14 original call counts; independently reproduce DW = 0.45 without inventing a formal p-value or unique ARIMA order. |
| 135 | d6-025 | C | Specify a common complete-case sample and distinguish marginal from partial slopes; nonsignificant partial tests do not establish lack of joint association or predictive usefulness. |
| 136 | d6-026 | B | Base model choice on held-out performance, uncertainty and operational adequacy; neither higher training R² nor simplicity alone decides the result. |
| 137 | d6-027 | A | Remove the unsupported trivial-effect claim and author-instruction leakage. A feasible 50-point change predicts 1.0 day, above the 0.5-day threshold; its uncertainty and causal feasibility remain separate. |
| 138 | d6-028 | A | Add units and equal scales. Actual marginal effects are +26 and +2 MPa; coded coefficients are +13 and +1. Significance and interaction cannot be determined from these marginal means alone. |
| 139 | d6-029 | D | Correct the claim that nonparallel lines prove significance. Cell means give simple A effects +30 and −15 MPa, difference −45, factorial AB effect −22.5 and coded coefficient −11.25; no error estimate is supplied. |
| 140 | d6-030 | D | Supply C = AB and derive I = ABC, resolution III, A = BC, B = AC and C = AB. Four observations fit four coefficients, leaving zero residual degrees of freedom. |
| 141 | d6-031 | D | Specify the 2⁴⁻¹ fraction and the actual de-aliasing augmentation. Reversing only D gives the complementary fraction; reversing all four signs repeats the original fraction. Address stage comparability. |
| 142 | d6-032 | B | Replace the incomplete/inconsistent alias display with all 21 two-factor aliases derived from the seven specified columns; the eight-run main-effects model is saturated. |
| 143 | d6-033 | B | Distinguish two-level interaction estimation, aggregate center-point curvature detection and identification of separate pure-quadratic terms. Opposing pure curvatures can cancel in the center-versus-corner contrast. |
| 144 | d6-034 | B | Replace the four-node project-network-like visual with a genuine eight-vertex DOE cube. Preserve the four original values and explicitly identify completed values as additive-model predictions; effects are +9, +16 and +22 nm/min. |
| 145 | d6-035 | D | Specify I = ABCDE, resolution V and the higher-order assumptions. Intercept plus five main effects and ten two-factor interactions uses all 16 runs, leaving no residual error degrees of freedom. |
| 146 | d6-036 | D | Correct the incompatible factor-unit/noise comparison. With stated sensitivity and independent SD, signal is 1 MPa and contrast SE is 4.2426 MPa; consider safe spacing, replication or justified blocking. |
| 147 | d6-037 | D | Separate model hierarchy from significance requirements. A three-way interaction can reverse conditional two-factor effects that cancel when averaged; do not infer zero conditional effects from marginal nonsignificance. |
| 148 | d6-038 | B | Distinguish complete day/temperature confounding from legitimate restricted randomization; require whole-plot replication and the appropriate error strata rather than treating subsamples as independent assignments. |
| 149 | d6-039 | B | Make complete treatment coverage and within-operator randomization explicit. Blocking can improve precision under additive shifts; it does not remove physical variation or automatically estimate treatment-by-operator structure. |
| 150 | d6-040 | A | Specify eight continuous factors and the standard 17-run DSD. Main-effect protection and curvature screening do not identify all 45 full-quadratic coefficients simultaneously. |

## Numerical and design verification

Independent Python/NumPy calculations, SciPy likelihood optimization and statsmodels were applied to the actual revised values. Results are in `independent-verification.json`; the detailed calculations and assumptions are also protected by repository tests.

**Q129:** Failure odds are 18/82 and 34/66. OR = (34 × 82)/(66 × 18) = 2.3468013468; one-decimal reporting gives 2.3. Risks are 18% and 34%; the risk ratio is 1.8888889, not the OR. A separate logistic likelihood fit agrees with the direct OR within 5.9 × 10⁻⁸.

**Q131:** For ŷ = 80 − 2x₁² − 5x₂², the gradient vanishes at (0,0), and the Hessian is diagonal with negative eigenvalues −4 and −10. This proves the fitted quadratic's maximum, not the unknown physical response outside its support.

**Q134:** All original observed calls are retained. Added fitted/residual values are explicitly constructed illustrative data, not a recovered empirical fit. Independent OLS recovers the supplied fit with residual discrepancy below 1.4 × 10⁻¹³ and DW = 0.45. The residuals sum to zero and are orthogonal to the fitted column. Displayed values are rounded to six decimals; calculations use full precision.

**Q137:** The complete feasible effect is 0.02 × 50 = 1.0 day. The supplied p = 0.03 is interpreted against the prespecified α = 0.05, not reconstructed from an unavailable dataset. No confidence interval or probability of exceeding the practical threshold is fabricated.

**Q139:** The conditional A effects are +30 and −15 MPa. The difference-of-differences is −45, the factorial AB effect −22.5 and its −1/+1 coded coefficient −11.25. No significance conclusion follows without error information.

**Q140–145:** Independent design matrices verify all stated alias equalities, unique-run counts, column ranks and orthogonality. The D-only foldover gives 16 distinct combinations; reversing all four signs leaves eight. The seven-factor screen's 21 listed two-factor aliases agree with its generators. Center points increase the intercept/pure-quadratic rank from one to two, not three. The 16-run resolution V main-plus-two-factor model has rank 16 and no residual degrees of freedom.

**Q146:** Signal = 0.5 MPa/°C × 2 °C = 1 MPa; independent one-run-per-level contrast SE = √(3² + 3²) = 4.2426407 MPa. This is a planning comparison, not an observed p-value or exact power calculation.

**Q147:** The constructive example y = 50 + 10ABC has zero averaged main and two-factor effects but a nonzero three-factor effect, demonstrating why marginal and conditional interaction claims must be separated.

**Q150:** A full quadratic in eight factors has 1 + 8 + 8 + 28 = 45 coefficients. Independent construction of an illustrative standard 17-run continuous-factor DSD verifies main-effect orthogonality to second-order terms and a full-quadratic design rank of 17, not 45. This verification is not claimed to be a source company's experiment.

Reported R² values and inferential summaries in interpretation questions remain clearly supplied premises where raw data, standard errors or degrees of freedom were not supplied. No confidence intervals, critical values or p-values were invented to fill those gaps.

## Authoritative source alignment

ASQ's CMBB Body of Knowledge establishes topic alignment, not authorship or endorsement. Its VI.B/VI.C pages were visually inspected. NIST supports residual/model assessment, DOE defining relations, response surfaces, curvature, foldovers and blocks. Minitab supports VIF/logistic/Durbin–Watson interpretation, interaction-plot limitations, split-plot units and the standard DSD run count. JMP supports DSD screening properties; scikit-learn's primary documentation supports leakage-free development/validation. Exact locators are retained per question and in `sources.json`.

Original numbers were retained where meaningful. Additional event counts, effort/sensitivity assumptions, illustrative residuals, cell means and fitted-cube predictions are explicitly stated and distinguished from source facts. No textbook page attribution was fabricated.

## Visual and functional review

All eight original visual items remain. Five graphical items have complete numerical alternatives; three remain tables. The corrected cube contains all eight combinations and 12 edges, not four activity nodes. Q134 displays both the retained raw observations and the newly stated residual example. Main-effect panels use equal response scales; the interaction display has actual cell means and distinguishable solid/dashed lines.

The scoped Batch 6 renderer is limited to the exact 25 qids and does not capture other exams or earlier/later questions. Labels, units, captions, headers, reference marks, readable line wrapping and visible horizontal-scroll guidance were inspected. During development, cube-edge/label overlap was corrected, and rendered collision checks were added rather than relying only on SVG bounds.

**All 25 items received 200 complete primary visual inspections:** WebKit desktop and Chromium mobile × light/dark × question/expanded-review. Long mobile captures were inspected as consecutive native-width strips with overlap, including the bottom controls, rather than by omitting long sections. An additional **52 mobile right-edge region captures** were examined for all eight visual items in both engines and both question/review states. Primary views and desktop evidence establish complete context; a far-right capture intentionally omits off-screen left columns and is not claimed to display the entire table at once. Automated checks separately verify every cell, header, plotted coordinate, scroll path and reset.

Normal/degraded rendering tests confirm that all five graphical items keep their SVGs in the normal interface and retain complete accessible numerical data if the optional graphical module is unavailable. No slider exists in this batch, and no nonexistent interaction is counted as passed.

## Tests and retests

| Check | Final accepted result |
|---|---|
| Dedicated content, math, design algebra, preservation, scope and actual-player grading | 52/52 passed |
| Normal/degraded graphical-path compatibility | 2/2 passed |
| Existing full Set 3 traversal/integration | 8/8 passed |
| Combined targeted command | 62/62 passed |
| Every option on all 25 items graded through the player | 100/100 outcomes correct: 25 correct and 75 distractors |
| Complete repository regression | 1,699/1,699 passed; zero failures, cancellations or skips |
| Chromium desktop/mobile, both themes, question/review | 200/200 rendered cases passed |
| WebKit desktop/mobile, both themes, question/review | 200/200 rendered cases passed |
| Eight visual items, question/review, four engine/layout contexts | 64/64 evidence/access sequences passed |
| Accepted-case page errors, detected clipping/overflow, SVG text bounds, label/point collisions, cube-label/edge collisions and scoped axe violations | 0 |
| Additional Batch 6 PR-merge run | All five latest-attempt jobs successful after the documented unchanged retry |

Actual interactions include all options, keyboard selection, retained answers after reopening, a retained flag, timer progression, calculator/formula/statistical-table drawers, submission, review filtering, expanded rationales and issue-form preparation. No issue message was sent. All 175 items were loaded; deliberately answering only the 25 audited items gives 25/175, not a claim to have semantically audited the entire bank. Layouts were desktop 1440 × 1000 and mobile 390 × 844 emulation.

The staging wording test initially caught a remaining systematic answer-length cue; it was corrected before the accepted application. A staging whitespace check also stopped a push before integration. Those failures remain distinct from student-interface defects. Superseded development runs are not counted as passing evidence.

The additional PR-merge WebKit-mobile job `101738565575` in run `34120943721` timed out opening the option-analysis summary after 52 report records. Its report recorded no page errors. **Unchanged retry job `101744530628` passed** with 100 rendered cases and no report failures; the latest workflow attempt shows all five jobs successful. Both artifacts remain recorded. The underlying timeout cause is not established, and passing the retry does not prove intermittent failures are impossible.

## Wording and duplicate screening

The correct answer was uniquely longest in 25/25 originals versus 7/25 revisions. The median correct-to-median-distractor word-count ratio fell from 3.4667 to 1.0000. Key positions remain A6/B9/C2/D8, not rebalanced. These are wording heuristics, not psychometric calibration.

Exact normalized screening found no matching stem involving this batch against 450 MBB questions. Lexical nearest-neighbor candidates and related constructs were reviewed; the strengthened tasks distinguish calculation/report reconciliation, holdout use, selection leakage, model comparison, actual foldover geometry and saturated-design limits. Shared statistical competencies remain intentional. This does not establish empirical independence or eliminate every possible content cue.

## Changed files and preservation boundary

Application: `test-bank-mbb-set3.js`, `test-bank-mbb-set3-batch6-ui.js`, `test-bank.html`, `test-bank-feedback-loop.js`.

Validation: `tests/test-bank-mbb-set3-batch6-audit.test.js`, `tests/test-bank-mbb-set3-batch6-fallback.test.js`, `scripts/audit-mbb-set3-batch6.mjs`, `.github/workflows/mbb-set3-batch6-audit.yml`, and the suffix guards in the Batch 1–5 audit tests. The new independent prefix guard protects Q1–125.

Audit records under `docs/audits/mbb-set3-batch06/`: `revisions.json`, `question-audit-tracker.json`, `preservation.json`, `sources.json`, `independent-calculations.json`, `independent-verification.json`, `browser-summary.json`, `visual-inspection.json`, `psychometric-duplicate-screen.json`, and this report. Package manifests and dependency versions were not changed. Automation staging remains outside PR170.

## Remaining concerns and release boundaries

No confirmed Q126–150 content or rendered-card defect remains from this review. Batch 6 is passed in the tested review build, not an unrestricted release clearance.

The **separate Batch 3 WebKit-desktop job `101738565039` in run `34120943610` remains unsuccessful** at tested CI head `62e81827`. Earlier repeated option-analysis timeouts are retained in Batch 5's completion-review record. Batch 6 did not establish their cause or clear that whole-PR release gate. Do not merge merely because Batch 6 passes.

Authentication and remote persistence use isolated fixtures. Production sign-in, durable server storage, cross-device synchronization and physical-phone behavior were not certified. Existing dependency advisories remain separate maintenance work. No candidate-response dataset was analyzed: item difficulty, discrimination, reliability and differential item functioning remain uncalibrated. No ASQ endorsement is implied.

**Disposition: Batch 6 passed after corrections in the tested review build. Human review and outstanding PR checks remain required. Stop at Q150.**
