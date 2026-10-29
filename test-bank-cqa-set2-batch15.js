/* CQA Set 2 Batch 15: original Q141–Q150; printed handbook page references.
 * Loaded after the reviewed Q001–Q140 source and before simulator registration.
 * UpSkill Sprint is not affiliated with ASQ. This is not an official ASQ exam.
 */
(function (global) {
  'use strict';
  if (!Array.isArray(global.CQA_SET2) || global.CQA_SET2.length !== 140) {
    throw new Error('CQA Set 2 Batch 15 requires the reviewed 140-question base.');
  }
  var batch = [
  {
    "qid": "cqa:set-2:q141", "set": 2, "batch": 15,
    "sub": "cqa-accreditation-subject", "bok": "I.A.3", "cognitive": "Apply",
    "stem": "A national accreditation body evaluates a company that certifies manufacturers' management systems. The assessment examines that company's competence, impartiality and certification processes against the applicable criteria. A manufacturer says that a successful result will itself certify the manufacturer's own factory. Which explanation correctly identifies what this assessment establishes?",
    "options": [
      "It certifies each factory served by the assessed company, because acceptance of the company's certification process also approves the management systems of its clients.",
      "It certifies each individual auditor employed by the company, because assessment of the company's competence automatically replaces separate evaluation of its personnel's credentials.",
      "It assesses the certification body for accreditation; certification of an individual manufacturer's management system remains a separate assessment and decision under the relevant scheme.",
      "It accepts the products shipped by each factory served, because an accredited certification body supplies product acceptance evidence for its clients' current production lots."
    ],
    "answer": 2,
    "why": "The subject of this assessment is the organization providing certification, not any particular factory or production lot. Accreditation evaluates that body's conformity to the applicable criteria for its certification activities. A manufacturer still needs the relevant assessment and certification decision for its own management system; those decisions do not follow automatically from its certification body's accreditation. Likewise, organizational competence assessment is not automatic certification of every employee. The conclusion must identify the entity and activity actually assessed, without extending assurance to unexamined clients or products. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 8.</span>",
    "keyPoint": "Distinguish assessment of a certification body from certification of its clients' management systems, personnel credentials and product acceptance.",
    "trap": "Transferring an accreditation decision automatically to every client, employee or product associated with the assessed body.",
    "distractors": {
      "0": "The manufacturer's system is not the subject of the described assessment. Accreditation of its certification body does not itself supply a certification decision for that factory.",
      "1": "The assessment includes organizational competence but is not a separate personnel-certification examination for each auditor. Employment does not automatically confer an individual credential.",
      "3": "No lot has been inspected or accepted in this assessment. Assurance about certification-body activities cannot be substituted for product-specific acceptance evidence."
    }
  },
  {
    "qid": "cqa:set-2:q142", "set": 2, "batch": 15,
    "sub": "cqa-structural-reporting-independence", "bok": "I.E.3", "cognitive": "Apply",
    "stem": "A division's internal audit group reports only to the operations manager whose processes it audits. That manager can prevent a completed finding from reaching senior management. The company has an independent audit sponsor able to receive findings and resolve reporting disputes. Which change most directly addresses the structural threat to audit credibility while retaining useful operational cooperation?",
    "options": [
      "Establish accountable reporting and escalation to the independent sponsor, while retaining operations management's role in providing access, factual responses and corrective action.",
      "Keep the manager's reporting veto, but require auditors to complete annual ethics training and sign declarations that their findings were reached without bias.",
      "Keep the reporting arrangement, but replace employee auditors with contractors whose completed findings still require the same operations manager's permission for release.",
      "Let the operations manager decide which findings reach senior management, provided that the audit team retains the omitted findings in its confidential working papers."
    ],
    "answer": 0,
    "why": "The threat arises from control of the reporting route by the manager of the activity being audited. Accountable access to an independent sponsor addresses that structural weakness. Operations personnel still have legitimate roles in arranging access, checking factual accuracy, responding to results and implementing corrective action. Training, declarations and contractor status may support professionalism, but none removes the stated veto. Keeping a finding in working papers also does not provide decision makers with the audit information they need. Independence is not a reason to exclude the auditee from factual dialogue. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 48.</span>",
    "keyPoint": "Protect the audit's reporting route from the audited function's unilateral suppression while preserving appropriate auditee participation.",
    "trap": "Treating ethical declarations or external employment as a substitute for an independent reporting and escalation arrangement.",
    "distractors": {
      "1": "Training supports professional conduct but leaves the operations manager's ability to suppress findings unchanged. The identified problem is the reporting structure, not just personal awareness.",
      "2": "Contractors are still subject to the same veto in this arrangement. Changing the auditors' employer does not remove control of reporting by the audited function.",
      "3": "Confidential working papers preserve evidence but do not correct the suppression of information intended for senior management. The independent sponsor provides a suitable reporting route."
    }
  },
  {
    "qid": "cqa:set-2:q143", "set": 2, "batch": 15,
    "sub": "cqa-hybrid-evidence-plan", "bok": "II.A.1", "cognitive": "Evaluate",
    "stem": "Hybrid-audit case. The approved objective is to assess setup-verification controls on both shifts against PK-8. The plan requires records review, interviews and direct observation of one complete normal setup on each shift. Remote and on-site methods are authorized. The exhibit records verified feasibility information; proposed changes to required coverage need the client's approval. Which proposed approach best fulfils the objective with the verified capabilities?",
    "options": [
      "Use remote records and interviews for both shifts, accepting the unreadable video as sufficient confirmation because the approved gauge and setup instructions are documented.",
      "Limit observation to the day shift and increase the number of night-shift records, treating the larger record sample as automatic approval to reduce direct coverage.",
      "Replace both normal observations with a recorded demonstration made for the audit, treating a clear explanation of the steps as proof of normal execution on both shifts.",
      "Review records and conduct interviews remotely; assign the qualified local auditor to observe both complete setups and integrate the traceable evidence into the assessment."
    ],
    "answer": 3,
    "why": "The approach must obtain the evidence specified by the approved objective and plan. Reliable remote records and interviews can be used for those parts of the work. The trial identifies a limitation in direct observation, and the available qualified local auditor can address it without removing either shift from coverage. Shared traceable working papers let the team integrate the evidence. Remote authorization alone does not make an unreadable stream adequate, and a larger record sample does not authorize removing a required observation. A demonstration may explain a method but does not establish how both shifts execute their normal setups. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 73–75, 196.</span>",
    "keyPoint": "Match each evidence requirement to a method that can actually deliver it; a hybrid approach can preserve coverage where remote observation is inadequate.",
    "trap": "Confusing permission to use remote technology with proof that it supplies every type of required evidence.",
    "distractors": {
      "0": "The failed video trial cannot support the required observation. Approved instructions describe what should happen, not what the auditor has reliably observed during the actual setup.",
      "1": "Both shifts require direct observation under the approved plan. Increasing another type of evidence does not itself authorize changing that requirement.",
      "2": "An audit-created demonstration differs from observing normal work on each shift. It does not meet the stated direct-observation coverage, and no change has been approved."
    },
    "chart": {"type":"data-table","title":"PK-8 audit evidence and access plan","columns":["Element","Verified information"],"rows":[["Setup requirement","For each setup, check the first three seals using the approved calibrated gauge, record actual readings and obtain Quality approval before production continues."],["Remote access","Secure document access and interviews work. In the video trial, the gauge scale cannot be read and the complete sequence cannot be followed reliably."],["Local capability","An independent, qualified local auditor can safely observe both shifts and share traceable working papers through the approved channel."],["Scheduled work","One normal setup on each shift is scheduled within the agreed audit period. No reduction in required observation coverage has been approved."]]},
    "caseId":"cqa-set2-hybrid-setup-08"
  },
  {
    "qid": "cqa:set-2:q144", "set": 2, "batch": 15,
    "sub": "cqa-hybrid-unobserved-control", "bok": "II.B.4", "cognitive": "Evaluate",
    "stem": "Hybrid-audit case. The approved objective is to assess setup-verification controls on both shifts against PK-8. The plan requires records review, interviews and direct observation of one complete normal setup on each shift. Remote and on-site methods are authorized. The exhibit records verified feasibility information; proposed changes to required coverage need the client's approval. During execution, the local auditor observes all required day-shift steps. On the night shift, an unplanned evacuation interrupts observation after the first seal reading; the auditor returns to a safe area. A later setup record contains three acceptable readings and Quality approval, but no one on the audit team observed the remaining steps and no reliable recording exists. What can the team conclude about the night-shift evidence?",
    "options": [
      "The completed record retrospectively verifies direct observation of all three readings, so the team can mark the planned night-shift observation complete without qualification.",
      "The record provides documentary evidence, but the required complete observation remains unfinished; communicate the gap and arrange appropriate further work or an approved plan change.",
      "The interrupted observation proves that the operator omitted the remaining seal checks, so report a PK-8 process failure even though the completed record states otherwise.",
      "The acceptable day-shift observation establishes the night shift's execution because both shifts use PK-8, so no additional evidence or change to the audit plan is needed."
    ],
    "answer": 1,
    "why": "The record is evidence of the recorded readings and approval, but it does not transform unobserved actions into direct observation. Nor does the auditor's absence prove that the operator omitted those actions. The team should retain both the evidence obtained and the limitation, communicate the gap and arrange suitable further work or seek an authorized plan change. The required coverage is not automatically cancelled by the interruption. Evidence from the day shift cannot establish how the night shift performed its own setup. The safe withdrawal is already stated; this question concerns the resulting evidence and coverage, not an emergency response decision. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 93, 103–104.</span>",
    "keyPoint": "Distinguish documentary evidence from observed execution, and report a coverage limitation without inventing either conformity or a process failure.",
    "trap": "Treating an unobserved step as automatically verified by a later record, or automatically omitted because the auditor did not see it.",
    "distractors": {
      "0": "A completed record is documentary evidence. It cannot retroactively make an incomplete observation complete or remove a stated audit-plan requirement.",
      "2": "The auditor did not observe the remaining steps. That absence of observation is not evidence that the operator failed to perform them; the contrary record must be considered rather than ignored.",
      "3": "The same written instruction does not prove identical execution by both shifts. The approved plan deliberately requires observation of each, and the night-shift gap remains."
    },
    "chart": {"type":"data-table","title":"PK-8 audit evidence and access plan","columns":["Element","Verified information"],"rows":[["Setup requirement","For each setup, check the first three seals using the approved calibrated gauge, record actual readings and obtain Quality approval before production continues."],["Remote access","Secure document access and interviews work. In the video trial, the gauge scale cannot be read and the complete sequence cannot be followed reliably."],["Local capability","An independent, qualified local auditor can safely observe both shifts and share traceable working papers through the approved channel."],["Scheduled work","One normal setup on each shift is scheduled within the agreed audit period. No reduction in required observation coverage has been approved."]]},
    "caseId":"cqa-set2-hybrid-setup-08"
  },
  {
    "qid": "cqa:set-2:q145", "set": 2, "batch": 15,
    "sub": "cqa-retention-active-preservation-instruction", "bok": "II.C.3", "cognitive": "Apply",
    "stem": "An audit file has reached the end of its normal retention period. Before that date, the designated records authority issued instruction H12 requiring this file and its supporting working papers to be preserved until written release. H12 is still active. All audit findings are closed, and an automated deletion job is due tonight. What should the records custodian do?",
    "options": [
      "Allow the deletion because the findings are closed, retaining only the final score as sufficient evidence that the audit and its follow-up were completed.",
      "Delete the working papers but retain the final report, treating H12 as applying only to formally issued documents rather than the supporting material it names.",
      "Suspend deletion for the material covered by H12, preserve it securely and traceably, and obtain written release before applying the normal disposition process.",
      "Copy the file to each auditor's personal device before automatic deletion, treating dispersed informal copies as sufficient compliance with the preservation instruction."
    ],
    "answer": 2,
    "why": "The applicable preservation instruction expressly covers the file and supporting working papers until written release. Normal expiry and completed corrective action do not cancel that instruction. The custodian should prevent the scheduled deletion, retain the specified material in controlled custody and document subsequent authorized disposition. Personal-device copies are not a substitute for secure, controlled retention. This is application of the scenario's explicit organizational instruction, not a claim about a universal statutory retention period or the legal effects of any particular jurisdiction's hold. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 131–132.</span>",
    "keyPoint": "Apply all current retention and preservation instructions; audit closure and ordinary expiry do not override an active instruction to retain records.",
    "trap": "Equating closure with permission to destroy evidence or treating uncontrolled copies as compliant retention.",
    "distractors": {
      "0": "Closure does not release H12. A final score also cannot replace the file and supporting evidence that the active instruction specifically requires to be preserved.",
      "1": "H12 explicitly includes supporting working papers. Restricting it to the final report would omit material covered by the instruction.",
      "3": "Uncontrolled personal-device copies introduce custody and confidentiality problems and do not implement the stated preservation requirement. The official records should remain securely controlled."
    }
  },
  {
    "qid": "cqa:set-2:q146", "set": 2, "batch": 15,
    "sub": "cqa-interview-pause-without-inference", "bok": "III.E", "cognitive": "Apply",
    "stem": "After an auditor asks an operator to explain how a rejected reading is handled, the operator pauses and looks toward the supervisor. The supervisor starts to supply the answer. There is no evidence yet of a process violation or a language barrier. Which response best obtains the operator's own account without turning the pause into an unsupported conclusion?",
    "options": [
      "Record the pause as evidence of missing competence, then ask the supervisor to confirm the training deficiency before reviewing any relevant work records.",
      "Let the supervisor complete the answer and ask the operator to agree, using the agreement as an independent confirmation of how the operator handles rejections.",
      "State the expected rejection procedure and ask whether the operator follows it, using a clear model answer to remove uncertainty from the interview.",
      "Allow a reasonable pause, redirect the question to the operator neutrally, and seek supporting records or observation after hearing the operator's explanation."
    ],
    "answer": 3,
    "why": "A pause is a cue to manage the interview, not proof of incompetence, concealment or nonconformity. The auditor should allow the operator to respond, prevent the supervisor from substituting an answer and use a neutral prompt if needed. The account should then be corroborated with appropriate evidence. Supplying the expected response creates a leading question, while agreement with a supervisor's answer is not an independent account. The auditor can remain courteous to both participants while keeping the operator central to the interview. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 166–167, 170.</span>",
    "keyPoint": "Respond to non-verbal cues without diagnosing their cause; obtain the interviewee's own account and corroborate it.",
    "trap": "Interpreting hesitation as a finding or allowing a supervisor's answer to become supposedly independent operator evidence.",
    "distractors": {
      "0": "The pause alone does not establish a competence gap or its cause. Recording such a conclusion before obtaining and checking the operator's account goes beyond the evidence.",
      "1": "Agreement after hearing the supervisor's answer is influenced by that answer and the relationship. It does not replace the operator's independently elicited account.",
      "2": "Giving the expected answer leads the interviewee. It can produce agreement without showing what the operator actually understands or does."
    }
  },
  {
    "qid": "cqa:set-2:q147", "set": 2, "batch": 15,
    "sub": "cqa-facilitator-decision-boundary", "bok": "III.F.2", "cognitive": "Apply",
    "stem": "An audit-team meeting has repeatedly drifted away from its objectives. The lead appoints a facilitator who is not an audit-team member and has not reviewed the source evidence. The lead and assigned auditors retain responsibility for the conclusions. Which assignment appropriately uses the facilitator?",
    "options": [
      "Keep discussion focused, invite relevant contributions and help organize issues, while leaving evidence assessment and audit conclusions with the responsible auditors.",
      "Resolve disputed findings through a deciding vote whenever discussion reaches its time limit, since neutrality makes reviewing the original evidence unnecessary.",
      "Rewrite the findings to match the majority view before the lead reviews them, since facilitation transfers responsibility for the team's substantive conclusions.",
      "Assume the lead's reporting authority for the remainder of the audit, since appointment as facilitator replaces the team's established decision-making roles."
    ],
    "answer": 0,
    "why": "Facilitation supports how the team works: maintaining focus, encouraging participation, organizing issues and helping members reach evidence-based decisions. It does not confer substantive authority that the role has not been given. This facilitator is not a team member, has not assessed the source material and does not replace the lead or assigned auditors. Neutrality is useful for managing discussion but does not justify deciding findings without evidence. The appointment can improve effectiveness while preserving the stated responsibilities. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 174.</span>",
    "keyPoint": "Use facilitation to improve the decision process without transferring evidence or reporting responsibility by implication.",
    "trap": "Confusing a neutral meeting-support role with authority to decide findings or assume the lead auditor's responsibilities.",
    "distractors": {
      "1": "A time limit and claimed neutrality do not supply the missing evidence review or authority. The facilitator can manage the discussion but not decide the substantive finding on that basis.",
      "2": "Majority preference is not a substitute for evidence, and the stated appointment does not transfer responsibility for conclusions to the facilitator.",
      "3": "The stem expressly retains the lead's authority. Facilitation is a supporting role, not an automatic replacement of the lead auditor."
    }
  },
  {
    "qid": "cqa:set-2:q148", "set": 2, "batch": 15,
    "sub": "cqa-targeted-auditor-development", "bok": "IV.A.3", "cognitive": "Evaluate",
    "stem": "An auditor scores highly on tests of audit criteria and completes the required annual training hours. Observations of two audits nevertheless show repeated leading questions and failure to pursue conflicting answers. The program manager must select development work and evidence that the weakness has improved. Which proposal best addresses the demonstrated need?",
    "options": [
      "Repeat the written criteria examination until the auditor achieves a perfect score, and use that score to confirm that interviewing performance has improved.",
      "Assign additional general conference hours and confirm attendance, using the increased training total as sufficient evidence that the observed interviewing weakness is corrected.",
      "Agree on specific interviewing improvements, provide coached practice and supervised assignments, then reassess observed performance and resulting evidence against clear expectations.",
      "Retain current assignments without targeted support, using the absence of formal auditee complaints to override the observations because credentials and required hours are current."
    ],
    "answer": 2,
    "why": "The evidence identifies a practical interviewing weakness rather than a lack of written knowledge of the criteria. Targeted practice, feedback and supervised work address that skill. Reassessment should examine actual questioning, follow-up and the quality of evidence collected against expectations communicated in advance. Training hours and credentials are inputs, not proof of demonstrated competence. The manager should discuss the findings with the auditor and build a development plan rather than infer improvement from attendance or infer adequate skill from the absence of complaints. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 181, 184–185.</span>",
    "keyPoint": "Match development to the demonstrated competence gap and verify improvement through relevant performance evidence, not participation counts alone.",
    "trap": "Using knowledge-test scores, credentials or training attendance as a substitute for evidence of an applied auditing skill.",
    "distractors": {
      "0": "A written criteria test measures knowledge, while the observed gap concerns applying interviewing techniques. A perfect knowledge score would not demonstrate changed behaviour in an audit.",
      "1": "Attendance verifies participation, not improved questioning or follow-up. General education may help, but it needs a relevant performance check to establish the required improvement.",
      "3": "The manager already has direct evidence of a weakness. Lack of a complaint does not invalidate those observations or establish effective interviewing."
    }
  },
  {
    "qid": "cqa:set-2:q149", "set": 2, "batch": 15,
    "sub": "cqa-critical-subtier-oversight", "bok": "IV.A.6", "cognitive": "Analyze",
    "stem": "A supplier program monitors only direct suppliers. A direct supplier now outsources a critical coating step to a second-tier processor whose disruption or process failure could interrupt the customer's deliveries. Procurement has identified that no direct right of access to that processor has been established. Which program response best addresses the changed exposure without assuming authority the customer does not have?",
    "options": [
      "Keep oversight limited to the direct supplier's delivery score, because the absence of direct access makes the second-tier process irrelevant to the customer's supplier risk.",
      "Coordinate with procurement and the direct supplier to establish suitable oversight and access arrangements, then verify the critical process controls and flowed-down requirements.",
      "Schedule an unannounced visit to the processor, treating the customer's contract with the direct supplier as automatic authority to inspect every lower-tier organization.",
      "Require the auditing team to rewrite the processor's purchase terms itself, treating technical audit competence as delegated authority to impose new contractual access rights."
    ],
    "answer": 1,
    "why": "A critical second-tier activity can affect the customer's supply even though the processor is not a direct supplier. The program should coordinate with procurement and the direct supplier to determine appropriate oversight, relevant requirements and authorized access. Suitable arrangements may involve direct access or other agreed oversight; no universal right to enter a lower-tier facility is assumed. Audit personnel can identify the assurance need and verify controls within their authority, while authorized procurement and other decision makers establish contractual arrangements. A favourable direct-supplier delivery score alone does not address the new dependency. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 196–198.</span>",
    "keyPoint": "Follow critical supply-chain risk beyond direct suppliers while arranging oversight through valid authority and appropriate procurement coordination.",
    "trap": "Treating the lack of current access as the absence of risk, or treating supply-chain importance as automatic authority to enter or rewrite contracts.",
    "distractors": {
      "0": "Lack of direct access does not remove the dependency or its potential effect on deliveries. It is a reason to establish appropriate oversight arrangements, not ignore the process.",
      "2": "The stem explicitly states that direct access has not been established. A contract with one organization does not automatically create the stated right at every lower-tier organization.",
      "3": "Audit competence does not confer contracting authority. The auditing function should coordinate the need with procurement and the responsible parties rather than impose terms itself."
    }
  },
  {
    "qid": "cqa:set-2:q150", "set": 2, "batch": 15,
    "sub": "cqa-curvilinear-scatter-interpretation", "bok": "V.A", "cognitive": "Analyze",
    "stem": "An auditor examines paired observations from five historical production periods. The exhibit shows process temperature and the percentage of units requiring rework. The calculated Pearson linear correlation is zero. Which interpretation of these observations is most defensible?",
    "options": [
      "The pairs show a curved association that a straight-line correlation can miss; examine it further without treating these observational results as proof of causation.",
      "The zero correlation establishes that temperature and rework are unrelated, so a scatter diagram of the same paired observations cannot add useful information.",
      "The lower rework at 60 degrees proves that setting every future run to that temperature will eliminate rework, regardless of other operating conditions.",
      "The falling rework between 40 and 60 degrees establishes a negative association across the whole range, so the observations at higher temperatures can be excluded."
    ],
    "answer": 0,
    "why": "Rework falls as temperature rises from 40 to 60 degrees, then rises again from 60 to 80 degrees. The paired points therefore show a U-shaped association rather than a consistent straight-line relationship. In these symmetric data, the positive and negative products used in the linear covariance cancel, giving zero Pearson correlation. Zero linear correlation does not rule out a nonlinear pattern. A scatter diagram would make that pattern visible. Five observational periods do not isolate temperature from other factors or establish a universally optimal setting, and the in-scope higher-temperature observations should not be discarded to force a linear pattern. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 239–241.</span>",
    "keyPoint": "Inspect paired data for nonlinear patterns; zero linear correlation is not proof of no relationship or evidence of causation.",
    "trap": "Treating a single linear summary as a complete description of the data or deleting observations that do not fit a preferred trend.",
    "distractors": {
      "1": "Pearson correlation summarizes a linear association. These supplied observations have a clear curved pattern, so plotting the pairs supplies information that the zero linear coefficient misses.",
      "2": "The lowest observed rework is 1%, not zero, and the observational data do not establish causation or a setting that is optimal under all future conditions.",
      "3": "This uses only part of the supplied range and suppresses the rise from 60 to 80 degrees. No stated population rule or verified data error justifies excluding those observations."
    },
    "chart": {"type":"data-table","title":"Paired historical process observations","columns":["Production period","Temperature (degrees C)","Units requiring rework (%)"],"rows":[["1",40,9],["2",50,4],["3",60,1],["4",70,4],["5",80,9]]}
  }
];
  var ids = new Set(global.CQA_SET2.map(function (item) { return item.qid; }));
  batch.forEach(function (item) {
    if (ids.has(item.qid)) throw new Error('Duplicate CQA Set 2 question: ' + item.qid);
    ids.add(item.qid);
  });
  global.CQA_SET2.push.apply(global.CQA_SET2, batch);
})(typeof window !== 'undefined' ? window : globalThis);
