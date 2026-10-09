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
  },
  {
    "sub": "cre-lead",
    "stem": "Field returns of a valve are high. The team has not written what \"leak\" means, and it has no agreed way to measure leak rate. The first proposal is to change the seal compound. Which statement best aligns the work with DMAIC?",
    "options": [
      "Define the leak and how it will be measured before a seal change is treated as the improvement.",
      "Skip to Improve. A physical change is the only step that counts as Six Sigma.",
      "Start at Control, so the new seal is locked in before the current leak is described.",
      "Use DMAIC only after the product is in decline. Reliability work during launch is outside Lean and Six Sigma."
    ],
    "answer": 0,
    "why": "DMAIC starts by defining the problem and the measurement. Changing the seal before the defect and its measure are agreed mixes an untested fix with Improve. Control cannot lock in a change that has not been defined or shown to work, and reliability problems are not reserved for the end of the life cycle. <b>A. Define the leak and how it will be measured before a seal change is treated as the improvement.</b>",
    "set": 3,
    "qid": "cre:set-3:021",
    "bok": "I.C.2",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-lead",
    "stem": "Each of two controllers meets its own reliability allocation. The system still misses commands because the two controllers use different timing limits, and that interface was never specified. Which statement is best?",
    "options": [
      "The allocations were met, so the system requirement is met.",
      "Add the two controller failure probabilities. The interface cannot create a system failure.",
      "Component allocations do not cover the interaction. The missing timing limit is a systems-integration failure.",
      "Reliability engineering stops at the component. Interface timing belongs only to the software schedule."
    ],
    "answer": 2,
    "why": "Systems engineering treats the interactions among components as part of the system. Meeting two separate allocations does not show that the controllers work together. A timing mismatch is a system failure even when neither controller has failed its own part specification. <b>C. Component allocations do not cover the interaction. The missing timing limit is a systems-integration failure.</b>",
    "set": 3,
    "qid": "cre:set-3:022",
    "bok": "I.C.3",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-risk",
    "stem": "A valve risk register lists only part failures. The parameter diagram information below was available and was not used. Which evaluation is best?",
    "options": [
      "The register is complete. Part failures are the only risks a reliability program ranks.",
      "The register is not complete. The noise factors and the shut-valve error state are identified risks and were left out.",
      "Add the noise factors only after the first field failure. A parameter diagram is not used to find risks.",
      "Drop the 12 V command. An intended input is a risk and should be ranked above the error state."
    ],
    "answer": 1,
    "why": "A parameter diagram and the use case are risk-identification tools. Road salt, the hot soak, and the valve staying shut are risks to performance and safety. Leaving them off the register is not justified by waiting for a field failure, and the intended 12 V command is an input, not itself a risk. <b>B. The register is not complete. The noise factors and the shut-valve error state are identified risks and were left out.</b>",
    "set": 3,
    "qid": "cre:set-3:023",
    "bok": "II.A.1",
    "cognitive": "Evaluate",
    "chart": {
      "type": "data-table",
      "title": "Parameter diagram notes",
      "altText": "Intended input is a 12 V command. Intended output is the valve opens. Noise factors are road salt and a 40°C soak, and they were not entered in the register. The error state is the valve stays shut, and it was not entered.",
      "columns": [
        "Element",
        "Record"
      ],
      "rows": [
        [
          "Input",
          "12 V command"
        ],
        [
          "Intended output",
          "Valve opens"
        ],
        [
          "Noise factors",
          "Road salt; 40°C soak"
        ],
        [
          "Error state",
          "Valve stays shut"
        ]
      ]
    }
  },
  {
    "sub": "cre-risk",
    "stem": "Three risks are scored on the same 1-to-5 scales. Likelihood is \\(L\\) and consequence is \\(C\\).\n\\[\nS = L \\times C\n\\]\nWhich risk has the highest score, and what is that score?",
    "options": [
      "Schedule delay, 7",
      "Process noise, 4",
      "Seal leak, 20",
      "Seal leak, 9"
    ],
    "answer": 2,
    "why": "Multiply. Do not add.\n\\[\nS_{\\mathrm{leak}} = 4 \\times 5 = 20\n\\]\n\\[\nS_{\\mathrm{delay}} = 5 \\times 2 = 10\n\\]\n\\[\nS_{\\mathrm{noise}} = 2 \\times 2 = 4\n\\]\nThe delay has the highest likelihood and a score of 10. Adding 4 and 5 gives 9 and is not the stated score. <b>C. Seal leak, 20</b>",
    "set": 3,
    "qid": "cre:set-3:024",
    "bok": "II.A.2",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Semi-quantitative risk scores",
      "altText": "Seal leak has likelihood 4 and consequence 5. Schedule delay has likelihood 5 and consequence 2. Process noise has likelihood 2 and consequence 2. Both scales run from 1 to 5.",
      "columns": [
        "Risk",
        "Likelihood L",
        "Consequence C"
      ],
      "rows": [
        [
          "Seal leak",
          "4",
          "5"
        ],
        [
          "Schedule delay",
          "5",
          "2"
        ],
        [
          "Process noise",
          "2",
          "2"
        ]
      ]
    }
  },
  {
    "sub": "cre-risk",
    "stem": "Ransomware locks the maintenance laptop. Repair cannot start until access is restored. Teardown of the failed hardware shows the same wear mechanism as before the attack. Which classification is best?",
    "options": [
      "Technical hardware risk. The wear mechanism changed because the laptop was unavailable.",
      "Strategic brand risk only. Downtime of the repair tool does not affect reliability.",
      "Analytical risk. The failure rate must be recalculated because a cyber event is a statistical outlier.",
      "Cybersecurity risk. It adds downtime and does not, by itself, change the hardware failure rate."
    ],
    "answer": 3,
    "why": "The body of knowledge separates cybersecurity risk from technical, strategic, financial, and analytical risk. Here the attack affects the ability to repair. The observed wear mechanism is unchanged, so the hardware failure rate is not automatically revised. The availability loss is still a reliability consequence. <b>D. Cybersecurity risk. It adds downtime and does not, by itself, change the hardware failure rate.</b>",
    "set": 3,
    "qid": "cre:set-3:025",
    "bok": "II.A.3",
    "cognitive": "Analyze"
  },
  {
    "sub": "cre-risk",
    "stem": "Cooling is lost if the pump fails or if both the valve is stuck and the sensor has failed. The basic events are independent. Pump probability is \\(q_A\\), valve probability is \\(q_V\\), and sensor probability is \\(q_S\\).\n\\[\nQ_B = q_V q_S\n\\]\n\\[\nQ = 1-(1-q_A)(1-Q_B)\n\\]\nWhat is the probability of loss of cooling?",
    "options": [
      "0.0050",
      "0.0249",
      "0.0250",
      "0.1621"
    ],
    "answer": 1,
    "why": "The valve and sensor enter through an AND gate. That pair is then OR-combined with the pump. Independence gives the exact union, not the rare-event sum and not a three-event OR.\n\\[\nQ_B = (0.10)(0.05) = 0.005\n\\]\n\\[\nQ = 1-(1-0.02)(1-0.005) = 0.0249\n\\]\n0.0250 is the rare-event sum. 0.1621 treats all three basic events as one OR gate. <b>B. 0.0249</b>",
    "set": 3,
    "qid": "cre:set-3:026",
    "bok": "II.B.1",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Cooling fault tree",
      "altText": "Loss of cooling is an OR of pump failure and an AND pair. Pump failure probability is 0.02. The valve stuck probability is 0.10 and the sensor-failed probability is 0.05. The basic events are independent.",
      "columns": [
        "Event",
        "Gate or role",
        "Probability"
      ],
      "rows": [
        [
          "Pump failure",
          "Basic event",
          "0.02"
        ],
        [
          "Valve stuck",
          "Basic event",
          "0.10"
        ],
        [
          "Sensor failed",
          "Basic event",
          "0.05"
        ],
        [
          "Valve and sensor",
          "AND",
          "product"
        ],
        [
          "Loss of cooling",
          "OR of pump and the AND pair",
          "asked"
        ]
      ]
    }
  },
  {
    "sub": "cre-risk",
    "stem": "Technicians can install a filter backwards. The team will study that use error. Severity and occurrence will be discussed, but no criticality ranking is required. Which method fits?",
    "options": [
      "Use FMEA. The object of the study is the use error, and criticality ranking was not required.",
      "FMECA. Any worksheet that names severity is a criticality analysis.",
      "Functional FMEA of the design. A backwards filter is a design function, not a use error.",
      "Process FMEA of machining. The error happens at installation, so it is a machining step."
    ],
    "answer": 0,
    "why": "Use FMEA examines how the product can be used or misused. FMECA adds a criticality ranking, which this study does not require. A backwards filter is not a design function and it is not a machining operation. Naming severity does not by itself turn the study into an FMECA. <b>A. Use FMEA. The object of the study is the use error, and criticality ranking was not required.</b>",
    "set": 3,
    "qid": "cre:set-3:027",
    "bok": "II.B.2",
    "cognitive": "Evaluate"
  },
  {
    "sub": "cre-risk",
    "stem": "Two pumps are in active parallel. Each has failure probability \\(q = 0.01\\). Both pumps depend on one shared water supply, and loss of that supply stops both. Which statement is best?",
    "options": [
      "The probability that both pumps are lost is \\(q^2 = 0.0001\\), because parallel units are independent.",
      "The shared supply is a common cause. Using \\(q^2\\) understates the probability that both pumps are lost.",
      "Common cause applies only when the two pumps have the same part number.",
      "Redundancy removes common cause. The shared supply does not belong in the risk model."
    ],
    "answer": 1,
    "why": "Independent parallel arithmetic counts only the chance that the two pumps fail separately.\n\\[\nq^2 = (0.01)^2 = 0.0001\n\\]\nA supply failure stops both pumps together, so that probability is not the system risk. The independent result is smaller than the common-cause risk and therefore understates it. Matching part numbers are not what creates the dependence. <b>B. The shared supply is a common cause. Using \\(q^2\\) understates the probability that both pumps are lost.</b>",
    "set": 3,
    "qid": "cre:set-3:028",
    "bok": "II.B.3",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-risk",
    "stem": "A new heater design can release stored thermal energy if the cover is left off during service. No field accidents have been reported. Which use of hazard analysis is best?",
    "options": [
      "Wait for the first field accident. Hazard analysis uses only reported incidents.",
      "List the heater as acceptable. No accident report means there is no hazard.",
      "Identify the thermal hazard and the cover-off service case during development, before the design is frozen.",
      "Replace the design review with the hazard list. Once a hazard is named, no control is needed."
    ],
    "answer": 2,
    "why": "Hazard analysis informs development by identifying hazards, such as stored energy, and the conditions that release them. It is not limited to accidents that have already occurred, and naming the hazard does not by itself control it. The cover-off case is a reason to choose a control while the design can still be changed. <b>C. Identify the thermal hazard and the cover-off service case during development, before the design is frozen.</b>",
    "set": 3,
    "qid": "cre:set-3:029",
    "bok": "II.B.4",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-risk",
    "stem": "Using the matrix below, what is the class of a hazard whose impact is Serious and whose likelihood is Occasional?",
    "options": [
      "Low",
      "Medium",
      "High",
      "The matrix cannot be used until a failure probability is calculated."
    ],
    "answer": 1,
    "why": "A risk matrix classifies by the stated impact and likelihood. The Serious row and the Occasional column meet at Medium. Serious does not automatically mean High, and Occasional does not automatically mean Low. The matrix is a ranking aid. It does not require a calculated probability before it is used. <b>B. Medium</b>",
    "set": 3,
    "qid": "cre:set-3:030",
    "bok": "II.B.5",
    "cognitive": "Understand",
    "chart": {
      "type": "risk-matrix",
      "title": "Hazard risk matrix",
      "altText": "Impact rows are Catastrophic, Serious, and Negligible. Likelihood columns are Remote, Occasional, and Frequent. Catastrophic is medium, high, high. Serious is low, medium, high. Negligible is low, low, medium.",
      "rows": [
        "Catastrophic",
        "Serious",
        "Negligible"
      ],
      "cols": [
        "Remote",
        "Occasional",
        "Frequent"
      ],
      "cells": [
        [
          "medium",
          "high",
          "high"
        ],
        [
          "low",
          "medium",
          "high"
        ],
        [
          "low",
          "low",
          "medium"
        ]
      ],
      "rowAxis": "Impact",
      "colAxis": "Likelihood"
    }
  },
  {
    "sub": "cre-risk",
    "stem": "The safety review below is the current evidence. No field accident has been reported. Which action is the best safety tradeoff?",
    "options": [
      "Enlarge the label. It is the cheapest action and the issue occurs most often.",
      "Add the cover interlock. It controls the burn hazard, which has the highest impact and a feasible design control.",
      "Fund the software rewrite. The highest spend removes the most safety risk.",
      "Accept all three. The absence of an accident report shows that the current risk is controlled."
    ],
    "answer": 1,
    "why": "Safety priority follows impact and the chance of harm, not the lowest price or the largest budget. The burn hazard is the serious item, and a design interlock reduces the unintended use. A clearer label does not remove that energy hazard. The reboot has negligible safety impact, and no accident yet is not evidence that the hazard is controlled. <b>B. Add the cover interlock. It controls the burn hazard, which has the highest impact and a feasible design control.</b>",
    "set": 3,
    "qid": "cre:set-3:031",
    "bok": "II.B.6",
    "cognitive": "Evaluate",
    "chart": {
      "type": "data-table",
      "title": "Safety tradeoff record",
      "altText": "A cover left off during service can cause a serious burn and occurs occasionally. An interlock costs 12 dollars per unit. Small label text is a minor issue, occurs frequently, and a larger label costs 1 dollar. A software reboot is negligible, remote, and has no safety effect. A rewrite costs 80 dollars.",
      "columns": [
        "Issue",
        "Impact",
        "Occurrence",
        "Available control"
      ],
      "rows": [
        [
          "Cover left off during service",
          "Serious burn",
          "Occasional",
          "Interlock, $12"
        ],
        [
          "Label text too small",
          "Minor",
          "Frequent",
          "Larger label, $1"
        ],
        [
          "Software reboot",
          "Negligible, no safety effect",
          "Remote",
          "Rewrite, $80"
        ]
      ]
    }
  },
  {
    "sub": "cre-risk",
    "stem": "A program will fund every technically possible further reduction, including a control whose cost is grossly disproportionate to the risk removed, until no further reduction is possible. Which goal is that?",
    "options": [
      "ALARP. A grossly disproportionate cost is a reason to stop.",
      "ALARA. Further reduction is limited to what is reasonably achievable.",
      "ALAP. Reduction continues to the lowest level that is technically possible.",
      "ISO 55000. The decision is an asset-value optimization and not a safety goal."
    ],
    "answer": 2,
    "why": "ALAP means as low as possible. The stated rule keeps spending until a further technical reduction does not exist. ALARP allows a stop when the cost is grossly disproportionate to the benefit. ALARA limits the reduction to what is reasonably achievable. ISO 55000 is an asset-management standard. It is not this residual-risk rule. <b>C. ALAP. Reduction continues to the lowest level that is technically possible.</b>",
    "set": 3,
    "qid": "cre:set-3:032",
    "bok": "II.C",
    "cognitive": "Evaluate"
  },
  {
    "sub": "cre-stats",
    "stem": "The five times below are a sample from a larger process. What is the sample standard deviation, to three decimal places?\n\\[\ns=\\sqrt{\\frac{\\sum (x_i-\\bar x)^2}{n-1}}\n\\]",
    "options": [
      "1.414 hours",
      "1.581 hours",
      "2.500 hours",
      "10.000 hours"
    ],
    "answer": 1,
    "why": "The sample mean is 10 hours. The squared deviations sum to 10. The sample variance divides by \\(n-1\\), not by \\(n\\).\n\\[\n\\bar x=10\n\\]\n\\[\ns=\\sqrt{\\frac{10}{4}}=\\sqrt{2.5}=1.581\n\\]\n1.414 hours divides the same sum of squares by 5. 2.500 hours is the sample variance. 10 hours is the mean. <b>B. 1.581 hours</b>",
    "set": 3,
    "qid": "cre:set-3:033",
    "bok": "III.A.1",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Sample of failure times",
      "altText": "Five sampled times, in hours, are 8, 9, 10, 11, and 12.",
      "columns": [
        "Unit",
        "Time (h)"
      ],
      "rows": [
        [
          "1",
          "8"
        ],
        [
          "2",
          "9"
        ],
        [
          "3",
          "10"
        ],
        [
          "4",
          "11"
        ],
        [
          "5",
          "12"
        ]
      ]
    }
  },
  {
    "sub": "cre-stats",
    "stem": "A detector alarms on a defective unit with probability \\(P(A\\mid D)\\) and alarms on a good unit with probability \\(P(A\\mid D')\\). The incoming proportion defective is \\(P(D)\\).\n\\[\nP(D\\mid A)=\\frac{P(A\\mid D)P(D)}{P(A\\mid D)P(D)+P(A\\mid D')P(D')}\n\\]\nWhat is the probability that an alarmed unit is actually defective, to three decimal places?",
    "options": [
      "0.019",
      "0.020",
      "0.162",
      "0.950"
    ],
    "answer": 2,
    "why": "The alarm is more common among the many good units than the joint probability suggests.\n\\[\nP(A\\mid D)P(D)=0.019\n\\]\n\\[\nP(A\\mid D')P(D')=0.098\n\\]\n\\[\nP(D\\mid A)=\\frac{0.019}{0.117}=0.162\n\\]\n0.019 is only the joint probability of defect and alarm. 0.020 is the incoming proportion. 0.950 is the detection probability. <b>C. 0.162</b>",
    "set": 3,
    "qid": "cre:set-3:034",
    "bok": "III.A.2",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Detector evidence",
      "altText": "Two percent of incoming units are defective. The detector alarms on 95 percent of defective units and on 10 percent of good units.",
      "columns": [
        "Event",
        "Probability"
      ],
      "rows": [
        [
          "Defective, P(D)",
          "0.02"
        ],
        [
          "Alarm given defective",
          "0.95"
        ],
        [
          "Alarm given good",
          "0.10"
        ]
      ]
    }
  },
  {
    "sub": "cre-stats",
    "stem": "Sensor failures occur independently at a constant average rate of 2 per year. Use \\(e^{-2}=0.1353\\). What is the probability of at least one failure in a one-year period?",
    "options": [
      "0.1353",
      "0.8647",
      "2.000",
      "0.2706"
    ],
    "answer": 1,
    "why": "A constant independent rate over a fixed interval is a Poisson count. The probability of no failure is the zero term.\n\\[\nP(X=0)=e^{-2}=0.1353\n\\]\n\\[\nP(X\\ge 1)=1-0.1353=0.8647\n\\]\nThe rate 2 is not a probability. 0.2706 is the probability of exactly one failure, \\(2e^{-2}\\). <b>B. 0.8647</b>",
    "set": 3,
    "qid": "cre:set-3:035",
    "bok": "III.A.3",
    "cognitive": "Analyze"
  },
  {
    "sub": "cre-stats",
    "stem": "At 100 hours, the probability density is \\(f(100)=0.004\\) per hour and the reliability is \\(R(100)=0.80\\). Which value is the hazard rate at 100 hours?\n\\[\nh(t)=\\frac{f(t)}{R(t)}\n\\]",
    "options": [
      "0.0032 per hour",
      "0.004 per hour",
      "0.005 per hour",
      "0.200"
    ],
    "answer": 2,
    "why": "The hazard is the density among the units still surviving, not the unconditional density and not the unreliability.\n\\[\nh(100)=\\frac{0.004}{0.80}=0.005\n\\]\n0.0032 is the product \\(f(100)R(100)\\). 0.004 is the density. 0.200 is \\(1-R(100)\\). <b>C. 0.005 per hour</b>",
    "set": 3,
    "qid": "cre:set-3:036",
    "bok": "III.A.4",
    "cognitive": "Evaluate"
  },
  {
    "sub": "cre-stats",
    "stem": "Times to failure are exponential. The demonstration target is \\(\\theta=500\\) hours at confidence \\(C=0.90\\), with zero failures allowed. Use \\(\\ln 0.10=-2.3026\\).\n\\[\nT=-\\theta\\ln(1-C)\n\\]\nHow many total unit-hours are required?",
    "options": [
      "450.0 hours",
      "500.0 hours",
      "1,151.3 hours",
      "2,302.6 hours"
    ],
    "answer": 2,
    "why": "Zero failures do not mean the required time is the target life. Substitute the stated logarithm.\n\\[\nT=-500\\ln(0.10)=1151.3\n\\]\n450 hours is 90 percent of the target. 500 hours is the target itself. 2,302.6 hours uses \\(-\\ln 0.10\\) twice. <b>C. 1,151.3 hours</b>",
    "set": 3,
    "qid": "cre:set-3:037",
    "bok": "III.A.5",
    "cognitive": "Apply"
  },
  {
    "sub": "cre-stats",
    "stem": "A stable strength process is approximately normal. The mean is \\(\\mu\\), the standard deviation is \\(\\sigma\\), and the specification limits are LSL and USL.\n\\[\nC_{pu}=\\frac{USL-\\mu}{3\\sigma}\n\\]\n\\[\nC_{pl}=\\frac{\\mu-LSL}{3\\sigma}\n\\]\n\\[\nC_{pk}=\\min(C_{pu},C_{pl})\n\\]\nWhat is \\(C_{pk}\\)?",
    "options": [
      "0.50",
      "1.50",
      "2.00",
      "1.00"
    ],
    "answer": 3,
    "why": "The process sits closer to the lower limit, so the smaller index governs.\n\\[\nC_{pu}=\\frac{124-100}{12}=2.00\n\\]\n\\[\nC_{pl}=\\frac{100-88}{12}=1.00\n\\]\n\\[\nC_{pk}=1.00\n\\]\n1.50 is \\(C_p\\), which ignores the off-center mean. 2.00 is only the upper index. 0.50 puts \\(6\\sigma\\) in a one-sided denominator. <b>D. 1.00</b>",
    "set": 3,
    "qid": "cre:set-3:038",
    "bok": "III.A.6",
    "cognitive": "Apply",
    "chart": {
      "type": "data-table",
      "title": "Strength process",
      "altText": "The process mean is 100, the standard deviation is 4, the lower specification is 88, and the upper specification is 124.",
      "columns": [
        "Quantity",
        "Value"
      ],
      "rows": [
        [
          "Mean",
          "100"
        ],
        [
          "Standard deviation",
          "4"
        ],
        [
          "LSL",
          "88"
        ],
        [
          "USL",
          "124"
        ]
      ]
    }
  },
  {
    "sub": "cre-stats",
    "stem": "An exponential test is failure-terminated at \\(r=4\\) failures, with total unit time \\(T=2{,}000\\) hours. For a 90 percent two-sided interval the lower bound uses the upper-tail chi-square value with \\(2r\\) degrees of freedom.\n\\[\n\\theta_L=\\frac{2T}{\\chi^2_{0.05,\\,2r}}\n\\]\nWhat is the lower bound, to one decimal place?",
    "options": [
      "257.9 hours",
      "500.0 hours",
      "1,000.0 hours",
      "1,463.6 hours"
    ],
    "answer": 0,
    "why": "Four failures give 8 degrees of freedom. The lower bound divides by the larger chi-square value.\n\\[\n\\theta_L=\\frac{2(2000)}{15.507}=257.9\n\\]\n500 hours is the point estimate \\(T/r\\). 1,000 hours is \\(T/2\\). 1,463.6 hours divides by the lower-tail value and is the upper end of this interval, not the lower bound. <b>A. 257.9 hours</b>",
    "set": 3,
    "qid": "cre:set-3:039",
    "bok": "III.A.7",
    "cognitive": "Evaluate",
    "chart": {
      "type": "data-table",
      "title": "Chi-square values for 8 degrees of freedom",
      "altText": "For 8 degrees of freedom, the upper 5 percent point is 15.507 and the lower 5 percent point is 2.733.",
      "columns": [
        "Tail",
        "Chi-square"
      ],
      "rows": [
        [
          "Upper 5 percent",
          "15.507"
        ],
        [
          "Lower 5 percent",
          "2.733"
        ]
      ]
    }
  },
  {
    "sub": "cre-stats",
    "stem": "Warranty observation stops at 12 months. The five records below are the complete result. Which use of the data is appropriate?",
    "options": [
      "Average the three failure times. Units still operating at 12 months do not belong in a life estimate.",
      "Treat the two units with no failure as right-censored at 12 months.",
      "Treat the two units with no failure as failed at 12 months.",
      "Treat the two units with no failure as units that will never fail."
    ],
    "answer": 1,
    "why": "Warranty data stop because the observation stops, not because the surviving units have proved an infinite life. Units 4 and 5 are right-censored at 12 months. Averaging only the three failure times ignores those survivors and understates life. Calling them failures at 12 months, or survivors forever, invents an outcome the records do not show. <b>B. Treat the two units with no failure as right-censored at 12 months.</b>",
    "set": 3,
    "qid": "cre:set-3:040",
    "bok": "III.B.1",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Warranty records",
      "altText": "Three units failed at 3, 7, and 11 months. Two units had no failure and observation ended at 12 months.",
      "columns": [
        "Unit",
        "Record"
      ],
      "rows": [
        [
          "1",
          "Failed at 3 months"
        ],
        [
          "2",
          "Failed at 7 months"
        ],
        [
          "3",
          "Failed at 11 months"
        ],
        [
          "4",
          "No failure; observation ends at 12 months"
        ],
        [
          "5",
          "No failure; observation ends at 12 months"
        ]
      ]
    }
  },
  {
    "sub": "cre-stats",
    "stem": "The Nevada chart below counts returns by sale month and month in service. A blank cell means those units have not reached that age. Month-1 returns are \\(r_1\\) and the number shipped is \\(n\\).\n\\[\np_1=\\frac{r_1}{n}\n\\]\nWhat is the month-1 return proportion?",
    "options": [
      "0.020",
      "0.025",
      "0.030",
      "0.040"
    ],
    "answer": 0,
    "why": "Every shipped unit has had a chance to fail in month 1, including the March units that returned none. The blank March cell is month 2, so it is not a month-1 zero and it is not a reason to drop March.\n\\[\nr_1=4+6+0=10\n\\]\n\\[\np_1=\\frac{10}{500}=0.020\n\\]\n0.025 drops the 100 March units. 0.030 divides January's two ages by January's shipments. 0.040 divides all observed returns by all shipments. <b>A. 0.020</b>",
    "set": 3,
    "qid": "cre:set-3:041",
    "bok": "III.B.2",
    "cognitive": "Evaluate",
    "chart": {
      "type": "data-table",
      "title": "Nevada return chart",
      "altText": "January shipped 200 units, with 4 returns in month 1 and 2 in month 2. February shipped 200, with 6 in month 1 and 8 in month 2. March shipped 100, with 0 in month 1. The March month-2 cell is blank because those units have not reached month 2.",
      "columns": [
        "Sale month",
        "Shipped",
        "Month 1 returns",
        "Month 2 returns"
      ],
      "rows": [
        [
          "January",
          "200",
          "4",
          "2"
        ],
        [
          "February",
          "200",
          "6",
          "8"
        ],
        [
          "March",
          "100",
          "0",
          "blank"
        ]
      ]
    }
  },
  {
    "sub": "cre-stats",
    "stem": "A connector opens for about 30 milliseconds a few times each week in the field. Technicians currently describe the problem from memory on a monthly survey. Which collection method best fits the objective?",
    "options": [
      "An annual satisfaction score. A single rating is enough for an event that lasts 30 milliseconds.",
      "Keep the memory survey, but ask the technician to estimate the duration to the nearest minute.",
      "An automated event recorder that stores the timestamp and the open duration.",
      "One end-of-line mating cycle recorded as pass or fail. A field intermittent will appear there."
    ],
    "answer": 2,
    "why": "The objective is to capture a short, infrequent field event. An automated recorder can store the time and duration. A satisfaction score and a monthly memory survey do not resolve a 30-millisecond open, and one end-of-line cycle does not represent the field occurrence. <b>C. An automated event recorder that stores the timestamp and the open duration.</b>",
    "set": 3,
    "qid": "cre:set-3:042",
    "bok": "III.B.3",
    "cognitive": "Evaluate"
  },
  {
    "sub": "cre-stats",
    "stem": "The failure counts below are complete for the period. The cumulative share is \\(F_k\\) after the counts are ordered from largest to smallest, and \\(N\\) is the total.\n\\[\nF_k=\\frac{\\sum_{i=1}^{k} c_i}{N}\n\\]\nWhich is the smallest set whose cumulative share exceeds 80 percent?",
    "options": [
      "Seal only",
      "Seal and sensor",
      "Seal, sensor, and gasket",
      "All five categories"
    ],
    "answer": 2,
    "why": "Order the counts, then accumulate.\n\\[\nF_1=\\frac{40}{100}=0.40\n\\]\n\\[\nF_2=\\frac{65}{100}=0.65\n\\]\n\\[\nF_3=\\frac{85}{100}=0.85\n\\]\nTwo categories reach only 65 percent. The gasket is required to pass 80 percent. The screw and the paint are not needed for that threshold. <b>C. Seal, sensor, and gasket</b>",
    "set": 3,
    "qid": "cre:set-3:043",
    "bok": "III.B.4",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Field failure counts",
      "altText": "Seal 40, sensor 25, gasket 20, screw 10, and paint 5. The five counts sum to 100.",
      "columns": [
        "Category",
        "Failures"
      ],
      "rows": [
        [
          "Seal",
          "40"
        ],
        [
          "Sensor",
          "25"
        ],
        [
          "Gasket",
          "20"
        ],
        [
          "Screw",
          "10"
        ],
        [
          "Paint",
          "5"
        ]
      ]
    }
  },
  {
    "sub": "cre-stats",
    "stem": "A shaft from a rotating-bending application has a fracture covered with beach marks and striations. The warranty text says only \"customer misuse.\" Which conclusion is best supported?",
    "options": [
      "The warranty text is the physical analysis. Striations do not need to be examined.",
      "Fractography supports fatigue crack growth. The misuse label does not replace that evidence.",
      "The striations show a voltage surge. Fatigue is not a candidate.",
      "Infrared inspection of an unfailed spare is the analysis that identifies this fracture mechanism."
    ],
    "answer": 1,
    "why": "Beach marks and striations on a fracture from cyclic bending are physical evidence of fatigue crack growth. A free-text warranty label does not identify the mechanism, a voltage surge does not write those marks on a shaft, and inspecting an unfailed spare with infrared does not read this fracture surface. <b>B. Fractography supports fatigue crack growth. The misuse label does not replace that evidence.</b>",
    "set": 3,
    "qid": "cre:set-3:044",
    "bok": "III.B.5",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-stats",
    "stem": "The record below is offered as a closed FRACAS loop. Which evaluation is best?",
    "options": [
      "Closed. A returned unit was cleaned, so the corrective action is verified.",
      "Not closed. The cause is unknown, the code cannot be trended, and effectiveness was not checked.",
      "Closed. A free-text symptom is a standard problem code.",
      "Not closed only because the report date is missing. The other steps are complete."
    ],
    "answer": 1,
    "why": "A closed loop reports the failure in a way that can be trended, finds the cause, acts on that cause, and checks that the action worked. Cleaning one returned unit, with no cause and no effectiveness check, does not close the loop. Free text is not a standard code. <b>B. Not closed. The cause is unknown, the code cannot be trended, and effectiveness was not checked.</b>",
    "set": 3,
    "qid": "cre:set-3:045",
    "bok": "III.B.6",
    "cognitive": "Evaluate",
    "chart": {
      "type": "data-table",
      "title": "FRACAS record",
      "altText": "A report was filed in free text. The cause was not identified. The returned unit's filter was cleaned. No effectiveness check was recorded, and no standard problem-cause code was assigned.",
      "columns": [
        "Step",
        "Record"
      ],
      "rows": [
        [
          "Report",
          "Free-text symptom only"
        ],
        [
          "Cause",
          "Not identified"
        ],
        [
          "Action",
          "Filter cleaned on the returned unit"
        ],
        [
          "Verification",
          "None"
        ],
        [
          "Code",
          "No standard problem-cause code"
        ]
      ]
    }
  },
  {
    "sub": "cre-model",
    "stem": "A design is still changing. The present objective is to find failure mechanisms and remove them, and test failures are expected. Which strategy fits?",
    "options": [
      "A zero-failure demonstration. Any failure means the test plan was wrong.",
      "Wait until the design is frozen, then start the discovery test.",
      "Test, analyze, and fix. Failures during this phase are inputs to the design change.",
      "Extend the warranty instead of testing. Field time will replace a discovery test."
    ],
    "answer": 2,
    "why": "Test, analyze, and fix is a discovery strategy for development, when failures are expected and the design can still change. A zero-failure demonstration answers a different question and is not the strategy for finding mechanisms. Waiting until the design is frozen, or replacing the test with a warranty change, gives up the chance to fix what the test is meant to reveal. <b>C. Test, analyze, and fix. Failures during this phase are inputs to the design change.</b>",
    "set": 3,
    "qid": "cre:set-3:046",
    "bok": "IV.A.1",
    "cognitive": "Evaluate"
  },
  {
    "sub": "cre-model",
    "stem": "Five failures occurred during a calendar exposure of \\(t_c\\) hours. The product operates for a duty cycle \\(d\\) and is otherwise off. The rate wanted is per operating hour.\n\\[\nt_o=d\\,t_c\n\\]\n\\[\n\\hat\\lambda=\\frac{r}{t_o}\n\\]\nWhat is the operating-time failure rate?",
    "options": [
      "0.0025 per hour",
      "0.010 per hour",
      "0.250 per hour",
      "400 hours"
    ],
    "answer": 1,
    "why": "Calendar time is not the operating exposure.\n\\[\nt_o=0.25(2000)=500\n\\]\n\\[\n\\hat\\lambda=\\frac{5}{500}=0.010\n\\]\n0.0025 divides by the calendar time. 0.250 is the duty cycle, not a failure rate. 400 hours is the calendar time divided by the failure count. <b>B. 0.010 per hour</b>",
    "set": 3,
    "qid": "cre:set-3:047",
    "bok": "IV.A.2",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Use profile",
      "altText": "Calendar exposure is 2,000 hours. The duty cycle is 0.25. Five failures occurred in that exposure.",
      "columns": [
        "Quantity",
        "Value"
      ],
      "rows": [
        [
          "Calendar exposure",
          "2,000 h"
        ],
        [
          "Duty cycle",
          "0.25"
        ],
        [
          "Failures",
          "5"
        ]
      ]
    }
  },
  {
    "sub": "cre-model",
    "stem": "A seal leak is rare and can release a hazardous fluid. Nuisance resets are common and have no safety effect. An acceptance rule that uses only the failure count would reject the resets and accept the seal. Which statement is best?",
    "options": [
      "The count rule is sufficient. Consequence is already contained in the count.",
      "Accept the seal. A rare event cannot set an acceptance criterion.",
      "Reject the resets and ignore the seal. The common event is always the safety event.",
      "The seal can fail acceptance because of its consequence, even though it adds little to the failure count."
    ],
    "answer": 3,
    "why": "Acceptance criteria depend on the consequence of the failure mode as well as how often it occurs. A hazardous leak is not made acceptable by being rare, and a common nuisance reset is not made hazardous by its count. <b>D. The seal can fail acceptance because of its consequence, even though it adds little to the failure count.</b>",
    "set": 3,
    "qid": "cre:set-3:048",
    "bok": "IV.A.3",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-model",
    "stem": "The requirement says a pump has failed if delivery stays below 8 L/min. In the test log, only a complete stop was counted as a failure. A unit that delivered 5 L/min was marked pass. Which statement is best?",
    "options": [
      "The pass is correct. The pump was still running, so the function was met.",
      "The unit failed. The stated criterion is the flow limit, not a complete stop.",
      "The warranty period is the failure criterion. Flow does not define failure.",
      "The log is correct because 5 L/min is closer to 8 L/min than to zero."
    ],
    "answer": 1,
    "why": "The failure criterion comes from the requirement: delivery below 8 L/min. A unit at 5 L/min has already met that criterion. Still running is not the required function, and neither the warranty window nor the distance from zero changes the stated limit. <b>B. The unit failed. The stated criterion is the flow limit, not a complete stop.</b>",
    "set": 3,
    "qid": "cre:set-3:049",
    "bok": "IV.A.4",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-model",
    "stem": "The use profile and the test that was run are below. The units passed. Which decision is supported?",
    "options": [
      "Accept the design for field use. A pass at any controlled condition is sufficient.",
      "Accept the design. The laboratory is more controlled than the field, so it is the harder test.",
      "Do not use this pass as the field acceptance decision. The test omitted the stated temperature, vibration, and duty cycle.",
      "Reject the hardware design. A difference in test setup proves the product will fail in the field."
    ],
    "answer": 2,
    "why": "The test has to represent the use environment before a pass supports a field decision. This run omitted the 55°C condition, the vibration, and the 80 percent duty cycle. That missing exposure does not by itself prove the hardware will fail. It does mean this pass is not the acceptance evidence. <b>C. Do not use this pass as the field acceptance decision. The test omitted the stated temperature, vibration, and duty cycle.</b>",
    "set": 3,
    "qid": "cre:set-3:050",
    "bok": "IV.A.5",
    "cognitive": "Evaluate",
    "chart": {
      "type": "data-table",
      "title": "Use profile and test actually run",
      "altText": "Field use is 55°C, 5 g vibration, and 80 percent duty cycle. The test was run at 25°C, with no vibration, and at 10 percent duty cycle. The units passed that test.",
      "columns": [
        "Condition",
        "Field use",
        "Test run"
      ],
      "rows": [
        [
          "Temperature",
          "55°C",
          "25°C"
        ],
        [
          "Vibration",
          "5 g",
          "None"
        ],
        [
          "Duty cycle",
          "80 percent",
          "10 percent"
        ],
        [
          "Result",
          "Not observed",
          "Pass"
        ]
      ]
    }
  },
  {
    "sub": "cre-model",
    "stem": "The life model is Arrhenius. \\(T_u\\) and \\(T_s\\) are the use and stress temperatures in kelvin, and \\(E_a/k\\) is given.\n\\[\nAF=\\exp[(E_a/k)(1/T_u-1/T_s)]\n\\]\nWhat is the acceleration factor, to the nearest whole number?",
    "options": [
      "0.039",
      "3.3",
      "26",
      "80"
    ],
    "answer": 2,
    "why": "Use kelvin. Do not subtract the temperatures, and do not stop at the exponent.\n\\[\n1/313-1/393=0.0006504\n\\]\n\\[\n(E_a/k)(0.0006504)=3.252\n\\]\n\\[\nAF=\\exp(3.252)=25.8\n\\]\nThe nearest whole number is 26. 0.039 inverts the two temperatures. 3.3 is the exponent. 80 is the temperature difference. <b>C. 26</b>",
    "set": 3,
    "qid": "cre:set-3:051",
    "bok": "IV.B.1",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Arrhenius test conditions",
      "altText": "Use temperature is 40°C, which is 313 K. Stress temperature is 120°C, which is 393 K. Ea/k is 5,000 K.",
      "columns": [
        "Quantity",
        "Value"
      ],
      "rows": [
        [
          "Use temperature",
          "313 K"
        ],
        [
          "Stress temperature",
          "393 K"
        ],
        [
          "Ea/k",
          "5,000 K"
        ]
      ]
    }
  },
  {
    "sub": "cre-model",
    "stem": "Every production unit is run for 30 minutes above the specification but inside the destruct limit found earlier. No life estimate is calculated. Units that fail are removed. Which description fits?",
    "options": [
      "An accelerated life test used to extrapolate field life.",
      "A stress screen used to precipitate defects, not to estimate life.",
      "A use-level demonstration that the reliability requirement has been met.",
      "A degradation test continued until a wear threshold is reached."
    ],
    "answer": 1,
    "why": "A production screen stresses units enough to precipitate latent defects and then removes the failures. It is not run to a wear threshold, it is not an extrapolation of field life, and a 30-minute screen with no accept-on-reliability rule is not a demonstration. <b>B. A stress screen used to precipitate defects, not to estimate life.</b>",
    "set": 3,
    "qid": "cre:set-3:052",
    "bok": "IV.B.2",
    "cognitive": "Evaluate"
  },
  {
    "sub": "cre-model",
    "stem": "The contract requires a demonstration that mission reliability meets a pre-stated value under a pre-stated accept rule. The lab instead runs units until the first interesting failure, then stops to redesign. Which statement is best?",
    "options": [
      "The run is the contracted demonstration because a failure was observed.",
      "The run can be useful development testing, but it is not the contracted demonstration.",
      "Stopping at the first failure increases the demonstrated reliability.",
      "A demonstration does not need an accept rule if the contract names a reliability value."
    ],
    "answer": 1,
    "why": "A demonstration uses the stated requirement and the stated accept rule. Stopping at the first failure to redesign is a discovery test. It may be the right development activity, but it does not become the contracted demonstration, and the early stop does not raise the demonstrated reliability. <b>B. The run can be useful development testing, but it is not the contracted demonstration.</b>",
    "set": 3,
    "qid": "cre:set-3:053",
    "bok": "IV.B.3",
    "cognitive": "Evaluate"
  },
  {
    "sub": "cre-model",
    "stem": "Wear starts at zero and increases at a constant rate. Failure is the first time the wear reaches the threshold. \\(d\\) is the wear added in each block of \\(t_0\\) hours.\n\\[\nt=t_0\\frac{D}{d}\n\\]\nWhat is the time to the failure threshold?",
    "options": [
      "200 hours",
      "1,250 hours",
      "5,000 hours",
      "20,000 hours"
    ],
    "answer": 2,
    "why": "Divide the threshold by the wear per block, then multiply by the block length.\n\\[\nt=1000\\times\\frac{0.25}{0.05}=5000\n\\]\n200 hours inverts the threshold and the wear per block. 20,000 hours multiplies the block length by the reciprocal of the wear ratio in the wrong direction. <b>C. 5,000 hours</b>",
    "set": 3,
    "qid": "cre:set-3:054",
    "bok": "IV.B.4",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Wear measurements",
      "altText": "Wear increases by 0.05 mm in every 1,000 hours. The failure threshold is 0.25 mm. Wear starts at zero.",
      "columns": [
        "Quantity",
        "Value"
      ],
      "rows": [
        [
          "Block length",
          "1,000 h"
        ],
        [
          "Wear per block",
          "0.05 mm"
        ],
        [
          "Failure threshold",
          "0.25 mm"
        ]
      ]
    }
  },
  {
    "sub": "cre-model",
    "stem": "A parts-count model assigns one exponential failure rate to a controller and treats the firmware as if it were another hardware part. The same input sequence is then rerun 100 times with no new result. Which limitation is most important?",
    "options": [
      "The model is appropriate. Firmware faults occur at a constant hazard like a random hardware part.",
      "Repeating one input sequence 100 times is 100 independent firmware trials.",
      "A parts-count rate does not describe a design fault in firmware, and repeating one path is not a new sample of faults.",
      "Firmware can be ignored because only mechanical parts have failure mechanisms."
    ],
    "answer": 2,
    "why": "A firmware fault is a design fault. It is not established by putting the firmware into a parts-count model, and it does not become 100 independent trials because the same path was repeated. Software still has failure mechanisms, but they are not the same as a constant hardware hazard. <b>C. A parts-count rate does not describe a design fault in firmware, and repeating one path is not a new sample of faults.</b>",
    "set": 3,
    "qid": "cre:set-3:055",
    "bok": "IV.B.5",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-model",
    "stem": "Three identical units are independent. The function works if at least two of the three work. Each unit has mission reliability \\(R\\).\n\\[\nR_{2/3}=3R^{2}(1-R)+R^{3}\n\\]\nWhat is the mission reliability of the function?",
    "options": [
      "0.729",
      "0.900",
      "0.972",
      "0.999"
    ],
    "answer": 2,
    "why": "At least two surviving is not the same as all three, and it is not the same as any one.\n\\[\nR_{2/3}=3(0.90)^{2}(0.10)+(0.90)^{3}\n\\]\n\\[\nR_{2/3}=0.243+0.729=0.972\n\\]\n0.729 requires all three. 0.900 is one unit. 0.999 is the reliability if any one of the three were enough. <b>C. 0.972</b>",
    "set": 3,
    "qid": "cre:set-3:056",
    "bok": "IV.C.1",
    "cognitive": "Evaluate",
    "chart": {
      "type": "data-table",
      "title": "Two-out-of-three function",
      "altText": "Three identical independent units each have mission reliability 0.90. The function requires at least two of the three.",
      "columns": [
        "Unit",
        "Mission reliability",
        "Requirement"
      ],
      "rows": [
        [
          "1",
          "0.90",
          "At least two units"
        ],
        [
          "2",
          "0.90",
          "At least two units"
        ],
        [
          "3",
          "0.90",
          "At least two units"
        ]
      ]
    }
  },
  {
    "sub": "cre-model",
    "stem": "A polymer seal is held at a constant tensile load at 90°C. There is no cyclic load. Over time it takes a permanent set and no longer seals. Which mechanism fits?",
    "options": [
      "High-cycle fatigue, because the load is mechanical.",
      "Creep, because a constant load at elevated temperature produced a permanent set.",
      "Corrosion, because the temperature is above room temperature.",
      "Electrostatic discharge, because the set appeared without a fracture."
    ],
    "answer": 1,
    "why": "Creep is time-dependent deformation under a sustained load, often faster at elevated temperature. Fatigue needs repeated loading, which is not in the evidence. Temperature by itself is not corrosion, and a permanent set is not an electrostatic-discharge mechanism. <b>B. Creep, because a constant load at elevated temperature produced a permanent set.</b>",
    "set": 3,
    "qid": "cre:set-3:057",
    "bok": "IV.C.2",
    "cognitive": "Apply"
  },
  {
    "sub": "cre-model",
    "stem": "Thermal-cycle life follows the stated Coffin-Manson relation. \\(N\\) is cycles to the failure criterion and \\(b\\) is the given exponent.\n\\[\nN_2=N_1\\left(\\frac{\\Delta T_1}{\\Delta T_2}\\right)^{b}\n\\]\nHow many cycles to failure are expected at the larger temperature range?",
    "options": [
      "2,000",
      "4,000",
      "8,000",
      "32,000"
    ],
    "answer": 0,
    "why": "The larger temperature range shortens life by the square of the range ratio.\n\\[\nN_2=8000\\left(\\frac{40}{80}\\right)^{2}\n\\]\n\\[\nN_2=8000(0.25)=2000\n\\]\n4,000 uses the ratio once. 8,000 ignores the change in range. 32,000 inverts the ratio and squares it. <b>A. 2,000</b>",
    "set": 3,
    "qid": "cre:set-3:058",
    "bok": "IV.C.3",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Thermal-cycle model",
      "altText": "At a temperature range of 40°C the life is 8,000 cycles. The new range is 80°C. The exponent b is 2.",
      "columns": [
        "Quantity",
        "Value"
      ],
      "rows": [
        [
          "Life at 40°C",
          "8,000 cycles"
        ],
        [
          "New temperature range",
          "80°C"
        ],
        [
          "Exponent b",
          "2"
        ]
      ]
    }
  },
  {
    "sub": "cre-model",
    "stem": "A parts-count prediction gives 2.0 failures per million hours at its reference condition. The product will operate hotter than that reference. No stress data and no test data are available. Which use of the prediction is appropriate?",
    "options": [
      "Use 2.0 as the use-condition failure rate. Parts count already includes any hotter environment.",
      "Do not use 2.0 as the hot-use failure rate. Parts count does not account for the higher stress.",
      "Run a Monte Carlo simulation on the value 2.0. The simulation supplies the missing temperature effect.",
      "Prefer parts count over part-stress analysis whenever the use temperature is unknown."
    ],
    "answer": 1,
    "why": "A parts-count prediction is tied to its reference condition. It does not by itself adjust for a hotter use. Resampling the same 2.0 in a Monte Carlo run does not add the missing temperature, and an unknown use temperature is a reason not to treat the reference number as the answer. <b>B. Do not use 2.0 as the hot-use failure rate. Parts count does not account for the higher stress.</b>",
    "set": 3,
    "qid": "cre:set-3:059",
    "bok": "IV.C.4",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-model",
    "stem": "A damage model predicts 2,000 hours to the crack threshold. Three prototypes were run on the same mission profile and were not used to adjust the model. Which use of the result is appropriate?",
    "options": [
      "Use 2,000 hours. A damage model outranks a prototype.",
      "Use 800 hours. The prototype average is correlated with the model because both mention a crack.",
      "Do not use 2,000 hours as the demonstrated life. The model has not been shown to agree with the prototypes.",
      "Use 1,400 hours, the average of 2,000 and 800. Averaging creates the correlation."
    ],
    "answer": 2,
    "why": "A prototype result can check a damage model only after the two are shown to agree. Here the prototypes crack much earlier and the model was not adjusted, so 2,000 hours is not a demonstrated life. Averaging the model with the prototype mean, or treating a shared word as correlation, does not create that agreement. <b>C. Do not use 2,000 hours as the demonstrated life. The model has not been shown to agree with the prototypes.</b>",
    "set": 3,
    "qid": "cre:set-3:060",
    "bok": "IV.C.5",
    "cognitive": "Understand",
    "chart": {
      "type": "data-table",
      "title": "Prototype crack times",
      "altText": "The damage model predicts 2,000 hours. The three prototypes cracked at 700, 800, and 900 hours on the same mission profile. The model was not adjusted.",
      "columns": [
        "Source",
        "Time to crack"
      ],
      "rows": [
        [
          "Damage model",
          "2,000 h"
        ],
        [
          "Prototype 1",
          "700 h"
        ],
        [
          "Prototype 2",
          "800 h"
        ],
        [
          "Prototype 3",
          "900 h"
        ]
      ]
    }
  },
  {
    "sub": "cre-life",
    "stem": "A laboratory test shows that a pump meets the written requirement of at least 8 L/min with water on a bench. The customer's fluid, temperature, and duty cycle have not been used. Which statement is best?",
    "options": [
      "The bench result is validation, because it compares the pump with a number.",
      "The bench result is verification against the written requirement. Validation against the customer's use is still open.",
      "Verification and validation are the same activity, so the bench result closes both.",
      "Verification can be done only after the pump is in the field."
    ],
    "answer": 1,
    "why": "Verification asks whether the product meets a stated requirement. The bench test does that for 8 L/min with water. Validation asks whether the product meets the intended use. The customer's fluid, temperature, and duty cycle were not in the test, so that question is still open. <b>B. The bench result is verification against the written requirement. Validation against the customer's use is still open.</b>",
    "set": 3,
    "qid": "cre:set-3:061",
    "bok": "V.A.1",
    "cognitive": "Apply"
  },
  {
    "sub": "cre-life",
    "stem": "The eight-run factorial below uses coded levels. The main effect of factor A is the difference of the two averages.\n\\[\nE_A=\\bar y_{A+}-\\bar y_{A-}\n\\]\nWhat is \\(E_A\\)?",
    "options": [
      "3.25",
      "6.0",
      "6.5",
      "26"
    ],
    "answer": 2,
    "why": "Average the four runs at each level of A, then subtract.\n\\[\n\\bar y_{A+}=(16+20+15+21)/4=18\n\\]\n\\[\n\\bar y_{A-}=(10+12+11+13)/4=11.5\n\\]\n\\[\nE_A=18-11.5=6.5\n\\]\n3.25 divides the same contrast by all eight runs. 6.0 is only the first pair. 26 is the contrast before it is averaged. <b>C. 6.5</b>",
    "set": 3,
    "qid": "cre:set-3:062",
    "bok": "V.A.3",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Full factorial responses",
      "altText": "Eight runs. The A, B, and C columns are coded levels. The response is y. Runs at A+ are 16, 20, 15, and 21. Runs at A- are 10, 12, 11, and 13.",
      "columns": [
        "Run",
        "A",
        "B",
        "C",
        "y"
      ],
      "rows": [
        [
          "1",
          "−",
          "−",
          "−",
          "10"
        ],
        [
          "2",
          "+",
          "−",
          "−",
          "16"
        ],
        [
          "3",
          "−",
          "+",
          "−",
          "12"
        ],
        [
          "4",
          "+",
          "+",
          "−",
          "20"
        ],
        [
          "5",
          "−",
          "−",
          "+",
          "11"
        ],
        [
          "6",
          "+",
          "−",
          "+",
          "15"
        ],
        [
          "7",
          "−",
          "+",
          "+",
          "13"
        ],
        [
          "8",
          "+",
          "+",
          "+",
          "21"
        ]
      ]
    }
  },
  {
    "sub": "cre-life",
    "stem": "The mission reliability requirement is at least 0.98. Any one row below is affordable, and a slip of three weeks is acceptable. Which choice meets the requirement?",
    "options": [
      "No change",
      "Screening",
      "Partial redesign",
      "Redundancy"
    ],
    "answer": 3,
    "why": "Cost and schedule do not replace the reliability requirement. Screening reaches 0.96 and the partial redesign reaches 0.97. Both miss 0.98. Redundancy reaches 0.99 and is inside the stated budget and schedule. <b>D. Redundancy</b>",
    "set": 3,
    "qid": "cre:set-3:063",
    "bok": "V.A.4",
    "cognitive": "Apply",
    "chart": {
      "type": "data-table",
      "title": "Reliability options",
      "altText": "No change gives reliability 0.90 at no added cost. Screening gives 0.96 for 8 cost units and one week. A partial redesign gives 0.97 for 12 cost units and two weeks. Redundancy gives 0.99 for 25 cost units and three weeks. The requirement is 0.98.",
      "columns": [
        "Choice",
        "Mission reliability",
        "Added cost",
        "Schedule slip"
      ],
      "rows": [
        [
          "No change",
          "0.90",
          "0",
          "None"
        ],
        [
          "Screening",
          "0.96",
          "8",
          "1 week"
        ],
        [
          "Partial redesign",
          "0.97",
          "12",
          "2 weeks"
        ],
        [
          "Redundancy",
          "0.99",
          "25",
          "3 weeks"
        ]
      ]
    }
  },
  {
    "sub": "cre-life",
    "stem": "A technician must hold a spring latch open with one hand and turn a valve with the other. The bay allows only one person, and the latch closes when it is released. Which statement is best?",
    "options": [
      "The task design makes a use error likely. The latch should be held by the fixture, not by the second hand.",
      "The valve failure rate should be increased. The problem is a hardware hazard rate.",
      "A second warning label is the reliability control. The task does not need to change.",
      "Human factors apply only after a field injury. This task is not a reliability issue yet."
    ],
    "answer": 0,
    "why": "The task cannot be completed as designed by one person without releasing the latch. That is a human-factors failure mode. It is not fixed by changing the valve's constant failure rate, by another label, or by waiting for an injury. <b>A. The task design makes a use error likely. The latch should be held by the fixture, not by the second hand.</b>",
    "set": 3,
    "qid": "cre:set-3:064",
    "bok": "V.A.5",
    "cognitive": "Understand"
  },
  {
    "sub": "cre-life",
    "stem": "Built-in test detects 30 percent of the failure modes. The assembly has no test connector, so the other modes cannot be isolated without replacing the whole unit. The screw count was already reduced. Which gap remains?",
    "options": [
      "Design for manufacturability. The screw-count change has not been finished.",
      "Design for testability. Most failure modes still cannot be isolated.",
      "Design for cost. Fewer screws are required before any test access is added.",
      "No gap. Replacing the whole unit is a complete diagnostic test."
    ],
    "answer": 1,
    "why": "Testability is the ability to detect and isolate a failure. Coverage of 30 percent, with no connector for the rest, leaves that gap. The screw-count reduction is a manufacturability change and does not create the missing isolation. Swapping the whole unit does not identify the failed mode. <b>B. Design for testability. Most failure modes still cannot be isolated.</b>",
    "set": 3,
    "qid": "cre:set-3:065",
    "bok": "V.A.6",
    "cognitive": "Apply"
  },
  {
    "sub": "cre-life",
    "stem": "A finite-element result gives the stress at a corner. The material allowable is \\(S_{allow}\\) and the calculated stress is \\(\\sigma\\).\n\\[\nn=\\frac{S_{allow}}{\\sigma}\n\\]\nWhat is the factor of safety, to two decimal places?",
    "options": [
      "0.83",
      "1.20",
      "1.50",
      "30"
    ],
    "answer": 0,
    "why": "The factor is the allowable divided by the stress, not the reverse.\n\\[\nn=\\frac{150}{180}=0.83\n\\]\nA factor below 1 means the calculated stress is above the allowable. 1.20 inverts the ratio. 1.50 is a target that this corner does not meet. 30 is the difference of the two stresses, in megapascals. <b>A. 0.83</b>",
    "set": 3,
    "qid": "cre:set-3:066",
    "bok": "V.A.7",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Corner stress check",
      "altText": "The finite-element stress at the corner is 180 MPa. The material allowable is 150 MPa.",
      "columns": [
        "Quantity",
        "Value"
      ],
      "rows": [
        [
          "Calculated stress",
          "180 MPa"
        ],
        [
          "Material allowable",
          "150 MPa"
        ]
      ]
    }
  },
  {
    "sub": "cre-life",
    "stem": "The capacitor guideline limits applied voltage to half of the rated voltage.\n\\[\nV_{der}=0.50\\,V_{rated}\n\\]\nIs this application inside the derating rule?",
    "options": [
      "Yes. The applied voltage is below the 50 V rating.",
      "Yes. Half of the applied voltage is 20 V, which is below the rating.",
      "No. The derated limit is 25 V, and 40 V is above it.",
      "No. A capacitor is acceptable only at zero applied voltage."
    ],
    "answer": 2,
    "why": "The nameplate rating is not the derated limit.\n\\[\nV_{der}=0.50(50)=25\n\\]\nThe applied 40 V is under 50 V and still above 25 V, so the part is outside the stated rule. Half of the applied voltage is not the criterion. <b>C. No. The derated limit is 25 V, and 40 V is above it.</b>",
    "set": 3,
    "qid": "cre:set-3:067",
    "bok": "V.B.1",
    "cognitive": "Analyze",
    "chart": {
      "type": "data-table",
      "title": "Capacitor application",
      "altText": "The capacitor is rated 50 V. The circuit applies 40 V. The derating rule allows half of the rated voltage.",
      "columns": [
        "Quantity",
        "Value"
      ],
      "rows": [
        [
          "Rated voltage",
          "50 V"
        ],
        [
          "Applied voltage",
          "40 V"
        ],
        [
          "Derating",
          "50 percent of rated voltage"
        ]
      ]
    }
  },
  {
    "sub": "cre-life",
    "stem": "Four custom fasteners are each used in one place and have no field history. One standard fastener has five years of field data and can replace all four. Which choice is the better reliability decision?",
    "options": [
      "Keep the four custom fasteners. A part designed for one location is always more reliable.",
      "Use the standard fastener in all four places. The field history and the smaller part variety are the reliability evidence.",
      "Keep the custom fasteners and add a preventive task for each. Maintenance data can replace a proven part.",
      "Use all five fasteners. More part numbers increase the chance that one of them is reliable."
    ],
    "answer": 1,
    "why": "Standardization and reuse reduce the number of unproven parts and apply the history already collected. A local custom design does not outweigh missing field evidence. A preventive task does not turn an unproven fastener into a proven one, and adding part numbers does not add reliability. <b>B. Use the standard fastener in all four places. The field history and the smaller part variety are the reliability evidence.</b>",
    "set": 3,
    "qid": "cre:set-3:068",
    "bok": "V.B.2",
    "cognitive": "Apply"
  },
  {
    "sub": "cre-life",
    "stem": "Demand for a spare during the replenishment lead time follows the cumulative probabilities below. What is the smallest stock that gives at least a 0.95 probability that demand does not exceed the stock?",
    "options": [
      "4",
      "6",
      "7",
      "8"
    ],
    "answer": 3,
    "why": "Read the smallest stock whose cumulative probability is at least 0.95. The table gives 0.949 at 7 and 0.979 at 8, so 7 is short.\n\\[\nP(X\\le 8)=0.979\n\\]\nFour is the mean demand, not the 0.95 stock. Six reaches only 0.889. <b>D. 8</b>",
    "set": 3,
    "qid": "cre:set-3:069",
    "bok": "V.C.1",
    "cognitive": "Apply",
    "chart": {
      "type": "data-table",
      "title": "Spare demand during lead time",
      "altText": "For a mean demand of 4 during the lead time, the cumulative probability is 0.629 at 4 spares, 0.889 at 6, 0.949 at 7, and 0.979 at 8.",
      "columns": [
        "Stock",
        "P(demand ≤ stock)"
      ],
      "rows": [
        [
          "4",
          "0.629"
        ],
        [
          "6",
          "0.889"
        ],
        [
          "7",
          "0.949"
        ],
        [
          "8",
          "0.979"
        ]
      ]
    }
  },
  {
    "sub": "cre-life",
    "stem": "The times below are for one corrective action. Active corrective time includes fault isolation, disassembly, interchange, and checkout. Waiting for the part is logistics delay.\n\\[\nT_{active}=t_i+t_d+t_r+t_c\n\\]\nWhat is the active corrective time?",
    "options": [
      "25 minutes",
      "70 minutes",
      "110 minutes",
      "40 minutes"
    ],
    "answer": 1,
    "why": "Add the four active elements. Leave the wait out.\n\\[\nT_{active}=20+15+25+10=70\n\\]\n25 minutes is only the interchange. 40 minutes is the logistics delay. 110 minutes adds that delay to the active time. <b>B. 70 minutes</b>",
    "set": 3,
    "qid": "cre:set-3:070",
    "bok": "V.C.3",
    "cognitive": "Apply",
    "chart": {
      "type": "data-table",
      "title": "Corrective-maintenance elements",
      "altText": "Fault isolation is 20 minutes, disassembly is 15, interchange is 25, and checkout is 10. Waiting for the part is 40 minutes and is logistics delay.",
      "columns": [
        "Element",
        "Minutes",
        "Class"
      ],
      "rows": [
        [
          "Fault isolation",
          "20",
          "Active"
        ],
        [
          "Disassembly",
          "15",
          "Active"
        ],
        [
          "Interchange",
          "25",
          "Active"
        ],
        [
          "Checkout",
          "10",
          "Active"
        ],
        [
          "Waiting for the part",
          "40",
          "Logistics delay"
        ]
      ]
    }
  }
];
})(typeof window!=='undefined'?window:globalThis);
