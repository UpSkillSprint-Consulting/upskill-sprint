/* Set 1 Mock B Batch 2 — ten original protected questions; release-held form. */
(function(global){
 'use strict';
 var questions=[
  {
    "blueprint": "IV.3",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-b-negligent-proximity-third-party-reliance",
    "learningObjective": "Distinguish foreseeability and proximity from an automatic duty of care.",
    "jurisdiction": "Ontario common-law negligence; the project documents were expressly marked for internal procurement use only, and the recipient never communicated an intended lender use.",
    "stem": "An engineering consultant prepares a preliminary cost estimate solely for an owner's internal procurement decision. A lender later obtains an incomplete copy from a third party and claims the consultant must have owed every conceivable reader a duty of care. Which assessment is most defensible?",
    "options": [
      "A possible financial consequence alone automatically establishes a duty owed to every downstream reader.",
      "The duty analysis must examine reasonable foreseeability and the proximity of this particular relationship, including the stated purpose and expected reliance.",
      "Every engineering estimate attracts no civil duty because it is an opinion rather than a physical design.",
      "The consultant's professional designation automatically makes the lender a contracting party."
    ],
    "answer": 1,
    "optionRationales": [
      "Foreseeability alone does not settle whether a relationship is sufficiently proximate for this asserted duty.",
      "A negligence duty requires attention to the parties' relationship and foreseeable harm; broad downstream use is not automatically protected.",
      "Professional advice can attract liability in appropriate circumstances, so a categorical immunity is unsound.",
      "Professional registration does not itself create a contract between the consultant and an unknown lender."
    ],
    "keyPoint": "Duty and scope must be established for the particular relationship.",
    "trap": "Assuming every foreseeable user has an identical duty owed to them.",
    "sources": [
      {
        "title": "Supreme Court of Canada, Deloitte & Touche v. Livent Inc. (Receiver of), 2017 SCC 63",
        "locator": "Paras. 20–30: negligent performance, reasonable foreseeability, proximity and undertaking to identifiable users",
        "url": "https://decisions.scc-csc.ca/scc-csc/scc-csc/en/item/16920/index.do",
        "sourceType": "primary-judgment"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE published 2017 blueprint",
        "locator": "IV.3 — primary numbered topic; current 2017 blueprint checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "II.3",
    "sub": "nppe-ethics",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-communicating-technical-assumptions",
    "learningObjective": "Apply professional ethics to distinguish verified measurements from untested modelling assumptions.",
    "jurisdiction": "Canada; national Engineers Canada guidance is advisory, not a provincial disciplinary ruling.",
    "stem": "An engineer prepares a publicly distributed noise-impact statement. It presents a simulated worst-case level of 68 dBA as though it were a measured reading, even though no field test has yet been performed. What revision is most consistent with professional ethics?",
    "options": [
      "Label the 68 dBA result as a modelled estimate, identify assumptions and uncertainty, and distinguish it from measured data.",
      "Remove the number entirely because professional communications may contain only direct measurements.",
      "Leave the statement unchanged because all projections become measurements once included in a signed report.",
      "Replace the value with a lower target level without noting the change to avoid misleading residents."
    ],
    "answer": 0,
    "optionRationales": [
      "Truthful reporting distinguishes facts, assumptions and opinions so readers can interpret the figure correctly.",
      "Predictive modelling is legitimate when its assumptions and limitations are transparently identified.",
      "A signed document cannot transform an unmeasured simulation into a recorded observation.",
      "Substituting an aspirational target for an estimate would further misstate the underlying evidence."
    ],
    "keyPoint": "Professional statements distinguish observations from assumptions and opinions.",
    "trap": "Using apparently precise figures to conceal their evidentiary status.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 1–7: public protection, competence, truthfulness, disclosure and impartial review",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE published 2017 blueprint",
        "locator": "II.3 — primary numbered topic; current 2017 blueprint checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "III.4",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-voluntary-code-vs-legal-permit",
    "learningObjective": "Distinguish recommended technical guidance from an enforceable permit condition.",
    "jurisdiction": "Canada; a hypothetical provincial permit expressly specifies a minimum effluent sampling frequency, while a voluntary industry guide suggests a less frequent schedule.",
    "stem": "A plant engineer notices that a voluntary industry guide recommends monthly effluent samples, while the site's current operating permit expressly requires weekly samples. A supervisor wants to switch to monthly because the guide is more recent. What should the engineer advise?",
    "options": [
      "Apply the newer guide automatically because voluntary industry documents supersede older permits.",
      "Collect samples only after a complaint because neither a permit nor a guide binds engineers.",
      "Continue meeting the permit's weekly requirement while evaluating whether the guide offers additional useful practices.",
      "Average the two intervals because two authoritative-looking documents are equally binding."
    ],
    "answer": 2,
    "optionRationales": [
      "Technical publication date does not grant authority to override an applicable permit condition.",
      "The express permit obligation is not conditional on a complaint.",
      "Applicable legal conditions take precedence; nonbinding guidance may supplement but cannot unilaterally replace them.",
      "Averaging obligations would create a sampling frequency unsupported by the actual permit."
    ],
    "keyPoint": "Differentiate binding statutory or permit requirements from optional standards.",
    "trap": "Mistaking the most recently published guidance for the legal governing rule.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 1–7: public protection, competence, truthfulness, disclosure and impartial review",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "title": "Canadian Centre for Occupational Health and Safety, Standards and codes",
        "locator": "Acts, regulations, codes, voluntary standards and adoption by law; applicability depends on jurisdiction",
        "url": "https://www.ccohs.ca/oshanswers/legisl/legislation/how_to_read_legisl.html",
        "sourceType": "official-guidance"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE published 2017 blueprint",
        "locator": "III.4 — primary numbered topic; current 2017 blueprint checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "IV.4",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-quebec-extra-contractual-injury",
    "learningObjective": "Identify the essential civil-law fault–injury–causation relationship without importing common-law categories.",
    "jurisdiction": "Québec; no contract links the two parties, no statutory immunity or special liability regime applies, and the injured person alleges fault.",
    "stem": "A Québec geoscience consultant carelessly places an unmarked surveying cable across a shared footpath. A passerby trips, suffers a documented injury and claims compensation, although they had no contract with the consultant. Which legal framework most directly addresses the asserted responsibility?",
    "options": [
      "A claim is impossible without consideration and a signed contract for services.",
      "Only criminal prosecution can address an injury on a public path.",
      "The passerby automatically wins because an accident alone proves every element of fault-based liability.",
      "Extra-contractual civil liability under Civil Code article 1457 requires considering fault, resulting injury and causal connection."
    ],
    "answer": 3,
    "optionRationales": [
      "The absence of contract does not categorically prevent an extra-contractual civil-liability claim.",
      "Civil remedies can address alleged fault independently of criminal proceedings.",
      "The occurrence of injury alone does not establish all elements of fault-based responsibility.",
      "Article 1457 frames the general extra-contractual duty and injury caused through fault."
    ],
    "keyPoint": "Québec extra-contractual liability is distinct from contractual liability.",
    "trap": "Assuming lack of privity bars all claims for negligence-like harm.",
    "sources": [
      {
        "title": "Civil Code of Québec, article 1457",
        "locator": "General extra-contractual liability for breach of a duty of conduct causing injury; historical official indexed English wording to be checked against current consolidation",
        "url": "https://www.legisquebec.gouv.qc.ca/en/document/cs/ccq-1991",
        "sourceType": "primary-provincial-statute"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE published 2017 blueprint",
        "locator": "IV.4 — primary numbered topic; current 2017 blueprint checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "I.2",
    "sub": "nppe-professionalism",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-b-public-economic-safety-flood-warning",
    "learningObjective": "Recognize that public protection includes economic and community consequences.",
    "jurisdiction": "Canada; evaluation of technically credible drainage-flood alternatives, with no mandatory numerical design standard stipulated.",
    "stem": "A municipality plans flood protection for an industrial neighbourhood. Two drainage options would protect residents equally from injury, but one would regularly flood the only access road used by an emergency pharmacy and a small-business district. A reviewer argues the access and economic consequences are irrelevant because there is no added bodily injury risk. Which response best reflects the broader professional duty?",
    "options": [
      "Ignore disruption because public protection concerns only loss of life, never access or economic damage.",
      "Choose whichever option offers the highest professional fee to the consultant.",
      "Consider foreseeable community access and economic impacts in addition to personal safety and environmental effects.",
      "Treat any option affecting businesses as prohibited, without comparing magnitude or alternatives."
    ],
    "answer": 2,
    "optionRationales": [
      "The public interest extends beyond fatalities to foreseeable access, economic and environmental consequences.",
      "The consultant's financial reward is not a proper proxy for public welfare.",
      "Professional judgment includes foreseeable effects on affected communities, not merely immediate bodily harm.",
      "A rational comparison assesses the actual risk and alternatives rather than assuming all disruption is impermissible."
    ],
    "keyPoint": "Public protection includes economic and community resilience.",
    "trap": "Narrowing welfare to immediate physical injury alone.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 1–7: public protection, competence, truthfulness, disclosure and impartial review",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE published 2017 blueprint",
        "locator": "I.2 — primary numbered topic; current 2017 blueprint checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "V.2",
    "sub": "nppe-professional-law",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-interprovincial-mobility-registration",
    "learningObjective": "Distinguish mobility eligibility from a self-issued right to practise before regulator registration.",
    "jurisdiction": "Canada; a licensed professional moves between provinces and the destination regulator requires a mobility application before independent practice; no emergency or temporary exemption applies.",
    "stem": "An engineer licensed in Province A accepts a job to independently approve engineering designs in Province B. The employer says interprovincial mobility makes the engineer's existing licence automatically valid in Province B without contacting its regulator. What is the best response?",
    "options": [
      "Rely on the original licence to sign in Province B immediately because all provinces have a single licensing register.",
      "Assume a degree certificate is sufficient if the engineer has practised for at least five years.",
      "Accept the employer's written authorization as a substitute for statutory registration.",
      "Use the destination regulator's mobility process and obtain the required registration or authorization before undertaking regulated independent practice."
    ],
    "answer": 3,
    "optionRationales": [
      "Mobility arrangements facilitate registration but do not always replace the destination jurisdiction's statutory process.",
      "Experience or qualifications are assessed through the applicable licensing and mobility framework.",
      "An employer cannot confer a statutory licence by workplace letter.",
      "The destination regulator defines the lawful pathway; mobility benefits do not justify unregistered practice."
    ],
    "keyPoint": "Labour mobility facilitates licensing; verify destination practice authorization.",
    "trap": "Confusing expedited eligibility with automatic unrestricted practice rights.",
    "sources": [
      {
        "title": "Engineers Canada, Mobility of engineering professionals",
        "locator": "Engineers Canada Mobility Register eligibility and licensed-in-jurisdiction requirement; register is not a nationwide licence",
        "url": "https://engineerscanada.ca/services/mobility-register",
        "sourceType": "official-guidance"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE published 2017 blueprint",
        "locator": "V.2 — primary numbered topic; current 2017 blueprint checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "VI.2",
    "sub": "nppe-discipline",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-bc-reactive-practice-review-vs-audit",
    "learningObjective": "Distinguish targeted technical practice reviews from BC's proactive individual compliance audits.",
    "jurisdiction": "British Columbia; Engineers and Geoscientists BC's current audit and practice-review programs as described publicly.",
    "stem": "After a compliance audit, a B.C. registrant is referred to a focused practice review because significant technical risks were identified. A colleague says the review is merely another random audit and can never impose practice conditions. Which description is most accurate?",
    "options": [
      "A reactive practice review can examine identified technical concerns and may lead to conditions on practice through the relevant committee.",
      "The review is purely voluntary and has no possible consequences after a technical concern is identified.",
      "A targeted practice review is identical to random selection for a routine individual compliance audit.",
      "Referral for review means the registrant has already been criminally convicted."
    ],
    "answer": 0,
    "optionRationales": [
      "EGBC describes targeted practice reviews and possible restrictions or oversight decisions by the committee.",
      "A targeted regulatory review cannot be assumed optional or without possible professional consequences.",
      "A reactive risk-focused practice review differs from proactive compliance auditing.",
      "Regulatory scrutiny and criminal conviction are different legal processes."
    ],
    "keyPoint": "Recognize the distinction between preventive audits and targeted practice reviews.",
    "trap": "Treating all regulator quality-assurance activities as the same process.",
    "sources": [
      {
        "title": "Engineers and Geoscientists BC, Individual Practice Review",
        "locator": "Reactive targeted program, purpose, committee outcomes and possible practice restrictions",
        "url": "https://www.egbc.ca/registrants/practice-resources/individual-practice-review",
        "sourceType": "provincial-regulator-guidance"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE published 2017 blueprint",
        "locator": "VI.2 — primary numbered topic; current 2017 blueprint checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "III.5",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-substitution-risk-control",
    "learningObjective": "Choose higher-order risk reduction over administrative-only controls where feasible.",
    "jurisdiction": "Canada; a manufacturing solvent has an evaluated safer compatible substitute, tested to meet process requirements, and exposure risks are documented.",
    "stem": "A quality laboratory uses a volatile cleaning solvent. A validated low-hazard substitute works equally well, but management proposes retaining the original solvent and adding reminder posters only. Which risk-management action is most defensible?",
    "options": [
      "Keep the original solvent because warning signs eliminate the underlying chemical hazard.",
      "Adopt the validated lower-hazard substitute with appropriate implementation checks and evaluate any remaining exposure risks.",
      "Use additional warning posters and assume the exposure probability becomes zero.",
      "Transfer responsibility for exposure to employees through an acknowledgement form without changing the process."
    ],
    "answer": 1,
    "optionRationales": [
      "Administrative messaging alone does not remove the source hazard when a feasible safer replacement exists.",
      "Substitution is a higher-level control than warnings alone; implementation and residual hazards still need assessment.",
      "Warnings do not prove exposure is eliminated or risk is zero.",
      "An acknowledgement cannot replace reasonable engineering and occupational risk controls."
    ],
    "keyPoint": "Prefer feasible elimination or substitution ahead of weaker administrative-only controls.",
    "trap": "Equating signed acknowledgements or signs with effective hazard elimination.",
    "sources": [
      {
        "title": "Canadian Centre for Occupational Health and Safety, Hierarchy of Controls",
        "locator": "Control ranking: elimination, substitution, engineering controls, administrative controls, PPE",
        "url": "https://www.ccohs.ca/oshanswers/hsprograms/hazard/hierarchy_controls.html",
        "sourceType": "official-guidance"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE published 2017 blueprint",
        "locator": "III.5 — primary numbered topic; current 2017 blueprint checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "II.4",
    "sub": "nppe-ethics",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-competing-bidder-relative-conflict",
    "learningObjective": "Manage conflicts arising from undisclosed family ties in procurement evaluation.",
    "jurisdiction": "Canada; procurement policy requires declaring actual or perceived conflicts and allows reassignment before scoring.",
    "stem": "An engineer is assigned to score competing equipment bids. One bidder is a company owned by the engineer's sibling. The engineer believes the bid is technically strongest and intends to score it fairly without mentioning the relationship. What should the engineer do first?",
    "options": [
      "Proceed without disclosure because a technically defensible outcome eliminates any perceived conflict.",
      "Score every bid lower so the family relationship cannot influence a winner.",
      "Disclose the relationship promptly and follow the employer's conflict-management process, including recusal or independent evaluation if required.",
      "Reject the sibling's bid automatically as fraudulent even though no procurement rule requires disqualification."
    ],
    "answer": 2,
    "optionRationales": [
      "Objectivity must be demonstrable; silence leaves an unmanaged apparent personal interest.",
      "Manipulating scores would itself compromise the fairness of the evaluation.",
      "Disclosure permits a documented impartial process without presuming guilt or selecting an outcome.",
      "A potential conflict does not, by itself, establish bidder misconduct or require arbitrary disqualification."
    ],
    "keyPoint": "Disclose and manage apparent personal interests before evaluating bids.",
    "trap": "Equating personal confidence in neutrality with transparent conflict management.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 1–7: public protection, competence, truthfulness, disclosure and impartial review",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE published 2017 blueprint",
        "locator": "II.4 — primary numbered topic; current 2017 blueprint checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "IV.5",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-b-actual-employment-relationship-vs-label",
    "learningObjective": "Evaluate worker classification based on actual terms rather than contract title alone.",
    "jurisdiction": "Canada outside Québec; classification for Canada Pension Plan/employment insurance purposes, not a determination of every provincial employment-law claim.",
    "stem": "A consulting company labels a laboratory analyst an 'independent contractor' in the written agreement. In practice it sets every shift, supplies all equipment, prohibits other clients, directly supervises the work and pays a fixed hourly amount without business risk. A payroll manager assumes the label conclusively settles the analyst's employment status. Which assessment is best?",
    "options": [
      "Examine the actual working relationship, including control, tools, financial risk and opportunity for profit, rather than relying on the label alone.",
      "Treat the worker as independent solely because the written agreement uses that term.",
      "Treat every hourly paid worker as self-employed regardless of the payer's control.",
      "Assume no employment-status inquiry can occur without a prior court conviction."
    ],
    "answer": 0,
    "optionRationales": [
      "CRA guidance evaluates actual terms and working conditions as a whole, not just the parties' label.",
      "Contract terminology is relevant but cannot override contradictory operational facts.",
      "Hourly compensation alone does not determine worker status.",
      "Employment classification for tax and benefits purposes does not require criminal proceedings."
    ],
    "keyPoint": "Worker classification depends on the substantive working relationship.",
    "trap": "Treating contract labels as conclusive over actual control and commercial risk.",
    "sources": [
      {
        "title": "Canada Revenue Agency, Employee or Self-employed, RC4110",
        "locator": "Working relationship as a whole; control, tools, opportunity for profit and financial risk",
        "url": "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4110/employee-self-employed.html",
        "sourceType": "federal-tax-guidance"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE published 2017 blueprint",
        "locator": "IV.5 — primary numbered topic; current 2017 blueprint checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  }
];
 function escape(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 questions.forEach(function(item,i){
  var id=String(291+i);
  Object.assign(item,{qid:'nppe:set-1:mock-b:'+id,legacyId:'NPPE-'+id,version:1,batch:2,authorSet:1,author:'ChatGPT',form:'set-1-mock-b',bank:'mock',set:1,original:true,scored:true,experimental:false,releaseStatus:'held',reviewStatus:'author/editor preliminary review; independent SME/legal review and empirical calibration pending',area:item.blueprint.split('.')[0],verifiedAt:'2026-10-18',blueprintVersion:'published 2017 NPPE blueprint verified 2026-10-18',difficultyBasis:'Editorial estimate, not empirical calibration'});
  if(item.options.length!==4||new Set(item.options).size!==4||item.optionRationales.length!==4||!Number.isInteger(item.answer)||item.answer<0||item.answer>3||!item.sources.some(function(s){return s.sourceType==='official-blueprint';})||!item.sources.some(function(s){return s.sourceType!=='official-blueprint';}))throw new Error('Invalid Mock B Batch 2 item '+id);
  item.why='<p>'+escape(item.optionRationales[item.answer])+'</p><p><strong>Key learning point:</strong> '+escape(item.keyPoint)+'</p><p><strong>Common error:</strong> '+escape(item.trap)+'</p><p><strong>Sources:</strong> '+item.sources.map(function(s){return '<a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer">'+escape(s.title)+'</a> — '+escape(s.locator)+' ['+escape(s.sourceType)+']';}).join('; ')+'.</p><p>Original held Mock B item; classifications are provisional and do not predict an official NPPE result.</p>';
 });
 if(!Array.isArray(global.NPPE_MOCK_B)||!Array.isArray(global.NPPE_MOCK_B_BATCH1)||global.NPPE_MOCK_B_BATCH1.length!==10||global.NPPE_MOCK_B.length<10||global.NPPE_MOCK_B_BATCH1.some(function(q,i){return q!==global.NPPE_MOCK_B[i];}))throw new Error('Mock B Batch 1 must load first');
 var prior=global.NPPE_MOCK_B;
 if(prior.length===20){
  if(questions.some(function(item,i){return JSON.stringify(item)!==JSON.stringify(prior[10+i]);}))throw new Error('Conflicting Mock B Batch 2 reload');
  global.NPPE_MOCK_B_BATCH2=prior.slice(10);
 }else{
  if(prior.length!==10)throw new Error('Unexpected partial Mock B bank');
  Array.prototype.push.apply(prior,questions);
  global.NPPE_MOCK_B_BATCH2=questions.slice();
 }
})(typeof window!=='undefined'?window:globalThis);
