# CRE Set 2 — original practice bank

Batches 1–12 provide Q001–120, one hundred twenty of a planned 150 core questions. Batch 12 appends Q111–120 without changing the first one hundred ten items. Sets 1 and 3 are managed separately. These are original practice items informed by the supplied handbook and the public ASQ Body of Knowledge, not reproduced or purported past ASQ examination items. Difficulty labels are editorial targets; equivalence to the live examination has not been established through candidate-response data.

## Authoritative blueprint

- [ASQ CRE certification and current exam format](https://www.asq.org/cert/reliability-engineer): 165 displayed CBT items, including 150 scored and 15 unscored, with 258 minutes of exam time. Checked 2026-10-09.
- [ASQ published 2025 CRE Body of Knowledge](https://www.asq.org/cert/resource/pdf/certification/2025-CRE-BoK.pdf): domain allocations 29, 25, 35, 35, 26. The PDF's internal footer says “2024 CRE BoK”; use its published topic codes and allocations.
- Karen Hulting and Mary McShane-Vaughn, editors, *The ASQ Certified Reliability Engineer Handbook*, fourth edition (2025), user-supplied EPUB. Technical concepts checked in Chapters 1–13. No text, figures, or book files are copied into the site.

The supplied handbook appendix lists older allocations (25/25/35/35/30) and nests maintainability under V.B. The published ASQ PDF takes precedence for the bank blueprint; maintainability is V.C. A 10-item timed practice session is 938 seconds (15:38), proportional to 258 minutes / 165 displayed questions. A 20-item session is 1,876 seconds (31:16); a 30-item session is 2,815 seconds (46:55); a 40-item session is 3,753 seconds (62:33); a 50-item session is 4,691 seconds (78:11); a 60-item session is 5,629 seconds (93:49); a 70-item session is 6,567 seconds (109:27); an 80-item session is 7,505 seconds (125:05); a 90-item session is 8,444 seconds (140:44); a 100-item session is 9,382 seconds (156:22); a 110-item session is 10,320 seconds (172:00); a 120-item session is 11,258 seconds (187:38). A completed 150-item core is not a full 165-item CBT replica.

| Official domain | Final core target | Batch 1 | Batch 2 | Batch 3 | Batch 4 | Batch 5 | Batch 6 | Batch 7 | Batch 8 | Batch 9 | Batch 10 | Batch 11 | Batch 12 | Authored | Remaining |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| I. Reliability Fundamentals | 29 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 23 | 6 |
| II. Risk Management | 25 | 2 | 1 | 2 | 2 | 1 | 2 | 2 | 1 | 2 | 2 | 1 | 2 | 20 | 5 |
| III. Probability and Statistics for Reliability | 35 | 2 | 3 | 2 | 2 | 3 | 2 | 2 | 3 | 2 | 2 | 3 | 2 | 28 | 7 |
| IV. Reliability Planning, Testing, and Modeling | 35 | 2 | 3 | 2 | 2 | 2 | 3 | 2 | 3 | 2 | 3 | 2 | 2 | 28 | 7 |
| V. Lifecycle Reliability | 26 | 2 | 1 | 2 | 2 | 2 | 1 | 2 | 2 | 2 | 1 | 2 | 2 | 21 | 5 |
| Total | 150 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 120 | 30 |

The cumulative 23/20/28/28/21 mix closely follows the official blueprint at one hundred twenty questions. Later batches must fill the remaining allocations rather than repeat an equal-domain quota throughout. Authored counts describe the branch; release status is controlled by the pull request and merge.

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

## Batch 5 ledger

| ID | BoK | Skill / decision | Evidence | Target difficulty | Key | Handbook chapter |
|---|---|---|---|---|---|---:|
| 041 | I.A.3 | Facilitate common reliability requirements across functions | Leadership scenario | Foundational | D | 1 |
| 042 | I.B.10 | Resolve incompatible component-interface assumptions | Timing/interface scenario | Moderate | B | 2 |
| 043 | II.B.2 | Rank same-severity FMECA mode criticalities | Rate, mode-fraction, effect-probability table | Moderate | A: Fan bearing seizure | 4 |
| 044 | III.A.3 | Infer Weibull shape and hazard from an explicit-axis plot | Probability plot and transformed-coordinate table | Challenging | C: Shape 2, increasing hazard | 6 |
| 045 | III.A.7 | Match a population requirement to a tolerance bound | Confidence/tolerance bound comparison | Challenging | A | 6 |
| 046 | III.A.5 | Plan mean-estimation precision with known sigma | Sample-size calculation | Moderate | D: 62 specimens | 6 |
| 047 | IV.A.2 | Accumulate hazard across unequal mission phases | Step-hazard plot and use-profile table | Moderate | B: 0.99005 | 8 |
| 048 | IV.B.6 | Align software reliability testing with field demands | Operational-profile scenario | Moderate | C | 9 |
| 049 | V.A.3 | Select a complementary fraction to resolve AB/CD | Eight-run design matrix | Challenging | D | 11 |
| 050 | V.C.2 | Minimize cost rate among candidate replacement policies | Survival/expected-cycle-length table | Moderate | A: 200 h or failure | 13 |

Batch 5 adds six evidence exhibits (four tables and two charts) and two completed-review explorations. The bank now has twenty-eight exhibits (fifteen table-only exhibits and thirteen diagrams/charts) and ten review tools. Answer positions total thirteen A, twelve B, twelve C, and thirteen D. Five new questions are quantitative and five assess decisions or interpretation. Difficulty targets remain one foundational, six moderate, and three challenging; equivalence to live-exam difficulty remains uncalibrated.

## Batch 5 technical review

- Q041 addresses cross-functional reliability leadership without assuming unilateral authority. Q042 distinguishes individually conforming components from compatible system interfaces; the correct action does not suppress legitimate stale-data detection.
- Q043 supplies the complete quantitative FMECA rule. Expected effect counts in 1,000 missions independently verify the indices 0.0064, 0.0090, 0.0030, and 0.0040. All effects have equal severity, and the index is not presented as an exact failure probability. The handbook supplies the FMECA context; [Reliability Analysis Center, FMECA, §4.2 and §4.9, hosted by NASA](https://s3vi.ndc.nasa.gov/ssri-kb/static/resources/a278508.pdf) supplies the supplemental quantitative convention.
- Q044 specifies horizontal log-life and vertical log-cumulative-hazard coordinates. A cumulative-hazard ratio independently checks shape 2, while each plotted coordinate is checked against the displayed probability. Both marked points lie on a fitted line; two such points do not themselves establish model fit. [NIST reliability probability plotting](https://www.itl.nist.gov/div898/handbook/apr/section2/apr221.htm) confirms this orientation; some probability plots reverse the axes and therefore use reciprocal slope.
- Q045 distinguishes mean confidence from population content and distinguishes failure to demonstrate conformity from proof of nonconformity. Validity of both reported bounds is explicit; confidence and content cannot be interchanged.
- Q046 independently searches integer sample sizes using the achieved half-width. At 61 specimens it exceeds 10 MPa; 62 meets the requirement. Known sigma, normality, independence, and the two-sided critical value are explicit. Distractors correspond to rounding downward, a one-sided critical value, and confusing full width with half-width.
- Q047 independently multiplies survival through 10,000 small exposure intervals. It uses conditional phase hazards and actual durations, with no unstated phase independence, repair, or transition failure. The review control substitutes high-stress hours for low-stress hours while keeping ten total hours. Its endpoint survival values are 0.99501 and 0.97045.
- Q048 separates field-demand representativeness from coverage and fault-injection objectives; rare critical scenarios retain targeted testing. More equally weighted scripts alone do not correct a field-use mismatch.
- Q049 enumerates all eight design rows: AB equals CD in the original fraction; reversing only D creates AB equal to minus CD. The combined sixteen rows make the two columns orthogonal. Reversing all four factors reproduces the original fraction, and replication alone cannot remove aliasing. [NIST alternative foldovers](https://www.itl.nist.gov/div898/handbook/pri/section3/pri3382.htm) supports targeted sign reversal. Between-stage effects and execution randomization are acknowledged.
- Q050 checks all supplied moments against a concrete compatible lifetime distribution, then averages replacement costs and operating lengths across its outcomes. The rates are $2.182, $1.451, $1.600, and $2.000 per operating hour. Costs are mutually exclusive totals; replacement restores an independent cycle; only the four supplied policies are compared. The review tool varies failure cost, demonstrates a different preferred policy at $500, $600, $1,000, and $4,000, and makes no claim of an optimum over untested ages.

## Batch 6 ledger

| ID | BoK | Skill / decision | Evidence | Target difficulty | Key | Handbook chapter |
|---|---|---|---|---|---|---:|
| 051 | I.B.5 | Adapt reliability activities to lifecycle stage | Architecture-planning scenario | Foundational | B | 2 |
| 052 | I.B.9 | Establish a valid DMAIC measurement baseline | Failure-definition/exposure scenario | Moderate | D | 2 |
| 053 | II.B.4 | Recognize a hazard without component failure | Intended-use exposure scenario | Moderate | C | 4 |
| 054 | II.B.5 | Interpret ordinal risk categories | Two-hazard category table | Moderate | A | 4 |
| 055 | III.A.1 | Test independence of line and mission outcome | Complete 2×2 outcome table | Challenging | B: 7.84, reject | 6 |
| 056 | III.A.6 | Distinguish within and overall capability | Spread/specification diagram and input table | Moderate | D: 1.56 and 0.93 | 6 |
| 057 | IV.B.4 | Extrapolate a linear degradation threshold | Measured-point chart and data table | Moderate | C: 1,400 h | 9 |
| 058 | IV.C.1 | Include voting logic and voter reliability | Two-out-of-three block diagram and rule table | Challenging | A: 0.95256 | 10 |
| 059 | IV.C.4 | Check a repair-duration model for transient use | Two-state Markov modeling scenario | Moderate | C | 10 |
| 060 | V.A.4 | Maximize system reliability within cost and mass | Subsystem version table | Challenging | B: A1 with B1 | 11 |

Batch 6 adds six evidence exhibits (three tables and three diagrams/charts) and two completed-review explorations. The bank now has thirty-four exhibits (eighteen table-only exhibits and sixteen diagrams/charts) and twelve review tools. Answer positions are balanced at fifteen each of A, B, C, and D. Five new questions are quantitative and five assess decisions or interpretation. Difficulty targets remain one foundational, six moderate, and three challenging; these remain editorial judgments pending candidate-response calibration.

## Batch 6 technical review

- Q051 distinguishes early design influence from later demonstration and field monitoring, without presenting an early prediction as proof. Q052 places comparable event definitions, exposure records, and data-quality checks in the DMAIC measurement foundation.
- Q053 addresses a hazardous condition that does not require component failure. It tests analysis scope rather than prescribing a protective measure or making a regulatory-compliance claim.
- Q054 explicitly defines the category codes as ordinal. Equal code products cannot establish equal expected loss; the explanation permits approved scoring systems while rejecting an unsupported probability or consequence ratio.
- Q055 uses all four outcome cells, comparable completed missions, and independent random samples. Expected counts are 30 failed and 170 survived for each line. A pooled two-proportion z calculation independently verifies the Pearson statistic, 7.8431. Numerical integration of the two normal tails verifies the supplied one-degree-of-freedom 1% critical value, 6.635. No continuity correction is requested, and association is distinguished from causation. [NIST contingency-table analysis](https://itl.nist.gov/div898/handbook/prc/section4/prc45.htm) supports the expected-count, degrees-of-freedom, and decision conventions.
- Q056 uses the nearer upper specification and the appropriate within/overall standard deviations, yielding Cpk 1.56 and Ppk 0.93. The figure shows mean plus/minus three standard deviations, not confidence limits, observed extrema, or a coverage guarantee. Predictive capability and field reliability are not inferred without the additional assumptions they require. The [Minitab within-capability convention](https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/how-to/capability-sixpack/normal-capability-sixpack/interpret-the-results/all-statistics-and-graphs/within-capability/) and [overall-capability convention](https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/how-to/capability-sixpack/normal-capability-sixpack/interpret-the-results/all-statistics-and-graphs/overall-capability/) provide primary supplemental definitions.
- Q057 independently fits a least-squares line to all three measurements. Its nonzero intercept is 0.04 mm, giving total age 1,400 h versus 800 additional hours from the last observation. The plot shows only the measured interval; continued linearity to threshold is an explicit assumption. This is a point forecast for one slide, not a population reliability demonstration.
- Q058 enumerates all sixteen component-state combinations to verify two-out-of-three reliability with the voter, as well as the one-out-of-three, three-out-of-three, and omitted-voter distractors. The diagram labels the voting rule explicitly so its parallel-looking branches do not imply a one-out-of-three rule. Independence, active sensors, no repair, and excluded shared causes are explicit.
- Q059 limits its critique to a two-state, homogeneous continuous-time Markov model with constant rates. Mean repair time alone does not capture non-exponential transient restoration; smaller solver time steps do not change that assumption. Expanded repair phases are described as a validated approximation, not a universally exact representation. [NASA, An Introduction to Markov Modeling: Concepts and Uses, slides 17–18](https://ntrs.nasa.gov/api/citations/20020050518/downloads/20020050518.pdf) supports the distinction between homogeneous CTMC and more general holding-time models.
- Q060 enumerates all nine A/B version pairs, finds six feasible pairs, and verifies A1/B1 as best with reliability 0.9120, incremental cost $7,000, and added mass 2 kg. The two higher-reliability distractors violate different constraints. Independence and additive incremental resource use are explicit.
- The Q055 review tool varies only Line B's failures, retains both sample sizes and the specified test, and demonstrates zero statistic at equal proportions as well as rejection in either direction. The Q058 tool changes only the required successful-sensor count, producing system reliabilities 0.97902, 0.95256, and 0.71442. Both start collapsed, reset to baseline, and cannot modify the question or score.

## Batch 7 ledger

| ID | BoK | Skill / decision | Evidence | Target difficulty | Key | Handbook chapter |
|---|---|---|---|---|---|---:|
| 061 | I.A.1 | Recognize business value beyond repair charges | Customer interruption scenario | Foundational | A | 1 |
| 062 | I.B.3 | Address the confirmed recurrence path through CAPA | Recipe-control scenario | Moderate | C | 2 |
| 063 | II.B.1 | Identify all and only minimal cut sets | AND/OR fault tree and logic table | Moderate | D: {A}, {B, C} | 4 |
| 064 | II.C | Distinguish financial transfer from technical risk treatment | Hypothetical service agreement | Moderate | B | 5 |
| 065 | III.A.7 | Calculate a one-sided small-sample mean bound | Explicit left-tail critical-value table | Moderate | C: 1,095.7 h | 6 |
| 066 | III.B.4 | Rank failures by total downtime and cumulative coverage | Counts and mean-duration table | Moderate | A: 81.8% | 7 |
| 067 | IV.C.3 | Infer a fatigue exponent and interpolate median life | Log–log fatigue curve and input table | Challenging | D: 27,000 cycles | 10 |
| 068 | IV.C.1 | Apply transfer coverage to cold-standby paths | Standby path diagram and conditions table | Challenging | B: 0.96610 | 10 |
| 069 | V.A.5 | Address an interface-induced service error | Representative-user trial scenario | Moderate | C | 11 |
| 070 | V.C.3 | Separate weighted elapsed repair time from labor | Parallel-work timeline and task table | Challenging | A: 2.75 h; 4.50 person-hours | 13 |

Batch 7 adds six evidence exhibits (two tables and four diagrams/charts) and two completed-review explorations. The bank now has forty exhibits (twenty table-only exhibits and twenty diagrams/charts) and fourteen review tools. Answer positions total eighteen A, seventeen B, eighteen C, and seventeen D. Five new questions are quantitative and five assess decisions or logic. Difficulty targets remain one foundational, six moderate, and three challenging; they are editorial judgments pending candidate-response calibration.

## Batch 7 technical review

- Q061 connects service continuity with lifecycle and customer objectives without promising a numerical return. Q062 starts from a confirmed cause and distinguishes completed containment from action that addresses recurrence and verifies effectiveness. It does not ask the learner to infer a cause from incomplete evidence.
- Q063 uses a complete eight-state truth table and subset elimination to verify the minimal cut sets. The shared event A alone is sufficient; without A, B and C must occur together. No independence assumption is needed for the Boolean reduction. The minimal-cut-set concept is consistent with [NRC, NUREG-0492, Fault Tree Handbook](https://www.nrc.gov/docs/ml1007/ml100780465.pdf), Chapter VII; the item uses its own tree and original wording.
- Q064 stipulates the cost transfer and explicitly holds physical failure and restoration performance fixed. It tests the scope of a hypothetical treatment and makes no interpretation of an actual contract or claim about legal liability.
- Q065 states independent complete observations and an appropriate normal model with unknown population standard deviation. Numerical integration of the Student-t density with nine degrees of freedom verifies the supplied 0.95 and 0.975 percentiles. Inverting the one-sample t statistic verifies the keyed lower bound. [NIST confidence limits for the mean](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm) supports the t/standard-error convention and one-sided testing distinction. The bound concerns the mean, not a percentage of individual lifetimes.
- Q066 reconstructs the per-event durations and verifies total downtime of 143 h. Gearbox and drive faults contribute 117 h (81.8%); gearbox alone contributes 50.3%. The other pairs yield 18.2%, 64.3%, and 45.5%. Records are complete and mutually exclusive; this descriptive ranking is not an economic optimization or an assumed future recurrence rate.
- Q067 fits a straight line to the two log-transformed points, obtaining slope minus three and 27,000 median cycles at 80 MPa. Both axes use true logarithmic coordinates. The raw-scale interpolation, first-power, and reversed-ratio distractors are checked separately. The median model is explicit, conditions stay fixed, and the control is limited to the stated 60–120 MPa interval. This does not infer a confidence bound or a guaranteed minimum life.
- Q068 independently evolves A-active and B-active state probabilities in 200,000 small time steps. It verifies 0.96610 with 90% transfer coverage, 0.98248 with perfect coverage, and 0.81873 with no successful transfer. Idle failure, transfer delay, repairs, and other mechanisms are excluded explicitly. [NIST's standby model](https://www.itl.nist.gov/div898/handbook/apr/section1/apr185.htm) supplies the ideal exponential standby baseline; weighting only the transfer-dependent path gives the stated imperfect-transfer result. The separate active-parallel and whole-system-coverage distractors are also checked.
- Q069 ties the design proposal to the observed interface error and requires representative-user verification under the intended conditions. Training remains supportive; a design change is not treated as effective before it is evaluated.
- Q070 performs a precedence forward pass from the task table. Class A takes 2 elapsed hours and 3 person-hours; Class B takes 5 elapsed hours and 9 person-hours. Weighting by 75%/25% gives 2.75 hours and 4.50 person-hours. The Class B plot shows parallel timing; all Class A inputs remain in the alternative table. Active labor excludes waiting time by explicit definition.
- The fatigue-stress and standby-coverage tools start collapsed, reset to their original values, and leave all question data and the original score fixed. Endpoint checks cover 64,000/8,000 fatigue cycles and 0.81873/0.98248 standby reliability, as well as baseline and intermediate values.
- The branch incorporates main's separately merged Set 3 expansion to 160 questions. Its data file and batch records are unchanged; the production learner test now verifies all 160 Set 3 items remain selectable in that set.

## Batch 8 ledger

| ID | BoK | Skill / decision | Evidence | Target difficulty | Key | Handbook chapter |
|---|---|---|---|---|---|---:|
| 071 | I.A.9 | Interpret OEE alongside direct reliability measures | Two-period monitoring table | Moderate | B | 1 |
| 072 | II.B.6 | Integrate field, controller, and design evidence in system safety | Confirmed restart-hazard scenario | Challenging | D | 4 |
| 073 | III.A.4 | Distinguish density, failure probability, and conditional hazard | Density curve, shaded area, and data table | Moderate | D: 0.001714 per hour | 6 |
| 074 | III.A.3 | Test goodness of fit for a fully specified lifetime model | Prespecified bins and observed/expected counts | Challenging | B: 8.50; 4 df; fail to reject | 6 |
| 075 | III.B.5 | Choose a nondestructive internal-interface examination | Package-delamination scenario | Moderate | A: C-SAM | 7 |
| 076 | IV.A.5 | Assess qualifying product exposure against an approved plan | Chamber/product temperature traces and data table | Moderate | C: 50 min; earliest completion at 100 min | 8 |
| 077 | IV.C.4 | Recognize dependence in Monte Carlo inputs | Joint-temperature modeling scenario | Foundational | B | 10 |
| 078 | IV.A.4 | Apply a predeclared operational mission-failure criterion | Recoverable interruption scenario | Moderate | A | 8 |
| 079 | V.A.6 | Derive diagnostic coverage from a maintainability requirement | Diagnostic path diagram and duration table | Moderate | C: 90% | 11 |
| 080 | V.C.1 | Allow time for detection and completed predictive intervention | Three timing strips and assumptions table | Challenging | D: 80% | 13 |

Batch 8 adds six evidence exhibits (two table-only exhibits and four diagrams/charts) and two completed-review explorations. The bank now has forty-six exhibits (twenty-two table-only exhibits and twenty-four diagrams/charts) and sixteen review tools. The eighty answer positions are balanced at twenty each of A, B, C, and D. Five new questions are quantitative and five assess decisions or interpretation. Difficulty targets remain one foundational, six moderate, and three challenging, pending candidate-response calibration.

## Batch 8 technical review

- Q071 verifies both OEE products and the unchanged descriptive failure frequency, 12/6,000 per operating hour. It avoids inferring equal population rates, identical individual repair durations, or a guaranteed mission from the two aggregate periods.
- Q072 starts from a confirmed system hazard path, maintains existing interim restrictions, and asks for the next engineering action. Component conformance and an empty warranty database cannot override the combined field, controller, and design evidence. The design proposal still requires system assessment and verification before closure.
- Q073 uses a normalized hypothetical density. Trapezoidal integration independently verifies survival, and a numerical derivative of log survival checks hazard at 1,500 h. The PDF height, density/CDF, and CDF/age distractors are checked separately. The plot's shaded area and marker provide reasoning evidence without displaying the keyed hazard. [NIST's hazard definition](https://www.itl.nist.gov/div898/handbook/apr/section1/apr123.htm) supports conditioning the instantaneous rate on survival. No finite-interval probability is asserted from a PDF height.
- Q074 verifies the statistic via the weighted distance between observed and null bin proportions. Null model parameters and bins are fixed before the sample, so degrees of freedom are 5 − 1 = 4. Independent chi-square tail calculations check both supplied critical values. Exact exponential quantiles give each bin probability 0.20; displayed boundaries are rounded. [NIST's goodness-of-fit procedure](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35f.htm) supports the statistic and parameter-estimation distinction. Failure to reject is not proof of model correctness.
- Q075 expressly requires a suitable validated acoustic method and preservation of the package. [NASA NEPP's package-delamination report](https://nepp.nasa.gov/DocUploads/A5EF85E4-08E0-47D7-92134336169C72F6/CSAM_FINAL_REPORT.pdf), introduction, supports C-SAM for nondestructive internal-interface examination and notes material-dependent limitations. The answer distinguishes an indication from confirmation of a root cause.
- Q076 counts qualifying one-minute intervals from the product trace and obtains 50 minutes at minute 90. The approved 83–87 °C band starts the interval at minute 40; reaching exactly 85 °C is unnecessary. The continuous record establishes band entry and uninterrupted exposure, so the problem does not infer unseen behavior from sparse plotted points. The requirement is scenario-specific, not a claim about a universal thermal-soak standard.
- Q077 separates the input joint distribution from simulation sample size. It does not assume a numerical reliability bias or that correlation alone specifies all dependence. Q078 applies the operational failure definition to the original mission; recovery and a subsequent success do not convert an observed failure into censoring.
- Q079 enumerates the two diagnostic paths over 100 repairs for each answer choice. The mean durations are 1.250, 1.125, 1.000, and 0.875 h, establishing 90% as the minimum qualifying coverage. Each path duration includes the initial attempt, and the common half hour is added once. This sets a design-for-testability requirement rather than repeating a labor-hours calculation.
- Q080 independently counts success over 100,000 uniformly spaced onset phases. A ten-day inspection interval gives 80% timely completion; four and eight days give 100%, and twenty days gives 40%. Fixed progression, perfect detection, uniform phase, and complete response duration are explicit hypothetical assumptions. [NASA's RCM guide](https://www.nasa.gov/wp-content/uploads/2023/06/nasa-rcmguide.pdf), section 4.1, provides the condition-monitoring context; the exact probability is derived from this item's stated model, not from a NASA interval recommendation. Separate timing-strip origins avoid implying a fixed inspection phase.
- The branch incorporates main’s separately merged final five Set 3 questions, preserving its data and batch records. The production learner test verifies all 165 Set 3 questions remain selectable.
- Both new controls start collapsed and are excluded from live and retry questions. Density-age endpoints and the inspection-spacing threshold, endpoints, and reset are checked. Original question data, answer keys, and scores remain fixed. All sixteen new inline/display math expressions render without MathJax errors; new figure geometry and worked equations are inspected separately from authenticated page layout.

## Batch 9 ledger

| ID | BoK | Principal skill | Evidence | Difficulty target | Key | Handbook chapter |
|---|---|---|---|---|---|---|
| 081 | I.A.4 | Reliability engineer's early design role | Architecture-review scenario | Moderate | B | 1 |
| 082 | I.B.8 | Quality triangle tradeoffs | Schedule/cost scenario | Foundational | D | 2 |
| 083 | II.A.3 | Cybersecurity-induced loss of function | Connected-system scenario | Moderate | A | 3 |
| 084 | II.C | ALARP and further risk reduction | Explicit hypothetical policy | Moderate | C | 5 |
| 085 | III.A.2 | Sampling without replacement | Population table | Moderate | D: 0.3684 | 6 |
| 086 | III.B.2 | Proportional hazards and survival | Model-input table | Challenging | B: 0.8944 | 7 |
| 087 | IV.C.3 | First crossing under cumulative fatigue damage | Repeating load-block chart | Challenging | C: 16,000 cycles | 10 |
| 088 | IV.C.5 | Independent model validation | New-duty-cycle scenario | Moderate | A | 10 |
| 089 | V.A.2 | Correlated stress–strength interference | Marginal density curves and lookup table | Challenging | B: 2.28% | 11 |
| 090 | V.C.2 | Average hidden-failure unavailability | Proof-test cycle plot | Moderate | D: 0.50% | 13 |

Batch 9 adds five exhibits: two table-only and three figures. Totals are 51 exhibits (24 table-only, 27 figures) and 18 completed-review tools. Answer positions total A=22, B=23, C=22, D=23. Five new items are quantitative; editorial difficulty targets are one foundational, six moderate, and three challenging.

## Batch 9 technical review

- Q081–084 and Q088 distinguish the engineer's early cross-functional contribution, explicit cost/time/quality constraints, cyber-induced functional failure, continued ALARP assessment, and calibration versus independent validation. The ALARP item states a hypothetical company policy, not a legal compliance determination. [HSE, Reducing risks, protecting people](https://assets.publishing.service.gov.uk/media/6634988fcf3b5081b14f30cd/IQ8.10.J_Document_9_Health_and_Safety_Executive__Reducing_risks__protecting_people__HSE_s_decision-making_process__2001.pdf), paragraph 124 and Appendix 3, supports the tolerable-region and gross-disproportion distinctions.
- Q085 enumerates all 190 unordered pairs: 70 contain at least one failure and six contain two. Replacement, addition without overlap correction, and both-failed distractors are independently checked.
- Q086 propagates survival numerically through a nonconstant baseline hazard, independently confirming the cumulative-hazard calculation. A hazard ratio is not a failure-probability ratio. [NIST proportional-hazards models](https://www.itl.nist.gov/div898/handbook/apr/section1/apr167.htm) supports the model; the item makes no causal or exponential-baseline claim. The review control varies only the hazard ratio.
- Q087 counts integer damage units cycle by cycle, reaching the threshold at 16,000 cycles rather than the whole-block average of 16,667. The linear damage rule and constant-amplitude lives are supplied explicitly. This is a supplemental application of Chapter 10 fatigue inputs, not a claim that the handbook teaches Miner's rule. [NASA-hosted cumulative-fatigue research](https://ntrs.nasa.gov/api/citations/19640020692/downloads/19640020692.pdf) provides background and cautions about real load interactions; the question uses an expressly idealized additive model.
- Q089 constructs the paired normal variables from independent latent normals and numerically integrates the failure tail. Positive covariance reduces the variance of the difference. The plot shows marginal densities, not the joint distribution or a shaded failure probability. Lookup values and all numerical distractors are checked independently.
- Q090 integrates unavailability over uniformly distributed demand times, confirming 0.4983% average versus 0.9950% immediately before the test. The four review intervals are independently checked. Perfect detection, instantaneous restoration, hidden failures, and independent demand timing are explicit. This is a supplemental idealized application of Chapter 13 preventive maintenance; [Brissaud and Luiz's PFD modeling paper](https://arxiv.org/abs/1501.06487) provides background, while the exact expression is derived from the stated model. No real equipment interval is recommended.
- All original 80 items remain hash-locked. The two new controls are collapsed and review-only, with reset, keyboard, live-output, and immutable-score checks. SVG geometry receives separate visual inspection; automated player checks verify shared math-renderer requests and paired delimiters, not actual MathJax glyph layout.

## Batch 10 ledger

| ID | BoK | Principal skill | Evidence | Difficulty target | Key | Handbook chapter |
|---|---|---|---|---|---|---|
| 091 | I.B.6 | Choose a maintainability investment using total downtime | Waiting/repair timeline and data table | Moderate | C | 2 |
| 092 | I.B.7 | Recognize broader costs of poor reliability | Warranty/operational consequence scenario | Foundational | A | 2 |
| 093 | II.B.2 | Select functional FMEA before component selection | Concept-stage scenario | Moderate | D | 4 |
| 094 | II.A.2 | Compare expected annual risk-control costs | Cost/probability/consequence table | Moderate | B: Control P | 3 |
| 095 | III.B.3 | Capture short events, preceding conditions, and exposure | Monitoring-plan scenario | Moderate | C | 7 |
| 096 | III.A.3 | Count exactly two failures in eight missions | Binomial calculation | Moderate | A: 0.1488 | 6 |
| 097 | IV.A.3 | Retain consequence-specific acceptance criteria | Criteria/results table | Moderate | D | 8 |
| 098 | IV.B.5 | Explain software failure under changed usage | Latent-defect scenario | Moderate | C | 9 |
| 099 | IV.C.1 | Include load-dependent survivor failure rates | Three-state transition diagram | Challenging | B: 0.9671 | 10 |
| 100 | V.A.3 | Adjust a treatment contrast for material blocks | Cell-mean plot and individual data | Challenging | A: +6 thousand cycles | 11 |

Batch 10 adds five exhibits (two table-only, three figures) and two completed-review explorations. Totals are 56 exhibits (26 table-only, 30 figures) and 20 review tools. The 100 answer positions are balanced at 25 each. This batch contains four quantitative and six decision/interpretation questions; editorial difficulty targets are one foundational, seven moderate, and two challenging.

## Batch 10 technical review

- Q091 compares sequential downtime components at equal annual cost, without asserting a numerical availability change from unspecified uptime. Q092 includes indirect and nonfinancial consequences without inventing monetary values or double counting. Both map to previously uncovered Fundamentals topics.
- Q093 starts with functions before the component architecture exists, consistent with the handbook's functional FMEA treatment. Q095 specifies short-event detection, a pre-event buffer, clock alignment, unique events, and operating exposure rather than treating calendar time or absent snapshots as valid evidence.
- Q094 enumerates 100 equally weighted annual outcomes for each alternative. Certain control costs apply in every outcome, yielding expected totals $16,000/$9,000/$10,000/$11,000. This is an expressly risk-neutral financial comparison with mandatory requirements already met, not a safety acceptance rule.
- Q096 enumerates all 256 binary mission-outcome sequences, confirming exactly-two probability 0.1488 and the fixed-pair/at-least-two/at-least-one distractors. [NIST's binomial distribution reference](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm) supports the probability model.
- Q097 applies both preapproved category-specific criteria. It does not infer a population critical-failure rate from one event or change acceptance criteria retrospectively.
- Q098 distinguishes defect activation from physical wear while retaining state-dependent software failure possibilities. [NASA Software Safety Guidebook, NASA-GB-8719.13](https://s3vi.ndc.nasa.gov/ssri-kb/static/resources/nasa-gb-8719.13.pdf), section 10.5 and footnote 7, distinguishes physical wear from memory leaks and other program errors. The item concerns an identified latent logic defect, not a universal constant software failure rate.
- Q099 supplies the state-probability formulas for the stated load-sharing model. Independent three-state time stepping checks the answer, all numerical distractors, and the review control's four rates, including equal transition rates. The ordinary independent parallel result is recovered only when the original per-unit rate is retained. Chapter 10's Load-Sharing Systems discussion supports why changed load can change the survivor's failure rate.
- Q100 fits an intercept, treatment indicator, and block indicator to all eight observations using independent linear-equation elimination: adjusted treatment contrast +6, block contrast +20, versus pooled treatment difference +16. The estimator and no-interaction assumption are explicit. [NIST randomized-block guidance](https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm) supports accounting for nuisance blocks; its balanced-design marginal-mean formulas are not used for this unequal-allocation example. No significance or confidence claim is made.
- The two new controls remain collapsed and review-only, with endpoint, equal-rate, reset, keyboard, and immutable-score checks. New SVG figures and review plots were rendered and inspected; shared renderer requests are checked separately from authenticated MathJax glyph layout.
- Latest main's Set 1 integration is preserved: 30 Set 1 and 165 Set 3 items remain selectable beside 100 Set 2 items, giving 295 available questions across sets. The Set 1 test fixture now uses replacement callbacks so literal dollar-sign sequences in existing Set 2 scripts are not interpreted as string-replacement operators. Set 1 and Set 3 question data and their presentation code are unchanged. Focused tests explicitly choose their intended domain instead of assuming the default from an absent Set 1.

## Batch 11 ledger

| ID | BoK | Skill / decision | Evidence | Target difficulty | Key | Handbook chapter |
|---|---|---|---|---|---|---:|
| 101 | I.B.1 | Critical failures and operating exposure | Event-class bar chart and data | Moderate | B: 6,000 h | 2 |
| 102 | I.A.8 | Supplier claim applicability to intended mission | Revision/environment evidence table | Moderate | D | 1 |
| 103 | II.A.1 | Reassess an unverified alarm-response control | Risk-register scenario | Moderate | C | 3 |
| 104 | III.A.6 | Poisson event-rate signal with unequal exposure | Rate/limit plot and counts table | Moderate | A: Period 1 only | 6 |
| 105 | III.A.3 | Lognormal B10 life with known parameters | Calculation with normal quantile | Moderate | B: 1,198 h | 6 |
| 106 | III.B.2 | Informative withdrawal before functional failure | Survival-study scenario | Challenging | D | 7 |
| 107 | IV.C.3 | Thermal-cycle range under a specified fatigue model | Temperature endpoint plot and table | Challenging | C: 20,250 cycles | 10 |
| 108 | IV.B.6 | Scope of evidence from fault injection | Software-test scenario | Foundational | A | 9 |
| 109 | V.A.7 | FEA evidence needed for a fatigue-life requirement | Design-review evidence table | Moderate | B | 11 |
| 110 | V.B.2 | Standardize within verified compatibility limits | Seal-selection scenario | Moderate | D | 12 |

Batch 11 adds five exhibits (two table-only, three figures) and two collapsed completed-review tools. The bank now has 110 questions, 61 exhibits (28 table-only, 33 figures), and 22 review tools. Answer positions total 27 A, 28 B, 27 C, and 28 D. Four new items are quantitative; six assess decisions or interpretation. Difficulty targets are one foundational, seven moderate, and two challenging, without a claim of measured ASQ difficulty equivalence. There are 40 questions left in the 150-item core: domain allocations 8/7/9/9/7.

## Batch 11 technical review

- Q101 uses total operating unit-hours divided by the four distinct critical failures. The supplied handbook's extracted MTBCF equation labels its exposure in cycles despite naming a time metric; this item explicitly defines and dimensionally checks its hour-based estimator rather than reproducing that inconsistency. All-failure, noncritical-only, and maintenance-inclusive distractors are independently checked.
- Q102 distinguishes the applicability of supplier data from the size of its exposure total. Q103 requires evidence for credited control performance rather than changing severity or treating a design drawing as verification.
- Q104 applies the explicitly supplied conventional three-sigma Poisson rate limit. Enumeration of Poisson probabilities independently recovers count means and variances and verifies that only Period 1 signals. The chart includes the fixed baseline, period-specific limits, observed rates, and raw exposure/count alternatives. The explorer holds the observed rate at eight per 1,000 hours with integer counts; 500 h lies exactly at the upper limit and does not satisfy the stated above-limit rule. No exact false-alarm probability is claimed. [NIST control-chart guidance](https://itl.nist.gov/div898/software/dataplot/refman1/auxillar/contchar.htm) distinguishes count charts from unequal-opportunity rate charts.
- Q105 uses the lognormal lower tenth percentile, not the mean or upper percentile. Numerical density integration and bisection independently recover B10 and distinguish the B90 distractor. Known parameters mean this is not a confidence-bound exercise. [NIST lognormal reference](https://itl.nist.gov/div898/handbook/apr/section1/apr164.htm) supplies the distribution convention.
- Q106 identifies risk-related withdrawal as a concern for ordinary noninformative-censoring analysis. It neither fabricates functional failures at withdrawal nor prescribes an unqualified universal statistical correction.
- Q107 explicitly supplies a validated simplified range-only thermal-fatigue model. Maximum temperature, cycling frequency, dwell conditions, construction, and mechanism are fixed. Temperature differences do not require a Celsius-to-kelvin offset. The figure depicts endpoints rather than a waveform. An independently reconstructed model constant and integer-cycle search verify the key; the review changes the minimum while retaining the maximum. [NIST's modified Coffin–Manson discussion](https://www.itl.nist.gov/div898/handbook/apr/section1/apr153.htm) includes frequency, range, and maximum-temperature terms; it is not evidence that those extra terms can always be ignored. The explorer is hypothetical outside the two question profiles.
- Q108 limits fault-injection conclusions to the exercised faults and responses. Q109 distinguishes a static structural result and a displacement convergence check from fatigue-life validation. Q110 preserves standardization benefits subject to material compatibility and selection controls.
- Hash lock for Q001–100: `861b65a47721a56a80f3e230b46bcae420448de656a1d22dbceefc7c9ad7c961`. Earlier batch locks remain. Set 1 and Set 3 modules are unchanged.
- Existing quick and focused modes cap draws at twenty questions. Fundamentals now contains 21 Set 2 items, so its focused draw is twenty. The full 110-item Set 2 sitting receives 10,320 seconds (172:00).

## Batch 12 ledger

| ID | BoK | Skill / decision | Evidence | Target difficulty | Key | Handbook chapter |
|---|---|---|---|---|---|---:|
| 111 | I.A.5 | Mission-requirement change and verification traceability | Project change scenario | Moderate | C | 1 |
| 112 | I.B.1 | Inherent availability and downtime scope | Mean cycle-time table | Moderate | A: 99.17% | 2 |
| 113 | II.B.2 | Use FMEA centered on user tasks | Setup/servicing scenario | Foundational | D | 4 |
| 114 | II.B.1 | Rank interventions by top-event reduction | AND/OR tree and probability data | Challenging | B: Halve A | 4 |
| 115 | III.A.7 | One-sided normal standard-deviation upper bound | Explicit left-tail chi-square table | Moderate | C: 2.87 h | 6 |
| 116 | III.B.4 | Correct histogram area for unequal bin widths | Draft histogram and grouped data | Moderate | A | 7 |
| 117 | IV.A.1 | Failure-free future interval under a power-law NHPP | Cumulative-mean curve and data | Challenging | D: 0.3679 | 8 |
| 118 | IV.C.2 | Galvanic corrosion and mechanism evidence | Electrical-isolation comparison | Moderate | C | 10 |
| 119 | V.A.3 | Independent temperature replication versus subsampling | Randomized chamber-run table | Challenging | B | 11 |
| 120 | V.C.3 | Include required alignment/checkout in repair time | Functional-restoration scenario | Moderate | A | 13 |

Batch 12 adds six evidence exhibits (three table-only, three figures) and two collapsed completed-review tools. Set 2 now contains 120 questions, 67 exhibits (31 table-only, 36 figures), and 24 review tools. All answer positions are balanced at thirty each. Four new items are quantitative; six assess interpretation or decisions. Editorial difficulty targets are one foundational, six moderate, and three challenging. The remaining thirty core questions must fill domain allocations 6/5/7/7/5. These targets do not establish empirical equivalence to the live exam.

## Batch 12 technical review

- Q111 treats mission duration as part of the controlled requirement, without assuming that repeating a short test automatically verifies a longer mission. Q113 matches use FMEA to user tasks rather than manufacturing or component-only analysis.
- Q112 separates active corrective repair from logistics delay and asks specifically for steady-state inherent availability. An explicit 100-cycle accounting check verifies the key and all three distractors. The user handbook supplies the metric context; [NASA's availability technique AT-3](https://llis.nasa.gov/lesson/841) distinguishes excluded logistics/administrative delay and preventive maintenance, and [NASA's availability formula sheet](https://www.nasa.gov/wp-content/uploads/2023/11/170508-formulas-inherent-availability-and-reliability-with-constant-failure-and-repair-rates.pdf) supplies the steady-state expression. No mission reliability is inferred from this result.
- Q114 enumerates all eight independent basic-event combinations for baseline and each intervention. Baseline probability is 0.116; halving A/B/C gives 0.058/0.098/0.088, hence absolute reductions 0.058/0.018/0.028. Equal cost and unchanged consequences make the optimization objective unambiguous. The completed-review selector changes one probability only and shows the resulting gates and numeric reduction.
- Q115 defines left-tail notation and a one-sided 95% bound for standard deviation. Numerical chi-square density integration verifies both supplied quantiles and inverts pivot coverage independently of the solution formula. Distractors distinguish lower bound, variance, and standard error. [NIST confidence intervals for standard deviation](https://www.itl.nist.gov/div898/handbook/prc/section2/prc231.htm) gives the distribution convention and one-sided expression; normality and complete independent data are explicit.
- Q116 intentionally labels the count-height display as a draft. Density heights use each bin's own width, with areas 0.20/0.30/0.50 verified by numerical integration. The review toggles the same grouped data between draft count and corrected density scales without inventing within-bin failure times. [NIST histogram normalization](https://www.itl.nist.gov/div898/handbook/eda/section3/eda33e.htm) supports area normalization. This is a complete-data lifetime histogram, not a hazard estimate.
- Q117 uses a known power-law NHPP over total operating time; repairs do not restart its clock. Numerical integration of the event intensity over 10,000–22,500 h gives a mean increment of one and no-failure probability 0.3679. The origin-to-end and frozen instantaneous/cumulative-average rate distractors are checked separately. The curve is a model expectation, not observed cumulative events. [NIST power-law NHPP](https://www.itl.nist.gov/div898/handbook/apr/section1/apr172.htm) distinguishes cumulative means, event intensity, and future-interval probabilities. The source's interarrival example is used only under the item's explicit NHPP assumptions; parameter and model uncertainty are not silently omitted from an inferred field claim.
- Q118 uses the dissimilar metals, electrolyte, conductive path, and controlled isolation comparison to identify the most consistent mechanism, without asserting a unique cause or a corrosion-rate prediction. Handbook Chapter 10 supplies the corrosion/physics-of-failure context; NASA KSC's [Forms of Corrosion](https://public.ksc.nasa.gov/corrosion/forms-of-corrosion/) indexed description supports the galvanic conditions (full-page retrieval timed out during this review).
- Q119 assigns temperature at the chamber-run level. Two run assignments per temperature remain two replicates despite 24 lower-level readings per temperature. [NIST nested-variation guidance](https://www.itl.nist.gov/div898/handbook/pri/section5/pri55.htm) supports matching experimental units to treatment assignment. No specific ANOVA significance or power result is claimed, and the item does not require discarding within-run observations.
- Q120 uses the handbook's active restoration phases, including alignment and checkout. The dashboard cannot omit required work while the specified measurement function remains unrestored.
- Hash lock for Q001–110: `b1d8f74c16af70f2efa1e6d6b8d4d90f0457d49a351225d1ebec86c59d706af4`. All earlier locks remain. Set 1 and Set 3 are unchanged. The current integration and validation summaries are refreshed to eliminate stale Batch 10 counts; historical batch ledgers retain their release-specific figures.

## Learning and examination behavior

- Four-option single-best-answer items in the existing Full, Quick, and Focused modes. Set 1 is now the default; students can explicitly choose Set 2 in each mode. The partial release is clearly identified.
- The exam directory lists CRE as available with the explicit label “Sets 1–3: 315 questions available.” CQA remains the single coming-soon certification.
- Completed-attempt review adds twenty-four optional explorations: Weibull mission duration, zero-failure confidence/sample size, diagnostic prevalence/predictive value, acceptance threshold/producer risk, p-chart sample size, Arrhenius test temperature, sequential-test failure count, component-derating temperature, mission high-stress duration, failure-replacement cost, contingency-table failure count, required voting channels, fatigue stress amplitude, standby transfer coverage, surviving-unit age, predictive-inspection spacing, proportional hazard ratio, proof-test interval, load-sharing survivor rate, material-block shift, event exposure, thermal-cycle range, fault-tree intervention, and histogram scale. All start collapsed. These never alter the original item, answer key, or score, and are absent from the live question and retry interfaces.
- Existing answer reveal and retry behavior remains in place. Revealed answers count as incorrect in the original score; corrections do not rewrite that score.
- Mathematical working uses the shared pinned MathJax renderer. Equations are typeset in live reveal, completed review, and retry feedback.
- SVG figures use text labels and solid/dashed lines rather than color-only distinctions. Captions, descriptions, data alternatives, table headers, keyboard-focusable scroll regions, and live explorer outputs support accessible use. Exhibits scroll internally on narrow screens.

## Integration contract

`test-bank-cre-set2.js` owns Set 2 and stable `cre:set-2:001` through `cre:set-2:120` IDs. Append future questions without renumbering released IDs. `registerCRESet2` merges Set 2 into `EXAMS.cre` and preserves existing Set 1 arrays/content. It never assigns the Set 2 array to Set 1. Set 1's integration should use its own file and call order that preserves this registration.

The five Set 2 subtopic identifiers are `cre-fundamentals`, `cre-risk`, `cre-statistics`, `cre-testing`, and `cre-lifecycle`. If Set 1 uses more granular identifiers, merge these as aliases into matching official domains; do not double the blueprint weight. The production edge must retain the CRE data and UI scripts. The presentation module is scoped to the CRE Set 2 ID prefix; a text/table fallback preserves diagram logic if that module is unavailable.

## Validation

- Eighteen Set 2-specific tests check complete question metadata, current domain allocations, valid lesson anchors, Set 1/Set 3 preservation, independent numeric answers, production edge inclusion, all modes, pacing, scoring, review tools, reveal/retry math requests, and presentation fallback.
- SHA-256 assertions lock the first ten, twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety, one hundred, and one hundred ten questions to their prior versions, including options, feedback, references, and metadata. New questions carry batch number 12 and stable appended IDs.
- The production-player test completes all one hundred twenty items, verifies the sixty-seven exhibits/twenty-four review tools, changes and resets both new controls, and checks unchanged question data and scores. A full 120-item practice session uses 11,258 seconds; default Quick draws twenty items, and focused Fundamentals draws twenty from twenty-three available questions.
- Existing current-attempt review and student-audit suites cover other active certifications and modes. The Chromium/WebKit directory audit exercises all one hundred twenty Set 2 items and all twenty-four review tools at desktop/mobile widths in light/dark themes, including page overflow and immutable scores.
- Browser fixtures block external requests, so those audits do not establish actual MathJax glyph rendering. Local jsdom verifies typesetting requests, not glyph layout. SVG geometry is rendered separately for visual inspection. Preview/auth limitations and final CI results are recorded in the PR.
- Run the scoped CRE, directory, current-attempt review, reveal, stateless-result, CQE regression, and student suites plus `npm run build:site`. Exclude generated build changes from the PR.

## Next batch gate

Choose the next ten items against the remaining blueprint; avoid repeating the existing one hundred twenty items’ principal skills. Independently solve every numerical key and distractor, confirm one best answer and all necessary assumptions, use visuals only when they supply evidence or aid reasoning, verify the complete learner flow, and update this ledger before release. Candidate feedback should inform later difficulty calibration.
