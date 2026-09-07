# ASQ Master Black Belt Simulation Exam — Set 3
## Batch 5: canonical Questions 101–125
**Final batch status: Passed after corrections — tested review build.**
All 25 questions were individually reviewed, independently answered, corrected and reopened. These records complete Batch 5 on PR170; human review and merge remain required. No merge or production deployment was performed. Stop at Q125: Batch 6 has not been started.

## Scope and provenance
Baseline: `3194498cc4ce96765aef172afe09056a282ab458`. Final tested application: `7597164f6c1ee1ef3a1f605bd9041286b7594661`. Subsequent `755ab0e482f852caa4ddf57db49610b998b3ea22` changes only the Batch5 workflow. This completion changes documentation only. Accepted exact-source validation: https://github.com/UpSkillSprint-Consulting/upskill-sprint/actions/runs/34092148192 . Every test job checked out the stated application commit. Artifact identifiers, archive/report hashes and failure history are in `browser-summary.json`.
Question numbers refer to canonical MBB_SET3 order, not a shuffled player session. Q1–100 and Q126–175 remain byte-preserved; all 175 IDs and answer positions are unchanged. Prefix SHA256: `0d34eb6ab6236e9c923aee02177a7d99e04fb428081b23962d85f54d54a26e26`; suffix: `7c27818031175f62f0e580fb4160760925a681a3f079751cb0f5aadd5f2475dd`.

## Required findings record
| Category | Verified result |
|---|---|
| Independently reviewed, answered and retested | 25/25: Q101–125 |
| Passed unchanged | 0 |
| Corrected | 25 |
| Stored answer positions changed | 0; retaining a position does not certify the original keyed content |
| Numerical/reporting defects | Q112's study-variation/ndc inconsistency; Q115's control-limit assumptions and consistency |
| Technical/keyed-content corrections | Variance versus SD, acceptance criteria, agreement versus accuracy, capability versus stability, graphical inference, bias, sampling-risk and performance overclaims |
| Wrong original option-letter references | None found |
| Explicit cross-question references removed | 3: Q101, Q102, Q105 |
| Individual option rationales | 100 |
| Exact duplicate stems involving the batch | 0 against450 MBB stems |
| Related decision tasks differentiated | Conversion/reconciliation, range/run signals, distribution/coverage, constant/changing bias, agreement/reference accuracy |
| Visual items preserved and corrected | 9: Q113, Q115–119, Q121, Q123, Q124 |
| Sliders | None in this batch; no slider testing claimed |
| Functional defect | Legacy/public chart-renderer compatibility; corrected and regression-tested |

## Question-by-question disposition
Every row passed after corrections. Full original/corrected content, all100 rationales, source locators and detailed findings remain in `revisions.json`; no original assumptions are falsely presented as authoritative external facts.
| Q | Stable ID | Key | Independently validated decision and correction |
|---|---|---|---|
| 101 | `mbb:set-3:d5-006` | D | The conflict requires both a feasible resource decision and coaching on how champions use governance. The MBB can help frame the competing demands, test assumptions and facilitate agreement, while the council resolves decisions outside the MBB's delegated authority. Neither equal splitting nor larger forecast benefit automatically yields a feasible allocation. Escalation to the MBB is not inherently improper; unilateral allocation without authority is the issue. |
| 102 | `mbb:set-3:d5-007` | C | Feedback should address observed attribution, not invent intent or a proven retention effect. A private, specific conversation allows the champion to respond and supports accurate future recognition and correction of materially misleading records. Follow-up should verify the agreed behavior. Public correction can become necessary, but its form should fit the facts rather than being automatic punishment or a substitute for initial fact-based coaching. |
| 103 | `mbb:set-3:d5-008` | B | The behavior has created an immediate stakeholder and measurement-coverage problem. Specific feedback, practiced listening, supported repair and follow-up address the demonstrated skill gap while the MBB checks whether the data remain representative. Generic training alone or forced cooperation does not repair the current problem. Reassignment can be necessary if harm persists, but permanent removal of stakeholder duties is not the first developmental response in this case. |
| 104 | `mbb:set-3:d5-009` | C | Analytical integrity requires an honest, qualified account of what the data support. The MBB should first help check design, uncertainty and interpretation, then support a constructive evidence review and next step. Lack of support is not necessarily proof that the hypothesized effect is absent. Direct conversation is appropriate under the stated circumstances, but it must not become a mandatory prerequisite when retaliation, misconduct or safety concerns require protected escalation. |
| 105 | `mbb:set-3:d5-010` | D | Structured participation protects access to the discussion; it does not make all proposed causes equally supported. The MBB should coach the interruption behavior and a concrete meeting process, then check whether the Belt elicits and evaluates relevant evidence. Turn-taking can include a pass or written contribution so participation is not coercive. Majority preference and post-hoc approval do not replace examination of failure mechanisms. |
| 106 | `mbb:set-3:d5-011` | B | Coaching should respect the person's experience while checking concrete evidence against the actual advancement requirements. Two successful outcomes support some competencies but do not automatically satisfy the full standard. A development plan can recognize strengths and target remaining evidence without letting confidence alone decide readiness. The MBB should remain within the coaching role and should not diagnose a condition from this statement. |
| 107 | `mbb:set-3:d5-012` | D | The missing element is active development and verification of the Belt's reasoning. Questions, examples and direct instruction can all support coaching when the Belt applies the reasoning and receives feedback. Supplying a worked example is not inherently wrong, nor must an MBB refuse expert work in an emergency. Under the stated conditions, a finished answer without learner application leaves the specific capability gap untested. |
| 108 | `mbb:set-3:d5-013` | A | The concern warrants respectful examination, not dismissal or a premature finding. The MBB should explain applicable confidentiality limits, avoid unnecessary identifying disclosures and use appropriate organizational channels to assess the process. Transparent, relevant selection criteria and review of access can address supported barriers. A demographic characteristic alone does not prove discrimination, and individual networking advice does not substitute for examining the reported process. |
| 109 | `mbb:set-3:d5-014` | D | The coach should first understand the obstacle and the person's concern rather than assume a technical deficiency or a fixed lack of ability. A specific next action and appropriate support make the conversation useful, while follow-up tests whether the barrier is being addressed. Reassurance need not promise success. Reassignment may become appropriate after assessment, but this statement alone does not justify it. |
| 110 | `mbb:set-3:d5-015` | C | Mentoring can legitimately include advice and experience, but those resources should serve the learner's current needs. An agreed goal, open questions, selective examples and an owned next action connect the discussion to application. Later review should examine progress and learning rather than story counts or downloads. This corrects the observed pattern without claiming that all storytelling is inappropriate. |
| 111 | `mbb:set-3:d6-001` | B | The reported percentage divides variances, not standard deviations. The study-variation fraction is sqrt(0.22), so %Study Variation is approximately 46.9%, above the site's 30% screening limit. The variance contribution also exceeds 9%. The study does not provide engineering tolerance or identify which measurement component dominates; investigate those components and validate improvements rather than prescribe replacement without evidence. This is the stated guideline, not a universal ban on every possible measurement use. |
| 112 | `mbb:set-3:d6-002` | D | Let total SD be 1. Gage SD is 0.28, and part SD is sqrt(1 - 0.28 squared) = 0.96. Thus 1.41 × 0.96 / 0.28 = 4.8343, which truncates to ndc = 4, not 2 or 5. Standard deviations do not add linearly. Under this common component model, ndc and %Study Variation are related rather than independent evidence. Verify report settings and part representativeness; the corrected value still misses the site's five-category screen. |
| 113 | `mbb:set-3:d6-003` | C | Observed agreement is (30 + 40) / 100 = 0.70. Inspector 1's pass/fail proportions are 0.50/0.50 and Inspector 2's are 0.40/0.60, giving expected agreement 0.50. Kappa is (0.70 - 0.50) / (1 - 0.50) = 0.40, below the stated screen. Agreement is not accuracy: without reference truth the error rate and better inspector cannot be identified. Review ambiguous criteria, collect appropriate reference and repeatability evidence, and consider uncertainty and category prevalence before validation. |
| 114 | `mbb:set-3:d6-004` | C | Cpu = (62 - 51) / (3 × 4) = 0.9167 and Cpl = (51 - 38) / (3 × 4) = 1.0833. Cpk takes the smaller index, so the point estimate is 0.92. Cp = (62 - 38) / (6 × 4) = 1.00; the mean lies above the specification midpoint of 50 mm. Even recentering alone leaves Cp below 1.33. Stability is a separate question and is given here; sample information would be needed for an uncertainty interval, not for this point calculation. |
| 115 | `mbb:set-3:d6-005` | C | The mean limits are 50 ± 0.577 × 2.9 = 48.3267 and 51.6733 g. The range UCL is 2.115 × 2.9 = 6.1335 g, with LCL 0. New subgroup 6 has range 7.8 g and signals; the eight means are within the fixed mean limits. A new Phase II signal does not retroactively invalidate a sound historical baseline. Investigate the cause and output risk, document any exclusion or process change, and rebaseline only when justified. Stability of dispersion must not be ignored. |
| 116 | `mbb:set-3:d6-006` | A | IQR = 5.1 - 3.4 = 1.7 days, so the upper fence is 5.1 + 1.5 × 1.7 = 7.65 days. The upper whisker ends at the largest observation inside that fence, 6.8 days; it is not the dataset maximum, which is 11.4. All three flagged values warrant context and record checks. They may be legitimate observations from a skewed distribution or a different case mix. Do not infer a time-based special cause or remove data solely from a boxplot flag. |
| 117 | `mbb:set-3:d6-007` | C | The two low measurements are present in the actual plotted dataset, not inferred from an unlabeled sketch. Their separation makes them a useful focus for record, measurement and process-context checks. The display raises doubt about a single normal model for the whole sample, but it does not identify a lot effect or prove a mixture. A straight central portion is not proof that the full population is normal. Keep valid records and choose subsequent modeling or stratification based on evidence rather than deletion to improve a fit. |
| 118 | `mbb:set-3:d6-008` | C | Panel C combines small repeatability spread with a displaced mean relative to the reference. A suitable validated correction may address that systematic component, but averaging alone does not remove a constant bias. Panel A is already clustered near the reference; B has large spread with a near-centered average; D combines large spread with offset. Accuracy is broader than mean centering: an on-target average does not make imprecise individual measurements accurate. This schematic does not quantify uncertainty for a real instrument. |
| 119 | `mbb:set-3:d6-009` | A | Bias is measured mean minus reference: 12 - 10, 52 - 50 and 92 - 90 each equal +2 mm. These observed means suggest an additive offset, not an increasing absolute bias. They do not establish the statistical absence of a slope, adequate repeatability, or performance between and beyond the tested levels. Investigate calibration and uncertainty, apply only a justified correction, and verify residual errors. A 2% multiplicative correction is not a 2 mm additive correction. |
| 120 | `mbb:set-3:d6-010` | C | The Cpk formula can be evaluated algebraically without a normal distribution, but its usual normal-tail interpretation needs an appropriate model. A systematic probability-plot departure challenges the report's tail prediction; it does not by itself prove poor capability or identify a specific distribution. Check fit in the relevant tails and model uncertainty. Any transformation must also be applied consistently to the specification limits. Empirical tail estimates or nonnormal methods require adequate data rather than an automatic distribution choice. |
| 121 | `mbb:set-3:d6-011` | A | The displayed points 41–48 are eight consecutive values strictly above 500 g, so the stated rule signals at point 48 without requiring a limit exceedance. This is evidence warranting investigation, not proof of a specific cause or a permanent shift. Western Electric's eight-point rule is distinct from rule sets that use nine. The figure is explicitly the final 12-point excerpt; it does not misrepresent 12 points as all 48 observations. Avoid automatic recalculation that absorbs the signal. |
| 122 | `mbb:set-3:d6-012` | C | Control limits describe the expected behavior of a plotted statistic under the monitoring model. Engineering specifications describe required product performance. Subgroup means and individual units have different spreads, so substituting individual specifications can miss nonconforming units or change detection and false-alarm properties. Keep stability monitoring and conformance assessment distinct. The boundaries can coincide numerically by chance, but forcing equality or changing requirements to fit the process has no statistical justification. |
| 123 | `mbb:set-3:d6-013` | B | For each plan, Pa(p) is the sum of binomial probabilities for 0 through c defectives. At 1% defective, Pa is approximately 0.999993 for A and 0.986183 for B, so producer risk 1 - Pa is smaller for A. At 10%, Pa is about 0.008071 for A and 0.111729 for B, so consumer risk is also smaller for A there. These comparisons use actual quality levels and curve locations, not steepness alone. A inspects 200 items rather than 50; neither risk statement is a claim of dominance at every possible quality level. |
| 124 | `mbb:set-3:d6-014` | A | The group means are 10.02, 10.15 and 9.88 mm, a 0.27 mm spread, while each within-group range is 0.02 mm. Thus between-group separation is the main displayed feature. These descriptive differences do not identify machine identity as the causal mechanism: lot, time, operator or setup may be confounded. Review the production context and collect an appropriate balanced or blocked comparison, with replication and measurement checks, before adjusting equipment or generalizing to the full process. |
| 125 | `mbb:set-3:d6-015` | D | Cp measures specification width relative to within-subgroup spread and ignores the mean. Even a high Cp cannot establish actual tail clearance without centering information. Cpk adds centering, while Ppk uses overall rather than within-subgroup variation; the data must cover the operating conditions relevant to a sustained claim. These are estimator definitions, not guarantees of short or long observation duration. A fixed 1.5-sigma shift and a universal Ppk ordering cannot substitute for evidence, and neither index alone validates a defect rate when model assumptions fail. |

## Numerical and source validation
**Q111:** 22% variance contribution implies 100√0.22 = **46.9042% study variation**, not22%SD. The adopted acceptance threshold and component-model assumptions are explicit.
**Q112:** Using the same nonnegative component decomposition, gage/totalSD=.28 and part/totalSD=√(1−.28²)=.96. Thus ndc=floor(1.41×.96/.28)=floor(4.8342857)=**4, not2**, still below the site's target5. The relationship is not asserted for reports using unrelated historical standard deviations.
**Q113:** Counts30/20/10/40 total100. Observed agreement=.70; marginal expected agreement=.50; kappa=(.70−.50)/(1−.50)=**.40**. Agreement is not accuracy without reference truth; the screening criterion is local, not universal.
**Q114:** Specs38/62mm, mean51mm, withinSD4mm give Cp=**1.00**, Cpu=11/12, Cpl=13/12, Cpk=**.9167≈.92**, below the explicit1.33target despite stipulated stability.
**Q115:** Historical mean50g, Rbar2.9g and n5 with A2=.577,D3=0,D4=2.115 give Xbarlimits**48.3267/51.6733g** and Rlimits**0/6.1335g**. Subgroup6 range**7.8g** signals. These are validated historic PhaseII limits, not limits estimated from the new eight observations. Investigate without automatically deleting observations or recalculating the baseline.
**Q116:** IQR=1.7days, fences**.85/7.65days**; upperwhisker6.8 is not maximum11.4. Values9.2/10.1/11.4 are flags, not proven errors or SPC special causes.
**Q117:** All24 original measurements retained, with units and actual inverse-normal **Filliben** positions and a defined quartile reference. No proof of normality or unique cause is inferred from22 apparently aligned points.
**Q118–119:** Neutral equal-scale deterministic targetpanels distinguish tight clustering from offset; C is centered around(4,3). Reference10/50/90mm versus means12/52/92mm gives **+2mm bias** throughout; an offset correction needs validation and three means do not prove absent linearity error.
**Q121–122:** The preselected WesternElectric **eight-point** rule uses displayed observations37–48; the last8 are strictly aboveCL. Control limits for subgroupmeans and specifications for individualunits differ in purpose/scale even if their numbers coincide.
**Q123:** Binomial plans A:n200,c10; B:n50,c2. At1%defective, Pa=**.9999931182/.9861827292**; at10%, Pa=**.0080712500/.1117287563**. A has lower designated producer/consumer risks with fourtimes the sample. Slope alone would not establish this comparison. All402probabilities checked against independent SciPyCDF and JavaScriptrecursion.
**Q124–125:** Machine means**10.02/10.15/9.88mm**, each group range**.02mm**, meanrange**.27mm**: descriptive differences, not an isolated machine causal effect. Cp2 omits centering and representative sustained coverage; no universal1.5-sigma shift is applied.
Independent external checks of402binomial probabilities and24normal quantiles have maximum absolute differences **6.5503158452884236e-15** and **4.440892098500626e-16**, respectively. Derivations are in `independent-calculations.json` and `independent-verification.json`. No inferential p-values, confidence intervals, DOE aliases or reliability calculations are present; nonexistent calculations are not counted as passed.
Primary references retained in `sources.json` and `auditSources` include ASQCMBBBOK, ICFcompetencies, officialMinitab guidance and NISTstatistical handbook. BOK alignment is not ASQauthorship or endorsement. Illustrative datasets/sitecriteria are explicit; no textbook page citation was fabricated.

## Visual and functional correction
All9visuals retained: contingencytable, Xbar/R, boxplot, normalprobability, targetpanels, bias evidence, runexcerpt, binomialOC and groupedmeasurements. Captions, units, numerical alternatives, headers, light/dark readability and horizontal access were checked. Q113's malformedheaders were repaired. Q115 reference labels now occupy a separate band clear of observations; automated collision checks protect this. Targetrings/centers are visible and theRaxis starts atzero. Explanatory mathematical glyphs/arithmetic do not require LaTeX rendering.
All25questions were individually inspected across desktop/mobile, light/dark and question/expandedreview: **200primary views**. Sequential native-width mobile strips include the complete content. Primarybank/scopedUI/feedback code is byte-identical to final7597164; the final400-case matrix reopened allitems after compatibility repair. All9visuals additionally had18final WebKitmobile right-edge regions inspected. Capturelimitations and exactboundaries are recorded in `visual-inspection.json`.
The first full suite found **11 real compatibility failures**, notablyQ115: older chartentrypaths could not read the newevidenceschema. Final7597164 delegates to the auditedmodule when available and supplies the complete accessible evidencetable otherwise. The usual student interface retains fullSVGvisuals. Existing failingtests were retained and two explicit compatibilitytests added. This failure is not hidden or labeled merely a testfixture issue.

## Tests and retests
| Check | Final result |
|---|---|
| Dedicated Batch5tests | **47/47passed** |
| Existing Set3traversal/integration targetedtests | **8/8passed** |
| Combined targetedcommand | **55/55passed** |
| Alloptions graded in actualplayer | **100/100correct outcomes** |
| Complete repositorysuite | **1645/1645passed**, zero failures/cancellations/skips |
| Chromiumdesktop, both themes/question-review | **100/100passed** |
| Chromiummobile, both themes/question-review | **100/100passed** |
| WebKitdesktop, both themes/question-review | **100/100passed** |
| WebKitmobile, both themes/question-review | **100/100passed** |
| Visualcontent/accesssequences | **72/72passed** |
| Final pageerrors, detectedclipping/overflow, SVGtextbounds, labelcollisions, scopedaxeviolations | **0** |
Keyboard/pointer selection, eachoption, reopen/flag state, timer, calculator/formula/statisticaltable drawers, submission, reviewfiltering and expandedrationales were exercised. Issueform preparation sent no message. Answering only the audited25items deliberately yields25/175 with150unanswered; this is not a semantic audit of175questions. Desktop1440×1000; mobile390×844emulation. Fullregression artifacts are identified in `browser-summary.json`.

## Wording and duplication
Originalcorrectchoice uniquelylongest:25/25; revised:5/25. Median correct/median-distractor wordratio3.0714→.9000. Keys remain A5/B4/C10/D6, not rebalanced. No identical normalizedstem involvingBatch5 against450MBBquestions; relatedtasks independently differentiated. These screens are not empiricalpsychometrics.

## Files changed
Application: `test-bank-mbb-set3.js`, `test-bank-mbb-set3-batch5-ui.js`, `test-bank.html`, `test-bank-feedback-loop.js`. Validation: Batch5content/rendering/compatibility tests, browserdriver and workflow; earlierBatch1–4suffix guards now beginQ126, with the newindependentprefix guard protecting everybyteQ1–100. Auditrecords include fullrevisions, completedtracker, preservation, sources, calculations, externalverification, browsermanifest, visualinspection, word/duplicatescreen and thisreport. Exact paths are listed below. Package manifests/versions are unchanged; automationstaging is outsidePR170.

## Remaining concerns
No confirmed Q101–125content or renderedcard defect remains. Productionauthentication, durable serverstorage and cross-devicesync used isolatedfixtures and are not certified; no physicalphone test. Existing dependencyadvisories require separate maintenance. No candidateresponses were analyzed, so difficulty, discrimination, reliability andDIF remain uncalibrated. Earlierbatch intermittent browserchecks are recorded separately inPRdiscussion, not substituted for acceptedBatch5evidence. Q126–175remain unaudited. Humanreview/merge required; no deployment or merge performed.
**Disposition: Passed after corrections in the tested review build. Stop atQ125.**

### Exact Batch 5 changed paths (22)

- `.github/workflows/mbb-set3-batch5-audit.yml`
- `docs/audits/mbb-set3-batch05/browser-summary.json`
- `docs/audits/mbb-set3-batch05/independent-calculations.json`
- `docs/audits/mbb-set3-batch05/independent-verification.json`
- `docs/audits/mbb-set3-batch05/preservation.json`
- `docs/audits/mbb-set3-batch05/psychometric-duplicate-screen.json`
- `docs/audits/mbb-set3-batch05/question-audit-tracker.json`
- `docs/audits/mbb-set3-batch05/report.md`
- `docs/audits/mbb-set3-batch05/revisions.json`
- `docs/audits/mbb-set3-batch05/sources.json`
- `docs/audits/mbb-set3-batch05/visual-inspection.json`
- `scripts/audit-mbb-set3-batch5.mjs`
- `test-bank-feedback-loop.js`
- `test-bank-mbb-set3-batch5-ui.js`
- `test-bank-mbb-set3.js`
- `test-bank.html`
- `tests/test-bank-mbb-set3-batch1-audit.test.js`
- `tests/test-bank-mbb-set3-batch2-audit.test.js`
- `tests/test-bank-mbb-set3-batch3-audit.test.js`
- `tests/test-bank-mbb-set3-batch4-audit.test.js`
- `tests/test-bank-mbb-set3-batch5-audit.test.js`
- `tests/test-bank-mbb-set3-batch5-fallback.test.js`
