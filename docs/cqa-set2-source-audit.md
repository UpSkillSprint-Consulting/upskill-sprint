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


### Batch 8 re-audit before adding Batch 9

A fresh independent review of the exact canonical Q071-Q080 objects found **no correction required**. The two reviewers audited the opposite halves from their preceding authoring assignments. All ten stems, forty choices, ten keys and main explanations, thirty distractor rationales, teaching fields, current BoK mappings and actual cognitive levels were reread. Q080's full original-sample exhibit and every counting/disposition alternative were independently checked. Earlier authoring and review reports were not used as substitutes for source verification.

All **21 distinct cited printed folios** were freshly rendered, visually inspected and read for support: 8, 16, 18, 32, 80-81, 93, 125, 135, 142, 166-167, 169, 172-173, 175-176, 194-195, 284 and 289. Every printed/PDF reference in the Batch 8 table remains accurate. The visible folios confirm the one-based PDF position of printed page +19 individually, including chapter-opening footer folios on pp. 166, 172 and 284.

The review reconfirmed Q071's distinction between valid management-system certification and the separate evidence required for a delivered lot. Q072's revised distractor expressly treats confidentiality training as authorization to enter the proprietary process, so it does not describe an equally valid request for an approved alternative arrangement. The correct answer preserves designated review, approved access and adequate evidence collection without making a jurisdiction-specific legal judgment.

Q073 correctly treats audit findings as additional management information rather than a substitute for continuing performance monitoring. Q074 explicitly establishes that available alternatives cannot answer the approved objective and reserves scope/objective changes and termination to the client. Q075 records the identified blank torque entry and the technician's limited statement without inferring actual applied torque or omission of the tightening operation. All first-half answers and rationales remain supported by their cited passages.

Q076's extension is supported by documented progress, an external delay, effective interim controls, responsibilities and reviewable milestones; its approval does not close the corrective action. Q077 seeks the missing interview information and corroborating evidence without assuming that an unanswered question proves a violation. Q078 relies on demonstrated healthy team performance while retaining lead oversight, not a universal claim about newly formed teams. Q079 addresses the complete controlled appeals process rather than only an intake form and does not invent a universal deadline, reviewer or retention period.

Q080 was independently reconstructed as **30 + 1 + 1 = 32 original sampled units**, comprising **30 conforming units and two nonconforming units**, with **2 + 3 = 5 individual defects**. The plan counts each failed unit once. The original nonconforming-unit count of two reaches **Re = 2**, so rejection is correct. Replacing the failed units cannot rewrite the original result; authorized later rectification and resubmission remain separate. Reporting five nonconforming units confuses defects with units, while drawing another sample adds an unapproved second chance. The question supplies a local plan and makes no unsupported population-quality or confidence claim.

The audited canonical bank SHA-256 was `f49c6b6c6e25865a166b54ca28dcf911bfb2d2fe2b1ccbc150fef1122960aed6`; the supplied PDF SHA-256 was `dd47993300b2a1a5ab2d55a3edf79599f859b2b7f4d8076e0d9550d1505f789f`. No correction to the preceding eighty objects is needed for the Batch 9 update.

## Batch 9: Q081-Q090

All ten original questions passed author review, a separate independent review and final integration review. The review included every stem, forty options, ten keys and main explanations, thirty distractor rationales, teaching fields, current BoK mappings, actual cognitive labels and both complete copies of the complaint-record exhibit. All **20 distinct cited printed folios** were freshly rendered, read and visually verified. The chapter-opening footer folios on pp. 2, 119 and 212 and the complete Cp/Cpk formula on p. 281 were explicitly inspected. Citations identify the principles supporting these original scenarios, not a claim that the questions appear in the handbook.

| Item | Topic / 2026 BoK | Actual cognitive level | Printed pages | One-based PDF pages | Verified principle |
|---|---|---|---|---|---|
| Q081 | Element coverage across departments / I.A.1 | Analyze | 2, 83 | 21, 102 | Distinguish one selected control element across units from a broad assessment of each department. |
| Q082 | Gifts received after reporting / I.E.1 | Apply | 38-39 | 57-58 | Follow the stated gift policy and authorization limits without assuming an improper motive. |
| Q083 | Physical-measurement evidence / II.B.4 | Evaluate | 103 | 122 | Combine the appropriate method, instrument, calibration, competent operator and work restrictions. |
| Q084 | Grouping confirmed observations / II.C.1 | Evaluate | 104, 110, 122 | 123, 129, 141 | Group supporting examples by the unmet control and retain unresolved contradictions separately. |
| Q085 | Supplemental report clarification / II.C.3 | Apply | 104, 119, 130-131 | 123, 138, 149-150 | Communicate later verified clarification through the authorized report process while preserving the audit history. |
| Q086 | Communication after evidence-device theft / III.D | Apply | 164 | 183 | Promptly report known facts and uncertainties through agreed incident contacts. |
| Q087 | Purposeful group interviewing / III.E | Apply | 167, 169 | 186, 188 | Use a group discussion when interaction is the evidence objective and corroborate the accounts obtained. |
| Q088 | Auditing strategic deployment and outcomes / IV.B.1 | Analyze | 212, 215 | 231, 234 | Relate verified implementation milestones and performance to management's stated strategic objectives. |
| Q089 | Electronic-approval attribution / IV.A.10 | Apply | 72-73, 102 | 91-92, 121 | Verify individual attribution and access/change controls rather than relying on a displayed name. |
| Q090 | Interpreting Cp and Cpk / V.D.2 | Understand | 281 | 300 | Distinguish spread relative to specifications from the additional effect of process centering. |

### Evidence, authority and answer-uniqueness checks

- **Q081:** the assignment follows document-control requirements across Engineering, Purchasing and Service, including their relevant transfers, while excluding unrelated activities. The alternatives describe materially different coverage rather than offering synonymous function/element labels. The explanation does not claim that audit labels are universally mutually exclusive or that every system audit must examine every possible element.
- **Q082:** the local policy explicitly applies before, during and after assignments. The lead receives one $120 gift, above the stated $20 limit. Dividing its contents or donating it does not provide the required advance authority for an alternative disposition. The response remains courteous and does not turn a thank-you note into proof of bribery. The dollar amounts and disposition procedure are original local facts, not universal ASQ gift rules.
- **Q083:** the final stem establishes that the technician is both trained and authorized, the prescribed gage is suitable and in current calibration, and the auditor understands the method and can interpret its results but lacks authority to operate the instrument. The correct answer therefore does not use observation to compensate for an inability to assess the method. Calibration and repeated readings do not make a substitute tool compliant with the approved method; a prior result also does not fulfill the plan's explicitly required witnessed examination.
- **Q084:** V1/V2 support the owner-recording control, while V3/V4 support the closure-message control. The procedure calls for control-level grouping with evidence IDs retained. U1 is expressly contradictory and cannot be added as a confirmed violation. The owner-recording gaps do not prove that nobody had actually been assigned, and grouping observations does not establish a common root cause or an unexamined organization-wide failure.
- **Q085:** the original report accurately records U1 as unresolved. The later authenticated evidence concerns the same complaint, message and pre-closure timing and resolves that specific uncertainty. AP-7 explicitly supplies approval, original-recipient distribution and retention requirements. A supplement clarifies the report without deleting its accurate historical state or altering V1-V4. Neither this item nor its source claims a universal supplemental-report authorization or retention procedure.
- **Q086:** the photography was authorized, the stolen tablet was encrypted and actual file access remains unknown. The initial notice identifies the known loss, contents and protections and the remaining uncertainties. Neither encryption nor an incomplete inventory justifies withholding notification, and theft does not itself prove disclosure. The item tests factual communication through stated contacts without prescribing unauthorized technical remediation.
- **Q087:** understanding the launch team's interaction is an explicit audit objective, supplying a reason for a focused group interview. The observed discussion provides evidence of current interaction; records and individual follow-up corroborate accounts of the earlier decision. Agreement, silence or a rehearsed spokesperson's account is not treated as proof of historical behavior. No universal group size or mandatory interviewer count is imposed.
- **Q088:** the target is no more than 3% rework at each site. North's 2% meets that target; South's 7% does not. Completed instructions and training are rollout milestones, not proof of consistent application or the intended outcomes. The question preserves the site-level objective and does not infer causation, replace it with a pooled percentage, or transfer strategic decision authority from management to the auditor.
- **Q089:** a common screen session could coexist with separate valid individual signing controls. The auditor must examine the link to authorized persons and the protection of that link and record history. Typed names, timing, product conformity or general managerial assurance do not independently establish who approved the sampled events. The scenario does not presume forgery or conclude that every shared workstation violates the procedure.
- **Q090:** stability, fixed two-sided limits, an appropriate normal-distribution model and the same justified within-process sigma are expressly supplied. The question asks for interpretation of the two reported indices, not calculation or selection of an improvement action, respecting the current Understand ceiling. Lower Cpk than Cp indicates off-centering under those assumptions; the unsigned pair does not identify the nearer side, demonstrate subsequent instability or supply an unstated acceptance threshold.

### Shared-case integrity and chronology

Q084 and Q085 share case identifier `cqa-set2-complaint-records-01`, an exactly identical **469-character common context**, and an identical complete seven-row table. Both contain the two requirements, all four verified observations and the complete unresolved point. Q085 independently supplies what the issued report said, the later authenticated evidence and AP-7; it never depends on the learner's selected answer to Q084. Both remain independently answerable after shuffling.

The verified evidence reconciles as follows:

| Observation | Chronology or evidence | Supported conclusion |
|---|---|---|
| V1 / C101 | Investigation at 09:00 on 4 June; assigned owner first recorded at 12:00 that day. | Owner recording occurs three hours after investigation begins, contrary to section 2. |
| V2 / C109 | Investigation at 10:00 on 7 June; assigned owner first recorded at 16:00 that day. | Owner recording occurs six hours after investigation begins, contrary to section 2. |
| V3 / C112 | Closed status on 10 June; closure message sent and recorded on 11 June. | The required message steps occur on a later date, contrary to section 5. Exact elapsed hours are not supplied. |
| V4 / C118 | Closed status on 14 June; closure message sent and recorded on 16 June. | The required message steps occur on a later date, contrary to section 5. Exact elapsed hours are not supplied. |
| U1 / C125 at the closing meeting | Case log says 17 June, but the retrieved message copy concerns C152; C125 closed on 18 June. | The conflicting information remains unresolved, rather than a confirmed section 5 failure. |
| U1 / C125 on 24 June | The team authenticates the correct C125 message and record, confirming sending and recording on 17 June before closed status on 18 June. | Clarify U1 through AP-7 while retaining the separately verified V1-V4 observations. |

The shared context deliberately says **closing meeting on 20 June**, not formal audit closure. This prevents an implication that open findings and an unresolved observation have already satisfied every program closure criterion. The common-context UTF-8 SHA-256 is `a827704e4712681c39a237e560a30f5438b25dba6f847e0e6b198ebc37f9296c`. The complete table serialized with sorted keys, Unicode retained and compact separators has SHA-256 `4031431361de905e715fde3c5e65f21d3c0b508eaccf1e746f1ac03cdb101780`.

### Numerical and source interpretation checks

Q082's received gift is $120, greater than $20; six later $20 shares do not become six originally received gifts. Q088 requires separate site assessments: 2% <= 3%, while 7% > 3%. The site volumes are unstated, and an unweighted average cannot be assumed to represent a combined rate; even a valid combined rate would not replace the expressly site-specific objective.

Q090's reported **Cp = 1.50 / Cpk = 0.95** values are internally consistent with a stable, off-center process under the supplied assumptions. The displayed p. 281 formula confirms that Cp compares specification width with six sigma and Cpk uses the smaller distance from the mean to a limit divided by three sigma. The item does not reproduce the page's example capability cutoffs as universal acceptance rules. It also does not use the nearby outlier discussion or imply that unusual data may be discarded to improve an index.

### Novelty, review refinements and frozen versions

The ten complete items were screened against Set 1 and the preceding eighty Set 2 questions. Two early proposals were replaced: another count-versus-consequence priority question was too close to Q043, and an interview-interruption remedy overlapped Set 1. The final Q085 supplemental-report decision and Q086 factual incident notification provide different tasks. Q084 distinguishes two control groups plus unresolved evidence, rather than repeating Set 1's simple same-clause grouping example. Q087 selects a group method for a justified objective; Q088 examines strategy deployment/outcomes; Q089 addresses attribution rather than Q048's record retrieval/retention; Q090 interprets centering under a valid model rather than repeating Set 1's unstable-process capability warning.

Final review made the Q083 technician's training and authorization and the auditor's method understanding explicit, consistently changed the case to closing-meeting terminology, matched Q082's recipient wording to the lead auditor, and corrected Q085's trap to target erasing report history rather than calling a recirculated replacement silent. No key or source-page change resulted.

The independent reviewer approved the exact Q081-Q085 array with SHA-256 `270baacc6a634cb9eb65dca07571473495705f5ddb138a0a818d7842ac023d12` and Q086-Q090 array with SHA-256 `c9ca5e1395854358249d8ce9d6c0fa8925783a246baff1804149a4e6addea582`. The integrated objects match those frozen arrays. Final keys are **D/A/C/D/B/D/B/A/C/A**. Source and content review support the intended practice demand; empirical equivalence to operational ASQ difficulty has not been established.


### Batch 9 fresh re-audit before adding Batch 10

Q081-Q090 passed a fresh independent audit of the exact ninety-question PR bank, SHA-256 `a5fa71b6bc937eb1555c7242baffad87a979cd1bf7144f102765c80a8ca48263`. Each reviewer audited the half authored by the other reviewer in the preceding batch. All ten complete canonical objects were reread, including forty choices, ten keys, thirty distractor rationales, main explanations, key points, traps, the full complaint-records case, current BoK mappings and actual cognitive labels. **No question, answer key, explanation or source-page reference required correction.**

Every one of the twenty distinct cited printed folios was reread, newly rendered from the uploaded fifth-edition PDF and visually inspected. The chapter-opening footer folios 2, 119 and 212 and the displayed capability formulas on p. 281 were included. Prior ledgers were not substituted for fresh source evidence. The printed-to-PDF relationship was verified on each cited page.

| Item | Verified printed pages | One-based PDF pages | Fresh disposition |
|---|---|---|---|
| Q081 | 2, 83 | 21, 102 | Selected-element coverage across departments, including interfaces, is supported. Retain. |
| Q082 | 38-39 | 57-58 | Explicit post-audit gift policy and courteous return are supported; the monetary limit is local. Retain. |
| Q083 | 103 | 122 | Prescribed tool/method, calibration, qualified operation, auditor understanding and work authorization are correctly distinguished. Retain. |
| Q084 | 104, 110, 122 | 123, 129, 141 | Two verified control groups are separated from the unresolved contradiction without inferring a common cause. Retain. |
| Q085 | 104, 119, 130-131 | 123, 138, 149-150 | Authenticated later evidence supports an approved, distributed and retained supplemental clarification. Retain. |
| Q086 | 164 | 183 | Report the known evidence-device loss through agreed contacts while preserving uncertainty about access/disclosure. Retain. |
| Q087 | 167, 169 | 186, 188 | The interaction objective justifies a focused group interview with corroboration of historical accounts. Retain. |
| Q088 | 212, 215 | 231, 234 | Preserve site-specific targets and verified outcomes without assuming volumes, causation or management's decision. Retain. |
| Q089 | 72-73, 102 | 91-92, 121 | Test person-specific approval attribution and protection of the history; a shared screen alone establishes neither validity nor forgery. Retain. |
| Q090 | 281 | 300 | Cp/Cpk spread and centering interpretation is supported under the explicit valid, stable model; actual demand remains Understand. Retain. |

The Q084/Q085 common context remains exactly 469 characters with identical case ID and complete seven-row table. V1/V2 establish owner recording three and six hours after investigation starts. V3/V4 establish later calendar dates for the closure-message steps, without establishing exact 24- or 48-hour intervals. The later-authenticated original C125 message was sent and recorded on 17 June, before closed status on 18 June; authentication occurred on 24 June after the 20 June closing meeting. The meeting is not described as formal audit closure. Q085 independently supplies the issued report's contents and AP-7 requirements, so neither item requires the other answer after shuffling. U1's clarification does not change V1-V4 or retrospectively change Q084's then-available evidence.

Additional independent numerical checks confirmed that Q082's six later $20 shares do not alter the single $120 gift received. In Q088, North's 2% meets the per-site 3% ceiling and South's 7% does not. An unweighted 4.5% average cannot replace the site-level criterion or establish a combined rate without volumes. In Q090, Cp 1.50 corresponds to a nine-sigma specification width and Cpk 0.95 to a 2.85-sigma distance to the nearer limit. The mean is therefore 1.65 sigma from the midpoint, but the sign and limiting side remain unknown. This reviewer calculation validates the explanation; the learner is asked only to interpret the supplied indices.

All actual cognitive labels remain within the 2026 BoK ceilings. The sources' country-level gift generalizations, possible grading-liability example and example Cpk acceptance cutoffs are not imported as universal rules. Structural checks found valid keys, four distinct choices, exactly three non-key rationales and correctly closed source spans. Comparable option lengths and targeted comparison with earlier items did not identify a required ambiguity or duplication correction. Final retained keys are **D/A/C/D/B/D/B/A/C/A**. All ninety preceding question objects remain unchanged for the next batch.

## Batch 10: Q091-Q100

All ten original questions passed author review, separate independent review and final root content review of every stem, forty options, ten keys and main explanations, thirty distractor rationales, teaching fields, current BoK mappings, actual cognitive labels and the two standalone exhibits. All **21 distinct cited printed folios** were freshly rendered, read and visually verified. The chapter-opening footer folios on pp. 53, 152, 166 and 297 were explicitly inspected. Citations identify principles supporting these original questions; they do not suggest that the question text appears in the handbook.

| Item | Topic / 2026 BoK | Actual cognitive level | Key | Printed pages | One-based PDF pages | Verified principle |
|---|---|---|---|---|---|---|
| Q091 | Risk-focused audit purpose / I.A.3 | Apply | B | 7, 206 | 26, 225 | An audit can verify treatment of a known potential risk before any failure or earlier finding exists. |
| Q092 | Applicable contractual revision / I.C | Analyze | C | 21–22 | 40–41 | Match each selected transaction to its explicitly applicable contractual and specification criteria. |
| Q093 | Observer information and assigned role / I.D | Apply | D | 25, 53 | 44, 72 | Retain useful information while respecting planned roles and the auditor's responsibility to verify and assess it. |
| Q094 | Forward tracing through branches / II.A.6 | Apply | A | 81–82 | 100–101 | Follow a selected input downstream through relevant process paths, controls and outputs. |
| Q095 | Supported alternative CAPA / II.D.2 | Evaluate | C | 138 | 157 | Evaluate the auditee's valid rationale rather than requiring the auditor's preferred solution. |
| Q096 | Temporal relevance of observed evidence / II.B.5 | Analyze | B | 107 | 126 | A current observed demonstration and an asserted historical activity are different evidential propositions. |
| Q097 | Work-focused visual interviewing / III.E | Apply | D | 39, 166–167, 169 | 58, 185–186, 188 | Adapt communication to elicit evidence while retaining actual job competence and recording requirements. |
| Q098 | Concurrent observation scheduling / III.B | Apply | C | 152–153 | 171–172 | Allocate resources to fixed opportunities, allow movement and notes, and retain team evidence review. |
| Q099 | Succession risk to audit coverage / IV.A.8 | Analyze | A | 207–208 | 226–227 | Treat foreseeable loss of scarce audit competence as a risk to program objectives and resource timely coverage. |
| Q100 | Controlled configuration combination / V.F | Understand | B | 297–299 | 316–318 | Configuration management controls the defined combination, not only the currency of its individual documents. |

The current 2026 BoK ceilings were independently checked. Q091 remains Apply below its Analyze ceiling; Q095 evaluates a proposed plan against the stated cause and requirements; Q100 explains a configuration principle at Understand rather than evaluating an engineering change. The final question mappings do not use a topic ceiling as an automatic label for every item in that topic.

### Evidence, authority and answer-uniqueness checks

- **Q091:** the alternate-carrier and stock-buffer arrangements respond to a known possibility of disruption. There is no actual interruption to investigate or previous finding to close. P. 206 directly supports examining implementation and effectiveness of risk treatments. The explanation permits overlapping audit purposes and does not claim a risk-focused engagement can never examine compliance. The assignment concerns existing transport dependence, not initial approval of the primary carrier.
- **Q092:** the contract expressly makes order acceptance the applicability trigger and preserves revision A for earlier unamended orders. Both production dates are later, but that fact does not replace the stated trigger. Each conclusion is limited to the verified thickness criterion. The item does not infer total contract conformity or establish a universal rule that contract revisions are never retroactive.
- **Q093:** the training observer's approved role expressly excludes interviewing, conformity assessment and issuing findings. Routing a specific apparent discrepancy to the assigned auditor preserves its potential value without conferring those responsibilities. The observer's information is not automatically a finding or inherently inadmissible. P. 53 supports agreed accompanying-person roles; p. 25 assigns investigation, recording and reporting duties to the auditor. The question does not invent universal restrictions for every observer.
- **Q094:** K47 has two stated work-order branches and an approved rework path. A forward trace follows those links from receipt through use, relevant controls, stock and dispatch. A backward trace from recent shipments, a review ending at receipt, or extrapolation from one normal route does not satisfy this selected input's stated objective. The answer does not mandate inspecting every possible record or direct operational recall, quarantine or stock disposition.
- **Q095:** the formula range is the verified cause, and the alternative addresses added lines and controlled formula changes. Interim independent recalculation of every order total before release protects the period before implementation. Supporting challenge tests, a named owner, timing and agreed production checks make plan evaluation possible. The auditor's software preference is not an additional criterion. Acceptance of a plan remains distinct from implementation, sustained production effectiveness and closure; the explicit local procedure retains the thirty days of required checks.
- **Q096:** the satisfactory demonstration on 22 August directly supports what was observed then. The technician's assertion about the check before the 8 August release remains historical testimonial evidence requiring relevant corroboration. The question does not erase that statement from the evidence, assume the original check was omitted, or treat a real observed demonstration as merely an oral account because it was arranged for the audit.
- **Q097:** difficulty answering an abstract written question does not by itself establish inability to perform the job. The selected approach observes normal work with the approved pictorial aid, uses short neutral questions and retains the expressly required product-code reading and lot-number entry. Neither a supervisor's account nor the existence of a visual instruction verifies this operator's performance. Adapting the interview does not waive a job requirement or authorize coaching through the required steps.
- **Q098:** both auditors are qualified, one is enough at each event, access and escorts are arranged, the event windows are fixed and the review requires both auditors. The key provides full concurrent coverage while respecting movement and immediate note-check times. The alternative paths fail the explicit observation or review requirements, rather than an unstated preference that auditors must always work separately.
- **Q099:** the foreseeable departure occurs before the next required audit, exposing a competence dependency despite a satisfactory previous result. Supervised development and handover are useful, but neither attendance nor a checklist proves qualification. The program needs demonstrated competent, independent coverage and a contingency if an internal successor is not ready. The process engineer's responsibility for the audited controls is explicit; later management review does not remove that responsibility. No universal succession deadline or training duration is imposed.
- **Q100:** the local baseline explicitly identifies hardware, firmware and instructions approved together. Separate currency or conformity does not establish the approval of every resulting combination. The explanation does not infer that a newer component is technically incompatible or that a baseline is immutable. It explains controlled relationships and traceability, remaining within the Understand ceiling.

### Standalone exhibits and independent reasoning checks

**Q092 — two applicable specification revisions.** Both orders were produced on 10 September and neither has a separate amendment. The contract uses order acceptance, not production or audit date, to choose the revision.

| Order | Accepted | Applicable minimum | Verified result | Conclusion for the thickness criterion |
|---|---|---|---|---|
| P610 | 31 August, before 1 September | Revision A: 40 μm | 45 μm | Meets the applicable minimum by 5 μm. |
| P611 | 2 September, on or after 1 September | Revision B: 50 μm | 45 μm | Falls below the applicable minimum by 5 μm. |

The distractors respectively extend the earlier-order amendment condition to every order, replace the specified acceptance trigger with production date, or invent a need for one common criterion despite the unambiguous contract rule. The table and all teaching fields agree on order identifiers, dates, units and thresholds.

**Q098 — complete coverage with travel and review.** Each event runs from 09:20 to 09:45. Briefing-room travel takes ten minutes each way; travel between bays takes fifteen minutes. Each observation requires five minutes of notes and confirmation immediately afterward, at its bay. Both auditors must attend the fixed 10:00–10:20 review.

| Choice | Reconstructed path | Result |
|---|---|---|
| A | Both attend West's 09:20–09:45 event; East's event takes place during the same window. | An operator's later account cannot supply the plan's required complete direct observation at East. |
| B | Leave the original bays at 09:35; arrive at the opposite bays at 09:50. | Each misses the last ten minutes of the original event and arrives after the other event has finished. Partial observations do not combine into full coverage. |
| C | Leave briefing room at 09:05, arrive at assigned bays 09:15, observe 09:20–09:45, confirm notes to 09:50, return by 10:00. | Both complete observations and immediate note checks, then attend the fixed review on time. |
| D | East's auditor finishes notes at 09:50 and reaches West at 10:05; onward travel cannot reach the briefing room before 10:15, even without allowing time for comparison. | The proposed 09:50 gathering is impossible, and the subsequent review is late. |

These are standalone tables, not a formal shared case. Neither item depends on another question or assumes access to an earlier answer.

### Source precision and visual page verification

The nine first-half folios are **7, 21, 22, 25, 53, 81, 82, 138 and 206**. The twelve second-half folios are **39, 107, 152, 153, 166, 167, 169, 207, 208 and 297–299**. There is no overlap, giving 21 distinct final cited pages. Each printed folio and supporting passage was inspected in a fresh rendering of the uploaded handbook, confirming printed p to one-based PDF p + 19 rather than relying solely on an offset.

The citations are narrowly tied to the final reasoning. P. 7 distinguishes audit purposes and p. 206 directly addresses treatment of known risks. Pp. 21–22 support the contractual basis; the effective-date provisions themselves are original scenario facts. Pp. 25 and 53 support planned roles and auditor responsibilities. P. 81 explicitly defines forward tracing, with p. 82 supporting linked process work. P. 138 directly supports a valid alternative CAPA response. P. 107 supports relevance, direct observation and uncertainty. P. 39 supports work-focused communication aids; pp. 166–167 and 169 support questioning, observation and corroboration. Pp. 152–153 support activity planning and team reconciliation. Pp. 207–208 identify competence/resource risks to the audit program, and the current BoK expressly includes succession planning. Pp. 297–299 distinguish document control from the broader configuration, baseline and change-control activities.

The items do not import neighboring handbook overstatements: the p. 7 regulatory examples are not used as current legal rules; the gift and cultural examples on pp. 38–39 are not treated as universal rules; p. 108's categorical language about corroborated accounts is not adopted; p. 138's statement about closure pending final verification does not override the expressly supplied closure requirement; and p. 298's attribution of document-control problems solely to people is not treated as a universal causal conclusion.

### Novelty, review decisions and frozen versions

Planning screened **all 150 Set 1 and all 90 preceding Set 2 stems**. The final decisions extend familiar principles through different tasks:

- Q091 verifies treatment of a known potential risk, unlike Q031's response to actual failures or Q029's comparative audit scheduling.
- Q092 selects transaction-specific applicable revisions, unlike Q001's authorization hierarchy, Q042's non-adopted guidance or Q018's permitted evidence format.
- Q093 retains an observer's useful information through verification, rather than repeating Q062's appointed technical-specialist contribution.
- Q094 follows a selected input through multiple downstream branches; Q023 and Set 1 b03-20 trace backward from an output.
- Q095 accepts a supported alternative solution, unlike Q014's cause-mismatched plan and Q076's extension request.
- Q096 focuses on the temporal boundary of direct observation, unlike Q024's conflicting identifiers, Q061's documentation-versus-operation gap or Q075's blank recording field.
- Q097 adapts an unsuitable abstract interview prompt without waiving actual job requirements, rather than repeating translation, cultural-pause, local-term or compound-question examples.
- Q098 addresses simultaneous non-repeatable opportunities, unlike Q003's total-hour arithmetic, Q006's spare-auditor reassignment or Q058's exchangeable appointment slots.
- Q099 addresses succession dependency within the audit program, unlike Q029's risk ranking of audited operations and Q028's hour budget.
- Q100 explains an approved configuration combination, rather than repeating Set 1 b07-15's obsolete personal drawings and unauthorized edits.

An early minority-input facilitation proposal was replaced before drafting because it overlapped Q027. Configuration management was selected over an unused DMAIC Measure alternative to broaden coverage. Final review added one clarification to Q095: every order total is independently recalculated outside the workbook before release until the permanent change is implemented, and the explanation explicitly recognizes this interim safeguard. This removes a legitimate concern about continuing errors during the implementation interval. The key, options and citation remain unchanged. The other nine complete objects required no content correction; their authority, temporal relevance, competency, concurrency and configuration boundaries were already explicit. Every incorrect choice has a specific rationale, and option lengths are comparable within each question.

Exact frozen author arrays approved by the independent and root content reviewers:

- Q091–Q095: `set2_batch10_q091_q095.json`, SHA-256 `125534871660dfad4bd86560711172dbc480fd5ea8c1fd94e7303c460d120220`.
- Q096–Q100: `set2_batch10_q096_q100.json`, SHA-256 `2b79caec0bce66f193befc033f3569229e913d693b38ddab01bfb08d46f4b975`.

Final keys are **B/C/D/A/C/B/D/C/A/B**. The independent mechanical record confirms the required I3/II3/III2/IV1/V1 allocation, five Apply, three Analyze, one Evaluate and one Understand item; two standalone tables; and thirty specific distractor rationales. Application verification, integrated-object equality and remote status are recorded separately by the integrating reviewer.

### Batch 10 fresh re-audit before adding Batch 11

**PASS — Q091–Q100 and all cited page references are retained without correction.** Opposite-author reviewers independently reread all ten complete canonical objects: forty choices, ten keys and main explanations, thirty non-key rationales, every teaching field, both exhibits, and the current 2026 BoK mappings and cognitive ceilings. The exact audited 100-question bank had SHA-256 `4890ce4c43ef971ba585bc111f2cd153d04673abcb1474cd20eac18e798fe1b7`, verified unchanged before and after review. Previous audit ledgers were not accepted as fresh source evidence.

All **21 distinct printed folios** were freshly rendered from the uploaded fifth-edition PDF and visually inspected, including the supporting passages and actual printed numbers. The first reviewer checked nine pages and the second twelve, without overlap. Chapter-opening folios 53, 152, 166 and 297 appear in the footer; p. 298 was also examined separately at full-page size. Each one-based PDF position was confirmed as the printed folio plus 19 rather than accepted solely from an assumed offset.

| Item | Verified printed pages | One-based PDF pages | Fresh audit result |
|---|---|---|---|
| Q091 | 7, 206 | 26, 225 | Established treatments address a prospective risk; the stated purpose does not require an actual failure or earlier finding. Retain. |
| Q092 | 21–22 | 40–41 | Apply the contract's order-acceptance trigger, not the shared production date; limit the conclusion to thickness. Retain. |
| Q093 | 25, 53 | 44, 72 | The restricted observer may relay useful information; the assigned auditor verifies, assesses and reports it. Retain. |
| Q094 | 81–82 | 100–101 | The selected input is traced downstream through both work orders, approved rework and the stock/dispatch branches. Retain. |
| Q095 | 138 | 157 | A supported alternative plan is acceptable while independent interim checks and the required production verification remain in force. Retain. |
| Q096 | 107 | 126 | The current demonstration is direct evidence of its own event, not corroboration of the earlier claimed pre-release check. Retain. |
| Q097 | 39, 166–167, 169 | 58, 185–186, 188 | Work-focused communication and approved visual aids preserve the actual reading and recording requirements. Retain. |
| Q098 | 152–153 | 171–172 | Independent full-event coverage is the only offered schedule satisfying travel, immediate notes and the fixed team review. Retain. |
| Q099 | 207–208 | 226–227 | Planned retirement creates a foreseeable competence and independent-coverage risk requiring development and a contingency. Retain. |
| Q100 | 297–299 | 316–318 | Individual item currency does not establish approval of their defined configuration; the task remains Understand. Retain. |

Q092 was independently recalculated: P610, accepted 31 August, retains revision A's minimum 40 μm; its 45 μm measurement is 5 μm above that minimum. P611, accepted 2 September, uses revision B's minimum 50 μm; 45 μm is 5 μm below it. Neither conclusion establishes conformity with all other contractual criteria.

All four Q098 paths were recomputed. C assigns one qualified auditor to each complete 09:20–09:45 event, completes the required bay notes at 09:50 and returns separately in ten minutes for the 10:00 review. B's 09:35 exchange loses each event's final ten minutes and reaches the other bay at 09:50. D cannot gather both auditors at West before 10:05 or return to the briefing room before 10:15, **excluding any comparison time**. A misses the required East observation and cannot restore it with a later account. The question's existing key and rationales are correct.

Q095's interim recalculation is explicitly independent of the defective workbook and covers every order before release until implementation. Acceptance of the plan does not waive the local thirty-day production-effectiveness checks before closure. The book's general p. 138 statement about possible closure pending verification is not substituted for the scenario's express condition. Q096 does not adopt p. 108's overconfident corroboration wording, and Q100 does not repeat p. 298's attribution of document-control failures solely to people. Q099 preserves the distinction between development attendance and demonstrated competence; a later management review does not remove the engineer's stated self-audit conflict.

The fresh novelty and fairness review found no required replacement or ambiguity correction. Final retained keys are **B/C/D/A/C/B/D/C/A/B**. All 100 preceding question objects remain unchanged in the following 110-question bank.

Detailed fresh reports: `batch10-reaudit-q091-q095.md` (SHA-256 `e56a7a2ec2a65c8fbcd38133a5bbac2c6775133ccb9eb455b747f25abbfb7192`) and `batch10-reaudit-q096-q100.md` (SHA-256 `141a8d89008275865702b8c10394460b6db417e47f23b58c72ecc4c403067e18`). These audit records establish source fit, internally consistent reasoning and one-best-answer support; they do not establish empirical equality with live ASQ item difficulty.

## Batch 11: Q101–Q110 source and independent item review

All ten final objects passed independent review of the complete stems, four options, keyed answers, explanations, key points, traps, thirty distractor rationales, BoK mappings and actual cognitive demand. The source was the supplied *The ASQ Certified Quality Auditor Handbook*, fifth edition (2020). The controlling cognitive ceilings were checked against ASQ's official 2026 CQA Body of Knowledge. The finished questions are original simulated items; this content review does not establish psychometric equivalence to an administered ASQ examination.

### Final question and source map

| Item | Decision tested | BoK | Actual / maximum level | Key | Printed pages | One-based PDF pages |
|---|---|---|---|---|---|---|
| Q101 | Retain both audit programs' required scope and criteria when combining compatible activities | I.B.1 | Apply / Apply | C | 18 | 37 |
| Q102 | Assess potential exposure from unauthorized disclosure of an accurate confidential finding | I.E.2 | Analyze / Analyze | A | 44 | 63 |
| Q103 | Select adequate remote verification of implementation and operating effectiveness | II.D.3 | Evaluate / Evaluate | D | 139 | 158 |
| Q104 | Obtain linked input/output and approval evidence for expressly scoped proprietary interface controls | II.B.4 | Evaluate / Evaluate | B | 100 | 119 |
| Q105 | Report the verified positive interface result within its sample and scope | II.C.2 | Evaluate / Create | C | 111, 120–121 | 130, 139–140 |
| Q106 | Resolve a legitimate operational disruption through an equally adequate evidence arrangement | III.C | Analyze / Analyze | A | 154 | 173 |
| Q107 | Select a visual that shows responsible functions, decision routing and a return loop | III.D | Apply / Evaluate | D | 165, 226–227 | 184, 245–246 |
| Q108 | Use confidential peer debriefs for shared learning and consistent evidence-based judgments | IV.A.3 | Evaluate / Evaluate | B | 183–184 | 202–203 |
| Q109 | Separate realized annual contribution from an annualized forecast and include each defined cost once | IV.A.4 | Analyze / Evaluate | A | 187, 190–191 | 206, 209–210 |
| Q110 | Explain improved PFMEA detection without implying lower failure occurrence or severity | V.H | Understand / Understand | D | 305–306 | 324–325 |

The **18 distinct cited printed folios** are 18, 44, 100, 111, 120, 121, 139, 154, 165, 183, 184, 187, 190, 191, 226, 227, 305 and 306. The independent reviewer personally inspected fresh full-page renders of all eighteen, including the visible folios and relevant passages. The printed-page-to-PDF offset of +19 was confirmed visually; extraction offsets alone were not treated as page verification.

Direct support is narrow and specific. P. 18 requires combined-audit objectives, scope and criteria to be compatible with both relevant programs. P. 44 supports conditional disclosure-related exposure. P. 139 permits records and remote techniques where they verify corrective-action implementation and effectiveness. P. 100 supports input/output and interview evidence when proprietary access is restricted, including the meaning of approval signatures. Pp. 111 and 120–121 support conclusions aligned to purpose, uncertainty, sample qualifications and positive findings. P. 154 addresses conflict created by unnecessary auditor demands. Pp. 165 and 226–227 support audience-appropriate visuals, process sequence, roles, decisions, directional arrows and loops. Pp. 183–184 support post-audit learning and confidential discussion. P. 187 distinguishes past contribution from expected future contribution; pp. 190–191 identify the relevant costs and net contribution. Pp. 305–306 distinguish failure effects, occurrence/prevention and detection after a failure exists.

### Reasoning, boundaries and distractor review

**Q101:** The two program owners retain their required boundaries, and adequate qualified resources are supplied. Sharing common work is therefore compatible with retaining the additional quality and environmental activities. Merely documenting an exclusion does not authorize it, substituting one program's checklist does not fulfill the other, and different boundaries do not automatically prohibit a combined audit. The decision applies the compatibility principle without inventing a universal requirement for identical scopes.

**Q102:** The confidentiality restriction and authorization route are explicit, and no compulsory disclosure requirement applies. The selected assessment identifies potential exposure while leaving actual responsibility, causation and damages to the agreement, facts and applicable law. The alternatives incorrectly treat truth or the buyer's independent decision as eliminating exposure, or treat disclosure as establishing the full alleged loss automatically. No jurisdiction-specific legal outcome is asserted.

**Q103:** The scenario supplies authenticated deployment and original operating records, actual concurrent jobs from all three shifts, and no physical-inspection criterion. Remote verification can test the stated implementation, uniqueness and linkage requirements. A return visit is not inherently necessary; installation paperwork alone is insufficient; equal aggregate totals cannot establish job-level uniqueness or correct links. The key selects a verification method, not automatic closure or proof of universal long-term effectiveness.

**Q104–Q105:** CV-4 explicitly defines the identity links, reviewer authority, meaning of approval and approval-before-release timing. Available original records and authorization history can test those criteria. Algorithm validation is expressly outside this agreed audit scope. That local scope fact does not establish a general right to exclude an in-scope proprietary control. Q104 selects linked evidence rather than aggregate counts, signatures alone or an unnecessary code-access demand. Q105 reports the independently supplied completed result for the examined twenty jobs without asserting internal-algorithm validation or certainty about every July transaction.

**Q106:** The scan is authorized, authenticated, complete and verified to provide the same required evidence as the selected original entries. Accepting it retains the sample and evidence trail while avoiding disruption. The clerk has not refused adequate access. Insisting on the active original adds no identified evidentiary value; a verbal summary would weaken the review; escalation would mischaracterize the offered arrangement.

**Q107:** The audience's requested relationship is the route through departments and decisions, including return for re-review. The flowchart directly presents that structure. The other visuals can answer legitimate timing, frequency or reporting-relationship questions, but do not show the requested work path. The item does not infer a root cause, statistical significance or process capability from a diagram.

**Q108:** Experienced auditors have already completed the prescribed update course, and the reasons for differing case interpretations remain unknown. Confidential examination of actual evidence and criteria can distinguish legitimate context differences from inconsistent practice and identify transferable lessons. Course certificates, clause acknowledgements and agreement with seniority do not establish consistent judgment. The key does not assume every disagreement demonstrates incompetence or replace qualification controls with meeting attendance.

**Q109:** Reporting-period separation is central to the task. The benefit begins on 1 July and is verified only through December. Implementation and ongoing action costs are already reflected in the savings; the three listed audit-cost categories are complete, nonoverlapping and for the same calendar year. No cost is silently omitted or deducted twice. The selected statement preserves the distinction between realized results and a projected annual rate. Positive financial contribution is not treated as proof of every other program objective.

**Q110:** The failure mode occurs during assembly, before the new inspection. Its frequency and the effect of an escaped omission are explicitly unchanged. Better interception is improved detection, not demonstrated prevention of the omission or mitigation of its consequence. The explanation remains conceptual at the current Understand ceiling; it assigns no fixed rating change, RPN cutoff or numerical risk reduction.

The forty options contain **21–27 whitespace-delimited words**. The largest within-question maximum/minimum word ratio is about **1.191**. Correct options are not systematically longer: the Q103 key is the shortest option, Q107 has four equal-length options, and several keys tie alternatives. Plausibility was reviewed from the complete choices and rationales, not inferred from length measurements alone.

### Shared-case independence and exhibits

Q104 and Q105 use case identifier `cqa-set2-conversion-interface-01`. Their **401-character common context** is identical, as is the complete data-table object: title, two columns and all **four rows**. The exhibit is repeated in full in each question. It includes the applicable CV-4 requirements, available input/output records, approval controls and audit arrangements.

Each object was reviewed independently with its own stem and exhibit. Q104 asks how to collect suitable evidence. Q105 supplies its own completed twenty-job verification, confirmed reviewer authorization and satisfactory results, so its answer does not depend on the candidate selecting Q104's key. The common table states the intended sample, while Q105's additional text separately states completion. The date/count wording is “20 jobs from July” and “20 sampled jobs from July,” avoiding an ambiguous reading of “20 July.”

The third new table belongs to Q109 and contains the three complete, nonoverlapping remaining cost categories. All rows and monetary amounts agree with the stem and explanation.

### Independent financial reconstruction

| Q109 component | Calculation | Result |
|---|---|---|
| Realized months in the completed year | July through December | 6 months |
| Verified realized savings after action costs | 6 × $9,000 | $54,000 |
| Complete remaining audit costs | $24,000 + $9,000 + $7,000 | $40,000 |
| Correct realized net contribution, option A | $54,000 − $40,000 | **$14,000** |
| Annualized distractor, option B | 12 × $9,000 − $40,000 | $68,000 |
| Omitted remaining costs, option C | $54,000 without the $40,000 deduction | $54,000 |
| Auditor-labor-only distractor, option D | $54,000 − $24,000 | $30,000 |

Each numerical alternative matches its stated misconception. Annualizing the verified rate does not make the additional six months realized in the completed year. The original values and calculation do not use the handbook's erroneous illustrative figure on p. 192.

### Novelty and cognitive calibration

The inventory comparison covered all 150 Set 1 and 100 existing Set 2 items. The Set 1 index and the first ninety Set 2 records were unchanged from the full prior screening; Q091–Q100 were fully reviewed in the preceding cycle and reconsidered for this allocation. Relevant complete neighboring objects were reread. The check assessed the decision and misconception, rather than treating different names or industries as sufficient novelty.

- Q101 applies compatibility of two retained program scopes. It differs from Q051's joint-audit classification, Q032's shared methods, Q012's single-purpose scope and Set 1 b02-01's audit-type labels.
- Q102 evaluates potential exposure from an accurate but unauthorized disclosure. Q053 concerns a false assurance claim; Q002 addresses preventing external disclosure; Set 1 b06-10 combines competence and internal proprietary disclosure.
- Q103 positively selects adequate remote operating verification. Q015 concerns an unrepresentative shift sample, Q061 separates procedures from operating evidence, and Set 1 b05-01 rejects implementation paperwork as effectiveness evidence.
- The Q104/Q105 pair distinguishes sufficient interface evidence and a bounded positive report from Q074's absence of adequate alternatives, Q064's confirmed storage breach with uncertain damage, and Set 1 b03-15/b04-18's pre-audit document handling and multiple report-format defects.
- Q106 addresses avoidable disruption created by the auditor's own collection method. It differs from Q046's heated personal conflict and Set 1 b05-13/b05-17's misunderstanding and interview-logistics problems.
- Q107 communicates branching process structure, whereas Q067 communicates chronological rate changes. Q108 develops collective judgment from completed cases, whereas Q008 targets one auditor's skill and Set 1 b06-11/b06-12 address qualification and individual performance evaluation.
- Q109's completed-period-versus-annualized distinction avoids repeating Q009's gross/net COQ arithmetic. Set 1 b06-20 discusses value beyond financial savings; it does not compute this contribution. Q030's Pareto ranking does not establish realized savings.
- Q110 explains a specified detection mechanism. Set 1 b07-17 addresses broader FMEA purpose, timing and subjective scoring; its overbroad timing/incoming-defect claims were not imported.

Actual cognitive labels were calibrated to the finished tasks. Q107 was changed from Evaluate to **Apply**, because it applies a known visual's properties to a stated communication need. Q109 was changed from Evaluate to **Analyze**, because it separates timing and cost categories before deriving the reportable result. Q105 remains Evaluate below the II.C.2 Create ceiling, and Q110 remains Understand. No question was artificially expanded to justify the outline's maximum level.

### Review changes and frozen artifacts

The first-half review clarified the three “20 July jobs”/“20 sampled July jobs” occurrences to distinguish a count from a date. The second-half review changed only the two cognitive metadata labels described above; its final write also normalized JSON indentation, including formerly compact table rows. The author confirmed parsed before/after identity for all other fields, and the independent reviewer reread the complete final file. No key or supporting source changed after the final content review.

- Q101–Q105: `set2_batch11_q101_q105.json`, 19,332 bytes; SHA-256 `652ff99799265dfefb7a73c8ada68bb941956b8d5a7fa36d222ad640d6bbac90`.
- Q106–Q110: `set2_batch11_q106_q110.json`, 15,969 bytes; SHA-256 `f9e10a85a20fdf5dc7c6cc7ea6a80b760aeef7d01b9fdaa863c64a687592ab6c`.

Mechanical checks confirmed ten sequential unique IDs, four options and exactly three keyed distractor rationales per item, one source span per explanation, compatible cognitive ceilings, no exact prior-stem duplicates, the complete case equality and the financial calculations. These complement the substantive source and answer review; they do not substitute for it.

Source qualifications remain explicit: p. 44's dated FDA/discovery examples do not supply a current universal legal rule; p. 121's note-handling language does not establish a universal destruction policy; p. 192's erroneous financial illustration is not used; and pp. 305–306 do not supply universal FMEA timing, rating changes or acceptance cutoffs. Local agreements, audit boundaries and cost definitions in these scenarios are stated facts, not universal ASQ rules.

## Progress and remaining blueprint

| Domain | Batch 1 | Batch 2 | Batch 3 | Batch 4 | Batch 5 | Batch 6 | Batch 7 | Batch 8 | Batch 9 | Batch 10 | Batch 11 | Current total | Final target | Remaining |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| I. Auditing Fundamentals | 2 | 3 | 2 | 3 | 2 | 3 | 2 | 3 | 2 | 3 | 2 | 27 | 37 | 10 |
| II. Audit Process | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 33 | 45 | 12 |
| III. Auditor Competencies | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 22 | 30 | 8 |
| IV. Audit Program Management and Business Applications | 2 | 1 | 2 | 1 | 2 | 1 | 2 | 1 | 2 | 1 | 2 | 17 | 23 | 6 |
| V. Quality Tools and Techniques | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 11 | 15 | 4 |
| **Total** | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **10** | **110** | **150** | **40** |

Continue alternating the established domain allocations: odd-numbered batches 2/3/2/2/1 and even-numbered batches 3/3/2/1/1. Across fifteen batches this produces exactly 37/45/30/23/15. Future items still need individual topic coverage, source validation and independent review; allocation alone is not content validation. The next user-requested batch will be **Q111–Q120**, allocation **3/3/2/1/1**, after a fresh audit of Q101–Q110. It has not been started in this update.

The first 110 questions contain twelve document-case items in six pairs (Q004–Q005, Q023–Q024, Q043–Q044, Q064–Q065, Q084–Q085 and Q104–Q105), approximately **10.91%**, and **26 rendered question tables**. The new pair repeats its complete context and exhibit and remains independently answerable after shuffling. Twelve case items at 120 questions will equal 10%; another pair can be considered in Batch 13. Answer positions are **A28/B27/C27/D28**. Actual cognitive labels are **Apply 49, Analyze 31, Evaluate 25 and Understand 5**.

The existing engine randomizes question order. Practice timing remains two minutes per question: the available 110-question Full session uses **220 minutes**, displayed as **3 hr 40 min**. Quick Quiz retains its fifty-question maximum and samples from all 110 available items. This remains a partial practice set toward the planned 150.

## Integration verification

- `node --test --test-isolation=none tests/test-bank-cqa-set1.test.js tests/test-bank-cqa-set2.test.js`: **13 passed, 0 failed**.
- `npm run build:site`: **passed**, including scans of 619 public files with no known static findings and three clean protected-tool shells. These static checks do not claim verification of a production runtime or CDN.
- The learner checks exercise all 110 questions, a 220-minute Full session, correct grading, a fifty-question Quick Quiz sampled from the available 110, a ten-question diagnostic, and all five focused domains with 27/33/22/17/11 questions.
- An all-correct Full attempt scores 110/110 and 100%. A fifty-question Quick attempt with one deliberate wrong answer scores 49/50, displayed as 98%, and identifies the single incorrect item in review.
- All 26 question tables render during the attempt and review. All 110 review cards display the authored explanations and all **330 distractor rationales**. Distractor feedback is not exposed during the timed attempt.
- The runtime timer was checked at **13,200 seconds** and the existing display convention at `3 hr 40 min`. Quick Quiz serves its fifty-question request without an availability-cap notice. No timing or quiz-engine implementation change was needed.
- Set 1 remains at 150 unchanged questions. Set 2 is included only in the protected CQA package and excluded from other exam packages and public staging.
- All 100 preceding question objects were compared with the prior PR bank and remain unchanged, including their serialized source text. The ten new objects exactly match the frozen author arrays. All **260 combined Set 1/Set 2 question IDs** are unique; every Set 2 item has four distinct options, exactly three non-key distractor rationales and a printed-page source reference.
- JavaScript syntax checks passed for the bank and test file. The HTML change since the preceding PR head is only the CQA completion label, from Batch 10 to Batch 11. The replacement is scoped to the CQA registration to preserve every other exam's label. The reviewed update includes only the bank, its existing integration tests, the CQA progress label and this cumulative audit; unrelated regenerated build files are excluded.

PR #368 remains an accumulation branch; publication is deferred until all 150 questions are ready. No merge or production deployment is part of this batch update.
