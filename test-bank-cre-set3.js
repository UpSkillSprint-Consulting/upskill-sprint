(function(global){
  'use strict';
  global.CRE_SET3=[
  {
    "sub": "cre-lead",
    "stem": "A pump OEM's finance lead asks why reliability work should be funded before tooling is released. Which statement best describes the value of that work?",
    "options": [
      "It replaces quality inspection by guaranteeing zero field failures.",
      "It is useful only after warranty data exist, because predictions before launch are not decision-grade.",
      "It improves the chance of meeting life and cost objectives by finding failure drivers while design changes are still inexpensive.",
      "It mainly documents compliance after the design is frozen."
    ],
    "answer": 2,
    "why": "Reliability work earns its cost by changing the design while changes are still cheap, and by protecting life, safety, and support cost. It does not promise zero failures, and waiting for warranty data or a frozen design is the late-engagement failure mode. <b>C. It improves the chance of meeting life and cost objectives by finding failure drivers while design changes are still inexpensive.</b>",
    "set": 3,
    "qid": "cre:set-3:001",
    "bok": "I.A.1",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-lead",
    "stem": "A new valve meets every drawing specification at incoming inspection. After six months in a salt atmosphere, units from the same population begin to seize. Which statement is the best distinction?",
    "options": [
      "Quality describes conformance at the start of life. Reliability describes whether that performance holds over time and conditions. Safety still depends on the consequence of seizure.",
      "The seizure is only a quality problem, because the parts met specification at time zero, so reliability methods do not apply.",
      "Reliability and quality are the same metric. Only the name changes when a time axis is added.",
      "High initial quality means the item is safe, so a separate safety analysis is unnecessary."
    ],
    "answer": 0,
    "why": "Quality is how well the item performs its function initially. Reliability is how well that performance is maintained over time and use conditions. Higher quality raises the chance of a safe, reliable item, but it does not replace a consequence-based safety judgment. <b>A. Quality describes conformance at the start of life. Reliability describes whether that performance holds over time and conditions. Safety still depends on the consequence of seizure.</b>",
    "set": 3,
    "qid": "cre:set-3:002",
    "bok": "I.A.2",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-lead",
    "stem": "At a design gate, marketing wants to delete a redundant sensor to save unit cost. The reliability analysis shows the sensor is what prevents a hazardous single-point failure. What is the best leadership action?",
    "options": [
      "Accept the deletion. The champion's job is to protect the schedule.",
      "Stay silent unless a later field failure proves the analysis.",
      "Leave the gate so the decision cannot be attributed to reliability.",
      "State the safety and reliability consequence in the terms the decision makers use, and keep the trade visible before the gate closes."
    ],
    "answer": 3,
    "why": "The reliability champion influences the decision and keeps the cross-functional trade visible. Protecting schedule by going silent, or waiting for a field injury to prove the point, abandons that role. <b>D. State the safety and reliability consequence in the terms the decision makers use, and keep the trade visible before the gate closes.</b>",
    "set": 3,
    "qid": "cre:set-3:003",
    "bok": "I.A.3",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-lead",
    "stem": "A life test is run only at a steady 25°C laboratory ambient. Field returns later show the same failure only after a cleaning solvent is left on the housing, a condition the lab never applied. What did the reliability effort miss?",
    "options": [
      "Sample size. More units at 25°C would have produced the solvent failure.",
      "Use conditions. The design review tested a stress the customer does not apply and missed the stress that drives field risk.",
      "The warranty clock. Reliability predictions should be withheld until the warranty period ends.",
      "Supplier quality. Field failures of this kind are component defects by definition."
    ],
    "answer": 1,
    "why": "If use conditions are wrong, the program either misses real failures or spends the test on failures the field will never see. More of the wrong stress does not fix that. <b>B. Use conditions. The design review tested a stress the customer does not apply and missed the stress that drives field risk.</b>",
    "set": 3,
    "qid": "cre:set-3:004",
    "bok": "I.A.4",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-lead",
    "stem": "A reliability qualification is planned with the activity network below. Durations are in working days. What is the critical-path duration, and which activity has total slack?",
    "options": [
      "18 days, and B has total slack.",
      "22 days, and C has 4 days of total slack.",
      "22 days, and C is on the critical path.",
      "26 days, and E has total slack."
    ],
    "answer": 1,
    "why": "The two finish paths are \\(5+8+6+3=22\\) days and \\(5+4+6+3=18\\) days. Project duration is the longest path. Total slack is \\(\\mathrm{LS}-\\mathrm{ES}=\\mathrm{LF}-\\mathrm{EF}\\). Activity C finishes at day 9 and D cannot start until day 13, so \\(13-9=4\\) days of total slack. E is on the critical path and has none. <b>B. 22 days, and C has 4 days of total slack.</b>",
    "set": 3,
    "qid": "cre:set-3:005",
    "bok": "I.A.5",
    "cognitive": "Apply",
    "chart": {
      "type": "activity-network",
      "title": "Qualification network",
      "altText": "Activity network. A takes 5 days and splits to B, 8 days, and C, 4 days. B and C both finish into D, 6 days, then E, 3 days.",
      "durationUnit": "days",
      "nodes": {
        "A": {
          "col": 0,
          "row": 0.5,
          "dur": 5
        },
        "B": {
          "col": 1,
          "row": 0,
          "dur": 8
        },
        "C": {
          "col": 1,
          "row": 1,
          "dur": 4
        },
        "D": {
          "col": 2,
          "row": 0.5,
          "dur": 6
        },
        "E": {
          "col": 3,
          "row": 0.5,
          "dur": 3
        }
      },
      "edges": [
        [
          "A",
          "B"
        ],
        [
          "A",
          "C"
        ],
        [
          "B",
          "D"
        ],
        [
          "C",
          "D"
        ],
        [
          "D",
          "E"
        ]
      ]
    }
  },
  {
    "sub": "cre-lead",
    "stem": "An industry standard requires a 1,000-hour constant-temperature test for certification. The customer's actual duty cycle is 10 percent on-time, with a thermal cycle every day. A unit passes the standard test. What is the sound use of that result?",
    "options": [
      "Treat the pass as proof that the duty cycle is reliable.",
      "Discard the standard. Only field data can support a design decision.",
      "Use the pass to satisfy certification, and still judge life under the real duty cycle before accepting the design.",
      "Replace the duty-cycle analysis with the standard, because a published standard always bounds real use."
    ],
    "answer": 2,
    "why": "A standard is a constraint on the decision, not a substitute for the use profile. Passing a constant-temperature test says nothing by itself about daily thermal cycling at a 10 percent duty cycle. Ignoring the standard is also wrong if certification requires it. <b>C. Use the pass to satisfy certification, and still judge life under the real duty cycle before accepting the design.</b>",
    "set": 3,
    "qid": "cre:set-3:006",
    "bok": "I.A.6",
    "cognitive": "Analyze"
  },
  {
    "sub": "cre-lead",
    "stem": "A reliability engineer is asked to sign a customer report. Two of eight life-test units failed the agreed requirement. The draft shows only the six successes and states that all tested units passed. The engineer did not run the test. What is the appropriate action?",
    "options": [
      "Sign. The engineer did not generate the data, and refusing may cost the account.",
      "Sign after the two failures are labeled setup errors, even though no setup evidence exists.",
      "Refuse to sign a report that hides failures, and require the full result to be stated before any recommendation goes out.",
      "Sign, and record the objection only in a personal notebook. The duty of candor applies only to public talks."
    ],
    "answer": 2,
    "why": "The obligation is to be truthful about the result, including bad news, whether or not the engineer personally ran the test. Relabeling failures without evidence, or hiding the objection, is a misrepresentation. <b>C. Refuse to sign a report that hides failures, and require the full result to be stated before any recommendation goes out.</b>",
    "set": 3,
    "qid": "cre:set-3:007",
    "bok": "I.A.7",
    "cognitive": "Evaluate"
  },
  {
    "sub": "cre-lead",
    "stem": "A sole-source board supplier will provide a certificate of conformance and incoming electrical readings. It will not notify the customer of process changes, and it will not share field-failure summaries. Which conclusion is the strongest?",
    "options": [
      "The missing change notification and failure history leave wear-out risk and process drift invisible to the customer's reliability program.",
      "The certificate of conformance is sufficient, because conformance implies reliability over life.",
      "Incoming electrical readings are enough, because early-life failures dominate shipped-product risk.",
      "Incoming inspection should be stopped. The certificate replaces both process control and field feedback."
    ],
    "answer": 0,
    "why": "A conformance certificate and a time-zero electrical check do not show how the item fails over life, and they do not warn the customer when the supplier's process moves. Change notification and failure history are what make a supplier assessment usable. <b>A. The missing change notification and failure history leave wear-out risk and process drift invisible to the customer's reliability program.</b>",
    "set": 3,
    "qid": "cre:set-3:008",
    "bok": "I.A.8",
    "cognitive": "Analyze"
  },
  {
    "sub": "cre-lead",
    "stem": "Use the shift record below. Planned production time is shift length minus breaks, and actual operating time is planned production time minus maintenance downtime.\n\\[\n\\mathrm{OEE}=\\text{Availability}\\times\\text{Performance}\\times\\text{Quality}\n\\]\nwhere\n\\[\n\\text{Availability}=\\frac{\\text{actual operating time}}{\\text{planned production time}},\\quad\n\\text{Performance}=\\frac{\\text{pieces produced}/\\text{actual operating time}}{\\text{designed rate}},\\quad\n\\text{Quality}=\\frac{\\text{good pieces}}{\\text{pieces produced}}.\n\\]\nWhat is OEE, to one decimal place?",
    "options": [
      "95.0%",
      "90.0%",
      "86.4%",
      "73.9%"
    ],
    "answer": 3,
    "why": "Planned time is \\(480-40=440\\) min and operating time is \\(440-60=380\\) min. Ideal output is \\(120\\times(380/60)=760\\) pieces.\n\\[\n\\text{Availability}=\\frac{380}{440}=0.864,\\quad\n\\text{Performance}=\\frac{684}{760}=0.900,\\quad\n\\text{Quality}=\\frac{650}{684}=0.950.\n\\]\n\\[\n\\mathrm{OEE}=0.864\\times 0.900\\times 0.950=0.739\\ (73.9\\%).\n\\]\nThe other choices are the three factors reported alone. <b>D. 73.9%</b>",
    "set": 3,
    "qid": "cre:set-3:009",
    "bok": "I.A.9",
    "cognitive": "Apply",
    "chart": {
      "type": "data-table",
      "title": "Shift record",
      "altText": "Shift length 480 minutes. Breaks and meal 40 minutes. Maintenance downtime 60 minutes. Designed rate 120 pieces per hour. Pieces produced 684. Good pieces 650.",
      "columns": [
        "Input",
        "Value"
      ],
      "rows": [
        [
          "Shift length",
          "480 min"
        ],
        [
          "Breaks and meal",
          "40 min"
        ],
        [
          "Maintenance downtime",
          "60 min"
        ],
        [
          "Designed rate",
          "120 pieces/hour"
        ],
        [
          "Pieces produced",
          "684"
        ],
        [
          "Good pieces",
          "650"
        ]
      ]
    }
  },
  {
    "sub": "cre-lead",
    "stem": "Cumulative failure rate is plotted against cumulative test time on log-log paper. The points below fall on a straight line. The Duane model is\n\\[\n\\log_{10}\\!\\left(\\frac{n(T)}{T}\\right)=-\\alpha\\log_{10}(T)+b.\n\\]\nWhat is \\(\\alpha\\), and what does it mean?",
    "options": [
      "\\(\\alpha=0\\). There is no reliability growth.",
      "\\(\\alpha=0.50\\). Reliability is improving. Failures are occurring farther apart.",
      "\\(\\alpha=-0.50\\). Reliability is deteriorating because the plotted slope is negative.",
      "\\(\\alpha=1\\). The number of failures no longer depends on how long the test runs."
    ],
    "answer": 1,
    "why": "Each time \\(T\\) is multiplied by 4, \\(n(T)\\) doubles and the cumulative failure rate is cut in half. The slope of \\(\\log_{10}(\\text{rate})\\) versus \\(\\log_{10}(T)\\) is\n\\[\n\\frac{-\\log_{10}2}{\\log_{10}4}=-0.50.\n\\]\nIn the Duane model that slope equals \\(-\\alpha\\), so \\(\\alpha=0.50\\). A positive \\(\\alpha\\) below 1 means the fixes are spreading failures farther apart. A negative plotted slope is not evidence of deterioration. <b>B. \\(\\alpha=0.50\\). Reliability is improving. Failures are occurring farther apart.</b>",
    "set": 3,
    "qid": "cre:set-3:010",
    "bok": "I.A.9",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Duane growth points",
      "altText": "At 100 hours, 20 cumulative failures, rate 0.200 per hour. At 400 hours, 40 failures, rate 0.100. At 1,600 hours, 80 failures, rate 0.050. The log-log plot is a straight line with slope −0.50.",
      "columns": [
        "Cumulative time T (h)",
        "Cumulative failures n(T)",
        "Cumulative failure rate n(T)/T"
      ],
      "rows": [
        [
          "100",
          "20",
          "0.200"
        ],
        [
          "400",
          "40",
          "0.100"
        ],
        [
          "1600",
          "80",
          "0.050"
        ]
      ]
    }
  }
];
})(typeof window!=='undefined'?window:globalThis);
