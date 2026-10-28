/*
 * ASQ CQA Exam Set 2 — original practice questions.
 * Batch 1: Q001–Q010. Planned bank: 150 questions, released 10 at a time.
 * 2026 BoK target counts: I 37 / II 45 / III 30 / IV 23 / V 15.
 * Batch 1 counts: I 2 / II 3 / III 2 / IV 2 / V 1.
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
    "why": "The verified sample identifies a timing failure for A19: dispatch occurred before normal release and no approved concession existed. The sample does not yet establish the extent or cause. Additional transactions from relevant shifts and users, together with examination of the dispatch control, can show whether the condition is isolated, recurring, or supported by a broader control weakness. A18 must be distinguished from A19 because its approved concession existed before dispatch. Revision counts, one selected observation, and eventual product acceptance do not adequately establish the reach of the authorization problem. Further sampling still requires a stated basis and appropriate limits on any population conclusion. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 105–111.</span>",
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
    "cognitive": "Create",
    "stem": "Release-control case. Procedure RQ-04, section 6, requires either completed test results plus normal Quality release, or a written customer concession approved by Quality, before dispatch. The exhibit shows four sampled shipments from one day; all times use the same clock. The auditor has verified the records and confirmed that no additional authorizations exist. Which finding statement most accurately combines the applicable requirement, evidence, and gap?",
    "options": [
      "RQ-04 section 6 was not met for A18 and A19: both were dispatched before normal Quality release, demonstrating two unauthorized shipments in the sample.",
      "RQ-04 section 6 was not met for A19: dispatch at 09:40 preceded test results at 09:55 and Quality release at 10:10, with no approved concession.",
      "RQ-04 section 6 was not met for A19: dispatch at 09:40 preceded Quality release at 10:10 because the shipping clerk had not been adequately trained.",
      "RQ-04 section 6 was not met for A19: the shipment preceded Quality release, establishing that 25% of the supplier's total shipments are unauthorized."
    ],
    "answer": 1,
    "why": "A useful finding identifies the criterion, traceable evidence, and the precise way the requirement was not met. For A19, the dispatch record shows 09:40, while the results and normal release occurred later, and the auditor confirmed that no alternative authorization existed. Those facts demonstrate the stated release-control failure. A18 followed the permitted concession route, so it cannot be counted as an unauthorized shipment merely because normal release occurred later. Nothing establishes deficient training as the cause, and four sampled shipments from one day do not establish the unauthorized-shipment rate for the supplier's entire operation. The finding should preserve those limits while clearly documenting the confirmed gap. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 122; 107–111.</span>",
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
      "Summarize impacts, link each finding to its supporting evidence, and ask the process owners to explain their follow-up responsibilities."
    ],
    "answer": 3,
    "why": "Effective audit communication adapts the level of detail to the audience, preserves access to the factual basis, and checks whether the message was understood. A concise explanation of the delivery implications addresses the director's needs, while traceable supporting evidence and explicit follow-up address the process owners' needs. Asking the owners to explain their responsibilities provides feedback that can reveal misunderstandings before the meeting ends. The report remains the detailed written record; receipt of that record alone does not demonstrate understanding. <span class=\"tb-source-ref\">Source: The ASQ Certified Quality Auditor Handbook, 5th ed., pp. 159, 164–165.</span>",
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
  }
];
})(typeof window !== 'undefined' ? window : globalThis);

