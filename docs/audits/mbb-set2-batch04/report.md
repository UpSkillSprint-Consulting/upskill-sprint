# ASQ Master Black Belt Simulation Exam — Set 2
## Batch 4 audit — Questions 76–100

**Status: Passed after corrections for the offline tested candidate.** Human review and live acceptance testing remain required. This batch does not certify the full 175-question bank, resolve the uncommitted Batch 3 audit, merge to main, or deploy the website.

Audit date: 2026-09-05. Baseline: PR #165 at `6895f6a2a8c5643ef275b94c325ee4556efef2c1`. Stable IDs: `mbb:set-2:original-076` through `100`. All 150 other question records and all 175 answer-position indices are preserved. The baseline includes committed Batches 1–2, not the uncommitted Batch 3 candidate.

### Coverage

All 25 items were independently read, answered, checked against all four options and explanations, and inspected individually in before/after desktop and mobile screenshots. All 25 were reopened in the actual exam, post-submission review and supplemental narrow/dark layouts. All three interactive items were also exercised through deliberately missed-question retries.

All 25 records change: 21 have content, technical-context, cognitive-classification or visual corrections; Q77, Q78, Q87 and Q94 require source-annotation corrections only. Therefore **zero complete records are unchanged**, but the substantive reasoning of those four source-only items passed without a content rewrite. No incorrect answer-position index was found. The answer-position distribution stays A/B/C/D = 6/6/6/7.

Nine visual items: Q76, Q84, Q86, Q90, Q96, Q97, Q98, Q99, Q100. Three interactive items: Q84, Q96, Q97. No exact duplicate within the batch was found. Q95's former credential-waiver scenario was a conceptual repeat of Batch 2 Q45 and was replaced with a distinct non-Belt recruitment/progression decision.

### Question-by-question findings and corrections

| Question | Key | Decision and implemented correction |
|---|---|---|
|76|D|Clarified strategy-linked leading measures versus unlinked activity measures; neutral evidence descriptions and readable deployment table; corrected the chapter title.|
|77|A|Substantive content passed. Standardized the 2012 handbook source and the readiness-assessment locator.|
|78|C|Substantive content passed. Corrected/standardized the BPM source section and edition annotation.|
|79|B|Corrected the current BoK pointer and classified selecting a proposed innovation approach as Evaluate, not Create.|
|80|D|Made the regulatory deadline a mandatory portfolio constraint rather than an optional return score.|
|81|A|Corrected organizational-change BoK mapping and the cognitive label for selecting a federated deployment approach.|
|82|B|Separated multiple feedback channels from statistically independent observations; added repeated-event linkage, common definitions and accountable action.|
|83|C|Strengthened recall into an intervention-selection scenario; bounded the explanation to Herzberg's framework rather than a guaranteed motivation effect.|
|84|D|Made the score-8 threshold competence-specific, clarified ordinal ratings and removed causal overstatement. Rebuilt readable two-series evidence, neutral descriptions, keyboard/touch inspection and data alternative; moved a colliding threshold annotation above the plot.|
|85|A|Removed the factually incorrect eight-day compromise and kept mandatory safety constraints explicit.|
|86|C|Added working-day units and finish-to-start/zero-lag dependencies; corrected the program-management source and cognition label. Rebuilt the dependency diagram and predecessor table.|
|87|B|The earned-value key and calculations passed independently. Corrected the chapter reference; the shared summary repair now preserves its decimal values.|
|88|D|Corrected distractor C's rationale: C already contains impact and alternatives, but lacks the recommendation and sponsor decision request.|
|89|A|Corrected Chapter 15 to Chapter 16; distinguished released capacity from verified expense/budget effects and unsupported revenue.|
|90|B|Corrected the training-needs chapter, removed an answer-revealing interpretation column, and distinguished 74% of all errors from a shift-specific rate without exposure denominators.|
|91|C|Removed the unsupported implication that six coaches establish capacity to qualify 120 people in six months. Require workload/availability/duration estimates and feasible cohorts or renegotiated resources/time, without weakening standards.|
|92|D|Separated training timing from concurrent staffing/software/policy changes; added safe randomized phasing where feasible, comparable nontraining changes, contemporaneous outcomes, fidelity, case mix and spillover.|
|93|A|Distinguished legitimate Belt analysis/presentation from transferring reserved Champion approval and resource/barrier authority.|
|94|B|Substantive content passed. Corrected the team-facilitation source section and edition annotation.|
|95|C|Replaced the repeated credential-waiver case with uncertainty about eligibility/project participation and an active, mentored non-Belt-to-Belt pathway; corrected Chapter 23 and current BoK mapping.|
|96|D|Retained the correct bias slope but removed unconditional recalibration/acceptance without tolerances or uncertainty bounds. Added readable bias axes, observation inspection and an equivalent table.|
|97|A|Bounded the immediate-fix rule to the explicitly adopted handbook protocol; retained all delayed exposure/configuration evidence and distinguished cumulative from current MTBF. Rebuilt log-log evidence with correctly calculated T/r values and event interval.|
|98|B|Specified a consistent mass-fraction basis; independently verified lower-bound transformation and inverse. Rebuilt the barycentric feasible region with neutral coordinates and data alternative.|
|99|C|Replaced unsupported design statistics with explicit audit-authored synthetic run matrices. Specified model/coding, equal ten-run budgets, feasibility, full rank and both error-df constraints. Independently recomputed every determinant/rank; exposed all 40 run rows. Selection is among listed candidates, not a global-optimality claim.|
|100|D|Added millimeter units, equal noise weights and as-is selection; removed an incorrect distractor premise. Distinguished descriptive variation across imposed noise from replicated measurement error or population capability.|

All changed fields, independent solutions, four-option adjudications, source scope and screenshot references are retained in `question-audit-tracker.json`. Original answer positions are retained only because independent solutions support them, not to preserve a quota.

### Quantitative and technical verification

Q86: the merge requires both Q and R. P-Q-S-M is 20+30+25+0 = **75 working days**; P-R-S-M is 60 days. R has 15 days of float in the stated unrestricted network.

Q87: CPI = EV/AC = 0.96/1.20 = **0.80**; SPI = EV/PV = **0.80**; EAC = BAC/CPI = 2.40/0.80 = **$3.00 million** under the stated continued-cost-performance assumption. The implied remaining forecast is $1.80 million; cost and schedule variances are each -$0.24 million. Q89 releases **10,000 analyst-hours**, not automatically a cash saving.

Q96: least-squares bias = **2.6 - 0.04x mm**, mean bias **0.2 mm**, observed bias change **3.2 mm** across the 20–100 mm range. These data diagnose range-dependent bias; they do not independently establish repeatability, temporal stability, or conformity to an unspecified acceptance limit.

Q97: cumulative T/r values are **20, 25, 33.333333…, 40 and 50 hours**. Testing continued from 800 to 1,200 hours before the correction. The handbook protocol is explicit in this case; no claim is made that every possible NHPP formulation requires every correction to be instantaneous. Cumulative MTBF is not the instantaneous reliability of the final configuration.

Q98: the unallocated mass fraction is **0.20**; pseudocomponents are **(0.50, 0.25, 0.25)**. Inverse transformation returns **(0.40, 0.45, 0.15)**. Feasible vertices are (0.50,0.40,0.10), (0.30,0.60,0.10), (0.30,0.40,0.30).

Q99 uses model columns [1,A,B,A²,AB,B²]. Exact rational linear algebra and independently implemented numerical elimination agree:

|Design|Runs|Rank|Distinct settings|Lack-of-fit df|Pure-error df|det(XᵀX)|
|---|---:|---:|---:|---:|---:|---:|
|P|10|6|6|0|4|546.75|
|Q|10|6|8|2|2|9.546875|
|R|10|6|7|1|3|254.619140625|
|S|10|5|7|2|3|0|

P fails the lack-of-fit requirement despite the largest determinant. S cannot estimate the full model. R has the largest determinant among Q/R, the eligible listed choices. D-optimality minimizes generalized parameter-estimate variance for the specified model, not necessarily every individual variance.

Q100: means for I1–I4 are **50.5, 52.0, 54.0 and 57.0 mm**. Sample standard deviations are **1.290994, 4.760952, 0.816497 and 5.291503 mm**. Equal-weight squared deviations from 54 mm are **13.5, 21, 0.5 and 30 mm²**. I3 is the defensible as-is candidate for confirmation. The unreplicated noise-condition responses are not a repeatability study.

### Functional and visual corrections

The Batch 4 renderer is restricted to IDs 076–100. Stems and stated conditions precede the evidence. Wide evidence scrolls within bounded containers rather than shrinking the labels. Tables have captions, column/row header associations and consistent typography. All 40 Q99 run rows are available in the candidate and static fallback. Charts retain 14px SVG text and provide neutral alternative descriptions.

The three interactive charts support focus, Enter/Space, touch/native selection and live values, plus equivalent data tables. Actual answer review and retry retain charts and assumptions; rationales are not exposed before answering. Static fallbacks have no dead JavaScript-only controls and have standalone light/dark colors.

The decimal truncation defect involved two modules: both the original deep-feedback summarizer and the subsequently loaded grounding guard. Both now recognize sentence punctuation without splitting decimal tokens. Long-summary truncation respects word boundaries. Existing grounded-feedback and quiescence regressions are retained.

Regenerating unrelated packages exposed pre-existing Batch 2 CSS injection into later-batch fallbacks. The builder now scopes that style injection to the previously regenerated packages, so **all 24 non-Batch-4 asset files remain byte-identical even after regeneration**. This is not an audit of their content.

### Tests and reproducibility

Final local results: **179/179 targeted tests passed**, zero failures/cancellations/skips. The main browser run passed **1,383 assertions across 159 question/layout records**, with zero JavaScript errors. Supplemental tests passed **942 assertions across 154 records** (54 fallback, 50 dark-mobile exam/review, 50 narrow-mobile exam/review), also with zero JavaScript errors. Every tested full-slice layout scored **25/25**. See `browser-summary.json` for source/evidence SHA-256 hashes. The targeted command is:

`node --test --test-concurrency=1 tests/*mbb*.test.js tests/*feedback*.test.js`

The source-controlled audit suite adds 46 tests, including independent per-item key checks, numeric/design reconstruction, assumptions, source labels, keyboard/touch behavior, fallback completeness, live grounding-guard decimals and preservation of 150 other records/24 assets. Those key checks enforce the manually adjudicated answers; they are not represented as automated proof of every semantic judgment.

The actual-player browser run covers desktop 1440×1000, tablet 768×1024 and mobile 390×844. It exercises all four choices per question, flags, navigation retention, calculator/formulas, 25/25 scoring, all 25 answer reviews and deliberately missed retries for Q84/Q96/Q97. Supplemental runs cover dark mobile, 320px width and every static visual at desktop/tablet/mobile in both themes, including open data tables and horizontal reachability.

### Source alignment and limitations

Current ASQ CMBB BoK topic mappings were checked against the official published PDF. Chapter/page references are explicitly to **Kubiak's 2012 handbook**, whose organization reflects an older BoK. The tracker records directly inspected passages separately from retained broader ranges; it does not certify that every page in every range was reread. Revised scenarios/assumptions and Q99 run matrices are explicitly authored educational data, not facts recovered from the source. Model-based cautions are identified as audit analysis rather than silently attributed to the book.

Primary references: ASQ CMBB BoK (`https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf`); NIST D-optimal designs (`https://www.itl.nist.gov/div898/handbook/pri/section5/pri521.htm`); NIST NHPP power law (`https://www.itl.nist.gov/div898/handbook/apr/section1/apr191.htm`). Relevant Kubiak passages are itemized in the tracker, including pp. 116, 163–169, 204, 213–217, 241–251, 291, 294–295, 311–316, 336–337, 428 and 445–450.

**Release limits:** browser tests use offline authentication and in-memory storage with the actual player/feedback code. They do not establish live sign-in, cloud durability, cross-device synchronization or physical iPhone Safari. Screenshots suppress the unrelated sticky header only during capture; interactions use the real header. Font fallback uses available system fonts. No student-response data were used to estimate item difficulty, discrimination, DIF or exam reliability; those remain uncalibrated. The dependency tree is unchanged and has not received security clearance in this audit.

Batch 3 publication remains unresolved and separate. Batches 1–2's outstanding source-range review is not silently closed by this work. Full-bank acceptance and human-approved release remain separate. **Batch 5 has not begun.**
