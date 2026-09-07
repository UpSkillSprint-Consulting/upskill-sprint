(function(global){
  'use strict';
  global.MBB_SET3=[
  {
    "sub": "mbb-enterprise",
    "stem": "A hospital network identifies aging clinical IT as a strategic weakness and value-based reimbursement as an external threat. Its finance and quality teams have verified that errors in the legacy electronic health record cause missed documentation-dependent reimbursement. Three feasible projects address emergency-department boarding, these documentation errors, and cafeteria food waste. None is a mandatory safety or compliance intervention. Which project has the strongest direct alignment with the two named strategic findings?",
    "options": [
      "Prioritize documentation errors, because the verified mechanism links the IT weakness to reimbursement exposure; validate the business case before authorizing implementation.",
      "Prioritize emergency-department boarding, because a visible patient-experience improvement establishes a stronger connection to the two findings than the documented reimbursement mechanism.",
      "Prioritize cafeteria food waste, because a shorter payback would establish stronger strategic alignment even without addressing either of the two named findings.",
      "Give all three projects equal strategic-alignment scores, because feasibility is sufficient to show an equivalent contribution to the two named findings."
    ],
    "answer": 0,
    "why": "The stated evidence connects the IT weakness to a reimbursement consequence through documentation errors. This makes the documentation project the strongest direct strategic fit among these choices, not an automatic implementation approval. Feasibility, financial return, patient experience, and mandatory obligations still belong in the wider selection process. Source alignment: ASQ CMBB Body of Knowledge, I.A; I.B.2; I.E.2. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-001",
    "optionRationales": [
      "Correct. It uses the verified weakness-to-threat mechanism and separates strategic fit from final authorization.",
      "Boarding may be important, but no connection from boarding to the two specific strategic findings is supplied.",
      "Payback and strategic alignment are different criteria; a fast return does not establish the missing linkage.",
      "Feasibility does not demonstrate equal strategic contribution. The documented mechanism distinguishes the projects."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.A; I.B.2; I.E.2"
      }
    ],
    "trap": "Test both stated decision criteria: customer convenience and the documented reimbursement mechanism. A plausible strategic story is not a substitute for that evidence.",
    "distractors": [
      "Correct. It uses the verified weakness-to-threat mechanism and separates strategic fit from final authorization.",
      "Boarding may be important, but no connection from boarding to the two specific strategic findings is supplied.",
      "Payback and strategic alignment are different criteria; a fast return does not establish the missing linkage.",
      "Feasibility does not demonstrate equal strategic contribution. The documented mechanism distinguishes the projects."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A consumer-electronics manufacturer must select an 18-month improvement pipeline while tariff policy and component availability remain materially uncertain. Reliable probabilities for the alternative futures are unavailable. The portfolio committee wants projects that remain useful across plausible conditions and explicit triggers for revisiting contingent investments. Which planning approach best meets this need?",
    "options": [
      "Rank projects using a probability-weighted forecast with equal probabilities for every scenario, treating the resulting expected value as an established risk estimate.",
      "Use one current-state SWOT assessment and freeze the resulting ranking for 18 months, so later external changes do not disrupt consistent portfolio governance.",
      "Supplement SWOT with distinct plausible scenarios, test project robustness across them, and define monitoring indicators and decision triggers for contingent investments.",
      "Choose the project mix optimal under the single most favorable scenario, then use delivery milestones rather than external indicators to decide when to replan."
    ],
    "answer": 2,
    "why": "Scenario analysis makes assumptions about uncertain external conditions visible and tests which investments remain useful across them. It also supports contingent decisions and review triggers. Without defensible probabilities, an equally weighted scenario average is a modeling assumption, not an established expected-value estimate. SWOT remains useful but does not replace the cross-scenario assessment. Source alignment: ASQ CMBB Body of Knowledge, I.A; I.F.4. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-004",
    "optionRationales": [
      "Unsupported equal probabilities create false precision; scenario plausibility alone does not establish likelihood.",
      "A fixed ranking ignores the very external uncertainty the committee needs to manage.",
      "Correct. It evaluates robustness and defines how new evidence will change contingent decisions.",
      "Optimizing for a favorable future does not establish robustness, and delivery milestones do not monitor external assumptions."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.A; I.F.4"
      }
    ],
    "trap": "Plausible scenarios are not probabilities. Without defensible likelihoods, test robustness and define observable triggers rather than inventing an expected-value model.",
    "distractors": [
      "Unsupported equal probabilities create false precision; scenario plausibility alone does not establish likelihood.",
      "A fixed ranking ignores the very external uncertainty the committee needs to manage.",
      "Correct. It evaluates robustness and defines how new evidence will change contingent decisions.",
      "Optimizing for a favorable future does not establish robustness, and delivery milestones do not monitor external assumptions."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "The agreed selection matrix uses the weights and 0–10 ratings below; higher ratings are better on every criterion. X and Y both pass the mandatory eligibility screen, but X has a low resource-availability rating. Ratings are judgment-based and have not undergone sensitivity analysis. Which recommendation correctly uses the numerical results without overstating their precision?",
    "options": [
      "Y scores 6.8 versus X at 6.7; provisionally favor Y, then assess rating sensitivity and resource feasibility before making the final selection.",
      "Y scores 7.0 versus X at 6.6; favor Y, then confirm that both projects can obtain resources before making the final selection.",
      "Both score 6.75 after weighting; treat the projects as numerically tied, then use the agreed strategic-fit rating to select X.",
      "Y scores 6.8 versus X at 6.7; treat that difference as conclusive because formally agreed weights eliminate uncertainty in the judgment-based ratings."
    ],
    "answer": 0,
    "why": "X = 0.40(9) + 0.30(4) + 0.20(8) + 0.10(3) = 6.7. Y = 0.40(5) + 0.30(9) + 0.20(6) + 0.10(9) = 6.8. The 0.1-point lead is a nominal ranking, not a statistical significance result or an automatically inconclusive decision. For example, changing X's financial-return rating from 4 to 5 adds 0.3 points and reverses the ranking. Validate the relevant rating uncertainty and resource constraints. Source alignment: ASQ CMBB Body of Knowledge, I.B.2–3; I.F.4. The scenario-specific conclusion is derived from the stated case.",
    "chart": {
      "type": "data-table",
      "columns": [
        "Criterion",
        "Weight",
        "Project X (raw /10)",
        "Project Y (raw /10)"
      ],
      "rows": [
        [
          "Strategic fit",
          "40%",
          "9",
          "5"
        ],
        [
          "Financial return",
          "30%",
          "4",
          "9"
        ],
        [
          "Risk (10=lowest risk)",
          "20%",
          "8",
          "6"
        ],
        [
          "Resource availability",
          "10%",
          "3",
          "9"
        ]
      ],
      "title": "Agreed project selection matrix",
      "altText": "Weights and ratings for strategic fit, financial return, risk and resource availability. All ratings use a 0–10 scale with higher values better."
    },
    "set": 3,
    "qid": "mbb:set-3:d1-006",
    "optionRationales": [
      "Correct. The arithmetic favors Y, while the small lead and judgment-based inputs warrant sensitivity and feasibility checks.",
      "The weighted totals are 6.8 and 6.7, not 7.0 and 6.6; the proposed feasibility check does not repair the arithmetic.",
      "Averaging the two totals gives 6.75, but does not make either project's own weighted score 6.75.",
      "Agreed weights specify preferences; they do not remove uncertainty in the underlying ratings."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.B.2–3; I.F.4"
      }
    ],
    "trap": "Recompute both weighted totals, then distinguish the nominal ranking from a robust funding decision. The phrase about ratings not being sensitivity-tested is context, not a negative question lead-in.",
    "distractors": [
      "Correct. The arithmetic favors Y, while the small lead and judgment-based inputs warrant sensitivity and feasibility checks.",
      "The weighted totals are 6.8 and 6.7, not 7.0 and 6.6; the proposed feasibility check does not repair the arithmetic.",
      "Averaging the two totals gives 6.75, but does not make either project's own weighted score 6.75.",
      "Agreed weights specify preferences; they do not remove uncertainty in the underlying ratings."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Six months into a cycle-time project, enterprise strategy changes and the affected process is expected to become largely obsolete within 12 months. The Black Belt has achieved a 20% improvement. Remaining implementation would consume scarce capacity, and its future benefits have not been reassessed. Which action should the coaching MBB recommend before approving the remaining work?",
    "options": [
      "Review remaining incremental benefits, costs and strategic fit with the Belt and sponsor; then continue, rescope or close the project through the agreed gate.",
      "Complete the existing charter before reviewing strategic fit, because the achieved improvement and work already invested demonstrate that the remaining implementation is worthwhile.",
      "Close the project automatically when the strategy changes, because potential residual benefits cannot justify work on a process expected to become obsolete.",
      "Pause strategic reassessment until all achieved gains have been monetized, because remaining work cannot be evaluated while any historical benefit remains uncertain."
    ],
    "answer": 0,
    "why": "The decision concerns future incremental value and opportunity cost under current strategy. Past effort is a sunk cost, and a 20% intermediate improvement alone does not establish the value of the remaining work. Nor does expected obsolescence prove there are no worthwhile residual benefits. The sponsor and Belt should review the alternatives, preserve validated gains and use formal change governance. Source alignment: ASQ CMBB Body of Knowledge, I.B.2–3; I.F.2. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-009",
    "optionRationales": [
      "Correct. It reassesses the future decision jointly and allows the evidence to support continuation, rescoping or closure.",
      "Historical effort and achieved gains do not establish that further spending is justified under the changed strategy.",
      "Automatic cancellation skips the comparison of remaining costs, residual benefits and alternative uses of capacity.",
      "Uncertainty about past benefit realization should be tracked, but does not justify postponing assessment of remaining work."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.B.2–3; I.F.2"
      }
    ],
    "trap": "Separate past gains and sunk expenditure from future incremental contribution. The question asks for a reassessment process, not automatic cancellation or continuation.",
    "distractors": [
      "Correct. It reassesses the future decision jointly and allows the evidence to support continuation, rescoping or closure.",
      "Historical effort and achieved gains do not establish that further spending is justified under the changed strategy.",
      "Automatic cancellation skips the comparison of remaining costs, residual benefits and alternative uses of capacity.",
      "Uncertainty about past benefit realization should be tracked, but does not justify postponing assessment of remaining work."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An organization has an executive steering committee, trained Belts and a documented selection process. It records forecast project savings, but has no finance-validated post-closure benefit checks, named sustainment owners or searchable lessons-learned repository. The next investment must address the gap preventing evidence-based assessment of deployment performance. Which package should the MBB prioritize?",
    "options": [
      "Expand Belt certification volumes and report training completions as the principal evidence of deployment performance, while leaving financial follow-up with individual project leaders.",
      "Increase the number of selection-gate reviews and publish forecast savings more frequently, while keeping post-closure checks outside the common governance process.",
      "Establish benefit baselines, finance validation, sustainment ownership and reusable lessons; then use that evidence in deployment reviews and future project selection.",
      "Create a lessons repository and rank projects by submitted forecasts, while treating sponsor sign-off at closure as sufficient evidence that savings have persisted."
    ],
    "answer": 2,
    "why": "The missing controls concern realized and sustained outcomes and organizational learning, not the mere existence of governance or training. Baselines and realization rules support credible benefit measurement; named owners support sustainment; reusable lessons improve future decisions. No single infrastructure feature proves that the whole deployment is mature. Source alignment: ASQ CMBB Body of Knowledge, I.C.2–6; I.F.2. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-012",
    "optionRationales": [
      "Training volume is an input and capability indicator, not a substitute for demonstrated sustained outcomes.",
      "More selection reviews and forecasts do not provide the missing post-closure evidence.",
      "Correct. It closes the measurement, ownership and learning gaps identified in the case.",
      "Knowledge capture helps, but closure sign-off alone does not demonstrate later financial realization or sustainment."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.C.2–6; I.F.2"
      }
    ],
    "trap": "Distinguish activity and forecasts from validated, sustained outcomes. Diagnose the evidence and ownership gaps instead of inferring deployment maturity from training counts.",
    "distractors": [
      "Training volume is an input and capability indicator, not a substitute for demonstrated sustained outcomes.",
      "More selection reviews and forecasts do not provide the missing post-closure evidence.",
      "Correct. It closes the measurement, ownership and learning gaps identified in the case.",
      "Knowledge capture helps, but closure sign-off alone does not demonstrate later financial realization or sustainment."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A DMAIC team has validated that defects in an existing IT service arise from software behavior. It is ready to develop and test a solution, and the delivery team proposes Scrum. Which integration best preserves both iterative delivery and the improvement project's evidence requirements?",
    "options": [
      "Use Scrum to deliver testable increments against the validated requirements, while retaining outcome verification, change controls and the DMAIC sustainment plan.",
      "Treat completion of the Sprint backlog as evidence that the original defect causes have been removed, and use Sprint velocity as the sustained quality measure.",
      "Freeze the detailed software design before the first Sprint, and use Scrum only to assign tasks without adapting the solution to evidence from testing.",
      "Replace the process-outcome baseline with the Definition of Done, because an accepted increment establishes the same evidence as a sustained reduction in defects."
    ],
    "answer": 0,
    "why": "Scrum supports inspection and adaptation while producing usable increments; DMAIC supplies the case's improvement logic and evaluation of process outcomes. Integrating them does not make velocity, backlog completion or the Definition of Done a substitute for evidence that the CTQ improved and remained controlled. This is an appropriate integration for the stated case, not a claim that Scrum is restricted to one DMAIC phase. Source alignment: ASQ CMBB Body of Knowledge, I.D.1; I.D.5–6. The scenario-specific conclusion is derived from the stated case. Technical reference: The Scrum Guide (2020), Scrum Theory; Increment; Definition of Done (https://scrumguides.org/scrum-guide.html).",
    "set": 3,
    "qid": "mbb:set-3:d1-016",
    "optionRationales": [
      "Correct. It combines iterative delivery with verification of the improvement and its sustainment.",
      "Completed work and delivery velocity do not establish a reduction in the targeted process defects.",
      "A fixed solution and task-assignment-only use remove the inspection and adaptation central to Scrum.",
      "The Definition of Done supports increment quality; it is not the same as sustained process-outcome evidence."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.D.1; I.D.5–6"
      },
      {
        "title": "The Scrum Guide (2020), Scrum Theory; Increment; Definition of Done",
        "url": "https://scrumguides.org/scrum-guide.html",
        "locator": "Scrum Theory; Increment; Definition of Done"
      }
    ],
    "trap": "Scrum delivery evidence and process-improvement evidence are different. Preserve testable increments while still verifying the process outcome and its sustainment.",
    "distractors": [
      "Correct. It combines iterative delivery with verification of the improvement and its sustainment.",
      "Completed work and delivery velocity do not establish a reduction in the targeted process defects.",
      "A fixed solution and task-assignment-only use remove the inspection and adaptation central to Scrum.",
      "The Definition of Done supports increment quality; it is not the same as sustained process-outcome evidence."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A plant reports annual quality costs as shown below, on the same accounting basis, with revenue of $80 million. Use the prevention–appraisal–failure model: cost of poor quality (COPQ) includes internal and external failure costs; total cost of quality (COQ) also includes prevention and appraisal. No unresolved safety or compliance emergency changes the cost-screening priority. Which financial interpretation and next step are defensible?",
    "options": [
      "COPQ is 7.25% of revenue; investigate external failures first, and use the ratio to classify the deployment as immature without further evidence.",
      "COPQ is 6.25% of revenue; investigate external failures first, but assess causes and economics before inferring maturity or changing prevention spending.",
      "COPQ is 4.75% of revenue; investigate external failures first, and exclude internal failures because the defects did not reach paying customers.",
      "COPQ is 6.25% of revenue; cut appraisal first, because its $0.6 million cost establishes that inspection is the largest avoidable failure category."
    ],
    "answer": 1,
    "why": "COPQ = $1.2M + $3.8M = $5.0M; $5.0M/$80M = 6.25%. Total COQ = $5.8M, or 7.25%. External failure is the largest listed cost category, making it a reasonable initial investigation target under the stated screening rule. The figures alone do not establish deployment maturity, the avoidable fraction of costs or the economically optimal prevention/appraisal allocation. Internal failures remain part of COPQ even when customers do not receive the defects. Source alignment: ASQ CMBB Body of Knowledge, I.E.1–2; I.F.4. The scenario-specific conclusion is derived from the stated case. Technical reference: ASQ Cost of Quality: prevention, appraisal and COPQ (https://asq.org/quality-resources/cost-of-quality).",
    "chart": {
      "type": "data-table",
      "columns": [
        "Category",
        "Amount",
        "% of revenue ($80M)"
      ],
      "rows": [
        [
          "Internal failure",
          "$1.2M",
          "1.5%"
        ],
        [
          "External failure",
          "$3.8M",
          "4.75%"
        ],
        [
          "Appraisal",
          "$0.6M",
          "0.75%"
        ],
        [
          "Prevention",
          "$0.2M",
          "0.25%"
        ]
      ],
      "title": "Annual quality costs and revenue basis",
      "altText": "Internal failure $1.2 million; external failure $3.8 million; appraisal $0.6 million; prevention $0.2 million. Annual revenue is $80 million."
    },
    "set": 3,
    "qid": "mbb:set-3:d1-019",
    "optionRationales": [
      "7.25% is total COQ, not COPQ, and no validated maturity threshold is supplied.",
      "Correct. It uses the failure-cost definition and distinguishes an investigation priority from a proven intervention or maturity rating.",
      "4.75% includes external failures only; COPQ also includes the $1.2M internal failure cost.",
      "Appraisal is not a failure category, is smaller than either failure category, and cannot be removed solely from its cost."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.E.1–2; I.F.4"
      },
      {
        "title": "ASQ Cost of Quality: prevention, appraisal and COPQ",
        "url": "https://asq.org/quality-resources/cost-of-quality",
        "locator": "What is Cost of Poor Quality (COPQ)?"
      }
    ],
    "trap": "Use the explicitly stated prevention-appraisal-failure definitions. COPQ is failure cost; total COQ also includes prevention and appraisal. Neither ratio alone establishes maturity.",
    "distractors": [
      "7.25% is total COQ, not COPQ, and no validated maturity threshold is supplied.",
      "Correct. It uses the failure-cost definition and distinguishes an investigation priority from a proven intervention or maturity rating.",
      "4.75% includes external failures only; COPQ also includes the $1.2M internal failure cost.",
      "Appraisal is not a failure category, is smaller than either failure category, and cannot be removed solely from its cost."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A CFO compares the company's customer complaint rate of 2.1 per 1,000 transactions with an industry average of 3.5 per 1,000 and concludes that no quality project is justified. Comparable transaction definitions, reporting practices and customer segments have not been verified, and no trend or consequence analysis is presented. Which response is best supported?",
    "options": [
      "Convert both rates to complaints per million and retain the conclusion, because matching the numerical scale resolves the missing comparability and consequence information.",
      "Retain the conclusion provisionally because a lower point estimate establishes that the company's remaining complaints are not economically important enough to investigate.",
      "Reject the external benchmark as unusable in principle, and select projects only from internal historical averages regardless of customer requirements or complaint severity.",
      "Validate comparability, internal trends and customer consequences; a lower point estimate alone does not establish statistical superiority or absence of worthwhile improvement opportunities."
    ],
    "answer": 3,
    "why": "The numerical difference is 1.4 complaints per 1,000 transactions, but denominators and uncertainty are not supplied for an inferential comparison. Comparability must also be checked. Even a credible lower complaint rate would not demonstrate that residual problems lack customer, safety, compliance or economic importance. Changing the rate scale does not repair these omissions. Source alignment: ASQ CMBB Body of Knowledge, I.E.1–2; I.B.3. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-020",
    "optionRationales": [
      "Multiplying both rates by the same conversion factor does not make the underlying definitions or populations comparable.",
      "A favorable point estimate does not establish economic irrelevance or a statistically supported performance difference.",
      "External benchmarks can be useful when appropriately comparable; internal averages are not automatically suitable targets.",
      "Correct. It identifies the missing measurement, inference and decision context without rejecting benchmarking itself."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.E.1–2; I.B.3"
      }
    ],
    "trap": "Two reported rates establish a numerical difference, not a defensible inferential comparison. Check denominator information, comparability and practical consequences.",
    "distractors": [
      "Multiplying both rates by the same conversion factor does not make the underlying definitions or populations comparable.",
      "A favorable point estimate does not establish economic irrelevance or a statistically supported performance difference.",
      "External benchmarks can be useful when appropriately comparable; internal averages are not automatically suitable targets.",
      "Correct. It identifies the missing measurement, inference and decision context without rejecting benchmarking itself."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "For the first financial screen, use the table's annual benefit conditional on project success, assume zero benefit on failure, and calculate expected gross annual benefit as benefit × success probability. Implementation costs have not yet been included. The separate 1–5 risk rating summarizes safety, compliance and delivery exposure not already included in the success probability; higher is worse. Which conclusion is correct?",
    "options": [
      "P4 > P2 > P1 > P3 by expected gross benefit; review costs, capacity and the separate risk exposures before making a funding decision.",
      "P2 > P4 > P1 > P3 by expected gross benefit; review costs, capacity and the separate risk exposures before making a funding decision.",
      "P3 > P1 > P4 > P2 by expected gross benefit; review costs, capacity and the separate risk exposures before making a funding decision.",
      "P4 > P2 > P1 > P3 by expected gross benefit; divide each amount by its ordinal risk rating to obtain a validated risk-adjusted net value."
    ],
    "answer": 0,
    "why": "Expected gross annual benefits are P1: $500K×0.80=$400K; P2: $900K×0.50=$450K; P3: $300K×0.95=$285K; P4: $700K×0.65=$455K. Thus P4 > P2 > P1 > P3, with only $5K between the first two. These are expected gross benefits, not NPVs or net returns. Review the explicitly separate risk exposures and costs without applying the same uncertainty twice. An ordinal risk score is not a validated divisor for a monetary value. Source alignment: ASQ CMBB Body of Knowledge, I.F.1; I.F.4. The scenario-specific conclusion is derived from the stated case.",
    "chart": {
      "type": "data-table",
      "columns": [
        "Project",
        "Benefit if successful",
        "Success probability",
        "Separate risk (1–5)"
      ],
      "rows": [
        [
          "P1",
          "$500,000",
          "80%",
          "2"
        ],
        [
          "P2",
          "$900,000",
          "50%",
          "4"
        ],
        [
          "P3",
          "$300,000",
          "95%",
          "1"
        ],
        [
          "P4",
          "$700,000",
          "65%",
          "3"
        ]
      ],
      "title": "Inputs for the expected gross-benefit screen",
      "altText": "P1: $500,000, 80%, risk 2; P2: $900,000, 50%, risk 4; P3: $300,000, 95%, risk 1; P4: $700,000, 65%, risk 3. Benefits are conditional on success and the separate risk scale is 1 to 5."
    },
    "set": 3,
    "qid": "mbb:set-3:d1-022",
    "optionRationales": [
      "Correct. The ranking is numerical, while final selection still needs the missing costs, constraints and separate risk assessment.",
      "This is the raw-benefit ranking; incorporating success probabilities puts P4 above P2.",
      "This is the success-probability ranking, not the expected-benefit ranking.",
      "The ranking is correct, but division by an ordinal risk rating does not produce a validated net monetary measure."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.F.1; I.F.4"
      }
    ],
    "trap": "Multiply each success-conditional benefit by its success probability under the zero-failure-benefit assumption. Keep gross benefits separate from costs and ordinal risk scores.",
    "distractors": [
      "Correct. The ranking is numerical, while final selection still needs the missing costs, constraints and separate risk assessment.",
      "This is the raw-benefit ranking; incorporating success probabilities puts P4 above P2.",
      "This is the success-probability ranking, not the expected-benefit ranking.",
      "The ranking is correct, but division by an ordinal risk rating does not produce a validated net monetary measure."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "For a baseline planning model, 24 independent projects are ready now. Six fully available Black Belts can each lead one project at a time, and every project requires four months. Assume no leave, setup delays, dependencies or shared-resource bottlenecks. None is mandatory and the committee will prioritize strategic contribution and acceptable risk. Which plan correctly separates modeled capacity from a delivery commitment?",
    "options": [
      "Release all 24 projects now and retain a four-month completion target; review milestone slippage later to decide whether the six Belts need additional support.",
      "Model four sequential waves and 16 months overall; prioritize within each wave and add evidence-based delivery allowances before committing to an operational completion date.",
      "Model three sequential waves and 12 months overall; prioritize within each wave and add evidence-based delivery allowances before committing to an operational completion date.",
      "Model four sequential waves and 16 months overall; promise that completion date without qualification because the capacity calculation already includes disruption and project-duration variability."
    ],
    "answer": 1,
    "why": "With six projects per four-month wave, 24/6=4 waves and 4×4=16 months in the deterministic model. The corresponding modeled throughput is 6×12/4=18 projects per year. This is not a guarantee under actual variability, leave or resource conflicts. Rank ready work under the stated policy, limit active work to supported capacity, and establish a realistic delivery allowance before making a commitment. Source alignment: ASQ CMBB Body of Knowledge, I.C.3; I.F.1–2. The scenario-specific conclusion is derived from the stated case.",
    "chart": {
      "type": "data-table",
      "title": "Baseline capacity-model inputs",
      "columns": [
        "Planning input",
        "Value"
      ],
      "rows": [
        [
          "Ready projects",
          "24"
        ],
        [
          "Available Black Belts",
          "6"
        ],
        [
          "Concurrent projects per Belt",
          "1"
        ],
        [
          "Duration of each project",
          "4 months"
        ]
      ],
      "altText": "24 ready projects; six fully available Black Belts; one project at a time per Belt; four months per project."
    },
    "set": 3,
    "qid": "mbb:set-3:d1-023",
    "optionRationales": [
      "Giving each Belt four concurrent projects does not multiply the stated capacity or remove the total work requirement.",
      "Correct. It calculates the baseline and distinguishes the simplified model from an operational promise.",
      "Three waves complete only 18 projects; 24 require four waves at six projects per wave.",
      "The arithmetic excludes disruptions and variability by assumption; it cannot be claimed to have allowed for them."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.C.3; I.F.1–2"
      }
    ],
    "trap": "Compute sequential waves at the stated concurrent capacity. A deterministic planning baseline is not a promise that real disruptions and variation have been covered.",
    "distractors": [
      "Giving each Belt four concurrent projects does not multiply the stated capacity or remove the total work requirement.",
      "Correct. It calculates the baseline and distinguishes the simplified model from an operational promise.",
      "Three waves complete only 18 projects; 24 require four waves at six projects per wave.",
      "The arithmetic excludes disruptions and variability by assumption; it cannot be claimed to have allowed for them."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "The pipeline begins Q1 with 12 projects in progress. In each of Q1–Q4, eight projects start; completions are 7, 6, 5 and 4 respectively. No projects are cancelled, reclassified or reopened. The plot shows reconciled quarter-end WIP. Which interpretation and next step are defensible?",
    "options": [
      "The pattern proves that Belt multitasking caused the slowdown; reduce the Belt count first and use the next quarter's completions to confirm that diagnosis.",
      "The latest 22 projects divided by four completions establishes a steady-state mean lead time of 5.5 quarters, so no further flow history is needed.",
      "The increasing WIP establishes improved pipeline productivity; maintain eight starts per quarter and use the larger active-project count as the principal success measure.",
      "Intake exceeds completions and WIP accumulates; investigate age, blocked work, resources and scope changes before choosing an intake limit or targeted capacity intervention."
    ],
    "answer": 3,
    "why": "The quarter-end balances are 12+8−7=13, 13+8−6=15, 15+8−5=18 and 18+8−4=22. This verifies accumulation, not its root cause. Capacity constraints, blocked dependencies, changing scope or project mix could contribute. Little's Law relates compatible long-run averages; dividing a growing system's latest WIP snapshot by one quarter's completions is not an established steady-state mean lead time. Source alignment: ASQ CMBB Body of Knowledge, I.F.2; I.F.4. The scenario-specific conclusion is derived from the stated case.",
    "chart": {
      "type": "time-series",
      "title": "Reconciled projects in progress at quarter-end",
      "labels": [
        "Q1",
        "Q2",
        "Q3",
        "Q4"
      ],
      "data": [
        13,
        15,
        18,
        22
      ],
      "xLabel": "Quarter",
      "yLabel": "Projects in progress",
      "decimals": 0,
      "altText": "Quarter-end WIP is 13 in Q1, 15 in Q2, 18 in Q3 and 22 in Q4. Opening Q1 WIP is 12; eight projects start each quarter and completions are 7, 6, 5 and 4."
    },
    "set": 3,
    "qid": "mbb:set-3:d1-025",
    "optionRationales": [
      "Multitasking is a hypothesis, not a proven cause, and reducing capacity is not supported by the observed aggregates.",
      "The ratio is 5.5 quarters, but its inputs are a snapshot and one interval from a changing system, not compatible stable averages.",
      "WIP is unfinished inventory, not output; increasing WIP with falling completions does not demonstrate productivity improvement.",
      "Correct. It distinguishes the reconciled flow pattern from a causal diagnosis and gathers evidence for an appropriate intervention."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.F.2; I.F.4"
      }
    ],
    "trap": "Reconcile opening work plus starts minus completions in every period. Accumulation does not identify its cause or establish steady-state mean lead time.",
    "distractors": [
      "Multitasking is a hypothesis, not a proven cause, and reducing capacity is not supported by the observed aggregates.",
      "The ratio is 5.5 quarters, but its inputs are a snapshot and one interval from a changing system, not compatible stable averages.",
      "WIP is unfinished inventory, not output; increasing WIP with falling completions does not demonstrate productivity improvement.",
      "Correct. It distinguishes the reconciled flow pattern from a causal diagnosis and gathers evidence for an appropriate intervention."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A logistics company targets on-time-in-full delivery (OTIF). The warehouse improves orders picked per hour and transportation improves cost per mile, but OTIF declines. The available data do not isolate causes. Which MBB response best addresses the suspected metric-alignment failure without assuming it has already been proven?",
    "options": [
      "Tighten both local efficiency targets first, because improving their individual performance establishes that they must ultimately improve the enterprise service measure.",
      "Replace both local measures with OTIF alone, because diagnostic efficiency measures cannot contribute to an aligned performance-management system.",
      "Merge the warehouse and transportation teams before analyzing failure modes, because the existence of two departments establishes the source of the OTIF decline.",
      "Test whether local gains shift errors or delays downstream; pair efficiency measures with relevant quality and delivery guardrails and evaluate the end-to-end effect."
    ],
    "answer": 3,
    "why": "The pattern is consistent with local optimization at the system's expense, but does not establish that the local targets caused the OTIF decline. Examine the actual failure modes, incentives and handoffs, as well as alternative explanations. Balanced guardrails can preserve useful efficiency information while preventing its pursuit from undermining the enterprise outcome. Source alignment: ASQ CMBB Body of Knowledge, I.B.1–3. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-027",
    "optionRationales": [
      "A local improvement is not evidence of a favorable end-to-end effect; tighter targets could worsen an untested tradeoff.",
      "Replacing every diagnostic measure with the top-level outcome sacrifices information; complementary measures can be aligned.",
      "Organizational structure alone does not identify the failure mechanism or justify a merger.",
      "Correct. It tests the mechanism and balances local efficiency against the intended enterprise outcome."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.B.1–3"
      }
    ],
    "trap": "Treat local optimization as a hypothesis consistent with the pattern, not a proven cause. Preserve useful local measures while testing their end-to-end effects.",
    "distractors": [
      "A local improvement is not evidence of a favorable end-to-end effect; tighter targets could worsen an untested tradeoff.",
      "Replacing every diagnostic measure with the top-level outcome sacrifices information; complementary measures can be aligned.",
      "Organizational structure alone does not identify the failure mechanism or justify a merger.",
      "Correct. It tests the mechanism and balances local efficiency against the intended enterprise outcome."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A bank's customers are satisfied with loan-processing speed. Its compliance team has confirmed a binding disclosure requirement taking effect in 12 months, and the current process cannot meet it without redesign. Management has not yet reserved implementation capacity. Which pipeline decision is most defensible?",
    "options": [
      "Rank the redesign only by customer-satisfaction survey results, because a process change without expressed customer dissatisfaction has no validated improvement justification.",
      "Leave the redesign in the discretionary queue until it outperforms every service project financially, because one ranking rule should govern all project categories.",
      "Treat the confirmed requirement and deadline as mandatory constraints, reserve a feasible compliance path, and then optimize discretionary projects within the remaining capacity.",
      "Begin the redesign after the requirement takes effect, because the implementation capacity cannot be justified until the first noncompliance event has been observed."
    ],
    "answer": 2,
    "why": "A confirmed mandatory requirement is not simply another discretionary benefit score. The portfolio must provide a feasible path to timely compliance, including dependencies and capacity, while prioritizing the remaining work. Customer satisfaction with speed does not show that the disclosure obligation is met. The regulatory facts here are stipulated by the case, not a claim about a particular jurisdiction's current law. Source alignment: ASQ CMBB Body of Knowledge, I.F.3; I.E.2. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-030",
    "optionRationales": [
      "VOC data do not supersede an independently confirmed obligation.",
      "Treating mandatory compliance as freely exchangeable for discretionary benefits can produce an infeasible or noncompliant portfolio.",
      "Correct. It protects the confirmed deadline and then makes the constrained discretionary allocation.",
      "Waiting until the effective date or an observed failure risks knowingly missing the required implementation window."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.F.3; I.E.2"
      }
    ],
    "trap": "Treat the confirmed obligation and deadline as case facts. A mandatory feasibility constraint is not interchangeable with a discretionary satisfaction or benefit score.",
    "distractors": [
      "VOC data do not supersede an independently confirmed obligation.",
      "Treating mandatory compliance as freely exchangeable for discretionary benefits can produce an infeasible or noncompliant portfolio.",
      "Correct. It protects the confirmed deadline and then makes the constrained discretionary allocation.",
      "Waiting until the effective date or an observed failure risks knowingly missing the required implementation window."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An aerospace company awards its own internal Belt qualifications. Green Belt advancement to Black Belt currently depends only on each manager's discretion, so similarly performing candidates receive different decisions across departments. Which infrastructure change best addresses consistency without treating the company's pathway as an ASQ certification requirement?",
    "options": [
      "Set one mandatory calendar tenure for every candidate and retain individual managers' uncalibrated judgments as the only assessment of demonstrated project competence.",
      "Define common competency and project-evidence criteria, calibrate assessors and document review decisions, while allowing a transparent process for justified exceptions.",
      "Replace all project evidence with course attendance, because uniform training hours establish equivalent applied Black Belt competence across the departments.",
      "Permit departments to keep separate undocumented advancement criteria, and use a single corporate certificate design to communicate consistent qualification standards."
    ],
    "answer": 1,
    "why": "The gap is inconsistent internal qualification evidence and decisions. Common criteria, calibrated assessment and transparent review improve comparability while preserving a documented exception mechanism. Attendance, tenure or a common certificate do not establish equivalent demonstrated competence. This internal pathway is not a statement of ASQ eligibility rules. Source alignment: ASQ CMBB Body of Knowledge, I.C.3–4. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-034",
    "optionRationales": [
      "Uniform tenure does not resolve differences in assessed competence or uncalibrated decision standards.",
      "Correct. It standardizes the evidence and review process without inventing external certification requirements.",
      "Attendance is evidence of participation, not sufficient evidence of applied project and technical competence.",
      "A common certificate design does not make undocumented department-specific criteria equivalent."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.C.3–4"
      }
    ],
    "trap": "This is an internal qualification system, not an ASQ eligibility rule. Compare the evidence standards and assessor calibration rather than certificate appearance or attendance.",
    "distractors": [
      "Uniform tenure does not resolve differences in assessed competence or uncalibrated decision standards.",
      "Correct. It standardizes the evidence and review process without inventing external certification requirements.",
      "Attendance is evidence of participation, not sufficient evidence of applied project and technical competence.",
      "A common certificate design does not make undocumented department-specific criteria equivalent."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An airline allocates all 14 improvement projects to on-time departure, its top strategic KPI. Portfolio review has not established whether the projects share benefit streams or whether uncovered baggage, service and maintenance risks require intervention. There is no evidence yet that equal allocation across these areas is warranted. What should the MBB recommend before accepting the concentration?",
    "options": [
      "Accept the concentration solely because departure performance is the top KPI; treat overlapping benefits and uncovered risks as matters for individual project closure reviews.",
      "Divide capacity equally among the four areas immediately, because equal project counts establish an economically and strategically balanced improvement portfolio.",
      "Cancel every departure project with a shared process step, because shared process scope establishes that their incremental benefits must be identical.",
      "Assess marginal benefits, overlapping claims and uncovered material risks; retain or adjust the concentration according to that evidence and the approved strategic constraints."
    ],
    "answer": 3,
    "why": "A concentrated portfolio can be defensible, but the top KPI alone does not prove that every additional project adds value or that other material exposures are covered. Assess incremental contribution, interactions and risk constraints. Neither automatic equal diversification nor blanket cancellation of projects with shared steps follows from the case. Source alignment: ASQ CMBB Body of Knowledge, I.F.1–4. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-037",
    "optionRationales": [
      "The top priority does not eliminate the need for portfolio-level benefit and risk analysis before committing resources.",
      "Equal counts are not a demonstrated optimum and can disregard strategic value and project size.",
      "Shared scope creates a need to investigate interactions; it does not prove identical benefits.",
      "Correct. It tests whether concentration remains justified instead of assuming either concentration or diversification is inherently optimal."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.F.1–4"
      }
    ],
    "trap": "Strategic concentration can be justified, but a top KPI does not validate every marginal project. Check overlapping benefits and uncovered material risks before reallocating.",
    "distractors": [
      "The top priority does not eliminate the need for portfolio-level benefit and risk analysis before committing resources.",
      "Equal counts are not a demonstrated optimum and can disregard strategic value and project size.",
      "Shared scope creates a need to investigate interactions; it does not prove identical benefits.",
      "Correct. It tests whether concentration remains justified instead of assuming either concentration or diversification is inherently optimal."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A bank's false-positive rate in fraud detection has increased over 18 months, inconveniencing legitimate customers. Multiple rules and vendor updates changed during that period; no cause has been validated. The existing process may still be capable of meeting requirements. Which approach best combines method selection with protection against reducing detection of actual fraud?",
    "options": [
      "Commit to replacing the entire platform through DMADV before validating the present process's limitations, using architecture novelty as evidence that the redesign will be superior.",
      "Run a rapid threshold-reduction exercise and use fewer customer complaints as sufficient success evidence, without evaluating missed fraud or changes in the underlying transaction mix.",
      "Roll back every vendor update and attribute any resulting reduction in false positives to the rollback, without separating the concurrent changes or checking fraud losses.",
      "Use DMAIC to validate definitions, segment the changes and test causes, while treating fraud detection and losses as guardrails when evaluating any reduction in false positives."
    ],
    "answer": 3,
    "why": "An existing process with an unexplained deterioration supports DMAIC before committing to a replacement. Verify measurement definitions, denominators and relevant transaction mix, then investigate the candidate causes. Fewer false positives can be achieved simply by flagging fewer transactions; that is not a satisfactory improvement if missed fraud or losses increase. Redesign remains an option if analysis establishes that the existing process cannot meet requirements. Source alignment: ASQ CMBB Body of Knowledge, I.D.1–2; I.B.3. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-041",
    "optionRationales": [
      "The case has not established the need for a new design or the inadequacy of the existing process.",
      "Complaint reduction alone cannot establish that the fraud-detection tradeoff is acceptable.",
      "A wholesale rollback confounds changes and can introduce other adverse outcomes; timing alone does not identify causes.",
      "Correct. It selects a suitable investigation framework and protects the intended detection outcome."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.D.1–2; I.B.3"
      }
    ],
    "trap": "Reducing false positives is not sufficient if missed fraud or losses increase. Investigate the existing process and preserve detection-performance guardrails.",
    "distractors": [
      "The case has not established the need for a new design or the inadequacy of the existing process.",
      "Complaint reduction alone cannot establish that the fraud-detection tradeoff is acceptable.",
      "A wholesale rollback confounds changes and can introduce other adverse outcomes; timing alone does not identify causes.",
      "Correct. It selects a suitable investigation framework and protects the intended detection outcome."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A retailer proposes selecting its improvement pipeline solely from store-level annual budget variances. Leadership also has approved objectives for customer retention, digital capability and positioning over three years, but these are absent from the selection criteria. Which correction most directly addresses the planning gap?",
    "options": [
      "Exclude budget and cost information from project selection, because financial control measures cannot contribute to a forward-looking strategic improvement portfolio.",
      "Use the largest unfavorable budget variances as the complete project ranking, because short-term financial gaps necessarily capture the approved longer-term objectives.",
      "Keep budget performance as one input and add explicit alignment to the approved customer, capability and positioning objectives, subject to resource and risk constraints.",
      "Replace all operational measures with three-year revenue forecasts, because using a longer financial horizon alone makes a project portfolio strategically complete."
    ],
    "answer": 2,
    "why": "Budget variance is relevant evidence, but in this case it omits approved strategic objectives. The remedy is to connect project selection to those objectives while retaining financial discipline and feasibility. Neither deleting financial measures nor merely extending the financial forecast horizon supplies the missing alignment. Source alignment: ASQ CMBB Body of Knowledge, I.A; I.B.2–3. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-044",
    "optionRationales": [
      "Financial performance remains relevant; the flaw is exclusive reliance on it, not its inclusion.",
      "The case explicitly states strategic objectives that are not represented by the budget-only selection rule.",
      "Correct. It integrates the omitted strategic dimensions without abandoning financial discipline.",
      "A longer forecast is still incomplete unless the stated nonfinancial objectives and constraints are represented."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.A; I.B.2–3"
      }
    ],
    "trap": "The defect is exclusive reliance on budget variance despite omitted strategic objectives. Financial evidence need not be discarded to repair that omission.",
    "distractors": [
      "Financial performance remains relevant; the flaw is exclusive reliance on it, not its inclusion.",
      "The case explicitly states strategic objectives that are not represented by the budget-only selection rule.",
      "Correct. It integrates the omitted strategic dimensions without abandoning financial discipline.",
      "A longer forecast is still incomplete unless the stated nonfinancial objectives and constraints are represented."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A food bank surveys only recipients who returned for a second visit. Satisfaction is high, and management concludes that the distribution process has no important access or service problems for all first-time recipients. The experiences and reasons for non-return are unknown. Which critique and follow-up are most defensible?",
    "options": [
      "Increase the number of returning recipients surveyed, because a larger sample drawn from the same returner-only frame will remove the exclusion of non-returners.",
      "Assign low satisfaction to every non-returner, because absence of a repeat visit demonstrates that an access or service failure caused the person not to return.",
      "Generalize the results to all first-time recipients, because choosing to return demonstrates that the sampling frame is representative of the population of interest.",
      "Treat the returner-only frame as a selection limitation; seek feasible, respectful feedback from first-time recipients and non-returners without assuming why they did not return."
    ],
    "answer": 3,
    "why": "The sampling frame excludes non-returners, so the returners' satisfaction cannot by itself characterize all first-time recipients. Some people might not return because of barriers, while others might no longer need the service; the case does not identify the direction or size of bias. Expanding a sample within the same restricted frame does not resolve the coverage limitation. Source alignment: ASQ CMBB Body of Knowledge, I.E.1–2. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-048",
    "optionRationales": [
      "Larger sample size can improve precision within returners but does not include the excluded population.",
      "Non-return does not establish dissatisfaction or a service failure; the reasons must be investigated.",
      "Return behavior is the selection mechanism, not evidence of representativeness for all recipients.",
      "Correct. It identifies the coverage/selection issue and gathers missing evidence without imputing negative experiences."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.E.1–2"
      }
    ],
    "trap": "Return status defines the restricted sampling frame; it does not reveal why people did not return. More observations from that same frame do not include the excluded population.",
    "distractors": [
      "Larger sample size can improve precision within returners but does not include the excluded population.",
      "Non-return does not establish dissatisfaction or a service failure; the reasons must be investigated.",
      "Return behavior is the selection mechanism, not evidence of representativeness for all recipients.",
      "Correct. It identifies the coverage/selection issue and gathers missing evidence without imputing negative experiences."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An automotive supplier's five-year strategy assumes stable demand for its present component mix. Six months later, credible customer forecasts indicate that a technology transition could remove 40% of that demand within three years. Several pipeline projects concern product families unaffected by the transition. Which governance action is best?",
    "options": [
      "Trigger an executive review of the changed demand assumptions, segment affected and unaffected projects, and reauthorize, rescope or stop investments using their revised strategic contribution.",
      "Wait for the next five-year planning cycle before revisiting the pipeline, because changing an approved strategy earlier would invalidate the original governance process.",
      "Keep all existing project rankings unchanged until the forecast decline becomes realized, because prospective evidence cannot justify changing the current allocation of improvement resources.",
      "Cancel the entire improvement pipeline immediately, because a 40% demand threat establishes that every existing project must now have negative strategic or financial value."
    ],
    "answer": 0,
    "why": "The material change challenges a core planning assumption and warrants formal review before the demand loss is realized. The case also identifies unaffected product families, so blanket cancellation is unsupported. Review the evidence, dependencies and future incremental value of each project segment, then use the agreed approval process to update allocations. Source alignment: ASQ CMBB Body of Knowledge, I.A; I.F.2. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-051",
    "optionRationales": [
      "Correct. It responds to material new evidence through formal review while distinguishing affected from unaffected work.",
      "A planning horizon does not prohibit trigger-based reassessment of assumptions during that horizon.",
      "Credible prospective evidence is relevant to future investment decisions; waiting for realized loss can waste capacity.",
      "A threat to part of demand does not establish negative value for every project, particularly those in unaffected families."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.A; I.F.2"
      }
    ],
    "trap": "Respond to changed assumptions before losses materialize, but distinguish affected from unaffected projects. A demand threat does not justify freezing or cancelling every project.",
    "distractors": [
      "Correct. It responds to material new evidence through formal review while distinguishing affected from unaffected work.",
      "A planning horizon does not prohibit trigger-based reassessment of assumptions during that horizon.",
      "Credible prospective evidence is relevant to future investment decisions; waiting for realized loss can waste capacity.",
      "A threat to part of demand does not establish negative value for every project, particularly those in unaffected families."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A mine's highest recorded quality cost is ore-grade variability. Near-miss reports have also risen for two quarters, but exposure, reporting participation and potential severity have not been analyzed; no injury cost has yet been recorded. Which MBB recommendation best supports responsible pipeline decisions?",
    "options": [
      "Infer that hazard frequency has necessarily increased and give every reported near miss the same priority, without checking exposure, reporting changes or potential consequence.",
      "Initiate competent safety review and prompt control of identified hazards; assess exposure, severity and reporting changes, then integrate necessary safety actions with the improvement portfolio.",
      "Fund only the ore-grade project until an injury creates a monetary loss, because an unrealized safety consequence cannot form a valid basis for resource allocation.",
      "Assume the reports reflect improved reporting culture and defer hazard review, because a rise in near-miss reporting is sufficient evidence that underlying risk has decreased."
    ],
    "answer": 1,
    "why": "Near-miss reports warrant timely investigation, but a count increase alone does not distinguish greater exposure, more hazards or improved reporting. Evaluate potential severity, controls, exposure and reporting practice with competent safety personnel. Do not wait for an injury cost; required or urgent hazard controls should not wait for a discretionary project-ranking exercise. The analysis determines whether longer-term safety work takes priority over or accompanies the ore-grade project. Source alignment: ASQ CMBB Body of Knowledge, I.E.1; I.F.4. The scenario-specific conclusion is derived from the stated case. Technical reference: OSHA Recommended Practices: Program Evaluation and Improvement (https://www.osha.gov/safety-management/program-evaluation).",
    "set": 3,
    "qid": "mbb:set-3:d1-055",
    "optionRationales": [
      "Counts alone do not establish the mechanism, and identical treatment ignores different potential consequences and urgency.",
      "Correct. It protects workers promptly and uses appropriate evidence rather than a simplistic ranking of reported counts or realized costs.",
      "Absence of a realized injury cost does not establish absence of serious risk or remove the need for preventive action.",
      "Improved reporting is one possible explanation, not proof that hazards are controlled or risk has fallen."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.E.1; I.F.4"
      },
      {
        "title": "OSHA Recommended Practices: Program Evaluation and Improvement",
        "url": "https://www.osha.gov/safety-management/program-evaluation",
        "locator": "Action items 1–3; leading and lagging indicators"
      }
    ],
    "trap": "Near-miss counts are not direct measurements of hazard frequency or severity. Review reporting and exposure while promptly controlling identified serious hazards.",
    "distractors": [
      "Counts alone do not establish the mechanism, and identical treatment ignores different potential consequences and urgency.",
      "Correct. It protects workers promptly and uses appropriate evidence rather than a simplistic ranking of reported counts or realized costs.",
      "Absence of a realized injury cost does not establish absence of serious risk or remove the need for preventive action.",
      "Improved reporting is one possible explanation, not proof that hazards are controlled or risk has fallen."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A law firm adopts a strategy of improving client retention through service quality. Associates are still evaluated solely on billable hours. No service-quality or retention-related expectations have been assigned to them, and no review has tested how their incentives support the new strategy. What is the most precise diagnosis?",
    "options": [
      "Billable hours must be abandoned as an operational measure, because an existing efficiency or revenue measure cannot coexist with a new client-retention objective.",
      "No alignment gap exists until retention actually declines, because the absence of a measured adverse result proves that the current evaluation system supports the strategy.",
      "The evaluation system lacks a demonstrated service-quality linkage; retain useful financial measures but add and validate role-appropriate expectations and balanced incentives.",
      "Every existing metric must receive a new name and numerical target, because any metric retained after a strategy change is necessarily evidence of failed deployment."
    ],
    "answer": 2,
    "why": "The gap is the missing linkage and incentive balance, not the age of the billable-hours measure. An existing measure can remain useful when its role is justified and it is balanced with the new objectives. Clarify what associates can influence, add suitable expectations, and assess whether the incentive system supports service quality and retention. Source alignment: ASQ CMBB Body of Knowledge, I.B.1–3. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-058",
    "optionRationales": [
      "An old measure can retain diagnostic or financial value when balanced with the strategic objective.",
      "A governance and incentive gap can be identified before a downstream adverse outcome is observed.",
      "Correct. It addresses the missing role-level linkage without requiring arbitrary replacement of every existing measure.",
      "Renaming or changing a target does not by itself establish alignment, and retaining a valid measure is not necessarily a failure."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.B.1–3"
      }
    ],
    "trap": "Metric age is not the alignment test. Diagnose missing role-level outcome linkage and incentive balance without assuming every legacy measure must be replaced.",
    "distractors": [
      "An old measure can retain diagnostic or financial value when balanced with the strategic objective.",
      "A governance and incentive gap can be identified before a downstream adverse outcome is observed.",
      "Correct. It addresses the missing role-level linkage without requiring arbitrary replacement of every existing measure.",
      "Renaming or changing a target does not by itself establish alignment, and retaining a valid measure is not necessarily a failure."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An agribusiness can collect required field data only during a five-month growing season. Scope definition, measurement-system preparation and staff training can occur beforehand. Assigning full-time Belts on a season-blind quarterly cycle leaves them waiting for field data. Which sequencing policy best uses capacity without substituting estimates for required observations?",
    "options": [
      "Plan backward from the field-data window, complete valid preparatory work beforehand, and time intensive collection and Belt assignments to readiness, season and competing portfolio needs.",
      "Delay every project activity until the growing season starts, because scope definition and measurement preparation must wait for the same field observations as the analysis.",
      "Keep full-time assignments unchanged through the off-season and extend deadlines, because waiting time does not consume capacity that could support other ready projects.",
      "Use estimated off-season observations as replacements for required field measurements, because maintaining a standard quarterly cycle is more important than the specified evidence requirements."
    ],
    "answer": 0,
    "why": "The seasonal window constrains field collection, not necessarily all project work. Work backward from that window, complete legitimate preparation in advance, and allocate scarce Belt capacity across ready tasks and other projects. Do not fabricate or substitute data simply to preserve an administrative schedule. Avoid assigning full-time capacity to known blocked work when useful alternatives exist. Source alignment: ASQ CMBB Body of Knowledge, I.C.3; I.F.1–2. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-062",
    "optionRationales": [
      "Correct. It recognizes the real constraint while separating preparatory tasks from season-dependent work.",
      "The case explicitly states preparatory tasks that can occur earlier; delaying them wastes the available window.",
      "A full-time assignment to blocked work can displace productive work and does not eliminate the underlying wait.",
      "Estimated substitutes do not meet the stipulated field-evidence requirement and can undermine the analysis."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.C.3; I.F.1–2"
      }
    ],
    "trap": "Separate season-dependent data collection from valid preparatory work. Schedule capacity around the real evidence window without substituting fabricated observations.",
    "distractors": [
      "Correct. It recognizes the real constraint while separating preparatory tasks from season-dependent work.",
      "The case explicitly states preparatory tasks that can occur earlier; delaying them wastes the available window.",
      "A full-time assignment to blocked work can displace productive work and does not eliminate the underlying wait.",
      "Estimated substitutes do not meet the stipulated field-evidence requirement and can undermine the analysis."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A Six Sigma office reports $8.5 million in finance-validated gross annual cash benefits before its $1.2 million annual deployment cost. For this comparison, the cost is complete, benefits are attributable and non-duplicated, and both cover the same year; ignore taxes and discounting. Define benefit–cost ratio as benefits/cost and simple net ROI as (benefits−cost)/cost. Which board presentation is most defensible?",
    "options": [
      "Report a 6.08:1 benefit–cost ratio and 708.3% net ROI, then discuss benefit durability, organizational capability and forward-looking costs before deciding next year's funding.",
      "Report a 7.08:1 benefit–cost ratio and 608.3% net ROI, then treat one positive year as sufficient evidence to approve the same funding indefinitely.",
      "Report a 7.08:1 benefit–cost ratio and 608.3% net ROI, then discuss benefit durability, organizational capability and forward-looking costs before deciding next year's funding.",
      "Report a 7.08:1 benefit–cost ratio and 708.3% net ROI, then discuss benefit durability, organizational capability and forward-looking costs before deciding next year's funding."
    ],
    "answer": 2,
    "why": "Benefit–cost ratio = 8.5/1.2 = 7.0833:1. Net benefit = $7.3M and simple net ROI = 7.3/1.2 = 6.0833, or 608.3%. The gross benefit/cost ratio is not itself net ROI. These stipulated one-year figures support historical performance but do not determine future incremental value. Review persistence of benefits, upcoming opportunities, capability needs and alternative uses of funds; quantify rebuilding costs only when evidence supports them. Source alignment: ASQ CMBB Body of Knowledge, I.C.3; I.C.6. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-065",
    "optionRationales": [
      "The two measures are confused: 6.0833 is net benefit/cost, while 708.3% expresses gross benefits as a percentage of cost.",
      "The arithmetic is correct, but historical one-year returns do not establish that the same future funding is always justified.",
      "Correct. It separates the two financial measures and combines historical evidence with a forward-looking funding assessment.",
      "708.3% is gross benefit/cost expressed as a percentage, not the defined net ROI after subtracting cost."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.C.3; I.C.6"
      }
    ],
    "trap": "Benefits divided by cost is the benefit-cost ratio. Net ROI subtracts cost first. Historical return and the case for future incremental funding are separate judgments.",
    "distractors": [
      "The two measures are confused: 6.0833 is net benefit/cost, while 708.3% expresses gross benefits as a percentage of cost.",
      "The arithmetic is correct, but historical one-year returns do not establish that the same future funding is always justified.",
      "Correct. It separates the two financial measures and combines historical evidence with a forward-looking funding assessment.",
      "708.3% is gross benefit/cost expressed as a percentage, not the defined net ROI after subtracting cost."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An enterprise has measurable three-year objectives, named owners, aligned measures and a qualified pipeline. Its environment is changing rapidly. The steering committee meets quarterly but has no rule for revisiting the assumptions that justified project funding between meetings. Which additional control best closes this specific governance gap?",
    "options": [
      "Require all projects to meet their original financial forecasts regardless of changed assumptions, so accountability remains consistent throughout the three-year strategic horizon.",
      "Let each project leader revise scope and benefits privately when conditions change, so adaptation remains fast without using a common approval or audit process.",
      "Define material-change triggers, accountable reviewers and documented reauthorization rules, including whether work continues, pauses, changes or closes while the review is completed.",
      "Schedule more frequent status presentations without revisiting funding assumptions, because improved reporting frequency provides the same control as formal strategic reauthorization."
    ],
    "answer": 2,
    "why": "The missing control is a trigger-to-decision mechanism for material changes between scheduled reviews. Specify what triggers reassessment, who is accountable, what evidence is reviewed and how interim work and reauthorization are handled. More reporting alone does not provide this decision mechanism, while undocumented unilateral revisions weaken control. The case is complete without relying on any other exam question. Source alignment: ASQ CMBB Body of Knowledge, I.A; I.F.2. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-069",
    "optionRationales": [
      "Holding teams to obsolete assumptions can preserve a plan that no longer produces the intended value.",
      "Private revisions bypass the common decision and audit controls needed for portfolio-level tradeoffs.",
      "Correct. It establishes a usable response to material changes rather than merely increasing reporting.",
      "Status frequency does not determine how changed strategic assumptions alter authorization or allocation."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.A; I.F.2"
      }
    ],
    "trap": "The missing control is a trigger-to-decision rule between scheduled meetings. More reporting alone is not formal reassessment or reauthorization.",
    "distractors": [
      "Holding teams to obsolete assumptions can preserve a plan that no longer produces the intended value.",
      "Private revisions bypass the common decision and audit controls needed for portfolio-level tradeoffs.",
      "Correct. It establishes a usable response to material changes rather than merely increasing reporting.",
      "Status frequency does not determine how changed strategic assumptions alter authorization or allocation."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "After an enterprise changes strategy, an MBB reviews a proposed local performance metric. Its owner has explained the calculation, but not how the metric supports the new outcome or what undesirable behavior its incentive might create. The metric existed before the strategy change. Which review rule best determines whether to retain, modify or replace it?",
    "options": [
      "Require a credible outcome linkage, assess gaming and end-to-end tradeoffs, and add guardrails where needed; retain an existing metric when its continuing role is justified.",
      "Require every local metric to be numerically identical to the enterprise outcome, because any adapted local measure necessarily weakens the strategic link.",
      "Approve any metric that changed its target after the strategy announcement, because a new target demonstrates both outcome alignment and absence of adverse incentive effects.",
      "Replace every pre-existing metric even when its contribution remains valid, because metric age is a sufficient test of whether the new strategy was deployed."
    ],
    "answer": 0,
    "why": "Alignment depends on a defensible contribution to the strategic outcome and an incentive system that does not undermine it. Examine operational definitions, what the role can influence, gaming and downstream effects; use complementary guardrails where appropriate. A valid existing measure may be retained, and a renamed or retargeted measure may still be misaligned. This prospective approval rule differs from diagnosing an observed outcome decline. Source alignment: ASQ CMBB Body of Knowledge, I.B.1–3. The scenario-specific conclusion is derived from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-070",
    "optionRationales": [
      "Correct. It assesses the mechanism and tradeoffs rather than treating novelty or uniformity as evidence of alignment.",
      "Role-appropriate local measures can support an enterprise outcome without being identical to it.",
      "A changed target does not demonstrate either a valid causal contribution or protection against unintended behavior.",
      "Age is not a validity criterion; a retained measure can remain appropriate under the new strategy."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.B.1–3"
      }
    ],
    "trap": "Test outcome linkage, gaming and end-to-end tradeoffs. Renaming or retargeting a metric does not establish alignment, and a valid existing measure may remain useful.",
    "distractors": [
      "Correct. It assesses the mechanism and tradeoffs rather than treating novelty or uniformity as evidence of alignment.",
      "Role-appropriate local measures can support an enterprise outcome without being identical to it.",
      "A changed target does not demonstrate either a valid causal contribution or protection against unintended behavior.",
      "Age is not a validity criterion; a retained measure can remain appropriate under the new strategy."
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Four divisions meet their local on-time-delivery targets, but their promised-date rules and reporting cutoffs differ. Sponsorship, Belt capacity and post-closure benefit verification are already established. Executives want to rank cross-divisional opportunities using the current delivery percentages. Only one measurement-infrastructure initiative can be funded this quarter. Which proposal most directly makes that comparison defensible?",
    "options": [
      "Rank divisions by percentage-point distance from their own local targets, and treat that normalization as sufficient to compare the underlying delivery performance across divisions.",
      "Replace every local delivery definition with the largest division's existing definition, and treat organizational size as the basis for selecting a common customer-performance standard.",
      "Automate extraction of the existing local percentages into one dashboard, and use more frequent updates to resolve concerns about different promised-date rules and reporting cutoffs.",
      "Agree customer-relevant definitions and comparability rules, validate the underlying records and assign data owners before using the resulting measures to rank cross-divisional opportunities."
    ],
    "answer": 3,
    "why": "The documented constraint is incompatible measurement meaning, not absent benefits ownership or insufficient reporting speed. Common, customer-relevant definitions and validated records establish a defensible basis for comparison; where customer commitments legitimately differ, explicit stratification or comparability rules may be needed. Distances from different local targets do not automatically create comparable measures. Neither faster extraction nor imposing the largest division's definition demonstrates that the measurement represents equivalent customer performance. Source alignment: ASQ CMBB Body of Knowledge, I.C.2; I.C.6; II.E.1. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-071",
    "optionRationales": [
      "Subtracting different local targets does not reconcile different promised-date definitions, reporting cutoffs or customer commitments.",
      "A division's size does not establish that its existing definition is appropriate for every customer or comparable across all operating contexts.",
      "Automation and reporting frequency improve timeliness, but do not change what the underlying local percentages actually measure.",
      "Correct. It establishes measurement meaning, comparability, data quality and ownership before an enterprise-level ranking is based on the figures."
    ],
    "distractors": [
      "Subtracting different local targets does not reconcile different promised-date definitions, reporting cutoffs or customer commitments.",
      "A division's size does not establish that its existing definition is appropriate for every customer or comparable across all operating contexts.",
      "Automation and reporting frequency improve timeliness, but do not change what the underlying local percentages actually measure.",
      "Correct. It establishes measurement meaning, comparability, data quality and ownership before an enterprise-level ranking is based on the figures."
    ],
    "trap": "Measurement standardization is not just placing local percentages in one dashboard. Establish comparable customer-relevant definitions and data quality, while retaining justified differences through explicit comparison or stratification rules.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.C.2; I.C.6; II.E.1"
      }
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An existing order-fulfillment process has worsening delivery variation. Several interacting causes are plausible, but none has been verified, and there is no evidence that the process architecture cannot meet requirements. Leadership favors replacing the system because two recent improvement attempts failed. Which initial methodology recommendation is most defensible?",
    "options": [
      "Use DMAIC to validate measurement, establish the baseline and investigate causes, then reconsider redesign if evidence demonstrates that incremental improvement cannot meet requirements.",
      "Use DMADV to replace the process immediately, treating the failure of two prior improvement attempts as sufficient evidence that the existing architecture is incapable.",
      "Use a Kaizen implementation event to standardize the team's preferred solution, treating agreement among experienced staff as sufficient verification of the interacting causes.",
      "Use a control-chart monitoring program without further diagnosis, treating visibility of future signals as a substitute for investigating the current performance deterioration."
    ],
    "answer": 0,
    "why": "The process exists, the problem is measurable and the causes remain uncertain. DMAIC provides a structured investigation before selecting a solution. Failed attempts alone do not demonstrate an architectural limit. DMADV becomes defensible when a new design or substantial redesign is justified. Kaizen can be used within DMAIC, but the proposed solution-first event bypasses the unresolved diagnosis. Monitoring alone does not correct the problem. Source alignment: ASQ CMBB Body of Knowledge, I.D.1; I.D.2; I.D.3. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-072",
    "optionRationales": [
      "Correct. It matches an existing process with unverified causes and leaves redesign available when supported by evidence.",
      "Two unsuccessful attempts may reflect poor diagnosis or execution; they do not by themselves establish a design limitation.",
      "The defect is implementing an unverified solution, not the use of Kaizen itself; experienced consensus is not causal validation.",
      "Control charts support monitoring and diagnosis, but monitoring without investigation does not address the existing deterioration."
    ],
    "distractors": [
      "Correct. It matches an existing process with unverified causes and leaves redesign available when supported by evidence.",
      "Two unsuccessful attempts may reflect poor diagnosis or execution; they do not by themselves establish a design limitation.",
      "The defect is implementing an unverified solution, not the use of Kaizen itself; experienced consensus is not causal validation.",
      "Control charts support monitoring and diagnosis, but monitoring without investigation does not address the existing deterioration."
    ],
    "trap": "Match the method to the problem and available evidence. Do not infer architectural incapability from failed attempts, and do not confuse rapid implementation or monitoring with a validated diagnosis.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.D.1; I.D.2; I.D.3"
      },
      {
        "title": "ASQ: DMAIC",
        "url": "https://asq.org/quality-resources/dmaic",
        "locator": "When to use DMAIC; DMAIC vs. DMADV"
      }
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A proposed scrap-reduction project is supported by an association between overtime and scrap in day-shift records. Night-shift records are missing, product mix changed, and the estimated benefit assumes overtime causes scrap. The business impact appears material. What should the MBB require before authorizing the proposed solution and its claimed benefit?",
    "options": [
      "Approve the overtime-reduction solution and savings estimate because the observed association identifies a controllable input and the potential business impact is material.",
      "Reject the opportunity until a causal relationship is conclusively established, because a project charter cannot legitimately include an unresolved root-cause investigation.",
      "Collect more day-shift records using the same selection method, then approve the proposed solution if the overtime–scrap association remains statistically significant.",
      "Qualify a diagnostic project with a representative baseline and benefit-validation plan, treating overtime as a hypothesis and separating opportunity size from proven savings."
    ],
    "answer": 3,
    "why": "The evidence supports investigation of a potentially material opportunity, but it does not establish overtime as the cause or validate solution benefits. Missing shifts and changing product mix threaten representativeness and interpretation. A diagnostic charter can explicitly address those gaps. More observations from the same biased frame or statistical significance alone would not establish causation. Qualification of an investigation and authorization of a proven solution are different decisions. Source alignment: ASQ CMBB Body of Knowledge, I.E.2; II.E.1. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-073",
    "optionRationales": [
      "A controllable variable associated with scrap is not necessarily its cause, so the solution and savings claim are premature.",
      "Unknown causes are a legitimate reason to charter an investigation; causal proof is not a prerequisite to every improvement project.",
      "Increasing the same selectively sampled data does not repair missing-shift coverage or establish a causal effect of overtime.",
      "Correct. It retains the opportunity while making the evidence gaps and benefit-validation requirements explicit."
    ],
    "distractors": [
      "A controllable variable associated with scrap is not necessarily its cause, so the solution and savings claim are premature.",
      "Unknown causes are a legitimate reason to charter an investigation; causal proof is not a prerequisite to every improvement project.",
      "Increasing the same selectively sampled data does not repair missing-shift coverage or establish a causal effect of overtime.",
      "Correct. It retains the opportunity while making the evidence gaps and benefit-validation requirements explicit."
    ],
    "trap": "A promising opportunity can be ready for a diagnostic charter without its proposed cause or solution being proven. Larger samples and smaller p-values do not automatically remove selection bias or confounding.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.E.2; II.E.1"
      }
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Six Black Belts are each fully committed to one active project. A seventh, mandatory project must start this month to meet a fixed deadline. Additional qualified capacity cannot be obtained in time, and the sponsor confirms that one lower-priority project's scope or schedule can be changed without creating a safety or compliance breach. Which pipeline action is most defensible?",
    "options": [
      "Use the governance process to rescope or defer lower-priority work, release the required capacity, and document the resulting benefit and schedule tradeoffs.",
      "Assign the mandatory project in addition to the six existing commitments, and retain all original schedules because mandatory work has the highest priority.",
      "Keep all six original commitments unchanged, and place the mandatory project next in the queue because changing approved priorities would undermine governance consistency.",
      "Increase the mandatory project's weighted score, and leave resource assignments unchanged because an explicit ranking resolves the conflict between competing portfolio demands."
    ],
    "answer": 0,
    "why": "There are six available project-lead assignments and seven demands. The stated deadline rules out waiting, and additional capacity is unavailable. An authorized change to lower-priority work is therefore needed to create a feasible plan. Raising a score does not release capacity. Governance should make the displaced benefits, dependencies and revised commitments visible rather than assuming that priority alone expands available resources. Source alignment: ASQ CMBB Body of Knowledge, I.F.2; I.F.3; III.B.8. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-074",
    "optionRationales": [
      "Correct. It creates actual capacity while preserving accountable decisions and visibility of the displaced work.",
      "Adding a seventh full commitment to six fully committed Belts does not create the missing capacity or validate the original schedules.",
      "The question establishes that the mandatory project cannot wait and that a safe, authorized tradeoff is available.",
      "Ranking communicates relative priority but does not change the resource allocation that currently makes the plan infeasible."
    ],
    "distractors": [
      "Correct. It creates actual capacity while preserving accountable decisions and visibility of the displaced work.",
      "Adding a seventh full commitment to six fully committed Belts does not create the missing capacity or validate the original schedules.",
      "The question establishes that the mandatory project cannot wait and that a safe, authorized tradeoff is available.",
      "Ranking communicates relative priority but does not change the resource allocation that currently makes the plan infeasible."
    ],
    "trap": "Priority is not capacity. A mandatory start requires an executable resource tradeoff when the current assignments are full; changing a score or retaining incompatible promises does not solve the scheduling constraint.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.F.2; I.F.3; III.B.8"
      }
    ]
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A new MBB finds vague strategic objectives, outdated cascaded metrics, an inactive steering committee, 30 unranked projects, six overloaded Belts and no benefit-verification process. No single cause has been established. Which initial recovery plan best combines immediate workload control with a sound basis for subsequent deployment decisions?",
    "options": [
      "Complete a comprehensive strategic-plan rewrite before changing workload, restarting governance or collecting benefit baselines, so all corrective work follows a single finalized plan.",
      "Hire additional Belts using the existing project list, continue accepting new starts, and postpone changes to selection criteria until the added capacity is operational.",
      "Triage mandatory commitments and restrain discretionary starts; convene accountable sponsors to clarify objectives, reconcile capacity and establish baseline benefit measures while reprioritizing the portfolio.",
      "Close the projects with the lowest currently claimed savings, then rewrite strategy and validate the remaining benefits after reducing the portfolio to six projects."
    ],
    "answer": 2,
    "why": "The MBB needs coordinated diagnosis and containment, not a presumed single root cause or a rigid sequence that leaves overload unchecked. Protect mandatory work, control discretionary intake and restore accountable decisions. Clarify objectives and resource limits while establishing baseline measures and Finance-supported benefit validation. Those activities inform prioritization together. Unverified savings should not determine blanket cancellation, and hiring alone would not correct the governance and measurement gaps. Source alignment: ASQ CMBB Body of Knowledge, I.A; I.C.1; I.C.3; I.C.6; I.F.2. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d1-075",
    "optionRationales": [
      "Waiting for a complete strategy rewrite leaves the immediate capacity problem unmanaged and delays evidence needed to evaluate the portfolio.",
      "Extra capacity may eventually help, but accepting more work under obsolete criteria perpetuates the selection and accountability defects.",
      "Correct. It manages immediate commitments while developing strategy, capacity and measurement evidence together rather than assuming one root cause.",
      "The reported benefits have not been verified, and a fixed project-count target ignores differing workloads, obligations and strategic value."
    ],
    "distractors": [
      "Waiting for a complete strategy rewrite leaves the immediate capacity problem unmanaged and delays evidence needed to evaluate the portfolio.",
      "Extra capacity may eventually help, but accepting more work under obsolete criteria perpetuates the selection and accountability defects.",
      "Correct. It manages immediate commitments while developing strategy, capacity and measurement evidence together rather than assuming one root cause.",
      "The reported benefits have not been verified, and a fixed project-count target ignores differing workloads, obligations and strategic value."
    ],
    "trap": "Multiple deployment gaps do not prove that vague strategy caused them all. Stabilize commitments and build the evidence for prioritization together; benefits baselines should not wait until after the major decisions.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.A; I.C.1; I.C.3; I.C.6; I.F.2"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "An e-commerce business requires rapid local fulfillment decisions and consistent improvement methods across centers. Central approval of routine local decisions currently takes three weeks. Belts need local operating access, while the central Six Sigma office must retain technical oversight. Which proposed organizational arrangement best addresses both requirements?",
    "options": [
      "Embed Belts in the centers with central technical oversight, documented local decision rights, jointly agreed priorities and a defined route for resolving competing demands.",
      "Centralize Belts and retain central approval of routine local decisions, using a common technical review calendar to ensure consistency across all fulfillment centers.",
      "Embed Belts under local managers with independent technical standards, using each center's delivery-speed target as the principal measure of whether its methods are adequate.",
      "Assign Belts to both local and central managers without explicit decision rights, allowing each manager to set priorities independently as operational and technical needs arise."
    ],
    "answer": 0,
    "why": "The proposed matrix arrangement combines local access and delegated operating decisions with central technical oversight. Its effectiveness depends on explicit authority, capacity agreements and conflict resolution; a dotted line alone guarantees none of these. Retaining the stated central approval delay fails the speed requirement, while fully independent methods fail consistency. Dual reporting without arbitration introduces avoidable priority conflict. Source alignment: ASQ CMBB Body of Knowledge, II.D.4; II.C.3. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-001",
    "optionRationales": [
      "Correct. It addresses local responsiveness and central consistency while controlling the main dual-reporting risk.",
      "Common review calendars do not remove the explicitly retained three-week approval bottleneck for routine decisions.",
      "Independent technical standards do not satisfy the stated requirement for consistent improvement methods across centers.",
      "Two independent priority setters without decision rules leave the Belt exposed to unresolved competing demands."
    ],
    "distractors": [
      "Correct. It addresses local responsiveness and central consistency while controlling the main dual-reporting risk.",
      "Common review calendars do not remove the explicitly retained three-week approval bottleneck for routine decisions.",
      "Independent technical standards do not satisfy the stated requirement for consistent improvement methods across centers.",
      "Two independent priority setters without decision rules leave the Belt exposed to unresolved competing demands."
    ],
    "trap": "An organizational label does not guarantee performance. Evaluate the actual decision rights, technical oversight and arbitration mechanism against the local-speed and enterprise-consistency requirements.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.D.4; II.C.3"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A cruise line's near-miss reports have declined, while informal accounts describe continuing incidents. Exposure levels, reporting access and reporting behavior have not yet been checked. Leadership wants to label the decline a safety improvement. Which MBB response best separates changes in underlying safety from changes in measurement and reporting?",
    "options": [
      "Accept the report decline as evidence of safer operations, and use the next recognition cycle to reward crews submitting the fewest near-miss reports.",
      "Triangulate incident and exposure evidence, test reporting access and explore fear of repercussions confidentially before interpreting the report decline as a safety improvement.",
      "Conclude that fear of blame caused the decline, and replace disciplinary policies immediately without assessing exposure, reporting access or alternative explanations for the pattern.",
      "Lengthen the reporting form to require supporting evidence for each near miss, and compare future report totals with the current quarter before investigating reporting behavior."
    ],
    "answer": 1,
    "why": "Observed reports depend on event occurrence, exposure and the probability of reporting. The conflicting evidence warrants investigation but does not identify a unique cause. Confidential staff input can test a fear-of-blame hypothesis alongside access, definitions and exposure changes. Incentives for low report counts can suppress reporting. A reporting increase after a culture intervention would likewise not automatically mean safety worsened. Source alignment: ASQ CMBB Body of Knowledge, II.A.2; II.D.6; II.E.1. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-004",
    "optionRationales": [
      "Lower report totals are not a direct measure of lower incident risk, and rewarding low counts can discourage useful reporting.",
      "Correct. It tests competing explanations and the measurement process instead of inferring safety or a unique cultural cause from counts alone.",
      "Fear of blame is plausible, but the stated evidence does not distinguish it from exposure changes or barriers in the reporting process.",
      "Additional documentation can create reporting burden, while comparison of raw totals still leaves exposure and reporting behavior unresolved."
    ],
    "distractors": [
      "Lower report totals are not a direct measure of lower incident risk, and rewarding low counts can discourage useful reporting.",
      "Correct. It tests competing explanations and the measurement process instead of inferring safety or a unique cultural cause from counts alone.",
      "Fear of blame is plausible, but the stated evidence does not distinguish it from exposure changes or barriers in the reporting process.",
      "Additional documentation can create reporting burden, while comparison of raw totals still leaves exposure and reporting behavior unresolved."
    ],
    "trap": "Incident reports are not the same as incident incidence. Both fewer reports and more reports can reflect changes in willingness or ability to report; investigate exposure and the reporting process before drawing conclusions.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.A.2; II.D.6; II.E.1"
      },
      {
        "title": "AHRQ PSNet: Culture of Safety",
        "url": "https://psnet.ahrq.gov/primer/culture-safety",
        "locator": "Measuring and Achieving a Culture of Safety"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "Regional operations managers in a waste-management business each supervise 25–30 route supervisors. Leadership proposes adding champion duties for cross-functional improvement projects without changing their current responsibilities. No workload assessment or champion decision rights have been defined. What should the MBB request before confirming the assignments?",
    "options": [
      "Apply a uniform maximum of ten direct reports to every regional manager, and assign champion duties once all reporting lines meet that numerical rule.",
      "Assess workload and sponsorship demands, define champion authority and escalation duties, and secure protected capacity before agreeing the number and scope of assignments.",
      "Give every manager the same project sponsorship quota, and use attendance at monthly project presentations to determine whether the additional duties are adequately resourced.",
      "Delegate project reporting to administrative staff, and treat the resulting reduction in paperwork as sufficient preparation for the managers' resource and escalation responsibilities."
    ],
    "answer": 1,
    "why": "A wide span of control signals a possible capacity risk but does not establish a universal acceptable span or prove overload. The required assessment concerns actual workload, project demands and authority to remove barriers. Protected time, clear duties and realistic assignments make sponsorship executable. Reporting assistance is useful but does not replace the champion's decisions or cross-functional authority. Source alignment: ASQ CMBB Body of Knowledge, II.B.1; II.B.2; I.C.3. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-007",
    "optionRationales": [
      "No universal ten-report threshold is established; workload and task complexity matter more than an arbitrary numerical rule.",
      "Correct. It tests available capacity and defines the authority and duties necessary for meaningful sponsorship.",
      "Equal quotas ignore differing workloads and project demands, and meeting attendance alone does not demonstrate effective sponsorship.",
      "Administrative support does not establish decision rights or the manager's capacity to resolve resource and cross-functional barriers."
    ],
    "distractors": [
      "No universal ten-report threshold is established; workload and task complexity matter more than an arbitrary numerical rule.",
      "Correct. It tests available capacity and defines the authority and duties necessary for meaningful sponsorship.",
      "Equal quotas ignore differing workloads and project demands, and meeting attendance alone does not demonstrate effective sponsorship.",
      "Administrative support does not establish decision rights or the manager's capacity to resolve resource and cross-functional barriers."
    ],
    "trap": "Treat span of control as a diagnostic signal, not a universal threshold. Champion effectiveness depends on actual workload, protected time and decision authority rather than the title or meeting attendance.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.B.1; II.B.2; I.C.3"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A publishing company wants recognition to reinforce its customer-first improvement strategy. Projects differ in size, customer complaints contain confidential information, and staff preferences for public recognition vary. Which recognition design best supports the intended behavior without relying on project volume or suppressing useful feedback?",
    "options": [
      "Reward teams reporting the fewest customer complaints each quarter, using raw complaint totals to make recognition consistent across different project sizes and customer groups.",
      "Reward the employees completing the greatest number of projects each year, using completion counts as a practical substitute for validating each project's customer impact.",
      "Recognize only the largest verified financial saving annually, using a single public award to communicate that customer-first behavior is whatever maximizes immediate financial return.",
      "Recognize verified customer benefits and collaborative behaviors promptly, using transparent criteria, appropriate team and individual credit, and channels that respect confidentiality and employee preferences."
    ],
    "answer": 3,
    "why": "Recognition should reinforce the actual desired behaviors and customer outcomes. Verification and transparent criteria reduce gaming; appropriate attribution recognizes collaboration as well as individual contributions. Timeliness helps connect recognition to behavior. Public disclosure is not inherently required and must respect confidentiality and preferences. Complaint counts, project counts and immediate financial savings alone are incomplete proxies for customer-first performance. Source alignment: ASQ CMBB Body of Knowledge, II.D.6; II.F.2. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-010",
    "optionRationales": [
      "Raw complaint totals differ with exposure and reporting behavior; rewarding low counts can suppress information needed for improvement.",
      "Completion counts reward volume rather than the verified customer benefit or collaboration the strategy seeks.",
      "Financial return can matter, but it does not by itself establish customer benefit, and one public format ignores the stated constraints.",
      "Correct. It connects recognition to verified outcomes and behaviors while accounting for attribution, privacy and employee preferences."
    ],
    "distractors": [
      "Raw complaint totals differ with exposure and reporting behavior; rewarding low counts can suppress information needed for improvement.",
      "Completion counts reward volume rather than the verified customer benefit or collaboration the strategy seeks.",
      "Financial return can matter, but it does not by itself establish customer benefit, and one public format ignores the stated constraints.",
      "Correct. It connects recognition to verified outcomes and behaviors while accounting for attribution, privacy and employee preferences."
    ],
    "trap": "Reward the intended behavior and validated outcome, not an easily counted proxy. Recognition need not be public to be effective, and customer confidentiality remains a constraint on how success is communicated.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.D.6; II.F.2"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A wind-energy company's Six Sigma office is housed in Engineering. A maintenance-scheduling project also requires Operations resources, but no shared sponsor, decision rights or resource commitments exist. Additional methodology briefings have not resolved the stalled work. Which change most directly addresses the demonstrated governance gap?",
    "options": [
      "Move the Six Sigma office's administrative reporting to Finance, while leaving Operations participation and project resource commitments to the same informal arrangements.",
      "Increase the frequency of methodology briefings for Operations, while retaining Engineering-only sponsorship and treating improved terminology familiarity as sufficient authority to proceed.",
      "Retain Engineering-only project approval and invite Operations to observe reviews, while leaving each division free to disregard the other's resource and implementation decisions.",
      "Create joint sponsorship and cross-divisional decision rights with committed resources, while separately assessing whether the Six Sigma office's administrative reporting line needs to change."
    ],
    "answer": 3,
    "why": "The demonstrated defect is absent cross-divisional authority and resource commitment. Joint sponsorship and agreed decisions address it directly. An office can be administratively located within one division and still work effectively across divisions if its mandate and governance support that work. Relocation alone or more terminology training does not establish those arrangements. The question does not assume organizational placement itself causes failure. Source alignment: ASQ CMBB Body of Knowledge, II.D.4; II.C.3; I.C.1. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-013",
    "optionRationales": [
      "Changing an administrative reporting line without changing the missing cross-divisional commitments leaves the demonstrated barrier intact.",
      "The case already shows that briefings have not resolved the absence of shared authority and resource commitments.",
      "Observer status does not establish joint accountability or resolve competing resource and implementation decisions.",
      "Correct. It repairs the specific authority and commitment gap without assuming an organizational relocation is necessarily required."
    ],
    "distractors": [
      "Changing an administrative reporting line without changing the missing cross-divisional commitments leaves the demonstrated barrier intact.",
      "The case already shows that briefings have not resolved the absence of shared authority and resource commitments.",
      "Observer status does not establish joint accountability or resolve competing resource and implementation decisions.",
      "Correct. It repairs the specific authority and commitment gap without assuming an organizational relocation is necessarily required."
    ],
    "trap": "Separate where an improvement office reports from the authority it has to lead cross-functional work. A reporting-line change is not a substitute for a legitimate mandate, joint sponsorship and committed resources.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.D.4; II.C.3; I.C.1"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A correctional-facility operator states that it values continuous improvement. Line staff who submit documented improvement suggestions through the approved channel receive negative performance comments even when they have followed every current procedure. Safety-critical changes still require formal approval. Which response best closes the demonstrated values–practice gap?",
    "options": [
      "Align performance practices with good-faith suggestions, provide a fair review and feedback process, and retain formal authorization before changing safety-critical operating procedures.",
      "Restate the empowerment policy in staff communications, but retain negative performance comments for suggestions until the submitting employees can prove their proposed benefits.",
      "Permit staff to implement data-supported changes before formal approval, and evaluate compliance only if the resulting change produces an incident or measurable loss.",
      "Remove all improvement suggestions from performance discussions and route them anonymously, while leaving the existing negative-response practice and management expectations otherwise unchanged."
    ],
    "answer": 0,
    "why": "The case concerns penalties for authorized suggestions, not discipline for unsafe conduct. Management should align its evaluation and response practices with the stated improvement values and provide reliable feedback. Controlled change approval must remain in place. Communications or anonymity may help but do not by themselves resolve contradictory management behavior. Encouraging improvement does not authorize unilateral changes to safety-critical procedures. Source alignment: ASQ CMBB Body of Knowledge, II.A.2; II.D.6. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-016",
    "optionRationales": [
      "Correct. It protects legitimate improvement participation while preserving the separate requirement for controlled procedure changes.",
      "Good-faith suggestions may need investigation; requiring proven benefits before respectful review discourages legitimate problem identification.",
      "Supporting data does not remove the explicit approval requirement for safety-critical changes or make outcome-based compliance acceptable.",
      "Anonymity can support reporting, but leaving the negative management practice unchanged does not align actual behavior with stated values."
    ],
    "distractors": [
      "Correct. It protects legitimate improvement participation while preserving the separate requirement for controlled procedure changes.",
      "Good-faith suggestions may need investigation; requiring proven benefits before respectful review discourages legitimate problem identification.",
      "Supporting data does not remove the explicit approval requirement for safety-critical changes or make outcome-based compliance acceptable.",
      "Anonymity can support reporting, but leaving the negative management practice unchanged does not align actual behavior with stated values."
    ],
    "trap": "Distinguish proposing a change through an authorized channel from making an unauthorized operational change. Empowerment and psychological safety can coexist with strict approval controls for safety-critical work.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.A.2; II.D.6"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A Black Belt at an agri-genetics company reports to a Six Sigma functional manager and an R&D project lead. Each assigns work that consumes the Belt's full available capacity for the same quarter. The Belt lacks authority to change either commitment. Which design control would most directly prevent this conflict from stalling delivery?",
    "options": [
      "Allow the Belt to choose the assignment with the larger estimated benefit, and ask the other manager to accept the decision at quarter-end.",
      "Require joint capacity and priority agreements, with a named arbitration authority and timely escalation when the two managers cannot resolve competing commitments.",
      "Alternate the Belt's work between the two managers weekly, and retain both original full-capacity commitments so that each manager receives visibly equal attention.",
      "Require two separate weekly status reports, and defer priority arbitration until either manager's delivery milestone is missed and the conflict becomes measurable."
    ],
    "answer": 1,
    "why": "The Belt faces incompatible commitments and has no authority to trade them off. Joint planning and a defined escalation route put that decision with accountable managers. The control does not guarantee conflict-free operation; it makes resolution possible before missed milestones. Unilateral choice, equal time slicing and reporting alone do not authorize changes to the total committed workload. Source alignment: ASQ CMBB Body of Knowledge, II.C.3; II.D.4. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-019",
    "optionRationales": [
      "The Belt has no authority to change the commitments, and estimated benefit alone does not resolve strategic or resource dependencies.",
      "Correct. It combines feasible joint planning with an authorized, timely decision when competing priorities remain unresolved.",
      "Equal attention does not make two full-capacity commitments fit within one person's available capacity or preserve the original schedules.",
      "Status reports reveal progress but do not assign authority to resolve an already known conflict before milestones are missed."
    ],
    "distractors": [
      "The Belt has no authority to change the commitments, and estimated benefit alone does not resolve strategic or resource dependencies.",
      "Correct. It combines feasible joint planning with an authorized, timely decision when competing priorities remain unresolved.",
      "Equal attention does not make two full-capacity commitments fit within one person's available capacity or preserve the original schedules.",
      "Status reports reveal progress but do not assign authority to resolve an already known conflict before milestones are missed."
    ],
    "trap": "A matrix needs a decision mechanism, not just two reporting channels. Transparent status and equal time allocation do not resolve commitments that exceed available capacity without an authorized tradeoff.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.C.3; II.D.4"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "Before a Six Sigma launch, a home-healthcare provider wants to assess readiness across managers, office staff and dispersed clinicians. Leaders expect staff may hesitate to criticize current practices. Which assessment design is most defensible for identifying cultural barriers rather than merely documenting management's intended culture?",
    "options": [
      "Use confidential, fit-for-purpose survey measures and interviews across staff groups, checking response coverage and whether the measures are valid for the intended population and constructs.",
      "Use a validated survey completed only by senior managers, treating its published validation as sufficient evidence that their answers represent all employee groups in this organization.",
      "Rewrite survey items around the launch campaign's preferred messages, and compare the resulting scores directly with benchmarks collected using the original instrument and administration method.",
      "Use a high-response mandatory survey with individually identified answers reviewed by supervisors, treating response rate alone as evidence that concerns about current practices are fully captured."
    ],
    "answer": 0,
    "why": "Readiness assessment must capture staff experience across relevant groups and reduce barriers to candid input. A measure's validity is specific to its constructs, population and use; it does not guarantee representative responses. Interviews and coverage checks help interpret survey findings, while confidentiality requires an actual protection plan, especially for small groups. Modifying an instrument can undermine direct comparability with its original benchmarks. Source alignment: ASQ CMBB Body of Knowledge, II.A.2; II.D.6; II.E.1. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-022",
    "optionRationales": [
      "Correct. It addresses candor, population coverage and appropriate measurement rather than assuming that a survey label guarantees validity.",
      "Published validation does not make a managers-only sample representative of office staff or dispersed clinicians.",
      "Changing item wording or administration can change what is measured and invalidate an unqualified benchmark comparison.",
      "A high response rate does not eliminate fear-driven response distortion when employees expect identifiable criticism to reach supervisors."
    ],
    "distractors": [
      "Correct. It addresses candor, population coverage and appropriate measurement rather than assuming that a survey label guarantees validity.",
      "Published validation does not make a managers-only sample representative of office staff or dispersed clinicians.",
      "Changing item wording or administration can change what is measured and invalidate an unqualified benchmark comparison.",
      "A high response rate does not eliminate fear-driven response distortion when employees expect identifiable criticism to reach supervisors."
    ],
    "trap": "Distinguish instrument validity, sample coverage and response candor. A validated questionnaire cannot repair an unrepresentative sample or guarantee honest answers under an identifiable, supervisor-reviewed process.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.A.2; II.D.6; II.E.1"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A telecom-tower maintenance company uses one Black Belt to support dispersed rural technicians. Project records show repeated cancellation of centralized workshops because travel would leave service coverage inadequate. Technicians can submit data between jobs, but connectivity varies. Which adaptation should the MBB pilot to address the demonstrated participation barrier?",
    "options": [
      "Combine low-bandwidth asynchronous input, remote facilitation and regional sessions where needed, with protected participation time and explicit checks on service coverage and engagement.",
      "Increase centralized workshop frequency while retaining the same travel and staffing assumptions, using more available dates as the primary remedy for the documented cancellations.",
      "Replace centralized workshops with mandatory live video meetings for every task, using attendance as the only measure of whether the dispersed-workforce barrier has been removed.",
      "Assign all diagnosis and solution design to the Belt using historical reports, reserving technician participation for rollout to minimize disruption during project development."
    ],
    "answer": 0,
    "why": "The records identify travel-related coverage as a barrier, while variable connectivity limits an all-live-video solution. A blended pilot should preserve field input and operational coverage, then assess participation and project progress. These facts support testing an engagement redesign; they do not prove that all completion differences are caused by geography or that the Belt or technicians lack competence. Source alignment: ASQ CMBB Body of Knowledge, II.D.3; II.D.4; II.B.2. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-026",
    "optionRationales": [
      "Correct. It addresses the observed travel and connectivity constraints while retaining protected field participation and measurable pilot checks.",
      "More dates do not necessarily make travel feasible when the limiting condition is service coverage under unchanged staffing.",
      "An exclusively synchronous video model ignores variable connectivity, and attendance alone does not establish effective participation.",
      "Removing field input from diagnosis risks solutions based on incomplete understanding of the work, even if meeting disruption declines."
    ],
    "distractors": [
      "Correct. It addresses the observed travel and connectivity constraints while retaining protected field participation and measurable pilot checks.",
      "More dates do not necessarily make travel feasible when the limiting condition is service coverage under unchanged staffing.",
      "An exclusively synchronous video model ignores variable connectivity, and attendance alone does not establish effective participation.",
      "Removing field input from diagnosis risks solutions based on incomplete understanding of the work, even if meeting disruption declines."
    ],
    "trap": "Address the demonstrated access barrier rather than blaming people or assuming a new technology removes every constraint. Pilot the engagement design and test both participation and operational coverage.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.D.3; II.D.4; II.B.2"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A pet-grooming brand's 150 franchisees have joined an agreed improvement program built around careful service and clear customer communication. Awareness-training completion is high, but observations show inconsistent intake practices, and the values have no shared behavioral description. Which next step best tests whether these values are being translated into routine service behavior?",
    "options": [
      "Increase the frequency of awareness quizzes and publish completion rankings, using recall of the value statements as the principal evidence that intake practices have changed.",
      "Compare each location's overall online star rating with the brand average, using that single outcome as sufficient evidence of how staff apply the values during intake.",
      "Require identical wording for every intake conversation and count script deviations, using verbal uniformity as the principal test of careful service across differing customer needs.",
      "Co-develop observable behavior criteria and practice examples, then assess their application through structured observation and customer feedback rather than treating training completion as implementation evidence."
    ],
    "answer": 3,
    "why": "The gap is between awareness of abstract values and observable application. Shared behavior criteria, relevant examples and practice make the intended conduct assessable, while structured observation and customer feedback test transfer into routine service. Quiz completion measures participation or recall, not demonstrated behavior. Overall ratings have multiple drivers, and an identical script can overlook whether customer-specific needs were addressed. This item tests operationalization and evidence of culture change, not corporate staffing authority over franchise personnel. Source alignment: ASQ CMBB Body of Knowledge, II.D.6; II.C.2; IV.D. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-029",
    "optionRationales": [
      "Repeated recall checks do not establish whether staff consistently apply the values during actual customer intake.",
      "Overall ratings can reflect price, waiting time and many other factors; they do not isolate the specific intake behaviors being assessed.",
      "Identical wording does not by itself establish careful service or appropriate communication for different customers and situations.",
      "Correct. It defines observable application and gathers direct behavioral and customer evidence to assess transfer beyond awareness training."
    ],
    "distractors": [
      "Repeated recall checks do not establish whether staff consistently apply the values during actual customer intake.",
      "Overall ratings can reflect price, waiting time and many other factors; they do not isolate the specific intake behaviors being assessed.",
      "Identical wording does not by itself establish careful service or appropriate communication for different customers and situations.",
      "Correct. It defines observable application and gathers direct behavioral and customer evidence to assess transfer beyond awareness training."
    ],
    "trap": "Training completion, recall, verbal uniformity and broad outcome ratings are not interchangeable with evidence of behavior. Define what application looks like and use observations and relevant feedback to assess it.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.D.6; II.C.2; IV.D"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A dry-cleaning chain with 12 locations has no dedicated Six Sigma office and can fund a limited pilot, not a full enterprise deployment. Ownership will sponsor the work, and an operations manager can receive protected time. Which initial organizational design provides proportionate capability and accountability?",
    "options": [
      "Name an accountable sponsor and trained pilot coordinator, define capacity and review gates, and obtain specialist coaching and benefit verification appropriate to the pilot's risks.",
      "Appoint an operations manager as coordinator without protected capacity, and rely on voluntary after-hours effort to keep the pilot inexpensive while leaving operating responsibilities unchanged.",
      "Establish a permanent central office with multiple full-time Belt positions before selecting the pilot, using a large-enterprise staffing model to demonstrate commitment to the methodology.",
      "Give an external consultant sole ownership of pilot methods and decisions, and postpone internal process ownership and knowledge transfer until any subsequent rollout is funded."
    ],
    "answer": 0,
    "why": "A limited deployment still needs explicit ownership, capacity, appropriate technical support and outcome review. Those controls can be scaled to a pilot without reproducing a large-enterprise office. The company size alone does not prescribe exact staffing or make informal accountability sufficient. External expertise can support the effort, but internal ownership and learning should not be absent until rollout. Source alignment: ASQ CMBB Body of Knowledge, I.C.1; I.C.3; I.C.4; II.D.4. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-032",
    "optionRationales": [
      "Correct. It makes the limited pilot accountable and technically supported without requiring a disproportionate permanent infrastructure.",
      "A title without usable capacity does not create an executable pilot, especially when existing operating responsibilities remain unchanged.",
      "The stated funding supports a limited pilot, and no evidence justifies building a large permanent office before learning from it.",
      "Consultant support does not replace the internal process ownership and knowledge transfer needed to sustain or evaluate the pilot."
    ],
    "distractors": [
      "Correct. It makes the limited pilot accountable and technically supported without requiring a disproportionate permanent infrastructure.",
      "A title without usable capacity does not create an executable pilot, especially when existing operating responsibilities remain unchanged.",
      "The stated funding supports a limited pilot, and no evidence justifies building a large permanent office before learning from it.",
      "Consultant support does not replace the internal process ownership and knowledge transfer needed to sustain or evaluate the pilot."
    ],
    "trap": "Lightweight does not mean unaccountable. Scale roles and support to risk and resources, but retain a named sponsor, protected capacity, appropriate expertise and a credible way to verify results.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "I.C.1; I.C.3; I.C.4; II.D.4"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A grocery chain disciplines an employee after every shrinkage incident, largely according to the financial loss. Employees now withhold details during root-cause investigations. The MBB must improve learning without removing individual accountability. Which investigation policy best reflects a just-culture approach?",
    "options": [
      "Retain loss-based discipline and add a confidential suggestion channel, so employees can discuss process improvements without changing how responsibility for reported incidents is determined.",
      "Apply the same disciplinary response to every procedural deviation, so slips, risk-taking shortcuts and reckless conduct receive consistent treatment regardless of their different circumstances.",
      "Guarantee freedom from all consequences whenever an employee reports an incident, so voluntary disclosure takes precedence over investigating reckless conduct or deliberate misconduct.",
      "Use a fair, behavior-based review of system factors, human error, at-risk behavior and reckless conduct, with proportionate responses rather than automatic loss-based punishment."
    ],
    "answer": 3,
    "why": "Just culture combines system learning with fair behavioral accountability. Human error, at-risk behavior and reckless conduct require different consideration; the monetary outcome alone should not determine the response. System redesign, support and coaching can be appropriate, while reckless conduct or deliberate misconduct can require accountability under applicable policy and due process. Neither automatic blame nor unconditional immunity satisfies both objectives. Source alignment: ASQ CMBB Body of Knowledge, II.A.2; II.D.6. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-035",
    "optionRationales": [
      "A separate suggestion channel does not repair the punitive incident-review rule that is causing staff to withhold investigation details.",
      "Identical treatment of materially different behaviors is not the behavior-sensitive accountability required by a just-culture approach.",
      "Unconditional immunity removes the accountability component rather than balancing it with learning and reporting.",
      "Correct. It distinguishes conduct and system contributors and avoids deciding blame solely from the severity of the financial outcome."
    ],
    "distractors": [
      "A separate suggestion channel does not repair the punitive incident-review rule that is causing staff to withhold investigation details.",
      "Identical treatment of materially different behaviors is not the behavior-sensitive accountability required by a just-culture approach.",
      "Unconditional immunity removes the accountability component rather than balancing it with learning and reporting.",
      "Correct. It distinguishes conduct and system contributors and avoids deciding blame solely from the severity of the financial outcome."
    ],
    "trap": "Just culture is not no accountability. Evaluate system conditions and behavior, not only the outcome; a low-loss reckless act and a high-loss inadvertent error should not be judged solely by their financial consequences.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.A.2; II.D.6"
      },
      {
        "title": "AHRQ PSNet: Culture of Safety",
        "url": "https://psnet.ahrq.gov/primer/culture-safety",
        "locator": "Measuring and Achieving a Culture of Safety"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "Temporary workers constitute 60% of a relocation company's peak-season workforce and usually stay only a few months. Permanent staff can lead sustained improvement projects, but peak-season process conditions differ from the off-season. Which deployment design best combines proportionate training with valid understanding of peak operations?",
    "options": [
      "Require full Green Belt certification for every temporary worker before allowing operational feedback, and use completion of that certification as the main measure of engagement.",
      "Build projects from permanent staff's off-season observations alone, and exclude temporary-worker feedback because the short employment relationship makes their participation difficult to sustain.",
      "Provide task-relevant onboarding and rapid feedback for temporary staff, with permanent project ownership and direct peak-season observation and data capture to inform sustained improvement.",
      "Use an identical long-term project assignment for temporary and permanent staff, and transfer unfinished work at departure without a designated owner for continuity or follow-up."
    ],
    "answer": 2,
    "why": "Training and involvement should match role, tenure and operational risk. Temporary workers are most of the peak workforce and must have usable channels to contribute. Permanent ownership supports continuity, while direct peak-season data prevent off-season conditions from being mistaken for peak performance. The 60% share implies 40% permanent staff; it does not imply that every temporary employee needs Belt certification or that their input is dispensable. Source alignment: ASQ CMBB Body of Knowledge, II.B.2; II.D.4; IV.A. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-038",
    "optionRationales": [
      "Full certification is disproportionate as a prerequisite for ordinary operational feedback and may consume much of the short employment period.",
      "Excluding 60% of the peak workforce and observing only off-season work risks a systematically incomplete understanding of peak operations.",
      "Correct. It combines proportionate participation with accountable continuity and evidence from the operating conditions actually being improved.",
      "Uniform long-term assignments ignore the stated tenure difference, and unspecified ownership weakens continuity when temporary staff leave."
    ],
    "distractors": [
      "Full certification is disproportionate as a prerequisite for ordinary operational feedback and may consume much of the short employment period.",
      "Excluding 60% of the peak workforce and observing only off-season work risks a systematically incomplete understanding of peak operations.",
      "Correct. It combines proportionate participation with accountable continuity and evidence from the operating conditions actually being improved.",
      "Uniform long-term assignments ignore the stated tenure difference, and unspecified ownership weakens continuity when temporary staff leave."
    ],
    "trap": "Match participation to role and tenure without excluding the workforce that performs the peak process. Off-season planning is useful, but it cannot replace observation and data from peak operating conditions.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.B.2; II.D.4; IV.A"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "An orthodontics group pays individual bonuses solely for patient throughput. Clinicians report that cross-location scheduling improvement consumes time that reduces their bonus, and participation remains low despite repeated collaboration messages. Leadership wants to retain productivity incentives while protecting care quality. Which change should the MBB pilot first?",
    "options": [
      "Increase collaboration messaging and retain the throughput-only bonus, using clinicians' attendance at optional improvement meetings as the main evidence that the incentive conflict has ended.",
      "Replace individual throughput rewards with a group throughput-only bonus, treating total patient volume as sufficient evidence that collaboration and care quality have both improved.",
      "Pilot protected improvement time and a balanced mix of individual and team measures, including care-quality safeguards, then assess participation and unintended performance effects.",
      "Add a fixed bonus for each submitted improvement suggestion while retaining all throughput expectations, and evaluate success by counting submissions without validating implementation or customer impact."
    ],
    "answer": 2,
    "why": "The staff accounts identify a credible conflict between collaboration time and individual rewards. A balanced pilot can test whether protected time and aligned measures improve participation without weakening productivity or care quality. This evidence does not prove incentives are the only cause of low participation. Team throughput alone or suggestion counts can create new proxy-metric problems; monitoring unintended effects remains necessary. Source alignment: ASQ CMBB Body of Knowledge, II.D.6; II.F.2. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-041",
    "optionRationales": [
      "Messaging does not remove the stated financial penalty for time spent on shared improvement work.",
      "A group throughput-only measure still omits care quality and can reward volume without establishing effective collaboration.",
      "Correct. It tests a targeted incentive and capacity change with both productivity and quality safeguards.",
      "Suggestion counts can reward unvalidated volume and do not remove the stated time conflict or demonstrate useful implemented improvements."
    ],
    "distractors": [
      "Messaging does not remove the stated financial penalty for time spent on shared improvement work.",
      "A group throughput-only measure still omits care quality and can reward volume without establishing effective collaboration.",
      "Correct. It tests a targeted incentive and capacity change with both productivity and quality safeguards.",
      "Suggestion counts can reward unvalidated volume and do not remove the stated time conflict or demonstrate useful implemented improvements."
    ],
    "trap": "Changing individual rewards to team rewards is not enough when the measure remains incomplete. Test incentives, protected time and balancing measures together, and do not assume one plausible barrier is the only cause.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.D.6; II.F.2"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A bakery's central plant supplies 40 storefronts. Investigation has verified recurring display-temperature control failures at several stores, while the Six Sigma team's remit and resources cover only the central plant. Immediate product-safety concerns are being handled under existing response procedures. Which deployment change best addresses the longer-term coverage gap?",
    "options": [
      "Extend ownership and improvement coverage across the plant-to-store process, involve storefront staff, and prioritize technical support by documented risk and recurring failures.",
      "Allocate one full-time Black Belt to every store before further diagnosis, using equal staffing as the principal guarantee of consistent quality performance throughout the network.",
      "Keep the improvement remit at the plant and increase final production inspection, using central release results as the principal assurance that store display conditions are controlled.",
      "Transfer all quality responsibility to the storefronts and remove plant participation, using the verified local failures as evidence that upstream interfaces no longer require review."
    ],
    "answer": 0,
    "why": "The verified failures lie outside the team's current remit. End-to-end ownership and frontline involvement close that boundary gap, while risk-based allocation avoids assuming that all 40 stores need identical Belt staffing. Central release inspection does not control later display conditions. Store-level failures do not eliminate upstream interfaces. Immediate containment is explicitly separate from the longer-term improvement design. Source alignment: ASQ CMBB Body of Knowledge, II.A.1; II.D.4; III.B.4. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-044",
    "optionRationales": [
      "Correct. It extends accountable coverage to the actual failure locations while keeping resource allocation proportional to evidence and risk.",
      "The number of storefronts does not establish a need for 40 full-time Belts or justify equal staffing regardless of local conditions.",
      "Plant inspection cannot establish control of conditions that occur later in storefront display operations.",
      "Local failures do not justify removing upstream partners or abandoning end-to-end interface review and shared learning."
    ],
    "distractors": [
      "Correct. It extends accountable coverage to the actual failure locations while keeping resource allocation proportional to evidence and risk.",
      "The number of storefronts does not establish a need for 40 full-time Belts or justify equal staffing regardless of local conditions.",
      "Plant inspection cannot establish control of conditions that occur later in storefront display operations.",
      "Local failures do not justify removing upstream partners or abandoning end-to-end interface review and shared learning."
    ],
    "trap": "Do not equate organizational boundaries with the boundaries of the customer-facing process. Address verified downstream failures through end-to-end ownership, while keeping immediate containment distinct from long-term project design.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.A.1; II.D.4; III.B.4"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A parking operator reviews complaints quarterly, although problems cluster around games and concerts. Staffing, signage and payment-load details are often lost before the review, and attendance differs greatly between events. Which feedback design best preserves diagnostic evidence and supports meaningful comparison across events?",
    "options": [
      "Capture standardized post-event feedback, operating conditions and exposure promptly, assign follow-up owners, and retain periodic reviews to compare patterns and verify corrective actions.",
      "Change the quarterly review to monthly but retain the same delayed reconstruction of event conditions, using calendar frequency as the main remedy for lost diagnostic evidence.",
      "Rank events by total complaint counts without attendance or transaction denominators, using the highest raw count to identify the event with the worst underlying service performance.",
      "Conduct brief event debriefs without common definitions or a retained action log, and discontinue periodic synthesis because local recollection is sufficient for organization-wide learning."
    ],
    "answer": 0,
    "why": "Event-triggered capture preserves conditions while they can still be reconstructed. Common definitions, suitable exposure measures and follow-up ownership make the evidence usable beyond the debrief. Periodic synthesis remains useful for trends and action effectiveness. Even exposure-adjusted complaint rates require interpretation because event mix and reporting behavior can differ; raw counts alone do not rank underlying service risk. Source alignment: ASQ CMBB Body of Knowledge, II.E.1; II.E.2. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-048",
    "optionRationales": [
      "Correct. It combines timely event evidence, consistent measurement, accountable follow-up and cross-event learning.",
      "More frequent calendar review can help, but retaining delayed reconstruction does not directly address event-specific evidence loss.",
      "Large events may have more complaints because of greater exposure; raw counts alone do not establish a worse underlying rate.",
      "Without shared definitions and a retained action record, local debriefs do not support reliable comparison or sustained follow-up."
    ],
    "distractors": [
      "Correct. It combines timely event evidence, consistent measurement, accountable follow-up and cross-event learning.",
      "More frequent calendar review can help, but retaining delayed reconstruction does not directly address event-specific evidence loss.",
      "Large events may have more complaints because of greater exposure; raw counts alone do not establish a worse underlying rate.",
      "Without shared definitions and a retained action record, local debriefs do not support reliable comparison or sustained follow-up."
    ],
    "trap": "Match evidence capture to when the process changes, not only to the reporting calendar. Retain denominators and context, since more complaints at a larger event do not automatically imply a worse service rate.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.E.1; II.E.2"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "An airport ground-services company operates three rotating shifts. The improvement office holds every project meeting during the day shift and solicits ideas only from those attendees. Night-shift issues are absent from the pipeline despite unresolved concerns recorded in handover logs. Which design best closes the participation gap while preserving operational coverage?",
    "options": [
      "Ask day-shift champions to summarize all night-shift concerns without direct night-worker input, using their existing attendance to represent the entire operating cycle.",
      "Provide accountable representation and protected participation across shifts, combine appropriate timed and asynchronous input, and route all shifts' evidence into the same prioritization process.",
      "Require each shift to submit exactly the same number of project proposals monthly, using equal proposal counts as proof that their operating concerns are equally well represented.",
      "Move all improvement meetings to a single overnight time, keeping one compulsory meeting schedule and relying on daytime staff to adapt without protected participation arrangements."
    ],
    "answer": 1,
    "why": "The documented gap is systematic exclusion from the opportunity process, not evidence that night workers lack ideas. Representation, usable participation arrangements and a common evidence-based pipeline address it. Equal proposal quotas do not establish fair coverage and may ignore differing exposures or risks. Merely moving a single schedule can shift the exclusion to another group. Specific meeting times should be designed around actual coverage needs. Source alignment: ASQ CMBB Body of Knowledge, II.B.2; II.D.4; II.E.1. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-051",
    "optionRationales": [
      "Second-hand representation alone can reproduce the selection bias and omit direct operational knowledge from night-shift staff.",
      "Correct. It makes participation feasible across shifts and evaluates their evidence through a common governance process.",
      "Equal counts measure compliance with a quota, not whether relevant concerns and risks have been fairly identified.",
      "Changing the single privileged meeting time does not solve access for all shifts or provide protected participation capacity."
    ],
    "distractors": [
      "Second-hand representation alone can reproduce the selection bias and omit direct operational knowledge from night-shift staff.",
      "Correct. It makes participation feasible across shifts and evaluates their evidence through a common governance process.",
      "Equal counts measure compliance with a quota, not whether relevant concerns and risks have been fairly identified.",
      "Changing the single privileged meeting time does not solve access for all shifts or provide protected participation capacity."
    ],
    "trap": "Representative participation is not the same as equal proposal counts or one meeting everyone is told to attend. Design access around the operating cycle and evaluate evidence through a common prioritization process.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.B.2; II.D.4; II.E.1"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A craft distillery values traditional recipes and production methods. Staff resist a proposed warehouse inventory-tracking project because they fear it will change those methods. The proposed scope excludes recipes, but inventory handling can still affect product condition. Which approach best creates credible cultural alignment rather than merely reassuring staff?",
    "options": [
      "Describe the project as modernization of outdated traditions, and use management endorsement to proceed before discussing which production practices employees want preserved.",
      "Promise that a warehouse project cannot affect product condition, and treat its administrative classification as sufficient evidence that no product-quality safeguards are needed.",
      "Co-define the scope with staff, preserve approved recipe boundaries, and pilot inventory changes with agreed product-condition safeguards while communicating the verified logistics benefits.",
      "Remove all productivity and inventory measures from the project charter, and rely on tradition-focused messaging as the principal evidence that the changes are acceptable."
    ],
    "answer": 2,
    "why": "Credibility requires a defined boundary and tested safeguards, not an unsupported promise of zero interaction. Involving staff respects the valued methods while allowing logistics improvements that do not compromise product condition. The pilot should measure both intended benefits and relevant risks. Values-sensitive communication complements evidence; it does not replace measurement or demonstrate that all warehouse changes are harmless. Source alignment: ASQ CMBB Body of Knowledge, II.C.1; II.C.2; II.D.6. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-054",
    "optionRationales": [
      "Calling the valued traditions outdated directly triggers the identity concern rather than distinguishing the proposed logistics scope.",
      "The case states that inventory handling can affect condition, so the administrative label does not justify a zero-risk assurance.",
      "Correct. It combines respectful scope design with evidence that the proposed changes preserve the valued product characteristics.",
      "Removing measurement prevents verification of both logistics benefits and safeguards; favorable messaging alone does not validate the change."
    ],
    "distractors": [
      "Calling the valued traditions outdated directly triggers the identity concern rather than distinguishing the proposed logistics scope.",
      "The case states that inventory handling can affect condition, so the administrative label does not justify a zero-risk assurance.",
      "Correct. It combines respectful scope design with evidence that the proposed changes preserve the valued product characteristics.",
      "Removing measurement prevents verification of both logistics benefits and safeguards; favorable messaging alone does not validate the change."
    ],
    "trap": "Cultural alignment must be credible in the actual process. Define what remains protected, test relevant interfaces and safeguards, and avoid promising that an administrative improvement has no possible operational effects.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.C.1; II.C.2; II.D.6"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A computer-repair brand owns some locations and franchises others. In this scenario, corporate managers may assign staff at owned sites. Franchise agreements require common service-quality outcomes and records but give franchisees control over staffing and participation methods. What deployment proposal correctly distinguishes those rights?",
    "options": [
      "Use corporate staffing authority at owned sites and agreement-based outcome and record requirements at franchises, negotiating participation methods where corporate assignment authority is absent.",
      "Make service-quality records optional at franchised sites, while requiring them at owned sites, because independent ownership takes precedence over the stated common-record obligations.",
      "Assign named franchise employees to mandatory Belt projects using corporate staffing procedures, while treating the common service-quality requirement as authority to direct individual personnel.",
      "Require franchises to copy every owned-site participation method before their improvement results can be accepted, using identical internal staffing arrangements as the test of quality compliance."
    ],
    "answer": 0,
    "why": "The answer follows the rights expressly stipulated in the case. Common outcome and record obligations apply to both types of location, but direct staffing authority differs. Independent ownership does not make agreed requirements voluntary, and outcome requirements do not automatically authorize control over specific employees or local methods. Actual decisions would depend on the applicable agreements and law; no broader legal rule is asserted here. Source alignment: ASQ CMBB Body of Knowledge, II.D.4; I.E.3. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-057",
    "optionRationales": [
      "Correct. It preserves common obligations while distinguishing direct staffing authority from agreement-based governance.",
      "The scenario expressly requires common records at franchises; independent ownership does not erase that stated obligation.",
      "A service-quality obligation is not the same as authority to assign franchise personnel under the rights defined in the case.",
      "Identical internal methods are not required by the stated outcome and record obligations and conflict with the franchisees' specified control."
    ],
    "distractors": [
      "Correct. It preserves common obligations while distinguishing direct staffing authority from agreement-based governance.",
      "The scenario expressly requires common records at franchises; independent ownership does not erase that stated obligation.",
      "A service-quality obligation is not the same as authority to assign franchise personnel under the rights defined in the case.",
      "Identical internal methods are not required by the stated outcome and record obligations and conflict with the franchisees' specified control."
    ],
    "trap": "Do not turn ownership into a blanket rule about what is mandatory or voluntary. Separate required outcomes and records from authority over staffing and implementation, using the rights explicitly given in the scenario.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.D.4; I.E.3"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A national-park concessions operator proposes reducing avoidable kitchen food waste. Staff value conservation but distrust a cost-cutting narrative, fearing poorer meals. Guest volumes vary seasonally. Which project framing and measurement plan best connects the genuine conservation benefit to a credible operating decision?",
    "options": [
      "Lead with conservation language and compare total discarded kilograms between seasons, treating any lower total as evidence of improvement without adjusting for meals served.",
      "Retain cost saving as the sole success measure, and use conservation-themed communications to gain participation without measuring food waste or the effect on meal quality.",
      "Report only favorable conservation outcomes and omit the cost and service tradeoffs, treating mission alignment as sufficient reason to avoid discussing competing operational objectives.",
      "Lead with avoidable waste per meal and conservation outcomes, retain food-safety and service safeguards, and report validated cost savings and tradeoffs transparently as supporting evidence."
    ],
    "answer": 3,
    "why": "The project can authentically support conservation, but that alignment needs credible measures and safeguards. Waste per meal addresses changing volume better than raw totals, although meal mix and other context may still matter. Food safety and service quality remain constraints. Cost benefits need not be hidden; they can be reported as supporting evidence alongside tradeoffs. Reframing is substantive only when the actual goals and measurements reflect the stated value. Source alignment: ASQ CMBB Body of Knowledge, II.C.1; II.D.6; II.F.2. The scenario-specific conclusion follows from the stated case.",
    "set": 3,
    "qid": "mbb:set-3:d2-060",
    "optionRationales": [
      "Lower total waste can simply reflect fewer meals; the seasonal volume change prevents an unqualified performance conclusion from totals alone.",
      "A conservation message without an associated outcome measure or service safeguards does not address the staff's substantive concern.",
      "Mission alignment does not justify selective reporting or hiding cost and service tradeoffs from stakeholders.",
      "Correct. It connects the valued outcome to a volume-aware measure, operational safeguards and transparent benefit reporting."
    ],
    "distractors": [
      "Lower total waste can simply reflect fewer meals; the seasonal volume change prevents an unqualified performance conclusion from totals alone.",
      "A conservation message without an associated outcome measure or service safeguards does not address the staff's substantive concern.",
      "Mission alignment does not justify selective reporting or hiding cost and service tradeoffs from stakeholders.",
      "Correct. It connects the valued outcome to a volume-aware measure, operational safeguards and transparent benefit reporting."
    ],
    "trap": "A values-based message should match the charter and measures. Separate waste prevention from reduced demand, retain safety and service safeguards, and do not hide financial benefits or unfavorable tradeoffs.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.C.1; II.D.6; II.F.2"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A commercial (B2B) laundry service organizes its operations around large account relationships (e.g., \"the regional hospital network account team,\" \"the hotel chain account team\") rather than by internal functional department. How should Six Sigma deployment infrastructure be organizationally aligned to fit this account-based structure?",
    "options": [
      "Assign a single Black Belt to personally handle every account and every functional process across the entire company regardless of scale",
      "Align deployment structure with the existing account-based organization \u2014 embedding champions/Belts within account teams for account-specific improvement opportunities (e.g., a hospital-network-specific linen turnaround issue), while maintaining a smaller central function for cross-account, functional-level opportunities (e.g., a washing-process improvement applicable across all accounts) \u2014 reflecting how the business actually organizes and manages its work rather than imposing an unrelated structure",
      "Force a purely functional deployment structure (e.g., separate \"washing,\" \"delivery,\" \"billing\" Belt assignments) that cuts directly across the company's actual account-based organizational structure, regardless of how work is actually organized and managed day to day",
      "Since the company is organized by account, no functional/process-level improvement work should ever be pursued, only account-specific work"
    ],
    "answer": 1,
    "why": "Deployment infrastructure should generally align with how the organization actually manages its work (here, account-based) while still preserving a mechanism for genuinely cross-cutting functional/process opportunities \u2014 a hybrid design reflecting real organizational structure, similar in spirit to earlier matrix-design principles (D2-001, D2-019) but applied to an account-based rather than divisional structure. Source: [BOK] Domain II.A, Organizational Design; parallel to D2-001, D2-019.",
    "set": 3,
    "qid": "mbb:set-3:d2-063"
  },
  {
    "sub": "mbb-org",
    "stem": "A veterinary diagnostics lab staffed primarily by PhD-level scientists shows unexpectedly *high* resistance to Six Sigma statistical methods, despite (or perhaps because of) the staff's strong general statistical training. Investigation reveals staff view the DMAIC framework's statistical tools as \"oversimplified\" compared to the more rigorous methods used in their scientific research work. What cultural dynamic does this represent, and how should the MBB address it?",
    "options": [
      "Require all PhD scientists to abandon their own more advanced statistical methods in favor of only the standard Six Sigma toolset, regardless of appropriateness to the specific analytical question",
      "This reflects a specific form of expertise-based resistance \u2014 technically sophisticated staff may perceive standard Six Sigma tools as insufficiently rigorous relative to their own field's methods, a different flavor of the \"outsider/expertise-devaluing\" resistance pattern seen elsewhere (e.g., culinary and craftsmanship contexts), here rooted in genuine methodological sophistication rather than tenure/tradition; the MBB should engage this expertise directly \u2014 inviting staff input on where more rigorous methods are warranted, and using standard DMAIC tools primarily for their organizational/process-management value (structure, cross-functional communication, project management) rather than positioning them as replacing the staff's more advanced technical methods where those are genuinely more appropriate",
      "This is unusual and cannot be explained; highly statistically trained staff should always readily embrace Six Sigma statistical methods with no resistance",
      "Simplify all statistical training materials further to make Six Sigma statistical concepts easier to understand, addressing a training gap"
    ],
    "answer": 1,
    "why": "This tests recognizing a genuinely different variant of expertise-based resistance (rooted in real methodological sophistication, not just tenure or tradition) and correctly diagnosing that the appropriate response is engaging that expertise and appropriately scoping DMAIC's role (structural/organizational value) rather than either dismissing the concern or imposing standard tools where genuinely more rigorous methods are warranted. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-066"
  },
  {
    "sub": "mbb-org",
    "stem": "An urgent care clinic chain is launching a patient-flow improvement project that touches both clinical protocols (physician/nurse-owned) and administrative scheduling systems (operations-owned). Should this project have a single sponsor or co-sponsors, and why?",
    "options": [
      "A single sponsor is always preferable regardless of how many distinct organizational domains a project touches, to avoid any complexity in governance",
      "No sponsor is needed for cross-functional projects, since sponsorship only applies to single-department initiatives",
      "Co-sponsorship (one clinical leader, one administrative/operations leader) is generally more appropriate here, since the project genuinely spans two distinct authority domains (clinical protocol changes require clinical leadership backing; scheduling/systems changes require operational leadership backing), and a single sponsor from only one domain would likely lack full authority or credibility to drive changes in the other",
      "The Black Belt should personally serve as both the clinical and administrative sponsor, regardless of whether they hold authority in either domain"
    ],
    "answer": 2,
    "why": "When a project genuinely spans two distinct authority domains (here, clinical and administrative), co-sponsorship reflecting both domains' actual authority structures is generally more effective than a single sponsor who may lack full credibility or authority in the other domain \u2014 a standard governance design principle for genuinely cross-domain projects. Source: [BOK] Domain II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d2-070"
  },
  {
    "sub": "mbb-org",
    "stem": "A packaging manufacturer's plant manager says employees are \"resistant to change\" regarding a new Six Sigma project, but investigation reveals the plant has successfully implemented 6 other significant changes in the past year with generally positive engagement. What should the MBB consider before accepting the \"resistant to change\" diagnosis at face value?",
    "options": [
      "Conclude that the 6 previous changes must not have actually been meaningful if this new resistance exists",
      "Recommend abandoning all future change initiatives at this plant given the reported resistance",
      "Accept the plant manager's diagnosis immediately without further investigation, since plant managers always have complete and accurate insight into their own employees' attitudes",
      "Investigate further, since a plant with a demonstrated recent track record of successfully engaging with multiple changes is unlikely to be generically \"resistant to change\" as a fixed trait; the actual issue more likely lies in something specific to this particular project (e.g., poor framing, inadequate communication, insufficient frontline involvement, or a genuine concern about this specific change) rather than a general resistance disposition \u2014 the diagnosis should be re-examined rather than accepted as an inherent, unchangeable trait"
    ],
    "answer": 3,
    "why": "This tests appropriately scrutinizing a generic \"resistant to change\" label against contradicting evidence (a demonstrated recent track record of successful change engagement) \u2014 the more likely explanation is something project-specific, and the MBB should investigate rather than accept a convenient but likely inaccurate general-trait diagnosis. Source: [BOK] Domain II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d2-071"
  },
  {
    "sub": "mbb-org",
    "stem": "An ambulance service's crews operate under extreme time pressure and life-or-death stakes daily, and the organizational culture has historically treated any deviation from protocol during a call as grounds for individual disciplinary review, regardless of the systemic conditions (e.g., equipment placement, dispatch information quality) that may have contributed. A Six Sigma project analyzing protocol deviations is being met with significant crew reluctance to discuss deviations candidly. What cultural principle from earlier in this domain applies directly here, and what should the MBB recommend?",
    "options": [
      "Reduce the rigor of the root-cause analysis to avoid probing into individual crew decisions at all, regardless of whether systemic root causes remain unidentified as a result",
      "The \"just culture\" principle established in D2-035 (grocery chain shrinkage) applies directly and with even higher stakes here: distinguishing systemic contributors (equipment placement, dispatch information quality, protocol design gaps) from genuine individual misconduct is essential to get the honest, detailed information root-cause analysis requires, while still preserving appropriate accountability for actual misconduct \u2014 the MBB should recommend the same systems-focused, just-culture-based investigation approach, adapted to the emergency medical context",
      "Increase disciplinary consequences for protocol deviations to encourage more careful documentation, regardless of the impact on crews' willingness to discuss deviations candidly",
      "No relevant principle applies; high-stakes emergency medical environments are fundamentally different from all other organizational contexts and require unique approaches with no transferable lessons"
    ],
    "answer": 1,
    "why": "This tests transferring the just-culture principle established in D2-035 to a new, even higher-stakes context \u2014 recognizing that the same underlying dynamic (blame culture suppressing the honest information needed for genuine root-cause analysis) applies directly here, just with amplified consequences given the life-safety stakes involved. Source: [BOK] Domain II.D, Organizational Culture and Values Framework; direct cross-reference to D2-035 (just culture).",
    "set": 3,
    "qid": "mbb:set-3:d2-072"
  },
  {
    "sub": "mbb-org",
    "stem": "A ceramics/pottery manufacturer is designing a comprehensive feedback system from scratch, wanting to avoid the pitfalls identified throughout this domain: broken feedback loops (no follow-up), inaccessible/non-representative channels, cadence mismatches, survivorship-biased populations, and cross-cultural response-style differences (given the company sources from and sells to multiple countries). Which proposed system design best addresses all of these considerations together?",
    "options": [
      "Fifty separate feedback mechanisms, one for every conceivable customer segment and channel, with no coordination, prioritization, or resourcing plan for acting on any of them",
      "A single annual, English-only, identifiable online survey sent only to customers who placed a repeat order in the past year, with no formal process for responding to or acting on submitted feedback",
      "No formal feedback system at all, relying entirely on the ceramics manufacturer's own internal quality inspection data as a complete substitute for external customer feedback",
      "A multi-channel system: guaranteed acknowledgment/response to every submission within a defined timeframe (closing the feedback loop), accessible in relevant local languages with awareness of cross-cultural response-style differences (given genuine cross-cultural response-style differences), including specific outreach to non-repeat/one-time customers (addressing the survivorship-bias risk demonstrated elsewhere (D1-048)) and to underrepresented channels, with feedback-collection frequency matched to how quickly the relevant conditions change (per the cadence-matching principle (D2-048)) rather than a single fixed annual snapshot"
    ],
    "answer": 3,
    "why": "This capstone item requires synthesizing essentially every organizational feedback pitfall tested across the domain (closed-loop follow-up, representative population per D1-048, cadence-matching per D2-048, and cross-cultural response norms) into a single coherent, well-designed system \u2014 genuine Evaluate-level synthesis across the E subdomain. Source: [BOK] Domain II.E, Organizational Feedback (full-subdomain synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d2-073"
  },
  {
    "sub": "mbb-org",
    "stem": "A mobile phone repair chain is redesigning its store-level performance scorecard from scratch, wanting to avoid every metrics pitfall tested in this domain (vanity metrics, unpaired gaming-prone metrics, uncontrolled confounds, no assigned ownership, cadence mismatches, and metrics that lag behind an evolved business model). Which proposed scorecard design best reflects sound synthesis of these principles?",
    "options": [
      "Track \"repairs completed per day\" alone, unpaired, reported annually, with no owner and no adjustment for store-level confounds like foot traffic or repair complexity mix",
      "Track all 60 metrics the point-of-sale system is technically capable of producing, with no prioritization or rationalization, a flaw seen elsewhere when metrics proliferate without prioritization",
      "A focused, owned scorecard: repairs-completed-per-day (efficiency) paired with repair-quality/callback-rate (quality counter-metric, preventing pure speed-gaming as in a rail-industry on-time-departure example), benchmarked against store-level foot-traffic and typical-repair-complexity baselines (controlling for confounds as in a territory-difficulty example), reviewed at a cadence matched to actual business rhythm (e.g., weekly operational review, monthly trend review) rather than a single annual snapshot, with a named store manager accountable for monitoring and acting on the metrics, and explicitly revisited whenever the store's service mix changes materially (per the business-model-evolution principle)",
      "Track only customer star ratings, discarding all internal efficiency and quality-process metrics entirely"
    ],
    "answer": 2,
    "why": "This final capstone item for the F subdomain requires synthesizing every organizational performance-metrics principle tested across Batches 4-6 (vanity-metric avoidance, metric pairing, confound control, ownership, cadence-matching, and business-model-relevance) into one coherent, well-designed scorecard \u2014 the clearest demonstration of Evaluate-level synthesis to close out Domain II. Source: [BOK] Domain II.F, Organizational Performance Metrics (full-subdomain synthesis).",
    "chart": {"type": "data-table", "columns": ["Metric", "Cadence", "Owner"], "rows": [["Jobs completed / week (efficiency)", "Weekly review", "Operations manager"], ["Repair callback / rework rate (quality)", "Weekly review", "Operations manager"], ["Foot-traffic-adjusted baseline", "Reviewed quarterly", "Operations manager"], ["Business-mix change trigger", "As needed", "Operations manager"]]},
    "set": 3,
    "qid": "mbb:set-3:d2-074"
  },
  {
    "sub": "mbb-org",
    "stem": "A newly appointed MBB at a credit union inherits: (1) a matrix-reporting structure with no defined conflict-arbitration mechanism, (2) an executive sponsor who delegates without following through consistently, (3) frontline resistance rooted in genuine expertise (experienced loan officers skeptical of statistical models relative to their own judgment), (4) a stated \"member-first\" value contradicted by individual-only sales-volume incentives, (5) an annual, identifiable member feedback survey with suspiciously uniform positive results, and (6) a single unpaired \"loans processed per week\" metric currently driving visible corner-cutting. Applying the full range of Domain II principles tested across all three batches, design the most defensible overall action plan, in priority order.",
    "options": [
      "Recognize the values-behavior gap (item 4) as a likely root driver of both the suspiciously uniform feedback (item 5, since staff may fear consequences for honest reporting under a purely sales-driven incentive culture) and the metric-gaming behavior (item 6, directly incentivized by the same misaligned reward structure); address the incentive/values misalignment first, then fix the feedback mechanism's anonymity/accessibility to get trustworthy data, then redesign the metric to pair volume with a quality/member-outcome counter-metric, then establish the matrix conflict-arbitration protocol, then engage the sponsor around concrete active-sponsorship behaviors, and finally address loan-officer expertise-based resistance by engaging their judgment directly in model validation (per the veterinary-diagnostics-lab principle, D2-066) \u2014 sequencing root-cause organizational/incentive issues before the more tactical mechanism and engagement fixes that depend on them",
      "Focus exclusively on replacing the unpaired metric with a more sophisticated single metric, leaving all other issues unaddressed",
      "Address all six issues with equal, simultaneous priority and no sequencing rationale, launching six unrelated fixes in parallel with no connection between them",
      "Recommend the credit union abandon Six Sigma deployment entirely given the number of interrelated organizational issues present"
    ],
    "answer": 0,
    "why": "This final capstone item requires synthesizing the entire Domain II domain (organizational design, leadership, challenges, culture, feedback, and metrics) into a single diagnostically sound, prioritized action plan \u2014 recognizing that the incentive/values misalignment (item 4) most likely drives two of the other symptoms (suspicious feedback uniformity and metric gaming), and sequencing that root fix first, before mechanism-level fixes (feedback, metrics) and finally structural/engagement fixes (matrix arbitration, sponsorship, expertise-based resistance) \u2014 genuinely Create-level synthesis across all 75 questions in this domain. Source: [BOK] Domain II, full domain synthesis (A\u2013F), closing Domain II.",
    "set": 3,
    "qid": "mbb:set-3:d2-075"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A shipbuilding company's Black Belt wants to advance from Measure to Analyze despite the measurement system analysis (MSA) for the key defect-tracking gauge showing marginal (not clearly acceptable) repeatability and reproducibility results. The BB argues \"we're behind schedule and need to keep moving.\" What is the MBB's best next action?",
    "options": [
      "Deny tollgate advancement until the measurement system issue is resolved (either through gauge improvement, operator retraining, or an accepted alternative measurement approach), since proceeding to Analyze with an unreliable measurement system risks building all subsequent analysis on untrustworthy data \u2014 a foundational data-integrity issue that schedule pressure does not override",
      "Approve the phase advancement to preserve the project schedule, treating the marginal MSA result as an acceptable trade-off",
      "Replace the Black Belt with someone more experienced, assuming individual competence is the root issue",
      "Allow the team to proceed to Analyze but skip Improve and Control phases entirely to make up the lost time"
    ],
    "answer": 0,
    "why": "Tollgate discipline exists precisely to prevent exactly this scenario \u2014 schedule pressure driving a team past a foundational data-quality gate. A marginal or failing MSA result undermines the validity of everything analyzed afterward, making this a case where the tollgate must hold regardless of schedule pressure. Source: [CSSC] Ch. 13, Measure (MSA); [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-001"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A luxury watch manufacturer's portfolio review currently happens once annually, but the company's product development cycles and market conditions change substantially within any given year. What portfolio governance cadence adjustment should the MBB recommend, and why?",
    "options": [
      "Move to a more frequent portfolio review cadence (e.g., quarterly), since the pace of relevant change (product cycles, market conditions) substantially exceeds what an annual cadence can responsively track \u2014 mirroring the cadence-matching principle applicable to feedback systems (as in earlier organizational feedback contexts) but applied here to portfolio governance: review frequency should match the actual rate of change in the environment being governed",
      "Continue annual review only, since it is the most common cadence across all industries and organizational types",
      "Eliminate portfolio review entirely, since any fixed cadence will inevitably become outdated at some point",
      "Increase review frequency to daily, regardless of whether daily-level portfolio decisions are actually needed or practical given typical project durations"
    ],
    "answer": 0,
    "why": "This applies the cadence-matching principle (previously established for organizational feedback systems) to portfolio governance: review frequency should be calibrated to the actual rate of relevant environmental/business change, and an annual cadence in a fast-changing context under-serves timely portfolio decision-making. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d3-005"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A pharmacy benefit manager's portfolio includes 15 active projects, three of which independently depend on the same upcoming claims-system software upgrade being delivered on time by an external vendor. No portfolio-level mechanism currently tracks this shared dependency across the three project teams, each of which is unaware the others share the same critical dependency. What portfolio infrastructure element is missing, and what is the risk?",
    "options": [
      "Nothing is missing; each project team's individual risk register is sufficient since dependencies are, by definition, a project-level rather than portfolio-level concern",
      "A portfolio-level risk register / dependency-tracking mechanism that aggregates and surfaces shared risks and dependencies across multiple projects is missing; the risk is that if the vendor upgrade is delayed, three projects could be simultaneously and unexpectedly impacted, and without portfolio-level visibility, no one is positioned to proactively communicate, mitigate, or contingency-plan for this shared exposure before it materializes",
      "The three projects should be immediately merged into a single mega-project regardless of whether their actual scopes and objectives are otherwise unrelated",
      "The vendor should be replaced immediately without further analysis, based solely on the existence of this shared dependency"
    ],
    "answer": 1,
    "why": "Shared dependencies that cross multiple individually-scoped projects require portfolio-level (not just project-level) risk visibility \u2014 this is a specific and common infrastructure gap where each project's own risk register, however good, cannot surface a risk that only becomes apparent when viewed across the portfolio as a whole. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management.",
    "chart": {"type": "activity-network", "nodes": {"Vendor upgrade": {"col": 1, "row": 0, "dur": 90}, "Project A": {"col": 0, "row": 1, "dur": 60}, "Project B": {"col": 1, "row": 1, "dur": 75}, "Project C": {"col": 2, "row": 1, "dur": 45}}, "edges": [["Vendor upgrade", "Project A"], ["Vendor upgrade", "Project B"], ["Vendor upgrade", "Project C"]]},
    "set": 3,
    "qid": "mbb:set-3:d3-008"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A zoo/aquarium's portfolio management office wants a tool to visualize whether its 4 Black Belts are over- or under-allocated across the 9 currently active projects at any given time. Which portfolio infrastructure tool is most directly suited to this purpose?",
    "options": [
      "A SIPOC diagram for each of the 9 projects individually",
      "A resource-loading/capacity chart (showing each Belt's allocated hours or project-count across the active portfolio against their available capacity), which directly visualizes over- or under-allocation at the individual-resource level across the full active project set \u2014 the standard portfolio infrastructure tool purpose-built for this specific capacity-visibility need",
      "A fishbone diagram, since it identifies root causes of resource allocation problems",
      "A control chart tracking defect rates across all 9 projects combined"
    ],
    "answer": 1,
    "why": "A resource-loading/capacity chart is the specific, purpose-built portfolio management tool for visualizing resource allocation and capacity across multiple concurrent projects \u2014 directly matching the stated need. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management.",
    "chart": {"type": "data-table", "columns": ["Belt", "Assigned projects"], "rows": [["Belt 1", "3"], ["Belt 2", "2"], ["Belt 3", "1"], ["Belt 4", "3"]], "whatIf": {"id": "belt-capacity", "label": "Sustainable capacity per Belt", "value": 2, "min": 1, "max": 5, "step": 1, "unit": " projects", "committed": 3, "committedLabel": "Belt 1's current assignment"}},
    "set": 3,
    "qid": "mbb:set-3:d3-011"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A medical billing company is comparing two candidate projects using a cost-benefit ratio (annual benefit \u00f7 total implementation cost). Project M: $300,000 annual benefit, $150,000 implementation cost (ratio = 2.0). Project N: $900,000 annual benefit, $600,000 implementation cost (ratio = 1.5). Using cost-benefit ratio alone, which project appears more attractive, and what important caution should the MBB raise about relying on this ratio alone for final selection?",
    "options": [
      "Cost-benefit ratio is meaningless unless both projects have exactly the same implementation cost",
      "Project M appears more attractive by ratio (2.0 vs. 1.5), but the MBB should caution that ratio alone ignores absolute value creation \u2014 Project N generates $900,000 \u2212 $600,000 = $300,000 in net annual benefit versus Project M's $300,000 \u2212 $150,000 = $150,000, meaning N actually creates twice the absolute net value despite its lower ratio; ratio and absolute-value metrics can favor different projects, and both should inform the final decision, especially when capital/capacity constraints (which favor efficiency/ratio) versus absolute value-maximization goals differ",
      "The two projects are financially identical since both have positive cost-benefit ratios",
      "Project N is unambiguously the better choice with no further caution needed, since its absolute benefit figure is larger"
    ],
    "answer": 1,
    "why": "M's ratio (2.0) exceeds N's (1.5), but N's absolute net benefit ($300,000) is twice M's ($150,000) \u2014 a genuine tension between capital-efficiency (ratio) and absolute-value (net benefit) framings that the MBB must surface, since the \"right\" choice can depend on whether the organization is capital-constrained (favoring ratio/efficiency) or value-maximizing with available capital (favoring absolute net benefit). Source: [BOK] Domain III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d3-012"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A playground equipment manufacturer's project schedule shows several parallel workstreams (material testing, supplier qualification, and design review), each with different durations and dependencies feeding into a final \"manufacturing readiness\" milestone. Which project management concept identifies which specific sequence of tasks determines the minimum possible project duration?",
    "options": [
      "The Pareto principle, since it identifies the vital few tasks contributing most to project value",
      "The control limit, since it defines acceptable variation in task duration",
      "The DPMO calculation, since it quantifies defects per task across the schedule",
      "The critical path \u2014 the sequence of dependent tasks with the longest total duration through the project network, which determines the minimum possible completion time; any delay to a task on the critical path directly delays the overall project, while delays to tasks with slack/float on non-critical paths may not affect the overall timeline"
    ],
    "answer": 3,
    "why": "Critical path is the standard project management concept for exactly this purpose \u2014 identifying the longest dependent task sequence that determines minimum overall project duration, distinguishing schedule-critical tasks from those with float/slack. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "chart": {"type": "activity-network", "nodes": {"Material testing": {"col": 0, "row": 0, "dur": 3}, "Supplier qualification": {"col": 0, "row": 1, "dur": 4}, "Design review": {"col": 0, "row": 2, "dur": 6}, "Manufacturing readiness": {"col": 1, "row": 1, "dur": 1}}, "edges": [["Material testing", "Manufacturing readiness"], ["Supplier qualification", "Manufacturing readiness"], ["Design review", "Manufacturing readiness"]]},
    "set": 3,
    "qid": "mbb:set-3:d3-016"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "An elevator maintenance company's portfolio prioritization criteria were formally established three years ago (weighted toward safety-incident reduction) but have never been revisited, even though the company's strategic focus has since shifted substantially toward predictive-maintenance technology adoption. Projects are still being scored and ranked against the original, now partially outdated criteria. What infrastructure principle is being violated?",
    "options": [
      "Portfolio prioritization criteria are themselves a piece of infrastructure that requires periodic re-validation against current strategic priorities (directly paralleling the periodic re-validation principle established for strategic plans (D1-069) and, similarly, for organizational design); using three-year-old criteria weighted toward a since-superseded strategic emphasis risks systematically mis-prioritizing the current portfolio against outdated rather than current organizational priorities",
      "Prioritization criteria are irrelevant to actual project selection outcomes and can be safely ignored regardless of their currency",
      "The company should immediately halt all portfolio prioritization activities until entirely new criteria can be developed from scratch, discarding the existing criteria's continued partial relevance (safety remains presumably still important) without review",
      "Prioritization criteria, once established, should remain permanently fixed regardless of any subsequent strategic changes, to preserve historical comparability across all scored projects"
    ],
    "answer": 0,
    "why": "This extends the periodic re-validation principle (established for strategic plans and organizational design in Domains I and II) to portfolio prioritization criteria specifically \u2014 criteria are infrastructure that can drift out of alignment with current strategy exactly like a strategic plan or org design can, and require the same kind of periodic reassessment. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management; direct cross-reference to D1-069 (periodic re-validation principle).",
    "set": 3,
    "qid": "mbb:set-3:d3-017"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "Synthesizing the project lifecycle discipline issues tested in this batch (premature tollgate advancement with a marginal MSA, uncontrolled scope creep, incomplete Analyze-phase root-cause validation, and missing Control-phase sustainment mechanisms), what is the common underlying principle an MBB should apply when reviewing any project's lifecycle management, at a dry ice supplier or any other organization?",
    "options": [
      "Schedule adherence should always take precedence over every other lifecycle consideration, since delayed projects are the primary risk to guard against",
      "Only the Define and Measure phases require rigorous gate discipline; Analyze, Improve, and Control can be treated more flexibly once initial project setup is complete",
      "Lifecycle discipline is primarily a documentation exercise with limited actual impact on project outcomes, as long as the final results appear satisfactory",
      "Lifecycle discipline requires treating each phase's exit criteria (data quality validation, formally-approved scope, sufficiently-validated root causes, and durable sustainment mechanisms) as genuine gates that must be substantively satisfied \u2014 not just procedurally checked off \u2014 before advancing, since shortcuts at any phase (as demonstrated across this batch's MSA, scope, Analyze, and Control examples) predictably undermine the value and validity of everything built on top of that phase afterward"
    ],
    "answer": 3,
    "why": "This synthesis item distills the batch's four lifecycle-discipline scenarios (D3-001 MSA tollgate, plus scope-creep, incomplete-Analyze, and missing-Control-sustainment scenarios tested elsewhere in this domain) into the general principle that phase-gate exit criteria must be substantively (not just procedurally) satisfied, since shortcuts predictably propagate and undermine everything built afterward \u2014 a genuinely MBB-level synthesis across the subdomain. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle (subdomain synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d3-022"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A shoe manufacturer's Black Belt drafts a project charter and proceeds directly into Measure-phase data collection without obtaining the sponsor's formal sign-off on the charter, reasoning \"I'm confident they'll approve it, so let's not lose time waiting.\" Two weeks into Measure, the sponsor reviews the charter and requests a significantly different problem statement and scope. What Define-phase discipline was violated, and what was the cost of skipping it?",
    "options": [
      "The project should be permanently canceled since the charter required revision",
      "The sponsor should be overruled since the Black Belt's original charter was more technically sound",
      "Formal charter sign-off before proceeding to Measure is a foundational Define-phase gate specifically because it confirms sponsor alignment on problem statement and scope before resource-intensive data collection begins; skipping it risks exactly what happened here \u2014 two weeks of Measure-phase effort now needing significant rework because the team was collecting data against a scope the sponsor didn't actually endorse, a more costly outcome than the brief delay formal sign-off would have required",
      "No discipline was violated; proceeding on the assumption of eventual approval is an acceptable way to preserve schedule momentum"
    ],
    "answer": 2,
    "why": "This reinforces the Define-phase tollgate discipline principle (extending D3-001's Measure-phase MSA example back to the earliest gate): confirming sponsor alignment before resource-intensive downstream work begins is precisely what prevents costly rework, and the two weeks \"saved\" by skipping sign-off were actually lost to rework, a net negative trade-off. Source: [CSSC] Ch. 12, Define (Creating a Project Charter); [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-026"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "An offshore wind farm operator's cost-benefit analysis for a turbine-maintenance-scheduling project includes labor savings and reduced downtime revenue recovery, but omits the cost of an additional specialized safety-certification requirement that the new maintenance schedule would trigger. A colleague catches this before the analysis is finalized. What type of analytical flaw was caught, and why does it matter?",
    "options": [
      "There is no meaningful flaw since safety-certification costs are always negligible compared to labor and downtime savings in wind energy operations",
      "Safety-certification costs should never be included in cost-benefit analysis since they are a regulatory rather than operational cost category",
      "The analysis should be abandoned entirely since one omitted cost proves the whole analysis is worthless",
      "This is an incomplete cost-benefit analysis that omitted a material cost category (the triggered safety-certification requirement) directly caused by the proposed change; failing to include all relevant costs \u2014 not just the most obvious operational ones \u2014 can lead to an inflated apparent net benefit and a poorly-informed portfolio prioritization decision, since the project may look far more attractive than it actually is once the full cost picture is included"
    ],
    "answer": 3,
    "why": "This tests recognizing an incomplete-cost-accounting flaw \u2014 a real, material cost directly triggered by the proposed change was omitted, risking an inflated and misleading net-benefit figure feeding into portfolio prioritization; the fix is completing the analysis with all directly-caused costs, not the extreme responses in C or D. Source: [BOK] Domain III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d3-031"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A pet food manufacturer's ingredient-substitution project team consists entirely of quality and operations personnel, with no representative from R&D/formulation, even though the project directly involves reformulating a recipe. Midway through Analyze, the team discovers a proposed substitute ingredient interacts unexpectedly with another formula component in a way R&D would likely have flagged immediately. What team-composition principle was violated, and what should the MBB require going forward?",
    "options": [
      "The project should proceed without R&D involvement even now, since restructuring the team mid-project is never appropriate regardless of the discovered gap",
      "R&D should be excluded from all future projects permanently, given that their absence caused this specific issue",
      "No principle was violated; quality and operations personnel are always sufficient for any project touching product formulation, regardless of technical domain expertise gaps",
      "The team composition omitted a critical technical-domain expert (R&D/formulation) whose specialized knowledge directly bears on the project's core technical question, a team-composition gap analogous to (though distinct from) earlier culinary and craftsmanship expertise-engagement issues tested elsewhere in this domain \u2014 here the gap is about who is formally on the project team from the start, not just how existing team members' expertise is engaged; the MBB should require project chartering to include a technical-domain-fit review of proposed team composition before Analyze-phase work begins, specifically checking whether the project's core technical questions are covered by someone with direct relevant expertise"
    ],
    "answer": 3,
    "why": "This is a team-composition/charter-review gap distinct from (though thematically related to) the engagement-style issues tested earlier \u2014 the fix is a formal technical-domain-fit check during chartering, ensuring core technical questions are covered by directly relevant expertise from project inception, not just an engagement-style adjustment with existing team members. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle; parallel to earlier expertise-engagement scenarios.",
    "set": 3,
    "qid": "mbb:set-3:d3-035"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A kayak/canoe manufacturer has $500,000 in available capital for improvement projects this cycle. Three independent (non-mutually-exclusive) candidate projects require $200,000, $250,000, and $300,000 respectively, with NPVs of $180,000, $220,000, and $240,000 \u2014 but the three combined ($750,000) exceed the $500,000 available capital. Using the profitability index (NPV \u00f7 investment) to rank under this capital constraint, which combination of projects should be selected, and why does profitability index (rather than raw NPV ranking) matter here?",
    "options": [
      "Profitability indices: Project 1 = 180/200 = 0.90; Project 2 = 220/250 = 0.88; Project 3 = 240/300 = 0.80. Under capital rationing (a fixed budget insufficient for all candidates), ranking by profitability index rather than raw NPV correctly identifies which combination of projects maximizes total NPV within the constrained budget; selecting Projects 1 and 2 ($200K + $250K = $450K, within the $500K limit) yields a combined NPV of $400,000, while Projects 1 and 3 ($200K + $300K = $500K) yield $420,000 \u2014 actually the higher-value combination despite Project 3's lower profitability index than Project 2, illustrating that profitability index ranking is a useful heuristic but combinatorial checking of feasible combinations within the budget constraint is the fully rigorous approach",
      "Select all three projects regardless of the capital constraint, since all three have positive NPV",
      "Select only Project 3, since it has the single highest NPV among the three",
      "The capital constraint is irrelevant since all three projects have already been determined to have positive NPV individually"
    ],
    "answer": 0,
    "why": "This is a genuinely rigorous capital-rationing question: profitability index is a useful first-pass ranking heuristic under budget constraints, but the fully correct approach checks all feasible combinations within the budget \u2014 here, Projects 1+3 ($500K, NPV $420K) actually beats Projects 1+2 ($450K, NPV $400K) despite Project 2's higher profitability index than Project 3, demonstrating the heuristic's limitation and the value of full combinatorial verification for a small number of candidates. Source: [BOK] Domain III.C, Project Portfolio Financial Tools (capital rationing/profitability index).",
    "chart": {"type": "data-table", "columns": ["Project", "Cost", "NPV", "Profitability index"], "rows": [["Project 1", "$200,000", "$180,000", "0.90"], ["Project 2", "$250,000", "$220,000", "0.88"], ["Project 3", "$300,000", "$240,000", "0.80"]], "whatIf": {"id": "capital-budget", "label": "Available capital", "value": 500, "min": 200, "max": 750, "step": 50, "unit": "K", "committed": 450, "committedLabel": "Projects 1 and 2 combined"}},
    "set": 3,
    "qid": "mbb:set-3:d3-037"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "Synthesizing the lifecycle principles from both batches of this domain (Define sign-off and stakeholder completeness, Measure-phase MSA gating, Analyze-phase root-cause sufficiency, Improve-phase team composition, and Control-phase sustainment validation), a 3D printing service bureau's new MBB wants a single audit checklist question to ask at *every* phase gate, regardless of which specific phase. What should that universal question be?",
    "options": [
      "\"How much money have we spent so far?\" \u2014 since financial tracking is the only dimension that matters at any phase gate, regardless of the underlying technical or process work quality",
      "\"Does the Black Belt personally feel confident about the results?\" \u2014 since subjective practitioner confidence is a more reliable indicator than any specific technical exit criteria",
      "\"Has this phase's substantive exit criteria been genuinely satisfied (not just procedurally checked off), and if not, what specific risk are we accepting by proceeding anyway?\" \u2014 a universal question applicable across all five DMAIC phases that forces explicit acknowledgment of any shortcuts, directly addressing the pattern common to every lifecycle failure demonstrated across this domain (marginal MSA, missing sign-off, incomplete root-cause validation, missing technical expertise, unvalidated control plan)",
      "\"Are we on schedule?\" \u2014 since schedule adherence is the single most important consideration at every phase gate, more important than the substantive content of each phase's work"
    ],
    "answer": 2,
    "why": "This is the batch's ultimate synthesis question, distilling every lifecycle failure demonstrated across ten-plus items in this domain, including D3-001, D3-026, and D3-035 into one universal diagnostic question applicable at any phase gate \u2014 forcing explicit, honest acknowledgment of any shortcuts rather than allowing them to pass silently, which is the common thread across every failure mode this domain has tested. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle (full-subdomain synthesis, both batches).",
    "set": 3,
    "qid": "mbb:set-3:d3-041"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A luggage manufacturer's MBB is asked to characterize the organization's overall portfolio management maturity, given: standardized status reporting exists, a defined review cadence exists, but there is no dependency/risk register, no capacity-checking intake gate, and prioritization criteria haven't been revisited in over three years. Synthesizing the infrastructure principles from this domain, how should the MBB characterize this maturity level, and what is the priority order for closing the remaining gaps?",
    "options": [
      "The organization should be characterized as having no meaningful portfolio management infrastructure at all, despite the two elements already in place",
      "The organization has achieved full portfolio management maturity, since two of five infrastructure elements are in place",
      "All five infrastructure elements should be pursued with identical priority and urgency, since maturity models don't support differentiated sequencing",
      "The organization has partial maturity \u2014 reporting/visibility infrastructure is reasonably established, but two significant gaps remain that pose active, compounding risk (no intake gate, meaning WIP overload risk per the pipeline-overload principle (D1-025), and no dependency register, meaning unmanaged cross-project risk exposure per D3-008), while the stale prioritization criteria (D3-017) represents a strategic-alignment risk that, while real, compounds more slowly; the MBB should prioritize closing the intake-gate and dependency-register gaps first (actively compounding risks), then address the prioritization criteria refresh"
    ],
    "answer": 3,
    "why": "This capstone item requires synthesizing the domain's infrastructure principles into a genuine maturity assessment with differentiated urgency: actively-compounding risks (unconstrained intake, unmanaged dependencies) warrant more urgent attention than a slower-compounding strategic-alignment gap (stale criteria) \u2014 a nuanced, Evaluate-level judgment rather than a binary \"mature/immature\" or undifferentiated-priority characterization. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management (full-subdomain synthesis, both batches).",
    "set": 3,
    "qid": "mbb:set-3:d3-042"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A fireworks manufacturer's portfolio committee is evaluating a process-safety-improvement project with a modest projected NPV ($85,000) alongside several other candidate projects with substantially higher NPVs ($200,000+) but no direct safety dimension. How should the MBB advise the committee to weigh the safety project relative to pure NPV ranking?",
    "options": [
      "The MBB should advise that the safety project's evaluation include the potential cost of a safety incident it's designed to prevent (which, if quantified even conservatively \u2014 including regulatory, reputational, potential injury/fatality liability, and operational disruption costs \u2014 often substantially exceeds the projected NPV figure calculated from routine operational savings alone), and should recommend the committee weigh safety-critical projects with appropriate additional consideration beyond a pure NPV comparison against non-safety candidates, echoing the leading-indicator safety principle established in D1-055",
      "The safety project should automatically be ranked above all other candidates regardless of its actual NPV or the other projects' relative merits",
      "The safety project should be ranked strictly by its NPV figure alone, with no special consideration given to its safety dimension, treating it identically to any other candidate",
      "Safety-related projects should never be evaluated using any financial tools at all, since safety has no legitimate connection to financial analysis"
    ],
    "answer": 0,
    "why": "This connects to the safety leading-indicator principle established in D1-055: safety-critical projects' true expected value often substantially exceeds what routine operational-savings-only NPV calculations capture, once the (admittedly harder to precisely quantify, but real and often severe) cost of a prevented incident is included \u2014 the MBB should advise weighing this appropriately rather than treating the project identically to non-safety candidates on a narrow NPV basis. Source: [BOK] Domain III.C, Project Portfolio Financial Tools; direct cross-reference to D1-055 (safety leading-indicator principle).",
    "set": 3,
    "qid": "mbb:set-3:d3-043"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "An escape room chain's Black Belt discovers during Improve-phase piloting that a proposed solution reveals a previously-unidentified root cause not surfaced during the original Analyze phase. Is returning to Analyze at this point a violation of DMAIC's sequential structure?",
    "options": [
      "The team should ignore the newly discovered root cause entirely and proceed with the original Improve-phase plan regardless of the new information",
      "The entire project should be restarted from Define whenever any new information emerges during any later phase, regardless of the information's actual scope or significance",
      "Yes; DMAIC is a strictly linear methodology, and once a team has left a phase, returning to it under any circumstances is a fundamental violation of the methodology that should never occur",
      "No; while DMAIC phases are generally sequential, the methodology is not so rigid as to prohibit returning to an earlier phase when new information (such as a previously-unidentified root cause surfacing during piloting) genuinely warrants it \u2014 treating DMAIC as a purely linear, one-way process that can never incorporate new learning would itself be a misapplication of the methodology's actual intent, which is disciplined problem-solving, not rigid procedural sequence for its own sake"
    ],
    "answer": 3,
    "why": "This tests understanding that DMAIC's phase structure serves disciplined problem-solving, not rigid procedural sequence \u2014 genuinely new, significant information (a previously-unidentified root cause) legitimately warrants returning to an earlier phase, and the methodology's actual intent is well-served (not violated) by this kind of disciplined iteration when new evidence demands it. Source: [CSSC] Ch. 11, Introduction to DMAIC and DMADV; [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-044"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A car wash chain's project charter commits to a 6-week timeline for a full DMAIC cycle addressing a moderately complex, multi-site water-usage-reduction problem, a timeline the assigned Black Belt privately believes is unrealistic given the problem's actual complexity, but did not raise this concern during charter approval. By week 5, the project is barely through Analyze. What project management principle was violated at the charter stage, and what should the MBB have required?",
    "options": [
      "The Black Belt should be blamed entirely and replaced, since raising concerns about timelines is solely the Black Belt's individual responsibility with no charter-process implications",
      "The 6-week timeline should be extended indefinitely without any further scope or resource discussion, simply allowing the project to take as long as it takes",
      "The charter-approval stage should include the assigned Black Belt's honest, professional assessment of timeline feasibility given the problem's actual scope and complexity \u2014 silently accepting a timeline privately believed to be unrealistic sets the project up for exactly the kind of schedule failure now occurring, and denies the sponsor the opportunity to make an informed decision (e.g., extending the timeline, narrowing the scope, or adding resources) at the point when doing so would have been far less costly than discovering the problem mid-project",
      "There is no violation; Black Belts should always accept whatever timeline is proposed during chartering without raising concerns, regardless of their own professional assessment of feasibility"
    ],
    "answer": 2,
    "why": "This tests recognizing that charter approval should include honest, professional feasibility assessment from the person actually executing the work \u2014 silently accepting a privately-doubted timeline denies the sponsor an informed decision point and predictably leads to exactly the kind of downstream schedule failure demonstrated here, a preventable outcome if raised honestly at chartering. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-045"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A vending machine operator's completed Six Sigma projects are closed out with no centralized archive \u2014 final reports exist only on individual Black Belts' personal drives, and when a Black Belt leaves the company, their completed project documentation is often lost entirely. What portfolio infrastructure element is missing, and why does it matter?",
    "options": [
      "Only currently-employed Black Belts' projects need archiving; departed Black Belts' historical work can be safely discarded entirely",
      "Archiving should be each individual Black Belt's personal responsibility to maintain indefinitely on their own personal devices, with no organizational-level backup or centralization",
      "Nothing is missing; completed projects no longer have any organizational relevance once closed, so their documentation's fate afterward is unimportant",
      "A centralized project archive/knowledge repository is missing \u2014 without one, valuable institutional knowledge (root causes found, solutions that worked or didn't, control plans, lessons learned) is lost when individual Black Belts depart, forcing future teams to potentially re-discover the same root causes or repeat past mistakes on similar problems; the MBB should establish a standard, centralized archiving requirement as part of formal project closure"
    ],
    "answer": 3,
    "why": "This is a specific and consequential infrastructure gap \u2014 completed project knowledge has ongoing organizational value (preventing re-discovery of known root causes, informing similar future projects), and relying on individual personal storage with no centralized archive predictably loses this value when personnel turn over. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d3-046"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A mattress manufacturer's project financial case for new automated stitching equipment lists a $350,000 purchase price as the full \"project cost,\" but omits installation, operator retraining, a 6-week production ramp-down during changeover (with associated lost-production cost), and ongoing annual maintenance contracts. If installation ($40,000), retraining ($15,000), ramp-down lost production ($60,000), and Year 1 maintenance ($20,000) are properly included, what is the corrected total Year 1 cost, and what principle does this correction illustrate?",
    "options": [
      "Total cost of ownership calculations are unnecessary as long as the purchase price is accurately stated",
      "Corrected total Year 1 cost = $350,000 + $40,000 + $15,000 + $60,000 + $20,000 = $485,000; this illustrates the total cost of ownership (TCO) principle \u2014 the full cost of a capital investment includes not just the purchase price but all directly-associated implementation, transition, and ongoing costs, and omitting these (as the original case did) can significantly understate the true investment required, distorting NPV, payback, and other financial comparisons against other portfolio candidates",
      "The corrected cost is still $350,000, since only the purchase price is relevant to portfolio financial comparison",
      "The corrected cost is $425,000, since ramp-down lost production should never be counted as a real cost"
    ],
    "answer": 1,
    "why": "$350,000 + $40,000 + $15,000 + $60,000 + $20,000 = $485,000. This tests both correct arithmetic and the total cost of ownership (TCO) principle \u2014 purchase price alone frequently and significantly understates a capital investment's true cost, directly paralleling the incomplete cost-benefit analysis flaw tested in D3-031 but applied to the cost side of a capital equipment case specifically. Source: [BOK] Domain III.C, Project Portfolio Financial Tools; cross-reference to D3-031 (incomplete cost-benefit analysis).",
    "set": 3,
    "qid": "mbb:set-3:d3-047"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A hearing aid manufacturer's newly appointed MBB wants to design a single, comprehensive phase-gate audit checklist covering the full range of lifecycle failure modes demonstrated across this entire domain (Define sign-off/stakeholder completeness/communication planning/team composition/timeline feasibility; Measure MSA adequacy; Analyze root-cause sufficiency; Improve solution validation; Control sustainment). Which checklist design principle should govern how this audit tool is structured?",
    "options": [
      "A single yes/no question per phase (\"Is this phase done?\"), since simplicity is always preferable to comprehensiveness in audit tool design regardless of what the audit needs to actually catch",
      "A phase-specific set of substantive exit-criteria questions for each DMAIC phase (e.g., for Define: charter sign-off obtained? all affected stakeholder groups, including frontline execution staff, represented? communication plan defined? team composition technically appropriate to the problem? timeline feasibility honestly assessed? \u2014 and analogous substantive questions for Measure's MSA adequacy, Analyze's root-cause sufficiency, Improve's solution validation, and Control's sustainment mechanisms), explicitly designed so that each specific failure mode demonstrated across this domain has a corresponding checklist question that would have caught it before the project proceeded",
      "A single checklist item covering only budget and schedule status, since financial and timeline tracking are the only aspects of lifecycle management genuinely worth auditing",
      "No checklist is necessary; experienced Black Belts should be trusted to self-identify any lifecycle gaps without any structured audit tool"
    ],
    "answer": 1,
    "why": "This final capstone item for Domain III requires synthesizing every specific lifecycle failure mode demonstrated across both batches, including D3-001, D3-026, D3-035, and D3-045 into a genuinely comprehensive, phase-specific audit tool design \u2014 each documented failure mode should map to a specific checklist question designed to catch it proactively, a true Create-level synthesis task closing out the domain's lifecycle subdomain. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle (full-subdomain capstone).",
    "set": 3,
    "qid": "mbb:set-3:d3-048"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A drone delivery startup's newly appointed MBB is designing portfolio management infrastructure from scratch for a rapidly scaling organization (similar to other rapidly-scaling organizations discussed elsewhere in this bank), wanting to avoid every infrastructure gap demonstrated across this domain (missing centralized visibility, mismatched review cadence, missing dependency/risk tracking, unconstrained intake, stale prioritization criteria, non-standardized reporting, undefined escalation thresholds, no centralized archive). Which single design principle should anchor the overall infrastructure architecture?",
    "options": [
      "Design infrastructure around a small number of core, complementary capabilities \u2014 centralized visibility, appropriately-paced governance cadence, dependency/risk aggregation, capacity-checking intake, periodically-revalidated prioritization criteria, standardized reporting with clear escalation thresholds, and a centralized knowledge archive \u2014 built initially in a lightweight, scalable form appropriate to current organizational size (per the resource-scaling principle (D2-032)), with an explicit plan to revisit and mature each capability as the organization grows (per the periodic re-validation principle (D1-069, D3-017)), rather than either under-building or over-building relative to current and near-future actual needs",
      "Skip infrastructure design entirely at this early stage, since a startup should prioritize speed over any governance structure regardless of the risks this has been shown to create elsewhere in this domain",
      "Build the most complex, feature-complete infrastructure possible immediately, regardless of the organization's current small scale and rapid rate of change, mirroring a much larger and more mature organization's infrastructure",
      "Copy another company's infrastructure exactly, regardless of differences in industry, scale, or organizational structure"
    ],
    "answer": 0,
    "why": "This final capstone item for the infrastructure subdomain requires synthesizing not just this domain's infrastructure gaps but also the resource-scaling principle (D2-032) and periodic re-validation principle (D1-069, D3-017) established across the entire question bank into a single coherent design philosophy: build the necessary core capabilities in a scale-appropriate, initially lightweight form, with an explicit maturation plan \u2014 genuinely Create-level synthesis spanning multiple domains. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management (full-subdomain capstone); cross-domain synthesis with D1-069 and D2-032.",
    "set": 3,
    "qid": "mbb:set-3:d3-049"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A funeral casket manufacturer's MBB is asked to design a standard financial evaluation template to be used for every future portfolio candidate project, synthesizing every financial-tools principle demonstrated across this domain (payback period limitations, NPV/discount-rate sensitivity, hard vs. soft savings distinction, cost-benefit completeness including omitted/hidden costs, NPV vs. IRR ranking conflicts, sunk cost exclusion, sensitivity analysis for uncertain estimates, capital rationing under budget constraints, safety-critical project special consideration, and total cost of ownership). Which template design best reflects synthesis of all these principles?",
    "options": [
      "Different, inconsistent templates for every individual project, tailored ad hoc by each Black Belt with no standardized elements at all",
      "A template requiring only a subjective \"high/medium/low\" value rating assigned by the project sponsor, with no supporting quantitative analysis of any kind",
      "A structured template requiring: (1) total cost of ownership (not just purchase/implementation price, capturing all directly-associated costs per D3-047), (2) NPV and payback period calculated together (never either alone, given each metric's distinct limitations given each metric's distinct limitations), (3) explicit hard vs. soft savings classification , (4) a sensitivity range rather than a single-point estimate for any benefit with meaningful uncertainty , (5) explicit confirmation that no sunk costs have influenced the forward-looking analysis , (6) a completeness check for commonly-omitted cost categories such as regulatory/certification triggers , and (7) a flag for any safety-critical dimension warranting evaluation beyond routine NPV alone (per D3-043) \u2014 with capital-rationing/combinatorial analysis (per D3-037) applied at the portfolio level once individual project templates are complete",
      "A single-line template requiring only \"estimated annual savings\" with no further detail, structure, or supporting analysis of any kind"
    ],
    "answer": 2,
    "why": "This final capstone item for Domain III requires synthesizing all ten distinct financial-tools principles demonstrated across both batches, including D3-012, D3-031, D3-037, D3-043, and D3-047 into a single, comprehensive, standardized evaluation template \u2014 the clearest possible demonstration of Create-level synthesis closing out Domain III's financial-tools subdomain and the domain as a whole. Source: [BOK] Domain III.C, Project Portfolio Financial Tools (full-subdomain and full-domain capstone).",
    "set": 3,
    "qid": "mbb:set-3:d3-050"
  },
  {
    "sub": "mbb-training",
    "stem": "A hospital system wants to roll out Green Belt training but hasn't formally assessed which departments have the most improvement-ready staff or the biggest capability gaps. The training office proposes training 50 employees selected by seniority alone. What should the MBB recommend first?",
    "options": [
      "Conduct a formal training needs analysis (capability gaps by department, leadership sponsorship readiness, and linkage to actual pipeline opportunities) before selecting candidates, since seniority alone doesn't indicate improvement aptitude or organizational need",
      "Train all employees simultaneously regardless of department or readiness",
      "Proceed with the seniority-based list, since tenure correlates with readiness",
      "Skip needs analysis and let each department self-select who to send"
    ],
    "answer": 0,
    "why": "Training needs analysis should precede candidate selection, linking training investment to actual capability gaps and pipeline needs rather than an arbitrary proxy like seniority. Source: [BOK] Domain IV.A, Training Needs Analysis.",
    "set": 3,
    "qid": "mbb:set-3:d4-001"
  },
  {
    "sub": "mbb-training",
    "stem": "An MBB conducting a training needs analysis at a logistics company finds that dispatch supervisors have strong process-mapping skills but consistently struggle with basic hypothesis testing. What should this finding drive?",
    "options": [
      "Assigning supervisors to Black Belt-level DOE training immediately, skipping foundational statistics entirely",
      "Cancellation of all training for dispatch supervisors, since the gap suggests they aren't suited for improvement work",
      "A generic, one-size-fits-all Green Belt curriculum for all supervisors regardless of the specific gap identified",
      "A targeted curriculum emphasizing statistical inference modules for this group, since the needs analysis identified a specific, addressable skill gap rather than a general training need"
    ],
    "answer": 3,
    "why": "A well-executed needs analysis should produce targeted curriculum adjustments addressing the specific gap identified, not a generic program or an overreaction. Source: [BOK] Domain IV.A, Training Needs Analysis.",
    "set": 3,
    "qid": "mbb:set-3:d4-002"
  },
  {
    "sub": "mbb-training",
    "stem": "A retail chain's training needs analysis relies solely on a self-assessment survey where employees rate their own statistical skills. Scores are uniformly high, but subsequent Green Belt cohort performance is poor. What flaw does this illustrate?",
    "options": [
      "Needs analysis should be abandoned in favor of universal, unscreened enrollment",
      "The Green Belt cohort's poor performance proves the curriculum itself is flawed",
      "Self-assessment surveys are always fully reliable for skills gap identification",
      "Self-assessed skill data is prone to overconfidence bias and should be triangulated with objective measures (e.g., a validated pre-assessment quiz, manager evaluation, or review of past project work) rather than relied on alone"
    ],
    "answer": 3,
    "why": "Self-report skills data is a well-documented source of overconfidence bias; triangulating with objective measures produces a more reliable needs analysis. Source: [BOK] Domain IV.A, Training Needs Analysis.",
    "set": 3,
    "qid": "mbb:set-3:d4-003"
  },
  {
    "sub": "mbb-training",
    "stem": "A manufacturer's training needs analysis is conducted once, at deployment launch, and never revisited despite three years of organizational change (new product lines, revised processes, staff turnover). What principle from elsewhere in MBB practice applies directly here?",
    "options": [
      "Training needs analysis is a one-time compliance exercise with no ongoing relevance",
      "Training needs analysis, once completed, remains valid indefinitely regardless of organizational change",
      "The training program should be discontinued entirely given the passage of time",
      "The periodic re-validation principle (already established for strategic plans, organizational design, and portfolio prioritization criteria) applies equally to training needs analysis: a three-year-old assessment likely no longer reflects current capability gaps and should be refreshed"
    ],
    "answer": 3,
    "why": "This connects the periodic re-validation principle (portfolio criteria, strategic plans) to training needs analysis specifically \u2014 a static assessment predictably drifts out of alignment with a changing organization. Source: [BOK] Domain IV.A, Training Needs Analysis.",
    "set": 3,
    "qid": "mbb:set-3:d4-004"
  },
  {
    "sub": "mbb-training",
    "stem": "A Black Belt training plan lists learning objectives and a course schedule but has no defined method for assessing whether trainees actually achieved competency before certification. What training plan element is missing, and why does it matter?",
    "options": [
      "Nothing is missing; a schedule and objectives are sufficient for a complete training plan",
      "A competency assessment method (e.g., a capstone project, written exam, or supervised project review) is missing; without one, certification risks becoming a participation credential rather than a genuine competency signal, undermining the credibility of the certification and the quality of subsequently assigned Belts",
      "Training plans should never include a fixed schedule, since flexibility is more important than assessment",
      "The training plan should eliminate learning objectives entirely and rely only on the assessment"
    ],
    "answer": 1,
    "why": "A defined competency assessment is a standard, necessary training plan element \u2014 without it, certification doesn't verify genuine capability, risking exactly the credibility and quality-of-Belt-pool concerns raised elsewhere (e.g., an inconsistent, informal Belt-advancement pathway). Source: [BOK] Domain IV.B, Training Plan Elements.",
    "set": 3,
    "qid": "mbb:set-3:d4-005"
  },
  {
    "sub": "mbb-training",
    "stem": "An insurance company's training plan for new Green Belts allocates 90% of instructional time to statistical tools and 10% to change management and stakeholder engagement, despite most project failures at this company being attributed to poor stakeholder buy-in rather than technical error. What should the MBB recommend?",
    "options": [
      "Eliminate statistical tools training entirely in favor of only soft skills",
      "Rebalance the training plan's time allocation to better reflect the organization's actual failure patterns, giving proportionally more instructional time to change management and stakeholder engagement given the documented root cause of most project failures",
      "The training plan is irrelevant to project failure rates, which are determined solely by individual Belt aptitude",
      "Keep the allocation unchanged, since statistical tools are always the most important training content"
    ],
    "answer": 1,
    "why": "Training plan content allocation should reflect the organization's actual, evidenced failure patterns \u2014 continuing to over-invest in technical content while under-investing in the documented root cause of failures is a misallocation the needs-analysis-to-plan linkage should catch. Source: [BOK] Domain IV.B, Training Plan Elements.",
    "chart": {"type": "data-table", "columns": ["Content area", "Current allocation", "Project failure attribution"], "rows": [["Statistical tools", "90%", "15%"], ["Change mgmt / stakeholder engagement", "10%", "70%"], ["Other", "0%", "15%"]]},
    "set": 3,
    "qid": "mbb:set-3:d4-006"
  },
  {
    "sub": "mbb-training",
    "stem": "A training plan for a new DFSS curriculum includes technical content on QFD and robust design but has no defined prerequisite (e.g., completed Green Belt or equivalent DMAIC experience). Trainees with no prior process-improvement exposure struggle badly. What training plan element was missing?",
    "options": [
      "A defined prerequisite requirement is missing; DFSS builds on foundational process-improvement concepts, and admitting trainees without that foundation predictably produces poor learning outcomes \u2014 prerequisites should be an explicit training plan element for any advanced curriculum",
      "Nothing was missing; DFSS training should always be open to any employee regardless of background",
      "Trainees who struggle should simply be removed from the workforce",
      "The DFSS curriculum itself is flawed and should be discontinued"
    ],
    "answer": 0,
    "why": "Defining prerequisites is a standard training plan element for advanced curricula \u2014 omitting this predictably produces the exact struggle described when trainees lack foundational context. Source: [BOK] Domain IV.B, Training Plan Elements.",
    "set": 3,
    "qid": "mbb:set-3:d4-007"
  },
  {
    "sub": "mbb-training",
    "stem": "A training plan specifies course content and duration but leaves logistics (venue, materials procurement, scheduling around production shifts) to be figured out ad hoc by whoever happens to be available closer to the date. What risk does this create?",
    "options": [
      "No risk; logistics are unimportant compared to instructional content",
      "Leaving logistics unplanned risks last-minute scrambling, scheduling conflicts with production needs, and inconsistent delivery quality \u2014 logistics planning is a standard training plan element specifically to prevent exactly this kind of avoidable, foreseeable disruption",
      "Logistics should always be handled by the most senior available executive regardless of their actual availability or expertise",
      "Training should be canceled entirely if logistics aren't planned a year in advance"
    ],
    "answer": 1,
    "why": "Logistics planning is a standard, foundational training plan element precisely because ad hoc last-minute handling predictably produces disruption \u2014 proactive planning, not reactive scrambling, is the correct approach. Source: [BOK] Domain IV.B, Training Plan Elements.",
    "set": 3,
    "qid": "mbb:set-3:d4-008"
  },
  {
    "sub": "mbb-training",
    "stem": "An MBB is designing Black Belt training materials for a workforce that is 60% non-native English speakers. The existing materials are text-heavy with no visual aids or translated glossaries. What delivery adaptation should the MBB prioritize?",
    "options": [
      "Incorporate visual aids, diagrams, and a translated technical glossary alongside the existing materials, since heavily text-based delivery disproportionately disadvantages non-native speakers on technical content where precise terminology matters",
      "No adaptation is needed; all employees should be expected to have equivalent English proficiency regardless of background",
      "Deliver training exclusively in a single non-English language regardless of the full workforce's actual composition",
      "Eliminate all technical terminology entirely, oversimplifying the statistical content to the point of losing rigor"
    ],
    "answer": 0,
    "why": "Adapting delivery format (visual aids, translated glossaries) to the actual workforce composition is a standard, appropriate accommodation \u2014 distinct from either ignoring the need or inappropriately diluting technical rigor. Source: [BOK] Domain IV.C, Training Materials and Delivery.",
    "set": 3,
    "qid": "mbb:set-3:d4-009"
  },
  {
    "sub": "mbb-training",
    "stem": "A Black Belt training program delivers all content via a single 5-day intensive workshop with no follow-up reinforcement, and post-training retention (measured 3 months later) is poor. What delivery principle does this violate?",
    "options": [
      "This violates the spaced-repetition/reinforcement principle \u2014 a single intensive session without follow-up reinforcement (refresher sessions, applied practice, coaching check-ins) predictably produces poor long-term retention compared to a distributed delivery model with built-in reinforcement",
      "The training content itself must be reduced in rigor to improve retention",
      "Poor retention proves the trainees are simply not capable of learning statistical content",
      "Intensive single-session delivery is always the most effective training format regardless of retention outcomes"
    ],
    "answer": 0,
    "why": "Spaced repetition and reinforcement are well-established learning-science principles; a single intensive session with no follow-up predictably underperforms a distributed model on long-term retention. Source: [BOK] Domain IV.C, Training Materials and Delivery.",
    "set": 3,
    "qid": "mbb:set-3:d4-010"
  },
  {
    "sub": "mbb-training",
    "stem": "A manufacturer delivers Green Belt training entirely through generic, off-the-shelf e-learning modules using examples from unrelated industries (e.g., call-center scenarios for a machining shop workforce). Engagement and completion rates are poor. What should the MBB recommend?",
    "options": [
      "Continue using the generic modules unchanged, since statistical concepts are the same regardless of industry examples",
      "Customize or supplement the generic materials with examples and case studies drawn from the actual machining-shop context, since relevance of examples to trainees' actual work meaningfully affects engagement and the ability to transfer learning to real projects",
      "Switch to a completely different statistical topic unrelated to either industry",
      "Eliminate all training content and rely solely on on-the-job learning with no formal instruction"
    ],
    "answer": 1,
    "why": "Contextual relevance of training examples to trainees' actual work materially affects engagement and transfer of learning \u2014 generic, industry-mismatched examples predictably underperform customized ones. Source: [BOK] Domain IV.C, Training Materials and Delivery.",
    "set": 3,
    "qid": "mbb:set-3:d4-011"
  },
  {
    "sub": "mbb-training",
    "stem": "An MBB is deciding between synchronous live instruction and self-paced asynchronous e-learning for a Black Belt cohort spread across five time zones with highly variable daily schedules. Which delivery format, and why, best fits this constraint?",
    "options": [
      "Asynchronous only, with no synchronous component of any kind",
      "Cancel the cross-time-zone cohort and only train employees in a single time zone going forward",
      "Synchronous live instruction only, requiring all five time zones to align on a single fixed schedule regardless of the burden this creates",
      "A hybrid model: asynchronous self-paced modules for foundational content (accommodating schedule variability across time zones) paired with periodic synchronous sessions for discussion, Q&A, and applied practice \u2014 balancing flexibility with the relationship-building and real-time clarification synchronous delivery provides"
    ],
    "answer": 3,
    "why": "A hybrid delivery model is the standard, defensible solution for genuinely dispersed, schedule-variable cohorts \u2014 balancing the flexibility asynchronous content provides against the real-time engagement value of periodic synchronous sessions. Source: [BOK] Domain IV.C, Training Materials and Delivery.",
    "set": 3,
    "qid": "mbb:set-3:d4-012"
  },
  {
    "sub": "mbb-training",
    "stem": "A Six Sigma training program tracks only trainee satisfaction scores ('Did you enjoy the course?') as its measure of program effectiveness. Satisfaction scores are consistently high, but certified Belts show weak project outcomes. What evaluation-level gap does this reflect?",
    "options": [
      "Satisfaction scores should be discontinued entirely since they provide no value at all",
      "This reflects a classic training-evaluation gap (paralleling the Kirkpatrick model's levels): satisfaction (reaction) is only the first, weakest evaluation level and doesn't measure learning, behavior change, or actual results; the MBB should add assessment of knowledge/skill gained, on-the-job application, and downstream project outcomes as evaluation measures",
      "No gap exists; satisfaction is the only meaningful measure of training effectiveness",
      "Weak project outcomes prove satisfaction surveys are always misleading and should never be used"
    ],
    "answer": 1,
    "why": "This tests recognizing the well-known training-evaluation-levels gap: reaction/satisfaction is the weakest evaluation signal and does not by itself indicate learning, behavior change, or business results \u2014 all of which should be measured for a complete effectiveness picture. Source: [BOK] Domain IV.D, Training Program Effectiveness.",
    "chart": {"type": "data-table", "columns": ["Evaluation level", "What it measures", "This program's status"], "rows": [["1. Reaction", "Trainee satisfaction", "Measured (high)"], ["2. Learning", "Knowledge/skill gained", "Not measured"], ["3. Behavior", "On-the-job application", "Not measured"], ["4. Results", "Business outcomes", "Not measured"]]},
    "set": 3,
    "qid": "mbb:set-3:d4-013"
  },
  {
    "sub": "mbb-training",
    "stem": "An MBB wants to measure whether Black Belt training actually improved project success rates, not just whether trainees passed a certification exam. What evaluation approach most directly answers this question?",
    "options": [
      "Rely solely on certification exam pass rates, since passing the exam is equivalent to producing successful projects",
      "Survey trainees about how confident they feel in their abilities, treating self-reported confidence as equivalent to actual project success",
      "Training effectiveness cannot be measured at all and should not be attempted",
      "Track a cohort of certified Belts' subsequent project outcomes (completion rate, validated benefit realization, quality of DMAIC execution) against a baseline or comparison group, since exam performance measures knowledge acquisition, not downstream on-the-job project success"
    ],
    "answer": 3,
    "why": "Exam pass rates measure knowledge acquisition (a Kirkpatrick Level 2 concern), not the actual downstream project-outcome results the organization ultimately cares about \u2014 direct outcome tracking against a baseline is the correct approach. Source: [BOK] Domain IV.D, Training Program Effectiveness.",
    "set": 3,
    "qid": "mbb:set-3:d4-014"
  },
  {
    "sub": "mbb-training",
    "stem": "A training program's post-course survey shows most Green Belts report feeling confident applying DMAIC, but six months later, fewer than 20% have actually launched a project. What does this pattern most likely indicate, and what should the MBB investigate?",
    "options": [
      "Confidence and knowledge don't guarantee application \u2014 the gap likely reflects organizational barriers (lack of manager sponsorship, no protected time, unclear project-selection process) rather than a training-content problem; the MBB should investigate the post-training organizational support structure before concluding the curriculum itself is at fault",
      "The training itself must be fundamentally flawed and should be scrapped immediately without further investigation",
      "The 20% launch rate is a fully acceptable and expected outcome requiring no further investigation",
      "Green Belts should be required to launch a project within one week of certification regardless of organizational readiness"
    ],
    "answer": 0,
    "why": "A gap between reported training confidence and actual application usually points to organizational/structural barriers (sponsorship, time, project pipeline access) rather than a training-content flaw \u2014 the MBB should investigate the surrounding support system before concluding the curriculum failed. Source: [BOK] Domain IV.D, Training Program Effectiveness.",
    "set": 3,
    "qid": "mbb:set-3:d4-015"
  },
  {
    "sub": "mbb-coaching",
    "stem": "A newly appointed champion at a beverage distributor asks the MBB, 'What exactly is my job here \u2014 I thought the Black Belt does all the actual work?' What should the MBB's coaching response establish first?",
    "options": [
      "Clarify the champion's specific responsibilities: securing resources, removing organizational barriers the Black Belt cannot clear alone, maintaining visible executive-level support, and holding the team accountable to the business case \u2014 a genuinely active role distinct from (not a duplicate of) the Black Belt's technical execution",
      "Tell the champion to take over all technical DMAIC work themselves",
      "Confirm the champion's assumption \u2014 champions have no meaningful role once a Black Belt is assigned",
      "Recommend eliminating the champion role from the deployment entirely"
    ],
    "answer": 0,
    "why": "This is a foundational coaching moment \u2014 clarifying the champion's genuinely active (if distinct from technical) role prevents exactly the ceremonial-sponsorship pattern documented elsewhere (organizational competencies). Source: [BOK] Domain V.A, Coaching Executives and Champions.",
    "set": 3,
    "qid": "mbb:set-3:d5-001"
  },
  {
    "sub": "mbb-coaching",
    "stem": "An MBB is coaching a VP-level champion who wants to personally attend every working-level team meeting, frequently redirecting technical analysis decisions. What coaching guidance is most appropriate?",
    "options": [
      "Suggest the Black Belt should simply do whatever the champion directs regardless of what the data shows",
      "Coach the champion toward a more strategic level of involvement \u2014 clearing organizational barriers, providing resources, and reviewing at tollgates \u2014 rather than routine technical direction, which risks undermining the Black Belt's authority and substituting executive intuition for the team's own data-driven analysis",
      "Recommend the champion withdraw from the project entirely and have no further involvement",
      "Encourage the champion to continue attending every meeting and directing technical decisions, since more executive involvement is always better"
    ],
    "answer": 1,
    "why": "Over-involvement at the technical level is a distinct champion-coaching challenge from under-involvement (ceremonial sponsorship) \u2014 both are miscalibrations of the champion's proper role, which is strategic/organizational, not routine technical direction. Source: [BOK] Domain V.A, Coaching Executives and Champions.",
    "set": 3,
    "qid": "mbb:set-3:d5-002"
  },
  {
    "sub": "mbb-coaching",
    "stem": "A champion at a food processing company consistently approves project charters without reading them, based entirely on the Black Belt's verbal summary. A charter with a significant scope error goes unnoticed for two months. What coaching intervention should the MBB make?",
    "options": [
      "Remove charter approval authority from champions entirely, assigning it only to the MBB",
      "Coach the champion on the specific, concrete review responsibilities charter approval entails (confirming problem statement, scope, and resource commitments align with actual business priorities) and why a rubber-stamp approval defeats the purpose of that governance checkpoint",
      "Blame the Black Belt entirely for not catching the error, with no coaching directed at the champion's own approval practice",
      "Continue allowing the champion to approve charters without review, since verbal summaries are sufficient"
    ],
    "answer": 1,
    "why": "Champion charter approval is meant to be a genuine governance checkpoint, not a formality \u2014 coaching should address the specific gap (not reading charters) directly rather than removing the role or misdirecting responsibility entirely to the Black Belt. Source: [BOK] Domain V.A, Coaching Executives and Champions.",
    "set": 3,
    "qid": "mbb:set-3:d5-003"
  },
  {
    "sub": "mbb-coaching",
    "stem": "An executive sponsor tells the MBB, 'I don't have time to learn Six Sigma methodology \u2014 just tell me what to sign.' How should the MBB frame ongoing coaching for this executive?",
    "options": [
      "Accept this framing permanently and never attempt to build the executive's methodology understanding",
      "Insist the executive complete a full Black Belt certification before signing anything",
      "Escalate the executive's attitude to their own supervisor as a performance issue",
      "Focus coaching on the specific, high-leverage things this executive needs to recognize \u2014 what a valid charter looks like, what tollgate questions to ask, and warning signs of a stalled project \u2014 rather than full methodology training, respecting the time constraint while still building genuine oversight capability"
    ],
    "answer": 3,
    "why": "Executive coaching should be right-sized to what genuinely matters for their oversight role \u2014 not full methodology training, but not zero either; a handful of high-leverage recognition skills respects the time constraint while still building real oversight capability. Source: [BOK] Domain V.A, Coaching Executives and Champions.",
    "set": 3,
    "qid": "mbb:set-3:d5-004"
  },
  {
    "sub": "mbb-coaching",
    "stem": "A champion wants to unilaterally kill a project at the Analyze tollgate because 'it's taking too long,' despite the team having just validated a promising root cause. What should the MBB coach the champion to do before making this call?",
    "options": [
      "Coach the champion to review the tollgate evidence directly (the validated root cause finding) with the Black Belt and MBB before deciding, since 'taking too long' alone \u2014 without weighing the value of a just-validated finding \u2014 risks discarding real, near-term progress based on schedule frustration alone",
      "Support the immediate kill decision without further discussion, since champions have unilateral authority over project continuation",
      "Tell the champion they have no authority to ever kill a project regardless of circumstances",
      "Recommend replacing the champion for raising the timeline concern at all"
    ],
    "answer": 0,
    "why": "Legitimate stage-gate kill authority (as established elsewhere in this domain, e.g., the vendor-constraint kill decision) should still be exercised based on tollgate evidence, not schedule frustration alone \u2014 coaching should slow the decision down to incorporate the evidence, not simply defer to or override the champion's authority. Source: [BOK] Domain V.A, Coaching Executives and Champions.",
    "set": 3,
    "qid": "mbb:set-3:d5-005"
  },
  {
    "sub": "mbb-coaching",
    "stem": "Two champions at a manufacturing conglomerate are competing for the same Black Belt's time on their respective projects, each escalating directly to the MBB to demand priority. What coaching approach should the MBB take?",
    "options": [
      "Refuse to engage with either champion until they resolve the conflict entirely on their own with no facilitation",
      "Personally decide which champion's project wins and inform both unilaterally",
      "Assign the Black Belt to work on both projects simultaneously at full capacity for each",
      "Facilitate a joint conversation between the two champions (and their common executive sponsor if needed) to resolve the resource conflict using shared criteria, coaching both on the expectation that competing resource claims go through governance rather than direct escalation to the MBB"
    ],
    "answer": 3,
    "why": "This mirrors the cross-functional resource-conflict facilitation principle established elsewhere in this domain (organizational competencies) \u2014 the MBB's coaching role is facilitating resolution through proper channels, not personally arbitrating beyond their authority. Source: [BOK] Domain V.A, Coaching Executives and Champions.",
    "set": 3,
    "qid": "mbb:set-3:d5-006"
  },
  {
    "sub": "mbb-coaching",
    "stem": "An MBB notices a champion consistently takes public credit for Black Belt-led project successes in executive presentations, never mentioning the team. What coaching conversation should the MBB have?",
    "options": [
      "Say nothing, since crediting the champion is expected regardless of who did the actual work",
      "Publicly correct the champion in front of executives without any private conversation first",
      "Directly and respectfully raise the pattern with the champion, framing it in terms of the practical cost \u2014 Black Belts who feel their work is invisible to leadership disengage or leave, echoing the recognition/retention risk documented elsewhere in this domain \u2014 and coach toward genuinely shared credit in future presentations",
      "Recommend the Black Belt stop working on any project this champion sponsors"
    ],
    "answer": 2,
    "why": "This connects to the recognition/retention principle established elsewhere (organizational competencies) \u2014 invisible credit-taking is a real driver of Belt disengagement, and the MBB's coaching role includes raising this directly and constructively with the champion. Source: [BOK] Domain V.A, Coaching Executives and Champions.",
    "set": 3,
    "qid": "mbb:set-3:d5-007"
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Black Belt candidate is technically excellent but consistently dismisses frontline operators' input during Measure-phase data collection, causing operators to stop cooperating. What coaching focus should the MBB prioritize?",
    "options": [
      "Remove the Black Belt from all future projects permanently based on this one issue",
      "Coach the Black Belt specifically on facilitation and stakeholder-engagement skills \u2014 technical excellence alone doesn't ensure project success if frontline cooperation, which the project depends on, has been damaged by dismissive engagement",
      "Praise the Black Belt's technical excellence and ignore the interpersonal pattern entirely",
      "Recommend the Black Belt work entirely alone with no team or stakeholder interaction going forward"
    ],
    "answer": 1,
    "why": "Technical skill and interpersonal/facilitation skill are both necessary; coaching should address the specific gap (stakeholder engagement) rather than either ignoring it or overreacting to remove a technically strong Belt. Source: [BOK] Domain V.B, Coaching Teams and Individuals.",
    "set": 3,
    "qid": "mbb:set-3:d5-008"
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Green Belt says to the MBB, 'I don't think my project's data supports our hypothesized root cause, but my champion really wants this to be the answer.' What coaching response protects both the Green Belt and the integrity of the analysis?",
    "options": [
      "Instruct the Green Belt to escalate immediately over the champion's head without first attempting a direct conversation",
      "Tell the Green Belt to quietly change their own hypothesis to whatever will avoid conflict with the champion",
      "Coach the Green Belt to present the data honestly to the champion, framing it as new information that changes the analysis rather than a confrontation, and to bring the MBB in to help facilitate that conversation if needed \u2014 protecting analytical integrity while giving the Green Belt a constructive path to raise it",
      "Advise the Green Belt to report the root cause the champion wants regardless of what the data shows"
    ],
    "answer": 2,
    "why": "This is a core coaching-for-integrity moment \u2014 the Green Belt needs both permission and a constructive method to report what the data actually shows, rather than either suppressing it or escalating unnecessarily before attempting direct, honest communication. Source: [BOK] Domain V.B, Coaching Teams and Individuals.",
    "set": 3,
    "qid": "mbb:set-3:d5-009"
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Black Belt on a cross-functional team consistently interrupts and talks over a quieter team member with valuable domain expertise. What specific coaching technique should the MBB suggest the Black Belt use in the next team meeting?",
    "options": [
      "Tell the Black Belt to continue as before, since dominant personalities are simply more valuable to have on teams",
      "Suggest the Black Belt should stop attending team meetings personally",
      "Recommend removing the quieter team member from the project instead",
      "Suggest a structured facilitation technique \u2014 e.g., a round-robin format where each member speaks in turn, or explicitly inviting the quieter member's input before opening discussion \u2014 to ensure the valuable expertise isn't lost to the dominant dynamic"
    ],
    "answer": 3,
    "why": "This is the same team-dynamics coaching pattern established elsewhere (organizational competencies) \u2014 concrete facilitation techniques (round-robin, explicit invitation) are the practical coaching tool for exactly this dominant-voice/quiet-expert dynamic. Source: [BOK] Domain V.B, Coaching Teams and Individuals.",
    "set": 3,
    "qid": "mbb:set-3:d5-010"
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Green Belt has completed two successful projects but tells the MBB they feel like an impostor and doubt they deserve certification advancement. What coaching approach best supports this individual?",
    "options": [
      "Dismiss the concern entirely and simply announce their promotion without further conversation",
      "Acknowledge the feeling as common and separate it from the objective evidence of their two successful, validated projects, walking through the specific competencies they've demonstrated \u2014 grounding the coaching conversation in concrete evidence rather than either ignoring the concern or over-indulging it",
      "Tell them impostor feelings mean they should leave the improvement function entirely",
      "Agree that they probably aren't ready and delay their advancement indefinitely based on their stated self-doubt alone"
    ],
    "answer": 1,
    "why": "Effective individual coaching acknowledges the feeling while grounding the conversation in concrete, objective evidence of demonstrated competency \u2014 neither dismissing the person's experience nor letting self-doubt alone override documented performance. Source: [BOK] Domain V.B, Coaching Teams and Individuals.",
    "set": 3,
    "qid": "mbb:set-3:d5-011"
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Black Belt is struggling with a DOE design and asks the MBB for help. The MBB immediately takes over and designs the experiment personally, handing it back complete. What coaching principle does this violate?",
    "options": [
      "The MBB should have refused to help at all rather than providing any guidance",
      "Nothing is violated; the MBB solving the problem directly is always the most efficient coaching approach",
      "DOE is too advanced for any Black Belt to ever attempt without the MBB doing it entirely",
      "This violates the coach-not-doer principle \u2014 effective coaching builds the Black Belt's own capability by guiding them through the reasoning (asking questions, pointing to relevant resources, reviewing their draft) rather than solving the problem for them, which leaves the underlying skill gap unaddressed for next time"
    ],
    "answer": 3,
    "why": "This is a classic coach-vs-doer distinction: solving the problem directly may be faster once, but it doesn't build the Black Belt's own capability, leaving them equally stuck next time a similar situation arises \u2014 guided reasoning is the correct coaching approach. Source: [BOK] Domain V.B, Coaching Teams and Individuals.",
    "set": 3,
    "qid": "mbb:set-3:d5-012"
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Black Belt candidate from an underrepresented background on the team confides to the MBB that they feel excluded from informal networking that seems to influence project assignments. What should the MBB do with this information?",
    "options": [
      "Take the concern seriously and examine whether project assignment actually happens through an informal, exclusionary process rather than transparent criteria \u2014 if so, work toward a more transparent, criteria-based assignment process that doesn't depend on informal network access",
      "Tell the Black Belt candidate to simply try harder to join the informal networking themselves",
      "Publicly announce the individual's concern to the whole team without their consent",
      "Dismiss the concern as unrelated to formal project work and take no action"
    ],
    "answer": 0,
    "why": "This tests recognizing that informal, network-dependent processes can create real and unfair barriers; the appropriate MBB response is investigating and working toward more transparent, criteria-based processes, not dismissing the concern or mishandling the confidence. Source: [BOK] Domain V.B, Coaching Teams and Individuals.",
    "set": 3,
    "qid": "mbb:set-3:d5-013"
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Green Belt on their first project becomes visibly frustrated and says 'I don't think I can do this' after a difficult Analyze-phase setback. What is the MBB's most appropriate immediate coaching response?",
    "options": [
      "Immediately reassign the project to someone else without further conversation",
      "Ignore the emotional statement entirely and only discuss the technical obstacle in purely clinical terms",
      "Tell them that if they can't do it now, they should give up on process improvement entirely",
      "Normalize the difficulty as a common part of the learning process, help them break the specific Analyze-phase obstacle into a smaller, more manageable next step, and offer concrete support (a working session, a relevant example) \u2014 addressing both the emotional moment and the specific technical obstacle"
    ],
    "answer": 3,
    "why": "Effective in-the-moment coaching addresses both the emotional experience (normalizing difficulty, offering support) and the concrete technical obstacle (breaking it into a manageable next step) \u2014 neither purely clinical nor purely reassuring alone fully serves the person. Source: [BOK] Domain V.B, Coaching Teams and Individuals.",
    "set": 3,
    "qid": "mbb:set-3:d5-014"
  },
  {
    "sub": "mbb-coaching",
    "stem": "An experienced Black Belt mentor is assigned to a new Green Belt but spends mentoring sessions mostly talking about their own past projects rather than asking questions about the Green Belt's current challenges. What coaching correction should the MBB suggest to the mentor?",
    "options": [
      "Remove the mentor from the role entirely for talking too much",
      "Instruct the Green Belt to ignore anything their mentor says",
      "Shift the mentoring approach toward asking open-ended questions about the Green Belt's specific current challenges and letting the mentor's own experience surface in response to those questions, rather than leading with unprompted stories \u2014 making the mentee's actual needs the center of the conversation",
      "Continue as-is, since sharing past experience is the only valuable thing a mentor can offer"
    ],
    "answer": 2,
    "why": "Effective mentoring centers the mentee's actual current needs (surfaced through open-ended questions) rather than leading with the mentor's own unprompted experience \u2014 a correctable coaching-of-the-coach adjustment, not grounds for removal. Source: [BOK] Domain V.B, Coaching Teams and Individuals.",
    "set": 3,
    "qid": "mbb:set-3:d5-015"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A gauge R&R study on a torque wrench used in an aerospace fastener line yields %Contribution (variance) of 22% for the measurement system. Using the standard AIAG-style guideline, how should this measurement system be classified, and what is the appropriate next step?",
    "options": [
      "Acceptable; no further action needed, since 22% is well below 50%",
      "Unacceptable; the measurement system consumes too much of the total observed variation to reliably distinguish part-to-part differences, and should be improved (fixture redesign, operator retraining, or gauge replacement) before being used for capability or control decisions",
      "The percentage is irrelevant; only the number of distinct categories matters",
      "Marginal but usable for all decisions without qualification"
    ],
    "answer": 1,
    "why": "Under common AIAG-style guidelines, %Contribution (a variance-based measure) above roughly 9% is generally unacceptable, and above ~1% but below 9% is often marginal; a 22% figure reflects a measurement system consuming too much of observed variation to be trusted for capability/control decisions without improvement. Source: [BOK] Domain VI.A, Measurement Systems Analysis.",
    "set": 3,
    "qid": "mbb:set-3:d6-001"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A Gauge R&R study reports %Study Variation of 28% and Number of Distinct Categories (ndc) = 2. What does the ndc value specifically indicate, beyond the %Study Variation figure alone?",
    "options": [
      "An ndc of 2 is fully acceptable as long as %Study Variation is below 30%",
      "ndc measures only operator-to-operator variation, unrelated to part discrimination",
      "Nothing additional; ndc and %Study Variation always convey identical information",
      "ndc estimates how many distinct groups of part values the measurement system can reliably distinguish; an ndc of 2 means the gauge can barely tell 'high' from 'low' and cannot meaningfully resolve finer part-to-part differences, a serious problem for process control even beyond the %Study Variation figure"
    ],
    "answer": 3,
    "why": "ndc directly answers 'how many distinguishable groups can this gauge resolve' \u2014 a low ndc (commonly, below 5) signals the gauge cannot adequately discriminate between parts, a distinct and important piece of information beyond the %Study Variation figure alone. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "set": 3,
    "qid": "mbb:set-3:d6-002"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A Black Belt's MSA study for a discrete pass/fail visual inspection reports Cohen's kappa of 0.40 between two inspectors. How should this be interpreted, and what should the MBB recommend?",
    "options": [
      "Kappa of 0.40 indicates excellent agreement; no action is needed",
      "A kappa below 1.0 always means the inspection system must be replaced with 100% automated inspection",
      "Kappa of 0.40 indicates only moderate agreement at best (commonly, kappa below 0.6-0.7 is considered inadequate for a production inspection decision); the MBB should recommend clarifying inspection criteria, retraining inspectors on ambiguous cases, and re-running the study before relying on this inspection system",
      "Kappa is only applicable to continuous data and cannot be computed for pass/fail inspection"
    ],
    "answer": 2,
    "why": "Kappa quantifies agreement beyond chance for categorical/attribute data; a value of 0.40 reflects only moderate agreement, well short of the threshold typically required (often 0.6-0.75+) to trust a pass/fail inspection system for production decisions. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "chart": {"type": "data-table", "columns": ["Inspector 2: Pass", "Inspector 2: Fail"], "rows": [["Inspector 1: Pass", "30", "20"], ["Inspector 1: Fail", "10", "40"]]},
    "set": 3,
    "qid": "mbb:set-3:d6-003"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A process has USL = 62, LSL = 38, process mean = 51, and process standard deviation = 4. What is Cpk, and what does the value indicate about the process relative to its specification limits?",
    "options": [
      "Cpk cannot be calculated without knowing the sample size used to estimate the standard deviation",
      "Cpk = 2.0; the process exceeds Six Sigma capability",
      "Cpk = 0.92; the process is shifted toward the USL side and is only marginally capable \u2014 min[(62-51)/(3\u00d74), (51-38)/(3\u00d74)] = min[0.917, 1.083] = 0.92, below the common 1.33 target for a well-controlled process",
      "Cpk = 1.33; the process is well-centered and capable relative to the specification limits"
    ],
    "answer": 2,
    "why": "Cpu = (62-51)/(3\u00d74) = 11/12 = 0.917; Cpl = (51-38)/(3\u00d74) = 13/12 = 1.083; Cpk = min(0.917, 1.083) = 0.92, indicating the process is closer to the upper limit and only marginally capable \u2014 below the common 1.33 benchmark for a well-controlled process. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "set": 3,
    "qid": "mbb:set-3:d6-004"
  },
  {
    "sub": "mbb-analytics",
    "stem": "An X-bar and R control chart for a fill-weight process shows the X-bar chart in control, but the R-chart shows point 6 above the UCL. What is the most defensible interpretation, and what should happen before the X-bar chart is trusted?",
    "options": [
      "Both charts should be discarded and the process restarted from a completely new baseline",
      "The X-bar chart's control status is fully valid regardless of the out-of-control R-chart point",
      "An out-of-control R-chart indicates increased within-subgroup variability at that point, which can distort the X-bar chart's control limits (since they're derived from the average range); the special cause behind the R-chart signal should be investigated and, if assignable, removed before recalculating limits and trusting the X-bar chart's in-control read",
      "The R-chart should simply be discarded and only the X-bar chart used going forward"
    ],
    "answer": 2,
    "why": "Because X-bar chart control limits are calculated from the average range, an out-of-control R-chart point can invalidate the X-bar limits derived from that data; the correct sequence is to always check the R-chart first, investigate/resolve special causes there, then trust the X-bar chart. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "chart": {"type": "xbar-r", "xbar": {"ucl": 52.1, "cl": 50.0, "lcl": 47.9, "data": [50.2, 49.8, 50.5, 49.6, 50.1, 50.9, 49.7, 50.3]}, "r": {"ucl": 6.2, "cl": 2.9, "lcl": 0, "data": [2.5, 3.1, 2.8, 3.4, 2.6, 7.8, 2.9, 3.0]}},
    "set": 3,
    "qid": "mbb:set-3:d6-005"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A boxplot of cycle-time data from a claims-processing center shows a median of 4.2 days, with several points plotted well above the upper whisker. What should the MBB investigate first regarding these points?",
    "options": [
      "Investigate the outlier points as potential signals of a special cause (e.g., unusually complex claims, a system outage, or a specific under-trained processor) before deciding whether to exclude them \u2014 outliers may represent real, actionable process behavior rather than simply bad data",
      "Immediately delete the outlier points from the dataset without further investigation, since outliers always represent bad data",
      "Recompute the median including only the outlier points",
      "Ignore the outliers entirely and report only the median, since boxplots are unaffected by outlier interpretation"
    ],
    "answer": 0,
    "why": "Outliers on a boxplot should prompt investigation into their root cause before any decision to exclude them \u2014 they may represent genuine, actionable special-cause behavior (a specific complexity driver, system issue, etc.) rather than simply noise to be discarded. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "chart": {"type": "boxplot", "min": 2.1, "q1": 3.4, "median": 4.2, "q3": 5.1, "max": 6.8, "mean": 4.5, "outliers": [9.2, 10.1, 11.4], "axisMin": 0, "axisMax": 12},
    "set": 3,
    "qid": "mbb:set-3:d6-006"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A normal probability plot of 24 measurements from a chemical purity process shows most points falling close to the reference line, but the two lowest values curve noticeably away from it. What does this pattern most likely suggest?",
    "options": [
      "The plot indicates a strongly bimodal distribition affecting all 24 points equally",
      "Normal probability plots cannot detect any deviation from normality by design",
      "The bulk of the data is reasonably consistent with normality, but the two low-end points may represent a distinct subpopulation or special cause (e.g., a different raw material lot) rather than being part of the same underlying normal distribution \u2014 worth investigating those two points specifically rather than concluding non-normality for the whole dataset",
      "The entire dataset is non-normal and should be discarded"
    ],
    "answer": 2,
    "why": "A normal probability plot where most points track the reference line but a few clear outliers deviate suggests investigating those specific points as a potential distinct subpopulation or special cause, rather than concluding the entire dataset is non-normal. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "chart": {"type": "normal-prob", "values": [12.1, 12.3, 12.4, 12.5, 12.5, 12.6, 12.6, 12.7, 12.7, 12.7, 12.8, 12.8, 12.8, 12.9, 12.9, 13.0, 13.0, 13.1, 13.1, 13.2, 13.3, 13.4, 8.9, 9.1]},
    "set": 3,
    "qid": "mbb:set-3:d6-007"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A precision-versus-accuracy target diagram is used to teach new Black Belts the distinction between the two concepts using four labeled panels (A-D) showing different combinations of tight/loose clustering and on-target/off-target centering. Which panel would correctly illustrate 'high precision, low accuracy'?",
    "options": [
      "A panel showing points tightly clustered exactly on the target",
      "A panel showing points scattered widely but centered on the target",
      "A panel showing points tightly clustered together but consistently offset from the target center \u2014 tight clustering indicates high precision (low variability), while the systematic offset from the true target indicates low accuracy (bias)",
      "A panel showing points scattered widely and also offset from the target"
    ],
    "answer": 2,
    "why": "High precision means low variability (tight clustering); low accuracy means the measurements are biased away from the true value \u2014 the combination is tight clustering that is consistently off-center from the target, distinct from the other three quadrant combinations. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "chart": {"type": "precision-accuracy"},
    "set": 3,
    "qid": "mbb:set-3:d6-008"
  },
  {
    "sub": "mbb-analytics",
    "stem": "An MSA bias study compares a gauge's measurements against a certified reference standard across the low, middle, and high end of the process range, finding a consistent gap between measured and true values at every point on the range. What does this pattern indicate, and how does it differ from a linearity problem?",
    "options": [
      "This indicates a constant bias (the gauge reads consistently high or low by the same amount regardless of where in the range it measures) rather than a linearity problem, which would instead show the bias itself changing in magnitude across the range \u2014 a constant bias is often correctable via a fixed offset/calibration adjustment",
      "Bias and linearity are the same concept and cannot be distinguished from this data",
      "This pattern indicates the gauge is functioning perfectly with no correction needed",
      "This indicates a linearity problem, since the gap changes across the range"
    ],
    "answer": 0,
    "why": "A constant offset across the full range is a bias (calibration) issue, correctable with a fixed adjustment; a linearity problem is specifically when the size of the bias itself changes across the measurement range, requiring a different (often more involved) fix. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "chart": {"type": "bias-diagram"},
    "set": 3,
    "qid": "mbb:set-3:d6-009"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A process capability study assumes the underlying data are normally distributed and reports Cpk = 1.5, but a normal probability plot of the same data shows a clear, strong S-curve pattern. What should the MBB do before trusting the Cpk value?",
    "options": [
      "Conclude the process is not capable regardless of the Cpk figure, without further analysis",
      "Automatically double the reported Cpk value to compensate for non-normality",
      "Recognize that Cpk (as conventionally calculated) assumes normality, and a clear non-normal pattern invalidates that assumption; the MBB should either transform the data, use a capability method appropriate to the actual distribution, or otherwise verify the assumption before trusting the reported Cpk value",
      "Trust the Cpk value as calculated, since Cpk calculations don't depend on the underlying distribution shape"
    ],
    "answer": 2,
    "why": "Standard Cpk calculations assume normality; a clearly non-normal pattern (like a strong S-curve on a normal probability plot) means the reported Cpk may be misleading, and the MBB should verify/correct for the actual distribution before relying on it. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "set": 3,
    "qid": "mbb:set-3:d6-010"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A control chart shows a process running in statistical control for 40 consecutive points, then shows 8 consecutive points all above the centerline (though none individually beyond the control limits). What does this pattern most likely indicate under standard Western Electric-style run rules?",
    "options": [
      "A run of 8 or more consecutive points on one side of the centerline is a standard special-cause signal (even without any single point exceeding the control limits), indicating a likely process shift that should be investigated",
      "The correct response is to recalculate control limits immediately using only the most recent 8 points",
      "This pattern can only be meaningful if it occurs on the R-chart, never on the X-bar chart",
      "Nothing; since no individual point exceeds the control limits, the process remains fully in control with no signal present"
    ],
    "answer": 0,
    "why": "Standard run rules (e.g., 8+ consecutive points on one side of the centerline) flag a likely process shift as a special cause signal even when no single point exceeds the 3-sigma control limits \u2014 a run-based signal, not a single-point signal. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "chart": {"type": "control-single", "title": "Fill weight (g)", "unit": "g", "ucl": 505, "cl": 500, "lcl": 495, "data": [499, 501, 500, 498, 502, 501, 502, 503, 502, 504, 503, 502]},
    "set": 3,
    "qid": "mbb:set-3:d6-011"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A quality engineer proposes tightening a process's control limits to match the specification limits, reasoning 'this way the chart will catch defects sooner.' What is the flaw in this proposal?",
    "options": [
      "There is no flaw; control limits and specification limits should always be set equal to each other",
      "Tightening control limits to match specification limits is always the best practice for high-risk products",
      "Control limits reflect the process's own natural (common-cause) variation and are used to detect special causes; specification limits reflect customer/engineering requirements. Conflating the two causes the chart to either over-react to normal common-cause variation (false alarms) or under-detect real specification risk, depending on which is tighter \u2014 the two serve fundamentally different purposes and should not be set equal",
      "Specification limits should always be set wider than control limits automatically, regardless of the actual process capability"
    ],
    "answer": 2,
    "why": "This tests a foundational SPC distinction: control limits (based on actual process variation) and specification limits (based on customer requirements) serve different purposes and are calculated differently; conflating them produces either excessive false alarms or inadequate defect detection depending on the process's actual capability relative to spec. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "set": 3,
    "qid": "mbb:set-3:d6-012"
  },
  {
    "sub": "mbb-analytics",
    "stem": "An operating characteristic (OC) curve comparison shows Sampling Plan A's curve dropping off much more steeply than Sampling Plan B's curve as lot percent defective increases. What does the steeper curve indicate about Plan A relative to Plan B?",
    "options": [
      "Plan A necessarily requires a larger sample size than Plan B in every case, based on curve steepness alone",
      "Plan A discriminates more sharply between acceptable and unacceptable lots \u2014 its probability of acceptance drops more quickly as defect levels rise, meaning it is more likely to reject a genuinely bad lot (and accept a genuinely good one) compared to Plan B's more gradual curve",
      "The steepness of an OC curve has no relationship to a sampling plan's discrimination ability",
      "Plan A is worse at discriminating between good and bad lots than Plan B"
    ],
    "answer": 1,
    "why": "A steeper OC curve indicates sharper discrimination between good and bad lots \u2014 probability of acceptance falls off more quickly as true defect levels rise, which is generally a desirable sampling-plan property, though it usually comes with trade-offs in sample size or cost. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "chart": {"type": "oc-curve"},
    "set": 3,
    "qid": "mbb:set-3:d6-013"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A multi-vari chart plotting diameter measurements grouped by machine (1, 2, 3) shows tight within-machine spread but the group means differ substantially across machines. What does this pattern suggest as the dominant source of variation, and what should the next analysis step be?",
    "options": [
      "Between-machine variation is dominant (tight spread within each machine but substantial differences between machine means), suggesting the next step is investigating what differs systematically between the machines themselves (calibration, tooling, maintenance history) rather than individual-part-level causes",
      "The multi-vari chart cannot distinguish between within- and between-group variation",
      "Within-machine (piece-to-piece) variation is dominant; investigate individual part handling",
      "Time-to-time variation is clearly the dominant source based on this chart alone"
    ],
    "answer": 0,
    "why": "A multi-vari chart's core diagnostic value is separating variation sources; tight within-group spread with large between-group differences points to a machine-level (not part-level) root cause, directing the next investigation toward what differs between the machines themselves. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "chart": {"type": "multi-vari", "groupLabel": "Machine", "groups": [{"label": "Machine 1", "values": [10.02, 10.01, 10.03, 10.02]}, {"label": "Machine 2", "values": [10.15, 10.14, 10.16, 10.15]}, {"label": "Machine 3", "values": [9.88, 9.87, 9.89, 9.88]}]},
    "set": 3,
    "qid": "mbb:set-3:d6-014"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A Black Belt reports 'our process is 6 Sigma capable' based solely on a short-term Cp calculation of 2.0, without ever examining long-term process performance (Ppk) across multiple shifts and time periods. What is the flaw in this claim?",
    "options": [
      "Ppk is always smaller than Cp only when the process is out of control, and equal otherwise",
      "The distinction between Cp and Ppk is purely terminological with no practical difference",
      "There is no flaw; short-term Cp and long-term Ppk always produce identical values",
      "Cp (typically calculated from short-term, within-subgroup variation) can substantially overstate real-world capability compared to Ppk (calculated from long-term, overall variation including shift-to-shift and time-to-time effects); a genuine '6 Sigma' claim requires examining long-term performance, not just a short-term snapshot"
    ],
    "answer": 3,
    "why": "Cp/Cpk (short-term, within-subgroup variation) and Pp/Ppk (long-term, overall variation) can differ substantially in practice; the well-known '1.5 sigma shift' concept in Six Sigma literature exists precisely because short-term capability commonly overstates sustained, long-term performance. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "set": 3,
    "qid": "mbb:set-3:d6-015"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A regression model predicting patient length-of-stay from five clinical variables reports R\u00b2 = 0.89, and the team concludes 'we've found the causal drivers of length-of-stay.' What is the flaw in this conclusion?",
    "options": [
      "There is no flaw; a high R\u00b2 always proves causation for the included variables",
      "R\u00b2 values above 0.85 are mathematically impossible unless causation has been established",
      "A high R\u00b2 indicates strong statistical association/explanatory power within the sample but does not by itself establish causation; confounding variables, reverse causation, or spurious correlation could all produce a high R\u00b2 without the included variables being true causal drivers",
      "The model should be discarded entirely since R\u00b2 is never a meaningful statistic"
    ],
    "answer": 2,
    "why": "This is a direct application of the correlation-is-not-causation principle to regression specifically: a high R\u00b2 reflects strong statistical association within the data, not proof of a causal mechanism \u2014 confounding and other explanations must be ruled out separately. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "set": 3,
    "qid": "mbb:set-3:d6-016"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A regression diagnostic plot of standardized residuals versus fitted values for a manufacturing yield model shows a clear funnel shape (residual spread increasing as fitted values increase). What assumption does this violate, and what is the practical consequence?",
    "options": [
      "This violates the assumption of constant variance (homoscedasticity); the practical consequence is that the model's standard errors and any hypothesis tests/confidence intervals based on them become unreliable, even if the point estimates of the coefficients remain reasonable",
      "Funnel-shaped residuals indicate the model has too many predictor variables and none should ever be interpreted",
      "This pattern indicates the data must be re-collected using a completely different measurement instrument",
      "This violates the linearity assumption; the consequence is a completely useless model requiring immediate discard"
    ],
    "answer": 0,
    "why": "A funnel-shaped residual pattern is the classic signature of heteroscedasticity (non-constant variance), which specifically undermines standard-error-based inference (hypothesis tests, confidence intervals) even though the coefficient point estimates themselves may remain reasonably unbiased. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "chart": {"type": "regression-diagnostic", "points": [[10, 0.2], [15, -0.3], [20, 0.8], [25, -1.1], [30, 1.6], [35, -2.0], [40, 2.8], [45, -3.2], [50, 3.9]], "xLabel": "Fitted yield (%)", "yLabel": "Standardized residual", "title": "Residuals vs. fitted values"},
    "set": 3,
    "qid": "mbb:set-3:d6-017"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A predictive maintenance model includes both 'machine age in years' and 'total operating hours' as predictors, and the team notices the coefficient signs flip unpredictably when either variable is added or removed. What is the most likely explanation, and what diagnostic should confirm it?",
    "options": [
      "The model is simply broken and cannot be fixed regardless of diagnosis",
      "Multicollinearity between the two highly correlated predictors (machine age and operating hours often move together) is the likely cause; a Variance Inflation Factor (VIF) calculation for each predictor would confirm this, with a high VIF (commonly, above 5-10) indicating problematic collinearity",
      "This pattern always indicates a data entry error rather than a modeling issue",
      "The coefficient sign instability proves the underlying relationship is nonlinear and no diagnostic is needed"
    ],
    "answer": 1,
    "why": "Unstable, flip-flopping coefficient signs when correlated predictors are added/removed is a classic multicollinearity signature; VIF is the standard diagnostic (VIF = 1/(1-R\u00b2) for that predictor regressed on the others) to confirm and quantify the collinearity. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "chart": {"type": "data-table", "columns": ["Predictor", "VIF"], "rows": [["Machine age (years)", "14.2"], ["Operating hours", "13.8"], ["Ambient temperature", "1.3"]]},
    "set": 3,
    "qid": "mbb:set-3:d6-018"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A logistic regression model predicting equipment failure (yes/no) reports an odds ratio of 2.3 for a maintenance-interval variable. What does this odds ratio mean in practical terms?",
    "options": [
      "A one-unit increase in the maintenance interval is associated with the odds of failure being 2.3 times higher (not the same as a 2.3-percentage-point or 2.3x probability increase) \u2014 odds ratios and probability changes are related but distinct quantities that should not be conflated",
      "An odds ratio of 2.3 indicates the model has no predictive value",
      "Odds ratios are only interpretable for linear regression, not logistic regression",
      "A one-unit increase in the maintenance interval is associated with the failure probability being exactly 2.3 percentage points higher"
    ],
    "answer": 0,
    "why": "This tests a common misinterpretation: an odds ratio describes a multiplicative change in odds, not a direct percentage-point or proportional probability change \u2014 conflating the two is a frequent and consequential misreading of logistic regression output. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "chart": {"type": "data-table", "columns": ["Maintenance interval group", "Failures", "No failures"], "rows": [["Short interval", "18", "82"], ["Long interval", "34", "66"]]},
    "set": 3,
    "qid": "mbb:set-3:d6-019"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A regression model built on 18 months of historical data performs excellently in-sample (R\u00b2 = 0.94) but performs poorly when applied to 3 new months of data collected after the model was built. What does this pattern most likely indicate?",
    "options": [
      "In-sample R\u00b2 and out-of-sample performance are always identical by mathematical necessity",
      "The correct fix is to simply add more predictor variables to the existing model without further validation",
      "The new data must be flawed, since the original model's high R\u00b2 proves it is correct",
      "The model likely suffers from overfitting to the specific historical dataset (capturing noise or dataset-specific quirks rather than a generalizable relationship), or the underlying process has genuinely shifted since the training period; the model should be validated on truly held-out data before being trusted for ongoing predictions"
    ],
    "answer": 3,
    "why": "Strong in-sample fit with poor out-of-sample performance is the classic overfitting signature (or a genuine process shift); proper model validation on genuinely held-out data is the standard practice to catch this before deploying a model operationally. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "set": 3,
    "qid": "mbb:set-3:d6-020"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A response surface analysis of a chemical yield process identifies a stationary point, and contour plots show elliptical, concentric contours around it with no saddle pattern. What does this indicate about the nature of that stationary point?",
    "options": [
      "Elliptical, concentric contours around a stationary point (without a saddle/hyperbolic pattern) indicate the point is likely a true maximum or minimum \u2014 the response surface curves consistently in one direction around that point, unlike a saddle point where the surface rises in one direction and falls in another",
      "Concentric elliptical contours always indicate the response is completely flat (no optimum exists) in that region",
      "The stationary point is definitely a saddle point requiring further exploration in a different direction",
      "This pattern can only occur if the underlying model is a first-order (linear) fit, never a quadratic response surface model"
    ],
    "answer": 0,
    "why": "Concentric elliptical contours around a stationary point are the visual signature of a true maximum or minimum (the response consistently curves one direction), as distinct from the characteristic hyperbolic/saddle-shaped contours that indicate a saddle point requiring further exploration. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "set": 3,
    "qid": "mbb:set-3:d6-021"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A team building a regression model to predict customer churn includes 40 candidate predictor variables with only 85 observations. What statistical concern should the MBB raise before the model is trusted?",
    "options": [
      "The concern is irrelevant as long as the reported R\u00b2 is high",
      "With 40 predictors and only 85 observations, the model is at serious risk of overfitting (too many parameters relative to the sample size) \u2014 the MBB should recommend reducing the predictor set (via domain knowledge, regularization, or stepwise/validated selection) and using proper cross-validation before trusting the model's predictive claims",
      "No concern; more predictor variables always produce a more accurate and more trustworthy model",
      "The correct fix is to simply collect more predictor variables to further increase the ratio"
    ],
    "answer": 1,
    "why": "A high ratio of predictors to observations (here, nearly 1 predictor for every 2 observations) is a well-known overfitting risk factor; dimension reduction and proper out-of-sample validation are the standard remedies before trusting such a model. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "set": 3,
    "qid": "mbb:set-3:d6-022"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A Master Black Belt reviewing a colleague's regression output notices the reported Variance Inflation Factor (VIF) for a key predictor is 0.6. What should the MBB conclude about this reported figure?",
    "options": [
      "A VIF of 0.6 indicates a perfectly uncorrelated predictor with no further action needed",
      "A VIF of 0.6 indicates mild but acceptable multicollinearity for this predictor",
      "VIF values below 1 are common and simply indicate a well-specified model",
      "This reported VIF value is mathematically impossible \u2014 VIF is calculated as 1/(1-R\u00b2) for that predictor regressed on the others, and since R\u00b2 is bounded between 0 and 1, VIF can never be below 1; a reported value of 0.6 indicates a calculation or reporting error that should be corrected before the analysis is trusted"
    ],
    "answer": 3,
    "why": "VIF = 1/(1-R\u00b2), and since R\u00b2 is bounded in [0,1), VIF is bounded below by 1 \u2014 a reported VIF below 1 is mathematically impossible and signals a calculation or reporting error requiring correction. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "set": 3,
    "qid": "mbb:set-3:d6-023"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A time-series regression modeling daily call-center volume shows a Durbin-Watson statistic of 0.45. What does this value indicate, and why does it matter for the model's validity?",
    "options": [
      "Durbin-Watson statistics only apply to cross-sectional data, never to time-series data",
      "A Durbin-Watson value well below 2 (here, 0.45) indicates strong positive autocorrelation in the residuals, meaning consecutive residuals are correlated rather than independent; this violates a standard regression assumption and means the model likely needs a time-series-appropriate approach (e.g., including lagged terms or an ARIMA-style model) rather than standard OLS regression",
      "A Durbin-Watson value of 0.45 indicates no autocorrelation and the model is fully valid as specified",
      "A low Durbin-Watson value indicates the model has too many predictor variables"
    ],
    "answer": 1,
    "why": "Durbin-Watson values range roughly 0-4, with values near 2 indicating no autocorrelation; a value of 0.45 signals strong positive autocorrelation, a common issue in time-series regression that violates the independence assumption and typically requires a time-series-appropriate modeling approach. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "chart": {"type": "time-series", "title": "Daily call volume (14 days)", "labels": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"], "data": [210, 225, 240, 255, 248, 260, 275, 268, 280, 295, 288, 300, 315, 308], "xLabel": "Day", "yLabel": "Calls"},
    "set": 3,
    "qid": "mbb:set-3:d6-024"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A multiple regression model for predicting project cost overruns includes 'project duration' and 'project complexity score,' both of which individually show strong, statistically significant relationships with cost overrun when tested alone, but neither is significant when both are included together in the same model. What is the most likely explanation?",
    "options": [
      "This pattern proves the underlying relationship must be nonlinear rather than linear",
      "The sample size used must have been too large for meaningful hypothesis testing",
      "The two predictors are likely substantially correlated with each other (project duration and complexity often move together), so once one is in the model, the other has little additional explanatory power left to contribute \u2014 a multicollinearity pattern distinct from either variable being truly unrelated to the outcome",
      "Both variables are simply irrelevant to cost overruns and should be discarded entirely"
    ],
    "answer": 2,
    "why": "When two individually-significant predictors both become non-significant together, shared explanatory overlap (multicollinearity) between them is the most likely explanation \u2014 not that either variable is truly unrelated to the outcome. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "set": 3,
    "qid": "mbb:set-3:d6-025"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A Master Black Belt is asked to choose between a simple linear regression model (R\u00b2 = 0.71) and a complex model with 12 polynomial and interaction terms (R\u00b2 = 0.93) for predicting a stable, well-understood manufacturing relationship. What consideration should weigh most heavily in this decision, beyond the raw R\u00b2 difference?",
    "options": [
      "R\u00b2 is the only consideration relevant to model selection; interpretability is irrelevant",
      "Consider model parsimony and interpretability alongside predictive validity \u2014 a much more complex model's R\u00b2 gain may partly reflect overfitting to the specific dataset rather than genuine explanatory improvement, and a simpler, more interpretable model is often preferable when it captures the well-understood relationship adequately and generalizes more reliably",
      "Always select the model with the higher R\u00b2 regardless of any other consideration",
      "Always select the simpler model regardless of the R\u00b2 difference, no matter how large"
    ],
    "answer": 1,
    "why": "Model selection should weigh parsimony, interpretability, and generalization risk (overfitting) alongside raw fit statistics \u2014 a large jump in R\u00b2 from a much more complex model warrants scrutiny for overfitting rather than automatic preference. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "set": 3,
    "qid": "mbb:set-3:d6-026"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A regression analysis of supplier delivery delays reports a p-value of 0.03 for a key predictor with a very small effect size (a one-unit increase in the predictor is associated with only a 0.02-day change in delay). How should the MBB frame this finding to the project team?",
    "options": [
      "Distinguish statistical significance from practical significance: with a very large sample, even a trivially small effect (0.02 days) can be statistically significant; the MBB should frame this finding as statistically detectable but likely not practically meaningful, and should not be prioritized as a major delay driver on that basis alone",
      "Effect size is irrelevant as long as the p-value is below the conventional 0.05 threshold",
      "The p-value of 0.03 proves this is a practically important driver of delivery delays that should be prioritized",
      "A p-value of 0.03 indicates the finding is not statistically significant and should be ignored entirely"
    ],
    "answer": 0,
    "why": "This is a direct application of the statistical-versus-practical-significance distinction explicitly required by the original assignment's statistical rigor standards \u2014 a statistically significant but practically trivial effect should not be treated as an important business driver. Source: [BOK] Domain VI.B, Measuring and Modeling (Regression).",
    "set": 3,
    "qid": "mbb:set-3:d6-027"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A main effects plot for a 2\u00b2 factorial experiment on adhesive bond strength shows Factor A's line rising steeply from low to high, while Factor B's line is nearly flat. What does this pattern indicate about the relative importance of the two factors on the main-effects plot alone?",
    "options": [
      "Factor A appears to have a substantially larger main effect on bond strength (the steep rise from low to high indicates the response changes considerably with Factor A's level), while Factor B's near-flat line suggests little to no main effect \u2014 though this main-effects view alone doesn't rule out an interaction effect between A and B",
      "The main effects plot indicates Factor B should be immediately dropped from any further experimentation",
      "Factor B has a larger effect on the response than Factor A, based on the flat line",
      "Both factors have identical effects on the response, since both were tested at the same two levels"
    ],
    "answer": 0,
    "why": "Slope steepness on a main effects plot directly reflects effect magnitude; a steep line for A and flat line for B indicates A has the larger apparent main effect \u2014 though a full DOE analysis should still check for interactions before completely dismissing Factor B's role. Source: [BOK] Domain VI.C, Design of Experiments.",
    "chart": {"type": "main-effects-plot", "panels": [{"factor": "A", "low": 42, "high": 68}, {"factor": "B", "low": 54, "high": 56}], "overall": 55},
    "set": 3,
    "qid": "mbb:set-3:d6-028"
  },
  {
    "sub": "mbb-analytics",
    "stem": "An interaction plot for factors A and B on a plastic injection molding response shows two clearly non-parallel lines, with one factor's effect reversing direction depending on the other factor's level. What does this pattern indicate, and why does it matter for interpreting main effects?",
    "options": [
      "Interaction plots can only be constructed for three or more factors, never for two",
      "This pattern proves the experiment was run incorrectly and should be discarded",
      "The non-parallel lines indicate no interaction is present; only parallel lines would indicate an interaction",
      "Non-parallel lines (especially with a reversal in direction) indicate a significant interaction effect between A and B \u2014 this means the effect of one factor genuinely depends on the level of the other, and interpreting either factor's main effect in isolation (without accounting for this interaction) would be misleading or incomplete"
    ],
    "answer": 3,
    "why": "Non-parallel interaction-plot lines (especially with a directional reversal, a strong/'crossover' interaction) are the classic visual signature of a significant interaction \u2014 exactly the case where interpreting main effects alone, without the interaction, would mislead. Source: [BOK] Domain VI.C, Design of Experiments.",
    "chart": {"type": "interaction-plot", "parallel": false},
    "set": 3,
    "qid": "mbb:set-3:d6-029"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DOE team runs a 2\u00b3 full factorial design but wants to reduce runs to save time, proposing a half-fraction (2\u00b3\u207b\u00b9) design instead. What is the primary trade-off the MBB should explain before this change is approved?",
    "options": [
      "There is no trade-off; fractional designs always provide identical information to full factorial designs",
      "The only consequence of fractionation is a change in the units of the response variable",
      "Fractional designs always require more runs than the full factorial they're derived from",
      "A half-fraction design confounds (aliases) certain effects with each other \u2014 typically higher-order interactions with main effects or lower-order interactions \u2014 meaning some effects can no longer be estimated independently; the team should review the specific alias structure to confirm the confounded effects are ones they're willing to assume are negligible"
    ],
    "answer": 3,
    "why": "Fractional factorial designs achieve run reduction by deliberately confounding certain effects (per the design's specific alias structure); the team must review which effects are aliased and confirm an acceptable assumption (e.g., higher-order interactions are negligible) before adopting the reduced design. Source: [BOK] Domain VI.C, Design of Experiments.",
    "set": 3,
    "qid": "mbb:set-3:d6-030"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A 2\u2074 fractional factorial design has a defining relation showing Factor D is confounded with the ABC three-way interaction. If the experiment detects a large, statistically significant effect associated with this alias, what is the correct interpretation?",
    "options": [
      "The effect must be entirely due to the ABC interaction, since main effects are never confounded with interactions in fractional designs",
      "Aliased effects are always non-significant by mathematical necessity, so this observation would be a data error",
      "The effect must be entirely due to Factor D, since three-way interactions are never practically significant",
      "The observed effect could be due to Factor D's main effect, the ABC three-way interaction, or some combination of both \u2014 since they are aliased (confounded) in this design, the data alone cannot distinguish between them; follow-up experimentation (e.g., a foldover design) would be needed to de-alias and determine the true source"
    ],
    "answer": 3,
    "why": "When effects are aliased in a fractional factorial design, the observed data cannot statistically distinguish between them; correctly interpreting the result requires acknowledging both are plausible explanations, with follow-up experimentation needed to resolve the ambiguity, rather than assuming one attribution over the other without justification. Source: [BOK] Domain VI.C, Design of Experiments.",
    "set": 3,
    "qid": "mbb:set-3:d6-031"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DOE resolution III design is used to screen 7 factors in 8 runs. What is the key limitation of a resolution III design that the MBB should communicate to the team before they interpret results?",
    "options": [
      "Resolution III designs can only be used when all factors are known in advance to have zero interactions, which must be verified before running the experiment",
      "In a resolution III design, main effects are confounded with two-factor interactions; if any meaningful two-factor interactions exist among the screened factors, the main effect estimates could be distorted by that confounding, and the team should treat this as a preliminary screening step requiring follow-up (often a higher-resolution design) rather than a final, fully reliable result",
      "Resolution III designs provide complete information equivalent to a full factorial with no limitations",
      "The resolution number refers only to the number of factors that can be included, unrelated to confounding"
    ],
    "answer": 1,
    "why": "Resolution III is specifically defined by main effects being confounded with two-factor interactions \u2014 a critical limitation for screening designs that the MBB must communicate, since real two-factor interactions (if present) would distort the apparent main effect estimates. Source: [BOK] Domain VI.C, Design of Experiments.",
    "chart": {"type": "data-table", "columns": ["Effect", "Confounded with"], "rows": [["A", "BC + DE"], ["B", "AC + DF"], ["C", "AB + EF"], ["D", "AE + BF"]]},
    "set": 3,
    "qid": "mbb:set-3:d6-032"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A response surface methodology (RSM) study on a coating-thickness process identifies a region of curvature in the response, but the team's initial design was a simple 2-level factorial with no center points. What is the consequence of this design choice?",
    "options": [
      "Curvature can only ever be detected using a fractional factorial design, never a full factorial",
      "A 2-level factorial design without center points cannot detect curvature (nonlinear/quadratic effects) in the response at all \u2014 it can only estimate linear main effects and interactions; center points (or a follow-up RSM design like central composite) are needed to detect and model the curvature the team now suspects is present",
      "No consequence; 2-level factorial designs are always sufficient for detecting and modeling curvature",
      "The team should have used more factor levels rather than adding center points"
    ],
    "answer": 1,
    "why": "A basic 2-level factorial design is fundamentally unable to detect curvature (it only estimates linear effects); center points or a full RSM design (e.g., central composite) are specifically needed to detect and characterize nonlinear/quadratic response behavior. Source: [BOK] Domain VI.C, Design of Experiments.",
    "set": 3,
    "qid": "mbb:set-3:d6-033"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DOE cube plot for a 2\u00b3 design on etch rate shows the highest response value at the corner where all three factors are at their high setting, and the lowest at the opposite corner (all factors low). What does this pattern suggest, assuming no significant interactions are present?",
    "options": [
      "A cube plot cannot show a monotonic corner-to-corner pattern under any circumstances",
      "All three factors appear to move the response in the same direction (higher factor settings associated with higher response), consistent with three positive main effects and no strongly conflicting interaction pulling the surface away from this simple corner-to-corner pattern",
      "All three factors have effects working against each other, canceling out any overall pattern",
      "This cube plot pattern can only occur if all three factors have zero effect on the response"
    ],
    "answer": 1,
    "why": "A clean corner-to-corner pattern (highest response at all-factors-high, lowest at all-factors-low) is consistent with all three factors having positive main effects and no strong interactions disrupting that simple, additive pattern. Source: [BOK] Domain VI.C, Design of Experiments.",
    "chart": {"type": "activity-network", "nodes": {"Low-Low-Low": {"col": 0, "row": 0, "dur": 42}, "High-Low-Low": {"col": 1, "row": 0, "dur": 51}, "Low-High-Low": {"col": 0, "row": 1, "dur": 58}, "High-High-High": {"col": 1, "row": 1, "dur": 89}}, "edges": [["Low-Low-Low", "High-Low-Low"], ["Low-Low-Low", "Low-High-Low"], ["High-Low-Low", "High-High-High"], ["Low-High-Low", "High-High-High"]]},
    "set": 3,
    "qid": "mbb:set-3:d6-034"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A Black Belt wants to study 5 factors but can only afford 16 experimental runs due to material cost constraints. Which design choice, and why, is most appropriate given this constraint?",
    "options": [
      "A one-factor-at-a-time approach testing each of the 5 factors individually, ignoring any possible interactions",
      "Randomly select only 2 of the 5 factors to study, discarding the other 3 without justification",
      "A full 2\u2075 factorial design (32 runs), exceeding the stated budget, since full factorials are always required",
      "A 2\u2075\u207b\u00b9 half-fraction design (16 runs), which fits the budget while still providing reasonable resolution for estimating main effects and typically most two-factor interactions, depending on the specific fraction's alias structure \u2014 an appropriate trade-off between information and run-count constraints"
    ],
    "answer": 3,
    "why": "Given a firm budget constraint, a half-fraction design matching that run count is the standard, defensible DOE choice \u2014 far superior to one-factor-at-a-time (which cannot detect interactions) or arbitrarily dropping factors without justification. Source: [BOK] Domain VI.C, Design of Experiments.",
    "set": 3,
    "qid": "mbb:set-3:d6-035"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DOE team is deciding factor levels for a temperature variable in an experiment and sets the 'low' and 'high' levels only 2 degrees apart, well within the normal random noise band already observed in the process. What is the likely consequence of this choice?",
    "options": [
      "Levels set too close together always produce statistically significant results regardless of the true effect",
      "The correct fix is to reduce the number of replicates to compensate for the narrow level spacing",
      "No consequence; factor level spacing never affects the ability to detect a real effect",
      "Setting factor levels too close together (within the normal noise band) risks the experiment failing to detect a real effect even if one exists, since the signal from the deliberately small level change may be indistinguishable from ordinary process noise \u2014 levels should be spaced widely enough to produce a detectable signal while remaining within a practical, safe operating range"
    ],
    "answer": 3,
    "why": "Factor levels set within the existing noise band risk a real effect being masked by ordinary process variation, reducing the experiment's power to detect it \u2014 level spacing should be wide enough (within practical/safety bounds) to produce a signal distinguishable from noise. Source: [BOK] Domain VI.C, Design of Experiments.",
    "set": 3,
    "qid": "mbb:set-3:d6-036"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DOE analysis for a plastics extrusion process identifies a statistically significant three-way interaction (A\u00d7B\u00d7C) but no significant two-way interactions or main effects for any of the three factors individually. How should the team interpret and communicate this finding?",
    "options": [
      "This pattern always indicates the experiment must be re-run with a completely different set of factors",
      "The three-way interaction should be ignored entirely since only main effects are ever actionable",
      "This result is impossible and indicates a data error, since interactions cannot be significant without their component main effects also being significant",
      "A significant higher-order interaction without significant lower-order effects, while less common, is a valid and interpretable result \u2014 it means the combined effect of all three factors together matters, even though no single factor or two-factor combination shows a detectable effect on its own; the team should use interaction plots stratified by the third factor to interpret and communicate this pattern"
    ],
    "answer": 3,
    "why": "While hierarchical models (where interactions imply their component main effects) are common practice, a significant higher-order interaction without significant lower-order terms is a valid, if less common, DOE result requiring careful visualization (e.g., stratified interaction plots) to interpret and communicate clearly. Source: [BOK] Domain VI.C, Design of Experiments.",
    "set": 3,
    "qid": "mbb:set-3:d6-037"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DOE team runs their experiment with all high-temperature trials completed on Monday and all low-temperature trials on Tuesday, for scheduling convenience. What experimental design principle does this violate, and what confound does it introduce?",
    "options": [
      "No principle is violated; scheduling convenience is always an acceptable basis for run order",
      "This violates the principle of randomization; running all high-temperature trials on one day and all low trials on another confounds the temperature effect with any day-to-day (or time-based) variation \u2014 e.g., a raw material lot change or ambient humidity difference between Monday and Tuesday would be indistinguishable from the temperature effect itself",
      "The correct fix is to run the entire experiment in a single day regardless of practical constraints",
      "This only matters if temperature is not the primary factor of interest in the study"
    ],
    "answer": 1,
    "why": "Randomizing run order is a foundational DOE principle specifically to prevent confounding a factor's effect with uncontrolled time-based variation (material lot changes, ambient conditions, equipment drift) \u2014 blocking by day without randomization, as described here, creates exactly that confound. Source: [BOK] Domain VI.C, Design of Experiments.",
    "set": 3,
    "qid": "mbb:set-3:d6-038"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DOE team includes 'operator' as a blocking variable in their design, recognizing that different operators may introduce systematic variation unrelated to the factors under study. What is the purpose of this blocking, and how does it differ from simply ignoring operator differences?",
    "options": [
      "Blocking is only relevant when a single operator runs the entire experiment",
      "Blocking accounts for a known, systematic source of variation (operator differences) by structuring the design so that operator effects don't get confounded with the factors of actual interest; this increases the experiment's sensitivity to detect real factor effects, compared to simply ignoring operator differences and letting that variation add uncontrolled noise to the results",
      "Blocking and randomization are the same technique with no meaningful difference",
      "Blocking eliminates operator-to-operator variation from existing in the process at all"
    ],
    "answer": 1,
    "why": "Blocking is a design technique for controlling a known nuisance variable (like operator) by structuring it into the design, increasing sensitivity to the factors of real interest \u2014 distinct from simply ignoring the variable and absorbing its variation as uncontrolled noise. Source: [BOK] Domain VI.C, Design of Experiments.",
    "set": 3,
    "qid": "mbb:set-3:d6-039"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS team runs a definitive screening design (DSD) to study 8 factors efficiently before committing to a full response surface study. What is the primary advantage of a DSD over a standard resolution III fractional factorial for this purpose?",
    "options": [
      "DSDs are specifically constructed so that main effects are not confounded with two-factor interactions (unlike resolution III designs), and can often detect some quadratic (curvature) effects directly \u2014 providing more reliable screening information without the resolution III's main-effect/interaction confounding problem",
      "DSDs eliminate the need for any follow-up experimentation regardless of the screening results",
      "DSDs can only be used when all factors are categorical, never continuous",
      "DSDs always require more runs than an equivalent fractional factorial, making them strictly worse"
    ],
    "answer": 0,
    "why": "Definitive screening designs are specifically constructed to avoid confounding main effects with two-factor interactions (the key resolution III limitation) while also allowing some curvature detection \u2014 a meaningful efficiency and reliability advantage for screening purposes. Source: [BOK] Domain VI.C, Design of Experiments.",
    "set": 3,
    "qid": "mbb:set-3:d6-040"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A quality engineer analyzing a completed 2\u00b3 factorial DOE reports the results using only a table of means for each of the 8 corner combinations, with no visual representation. An MBB reviewing the report suggests adding a cube plot. What specific benefit does the cube plot add beyond the table of means?",
    "options": [
      "A cube plot visually represents the response pattern across all 8 factor-level combinations simultaneously, making patterns like main effects, two-way interactions, and the overall best/worst corner combinations immediately apparent in a way that scanning a numeric table does not as readily reveal, especially to a non-technical audience reviewing the results",
      "A cube plot is only appropriate for designs with more than three factors",
      "A cube plot replaces the need for any statistical significance testing on the DOE results",
      "A cube plot provides no additional benefit beyond a table of means; both convey identical information equally well"
    ],
    "answer": 0,
    "why": "This reflects the core rationale for visual/interactive question requirements generally: a cube plot makes spatial patterns (main effects, interactions, best/worst combinations) immediately visible in a way a numeric table requires more effort to extract, especially for less technical stakeholders reviewing DOE results. Source: [BOK] Domain VI.C, Design of Experiments.",
    "chart": {"type": "data-table", "columns": ["A", "B", "C", "Mean etch rate"], "rows": [["Low", "Low", "Low", "42"], ["High", "Low", "Low", "51"], ["Low", "High", "Low", "58"], ["High", "High", "Low", "64"], ["Low", "Low", "High", "55"], ["High", "Low", "High", "67"], ["Low", "High", "High", "71"], ["High", "High", "High", "89"]]},
    "set": 3,
    "qid": "mbb:set-3:d6-041"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DOE team wants to study the effect of 3 continuous factors on a response but decides to test each factor at 5 levels rather than the conventional 2, reasoning 'more levels means more information.' What is the main trade-off the MBB should raise?",
    "options": [
      "Testing more levels always reduces the total number of runs needed compared to a 2-level design",
      "The number of levels per factor has no bearing on total run count in a factorial design",
      "There is no trade-off; more levels per factor always provides strictly more information at no cost",
      "Testing more levels per factor dramatically increases the number of runs required for a full factorial (5\u00b3 = 125 runs versus 2\u00b3 = 8), and for the purpose of detecting linear main effects and interactions, 2 levels are often sufficient; more levels are primarily valuable when curvature is specifically suspected and a response-surface-style investigation is warranted, not as a default choice"
    ],
    "answer": 3,
    "why": "This tests understanding of the run-count cost of adding factor levels (5\u00b3 vs 2\u00b3) and the practical guidance that 2-level designs are usually the efficient default for detecting linear effects/interactions, reserving additional levels for when curvature is specifically suspected. Source: [BOK] Domain VI.C, Design of Experiments.",
    "set": 3,
    "qid": "mbb:set-3:d6-042"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A data governance review finds that three departments each maintain their own definition of 'on-time delivery' (some measuring from order date, others from ship date), producing inconsistent enterprise-wide reporting. What data management principle should the MBB apply first?",
    "options": [
      "Immediately terminate all three departments' existing reporting systems without a transition plan",
      "Establish a single, enterprise-wide standardized data definition (a common data dictionary entry for 'on-time delivery' with agreed measurement points) before attempting any cross-departmental analysis or reporting, since inconsistent definitions make aggregated metrics meaningless",
      "Allow each department to continue using its own definition, since local context always outweighs enterprise consistency",
      "Ignore the inconsistency, since averaging across different definitions produces a valid enterprise metric"
    ],
    "answer": 1,
    "why": "Standardized data definitions (a shared data dictionary) are foundational to any credible enterprise-wide analytics effort \u2014 without them, aggregated metrics and cross-departmental comparisons are not meaningful, regardless of how sophisticated the downstream analysis is. Source: [BOK] Domain VI.D, Data Management and Analytics.",
    "set": 3,
    "qid": "mbb:set-3:d6-043"
  },
  {
    "sub": "mbb-analytics",
    "stem": "An analytics team building a defect-prediction dashboard pulls data from three source systems with no reconciliation process, and later discovers 8% of records are duplicated across systems, inflating apparent defect counts. What data management practice would have caught this issue earlier?",
    "options": [
      "Reconciliation is unnecessary as long as each individual source system's own internal data is accurate",
      "No practice could have caught this; duplicate records are an unavoidable and undetectable data quality issue",
      "The correct practice is to always trust the source system with the largest total record count",
      "A data reconciliation/validation process (e.g., checking for duplicate unique identifiers across source systems before combining them into a unified dataset) is a standard data management practice specifically designed to catch exactly this kind of cross-system duplication before it propagates into downstream analysis"
    ],
    "answer": 3,
    "why": "Cross-system reconciliation and duplicate-detection checks are standard, necessary data management practices before combining data from multiple sources \u2014 skipping this step is exactly what allows silent data quality issues like this to propagate undetected. Source: [BOK] Domain VI.D, Data Management and Analytics.",
    "set": 3,
    "qid": "mbb:set-3:d6-044"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A dashboard displaying real-time production metrics refreshes only once every 24 hours, but operators are making shift-level decisions based on it throughout the day, unaware the data may be up to a full day stale. What should the MBB recommend?",
    "options": [
      "Either increase the refresh frequency to match the actual decision cadence (shift-level, in this case) or, if faster refresh isn't feasible, prominently display the data's actual timestamp/staleness so operators can appropriately weight decisions made against it \u2014 the refresh cadence should be matched to how the data is actually being used",
      "Increase the refresh frequency to once per second regardless of the actual decision-making cadence or system cost",
      "Eliminate the dashboard entirely, since any data staleness makes a dashboard worthless",
      "No change is needed; a 24-hour refresh cycle is always sufficient regardless of the decision cadence it's meant to support"
    ],
    "answer": 0,
    "why": "This is the same cadence-matching principle established elsewhere in this bank (organizational feedback, portfolio governance) applied to dashboard/data refresh design \u2014 refresh frequency should match the actual decision cadence, or staleness should at minimum be made visible. Source: [BOK] Domain VI.D, Data Management and Analytics.",
    "set": 3,
    "qid": "mbb:set-3:d6-045"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A predictive analytics model flags 200 pieces of equipment as 'high failure risk' out of 10,000 total, but maintenance capacity only allows inspecting 50 per week. What data-driven prioritization approach should the MBB recommend beyond the binary flag?",
    "options": [
      "Wait until all 200 flagged items can be inspected simultaneously before inspecting any of them",
      "Inspect equipment in alphabetical order by asset ID, ignoring the model's output entirely",
      "Use the model's underlying risk scores (not just the binary high/low flag) to rank the 200 flagged items by relative risk severity, prioritizing inspection capacity toward the highest-risk items first \u2014 a binary flag alone discards valuable ranking information the underlying model likely already produces",
      "Inspect the 200 flagged pieces in a completely random order, since the binary flag alone provides sufficient prioritization information"
    ],
    "answer": 2,
    "why": "A binary high/low flag discards the underlying continuous risk score's ranking information; when inspection capacity is constrained, prioritizing by the actual risk score (not just the binary threshold) makes better use of limited capacity. Source: [BOK] Domain VI.D, Data Management and Analytics.",
    "set": 3,
    "qid": "mbb:set-3:d6-046"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A data analytics team building a customer-attrition model includes ZIP code as a raw categorical predictor with over 400 distinct values, most represented by only 1-2 customers each. What data management/modeling concern does this raise?",
    "options": [
      "No concern; more granular categorical detail always improves model performance without any downside",
      "The correct fix is to remove all categorical variables from the model entirely, using only continuous predictors",
      "ZIP code should never be used as a predictor variable under any circumstances",
      "A high-cardinality categorical variable with very sparse representation per category (400+ ZIP codes, most with only 1-2 observations) risks overfitting, since the model may effectively memorize individual customers rather than learning generalizable patterns; the team should consider aggregating ZIP codes into broader regions or using a different encoding approach that mitigates this sparsity"
    ],
    "answer": 3,
    "why": "High-cardinality, sparsely-populated categorical variables are a well-known overfitting risk in predictive modeling; aggregation or alternative encoding approaches are standard remedies rather than either using the raw high-cardinality variable unchanged or discarding categorical data entirely. Source: [BOK] Domain VI.D, Data Management and Analytics.",
    "set": 3,
    "qid": "mbb:set-3:d6-047"
  },
  {
    "sub": "mbb-analytics",
    "stem": "An MBB is asked to build an enterprise-wide analytics data lake but discovers no data retention or archival policy exists \u2014 all historical data is kept indefinitely with no lifecycle management. What should the MBB flag as a risk beyond storage cost alone?",
    "options": [
      "There is no risk beyond storage cost; keeping all data indefinitely is always the safest data management approach",
      "Beyond storage cost, indefinite retention without a lifecycle policy raises data governance, privacy/compliance risk (e.g., retaining personal data longer than legally required or intended), and can degrade analytics performance and data quality as increasingly outdated, potentially irrelevant historical data accumulates without curation",
      "The correct fix is to delete all historical data immediately regardless of any ongoing analytical or compliance need for it",
      "Data retention policy is solely an IT concern with no relevance to Six Sigma or MBB-level responsibilities"
    ],
    "answer": 1,
    "why": "Data retention/lifecycle policy touches governance, privacy/compliance risk, and analytical data quality \u2014 not just storage cost \u2014 and is a legitimate MBB-level concern when architecting enterprise analytics capability. Source: [BOK] Domain VI.D, Data Management and Analytics.",
    "set": 3,
    "qid": "mbb:set-3:d6-048"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A quality dashboard reports a single blended 'first pass yield' figure across five product lines with very different baseline complexity and volume. Leadership uses this single figure to evaluate all five lines equally. What data analytics principle from elsewhere in this domain applies directly here?",
    "options": [
      "The blended figure should be replaced with a single number representing only the best-performing line",
      "Stratification is only relevant to statistical process control charts, not to dashboard design generally",
      "Blending diverse groups into a single aggregate figure is always the most useful and complete way to report performance",
      "This repeats the stratification principle established elsewhere in this bank (e.g., seasonal control charts, blended-vs-stratified satisfaction reporting): blending fundamentally different product lines into one aggregate figure can mask which specific lines are actually driving strong or weak performance, and the dashboard should be redesigned to report stratified, line-level figures alongside (or instead of) the single blended number"
    ],
    "answer": 3,
    "why": "This is a direct cross-domain application of the stratification principle (previously established for seasonal control charts and blended-vs-stratified satisfaction reporting) to dashboard/analytics design \u2014 aggregating fundamentally different groups obscures the line-level detail leadership actually needs to act on. Source: [BOK] Domain VI.D, Data Management and Analytics.",
    "set": 3,
    "qid": "mbb:set-3:d6-049"
  },
  {
    "sub": "mbb-analytics",
    "stem": "An MBB reviewing a data analytics team's SQL-based reporting pipeline discovers a join between two tables uses a non-unique key, silently creating duplicate rows in the output whenever a match isn't perfectly one-to-one. What data quality practice would have caught this before it affected downstream reports?",
    "options": [
      "The correct practice is to never use SQL joins in any analytics pipeline",
      "A row-count validation check (comparing expected versus actual row counts before and after each join/transformation step in the pipeline) is a standard data quality practice that would have flagged the unexpected row-count inflation from the non-unique key join before it silently propagated into downstream reports",
      "No practice could catch this type of error; duplicate-generating joins are undetectable in principle",
      "This type of error can only be caught through manual, row-by-row visual inspection of the entire dataset"
    ],
    "answer": 1,
    "why": "Row-count validation checks at each pipeline transformation step are a standard, practical data quality practice specifically designed to catch exactly this kind of silent duplication from a non-unique join key. Source: [BOK] Domain VI.D, Data Management and Analytics.",
    "set": 3,
    "qid": "mbb:set-3:d6-050"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A company's enterprise analytics maturity assessment finds strong data visualization capability but no defined process for acting on dashboard insights \u2014 dashboards are viewed but rarely drive documented decisions or follow-up actions. What analytics maturity gap does this reflect?",
    "options": [
      "No gap exists; a strong dashboard alone constitutes complete analytics maturity",
      "This gap can only be addressed by hiring more data scientists, regardless of the actual root cause",
      "This reflects a gap between descriptive analytics capability (visualizing what happened) and an actionable decision-and-accountability process (who reviews the dashboard, what triggers action, and how follow-through is tracked) \u2014 visualization sophistication alone doesn't guarantee the insights actually drive organizational action",
      "The correct fix is to eliminate the dashboards entirely, since they aren't producing action"
    ],
    "answer": 2,
    "why": "Strong visualization/descriptive capability without a paired decision-and-accountability process is a well-documented analytics maturity gap \u2014 the fix is process design (ownership, triggers, follow-through tracking), not necessarily more visualization tooling or headcount. Source: [BOK] Domain VI.D, Data Management and Analytics.",
    "set": 3,
    "qid": "mbb:set-3:d6-051"
  },
  {
    "sub": "mbb-analytics",
    "stem": "An MBB is designing a metric-ownership framework for a new analytics platform and must decide how to handle a metric that several departments both need but calculate slightly differently for their own purposes. What is the most defensible approach?",
    "options": [
      "Allow unlimited, unlabeled local variation with no canonical version at all, recreating the exact problem being solved",
      "Assign the decision randomly to whichever department requests it first, regardless of actual enterprise reporting needs",
      "Force every department to abandon their own calculation entirely, adopting a single method with no accommodation for legitimate local needs",
      "Establish one canonical, enterprise-standard version of the metric for cross-departmental reporting and comparison, while allowing departments to maintain supplementary local variants for their own internal purposes \u2014 clearly labeled and distinguished from the canonical version to avoid the confusion documented in the original enterprise data-consistency scenario"
    ],
    "answer": 3,
    "why": "A canonical enterprise version alongside clearly-labeled local variants balances legitimate departmental needs against the enterprise-consistency requirement established earlier in this domain \u2014 avoiding both forced uniformity that ignores real local needs and unlabeled variation that recreates the original inconsistency problem. Source: [BOK] Domain VI.D, Data Management and Analytics.",
    "set": 3,
    "qid": "mbb:set-3:d6-052"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS team building a house of quality (QFD) for a new medical device translates customer requirements into technical specifications, but skips the 'roof' (technical correlation) section entirely to save time. What risk does this shortcut introduce?",
    "options": [
      "The roof section identifies correlations (positive or negative trade-offs) between technical specifications; skipping it risks the team later discovering an unaddressed trade-off (e.g., improving one spec inadvertently worsens another) only after design decisions are already locked in, rather than proactively identifying and managing that trade-off during planning",
      "Skipping the roof section makes the entire house of quality analysis invalid and unusable",
      "The roof section is only relevant for software products, never for physical medical devices",
      "No risk; the roof section is purely decorative and carries no analytical value"
    ],
    "answer": 0,
    "why": "The QFD roof specifically surfaces technical trade-offs between specifications; skipping it risks discovering conflicting requirements late in design rather than proactively planning around them. Source: [BOK] Domain VI.E, DFSS.",
    "chart": {"type": "house-of-quality"},
    "set": 3,
    "qid": "mbb:set-3:d6-053"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS team develops a critical-to-quality (CTQ) tree for a new financial services product, but stops after the first level, translating only broad customer needs ('fast service') without decomposing further into measurable, specific requirements. What is the consequence of stopping at this level?",
    "options": [
      "Stopping at broad, unmeasurable statements like 'fast service' leaves the design team without the specific, measurable targets (e.g., 'account opening completed within 90 seconds') needed to actually design, verify, and validate against; the CTQ tree should be decomposed further into specific, measurable requirements before design work proceeds",
      "The correct fix is to skip CTQ tree development entirely and rely solely on engineering judgment",
      "No consequence; broad customer needs are always sufficient for driving detailed design specifications",
      "CTQ trees should never be used for financial services products, only for physical/manufactured products"
    ],
    "answer": 0,
    "why": "A CTQ tree's value comes from decomposing broad customer needs into specific, measurable requirements that design and verification can actually be checked against \u2014 stopping at the broad-statement level defeats this purpose. Source: [BOK] Domain VI.E, DFSS.",
    "set": 3,
    "qid": "mbb:set-3:d6-054"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS project for a new consumer product completes the Design phase but has no formal Design Verification Plan (DVP) specifying which tests confirm which CTQs before moving to the Verify phase. What risk does this create?",
    "options": [
      "No risk; verification can always be figured out informally once the product is built",
      "The correct fix is to verify only the CTQs that are easiest to test, regardless of their importance",
      "A DVP is only required for DFSS projects in regulated industries, never for consumer products",
      "Without a formal DVP linking specific tests to specific CTQs, the team risks either failing to verify some critical requirements at all, or verifying them inconsistently/incompletely \u2014 a DVP is the standard mechanism ensuring every CTQ has a defined, traceable verification method before the design is considered complete"
    ],
    "answer": 3,
    "why": "A formal Design Verification Plan traceably links each CTQ to a specific verification method \u2014 without it, verification risks being incomplete or inconsistent, undermining confidence that the design actually meets its critical requirements. Source: [BOK] Domain VI.E, DFSS.",
    "set": 3,
    "qid": "mbb:set-3:d6-055"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS team uses Pugh matrix analysis to compare four candidate design concepts against a baseline, using weighted criteria. Concept C scores highest overall but performs worse than baseline on one safety-related criterion. What should the MBB advise regarding this result?",
    "options": [
      "Automatically reject Concept C regardless of its otherwise strong performance across all other criteria",
      "Automatically select Concept C since it has the highest overall weighted score, regardless of the individual criterion pattern",
      "Ignore the Pugh matrix results entirely and select a design based on cost alone",
      "Flag the safety-related criterion for specific scrutiny before finalizing the decision \u2014 a strong aggregate score can mask a concerning weakness on a single high-stakes criterion, and the team should evaluate whether Concept C's safety shortfall is acceptable or requires design modification before proceeding, rather than letting the aggregate score alone drive the decision"
    ],
    "answer": 3,
    "why": "This is a direct parallel to the weighted-decision-matrix caution established elsewhere in this bank (Domain I): an aggregate score is a decision input, not a decision-maker, and a genuinely high-stakes individual criterion (like safety) deserves specific scrutiny even when the overall weighted score is favorable. Source: [BOK] Domain VI.E, DFSS.",
    "chart": {"type": "data-table", "columns": ["Criterion (weight)", "Baseline", "Concept C"], "rows": [["Cost (25%)", "0", "+2"], ["Performance (30%)", "0", "+2"], ["Manufacturability (20%)", "0", "+1"], ["Safety (25%)", "0", "\u22121"]]},
    "set": 3,
    "qid": "mbb:set-3:d6-056"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS team is deciding whether a new product's design should undergo full Design of Experiments optimization or simply meet minimum requirements with a single, un-optimized design point, given a tight development timeline. What consideration should drive this decision?",
    "options": [
      "The decision should be based solely on which approach the assigned engineer personally prefers",
      "Full DOE optimization should always be skipped regardless of the product's failure-cost profile, purely to save time",
      "Full DOE optimization should always be performed regardless of the product's risk profile or timeline constraints",
      "The decision should weigh the cost of a design failure or suboptimal robustness against the time cost of full optimization \u2014 for a high-consequence or high-volume product where failure costs are severe, DOE-based robust design investment is usually justified even under time pressure; for a low-stakes, low-volume product, a faster minimum-viable approach may be more appropriate"
    ],
    "answer": 3,
    "why": "This mirrors the earlier prosthetics/regulatory-tolerance DFSS reasoning: the appropriate level of design rigor should scale with the failure-cost and volume profile of the product, not be a fixed default in either direction regardless of context. Source: [BOK] Domain VI.E, DFSS.",
    "set": 3,
    "qid": "mbb:set-3:d6-057"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS team building a fault tree analysis (FTA) for a new aircraft component identifies a top-level failure event connected to two contributing basic events through an AND gate. What does the AND gate indicate about how these two basic events combine to cause the top event?",
    "options": [
      "AND and OR gates are functionally identical in fault tree analysis with no meaningful difference",
      "Either basic event alone is sufficient to cause the top-level failure",
      "Both basic events must occur simultaneously for the top-level failure to occur \u2014 an AND gate requires all its input events to be present, as distinct from an OR gate, which requires only one of its inputs to trigger the output event",
      "An AND gate indicates the two basic events are mutually exclusive and can never occur together"
    ],
    "answer": 2,
    "why": "This tests basic FTA logic-gate literacy: an AND gate requires all input events to occur for the output to trigger, while an OR gate requires only one \u2014 a foundational distinction for correctly reading and constructing fault trees. Source: [BOK] Domain VI.E, DFSS.",
    "chart": {"type": "data-table", "columns": ["Gate type", "Requirement for output event", "Example"], "rows": [["AND", "All input events must occur", "Backup power fails AND primary power fails"], ["OR", "Any one input event is sufficient", "Sensor A fails OR Sensor B fails"]]},
    "set": 3,
    "qid": "mbb:set-3:d6-058"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS team's robust design study for a new sensor housing tests performance across a range of expected environmental noise factors (temperature, humidity, vibration) rather than only at nominal conditions. What is the core purpose of this approach, distinct from simply testing at nominal conditions?",
    "options": [
      "Robust design specifically aims to identify a design/parameter setting that performs consistently well across the expected range of real-world noise/variation, rather than one that only performs well under ideal, nominal laboratory conditions \u2014 directly addressing the gap between lab performance and real-world reliability",
      "Robust design and nominal-condition testing always produce identical results regardless of the noise factors involved",
      "Testing across noise factors always produces worse results than testing at nominal conditions and should be avoided",
      "Testing across noise factors is purely a regulatory formality with no actual design value"
    ],
    "answer": 0,
    "why": "Robust design (a core DFSS/Taguchi concept) specifically targets performance consistency across real-world noise/variation, not just nominal-condition performance \u2014 the entire point is closing the gap between idealized lab testing and actual field reliability. Source: [BOK] Domain VI.E, DFSS.",
    "set": 3,
    "qid": "mbb:set-3:d6-059"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS scorecard for a new product tracks predicted Cpk for each CTQ based on early design-stage tolerance analysis, before any physical prototypes exist. What is the primary value and primary limitation of this predicted-Cpk approach?",
    "options": [
      "Predicted Cpk from tolerance analysis is always exactly as reliable as Cpk measured from actual production data, with no meaningful limitation",
      "The value is identifying likely capability problems early, when design changes are still cheap to make, rather than after tooling and production are already committed; the limitation is that predicted Cpk depends on the accuracy of the underlying tolerance/variation assumptions, which may not fully reflect real-world manufacturing variation once production begins",
      "Predicted Cpk has no value at all and should never be calculated before physical prototypes exist",
      "The only limitation of predicted Cpk is that it takes too long to calculate, not that its accuracy is inherently uncertain"
    ],
    "answer": 1,
    "why": "Early predicted-Cpk analysis is valuable specifically because it's cheap to act on design issues before production commitment, but its accuracy is inherently bounded by the quality of the underlying tolerance/variation assumptions \u2014 a genuine trade-off, not a flaw to be dismissed or an infallible substitute for production data. Source: [BOK] Domain VI.E, DFSS.",
    "set": 3,
    "qid": "mbb:set-3:d6-060"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS team is deciding how to allocate tolerance budgets across five components that together determine a critical assembly dimension. One component is far cheaper to manufacture to tight tolerance than the others. What tolerance allocation approach makes the best use of this asymmetry?",
    "options": [
      "Tolerance allocation should be based solely on which component was designed first, regardless of manufacturing cost",
      "Allocate all tolerance budget to the single cheapest component, ignoring the other four components' contribution to the assembly dimension entirely",
      "Allocate equal tolerance to all five components regardless of their differing manufacturing cost structures",
      "Allocate tighter tolerance to the cheap-to-tighten component and looser tolerance to the more expensive-to-tighten components, using a cost-based (rather than equal-split) tolerance allocation approach, while still meeting the overall assembly tolerance requirement \u2014 minimizing total manufacturing cost for the required overall precision"
    ],
    "answer": 3,
    "why": "Cost-based (rather than equal-split) tolerance allocation is the standard, more sophisticated approach in tolerance design \u2014 concentrating tighter tolerance where it's cheapest to achieve minimizes total cost while still meeting the overall assembly requirement. Source: [BOK] Domain VI.E, DFSS.",
    "chart": {"type": "data-table", "columns": ["Component", "Cost to tighten tolerance", "Allocated tolerance"], "rows": [["1 (cheap)", "Low", "\u00b10.02 mm"], ["2", "Medium", "\u00b10.05 mm"], ["3", "High", "\u00b10.10 mm"], ["4", "High", "\u00b10.10 mm"], ["5", "Medium", "\u00b10.05 mm"]]},
    "set": 3,
    "qid": "mbb:set-3:d6-061"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS scorecard shows a product's predicted reliability (based on component-level failure rate data) exceeds the target, but the team has not validated this prediction against any accelerated life testing of the actual assembled product. What should the MBB recommend before the team declares the reliability target met?",
    "options": [
      "Reject the reliability prediction entirely without any further testing, regardless of its methodology",
      "Accept the predicted reliability figure as final, since component-level failure rate data is always sufficient on its own",
      "Recommend accelerated life testing (or another validation method) on the actual assembled product before declaring the target met, since component-level predictions may not capture assembly-level interactions, unanticipated failure modes, or real-world stress combinations that only emerge in an integrated, tested product",
      "Recommend skipping reliability validation entirely for any product with a strong predicted figure"
    ],
    "answer": 2,
    "why": "Component-level reliability predictions can miss assembly-level interactions and real-world stress combinations; validating the prediction against actual testing on the integrated product (e.g., accelerated life testing) is the standard practice before declaring a reliability target genuinely met. Source: [BOK] Domain VI.E, DFSS.",
    "set": 3,
    "qid": "mbb:set-3:d6-062"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS project charter for a next-generation product states the goal as 'make the product better than the current one,' with no specific, measurable target. What DFSS principle from elsewhere in this bank does this violate?",
    "options": [
      "This repeats the vague-strategic-objective problem established elsewhere (Domain I): an unmeasurable goal statement cannot meaningfully drive specific CTQ targets, design trade-off decisions, or verification criteria \u2014 the charter should be revised to state specific, measurable targets (e.g., '20% weight reduction while maintaining current strength rating') before design work proceeds",
      "DFSS project charters should never include any goal statement at all, only a list of CTQs",
      "No principle is violated; a general directional goal is always sufficient for DFSS project charters",
      "This vague goal statement is acceptable as long as the assigned engineer personally understands what 'better' means"
    ],
    "answer": 0,
    "why": "This is a direct cross-domain application of the measurable-objective principle established for strategic plans (Domain I) to DFSS project chartering specifically \u2014 an unmeasurable goal cannot meaningfully drive the specific CTQ targets and trade-off decisions design work requires. Source: [BOK] Domain VI.E, DFSS.",
    "set": 3,
    "qid": "mbb:set-3:d6-063"
  },
  {
    "sub": "mbb-analytics",
    "stem": "An MBB is coaching a DFSS team through their final design review, synthesizing lessons from house of quality, CTQ trees, Pugh matrix selection, tolerance design, and reliability validation. What single principle should the MBB emphasize as the thread connecting all these DFSS tools?",
    "options": [
      "Only the final reliability validation step matters; all earlier tools are optional formalities",
      "The tools should be applied in a random order depending on team preference, since sequence has no bearing on outcome",
      "Each tool progressively translates and verifies the connection from customer need to final, validated design \u2014 the house of quality translates needs into specs, the CTQ tree decomposes specs into measurable targets, Pugh matrix selects among design concepts against those targets, tolerance design allocates precision to meet them cost-effectively, and reliability validation confirms the design actually delivers on them under real-world conditions \u2014 a design robustness chain from customer need through validated delivery",
      "Each DFSS tool operates in complete isolation with no meaningful connection to the others"
    ],
    "answer": 2,
    "why": "This capstone item requires synthesizing the DFSS toolchain into a single coherent narrative: each tool serves a specific, sequential purpose in translating and verifying the connection from customer need through to a validated, robust design \u2014 genuinely MBB-level integrative understanding of the DFSS methodology as a whole. Source: [BOK] Domain VI.E, DFSS.",
    "set": 3,
    "qid": "mbb:set-3:d6-064"
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS team building a new software-based diagnostic tool adapts the traditional house of quality and CTQ tree tools (originally developed for physical products) to a digital service context. A skeptical engineer argues 'these tools only work for hardware.' How should the MBB respond?",
    "options": [
      "Agree completely; DFSS tools are exclusively applicable to physical, manufactured products",
      "Recommend abandoning DFSS entirely for this project in favor of an entirely ad hoc design approach",
      "Explain that the underlying logic of these tools (translating customer needs into measurable, verifiable requirements) applies equally to software/digital products, with adapted specifics (e.g., CTQs might include response time or error rate rather than physical dimensions) \u2014 the tools' core value is methodological, not tied to physical manufacturing specifically",
      "Insist the team build a physical prototype first before any digital design work can begin"
    ],
    "answer": 2,
    "why": "DFSS tools' core translation logic (customer need \u2192 measurable requirement \u2192 verified design) is methodology-general, not physical-product-specific \u2014 the same adaptation principle already established for DMAIC/service-industry contexts applies equally to DFSS tools in a software/digital context. Source: [BOK] Domain VI.E, DFSS.",
    "set": 3,
    "qid": "mbb:set-3:d6-065"
  },
  ];
})(window);