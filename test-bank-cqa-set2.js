/*
 * ASQ CQA Exam Set 2 — original practice questions.
 * Batches 1–2: Q001–Q020. Planned bank: 150 questions.
 * Author in reviewed batches of 10; hold PR #368 until all 150 are ready.
 * 2026 BoK target counts: I 37 / II 45 / III 30 / IV 23 / V 15.
 * Batch 1 counts: I 2 / II 3 / III 2 / IV 2 / V 1.
 * Batch 2 counts: I 3 / II 3 / III 2 / IV 1 / V 1.
 * Questions and exhibits are original; handbook citations use printed pages.
 * UpSkill Sprint is not affiliated with ASQ. This is not an official ASQ exam.
 */
(function (global) {
  'use strict';
  global.CQA_SET2 = [
  {
    "qid": "cqa:set-2:q001",
    "set": 2,
    "batch": 1,
    "sub": "cqa-criteria",
    "bok": "I.C",
    "cognitive": "Analyze",
    "stem": "A signed quality agreement requires customer approval before pressure testing is subcontracted. The customer's written deviation D17 permits subcontracting only lot L202 to Lab Z. The supplier's internal procedure permits its quality manager to authorize subcontracting, and the manager uses that procedure to send lot L203 to Lab Z. No other customer approval exists. Which interpretation of the audit criteria is correct?",
    "options": [
      "D17 approves Lab Z as a subcontractor, so its permission also covers L203 when the same test method is used.",
      "The internal procedure controls L203 because the quality manager has followed the supplier's documented authorization process.",
      "Both documents apply, but the auditor should accept whichever authorization process imposes the lower operational burden.",
      "The quality agreement still requires customer approval for L203; neither D17 nor the manager's internal authorization supplies it."
    ],
    "answer": 3,
    "why": "The auditor must interpret the scope of each applicable requirement. The signed agreement requires customer approval, while D17 changes that requirement only for the identified lot, L202. It does not grant general approval to use Lab Z. The internal procedure can specify the supplier's own approval responsibilities, but nothing in this case allows that procedure or its quality manager to waive the customer's requirement. Lot L203 therefore remains subject to the agreement's customer-approval condition. The audit evidence supports an authorization gap; it does not establish that Lab Z's testing was technically defective. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 20–22.</span>",
    "keyPoint": "Interpret an exception within its stated boundaries and evaluate all applicable criteria.",
    "trap": "Treating permission for one lot as blanket approval for the subcontractor.",
    "distractors": {
      "0": "This expands a lot-specific deviation into a general laboratory approval. D17 explicitly identifies L202 only.",
      "1": "Conformity with an internal procedure does not fulfill a separate customer-approval requirement when the agreement grants no delegation.",
      "2": "Operational convenience does not authorize an auditor to choose between applicable obligations or waive the customer's condition."
    }
  },
  {
    "qid": "cqa:set-2:q002",
    "set": 2,
    "batch": 1,
    "sub": "cqa-ethics",
    "bok": "I.E.1",
    "cognitive": "Apply",
    "stem": "After a supplier audit, an auditor prepares a presentation for an external professional meeting. The draft removes the supplier's name but includes its unpublished process recipe and a photograph showing distinctive production equipment. Permission to disclose either item has not been obtained. Which action best meets the auditor's confidentiality obligation?",
    "options": [
      "Present the material after removing dates and location labels, since the supplier's name has already been removed.",
      "Replace the material with a generic example that reveals no proprietary information and does not identify the supplier.",
      "Present the material only to certified auditors and ask the audience not to circulate the slides outside the meeting.",
      "Retain the recipe, replace the equipment photograph, and state that the information came from an unnamed audit."
    ],
    "answer": 1,
    "why": "Sharing professional experience does not remove the obligation to protect proprietary information. A suitable generic example must avoid both disclosure of the confidential process and identification of the auditee. Removing a company name, dates, or a photograph would not make an unpublished recipe suitable for disclosure. Audience credentials and an informal request not to circulate slides also do not provide the supplier's authorization. Replacing the draft with a genuinely generic example allows the auditor to teach the principle while respecting confidentiality. If actual confidential material were essential, disclosure would first require authorization from the appropriate information owner under the applicable arrangements. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 32–33.</span>",
    "keyPoint": "A generic learning example must protect both the auditee's identity and its proprietary information.",
    "trap": "Assuming that removing the company name makes confidential technical information safe to share.",
    "distractors": {
      "0": "Removing identifiers does not remove the proprietary recipe, and distinctive equipment may still identify the supplier.",
      "2": "Certification does not give audience members a right to receive a supplier's confidential information; a circulation request supplies no disclosure authority.",
      "3": "An unpublished process recipe remains proprietary even when its source is unnamed and the photograph is removed."
    }
  },
  {
    "qid": "cqa:set-2:q003",
    "set": 2,
    "batch": 1,
    "sub": "cqa-planning",
    "bok": "II.A.1",
    "cognitive": "Evaluate",
    "stem": "A draft audit schedule runs from 09:00 to 14:30 with three qualified auditors. Required fieldwork totals 12 auditor-hours and can be divided evenly among them without dependencies. Opening, team, and closing meetings total 1.5 elapsed hours and require all three auditors. A common 30-minute break is also required. These activities cannot overlap; travel and preparation are already accounted for. Which assessment of the schedule is correct?",
    "options": [
      "Approve the schedule: 16.5 available auditor-hours exceed the 14 hours obtained by adding fieldwork, meetings, and the break.",
      "Approve the schedule: four hours of parallel fieldwork plus 1.5 hours of meetings fit, with breaks covered by the parallel assignments.",
      "Extend to 15:00: four hours of parallel fieldwork, 1.5 hours of shared meetings, and the break require six elapsed hours.",
      "Extend to 16:00: add three individual 30-minute break allowances to four hours of parallel fieldwork and 1.5 hours of shared meetings."
    ],
    "answer": 2,
    "why": "The available fieldwork can be performed in parallel: 12 auditor-hours divided by three auditors equals four elapsed hours. Shared meetings take 1.5 elapsed hours because all auditors attend, and the common break takes another 0.5 elapsed hour. The required duration is therefore 4 + 1.5 + 0.5 = 6 hours, ending at 15:00. The proposed 5.5-hour window is short by 30 minutes. The same result follows in labor terms: 12 fieldwork hours + 4.5 meeting hours + 1.5 break hours = 18 auditor-hours, against 16.5 available. Only independent tasks can be accelerated by dividing them among auditors. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 63–64.</span>",
    "keyPoint": "Separate auditor-hours from elapsed time when scheduling parallel work and activities attended by the whole team.",
    "trap": "Confusing auditor-hours with elapsed time, especially for shared meetings and concurrent breaks.",
    "distractors": {
      "0": "This mixes fieldwork measured in auditor-hours with meetings and a break measured in elapsed hours. Shared activities consume all three auditors' time.",
      "1": "The four hours of parallel fieldwork already consume each auditor's working time. The common break must be scheduled separately under the stated constraints.",
      "3": "The auditors take the break concurrently, so it adds 30 elapsed minutes, not three sequential 30-minute allowances."
    }
  },
  {
    "qid": "cqa:set-2:q004",
    "set": 2,
    "batch": 1,
    "sub": "cqa-data-analysis",
    "bok": "II.B.4",
    "cognitive": "Evaluate",
    "stem": "Release-control case. Procedure RQ-04, section 6, requires either completed test results plus normal Quality release, or a written customer concession approved by Quality, before dispatch. The exhibit shows four sampled shipments from one day; all times use the same clock. The auditor has verified the records and confirmed that no additional authorizations exist. Before deciding whether any release-control failure is isolated or recurring, which additional audit work would provide the most useful evidence?",
    "options": [
      "Compare dispatch and authorization records for additional shipments across relevant shifts and users, and examine how premature dispatch is controlled.",
      "Review older versions of RQ-04 and count the changes to section 6, using revision frequency to judge the current control's consistency.",
      "Observe the next shipment handled by the same clerk, using that transaction as the basis for deciding whether the problem recurs.",
      "Review the final test results for these four lots, using their eventual acceptance to determine whether release authorization was effective."
    ],
    "answer": 0,
    "why": "The verified sample identifies a timing failure for A19: dispatch occurred before normal release and no approved concession existed. The sample does not yet establish the extent or cause. Additional transactions from relevant shifts and users, together with examination of the dispatch control, can show whether the condition is isolated, recurring, or supported by a broader control weakness. A18 must be distinguished from A19 because its approved concession existed before dispatch. Revision counts, one selected observation, and eventual product acceptance do not adequately establish the reach of the authorization problem. Further sampling still requires a stated basis and appropriate limits on any population conclusion. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 104–105, 107.</span>",
    "keyPoint": "Investigate the extent and operation of a control before generalizing from an observed failure.",
    "trap": "Treating an eventual acceptable product result as evidence that the earlier release decision complied.",
    "distractors": {
      "1": "Revision history may provide context, but the number of revisions does not show how consistently authorization controlled actual dispatches.",
      "2": "A single subsequent transaction can add evidence, but it gives a weak basis for judging recurrence across the relevant operation.",
      "3": "Product acceptance after dispatch does not demonstrate that the required authorization existed when the shipment left."
    },
    "chart": {
      "type": "data-table",
      "title": "Release-control records — RQ-04",
      "columns": [
        "Lot",
        "Test results available",
        "Normal Quality release",
        "Dispatch",
        "Customer concession"
      ],
      "rows": [
        [
          "A17",
          "08:10",
          "08:25",
          "08:40",
          "None"
        ],
        [
          "A18",
          "11:20",
          "11:30",
          "10:50",
          "C6: customer and Quality approvals complete at 10:15"
        ],
        [
          "A19",
          "09:55",
          "10:10",
          "09:40",
          "None"
        ],
        [
          "A20",
          "13:45",
          "13:50",
          "14:00",
          "None"
        ]
      ]
    },
    "caseId": "cqa-set2-release-control-01"
  },
  {
    "qid": "cqa:set-2:q005",
    "set": 2,
    "batch": 1,
    "sub": "cqa-reporting",
    "bok": "II.C.1",
    "cognitive": "Evaluate",
    "stem": "Release-control case. Procedure RQ-04, section 6, requires either completed test results plus normal Quality release, or a written customer concession approved by Quality, before dispatch. The exhibit shows four sampled shipments from one day; all times use the same clock. The auditor has verified the records and confirmed that no additional authorizations exist. Which finding statement most accurately combines the applicable requirement, evidence, and gap?",
    "options": [
      "RQ-04 section 6 was not met for A18 and A19: both were dispatched before normal Quality release, demonstrating two unauthorized shipments in the sample.",
      "RQ-04 section 6 was not met for A19: dispatch at 09:40 preceded test results at 09:55 and Quality release at 10:10, with no approved concession.",
      "RQ-04 section 6 was not met for A19: dispatch at 09:40 preceded Quality release at 10:10 because the shipping clerk had not been adequately trained.",
      "RQ-04 section 6 was not met for A19: the shipment preceded Quality release, establishing that 25% of the supplier's total shipments are unauthorized."
    ],
    "answer": 1,
    "why": "A useful finding identifies the criterion, traceable evidence, and the precise way the requirement was not met. For A19, the dispatch record shows 09:40, while the results and normal release occurred later, and the auditor confirmed that no alternative authorization existed. Those facts demonstrate the stated release-control failure. A18 followed the permitted concession route, so it cannot be counted as an unauthorized shipment merely because normal release occurred later. Nothing establishes deficient training as the cause, and four sampled shipments from one day do not establish the unauthorized-shipment rate for the supplier's entire operation. The finding should preserve those limits while clearly documenting the confirmed gap. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 107, 110, 122.</span>",
    "keyPoint": "Write a finding that connects a specific requirement to verified evidence without inventing a cause or overstating extent.",
    "trap": "Adding a plausible root cause or a population defect rate that the audit evidence does not establish.",
    "distractors": {
      "0": "A18 had both required concession approvals before dispatch. The option ignores a release route expressly permitted by the criterion.",
      "2": "The timestamps establish the failure but do not establish its cause. Inadequate training would require additional evidence.",
      "3": "One of four sampled shipments is 25% of this sample; the stated sampling information does not justify applying that rate to all shipments."
    },
    "chart": {
      "type": "data-table",
      "title": "Release-control records — RQ-04",
      "columns": [
        "Lot",
        "Test results available",
        "Normal Quality release",
        "Dispatch",
        "Customer concession"
      ],
      "rows": [
        [
          "A17",
          "08:10",
          "08:25",
          "08:40",
          "None"
        ],
        [
          "A18",
          "11:20",
          "11:30",
          "10:50",
          "C6: customer and Quality approvals complete at 10:15"
        ],
        [
          "A19",
          "09:55",
          "10:10",
          "09:40",
          "None"
        ],
        [
          "A20",
          "13:45",
          "13:50",
          "14:00",
          "None"
        ]
      ]
    },
    "caseId": "cqa-set2-release-control-01"
  },
  {
    "qid": "cqa:set-2:q006",
    "set": 2,
    "batch": 1,
    "sub": "cqa-onsite-resources",
    "bok": "III.B",
    "cognitive": "Apply",
    "stem": "During an audit of an equipment-maintenance provider, one auditor finds conflicting release signoffs and needs more time to trace the release controls. Another auditor has completed the planned low-risk assignments and is competent to audit those controls. The issue is within scope, the required personnel are available, and 90 minutes remain before the reserved closing-preparation period. What should the lead auditor do?",
    "options": [
      "Keep the original assignments and describe the uncertainty in the report, since the agreed daily schedule should remain fixed.",
      "Coordinate a reassignment to trace the release controls, update affected auditee contacts, and retain time to consolidate the evidence.",
      "Defer the release-control issue to a separate follow-up audit and use the available time to repeat completed low-risk checks.",
      "Have the available auditor arrange additional release interviews independently, and advise the auditee of the reassignment at closing."
    ],
    "answer": 1,
    "why": "The lead auditor should adapt assignments when emerging evidence requires additional attention. Here, a competent auditor, relevant personnel, and time are available, and the investigation remains within the agreed scope. A coordinated reassignment uses those resources to resolve the evidence gap while keeping the auditee informed. The lead should also protect time for the team to consolidate evidence and prepare supported conclusions before closing. A daily schedule guides the work but can be revised with appropriate communication; it does not require the team to leave a significant unresolved issue unexplored. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 152–153.</span>",
    "keyPoint": "Adapt in-scope assignments to emerging evidence, coordinate the change, and protect time to consolidate conclusions.",
    "trap": "Confusing adherence to a planned schedule with a prohibition on coordinated reassignment.",
    "distractors": {
      "0": "This treats the daily schedule as unchangeable. The available time and competence allow a coordinated investigation rather than accepting an avoidable evidence gap.",
      "2": "A later audit may be necessary when evidence or resources cannot be obtained, but those constraints are absent here. Repeating completed low-risk work is a weaker use of the remaining resources.",
      "3": "The additional work is justified, but arranging new interviews without timely coordination can disrupt auditee commitments. Closing is too late to communicate a schedule change that has already occurred."
    }
  },
  {
    "qid": "cqa:set-2:q007",
    "set": 2,
    "batch": 1,
    "sub": "cqa-communication",
    "bok": "III.D",
    "cognitive": "Evaluate",
    "stem": "At a closing meeting, an operations director asks how the findings could affect on-time delivery. Two process owners want to understand the evidence supporting their findings and what follow-up is expected. Twenty minutes remain, and all attendees can access the approved report repository. Which communication approach best meets these needs and checks understanding?",
    "options": [
      "Present the complete record-by-record evidence trail to everyone, then invite questions if the remaining meeting time permits.",
      "Send the complete report through the approved repository and treat each attendee's read receipt as confirmation that the findings were understood.",
      "Present the delivery risks to the director and have the director confirm understanding and responsibilities on behalf of both process owners.",
      "Summarize impacts and expected follow-up, link each finding to its supporting evidence, and ask the process owners to explain their responsibilities."
    ],
    "answer": 3,
    "why": "Effective audit communication adapts the level of detail to the audience, preserves access to the factual basis, and checks whether the message was understood. A concise explanation of the delivery implications addresses the director's needs, while traceable supporting evidence and explicit follow-up address the process owners' needs. Asking the owners to explain their responsibilities provides feedback that can reveal misunderstandings before the meeting ends. The report remains the detailed written record; receipt of that record alone does not demonstrate understanding. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 159, 165.</span>",
    "keyPoint": "Tailor the message to each audience and obtain feedback that demonstrates understanding.",
    "trap": "Mistaking delivery of a complete report, or agreement from one senior attendee, for understanding by everyone who must act.",
    "distractors": {
      "0": "A complete chronological evidence recital may consume the limited meeting time without making the operational implications clear. Leaving questions until time permits also weakens the check of understanding.",
      "1": "The approved repository is an appropriate delivery channel, but a read receipt demonstrates access or receipt, not comprehension of the findings or follow-up responsibilities.",
      "2": "The director needs the operational implications, but confirmation from the director alone does not establish that the process owners understand their evidence and responsibilities."
    }
  },
  {
    "qid": "cqa:set-2:q008",
    "set": 2,
    "batch": 1,
    "sub": "cqa-auditor-development",
    "bok": "IV.A.3",
    "cognitive": "Evaluate",
    "stem": "An auditor correctly interprets requirements in written case exercises and prepares accurate, clear reports. In two witnessed audits, however, the auditor accepts the first interview answer and does not probe when records conflict with it. The program manager has four weeks before the auditor's next independent assignment. Which development plan best addresses the demonstrated gap?",
    "options": [
      "Practice evidence-based follow-up questions with a coach, then evaluate witnessed interviews against stated performance criteria.",
      "Repeat the auditing-standard course, then require a higher written-examination score before restoring independent assignments.",
      "Have the auditor observe two experienced leads, then requalify the auditor from the observer's written summaries.",
      "Assign additional independent audits, then assess the final reports for completeness before renewing the auditor's qualification."
    ],
    "answer": 0,
    "why": "The available evidence identifies an interviewing and evidence-gathering skill gap rather than a deficiency in interpreting requirements or writing reports. Coached practice targets that gap, and witnessed interviews test whether the auditor can apply the skill in practice. The evaluation should use clear, communicated criteria, provide feedback, and guide the decision about independent assignment. Observation, reading, and coursework can support development, but the selected plan also requires a demonstration of the specific competence that was missing. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 181–182, 184–185.</span>",
    "keyPoint": "Match development and evaluation methods to the demonstrated competence gap.",
    "trap": "Using a knowledge test or a polished deliverable as a substitute for observing an interpersonal audit skill.",
    "distractors": {
      "1": "Additional standards instruction and a written examination primarily assess knowledge. The auditor has already demonstrated that knowledge; a higher exam score would not establish improved probing during interviews.",
      "2": "Watching experienced leads can be useful, but written summaries show what the auditor noticed rather than whether the auditor can conduct an effective interview. The plan needs an observed demonstration of the skill.",
      "3": "More independent assignments provide experience without the targeted coaching needed here. Complete reports can still omit contradictory evidence that was never pursued, so report review alone does not resolve the observed gap."
    }
  },
  {
    "qid": "cqa:set-2:q009",
    "set": 2,
    "batch": 1,
    "sub": "cqa-coq",
    "bok": "IV.B.3",
    "cognitive": "Analyze",
    "stem": "An auditor is reviewing the quality-cost comparison below. The two quarters have the same output volume, product mix, and cost-capture rules. The organization defines cost of poor quality (COPQ) as internal plus external failure costs; total cost of quality (COQ) includes all four categories. What change is supported by these data? The table reports costs in thousands of dollars.",
    "options": [
      "COPQ decreased by $60,000, and total COQ decreased by $60,000.",
      "COPQ decreased by $105,000, and total COQ decreased by $105,000.",
      "COPQ decreased by $105,000, and total COQ decreased by $60,000.",
      "COPQ decreased by $105,000, and total COQ increased by $45,000."
    ],
    "answer": 2,
    "why": "Using the organization's stated boundary, COPQ was $150,000 + $100,000 = $250,000 in the first quarter and $90,000 + $55,000 = $145,000 in the second, a decrease of $105,000. Total COQ was $30,000 + $70,000 + $150,000 + $100,000 = $350,000 and then $60,000 + $85,000 + $90,000 + $55,000 = $290,000, a decrease of $60,000. Prevention and appraisal together increased by $45,000, which partly offsets the reduction in failure costs when calculating total COQ. The comparison establishes the changes in recorded costs; it does not, by itself, prove that the increased prevention or appraisal spending caused the failure-cost reduction. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 217–218.</span>",
    "keyPoint": "Use the stated cost boundaries and include all four categories when calculating total COQ.",
    "trap": "Reporting the gross reduction in failure costs as the net reduction in total quality costs.",
    "distractors": {
      "0": "The $60,000 reduction is the change in total COQ. Applying it to COPQ improperly includes prevention and appraisal despite the organization's explicit failure-cost-only definition.",
      "1": "The $105,000 reduction is correct for COPQ, but applying the same reduction to total COQ ignores the $45,000 increase in prevention and appraisal costs.",
      "3": "The $45,000 increase covers only prevention and appraisal. Total COQ also includes the $105,000 decrease in failure costs, leaving a net decrease of $60,000."
    },
    "chart": {
      "type": "data-table",
      "title": "Comparable quarterly quality costs ($000)",
      "columns": [
        "Category",
        "Quarter 1",
        "Quarter 2"
      ],
      "rows": [
        [
          "Prevention",
          30,
          60
        ],
        [
          "Appraisal",
          70,
          85
        ],
        [
          "Internal failure",
          150,
          90
        ],
        [
          "External failure",
          100,
          55
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q010",
    "set": 2,
    "batch": 1,
    "sub": "cqa-basic-tools",
    "bok": "V.A",
    "cognitive": "Analyze",
    "stem": "A filling process uses rational subgroups of five containers. Valid limits established from a stable baseline are 49.70–50.30 g for the X-bar chart and 0–1.10 g for the R chart. The four latest subgroups are shown below. All 20 individual weights meet the 49–51 g product specification. The reaction plan requires investigation of any point beyond a control limit. What conclusion should the auditor draw?",
    "options": [
      "The process remains stable because all individual weights meet specifications and all subgroup ranges remain within their control limits.",
      "The subgroup means signal a change in process location; the reaction plan applies even though the R chart has no signal.",
      "The within-subgroup spread has increased; two averages above their upper control limit identify a change in process variability.",
      "The limits should be recalculated from these four subgroups because conforming individual weights show that the existing limits are unsuitable."
    ],
    "answer": 1,
    "why": "The means for subgroups 3 and 4 exceed the X-bar upper control limit of 50.30 g. Under the stated rule, those points signal a change in process location and require investigation through the reaction plan. All four ranges are within the R-chart limits, so these results do not show a corresponding range-chart signal. Product specifications and statistical control limits answer different questions: the observed individual weights can conform while the process exhibits an instability signal. Recalculating limits merely to include the new results would conceal the signal rather than investigate its cause. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 232–234.</span>",
    "keyPoint": "Interpret the average and range charts separately, then assess them together; specification conformity does not cancel a control-chart signal.",
    "trap": "Treating acceptable subgroup ranges or conforming products as proof that the process mean is stable.",
    "distractors": {
      "0": "Conforming individual results and an R chart without a signal do not cancel the two X-bar signals. The process cannot be declared stable from these results.",
      "2": "The X-bar chart monitors subgroup averages, while the R chart monitors within-subgroup spread. The observed signals concern location, not a demonstrated increase in spread.",
      "3": "The stem establishes valid baseline limits. A few new conforming observations do not justify replacing those limits; the specified reaction is to investigate the signals."
    },
    "chart": {
      "type": "data-table",
      "title": "Latest subgroup results (g)",
      "columns": [
        "Subgroup",
        "Mean (X-bar)",
        "Range (R)"
      ],
      "rows": [
        [
          1,
          "50.00",
          "0.60"
        ],
        [
          2,
          "50.10",
          "0.65"
        ],
        [
          3,
          "50.40",
          "0.62"
        ],
        [
          4,
          "50.45",
          "0.64"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q011",
    "set": 2,
    "batch": 2,
    "sub": "cqa-types",
    "bok": "I.A.2",
    "cognitive": "Analyze",
    "stem": "A customer appoints a consulting firm to audit a supplier against the customer's purchase requirements. The findings will support the customer's supplier-approval decision. Under the commercial agreement, the supplier reimburses the consulting fee. Only the consulting firm supplies auditors for this engagement. Which classification and reason are correct?",
    "options": [
      "First-party, because the supplier reimburses the consulting fee and is therefore commissioning an audit of its own operations.",
      "Third-party, because the work is performed by an independent consulting firm rather than by employees of the customer.",
      "Second-party, because the consultant is acting for the customer in evaluating its supplier against the customer's purchase requirements.",
      "Joint audit, because the customer commissions the work while the supplier participates by reimbursing the consulting firm's fee."
    ],
    "answer": 2,
    "why": "The relevant relationship is between the customer commissioning the evaluation and the supplier being evaluated. A customer may conduct a second-party audit through its own staff or through a contracted auditing organization. The reimbursement arrangement does not change whose audit the consultant is performing. The use of an external professional also does not make this a third-party engagement: the consultant is expressly acting for one party in the customer-supplier relationship. A joint audit involves two or more auditing organizations; sharing the commercial arrangements does not make the customer and supplier additional auditing organizations. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 2, 6, 23.</span>",
    "keyPoint": "Classify the audit by the relationship and purpose of the engagement, including whose interests the contracted auditor represents.",
    "trap": "Using the auditor's employment status or the fee payer as a substitute for the commissioning relationship.",
    "distractors": {
      "0": "The customer appointed the consultant for a supplier-approval decision. Reimbursing its cost does not turn that assignment into the supplier's internal audit.",
      "1": "An external consulting firm can perform a second-party audit on a customer's behalf. Being outside the customer's payroll does not establish independence from the customer-supplier relationship.",
      "3": "Only the consulting firm supplies auditors for the engagement. The customer and supplier performing different commercial roles does not make them additional auditing organizations."
    }
  },
  {
    "qid": "cqa:set-2:q012",
    "set": 2,
    "batch": 2,
    "sub": "cqa-scope",
    "bok": "I.B.1",
    "cognitive": "Apply",
    "stem": "Management requests an audit of how effectively warranty-claim controls met a ten-day turnaround requirement during the last quarter. The period runs from claim receipt to communication of the disposition. Two service centers receive claims and notify customers; a central technical group makes the disposition decisions. Which proposed scope best supports this purpose?",
    "options": [
      "Last quarter's claims at both service centers, covering receipt, central technical review, and communication of the disposition, including the handoffs between those activities.",
      "All activities at both service centers last quarter, including staffing, equipment maintenance, financial reporting, and facilities management, to assess the service centers' overall operations.",
      "Technical reviews completed by the central group last quarter for both service centers, beginning when a review is assigned and ending when its decision is recorded.",
      "Claim receipt and customer-notification activities at both service centers last quarter, with central technical review excluded because it belongs to a separate organizational unit."
    ],
    "answer": 0,
    "why": "The purpose concerns the effectiveness of controls over the complete ten-day claim-handling interval. The scope should therefore include both service centers, the central review activity, the interfaces between them, and the stated period. Limiting the audit to one stage or excluding an involved unit would omit controls that can affect the outcome. Conversely, adding unrelated service-center activities expands the scope without supporting the defined purpose. The correct scope follows the relevant process across organizational boundaries while retaining the client's time period and objective. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 15, 17.</span>",
    "keyPoint": "Set locations, processes, interfaces, and time boundaries so the audit can answer its stated purpose.",
    "trap": "Treating department boundaries as audit boundaries when the objective depends on a process crossing those departments.",
    "distractors": {
      "1": "This shifts the focus to overall service-center operations and does not identify the complete claim-handling process, including the central technical review.",
      "2": "This covers only the central review interval. It omits the receipt-to-review and decision-to-notification activities included in the ten-day requirement.",
      "3": "Central technical review is part of the process whose controls are being evaluated. Its separate reporting structure does not justify excluding it from this purpose."
    }
  },
  {
    "qid": "cqa:set-2:q013",
    "set": 2,
    "batch": 2,
    "sub": "cqa-roles",
    "bok": "I.D",
    "cognitive": "Apply",
    "stem": "For a three-person supplier audit, the client has approved the purpose and scope, the program manager has appointed a lead auditor, and the supplier has named a coordinator. During planning, the coordinator offers to assign each auditor's work and decide which observations enter the report. Which division of responsibilities is appropriate?",
    "options": [
      "The supplier coordinator assigns the auditors' work using local process knowledge; the auditors gather evidence, and the lead auditor reviews the observations selected by the coordinator.",
      "The client directs the auditors' daily work and selects report observations; the lead auditor arranges access, while the supplier coordinator checks the team's conclusions.",
      "Each auditor independently arranges a schedule and reports directly to the client; the supplier coordinator resolves differences, while the lead auditor provides administrative support.",
      "The lead auditor directs the team and prepares the report; auditors collect and assess evidence, while the supplier coordinator arranges contacts, access, and logistical support."
    ],
    "answer": 3,
    "why": "The appointed lead auditor manages the audit, directs the team, and prepares the final report using team input. Individual auditors gather and record evidence, assess it against the criteria, and report their findings to the lead auditor. The auditee's coordinator supports arrangements and access, and can provide relevant explanations or factual corrections. That supporting role does not transfer control of the audit assignments or report content to the auditee. The client's approval of purpose and scope likewise does not replace the lead auditor's responsibility for managing this team's work. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 24–26.</span>",
    "keyPoint": "Separate the auditee's coordination role from the audit team's responsibility for evidence, findings, and the report.",
    "trap": "Allowing helpful local coordination to become control over the independent audit team's assignments and conclusions.",
    "distractors": {
      "0": "Local knowledge can inform planning, but the supplier coordinator should not control auditor assignments or filter which supported observations reach the lead auditor.",
      "1": "The client establishes the overall purpose and scope, while the appointed lead auditor manages the team. The auditee's coordinator does not assume responsibility for validating the team's conclusions.",
      "2": "Independent schedules and separate reports bypass the appointed lead auditor's coordination and reporting responsibilities; the supplier coordinator does not manage disagreements within the audit team."
    }
  },
  {
    "qid": "cqa:set-2:q014",
    "set": 2,
    "batch": 2,
    "sub": "cqa-capa-plan",
    "bok": "II.D.2",
    "cognitive": "Evaluate",
    "stem": "A packaging audit found use of obsolete artwork after product changeovers. Investigation confirmed that operators selected the correct approved revision, but an uncleared print-system cache sometimes supplied the previous image. An interim check now compares printed artwork with the approved image before use. The proposed permanent plan assigns an owner and date for refresher training plus a second person's confirmation of the selected revision number. Which review response is best?",
    "options": [
      "Accept the plan because independent confirmation of the selected revision number removes the identified cause of an older image being printed.",
      "Replace the proposal with an auditor-specified software modification and require that solution before considering alternative actions proposed by the auditee.",
      "Request a revised plan that addresses the confirmed cache condition and defines an effectiveness check during artwork changes, while retaining the interim control.",
      "Accept the plan if the owner demonstrates a month without artwork defects on orders that continue to use the same approved artwork."
    ],
    "answer": 2,
    "why": "A plan can have an owner, a deadline, and additional checks yet still fail to address the demonstrated cause. Here, the operators already choose the correct revision number; confirming that selection again does not resolve the cache condition that substitutes an older image. The reviewer should explain this specific weakness and request a cause-directed action with a suitable effectiveness measure. Verification should exercise artwork changes, because that is when the identified failure occurs. The interim image comparison can remain in place while the auditee develops and implements its permanent solution. The auditee retains responsibility for choosing that solution; the reviewer need not prescribe a particular software modification. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 133, 135–136.</span>",
    "keyPoint": "Judge a proposed action against the verified cause and the conditions in which recurrence must be prevented.",
    "trap": "Accepting added training or checking because the plan is organized, without asking whether those actions address the demonstrated cause.",
    "distractors": {
      "0": "The investigation already established correct revision selection. A second check of that same number does not control which image the cache supplies.",
      "1": "The reviewer should identify the plan's deficiencies and assess an adequate response. Mandating the auditor's preferred solution takes over the auditee's corrective-action responsibility.",
      "3": "Runs without artwork changes do not exercise the stated failure condition. Their results would not resolve the plan's failure to address the confirmed cause."
    }
  },
  {
    "qid": "cqa:set-2:q015",
    "set": 2,
    "batch": 2,
    "sub": "cqa-capa-verify",
    "bok": "II.D.3",
    "cognitive": "Evaluate",
    "stem": "An industrial testing laboratory introduced a new handover record after sample identities were lost when unfinished work passed between shifts. At follow-up, the auditor confirms that the revised instructions, training, and record system are in place. The laboratory presents 32 subsequent samples with complete identification, but every sample was received and completed by the same technician within one shift. Which assessment of corrective-action effectiveness is best?",
    "options": [
      "Implementation steps are supported, but effectiveness at shift handover remains unverified; examine actual transfers and their records against the intended identification controls.",
      "Effectiveness is demonstrated because all 32 subsequent samples retained their identities, and the result meets the same identification requirement as transferred samples.",
      "The action is ineffective because the records contain no successful shift handovers; classify the missing transfer evidence as a recurrence of the original failure.",
      "Increase the sample of completed same-shift work until it is large enough to compensate for the absence of transactions involving a shift handover."
    ],
    "answer": 0,
    "why": "Implementation and effectiveness require different evidence. The revised instructions, training, and available record system support completion of implementation steps. The error-free sample records do not test whether identity is maintained through the shift-to-shift transfer where the original failure occurred. The reviewer therefore needs suitable evidence from actual handovers, including how the new controls are used and whether identification is maintained. More records that exclude that condition do not fill the evidence gap. At the same time, lack of relevant effectiveness evidence is not proof that the action has failed or that another identification error has occurred. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 138–140.</span>",
    "keyPoint": "Effectiveness evidence must cover the operating condition that the corrective action was intended to control.",
    "trap": "Treating a defect-free period with no opportunity for the original failure as proof that recurrence has been prevented.",
    "distractors": {
      "1": "The same identification requirement applies, but these samples did not pass through the handover condition that caused the problem. They do not demonstrate the new transfer control's effectiveness.",
      "2": "The available evidence leaves effectiveness unresolved. It does not show a failed handover, a lost identity, or a recurrence of the original condition.",
      "3": "Increasing the number of samples does not correct the absence of the relevant operating condition. The additional evidence should include shift-to-shift transfers."
    }
  },
  {
    "qid": "cqa:set-2:q016",
    "set": 2,
    "batch": 2,
    "sub": "cqa-selection",
    "bok": "II.A.2",
    "cognitive": "Analyze",
    "stem": "A contractor needs an internal process audit of its condition-monitoring service. Priya is a qualified auditor who designed the current assessment method and approves service reports. Leon is qualified in management-system auditing but has not demonstrated competence in condition monitoring. Mei is a qualified process auditor with documented experience in this method at other organizations, no responsibility for the contractor's work, and time to review its local requirements. All three are available within budget. Which assignment best meets the audit's needs?",
    "options": [
      "Assign Priya to the process audit after she signs an impartiality statement and declares her responsibility for the assessment method.",
      "Assign Leon to the process audit after giving him the detailed checklist used for the previous audit of the condition-monitoring service.",
      "Assign Priya to judge technical conformity and Leon to review her findings for consistency with the applicable management-system standard.",
      "Assign Mei to the process audit after briefing her on the contractor's criteria, process interfaces, and local operating arrangements."
    ],
    "answer": 3,
    "why": "The selection must address the technical demands of this process audit and independence from the work being judged. Mei has demonstrated relevant process-auditing competence and no responsibility for the contractor's work; reviewing the local criteria and arrangements prepares her to apply that competence to this assignment. Priya's knowledge is valuable, but judging the method she designed and reports she approves creates self-review. A declaration does not remove that responsibility, and Leon's review against the management-system standard does not supply an independent, technically competent judgment of her work. Leon's general audit qualification and a checklist do not establish the missing process competence. Selection should consider the actual assignment rather than treating either credentials or familiarity alone as sufficient. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 65, 67–68.</span>",
    "keyPoint": "Match the audit assignment to demonstrated competence while preserving independence from the work being evaluated.",
    "trap": "Treating a conflict declaration or a second person's report review as a cure for auditing one's own work.",
    "distractors": {
      "0": "Priya would still be judging her own method and approval responsibilities. Declaring that relationship does not remove the self-review problem in the proposed assignment.",
      "1": "A checklist helps organize an audit but does not demonstrate that Leon can evaluate this specialized process. The stem expressly identifies that competence gap.",
      "2": "Priya still makes the technical conformity judgments about her own work. Leon's review against the management-system standard does not supply an independent, technically competent assessment of those judgments."
    }
  },
  {
    "qid": "cqa:set-2:q017",
    "set": 2,
    "batch": 2,
    "sub": "cqa-interview",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "During an audit of a booking service, an agent begins, 'For changes received after 16:00, we usually...' Her supervisor interrupts, 'We follow the procedure for all changes.' The auditor asks the supervisor to let the agent finish, and the supervisor agrees. Which approach best develops reliable evidence about the unfinished account?",
    "options": [
      "Ask the agent whether the supervisor's statement is correct, record her confirmation, and move to the next topic on the checklist.",
      "Ask the agent to describe a recent late change, paraphrase her account for confirmation, and examine the associated booking record.",
      "Ask the agent which required step was skipped after 16:00, then compare her explanation with the supervisor's description of the procedure.",
      "Ask the agent to read the relevant procedure aloud, then use agreement with the supervisor's statement as confirmation of actual practice."
    ],
    "answer": 1,
    "why": "The unfinished statement is a reason to explore what happens, not evidence that a requirement was violated. A neutral request for a recent example lets the agent describe the actual sequence. Paraphrasing checks that the auditor understood the account, and reviewing its record provides corroboration. The late-change route could be an authorized variation, so asking which required step was skipped would assume a conclusion that has not been established. A closed confirmation may be useful later, but here it would leave the interrupted explanation unexplored. Reading the procedure demonstrates neither how the recent transaction was handled nor whether the agent's account is accurate. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 166–167, 169.</span>",
    "keyPoint": "Use neutral probing to understand an exception, confirm the meaning of the account, and corroborate it before reaching a finding.",
    "trap": "Assuming an interrupted description reveals nonconformity, or accepting a supervisor's general assurance as evidence of actual practice.",
    "distractors": {
      "0": "A yes-or-no confirmation does not recover the agent's unfinished explanation or provide evidence about how a specific late change was handled.",
      "2": "The question presumes a required step was skipped. Nothing in the unfinished account establishes that, so it can bias the response and the resulting conclusion.",
      "3": "The written procedure and the supervisor's account describe expected practice. Their agreement does not verify the handling of an actual late-change transaction."
    }
  },
  {
    "qid": "cqa:set-2:q018",
    "set": 2,
    "batch": 2,
    "sub": "cqa-conflict",
    "bok": "III.C",
    "cognitive": "Analyze",
    "stem": "An auditor proposes a nonconformity because shipping labels were checked against an electronic master rather than a paper copy. During a calm review, the auditee identifies the approved procedure, which permits either format if revision status is verified. The auditor examines the controls and confirms that the sampled labels were checked against the current approved electronic master. The lead auditor may amend proposed findings before report issue. Which response best resolves the disagreement?",
    "options": [
      "Retain the proposed nonconformity until the auditee provides an approved concession specifically authorizing the use of electronic masters for these checks.",
      "Reclassify the proposed finding as an opportunity for improvement recommending paper copies, so neither party has to withdraw its original position.",
      "Withdraw the unsupported nonconformity, explain how the verified criterion changes the conclusion, and document the reason for amending the proposed finding.",
      "Ask the audit client to decide which document format it prefers, and suspend this proposed finding until that preference has been confirmed."
    ],
    "answer": 2,
    "why": "Resolving an audit disagreement requires an open examination of the criterion and evidence, including the possibility that the auditor's interpretation caused the conflict. The procedure permits electronic masters, and the checked records meet its revision-control condition. The proposed nonconformity therefore has no supported requirement gap. The authorized lead auditor should correct the proposed conclusion and document why it changed. This is an evidence-based amendment, not a concession made merely to preserve the relationship. Requiring special permission for an already permitted method, recommending paper solely to save face, or substituting the client's format preference would preserve an unsupported premise. The conclusion concerns the sampled label checks; it does not establish conformity of every electronic-record control. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 110, 154–155.</span>",
    "keyPoint": "Remain open to valid counterevidence and correct an unsupported finding through the authorized review process.",
    "trap": "Confusing professional firmness with defending an initial interpretation after the evidence disproves it.",
    "distractors": {
      "0": "The approved procedure already permits electronic masters under the verified condition. Requiring a concession adds an obligation not present in the stated criterion.",
      "1": "An improvement recommendation should have a useful, supported basis. Relabeling the disputed preference simply to avoid withdrawing it does not resolve the incorrect premise.",
      "3": "The client's preference does not change what the existing approved criterion permits. The evidence is sufficient to correct this proposed finding under the authority already stated."
    }
  },
  {
    "qid": "cqa:set-2:q019",
    "set": 2,
    "batch": 2,
    "sub": "cqa-program-eval",
    "bok": "IV.A.4",
    "cognitive": "Evaluate",
    "stem": "An audit program aims to lower the proportion of high-risk corrective actions with same-cause recurrence at six-month follow-up while maintaining planned risk coverage. The exhibit summarizes two annual cohorts. Definitions, risk mix, and follow-up intervals are unchanged, and every eligible corrective action received follow-up. Which interpretation best addresses the objective?",
    "options": [
      "Recurrence fell from 20% to 15% at full planned coverage; this supports progress on that measure while leaving 12 actions with recurrence to examine.",
      "Recurrences rose from 8 to 12, so performance against the objective worsened by 50%; the larger follow-up population does not alter that conclusion.",
      "Recurrences per completed audit remained 33.3%, so prevention was unchanged; the audit count is the appropriate denominator for judging corrective-action effectiveness.",
      "Audit throughput rose 50% while coverage remained complete, so the objective was met; recurring problems should be assessed separately from program effectiveness."
    ],
    "answer": 0,
    "why": "The stated outcome concerns recurrence after corrective action, so the relevant denominator is the number of eligible actions receiving the defined follow-up. The rates are 8/40 = 20% in Year 1 and 12/80 = 15% in Year 2, a decrease of five percentage points. Full planned risk coverage was maintained. These results support progress on the recurrence measure even though the count of recurring problems increased. The 12 actions with recurrence still require attention, and the comparison alone does not prove that auditing caused the improvement. Dividing by audits mixes a program activity count with an action-level outcome. More audits or complete coverage can demonstrate delivery of the plan, but neither alone demonstrates successful prevention of recurrence. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 185–187.</span>",
    "keyPoint": "Evaluate program outcomes against their objectives using comparable data and a denominator that matches the outcome being measured.",
    "trap": "Judging recurrence from raw counts or dividing corrective-action failures by the number of audits performed.",
    "distractors": {
      "1": "The raw recurrence count increased by 50%, but the population followed doubled. Ignoring that denominator reverses the direction shown by the comparable recurrence rates.",
      "2": "The calculations 8/24 and 12/36 are both one-third, but audits are not the corrective actions exposed to the defined follow-up. This denominator does not measure the stated outcome.",
      "3": "Throughput and coverage are useful delivery measures, but the objective also concerns recurrence. Separating repeat failures from program evaluation would omit the outcome management asked to assess."
    },
    "chart": {
      "type": "data-table",
      "title": "Audit program delivery and six-month follow-up",
      "columns": [
        "Measure",
        "Year 1",
        "Year 2"
      ],
      "rows": [
        [
          "Audits completed",
          "24",
          "36"
        ],
        [
          "Eligible high-risk corrective actions followed up",
          "40",
          "80"
        ],
        [
          "Actions with recurrence from the same cause",
          "8",
          "12"
        ],
        [
          "Planned high-risk audit coverage completed",
          "100%",
          "100%"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q020",
    "set": 2,
    "batch": 2,
    "sub": "cqa-sample-types",
    "bok": "V.E.2",
    "cognitive": "Apply",
    "stem": "An approved audit sampling plan calls for 75 distinct records from 1,000 closed service tickets, using proportional stratified allocation by category and random selection within each category. The categories in the exhibit are mutually exclusive and cover the entire population. Complete record-ID lists are available for all three categories. Which selection implements the plan?",
    "options": [
      "Select 25 routine, 25 urgent, and 25 exception tickets by randomly drawing distinct record IDs from the complete list for each category.",
      "Select 54 routine, 15 urgent, and 6 exception tickets by taking the earliest closed records from the complete list for each category.",
      "Select 75 tickets by randomly drawing distinct record IDs from the combined list, accepting whichever category counts occur in that sample.",
      "Select 54 routine, 15 urgent, and 6 exception tickets by randomly drawing distinct record IDs from the complete list for each category."
    ],
    "answer": 3,
    "why": "Proportional allocation assigns each category the same share of the sample that it has in the population: 75 × 720/1000 = 54 routine tickets, 75 × 200/1000 = 15 urgent tickets, and 75 × 80/1000 = 6 exception tickets. These allocations sum to 75. Random selection without replacement from each complete category list then implements the second part of the plan. Equal numbers per category would be a different, disproportionate allocation. Taking the earliest records satisfies the counts but introduces a nonrandom selection rule. A simple random sample from the pooled list is also a different design because it does not fix the prescribed category allocations. The allocation alone does not establish acceptance criteria or a separate confidence claim for each category. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 290–291.</span>",
    "keyPoint": "Implement both parts of a stratified plan: the specified allocation among strata and the selection method within each stratum.",
    "trap": "Getting the category counts right while selecting records by convenience, or assuming a pooled random sample guarantees the planned allocation.",
    "distractors": {
      "0": "Equal allocation gives the three differently sized categories equal sample counts. It may serve other purposes, but it does not follow the proportional allocation specified here.",
      "1": "The allocation is correct, but selecting the earliest records is not random selection within each category and may overrepresent conditions early in the period.",
      "2": "Random selection from the pooled list does not enforce the plan's fixed proportional category counts. A chance match would not make this the specified stratified selection procedure."
    },
    "chart": {
      "type": "data-table",
      "title": "Closed service tickets by category",
      "columns": [
        "Category",
        "Closed tickets"
      ],
      "rows": [
        [
          "Routine",
          "720"
        ],
        [
          "Urgent",
          "200"
        ],
        [
          "Exception",
          "80"
        ]
      ]
    }
  }
];
})(typeof window !== 'undefined' ? window : globalThis);
