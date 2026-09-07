# ASQ Master Black Belt Simulation Exam — Set 3
## Batch 7: canonical Questions 151–175

**Status: Passed after corrections in the tested review build.** This is the final 25-question batch. All seven batch records together cover the 175 canonical items; this is not a new semantic re-audit of Q1–150 or unrestricted production-release approval. No merge or deployment was performed. Human review and outstanding PR-wide checks remain required.

## Scope and evidence

Baseline: `3d4ea284e1493ef200c167eb926670073d325637`. Final tested application: `75731a3b3770d594c267eb95d915b4ea153eb531`. Accepted exact-source run: `34139524940`. The completion commit contains audit documentation only. Stable IDs are `mbb:set-3:d6-041` through `mbb:set-3:d6-065`; student session positions can differ because the exam is shuffled.

Every Q1–150 byte is preserved: SHA-256 `67b24b988802ba5073c9db4ca41df48fda21664a0335d24694a8817a28523447`. The closing JavaScript trailer is also preserved: SHA-256 `2d06d874c33463730929799a11508fd6c3bf9402321145fd3cbb09cb2d813f46`. All 175 IDs and stored answer positions are unchanged. Earlier suffix guards now protect the unchanged closing trailer; the independent final-batch prefix guard protects the entire previously audited bank.

## Required audit record

| Category | Result |
|---|---|
| Questions individually reviewed, answered and retested | 25/25: Q151–175 |
| Passed unchanged | 0 |
| Corrected | 25 |
| Stored answer positions changed | 0; intended positions were retained, not assumed technically sound |
| Incorrect original option-letter references | None found |
| Independent option rationales | 100, covering all four choices per item |
| Cross-question references removed | 6: Q155, Q159, Q162, Q166, Q167, Q173 |
| Authoring commentary | Removed in Q151/Q174 and replaced with student-facing decisions |
| Technical/interpretation errors | Event identity versus row identity; freshness versus screen refresh; score versus probability; fault-tree state timing and dependence; tolerance bounds versus variance; verification versus validation; unjustified universal design/retention/testing prescriptions |
| Missing data/context | Explicitly supplied and labeled: join keys and amounts, common-demand probabilities, assembly relationship and acceptance criterion, risk horizon, feasible actions, comparative scoring convention and safety gate |
| Visual items | All five retained: Q151, Q163, Q166, Q168, Q171; four table-only items and one house-of-quality status sketch with an accessible table |
| Answer-revealing evidence | Q168's gate-definition table replaced by scenario probability inputs |
| Actual rendered usability corrections | Inappropriate DOE study link on final-batch cards; Q151 numeric values could move out of the narrow review viewport at maximum horizontal scroll |
| Interaction concerns | An initial WebKit-mobile option-analysis timeout is retained in failure history; no unsupported root-cause claim |
| Exact normalized duplicates | 0 involving the batch among 450 MBB stems |
| Related tasks | Individually screened and differentiated; shared statistical and design competencies remain intentional |

## Question-by-question disposition

Each row passed after corrections in the tested build. The complete original and corrected content, detailed findings and independently reasoned solution are preserved in `revisions.json`. These concise summaries are not a replacement for the individual records.

| Q | Stable ID suffix | Key | Specific correction and independently supported decision |
|---|---|---|---|
| 151 | d6-041 | A | Retain all eight observed DOE means, add units and distinguish spatial presentation from new evidence. Conditional A effects are 9 and 18 nm/min at the stated corners; max 89 is observed, not a proven global optimum or significant difference. |
| 152 | d6-042 | D | Verify 5³=125 versus 2³=8 settings before replication. Add the 30-trial constraint and curvature need; choose a feasible design rather than universally prescribing two levels. |
| 153 | d6-043 | B | Establish event, population, promise-date convention, ownership and versions before aggregating differently defined on-time metrics; preserve legitimate labeled local variants. |
| 154 | d6-044 | D | Distinguish source rows, assets and business events, with cross-system reconciliation and ambiguous-match handling. Eight percent duplicate rows is not eight percent overstatement relative to the corrected total. |
| 155 | d6-045 | A | Control misuse of stale information and specify end-to-end age/coverage requirements. A refreshed screen or staleness note alone cannot make old data fit a current operational decision. |
| 156 | d6-046 | C | Separate failure probability from severity and preventable loss; specify equal inspection effort, common horizon, additive benefits and mandatory constraints before a discretionary ranking. |
| 157 | d6-047 | D | Reject full-dataset target encoding before a validation split; use training-only/out-of-fold preprocessing and evaluate regularization, unseen categories and relevant subgroup performance. |
| 158 | d6-048 | B | Require purpose-based lifecycle rules and qualified organizational review; do not invent legal periods, label all old data invalid or treat archiving as anonymization. |
| 159 | d6-049 | D | Define first-pass yield and valid pooled numerators/denominators. Separate within-line changes from mix changes and avoid causal managerial rankings from raw heterogeneous yields. |
| 160 | d6-050 | B | Prove that an inner join can keep three rows while duplicating E1, dropping E2 and reducing total amount from 600 to 500. Validate identity, multiplicity, coverage and measures, not count alone. |
| 161 | d6-051 | C | Address decision rights, criteria, ownership and outcome follow-up rather than declaring a formal maturity level or prescribing software; justified no-action decisions remain valid. |
| 162 | d6-052 | D | Test change control after a canonical definition exists: changed denominator means changed semantic identity, with versioning, lineage and downstream impact review. |
| 163 | d6-053 | A | Rebuild an explicit house-of-quality review-status sketch. The unfinished roof needs a technical relationship review; a blank is not zero correlation, and judgments are not automatically measured Pearson correlations. |
| 164 | d6-054 | A | Operationalize speed with a justified population, statistic, start/end events, failure handling and target. Successful-case averages can conceal tail delays and timeouts; no universal 90-second target is invented. |
| 165 | d6-055 | D | Require traceable verification evidence, criteria, configuration and appropriate methods, not a mandatory document title; intended-use validation remains distinct. |
| 166 | d6-056 | D | Label the weighted −2 to +2 scale as a concept-scoring adaptation, not classical Pugh-only notation. Score +1.05 neither proves safety nor establishes an absent comparison; a relative safety decrement is not itself an absolute failure. |
| 167 | d6-057 | D | Replace the false choice between exhaustive DOE and unsupported release with a feasible, risk-based evidence plan. Low volume and tight deadlines do not waive mandatory criteria. |
| 168 | d6-058 | C | Define A/B unavailability at the same specified demand. P(A∩B)=0.02×0.10=0.002=0.20%; an AND gate does not imply independence or identical failure-onset times. |
| 169 | d6-059 | A | Distinguish noise testing of one design from control-by-noise comparison for robust parameter selection; assess both target mean and sensitivity, then confirm intended-use performance. |
| 170 | d6-060 | B | Drawing tolerances do not determine standard deviations. Treat predicted Cpk as a conditional model with justified mean/variation/dependence assumptions, not observed stability or a guaranteed defect rate. |
| 171 | d6-061 | D | Preserve the five original bounds but add an explicit additive relationship and ±0.25 mm hard requirement. Worst case ±0.32 mm fails; eliminating component 1 still leaves ±0.30 mm. Qualitative cost labels do not identify a unique optimum. |
| 172 | d6-062 | C | Require mission-, mechanism- and configuration-relevant system evidence; acceleration needs a justified stress-life relationship, not arbitrary high-stress hours or a universal test prescription. |
| 173 | d6-063 | A | Distinguish a legitimate initial discovery aspiration from design-freeze requirements. Agree measurable customer-linked objectives and criteria before freeze without banning bounded exploratory work. |
| 174 | d6-064 | C | Trace a changed need through requirement/design versions and evidence; preserve unaffected valid work and reassess affected analyses rather than counting templates or prescribing a rigid universal sequence. |
| 175 | d6-065 | C | Apply customer-to-technical translation to digital-service load, latency tails, failures and output quality; physical prototypes, success-only averages and code coverage do not establish intended-use performance. |

## Independent quantitative verification

Calculations use actual revised inputs, not the stored answer position. Python exact fractions, NumPy factorial contrasts and a separately executed SQLite join provide independent checks in `independent-verification.json`.

**Q151:** All original means 42, 51, 58, 64, 55, 67, 71 and 89 nm/min are retained. The saturated eight-corner algebra reproduces all means and the conditional comparisons. No replicate variance, significance test or global optimum is fabricated.

**Q152:** Five levels for each of three factors require 125 combinations; two levels require eight. The ratio is 15.625 and the difference 117 settings, before replication or confirmation. The 30-trial constraint is a newly explicit case premise, not a claim about an external study.

**Q154:** If extra rows are exactly 8% of the combined rows and duplication is the only issue, overstatement relative to the corrected unique total is 8/92=8.69565%. The revised question distinguishes those denominators rather than silently converting one into the other.

**Q160:** SQLite independently produces (E1,100), (E1,100), (E3,300) from the given three events and duplicate lookup key. Three rows survive, but E2 is missing and the amount total is 500 rather than 600. The case is an explicit counterexample to a row-count-only validation claim.

**Q166:** The weighted sum is 0.25(2)+0.30(2)+0.20(1)+0.25(−1)=21/20=1.05. It is a comparative index, not a probability or evidence that an absolute safety limit was met. The numeric entries are retained; the scoring convention and release gate are clarified.

**Q168:** The newly explicit common-demand probabilities give intersection 0.002, union 0.048 and an inapplicable independent product 0.0006. The joint distribution is coherent: both=0.002, A-only=0.018, B-only=0.028, neither=0.952. The original item was a qualitative gate question with an answer-revealing table, not a previously miscomputed 0.20% result.

**Q171:** Independent enumeration of all 32 extreme sign combinations establishes the exact additive range [−0.32,+0.32] mm. The explicitly introduced ±0.25 mm criterion leaves a 0.07 mm half-width gap. Even eliminating the cheapest component's 0.02 mm leaves 0.30 mm. Root-sum-square gives 0.1593738 mm but is not an all-combinations guarantee. The original question lacked the assembly equation and limit; this report does not pretend the original stated the newly supplied acceptance limit.

## Source alignment and limitations

ASQ's CMBB Body of Knowledge supports the VI.C/VI.D/VI.E topic mapping, with related propagation, capability and reliability topics explicitly cross-mapped. VI.E names QFD and concept-generation methods; the audit does not invent separately named Pugh, CTQ-tree or verification-plan subtopics in that section. Primary references include ASQ QFD/House of Quality materials, NIST DOE/robust-design/capability/reliability guidance, the UK Government Data Quality Framework, PostgreSQL join documentation, scikit-learn target-encoding documentation and NASA requirements/verification guidance.

The NRC NUREG-0492 landing page establishes the handbook's publication identity. Its PDF could not be retrieved; no handbook page number or claim of full-text inspection is fabricated. The conditional-probability result is independently derived from the scenario. Source references support principles, not ASQ authorship or endorsement of these original questions. Added conditions and illustrations are labeled in the questions; no unavailable empirical p-values, intervals, regulatory deadlines or operating data were invented.

## Rendered corrections and inspections

All five original visual items remain. Q163 is a simplified status diagram plus a fully labeled table, not an unrelated decorative image. Q168's former gate-definition table supplied the answer; the replacement supplies the scenario's three probability inputs. Tables have captions, scoped headers, units, deliberate scroll regions and visible access guidance.

Individual inspection found two additional issues not adequately covered by initial passing checks. First, all final-batch review cards linked to the DOE lesson, including data-governance and DFSS items. The scoped footer now shows the actual item-specific primary source with the label **Reference**, rather than misrepresenting an external source as a platform lesson. Hrefs, labels, HTML escaping and allowed HTTPS domains are tested.

Second, Q151's left-aligned numeric values could move outside a very narrow review viewport at maximum scroll. Numeric columns now use consistent right alignment and tabular figures. The revised browser check uses actual text-range coordinates to ensure the rightmost values are visible, rather than merely present in the DOM. Final captures were reopened and checked after the repair.

All 25 questions received individual complete light-theme desktop/mobile question and expanded-review inspection (100 primary views), plus 20 dark-theme views of the five visual questions. All 100 corrected-reference footer views were checked across two layouts and both themes. Twenty-four supplemental mobile right-edge regions were inspected. The resulting numeric repair was then reopened in 16 mobile and eight desktop table-region captures. The final browser matrix reopens every item after all application corrections. Source identities and the precise inspection breakdown are preserved in `visual-inspection.json`; supplemental crops are not counted as whole-question views.

## Tests and retests

| Check | Verified final result |
|---|---|
| Dedicated content, numerical, preservation, references and actual-player grading tests | **51/51 passed** |
| Normal/fallback visual compatibility | **2/2 passed** |
| Existing Set 3 integration/traversal tests | **8/8 passed** |
| Combined targeted command | **61/61 passed** |
| Every answer option through the actual player | **100/100 correct grading outcomes** |
| Complete repository regression | **1,752/1,752 passed**, zero failures/cancellations/skips |
| Chromium/WebKit × desktop/mobile × light/dark × question/review | **400/400 rendered checks passed** |
| All five visual items, question/review, four contexts | **40/40 data/access sequences passed** |
| Actual rightmost numeric text-range visibility | **160/160 checks passed** |
| Final reported page errors, detected clipping/page overflow, SVG text-bound errors and scoped axe violations | **0** |

The real player was exercised for all answer positions, keyboard/pointer selection, retained selections after reopening, flags, timer progression, calculator/formula/statistical-table drawers, submission, review filters, expanded rationales, issue-form preparation and reference-footers. No issue-report message was sent. All 175 questions loaded; only the audited 25 were deliberately answered in the browser sessions, yielding 25/175 rather than claiming to have answered all 175 during this batch. Mobile testing is 390×844 browser emulation; desktop is 1440×1000.

The initial application run `34136114487` recorded a WebKit-mobile timeout while opening option analysis after 74 rendered records. Its artifact `10024202663` is retained; the report recorded no page errors. No root cause was established, and this failed attempt is not counted as passing evidence. Later wording/reference/numeric changes were independently required corrections, not a claimed cure for that timeout. All four contexts on final application `75731a3b3770d594c267eb95d915b4ea153eb531` passed without a retry in accepted run `34139524940`. Staging syntax failures and a passing automation run superseded by the visually discovered numeric defect are separately identified in the manifest. Passing the final run does not establish that intermittent failures are impossible.

## Wording and duplicate review

The correct answer was uniquely longest in 25/25 originals versus 4/25 revisions. Median correct-to-median-distractor word-count ratio fell from 3.153846 to 1.0. The original answer positions remain A6/B4/C6/D9; no arbitrary balancing changed established IDs or keys.

No identical normalized stem involving this batch was found among 450 MBB questions. Related tasks were individually differentiated: Q153/Q162 definition versus change control; Q154/Q160 event identity versus join multiplicity; Q164/Q175 service-speed criteria versus broader software requirements; Q165/Q174 prospective evidence planning versus changed-version traceability; Q170/Q171 variation modeling versus hard-bound feasibility. Shared competencies remain intentional. These are expert-review and wording checks, not empirical psychometric calibration or proof of item independence.

## Files and preservation boundary

Batch 7 changes **24 paths**, grouped into application, validation and audit records. All earlier question bytes and IDs are preserved; no package manifest or dependency version was changed. Staging automation is outside PR170.

- `.github/workflows/mbb-set3-batch7-audit.yml`
- `scripts/audit-mbb-set3-batch7.mjs`
- `test-bank-feedback-loop.js`
- `test-bank-mbb-set3-batch7-ui.js`
- `test-bank-mbb-set3.js`
- `test-bank.html`
- `tests/test-bank-mbb-set3-batch1-audit.test.js`
- `tests/test-bank-mbb-set3-batch2-audit.test.js`
- `tests/test-bank-mbb-set3-batch3-audit.test.js`
- `tests/test-bank-mbb-set3-batch4-audit.test.js`
- `tests/test-bank-mbb-set3-batch5-audit.test.js`
- `tests/test-bank-mbb-set3-batch6-audit.test.js`
- `tests/test-bank-mbb-set3-batch7-audit.test.js`
- `tests/test-bank-mbb-set3-batch7-fallback.test.js`
- `docs/audits/mbb-set3-batch07/independent-calculations.json`
- `docs/audits/mbb-set3-batch07/preservation.json`
- `docs/audits/mbb-set3-batch07/question-audit-tracker.json`
- `docs/audits/mbb-set3-batch07/revisions.json`
- `docs/audits/mbb-set3-batch07/sources.json`
- `docs/audits/mbb-set3-batch07/browser-summary.json`
- `docs/audits/mbb-set3-batch07/independent-verification.json`
- `docs/audits/mbb-set3-batch07/psychometric-duplicate-screen.json`
- `docs/audits/mbb-set3-batch07/visual-inspection.json`
- `docs/audits/mbb-set3-batch07/report.md`

## Remaining concerns and final disposition

**Whole-PR release is not approved.** At the latest separately inspected PR CI head `47e8db72`, Batch 3 WebKit-desktop job `101794186269` in run `34138270536` failed. Batch 4 WebKit-mobile job `101794186277` in run `34138270493` was cancelled and therefore is not a completed passing result. The final numeric alignment repair is scoped to Batch 7 and does not clear those earlier-batch gates. Current required checks must complete successfully and a human must review before any merge.

Authentication and remote persistence used isolated fixtures. Production sign-in, durable server storage, cross-device synchronization and physical-phone behavior were not certified. Existing dependency advisories remain separate maintenance work; package manifests and dependency versions were not changed. No candidate-response data were analyzed, so item difficulty, discrimination, reliability and differential item functioning remain uncalibrated.

**Batch 7 completes the scheduled question-by-question audit through Q175. Human review and outstanding PR checks remain release requirements. Nothing was merged or deployed.**
