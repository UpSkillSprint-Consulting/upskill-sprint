# CRE Set 2 — original practice bank

Batch 1 releases Q001–010, ten of a planned 150 core questions. Set 1 is managed separately. These are original practice items informed by the supplied handbook and the public ASQ Body of Knowledge, not reproduced or purported past ASQ examination items. Difficulty labels are editorial targets; equivalence to the live examination has not been established through candidate-response data.

## Authoritative blueprint

- [ASQ CRE certification and current exam format](https://www.asq.org/cert/reliability-engineer): 165 displayed CBT items, including 150 scored and 15 unscored, with 258 minutes of exam time. Checked 2026-10-09.
- [ASQ published 2025 CRE Body of Knowledge](https://www.asq.org/cert/resource/pdf/certification/2025-CRE-BoK.pdf): domain allocations 29, 25, 35, 35, 26. The PDF's internal footer says “2024 CRE BoK”; use its published topic codes and allocations.
- Karen Hulting and Mary McShane-Vaughn, editors, *The ASQ Certified Reliability Engineer Handbook*, fourth edition (2025), user-supplied EPUB. Technical concepts checked in Chapters 1, 2, 4, 6, 8, 10, 11, and 13. No text, figures, or book files are copied into the site.

The supplied handbook appendix lists older allocations (25/25/35/35/30) and nests maintainability under V.B. The published ASQ PDF takes precedence for the bank blueprint; maintainability is V.C. A 10-item timed practice session is 938 seconds (15:38), proportional to 258 minutes / 165 displayed questions. A completed 150-item core is not a full 165-item CBT replica.

| Official domain | Final core target | Batch 1 | Remaining |
|---|---:|---:|---:|
| I. Reliability Fundamentals | 29 | 2 | 27 |
| II. Risk Management | 25 | 2 | 23 |
| III. Probability and Statistics for Reliability | 35 | 2 | 33 |
| IV. Reliability Planning, Testing, and Modeling | 35 | 2 | 33 |
| V. Lifecycle Reliability | 26 | 2 | 24 |
| Total | 150 | 10 | 140 |

The first batch samples all five domains. Later batches must fill the remaining allocations rather than repeat an equal-domain quota throughout.

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

## Learning and examination behavior

- Four-option single-best-answer items in the existing Full, Quick, and Focused modes. Set 2 is the available default while Set 1 is absent; empty Set 1 cannot be selected. The partial release is clearly identified.
- The exam directory lists CRE as available with the explicit label “Set 2: 10 questions available.” CQA remains the single coming-soon certification.
- Completed-attempt review adds two optional explorations: Weibull mission duration and zero-failure confidence/sample size. These never alter the original item, answer key, or score, and are absent from the live question and retry interfaces.
- Existing answer reveal and retry behavior remains in place. Revealed answers count as incorrect in the original score; corrections do not rewrite that score.
- Mathematical working uses the shared pinned MathJax renderer. Equations are typeset in live reveal, completed review, and retry feedback.
- SVG figures use text labels and solid/dashed lines rather than color-only distinctions. Captions, descriptions, data alternatives, table headers, keyboard-focusable scroll regions, and live explorer outputs support accessible use. Exhibits scroll internally on narrow screens.

## Integration contract

`test-bank-cre-set2.js` owns Set 2 and stable `cre:set-2:001` through `cre:set-2:010` IDs. Append future questions without renumbering released IDs. `registerCRESet2` merges Set 2 into `EXAMS.cre` and preserves existing Set 1 arrays/content. It never assigns the Set 2 array to Set 1. Set 1's integration should use its own file and call order that preserves this registration.

The five Set 2 subtopic identifiers are `cre-fundamentals`, `cre-risk`, `cre-statistics`, `cre-testing`, and `cre-lifecycle`. If Set 1 uses more granular identifiers, merge these as aliases into matching official domains; do not double the blueprint weight. The production edge must retain the CRE data and UI scripts. The presentation module is scoped to the CRE Set 2 ID prefix; a text/table fallback preserves diagram logic if that module is unavailable.

## Validation

- Seven new tests check question metadata, valid lesson anchors, Set 1 preservation, independent numeric answers, production edge inclusion, all modes, pacing, scoring, review tools, reveal/retry math requests, and a presentation-module fallback.
- Numeric checks use full Boolean-state enumeration for the shared-event fault tree and series–parallel system, sequential risk sets for Kaplan–Meier, integer search for the minimum zero-failure sample, and numerical integration for the normal tail. Distractor calculations and FMEA RPNs are also checked.
- The current-attempt review suite covers every active certification and mode. Its fixture now handles a two-question focused batch with one incorrect and one unanswered item; larger banks retain the existing three-missed-item coverage.
- Availability and reveal tests are updated for a released CRE Set 2, an empty Set 1, and two-question focused quizzes. The existing Chromium/WebKit directory audit now exercises all ten CRE questions, six exhibits, both review explorers, immutable scores, and page overflow at desktop/mobile widths in light/dark themes. It continues to block external requests, so it does not establish actual MathJax glyph rendering.
- Required stateless-result and CQE regression checks pass (17 tests). CRE plus current-attempt review checks pass (29 tests including nested certification/mode cases).
- `npm run build:site` passes, including stateless architecture validation. Generated changes are excluded from this PR.
- A real browser cannot access the local development server in this environment. Local jsdom tests validate DOM behavior and math-renderer calls, not rendered MathJax glyphs or visual layout. Deploy-preview visual verification is recorded in the PR.

## Next batch gate

Choose the next ten items against the remaining blueprint; avoid repeating Batch 1's principal skills. Independently solve every numerical key and distractor, confirm one best answer and all necessary assumptions, use visuals only when they supply evidence or aid reasoning, verify the complete learner flow, and update this ledger before release. Candidate feedback should inform later difficulty calibration.
