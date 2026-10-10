# PMP Set 2 Batch 17 Questions 161 to 170

Ten original practice questions on closure, transition, and knowledge transfer. These are not recalled exam questions. Difficulty labels are author judgments awaiting learner calibration.

## Batch coverage

3 People, 5 Process, 2 Business Environment. Approaches: 4 predictive, 3 agile, 3 hybrid. Difficulty: 2 moderate, 6 challenging, 2 very challenging. Formats: 7 single-answer, 1 multiple-answer, 1 matching, and 1 hotspot. All ten questions are standalone.

## Questions and explanations

### Question 161

People Task 7 · Agile · Moderate · single

An agile team is handing a service to an operations team. The runbook is complete, but one developer still resolves unusual recovery cases by recognizing patterns that are not explained in the document. The developer leaves the project in two weeks. What should the project manager arrange?

Select ONE answer.

- **A.** Pair the developer with operations staff for realistic recovery exercises, discuss the decision cues, and have operations demonstrate the response.
- **B.** Ask the developer to upload the runbook again and treat the upload as completed knowledge transfer.
- **C.** Give operations the developer’s personal contact details as the main recovery arrangement after departure.
- **D.** Postpone all knowledge transfer until the next unusual recovery case occurs in production.

#### Answer and explanation

**Correct answer: A.** The gap is experience-based judgment as well as written instructions. Guided practice and discussion make that judgment more accessible, while an operations demonstration checks whether the receiving team can apply it. The available overlap should be used before the expert leaves.

- **A.** This combines interaction, contextual explanation, and evidence that the recipient can apply the knowledge.
- **B.** Another copy of the same document does not transfer the missing decision cues.
- **C.** An informal dependency on a departing individual is not a demonstrated operational capability.
- **D.** Waiting for a live incident wastes the planned overlap and creates avoidable exposure.

**Why this is moderate:** The scenario explicitly identifies tacit knowledge and a limited opportunity for practical transfer.

**References:** PMBOK Guide, Eighth Edition, Guide §2.1.6.6: manage project knowledge, pp. 24–26 (PDF pp. 129–131).

### Question 162

Process Task 8 · Predictive · Very challenging · single

A predictive system cutover has a strict 90-minute outage limit. At minute 35, an acceptance check fails. A proposed correction requires 30 minutes, followed by 15 minutes of verification before anyone can know whether it worked. If verification fails, restoring and verifying the old service takes 50 minutes from the rollback decision; rollback cannot run in parallel with the correction. The approved rule requires preserving enough time to restore the old service within the outage limit whenever the new service is unverified. What should the project manager recommend?

Select ONE answer.

- **A.** Try the correction and verification because their successful completion at minute 80 is within the outage limit.
- **B.** Try the correction and decide on rollback at minute 65, before spending time on verification.
- **C.** Initiate the approved rollback and replan the cutover because the correction cannot be verified before the latest safe rollback decision.
- **D.** Extend the outage to minute 130 now because the correction might still succeed.

#### Answer and explanation

**Correct answer: C.** The latest safe rollback decision is minute 40 because restoration and verification require 50 minutes within a 90-minute limit. Only five minutes remain at the current point. The proposed correction would not be verified until minute 80; a failed result would then restore service at minute 130. Initiating rollback now restores verified service at minute 85 and preserves the stated constraint.

- **A.** This considers only success; it loses the required ability to restore service within the limit if verification fails.
- **B.** A minute-65 decision would complete rollback at minute 115, still beyond the limit, and the correction would remain unverified.
- **C.** This preserves the approved recovery constraint; the proposed attempt cannot supply acceptance evidence by minute 40.
- **D.** No authority to change the strict outage limit is given.

**Why this is very challenging:** The candidate must schedule a conditional recovery path, distinguish completion of a correction from its verification, and calculate the latest safe decision time.

**References:** PMBOK Guide, Eighth Edition, Guide §2.3: schedule sequencing and estimates, pp. 51–53 (PDF pp. 156–158). PMBOK Guide, Eighth Edition, Guide §2.1.6.9: close project or phase, pp. 31–32 (PDF pp. 136–137).

### Question 163

Process Task 10 · Predictive · Challenging · single

A predictive installation project has signed acceptance, completed financial reconciliation, and transferred operating responsibility. The closure procedure explicitly allows warranty obligations to continue after closure if they have an authorized owner, funding, response arrangements, and a retrievable record. All these arrangements are confirmed. A stakeholder says the project cannot close until the twelve-month warranty expires. What should the project manager do?

Select ONE answer.

- **A.** Keep the entire project open until the warranty ends, regardless of the approved closure procedure.
- **B.** Complete formal closure under the agreed procedure and record the continuing warranty responsibilities and support route in the handover.
- **C.** Close the project and remove the warranty obligations from the handover because the delivery work is finished.
- **D.** Request a second installation acceptance solely to convert the warranty into completed project work.

#### Answer and explanation

**Correct answer: B.** The scenario states that the closure conditions are met and explains how continuing warranty obligations are managed. The project can close while those obligations remain active under the authorized arrangement. Closure must preserve the record and ownership; it does not extinguish the warranty.

- **A.** This adds a closure condition that contradicts the stated procedure and retains project resources unnecessarily.
- **B.** This follows the approved conditions and preserves accountability for the continuing obligation.
- **C.** Closing the project does not remove the continuing obligation or the need for an accessible support route.
- **D.** Additional acceptance does not make a future warranty obligation disappear.

**Why this is challenging:** The candidate must distinguish project closure from ongoing obligations and apply the explicit conditions rather than a blanket rule.

**References:** PMBOK Guide, Eighth Edition, Guide §2.1.6.9: close project or phase, pp. 31–32 (PDF pp. 136–137). PMBOK Guide, Eighth Edition, Guide Appendix X4: procurement agreements and administration, pp. 247–254 (PDF pp. 352–359).

### Question 164

Business Environment Task 2 · Predictive · Challenging · single

A predictive project is archiving inspection evidence at closure. The organization’s stated policy requires seven years of retention, restricted access for designated roles, and successful retrieval verification before the project workspace is retired. The archive copy exists, but the receiving custodian has not tested access or retrieval. What should the project manager do?

Select ONE answer.

- **A.** Retire the workspace immediately because the existence of an archive copy proves compliance.
- **B.** Email unrestricted copies to every stakeholder so the records will always be accessible.
- **C.** Leave the project workspace active indefinitely and omit formal custodianship.
- **D.** Confirm the custodian, required access and retention controls, and successful retrieval before retiring the workspace.

#### Answer and explanation

**Correct answer: D.** The policy requires more than copying files. Verifying authorized access, retention arrangements, and retrieval establishes that the required evidence remains usable after transition. An uncontrolled distribution or an indefinite workspace does not implement the stated archival process.

- **A.** A copy alone does not demonstrate the specified access and retrieval requirements.
- **B.** Unrestricted distribution conflicts with the stated access restriction.
- **C.** Indefinite retention in the old workspace does not establish the required custodianship and controls.
- **D.** This verifies the explicit policy conditions before the original workspace is retired.

**Why this is challenging:** The candidate must recognize that record preservation includes controlled accessibility and verified retrieval, not just storage.

**References:** PMBOK Guide, Eighth Edition, Guide §2.1.6.9: close project or phase, pp. 31–32 (PDF pp. 136–137). PMBOK Guide, Eighth Edition, Guide §2.1.6.6: manage project knowledge, pp. 24–26 (PDF pp. 129–131).

### Question 165

People Task 5 · Hybrid · Challenging · multiple

A hybrid project is preparing a planned operational handover after several software releases. The customer’s service lead expects round-the-clock response, while the receiving support team has planned business-hours coverage. The handover documents use the phrase “support available” without defining hours or response commitments. No round-the-clock arrangement has been authorized. Which TWO actions should the project manager take before confirming the handover commitment?

Select TWO answers.

- **A.** Facilitate a discussion to make the expected service hours, response needs, and constraints explicit.
- **B.** Promise round-the-clock coverage now and ask operations to determine how to provide it after handover.
- **C.** Agree a feasible support commitment with the authorized stakeholders and document ownership, resources, and escalation arrangements.
- **D.** Ask both teams to sign the ambiguous phrase again so the disagreement is covered by an approval record.
- **E.** Remove the service lead from the review because operations controls staffing.

#### Answer and explanation

**Correct answer: A and C.** The parties have incompatible interpretations of an undefined commitment. The project manager should expose those expectations and establish a feasible, authorized service arrangement. Documenting the agreed hours, responsibilities, resources, and escalation route makes the handover assessable and prevents an unsupported promise.

- **A.** This identifies the expectations and constraints that need alignment.
- **B.** The stated authority and resources do not support this promise.
- **C.** This converts alignment into an authorized and usable operational commitment.
- **D.** Reapproving ambiguous wording does not resolve the disagreement.
- **E.** The customer’s service expectations are essential input to the agreement.

**Why this is challenging:** The candidate must pair expectation discovery with an authorized agreement rather than relying on a vague sign-off.

**References:** PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178). PMBOK Guide, Eighth Edition, Guide §2.1.6.9: close project or phase, pp. 31–32 (PDF pp. 136–137).

### Question 166

Process Task 3 · Agile · Challenging · single

An agile project’s first release is accepted and technically usable. The benefit depends on caseworkers using its shared queue instead of separate spreadsheets. Pilot feedback shows the queue’s main functions work, but supervisors still assign work through the spreadsheets and staff receive conflicting instructions. The product owner asks whether the next iteration should add dashboard colors or support the change in working practice. What should the project manager recommend?

Select ONE answer.

- **A.** Prioritize dashboard colors because accepted software means the operating benefit has already been realized.
- **B.** Use the feedback to prioritize a coordinated trial of the agreed queue-based working practice with supervisors and users, then measure adoption and the intended outcome.
- **C.** Stop collecting benefit evidence until all requested cosmetic enhancements are complete.
- **D.** Require caseworkers to use both systems permanently without assessing the added effort or conflicting assignments.

#### Answer and explanation

**Correct answer: B.** The current barrier to value is the operating practice around a usable release. A coordinated trial with the people assigning and doing the work can test the intended behavior and its outcome. This is more directly connected to the benefit than cosmetic work or permanent duplicate administration.

- **A.** Acceptance shows that an output is usable, not that the behavior needed for its benefit has occurred.
- **B.** This addresses the observed value constraint and uses feedback and outcome evidence to guide further delivery.
- **C.** Deferring evidence collection delays learning about the actual benefit mechanism.
- **D.** Unassessed duplicate processes can sustain the conflict and increase workload.

**Why this is challenging:** The candidate must prioritize work that enables value from an accepted release rather than assuming more product features solve an adoption barrier.

**References:** PMBOK Guide, Eighth Edition, Guide Section 4: benefits management plan, pp. 115–116 (PDF pp. 220–221). PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178).

### Question 167

People Task 3 · Agile · Moderate · single

An agile project is winding down after its final release. Several team members are uncertain about upcoming assignments and feel that their contributions will be forgotten. Resource reassignment decisions belong to their functional managers. What should the project manager do?

Select ONE answer.

- **A.** Recognize contributions, provide useful performance feedback, and coordinate clear transition information with the functional managers.
- **B.** Promise each team member a preferred next assignment to maintain morale.
- **C.** Avoid discussing reassignment because the final product has already been released.
- **D.** Keep everyone allocated to the closed project until each person independently finds a new role.

#### Answer and explanation

**Correct answer: A.** The project manager can support people through recognition, feedback, and coordinated transition information while respecting who controls reassignment. Finishing a deliverable does not remove leadership responsibilities toward the team during demobilization.

- **A.** This supports the team and coordinates with the people who hold reassignment authority.
- **B.** The project manager cannot guarantee assignments controlled by others.
- **C.** Silence leaves the stated uncertainty and lack of recognition unaddressed.
- **D.** Indefinite allocation is not a coordinated or justified transition plan.

**Why this is moderate:** The candidate selects a supportive leadership action within the project manager’s stated authority.

**References:** PMBOK Guide, Eighth Edition, Guide §2.6.2.4: lead the team, pp. 84–86 (PDF pp. 189–191). PMBOK Guide, Eighth Edition, Guide §2.1.6.9: close project or phase, pp. 31–32 (PDF pp. 136–137).

### Question 168

Business Environment Task 7 · Hybrid · Challenging · matching

A hybrid project is preparing transition when the receiving organization changes its structure and operating model. Match each impact on the project with the most direct transition response.

Match each organizational change impact to its most direct transition response. Use each choice at most once; one choice is unused.

1. The service will transfer to a different business unit whose available support capacity has not been confirmed.
2. Staff who were observers during training are now assigned to operate the service.
3. The manager named to authorize handover no longer holds that authority under the new structure.
4. New individual performance targets reward the old workflow and discourage use of the delivered service.

- **A.** Align the handover decision route with the new authorized service leadership.
- **B.** Review and adapt the adoption approach with the affected groups to address the changed performance incentives.
- **C.** Keep the original handover plan unchanged because restructuring is outside the project.
- **D.** Update role-based training and verify the newly assigned operators can perform their responsibilities.
- **E.** Confirm the receiving unit’s revised ownership and capacity, then update the project’s transition dependencies.

#### Answer and explanation

**Correct answer: 1 → E; 2 → D; 3 → A; 4 → B.** The changes affect receiving capacity, operator capability, decision authority, and incentives for adoption. Transition planning should respond to each specific impact. The project does not need to control the reorganization to recognize and manage its effects on readiness.

- **A.** A addresses impact 3: the approval route must reflect the current authorized leadership.
- **B.** B addresses impact 4: incentives that discourage adoption need a targeted change response.
- **C.** C is unused: an external organizational decision can still materially change the project’s transition requirements.
- **D.** D addresses impact 2: changed job responsibilities require appropriate preparation and capability verification.
- **E.** E addresses impact 1: the new recipient must be able to take responsibility for the service.

**Why this is challenging:** The candidate must distinguish four consequences of organizational change and adapt the relevant transition controls.

**References:** PMBOK Guide, Eighth Edition, Guide §2.5.2.3–2.5.2.6: communication and stakeholder engagement, pp. 72–73 (PDF pp. 177–178). PMBOK Guide, Eighth Edition, Guide §2.6.2.4: lead the team, pp. 84–86 (PDF pp. 189–191). PMBOK Guide, Eighth Edition, Guide §2.1.6.9: close project or phase, pp. 31–32 (PDF pp. 136–137).

### Question 169

Process Task 7 · Hybrid · Challenging · hotspot

A hybrid project has an approved acceptance requirement for each processing component: at least 100 records per minute sustained for at least 30 continuous minutes, with zero rejected records, using the current release configuration. All four reports below are from that configuration, and their stated rate was sustained for the full reported duration. Select the test-evidence cell that does NOT yet demonstrate the requirement.

Select ONE test-evidence cell.

| Component | Current-release test evidence |
|---|---|
| A — Intake | 102 records/min; 30 continuous minutes; zero rejects. |
| B — Routing | 105 records/min; 45 continuous minutes; zero rejects. |
| C — Export | 100 records/min; 30 continuous minutes; zero rejects. |
| D — Archive | 110 records/min; 10 continuous minutes; zero rejects. |

- **A.** A — Intake: 102 records/minute for 30 continuous minutes, zero rejects, current release.
- **B.** B — Routing: 105 records/minute for 45 continuous minutes, zero rejects, current release.
- **C.** C — Export: 100 records/minute for 30 continuous minutes, zero rejects, current release.
- **D.** D — Archive: 110 records/minute for 10 continuous minutes, zero rejects, current release.

#### Answer and explanation

**Correct answer: D.** Archive meets the rate and reject conditions but has only ten minutes of evidence against the required thirty-minute sustained run. A higher rate does not compensate for insufficient duration. The other reports satisfy all the specified thresholds. Additional valid evidence is required; the short run alone does not prove that Archive would fail a complete test.

- **A.** The report meets the minimum rate and duration and has zero rejects on the current configuration.
- **B.** A longer qualifying run meets the minimum duration; the rate and reject conditions also pass.
- **C.** Equality with an inclusive minimum is sufficient, and all other conditions are met.
- **D.** The duration is below the required minimum, so the report does not yet demonstrate conformance.

**Why this is challenging:** The candidate must apply all conjunctive acceptance conditions, distinguish an inclusive boundary from a short test, and avoid equating insufficient evidence with proven failure.

**References:** PMBOK Guide, Eighth Edition, Guide §2.1.6.5: quality assurance and control, pp. 23–24 (PDF pp. 128–129). PMBOK Guide, Eighth Edition, Guide §2.1.6.9: close project or phase, pp. 31–32 (PDF pp. 136–137).

### Question 170

Process Task 6 · Predictive · Very challenging · single

A predictive project is preparing its final cost forecast and cash requirements. Recognized costs to date are $420,000, of which $390,000 has been paid. The unpaid $30,000 consists of a $20,000 invoice and $10,000 retention, both already included in recognized costs and both still payable. Completing and closing the project requires $50,000 of additional costs not yet incurred; all will require payment. No other costs, credits, taxes, or timing adjustments apply. Which pair should the project manager report?

Select ONE answer.

- **A.** Forecast final cost $440,000; remaining cash payments $80,000.
- **B.** Forecast final cost $470,000; remaining cash payments $50,000.
- **C.** Forecast final cost $470,000; remaining cash payments $80,000.
- **D.** Forecast final cost $500,000; remaining cash payments $80,000.

#### Answer and explanation

**Correct answer: C.** Final cost is the $420,000 already recognized plus $50,000 of additional work, or $470,000. Remaining cash is $30,000 still payable for costs already recognized plus $50,000 for future work, or $80,000. Adding the unpaid invoice and retention to recognized cost again would double-count them; ignoring them in cash planning would understate required payments.

- **A.** This uses cash paid rather than recognized costs as the starting point for the final cost forecast.
- **B.** The cost forecast is correct, but cash planning omits the $30,000 already incurred and still payable.
- **C.** This reconciles recognized costs, unpaid obligations, and future work without omission or double counting.
- **D.** This adds the $30,000 unpaid balance twice to the cost forecast, although it belongs in the remaining cash requirement.

**Why this is very challenging:** The candidate must reconcile cost recognition and cash payment while treating an unpaid invoice and retention consistently.

**References:** PMBOK Guide, Eighth Edition, Guide §2.4: finance planning and analysis, pp. 63–65 (PDF pp. 168–170). PMBOK Guide, Eighth Edition, Guide §2.1.6.9: close project or phase, pp. 31–32 (PDF pp. 136–137).

## Answer key

| Question | Answer |
|---|---|
| 161 | A |
| 162 | C |
| 163 | B |
| 164 | D |
| 165 | A and C |
| 166 | B |
| 167 | A |
| 168 | 1 → E; 2 → D; 3 → A; 4 → B |
| 169 | D |
| 170 | C |

## Coverage and review

Cumulative: 170 of 180 questions; 56 People, 70 Process, 44 Business Environment. Approaches: 68 predictive, 51 agile, 51 hybrid. Difficulty: 34 moderate, 102 challenging, 34 very challenging. Formats: 124 single, 22 multiple, 12 matching, 6 drop-down, 6 hotspot. Single-answer keys: A 31, B 31, C 31, D 31. Ten shared cases continue to support 30 questions.

Independent calculations: Q162’s latest safe rollback decision is minute 40; from minute 35 only five minutes remain. Correction and verification finish at minute 80; subsequent rollback would finish at minute 130. Immediate rollback finishes at minute 85. Q170 final cost is $470,000 and remaining cash payments are $80,000; the $30,000 unpaid balance is already recognized. Q169 requires every stated test condition, so a ten-minute run cannot demonstrate a thirty-minute requirement even at a higher rate. The hotspot’s accessible names retain all decision-relevant evidence.

References use printed and PDF pages from the supplied 401-page PMBOK Eighth Edition. Task mappings follow the July 2026 ECO: https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/new-pmp-examination-content-outline-2026.pdf. Archival and warranty requirements are explicit hypothetical organizational conditions, not claims about applicable law.

Next: Batch 18, Questions 171–180, integrated recovery and competing priorities. Ten questions remain.

## Integration validation

All four Node 22 Set 2 tests pass, including keys/allocations, response encoding, production-edge delivery, navigation, scoring, review/correction, reveal locking, and Set 1 isolation. Stateless validation and whitespace checks pass. Independent comparison confirms the prior 160 source objects and rendered question/answer content are unchanged. Review content matches every new stem, option, explanation, rationale, difficulty justification, and reference. All 26 task allocations reconcile, leaving ten specified tasks for Batch 18. Q162/Q170 arithmetic and all Q169 acceptance conditions were independently verified.

Local Chromium checks passed for Q162, Q165, Q168, Q169, and Q170 at 1280 px and 390 px in both themes: response input, keyboard selection, locked reveal, 170-card review, no document overflow or JavaScript errors, and zero axe WCAG A/AA violations in the tested question/answer components. Mobile and desktop hotspot screenshots were inspected for readable evidence and visible focus. Accessible labels retain the full rate, duration, rejects, and release context. This fixture isolates authentication; real-account login is outside the check. Deploy-preview asset verification and remote CI status are reported separately in PR 280.
