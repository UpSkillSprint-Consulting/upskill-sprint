/* Original Set 1 Diagnostic Batch 3: NPPE-021–030. Not publisher test items. */
(function (global) {
  'use strict';
  var questions = [
    {
      blueprint: 'I.4', sub: 'nppe-professionalism', difficulty: 'medium', cognitiveLevel: 'application',
      learningObjective: 'Recognize the wider societal value of engineering and geoscience work.',
      questionFamily: 'societal-value-service-outcomes',
      jurisdiction: 'Canada; professional purpose, not a jurisdiction-specific legal rule.',
      stem: 'A municipality asks a project team to explain the public value of renewing its water infrastructure. The proposal already states the construction cost and number of temporary jobs. Which addition would best explain the wider contribution of engineering and geoscience to society?',
      options: [
        'The proportion of the project budget paid to licensed professionals and specialist consultants.',
        'The number of design calculations and technical reports produced before construction begins.',
        'How the work supports safe, reliable water service, resource stewardship and community well-being.',
        'How the completed project could improve the design firm\'s position in future competitions.'
      ],
      answer: 2,
      optionRationales: [
        'Professional fees describe an input to the project, not the principal benefits received by the community.',
        'Calculations and reports support delivery, but their quantity does not demonstrate the value of the resulting public service.',
        'This connects professional work to useful outcomes for people and the environment rather than treating expenditure or technical activity as the benefit itself.',
        'Competitive advantage may benefit the firm, but it does not explain the wider value received by the public.'
      ],
      keyPoint: 'Explain professional value through the services and benefits society receives, not merely the work performed.',
      trap: 'Confusing project inputs and professional prestige with public outcomes.',
      sources: [
        {sourceType: 'textbook', title: 'Andrews, Shaw and McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed. (2019)', locator: 'Ch. 1, pp. 1 and 9: public welfare, resources and societal needs'},
        {sourceType: 'blueprint', title: 'Official NPPE blueprint', locator: 'I.4 — The Value of Engineering and Geoscience Professions to Society', url: 'https://www.nppexam.ca/en/preparation/blueprint/'}
      ]
    },
    {
      blueprint: 'II.2', sub: 'nppe-ethics', difficulty: 'easy', cognitiveLevel: 'understanding',
      learningObjective: 'Identify consequentialist reasoning from its stated basis rather than from the decision alone.',
      questionFamily: 'utilitarian-benefit-burden-reasoning',
      jurisdiction: 'Ethical theory; no particular statute is assumed.',
      stem: 'When comparing two public-facility designs, a committee member argues: "We should compare the benefits and burdens for everyone affected, including how serious and lasting they are, and select the option with the greatest net benefit." Which ethical perspective most directly matches this stated reasoning?',
      options: [
        'Utilitarianism: assess the consequences for the people affected.',
        'Duty ethics: follow a universal obligation independently of the consequences.',
        'Rights ethics: begin with each individual\'s fundamental entitlements.',
        'Virtue ethics: focus on the character and dispositions of the decision-maker.'
      ],
      answer: 0,
      optionRationales: [
        'Comparing the benefits and burdens across affected people, including their intensity and duration, is consequence-based utilitarian reasoning.',
        'The argument does not rely on an unconditional rule. It explicitly makes consequences the basis for choosing.',
        'No particular individual entitlement is offered as the starting point of the argument, although a separate rights analysis may still be relevant.',
        'The argument evaluates outcomes rather than the decision-maker\'s character. Different theories may support the same design for different reasons.'
      ],
      keyPoint: 'Identify an ethical theory from the reason offered, not simply whether the proposed decision seems desirable.',
      trap: 'Assuming every argument for public benefit uses the same ethical theory.',
      sources: [
        {sourceType: 'textbook', title: 'Andrews, Shaw and McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed. (2019)', locator: 'Ch. 9, section 9.2, pp. 206–210: the four ethical theories'}
      ]
    },
    {
      blueprint: 'II.4', sub: 'nppe-ethics', difficulty: 'medium', cognitiveLevel: 'application',
      learningObjective: 'Distinguish reusable professional expertise from a former client\'s confidential information.',
      questionFamily: 'former-client-proprietary-data',
      jurisdiction: 'Canada; the stated confidentiality agreement remains in force, with no disclosure exception engaged.',
      stem: 'A geoscience consultant retains a former client\'s confidential, unpublished dataset under an agreement that prohibits its use for other clients without permission. A new client proposes removing the former client\'s name and using the dataset to avoid new fieldwork. No legal disclosure requirement or public-safety issue is involved. What is the best response?',
      options: [
    "Use the dataset after removing identifying names because the source would no longer be obvious.",
    "Use the dataset if the new client signs its own confidentiality agreement with the consultant.",
    "Wait until the former engagement has been closed for a year, then treat the dataset as general expertise.",
    "Obtain permission from the former client or use independently acquired information."
  ],
      answer: 3,
      optionRationales: [
        'Removing a name does not change the stated restriction on using the underlying proprietary information.',
        'An agreement with the new client does not provide the authorization required from the former client.',
        'The stem provides no expiry after a year. Experience and general skills are not the same as a protected dataset.',
        'This respects the continuing restriction while leaving a legitimate route to the assignment through consent or independently obtained information.'
      ],
      keyPoint: 'A completed engagement does not, by itself, turn confidential client information into a reusable professional resource.',
      trap: 'Treating anonymization or possession of a copy as permission to reuse proprietary information.',
      sources: [
        {sourceType: 'textbook', title: 'Andrews, Shaw and McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed. (2019)', locator: 'Ch. 12, section 12.5, p. 285: former-client trade secrets and confidentiality'},
        {sourceType: 'primary-guidance', title: 'Engineers Canada, Guideline on the code of ethics', locator: 'Faithful-agent and confidentiality guidance; national guidance is not itself a regulation', url: 'https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics'}
      ]
    },
    {
      blueprint: 'III.4', sub: 'nppe-practice', difficulty: 'medium', cognitiveLevel: 'application',
      learningObjective: 'Apply professional judgment when minimum code provisions do not address a known site-specific hazard.',
      questionFamily: 'code-minimum-known-site-hazard',
      jurisdiction: 'Canada; applicable mandatory code requirements remain binding.',
      stem: 'A design meets the applicable mandatory code. However, a verified site investigation identifies an unusual loading condition that the code\'s minimum provisions do not adequately address. Additional protection can be designed without breaching the code. The client asks to retain the minimum design. What should the engineer do?',
      options: [
    "Accept the minimum design and record that it meets the mandatory code.",
    "Address the verified loading condition and explain the limitations of the code minimum.",
    "Accept the minimum design after the client acknowledges the additional risk in writing.",
    "Leave the design unchanged until the authority responsible for the code publishes a revision."
  ],
      answer: 1,
      optionRationales: [
        'Recording compliance does not resolve the verified hazard that the minimum provisions fail to address.',
        'Mandatory requirements still apply, but knowledge of an inadequately addressed condition calls for an appropriate technical response rather than reliance on the minimum alone.',
        'Client acknowledgment does not make an inadequately protective design technically acceptable or eliminate professional duties.',
        'A known hazard does not become acceptable merely because the code revision process has not yet addressed it.'
      ],
      keyPoint: 'Compliance with minimum provisions does not replace professional judgment about known conditions.',
      trap: 'Treating code compliance as a complete answer to evidence that the design remains inadequate.',
      sources: [
        {sourceType: 'textbook', title: 'Samuels and Sanders, Practical Law of Architecture, Engineering, and Geoscience, Canadian ed. (2007)', locator: 'Ch. 13, section 13.5, pp. 149–150: knowledge of inadequate code provisions'},
        {sourceType: 'primary-guidance', title: 'Engineers Canada, Guideline on the code of ethics', locator: 'Public protection, diligent practice and applicable standards; guidance rather than legislation', url: 'https://engineerscanada.ca/guidelines-and-papers/public-guideline-on-the-code-of-ethics'}
      ]
    },
    {
      blueprint: 'III.5', sub: 'nppe-practice', difficulty: 'hard', cognitiveLevel: 'analysis',
      learningObjective: 'Distinguish a claims-made-and-reported timing trigger from the date professional services were performed.',
      questionFamily: 'claims-made-express-policy-dates',
      jurisdiction: 'Hypothetical Canadian professional-liability policy; only the express timing conditions are tested.',
      stem: 'A hypothetical claims-made-and-reported policy runs from January 1 to December 31, 2026, with a January 1, 2022 retroactive date. It requires the claim to be first made and reported during the policy period, and the relevant work to be after the retroactive date. A claim about work performed in 2023 is first made and reported in August 2026. Assume all other policy conditions are satisfied. Which conclusion follows from these timing provisions?',
      options: [
        'The timing conditions are satisfied even though the work predates the current policy period.',
        'The timing conditions fail because both the work and the claim must fall within calendar year 2026.',
        'Only the policy in force when the work was performed can respond, regardless of the stated trigger.',
        'The retroactive date makes the reporting requirement irrelevant for work performed after 2022.'
      ],
      answer: 0,
      optionRationales: [
        'The 2023 work is after the retroactive date, and both the first claim and report occur within the 2026 policy period. This addresses timing only, under the stated assumptions.',
        'The policy expressly permits work after January 1, 2022; it does not require that the services also occur during 2026.',
        'This substitutes a work-date trigger for the claims-made-and-reported wording supplied in the question.',
        'The retroactive date is an additional boundary on eligible work, not a replacement for the claim and reporting conditions.'
      ],
      keyPoint: 'Read each policy trigger separately: the work date, first-claim date and reporting date may all matter.',
      trap: 'Assuming professional-liability coverage is determined only by when the work was done.',
      sources: [
        {sourceType: 'textbook', title: 'Samuels and Sanders, Practical Law of Architecture, Engineering, and Geoscience, Canadian ed. (2007)', locator: 'Ch. 16, section 16.5, pp. 178–179: claims-made versus occurrence policies and reporting'},
        {sourceType: 'primary-program-guidance', title: 'Engineers Canada, Secondary Professional Liability Insurance — frequently asked questions', locator: 'Claims-made and reporting explanation; the hypothetical dates and wording above are not SPLIP policy terms', url: 'https://engineerscanada.ca/services/insurance-financial-and-other-benefits/secondary-professional-liability-insurance/frequently-asked-questions'}
      ]
    },
    {
      blueprint: 'III.6', sub: 'nppe-practice', difficulty: 'medium', cognitiveLevel: 'application',
      learningObjective: 'Recognize an incomplete environmental comparison caused by a narrow life-cycle boundary.',
      questionFamily: 'sustainability-life-cycle-boundary',
      jurisdiction: 'Canada; environmental-stewardship guidance, not a prescribed statutory assessment method.',
      stem: 'Two treatment-system options provide the same required service. One consumes less energy in operation, but requires more replacement media and generates a waste stream needing special handling. A supplier compares only operating energy and calls that option the more sustainable choice. What is the best next step before accepting the conclusion?',
      options: [
        'Accept the conclusion because the operational stage necessarily determines total environmental performance.',
        'Reject the option because producing more waste necessarily outweighs any reduction in energy use.',
        'Compare relevant life-cycle impacts and trade-offs using a consistent service basis before choosing.',
        'Compare purchase prices and leave environmental trade-offs to the supplier\'s marketing assessment.'
      ],
      answer: 2,
      optionRationales: [
        'Operational energy is relevant, but it does not account for replacement materials, waste handling or other life-cycle effects.',
        'This reverses the same error by assuming one indicator is decisive without evaluating the full comparison.',
        'A consistent service basis and relevant life-cycle boundaries allow the team to evaluate the identified trade-offs rather than assume a single indicator settles the choice.',
        'Purchase price alone omits the environmental and longer-term considerations that the supplier\'s claim requires the team to assess.'
      ],
      keyPoint: 'Evaluate sustainability across relevant life-cycle stages and trade-offs, not through one favourable indicator.',
      trap: 'Turning a reduction in one impact into an unsupported claim of superior total performance.',
      sources: [
        {sourceType: 'textbook', title: 'Andrews, Shaw and McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed. (2019)', locator: 'Ch. 13, section 13.4, pp. 311–312: stewardship and life-cycle planning'},
        {sourceType: 'primary-guidance', title: 'Engineers Canada, National guideline on sustainable development and environmental stewardship for professional engineers', locator: 'Sections 5.5–5.6: costs, benefits and life-cycle planning; advisory guidance', url: 'https://engineerscanada.ca/guidelines-and-papers/national-guideline-on-sustainable-development-and-environmental-stewardship-for-professional-engineers'}
      ]
    },
    {
      blueprint: 'IV.6', sub: 'nppe-law', difficulty: 'medium', cognitiveLevel: 'application',
      learningObjective: 'Distinguish ordinary mediation from a process that authorizes a binding adjudicated decision.',
      questionFamily: 'mediation-settlement-authority',
      jurisdiction: 'Canada; ordinary mediation, not mediation-arbitration or an agreed binding recommendation.',
      stem: 'A consultant and client agree to ordinary mediation of a fee dispute. Their agreement gives the mediator no authority to decide the dispute. The mediator proposes a compromise, but the client rejects it. The consultant says the mediator can nevertheless order the client to accept. Which response is correct?',
      options: [
        'The mediator may impose the compromise once each party has had an opportunity to speak.',
        'The proposal becomes binding if it is a reasonable estimate of the likely court outcome.',
        'Agreeing to attend mediation delegates final settlement authority to the mediator.',
        'The mediator can assist further negotiations but cannot impose a settlement under this agreement.'
      ],
      answer: 3,
      optionRationales: [
        'An opportunity to speak does not confer adjudicative authority that the agreement expressly withholds.',
        'A useful assessment of litigation risk remains a proposal; its perceived reasonableness does not make it an order.',
        'Participation in this mediation does not mean advance acceptance of whatever settlement the mediator recommends.',
        'The parties retain the decision whether to settle. A settlement they actually agree to may be binding, but that is different from a mediator imposing one.'
      ],
      keyPoint: 'Distinguish agreeing to participate in a process from authorizing someone else to decide the outcome.',
      trap: 'Confusing the mediator\'s influence with an arbitrator\'s decision-making authority.',
      sources: [
        {sourceType: 'textbook', title: 'Samuels and Sanders, Practical Law of Architecture, Engineering, and Geoscience, Canadian ed. (2007)', locator: 'Ch. 14, pp. 153 and 159–160: mediation and settlement'},
        {sourceType: 'primary-government-guidance', title: 'Department of Justice Canada, Dispute Resolution Reference Guide — Mediation', locator: 'Definition and characteristics: mediator assists but cannot impose a settlement', url: 'https://www.justice.gc.ca/eng/rp-pr/csj-sjc/dprs-sprd/res/drrg-mrrc/04.html'}
      ]
    },
    {
      blueprint: 'IV.8', sub: 'nppe-law', difficulty: 'medium', cognitiveLevel: 'analysis',
      learningObjective: 'Maintain an independent expert opinion when reliable new evidence weakens the retaining party\'s case.',
      questionFamily: 'expert-adverse-evidence-before-report',
      jurisdiction: 'Ontario civil proceedings governed by the Rules of Civil Procedure, rule 4.1.01.',
      stem: 'An engineer retained as an expert in an Ontario civil action is preparing a report. New, reliable inspection records undermine a key assumption in the draft and make the client\'s position less persuasive. Counsel asks the engineer to preserve the earlier conclusion because the other side will present its own expert. No report has yet been served. What is the best response?',
      options: [
    "Reassess the opinion using the new evidence and explain the independently supported conclusion.",
    "Give the records to counsel but leave the draft opinion unchanged unless counsel instructs otherwise.",
    "Disclose the records in a limitations appendix but keep the conclusion without examining their effect.",
    "Remove the disputed assumption from the report but postpone revising the conclusion until cross-examination."
  ],
      answer: 0,
      optionRationales: [
    "An expert must assess relevant evidence objectively. The duty to provide independent assistance is not displaced by the retaining party's litigation interests.",
    "An expert's duties of objectivity and independence require reassessment when reliable new information undermines the opinion, irrespective of counsel's preferences.",
    "A disclosure that is not incorporated into the substantive assessment does not remedy an opinion undermined by material new evidence.",
    "Dropping a material premise while preserving its unsupported conclusion is misleading; an expert must reassess before serving the opinion."
  ],
      keyPoint: 'A retained expert assists the court through an objectively supportable opinion, not advocacy disguised as expertise.',
      trap: 'Assuming competing experts make it acceptable for each expert to favour the party paying them.',
      sources: [
        {sourceType: 'textbook', title: 'Samuels and Sanders, Practical Law of Architecture, Engineering, and Geoscience, Canadian ed. (2007)', locator: 'Ch. 14, section 14.6, pp. 160–161: independent expert opinions'},
        {sourceType: 'primary-legislation', title: 'Ontario Rules of Civil Procedure, R.R.O. 1990, Reg. 194', locator: 'Rule 4.1.01(1)–(2): expert duties and their priority over obligations to the retaining party', url: 'https://www.ontario.ca/laws/regulation/900194'}
      ]
    },
    {
      blueprint: 'V.4', sub: 'nppe-professional-law', difficulty: 'easy', cognitiveLevel: 'understanding',
      learningObjective: 'Distinguish the knowledge-sharing role of a voluntary technical society from professional licensing.',
      questionFamily: 'technical-society-versus-regulator',
      jurisdiction: 'Canada; a voluntary technical society, not a statutory professional regulator.',
      stem: 'An engineer joins a voluntary technical society that publishes research, organizes specialist conferences and supports standards committees. What is the principal professional value of that membership?',
      options: [
        'It replaces the need to maintain registration with the applicable provincial or territorial regulator.',
        'It supports access to technical knowledge, peer exchange and continuing professional development.',
        'It gives the society statutory authority to investigate every licensing complaint against the engineer.',
        'It establishes the engineer\'s competence for every project within the society\'s subject area.'
      ],
      answer: 1,
      optionRationales: [
        'Membership in the voluntary society described is distinct from the authorization supplied by the professional regulator.',
        'Publishing research, convening practitioners and developing knowledge are the society\'s relevant functions in this scenario.',
        'The stem describes a knowledge-sharing society, not a body given statutory licensing and disciplinary powers.',
        'Access to learning opportunities is valuable, but membership alone does not establish task-specific competence.'
      ],
      keyPoint: 'Technical societies support professional knowledge and connections; do not confuse them with licensing bodies.',
      trap: 'Treating voluntary society membership as a licence or blanket proof of competence.',
      sources: [
        {sourceType: 'textbook', title: 'Andrews, Shaw and McPhee, Canadian Professional Engineering and Geoscience: Practice and Ethics, 6th ed. (2019)', locator: 'Ch. 18, sections 18.1–18.3, pp. 430–432'},
        {sourceType: 'blueprint', title: 'Official NPPE blueprint', locator: 'V.4 — Professional and Technical Societies', url: 'https://www.nppexam.ca/en/preparation/blueprint/'}
      ]
    },
    {
      blueprint: 'VI.3', sub: 'nppe-discipline', difficulty: 'medium', cognitiveLevel: 'application',
      learningObjective: 'Distinguish a routine BC firm compliance audit from a technical practice review or disciplinary finding.',
      questionFamily: 'bc-firm-audit-purpose',
      jurisdiction: 'British Columbia; Engineers and Geoscientists BC Firm Audit Program.',
      stem: 'A BC engineering firm receives notice of a routine compliance audit under Engineers and Geoscientists BC\'s Firm Audit Program. No complaint or allegation of misconduct is identified. A manager assumes the notice means the regulator has already found a technical defect. Which explanation best describes the audit?',
      options: [
    "It is an appeal hearing for a disciplinary finding already made against the firm.",
    "It is a certification that every technical conclusion in the firm's projects is correct.",
    "It is a technical practice review that can be initiated only after a substantiated complaint.",
    "It is a proactive check of firm compliance, not a finding of misconduct."
  ],
      answer: 3,
      optionRationales: [
        'The notice identifies a routine audit, not an appeal from a disciplinary decision.',
        'A process-focused compliance audit is not a guarantee of the technical correctness of every project.',
        'The regulator distinguishes routine compliance audits from more technical, reactive practice reviews; the stated audit need not begin with a complaint.',
        'The program checks firm compliance proactively. Findings may require follow-up, but selection for an audit is not a finding of misconduct.'
      ],
      keyPoint: 'Identify which regulatory process is being used before inferring its purpose or consequences.',
      trap: 'Treating an audit notice, a technical practice review and a disciplinary finding as interchangeable.',
      sources: [
        {sourceType: 'primary-regulator-guidance', title: 'Engineers and Geoscientists BC, Firm Audit Program', locator: 'Compliance-audit purpose and distinction from technical practice reviews; this is BC-specific', url: 'https://www.egbc.ca/firms/programs/firm-audit-program'},
        {sourceType: 'blueprint', title: 'Official NPPE blueprint', locator: 'VI.3 — Practice Review of Firms', url: 'https://www.nppexam.ca/en/preparation/blueprint/'}
      ]
    }
  ];
  function escape(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  questions.forEach(function (q, i) {
    var id = String(i + 21).padStart(3, '0');
    Object.assign(q, {qid:'nppe:set-1:diagnostic:'+id, legacyId:'NPPE-'+id,
      version:1, batch:3, authorSet:1, author:'ChatGPT', form:'set-1-diagnostic',
      bank:'diagnostic', set:1, original:true, scored:true, experimental:false,
      releaseStatus:'released', reviewStatus:'source-checked; not independently validated',
      area:q.blueprint.split('.')[0], verifiedAt:'2026-10-14',
      blueprintVersion:'2017; official published page checked 2026-10-14',
      difficultyBasis:'Editorial estimate; not empirically calibrated'});
    if (q.options.length!==4 || new Set(q.options).size!==4 || !Number.isInteger(q.answer) ||
        q.answer<0 || q.answer>3 || q.optionRationales.length!==4 || !q.sources.length) {
      throw new Error('Invalid Diagnostic Batch 3 item '+q.qid);
    }
    q.why='<p>'+escape(q.optionRationales[q.answer])+'</p><p><strong>Key principle:</strong> '+escape(q.keyPoint)+
      '</p><p><strong>Common mistake:</strong> '+escape(q.trap)+'</p><p><strong>Sources:</strong> '+
      q.sources.map(function(s){
        return (s.url && s.url.startsWith('https://') ? '<a href="'+escape(s.url)+'" target="_blank" rel="noopener noreferrer">'+escape(s.title)+'</a>' : escape(s.title))+
          ' — '+escape(s.locator)+' ['+escape(s.sourceType)+']';
      }).join('; ')+'.</p><p>Original practice item. Difficulty is provisional; not an official NPPE question or pass prediction.</p>';
  });
  function install() {
    var bank=global.NPPE_DIAGNOSTIC;
    if (!Array.isArray(bank) || (bank.length!==20 && bank.length!==30)) throw new Error('Diagnostic Batches 1–2 must load before Batch 3');
    bank.slice(0,20).forEach(function(q,i){
      if(q.qid!=='nppe:set-1:diagnostic:'+String(i+1).padStart(3,'0') || q.authorSet!==1 || q.form!=='set-1-diagnostic') throw new Error('Invalid earlier Diagnostic bank');
    });
    if(bank.length===30){
      if(!questions.every(function(q,i){return JSON.stringify(bank[i+20])===JSON.stringify(q);})) throw new Error('Conflicting Diagnostic Batch 3 already registered');
      return bank;
    }
    // Append to the registrar's existing array; preserve prior objects and all other forms.
    Array.prototype.push.apply(bank,questions);
    return bank;
  }
  global.NPPE_DIAGNOSTIC_BATCH3=questions;
  global.installNPPEDiagnosticBatch3=install;
  install();
})(typeof window!=='undefined'?window:globalThis);
