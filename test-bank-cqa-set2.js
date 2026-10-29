/*
 * ASQ CQA Exam Set 2 — original practice questions.
 * Batches 1–14: Q001–Q140. Planned bank: 150 questions.
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
 * Batch 10 counts: I 3 / II 3 / III 2 / IV 1 / V 1.
 * Batch 11 counts: I 2 / II 3 / III 2 / IV 2 / V 1.
 * Batch 12 counts: I 3 / II 3 / III 2 / IV 1 / V 1.
 * Batch 13 counts: I 2 / II 3 / III 2 / IV 2 / V 1.
 * Batch 14 counts: I 3 / II 3 / III 2 / IV 1 / V 1.
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
  },
  {
    "qid": "cqa:set-2:q091",
    "set": 2,
    "batch": 10,
    "sub": "cqa-prospective-risk-audit-purpose",
    "bok": "I.A.3",
    "cognitive": "Apply",
    "stem": "A business-continuity review identifies dependence on one transport carrier as a potential source of delivery interruption. Management establishes an alternate-carrier arrangement and a stock-buffer control, then commissions an audit of whether these treatments are implemented and effective. No interruption or related nonconformity has occurred, and there is no earlier audit finding to close. Which purpose best describes the assignment?",
    "options": [
      "Investigate the causes and extent of an actual delivery interruption, using the treatment records as evidence of the failure that prompted the audit.",
      "Assess whether controls for the identified potential interruption are implemented and effective, using evidence about the arrangements before an actual delivery failure occurs.",
      "Verify closure of an earlier audit finding by checking whether corrective actions for the recorded delivery failure were completed and prevented its recurrence.",
      "Establish initial supplier qualification by evaluating the primary carrier's capability before it is approved to begin providing the organization's first transport service."
    ],
    "answer": 1,
    "why": "The assignment audits treatment of an identified risk: it seeks evidence that the alternate-carrier and stock-buffer arrangements are implemented and effective before the potential interruption becomes an actual failure. That is a risk-focused purpose. The scenario does not describe a reported interruption requiring a for-cause investigation, a previous finding requiring follow-up closure, or initial approval of the existing carrier. Risk-focused work can also examine conformity to applicable requirements; the distinction here is the stated purpose of this engagement, not a rule that audit purposes cannot overlap. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 7, 206.</span>",
    "keyPoint": "An audit can verify treatment of an identified potential risk before a failure or nonconformity occurs.",
    "trap": "Assuming that checking protective controls must be an investigation of a past failure or follow-up of an earlier audit finding.",
    "distractors": {
      "0": "No actual interruption has occurred. The purpose is to assess controls for the identified possibility of interruption, rather than establish the cause and extent of an existing failure.",
      "2": "The stem expressly excludes an earlier finding to close. Although risk-treatment verification and corrective-action verification can use similar techniques, this assignment has no previous finding or recorded failure to resolve.",
      "3": "The organization already uses the primary carrier. The stated engagement assesses controls for a dependency risk, not qualification before the carrier's first approved service."
    }
  },
  {
    "qid": "cqa:set-2:q092",
    "set": 2,
    "batch": 10,
    "sub": "cqa-effective-revision-criteria",
    "bok": "I.C",
    "cognitive": "Analyze",
    "stem": "A contract revision states that coating specification revision B, requiring at least 50 μm, applies to orders accepted on or after 1 September. Orders accepted earlier retain revision A, requiring at least 40 μm, unless separately amended. Both orders in the exhibit were produced on 10 September and have no separate amendments. Which assessment of their verified thickness results follows the applicable criteria?",
    "options": [
      "Apply revision A to both orders and accept both thickness results, because a new revision requires an individual amendment before it can affect any order.",
      "Apply revision B to both orders and record both thickness results as nonconforming, because production occurred after the revision's stated effective date.",
      "Apply revision A to P610 and revision B to P611; the measured thickness meets P610's applicable minimum but falls below P611's applicable minimum.",
      "Defer classification until the customer chooses one common revision for both orders, because orders produced together should be assessed against a consistent criterion."
    ],
    "answer": 2,
    "why": "The contract makes order acceptance the applicability trigger. P610 was accepted before 1 September and has no separate amendment, so revision A's 40 μm minimum applies; its 45 μm result meets that minimum. P611 was accepted after the trigger date, so revision B's 50 μm minimum applies; its 45 μm result falls short. The common production date does not replace the expressly stated acceptance-date rule. The assessment concerns the reported thickness criterion, not proof that either order meets every contractual requirement. These effective-date and amendment rules come from this contract rather than a universal rule about how revisions apply. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 21–22.</span>",
    "keyPoint": "Determine the criterion applicable to each transaction using the contract's explicit revision and effective-date rules.",
    "trap": "Applying the newest revision retroactively because production is later, or preserving an old revision for new orders despite an explicit applicability trigger.",
    "distractors": {
      "0": "The separate-amendment condition applies to orders accepted before the trigger date. The contract already applies revision B to later accepted orders, including P611, without requiring another amendment.",
      "1": "Production date is not the stated trigger. Applying revision B to P610 disregards the contract's express retention of revision A for earlier accepted, unamended orders.",
      "3": "Producing the orders together does not create a conflicting criterion. The contract supplies a clear rule for each order, so a new common-revision decision is unnecessary."
    },
    "chart": {
      "type": "data-table",
      "title": "Verified order dates and coating measurements",
      "columns": [
        "Order",
        "Acceptance date",
        "Verified coating thickness"
      ],
      "rows": [
        [
          "P610",
          "31 August",
          "45 μm"
        ],
        [
          "P611",
          "2 September",
          "45 μm"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q093",
    "set": 2,
    "batch": 10,
    "sub": "cqa-observer-information-route",
    "bok": "I.D",
    "cognitive": "Apply",
    "stem": "An approved audit plan permits an employee to accompany an auditor as an observer for training. The observer is not assigned authority to interview personnel, assess conformity or issue findings. During an in-scope walkthrough, the observer notices a status label that appears inconsistent with its associated inspection record. The discrepancy has not been verified. What should the observer do?",
    "options": [
      "Question the operator, gather additional records and draft a finding for the lead, treating approval to accompany the team as authority to conduct audit work.",
      "Exclude the observation from the audit, because only appointed auditors may originate information that could support a finding and observer comments would compromise the investigation.",
      "Send the apparent discrepancy directly to the client as a confirmed nonconformity, then allow the assigned auditor to complete its supporting evidence trail afterward.",
      "Relay the specific observation to the assigned auditor, who can verify the relevant requirement and evidence and decide how to record and report it."
    ],
    "answer": 3,
    "why": "The planned observer role does not include interviewing, conformity assessment or reporting findings. Passing the specific observation to the responsible auditor preserves potentially useful information while respecting those assigned boundaries. The auditor can then examine the applicable requirement and corroborating evidence before deciding whether there is a finding and reporting through the audit team. Observer status does not make the information unusable, and permission to accompany the audit does not by itself confer the auditor's authority. These limits are explicit in this assignment rather than an assertion that every accompanying person has identical restrictions. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 25, 53.</span>",
    "keyPoint": "Route an observer's potentially useful information through the responsible auditor for verification and assessment within the agreed roles.",
    "trap": "Confusing permission to observe with authority to audit, or discarding useful information solely because its source is an observer.",
    "distractors": {
      "0": "The approved assignment expressly withholds interviewing and conformity-assessment authority. Preparing a finding first and asking for later review does not satisfy those limits.",
      "1": "An auditor can investigate relevant information brought to attention by another person. The observer's role limits what the observer may decide or perform, not whether the auditor may verify the reported facts.",
      "2": "The discrepancy is unverified, and the observer has no finding-reporting authority. Reporting a confirmed nonconformity directly to the client both overstates the evidence and bypasses the assigned audit process."
    }
  },
  {
    "qid": "cqa:set-2:q094",
    "set": 2,
    "batch": 10,
    "sub": "cqa-forward-tracing-branches",
    "bok": "II.A.6",
    "cognitive": "Apply",
    "stem": "An auditor selects incoming material lot K47 to trace its identification and controls through use and dispatch. Issue records show that K47 was divided between work orders W31 and W32; W31 includes an approved rework route. Some resulting output has been dispatched and some remains in controlled stock. Which path best applies forward tracing to the selected lot?",
    "options": [
      "Start with receipt and lot identity; follow issues into both work orders, relevant rework and inspection links, then reconcile the resulting stock and dispatch records.",
      "Start with recent customer dispatches; trace each shipment backward through finished stock and production to its incoming material records, then examine the associated supplier approvals.",
      "Start with K47's receipt; examine supplier approval, purchase-order and certificate details, then conclude the trace once the incoming acceptance and purchasing requirements are verified.",
      "Start with W31's normal production route and dispatch records, then apply that trace's conclusions to W32 and the rework route without following their separate links."
    ],
    "answer": 0,
    "why": "Forward tracing follows a selected input or transaction downstream through its linked activities and results. Starting with K47's receipt preserves the selected lot's identity while following its issues into both work orders, including the relevant rework and inspection controls, and onward to stock and dispatched output. Starting from shipments and moving upstream is backward tracing. Supplier and purchasing checks may be relevant, but stopping at incoming acceptance would not cover the stated downstream objective. The selected lot's different paths should be examined rather than assumed equivalent; this does not require a universal 100% inspection of every record or transfer operational stock-disposition duties to the auditor. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 81–82.</span>",
    "keyPoint": "Follow a selected input downstream through its relevant process branches, controls and outputs while preserving the links to that input.",
    "trap": "Calling a review forward tracing while moving upstream, stopping at receipt, or substituting one branch for other relevant paths.",
    "distractors": {
      "1": "This describes a backward trace from outputs toward inputs and does not necessarily preserve the initially selected K47 path. It may be useful for another objective but is not the requested forward trace.",
      "2": "Those checks address upstream purchasing and incoming acceptance. They stop before the use, rework, output and dispatch activities that this selected-lot trace is intended to examine.",
      "3": "W32 and the approved rework route are relevant branches of K47's use. Results from W31's normal route do not by themselves establish how the separate branches maintained the required controls."
    }
  },
  {
    "qid": "cqa:set-2:q095",
    "set": 2,
    "batch": 10,
    "sub": "cqa-substantiated-alternative-capa",
    "bok": "II.D.2",
    "cognitive": "Evaluate",
    "stem": "Errors in an order-total workbook were traced to a formula range that omits newly inserted lines. The criteria require accurate totals and controlled formula changes. Until implementation, every order total is independently recalculated outside the workbook before release. The auditor suggests replacing the workbook with new software. The auditee instead proposes a revised formula that includes added lines, with edits restricted to authorized, reviewed changes. Independent challenge tests support the proposed mechanism. The plan names an owner, implementation date and 30 days of production checks against agreed accuracy criteria. The procedure requires those checks before closure. Which review decision is best supported?",
    "options": [
      "Reject the alternative and require the suggested software replacement, because the auditor's original recommendation defines the permanent remedy once the cause has been verified.",
      "Defer any decision on the proposed plan until the production checks are complete, because plan approval requires results from an action that is already implemented.",
      "Accept the substantiated alternative plan, document the review and retain the agreed implementation and effectiveness checks before closure, rather than require the preferred software replacement.",
      "Accept the alternative and close the finding on the challenge-test results, treating the planned production checks as routine monitoring outside the corrective-action verification process."
    ],
    "answer": 2,
    "why": "The proposal addresses the verified mechanism that excludes added order lines, includes control of formula changes, and supplies supporting tests, responsibility, timing and production-effectiveness criteria. Interim independent recalculation protects order totals while the permanent change awaits implementation. Those facts support accepting the plan even though it differs from the auditor's preferred remedy. A reviewer should assess the auditee's reasoning against the cause and applicable requirements, not make a personal preference an additional criterion. Plan acceptance does not establish completed implementation or production effectiveness: the specified follow-up checks remain necessary before closure under the stated procedure. If evidence revealed a concrete weakness, the reviewer should identify it for resolution; no such unsupported weakness needs to be invented merely because the solution retains the workbook. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 138.</span>",
    "keyPoint": "Accept a supported corrective-action alternative that addresses the verified cause and required outcomes, while preserving the agreed verification and closure conditions.",
    "trap": "Treating the auditor's preferred remedy as a requirement, or confusing approval of a sound plan with verification that the completed action is effective.",
    "distractors": {
      "0": "The stated criteria concern accuracy and controlled changes, not a mandatory software replacement. The auditor's suggestion does not override a substantiated alternative that addresses the verified cause.",
      "1": "Review of a proposed plan precedes its implementation and subsequent effectiveness checks. The supporting evidence is sufficient to decide on this plan while retaining those later obligations.",
      "3": "Challenge tests support the proposed mechanism but do not demonstrate the required 30 days of production effectiveness. The local procedure expressly requires those checks before closure."
    }
  },
  {
    "qid": "cqa:set-2:q096",
    "set": 2,
    "batch": 10,
    "sub": "cqa-observation-time-boundary",
    "bok": "II.B.5",
    "cognitive": "Analyze",
    "stem": "An audit examines whether a required label-verification check was completed before order D671 was released on 8 August. On 22 August, the auditor observes a technician demonstrate the approved check correctly and verifies its satisfactory result. The technician says the same check was completed before D671's release. No records or other evidence corroborating that earlier event have yet been examined. Which statement best describes what the current evidence supports?",
    "options": [
      "The demonstration confirms both present and earlier performance because the same check was used, unless another record directly contradicts the technician's account of D671.",
      "The demonstration establishes correct execution during the observed check; whether it occurred before D671's release remains a separate historical claim requiring relevant corroboration.",
      "The earlier check should be reported as omitted because its supporting evidence has not been examined; today's satisfactory result does not change that finding.",
      "The arranged demonstration should be treated as testimonial explanation, while the technician's recollection provides stronger evidence because it concerns the original release event."
    ],
    "answer": 1,
    "why": "The auditor directly observed and verified the check performed on 22 August, so that observation has evidentiary value for the demonstrated activity. It does not establish that the same activity occurred before a particular release on 8 August. The earlier event requires relevant corroboration, such as records or other evidence linked to that event. The absence of an examination so far is not proof that the check was omitted, and arranging a demonstration does not turn an observed fact into merely an interview statement. Evidence must be relevant and sufficient for the particular conclusion being drawn. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 107.</span>",
    "keyPoint": "Match an observed fact to the event and time it establishes; a satisfactory current demonstration does not by itself verify a claimed earlier completion.",
    "trap": "Extending present observation backward in time, or treating an unexamined historical claim as either confirmed performance or confirmed nonperformance.",
    "distractors": {
      "0": "Using the same method does not establish that it was performed at the earlier required time. A lack of contradictory records is not a substitute for relevant support for the historical claim.",
      "2": "The historical claim has not yet been corroborated; the stem does not say the check was omitted. Reporting nonperformance would convert an unresolved evidence question into an unsupported finding.",
      "3": "The auditor observed the demonstration and verified its result. It therefore supplies direct evidence about that event, while the technician's recollection about the earlier event still needs corroboration."
    }
  },
  {
    "qid": "cqa:set-2:q097",
    "set": 2,
    "batch": 10,
    "sub": "cqa-work-focused-visual-interview",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "An operator asks what the auditor's written question means and gives short, incomplete answers to its abstract quality terminology. They share a working language. The normal task uses an approved pictorial instruction, but the operator must also read the product code and enter the lot number on the job record. No work has yet been observed. Which interview approach best develops evidence about the operator's actual performance?",
    "options": [
      "Read the entire written question more slowly and request a yes-or-no answer, using the operator's confidence in that answer to judge ability to perform the task.",
      "Ask the supervisor to describe the operator's routine and compare that account with the pictorial instruction, using agreement to confirm the operator's ability to follow it.",
      "Use the pictorial instruction as sufficient evidence of task understanding, and omit code-reading and record-entry checks because the visual sequence reduces the need for written communication.",
      "Observe ordinary work using the approved visual aid, ask short neutral questions, check the required code reading and lot entry, and corroborate relevant statements."
    ],
    "answer": 3,
    "why": "The unproductive written question does not yet establish whether the operator can perform the job. A work-focused conversation, appropriate visual aid and short neutral prompts can make the activity easier to explain and observe. The auditor should still check the actual requirements, including reading the product code and entering the lot number. Adapting the interview does not waive a necessary job skill or permit coaching the operator through a required step. Observation and relevant corroboration develop evidence about performance more directly than confidence, a supervisor's substitute account or the mere existence of an instruction. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 39, 166–167, 169.</span>",
    "keyPoint": "Adapt the interview to the work and the person's communication needs while continuing to assess every applicable job requirement.",
    "trap": "Confusing difficulty with the auditor's question with job incompetence, or using a visual aid as a reason to waive required reading and recording skills.",
    "distractors": {
      "0": "Repeating the same abstract question more slowly may leave the communication problem unresolved. A confident yes-or-no answer does not demonstrate the required work, code reading or record entry.",
      "1": "The supervisor's account may provide context, but agreement with the instruction does not demonstrate this operator's performance. It substitutes another person's explanation for evidence the auditor can obtain from the work.",
      "2": "An approved visual sequence can support communication, but the stem expressly requires product-code reading and lot-number entry. Those skills cannot be excluded merely because part of the instruction is pictorial."
    }
  },
  {
    "qid": "cqa:set-2:q098",
    "set": 2,
    "batch": 10,
    "sub": "cqa-parallel-fixed-observations",
    "bok": "III.B",
    "cognitive": "Apply",
    "stem": "Two auditors are free in the briefing room at 09:05. Both are qualified for the two required observations in the exhibit, and one auditor is sufficient for each. Access and escorts are arranged. Each event must be observed for its complete fixed window and cannot be repeated during the visit. The team review is also fixed. Which allocation meets the coverage and timing requirements?",
    "options": [
      "Keep both auditors at West Bay for its observation, then travel to East Bay and use the operator's account to reconstruct that event before the review.",
      "Assign one auditor to each bay, then exchange locations at 09:35 so both see each process and can combine their partial observations during the review.",
      "Assign one auditor to each bay for the full window, complete the five-minute note checks there, and return separately for the reserved 10:00 team review.",
      "Assign one auditor to each bay for the full window, then have both meet at West Bay at 09:50 to compare notes before returning together."
    ],
    "answer": 2,
    "why": "Parallel assignments allow both complete observations. Leaving the briefing room at 09:05 gets each auditor to the assigned bay at 09:15, before the 09:20 start. Each observes until 09:45, completes the five-minute note check by 09:50, and returns in ten minutes for the 10:00 team review. Keeping the auditors together would miss the simultaneous event. Exchanging bays interrupts both required observations, and gathering at West Bay first adds travel that cannot meet the proposed 09:50 gathering or the reserved review. Coordinated parallel work preserves coverage while retaining time to reconcile the team's evidence. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 152–153.</span>",
    "keyPoint": "Allocate qualified auditors to simultaneous fixed opportunities, include travel and note time, and preserve the team's scheduled evidence review.",
    "trap": "Trying to give both auditors exposure to every event at the cost of complete observation or the time needed to consolidate evidence.",
    "distractors": {
      "0": "Both events run from 09:20 to 09:45. Arriving at East Bay after completing West Bay cannot satisfy its required full observation, and an account afterward is not the coverage specified by this plan.",
      "1": "Leaving at 09:35 misses the final ten minutes at each original bay. The fifteen-minute transfer reaches the other bay at 09:50, after both events have ended, so the partial observations cannot reconstruct full coverage.",
      "3": "The East Bay auditor finishes the required note check at 09:50 and then needs fifteen minutes to reach West Bay. The proposed gathering is impossible; traveling onward to the briefing room would also miss the fixed 10:00 review."
    },
    "chart": {
      "type": "data-table",
      "title": "Fixed observations and time allowances",
      "columns": [
        "Activity or movement",
        "Requirement"
      ],
      "rows": [
        [
          "West Bay start-up verification",
          "Observe 09:20–09:45 in full."
        ],
        [
          "East Bay line clearance",
          "Observe 09:20–09:45 in full."
        ],
        [
          "Notes and confirmation",
          "Five minutes at the bay immediately after each observation."
        ],
        [
          "Travel",
          "Briefing room to either bay, or back: ten minutes. Between bays: fifteen minutes."
        ],
        [
          "Team evidence review",
          "Both auditors in the briefing room, 10:00–10:20."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q099",
    "set": 2,
    "batch": 10,
    "sub": "cqa-auditor-succession-continuity-risk",
    "bok": "IV.A.8",
    "cognitive": "Analyze",
    "stem": "An audit program requires quarterly coverage of a critical process. Its only auditor qualified for that process will retire in six weeks; the next required audit is in ten weeks. Program rules require competent, independent auditors. The last audit was satisfactory. Two independent auditors are available for supervised development, but neither has yet demonstrated the required technical competence. The process engineer knows the work but designs and approves its controls. Which analysis best identifies the program's risk and its implications?",
    "options": [
      "The known departure threatens qualified coverage; plan handover and development now, and confirm competent, independent coverage for the due audit, including a contingency if needed.",
      "The main risk is an outdated schedule; replace the retiring auditor's name with a generally qualified auditor and retain the previous checklist to preserve technical coverage.",
      "The satisfactory last audit reduces the need for the upcoming audit; postpone successor development until after retirement and use the earlier findings for the intervening period.",
      "The main need is process familiarity; assign the process engineer to lead the audit and use management review of the report to address the independence concern."
    ],
    "answer": 0,
    "why": "The known departure creates a foreseeable dependency risk: the program may lose the competence needed to perform a required critical-process audit. The period before retirement provides an opportunity for knowledge transfer and supervised development, but participation alone does not establish qualification. The program must confirm competent, independent coverage and plan a suitable contingency if an internal successor is not ready. A satisfactory earlier audit does not remove the stated quarterly requirement, a checklist does not supply missing technical competence, and reviewing the process engineer's report does not remove responsibility for the controls being audited. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 207–208.</span>",
    "keyPoint": "Treat an anticipated loss of scarce audit competence as a program continuity risk, and prepare qualified, independent coverage before the required work is left unsupported.",
    "trap": "Treating a known personnel change as a clerical scheduling issue, or mistaking training attendance, past audit success or technical familiarity for qualified independent coverage.",
    "distractors": {
      "1": "Changing the name and retaining a checklist do not establish competence for this critical process. The risk concerns the ability to perform the audit effectively, not merely the completeness of the schedule.",
      "2": "The program still requires quarterly coverage. The earlier satisfactory result neither meets the later audit obligation nor removes the foreseeable loss of competence; waiting also sacrifices the available handover period.",
      "3": "The engineer is responsible for designing and approving the controls being audited. Technical knowledge and later management review do not provide an independent assessment of that engineer's own work."
    }
  },
  {
    "qid": "cqa:set-2:q100",
    "set": 2,
    "batch": 10,
    "sub": "cqa-configuration-approved-combination",
    "bok": "V.F",
    "cognitive": "Understand",
    "stem": "A device's configuration baseline identifies the controller hardware, firmware and operating instructions approved together for Model R. A technician says the baseline adds little because each item can be checked separately against its latest approved revision. Which explanation best describes the baseline's role?",
    "options": [
      "It preserves the original design for historical reference; once individual revisions are current and approved, those revisions automatically replace the combination recorded in the baseline.",
      "It identifies the approved combination for that device configuration; individually current hardware, firmware and instructions do not by themselves establish that the combination is approved.",
      "It links physical parts to inventory identifiers; firmware and operating instructions can be managed independently because their revision status does not affect the hardware configuration.",
      "It confirms each item's separate conformity; any combination of individually conforming items represents the same controlled configuration when their identification and revision records are complete."
    ],
    "answer": 1,
    "why": "Configuration management defines and maintains the product or system as a documented, traceable configuration. Document control is one part of that work. In this scenario, the baseline identifies the hardware, firmware and instructions approved as a combination for Model R. An item's individual revision or conformity status does not establish that it belongs in that particular combination. This does not mean newer items are necessarily incompatible or that a baseline can never change; the configuration and its changes must remain defined and controlled. The principle concerns the relationship among the items, not just whether each has a current document. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 297–299.</span>",
    "keyPoint": "A configuration baseline defines the controlled product or system combination; individual item status alone does not establish conformity to that baseline.",
    "trap": "Equating the newest or individually conforming components with an approved configuration, or reducing configuration management to document revision control.",
    "distractors": {
      "0": "A baseline is not merely an obsolete historical list automatically superseded by separate item releases. The defined combination and changes to it remain subject to configuration control.",
      "2": "The stated baseline includes firmware and instructions as well as hardware. Treating these as unrelated to the device configuration would omit the relationships the baseline is intended to define and trace.",
      "3": "Separate item conformity does not establish that every possible combination is the same approved configuration. Complete item records still need to identify the combination applicable to the device."
    }
  },
  {
    "qid": "cqa:set-2:q101",
    "set": 2,
    "batch": 11,
    "sub": "cqa-combined-purpose-scope",
    "bok": "I.B.1",
    "cognitive": "Apply",
    "stem": "A plant plans a combined quality and environmental audit. The quality program requires coverage of customer-order controls from receipt through shipment; the environmental program requires coverage of chemical receiving, use and waste handoff. Both program owners retain these approved boundaries, and qualified auditors and time are available. The draft plan covers only the production activities common to both programs. Which change best aligns the combined audit with its purposes?",
    "options": [
      "Use the common production boundary for both programs, describing receipt, shipment and waste handoff as exclusions so that the combined visit avoids duplicated work.",
      "Adopt the quality program's boundary and checklist for the combined visit, treating its coverage of plant operations as sufficient to fulfill the environmental program's purpose.",
      "Share suitable work where the objectives overlap, retain each program's additional required activities and criteria, and record the corresponding coverage in the combined audit plan.",
      "Separate the visits because different required boundaries prevent a combined audit, even when the team can cover each program's activities and apply its respective criteria."
    ],
    "answer": 2,
    "why": "Combining audits can coordinate overlapping work, but the resulting objectives, scope and criteria must remain compatible with both audit programs. The production-only draft omits required activities from each program. The stated resources allow the plan to retain those activities while sharing work where that is appropriate. Recording an exclusion does not authorize removal of a boundary that the program owner has retained, and one program's checklist does not automatically satisfy the other program's purpose. Conversely, the two programs do not need identical boundaries to be audited together when their respective requirements can be covered coherently. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 18.</span>",
    "keyPoint": "A combined audit must preserve the objectives and required coverage of each participating audit program while coordinating suitable common work.",
    "trap": "Treating the overlap between two programs as the complete scope, or assuming that combining them requires identical boundaries.",
    "distractors": {
      "0": "The program owners have retained the receipt, shipment and waste-handoff requirements. Listing those activities as exclusions would describe the missing coverage without making the plan compatible with the approved purposes.",
      "1": "The quality boundary and checklist do not necessarily cover chemical handling and waste handoff against the environmental program's criteria. Substituting one program's framework leaves the other purpose unresolved.",
      "3": "Different boundaries do not by themselves make a combined audit unsuitable. The scenario provides qualified resources and time to retain both programs' required activities and apply their respective criteria."
    }
  },
  {
    "qid": "cqa:set-2:q102",
    "set": 2,
    "batch": 11,
    "sub": "cqa-confidential-disclosure-exposure",
    "bok": "I.E.2",
    "cognitive": "Analyze",
    "stem": "An audit agreement restricts confidential supplier findings to the commissioning client and named recipients unless the client and supplier authorize wider disclosure. Without that authorization, an auditor forwards an accurate negative finding to a prospective buyer outside the recipient list. The buyer ends negotiations, and the supplier alleges a lost contract. No compulsory disclosure requirement applies. Which assessment of potential exposure is most appropriate?",
    "options": [
      "Accuracy does not authorize the disclosure; the auditor or firm could face confidentiality-related claims, while liability and damages depend on the agreement, facts and applicable law.",
      "Accuracy removes the auditor's exposure because the buyer received true information; a claim against the audit firm would require proof that the finding itself was false.",
      "The buyer's independent purchasing decision removes the disclosure from consideration; any financial responsibility rests with the supplier whose negative finding influenced that decision.",
      "The unauthorized disclosure establishes liability for the supplier's full alleged contract loss; the remaining task is to calculate the contract value and allocate payment."
    ],
    "answer": 0,
    "why": "The relevant issue is unauthorized disclosure of information covered by an explicit confidentiality agreement. Accuracy of the finding does not provide permission to send it to an unapproved recipient. The recipient's use of that information in a purchasing decision can create potential legal and financial exposure for the auditor or auditing firm. However, the scenario does not establish that a claim will succeed or that the full alleged contract value is recoverable. Responsibility, causation and damages require assessment of the actual agreement, facts and applicable law. The supplier's original finding and the buyer's decision do not automatically eliminate the separate issue created by the disclosure. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 44.</span>",
    "keyPoint": "An accurate audit finding can still create potential legal and financial exposure when confidential information is disclosed without the required authorization.",
    "trap": "Treating truth as permission to disclose, or treating an unauthorized disclosure as automatic proof of a particular liability or damages award.",
    "distractors": {
      "1": "This substitutes a false-statement question for the stated confidentiality obligation. An accurate finding does not remove the need for the authorization required by the agreement.",
      "2": "The buyer's decision is a possible consequence of the disclosure and must be examined with the other facts. It does not automatically exclude the auditor or firm from potential exposure.",
      "3": "The facts identify potential exposure, not a decided legal claim or recoverable amount. Establishing responsibility, causation and damages requires further assessment under the applicable circumstances."
    }
  },
  {
    "qid": "cqa:set-2:q103",
    "set": 2,
    "batch": 11,
    "sub": "cqa-remote-capa-verification",
    "bok": "II.D.3",
    "cognitive": "Evaluate",
    "stem": "A laboratory corrected a software fault that generated duplicate report IDs during simultaneous report creation. Agreed verification criteria require confirmed installation and unique, correctly linked IDs during actual concurrent work on all three shifts. At follow-up, the auditor has authorized remote access to deployment records, the complete six-week post-change job index and original audit trails. The agreed sample covers concurrent jobs on each shift, and the records can be authenticated remotely. No criterion requires physical inspection. Which follow-up approach best meets the verification need?",
    "options": [
      "Require a return visit before making any effectiveness assessment, because remote examination of authenticated operating records cannot establish that a software correction worked.",
      "Review the deployment record and staff briefing acknowledgments remotely, accepting completion of those implementation steps as sufficient evidence that duplicate report IDs were prevented.",
      "Obtain the laboratory's monthly totals for jobs and report IDs, accepting equal totals and a manager's assurance in place of tracing the selected concurrent jobs.",
      "Conduct the remote follow-up using auditor-selected concurrent jobs from each shift, tracing original records against the installation, uniqueness and job-linkage criteria."
    ],
    "answer": 3,
    "why": "The verification method should supply reliable evidence of both implementation and effectiveness against the agreed criteria. Here, authenticated deployment records and source audit trails can be examined remotely, and the sampling plan covers actual concurrent work on every shift where the control must operate. The auditor can therefore perform the planned remote verification and base the outcome on those results. Installation records and briefing acknowledgments alone do not demonstrate the required operational result, while matching aggregate totals can conceal duplicates or incorrect job links. A return visit is not universally required when the necessary evidence can be verified remotely. Equally, remote access alone does not establish successful corrective action; the criteria still have to be met in the evidence examined. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 139.</span>",
    "keyPoint": "Select a follow-up method that can verify implementation and effectiveness against the actual criteria; adequate authenticated evidence may support remote verification.",
    "trap": "Equating physical presence with valid verification, or accepting implementation paperwork and aggregate totals without examining relevant post-change performance.",
    "distractors": {
      "0": "The stem supplies authenticated original records and a representative operating-condition sample, with no physical-inspection requirement. It does not establish a need to make an on-site return a condition of all valid verification.",
      "1": "Deployment and communication records support implementation steps. They do not, without the relevant operating evidence, show that concurrent report creation produces unique IDs correctly linked to jobs.",
      "2": "Equal monthly totals do not show which IDs belong to which jobs or whether concurrent creation produced duplicates. The original job-level audit trails are available to test the stated criteria directly."
    }
  },
  {
    "qid": "cqa:set-2:q104",
    "set": 2,
    "batch": 11,
    "sub": "cqa-proprietary-interface-evidence",
    "bok": "II.B.4",
    "cognitive": "Evaluate",
    "stem": "Conversion-service case. A supplier converts customer drawings into viewing packages. This second-party audit covers July job-identity and approval controls at the input-output interface under agreement CV-4. Validation of the conversion algorithm and its proprietary source code are outside the agreed scope. The code is unavailable, but the authorized evidence sources in the exhibit are accessible. Which evidence approach best evaluates conformity to CV-4?",
    "options": [
      "Reconcile monthly receipt and release counts, confirm that an approval procedure exists, and use management's assurance that no source identities changed during conversion.",
      "For selected jobs, cross-check source and package identities, reviewer authorization and approval/release times, using staff interviews to clarify the record links and workflow.",
      "Suspend the assessment until source code is disclosed, because validating the internal conversion algorithm is necessary for any conclusion about the stated interface controls.",
      "Read CV-4 and the workflow description, then accept signed release pages as proof that the job identities and the reviewers' authorization were correct."
    ],
    "answer": 1,
    "why": "The agreed criteria concern traceable job and source identity plus authorized approval before release. The available source files, released packages, original records, authorization history and interviews allow the auditor to test those relationships directly for selected jobs. The proprietary algorithm is outside this audit's agreed scope, so its unavailability does not by itself prevent assessment of these interface controls. That conclusion depends on the stated objectives and available evidence; proprietary status would not excuse a missing source essential to another audit objective. Aggregate counts, management assurance or signatures considered alone do not establish the required identity links, reviewer authority and timing. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 100.</span>",
    "keyPoint": "Evaluate whether authorized evidence can test the actual input, output and approval criteria before treating a proprietary-access limit as an obstacle to the audit objective.",
    "trap": "Demanding internal design access for a narrower interface-control objective, or replacing traceable evidence with totals and assurances.",
    "distractors": {
      "0": "Matching counts and management assurance do not establish the job/revision identity links or show authorized approval before each sampled release. Relevant original records are available for those checks.",
      "2": "The approved scope expressly excludes algorithm validation. The available interface evidence can address the stated identity and approval criteria without treating source-code review as an additional requirement.",
      "3": "A signed release page does not by itself verify its link to the correct source or the signer's authority at the relevant time. The evidence approach must test the relationships required by CV-4."
    },
    "caseId": "cqa-set2-conversion-interface-01",
    "chart": {
      "type": "data-table",
      "title": "Conversion-service case: agreed criteria and authorized evidence",
      "columns": [
        "Document or source",
        "Requirement or available evidence"
      ],
      "rows": [
        [
          "CV-4, sections 2 and 5",
          "Each released package must link to the customer's job, source-file ID and revision. Approval by an authorized Technical Reviewer permits release and must be recorded before release."
        ],
        [
          "Input and output records",
          "Original customer receipts, source files, released packages and linked register entries are retrievable for auditor-selected July jobs."
        ],
        [
          "Approval controls",
          "Reviewer identity, approval/release timestamps, change history and the role-authorization register effective on those dates are available."
        ],
        [
          "Audit arrangements",
          "The approved sample covers 20 jobs from July. Intake and Technical Review staff can be interviewed; original records can be cross-checked through authorized read-only access."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q105",
    "set": 2,
    "batch": 11,
    "sub": "cqa-interface-conclusion-boundary",
    "bok": "II.C.2",
    "cognitive": "Evaluate",
    "stem": "Conversion-service case. A supplier converts customer drawings into viewing packages. This second-party audit covers July job-identity and approval controls at the input-output interface under agreement CV-4. Validation of the conversion algorithm and its proprietary source code are outside the agreed scope. The code is unavailable, but the authorized evidence sources in the exhibit are accessible. The auditor completes the 20-job sample, cross-checks source/package identities and original approval/release records, confirms reviewer authorization and corroborates the workflow with staff. All 20 meet CV-4's stated criteria. Which report conclusion is best?",
    "options": [
      "The July conversion process was validated end to end; matching identity and approval records demonstrate that the proprietary conversion algorithm produced correct output.",
      "The auditor could not assess conformity to CV-4 because the source code was unavailable; the 20 matched jobs offer only preliminary information about those controls.",
      "The 20 sampled jobs from July met the agreed identity and approval criteria; the conclusion supports the examined interface controls and does not validate the conversion algorithm.",
      "All July jobs met the identity and approval requirements; completion of the agreed sample with no exceptions establishes conformity for the entire month's transactions."
    ],
    "answer": 2,
    "why": "An effective conclusion answers the audit's agreed purpose and remains within the evidence obtained. The completed cross-checks establish that the 20 sampled jobs met the identity and approval criteria. The report can communicate that positive result and its support for the examined interface controls, while retaining the sample and scope boundaries. It cannot convert the result into validation of the internal algorithm or certainty about every July transaction. Conversely, lack of access to source code outside the agreed scope does not erase the verified interface evidence or make the stated objective unattainable. The report should make these boundaries clear rather than implying a broader technical validation or an unresolved in-scope evidence gap. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 111, 120–121.</span>",
    "keyPoint": "Report the supported result against the agreed criteria, identifying the sample and scope without extending assurance to an unexamined design or every transaction.",
    "trap": "Turning a satisfactory interface-control sample into validation of the entire conversion system, or dismissing valid evidence because an out-of-scope design was not examined.",
    "distractors": {
      "0": "The checked evidence concerns identity and approval controls. It does not validate the proprietary conversion algorithm or establish the correctness of all converted content.",
      "1": "The question states that the required interface checks were completed successfully. Source-code validation is outside the agreed scope, so that access limit does not prevent the supported CV-4 conclusion.",
      "3": "The agreed sample supports a bounded audit conclusion, not certainty that every July transaction met the requirements. The report should retain the fact that 20 jobs were examined."
    },
    "caseId": "cqa-set2-conversion-interface-01",
    "chart": {
      "type": "data-table",
      "title": "Conversion-service case: agreed criteria and authorized evidence",
      "columns": [
        "Document or source",
        "Requirement or available evidence"
      ],
      "rows": [
        [
          "CV-4, sections 2 and 5",
          "Each released package must link to the customer's job, source-file ID and revision. Approval by an authorized Technical Reviewer permits release and must be recorded before release."
        ],
        [
          "Input and output records",
          "Original customer receipts, source files, released packages and linked register entries are retrievable for auditor-selected July jobs."
        ],
        [
          "Approval controls",
          "Reviewer identity, approval/release timestamps, change history and the role-authorization register effective on those dates are available."
        ],
        [
          "Audit arrangements",
          "The approved sample covers 20 jobs from July. Intake and Technical Review staff can be interviewed; original records can be cross-checked through authorized read-only access."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q106",
    "set": 2,
    "batch": 11,
    "sub": "cqa-proportionate-evidence-collection",
    "bok": "III.C",
    "cognitive": "Analyze",
    "stem": "An auditor requests that an active dispatch log be removed from the operating desk for an hour to review selected completed entries. The clerk explains that dispatchers need the log for current work and offers an authorized read-only scan of the selected pages. The auditor verifies its authenticity and completeness and confirms that it supplies the same evidence needed. The plan permits either format. Which response best addresses the clerk's concern?",
    "options": [
      "Agree to the scan review, preserve the planned sample and evidence trail, and acknowledge the operational concern without treating it as resistance to the audit.",
      "Keep the original request because custody of the source record provides the strongest evidence, and ask management to tolerate the interruption until review is complete.",
      "Accept a verbal summary from the clerk instead of inspecting the selected entries, so normal dispatch work can continue and the disagreement ends promptly.",
      "Record the clerk's objection as an access restriction and escalate it to the client, then defer the record review until the client directs a response."
    ],
    "answer": 0,
    "why": "The clerk has identified a legitimate effect on normal work and offered an arrangement whose adequacy the auditor has verified. Using that permitted arrangement preserves the selected evidence and audit coverage while avoiding an unnecessary disruption. The issue is the auditor's collection method, not a demonstrated refusal of access. Flexibility does not require accepting weaker evidence or abandoning the review, and authority to audit does not make every special demand reasonable. The source supports listening to operational concerns and avoiding unnecessary demands that create conflict. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 154.</span>",
    "keyPoint": "Resolve a legitimate operational concern by using an equally adequate permitted evidence arrangement while preserving the audit's objective and coverage.",
    "trap": "Mistaking a reasonable objection to the auditor's method for obstruction, or avoiding conflict by giving up needed evidence.",
    "distractors": {
      "1": "The auditor has already verified that the permitted scan provides the same needed evidence. Insisting on custody of the active log adds disruption without an identified evidentiary benefit in this scenario.",
      "2": "A verbal summary is not the verified equivalent offered in the stem and would replace inspection of the selected entries. The conflict can be resolved without reducing the evidence collected.",
      "3": "The clerk has offered access through an allowed, verified equivalent arrangement. Calling that an access restriction and escalating it would mischaracterize the concern instead of resolving the unnecessary disruption."
    }
  },
  {
    "qid": "cqa:set-2:q107",
    "set": 2,
    "batch": 11,
    "sub": "cqa-routing-loop-presentation",
    "bok": "III.D",
    "cognitive": "Apply",
    "stem": "Managers reviewing an audit want to see who handles an application at each decision and where incomplete applications return. The verified process moves from Intake to Technical Review, with incomplete submissions returned through Customer Support to Intake before re-review; accepted applications go to Scheduling. The audit also has counts and timing data, but this presentation must make the routing and return path clear. Which visual best meets the managers' need?",
    "options": [
      "Use a monthly line graph of average processing time, with annotations naming the departments involved so managers can compare timing before and after returns.",
      "Use a Pareto chart of return reasons, color-coded by department, so managers can rank the most frequent problems and identify where improvement effort belongs.",
      "Use an organization chart linking the four departments and their managers, with captions describing each department's role and the authority for resolving escalated applications.",
      "Use a flowchart labeled by responsible department, with decision diamonds, directional arrows and the return loop showing how an incomplete application re-enters the process."
    ],
    "answer": 3,
    "why": "The audience needs to understand sequence, decision routing, responsibility and a return loop. A flowchart can show all of those relationships directly: department labels identify who performs each step, decisions show alternative paths, and arrows show movement and return. Counts and timing may support other management questions, but they do not replace the route explanation requested here. An organization chart can show reporting relationships without showing how an application moves. The visual should be selected for the question the audience needs answered, using the verified process information. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 165, 226–227.</span>",
    "keyPoint": "Match the presentation to the audience's question: a flowchart can communicate process sequence, decision branches, responsible roles and return loops.",
    "trap": "Selecting a familiar quantitative chart or organization chart when the audience needs to understand the path followed by work.",
    "distractors": {
      "0": "The proposed line graph addresses changes in processing time. Naming departments in annotations does not show the decision branches, handoffs and return route the managers need to follow.",
      "1": "Ranking return reasons helps identify frequent problems, but it does not show which department receives an application after each decision or how it returns for re-review.",
      "2": "Departmental reporting relationships and escalation authority do not establish the sequence of application processing. The decision paths and return loop remain missing from this presentation."
    }
  },
  {
    "qid": "cqa:set-2:q108",
    "set": 2,
    "batch": 11,
    "sub": "cqa-confidential-peer-debrief-learning",
    "bok": "IV.A.3",
    "cognitive": "Evaluate",
    "stem": "An audit program finds experienced auditors reaching different interpretations in similar cases. Everyone has completed the required standards-update course, but no common explanation for the differences has been established. The program wants continuing development that uses lessons from recent audits to improve consistency of practice. Auditee-specific materials may be discussed only with authorized audit staff. Which approach best addresses this need?",
    "options": [
      "Keep each case in a private file and send only a list of policy clauses to the team, using acknowledgements to demonstrate consistent interpretation.",
      "Hold confidential peer debriefs on selected cases, compare judgments with criteria and evidence, and record transferable lessons plus any development or clarification needs.",
      "Ask each auditor to complete the same refresher course, and use its completion certificate as sufficient evidence that differences in case interpretation have been resolved.",
      "Have the most senior auditor announce the preferred conclusion for every case, then use agreement with that conclusion as the basis for judging consistency."
    ],
    "answer": 1,
    "why": "Post-audit discussion groups and debriefs allow auditors to learn from unusual situations, findings and problems and develop more consistent practices. Comparing the case evidence and applicable criteria can distinguish legitimate contextual differences from inconsistent interpretation and identify lessons or development needs. Auditee-specific discussion must remain confidential within the authorized group. Consistency is supported by a shared reasoning process, not merely acknowledgement of clauses, attendance at another course or agreement with the most senior person. The debrief supplements continuing development without assuming that every difference reflects incompetence. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 183–184.</span>",
    "keyPoint": "Use confidential, criteria-based peer debriefs to transfer audit lessons and examine consistency of practice across the team.",
    "trap": "Treating shared course completion or agreement with authority as proof of consistent evidence-based auditing.",
    "distractors": {
      "0": "A clause list and acknowledgement do not examine how the auditors interpreted actual evidence in the cases. Keeping those learning opportunities isolated leaves the identified consistency question unexplored.",
      "2": "A refresher course can be useful, but its completion alone does not show why the case judgments differed or whether those differences have been resolved in practice.",
      "3": "Seniority may provide useful experience, but agreement with a preferred conclusion does not demonstrate that the criteria and evidence support it. The cases need reasoned examination, including relevant contextual differences."
    }
  },
  {
    "qid": "cqa:set-2:q109",
    "set": 2,
    "batch": 11,
    "sub": "cqa-realized-program-net-contribution",
    "bok": "IV.A.4",
    "cognitive": "Analyze",
    "stem": "An audit program's summary must report realized net financial contribution for the completed calendar year. Savings from an audit-related action began on 1 July. Finance verifies $9,000 per month for July through December and no earlier savings. These comparable-dollar amounts already account for all implementation and ongoing action costs. The exhibit lists the complete, nonoverlapping remaining audit costs for the same year. Which statement most appropriately reports the contribution?",
    "options": [
      "Report $14,000 as the year's realized net contribution, and present any annualized benefit estimate separately with the assumptions needed for the projected period.",
      "Report $68,000 as the year's net contribution, using twelve months at the verified monthly rate and deducting the complete annual audit cost total.",
      "Report $54,000 as the year's net contribution, because implementation and ongoing action costs are already included in savings and no further deduction is needed.",
      "Report $30,000 as the year's net contribution, deducting auditor labor from realized savings while leaving auditee participation and program overhead outside this financial measure."
    ],
    "answer": 0,
    "why": "The completed reporting year contains six months of verified savings: 6 × $9,000 = $54,000. The complete remaining audit costs are $24,000 + $9,000 + $7,000 = $40,000, giving $14,000 of realized net contribution under the stated boundary. Implementation and ongoing action costs are already reflected in the savings and must not be deducted again. Twelve months at the monthly rate would be an annualized estimate, not savings already realized in this year. The annual summary should distinguish actual past contribution from expected future benefit. Other program objectives still require their own evidence. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 187, 190–191.</span>",
    "keyPoint": "Keep realized reporting-period contribution separate from annualized projections, and deduct every cost in the stated boundary exactly once.",
    "trap": "Reporting a full-year projection as realized benefit, or omitting costs because they were incurred outside the auditor's own labor budget.",
    "distractors": {
      "1": "Twelve times $9,000 is $108,000, and subtracting $40,000 produces $68,000. That calculation annualizes six months of savings and counts an additional six months that were not realized in the completed year.",
      "2": "The $54,000 is the year's verified savings after the action costs, but the separate $40,000 of remaining audit costs still belongs in the defined net-contribution measure.",
      "3": "Subtracting only $24,000 from $54,000 yields $30,000, but omits the separately stated $9,000 of auditee participation and $7,000 of management and overhead costs. The boundary explicitly includes all three."
    },
    "chart": {
      "type": "data-table",
      "title": "Complete remaining audit costs for the reporting year",
      "columns": [
        "Nonoverlapping cost category",
        "Amount"
      ],
      "rows": [
        [
          "Auditor preparation, fieldwork and follow-up",
          "$24,000"
        ],
        [
          "Auditee participation",
          "$9,000"
        ],
        [
          "Audit program management and overhead",
          "$7,000"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q110",
    "set": 2,
    "batch": 11,
    "sub": "cqa-pfmea-detection-versus-prevention",
    "bok": "V.H",
    "cognitive": "Understand",
    "stem": "A process FMEA defines a failure mode as omission of a sealing ring during assembly. A newly verified inspection detects more of these omissions after assembly and before dispatch. The assembly method and omission frequency are unchanged, as is the effect of an omitted ring that reaches the customer. Which explanation correctly describes what has improved?",
    "options": [
      "The occurrence assessment improves because fewer defective assemblies are dispatched; occurrence concerns failures reaching the customer rather than failures created during the assembly operation.",
      "The severity assessment improves because the added inspection catches more failures; reducing the chance of escape reduces the seriousness of each failure that reaches the customer.",
      "The change is a prevention control because inspection occurs before dispatch; detection controls apply only after the customer discovers and reports a defective assembly.",
      "The detection control improved because more existing failures are caught; the evidence does not show prevention of their occurrence or a change in their effects."
    ],
    "answer": 3,
    "why": "A detection control identifies a failure after it has occurred. The sealing-ring omission already exists when the new inspection finds it, so the verified improvement concerns detection. Prevention controls address the cause or likelihood of creating the failure, while severity concerns the potential effect. The stem explicitly leaves the omission frequency and the escaped failure's effect unchanged. Catching more omissions before dispatch is useful, but it does not by itself establish a lower occurrence of the assembly failure or a less serious consequence if one escapes. No numerical rating or risk-priority cutoff is needed for this distinction. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 305–306.</span>",
    "keyPoint": "Distinguish preventing a failure, detecting it after it occurs, and reducing its effects when explaining FMEA controls.",
    "trap": "Treating fewer escaped defects as proof that fewer failures were created or that the consequences of an escaped failure became less serious.",
    "distractors": {
      "0": "The defined failure mode occurs during assembly, and its frequency is explicitly unchanged. Reduced dispatch of defective units reflects improved detection and interception, not a demonstrated reduction in occurrence of that failure mode.",
      "1": "The potential effect of an omitted ring reaching the customer is stated to be unchanged. Lower escape likelihood does not make that consequence less serious.",
      "2": "A control can detect an already-created failure before dispatch. Its position before the customer does not make it prevention of the assembly omission, and detection is not limited to customer complaints."
    }
  },
  {
    "qid": "cqa:set-2:q111",
    "set": 2,
    "batch": 12,
    "sub": "cqa-delivered-product-package",
    "bok": "I.A.1",
    "cognitive": "Apply",
    "stem": "A product audit covers complete portable-tester kits ready for dispatch. The customer specification requires a functioning tester, two specified leads, printed start-up instructions and molded transit protection. The auditor has verified functional performance for the selected kits but has not examined their finished packages. Which additional examination best completes the stated product-audit coverage?",
    "options": [
      "Observe staff packing later units to the work instruction, then use that process observation and the selected testers' functional results to accept the complete kits.",
      "Examine the selected finished packages for the specified leads, instructions and transit protection, linking those results to the functional evidence for the same kits.",
      "Repeat the functional tests over a wider operating range, treating accessories, instructions and transit protection as shipping matters outside the completed product audit.",
      "Check dispatch labels and carton counts, using the correct destination and number of boxes as evidence that the kit contents and shipment protection conform."
    ],
    "answer": 1,
    "why": "A product audit can cover the complete item supplied to the customer, including accessories, user instructions, packaging and shipment protection as required by the applicable specification. The functional result addresses one part of this customer's requirements; it does not establish that the selected kits contain the specified leads, instructions and protection. Examining those finished packages completes the missing coverage and keeps the evidence linked to the selected kits. Observing later packing work or checking destinations and box counts does not establish the specified characteristics of those packages. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 2–3.</span>",
    "keyPoint": "Product-audit coverage follows the requirements for the complete delivered item, including its accessories, instructions and protection where specified.",
    "trap": "Treating satisfactory functional performance as proof that the complete customer package conforms, or excluding specified package elements as mere shipping details.",
    "distractors": {
      "0": "A later packing observation may provide process information, but it does not establish the contents and protection of the selected completed kits. Their functional results leave those requirements unexamined.",
      "2": "Additional functional testing does not address the missing package requirements. The stated product audit includes the complete kit, and the specification expressly includes accessories, instructions and protection.",
      "3": "Correct destination labels and carton counts do not demonstrate that the required leads and instructions are present or that the specified transit protection was used."
    }
  },
  {
    "qid": "cqa:set-2:q112",
    "set": 2,
    "batch": 12,
    "sub": "cqa-program-and-engagement-role-boundary",
    "bok": "I.D",
    "cognitive": "Apply",
    "stem": "A company has a separate audit program manager and engagement leads. Planning reveals inconsistent qualification requirements for contract auditors and a calendar conflict assigning one specialist to two audits. The lead of one engagement is asked to rewrite the common qualification rule and reschedule the other audit. This lead has no program-wide delegation. Which allocation of work is appropriate?",
    "options": [
      "The engagement lead changes the common qualification rule and the other audit's date, because responsibility for one audit includes control of resources affecting any related engagement.",
      "Each engagement lead sets separate qualification requirements and reserves the specialist independently, while the program manager collects the final reports and communicates their findings to management.",
      "The auditee coordinators set the auditor qualification requirements and settle the shared calendar conflict, while the program manager approves conclusions from the separate audit teams.",
      "The program manager coordinates qualification controls and cross-audit assignments and scheduling; the lead supplies the engagement's needs and plans its work within the approved arrangements."
    ],
    "answer": 3,
    "why": "Program management establishes qualification and control arrangements and maintains the schedule across audits. The engagement lead plans and directs the assigned audit and communicates its resource needs. The proposed changes affect common qualification requirements and another engagement, so they need program-level coordination rather than unilateral action by this lead. The auditee's coordination role does not transfer authority over auditor qualifications or the program calendar. Organizations may combine roles or delegate particular tasks, but the stem explicitly states separate roles and no program-wide delegation to this lead. The allocation follows the scope of responsibility and delegation stated for this assignment. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 26–27.</span>",
    "keyPoint": "Distinguish program-wide qualification, controls and scheduling from an engagement lead's responsibility to plan and direct the assigned audit.",
    "trap": "Treating authority over one engagement as authority to change common program rules or another audit's resource commitments.",
    "distractors": {
      "0": "The requested changes reach beyond this lead's assigned engagement, and no broader delegation exists. A resource need should be raised for program coordination rather than used to assume cross-audit authority.",
      "1": "Independent qualification rules and reservations leave the shared-control and calendar conflict unresolved. Program management has responsibilities for those arrangements beyond collecting finished reports.",
      "2": "Auditee coordinators can help arrange availability and access, but they do not take over the audit program's qualification controls or allocation of auditors across engagements."
    }
  },
  {
    "qid": "cqa:set-2:q113",
    "set": 2,
    "batch": 12,
    "sub": "cqa-credit-for-substantive-audit-work",
    "bok": "I.E.1",
    "cognitive": "Apply",
    "stem": "An audit-team member develops the transaction analysis and drafts two findings. The lead verifies the evidence, revises the wording and signs the final report. An authorized internal project summary permits contributors and their roles to be named. The lead proposes crediting the analysis and findings solely to themself because they approved the report. Which response best fulfills professional responsibility?",
    "options": [
      "Credit the member's analysis and drafting accurately, describe the lead's review and integration, and retain the lead's responsibility for the approved final report.",
      "Credit the lead alone for the analysis and findings, because reviewing the work and accepting final responsibility transfer professional credit to the report's signatory.",
      "Assign the member all credit and final report responsibility, because originating the analysis makes the lead's later verification, revisions and approval administrative contributions.",
      "Omit the member's contribution unless the member requests recognition, because the lead's final signature provides an adequate account of the work when no objection is raised."
    ],
    "answer": 0,
    "why": "Professional credit should accurately reflect substantive work. The member developed the analysis and drafted findings; the lead contributed verification, revision, integration and final approval. The lead's signature does not erase the member's contribution or make the underlying work solely the lead's. Accurate attribution can recognize both contributions while preserving the lead's responsibility for the approved report. Credit is not conditional on the contributor asking for it, and recognizing the member does not require transferring final report responsibility. The authorized internal summary permits this attribution without expanding disclosure of the audit information. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 26, 29.</span>",
    "keyPoint": "Give appropriate credit for substantive contributions while accurately retaining review, approval and reporting responsibilities.",
    "trap": "Confusing responsibility for signing the final report with sole authorship of the analysis and findings that support it.",
    "distractors": {
      "1": "Review and approval are real contributions, but they do not transfer credit for another person's substantive analysis and drafting. Claiming sole authorship would misrepresent how the work was produced.",
      "2": "The member's contribution deserves credit, but it does not remove the lead's substantive review work or transfer the lead's final approval responsibility to the member.",
      "3": "The obligation to give due credit does not depend on a complaint or request for recognition. The summary should accurately represent the known contributions when it is prepared."
    }
  },
  {
    "qid": "cqa:set-2:q114",
    "set": 2,
    "batch": 12,
    "sub": "cqa-preparation-emerging-trend-history",
    "bok": "II.A.3",
    "cognitive": "Analyze",
    "stem": "The previous maintenance audit found no overdue work in its sample but noted a rising proportion of jobs completed on the last permitted day. It reported an emerging trend rather than a nonconformity, and no corrective-action request was issued. The next audit covers the same maintenance controls. During preparation, the auditor has the prior report but has not examined current performance data or any response to the trend. How should this history influence preparation?",
    "options": [
      "Exclude the trend from preparation because the previous audit issued no nonconformity, and concentrate the review of historical information on formally open corrective-action requests.",
      "Prepare a nonconformity from the earlier trend because increasing last-day completion demonstrates that required maintenance intervals were missed, even without reviewing current completion records.",
      "Obtain recent completion data and relevant responses, compare them with the earlier trend, and use the current evidence to focus the planned maintenance review.",
      "Carry the earlier trend forward as the current condition, using the prior report to set the review emphasis without requesting newer data before fieldwork."
    ],
    "answer": 2,
    "why": "Prior audit information can guide preparation even when it did not establish a violation or generate a corrective-action request. The earlier pattern may have continued, worsened or reversed. Current completion data and any response to the observation help the auditor decide where to concentrate the review within the existing scope. Completing maintenance on the last permitted day does not by itself violate the stated interval, and the old report does not establish the present condition. The history should therefore prompt relevant current-data review and focused planning, without presuming a nonconformity or dismissing the issue because the earlier result was conforming. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 71.</span>",
    "keyPoint": "Use prior emerging trends to guide preparation, checking current performance and responses even when no earlier nonconformity was issued.",
    "trap": "Treating a prior conforming result as a reason to ignore an emerging trend, or treating the old trend as proof of a current violation.",
    "distractors": {
      "0": "Performance history includes relevant observations as well as formal findings. The absence of a corrective-action request does not make the reported trend irrelevant to preparation.",
      "1": "The prior sample contained no overdue work. Last-day completion does not itself prove a missed interval, and no current evidence supports converting the observation into a nonconformity.",
      "3": "The prior report identifies a question to investigate, not the current answer. More recent data and any response are needed to determine whether that pattern persists and how it should influence preparation."
    }
  },
  {
    "qid": "cqa:set-2:q115",
    "set": 2,
    "batch": 12,
    "sub": "cqa-process-tracing-criteria-coverage",
    "bok": "II.A.6",
    "cognitive": "Apply",
    "stem": "An audit uses process tracing to assess a testing service against a customer quality agreement included in the agreed criteria. Auditors follow selected jobs from receipt through report release and verify transaction-level controls. The agreement also requires quarterly reviews of approver authorizations, but the sampled paths do not exercise this periodic control and its records have not been examined. Which strategy best completes the coverage?",
    "options": [
      "Increase the number of jobs traced along the same path, using the larger transaction sample to compensate for the unexamined quarterly authorization review.",
      "Retain tracing, map the agreement's requirements to the activities reviewed, and add targeted evidence checks for the quarterly reviews and other uncovered applicable controls.",
      "Switch to a clause checklist and confirm that approved procedures address each requirement, treating documented coverage as sufficient evidence that the controls operated during the period.",
      "Record a nonconformity for the quarterly authorization reviews, because their absence from the sampled transaction paths demonstrates that the required periodic control was not performed."
    ],
    "answer": 1,
    "why": "Process tracing can provide useful evidence about sequential activities and their interactions, but it must also be linked to the applicable external requirements. Here, the customer agreement is expressly within the agreed criteria, and a periodic authorization-review requirement remains unexamined. Mapping the criteria to the work already reviewed identifies that gap and supports targeted examination of the relevant review records and other needed evidence. The useful transaction traces can remain part of the audit. More transactions on the same path do not automatically cover a different periodic control, and approved procedures alone do not establish its operation. An unexamined requirement is an evidence-coverage gap, not proof that the auditee failed to perform it. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 82.</span>",
    "keyPoint": "Link process-tracing evidence to all applicable audit criteria and add targeted checks where the sampled paths do not exercise a required control.",
    "trap": "Assuming that a complete transaction path covers every applicable requirement, or converting an unexamined periodic control into a presumed nonconformity.",
    "distractors": {
      "0": "Additional jobs on the same path may strengthen transaction-level evidence, but they do not by themselves examine whether the separate quarterly authorization review occurred and met its requirements.",
      "2": "A criteria checklist can help organize coverage, but the presence of approved procedures does not demonstrate implementation. The strategy should retain useful tracing and obtain evidence for the unexamined controls.",
      "3": "The stem says the periodic review has not been examined, not that it was missed. Evidence about the requirement's implementation is needed before a supported conformity or nonconformity conclusion can be made."
    }
  },
  {
    "qid": "cqa:set-2:q116",
    "set": 2,
    "batch": 12,
    "sub": "cqa-capa-mechanism-extent",
    "bok": "II.D.1",
    "cognitive": "Evaluate",
    "stem": "Cell A printed a previous job's label after restart. Investigation confirmed that its controller's 'resume last job' setting bypassed job selection. Affected output was contained, and the assigned corrective action was implemented and shown effective in Cell A. Cells B–D perform similar work but use different controller versions and settings; no comparable incident has been recorded there. The plan assigns an owner and date for reviewing these cells. Which proposed extent review is most appropriate?",
    "options": [
      "Accept Cell A's verified action as sufficient, and monitor complaints from the other cells because no comparable failure has been recorded in them.",
      "Require every cell to install Cell A's exact change, then verify completion dates; their similar work makes a separate configuration review unnecessary.",
      "Determine which configurations can exhibit the confirmed mechanism, assess their exposure and controls, and implement and verify the actions needed at those cells.",
      "Compare only the cells' written instructions, and consider matching wording sufficient evidence that the confirmed mechanism is controlled regardless of controller configuration differences."
    ],
    "answer": 2,
    "why": "A corrective-action response should consider whether the same or similar condition can exist elsewhere. The local cause, action and effectiveness are established, but the differing configurations leave the extent question unresolved. The review should identify where the confirmed restart mechanism can occur, assess the relevant controls and determine the necessary action and verification for those configurations. An absence of recorded incidents does not rule out the condition, while similar work does not establish that an identical technical change is appropriate everywhere. Matching instructions alone do not demonstrate how the actual controllers behave. The auditee retains responsibility for developing and implementing the necessary actions. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 134, 136.</span>",
    "keyPoint": "Extend corrective-action review by assessing where the confirmed failure mechanism can exist, then apply and verify actions appropriate to the affected conditions.",
    "trap": "Treating an absence of recorded failures as absence of exposure, or prescribing the same change everywhere without checking applicability.",
    "distractors": {
      "0": "The success in Cell A resolves its demonstrated condition, but complaint history alone does not establish whether the other configurations can exhibit the same mechanism. The planned extent review still needs evidence.",
      "1": "Similar output does not make controller versions, settings or existing controls identical. A common change may be appropriate in some cells, but its applicability and effectiveness must be assessed rather than assumed.",
      "3": "Procedure similarity does not establish the relevant controller behavior or configuration. The review must address whether the confirmed mechanism is possible and controlled, not just whether document wording matches."
    }
  },
  {
    "qid": "cqa:set-2:q117",
    "set": 2,
    "batch": 12,
    "sub": "cqa-neutral-closed-followup",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "A receiving clerk has answered open questions about how deliveries move through inspection. For selected pallet P84, the auditor still needs to establish whether it was moved to Hold Area H. The account so far describes normal practice but does not answer that specific point. The pallet's movement record is available. Which follow-up best clarifies the fact without signaling an expected answer?",
    "options": [
      "Ask, 'Was pallet P84 moved to Hold Area H?' Then examine its movement record with the clerk to corroborate what happened to that pallet.",
      "Ask, 'You moved pallet P84 to Hold Area H as you should, didn't you?' Then note agreement as confirmation that the proper route was used.",
      "Ask, 'Was pallet P84 moved to Hold Area H?' Then record the answer as verified evidence because a specific yes-or-no response resolves the outstanding point.",
      "Ask the clerk to repeat the normal receiving process, then infer P84's destination from that general account without examining the available pallet movement record."
    ],
    "answer": 0,
    "why": "A neutral closed question can clarify a discrete fact after an open account has established the process context. The neutral wording permits either answer without indicating which the auditor expects. Checking the available record linked to P84 then corroborates the account of that historical movement. Closed questions are not inherently leading; the expectation built into the wording matters. Conversely, a specific yes-or-no answer is information to evaluate, not automatic verification. Repeating the normal process cannot establish what happened to the selected pallet. The handbook combines open exploration with focused follow-up and corroboration through relevant evidence. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 167, 169.</span>",
    "keyPoint": "Use a neutral closed question to confirm a discrete point when appropriate, then corroborate the account with evidence relevant to that event.",
    "trap": "Assuming every closed question is leading, or assuming a clear yes-or-no answer is already verified evidence of a particular event.",
    "distractors": {
      "1": "The wording supplies the expected answer and says what the clerk should have done. Agreement with that suggestion does not independently establish the pallet's actual movement.",
      "2": "The question itself is neutral, but the proposed treatment of the answer skips corroboration even though the relevant record is available. Specificity of an answer does not automatically verify it.",
      "3": "An account of normal practice can help explain the process, but it does not identify the actual destination of P84. The outstanding event-specific fact should be asked about and checked."
    }
  },
  {
    "qid": "cqa:set-2:q118",
    "set": 2,
    "batch": 12,
    "sub": "cqa-emergency-evidence-handover",
    "bok": "III.F",
    "cognitive": "Apply",
    "stem": "During a supplier audit, a team member must leave immediately for a personal emergency. Shared, controlled working papers distinguish verified observations with traceable records from one item marked 'awaiting confirmation.' A qualified team member is available, has authorized access to the underlying records and can complete the remaining work within the plan. No conclusion has been made on the open item. What should the lead auditor do?",
    "options": [
      "Treat the open item as a finding based on the departing auditor's experience, and assign the available member only to prepare its final wording.",
      "Close the assignment using the verified checks, omit the unfinished item from the audit record, and ask the team to finish its other responsibilities.",
      "Require the receiving auditor to repeat every completed check before reviewing the open item, because evidence collected by another member cannot support their conclusions.",
      "Support the departure, preserve the evidence and have the qualified recipient review its status, accept the unfinished assignment and complete verification before concluding on it."
    ],
    "answer": 3,
    "why": "The lead should support the team member's emergency while maintaining responsibility for the audit's work and evidence. Controlled, traceable records allow the recipient to review completed work and understand what remains unresolved. Explicit acceptance of the unfinished assignment makes responsibility clear; the recipient must complete the needed verification before the team reaches a conclusion on that item. The departure does not invalidate adequately supported observations, nor does experience turn a pending lead into a confirmed finding. No blanket repetition of every completed check is required, but any gap found during the recipient's review still needs attention. Quietly dropping the open work would leave the assignment incomplete. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 172–173.</span>",
    "keyPoint": "Preserve the distinction between completed evidence and unresolved work during a team handover, and make responsibility for the remaining verification explicit.",
    "trap": "Losing unfinished work during a reassignment, promoting a pending lead into a finding, or discarding valid evidence solely because its collector has left.",
    "distractors": {
      "0": "The working papers explicitly mark the item as awaiting confirmation. The departing auditor's experience does not supply the missing verification, and drafting a finding would prematurely treat the lead as established.",
      "1": "Completed checks do not resolve the separately identified open item. Removing it from the record would conceal unfinished work instead of assigning and completing it within the available plan.",
      "2": "The recipient should review the traceable evidence and address any gaps, but another team member's supported observations are not automatically unusable. Repeating every check is an unsupported blanket requirement."
    }
  },
  {
    "qid": "cqa:set-2:q119",
    "set": 2,
    "batch": 12,
    "sub": "cqa-retesting-cost-origin",
    "bok": "IV.B.3",
    "cognitive": "Analyze",
    "stem": "A manufacturer records both activities in the exhibit in one laboratory account. The same technicians and instruments perform the tests, and all valves remain at the plant before customer delivery. The two entries contain only testing labor and do not overlap; repair labor is recorded separately. The manager proposes classifying the entire account as appraisal because all the work checks conformity. Which classification best reflects why these costs arose?",
    "options": [
      "Appraisal $10,500; internal failure $0: both entries pay the same laboratory to verify conformity using the same pressure-testing method.",
      "Appraisal $8,400; internal failure $2,100: routine verification is separate from additional retesting caused by a nonconformity discovered before delivery.",
      "Prevention $8,400; appraisal $2,100: initial testing prevents customer defects, while the tests after repair appraise whether the repaired valves conform.",
      "Appraisal $8,400; external failure $2,100: a failed test has already established a quality failure, regardless of whether delivery has occurred."
    ],
    "answer": 1,
    "why": "Routine first-pass inspection or testing is an appraisal activity. The additional tests were required because valves had failed and needed repair; those retesting costs are internal failure costs because the nonconformity was found and addressed before customer delivery. The same laboratory, staff and equipment can therefore incur different cost-of-quality categories depending on why the work was required. The listed testing labor totals $8,400 + $2,100 = $10,500, but the correct split is $8,400 appraisal and $2,100 internal failure. No separate repair cost is supplied or added. Testing to detect nonconformity is not prevention merely because it occurs before shipment. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 218.</span>",
    "keyPoint": "Classify quality costs by the reason the activity was needed: routine conformity testing is appraisal, while pre-delivery retesting caused by failure is internal failure.",
    "trap": "Classifying every laboratory test as appraisal, or calling detection prevention simply because it occurs before the customer receives the product.",
    "distractors": {
      "0": "A shared department and method do not determine the category. The extra $2,100 arose from an existing failure and repair, so combining it with routine appraisal hides an internal failure cost.",
      "2": "Routine first-pass testing evaluates conformity rather than preventing the cause of failure. The additional testing after repair is failure-caused retesting, not routine appraisal in this scenario.",
      "3": "The stem explicitly places the failure and retesting before customer delivery. That makes the failure-related $2,100 internal, not external; the mere occurrence of a failure does not make it external."
    },
    "chart": {
      "type": "data-table",
      "title": "Testing labor for the same reporting period",
      "columns": [
        "Activity",
        "Recorded labor cost"
      ],
      "rows": [
        [
          "Scheduled first-pass pressure tests on completed valves",
          "$8,400"
        ],
        [
          "Additional pressure tests required after valves failed and were repaired",
          "$2,100"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q120",
    "set": 2,
    "batch": 12,
    "sub": "cqa-dmaic-measure-comparable-baseline",
    "bok": "V.B.1",
    "cognitive": "Apply",
    "stem": "A DMAIC project has an approved charter to reduce elapsed time from receipt of a complete quotation request to sending the approved quotation. During Measure, one branch starts its timer at receipt of the complete request; another starts when an estimator begins work. Both stop when the approved quotation is sent and label the result 'turnaround time.' The team proposes combining these figures as its baseline before investigating branch differences. What should it do next?",
    "options": [
      "Combine the recorded times as the initial baseline, then use branch as a factor in Analyze to explain the differences in customer turnaround.",
      "Collect more observations under each branch's existing method, then compare the larger samples to decide whether their turnaround differences warrant causal analysis.",
      "Apply the charter's start and stop definitions, verify consistent recording on trial cases, and establish the baseline from data that meet those definitions.",
      "Use estimator-start time at both branches so the measure focuses on work under local control, then establish a common baseline for the approved project."
    ],
    "answer": 2,
    "why": "Measure includes establishing the measurement system and gathering data for baseline performance. The branches currently measure different intervals: starting at estimator work excludes the preceding wait after receipt of a complete request. A common label does not make those intervals comparable for the charter's stated purpose. The team should apply the intended definitions and verify consistent recording before establishing that baseline. Existing records may still be used if they allow the intended interval to be reconstructed; the question does not require discarding usable data. A larger sample or a branch label does not repair the definition mismatch, and consistently measuring only the later interval would change the project's measure. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 250–251.</span>",
    "keyPoint": "During DMAIC Measure, establish a measurement method consistent with the project's purpose before treating the collected results as a comparable baseline.",
    "trap": "Mistaking a common column label, a larger sample or consistent use of the wrong interval for a valid project baseline.",
    "distractors": {
      "0": "A branch factor does not make the two recorded intervals equivalent. An apparent difference may reflect the measurement definition, so pooling them does not establish the requested turnaround baseline.",
      "1": "More observations collected under the same incompatible definitions retain the mismatch. The measurement method must first support the interval specified in the charter.",
      "3": "Using one rule consistently would remove the between-branch definition difference, but estimator-start time still omits part of the elapsed interval required by the approved charter. It would establish a different measure."
    }
  },
  {
    "qid": "cqa:set-2:q121",
    "set": 2,
    "batch": 13,
    "sub": "cqa-conduct-complaint-evidence-separation",
    "bok": "I.E.3",
    "cognitive": "Apply",
    "stem": "After receiving a draft finding, an auditee alleges that the auditor intimidated an employee. The finding cites interview statements and traceable inspection records. The allegation has not been investigated, and the effect of any pressure on the evidence is unknown. The program's approved procedure requires confidential review by an uninvolved manager and protects both complainant and auditor. Which response best protects audit credibility?",
    "options": [
      "Investigate the complaint under the procedure, but exclude the finding permanently because disputed auditor behavior prevents any reliable assessment of its supporting evidence.",
      "Preserve the finding without further review and close the complaint, because traceable inspection records demonstrate that the auditor's interview conduct was professional.",
      "Investigate the conduct complaint first, then decide the finding solely from whether that complaint is upheld, avoiding a separate review of its supporting evidence.",
      "Initiate the protected conduct review and assess the finding's criterion and evidence independently, retaining or correcting the conclusion according to what that assessment supports."
    ],
    "answer": 3,
    "why": "The complaint should receive fair, confidential review under the authorized procedure, protecting both the complainant and the auditor without assuming either misconduct or a false allegation. The proposed finding also needs assessment against its criterion and supporting evidence. Alleged pressure could affect the reliability of an interview statement, while other evidence may be independently verifiable; neither possibility determines the result in advance. The conclusion may be retained, revised or removed according to that assessment. A conduct-review outcome alone does not establish whether the audited activity met its requirement, and a traceable record alone does not establish that the interview was conducted professionally. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 46–47.</span>",
    "keyPoint": "Protect both parties through the authorized complaint process and determine the audit conclusion from a separate, impartial assessment of the applicable criterion and evidence.",
    "trap": "Treating a conduct allegation or its resolution as an automatic verdict on the finding, instead of examining how the available evidence supports the conclusion.",
    "distractors": {
      "0": "A complaint does not automatically make all supporting evidence unusable. Permanent exclusion before assessing the records and statements could suppress a supported finding and does not follow from fair complaint handling.",
      "1": "Traceability can help establish the reliability of a record, but it does not demonstrate how an interview was conducted or justify dismissing the complaint. The finding's evidential basis also remains subject to review.",
      "2": "Whether the auditor behaved improperly and whether the audited activity met its requirement are different questions. The conduct outcome may inform an assessment of evidence reliability, but it cannot replace that assessment."
    }
  },
  {
    "qid": "cqa:set-2:q122",
    "set": 2,
    "batch": 13,
    "sub": "cqa-conditional-benefit-versus-nominal-courtesy",
    "bok": "I.E.1",
    "cognitive": "Apply",
    "stem": "During a supplier audit, the auditee offers the lead a $15 meal voucher, saying it is available if a supported nonconformity is omitted from the report. The auditing organization's policy allows nominal business courtesies up to $25. Its audit protocol requires pausing the affected activity and notifying the client and program manager when improper influence is identified. Which response best applies the auditor's professional responsibilities?",
    "options": [
      "Refuse the conditional offer, retain the factual record and follow the pause and notification protocol; assess and report the finding on its evidence.",
      "Accept and disclose the voucher within the nominal-courtesy allowance, but decline to change the finding because no reporting concession will actually be made.",
      "Decline the voucher and continue without notification, treating rejection as sufficient to resolve the attempted influence because the report can still remain unchanged.",
      "Redirect the voucher to a team welfare fund, document its value and continue the audit, since the auditor would receive no personal benefit."
    ],
    "answer": 0,
    "why": "The offer explicitly links a benefit to suppressing a supported finding. That condition makes it an attempt to influence reporting, rather than an ordinary courtesy made acceptable by its low value. Refusing the offer and following the stated pause and notification protocol protects the integrity of the audit and brings the incident to the authorized decision makers. The factual record should be retained and the finding assessed and reported on its evidence. Disclosure, sharing or redirecting the benefit does not remove the offered exchange, and privately declining it does not satisfy the scenario's reporting protocol. The monetary allowance and the response route are local facts, not universal limits or rules for every audit. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 38.</span>",
    "keyPoint": "Evaluate the condition attached to an offered benefit, not just its value; refuse improper influence and follow the authorized response process.",
    "trap": "Treating a low-value allowance, disclosure or lack of personal benefit as permission to accept a benefit linked to changing audit results.",
    "distractors": {
      "1": "The voucher was offered in exchange for omitting a supported finding. Its nominal value and disclosure do not make that condition an acceptable business courtesy, even if the auditor intends to keep the finding.",
      "2": "Declining the benefit is necessary, but the stated protocol also requires pausing the affected activity and notifying the client and program manager. Keeping the attempted influence private leaves that required response incomplete.",
      "3": "Changing the beneficiary does not remove the condition attached to the offer or satisfy the required incident response. The concern is attempted influence over the audit result, not solely the auditor's personal gain."
    }
  },
  {
    "qid": "cqa:set-2:q123",
    "set": 2,
    "batch": 13,
    "sub": "cqa-contemporaneous-note-clarification",
    "bok": "II.B.5",
    "cognitive": "Apply",
    "stem": "At the end of an interview, an auditor notices this note: 'R684 — 14:20 / 14:35; approval?' The auditor did not record which event labels belong to the times and cannot reconstruct that detail reliably from memory. The exact read-only version of R684 and its record custodian are still available. The criterion requires approval before dispatch. What should the auditor do before using the note to support a finding?",
    "options": [
      "Assign the earlier time to dispatch and the later time to approval, treating the written order of the times as sufficient evidence of sequence.",
      "Reopen the same record, clarify the fields with the custodian and complete traceable factual notes, preserving any unresolved uncertainty before drawing a conclusion.",
      "Report an authorization failure because uncertainty in the auditor's note establishes that R684 does not adequately demonstrate approval before the product was dispatched.",
      "Ask the custodian to approve the intended finding before completing the notes, treating agreement with that conclusion as the necessary confirmation of factual accuracy."
    ],
    "answer": 1,
    "why": "Notes should be completed while the source and relevant personnel remain available, so their meaning can be verified rather than reconstructed later. Reexamining the exact record and clarifying its field meanings allows the auditor to identify what each timestamp actually establishes and record traceable facts. Any remaining ambiguity must stay explicit; the note's question mark is not evidence that approval was late or absent. The custodian can clarify facts, but does not gain authority to approve or veto the audit conclusion. That conclusion depends on the applicable requirement and the verified evidence, not the order in which the auditor wrote two times. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 106–107.</span>",
    "keyPoint": "Clarify incomplete notes against the original available source promptly, separating factual corroboration from agreement with an audit conclusion.",
    "trap": "Turning uncertainty in the auditor's own notes into an auditee nonconformity, or substituting assumed chronology or auditee approval for verified facts.",
    "distractors": {
      "0": "The note does not identify the events associated with the times. Their written order cannot establish which event occurred first, so assigning labels from that order would add an unsupported fact.",
      "2": "The uncertainty is in the auditor's incomplete note. The original record is available for clarification, and the stated facts do not establish that approval was late, absent or inadequately recorded.",
      "3": "The custodian can help confirm what the fields and records mean. Agreement with a proposed finding is a different matter and is not a prerequisite for an evidence-supported audit conclusion."
    }
  },
  {
    "qid": "cqa:set-2:q124",
    "set": 2,
    "batch": 13,
    "sub": "cqa-retrospective-shipped-product-impact",
    "bok": "II.D.1",
    "cognitive": "Evaluate",
    "stem": "Panel-packaging case. An assigned auditor reviews corrective action under customer agreement PK-9. Each package contains one panel. PK-9 requires arrival without edge damage and exterior identification readable at receiving without opening the protective wrapping. The exhibit contains verified information. The auditee selects and implements remedies; the auditor evaluates response adequacy and effectiveness against the agreement. Which additional work is needed specifically for the 120 earlier P4 shipments?",
    "options": [
      "Treat the earlier shipments as covered by implementing P5, because preventing future edge damage resolves the product consequences of the original packaging condition.",
      "Require return and replacement of all 120 panels before assessing their condition, because the confirmed packaging mechanism establishes damage in every earlier shipment.",
      "Request assessment of the traceable P4 shipments and proportionate action based on the identified exposure and consequences, with verification that required actions were completed.",
      "Limit the response to customers who have already complained, because the lack of complaints for other identified P4 shipments establishes that those panels arrived unaffected."
    ],
    "answer": 2,
    "why": "Corrective-action review includes the effects of the original condition on product or services already supplied. Implementing P5 addresses future packaging, but does not assess the 120 additional P4 shipments made while the confirmed failure mechanism existed. The auditee should determine the relevant exposure and consequences within that traceable population, select proportionate action for affected product and customers, and provide evidence that the required response was completed. The mechanism does not prove that every panel was damaged, while silence from a customer does not prove that no effect occurred. A blanket return or replacement requirement cannot be inferred from the facts given. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 136.</span>",
    "keyPoint": "Assess the effects of a confirmed nonconformity on already-supplied outputs as well as preventing recurrence in future work.",
    "trap": "Assuming that a successful future change resolves earlier product exposure, or that a known failure mechanism proves every affected-period unit was damaged.",
    "distractors": {
      "0": "Changing new packaging does not determine the condition or consequences of product already shipped in P4. That earlier population remains unassessed even if the new design prevents future edge damage.",
      "1": "The evidence establishes a failure mechanism and damage in the reviewed sample, not damage in every additional shipment. The appropriate response must be based on assessment of exposure and consequences, rather than an unsupported universal disposition.",
      "3": "A customer complaint is useful evidence, but the absence of one does not establish that a shipped panel was unaffected. Restricting assessment to complainants leaves the identified earlier population inadequately considered."
    },
    "caseId": "cqa-set2-panel-packaging-capa-01",
    "chart": {
      "type": "data-table",
      "title": "Panel-packaging corrective action: verified cause, shipments and follow-up",
      "columns": [
        "Review area",
        "Verified information"
      ],
      "rows": [
        [
          "Original P4 condition and cause",
          "For panel type T7 on route R2, 10 of 40 reviewed P4 packages had edge damage. Investigation confirmed that inadequate corner restraint allowed movement that caused the damage."
        ],
        [
          "Earlier shipped population",
          "Records identify 120 additional P4 packages of T7 shipped on R2 during the affected period before P5. Their product condition and customer impact have not been assessed."
        ],
        [
          "Permanent change",
          "The approved P5 design adds corner restraints and extends the protective wrapping. Implementation on new shipments has been verified."
        ],
        [
          "P5 follow-up results",
          "Receiving records for 40 P5 packages of T7 on R2 show no edge damage. On six, the new wrapping obscured exterior identification so it could not be read without opening the wrapping."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q125",
    "set": 2,
    "batch": 13,
    "sub": "cqa-corrective-action-unintended-effects",
    "bok": "II.D.3",
    "cognitive": "Evaluate",
    "stem": "Panel-packaging case. An assigned auditor reviews corrective action under customer agreement PK-9. Each package contains one panel. PK-9 requires arrival without edge damage and exterior identification readable at receiving without opening the protective wrapping. The exhibit contains verified information. The auditee selects and implements remedies; the auditor evaluates response adequacy and effectiveness against the agreement. Which assessment of P5's effectiveness is best supported by the follow-up evidence?",
    "options": [
      "Accept P5 as effective because none of the reviewed panels had edge damage; record the obscured labels as housekeeping observations unrelated to the remedy.",
      "Approve P5 as effective because the authorized design was implemented; defer identification review until another edge-damage complaint provides evidence of a continuing problem.",
      "Require immediate restoration of P4 because its wrapping left identification readable, treating removal of the new wrapping problem as sufficient corrective action.",
      "Recognize the favorable edge-damage results, but have the auditee address and verify the introduced identification failure before treating P5 as an effective remedy."
    ],
    "answer": 3,
    "why": "The follow-up records show a favorable edge-damage result for the 40 reviewed P5 packages, but six also violate PK-9's identification requirement because of the new wrapping. Corrective action must address the original problem without introducing another. Verified implementation and improvement in one outcome do not establish that the complete remedy is effective when a connected required outcome fails. The auditee should address that unintended effect and provide verification against the relevant requirements. The auditor evaluates that evidence without prescribing a particular packaging redesign or automatically returning to P4's known inadequate restraint. The sample does not guarantee that every future P5 shipment will be free of damage. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 136, 140.</span>",
    "keyPoint": "Verify the intended result and the effects of the corrective action on connected requirements; an improved original outcome does not excuse a new failure.",
    "trap": "Declaring a remedy effective from implementation or one improved measure while dismissing a verified problem introduced elsewhere in the process.",
    "distractors": {
      "0": "Exterior identification is an explicit customer requirement, and the new wrapping caused the observed failures. Calling them housekeeping observations does not remove their relevance to the remedy's effectiveness.",
      "1": "Implementation confirms that the planned change was made. The existing receiving evidence already shows a required outcome is not met; another edge-damage complaint is not needed to make identification relevant.",
      "2": "Restoring P4 would reintroduce the confirmed inadequate restraint without establishing a satisfactory overall remedy. The auditee must develop an appropriate solution; the auditor's role does not require prescribing that specific reversal."
    },
    "caseId": "cqa-set2-panel-packaging-capa-01",
    "chart": {
      "type": "data-table",
      "title": "Panel-packaging corrective action: verified cause, shipments and follow-up",
      "columns": [
        "Review area",
        "Verified information"
      ],
      "rows": [
        [
          "Original P4 condition and cause",
          "For panel type T7 on route R2, 10 of 40 reviewed P4 packages had edge damage. Investigation confirmed that inadequate corner restraint allowed movement that caused the damage."
        ],
        [
          "Earlier shipped population",
          "Records identify 120 additional P4 packages of T7 shipped on R2 during the affected period before P5. Their product condition and customer impact have not been assessed."
        ],
        [
          "Permanent change",
          "The approved P5 design adds corner restraints and extends the protective wrapping. Implementation on new shipments has been verified."
        ],
        [
          "P5 follow-up results",
          "Receiving records for 40 P5 packages of T7 on R2 show no edge damage. On six, the new wrapping obscured exterior identification so it could not be read without opening the wrapping."
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q126",
    "set": 2,
    "batch": 13,
    "sub": "cqa-complementary-team-competence",
    "bok": "III.A",
    "cognitive": "Apply",
    "stem": "Two independent, qualified auditors are assigned to an audit linking heat-treatment cycle controls with electronic release records. One is competent in heat-treatment parameters; the other is competent in electronic record linkage. Neither is qualified to make the other's specialized technical judgments. Together they cover the required competence, and the schedule allows a joint review of selected linked records. Which direction best uses the team's strengths?",
    "options": [
      "Have each auditor judge both areas using the same checklist, then reconcile their pass rates to give both technical judgments equal weight.",
      "Postpone the audit until both auditors are qualified in both specialisms, because each team member must be able to make every required technical judgment.",
      "Assign each specialist area to the appropriately competent auditor and coordinate their review of linked evidence so the team can assess the process interface.",
      "Let each auditor finalize a separate area conclusion and omit joint review, because competence in both areas is already present somewhere on the team."
    ],
    "answer": 2,
    "why": "The lead should use the auditors' complementary strengths while ensuring that their work collectively meets the audit objective. Each auditor can make the specialized judgments for which competence is established; neither should be assigned the other's technical assessment merely because both are qualified auditors. Their coordinated review connects the cycle controls with the release records, allowing each contribution to inform the interface assessment. Collective competence does not require identical expertise in every team member, but it does require effective collaboration rather than disconnected area conclusions. The stated schedule provides for that joint work. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 146, 149.</span>",
    "keyPoint": "Use complementary individual competence through coordinated assignments so the team's combined work meets the audit objectives.",
    "trap": "Confusing collective team competence with identical expertise in every auditor, or assuming different specialists' work integrates itself.",
    "distractors": {
      "0": "A common checklist does not establish the specialized competence that each auditor lacks. Averaging or reconciling pass rates cannot replace competent technical judgments and review of the evidence linking the areas.",
      "1": "The required competence is available across the team. Requiring every member to possess both specialisms adds a condition the audit does not need when assignments and collaboration provide the necessary coverage.",
      "3": "The audit explicitly links cycle controls to release records. Separate conclusions without the planned joint review can leave that relationship unassessed even though both specialties are represented."
    }
  },
  {
    "qid": "cqa:set-2:q127",
    "set": 2,
    "batch": 13,
    "sub": "cqa-software-report-fidelity",
    "bok": "III.D",
    "cognitive": "Evaluate",
    "stem": "An audit's approved reporting method requires evidence-linked findings and a scoped conclusion, with no overall supplier-approval rating. The audit software records the findings correctly but automatically adds an aggregate score and an 'Approved supplier' banner. The lead is authorized to customize report templates and disable optional scoring; access, approval and retention controls remain mandatory. Which reporting approach best preserves the approved assessment?",
    "options": [
      "Disable the optional score and banner through the authorized template settings, present the supported findings and scoped conclusion, and retain the required report controls.",
      "Keep the default score and banner for consistency with earlier software outputs, and add a footnote explaining that the approved method did not require them.",
      "Change the numerical weight of each finding until the software's overall rating reflects the lead's judgment, then issue that rating alongside the original finding statements.",
      "Issue the software's aggregate rating as the report summary, and keep the individual findings in the controlled file for recipients who later request more detail."
    ],
    "answer": 0,
    "why": "Audit software should support an effective report rather than impose an assessment the approved method does not authorize. Here, the software's score and approval banner add a supplier-approval conclusion that is outside that method. Authorized template changes can remove those outputs while preserving the actual findings, the scoped conclusion and all required controls. A footnote would leave the conflicting message in the report, changing weights would invent an unsupported rating method, and retaining findings only in the file would not provide the required reporting content. The permission to customize output does not waive access, approval or retention requirements. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 163.</span>",
    "keyPoint": "Configure authorized audit-reporting tools to represent the approved method and evidence faithfully while preserving required controls.",
    "trap": "Treating a software-generated score or status as audit authority, or changing the assessment to obtain a preferred software output.",
    "distractors": {
      "1": "The approved method does not authorize an overall supplier-approval rating. Keeping the score and banner can mislead recipients even if a footnote acknowledges the mismatch.",
      "2": "Changing weights creates a rating method that was not approved. The task is to communicate the supported assessment, not tune the scoring until it produces a desired label.",
      "3": "An aggregate rating does not replace the required evidence-linked findings and scoped conclusion. Keeping those findings elsewhere also does not authorize the software's supplier-approval label."
    }
  },
  {
    "qid": "cqa:set-2:q128",
    "set": 2,
    "batch": 13,
    "sub": "cqa-continuity-shared-dependency",
    "bok": "IV.A.8",
    "cognitive": "Analyze",
    "stem": "A service centre's continuity objective is to resume order processing within four hours after loss of electrical Feeder F. Its plan transfers work to another building. Verified utility diagrams show that both buildings depend on Feeder F, and neither has an independent power source. A successful two-hour exercise disabled the primary application but kept Feeder F energized. Management cites the exercise as proof that the stated feeder-loss scenario is controlled. Which assessment is best supported?",
    "options": [
      "The two-hour transfer meets the four-hour objective, and using a different building provides sufficient separation to treat the stated feeder-loss risk as controlled.",
      "The exercise supports transfer while Feeder F is available, but both buildings still depend on it; the result does not demonstrate continuity for the stated feeder loss.",
      "Repeating the same powered exercise for four hours would establish continuity for feeder loss, because the longer exercise would match the full objective period.",
      "The shared feeder should remain background information until a real outage occurs, because only an actual interruption can show whether the fallback is needed."
    ],
    "answer": 1,
    "why": "The identified disruption is loss of Feeder F, not just loss of the primary application. The exercise demonstrated a transfer under conditions in which that feeder continued supplying both buildings. Because the verified arrangements provide no independent power, the fallback retains the same dependency that the plan is intended to address. The audit should report this gap in treatment of the specified scenario; the successful exercise does not establish the claimed continuity capability. Extending the same powered test would not remove the mismatch, and the organization need not wait for an actual outage to identify it. The evidence supports the gap without prescribing which technical or operational remedy management must choose. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 204, 206.</span>",
    "keyPoint": "Assess a continuity treatment against the identified disruption and the dependencies actually exercised, rather than treating any successful transfer as proof of resilience.",
    "trap": "Mistaking an alternate location or a successful limited exercise for removal of the dependency that causes the specified interruption.",
    "distractors": {
      "0": "The elapsed transfer time was achieved while the shared feeder remained available. A different building does not provide independence from a utility dependency that both verified configurations retain.",
      "2": "Longer operation with Feeder F energized tests duration under powered conditions, not operation after its loss. The changed test duration would leave the decisive dependency untested and unchanged.",
      "3": "The diagrams, power arrangements and test conditions already identify the treatment gap. Waiting for a real outage is not necessary to assess whether the fallback addresses this known risk."
    }
  },
  {
    "qid": "cqa:set-2:q129",
    "set": 2,
    "batch": 13,
    "sub": "cqa-activity-based-coq-allocation",
    "bok": "IV.B.3",
    "cognitive": "Apply",
    "stem": "An organization's approved COQ method allocates a shared analysis-platform license cost by verified platform-use hours. An auditor is reviewing only the $24,000 annual license-cost pool. The exhibit lists its complete users for that year, and the COQ categories are already established. Use hours do not overlap; the license cost is not included in the labor amounts, and no part of it has been allocated elsewhere. Which allocation of the license cost follows the approved method?",
    "options": [
      "Prevention $6,000; appraisal $18,000, based on each activity's share of the 480 verified platform-use hours.",
      "Prevention $18,000; appraisal $6,000, based on each activity's share of the $24,000 in direct labor costs.",
      "Prevention $12,000; appraisal $12,000, because the two listed activity categories are the platform's complete users for the year.",
      "Prevention $0; appraisal $24,000, because the audit activity uses more platform hours and therefore receives the full shared cost."
    ],
    "answer": 0,
    "why": "The stated allocation basis is resource use. Total platform use is 120 + 360 = 480 hours. Prevention uses 120/480 of the platform time, so it receives $24,000 × 120/480 = $6,000; appraisal uses 360/480 and receives $18,000. These allocations sum to the complete $24,000 license pool. Direct labor costs provide a different proportion and are not the adopted driver. They are also not added to this answer because the question asks only for the license allocation. Equal sharing or charging the whole pool to its largest user would disregard the verified use proportions. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 220.</span>",
    "keyPoint": "Under an adopted activity-based COQ method, allocate a shared resource's cost using its specified consumption driver and reconcile the allocations to the cost pool.",
    "trap": "Substituting labor-cost proportions, equal shares or the largest user's category for the stated resource-use basis.",
    "distractors": {
      "1": "The labor costs produce a 3:1 split, whereas platform use produces a 1:3 split. The approved method specifies platform-use hours, so allocating by wages reverses the required amounts.",
      "2": "There are two users, but they do not use the platform equally. Counting categories instead of their hours does not implement the stated consumption-based allocation.",
      "3": "The prevention activity uses one-quarter of the recorded platform time. The appraisal activity's larger use does not justify assigning it the entire cost pool under the approved proportional method."
    },
    "chart": {
      "type": "data-table",
      "title": "Annual platform use and separately recorded labor",
      "columns": [
        "Activity",
        "Established COQ category",
        "Verified platform-use hours",
        "Direct labor cost"
      ],
      "rows": [
        [
          "Quality planning",
          "Prevention",
          120,
          "$18,000"
        ],
        [
          "Routine conformity audits",
          "Appraisal",
          360,
          "$6,000"
        ]
      ]
    }
  },
  {
    "qid": "cqa:set-2:q130",
    "set": 2,
    "batch": 13,
    "sub": "cqa-sampling-risk-conditioning",
    "bok": "V.E.3",
    "cognitive": "Understand",
    "stem": "A buyer uses one acceptance-sampling plan for incoming connector lots. The agreed acceptable reference quality is 0.5% nonconforming, and the unacceptable reference quality is 4% nonconforming. Plan-performance information gives a 5% probability of rejection for lots at exactly 0.5% nonconforming and a 10% probability of acceptance for lots at exactly 4% nonconforming. No distribution of incoming lot qualities is supplied. Which statement correctly interprets this information?",
    "options": [
      "Of all accepted connector lots, 10% have 4% nonconforming units; the plan's consumer-risk figure describes the quality mix of the lots released to the buyer.",
      "Of all incoming connector lots, 10% are accepted at unacceptable quality and 5% are rejected at acceptable quality; these are the plan's overall decision-error rates.",
      "Lots actually at 4% nonconforming have a 10% chance of acceptance; the figures do not establish what proportion of all accepted lots have that quality.",
      "Each accepted connector lot may contain up to 10% nonconforming units; consumer risk sets that permitted fraction, while 0.5% and 4% are reference test conditions."
    ],
    "answer": 2,
    "why": "The 10% consumer-risk figure describes acceptance when a lot's actual quality is the specified unacceptable level of 4% nonconforming. It does not describe the quality mix among all lots that the plan accepts. Similarly, the 5% producer-risk figure concerns rejection when the lot is at the stated acceptable level of 0.5% nonconforming. Determining the mix of accepted lots would require information about incoming lot qualities and the plan's performance at those qualities; that information is not supplied. A decision-error probability also is not a permitted percentage of nonconforming units in an accepted lot. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 291–292.</span>",
    "keyPoint": "Consumer risk concerns acceptance at a specified unacceptable quality level; it does not state the quality composition of all accepted lots.",
    "trap": "Reversing the condition in a sampling-risk statement, or treating a decision-error probability as an overall error rate or a permitted fraction of nonconforming units.",
    "distractors": {
      "0": "This reverses the condition. The supplied 10% is the chance of acceptance for a lot at 4% nonconforming, not the proportion of accepted lots that have that quality. The incoming quality mix is unknown.",
      "1": "The two percentages apply at their specified quality levels. Overall error rates among incoming lots also depend on how often those and other lot qualities occur, which the question does not provide.",
      "3": "Consumer risk describes a sampling decision, not a product-quality allowance. The 10% probability does not authorize 10% nonconforming units in each accepted lot."
    }
  },
  {
    "qid": "cqa:set-2:q131",
    "set": 2,
    "batch": 14,
    "sub": "cqa-process-technique-system-coverage",
    "bok": "I.A.1",
    "cognitive": "Apply",
    "stem": "An audit is intended to assess how management direction, order fulfilment, purchasing and competence controls operate together against the organization's quality requirements. The plan traces selected customer orders and examines linked management and support evidence. A colleague argues that following process steps requires limiting conclusions to separate operational processes. Which decision best preserves the approved objective?",
    "options": [
      "Convert the assignment into separate operational process audits and omit management and support review, because tracing requires conclusions limited to each observed process.",
      "Use tracing within the planned wider assessment, linking relevant management, operational and support evidence so conclusions address the system and its interactions.",
      "Replace the traces with a document-only clause review, because an assessment of the wider management system cannot rely on following operational process steps.",
      "Keep separate department conclusions and add their conformity counts, treating that total as sufficient evidence of how the management-system activities work together."
    ],
    "answer": 1,
    "why": "Following process steps is an audit technique that can be used within a management-system assessment. It does not restrict an assignment to isolated operational processes when the approved objective includes management, operations, support and their interactions. The planned traces can connect evidence across those activities, provided the team also examines the relevant controls needed for the wider objective. Neither replacing operational evidence with documents alone nor adding independent departmental counts establishes how the system works together. The method should serve the approved coverage rather than redefine it. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 4.</span>",
    "keyPoint": "Use process-tracing techniques within the broader audit purpose and scope; the evidence-collection method does not itself narrow the assessment to isolated processes.",
    "trap": "Mistaking a process-based method for a requirement to exclude management, support or interface evidence from a wider system assessment.",
    "distractors": {
      "0": "The approved objective includes management, support and how the controls operate together. The use of tracing does not authorize removing those parts of the assignment.",
      "2": "System auditors may use process techniques and relevant operational evidence. A document-only review would not by itself establish how the stated controls operate together.",
      "3": "Separate conclusions and their counts may be inputs, but adding them does not establish the relationships between activities. The planned interface evidence is needed for the stated wider assessment."
    }
  },
  {
    "qid": "cqa:set-2:q132",
    "set": 2,
    "batch": 14,
    "sub": "cqa-concurrent-internal-contractual-criteria",
    "bok": "I.C",
    "cognitive": "Analyze",
    "stem": "An audit's criteria include a customer contract requiring technical responses within 24 hours and an approved internal procedure requiring them within 8 hours. Both requirements apply to the reviewed request, measure continuous elapsed time from receipt to sending the technical response, and have no authorized exception. Verified records show a 16-hour interval. Which assessment correctly distinguishes the obligations?",
    "options": [
      "Report a breach of both time limits because the internal 8-hour rule replaces the 24-hour contract limit whenever the company adopts a tighter requirement.",
      "Report conformity to both limits because the external contract takes precedence, so meeting its 24-hour condition makes the more demanding internal target irrelevant for this response.",
      "Defer assessment until the customer chooses one governing limit, because an internal deadline and a contract deadline must be identical before the same response can be judged.",
      "The 16-hour response meets the contract's 24-hour limit but violates the applicable 8-hour internal requirement; identify that internal breach without alleging a contractual delay."
    ],
    "answer": 3,
    "why": "The applicable internal procedure adds an obligation beyond the contract's maximum response time. A response within eight hours would satisfy both, so the two criteria do not create an unresolved conflict. This 16-hour response meets the 24-hour contractual limit but exceeds the internal eight-hour limit. The finding should identify the requirement actually violated rather than rewrite the customer's deadline or disregard the internal obligation. The conclusion concerns these response-time criteria for the reviewed request, not every aspect of contractual or system conformity. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 21.</span>",
    "keyPoint": "Evaluate each applicable obligation separately; meeting an external minimum does not erase an additional internal requirement, and an internal failure does not automatically breach the contract.",
    "trap": "Assuming that one applicable criterion replaces another, or extending a failure of a stricter internal requirement into an unsupported external breach.",
    "distractors": {
      "0": "The company can adopt a tighter internal obligation without changing the customer's contract. The 16-hour result violates eight hours but not the stated 24-hour contractual limit.",
      "1": "Both requirements are explicitly applicable audit criteria. Conformity to the longer contractual limit does not make the approved internal obligation optional.",
      "2": "The limits can be met simultaneously by responding within eight hours. Their difference does not prevent assessment, and the stem supplies no unresolved applicability question requiring customer selection."
    }
  },
  {
    "qid": "cqa:set-2:q133",
    "set": 2,
    "batch": 14,
    "sub": "cqa-confidential-information-private-use",
    "bok": "I.E.1",
    "cognitive": "Apply",
    "stem": "During an audit, an auditor learns confidential fixture settings developed by the auditee that reduce setup time. The auditor plans to use those exact settings for paid orders in a one-person private workshop, working from memory without copying files or telling anyone the source. The information remains confidential, no authorization for this use has been given, and the audit report would remain unchanged. Which response best meets the auditor's professional responsibility?",
    "options": [
      "Do not apply the confidential settings to the private orders; using audit information for personal gain breaches the obligation even without copying or disclosure.",
      "Wait until the audit report is formally issued, then apply the settings privately because the completed findings can no longer be influenced by that use.",
      "Return all audit records and use only the remembered settings, treating the absence of retained documents or copied files as sufficient protection of confidentiality.",
      "Assess the likely financial loss to the auditee and proceed if none can be demonstrated, treating the absence of measurable damage as permission for private use."
    ],
    "answer": 0,
    "why": "Confidentiality protects against improper use as well as disclosure. These are specific settings learned through the audit, still confidential and not authorized for private commercial use. Applying them to paid orders would use that information for personal gain even if the auditor works alone, copies no files and does not change the audit report. Returning records or waiting until reporting is finished does not remove that obligation. The auditor does not need proof of measurable financial loss before respecting the restriction, and the question does not assume that loss has occurred. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 30.</span>",
    "keyPoint": "Protect confidential audit information from unauthorized personal use as well as disclosure; remembering it does not convert it into unrestricted commercial knowledge.",
    "trap": "Treating silence, use from memory, a completed audit or absence of demonstrated loss as permission to exploit still-confidential information for personal gain.",
    "distractors": {
      "1": "Issuing the report does not make the information public or authorize its private use. The continuing confidentiality obligation is separate from whether the audit findings change.",
      "2": "Returning source records protects those records, but does not authorize exploiting their confidential content from memory. The proposed benefit comes from the information, not from possessing a copied file.",
      "3": "The stated restriction does not depend on first proving a financial loss. An inability to quantify damage is not permission to use the auditee's confidential information for personal gain."
    }
  },
  {
    "qid": "cqa:set-2:q134",
    "set": 2,
    "batch": 14,
    "sub": "cqa-sampling-frame-working-papers",
    "bok": "II.A.5",
    "cognitive": "Apply",
    "stem": "An approved audit sampling plan covers closure controls for all repair jobs completed from January through March. Before selection, the auditee supplies a folder containing only jobs that closed on time without a customer complaint. The auditor verifies that a separate master ID list covers every completed job in the period and that all linked records are available. Which selection approach best implements the plan?",
    "options": [
      "Randomize the IDs in the supplied folder, select the planned number, and document the random procedure as evidence that the period is covered.",
      "Expand the sample within the supplied folder to twice the planned number, and document the larger sample as evidence that the period is covered.",
      "Apply the approved selection method to the complete master list, and record the population, selected IDs and any limitations in the working papers.",
      "Ask department representatives to add examples they consider typical, select from that expanded folder, and document the departments represented as evidence of coverage."
    ],
    "answer": 2,
    "why": "The planned population is all repair jobs completed in the stated period. The supplied folder excludes jobs according to their outcome, so selecting more of those records or randomizing within that folder leaves the same exclusion in place. The verified master list provides the appropriate frame for applying the approved selection method under the auditor's control. The working papers should identify the population, selected records and relevant limitations. A complete frame does not by itself guarantee a representative result or establish a statistical confidence claim; the selection method and resulting evidence still matter. There is no stated need to inspect every job or to assume that the auditee deliberately concealed information. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 79.</span>",
    "keyPoint": "Select from the population defined by the audit plan; randomizing or enlarging an outcome-selected subset does not repair its excluded coverage.",
    "trap": "Treating a random procedure, a larger sample or departmental representation as a substitute for an appropriate sampling frame.",
    "distractors": {
      "0": "Random selection within the supplied folder gives excluded jobs no opportunity to enter the sample. It does not extend the folder's coverage to the complete planned population.",
      "1": "A larger sample from the same restricted folder still excludes late or complained-about jobs. Extra volume does not correct that frame limitation.",
      "3": "Additional examples chosen as typical by department representatives remain an auditee-curated selection. Their departmental spread does not establish coverage of the complete population already available to the auditor."
    }
  },
  {
    "qid": "cqa:set-2:q135",
    "set": 2,
    "batch": 14,
    "sub": "cqa-reporting-corrected-observed-condition",
    "bok": "II.C.1",
    "cognitive": "Evaluate",
    "stem": "At 10:05, an auditor verifies that cell C2 is using obsolete work instruction WI-7, revision 2, although procedure DC-3 requires current approved revision 3 at the point of use. At 11:00, the auditor verifies that the obsolete copy has been removed and the operator is using revision 3. The auditee's agreed response still has cause analysis and recurrence controls pending. The report will be issued that afternoon. Which report treatment most accurately reflects the evidence and response status?",
    "options": [
      "Record the 11:00 compliant condition in the report and retain the 10:05 breach only in working papers, since correction occurred before report issue.",
      "Report the 10:05 breach of DC-3, the verified 11:00 correction and the pending cause and recurrence work, retaining traceable evidence for those statuses.",
      "Report the 10:05 breach as an unchanged condition and keep the later replacement outside the report, since findings describe the auditor's first observation.",
      "Report the breach with corrective action completed and verified effective, using the observed replacement as evidence that the document control will prevent recurrence."
    ],
    "answer": 1,
    "why": "The 10:05 observation establishes a requirement breach that should be reported with its supporting facts. The verified 11:00 correction changes the current condition and should also be recorded accurately. Removing the obsolete copy does not erase the earlier violation, and the report should not imply that the obsolete instruction remained in use after the auditor verified otherwise. Immediate correction is also distinct from demonstrating that an underlying cause has been addressed and recurrence prevented. Here that work remains pending in the agreed response, so the replacement alone cannot support a statement of verified corrective-action effectiveness. The reporting decision preserves both the observed nonconformity and the supported status of the response. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 122, 134.</span>",
    "keyPoint": "Report a verified earlier requirement breach together with its verified correction and current response status; distinguish correction from demonstrated corrective-action effectiveness.",
    "trap": "Letting a correction erase a supported finding, ignoring the correction when describing current conditions, or treating replacement alone as proof against recurrence.",
    "distractors": {
      "0": "The later correction does not negate the verified requirement breach. Reporting only the current compliant condition omits an established audit result rather than explaining its subsequent correction.",
      "2": "The auditor has verified a change in the condition. Presenting the obsolete instruction as still in use would misstate the evidence available before the report is issued.",
      "3": "The replacement verifies immediate correction. It does not establish that the pending cause and recurrence work is complete or that the corrective action is effective."
    }
  },
  {
    "qid": "cqa:set-2:q136",
    "set": 2,
    "batch": 14,
    "sub": "cqa-justified-no-additional-capa-project",
    "bok": "II.D.2",
    "cognitive": "Evaluate",
    "stem": "An internal audit finds one missing required indexing code after a completed, one-time archive transfer. An authorized correction restored the code. Investigation traced the omission to a unique legacy record format unsupported by the retired transfer utility; checking all transferred files found no other omissions, and no active process uses that utility. No product or record-retrieval requirement was affected. Procedure CA-6 permits the assigned reviewer to accept correction plus monitoring for one administrative occurrence with no continuing exposure; recurrence or product/retrieval impact requires a formal corrective-action project. No external criterion requires more here. The response includes a dated monitoring review owned by the records manager. Which decision is best supported?",
    "options": [
      "Require a new permanent-control project despite the documented scope and cause assessment, because any verified nonconformity makes the local exception to additional corrective action inapplicable.",
      "Accept the response and remove the original finding from the audit record, because completed correction and the absence of continuing exposure establish that no nonconformity remains reportable.",
      "Accept the correction alone as the complete response and cancel monitoring, because checking all transferred files establishes that further review cannot add value to this event.",
      "Accept the justified no-project response under CA-6, retain the finding and correction record, and keep the assigned monitoring review and escalation criteria in place."
    ],
    "answer": 3,
    "why": "The stated procedure permits a proportionate response when the investigation supports its conditions. Here, the cause is identified, the entire affected transfer population was checked, the record was corrected, the utility is retired, and no continuing exposure or overriding external obligation is identified. Those facts support the assigned reviewer accepting the documented justification without requiring another corrective-action project. This is more than an unsupported claim that the event was isolated or below a numerical threshold. The response must still preserve the finding and correction history and the agreed monitoring and escalation conditions. Acceptance does not erase the original requirement failure or turn this local exception into a rule for every nonconformity. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 135.</span>",
    "keyPoint": "Evaluate a justified decision not to require additional corrective action against the applicable procedure, verified cause and extent, remaining exposure, and required monitoring.",
    "trap": "Assuming every nonconformity requires another permanent-action project, or treating an accepted limited response as permission to erase the finding or cancel its monitoring.",
    "distractors": {
      "0": "CA-6 expressly permits this route when its conditions are met. The evidence addresses cause, extent, correction and continuing exposure; imposing another project solely because a nonconformity occurred adds a requirement not stated here.",
      "1": "The original omission violated a requirement even though it was later corrected. Accepting a justified response does not make the historical finding disappear or authorize removing its record.",
      "2": "The complete population check supports the justification, but it does not cancel the monitoring element required by the permitted response. That review and its escalation conditions remain part of what the reviewer is accepting."
    }
  },
  {
    "qid": "cqa:set-2:q137",
    "set": 2,
    "batch": 14,
    "sub": "cqa-interview-during-time-sensitive-work",
    "bok": "III.E",
    "cognitive": "Apply",
    "stem": "At the scheduled interview time, a technician is about to begin a ten-minute check whose approved method requires starting now and recording readings at fixed intervals. Detailed questions would interrupt the required concentration. Observing this check is already in the audit plan. The auditor is competent and authorized to watch safely without operating equipment; the observation, remaining questions and notes fit the available period. Which approach best develops the planned evidence?",
    "options": [
      "Agree to observe the check without interrupting or directing it, then complete the interview and corroborate relevant explanations while retaining the planned evidence requirements.",
      "Ask the technician to postpone the check until the interview ends, because a scheduled interview should take priority over an observation that can be documented later.",
      "Ask the supervisor to answer the remaining questions while the technician works, and treat that account as sufficient evidence of how this technician performs the check.",
      "Return after the check and assess its execution from the completed record alone, treating the technician's preoccupation as a reason to omit the planned observation."
    ],
    "answer": 0,
    "why": "The technician's immediate need to concentrate on required work is compatible with the audit's planned observation. Agreeing to watch the normal task first preserves that evidence opportunity without creating an interruption or coaching the work. The auditor can complete the remaining questions and relevant corroboration afterward within the stated time. Preoccupation does not itself establish resistance or incompetence. The method's timing requirement should not be displaced merely to preserve the original conversational sequence, and a supervisor's account or a later record alone does not replace the planned observation of this technician's work. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 170.</span>",
    "keyPoint": "When required work is time-sensitive and already needs observation, arrange a suitable sequence that protects the work and completes the remaining interview and evidence checks.",
    "trap": "Treating concentration on a legitimate task as obstruction, or preserving the interview sequence by interrupting required work or abandoning planned observation.",
    "distractors": {
      "1": "The approved method requires the check to start now. The plan can be fulfilled by observing first and asking the remaining questions afterward, so postponing the work creates an unnecessary conflict with its requirement.",
      "2": "The supervisor may provide useful context, but that account does not demonstrate how this technician carries out the check. It substitutes another person's explanation for the observation and interview that remain feasible.",
      "3": "The auditor can safely observe now and still finish the questions and notes. Omitting the planned observation loses available evidence without a justified access, timing or safety constraint."
    }
  },
  {
    "qid": "cqa:set-2:q138",
    "set": 2,
    "batch": 14,
    "sub": "cqa-conflict-relevance-and-resolution",
    "bok": "III.C",
    "cognitive": "Analyze",
    "stem": "During a calm audit-team review, two members disagree about which optional professional conference they should attend next year. That preference has no bearing on this audit's competence, resources or deliverables. They also disagree whether two evidence entries describe one shipment or two, a point that could change a draft finding. The source records are available, and sufficient review time remains to compare them. Which response best fits the two disputes?",
    "options": [
      "Resolve the conference dispute first to restore complete agreement, then accept the senior auditor's shipment interpretation so the review remains within the time available.",
      "Defer both disagreements until after report issue, preserving each auditor's opinion separately because requiring a common view before reporting could damage their working relationship.",
      "Set aside the conference preference and collaboratively compare the shipment evidence against the relevant criterion, recording or assigning follow-up for any material uncertainty that remains.",
      "Avoid debating either disagreement and omit the disputed shipment from the finding, treating the narrower conclusion as a practical compromise that preserves cooperation within the team."
    ],
    "answer": 2,
    "why": "The two disagreements have different relevance to the current audit. The optional conference preference can be deferred without affecting its purpose or evidence, even though deferral does not resolve that personal disagreement. The shipment question can affect a finding, so it requires examination rather than avoidance or a compromise made only for harmony. Calm conditions, accessible records and sufficient time support collaborative clarification of the facts and their relationship to the criterion. If a material question remains, it should be recorded and pursued appropriately; collaboration does not guarantee consensus or permit an unsupported conclusion. Seniority is not a substitute for that assessment. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 156–158.</span>",
    "keyPoint": "Choose the conflict response according to its effect on the audit: defer an unrelated preference when appropriate, but address a material evidence disagreement through reasoned review.",
    "trap": "Applying one response to every disagreement, or treating harmony, seniority or a narrower finding as a substitute for resolving material evidence questions.",
    "distractors": {
      "0": "Agreement on an unrelated conference preference is not a prerequisite for reviewing audit evidence. Assigning the substantive conclusion to the senior member also bypasses the available comparison of facts.",
      "1": "Deferring the personal preference is reasonable, but deferring an evidence issue that could change the finding until after report issue leaves a known material question unaddressed despite available time and sources.",
      "3": "Omitting disputed evidence simply to avoid discussion can distort the finding. The available records should be evaluated; any later decision to exclude unsupported evidence must follow that assessment, not a compromise for cooperation."
    }
  },
  {
    "qid": "cqa:set-2:q139",
    "set": 2,
    "batch": 14,
    "sub": "cqa-promising-practice-with-approval-gap",
    "bok": "IV.A.7",
    "cognitive": "Evaluate",
    "stem": "An internal audit's objectives include conformity and identifying practices for wider use. Procedure CM-3 requires approval before changing the dispatch-check method. A team introduced a barcode comparison without requesting approval. Verified records show that average handling time fell from eight to six minutes under unchanged measurement rules, but no broader effectiveness review has been completed. The process owner is handling current use under the deviation procedure; the audit team cannot approve method changes. The program's practice library contains approved methods. Which recommendation best handles this candidate?",
    "options": [
      "Enter the method in the approved-practice library now, attach the approval finding, and let receiving sites decide whether the verified time saving justifies adopting it without delay.",
      "Report the approval gap and bounded performance evidence, then refer the candidate to the designated process owner for authorized evaluation before endorsing or replicating the method.",
      "Report only the approval gap and exclude the method from improvement review, because considering its possible benefits would weaken the requirement for authorization before use.",
      "Have the audit team retrospectively approve the change from the verified results, then recommend replication through the normal best-practice communication channel and monitor local outcomes."
    ],
    "answer": 1,
    "why": "The time reduction is useful, verified information, but it neither supplies the missing authorization nor establishes that every relevant quality outcome is satisfactory. The approval-control failure and the potential improvement should both remain visible. The process owner and authorized change decision makers can assess the method, its enablers and its broader effects before any endorsement or replication. The auditor reports and evaluates evidence within the agreed objectives rather than granting retrospective approval. Treating the method as an approved practice now would bypass the stated controls; excluding it from all improvement consideration would discard a potentially useful idea merely because its introduction was unauthorized. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., p. 203.</span>",
    "keyPoint": "Preserve evidence of a promising improvement without excusing an approval failure; use the authorized evaluation and change process before endorsing wider adoption.",
    "trap": "Assuming favorable results retrospectively authorize a shortcut, or assuming an unauthorized introduction makes the underlying idea permanently unsuitable for evaluation.",
    "distractors": {
      "0": "The library is for approved methods, and this one lacks approval and a broader effectiveness review. Attaching a finding does not confer approval or authorize receiving sites to bypass their controls.",
      "2": "Reporting the approval failure is necessary, but it does not require suppressing the verified performance information or excluding the method from controlled evaluation. The audit objectives expressly include useful practices.",
      "3": "The audit team is explicitly not authorized to approve method changes. Verified time savings do not transfer that authority or demonstrate all outcomes needed to support an approved change."
    }
  },
  {
    "qid": "cqa:set-2:q140",
    "set": 2,
    "batch": 14,
    "sub": "cqa-outlier-cause-and-population-treatment",
    "bok": "V.D.3",
    "cognitive": "Apply",
    "stem": "A study describes actual elapsed completion time for all service jobs completed during a month, including delays caused by equipment interruptions. Two unusually large entries are flagged for review. The exhibit gives the verified investigation results. An authorized analyst may correct transcription errors through the approved process, preserving the imported value, source, reason and approval trail. Which treatment should be applied before analysis?",
    "options": [
      "Exclude J28 and J63 from the analysis while retaining the imported file separately, because both flagged entries arose from exceptional conditions outside ordinary operating performance.",
      "Retain both imported values unchanged and describe their causes in the report, because preserving the original analysis values prevents an authorized correction from distorting the recorded results.",
      "Correct J28 to 14.4 minutes through the controlled process, but exclude J63 because its verified equipment interruption makes the elapsed time unrepresentative of routine work.",
      "Correct J28 to 14.4 minutes through the controlled process and retain J63 at 91.0 minutes, documenting each treatment against the verified evidence and defined study population."
    ],
    "answer": 3,
    "why": "The investigations establish different reasons for the two large entries. J28 is a transcription error: its authentic source gives 14.4 minutes, and the authorized correction can replace 144.0 in the analysis while retaining the original import and correction trail. The job itself is not removed. J63 is a genuine 91.0-minute completion that includes a verified equipment delay, which the study expressly includes. Its size and known cause do not make it outside that population. Flagging prompts investigation; it does not by itself authorize deletion. Transparent treatment preserves both record integrity and the stated purpose of the analysis without claiming that every unusual value has the same cause. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 102, 283.</span>",
    "keyPoint": "Distinguish a verified recording error from a genuine in-scope extreme: correct the error traceably and retain valid observations required by the analysis purpose.",
    "trap": "Treating an unusual value or any known cause as sufficient reason for exclusion, or retaining a proven transcription error in the analysis merely to preserve the original record.",
    "distractors": {
      "0": "J28 can be corrected from its verified original value, and J63 is explicitly within the study population. Excluding both loses valid job information and changes the defined analysis without justification.",
      "1": "Record integrity is preserved by retaining the original import and documenting the authorized correction. Leaving a proven erroneous analysis value unchanged would misstate J28's actual completion time.",
      "2": "The correction for J28 is appropriate, but the study expressly includes equipment-interruption delays. A known cause for J63 does not justify excluding a valid observation that meets the inclusion rule."
    },
    "chart": {
      "type": "data-table",
      "title": "Verified review of two flagged completion-time entries",
      "columns": [
        "Job",
        "Imported analysis value",
        "Verified source and investigation"
      ],
      "rows": [
        [
          "J28",
          "144.0 minutes",
          "The authenticated original record gives 14.4 minutes. Comparison with the import trace confirms that its decimal point was lost during transcription."
        ],
        [
          "J63",
          "91.0 minutes",
          "The original record and independent timestamps confirm 91.0 minutes, including an equipment interruption. This completed job meets the study's inclusion rule."
        ]
      ]
    }
  }
];
})(typeof window !== 'undefined' ? window : globalThis);
