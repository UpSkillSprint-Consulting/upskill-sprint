# CQA Set 2: source and question audit

Audit record started: 2026-10-28. Latest batch review: 2026-10-29 (UTC). This record accompanies PR #368, which is accumulating one reviewed batch of ten questions at a time toward 150. The PR is to remain unmerged until all 150 questions are ready.

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

### Batch 5 re-audit before adding Batch 6

A fresh review of the canonical Q041-Q050 objects found **no correction required**. All ten stems, forty options, ten keys and main explanations, thirty distractor rationales, learning points, traps, exhibits, and current BoK/cognitive mappings were checked against the actual source passages. Earlier authoring reports were not used as a substitute for source verification.

All 21 distinct cited printed pages were reread and freshly rendered, and their visible folios were independently inspected. Every printed/PDF reference in the Batch 5 table remains accurate, with the one-based PDF position equal to the printed page plus 19. The bottom-centre folios on pp20, 172 and 267 were explicitly verified. The team-development regression statement is correctly cited to p175.

Q043 and Q044 retain identical complete shared context, evidence tables and case identifiers. Both can be answered independently after shuffling. Their local grading and dispute procedures are explicit; neither a universal severity scheme nor a requirement for unanimous agreement is invented. Q045's explanation remains within the stated evidence and does not claim that the resource review established adequate resources. Q048 correctly treats six years as the scenario's organizational retention requirement and limits its conclusions to sampled evidence.

Q050 was independently recalculated: total 128 minutes across eight requests; mean 16.0; median 11.5; mode 11; and 80/7 = 11.4286 after the expressly inappropriate exclusion of the valid 48-minute request. The median and mode checks remain 92 and 88 minutes respectively when multiplied by eight. All numerical distractors and rationales are accurate. Q043's seven-hour exercise exceeds its stated four-hour requirement.

All fifty preceding question objects, including every key, explanation and source reference, are retained unchanged in the Batch 6 update.

## Batch 6: Q051-Q060

All ten original questions passed author review, a separate independent review, and final integration review. All forty options, ten keys and main explanations, thirty distractor rationales, learning points, traps, and the takt-time exhibit were examined. The fifteen distinct cited printed pages were read and freshly rendered; their visible folios were independently verified, including the chapter-opening footer on p2. Every source reference below uses printed handbook pages.

| Item | Topic / 2026 BoK | Actual cognitive level | Printed pages | One-based PDF pages | Verified principle |
|---|---|---|---|---|---|
| Q051 | Joint and combined audits / I.A.1 | Analyze | 2 | 21 | Distinguish participation by multiple auditing organizations from multiple management systems, internal subgroups, or observers. |
| Q052 | Professional responsibilities / I.E.1 | Apply | 35 | 54 | Withdraw an endangered audit team, promptly notify the auditee and record the observation when safe. |
| Q053 | Legal consequences / I.E.2 | Analyze | 41 | 60 | Recognize potential exposure when a client relies on an unsupported audit assurance without declaring a legal outcome. |
| Q054 | Audit logistics / II.A.4 | Apply | 74-75 | 93-94 | Confirm the separate access authorization and confidentiality arrangements needed for planned evidence review. |
| Q055 | On-site management for the auditee / II.B.2 | Apply | 94 | 113 | Facilitate requested evidence and agree practical sequencing without unilaterally replacing the auditor's selection. |
| Q056 | Audit closure / II.D.5 | Apply | 141-142 | 160-161 | Close verified individual findings with written notification while preserving accurate unresolved and overall status. |
| Q057 | Interviewing techniques / III.E | Apply | 159, 169 | 178, 188 | Confirm the meaning of local terminology and then corroborate the relevant sequence with records. |
| Q058 | On-site resource management / III.B | Apply | 152-153 | 171-172 | Coordinate a feasible activity exchange while preserving evidence collection, note review and closing preparation. |
| Q059 | Management review input / IV.A.9 | Evaluate | 209-210 | 228-229 | Connect findings, action effectiveness and coverage limits to management's risk and resource decisions. |
| Q060 | Lean tools / V.B.2 | Apply | 264 | 283 | Calculate takt using net available work time and customer demand for the same period. |

### Reasoning, source and ambiguity checks

- **Q051:** both customers share responsibility for conducting the audit of one quality management system. An observer, another recipient of a report, or two subgroups from one organization do not create that arrangement. The explanation does not turn the handbook's contextual suggestion of a third-party participant into a universal requirement for a joint audit.
- **Q052:** the hazard endangers the team, the site requires immediate withdrawal, and a safe route is expressly available. Withdrawal does not depend on changing the audit scope. The item does not assume that the lead can direct supplier operations, close a warehouse or expand the assignment unilaterally.
- **Q053:** permitted sampling is distinguished from the specifically false claim of directly verifying both shifts. The auditor did no work on night-shift controls. Potential exposure depends on the unsupported assurance and reliance; responsibility and damages remain subject to the facts and applicable legal assessment. Only p41 is cited. The categorical prioritization/liability example on p42 and the certification-specific care discussion on p43 are not used.
- **Q054:** general visitor badges do not fulfill the stated separate record-access authorization or approved-workspace requirements. The explanation describes the actual proposed access bypass and does not invent credential sharing or an NDA requirement.
- **Q055:** the selected prior-year records can be retrieved in 45 minutes, with two hours remaining and other planned work available. The coordinator facilitates retrieval and seeks agreement on sequencing. Neither favourable recent records nor a statement that the requested records exist replaces their examination.
- **Q056:** the local procedure explicitly permits individual finding closure and keeps the overall audit open until all finding criteria are met. F1 and F2 have verified implementation and effectiveness. F3's future agreed check is neither overdue nor already satisfied. The explanation does not impose this overall-closure rule on every audit program.
- **Q057:** the technician has already supplied the local meaning. Restating it and inviting correction checks understanding without treating that clarification as proof of conformity. Test and dispatch records are still needed to corroborate the sequence.
- **Q058:** both activities are independent, all required participants and records are available in the exchanged periods, and the lead can resequence within scope. Each slot includes note confirmation. Printed p153 was added to p152 because it directly supports protecting closing-preparation time.
- **Q059:** similar findings at established providers are not extended automatically to unaudited providers. The item distinguishes calendar completion from effective controls and asks for useful management input about current coverage, unverified actions and fully allocated resources.
- **Q060:** the exhibit explicitly supplies net available time and says no other deductions apply. The resulting takt is a required pace, not measured cycle time, demonstrated process capacity or a forecast of output.

### Numerical, novelty and review checks

Q060 was independently recalculated for the key and every numerical distractor: **420 / 140 = 3.00 minutes per kit**; **420 / 120 = 3.50** incorrectly uses previous output; **480 / 140 = 3.4286**, or **3.43**, incorrectly uses gross time; and **(420 - 60) / 140 = 2.5714**, or **2.57**, deducts the same breaks twice. The exhibit reconciles **480 - 60 = 420 minutes**.

The ten items were checked against Set 1's 150 questions and Set 2's first fifty for repeated stems and closely repeated decisions. The original unscheduled-tour idea for Q058 was replaced with an exchange of independent time slots because Set 1 already has a similar tour-related time-management item. Recurring competencies use different evidence and decisions. These ten items are standalone; no new formal shared case pair is claimed.

The final independent review approved the exact Q051-Q055 array with SHA-256 `ce040c70c8c6c44c297085e15f70b2d14393ba32cc60047c10174547f7755d5d` and Q056-Q060 array with SHA-256 `2d25da33ba8e2e1c148b785fb8b8aa4b342ae7f7c71dddf456f88979dd6e11ad`. Both were frozen before integration. Their final keys are **D/A/C/B/A/D/B/A/D/C**. Source review and cognitive alignment support the intended practice demand; they do not establish empirical equivalence to live ASQ item difficulty.

### Batch 6 re-audit before adding Batch 7

A fresh review of the canonical Q051-Q060 objects found **no correction required**. The two reviewers audited the opposite halves from their prior authoring assignments. Every stem, forty choices, ten keys and main explanations, thirty distractor rationales, teaching fields, current BoK/cognitive mappings and the takt exhibit were checked against the actual source passages. Prior review reports were not used as substitutes for verification.

All fifteen distinct cited printed pages were reread and freshly rendered, and their visible folios were independently inspected. Every printed/PDF reference in the Batch 6 table remains accurate: pp2, 35, 41, 74-75, 94, 141-142, 152-153, 159, 169, 209-210 and 264. The one-based PDF positions are respectively 21, 54, 60, 93-94, 113, 160-161, 171-172, 178, 188, 228-229 and 283. These labels confirm the printed-plus-19 mapping individually.

The review reconfirmed Q051's distinction between participating auditing organizations and multiple systems or observers; Q052's immediate safety response and authority limit; Q053's conditional reliance-related exposure rather than an automatic legal conclusion; Q054's separate access and workspace arrangements; and Q055's preservation of requested evidence during a feasible retrieval delay. Q056 expressly states its local overall-audit closure rule. Q057 confirms meaning before corroborating conformity. Q058 correctly includes p153 for closing preparation. Q059 treats unaudited providers as a coverage question rather than automatically nonconforming.

Q060 and all numerical distractors were independently recalculated: 480 - 60 = 420 available minutes; 420 / 140 = **3.00 minutes per kit**; 420 / 120 = 3.50; 480 / 140 = 24/7, approximately 3.43; and (420 - 60) / 140 = 18/7, approximately 2.57. The explanation correctly identifies the wrong denominator, gross-time and repeated-deduction errors and does not treat takt as measured capacity.

The reviewed canonical bank SHA-256 was `7f9104941f3ddc38e365490b06fe73b0da89dd4f5fc4571e8955d009306f6ba5`. All sixty preceding question objects are retained unchanged in the Batch 7 update.

## Batch 7: Q061-Q070

All ten original questions passed author review, a separate independent review and final integration review. The review covered every stem, all forty choices, ten keys and main explanations, thirty distractor rationales, teaching fields, the complete storage-excursion case and both standalone data tables. All **23 distinct cited printed pages** were read and freshly rendered, and their visible folios were independently verified. Printed p. 314's appendix footer and p. 269's complete square-root formula were explicitly checked. Citations identify the principles supporting the original scenarios rather than suggesting that the questions appear in the book.

| Item | Topic / 2026 BoK | Actual cognitive level | Printed pages | One-based PDF pages | Verified principle |
|---|---|---|---|---|---|
| Q061 | Desk-review evidence limits / I.A.1 | Apply | 4-5 | 23-24 | Distinguish adequate manuals/procedures from evidence of actual implementation and effectiveness. |
| Q062 | Technical expert's role / I.D | Apply | 25-26, 314-315 | 44-45, 333-334 | Use substantiated specialist input within the expressly assigned auditor, expert and lead responsibilities. |
| Q063 | Individual audit plan / II.A.7 | Evaluate | 85, 88 | 104, 107 | Turn a purpose and contract requirement into coordinated evidence work, assignments, timing and communication. |
| Q064 | Effective executive summary / II.C.2 | Evaluate | 128-130 | 147-149 | Report the verified control failure, response and open consequences without inventing damage or a cause. |
| Q065 | Elements of corrective action / II.D.1 | Analyze | 133-135 | 152-154 | Separate immediate containment from the auditee's required causal response and effectiveness verification. |
| Q066 | Auditor decisiveness / III.A | Apply | 151 | 170 | Reach timely, bounded conclusions when the required evidence work is sufficient and material questions are resolved. |
| Q067 | Temporal presentation for management / III.D | Evaluate | 165, 272 | 184, 291 | Preserve chronological order and appropriate context when communicating month-to-month change. |
| Q068 | Senior management support / IV.A.1 | Understand | 178-179 | 197-198 | Explain management's continuing structural support, commitment and constructive use of audit information. |
| Q069 | External supplier qualification / IV.A.6 | Evaluate | 6, 199 | 25, 218 | Evaluate capability and available sustained capacity before awarding a proposed delivery commitment. |
| Q070 | Sample standard deviation / V.C.2 | Apply | 268-269 | 287-288 | Sum squared deviations, divide by n-1 and take the square root to obtain sample dispersion in original units. |

### Reasoning, source and ambiguity checks

- **Q061:** only the revised manual and procedures were examined. Their adequacy is a valid result, but no operating records, interviews or observations support an implementation conclusion. The explanation does not claim that all document reviews exclude implementation evidence, that absent evidence proves ineffectiveness, or that the next audit must physically occur on site. The actual Apply label is below the topic's Analyze maximum.
- **Q062:** the specialist's non-auditor status and technical-support assignment are explicit. The specialist evaluates the actual method against applicable criteria and documents a useful technical conclusion. The qualified auditor and lead retain their stated responsibilities. Appendix C is expressly an example guide; its arrangements are not presented as universal mandatory rules. Pages 25–26 support the auditor and lead roles, while pp. 314–315 support the expert's technical evaluation and documented contribution.
- **Q063:** the contract requires approved terminology changes to reach applicable delivered manuals. Linked work across Change Control, Translation and Release addresses that end-to-end requirement more directly than disconnected department scores or document review alone. Assignments, timing and advance communication make this an individual-plan decision rather than a repetition of the earlier scope-selection item. The explanation does not claim that availability alone proves the entire workload fits into one day.
- **Q064:** the local procedure and verified logger establish a storage-condition failure. The held lots' fitness, actual damage and cause remain unestablished. An accurate management summary includes the immediate response and open obligations without declaring losses, assigning a cooling-equipment cause, or treating containment as proof that the original objective was met.
- **Q065:** the procedure explicitly requires a corrective-action request for this excursion, and CAR-27 is open. The item therefore does not impose formal CAPA on every isolated observation. The auditee owns cause investigation, recurrence-prevention actions, responsibilities, schedule and effectiveness verification. The later transfer provides compliant storage; it is not described as the event that ended the earlier recorded excursion. Effectiveness verification is not a guarantee of future nonrecurrence.
- **Q066:** the agreed evidence work is complete, material questions are resolved and the lead has authority to conclude. Timely reporting remains bounded by the objective, scope and evidence. It neither demands a census to eliminate every uncertainty nor extends assurance to unexamined activities or transfers judgment to the auditee.
- **Q067:** the audience asks for chronological changes and reversals in comparable observed rates. The line-chart proposal preserves that sequence, labels a scale covering all values and retains review-volume context. Sorting by magnitude or adding separate monthly percentages into pie slices does not meet that purpose. The explanation makes no causal, statistical-significance, capability or forecast claim.
- **Q068:** the question explains management's role rather than asking for a complex governance redesign, respecting the current Understand ceiling. Delegating daily administration does not remove management's continuing support or responsibility to use results constructively. The item does not repeat the book's anecdotal employee-appraisal restriction as a universal rule.
- **Q069:** twenty conforming pilot assemblies and quoted equipment capacity do not establish sustained available capacity for 800 assemblies per week alongside existing commitments. They also do not establish that the supplier is incapable. The pre-award survey supplies procurement with verified controls, resource/workload evidence and remaining gaps; procurement retains award authority.
- **Q070:** the requested statistic is explicitly the sample standard deviation for six retained observations from a larger set, rounded to two decimals. The calculation and teaching point both include the sum of squared deviations, n-1 divisor and square root. The item does not infer normality, process capability or future performance, and does not reproduce the book's loose prose definition of variance.

### Case and numerical checks

Q064 and Q065 share case identifier `cqa-set2-storage-excursion-01`, an exactly identical complete common stem context, and an identical four-row document exhibit. The local temperature requirement is 15–25°C; the verified Store C readings of 29–31°C violate it. The recorded interval 14:20–15:50 is **90 minutes**. Both lots were present throughout; they were held at 15:55 and transferred at 16:20 to qualified Store D at 20°C. No material was used or dispatched, but material disposition remains pending. These facts distinguish a documented storage-control failure and containment from unverified product damage, cause or corrective-action effectiveness. The two questions ask different decisions and neither relies on the other's answer, preserving independent answerability when shuffled.

Q067's supplied monthly review volumes and percentages reconcile to integer rework counts: January 80 × 12.5% = 10; February 100 × 9% = 9; March 125 × 8% = 10; April 100 × 6% = 6; May 120 × 7.5% = 9; June 100 × 5% = 5. The 625 reviewed records include 49 requiring rework, although no aggregate rate is needed for the question. The sequence falls through April, rises in May and falls in June. The proposed 0–15% scale includes every supplied rate. No time-trend inference is based on changing raw counts alone.

Q070 uses **4, 5, 7, 8, 8 and 10 minutes**. Their sum is 42 and sample mean is 7. Squared deviations total **9 + 4 + 0 + 1 + 1 + 9 = 24 square minutes**. Sample variance is **24 / (6 - 1) = 4.8 square minutes**, and sample standard deviation is **sqrt(4.8) = 2.19089023 minutes**, rounded to **2.19 minutes**. The n-divisor alternative is **sqrt(24 / 6) = 2.00 minutes**; omitting the square root yields variance 4.80 in square minutes; the range is **10 - 4 = 6.00 minutes**. Exact-fraction calculations and independent statistical-library calculations agree.

### Novelty and final review changes

The original surveillance-purpose proposal was replaced because the suggested handbook pages did not directly define surveillance. Q061 now uses the precise desk-review evidence-limit passages on pp. 4–5 and differs from Set 1's remote-video-versus-desk classification item. The proposed critical subtier/access question was also replaced because Set 1 already contains a closely matching scenario; Q069 now examines pre-award capability and capacity evidence. All final topics were compared with relevant Set 1 questions and the preceding sixty Set 2 objects.

Final refinements clarified that Q063's stated availability supports coordinated planning without proving a complete workload estimate; Q065's later relocation does not imply it ended the earlier excursion and its key point calls for effectiveness verification; and Q070's key point explicitly includes the sum before division and the square root. No answer-key change resulted from these refinements.

The independent review approved and authors froze the Q061-Q065 array with SHA-256 `bc0687925fc470a82daa1c774bb2fa993b4c0ac6f12c3ad425ab0d1e0db9f326` and Q066-Q070 array with SHA-256 `8247b3a5703c9c19544dc0578aba4686d96c8cca2768ffad19ffd24fc6cb53bb`. The integrated ten objects match those exact arrays. Final keys are **B/D/C/A/D/B/D/A/C/A**. This is original practice content reviewed for soundness, source support and intended cognitive demand; it is not an empirically calibrated reproduction of live ASQ item difficulty.

### Batch 7 re-audit before adding Batch 8

A fresh independent review of the exact canonical Q061-Q070 objects found **no correction required**. The reviewers audited the opposite halves from their preceding authoring assignments. Every stem, forty options, ten keys and main explanations, thirty distractor rationales, teaching fields, current BoK mappings and actual cognitive labels was checked anew. The complete shared storage-excursion case and both standalone data exhibits were included. Prior audit reports were not used as substitute evidence.

All **23 distinct cited printed folios** were read, freshly rendered and visually inspected in the supplied fifth-edition PDF: 4-6, 25-26, 85, 88, 128-130, 133-135, 151, 165, 178-179, 199, 268-269, 272 and 314-315. Every printed/PDF reference in the Batch 7 table above remains accurate. The visible folios individually confirm the one-based PDF position of printed page +19. Printed p. 314's appendix footer and p. 269's square-root formula were explicitly verified.

The review reconfirmed the documented-adequacy versus implementation-evidence distinction in Q061; Q062's expressly assigned technical-support role and the example-guide status of Appendix C; and Q063's purpose-aligned coordination without an invented claim that all quarter-wide work fits one day. Q064 and Q065 retain identical full case context, case identifier and four-row table, while each remains independently answerable. Their explicit local CAR requirement prevents an assumption that every nonconformity universally requires the same formal response.

The excursion from 14:20 to 15:50 is **90 minutes**. The hold at 15:55 is five minutes after its end; relocation at 16:20 is thirty minutes after its end and twenty-five minutes after the hold. The questions correctly avoid attributing the earlier excursion's end to the later transfer, treating exposure as proved material damage, or treating immediate containment as completed causal action. Cause, damage, disposition and corrective-action effectiveness remain unresolved where the case says so.

Q067's monthly volumes and percentages independently reconcile to rework counts **10, 9, 10, 6, 9 and 5**, totaling 49 of 625 records. The chronological interpretation correctly identifies decline through April, reversal in May and further decline in June, without a causal or statistical-significance claim. Q068 retains an actual Understand demand within its official ceiling. Q069 correctly separates pilot conformity, technical capability, nominal capacity and available sustained capacity, while leaving procurement's award authority intact.

Q070 was recomputed independently: the six values sum to 42, mean 7, squared-deviation sum 24, sample variance 24/5 = 4.8 square minutes, and sample standard deviation **sqrt(4.8) = 2.190890...**, rounded to **2.19 minutes**. The three alternative values and their rationales also remain correct: 2.00 from the n divisor, 4.80 from omitting the square root, and 6.00 from using the range. The actual formula, units and source support were checked rather than relying on the handbook's loose prose description of variance.

The audited canonical bank SHA-256 was `311c13ae948925075a229ea14472f447c17790d4f25175dfa7e07c81909f2f4e`. The supplied PDF SHA-256 was `dd47993300b2a1a5ab2d55a3edf79599f859b2b7f4d8076e0d9550d1505f789f`. No correction to the preceding seventy objects is needed for this update.

## Batch 8: Q071-Q080

All ten original questions passed author review, a separate independent review and final integration review. Every stem, forty options, ten keys and main explanations, thirty distractor rationales, teaching fields, current BoK mapping and actual cognitive label was reviewed. All **21 distinct cited printed pages** were read, freshly rendered and visually inspected in the supplied fifth-edition PDF. Chapter-opening footer folios on pp. 166, 172 and 284 were explicitly checked. The citations identify the supporting principles for original scenarios; they do not imply that these questions appear in the handbook.

| Item | Topic / 2026 BoK | Actual cognitive level | Printed pages | One-based PDF pages | Verified principle |
|---|---|---|---|---|---|
| Q071 | Certification purpose and assurance limits / I.A.3 | Analyze | 8, 16 | 27, 35 | Management-system certification and evidence of a particular lot's dimensional acceptance support different decisions. |
| Q072 | Confidentiality commitments and authority / I.E.1 | Apply | 32 | 51 | Obtain designated review and approved arrangements before accepting obligations beyond the auditor's authority. |
| Q073 | Benefits and limits of audit information / I.B.2 | Analyze | 18, 125 | 37, 144 | Independent audit findings supplement management's continuing monitoring of process performance. |
| Q074 | Unattainable objective during performance / II.B.1 | Analyze | 93 | 112 | Report an essential evidence constraint and obtain the authorized decision about changed arrangements, scope, objectives or termination. |
| Q075 | Traceable working-paper observations / II.A.5 | Apply | 80-81 | 99-100 | Record identifiable sources and observed facts rather than relying on memory or unsupported inferences. |
| Q076 | Review of a corrective-action extension / II.D.2 | Evaluate | 135, 142 | 154, 161 | Judge documented reasons, progress, interim controls and credible milestones through the authorized extension process. |
| Q077 | Focused interview follow-up / III.E | Apply | 166-167, 169 | 185-186, 188 | Address the unanswered activity neutrally and corroborate the account before judging conformity. |
| Q078 | Oversight of a performing audit team / III.F | Apply | 172-173, 175-176 | 191-192, 194-195 | Support demonstrated competent independent work while retaining progress checks and coordinated outputs. |
| Q079 | Controlled internal audit program procedures / IV.A.5 | Evaluate | 194-195 | 213-214 | Establish approved appeal steps, responsible roles and record requirements, and communicate their use. |
| Q080 | Application of an acceptance sampling plan / V.E.1 | Apply | 284, 289 | 303, 308 | Apply the stated acceptance/rejection counts to the original sample and preserve its results. |

### Evidence, authority and answer-uniqueness checks

- **Q071:** the certificate is current and covers the relevant plant and activity. Its relevance is recognized; the limitation is the kind of assurance it provides. The customer's separate incoming-release requirement explicitly calls for lot-linked dimensional acceptance records. Neither the certificate nor accreditation of its issuer supplies those records or establishes M184's dimensional acceptance. This differs from choosing which additional contractual criteria apply in Set 1's certification scenario.
- **Q072:** the agreement is unreviewed, includes employer obligations, and exceeds the auditor's stated authority. The answer obtains designated review and approved confidentiality/access arrangements without declaring the agreement legally invalid or omitting required coverage. One distractor was refined because merely requesting an authorized alternative access arrangement could be legitimate. Its final wording expressly treats confidentiality training as sufficient authority to enter, making the intended mistake clear.
- **Q073:** the favorable finding is bounded by the period and evidence examined. It provides useful independent information without replacing monitoring of entry accuracy and processing time. Completion of work steps or complaint-triggered attention is not assumed to detect every failure of those objectives, and the audit team does not take over the process owner's continuing management responsibility.
- **Q074:** the scenario explicitly establishes that the unavailable records are essential and that interviews, products and older records cannot establish the relevant week's configurations. It also expressly reserves changes to objectives/scope and termination to the client. The lead reports why the objective is unattainable and seeks the authorized decision rather than claiming conformity from a different evidence set or terminating unilaterally. Its actual Analyze label is below the topic's Evaluate maximum.
- **Q075:** PM-06 revision 3 section 4, work order M619, press P4, date and observed blank torque field are recorded. The technician's usual 45 N·m setting is accurately separated from recollection of this particular job. The entry supports the recording gap without proving either correct actual torque or omission of the tightening operation. This tests the quality and traceability of recorded evidence, distinct from Q035's adaptation of a checklist to an in-scope manual route.
- **Q076:** the 14-day request has a documented external delay, verified timely ordering and preparatory progress, an effective approved interim control, an owner and delivery/installation/effectiveness-review milestones. The designated reviewer has authority to revise the dates. Approval is therefore a bounded, supported decision; it does not establish completed permanent action or verified effectiveness. The item evaluates a documented extension request rather than merely recognizing that containment and corrective action differ or that extensions need formal review.
- **Q077:** the coordinator answered two parts of a compound prompt but did not describe the approval record. The focused question asks what record, if any, exists for a recent waiver and follows the account to evidence. Neither the omitted answer nor agreement with a suggested storage location proves conformity or nonconformity. The explanation applies conversational questioning, follow-up and corroboration; it does not attribute an invented compound-question rule to the source or claim that all closed questions are improper.
- **Q078:** competent performance is demonstrated by completed assignments, adequate records and cooperative handoffs under unchanged objectives and membership. Independent work with planned reviews is appropriate to those stated conditions. The explanation preserves the lead's process and output responsibilities and does not universalize the handbook's statement that most audit teams start at performing. This differs from Q047's response to regression after changing purpose and membership.
- **Q079:** the weaknesses concern the program's appeal route, responsibilities, communication and records across three sites. An approved controlled procedure addresses the full process; a common form alone or locally changeable guidance leaves the identified gaps. No universal appeal deadline or particular reviewer appointment is invented. This is a program-design decision, distinct from executing an existing dispute procedure at Q044's closing meeting.
- **Q080:** the local plan explicitly specifies a random original sample of 32, Ac = 1, Re = 2 and one count per nonconforming unit. The exhibit contains 30 conforming units and two failed units with five defects between them. The original lot is rejected under that plan. Substitution does not erase the original result, an unplanned second sample does not postpone the required decision, and authorized rectification/resubmission remains a separate process.

### Sampling arithmetic and source precision

Q080's exhibit reconciles **30 + 1 + 1 = 32 original units**. The nonconforming-unit count is **1 + 1 = 2**; the defect count is **2 + 3 = 5**. Because **2 >= Re = 2** and **2 > Ac = 1**, the original inspection rejects the lot. Reporting five nonconforming units confuses defects with units, while replacing the two failed units and reporting zero changes the sample after its result is known. No population defect-rate estimate, zero-defect assurance, AQL interpretation or confidence statement is needed or made.

The 32/Ac1/Re2 plan is expressly supplied as an original local rule; its numbers are not presented as an ANSI/ASQ table lookup. Printed p. 284 supports prescribed sampling methods and preserving selected-sample identities/counts; p. 289 illustrates applying acceptance/rejection numbers to a random sample. The item does not repeat p. 289's loose probability/confidence language or its older suggestion that variables sampling can be disregarded. The 2026 BoK explicitly includes both attributes and variables acceptance plans. Those source limitations do not alter this question's stated attributes-plan decision.

### Novelty and frozen review inputs

The ten complete drafts were screened against Set 1's 150 questions and Set 2's preceding seventy. Shared competencies use distinct evidence or decisions rather than repeated stems. In addition to the distinctions above, Q074 addresses an objective that cannot be met with available evidence, rather than a temporary retrieval delay that can be accommodated by resequencing. Q072 addresses authority to accept unfamiliar confidentiality obligations, rather than disclosure of proprietary material after an audit. All ten items are standalone; no new formal document-case pair is claimed in this batch.

The independent reviewer approved the exact Q071-Q075 array with SHA-256 `483c4439874427a6f03cdff94796ecb1e2788502375e6e3adc404ab8438f9457` and Q076-Q080 array with SHA-256 `40b4d3d7b0e9de2049887402c4ecd371636adc9e3e0034a561e44c08194b9613`. The integrated objects match those frozen arrays. Final keys are **B/D/A/C/B/D/C/A/B/C**. Review supports soundness, source accuracy and intended cognitive demand; it does not establish empirical equivalence to live ASQ question difficulty.


## Progress and remaining blueprint

| Domain | Batch 1 | Batch 2 | Batch 3 | Batch 4 | Batch 5 | Batch 6 | Batch 7 | Batch 8 | Current total | Final target | Remaining |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| I. Auditing Fundamentals | 2 | 3 | 2 | 3 | 2 | 3 | 2 | 3 | 20 | 37 | 17 |
| II. Audit Process | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 24 | 45 | 21 |
| III. Auditor Competencies | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 16 | 30 | 14 |
| IV. Audit Program Management and Business Applications | 2 | 1 | 2 | 1 | 2 | 1 | 2 | 1 | 12 | 23 | 11 |
| V. Quality Tools and Techniques | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 8 | 15 | 7 |
| **Total** | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **80** | **150** | **70** |

Continue alternating the domain allocations already used: odd-numbered batches 2/3/2/2/1 and even-numbered batches 3/3/2/1/1. Across fifteen batches this produces exactly 37/45/30/23/15. Future items still need individual topic coverage, source validation and independent review; the allocation alone is not content validation. The next requested batch will be **Q081-Q090**, allocation **2/3/2/2/1**, after a fresh audit of Q071-Q080. It has not been started in this update.

The first eighty questions contain eight document-case items (Q004-Q005, Q023-Q024, Q043-Q044 and Q064-Q065), or **10%**, and nineteen rendered question tables. Plan another independently answerable case pair in Batch 9 to maintain the intended case coverage. Answer positions are **A20/B20/C20/D20**. Actual cognitive labels are **Apply 37, Analyze 23, Evaluate 18 and Understand 2**. The existing engine randomizes question order. Practice timing remains two minutes per question: the available eighty-question Full session uses **160 minutes**, displayed as **2 hr 40 min**. Quick Quiz retains its fifty-question maximum and samples from the eighty available items. This is a partial practice set.

## Integration verification

- `node --test --test-isolation=none tests/test-bank-cqa-set1.test.js tests/test-bank-cqa-set2.test.js`: **13 passed, 0 failed**.
- `npm run build:site`: **passed**, including scans of 619 public files with no known static findings and three clean protected-tool shells. These static checks do not claim verification of a production runtime or CDN.
- The learner checks exercise all eighty questions, a 160-minute Full session, correct grading, a fifty-question Quick Quiz sampled from the available eighty, a ten-question diagnostic, and all five focused domains with 20/24/16/12/8 questions.
- An all-correct Full attempt scores 80/80 and 100%. A fifty-question Quick attempt with one deliberate wrong answer scores 49/50, displayed as 98%, and identifies the single incorrect item in review.
- All nineteen question tables render during the attempt and review. All eighty review cards display the authored explanations and all 240 distractor rationales. Distractor feedback is not exposed during the timed attempt.
- The runtime timer was checked at 9,600 seconds and the existing display convention at `2 hr 40 min`. Quick Quiz serves its fifty-question request without an availability-cap notice. No timing or quiz-engine implementation change was needed.
- Set 1 remains at 150 unchanged questions. Set 2 is included only in the protected CQA package and excluded from other exam packages and public staging.
- All seventy preceding question objects were compared with the prior PR bank and are unchanged. The ten new objects exactly match the frozen author arrays. All 230 combined Set 1/Set 2 question IDs are unique; every Set 2 item has four distinct options, exactly three non-key distractor rationales and a printed-page source reference.
- JavaScript syntax checks passed for the bank and test file. The HTML change since the preceding PR head is only the CQA completion label, from Batch 7 to Batch 8. The replacement is scoped to the CQA registration because another exam also has a Batch 7 label. The reviewed commit includes only the bank, its existing integration tests, the CQA progress label and this cumulative audit; unrelated regenerated build files are excluded.

PR #368 remains an accumulation branch; publication is deferred until all 150 questions are ready. No merge or production deployment is part of this batch update.
