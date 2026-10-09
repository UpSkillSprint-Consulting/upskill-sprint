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
    "stem": "Use the shift record below. Planned production time is shift length minus breaks, and actual operating time is planned production time minus maintenance downtime.\n\\[\n\\mathrm{OEE}=\\text{Availability}\\times\\text{Performance}\\times\\text{Quality}\n\\]\nwhere\n\\[\n\\text{Availability}=\\frac{\\text{actual operating time}}{\\text{planned production time}}\n\\]\n\\[\n\\text{Performance}=\\frac{\\text{pieces produced}}{\\text{actual operating time}\\times\\text{designed rate}}\n\\]\n\\[\n\\text{Quality}=\\frac{\\text{good pieces}}{\\text{pieces produced}}\n\\]\nWhat is OEE, to one decimal place?",
    "options": [
      "95.0%",
      "90.0%",
      "86.4%",
      "73.9%"
    ],
    "answer": 3,
    "why": "Planned time is \\(480-40=440\\) min and operating time is \\(440-60=380\\) min. Ideal output is \\(120\\times(380/60)=760\\) pieces.\n\\[\n\\text{Availability}=\\frac{380}{440}=0.864\n\\]\n\\[\n\\text{Performance}=\\frac{684}{760}=0.900\n\\]\n\\[\n\\text{Quality}=\\frac{650}{684}=0.950\n\\]\n\\[\n\\mathrm{OEE}=0.864\\times 0.900\\times 0.950=0.739\\ (73.9\\%).\n\\]\nThe other choices are the three factors reported alone. <b>D. 73.9%</b>",
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
  },
  {
    "sub": "cre-lead",
    "stem": "A repairable fleet log is below. Every restoration followed a failure. A critical failure is a restoration that also caused loss of the mission. Operating time is \\(T\\), the number of restorations is \\(n\\), and the number of critical failures is \\(n_c\\).\n\\[\n\\mathrm{MTBF}=\\frac{T}{n}\n\\]\n\\[\n\\mathrm{MTBCF}=\\frac{T}{n_c}\n\\]\nWhat is the mean time between critical failures?",
    "options": [
      "300 hours",
      "400 hours",
      "1,200 hours",
      "4,800 hours"
    ],
    "answer": 2,
    "why": "Critical failures are the mission losses, not every restoration.\n\\[\n\\mathrm{MTBF}=\\frac{4800}{16}=300\\ \\mathrm{h}\n\\]\n\\[\n\\mathrm{MTBCF}=\\frac{4800}{4}=1200\\ \\mathrm{h}\n\\]\n400 hours uses only the 12 restorations that did not lose the mission. 4,800 hours is the operating time with no failure count in the denominator. <b>C. 1,200 hours</b>",
    "set": 3,
    "qid": "cre:set-3:011",
    "bok": "I.B.1",
    "cognitive": "Apply",
    "chart": {
      "type": "data-table",
      "title": "Fleet operating log",
      "altText": "Operating time 4,800 hours. Restorations 16. Critical failures, meaning mission loss, 4.",
      "columns": [
        "Quantity",
        "Value"
      ],
      "rows": [
        [
          "Operating time T",
          "4,800 h"
        ],
        [
          "Restorations n",
          "16"
        ],
        [
          "Critical failures n_c",
          "4"
        ]
      ]
    }
  },
  {
    "sub": "cre-lead",
    "stem": "A repairable compressor was required for the whole period in the record. \\(T_u\\) is uptime, \\(T_c\\) is active corrective repair, \\(T_p\\) is active preventive maintenance, and \\(T_d\\) is logistics plus administrative delay.\n\\[\nA_i=\\frac{T_u}{T_u+T_c}\n\\]\n\\[\nA_a=\\frac{T_u}{T_u+T_c+T_p}\n\\]\n\\[\nA_o=\\frac{T_u}{T_u+T_c+T_p+T_d}\n\\]\nWhat is the achieved availability, in percent to two decimal places?",
    "options": [
      "95.51%",
      "93.41%",
      "85.00%",
      "86.73%"
    ],
    "answer": 1,
    "why": "Achieved availability keeps active preventive time and excludes delay.\n\\[\nA_i=\\frac{1700}{1700+80}=0.9551\n\\]\n\\[\nA_a=\\frac{1700}{1700+80+40}=0.9341\n\\]\n\\[\nA_o=\\frac{1700}{2000}=0.8500\n\\]\n95.51% is inherent availability. 85.00% is operational availability. 86.73% drops preventive time but keeps the delay. <b>B. 93.41%</b>",
    "set": 3,
    "qid": "cre:set-3:012",
    "bok": "I.B.1",
    "cognitive": "Apply",
    "chart": {
      "type": "data-table",
      "title": "Compressor time record",
      "altText": "Uptime 1,700 hours. Active corrective repair 80 hours. Active preventive maintenance 40 hours. Logistics and administrative delay 180 hours. The four categories sum to the 2,000-hour required period.",
      "columns": [
        "Time category",
        "Hours"
      ],
      "rows": [
        [
          "Uptime",
          "1,700"
        ],
        [
          "Active corrective repair",
          "80"
        ],
        [
          "Active preventive maintenance",
          "40"
        ],
        [
          "Logistics and administrative delay",
          "180"
        ]
      ]
    }
  },
  {
    "sub": "cre-lead",
    "stem": "The life-test summary below estimates the hazard in each age interval. Failed units are removed. Exposure is the unit-time lived in that interval. Which statement best applies the bathtub curve to these results?",
    "options": [
      "From 100 h to 500 h the hazard is flat and lowest. Replacing a survivor only to make it younger does not lower that hazard.",
      "From 0 h to 100 h is useful life, so age replacement should begin at time zero.",
      "From 500 h to 800 h is useful life, because the hazard has returned to the early-life value.",
      "The hazard rises across the whole test, so every survivor should be replaced at 100 h."
    ],
    "answer": 0,
    "why": "The early interval has a high hazard, the middle interval is flat at the lowest value, and the last interval rises again. That is infant mortality, useful life, then wear-out. Inside the flat interval, age by itself does not change the hazard, so replacement only to reduce age is not supported. The last interval is not useful life merely because its hazard matches the first interval. <b>A. From 100 h to 500 h the hazard is flat and lowest. Replacing a survivor only to make it younger does not lower that hazard.</b>",
    "set": 3,
    "qid": "cre:set-3:013",
    "bok": "I.B.1",
    "cognitive": "Apply",
    "chart": {
      "type": "data-table",
      "title": "Hazard by age interval",
      "altText": "From 0 to 100 hours, 20 failures in 1,000 unit-hours, hazard 0.020 per hour. From 100 to 500 hours, 8 failures in 4,000 unit-hours, hazard 0.002 per hour. From 500 to 800 hours, 24 failures in 1,200 unit-hours, hazard 0.020 per hour.",
      "columns": [
        "Age interval (h)",
        "Failures",
        "Exposure (unit-h)",
        "Hazard (per h)"
      ],
      "rows": [
        [
          "0–100",
          "20",
          "1,000",
          "0.020"
        ],
        [
          "100–500",
          "8",
          "4,000",
          "0.002"
        ],
        [
          "500–800",
          "24",
          "1,200",
          "0.020"
        ]
      ]
    }
  },
  {
    "sub": "cre-lead",
    "stem": "A battery life requirement was copied from a 25°C laboratory specification. The customer's use profile is a daily outdoor cycle from −10°C to 45°C, and its environmental, social, and governance policy limits unplanned service trips. Which statement is the best use of those drivers?",
    "options": [
      "Keep the laboratory specification. A controlled test is a stricter requirement than field use.",
      "Raise the life number by 10% and leave the test temperature at 25°C. The percentage increase covers the climate.",
      "Treat the governance policy as a purchasing slogan. It does not change a reliability requirement.",
      "Restate the requirement for the outdoor cycle and for the limit on unplanned trips. The laboratory temperature is not the use condition."
    ],
    "answer": 3,
    "why": "Customer use, safety, liability, regulation, and governance policy are drivers of the requirement. A laboratory temperature that the product will not see is not a substitute for the use profile, and a round-number increase does not represent that profile. The service-trip limit is a real constraint on unplanned maintenance, not a slogan. <b>D. Restate the requirement for the outdoor cycle and for the limit on unplanned trips. The laboratory temperature is not the use condition.</b>",
    "set": 3,
    "qid": "cre:set-3:014",
    "bok": "I.B.2",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-lead",
    "stem": "A pump-trip CAPA was proposed for closure using the record below. Which evaluation is best?",
    "options": [
      "Effective. The monthly trip count fell after the firmware was installed on the laboratory unit.",
      "Not effective yet. The closure count changed the failure definition, and the action was not confirmed on the production configuration.",
      "Effective. A firmware change is preventive, so a before-and-after count is unnecessary.",
      "Cannot be judged until the count rises for three more months. A changed definition does not affect effectiveness."
    ],
    "answer": 1,
    "why": "Effectiveness has to be judged against the failure definition used when the action was opened, on the configuration that is actually shipped. A lower count under a narrower definition, checked only on a laboratory unit, does not show that the action worked. Waiting for the count to rise adds delay without repairing that evidence. <b>B. Not effective yet. The closure count changed the failure definition, and the action was not confirmed on the production configuration.</b>",
    "set": 3,
    "qid": "cre:set-3:015",
    "bok": "I.B.3",
    "cognitive": "Evaluate",
    "chart": {
      "type": "data-table",
      "title": "CAPA closure record",
      "altText": "The action was opened on any trip that removes the pump from service. Firmware 4.2 was installed on the laboratory unit. Closure uses trips longer than 10 minutes. Production is still on firmware 4.1.",
      "columns": [
        "Item",
        "What was recorded"
      ],
      "rows": [
        [
          "Definition at opening",
          "Any trip that removes the pump from service"
        ],
        [
          "Action installed",
          "Firmware 4.2 on the laboratory unit"
        ],
        [
          "Closure count",
          "Trips longer than 10 minutes"
        ],
        [
          "Configuration checked",
          "Laboratory unit only; production remains on 4.1"
        ]
      ]
    }
  },
  {
    "sub": "cre-lead",
    "stem": "The investigation record below was confirmed on three units built to the same instruction. Which conclusion is best supported?",
    "options": [
      "The root cause is operator error, because a person assembled each unit.",
      "The supported cause is a missing assembly check that let a blocked cooling passage reach test.",
      "The seal material is defective, because the lip wore through.",
      "Replace the seal and close the file. The trip itself has been contained."
    ],
    "answer": 1,
    "why": "The chain does not stop at the worn seal or at the person who assembled the unit. The same missing passage check explains the blocked cooling, the high shaft temperature, the worn lip, and the trip, and it was confirmed on three units. Replacing the seal removes the damaged part. It does not remove the cause the record supports. <b>B. The supported cause is a missing assembly check that let a blocked cooling passage reach test.</b>",
    "set": 3,
    "qid": "cre:set-3:016",
    "bok": "I.B.4",
    "cognitive": "Evaluate",
    "chart": {
      "type": "data-table",
      "title": "Confirmed 5-why record",
      "altText": "The pump tripped because the seal leaked. The lip was worn. The shaft ran above the seal temperature limit. The cooling passage was blocked. The assembly instruction did not require a passage check. The same blocked passage was found on three units built to that instruction.",
      "columns": [
        "Step",
        "Confirmed statement"
      ],
      "rows": [
        [
          "1",
          "The pump tripped because seal leakage exceeded the trip limit."
        ],
        [
          "2",
          "The seal lip was worn through."
        ],
        [
          "3",
          "The shaft ran above the seal temperature limit."
        ],
        [
          "4",
          "The cooling passage was blocked."
        ],
        [
          "5",
          "The assembly instruction did not require a passage check."
        ]
      ]
    }
  },
  {
    "sub": "cre-lead",
    "stem": "A firmware defect can be corrected in one hour during design review. The same defect, if it ships, requires a field update, requalification, and unscheduled downtime. Which statement best applies phase containment?",
    "options": [
      "Finding that defect in design review avoids the field cost. The defect itself does not become cheaper to correct after release.",
      "The growth stage is the cheapest place to find it, because more units are available for comparison.",
      "Decline is the right stage for the fix, because few units remain in service.",
      "A one-hour design fix and a field update have the same reliability cost. Only the labor rate changes."
    ],
    "answer": 0,
    "why": "Lifecycle cost includes scheduled and unscheduled maintenance, life, and the phase in which a defect is contained. The same firmware defect is more expensive after release because of the update, the requalification, and the downtime. More units in the field, or fewer units late in life, do not make that escape cheaper. <b>A. Finding that defect in design review avoids the field cost. The defect itself does not become cheaper to correct after release.</b>",
    "set": 3,
    "qid": "cre:set-3:017",
    "bok": "I.B.5",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-lead",
    "stem": "Annual cost uses the inputs below. \\(C_{\\mathrm{kit}}\\) is the spare-kit cost, \\(c_d\\) is the cost of downtime, \\(T_p\\) is planned downtime, and \\(T_u\\) is unplanned downtime.\n\\[\nC=C_{\\mathrm{kit}}+c_d(T_p+T_u)\n\\]\nWhich strategy has the lower annual cost, and what is that cost?",
    "options": [
      "Preventive maintenance, $64,000",
      "Preventive maintenance, $72,000",
      "Run to failure, $160,000",
      "Preventive maintenance, $48,000"
    ],
    "answer": 1,
    "why": "Charge the kit and both kinds of downtime.\n\\[\nC_{\\mathrm{PM}}=8000+2000(20+12)=72000\n\\]\n\\[\nC_{\\mathrm{RTF}}=2000(80)=160000\n\\]\n$64,000 drops the kit. $48,000 drops the unplanned hours. Run to failure costs more than preventive maintenance. <b>B. Preventive maintenance, $72,000</b>",
    "set": 3,
    "qid": "cre:set-3:018",
    "bok": "I.B.6",
    "cognitive": "Understand",
    "chart": {
      "type": "data-table",
      "title": "Annual maintenance comparison",
      "altText": "Downtime costs $2,000 per hour. Preventive maintenance has an $8,000 spare kit, 20 hours planned downtime, and 2 failures of 6 hours each. Run to failure has no kit, no planned downtime, and 8 failures of 10 hours each.",
      "columns": [
        "Input",
        "Preventive maintenance",
        "Run to failure"
      ],
      "rows": [
        [
          "Spare kit",
          "$8,000",
          "$0"
        ],
        [
          "Planned downtime",
          "20 h",
          "0 h"
        ],
        [
          "Unplanned downtime",
          "2 × 6 h = 12 h",
          "8 × 10 h = 80 h"
        ],
        [
          "Downtime cost",
          "$2,000/h",
          "$2,000/h"
        ]
      ]
    }
  },
  {
    "sub": "cre-lead",
    "stem": "A field program adds $40,000 to the warranty reserve. After one mission-critical outage, a hospital also removes the supplier from its approved bid list. Which statement best describes the cost of poor reliability?",
    "options": [
      "The cost is $40,000. A bid-list decision is a purchasing preference, not a reliability cost.",
      "The cost is zero until a second outage occurs. One event is an anecdote.",
      "The cost includes the warranty reserve and the loss of credibility and future business.",
      "The cost is the hospital's downtime only. The warranty reserve is an accounting entry, not a reliability cost."
    ],
    "answer": 2,
    "why": "Poor reliability creates financial cost and non-financial cost. The reserve is real money. Removal from the bid list is a loss of credibility and of future business, which the body of knowledge includes with availability and reputation. One confirmed mission-critical outage is enough to count. It does not have to be repeated before it is a cost. <b>C. The cost includes the warranty reserve and the loss of credibility and future business.</b>",
    "set": 3,
    "qid": "cre:set-3:019",
    "bok": "I.B.7",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-lead",
    "stem": "A program cuts reliability-test time and unit cost, and it still claims the original demonstrated life. No requirement, use condition, or test stress has changed. Which statement best applies the cost, time, and quality relationship?",
    "options": [
      "The cut is acceptable. Reliability sits outside cost and schedule, so those two can fall without changing the demonstrated life.",
      "The cut improves all three corners at once. Less test time is evidence of a more reliable design.",
      "Raise the life claim by the same percentage as the cost cut. The triangle requires the claim to move with cost.",
      "Time and cost were reduced while the life claim was held constant. The demonstrated life is no longer supported by the test that was removed."
    ],
    "answer": 3,
    "why": "Cost, time, and the achieved reliability result constrain one another. Removing test time and cost while keeping the same life claim does not create new evidence. It leaves the claim unsupported. Reliability is not a fourth item sitting outside that trade, and a shorter test is not itself proof of a better design. <b>D. Time and cost were reduced while the life claim was held constant. The demonstrated life is no longer supported by the test that was removed.</b>",
    "set": 3,
    "qid": "cre:set-3:020",
    "bok": "I.C.1",
    "cognitive": "Understand"
  }
];
})(typeof window!=='undefined'?window:globalThis);
