/* Original Set 1 Mock A Batch 2. Protected delivery only; partial mock stays disabled. */
(function(global){
 'use strict';
 var questions=[
  {
    "blueprint": "II.3",
    "sub": "nppe-ethics",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-supervisor-addresses-sexist-project-chat",
    "learningObjective": "Apply equitable and dignified treatment to conduct within an engineering team.",
    "jurisdiction": "Canada; general professional ethics, not a finding of a statutory offence. The engineer supervises the team and can use an established workplace reporting process.",
    "stem": "An engineer supervising a project chat sees repeated sexually demeaning remarks directed at a junior team member, who has asked that they stop. The remarks continue, but the technical work remains on schedule. Which response best meets the supervisor’s professional responsibilities?",
    "options": [
      "Keep the chat unchanged while results remain satisfactory, and revisit the issue if project performance deteriorates.",
      "Remove the junior member from the project chat so the established team can continue communicating without interruption.",
      "Ask the junior member to resolve the situation alone, since a supervisor should intervene only after a formal complaint.",
      "Intervene to stop the conduct and use the workplace process to address it fairly and support the affected member."
    ],
    "answer": 3,
    "optionRationales": [
      "Satisfactory project performance does not excuse degrading treatment or remove a supervisor’s responsibility to respond.",
      "Excluding the targeted member shifts the burden to that person and can restrict participation without addressing the conduct.",
      "The supervisor has directly observed the continuing conduct; waiting for the targeted person to manage it alone is inadequate.",
      "A proportionate intervention and a fair workplace process support dignified treatment without pre-judging any formal investigation."
    ],
    "keyPoint": "Professional conduct includes equitable and dignified treatment within the team.",
    "trap": "Treating acceptable technical output as a reason to overlook degrading workplace conduct.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 7 and 12 and their interpretations: fairness, courtesy and dignified treatment",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "II.3 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "II.4",
    "sub": "nppe-ethics",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-lawful-withdrawal-incomplete-work-handover",
    "learningObjective": "Manage an authorized withdrawal without misrepresenting the status of unfinished work.",
    "jurisdiction": "Ontario; counsel has confirmed a lawful termination date and the required notice has been given. The client authorizes transfer to a competent successor; record-transfer rights are settled and there is no immediate safety emergency.",
    "stem": "After persistent non-payment, a consultant lawfully terminates an engagement on an agreed date. A successor is appointed and authorized to receive the file. Several design checks remain unfinished. The outgoing engineer is asked to send the folder with a note saying only “our work is complete.” What is the best response?",
    "options": [
      "Send the proposed note because reaching the termination date makes the unfinished checks the successor’s completed work.",
      "Identify the unfinished checks and document the authorized handover without representing the design as fully verified.",
      "Decline to state what remains unfinished because the overdue invoice suspends professional communication obligations.",
      "Describe the design as fully verified because the successor’s appointment supplies approval for the outgoing engineer’s work."
    ],
    "answer": 1,
    "optionRationales": [
      "Ending the engagement is different from completing technical verification; the proposed statement would misrepresent the file.",
      "A clear status record and handover let the successor identify what remains to be checked while respecting the lawful termination.",
      "The payment dispute does not justify misleading silence about the work status in the authorized handover described here.",
      "Appointment of a successor does not retroactively verify checks that the outgoing engineer has not completed."
    ],
    "keyPoint": "Distinguish completion of an engagement from completion of its technical work.",
    "trap": "Using a lawful termination as a reason to label unfinished work complete.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 2, 4 and 5: diligence, truthful statements and faithful agency",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "regulator-practice-guidance-on",
        "title": "PEO, Professional Engineering Practice (November 2020)",
        "locator": "Sections 10.2–10.3: service agreements, termination, written communication and clear responsibility when a project changes practitioners; legal entitlement to terminate is stipulated",
        "url": "https://www.peo.on.ca/sites/default/files/2020-12/PEPGuideline_Nov2020.pdf"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "II.4 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "III.5",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-qms-certification-not-specific-product-approval",
    "learningObjective": "Distinguish management-system certification from verification of a specific engineered product.",
    "jurisdiction": "Canada; a valid ISO 9001 certificate covers the supplier’s quality management system. No separate product certification or technical acceptance evidence is supplied; no particular edition or transition rule is tested.",
    "stem": "A supplier provides a valid ISO 9001 quality-management-system certificate with its quote for a lifting fixture. The buyer’s engineer has not received evidence that the fixture meets the specified loads. A manager proposes accepting the fixture because the certificate already proves its load capacity. Which response is most accurate?",
    "options": [
      "The certificate concerns the management system; the fixture still needs evidence of compliance with its technical requirements.",
      "The certificate establishes the fixture’s rated load because each product is individually approved during the system audit.",
      "The certificate transfers the buyer’s technical acceptance decision to ISO because ISO guarantees certified suppliers’ products.",
      "The certificate makes the specified loads optional because a certified supplier can substitute its own acceptance requirements."
    ],
    "answer": 0,
    "optionRationales": [
      "Certification of a quality management system does not itself demonstrate that this particular fixture meets its design requirements.",
      "A management-system audit is not individual product approval or a load-capacity verification for every supplied fixture.",
      "ISO develops standards and does not itself certify organizations or guarantee their products; the acceptance evidence remains necessary.",
      "Management-system certification does not remove the applicable technical requirements or authorize unilateral substitution of them."
    ],
    "keyPoint": "A quality-system certificate is not a substitute for product-specific technical evidence.",
    "trap": "Treating system certification as approval of every design output.",
    "sources": [
      {
        "sourceType": "standards-body-guidance",
        "title": "ISO, ISO 9001 explained",
        "locator": "Sections 1, 3 and 5: quality management systems, independent certification bodies and system audits; edition-neutral principle",
        "url": "https://www.iso.org/insights/iso-9001-explained"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "III.5 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "III.6",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-a-water-intensity-versus-absolute-withdrawal",
    "learningObjective": "Distinguish resource-use intensity from the total environmental load when production changes.",
    "jurisdiction": "Canada; a hypothetical plant with measured daily freshwater withdrawals and the same product and measurement boundary in both periods. No permit limit or legal compliance conclusion is assumed.",
    "stem": "A plant previously made 100 units per day using 10 m³ of freshwater per unit. It now makes 150 units per day using 8 m³ per unit. An environmental summary says, “The efficiency improvement reduced our total daily freshwater withdrawal.” Which revision best reflects the measurements?",
    "options": [
      "Keep the claim because lower withdrawal per unit establishes a reduction in total daily withdrawal regardless of output.",
      "State that both intensity and total withdrawal increased because the plant now produces more units each day.",
      "State that withdrawal per unit fell, while total daily withdrawal rose from 1,000 m³ to 1,200 m³.",
      "Remove the withdrawal figures because a change in production prevents any valid comparison of resource use."
    ],
    "answer": 2,
    "optionRationales": [
      "The intensity improved, but total withdrawal also depends on production; the increased output more than offsets the per-unit reduction.",
      "Total withdrawal increased, but the measured intensity fell from 10 to 8 m³ per unit; both measures must be distinguished.",
      "The totals are 100 × 10 = 1,000 and 150 × 8 = 1,200 m³ per day. Reporting both measures preserves the improvement and its limits.",
      "A change in production calls for reporting both absolute and normalized measures, not suppressing the available measurements."
    ],
    "keyPoint": "Improved resource intensity can coexist with an increased total environmental load.",
    "trap": "Using a per-unit improvement to claim an absolute reduction.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 4 and 11: accurate professional statements and reporting environmental consequences",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "government-environmental-statistics",
        "title": "Statistics Canada, Canadian System of Environmental–Economic Accounts (December 19, 2022)",
        "locator": "Industrial water use and water-use intensity are reported as distinct measures; historical statistics supply context, not this fictional plant’s data",
        "url": "https://www150.statcan.gc.ca/n1/daily-quotidien/221219/dq221219d-eng.htm"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "III.6 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "IV.2",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-reasonable-substitute-service-mitigation",
    "learningObjective": "Apply reasonable mitigation to a claim for losses following breach of contract.",
    "jurisdiction": "Ontario common law; breach and causal loss are established. The client seeks compensatory damages, not specific performance. A suitable substitute was available and affordable, and the defendant can prove which losses reasonable mitigation would have avoided.",
    "stem": "A testing consultant breaches its contract and cannot perform a scheduled test. A qualified replacement can perform the same test promptly at a reasonable additional cost. The client refuses solely to let delay losses accumulate, then claims those avoidable losses from the original consultant. Which principle most directly limits the claim?",
    "options": [
      "The client must accept any replacement offered, even if it is unqualified or creates unreasonable technical risks.",
      "The original breach makes every later loss recoverable, including losses the client deliberately lets accumulate.",
      "Obtaining a replacement would waive the original breach, preventing recovery of reasonable replacement costs.",
      "Compensation excludes losses proved avoidable through reasonable mitigation, while reasonable mitigation costs may be recoverable."
    ],
    "answer": 3,
    "optionRationales": [
      "Mitigation requires reasonable steps in the circumstances, not acceptance of an unsuitable or unreasonably risky substitute.",
      "A breach does not entitle the claimant to increase recoverable damages by unreasonably declining available mitigation.",
      "Reasonably obtaining substitute performance need not waive the breach; reasonable mitigation expenses may form part of damages.",
      "The defendant bears the mitigation burden. On the stipulated proof, avoidable loss is excluded; reasonable mitigation costs are treated differently."
    ],
    "keyPoint": "Reasonable mitigation limits compensatory loss without excusing the original breach.",
    "trap": "Assuming the innocent party may deliberately accumulate avoidable damages.",
    "sources": [
      {
        "sourceType": "primary-case-law",
        "title": "Supreme Court of Canada, Southcott Estates Inc. v. Toronto Catholic District School Board, 2012 SCC 51",
        "locator": "Paras. 24–25: reasonable mitigation, avoidable loss and defendant’s burden",
        "url": "https://decisions.scc-csc.ca/scc-csc/scc-csc/en/item/12612/index.do"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "IV.2 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "IV.3",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-a-ontario-ultimate-period-versus-discovery",
    "learningObjective": "Recognize that a discovery-based limitation period does not displace an applicable ultimate period.",
    "jurisdiction": "Ontario; an ordinary corporate negligence claim based on a single completed design act more than 16 years before proceedings. No continuing act, special statutory period, exception, suspension, extension or contractual variation preserves the claim, as confirmed by counsel.",
    "stem": "An Ontario company discovers a latent design defect six months before starting its negligence lawsuit. The single design act occurred more than 16 years before proceedings began. Counsel confirms that the ordinary ultimate limitation period applies and that no exception or adjustment preserves the claim. The company says recent discovery makes the lawsuit timely. Which statement is most accurate?",
    "options": [
      "Recent discovery starts a new ultimate period, so the age of the design act has no effect on timeliness.",
      "The applicable 15-year ultimate period can bar the claim even though discovery occurred only six months ago.",
      "An engineering seal removes the ultimate period, so only the date of discovery matters for a design claim.",
      "The ultimate period begins when the claimant obtains an expert report, even if the design act occurred much earlier."
    ],
    "answer": 1,
    "optionRationales": [
      "Discovery does not restart the ordinary ultimate period; section 15 operates even when another period has not expired.",
      "Ontario’s ordinary ultimate period runs from the relevant act or omission. The express assumptions remove qualifications that might otherwise preserve a claim.",
      "Sealing engineering work does not create the suggested exemption from the ultimate limitation period.",
      "An expert report is not the ordinary trigger for the ultimate period; it must not be confused with discovery-related issues."
    ],
    "keyPoint": "Check both discovery-based and ultimate limitation periods, with their applicable qualifications.",
    "trap": "Assuming recent discovery defeats every outside time limit.",
    "sources": [
      {
        "sourceType": "primary-legislation-on",
        "title": "Ontario, Limitations Act, 2002, S.O. 2002, c. 24, Sched. B",
        "locator": "Sections 4–5 and 15(1)–(2), subject to statutory qualifications",
        "url": "https://www.ontario.ca/laws/statute/02l24"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "IV.3 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "IV.13",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-outsourced-personal-data-continuing-accountability",
    "learningObjective": "Apply continuing accountability when personal information is transferred for processing.",
    "jurisdiction": "Canada; PIPEDA applies to the consulting firm’s commercial activity. Identifiable household-client records are processed for the existing authorized purpose. The question concerns accountability, not a new consent purpose or a special statutory localization rule.",
    "stem": "A consulting firm outsources processing of household clients’ personal records to a service provider. A manager says the firm can delete its privacy responsibilities from the service agreement because the provider now handles the records. Under PIPEDA, which response is best?",
    "options": [
      "The firm remains accountable and must use contractual or other means to provide comparable protection during processing.",
      "The provider becomes solely accountable once it receives the records, so the firm needs no further privacy safeguards.",
      "The firm can end its accountability by notifying clients that all privacy complaints must be directed to the provider.",
      "The transfer is prohibited because PIPEDA does not permit an organization to use a third party to process personal records."
    ],
    "answer": 0,
    "optionRationales": [
      "Schedule 1, clause 4.1.3 retains the organization’s responsibility for information transferred for processing and requires comparable protection.",
      "Delegating processing does not by itself discharge the firm’s accountability for personal information under its control.",
      "Redirecting complaints does not remove statutory accountability or replace appropriate protection arrangements.",
      "PIPEDA expressly addresses third-party processing; the stated outsourcing is not categorically prohibited merely because a provider is used."
    ],
    "keyPoint": "Outsource processing without treating accountability as transferred away.",
    "trap": "Confusing another party’s custody of records with the end of the firm’s privacy obligations.",
    "sources": [
      {
        "sourceType": "primary-legislation",
        "title": "Canada, Personal Information Protection and Electronic Documents Act",
        "locator": "Schedule 1, clauses 4.1 and 4.1.3; official consolidation current to 2026-09-21",
        "url": "https://laws-lois.justice.gc.ca/eng/acts/P-8.6/page-7.html"
      },
      {
        "sourceType": "federal-privacy-regulator-guidance",
        "title": "Office of the Privacy Commissioner of Canada, Guidance on assessing third-party service providers",
        "locator": "Key points and Guidance; September 10, 2026 guidance open for comments until December 4, 2026, not a statutory amendment",
        "url": "https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/appropriate-handling-of-personal-information/gd_third-party_202609/"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "IV.13 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "V.2",
    "sub": "nppe-professional-law",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-ontario-volunteer-public-services-cofa",
    "learningObjective": "Distinguish personal licensure from authorization to offer public engineering services without a fee.",
    "jurisdiction": "Ontario; a competent PEO licence holder intends to offer professional engineering services directly through a new sole proprietorship to an unrelated charity. Neither the practice nor the individual has a Certificate of Authorization, and no exception applies.",
    "stem": "An Ontario P.Eng. establishes a sole proprietorship to provide an engineering design directly to a local charity without charging a fee. The engineer has no Certificate of Authorization and believes the personal licence is sufficient because the project is voluntary. What is the most appropriate conclusion?",
    "options": [
      "The personal licence is sufficient because a Certificate of Authorization applies only when engineering fees are charged.",
      "The charity’s written consent can replace the Certificate of Authorization because it is the sole recipient of the design.",
      "A Certificate of Authorization is required only after a second public client is accepted, so this first project may proceed.",
      "A Certificate of Authorization is required for these public services; the absence of a fee does not provide an exemption."
    ],
    "answer": 3,
    "optionRationales": [
      "PEO distinguishes the individual licence from the authorization to offer or provide public services; voluntary work is not exempt merely because no fee is charged.",
      "Client consent does not replace the regulator’s required authorization for the stated public engineering practice.",
      "The public-service requirement is not deferred until a second client; the first qualifying offering or service is relevant.",
      "Section 12(2) and PEO’s volunteer guidance require the authorization for the public services described, whether paid or voluntary."
    ],
    "keyPoint": "Voluntary public engineering service still requires the applicable practice authorization.",
    "trap": "Assuming that a charitable purpose or zero fee changes the licensing category.",
    "sources": [
      {
        "sourceType": "regulator-licensing-guidance-on",
        "title": "PEO, Volunteers FAQ",
        "locator": "Professional Engineers Act makes no distinction between engineering services for a fee and on a volunteer basis; Certificate of Authorization requirement",
        "url": "https://www.peo.on.ca/knowledge-centre/frequently-asked-questions/volunteers-faq"
      },
      {
        "sourceType": "regulator-licensing-guidance-on",
        "title": "PEO, Certificate of Authorization",
        "locator": "Section 12(2): public-service authorization for sole proprietorships, partnerships and corporations, distinct from individual licensure",
        "url": "https://www.peo.on.ca/apply/certificate-authorization"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "V.2 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "VI.1",
    "sub": "nppe-discipline",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-ontario-late-expert-evidence-panel-leave",
    "learningObjective": "Distinguish a disclosure defect from automatic admission or automatic dismissal of a discipline case.",
    "jurisdiction": "Ontario; PEO Discipline Committee Rules of Procedure dated November 7, 2025 apply. No agreed timetable or prior panel order excuses the late service. This is a contested hearing, not an interim emergency order.",
    "stem": "Shortly before a PEO discipline hearing, PEO first serves an expert report after the applicable service deadline. The defending engineer has not had a fair chance to assess it. Counsel for PEO says that filing the report automatically makes it evidence. What is the best response?",
    "options": [
      "Accept it without objection because filing a technical report automatically satisfies every disclosure and admissibility requirement.",
      "Treat the entire case as dismissed because a missed expert-report deadline permanently removes the panel’s jurisdiction.",
      "Seek a panel ruling on leave and appropriate procedural protections, including sufficient opportunity to respond if it is admitted.",
      "Ignore the report without raising the issue because late expert evidence can never be admitted under any panel direction."
    ],
    "answer": 2,
    "optionRationales": [
      "Administrative acceptance of a filing does not establish timely service or admissibility; the applicable rules require panel leave for the non-compliance described.",
      "The rules allow the panel to address non-compliance; the missed deadline does not automatically dismiss the entire proceeding.",
      "Rules 3.7 and 3.8 provide for leave and procedural directions. A fair opportunity to address the evidence is relevant to the ruling and any protective terms.",
      "Late evidence is not categorically incapable of admission; the panel may grant leave on appropriate terms, so the issue should be raised."
    ],
    "keyPoint": "Late expert evidence calls for a procedural ruling and fair handling, not an assumed outcome.",
    "trap": "Equating filing with admissibility or a missed deadline with automatic dismissal.",
    "sources": [
      {
        "sourceType": "regulator-procedural-rules-on",
        "title": "PEO Discipline Committee, Rules of Procedure (November 7, 2025)",
        "locator": "Rules 3.3(2), 3.7(4), 3.7(7) and 3.8(1), (3), (5): filing, disclosure, expert evidence and leave",
        "url": "https://www.peo.on.ca/sites/default/files/2025-11/rules-of-procedure-dic-nov2025.pdf"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "VI.1 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "III.10",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-a-bar-height-baseline-misrepresents-rate-change",
    "learningObjective": "Evaluate whether a graphical comparison supports the message communicated to an audience.",
    "jurisdiction": "Canada; a descriptive comparison of complete records using the same failure definition. The question concerns truthful presentation, not statistical significance or proof of a causal improvement.",
    "stem": "A public report shows failure rates of 4.8% and 4.6% in successive years. Its bars start at 4.5%, making the second bar one-third as tall as the first. The caption says failures fell by two-thirds. Which revision best communicates the evidence?",
    "options": [
      "Correct the caption using the actual rates and redraw the bars from zero so their lengths represent the stated quantities.",
      "Keep the caption because the ratio of the visible bar heights is the appropriate measure of the change in failure rates.",
      "Keep the graphic and caption but add more decimal places to the rate labels so the numerical precision resolves the claim.",
      "Replace the rate labels with the bar heights above 4.5% so the published figures match the claimed two-thirds reduction."
    ],
    "answer": 0,
    "optionRationales": [
      "The rates differ by 0.2 percentage points, about a 4.2% relative decrease, not two-thirds. A zero-baseline bar display avoids the misleading length comparison.",
      "The visible heights measure excess above an arbitrary 4.5% baseline, not the full rates, so their ratio cannot support the caption.",
      "More decimal places do not repair the incorrect interpretation of the truncated bars or the misleading magnitude claim.",
      "Relabelling the excess above the baseline as the rates would change the quantities being reported rather than correct the communication."
    ],
    "keyPoint": "Check that the visual encoding and caption represent the actual quantities.",
    "trap": "Interpreting the ratio of truncated bar heights as the ratio of the underlying rates.",
    "sources": [
      {
        "sourceType": "government-statistical-guidance",
        "title": "Statistics Canada, Data Visualization: Best Practices",
        "locator": "Sections on chart titles and axes: clear messages and ordinarily zero-based, unbroken axes; no claim that every nonzero axis is prohibited",
        "url": "https://www150.statcan.gc.ca/n1/pub/89-26-0005/892600052022001-eng.htm"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "III.10 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  }
];
 function escape(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 questions.forEach(function(q,i){
   var id=String(i+181).padStart(3,'0');
   Object.assign(q,{qid:'nppe:set-1:mock-a:'+id,legacyId:'NPPE-'+id,version:1,batch:2,authorSet:1,author:'ChatGPT',form:'set-1-mock-a',bank:'mock',set:1,original:true,scored:i!==9,experimental:i===9,releaseStatus:'released',reviewStatus:'editorial source review; independent SME/legal review and empirical calibration pending',area:q.blueprint.split('.')[0],verifiedAt:'2026-10-16',blueprintVersion:'2017 official NPPE blueprint current on 2026-10-16',difficultyBasis:'Editorial estimate; not empirically calibrated'});
   if(q.options.length!==4||new Set(q.options).size!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||q.optionRationales.length!==4||!q.sources.length)throw new Error('Invalid Mock A item '+id);
   q.why='<p>'+escape(q.optionRationales[q.answer])+'</p><p><strong>Key learning point:</strong> '+escape(q.keyPoint)+'</p><p><strong>Common error:</strong> '+escape(q.trap)+'</p><p><strong>Sources:</strong> '+q.sources.map(function(s){return '<a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer">'+escape(s.title)+'</a> — '+escape(s.locator)+' ['+escape(s.sourceType)+']';}).join('; ')+'.</p><p>Original Mock A item. Editorial classifications are provisional; practice scores do not predict an official NPPE result.</p>';
 });

 if(!Array.isArray(global.NPPE_MOCK_A)||!Array.isArray(global.NPPE_MOCK_A_BATCH1)||global.NPPE_MOCK_A_BATCH1.length!==10||global.NPPE_MOCK_A_BATCH1.some(function(q,i){return q.qid!=='nppe:set-1:mock-a:'+String(171+i);}))throw new Error('Mock A Batch 1 must load before Batch 2');
 var existing=global.NPPE_MOCK_A;
 var matches=questions.map(function(q){return existing.find(function(old){return old.qid===q.qid||old.legacyId===q.legacyId;});});
 if(matches.some(Boolean)){
   if(!matches.every(function(old,i){return old&&JSON.stringify(old)===JSON.stringify(questions[i]);}))throw new Error('Conflicting Mock A Batch 2 items');
   global.NPPE_MOCK_A_BATCH2=matches;
 }else{
   if(existing.length!==10||existing.some(function(q,i){return q!==global.NPPE_MOCK_A_BATCH1[i];}))throw new Error('Unexpected Mock A bank before Batch 2');
   Array.prototype.push.apply(existing,questions);
   global.NPPE_MOCK_A_BATCH2=questions.slice();
 }
})(typeof window!=='undefined'?window:globalThis);
