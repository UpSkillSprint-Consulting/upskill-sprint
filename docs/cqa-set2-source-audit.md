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

### Batch 2 re-audit before adding Batch 3

A second independent audit checked Q011-Q020 from the integrated bank before authoring Q021-Q030. All ten stems, forty answer choices, ten answer explanations, thirty distractor rationales, cognitive labels, and current BoK mappings passed. **No question, answer key, or printed page reference required correction.** The existing Batch 2 content is retained without changes.

All 28 distinct cited printed pages were read again and their visible page labels independently inspected in the source PDF. Every reference in the Batch 2 table above is accurate; the corresponding one-based PDF page remains the printed page plus 19. This check included the beginning and end of each cited range, not only the chapter title or a search-result match.

The numerical work was recalculated: Q019 remains 20% versus 15%, a decrease of five percentage points; Q020 remains 54, 15, and 6 selections, totaling 75. The p291 denominator printing error is not reproduced. The audit also reconfirmed that Q015 distinguishes absent relevant effectiveness evidence from demonstrated recurrence, and Q017's neutral questioning and corroboration are supported by its cited passages. The current BoK explicitly includes paraphrasing as an interviewing technique.

## Batch 3: Q021-Q030

All ten new items received an independent review of their final wording, answers, distractor rationales, source passages, and 2026 BoK/cognitive mappings. All 23 distinct cited printed-page labels were also independently checked in the actual PDF, including glossary p370. No answer-key, arithmetic, or source-location error remains. Two authoring refinements were incorporated before integration: Q022 explicitly identifies completed jobs, and Q030 requires the learner to calculate the Pareto contributions from the exhibit rather than supplying those totals in the choices.

| Item | Topic / BoK | Item demand | Verified printed pages | One-based PDF pages | Supporting principle |
|---|---|---|---|---|---|
| Q021 | Audit types / I.A.1 | Analyze | 3-5 | 22-24 | Distinguish a focused process audit from product, system, and document-only audits by the primary subject and scope, not a single evidence source. |
| Q022 | Benefits: effectiveness and efficiency / I.B.2 | Analyze | 14, 18, 370 | 33, 37, 389 | Objective attainment and resource use are separate dimensions; audits can inform management about both. The glossary explicitly defines the distinction. |
| Q023 | Backward tracing / II.A.6 | Apply | 81-82 | 100-101 | Follow the selected transaction upstream from its output through its linked activities and inputs. |
| Q024 | Objective evidence / II.B.5 | Analyze | 104, 107 | 123, 126 | Address contradictory evidence and distinguish a verified documentary inconsistency from an unverified claim about the physical event. |
| Q025 | Final report steps / II.C.3 | Apply | 126, 131 | 145, 150 | Apply the stated approval, client-authorized distribution, and supporting-record retention controls. |
| Q026 | Auditor characteristics / III.A | Apply | 151 | 170 | Use cultural sensitivity, impartiality, diplomacy, and adaptability without weakening evidence standards or treating unfamiliar behavior as proof. |
| Q027 | Team dynamics / III.F | Apply | 173-174 | 192-193 | Facilitate balanced participation and evidence-based assessment while retaining the lead's responsibility for the team's deliverables. |
| Q028 | Staffing and resource management / IV.A.2 | Analyze | 180, 190-191 | 199, 209-210 | Budget the complete audit-program workload and distinguish auditor capacity from separate auditee participation. |
| Q029 | Organizational risk and scheduling / IV.A.8 | Analyze | 196, 207-208 | 215, 226-227 | Reconsider audit priorities using criticality, current changes, history, and applicable obligations together. |
| Q030 | Pareto interpretation / V.A | Analyze | 224-225 | 243-244 | Rank contributions using the measure that matches the objective; prioritization does not prove a cause or guarantee recoverable savings. |

### Batch 3 reasoning and numerical checks

- **Q021:** observing a specific bonding operation's inputs, settings, qualifications, methods, and results supports the process-audit classification. The stated scope distinguishes it from a broader system audit, and actual observation distinguishes it from a desk review.
- **Q022:** both periods have 100 comparable completed jobs and 96 on-time completions. Both therefore achieve 96%, above the 95% target. Labor per completed job rises from 150/100 = 1.5 hours to 180/100 = 1.8 hours. The work mix and other results are held constant. The explanation distinguishes lower labor efficiency from failure of the stated effectiveness objective and makes no unsupported causal claim.
- **Q023-Q024:** the original pump-service case supplies the complete context and the same four-row exhibit in each item, so both remain answerable when shuffled. The backward trail is SR-604 to TS-604 to WO-604 to CR-218. The conflicting P-37/P-73 identifiers establish a record inconsistency, not which pump was physically tested or why the inconsistency arose. The case tests different decisions from the earlier release-control case.
- **Q025:** the scenario explicitly defines both required approvals, the distribution list, and retention of completed working papers. It does not invent a universal approval chain or fixed retention period.
- **Q026-Q027:** adapting communication does not excuse unsupported adverse judgments or a lower evidence standard. Balanced participation does not require accepting a premature vote, seniority, or unreconciled interpretations as a sound team conclusion.
- **Q028:** each audit requires 4 + 12 + 6 = 22 auditor-person-hours; eight audits require 176. A once-annual program review adds 24, for total auditor demand of 200. Available capacity is 176, so the shortfall is 24. Separately, auditee participation requires 8 x 9 = 72 person-hours. All figures are already summed person-hours, and the resource pools and frequencies are explicit. This differs from Q003's elapsed audit-day scheduling problem.
- **Q029:** the additional audit is discretionary and all mandatory coverage is already resourced. The prior clean audit predates the critical process changes, so it cannot establish the effectiveness of the changed arrangements. Priority does not itself imply that the process is nonconforming.
- **Q030:** invoice errors cost 60 x $20 = $1,200; packaging damage 40 x $50 = $2,000; late dispatch 20 x $180 = $3,600; wrong configuration 8 x $600 = $4,800. Total recorded cost is $11,600. The two largest cost contributions sum to $8,400, or 72.4%, meeting the stated 70% threshold. The two most frequent categories instead account for $3,200, or 27.6% of cost. Choices name only category pairs, so the exhibit must supply the analysis. The categories are mutually exclusive and use complete, consistent accounting rules; no 80/20 rule or causal certainty is assumed.

### Final authoring refinements

- Q022 now says **completed jobs**, explicitly supporting the labor-per-completed-job denominator. The four jobs not completed on time are late completed jobs, not potentially unfinished work.
- Q030's choices now name category pairs without giving their aggregate costs or the total denominator. The key and arithmetic are unchanged, and all three distractor explanations retain the calculations and reasoning.
- These are refinements to new Batch 3 items. The successful re-audit required no change to Batch 2.

## Progress and remaining blueprint

| Domain | Batch 1 | Batch 2 | Batch 3 | Current total | Final target | Remaining |
|---|---:|---:|---:|---:|---:|---:|---:|
| I. Auditing Fundamentals | 2 | 3 | 2 | 7 | 37 | 30 |
| II. Audit Process | 3 | 3 | 3 | 9 | 45 | 36 |
| III. Auditor Competencies | 2 | 2 | 2 | 6 | 30 | 24 |
| IV. Audit Program Management and Business Applications | 2 | 1 | 2 | 5 | 23 | 18 |
| V. Quality Tools and Techniques | 1 | 1 | 1 | 3 | 15 | 12 |
| **Total** | **10** | **10** | **10** | **30** | **150** | **120** |

Continue alternating the domain allocations already used: odd-numbered batches 2/3/2/2/1 and even-numbered batches 3/3/2/1/1. Across fifteen batches this produces exactly 37/45/30/23/15. Future items still need individual topic coverage, source validation, and independent review; the allocation alone is not content validation. The next requested batch will be Q031-Q040 with allocation 3/3/2/1/1.

The first thirty questions include four document-case items (Q004-Q005 and Q023-Q024), or 13.3%, and ten rendered data tables in total. Answer positions are A:7, B:8, C:8, D:7; the existing engine randomizes question order. The practice timing remains the site's existing two minutes per question, so the available thirty-question set uses sixty minutes, displayed as one hour. This is a practice setting, not a claim that thirty questions constitute a full ASQ examination.

## Integration verification

- `node --test --test-isolation=none tests/test-bank-cqa-set1.test.js tests/test-bank-cqa-set2.test.js`: **13 passed, 0 failed**.
- `npm run build:site`: **passed**, including the protected-content scans (619 public files, no known static findings; three clean protected-tool shells).
- The integrated learner checks exercise all thirty questions, one-hour Full mode, correct grading, a capped thirty-question Quick Quiz, a ten-question diagnostic, all five focused domains, all ten tables, and all ninety distractor explanations.
- An attempt with one deliberate wrong answer scores 29/30, displayed as 96.67%; an all-correct attempt scores 100%.
- The initial test expectation used the text `60 min`; the existing UI correctly formats sixty minutes as `1 hr`. The expectation was corrected to the existing display convention, and the full targeted suite then passed. The runtime timer was independently checked at 3,600 seconds. No timer implementation change was needed.
- Set 1 remains at 150 unchanged questions. Set 2 content is included in the protected CQA package and excluded from the other exam packages and public staging.
- A comparison with the preceding PR bank confirms that all twenty existing question objects, including every key and source reference, are unchanged in this batch update.

PR #368 remains an accumulation branch; publication is deferred until all 150 questions are ready. No merge or production deployment is part of this batch update.
