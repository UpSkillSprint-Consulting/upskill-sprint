/* Original Set 1 Mock A Batch 8. Protected delivery only; partial mock stays disabled. */
(function(global){
 'use strict';
 var questions=[
  {
    "blueprint": "I.3",
    "sub": "nppe-professionalism",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-software-safeguarding-scope-not-physical-deliverable",
    "learningObjective": "Recognize engineering practice in safety-critical software work.",
    "jurisdiction": "Canada; high-level Engineers Canada advisory definition, not a ruling under any particular provincial statute. The work requires engineering principles and safeguards life; title restrictions and statutory exceptions are not being decided.",
    "stem": "A team applies engineering principles to design software that controls the braking of an automated passenger shuttle. A manager says the work cannot be engineering because the deliverable is code rather than a physical component. Under the national guidance, which assessment is best?",
    "options": [
      "The absence of a manufactured component places the work outside engineering, even when it controls passenger safety.",
      "All software development is engineering, including routine applications that require no engineering principles or safeguarding analysis.",
      "The employer’s choice of job title determines the scope, regardless of the activities performed or their consequences.",
      "The activities, engineering principles and safeguarding purpose can bring this software work within engineering practice."
    ],
    "answer": 3,
    "optionRationales": [
      "Engineering practice is not limited to producing physical components; software can control a safety-critical system.",
      "The guidance uses substantive criteria and does not classify every programming activity as engineering.",
      "A job title does not replace assessment of the actual work against the applicable definition.",
      "The stipulated design activity, engineering principles and safeguarding purpose meet the national paper’s conceptual criteria."
    ],
    "keyPoint": "Assess the nature of software work, not just its medium.",
    "trap": "Equating engineering exclusively with tangible hardware.",
    "sources": [
      {
        "sourceType": "national-nonbinding-guidance",
        "title": "Engineers Canada, Paper on professional practice in software engineering",
        "locator": "Section 4 and subsections 4.1–4.3; national advisory criteria and jurisdictional qualifications",
        "url": "https://engineerscanada.ca/guidelines-and-papers/engineers-canada-paper-on-professional-practice-in-software-engineering"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "I.3 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "II.2",
    "sub": "nppe-ethics",
    "difficulty": "easy",
    "cognitiveLevel": "understanding",
    "questionFamily": "mock-a-duty-reasoning-false-promise-universal-rule",
    "learningObjective": "Recognize duty-based reasoning applied to a deceptive promise.",
    "jurisdiction": "Ethical theory in a Canadian professional setting; identifies the reasoning used, not a legal rule or a claim that every ethical theory yields the same answer.",
    "stem": "An engineer rejects making a promise that the engineer already intends to break. The stated reason is that a rule allowing everyone to make such promises whenever convenient would undermine the practice of promising itself. Which ethical approach does this reasoning most directly illustrate?",
    "options": [
      "An expected-utility calculation comparing the total monetary gains and losses of the available actions.",
      "Duty-based reasoning that tests whether the proposed rule of action could be universalized consistently.",
      "A customary-practice test that treats the most popular behaviour in the engineer’s office as decisive.",
      "A character assessment based solely on whether the engineer usually appears confident to colleagues."
    ],
    "answer": 1,
    "optionRationales": [
      "The engineer does not compare aggregate expected gains and losses; that is a different form of reasoning.",
      "The reasoning tests the consistency of a universal rule, characteristic of Kantian duty ethics.",
      "The argument examines a proposed universal principle rather than counting how many colleagues act that way.",
      "The argument concerns a rule of action, not an inference from confidence or a general character impression."
    ],
    "keyPoint": "Identify the reason offered for a choice, not merely whether the choice seems desirable.",
    "trap": "Labelling every beneficial or honest decision utilitarian without examining its justification.",
    "sources": [
      {
        "sourceType": "academic-ethics-reference",
        "title": "Stanford Encyclopedia of Philosophy, Kant’s Moral Philosophy",
        "locator": "Section 5, The Formula of the Universal Law of Nature: deceptive-promise example",
        "url": "https://plato.stanford.edu/entries/kant-moral/"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "II.2 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "III.5",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-emergency-drill-failed-contact-correct-and-retest",
    "learningObjective": "Use exercise findings to improve and verify emergency preparedness.",
    "jurisdiction": "Canada; CCOHS general emergency-planning guidance. This is a safe scheduled exercise, not an actual emergency; no statutory drill interval is assumed.",
    "stem": "A plant’s emergency plan assigns an external response team to manage a chemical release. During a scheduled drill, staff discover that the listed contact number is obsolete and no backup contact is available. Management proposes recording the plan as validated because everyone attended. What should the engineer recommend?",
    "options": [
      "Correct the contact arrangements and responsibilities, then test the revised activation process and document the results.",
      "Remove the failed call from the drill record because exercises assess staff participation rather than response arrangements.",
      "Approve the plan because attendance demonstrates that the outside response team can be reached during an actual release.",
      "Retain the existing arrangements until a real emergency establishes whether the unreachable contact causes material delay."
    ],
    "answer": 0,
    "optionRationales": [
      "The finding identifies an operational gap requiring correction and evidence that the revised arrangements work.",
      "The failed contact is a relevant finding; omitting it defeats the exercise’s improvement purpose.",
      "Attendance does not demonstrate that the required response resource can be activated.",
      "A planned exercise is intended to reveal gaps before an emergency, not to defer them until harm is possible."
    ],
    "keyPoint": "An emergency exercise provides evidence to improve the response, not just an attendance record.",
    "trap": "Treating completion of a drill as proof that every tested function succeeded.",
    "sources": [
      {
        "sourceType": "primary-government-guidance",
        "title": "CCOHS, Emergency Planning",
        "locator": "Sections on external resources and testing/revision: drills, immediate review and improvement",
        "url": "https://www.ccohs.ca/oshanswers/hsprograms/planning.html"
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
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-repairable-module-retains-product-value",
    "learningObjective": "Recognize repair and reuse as distinct circular-economy measures.",
    "jurisdiction": "Canada; general sustainability guidance. Safety, required performance and maintainability of the proposed replacement module are established; no claim of overall life-cycle superiority is assumed.",
    "stem": "A monitoring unit is discarded whenever its small power module fails, although the housing and sensing assembly remain serviceable. A redesign permits safe replacement of that module and continued use of the rest of the unit. What sustainability benefit does this change most directly provide?",
    "options": [
      "It demonstrates that the unit consumes no energy in service, because a replaceable module eliminates operating demand.",
      "It proves that every life-cycle environmental impact is lower, without comparing materials, transport or repair activities.",
      "It retains the useful product and its components through repair, reducing the need to discard the whole unit.",
      "It converts disposal into recycling even if the failed module and all replaced materials are sent to landfill."
    ],
    "answer": 2,
    "optionRationales": [
      "Repairability does not eliminate the unit’s operating-energy requirement.",
      "The identified benefit does not establish every environmental outcome; a broader comparison requires additional evidence.",
      "Repair can extend useful service and preserve product value rather than replacing an otherwise serviceable assembly.",
      "Repair and recycling are different processes, and sending material to landfill does not become recycling by description."
    ],
    "keyPoint": "Repair can preserve product value before material recovery is needed.",
    "trap": "Treating all circular-economy measures as recycling or as proof of zero impact.",
    "sources": [
      {
        "sourceType": "primary-government-guidance",
        "title": "Environment and Climate Change Canada, Retaining product value in a circular economy",
        "locator": "Value-retention processes; repair, reuse and extension of service life",
        "url": "https://www.canada.ca/en/services/environment/conservation/sustainability/circular-economy/retaining-product-value-circular-economy.html"
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
    "blueprint": "III.10",
    "sub": "nppe-practice",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-annual-flood-probability-not-century-clock",
    "learningObjective": "Communicate a return-period estimate without implying a scheduled interval.",
    "jurisdiction": "Canada; a simplified stationary annual-exceedance model is expressly retained for this question. The estimate is not updated by the described observation; real flood studies must reassess assumptions and uncertainty as appropriate.",
    "stem": "A public briefing describes a modelled flood level as having a 1% annual chance of being exceeded. That level was exceeded last year. Under the unchanged model, a draft says the community is now protected from another such exceedance for 99 years. Which correction should the engineer make?",
    "options": [
      "Last year’s exceedance uses up the model’s one permitted event, leaving no chance of another until the century ends.",
      "The return period guarantees equally spaced events, so the next exceedance must occur exactly 100 years after the last.",
      "A second exceedance would itself prove that the previous event was incorrectly measured, regardless of the model assumptions.",
      "The percentage describes annual exceedance probability; it does not create a protected interval after an event."
    ],
    "answer": 3,
    "optionRationales": [
      "An annual probability is not a quota of one event per century.",
      "A return period is not a deterministic timetable for individual floods.",
      "Repeated exceedances are possible; their occurrence alone does not establish a measurement error.",
      "The stated model assigns annual probability, and the return-period terminology does not guarantee event-free years."
    ],
    "keyPoint": "A return period is not a waiting-time guarantee.",
    "trap": "Turning a probabilistic risk description into a calendar promise.",
    "sources": [
      {
        "sourceType": "primary-government-guidance",
        "title": "Natural Resources Canada, Federal Flood Mapping Guidelines — Terminology",
        "locator": "Annual exceedance probability and return-period definitions; verified through indexed official text",
        "url": "https://natural-resources.canada.ca/science-data/science-research/natural-hazards/flood-mapping/federal-flood-mapping-guidelines-terminology"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "III.10 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "IV.7",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-descriptive-trademark-not-cleared-by-empty-search",
    "learningObjective": "Distinguish a clear trademark search from satisfaction of other registration requirements.",
    "jurisdiction": "Canada; proposed word mark is stipulated to be clearly descriptive of the services in English, with no acquired distinctiveness at filing. No special statutory exception applies. This is not a definitive assessment of a real proposed mark.",
    "stem": "A new testing business proposes a word mark that clearly describes the quality of its services. It has acquired no distinctiveness through use. A search finds no identical registered mark. The manager says the search therefore guarantees registration. What is the correct advice?",
    "options": [
      "Paying the application fee converts a clearly descriptive expression into a distinctive mark without further examination.",
      "The absence of an identical registration guarantees acceptance, regardless of the words’ descriptive meaning for the services.",
      "A clear search does not remove the separate bar for a clearly descriptive mark lacking the required distinctiveness.",
      "Any English words are ineligible for registration, even where they distinguish a business rather than describe its services."
    ],
    "answer": 2,
    "optionRationales": [
      "Payment starts an application process; it does not establish distinctiveness or remove statutory objections.",
      "The search addresses only part of the assessment and does not establish compliance with section 12.",
      "Registration has requirements beyond avoiding identical marks; the stipulated descriptive mark does not qualify under the distinctiveness exception.",
      "Words can function as trademarks; the problem here is the stipulated descriptiveness and lack of acquired distinctiveness."
    ],
    "keyPoint": "An available name is not necessarily a registrable trademark.",
    "trap": "Treating a search result as a legal guarantee of registration.",
    "sources": [
      {
        "sourceType": "primary-legislation",
        "title": "Trademarks Act, R.S.C. 1985, c. T-13",
        "locator": "Section 12(1)(b) and 12(3): clearly descriptive marks and distinctiveness at filing",
        "url": "https://laws-lois.justice.gc.ca/eng/acts/t-13/section-12.html"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "IV.7 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "IV.13",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-consent-withdrawal-not-automatic-record-erasure",
    "learningObjective": "Distinguish stopping optional data use from overriding a lawful retention obligation.",
    "jurisdiction": "Canada; PIPEDA applies. Counsel confirms that a specific legal retention requirement covers the transaction record, but provides no authority for continued optional promotional use. Reasonable notice has been given; no other exception is assumed.",
    "stem": "A customer withdraws consent for a consulting firm’s optional promotional use of personal information and asks for every record to be erased. A transaction record must still be retained under an applicable legal requirement confirmed by counsel. Which response best respects both obligations?",
    "options": [
      "Stop the optional use, explain the retention restriction, and safeguard the record for its required purpose and period.",
      "Erase the legally required record immediately because consent withdrawal always overrides any statutory retention obligation.",
      "Continue promotional use because retaining one transaction record makes the customer’s withdrawal ineffective for every purpose.",
      "Keep every personal record indefinitely because a legal retention requirement for one record authorizes unrestricted retention."
    ],
    "answer": 0,
    "optionRationales": [
      "The firm must respect withdrawal where applicable while explaining and limiting legally required retention.",
      "Withdrawal is subject to legal restrictions; it does not nullify the stipulated retention obligation.",
      "A limited retention requirement does not authorize unrelated promotional use after valid withdrawal.",
      "A specific obligation does not justify indefinite retention of all information for unrelated purposes."
    ],
    "keyPoint": "Consent withdrawal and record-retention duties must be assessed by purpose.",
    "trap": "Assuming either total erasure or unrestricted continued use must follow.",
    "sources": [
      {
        "sourceType": "privacy-regulator-guidance",
        "title": "Office of the Privacy Commissioner of Canada, PIPEDA Fair Information Principle 3 — Consent",
        "locator": "Withdrawal subject to legal/contractual restrictions and reasonable notice; explanation of implications",
        "url": "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_consent/"
      },
      {
        "sourceType": "primary-legislation",
        "title": "Personal Information Protection and Electronic Documents Act",
        "url": "https://laws.justice.gc.ca/eng/acts/P-8.6/FullText.html",
        "locator": "Schedule 1, clauses 4.3.8, 4.5, 4.5.2–4.5.3 and 4.7: withdrawal, lawful retention and safeguards"
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
    "blueprint": "IV.6",
    "sub": "nppe-law",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-arbitrator-preappointment-financial-relationship-disclosure",
    "learningObjective": "Recognize disclosure required before accepting an arbitral appointment.",
    "jurisdiction": "Ontario; domestic commercial arbitration under the Arbitration Act, 1991. The relationship is stipulated to be capable of giving rise to a reasonable apprehension of bias. No informed prior disclosure or waiver exists; the question does not decide a later challenge.",
    "stem": "An engineer is approached to arbitrate a domestic equipment dispute. The engineer’s consulting business currently receives substantial work from one party, a circumstance capable of raising a reasonable apprehension of bias. The engineer believes personal judgment will remain fair. What must happen before accepting the appointment?",
    "options": [
      "Disclose the relationship only to the paying party, since the other party has no contractual relationship with the consultant.",
      "Accept without disclosure because technical expertise removes any concern about financial relationships with a disputing party.",
      "Wait until after issuing the award to disclose the relationship, so the parties cannot question the engineer during the hearing.",
      "Disclose the relevant circumstances to all parties before accepting; personal confidence in fairness does not replace disclosure."
    ],
    "answer": 3,
    "optionRationales": [
      "The statutory pre-appointment disclosure obligation is to all parties, not only the existing customer.",
      "Technical competence and impartiality are separate requirements; expertise does not neutralize the disclosed financial circumstances.",
      "Post-award disclosure would not satisfy the specified obligation before accepting appointment.",
      "Section 11 requires pre-appointment disclosure of known circumstances that may create a reasonable apprehension of bias."
    ],
    "keyPoint": "Arbitral independence requires transparency about circumstances that may indicate bias.",
    "trap": "Substituting subjective confidence for the statutory disclosure test.",
    "sources": [
      {
        "sourceType": "primary-legislation",
        "title": "Ontario Arbitration Act, 1991, S.O. 1991, c. 17",
        "locator": "Section 11(1)–(2): independence, impartiality and disclosure before appointment; indexed official text",
        "url": "https://www.ontario.ca/laws/statute/91a17"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "IV.6 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  },
  {
    "blueprint": "VI.1",
    "sub": "nppe-discipline",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-section33-investigator-request-not-dependent-on-guilt",
    "learningObjective": "Recognize cooperation with a lawful regulatory investigation as a distinct obligation.",
    "jurisdiction": "Ontario; a duly authorized section 33 investigator makes a lawful request for relevant, available, non-privileged records. Authority and scope are confirmed, no court order stays the request, and no privilege or other lawful objection is asserted.",
    "stem": "A PEO investigator acting under section 33 requests relevant project records from a licence holder. The request is lawful and the records are available and non-privileged. The engineer refuses solely because the underlying complaint is believed to be unfounded. Which statement best addresses that refusal?",
    "options": [
      "The engineer may withhold the records until the investigator proves the original allegation beyond a reasonable doubt.",
      "Failure to supply the requested records can itself be misconduct, separately from the merits of the original complaint.",
      "Supplying the records would legally admit every allegation, so refusal is the required way to preserve a defence.",
      "The engineer’s belief in innocence automatically suspends the request until a civil court has tried the project dispute."
    ],
    "answer": 1,
    "optionRationales": [
      "The cooperation obligation is not conditional on first proving the underlying allegation to a criminal standard.",
      "Regulation 941 identifies failure to supply information or documents requested by a section 33 investigator as misconduct.",
      "Providing records is not itself an admission of every allegation and does not remove the right to respond.",
      "A personal belief in innocence does not create a stay of the confirmed lawful request."
    ],
    "keyPoint": "Cooperation with an investigation is distinct from admitting the allegation.",
    "trap": "Treating disagreement with a complaint as authority to ignore a lawful request.",
    "sources": [
      {
        "sourceType": "regulator-published-legislation",
        "title": "PEO, Professional Misconduct — Regulation 941, section 72",
        "locator": "Section 72(2)(l), regulator-published statutory text; limited specifically to section 33 investigations",
        "url": "https://www.peo.on.ca/about-peo/what-peo/acts-regulations-and-laws/professional-misconduct-section-72-regulation-o-reg"
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
    "blueprint": "II.1",
    "sub": "nppe-ethics",
    "difficulty": "medium",
    "cognitiveLevel": "application",
    "questionFamily": "mock-a-prevalent-custom-not-sufficient-ethical-justification",
    "learningObjective": "Distinguish evidence of common behaviour from a reasoned ethical justification.",
    "jurisdiction": "Ethical reasoning in a Canadian professional workplace; no inference that every local custom is wrong, and no legal offence or cultural stereotype is assumed.",
    "stem": "A survey finds that most teams in an organization omit affected junior staff from discussions about how undesirable assignments are allocated. A manager argues that this prevalence alone proves the practice is ethically justified. What is the best assessment of that reasoning?",
    "options": [
      "The survey describes common behaviour; ethical justification still requires examining the reasons, fairness and effects of the practice.",
      "A majority preference settles the ethical question, so reasons concerning affected staff cannot alter the conclusion.",
      "A common practice must be unethical precisely because many people follow it, regardless of its reasons or effects.",
      "The survey conclusively establishes a criminal offence even though it contains no analysis of any applicable legal rule."
    ],
    "answer": 0,
    "optionRationales": [
      "Descriptive information about what people do does not, by itself, establish what they ought to do.",
      "Popularity alone is not a reasoned evaluation of the treatment of affected people.",
      "Rejecting popularity as sufficient justification does not make popularity proof of wrongdoing.",
      "An empirical observation about practice does not establish the elements of a criminal offence."
    ],
    "keyPoint": "Describing a custom and justifying it are different tasks.",
    "trap": "Treating the frequency of a practice as conclusive moral authority.",
    "sources": [
      {
        "sourceType": "academic-ethics-reference",
        "title": "Stanford Encyclopedia of Philosophy, Moral Relativism",
        "locator": "Sections 2, 4 and 8: descriptive claims distinguished from normative conclusions",
        "url": "https://plato.stanford.edu/entries/moral-relativism/"
      },
      {
        "sourceType": "official-blueprint",
        "title": "NPPE, published 2017 blueprint",
        "locator": "II.1 — primary topic; see Mock A development plan",
        "url": "https://www.nppexam.ca/en/preparation/blueprint/"
      }
    ]
  }
];
 function escape(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 questions.forEach(function(q,i){
   var id=String(i+241).padStart(3,'0');
   Object.assign(q,{qid:'nppe:set-1:mock-a:'+id,legacyId:'NPPE-'+id,version:1,batch:8,authorSet:1,author:'ChatGPT',form:'set-1-mock-a',bank:'mock',set:1,original:true,scored:i!==9,experimental:i===9,releaseStatus:'released',reviewStatus:'editorial source review; independent SME/legal review and empirical calibration pending',area:q.blueprint.split('.')[0],verifiedAt:'2026-10-16',blueprintVersion:'2017 official NPPE blueprint current on 2026-10-16',difficultyBasis:'Editorial estimate; not empirically calibrated'});
   // Whole-form editorial revision; IDs and answer positions are preserved.
   if(["250"].indexOf(id)!==-1){q.version=2;q.editorialReviewedAt='2026-10-18';}
   q.scored=true;q.experimental=false;
   if(q.options.length!==4||new Set(q.options).size!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3||q.optionRationales.length!==4||!q.sources.length)throw new Error('Invalid Mock A item '+id);
   q.why='<p>'+escape(q.optionRationales[q.answer])+'</p><p><strong>Key learning point:</strong> '+escape(q.keyPoint)+'</p><p><strong>Common error:</strong> '+escape(q.trap)+'</p><p><strong>Sources:</strong> '+q.sources.map(function(s){return '<a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer">'+escape(s.title)+'</a> — '+escape(s.locator)+' ['+escape(s.sourceType)+']';}).join('; ')+'.</p><p>Original Mock A item. Editorial classifications are provisional; practice scores do not predict an official NPPE result.</p>';
 });

 var prerequisites=[global.NPPE_MOCK_A_BATCH1,global.NPPE_MOCK_A_BATCH2,global.NPPE_MOCK_A_BATCH3,global.NPPE_MOCK_A_BATCH4,global.NPPE_MOCK_A_BATCH5,global.NPPE_MOCK_A_BATCH6,global.NPPE_MOCK_A_BATCH7];
 if(!Array.isArray(global.NPPE_MOCK_A)||prerequisites.some(function(batch){return !Array.isArray(batch)||batch.length!==10;}))throw new Error('Mock A Batches 1–7 must load before Batch 8');
 var existing=global.NPPE_MOCK_A,prior=Array.prototype.concat.apply([],prerequisites);
 if(prior.some(function(q,i){return q.qid!=='nppe:set-1:mock-a:'+String(171+i)||existing[i]!==q;}))throw new Error('Unexpected Mock A prerequisites before Batch 8');
 var matches=questions.map(function(q){return existing.find(function(old){return old.qid===q.qid||old.legacyId===q.legacyId;});});
 if(matches.some(Boolean)){
   if(!matches.every(function(old,i){return old&&old===existing[70+i]&&JSON.stringify(old)===JSON.stringify(questions[i]);}))throw new Error('Conflicting Mock A Batch 8 items');
   global.NPPE_MOCK_A_BATCH8=matches;
 }else{
   if(existing.length!==70)throw new Error('Unexpected Mock A bank before Batch 8');
   Array.prototype.push.apply(existing,questions);
   global.NPPE_MOCK_A_BATCH8=questions.slice();
 }
})(typeof window!=='undefined'?window:globalThis);
