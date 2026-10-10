# PMP Set 2 — second complete QA pass

Date: 10 October 2026. Base: PR 280 commit `f703f8769c6f29d9e32ec99d2a844d8405c8e743`.

## Assessment and corrections

All 180 stems, choices, answer keys, case records, exhibits, main explanations, and option rationales were re-read. No incorrect answer key was identified. The 34 quantitative and threshold scenarios in the first audit were recalculated again; their results remain valid. This pass found and corrected issues that the first audit missed.

| Finding | Correction |
|---|---|
| Answer reveal displayed “Reasoning for every response” twice. The shared explanation renderer already included it, and the reveal wrapper appended it again. | Removed the second append from the normal path. The fallback still supplies one rationale group when the shared presentation helper is unavailable. |
| Correct answers were the longest or joint-longest choice in 108 of 132 single-answer items (81.8%), providing a substantial test-taking clue. | Edited 91 correct-choice texts for concise wording while preserving their required decisions and constraints. The longest/joint-longest count is now 30 of 132 (22.7%). This is an editorial cue check, not psychometric calibration. |
| Q151's correct option referred to an urgent decision route not explicitly established in the stem. | Stated that governance permits urgent requests between the director's scheduled reviews. |
| Q156 called changes “completed” even though their mandatory security review was outstanding. | Clarified that coding is complete and security review remains pending. |

Every key, ID, explanation, option rationale, numeric input, case assignment, reference, domain, task, approach, format, and difficulty label is unchanged. Only the 91 identified option texts and the two stems changed in the bank. The two stem edits are within those 91 questions. All 110 questions in the repository's existing batch 8–18 review documents were checked against the revised canonical bank and synchronized. Earlier linked authoring Pages are historical snapshots; the revised bank in this PR is the current simulator content.

Correct-choice wording revised in Q: 004, 005, 010, 014, 019, 021, 022, 023, 024, 027, 028, 029, 032, 033, 035, 037, 042, 043, 044, 045, 047, 049, 054, 055, 057, 059, 062, 066, 068, 070, 072, 073, 077, 080, 082, 084, 086, 092, 095, 097, 098, 099, 100, 102, 104, 107, 108, 109, 110, 112, 114, 115, 118, 120, 121, 122, 124, 126, 127, 130, 132, 136, 137, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 152, 156, 157, 159, 160, 161, 162, 163, 164, 166, 167, 171, 172, 175, 176, 178, 179, 180.

## Content verification

Reviewed decision authority, sequence and dependencies, resource capacity, scope versus new requests, quality evidence versus acceptance, contingency triggers, residual and secondary risks, actual cost versus cash, outcome versus output measures, ethics, AI evidence and oversight, sustainability constraints, and closure versus subsequent benefit realization. The shortened choices retain the discriminating action; supporting details remain in the unchanged explanations.

The fresh calculation worksheet rechecked Q009, 012, 022, 025, 028, 034, 041, 050, 051, 061, 063, 064, 069, 074, 079, 081, 083, 090, 091, 100, 108, 111, 117, 129, 137, 145, 149, 153, 162, 169, 170, 171, 174, and 180. Results agree with the [first audit's calculation table](pmp-set2-final-student-audit.md#independent-quantitative-review).

Rechecked the official [July 2026 ECO](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf), [PMI ethics provisions](https://www.pmi.org/-/media/pmi/documents/public/pdf/ethics/pmi-code-of-ethics.pdf) for Q101, and [PMBOK 8 errata](https://www.pmi.org/-/media/pmi/documents/public/pdf/pmbok-standards/pg8-errata---second-printing.pdf) for Q048's start-to-finish relationship. The supplied PMBOK 8, Guide p. 60 (PDF p. 165), was rechecked for Q066's alternative reserve arrangement. This was not an independent page-by-page revalidation of every source citation.

## Fresh validation of the final content

- Eight Node 22 tests pass: five Set 2 tests and three stateless-results tests. The newly expanded reveal regression exercises **all 180 questions**, verifies exactly one complete set of authored rationales, locks every response control, and confirms that revealed answers count as incorrect even when the prior selection was correct. It also checks all 180 review cards and the presentation-helper fallback.
- Before the fix, the new rationale-count assertion reproduced the defect: two groups where one was expected. It passes after the fix.
- Existing tests retain exact grading for every encoded multiple/matching state, 180-question session integrity, 240-minute timing, response persistence, all-format retry behavior, and Set 1 isolation.
- A fresh Chromium sweep of the revised bank completed all 180 questions at **1280 px and 390 px, each in light and dark mode: 720 question states**. Each run verified selected answers, normal Next navigation, all 180 review cards, exactly one rationale group per card, and no page overflow or JavaScript errors.
- **40 targeted axe WCAG A/AA checks** of representative question/answer components passed with zero violations. These checks do not certify the entire site.
- **20 actual MathJax rendering checks** passed: Q009, 025, 034, 050, and 091 in the four viewport/theme environments. No math errors or page overflow; expected equation counts also confirm that the duplicated rationale math is gone.
- Mobile light-mode long-response selection and mobile dark-mode worked-equation screenshots were visually inspected. Full response text and equations remain readable.
- `node scripts/validate-simple-test-bank.mjs` and `git diff --check` pass.
- A structural comparison against the base commit verified that no unapproved bank fields changed and that all existing batch review documents match the current bank.

## Coverage and limits

The bank remains 180 questions: 59 People, 74 Process, and 47 Business Environment; 72 predictive, 54 agile, and 54 hybrid; 132 single, 24 multiple, 12 matching, 6 drop-down, and 6 hotspot. Single-answer positions remain balanced at 33 each. Every item retains its original source references and explanation.

The set is suitable for original scenario-based practice. Difficulty labels remain author-assessed; pilot student response data is needed to measure difficulty, discrimination, and distractor effectiveness. Some competencies intentionally recur. This review does not establish equivalence to PMI's confidential items or an official passing score.

The simulator scores all 180 practice questions and does not reproduce hidden unscored items or official section-break locking. Browser checks use the production-edge presentation fixture with authentication isolated; this pass does not verify dummy-account login, entitlements, account synchronization, physical mobile devices, or a full screen-reader audit. No production publication or PR merge was performed. Remote preview and CI verification are recorded in PR 280.
