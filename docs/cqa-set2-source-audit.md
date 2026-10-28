# CQA Set 2: source and question audit

Audit date: 2026-10-28. This record accompanies PR #368, which is accumulating one reviewed batch of ten questions at a time toward 150. The PR is to remain unmerged until all 150 questions are ready.

## Sources and method

The content source is *The ASQ Certified Quality Auditor Handbook*, fifth edition (2020), edited by Lance B. Coleman Sr. The user's uploaded copy contains 417 PDF pages. The page references displayed in the questions are **printed handbook pages**. For the cited main-text pages, the corresponding one-based PDF position is the printed page plus 19. This relationship was checked against visible page labels in the PDF; the PDF viewer's page counter is not the citation convention.

The question topics and maximum cognitive levels follow the [official 2026 CQA Body of Knowledge](https://www.asq.org/cert/resource/pdf/certification/2026%20CQA%20Body%20of%20Knowledge.pdf). The `cognitive` field records the demand of the actual item, which may be below the topic's maximum. It does not claim a measured difficulty equivalent to an operational ASQ item.

Each audit checked the complete stem, all four choices, the answer key, the explanation and each distractor rationale. It also checked the source passage, printed page label, numerical work where applicable, stated assumptions, and whether another choice could reasonably be correct. The scenarios, organizations, records, and numbers in these practice items are original. Handbook citations identify the supporting principles; they do not imply that the questions or their exhibits appear in the handbook.

## Batch 1: Q001-Q010

No incorrect answer key, numerical result, or printed-page/PDF-page offset was found. Three citations were made more precise. Q007's correct option was clarified, and Q005's item-level cognitive metadata was corrected. All ten answer keys were retained.

| Item | Original printed citation | Audited printed citation | One-based PDF pages | Evidence and disposition |
|---|---|---|---|---|
| Q001 | 20-22 | 20-22 | 39-41 | Criteria include customer and contract requirements. The stem supplies the limits of the lot-specific exception. Retained. |
| Q002 | 32-33 | 32-33 | 51-52 | Proprietary process information remains confidential when identifying names are removed; generic teaching examples must protect both information and identity. Retained. |
| Q003 | 63-64 | 63-64 | 82-83 | Parallel data-collection time must be distinguished from shared meetings and breaks. The six-hour schedule was independently recalculated. Retained. |
| Q004 | 105-111 | **104-105, 107** | **123-124, 126** | The discussion of recurrence and systemic versus isolated incidents starts on p104, continues into additional sampling on p105, and is bounded by evidence and sampling uncertainty on p107. Narrowed and added p104. |
| Q005 | 122; 107-111 | **107, 110, 122** | **126, 129, 141** | These pages directly support sampling limits, the requirement-evidence-gap structure of a finding, and avoiding an unproved cause. Narrowed and standardized. |
| Q006 | 152-153 | 152-153 | 171-172 | Coordinated reassignment, communication of schedule changes, evidence consolidation, and closing preparation. Retained. |
| Q007 | 159, 164-165 | **159, 165** | **178, 184** | Audience-appropriate detail, feedback to verify understanding, and communication of evidence and follow-up. P164 is less directly relevant. Narrowed. |
| Q008 | 181-182, 184-185 | 181-182, 184-185 | 200-201, 203-204 | Distinguishing knowledge from skills, mentoring, witnessed evaluation, feedback, and an improvement plan. Retained. |
| Q009 | 217-218 | 217-218 | 236-237 | Four quality-cost categories, total COQ, and comparable cost capture. Both reductions were independently recalculated. Retained. |
| Q010 | 232-234 | 232-234 | 251-253 | Paired X-bar/R charts, location versus spread, and investigation of points beyond control limits. Retained. |

### Changes arising from the audit

- **Q004:** replaced `pp. 105-111` with `pp. 104-105, 107`. The previous range contained support but omitted the beginning of the most relevant discussion and included less relevant pages.
- **Q005:** replaced `pp. 122; 107-111` with `pp. 107, 110, 122`. Changed `cognitive` from `Create` to `Evaluate`: the learner evaluates supplied finding statements. The BoK topic remains II.C.1, whose maximum is Create.
- **Q007:** replaced `pp. 159, 164-165` with `pp. 159, 165`. The correct option now explicitly includes communicating expected follow-up before checking the process owners' understanding.

### Numerical and exhibit checks

- **Q003:** 12 auditor-hours / 3 auditors + 1.5 hours of shared meetings + 0.5 hour of common break = 6 elapsed hours. A 09:00 start therefore requires a 15:00 finish. The equivalent resource total is 18 auditor-hours.
- **Q004/Q005:** A18 has an approved concession before dispatch and meets the expressly permitted alternative route. A19 has neither normal release nor an approved concession at dispatch. The four records establish the sample's observed failure without establishing its root cause or a population defect rate.
- **Q009:** failure-only COPQ decreases from $250,000 to $145,000, a $105,000 reduction. Total COQ decreases from $350,000 to $290,000, a $60,000 reduction. The $45,000 increase in prevention/appraisal reconciles the two changes. The item does not infer causation from that comparison.
- **Q010:** means 50.40 and 50.45 exceed the stated X-bar upper limit of 50.30. All four ranges are inside their stated limits. The explanation does not treat product conformity as proof of statistical stability or four in-limit range points as proof of stable dispersion.


## Batch 2: Q011-Q020

All ten new items received an independent review of the final drafts against the source passages, including the proposed answers, all three distractors, and the stated assumptions. No substantive answer-key, arithmetic, or source-location error was found. Two precision edits were included: Q019 consistently refers to actions with recurrence, rather than implying a count of distinct underlying problems; Q020 explicitly selects distinct record IDs without replacement.

| Item | Topic / BoK | Item demand | Verified printed pages | One-based PDF pages | Supporting principle |
|---|---|---|---|---|---|
| Q011 | Auditor-auditee relationship / I.A.2 | Analyze | 2, 6, 23 | 21, 25, 42 | The commissioning relationship determines the audit context; fee reimbursement does not change whose supplier audit is performed. Joint audits concern multiple auditing organizations, not merely a payment arrangement. |
| Q012 | Purpose and scope / I.B.1 | Apply | 15, 17 | 34, 36 | Scope identifies relevant locations, organizational units, activities, interfaces, and time boundaries to meet the stated purpose. |
| Q013 | Participant responsibilities / I.D | Apply | 24-26 | 43-45 | Lead-auditor direction and reporting, individual auditor evidence responsibilities, and auditee coordination have distinct functions. |
| Q014 | CAPA plan review / II.D.2 | Evaluate | 133, 135-136 | 152, 154-155 | A plan must address the established cause, maintain appropriate containment, and define effectiveness measures; the auditee owns its solution. |
| Q015 | CAPA verification / II.D.3 | Evaluate | 138-140 | 157-159 | Completing implementation steps differs from demonstrating that the revised process achieves the intended result under relevant conditions. |
| Q016 | Auditor selection / II.A.2 | Analyze | 65, 67-68 | 84, 86-87 | Match demonstrated technical and audit competence to the assignment, with independence from the work assessed and adequate local preparation. |
| Q017 | Interviewing / III.E | Apply | 166-167, 169 | 185-186, 188 | Neutral probing, checking understanding, and corroboration develop evidence without assuming a violation. |
| Q018 | Conflict resolution / III.C | Analyze | 110, 154-155 | 129, 173-174 | Consider valid counterevidence and correct the auditor's mistaken interpretation; a nonconformity requires a supported requirement gap. |
| Q019 | Audit program evaluation / IV.A.4 | Evaluate | 185-187 | 204-206 | Evaluate outcomes against documented objectives, with relevant comparable measures and attention to repeat causes and corrective-action effectiveness. |
| Q020 | Sampling methods / V.E.2 | Apply | 290-291 | 309-310 | Proportional allocation and random selection within each stratum are separate parts of the specified sampling design. |

### Batch 2 reasoning and numerical checks

- **Q011-Q013:** the stems explicitly establish the commissioning party, process boundaries, and appointed roles. Answers do not depend on undisclosed delegation, employment status alone, or an unstated contractual hierarchy.
- **Q014:** the established cache condition explains why another confirmation of the already-correct revision number does not address the cause. The response requests a suitable auditee-owned plan, without imposing the auditor's preferred technical solution.
- **Q015:** 32 error-free records from same-shift work do not test a control intended for shift handovers. The correct conclusion is unresolved effectiveness; absence of relevant evidence is not itself proof of recurrence.
- **Q016-Q018:** the statements supply the competence gap, resolve the supervisor-interruption step, and authorize amendment of a proposed finding. These details prevent competing interpretations about authority or the next permitted action.
- **Q019:** 8/40 = 20% and 12/80 = 15%, a decrease of five percentage points. The raw recurrence count rises by 50%, but the follow-up population doubles. Dividing by audits gives 8/24 = 12/36 = 33.3%, which uses the wrong denominator for the defined objective. The item reports progress on the stated measure, without asserting that the audit program caused it.
- **Q020:** 720 + 200 + 80 = 1,000 tickets. A proportional sample of 75 gives 54, 15, and 6 tickets, totaling 75. All allocations are integers, so no unstated rounding rule is needed. Random selection of distinct IDs within each category satisfies the stated design. The handbook's worked example on p291 prints an erroneous denominator of 100 in one expression where 1,000 is required; this original example uses the correct population denominator and different values.

## Progress and remaining blueprint

| Domain | Batch 1 | Batch 2 | Current total | Final target | Remaining |
|---|---:|---:|---:|---:|---:|
| I. Auditing Fundamentals | 2 | 3 | 5 | 37 | 32 |
| II. Audit Process | 3 | 3 | 6 | 45 | 39 |
| III. Auditor Competencies | 2 | 2 | 4 | 30 | 26 |
| IV. Audit Program Management and Business Applications | 2 | 1 | 3 | 23 | 20 |
| V. Quality Tools and Techniques | 1 | 1 | 2 | 15 | 13 |
| **Total** | **10** | **10** | **20** | **150** | **130** |

Continue alternating the domain allocations already used: odd-numbered batches 2/3/2/2/1 and even-numbered batches 3/3/2/1/1. Across fifteen batches this produces exactly 37/45/30/23/15. Future items still need individual topic coverage, source validation, and independent review; the allocation alone is not content validation.

The first twenty questions include two document-case items (Q004-Q005) and six rendered data tables in total. Answer positions are balanced at five each for A, B, C, and D; the existing engine randomizes question order. The practice timing remains the site's existing two minutes per question, so the available twenty-question set uses forty minutes. This is a practice setting, not a claim that twenty questions constitute a full ASQ examination.

## Integration verification

- `node --test --test-isolation=none tests/test-bank-cqa-set1.test.js tests/test-bank-cqa-set2.test.js`: **13 passed, 0 failed**.
- `npm run build:site`: **passed**.
- The integrated learner checks exercise all twenty questions, forty-minute Full mode, correct grading, a capped twenty-question Quick Quiz, a ten-question diagnostic, all five focused domains, all six tables, and all sixty distractor explanations.
- An attempt with one deliberate wrong answer scores 95%; an all-correct attempt scores 100%.
- Set 1 remains at 150 unchanged questions. Set 2 content is included in the protected CQA package and excluded from the other exam packages and public staging.
- A comparison with the original Batch1 source confirms that only the three described questions changed and that all ten original answer keys were preserved.

PR #368 remains an accumulation branch; publication is deferred until all 150 questions are ready. No merge or production deployment is part of this batch update.
