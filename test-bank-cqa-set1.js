/*
 * ASQ CQA Exam Set 1 — original practice questions.
 * 150 items written to the 2026 Body of Knowledge and the ASQ Certified
 * Quality Auditor Handbook, 5th ed. (Lance B. Coleman Sr.).
 * Page citations are the printed folio. UpSkill Sprint is not affiliated
 * with ASQ. This is practice, not an official ASQ exam.
 */
(function (global) {
  'use strict';
  global.CQA_SET1 = [
  {
    "qid": "cqa:set-1:cal-01",
    "set": 1,
    "sub": "cqa-types",
    "bok": "I.A.1",
    "cognitive": "Analyze",
    "stem": "A finished lot has already passed final inspection. One audit team reruns the same operational test, with the same procedure and equipment, on sampled units. The same week, a second team walks the forming, drilling, and finishing sequence and checks whether the work instructions, training, and process controls are adequate and effective. Which statement is correct?",
    "options": [
      "Classify both activities as system audits, because each team compares the work with documented requirements, and that comparison alone shows the management-system elements are appropriate, effective, developed, documented, and implemented across the site.",
      "Call the first activity a process audit because an operational test is itself a process, and call the second a desk audit because the team reads work instructions, training, and the documented process controls while it walks the sequence.",
      "Treat neither activity as an audit. Rerunning an operational test on product that already passed is only an inspection, and walking the sequence to look at controls is inspection of process output rather than an audit.",
      "Call the first a product audit and the second a process audit. The rerun uses the same tests, procedure, and equipment on product already accepted, and the walk checks whether the process controls are adequate and effective."
    ],
    "answer": 3,
    "why": "A product audit examines product that has already been accepted or rejected, using the same operational tests, procedure, methods, and equipment used in manufacturing. A process audit checks the adequacy and effectiveness of the controls set by procedures, work instructions, flowcharts, training, and process specifications, and the auditor follows the process steps. A system audit verifies, from objective evidence, that the applicable management-system elements are appropriate and effective and have been developed, documented, and implemented. A desk audit reviews documents only and does not interview people or observe activities. Using an inspection technique inside a product audit does not turn the audit into an inspection. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 3–5.</span>"
  },
  {
    "qid": "cqa:set-1:cal-02",
    "set": 1,
    "sub": "cqa-ethics",
    "bok": "I.E.1",
    "cognitive": "Apply",
    "stem": "Two weeks before a second-party audit, the assigned lead auditor tells the audit manager that she worked for the supplier until 14 months ago and still holds a block of that supplier's stock. She is the only person on the staff with the process knowledge the audit needs, and the date is already on the supplier's schedule. What should be done?",
    "options": [
      "Tell audit-program management about the prior employment and the stock holding now, or decline the audit. Being the only person with the needed process knowledge is not a remedy that lets her lead this audit.",
      "Let her lead the audit as planned. The stock holding is her private financial business, and leaving the supplier more than a year ago removes any employment conflict, so the scarce process knowledge should decide who is assigned.",
      "Limit her work to departments she never worked in, and do not tell audit-program management about the stock unless a finding is later disputed. Partial exclusion and silence are enough once the audit date is already fixed.",
      "Waive the conflict and let her lead. A second-party audit belongs to the customer, so the auditor's stock in the supplier and her earlier employment cannot affect the result or create an appearance of a conflict."
    ],
    "answer": 0,
    "why": "Previous employment by the auditee, regardless of why the person left, and holding stock in the auditee are conflict-of-interest situations. Before accepting an audit, the auditor has to examine the relationship and say whether an actual or potential conflict exists. When one does, the auditor must tell audit-program management or decline the audit. Management may wait until enough time has passed, assign a different auditor to the area, or remove the auditor from the team. Being the only subject expert is not one of those remedies. ASQ's Code of Ethics requires members to avoid a conflict of interest and the appearance of one. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 29–31.</span>"
  },
  {
    "qid": "cqa:set-1:cal-03",
    "set": 1,
    "sub": "cqa-planning",
    "bok": "II.A.1",
    "cognitive": "Evaluate",
    "stem": "On the second day of an agreed supplier audit, the plant manager asks the lead auditor to add the new warehouse. The warehouse was left out of the scope. A customer complaint arrived that morning. The team has not read the warehouse procedures, the schedule is full, and no one on the team was chosen for warehouse controls. What is the appropriate response?",
    "options": [
      "Add the warehouse at once. A customer complaint that arrives during the audit automatically extends the agreed scope, so the team does not need time to prepare, matching technical skill, or approval from the people who already manage the audit program.",
      "Add the warehouse if the warehouse supervisor agrees during the next interview. Once performance has begun, auditee consent is the only approval required, and the team may investigate without having prepared or having the technical skill.",
      "Do not add the warehouse to this audit. Once performance has begun, put the unprepared area on the next audit unless the audit client and the people managing the audit program approve a change the team can still prepare for.",
      "Write the morning complaint up as a major nonconformity against the area already in the scope, so the warehouse is covered without changing the plan or asking the audit client to approve a new area."
    ],
    "answer": 2,
    "why": "Scope may be expanded before the audit starts if the team still has time to prepare. Once performance has begun, the lead auditor should tell the auditee to put the extra area on the next audit. The team has not prepared, and it may not have the time or the technical skill to investigate properly. A change that becomes necessary during the audit has to be reviewed and approved by the people managing the audit program and by the audit client, and then by the auditee. An internal audit has fewer obstacles to a scope change. This is a supplier audit already under an agreed scope. A complaint about an area outside the scope is not, by itself, a finding against the area being audited. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 61.</span>"
  },
  {
    "qid": "cqa:set-1:cal-04",
    "set": 1,
    "sub": "cqa-evidence",
    "bok": "II.B.5",
    "cognitive": "Analyze",
    "stem": "An operator says every gage is calibrated before the shift starts. A second operator on the same shift gives the same account. There is no calibration record, sticker, or measurement, and the auditor has not watched a calibration. The area supervisor offers to confirm the story. What is the strongest conclusion?",
    "options": [
      "Close the item as met. Two operators giving the same account corroborate each other, and that agreement is enough to prove the gages were calibrated before the shift without a record, a sticker, or an observation.",
      "Accept the interviews over any record. Two matching oral accounts outrank a calibration record or a sticker, because a record can be backdated and an interview cannot be changed after the words are given.",
      "Keep the item open. The two interviews agree, but they are oral and come from the same shift, and a record, an observation, or a measurement is more reliable than that agreement alone.",
      "Treat the supervisor's confirmation as the strongest evidence. A supervisor repeating the operators' account is stronger than a record, an observation, or a measurement, so the item can be closed on that confirmation alone."
    ],
    "answer": 2,
    "why": "Evidence from physical examination, observation, measurement, and inspection is more reliable than interview comments, and a record is more reliable than oral evidence. Interview information has to be corroborated. One method is a second person giving the same account, and that second person is more useful when they come from another group or another level. Another method is a document or record that shows the action described. Agreement between two people on the same shift does not replace the record, and a supervisor repeating the same account does not turn oral evidence into something stronger than a record or an observation. Corroboration supports the story. It does not by itself prove the action was right. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 107–108.</span>"
  },
  {
    "qid": "cqa:set-1:cal-05",
    "set": 1,
    "sub": "cqa-capa-ineffective",
    "bok": "II.D.4",
    "cognitive": "Create",
    "stem": "A follow-up shows the revised procedure was issued and the operators were trained on the date in the plan. The next three lots fail for the same defect named in the original finding. The auditee asks the auditor to close the finding because every planned action was completed. What should the auditor do?",
    "options": [
      "Close the finding. Completing every action named in the plan is what an effective corrective action means, and later lots that fail for the same defect do not reopen a finding whose planned actions are already done.",
      "Escalate at once to the customer's top executive, before looking again at the action or the follow-up evidence. Three failed lots show the auditee acted in bad faith, and going up the chain of command is the first step.",
      "Withdraw the original finding. If the planned correction did not stop the defect, the original nonconformity was cited against the wrong requirement and should not be recycled or referenced in any new finding.",
      "Do not close the finding. The planned actions were implemented, but the same defect shows they were not effective, so reevaluate the evidence and then recycle the finding or issue a new one that references the original."
    ],
    "answer": 3,
    "why": "Putting the plan in place is not the same thing as an effective corrective action. Implementation means the actions were done. Effectiveness means the process then achieved the result that was wanted. The auditor does not judge effectiveness only by seeing that a change occurred. When the action is not effective, the auditor or the client should recycle the finding or issue a new finding that references the original and start the corrective-action process again. Before any escalation, the auditor should reevaluate the action and the follow-up with an open mind. Going up the chain of command is a last resort, and that path should already be formal and documented. Frequent failure of corrective action is a signal that the corrective-action process itself, including root-cause analysis, may be the problem. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 140–141.</span>"
  },
  {
    "qid": "cqa:set-1:cal-06",
    "set": 1,
    "sub": "cqa-interview",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "During an interview the area supervisor, who is also the escort, answers before the operator can speak. This happens on every question about how the job is actually done. What should the auditor do first?",
    "options": [
      "Keep the questions aimed at the operator, break eye contact with the escort, and if the escort keeps answering, say plainly that the information has to come from the staff member who does the work.",
      "Stop the interview and write a nonconformity against the supervisor for obstructing the audit. The first response to an escort who answers every question is a cited finding, not a change in how the questions are asked.",
      "Accept the supervisor's answers and move on. The escort is the process owner, so that person can speak for the operators, and a manager's oral account is better evidence than the account of the person who does the work.",
      "Send the operator out and interview the supervisor alone. A manager's account is stronger evidence than an operator's account, and the escort is expected to take over the interview whenever the questions concern how the job is actually done."
    ],
    "answer": 0,
    "why": "An escort stays close enough to listen and take notes, but the escort is an observer and should not take over the interview unless there is a communication problem. The auditor directs questions to the interviewee and keeps eye contact with that person. If the escort starts answering, the auditor redirects the question and avoids eye contact with the escort. If the escort keeps interfering, the auditor says plainly that the information needs to come from the staff member. Removing the operator, or citing obstruction as the first move, skips the technique the situation calls for. An interview comment is also weaker evidence than a record or an observation, so the supervisor's version is not a substitute for the person who does the work. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 170.</span>"
  },
  {
    "qid": "cqa:set-1:cal-07",
    "set": 1,
    "sub": "cqa-conflict",
    "bok": "III.C",
    "cognitive": "Analyze",
    "stem": "At the opening meeting the plant manager starts a history of the site that runs past an hour, then offers a full plant tour that is not on the audit plan. The audit is already behind the schedule both sides agreed to. What is the best response?",
    "options": [
      "Take the full tour and hear the history out. Refusing a host creates a conflict, and the right first step in any conflict, including a schedule diversion, is a cool-down period rather than holding to the agreed plan.",
      "Stay through the history and debate the site story. Repairing the relationship matters more than the first morning of the schedule, and arguing the side topic is a legitimate way to keep control of the audit.",
      "Cancel the audit and report that the auditee refused the team access to the process. An opening presentation that runs past an hour, or a tour that is not on the plan, is a refusal of access.",
      "Stop or limit the unplanned history and the tour so the auditee does not take control of the audit, and tell auditee management and the client if delay tactics continue and seriously compromise the schedule."
    ],
    "answer": 3,
    "why": "A long unplanned presentation at the opening meeting, or an extended plant tour, is a time-wasting tactic. The lead auditor should stop it or put a limit on it, and should not let the auditee take control of the audit. If delay tactics continue and the schedule is seriously compromised, auditee management and the client need to be told. A cool-down period is for a conflict that has already developed, so the auditor does not get pulled into it and lose control. It is not the response to a schedule diversion. Arguing the side topic plays to the auditor's ego and is not auditing. Cancelling the audit treats a delay as a refusal of access, which this situation is not. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 155–156.</span>"
  },
  {
    "qid": "cqa:set-1:cal-08",
    "set": 1,
    "sub": "cqa-mgmt-support",
    "bok": "IV.A.1",
    "cognitive": "Analyze",
    "stem": "After an internal audit, a department manager puts the named findings into the annual performance ratings of the operators who were interviewed. On the next audit those operators will not describe how the work is actually done. What is wrong with that use of the results?",
    "options": [
      "Keep the practice. Audit findings are objective evidence of personal competence, so they belong in the annual rating of each operator who was interviewed, and that use keeps the audit program credible.",
      "Allow the ratings if the auditor writes the score and the department manager only signs it. Moving the authorship to the auditor makes the appraisal a proper use of audit results and protects the credibility of the program.",
      "Treat the practice as proper for an internal audit and improper only when a registrar or a customer is the auditor. Internal findings are meant to score the people who were interviewed about the work.",
      "Stop putting findings into appraisals. Results are about the process and the system, not a score for the person interviewed, and that use drives people to hide problems and damages program credibility."
    ],
    "answer": 3,
    "why": "Management has to use audit results in a way that keeps the program credible. Misuse of the results, or failure to act on them, erodes that credibility no matter how well the auditors performed. The audit is a penalty-free chance to correct problems and improve performance. Findings are about the process and the system, not a score for the person who was interviewed. If management later watches the area more closely, new incidents can be dealt with on their own, without tying them back to the audit. Once people learn that talking to an auditor affects their rating, the next audit stops producing useful evidence. Focusing the audit on people rather than on the process has the same effect. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 178–179.</span>"
  },
  {
    "qid": "cqa:set-1:cal-09",
    "set": 1,
    "sub": "cqa-coq",
    "bok": "IV.B.3",
    "cognitive": "Analyze",
    "stem": "An audit of the quality-cost accounts finds two supplier-related costs in the same account: a qualification survey done before any contract is awarded, and incoming inspection of that supplier's lots after delivery has started. How should the two costs be classified?",
    "options": [
      "Classify both costs as appraisal costs, because a qualification survey and incoming inspection both check a supplier, and any look at a supplier is measuring product for conformity after delivery has already started.",
      "Classify the qualification survey as a prevention cost and the incoming inspection as an appraisal cost. The survey is spent to avoid a weak supplier, and incoming inspection measures received lots for conformity.",
      "Classify the survey as an external failure cost and the incoming inspection as an internal failure cost. A survey is a complaint about the supplier, and inspection of received lots is rework done before the customer sees the product.",
      "Classify the survey as an internal failure cost and the incoming inspection as a prevention cost. Inspection before use prevents later failure, and a survey done before any contract is a failure found inside the plant."
    ],
    "answer": 1,
    "why": "Prevention costs are spent to keep failure and appraisal costs down. Supplier quality surveys, quality planning, and quality training sit in that category. Appraisal costs are the costs of measuring, evaluating, or auditing products or services for conformity. Incoming and source inspection of purchased material are appraisal costs. Internal failure happens before the product or service reaches the customer, such as rework or retest. External failure happens after delivery, such as complaints, returns, warranty, and recalls. A survey done to avoid putting a weak supplier on contract is not the same cost as inspecting lots that have already been received. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 218.</span>"
  },
  {
    "qid": "cqa:set-1:cal-10",
    "set": 1,
    "sub": "cqa-sample-types",
    "bok": "V.E.2",
    "cognitive": "Apply",
    "stem": "The audit program asks whether a stream of high-dollar orders, which has failed past audits, is now under control. The full order book is not one uniform population, and there is no time to draw a random sample from every order. Which approach fits, and what limit must stay attached to the result?",
    "options": [
      "Draw a simple random sample from the entire order book before any conclusion is stated. No other sample, including one aimed at high-dollar or previously weak orders, can support an audit conclusion of any kind.",
      "Take one convenient file drawer as a cluster and treat its defect rate as the plant-wide rate. A cluster chosen because it is handy is a sound basis for a rate that covers the whole order book.",
      "Use judgmental sampling on the high-dollar orders that failed past audits. The result can focus attention on that slice, but it is not a statistically valid statement about every order in the book.",
      "Ask the auditee to pick the representative orders. A sample chosen by the process owner is random, because the owner knows the work and every order still has an equal chance of being selected by that owner."
    ],
    "answer": 2,
    "why": "A statistical inference needs a homogeneous population and a random sample, so that every item has an equal chance of being selected. A conclusion drawn from one slice of the population is not automatically true for the rest. Judgmental sampling aims the auditor at high-dollar, high-risk, or previously weak areas. It is useful, and it is not statistically valid. If a problem shows up, more samples are needed to see how far it goes. The auditor should select the sample. Letting the auditee choose the items removes that control. A convenient cluster is not a basis for a plant-wide rate. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 284–286.</span>"
  },
  {
    "qid": "cqa:set-1:b02-01",
    "set": 1,
    "sub": "cqa-types",
    "bok": "I.A.1",
    "cognitive": "Analyze",
    "stem": "One audit team spends the same week on the quality system and the environmental system. The quality auditors and the environmental auditors work separately and each group gives its own report to the lead auditor. A month later, two auditing organizations examine the same quality system together and issue one report. Which description is right?",
    "options": [
      "Call the first a joint audit and the second a combined audit, because any visit that uses more than one auditing organization is combined and any visit that covers two management systems in one week is joint.",
      "Call the first a combined audit and the second a joint audit. Separate groups assessed different systems and each reported its own area, while two organizations later shared one system and issued a single report.",
      "Call both visits joint audits, because each one uses more than one auditor. The number of auditors decides the label, and separate reports versus one shared report do not change a joint audit into another type.",
      "Call both visits desk audits, because neither team is limited to a single process. A desk audit is any audit that covers more than one management system or uses more than one auditing organization."
    ],
    "answer": 1,
    "why": "A combined audit uses auditors, sometimes in separate groups, to assess different management systems during the same audit. Each group reports its own area to the lead auditor. A joint audit is two or more auditing organizations sharing the work on the same system and providing a single report. A joint audit is used to reduce the risk of bias, often by including an external organization. The number of auditors does not decide the label, and neither description is a desk audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 2.</span>"
  },
  {
    "qid": "cqa:set-1:b02-02",
    "set": 1,
    "sub": "cqa-types",
    "bok": "I.A.1",
    "cognitive": "Analyze",
    "stem": "A service auditor can look at a finished haircut and see whether it meets the shop standard. The same auditor cannot see whether a massage met the standard after the client has left. What follows from that difference?",
    "options": [
      "Close both services with a product audit. A service audit is only a product audit under another name, so a massage that leaves no trace can still be verified in the same way as a finished haircut.",
      "Check the haircut as a service audit, because the finished result can still be seen. Verify the massage by auditing the process, because that service leaves no trace once the client has left.",
      "Treat the massage as a system audit and the haircut as a product audit. Anything that cannot be inspected after the client leaves is a management system, so the massage cannot be verified by a process audit.",
      "Audit neither service. Services sit outside the product, process, and system audit types, so a visible haircut and a massage that leaves no trace are both evaluations rather than audits of any type."
    ],
    "answer": 1,
    "why": "A service audit is a type of product audit when the auditor can verify physical attributes of the service that was performed, such as a haircut, a label, a completed record, or a clean area. When the service leaves few or no traces, as with a massage, some repairs, or some training, it has to be verified by a process audit. It does not become a system audit merely because the output cannot be seen later. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 3.</span>"
  },
  {
    "qid": "cqa:set-1:b02-03",
    "set": 1,
    "sub": "cqa-types",
    "bok": "I.A.1",
    "cognitive": "Analyze",
    "stem": "The client asks for an audit of the welding operation only: one crew, the procedure, the settings, and the controls for that operation. The client also asks that the audit stay inside that operation and finish in less time than last year's full management-system audit. Which audit fits?",
    "options": [
      "Use a system audit, because welding is controlled by the management system. Any request to look at one crew, its procedure, and its settings is still a full-system audit and should take as long as last year's visit.",
      "Use a product audit, because a finished weld can be inspected. Looking at the crew, the settings, and the controls during the operation is the same audit as examining the finished weld against the product requirements.",
      "Use a process audit. It is bounded by the one welding operation, checks that operation against its instructions and controls, covers only part of the system, and usually takes much less time than a full system audit.",
      "Use a desk audit, because the welding procedure is a document. Reading that procedure at a desk is enough to audit the operation, and the team does not need to observe the crew, the settings, or the controls."
    ],
    "answer": 2,
    "why": "A process audit examines one activity, such as welding, soldering, or heat treating, to see that inputs, actions, and outputs meet defined requirements. It covers only a portion of the system and usually takes much less time than a system audit. The auditor follows the process and checks the resources, methods, environment, and measures, including whether the controls in the procedure and the training are adequate and effective. Inspecting a finished weld would be a different audit. Reading the procedure at a desk would not observe the operation. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 3–4.</span>"
  },
  {
    "qid": "cqa:set-1:b02-04",
    "set": 1,
    "sub": "cqa-types",
    "bok": "I.A.1",
    "cognitive": "Analyze",
    "stem": "An auditor interviews operators by video and watches the line through a camera. There is no trip to the site. A colleague says this is a desk audit because the auditor never entered the plant. Is the colleague right?",
    "options": [
      "No. A desk audit reviews documents and does not interview people or observe activities. Video interviews and watching the line are still data collection, the same kind of work whether the auditor is on site or remote.",
      "Yes. Any audit done away from the site is a desk audit, because remote interviews and camera observation are document review and are not the same kind of data collection as an on-site audit of the line.",
      "Yes, if the auditor is also looking at procedures. Remote viewing of the line and a document review are the same method, so interviews by video do not take this work outside a desk audit at all.",
      "No. Call the camera review a product audit and do not treat the interviews as data collection. Any view of the product on the line is automatically a product audit, even when the auditor never enters the plant."
    ],
    "answer": 0,
    "why": "A desk audit or document review is an audit of documents. It can be done at a desk because it does not interview people or observe activities. Remote data collection is still data collection. The opening meeting may be shorter, but collecting the data is the same kind of work as an on-site audit. Seeing the line and talking to operators is not a document review, and it is not automatically a product audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 5 and 11.</span>"
  },
  {
    "qid": "cqa:set-1:b02-05",
    "set": 1,
    "sub": "cqa-relationship",
    "bok": "I.A.2",
    "cognitive": "Analyze",
    "stem": "A company hires an outside audit firm to perform its internal audits so employees do not lose production time. The firm does not certify the company and was not sent by a customer. How should this audit be classified, and what is the main weakness?",
    "options": [
      "Classify it as a third-party audit, because the auditors are not employees of the company. The weakness is that a certificate cannot be issued when the firm was hired by the company rather than acting as an independent registrar.",
      "Classify it as a first-party audit done for the company itself. The main weakness is that contract auditors may not know the company culture, the strategic direction, or the concerns of the moment.",
      "Classify it as a second-party audit, because money is paid to the auditors. Paying an invoice is what turns the company's own internal audit into a customer audit of a supplier, and the weakness is contract law.",
      "Refuse the arrangement. Internal audits may be performed only by employees of the company, so an outside firm cannot perform a first-party audit of the company's own system for any purpose."
    ],
    "answer": 1,
    "why": "An organization may outsource its internal audits. That remains a first-party audit: the client is the organization, and the purpose is its own system. The benefits are time, objectivity, and access to experienced auditors. The downside is that contract auditors may not know the company culture, strategic direction, or the concerns of the moment. A third-party audit is independent of the customer-supplier relationship and may lead to certification, a citation, or a penalty. Paying an invoice does not create a second-party audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 5.</span>"
  },
  {
    "qid": "cqa:set-1:b02-06",
    "set": 1,
    "sub": "cqa-relationship",
    "bok": "I.A.2",
    "cognitive": "Analyze",
    "stem": "Plant A and Plant B belong to the same company. Plant B exists mainly to supply parts to Plant A. Quality at Plant A wants to audit Plant B before the next release. A colleague says every audit inside the company is a first-party audit. What is the better classification?",
    "options": [
      "Classify it as a first-party audit. Shared ownership always makes an audit of another plant internal, even when that plant exists mainly to supply parts to the auditing plant and functions as its supplier.",
      "Classify it as a second-party audit. When the other location functions primarily as a supplier to the main operation, an audit of that site is treated as a customer audit of that supplier.",
      "Classify it as a third-party audit. Different site addresses make the auditors independent of the company, so an audit between two plants of the same company stands outside the customer-supplier relationship.",
      "Classify it as a desk audit. Work between sites of one company is always a document review, so the team should not treat the visit as either a first-party audit or a second-party supplier audit."
    ],
    "answer": 1,
    "why": "A multi-site company's audit of another division or subsidiary is often an internal audit, including across countries. The exception in the handbook is the one in this case: if the other location functions primarily as a supplier to the main operation, audits of that site are second-party audits. Different addresses do not create third-party independence. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 5–6.</span>"
  },
  {
    "qid": "cqa:set-1:b02-07",
    "set": 1,
    "sub": "cqa-relationship",
    "bok": "I.A.2",
    "cognitive": "Analyze",
    "stem": "Purchasing wants a look at a company that has never received a contract, to judge facilities, technical capability, people, and whether the controls exist before any award. Six months later, after the contract is in place, the same customer returns to see whether the contract is being met. Which labels fit the two visits?",
    "options": [
      "Call both visits third-party certification audits, because the customer sits outside the supplier. Any external look at facilities, people, or later contract performance is certification, whether or not a contract has already been awarded.",
      "Call the first visit a survey, the broader look at capability before award to see that controls are in place. Call the second a second-party audit, because a contract exists and goods or services will be delivered.",
      "Call the first a product audit and the second a process audit. The existence of a contract does not change the customer-supplier relationship, and a pre-award look at facilities, people, and controls is not recognized as a survey.",
      "Call the first a joint audit and the second a combined audit. A pre-award look at capability is two organizations sharing one report, and a later contract visit is two management systems audited in the same week."
    ],
    "answer": 1,
    "why": "A second-party audit is an external audit by a customer, or by someone contracted for the customer, where a contract exists and goods or services are or will be delivered. It is more formal than a first-party audit because the result can affect purchasing. A survey, also called an assessment or examination, is the broader look at capability, usually before award, to see that the controls are in place. The two visits are not certification audits, and the relationship is not decided by product versus process. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 6.</span>"
  },
  {
    "qid": "cqa:set-1:b02-08",
    "set": 1,
    "sub": "cqa-relationship",
    "bok": "I.A.2",
    "cognitive": "Analyze",
    "stem": "A medical-device company cannot afford to audit every supplier itself. It relies on an audit organization that has no stake in the customer-supplier relationship. The agency that regulates the company also visits the plant under its own rules. What do these two audits have in common?",
    "options": [
      "Treat both as third-party audits. The audit organization is independent of the customer-supplier relationship and free of a conflict of interest, and the regulator's visit is a mandatory third-party audit of a regulated industry.",
      "Treat both as second-party audits, because both come from outside the company. Any auditor who is not an employee is a customer auditor, and a regulator visiting under its own rules is still acting as the company's customer.",
      "Treat both as first-party audits, because both look at the same management system. Independence from the contract relationship does not matter, and a government visit of a regulated plant is still an internal audit of that plant.",
      "Treat only the independent audit organization as third-party, and do not call the government visit an audit. A visit that can end in a fine or a penalty is enforcement, not a third-party audit of the plant."
    ],
    "answer": 0,
    "why": "A third-party audit is performed by an organization independent of the customer-supplier relationship and free of conflict of interest. That independence is the key. The result may be certification, registration, an award, a license, a citation, a fine, or a penalty. Customers who cannot audit suppliers themselves may rely on that kind of audit. Government audits of regulated industries, including medical devices, are mandatory third-party audits. A possible penalty does not take the government visit out of that class. A customer auditing its own supplier would be second-party instead. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 6.</span>"
  },
  {
    "qid": "cqa:set-1:b02-09",
    "set": 1,
    "sub": "cqa-relationship",
    "bok": "I.A.2",
    "cognitive": "Analyze",
    "stem": "During a certification audit, the registrar's auditors are joined by auditors from a major customer. Someone says the audit must be labeled either third-party or second-party, not both. What does the handbook say?",
    "options": [
      "Force a single label. The party types are mutually exclusive, so adding the customer's auditors converts the whole certification visit into a second-party audit and removes the certification purpose from every participant on the team.",
      "Relabel the visit as a first-party audit as soon as more than one party is in the room. A blend of registrar auditors and customer auditors is an internal audit, and the certification purpose ends for everyone.",
      "Do not force a single label. The party types are not mutually exclusive, so a certification audit can be joined by customer auditors without erasing the certification purpose or converting every participant into one class.",
      "Declare the visit invalid and stop the work. A third-party certification audit may not be joined by a customer's auditors, and the party types cannot be blended on the same system during the same visit."
    ],
    "answer": 2,
    "why": "Internal audits are first-party. External audits are second-party or third-party. Figure 1.1 is a guide, not an absolute rule, and the types are not mutually exclusive. An audit can blend them. Certification auditors can be joined by customer auditors, and internal auditors can be joined by customer auditors. Adding the customer does not erase the certification purpose or convert every participant into one class. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 6–7.</span>"
  },
  {
    "qid": "cqa:set-1:b02-10",
    "set": 1,
    "sub": "cqa-purpose",
    "bok": "I.A.3",
    "cognitive": "Analyze",
    "stem": "A finding from the last audit was rated high risk: the same sampling equipment had failed twice, and a repeat could bring a fine. The auditee has sent a revised procedure and a training record. The audit manager says a desk review of those two documents is enough, and that implementation alone will close the finding. What is missing?",
    "options": [
      "Accept the desk review and close the finding now. A follow-up only checks that the paperwork was filed, implementation alone resolves a finding, and a high-risk equipment failure should always be closed from the revised procedure and the training record.",
      "Require evidence that the action was implemented and that the finding was effectively resolved. Complexity and risk decide an on-site or desk check, and a procedure plus a training record do not settle a high-risk failure alone.",
      "Require an on-site visit and look only at preventive action. A follow-up may not be done at a desk, and it may not examine the corrective action taken on the failed sampling equipment.",
      "Treat the follow-up as a product audit of finished goods. Reinspect product for the defect the equipment might cause, and do not examine the sampling equipment or whether the earlier finding was effectively resolved."
    ],
    "answer": 1,
    "why": "A follow-up audit verifies closure of a previous finding. The auditor looks for evidence that corrective action, and preventive action where the earlier audit was risk-based, was implemented and that the finding was effectively resolved. The follow-up may be on site or at a desk, depending on complexity and the risk to the organization. Documents that show a procedure and a class are not, by themselves, evidence that a high-risk equipment failure has been resolved. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 7.</span>"
  },
  {
    "qid": "cqa:set-1:b02-11",
    "set": 1,
    "sub": "cqa-purpose",
    "bok": "I.A.3",
    "cognitive": "Analyze",
    "stem": "A manufacturer wants its quality system checked against ISO 9001 so it can receive a certificate. Separately, a national body checks whether the company that issues those certificates conforms to the accreditation rules. Which terms apply?",
    "options": [
      "Reverse the usual words and keep that reversal in use. Call the manufacturer accredited and call the certificate issuer certified, because everyday speech has swapped the two terms and that swapped usage is the correct labeling.",
      "Call both activities accreditation. Any comparison of an organization with a standard is accreditation, whether the organization is the manufacturer seeking a certificate or the national body that checks the issuer of those certificates.",
      "Use neither certification nor accreditation. Only a government fine can certify a management system, and a national check of the body that issues certificates is enforcement rather than registration of that body.",
      "Call the check of the manufacturer's system certification, also called registration. Call the check of the body that issues those certificates accreditation. Certification is also the word used for an individual auditor's credentials."
    ],
    "answer": 3,
    "why": "Certification and registration are used interchangeably for verifying that an organization's management system conforms to a standard. Accreditation is the term for verifying that a certification body conforms to national or international criteria. Certification is also the process of validating an individual, such as an auditor. A certification body, or registrar, is the third party that evaluates the organization's system and issues the certificate when it is warranted. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 8.</span>"
  },
  {
    "qid": "cqa:set-1:b02-12",
    "set": 1,
    "sub": "cqa-purpose",
    "bok": "I.A.3",
    "cognitive": "Analyze",
    "stem": "Order-entry follows its procedure exactly. Every order is then changed two or three times before it reaches production. A conformity audit would find no procedural break. Management is still unhappy. What kind of audit purpose would surface the problem the conformity audit misses?",
    "options": [
      "Use a performance or improvement purpose. That purpose collects evidence about how the organization actually performs, not only whether the order-entry procedure was followed, and it can show the inefficiency of rewriting every order.",
      "Run another conformity audit against a stricter procedure. Performance is outside the definition of an audit, so the only way to surface the rewrites is to cite a procedural break that the current procedure does not contain.",
      "Run a product audit of one finished unit. Repeated order changes are a product characteristic, and examining one finished unit will show the order-entry inefficiency that a conformity audit of the procedure misses.",
      "Commission a third-party registration audit. A registrar's conformity audit is the purpose that looks at organizational performance, and registration work is required to treat repeated order rewrites as outside the audit."
    ],
    "answer": 0,
    "why": "The difference between a compliance or conformity audit and an audit meant to promote improvement is the evidence each one collects. One verifies conformity to a standard or procedure. The other looks at organizational performance. An organization can conform to its order procedure and still be inefficient if every order is rewritten. Performance, risk, and improvement purposes are more likely on first-party process or system audits, but any audit type can include performance observations when that is the purpose. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 8–9.</span>"
  },
  {
    "qid": "cqa:set-1:b02-13",
    "set": 1,
    "sub": "cqa-purpose",
    "bok": "I.A.3",
    "cognitive": "Apply",
    "stem": "The audit program wants audits that identify risks and opportunities for improvement, not only broken requirements. Which assignment best matches that purpose?",
    "options": [
      "Assign a third-party registration audit whose only stated purpose is conformity to the standard for a certificate. A certificate audit is the strongest match for finding risks and opportunities for improvement.",
      "Assign a desk audit whose only purpose is to check that the forms are the current revision. A revision check is the audit built to identify risks and opportunities, rather than to verify that documents conform.",
      "Assign a first-party process or system audit whose purpose includes performance, risk, and improvement. Audits with that objective are more likely to be this kind than a conformity or compliance audit.",
      "Assign a regulatory audit whose purpose is detailed compliance with the law and which can end in a fine. A compliance audit is a better match for improvement than a first-party process audit or a system audit."
    ],
    "answer": 2,
    "why": "All audit types can report performance observations. Audits whose objective is to identify risks and opportunities for improvement are more likely to be first-party, process, or system audits. A certificate audit, a revision check, and a regulatory compliance audit are built around conformity or compliance. They are the weaker match for a program whose purpose is improvement. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 9.</span>"
  },
  {
    "qid": "cqa:set-1:b02-14",
    "set": 1,
    "sub": "cqa-purpose",
    "bok": "I.A.3",
    "cognitive": "Analyze",
    "stem": "Two findings are open. One is a typographical error in a work instruction that has already been corrected on the master copy. The other is a repeat failure of sampling equipment that could lead to a fine or to nonconforming product reaching a customer. The audit budget cannot support two single-purpose trips. What should drive the decision?",
    "options": [
      "Always combine every follow-up with the next scheduled audit, including the repeat equipment failure. Cost is the only factor, and the risk of a fine or of nonconforming product reaching a customer does not change that rule.",
      "Always make a separate trip for every open finding, including the typographical error already corrected on the master. Combining a follow-up with the next scheduled audit of the area is not allowed, whatever the cost or the risk.",
      "Let importance and risk decide. A single-purpose follow-up is costly and is normally combined with the next audit of the area, but the equipment failure may justify its own trip and the corrected typographical error does not.",
      "Close both findings from the corrective-action log without a follow-up visit. Follow-up audits are used only to verify preventive action on opportunities for improvement, not to check corrective action on an open finding."
    ],
    "answer": 2,
    "why": "Most corrective action cannot be finished during the audit, so the program may require a follow-up. Because a trip for one finding is expensive, follow-up is normally combined with the next scheduled audit of the area. That choice still depends on importance and risk. The handbook's examples of risk that an organization may not accept are a fine from a repeat sampling-equipment failure and sending nonconforming product to a customer. A corrected typographical error does not carry that risk. Follow-up can also verify preventive action on performance issues, but that is not the only use. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 9.</span>"
  },
  {
    "qid": "cqa:set-1:b02-15",
    "set": 1,
    "sub": "cqa-common",
    "bok": "I.A.4",
    "cognitive": "Apply",
    "stem": "A supervisor asks an engineer to spend an hour comparing the line the engineer designed with the line's theoretical capacity. There is no audit plan, and no one else will look at the engineer's own work. The supervisor wants the notes filed as an audit report. What is the activity?",
    "options": [
      "Do not file the notes as an audit. The hour lacks an audit plan and independence, the engineer is reviewing work the engineer developed, and a comparison with theoretical capacity is an evaluation.",
      "File the notes as a system audit. Capacity is a management-system result, so an hour comparing the line the engineer designed with theoretical capacity meets the requirements of a systematic, independent, and documented audit.",
      "File the notes as a third-party audit. Comparing the line with an outside idea of capacity makes the engineer independent of the company, even though the engineer designed the line and no audit plan exists for the hour.",
      "File the notes as a product audit. Theoretical capacity is a finished-product specification, so the engineer's hour is an audit of finished product even without a plan and without anyone else looking at the engineer's own work."
    ],
    "answer": 0,
    "why": "An audit is a systematic, independent, and documented process. Inquiries that do not meet the technical requirements, such as an audit plan or avoiding conflicts of interest, are evaluations or assessments, not audits. An evaluation is the more subjective comparison of current performance with some potential status, such as theoretical capacity. The engineer is also auditing work the engineer developed, which is a conflict. Capacity talk does not turn the hour into a system, third-party, or product audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 10.</span>"
  },
  {
    "qid": "cqa:set-1:b02-16",
    "set": 1,
    "sub": "cqa-common",
    "bok": "I.A.4",
    "cognitive": "Apply",
    "stem": "During a quality-system audit, the auditor, who is not recognized by the regulatory agency, concludes that a labeling practice violates the agency's regulation and writes the finding as a legal determination of noncompliance. What is the limit here?",
    "options": [
      "Do not write the finding as a legal determination of noncompliance. That determination belongs to people the agency recognizes as competent to interpret its regulations, and this auditor lacks that recognition.",
      "Issue the legal determination as written. Any trained quality auditor may interpret the regulation and declare a violation, and formal recognition by the regulatory agency is not required before that conclusion goes into the report.",
      "Issue the finding only if the auditor is a lawyer admitted to the bar. No one else may mention the regulation, including a person the agency has already recognized as competent to interpret it.",
      "Drop the labeling topic entirely. Labeling is never auditable because it is a statutory subject, so the team may not compare the practice with the company's own criteria even when someone qualified to do so is present."
    ],
    "answer": 0,
    "why": "Auditors have to stay inside their competence. Interpreting the law is often for lawyers admitted to the bar. Determining regulatory compliance belongs to people formally recognized by the agency, such as OSHA, EPA, or FDA, as competent to interpret those regulations. An auditor may be a technical subject expert and still lack that recognition. The limit is on declaring the legal conclusion, not on whether a labeling process can be audited against the company's own criteria by someone qualified to do so. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 10.</span>"
  },
  {
    "qid": "cqa:set-1:b02-17",
    "set": 1,
    "sub": "cqa-common",
    "bok": "I.A.4",
    "cognitive": "Apply",
    "stem": "An internal audit and a customer audit of the same process will differ in formality. The lead auditor says the data-collection methods can therefore be entirely different, and that the auditee, not an auditor, must perform any later check that the corrective action worked. Which part of that instruction is wrong?",
    "options": [
      "Reject only the point about formality. Internal and external audits must be equally formal in every element, including the opening meeting, while data-collection methods may differ entirely and only the auditee may later check that the action worked.",
      "Reject both claims. Data collection is the same for internal and external audits. The auditee implements and verifies the action, and an auditor may still be assigned to verify independently that it was implemented and effective.",
      "Accept both of the lead auditor's claims. Because formality differs, data-collection methods must be entirely different, and the auditee alone must verify the corrective action, with no auditor assigned to check it independently.",
      "Accept the instruction in full. External audits use different rules of evidence from internal audits, and an auditor's later check would only duplicate the auditee's verification, so no independent follow-up audit should be assigned."
    ],
    "answer": 1,
    "why": "Common elements include purpose and scope, document review, preparation, data collection, a formal report, and follow-up. Opening meetings and formality can differ: external audits are generally more formal, and an internal opening meeting may be shorter because the parties already know each other. Collection of the data is the same. The auditee is responsible for implementing the corrective action and for verifying it. An auditor may also be assigned a follow-up audit, which is an independent verification that the action was implemented and effective. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 11.</span>"
  },
  {
    "qid": "cqa:set-1:b02-18",
    "set": 1,
    "sub": "cqa-scope",
    "bok": "I.B.1",
    "cognitive": "Apply",
    "stem": "A new client tells the lead auditor only that the audit should 'see if the plant is in good shape.' Who owns the purpose, and what may the lead auditor do with a purpose stated that loosely?",
    "options": [
      "Treat the client as the owner of the purpose. The purpose is usually specific, but when the client states it only in general terms, the lead auditor specifies the particulars to fit the situation.",
      "Treat the auditee as the owner of the purpose. The lead auditor may not narrow a loose statement, and the plant, not the client, decides what a general request to see if the plant is in good shape will mean.",
      "Treat the registrar as the owner of every audit purpose, including this first-party visit. A loose client statement cannot be made specific by the lead auditor, because only the registrar may set the particulars.",
      "Leave the purpose in general terms. Specifying the particulars would change the audit into a different type, and a client who speaks only generally has forbidden the lead auditor to define the work."
    ],
    "answer": 0,
    "why": "The client determines the purpose. The statement is usually specific. When the client states it in general terms, the understanding is that the lead auditor will specify the particulars. For an audit done on a regular schedule, the purpose may already be known to everyone. The auditee does not own the purpose, and a first-party client is the organization's own management, not a registrar. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 15.</span>"
  },
  {
    "qid": "cqa:set-1:b02-19",
    "set": 1,
    "sub": "cqa-scope",
    "bok": "I.B.1",
    "cognitive": "Apply",
    "stem": "The purpose of the visit is to verify two open findings from March. The auditee asks the team to add the new product line, all of receiving, and the last five years of records. What does the purpose do to the scope?",
    "options": [
      "Let the auditee set the scope after the opening meeting. The stated purpose does not limit locations, processes, or the time period, so the new product line, all of receiving, and five years of records should be added.",
      "Repeat the full scope of the earlier audit for this follow-up. A follow-up that does not cover every location, activity, and time period from the first visit cannot close the two open findings from March.",
      "Let the purpose limit the scope. This follow-up stays with the previous findings. Scope normally names locations, organizational units, activities, processes, and the time period, and it may also name what is excluded.",
      "Treat scope as only the standard being used. Locations, organizational units, activities, processes, and the time period covered are audit criteria, not scope, so the purpose does not set those boundaries."
    ],
    "answer": 2,
    "why": "ISO 19011 describes audit scope as the extent and boundaries of the audit. It normally includes physical locations, organizational units, activities and processes, and the time period covered. The purpose limits that extent. A follow-up is limited to the previous findings, a product audit to finished goods, an element audit to the elements in the purpose, and a system audit to the management system. Scope may also name areas that are not included. Adding a new product line and five years of records would be a different audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 17.</span>"
  },
  {
    "qid": "cqa:set-1:b02-20",
    "set": 1,
    "sub": "cqa-scope",
    "bok": "I.B.1",
    "cognitive": "Apply",
    "stem": "The written scope covers IT security for the financial systems and states that quality-related computer systems will not be addressed. On the first morning the auditee asks to drop the financial systems and audit the quality systems instead. The team agrees verbally and starts. What was required?",
    "options": [
      "Accept the verbal agreement and start on the quality systems. Scope changes are recorded only in the final report, if they are recorded at all, and the participants do not have to be told before the team leaves the written scope.",
      "Allow a scope change only when a regulator orders it in writing. The auditee may not request a change of area, and an exclusion already written into the scope cannot be revisited for any reason during the audit.",
      "Do not treat the verbal switch as complete. If scope or criteria must change, the participants have to be informed and the change has to be documented in the audit plan before the new area is treated as in scope.",
      "Reject the written scope itself. Exclusions are not a normal part of scope, so leaving quality-related computer systems out means this is not an audit, and the team should have started on the quality systems without a documented change."
    ],
    "answer": 2,
    "why": "The handbook's own scope example excludes quality-related computer systems while including IT security for financial systems. Exclusions are a normal part of scope. If the scope or the criteria must change before or during the audit, the participants should be informed and the change documented in the audit plan. A hallway agreement does not do that. Where two management systems are audited together, the objectives, scope, and criteria also have to be compatible with the relevant audit programs. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 18.</span>"
  },
  {
    "qid": "cqa:set-1:b02-21",
    "set": 1,
    "sub": "cqa-benefits",
    "bok": "I.B.2",
    "cognitive": "Analyze",
    "stem": "Management wants early warning of problems in its own procedures, a chance to find causes, and fewer bad parts arriving from suppliers. It also wants a certificate that customers have started to demand. Which audit relationship serves which need?",
    "options": [
      "Use a first-party audit for early warning and causes on the company's own procedures. Use a second-party supplier audit to stop bad product from being shipped. Use a third-party audit for the certificate.",
      "Use a third-party audit for the early internal warning. Use a first-party audit to issue the certificate. Do not use a second-party audit, because a customer audit cannot look at suppliers or at the cost of bad incoming product.",
      "Use only a second-party audit for all three needs. The customer is the only legitimate client, so one customer audit covers the company's own procedures, the supplier controls, and the certificate that customers demand.",
      "Use only a product audit for all three needs. The benefits are limited to finished goods, so early warning, supplier control, and a demanded certificate all come from auditing finished product rather than from the party relationship."
    ],
    "answer": 0,
    "why": "A first-party audit tells management whether procedures are adequate and in use, and it can catch a problem early enough to find the cause and correct it. A second-party supplier audit is used to stop nonconforming product or service from being shipped, to cut cost and waste, and to build a clearer understanding of what the customer expects. Most third-party audits verify conformity to regulations or to voluntary standards, and some organizations use them for a certificate or an award. One relationship does not cover the other two needs. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 14.</span>"
  },
  {
    "qid": "cqa:set-1:b02-22",
    "set": 1,
    "sub": "cqa-benefits",
    "bok": "I.B.2",
    "cognitive": "Analyze",
    "stem": "A process meets every stated output target. The owner measures those results against the objectives management set. A conformity sample of the same process finds no broken requirement. Which conclusion about effectiveness is supported?",
    "options": [
      "Do not call the process effective until a registrar says it is. Meeting the stated output objectives is only efficiency, and the owner's comparison of results with the objectives management set is not evidence of effectiveness.",
      "Call the process effective. A process that meets its output objectives is an effective process, and the owner is measuring those results against the objectives management set, which is what audit evidence should show.",
      "Do not audit effectiveness at all. Effectiveness is a financial term reserved for the public sector, and meeting stated output targets in this process is neither effectiveness nor a subject an auditor may examine.",
      "Call the process ineffective. A conformity result and an effectiveness judgment cannot describe the same process, so meeting every stated output target still means the process has not been effective."
    ],
    "answer": 1,
    "why": "Effectiveness, efficiency, and performance sit together because management uses them to stay competitive and meet budgets. If a process meets its output objectives, it is an effective process. Management sets those objectives. Audit evidence should show whether the process owners measure results against them and know whether they are being achieved. Conformity is the closer link to meeting requirements and holding the current state. Meeting a target and conforming to the procedure are different questions, and both can be answered for the same process. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 14.</span>"
  },
  {
    "qid": "cqa:set-1:b02-23",
    "set": 1,
    "sub": "cqa-benefits",
    "bok": "I.B.2",
    "cognitive": "Analyze",
    "stem": "A first-party audit finds four issues: a guard that can injure an operator, a discharge that could draw an environmental fine, a contract penalty if the launch slips, and a pattern of late shipments that is costing future orders. The audit manager says only the contract penalty belongs in the report because risk means money. What should be reported?",
    "options": [
      "Report only the contract penalty. Safety of the operator, the possible environmental fine, and lost future orders are operational details rather than risks, and management does not need those three for its decisions.",
      "Report only the guard that can injure an operator. Financial effects, environmental fines, and loss of future sales are outside an audit's purpose, so they should stay out of a first-party report.",
      "Report all four issues. Safety risks, environmental risks, financial risks, and customer-goodwill risks are information management needs in order to make decisions, and limiting the report to the contract penalty drops three of those kinds.",
      "Report none of the four issues. Organizational risk is identified only during a third-party certification audit, so a first-party audit should leave worker safety, environmental fines, financial exposure, and customer goodwill out of the report entirely."
    ],
    "answer": 2,
    "why": "As auditing has evolved, management expects organizational risks to be identified. Risk is in every process, and the kind and degree have to be managed. The handbook lists safety risks to a worker or customer, environmental risks such as pollution and fines, financial risks such as lost revenue and excessive cost, and goodwill risks such as loss of future sales. Management needs that information for decisions. Restricting the report to the contract penalty drops three of the four kinds. Identifying risks and monitoring risk treatments is also one of the stated benefits of an audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 15.</span>"
  },
  {
    "qid": "cqa:set-1:b02-24",
    "set": 1,
    "sub": "cqa-benefits",
    "bok": "I.B.2",
    "cognitive": "Analyze",
    "stem": "The same procedure at the same site has produced the same nonconformity on three audits. Management review treats each one as a closed corrective action and does not look at the pattern. How should those results be used?",
    "options": [
      "Leave each occurrence closed. Recurrence is proof the corrective action worked, because a separate report was written each time, and management review should not treat the pattern as a reason to change the procedure.",
      "Stop auditing that procedure at the site. Three occurrences of the same nonconformity mean the process is no longer auditable, and the pattern should not be used as information for a management decision.",
      "Convert the pattern into a product-audit defect rate and close the system findings. System and process audits do not give management information for the next decision, and recurrence is not evidence about the plans.",
      "Use the recurrence in management review as possible evidence that the plans and procedures should be changed. Treated as information about the system, these audit results supply the Check step of Plan-Do-Check-Act."
    ],
    "answer": 3,
    "why": "Recurring nonconformities, at one location or against one procedure, are possible evidence that the plans and procedures should be changed. A review of potential inefficiencies is even more useful. When results are treated as added information about the system, auditing supplies the Check step of Plan-Do-Check-Act. Process and system audits can give management the knowledge to make the next decision. Closing the same finding three times, without looking at the pattern, wastes that information. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 19.</span>"
  },
  {
    "qid": "cqa:set-1:b02-25",
    "set": 1,
    "sub": "cqa-ethics",
    "bok": "I.E.1",
    "cognitive": "Apply",
    "stem": "The only person available for tomorrow's internal audit of the coating procedure is the engineer who wrote that procedure last month. The engineer says there is no conflict because the audit is internal and no customer will see the report. What should the audit manager do?",
    "options": [
      "Assign the engineer as planned. Internal audits are exempt from conflict-of-interest rules, and a coating procedure the engineer wrote last month can be judged by its author because the report stays inside the company and no customer will see it.",
      "Assign the engineer, but let the engineer skip any clause the engineer authored. Skipping those clauses removes the conflict, so the situation does not have to be reported and no other auditor is required for the area.",
      "Assign the engineer and classify the audit as third-party so the conflict disappears. Changing the label removes the prior involvement in the procedure, and the internal report can still be issued under that classification.",
      "Do not assign the engineer to judge the coating procedure the engineer wrote. Objectivity about that procedure will be difficult to maintain, so identify the conflict and assign a different auditor to the area."
    ],
    "answer": 3,
    "why": "Prior involvement in developing the quality program or the procedures used by the group being audited is a conflict of interest. If the auditor developed the process or wrote the procedure, it will be difficult to stay objective when that process or procedure is judged against a reference. Before the audit, the conflict has to be identified. The auditor must tell audit-program management or decline. Management can assign a different auditor or remove this one from the team. An internal audit is not exempt, and calling it third-party does not remove the conflict. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 31.</span>"
  },
  {
    "qid": "cqa:set-1:b03-01",
    "set": 1,
    "sub": "cqa-criteria",
    "bok": "I.C",
    "cognitive": "Analyze",
    "stem": "An auditor wants a finding because finished reports use a different layout from the one she prefers. No procedure, contract, or standard requires that layout. The reports are readable. She says the layout is an implied requirement because she is the auditor. What is the right conclusion?",
    "options": [
      "Issue the finding and treat the preferred layout as an implied requirement, because an auditor's personal taste is a common-practice rule whenever no procedure, contract, or standard names a report format.",
      "Rewrite the finding against document control. Any layout that differs from the auditor's preference fails common practice, even when the reports remain readable and no contract or standard requires that format.",
      "Reclassify the visit as a survey and stop comparing the reports with criteria, because an auditor's dislike of a format ends the audit and leaves personal preference as the only basis for the result.",
      "Do not issue a finding. Auditors compare evidence with criteria rather than with their own opinion, and an implied requirement is a common expectation such as a legible report, not a preferred layout."
    ],
    "answer": 3,
    "why": "Audit criteria are the policies, procedures, or requirements used as the reference. Requirements may be written, or they may be generally implied by custom or common practice. The handbook's examples of implied requirements are a clean product, timely service, a legible report, and good hygiene. They are not the auditor's personal taste. The audit principle is that auditors audit against criteria, a set of rules, or specified controls, and not against their own opinion. Evidence used for a finding has to be relevant to those criteria. A readable report in an unpreferred layout does not meet that test. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 20.</span>"
  },
  {
    "qid": "cqa:set-1:b03-02",
    "set": 1,
    "sub": "cqa-criteria",
    "bok": "I.C",
    "cognitive": "Analyze",
    "stem": "A plant manual says the site will meet a customer cleanliness standard. A procedure says how the standard will be met. A work instruction gives the step-by-step method at the bench. Where do these three documents sit in the four levels of performance standards?",
    "options": [
      "Classify the plant manual as a policy, the procedure as a detailed document, and the work instruction as a manual, because the document that names the customer standard always sits at the top of the four levels.",
      "Treat all three as policies, because each one tells people what to do, and manuals, procedures, and work instructions are only different names for the same top level of performance standards.",
      "Classify the plant manual as a manual, the procedure as a procedural document, and the work instruction as a detailed document, because policies sit above the manual in the four levels of performance standards.",
      "Treat only the work instruction as a performance standard, and set the manual and the procedure aside as audit reports, because step-by-step bench directions are the only norms an activity is measured against."
    ],
    "answer": 2,
    "why": "Performance standards are the documents that hold the norms against which an activity is measured. They show how external requirements will be met and may add requirements of their own. The four levels are policies, manuals, procedural documents, and detailed documents. A plant manual is a manual. A standard operating procedure that explains how a requirement will be met is a procedural document. A work instruction, drawing, specification, or inspection plan that gives the step-by-step job is a detailed document. Policies sit above the manual and include corporate policy statements and regulatory or sector standards. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 21.</span>"
  },
  {
    "qid": "cqa:set-1:b03-03",
    "set": 1,
    "sub": "cqa-criteria",
    "bok": "I.C",
    "cognitive": "Analyze",
    "stem": "A purchase order requires ISO 9001 and also requires a customer cleanliness limit that ISO 9001 does not contain. The supplier has a registrar's ISO 9001 certificate. The customer still wants its own audit. What can that audit use as criteria?",
    "options": [
      "Limit the criteria to the registrar's certificate. Once a third party has verified ISO 9001, that decision replaces the purchase order, and the customer may not audit the cleanliness limit or any other added contract requirement.",
      "Use the contract, including the cleanliness limit that ISO 9001 does not contain. A third party may verify the management-system standard, but the customer may still add requirements, which is an ISO 9001-plus audit.",
      "Use only the cleanliness limit and drop ISO 9001. The registrar's certificate cancels the management-system standard as a criterion, so the contract's extra limit is the only remaining requirement.",
      "Use neither the contract nor ISO 9001. Specifications are the only criteria allowed on a second-party audit, and a certificate already covers every requirement the customer may add."
    ],
    "answer": 1,
    "why": "In a second-party audit the purchase order or other contract states the requirements, and the audit checks whether the supplier is meeting them. A contract may require a management-system standard such as ISO 9001. A third party may verify conformity to that standard. The customer may still have additional requirements. The handbook calls that an ISO 9001-plus audit. An ISO 9001-minus audit is the opposite case, where not every ISO 9001 control is required. A certificate does not erase contract requirements the registrar did not audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 22.</span>"
  },
  {
    "qid": "cqa:set-1:b03-04",
    "set": 1,
    "sub": "cqa-criteria",
    "bok": "I.C",
    "cognitive": "Analyze",
    "stem": "A manager asks for an audit of a new service but will not name a standard, a contract, a specification, a policy, or a regulation. He says the auditor should just see whether the service looks good. What is this activity?",
    "options": [
      "Call it an audit and proceed on the manager's request. Criteria are optional when the auditor is experienced, and a judgment that the service looks good is a sufficient basis for findings.",
      "Call it a product audit and judge the service by eye. Product and service audits normally use specifications, but here eyesight replaces any named specification, contract, policy, or regulation.",
      "Do not call this an audit. Criteria must exist even though there is no minimum number, and with nothing to compare the organization against, the work is a survey or a review.",
      "Call it a regulatory audit and use the law as the criterion by default. When the manager names no document, case law and the agency's guidelines fill the audit plan without being stated."
    ],
    "answer": 2,
    "why": "The reference documents that can form the audit basis include management-system or product standards, contracts, specifications, organization policies and objectives, and laws or regulations. Product and service audits normally use specifications. Internal audits often use the company's own policies and its progress toward stated objectives. Regulatory audits use the law, case law, and the agency's own guidelines. The criteria have to be stated in the audit plan. There is no minimum or maximum amount. If there are no criteria, the investigation may be called a survey or a review, not an audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 22.</span>"
  },
  {
    "qid": "cqa:set-1:b03-05",
    "set": 1,
    "sub": "cqa-roles",
    "bok": "I.D",
    "cognitive": "Apply",
    "stem": "A company asks a registrar to examine its system against ISO 9001 so it can be certified. Who is the client, who is the auditee, and who is the auditing organization?",
    "options": [
      "Name the registrar as the client, the company as the auditee, and the company's quality manager as the auditing organization, because the body that grants the certificate is the party that requested the audit.",
      "Name the company's top management as the client, that same company as the auditee, and the registrar as the auditing organization, because the client is the party that requested the audit.",
      "Name the accreditation body as the client, the registrar as the auditee, and the company as the auditing organization, because a certification audit reverses those three roles and the company examines the registrar.",
      "Name the customer who buys the product as the client, the company as the auditee, and the registrar as a supplier, because the purchaser is always the client of a certification audit."
    ],
    "answer": 1,
    "why": "The client is the person or organization that requested the audit. In a certification audit the client is the top management of the organization that wants certification. The auditee is that same organization. The auditing organization is the body that grants the certification, using its own auditor or an auditor it hires. The registrar is not the client. The client is the party that asked for the audit. In a supplier audit the client is the customer's purchasing agent, manager, or engineer, and the auditee is the supplier. In a regulatory audit the client is the agency. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 23.</span>"
  },
  {
    "qid": "cqa:set-1:b03-06",
    "set": 1,
    "sub": "cqa-roles",
    "bok": "I.D",
    "cognitive": "Apply",
    "stem": "The audit is finished. The auditee asks the lead auditor to send the report only to the department that was audited, and not to the person who commissioned the audit. The auditee also says the department, not the lead auditor, will decide whether any follow-up is needed. Who has these duties?",
    "options": [
      "Give the report to the client, who decides who else receives it and whether follow-up is needed. The lead auditor prepares the report, and the auditee takes the corrective action.",
      "Give distribution to the lead auditor because the lead auditor wrote the report, and give the follow-up decision to the auditee, because the department that was audited owns the processes.",
      "Give both distribution and the follow-up decision to the auditee. The department that was audited owns the processes, so it may withhold the report from the person who commissioned the audit.",
      "Have the audit program manager write the final report and keep it from the client. The client sets the purpose, but distribution and follow-up stay inside the auditing organization."
    ],
    "answer": 0,
    "why": "The client determines the need for the audit, the purpose, and the overall scope, receives the report, decides how the report is distributed, and determines the need for follow-up. The lead auditor communicates with the client and the auditee, directs the team, conducts the meetings, prepares the final report with the team's input, and resolves conflicts of interest. The auditee informs employees, gives access to the areas in scope, attends the meetings, acknowledges the results, and takes corrective action. Withholding the report from the client reverses the client's role. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 25–26.</span>"
  },
  {
    "qid": "cqa:set-1:b03-07",
    "set": 1,
    "sub": "cqa-roles",
    "bok": "I.D",
    "cognitive": "Apply",
    "stem": "During the audit an operator asks the auditor to assign the corrective action, pick the due date, and rewrite the procedure before leaving the area. The escort says that is part of cooperating with the auditor. What belongs to whom?",
    "options": [
      "Have the auditor assign the action, pick the due date, and rewrite the procedure before leaving. Cooperation means the auditee accepts the auditor's solution as part of giving access.",
      "Have the escort assign the action and the due date. The escort owns corrective action on behalf of the client, and the auditor's only duty is to approve the rewritten procedure.",
      "Hold every change until the accreditation body approves the wording of the procedure. Neither the auditor nor the auditee may record evidence or assign corrective action during the visit.",
      "Leave the corrective action with the auditee. The auditor collects and records evidence and reports it to the lead auditor, and cooperation does not mean the auditor redesigns the process."
    ],
    "answer": 3,
    "why": "The auditor's duties are to understand the purpose, scope, and criteria, collect evidence, record the results, attend the meetings, report findings to the lead auditor, keep information confidential, and report conflicts of interest. The auditee's duties include cooperation and access, acknowledgment of the results, and corrective action on the findings. Cooperation is not the same as letting the auditor redesign the process. The lead auditor directs the team and prepares the report. The escort is the person assigned to accompany the team, not the owner of the corrective action. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 25–26.</span>"
  },
  {
    "qid": "cqa:set-1:b03-08",
    "set": 1,
    "sub": "cqa-legal",
    "bok": "I.E.2",
    "cognitive": "Analyze",
    "stem": "On a second-party audit the auditor sees open containers of hazardous chemical next to a welding station. The condition is outside the agreed scope. No one on the team is in immediate danger. What must the auditor do?",
    "options": [
      "Do not ignore the unsafe condition. On this external audit, tell the auditee immediately and make a record. Stop and move the team only if someone is endangered, and do not treat the hazard as a quality-clause nonconformity.",
      "Ignore the containers because they sit outside the agreed quality scope. An external auditor may mention only planned criteria, and a hazard that endangers no one on the team is not recorded.",
      "Write a major nonconformity against the quality standard. Every unsafe condition is automatically a quality-system finding, so the team stops the audit and calls the regulator before speaking to the auditee.",
      "Stop the audit at once and call the regulator before telling the auditee. External auditors may not speak to the auditee about safety, and an out-of-scope condition becomes a quality finding only after the agency has arrived and directed the team."
    ],
    "answer": 0,
    "why": "An unsafe practice must not be ignored, whether it is inside or outside the scope. On an internal audit the auditor immediately tells an auditee representative and the team leader, who tells the auditee's manager. On an external audit, second-party or third-party, the auditor immediately tells the auditee and creates a record. If anyone on the team is endangered, the audit stops and the auditors return to a safe area. Management usually wants to hear about a liability risk. Being outside the quality scope does not make the condition optional, and it also does not automatically convert it into a nonconformity against a quality clause that was not the criterion. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 35.</span>"
  },
  {
    "qid": "cqa:set-1:b03-09",
    "set": 1,
    "sub": "cqa-legal",
    "bok": "I.E.2",
    "cognitive": "Analyze",
    "stem": "The team finds ten product defects and, in the report, ranks them in the order the supplier should correct them before shipping resumes. A lawyer later asks whether that ranking created any legal exposure. What did the ranking do?",
    "options": [
      "Treat the ranking as a communication aid with no legal effect. Putting defects in a preferred order cannot create liability, because the auditee remains solely responsible for every fix the team suggests.",
      "Treat the ranking as partial responsibility for the solution. The team and its company can be at least partly liable if a later problem involves those products, and that is a due-care and agency problem, not a securities violation.",
      "Treat the ranking as a transfer of the whole legal duty from the auditee to the registrar. Only a certification body may set the order of fixes, so the audit team and its company drop out of any later claim about those products.",
      "Treat the ranking as a securities violation. Any written list of product defects is nonpublic investor information, and the due-care question does not arise when the team sets an order of work."
    ],
    "answer": 1,
    "why": "An auditor who tells the auditee how to do the work can create liability if the auditee relies on that direction and later fails. Even when the guidance fixes the immediate problem, the auditor still owns the solution. The handbook's example is an audit team that recorded ten defects and prioritized them. That ranking meant the team accepted partial responsibility for the solution, so the team and its company can be at least partly liable if a problem with those products surfaces later. A different illegal use of audit information is trading on nonpublic acquisition plans, which is a securities violation, or leaving a known contract breach out of the report, which can be aiding and abetting. Ranking the fixes is the due-care and agency problem, not the securities problem. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 42.</span>"
  },
  {
    "qid": "cqa:set-1:b03-10",
    "set": 1,
    "sub": "cqa-credibility",
    "bok": "I.E.3",
    "cognitive": "Apply",
    "stem": "The audit group reports to the manager of the department it audits. After each audit that manager uses the named findings as the only basis for cutting bonuses in the department. The auditors themselves are experienced. What happens to credibility?",
    "options": [
      "Conclude that credibility is unchanged because the auditors are experienced. Competent people repair a reporting line into the audited function and also repair the use of named findings as the only basis for cutting bonuses or imposing discipline.",
      "Conclude that credibility falls. The audit group should not report to the manager of the function being audited, and using results as the sole basis for bonuses is misuse no matter how experienced the auditors are.",
      "Conclude that credibility rises. Tying bonuses to named findings proves that management supports the audit, and reporting to the audited manager keeps the program close to the work.",
      "Conclude that credibility is affected only when the auditors are not certified. Pay and discipline decisions are outside the definition of misuse, so the reporting line can stay where it is."
    ],
    "answer": 1,
    "why": "A credible audit is a meaningful one. Competent people have to gather and handle the information in an unbiased and ethical way. The audit group should be structured so that it does not report directly to the manager of the function being audited. Management has to use the results appropriately. Misuse, or a failure to start corrective action, erodes the credibility of the program regardless of how well the auditors performed. The handbook includes, as misuse, using the results as the sole basis for discipline and using them to decide a pay raise, a bonus, or a perk. Experience does not repair that structure or that use. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 48.</span>"
  },
  {
    "qid": "cqa:set-1:b03-11",
    "set": 1,
    "sub": "cqa-planning",
    "bok": "II.A.1",
    "cognitive": "Evaluate",
    "stem": "A department supervisor drafts an audit of corporate headquarters. No manual, policy, contract, or regulation gives that department the right to audit headquarters, and no higher manager has requested it. The supervisor says preparation can start because the team is qualified. What is missing?",
    "options": [
      "No further authority is missing. Qualification of the team is the only authority an internal audit needs, and a department supervisor may commission an audit of corporate headquarters once preparation is ready to start.",
      "A checklist is missing, and that is the only gap. Writing the checklist creates authority to audit, and hierarchical position does not matter once a qualified team is ready to examine headquarters.",
      "A registrar's certificate is missing. Only a certification body can authorize an internal audit, so a vice president's request would not legitimate an audit of department operations either.",
      "Authority is missing. It has to come from a person or an approved document, and hierarchical authority has to sit higher than the function being audited, so this department cannot audit headquarters."
    ],
    "answer": 3,
    "why": "Verifying authority is a basic planning step. It makes the audit legitimate and avoids preparing for something that was never authorized. Authority has to exist. It comes from a person, or from a document approved by a person with authority. Internal authority is organizational, such as a manual or a policy, or hierarchical, through the chain of command. Hierarchical authority has to be higher than the functions being audited. A department auditing corporate headquarters is the handbook's example of a request that will not work. A vice president can request an audit of department operations. A qualified team does not create authority by itself. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 55–56.</span>"
  },
  {
    "qid": "cqa:set-1:b03-12",
    "set": 1,
    "sub": "cqa-planning",
    "bok": "II.A.1",
    "cognitive": "Evaluate",
    "stem": "A customer wants to audit a supplier next month. The purchase order has no right-of-access clause, and no one can find another agreement that permits the visit. The supplier also runs a research project for a competitor and does not want that project opened. Which conclusion is sound?",
    "options": [
      "Do not perform the supplier audit until authority exists, normally in the purchasing agreement. If a later contract allows access, define the competitor's research project in advance as excluded.",
      "Perform the audit next month on the customer's wish to visit. Second-party authority does not have to appear in a purchasing agreement, and a competitor's research project must be opened with the rest of the plant.",
      "Perform the audit because industry standards are regulations. They authorize a customer visit even without a contract, and they require the competitor's research project to be included in the scope.",
      "Wait for a right-of-access clause, then treat it as permission to audit at any hour, including after the plant has closed, because that clause removes the usual limit to normal business hours."
    ],
    "answer": 0,
    "why": "Second-party authority should reside in the purchasing agreement. It is often a right-of-access clause, and that clause usually allows reasonable access during normal business hours. The signed contract is the source. Proprietary work, such as research done for a competitor, is defined and excluded, and that exclusion should be set in advance. Industry standards can be a basis for internal audits, but they are not regulatory documents. They clarify or amplify regulations. They do not replace a missing contract as the authority for a customer to walk in. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 56–57.</span>"
  },
  {
    "qid": "cqa:set-1:b03-13",
    "set": 1,
    "sub": "cqa-selection",
    "bok": "II.A.2",
    "cognitive": "Analyze",
    "stem": "An auditor has years of experience, knows the standard cold, and has always worked alone. The audit manager wants to make this person lead auditor of a six-person team because of that technical record. What should the manager weigh?",
    "options": [
      "Do not appoint this person on technical record alone. Experience and criteria knowledge do not make an effective lead, who needs communication, project management, and social skill, and a strong auditor may remain a principal auditor.",
      "Appoint this person as lead because technical knowledge is the only requirement. People skills are optional, and the most experienced auditor on a six-person team must take the lead role.",
      "Keep this person as an auditor and appoint a lead only if the team is one person. A single-person audit is the only case in which anyone is the lead, so a six-person team has no lead role.",
      "Ask the auditee to choose the lead from the escort pool. The lead role is an auditee assignment, and the audit manager's view of experience does not decide who directs the team."
    ],
    "answer": 0,
    "why": "Every team has a lead auditor. When the team is one person, that person is the lead. When the team is larger, the lead is identified first and helps select the others. The lead has ultimate responsibility for every phase and for the team's conduct, prepares the plan, runs the meetings, and submits the report. Considerable experience and expert knowledge of the criteria do not guarantee that a person will be an effective lead. Someone who has worked alone for years may be uncomfortable directing others. Organizations may recognize a principal auditor without forcing that person into a role that needs communication, project management, and social skill. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 66.</span>"
  },
  {
    "qid": "cqa:set-1:b03-14",
    "set": 1,
    "sub": "cqa-selection",
    "bok": "II.A.2",
    "cognitive": "Analyze",
    "stem": "The audit is a process audit of a specialized coating line. The only employee who understands the line is the engineer who runs it day to day. A second candidate understands the management-system standard but has never seen this process. How should the team be built?",
    "options": [
      "Use only the candidate who knows the management-system standard. Process audits, like system audits, do not need related process experience, and the coating engineer must stay off the team entirely.",
      "Assign the coating engineer to audit his own procedure and his own day-to-day work. Ownership of the process is an advantage on a process audit, and bringing in an outside expert would violate independence by letting a stranger enter the area.",
      "Staff this process audit with related process experience, unlike a system audit of scheduling. Either let the coating engineer audit the function without auditing his own work, or bring in a briefed outside expert.",
      "Leave every process expert off the team. Independence forbids any specialist from entering the area, so the candidate who knows only the standard audits the coating line without related process experience."
    ],
    "answer": 2,
    "why": "For a system audit, auditors are not required to have done the specific job. A scheduling department can be audited by someone who has never been a scheduler. For a process audit, related process experience matters. Auditors still cannot audit their own work or an area they are responsible for, and they should not audit their own department when that can be avoided. When almost no one else is qualified, a subject expert may audit the department's function as long as the expert does not audit his or her own work. An outside contractor with the right expertise is the other option. The expert has to be briefed on the role before the audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 67–68.</span>"
  },
  {
    "qid": "cqa:set-1:b03-15",
    "set": 1,
    "sub": "cqa-preaudit",
    "bok": "II.A.3",
    "cognitive": "Analyze",
    "stem": "Before a second-party audit, the supplier will send manufacturing records but refuses to send the process procedures until the team is on site. The procedures exist only on the supplier's intranet, and some pages are marked proprietary. What is acceptable?",
    "options": [
      "Accept electronic procedures if they can be recorded, reviewed, and retrieved. Proprietary pages may be removed before documents are sent, and the supplier may withhold the procedures until the audit while still providing the records.",
      "Reject anything stored on an intranet. Only paper issued by the auditor counts as audit documentation, so the supplier must print every procedure, including the proprietary pages, before the visit.",
      "Cancel the audit before it starts. Withholding a procedure until the team is on site is a refusal of access, and removing proprietary pages, or blocking them online, is a second refusal that ends the engagement.",
      "Copy every proprietary page into the checklist before leaving so the file is complete. Electronic files are not retrievable evidence, and a delayed procedure has to be transcribed into the working papers."
    ],
    "answer": 0,
    "why": "Before the audit the lead auditor asks what documents exist and requests copies or online access. Historically the form was paper. Any medium that can be recorded, reviewed, and retrieved is acceptable, including computer files and audio or video. Proprietary material may be removed before the documents are sent, or online security may block access. For subcontracted manufacturing or testing, the subcontractor will often provide the records, or the auditor may already have them, and may not want to share the procedures until the audit itself. Copying proprietary pages into the working papers creates a later discovery problem. It is not the remedy for a delayed procedure. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 69.</span>"
  },
  {
    "qid": "cqa:set-1:b03-16",
    "set": 1,
    "sub": "cqa-preaudit",
    "bok": "II.A.3",
    "cognitive": "Analyze",
    "stem": "The records the team will rely on are stored as scanned images. A colleague says data integrity is a concern only for paper, because a scan cannot be incomplete. What has to be asked about these records?",
    "options": [
      "Ask nothing further about integrity. A scanned image is complete and reliable by definition, so both the accuracy question and the security question apply only to paper records that someone can alter by hand.",
      "Ask only whether the scanner was calibrated. Accuracy of the content is outside an auditor's interest, and security of an electronic file is not part of data integrity.",
      "Ask whether the documented information is accurate and whether it is secure. Those two questions apply to paper and to electronic records, and a scan can still be incomplete, altered, or unprotected.",
      "Ask only whether the file name matches the procedure number. Security belongs to an information-technology audit, and a quality auditor does not question the accuracy of a scanned record."
    ],
    "answer": 2,
    "why": "Review of documented information is a primary way to obtain evidence of conformity. The handbook names two questions for data integrity of documents and records: is it accurate, and is it secure? Both apply whether the format is paper or electronic. Electronic information has additional considerations, but the format does not retire either question. A scan can be incomplete, altered, or unprotected. Calibration of a scanner may matter in a specific process, but it is not a substitute for those two questions. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 69.</span>"
  },
  {
    "qid": "cqa:set-1:b03-17",
    "set": 1,
    "sub": "cqa-logistics",
    "bok": "II.A.4",
    "cognitive": "Apply",
    "stem": "The audit will be remote. The plan has no virtual meeting room, no check of upload speed, and no decision about cameras or recording. The lead auditor says logistics apply only when the team travels, so these items can wait until the closing meeting. What is wrong?",
    "options": [
      "Settle the remote arrangements before data collection, and no later than the end of the opening meeting. A remote audit still needs a virtual meeting place, video upload speed, and permission for cameras or recording.",
      "Treat logistics as travel, hotels, and maps only. A remote audit has none of those needs, so the meeting room, the upload speed, and camera permission can wait until the closing meeting.",
      "Keep upload speed out of the audit plan because it is a product specification rather than a logistics item. Recording is always allowed on a remote audit, so permission for cameras can be skipped and settled after the closing meeting.",
      "Allow recording without permission and ignore upload speed. Remote logistics are optional once the team has a video link, and they may be decided for the first time at the closing meeting."
    ],
    "answer": 0,
    "why": "Poor logistics make the team look unprofessional and can put the objectives at risk. When the team travels, the plan includes arrival, meeting rooms, maps, safety equipment, security clearance, and lodging. A remote or e-audit still needs a place for virtual meetings and interviews, audio and video hardware and software, and upload speed that can carry the video. Both on-site and remote audits need access to documents, a safe place for confidential information, permission to use phones, cameras, or recorders, and escorts or guides. Most of this is settled before the performance phase, and no later than the close of the opening meeting. Leaving it until the closing meeting is too late. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 73–75.</span>"
  },
  {
    "qid": "cqa:set-1:b03-18",
    "set": 1,
    "sub": "cqa-working-papers",
    "bok": "II.A.5",
    "cognitive": "Apply",
    "stem": "An auditor refuses to build a checklist and says a good auditor notices whatever matters. During the audit she asks only the questions on a generic ISO 9001 list she has used for three years, and she does not look at a leaking tank beside the line because it is not on the list. What is the failure?",
    "options": [
      "Treat the three-year generic list as proof of a complete audit. Anything not printed on it, including the leaking tank beside the line, is out of scope, and an experienced auditor does not need a checklist prepared for this particular visit.",
      "Treat this as a checklist failure. Without a prepared checklist there is no disciplined place to record the audit, and a canned list used alone hides what else is happening even though the list may be expanded inside the scope.",
      "Ban checklists and limit working papers to the final report. Questions prepared before the audit, and anything noticed off a list, are both outside the evidence the team may record.",
      "Ignore the leaking tank and ask only questions written before the opening meeting. A checklist is a fence, and expanding it during the audit takes the auditor outside the agreed scope."
    ],
    "answer": 1,
    "why": "The checklist is the primary tool for organizing the audit. Without one, the activity is disjointed and the auditor has no place to record notes. A completed checklist is evidence that the audit was performed, a record of what was examined, and a tool for sampling and time. Generic lists drawn from a standard are common and help make sure the clauses are addressed. They also have a limit. Used alone, they produce a checklist mentality: the same questions, audit after audit, at the expense of what is happening around the auditor. The list is not a fence. It can be expanded during the audit as long as the auditor stays inside the scope. It does not replace looking at the area. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 76–78.</span>"
  },
  {
    "qid": "cqa:set-1:b03-19",
    "set": 1,
    "sub": "cqa-working-papers",
    "bok": "II.A.5",
    "cognitive": "Apply",
    "stem": "The auditor finishes a fresh checklist, then reads the last audit report and finds an open corrective action and a customer complaint that was never closed. A colleague says reading the old report first would have been better, and that the checklist must be sent to the auditee because it is the standard. What is the better sequence?",
    "options": [
      "Read every previous report before writing any question, and build the new audit around whatever the last report contained. The checklist is the standard, so it must be sent, and in-scope areas that are not listed may not be examined at all.",
      "Write the checklist first, then read prior audits so the old report does not bias it. Add the open corrective action and the unanswered complaint. Sending the list is a choice, and if sent, say it is not the standard.",
      "Never read a prior audit. Prior findings, open actions, and unanswered complaints are out of scope by definition, and the checklist must still be sent because it is the standard.",
      "Replace the checklist with the guidelines, treating those guidelines as mandatory, and file the log sheet as the final report. Open corrective actions and unanswered complaints are optional background and need not be added."
    ],
    "answer": 1,
    "why": "The handbook's reason for reading previous audits after the checklist is written is to avoid building the new audit around whatever was in the old report. Once the checklist exists, open corrective actions and unanswered complaints are added, because those issues cannot be ignored. Forwarding the checklist is the auditing organization's choice. For a first- or second-party audit it is normally provided if the auditee asks, in the spirit of cooperation, with a reminder that the checklist is not the standard. Areas inside the purpose and scope may be examined even if they are not on the list. Guidelines are good practice and are not mandatory. A log sheet is the chronological record of where the auditor went and whom the auditor talked to. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 78.</span>"
  },
  {
    "qid": "cqa:set-1:b03-20",
    "set": 1,
    "sub": "cqa-strategies",
    "bok": "II.A.6",
    "cognitive": "Apply",
    "stem": "Finished goods are failing a customer test. The auditor starts with a failed unit and walks upstream through painting, then the inputs to painting: method, machine, material, people, measurement, and environment. A colleague says tracing has to start at receiving or it is not tracing. What is the colleague missing?",
    "options": [
      "Reject the upstream walk because only forward tracing is a recognized strategy. The trace has to start at receiving and move downstream, and method, machine, material, people, measurement, and environment are a sampling plan rather than part of tracing.",
      "Call this a department audit. Tracing cannot cross from the failed product back into painting, and recording method, machine, material, people, measurement, and environment is outside that strategy.",
      "Call the six inputs a sampling plan and stop the walk. Tracing is defined only as a forward pass from receiving, so starting at a failed unit is not an audit strategy.",
      "Recognize this as backward tracing. It may start at the end or the middle and move upstream, and it can be more revealing than forward tracing because the auditor works from the result back into the activity."
    ],
    "answer": 3,
    "why": "Tracing follows the chronological path of something as it is processed. Forward tracing starts at the beginning or the middle and moves downstream. Backward tracing starts at the middle or the end and moves upstream. Backward tracing can be more revealing because the auditor sees the result of the preceding activity and works from that result. The mechanics are to pick an action, record the six process inputs, and follow the transaction forward or backward. Those facts go on the checklist. Tracing is useful when a procedure is unclear, when the evidence of conformity is hard to find, and when the question is performance. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 81.</span>"
  },
  {
    "qid": "cqa:set-1:b03-21",
    "set": 1,
    "sub": "cqa-strategies",
    "bok": "II.A.6",
    "cognitive": "Apply",
    "stem": "The team has not planned the audit. On arrival the lead auditor walks the floor looking for something wrong, with no path and no process map. The auditee says the visit feels like a hunt for a finding. Which strategy is in use, and what is its limit?",
    "options": [
      "Name the element method and continue the unplanned walk. That method is the strongest way to verify how processes interact, and a floor tour with no path and no process map is the required opening of every process audit.",
      "Name this the discovery method. It can help when a problem is known but not yet found, but it has no clear pattern, does not replace planning, and the auditee may read it as a search for a nonconformity.",
      "Name the department method and require it whenever a process map is missing. Treating one area as the whole organization is the point of that method, not a risk to the conclusion.",
      "Name this backward tracing. Tracing is defined as walking the floor without a starting point, and the auditee's sense of a hunt is evidence that the method is working."
    ],
    "answer": 1,
    "why": "The discovery method, sometimes called random auditing, looks at what is happening now. It has no clear pattern. The auditor can get lost or spend too much time in one place. If the audit was planned, this method should usually be unnecessary. It can help when the auditor knows a problem exists but has not found it. The auditee may read it as a search for a nonconformity. It does not replace preparation for a process audit. The element method has the opposite strength: a direct link to the clauses of a standard, and the weakness that interactions may never be verified. A system can comply clause by clause and still be ineffective. The department method can also misrepresent the organization if one small group is treated as the whole. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 83 and 85.</span>"
  },
  {
    "qid": "cqa:set-1:b03-22",
    "set": 1,
    "sub": "cqa-audit-plan",
    "bok": "II.A.7",
    "cognitive": "Create",
    "stem": "The quality manager shows the auditor a calendar that lists twelve audits for the year and says that calendar is the audit plan for next Tuesday's process audit. What is the difference?",
    "options": [
      "Treat the calendar and the plan as the same document under two names. A yearly list of twelve audits already states the purpose, scope, and assignments for next Tuesday's process audit.",
      "Call the yearly calendar the audit plan, and forbid that plan from naming any date. Dates belong only on a separate schedule, so next Tuesday's process audit is fully defined as soon as the twelve-audit list shows that the visit will occur.",
      "Drop the plan once the opening meeting starts and let the yearly schedule replace it. After that meeting, purpose, scope, and who will be where are no longer communicated in a plan.",
      "Call the calendar the audit schedule, which lists the audits that fall in a block of time. The audit plan is the document for one system audit or one sequence of process audits and says what that audit will cover."
    ],
    "answer": 3,
    "why": "The audit plan is the main product of the preparation phase and the main way the team communicates what will happen. It is not the audit schedule. The plan says what will be covered in a particular system audit or in a sequence of process audits. The schedule says which audits will be performed in a block of time. A yearly calendar does not tell next Tuesday's team the purpose, the scope, the clauses or processes, or who will be where. Those belong in the plan. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 85.</span>"
  },
  {
    "qid": "cqa:set-1:b03-23",
    "set": 1,
    "sub": "cqa-audit-plan",
    "bok": "II.A.7",
    "cognitive": "Create",
    "stem": "The lead auditor has drafted the plan. The auditee objects to the proposed date. The draft also has no time for the team to sit together and sort findings before the closing meeting, and no opening meeting. The lead auditor intends to issue the plan without talking to anyone else. What has to happen first?",
    "options": [
      "Resolve the date objection with the auditee and the client before treating the plan as final. Include the purpose, scope, lead, team, auditee, location, and date, plus the opening meeting and time for the team to prepare findings before closing.",
      "Issue the plan now and resolve objections only in the closing meeting. A team review of findings is optional, and the header does not need a purpose, a scope, or an opening meeting.",
      "Remove the purpose and the scope so the auditee cannot object, then issue the plan. The header is optional, and time to prepare for the closing meeting can be added verbally on the day.",
      "Let the auditee rewrite the plan alone and accept that draft as final. The client is not a party to a date objection, the opening meeting can be omitted, and the team does not need a reserved slot to sort findings before the closing meeting."
    ],
    "answer": 0,
    "why": "The plan is built from the purpose and scope, and from the time and resources available. The header carries the purpose, scope, lead auditor, team, auditee, location, and date no matter what type of audit it is. The body follows the job: clauses and times if the purpose is conformity to a standard, contract provisions if the purpose is the contract. Time for a short tour, the opening meeting, and the closing meeting belongs on the plan. So does a daily slot to review that day's findings, and a reserved slot for the team to assess the findings before the closing meeting. Without that slot the review gets rushed. Before the plan is issued, the lead auditor contacts the auditee to verify the date. Objections are resolved among the team leader, the auditee, and the client. Issuing the plan over an unresolved objection skips that step. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 85–86.</span>"
  },
  {
    "qid": "cqa:set-1:b04-01",
    "set": 1,
    "sub": "cqa-onsite-auditor",
    "bok": "II.B.1",
    "cognitive": "Evaluate",
    "stem": "At the midday team meeting two auditors describe the same coating record in opposite ways. One calls it conforming. The other calls it a nonconformity. The lead auditor is about to put the nonconformity in the daily note to the auditee so the team can move on. What should happen first?",
    "options": [
      "Issue the nonconformity now and take the stricter view. A split inside the team is resolved by recording the harsher classification so the daily note can go out and the schedule can move on.",
      "Drop the item from the audit. If two auditors disagree, the evidence is automatically out of scope, and the daily meeting exists only to keep the remaining hours on the original plan.",
      "Ask the auditee to pick the classification. The auditee breaks ties inside the audit team, and the lead auditor puts that choice in the daily note without gathering further evidence.",
      "Gather more information before classifying the record. Contradictory evidence is not ready for a conclusion, and the daily meeting is where the team finds that conflict and redirects the remaining schedule."
    ],
    "answer": 3,
    "why": "The lead auditor brings the team together at least once a day. Members share what they have gathered, propose conclusions, and identify possible problems. If the information contradicts itself, or the team cannot agree on how to classify an observation, the team has to gather more information before it classifies the item. The same meeting decides where the remaining time should go, so a minor dispute does not eat the schedule. Between meetings, an auditor who is unsure calls the lead auditor rather than guessing. ISO 19011 also tells the team to exchange information, judge progress, and reassign work when needed. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 91–92.</span>"
  },
  {
    "qid": "cqa:set-1:b04-02",
    "set": 1,
    "sub": "cqa-onsite-auditor",
    "bok": "II.B.1",
    "cognitive": "Evaluate",
    "stem": "On day two the team sees a guard missing from a press. The condition can injure an operator and was not on the audit plan. The closing meeting is tomorrow afternoon. The lead auditor intends to hold the item until then so the closing meeting has something serious to present. What is required?",
    "options": [
      "Hold the missing guard for the closing meeting tomorrow. New issues are presented only then, so the auditee is not disturbed during the audit and the agenda has something serious to present.",
      "Ignore the guard because it was not on the audit plan. A condition outside the plan cannot be mentioned to the auditee or the client, even when it can injure an operator.",
      "Report the missing guard without delay to the auditee and, as appropriate, to the client. Evidence of an immediate and significant safety risk does not wait for the closing meeting.",
      "Write the guard into the final report only, with no notice to the auditee. Keeping the message inside the team preserves control, and a safety risk can wait until the report is approved."
    ],
    "answer": 2,
    "why": "During the audit the lead auditor periodically tells the auditee and, as appropriate, the client how the audit is going and what the concerns are. Evidence of an immediate and significant risk, and the handbook's examples are safety, environmental, and quality, is reported without delay to the auditee and, as appropriate, to the client. A concern outside the scope is noted and given to the lead auditor, who may pass it to the client and the auditee. Waiting for the closing meeting so the agenda looks stronger delays a risk the handbook says not to delay. Daily contact has a second purpose as well: the auditee can confirm or dispute a problem before the closing meeting, which makes a refusal to acknowledge the results less likely. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 93.</span>"
  },
  {
    "qid": "cqa:set-1:b04-03",
    "set": 1,
    "sub": "cqa-onsite-auditee",
    "bok": "II.B.2",
    "cognitive": "Analyze",
    "stem": "Document control is on the plan for 4 p.m. The only document-control specialist leaves at 3 p.m. The escort says the auditor will have to come back another week because the plan cannot change. What should the auditee do?",
    "options": [
      "Refuse any change after the opening meeting ends. The auditee may not raise a logistics conflict once the plan is issued, even when the only specialist will have left before the scheduled interview.",
      "Send a different employee who does not know document control and tell that person to answer every question. Availability of some employee satisfies the auditee's duty to provide the right people.",
      "Cancel the whole audit. A conflict between the plan and the specialist's working hours is a refusal of access, and the auditee is not allowed to ask that the interview be moved earlier in the day.",
      "Tell the auditor now and ask to move the document-control interview earlier. The auditee's job is to make the right people available and to say when the plan will not work."
    ],
    "answer": 3,
    "why": "The auditee provides safe access to people, the workplace, and information, plus an escort and a point of contact. Subject experts should be where they are needed at least ten minutes before their time. If the plan puts an interview after the person has gone home, the auditee tells the auditor and asks to move it. That request is reasonable. If a record is slow to find, the auditee can ask whether the auditor wants to look at something else while it is located. Hiding the conflict until 4 p.m., or substituting someone who cannot speak for the process, fails the auditee's side of audit management. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 94–95.</span>"
  },
  {
    "qid": "cqa:set-1:b04-04",
    "set": 1,
    "sub": "cqa-onsite-auditee",
    "bok": "II.B.2",
    "cognitive": "Analyze",
    "stem": "The department manager skips the opening meeting and tells the escort to challenge every finding at the closing meeting without having heard the evidence. Operators have been told to answer only 'yes' or 'no' and not to explain the work. Which auditee duty is being missed?",
    "options": [
      "Treat unlocked doors as the auditee's only duty. Attendance at meetings, honesty with the team, and the way operators explain the work are the auditor's problem, so coaching yes-or-no answers does not breach access.",
      "Put management in the opening meeting and the closing meeting. The auditee should hear the findings, ask clarifying questions, and stay open, and coaching people to withhold the work defeats the access that was given.",
      "Have the escort rewrite every finding before the manager sees the evidence. Filtering what the team gathered is the purpose of an escort, and management need not attend the opening meeting or the closing meeting.",
      "Keep the operators silent and accept evidence only from managers. People who do the work are not a source of audit evidence, and clarifying questions from the auditee at the closing meeting are out of bounds."
    ],
    "answer": 1,
    "why": "The auditee keeps management engaged at the opening meeting, during the audit, and at the closing meeting. Findings are heard, and clarifying questions are fair. The auditee stays open and honest, tells employees the purpose and scope beforehand, and prepares them to deal with the auditor if they are interviewed. Access is to the people and the information needed to answer the questions, not a door that opens onto silence. The escort guides the team. The escort does not filter the evidence before management will hear it. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 94–95.</span>"
  },
  {
    "qid": "cqa:set-1:b04-05",
    "set": 1,
    "sub": "cqa-opening",
    "bok": "II.B.3",
    "cognitive": "Apply",
    "stem": "The audit is remote. The lead auditor says an opening meeting is only for a visit to the site, so the team will start interviews as soon as the video call connects. What is wrong?",
    "options": [
      "Start the interviews as soon as the video call connects. A remote audit replaces the opening meeting with the first interview, and agreement to the plan can be assumed from the connection.",
      "Save the opening meeting until the end of the audit, after the evidence is already known. The entrance conference and the preaudit conference are other names for the closing meeting, not for the start of data gathering.",
      "Hold an opening meeting on this remote audit as well as on a site visit. It confirms that everyone agrees to the plan, introduces the team, and checks that the planned activities can actually be performed.",
      "Let the auditee run the opening meeting and cancel it without telling the lead auditor. The auditee owns that conference on both a remote audit and a visit to the site."
    ],
    "answer": 2,
    "why": "Soon after the team arrives, or at the start of a remote audit, the team and the auditee hold an opening meeting. It is also called a preaudit conference or an entrance meeting, and it starts the data-gathering phase. ISO 19011 gives it three purposes: confirm that all parties agree to the audit plan, introduce the audit team, and make sure the planned activities can be performed. Skipping it on a video audit leaves scope, method, and logistics unconfirmed. The auditee does not own the meeting, and it is not saved for the end. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 95.</span>"
  },
  {
    "qid": "cqa:set-1:b04-06",
    "set": 1,
    "sub": "cqa-opening",
    "bok": "II.B.3",
    "cognitive": "Apply",
    "stem": "The opening meeting introduces the team and confirms the scope. The lead auditor does not say how nonconformities will be graded, does not mention sampling, and does not confirm the safety rules or the time of the closing meeting. The auditee is a first-party department worried that findings will be used in job ratings. What still belongs in that meeting?",
    "options": [
      "Stop once the scope is confirmed and the team is introduced. Those two items are the whole opening agenda, and a first-party worry that findings will affect job ratings is handled outside the meeting rather than in it.",
      "Also cover how results will be classified, the use of sample evidence, and the logistics, safety rules, security, and closing time. On this first-party audit, state that systems and processes are audited, not individual employees.",
      "Promise that no finding will be written if the department objects. That promise is how first-party anxiety about job ratings is removed, and sampling, safety, and the closing time need not be mentioned.",
      "Present and rank the final nonconformity list in this meeting. Findings belong at the opening rather than later, and safety, security, and the closing time can be left unspoken until the team is ready to leave."
    ],
    "answer": 1,
    "why": "The opening meeting reviews purpose and scope, restates the criteria, and describes the methods, including evidence taken from samples. It tells the auditee how results will be reported and how they will be classified or ranked. It confirms hours, escorts, facilities, the closing meeting, safety and security, and the confidentiality agreement. It also confirms that the auditee will hear about progress. On a first-party audit the particular worry is that results will be read as a judgment of someone's job. The useful answer is that the audit is of the system and the process, not of the individual. Findings are not presented at the opening, and anxiety is not removed by promising that objections will erase them. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 94–95.</span>"
  },
  {
    "qid": "cqa:set-1:b04-07",
    "set": 1,
    "sub": "cqa-data-collection",
    "bok": "II.B.4",
    "cognitive": "Evaluate",
    "stem": "An operator shows a completed inspection sheet and says the work followed the procedure. The auditor has the procedure, which is a blank instruction, and the filled sheet. A colleague calls both of them records. What is the distinction, and why does it matter?",
    "options": [
      "Call both the blank procedure and the filled sheet records. Every piece of paper in the work area answers what was done, so there is no separate document that states what should be done and no reason to keep the two apart.",
      "Call the procedure a record and the filled inspection sheet a document. The sheet is newer, so it states what should be done, while the procedure states what was already done on the job.",
      "Call the procedure a document because it says what should be done, and call the filled sheet a record because it says what was done. Records are the evidence that actions required by documents actually happened.",
      "Rely only on the blank instruction as evidence. Completed sheets are opinions, and a record is not the kind of document that can show whether required actions actually happened."
    ],
    "answer": 2,
    "why": "A document specifies what should be done. Work instructions, procedures, drawings, and blank forms are documents. A record specifies what has been done. Minutes, inspection results, completed check sheets, and test data are records. A record is the special kind of document that states results. The auditor examines documents to see whether they meet the higher-level requirements, and examines records to see whether the product or the controls were actually implemented. Calling both of them records hides which question the piece of paper can answer. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 101.</span>"
  },
  {
    "qid": "cqa:set-1:b04-08",
    "set": 1,
    "sub": "cqa-data-collection",
    "bok": "II.B.4",
    "cognitive": "Evaluate",
    "stem": "A test record was changed with correction fluid. The original number cannot be read. The technician says the new number is right and that fluid is faster than a single-line cross-out. In this laboratory, ink is allowed. What should the auditor conclude?",
    "options": [
      "Accept the correction because speed is the requirement. Correction fluid is preferable to a single-line cross-out, and a dated signature is unnecessary when the technician says the new number is right.",
      "Destroy the whole record and exclude it from the evidence. Any correction makes the history unusable, even a dated and initialed single-line cross-out that leaves the original number readable beside the new value.",
      "Reject the correction. A written change should be dated and signed or initialed, the original entry should stay readable, and correction fluid is forbidden in many industries even when ink is allowed.",
      "Accept the change if the technician initials the fluid. Covering the original number is allowed once the new value is initialed, because the reason for the change can still be judged from the initials alone."
    ],
    "answer": 2,
    "why": "Documents and records are checked to see that they match practice: secure, permanent, current, legible, and accurate. Written records are permanent, normally in ink, unless the environment makes ink unsafe. A change is dated and signed or initialed, and the original information stays intact so the new value and the reason can be judged. Erasures and correction fluid are strictly forbidden in many industries. Painting out the first number leaves a record that cannot be assessed. Initialing the fluid does not restore the original entry. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 102.</span>"
  },
  {
    "qid": "cqa:set-1:b04-09",
    "set": 1,
    "sub": "cqa-data-collection",
    "bok": "II.B.4",
    "cognitive": "Evaluate",
    "stem": "The auditor reads the procedure, then watches the job. The operator cannot perform the job as the procedure describes it. What are the two explanations the auditor has to sort out before writing the finding?",
    "options": [
      "Write a training finding only. If the person cannot follow the procedure, the person is incompetent, and there is no remaining question about whether the procedure itself is wrong or out of date.",
      "Write nothing until ten further operators fail in the same way. A single observation is never evidence that the job and the procedure do not match, so neither an inaccurate document nor poor performance can be reported yet.",
      "Revise the procedure on the spot and close the observation. The auditor removes the mismatch by editing the document, so there is no need to decide which of the two explanations is true.",
      "Sort out two explanations before writing the finding. Either the procedure is wrong or out of date, or the process is being performed incorrectly, and one failed attempt does not by itself name which cause it is."
    ],
    "answer": 3,
    "why": "Tracing is one way to collect facts. The auditor learns the procedure and then watches someone try to do it. If it cannot be done, two possibilities remain. The procedure may be inaccurate, because the author did not understand the process or because the process changed and the document did not. Or the process is being performed badly, which may mean the employees were not trained or cannot do the work. The finding depends on which of those is true. One failed attempt is still evidence that something does not match. It does not, by itself, name the cause, and the auditor does not rewrite the procedure in order to close the item. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 102.</span>"
  },
  {
    "qid": "cqa:set-1:b04-10",
    "set": 1,
    "sub": "cqa-evidence",
    "bok": "II.B.5",
    "cognitive": "Analyze",
    "stem": "To prove that every service center knows the quality policy, an auditor proposes shutting the plant for a day and flying to all 100 centers. The policy is also posted, and a sample of people on this site can be asked. What limits the pursuit?",
    "options": [
      "Fly to all one hundred centers and shut the plant if that is what the data require. Evidence supports a finding only when the pursuit is exhaustive, and the cost of the trip has no place in deciding whether to go.",
      "Reject the posted policy as hearsay and require a visit to every center. Only that trip is objective evidence that people know the policy, whatever the travel costs the client will bear.",
      "Ignore cost because the client pays for the travel. The auditor should still obtain exhaustive evidence, and a sample of people on this site cannot support a conclusion about the policy.",
      "Limit the pursuit to what is useful for the cost. Shutting the plant, or visiting every center to confirm a posted policy, may not be justified, while the evidence still has to be sufficient, complete, and relevant."
    ],
    "answer": 3,
    "why": "Evidence has to be sufficient, complete, and relevant before it can support a finding or a recommendation. There also has to be a rational relationship between what the evidence costs and how useful it is. The handbook's examples of a cost that may not be justified are shutting down a plant to obtain data, and traveling to 100 service centers to verify that employees know the quality policy. A sample, plus the posting, can be enough. Refusing to consider cost is not higher-quality auditing. Calling a controlled posting hearsay goes the other way and throws out evidence the auditor can see. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 107.</span>"
  },
  {
    "qid": "cqa:set-1:b04-11",
    "set": 1,
    "sub": "cqa-evidence",
    "bok": "II.B.5",
    "cognitive": "Analyze",
    "stem": "The sample shows three nonconforming records out of thirty. The lead auditor's draft says the whole system is nonconforming and that the conclusion is certain. What is overstated?",
    "options": [
      "Let the draft stand as written. A sample result is itself a fact, so the conclusion that the whole system is nonconforming is certain, and the report should not describe that conclusion as uncertain or limited by the sample.",
      "Forbid any conclusion that rests on a sample. Only a complete examination of every record can support a sentence in the report, so these thirty records cannot be cited as evidence at all.",
      "Report the three nonconforming records as a positive practice. The other twenty-seven records conformed, so they outweigh the defects and the conclusion about the system should be both favorable and certain.",
      "Keep the three defects as evidence, but do not call the conclusion about the whole system certain. Sampled evidence can be factual while the conclusion stays uncertain, and it is only as strong as the sample's representativeness."
    ],
    "answer": 3,
    "why": "ISO 19011 uses the term audit evidence. Whatever it is called, it should be objective, free from bias, recorded, and verifiable. It can be checked by a record, a verbal affirmation, a repeat observation, a measurement, or a simulation. Because the evidence comes from a sample, the results can be factual and the conclusion can still carry uncertainty. The conclusion is only as strong as the degree to which the sample represents the performance of the area. Treating three defects in thirty as proof about the entire system, and calling that proof certain, skips that limit. The defects are still evidence. They are not a positive practice. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 107.</span>"
  },
  {
    "qid": "cqa:set-1:b04-12",
    "set": 1,
    "sub": "cqa-evidence-org",
    "bok": "II.B.6",
    "cognitive": "Evaluate",
    "stem": "The team has one observation of a missed torque on a safety-critical joint, and six observations of a misspelled word in a work instruction for a machine shop that does not publish documents. The lead auditor wants to treat them the same because both happened. How should they be classified?",
    "options": [
      "Grade both as major nonconformities. The number of times something happens is the only measure of importance, so one torque miss and six spelling errors carry the same weight in the report.",
      "Separate them by risk, not by raw count. The torque miss can be reported after one occurrence because the risk is high, while a systemic spelling error in a shop that does not publish can still be low risk.",
      "Grade both observations as opportunities for improvement and give them equal weight. A safety-critical joint is not an audit criterion, and six spelling errors are too small to classify by the risk they create.",
      "Drop the single missed torque because it happened only once, and write the repeated spelling error as the major finding because it happened six times. Frequency outranks severity, so the safety-critical joint does not change how the two observations are classified."
    ],
    "answer": 1,
    "why": "Before the closing meeting the auditor classifies observations by risk, not by raw count. A critical step can be an isolated event and still be reportable after one occurrence. A low-risk item may need several occurrences before it is significant. A chronic or systemic observation raises the risk because it will keep happening until the system changes. A misspelled word can be systemic, likely to appear in other documents, and still be low risk if the business is not publishing. The cost of repeated proofreading is not justified. In a publishing business that same error would be weighed differently. Treating the torque miss and the spelling error as equal ignores severity. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 108–109.</span>"
  },
  {
    "qid": "cqa:set-1:b04-13",
    "set": 1,
    "sub": "cqa-evidence-org",
    "bok": "II.B.6",
    "cognitive": "Evaluate",
    "stem": "The auditor sees a highly effective setup method and also a condition that breaks no requirement but, from experience, could become a problem. The auditee asks that both be left out of a third-party report because only broken requirements are allowed on paper. What can be reported, and what must the auditee do about it?",
    "options": [
      "Say nothing except nonconformities, and leave both items out of the report. Positive practice and concern are forbidden categories, so only a broken requirement may be spoken or written.",
      "Write both as major nonconformities or treat the report as incomplete. A third-party certification audit may record only broken requirements, and an unusually effective setup is a nonconformity because it differs from the other lines.",
      "Report the effective setup as a nonconformity because it differs from the other lines, and omit the condition that breaks no requirement because an improvement point would be a binding order.",
      "Report both observations. The effective method may be a positive practice, and the unbroken condition may be a concern or improvement point. Certification audits normally require action on nonconformities, not on improvement points."
    ],
    "answer": 3,
    "why": "Observations are not only nonconformities. A highly effective process may be reported as a positive practice. A concern, an issue, or a continuous-improvement note is not a violation of a requirement. It is the auditor's judgment that the condition is worth attention and might become a problem. The classification and the expected follow-up should be clear. For third-party certification audits, organizations are normally required to act on nonconformities and are not normally required to act on improvement points. Leaving both out because they are not broken requirements throws away information the report can carry. Promoting either one to a major nonconformity invents a requirement that was not broken. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 109.</span>"
  },
  {
    "qid": "cqa:set-1:b04-14",
    "set": 1,
    "sub": "cqa-evidence-org",
    "bok": "II.B.6",
    "cognitive": "Evaluate",
    "stem": "The same clause has failed in receiving, in the lab, and in shipping. Each failure looks small by itself. The lead auditor plans three separate minor findings with no link among them. What is the stronger classification step?",
    "options": [
      "Leave three separate minor findings. Grouping is allowed only after the auditee agrees that the cause is the same, and a small failure in one area cannot suggest a trend across the plant.",
      "Drop all three observations until every remaining instance in the plant has been found. Calling a condition systemic is allowed only after a one-hundred-percent search, so a repeated failure across three areas is not yet enough to write.",
      "Report one minor finding and ignore the other two areas so the report stays short. Once a clause is cited, further failures of that clause in other areas stay outside the finding.",
      "Group the three failures as one finding. The same condition in receiving, the lab, and shipping can be systemic, it will continue until the system changes, and the audit is not a hunt for every instance."
    ],
    "answer": 3,
    "why": "The auditor groups like observations under the same finding or nonconformity. An isolated low-risk event may not be significant. A systemic observation is tied to the system and will repeat until the system changes. The audit is not a 100 percent inspection. It can show a trend that suggests a systemic problem, and the auditee is expected to look for the same condition elsewhere. Three small failures of the same clause, in three areas, are the pattern that grouping is for. Writing them as unrelated minors hides the pattern. Refusing to write anything until every instance is found treats the audit as inspection. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 108–109 and 134.</span>"
  },
  {
    "qid": "cqa:set-1:b04-15",
    "set": 1,
    "sub": "cqa-exit",
    "bok": "II.B.7",
    "cognitive": "Apply",
    "stem": "At the closing meeting the lead auditor hands the auditee a findings list with no 'draft' or 'preliminary' marking and tells the department to implement the auditor's preferred corrective steps before the next shift. The client has not approved the report. What is wrong?",
    "options": [
      "Issue the list as binding corrective-action orders. The closing meeting is where the lead auditor directs the steps to be finished before the next shift, and client approval is not required before those orders are given.",
      "Let the list be final, but allow only the auditee to speak. The lead auditor does not present results at the closing meeting, and draft markings are used only on a system audit.",
      "Mark the findings draft or preliminary. The client has not approved them and the language may still be edited, and the auditor should not prescribe the corrective steps the organization must take.",
      "Cancel the closing meeting because this is a process audit. Only a system audit has a closing meeting, so findings and corrective steps wait for the approved final report."
    ],
    "answer": 2,
    "why": "The closing meeting ends the performance stage. The lead auditor presents a draft or preliminary report so the results are understood. Written findings should be marked draft or preliminary because the client has not approved them and they may still be edited. Opportunities for improvement are normally not binding, though ignoring them can produce a later nonconformity. Recommending an improvement is not the same as telling the organization which corrective steps to take. Auditors should not prescribe those steps. System, process, and product audits all have a closing meeting. A process-audit meeting may be short, and the process owners should be there because they control the resources. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 112–113.</span>"
  },
  {
    "qid": "cqa:set-1:b04-16",
    "set": 1,
    "sub": "cqa-exit",
    "bok": "II.B.7",
    "cognitive": "Apply",
    "stem": "The closing meeting has no agenda, no attendance list, and no minutes. The lead auditor will not let the auditee point out that one cited record was for a different part number. The lead auditor says speed matters more than the record of the meeting. What has to be kept, and what is the auditee allowed to do?",
    "options": [
      "Keep an agenda, an attendance record, and minutes of what was agreed. Let the auditee clarify a misunderstanding that could change or remove a nonconformity, while keeping the discussion on the findings rather than on the audit method.",
      "Keep neither an agenda nor an attendance list nor minutes, and do not let the auditee speak once the results are being read. Speed outweighs the meeting record, so a cited record for the wrong part number cannot be corrected in the room.",
      "Let the auditee rewrite the nonconformities during the meeting, and treat minutes as optional if everyone remembers the discussion. An attendance record is needed only when the meeting is held remotely.",
      "Have only the client attend, and send the minutes to the auditee a month later. The auditee may not point out a wrong part number while the lead auditor is presenting the results."
    ],
    "answer": 0,
    "why": "Three housekeeping items belong with the closing meeting: an agenda, a record of attendance, and minutes of the discussions and agreements, including any agreed change to the report. A remote meeting can be recorded, or people can enter their names. The lead auditor conducts the meeting, thanks the auditee, presents the summary, and has the results read. Individual auditors may clarify the areas they audited. The auditee is allowed to clarify a misunderstanding that may change or remove a nonconformity. The discussion is about the findings, not a debate over the audit method. Refusing to hear that the cited record is the wrong part number skips that step. The minutes and the attendance record are still required. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 114–115.</span>"
  },
  {
    "qid": "cqa:set-1:b04-17",
    "set": 1,
    "sub": "cqa-report-dev",
    "bok": "II.C.1",
    "cognitive": "Create",
    "stem": "The closing meeting is over. The lead auditor wants the final report to name the operator who made the error, skip the client's review, and go out six weeks later because the team is busy. There were no deficiencies. The lead auditor asks whether a report is even required. What does the handbook require?",
    "options": [
      "Issue the report even with no deficiencies so results can be compared. The lead auditor prepares, signs, and dates it; the auditing organization's management and the client approve it before release; do not name the operator unless essential; and do not delay it.",
      "Omit the report because there were no deficiencies. When a report is written, name the operator, skip the client's review, and send it six weeks later because the team is busy with other work.",
      "Name every operator who was interviewed, and hold the report for several weeks. Urgency produces weak corrective action, a clean audit does not need a written report for later comparison, and neither management nor the client has to approve it before the auditee sees it.",
      "Have the auditee write and sign the final report. The lead auditor only speaks at the closing meeting, and a written report is optional when the team found no deficiencies to communicate."
    ],
    "answer": 0,
    "why": "After the closing meeting the lead auditor communicates the results in a written report. The auditee should not be surprised by anything in it. The lead auditor prepares, signs, and dates the report. Management of the auditing organization and the client review and approve it before it is sent to the auditee. A long gap between the audit and the report reduces urgency, increases misunderstanding, and makes the program look inefficient. A report is sent even when there are no deficiencies, because organizations compare years and look for trends. The report refers to positions, titles, or systems, not to named employees, unless the person's special knowledge makes the name necessary for the corrective action. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 119–120.</span>"
  },
  {
    "qid": "cqa:set-1:b04-18",
    "set": 1,
    "sub": "cqa-report-dev",
    "bok": "II.C.1",
    "cognitive": "Create",
    "stem": "The draft report explains a supplier's proprietary mixing method in detail, has no report number, and does not say that the conclusion is based on a sample. Three agencies want three different versions. What has to change?",
    "options": [
      "Leave the detailed mixing method in the report to prove the team was thorough, treat a unique title or number as optional, and refuse separate versions. One report must serve every agency, and a sample limitation is unnecessary once the method is fully described.",
      "Publish the mixing method because a third-party report is a public record. Drop the sample limitation, and use the same public text for every agency that asks for a copy of the results.",
      "Take the proprietary mixing detail out of the report, protect or destroy confidential notes, give the report a unique identifier, and state that the results are limited by the sample. Separate reports for different clients are allowed.",
      "Omit the purpose and the scope, because those belong only in the audit plan. Keep the proprietary method, skip the identifier, and do not say the conclusion rests on a sample of the process."
    ],
    "answer": 2,
    "why": "The introduction states the purpose and scope, names the auditee, the client, and the auditing organization, names the team and the lead, gives dates and locations, names the standards, and qualifies the results because of the sample. It also addresses confidentiality and distribution. A report normally identifies the nonconformity in the system and does not carry detailed technical information about a proprietary process. Confidential notes are protected or destroyed. A blank checklist may stay in the file. Each report needs a unique title, number, or both so it can be retrieved. Where clients need different slices of the same audit, separate reports can be written. That increases the reporting time, and it is still legitimate. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 120–121.</span>"
  },
  {
    "qid": "cqa:set-1:b04-19",
    "set": 1,
    "sub": "cqa-report-effective",
    "bok": "II.C.2",
    "cognitive": "Create",
    "stem": "The draft says 'the process failed' and stops after the first defective unit. It uses an internal acronym the plant manager does not know, and it does not name the requirement that was missed. The author says a short accusation is an effective report. What would make it effective?",
    "options": [
      "Leave the draft as a short accusation. Short is the same as concise, the first defect is the whole finding, and an unexplained internal acronym is acceptable when it saves the reader space.",
      "Add pages of background so the report looks complete, keep the unexplained internal acronym, and still stop after the first defective unit. Padding is what makes a report complete, and naming the missed requirement would turn the narrative into a legal brief the manager need not read.",
      "Remove the requirement reference and keep the single-unit accusation. Naming a clause makes the report a legal brief, and the plant manager is expected to know every internal acronym without explanation.",
      "Use words the reader knows, name the requirement that was not met, and do not stop at the first defect. One defect does not show whether the condition is isolated or systemic, and the report should state the right fact rather than a symptom."
    ],
    "answer": 3,
    "why": "A badly written report will not produce improvement. Useful attributes include the six Cs: complete, correct, concise, clear, categorized, and confirmable. The handbook's practical rules are to use the reader's language, avoid unexplained acronyms, skip the padding, keep a standard format, and point at the requirement or objective that was not fulfilled. Some facts are only symptoms. Reporting the wrong fact sends the auditee to repair a problem that is not the finding. Stopping at the first defect makes it hard to tell an isolated event from a systemic one. Concise does not mean a bare accusation with no requirement and no sense of how far the condition goes. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 128–129.</span>"
  },
  {
    "qid": "cqa:set-1:b04-20",
    "set": 1,
    "sub": "cqa-report-effective",
    "bok": "II.C.2",
    "cognitive": "Create",
    "stem": "A first-party audit found a recurring escape of nonconforming product. The executive summary describes the audit hours and the lunch arrangements, and it never says what the escape does to cost or to the plant's objectives. What should that summary do?",
    "options": [
      "Leave the summary as a note of audit hours and lunch. An executive summary is a logistics record, and the escape's effect on cost and on the plant's objectives belongs in the corrective-action plan rather than here.",
      "Tie the results to the reason for this first-party audit, which can be risk or financial performance, and say how the findings and the positive practices affect the product or the service.",
      "Promise the audited plant a larger share of future business. That commercial link is the right first-party summary, and it replaces any statement about risk, cost, or how the escape affects the product.",
      "Announce that a certificate or a license was renewed. Every executive summary is a certification statement, so the escape's effect on cost and on the plant's objectives need not be stated."
    ],
    "answer": 1,
    "why": "A cover letter or executive summary makes the report more useful when it ties the organization's objectives to the results. A first-party summary can tie the results to risk or to financial performance. A second-party summary may tie them to the supplier's share of current and future business. A third-party summary may say that a certificate or a license was renewed. Those links are not interchangeable. Management uses the audit as an oversight tool, so the summary should connect the findings and the positive practices to the product, the service, or the other deliverable. Hours and lunch do not do that. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 128–129.</span>"
  },
  {
    "qid": "cqa:set-1:b04-21",
    "set": 1,
    "sub": "cqa-report-final",
    "bok": "II.C.3",
    "cognitive": "Apply",
    "stem": "The report is approved. The file clerk wants to throw away the opening-meeting attendance, the completed checklists, and the auditee's response, and keep only the pretty signature page. The report also never says that one planned process was not audited, and it never mentions that the auditee still disagrees with one finding. What belongs in the report and in the file?",
    "options": [
      "Keep only the signature page and omit both the skipped process and the disagreement. A positive file is the record that matters, and an objection is deleted so the finding does not remain in the report.",
      "Destroy the completed checklists in the hour the closing meeting ends, because they are personal notes. Also delete the finding once the auditee objects, and leave the skipped process out so the approved report stays silent on both points.",
      "Remove the finding because the auditee disagrees, and discard the attendance records. An objection replaces the finding, while the plan and the checklists may be kept only if they support the signature page.",
      "State in the report which in-scope area was not covered and record the unresolved disagreement. Keep in the file the report, the corrective-action records, the plan, the attendance and minutes, and the completed checklists."
    ],
    "answer": 3,
    "why": "ISO 19011 says the report can include the obstacles and the uncertainty that weaken the conclusions, confirmation that the objectives were met inside the scope, any area inside the scope that was not covered, unresolved differences between the team and the auditee, opportunities for improvement, agreed follow-up, a confidentiality statement, and the distribution list. The audit file holds the report, corrective-action requests and responses, completion records, the plan, the notification, opening and closing attendance and minutes, and the completed checklists. Keeping only the signature page destroys the record that shows what was done and what was agreed. An objection does not delete a finding. An unresolved objection is reported. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 130–131.</span>"
  },
  {
    "qid": "cqa:set-1:b04-22",
    "set": 1,
    "sub": "cqa-capa-elements",
    "bok": "II.D.1",
    "cognitive": "Evaluate",
    "stem": "The auditee asks the auditor to name the corrective action and to help install it. The auditor knows the process well and can see a fix. The auditee says that help is part of a useful audit. What is the limit?",
    "options": [
      "Name the corrective action and help install it. The auditor who found the problem owns the solution, and knowing the process well removes any limit on recommending or installing the fix.",
      "Require this auditor to recommend the corrective action and help install it, especially on a third-party audit. Refusing that help is itself a nonconformity, and putting the solution in place protects objectivity on later audits of the same area.",
      "Limit the response to containment and treat root cause as optional. The auditor should install a temporary hold, because corrective action does not have to remove the cause so the nonconformity does not recur.",
      "Decline to name or install the fix. The auditee owns the action and informs the client. Putting a solution forward takes ownership of the problem, and helping change the system compromises later audits of that area."
    ],
    "answer": 3,
    "why": "The auditee takes the corrective action and keeps the client informed. An auditee will often ask the auditor for the answer. The auditor may not have the technical knowledge, and an auditor who puts a solution forward owns the problem. The auditee has to own the solution. An auditor who helps implement or modify the system gives up objectivity on later audits of that area. For those reasons many internal auditors, and most third-party auditors, are prohibited from recommending corrective action. Knowing the process does not remove that limit. Corrective action itself is action to remove the cause of an existing nonconformity so it does not recur. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 133.</span>"
  },
  {
    "qid": "cqa:set-1:b04-23",
    "set": 1,
    "sub": "cqa-capa-elements",
    "bok": "II.D.1",
    "cognitive": "Evaluate",
    "stem": "The auditee's plan says 'retrain the operator' and gives no name, no date, and no cause. The same defect has appeared in two other departments. The auditee says retraining is the corrective action because the operator was the person at the bench. What is missing?",
    "options": [
      "Require a plan that identifies the problem, separates containment from the long-term action, names the underlying cause, names who will act, and gives dates. Retraining one operator ignores the same defect in two other departments.",
      "Accept the plan as complete. Naming the operator who was at the bench and sending that person to class is corrective action, and the same defect in the other departments is outside this finding.",
      "Accept a promise to retrain everyone in the company, even with no date and no cause. Breadth of training replaces a named owner, a due date, and any statement of the underlying cause.",
      "Have the auditor write the root-cause sentence, and accept a training slide as the whole plan. The auditee does not have to name a cause, an owner, or a date, and the same defect in other departments is pursued only by a one-hundred-percent inspection."
    ],
    "answer": 0,
    "why": "After the report, the auditee prepares a corrective action plan. The first step is to identify the problem and the root cause. Immediate action can contain the damage and is not the permanent fix. Long-term action addresses the underlying cause so the problem does not return. The plan should say what will be done, who is responsible, and when. It should also consider whether the problem will show up elsewhere. The audit did not find every instance. A trend can still say the condition is systemic. 'Retrain the operator,' with no owner, no date, and no cause, misses those parts, and it ignores the same defect in two other departments. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 134–135.</span>"
  },
  {
    "qid": "cqa:set-1:b04-24",
    "set": 1,
    "sub": "cqa-capa-plan",
    "bok": "II.D.2",
    "cognitive": "Evaluate",
    "stem": "The proposed plan says the cause was human error and the action is a verbal warning. It does not say why the error happened. The reviewer is not a specialist in the process. The auditee wants the plan accepted today so the finding can be closed. What should the reviewer do?",
    "options": [
      "Reject human error as the cause until the plan says why. The reason may be complexity, poor documentation, inadequate training, or weak supervision. A specialist may assess the plan, and accepting a plan does not close the finding.",
      "Accept the verbal warning today and close the finding with it. Human error is already a root cause, a warning is enough to prevent recurrence, and a reviewer who lacks process expertise must not bring in a specialist or ask why the error happened.",
      "Reject every plan the auditee writes, regardless of its cause analysis. Only the auditor may propose the actions, so this human-error statement cannot be clarified, supplemented by a specialist, or accepted on its merits.",
      "Accept the warning because the reviewer must not use a specialist. Outside expertise creates a conflict of interest, and human error needs no further question before the finding is closed today."
    ],
    "answer": 0,
    "why": "The client or the audit program manager reviews the response, or assigns the review to the lead auditor or another team member. The reviewer accepts the plan, rejects it, or asks for clarification. A feasible plan that treats the underlying cause, not the symptom, can be accepted. Human error is a temptation. The reviewer asks why it is human error. The reason may be complexity, poor documentation, inadequate training, or weak supervision. If the reviewer does not have the technical knowledge, a specialist may assess the plan. A verbal warning that never asks why does not show a root-cause analysis, and accepting it today does not close the finding. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 135–136.</span>"
  },
  {
    "qid": "cqa:set-1:b04-25",
    "set": 1,
    "sub": "cqa-capa-plan",
    "bok": "II.D.2",
    "cognitive": "Evaluate",
    "stem": "The auditee sorts the product, which keeps bad units from shipping, and calls that the permanent corrective action. The auditee also says this action is preventive because it prevents the customer from seeing the defect. A fix that would remove the cause will take six weeks, and the auditee asks for that time. What is the right reading?",
    "options": [
      "Accept the sorting as both the corrective action and the preventive action. No extension is allowed, because every action, including removal of the cause, must finish inside the original week.",
      "Grant the six weeks immediately, with no review, no status, and no evidence. Any date the auditee names is a reasonable extension, and the sorting may be accepted as preventive action because it keeps the customer from receiving the defect.",
      "Call the sorting containment, not corrective action and not preventive action. Corrective action keeps this problem from recurring, preventive action aims at a problem that has not happened, and a reasonable extension has to go through a formal process.",
      "Forbid the sorting and stop the line until the six-week cause removal is installed. Containment is not an allowed bridge to a long-term fix, and a request for more time cannot be formally reviewed or approved."
    ],
    "answer": 2,
    "why": "Recall, replacement, or a stop on delivery does not prevent recurrence. It can keep the process going until a long-term solution exists. Sorting bad product is that kind of containment. The reviewer asks whether the plan is specific enough to make the change permanent and whether the action will create a new problem. Action taken so that this problem does not recur is corrective action. Preventive action is the discipline of keeping a potential problem from occurring at all. The two are not the same sentence. Some problems take longer. A reasonable extension is allowed, and extension requests, reviews, and approvals should be formal. An open-ended date with no review is not that process. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 135–136.</span>"
  },
  {
    "qid": "cqa:set-1:b05-01",
    "set": 1,
    "sub": "cqa-capa-verify",
    "bok": "II.D.3",
    "cognitive": "Evaluate",
    "stem": "The auditee shows a revised procedure and a class roster. The lead auditor is ready to call the corrective action effective because the paperwork matches the plan. What still has to be true?",
    "options": [
      "Accept the revised procedure and the class roster as full proof that the corrective action is effective, because paperwork that matches the written plan already shows both that the steps were done and that the desired result was reached.",
      "Keep the procedure and roster as evidence that a step was taken, then verify that the people did the planned work and know the change, and judge effectiveness only by whether the desired result was reached.",
      "Judge effectiveness by whether the revised procedure reads as a controlled document, and set the process result aside, because verification ends when the paperwork matches the plan and the outcome of the product or service is outside this review.",
      "Stop verification once the roster exists, and schedule any further look as a new audit, because a completed class list closes both implementation and effectiveness and a return visit would duplicate work already accepted."
    ],
    "answer": 1,
    "why": "Verification of completion asks whether people did what they said they would do and whether everyone involved was informed, by a discussion, a class, a memo, an e-mail, or another method. Records should show that the people who need to know are aware of the change. That is especially important for a new process, a process change, or a personnel change. Later, effectiveness is not proved by the fact that a change occurred. The reviewer compares the end result with the original conditions. Implementation means the actions were carried out. Effectiveness means the actions worked: the desired result was reached, and there is evidence the process can keep reaching it. A procedure and a roster can show that a step was taken. They do not, by themselves, show that the result changed. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 139–140.</span>"
  },
  {
    "qid": "cqa:set-1:b05-02",
    "set": 1,
    "sub": "cqa-capa-verify",
    "bok": "II.D.3",
    "cognitive": "Evaluate",
    "stem": "Six corrective actions are open. Verifying all six on this visit would consume the time planned for the current audit's objectives. The actions are not all equally urgent. One is critical. What should the lead auditor do?",
    "options": [
      "Drop the objectives of the current audit and verify all six actions before leaving, because a new audit is not permitted to look backward, unequal urgency does not justify selecting among the open actions, and the program manager does not need to be told.",
      "Close all six actions from the corrective-action log without examining evidence, because a recorded plan is verification, the current objectives take priority over any look at past findings, and unequal urgency is not a reason to select among them.",
      "Protect the current audit objectives and tell the program manager or the client, because verification can be combined with a later visit, done by another auditor, or done remotely, and a critical action need not wait for the next full audit.",
      "Hold every action, including the critical one, for the next full system audit, because remote verification is not an accepted method and findings must be closed together on the same day rather than one at a time."
    ],
    "answer": 2,
    "why": "Some clients accept a review of the response and its timeliness as the whole follow-up. In most cases the auditor is told to verify. That can mean going back to the area, watching the new process, checking the paperwork, and confirming training, or using performance records. Findings may close one at a time, and verification need not happen immediately. It can be combined with another visit, or another auditor can collect the evidence. A finding may be closed pending final verification. Because a separate follow-up trip is expensive, many organizations fold it into the next scheduled audit. The auditee can also send records so the auditor can judge implementation without another trip, and the auditor may still check later. If the pile of actions is too large or too complex for the time available, and verification would put the current objectives at risk, the lead auditor tells the program manager or the client. A critical action does not have to wait for the next scheduled audit. Remote techniques can check it sooner, and a later on-site visit can test whether the result lasted. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 138–139.</span>"
  },
  {
    "qid": "cqa:set-1:b05-03",
    "set": 1,
    "sub": "cqa-capa-ineffective",
    "bok": "II.D.4",
    "cognitive": "Create",
    "stem": "The claimed action was not implemented. The lead auditor's first move is to escalate to the plant manager and to treat the auditee as being at fault. The same process has failed this way several times. What is the better sequence?",
    "options": [
      "Escalate at once to the plant manager and treat the auditee as being at fault, because any missed implementation is enforcement work for the auditor and looking again would only delay a conclusion that is already clear.",
      "Delete the original finding and close the file, because a corrective action that was not implemented shows the first audit was wrong, and neither escalation nor a fresh look at the evidence is warranted.",
      "Issue a preventive-action request and close the original finding, because a corrective action that fails is automatically preventive action, and repeated misses are handled by relabeling the record rather than by examining the corrective-action process.",
      "Reexamine the facts before escalating, because the miss may be weak evidence, a judgment error, missing resources, or a business change, escalation is a documented last resort, and repeated failure points to the corrective-action process itself."
    ],
    "answer": 3,
    "why": "Each failure of implementation or effectiveness is judged on its own facts. The auditor should not start from the assumption that the auditee is at fault. There may have been too little time to verify the evidence, an error by the team that wrote the action, inadequate resources, or a business change the auditee does not control. Lack of management support is another possible reading. Escalation to the next level of management is a last resort. Jumping into the enforcer role too soon puts the auditor in a bad position, and the route upward should be formal and documented. If the action was carried out and still did not work, the auditor or the client recycles the finding or issues a new one that references the original, and the process starts again. That failure is a form of rework. If it happens often, the corrective-action process may be the weak point, including a failure to use real root-cause methods. On a third-party audit, and on some second-party audits, not implementing an action can lead to suspension, removal from the approved list, or loss of registration. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 141.</span>"
  },
  {
    "qid": "cqa:set-1:b05-04",
    "set": 1,
    "sub": "cqa-closure",
    "bok": "II.D.5",
    "cognitive": "Apply",
    "stem": "The action was verified today. The program procedure says every finding stays open for 30 days after verification so the file looks active. The client is the customer, not the plant. The auditor plans to phone the plant manager directly and skip the customer. What is wrong?",
    "options": [
      "Close the audit when the action is verified, because timely means the agreed date based on importance and resources, not a fixed thirty days, and notice to this auditee goes through the customer who is the client.",
      "Keep the finding open for thirty days after verification and call the plant manager directly, because a fixed thirty-day hold is what timely closure means and the auditor's first contact is always the plant rather than the customer.",
      "Leave this finding open until every other finding in the program is closed, because partial closure is not permitted and the customer, rather than the auditee, must wait for one combined notice covering the whole program.",
      "Send the closure notice only to the plant manager and bypass the customer, because the auditee who performed the work is the real client for closure and a written assessment of effectiveness is optional once verification is done."
    ],
    "answer": 0,
    "why": "Closure requires verification that the actions were implemented as planned. The auditor tells the auditee the audit is closed. Defined records are kept for the required periods. Written notice of closure, including an assessment of implementation and effectiveness, goes to the client and the auditee. When the client is not the auditee, the client is the usual link, so the auditor does not go around the client. An external contract may name the contact. Inside the company, the closeout follows the original distribution, and a summary of what is still open goes to upper management. Individual requests may be tracked and closed one at a time, with notice to the people who received the first report. The audit should be closed when the action is verified, not carried as a backlog. Timely does not mean a fixed 30 days. It means the date that was agreed, set from the importance of the action and the resources available. Some actions take minutes and some take months. A delay the auditee does not control can be accepted when the auditee has started and has recorded why. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 141–142.</span>"
  },
  {
    "qid": "cqa:set-1:b05-05",
    "set": 1,
    "sub": "cqa-characteristics",
    "bok": "III.A",
    "cognitive": "Apply",
    "stem": "An auditor can recite the audit technique and the clauses. On the visit the auditor cannot keep a working relationship while questioning someone's work, and cannot manage the clock or the other auditors. The program manager says technique is the whole of competence. What is missing?",
    "options": [
      "Treat technique as the only competence that matters, because education, experience, and personal traits are outside the auditor role, and a lead auditor is held to the same list as every other member of the team.",
      "Treat technique as incomplete, because competence also includes education, experience, communication, and personal traits, a lead auditor adds negotiation and time management, and the team as a whole must be competent even when skills differ.",
      "Treat personal traits as optional once the examination is passed, and leave communication to the auditee, because competence is proved by the certificate and the lead auditor's clock and team duties are not part of that proof.",
      "Require a doctorate before the person may audit, and do not let years of experience offset education, because an advanced degree is the single qualification and work history cannot fill a gap in that credential."
    ],
    "answer": 1,
    "why": "Knowing the technique is not the same as being an effective auditor. The person has to apply the knowledge in the auditee's environment. Competence includes education, training, and knowledge, work experience, audit skills, communication skills, and personal traits. Interpersonal skill, problem solving, attention to detail, cultural awareness, and the ability to work alone and on a team are part of that pattern. A lead auditor also needs negotiation and time management, and has to direct the team by balancing strengths and weaknesses. ISO 19011 adds that each auditor need not have the same competence, while the team as a whole must be able to meet the audit objectives. For a lead auditor the extra weight is on leadership, formal communication, and managing the audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 146 and 149.</span>"
  },
  {
    "qid": "cqa:set-1:b05-06",
    "set": 1,
    "sub": "cqa-characteristics",
    "bok": "III.A",
    "cognitive": "Apply",
    "stem": "A candidate with a high school diploma and substantial experience wants to audit a medical-device plant. A colleague says every certification body requires a master's degree, and that device experience is unnecessary because audit technique transfers unchanged from an assembly plant. What does the handbook say?",
    "options": [
      "Accept the colleague's rule and require a master's degree for every certification body, because ASQ, the Institute of Internal Auditors, and Exemplar Global all set that same advanced-degree floor, and audit technique transfers unchanged from an assembly plant so medical-device experience is irrelevant to competence.",
      "Treat a high school diploma as enough for every certification, including the Certified Internal Auditor, with no added years of experience, because sector knowledge is assumed once the examination is passed and medical-device work uses the same language as assembly.",
      "Reject a universal master's degree rule, because ASQ pairs less formal education with more experience and a high school diploma can be a start, while the Certified Internal Auditor path does not accept that diploma, and medical-device knowledge does not transfer unchanged from assembly.",
      "Keep the auditor out of sector-specific knowledge, because understanding medical devices would compromise independence, and a high school diploma plus general technique is the ceiling for both ASQ and the Certified Internal Auditor."
    ],
    "answer": 2,
    "why": "Certification bodies set education and experience floors, and they are not the same. Neither ASQ nor Exemplar Global requires an advanced degree in the way the IIA does for the Certified Internal Auditor. On the ASQ side, less formal education is paired with more years of experience, and a high school diploma is a possible starting point. For the Certified Internal Auditor, a high school diploma is not eligible. After the examination, certification is maintained through continuing development. A quality auditor meets quality-audit requirements. An environmental auditor meets environmental ones. The same idea applies in aerospace, medical devices, and automotive work. An auditor has to be able to understand the material in front of them, and industries do not share one language. Medical-facility knowledge is not assembly-plant knowledge. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 147–148.</span>"
  },
  {
    "qid": "cqa:set-1:b05-07",
    "set": 1,
    "sub": "cqa-characteristics",
    "bok": "III.A",
    "cognitive": "Apply",
    "stem": "The program adds an auditor to a team and never evaluates that person again. The lead auditor was chosen because of clause knowledge alone, with no attention to whether the person can run the audit. What should the evaluation support?",
    "options": [
      "Treat the entrance examination as a permanent evaluation and do not assess the person again, because clause knowledge is the whole of the lead role and the program has no need to set criteria, choose a method, or judge later ongoing performance during audits.",
      "Plan, perform, and record evaluation against the competence the program needs, then use the result to select the team, identify training, and judge ongoing performance, because a lead auditor must be able to lead and manage the audit, not only recite the clauses.",
      "Use evaluation only to remove personal traits from the file, and leave training needs and team selection untouched, because a fair record ignores how the auditor leads and manages the work.",
      "Have the auditee evaluate the team and select the lead auditor, because the plant being audited is the best judge of clause knowledge and the program does not plan or record its own competence decisions."
    ],
    "answer": 1,
    "why": "Competence is evaluated in a way the program has planned and documented, so the outcome is objective, consistent, fair, and reliable. The four steps are to determine what competence the program needs, set the criteria, select the method, and conduct the evaluation. That result is the basis for choosing team members, for seeing where competence has to improve, and for ongoing performance evaluation. Auditors keep competence current through professional development and regular participation in audits. Key competencies include implementing an audit, keeping communication going, collecting and verifying evidence, and writing findings and conclusions. For the lead auditor there is added emphasis on leadership, formal communication, and the skills needed to manage the audit. Clause knowledge alone does not cover that. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 149–150.</span>"
  },
  {
    "qid": "cqa:set-1:b05-08",
    "set": 1,
    "sub": "cqa-characteristics",
    "bok": "III.A",
    "cognitive": "Apply",
    "stem": "Two assignments are open. One is an internal audit of people the auditor sees every day. The other is a third-party audit in an unfamiliar plant and an unfamiliar region. A manager says the same trait matters most in both, and that a hidden agenda is acceptable if the auditor is persistent. Which distinction fits?",
    "options": [
      "Treat persistence as the only trait that matters on both assignments, and accept a hidden agenda as one of the listed auditor traits, because the type of audit does not change what competence looks like and culture is not part of the unfamiliar visit.",
      "Put versatility only on the internal audit and courage only on the third-party visit, because an auditor who already knows the people needs flexibility rather than candor, and a stranger's main trait is the nerve to speak up.",
      "Weight courage more on the internal audit, where the auditor already knows the people, and weight versatility and cultural sensitivity on the unfamiliar third-party audit, because a hidden agenda is not among the traits the handbook expects.",
      "Use the same trait weights for the internal audit and the third-party audit, because personal traits do not change with audit type and cultural sensitivity is not part of the attributes associated with ISO 19011."
    ],
    "answer": 2,
    "why": "The weight of a trait changes with the type of audit. Versatility matters more on second- and third-party audits than on first-party audits. The courage to point out a problem matters more for an internal auditor who knows the people and will see them again. The handbook's own list includes independence, a systematic approach, trustworthiness, persistence, curiosity, open-mindedness, and the absence of a hidden agenda. ISO 19011's attributes, as the handbook paraphrases them, add cultural sensitivity, the fortitude to act ethically when that will be unpopular, and the willingness to consider another point of view. A hidden agenda is not a substitute for persistence. Cultural sensitivity is part of doing the unfamiliar audit without treating the region as a flaw. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 150–151.</span>"
  },
  {
    "qid": "cqa:set-1:b05-09",
    "set": 1,
    "sub": "cqa-characteristics",
    "bok": "III.A",
    "cognitive": "Apply",
    "stem": "The lead auditor's notification never mentions escorts, safety equipment, or a room for the team. On the first morning the auditee gives a two-hour tour that was not on the plan, and one auditor wanders away from the schedule. People who had blocked the morning are left waiting. What should have been done?",
    "options": [
      "Let the two-hour tour replace the opening meeting and do not name escorts or safety needs in advance, because the auditee owns the first morning and the schedule is only a suggestion that auditors may leave without notice.",
      "Name escorts, safety equipment, and a team room in the notification, arrive on time, and keep the opening meeting, because an unscheduled tour and an auditor who ignores the schedule waste the time set aside for evidence.",
      "Skip the opening meeting to save time and send the notification after the audit, because escorts, safety equipment, and a room are arranged on the day and a written plan would only slow the start of the interviews.",
      "Accept the unscheduled tour and shorten the interviews to fit it, because management's walk-through is part of the opening and the people who blocked the morning do not have to be told that the schedule has changed."
    ],
    "answer": 1,
    "why": "Preparation removes a lot of delay. The audit manager places each audit among the others so people and resources exist. The lead auditor then builds the plan and a detailed schedule of where the team will be. That schedule can change during the audit if the change is communicated, but auditee management hears the plan before the performance stage. An auditor who makes no attempt to follow it antagonizes people who arranged to be available. The notification should name transportation, escorts, safety equipment, a conference room, and things like a copier, a printer, or wireless access. Anticipating those needs tells the auditee the team intends to spend its time gathering information. The team arrives on time. The lead auditor keeps the opening meeting and does not let an unscheduled tour or a long presentation take it over. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 152.</span>"
  },
  {
    "qid": "cqa:set-1:b05-10",
    "set": 1,
    "sub": "cqa-resources",
    "bok": "III.B",
    "cognitive": "Apply",
    "stem": "The team leaves the site for a long lunch and returns late for the next interview. No time was set aside for the team to compare notes. The audit is remote the following week, and the lead auditor says meal times cannot be planned on a remote audit. What is the better practice?",
    "options": [
      "Take every lunch off site and set no meal times for the remote audit, because a restaurant meeting is always better than talking on site and a remote audit has no host and therefore no breaks to plan.",
      "Drop meal and break times from both the site audit and the remote audit, because the team can compare notes in the car between interviews and a planned pause is not required when no host is present.",
      "Use a scheduled working lunch on site so the team can compare notes, and on the remote audit set meal and break times in the plan, because an unplanned off-site lunch makes the next interview start late.",
      "Let the auditee choose the restaurant and allow the team to return whenever the meal ends, because the host owns the clock at lunch and a remote audit the next week does not need meal times either."
    ],
    "answer": 2,
    "why": "Lead auditors often want a working lunch on site rather than a restaurant off site. A short team meeting at lunch lets people gather more information and check it with each other. A poorly organized lunch burns time and makes the team late for the next interview. An off-site lunch can be the right choice when the point is to talk with auditee management or to manage the team, but the time has to be scheduled: distance, sign-out and sign-in, and any extra plant procedure. On a remote audit the lead auditor sets the times for meals and breaks. There is no host and no long-lunch problem to absorb the afternoon. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 153.</span>"
  },
  {
    "qid": "cqa:set-1:b05-11",
    "set": 1,
    "sub": "cqa-resources",
    "bok": "III.B",
    "cognitive": "Apply",
    "stem": "The team disagrees on whether a finding is major or minor. The lead auditor says the auditee will settle it at the closing meeting. The daily team meeting was skipped so the auditors could stay in the plant. What is the lead auditor's job?",
    "options": [
      "Hold the daily team meeting, usually before the update with the auditee, and have the lead auditor make the final call on major or minor, because classification is not left to the auditee or to the closing meeting.",
      "Let the auditee settle whether the finding is major or minor at the closing meeting, and skip the daily team meeting, because auditors who stay in the plant are collecting evidence and a team discussion would only delay that work.",
      "Postpone classification until the next audit and let the escort break any tie the same day, because the lead auditor's role at the daily meeting is to record the auditee's preference rather than to decide.",
      "Have the most forceful auditor announce the classification during the closing meeting, because a daily team meeting is only a courtesy and the lead auditor should not overrule a colleague in front of the team."
    ],
    "answer": 0,
    "why": "The team meets each day to summarize what it has, review progress, and see whether the objective can still be achieved. That meeting is usually held before the daily update with the auditee. Another meeting can follow the update if the lead auditor needs one. The meetings show where more information is required. They also test whether the evidence is sufficient and documented. The lead auditor listens. The classification of a finding is the lead auditor's decision, not the auditee's and not a decision made for the first time in the closing meeting. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 153.</span>"
  },
  {
    "qid": "cqa:set-1:b05-12",
    "set": 1,
    "sub": "cqa-resources",
    "bok": "III.B",
    "cognitive": "Apply",
    "stem": "The audit has run for three days. The closing meeting is after lunch. No time has been set aside for the team to pull the evidence together, and the lead auditor plans to compose the draft report alone during the meeting. What is missing?",
    "options": [
      "Treat the closing meeting as the place where the report is written, and give the team no preparation time, because a three-day audit is presented from the notes in hand and the lead auditor can compose the draft alone while speaking.",
      "Ask the client to write the draft during the closing meeting, and have the team present only positive practices, because preparation time is reserved for sorting compliments and the findings can be composed while the meeting is underway.",
      "Schedule preparation time only for a one-day audit, and present this three-day audit from memory, because a longer visit produces fresher recall and the lead auditor should not assign any part of the closing presentation to other auditors.",
      "Set aside time before the closing meeting for the team to summarize the evidence, and draft the report with the team's input, because writing it alone during the meeting skips the preparation a several-day audit requires."
    ],
    "answer": 3,
    "why": "An audit team schedules enough time to prepare for the closing meeting, especially when the audit lasts several days. The team summarizes what it gathered so the presentation is ready. The team leader prepares a draft of the final report with the team's input and may assign parts of the presentation to specific team members. Writing that draft alone, in the meeting, skips the preparation the handbook treats as part of managing the audit's time and people. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 153.</span>"
  },
  {
    "qid": "cqa:set-1:b05-13",
    "set": 1,
    "sub": "cqa-conflict",
    "bok": "III.C",
    "cognitive": "Analyze",
    "stem": "The interviewee becomes less cooperative, asks again what the audit is for, and brings the wrong records. The auditor decides the person is resisting and moves to the next process without restating the question. What is the more likely problem, and what should the auditor do?",
    "options": [
      "Stop the audit and report the person for resistance before asking anything else, because less cooperation, another question about purpose, and the wrong records prove sabotage, and restating the question would only reward an auditee who is not acting in good faith.",
      "Treat this as a likely misunderstanding and restate the question in plain words before moving on, because conflict most often comes from poor communication, poor listening, or bias, and good faith is the first assumption.",
      "Accept the wrong records as conforming evidence and move to the next process, because repeated questions about purpose mean the scope can be set aside and the auditor does not need to clarify what was asked.",
      "Assume the misunderstanding is entirely the auditee's and keep the original wording, because the auditor's bias is a useful tool and the person should already know the auditor's language without a restatement."
    ],
    "answer": 1,
    "why": "The most effective way to handle conflict is to keep it from starting. Inside the team, ground rules set before the audit help. During the audit, conflict drops when misunderstandings are removed, when the team stays open and flexible, and when the auditee is not surprised. Misunderstanding is the most common cause. It comes from poor communication, poor listening, and bias on either side. The signs include a less cooperative interviewee, repeated questions about scope and purpose, and the wrong records. The auditor repeats or clarifies before moving on, listens for a meaning that contradicts the words, and assumes good faith. The auditor does not assume the fault is the auditee's. The question is asked another way, without jargon the auditee cannot be expected to know. Some people are not acting in good faith. That is watched for. It is not the first conclusion. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 154.</span>"
  },
  {
    "qid": "cqa:set-1:b05-14",
    "set": 1,
    "sub": "cqa-conflict",
    "bok": "III.C",
    "cognitive": "Analyze",
    "stem": "The team saves every unfavorable observation for the closing meeting so the message will have more impact. When the department manager argues, the auditor raises his voice and tells the manager the auditor's position outranks the manager's. What went wrong?",
    "options": [
      "Save every unfavorable observation for the closing meeting and settle the argument by rank and a raised voice, because surprise gives the message more impact and the auditor's position outranks the manager's, so a cool-down would only weaken a finding that is already clear.",
      "Share during the audit what is being recorded and how it will be used, and if an argument starts, stop and cool off without using rank, because surprise and overpowering the manager make the conflict more likely to return.",
      "Remove the finding to keep the peace, because a department manager's objection means the observation should be painted over, and neither a daily status conversation nor a cool-down is needed once the item is gone.",
      "End the audit the moment a voice is raised, and make no attempt to find the misunderstanding, because any raised voice means the audit cannot continue and the withheld observations should stay out of the record."
    ],
    "answer": 1,
    "why": "A reliable way to create conflict is to hold back important information and surprise the auditee at or after the closing meeting. Status is shared during the audit, often in a short daily conversation, and people are told what is being written down and how it will be used. That reduces fear and the chance of a fight. If conflict does start, the auditor stops for a cool-down. Continuing raises the chance of losing control, and the result can be a premature end to the audit. After things are calm, the auditor looks for the misunderstanding and stays open to the possibility that the auditor caused it. The auditor does not have the option of dodging a real issue or of painting over it. Attacking the person, or using rank to overpower them, escalates the conflict and makes it likely to come back. A successful resolution can be an agreement that disagreement remains. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 154–155.</span>"
  },
  {
    "qid": "cqa:set-1:b05-15",
    "set": 1,
    "sub": "cqa-conflict",
    "bok": "III.C",
    "cognitive": "Analyze",
    "stem": "An employee who helped design the process becomes hostile when the auditor questions it. At the opening meeting the plant also starts a long tour that is not on the plan, and later asks the auditor to give a lecture on the auditor's personal theory of corrective action. What should the auditor do?",
    "options": [
      "Give the requested lecture and let the unscheduled tour replace the interviews, because sharing a personal theory counts as auditing, hostility from the person who designed the process is answered by pressing harder, and plant management does not need to hear about the delay at all.",
      "Cancel the audit at the first sign of hostility and stop questioning the designer, because a person who helped build the process may not be interviewed and an unscheduled tour is a reason to leave the plant.",
      "Accept the lecture and the extended tour as evidence of management commitment, and answer the designer's hostility by defending the process with them, because time spent explaining a personal theory still counts as audit time.",
      "Separate the people or take a break until everyone is calm, stop or limit the unscheduled tour, and decline the lecture, because a speech on a personal theory is not auditing and delay tactics that threaten the schedule are reported to management and the client."
    ],
    "answer": 3,
    "why": "In a difficult situation the auditor stays polite and firm and keeps control of the audit. Hostility may have nothing to do with the audit, or it may be a reaction to a question that feels like an attack on work the person built. When people get defensive, the auditor separates them or suggests a break and continues when everyone is calm. Time-wasting is recognized and not allowed to take over. A long opening presentation or an extended tour is stopped or limited. If delay tactics keep compromising the schedule, auditee management and the client are told. A subtler waste of time is a topic that flatters the auditor into a speech. Defending that speech as 'sharing expertise' does not make it auditing. While the auditor is explaining a personal view, the auditor is not auditing. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 155–156.</span>"
  },
  {
    "qid": "cqa:set-1:b05-16",
    "set": 1,
    "sub": "cqa-conflict",
    "bok": "III.C",
    "cognitive": "Analyze",
    "stem": "Two auditors disagree, in front of the auditee, about which clause to cite. One wants to drop the nonconformity so the argument will end. The lead auditor is about to order the other auditor to accept a clause with no discussion, because the closing meeting starts in twenty minutes. What is the better handling?",
    "options": [
      "Keep the disagreement inside the team, hear both auditors, and do not drop the nonconformity over a clause dispute, because forcing without that discussion is a last resort and citing both clauses can be an acceptable compromise.",
      "Argue the clause in front of the auditee, drop the nonconformity to end the fight, and force a choice if twenty minutes is all that remains, because the auditee should see how the team decides and dropping the finding is the cleanest compromise.",
      "Avoid the disagreement entirely, including the part that would change the finding, because avoiding is always the professional choice and the team should not spend the twenty minutes before the closing meeting on a clause.",
      "Let the auditee pick the clause during the closing meeting, because a team that cannot agree should hand the citation to the auditee, and keeping the argument private would hide a weakness the auditee is entitled to judge."
    ],
    "answer": 0,
    "why": "Conflict inside the team stays inside the team. If the auditee sees it, other findings and the audit itself look weaker. Members ask how important the point is, and how important the relationship is. Avoiding is not an option when the conflict affects the audit. It can be used for something that is not an audit issue, and then the conflict simply remains. Smoothing, by talking about what is agreed, can fit a minor or unresolvable point. Forcing someone to accept an opinion is poor practice unless it is the only way to keep the audit successful, such as when a decision cannot wait. The lead auditor still considers the inputs first. A hard 'my way' breeds resentment. Compromise means each side accepts less. Citing both clauses when the team cannot choose one is a workable compromise. Dropping the nonconformity because the team cannot agree on the clause is a worse one. Collaboration looks for a solution both can accept. It is the right weight when the issue matters and there is time to work it through. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 156–157.</span>"
  },
  {
    "qid": "cqa:set-1:b05-17",
    "set": 1,
    "sub": "cqa-conflict",
    "bok": "III.C",
    "cognitive": "Analyze",
    "stem": "The person who performs the process is not available, and the escort is late every morning. The auditor has been waiting in a noisy area while phones ring, and the interviewee says nobody told them an audit was happening. What is a sound response?",
    "options": [
      "Skip the unavailable process and record it as conforming, wait each morning without a schedule change, hold the interview among the ringing phones, and do not ask whether employees were told, because these conditions are the auditee's to live with and not findings about readiness.",
      "Interview a backup or say the absence may extend the audit, ask the escort how to start on time, move away from the noise, and ask management if employees know the audit is happening, because calling the skipped process conforming would hide the problem.",
      "End the audit on the first late morning and write a major nonconformity against the quality manual, because escort lateness by itself fails the system and there is no need to interview a backup or to move the conversation.",
      "Write the finding against the interviewee by name for being uninformed, keep the original times, and stay in the noisy area, because the person who said they were not told is the nonconformity and a backup interview would dilute that record."
    ],
    "answer": 1,
    "why": "The handbook's remedies match the ploy. If the requested person is unavailable, interview the backup or state, politely, that the absence may prolong the audit or force a change in scope. If the escort is late every morning, ask the escort how to start on time and change the schedule. If records and supplies are slow, ask for them in planning, or go with the auditee to pull the sample. If the interview is buried in noise and phone calls, move, close a door if that is possible, and have the calls go elsewhere. If people say they were never told, confirm that employees know an audit is happening and ask management about the readiness of the system. Skipping the process and calling it conforming hides the problem. Naming the interviewee in a finding is a separate mistake. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 157.</span>"
  },
  {
    "qid": "cqa:set-1:b05-18",
    "set": 1,
    "sub": "cqa-communication",
    "bok": "III.D",
    "cognitive": "Evaluate",
    "stem": "The lead auditor sends the plant manager a text full of internal abbreviations, does not check that it arrived, and uses the same wording she would use with a technician on the floor. She says any message that left her phone was communicated. What is missing?",
    "options": [
      "Rewrite the message in plain words matched to the plant manager, confirm it was received and understood, and pick a medium that fits the message, because sending a text is not the same as having communicated.",
      "Treat any text that left the phone as communicated, and use the same abbreviations and wording for the plant manager and the technician, because the medium and the audience do not change what counts as a completed message.",
      "Accept only a signed letter as audit communication, and set aside texts, e-mail, and conversation, because those channels cannot carry a finding and a nod or a clarifying question adds nothing once the letter is sent.",
      "Keep the internal abbreviations in every message, including the one to the plant manager, because shorthand prevents misunderstanding and the auditor does not need to check whether the receiver actually understood the note."
    ],
    "answer": 0,
    "why": "Audit communication includes memos, automatic notices, e-mail, chat, and conversation, before and during the audit. Three rules follow. The message is clear: ordinary words, no lecture that buries the point, accurate content, and a level matched to the audience. The auditor checks that it arrived, by phone, mail, e-mail, or whatever channel was used, and looks for understanding. A nod or an 'I see' is a sign, not the finish. Clarifying questions and the answers are the check, and the auditor decides when a written record is needed. The medium fits the formality of the message, the technology the receiver actually uses, and the format, whether that is a letter, a memo, a text, a face-to-face talk, or a call. Leaving the phone is not the same as having communicated. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 159.</span>"
  },
  {
    "qid": "cqa:set-1:b05-19",
    "set": 1,
    "sub": "cqa-communication",
    "bok": "III.D",
    "cognitive": "Evaluate",
    "stem": "Before the audit the lead auditor refuses small talk, will not discuss confidentiality, and agrees to drop two processes because the auditee says they are inconvenient. During the audit the lead auditor also skips the daily briefing. What should have been protected?",
    "options": [
      "Protect the agreement to drop the two inconvenient processes, because the authority to audit is the first thing a flexible auditor gives away, and rapport, confidentiality, and the daily briefing can all be skipped once the auditee prefers a shorter visit.",
      "Limit communication to small talk before the audit and hold the plan until the closing meeting, because confidentiality and daily briefings add little and the auditee's request to drop processes should be granted as ordinary flexibility.",
      "Hold a daily briefing only after the client has approved a nonconformity, and agree to drop inconvenient processes, because rapport and a plain explanation of the plan are courtesy rather than part of the authority to conduct the audit.",
      "Build rapport and explain confidentiality and the plan, stay flexible about how the work is done, and keep the daily briefing, because flexibility does not include dropping in-scope processes or giving up the authority to audit."
    ],
    "answer": 3,
    "why": "Early on, the lead auditor builds rapport, uses confidentiality to establish trust, and shows some understanding of the disruption while promising to keep it as small as possible. Professionalism shows up as organization. The plan is explained, including how the auditee will be kept informed, and the auditor asks whether the approach seems reasonable. Flexibility means considering options. It does not mean giving up the authority to do the audit. The handbook's phrase is firm but flexible. During the audit, communication includes active listening, working with the escorts, teamwork, daily briefings, language needs, useful technology, and schedule changes when they are appropriate. Dropping in-scope work because it is inconvenient is not flexibility. It is abandoning the audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 160.</span>"
  },
  {
    "qid": "cqa:set-1:b05-20",
    "set": 1,
    "sub": "cqa-communication",
    "bok": "III.D",
    "cognitive": "Evaluate",
    "stem": "An auditor wants to bring a new recording device because it is new. The plant's security rules forbid recording, and the auditor has not learned how the device stores files. The auditor says technology always improves an audit and that e-mail during the interview is the same as a conversation. What is the limit?",
    "options": [
      "Bring the new recorder despite the plant's security rule and replace the interview with e-mail, because newer equipment is always an improvement, the auditor can learn the device during the audit, and a one-way message is the same as a conversation.",
      "Leave the recorder behind because the plant forbids recording and the auditor does not yet know the device, and do not treat e-mail as the interview, because e-mail is a one-way message someone still has to open.",
      "Record every interview, including at this plant, because a complete file requires a recording device, security rules yield to the audit record, and e-mail during the interview is an acceptable substitute for talking.",
      "Forbid every device and copy all evidence by hand, because technology cannot shorten an audit and e-mail is never appropriate, even for one-way messages sent before or after the visit."
    ],
    "answer": 1,
    "why": "Devices have made audits more effective, but the test is value, not novelty. The auditor looks for tools that shorten the cycle, cut paper, cut travel, reduce the physical collection of evidence, or make the audit more effective. The auditor also has to know the device and know what is permitted or prohibited before, during, and after the audit. Security rules are a common prohibition. E-mail is close to a standard way to reach everyone before and after the audit, and it supports faster delivery of the product of the audit. It is one-way. Someone has to open it. It is not a substitute for an interview, and a device the auditor does not understand is not an improvement. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 160–161.</span>"
  },
  {
    "qid": "cqa:set-1:b05-21",
    "set": 1,
    "sub": "cqa-interview",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "A new auditor opens the checklist and asks a string of yes-or-no questions. The auditor talks more than the operator. The operator never describes the job. What should the interview have been?",
    "options": [
      "Read the checklist as a string of yes-or-no questions and let the auditor do most of the talking, because the checklist is the center of the interview and the operator's description of the job is not needed to verify conformity.",
      "Have the auditor deliver the questions as a speech and treat the operator's account as the less reliable source, because a new auditor learns more by talking than by hearing how the person actually does the job.",
      "Replace the interview with a written test, because conversation is not a way to verify conformity and open questions about who, what, where, when, how, and why would only add stress without adding evidence.",
      "Make it a conversation that starts with the operator's job and follows open questions, because the person and the process are the center, and a yes-or-no checklist as the center makes the interview choppy and teaches the auditor less."
    ],
    "answer": 3,
    "why": "The interview is often the hardest part for a new auditor and one of the most important parts of the audit. It should gather information with as little stress as possible. It starts as a conversation: introductions, the person's job, then a topic the person has already mentioned. The auditor keeps control and uses the conversation to collect evidence. Open questions, who, what, when, where, how, and why, make the person explain. Questions that start with 'Does the organization' or 'Is there a' leave the auditor talking and the auditor learning little. The checklist may be written in yes-or-no form so notes tie back to a requirement. The questions actually asked can be different. Once the checklist, rather than the person and the process, becomes the center, the conversation stalls. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 166–167.</span>"
  },
  {
    "qid": "cqa:set-1:b05-22",
    "set": 1,
    "sub": "cqa-interview",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "The checklist says, 'Are process settings recorded on the work order?' The auditor instead asks how the operator knows what the settings should be, looks at the work order, and compares it with the machine. What is the point of that sequence?",
    "options": [
      "Keep the checklist sentence closed so the note ties to the requirement, ask how the operator knows the settings, and compare the work order with the machine, because together they show the settings are known, recorded, and used.",
      "Allow only the yes-or-no checklist sentence to be asked, and treat a look at the machine as outside the interview, because an open question about how the operator knows the settings would break the note's link to the requirement.",
      "Let the work order replace the interview so the operator does not need to speak, because the record alone shows that the settings are known and used and a comparison with the machine would be a different audit.",
      "Call the comparison of the machine with the work order a product audit and refuse to do it in a process interview, because only the operator's spoken answer can verify that settings are recorded."
    ],
    "answer": 0,
    "why": "A checklist question is often built by turning a requirement into a yes-or-no sentence, which makes the note and the link to the requirement easy. The interview does not have to use that sentence. The handbook's example starts with how the operator knows the settings, then asks to see the work order, then asks where the adjustments are made, and then compares the machine with the order. That verifies access, the record, and the actual setting. Useful follow-ups are what the operator does if the settings are missing, if they look wrong, or if the operator changes them. The closed sentence on the checklist and the open questions in the room are doing different jobs. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 167.</span>"
  },
  {
    "qid": "cqa:set-1:b05-23",
    "set": 1,
    "sub": "cqa-interview",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "The auditor asks, 'This instrument is calibrated, isn't it?' and 'First you set up the equipment, right?' The auditor expected those answers before walking in. What is the defect in the questions?",
    "options": [
      "Keep both questions, because a question that points at the expected answer is the most efficient form, and an auditor who already trusts the calibration and the setup should confirm those facts rather than ask the operator to explain them.",
      "Treat both questions as open and neutral, because a confirming tag removes bias rather than creating it, and an auditor who arrives already expecting the instrument to be calibrated is using prior knowledge the way a good interview should.",
      "Recognize them as leading questions that point at an answer the auditor already expected, and ask instead how the person knows the value is right or what the first step is, because expecting the answer biases the result.",
      "Keep the leading form whenever the auditor already trusts the process, because trust is a reason to point at the expected answer and the evidence does not still have to be asked for in an open way."
    ],
    "answer": 2,
    "why": "A leading question is asked with a specific answer expected. The auditor should not walk the interviewee to that answer. Open questions avoid the trap. The handbook contrasts 'How do you know this value is right?' with 'This instrument is calibrated, isn't it?' and 'What is the first thing you do?' with 'First you set up the equipment, right?' An auditor who enters expecting certain answers biases the result. Trust in the process is not a reason to lead. The evidence still has to be asked for and looked at. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 167–168.</span>"
  },
  {
    "qid": "cqa:set-1:b05-24",
    "set": 1,
    "sub": "cqa-interview",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "The auditor sits down with twelve people from the department. No second auditor is present. Several people look at one supervisor before they answer. The auditor records the group's first answer and does not ask anyone separately. What are the limits of this method?",
    "options": [
      "Prefer this group of twelve with one auditor and accept the first answer after people look at the supervisor, because a group is the favored method, one auditor can read a large group, and there is no reason to limit size or add a second auditor.",
      "Treat twelve as an acceptable group for one auditor and treat the look toward the supervisor as the group's answer, because the limit of five applies only when two auditors cannot attend and eye contact replaces a separate interview.",
      "Forbid every group interview, even when the people will be gone before separate interviews are possible, because a project team or a group about to leave is never a sufficient reason and two auditors do not change that rule.",
      "Use a group interview only rarely, with two auditors and ideally no more than five people, and notice whom others look toward before answering, because twelve people and one auditor cannot show individual reactions and ordinary questioning of a department is not a sufficient reason."
    ],
    "answer": 3,
    "why": "Interviewing a group is not the preferred method and its use should be limited. A real reason might be a project team, where the dynamics matter, or a group of sales representatives who are about to leave. The difficulty is reading several people at once. With one person, a sensitive question is easier to see. In a group the auditor has to watch each reaction and look for the informal hierarchy: eye contact, a nod, or a question passed to one person. When the method is used, two auditors should be present and the group should be as small as possible, ideally no more than five. Twelve people and one auditor, with the supervisor's look treated as the answer, misses those limits. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 167–168.</span>"
  },
  {
    "qid": "cqa:set-1:b05-25",
    "set": 1,
    "sub": "cqa-interview",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "The auditee's language is not the auditor's. The plant offers its own supervisor as the translator and asks the auditor to keep the original interview times. The supervisor works in the process being audited. What has to change?",
    "options": [
      "Use the auditee's language, or a translator independent of the process and of the audit firm, lengthen the schedule, and keep questions short, because translation takes longer and the plant's own supervisor is not a credible translator.",
      "Keep the plant supervisor as translator and hold the original interview times, because the person who works in the process is the most credible interpreter and translation does not require shorter questions or extra time on the schedule.",
      "Speak only the auditor's language and decline every translator, because translation adds bias even when the translator is independent of the operation and of the audit firm, and the schedule should not change for language.",
      "Double the number of questions and keep the same time, using the supervisor as translator, because short questions are less accurate and an independent translator would slow the audit more than someone who already knows the process."
    ],
    "answer": 0,
    "why": "Audits should be conducted in the auditee's language. When that is not possible, a translator is used. Credibility is higher when the translator is independent of the operation being audited and of the firm conducting the audit. A supervisor from the process being audited is a weak choice. Translation takes longer for the interview, for evaluating the evidence, and for summarizing, so the lead auditor changes the time allowed. Questions have to be short or they will be cut in half mid-sentence. Simultaneous translation can save a little time, and it makes body language harder to read because the person is attending to the translator. Planning and a skilled translator are what make the interview work. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 168.</span>"
  },
  {
    "qid": "cqa:set-1:b06-01",
    "set": 1,
    "sub": "cqa-communication",
    "bok": "III.D",
    "cognitive": "Evaluate",
    "stem": "The lead auditor arrives at the opening meeting in clothes that do not fit the plant, does not introduce the team's qualifications, and lets a team member run the meeting because the lead auditor is still writing the plan. The auditee leaves unsure what methods will be used. What should the lead auditor have done?",
    "options": [
      "Delegate the opening meeting to whoever is free, keep the team's qualifications private, and treat clothing as unrelated to the work, because management does not need confidence in who is auditing and a handout on the methods would only repeat the plan.",
      "Skip the opening meeting and mail the credentials with the final report, because ability is judged from the report and the auditee can infer the methods after the audit without a presentation of the plan.",
      "Have the auditee present the plan, and have the lead auditor speak only if a nonconformity is found, because the opening meeting belongs to the plant and credentials are offered only when the findings are disputed.",
      "Dress for the plant, present the team's credentials, and conduct the opening meeting with aids that leave management clear on the methods, because the lead auditor, not a team member still writing the plan, owns that meeting."
    ],
    "answer": 3,
    "why": "Auditors have to make a favorable impression in both appearance and ability. Dress for the opening meeting is part of that. Credentials may be presented then so management has confidence that competent people are performing the audit. The lead auditor conducts the opening meeting, the closing meeting, and the separate daily meetings with the auditee and with the team. Aids and handouts are used so the auditee agrees with the plan and understands the methods. The auditee should also be able to read the data, agree with the evidence in the report, and agree to address the corrections or corrective actions that are needed. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 164–165.</span>"
  },
  {
    "qid": "cqa:set-1:b06-02",
    "set": 1,
    "sub": "cqa-communication",
    "bok": "III.D",
    "cognitive": "Evaluate",
    "stem": "The closing meeting is held in a hallway because no room was reserved. The findings are read aloud from a notebook. No chart, matrix, or copy of the requests is available, and the lead auditor says a spoken list is enough because the auditee can ask questions. What is missing?",
    "options": [
      "Read the findings aloud from the notebook in the hallway, because a spoken list is the required form, questions from the auditee replace visual aids, and reserving a room or preparing charts is the plant's job rather than the lead auditor's.",
      "Reserve a room with the equipment and have charts or copies of the requests ready, because the analysis is communicated both orally and visually so the auditee can see the pattern in time to act.",
      "Play a video of the entire audit instead of charts, because matrices and graphs are reserved for a third-party closing meeting and copies of corrective-action requests are filed after the auditee has already left.",
      "Ask the client to set up the room after the meeting and add the charts a week later, because visual aids belong in the file rather than in the presentation and a spoken list is enough for the people in the hallway."
    ],
    "answer": 1,
    "why": "The lead auditor is responsible for a place to present: a training room, a conference room, or even a break area, with enough space and a seating arrangement that fits the group. The equipment has to be secured: a laptop, a projector, a pointer, outlets, flip charts, markers, and extension cords. Visual aids have to be ready: printed reports, completed forms such as corrective-action requests, slides, or charts. The analysis is given both orally and visually. Simple statistical techniques help the auditor see patterns, and simple charts, matrices, or graphs help the auditee understand the problem in time to act. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 165.</span>"
  },
  {
    "qid": "cqa:set-1:b06-03",
    "set": 1,
    "sub": "cqa-interview",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "An operator describes a check that is not on the work instruction. The escort says the account is typical. The auditor is ready to write the finding from that one conversation. A second operator, picked by the auditor rather than by the escort, describes a different method, and the records match the second account. What should the auditor have required before writing?",
    "options": [
      "Require corroboration before writing, by asking others the auditor chooses, watching the work, and comparing the accounts with the records, because one person's story, even if the escort calls it typical, can miss what is actually done.",
      "Write the finding from the first conversation alone, because one confident account that the escort calls typical is already corroborated evidence, and a second operator or the records cannot outweigh the escort's judgment about what is usual in the process.",
      "Interview only the people the escort selects, and write from that account, because the escort knows who is typical and the auditor should not pick a second operator or test the story against records.",
      "Write both accounts as major nonconformities without looking at the records, because conflicting stories are each a failure and corroboration by procedure, observation, or another auditor's notes would only delay the finding."
    ],
    "answer": 0,
    "why": "People filter what they see, so facts from an interview have to be corroborated. The methods are to ask another way, ask for evidence that the work is done as described, ask other people the same question, watch the activity, review what other auditors collected, and review procedures, instructions, and records. An auditee may try to steer the auditor toward some people and away from others. That person's knowledge may not be typical, so the auditor chooses whom to interview. Hearsay, and an employee with a grievance, can damage the auditor's credibility if they are written down as fact. The second operator and the records are the check the first account did not yet have. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 169–170.</span>"
  },
  {
    "qid": "cqa:set-1:b06-04",
    "set": 1,
    "sub": "cqa-team-building",
    "bok": "III.F.1",
    "cognitive": "Apply",
    "stem": "A one-person audit is underway. The auditor says there is no lead auditor because there is no team, and that the seven elements of a task-driven team apply only when several auditors travel together. The plan is being ignored because the visit is short. What is wrong?",
    "options": [
      "Treat the visit as having no lead auditor and no team duties, because a single person is not a team, a short audit does not follow a plan, and the seven task-driven elements apply only when several auditors travel together.",
      "Treat the single auditor as the lead auditor and still follow the plan, track the schedule, record results, and decide from evidence, because a one-person audit is still a task-driven team with those duties.",
      "Name the client as lead auditor whenever fewer than three auditors are on site, and let that client decide which parts of the plan may be ignored because the visit is short.",
      "Apply the seven elements only inside a permanent audit department, and let a visiting auditor invent rules for the day, because an ad hoc audit formed for one visit is not a task-driven team."
    ],
    "answer": 1,
    "why": "Audit teams are ad hoc teams formed to carry out the plan and meet the objectives. Most are informal. They may or may not be cross-functional. The leader is normally chosen by the client or the audit program manager. The work is task-driven and usually lasts for one audit. Seven elements follow: follow the plan and consider changes, monitor progress and the schedule, complete assigned tasks, record the results, verify that the objectives are being achieved, make evidence-based decisions about findings and progress, and identify new actions, responsibilities, and timing. There is always a lead auditor. If only one auditor is conducting the audit, that auditor is the lead auditor. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 172.</span>"
  },
  {
    "qid": "cqa:set-1:b06-05",
    "set": 1,
    "sub": "cqa-team-building",
    "bok": "III.F.1",
    "cognitive": "Apply",
    "stem": "The lead auditor hands out assignments at the opening meeting, does not tell the auditors who else is on the team, and gives the technical expert no forms and no instruction on the working papers. One auditor is carrying twice the area of the others. A team member has a family emergency and the lead auditor has no emergency contact. What should the lead auditor have put in place?",
    "options": [
      "Announce assignments for the first time at the opening meeting and leave the technical expert without forms or instruction, because an expert is not a team member and emergency contacts are unnecessary when the lead auditor already knows the plant.",
      "Brief every member, including the technical expert, on the assignment, the other members, and the working papers before the audit, divide the work equitably, and keep emergency contacts, because those preparations are the lead auditor's job.",
      "Let the technical expert run the team while the lead auditor only writes the report, because expertise outranks the audit process and uneven areas can be balanced after the visit if someone has a personal emergency.",
      "Leave emergency contacts with the auditee and correct the uneven assignments after the closing meeting, because the lead auditor's advance duty is only to name the areas, and working papers can be explained on site if time allows."
    ],
    "answer": 1,
    "why": "Before the audit starts, the lead auditor makes sure every person understands the assignment, knows the other members and their contact information, and has had time to meet, such as at a preaudit meeting. Members need to know the deliverables: a completed checklist, records of evidence, written nonconformities, and opportunities for improvement, plus the procedures they will follow. The lead auditor provides forms, examples, access to a shared workplace, and working papers, and instructs people in their use when that is needed. Leadership includes treating assignments equitably and making sure people know where to go for help. A personal emergency is supported, so the lead auditor keeps emergency contacts. The audit starts and ends on time, and requests are answered. Team members can include qualified auditors, auditors-in-training, and technical experts. They accept assignments and report progress to the leader. The leader owns the audit process and is a competent auditor. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 172–173.</span>"
  },
  {
    "qid": "cqa:set-1:b06-06",
    "set": 1,
    "sub": "cqa-team-facilitation",
    "bok": "III.F.2",
    "cognitive": "Apply",
    "stem": "The audit team is made up of qualified auditors who have worked together on many audits. The program manager assigns a facilitator who will also vote on findings and write nonconformities. The lead auditor says a facilitator is required on every audit and must be a full member of the team. What does the handbook say?",
    "options": [
      "Decline a voting facilitator, because an experienced team of qualified auditors does not need one, a facilitator does not participate as a member, and any help should come from a coleader or a member the lead auditor appoints.",
      "Accept the facilitator as a required full member who votes on findings and writes the nonconformities, because every audit needs that role, the auditee may not supply it, and an experienced team of qualified auditors needs the extra vote most of all.",
      "Have the auditee supply the facilitator and forbid the lead auditor to appoint one, because facilitation is an auditee control and a coleader from the audit team would compromise the team's independence.",
      "Let the facilitator replace the lead auditor and own the report, because the person who organizes the team is the decision maker, and voting on findings is how that ownership is exercised."
    ],
    "answer": 0,
    "why": "A team may have a facilitator to help the leader organize the team and make it more effective. That person does not participate as a team member. The role is to help the team resolve issues and reach its purpose. For an audit team of qualified auditors who already have team experience, a facilitator is unnecessary. If the lead auditor needs help, the lead auditor appoints a coleader or a team member to facilitate. An audit-team facilitator should know the audit process, team dynamics, and tools such as matrices, ranking or grading, sorting, and flowcharting. Voting on findings and writing nonconformities is member work, not the facilitator's role. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 174.</span>"
  },
  {
    "qid": "cqa:set-1:b06-07",
    "set": 1,
    "sub": "cqa-team-facilitation",
    "bok": "III.F.2",
    "cognitive": "Apply",
    "stem": "One auditor talks over the others and the findings are starting to reflect that auditor's opinion. No one set a rule about being on time or listening. The lead auditor says facilitation is a permanent extra job, even after this same team has completed many successful audits together. What should facilitation be doing, and when does the need drop?",
    "options": [
      "Let the loudest auditor set the findings and add a permanent facilitator even after many successful audits together, because success increases the need for active control and rules about being on time or listening would only slow a group that already knows itself.",
      "Limit facilitation to writing the report, and take rules about time and listening from the auditee's procedure, because clashes inside the team are not the facilitator's concern once the objectives have been issued.",
      "Take the domineering auditor off all future teams, because facilitation cannot deal with personality, and a group that has succeeded together should keep the same heavy facilitation it needed when the members first met.",
      "Use facilitation to give everyone a voice, defuse clashes, and keep the team on the evidence and the schedule, and expect less of it here, because a team that has already succeeded together needs less active facilitation, not a permanent extra job."
    ],
    "answer": 3,
    "why": "Facilitation for a team includes making the tools available, recognizing and defusing clashes, making sure everyone has a voice so a domineering personality does not run the team, and using different views to strengthen the deliverable. The team is kept on the objectives, on evidence-based decisions, and on the schedule. Organizational tools such as outlines, plans, and flowcharts are used when they help a decision. The environment stays professional and impartial, including a check that the auditee could not read bias into the output. Problems that hurt the team are identified, including a hostile auditee or a conflict of interest. Rules can be agreed, such as being on time and being willing to listen. Communication stays open, and everyone hears the progress. The need for that active facilitation decreases as members are trained, experienced, and have succeeded together. A team that has already worked well on other audits needs less of it, not more. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 174.</span>"
  },
  {
    "qid": "cqa:set-1:b06-08",
    "set": 1,
    "sub": "cqa-team-stages",
    "bok": "III.F.3",
    "cognitive": "Apply",
    "stem": "A manager says every new audit team must be walked through forming, storming, and norming before it can audit, because no team can start at performing. Halfway through a long project the goals and the management support are withdrawn, and the manager says a team that has reached performing cannot slide backward. What does the handbook say?",
    "options": [
      "Require every new audit team to pass through forming, storming, and norming before it may audit, and treat performing as a stage the team cannot leave, because a change in goals or management support does not disturb a team that has already arrived there.",
      "Call the team storming once it is cohesive and trusts itself, and call it performing while members are still pushing their own ideas, because those names, not the loss of support, decide whether the team may keep auditing.",
      "Expect most audit teams to start at performing, because trained auditors already know they work together and the time they spend together is short, and expect a slide back to forming or storming if the goals or the support are withdrawn.",
      "Write norming into the procedure as a required stage, and judge a team that starts at performing incompetent, because an audit team may not use the short independent work of trained auditors as a reason to skip the earlier stages."
    ],
    "answer": 2,
    "why": "The stages are forming, storming, norming, and performing. They were developed for cross-functional teams with a specific purpose and for long-term project teams, and they can also be used for an ad hoc audit team. Forming is organizing, with some distrust and people pushing their own ideas. Storming is testing authority and whether management really supports the team. Norming is accepting the rules and starting to cooperate. Performing is a cohesive team that trusts each other, uses strengths, and can meet the objectives. If the goals, the support, or the purpose change, the dynamics can slide back to forming or storming. Most audit teams start at performing. Training and competent auditors are part of why a team can be formed as needed. Auditors already understand that they work together for the objectives, much of the time they work independently, and the time they spend interacting is short. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 175–176.</span>"
  },
  {
    "qid": "cqa:set-1:b06-09",
    "set": 1,
    "sub": "cqa-staffing",
    "bok": "IV.A.2",
    "cognitive": "Evaluate",
    "stem": "The plant has no full-time auditors. A coordinator recruits people to audit part-time, alongside their jobs, and sometimes uses a subcontracted auditor. A manager says only a separate full-time group is acceptable, and that if finance objects to the hours, the schedule should be cut without looking at what the organization is required to audit. What is workable?",
    "options": [
      "Insist on a separate full-time group reporting to production, and cut the schedule as soon as finance objects, because part-time and subcontracted people cannot know the system and management need not look again at the contract or regulatory audits the organization still owes.",
      "Let part-time auditors audit only their own department, and keep subcontracted auditors away from the management system, because a mix is allowed only inside those limits and a finance objection is settled by dropping the external requirements first.",
      "Require supplier auditors to be full-time employees of the supplier, and ignore travel and culture, because second-party work cannot be done by the customer's part-time auditors and a resource objection does not reopen the schedule.",
      "Use part-time or subcontracted auditors when they are qualified, know the system, and can do the audits, and if finance objects, reassess needs and requirements before cutting the schedule, because hours follow what the organization must still audit."
    ],
    "answer": 3,
    "why": "A documented program for selecting, training, and monitoring auditors is the robust form. Some companies use a separate internal-audit group. Others use part-time or subcontracted auditors, recruited and trained by a coordinator or a functional manager. Either arrangement, or a mix, works when the auditors are qualified, technically competent, know the system, and can do the work. The same idea applies to a second-party group: part-time, full-time, or internal auditors doing supplier audits. Second-party auditors need to handle different cultures and to travel. When the criteria are complex or resources are tight, a combined or joint audit can be the practical strategy. Resources are justified by the schedule, and the schedule is justified by internal needs, such as process changes, and by external requirements, such as a contract or a regulation. The program manager has to have enough resources for the number and types of audits required. If those resources are challenged, management reassesses the needs and the requirements. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 180.</span>"
  },
  {
    "qid": "cqa:set-1:b06-10",
    "set": 1,
    "sub": "cqa-staffing",
    "bok": "IV.A.2",
    "cognitive": "Evaluate",
    "stem": "An auditor with little knowledge of the system is sent out because the department is short of people. During the visit the auditor describes one plant's proprietary process to a sister plant that reports to a different manager. The auditor says both choices are harmless because the sister plant is inside the company. What is the damage?",
    "options": [
      "Continue to send the lightly qualified auditor and brief the sister plant on the proprietary process, because a shortage of people justifies the assignment and a location inside the same company is always an allowed audience, even when it reports to a different manager.",
      "Share the proprietary process whenever it speeds the sister plant's audit, and treat competence as optional if the report is on time, because internal disclosure is not an ethical conflict and outsiders are the only audience that must be refused.",
      "Stop using the unqualified auditor and keep the proprietary process inside the plant that owns it, because a weak auditor can discredit the program and a sister plant under different management is not entitled to that confidence.",
      "Treat the sister plant as the client and include the proprietary process in the required distribution, because different managers inside one company share audit information by right and the auditor's lack of system knowledge does not affect credibility."
    ],
    "answer": 2,
    "why": "Using unqualified auditors, people with little knowledge or without the ability to help management make a good decision or improve a process, can discredit the entire audit process. Credibility is kept high by looking at information objectively and by avoiding ethical conflicts. The auditee has to trust that proprietary information will not be given to competitors or to other outsiders who can use it. Even internally, auditors keep confidences. That is especially true when locations or departments report to different management. Being inside the same company does not make the sister plant the audience for another plant's proprietary process. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 181.</span>"
  },
  {
    "qid": "cqa:set-1:b06-11",
    "set": 1,
    "sub": "cqa-training",
    "bok": "IV.A.3",
    "cognitive": "Evaluate",
    "stem": "New auditors receive a class on the standard and then are sent out. They have never practiced an interview, they are not requalified on any schedule, and the newest of them is named lead auditor because the class included the clauses. What is incomplete?",
    "options": [
      "Send the auditors out after the standards class and promote the most recent graduate to lead auditor, because knowledge of the clauses is the whole of training, skills practice is optional, and requalification is not required once the first course is complete.",
      "Forbid on-the-job training and requalify only third-party auditors, because internal auditors learn the standard in class and interviews are a knowledge topic rather than a skill that has to be practiced.",
      "Replace the standard with skills training alone and choose the lead auditor by seniority in the plant, because interviewing practice outweighs the clauses and the number of audits performed is not a promotion criterion.",
      "Add skills practice such as interviewing, requalify auditors on a planned cycle, and name a lead only after more experience or more audits, because a class on the standard is knowledge and is not the whole of training."
    ],
    "answer": 3,
    "why": "Training is one way to make auditors competent, either through the program or through a training organization, after the competency needs are known. It can be knowledge-based, such as a standard and how to interpret it, or skills-based, such as interviewing and presenting, or both. Competence can also come from orientation to the standards, implementation procedures, auditing courses, on-the-job training, and training on industry-specific regulation. Technical competence is kept through continuing education and current audit experience. An auditor needs training in the standards, evidence gathering, interpersonal relations, report writing, interview techniques, the CQA Body of Knowledge, improvement tools, and auditing methodology. At least one team member should know the department or the scope. A lead auditor usually has more experience, may be more highly trained in the standards, and may have more training in conducting audits. Policies often require years of experience or a set number of audits before that promotion. Auditors are requalified at planned intervals. A periodic refresher plus experience performing audits is a reasonable expectation, because standards and techniques change. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 181–182.</span>"
  },
  {
    "qid": "cqa:set-1:b06-12",
    "set": 1,
    "sub": "cqa-training",
    "bok": "IV.A.3",
    "cognitive": "Evaluate",
    "stem": "Auditors are evaluated once, on the day they are hired, against standards that were never explained. Nobody observes them on an audit, nobody looks at their reports, and the results are filed without being discussed. What does a performance evaluation include?",
    "options": [
      "Explain expectations against defined standards, then judge competence by watching the auditor and reviewing the work, and discuss the results so a plan can be built, because evaluation continues after hiring and is not a single interview.",
      "Stop after the hiring interview and file the result without discussing it, because later team selection needs no further evaluation, reports and observed audits are not performance evidence, and standards need not be explained before the auditor is judged.",
      "Let the auditee write the only evaluation and use that rating as the appraisal score, because management observation, credentials, and a review with the auditor would duplicate what the auditee already concluded.",
      "Score auditors by the number of nonconformities they write, with more findings meaning a better auditor, because competence is the volume of issues and consistency across auditors is not part of the evaluation."
    ],
    "answer": 0,
    "why": "Auditors are evaluated at three stages: the initial evaluation of people who want to become auditors, the evaluation used when an audit team is selected, and the continual evaluation that identifies what knowledge and skill need to be maintained or improved. Three steps make an evaluation work. First, expectations are communicated. A meaningful evaluation measures performance against standards that were explained, including during initial training. Second, performance is evaluated for individual competence and for consistency among auditors. Management can watch the auditor during an audit, read the evaluations the auditees complete, review the deliverables, use an independent auditor to evaluate technique, and appraise credentials. Third, the results are communicated to the auditor. Improvement requires that the person understand the strengths and the weaknesses, and management reviews the results so they can build a plan together. That loop also improves how auditors are selected. Counting findings is not the measure, and an auditee's rating of the audit is one input, not a substitute for the auditor's appraisal. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 184–185.</span>"
  },
  {
    "qid": "cqa:set-1:b06-13",
    "set": 1,
    "sub": "cqa-program-eval",
    "bok": "IV.A.4",
    "cognitive": "Evaluate",
    "stem": "The audit program has never been evaluated. The manager says the number of findings this quarter is the measure of the program, and that another plant's auditors should not look at this plant's audit team. No one has checked training records, the schedule, or whether corrective action was followed up. What would an evaluation actually look at?",
    "options": [
      "Use this quarter's count of findings as the program measure and refuse a review by another plant's auditors, because training records, the schedule, and corrective-action follow-up are local files and a single period is enough data to judge the program.",
      "Let the auditee's vote on whether the auditors were polite stand as the program evaluation, and leave training records and the schedule out of scope, because management review does not extend to the audit program itself.",
      "Evaluate the program periodically, including a look by auditors from another plant at training records, the schedule, results, and follow-up, because measures have to come from the program's objectives and from data over time, not one quarter's finding count.",
      "Wait to evaluate the program until a registrar writes a major nonconformity, because periodic management review, sample results, and follow-up are not required while external audits of the plant itself remain clean."
    ],
    "answer": 2,
    "why": "Periodic evaluation of programs and teams uncovers improvement. Programs are evaluated through management reviews. Management can review records, analyze performance, or appoint an independent team or person. In a company with several locations, auditors from another location can come in and audit the audit team: watch the team work, examine training records and schedules, and look at sample results, corrective actions, and follow-up to see whether the program is working as intended. Auditees can also rate interviewing, interaction, and reporting. The program is treated like any other function. Measures work only when they meet the program's needs, are chosen from documented standards and objectives, and use data collected over time. One quarter's finding count is not that. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 185–186.</span>"
  },
  {
    "qid": "cqa:set-1:b06-14",
    "set": 1,
    "sub": "cqa-program-eval",
    "bok": "IV.A.4",
    "cognitive": "Evaluate",
    "stem": "The annual summary says only how many audits were done. It does not say what the program contributed, what it will contribute next year, or what management should know to avoid a future risk. Corrective actions are counted as closed when the plan is approved, including actions that failed and were recycled. What belongs in the evaluation?",
    "options": [
      "Report only how many audits were done, count a recycled action as a success once the plan is approved, and leave future risk to the client, because contribution is the volume of audits and a failed action still shows the program worked.",
      "Answer what the program contributed, what it will contribute next year, and what management should know to avoid a future risk, and count recycled actions that missed the root cause as misses, because value is more than the number of audits.",
      "Measure value by the number of pages in the summary and avoid graphs, because a longer narrative is clearer than a matrix and next year's contribution can be copied from the count of audits already completed.",
      "Copy last year's schedule forward as next year's contribution and omit risks so the summary stays positive, because management attention is kept by good news and actions closed at plan approval need no further split between first-time success and recycle."
    ],
    "answer": 1,
    "why": "Effective measures cover audit service performance, auditor performance, and value-added contributions. Service performance asks whether the program met the customer's expectations: evaluations, focus groups, time the customer lost, contract terms, deliverables, an independent look at the program, and the number and severity of external audits of the audit organization. Auditor performance looks at competence and consistency, by observation, customer evaluations, deliverables, and credentials. Value looks at the effect on the business: planned completion against actual completion, the number and severity of external noncompliances, whether corrective action worked the first time, how many actions were recycled because they missed the root cause, repeat problems from the same cause, and whether opportunities for improvement were actually implemented. The annual summary answers three questions: what the department contributed last year, what it will contribute next year, and what management should know to avoid a future risk, such as a regulatory change. Contribution is compiled through the period, not assembled the night before. The summary has to compete for attention, so it is concise, accurate, and supported by graphs or matrices that make the point visible. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 186–188.</span>"
  },
  {
    "qid": "cqa:set-1:b06-15",
    "set": 1,
    "sub": "cqa-internal-program",
    "bok": "IV.A.5",
    "cognitive": "Create",
    "stem": "The quality manager audits the quality department's own procedures and writes the report to that same manager. The company is not a one-person shop. The manager says independence is a courtesy, not a requirement, and that auditors should audit the work they themselves perform because they know it best. What is the rule?",
    "options": [
      "Separate the auditors from the quality department's own work and send the report outside that manager's line, because auditors do not audit work they themselves perform and this plant is not the rare case with no other choice.",
      "Let the quality manager audit that department's procedures and receive the report, because knowing the work outweighs independence and the manager of the function being audited is the right recipient when the company is not a one-person shop.",
      "Treat independence as a registrar's rule only, and expect internal auditors to audit the work they perform, because an internal program is stronger when people examine their own procedures and courtesy is the only reason to separate duties.",
      "Let the auditee choose an auditor from inside the same process, because separation of duties slows the program and a positive deployment of auditing means the people closest to the work should judge it."
    ],
    "answer": 0,
    "why": "Wherever the function sits, it should be separated from and independent of the audited areas, supported by management, and used in a positive way. Independence has to be appropriate and practicable for the situation, the resources, and the circumstances. One common guideline is that auditors do not audit their own work. The manager of the function being audited is the wrong direct line for the people auditing that function. A very small organization may have no other choice, and then the conflict and its consequences have to be faced. This plant is not that case. Knowing the work is a reason to put someone who understands the process on the team. It is not a reason for people to audit the work they themselves perform. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 189.</span>"
  },
  {
    "qid": "cqa:set-1:b06-16",
    "set": 1,
    "sub": "cqa-internal-program",
    "bok": "IV.A.5",
    "cognitive": "Create",
    "stem": "No one owns the annual schedule. Dates slip and are not confirmed. Priorities are whatever the last complaint was. The audit manager says those are the lead auditor's private choices, and that budgeting, staffing, and watching how auditors perform are outside program management. What sits with the audit manager?",
    "options": [
      "Limit the audit manager to filing finished reports, and leave the schedule, the budget, and auditor performance to each lead auditor, because program management ends when the team arrives and priorities are whatever the latest complaint happens to be.",
      "Have the auditee write the annual schedule, and limit the audit manager to approving findings, because date confirmation, staffing, and status reports to senior management are operating decisions rather than management of the audit function.",
      "Set priorities by counting how many people ask for an audit, and leave risk out of the manager's reports, because the schedule is a popularity list and budgeting resources is each lead auditor's private choice.",
      "Give the audit manager the schedule, the budget, staffing, and the monitoring of auditors, including priorities and confirmed dates, because those duties are program management and not private choices of whichever lead auditor is on site."
    ],
    "answer": 3,
    "why": "Managing the function includes the reporting relationship, the authority and the limits, communication with senior management, enough resources, the choice of one auditor or a team, staffing and training, the procedures and criteria, the method for evaluating the program, the schedules, confirmation of dates and of changes, priorities, promotion of ethical behavior, review of how the function is performing, periodic reports to management, and identification of the risks to be managed and reported. The audit manager or coordinator prepares the overall schedule, budgets the resources, and oversees the administration. That manager also staffs and trains and monitors the auditors while they do the work. Those are not private choices of whichever lead auditor happens to be on site, and they are not a filing job. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 189.</span>"
  },
  {
    "qid": "cqa:set-1:b06-17",
    "set": 1,
    "sub": "cqa-external-program",
    "bok": "IV.A.6",
    "cognitive": "Create",
    "stem": "A critical component comes from a company that sells only to the plant's direct supplier. Procurement has no access clause in the contract with the direct supplier, and the audit manager says second-tier suppliers are outside the audit program because the plant does not buy from them. A stoppage at that second-tier company would halt the plant. What is the program's reach?",
    "options": [
      "Work with procurement so the contract gives access, and extend oversight to the second-tier source of this critical component, because a stoppage there can halt the plant and auditors oversee supplier requirements rather than write them.",
      "Limit the program to the direct supplier and treat an access clause as a purchasing courtesy, because a second-tier company that does not sell to the plant is outside the customer's risk even if a stoppage would halt production.",
      "Have the auditors write the technical requirements and the purchase orders, and keep procurement out of the schedule, because oversight is the same thing as setting supplier requirements and access clauses are an audit decision rather than a contract term.",
      "Audit every third-tier supplier on a fixed cycle and visit first-tier suppliers only after a failure, because tier, not risk or customer requirements, decides the reach and the direct supplier is the lowest priority."
    ],
    "answer": 0,
    "why": "Many program requirements are the same for internal and external audits. External audits differ because of the customer-supplier relationship. The program is part of watching the supply chain. The program manager works with procurement so contracts contain access clauses and so the schedule matches what procurement needs. Oversight may be needed at the first tier, the second tier, and perhaps the third, depending on objectives, customer requirements, and risk. A first-tier supplier is a direct supplier. A second-tier supplier provides a critical component to that first-tier supplier, and a stoppage there can have a significant effect on the customer. The program is most often involved in procurement, performance management, and risk management. Auditors are usually not the people who set supplier requirements. They are likely to be involved in oversight of those requirements. Technical requirements typically come from the process owner, quality, procurement, or legal. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 196–197.</span>"
  },
  {
    "qid": "cqa:set-1:b06-18",
    "set": 1,
    "sub": "cqa-external-program",
    "bok": "IV.A.6",
    "cognitive": "Create",
    "stem": "During a supplier visit the auditor sees a risk that could stop the customer's line. The auditor writes it into a private notebook and says risk is assessed only at the annual management review. The supplier was also told to meet ISO 9001 plus the extra medical-device requirements, and the auditor audited only ISO 9001. Last year's poor result has not changed the oversight or the share of business. What should change?",
    "options": [
      "Record the line-stop risk only in a private notebook, audit ISO 9001 and skip the added device requirements, and leave oversight and the share of business unchanged, because risk waits for the annual review and equal treatment means a poor result does not move the supplier's standing.",
      "Design the risk treatment and install it before leaving the supplier, and still audit only ISO 9001, because the auditor who sees a line-stop risk owns the remedy and extra requirements can be left for a later system audit.",
      "Report the line-stop risk to the program manager and the client, audit the extra device requirements as well as ISO 9001, and let the poor result change oversight or the share of business, because the auditor reports the risk rather than treating it alone.",
      "Treat the added medical-device requirements as outside the audit and assess the line-stop risk personally before reporting anything, because an ISO 9001 audit cannot be an ISO 9001-plus audit and the auditor, not the client, decides the treatment."
    ],
    "answer": 2,
    "why": "On any visit or interface with a supplier, the auditor has a duty to report a potentially significant risk to the program manager and the client. Auditors and program managers are not usually asked to assess identified risks unless they are specifically assigned to do that. Monitoring can include capability, source inspection, surveys, conformity and contract audits, risk-based audits, and verification that corrective action was implemented and that it worked. A supplier asked to meet ISO 9001 plus extra requirements, such as a medical-device or automotive standard, is audited as an ISO 9001-plus audit. A very small supplier asked to apply only certain parts of the standard is an ISO 9001-minus audit. External auditors may also need training for a different culture, and enough technical knowledge of the part and the process. Results feed the supplier report. They can be the basis for more or less oversight. Some companies tie the supplier's level to the share of the business, so the result has money attached. A higher level needs less oversight. Leaving the oversight and the share unchanged after a poor result ignores that input. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 200–201.</span>"
  },
  {
    "qid": "cqa:set-1:b06-19",
    "set": 1,
    "sub": "cqa-best-practices",
    "bok": "IV.A.7",
    "cognitive": "Evaluate",
    "stem": "An auditor sees a finishing process with no defects for six months and a method other plants could use. The manager says it cannot be reported unless it is the best in the world, and that a note in the report is enough even though best practices were not in the audit objectives. The manager also says fixing the nonconformities is more important than spreading the practice. What is the better use?",
    "options": [
      "Wait for a world benchmark before telling anyone, leave the practice out of the report, and assign no owner, because nonconformities always outrank improvement and a method other plants could use is not reportable until it is proved best in the world.",
      "Copy the finishing method into every plant this week without checking the enablers, because the audit's main job is collecting best practices and a defect-free run of six months is enough to mandate the change everywhere.",
      "Write a nonconformity at every plant that does not yet use the finishing method, because a noteworthy practice becomes a requirement as soon as one plant sustains it and no owner or follow-up is needed beyond the finding.",
      "Treat the method as worth spreading without being the world's best, record it so it can be found, and assign an owner, but include it in the report only if the objectives say so, because repairs do not outrank improvement."
    ],
    "answer": 3,
    "why": "Identifying best practices, and acting on them, matters as much as addressing nonconformities. A best practice is a known way to run a process that is effective and efficient. It may not be the best in the world or the best among competitors, and some organizations call these good practices, positive practices, or noteworthy achievements so the label does not start an argument. Managers are often more willing to correct a nonconformity than to adopt an improvement that came from someone else. Culture, competition, or a not-invented-here reaction gets in the way. The organization still has to give priority to improving the process, not only to fixing problems. An opportunity for improvement may not be a best practice. It can still make a process more effective or more efficient. Practices are spotted from the measures, including during preparation, and then verified on site. The checklist that captures metrics, enablers, and contacts must not push aside the main job of the audit, which is to find the systemic weaknesses. Simply writing the practice into the report is not enough. The organization needs a way to communicate it, such as a searchable record with the area, a description, the metrics, the enablers, a contact, and keywords. Implementation is assigned to a process owner, and the follow-up can look like the follow-up on a nonconformity. If best practices or opportunities for improvement are to appear in the report, they have to be in the purpose of the audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 201 and 203.</span>"
  },
  {
    "qid": "cqa:set-1:b06-20",
    "set": 1,
    "sub": "cqa-org-risk",
    "bok": "IV.A.8",
    "cognitive": "Analyze",
    "stem": "The program manager says the audit program's value is the dollars it saved last year, and nothing else. An auditor who is asked to manage a risk writes down what was seen and files it. An auditor who is asked only to monitor a risk starts a full treatment plan. Neither one is doing the job that was assigned. What is the difference?",
    "options": [
      "Treat monitoring, reporting, and managing as one activity, and measure the program only by last year's dollars saved, because a filed note is already a full treatment and a risk with no savings line, such as losing a license, sits outside the audit program.",
      "Manage every risk by buying insurance and tell auditors not to report what they see, because contingency plans and fallback plans are finance decisions and monitoring is complete once a premium is paid.",
      "Have the auditor who was asked to manage the risk work through context, identification, analysis, evaluation, and treatment, and have the auditor who was asked to monitor only recognize the risk and report it, because savings are not the program's only value.",
      "Ignore any risk that has no dollar figure, including loss of a license or a permit, because cost savings are the only value of the program and the monitor's job is to start treatment while the manager only files a note."
    ],
    "answer": 2,
    "why": "Organizations live with uncertainty from inside and from outside, and management deals with it by managing risk: insurance, contingency funds, hedging, fallback plans, and continuity plans. What counts as risk, and what is done about it, differs by organization. Some look only at consequences, some only at likelihood, some use numbers, and some use a description. The audit program should not equate its value only with money saved. Sometimes the organization wants less risk, such as the risk of breaking a law, a regulation, a standard, or a contract. Losing a license or a permit can hit revenue even when no 'savings' line exists. Safety, health, and environmental risk are other ways the program contributes. ISO 31000 describes managing risk as establishing the context, identifying, analyzing, evaluating, and treating the risk. A person asked to manage risk follows that kind of process. A person asked to monitor and report risk needs to recognize it. The two jobs are not interchangeable, and a file note is not a treatment. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 204–205.</span>"
  },
  {
    "qid": "cqa:set-1:b06-21",
    "set": 1,
    "sub": "cqa-org-risk",
    "bok": "IV.A.8",
    "cognitive": "Analyze",
    "stem": "The sample of records is all from a special-order form the plant stopped using. The auditor treats the clean sample as proof the current process conforms. Nothing in the plan mentions the risk that the team could contaminate a controlled area, and the program has no protection for its own audit records. What risks are being missed?",
    "options": [
      "Accept the clean sample as proof the current process conforms, leave team-caused risks out of the plan, and add no controls on audit records, because a special-order form is still the population and the team's presence creates no risk of its own.",
      "Reject the clean obsolete-form sample as proof the current process conforms, put risks the team could create into the plan, and protect the audit records, because sampling and the audit's own effects are risks the program has to face.",
      "Perform a formal risk analysis on every process before writing a note, and treat sampling risk as an internal-audit problem only, because external auditors are less exposed to a sample that does not represent the population.",
      "Write a nonconformity against the auditee for offering the special-order records, and do not discuss contamination or audit-record protection in the plan, because the sample error is the auditee's finding and program risks are outside this audit."
    ],
    "answer": 1,
    "why": "The team leader considers the risks the audit creates for the auditee. People on site can affect health, safety, the environment, or quality controls: someone gets hurt, causes pollution, contaminates a clean room, ruins a board with a static spark, or damages equipment and voids a calibration. Methods used to treat those risks are discussed at the opening meeting and included in the plan. Sampling is one of the biggest risks. The sample may not represent the population, so the conclusion is wrong. External auditors are more likely to hit that error than internal auditors. The auditor listens for a skewed sample: the process changed 45 days ago, the form is only for special orders, or the records are for a service no longer provided. Evidence of an immediate and significant risk is reported without delay. That is reporting a risk, not managing it. The auditor who notices a possible new risk is not charged with a formal risk analysis. The observation is for someone else to evaluate. Program management owns the risks of the program. ISO 19011 points at several: objectives that are not relevant, not enough time, a team that is not collectively competent, weak communication of the program, failure to protect audit records, and weak monitoring of outcomes. The schedule considers criticality, past performance, changes in process or people, and the maturity of the system. Riskier operations are audited more often. The lead auditor is given the information needed to evaluate risks to that audit's objectives. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 205–208.</span>"
  },
  {
    "qid": "cqa:set-1:b06-22",
    "set": 1,
    "sub": "cqa-mgmt-review",
    "bok": "IV.A.9",
    "cognitive": "Evaluate",
    "stem": "Management collects the audit reports and files them. No resources are added, no action is assigned, and the purchasing group keeps cutting piece price while delivery and quality get worse. The audit manager says a filed report is a management review. What is missing?",
    "options": [
      "Accept the file drawer as the management review, keep piece price as the only cost that matters, and add no people or time because of an audit, because senior management may not allocate resources or assign action once the reports have been stored.",
      "Treat a filed report as incomplete until management resources the program and either acts on the findings or states a business reason for leaving the system unchanged, because piece-price cuts that ignore delivery and quality are the interaction the audit should surface.",
      "Call the lead auditor's closing meeting the management review and do not show results to senior management, because action, resources, and the purchasing tradeoff are decided in that meeting and a later review would only repeat the findings.",
      "Require action on every finding within a week, and do not accept a stated business reason for leaving a system unchanged, because due care means every audit conclusion is implemented immediately and purchasing may not weigh delivery against price."
    ],
    "answer": 1,
    "why": "Senior management sets the aim of the system and how each part contributes. That tells the audit program what matters, how to schedule, and how to report so the report produces action. Audits look at the points where parts of the organization meet, including short-term goals that hurt the rest of the system. A purchasing group that drives piece price down and ignores total cost, delivery, quality, or a technical advantage is the example. Management gets unbiased information from supplier audits and from internal audits only if the program is lined up with the organization's objectives, is given enough trained people and time, and if the findings are actually considered and acted on. That is what shows due care. In the review, management may assign people and resources, or, for a financial reason, may choose to leave the system unchanged. The choice has to be made. Filing the report is not the review. Topics include whether the program's objectives were achieved, the results and the impact of risks, the status of corrective and preventive action and what they contributed, organizational risks and controls such as risk-based audits, and recommendations for improvement. Trained auditors who were given access and who produced fair findings have to be given enough credibility that management acts. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 209–210.</span>"
  },
  {
    "qid": "cqa:set-1:b06-23",
    "set": 1,
    "sub": "cqa-mgmt-tool",
    "bok": "IV.B.1",
    "cognitive": "Analyze",
    "stem": "The audit program checks only that procedures exist and are under document control. It does not ask whether they work. Reports are skimmed for the nonconformity count. A procedure that requires a useless extra step stays in force because every audit finds the step being followed. What is the program failing to be?",
    "options": [
      "Use the program as a management tool that tests whether procedures work and whether they should change, because a conformity check that only confirms a useless step is being followed will keep that step in force.",
      "Remain a compliance checker that treats a controlled procedure as effective, because the modern audit stops once the document exists and management should read only the nonconformity count, even when a required step adds work and never helps the process.",
      "Limit the audit to naming the person who followed the procedure, because the useful output is who complied and the program is not a source of facts for strategy or for changing a step that the procedure requires.",
      "Keep the early compliance form, checking only that the procedure exists and is controlled, because asking whether the book should change exceeds the audit's authority and reading the full report is optional."
    ],
    "answer": 0,
    "why": "Early exposure to auditing left a narrow picture: compliance, often in the defense industry after the Second World War, aimed at doing it by the book rather than asking whether the book should change. In the earliest form, the audit did not even check whether the procedure was effective. It checked that the procedure existed and was under document control. People of low competence were sometimes assigned to auditing because the work was thought to accomplish nothing positive. That history gets in the way of using system and process audits as oversight for sustaining and improving the organization. Management has to see the audit as a way to collect facts, provide oversight, and create knowledge. Objectives have to go beyond compliance monitoring and enforcement. The service can run from simple verification, which holds a system at its designed level, out to effectiveness and efficiency and continual improvement. Management decides the strategy first and then uses the facts to support it. Audits also show the interactions between activities. Many organizations do not know those interactions except through the auditor's papers. Management may know the next step in the flow and not know the relationship past the next department. Without that knowledge, redundant and counterproductive actions stay inside the procedures, and a conformity audit perpetuates them. The way out is a process approach, reading the reports in full, and using them to put resources on real improvement. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 212–213.</span>"
  },
  {
    "qid": "cqa:set-1:b06-24",
    "set": 1,
    "sub": "cqa-process-links",
    "bok": "IV.B.2",
    "cognitive": "Understand",
    "stem": "The machining department hits every local target by speeding the machines. Assembly then spends the saving on rework, and the customer sees late deliveries. Each department is audited against its own procedure, and each audit is recorded as successful. What is the system doing?",
    "options": [
      "Score the system as optimized because each department met its own procedure, and keep the audit boundary at the department, because assembly's rework and the customer's late deliveries are downstream events that a successful machining audit is not required to connect.",
      "Treat the late deliveries as outside the system and the assembly rework as a success for machining, because the parts of the system do not depend on each other and speeding the machines fulfilled machining's goal.",
      "Call the result suboptimization, because machining is meeting a local target at the expense of assembly and the customer, and goals have to be meshed by audits that look across departments rather than stopping at each procedure.",
      "Apply interdependence only to suppliers, and treat internal departments as independent by design, because a process view that crosses machining and assembly would blur responsibilities the compliance audit is meant to keep separate."
    ],
    "answer": 2,
    "why": "Deming's picture of a system runs from suppliers, through the operations that transform the inputs, out through distribution to the customer, with feedback from the customer into design and back to suppliers and production. The parts work together and depend on each other. Goals for each part have to be meshed so one part does not thrive at the expense of the others. When that happens, the system as a whole is suboptimized. Compliance-focused auditing created that danger by driving each element hard without looking at the wider picture. Later quality thinking looks at processes that cross organizational boundaries. System audits that look at those relationships blur the smokestack view. A system has to be managed, and managing it requires knowing the components, the relationships among them, and the people who work in them. Machining's local target, paid for by assembly and by the customer, is the failure mode the wider view is meant to catch. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 216.</span>"
  },
  {
    "qid": "cqa:set-1:b06-25",
    "set": 1,
    "sub": "cqa-coq",
    "bok": "IV.B.3",
    "cognitive": "Analyze",
    "stem": "Finance says quality cost is whatever the quality department's budget shows, and that last year's sales growth reduced the cost of poor quality automatically. No one has briefed top management. Scrap, returns, and the cost of the extra inspections are still buried in overhead. What does a cost-of-quality view change?",
    "options": [
      "Report the quality department's budget as the cost of quality and treat last year's sales growth as an automatic reduction in the cost of poor quality, because scrap, returns, and extra inspection can stay buried in overhead and top management does not need a separate briefing.",
      "Count only external failure as a quality cost, and exclude prevention and appraisal, because money spent up front is not part of cost of quality and internal scrap is an operations variance rather than a quality dollar.",
      "Replace the audit program with a cost-of-quality report, and stop once the dollars are known, because the figures are the improvement and there is one standard collection method that every accounting system is expected to use.",
      "Trace prevention, appraisal, and internal and external failure costs that are buried in overhead, and brief top management, because the quality department's budget is not the cost of quality and higher sales do not by themselves cut the cost of poor quality."
    ],
    "answer": 3,
    "why": "Cost of quality puts a dollar figure on quality activities so the larger opportunities are visible and improvement can be aimed at them. Feigenbaum wanted costs, causes, and effects visible, including costs buried in standards and in overhead. Juran argued for measuring quality in the language of upper management, which is dollars. There is no single way to collect the numbers, because accounting systems differ. Anyone can still build a measure that fits the company. By the 1980s the categories were internal failure, external failure, prevention, and appraisal. Several facts follow. Most of the cost is not identified in the financial records. Most organizations do not know what nonquality costs them. Increasing sales does not decrease the cost of nonquality. The useful focus is the cost of poor quality and what it does to finances, competitiveness, customers, and motivation. Because the figures are dollars, the report is one of the better ways to get attention, and the education starts with top management, then can move to people whose work drives the numbers. Crosby argued that it is the absence of quality that raises total cost, so money is spent up front on prevention and appraisal to avoid the failure costs. The four categories are what the accounts have to be able to trace, because the total can often be 20 to 30 percent of sales. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 217–218.</span>"
  },
  {
    "qid": "cqa:set-1:b07-01",
    "set": 1,
    "sub": "cqa-erecords",
    "bok": "IV.A.10",
    "cognitive": "Apply",
    "stem": "The quality manual and the device history records are on the plant's intranet. The lead auditor says electronic files can be trusted once they open, because accuracy and security are paper problems. No one asks who can change a file from outside the plant. What still has to be asked?",
    "options": [
      "Close the accuracy and security questions once the files open, because those checks belong only to paper and a network cannot alter a file the way a pen can. Leave access rights, remote change, signature control, tamper detection, and restoration to information technology after the report is issued.",
      "Limit the audit to whether the quality manual and device history records can be retrieved from the intranet, and treat access rights, remote change, electronic signatures, and tamper detection as a separate cybersecurity review outside this audit plan.",
      "Accept the opened files as accurate and secure, then ask only whether an electronic signature exists somewhere in the record, because a signature by itself proves uniqueness, traceability, and that the file cannot be changed from outside the plant.",
      "Keep asking about accuracy and security for electronic files, because opening a file does not answer those questions. Ask who can change a file remotely, how approval and signatures stay unique and traceable, how tampering is detected, and how the system is restored with little data lost."
    ],
    "answer": 3,
    "why": "Documented information may be any medium that can be recorded, reviewed, and retrieved, including computer files. Two questions apply to all of it, paper or electronic: is it accurate, and is it secure? Electronic information has additional risks. The handbook's list includes access rights, remote alteration through a network, which paper files do not share, how approval is performed, protection of electronic signatures so they stay unique and traceable and are hard to forge, how easily an error or tampering is detected, and how the system is restored with minimal data loss. Opening the file is not the same as answering those questions. The 2026 Body of Knowledge gives this topic its own line. The handbook's treatment is this planning discussion, not a separate cybersecurity manual. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 69 and 72–73.</span>"
  },
  {
    "qid": "cqa:set-1:b07-02",
    "set": 1,
    "sub": "cqa-erecords",
    "bok": "IV.A.10",
    "cognitive": "Apply",
    "stem": "An auditor deletes an old procedure from the auditee's server because the revision looks obsolete, and accepts a typed name in an approval field as a signature. The retention period is thirty years. The files were last readable on equipment the plant no longer owns. What is wrong?",
    "options": [
      "Do not delete the procedure or accept the typed name as a unique signature. Removal needs permission, the real approval control has to be identified, and records of both kinds must stay readable for the whole retention period even after the viewing equipment is gone.",
      "Allow the deletion because an obsolete revision should not remain on the server, accept the typed name as a complete signature because the approval field is filled in, and limit the thirty-year readability rule to paper because electronic files may be dropped when the software changes.",
      "Copy the server onto the auditor's own laptop without asking, because an auditor may remove online files that look obsolete, and treat that personal copy as the retention method so readability no longer depends on equipment the plant owns.",
      "Treat a typed name, an approve button, and a scanned signature as interchangeable controls, delete the file because it looks obsolete, and call the thirty-year record readable because cared-for paper lasts a long time even after the disks and readers are gone."
    ],
    "answer": 0,
    "why": "Auditors protect what they are given against damage, loss, or unauthorized access. They do not remove documents from storage or delete online files without permission, and copies have to be authorized. Approval is not one thing. It may be a name typed into a field, a click on an approve button, or a scanned hand signature, and the auditor has to know which control is actually in use. An electronic signature has to remain unique and traceable so it cannot be forged. Legibility applies to both formats for the entire retention period. Paper that is cared for can be read for a very long time. Electronic files become unreadable when the technology disappears, as with obsolete disks. The auditee has to keep the means to view the records, including spare parts, for as long as the record must be kept. The handbook does not give a full computerized-system standard. These are the controls it does state. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 71–73.</span>"
  },
  {
    "qid": "cqa:set-1:b07-03",
    "set": 1,
    "sub": "cqa-mgmt-tool",
    "bok": "IV.B.1",
    "cognitive": "Analyze",
    "stem": "The audit program produces findings, but auditors are kept out of planning, risks are not in the reports, and corrective action is optional. A manager says auditors add value by writing nonconformities, and that professionalism and confidentiality are personal manners, not part of the value. When does the handbook say an audit adds value?",
    "options": [
      "Value is added when auditors show professionalism, integrity, confidentiality, and discretion, do competent work and keep learning, identify, manage, monitor, and report organizational risks, drive corrective action and continual improvement from findings, and take part in the management team and strategic planning.",
      "Value is added mainly by writing a high nonconformity count, because planning, risk identification, monitoring, and follow-up are separate management duties, and professionalism, integrity, confidentiality, and discretion are personal manners rather than part of what makes an audit valuable to the organization.",
      "Value is added when the auditor recommends the corrective action and then implements it, and when the report names the employees who failed, because improvement and accountability belong to the audit rather than to the auditee.",
      "Value is added when the audit stays out of strategic planning, leaves risk out of the report, and treats corrective action as optional, because a professional auditor's job ends once the nonconformities are written and turned over."
    ],
    "answer": 0,
    "why": "The handbook's tenets say audits add value when the auditors demonstrate professionalism, integrity, confidentiality, and discretion; when competent auditors do the work and keep learning the skill; when organizational risks are identified, managed, monitored, and reported; when the findings produce corrective action and continual improvement; and when the audit function is part of the management team and of strategic planning. A pile of nonconformities, with no action and no place in planning, does not meet that list. Recommending and then installing the corrective action is the auditee's job, not the auditor's, and naming employees is a misuse of the result. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 215.</span>"
  },
  {
    "qid": "cqa:set-1:b07-04",
    "set": 1,
    "sub": "cqa-basic-tools",
    "bok": "V.A",
    "cognitive": "Analyze",
    "stem": "Scrap codes for a month are scattered through a log. One code accounts for most of the scrap, and a handful of rare codes make up the rest. The team plots the codes in the order they occurred and calls the plot a Pareto chart. What should the chart actually do?",
    "options": [
      "Keep the codes in the order they occurred and call that plot a Pareto chart, because time sequence is what reveals the vital few, and put the numerous miscellaneous codes on the left so the rare codes stay visible at the right rather than being ranked by size.",
      "Average the scrap codes and plot them as a histogram of one measurement, because a Pareto chart is not a ranked frequency chart and the largest code should not be given a special place on the left.",
      "Rank the scrap codes so the vital few stand out. Most of the effect comes from relatively few causes, so bars descend with the largest on the left, while a miscellaneous category stays at the far right even when it is not the smallest.",
      "Plot one point for each day of the month and ignore the code frequencies, because a Pareto chart tracks the process over time and is not used to decide which scrap problem to attack first or to check a later solution."
    ],
    "answer": 2,
    "why": "A Pareto chart rests on the idea that most effects come from relatively few causes. The bars descend, with the highest frequency, cost, or other count on the left. The miscellaneous category is the exception: it stays at the far right no matter how large it is. The chart shows each item's contribution to the total and its rank. It is used to decide which problems to attack first and, later, to see whether an implemented solution changed that rank. Time order is a different chart. Averaging the codes throws away the ranking the tool is for. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 224.</span>"
  },
  {
    "qid": "cqa:set-1:b07-05",
    "set": 1,
    "sub": "cqa-dmaic",
    "bok": "V.B.1",
    "cognitive": "Apply",
    "stem": "A Six Sigma team changes the process in the first meeting and writes the charter after the scrap rate falls. No baseline was measured, and no control was put in place to hold the gain. The auditor is asked only to congratulate the team. What does DMAIC require, and what can the auditor verify?",
    "options": [
      "Change the process in the first meeting and write the charter after the scrap falls, because the baseline, the root-cause work, and the later control plan are paperwork that can follow once a gain is already visible to the team.",
      "Require define, then measure, analyze, improve, and control, with a charter and a baseline before any change and with controls that hold the gain. The auditor verifies the benefits that were claimed and whether that program is still being sustained.",
      "Treat DMAIC as a one-person inspection method that does not use a project team, and limit the auditor to congratulating the team because claimed benefits and whether the gain is still sustained are not things an auditor can verify.",
      "Use the control phase to put the process back on the original procedure, leave the gain undocumented, and skip the charter because define is only a customer survey and measure is not required before the team improves the process."
    ],
    "answer": 1,
    "why": "DMAIC is define, measure, analyze, improve, and control. Define is where management prepares the charter: problem, scope, goals, milestones, roles, resources, and time, and where the customer and the issues critical to quality are identified. Measure gathers data and sets a baseline. Analyze uses that data and the process map to find root causes and opportunities. Improve selects solutions and attaches measures so the improvement lasts. Control puts the controls in place, updates the documents, and keeps ongoing measures so the gain is not lost. The phases are normally applied to a project. An auditor can verify the benefits that were claimed, check that the program is still sustained, and feed further improvement. Starting with the change, and skipping the baseline and the control, is not the model. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 250–251.</span>"
  },
  {
    "qid": "cqa:set-1:b07-06",
    "set": 1,
    "sub": "cqa-lean",
    "bok": "V.B.2",
    "cognitive": "Apply",
    "stem": "A manager says lean means cutting headcount, and that a clean workplace is housekeeping, not part of the system. Cycle time is measured from the middle of the process to shipping. What does the handbook treat as lean?",
    "options": [
      "Define lean as a headcount cut, let the manager start cycle time at the middle of the process rather than at the customer's order, and keep Five S outside the system because a clean workplace is housekeeping and not a way to reduce waste.",
      "Define lean as holding a larger inventory so the customer is protected, measure cycle time only at the shipping dock, and treat Five S as optional decoration because inventory that is not yet needed is not waste.",
      "Define lean as the shortest practical cycle time from the customer's order to shipment by eliminating waste that does not add value, including unneeded steps and inventory, and count Five S and visual management as part of that system rather than headcount cuts.",
      "Define lean as buying a faster machine only, treat order-to-shipment time as a sales measure outside the system, and leave visual management out because seeing process status does not help catch an error before it becomes a defect."
    ],
    "answer": 2,
    "why": "Lean, drawn from the Toyota Production System, aims at the shortest practical cycle time. It increases value-added work by eliminating waste and unnecessary steps, reducing inventory, shortening development time, and responding faster while quality stays high. The techniques focus on the time from receiving the customer's order to shipping it. Cycle time is the total time from the first step of a process to the last. Waste is defined against mass-production habit: anything that does not add value. Five S does more than tidy a bench. It builds awareness, sets up serious waste reduction at low cost, breaks barriers, and lets workers control their work environment. Visual management arranges tools, material, and the process so anyone can see the status at a glance and catch an error before it becomes a defect. Cutting headcount is not the definition. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 251 and 255.</span>"
  },
  {
    "qid": "cqa:set-1:b07-07",
    "set": 1,
    "sub": "cqa-central",
    "bok": "V.C.1",
    "cognitive": "Apply",
    "stem": "Five readings are 2, 2, 2, 3, and 40. The team reports the average, 9.8, as the typical result. One extreme reading is pulling that average up. A second data set has every value different. What should be used, and where?",
    "options": [
      "Use the median, which is 2, for the first set because the extreme 40 pulls the mean up, and use the mean when a set is fairly symmetrical. If every value differs, report no mode rather than a mode of zero.",
      "Use the mean for both sets because it is always the typical result even when one extreme reading pulls the average up, and assign the second set a mode of zero because a collection of all different values is defined as having a mode of zero.",
      "Call 40 the mode of the first set because it is the extreme value, treat the median as the arithmetic average, and declare the second set bimodal because two different values are enough to create two modes.",
      "Require a normal distribution before using the median, use the mean because it ignores extreme values, and treat the mode as the middle value of the ordered data whenever the readings are not all the same."
    ],
    "answer": 0,
    "why": "The mean is the sum of the values divided by how many there are. It is the only one of the three that uses every value, and it is the usual measure when the distribution is roughly symmetrical and has no single dominant peak. The median is the middle value after the data are ordered. It reduces the effect of extremes, and it is also used for ranked data that are not measured economically, such as color or appearance. In 2, 2, 2, 3, 40 the middle value is 2, while the mean is pulled up by 40. The mode is the most frequent value. If all values differ, no mode exists. If two values tie for most frequent, the distribution is bimodal. The mode is the choice for a severely skewed set or when two peaks are real. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 267–268.</span>"
  },
  {
    "qid": "cqa:set-1:b07-08",
    "set": 1,
    "sub": "cqa-dispersion",
    "bok": "V.C.2",
    "cognitive": "Apply",
    "stem": "A process is summarized by its average alone. The smallest and largest of eight readings are far apart, and the team says the average is enough because eight points are too many for a range. They also treat the range as the most important measure of variation. What is missing?",
    "options": [
      "Report only the average, because the average already describes the spread, and treat the range as the most important measure of variation for every sample size, including large sets, because the two extreme readings are enough to describe the process.",
      "Report dispersion as well as the average. The range, largest minus smallest, is useful here because there are only eight readings, but the standard deviation is the most important measure of how far the data spread around the center.",
      "Define the standard deviation as the largest reading minus the smallest, define the range as a measure that uses every point, and skip both whenever the average has already been calculated for the eight readings.",
      "Report dispersion only when the mean is zero, ignore the distance between the smallest and largest readings, and treat eight points as too many for either the range or the standard deviation to be calculated."
    ],
    "answer": 1,
    "why": "Dispersion, also called variation, spread, or scatter, is how far the data sit from the central value. Data always scatter around that zone. The range is the simplest measure: maximum minus minimum. Because it uses only two values, it is most useful when the number of observations is small, ten or fewer. Eight readings are inside that limit, so the range is informative, and it is still not the most important measure. The standard deviation is. It measures the extent of the spread around the center. Reporting the average alone does not show whether the process is tight or wandering. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 268.</span>"
  },
  {
    "qid": "cqa:set-1:b07-09",
    "set": 1,
    "sub": "cqa-qual-quant",
    "bok": "V.C.3",
    "cognitive": "Understand",
    "stem": "An auditor has a count of customer complaints and one note that a single complaint became a lawsuit. The count is compared with a limit in the procedure. The lawsuit note is set aside because it happened once and because a story is not objective evidence. What is the distinction?",
    "options": [
      "Accept only the complaint count as audit evidence that can be compared with a limit, set the lawsuit note aside because a single event is never relevant, and treat a qualitative story as something that cannot be objective or shown to be true.",
      "Treat the lawsuit note as quantitative because money and legal exposure are involved, treat the complaint count as a qualitative opinion, and compare the story, not the count, directly with the numerical limit in the procedure.",
      "Average the complaints and call that average the qualitative result, treat individual complaint stories as the quantitative measurement, and drop the lawsuit because importance depends only on how often an event is repeated.",
      "Use the complaint count as quantitative data that can be compared with the procedure limit, and keep the lawsuit note as qualitative evidence that must be verified and judged for whether it bears on the system, even though it happened once."
    ],
    "answer": 3,
    "why": "Quantitative data come from a measurement or a count: defectives removed, complaints, cycles of a press. Acceptability is often a direct comparison with the audit criterion, and the numbers are treated as reliable because they should be free of emotion. Qualitative data are the nature, kind, or attribute of an observation. The handbook's examples include a deposit that was three days late, a wrong paycheck, a contaminated needle, and a reported regulatory violation. Either kind of evidence has to be objective, unbiased, and proved true. Frequency is not the only test of importance. A single event can matter because of what it is. A complaint that became a lawsuit is verified, and the auditor then decides whether it actually bears on the management system. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 270–271.</span>"
  },
  {
    "qid": "cqa:set-1:b07-10",
    "set": 1,
    "sub": "cqa-variation",
    "bok": "V.D.1",
    "cognitive": "Apply",
    "stem": "A stable process has more spread than the customer will accept. The supervisor tells the operators to 'be more careful' and adjusts the process after every small movement. The spread does not shrink. Who can change this kind of variation, and what is the supervisor doing?",
    "options": [
      "Expect the operators to remove this common-cause variation by being more careful, and treat an adjustment after every small movement as proper process control, because the people working in the process, not the managers of it, own a stable spread that is already predictable.",
      "Treat all of the spread as a special cause, keep adjusting the stable process after every point, and leave inputs, equipment, training, and conditions unchanged because a predictable process should be corrected one wiggle at a time.",
      "Leave this common-cause spread to the managers, who reduce it only by changing the process itself, such as inputs, training, equipment, or conditions. Operators cannot remove it by being more careful, and adjusting after every small movement is tampering.",
      "Remove the excess spread by inspecting every piece and leaving the process as it is, because common-cause variation is assignable to individual operators and shrinks when the output is sorted rather than when the system is changed."
    ],
    "answer": 2,
    "why": "Shewhart separated a stable process, with chance variation that can be predicted inside limits, from an unstable process, with assignable-cause variation that cannot. Deming called the two sources common causes and special causes, and he separated the people who work in the process from the managers who work on it. Common-cause variation is always present. It comes from factors fluctuating in their normal way, and it is reduced only by changing a factor: the supplier, the inputs, hiring and training, the equipment, maintenance, or the conditions. Getting rid of those causes is management's job. Workers cannot do it, which is the point of Deming's red-bead experiment. A special cause is the assignable upset that makes the process unstable. Reacting to ordinary movement as if it were a special cause is tampering. The handbook's examples are a manager who changes the target every time the result disappoints, and a portfolio that is traded on every small deviation. The worker is blamed. The system failed. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 278 and 281.</span>"
  },
  {
    "qid": "cqa:set-1:b07-11",
    "set": 1,
    "sub": "cqa-capability",
    "bok": "V.D.2",
    "cognitive": "Understand",
    "stem": "A process is not in statistical control. An engineer reports Cpk of 1.40 and calls the process capable. The same report uses the standard deviation of one grab sample as the sigma in the formula. What is wrong with the claim?",
    "options": [
      "Reject the claim of capability. A Cpk is earned only after the process is in control, and the sigma must be the process sigma from time-ordered data, not the standard deviation of one grab sample.",
      "Accept Cpk of 1.40 as proof the process is capable even though it is unstable, and accept any sigma in the formula, because a result above 1.33 does not depend on statistical control or on time-ordered data.",
      "Treat Cpk as the index that ignores centering, use Cp when both tails must stay inside the limits, and calculate either index on an unstable process because capability does not require the process to be in control.",
      "Call a Cpk below 1.00 capable, reserve the index for an unstable process, and use the standard deviation of a single grab sample because that sample sigma is the process sigma the formula requires."
    ],
    "answer": 0,
    "why": "Process width is the range the process can normally hold, given its design, materials, equipment, people, and steps. Knowing capability means knowing whether a specification can be held if the process is in control. Cp compares the specification width with the process width. Cpk asks whether the process is centered well enough that both tails stay inside the specification, and the reported value is the smaller of the two one-sided results. The rules the handbook gives are Cpk above 1.33 capable, from 1.00 to 1.33 capable with tight control, and below 1.00 not capable. The sigma is the process sigma from time-ordered data, such as R-bar over d2, not the standard deviation of one sample. An unstable process has not earned that index. Ppk is the related index that does take special-cause variation into account, and its bar is higher: above 1.67 is the capable line in the handbook's rule. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 281.</span>"
  },
  {
    "qid": "cqa:set-1:b07-12",
    "set": 1,
    "sub": "cqa-outliers",
    "bok": "V.D.3",
    "cognitive": "Apply",
    "stem": "One point sits far from the rest of a capability study. The technician deletes it so the index looks better, and writes nothing about why. The cause of the point is unknown. The maximum of the sample is also being called an outlier simply because it is the maximum. What is the rule?",
    "options": [
      "Delete every point that sits away from the others, treat the sample maximum as an outlier simply because it is the maximum, and write nothing about the cause because dropping an unknown point to make the capability index look better is an accepted judgment.",
      "Keep every point in the study, including a point whose known cause is the wrong instrument or the wrong bin, because known bad data are never removed and an outlier is ordinary common-cause variation that should be averaged in.",
      "Do not delete the far point just to improve the index. An outlier must look as if it does not belong, the sample maximum is not one automatically, a known cause is verified before removal, and any exclusion is explained in the report.",
      "Investigate the far point only if it is the sample minimum, exclude it without stating a reason when the cause is unknown, and leave a verified wrong-instrument result in the study so the index is not questioned."
    ],
    "answer": 2,
    "why": "An outlier is an observation that is not homogeneous with the rest of the sample. It deviates markedly from the other points. The handbook calls it a special case of a special cause: the wrong test equipment, or a sample pulled from the wrong bin. Left in, it skews the conclusion. The most extreme observations are the sample maximum and minimum, and those extremes are not normally outliers. A point has to be so far out that it does not appear to belong. Deleting it can be the right act, and it is a judgment many scientists distrust because the data can be made to say what the analyst wants. If the cause is known, verify it before removal. When a point is excluded, the reason is stated in the report. An unknown point removed to make an index look better fails both tests. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 282–283.</span>"
  },
  {
    "qid": "cqa:set-1:b07-13",
    "set": 1,
    "sub": "cqa-accept-sampling",
    "bok": "V.E.1",
    "cognitive": "Apply",
    "stem": "An auditor samples procedures against the standard and reports '95 percent confidence' that the manual is adequate. On a separate lot, a sample accepts bad product, and the auditor calls that the producer's risk. What is confused?",
    "options": [
      "Report 95 percent confidence from the sampled procedures, because statistical sampling is how manual adequacy is judged, and call acceptance of bad product the producer's risk because the producer is the party who shipped the lot.",
      "Call the consumer's risk the chance of rejecting good product, estimate whether the manual is adequate from a small random sample, and treat a recall as the harm that comes from alpha rather than from accepting bad product.",
      "Do not attach a sampling confidence to a point-by-point manual review, because that adequacy check is a 100 percent comparison. On the lot, accepting bad product is the consumer's risk, beta, not the producer's risk.",
      "Avoid alpha risk by letting the auditee choose which procedures and which lot units are examined, and treat that chosen sample as the basis for a 95 percent confidence statement about the whole manual and the lot."
    ],
    "answer": 2,
    "why": "Checking a lower-tier document point by point against an upper-tier document is a 100 percent review. The handbook says statistical sampling does not apply to that adequacy check, and it does not apply to judging effectiveness by the auditor's judgment of program results either. Attribute sampling fits a conformity question: the item is satisfactory or it is not. The standards named for that work include ANSI/ASQ Z1.4 for attributes. The moving lot being audited can be thought of as having an acceptable quality level, the work standard the people are trying to meet. Producer's risk, a Type I error, alpha, is the chance of rejecting good product, so the producer suffers. Consumer's risk, a Type II error, beta, is the chance of accepting bad product, so the consumer suffers. A recall is the example given for that second error. Enough samples are taken to reach a chosen confidence, typically 95 or 99 percent, and that confidence costs sampling effort. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 287–288 and 291–292.</span>"
  },
  {
    "qid": "cqa:set-1:b07-14",
    "set": 1,
    "sub": "cqa-sample-terms",
    "bok": "V.E.3",
    "cognitive": "Understand",
    "stem": "An auditor lets the auditee pull the records, draws them from one unusual corner of the file, and reports the defect rate as true of the whole plant. No population size is written down. The report says the sample was statistical because a calculator was used. What has to be true before that claim is valid?",
    "options": [
      "Require a homogeneous population and a random sample that the auditor selects, so every item has an equal chance and probability can support a confidence. Record the population size when known. A calculator, one corner, or an auditee-chosen set is not enough.",
      "Accept the sample as statistical because a calculator was used and the auditee pulled the records, treat one unusual corner of the file as the population, and report that corner's defect rate as true of the whole plant without writing down the population size.",
      "Call any sample statistical once the conclusion is stated as a percentage, skip the population size, and let the auditee choose typical items because random means the auditee knows which records represent the plant.",
      "Treat homogeneous as a reason to hide the bad items in one load, draw the sample from that unusual corner, and still generalize to the plant because a stratum result is automatically valid for the whole population."
    ],
    "answer": 0,
    "why": "Sampling takes selected items from a population. A conclusion about a stratum is not automatically valid for the whole population. Two conditions support a statistical inference: the population is homogeneous, meaning uniform, with the bad items not hidden at the bottom of one load, and the sample is random, meaning every item has an equal chance of being selected. The preferred practice is for the auditor to go to the location and select the sample. The auditee may be allowed to present the population, such as a folder, when distance or off-site files make that reasonable, and the auditor still selects from it. The record shows what was selected, how big the population was when that can be known, and how many items were examined. A method is statistical only when selection is random and probability is used to evaluate the result. That is what lets the report state a confidence instead of 'we think there is a problem.' A calculator does not supply either condition. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 284 and 287.</span>"
  },
  {
    "qid": "cqa:set-1:b07-15",
    "set": 1,
    "sub": "cqa-change-control",
    "bok": "V.F",
    "cognitive": "Understand",
    "stem": "Engineers keep personal copies of the drawing, some printed last year, and they edit those copies when a dimension changes. The server has a newer revision. The auditor is told document control is the same thing as configuration management, and that a computer system makes the discipline unnecessary. What is the difference, and what is the finding?",
    "options": [
      "Treat document control and configuration management as the same activity, accept last year's personal copy as controlled when the engineer remembers the dimension change, and conclude that having the newer revision on the server makes the discipline of following the system unnecessary.",
      "Limit document control to paper drawings, treat every electronic file as uncontrolled by definition, and require no record of the dimension change because configuration management is only the distribution list for the latest server file.",
      "Treat configuration management as keeping the defining procedures, specifications, and drawings documented, traceable, and current, and document control as one part of that. The finding is people editing obsolete personal copies, not a missing computer system.",
      "Close the finding because one controlled copy online ends the problem of obsolete downloads, and allow engineers to edit personal copies as long as the server still holds some newer revision of the drawing."
    ],
    "answer": 2,
    "why": "Change has to be controlled so unnecessary risk is avoided. The configuration is the collection of procedures, specifications, and drawings that define how the product or service is provided. Configuration management is the oversight that keeps that definition documented, traceable, and current across its life. It can include planning, identification, change control, history, archiving, and auditing. Document control is one aspect: internally and externally generated documents are identified and controlled so the information people use is correct, complete, current, and consistent. Technology changed the mechanics. Many organizations keep one controlled copy on a shared drive or a page, and treat a printed copy as uncontrolled, sometimes obsolete the day after it is printed. The elements of control are still the same once the technology is set aside. Auditors still find downloads in personal directories, obsolete versions in use, and unauthorized edits. The handbook's point is that the failure is not the software. It is people not following the system. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 297–298.</span>"
  },
  {
    "qid": "cqa:set-1:b07-16",
    "set": 1,
    "sub": "cqa-ver-val",
    "bok": "V.G",
    "cognitive": "Analyze",
    "stem": "The device history shows the test in the specification was done and passed. No one has run the device the way the customer uses it, and the auditor calls the record review a validation because the record exists. A routine in-process check by the operator is also being called the auditor's verification. What is each activity?",
    "options": [
      "Call the passed test record verification, because it shows the output met the requirement, and call running the device as the customer uses it validation. The operator's routine check is in-process inspection, not the auditor's independent verification.",
      "Call the existing test record a validation because a passed record is enough, call the operator's routine in-process check the auditor's verification, and treat running the device the way the customer uses it as neither verification nor validation.",
      "Treat validation as a document review that is finished once a record exists, make verification optional after that record is found, and use the ordinary dictionary rather than the audit meanings of the two words.",
      "Treat verification and validation as the same activity, accept the operator's in-process check as the independent audit verification, and skip any observation of intended use because a passed specification test already covers both."
    ],
    "answer": 0,
    "why": "In audit use, verification is checking or testing that the output met the requirement, and validation is the product or service actually performing its intended function. The ordinary dictionary does not draw that line. The distinction used in management-system auditing came through FDA practice and into ISO 9000. The handbook's techniques are: verify by examining records, documents, or interviews, and validate by observing or using the product, service, or process. Verification is independent of the normal operation. The auditor's check that the process or product conforms is verification. The operator's routine inspection is not. The most common verification is reading the documents and records, which show that the activity was performed and what resulted. ISO 9000 also lists alternative calculations, comparison with a proven design, tests and demonstrations, and review of documents before issue. Calling a record review a validation, or calling the operator's own check the audit verification, swaps those meanings. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 301.</span>"
  },
  {
    "qid": "cqa:set-1:b07-17",
    "set": 1,
    "sub": "cqa-risk-tools",
    "bok": "V.H",
    "cognitive": "Understand",
    "stem": "A team fills out a process FMEA before the process exists, treats incoming parts as the failure mode, and uses the form because the procedure says to complete it. Scores differ from another team's scores on the same process, and the first team changes numbers until they match. A design FMEA is being written to invent the design requirements. What is the tool for?",
    "options": [
      "Use the design FMEA to invent the design requirements before a design exists, use the process FMEA to inspect incoming parts as the failure mode, and change the scores until both teams match, because the completed form itself is the analysis.",
      "Use FMEA as an engineering analysis that reduces failure risk, not as a form to check off. Analyze a design only after that design exists, look at the current process rather than incoming defects, and do not change scores so teams match.",
      "Use a design FMEA in place of the design review, start the process FMEA before any process exists, and discard the lower team score, because failure mode analysis is objective and the form is complete once the numbers match.",
      "Fill out the process FMEA before any process exists, treat incoming defects as the failure mode of that step, and force the two teams onto the same numbers, because the procedure's demand to complete the form is the real purpose of the tool itself."
    ],
    "answer": 1,
    "why": "FMEA analyzes a design or a process for potential failure so the risk of failure can be reduced. The design FMEA looks at potential design failures. The process FMEA looks at potential failures of the production process. A design FMEA is done after the design exists. It assesses fitness for use. It is not a method for creating the design requirements. A process FMEA is not a way of dealing with defective incoming components. It assumes the parts arriving at the step are not defective and looks at the risk in that step. The scoring is not completely objective. Different teams can assess the same product or process differently, so changing numbers until they match is not the method. The handbook also notes the legal exposure: if failures were understood beforehand and insufficient action was taken, the FMEA itself can become evidence. The form is not a box to check. It is an engineering analysis, and it depends on people who have actually designed, built, and serviced the product. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 304 and 307.</span>"
  }
  ];
})(typeof window !== 'undefined' ? window : this);
