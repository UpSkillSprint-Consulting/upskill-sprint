# CRE Set 2 — original practice bank

Batches 1–2 release Q001–020, twenty of a planned 150 core questions. Batch 2 appends Q011–020 without changing the released first ten items. Set 1 is managed separately. These are original practice items informed by the supplied handbook and the public ASQ Body of Knowledge, not reproduced or purported past ASQ examination items. Difficulty labels are editorial targets; equivalence to the live examination has not been established through candidate-response data.

## Authoritative blueprint

- [ASQ CRE certification and current exam format](https://www.asq.org/cert/reliability-engineer): 165 displayed CBT items, including 150 scored and 15 unscored, with 258 minutes of exam time. Checked 2026-10-09.
- [ASQ published 2025 CRE Body of Knowledge](https://www.asq.org/cert/resource/pdf/certification/2025-CRE-BoK.pdf): domain allocations 29, 25, 35, 35, 26. The PDF's internal footer says “2024 CRE BoK”; use its published topic codes and allocations.
- Karen Hulting and Mary McShane-Vaughn, editors, *The ASQ Certified Reliability Engineer Handbook*, fourth edition (2025), user-supplied EPUB. Technical concepts checked in Chapters 1, 2, 4, 6, 7, 8, 9, 10, 11, and 13. No text, figures, or book files are copied into the site.

The supplied handbook appendix lists older allocations (25/25/35/35/30) and nests maintainability under V.B. The published ASQ PDF takes precedence for the bank blueprint; maintainability is V.C. A 10-item timed practice session is 938 seconds (15:38), proportional to 258 minutes / 165 displayed questions. A 20-item session is 1,876 seconds (31:16). A completed 150-item core is not a full 165-item CBT replica.

| Official domain | Final core target | Batch 1 | Batch 2 | Released | Remaining |
|---|---:|---:|---:|---:|---:|
| I. Reliability Fundamentals | 29 | 2 | 2 | 4 | 25 |
| II. Risk Management | 25 | 2 | 1 | 3 | 22 |
| III. Probability and Statistics for Reliability | 35 | 2 | 3 | 5 | 30 |
| IV. Reliability Planning, Testing, and Modeling | 35 | 2 | 3 | 5 | 30 |
| V. Lifecycle Reliability | 26 | 2 | 1 | 3 | 23 |
| Total | 150 | 10 | 10 | 20 | 130 |

The first batch samples all five domains. Batch 2 moves the cumulative mix toward the official blueprint with fresh principal skills. Later batches must fill the remaining allocations rather than repeat an equal-domain quota throughout.

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

## Learning and examination behavior

- Four-option single-best-answer items in the existing Full, Quick, and Focused modes. Set 2 is the available default while Set 1 is absent; empty Set 1 cannot be selected. The partial release is clearly identified.
- The exam directory lists CRE as available with the explicit label “Set 2: 20 questions available.” CQA remains the single coming-soon certification.
- Completed-attempt review adds four optional explorations: Weibull mission duration, zero-failure confidence/sample size, diagnostic prevalence/predictive value, and acceptance threshold/producer risk. These never alter the original item, answer key, or score, and are absent from the live question and retry interfaces.
- Existing answer reveal and retry behavior remains in place. Revealed answers count as incorrect in the original score; corrections do not rewrite that score.
- Mathematical working uses the shared pinned MathJax renderer. Equations are typeset in live reveal, completed review, and retry feedback.
- SVG figures use text labels and solid/dashed lines rather than color-only distinctions. Captions, descriptions, data alternatives, table headers, keyboard-focusable scroll regions, and live explorer outputs support accessible use. Exhibits scroll internally on narrow screens.

## Integration contract

`test-bank-cre-set2.js` owns Set 2 and stable `cre:set-2:001` through `cre:set-2:020` IDs. Append future questions without renumbering released IDs. `registerCRESet2` merges Set 2 into `EXAMS.cre` and preserves existing Set 1 arrays/content. It never assigns the Set 2 array to Set 1. Set 1's integration should use its own file and call order that preserves this registration.

The five Set 2 subtopic identifiers are `cre-fundamentals`, `cre-risk`, `cre-statistics`, `cre-testing`, and `cre-lifecycle`. If Set 1 uses more granular identifiers, merge these as aliases into matching official domains; do not double the blueprint weight. The production edge must retain the CRE data and UI scripts. The presentation module is scoped to the CRE Set 2 ID prefix; a text/table fallback preserves diagram logic if that module is unavailable.

## Validation

- Eight CRE-specific tests check complete question metadata, current domain allocations, valid lesson anchors, Set 1 preservation, independent numeric answers, production edge inclusion, all modes, pacing, scoring, review tools, reveal/retry math requests, and presentation fallback.
- A SHA-256 assertion locks the serialized first ten questions to the merged Batch 1 version, including their options, feedback, references, and metadata. New questions carry batch number 2 and stable appended IDs.
- The production-player test completes all twenty items, verifies the eleven exhibits/four review tools, changes and resets both new controls, and checks unchanged question data and scores. A full 20-item practice session uses 1,876 seconds; focused Fundamentals now contains four questions.
- Existing current-attempt review and student-audit suites cover other active certifications and modes. The Chromium/WebKit directory audit exercises all twenty CRE items and all four review tools at desktop/mobile widths in light/dark themes, including page overflow and immutable scores.
- Browser fixtures block external requests, so those audits do not establish actual MathJax glyph rendering. Local jsdom verifies typesetting requests, not glyph layout. SVG geometry is rendered separately for visual inspection. Preview/auth limitations and final CI results are recorded in the PR.
- Run the scoped CRE, directory, current-attempt review, reveal, stateless-result, CQE regression, and student suites plus `npm run build:site`. Exclude generated build changes from the PR.

## Next batch gate

Choose the next ten items against the remaining blueprint; avoid repeating Batch 1's principal skills. Independently solve every numerical key and distractor, confirm one best answer and all necessary assumptions, use visuals only when they supply evidence or aid reasoning, verify the complete learner flow, and update this ledger before release. Candidate feedback should inform later difficulty calibration.
