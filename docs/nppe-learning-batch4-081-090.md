# NPPE Learning Bank — Batch 4 (NPPE-081–090)

**Set 1 · ChatGPT · Original authoring and reviewer copy**

This document contains ten original learning questions and **all correct answers**. It is excluded from public static delivery. Use the protected simulator for an unassisted attempt. These practice items are not affiliated with the NPPE program and do not guarantee a pass.

**Learning size:** 40/120 · **Timed:** 55 minutes (`ceil(40 × 150 / 110)`) · **Untimed:** answer revelation marks the item assisted and locks its options.

## Item crosswalk

| ID | Blueprint | Topic | Provisional difficulty | Cognitive level | Key |
|---|---|---|---|---|:---:|
| NPPE-081 | I.4 | Value of reproducible negative research findings | easy | understanding | **A** |
| NPPE-082 | II.2 | Utilitarian consequences beyond beneficiary headcount | easy | understanding | **D** |
| NPPE-083 | II.3 | Limits on professional endorsement of test results | medium | application | **B** |
| NPPE-084 | III.1 | Multidisciplinary design-interface coordination | medium | application | **C** |
| NPPE-085 | III.7 | Departing employee access versus record retention | medium | application | **A** |
| NPPE-086 | III.10 | Read-back to verify a technical handover | medium | application | **D** |
| NPPE-087 | IV.4 | Québec client resiliation after services begin | medium | application | **C** |
| NPPE-088 | IV.5 | Ontario statutory termination minima and common-law notice | medium | application | **B** |
| NPPE-089 | V.3 | Ontario responsibility exception for supervised unlicensed work | medium | application | **D** |
| NPPE-090 | VI.1 | BC complaints after a private settlement | medium | application | **A** |

## Editorial and source audit — 2026-10-15 UTC

- Reviewed all ten stems and all 40 option rationales for a single best answer, internal consistency, jurisdiction and source fit. Classifications are editorial estimates: two easy/understanding and eight medium/application items; none is represented as empirically calibrated.
- Answer positions: **A3/B2/C2/D3**. Two correct options are longest by character count; three are uniquely shortest by word count. Parallel wording was reviewed, not merely counted.
- The earlier draft of NPPE-082 tested convergence between ethical frameworks, which was too close to Mock D NPPE-510. Replaced it before release with the distinct headcount-versus-consequences question below. NPPE-087 and NPPE-088 were clarified so necessary contract/employment assumptions appear in the stem.
- Existing Diagnostic 001–050, Learning 051–080 and both 110-item mock banks were screened for duplicate stems and families, followed by manual comparison of the related concepts below. No earlier item was rewritten.
- The official NPPE site still publishes the 2017 blueprint. Its note anticipating a 2026 review is not evidence of a replacement blueprint. These mappings use the actually published numbered topics.
- Supplied Andrews/Shaw/McPhee 6th edition (2019) and Samuels/Sanders (2007) textbook pages were read as cited. No publisher instructor test bank or recalled exam item was used. Examples and distractors here are original.
- Legal verification used official legislation or indexed official text, the Supreme Court of Canada, and current regulator explanations. Retrieval limits are disclosed below; no unavailable consolidated text is represented as fully read. National Engineers Canada guidance is advisory, not a provincial statute.

### Related-family review

| New item | Related existing material | Distinct assessed decision |
|---|---|---|
| 081 | Diagnostic 021; Mock D 508 / Mock E 618 (societal value) | Reliable research contributes knowledge even when a prototype misses its target; no infrastructure lifecycle-cost scenario. |
| 082 | Diagnostic 022 (identify utilitarianism); Mock D 510 (different ethical perspectives) | Critique a headcount-only comparison; does not ask candidates to name a theory or recognize disagreement/convergence. |
| 083 | Professional honesty and public communication items | A limited equipment test cannot support a whole-installation marketing endorsement. |
| 084 | Learning 074 (external calculations and incompatible conventions) | Resolve inconsistent inputs between responsible disciplines before releasing an integrated design; does not transfer design responsibility automatically. |
| 085 | Learning 076 (readable retained records), 078 (copyright licence) | Revoke a departing employee’s access without destroying project history; not legacy-format migration or copying rights. |
| 086 | Diagnostic 013 (urgent safeguard escalation) | Check a recipient’s demonstrated misunderstanding of an already-authorized instruction; not hazard assessment or escalation. |
| 087 | Diagnostic 037 (Québec civil-law framework) | Apply the client’s unwaived service-contract resiliation right and distinguish payment consequences. |
| 088 | Learning 055–056 (employment rights/accommodation) | Distinguish statutory termination minima from common-law notice; not discrimination or accommodation. |
| 089 | Mock D 584 (independent unlicensed services); Learning 079 (admission) | Apply the Ontario responsibility exception for active supervised work without conferring a licence. |
| 090 | Diagnostic 020 (complaint fairness); civil/disciplinary distinction items | A private settlement cannot require withdrawal/closure of an already-submitted BC complaint. |

### Source boundaries

- **087:** The official indexed text of Civil Code article 2125 and current OIQ service-contract guidance support unilateral client resiliation after performance begins. OIQ also explains article 2129 payment obligations. Full consolidated HTML could not be retrieved; the item does not calculate damages or assert that a client’s right cannot be waived.
- **088:** Ontario’s official indexed ESA guide distinguishes statutory minima from greater common-law rights. The official *Honda Canada Inc. v. Keays*, 2008 SCC 39, paragraphs 28–29 excerpt supports a case-specific notice assessment. The item does not supply a notice period, salary entitlement or mitigation calculation.
- **089:** PEO’s published guideline §4.3 reproduces the statutory exception in Professional Engineers Act s. 12(3)(b); §§5.1–5.2 explain active direction and supervision. Direct Ontario consolidated HTML retrieval was blocked. The stem assumes the firm’s required authorization, a competent supervising P.Eng., and actual assumption of responsibility.
- **090:** EGBC’s current “Submit a Complaint” page states that submitted complaints cannot be withdrawn and are reviewed to determine whether to investigate; a private resolution may not end the investigation. This does not establish guilt or require investigation of every complaint.

## Functional verification and release gates

The protected build appends this batch only to Set 1 Learning, after Batches 1–3. Predecessor IDs, owner, form, bank and batch are validated; previous objects are preserved. Repeated identical registration is idempotent; conflicting content fails closed. Diagnostic and Mock A–E remain separate.

Regression coverage now requires 40/120, a 55-minute timer, 40/40 unassisted scoring, all 160 option rationales, and domain denominators **3/6/9/16/3/3**. With one wrong answer per domain the expected score is **34/40 (85%)**. The real-browser audit covers Chromium and WebKit, widths 320/390/1440, light/dark themes, keyboard answering and flags, persistence, 39/40 after one assisted reveal, locked revealed options, and five accessibility phases. Public staging excludes authoring JS and these reviewer documents; unrelated certification packages must contain no Learning keys.

Execution results and exact tested commit are recorded in draft [PR #301](https://github.com/UpSkillSprint-Consulting/upskill-sprint/pull/301); coverage definitions alone do not establish a pass. Browser permission fixtures are not live production-account verification.

Independent engineering/legal SME review, empirical difficulty calibration, and live production request → administrator approval → practice → revocation checks remain separate release gates. No production database migration, permission change, deployment, merge or learner grant is authorized by this batch.

The next authoring milestone is **Batch 5, NPPE-091–100** (I1, II2, III3, IV2, V1, VI1). The full-bank cognitive target still requires later integrated-analysis items; this batch does not inflate simple applications into “analysis.”

---

## NPPE-081 — I.4

**Learning objective:** Recognize the societal value of reliable engineering research even when a prototype is not commercially successful.

**Jurisdiction and assumptions:** Canada; research results may be shared lawfully, and no unsafe prototype is being released for use.

A publicly funded team tests a new industrial sensor. The prototype fails to achieve its temperature-range target, but the team documents reproducible results showing where the materials cease to perform reliably. Other researchers can use those findings to avoid unsuitable designs. Which statement best describes the contribution of this work?

A. It expands usable technical knowledge that can improve later research and design decisions.
B. Its contribution is measured by the number of prototypes installed in commercial facilities.
C. Its value depends on obtaining exclusive patent rights before other researchers use the findings.
D. It demonstrates production readiness because the team has completed a reproducible testing program.

**Correct answer: A.**

**Reasoning for all four options:**

- **A — correct:** Reliable findings about a design limitation can advance knowledge and guide later decisions, even when the tested prototype misses its target.
- **B:** Deployment is one possible benefit, but research also contributes knowledge before or without commercial installation.
- **C:** Exclusive rights are not a prerequisite for societal value; lawfully shared research can benefit others without a patent.
- **D:** Reproducibility supports confidence in the findings, including the identified failure. It does not convert a failed performance target into production readiness.

**Transfer principle:** Research can contribute valuable knowledge about limitations as well as successful technologies.

**Common misconception:** Equating societal value with immediate commercial deployment or treating completed tests as proof of success.

**Evidence and authority:**

- Andrews, Shaw and McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed. (2019) — About the Cover and Frontispiece, printed p. vii (PDF p. 9): engineering research enables new scientific knowledge; conceptual background, not the fictional sensor scenario (*textbook*)
- [NPPE, published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/) — I.4 — The Value of Engineering and Geoscience Professions to Society (*official-blueprint*)

**Metadata:** `nppe:set-1:learning:081`, version 1, family `research-negative-results-shared-technical-knowledge`; source review 2026-10-15. Editorial estimate; not empirically calibrated; independent SME/legal and psychometric validation pending.

---

## NPPE-082 — II.2

**Learning objective:** Recognize why a utilitarian comparison requires the seriousness and duration of consequences as well as the number of people affected.

**Jurisdiction and assumptions:** Conceptual professional ethics; no jurisdiction-specific legal entitlement is being decided.

In an ethics workshop, a participant says a utilitarian comparison is complete once the number of people benefiting from each proposal has been counted. No information about the size or duration of benefits and harms has been considered. What is the most accurate assessment of this claim?

A. The comparison is complete because utilitarian reasoning treats each beneficiary as receiving an equal benefit.
B. The comparison needs only the number of people voting for each proposal, regardless of actual consequences.
C. The comparison needs only monetary benefits, since non-financial consequences are outside utilitarian reasoning.
D. The comparison also needs the seriousness and duration of consequences, rather than a beneficiary headcount alone.

**Correct answer: D.**

**Reasoning for all four options:**

- **A:** Equal consideration of people does not mean that every effect has equal magnitude or duration. A simple count cannot establish the total consequences.
- **B:** A preference vote is not a substitute for assessing benefits and harms; votes alone do not establish the consequences of either proposal.
- **C:** Relevant consequences include non-financial effects on well-being. Utilitarian reasoning is not confined to monetary returns.
- **D — correct:** The number affected is relevant, but the intensity and duration of benefits and harms also matter. Headcount alone does not establish the better overall consequences.

**Transfer principle:** Utilitarian assessment considers the consequences for affected people, including their magnitude and duration; it is not merely a headcount.

**Common misconception:** Confusing aggregate benefit with the largest number of beneficiaries or votes.

**Evidence and authority:**

- Andrews, Shaw and McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed. (2019) — Ch. 9 §9.2, printed p. 207 (PDF p. 233): number affected, intensity and duration of benefits and harms; conceptual background, not an adapted textbook question (*textbook*)
- [NPPE, published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/) — II.2 — Ethical Theories and Principles (*official-blueprint*)

**Metadata:** `nppe:set-1:learning:082`, version 1, family `utilitarian-comparison-not-beneficiary-headcount`; source review 2026-10-15. Editorial estimate; not empirically calibrated; independent SME/legal and psychometric validation pending.

---

## NPPE-083 — II.3

**Learning objective:** Keep a public professional endorsement within the scope of the evidence and work actually performed.

**Jurisdiction and assumptions:** Canada; national ethical guidance is advisory and applicable regulator requirements also apply. The engineer has authority to correct the proposed endorsement.

An engineer tests the energy consumption of one pump model under specified conditions. The manufacturer asks permission to publish the engineer's name beside the claim, "The entire pumping installation is professionally verified for every operating condition." The engineer has not reviewed the installation or its protection systems. What is the most appropriate response?

A. Approve the claim if the manufacturer adds a general disclaimer about changes in operating conditions.
B. Withhold approval of that claim and limit any authorized statement to the results actually supported.
C. Approve the claim after charging a separate endorsement fee to recognize the additional responsibility.
D. Allow the claim in advertising, while reserving the narrower test conditions for the technical report.

**Correct answer: B.**

**Reasoning for all four options:**

- **A:** A general disclaimer does not cure the unsupported statement that the entire installation has been professionally verified.
- **B — correct:** The proposed claim exceeds both the work and the evidence. A professional statement must accurately reflect the verified scope and conditions.
- **C:** Charging for an endorsement supplies neither the missing assessment nor an evidentiary basis for the broad claim.
- **D:** Advertising is still public communication. A narrower report does not make a knowingly misleading endorsement acceptable.

**Transfer principle:** Professional statements must accurately represent the work performed and the evidence supporting the claim.

**Common misconception:** Treating marketing language or a disclaimer as permission to extend a limited test into whole-system approval.

**Evidence and authority:**

- [Engineers Canada, Guideline on the code of ethics](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics) — Principles 4 and 5: precise, supported representations of fact and truthful public statements; advisory national guidance (*national-nonbinding-guidance*)
- [NPPE, published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/) — II.3 — Codes of Ethics of Professional Engineers and Geoscientists in Canada (*official-blueprint*)

**Metadata:** `nppe:set-1:learning:083`, version 1, family `limited-test-results-misleading-whole-system-endorsement`; source review 2026-10-15. Editorial estimate; not empirically calibrated; independent SME/legal and psychometric validation pending.

---

## NPPE-084 — III.1

**Learning objective:** Coordinate discipline interfaces without pretending that one engineer assumes every specialist responsibility.

**Jurisdiction and assumptions:** Ontario project; competent mechanical and structural supervising engineers are assigned, and the question concerns coordination rather than a statutory inspection.

A coordinating engineer reviews a process-skid package. The mechanical team has revised the equipment loads, but the structural team's support design uses the earlier loads. Each team has checked its own calculations against its own input sheet. The package is due for release. What should the coordinating engineer do?

A. Release the package once both disciplines seal their sheets, leaving input differences to the installer.
B. Replace the structural inputs personally and accept both disciplines' design responsibility to meet the release date.
C. Have the responsible disciplines reconcile the interface and document their checks before releasing the package.
D. Append both input sheets and release the package so the client can choose which load set governs.

**Correct answer: C.**

**Reasoning for all four options:**

- **A:** Separate checks and seals do not resolve inconsistent interface assumptions. Coordination must address the mismatch before reliance on the combined package.
- **B:** Coordination is not automatic competence or authority to redesign both disciplines. The appropriate supervising professionals must resolve their respective work.
- **C — correct:** The coordinator should obtain a consistent interface, with the relevant professionals verifying their own work and recording responsibilities and coordination.
- **D:** Passing an unresolved technical inconsistency to the client does not produce a coordinated design or establish which inputs are safe to use.

**Transfer principle:** A multidisciplinary design needs compatible interfaces and documented discipline responsibilities, not merely separately checked sheets.

**Common misconception:** Assuming that individually checked discipline packages necessarily form a coherent combined design.

**Evidence and authority:**

- [PEO, Assuming Responsibility and Supervising Engineering Work Guideline](https://www.peo.on.ca/sites/default/files/2019-10/Assumingresponsibilityandsupervisingengineeringworkguideline.pdf) — §5.3, printed p. 5: multidisciplinary coordination, identified supervising engineers and documented responsibilities (*regulator-guidance-ontario*)
- [Engineers Canada, Guideline on the code of ethics](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics) — Principles 2 and 8: competent practice and responsibility for professional work; advisory national guidance (*national-nonbinding-guidance*)
- [NPPE, published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/) — III.1 — Professional Accountability for Work, Workplace Issues, Job Responsibilities, and Standards of Practice (*official-blueprint*)

**Metadata:** `nppe:set-1:learning:084`, version 1, family `multidisciplinary-interface-load-coordination-responsibilities`; source review 2026-10-15. Editorial estimate; not empirically calibrated; independent SME/legal and psychometric validation pending.

---

## NPPE-085 — III.7

**Learning objective:** Separate removal of a former worker's authorization from retention of project records and audit history.

**Jurisdiction and assumptions:** Canada; the engineer coordinates with authorized IT staff. The departing employee has no continuing assignment or approved access need.

A design employee leaves a consulting firm after completing the handover. Their cloud account still allows editing of client drawings. A manager suggests leaving the account active because the project files and edit history must be retained. What is the best response?

A. Disable the former employee's access while preserving the project records and attributable history.
B. Keep the login active and ask the former employee to promise not to open project files.
C. Give the former employee's login to the replacement designer so the ownership labels remain unchanged.
D. Remove every file touched by the employee, ensuring that the obsolete login has nothing to access.

**Correct answer: A.**

**Reasoning for all four options:**

- **A — correct:** Access authorization and record retention are separate controls. Authorized staff can preserve the records and history while revoking the former employee's access.
- **B:** A promise does not remove unnecessary access or the risk of compromised credentials being used to reach client information.
- **C:** Reusing another person's credentials undermines individual accountability and can misattribute later actions to the former employee.
- **D:** Deleting project evidence is not an appropriate substitute for disabling access and would conflict with legitimate retention and continuity needs.

**Transfer principle:** Retain necessary engineering records without retaining unnecessary user access.

**Common misconception:** Confusing preservation of a person's project history with preservation of their login privileges.

**Evidence and authority:**

- Andrews, Shaw and McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed. (2019) — Ch. 7 §7.5, printed p. 168 (PDF p. 194): unauthorized intrusion, data loss and recovery planning; background (*textbook*)
- [Canadian Centre for Cyber Security, Cross-Sector Cyber Security Readiness Goals Toolkit](https://www.cyber.gc.ca/en/cyber-security-readiness/cross-sector-cyber-security-readiness-goals-toolkit) — Goal 2.3: revoke credentials and disable accounts/access for departing employees; security guidance, not an engineering statute (*primary-government-guidance*)
- [NPPE, published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/) — III.7 — Use of Software, Computers and Internet-based Tools; Liability for Software Errors (*official-blueprint*)

**Metadata:** `nppe:set-1:learning:085`, version 1, family `departing-staff-access-revocation-versus-record-preservation`; source review 2026-10-15. Editorial estimate; not empirically calibrated; independent SME/legal and psychometric validation pending.

---

## NPPE-086 — III.10

**Learning objective:** Use feedback to verify understanding when communicating an operationally important technical instruction.

**Jurisdiction and assumptions:** Canada; the revised instruction has been technically authorized. The task is to communicate it accurately to the incoming shift.

An engineer sends an authorized operating-limit change to a plant's incoming shift. The email system records delivery. During the handover, the incoming supervisor repeats the old limit and says the message was understood. Before the revised procedure is used, what is the most useful next communication step?

A. File the delivery receipt as confirmation that the shift has correctly understood the revised limit.
B. Forward the identical email to more recipients and assume the additional distribution resolves the misunderstanding.
C. Ask whether the message was received and accept another yes as confirmation of the technical details.
D. Clarify the difference, ask for the correct instruction to be repeated, and record the agreed handover.

**Correct answer: D.**

**Reasoning for all four options:**

- **A:** Delivery proves that a message reached an address, not that the recipient correctly understood its technical meaning.
- **B:** A larger distribution list does not resolve the specific misunderstanding already demonstrated by the incoming supervisor.
- **C:** A yes/no receipt question does not test which operating limit the supervisor intends to apply.
- **D — correct:** A clear explanation followed by a specific read-back checks understanding, while a documented handover supports consistent implementation.

**Transfer principle:** Effective technical communication includes checking the receiver's understanding, especially when an error has already surfaced.

**Common misconception:** Treating a delivery receipt or a general acknowledgement as evidence of correct understanding.

**Evidence and authority:**

- [Engineers Canada, Guideline on the code of ethics](https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics) — Principles 2 and 4: clear communication of assignments and precise professional statements; the read-back is a practical application, not a prescribed universal legal protocol (*national-nonbinding-guidance*)
- [NPPE, published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/) — III.10 — Communication (*official-blueprint*)

**Metadata:** `nppe:set-1:learning:086`, version 1, family `technical-handover-readback-confirms-understanding`; source review 2026-10-15. Editorial estimate; not empirically calibrated; independent SME/legal and psychometric validation pending.

---

## NPPE-087 — IV.4

**Learning objective:** Apply the distinction between a Québec client's right to resiliate a service contract and the financial consequences of doing so.

**Jurisdiction and assumptions:** Québec Civil Code contract for services; assume the client has not waived article 2125 and no contractual modification or special statutory regime changes the stated rule.

A Québec client cancels a proposed facility for budget reasons after its engineering consultant has begun a contract for services. The consultant has performed competently. Assume the Civil Code rules apply without contractual modification, including the client's right to resiliate the contract. Which statement best describes the client's position?

A. The client must first prove defective engineering work before it can bring the service contract to an end.
B. The client can end the contract only if a court grants permission after considering the budget change.
C. The client may end the contract unilaterally, with applicable payment obligations for work and expenses remaining.
D. The client must obtain the consultant's agreement because performance has already begun under the contract.

**Correct answer: C.**

**Reasoning for all four options:**

- **A:** Article 2125 does not make a service provider's default a prerequisite to the client's unilateral right on the stated assumptions.
- **B:** A prior court order is not a condition of the client's article 2125 right; a dispute about consequences can still arise afterward.
- **C — correct:** Article 2125 permits unilateral resiliation even after performance begins. Article 2129 addresses resulting obligations, including applicable expenses and work already performed; the question does not calculate a final settlement.
- **D:** Beginning performance does not itself extinguish the client's statutory right. The stem expressly excludes a waiver or modifying term.

**Transfer principle:** Ending a Québec service contract and settling the resulting financial obligations are distinct issues.

**Common misconception:** Assuming a client needs consultant fault or consent to exercise the unwaived statutory right after work starts.

**Evidence and authority:**

- [Civil Code of Québec](https://www.legisquebec.gouv.qc.ca/en/document/cs/CCQ-1991) — Articles 2125 and 2129: unilateral client resiliation and resulting obligations; article 2125 official indexed text and current OIQ guidance checked (*primary-legislation-quebec*). **Verification note:** Full consolidated HTML retrieval was unavailable; the official indexed article and current OIQ explanation independently support the tested rule. No exact damages calculation is asserted.
- [Ordre des ingénieurs du Québec, Contrat de service](https://gpp.oiq.qc.ca/Contrat_de_service.htm) — Droit de résiliation: unilateral client termination after work starts, with payment obligations for work and expenses (*regulator-guidance-quebec*)
- [NPPE, published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/) — IV.4 — Civil Law in Quebec (*official-blueprint*)

**Metadata:** `nppe:set-1:learning:087`, version 1, family `quebec-client-resiliation-services-work-already-started`; source review 2026-10-15. Editorial estimate; not empirically calibrated; independent SME/legal and psychometric validation pending.

---

## NPPE-088 — IV.5

**Learning objective:** Distinguish Ontario statutory minimum termination entitlements from possible common-law reasonable-notice rights.

**Jurisdiction and assumptions:** Ontario, provincially regulated non-union employment of indefinite duration; dismissal without cause, ESA coverage, and no enforceable term displacing common-law reasonable notice are assumed.

An Ontario engineering employer dismisses a non-union, indefinite-term employee without cause. The employment is provincially regulated, and the employer pays the applicable Employment Standards Act minimum termination entitlements. There is no enforceable contractual provision limiting common-law notice. The manager says that meeting the statutory minimum conclusively eliminates any further notice-related claim. Which response is most accurate?

A. The statutory payment conclusively settles notice rights because legislation replaces the employment contract.
B. The statutory minimum may not satisfy common-law reasonable notice, which requires a separate assessment.
C. The employee becomes entitled to a fixed additional month of notice for each completed year of service.
D. Any further notice right depends on the employee proving that the employer acted with personal malice.

**Correct answer: B.**

**Reasoning for all four options:**

- **A:** The ESA establishes minimum standards; compliance does not necessarily exhaust a distinct contractual or common-law notice entitlement.
- **B — correct:** On the stated assumptions, common-law reasonable notice must be assessed separately. The applicable facts may support an entitlement greater than the statutory floor.
- **C:** There is no universal one-month-per-year formula. Reasonable notice depends on the circumstances, including relevant employment and re-employment factors.
- **D:** An ordinary claim for inadequate reasonable notice does not require personal malice. That is separate from questions about additional damages for particular misconduct.

**Transfer principle:** Statutory minimum termination entitlements are not automatically the full common-law notice entitlement.

**Common misconception:** Using the statutory floor as a universal ceiling or replacing an individual assessment with a fixed multiplier.

**Evidence and authority:**

- Samuels and Sanders, Practical Law of Architecture, Engineering, and Geoscience, Canadian ed. (2007) — Ch. 21 §21.1, printed pp. 235–236 (PDF pp. 257–258): implied employment terms and termination notice; historical context (*textbook*)
- [Ontario, Your guide to the Employment Standards Act: Termination of employment](https://www.ontario.ca/document/your-guide-employment-standards-act-0/termination-employment) — Wrongful dismissal / Rights greater than ESA notice: minimum statutory requirements may be exceeded by common-law rights; official indexed passage verified (*primary-government-guidance-ontario*)
- [Supreme Court of Canada, Honda Canada Inc. v. Keays, 2008 SCC 39](https://scc-csc.lexum.com/scc-csc/scc-csc/en/item/5667/index.do) — Paragraphs 28–29: reasonable notice is case-specific; relevant factors adopted from Machtinger. No fixed month-per-year rule. Official decision excerpt checked (*primary-court-decision*)
- [NPPE, published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/) — IV.5 — Business, Employment, and Labour Law (*official-blueprint*)

**Metadata:** `nppe:set-1:learning:088`, version 1, family `ontario-statutory-termination-minimum-versus-common-law-notice`; source review 2026-10-15. Editorial estimate; not empirically calibrated; independent SME/legal and psychometric validation pending.

---

## NPPE-089 — V.3

**Learning objective:** Recognize the Ontario statutory exception for work for which a licensed professional assumes responsibility without confusing it with independent licensure.

**Jurisdiction and assumptions:** Ontario Professional Engineers Act, s. 12(3)(b); the firm holds any required Certificate of Authorization, and the supervising P.Eng. is competent and authorized for the work.

An unlicensed engineering graduate prepares calculations in an Ontario consulting firm. A competent Ontario P.Eng. actively directs and reviews the work and assumes professional responsibility for the related engineering services. The firm holds the required authorization. The graduate neither uses the P.Eng. designation nor independently offers services. Which statement best describes this arrangement?

A. It is prohibited until the graduate obtains a personal licence, regardless of the supervising engineer's responsibility.
B. It authorizes the graduate to offer the same services independently once the supervising engineer has reviewed one project.
C. It requires the graduate to apply the supervising engineer's seal personally to show who prepared the calculations.
D. It can fall within the statutory responsibility exception without granting the graduate an independent licence.

**Correct answer: D.**

**Reasoning for all four options:**

- **A:** Section 12(3)(b) permits the stated exception where an appropriate licence holder assumes responsibility for the related engineering services.
- **B:** Responsibility assumed for these services does not grant a personal licence or permission to offer independent services on later assignments.
- **C:** The exception does not transfer control or use of the professional engineer's seal to the unlicensed graduate.
- **D — correct:** The stated arrangement can meet section 12(3)(b). Active supervision and real assumption of responsibility are not the same as independent licensure of the graduate.

**Transfer principle:** An applicable supervision/responsibility exception permits specified work; it does not confer independent practice or title rights.

**Common misconception:** Treating all unlicensed technical work as prohibited, or treating supervised work as a transferable personal licence.

**Evidence and authority:**

- [Ontario, Professional Engineers Act, R.S.O. 1990, c. P.28](https://www.ontario.ca/laws/statute/90p28) — Section 12(3)(b), responsibility exception; statutory wording verified in PEO's published guideline §4.3 (*primary-legislation-ontario*)
- [PEO, Assuming Responsibility and Supervising Engineering Work Guideline](https://www.peo.on.ca/sites/default/files/2019-10/Assumingresponsibilityandsupervisingengineeringworkguideline.pdf) — §4.3, printed p. 4: statutory responsibility exception; §§5.1–5.2, printed p. 5: active supervision and direction (*regulator-guidance-ontario*)
- [NPPE, published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/) — V.3 — Illegal Practice, Enforcement Against Unlicensed Practice, and Misuse of Title (*official-blueprint*)

**Metadata:** `nppe:set-1:learning:089`, version 1, family `ontario-unlicensed-work-under-responsibility-exception`; source review 2026-10-15. Editorial estimate; not empirically calibrated; independent SME/legal and psychometric validation pending.

---

## NPPE-090 — VI.1

**Learning objective:** Distinguish settlement between private parties from a regulator's public-interest review of a submitted complaint.

**Jurisdiction and assumptions:** British Columbia; a complaint about an EGBC registrant's professional conduct has already been submitted. No finding of misconduct has yet been made.

A client submits an EGBC complaint alleging that a registrant altered inspection records. The client and registrant later settle their payment dispute, and the client asks EGBC to withdraw the complaint. The registrant assumes the settlement requires the regulator to close the file. What is the most accurate explanation?

A. EGBC must review the submitted matter and may continue investigating despite the private settlement.
B. EGBC must close the file when the client confirms that the payment dispute has been resolved.
C. EGBC must record a finding of misconduct because settling the payment dispute amounts to an admission.
D. EGBC may consider the conduct only after a civil court has ruled on the altered inspection records.

**Correct answer: A.**

**Reasoning for all four options:**

- **A — correct:** EGBC states that submitted complaints cannot be withdrawn and must be reviewed to determine whether to investigate; resolution between the parties does not automatically end that public-interest process.
- **B:** Private resolution does not give the complainant control over whether EGBC continues its regulatory review or investigation.
- **C:** A settlement is not an automatic finding or admission of professional misconduct; the applicable regulatory process still determines the matter.
- **D:** The regulator does not generally require a prior civil judgment to assess alleged professional misconduct within its jurisdiction.

**Transfer principle:** A professional regulator's public-interest function is distinct from the parties' private settlement.

**Common misconception:** Assuming that the complainant can dispose of a submitted professional-conduct complaint by settling a payment dispute.

**Evidence and authority:**

- Andrews, Shaw and McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed. (2019) — Ch. 3 §3.4, printed pp. 61–63 (PDF pp. 87–89): investigation and discipline are regulatory functions; historical general context, not current BC procedural rules (*textbook*)
- [Engineers and Geoscientists BC, Submit a Complaint](https://www.egbc.ca/Complaints-Discipline/Complaints-Discipline/Submit-A-Complaint) — Before Making a Complaint Against a Registrant: complaints cannot be withdrawn; review is required and investigation may continue after private resolution (*regulator-requirement-bc*)
- [NPPE, published 2017 blueprint](https://www.nppexam.ca/en/preparation/blueprint/) — VI.1 — Discipline Procedures (*official-blueprint*)

**Metadata:** `nppe:set-1:learning:090`, version 1, family `bc-private-settlement-does-not-withdraw-regulatory-complaint`; source review 2026-10-15. Editorial estimate; not empirically calibrated; independent SME/legal and psychometric validation pending.
