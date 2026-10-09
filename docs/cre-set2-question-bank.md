# CRE Set 2 — original practice bank

Batches 1–4 provide Q001–040, forty of a planned 150 core questions. Batch 4 appends Q031–040 without changing the first thirty items. Sets 1 and 3 are managed separately. These are original practice items informed by the supplied handbook and the public ASQ Body of Knowledge, not reproduced or purported past ASQ examination items. Difficulty labels are editorial targets; equivalence to the live examination has not been established through candidate-response data.

## Authoritative blueprint

- [ASQ CRE certification and current exam format](https://www.asq.org/cert/reliability-engineer): 165 displayed CBT items, including 150 scored and 15 unscored, with 258 minutes of exam time. Checked 2026-10-09.
- [ASQ published 2025 CRE Body of Knowledge](https://www.asq.org/cert/resource/pdf/certification/2025-CRE-BoK.pdf): domain allocations 29, 25, 35, 35, 26. The PDF's internal footer says “2024 CRE BoK”; use its published topic codes and allocations.
- Karen Hulting and Mary McShane-Vaughn, editors, *The ASQ Certified Reliability Engineer Handbook*, fourth edition (2025), user-supplied EPUB. Technical concepts checked in Chapters 1–13. No text, figures, or book files are copied into the site.

The supplied handbook appendix lists older allocations (25/25/35/35/30) and nests maintainability under V.B. The published ASQ PDF takes precedence for the bank blueprint; maintainability is V.C. A 10-item timed practice session is 938 seconds (15:38), proportional to 258 minutes / 165 displayed questions. A 20-item session is 1,876 seconds (31:16); a 30-item session is 2,815 seconds (46:55); a 40-item session is 3,753 seconds (62:33). A completed 150-item core is not a full 165-item CBT replica.

| Official domain | Final core target | Batch 1 | Batch 2 | Batch 3 | Batch 4 | Authored | Remaining |
|---|---:|---:|---:|---:|---:|---:|---:|
| I. Reliability Fundamentals | 29 | 2 | 2 | 2 | 2 | 8 | 21 |
| II. Risk Management | 25 | 2 | 1 | 2 | 2 | 7 | 18 |
| III. Probability and Statistics for Reliability | 35 | 2 | 3 | 2 | 2 | 9 | 26 |
| IV. Reliability Planning, Testing, and Modeling | 35 | 2 | 3 | 2 | 2 | 9 | 26 |
| V. Lifecycle Reliability | 26 | 2 | 1 | 2 | 2 | 7 | 19 |
| Total | 150 | 10 | 10 | 10 | 10 | 40 | 110 |

The cumulative 8/7/9/9/7 mix closely follows the official blueprint at forty questions. Later batches must fill the remaining allocations rather than repeat an equal-domain quota throughout. Authored counts describe the branch; release status is controlled by the pull request and merge.

## Batch 1 ledger

| ID | BoK | Skill / decision | Evidence | Target difficulty | Key | Handbook chapter |
|---|---|---|---|---|---|---:|
| 001 | I.B.1 | Operational availability, all downtime | Operating-time table | Moderate | B: 90.00% | 2 |
| 002 | I.A.7 | Ethical reporting after failure and retest | Scenario | Moderate | C | 1 |
| 003 | II.B.1 | Fault tree with a repeated basic event | AND/OR diagram and alternative data | Challenging | D: 0.0140 | 4 |
| 004 | II.B.2 | Apply an explicit FMEA severity override | Approved FMEA table | Foundational | A | 4 |
| 005 | III.A.1 | Kaplan–Meier risk sets with censoring | Life-test records | Challenging | C: 0.5333 | 6 |
| 006 | III.A.4 | Weibull mission-time ranking and hazard | Two reliability curves and alternative data | Moderate | D | 6 |
| 007 | IV.A.1 | Exact zero-failure binomial demonstration | Calculation scenario | Moderate | B: 29 | 8 |
| 008 | IV.C.1 | Series–parallel success logic | Reliability block diagram and alternative data | Moderate | A: 0.9702 | 10 |
| 009 | V.A.2 | Independent normal stress–strength interference | Calculation scenario | Challenging | C: 0.96% | 11 |
| 010 | V.C.2 | Limits of age-based replacement at constant hazard | Maintenance decision | Foundational | B | 13 |

Six exhibits: three tables and three diagrams/charts. All ten items have four answer rationales, a worked or decision-based explanation, explicit assumptions, one key takeaway, a misconception note, a BoK code, and a handbook section reference. Dedicated lessons are linked only where the existing content is relevant; gaps are disclosed rather than linking every item to a general introduction.

## Batch 2 ledger

| ID | BoK | Skill / decision | Evidence | Target difficulty | Key | Handbook chapter |
|---|---|---|---|---|---|---:|
| 011 | I.A.5 | Critical path changes after float is consumed | Activity network and alternative table | Moderate | A: 17 days | 1 |
| 012 | I.A.8 | Supplier material/site change qualification | Scenario | Moderate | D | 1 |
| 013 | II.B.3 | Shared supply defeats assumed independence | Scenario | Foundational | B | 4 |
| 014 | III.A.2 | Fault probability given a diagnostic alarm | Conditional-probability table | Challenging | C: 26.9% | 6 |
| 015 | III.A.7 | Time-terminated lower MTBF confidence bound | Explicit left-tail chi-square table | Challenging | B: 300.2 h | 6 |
| 016 | III.B.6 | FRACAS effectiveness and technical closure | Scenario | Moderate | A | 7 |
| 017 | IV.B.1 | Pool accelerated exposure at use conditions | Stress-group exposure/failure table | Moderate | C: 2,000 h | 9 |
| 018 | IV.A.1 | Invert a cumulative Duane growth forecast | Log–log forecast chart and alternative data | Challenging | D: 5,657 unit-hours | 8 |
| 019 | IV.B.3 | Producer risk under an acceptance rule | Fixed-trial scenario | Moderate | A: 26.4% | 9 |
| 020 | V.C.3 | Active corrective-repair time percentile | Lognormal calculation scenario | Moderate | D: 3.80 h | 13 |

Five new exhibits (three tables and two figures), bringing the released bank to eleven exhibits. Every question retains the complete feedback contract. The cumulative answer-key positions are balanced at five A, five B, five C, and five D. Batch 2 targets one foundational, six moderate, and three challenging items; these are editorial judgments pending response data.

## Batch 2 technical review

- Q011 uses a dependency-table forward pass. C has one day of float; its two-day overrun changes the controlling path and extends total duration from 16 to 17 days.
- Q014 counts 180 true and 490 false alarms in an equivalent population of 10,000. The denominator includes all alarms.
- Q015 distinguishes fixed exposure from failure termination and explicitly defines left-tail chi-square notation. Independent Poisson-CDF inversion checks the MTBF bound; an Erlang CDF checks every supplied quantile.
- Q017 assumes validated, known acceleration factors and the same exponential mechanism. A likelihood-grid check verifies the pooled estimate and includes the zero-failure group's exposure.
- Q018 labels the growth curve as a conditional forecast, uses genuinely logarithmic coordinates, and distinguishes total from additional exposure and cumulative from instantaneous MTBF. An integer search verifies the target crossing.
- Q019 independently convolves twenty Bernoulli distributions to check rejection probability. The good-quality reference is stated so producer's risk is unambiguous.
- Q020 uses numerical normal integration to check the proposed lognormal percentile, with separate mean/median/95th-percentile distractors. Waiting time is explicitly excluded.
- Q012, Q013, and Q016 have one best-supported decision based on the stated conditions; none relies on an unstated company rule or an arbitrary numerical cutoff.

## Batch 3 ledger

| ID | BoK | Skill / decision | Evidence | Target difficulty | Key | Handbook chapter |
|---|---|---|---|---|---|---:|
| 021 | I.B.2 | Express a mission-reliability requirement | Scenario | Foundational | C | 2 |
| 022 | I.B.4 | Prioritize a cause from controlled evidence | Torque/material-lot comparison table | Moderate | A | 2 |
| 023 | II.A.2 | Use conditional event-tree branches | Event tree and alternative branch table | Challenging | D: 0.010/year | 3 |
| 024 | II.C | Reassess risk introduced by a mitigation | Scenario | Moderate | B | 5 |
| 025 | III.A.6 | Interpret p-chart limits with changing n | Control chart and observation table | Moderate | B: Week 2 | 6 |
| 026 | III.B.2 | Preserve interval/right censoring | Inspection scenario | Moderate | C | 7 |
| 027 | IV.B.2 | Validate a production screen after HALT | Scenario | Moderate | D | 9 |
| 028 | IV.C.3 | Compute an Arrhenius life-ratio factor | Temperature/activation-energy calculation | Challenging | A: 7.95 | 10 |
| 029 | V.A.3 | Distinguish an interaction effect from its coefficient | Interaction plot and cell-mean table | Challenging | A: −500 h | 11 |
| 030 | V.C.1 | Size spare stock for lead-time coverage | Poisson cumulative lookup table | Moderate | D: 8 spares | 13 |

Batch 3 adds five evidence exhibits (two tables and three diagrams/charts) and two review explorations. The bank now has sixteen evidence exhibits and six review tools. The thirty answer positions are balanced as eight A, seven B, seven C, and eight D. Five Batch 3 questions are quantitative; the other five assess engineering decisions or data interpretation. Difficulty targets are one foundational, six moderate, and three challenging.

## Batch 3 technical review

- Q021 includes function, duration, environment, and success probability; confidence is identified as a separate verification-plan issue. Q022 prioritizes a torque-related explanation across both material lots without claiming a sole cause or significance from the displayed counts alone.
- Q023 specifies both safeguards are called on each demand. Joint demand states independently verify that the marginal B probability and conditional branch probability are consistent. The answer remains a frequency, not an exact annual event probability.
- Q024 addresses secondary risk created by mitigation. Q026 preserves failure intervals and known survival times rather than assigning unobserved exact failures. Q027 separates destructive margin discovery from a validated production screen and avoids a numerical life guarantee.
- Q025 independently builds each binomial count distribution and derives its mean and variance to check the three-sigma signal. Only the specified single-point rule applies. The review control keeps the observed percentage fixed with integer counts (9/200, 18/400, 36/800) while recalculating the limits.
- Q028 is checked by numerical integration of log-rate sensitivity over absolute temperature, independently of the displayed reciprocal-temperature formula. The review curve clearly states that extending the model range is hypothetical and is not permission to increase actual test stress.
- Q029 checks the interaction through the change in simple effects across B levels. It distinguishes the −500-hour effect from the −250-hour coded coefficient and makes no significance claim without within-cell variation.
- Q030 checks every displayed Poisson cumulative value and searches the unrounded distribution for the minimum stock. Lead-time no-shortage probability is explicitly distinguished from unit fill rate.

## Batch 4 ledger

| ID | BoK | Skill / decision | Evidence | Target difficulty | Key | Handbook chapter |
|---|---|---|---|---|---|---:|
| 031 | I.A.2 | Distinguish initial conformance from reliability | Service-drift scenario | Foundational | B | 1 |
| 032 | I.A.6 | Compare lifecycle cost subject to reliability | Design/cost input table | Moderate | C: Design C | 1 |
| 033 | II.A.1 | Investigate robustness across noise conditions | Parameter diagram and role table | Moderate | A | 3 |
| 034 | II.A.3 | Identify model-form and extrapolation risk | Early-life forecasting scenario | Challenging | D | 3 |
| 035 | III.A.4 | Condition mission survival on known age | Weibull survival curve and data table | Challenging | C: 0.6977 | 6 |
| 036 | III.B.1 | Compare field cohorts at the same attained age | Cohort follow-up table | Moderate | B | 7 |
| 037 | IV.B.3 | Apply a sequential-test stopping rule | Explicit plan/input table | Challenging | D: Continue | 9 |
| 038 | IV.C.2 | Match sustained thermal loading to creep | Mechanism scenario | Moderate | A | 10 |
| 039 | V.A.1 | Distinguish design verification and validation | Intended-use trial scenario | Moderate | C | 11 |
| 040 | V.B.1 | Enforce temperature-dependent power and voltage limits | Derating curve and endpoint table | Moderate | B: 8.81 V | 12 |

Batch 4 adds six evidence exhibits (three tables and three diagrams/charts) and two completed-review explorations. The bank now has twenty-two exhibits (eleven table-only exhibits and eleven diagrams/charts) and eight review tools. The forty answer positions are balanced at ten each of A, B, C, and D. Four Batch 4 questions are quantitative; six assess engineering decisions or evidence interpretation. Difficulty targets are one foundational, six moderate, and three challenging, pending candidate-response calibration.

## Batch 4 technical review

- Q031 distinguishes a valid dispatch inspection from later loss of required accuracy without implying that either quality or reliability alone guarantees safety.
- Q032 applies the mandatory reliability threshold before an undiscounted five-year cost comparison. Summing five annual cash flows independently verifies the eligible minimum of $150,000 for C. A ties that cost but is ineligible; B and D each total $160,000.
- Q033 identifies control, signal, noise, response, and error roles. Laboratory control of a noise factor does not change its role under the stated field conditions.
- Q034 distinguishes fitted-parameter uncertainty from model-form and extrapolation uncertainty. More young-unit data or a higher nominal confidence level does not automatically capture an unobserved wear-out mechanism.
- Q035 independently integrates hazard from age 800 to 1,000 to verify conditional survival 0.6977. A separate density integration checks the unconditional failure-mass distractor; all plotted data values are verified. The increasing-hazard population is explicitly unrepaired and has known parameters.
- Q036 requires a common attained-age comparison using unit-level failure/censoring records. The new cohort cannot establish 24-month performance after only three months of follow-up.
- Q037 independently computes the ratio of two Poisson masses to verify 1.3134, between one ninth and nine. The practice plan supplies all boundaries and excludes an earlier stopping decision. The explorer classifies separate hypothetical states at fixed exposure; it does not imply that a stopped sequential test may be resumed or that the displayed boundaries reproduce a named standard.
- Q038 links sustained elevated-temperature loading and progressive permanent strain to creep rather than cycling, instantaneous overload, or unobserved corrosion loss.
- Q039 identifies an omitted intended-use requirement despite passing documented-input checks. The correction includes both revised verification and intended-use validation.
- Q040 independently interpolates down from the two-watt endpoint and searches feasible voltages using current-squared resistance. At 100 °C, rated power is 1.29412 W, policy-allowed power 0.77647 W, and the power-based voltage limit 8.8118 V, below the separate 10 V limit. The review tool demonstrates both governing constraints without changing the original answer.

## Learning and examination behavior

- Four-option single-best-answer items in the existing Full, Quick, and Focused modes. Set 2 is the available default while Set 1 is absent; empty Set 1 cannot be selected. The partial release is clearly identified.
- The exam directory lists CRE as available with the explicit label “Set 2: 40 questions available.” CQA remains the single coming-soon certification.
- Completed-attempt review adds eight optional explorations: Weibull mission duration, zero-failure confidence/sample size, diagnostic prevalence/predictive value, acceptance threshold/producer risk, p-chart sample size, Arrhenius test temperature, sequential-test failure count, and component-derating temperature. These never alter the original item, answer key, or score, and are absent from the live question and retry interfaces.
- Existing answer reveal and retry behavior remains in place. Revealed answers count as incorrect in the original score; corrections do not rewrite that score.
- Mathematical working uses the shared pinned MathJax renderer. Equations are typeset in live reveal, completed review, and retry feedback.
- SVG figures use text labels and solid/dashed lines rather than color-only distinctions. Captions, descriptions, data alternatives, table headers, keyboard-focusable scroll regions, and live explorer outputs support accessible use. Exhibits scroll internally on narrow screens.

## Integration contract

`test-bank-cre-set2.js` owns Set 2 and stable `cre:set-2:001` through `cre:set-2:040` IDs. Append future questions without renumbering released IDs. `registerCRESet2` merges Set 2 into `EXAMS.cre` and preserves existing Set 1 arrays/content. It never assigns the Set 2 array to Set 1. Set 1's integration should use its own file and call order that preserves this registration.

The five Set 2 subtopic identifiers are `cre-fundamentals`, `cre-risk`, `cre-statistics`, `cre-testing`, and `cre-lifecycle`. If Set 1 uses more granular identifiers, merge these as aliases into matching official domains; do not double the blueprint weight. The production edge must retain the CRE data and UI scripts. The presentation module is scoped to the CRE Set 2 ID prefix; a text/table fallback preserves diagram logic if that module is unavailable.

## Validation

- Ten CRE-specific tests check complete question metadata, current domain allocations, valid lesson anchors, Set 1/Set 3 preservation, independent numeric answers, production edge inclusion, all modes, pacing, scoring, review tools, reveal/retry math requests, and presentation fallback.
- SHA-256 assertions lock the first ten, twenty, and thirty questions to their prior versions, including options, feedback, references, and metadata. New questions carry batch number 4 and stable appended IDs.
- The production-player test completes all forty items, verifies the twenty-two exhibits/eight review tools, changes and resets both new controls, and checks unchanged question data and scores. A full 40-item practice session uses 3,753 seconds; default Quick draws twenty items, and focused Fundamentals contains eight questions.
- Existing current-attempt review and student-audit suites cover other active certifications and modes. The Chromium/WebKit directory audit exercises all forty CRE items and all eight review tools at desktop/mobile widths in light/dark themes, including page overflow and immutable scores.
- Browser fixtures block external requests, so those audits do not establish actual MathJax glyph rendering. Local jsdom verifies typesetting requests, not glyph layout. SVG geometry is rendered separately for visual inspection. Preview/auth limitations and final CI results are recorded in the PR.
- Run the scoped CRE, directory, current-attempt review, reveal, stateless-result, CQE regression, and student suites plus `npm run build:site`. Exclude generated build changes from the PR.

## Next batch gate

Choose the next ten items against the remaining blueprint; avoid repeating the existing forty items’ principal skills. Independently solve every numerical key and distractor, confirm one best answer and all necessary assumptions, use visuals only when they supply evidence or aid reasoning, verify the complete learner flow, and update this ledger before release. Candidate feedback should inform later difficulty calibration.
