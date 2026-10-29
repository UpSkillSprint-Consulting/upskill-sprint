/*
 * ASQ CQA Exam Set 2 — original practice questions.
 * Batches 1–9: Q001–Q090. Planned bank: 150 questions.
 * Author in reviewed batches of 10; hold PR #368 until all 150 are ready.
 * 2026 BoK target counts: I 37 / II 45 / III 30 / IV 23 / V 15.
 * Batch 1 counts: I 2 / II 3 / III 2 / IV 2 / V 1.
 * Batch 2 counts: I 3 / II 3 / III 2 / IV 1 / V 1.
 * Batch 3 counts: I 2 / II 3 / III 2 / IV 2 / V 1.
 * Batch 4 counts: I 3 / II 3 / III 2 / IV 1 / V 1.
 * Batch 5 counts: I 2 / II 3 / III 2 / IV 2 / V 1.
 * Batch 6 counts: I 3 / II 3 / III 2 / IV 1 / V 1.
 * Batch 7 counts: I 2 / II 3 / III 2 / IV 2 / V 1.
 * Batch 8 counts: I 3 / II 3 / III 2 / IV 1 / V 1.
 * Batch 9 counts: I 2 / II 3 / III 2 / IV 2 / V 1.
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
  },
  {
    "qid": "cqa:set-2:q021",
    "set": 2,
    "batch": 3,
    "sub": "cqa-types",
    "bok": "I.A.1",
    "cognitive": "Analyze",
    "stem": "After several bonded covers separate in use, an audit team observes the bonding operation and checks adhesive condition, mixing ratios, dispensing settings, cure cycles, operator qualifications, and selected finished-joint results against the approved instructions. The audit is confined to this operation and its controls; it does not assess the organization's wider management system. Which audit type best describes its primary focus?",
    "options": [
      "Product audit, because testing selected finished joints makes the conformity of those completed items the primary subject of the investigation.",
      "System audit, because reviewing qualifications, equipment settings, and instructions necessarily evaluates the organization's management system rather than an individual operation.",
      "Desk audit, because approved bonding instructions are used as the criteria against which qualifications, settings, and recorded test results are compared.",
      "Process audit, because it examines how inputs, operating conditions, resources, and controls produce the required results within the defined bonding operation."
    ],
    "answer": 3,
    "why": "The investigation concerns the bonding operation and the controls that transform its inputs into outputs. Checking adhesive condition, settings, people, methods, and resulting joint performance is characteristic of a process audit. A sample of finished joints can provide evidence within that audit without changing its primary focus to a product audit. Reviewing supporting training and equipment controls does not, by itself, expand the scope to the wider management system. Using documented criteria also does not make an audit a desk audit when the investigation examines the operation and its controls. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 3–5.</span>",
    "keyPoint": "Classify the audit by its primary subject and scope, not by one type of evidence used during the investigation.",
    "trap": "Calling an audit a product audit merely because it includes finished-item tests, or a system audit merely because it includes supporting records.",
    "distractors": {
      "0": "Finished-joint results are one source of evidence. The stated investigation centers on the operation's inputs, methods, resources, and controls rather than a complete examination of finished-product characteristics.",
      "1": "Personnel and equipment controls can be examined within a focused process audit. Their inclusion does not establish the broader management-system scope that the stem explicitly excludes.",
      "2": "A desk audit evaluates documents. The use of approved instructions as criteria does not make the broader investigation of an operation and its controls a document-only audit."
    }
  },
  {
    "qid": "cqa:set-2:q022",
    "set": 2,
    "batch": 3,
    "sub": "cqa-benefits",
    "bok": "I.B.2",
    "cognitive": "Analyze",
    "stem": "An internal audit evaluates procedure conformance, achievement of a 95% on-time service target, and labor efficiency. Complete verified records show 100 comparable completed jobs in each of two periods, with 96 completed on time in each period. Total labor rises from 150 to 180 hours, with unchanged work mix and other service results. Required procedures were followed. Which conclusion best demonstrates the additional management value of this audit?",
    "options": [
      "Effectiveness and labor efficiency were maintained because the same number of jobs was completed on time and the required procedures were followed.",
      "The on-time objective was achieved in both periods, while labor efficiency declined; the audit supplies a performance concern for management to investigate.",
      "The process became ineffective because it used more labor; the higher resource requirement overrides the evidence that the stated on-time objective was achieved.",
      "The evidence establishes procedure conformance only; an audit cannot provide management with conclusions about the relationship between service results and resources used."
    ],
    "answer": 1,
    "why": "Both periods meet the stated on-time objective: 96 of 100 jobs were on time, exceeding the 95% target. That supports effectiveness for this objective. Labor use per comparable completed job increases from 1.5 to 1.8 hours, so labor efficiency declines when the work mix and other results are unchanged. Following a procedure does not by itself establish good resource use. By distinguishing these dimensions, the audit gives management evidence for investigating a performance concern. The data do not establish why labor increased, and the auditor should not invent a cause or treat the increase alone as a procedural nonconformity. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 14, 18, 370.</span>",
    "keyPoint": "Audit results can separately show whether an objective was achieved and how many resources were used to achieve the results.",
    "trap": "Equating conformance or attainment of an output target with unchanged efficiency, or assuming that lower efficiency proves failure of every objective.",
    "distractors": {
      "0": "Meeting the deadline target supports effectiveness, but it does not negate the increase in labor used for the same comparable volume and results.",
      "2": "The stated on-time objective was met. More labor for the same results indicates poorer labor efficiency, not failure of that particular effectiveness objective.",
      "3": "The authorized audit purpose includes effectiveness and labor efficiency. Audits can provide independent performance information beyond confirmation that procedures were followed."
    }
  },
  {
    "qid": "cqa:set-2:q023",
    "set": 2,
    "batch": 3,
    "sub": "cqa-strategies",
    "bok": "II.A.6",
    "cognitive": "Apply",
    "caseId": "cqa-set2-pump-service-trace-01",
    "chart": {
      "type": "data-table",
      "title": "Pump-service job records",
      "columns": [
        "Record",
        "Linked record",
        "Pump ID",
        "Recorded activity or result"
      ],
      "rows": [
        [
          "Customer request CR-218",
          "None",
          "P-73",
          "Clean and pressure-test the pump"
        ],
        [
          "Work order WO-604",
          "CR-218",
          "P-73",
          "Cleaning and pressure test assigned"
        ],
        [
          "Test sheet TS-604",
          "WO-604",
          "P-37",
          "Pressure test: 6.0 bar; result recorded as pass"
        ],
        [
          "Service report SR-604",
          "WO-604 and TS-604",
          "P-73",
          "Pressure test: 6.0 bar; result recorded as pass"
        ]
      ]
    },
    "stem": "Pump-service case. The exhibit contains authentic records linked to one service job. The auditor has verified each entry against its source, but has not observed the original work, interviewed the technician, or found other evidence establishing which pump was tested. Starting with the issued service report, which sequence best applies backward tracing to investigate the reported test result and its relationship to the customer's request?",
    "options": [
      "Follow SR-604 to its supporting TS-604, then to WO-604 and CR-218, checking the recorded links and resolving the pump-identification discrepancy along that job's path.",
      "Start at CR-218, follow WO-604 through TS-604 to SR-604, and check how the assigned requirements passed into the recorded test result and final report.",
      "Review test sheets from several recent jobs, compare their pressure results, and then choose a service report with a similar result for a detailed comparison.",
      "Review all service-report controls first, then all test-sheet controls, and finally all work-order controls, selecting a new representative job in each record category."
    ],
    "answer": 0,
    "why": "Backward tracing starts from a result or a later point and follows the same transaction upstream. Here, the issued report points to its supporting test sheet and work order, and the work order points to the customer request. Following those links allows the auditor to investigate how the reported result arose and whether the job can be traced consistently to the requested pump. Starting at the request and moving toward the report is forward tracing. Comparing similar results or changing jobs within document categories may have other audit uses, but neither follows this selected job backward through its linked activities. The trace still requires investigation of the conflicting pump identifiers; it does not resolve them by assumption. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 81–82.</span>",
    "keyPoint": "Backward tracing follows a selected output or transaction upstream through its linked activities and inputs.",
    "trap": "Confusing any review of earlier documents with backward tracing, even when the selected transaction is abandoned or the review actually proceeds downstream.",
    "distractors": {
      "1": "This follows the same job in the forward direction, from customer input to reported output. It can be useful, but it is not the requested backward trace from the issued report.",
      "2": "A similar numerical result does not establish a transactional link. Switching to other jobs would not trace the selected report back to its supporting work and customer request.",
      "3": "This groups the investigation by record category and changes the sampled job. It does not preserve the linked path of the selected transaction."
    }
  },
  {
    "qid": "cqa:set-2:q024",
    "set": 2,
    "batch": 3,
    "sub": "cqa-evidence",
    "bok": "II.B.5",
    "cognitive": "Analyze",
    "caseId": "cqa-set2-pump-service-trace-01",
    "chart": {
      "type": "data-table",
      "title": "Pump-service job records",
      "columns": [
        "Record",
        "Linked record",
        "Pump ID",
        "Recorded activity or result"
      ],
      "rows": [
        [
          "Customer request CR-218",
          "None",
          "P-73",
          "Clean and pressure-test the pump"
        ],
        [
          "Work order WO-604",
          "CR-218",
          "P-73",
          "Cleaning and pressure test assigned"
        ],
        [
          "Test sheet TS-604",
          "WO-604",
          "P-37",
          "Pressure test: 6.0 bar; result recorded as pass"
        ],
        [
          "Service report SR-604",
          "WO-604 and TS-604",
          "P-73",
          "Pressure test: 6.0 bar; result recorded as pass"
        ]
      ]
    },
    "stem": "Pump-service case. The exhibit contains authentic records linked to one service job. The auditor has verified each entry against its source, but has not observed the original work, interviewed the technician, or found other evidence establishing which pump was tested. Which statement is supported by the objective evidence currently available?",
    "options": [
      "Pump P-73 was pressure-tested successfully because the final service report identifies it and repeats the passing result recorded on the linked test sheet.",
      "Pump P-37 was pressure-tested instead of P-73 because the test sheet was created closer to the activity than the final service report.",
      "The test sheet and service report contain conflicting pump identifiers; the available evidence does not establish which pump was physically tested.",
      "The test-sheet identifier is a transcription error because the matching work-order number and pressure value establish that both records concern a test of P-73."
    ],
    "answer": 2,
    "why": "The auditor has verified a documentary fact: TS-604 records P-37, while the linked service report records P-73. Authenticity of the documents does not establish which conflicting identifier describes the equipment actually tested. The final report cannot simply override the supporting sheet, and the sheet's position in the workflow does not prove that its identifier is correct. A shared job number and pressure value likewise do not establish the cause of the discrepancy. The auditor should record the inconsistency and seek relevant corroboration before concluding which pump was tested or whether the discrepancy was a transcription error. Objective evidence must support the particular conclusion being drawn. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 104, 107.</span>",
    "keyPoint": "Separate a verified inconsistency in records from an unverified conclusion about the physical event or the cause of the inconsistency.",
    "trap": "Treating an authentic record as automatically accurate in every detail, or choosing a preferred record to eliminate contradictory evidence.",
    "distractors": {
      "0": "Repeating a result in the final report does not independently corroborate the equipment identity. The conflicting identifier on the linked test sheet remains unresolved.",
      "1": "The test sheet is relevant evidence, but its earlier position does not establish that its identifier is correct. The available documents support a discrepancy, not a definitive reconstruction of the physical work.",
      "3": "Matching links and pressure values connect the records, but they do not show which identifier is correct or how the discrepancy arose. Calling it a transcription error assumes an unverified cause."
    }
  },
  {
    "qid": "cqa:set-2:q025",
    "set": 2,
    "batch": 3,
    "sub": "cqa-report-final",
    "bok": "II.C.3",
    "cognitive": "Apply",
    "stem": "An audit procedure requires lead-auditor and program-manager approval before a report is distributed, use of the client's authorized recipient list, and transfer of completed working papers to the controlled audit file under its retention schedule. The lead auditor has approved the report; the program manager has not. The auditee requests a copy for today's management meeting and asks that working papers be deleted because the findings are already summarized. What should the lead auditor do?",
    "options": [
      "Send a copy marked preliminary to the authorized recipients for the meeting, obtain the program manager's approval afterward, and retain the completed working papers in the controlled audit file.",
      "Obtain the program manager's approval, issue the report to the client-authorized recipients, and transfer the completed working papers into the controlled audit file for scheduled retention.",
      "Obtain the program manager's approval, distribute the report to everyone who attended the closing meeting, and retain the completed working papers in the controlled audit file.",
      "Obtain the program manager's approval, issue the report to the client-authorized recipients, and delete the completed working papers once their observations have been summarized in the approved report."
    ],
    "answer": 1,
    "why": "The applicable procedure establishes three separate controls: approval before distribution, authorized recipients, and retention of the supporting audit records. The lead auditor should complete each one. A preliminary label does not create an exception to a rule that requires approval before distribution. Attendance at a closing meeting does not automatically place someone on the client's authorized distribution list. Completed working papers remain subject to the stated audit-file and retention requirements even when the report summarizes their observations. Approval roles and retention periods depend on the applicable arrangements; this scenario does not establish a universal list of approvers or a fixed retention period for all audits. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 126, 131.</span>",
    "keyPoint": "Apply the established approval, distribution, and record-retention controls separately when finalizing an audit report.",
    "trap": "Treating urgency, meeting attendance, or a report summary as permission to bypass a different control in the audit procedure.",
    "distractors": {
      "0": "The stated rule requires the program manager's approval before distribution, including a copy labeled preliminary. An approaching meeting does not supply that missing authorization.",
      "2": "The client's authorized list governs distribution. Closing-meeting attendance alone does not establish authorization to receive the report.",
      "3": "The procedure expressly requires completed working papers to enter the controlled audit file under its retention schedule. A summary in the report does not cancel that obligation."
    }
  },
  {
    "qid": "cqa:set-2:q026",
    "set": 2,
    "batch": 3,
    "sub": "cqa-auditor-characteristics",
    "bok": "III.A",
    "cognitive": "Apply",
    "stem": "During a first audit at an overseas assembly site, an auditor notices that several operators pause and look down before answering. The site coordinator explains that this can be a customary sign of respect when speaking to a visitor. The operators understand the questions, and requested records are readily available. Which approach best combines cultural sensitivity with objective auditing?",
    "options": [
      "Use the reduced eye contact as a reason to expand sampling of these operators' work, even if their answers and records are consistent.",
      "Ask the coordinator to confirm the operators' answers on their behalf, so the auditor can use a more familiar communication style.",
      "Allow time for responses, respect the communication style, and assess the operators' accounts against the applicable criteria and supporting evidence.",
      "Accept the operators' explanations without the usual corroboration, since asking for further evidence could be interpreted as a lack of respect."
    ],
    "answer": 2,
    "why": "Cultural sensitivity includes observing and respecting local practices while remaining impartial, perceptive, and adaptable. The coordinator has supplied relevant context, and the stem provides no independent indication of inconsistent evidence or poor understanding. The auditor can adjust the pace and manner of the interaction while applying the same criteria and evidence standards. Reduced eye contact alone does not justify treating these operators' work as less trustworthy. Having the coordinator answer for them loses their firsthand accounts, while dropping corroboration weakens the audit. Additional sampling could be appropriate if substantive evidence later warrants it, but cultural difference alone is not that evidence. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 151.</span>",
    "keyPoint": "Adapt the interaction to the auditee's context while maintaining objective criteria and evidence standards.",
    "trap": "Treating an unfamiliar communication style as evidence of unreliability, or lowering the evidence standard in the name of cultural sensitivity.",
    "distractors": {
      "0": "The proposed expansion is based solely on a culturally explained behavior, not a contradiction, risk signal, or evidence gap. It imports an unsupported judgment about these operators' reliability.",
      "1": "The operators understand the questions and can provide their own accounts. Replacing their answers with the coordinator's confirmation sacrifices firsthand information merely to suit the auditor's preferred style.",
      "3": "Respectful communication does not remove the need for appropriate corroboration. The auditor should adapt how evidence is obtained, not exempt the interviewees from the usual evidence standard."
    }
  },
  {
    "qid": "cqa:set-2:q027",
    "set": 2,
    "batch": 3,
    "sub": "cqa-team-dynamics",
    "bok": "III.F",
    "cognitive": "Apply",
    "stem": "At a new audit team's daily review, a senior member repeatedly interrupts two newer members and urges the team to accept one interpretation of the collected evidence. The newer members say they have relevant observations that have not yet been considered. Fifteen minutes remain, and no immediate safety or other urgent decision is involved. What should the lead auditor do to facilitate a sound team conclusion?",
    "options": [
      "Ask members to vote immediately on the senior auditor's interpretation, then record the majority view as the team's agreed conclusion.",
      "Give each member a brief uninterrupted turn, compare the observations with the criteria, and assign follow-up for any material uncertainty that remains.",
      "Ask the senior member to resolve the issue after the meeting, with the newer members sending their notes for inclusion in that person's assessment.",
      "Give all members equal space in the report for their interpretations, leaving the client to decide which interpretation the team should adopt."
    ],
    "answer": 1,
    "why": "Effective facilitation gives every member a voice and uses differing observations to strengthen the team's work. Brief uninterrupted turns address the dominance problem without abandoning the schedule. Comparing the observations with the criteria keeps the discussion focused on evidence, and assigning any necessary follow-up avoids manufacturing agreement where a material gap remains. A vote before hearing the observations cannot substitute for their evaluation. Transferring the decision to the dominating member preserves the participation problem, while sending unreconciled interpretations to the client avoids the team's responsibility to assess its evidence. The lead retains responsibility for guiding the team and its deliverables. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 173–174.</span>",
    "keyPoint": "Facilitate balanced participation and evidence-based conclusions rather than treating seniority, voting, or apparent agreement as sufficient.",
    "trap": "Confusing a fast decision or equal reporting space with a properly evaluated team conclusion.",
    "distractors": {
      "0": "A majority vote taken before relevant observations are heard can conceal an evidence gap. Consensus should follow consideration of the evidence, not replace it.",
      "2": "The suggested arrangement leaves the dominating member in control of how the other observations are considered. It does not establish the balanced, objective discussion the team needs.",
      "3": "Equal space for competing interpretations does not evaluate or reconcile them. The lead must guide the team's assessment and identify necessary follow-up rather than transfer that task to the client."
    }
  },
  {
    "qid": "cqa:set-2:q028",
    "set": 2,
    "batch": 3,
    "sub": "cqa-program-resources",
    "bok": "IV.A.2",
    "cognitive": "Analyze",
    "stem": "An annual program contains eight required audits. The exhibit gives total person-hours for each activity, summed across all people performing it; they are not elapsed hours. The qualified auditor pool also performs the annual program review and has 176 person-hours available for all listed auditor work. Auditee participants are a separate resource pool. The estimates include all required work, and no travel or additional overhead effort is needed. Which resource request completes the plan?",
    "options": [
      "Obtain 24 additional qualified auditor-hours and reserve 96 auditee participant-hours for the annual program.",
      "Obtain 96 additional qualified auditor-hours and reserve 72 auditee participant-hours for the annual program.",
      "Use the existing qualified auditor capacity without adding hours and reserve 72 auditee participant-hours for the annual program.",
      "Obtain 24 additional qualified auditor-hours and reserve 72 auditee participant-hours for the annual program."
    ],
    "answer": 3,
    "why": "Each audit requires 4 + 12 + 6 = 22 auditor-hours. Eight audits therefore require 176 auditor-hours, and the separate annual program review adds 24, giving a total demand of 200. Against the pool's available 176 hours, the shortfall is 24 qualified auditor-hours. Auditee participation requires 8 × 9 = 72 person-hours and must be reserved separately; it neither supplies auditor capacity nor adds to the auditor shortfall. The annual program review belongs to the auditor pool and occurs once, so it must not also be charged to the auditee pool. A resource plan must include preparation, performance, reporting and follow-up, participation by the auditee, and program-management work. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 180, 190–191.</span>",
    "keyPoint": "Budget all program activities and keep auditor effort, auditee participation, and elapsed time distinct.",
    "trap": "Funding only the individual audits, or treating auditee participation as extra auditor capacity demand.",
    "distractors": {
      "0": "The auditor shortfall is correctly calculated, but 96 auditee hours incorrectly adds the 24-hour program review to the 72 hours of auditee participation. The stem assigns that review to the auditor pool.",
      "1": "The 96-hour auditor request combines the actual 24-hour auditor shortfall with the separate 72-hour auditee requirement. Auditee participation is not work assigned to the qualified auditor pool.",
      "2": "The existing 176 hours cover the eight individual audits exactly but leave no capacity for the required 24-hour annual program review. The auditor resource plan is therefore incomplete."
    },
    "chart": {
      "type": "data-table",
      "title": "Annual audit program effort estimates",
      "columns": [
        "Activity",
        "Person-hours",
        "Frequency / resource pool"
      ],
      "rows": [
        [
          "Audit preparation",
          "4",
          "Per audit / auditors"
        ],
        [
          "Audit conduct",
          "12",
          "Per audit / auditors"
        ],
        [
          "Reporting and follow-up",
          "6",
          "Per audit / auditors"
        ],
        [
          "Auditee participation",
          "9",
          "Per audit / auditees"
        ],
        [
          "Program review and improvement",
          "24",
          "Once annually / auditors"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q029",
    "set": 2,
    "batch": 3,
    "sub": "cqa-program-risk",
    "bok": "IV.A.8",
    "cognitive": "Analyze",
    "stem": "A manufacturer can add one process audit this quarter. All mandatory audits are separately resourced and will proceed, and none of the candidate areas has a required maximum audit interval. A safety-critical heat-treatment process changed its control software and key personnel after a clean audit ten months ago. A stable supplies store was audited fifteen months ago, with one minor issue whose correction was verified. A stable expense-processing function had seven clerical findings eight months ago, all verified closed. Which scheduling decision is best supported?",
    "options": [
      "Prioritize heat treatment, considering the critical process changes and the limited relevance of audit evidence collected before those changes.",
      "Prioritize the supplies store, using the longest time since the last audit as the deciding factor among these optional audits.",
      "Prioritize expense processing, using its larger number of previous findings as the deciding factor among these optional audits.",
      "Keep heat treatment at its existing interval until a nonconformity occurs, using the previous clean result to support its current priority."
    ],
    "answer": 0,
    "why": "Risk-based scheduling considers process criticality, changes in controls or personnel, audit history, and the current evidence of effective operation together. The heat-treatment changes occurred after the clean audit, so that audit provides limited assurance about the changed arrangements. Its safety-critical function makes timely evaluation of those arrangements particularly relevant. The supplies store's longer elapsed interval and the expense function's larger historical finding count are useful inputs, but neither alone outweighs the critical changes described. Waiting for a nonconformity would make the schedule reactive. Mandatory coverage remains protected in the stem; this decision allocates an additional audit, not permission to omit required audits. The changed process is not thereby presumed nonconforming, and an audit does not replace its operational controls. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 196, 207–208.</span>",
    "keyPoint": "Reassess audit priority when critical processes change; a clean audit of the previous arrangement does not establish the effectiveness of the new one.",
    "trap": "Ranking audits solely by elapsed time or historical finding counts while overlooking changes that alter current risk.",
    "distractors": {
      "1": "Time since the last audit is relevant, but there is no overdue mandatory interval here. Using age alone ignores the more consequential changes in the safety-critical process.",
      "2": "Seven historical clerical findings do not automatically indicate greater current risk than a changed critical process. Their verified closure and the function's stability also matter.",
      "3": "The prior clean audit assessed the earlier arrangements. Waiting for a failure before reconsidering priority ignores both the changes and the potential consequence of ineffective controls."
    }
  },
  {
    "qid": "cqa:set-2:q030",
    "set": 2,
    "batch": 3,
    "sub": "cqa-basic-tools",
    "bok": "V.A",
    "cognitive": "Analyze",
    "stem": "A service operation wants its first two improvement investigations to address at least 70% of last quarter's recorded incident cost. Each incident belongs to exactly one category in the exhibit, and the average costs use the same complete loss-accounting rules. Investigation effort is comparable, and no safety or regulatory priority overrides the cost objective. Which pair should head a Pareto analysis for this purpose?",
    "options": [
      "Invoice errors and packaging damage.",
      "Wrong configuration and packaging damage.",
      "Wrong configuration and late dispatch.",
      "Late dispatch and packaging damage."
    ],
    "answer": 2,
    "why": "The objective is based on recorded cost, so each category's contribution is its incident count multiplied by its average cost. The totals are $1,200 for invoice errors, $2,000 for packaging damage, $3,600 for late dispatch, and $4,800 for wrong configuration. Ranking those totals puts wrong configuration first and late dispatch second. Together they contribute $8,400/$11,600, or about 72.4%, meeting the stated 70% threshold. The most frequent pair represents 100/128 incidents but only $3,200, about 27.6% of recorded cost. A Pareto ranking identifies investigation priorities on the selected measure; it does not establish the root causes or guarantee that the entire associated cost can be eliminated. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 224–225.</span>",
    "keyPoint": "Choose the Pareto measure that matches the objective; frequency and total cost can produce different priorities.",
    "trap": "Using the most frequent categories to answer a cost question, or treating a Pareto ranking as proof of cause or achievable savings.",
    "distractors": {
      "0": "These two categories account for 100 of 128 incidents but contribute only $1,200 + $2,000 = $3,200, about 27.6% of total cost. They address a frequency objective rather than the stated cost objective.",
      "1": "These categories contribute $4,800 + $2,000 = $6,800, only about 58.6% of total cost. Packaging damage contributes less cost than late dispatch, which this pair omits.",
      "3": "These categories contribute $3,600 + $2,000 = $5,600, only about 48.3% of total cost. This pair omits wrong configuration, the largest cost category."
    },
    "chart": {
      "type": "data-table",
      "title": "Quarterly incident counts and average recorded cost",
      "columns": [
        "Incident category",
        "Number of incidents",
        "Average cost per incident"
      ],
      "rows": [
        [
          "Invoice errors",
          "60",
          "$20"
        ],
        [
          "Packaging damage",
          "40",
          "$50"
        ],
        [
          "Late dispatch",
          "20",
          "$180"
        ],
        [
          "Wrong configuration",
          "8",
          "$600"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q031",
    "set": 2,
    "batch": 4,
    "sub": "cqa-audit-purpose",
    "bok": "I.A.3",
    "cognitive": "Analyze",
    "stem": "An approved data-conversion supplier passed a routine audit two months ago. After three recent deliveries omitted customer records, the customer commissions an additional audit to investigate the relevant conversion and review controls and establish the extent of the problem. Corrective actions for these omissions have not yet been implemented. Which purpose best explains why this audit is being commissioned now?",
    "options": [
      "Routine surveillance, because the supplier is already approved and the customer needs periodic assurance that its established controls continue to operate.",
      "For-cause investigation, because reported failures have prompted a focused examination of the activities and controls associated with those failures.",
      "Corrective-action verification, because an audit following a reported problem determines whether the actions addressing that problem have prevented recurrence.",
      "Initial supplier qualification, because the recent omissions require the customer to establish the supplier's capability before placing its first order."
    ],
    "answer": 1,
    "why": "The immediate purpose is to investigate a reported problem and the controls associated with it. That is a for-cause audit. The supplier's existing approval and recent routine audit do not change the trigger for this additional engagement. A later audit could verify the implementation and effectiveness of corrective actions, but those actions have not yet been implemented for these omissions. This is also not an initial qualification before the first order. Audit relationship, method, and purpose are separate dimensions: this customer's supplier audit can be second-party while its specific purpose is for-cause investigation. The audit should obtain evidence about the problem without assuming that a particular cause has already been established. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 7, 16, 139.</span>",
    "keyPoint": "Classify an audit by the purpose of the present engagement, distinguishing investigation of a reported problem from later verification of its corrective action.",
    "trap": "Treating every audit after a problem as corrective-action verification, or allowing the supplier's approval status to obscure the immediate purpose.",
    "distractors": {
      "0": "Periodic surveillance is a legitimate activity for an approved supplier, but this additional audit was commissioned specifically because of the reported omissions, not simply because another routine interval elapsed.",
      "2": "Verification requires an action or response whose implementation and effectiveness can be assessed. The stem says corrective actions for these omissions have not yet been implemented.",
      "3": "The supplier is already approved and has delivered work. The stated purpose concerns failures in existing service, not capability assessment before the customer's first order."
    }
  },
  {
    "qid": "cqa:set-2:q032",
    "set": 2,
    "batch": 4,
    "sub": "cqa-common-elements",
    "bok": "I.A.4",
    "cognitive": "Apply",
    "stem": "A quality auditor and a qualified environmental auditor prepare separate audits at the same plant. One audit will examine traceability from outsourced test results to production lots; the other will examine traceability from waste-transfer records to collections. Each has its own applicable criteria and technical responsibilities. Which approach appropriately applies the elements shared by these two audit disciplines?",
    "options": [
      "Develop one set of control requirements from the quality criteria, then use the same sample and conclusions for both audits to ensure consistency.",
      "Use each audit's criteria, but treat completed records as sufficient evidence of traceability without checking their links to the activities they describe.",
      "Use separate objectives and criteria, but restrict common methods to report formatting because evidence-collection techniques cannot transfer between the two disciplines.",
      "Set appropriate objectives and criteria for each audit, then use interviews, observation, record review, and transaction tracing to obtain relevant verified evidence."
    ],
    "answer": 3,
    "why": "Both audits use a planned, independent process to obtain relevant evidence and evaluate it against appropriate criteria. Interviews, observations, record review, and tracing can support that process in both disciplines, although their emphasis and technical interpretation may differ. Sharing those methods does not make the quality criteria applicable to the environmental audit or justify one undifferentiated conclusion. In this scenario, record existence alone does not establish the required links between results or transfers and the underlying activities. Each qualified auditor must apply the relevant criteria and technical judgment to the evidence. The common framework extends beyond a shared report format. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 9, 11.</span>",
    "keyPoint": "Audit disciplines share a planned evidence-and-criteria framework while retaining appropriate subject expertise, criteria, and conclusions.",
    "trap": "Assuming that common audit methods require identical criteria, or that different technical subjects prevent useful methods from being shared.",
    "distractors": {
      "0": "A shared site does not make the two sets of requirements interchangeable. Each audit needs evidence and conclusions relevant to its own purpose and criteria.",
      "1": "Completed records may be useful evidence, but the stated objectives concern traceability. The relevant links must be checked rather than inferred from the mere existence of the records.",
      "2": "The common elements include planning, data collection, objective evaluation, reporting, and follow-up. Interviews, observation, record review, and tracing are not confined to one audit discipline."
    }
  },
  {
    "qid": "cqa:set-2:q033",
    "set": 2,
    "batch": 4,
    "sub": "cqa-audit-credibility",
    "bok": "I.E.3",
    "cognitive": "Apply",
    "stem": "An internal audit identifies a supported nonconformity in maintenance scheduling. The auditee agrees that the cited requirement and evidence are correct but asks the auditor to omit the finding from the executive report. Department bonuses are determined solely by the number of negative audit findings, so including it would reduce the department's bonus. The auditor is independent of the department and must use the established reporting route. Which response best protects audit credibility?",
    "options": [
      "Retain the evidence-supported finding through the established reporting route and ask audit program management to address the incentive that is creating pressure to suppress results.",
      "Reclassify the finding as an improvement suggestion, keeping the evidence in the report while preventing it from affecting the department's negative-finding count.",
      "Remove the finding from the executive report but retain it in the working papers, allowing the department to correct the issue without a bonus consequence.",
      "Delay reporting the finding until the bonus period has closed, then issue it through the established route so the evidence remains available for future improvement."
    ],
    "answer": 0,
    "why": "Credibility depends on impartial findings based on evidence and appropriate use of audit results. The auditee has offered no factual correction; the request is to change reporting because of a financial incentive. The auditor should preserve the supported finding and follow the authorized reporting route. Raising the incentive problem with audit program management also seeks the support needed to protect objective reporting. Reclassification, private retention, or delay solely to avoid the bonus effect would distort how the results reach management. Audit findings can inform improvement, but using their count as the sole basis for a bonus decision can encourage concealment and undermine the audit function. This does not prevent legitimate review that corrects factual errors. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 48, 50.</span>",
    "keyPoint": "Protect evidence-based reporting and address incentives that encourage suppression or distortion of audit results.",
    "trap": "Trying to preserve relationships by changing the classification, visibility, or timing of a supported finding for reasons unrelated to its evidence.",
    "distractors": {
      "1": "The finding meets the stated nonconformity basis. Changing its classification solely to protect a bonus would make the reported conclusion depend on the incentive rather than the evidence.",
      "2": "Keeping evidence in private working papers does not provide the executive report with the supported finding. The proposal conceals relevant results from the established reporting route.",
      "3": "The proposed delay is designed to avoid a financial consequence, not to resolve an evidence gap or meet an authorized reporting need. It lets the incentive distort timely reporting."
    }
  },
  {
    "qid": "cqa:set-2:q034",
    "set": 2,
    "batch": 4,
    "sub": "cqa-preaudit-documents",
    "bok": "II.A.3",
    "cognitive": "Analyze",
    "stem": "Before auditing custom-fabrication orders, an auditor receives current approved Sales and Planning procedures and a matrix that lists a document for every applicable requirement. The Sales procedure ends when a customer change is accepted; the Planning procedure begins when a revised production package is issued. The supplied documents do not identify how approved changes pass between those activities or how receipt is confirmed. No operating records have yet been examined. What should the auditor conclude from this preparation review?",
    "options": [
      "The system design is adequate because every requirement has a document reference; fieldwork can concentrate on whether employees follow the listed procedures.",
      "Customer changes were not communicated to Planning, because the missing handoff description establishes that the operational transfer did not occur.",
      "The documented handoff needs clarification and focused evidence collection; a complete requirements matrix does not demonstrate coherent controls across process interfaces.",
      "The handoff is an editorial issue because both procedures are current and approved; it need not influence the planned evidence collection."
    ],
    "answer": 2,
    "why": "Pre-audit document review helps assess whether the system is appropriately designed and where subsequent evidence collection should concentrate. A matrix locating a document for each requirement is useful, but it does not by itself show that the documented activities form a coherent system. Here, the transition from an accepted change to a revised production package is not explained in the supplied information. The auditor should seek clarification or additional applicable documentation and plan to examine that interface. The missing description does not establish that actual customer changes were lost or that no other control exists. Operating evidence is still needed to assess implementation and functioning. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 71.</span>",
    "keyPoint": "Use document review to examine the adequacy and interconnection of controls, then target operating evidence where the design is unclear.",
    "trap": "Treating a complete requirement-to-document matrix as proof of an integrated system, or treating a documentation uncertainty as proof of an operational failure.",
    "distractors": {
      "0": "The matrix shows where requirements are said to be addressed, but the unexplained interface still requires review. A reference for every requirement does not establish coherent process controls.",
      "1": "The documents reveal an uncertainty about the handoff, not direct evidence that an actual transfer failed. Operating records and other relevant evidence have not yet been examined.",
      "3": "Approval and current revision status do not resolve the missing connection between the activities. That uncertainty is relevant to the audit plan rather than merely a formatting concern."
    }
  },
  {
    "qid": "cqa:set-2:q035",
    "set": 2,
    "batch": 4,
    "sub": "cqa-working-papers",
    "bok": "II.A.5",
    "cognitive": "Apply",
    "stem": "An audit scope covers the intake, indexing, and retrieval of archived customer records through both automated and manual routes. A generic checklist follows the automated route. During preparation, the auditor confirms that the approved process also uses manual intake for scanned paper records, but the checklist has no prompts for that route. Resources allow both routes to be examined. How should the auditor use the working papers?",
    "options": [
      "Add criteria-linked prompts for the manual route and record the resulting evidence, while preserving coverage of the other applicable controls in the agreed scope.",
      "Use the checklist unchanged and mark the manual route as not applicable, because the prepared checklist defines which activities the audit will examine.",
      "Apply the automated-route prompts as mandatory controls for the manual route, so any missing automated feature can be recorded as a nonconformity.",
      "Request a scope amendment before adding manual-route prompts, because examining an activity absent from the checklist necessarily expands the authorized audit scope."
    ],
    "answer": 0,
    "why": "Working papers guide evidence collection and support coverage of the agreed audit scope. A generic checklist should be adapted to the actual circumstances and the applicable requirements. The manual route is explicitly within scope, so adding relevant prompts does not itself require expanding that scope. The auditor should gather and record evidence for its controls while retaining appropriate coverage elsewhere. The checklist is neither the audit standard nor a substitute for the stated scope. An automated feature should not be imposed on an approved manual route unless the applicable criteria require that feature. Flexibility in working papers remains bounded by the audit's purpose, scope, criteria, and available resources. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 77–78.</span>",
    "keyPoint": "Adapt a checklist to relevant in-scope activities; use applicable criteria to decide what to test and record.",
    "trap": "Treating a generic checklist as the audit boundary or as a source of requirements that the actual audit criteria do not impose.",
    "distractors": {
      "1": "The agreed scope expressly includes the manual route. An omission from a generic checklist does not make an applicable activity outside scope or not applicable.",
      "2": "Checklist prompts are working aids, not requirements in their own right. The auditor must identify the controls required for the manual route instead of assuming it must reproduce automated features.",
      "3": "The manual route is already authorized by the stated scope. Adding appropriate prompts changes the working paper, not the extent or boundaries of the audit."
    }
  },
  {
    "qid": "cqa:set-2:q036",
    "set": 2,
    "batch": 4,
    "sub": "cqa-opening-meeting",
    "bok": "II.B.3",
    "cognitive": "Apply",
    "stem": "A supplier audit's client-approved plan specifies an on-site process audit and an agreed four-level classification of findings. The plan was supplied in advance. At the opening meeting, the supplier's coordinator says the visit is only a document review and that findings will use the supplier's internal pass/fail labels. The lead auditor may explain the plan but cannot change its scope or classification method without client approval. What should the lead auditor do?",
    "options": [
      "Use the supplier's labels in discussions to build rapport, then translate the findings into the client's classification when preparing the written report.",
      "Reconfirm the approved scope and classification method, explain how evidence and results will be handled, and resolve questions before starting the planned activities.",
      "Begin collecting evidence under the approved plan and defer discussion of the differing expectations until the closing meeting, when actual findings are available.",
      "Let the coordinator choose the scope and classification for the visit, seeking client approval afterward if the resulting report contains adverse findings."
    ],
    "answer": 1,
    "why": "The opening meeting confirms a common understanding of the audit plan and that the planned activities can be performed. Scope, purpose, criteria, methods, and the classification and reporting of results should be clear before evidence collection proceeds. Here, the coordinator's expectations conflict with an already approved plan, so the lead should explain that plan and address the questions. If a change is then proposed, the stated client-approval requirement still applies. The lead should not operate with different verbal and written classification systems, defer a known misunderstanding to the closing meeting, or let the auditee silently replace the approved arrangements. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 95–96.</span>",
    "keyPoint": "Use the opening meeting to establish a shared understanding of the approved plan, methods, and reporting arrangements before collecting evidence.",
    "distractors": {
      "0": "Using one classification in discussions and another in the report preserves the misunderstanding and can create surprises. The agreed method should be explained at the opening meeting.",
      "2": "The differing expectations are already known. Deferring them can obstruct access and cooperation and leave the auditee unclear about how the work and results will be handled.",
      "3": "The coordinator has not been given authority to replace the approved scope or classification. Later approval tied only to adverse findings does not satisfy the stated control."
    },
    "trap": "Treating the opening meeting as introductions only and leaving different expectations about scope and grading unresolved."
  },
  {
    "qid": "cqa:set-2:q037",
    "set": 2,
    "batch": 4,
    "sub": "cqa-electronic-communication",
    "bok": "III.D",
    "cognitive": "Evaluate",
    "stem": "During a remote audit review, the audit team and the client's engineer need to examine a restricted test file supporting a finding. They are authorized to view it, but vendor observers on the same call are authorized to receive only a summary. An approved portal can give named users view-only access during an agreed review period. Which communication arrangement best supports direct evidence review while respecting these access limits?",
    "options": [
      "Screen-share the complete file with everyone on the call, keeping downloads disabled so the evidence can be discussed without distributing a copy.",
      "Give everyone a view-only portal link marked confidential, explaining that the observers must not quote or forward information beyond the permitted summary.",
      "Keep the complete group together and have the auditee describe the file verbally, using that account in place of the authorized participants' direct review.",
      "Arrange a restricted review with the authorized participants using named portal access, then communicate the permitted summary to the complete group."
    ],
    "answer": 3,
    "why": "The communication method must allow the authorized participants to examine the supporting information while preserving the different access permissions. A planned restricted review through the approved portal provides that access without exposing the file to observers. The full group can then receive the permitted summary. Disabling downloads or marking a link confidential does not authorize disclosure of its contents to additional people. A verbal account may help explain a finding, but it does not provide the direct examination required here when suitable authorized access is available. Electronic communication and remote access require agreed arrangements addressing confidentiality, security, and document-viewing controls. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 164.</span>",
    "keyPoint": "Select electronic communication arrangements that match both the evidence-review need and each participant's authorization.",
    "distractors": {
      "0": "Viewing is itself disclosure. Preventing a download does not give the vendor observers permission to see the restricted contents.",
      "1": "View-only permissions limit editing, not who is authorized to receive the information. A confidentiality label or forwarding request cannot replace the stated access limits.",
      "2": "The team and engineer need direct examination of the supporting file, and an approved method is available. Replacing that examination with the auditee's account does not meet the stated need."
    },
    "trap": "Assuming that view-only access or a confidentiality label authorizes every meeting participant to see restricted information."
  },
  {
    "qid": "cqa:set-2:q038",
    "set": 2,
    "batch": 4,
    "sub": "cqa-interview-translator",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "An audit team will interview operators in a language the auditors do not speak. A skilled independent translator familiar with the technical vocabulary is available and accepted by the auditee. The draft agenda uses the same interview durations as a comparable audit conducted without translation. The lead may adjust interview slots within the approved audit window. Which preparation best supports reliable interviews?",
    "options": [
      "Agree on additional interview time and use short, single-topic questions, allowing the translator to convey each complete question and response.",
      "Keep the original interview slots and use longer questions covering several topics, allowing the translator to combine the answers into concise summaries.",
      "Replace the independent translator with the process supervisor, so technical familiarity can reduce the need for clarification during each interview.",
      "Give the translator the interview objectives and let the translator question operators independently, while the auditors review the resulting English notes."
    ],
    "answer": 0,
    "why": "Translation adds work to asking questions, receiving answers, evaluating evidence, and summarizing results. The plan should allow suitable time instead of assuming the original interview durations remain adequate. Short, focused questions help the skilled translator convey the intended meaning without interrupting a long question into fragments or compressing several answers. The available independent translator already has the needed technical vocabulary, so replacing that person with the process supervisor introduces an avoidable credibility concern. The translator supports communication; the proposed arrangement does not assign that person an auditor's responsibility for conducting the investigation. No fixed time multiplier is prescribed: the lead should plan the time needed for this audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 168.</span>",
    "keyPoint": "Plan enough time for translation and keep questions short and focused while retaining the auditor's responsibility for the interview.",
    "distractors": {
      "1": "Long combined questions and compressed summaries increase the chance that meaning or relevant detail will be lost. Keeping unchanged durations also ignores the translation workload.",
      "2": "The skilled independent translator is already technically prepared. Replacing that person with the supervisor of the audited activity weakens independence without solving an identified competence problem.",
      "3": "The proposed arrangement delegates the investigation to a language-support role and leaves the auditors with a later summary. The translator should facilitate the auditors' questions and the operators' responses."
    },
    "trap": "Trying to save translation time by combining questions, compressing answers, or transferring the interview to the translator."
  },
  {
    "qid": "cqa:set-2:q039",
    "set": 2,
    "batch": 4,
    "sub": "cqa-best-practices",
    "bok": "IV.A.7",
    "cognitive": "Evaluate",
    "stem": "An audit program is authorized to identify and share positive practices. At Site A, auditors verify an approved setup-check method and six months of improved first-pass setup results using a consistent measure. The method depends on machine-readable tool IDs and trained setup staff. Site B wants to adopt it but has different tool-identification arrangements and less experienced staff. Local method changes require Site B's existing approval process. Which recommendation best supports a sound transfer?",
    "options": [
      "Adopt Site A's unchanged method at Site B and use Site A's six-month results as the initial effectiveness baseline for both locations.",
      "Withhold the practice from the program's report until an external benchmark confirms it is the industry's best method for controlling setup errors.",
      "Document the results and enabling conditions, then assign Site B's process owner to assess local fit, plan authorized changes, and establish measures and follow-up.",
      "Share Site A's instructions as an improvement suggestion and let each Site B operator adapt them during normal work before deciding whether formal changes are needed."
    ],
    "answer": 2,
    "why": "A useful positive practice is supported by performance evidence and an understanding of the conditions that enable it. The verified results make Site A's method a candidate for transfer, but different identification arrangements and staff experience can affect its use at Site B. Documenting the evidence and enablers allows Site B's process owner to assess fit, arrange authorized adaptations, and measure the local outcome with follow-up. The practice need not first be proven best in the industry to be worth sharing. Conversely, favorable results at one site do not establish equivalent results at another or authorize operators to bypass change controls. The audit objective explicitly includes identification and sharing of positive practices. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 201–203.</span>",
    "keyPoint": "Transfer a positive practice with its performance evidence, enabling conditions, local ownership, and follow-up rather than copying its visible method alone.",
    "distractors": {
      "0": "Site A's results do not supply Site B's baseline or show that the same enablers exist there. Unchanged rollout ignores the stated differences in identification arrangements and staff experience.",
      "1": "A valuable positive practice does not have to be an industry-leading benchmark. Verified internal performance and relevant enabling conditions can justify sharing it for assessment.",
      "3": "An improvement suggestion does not authorize uncontrolled process changes. The proposal bypasses the stated local approval process and provides no clear owner, common measures, or follow-up."
    },
    "trap": "Assuming that a successful practice will transfer unchanged, or that sharing it authorizes local operators to bypass change controls."
  },
  {
    "qid": "cqa:set-2:q040",
    "set": 2,
    "batch": 4,
    "sub": "cqa-verification-validation",
    "bok": "V.G",
    "cognitive": "Analyze",
    "stem": "A handheld inspection application passes engineering's bench tests against its specified data-entry checks and calculation requirements. Its intended use includes inspectors completing jobs while wearing gloves and moving through areas with intermittent network access. Those conditions were not represented in the bench tests, and no other evidence addressing them is available. The release manager says the passed tests establish both verification and validation. Which assessment is best supported?",
    "options": [
      "Classify the bench tests as validation because the application was actually operated; demonstrations by inspectors would verify the documented operating instructions.",
      "Accept both verification and validation as complete because the specified functional tests passed; release approval covers the application's suitability for the intended work.",
      "Classify the tests as verification and use engineering's approval of the intended-use statement as sufficient evidence that the application has also been validated.",
      "Recognize verification of the specified functions, but obtain evidence against intended-use needs under representative real or simulated conditions before claiming validation."
    ],
    "answer": 3,
    "why": "Verification asks whether specified requirements have been fulfilled; the bench results support that conclusion for the tested data-entry and calculation functions. Validation addresses the requirements for the particular intended use or application. The stated evidence does not yet show that inspectors can complete the intended work under the glove and connectivity conditions. Representative real or simulated use can provide the missing validation evidence; the chosen method must address those needs. Both verification and validation can involve tests, observations, and records, so the distinction is not simply physical testing versus document review. Approval of an intended-use statement or release decision does not replace objective evidence of suitability. The gap does not itself prove that the application will fail in use. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 301–302.</span>",
    "keyPoint": "Distinguish conformity to specified requirements from fulfillment of needs for the intended use, regardless of whether the evidence comes from tests or records.",
    "distractors": {
      "0": "Operating the application does not automatically make a test validation. Its purpose and acceptance basis matter: these bench tests address specified functions, not the unrepresented use conditions.",
      "1": "Passing the stated functional tests does not supply evidence for the separate intended-use needs. A release approval cannot fill that demonstrated evidence gap by itself.",
      "2": "Approving the description of an intended use confirms an agreed statement, not that the application fulfills the needs of that use. Objective evidence addressing those needs is still required."
    },
    "trap": "Classifying verification and validation by the physical form of the activity rather than by the requirement or intended-use need being demonstrated."
  },
  {
    "qid": "cqa:set-2:q041",
    "set": 2,
    "batch": 5,
    "sub": "cqa-conduct",
    "bok": "I.E.1",
    "cognitive": "Apply",
    "stem": "On the second day of a supplier audit, an auditor learns that their separate consulting partnership has accepted paid work from the supplier. Another partner negotiated the assignment, but the auditor will share its profit. No such engagement existed when the auditor completed the independence declaration. The audit program manager controls assignments, and a qualified replacement is available. What should the auditor do next?",
    "options": [
      "Continue the assigned work because another partner negotiated the engagement and the auditor has not personally discussed the commercial terms with the supplier.",
      "Arrange an additional review of the final report by a colleague, keeping the commercial relationship private unless that review identifies a biased conclusion.",
      "Promptly disclose the new financial relationship to audit program management and seek a decision on reassignment or other appropriate controls for the conflict.",
      "Ask the supplier's representative to approve continued participation, treating that approval as sufficient because the supplier is the party directly affected by the audit."
    ],
    "answer": 2,
    "why": "A new relationship can create an actual or potential conflict after an audit has started. The auditor's share of the consulting profit creates a relevant financial interest even though another partner negotiated the work. The earlier declaration does not remove the need to disclose changed circumstances promptly. Program management can assess the conflict and determine an appropriate assignment response, including replacement. Private arrangements for report review or an auditee's permission do not substitute for disclosure to the authority responsible for the audit. The auditor should not wait for evidence that the conflict has already influenced a finding. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 31.</span>",
    "keyPoint": "Reassess independence when circumstances change and promptly disclose actual or potential conflicts to the authority managing the audit.",
    "trap": "Treating an earlier independence declaration, indirect financial benefit, or an auditee's consent as a permanent clearance for a new conflict.",
    "distractors": {
      "0": "Negotiating the contract personally is not the deciding factor. The auditor now has a financial interest in work for the auditee, which can affect or appear to affect impartiality.",
      "1": "A second review could be part of an authorized response, but privately arranging it does not disclose the conflict or allow program management to make the assignment decision.",
      "3": "The supplier's consent does not resolve the audit program's independence responsibilities. The relationship must be reported to the authority responsible for managing the assignment."
    }
  },
  {
    "qid": "cqa:set-2:q042",
    "set": 2,
    "batch": 5,
    "sub": "cqa-criteria",
    "bok": "I.C",
    "cognitive": "Analyze",
    "stem": "An audit's agreed criteria include the customer contract and procedure TM-6, which permits tool replacement based on verified condition. The sampled tools satisfy TM-6 and the contract's performance requirements. A trade-association guide in the reference package recommends annual replacement, and some tools are older than a year. The guide is identified as background information; no applicable contract, policy, or other requirement incorporates its annual interval. Which conclusion is supported?",
    "options": [
      "The older tools are nonconforming because including the guide in the reference package makes every recommendation in it part of the agreed audit criteria.",
      "Age alone does not establish a nonconformity to the applicable criteria; the guide's recommendation must be distinguished from requirements actually adopted for this audit.",
      "The older tools are nonconforming to TM-6 because an industry recommendation overrides an approved condition-based method whenever the recommendation sets a shorter interval.",
      "The replacement controls are inadequate because the auditor may use the most conservative published interval as the governing requirement when several methods are available."
    ],
    "answer": 1,
    "why": "Audit findings compare evidence with applicable criteria rather than an auditor's preferred practice. In this scenario, the guide is background information and its annual interval has not been incorporated into a binding requirement for the audit. The stated evidence meets the contract and TM-6, so age alone does not establish the proposed nonconformity. This does not mean that voluntary standards or guidance can never become criteria: an organization may adopt them through contracts or policies. It also does not establish that every aspect of the tool-control system is effective; it resolves only whether this unadopted recommendation supplies the claimed annual requirement. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 20–21.</span>",
    "keyPoint": "Determine which requirements apply and how they were adopted before using external guidance as the basis of a nonconformity.",
    "trap": "Converting a reference recommendation or a personal preference for stricter controls into a requirement that the auditee has not adopted.",
    "distractors": {
      "0": "Availability in a reference package is not the same as adoption as an audit criterion. The stem explicitly identifies this guide as background information.",
      "2": "The guide does not automatically override the approved method. A different conclusion would require an applicable adopted requirement or evidence of failure against the actual criteria.",
      "3": "An auditor's preference for a conservative interval does not authorize replacing the agreed criteria. Published guidance can inform questions without automatically becoming a binding requirement."
    }
  },
  {
    "qid": "cqa:set-2:q043",
    "set": 2,
    "batch": 5,
    "sub": "cqa-evidence-organization",
    "bok": "II.B.6",
    "cognitive": "Apply",
    "stem": "Data-recovery case. The exhibit summarizes verified evidence from a service audit. The agreed rubric assigns Grade 1 to failure to demonstrate contracted recovery capability in a required exercise, even once, and Grade 2 to other record-control failures without identified recovery impact. The lead auditor assigns grades. Management accepts the facts and requirements but wants grades based only on occurrence counts. The audit procedure requires reporting to proceed and permits disputed grades to be recorded and referred to program management. Which classification best applies the agreed rubric to the two observations?",
    "options": [
      "Assign Grade 2 to both observations, because the evidence comes from planned exercises and does not demonstrate loss of customer records during a real outage.",
      "Assign Grade 1 to R2 and Grade 2 to R1, because six missing filing codes provide more evidence of a significant problem than one delayed recovery.",
      "Assign Grade 1 to both observations, because any verified failure to meet an applicable requirement demonstrates the same degree of recovery risk.",
      "Assign Grade 1 to R1 for failing the required four-hour recovery demonstration and Grade 2 to R2 for the record-control failure without identified recovery impact."
    ],
    "answer": 3,
    "why": "R1 did not demonstrate complete recovery within the contracted four hours: seven hours exceeds that requirement. The agreed rubric expressly assigns Grade 1 to such a failure even when observed once. R2 violates the filing-code requirement, but the records remain identifiable and retrievable and the related exercises met recovery requirements; the stated facts therefore support Grade 2. Frequency is relevant information, but counting observations cannot replace evaluation of their significance and the agreed classification rules. The exercise failure is sufficient under this rubric; an actual outage or proven permanent data loss is not an additional condition. These grades are specific to the supplied audit rules, not universal ASQ definitions. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 108–109.</span>",
    "keyPoint": "Classify evidence using its significance, applicable grading rules, and risk; a greater count does not automatically mean a more severe finding.",
    "trap": "Ranking unlike findings solely by frequency, or requiring actual harm before recognizing a failure that the agreed rubric already treats as significant.",
    "distractors": {
      "0": "The rubric explicitly covers required exercises. It does not require actual loss during a real outage before a missed recovery requirement can receive Grade 1.",
      "1": "This substitutes occurrence counts for the agreed severity rules. R1 meets the specified Grade 1 condition, while R2 has no identified recovery impact under the verified facts.",
      "2": "Both observations violate requirements, but the rubric distinguishes their impact. A missing filing code with traceable, successful recovery does not establish the Grade 1 condition."
    },
    "caseId": "cqa-set2-data-recovery-grading-01",
    "chart": {
      "type": "data-table",
      "title": "Data-recovery audit evidence and applicable requirements",
      "columns": [
        "Observation",
        "Applicable requirement",
        "Verified evidence"
      ],
      "rows": [
        [
          "R1",
          "The required exercise must demonstrate complete recovery of customer records within four hours.",
          "One of eight exercises took seven hours to complete recovery; the other seven met the four-hour limit."
        ],
        [
          "R2",
          "Each completed exercise record must include its filing code.",
          "Six of forty records lacked the code. Each was identifiable and retrievable; the six exercises met recovery requirements. No recovery impact was identified."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q044",
    "set": 2,
    "batch": 5,
    "sub": "cqa-closing-meeting",
    "bok": "II.B.7",
    "cognitive": "Apply",
    "stem": "Data-recovery case. The exhibit summarizes verified evidence from a service audit. The agreed rubric assigns Grade 1 to failure to demonstrate contracted recovery capability in a required exercise, even once, and Grade 2 to other record-control failures without identified recovery impact. The lead auditor assigns grades. Management accepts the facts and requirements but wants grades based only on occurrence counts. The audit procedure requires reporting to proceed and permits disputed grades to be recorded and referred to program management. After the lead auditor explains the rubric, the disagreement remains and no new evidence is offered. How should the meeting conclude?",
    "options": [
      "Record the agreed facts and unresolved grading disagreement, retain the rubric-based classifications, and explain the response, referral, and follow-up steps under the audit procedure.",
      "Obtain management's signed agreement to the grades before issuing the results, keeping the report on hold until all participants accept the same conclusions.",
      "Lower the disputed grades provisionally to obtain agreement, then ask program management to reinstate the original grades if a later review supports them.",
      "Issue the classifications without documenting management's disagreement, because the lead auditor's assigned grading authority makes the opposing view irrelevant to the audit record."
    ],
    "answer": 0,
    "why": "The lead auditor should explain the basis of the results, allow factual clarification, and record important discussions and unresolved differences. Here, the facts and requirements are accepted, no new evidence changes the assessment, and the documented procedure provides a route for disputing grades while reporting proceeds. The record and report should preserve the disagreement and its basis; the lead should clarify the required response and follow-up. Acknowledging receipt or discussion of results is not the same as agreeing with every grade. The auditor should neither manufacture agreement by changing supported classifications nor omit the auditee's unresolved view merely because grading authority is assigned to the lead. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 114–116, 130.</span>",
    "keyPoint": "At closing, distinguish agreement on evidence from agreement on classification and handle remaining differences through the documented reporting and response process.",
    "trap": "Treating unanimous acceptance of a grade as a condition for reporting, or treating classification authority as permission to erase a documented disagreement.",
    "distractors": {
      "1": "The procedure requires reporting to continue and supplies a route for disagreement. Requiring signed acceptance of the grades would impose an additional condition and confuse acknowledgment with agreement.",
      "2": "The proposed downgrade has no evidential basis. Obtaining agreement does not justify changing a classification that still follows the agreed rubric.",
      "3": "The authority to assign grades does not make an unresolved opposing view disappear. Recording the difference preserves an accurate account and supports the authorized review process."
    },
    "caseId": "cqa-set2-data-recovery-grading-01",
    "chart": {
      "type": "data-table",
      "title": "Data-recovery audit evidence and applicable requirements",
      "columns": [
        "Observation",
        "Applicable requirement",
        "Verified evidence"
      ],
      "rows": [
        [
          "R1",
          "The required exercise must demonstrate complete recovery of customer records within four hours.",
          "One of eight exercises took seven hours to complete recovery; the other seven met the four-hour limit."
        ],
        [
          "R2",
          "Each completed exercise record must include its filing code.",
          "Six of forty records lacked the code. Each was identifiable and retrievable; the six exercises met recovery requirements. No recovery impact was identified."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q045",
    "set": 2,
    "batch": 5,
    "sub": "cqa-ineffective-capa",
    "bok": "II.D.4",
    "cognitive": "Evaluate",
    "stem": "A supplier's corrective action was intended to prevent work orders from using obsolete customer limits. Installation and training were verified, but three later jobs repeated the same requirement failure. The auditor and process owner have checked the evidence, the follow-up method, and resource availability; the recurrence is confirmed. Discussion has produced no acceptable revised response. The audit procedure requires the request to remain open and authorizes referral to program management at this stage. Which follow-up strategy is best?",
    "options": [
      "Close the original request because the approved installation and training were completed, and record the three later jobs as a separate issue with no link to it.",
      "Keep the request open, document the recurrence and prior review, seek renewed cause analysis and a revised plan, and use the authorized management referral route.",
      "Allow the owner to repeat the same training plan until the next annual audit, because verified implementation shows that the selected corrective action remains appropriate.",
      "Prescribe the auditor's preferred technical replacement as the required corrective action, and use its installation as the sole condition for closing the outstanding request."
    ],
    "answer": 1,
    "why": "The verified recurrence shows that implementation did not produce the intended result. The initial reassessment has already checked for mistaken evidence, an inadequate verification method, and resource obstacles, and discussion has not produced an acceptable response. Keeping the request open and documenting the history preserves the connection to the failed action. Renewed analysis and a revised plan are needed, with formal escalation through the route authorized for this stage. The auditor should not close solely on installation or training, repeat an unsupported solution indefinitely, or take over management's responsibility for selecting the technical correction. Subsequent closure should depend on the applicable implementation and effectiveness requirements. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 140–141.</span>",
    "keyPoint": "After verified corrective-action failure, preserve the finding's history, reassess the response, and use documented escalation when the evaluated circumstances justify it.",
    "trap": "Equating completed action steps with effectiveness, or moving from a confirmed recurrence directly to an auditor-prescribed technical solution.",
    "distractors": {
      "0": "Implementation does not establish effectiveness. Closing and severing the link would hide the failed corrective-action history and contradict the stated procedure.",
      "2": "The same failure recurred despite implementation, and prior review and discussion produced no acceptable revised response. Repeating the training plan without renewed analysis does not address the demonstrated ineffectiveness.",
      "3": "The auditor can challenge the response and use the escalation process but should not substitute a preferred technical design for the auditee's corrective-action responsibilities. Installation alone would again fail to establish effectiveness."
    }
  },
  {
    "qid": "cqa:set-2:q046",
    "set": 2,
    "batch": 5,
    "sub": "cqa-conflict-deescalation",
    "bok": "III.C",
    "cognitive": "Analyze",
    "stem": "During a discussion of unexplained timestamp differences in a maintenance log, an auditor tells the supervisor, 'You changed these records.' The supervisor raises her voice, and the auditor responds loudly; neither is listening to clarification. A copy of the log is secured, no immediate safety issue or urgent decision is involved, and the lead can allow a brief pause. What should the lead auditor do next?",
    "options": [
      "Ask the supervisor's manager to require an immediate explanation while the interview continues, using management authority to bring the discussion back under control.",
      "Reclassify the timestamp issue as an improvement suggestion and move to the next topic, allowing both participants to leave the disagreement behind them.",
      "Pause the exchange, then hear both accounts calmly and examine the evidence, including whether the auditor's wording contributed to the misunderstanding.",
      "Continue with short yes-or-no questions about each timestamp, limiting both participants to factual answers until the original discrepancy has been fully resolved."
    ],
    "answer": 2,
    "why": "The heated exchange is preventing useful communication. A brief cooling-off period is appropriate under the stated conditions, followed by calm listening and examination of the unresolved issue. The lead should remain open to the auditor's contribution: the accusation went beyond the unexplained timestamp differences. Cooling down does not settle whether records were changed improperly, remove the need for evidence, or justify a weaker classification. Using rank to force an immediate answer or continuing the same tense exchange can escalate the conflict. Short factual questions may help later, once the conditions for reliable discussion have been restored. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 155.</span>",
    "keyPoint": "Defuse a heated exchange, then investigate the substantive issue with an open mind, including the auditor's possible contribution to the conflict.",
    "trap": "Confusing a pause to restore communication with dropping the issue, or trying to resolve an escalating argument through authority or tighter questioning.",
    "distractors": {
      "0": "Invoking management authority while the heated exchange continues can intensify the conflict. No urgent decision requires an immediate compelled explanation here.",
      "1": "An unresolved discrepancy should not be downgraded merely to restore harmony. Its significance must be determined from the applicable criteria and evidence.",
      "3": "Closed questions can be useful, but changing their form does not resolve the stated loss of listening and self-control. Calm discussion should be restored first."
    }
  },
  {
    "qid": "cqa:set-2:q047",
    "set": 2,
    "batch": 5,
    "sub": "cqa-team-development",
    "bok": "III.F",
    "cognitive": "Apply",
    "stem": "Halfway through a multi-site audit, the client approves a revised purpose that adds investigation of failures between site processes. Two qualified auditors join the previously cohesive team. Members now duplicate evidence requests and dispute who owns the new interface reviews. Their technical competence and available resources are adequate. Which action by the lead best supports effective teamwork under the revised plan?",
    "options": [
      "Review the revised objectives and responsibilities with the whole team, clarify interface handoffs and deliverables, and monitor how the agreed arrangements work during the remaining audit.",
      "Keep the original role split and ask each auditor to finish independently, reserving conflicting interface evidence for the report-writing meeting after fieldwork is complete.",
      "Have the longest-serving members decide interface assignments informally, allowing incoming members to learn the team's former methods by observing until familiar working relationships return.",
      "Replace the two incoming auditors with members of the previous team, preserving its former working relationships and assignments throughout the audit's newly approved interface reviews."
    ],
    "answer": 0,
    "why": "Changes to a team's goals or purpose can return it to issues associated with forming or storming, even when it previously worked cohesively. Here, the revised purpose and changed membership make responsibilities and interfaces unclear; no technical competence or resource deficit has been established. The lead should rebuild a shared understanding of objectives, assignments, methods, and deliverables and check that the revised arrangements support the work. Preserving old assignments, relying on seniority, or restoring old membership does not by itself address the new interfaces. The response applies team-development principles without requiring the team to pass through a fixed sequence of stages before it can continue. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 172–173, 175.</span>",
    "keyPoint": "When the audit's purpose changes, re-establish shared objectives and responsibilities instead of assuming earlier team cohesion will carry over automatically.",
    "trap": "Treating a previously effective team as permanently settled, or blaming new members before clarifying the changed work and interfaces.",
    "distractors": {
      "1": "The original role split did not resolve responsibility for the new interfaces. Delaying coordination until reporting allows duplicated work and gaps to continue during evidence collection.",
      "2": "Seniority and familiarity do not establish assignments for the revised purpose. All members need an explicit, shared understanding of their responsibilities and deliverables.",
      "3": "The incoming auditors are qualified, and the work itself has changed. Restoring the old membership and assignments does not establish how the new interfaces will be reviewed."
    }
  },
  {
    "qid": "cqa:set-2:q048",
    "set": 2,
    "batch": 5,
    "sub": "cqa-electronic-record-retention",
    "bok": "IV.A.10",
    "cognitive": "Apply",
    "stem": "An internal audit reviews migration of an electronic audit-record archive. The approved retention procedure requires reports and their supporting attachments to remain complete and readable for six years. Migration totals match the source file counts, and backup logs show successful jobs. Demonstrations have opened only recent reports, without attachments. The legacy archive remains available but is scheduled for retirement. Which additional check most directly addresses the remaining retention risk?",
    "options": [
      "Compare the last month's backup-job logs with the archive schedule and accept repeated successful results as evidence that all migrated records can be read.",
      "Review the migration vendor's completion certificate and reconcile the aggregate file counts again, treating agreement as evidence that the required record contents remain usable.",
      "Open several newly created reports and their attachments in the new system, using their readability to confirm that records retained from earlier years are accessible.",
      "Retrieve sampled migrated reports and attachments across retained years, compare their complete readable contents with the legacy source, and check access through the authorized retrieval route."
    ],
    "answer": 3,
    "why": "The requirement concerns the completeness and readability of retained reports and supporting attachments. Aggregate counts and successful backup jobs do not demonstrate that migrated contents can be retrieved and read with the required attachments. Checking sampled retained records across relevant years against the still-available legacy source directly tests that risk through the authorized retrieval route. New records alone do not exercise the migration of older content. The checks provide evidence for the sampled records and can identify a need for further investigation; they do not guarantee every record is intact. The six-year period comes from this organization's stated procedure, not a universal audit-record retention rule. Electronic records require controls against loss or modification and continued means of reading them throughout the required retention period. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 73, 131–132.</span>",
    "keyPoint": "Check that retained electronic records remain complete, readable, and retrievable; successful file transfers or backup jobs alone do not establish that result.",
    "trap": "Treating matching file counts or a successful backup status as proof that historical records and their attachments remain usable.",
    "distractors": {
      "0": "Backup success shows the reported operation completed, not that the migrated reports and attachments can be correctly retrieved and read. The stated evidence gap remains.",
      "1": "A completion certificate and aggregate counts do not establish content completeness or readability. Files can exist while required attachments or meaningful content are inaccessible.",
      "2": "New records test current creation and viewing functions. They do not test whether retained historical records survived migration with their supporting attachments."
    }
  },
  {
    "qid": "cqa:set-2:q049",
    "set": 2,
    "batch": 5,
    "sub": "cqa-business-process-interdependence",
    "bok": "IV.B.2",
    "cognitive": "Understand",
    "stem": "A service centre measures its intake unit by the percentage of applications forwarded to assessment on the day received. To improve that result, intake forwards files before collecting all required attachments. Assessment returns incomplete files, creating repeated handoffs. Verified records show that same-day forwarding increased while the time from initial receipt to final decision also increased. Which statement best explains how these results can occur together?",
    "options": [
      "The forwarding measure and decision time use different units, so their opposite movements indicate a measurement error rather than an interaction between the two processes.",
      "The intake measure rewards an early handoff even when the file is incomplete, allowing a local improvement to create rework and delay in the connected process.",
      "Meeting the intake target establishes that its contribution has improved, so the longer decision time is attributable to assessment's workload independently of the handoff condition.",
      "Once a file is forwarded, the units operate as separate processes; returning incomplete files therefore shows a response by assessment rather than an effect of intake's goal."
    ],
    "answer": 1,
    "why": "The units are interdependent: the condition of the file leaving intake affects what assessment can do next. A measure that rewards forwarding before completeness can improve intake's reported result while adding returns, rework, and delay to the overall service. This is local suboptimization, in which one activity's target is met at the expense of the connected process. The opposing measures do not by themselves indicate an arithmetic error, and the observed handoffs prevent treating assessment as independent of intake. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 216.</span>",
    "keyPoint": "Interpret local performance measures in the context of the handoffs and outcomes of the connected business process.",
    "trap": "Assuming that meeting a departmental target necessarily improves the service delivered by the system as a whole.",
    "distractors": {
      "0": "Different measures can legitimately move in opposite directions. The documented incomplete-file handoffs explain why the local result can improve while overall completion slows.",
      "2": "The input supplied to assessment affects its work. Treating the delay as independent of the incomplete handoff ignores the relationship established in the stem.",
      "3": "A handoff connects the units; it does not make them independent. Returning incomplete files is part of the downstream effect of forwarding them before they are ready."
    }
  },
  {
    "qid": "cqa:set-2:q050",
    "set": 2,
    "batch": 5,
    "sub": "cqa-central-tendency-workload",
    "bok": "V.C.1",
    "cognitive": "Apply",
    "stem": "An auditor checks a report of labour used for all eight service requests completed during one shift. The exhibit gives each request's verified total labour time; no work is omitted or counted twice. The 48-minute request is a genuine completed job. The report needs one minutes-per-request summary that, when multiplied by eight, reconciles to the total recorded labour for these requests. Which value should be reported?",
    "options": [
      "11.5 minutes, using the midpoint of the two central values after ordering all eight recorded request times.",
      "11.4 minutes, using the average of the seven shorter requests after excluding the unusually long completed job.",
      "16.0 minutes, using the arithmetic mean of the recorded labour times for all eight completed service requests.",
      "11.0 minutes, using the most frequently recorded request time as the representative value for the completed work."
    ],
    "answer": 2,
    "why": "The required summary must preserve the actual total labour for these eight requests. Their times sum to 128 minutes, so the arithmetic mean is 128 ÷ 8 = 16.0 minutes per request; 16.0 × 8 reproduces 128. The ordered middle values are 11 and 12, giving a median of 11.5. The mode is 11 because it occurs twice. Excluding the valid 48-minute job gives 80 ÷ 7 = 11.4286, or 11.4 minutes to one decimal, but that changes the set being summarized. The median can be useful for describing a central request when an extreme value affects the mean, but it does not reconcile this observed total. The calculation describes these completed requests and makes no forecast about future workload or sustainable capacity. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 267–268.</span>",
    "keyPoint": "Use the arithmetic mean when a per-item summary must reconcile to the actual total across all items in a defined data set.",
    "trap": "Automatically replacing the mean with the median, or discarding a valid long case, without considering the stated purpose of the summary.",
    "distractors": {
      "0": "The median is correctly calculated as (11 + 12) ÷ 2 = 11.5, but 11.5 × 8 = 92 minutes, not the observed total of 128 minutes.",
      "1": "The rounded calculation follows from removing the 48-minute request. The stem requires all eight completed requests, so excluding a valid job fails the stated reporting purpose.",
      "3": "The mode is correctly identified as 11, but 11 × 8 = 88 minutes. The most frequent time does not preserve the actual total labour for this set."
    },
    "chart": {
      "type": "data-table",
      "title": "Verified labour for all eight completed requests",
      "columns": [
        "Request",
        "Total labour (minutes)"
      ],
      "rows": [
        [
          "R1",
          "8"
        ],
        [
          "R2",
          "9"
        ],
        [
          "R3",
          "11"
        ],
        [
          "R4",
          "11"
        ],
        [
          "R5",
          "12"
        ],
        [
          "R6",
          "14"
        ],
        [
          "R7",
          "15"
        ],
        [
          "R8",
          "48"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q051",
    "set": 2,
    "batch": 6,
    "sub": "cqa-joint-audit",
    "bok": "I.A.1",
    "cognitive": "Analyze",
    "stem": "A manufacturer is planning a supplier audit of one quality management system. A second customer would like to avoid a separate visit but needs to participate as an auditing organization. The existing purpose and quality-system criteria will remain unchanged. Which proposed arrangement would make this a joint audit while retaining that scope?",
    "options": [
      "Have the first customer's team also review the supplier's environmental management system, with each discipline preparing its results for the lead auditor.",
      "Divide the first customer's auditors into procurement and production groups, then combine their quality-system observations into one report for both customers.",
      "Invite a representative of the second customer to observe the opening and closing meetings, while the first customer's team conducts all auditing work.",
      "Have auditors from both customers share responsibility for auditing the same quality management system under an agreed plan and consolidated reporting arrangement."
    ],
    "answer": 3,
    "why": "A joint audit involves two or more auditing organizations sharing the audit work. The final arrangement brings auditors from both customers into the examination of the same quality management system while preserving the stated purpose and criteria. Adding an environmental management system would create a multiple-system audit and broaden the specified scope; it would not, by itself, bring another auditing organization into the work. Splitting one organization's team into groups also does not create a joint audit. A second customer's presence as an observer or recipient of the report is different from sharing responsibility for conducting the audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 2.</span>",
    "keyPoint": "Distinguish the number of participating auditing organizations from the number of management systems or internal audit subgroups.",
    "trap": "Treating several auditors, several report recipients, or several management systems as sufficient evidence that an audit is joint.",
    "distractors": {
      "0": "This adds an environmental management system to the quality-system scope. Multiple systems characterize a combined approach, but this proposal still has only the first customer's auditing organization.",
      "1": "Two work groups from the same auditing organization remain one organization's team. Sending the resulting report to another customer does not make that customer a co-auditor.",
      "2": "The second customer's representative only observes meetings. The first customer still conducts all the audit work, so the proposed arrangement does not share auditing responsibility."
    }
  },
  {
    "qid": "cqa:set-2:q052",
    "set": 2,
    "batch": 6,
    "sub": "cqa-unsafe-condition",
    "bok": "I.E.1",
    "cognitive": "Apply",
    "stem": "During a supplier's document-control audit, a damaged overhead rack begins leaning toward the interview area. Site rules require immediate withdrawal, and the team has a clear route to the designated safe area. Warehouse safety is outside the agreed scope, and the lead cannot direct supplier operations. The escort asks the team to finish the current record first. What should the lead do?",
    "options": [
      "Suspend the audit activity, move the team to safety, immediately alert the responsible auditee representative, and document the observation once it is safe.",
      "Notify the client and wait for approval to change the audit plan before moving the team, since warehouse safety is outside the agreed scope.",
      "Ask the escort to stabilize the rack while the auditors finish the selected record, so the evidence trail is not interrupted by the incident.",
      "Move the team to safety and direct the supplier to close the entire warehouse until the lead auditor completes a newly expanded safety audit."
    ],
    "answer": 0,
    "why": "The condition directly endangers the audit team, and the stated site rule requires immediate withdrawal. The lead should suspend the activity and take the team to the designated safe area, promptly inform the responsible auditee representative, and make a record when safe to do so. An unsafe condition cannot be ignored because it lies outside the quality-audit scope. Protecting people does not require waiting for a scope-change approval or completing the current evidence review. It also does not grant the lead authority to direct the supplier's operations or unilaterally expand the audit into a new safety assignment. Any subsequent audit-plan decision follows the applicable arrangements after the immediate danger is addressed. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 35.</span>",
    "keyPoint": "Respond promptly to an observed unsafe condition and withdraw an endangered audit team, even when the hazard lies outside the agreed audit scope.",
    "trap": "Allowing scope boundaries or evidence-preservation concerns to delay safety action, or treating that action as authority to control the auditee's operations.",
    "distractors": {
      "1": "The team is endangered and the site rule already requires withdrawal. Waiting for administrative approval would delay the immediate protective action.",
      "2": "Continuing the review leaves people exposed and asks the escort to manage a hazardous rack instead of withdrawing. Preserving an uninterrupted evidence trail does not justify that risk.",
      "3": "Moving to safety is appropriate, but the stated role does not authorize the lead to close supplier operations or create an expanded safety-audit assignment."
    }
  },
  {
    "qid": "cqa:set-2:q053",
    "set": 2,
    "batch": 6,
    "sub": "cqa-reliance-exposure",
    "bok": "I.E.2",
    "cognitive": "Analyze",
    "stem": "An audit firm reviews a supplier's release controls before a customer commits to a large order. The agreed approach permits sampling. The auditor examines only day-shift records and performs no work on night-shift controls, but reports having directly verified release checks on both shifts. The customer relies on that assurance when placing the order. Night-shift release failures later cause losses. The firm points out that the supplier operated the process. Which assessment of potential exposure is most appropriate?",
    "options": [
      "Treat the loss solely as the supplier's responsibility, because operational ownership prevents a separate claim connected with the audit firm's assurance.",
      "Treat sampling as the main liability issue, because reasonable care requires checking every release transaction before reporting any conclusion about the supplier's controls.",
      "Consider potential exposure from reliance on the unsupported assurance, while recognizing that responsibility and damages depend on the facts and applicable legal assessment.",
      "Limit any concern to replacing the audit report, because the customer's decision to place the order removes financial consequences from the auditor's statement."
    ],
    "answer": 2,
    "why": "A key liability consideration is whether an organization relies on audit information when making a decision. Here, the claim of directly verifying both shifts contradicts the work actually performed, and the customer relies on it when committing to the order. That combination can create potential legal and financial exposure for the auditor or auditing firm, even though the supplier operates the process. The facts do not establish a particular legal outcome, allocation of responsibility, or amount of damages. Those questions require assessment under the relevant circumstances and applicable law. The issue is the unsupported assurance and its use in a decision, not merely the use of the sampling approach that the parties agreed. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 41.</span>",
    "keyPoint": "Keep assurance within the evidence: reliance on unsupported audit statements can create legal and financial exposure beyond the auditee's operational responsibilities.",
    "trap": "Assuming that the supplier's ownership of the process or the client's final decision automatically insulates the auditor from the consequences of an unsupported assurance.",
    "distractors": {
      "0": "Operational responsibility does not by itself eliminate the separate relevance of the audit firm's statement and the customer's reliance on it. The proposed blanket exclusion of exposure is unsupported.",
      "1": "The stated approach permits sampling. Nothing in the scenario establishes a universal duty to inspect every transaction; the concern is the claim of direct verification that contradicts the work actually performed.",
      "3": "A decision made in reliance on the assurance is the connection that needs examination. The facts provide no basis for limiting potential consequences to replacement of the report."
    }
  },
  {
    "qid": "cqa:set-2:q054",
    "set": 2,
    "batch": 6,
    "sub": "cqa-access-logistics",
    "bok": "II.A.4",
    "cognitive": "Apply",
    "stem": "A supplier audit is scheduled in three weeks. Its client-approved scope includes restricted engineering records. The site requires separate security clearance for those records and permits copies only in an approved on-site workspace. Visitor badges are booked, but record-access clearance and the workspace have not been arranged. The lead is preparing the final logistics plan. Which action best makes the planned evidence review feasible?",
    "options": [
      "Proceed with the booked visit, treating the approved scope and visitor badges as sufficient authority to view and copy the restricted engineering records.",
      "Confirm authorized record access and secure workspace arrangements before arrival, then resolve any remaining access limits with the client through the audit-planning process.",
      "Ask an escort to retrieve the restricted records under the escort's own access and send copies to the auditors' personal accounts before the visit.",
      "Keep the visit unchanged and replace the restricted-record review with publicly available procedures, recording the narrower evidence coverage only in the final report."
    ],
    "answer": 1,
    "why": "Audit preparation must establish workable access to the facilities, information, and equipment needed for the planned review, including security conditions and safe handling of confidential information. The visitor badges do not supply the separately required record clearance or workspace. Confirming those arrangements in advance directly addresses the known gaps. If an access limitation cannot be resolved, it should be raised through the planning process so the client can make an informed decision about the audit. Using the escort to bypass the required clearance and sending copies outside the permitted workspace would not meet the stated controls. Silently replacing the planned evidence review would leave the approved audit purpose and coverage unresolved. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 74–75.</span>",
    "keyPoint": "Confirm the specific access and confidentiality arrangements needed for the audit; a scheduled visit or general visitor admission does not establish them.",
    "trap": "Treating an approved scope as automatic security clearance, or substituting accessible material without resolving the effect on the agreed audit.",
    "distractors": {
      "0": "The site expressly requires separate clearance and an approved workspace. General visitor admission and the client's scope approval do not fulfill those distinct arrangements.",
      "2": "The proposal bypasses the auditors' required clearance and sends copies outside the only permitted workspace. An escort's access is not a substitute for the stated authorization process.",
      "3": "Public procedures do not replace the planned examination of restricted records. Waiting until the final report to disclose a known access-related reduction prevents an informed planning decision."
    }
  },
  {
    "qid": "cqa:set-2:q055",
    "set": 2,
    "batch": 6,
    "sub": "cqa-auditee-evidence-access",
    "bok": "II.B.2",
    "cognitive": "Apply",
    "stem": "During an audit, the auditor requests six identified maintenance records from the prior year. The archive owner confirms that all six are available but needs 45 minutes to retrieve them from controlled storage. Two hours remain in the visit. The auditee's coordinator can arrange retrieval immediately, and other planned audit activities are available. Six recent records are already at hand and appear complete. What should the coordinator do?",
    "options": [
      "Arrange retrieval of the selected records, explain the expected timing, and ask whether another planned activity can be reviewed meanwhile without changing the original request.",
      "Provide the six recent complete records as the replacement sample, because their immediate availability keeps the audit moving and demonstrates how the current process operates.",
      "Keep the audit team waiting without proposing other work, because changing the order of activities would necessarily change the approved scope and invalidate the audit plan.",
      "Prepare a summary of the archive owner's confirmation and ask the auditor to accept it instead of the records so retrieval does not delay the schedule."
    ],
    "answer": 0,
    "why": "The auditee's coordinator should facilitate access to requested evidence and communicate logistical constraints. Arranging retrieval, explaining the delay, and seeking the auditor's agreement to review other planned work preserves both progress and the original evidence request. The available recent records cannot be substituted unilaterally merely because they are convenient or appear complete. A change in the sequence of already planned activities does not necessarily change the scope. The archive owner's confirmation establishes that the requested records can be obtained; it does not supply their contents or demonstrate conformity with the requirements being examined. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 94.</span>",
    "keyPoint": "Help the audit progress through timely access and agreed coordination while preserving the auditor's requested evidence.",
    "trap": "Mistaking logistical assistance for permission to replace selected evidence with readily available or favourable records.",
    "distractors": {
      "1": "These are different records from a different period. The coordinator cannot replace the auditor's selected evidence simply to save time or present complete-looking examples.",
      "2": "The coordinator can communicate the delay and propose a practical sequence change for the auditor to agree. Reordering planned work does not automatically expand or invalidate the scope.",
      "3": "A statement that records exist does not replace the records needed for examination. Retrieval is available within the visit, so the coordinator should facilitate the original request."
    }
  },
  {
    "qid": "cqa:set-2:q056",
    "set": 2,
    "batch": 6,
    "sub": "cqa-partial-audit-closure",
    "bok": "II.D.5",
    "cognitive": "Apply",
    "stem": "An internal audit has three separately tracked findings. Follow-up records establish that findings F1 and F2 meet every agreed implementation and effectiveness criterion. F3's action is installed, but its agreed effectiveness check is scheduled for next month and is not overdue. The local procedure permits individual finding closure but keeps the overall audit open until all findings meet their closure criteria. The lead may issue written status updates to the original report recipients. Which closeout action is appropriate now?",
    "options": [
      "Close all three findings and the audit, recording F3's later check as routine surveillance because its action is installed.",
      "Leave all three findings open and issue one closure notice after F3's effectiveness check, so the audit has one completion date.",
      "Close F1 and F2 in the tracker but defer written notification until F3 is resolved, avoiding multiple notices about one audit.",
      "Close F1 and F2 with written notification of the verification results, and keep F3 and the overall audit open pending F3's remaining verification."
    ],
    "answer": 3,
    "why": "Individual findings can be tracked and closed separately when their closure criteria have been met. F1 and F2 have verified implementation and effectiveness, so their accepted status should be recorded and communicated in writing to the original report recipients. F3 has not yet met its agreed effectiveness criterion; installation alone does not satisfy that remaining condition. The status update should therefore distinguish the two closed findings from the still-open F3 and overall audit. There is no need to delay acknowledgment of verified work until every finding is resolved, and an agreed future verification date does not by itself make F3 overdue or ineffective. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 141–142.</span>",
    "keyPoint": "Close and communicate each verified finding accurately while keeping unresolved findings and the overall audit status visible.",
    "trap": "Treating closure as an all-or-nothing choice between leaving every finding open and closing the entire audit.",
    "distractors": {
      "0": "F3 still lacks the agreed effectiveness verification. Relabeling that required check as routine surveillance does not satisfy its closure criterion.",
      "1": "The procedure permits individual closure, and F1 and F2 already meet all their criteria. A single overall completion date does not require their verified resolution to remain unacknowledged.",
      "2": "Updating an internal tracker alone does not provide the written notification of accepted corrective action to the original report recipients. Their status information would remain incomplete."
    }
  },
  {
    "qid": "cqa:set-2:q057",
    "set": 2,
    "batch": 6,
    "sub": "cqa-interview-meaning-confirmation",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "During an audit of a repair service, a technician says, 'We release the unit before the final test.' The auditor starts to summarize this as dispatch before testing. The technician corrects that interpretation: 'Here, release means move it into the test queue; dispatch is a separate step.' The applicable procedure requires a satisfactory final test before dispatch. No relevant records have yet been examined. Which response best checks the auditor's understanding and develops reliable evidence?",
    "options": [
      "Ask the technician to repeat 'released before the final test' for the notes, then classify the statement against the dispatch requirement.",
      "Confirm, 'You mean entry to the test queue, rather than dispatch—is that accurate?' Invite correction, then examine a recent unit's test and dispatch records.",
      "Accept the local definition, remove the preliminary concern from the notes, and proceed to the next process without reviewing a unit.",
      "Ask whether the technician follows the dispatch procedure, and treat an affirmative answer as confirmation that the described sequence complies."
    ],
    "answer": 1,
    "why": "The technician has identified a difference between local terminology and the auditor's interpretation. Restating the meaning and inviting correction checks that the auditor has understood the account accurately. The next step is to corroborate the relevant sequence through test and dispatch evidence for a recent unit. A confirmed paraphrase establishes shared meaning; it does not by itself establish conformity. Repeating the original wording without its clarification would preserve the misunderstanding, while a general assurance of compliance would not demonstrate when testing and dispatch occurred. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 159, 169.</span>",
    "keyPoint": "Confirm what an interviewee means, then corroborate the account against the relevant evidence and criteria.",
    "trap": "Equating an unfamiliar local label with a familiar process step, or treating clarified terminology as verified conformity.",
    "distractors": {
      "0": "The repeated phrase omits the technician's clarification and still treats entry to the test queue as dispatch. A quotation can be accurate yet misleading when its meaning is ignored.",
      "2": "The explanation of terminology removes one possible misunderstanding, but it does not verify that the required test preceded dispatch for actual units.",
      "3": "A broad yes/no assurance does not confirm the specific sequence or provide corroborating evidence. The auditor should check the clarified account using relevant records."
    }
  },
  {
    "qid": "cqa:set-2:q058",
    "set": 2,
    "batch": 6,
    "sub": "cqa-on-site-schedule-adjustment",
    "bok": "III.B",
    "cognitive": "Apply",
    "stem": "At 09:00 on an on-site audit, the lead learns that the supervisor scheduled for 09:00–09:45 can attend only 10:00–10:45. A required independent record review is scheduled for 10:00–10:45; its records and supporting staff are available in either period. The two activities have no sequence dependency, and each slot includes time to confirm notes. Other appointments and the closing-preparation period are fixed. The lead may change the sequence within the agreed scope. Which adjustment is best?",
    "options": [
      "Exchange the two activity slots, confirm the changes with affected participants, and preserve their note-review time and the closing-preparation period.",
      "Wait for the supervisor, complete the interview at 10:00, and move the record review into the reserved closing-preparation period.",
      "Keep the record review at 10:00, obtain the supervisor's written assurances, and remove the interview so the published schedule remains unchanged.",
      "Hold abbreviated versions of both activities from 10:00 to 10:45 and combine their note review with the closing meeting."
    ],
    "answer": 0,
    "why": "The record review can move to 09:00–09:45 without a dependency or availability conflict. The interview can then use the supervisor's 10:00–10:45 window. Coordinating that exchange with affected participants preserves both required activities, their planned time for confirming notes, and the fixed closing preparation. An audit schedule can be adjusted with appropriate communication; preserving its original order is not the objective when a feasible change better supports evidence collection. Waiting, replacing the interview with assurances, or compressing both activities would sacrifice planned work or preparation unnecessarily. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 152–153.</span>",
    "keyPoint": "Coordinate feasible schedule changes around participant availability while preserving required evidence work and review time.",
    "trap": "Protecting the original order of appointments at the expense of evidence collection or closing preparation.",
    "distractors": {
      "1": "Waiting leaves a usable period idle and displaces the required record review into time already reserved for closing preparation. The available exchange avoids both effects.",
      "2": "A written assurance is not an established substitute for the required interview in this scenario. Removing planned evidence work is unnecessary when both activities still fit.",
      "3": "This halves the combined time allocated to the two activities and postpones note confirmation until the closing meeting. Neither compromise is needed under the stated availability and sequencing conditions."
    }
  },
  {
    "qid": "cqa:set-2:q059",
    "set": 2,
    "batch": 6,
    "sub": "cqa-management-review-risk-input",
    "bok": "IV.A.9",
    "cognitive": "Evaluate",
    "stem": "An audit program is intended to assess whether customer requirements are controlled through outsourced service handoffs. Two successive audits of established providers found similar omissions in those handoffs; corrective actions are underway, but effectiveness has not been verified. The company has since added several providers that the program has not yet audited. All planned audits of established providers were completed, and the next quarter's auditor time is fully allocated. Which management-review input is most useful?",
    "options": [
      "Emphasize full schedule completion and planned action dates as evidence that the objective is met; review the added providers in next year's planning cycle.",
      "Present the two reports and current action status as separate agenda items; let management infer their common risk and the effect of the added providers.",
      "Extend the existing findings to the added providers and request immediate corrective actions from them before considering changes to audit resources.",
      "Summarize the recurring handoff weakness, unverified actions and limits of coverage, and seek decisions on targeted follow-up and any needed reprioritization or resources."
    ],
    "answer": 3,
    "why": "Management needs an integrated account of what the program's results mean for its objective. The similar handoff findings, unverified corrective-action effectiveness, and added providers beyond the completed audit coverage are relevant to the remaining risk and the next review priorities. Showing that auditor time is already allocated makes the possible need for reprioritization or additional resources visible for management's decision. Completed audits and scheduled actions are useful status measures, but they do not establish that the handoff controls are effective. The findings also do not prove that the newly added providers have the same omissions; those providers represent a coverage question to assess, not automatically additional nonconformities. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 209–210.</span>",
    "keyPoint": "Connect audit patterns, action effectiveness and coverage limits to the risk and resource decisions management needs to make.",
    "trap": "Using schedule completion as assurance of effective controls, or extending findings to activities that have not been examined.",
    "distractors": {
      "0": "Full completion of the earlier schedule does not resolve the handoff weaknesses, verify the actions, or address the added providers. Deferring consideration to the next annual cycle leaves relevant current decisions unsupported.",
      "1": "The reports and action status are relevant, but leaving their relationship and changed coverage unexplained gives management less useful input than an integrated summary tied to risk and decisions.",
      "2": "Findings from the established providers do not establish nonconformities at the added providers. Management needs to consider the coverage and resource implications before drawing conclusions about unaudited work."
    }
  },
  {
    "qid": "cqa:set-2:q060",
    "set": 2,
    "batch": 6,
    "sub": "cqa-lean-takt-demand",
    "bok": "V.B.2",
    "cognitive": "Apply",
    "stem": "A kit-assembly team uses takt time to plan the pace needed for this shift's customer demand. The exhibit gives the approved schedule: net available time already excludes all planned breaks, and no other time deductions apply. What takt time should be used?",
    "options": [
      "3.50 minutes per kit, using net available time and the previous comparable shift's completed output.",
      "3.43 minutes per kit, using the full scheduled shift and this shift's customer demand.",
      "3.00 minutes per kit, using net available production time and this shift's customer demand.",
      "2.57 minutes per kit, deducting the listed breaks again before using this shift's customer demand."
    ],
    "answer": 2,
    "why": "Takt time is available work time divided by customer demand for the same period. The approved net time is 420 minutes, and this shift requires 140 kits, so takt is 420 / 140 = 3.00 minutes per kit. The required average pace is therefore one kit per three available production minutes. The 60 minutes of breaks have already been removed from the 480-minute shift and must not be subtracted again. The previous shift's 120 completed kits describe past output, not this shift's customer demand. This calculation defines the required pace; it does not measure actual cycle time or demonstrate that the process can achieve that pace. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 264.</span>",
    "keyPoint": "Calculate takt from net available work time and customer demand for the same period, with each time deduction counted once.",
    "trap": "Substituting achieved output for customer demand, using gross time, or deducting breaks twice.",
    "distractors": {
      "0": "420 / 120 = 3.50 uses completed output from the previous shift. It does not set the pace required for the current demand of 140 kits.",
      "1": "480 / 140 is approximately 3.43, but the full scheduled shift includes 60 minutes when no production is available. Takt must use the approved 420 available minutes.",
      "3": "(420 - 60) / 140 is approximately 2.57. This subtracts the same breaks twice because the supplied 420 minutes are already net of them."
    },
    "chart": {
      "type": "data-table",
      "title": "Shift time, customer demand and comparison output",
      "columns": [
        "Item",
        "Value"
      ],
      "rows": [
        [
          "Scheduled shift duration",
          "480 minutes"
        ],
        [
          "Total planned breaks with no production",
          "60 minutes"
        ],
        [
          "Net available production time",
          "420 minutes"
        ],
        [
          "Customer demand for this shift",
          "140 kits"
        ],
        [
          "Completed output in the previous comparable shift",
          "120 kits"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q061",
    "set": 2,
    "batch": 7,
    "sub": "cqa-desk-review-evidence-limit",
    "bok": "I.A.1",
    "cognitive": "Apply",
    "stem": "A desk audit examines a service provider's revised quality manual and procedures against the agreed requirements. The documents adequately define the required controls. No operating records, interviews, or observations were included. The client proposes cancelling the planned system audit because the satisfactory desk review establishes that the revised controls are working. Which response best explains what has been established?",
    "options": [
      "The approved procedures satisfy the criteria, so their documented controls can be treated as implemented effectively and the system audit can be cancelled on that basis.",
      "The reviewed documents adequately define the controls, but their implementation and effectiveness still need operational evidence through the planned system audit.",
      "The desk audit has established nothing because documents cannot be audit evidence; repeat the same document examination at the provider's site before accepting any result.",
      "The desk review can establish effective implementation once the process owner signs an assurance that all personnel follow the revised procedures, without examining operational evidence."
    ],
    "answer": 1,
    "why": "A desk review of the manual and procedures can establish whether the process or system is adequately defined against the criteria. That is a useful result, but the particular evidence reviewed here does not show how the revised controls operate. A system audit also examines implementation and effectiveness through relevant objective evidence. The planned work should therefore obtain operational evidence rather than treat document adequacy as proof of performance. This limitation comes from the material actually examined, not from a rule that every document review is incapable of considering operating records or that useful auditing must occur on site. A general signed assurance does not fill the stated evidence gap by itself. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 4–5.</span>",
    "keyPoint": "Distinguish an adequately documented system from evidence that its controls have been implemented and work effectively.",
    "trap": "Turning a satisfactory review of manuals and procedures into assurance about operating effectiveness that was not examined.",
    "distractors": {
      "0": "Adequate procedures describe the intended controls. They do not, by themselves, establish how personnel implemented those controls or what results they achieved.",
      "2": "The desk review has a legitimate result concerning documented adequacy. Moving the same examination to the site does not automatically add implementation evidence.",
      "3": "A general assertion from the process owner does not demonstrate actual operation of the controls. The proposed cancellation still relies on unexamined implementation and effectiveness."
    }
  },
  {
    "qid": "cqa:set-2:q062",
    "set": 2,
    "batch": 7,
    "sub": "cqa-technical-expert-role",
    "bok": "I.D",
    "cognitive": "Apply",
    "stem": "A service audit needs specialist knowledge to assess the signal-processing method used in vibration reports. A qualified vibration specialist, who is not qualified as an auditor, joins in a documented technical-support role. Under this assignment the specialist works with a qualified auditor and reports technical results to the lead. Which use of the specialist best supports the audit?",
    "options": [
      "Have the specialist conduct the technical audit independently and issue its final findings directly to the client, because specialist competence replaces the assigned auditor role.",
      "Limit the specialist to locating records and observing interviews, leaving all technical interpretation to the qualified auditor so that the specialist cannot influence audit conclusions.",
      "Have the specialist use their preferred signal-processing method as the acceptance criterion and require the provider to adopt it whenever its current method differs.",
      "Have the specialist evaluate the actual method against applicable requirements and document the evidence; the qualified auditor uses that input in findings for the lead's report."
    ],
    "answer": 3,
    "why": "The specialist adds technical knowledge that the audit needs, including a substantiated assessment of the adequacy and effectiveness of the method actually used. Their contribution should identify the relevant requirements, evidence reviewed, and reasons for the technical conclusions. Under the stated assignment, that work supports the qualified auditor's assessment and the lead auditor's reporting responsibilities. Technical support is more than passive observation, but technical expertise alone does not change the specialist's assigned role into that of an independent auditor. The specialist's personal preference also does not replace the applicable criteria. The handbook's example specialist guide supports this working arrangement; the scenario makes its local role boundaries explicit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 25–26, 314–315.</span>",
    "keyPoint": "Use a technical expert's documented evaluation within the assigned audit roles, while judging the actual method against applicable requirements.",
    "trap": "Treating specialist knowledge as automatic auditor authority, or reducing the specialist to an observer who cannot contribute technical conclusions.",
    "distractors": {
      "0": "The specialist was assigned technical support, not independent audit and reporting authority. Expertise in the method does not by itself replace the qualified auditor or the lead's reporting role.",
      "1": "The purpose of adding the specialist is to inform the technical assessment. Excluding their interpretation would discard the competence needed to evaluate the method.",
      "2": "A different method is not automatically inadequate. The specialist must assess the approach used against the applicable requirements and evidence, rather than impose a personal preference."
    }
  },
  {
    "qid": "cqa:set-2:q063",
    "set": 2,
    "batch": 7,
    "sub": "cqa-purpose-aligned-audit-plan",
    "bok": "II.A.7",
    "cognitive": "Evaluate",
    "stem": "A translation supplier's contract requires each approved terminology change to appear in the next applicable delivered manual. An audit will examine that requirement across Change Control, Translation, and Release for the last quarter. Two qualified auditors have one day; linked change and delivery records and the relevant personnel are available. Opening, closing, and team-review periods are already reserved. Which proposed plan best turns this purpose into coordinated audit work?",
    "options": [
      "Assign each auditor departmental procedure clauses, choose unrelated samples within each area, and combine the department pass rates as the assessment of the change-to-delivery requirement.",
      "Assign one auditor the approved change procedures and the other the release procedures, using their document reviews as the complete test of whether changes reached delivered manuals.",
      "Link the contract requirement to process steps, assign timed reviews of the same changes through translation and delivery, reconcile handoff evidence, and distribute the plan to the team and auditee.",
      "Give both auditors the contract and department list, defer work allocation and sample coordination until arrival, and provide the auditee with the activity sequence as each interview begins."
    ],
    "answer": 2,
    "why": "The purpose is to determine whether approved changes reach the applicable delivered manuals, so the plan must connect the contract requirement with the activities and evidence across that sequence. Assigning coordinated reviews of linked changes allows the two auditors to reconcile the handoffs rather than infer end-to-end conformity from separate department scores. The plan should identify responsibilities and timing, preserve the already reserved meetings and review periods, and be communicated to the team and auditee before performance. The stated availability supports arranging the linked reviews and reconciling evidence between the auditors. A plan limited to procedure adequacy, disconnected samples, or improvised assignments would not support this specific purpose as well. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 85, 88.</span>",
    "keyPoint": "Translate the audit purpose and criteria into coordinated activities, evidence links, responsibilities, timing, and advance communication.",
    "trap": "Assuming that coverage of each department, or a list of audit topics, automatically tests the requirement across process handoffs.",
    "distractors": {
      "0": "Department pass rates from unrelated samples do not demonstrate that particular approved changes reached the applicable delivered manuals. The plan lacks the evidence linkage central to this purpose.",
      "1": "Procedure reviews can establish documented arrangements, but the stated audit purpose concerns what happened to actual changes and delivered manuals during the quarter.",
      "3": "The criteria and department list are inputs to the plan, not a substitute for coordinated assignments and advance communication. Deferring those arrangements creates avoidable uncertainty despite the available preparation information."
    }
  },
  {
    "qid": "cqa:set-2:q064",
    "set": 2,
    "batch": 7,
    "sub": "cqa-executive-summary-evidence-limits",
    "bok": "II.C.2",
    "cognitive": "Evaluate",
    "stem": "Storage-excursion case. An internal audit examines controls for protecting customer-owned coating material in Store C. The exhibit contains verified requirements and records for the reviewed event. The investigation has not established the cause of the excursion or whether the material was damaged. Both lots remain on hold. Which executive-summary statement most accurately communicates the result and its current significance?",
    "options": [
      "Store C exceeded its required temperature range for 90 minutes. Two exposed lots were held and relocated; material disposition and corrective-action work remain open, and damage has not been established.",
      "The prompt relocation protected both lots and no affected material was dispatched. Storage controls therefore achieved their objective, with no product impact or remaining corrective-action concern from this event.",
      "The excursion damaged two customer-owned lots because the recorded temperature exceeded the permitted limit. The summary should report both lots as confirmed losses requiring replacement despite their current hold status.",
      "A cooling-equipment failure caused a 90-minute storage excursion affecting two lots. Holding and relocating the stock controlled the exposure, and the open corrective-action request should address that confirmed equipment cause."
    ],
    "answer": 0,
    "why": "An effective summary connects the storage-control requirement to the verified excursion, the exposed stock, the immediate response, and the work still outstanding. The temperature record establishes a failure to maintain the required storage conditions for 90 minutes. The hold and relocation are relevant responses and should be reported, but they do not establish material fitness, the cause of the event, or completed corrective action. The summary therefore preserves the distinction between a confirmed control failure and its still-unresolved material consequences. No damage assessment or verified causal evidence supports reporting two confirmed losses or blaming cooling equipment. Likewise, the absence of dispatch does not erase the temperature-control failure or the open response obligations. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 128–130.</span>",
    "keyPoint": "Summarize the requirement, supported result, immediate response, and unresolved consequences without converting exposure into proven damage or an assumed cause.",
    "trap": "Overstating product loss or root cause, or using successful containment to make the original control failure disappear.",
    "distractors": {
      "1": "The hold and lack of dispatch limit immediate use or shipment, but do not prove that the stock is undamaged or that the required corrective-action work is complete.",
      "2": "A storage-temperature violation is established; damage and the need to replace both lots are not. The proposed summary converts exposure into an unsupported confirmed loss.",
      "3": "The records do not establish a cooling-equipment cause. Naming it as confirmed would direct the response toward an assumption rather than a supported causal conclusion."
    },
    "caseId": "cqa-set2-storage-excursion-01",
    "chart": {
      "type": "data-table",
      "title": "Storage-excursion case: verified requirements and records",
      "columns": [
        "Document or record",
        "Verified requirement or evidence"
      ],
      "rows": [
        [
          "Approved procedure TC-8, section 3",
          "Store-room air temperature must remain 15–25°C. An excursion requires affected stock to be held for documented Quality disposition and a corrective-action request covering cause, recurrence-prevention actions, and effectiveness verification."
        ],
        [
          "Logger LG-12 and stock-location records",
          "A verified 90-minute excursion from 14:20 to 15:50 recorded 29–31°C in Store C. Lots C41 and C42 were present throughout. The logger's calibration and the time records were verified."
        ],
        [
          "Hold and transfer records",
          "Both lots were placed on hold at 15:55 and transferred at 16:20 to qualified Store D at 20°C. Store C was temporarily blocked from use. No material from either lot was used or dispatched during or after the excursion."
        ],
        [
          "Quality review and CAR-27 status",
          "Material disposition is pending. CAR-27 remains open; the cause has not been verified, recurrence-prevention actions have not been established, and effectiveness has not been verified."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q065",
    "set": 2,
    "batch": 7,
    "sub": "cqa-containment-corrective-action-elements",
    "bok": "II.D.1",
    "cognitive": "Analyze",
    "stem": "Storage-excursion case. An internal audit examines controls for protecting customer-owned coating material in Store C. The exhibit contains verified requirements and records for the reviewed event. The investigation has not established the cause of the excursion or whether the material was damaged. Both lots remain on hold. Which assessment best distinguishes the completed response from the remaining corrective-action work?",
    "options": [
      "Relocation is the completed permanent corrective action because the lots are now at 20°C; CAR-27 can close when Quality authorizes their release, without further causal work.",
      "The hold and relocation are preventive action only because damage is unconfirmed; no existing nonconformity requires cause analysis unless the material assessment finds a defect.",
      "The hold and relocation are temporary containment, so the auditor should specify and implement the permanent remedy before the auditee measures its effectiveness.",
      "The hold and relocation contain the affected stock and provide compliant storage; the auditee still needs causal investigation, assigned recurrence-prevention actions, and effectiveness verification for CAR-27."
    ],
    "answer": 3,
    "why": "Holding the lots prevents their use or dispatch pending disposition, and relocation provides compliant storage in Store D. These immediate measures control the affected stock and its storage arrangements; they do not establish that the underlying cause has been removed or that the material itself is conforming. The stated procedure requires a causal response through CAR-27, so the auditee must investigate and verify the cause, establish actions and responsibilities with a schedule, and define and complete appropriate effectiveness checks. The auditee owns that response. The auditor assesses evidence and follow-up within the assigned role rather than assuming responsibility for specifying and implementing the remedy. Containment need not wait for cause analysis, and lack of proven material damage does not erase the established storage-condition nonconformity. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 133–135.</span>",
    "keyPoint": "Separate immediate containment or correction from cause-based corrective action and verification of effectiveness.",
    "trap": "Treating restored conditions or an eventual product-release decision as proof that the cause has been eliminated and corrective action is effective.",
    "distractors": {
      "0": "Moving stock to compliant conditions does not establish or remove the cause of the excursion. Quality's disposition of the lots is a different decision from verifying the effectiveness of the required corrective action.",
      "1": "The temperature requirement was already violated. Response to that detected failure is not merely prevention of a hypothetical future nonconformity, and the procedure expressly requires the causal response.",
      "2": "The auditee remains responsible for developing and implementing its corrective action. The temporary nature of containment does not transfer ownership of the permanent remedy to the auditor."
    },
    "caseId": "cqa-set2-storage-excursion-01",
    "chart": {
      "type": "data-table",
      "title": "Storage-excursion case: verified requirements and records",
      "columns": [
        "Document or record",
        "Verified requirement or evidence"
      ],
      "rows": [
        [
          "Approved procedure TC-8, section 3",
          "Store-room air temperature must remain 15–25°C. An excursion requires affected stock to be held for documented Quality disposition and a corrective-action request covering cause, recurrence-prevention actions, and effectiveness verification."
        ],
        [
          "Logger LG-12 and stock-location records",
          "A verified 90-minute excursion from 14:20 to 15:50 recorded 29–31°C in Store C. Lots C41 and C42 were present throughout. The logger's calibration and the time records were verified."
        ],
        [
          "Hold and transfer records",
          "Both lots were placed on hold at 15:55 and transferred at 16:20 to qualified Store D at 20°C. Store C was temporarily blocked from use. No material from either lot was used or dispatched during or after the excursion."
        ],
        [
          "Quality review and CAR-27 status",
          "Material disposition is pending. CAR-27 remains open; the cause has not been verified, recurrence-prevention actions have not been established, and effectiveness has not been verified."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q066",
    "set": 2,
    "batch": 7,
    "sub": "cqa-evidence-based-decisiveness",
    "bok": "III.A",
    "cognitive": "Apply",
    "stem": "A new lead has completed an audit's agreed sampling and resolved all material evidence questions. Records, observations, and interviews support the same scoped conclusion. The lead is authorized to finalize it, but postpones reporting to seek more examples without identifying a remaining evidence gap. Which action best demonstrates evidence-based decisiveness?",
    "options": [
      "Continue collecting evidence until every transaction in the audit period has been examined, so the conclusion can be issued without any residual uncertainty.",
      "Reach the supported conclusion now, record its reasoning and scope, and proceed with reporting while remaining open to relevant new information.",
      "State a broader assurance covering activities beyond the agreed objective, because consistent results from the completed work justify a more confident conclusion.",
      "Refer the conclusion to the audited manager and use that manager's preferred interpretation, because confidence in the decision depends on the auditee's endorsement."
    ],
    "answer": 1,
    "why": "Decisiveness means reaching a timely conclusion through logical reasoning and analysis. The agreed work is complete, the relevant evidence is consistent, material questions have been resolved, and the lead has authority to finalize the conclusion. Proceeding on that basis demonstrates decisiveness. It does not mean claiming certainty, extending the assurance beyond the work's scope, or replacing the auditor's judgment with the auditee's preference. Remaining open to relevant new information is compatible with making a justified decision now; it does not require indefinitely collecting examples when no material evidence gap has been identified. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 151.</span>",
    "keyPoint": "Reach timely conclusions when the evidence supports them, retaining the reasoning and scope that make the decision defensible.",
    "trap": "Confusing decisiveness with absolute certainty, overconfidence, or reliance on another party to make the audit judgment.",
    "distractors": {
      "0": "The stated evidence is sufficient for the agreed objective. Examining every transaction solely to eliminate all uncertainty adds an unsupported condition for making the conclusion.",
      "2": "Decisiveness does not expand what the completed work supports. A broader assurance about unexamined activities would exceed the stated objective and evidence.",
      "3": "The lead is authorized to reach the conclusion from the evidence. The auditee's preferred interpretation is not a substitute for that reasoned judgment."
    }
  },
  {
    "qid": "cqa:set-2:q067",
    "set": 2,
    "batch": 7,
    "sub": "cqa-chronological-trend-presentation",
    "bok": "III.D",
    "cognitive": "Evaluate",
    "stem": "An auditor is preparing a brief slide for operations directors who want to see how the observed rework rate changed month by month, including any reversals. The exhibit gives verified monthly rates and review volumes; the same counting definition and review method were used throughout. Detailed record results remain available in the report repository. Which presentation best answers the directors' question?",
    "options": [
      "Use a Pareto chart with months sorted from the highest to the lowest rework percentage, placing each review volume beneath its corresponding bar.",
      "Use a pie chart showing each month's percentage as a share of the sum of the six percentages, with values labelled around the slices.",
      "Use a table of every reviewed record, its outcome and timestamp, so the directors can reconstruct the monthly pattern directly from the underlying evidence.",
      "Use a line chart with calendar months horizontally and a labelled 0–15% rework scale vertically, retaining monthly review volumes in a small supporting table."
    ],
    "answer": 3,
    "why": "The communication need is change over time, so the display should preserve the months' chronological order. A line chart with the percentage measure on a clearly labelled vertical scale shows the decline through April, the May increase, and the lower June value. Keeping review volumes available provides context without making directors reconstruct the sequence from individual records. Sorting the months by magnitude removes that sequence. A pie of summed monthly percentages does not represent the temporal pattern or a meaningful partition of a common whole. The display communicates the observed results; it does not by itself establish a cause or statistical significance. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 165, 272.</span>",
    "keyPoint": "Choose a visual that preserves the relationship the audience needs to see, and label its measure, time order and scale clearly.",
    "trap": "Selecting a familiar chart that ranks or aggregates the values when the audience needs their chronological pattern.",
    "distractors": {
      "0": "Ranking the months can show which rates are largest, but it removes the calendar sequence needed to identify month-to-month changes and reversals.",
      "1": "The six monthly percentages are separate rates, not components of one whole. Converting their sum into pie slices obscures both their meaning and their time sequence.",
      "2": "Record-level evidence remains useful for traceability, but making directors reconstruct the trend from it does not meet the stated need for a brief temporal summary."
    },
    "chart": {
      "type": "data-table",
      "title": "Monthly rework results prepared for the management presentation",
      "columns": [
        "Month",
        "Records reviewed",
        "Records requiring rework (%)"
      ],
      "rows": [
        [
          "January",
          "80",
          "12.5"
        ],
        [
          "February",
          "100",
          "9.0"
        ],
        [
          "March",
          "125",
          "8.0"
        ],
        [
          "April",
          "100",
          "6.0"
        ],
        [
          "May",
          "120",
          "7.5"
        ],
        [
          "June",
          "100",
          "5.0"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q068",
    "set": 2,
    "batch": 7,
    "sub": "cqa-senior-management-support",
    "bok": "IV.A.1",
    "cognitive": "Understand",
    "stem": "An organization delegates day-to-day audit administration to a competent program manager. Its executive orientation needs a concise description of senior management's continuing role in supporting a credible audit function. Which description accurately explains that role?",
    "options": [
      "Establish an appropriate reporting relationship, reinforce the audit function's value, and use its results to guide action on system performance, improvement and risk.",
      "Choose each audit's sample, prescribe the interview questions, and personally determine whether each item of evidence should become a finding in the report.",
      "Place the audit group under each audited function's manager, giving that manager control over which results reach executives because the manager understands the work.",
      "Treat appointment of qualified auditors as completion of senior management's responsibility, leaving the use of results entirely to the functions that were audited."
    ],
    "answer": 0,
    "why": "Senior management supports the audit function through its organizational position, visible commitment to the value of auditing, and appropriate use of results. The handbook links that support to program credibility and identifies auditing as an oversight tool for compliance, improvement, effectiveness, efficiency and risk. Delegating routine administration does not remove management's responsibility to respond constructively to audit information. Conducting individual evidence work is the auditors' role. Allowing the audited function to control the audit group's reporting and filter results would undermine the independent, credible information that management needs. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 178–179.</span>",
    "keyPoint": "Senior management sustains a credible audit function through appropriate organizational support and constructive use of its results.",
    "trap": "Confusing management support with either taking over the auditors' evidence work or withdrawing all involvement after appointing a program manager.",
    "distractors": {
      "1": "These are execution-level audit tasks. They do not describe senior management's continuing organizational support and oversight role.",
      "2": "Putting the audit group under the function it audits and allowing that function to filter its reporting weakens the credible, unbiased information that the audit function is intended to provide.",
      "3": "Qualified auditors are necessary, but management still influences credibility through its attitudes and its response to audit results. Appointment alone does not complete that continuing role."
    }
  },
  {
    "qid": "cqa:set-2:q069",
    "set": 2,
    "batch": 7,
    "sub": "cqa-pre-award-capability-capacity",
    "bok": "IV.A.6",
    "cognitive": "Evaluate",
    "stem": "A customer plans to award a six-month contract for 800 assemblies per week. A prospective supplier's 20 pilot assemblies passed all specified product checks. Its quotation lists machine capacity above 800 per week, but the same machines serve existing customers; no evidence of available capacity at the proposed delivery rate has been reviewed. The supplier has agreed to a pre-award survey. Procurement retains award authority. Which audit-program recommendation best supports qualification?",
    "options": [
      "Treat the pilot approvals and quoted machine rating as sufficient evidence, and recommend qualification with routine incoming inspection after deliveries begin.",
      "Reject the supplier as incapable of delivery, because successful pilot pieces cannot support qualification when the proposed machines already serve other customers.",
      "Use the survey to verify production controls, available resources and workload commitments against the required delivery rate, then report supported conclusions and remaining gaps.",
      "Expand product inspection of another pilot lot while relying on the quoted machine rating for capacity, since only physical product results need verification."
    ],
    "answer": 2,
    "why": "Pre-award supplier evaluation can examine resources, technical capability, controls, systems and past performance; supplier selection also calls for assessment of capacity. The pilot results provide evidence about those 20 products, but they do not establish that the intended production arrangements can sustain the required deliveries alongside existing commitments. The quoted machine rating likewise does not show how much capacity will be available for this contract. A focused survey can verify the relevant controls and resource assumptions, then provide procurement with supported conclusions and any unresolved gaps. The current information establishes neither sustained capacity nor inability to deliver. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 6, 199.</span>",
    "keyPoint": "Supplier qualification should examine both the ability to meet requirements and the available capacity to sustain the proposed delivery commitments.",
    "trap": "Treating acceptable pilot products and nominal equipment capacity as proof of sustained delivery, or treating an unverified capacity gap as proven inability.",
    "distractors": {
      "0": "The pilot products and nominal rating do not establish available sustained capacity alongside existing work. Incoming inspection after award does not resolve that pre-award evidence gap.",
      "1": "Existing customer commitments create a capacity question to verify, not proof that the supplier cannot deliver. The pilot results remain relevant evidence of product conformity.",
      "3": "More pilot product inspection may add conformity evidence but leaves the resource, workload and capacity assumptions unverified. Those assumptions matter to the proposed delivery commitment."
    }
  },
  {
    "qid": "cqa:set-2:q070",
    "set": 2,
    "batch": 7,
    "sub": "cqa-sample-standard-deviation",
    "bok": "V.C.2",
    "cognitive": "Apply",
    "stem": "An auditor selects six completed test setups from a larger set of jobs. The exhibit gives their verified elapsed setup times in minutes. All observations use the same start and end definitions and must be retained in the calculation. The report calls for the sample standard deviation, s, rounded to two decimal places. Which value should be reported?",
    "options": [
      "2.19 minutes",
      "2.00 minutes",
      "4.80 minutes",
      "6.00 minutes"
    ],
    "answer": 0,
    "why": "The sample mean is (4 + 5 + 7 + 8 + 8 + 10) / 6 = 7 minutes. The squared deviations from that mean sum to 9 + 4 + 0 + 1 + 1 + 9 = 24 square minutes. For the sample standard deviation, divide by n − 1 = 5 and take the square root: s = √(24 / 5) = √4.8, approximately 2.19 minutes. Dividing by six gives 2.00 minutes, reporting 4.80 without the square root gives the sample variance, and 10 − 4 = 6.00 minutes gives the range. The square root returns the dispersion measure to the original time units. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 268–269.</span>",
    "keyPoint": "For sample standard deviation, sum the squared deviations from the sample mean, divide by n − 1, and take the square root; report the result in the original units.",
    "trap": "Dividing by n, reporting variance without taking its square root, or substituting the range for standard deviation.",
    "distractors": {
      "1": "√(24 / 6) = 2.00 minutes uses n in the denominator. The requested sample standard deviation uses n − 1, so the denominator is five.",
      "2": "24 / 5 = 4.80 is the sample variance in square minutes. The requested standard deviation requires its square root and is expressed in minutes.",
      "3": "10 − 4 = 6.00 minutes is the range. It uses only the extreme values rather than the squared deviations of all six observations."
    },
    "chart": {
      "type": "data-table",
      "title": "Sample of six completed test setups",
      "columns": [
        "Setup",
        "Elapsed time (minutes)"
      ],
      "rows": [
        [
          "S1",
          "4"
        ],
        [
          "S2",
          "5"
        ],
        [
          "S3",
          "7"
        ],
        [
          "S4",
          "8"
        ],
        [
          "S5",
          "8"
        ],
        [
          "S6",
          "10"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q071",
    "set": 2,
    "batch": 8,
    "sub": "cqa-purpose",
    "bok": "I.A.3",
    "cognitive": "Analyze",
    "stem": "A supplier provides a current ISO 9001 certificate whose scope includes the plant and manufacturing activities supplying lot M184. The customer's incoming-release procedure requires review of dimensional acceptance records linked to each delivered lot. The supplier offers its certificate in place of the records for M184. Which assessment best distinguishes the assurance provided from the evidence still needed?",
    "options": [
      "The certificate supports release of M184 because its current scope covers the manufacturing activities; confirm its validity instead of requesting the lot's acceptance records.",
      "The certificate supports management-system conformity within its scope; obtain the lot-linked acceptance records to satisfy the separately stated incoming-release check for M184.",
      "The certificate supports release once the supplier confirms that M184 was produced under the certified system; use that confirmation to replace the acceptance records.",
      "The certificate supports product conformity if the certification body's accreditation covers the supplier's industry; verify that accreditation before substituting it for the acceptance records."
    ],
    "answer": 1,
    "why": "Management-system certification provides assurance about conformity of the system to the applicable standard within the certification scope. It does not, by itself, demonstrate the dimensional acceptance of the particular units in M184. The customer's stated release procedure calls for lot-linked acceptance records, so those records remain necessary for that check. The certificate remains relevant system evidence; neither its validity nor the certification body's accreditation changes the kind of assurance it supplies. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 8, 16.</span>",
    "keyPoint": "Match the assurance supplied by an audit or certificate to the specific decision and evidence requirement.",
    "trap": "Extending assurance about a management system into verification of a particular product lot.",
    "distractors": {
      "0": "A current, relevant certificate addresses the system and its scope. Validating that certificate does not supply the dimensional acceptance records required for M184.",
      "2": "Confirmation that a lot was made under the certified system still describes the system used. It does not replace the lot-linked acceptance evidence required by this customer's procedure.",
      "3": "Accreditation concerns the certification body's conformity to applicable criteria. Checking it does not turn a management-system certificate into evidence of the delivered lot's dimensional acceptance."
    }
  },
  {
    "qid": "cqa:set-2:q072",
    "set": 2,
    "batch": 8,
    "sub": "cqa-professional-conduct",
    "bok": "I.E.1",
    "cognitive": "Apply",
    "stem": "At a supplier audit, an auditor receives an unreviewed nondisclosure agreement that includes obligations on the auditor's employer. The auditor has no authority to accept those obligations. Access to a proprietary process is conditional on the agreement, and no alternative evidence arrangement has been approved. What should the auditor do next?",
    "options": [
      "Sign in an individual capacity, annotate that the employer's review is pending, and begin the process examination while the designated authority reviews the agreement.",
      "Remove the proprietary process from the day's coverage, continue with unrestricted records, and explain the resulting scope change to the client in the final report.",
      "Treat the auditor's existing confidentiality training as sufficient authorization to enter the proprietary process, leaving the employer's obligations for discussion after evidence collection.",
      "Refer the agreement to the designated authority and coordinate approved confidentiality and access arrangements before proceeding with the affected portion of the audit work."
    ],
    "answer": 3,
    "why": "An auditor should obtain review and approval of an unfamiliar confidentiality agreement from the auditing organization's legal counsel or designated authority rather than accept obligations beyond the auditor's authority. The audit participants can then arrange authorized access or an acceptable alternative method that still meets the audit's needs. The scenario does not establish that the agreement is invalid or that the proprietary process may be omitted. Confidentiality and adequate evidence collection both need to be addressed. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 32.</span>",
    "keyPoint": "Resolve confidentiality commitments through the authorized reviewer while preserving the audit's evidence needs.",
    "trap": "Treating schedule pressure or personal confidentiality training as authority to accept an employer's obligations.",
    "distractors": {
      "0": "Adding an individual-capacity notation or a pending-review annotation does not establish authority to accept the agreement presented. The auditor needs authorized review before signing or relying on altered terms.",
      "1": "Unrestricted work may be useful, but removing required coverage and disclosing the change only afterward bypasses approval of the changed arrangements. The access problem needs to be addressed while the audit can still be adjusted.",
      "2": "Training may support professional confidentiality, but it does not resolve the proposed obligations or establish an approved access arrangement. The designated authority should review the agreement before affected work proceeds."
    }
  },
  {
    "qid": "cqa:set-2:q073",
    "set": 2,
    "batch": 8,
    "sub": "cqa-audit-benefits",
    "bok": "I.B.2",
    "cognitive": "Analyze",
    "stem": "An order-entry process owner tracks entry accuracy and order-processing time. A recent internal audit found the sampled controls conforming and supported their effectiveness for the period examined. A director asks whether the next quarterly audit can replace the owner's monitoring between audits. Which response best uses the favorable audit result?",
    "options": [
      "Keep the process owner's monitoring against objectives, and use the audit findings as an additional independent input when management evaluates performance and decides on improvements.",
      "Have the audit team take over the interim performance reviews, and ask the process owner to intervene when an auditor identifies a missed process objective.",
      "Use the favorable audit as the performance baseline until the next audit, and have the owner monitor completion of documented work steps during the intervening period.",
      "Continue tracking customer complaints, and use the favorable audit as assurance of the other process objectives until a new complaint justifies broader performance monitoring."
    ],
    "answer": 0,
    "why": "Audits provide objective information that management can use to evaluate conformity, effectiveness, risks, and opportunities for improvement. Even an audit that examines effectiveness does not replace management's continuing responsibility to monitor performance. The process owner should therefore continue monitoring entry accuracy and processing time, with the audit result contributing additional information. A favorable conclusion for the period examined does not establish that later performance will remain satisfactory or transfer management's monitoring work to the audit team. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 18, 125.</span>",
    "keyPoint": "Independent audit information supplements management's monitoring of whether processes continue to meet their objectives.",
    "trap": "Using a favorable audit conclusion as a substitute for ongoing performance information and process-owner responsibility.",
    "distractors": {
      "1": "This transfers the process owner's ongoing monitoring work to the audit team and makes management's response depend on the next auditor observation. Auditing supplies additional information; it does not assume that management responsibility.",
      "2": "Monitoring whether work steps are completed does not by itself show whether accuracy and processing-time objectives continue to be achieved. The earlier audit result cannot supply the missing interim performance information.",
      "3": "Customer complaints may be useful information, but the scenario does not establish that they detect every failure to meet the two process objectives. The favorable audit is not sufficient grounds for replacing those performance measures with complaint-triggered monitoring."
    }
  },
  {
    "qid": "cqa:set-2:q074",
    "set": 2,
    "batch": 8,
    "sub": "cqa-on-site-management",
    "bok": "II.B.1",
    "cognitive": "Analyze",
    "stem": "A one-day audit must determine whether approved customer configuration changes were implemented in production during the preceding week. An outage makes the only records linking those changes to actual production inaccessible until two days after the visit. The team and auditee confirm that interviews, available products, and older records cannot establish which configurations were used in that week. Approved procedures remain available. The audit client retains authority to approve changes to the objectives or scope and to terminate the audit. What should the lead auditor do?",
    "options": [
      "Review the available procedures and report conformity to the implementation objective, identifying the inaccessible production records as a limitation to be resolved after the visit.",
      "Combine older production records with management's description of current practice, complete the planned assessment, and identify the outage as a reason for reduced confidence.",
      "Report why the objective cannot be achieved to the client and auditee, then seek an authorized decision on revised arrangements, objectives, scope, or termination.",
      "Terminate the audit because the essential evidence is inaccessible, document the reason, and ask the client to approve that decision when the final report is submitted."
    ],
    "answer": 2,
    "why": "The objective concerns actual implementation during a defined recent period. The available evidence cannot answer that question, and a procedure review or evidence from an older period would not remedy the gap. When audit objectives are unattainable, the lead auditor should explain the reasons to the audit client and auditee so they can determine the appropriate action. Depending on their decision, this can involve revised arrangements, changed objectives or scope, or termination. The lead auditor should not substitute a different assessment or exercise authority expressly retained by the client. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 93.</span>",
    "keyPoint": "When available evidence cannot meet the objective, make the limitation explicit and obtain an authorized decision about the audit's continuation or change.",
    "trap": "Preserving the scheduled visit by answering a different question, or treating an evidence gap as authority to terminate the audit unilaterally.",
    "distractors": {
      "0": "Procedures can show the defined method, but they do not demonstrate implementation during the week in question. Naming the missing evidence as a limitation does not make a conformity conclusion defensible.",
      "1": "The scenario establishes that older records and interviews cannot identify the configurations used in the relevant week. Combining those sources does not produce the missing implementation evidence.",
      "3": "Termination may be an appropriate outcome, but the client retains that decision authority. The lead auditor should report the constraint and seek the authorized decision before taking that action."
    }
  },
  {
    "qid": "cqa:set-2:q075",
    "set": 2,
    "batch": 8,
    "sub": "cqa-working-papers",
    "bok": "II.A.5",
    "cognitive": "Apply",
    "stem": "Procedure PM-06, revision 3, section 4 requires the applied bearing-bolt torque to be recorded on each maintenance work order. At press P4, an auditor examines completed work order M619 dated 12 May and finds its torque field blank. The technician says the usual setting is 45 N·m but does not recall this job. Which working-paper entry best preserves traceable evidence without converting an assumption into a fact?",
    "options": [
      "PM-06 rev. 3 §4 checked; M619 at P4 has a blank torque field, but the technician's usual 45 N·m setting supports marking the maintenance requirement conforming.",
      "PM-06 rev. 3 §4 requires a torque entry; M619, P4, 12 May has a blank field. Technician described the usual 45 N·m setting without recalling this job.",
      "PM-06 rev. 3 §4 checked; M619 at P4 has a blank torque field, establishing that the technician omitted the required tightening operation when completing the bearing work.",
      "PM-06 rev. 3 §4 not met in the maintenance sample; torque documentation was missing. Ask the technician to identify the particular work order again at the closing meeting."
    ],
    "answer": 1,
    "why": "Working papers should record observations while the evidence is available and make them traceable to their source. The selected entry identifies the requirement, work order, equipment, date, observed blank field, and the limited nature of the technician's statement. It supports evaluation of the torque-recording requirement without claiming that the actual torque was correct or that the tightening operation was omitted. Recording the identifying details now also avoids relying on memory at the closing meeting. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 80–81.</span>",
    "keyPoint": "Record identifiable sources and observed facts, and distinguish them from statements or conclusions that the evidence does not establish.",
    "trap": "Replacing a traceable observation with a checkmark, an inference about the work performed, or a plan to reconstruct the details later.",
    "distractors": {
      "0": "The observed blank field does not meet the stated recording requirement. A description of the usual setting neither supplies the required entry nor establishes the torque used for M619.",
      "2": "The missing entry establishes a documentation gap, not that the tightening operation was omitted. That additional conclusion goes beyond the evidence observed or reported.",
      "3": "The entry records a general issue but omits the available identifiers needed to trace it directly to M619 at P4. Planning to recover those details later creates an avoidable dependence on memory."
    }
  },
  {
    "qid": "cqa:set-2:q076",
    "set": 2,
    "batch": 8,
    "sub": "cqa-evidenced-capa-extension",
    "bok": "II.D.2",
    "cognitive": "Evaluate",
    "stem": "An approved corrective-action plan replaces a controller whose failure mode has been verified. Before the agreed deadline, the auditee requests a 14-day extension after a documented supplier shutdown delays delivery. Records show that ordering was timely, preparatory work is complete, and an approved interim check is operating effectively. The request names an owner and confirmed delivery, installation and effectiveness-review dates within the extension. The designated reviewer may authorize revised dates. Which response is best?",
    "options": [
      "Reject the extension and require a different permanent solution that can meet the original date, despite the verified cause and documented delivery constraint.",
      "Accept the interim check as final resolution and close the action, transferring controller installation and later effectiveness review to the department's improvement schedule.",
      "Approve the delivery and installation dates but defer setting the effectiveness-review date until installation, treating verification as a separate scheduling decision.",
      "Approve and record the justified extension with its milestones and continued interim monitoring, keeping the action open until required implementation and effectiveness are verified."
    ],
    "answer": 3,
    "why": "The request provides evidence of action already taken, a documented external delay, an effective interim control, an accountable owner and reviewable completion milestones. Those facts support the designated reviewer approving a bounded extension through the formal corrective-action process. Timeliness is assessed against justified agreed dates and progress, rather than an unchangeable universal deadline. Approval should preserve the planned implementation and effectiveness checks and the interim monitoring needed while the permanent action remains incomplete. It does not close the action or turn the interim check into proof that the verified cause has been removed. Discarding a defined effectiveness-review milestone would weaken an otherwise reviewable revised plan. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 135, 142.</span>",
    "keyPoint": "Assess extension requests using documented reasons, progress, interim control and credible milestones; keep approval of more time separate from verified closure.",
    "trap": "Treating a revised date as either automatic failure or completed corrective action, instead of judging the supported request and retaining the remaining checks.",
    "distractors": {
      "0": "The documented external delay and verified progress support considering revised dates. Nothing supplied establishes a need to abandon the accepted cause-based solution solely to preserve the original date.",
      "1": "The interim check controls the present exposure, but the permanent action and its effectiveness verification remain incomplete. Moving them to an improvement schedule does not satisfy the existing closure obligations.",
      "2": "The request already supplies an effectiveness-review date. Removing it leaves the revised plan less complete without a stated reason and separates verification from the agreed completion milestones."
    }
  },
  {
    "qid": "cqa:set-2:q077",
    "set": 2,
    "batch": 8,
    "sub": "cqa-focused-interview-follow-up",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "An audit requires evidence that price-waiver approval is recorded before dispatch. The auditor asks a service coordinator, 'Who authorizes a waiver, what happens to the approval information, and how is dispatch notified?' The coordinator names the approver and describes the dispatch message but does not address the approval record. No relevant order has yet been examined. Which follow-up best develops the missing information without presuming a failure?",
    "options": [
      "Repeat the three-part question and accept another description of the approver and dispatch message as a complete answer about the approval-recording activity.",
      "Ask, 'The approved waiver is retained in the order file, correct?' Treat agreement as confirmation that the recording requirement is being met.",
      "Ask, 'For the latest waiver, what record, if any, shows the approval?' Let the coordinator explain and examine the evidence identified.",
      "Document a missing-approval-record finding from the omitted answer, then ask the coordinator which part of the recording procedure staff failed to follow."
    ],
    "answer": 2,
    "why": "The unanswered part concerns how the approval is recorded. A focused question about a recent waiver invites the coordinator to supply that information without suggesting a storage location or assuming that no record exists. Examining the identified evidence can then establish what was actually recorded and when. This applies conversational questioning, follow-up and corroboration to a specific information gap. Repeating the full compound prompt does not ensure that the missing activity is addressed. Agreement with a suggested answer is not sufficient verification, and omission from an interview response does not by itself establish a nonconformity. The issue is the question's focus and neutrality, not a rule that every closed question is improper. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 166–167, 169.</span>",
    "keyPoint": "Identify the unanswered activity, ask a focused neutral question, and follow the account to relevant evidence before judging conformity.",
    "trap": "Treating a partial answer as complete, supplying the expected answer, or interpreting an unanswered question as proof of nonconformity.",
    "distractors": {
      "0": "The approver and dispatch message are the parts already described. Repeating them still does not provide the missing information about the approval record.",
      "1": "The question supplies a particular location and expected answer. Agreement alone does not demonstrate that the required approval was recorded before dispatch.",
      "3": "The evidence has not established that the record is absent. The proposed finding and follow-up both assume the failure that the auditor still needs to investigate."
    }
  },
  {
    "qid": "cqa:set-2:q078",
    "set": 2,
    "batch": 8,
    "sub": "cqa-performing-team-oversight",
    "bok": "III.F",
    "cognitive": "Apply",
    "stem": "By the end of an audit's first day, a competent team is completing its parallel assignments on time, producing adequate evidence records and resolving handoff questions cooperatively. Members understand the agreed methods and responsibilities, and the purpose and team membership remain unchanged. The lead has scheduled brief progress reviews and a final reconciliation of findings. Which leadership approach best maintains this performance?",
    "options": [
      "Retain independent work within agreed assignments, use the scheduled evidence and progress reviews, and intervene when an issue needs coordination or a lead decision.",
      "Require the lead to approve routine questions and notes before each interview continues, replacing the scheduled team reviews with continuous oversight of individual work.",
      "Cancel the remaining checkpoints and let each auditor issue conclusions directly to the auditee, since demonstrated cooperation makes further coordination of outputs unnecessary.",
      "Keep the entire team together for every remaining interview and record examination, replacing parallel work with shared attendance to maintain a common understanding."
    ],
    "answer": 0,
    "why": "The described team already demonstrates cohesive, competent performance under an unchanged purpose. Independent execution of clear assignments can continue while the lead monitors progress, reviews evidence and coordinates the team's outputs. Scheduled checkpoints preserve those responsibilities without requiring approval of every routine action. The lead still owns management of the audit process and must respond when an issue needs direction. Eliminating reviews would confuse trust with abandonment of oversight; requiring continuous approval or full-team attendance would add control without an identified performance or coordination problem. The decision follows the observed team conditions, not an assumption that every newly assembled team automatically performs this way. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 172–173, 175–176.</span>",
    "keyPoint": "Match oversight to demonstrated team performance: support competent independent work while retaining progress checks, coordination and responsibility for outputs.",
    "trap": "Equating a performing team with either freedom from all lead oversight or a need for continuous approval of routine audit work.",
    "distractors": {
      "1": "No evidence or coordination deficiency requiring continuous approval is stated. Replacing planned reviews with routine micromanagement disrupts the effective independent work already demonstrated.",
      "2": "Team members still report progress and contribute to coordinated outputs under the lead. Effective cooperation does not remove the need to reconcile evidence and findings.",
      "3": "The parallel assignments are working and handoffs are being resolved. Full-team attendance at every activity is not justified by the conditions given and removes the benefit of competent independent execution."
    }
  },
  {
    "qid": "cqa:set-2:q079",
    "set": 2,
    "batch": 8,
    "sub": "cqa-controlled-audit-appeals-procedure",
    "bok": "IV.A.5",
    "cognitive": "Evaluate",
    "stem": "An internal audit program has approved procedures for planning, reporting and follow-up, but appeals are handled through local email practices. Across three sites, different people decide similar appeals, some decisions are given only verbally, and records are inconsistently retained. The program manager is authorized to establish controlled program procedures. Which proposal best addresses these weaknesses?",
    "options": [
      "Let each lead publish local appeal instructions and preserve whichever correspondence seems useful, allowing the sites to adapt the decision route to their own preferences.",
      "Define appeal steps, responsible decision roles and record-retention requirements in an approved, controlled procedure, then communicate the process to auditors and auditees.",
      "Introduce a common appeal form and count submissions, while leaving decision authority, decision communication and record handling to each site's existing informal arrangements.",
      "Issue a common appeals guidance memo outside document control so that leads can change the route locally without waiting for program-level review and approval."
    ],
    "answer": 1,
    "why": "The weaknesses involve the appeal process, decision responsibilities, communication and records, so a common form alone is insufficient. An approved procedure under change control can define how appeals are handled, who has the assigned decision role, and what records must be retained. Communicating the procedure to auditors and auditees supports consistent use. The handbook identifies an appeal method and retention/handling of audit records as elements of audit-execution procedures and emphasizes approval, control and implementation communication. The item does not prescribe a universal appeal deadline or a particular reviewer appointment; those details must be established within the authorized program process. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 194–195.</span>",
    "keyPoint": "Make audit appeals and their decision records part of the approved, controlled program process, with clear responsibilities and communicated requirements.",
    "trap": "Mistaking a shared form or informal guidance for a complete, controlled process governing decisions and records.",
    "distractors": {
      "0": "Leaving the decision route and retained records to individual preference perpetuates the inconsistencies identified across the sites rather than establishing a common program process.",
      "2": "A form and submission count standardize intake but leave the stated weaknesses in decision authority, communication and retention unresolved.",
      "3": "Guidance that can be changed locally outside approval and change control does not provide the consistent, authorized procedure the program needs."
    }
  },
  {
    "qid": "cqa:set-2:q080",
    "set": 2,
    "batch": 8,
    "sub": "cqa-original-acceptance-sample-result",
    "bok": "V.E.1",
    "cognitive": "Apply",
    "stem": "An approved local single-sampling plan requires 32 randomly selected units: accept at zero or one nonconforming unit (Ac = 1) and reject at two or more (Re = 2). Each nonconforming unit counts once, regardless of its number of defects. The exhibit gives the original sample results. The inspector replaces S31 and S32 with two conforming units and reports zero nonconforming units. Which disposition and record of the original inspection follow the plan?",
    "options": [
      "Accept the lot using the two replacement units, since all 32 units in the revised sample now conform and the failed items were removed.",
      "Reject the original lot and record five nonconforming units, counting every observed defect separately when comparing the results with the rejection number.",
      "Reject the original lot for two nonconforming units, retain the original inspection results, and treat any authorized rectification and resubmission as a separate process.",
      "Draw a second random sample and defer the initial lot decision, treating the first two nonconforming units as a warning that needs confirmation."
    ],
    "answer": 2,
    "why": "The original random sample contains 30 conforming units and two nonconforming units. S31 and S32 each count once, although they have five defects between them. The count of two reaches Re = 2, so the initial lot decision is rejection under the supplied plan. Replacing those units with conforming ones does not change what the original sample showed or justify recording zero. A second sample is not part of this stated single-sampling decision. The original results must remain available; any later authorized rectification and resubmission is a separate process. This decision applies the supplied local acceptance rule and does not claim that every unit in the lot is nonconforming. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 284, 289.</span>",
    "keyPoint": "Apply the acceptance and rejection numbers to the original sample using the defined counting unit, and preserve that result through any later authorized disposition process.",
    "trap": "Erasing original failures by substitution, counting defects as separate nonconforming units, or adding an unplanned second chance to a single-sampling decision.",
    "distractors": {
      "0": "The replacement units were selected after the original failures were known. Their conformity does not remove the two nonconforming units observed in the original random sample.",
      "1": "The plan counts nonconforming units, not separate defects. Two units failed, so five is an incorrect count even though rejection is the correct disposition.",
      "3": "The rejection threshold has already been reached. The supplied single-sampling plan does not require or authorize another sample to postpone that initial decision."
    },
    "chart": {
      "type": "data-table",
      "title": "Verified results for the original 32-unit random sample",
      "columns": [
        "Original sample units",
        "Verified inspection outcome"
      ],
      "rows": [
        [
          "S01–S30 (30 units)",
          "All conforming; no defects found"
        ],
        [
          "S31 (one unit)",
          "Nonconforming; two defects found"
        ],
        [
          "S32 (one unit)",
          "Nonconforming; three defects found"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q081",
    "set": 2,
    "batch": 9,
    "sub": "cqa-element-coverage-across-departments",
    "bok": "I.A.1",
    "cognitive": "Analyze",
    "stem": "An audit will examine how externally supplied technical documents are identified, updated and made available in Engineering, Purchasing and Service. It will include transfers between those departments but exclude their unrelated controls and activities. Which description most directly matches this planned coverage?",
    "options": [
      "A department audit that evaluates Engineering's complete operation and uses those results to represent document control in Purchasing and Service without examining their activities.",
      "A system audit that evaluates all management-system elements in the three departments, with document control serving as the initial entry point for the wider assessment.",
      "A product audit that checks the content of selected technical documents against their specifications, with departmental control activities treated as background to the document examination.",
      "An element-based audit that follows the selected document-control requirements across all three departments, including relevant transfers, without assessing each department's entire operation."
    ],
    "answer": 3,
    "why": "The planned work follows one management-system element across several departments and includes the interfaces relevant to that element. This most directly fits an element-based approach. A department approach instead examines numerous applicable elements within a department, while a complete system assessment would extend beyond the stated coverage. Examining the technical content of selected documents alone would also miss how the specified controls operate across the departments. Audit labels can describe different aspects of the same assignment; the decisive distinction here is the coverage actually planned, not a rule that every audit must fit one mutually exclusive label. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 2, 83.</span>",
    "keyPoint": "Distinguish examining one control element across departments from examining the range of controls within an entire department.",
    "trap": "Choosing an audit label from the number of departments visited instead of the requirements and activities actually covered.",
    "distractors": {
      "0": "This replaces the stated cross-department examination with a full review of one department. Engineering's results do not establish how Purchasing and Service apply the controls.",
      "1": "The assignment explicitly excludes unrelated elements and activities. A full assessment of all management-system elements would be broader than the planned work.",
      "2": "Checking document content as an output does not cover the identification, updating, availability and transfer controls specified for all three departments."
    }
  },
  {
    "qid": "cqa:set-2:q082",
    "set": 2,
    "batch": 9,
    "sub": "cqa-post-audit-gift-policy",
    "bok": "I.E.1",
    "cognitive": "Apply",
    "stem": "Three weeks after an audit report is issued, the auditee sends the lead auditor a gift basket valued at $120 with a thank-you note. The auditing organization's policy applies before, during and after assignments: gifts above $20 must be reported and returned; another disposition requires advance approval from the ethics officer. No approval has been obtained. Which response best meets the auditor's responsibilities?",
    "options": [
      "Report the gift through the required channel and return it with a courteous explanation of the policy, without treating the thank-you note as proof of bribery.",
      "Keep the basket and record its value in the audit file, since the report has already been issued and the gift cannot change the completed findings.",
      "Divide the basket among six team members and disclose that arrangement, treating each person's $20 share as a separate gift within the organization's permitted limit.",
      "Donate the basket in the organization's name and document the donation afterward, treating the absence of personal benefit as sufficient authority for an alternative disposition."
    ],
    "answer": 0,
    "why": "The stated policy covers gifts received after the audit and bases the required action on this gift's value. Reporting and courteously returning the $120 basket follows that policy without assuming an improper motive that the facts do not establish. Dividing the contents does not change the value of the gift received, and an alternative disposition such as donation requires approval that has not been obtained. The handbook supports following applicable gift rules and responding respectfully to differing customs; it does not establish one universal monetary limit for every auditing organization. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 38–39.</span>",
    "keyPoint": "Apply the governing gift policy even after reporting, and handle the situation courteously without inventing an allegation of bribery.",
    "trap": "Treating a completed report, shared benefit or charitable destination as an automatic exception to an explicit gift rule.",
    "distractors": {
      "1": "The policy expressly applies after assignments. Recording the gift does not satisfy the separate requirement to return an above-limit gift or obtain approval for another disposition.",
      "2": "The lead auditor received one $120 gift. Dividing its contents afterward does not make the original gift six independently received gifts under the stated rule.",
      "3": "Donation may be an available authorized disposition, but the policy requires advance ethics-officer approval. Lack of personal benefit does not supply that missing authority."
    }
  },
  {
    "qid": "cqa:set-2:q083",
    "set": 2,
    "batch": 9,
    "sub": "cqa-physical-measurement-evidence",
    "bok": "II.B.4",
    "cognitive": "Evaluate",
    "stem": "A product audit plan calls for witnessing a bore measurement on an auditor-selected unit. The approved inspection method requires a calibrated bore gage and a trained operator; site work rules restrict gage operation to authorized personnel. The auditor understands the method and can interpret its results but is not authorized to operate this gage. A trained and authorized technician and a suitable gage with verified current calibration are available. Which approach provides the most defensible evidence for the planned examination?",
    "options": [
      "Use the auditor's calibrated caliper on the selected bore, repeat the measurement three times, and use the average instead of the prescribed bore-gage method.",
      "Accept the technician's previously signed result for the selected unit, treating the gage's current calibration record as sufficient evidence that the measurement was correctly performed.",
      "Observe the authorized technician measure the selected bore using the prescribed method and verified calibrated gage, then record the method, instrument identity and result.",
      "Ask the technician to explain the gage briefly, then perform the measurement personally under observation so the auditor can claim direct physical evidence of conformity."
    ],
    "answer": 2,
    "why": "Reliable physical evidence depends on an appropriate tool, valid calibration where required, competent use and compliance with applicable work restrictions. The trained, authorized technician can perform the prescribed measurement while the auditor observes and records the evidence. The auditor does not need to operate the instrument personally to obtain useful physical-examination evidence. A calibrated alternative tool is not automatically suitable for the specified method, repeated readings do not establish that suitability, and a brief explanation does not grant the auditor authorization to operate the gage. A prior signed result and calibration record also do not fulfill this plan's stated witnessed examination. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 103.</span>",
    "keyPoint": "Evaluate the measurement method, tool, calibration, competent use and work restrictions together; observing qualified work can provide reliable physical evidence.",
    "trap": "Assuming that calibration makes any tool suitable, or that an auditor must personally operate equipment to obtain direct evidence.",
    "distractors": {
      "0": "The approved method specifies a bore gage. Calibration and repeated caliper readings do not establish that this substitute meets the method's requirements or measures the characteristic adequately.",
      "1": "The signed result may be relevant existing evidence, but it does not carry out the planned witnessed measurement. Current calibration alone does not demonstrate correct execution of that measurement.",
      "3": "The auditor is expressly not authorized to operate the gage. Understanding the method and working under observation do not override the site's stated restriction on instrument operation."
    }
  },
  {
    "qid": "cqa:set-2:q084",
    "set": 2,
    "batch": 9,
    "sub": "cqa-grouping-controls-unresolved-evidence",
    "bok": "II.C.1",
    "cognitive": "Evaluate",
    "stem": "Complaint-record case. The closing meeting for an internal audit is held on 20 June. The exhibit contains the complete evidence available at the closing meeting for the listed observations. V1–V4 are verified; U1 remains unresolved because the sources conflict and further evidence cannot yet be obtained. The reporting procedure groups verified observations by the specific unmet control, retains their evidence IDs and identifies unresolved contradictions separately. How should the lead organize these observations for reporting?",
    "options": [
      "Group V1–V4 into one general complaint-record finding without distinguishing the two control requirements, retain their evidence IDs, and list U1 separately as requiring clarification.",
      "Issue four separate findings for V1–V4 because each complaint has a different identifier, retain the relevant evidence, and list U1 separately as an unresolved observation.",
      "Group V1/V2 under section 2 and V3/V4/U1 under section 5, retain all evidence IDs, and treat the unresolved message discrepancy as another confirmed closure failure.",
      "Group V1/V2 under section 2 and V3/V4 under section 5, retain their evidence IDs, and report U1 separately as an unresolved observation requiring clarification."
    ],
    "answer": 3,
    "why": "V1 and V2 establish late recording of the assigned owner under CR-4 section 2. V3 and V4 establish customer closure messages sent and recorded after closed status under section 5. Grouping by those two unmet controls follows the stated reporting procedure while retaining the examples that support each finding. U1 does not yet establish whether section 5 was met, so it should remain an explicitly unresolved observation requiring clarification. Shared control failures do not by themselves establish a shared root cause, and the owner-record gaps do not prove that no person had actually been assigned. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 104, 110, 122.</span>",
    "keyPoint": "Organize verified evidence around the specific unmet controls while preserving identifiers and separating unresolved contradictions from confirmed nonconformities.",
    "trap": "Grouping only by record count or a broad process label, or allowing contradictory evidence to inflate the confirmed findings.",
    "distractors": {
      "0": "A broad complaint-record heading obscures the two distinct unmet controls. The stated procedure calls for grouping by the specific control while retaining the supporting observations.",
      "1": "Different complaint identifiers identify separate evidence examples, not necessarily separate control findings. The procedure calls for linking the two observations supporting each unmet control.",
      "2": "U1's sources conflict and the needed corroboration is unavailable. Including it as a confirmed section 5 failure overstates what the evidence available at the closing meeting establishes."
    },
    "caseId": "cqa-set2-complaint-records-01",
    "chart": {
      "type": "data-table",
      "title": "Complaint-record case: requirements and evidence available at the closing meeting",
      "columns": [
        "Reference",
        "Verified requirement or available evidence"
      ],
      "rows": [
        [
          "CR-4, section 2",
          "Record the assigned complaint owner before investigation begins."
        ],
        [
          "CR-4, section 5",
          "Send the customer closure message and record it in the complaint file before setting the complaint status to closed."
        ],
        [
          "V1 — complaint C101",
          "Verified audit trail: investigation began 4 June at 09:00; the assigned owner was first recorded at 12:00 that day."
        ],
        [
          "V2 — complaint C109",
          "Verified audit trail: investigation began 7 June at 10:00; the assigned owner was first recorded at 16:00 that day."
        ],
        [
          "V3 — complaint C112",
          "Verified records: status changed to closed on 10 June; the customer closure message was sent and recorded on 11 June."
        ],
        [
          "V4 — complaint C118",
          "Verified records: status changed to closed on 14 June; the customer closure message was sent and recorded on 16 June."
        ],
        [
          "U1 — complaint C125",
          "Status changed to closed on 18 June. Its case log records a closure message on 17 June, but the retrieved message copy concerns C152. Whether the required C125 message was sent and recorded before closure remains unresolved."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q085",
    "set": 2,
    "batch": 9,
    "sub": "cqa-supplemental-report-clarification",
    "bok": "II.C.3",
    "cognitive": "Apply",
    "stem": "Complaint-record case. The closing meeting for an internal audit is held on 20 June. The exhibit contains the complete evidence available at the closing meeting for the listed observations. V1–V4 are verified; U1 remains unresolved because the sources conflict and further evidence cannot yet be obtained. The reporting procedure groups verified observations by the specific unmet control, retains their evidence IDs and identifies unresolved contradictions separately. The issued report retains V1–V4 as confirmed observations and identifies U1 as unresolved. On 24 June, the team authenticates the original C125 message and server record, confirming that its customer closure message was sent and recorded on 17 June, before closed status on 18 June. Local procedure AP-7 requires audit-manager approval of supplemental reports, distribution to the original recipients and retention with the original report. What should happen next?",
    "options": [
      "Revise the original report in place to remove U1, recirculate it after manager approval, and replace the superseded record so recipients have one current version.",
      "Obtain approval for a supplemental clarification of U1, send it to the original recipients, and retain both reports and supporting evidence; V1–V4 remain unchanged.",
      "Retain U1 as unresolved until the next audit can reconfirm the message, file the new evidence, and leave the issued report as the sole communication.",
      "Send a clarification directly to the complaint owner, close U1 in the working papers, and defer manager approval and recipient distribution to the next scheduled report."
    ],
    "answer": 1,
    "why": "The original report accurately identified an unresolved contradiction. The later authenticated evidence resolves the same complaint, communication and timing question: C125's required message was sent and recorded before closure. A supplemental report can clarify that original observation. Following AP-7 means obtaining the specified approval, informing the original recipients, and preserving the original report, supplement and supporting evidence in the audit record. The clarification does not negate the separately verified owner-recording and closure-message failures in V1–V4. It also does not require describing the accurate original uncertainty as an erroneous confirmed finding. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 104, 119, 130–131.</span>",
    "keyPoint": "Clarify resolved report uncertainties through the authorized supplemental-report process while preserving history and unaffected findings.",
    "trap": "Erasing the original report history, leaving resolved uncertainty uncommunicated, or extending one clarification to unrelated confirmed observations.",
    "distractors": {
      "0": "Replacing the original record conflicts with the stated requirement to retain the supplemental report with the original. The report's accurate historical uncertainty should remain traceable to the later clarification.",
      "2": "The team has already authenticated evidence resolving the stated question. No remaining uncertainty or procedure requires waiting for the next audit before communicating the clarification.",
      "3": "A message to one complaint owner and a working-paper update do not meet the required approval and distribution process. The original report recipients need the authorized clarification."
    },
    "caseId": "cqa-set2-complaint-records-01",
    "chart": {
      "type": "data-table",
      "title": "Complaint-record case: requirements and evidence available at the closing meeting",
      "columns": [
        "Reference",
        "Verified requirement or available evidence"
      ],
      "rows": [
        [
          "CR-4, section 2",
          "Record the assigned complaint owner before investigation begins."
        ],
        [
          "CR-4, section 5",
          "Send the customer closure message and record it in the complaint file before setting the complaint status to closed."
        ],
        [
          "V1 — complaint C101",
          "Verified audit trail: investigation began 4 June at 09:00; the assigned owner was first recorded at 12:00 that day."
        ],
        [
          "V2 — complaint C109",
          "Verified audit trail: investigation began 7 June at 10:00; the assigned owner was first recorded at 16:00 that day."
        ],
        [
          "V3 — complaint C112",
          "Verified records: status changed to closed on 10 June; the customer closure message was sent and recorded on 11 June."
        ],
        [
          "V4 — complaint C118",
          "Verified records: status changed to closed on 14 June; the customer closure message was sent and recorded on 16 June."
        ],
        [
          "U1 — complaint C125",
          "Status changed to closed on 18 June. Its case log records a closure message on 17 June, but the retrieved message copy concerns C152. Whether the required C125 message was sent and recorded before closure remains unresolved."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q086",
    "set": 2,
    "batch": 9,
    "sub": "cqa-digital-evidence-incident-communication",
    "bok": "III.D",
    "cognitive": "Apply",
    "stem": "An auditor used an approved encrypted tablet to photograph confidential audit records with the auditee's permission. The tablet is stolen during the return journey. Available information does not show whether anyone has accessed the files. The agreed audit arrangements identify an auditee security contact and a client contact for such incidents. Which communication best addresses the loss?",
    "options": [
      "Inform the client that encryption makes disclosure unlikely, and defer contacting the auditee until the device is recovered or access is confirmed.",
      "Complete an exact inventory of every stored photograph before notifying either contact, so the first notice contains a fully resolved exposure assessment.",
      "Tell both contacts that the loss confirms disclosure of the stored records, and frame the initial report around the presumed recipients of that information.",
      "Promptly notify the designated contacts of the loss, the known contents and protections, and what remains unknown; update the account as facts are established."
    ],
    "answer": 3,
    "why": "Authorized recording still creates evidence that the auditor must safeguard. Loss of the device is a security incident that must be reported to the auditee through the agreed arrangements. The initial notice should distinguish the established theft, known contents and protections from the unresolved question of access. Encryption does not establish that notification is unnecessary, while theft does not establish that the records were actually disclosed. A complete investigation need not precede the initial factual notice; the responsible contacts can coordinate the response and receive updates as more is learned. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 164.</span>",
    "keyPoint": "Report loss of authorized electronic audit evidence through the agreed contacts, separating verified facts from uncertainties about access or disclosure.",
    "trap": "Treating encryption as a reason to withhold notification, or treating loss of a device as proof that its contents were disclosed.",
    "distractors": {
      "0": "The device contained the auditee's confidential evidence. Encryption is relevant information for the response, but it does not justify withholding notice from the designated auditee contact until recovery or proof of access.",
      "1": "An exact inventory may improve later updates, but waiting for a fully resolved exposure assessment delays reporting the known loss. The initial notice can state what is known and identify information still being established.",
      "2": "The theft is established; unauthorized access and disclosure are not. Presenting presumed recipients or disclosure as facts overstates the evidence and can misdirect the response."
    }
  },
  {
    "qid": "cqa:set-2:q087",
    "set": 2,
    "batch": 9,
    "sub": "cqa-group-interview-purpose",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "An audit objective is to understand how a launch team jointly resolves conflicting engineering, production, and service requirements before approving design changes. Members use live discussion to reconcile competing constraints. Completed change records show decisions but not how different contributions are raised and reconciled. Individual interviews and record review remain available. Which interview plan best supplies evidence about the team's interaction as well as its reported decisions?",
    "options": [
      "Interview each member separately and reconstruct the interaction from their accounts, treating observed group discussion as unnecessary once the answers broadly agree.",
      "Conduct a focused group interview on a recent change, invite contributions from different functions, and corroborate statements through records and individual follow-up.",
      "Ask the team leader to present the agreed decision while members listen, then use the absence of objections as evidence that competing requirements were considered.",
      "Have the group produce one consensus account before the interview and question its spokesperson, using uniform answers as evidence of effective team interaction."
    ],
    "answer": 1,
    "why": "Understanding team interaction provides a specific reason to use a group interview. A focused discussion of a recent change lets the auditor hear contributions from different functions and observe how the members interact, while records and individual follow-up corroborate what they say. The group setting does not make agreement, silence, or a spokesperson's account sufficient evidence of how competing requirements were handled. Individual interviews can add valuable information, but broad agreement among separate accounts does not replace the opportunity to examine interaction when that is an explicit audit objective. The method is selected for its evidentiary purpose, with follow-up suited to what the discussion reveals. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 167, 169.</span>",
    "keyPoint": "Choose a group interview when the evidence objective justifies observing team interaction, and corroborate the participants' statements rather than treating consensus as verification.",
    "trap": "Confusing a uniform group answer or an unchallenged leader's account with evidence that individual contributions and competing requirements were considered.",
    "distractors": {
      "0": "Separate interviews can supply useful accounts, but their broad agreement does not establish that observing the team's interaction is unnecessary. The stated objective gives a specific reason to include a focused group discussion.",
      "2": "A leader's presentation and the others' silence do not establish how differing contributions were raised or reconciled. The auditor should obtain contributions and corroborating evidence instead of treating a lack of objections as confirmation.",
      "3": "Preparing one account and routing it through a spokesperson filters out the interaction the audit seeks to understand. Uniform answers may reflect preparation or deference rather than effective handling of conflicting requirements."
    }
  },
  {
    "qid": "cqa:set-2:q088",
    "set": 2,
    "batch": 9,
    "sub": "cqa-strategic-initiative-audit-evidence",
    "bok": "IV.B.1",
    "cognitive": "Analyze",
    "stem": "The strategic plan calls for customer rework to remain at or below 3% at each of two service sites after a revised handoff process is introduced. Both sites have issued the instructions and completed training. An audit independently verifies comparable quarterly rework rates of 2% at North and 7% at South, using the agreed definitions. Management asks what these results mean for its review of the initiative. Which audit message is best supported?",
    "options": [
      "Report the completed rollout milestones and different site outcomes, identify the unresolved performance gap, and provide evidence for management's review of deployment and effectiveness.",
      "Report successful deployment because both sites completed training, and treat the rework results as operational details for owners to monitor outside the strategic review.",
      "Combine the two sites' percentages into one unweighted average, and judge the initiative against that figure because the strategic plan concerns the whole organization.",
      "Report that the revised handoff method caused South's higher rework, and recommend replacing the strategy before management evaluates other possible contributors."
    ],
    "answer": 0,
    "why": "Audit information can give management an independent view of how a strategic initiative is deployed and whether its objectives are being achieved. Issued instructions and completed training are relevant rollout milestones, but they do not establish consistent application or the intended results. North's reported rate meets the stated site target; South's does not. The report should preserve that distinction and support management's examination of deployment and effectiveness. The supplied information does not establish why South's rate is higher or that the revised method caused it. Management retains the strategic decisions, informed by the audit evidence. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 212, 215.</span>",
    "keyPoint": "Relate verified deployment evidence and performance results to the stated strategic objectives, preserving material differences for management's decisions.",
    "trap": "Equating completed rollout activities with effectiveness, or turning different outcomes into an unsupported causal conclusion.",
    "distractors": {
      "1": "Training completion does not establish that the revised process is consistently applied or achieving its objective. Rework is an explicit strategic measure here, so excluding it from the strategic review would omit material information.",
      "2": "The stated target applies to each site, so an overall figure cannot replace the site-level assessment. An unweighted average also need not represent the combined rework rate when the sites' work volumes differ.",
      "3": "The rates establish a performance difference, not its cause. Attributing South's result to the revised method and proposing replacement before relevant contributors are examined overstates what the audit evidence supports."
    }
  },
  {
    "qid": "cqa:set-2:q089",
    "set": 2,
    "batch": 9,
    "sub": "cqa-electronic-approval-attribution",
    "bok": "IV.A.10",
    "cognitive": "Apply",
    "stem": "A release-approval procedure requires each approval to be attributable to an authorized reviewer. At a shared inspection workstation, completed records display a typed reviewer name and time, while the screen session uses a common login. IT says that separate individual signing controls may operate behind the screen but has not demonstrated them. The auditor has not yet examined authentication or change records. Which next check best tests the approval requirement?",
    "options": [
      "Compare typed names with the authorized-reviewer roster and training records, then accept the matched entries as proof that those people performed the approvals.",
      "Check that approval timestamps precede shipment and that the sampled products passed inspection, then use those results to establish the identity of each approver.",
      "Trace sampled approval events to person-specific authentication or other attributable evidence, and examine who can enter or alter the approval and its history.",
      "Ask the quality manager to confirm that reviewers follow the procedure, then rely on that confirmation instead of examining the system's approval controls."
    ],
    "answer": 2,
    "why": "The auditor needs to establish how an approval event is linked to the authorized individual and how that link and the record are protected from uncontrolled change. A shared workstation or session could still support separate, valid individual signing controls; their existence and operation must be examined. Conversely, a displayed name and timestamp do not by themselves demonstrate who performed the approval. Tracing selected events and examining access and change controls addresses the stated requirement without assuming that the shared session proves forgery or that every typed name is invalid. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 72–73, 102.</span>",
    "keyPoint": "Verify the link between an electronic approval, its authorized individual, and the controls protecting that attribution and record history.",
    "trap": "Treating a displayed name as sufficient proof of identity, or treating a shared workstation as sufficient proof of fraud.",
    "distractors": {
      "0": "The roster and training records can show who was authorized and qualified, but matching a typed name to that list does not establish who actually executed the sampled approval.",
      "1": "Approval timing and satisfactory inspection results address other release questions. Neither establishes the identity of the person who performed an electronic approval or protects its attribution from alteration.",
      "3": "The manager's account may guide the investigation, but it does not demonstrate the individual signing mechanism or corroborate the sampled events. The relevant system controls and records still need examination."
    }
  },
  {
    "qid": "cqa:set-2:q090",
    "set": 2,
    "batch": 9,
    "sub": "cqa-capability-spread-and-centering",
    "bok": "V.D.2",
    "cognitive": "Understand",
    "stem": "A stable process has fixed two-sided specification limits and an appropriate normal-distribution capability model. Its report uses the same justified within-process sigma estimate for both indices and gives Cp = 1.50 and Cpk = 0.95. No customer acceptance cutoff is stated. Which explanation correctly distinguishes what these indices describe?",
    "options": [
      "Cp compares specification width with process spread; the lower Cpk indicates that the mean is off-center, reducing the margin to the nearer limit.",
      "Cp measures distance to the nearer limit, while Cpk compares total widths; the difference shows that spread, rather than location, is the limitation.",
      "Cp considers both limits, while Cpk evaluates only the upper limit; the lower Cpk identifies the upper limit as the closer boundary.",
      "Cp describes the stable condition, while Cpk adds changes over time; the difference demonstrates that the process has subsequently gone out of control."
    ],
    "answer": 0,
    "why": "Cp compares the specification width with the process spread represented by six sigma. Cpk uses the smaller standardized distance from the process mean to either specification limit, so it also reflects centering. With the same justified sigma and a valid stable-process model, Cpk being below Cp indicates that the mean is away from the specification midpoint and has less margin on one side. The pair does not identify which limit is nearer, demonstrate a later loss of control, or supply an unstated customer acceptance threshold. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 281.</span>",
    "keyPoint": "Cp describes spread relative to specification width; Cpk also reflects the mean's position through its distance to the nearer specification limit.",
    "trap": "Reversing the roles of spread and centering, or using the Cp–Cpk difference to infer a particular limiting side or process instability.",
    "distractors": {
      "1": "This reverses the roles of the indices. Cp compares widths, while Cpk uses the nearer limit and therefore responds to the mean's location as well as process spread.",
      "2": "Cpk takes the smaller of the upper-side and lower-side standardized distances. Its value alone does not identify which side supplied that minimum.",
      "3": "Cpk does not become a time-change or loss-of-control measure merely because it is lower than Cp. The stem establishes stability; the difference here concerns centering under the stated model."
    }
  }
];
})(typeof window !== 'undefined' ? window : globalThis);
