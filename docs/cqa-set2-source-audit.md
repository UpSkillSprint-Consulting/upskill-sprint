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

### Batch 3 re-audit before adding Batch 4

A new independent re-audit checked Q021-Q030 from the canonical integrated bank. All ten stems, forty choices, ten keys and answer explanations, thirty distractor rationales, learning points, exhibits, and BoK/cognitive mappings passed. **No answer, wording, calculation, or source-reference correction was required.**

All 23 distinct cited printed pages were read again and their visible folios independently checked in the actual PDF. The references in the Batch 3 table above remain accurate, including glossary p370/PDF389 and chapter-opening p224/PDF243. Every cited page retains the printed-page-plus-19 PDF mapping.

The re-audit recalculated Q022's 96% on-time result and 1.5-to-1.8 labor-hours per completed job; Q028's 24-hour auditor shortfall and separate 72 auditee-hours; and Q030's $8,400/$11,600 = 72.4% cost contribution. It also verified that Q023 and Q024 contain identical complete exhibits and remain answerable independently when shuffled. All thirty preceding question objects are retained unchanged in the Batch 4 update.

## Batch 4: Q031-Q040

The final ten new questions passed independent content and source review. The review checked all stems, choices, answer keys, explanations, thirty distractor rationales, learning points, and BoK/cognitive mappings. All 19 distinct cited printed-page folios were independently rendered and inspected in the actual PDF. The final integration is checked against the exact reviewed author arrays before the PR update.

| Item | Topic / BoK | Item demand | Verified printed pages | One-based PDF pages | Supporting principle |
|---|---|---|---|---|---|
| Q031 | Audit purpose / I.A.3 | Analyze | 7, 16, 139 | 26, 35, 158 | Distinguish a problem-triggered investigation from later verification that corrective actions were implemented and effective. |
| Q032 | Common audit elements / I.A.4 | Apply | 9, 11 | 28, 30 | Use the shared planned, objective evidence-and-criteria framework while retaining discipline-specific criteria and competence. |
| Q033 | Audit credibility / I.E.3 | Apply | 48, 50 | 67, 69 | Preserve impartial reporting and obtain management support against incentives that encourage suppressing supported findings. |
| Q034 | Pre-audit documentation / II.A.3 | Analyze | 71 | 90 | Examine document adequacy and interfaces; a requirement-to-document matrix does not itself establish an integrated or functioning system. |
| Q035 | Working papers and checklists / II.A.5 | Apply | 77-78 | 96-97 | Adapt the working papers to relevant activities within the agreed scope; a checklist is neither the standard nor the scope boundary. |
| Q036 | Opening meeting / II.B.3 | Apply | 95-96 | 114-115 | Confirm shared understanding of the approved plan, classification and reporting arrangements, and feasible activities before fieldwork. |
| Q037 | Electronic communication / III.D | Evaluate | 164 | 183 | Select agreed remote-review arrangements that meet the evidence need and preserve each participant's access authorization. |
| Q038 | Interviewing through a translator / III.E | Apply | 168 | 187 | Plan for a skilled, preferably independent translator, short clear questions, and sufficient additional time. |
| Q039 | Best practices / IV.A.7 | Evaluate | 201-203 | 220-222 | Assess performance evidence, local fit and enabling conditions, with authorized implementation ownership and follow-up. |
| Q040 | Verification and validation / V.G | Analyze | 301-302 | 320-321 | Distinguish fulfillment of specified requirements from fulfillment of intended-use needs under representative conditions. |

### Batch 4 reasoning and ambiguity checks

- **Q031:** recent omitted records trigger the additional supplier audit. Corrective actions for those omissions have not yet been implemented. The primary purpose is the present investigation, distinct from a later effectiveness check; the scenario is original and does not copy the handbook's contaminated-material example.
- **Q032:** both disciplines have qualified participants and their own criteria. Common collection and tracing methods do not make requirements interchangeable or make record existence sufficient proof of traceability.
- **Q033:** the auditee agrees that the requirement and evidence support the nonconformity. The requested omission is motivated solely by the bonus effect. The answer preserves the established reporting route and seeks program-management support; it does not prohibit legitimate correction of factual errors.
- **Q034:** the supplied documents leave the handoff between accepted customer changes and revised production packages unexplained. The proper result is clarification and targeted evidence collection, not a claim that an actual transfer failed or that no other control exists.
- **Q035:** both manual and automated routes are explicitly within scope, and resources allow both to be examined. Adding criteria-linked prompts adapts the checklist; it does not expand the audit scope or authorize importing automated features as requirements for the manual route.
- **Q036:** the plan and classification scheme are already client-approved, and authority to change them is expressly limited. The opening meeting must resolve the known difference in expectations before work proceeds; no universal rating scheme is invented.
- **Q037:** the team and client engineer are authorized to review the full file, while observers are authorized only for a summary. The approved portal offers an available restricted arrangement. View-only settings or confidentiality labels do not grant additional recipients permission to see the contents.
- **Q038:** a technically prepared independent translator is already available and accepted, and the lead can adjust interview slots. The answer therefore addresses communication quality and time without inventing a fixed multiplier or transferring the auditor's investigation to a language-support role.
- **Q039:** the audit program explicitly authorizes identifying and sharing positive practices. The successful local method is approved, but the receiving site has different enabling conditions and an established change-approval process. The answer supports evidence-based adaptation and follow-up rather than automatic copying or an unsupported claim of identical results.
- **Q040:** bench tests support the specified data-entry and calculation functions. The separate intended-use conditions, including gloves and intermittent connectivity, remain unrepresented. The evidence gap calls for appropriate real or simulated intended-use evidence; it does not itself prove failure. Verification and validation are distinguished by the requirements being demonstrated, not by whether a test, observation or record is used.

### Final authoring clarification

Q040 uses **data-entry checks** instead of the software phrase **input-validation** in the stem and explanation. This prevents that separate software meaning of validation from obscuring the formal verification-versus-validation distinction. The answer key, scenario logic and source references are unchanged.

This batch contains ten standalone scenarios and no new linked document case or numerical exhibit. All thirty prior question objects, including every answer key and source reference, are retained unchanged.

### Batch 4 re-audit before adding Batch 5

A fresh re-audit of the canonical Q031-Q040 objects found **no correction required**. All ten stems, forty choices, ten keys and answer explanations, thirty distractor rationales, key points, traps, and current BoK/cognitive mappings were checked against the actual sources rather than relying on the preceding authoring reports.

All 19 distinct cited printed pages were reread, freshly rendered, and visually checked against their visible folios: 7, 9, 11, 16, 48, 50, 71, 77-78, 95-96, 139, 164, 168, 201-203, and 301-302. Every reference in the Batch 4 table remains accurate, with the corresponding one-based PDF page equal to the printed page plus 19. Printed p301's bottom-centre folio was explicitly checked.

The review confirmed that Q031 distinguishes the current for-cause investigation from later CAPA verification; Q033 preserves evidence-based reporting without preventing legitimate factual corrections; Q034 does not treat a documentation gap as proof of an operating failure; and Q035 adapts a working paper within the existing scope. Q036 preserves client approval authority, Q037 distinguishes information-access authorization from technical viewing controls, and Q038 does not impose an invented translation-time multiplier. Q039 retains local-fit, authorization, ownership and follow-up requirements. Q040 correctly distinguishes specified requirements from intended-use needs, without defining verification or validation by the physical form of the evidence.

All ten items are independently answerable, have one defensible best answer under their stated conditions, and retain supported distractor rationales. No numerical recalculation was needed for this batch. All forty preceding question objects are retained unchanged in the Batch 5 update.

## Batch 5: Q041-Q050

The ten new questions passed separate author and independent content/source reviews. All stems, forty choices, ten keys and explanations, thirty distractor rationales, key points, traps, and BoK/cognitive mappings were checked. All 21 distinct cited printed pages were read and their visible folios independently verified in the source PDF, including bottom folios on pp20, 172 and 267. The integrated new objects match the exact final reviewed author arrays.

| Item | Topic / BoK | Item demand | Verified printed pages | One-based PDF pages | Supporting principle |
|---|---|---|---|---|---|
| Q041 | Conflicts of interest / I.E.1 | Apply | 31 | 50 | Promptly disclose a newly recognized financial interest and let the responsible audit authority manage the assignment. |
| Q042 | Audit criteria / I.C | Analyze | 20-21 | 39-40 | Distinguish unincorporated guidance from requirements adopted through applicable contracts, policies or other criteria. |
| Q043 | Organization of objective evidence / II.B.6 | Apply | 108-109 | 127-128 | Classify observations by their significance and the agreed risk-based rubric rather than by occurrence count alone. |
| Q044 | Closing meetings / II.B.7 | Apply | 114-116, 130 | 133-135, 149 | Preserve agreed facts and unresolved grading differences, explaining the authorized reporting, response and follow-up process. |
| Q045 | Ineffective corrective action / II.D.4 | Evaluate | 140-141 | 159-160 | Reassess confirmed recurrence, preserve the failed action's history and use documented escalation after the required initial review. |
| Q046 | Conflict resolution / III.C | Analyze | 155 | 174 | Allow a heated exchange to cool, then investigate the issue and the auditor's possible contribution with an open mind. |
| Q047 | Team development / III.F | Apply | 172-173, 175 | 191-192, 194 | Re-establish shared objectives, assignments and deliverables when the team's purpose and membership change. |
| Q048 | Electronic records / IV.A.10 | Apply | 73, 131-132 | 92, 150-151 | Test completeness, readability and retrieval of retained migrated records and attachments against the stated retention requirement. |
| Q049 | Business-process interrelationships / IV.B.2 | Understand | 216 | 235 | Explain how a local target can reward incomplete handoffs and worsen performance across interdependent processes. |
| Q050 | Central tendency / V.C.1 | Apply | 267-268 | 286-287 | Use the arithmetic mean when the per-item summary must reproduce the actual total across the complete defined data set. |

### Reasoning, source and ambiguity checks

- **Q041:** the paid engagement began after the original independence declaration, and the auditor shares its profit even though another partner negotiated it. Prompt disclosure to the program manager is required before relying on an assignment decision. The correct answer does not claim that a second review or the auditee's consent automatically resolves the conflict. The [current official ASQ Code of Ethics](https://asq.org/about-asq/conferences-events-policies/code-of-ethics) was also checked for consistency with the handbook's disclosure and conflict-avoidance principle.
- **Q042:** the applicable contract and TM-6 permit condition-based replacement; the trade guide is explicitly background and has not been incorporated through another applicable requirement. The answer therefore rejects only the claimed annual-interval nonconformity. It does not imply that voluntary standards can never become binding criteria or that every part of the system has been proven effective.
- **Q043:** the exhibit gives a required four-hour recovery demonstration and one verified seven-hour result. The supplied rubric expressly assigns Grade 1 to that failure even once. Six filing-code omissions meet the supplied Grade 2 condition because the related records remain identifiable and retrievable, those exercises met the recovery requirement, and no recovery impact was identified. The question does not invent universal ASQ grading definitions or estimate population failure rates from the two different samples.
- **Q044:** the facts and requirements are agreed, the lead has explained the rubric, and no new evidence changes the classification. The audit procedure explicitly permits reporting to continue while unresolved grading differences are recorded and referred. Acknowledgment is distinguished from agreement; the auditee's disagreement is preserved without an unsupported downgrade or a veto over reporting.
- **Q045:** recurrence is verified after implementation and after review of evidence, the follow-up method and resource availability. Discussion has not produced an acceptable revised response, and the stated procedure authorizes referral while the request stays open. The explanation does not invent a finding that resources were adequate, blame the auditee without review, sever the original finding's history, or prescribe the auditor's preferred technical solution.
- **Q046:** both participants have stopped listening, the log copy is secured, no immediate safety issue or urgent decision intervenes, and a brief pause is feasible. The lead can restore communication without treating an unproven accusation as established misconduct or dropping the timestamp discrepancy.
- **Q047:** technical competence and resources are adequate, but changed purpose and membership have left interface responsibilities unclear. The response addresses the observed coordination problem. The regression statement is on printed p175; pp172-173 support role, method and deliverable clarity. No fixed sequence of team stages is imposed.
- **Q048:** the six-year retention period is supplied by the organization's procedure. Matching migration counts and successful backup jobs do not establish that historical contents and attachments remain complete and usable. Retrieval through the authorized route and comparison with the available source test the stated risk; sampled results are not presented as proof about every record. P73 supplies direct support for retained readability, supplementing the electronic-record safeguards on pp131-132.
- **Q049:** the stem supplies both the incomplete handoffs and verified local/overall performance changes. The item asks the learner to explain this process relationship, within the topic's Understand ceiling. It does not require policy optimization or infer a financial impact from insufficient data.
- **Q050:** the genuine 48-minute job belongs to the complete set. The summary's explicit purpose is reconciliation of observed labour, so the arithmetic mean is required. The explanation preserves the legitimate uses of other central measures without substituting them for the stated reporting objective or forecasting future capacity.

### Case and numerical checks

Q043 and Q044 use the same original data-recovery case, with identical complete shared context and data-table objects. Each has its own question and complete necessary information. Their shared `caseId` does not create a dependency: both remain answerable independently after shuffling. The exhibit includes the specific requirements and verified observations; neither question relies on a conclusion given only in the other.

The Q043 comparison is 7 hours versus a 4-hour requirement. The assigned grade follows the explicit exercise-based rubric, without requiring an actual outage or permanent data loss.

Q050 uses eight verified labour times: 8, 9, 11, 11, 12, 14, 15 and 48 minutes. Their total is **128 minutes** and their mean is **128 / 8 = 16.0 minutes per request**. The median is **(11 + 12) / 2 = 11.5**, and the mode is **11**. Removing the valid long job gives **80 / 7 = 11.4286**, or **11.4** to one decimal, but changes the required data set. The distractor checks also confirm **11.5 x 8 = 92** and **11 x 8 = 88**, neither equal to 128.

### Final authoring refinements

- Q043's correct choice says **failing the required four-hour recovery demonstration**, limiting the statement to what the exercise evidence shows.
- Q045's distractor explanation no longer asserts an unstated negative result from the resource/evidence review.
- Q043's actual cognitive label is **Apply**, because the complete supplied rubric is directly applied. The official II.B.6 **Evaluate** level is the ceiling, not a requirement to label every item Evaluate.
- Q049's explanation omits an unnecessary meta sentence about the scope of the question; its substantive teaching content is retained.

All keys and references were retained during these new-item refinements. The successful Batch 4 re-audit required no change to the preceding forty questions.

## Progress and remaining blueprint

| Domain | Batch 1 | Batch 2 | Batch 3 | Batch 4 | Batch 5 | Current total | Final target | Remaining |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| I. Auditing Fundamentals | 2 | 3 | 2 | 3 | 2 | 12 | 37 | 25 |
| II. Audit Process | 3 | 3 | 3 | 3 | 3 | 15 | 45 | 30 |
| III. Auditor Competencies | 2 | 2 | 2 | 2 | 2 | 10 | 30 | 20 |
| IV. Audit Program Management and Business Applications | 2 | 1 | 2 | 1 | 2 | 8 | 23 | 15 |
| V. Quality Tools and Techniques | 1 | 1 | 1 | 1 | 1 | 5 | 15 | 10 |
| **Total** | **10** | **10** | **10** | **10** | **10** | **50** | **150** | **100** |

Continue alternating the domain allocations already used: odd-numbered batches 2/3/2/2/1 and even-numbered batches 3/3/2/1/1. Across fifteen batches this produces exactly 37/45/30/23/15. Future items still need individual topic coverage, source validation, and independent review; the allocation alone is not content validation. The next requested batch will be Q051-Q060 with allocation 3/3/2/1/1.

The first fifty questions contain six document-case items (Q004-Q005, Q023-Q024 and Q043-Q044), or 12%, and thirteen rendered data tables. Answer positions are A12/B13/C13/D12. The existing engine randomizes question order. Practice timing remains two minutes per question, so the available fifty-question set uses one hundred minutes, displayed as one hour and forty minutes. This is a partial practice set.

## Integration verification

- `node --test --test-isolation=none tests/test-bank-cqa-set1.test.js tests/test-bank-cqa-set2.test.js`: **13 passed, 0 failed**.
- `npm run build:site`: **passed**, including protected-content scans of 619 public files with no known static findings and three clean protected-tool shells.
- The learner checks exercise all fifty questions, a one-hundred-minute Full session, correct grading, a fifty-question Quick Quiz, a ten-question diagnostic, all five focused domains, all thirteen tables, and all 150 distractor explanations.
- An attempt with one deliberate wrong answer scores 49/50, displayed as 98%; an all-correct attempt scores 100%.
- The runtime timer was checked at 6,000 seconds and the existing display convention at `1 hr 40 min`. Quick Quiz now serves the full fifty-question request without the earlier availability-cap notice. No timing or quiz-engine implementation change was needed.
- Set 1 remains at 150 unchanged questions. Set 2 is delivered in the protected CQA package and excluded from other exam packages and public staging.
- The preceding forty question objects were compared with the prior PR bank and are unchanged. The ten new objects exactly match the frozen author arrays; both case exhibits and their complete shared context are identical.
- JavaScript syntax checks passed. The HTML change since the preceding PR head is only the CQA completion label, from Batch 4 to Batch 5; unrelated files regenerated by the build are excluded from the content commit.

PR #368 remains an accumulation branch; publication is deferred until all 150 questions are ready. No merge or production deployment is part of this batch update.
