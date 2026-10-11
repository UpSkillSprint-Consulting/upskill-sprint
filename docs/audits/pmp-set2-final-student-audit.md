# PMP Set 2 — final student audit

Date: 10 October 2026. Scope: all 180 original questions in PR 280, starting from remote commit `c488ba2615c110f183401d7de6160a2844eb0a8e`.

## Assessment

All 180 stems, authored options, keys, main explanations, and individual option rationales were reviewed. No incorrect answer key was identified. Thirty-four quantitative or threshold-based scenarios were independently recalculated. IDs, domain allocations, approach allocations, case assignments, and response-format counts remain intact.

This is an original practice bank. Difficulty labels are author judgments, not empirically calibrated equivalence to PMI questions. Pilot response data would be needed to establish item difficulty, discrimination, and distractor effectiveness. Repeated competencies across different scenarios are intentional; passing this audit does not establish an official PMP passing score.

## Corrections made

| Finding | Correction | Coverage |
|---|---|---|
| Long native-select options were clipped on a 390 px screen; matching summaries showed only letters. | Added an always-visible, wrapping list of complete responses and full selected-response text beneath each select. Native keyboard selection and accessible option text remain available. | All 12 matching and 6 drop-down questions, including retry views. |
| Wide evidence tables offered no explicit mobile indication that columns extended offscreen. | Added a small mobile scrolling hint for tables with more than three columns. The existing labeled, keyboard-focusable scroll region is retained. | Wide case, evidence, hotspot, explanation, and review tables. |
| Q174 option B described a forty-hour gap although the initial review-capacity gap is twenty hours; its rationale repeated the distracting arithmetic mismatch. | Reworded B as the plausible error of ignoring mentoring time, and explained the resulting 32 available hours versus 40 required. Correct answer A is unchanged. | Q174 and its batch review document. |
| Worked equations appeared as plain-text expressions. | Converted ten calculation passages to display LaTeX using the site's existing MathJax renderer; split longer workings across aligned lines. Values and keys are unchanged. | Q009, Q025, Q034, Q050, Q091. The existing Q091 review document is synchronized. |
| Source-file heading still described only seven batches. | Updated the heading to 18 batches and Q001–Q180. | Developer-facing bank heading. |

## Content and source checks

The review applied each scenario's stated authority, timing, constraints, and evaluation rule rather than treating “always escalate,” “always collaborate,” or “always select the cheapest option” as universal answers. Particular checks included dependencies and resource limits, the difference between acceptance and operational readiness, actual costs versus cash payments, risk versus active issues, data quality and AI oversight, customer outcomes versus outputs, and sustainability trade-offs.

The uploaded PMBOK 8 PDF was used as the reference already underlying the bank. Its Guide p. 60 confirms the alternative reserve arrangements used in Q066. Current official sources were rechecked for the July 2026 ECO, Q101's conflict-of-interest requirements, and the corrected start-to-finish and contingency-trigger definitions used in Q048 and Q075:

- [PMI July 2026 Examination Content Outline](https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf)
- [PMI Code of Ethics and Professional Conduct, §4.3.1–4.3.2](https://www.pmi.org/-/media/pmi/documents/public/pdf/ethics/pmi-code-of-ethics.pdf)
- [PMBOK 8 second-printing errata](https://www.pmi.org/-/media/pmi/documents/public/pdf/pmbok-standards/pg8-errata---second-printing.pdf)

This audit did not obtain or use recalled confidential exam items, and did not independently reverify every printed-page citation.

## Independent quantitative review

Dollar figures below are dollars unless identified as thousands. These checks use the scenario inputs and recompute results independently of the stored answer index.

| Question | Recomputed result |
|---|---|
| 009 | Only B meets both constraints: both paths 16 days, $6,000. |
| 012 | Overall 70%; Central 50%; both applicable readiness thresholds missed. |
| 022 | Specialist and analyst each have one day remaining after their assigned three-day activity. |
| 025 | Bottom-up final forecast $675,000; $75,000 above BAC. |
| 028 | B on Days 1–2, A on Days 3–5 meets both deadlines. |
| 034 | F, A, N: 10 effort units, 106 points; feasible S, G, N yields 100. |
| 041 | Validation Days 9–10, rehearsal Days 11–12; next permitted cutover Day 16. |
| 050 | Release impacts for A/B/C/D: 1/3/0/0 days after float. |
| 051 | 12 usable specialist hours; 10 goal-critical hours; all items exceed capacity by 3. |
| 061 | CPI 0.90; EAC $1,000,000; TCPI to original BAC 1.08. |
| 063 | Next-month cash shortfall $30,000. |
| 064 | Whole-iteration remaining cost $90,000–$120,000; total $210,000–$240,000. |
| 069 | EV $30,000 and AC $80,000 under the explicit measurement rules. |
| 074 | 79% at Day 27 fails; 86% at Day 29 is the earliest listed qualifying result. |
| 079 | R, S, U: 6 hours and $10,500 optional expected rework benefit. |
| 081 | First-pass acceptance 85%, distinct from final acceptance 100%. |
| 083 | Earlier first-pass acceptance 80%; noncomparable cohorts do not establish causation. |
| 090 | Current annual cost $240,000; proposed with setup $222,000; difference $18,000. |
| 091 | Weighted scores A/B/C/D: 91.2/86.8/96/88.6; only B and D eligible, so D wins. |
| 100 | Both routes share the earliest testing window in weeks 7–8. |
| 108 | $15,000 of released authority remains; proposed package needs $7,000 more. |
| 111 | B then A yields $70,000 through week 6; A then B yields $61,000. |
| 117 | Validation limits capacity to 4; the proposed qualified addition raises the limit to 8. |
| 129 | Expected totals: acceptance $36,000; prevention $22,000; impact reduction $32,000; insurance $30,000. |
| 137 | Pooled rates 62.7% then 77.3%, while category rates fall from 90/60% to 80/50%. |
| 145 | Totals $180k/$180k/$190k/$170k; Efficient is the least-cost emissions-compliant package. |
| 149 | Intensity 10 to 8 kWh/unit, down 20%; total 100 to 120 MWh, up 20%. |
| 153 | Both paths must reach 10 days; combined acceleration costs $8,000. |
| 162 | Latest safe rollback decision minute 40; rollback now finishes minute 85; failed correction then rollback finishes minute 130. |
| 169 | Only Archive lacks the required 30-minute run; higher rate does not compensate. |
| 170 | Final cost $470,000; remaining cash $80,000; no double-counting unpaid costs. |
| 171 | No or either single acceleration: 6 weeks; both: 5 weeks at $35,000, requiring $5,000 more authority. |
| 174 | Contractor: 36 senior plus 24 contractor hours; junior: 32 senior hours against 40 hours of review, an 8-hour shortfall. |
| 180 | Focused incremental net value $30,000; broader $10,000. |

## Coverage retained

- 180 distinct questions in 18 batches; ten independent shared cases support 30 items.
- Domains: 59 People, 74 Process, 47 Business Environment; all 26 task targets retained.
- Approaches: 72 predictive, 54 agile, 54 hybrid.
- Formats: 132 single, 24 multiple, 12 matching, 6 drop-down, 6 hotspot.
- Single-answer letters remain balanced at 33 each. Every multiple-selection item requires two answers; matching uses exact complete mappings, with no partial credit.
- All 180 practice items are scored. The full timed sitting remains 240 minutes; official hidden pretest items and section-break locking are not simulated.

## Validation

- Eight Node 22 tests pass: five Set 2 tests plus three stateless result-flow tests. They cover all IDs and keys, exact scoring for every encoded multiple/matching state, Set 1 isolation, 240-minute timing, answer persistence through navigation, result review, retry behavior, reveal locking, and readable select states after choosing, clearing, and locking.
- Chromium completed all 180 questions at 1280 px and 390 px in light and dark modes: **720 question/theme/viewport checks**. Every selected answer matched its stored expected answer; each completed run showed 180 review cards with explanations expanded. No document overflow or JavaScript errors were observed.
- Forty targeted axe WCAG A/AA checks across the four environments found zero violations in the tested question and answer components. This is a scoped automated check, not a claim of site-wide accessibility certification.
- All five questions with revised equations were separately rendered with the actual shared MathJax 3.2.2 bundle in all four environments: **20 math rendering checks**, zero math errors and no horizontal page overflow. Q025's initially overlong expression was shortened before this passing run.
- Quick and Focused quiz smoke checks at 390 px in dark mode each loaded 20 Set 2 questions and supported answer reveal without JavaScript errors. Full-exam checks also exercised keyboard checkbox/hotspot input and native select interaction.
- Representative mobile matching, mobile hotspot, and light/dark worked-equation screenshots were visually inspected. Long responses now wrap below their controls, and table scrolling is indicated.
- An initial mobile direct-number-navigation automation timeout did not reproduce in a targeted Q020–Q021 check. The completed all-question sweep used the normal Next button and the actual randomized session order. No navigation defect was established from that timeout.

The full browser sweep and numerical check outputs were reviewed before committing. Deploy-preview asset verification and the current remote CI status are recorded in PR 280.

The production-edge presentation fixture preserves the exam, theme, and question code while isolating authentication. It does not prove dummy-account login, paid entitlement, or cross-device account synchronization. Chromium rendering and automated accessibility checks also do not replace testing on physical iOS/Android devices or a full assistive-technology audit.

Production publication remains Ernest's review-and-merge decision. No merge, production deployment, account-setting change, or database write was performed.
