# NPPE Learning Batch 7 — NPPE-111–120

Editorial/source review: 2026-10-15. Original ChatGPT Set 1 Learning content. PR #301 remains draft; no release authorization is implied.

## Scope and integration

Ten new items append to sixty unchanged Learning objects. Diagnostic 50, Mock D 110 and Mock E 110 remain separate and unchanged. Mock A–C remain unauthored. Learning now contains **70/120**, timed **96 minutes** (`ceil(70 × 150 / 110)`) or untimed study. Domain totals: **6 / 12 / 18 / 22 / 6 / 6**. One incorrect answer per domain produces **64/70, 91.43%**. Full review contains **280 option explanations**.

Keys: **B C A D C A D B C A** (A3/B2/C3/D2). One correct option is longest by characters; two uniquely shortest by words. No grammatical completion stems. Classifications: two easy/understanding, six medium/application, two medium/analysis. These are editorial estimates, not empirical calibration. Analysis items 114 and 115 require combining scope/process facts to identify an evidence gap.

## Item and duplicate audit

Screened against 330 earlier questions: Diagnostic 50, Learning 60, Mock D/E 220. Shared blueprint concepts are expected, but scenarios and decisive distinctions must differ. The automatic checks also reject identical normalized stems or question-family identifiers.

| Item | Blueprint | Distinction and related-content review |
|---|---|---|
| 111 | I.1 | Public reliance on specialist knowledge; differs from 031/501 credential/status identification. |
| 112 | II.3 | Observed damage versus untested causal inference; differs from 034 suppression of known uncertainty and 540/650 personal accusations about another expert. |
| 113 | II.4 | Confirmed binding court order, limited production; differs from 023 voluntary reuse of confidential data and 044 breach response. |
| 114 | III.3 | Technologist evidence versus engineering approval authority; differs from 016 incomplete data collection and 538 transferring engineering responsibility. |
| 115 | III.5 | Excluded operating process makes a bigger convenient sample insufficient; differs from 095 obsolete-template corrective action and 656 calibration failure. |
| 116 | III.10 | Visual hierarchy buries an accurate required action; differs from 104 readability-score/user-comprehension validation. |
| 117 | IV.13 | All-breach records versus risk-triggered notification; differs from 057 consent for secondary marketing. |
| 118 | IV.7 | Domestic grace provision does not preserve all foreign rights; differs from 683 patent term and first-sale misconception. |
| 119 | V.2 | Ongoing firm registration arrangements after Responsible Registrant departure; differs from 069/696 initial permit requirements. |
| 120 | VI.1 | Valid consent disposition has legal effect without contested hearing; differs from 090 private settlement and 110 interim protection without final disposition. |

Rejected a private-settlement/complaint-withdrawal proposal because 090 already tests it. Replaced the initial compensation-versus-discipline draft because Mock D 592 already uses substantially that scenario. Also replaced an interface-gap draft that was too close to Learning 084’s multidisciplinary coordination scenario. Mock D/E were only read, never edited.

## Source verification and qualifications

The official NPPE page continues to label the 2017 blueprint current, with a projected mid-2026 revision still described as forthcoming. The project uses the published blueprint, not the projected date. National Engineers Canada guidance is advisory and is not represented as provincial legislation.

- 111–112: read Engineers Canada’s current ethics guidance, including accountability and Principle 4’s fact/assumption/opinion distinction.
- 113: directly read Justice Laws PIPEDA s. 7(3)(c). The existence, validity and scope of the binding order are stipulated; this does not assert every informal request overrides confidentiality.
- 114: directly read Engineers Canada’s direct-supervision guidance. The question separates a qualified technologist’s factual contribution from professional reassessment and approval; it does not transfer engineering responsibility.
- 115: directly read Statistics Canada’s survey design/coverage guidance. The statistical principle is applied by analogy to engineering quality evidence, not attributed to an engineering acceptance-sampling code. Retained the supplied ordinary Andrews textbook’s quality-management conceptual reference already verified in Batch 5; no claim of a fresh textbook page inspection or a textbook sampling rule.
- 116: directly read CCOHS information-design guidance; application differs from Batch 6’s readability test.
- 117: directly read PIPEDA ss. 10.1 and 10.3 and Breach of Security Safeguards Regulations s. 6. PIPEDA applicability and absence of significant-harm risk are explicit assumptions. The statutory record period is 24 months after determining the breach; other regimes are outside the scenario.
- 118: directly read Patent Act s. 28.2 and CIPO’s foreign-disclosure guidance. No universal foreign grace period, guaranteed patent or blanket Canadian safe harbour is asserted.
- 119: directly read EGBC Firm Practice FAQs, question 7. The response follows the regulator’s immediate-replacement/contact instruction, not an invented automatic cancellation deadline or an assumption that an unlicensed officer can substitute.
- 120: directly read BC Professional Governance Act s. 73(1)–(5), especially subsection (4), and EGBC’s voluntary-resolution explanation. A valid existing order is stipulated; rejected proposals and future variations are not tested.

Justice Laws consolidations displayed current to 2026-09-21; BC Laws to 2026-10-06. Read on 2026-10-15. The initially considered Ontario regulation page and a Statistics Canada education page could not be retrieved; neither is cited as verified authority for a final item. The retained Statistics Canada page was read successfully. No publisher instructor bank, recalled exam question or textbook scenario was used.

## QA record and release boundaries

Integration checks cover strict append order, object preservation, idempotence, rejection of corrupt predecessor metadata and conflicting reimports, source metadata, answer-position/length cues, all-bank scoring and explanations, independent bank selection, and exclusion from public assets and unrelated packages. Existing package-size ceiling remains unchanged.

The first focused run found a new test expectation rounded 64/70 incorrectly to 91%. Corrected it to the runtime’s accurate 91.43%, retaining exact-score and domain assertions. No runtime scoring defect was found. Exact-head CI then exposed a WebKit dark-to-light timing race in the existing homepage certification audit: the card background had reached the light palette while its heading still returned dark ink. Added auto-retrying assertions for every card heading’s final theme colour before sampling contrast. All existing 4.5:1 per-card checks remain unchanged; no sleep, skip, threshold reduction or application-style change was introduced. The complete browser workflow must pass on the corrective commit. Local regression and exact-head GitHub results are reported in PR #301; do not interpret a historical run as validation of a later commit.

Browser tests cover both engines, 320/390/1440px and both themes, timed reveal denial, untimed assisted locking, keyboard navigation, flags, persistence, all 70 questions, 280 rationales, overflow and accessibility scans. Passing automation does not establish exhaustive manual WCAG certification. Independent engineering/legal SME review, empirical calibration and live production-account verification remain separate release gates. No NPPE pass guarantee, production access grant, migration, merge or deployment is authorized.

## Reviewer copy

### NPPE-111 — I.1

**Objective:** Explain why specialist knowledge carries obligations beyond satisfying a purchaser.

**Jurisdiction/assumptions:** Canada; general characteristics of a regulated profession, not a claim that every technical service is reserved practice.

**Provisional:** easy / understanding. **Family:** `specialist-knowledge-public-trust-information-asymmetry`.

A community hires an engineer for an assessment that residents lack the technical knowledge to verify themselves. At an orientation, a trainee asks why professional obligations extend beyond delivering whatever the paying customer requests. Which explanation best addresses this situation?

A. The fee transfers responsibility for the technical judgment to the customer who selected the service provider.

B. The knowledge gap creates reliance on professional judgment, supporting duties of competence, integrity and public service.

C. The knowledge gap entitles the professional to withhold the reasons for conclusions whenever a customer asks questions.

D. The professional designation assures residents that the assessment cannot contain uncertainty or require later revision.

**Correct: B.**

- **A:** Payment does not transfer the professional’s responsibilities for their judgment to a customer unable to verify it.
- **B:** Public reliance on specialized knowledge helps explain the profession’s obligations of trustworthy service.
- **C:** Specialized expertise does not justify refusing to explain conclusions and material limitations to those relying on them.
- **D:** Professional status does not eliminate uncertainty, error or the need to revise conclusions when evidence changes.

**Key point:** Expertise entrusted by the public brings responsibilities as well as professional standing.

**Common error:** Treating expertise as a privilege without corresponding obligations.

**Sources:**

- Engineers Canada, Guideline on the code of ethics — Section 3: careful, diligent practice and accountability for actions (national-nonbinding-guidance). https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics
- NPPE, published 2017 blueprint — I.1 — Definition and Interpretation of Professionalism and Professional Status (official-blueprint). https://www.nppexam.ca/en/preparation/blueprint/

### NPPE-112 — II.3

**Objective:** Distinguish an observation from an unsupported causal conclusion in professional communication.

**Jurisdiction/assumptions:** Canada; applying national ethical guidance. The engineer has consent to discuss the observations, but no evidence establishing the cause.

**Provisional:** medium / application. **Family:** `public-opinion-separate-observed-fact-from-inferred-cause`.

An engineer observes cracks in several panels and is authorized to discuss the observations publicly. No investigation of the cause has been completed. A draft interview statement says, "The cracks prove the contractor used inferior materials." Which revision best meets the professional obligation to distinguish fact from opinion?

A. Keep the causal statement but introduce it with the professional designation so readers understand its authority.

B. Keep the causal statement but attribute it to an unnamed colleague who also saw photographs of the cracks.

C. Report the observed cracks and explain that their cause remains unconfirmed pending an appropriate investigation.

D. Remove the observed cracks and discuss only the contractor’s reputation, which can stand in for technical evidence.

**Correct: C.**

- **A:** A professional designation does not turn an untested causal inference into an established technical fact.
- **B:** Attribution to another person does not supply the missing evidence needed to support the causal assertion.
- **C:** This preserves the verified observation while clearly identifying the limit of the available causal evidence.
- **D:** Reputation is not evidence establishing the cause, and suppressing the observation does not improve accuracy.

**Key point:** Identify what was observed separately from what is inferred.

**Common error:** Presenting a possible cause as a proved fact.

**Sources:**

- Engineers Canada, Guideline on the code of ethics — Principle 4: distinguish fact, assumptions and opinion; national advisory guidance (national-nonbinding-guidance). https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics
- NPPE, published 2017 blueprint — II.3 — Codes of Ethics of Professional Engineers and Geoscientists in Canada (official-blueprint). https://www.nppexam.ca/en/preparation/blueprint/

### NPPE-113 — II.4

**Objective:** Reconcile confidentiality with a binding, properly scoped disclosure obligation.

**Jurisdiction/assumptions:** Ontario commercial consultancy; PIPEDA applies. Counsel has confirmed a valid court order requiring specified records, with no stay or applicable privilege. The order does not require unrelated files.

**Provisional:** medium / application. **Family:** `confidential-records-valid-court-order-limited-production`.

A consultancy holds confidential homeowner inspection records. Counsel confirms that a valid court order requires production of specified records by a stated date; no stay or privilege applies. The client asks the engineer to refuse because the engagement promised confidentiality. What is the best response?

A. Arrange compliant production of the specified records while protecting unrelated confidential information.

B. Refuse production until the client consents because a confidentiality promise overrides the confirmed court order.

C. Send the entire client archive because an order for some records removes confidentiality from all records.

D. Delete the specified records before the deadline because keeping them would create a risk of disclosure.

**Correct: A.**

- **A:** The confirmed order must be addressed; confidentiality still matters for information outside its required scope.
- **B:** Client consent is not a veto over the stated binding order; PIPEDA recognizes court-ordered disclosure without consent.
- **C:** The order’s limited scope does not authorize indiscriminate release of unrelated confidential records.
- **D:** Destroying required records evades the order and is not a proper way to protect the client’s confidentiality.

**Key point:** Confidentiality is important but must be reconciled with binding legal obligations.

**Common error:** Treating confidentiality as either absolute secrecy or permission for unlimited disclosure.

**Sources:**

- PIPEDA, SC 2000, c. 5 — Section 7(3)(c), disclosure to comply with a court order; consolidation current to 2026-09-21 (primary-legislation). https://laws-lois.justice.gc.ca/eng/acts/P-8.6/page-1.html
- NPPE, published 2017 blueprint — II.4 — Common Ethical Issues and Dilemmas; Making Ethical Decisions (official-blueprint). https://www.nppexam.ca/en/preparation/blueprint/

### NPPE-114 — III.3

**Objective:** Use a technologist’s relevant observations while keeping engineering decisions with the responsible professional.

**Jurisdiction/assumptions:** Canada; a qualified field technologist provides reliable observations within the assigned role. The responsible engineer remains accountable for reassessing the engineering conclusions.

**Provisional:** medium / analysis. **Family:** `technologist-field-evidence-versus-professional-decision-authority`.

A field technologist documents that installed supports differ from the arrangement assumed in an engineer’s otherwise correctly calculated load assessment. The engineer confirms the photographs identify the correct equipment. A manager says to ignore the finding because the technologist is not licensed to approve an engineering design. Which response best separates the roles?

A. Keep the assessment unchanged because only a licensed designer can provide evidence relevant to its assumptions.

B. Ask the technologist to approve the revised load capacity because finding the discrepancy transfers design responsibility.

C. Invalidate every calculation in the assessment because a reliable field observation proves the arithmetic was wrong.

D. Use the observations to reassess the support assumptions while retaining professional responsibility for the conclusions.

**Correct: D.**

- **A:** A technologist can provide relevant field evidence within their role; lack of design-approval authority does not erase it.
- **B:** Identifying a discrepancy does not itself transfer responsibility for engineering reassessment or approval to the observer.
- **C:** The evidence challenges the assumed support arrangement, not necessarily the arithmetic performed for that arrangement.
- **D:** This respects the technologist’s contribution and the engineer’s separate responsibility to assess its design implications.

**Key point:** Distinguish the authority to provide relevant evidence from the responsibility to approve engineering conclusions.

**Common error:** Dismissing reliable technical input solely because its contributor does not hold the final approval role.

**Sources:**

- Engineers Canada, Public guideline: Direct supervision — Roles of subordinates and supervising engineers: assigned technical work, communication and professional responsibility; advisory guidance (national-nonbinding-guidance). https://engineerscanada.ca/guidelines-and-papers/public-guideline-direct-supervision
- NPPE, published 2017 blueprint — III.3 — Relations with Other Professionals and Non-Professionals; Business Practices (official-blueprint). https://www.nppexam.ca/en/preparation/blueprint/

### NPPE-115 — III.5

**Objective:** Assess whether evidence supports a quality conclusion about an entire operation.

**Jurisdiction/assumptions:** Canada; a fictional quality review, with no prescribed acceptance-sampling standard or numerical confidence level assumed.

**Provisional:** medium / analysis. **Family:** `quality-evidence-selection-bias-excluded-operating-shift`.

A quality review aims to assess installation errors across both day and night shifts. The team inspects 200 easily accessible day-shift installations and finds no errors. Records show the night shift uses a different installation process, but none of its work was inspected. A manager proposes doubling the day-shift sample to justify a conclusion about both shifts. Which assessment is best?

A. The larger day-shift sample will eliminate the missing night-shift evidence because sample size controls all bias.

B. The two processes can be treated as equivalent because the sampled day-shift installations contain no errors.

C. The coverage gap remains; assess the night-shift work through a suitable plan before extending the conclusion.

D. The absence of night-shift inspections proves its installations are defective, so no further evidence is needed.

**Correct: C.**

- **A:** More observations from the same restricted group do not automatically correct exclusion of a different process.
- **B:** The day-shift results do not establish the performance of a distinct, unobserved night-shift process.
- **C:** The conclusion must match the evidence’s coverage; an appropriate plan should address the omitted group.
- **D:** Missing evidence limits a conclusion but does not itself prove that the unobserved installations are defective.

**Key point:** Examine how evidence was selected before generalizing a favourable quality result.

**Common error:** Equating sample size with coverage and representativeness.

**Sources:**

- Statistics Canada, Questions to ask about surveys — Target population, selection and coverage errors; applied by analogy to quality evidence, not an engineering acceptance standard (government-statistical-guidance). https://www.statcan.gc.ca/en/customized-products-services/custom-surveys/questions-to-ask
- Andrews, Shaw and McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed. (2019) — Ch. 4, printed p. 91 (PDF p. 117): quality management as an organizational process; conceptual reference preserved from the Batch 5 source review, not a sampling rule (textbook)
- NPPE, published 2017 blueprint — III.5 — Risk Management, Insurance, Quality Management and Due Diligence (official-blueprint). https://www.nppexam.ca/en/preparation/blueprint/

### NPPE-116 — III.10

**Objective:** Choose a document structure that makes the required safety action readily findable.

**Jurisdiction/assumptions:** Canada; the technical content is accurate and authorized. This question concerns presentation, not alteration of a technical requirement.

**Provisional:** medium / application. **Family:** `safety-message-visual-hierarchy-buries-required-action`.

An engineer prepares a one-page notice for operators about a newly identified equipment hazard. The first four paragraphs describe the investigation history; the instruction to stop using the affected mode until a safeguard is fitted appears in a small footnote. Operators must act on the notice before their next shift. Which revision best improves communication?

A. Put the affected mode and required action first, then give the supporting explanation in a clear hierarchy.

B. Keep the action in the footnote and shorten the investigation history by removing the equipment identifier.

C. Keep the existing order and add technical acronyms to reduce the space used by the required instruction.

D. Replace the required instruction with a general reminder to be careful, leaving operators to infer the action.

**Correct: A.**

- **A:** The reader can find the necessary action quickly while retaining access to the reasons and relevant context.
- **B:** Removing the identifier makes application harder and leaves the required action in an easily missed location.
- **C:** Additional acronyms do not resolve the buried instruction and can make a time-sensitive message less accessible.
- **D:** A general caution does not convey the specific restriction that operators need to follow before the next shift.

**Key point:** Organize safety information around what the intended reader must do.

**Common error:** Assuming accurate wording is enough when critical information is visually buried.

**Sources:**

- CCOHS, Hazard Communication — Using Plain (Clear) Language — Present important information first; logical organization and information design; revised 2025-03-27 (government-safety-guidance). https://www.ccohs.ca/oshanswers/hsprograms/plain_language.html
- NPPE, published 2017 blueprint — III.10 — Communication (official-blueprint). https://www.nppexam.ca/en/preparation/blueprint/

### NPPE-117 — IV.13

**Objective:** Distinguish breach record-keeping from risk-triggered reporting and notification.

**Jurisdiction/assumptions:** Ontario private consultancy; PIPEDA governs the affected personal information. A breach of security safeguards has occurred and the assessment reasonably finds no real risk of significant harm. No other reporting regime is assumed.

**Provisional:** medium / application. **Family:** `pipeda-all-breach-records-below-notification-threshold`.

An Ontario consultancy determines that a breach of security safeguards affected personal information under its control. Its documented assessment reasonably concludes that the breach creates no real risk of significant harm. Under PIPEDA, which statement best describes its breach-record obligation?

A. It may omit the record because the risk assessment does not trigger reporting to the Privacy Commissioner.

B. It needs a record only if an affected individual later complains about the incident to the consultancy.

C. It must publish all affected personal information to create the required public record of the incident.

D. It must retain a breach record even though the assessed risk does not trigger reporting and notification.

**Correct: D.**

- **A:** The threshold for reporting does not remove the separate duty to maintain a record of every safeguards breach.
- **B:** The record obligation arises from the breach, not from whether an affected individual makes a complaint.
- **C:** The duty is to keep a compliance record, not to publish the affected people’s information to the public.
- **D:** PIPEDA separates all-breach record-keeping from the significant-harm threshold for reporting and notification.

**Key point:** A breach below the reporting threshold still requires a compliance record.

**Common error:** Applying the notification threshold to every privacy obligation.

**Sources:**

- PIPEDA, SC 2000, c. 5 — Sections 10.1(1), 10.1(3) and 10.3; consolidation current to 2026-09-21 (primary-legislation). https://laws-lois.justice.gc.ca/eng/acts/P-8.6/page-3.html
- Breach of Security Safeguards Regulations, SOR/2018-64 — Section 6: records maintained for 24 months after determination, with information enabling compliance verification (primary-regulation). https://laws-lois.justice.gc.ca/eng/regulations/SOR-2018-64/FullText.html
- NPPE, published 2017 blueprint — IV.13 — Human Rights and Privacy Legislation (official-blueprint). https://www.nppexam.ca/en/preparation/blueprint/

### NPPE-118 — IV.7

**Objective:** Recognize why a Canadian disclosure grace provision does not secure foreign patent rights.

**Jurisdiction/assumptions:** Canada and possible foreign filings; the invention has not been disclosed or filed. No specific foreign grace period or entitlement to a patent is assumed.

**Provisional:** medium / application. **Family:** `canadian-patent-grace-not-global-disclosure-permission`.

A Canadian engineering startup plans to publish detailed drawings of an unfiled invention at an unrestricted online launch. It wants patent protection in several countries. A manager says Canada’s provisions for certain applicant-originated disclosures mean it can safely publish first and decide on foreign filings later. What is the best response?

A. Proceed because a Canadian disclosure exception automatically applies to patent applications in every foreign market.

B. Obtain patent advice before disclosure; a Canadian grace provision does not preserve rights in every target country.

C. Proceed because displaying a copyright notice on the drawings preserves patent novelty in all intended markets.

D. Proceed if the launch has no admission charge because a free public disclosure does not affect patent novelty.

**Correct: B.**

- **A:** Canadian statutory treatment of disclosure does not control the novelty rules of every other jurisdiction.
- **B:** Foreign protection may be lost through early public disclosure; advice and filing strategy should precede the launch.
- **C:** Copyright in drawings and patent protection for an invention are distinct; a copyright notice does not preserve novelty.
- **D:** Public availability matters to disclosure; whether viewers paid to attend does not resolve the novelty issue.

**Key point:** Plan disclosure and filing together when protection is sought in multiple countries.

**Common error:** Treating a domestic grace provision as a worldwide safe harbour.

**Sources:**

- Patent Act, RSC 1985, c. P-4 — Section 28.2(1)(a)–(b), Canadian novelty/disclosure rules; consolidation current to 2026-09-21 (primary-legislation). https://laws-lois.justice.gc.ca/eng/acts/P-4/section-28.2.html
- CIPO, Protect IP outside Canada: 2. Minimize disclosure — Pre-filing public disclosure may prevent foreign protection; assess disclosure timing (government-ip-guidance). https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en/protect-ip-outside-canada-2-minimize-disclosure
- NPPE, published 2017 blueprint — IV.7 — Intellectual Property (official-blueprint). https://www.nppexam.ca/en/preparation/blueprint/

### NPPE-119 — V.2

**Objective:** Respond to the loss of a firm’s sole Responsible Registrant.

**Jurisdiction/assumptions:** British Columbia; an EGBC registrant firm has one Responsible Registrant. That person has ceased fulfilling the role. No replacement or special arrangement has been approved.

**Provisional:** medium / application. **Family:** `bc-firm-responsible-registrant-departure-replacement`.

A BC engineering firm’s sole Responsible Registrant leaves and no longer fulfils that role. Management proposes leaving the former registrant’s name on file until annual renewal because the firm has paid its permit fee. Which response best follows EGBC’s firm-practice guidance?

A. Wait until renewal because payment of the annual permit fee preserves the former registrant’s responsibility.

B. List any available company officer as the replacement even if that officer lacks the required professional registration.

C. Identify a replacement immediately and contact EGBC if none is available, rather than defer the gap until renewal.

D. Keep using the former registrant’s name because previous employment makes that person responsible until the permit expires.

**Correct: C.**

- **A:** A paid permit fee does not resolve the loss of the person fulfilling the Responsible Registrant role.
- **B:** The Responsible Officer and Responsible Registrant are different roles; an unqualified officer cannot simply substitute.
- **C:** EGBC directs firms to identify a replacement promptly to avoid a practice-prohibiting condition and contact it if unavailable.
- **D:** A person who has ceased fulfilling the role cannot be treated as the current Responsible Registrant merely by retaining a name.

**Key point:** Firm registration requires maintained responsibility arrangements, not only fee payment.

**Common error:** Treating annual renewal as the only time to address a regulatory-role vacancy.

**Sources:**

- Engineers and Geoscientists BC, Firm Practice FAQs — Question 7, Responsible Registrant departure: immediately identify replacement; contact EGBC if unavailable (regulator-guidance-bc). https://www.egbc.ca/firms/firm-practice/firm-practice-overview/firm-practice-faqs?viewmode=0
- NPPE, published 2017 blueprint — V.2 — Admission to the Professions (official-blueprint). https://www.nppexam.ca/en/preparation/blueprint/

### NPPE-120 — VI.1

**Objective:** Recognize a valid consent order as a regulatory disposition without a contested hearing.

**Jurisdiction/assumptions:** British Columbia; a valid consent order has been made under Professional Governance Act s. 73, resolving the stated matters and imposing an agreed practice condition. No stay or later variation applies.

**Provisional:** easy / understanding. **Family:** `bc-consent-order-disposition-without-contested-hearing`.

A BC registrant accepts a valid regulatory consent order that resolves specified disciplinary matters and imposes a practice condition. A colleague says the condition is merely optional advice because no contested discipline hearing took place. Which explanation is correct?

A. A valid consent order can impose the agreed condition without a contested hearing; the registrant must comply.

B. The condition becomes effective only after the same matters are proved again at a contested discipline hearing.

C. The registrant can disregard the condition because consent makes regulatory obligations a matter of personal preference.

D. The condition applies only if the original complainant separately signs a private contract enforcing it against the registrant.

**Correct: A.**

- **A:** The Act provides for resolution by consent order; absence of a contested hearing does not make its condition optional.
- **B:** A valid consent disposition does not require the resolved matters to be proved again before its terms can operate.
- **C:** Choosing to resolve a matter by consent does not give the registrant permission to ignore the resulting valid order.
- **D:** The order operates through the regulatory framework, not through a separate private enforcement contract with the complainant.

**Key point:** Voluntary agreement to a regulatory disposition is distinct from optional compliance afterward.

**Common error:** Equating resolution without a contested hearing with non-binding guidance.

**Sources:**

- British Columbia, Professional Governance Act, SBC 2018, c. 47 — Section 73(1)–(5), consent orders, conditions and legal effect; consolidation current to 2026-10-06 (primary-legislation). https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/18047#section73
- Engineers and Geoscientists BC, Complaint Process — Stage 3: voluntary resolution through a consent agreement instead of a discipline hearing (regulator-guidance-bc). https://www.egbc.ca/Complaints-Discipline/Complaints-Discipline/Complaint-Process
- NPPE, published 2017 blueprint — VI.1 — Discipline Procedures (official-blueprint). https://www.nppexam.ca/en/preparation/blueprint/


## Additional browser navigation correction

The next WebKit student run passed 144/145 journeys but failed in PMP Set 2 focused untimed practice: after revealing and flagging question 2, a pointer navigation attempt left question 2 current, so the test subsequently tried to click its already-disabled reveal button. The failure screenshot confirmed the unchanged current navigation cell. The audit now activates the intended unanswered navigation control with focus/Enter and asserts `aria-current=step` plus an enabled Reveal button before proceeding. Existing pointer-navigation coverage elsewhere, assisted counts, answer locks, scores and review assertions remain intact. This is a targeted audit-input synchronization correction, not a claimed runtime defect fix. The full Chromium/WebKit suite is rerun on the corrective commit.
