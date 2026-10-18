/* Original Set 1 Mock B Batch 10; protected only, incomplete, release held. */
(function(global){
 'use strict';
 var questions=[
  {
    "blueprint": "IV.9",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-b-ontario-lien-preservation-trigger-not-invoice-date",
    "learningObjective": "Differentiate statutory construction-lien preservation trigger dates from an invoice due date.",
    "jurisdiction": "Ontario; contractor's pre-substantial-performance services, certificate of substantial performance published July 1, contract not completed earlier, no extraordinary statutory adjustment or exception. The issue is identifying the trigger, not computing a court deadline.",
    "stem": "An Ontario contractor provides engineering-related construction services to an improvement. The certificate of substantial performance is published July 1, while its final progress invoice is not due until August 20. A project administrator says the 60-day lien preservation clock necessarily begins when the invoice becomes due. Which response best reflects the Construction Act?",
    "options": [
      "The clock always starts when the contractor receives the final payment, regardless of a published certificate.",
      "The clock starts only if the owner formally rejects an invoice.",
      "For the stated pre-substantial-performance services, the published certificate can trigger the statutory preservation period; the invoice due date is not the controlling trigger.",
      "The project manager can extend the statutory lien preservation period indefinitely by rewriting the invoice terms."
    ],
    "answer": 2,
    "optionRationales": [
      "Payment receipt is not the universal statutory event starting a contractor's preservation period.",
      "An invoice dispute is not the stated statutory trigger for this class of services.",
      "Section 31(2)(a), subject to applicable qualifications, refers to the earlier of publication of the substantial-performance certificate and specified contract cessation events.",
      "Private invoice administration cannot unilaterally alter the statutory preservation regime."
    ],
    "keyPoint": "Ontario construction lien preservation depends on statutory trigger events, not simply payment scheduling.",
    "trap": "Confusing contractual invoice maturity with the Construction Act's lien preservation events.",
    "sources": [
      {
        "sourceType": "ontario-primary-legislation",
        "title": "Ontario Construction Act, R.S.O. 1990, c. C.30",
        "locator": "Section 31(1) and 31(2)(a), as amended and current in 2026: contractor lien preservation following publication or contract completion",
        "url": "https://www.ontario.ca/laws/statute/90c30"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "IV.9 — numbered primary topic, last checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "III.7",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-b-engineering-logs-preservation-security-incident",
    "learningObjective": "Preserve technical audit evidence and restore trust after an engineering configuration compromise.",
    "jurisdiction": "Canada; control-system maintenance network, verified unexpected changes and a documented safety/security incident plan, no presumed mandatory notification deadline.",
    "stem": "After an overnight cybersecurity alert at a water utility, engineers find that pump-controller alarm thresholds were changed without authorization. Operations proposes restoring backup settings and deleting access logs to avoid delaying production. What should the responsible engineer recommend?",
    "options": [
      "Restore operations without reviewing the altered thresholds because backups prove the controller cannot have been compromised.",
      "Delete access logs immediately because keeping records of unauthorized modifications increases technical risk.",
      "Announce that the system is safe solely because no physical damage has yet been observed.",
      "Contain the suspected compromise, preserve relevant evidence, independently verify safety-critical settings and follow the organization's incident and notification processes before relying on the system."
    ],
    "answer": 3,
    "optionRationales": [
      "Backup availability does not demonstrate that the restored settings and safety interlocks have been verified.",
      "Destroying incident evidence prevents reliable reconstruction and may interfere with required processes.",
      "Absence of observed damage does not establish integrity of modified safety settings.",
      "Containment, evidence preservation and independent integrity checks address both information security and physical operational safety."
    ],
    "keyPoint": "Restoring a control system safely requires preserving incident evidence and validating engineering settings.",
    "trap": "Treating backup restoration alone as proof of acceptable control-system integrity.",
    "sources": [
      {
        "sourceType": "federal-cybersecurity-guidance",
        "title": "Canadian Centre for Cyber Security, Developing your incident response plan",
        "locator": "Detection, containment, evidence collection, eradication, recovery and communications",
        "url": "https://www.cyber.gc.ca/en/guidance/developing-your-incident-response-plan-itsm60001"
      },
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 1, 2, 4–11: truthful professional statements, competent supervision, public safety, integrity and confidentiality; nonbinding national guidance",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "III.7 — numbered primary topic, last checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "II.3",
    "sub": "nppe-ethics",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-technical-consensus-unsubstantiated-emissions",
    "learningObjective": "Correct an unsupported professional statement in an environmental impact summary.",
    "jurisdiction": "Canada; engineering consultant can revise an official public summary prior to regulatory filing; carbon-emission reductions have been modelled but not independently verified.",
    "stem": "A project team asks its engineer to certify that a new furnace has already cut annual greenhouse-gas emissions by 25%. The plant has not operated under representative conditions; 25% is the design model's projected reduction. Which professional statement is most appropriate?",
    "options": [
      "Present the reduction as a modelled estimate with its assumptions and verification plan, distinguishing it from observed operational performance.",
      "Report the 25% reduction as measured, since a validated design model always constitutes actual production data.",
      "Remove every emissions estimate because no engineering model may inform regulatory planning before operation.",
      "Publish 25% as confirmed and add a footnote stating that future measurements are optional."
    ],
    "answer": 0,
    "optionRationales": [
      "Professional statements should distinguish projected performance, assumptions and evidence needed for confirmation.",
      "Model credibility does not convert forecast output into a measured annual result.",
      "Scenario modelling can be relevant when transparently labelled and appropriately qualified.",
      "A minor footnote cannot justify categorically misrepresenting an unmeasured effect as observed fact."
    ],
    "keyPoint": "Do not represent predicted environmental performance as an already achieved measurement.",
    "trap": "Confusing modelled improvement with verified operating results.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 1, 2, 4–11: truthful professional statements, competent supervision, public safety, integrity and confidentiality; nonbinding national guidance",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "II.3 — numbered primary topic, last checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "III.8",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-traceable-change-interface-revision",
    "learningObjective": "Maintain verifiable drawing and interface revisions during construction changes.",
    "jurisdiction": "Canada; engineer responsible for a multidisciplinary piping package; a valve relocation affects an electrical interlock, and project process requires approved coordinated revisions before issue.",
    "stem": "A site team moves a remotely controlled isolation valve to a different room. The piping drawing is revised, but the control schematic and cable schedule still show the old position. A document controller proposes issuing the new piping drawing alone as a completed revision because the valve physically fits. What should the responsible engineer do?",
    "options": [
      "Release the piping update without checking controls because drawing disciplines have no interface obligations.",
      "Coordinate and verify related control, cable and interface changes before representing the affected package as approved for use.",
      "Leave all design records unchanged because field installations can be documented after commissioning.",
      "Replace the control schematic with a note that interface review is unnecessary once the piping arrangement is dimensionally correct."
    ],
    "answer": 1,
    "optionRationales": [
      "A physical fit does not establish functional integration with the controls and power interfaces.",
      "Coordinated technical review and revision traceability are needed where one discipline's changes affect another.",
      "Delaying all documentation would leave foreseeable interface errors unaddressed.",
      "An unreviewed note does not validate interlocks, wiring or affected operating functions."
    ],
    "keyPoint": "Engineering revision control must include downstream interface and discipline effects.",
    "trap": "Mistaking an isolated drawing update for a verified coordinated design change.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 1, 2, 4–11: truthful professional statements, competent supervision, public safety, integrity and confidentiality; nonbinding national guidance",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "III.8 — numbered primary topic, last checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "IV.10",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-b-international-contract-arbitration-not-automatic-domestic-law",
    "learningObjective": "Distinguish a treaty obligation from the law and contract governing an engineering dispute.",
    "jurisdiction": "Canada; Canadian contracting parties have a domestic engineering-services agreement; a manager refers to a treaty that has not been legislatively implemented for the claimed service-fee rule.",
    "stem": "Two Canadian consulting firms dispute the calculation of an engineering fee. A manager cites an international treaty signed by Canada and insists it automatically replaces the negotiated fee formula in their domestic contract. No implementing Canadian law or relevant contractual incorporation has been identified. Which initial legal assessment is soundest?",
    "options": [
      "Signature of a treaty automatically rewrites all inconsistent private engineering contracts in Canada.",
      "An international treaty has no conceivable role in Canadian law or interpretation, even if implemented.",
      "Determine whether applicable domestic law or the agreement gives the treaty provision legal effect; signature alone does not automatically replace the contractual fee term.",
      "A domestic court must enforce the manager's preferred treaty interpretation because international instruments always govern fees."
    ],
    "answer": 2,
    "optionRationales": [
      "Canada generally distinguishes international treaty commitments from incorporation into domestic law.",
      "International treaties can have legal relevance when implemented or otherwise recognized by applicable domestic law.",
      "The treaty's legal status and the parties' agreement must be examined before claiming a replacement rule.",
      "An unimplemented assertion cannot, by itself, dictate judicial interpretation of a negotiated private fee."
    ],
    "keyPoint": "Treaty commitments do not automatically amend Canadian domestic contract terms.",
    "trap": "Assuming international signature itself substitutes for statutory implementation or contractual incorporation.",
    "sources": [
      {
        "sourceType": "federal-justice-analysis",
        "title": "Department of Justice Canada, The Convention on the Rights of the Child: Overview",
        "locator": "Canadian dualist treatment of treaties and requirement for domestic implementation in areas of legislative competence",
        "url": "https://canada.justice.gc.ca/eng/rp-pr/fl-lf/divorce/crc-crde/conv2a.html"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "IV.10 — numbered primary topic, last checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "III.9",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-report-of-overridden-fire-egress-design",
    "learningObjective": "Report material consequences when a fire-evacuation safety measure is deleted.",
    "jurisdiction": "Canada; a project engineer has verified that deleting a secondary exit would conflict with the applicable approved fire-safety design; formal change approval and site escalation remain available.",
    "stem": "During a building renovation, a project executive instructs a professional engineer to remove a required secondary emergency exit from the approved drawing to increase floor area. The engineer documents that the change undermines the project's approved life-safety strategy. What should the engineer do?",
    "options": [
      "Sign the revision because a project executive may assume all professional safety obligations by instruction.",
      "Delete the original life-safety calculations so the revised layout is the only official record.",
      "Treat the change as a purely financial matter since no fire has yet occurred.",
      "Clearly explain and document the consequences, withhold approval of the unsupported change, and escalate through the applicable professional and safety processes."
    ],
    "answer": 3,
    "optionRationales": [
      "Managerial approval does not authorize a professional to endorse a noncompliant life-safety design.",
      "Destroying evidence misrepresents the basis for the existing safety provisions.",
      "Foreseeable exit capacity and life-safety risks exist before a fire occurs.",
      "Engineering responsibility requires a traceable warning and appropriate procedural intervention before the unsafe change is approved."
    ],
    "keyPoint": "An overruled life-safety judgment calls for recorded consequences and proportionate escalation.",
    "trap": "Treating executive decision-making as an exemption from the professional duty to warn.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 1, 2, 4–11: truthful professional statements, competent supervision, public safety, integrity and confidentiality; nonbinding national guidance",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "III.9 — numbered primary topic, last checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "IV.11",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-b-fisheries-habitat-obstruction-not-just-pollution",
    "learningObjective": "Apply the Fisheries Act fish-habitat protection framework to a proposed physical alteration.",
    "jurisdiction": "Canada; a project proposes in-stream bank stabilization in fish habitat and has not established whether a prescribed exception or authorization applies.",
    "stem": "A municipal engineer plans bank stabilization in a channel used by fish. The design involves filling a shallow spawning area but releases no pollutants. A contractor says the Fisheries Act cannot apply because section 36 concerns deleterious substances and no chemicals will be discharged. What is the most appropriate recommendation?",
    "options": [
      "Proceed without review because physical filling can never engage federal fisheries protection.",
      "Consider section 35's prohibition on harmful alteration, disruption or destruction of fish habitat and determine applicable conditions or authorizations before the work proceeds.",
      "Apply only the building code because a project funded by a municipality is exempt from federal fish-habitat rules.",
      "Assume that paying for future habitat improvements automatically permits any present disturbance."
    ],
    "answer": 1,
    "optionRationales": [
      "The Fisheries Act includes habitat-protection duties distinct from the deleterious-deposit prohibition.",
      "Section 35 can address harmful physical alteration of fish habitat subject to the statute's exceptions and authorizations.",
      "Municipal ownership or funding does not automatically eliminate an applicable federal prohibition.",
      "Offsetting or restoration measures do not automatically constitute statutory authorization for a particular project."
    ],
    "keyPoint": "Federal fish-habitat protection is not limited to chemical pollution.",
    "trap": "Assuming absence of discharge eliminates the possibility of a harmful-habitat-alteration prohibition.",
    "sources": [
      {
        "sourceType": "federal-primary-legislation",
        "title": "Fisheries Act, R.S.C. 1985, c. F-14",
        "locator": "Section 35(1)–(2): harmful alteration, disruption or destruction of fish habitat, and exceptions/authorizations",
        "url": "https://laws-lois.justice.gc.ca/eng/acts/F-14/section-35.html"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "IV.11 — numbered primary topic, last checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "II.4",
    "sub": "nppe-ethics",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-sequential-review-conflict-prior-work",
    "learningObjective": "Manage independence when an engineer is selected to review a decision they helped make.",
    "jurisdiction": "Canada; client contract expressly requires a reviewer independent of the design; the engineer helped choose the original design and was not the final signer.",
    "stem": "An engineer who participated in selecting a tunnel ventilation concept is later assigned to provide an 'independent' assessment of why that concept was chosen. The engineer has no financial bonus tied to the report and argues that this makes the review independent. What should the engineer recommend?",
    "options": [
      "Accept the independent role because absence of a performance bonus excludes all conflicts.",
      "Accept the appointment but do not mention prior design participation because that fact is not an engineering calculation.",
      "Disclose the prior role, arrange an independent reviewer, and supply factual background through the appropriate review process.",
      "Refuse any future work on the entire project because previous design involvement automatically invalidates all factual information."
    ],
    "answer": 2,
    "optionRationales": [
      "Self-review and reputational interest can impair independence despite an absence of direct financial incentives.",
      "Concealing a material relationship undermines trust in the contracted independent review.",
      "The conflict concerns evaluation of one's prior judgment; it can be managed by separation of roles and transparency.",
      "Prior participation need not preclude factual assistance or every other compatible project role."
    ],
    "keyPoint": "An independent review should not be performed by someone materially involved in the decision being reviewed.",
    "trap": "Confusing absence of a contingent fee with independence from self-review bias.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 1, 2, 4–11: truthful professional statements, competent supervision, public safety, integrity and confidentiality; nonbinding national guidance",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "II.4 — numbered primary topic, last checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "III.10",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "analysis",
    "questionFamily": "mock-b-clear-technical-risk-visual-for-small-business",
    "learningObjective": "Communicate technical risk using suitable magnitude, timeframe and uncertainty.",
    "jurisdiction": "Canada; community briefing about a simulated river-flood hazard and a credible range of modelled probabilities, not an official flood map.",
    "stem": "A consultant presents flood-model output to small businesses using the statement 'The annual exceedance probability is 0.02,' without defining the term. Listeners interpret the value as a two-per-cent chance over the entire 30-year design life. What is the most useful correction?",
    "options": [
      "Leave the statement unchanged because the numerical probability is mathematically precise.",
      "Replace the technical result with 'the site is safe' because detailed probabilities can confuse audiences.",
      "State that 0.02 means exactly two floods will happen during a century, regardless of randomness.",
      "Explain that 0.02 represents an estimated 2% chance in each year under the model assumptions, distinguish it from cumulative 30-year risk, and communicate uncertainty."
    ],
    "answer": 3,
    "optionRationales": [
      "A mathematically correct value is not effective communication when its timescale is misunderstood.",
      "An unqualified safety claim suppresses material risk information.",
      "A probability is not a deterministic timetable for the number or occurrence of events.",
      "Clear time reference, plain-language meaning and model limitations permit better-informed interpretation."
    ],
    "keyPoint": "Communicate probability with a clear time basis rather than as an unexplained decimal.",
    "trap": "Conflating annual exceedance probability with fixed lifetime risk or a deterministic recurrence schedule.",
    "sources": [
      {
        "sourceType": "federal-public-guidance",
        "title": "Natural Resources Canada, Flood Mapping Guidelines Series",
        "locator": "Communication of flood hazard probability, return period and annual exceedance probability",
        "url": "https://natural-resources.canada.ca/science-and-data/science-and-research/natural-hazards/flood-mapping"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "III.10 — numbered primary topic, last checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "I.1",
    "sub": "nppe-professionalism",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-b-self-regulation-independent-disciplinary-judgment",
    "learningObjective": "Recognize that public-protection duties take precedence over professional members' reputational interests.",
    "jurisdiction": "Canada; hypothetical regulator has statutory power to investigate competence concerns and members demand that it avoid public enforcement for reputational reasons.",
    "stem": "A group of professional members asks their regulator to stop investigating substantiated public-safety complaints against registrants, arguing that public proceedings may harm the profession's reputation. The regulator's mandate is public protection. Which principle of professional self-regulation best addresses this request?",
    "options": [
      "Independent public-interest regulation requires fair assessment and appropriate action on credible complaints even when doing so is uncomfortable for members.",
      "The regulator's only duty is protecting members from reputational harm, regardless of public risk.",
      "All complaints must produce a disciplinary conviction before evidence is examined.",
      "The regulator may ignore statutory responsibilities whenever members vote unanimously."
    ],
    "answer": 0,
    "optionRationales": [
      "Public-interest oversight includes evidence-based investigation and fair processes, not automatic suppression for image management.",
      "Self-regulatory privilege is not a mandate to prioritize members' interests over public protection.",
      "A credible complaint initiates evaluation, not a pre-determined guilt finding.",
      "Professional members' preferences do not enlarge or erase statutory regulatory duties."
    ],
    "keyPoint": "Self-regulatory legitimacy depends on impartial protection of the public rather than shielding members.",
    "trap": "Equating professional solidarity with immunity from credible public-protection oversight.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Guideline on the code of ethics",
        "locator": "Principles 1, 2, 4–11: truthful professional statements, competent supervision, public safety, integrity and confidentiality; nonbinding national guidance",
        "url": "https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "I.1 — numbered primary topic, last checked 2026-10-18",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  }
];
 function escape(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 questions.forEach(function(q,i){
  var id=String(i+371),simulatedUnscored=false;
  Object.assign(q,{qid:'nppe:set-1:mock-b:'+id,legacyId:'NPPE-'+id,version:1,batch:10,authorSet:1,author:'ChatGPT',form:'set-1-mock-b',bank:'mock',set:1,original:true,scored:!simulatedUnscored,experimental:simulatedUnscored,releaseStatus:'held',reviewStatus:'author/editor preliminary review; independent SME/legal review and empirical calibration pending',area:q.blueprint.split('.')[0],verifiedAt:'2026-10-18',blueprintVersion:'published 2017 NPPE blueprint, checked 2026-10-18',difficultyBasis:'Provisional editorial estimate; not empirically calibrated'});
  if(id==='380'){q.version=2;q.editorialReviewedAt='2026-10-18';q.reviewStatus+='; simulated role redistributed by whole-form audit';}
  if(q.options.length!==4||new Set(q.options).size!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||q.optionRationales.length!==4||q.optionRationales.some(function(t){return t.length<35;})||!q.sources.some(function(s){return s.sourceType==='official-blueprint';})||!q.sources.some(function(s){return s.sourceType!=='official-blueprint';}))throw new Error('Invalid Mock B Batch 10 item '+id);
  q.why='<p>'+escape(q.optionRationales[q.answer])+'</p><p><strong>Key learning point:</strong> '+escape(q.keyPoint)+'</p><p><strong>Common error:</strong> '+escape(q.trap)+'</p><p><strong>Sources:</strong> '+q.sources.map(function(s){return '<a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer">'+escape(s.title)+'</a> — '+escape(s.locator)+' ['+escape(s.sourceType)+']';}).join('; ')+'.</p><p>Original held Mock B item. Editorial classifications are provisional and no NPPE pass prediction is implied.</p>';
 });
 var prior=global.NPPE_MOCK_B,prev=[global.NPPE_MOCK_B_BATCH1,global.NPPE_MOCK_B_BATCH2,global.NPPE_MOCK_B_BATCH3,global.NPPE_MOCK_B_BATCH4,global.NPPE_MOCK_B_BATCH5,global.NPPE_MOCK_B_BATCH6,global.NPPE_MOCK_B_BATCH7,global.NPPE_MOCK_B_BATCH8,global.NPPE_MOCK_B_BATCH9];
 if(!Array.isArray(prior)||prev.some(function(b){return !Array.isArray(b)||b.length!==10;})||prev.some(function(b,k){return b.some(function(q,i){return prior[k*10+i]!==q;});}))throw new Error('Mock B Batches 1–9 must load before Batch 10');
 if(prior.length===100){
  if(questions.some(function(q,i){return JSON.stringify(q)!==JSON.stringify(prior[90+i]);}))throw new Error('Conflicting Mock B Batch 10 reload');
  global.NPPE_MOCK_B_BATCH10=prior.slice(90);
 }else{
  if(prior.length!==90)throw new Error('Unexpected partial Mock B bank before Batch 10');
  Array.prototype.push.apply(prior,questions);global.NPPE_MOCK_B_BATCH10=questions.slice();
 }
})(typeof window!=='undefined'?window:globalThis);
