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
    "stem": "A B2B laundry service assigns account teams responsibility for hospital and hotel service agreements, but all accounts share the same washing process. Account teams can change delivery arrangements; a central process owner controls washing standards and equipment. How should the MBB assign improvement ownership without creating conflicting process changes?",
    "options": [
      "Assign every project to the central washing owner and let account teams advise after solutions are selected, because shared equipment makes customer-specific delivery authority unnecessary.",
      "Let account teams own customer-specific improvements and the central process owner own shared-process changes, with explicit interface decisions, common standards and coordinated priorities.",
      "Give each account team independent authority to change shared washing standards and equipment, while using quarterly reporting to reconcile conflicting local changes after implementation.",
      "Allocate Belts to accounts in proportion to revenue and let the highest-revenue account approve all shared-process changes, regardless of obligations to the other accounts."
    ],
    "answer": 1,
    "why": "The account and process owners have different, explicitly stated authority. Account-level ownership should preserve customer responsiveness, while changes to the common washing process require shared standards and coordinated approval. A hybrid arrangement is defensible because it connects these rights rather than assuming that either complete centralization or independent local control will fit every decision. Source alignment: ASQ CMBB Body of Knowledge, II.A.1; II.D.4. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d2-063",
    "optionRationales": [
      "This removes account teams from decisions within their own delivery authority and delays customer input.",
      "Correct. It preserves account accountability while preventing incompatible changes to the common process.",
      "Independent changes to shared equipment can conflict; retrospective reporting is not prior coordination.",
      "Revenue ranking does not grant authority to override other accounts' requirements or process controls."
    ],
    "distractors": [
      "This removes account teams from decisions within their own delivery authority and delays customer input.",
      "Correct. It preserves account accountability while preventing incompatible changes to the common process.",
      "Independent changes to shared equipment can conflict; retrospective reporting is not prior coordination.",
      "Revenue ranking does not grant authority to override other accounts' requirements or process controls."
    ],
    "trap": "Align ownership with the decision being made. Customer-account accountability and shared-process authority must both be explicit; the organization chart alone does not settle their interfaces.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.A.1; II.D.4"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "Scientists at a veterinary diagnostics laboratory object to an MBB's proposal to replace their validated analytical models with a standard introductory Six Sigma toolkit. They support reducing specimen turnaround time but question whether the proposed methods address the laboratory's data structure. What response best combines technical rigor with deployment leadership?",
    "options": [
      "Adopt the introductory toolkit for every analysis to ensure standardization, permitting specialist models only after the first project has been completed and compared with a second project.",
      "Jointly evaluate the data, assumptions and decision needs; retain validated specialist methods where fit for purpose, and use DMAIC to structure the improvement work and its controls.",
      "Exempt the scientists from common problem definition, validation and control requirements because their qualifications make a shared improvement structure unnecessary for laboratory projects.",
      "Resolve the objection through an executive mandate before discussing method fit, treating the disagreement as a commitment problem rather than a potentially legitimate technical concern."
    ],
    "answer": 1,
    "why": "The objection concerns a specific mismatch between proposed methods and the data, not a demonstrated lack of statistical knowledge. DMAIC does not require replacing a suitable validated model with an elementary technique. Joint assessment should determine fitness for purpose while retaining shared objectives, evidence review and sustainment controls. Advanced methods are not automatically superior merely because they are more complex. Source alignment: ASQ CMBB Body of Knowledge, II.C.1; II.C.2; II.D.3. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d2-066",
    "optionRationales": [
      "Uniformity does not justify using a method with unsuitable assumptions for the current decision.",
      "Correct. It tests method suitability and uses the scientists' expertise within a common improvement process.",
      "Technical qualifications do not remove the need for shared goals, validation or sustainment controls.",
      "Mandating acceptance before addressing a substantive technical concern confuses compliance with method validity."
    ],
    "distractors": [
      "Uniformity does not justify using a method with unsuitable assumptions for the current decision.",
      "Correct. It tests method suitability and uses the scientists' expertise within a common improvement process.",
      "Technical qualifications do not remove the need for shared goals, validation or sustainment controls.",
      "Mandating acceptance before addressing a substantive technical concern confuses compliance with method validity."
    ],
    "trap": "Evaluate the actual methodological objection rather than attributing resistance to a professional group. Use the simplest adequate method, not automatically the simplest or most complex available method.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.C.1; II.C.2; II.D.3"
      },
      {
        "title": "ASQ: DMAIC",
        "url": "https://asq.org/quality-resources/dmaic",
        "locator": "What are the DMAIC phases?"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "An urgent-care patient-flow project requires clinical protocol decisions from a clinical director and scheduling-system decisions from an operations director. Neither can authorize the other's changes, and no available single sponsor has authority over both. Both directors support the objective, but their priorities can conflict. Which sponsorship arrangement best closes the authority gap?",
    "options": [
      "Appoint only the operations director as sponsor and classify clinical protocol decisions as project-team recommendations, so one reporting line replaces the need for clinical approval.",
      "Appoint both directors as sponsors but leave approval boundaries and disagreements informal, assuming shared support for patient flow will prevent conflicting instructions during implementation.",
      "Use both directors as sponsors with documented approval boundaries, a named coordinating lead and an agreed escalation route, so cross-domain decisions have authority and clear accountability.",
      "Assign the Black Belt final approval over both domains and ask the directors to provide technical advice, treating responsibility for project delivery as sufficient authority over their resources."
    ],
    "answer": 2,
    "why": "Co-sponsorship addresses the two separate authority domains in this stated case, but only with explicit responsibilities and a way to resolve disputes. It is not a universal rule that cross-functional projects require two sponsors: a sufficiently empowered single sponsor could work in another case. The Black Belt's delivery role does not confer clinical or operational approval authority. Source alignment: ASQ CMBB Body of Knowledge, II.B.1; II.B.2; II.C.3. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d2-070",
    "optionRationales": [
      "An operations reporting line cannot remove the clinical approval right explicitly required by the case.",
      "Shared objectives do not resolve conflicting priorities without decision boundaries and escalation.",
      "Correct. The arrangement covers both authority domains and prevents ambiguous joint accountability.",
      "Responsibility for analysis and delivery does not automatically grant authority over either director's domain."
    ],
    "distractors": [
      "An operations reporting line cannot remove the clinical approval right explicitly required by the case.",
      "Shared objectives do not resolve conflicting priorities without decision boundaries and escalation.",
      "Correct. The arrangement covers both authority domains and prevents ambiguous joint accountability.",
      "Responsibility for analysis and delivery does not automatically grant authority over either director's domain."
    ],
    "trap": "Choose governance that covers actual decision rights. Multiple sponsors need clear accountability and arbitration; they are not inherently better than one adequately empowered sponsor.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.B.1; II.B.2; II.C.3"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A plant manager attributes low participation in a packaging improvement project to employees being inherently resistant to change. The same employees engaged positively in six major changes during the preceding year. No interviews or workload assessment have been conducted for the new project. What is the MBB's most defensible next step?",
    "options": [
      "Treat the six earlier successes as proof that current resistance cannot exist, and launch the new project unchanged while reporting that the manager's concern is statistically disproven.",
      "Conclude that the six changes caused change fatigue and suspend the project, without checking its specific risks, employees' concerns or their remaining capacity to participate.",
      "Require refresher change-management training for all employees before reviewing the project, treating the manager's description as an established diagnosis of their attitude.",
      "Investigate project-specific concerns, participation conditions and cumulative change workload, using earlier successes as context rather than proof of either a fixed trait or a single alternative cause."
    ],
    "answer": 3,
    "why": "The history weakens an unsupported fixed-trait explanation but does not identify the present cause. Employees may have concerns about this change, capacity constraints, cumulative fatigue or other barriers. Interviews and workload evidence are needed before selecting an intervention. Six successful changes are contextual evidence, not a statistical test or proof that further change must be welcomed. Source alignment: ASQ CMBB Body of Knowledge, II.C.1; II.D.3. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d2-071",
    "optionRationales": [
      "Past engagement does not disprove current concerns, and no inferential test has been performed.",
      "Cumulative fatigue is plausible but not established by the count of previous changes alone.",
      "A training prescription assumes the attitude diagnosis before investigating its evidence.",
      "Correct. It tests competing explanations rather than substituting a new unsupported label."
    ],
    "distractors": [
      "Past engagement does not disprove current concerns, and no inferential test has been performed.",
      "Cumulative fatigue is plausible but not established by the count of previous changes alone.",
      "A training prescription assumes the attitude diagnosis before investigating its evidence.",
      "Correct. It tests competing explanations rather than substituting a new unsupported label."
    ],
    "trap": "Evidence against one explanation does not prove another. Prior change success can coexist with legitimate new concerns or accumulated workload and fatigue.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.C.1; II.D.3"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "Ambulance crews say they withhold details during protocol-deviation reviews because every deviation is routed directly to individual disciplinary review, without examining dispatch information or equipment access. Mandatory incident reporting and urgent safety escalation must continue. Which redesign best improves learning while preserving justified accountability?",
    "options": [
      "Offer absolute anonymity and immunity for every deviation, including reckless conduct, so crews can discuss events without any possibility of an individual accountability decision.",
      "Add prompt, facilitated systems-focused debriefs, clear reporting and escalation routes, and a fair behavior-based accountability process; communicate confidentiality limits and track corrective actions.",
      "Collect identifiable written statements only after the disciplinary outcome, so the decision about individual fault is finalized before operational contributors are considered.",
      "Ask crews to resolve deviations informally within each shift and submit only aggregate trends, replacing incident-level escalation with a monthly learning report."
    ],
    "answer": 1,
    "why": "A learning-oriented review examines system conditions without assuming that every deviation is misconduct. It also preserves required reporting, urgent escalation and fair behavior-based accountability. Confidentiality must not be promised beyond what the process can provide. Facilitated debriefs and tracked corrective actions make this an operational learning-system design, not merely a label for a blame-free culture. Source alignment: ASQ CMBB Body of Knowledge, II.D.6; II.E.2. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d2-072",
    "optionRationales": [
      "Absolute immunity removes appropriate accountability; anonymity may also be impossible to guarantee.",
      "Correct. It combines event-level learning, action follow-through and explicit accountability safeguards.",
      "Deferring systems evidence until after discipline risks a premature and biased judgment.",
      "Aggregate monthly trends cannot replace required incident reporting or urgent safety escalation."
    ],
    "distractors": [
      "Absolute immunity removes appropriate accountability; anonymity may also be impossible to guarantee.",
      "Correct. It combines event-level learning, action follow-through and explicit accountability safeguards.",
      "Deferring systems evidence until after discipline risks a premature and biased judgment.",
      "Aggregate monthly trends cannot replace required incident reporting or urgent safety escalation."
    ],
    "trap": "A learning system needs usable reporting, timely systems review and action closure. Just culture does not mean ignoring reckless conduct or promising confidentiality beyond actual limits.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.D.6; II.E.2"
      },
      {
        "title": "AHRQ PSNet: Culture of Safety",
        "url": "https://psnet.ahrq.gov/primer/culture-safety",
        "locator": "Measuring and Achieving a Culture of Safety: just culture"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A ceramics manufacturer sells through distributors and online across several language groups. Its feedback team has limited response capacity, and some customers want to submit anonymous feedback. Repeat buyers dominate the current contact list. Which design best improves coverage and follow-through without making commitments the system cannot meet?",
    "options": [
      "Use the repeat-buyer email list with translated questions and promise an individual resolution to every submission, including anonymous messages with no return contact channel.",
      "Open separate feedback channels for every distributor but leave eligibility rules, prioritization and action ownership to each channel, assuming broad access ensures representative evidence.",
      "Replace external feedback with inspection results and collect customer comments annually, because the inspection system already measures all customer experience dimensions consistently.",
      "Include lapsed and underrepresented customers, test language accessibility and comparability, triage by risk, assign action owners and response targets, and publish aggregate follow-up for anonymous submissions."
    ],
    "answer": 3,
    "why": "Feedback coverage should extend beyond surviving repeat buyers, and translation alone does not establish comparable interpretation or response scales. Finite capacity requires prioritization and realistic service targets. Contactable submissions can receive individual acknowledgment; anonymous submissions without a return channel need another closure route, such as aggregate action updates. No design guarantees complete representativeness merely by offering many channels. Source alignment: ASQ CMBB Body of Knowledge, II.E.1; II.E.2. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d2-073",
    "optionRationales": [
      "It retains survivor selection and promises a direct response where no contact route exists.",
      "More channels do not assure comparable definitions, representative coverage or action ownership.",
      "Inspection measures cannot fully substitute for customer experience and loss-of-customer feedback.",
      "Correct. It addresses selection, language fit, capacity and credible closure for different submission types."
    ],
    "distractors": [
      "It retains survivor selection and promises a direct response where no contact route exists.",
      "More channels do not assure comparable definitions, representative coverage or action ownership.",
      "Inspection measures cannot fully substitute for customer experience and loss-of-customer feedback.",
      "Correct. It addresses selection, language fit, capacity and credible closure for different submission types."
    ],
    "trap": "Separate acknowledgment, investigation and resolution. A promise to respond individually to every anonymous submission is not credible without a return channel.",
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
    "stem": "A mobile-phone repair chain is reviewing the current scorecard shown below. Stores differ in repair complexity, arrival volume and staffing. Management wants faster service without increasing repeat repairs. Which redesign best supports comparable, actionable review rather than rewarding throughput at the expense of quality?",
    "options": [
      "Keep daily repair totals as the ranking measure and add a named owner; use the monthly callback count as a tie-breaker without aligning follow-up periods or denominators.",
      "Combine all measures into one weighted score immediately; allow higher throughput to offset any deterioration in repeat repairs, even when customer-quality thresholds are breached.",
      "Pair an effort-aware throughput measure with defined repeat-repair rates, review workload and repair mix, assign accountable owners, and use timely reviews with explicit quality safeguards.",
      "Rank stores by callbacks per day and retain raw repair totals only for information; treat differences in repair mix and the number of completed repairs as irrelevant to quality comparisons."
    ],
    "answer": 2,
    "why": "Raw throughput confounds staffing, arrivals and repair difficulty. Callback counts also require a defined eligible repair population and consistent follow-up window before comparisons are meaningful. Pairing suitable productivity and quality measures, examining case mix and assigning owners supports action without treating an adjustment as proof of causation. Quality safeguards should not disappear inside a compensating weighted average. Source alignment: ASQ CMBB Body of Knowledge, II.F.2; II.E.1. Case conclusions follow from the stated assumptions.",
    "chart": {
      "type": "data-table",
      "title": "Current scorecard to be evaluated",
      "columns": [
        "Measure",
        "Current definition / context",
        "Review / accountability"
      ],
      "rows": [
        [
          "Repairs completed",
          "Raw daily count; stores differ in hours, arrivals and repair mix",
          "Annual ranking; no action owner"
        ],
        [
          "Repeat repairs",
          "Raw callback count; follow-up windows vary",
          "Monthly count; no shared denominator"
        ],
        [
          "Service mix",
          "No trigger for revising measures when repair mix changes",
          "Owner not assigned"
        ]
      ]
    },
    "set": 3,
    "qid": "mbb:set-3:d2-074",
    "optionRationales": [
      "Naming an owner does not repair non-comparable callback counts or unadjusted workload differences.",
      "An aggregate score can hide unacceptable quality deterioration behind a throughput gain.",
      "Correct. It addresses comparability, counter-metrics, ownership and response timing together.",
      "Callbacks per day still lack the relevant repair denominator and comparable follow-up exposure."
    ],
    "distractors": [
      "Naming an owner does not repair non-comparable callback counts or unadjusted workload differences.",
      "An aggregate score can hide unacceptable quality deterioration behind a throughput gain.",
      "Correct. It addresses comparability, counter-metrics, ownership and response timing together.",
      "Callbacks per day still lack the relevant repair denominator and comparable follow-up exposure."
    ],
    "trap": "A common dashboard does not guarantee comparable measures. Align operational definitions, eligible denominators and follow-up windows, and preserve quality safeguards alongside productivity.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.F.2; II.E.1"
      }
    ]
  },
  {
    "sub": "mbb-org",
    "stem": "A credit union has conflicting matrix assignments, inconsistent sponsor follow-through, skeptical experienced loan officers, sales-only incentives despite a member-first value, uniformly positive identifiable member surveys, and observed shortcuts under a loans-per-week target. No causal links among these findings have been established. Which initial recovery plan is most defensible?",
    "options": [
      "Contain harmful shortcuts, secure accountable sponsorship and priority decisions, and coordinate an evidence-based review of incentives, feedback, paired metrics and model fit with frontline participation.",
      "Treat sales incentives as the proven cause of every finding and complete their redesign before addressing harmful shortcuts, sponsor decisions or the validity of the member-survey evidence.",
      "Replace loans per week with a composite score and publish revised rankings, relying on the better metric to resolve reporting conflicts, survey candor and skepticism about statistical models.",
      "Delay leadership and governance involvement until the loan officers endorse statistical models, leaving the existing target and survey mechanism unchanged throughout the engagement exercise."
    ],
    "answer": 0,
    "why": "Observed harmful shortcuts warrant containment, while sponsorship and decision rights enable coordinated recovery. The findings do not establish a single root cause or justify delaying governance until an incentive redesign is complete. A positive member survey cannot be explained simply by assuming staff fear: respondent selection, question design, confidentiality and actual member experience need assessment. Involve loan officers in evaluating model fit rather than treating expertise as obstruction. Source alignment: ASQ CMBB Body of Knowledge, II.B.1; II.C.3; II.D.6; II.E.2; II.F.2. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d2-075",
    "optionRationales": [
      "Correct. It prioritizes demonstrated harm and enabling governance while testing possible causes together.",
      "The causal claim is unsupported and the proposed sequence delays immediate harm containment.",
      "A new score alone does not establish authority, trustworthy feedback or appropriate model use.",
      "Frontline involvement matters, but postponing accountable leadership leaves harmful conditions in place."
    ],
    "distractors": [
      "Correct. It prioritizes demonstrated harm and enabling governance while testing possible causes together.",
      "The causal claim is unsupported and the proposed sequence delays immediate harm containment.",
      "A new score alone does not establish authority, trustworthy feedback or appropriate model use.",
      "Frontline involvement matters, but postponing accountable leadership leaves harmful conditions in place."
    ],
    "trap": "Do not infer one root cause from coexisting symptoms or confuse member survey responses with employee reporting. Contain known harm while establishing the authority and evidence needed for coordinated recovery.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "II.B.1; II.C.3; II.D.6; II.E.2; II.F.2"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "At a shipbuilder's Measure-to-Analyze gate, a gauge R&R report is labeled marginal. The team has not defined acceptable measurement error for the intended defect analysis or assessed whether the gauge can distinguish the differences that matter. The Black Belt wants approval solely to recover schedule. What should the MBB do next?",
    "options": [
      "Withhold approval for measurement-dependent conclusions until fitness for the intended use is assessed and documented; improve or replace the method if needed, while allowing explicitly bounded independent work.",
      "Approve unrestricted Analyze work because any marginal gauge R&R result is acceptable for root-cause analysis, reserving measurement validation for final product acceptance decisions.",
      "Require replacement of the gauge immediately because the word marginal always means the instrument is unusable, without considering decision risk, study design or alternatives.",
      "Increase the number of readings and approve the gate on that basis alone, assuming larger samples automatically eliminate bias, operator differences and inadequate resolution."
    ],
    "answer": 0,
    "why": "A marginal label is not an application-specific acceptance decision. Assess the study design, error components, discrimination and consequences of wrong decisions against the intended use. Schedule pressure alone cannot establish adequacy. Measurement-dependent conclusions remain on hold until that assessment supports them; data-independent planning can proceed under explicit limits. More observations can reduce some random error but do not automatically correct bias or resolution problems. Source alignment: ASQ CMBB Body of Knowledge, III.A.1; III.A.2; VI.A. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-001",
    "optionRationales": [
      "Correct. It establishes fit-for-use evidence before authorizing dependent conclusions without an unnecessary universal work stop.",
      "Marginal results are not automatically adequate for every analytical decision.",
      "Immediate replacement is not justified by a label without an application-specific assessment.",
      "Sample size alone does not eliminate systematic error, operator effects or inadequate discrimination."
    ],
    "distractors": [
      "Correct. It establishes fit-for-use evidence before authorizing dependent conclusions without an unnecessary universal work stop.",
      "Marginal results are not automatically adequate for every analytical decision.",
      "Immediate replacement is not justified by a label without an application-specific assessment.",
      "Sample size alone does not eliminate systematic error, operator effects or inadequate discrimination."
    ],
    "trap": "Gauge R&R is evidence about measurement variation, not a universal pass/fail label. Acceptance must match the analysis purpose and decision risk; neither schedule pressure nor a larger sample substitutes for that assessment.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.A.1; III.A.2; VI.A"
      },
      {
        "title": "NIST: Metrological Traceability FAQ",
        "url": "https://www.nist.gov/metrology/metrological-traceability",
        "locator": "5.1.4: Are traceable measurement results fit for purpose?"
      },
      {
        "title": "ASQ: DMAIC",
        "url": "https://asq.org/quality-resources/dmaic",
        "locator": "What are the DMAIC phases?"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A watch manufacturer's annual portfolio board repeatedly discovers product and supplier changes after affected projects have committed their next quarter's resources. Project teams already report weekly delivery status. Which governance change best addresses the delayed allocation decisions without confusing portfolio decisions with routine task monitoring?",
    "options": [
      "Introduce reviews before major resource commitments plus material-change triggers, with the authority to resequence or stop work; adjust the interval using observed decision needs and review cost.",
      "Require daily portfolio re-ranking from every weekly status update, with unchanged decision authority, so frequent reporting alone resolves delayed funding and resource decisions.",
      "Keep the annual allocation decision but add weekly status presentations, without allowing changes to commitments between meetings, to preserve consistency in approved rankings.",
      "Delegate all cross-project resource reallocations to individual project leaders, retaining only an annual summary because each team knows its own delivery risks most accurately."
    ],
    "answer": 0,
    "why": "The gap is the timing and authority of allocation decisions, not simply a shortage of status reports. Reviews should occur before consequential commitments and when material conditions change. A quarterly rhythm may suit the example, but the evidence does not establish a universal optimal interval. Individual teams need portfolio-level arbitration when their resource changes affect other projects. Source alignment: ASQ CMBB Body of Knowledge, III.B.1; III.B.6; III.B.8. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-005",
    "optionRationales": [
      "Correct. It links review timing and decision rights to consequential commitments and changing assumptions.",
      "Daily re-ranking can add noise and effort, and reporting frequency cannot create missing authority.",
      "More presentations without interim decision rights leave the identified allocation delay intact.",
      "Independent reallocations can conflict where projects share constrained resources."
    ],
    "distractors": [
      "Correct. It links review timing and decision rights to consequential commitments and changing assumptions.",
      "Daily re-ranking can add noise and effort, and reporting frequency cannot create missing authority.",
      "More presentations without interim decision rights leave the identified allocation delay intact.",
      "Independent reallocations can conflict where projects share constrained resources."
    ],
    "trap": "Distinguish reporting cadence from decision cadence. A useful portfolio review must be timely enough to change a commitment and have the authority to do so.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.B.1; III.B.6; III.B.8"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "Three of a pharmacy benefit manager's 15 projects require the same vendor claims-system release, as shown below. Their separate risk logs name the dependency, but no one consolidates it or coordinates responses. Which portfolio-level intervention best addresses this shared exposure without assuming the three projects should become one? Network durations are planning estimates in days, not independent risk probabilities.",
    "options": [
      "Require each project to add its own contingency allowance and leave the logs separate, assuming three allowances make the shared vendor event independent across the portfolio.",
      "Link the shared dependency across project logs, name a portfolio owner, assess affected milestones together and agree escalation and contingency responses with the vendor and project leads.",
      "Merge the three projects and sum their stated benefits and contingencies immediately, assuming a common prerequisite also establishes a common scope and eliminates correlated risk.",
      "Retain separate logs and inform executives only after the release is late, because an external dependency cannot be monitored or mitigated before its delivery date."
    ],
    "answer": 1,
    "why": "A single vendor event can affect several projects together. Consolidation should expose this common cause, assign ownership and coordinate assumptions, escalation and contingencies. Project-level logs remain useful inputs, but disconnected logs do not provide the portfolio view. A shared prerequisite does not prove common scope, independent risks, additive contingency needs or inevitable delays to every final completion date; available float and alternatives must be assessed. Source alignment: ASQ CMBB Body of Knowledge, III.B.1; III.B.2; I.F.4. Case conclusions follow from the stated assumptions.",
    "chart": {
      "type": "activity-network",
      "title": "Shared vendor dependency — durations in days",
      "nodes": {
        "Vendor upgrade": {
          "col": 0,
          "row": 1,
          "dur": 90
        },
        "Project A": {
          "col": 1,
          "row": 0,
          "dur": 60
        },
        "Project B": {
          "col": 1,
          "row": 1,
          "dur": 75
        },
        "Project C": {
          "col": 1,
          "row": 2,
          "dur": 45
        }
      },
      "edges": [
        [
          "Vendor upgrade",
          "Project A"
        ],
        [
          "Vendor upgrade",
          "Project B"
        ],
        [
          "Vendor upgrade",
          "Project C"
        ]
      ],
      "altText": "One vendor upgrade, estimated at 90 days, precedes Project A (60 days), Project B (75 days) and Project C (45 days). These are shared dependency links, not independent risk probabilities."
    },
    "set": 3,
    "qid": "mbb:set-3:d3-008",
    "optionRationales": [
      "Separate allowances do not make one common event independent or reveal overlapping contingency needs.",
      "Correct. It provides connected visibility and accountable coordination while retaining distinct project scopes.",
      "A common dependency does not justify merging otherwise distinct objectives or double-counting benefits.",
      "External delivery can still be monitored and its potential impacts prepared for before a delay occurs."
    ],
    "distractors": [
      "Separate allowances do not make one common event independent or reveal overlapping contingency needs.",
      "Correct. It provides connected visibility and accountable coordination while retaining distinct project scopes.",
      "A common dependency does not justify merging otherwise distinct objectives or double-counting benefits.",
      "External delivery can still be monitored and its potential impacts prepared for before a delay occurs."
    ],
    "trap": "Shared dependencies create correlated exposure. Consolidate the dependency and response, not automatically the project scopes; assess float and alternatives before predicting completion delays.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.B.1; III.B.2; I.F.4"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A zoo has four Black Belts assigned nine projects as shown below. For this planning example only, each project requires 10 Belt-hours per week, each Belt has 20 available hours per week after other duties, and work is transferable without skill restrictions. At the 20-hour baseline, which interpretation should guide intake of another project? The slider explores scenarios; it does not change the question's baseline.",
    "options": [
      "Total demand is 90 hours against 80 available, but moving one project to Belt 3 eliminates both individual overloads and the total shortfall, so another project can start.",
      "Belts 1 and 4 each exceed capacity by 10 hours; Belt 3 has 10 spare hours, but aggregate demand exceeds capacity by 10, so redistribution alone cannot absorb all current work.",
      "Only Belt 1 exceeds capacity by 10 hours; Belt 4's three projects are covered by the unused time on Belt 3, leaving the portfolio with 10 hours available for intake.",
      "All nine projects fit because average allocation is 2.25 projects per Belt and the average is close to two; individual loading is not needed before approving new intake."
    ],
    "answer": 1,
    "why": "The equal-effort assumption converts assignments of 3, 2, 1 and 3 into 30, 20, 10 and 30 hours per week. With 20 hours each, total demand is 90 versus capacity 80. Local excesses total 20 hours and spare capacity is 10, giving a net shortfall of 10. Moving one project can remove one overload but cannot remove aggregate excess. Real projects need time-phased effort and skill constraints, not a universal project-count limit. Source alignment: ASQ CMBB Body of Knowledge, III.B.8; III.A.1. Case conclusions follow from the stated assumptions.",
    "chart": {
      "type": "data-table",
      "title": "Baseline weekly resource demand",
      "columns": [
        "Belt",
        "Assigned projects",
        "Demand (hours/week)",
        "Available (hours/week)"
      ],
      "rows": [
        [
          "Belt 1",
          3,
          30,
          20
        ],
        [
          "Belt 2",
          2,
          20,
          20
        ],
        [
          "Belt 3",
          1,
          10,
          20
        ],
        [
          "Belt 4",
          3,
          30,
          20
        ]
      ],
      "whatIf": {
        "id": "belt-capacity",
        "label": "Scenario capacity per Belt",
        "value": 20,
        "min": 10,
        "max": 40,
        "step": 5,
        "unit": " hours/week",
        "committed": 30,
        "committedLabel": "Belt 1 weekly demand"
      },
      "interactiveKind": "capacity",
      "altText": "Each Belt has baseline capacity 20 hours per week; demands are 30, 20, 10 and 30. The optional slider changes scenario capacity only."
    },
    "set": 3,
    "qid": "mbb:set-3:d3-011",
    "optionRationales": [
      "Reallocation preserves total demand and capacity; it cannot remove the 10-hour aggregate deficit.",
      "Correct. It distinguishes two local overloads from the smaller net portfolio capacity deficit.",
      "Capacity cannot be counted twice, and Belt 4 still requires its own reassignment or relief.",
      "A near-looking average does not establish feasibility, and 2.25 exceeds the stipulated two-project capacity."
    ],
    "distractors": [
      "Reallocation preserves total demand and capacity; it cannot remove the 10-hour aggregate deficit.",
      "Correct. It distinguishes two local overloads from the smaller net portfolio capacity deficit.",
      "Capacity cannot be counted twice, and Belt 4 still requires its own reassignment or relief.",
      "A near-looking average does not establish feasibility, and 2.25 exceeds the stipulated two-project capacity."
    ],
    "trap": "Capacity is a time-phased resource quantity. Local overload and aggregate shortfall differ; spare time elsewhere can offset some overload only when work can actually be reassigned.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.B.8; III.A.1"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A medical billing company compares projects M and N for one explicitly defined first-year screen. M has $300,000 first-year cash benefits and $150,000 implementation cost; N has $900,000 and $600,000. These are complete incremental cash amounts for that year; ignore taxes and discounting. Define benefit–cost ratio as benefits divided by cost. Which statement correctly distinguishes ratio ranking from absolute first-year net value?",
    "options": [
      "M has the higher ratio, 2.0 versus 1.5, and therefore also has the higher first-year net value; the ratio alone establishes the final choice under any capital constraint.",
      "M has the higher ratio, 2.0 versus 1.5, but N has higher first-year net value, $300,000 versus $150,000; review feasibility and later cash flows before final selection.",
      "N has the higher ratio, 2.0 versus 1.5, and higher first-year net value, $300,000 versus $150,000; both measures therefore favor N in the stated screen.",
      "M has the higher ratio, 2.0 versus 1.5, while N produces $300,000 more net value in every future year; the first-year figures establish the same recurring difference."
    ],
    "answer": 1,
    "why": "M: 300,000/150,000 = 2.0 and first-year net value = $150,000. N: 900,000/600,000 = 1.5 and first-year net value = $300,000. N's first-year net value exceeds M's by $150,000, not $300,000. Subtracting a one-time implementation cost does not define recurring annual net benefit. The stipulated one-year screen is not a multi-year NPV model or an automatic capital-constrained selection rule. Source alignment: ASQ CMBB Body of Knowledge, III.C.1; II.F.1. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-012",
    "optionRationales": [
      "A higher benefit–cost ratio does not imply higher absolute net value or solve every budget constraint.",
      "Correct. It calculates both measures on the stated common horizon and limits the conclusion accordingly.",
      "The stated ratio calculations are reversed; N's ratio is 1.5, not 2.0.",
      "Later benefits and costs are unspecified, and the first-year net difference is $150,000."
    ],
    "distractors": [
      "A higher benefit–cost ratio does not imply higher absolute net value or solve every budget constraint.",
      "Correct. It calculates both measures on the stated common horizon and limits the conclusion accordingly.",
      "The stated ratio calculations are reversed; N's ratio is 1.5, not 2.0.",
      "Later benefits and costs are unspecified, and the first-year net difference is $150,000."
    ],
    "trap": "Match the time horizon of benefits and costs. A first-year cash surplus after a one-time cost is not a recurring annual saving, and ratio ranking is not absolute-value ranking.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.C.1; II.F.1"
      },
      {
        "title": "OpenStax: Principles of Accounting, Volume 2: Managerial Accounting",
        "url": "https://openstax.org/books/principles-managerial-accounting/pages/11-4-use-discounted-cash-flow-models-to-make-capital-investment-decisions",
        "locator": "11.4: profitability index"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "For a playground-equipment project, material testing (3 days), supplier qualification (4 days) and design review (6 days) can start together at time zero. A 1-day readiness review starts only after all three finish; a zero-duration manufacturing-ready milestone follows. Assume finish-to-start links, no lags, adequate resources and unchanged durations. Which baseline conclusion is correct?",
    "options": [
      "The project takes 14 days because all activity durations must be added; design review is important but no parallel activity can have float under these assumptions.",
      "The project takes 6 days because the longest initial activity determines completion; the readiness review has no duration because it leads to a milestone.",
      "The project takes 7 days with design and readiness reviews critical; supplier qualification has 3 days of total float before the manufacturing-ready milestone moves.",
      "The project takes 7 days with design and readiness reviews critical; supplier qualification has 2 days of total float before the manufacturing-ready milestone moves."
    ],
    "answer": 3,
    "why": "The readiness review starts at max(3,4,6) = 6 and finishes at day 7. The critical path is design review followed by readiness review. Supplier qualification can finish as late as day 6 without delaying that review, so its total float is 6−4 = 2 days; material testing has 3 days. The 1-day review is an activity, while the following milestone has zero duration. These results assume no resource-induced delays or schedule changes. Source alignment: ASQ CMBB Body of Knowledge, III.A.1; III.B.6. Case conclusions follow from the stated assumptions.",
    "chart": {
      "type": "activity-network",
      "title": "Readiness network — activity durations in days",
      "nodes": {
        "Material testing": {
          "col": 0,
          "row": 0,
          "dur": 3
        },
        "Supplier qualification": {
          "col": 0,
          "row": 1,
          "dur": 4
        },
        "Design review": {
          "col": 0,
          "row": 2,
          "dur": 6
        },
        "Readiness review": {
          "col": 1,
          "row": 1,
          "dur": 1
        },
        "Manufacturing ready": {
          "col": 2,
          "row": 1,
          "dur": 0
        }
      },
      "edges": [
        [
          "Material testing",
          "Readiness review"
        ],
        [
          "Supplier qualification",
          "Readiness review"
        ],
        [
          "Design review",
          "Readiness review"
        ],
        [
          "Readiness review",
          "Manufacturing ready"
        ]
      ],
      "altText": "Material testing, 3 days; supplier qualification, 4 days; and design review, 6 days, run in parallel. All precede a 1-day readiness review, followed by a zero-duration manufacturing-ready milestone."
    },
    "set": 3,
    "qid": "mbb:set-3:d3-016",
    "optionRationales": [
      "The first three activities run in parallel; adding all durations treats them incorrectly as sequential.",
      "The 1-day readiness review is a real activity, separate from the zero-duration milestone.",
      "Three days is material testing's float; supplier qualification has only two days.",
      "Correct. The forward-pass completion and supplier float follow from the stated dependencies."
    ],
    "distractors": [
      "The first three activities run in parallel; adding all durations treats them incorrectly as sequential.",
      "The 1-day readiness review is a real activity, separate from the zero-duration milestone.",
      "Three days is material testing's float; supplier qualification has only two days.",
      "Correct. The forward-pass completion and supplier float follow from the stated dependencies."
    ],
    "trap": "Use the longest dependent path, not the sum of parallel work. Distinguish a real review activity from a zero-duration milestone and compute float against the successor's latest permissible start.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.A.1; III.B.6"
      },
      {
        "title": "PMI: Schedule Risk Analysis Simplified",
        "url": "https://www.pmi.org/learning/library/schedule-risk-analysis-simplified-10573",
        "locator": "CPM, merge points and float"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "An elevator-maintenance company's scoring weights still reflect a three-year-old strategy, although leadership has since emphasized predictive maintenance. Safety obligations and the company's minimum acceptable safety controls remain mandatory. Which update best realigns discretionary project selection without trading away those requirements?",
    "options": [
      "Retain mandatory safety gates, review discretionary weights against current strategy, document the rationale and assess how re-scoring changes portfolio priorities before authorizing reallocations.",
      "Reduce all safety weights until predictive-maintenance proposals rank first, allowing technology benefits to compensate for failure to meet mandatory safety controls within a single score.",
      "Keep the original weights permanently and create an unrecorded executive override for new technology projects, preserving apparent comparability while bypassing the approved selection process.",
      "Discard the old criteria and halt every project until new weights are finalized, without checking which ongoing work remains required or aligned with the revised direction."
    ],
    "answer": 0,
    "why": "Selection criteria need review when the strategy or assumptions they operationalize change. Mandatory obligations should be eligibility constraints, not merely low-weight preferences that attractive technology benefits can offset. Re-scoring and sensitivity review reveal consequences before resources move. Three years alone does not prove obsolescence, but the explicitly changed strategy warrants reassessment. Source alignment: ASQ CMBB Body of Knowledge, III.B.4; I.F.3. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-017",
    "optionRationales": [
      "Correct. It distinguishes non-negotiable safety eligibility from revisable strategic preferences.",
      "A weighted score cannot legitimately compensate for failure to meet the stipulated mandatory controls.",
      "Undocumented overrides weaken traceability and do not repair the obsolete criteria.",
      "Some current work remains required or valuable; a universal stop is not supported by the case."
    ],
    "distractors": [
      "Correct. It distinguishes non-negotiable safety eligibility from revisable strategic preferences.",
      "A weighted score cannot legitimately compensate for failure to meet the stipulated mandatory controls.",
      "Undocumented overrides weaken traceability and do not repair the obsolete criteria.",
      "Some current work remains required or valuable; a universal stop is not supported by the case."
    ],
    "trap": "Refresh discretionary priorities without treating mandatory safety as a tradeable score. An old criterion may remain relevant; test alignment rather than replacing everything because of its age.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.B.4; I.F.3"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A dry-ice supplier's DMAIC project has validated its measurement method and a root cause within the approved delivery process. At the Analyze gate, the sponsor asks the team to add a second, materially different process but keep the existing deadline and benefit estimate. No analysis covers that additional process. Which gate decision best preserves lifecycle discipline?",
    "options": [
      "Approve the expanded scope using the existing root-cause evidence, because sponsor interest establishes that conclusions from one delivery process transfer to the second process.",
      "Reject any scope revision after Define, even if strategy or evidence changes, because a disciplined lifecycle prohibits revisiting an approved project charter.",
      "Record the additional process in the meeting minutes and continue with the unchanged deadline, treating documentation of the request as sufficient authorization of its resource impacts.",
      "Assess the added process's evidence, resources, risk and schedule implications; obtain an approved re-scope or separate project before claiming the existing gate covers the expanded work."
    ],
    "answer": 3,
    "why": "Evidence valid for the original process does not automatically support a materially different scope. The gate should trigger explicit change assessment and reauthorization, including benefit and resource implications, rather than silently inheriting the earlier evidence. Legitimate changes are possible; recording a request or repeating a sponsor's desired date does not establish their feasibility. This item tests scope-change control, distinct from general exit-criterion recall. Source alignment: ASQ CMBB Body of Knowledge, III.A.1; III.A.2. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-022",
    "optionRationales": [
      "The new process has not been analyzed; interest in expanding scope is not transfer-validation evidence.",
      "Controlled re-scoping is possible when justified; the lifecycle is not a ban on responding to new needs.",
      "Minutes record a request but do not evaluate or authorize its technical and resource consequences.",
      "Correct. It separates the existing evidence boundary from the authorization needed for new work."
    ],
    "distractors": [
      "The new process has not been analyzed; interest in expanding scope is not transfer-validation evidence.",
      "Controlled re-scoping is possible when justified; the lifecycle is not a ban on responding to new needs.",
      "Minutes record a request but do not evaluate or authorize its technical and resource consequences.",
      "Correct. It separates the existing evidence boundary from the authorization needed for new work."
    ],
    "trap": "A gate approves evidence for a defined scope. Expanding the scope requires an impact assessment; sponsor support alone cannot extend the validity of a measurement study or root-cause finding.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.A.1; III.A.2"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A shoe company's governance requires sponsor authorization of the problem statement and scope before full Measure-phase collection; limited discovery can be separately approved. Without either approval, a Black Belt collects data for two weeks. The sponsor then changes the scope. What should the MBB conclude and require next?",
    "options": [
      "Record all two weeks as irrecoverable loss and terminate the project, without checking whether any measurements remain usable for the newly approved problem.",
      "Accept the original scope because data collection has already begun, treating completed work as authority to override the sponsor's approval responsibility.",
      "Recognize the missing authorization, agree and document the revised scope, assess which data remain usable, and re-plan collection rather than assuming approval or declaring all prior effort wasted.",
      "Treat the collection as authorized discovery after the fact, because technical confidence in the initial charter provides the same approval as the required sponsor decision."
    ],
    "answer": 2,
    "why": "The team bypassed the explicit governance rule in this scenario. Sponsor alignment should precede substantial scope-dependent collection, although separately authorized discovery is possible. The consequence is rework risk, not proof that all two weeks are lost; data relevance must be assessed against the revised question. Document authorization and update the collection plan rather than defending sunk effort or retrospectively inventing approval. Source alignment: ASQ CMBB Body of Knowledge, III.A.1; III.A.2. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-026",
    "optionRationales": [
      "A scope change may leave some data usable; complete loss and termination are not established.",
      "Sunk effort does not transfer the sponsor's approval authority to the project team.",
      "Correct. It repairs authorization and assesses actual rework rather than assuming all data are unusable.",
      "The scenario explicitly states that no discovery authorization was obtained."
    ],
    "distractors": [
      "A scope change may leave some data usable; complete loss and termination are not established.",
      "Sunk effort does not transfer the sponsor's approval authority to the project team.",
      "Correct. It repairs authorization and assesses actual rework rather than assuming all data are unusable.",
      "The scenario explicitly states that no discovery authorization was obtained."
    ],
    "trap": "Authorization and technical confidence are different. A revised scope creates a data-relevance review, not an automatic finding that every prior observation or hour is wasted.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.A.1; III.A.2"
      },
      {
        "title": "ASQ: DMAIC",
        "url": "https://asq.org/quality-resources/dmaic",
        "locator": "What are the DMAIC phases?"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A wind-farm maintenance proposal changes the schedule in a way that triggers an additional safety-certification cost under the operator's stated requirements. The financial screen includes labor savings and recovered downtime revenue but omits that incremental cost. Its amount and timing are being estimated. How should the MBB correct the appraisal?",
    "options": [
      "Exclude the certification cost because it is compliance-related rather than operational, retaining the financial ranking while reporting the requirement only in the risk register.",
      "Subtract an arbitrary contingency equal to the project's labor savings and treat the resulting point estimate as fully validated, without estimating certification timing or recurrence.",
      "Cancel the project because any omitted cost proves its NPV is negative, without obtaining the missing estimate or recomputing the complete incremental cash flows.",
      "Estimate the incremental certification cash flows and timing, include them on a consistent appraisal basis, and test decision sensitivity; meet applicable requirements regardless of the resulting ranking."
    ],
    "answer": 3,
    "why": "A cost caused by the proposed change belongs in the incremental appraisal even when it arises from a safety requirement. Its size, timing and recurrence must be estimated rather than assumed negligible or material. If discounting is used elsewhere, apply the same basis to this cost. Recompute the decision and examine uncertainty; an omission does not establish negative NPV, and financial attractiveness does not waive the stipulated requirement. Source alignment: ASQ CMBB Body of Knowledge, III.C.1; III.C.2. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-031",
    "optionRationales": [
      "Compliance-related costs can still be incremental project costs and cannot be omitted from the appraisal.",
      "An arbitrary contingency is not a supported estimate and does not resolve timing or recurrence.",
      "A missing cost reduces the estimated net value but need not make the completed appraisal negative.",
      "Correct. It restores the missing cash-flow category and preserves the distinction between appraisal and compliance."
    ],
    "distractors": [
      "Compliance-related costs can still be incremental project costs and cannot be omitted from the appraisal.",
      "An arbitrary contingency is not a supported estimate and does not resolve timing or recurrence.",
      "A missing cost reduces the estimated net value but need not make the completed appraisal negative.",
      "Correct. It restores the missing cash-flow category and preserves the distinction between appraisal and compliance."
    ],
    "trap": "Include all relevant incremental cash flows on a common time basis. The existence of an omitted cost does not establish its magnitude, timing, materiality or the sign of the corrected NPV.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.C.1; III.C.2"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A pet-food ingredient-substitution team has quality and operations staff but no formulation expertise. During Analyze, a candidate substitute shows an unexpected interaction with another ingredient. No production trial has been authorized. What immediate response and future charter control should the MBB require?",
    "options": [
      "Continue toward the trial using the operations team's experience, adding a formulation specialist only after implementation if the observed interaction affects reported customer complaints.",
      "Replace all quality and operations members with formulation staff, because the technical gap establishes that the original disciplines have no useful role in the project.",
      "Add the interaction to the final report but retain the trial schedule, assuming the absence of a previously identified problem makes further technical review unnecessary.",
      "Bring qualified formulation expertise into the risk and evidence review before authorizing trials, reassess affected conclusions, and require scope-based technical coverage at future chartering."
    ],
    "answer": 3,
    "why": "The observed interaction identifies a domain-expertise gap requiring prompt review before trials, not simply a future staffing lesson. Qualified formulation input complements quality and operations knowledge and should reassess affected assumptions, safety and evidence needs. Charter review should confirm technical coverage as soon as the scope is known; it need not require every expert to be a full-time team member. Expertise reduces blind spots but does not guarantee that an interaction would have been predicted. Source alignment: ASQ CMBB Body of Knowledge, III.A.1; II.B.2. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-035",
    "optionRationales": [
      "Waiting for customer complaints exposes the project to a known unresolved technical risk.",
      "Adding missing expertise does not remove the contribution of quality and operations disciplines.",
      "The newly observed interaction is positive evidence of a review need, not an absence of a problem.",
      "Correct. It addresses the current evidence gap and embeds proportionate technical coverage in future charters."
    ],
    "distractors": [
      "Waiting for customer complaints exposes the project to a known unresolved technical risk.",
      "Adding missing expertise does not remove the contribution of quality and operations disciplines.",
      "The newly observed interaction is positive evidence of a review need, not an absence of a problem.",
      "Correct. It addresses the current evidence gap and embeds proportionate technical coverage in future charters."
    ],
    "trap": "When a technical gap emerges, repair the current team and reassess dependent conclusions before implementation. A future charter checklist alone does not resolve today's known risk.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.A.1; II.B.2"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A kayak manufacturer has a $500,000 capital limit. Projects 1–3 have the investments and NPVs shown below. Projects are indivisible and independent, NPVs are additive on a common appraisal basis, and there are no other constraints or interactions. Initial investment is already deducted in each NPV. Define profitability index as PV of subsequent net cash inflows divided by initial investment, so PI = 1 + NPV/investment. Which feasible portfolio maximizes total NPV? The budget slider is exploratory; answer for $500,000.",
    "options": [
      "Select Projects 1 and 3: investment $500,000 and NPV $420,000. The PI ranking is 1, 2, 3, but taking projects greedily in that order does not maximize this indivisible portfolio.",
      "Select Projects 1 and 2: investment $450,000 and NPV $400,000. Their higher individual PIs establish that this combination must maximize NPV under the stated capital limit.",
      "Select Projects 2 and 3: investment $550,000 and NPV $460,000. The extra $50,000 is acceptable because positive NPV automatically finances any excess over the capital limit.",
      "Select Project 3 alone: investment $300,000 and NPV $240,000. Its highest individual NPV means that adding any lower-NPV project would reduce the portfolio's total value."
    ],
    "answer": 0,
    "why": "Standard PIs are 1.90, 1.88 and 1.80, not 0.90, 0.88 and 0.80; those latter values are NPV/investment. Feasible subsets have (investment, NPV), in $000: none (0,0), 1 (200,180), 2 (250,220), 3 (300,240), 1+2 (450,400), and 1+3 (500,420). Subsets 2+3 (550,460) and 1+2+3 (750,640) exceed the limit. Thus 1+3 uniquely maximizes NPV at $420,000. PI ranking is a heuristic, not an optimizer for indivisible projects. Source alignment: ASQ CMBB Body of Knowledge, III.C.1; II.F.1. Case conclusions follow from the stated assumptions.",
    "chart": {
      "type": "data-table",
      "title": "Indivisible candidate projects — common appraisal basis",
      "columns": [
        "Project",
        "Initial investment",
        "NPV",
        "PI = 1 + NPV / investment"
      ],
      "rows": [
        [
          "Project 1",
          "$200,000",
          "$180,000",
          "1.90"
        ],
        [
          "Project 2",
          "$250,000",
          "$220,000",
          "1.88"
        ],
        [
          "Project 3",
          "$300,000",
          "$240,000",
          "1.80"
        ]
      ],
      "whatIf": {
        "id": "capital-budget",
        "label": "Scenario capital budget ($000)",
        "value": 500,
        "min": 200,
        "max": 750,
        "step": 50,
        "unit": " $000",
        "committed": 750,
        "committedLabel": "All three candidates combined"
      },
      "interactiveKind": "budget",
      "altText": "Candidate investments total $750,000. The optional slider compares that total with an exploratory budget; the exam baseline remains $500,000."
    },
    "set": 3,
    "qid": "mbb:set-3:d3-037",
    "optionRationales": [
      "Correct. It is feasible and has the largest total NPV among all feasible subsets.",
      "Greedy PI selection leaves $50,000 unused and gives $20,000 less NPV than Projects 1 and 3.",
      "Future value does not waive the current capital limit; this combination is infeasible.",
      "Adding independent positive-NPV Project 1 is feasible and raises total NPV to $420,000."
    ],
    "distractors": [
      "Correct. It is feasible and has the largest total NPV among all feasible subsets.",
      "Greedy PI selection leaves $50,000 unused and gives $20,000 less NPV than Projects 1 and 3.",
      "Future value does not waive the current capital limit; this combination is infeasible.",
      "Adding independent positive-NPV Project 1 is feasible and raises total NPV to $420,000."
    ],
    "trap": "For the stated convention, PI = 1 + NPV/investment. Under an indivisible budget constraint, enumerate feasible combinations or optimize them; neither PI nor individual NPV ranking alone guarantees the best portfolio.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.C.1; II.F.1"
      },
      {
        "title": "OpenStax: Principles of Accounting, Volume 2: Managerial Accounting",
        "url": "https://openstax.org/books/principles-managerial-accounting/pages/11-4-use-discounted-cash-flow-models-to-make-capital-investment-decisions",
        "locator": "11.4: profitability index"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "At a 3D-printing service bureau's Control gate, a stable pilot meets its performance goal and the report is complete. However, the receiving process owner has not accepted the monitoring workload, no reaction plan has been practiced, and no one is assigned to verify benefits after handoff. Which closure decision best tests substantive readiness?",
    "options": [
      "Close the project because a stable successful pilot establishes that future performance needs no additional ownership, response practice or post-handoff benefit verification.",
      "Close after the Black Belt signs the report on behalf of the process owner, treating the project leader's competence as a substitute for operational acceptance of the workload.",
      "Keep closure conditional on accepted ownership, resourced monitoring, a tested reaction plan and defined benefit follow-up; close only when the agreed sustainment evidence supports the handoff.",
      "Extend the pilot indefinitely without assigning ownership or response duties, because more observations alone will eventually resolve the missing operational commitments."
    ],
    "answer": 2,
    "why": "A successful pilot and a completed report do not demonstrate operational ability to sustain gains. Control readiness requires an accountable receiving owner, feasible monitoring, a usable response and planned benefit verification. Additional observation may be appropriate, but it does not assign responsibilities. The question tests handoff evidence, distinct from scope-change control and from simply naming a generic phase-gate principle. Source alignment: ASQ CMBB Body of Knowledge, III.A.2; III.B.5. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-041",
    "optionRationales": [
      "Observed pilot stability does not establish future ownership, resources or reaction capability.",
      "The Black Belt cannot silently accept another owner's operational workload or accountability.",
      "Correct. It links closure to demonstrated and accepted sustainment arrangements.",
      "More data do not create missing responsibilities or an executable response plan."
    ],
    "distractors": [
      "Observed pilot stability does not establish future ownership, resources or reaction capability.",
      "The Black Belt cannot silently accept another owner's operational workload or accountability.",
      "Correct. It links closure to demonstrated and accepted sustainment arrangements.",
      "More data do not create missing responsibilities or an executable response plan."
    ],
    "trap": "Separate pilot results from sustainment readiness. Closure is an operational handoff supported by ownership and response evidence, not merely a signed report or a longer observation period.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.A.2; III.B.5"
      },
      {
        "title": "ASQ: DMAIC",
        "url": "https://asq.org/quality-resources/dmaic",
        "locator": "What are the DMAIC phases?"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A luggage manufacturer has consistent status reporting and scheduled portfolio reviews, but lacks a shared dependency register and a capacity-checking intake gate. Its selection weights have not been reviewed in three years. The urgency of strategic changes and exposures has not been assessed. What maturity finding and next action are justified by this evidence?",
    "options": [
      "Classify the portfolio as having no useful infrastructure and replace all existing reporting, because the missing controls invalidate every established monitoring practice.",
      "Classify the portfolio as fully mature because status reports and scheduled reviews are present, treating unassessed risks and obsolete weights as unrelated operational details.",
      "Fix intake and dependencies first and defer strategy review, because strategic misalignment necessarily compounds more slowly than every capacity or dependency risk.",
      "Recognize partial infrastructure, assess each gap's severity and urgency, contain unacceptable exposure, and sequence assigned actions using evidence rather than a universal priority order."
    ],
    "answer": 3,
    "why": "The organization has some functioning controls and some important unassessed gaps. No named maturity model or scored assessment is supplied, so a formal maturity level is not justified. Capacity, dependency and strategic-alignment risks can each be urgent. Their priority depends on actual exposure, timing and consequences, not an assumed rule that stale strategy always matters later. Preserve useful reporting while improving the missing decision controls. Source alignment: ASQ CMBB Body of Knowledge, III.B.1; III.B.4; III.B.8. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-042",
    "optionRationales": [
      "Missing controls do not prove that existing reporting and review practices have no value.",
      "Reporting presence alone is not evidence of effective intake, dependency or strategic control.",
      "The claim about relative urgency is unsupported; strategic misalignment can require immediate action.",
      "Correct. It states the supported maturity observation and requires evidence-based risk prioritization."
    ],
    "distractors": [
      "Missing controls do not prove that existing reporting and review practices have no value.",
      "Reporting presence alone is not evidence of effective intake, dependency or strategic control.",
      "The claim about relative urgency is unsupported; strategic misalignment can require immediate action.",
      "Correct. It states the supported maturity observation and requires evidence-based risk prioritization."
    ],
    "trap": "Do not assign a formal maturity level without a model or rank gaps solely by their category. Assess current exposure and timing; strategic misalignment can be as urgent as capacity overload.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.B.1; III.B.4; III.B.8"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A fireworks manufacturer's process-safety proposal has an $85,000 NPV based only on routine operational cash flows. Other proposals exceed $200,000. The committee has not established whether the safety work is required to meet mandatory controls, how much risk it reduces, or whether incident losses overlap with the forecast. What should the MBB require before applying a purely financial ranking?",
    "options": [
      "Establish mandatory safety requirements and acceptable-risk constraints first; then assess credible incremental risk reduction and cash-flow effects without double-counting, using uncertainty and nonfinancial consequences in the decision.",
      "Add the full cost of the worst conceivable incident to the $85,000 NPV as a certain saving, without estimating baseline probability, risk reduction or overlaps with existing cash flows.",
      "Select the safety-labeled proposal automatically and stop reviewing alternatives, assuming any proposal described as safety work delivers the same necessary and sufficient protection.",
      "Rank the $85,000 proposal below every $200,000 proposal immediately, treating missing incident-risk data as proof that the omitted safety consequences have zero decision value."
    ],
    "answer": 0,
    "why": "First establish required controls and risk acceptability: these can constrain the feasible decision set rather than act as optional weighted benefits. For discretionary alternatives, assess the change in expected losses using credible probabilities, consequences, timing and overlaps, not the full incident severity as a certain saving. The information given cannot establish a revised NPV or the final ranking. Financial analysis informs the choice but does not substitute for required safety controls. Source alignment: ASQ CMBB Body of Knowledge, III.C.1; I.F.3; I.F.4. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-043",
    "optionRationales": [
      "Correct. It separates required protection from financial comparison and demands support for incremental risk benefits.",
      "Worst-case severity is not expected avoided loss, and adding it may double-count forecast impacts.",
      "A safety label does not establish effectiveness or make alternative control designs irrelevant.",
      "Missing risk information is uncertainty, not evidence of zero risk or zero consequence."
    ],
    "distractors": [
      "Correct. It separates required protection from financial comparison and demands support for incremental risk benefits.",
      "Worst-case severity is not expected avoided loss, and adding it may double-count forecast impacts.",
      "A safety label does not establish effectiveness or make alternative control designs irrelevant.",
      "Missing risk information is uncertainty, not evidence of zero risk or zero consequence."
    ],
    "trap": "Safety eligibility comes before a discretionary financial ranking. Do not add incident severity directly to NPV: estimate incremental expected risk reduction, avoid double-counting and state what remains uncertain.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.C.1; I.F.3; I.F.4"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "During an escape-room chain's Improve pilot, new observations suggest an additional cause that the Analyze phase did not test. The proposed mechanism is plausible but not yet validated, and implementation has not been approved. What should the MBB require while preserving useful earlier work?",
    "options": [
      "Proceed with full implementation because an Improve-phase observation validates causation automatically, noting the additional cause only in the final lessons-learned report.",
      "Restart every completed activity from Define and discard all prior data, because new evidence makes every earlier conclusion invalid regardless of its relevance.",
      "Record the observation without investigating it until after closure, because returning to Analyze would violate the agreed order of DMAIC phases.",
      "Assess the observation, return to the relevant analysis to test the suspected cause, and update affected solution, risk and control decisions while retaining evidence that remains valid."
    ],
    "answer": 3,
    "why": "A plausible new mechanism is a hypothesis, not a confirmed root cause merely because it appeared during a pilot. Revisit the analysis needed to test it and reassess dependent decisions. Iteration supports disciplined problem solving when documented and governed; it does not require discarding unrelated valid work or restarting every phase. The extent of rework should follow the evidence and its effect on scope, risk and solution validity. Source alignment: ASQ CMBB Body of Knowledge, III.A.1; III.A.2. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-044",
    "optionRationales": [
      "The project phase does not turn an observation into proof of causation.",
      "New evidence affects particular assumptions; it need not invalidate all previous work.",
      "Phase structure supports problem solving and does not justify ignoring relevant new evidence.",
      "Correct. It validates the new hypothesis and updates only the work that depends on it."
    ],
    "distractors": [
      "The project phase does not turn an observation into proof of causation.",
      "New evidence affects particular assumptions; it need not invalidate all previous work.",
      "Phase structure supports problem solving and does not justify ignoring relevant new evidence.",
      "Correct. It validates the new hypothesis and updates only the work that depends on it."
    ],
    "trap": "A pilot can reveal a new hypothesis without proving a new cause. Revisit the affected analysis and approvals; disciplined iteration is neither blind continuation nor an automatic full restart.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.A.1; III.A.2"
      },
      {
        "title": "ASQ: DMAIC",
        "url": "https://asq.org/quality-resources/dmaic",
        "locator": "What are the DMAIC phases?"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A car-wash chain approved a six-week, multi-site water-reduction DMAIC charter without reviewing task estimates, dependencies, resource availability or a concern the Black Belt held about feasibility. By week five, the team is still in Analyze. What planning control was missing, and how should the MBB respond?",
    "options": [
      "Replace the Black Belt because the late phase alone proves insufficient competence, retaining the six-week baseline without reviewing its scope, dependencies or resource assumptions.",
      "Extend the completion date indefinitely and keep the original scope and benefit forecast, avoiding a formal change decision because the initial estimate has already been missed.",
      "Require transparent, evidence-based feasibility review at chartering; now reassess scope, dependencies, resources and risks with the sponsor and approve a justified recovery plan or revised baseline.",
      "Keep the deadline and remove the remaining validation activities, assuming schedule adherence is the most reliable indication that the original charter was feasible."
    ],
    "answer": 2,
    "why": "The missing control is an explicit feasibility review, including estimates, dependencies, capacity and honest concerns, before commitment. The Black Belt's private doubt is relevant input but not proof of a particular completion date. Current progress triggers evidence-based recovery and change approval, not blame, indefinite extension or weakened validation. A shorter scope or added resources may help only where the schedule and technical dependencies permit. Source alignment: ASQ CMBB Body of Knowledge, III.A.1; III.C.1. Case conclusions follow from the stated assumptions.",
    "set": 3,
    "qid": "mbb:set-3:d3-045",
    "optionRationales": [
      "Being in Analyze at week five does not establish individual incompetence or validate the original plan.",
      "An open-ended extension without scope, value and resource review is not a controlled recovery plan.",
      "Correct. It repairs the planning and approval process using current evidence and explicit tradeoffs.",
      "Removing necessary validation can meet a date on paper while invalidating the promised improvement."
    ],
    "distractors": [
      "Being in Analyze at week five does not establish individual incompetence or validate the original plan.",
      "An open-ended extension without scope, value and resource review is not a controlled recovery plan.",
      "Correct. It repairs the planning and approval process using current evidence and explicit tradeoffs.",
      "Removing necessary validation can meet a date on paper while invalidating the promised improvement."
    ],
    "trap": "Surface feasibility concerns with evidence before commitment. Recovery requires an approved scope–time–resource tradeoff; neither private doubt nor current phase alone proves the exact duration required.",
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.A.1; III.C.1"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A vending operator loses completed-project reports when Black Belts leave because the reports are stored only on personal drives. Some reports contain restricted customer data. The closure process already verifies benefit claims and assigns ongoing control-plan owners; it has no records-transfer requirement. Which additional closure control best preserves reusable knowledge without making restricted data generally accessible?",
    "options": [
      "Back up each Belt's personal folder centrally and retain its existing file names, leaving retrieval, access decisions and interpretation to whoever requests the material later.",
      "Upload all project files to a company-wide folder with unrestricted access, so any future team can reuse the original customer data without seeking permission.",
      "Store only approved financial summaries in a searchable repository and discard the supporting methods, control plans and failed trials once benefit verification is complete.",
      "Require an indexed organizational archive with a named custodian, versioned evidence and reusable lessons, plus risk-appropriate access and retention rules verified before records transfer is accepted."
    ],
    "answer": 3,
    "why": "The missing control is organizational custody and usable retrieval of project knowledge, not another benefit-approval gate. An indexed archive should retain the evidence and context needed for reuse, with ownership, access and retention controls appropriate to the information. A backup alone does not ensure findability or interpretability. Restricting sensitive records while sharing suitable lessons preserves both confidentiality and learning; indefinite unrestricted retention is not required. Source alignment: ASQ CMBB Body of Knowledge, III.A.2; III.B.1. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d3-046",
    "optionRationales": [
      "A backup reduces loss risk but leaves the stated retrieval, access and knowledge-transfer controls unresolved.",
      "Unrestricted access conflicts with the explicit confidentiality constraint; reusability does not require disclosing restricted customer records.",
      "Financial summaries do not preserve the methods, unsuccessful approaches and control-plan context needed by later teams.",
      "Correct. This establishes organizational custody, usable knowledge transfer and proportionate information controls at closure."
    ],
    "trap": "Distinguish backup from a governed knowledge archive: custody, indexing, context and controlled access must survive the original project leader's departure.",
    "distractors": [
      "A backup reduces loss risk but leaves the stated retrieval, access and knowledge-transfer controls unresolved.",
      "Unrestricted access conflicts with the explicit confidentiality constraint; reusability does not require disclosing restricted customer records.",
      "Financial summaries do not preserve the methods, unsuccessful approaches and control-plan context needed by later teams.",
      "Correct. This establishes organizational custody, usable knowledge transfer and proportionate information controls at closure."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.A.2; III.B.1"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A mattress manufacturer is comparing automated stitching equipment with continuing its current process. Year 1 incremental amounts are purchase $350,000, installation $40,000, retraining $15,000 and maintenance $20,000, all cash outflows. A six-week changeover also causes $60,000 of unrecoverable lost contribution margin after avoided variable costs; it is not an additional cash payment and is not counted elsewhere. All amounts fall within the defined first-year horizon. Ignore tax and discounting. What are the total first-year economic cost and the incremental cash-outlay budget, respectively?",
    "options": [
      "$425,000 and $425,000: exclude the lost contribution from both measures because there is no separate invoice or additional payment for it.",
      "$485,000 and $425,000: include lost contribution once as an opportunity cost in the economic comparison, but not as an additional cash payment.",
      "$485,000 and $485,000: include lost contribution in both measures because every economic cost must also appear as a separate cash-outlay requirement.",
      "$465,000 and $405,000: exclude the maintenance amount from both first-year measures because recurring costs belong only in later years of the evaluation."
    ],
    "answer": 1,
    "why": "Cash outlays total $350,000 + $40,000 + $15,000 + $20,000 = $425,000. Adding the $60,000 forgone contribution once gives $485,000 of first-year economic cost relative to continuing the existing process. The opportunity cost affects the economic cash-flow comparison but is not an additional payment to fund. These are first-year figures, not lifetime total cost of ownership or NPV. Later cash flows and their timing would be needed for a full life-cycle appraisal, and the same lost contribution must not also be subtracted from forecast benefits. Source alignment: ASQ CMBB Body of Knowledge, III.C.1–2; II.F.1. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d3-047",
    "optionRationales": [
      "Forgone contribution is relevant to choosing between alternatives even though it is not an additional invoice or payment.",
      "Correct. Cash outlays are $425,000; the distinct $60,000 opportunity cost raises the economic total to $485,000 without double counting.",
      "This mistakes reduced cash inflow for an additional cash payment. The cash-outlay budget remains $425,000.",
      "The stated maintenance payment occurs in Year 1. Recurrence does not justify removing that year's $20,000 from the defined horizon."
    ],
    "trap": "Use incremental amounts and a common horizon. Lost revenue is not automatically lost contribution, opportunity cost is not another invoice, and a first-year total is not lifetime TCO.",
    "distractors": [
      "Forgone contribution is relevant to choosing between alternatives even though it is not an additional invoice or payment.",
      "Correct. Cash outlays are $425,000; the distinct $60,000 opportunity cost raises the economic total to $485,000 without double counting.",
      "This mistakes reduced cash inflow for an additional cash payment. The cash-outlay budget remains $425,000.",
      "The stated maintenance payment occurs in Year 1. Recurrence does not justify removing that year's $20,000 from the defined horizon."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.C.1–2; II.F.1"
      },
      {
        "title": "The Open University: Relevant cash flows and sunk costs",
        "url": "https://www.open.edu/openlearn/money-business/challenges-advanced-management-accounting/content-section-3.1",
        "locator": "Incremental future cash flows and sunk-cost exclusion"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A hearing aid manufacturer has found projects passing DMAIC gates on schedule despite missing evidence: unsigned scope changes, unverified measurement adequacy and untested sustainment arrangements. The MBB must replace a generic 'phase complete' checklist. Projects differ in regulatory exposure and complexity. Which audit design best makes gate decisions evidence-based while allowing justified tailoring?",
    "options": [
      "Use the same number of mandatory documents for every project and approve a gate when all boxes are checked, even when the submitted evidence does not support the decision.",
      "Map phase-specific exit criteria to evidence, reviewers and decision rules; scale depth to risk, document approved exceptions and corrective actions, and check whether the gate process detects recurring omissions.",
      "Keep substantive criteria advisory and let each project leader waive unmet requirements privately, provided the reported schedule and budget remain within the original authorization.",
      "Apply a detailed financial and schedule review at each gate, then defer measurement, cause-validation and sustainment evidence until final closure to avoid interrupting project momentum."
    ],
    "answer": 1,
    "why": "The observed failure is approval without the evidence needed for that phase, not a shortage of checkboxes. Gate criteria should identify the decision, required evidence, accountable reviewer and treatment of gaps. Risk-based tailoring can be appropriate when the authority and rationale are documented; it is not an undocumented waiver. Review how well the checklist detects failures and update it when experience warrants. No checklist guarantees that every possible failure will be caught. Source alignment: ASQ CMBB Body of Knowledge, III.A.1–2. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d3-048",
    "optionRationales": [
      "Document counts can be satisfied without adequate technical evidence and impose the same burden regardless of project risk.",
      "Correct. It connects each gate decision to substantive evidence and accountable handling of gaps, with controlled tailoring and improvement.",
      "Private waivers remove the oversight needed to distinguish justified exceptions from unaddressed risks.",
      "Delaying technical and sustainment checks until closure allows unsupported downstream decisions to proceed."
    ],
    "trap": "A gate verifies decision-relevant evidence, not document volume. Tailoring needs explicit authority and a rationale; checklist completion is not a guarantee of project validity.",
    "distractors": [
      "Document counts can be satisfied without adequate technical evidence and impose the same burden regardless of project risk.",
      "Correct. It connects each gate decision to substantive evidence and accountable handling of gaps, with controlled tailoring and improvement.",
      "Private waivers remove the oversight needed to distinguish justified exceptions from unaddressed risks.",
      "Delaying technical and sustainment checks until closure allows unsupported downstream decisions to proceed."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.A.1–2"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A rapidly growing drone-delivery startup has local project lists but no cross-team view of shared specialists, dependencies or release commitments. It can initially support only a lightweight portfolio system. Management requires that new commitments be checked against available capacity and that material risks reach an authorized decision maker. Which initial architecture best meets those requirements and remains scalable?",
    "options": [
      "Establish a common project register, shared definitions, dependency and capacity checks, and named escalation owners; use proportionate tools and review triggers to expand the system as its needs change.",
      "Buy a comprehensive portfolio platform first and let its default workflow define approval authority, capacity measures and escalation thresholds after local teams begin entering commitments.",
      "Combine local lists into a central dashboard but leave intake and escalation entirely local, using the dashboard to explain conflicting commitments after release dates have been promised.",
      "Apply fixed project-count limits uniformly to all teams and revisit the system annually, without considering differences in specialist effort, dependencies or material changes between reviews."
    ],
    "answer": 0,
    "why": "A lightweight implementation still needs the capabilities that address the stated risks: shared information, comparable measures, capacity-aware intake and timely decision authority. Software can support these controls but cannot define the organization's decision rights by itself. Project counts are not interchangeable units of effort. Establish change triggers and ownership so the system can mature as scale and dependencies evolve, without assuming that either maximum complexity or no governance is appropriate. Source alignment: ASQ CMBB Body of Knowledge, III.B.1; III.B.4–5; III.B.8. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d3-049",
    "optionRationales": [
      "Correct. It installs the required information and decision controls first, with tools and expansion proportionate to actual needs.",
      "Default software settings cannot substitute for deliberately assigned authority and locally meaningful capacity measures.",
      "Visibility after commitments are made does not provide the required intake check or timely escalation.",
      "Uniform counts ignore unequal workload, while annual-only review misses material changes between scheduled assessments."
    ],
    "trap": "Scale the implementation, not away the essential controls. A shared dashboard is insufficient unless common definitions, intake decisions and escalation responsibilities are usable.",
    "distractors": [
      "Correct. It installs the required information and decision controls first, with tools and expansion proportionate to actual needs.",
      "Default software settings cannot substitute for deliberately assigned authority and locally meaningful capacity measures.",
      "Visibility after commitments are made does not provide the required intake check or timely escalation.",
      "Uniform counts ignore unequal workload, while annual-only review misses material changes between scheduled assessments."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.B.1; III.B.4–5; III.B.8"
      }
    ]
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A casket manufacturer's portfolio includes optional equipment investments and mandatory safety upgrades, with different lives, cash-flow timing and uncertain benefits. Finance wants a common evaluation template without forcing a misleading single ranking across all candidates. Which design best supports comparable, forward-looking decisions?",
    "options": [
      "Use a common horizon and record benefit uncertainty, but allocate historical sunk costs to candidates and rank all projects by payback so previously invested resources remain visible in selection.",
      "Model incremental cash flows and risk-adjusted NPV, but convert released staff capacity into cash savings at salary rates even when no payment is avoided and no additional output is realizable.",
      "Document incremental cash flows, timing, horizon, relevant life-cycle costs and benefit types; assess uncertainty, exclude sunk costs, separate mandatory constraints and compare feasible portfolios using decision-appropriate financial measures.",
      "Document incremental cash flows and mandatory constraints, but treat the highest individual IRR as the best choice for mutually exclusive projects and ignore conflicts with total NPV."
    ],
    "answer": 2,
    "why": "Comparable appraisal requires explicit horizons, timing, relevant incremental costs and credible benefit realization, not identical use of every metric on every decision. Sunk costs do not change with the current choice. Released capacity is not automatically a cash saving. NPV, payback and IRR answer different questions, and ranking conflicts or portfolio constraints require appropriate analysis. Mandatory safety obligations belong in eligibility and compliance decisions rather than being overridden by a purely discretionary financial ranking. Source alignment: ASQ CMBB Body of Knowledge, III.C.1–2; II.F.1. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d3-050",
    "optionRationales": [
      "Sunk costs are not incremental to the current decision, and payback alone omits later cash flows and generally the time value of money.",
      "Released time is not a cash saving unless the stated realization conditions support avoided outlays or additional economic benefit.",
      "Correct. This specifies the common evidence while allowing the decision model to reflect timing, uncertainty, obligations and portfolio constraints.",
      "Individual IRR ranking can conflict with value maximization for mutually exclusive projects; the conflict cannot be dismissed."
    ],
    "trap": "Standardize financial evidence and assumptions, not a universal metric rule. Distinguish cash realization, incremental value, mandatory obligations and feasible portfolio choices.",
    "distractors": [
      "Sunk costs are not incremental to the current decision, and payback alone omits later cash flows and generally the time value of money.",
      "Released time is not a cash saving unless the stated realization conditions support avoided outlays or additional economic benefit.",
      "Correct. This specifies the common evidence while allowing the decision model to reflect timing, uncertainty, obligations and portfolio constraints.",
      "Individual IRR ranking can conflict with value maximization for mutually exclusive projects; the conflict cannot be dismissed."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "III.C.1–2; II.F.1"
      },
      {
        "title": "The Open University: Relevant cash flows and sunk costs",
        "url": "https://www.open.edu/openlearn/money-business/challenges-advanced-management-accounting/content-section-3.1",
        "locator": "Incremental future cash flows and sunk-cost exclusion"
      },
      {
        "title": "OpenStax Principles of Finance",
        "url": "https://openstax.org/books/principles-finance/pages/16-3-internal-rate-of-return-irr-method",
        "locator": "IRR limitations, scale and mutually exclusive comparisons"
      },
      {
        "title": "OpenStax Principles of Finance: Chapter 16 Key Terms",
        "url": "https://openstax.org/books/principles-finance/pages/16-key-terms",
        "locator": "NPV, payback and mutually exclusive projects"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "A hospital has funding for 50 Green Belt training places. The proposed list uses seniority alone, while departments differ in performance gaps, existing skills and opportunities to apply learning. No assessment has determined whether the gaps require training or changes to the work system. Which first step best supports a defensible allocation of these places?",
    "options": [
      "Compare required and demonstrated competencies, distinguish skill gaps from work-system barriers, and assess sponsorship and application opportunities before using transparent criteria to select the initial cohort.",
      "Select the 50 longest-serving staff first, then use their course evaluations to infer which departments had the greatest unmet capability needs before training began.",
      "Rank departments only by their recent defect totals and assign places proportionally, without checking differences in exposure, existing competence or opportunities to apply the training.",
      "Accept each manager's preferred nominees and use a common post-course examination, treating the examination as a substitute for assessing needs before allocating the training places."
    ],
    "answer": 0,
    "why": "The allocation should follow a comparison of needed and demonstrated capability and an assessment of whether training can address the gap. Work-system barriers may require a non-training intervention. Sponsorship and realistic application opportunities affect how an initial cohort can use new skills. Seniority, raw defect totals and nominations can provide context but are not sufficient selection evidence. A later examination does not retrospectively validate the original allocation decision. Source alignment: ASQ CMBB Body of Knowledge, IV.A. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-001",
    "optionRationales": [
      "Correct. It links selection to actual capability requirements, the nature of the gap and conditions for applying learning.",
      "Course reactions from a seniority-selected group cannot establish the original distribution of unmet training needs.",
      "Unadjusted defect totals may reflect workload or system conditions rather than a trainable skill gap.",
      "A common examination assesses later performance; it does not determine who most needed the initial investment."
    ],
    "trap": "Needs assessment asks whether training is the right response as well as who needs it. Nomination, tenure and performance totals are inputs, not stand-alone selection criteria.",
    "distractors": [
      "Correct. It links selection to actual capability requirements, the nature of the gap and conditions for applying learning.",
      "Course reactions from a seniority-selected group cannot establish the original distribution of unmet training needs.",
      "Unadjusted defect totals may reflect workload or system conditions rather than a trainable skill gap.",
      "A common examination assesses later performance; it does not determine who most needed the initial investment."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.A"
      },
      {
        "title": "CDC: Assess Training Needs — Conducting Needs Analysis",
        "url": "https://www.cdc.gov/training-development/php/about/assess-training-needs-conducting-needs-analysis.html",
        "locator": "Needs assessment and training needs analysis"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "A logistics company's observed-work assessment confirms that dispatch supervisors can map processes but often choose the wrong hypothesis test and interpret a nonsignificant result as proof of no effect. Their roles require using test results in improvement decisions. Training time is limited, and prerequisite numeracy varies. Which curriculum response most directly addresses the demonstrated gap?",
    "options": [
      "Move directly to an advanced DOE module using statistical software defaults, with a final attendance check to confirm that each supervisor has received the same technical exposure.",
      "Repeat the process-mapping module for the whole cohort and add a brief glossary of statistical terms, using self-rated confidence to determine whether further instruction is needed.",
      "Give every supervisor the unchanged full curriculum and assess only aggregate course scores, allowing strength in process mapping to compensate for incorrect inferential decisions.",
      "Check prerequisite skills, provide targeted bridges, and practice test selection, assumptions and interpretation on dispatch cases, with feedback and objective checks of the required decisions."
    ],
    "answer": 3,
    "why": "The demonstrated deficit concerns selecting and interpreting inferential procedures, not process mapping or attendance. Prerequisite checks allow targeted support without assuming that everyone needs identical remediation. Job-relevant decisions, practice and feedback should be aligned with the required competence. A nonsignificant result alone does not establish absence of an effect; uncertainty, power and practical relevance still matter. Assessment should verify the specific inference skills rather than letting unrelated strengths hide them. Source alignment: ASQ CMBB Body of Knowledge, IV.A; IV.B. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-002",
    "optionRationales": [
      "Advanced software exposure without prerequisites or decision checks does not correct the demonstrated selection and interpretation errors.",
      "Repeating an already demonstrated strength and measuring confidence does not verify improvement in inferential decisions.",
      "Aggregate scores can conceal failure on the very competency the needs assessment identified as essential.",
      "Correct. It targets the demonstrated skill gap with appropriate foundations, relevant practice, feedback and aligned assessment."
    ],
    "trap": "Map a demonstrated gap to a specific objective, practice task and assessment. Failure to reject a null hypothesis is not proof that there is no meaningful effect.",
    "distractors": [
      "Advanced software exposure without prerequisites or decision checks does not correct the demonstrated selection and interpretation errors.",
      "Repeating an already demonstrated strength and measuring confidence does not verify improvement in inferential decisions.",
      "Aggregate scores can conceal failure on the very competency the needs assessment identified as essential.",
      "Correct. It targets the demonstrated skill gap with appropriate foundations, relevant practice, feedback and aligned assessment."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.A; IV.B"
      },
      {
        "title": "CDC Quality Training Standards",
        "url": "https://www.cdc.gov/training-development/php/qts/index.html",
        "locator": "Standards 1–8; use only the principles relevant to each original scenario"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "A retail chain selected a Green Belt cohort using only self-rated statistical proficiency. Ratings were high, but performance on course exercises was poor. The survey and exercise requirements have not yet been compared, and delivery conditions were not evaluated. Which revision to the next needs assessment is most defensible?",
    "options": [
      "Retain self-ratings as the sole skill measure but ask employees to explain their confidence, treating longer explanations as evidence of stronger statistical competence.",
      "Replace self-ratings with managers' unaided ratings, treating those judgments as objective measurements that need no common criteria or comparison with direct performance.",
      "Conclude that overconfidence caused the poor results and lower all self-ratings by the same amount, without checking the assessment alignment or training-delivery conditions.",
      "Triangulate self-ratings with role-aligned performance tasks and rubric-based work review, and examine assessment and delivery fit before attributing the discrepancy to a particular cause."
    ],
    "answer": 3,
    "why": "The discrepancy shows that self-ratings alone did not provide an adequate basis for this selection decision. It does not establish overconfidence as the unique cause: construct mismatch, prerequisites or delivery conditions are alternatives. Direct role-aligned performance and calibrated work review provide complementary evidence. Manager opinion is another judgment source, not automatically an objective test. Retain useful self-report information while checking what each measure actually assesses. Source alignment: ASQ CMBB Body of Knowledge, IV.A. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-003",
    "optionRationales": [
      "The length of a confidence explanation does not verify the statistical decisions the role requires.",
      "Unstructured managerial ratings can introduce different biases and do not become objective merely by changing the rater.",
      "A uniform correction assumes an unverified cause and magnitude rather than investigating the discrepancy.",
      "Correct. It adds direct, aligned evidence and checks alternative explanations without treating one source as infallible."
    ],
    "trap": "A disagreement between confidence and performance is evidence to investigate, not proof of a single bias. Manager ratings also need criteria and calibration.",
    "distractors": [
      "The length of a confidence explanation does not verify the statistical decisions the role requires.",
      "Unstructured managerial ratings can introduce different biases and do not become objective merely by changing the rater.",
      "A uniform correction assumes an unverified cause and magnitude rather than investigating the discrepancy.",
      "Correct. It adds direct, aligned evidence and checks alternative explanations without treating one source as infallible."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.A"
      },
      {
        "title": "CDC: Assess Training Needs — Conducting Needs Analysis",
        "url": "https://www.cdc.gov/training-development/php/about/assess-training-needs-conducting-needs-analysis.html",
        "locator": "Needs assessment and training needs analysis"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "A manufacturer still uses the training-needs assessment from its deployment launch three years ago. New product lines, revised processes and staff turnover have changed several roles. Some capabilities remain relevant, but no owner checks whether assessed requirements still match current work. Which maintenance process best closes this gap?",
    "options": [
      "Repeat the original survey on a fixed annual date using unchanged role requirements, so year-to-year comparisons remain consistent despite changes in the work.",
      "Replace the entire curriculum immediately because the assessment is three years old, without checking which competencies or existing evidence are still applicable.",
      "Reassess needs only when examination pass rates fall, because stable pass rates are sufficient evidence that the curriculum covers all current role requirements.",
      "Assign an owner to scheduled and material-change reviews of role requirements and capability evidence, retaining valid findings and updating priorities when work or workforce needs change."
    ],
    "answer": 3,
    "why": "The issue is uncontrolled relevance, not age alone. Review triggers should include material role, process or workforce changes, alongside a proportionate review schedule. Compare current requirements with current evidence, preserve what remains valid and document changed priorities. An examination can remain easy to pass while measuring obsolete requirements. Repeating an unchanged instrument or discarding the entire curriculum would not provide a reasoned assessment of the changed needs. Source alignment: ASQ CMBB Body of Knowledge, IV.A; IV.B. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-004",
    "optionRationales": [
      "A consistent questionnaire can repeatedly measure the wrong requirements if it is not updated for changed roles.",
      "Elapsed time alone does not establish that every part of the curriculum or assessment is invalid.",
      "Pass rates only address what the examination tests; they do not verify coverage of newly required competencies.",
      "Correct. It provides accountable, change-sensitive maintenance while preserving evidence that remains applicable."
    ],
    "trap": "Refresh the requirement-to-capability comparison when material conditions change. Assessment age is a review signal, not proof that every previous finding is obsolete.",
    "distractors": [
      "A consistent questionnaire can repeatedly measure the wrong requirements if it is not updated for changed roles.",
      "Elapsed time alone does not establish that every part of the curriculum or assessment is invalid.",
      "Pass rates only address what the examination tests; they do not verify coverage of newly required competencies.",
      "Correct. It provides accountable, change-sensitive maintenance while preserving evidence that remains applicable."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.A; IV.B"
      },
      {
        "title": "CDC: Assess Training Needs — Conducting Needs Analysis",
        "url": "https://www.cdc.gov/training-development/php/about/assess-training-needs-conducting-needs-analysis.html",
        "locator": "Needs assessment and training needs analysis"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "An employer's internal Black Belt program specifies objectives for interpreting analyses and leading an improvement project. Its certificate is intended to attest to those competencies, but the plan contains only content, attendance rules and dates. Before delivery, which assessment design best supports that intended claim?",
    "options": [
      "Award the competency certificate for attendance and a satisfaction survey, then leave later supervisors to decide informally whether the employee can perform the stated tasks.",
      "Map objectives to aligned knowledge and performance evidence, set defensible criteria and calibrated reviews, and provide feedback and reassessment before making the internal competency-certification decision.",
      "Use a difficult multiple-choice test as the sole evidence for both statistical interpretation and observed project leadership, without checking its coverage of the stated performance objectives.",
      "Let each instructor choose a passing threshold after viewing cohort scores and certify a fixed percentage of participants, regardless of whether they meet the required competencies."
    ],
    "answer": 1,
    "why": "Assessment should support the specific claim the employer intends to make. Interpretation can be assessed through suitable problems, while demonstrated leadership requires appropriate performance evidence. Criteria, coverage and reviewer consistency should be planned before the decision, with feedback and an appropriate reassessment route. Attendance, satisfaction or a post hoc pass quota do not establish competence. This case concerns an employer's internal credential, not ASQ certification requirements. Source alignment: ASQ CMBB Body of Knowledge, IV.B; IV.D. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-005",
    "optionRationales": [
      "Attendance and satisfaction do not establish the statistical and leadership capabilities claimed by the certificate.",
      "Correct. It aligns evidence and criteria to the intended competency claim and addresses consistency and remediation.",
      "A difficult test is not necessarily a valid measure of every objective, particularly observed leadership performance.",
      "Post hoc thresholds and pass quotas are not criterion-based evidence that individuals meet the required standard."
    ],
    "trap": "Specify what the credential claims, then align assessments and standards to that claim. Course completion, proficiency and demonstrated change in learning are different conclusions.",
    "distractors": [
      "Attendance and satisfaction do not establish the statistical and leadership capabilities claimed by the certificate.",
      "Correct. It aligns evidence and criteria to the intended competency claim and addresses consistency and remediation.",
      "A difficult test is not necessarily a valid measure of every objective, particularly observed leadership performance.",
      "Post hoc thresholds and pass quotas are not criterion-based evidence that individuals meet the required standard."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.B; IV.D"
      },
      {
        "title": "CDC Quality Training Standards",
        "url": "https://www.cdc.gov/training-development/php/qts/index.html",
        "locator": "Standards 1–8; use only the principles relevant to each original scenario"
      },
      {
        "title": "CDC: Evaluate Training — Measuring Effectiveness",
        "url": "https://www.cdc.gov/training-development/php/about/evaluate-training-measuring-effectiveness.html",
        "locator": "What to evaluate; before and after training; delayed evaluation"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "An insurance company's review of unsuccessful improvement projects assigns each project one primary failure category, as shown in the table. These retrospective classifications are not experimental proof of cause. The current Green Belt course allocates 90% of time to statistical tools and 10% to stakeholder work. Technical minimum competencies must still be met. Which response to this evidence is most defensible?",
    "options": [
      "Set the next course's instructional percentages equal to the failure-category percentages, treating the retrospective distribution as the optimal allocation without checking gaps or learning outcomes.",
      "Validate the attributed skill and work-system gaps, then pilot more applied stakeholder practice while preserving technical competencies; assess learning, transfer and project outcomes before broader reallocation.",
      "Retain the 90/10 allocation and lower the technical passing standard, so more participants finish training even though the identified stakeholder-performance concern remains unaddressed.",
      "Remove all statistical instruction and move its time to stakeholder engagement, assuming the largest failure category makes the other required competencies unnecessary for future projects."
    ],
    "answer": 1,
    "why": "The table is a prioritization signal for further needs analysis and a targeted pilot, not a causal estimate or an instructional optimization model. Failure categories can reflect organizational barriers as well as trainable skills. Validate the interpretation, preserve required technical competence and evaluate a revised approach using aligned learning and workplace measures. The 70% attribution does not imply that 70% of teaching time is optimal, and the categories do not establish a universal curriculum split. Source alignment: ASQ CMBB Body of Knowledge, IV.A; IV.B; IV.D. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "chart": {
      "type": "data-table",
      "title": "Current course allocation and retrospective failure classification",
      "altText": "Current teaching time shares and primary categories assigned in a retrospective review of unsuccessful projects. The two percentage columns have different denominators and are not causal estimates.",
      "columns": [
        "Content area",
        "Share of course time",
        "Share of unsuccessful projects assigned this primary category"
      ],
      "rows": [
        [
          "Statistical tools",
          "90%",
          "15%"
        ],
        [
          "Change management / stakeholder engagement",
          "10%",
          "70%"
        ],
        [
          "Other",
          "0%",
          "15%"
        ]
      ]
    },
    "set": 3,
    "qid": "mbb:set-3:d4-006",
    "optionRationales": [
      "Failure attribution shares and optimal instructional time are different quantities; directly copying the percentages lacks a justified model.",
      "Correct. It investigates the signal and tests a targeted change without sacrificing required technical competence or asserting causation.",
      "Lowering a passing standard neither addresses the stakeholder gap nor preserves the defined technical requirement.",
      "The largest retrospective category does not eliminate the need for statistical competence or prove that training alone resolves the failures."
    ],
    "trap": "Do not convert retrospective failure percentages directly into curriculum weights. Verify the gap and pilot the response while preserving required competencies.",
    "distractors": [
      "Failure attribution shares and optimal instructional time are different quantities; directly copying the percentages lacks a justified model.",
      "Correct. It investigates the signal and tests a targeted change without sacrificing required technical competence or asserting causation.",
      "Lowering a passing standard neither addresses the stakeholder gap nor preserves the defined technical requirement.",
      "The largest retrospective category does not eliminate the need for statistical competence or prove that training alone resolves the failures."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.A; IV.B; IV.D"
      },
      {
        "title": "CDC Quality Training Standards",
        "url": "https://www.cdc.gov/training-development/php/qts/index.html",
        "locator": "Standards 1–8; use only the principles relevant to each original scenario"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "A DFSS course on QFD and robust design assumes that learners can interpret variation, use basic statistical reasoning and describe customer requirements. Several new entrants struggle with those tasks; no prerequisite skills or bridging route were specified. Employees may have acquired the skills through different credentials or work experience. Which admission-and-support policy best addresses the gap?",
    "options": [
      "Define and assess the entry competencies, accept credible equivalent evidence, and offer targeted bridging before advanced work rather than using one credential as the only route.",
      "Require an existing Green Belt certificate as the sole entry condition and waive prerequisite assessment, because the certificate necessarily establishes every skill assumed by this particular course.",
      "Keep admission unrestricted and slow every advanced session to repeat all foundations, without checking who needs support or whether the advanced learning objectives can still be met.",
      "Admit only employees with prior DFSS job titles and treat that experience label as sufficient evidence, even when they cannot perform the specified prerequisite tasks."
    ],
    "answer": 0,
    "why": "The missing element is an explicit match between the course's assumed competencies and entrants' demonstrated readiness, together with a way to close gaps. Relevant experience or another credential can provide equivalent evidence, but neither a title nor a Green Belt certificate automatically covers every prerequisite of this course. DFSS does not universally require a particular DMAIC credential. Targeted bridges preserve access and rigor without automatically abandoning the advanced objectives. Source alignment: ASQ CMBB Body of Knowledge, IV.B; IV.C.2. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-007",
    "optionRationales": [
      "Correct. It verifies the actual prerequisite skills and offers an equitable route to acquire missing foundations.",
      "The stated course prerequisites must be verified; one certificate is not automatically sufficient or the only valid evidence.",
      "Unassessed repetition can consume the advanced course without efficiently addressing individual prerequisite gaps.",
      "A job title does not override direct evidence that the required entry competencies have not been demonstrated."
    ],
    "trap": "Prerequisites should describe what learners must be able to do. Accept equivalent evidence and support missing foundations rather than imposing an unsupported universal credential rule.",
    "distractors": [
      "Correct. It verifies the actual prerequisite skills and offers an equitable route to acquire missing foundations.",
      "The stated course prerequisites must be verified; one certificate is not automatically sufficient or the only valid evidence.",
      "Unassessed repetition can consume the advanced course without efficiently addressing individual prerequisite gaps.",
      "A job title does not override direct evidence that the required entry competencies have not been demonstrated."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.B; IV.C.2"
      },
      {
        "title": "CDC Quality Training Standards",
        "url": "https://www.cdc.gov/training-development/php/qts/index.html",
        "locator": "Standards 1–8; use only the principles relevant to each original scenario"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "A plant's Green Belt course has approved content and dates, but no owner has confirmed shift coverage, an accessible venue, materials or software access. Delivery starts in four weeks, and production managers cannot release all shifts simultaneously. Which action best protects delivery without changing the learning objectives?",
    "options": [
      "Send the approved dates to participants and treat their acceptance as confirmation of release time, equipment access and coverage, leaving unresolved logistics to individual learners.",
      "Assign a logistics owner and a readiness plan covering release agreements, accessible facilities, materials, software and contingency options, with deadlines and escalation before each delivery session.",
      "Book the largest venue and order printed manuals first, then require every shift to attend the same session even though the stated release constraint remains unresolved.",
      "Move the course online and mark logistics complete, assuming remote delivery removes the need to confirm shift coverage, technology access, materials and learner accommodations."
    ],
    "answer": 1,
    "why": "The course needs accountable coordination of the resources that make participation possible. An owner, readiness milestones, release agreements and contingency arrangements turn known dependencies into manageable actions. A venue booking or a modality change addresses only part of the problem. Online delivery still requires time, technology and accessibility planning. The four-week lead time calls for a feasible plan and escalation of gaps, not automatic cancellation or a universal lead-time rule. Source alignment: ASQ CMBB Body of Knowledge, IV.B; IV.C.4. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-008",
    "optionRationales": [
      "An invitation acceptance does not establish management release, suitable access or production coverage.",
      "Correct. It assigns accountability and verifies the interdependent arrangements before they can disrupt instruction.",
      "A large room does not resolve the explicit inability to release all shifts together.",
      "Remote delivery changes logistical requirements but does not eliminate them or verify learner access."
    ],
    "trap": "Logistics are learning-enablement dependencies: ownership, release time, access and readiness need verification regardless of whether delivery is physical or online.",
    "distractors": [
      "An invitation acceptance does not establish management release, suitable access or production coverage.",
      "Correct. It assigns accountability and verifies the interdependent arrangements before they can disrupt instruction.",
      "A large room does not resolve the explicit inability to release all shifts together.",
      "Remote delivery changes logistical requirements but does not eliminate them or verify learner access."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.B; IV.C.4"
      },
      {
        "title": "CDC Quality Training Standards",
        "url": "https://www.cdc.gov/training-development/php/qts/index.html",
        "locator": "Standards 1–8; use only the principles relevant to each original scenario"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "An MBB is adapting Black Belt materials for a workforce in which 60% learned English as an additional language. A pilot with representative learners found confusion about technical terms and dense instructions, but did not identify a gap in the required statistical reasoning. Learners use several first languages and proficiency varies. Which adaptation best addresses the demonstrated access barrier while preserving rigor?",
    "options": [
      "Use plain-language instructions, labeled visuals with text alternatives and technically checked multilingual glossaries where needed; test comprehension with representative learners while retaining the statistical objectives.",
      "Translate the existing dense text into the most common first language and deliver only that version, assuming everyone in the 60% group has the same language and proficiency needs.",
      "Replace technical definitions with everyday approximations and reduce the assessment's statistical demands, so terminology barriers no longer affect scores even if the competency claim changes.",
      "Add decorative images and retain the original instructions unchanged, treating the presence of visuals as sufficient evidence that all identified comprehension barriers have been removed."
    ],
    "answer": 0,
    "why": "The pilot identifies a terminology and instructional-access issue, not lower statistical capability. Adapt the language and representation, check technical equivalence and verify comprehension with the actual audience. Language background alone does not determine proficiency or a preferred learning style. Visuals should carry relevant information and have usable text alternatives; a glossary needs technical review. Keep the intended reasoning demand and the competency standard rather than concealing the barrier by lowering them. Source alignment: ASQ CMBB Body of Knowledge, IV.C.2; IV.C.4. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-009",
    "optionRationales": [
      "Correct. It addresses the observed barrier, validates the adaptation and preserves the intended technical competence.",
      "The workforce has multiple languages and variable proficiency; a single exclusive translation does not meet those needs.",
      "Changing the assessed competence avoids rather than solves the access problem and weakens the credential's intended meaning.",
      "Decorative images do not explain difficult terminology or demonstrate that instructions have become comprehensible."
    ],
    "trap": "Assess actual access needs rather than inferring ability from language background. Improve instructional access and validate technical equivalence without lowering the reasoning standard.",
    "distractors": [
      "Correct. It addresses the observed barrier, validates the adaptation and preserves the intended technical competence.",
      "The workforce has multiple languages and variable proficiency; a single exclusive translation does not meet those needs.",
      "Changing the assessed competence avoids rather than solves the access problem and weakens the credential's intended meaning.",
      "Decorative images do not explain difficult terminology or demonstrate that instructions have become comprehensible."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.C.2; IV.C.4"
      },
      {
        "title": "CDC Quality Training Standards",
        "url": "https://www.cdc.gov/training-development/php/qts/index.html",
        "locator": "Standards 1–8; use only the principles relevant to each original scenario"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "A Black Belt course uses one five-day workshop with no planned practice afterward. A role-aligned assessment three months later finds poor retention, but there was no comparison group and workplace practice opportunities varied. The MBB can redesign reinforcement without lowering the competency standard. Which response best uses learning evidence without overstating the cause of the observed result?",
    "options": [
      "Pilot spaced retrieval and applied practice with feedback and coaching after the workshop; compare aligned immediate and delayed performance while checking participation and workplace support.",
      "Repeat the same five-day workshop once more with no follow-up, then infer long-term retention from satisfaction and attendance collected on its final day.",
      "Conclude that workshop concentration is the proven sole cause and guarantee that a distributed timetable will eliminate retention problems, without evaluating the revised design.",
      "Provide an optional recording library and treat each recorded view as evidence of retained competence, without asking learners to retrieve or apply the material."
    ],
    "answer": 0,
    "why": "Distributed retrieval and applied practice are defensible reinforcement strategies, but the observed cohort does not isolate the cause of its poor retention. Practice opportunity, participation and other conditions may also matter. Pilot reinforcement with feedback and assess the target skills after appropriate delays. Immediate scores, views and satisfaction are not equivalent to retained performance. The intervention is evidence-informed, not a guarantee of a particular outcome for every learner or a universal ban on intensive workshops. Source alignment: ASQ CMBB Body of Knowledge, IV.C.2; IV.D. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-010",
    "optionRationales": [
      "Correct. It adds a plausible evidence-informed mechanism and evaluates retention while examining alternative influences.",
      "Another massed exposure and end-of-course reactions do not verify durable recall or application.",
      "Without a suitable comparison, the original result cannot establish a unique cause or justify a guarantee.",
      "Watching a recording is exposure, not direct evidence that the learner can later retrieve and apply the skill."
    ],
    "trap": "A plausible learning principle supports a testable redesign, not a causal diagnosis of one cohort. Measure delayed performance and the conditions that support practice.",
    "distractors": [
      "Correct. It adds a plausible evidence-informed mechanism and evaluates retention while examining alternative influences.",
      "Another massed exposure and end-of-course reactions do not verify durable recall or application.",
      "Without a suitable comparison, the original result cannot establish a unique cause or justify a guarantee.",
      "Watching a recording is exposure, not direct evidence that the learner can later retrieve and apply the skill."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.C.2; IV.D"
      },
      {
        "title": "Butowska-Buczynska et al. (2024): The role of variable retrieval in effective learning",
        "url": "https://doi.org/10.1073/pnas.2413511121",
        "locator": "Experiments on retrieval practice and spacing; principle supports a pilot, not a guarantee for Black Belt trainees"
      },
      {
        "title": "CDC: Evaluate Training — Measuring Effectiveness",
        "url": "https://www.cdc.gov/training-development/php/about/evaluate-training-measuring-effectiveness.html",
        "locator": "What to evaluate; before and after training; delayed evaluation"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "A machining workforce uses technically accurate off-the-shelf Green Belt modules illustrated with call-center cases. Completion is low, and interviews plus observed exercises show that learners struggle to translate the cases into machining decisions. Access and release-time arrangements are functioning. Budget does not permit replacing the entire course. Which response best targets the demonstrated transfer problem?",
    "options": [
      "Keep every example unchanged and increase reminder emails, using completion as the sole outcome without checking whether learners can apply the concepts to machining decisions.",
      "Retain valid core content and pilot machining-specific examples and application tasks, checking both local transfer and use of the same principles in an unfamiliar context.",
      "Replace only company names in the call-center examples with machine names, while keeping the original service assumptions and tasks even where they do not fit machining work.",
      "Remove the general principles and teach only the shop's current procedures, using accurate procedural repetition as sufficient evidence of transferable Green Belt reasoning."
    ],
    "answer": 1,
    "why": "The available evidence identifies difficulty applying otherwise valid content to work decisions. A targeted supplement can address that gap within the budget. Contextual adaptation must preserve the underlying statistical and improvement principles, and an unfamiliar application helps check transfer beyond memorized examples. Reminder emails, cosmetic relabeling and replacing concepts with fixed procedures do not resolve that requirement. This case supports a pilot; it does not prove that unrelated-industry examples are always ineffective. Source alignment: ASQ CMBB Body of Knowledge, IV.C.2–3; IV.D. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-011",
    "optionRationales": [
      "Reminders may improve participation but do not directly address the observed difficulty translating concepts into work decisions.",
      "Correct. It targets the evidenced gap while preserving reusable core content and checking broader transfer.",
      "Cosmetic terminology changes can leave the actual task and assumptions inappropriate to the learner's work.",
      "Repeating current procedures does not demonstrate transferable reasoning or the ability to improve a different process."
    ],
    "trap": "Contextualize the task and assumptions, not just the labels. Preserve general principles and test transfer beyond the specific examples practiced.",
    "distractors": [
      "Reminders may improve participation but do not directly address the observed difficulty translating concepts into work decisions.",
      "Correct. It targets the evidenced gap while preserving reusable core content and checking broader transfer.",
      "Cosmetic terminology changes can leave the actual task and assumptions inappropriate to the learner's work.",
      "Repeating current procedures does not demonstrate transferable reasoning or the ability to improve a different process."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.C.2–3; IV.D"
      },
      {
        "title": "CDC Quality Training Standards",
        "url": "https://www.cdc.gov/training-development/php/qts/index.html",
        "locator": "Standards 1–8; use only the principles relevant to each original scenario"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "A Black Belt cohort spans five time zones with variable shifts. Course objectives include independent analysis and observed live facilitation of a team discussion. Managers can protect short practice sessions in several repeated time slots, but cannot align everyone for one fixed weekly meeting. Which delivery design best meets both the access constraint and the facilitation objective?",
    "options": [
      "Use self-paced modules alone and assess facilitation through a multiple-choice quiz, treating knowledge about facilitation as equivalent to observing the required live performance.",
      "Deliver one fixed weekly live session for everyone and provide a recording to absentees, counting recording completion as the same evidence as participating in assessed facilitation.",
      "Make all live practice optional and award completion for asynchronous analysis modules, allowing learners to omit the stated facilitation objective when scheduling is inconvenient.",
      "Use asynchronous foundations and analysis tasks with feedback, plus repeated small-group live practice slots with equivalent assessment criteria and tracked completion of the facilitation objective."
    ],
    "answer": 3,
    "why": "The design must satisfy both the stated performance objective and feasible access. Asynchronous work provides scheduling flexibility, while the protected repeated sessions allow direct assessment of live facilitation. Equivalent criteria and completion tracking reduce unequal evidence across time slots. A hybrid format is justified by these particular conditions, not by time-zone dispersion alone. A quiz or recording may support learning but cannot substitute for the explicitly required observed performance. Source alignment: ASQ CMBB Body of Knowledge, IV.B; IV.C.4. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-012",
    "optionRationales": [
      "Knowing facilitation principles is not the same evidence as demonstrating the specified live facilitation skill.",
      "A single fixed time conflicts with the constraint, and viewing a recording does not supply the missing performance evidence.",
      "Optional participation would permit completion without meeting a required learning objective.",
      "Correct. It combines feasible access with equivalent evidence of both independent analysis and live facilitation."
    ],
    "trap": "Choose modality from the required performance and real constraints. Hybrid delivery is not automatically best; here repeated live opportunities are feasible and necessary for the stated objective.",
    "distractors": [
      "Knowing facilitation principles is not the same evidence as demonstrating the specified live facilitation skill.",
      "A single fixed time conflicts with the constraint, and viewing a recording does not supply the missing performance evidence.",
      "Optional participation would permit completion without meeting a required learning objective.",
      "Correct. It combines feasible access with equivalent evidence of both independent analysis and live facilitation."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.B; IV.C.4"
      },
      {
        "title": "CDC Quality Training Standards",
        "url": "https://www.cdc.gov/training-development/php/qts/index.html",
        "locator": "Standards 1–8; use only the principles relevant to each original scenario"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "A Six Sigma program reports high trainee satisfaction, but its evaluation register has no direct evidence of knowledge gain, workplace application or verified project results. Managers describe weak projects anecdotally. The table shows the current coverage. Leadership wants to identify where learning or transfer is failing, not merely produce a larger dashboard. Which evaluation plan best supports that decision?",
    "options": [
      "Keep reaction surveys and add more satisfaction questions, then use their combined average to represent learning, application and results because it is collected consistently from learners.",
      "Retain useful reaction feedback, add aligned pre/post skill evidence and follow-up workplace measures, and examine project results with context and comparison evidence rather than treating the levels as causal proof.",
      "Drop reaction and learning measures and track only project benefits, attributing any subsequent financial change to training without considering project difficulty, staffing or other concurrent changes.",
      "Record all four evaluation levels but assume strong scores at an earlier level establish improvement at later levels, so no direct workplace or project-outcome follow-up is necessary."
    ],
    "answer": 1,
    "why": "Reaction, learning, workplace behavior and organizational results answer different evaluation questions. Satisfaction can help improve delivery but does not establish skill gain or transfer. Aligned pre/post evidence assesses change in learning; delayed observation and project measures examine application and outcomes. Context and credible comparisons are needed for attribution. The four-level framework organizes evidence; it does not itself prove a causal sequence, and describing reaction as universally worthless or simply the weakest measure misses its distinct purpose. Source alignment: ASQ CMBB Body of Knowledge, IV.D. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "chart": {
      "type": "data-table",
      "title": "Current training evaluation coverage",
      "altText": "Reaction is measured as high satisfaction. Direct evidence of learning, workplace behavior and standardized project results is not collected.",
      "columns": [
        "Evaluation level",
        "Evidence sought",
        "Current coverage"
      ],
      "rows": [
        [
          "1. Reaction",
          "Course satisfaction and relevance",
          "Satisfaction measured: high"
        ],
        [
          "2. Learning",
          "Knowledge and skill acquisition",
          "Direct pre/post assessment absent"
        ],
        [
          "3. Behavior",
          "Application in the workplace",
          "Not systematically measured"
        ],
        [
          "4. Results",
          "Targeted organizational outcomes",
          "No standardized tracking; weak outcomes reported anecdotally"
        ]
      ]
    },
    "set": 3,
    "qid": "mbb:set-3:d4-013",
    "optionRationales": [
      "Additional satisfaction items still measure reaction; aggregation does not transform them into performance or outcome evidence.",
      "Correct. It uses complementary evidence to locate the gap and distinguishes outcome tracking from causal attribution.",
      "Results alone cannot locate the learning or transfer gap and can change for reasons unrelated to training.",
      "Earlier-level scores do not establish later-level performance without direct evidence of the relevant outcomes."
    ],
    "trap": "Evaluation levels are different questions, not a causal ladder. Retain useful reaction evidence, verify learning and transfer directly, and qualify attribution of business results.",
    "distractors": [
      "Additional satisfaction items still measure reaction; aggregation does not transform them into performance or outcome evidence.",
      "Correct. It uses complementary evidence to locate the gap and distinguishes outcome tracking from causal attribution.",
      "Results alone cannot locate the learning or transfer gap and can change for reasons unrelated to training.",
      "Earlier-level scores do not establish later-level performance without direct evidence of the relevant outcomes."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.D"
      },
      {
        "title": "Kirkpatrick Partners: The Kirkpatrick Model",
        "url": "https://www.kirkpatrickpartners.com/the-kirkpatrick-model/",
        "locator": "Reaction, Learning, Behavior and Results; interpretation of the four-level framework"
      },
      {
        "title": "CDC: Evaluate Training — Measuring Effectiveness",
        "url": "https://www.cdc.gov/training-development/php/about/evaluate-training-measuring-effectiveness.html",
        "locator": "What to evaluate; before and after training; delayed evaluation"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "An MBB wants to estimate whether offering a new Black Belt training program improves project success, rather than merely whether participants pass its exam. Comparable eligible teams can be randomly assigned to immediate or delayed training; ordinary project support remains available to both, and all will eventually receive training. Which evaluation plan gives the strongest causal evidence under these conditions?",
    "options": [
      "Compare only certified graduates with all untrained staff, omit trainees who did not complete the program, and attribute the difference to training without accounting for selection or project opportunities.",
      "Compare this year's trained teams with last year's entire portfolio using different success definitions, treating any improvement as the program effect without assessing concurrent organizational changes.",
      "Use certification pass rates and post-course confidence as the primary outcomes, assuming both are direct measures of successful project execution and realized benefits.",
      "Randomize eligible teams to rollout timing, predefine project-success measures and a common follow-up window, and compare all assigned teams while recording baseline differences, missing outcomes and other interventions."
    ],
    "answer": 3,
    "why": "Random assignment to feasible rollout timing strengthens causal comparison by reducing systematic selection differences in expectation. Follow all assigned teams, not only successful graduates, with consistent outcome definitions and comparable observation windows. This estimates the effect of the offer or assignment under the observed implementation; it is not automatically the effect of completing certification. Account for team-level assignment, uncertainty, missing outcomes and spillover. Randomization does not guarantee exact baseline equality or eliminate every implementation threat. Source alignment: ASQ CMBB Body of Knowledge, IV.D. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-014",
    "optionRationales": [
      "Restricting analysis to graduates creates selection bias and does not preserve the assigned comparison.",
      "Changing definitions and calendar conditions confounds the comparison; a historical increase alone does not isolate training's effect.",
      "Exam performance and confidence do not directly measure subsequent project success or realized benefits.",
      "Correct. It uses the feasible randomized comparison, consistent outcomes and follow-up of all assigned teams."
    ],
    "trap": "Separate proficiency from improvement and outcome association from causal evidence. Preserve randomized assignment in the analysis, including non-completers and missing-outcome investigation.",
    "distractors": [
      "Restricting analysis to graduates creates selection bias and does not preserve the assigned comparison.",
      "Changing definitions and calendar conditions confounds the comparison; a historical increase alone does not isolate training's effect.",
      "Exam performance and confidence do not directly measure subsequent project success or realized benefits.",
      "Correct. It uses the feasible randomized comparison, consistent outcomes and follow-up of all assigned teams."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.D"
      },
      {
        "title": "CDC: Evaluate Training — Measuring Effectiveness",
        "url": "https://www.cdc.gov/training-development/php/about/evaluate-training-measuring-effectiveness.html",
        "locator": "What to evaluate; before and after training; delayed evaluation"
      },
      {
        "title": "CDC Program Evaluation Framework, 2024",
        "url": "https://www.cdc.gov/mmwr/volumes/73/rr/rr7306a1.htm",
        "locator": "Focus evaluation questions and design; experimental, quasi-experimental and observational designs"
      }
    ]
  },
  {
    "sub": "mbb-training",
    "stem": "After Green Belt training, most learners report confidence in applying DMAIC, but fewer than 20% have launched a project six months later. The office has not measured demonstrated skills, eligible project opportunities, protected time or manager support. Which conclusion and follow-up are best supported by the available evidence?",
    "options": [
      "Treat this as a confidence-to-application gap; assess demonstrated competence and opportunity/support barriers together, then target the supported causes rather than presuming either the curriculum or the work system is responsible.",
      "Conclude that the curriculum is effective because confidence is high and investigate only management support, excluding skill assessment from the follow-up to avoid retesting certified learners.",
      "Conclude that the curriculum has failed because launches are below 20% and replace it immediately, without checking whether learners had suitable projects or time to apply the skills.",
      "Classify every non-launching learner as incapable and mandate an immediate project, using launch counts alone as proof of competence regardless of project eligibility, risk or sponsorship."
    ],
    "answer": 0,
    "why": "Confidence is self-report, not demonstrated knowledge or skill. A low launch proportion can reflect competence, opportunity, sponsorship, workload, eligibility or several factors. The evidence does not establish which cause dominates, nor does it define a universal acceptable launch threshold. Collect aligned performance and application-context evidence, including who had an appropriate opportunity to launch. Then choose an intervention tied to the supported gap rather than assuming either training or management must be at fault. Source alignment: ASQ CMBB Body of Knowledge, IV.D. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d4-015",
    "optionRationales": [
      "Correct. It investigates both capability and application conditions without making a causal claim unsupported by the available evidence.",
      "High confidence does not establish curriculum effectiveness, so excluding competence assessment would prejudge a plausible explanation.",
      "The launch percentage alone does not separate a learning problem from a lack of suitable application opportunities.",
      "Launch counts neither establish competence nor justify unsafe or unsupported project selection."
    ],
    "trap": "Do not treat confidence as measured knowledge or a low launch rate as a diagnosis. Check capability, eligible opportunities and support before selecting the intervention.",
    "distractors": [
      "Correct. It investigates both capability and application conditions without making a causal claim unsupported by the available evidence.",
      "High confidence does not establish curriculum effectiveness, so excluding competence assessment would prejudge a plausible explanation.",
      "The launch percentage alone does not separate a learning problem from a lack of suitable application opportunities.",
      "Launch counts neither establish competence nor justify unsafe or unsupported project selection."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "IV.D"
      },
      {
        "title": "CDC: Evaluate Training — Measuring Effectiveness",
        "url": "https://www.cdc.gov/training-development/php/about/evaluate-training-measuring-effectiveness.html",
        "locator": "What to evaluate; before and after training; delayed evaluation"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "A new champion at a beverage distributor assumes that assigning a Black Belt ends the champion's involvement. The Belt can lead technical work but cannot secure cross-department release time or resolve competing business priorities. No role agreement defines those decisions. Which initial coaching intervention best establishes an active, appropriately bounded champion role?",
    "options": [
      "Agree on the business decisions, resource commitments and escalations the champion owns, define how the Belt and MBB supply technical evidence, and schedule follow-up on those commitments.",
      "Ask the champion to approve only the final savings figure and let the Belt negotiate all cross-department priorities without a defined escalation route or resource authority.",
      "Give the champion approval of every analytical step and require the team to wait for personal direction, using technical sign-offs as the main evidence of executive support.",
      "Send a standard role description and assume responsibilities are accepted, without discussing the current resource barrier, checking understanding or agreeing how commitments will be reviewed."
    ],
    "answer": 0,
    "why": "The immediate problem is a gap between the project's needs and the champion's understood decision responsibilities. A concrete agreement should identify resource and priority decisions, escalation expectations and the technical contributions of the Belt and MBB. Follow-up verifies an active commitment rather than ceremonial support. The champion need not perform every analysis or be absent from technical discussion; the purpose is clear, usable accountability appropriate to the project's governance. Source alignment: ASQ CMBB Body of Knowledge, V.A.1; V.A.3–4. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d5-001",
    "optionRationales": [
      "Correct. It connects the role to current organizational barriers, preserves technical responsibilities and verifies commitments.",
      "Final financial approval does not supply the missing authority needed to secure resources and resolve current priority conflicts.",
      "Requiring executive direction for every analytical step creates a bottleneck and confuses business governance with routine technical execution.",
      "A document alone does not establish shared understanding or resolve the live resource and escalation gap."
    ],
    "trap": "Coach to observable commitments and decision rights, not just a role label. Sponsorship should remove barriers without absorbing the Belt's routine technical responsibility.",
    "distractors": [
      "Correct. It connects the role to current organizational barriers, preserves technical responsibilities and verifies commitments.",
      "Final financial approval does not supply the missing authority needed to secure resources and resolve current priority conflicts.",
      "Requiring executive direction for every analytical step creates a bottleneck and confuses business governance with routine technical execution.",
      "A document alone does not establish shared understanding or resolve the live resource and escalation gap."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.A.1; V.A.3–4"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "A VP-level champion attends every working meeting and directs analysts to change methods based on personal preference without discussing the data. The Belt is accountable for technical execution. The champion legitimately owns business constraints and resource decisions, and the team still needs that support. Which coaching response best corrects the behavior while preserving useful engagement?",
    "options": [
      "Let the Belt privately reverse executive instructions after each meeting, maintaining apparent agreement rather than openly clarifying decision rights and the evidence needed for analytical changes.",
      "Give private, specific feedback; agree boundaries for business and technical decisions, invite evidence-based challenge, and use targeted reviews and escalation rather than routine unsupported analytical direction.",
      "Exclude the champion from every working discussion and withhold technical uncertainties until the final gate, treating any executive question about analysis as inappropriate interference.",
      "Require the MBB to approve all champion-team communication in advance, replacing the existing bottleneck with another approval layer without addressing the observed decision behavior."
    ],
    "answer": 1,
    "why": "The issue is unsupported direction that bypasses accountable technical reasoning, not attendance itself. Coaching should describe the behavior and its effects, clarify decision rights and establish constructive ways to challenge evidence or raise business constraints. Targeted involvement and escalation preserve the champion's support while avoiding routine micromanagement. Secretly reversing instructions, excluding all engagement or routing every exchange through the MBB does not create a clear shared operating agreement. Source alignment: ASQ CMBB Body of Knowledge, V.A.2; V.A.4. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d5-002",
    "optionRationales": [
      "Private reversal preserves conflicting instructions and avoids the necessary agreement about how decisions are made.",
      "Correct. It addresses the specific behavior, respects both authority domains and retains constructive executive engagement.",
      "Attendance and questions are not inherently improper; blanket exclusion can remove useful support and conceal important uncertainty.",
      "An extra communication gate adds dependency on the MBB without necessarily changing unsupported direction or clarifying accountability."
    ],
    "trap": "Separate useful executive challenge from unsupported technical direction. Coach the observable behavior and agree decision boundaries; attendance alone is not the defect.",
    "distractors": [
      "Private reversal preserves conflicting instructions and avoids the necessary agreement about how decisions are made.",
      "Correct. It addresses the specific behavior, respects both authority domains and retains constructive executive engagement.",
      "Attendance and questions are not inherently improper; blanket exclusion can remove useful support and conceal important uncertainty.",
      "An extra communication gate adds dependency on the MBB without necessarily changing unsupported direction or clarifying accountability."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.A.2; V.A.4"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "A food-processing champion routinely approves charters from a brief verbal summary without checking scope or resource commitments. A significant scope error remained unnoticed for two months. There is no identified immediate safety emergency, but affected commitments may need revision. Which coaching intervention best addresses both the present problem and the approval practice?",
    "options": [
      "Send the champion a charter template and continue under the current approval, considering the issue resolved once future documents contain all required headings.",
      "Review the current scope error and affected commitments with the champion and Belt, arrange any needed reauthorization, and rehearse an evidence-based approval checklist with follow-up on later charters.",
      "Transfer all charter approvals permanently to the MBB without reviewing the current error, assuming technical expertise alone supplies the business authority and resources needed by each project.",
      "Require longer verbal summaries but leave scope and resource confirmation unassigned, treating presentation length as sufficient evidence that the champion has performed the approval review."
    ],
    "answer": 1,
    "why": "The current scope error needs assessment and, where required, correction and reauthorization; future coaching alone does not remedy it. Use the actual case to practice checking the problem, scope, expected value, resource commitments and decision authority, then verify the changed practice. Verbal briefing can support a review, but approval still needs sufficient evidence and accountable confirmation. A longer presentation or a template is not a substitute for that decision process. Source alignment: ASQ CMBB Body of Knowledge, V.A.2; V.A.4. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d5-003",
    "optionRationales": [
      "A template does not correct existing commitments or demonstrate that the champion evaluates substantive evidence.",
      "Correct. It remedies the present governance gap and builds a specific review behavior with later verification.",
      "Technical expertise does not automatically replace business approval authority, and the current scope error would remain unaddressed.",
      "Presentation length is not evidence that scope and resource implications were understood and accepted."
    ],
    "trap": "Correct the current decision as well as the future habit. Use the real charter to practice substantive review, document required reauthorization and verify follow-through.",
    "distractors": [
      "A template does not correct existing commitments or demonstrate that the champion evaluates substantive evidence.",
      "Correct. It remedies the present governance gap and builds a specific review behavior with later verification.",
      "Technical expertise does not automatically replace business approval authority, and the current scope error would remain unaddressed.",
      "Presentation length is not evidence that scope and resource implications were understood and accepted."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.A.2; V.A.4"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "An executive sponsor has limited time and asks the MBB to supply documents to sign without explaining the methodology. The sponsor remains responsible for scope, resource and continuation decisions. The MBB can provide short coaching sessions tied to upcoming reviews. Which plan best develops usable oversight capability within that constraint?",
    "options": [
      "Provide a prepared question script and measure success by how many questions the sponsor reads aloud, without checking understanding of evidence or decisions.",
      "Require full Black Belt training before the sponsor makes any decision, regardless of the actual oversight tasks or the timing of the upcoming reviews.",
      "Have the MBB make every scope and funding decision and request the sponsor's signature afterward, preserving speed by removing the need to build the sponsor's own judgment.",
      "Use brief sessions on actual charter and gate evidence, rehearse the sponsor's decision questions, check understanding through explanation and application, and follow up during subsequent reviews."
    ],
    "answer": 3,
    "why": "Coaching should be proportional to the decisions the sponsor owns, not reduced to signatures or expanded into unnecessary full technical certification. Real review material, rehearsal and an understanding check make the skill observable. Follow-up can show whether the sponsor recognizes evidence gaps and acts on resource or continuation issues. The MBB can support technical interpretation but should not silently assume business authority that remains with the sponsor. Source alignment: ASQ CMBB Body of Knowledge, V.A.2; V.A.4. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d5-004",
    "optionRationales": [
      "Reading scripted questions does not establish that the sponsor can interpret answers or make the required decisions.",
      "Full technical certification is not established as necessary for the stated oversight tasks and ignores the feasible targeted-coaching route.",
      "Substituting the MBB's judgment defeats the objective of developing the sponsor's own accountable oversight capability.",
      "Correct. It targets the actual oversight decisions, checks usable understanding and verifies application within the time constraint."
    ],
    "trap": "Right-sized coaching still needs evidence of learning and application. A signature, a script or attendance at a briefing does not establish oversight competence.",
    "distractors": [
      "Reading scripted questions does not establish that the sponsor can interpret answers or make the required decisions.",
      "Full technical certification is not established as necessary for the stated oversight tasks and ignores the feasible targeted-coaching route.",
      "Substituting the MBB's judgment defeats the objective of developing the sponsor's own accountable oversight capability.",
      "Correct. It targets the actual oversight decisions, checks usable understanding and verifies application within the time constraint."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.A.2; V.A.4"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "At an Analyze gate, a champion proposes stopping a delayed food-processing project solely because it has taken longer than expected. The team has validated a root cause, but has not yet validated a solution or updated remaining costs and benefits. The champion has continuation authority under the charter; no immediate safety deadline forces a decision today. What should the MBB coach the champion to do before deciding?",
    "options": [
      "Review the validated finding together with remaining cost, likely benefit, solution risk, timing and alternatives; make and document a forward-looking continue, re-scope, pause or stop decision using the applicable authority.",
      "Continue automatically because a validated root cause guarantees worthwhile benefits, treating the next phases as routine execution that no longer requires a revised business case.",
      "Stop immediately because the original date has been exceeded, treating schedule variance as sufficient proof that remaining investment cannot produce value.",
      "Continue until the original spending has been recovered, regardless of remaining value or opportunity cost, so the resources already used do not become a recorded loss."
    ],
    "answer": 0,
    "why": "Neither schedule frustration nor a validated root cause alone determines the value of further work. Review the evidence, remaining investment, uncertain solution benefits, risks and alternative uses of resources. Past spending is sunk to this decision; it does not require continuation. The champion's stated authority remains intact, but a sound decision should be forward-looking and documented. Analysis progress is relevant information, not a guarantee of solution effectiveness or positive incremental value. Source alignment: ASQ CMBB Body of Knowledge, V.A.2; III.C.1. This original scenario is evaluated from its stated assumptions; BOK alignment is not ASQ authorship or endorsement.",
    "set": 3,
    "qid": "mbb:set-3:d5-005",
    "optionRationales": [
      "Correct. It supports an authorized decision with both technical evidence and a forward-looking comparison of feasible options.",
      "A validated cause is not a validated solution and does not guarantee positive benefits from further investment.",
      "Delay can matter, but schedule variance alone does not establish that future costs exceed future benefits.",
      "Recovering past spending is not a valid reason to continue work whose remaining value does not justify its cost and alternatives."
    ],
    "trap": "At a continuation gate, use future incremental value and risk, not sunk cost, frustration or optimism from one technical milestone. Preserve the stated decision authority.",
    "distractors": [
      "Correct. It supports an authorized decision with both technical evidence and a forward-looking comparison of feasible options.",
      "A validated cause is not a validated solution and does not guarantee positive benefits from further investment.",
      "Delay can matter, but schedule variance alone does not establish that future costs exceed future benefits.",
      "Recovering past spending is not a valid reason to continue work whose remaining value does not justify its cost and alternatives."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.A.2; III.C.1"
      },
      {
        "title": "The Open University: Relevant cash flows and sunk costs",
        "url": "https://www.open.edu/openlearn/money-business/challenges-advanced-management-accounting/content-section-3.1",
        "locator": "Incremental future cash flows and sunk-cost exclusion"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "Two champions request the same Black Belt's full available time for overlapping project work. The MBB may facilitate and recommend allocations, but the portfolio council holds final resource authority. Neither project has an immediate safety or regulatory emergency. What coaching response best resolves the conflict without exceeding the MBB's authority?",
    "options": [
      "Give each champion half the Belt's time immediately, then ask the council to confirm that equal allocation at its next meeting.",
      "Choose the project with the larger forecast benefit and instruct the Belt to prioritize it before the council reviews the competing demands.",
      "Ask the Belt to negotiate separate commitments with each champion, leaving any resulting schedule conflicts to the two project teams.",
      "Facilitate a joint capacity-and-priority assessment; coach a recommendation and route unresolved allocation to the authorized portfolio council."
    ],
    "answer": 3,
    "why": "The conflict requires both a feasible resource decision and coaching on how champions use governance. The MBB can help frame the competing demands, test assumptions and facilitate agreement, while the council resolves decisions outside the MBB's delegated authority. Neither equal splitting nor larger forecast benefit automatically yields a feasible allocation. Escalation to the MBB is not inherently improper; unilateral allocation without authority is the issue. Source alignment: ASQ CMBB Body of Knowledge, V.A.1 Scoping and resourcing; V.A.4 Feedback. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d5-006",
    "optionRationales": [
      "Incorrect. Equal sharing can leave both tasks infeasible and implements a resource decision before the named authority approves it.",
      "Incorrect. Benefit is relevant evidence, but one estimate does not establish priority or grant the MBB allocation authority.",
      "Incorrect. Separate negotiations place incompatible commitments on the Belt and fail to resolve the cross-project tradeoff through governance.",
      "Correct. It combines facilitated evidence-based resolution, champion development and a decision by the authority specified in this case."
    ],
    "trap": "Facilitation is not allocation authority. Check the delegated decision rights and urgency before directing scarce resources or requiring a fixed split.",
    "distractors": [
      "Incorrect. Equal sharing can leave both tasks infeasible and implements a resource decision before the named authority approves it.",
      "Incorrect. Benefit is relevant evidence, but one estimate does not establish priority or grant the MBB allocation authority.",
      "Incorrect. Separate negotiations place incompatible commitments on the Belt and fail to resolve the cross-project tradeoff through governance.",
      "Correct. It combines facilitated evidence-based resolution, champion development and a decision by the authority specified in this case."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.A.1 Scoping and resourcing; V.A.4 Feedback"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "An MBB has reviewed three executive presentations in which a champion describes team-delivered improvements solely as personal achievements. Contributions are documented, but the MBB has not established the champion's intent or any effect on retention. What is the most appropriate first coaching action?",
    "options": [
      "Publish the contribution records to the executive group before speaking with the champion, so the correction is visible to every original audience member.",
      "Privately recognize the Belt team while retaining the champion's executive narrative, because recognition below executive level resolves the attribution problem.",
      "Discuss specific presentation examples privately, hear the champion's perspective, and agree accurate shared attribution and a proportionate correction of misleading records.",
      "Tell the champion that the pattern has already caused employee turnover and require a standard public apology as the immediate remedy."
    ],
    "answer": 2,
    "why": "Feedback should address observed attribution, not invent intent or a proven retention effect. A private, specific conversation allows the champion to respond and supports accurate future recognition and correction of materially misleading records. Follow-up should verify the agreed behavior. Public correction can become necessary, but its form should fit the facts rather than being automatic punishment or a substitute for initial fact-based coaching. Source alignment: ASQ CMBB Body of Knowledge, V.A.3 Leadership and communication; V.A.4 Feedback. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d5-007",
    "optionRationales": [
      "Incorrect. Immediate broad publication can escalate unnecessarily before checking context; a proportionate correction can be agreed after the initial conversation.",
      "Incorrect. Private thanks do not correct an inaccurate executive record or the champion's recurring presentation behavior.",
      "Correct. It addresses documented behavior, allows clarification and establishes accurate attribution and follow-up without making unsupported causal claims.",
      "Incorrect. No turnover effect has been established, and a predetermined public remedy bypasses a proportionate fact-based response."
    ],
    "trap": "Give feedback on specific observed behavior. Do not infer intent or a retention effect without evidence, and do not leave materially misleading records uncorrected.",
    "distractors": [
      "Incorrect. Immediate broad publication can escalate unnecessarily before checking context; a proportionate correction can be agreed after the initial conversation.",
      "Incorrect. Private thanks do not correct an inaccurate executive record or the champion's recurring presentation behavior.",
      "Correct. It addresses documented behavior, allows clarification and establishes accurate attribution and follow-up without making unsupported causal claims.",
      "Incorrect. No turnover effect has been established, and a predetermined public remedy bypasses a proportionate fact-based response."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.A.3 Leadership and communication; V.A.4 Feedback"
      },
      {
        "title": "International Coaching Federation: Core Competencies and Code of Ethics",
        "url": "https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/",
        "locator": "Active listening, awareness, learner growth, agreements and ethical boundaries; complementary coaching principles, not ASQ credential rules"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "A technically strong Black Belt repeatedly dismisses frontline operators' concerns about how Measure-phase data are collected. Operators have now declined further interviews, and the team cannot establish coverage of all shifts. What coaching plan should the MBB prioritize?",
    "options": [
      "Assign another person to all operator contact permanently while the Belt continues the analysis, judging the Belt's development only by statistical accuracy.",
      "Coach listening and facilitation using observed examples, repair operator engagement, and verify both data coverage and later behavior.",
      "Require the operators to complete the planned interviews before addressing the Belt's behavior, so the measurement schedule remains the first priority.",
      "Enroll the Belt in a general leadership course and keep the existing data plan unchanged until the course has been completed."
    ],
    "answer": 1,
    "why": "The behavior has created an immediate stakeholder and measurement-coverage problem. Specific feedback, practiced listening, supported repair and follow-up address the demonstrated skill gap while the MBB checks whether the data remain representative. Generic training alone or forced cooperation does not repair the current problem. Reassignment can be necessary if harm persists, but permanent removal of stakeholder duties is not the first developmental response in this case. Source alignment: ASQ CMBB Body of Knowledge, V.B.1 Belt coaching and mentoring; V.B.3 Team facilitation and meeting management. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d5-008",
    "optionRationales": [
      "Incorrect. This may temporarily separate people but avoids developing the missing skill and leaves the representativeness concern unresolved.",
      "Correct. It addresses the specific behavior, its current effect on data collection and observable evidence that the coaching is working.",
      "Incorrect. Schedule pressure does not justify ignoring the behavior or relying on cooperation obtained without repairing the engagement problem.",
      "Incorrect. A general course delays action on the current gap and does not establish that the existing sampling coverage is adequate."
    ],
    "trap": "A stakeholder breakdown can also create a measurement-coverage gap. Repair the behavior and check the current data rather than prescribe generic training alone.",
    "distractors": [
      "Incorrect. This may temporarily separate people but avoids developing the missing skill and leaves the representativeness concern unresolved.",
      "Correct. It addresses the specific behavior, its current effect on data collection and observable evidence that the coaching is working.",
      "Incorrect. Schedule pressure does not justify ignoring the behavior or relying on cooperation obtained without repairing the engagement problem.",
      "Incorrect. A general course delays action on the current gap and does not establish that the existing sampling coverage is adequate."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.B.1 Belt coaching and mentoring; V.B.3 Team facilitation and meeting management"
      },
      {
        "title": "International Coaching Federation: Core Competencies and Code of Ethics",
        "url": "https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/",
        "locator": "Active listening, awareness, learner growth, agreements and ethical boundaries; complementary coaching principles, not ASQ credential rules"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Green Belt reports that the current data do not support the champion's preferred root-cause hypothesis. The MBB has not yet reviewed the study design or uncertainty. There is no reported retaliation, falsification order or immediate safety threat, and the champion has been receptive to evidence in previous reviews. What should the MBB coach the Belt to do next?",
    "options": [
      "Bypass the normal review and submit a formal misconduct allegation, treating the difference between the hypothesis and current data as proof of interference.",
      "Replace the current hypothesis with the champion's explanation in the report, while keeping the contradictory analysis in the Belt's private working notes.",
      "Check the analysis and uncertainty, present it honestly with MBB support, and escalate any pressure to misrepresent findings.",
      "State that the preferred root cause has been disproved permanently and recommend closing the project without investigating alternative explanations."
    ],
    "answer": 2,
    "why": "Analytical integrity requires an honest, qualified account of what the data support. The MBB should first help check design, uncertainty and interpretation, then support a constructive evidence review and next step. Lack of support is not necessarily proof that the hypothesized effect is absent. Direct conversation is appropriate under the stated circumstances, but it must not become a mandatory prerequisite when retaliation, misconduct or safety concerns require protected escalation. Source alignment: ASQ CMBB Body of Knowledge, V.B.1 Belt coaching and mentoring; V.B.2 Project reviews. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d5-009",
    "optionRationales": [
      "Incorrect. The stated evidence does not establish misconduct; appropriate protected escalation remains available if the circumstances change.",
      "Incorrect. Private retention of contradictory evidence does not make a knowingly misleading report acceptable.",
      "Correct. It protects integrity, addresses uncertainty and gives the Belt both a practical review path and support against inappropriate pressure.",
      "Incorrect. An unsupported hypothesis is not necessarily conclusively disproved, and alternative explanations or better evidence may warrant investigation."
    ],
    "trap": "Unsupported does not always mean disproved. Preserve honest uncertainty and protected escalation rather than assume that every disagreement is misconduct.",
    "distractors": [
      "Incorrect. The stated evidence does not establish misconduct; appropriate protected escalation remains available if the circumstances change.",
      "Incorrect. Private retention of contradictory evidence does not make a knowingly misleading report acceptable.",
      "Correct. It protects integrity, addresses uncertainty and gives the Belt both a practical review path and support against inappropriate pressure.",
      "Incorrect. An unsupported hypothesis is not necessarily conclusively disproved, and alternative explanations or better evidence may warrant investigation."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.B.1 Belt coaching and mentoring; V.B.2 Project reviews"
      },
      {
        "title": "International Coaching Federation: Core Competencies and Code of Ethics",
        "url": "https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/",
        "locator": "Active listening, awareness, learner growth, agreements and ethical boundaries; complementary coaching principles, not ASQ credential rules"
      },
      {
        "title": "ICF Code of Ethics overview",
        "url": "https://coachingfederation.org/code-of-ethics-overview/",
        "locator": "Confidentiality and applicable disclosure exceptions; not a jurisdiction-specific legal ruling"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "During a cross-functional review, a Black Belt repeatedly interrupts a quieter member who holds essential operating knowledge. The member is willing to contribute, and the next meeting must identify failure mechanisms before ranking solutions. Which coaching suggestion best protects input without treating equal speaking time as evidence that every claim is equally valid?",
    "options": [
      "Let the Belt present a complete solution first, then ask the quieter member to approve it by email without reopening the meeting discussion.",
      "Replace the review with a vote in which each member has one ballot, using the vote totals to establish which failure mechanism is correct.",
      "Have the MBB lead all future meetings personally, removing the Belt's facilitation responsibility so the same interruption pattern cannot recur.",
      "Coach non-interruption and structured turn-taking with a pass option, invite the operating evidence, then evaluate competing claims using common criteria."
    ],
    "answer": 3,
    "why": "Structured participation protects access to the discussion; it does not make all proposed causes equally supported. The MBB should coach the interruption behavior and a concrete meeting process, then check whether the Belt elicits and evaluates relevant evidence. Turn-taking can include a pass or written contribution so participation is not coercive. Majority preference and post-hoc approval do not replace examination of failure mechanisms. Source alignment: ASQ CMBB Body of Knowledge, V.B.3 Team facilitation and meeting management. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d5-010",
    "optionRationales": [
      "Incorrect. An approval request after the solution is fixed gives the operating expertise little opportunity to shape the causal analysis.",
      "Incorrect. Equal voting rights do not establish technical truth or resolve the evidence behind a failure mechanism.",
      "Incorrect. Taking over permanently avoids development of the Belt's facilitation capability rather than addressing the specific behavior.",
      "Correct. It combines inclusive participation with evidence-based assessment and a concrete behavior the coach can observe."
    ],
    "trap": "Access to discussion and strength of evidence are different. Structured participation does not make a majority vote a test of technical truth.",
    "distractors": [
      "Incorrect. An approval request after the solution is fixed gives the operating expertise little opportunity to shape the causal analysis.",
      "Incorrect. Equal voting rights do not establish technical truth or resolve the evidence behind a failure mechanism.",
      "Incorrect. Taking over permanently avoids development of the Belt's facilitation capability rather than addressing the specific behavior.",
      "Correct. It combines inclusive participation with evidence-based assessment and a concrete behavior the coach can observe."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.B.3 Team facilitation and meeting management"
      },
      {
        "title": "International Coaching Federation: Core Competencies and Code of Ethics",
        "url": "https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/",
        "locator": "Active listening, awareness, learner growth, agreements and ethical boundaries; complementary coaching principles, not ASQ credential rules"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Green Belt with two validated project successes expresses self-doubt about advancing within the employer's internal Belt-development program. Advancement also requires competencies not necessarily demonstrated by those two projects. The individual asks for coaching rather than a mental-health assessment. What is the most appropriate response?",
    "options": [
      "Approve advancement solely from the two successful outcomes and avoid discussing the concern, since outcomes are a complete measure of competence.",
      "Review demonstrated competencies and remaining requirements, acknowledge the concern, and agree a supported development or advancement step.",
      "Delay advancement until the individual reports no self-doubt, using confidence rather than the competency criteria as the primary readiness measure.",
      "Diagnose an impostor syndrome from this conversation and make treatment completion a prerequisite for any further professional development."
    ],
    "answer": 1,
    "why": "Coaching should respect the person's experience while checking concrete evidence against the actual advancement requirements. Two successful outcomes support some competencies but do not automatically satisfy the full standard. A development plan can recognize strengths and target remaining evidence without letting confidence alone decide readiness. The MBB should remain within the coaching role and should not diagnose a condition from this statement. Source alignment: ASQ CMBB Body of Knowledge, V.B.1 Belt coaching and mentoring. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d5-011",
    "optionRationales": [
      "Incorrect. Project outcomes alone do not establish every advancement competency stated in the scenario.",
      "Correct. It combines supportive listening with criterion-based evidence and an agreed, actionable development path.",
      "Incorrect. Absence of self-doubt is not the internal competency standard and can indefinitely block otherwise justified advancement.",
      "Incorrect. The information does not support a diagnosis or a treatment condition imposed by a workplace coach."
    ],
    "trap": "Confidence is not the credential criterion, and two project outcomes do not demonstrate every competency. Support the person without diagnosing or automatically certifying.",
    "distractors": [
      "Incorrect. Project outcomes alone do not establish every advancement competency stated in the scenario.",
      "Correct. It combines supportive listening with criterion-based evidence and an agreed, actionable development path.",
      "Incorrect. Absence of self-doubt is not the internal competency standard and can indefinitely block otherwise justified advancement.",
      "Incorrect. The information does not support a diagnosis or a treatment condition imposed by a workplace coach."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.B.1 Belt coaching and mentoring"
      },
      {
        "title": "International Coaching Federation: Core Competencies and Code of Ethics",
        "url": "https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/",
        "locator": "Active listening, awareness, learner growth, agreements and ethical boundaries; complementary coaching principles, not ASQ credential rules"
      },
      {
        "title": "ICF Code of Ethics overview",
        "url": "https://coachingfederation.org/code-of-ethics-overview/",
        "locator": "Confidentiality and applicable disclosure exceptions; not a jurisdiction-specific legal ruling"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Black Belt asks for help choosing a DOE design. There is time for guided development before authorization, and no urgent safety issue requires the MBB to take over. The MBB supplies a finished design without discussing the reasoning or checking the Belt's understanding. What change would best meet the coaching objective?",
    "options": [
      "Provide the finished design with a detailed written explanation and consider the learning objective met once the Belt confirms receipt.",
      "Require the Belt to solve the design alone without access to examples, expert review or discussion so that the work is genuinely independent.",
      "Assign all future DOE design decisions to the MBB while allowing the Belt to manage logistics and present the results to management.",
      "Elicit the objective and constraints, guide the Belt's design choices, review a justified draft, and check transfer on a comparable design decision."
    ],
    "answer": 3,
    "why": "The missing element is active development and verification of the Belt's reasoning. Questions, examples and direct instruction can all support coaching when the Belt applies the reasoning and receives feedback. Supplying a worked example is not inherently wrong, nor must an MBB refuse expert work in an emergency. Under the stated conditions, a finished answer without learner application leaves the specific capability gap untested. Source alignment: ASQ CMBB Body of Knowledge, V.B.1 Belt coaching and mentoring. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d5-012",
    "optionRationales": [
      "Incorrect. Receiving an explanation does not demonstrate that the Belt can apply the design reasoning independently.",
      "Incorrect. Withholding support is not required for learning and abandons the requested coaching opportunity.",
      "Incorrect. Permanent dependence on the MBB does not meet the objective of developing the Belt's design competence.",
      "Correct. Guided reasoning, a reviewed draft and a transfer check provide evidence of learning rather than merely completion of this design."
    ],
    "trap": "A worked example can support coaching when followed by learner application. Supplying an answer without a transfer check does not demonstrate new competence.",
    "distractors": [
      "Incorrect. Receiving an explanation does not demonstrate that the Belt can apply the design reasoning independently.",
      "Incorrect. Withholding support is not required for learning and abandons the requested coaching opportunity.",
      "Incorrect. Permanent dependence on the MBB does not meet the objective of developing the Belt's design competence.",
      "Correct. Guided reasoning, a reviewed draft and a transfer check provide evidence of learning rather than merely completion of this design."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.B.1 Belt coaching and mentoring"
      },
      {
        "title": "International Coaching Federation: Core Competencies and Code of Ethics",
        "url": "https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/",
        "locator": "Active listening, awareness, learner growth, agreements and ethical boundaries; complementary coaching principles, not ASQ credential rules"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "A Black Belt candidate from an underrepresented background tells the MBB that informal networking appears to determine desirable project assignments. The candidate requests discretion. The MBB has not established how assignments are made or whether exclusion occurred. Which response best combines fair investigation, confidentiality and an actionable process improvement?",
    "options": [
      "Clarify confidentiality limits and the candidate's wishes; examine assignment criteria and outcomes through appropriate channels, then address evidenced access barriers with transparent criteria.",
      "Announce the candidate's account to the whole team as a confirmed finding, asking everyone to explain why the candidate was excluded.",
      "Promise absolute secrecy in all circumstances and personally assign the candidate the next high-profile project without reviewing the allocation process.",
      "Recommend more networking practice for the candidate and defer review of the assignment process until a second person reports the same concern."
    ],
    "answer": 0,
    "why": "The concern warrants respectful examination, not dismissal or a premature finding. The MBB should explain applicable confidentiality limits, avoid unnecessary identifying disclosures and use appropriate organizational channels to assess the process. Transparent, relevant selection criteria and review of access can address supported barriers. A demographic characteristic alone does not prove discrimination, and individual networking advice does not substitute for examining the reported process. Source alignment: ASQ CMBB Body of Knowledge, V.B.1 Belt coaching and mentoring; V.B.3 Team facilitation and meeting management. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d5-013",
    "optionRationales": [
      "Correct. It preserves a fair fact-finding process, respects confidentiality boundaries and links corrective action to supported assignment barriers.",
      "Incorrect. It breaches discretion unnecessarily and labels an unverified account as an established conclusion.",
      "Incorrect. Absolute secrecy may conflict with applicable obligations, and a unilateral exception does not establish fair allocation.",
      "Incorrect. It shifts responsibility to the candidate and imposes an unsupported threshold before examining a credible concern."
    ],
    "trap": "Investigate the reported process fairly and explain confidentiality limits. Do not dismiss a concern, assume a finding, or promise secrecy that cannot be kept.",
    "distractors": [
      "Correct. It preserves a fair fact-finding process, respects confidentiality boundaries and links corrective action to supported assignment barriers.",
      "Incorrect. It breaches discretion unnecessarily and labels an unverified account as an established conclusion.",
      "Incorrect. Absolute secrecy may conflict with applicable obligations, and a unilateral exception does not establish fair allocation.",
      "Incorrect. It shifts responsibility to the candidate and imposes an unsupported threshold before examining a credible concern."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.B.1 Belt coaching and mentoring; V.B.3 Team facilitation and meeting management"
      },
      {
        "title": "International Coaching Federation: Core Competencies and Code of Ethics",
        "url": "https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/",
        "locator": "Active listening, awareness, learner growth, agreements and ethical boundaries; complementary coaching principles, not ASQ credential rules"
      },
      {
        "title": "ICF Code of Ethics overview",
        "url": "https://coachingfederation.org/code-of-ethics-overview/",
        "locator": "Confidentiality and applicable disclosure exceptions; not a jurisdiction-specific legal ruling"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "After a first-project Analyze-phase setback, a Green Belt says, 'I do not think I can do this.' No immediate safety concern is present. The MBB has not yet clarified whether the obstacle is technical, resource-related or a misunderstanding of expectations. What is the best immediate coaching response?",
    "options": [
      "Reassign the project immediately and use a later performance review to explain that frustration indicates the Belt is not suited to improvement work.",
      "Begin a detailed statistical lecture without discussing the concern, assuming that more technical information will resolve the obstacle.",
      "Promise that the project will succeed and tell the Belt to repeat the same analysis until the results support the original hypothesis.",
      "Acknowledge the frustration, clarify the obstacle with the Belt, agree a manageable next action and suitable support, and arrange a follow-up check."
    ],
    "answer": 3,
    "why": "The coach should first understand the obstacle and the person's concern rather than assume a technical deficiency or a fixed lack of ability. A specific next action and appropriate support make the conversation useful, while follow-up tests whether the barrier is being addressed. Reassurance need not promise success. Reassignment may become appropriate after assessment, but this statement alone does not justify it. Source alignment: ASQ CMBB Body of Knowledge, V.B.1 Belt coaching and mentoring. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d5-014",
    "optionRationales": [
      "Incorrect. The statement does not establish inability, and immediate reassignment bypasses assessment and development.",
      "Incorrect. The barrier has not been diagnosed and may not be resolved by a technical lecture.",
      "Incorrect. Success cannot be guaranteed, and repeating analysis to obtain a desired conclusion compromises analytical integrity.",
      "Correct. It responds to the immediate concern while identifying a feasible evidence-based next step and checking progress."
    ],
    "trap": "Clarify the actual obstacle before choosing support. Empathy, a manageable action and follow-up are more useful than guaranteed success or an assumed technical lecture.",
    "distractors": [
      "Incorrect. The statement does not establish inability, and immediate reassignment bypasses assessment and development.",
      "Incorrect. The barrier has not been diagnosed and may not be resolved by a technical lecture.",
      "Incorrect. Success cannot be guaranteed, and repeating analysis to obtain a desired conclusion compromises analytical integrity.",
      "Correct. It responds to the immediate concern while identifying a feasible evidence-based next step and checking progress."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.B.1 Belt coaching and mentoring"
      },
      {
        "title": "International Coaching Federation: Core Competencies and Code of Ethics",
        "url": "https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/",
        "locator": "Active listening, awareness, learner growth, agreements and ethical boundaries; complementary coaching principles, not ASQ credential rules"
      }
    ]
  },
  {
    "sub": "mbb-coaching",
    "stem": "An experienced Black Belt mentor spends most sessions describing past projects. The new Green Belt leaves without an agreed next action on the current project, although some of the examples are relevant. Which coaching adjustment should the MBB recommend and subsequently evaluate?",
    "options": [
      "Standardize a sequence of the mentor's past projects and measure session quality by the number of examples covered each month.",
      "Ask the Green Belt to listen without interruption and submit written questions only after the mentor has finished the planned stories.",
      "Explore the mentee's current goal, use relevant examples, and agree a mentee-owned action with a later application check.",
      "Replace all mentoring discussion with a repository of case studies and let download counts indicate whether the Green Belt is developing."
    ],
    "answer": 2,
    "why": "Mentoring can legitimately include advice and experience, but those resources should serve the learner's current needs. An agreed goal, open questions, selective examples and an owned next action connect the discussion to application. Later review should examine progress and learning rather than story counts or downloads. This corrects the observed pattern without claiming that all storytelling is inappropriate. Source alignment: ASQ CMBB Body of Knowledge, V.B.1 Belt coaching and mentoring. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d5-015",
    "optionRationales": [
      "Incorrect. Counting examples measures delivery activity rather than whether the current challenge is being addressed.",
      "Incorrect. It further delays exploration of the mentee's needs and retains the one-way structure causing the problem.",
      "Correct. It preserves useful mentoring expertise while centering the current goal, action and evidence of application.",
      "Incorrect. A resource repository can supplement mentoring but download counts do not demonstrate competence or problem resolution."
    ],
    "trap": "Relevant experience is a mentoring resource, not the outcome. Check whether the mentee can apply it to the current goal and own the next action.",
    "distractors": [
      "Incorrect. Counting examples measures delivery activity rather than whether the current challenge is being addressed.",
      "Incorrect. It further delays exploration of the mentee's needs and retains the one-way structure causing the problem.",
      "Correct. It preserves useful mentoring expertise while centering the current goal, action and evidence of application.",
      "Incorrect. A resource repository can supplement mentoring but download counts do not demonstrate competence or problem resolution."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "V.B.1 Belt coaching and mentoring"
      },
      {
        "title": "International Coaching Federation: Core Competencies and Code of Ethics",
        "url": "https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/",
        "locator": "Active listening, awareness, learner growth, agreements and ethical boundaries; complementary coaching principles, not ASQ credential rules"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A torque-wrench gage R&R study uses representative parts and a valid variance-component model. Measurement-system variance is 22% of total observed variance. The site's adopted guideline rejects greater than 30% study variation, equivalent to greater than 9% variance contribution. Which interpretation and response are justified before using this system for process capability decisions?",
    "options": [
      "It is conditionally acceptable at 22% study variation; use it for capability decisions and defer improvement until the variance contribution exceeds 30%.",
      "Study variation is about 46.9%, failing the guideline; investigate components and verify improvements before relying on capability decisions.",
      "It is acceptable because parts account for 78% of observed variance; a majority part contribution is sufficient evidence of measurement adequacy.",
      "It is unacceptable because measurement variation consumes 22% of the engineering tolerance; replace the wrench immediately without examining repeatability or reproducibility."
    ],
    "answer": 1,
    "why": "The reported percentage divides variances, not standard deviations. The study-variation fraction is sqrt(0.22), so %Study Variation is approximately 46.9%, above the site's 30% screening limit. The variance contribution also exceeds 9%. The study does not provide engineering tolerance or identify which measurement component dominates; investigate those components and validate improvements rather than prescribe replacement without evidence. This is the stated guideline, not a universal ban on every possible measurement use. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control; VI.B.6 Components of variation. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d6-001",
    "optionRationales": [
      "Incorrect. It applies a standard-deviation threshold directly to a variance percentage; 22% contribution is not 22% study variation.",
      "Correct. Taking the square root gives the appropriate scale, and component-based improvement followed by verification matches the stated decision rule.",
      "Incorrect. A majority part contribution is not the adopted criterion; measurement-system variation still exceeds the stated threshold.",
      "Incorrect. No tolerance percentage can be derived from the given variance contribution, and the cause of error has not been localized."
    ],
    "trap": "Variance percentages and standard-deviation percentages use different scales. Take the square root before comparing contribution with a study-variation threshold.",
    "distractors": [
      "Incorrect. It applies a standard-deviation threshold directly to a variance percentage; 22% contribution is not 22% study variation.",
      "Correct. Taking the square root gives the appropriate scale, and component-based improvement followed by verification matches the stated decision rule.",
      "Incorrect. A majority part contribution is not the adopted criterion; measurement-system variation still exceeds the stated threshold.",
      "Incorrect. No tolerance percentage can be derived from the given variance contribution, and the cause of error has not been localized."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control; VI.B.6 Components of variation"
      },
      {
        "title": "Minitab: Is my measurement system acceptable?",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/supporting-topics/gage-r-r-and-wheeler-s-emp-studies/is-my-measurement-system-acceptable/",
        "locator": "Study variation versus variance contribution; application-dependent acceptance guidance"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A gage R&R report lists %Study Variation = 28% and ndc = 2. Both allegedly use the same nonnegative components, with total variance = part variance + gage variance and no historical-SD substitution. Use ndc = floor(1.41 × SDpart / SDgage); the site seeks at least 5 categories. Which MBB review conclusion is correct?",
    "options": [
      "The two values are consistent; ndc = 2 adds independent evidence that cannot be checked from the stated study-variation percentage.",
      "The correct ndc is 5 after rounding 1.41 times the part-to-gage SD ratio to the nearest integer, so the stated requirement is met.",
      "The correct ndc is 3 because part SD is 72% of total SD and the ratio is 1.41 × 72 / 28.",
      "The values are inconsistent: the formula gives ndc = 4, still below 5; reconcile the report and investigate discrimination and sampling adequacy before approval."
    ],
    "answer": 3,
    "why": "Let total SD be 1. Gage SD is 0.28, and part SD is sqrt(1 - 0.28 squared) = 0.96. Thus 1.41 × 0.96 / 0.28 = 4.8343, which truncates to ndc = 4, not 2 or 5. Standard deviations do not add linearly. Under this common component model, ndc and %Study Variation are related rather than independent evidence. Verify report settings and part representativeness; the corrected value still misses the site's five-category screen. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control; VI.B.6 Components of variation. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d6-002",
    "optionRationales": [
      "Incorrect. With the specified common components the relationship is checkable and the reported pair is mathematically inconsistent.",
      "Incorrect. The stated formula truncates rather than rounds; 4.8343 gives four categories, not five.",
      "Incorrect. Variances add under the stated model; subtracting standard-deviation percentages gives the wrong part SD.",
      "Correct. The calculation gives four categories, identifies the report inconsistency and does not mistake correction of the report for measurement adequacy."
    ],
    "trap": "Under the specified common components, ndc and study variation are linked. Truncate 4.8343 to 4, and distinguish fixing the report from making the gage adequate.",
    "distractors": [
      "Incorrect. With the specified common components the relationship is checkable and the reported pair is mathematically inconsistent.",
      "Incorrect. The stated formula truncates rather than rounds; 4.8343 gives four categories, not five.",
      "Incorrect. Variances add under the stated model; subtracting standard-deviation percentages gives the wrong part SD.",
      "Correct. The calculation gives four categories, identifies the report inconsistency and does not mistake correction of the report for measurement adequacy."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control; VI.B.6 Components of variation"
      },
      {
        "title": "Minitab: Using the number of distinct categories in a gage R&R study",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/supporting-topics/gage-r-r-and-wheeler-s-emp-studies/using-the-number-of-distinct-categories-in-a-gage-r-r-study/",
        "locator": "1.41 times part-to-gage SD ratio, truncated to integer; minimum-five guideline"
      },
      {
        "title": "Minitab: Is my measurement system acceptable?",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/supporting-topics/gage-r-r-and-wheeler-s-emp-studies/is-my-measurement-system-acceptable/",
        "locator": "Study variation versus variance contribution; application-dependent acceptance guidance"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "Two inspectors independently classify the same 100 items once as pass or fail. The paired counts are shown below; no reference classifications are available. The site's screening criterion is Cohen's kappa at least 0.75. Using observed agreement and agreement expected from the marginal proportions, which conclusion should the MBB report?",
    "options": [
      "Kappa is 0.70, so only a five-percentage-point increase in overall agreement is needed to satisfy the site's 0.75 kappa criterion.",
      "Kappa is 0.40, which establishes that 40% of the items were classified correctly and that the remaining 60% require reinspection.",
      "Agreement is 70% and kappa is 0.40, below the screen; review disagreements and validate accuracy against reference classifications.",
      "Kappa is 0.40, but Inspector 2's 60% fail rate proves that this inspector is correct more often and should become the reference assessor."
    ],
    "answer": 2,
    "why": "Observed agreement is (30 + 40) / 100 = 0.70. Inspector 1's pass/fail proportions are 0.50/0.50 and Inspector 2's are 0.40/0.60, giving expected agreement 0.50. Kappa is (0.70 - 0.50) / (1 - 0.50) = 0.40, below the stated screen. Agreement is not accuracy: without reference truth the error rate and better inspector cannot be identified. Review ambiguous criteria, collect appropriate reference and repeatability evidence, and consider uncertainty and category prevalence before validation. Source alignment: ASQ CMBB Body of Knowledge, VI.A.2 Attribute (discrete) measurement systems. Sources support principles, not ASQ authorship of this original scenario.",
    "chart": {
      "type": "data-table",
      "title": "Paired inspector classifications (100 items)",
      "altText": "Inspector 1 forms the rows and Inspector 2 the columns; paired counts sum to 100.",
      "columns": [
        "Inspector 1 classification",
        "Inspector 2: Pass",
        "Inspector 2: Fail",
        "Row total"
      ],
      "rows": [
        [
          "Pass",
          "30",
          "20",
          "50"
        ],
        [
          "Fail",
          "10",
          "40",
          "50"
        ],
        [
          "Column total",
          "40",
          "60",
          "100"
        ]
      ]
    },
    "set": 3,
    "qid": "mbb:set-3:d6-003",
    "optionRationales": [
      "Incorrect. It confuses raw agreement with chance-adjusted kappa; a five-point change in one does not automatically yield the stated kappa.",
      "Incorrect. Kappa is not a percentage of correct classifications, and no reference truth is supplied.",
      "Correct. Both numerical results follow from the table, and the action distinguishes insufficient agreement from unmeasured classification accuracy.",
      "Incorrect. A higher fail rate does not establish correct decisions or qualify an inspector as the reference standard."
    ],
    "trap": "Kappa is neither raw agreement nor the percentage correct. A reference standard is needed for an accuracy claim; marginal proportions determine expected agreement.",
    "distractors": [
      "Incorrect. It confuses raw agreement with chance-adjusted kappa; a five-point change in one does not automatically yield the stated kappa.",
      "Incorrect. Kappa is not a percentage of correct classifications, and no reference truth is supplied.",
      "Correct. Both numerical results follow from the table, and the action distinguishes insufficient agreement from unmeasured classification accuracy.",
      "Incorrect. A higher fail rate does not establish correct decisions or qualify an inspector as the reference standard."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A.2 Attribute (discrete) measurement systems"
      },
      {
        "title": "Minitab: Kappa statistics for Attribute Agreement Analysis",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/how-to/attribute-agreement-analysis/attribute-agreement-analysis/interpret-the-results/all-statistics-and-graphs/kappa-statistics/",
        "locator": "Chance-adjusted agreement; between-appraiser agreement is distinct from agreement with a standard"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A stable, approximately normal diameter process has adequate measurement capability. Specifications are LSL = 38 mm and USL = 62 mm; estimated mean = 51 mm and within-subgroup SD = 4 mm. The customer's stated Cpk target is 1.33. Calculate the point estimate to two decimals and select the appropriate conclusion; no confidence interval is requested.",
    "options": [
      "Cpk = 1.00; because Cp also equals 1.00, the process is centered and no adjustment of its location is indicated.",
      "Cpk = 1.08; use the larger one-sided index because the lower specification is farther from the process mean.",
      "Cpk = 0.92, limited by the upper specification; it misses the stated target despite the stipulated process stability.",
      "Cpk = 1.33; the mean is inside specifications and this is sufficient to establish that the customer's capability target is met."
    ],
    "answer": 2,
    "why": "Cpu = (62 - 51) / (3 × 4) = 0.9167 and Cpl = (51 - 38) / (3 × 4) = 1.0833. Cpk takes the smaller index, so the point estimate is 0.92. Cp = (62 - 38) / (6 × 4) = 1.00; the mean lies above the specification midpoint of 50 mm. Even recentering alone leaves Cp below 1.33. Stability is a separate question and is given here; sample information would be needed for an uncertainty interval, not for this point calculation. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d6-004",
    "optionRationales": [
      "Incorrect. The value 1.00 is Cp, which ignores centering; the estimated mean is 1 mm above the specification midpoint.",
      "Incorrect. Cpk uses the smaller, limiting one-sided index rather than the larger one.",
      "Correct. The minimum is 11/12, which rounds to 0.92; it misses the stated requirement despite the stipulated stability.",
      "Incorrect. Having a mean between the specifications does not establish the required tail clearance relative to process variation."
    ],
    "trap": "Cpk is the smaller one-sided index and reflects centering. Cp = 1 means recentering alone cannot achieve the stated 1.33 target at the same variation.",
    "distractors": [
      "Incorrect. The value 1.00 is Cp, which ignores centering; the estimated mean is 1 mm above the specification midpoint.",
      "Incorrect. Cpk uses the smaller, limiting one-sided index rather than the larger one.",
      "Correct. The minimum is 11/12, which rounds to 0.92; it misses the stated requirement despite the stipulated stability.",
      "Incorrect. Having a mean between the specifications does not establish the required tail clearance relative to process variation."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: What is process capability?",
        "url": "https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm",
        "locator": "Cp, Cpu, Cpl, Cpk formulas, centering and normal-distribution interpretation"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A Phase II fill-weight chart uses fixed limits from a previously validated stable baseline: subgroup size n = 5, baseline grand mean 50 g, baseline average range 2.9 g, A2 = 0.577, D3 = 0 and D4 = 2.115. Eight new subgroups are plotted. With the one-point-beyond-3-sigma rule enabled, which interpretation and response are appropriate?",
    "options": [
      "Widen both charts using the eight new subgroups immediately; this makes the range signal part of the current estimate of normal process variation.",
      "Release the process as stable because the subgroup means remain inside their limits; range-chart signals matter only when the mean chart also signals.",
      "Investigate subgroup 6's range signal and assess affected output; retain the historical limits unless a justified process change supports rebaselining.",
      "Delete subgroup 6 from both plots without checking its records, then use the remaining seven subgroups to replace the historical baseline."
    ],
    "answer": 2,
    "why": "The mean limits are 50 ± 0.577 × 2.9 = 48.3267 and 51.6733 g. The range UCL is 2.115 × 2.9 = 6.1335 g, with LCL 0. New subgroup 6 has range 7.8 g and signals; the eight means are within the fixed mean limits. A new Phase II signal does not retroactively invalidate a sound historical baseline. Investigate the cause and output risk, document any exclusion or process change, and rebaseline only when justified. Stability of dispersion must not be ignored. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control. Sources support principles, not ASQ authorship of this original scenario.",
    "chart": {
      "type": "xbar-r",
      "title": "Fixed-baseline X-bar and R charts",
      "altText": "Eight new subgroups, n=5. Dashed references are the fixed historical control limits and centerlines, not specification limits.",
      "labels": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "meanData": [
        50.2,
        49.8,
        50.5,
        49.6,
        50.1,
        50.9,
        49.7,
        50.3
      ],
      "rangeData": [
        2.5,
        3.1,
        2.8,
        3.4,
        2.6,
        7.8,
        2.9,
        3
      ],
      "xbarLimits": [
        51.6733,
        50,
        48.3267
      ],
      "rLimits": [
        6.1335,
        2.9,
        0
      ],
      "evidence": {
        "title": "Fixed-baseline X-bar and R charts — numerical alternative",
        "columns": [
          "Subgroup",
          "Mean (g)",
          "Range (g)"
        ],
        "rows": [
          [
            "1",
            "50.2",
            "2.5"
          ],
          [
            "2",
            "49.8",
            "3.1"
          ],
          [
            "3",
            "50.5",
            "2.8"
          ],
          [
            "4",
            "49.6",
            "3.4"
          ],
          [
            "5",
            "50.1",
            "2.6"
          ],
          [
            "6",
            "50.9",
            "7.8"
          ],
          [
            "7",
            "49.7",
            "2.9"
          ],
          [
            "8",
            "50.3",
            "3"
          ]
        ]
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-005",
    "optionRationales": [
      "Incorrect. Re-estimating limits immediately can absorb the special-cause signal and hide a change rather than explain it.",
      "Incorrect. A dispersion signal is evidence against overall stability even when subgroup averages have not crossed their limits.",
      "Correct. It recognizes the specific range signal, preserves the meaning of fixed historical limits and calls for investigation and risk assessment.",
      "Incorrect. An unexplained point cannot be deleted simply because it signals, and seven remaining subgroups do not justify this automatic rebaseline."
    ],
    "trap": "A new Phase II signal does not erase a sound historical baseline. Investigate dispersion and output risk; do not widen limits to absorb the signal.",
    "distractors": [
      "Incorrect. Re-estimating limits immediately can absorb the special-cause signal and hide a change rather than explain it.",
      "Incorrect. A dispersion signal is evidence against overall stability even when subgroup averages have not crossed their limits.",
      "Correct. It recognizes the specific range signal, preserves the meaning of fixed historical limits and calls for investigation and risk assessment.",
      "Incorrect. An unexplained point cannot be deleted simply because it signals, and seven remaining subgroups do not justify this automatic rebaseline."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: X-bar and R charts",
        "url": "https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc321.htm",
        "locator": "Control-limit formulas and n=5 factors A2=0.577, D3=0, D4=2.115"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Shewhart control charts",
        "url": "https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm",
        "locator": "Control versus specification limits, Western Electric eight-point rule and justified limit revisions"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A claims-cycle-time boxplot uses Tukey's 1.5 × IQR rule. Its quartiles are 3.4 and 5.1 days, median 4.2 days, and largest observation inside the upper fence 6.8 days. Three observations are 9.2, 10.1 and 11.4 days. Before excluding any records, what should the MBB conclude and investigate?",
    "options": [
      "All three exceed the 7.65-day fence; investigate records and case mix without equating boxplot flags with data errors or SPC signals.",
      "The upper fence is 6.8 days, so all values above the whisker are confirmed recording errors that should be removed before further analysis.",
      "The three observations demonstrate that the process was out of statistical control at those times, even without time-order or baseline evidence.",
      "The median of 4.2 days makes the high observations irrelevant to service performance, so only the central half of claims should be retained."
    ],
    "answer": 0,
    "why": "IQR = 5.1 - 3.4 = 1.7 days, so the upper fence is 5.1 + 1.5 × 1.7 = 7.65 days. The upper whisker ends at the largest observation inside that fence, 6.8 days; it is not the dataset maximum, which is 11.4. All three flagged values warrant context and record checks. They may be legitimate observations from a skewed distribution or a different case mix. Do not infer a time-based special cause or remove data solely from a boxplot flag. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control. Sources support principles, not ASQ authorship of this original scenario.",
    "chart": {
      "type": "boxplot",
      "title": "Claims cycle time (days)",
      "altText": "Box spans Q1 to Q3, line marks median, whiskers end at observations inside 1.5-IQR fences. Three separately plotted high observations are retained.",
      "q1": 3.4,
      "q3": 5.1,
      "median": 4.2,
      "lowerWhisker": 2.1,
      "upperWhisker": 6.8,
      "mean": 4.5,
      "outliers": [
        9.2,
        10.1,
        11.4
      ],
      "evidence": {
        "title": "Claims cycle time (days) — numerical alternative",
        "columns": [
          "Statistic or observation",
          "Days"
        ],
        "rows": [
          [
            "Lower whisker",
            "2.1"
          ],
          [
            "Q1",
            "3.4"
          ],
          [
            "Median",
            "4.2"
          ],
          [
            "Q3",
            "5.1"
          ],
          [
            "Upper whisker",
            "6.8"
          ],
          [
            "Mean (provided summary)",
            "4.5"
          ],
          [
            "High observation 1",
            "9.2"
          ],
          [
            "High observation 2",
            "10.1"
          ],
          [
            "High observation 3",
            "11.4"
          ]
        ]
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-006",
    "optionRationales": [
      "Correct. It calculates the fence correctly and preserves the distinction between a descriptive outlier flag and evidence of an error or special cause.",
      "Incorrect. The whisker endpoint is an observed value inside the fence, not the fence itself or proof that other records are erroneous.",
      "Incorrect. A distributional display without appropriate time-order and baseline evidence does not establish statistical-control violations.",
      "Incorrect. Long-cycle claims can be central to service risk even when a robust median changes little; discarding them changes the population being assessed."
    ],
    "trap": "A Tukey whisker is not necessarily the maximum observation. An outlier label is descriptive, not proof of a recording error or a time-based special cause.",
    "distractors": [
      "Correct. It calculates the fence correctly and preserves the distinction between a descriptive outlier flag and evidence of an error or special cause.",
      "Incorrect. The whisker endpoint is an observed value inside the fence, not the fence itself or proof that other records are erroneous.",
      "Incorrect. A distributional display without appropriate time-order and baseline evidence does not establish statistical-control violations.",
      "Incorrect. Long-cycle claims can be central to service risk even when a robust median changes little; discarding them changes the population being assessed."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Box plot",
        "url": "https://www.itl.nist.gov/div898/handbook/eda/section3/boxplot.htm",
        "locator": "Quartiles, fences and outlier labeling"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A normal probability plot displays all 24 purity-assay results in mass percent. Twenty-two values range from 12.1% to 13.4%, while two are 8.9% and 9.1%. The central observations are near a straight reference trend; the low tail departs markedly. Which conclusion best guides the MBB's next analysis?",
    "options": [
      "The plot proves a second raw-material population; fit two distributions immediately and omit the low observations from the main capability report.",
      "Because 22 of 24 values appear roughly linear, the complete sample has demonstrated normality and the low values need no investigation.",
      "Investigate the low results and their provenance; retain valid data and question normality without assuming a cause.",
      "Discard all 24 observations and restart sampling because any departure from the reference line makes the entire measurement study unusable."
    ],
    "answer": 2,
    "why": "The two low measurements are present in the actual plotted dataset, not inferred from an unlabeled sketch. Their separation makes them a useful focus for record, measurement and process-context checks. The display raises doubt about a single normal model for the whole sample, but it does not identify a lot effect or prove a mixture. A straight central portion is not proof that the full population is normal. Keep valid records and choose subsequent modeling or stratification based on evidence rather than deletion to improve a fit. Source alignment: ASQ CMBB Body of Knowledge, VI.A.5 Process capability for non-normal data. Sources support principles, not ASQ authorship of this original scenario.",
    "chart": {
      "type": "normal-prob",
      "title": "All 24 purity-assay observations",
      "altText": "Ordered purity against Filliben theoretical normal quantiles. The dashed reference passes through the sample quartiles using linear-interpolated quartiles; it is not a hypothesis test.",
      "values": [
        12.1,
        12.3,
        12.4,
        12.5,
        12.5,
        12.6,
        12.6,
        12.7,
        12.7,
        12.7,
        12.8,
        12.8,
        12.8,
        12.9,
        12.9,
        13,
        13,
        13.1,
        13.1,
        13.2,
        13.3,
        13.4,
        8.9,
        9.1
      ],
      "points": [
        {
          "rank": 1,
          "value": 8.9,
          "probability": 0.02846805884639414,
          "z": -1.9038009122306798
        },
        {
          "rank": 2,
          "value": 9.1,
          "probability": 0.06905397085983994,
          "z": -1.482873807168146
        },
        {
          "rank": 3,
          "value": 12.1,
          "probability": 0.11009644982556947,
          "z": -1.2260153473499953
        },
        {
          "rank": 4,
          "value": 12.3,
          "probability": 0.151138928791299,
          "z": -1.0315609161350217
        },
        {
          "rank": 5,
          "value": 12.4,
          "probability": 0.19218140775702855,
          "z": -0.869885801503279
        },
        {
          "rank": 6,
          "value": 12.5,
          "probability": 0.23322388672275807,
          "z": -0.7282708978180911
        },
        {
          "rank": 7,
          "value": 12.5,
          "probability": 0.2742663656884876,
          "z": -0.5999602436906024
        },
        {
          "rank": 8,
          "value": 12.6,
          "probability": 0.31530884465421716,
          "z": -0.48085762800058
        },
        {
          "rank": 9,
          "value": 12.6,
          "probability": 0.35635132361994665,
          "z": -0.3682287868067115
        },
        {
          "rank": 10,
          "value": 12.7,
          "probability": 0.3973938025856762,
          "z": -0.26009874602991956
        },
        {
          "rank": 11,
          "value": 12.7,
          "probability": 0.4384362815514057,
          "z": -0.15493499706475639
        },
        {
          "rank": 12,
          "value": 12.7,
          "probability": 0.4794787605171352,
          "z": -0.051461824655829
        },
        {
          "rank": 13,
          "value": 12.8,
          "probability": 0.5205212394828648,
          "z": 0.051461824655829
        },
        {
          "rank": 14,
          "value": 12.8,
          "probability": 0.5615637184485943,
          "z": 0.15493499706475639
        },
        {
          "rank": 15,
          "value": 12.8,
          "probability": 0.6026061974143239,
          "z": 0.2600987460299197
        },
        {
          "rank": 16,
          "value": 12.9,
          "probability": 0.6436486763800534,
          "z": 0.3682287868067116
        },
        {
          "rank": 17,
          "value": 12.9,
          "probability": 0.684691155345783,
          "z": 0.48085762800058035
        },
        {
          "rank": 18,
          "value": 13,
          "probability": 0.7257336343115125,
          "z": 0.5999602436906027
        },
        {
          "rank": 19,
          "value": 13,
          "probability": 0.766776113277242,
          "z": 0.7282708978180915
        },
        {
          "rank": 20,
          "value": 13.1,
          "probability": 0.8078185922429716,
          "z": 0.8698858015032793
        },
        {
          "rank": 21,
          "value": 13.1,
          "probability": 0.8488610712087011,
          "z": 1.031560916135022
        },
        {
          "rank": 22,
          "value": 13.2,
          "probability": 0.8899035501744307,
          "z": 1.2260153473499962
        },
        {
          "rank": 23,
          "value": 13.3,
          "probability": 0.9309460291401601,
          "z": 1.4828738071681467
        },
        {
          "rank": 24,
          "value": 13.4,
          "probability": 0.9715319411536059,
          "z": 1.9038009122306798
        }
      ],
      "reference": {
        "slope": 0.3706505546264005,
        "intercept": 12.75
      },
      "evidence": {
        "title": "All 24 purity-assay observations — numerical alternative",
        "columns": [
          "Ordered rank",
          "Purity (mass %)",
          "Normal quantile"
        ],
        "rows": [
          [
            "1",
            "8.9",
            "-1.903801"
          ],
          [
            "2",
            "9.1",
            "-1.482874"
          ],
          [
            "3",
            "12.1",
            "-1.226015"
          ],
          [
            "4",
            "12.3",
            "-1.031561"
          ],
          [
            "5",
            "12.4",
            "-0.869886"
          ],
          [
            "6",
            "12.5",
            "-0.728271"
          ],
          [
            "7",
            "12.5",
            "-0.59996"
          ],
          [
            "8",
            "12.6",
            "-0.480858"
          ],
          [
            "9",
            "12.6",
            "-0.368229"
          ],
          [
            "10",
            "12.7",
            "-0.260099"
          ],
          [
            "11",
            "12.7",
            "-0.154935"
          ],
          [
            "12",
            "12.7",
            "-0.051462"
          ],
          [
            "13",
            "12.8",
            "0.051462"
          ],
          [
            "14",
            "12.8",
            "0.154935"
          ],
          [
            "15",
            "12.8",
            "0.260099"
          ],
          [
            "16",
            "12.9",
            "0.368229"
          ],
          [
            "17",
            "12.9",
            "0.480858"
          ],
          [
            "18",
            "13.0",
            "0.59996"
          ],
          [
            "19",
            "13.0",
            "0.728271"
          ],
          [
            "20",
            "13.1",
            "0.869886"
          ],
          [
            "21",
            "13.1",
            "1.031561"
          ],
          [
            "22",
            "13.2",
            "1.226015"
          ],
          [
            "23",
            "13.3",
            "1.482874"
          ],
          [
            "24",
            "13.4",
            "1.903801"
          ]
        ]
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-007",
    "optionRationales": [
      "Incorrect. The plot does not identify provenance or prove a mixture, and automatic deletion would bias the assessed population.",
      "Incorrect. Apparent linearity of a selected central subset does not validate normality for all 24 observations.",
      "Correct. It links the visible tail deviation to appropriate investigation without overclaiming its cause or discarding valid evidence.",
      "Incorrect. A model-assumption concern does not make every recorded observation invalid or require wholesale replacement of the study."
    ],
    "trap": "A straight central subset does not prove full-sample normality. Check the low observations and their provenance before deleting, stratifying or fitting a mixture.",
    "distractors": [
      "Incorrect. The plot does not identify provenance or prove a mixture, and automatic deletion would bias the assessed population.",
      "Incorrect. Apparent linearity of a selected central subset does not validate normality for all 24 observations.",
      "Correct. It links the visible tail deviation to appropriate investigation without overclaiming its cause or discarding valid evidence.",
      "Incorrect. A model-assumption concern does not make every recorded observation invalid or require wholesale replacement of the study."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A.5 Process capability for non-normal data"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Normal probability plot",
        "url": "https://www.itl.nist.gov/div898/handbook/eda/section3/normprpl.htm",
        "locator": "Normal quantile plot and Filliben order-statistic plotting positions"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "Four illustrative target panels A–D show repeated measurement errors relative to a reference at the center. Their coordinate scale is identical. A proposed correction can shift a panel's mean error but cannot change its repeatability spread. Which panel best represents high precision with substantial systematic offset, making a validated offset correction the first candidate rather than averaging alone?",
    "options": [
      "Panel A: the clustered results near the reference indicate that a substantial offset correction is needed before any further use.",
      "Panel B: the widely dispersed results centered near the reference indicate a large constant offset but little repeatability error.",
      "Panel C: the results cluster tightly away from the reference; assess an offset correction and verify residual bias and repeatability afterward.",
      "Panel D: the widely dispersed, displaced results indicate that shifting their average alone will also make the individual readings precise."
    ],
    "answer": 2,
    "why": "Panel C combines small repeatability spread with a displaced mean relative to the reference. A suitable validated correction may address that systematic component, but averaging alone does not remove a constant bias. Panel A is already clustered near the reference; B has large spread with a near-centered average; D combines large spread with offset. Accuracy is broader than mean centering: an on-target average does not make imprecise individual measurements accurate. This schematic does not quantify uncertainty for a real instrument. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control. Sources support principles, not ASQ authorship of this original scenario.",
    "chart": {
      "type": "precision-accuracy",
      "title": "Four illustrative target panels",
      "altText": "Panels A–D use identical error-coordinate scales and the same central reference. Coordinates in the numerical alternative describe every marker without assigning a diagnosis.",
      "panels": [
        {
          "label": "A",
          "points": [
            [
              -0.4,
              -0.2
            ],
            [
              0.3,
              0.2
            ],
            [
              0.2,
              -0.3
            ],
            [
              -0.2,
              0.4
            ],
            [
              0.1,
              0.1
            ]
          ]
        },
        {
          "label": "B",
          "points": [
            [
              -5,
              -3
            ],
            [
              5,
              3
            ],
            [
              -4,
              4
            ],
            [
              4,
              -4
            ],
            [
              0,
              0
            ]
          ]
        },
        {
          "label": "C",
          "points": [
            [
              3.6,
              2.8
            ],
            [
              4.3,
              3.2
            ],
            [
              4.2,
              2.7
            ],
            [
              3.8,
              3.4
            ],
            [
              4.1,
              3.1
            ]
          ]
        },
        {
          "label": "D",
          "points": [
            [
              -2,
              -6
            ],
            [
              8,
              0
            ],
            [
              -1,
              1
            ],
            [
              7,
              -7
            ],
            [
              3,
              -3
            ]
          ]
        }
      ],
      "evidence": {
        "title": "Four illustrative target panels — numerical alternative",
        "columns": [
          "Panel",
          "Reading",
          "Horizontal error (units)",
          "Vertical error (units)"
        ],
        "rows": [
          [
            "A",
            "1",
            "-0.4",
            "-0.2"
          ],
          [
            "A",
            "2",
            "0.3",
            "0.2"
          ],
          [
            "A",
            "3",
            "0.2",
            "-0.3"
          ],
          [
            "A",
            "4",
            "-0.2",
            "0.4"
          ],
          [
            "A",
            "5",
            "0.1",
            "0.1"
          ],
          [
            "B",
            "1",
            "-5",
            "-3"
          ],
          [
            "B",
            "2",
            "5",
            "3"
          ],
          [
            "B",
            "3",
            "-4",
            "4"
          ],
          [
            "B",
            "4",
            "4",
            "-4"
          ],
          [
            "B",
            "5",
            "0",
            "0"
          ],
          [
            "C",
            "1",
            "3.6",
            "2.8"
          ],
          [
            "C",
            "2",
            "4.3",
            "3.2"
          ],
          [
            "C",
            "3",
            "4.2",
            "2.7"
          ],
          [
            "C",
            "4",
            "3.8",
            "3.4"
          ],
          [
            "C",
            "5",
            "4.1",
            "3.1"
          ],
          [
            "D",
            "1",
            "-2",
            "-6"
          ],
          [
            "D",
            "2",
            "8",
            "0"
          ],
          [
            "D",
            "3",
            "-1",
            "1"
          ],
          [
            "D",
            "4",
            "7",
            "-7"
          ],
          [
            "D",
            "5",
            "3",
            "-3"
          ]
        ]
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-008",
    "optionRationales": [
      "Incorrect. Panel A's mean is near the reference; the diagram does not support a substantial offset correction there.",
      "Incorrect. Panel B's main displayed problem is spread, not a large mean offset.",
      "Correct. Panel C shows the specified combination; a correction must still be validated rather than assumed to eliminate all error.",
      "Incorrect. Moving the mean of panel D does not reduce its large repeatability spread."
    ],
    "trap": "Moving a mean does not reduce repeatability spread. Averaging does not remove a constant bias, and a centered average need not imply accurate individual readings.",
    "distractors": [
      "Incorrect. Panel A's mean is near the reference; the diagram does not support a substantial offset correction there.",
      "Incorrect. Panel B's main displayed problem is spread, not a large mean offset.",
      "Correct. Panel C shows the specified combination; a correction must still be validated rather than assumed to eliminate all error.",
      "Incorrect. Moving the mean of panel D does not reduce its large repeatability spread."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Bias and accuracy",
        "url": "https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc45.htm",
        "locator": "Bias relative to reference and measurement-system accuracy"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "An illustrative gage study uses traceable references of 10, 50 and 90 mm. Mean readings from repeated measurements are 12, 52 and 92 mm. Repeatability and reference uncertainty still require validation; no regression significance test is provided. Which interpretation and next step are justified by these observed means?",
    "options": [
      "Bias is consistently +2 mm; validate a candidate offset correction, including repeatability and residual bias across the intended range.",
      "The observed bias increases from 12 to 92 mm across the range, so a constant-offset correction is ruled out by the data.",
      "The means rise with the references, which proves the gage is unbiased and eliminates the need for reference-uncertainty or repeatability checks.",
      "Subtract 2% from every reading and declare the system calibrated, because a constant absolute offset is equivalent to a constant relative error."
    ],
    "answer": 0,
    "why": "Bias is measured mean minus reference: 12 - 10, 52 - 50 and 92 - 90 each equal +2 mm. These observed means suggest an additive offset, not an increasing absolute bias. They do not establish the statistical absence of a slope, adequate repeatability, or performance between and beyond the tested levels. Investigate calibration and uncertainty, apply only a justified correction, and verify residual errors. A 2% multiplicative correction is not a 2 mm additive correction. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control. Sources support principles, not ASQ authorship of this original scenario.",
    "chart": {
      "type": "bias-diagram",
      "title": "Illustrative reference and mean-reading comparison",
      "altText": "The figure plots mean minus reference for each of the three levels; it does not show repeatability or confidence intervals.",
      "referenceValues": [
        10,
        50,
        90
      ],
      "measuredMeans": [
        12,
        52,
        92
      ],
      "biases": [
        2,
        2,
        2
      ],
      "evidence": {
        "title": "Illustrative reference and mean-reading comparison — numerical alternative",
        "columns": [
          "Reference (mm)",
          "Measured mean (mm)",
          "Bias (mm)"
        ],
        "rows": [
          [
            "10",
            "12",
            "2"
          ],
          [
            "50",
            "52",
            "2"
          ],
          [
            "90",
            "92",
            "2"
          ]
        ]
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-009",
    "optionRationales": [
      "Correct. It correctly computes the three biases and treats constant-offset calibration as a candidate requiring validation, not a proven complete fix.",
      "Incorrect. It substitutes the raw measurement means for bias; the reference values must first be subtracted.",
      "Incorrect. Tracking increasing references does not demonstrate absence of bias; the displayed means all exceed their references.",
      "Incorrect. The offset is in millimetres, not percent, and calibration adequacy cannot be declared from these three means alone."
    ],
    "trap": "A 2 mm additive offset is not a 2% multiplicative error. Three observed means do not prove statistical absence of linearity error or validate a calibration.",
    "distractors": [
      "Correct. It correctly computes the three biases and treats constant-offset calibration as a candidate requiring validation, not a proven complete fix.",
      "Incorrect. It substitutes the raw measurement means for bias; the reference values must first be subtracted.",
      "Incorrect. Tracking increasing references does not demonstrate absence of bias; the displayed means all exceed their references.",
      "Incorrect. The offset is in millimetres, not percent, and calibration adequacy cannot be declared from these three means alone."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Bias and accuracy",
        "url": "https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc45.htm",
        "locator": "Bias relative to reference and measurement-system accuracy"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A capability report uses a conventional within-subgroup Cpk of 1.5 to predict a normal-tail nonconformance rate. Stability and measurement adequacy are supported, but the same data's normal probability plot has a strong systematic S-shape. Which action should the MBB require before accepting the predicted rate?",
    "options": [
      "Reject the process as incapable immediately; any non-normal pattern means the process must fail its specifications regardless of its observed tails.",
      "Transform measurements to normality, but compare them with the original specification limits so that the customer requirements remain unchanged.",
      "Withhold the normal-tail prediction; investigate distributional fit and use a justified transformation with transformed limits, a suitable distributional model or a defensible alternative.",
      "Accept the prediction because the Cpk arithmetic can be computed for these data, which makes normal-tail probabilities valid for any distribution shape."
    ],
    "answer": 2,
    "why": "The Cpk formula can be evaluated algebraically without a normal distribution, but its usual normal-tail interpretation needs an appropriate model. A systematic probability-plot departure challenges the report's tail prediction; it does not by itself prove poor capability or identify a specific distribution. Check fit in the relevant tails and model uncertainty. Any transformation must also be applied consistently to the specification limits. Empirical tail estimates or nonnormal methods require adequate data rather than an automatic distribution choice. Source alignment: ASQ CMBB Body of Knowledge, VI.A.5 Process capability for non-normal data. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d6-010",
    "optionRationales": [
      "Incorrect. Nonnormality challenges a model assumption, not necessarily the process's ability to meet specifications.",
      "Incorrect. A transformation must also be applied to the specification limits; comparing transformed measurements with untransformed limits changes the meaning of conformance.",
      "Correct. It separates computable index arithmetic from unsupported tail inference and requires a method appropriate to the data and limits.",
      "Incorrect. Existence of an arithmetic ratio does not validate a normal-distribution probability calculation."
    ],
    "trap": "An index can be calculated even when its usual tail interpretation is unsupported. Match the distributional method and transformed limits to the intended probability claim.",
    "distractors": [
      "Incorrect. Nonnormality challenges a model assumption, not necessarily the process's ability to meet specifications.",
      "Incorrect. A transformation must also be applied to the specification limits; comparing transformed measurements with untransformed limits changes the meaning of conformance.",
      "Correct. It separates computable index arithmetic from unsupported tail inference and requires a method appropriate to the data and limits.",
      "Incorrect. Existence of an arithmetic ratio does not validate a normal-distribution probability calculation."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A.5 Process capability for non-normal data"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: What is process capability?",
        "url": "https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm",
        "locator": "Cp, Cpu, Cpl, Cpk formulas, centering and normal-distribution interpretation"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Normal probability plot",
        "url": "https://www.itl.nist.gov/div898/handbook/eda/section3/normprpl.htm",
        "locator": "Normal quantile plot and Filliben order-statistic plotting positions"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A fill-weight chart uses fixed baseline limits and a preselected Western Electric rule: eight consecutive points strictly on one side of the centerline trigger investigation. After 40 baseline points with no configured signals, points 41–48 are all above the centerline but inside the 3-sigma limits. The display shows only points 37–48. What is the appropriate interpretation?",
    "options": [
      "The configured eight-point rule signals at point 48; investigate a possible shift without automatically replacing the validated baseline limits.",
      "No signal is present because a valid run must contain at least one point beyond a 3-sigma limit before it can be investigated.",
      "The chart must wait for a ninth point above the centerline because every run-rule system uses nine, regardless of the preselected rule.",
      "The eight points prove a permanent new mean, so replace the centerline and limits immediately using only these latest eight observations."
    ],
    "answer": 0,
    "why": "The displayed points 41–48 are eight consecutive values strictly above 500 g, so the stated rule signals at point 48 without requiring a limit exceedance. This is evidence warranting investigation, not proof of a specific cause or a permanent shift. Western Electric's eight-point rule is distinct from rule sets that use nine. The figure is explicitly the final 12-point excerpt; it does not misrepresent 12 points as all 48 observations. Avoid automatic recalculation that absorbs the signal. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control. Sources support principles, not ASQ authorship of this original scenario.",
    "chart": {
      "type": "control-single",
      "title": "Final 12 observations of the 48-point fill-weight sequence",
      "altText": "Only observations 37–48 are shown. The centerline is 500 g, UCL 505 g and LCL 495 g; values 41–48 are above the centerline.",
      "labels": [
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48
      ],
      "data": [
        499,
        501,
        500,
        498,
        502,
        501,
        502,
        503,
        502,
        504,
        503,
        502
      ],
      "ucl": 505,
      "cl": 500,
      "lcl": 495,
      "evidence": {
        "title": "Final 12 observations of the 48-point fill-weight sequence — numerical alternative",
        "columns": [
          "Observation number",
          "Weight (g)"
        ],
        "rows": [
          [
            "37",
            "499"
          ],
          [
            "38",
            "501"
          ],
          [
            "39",
            "500"
          ],
          [
            "40",
            "498"
          ],
          [
            "41",
            "502"
          ],
          [
            "42",
            "501"
          ],
          [
            "43",
            "502"
          ],
          [
            "44",
            "503"
          ],
          [
            "45",
            "502"
          ],
          [
            "46",
            "504"
          ],
          [
            "47",
            "503"
          ],
          [
            "48",
            "502"
          ]
        ]
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-011",
    "optionRationales": [
      "Correct. It applies the configured rule and proposes investigation without automatically redefining the baseline.",
      "Incorrect. The run rule is an additional signal rule and does not require a 3-sigma exceedance.",
      "Incorrect. It substitutes a different run length for the one explicitly selected in the question.",
      "Incorrect. A signal alone does not establish a permanent regime or justify estimating a new baseline from only these eight points."
    ],
    "trap": "Apply the rule that was selected: eight points for this Western Electric run rule, not nine from another rule set. A signal calls for investigation, not automatic rebaselining.",
    "distractors": [
      "Correct. It applies the configured rule and proposes investigation without automatically redefining the baseline.",
      "Incorrect. The run rule is an additional signal rule and does not require a 3-sigma exceedance.",
      "Incorrect. It substitutes a different run length for the one explicitly selected in the question.",
      "Incorrect. A signal alone does not establish a permanent regime or justify estimating a new baseline from only these eight points."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Shewhart control charts",
        "url": "https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm",
        "locator": "Control versus specification limits, Western Electric eight-point rule and justified limit revisions"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "An engineer proposes replacing an X-bar chart's 3-sigma limits with the individual-unit engineering specifications to 'catch defects sooner.' The chart plots subgroup means, and separate checks are available for unit conformance. Which response best addresses both the statistical and operational flaw?",
    "options": [
      "Use specifications as control limits whenever the sample size exceeds five, because larger subgroups make average and individual-unit variation equivalent.",
      "Replace the limits only when specifications are tighter, since tighter decision boundaries necessarily preserve the chart's designed false-alarm behavior.",
      "Retain subgroup-mean control limits for stability and specifications for unit conformance; derive them separately even when their numerical values coincide.",
      "Widen the product specifications until they match the current chart limits, allowing a single boundary set to govern both monitoring and customer acceptance."
    ],
    "answer": 2,
    "why": "Control limits describe the expected behavior of a plotted statistic under the monitoring model. Engineering specifications describe required product performance. Subgroup means and individual units have different spreads, so substituting individual specifications can miss nonconforming units or change detection and false-alarm properties. Keep stability monitoring and conformance assessment distinct. The boundaries can coincide numerically by chance, but forcing equality or changing requirements to fit the process has no statistical justification. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d6-012",
    "optionRationales": [
      "Incorrect. Increasing subgroup size does not make the distribution of means equal to the distribution of individual measurements.",
      "Incorrect. Changing the boundaries changes their signal probabilities; tighter specifications do not automatically preserve the designed false-alarm rate.",
      "Correct. It distinguishes both purpose and statistical scale without asserting that independently derived limits can never coincide.",
      "Incorrect. Customer or engineering requirements cannot be widened merely to make the process or chart appear acceptable."
    ],
    "trap": "Subgroup means and individual units have different variation. Control and specification limits answer different questions even when their numbers happen to match.",
    "distractors": [
      "Incorrect. Increasing subgroup size does not make the distribution of means equal to the distribution of individual measurements.",
      "Incorrect. Changing the boundaries changes their signal probabilities; tighter specifications do not automatically preserve the designed false-alarm rate.",
      "Correct. It distinguishes both purpose and statistical scale without asserting that independently derived limits can never coincide.",
      "Incorrect. Customer or engineering requirements cannot be widened merely to make the process or chart appear acceptable."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Shewhart control charts",
        "url": "https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm",
        "locator": "Control versus specification limits, Western Electric eight-point rule and justified limit revisions"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "Two single-sampling plans use the binomial model for large homogeneous lots with independent item outcomes. Plan A samples n = 200 and accepts at most 10 defectives; Plan B uses n = 50 and accepts at most 2. The OC curves and selected binomial probabilities are provided. At 1% defective the lot is designated good; at 10% it is designated poor. Which comparison is justified?",
    "options": [
      "The steepness of A proves that it has a higher acceptance probability at every defect level and requires fewer inspected items than B.",
      "A has lower risks at both designated quality levels, with a larger sample; slope alone would not establish these comparisons.",
      "A's larger sample proves its consumer risk is higher at 10% defective, regardless of the acceptance numbers or the displayed probabilities.",
      "B's smaller sample guarantees equal discrimination at both designated quality levels because both plans use the same binomial distribution family."
    ],
    "answer": 1,
    "why": "For each plan, Pa(p) is the sum of binomial probabilities for 0 through c defectives. At 1% defective, Pa is approximately 0.999993 for A and 0.986183 for B, so producer risk 1 - Pa is smaller for A. At 10%, Pa is about 0.008071 for A and 0.111729 for B, so consumer risk is also smaller for A there. These comparisons use actual quality levels and curve locations, not steepness alone. A inspects 200 items rather than 50; neither risk statement is a claim of dominance at every possible quality level. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control (related acceptance-sampling application; not a separately named BoK subtopic). Sources support principles, not ASQ authorship of this original scenario.",
    "chart": {
      "type": "oc-curve",
      "title": "Binomial single-sampling operating characteristics",
      "altText": "Solid curve A: sample 200, accept at most 10. Dashed curve B: sample 50, accept at most 2. Acceptance probabilities are binomial-model values; the numerical table rounds to six decimals.",
      "plans": [
        {
          "label": "A",
          "n": 200,
          "c": 10
        },
        {
          "label": "B",
          "n": 50,
          "c": 2
        }
      ],
      "curves": [
        {
          "p": 0,
          "acceptance": [
            1,
            1
          ]
        },
        {
          "p": 0.001,
          "acceptance": [
            0.9999999999999996,
            0.9999810783448599
          ]
        },
        {
          "p": 0.002,
          "acceptance": [
            0.999999999999438,
            0.9998538575792005
          ]
        },
        {
          "p": 0.003,
          "acceptance": [
            0.999999999959138,
            0.9995237863870275
          ]
        },
        {
          "p": 0.004,
          "acceptance": [
            0.9999999991862502,
            0.998910079794915
          ]
        },
        {
          "p": 0.005,
          "acceptance": [
            0.9999999920313928,
            0.9979444558904411
          ]
        },
        {
          "p": 0.006,
          "acceptance": [
            0.9999999501927571,
            0.9965699663313831
          ]
        },
        {
          "p": 0.007,
          "acceptance": [
            0.9999997716183714,
            0.9947399145325507
          ]
        },
        {
          "p": 0.008,
          "acceptance": [
            0.9999991652294988,
            0.9924168557803177
          ]
        },
        {
          "p": 0.009,
          "acceptance": [
            0.9999974338446791,
            0.9895716738680105
          ]
        },
        {
          "p": 0.01,
          "acceptance": [
            0.999993118229587,
            0.9861827291693992
          ]
        },
        {
          "p": 0.011,
          "acceptance": [
            0.9999834745014553,
            0.9822350733735754
          ]
        },
        {
          "p": 0.012,
          "acceptance": [
            0.9999637742843002,
            0.9777197263934596
          ]
        },
        {
          "p": 0.013,
          "acceptance": [
            0.9999264394037934,
            0.9726330112329395
          ]
        },
        {
          "p": 0.014,
          "acceptance": [
            0.9998600469673155,
            0.9669759428550667
          ]
        },
        {
          "p": 0.015,
          "acceptance": [
            0.9997482627408958,
            0.9607536673366239
          ]
        },
        {
          "p": 0.016,
          "acceptance": [
            0.9995687777181369,
            0.9539749478235064
          ]
        },
        {
          "p": 0.017,
          "acceptance": [
            0.9992923325547577,
            0.9466516940174592
          ]
        },
        {
          "p": 0.018,
          "acceptance": [
            0.9988819161251641,
            0.9387985321284753
          ]
        },
        {
          "p": 0.019,
          "acceptance": [
            0.9982922179416858,
            0.930432412419238
          ]
        },
        {
          "p": 0.02,
          "acceptance": [
            0.997469400564651,
            0.9215722516490301
          ]
        },
        {
          "p": 0.021,
          "acceptance": [
            0.996351239067551,
            0.9122386078951044
          ]
        },
        {
          "p": 0.022,
          "acceptance": [
            0.9948676521110403,
            0.90245338539019
          ]
        },
        {
          "p": 0.023,
          "acceptance": [
            0.9929416253217861,
            0.8922395671661383
          ]
        },
        {
          "p": 0.024,
          "acceptance": [
            0.9904905044400553,
            0.8816209734361751
          ]
        },
        {
          "p": 0.025,
          "acceptance": [
            0.9874276147776061,
            0.8706220437823444
          ]
        },
        {
          "p": 0.026,
          "acceptance": [
            0.9836641462085555,
            0.8592676413409098
          ]
        },
        {
          "p": 0.027,
          "acceptance": [
            0.979111230058906,
            0.8475828772972048
          ]
        },
        {
          "p": 0.028,
          "acceptance": [
            0.9736821262906843,
            0.8355929541130703
          ]
        },
        {
          "p": 0.029,
          "acceptance": [
            0.9672944363251449,
            0.8233230260149917
          ]
        },
        {
          "p": 0.03,
          "acceptance": [
            0.9598722584152357,
            0.8107980753697203
          ]
        },
        {
          "p": 0.031,
          "acceptance": [
            0.9513482081040184,
            0.79804280366687
          ]
        },
        {
          "p": 0.032,
          "acceptance": [
            0.9416652352609495,
            0.7850815359150783
          ]
        },
        {
          "p": 0.033,
          "acceptance": [
            0.9307781806418141,
            0.7719381373400928
          ]
        },
        {
          "p": 0.034,
          "acceptance": [
            0.9186550280113565,
            0.7586359413499221
          ]
        },
        {
          "p": 0.035,
          "acceptance": [
            0.9052778217695028,
            0.7451976878042331
          ]
        },
        {
          "p": 0.036,
          "acceptance": [
            0.890643233974751,
            0.731645470692755
          ]
        },
        {
          "p": 0.037,
          "acceptance": [
            0.8747627780084514,
            0.7180006943908362
          ]
        },
        {
          "p": 0.038,
          "acceptance": [
            0.8576626783413718,
            0.7042840377197053
          ]
        },
        {
          "p": 0.039,
          "acceptance": [
            0.839383416550687,
            0.6905154250946648
          ]
        },
        {
          "p": 0.04,
          "acceptance": [
            0.8199789826230847,
            0.6767140040965924
          ]
        },
        {
          "p": 0.041,
          "acceptance": [
            0.7995158675221321,
            0.662898128850957
          ]
        },
        {
          "p": 0.042,
          "acceptance": [
            0.7780718379582522,
            0.6490853486442543
          ]
        },
        {
          "p": 0.043,
          "acceptance": [
            0.7557345373328187,
            0.6352924012505268
          ]
        },
        {
          "p": 0.044,
          "acceptance": [
            0.7325999580634454,
            0.621535210480615
          ]
        },
        {
          "p": 0.045,
          "acceptance": [
            0.7087708301204934,
            0.6078288875041602
          ]
        },
        {
          "p": 0.046,
          "acceptance": [
            0.6843549688382627,
            0.5941877355292983
          ]
        },
        {
          "p": 0.047,
          "acceptance": [
            0.6594636221528374,
            0.5806252574575901
          ]
        },
        {
          "p": 0.048,
          "acceptance": [
            0.6342098536144979,
            0.567154166162171
          ]
        },
        {
          "p": 0.049,
          "acceptance": [
            0.6087069930738144,
            0.5537863970654937
          ]
        },
        {
          "p": 0.05,
          "acceptance": [
            0.5830671820811668,
            0.540533122719514
          ]
        },
        {
          "p": 0.051,
          "acceptance": [
            0.5574000359827863,
            0.5274047691158368
          ]
        },
        {
          "p": 0.052,
          "acceptance": [
            0.5318114396300849,
            0.5144110334763179
          ]
        },
        {
          "p": 0.053,
          "acceptance": [
            0.5064024887021015,
            0.5015609032960036
          ]
        },
        {
          "p": 0.054,
          "acceptance": [
            0.4812685840027726,
            0.48886267643017994
          ]
        },
        {
          "p": 0.055,
          "acceptance": [
            0.4564986818353707,
            0.4763239820358035
          ]
        },
        {
          "p": 0.056,
          "acceptance": [
            0.43217469974789413,
            0.4639518021947561
          ]
        },
        {
          "p": 0.057,
          "acceptance": [
            0.4083710736316263,
            0.45175249406232004
          ]
        },
        {
          "p": 0.058,
          "acceptance": [
            0.3851544593637425,
            0.4397318123990641
          ]
        },
        {
          "p": 0.059,
          "acceptance": [
            0.36258356991717383,
            0.4278949323580394
          ]
        },
        {
          "p": 0.06,
          "acceptance": [
            0.34070913710370343,
            0.4162464724118734
          ]
        },
        {
          "p": 0.061,
          "acceptance": [
            0.3195739858434693,
            0.4047905173161632
          ]
        },
        {
          "p": 0.062,
          "acceptance": [
            0.2992132080281411,
            0.39353064101628804
          ]
        },
        {
          "p": 0.063,
          "acceptance": [
            0.2796544226243374,
            0.3824699294150281
          ]
        },
        {
          "p": 0.064,
          "acceptance": [
            0.2609181085971361,
            0.3716110029273556
          ]
        },
        {
          "p": 0.065,
          "acceptance": [
            0.24301799747373135,
            0.36095603875759485
          ]
        },
        {
          "p": 0.066,
          "acceptance": [
            0.22596151285990657,
            0.3505067928417148
          ]
        },
        {
          "p": 0.067,
          "acceptance": [
            0.2097502449208326,
            0.3402646214050318
          ]
        },
        {
          "p": 0.068,
          "acceptance": [
            0.19438044869235566,
            0.33023050209195853
          ]
        },
        {
          "p": 0.069,
          "acceptance": [
            0.1798435560587634,
            0.3204050546307978
          ]
        },
        {
          "p": 0.07,
          "acceptance": [
            0.16612669227556962,
            0.3107885610018909
          ]
        },
        {
          "p": 0.071,
          "acceptance": [
            0.1532131889987149,
            0.3013809850827869
          ]
        },
        {
          "p": 0.072,
          "acceptance": [
            0.14108308687192608,
            0.2921819917485138
          ]
        },
        {
          "p": 0.073,
          "acceptance": [
            0.12971362179841936,
            0.28319096540949396
          ]
        },
        {
          "p": 0.074,
          "acceptance": [
            0.11907969005869742,
            0.2744070279733335
          ]
        },
        {
          "p": 0.075,
          "acceptance": [
            0.10915428841772085,
            0.26582905622032804
          ]
        },
        {
          "p": 0.076,
          "acceptance": [
            0.09990892627863508,
            0.2574556985856515
          ]
        },
        {
          "p": 0.077,
          "acceptance": [
            0.09131400777802456,
            0.24928539134407493
          ]
        },
        {
          "p": 0.078,
          "acceptance": [
            0.08333918247347517,
            0.24131637419564045
          ]
        },
        {
          "p": 0.079,
          "acceptance": [
            0.07595366394521566,
            0.23354670525303664
          ]
        },
        {
          "p": 0.08,
          "acceptance": [
            0.06912651621930378,
            0.2259742754334942
          ]
        },
        {
          "p": 0.081,
          "acceptance": [
            0.06282690842174864,
            0.21859682225987237
          ]
        },
        {
          "p": 0.082,
          "acceptance": [
            0.05702433849424829,
            0.21141194307724745
          ]
        },
        {
          "p": 0.083,
          "acceptance": [
            0.05168882714724884,
            0.20441710769276564
          ]
        },
        {
          "p": 0.084,
          "acceptance": [
            0.04679108350010126,
            0.19760967044779595
          ]
        },
        {
          "p": 0.085,
          "acceptance": [
            0.042302644067140745,
            0.19098688173253026
          ]
        },
        {
          "p": 0.086,
          "acceptance": [
            0.03819598689886027,
            0.184545898954138
          ]
        },
        {
          "p": 0.087,
          "acceptance": [
            0.03444462278548747,
            0.17828379697040989
          ]
        },
        {
          "p": 0.088,
          "acceptance": [
            0.031023165482678867,
            0.17219757800152102
          ]
        },
        {
          "p": 0.089,
          "acceptance": [
            0.02790738293205143,
            0.1662841810331305
          ]
        },
        {
          "p": 0.09,
          "acceptance": [
            0.025074231428929516,
            0.16054049072451043
          ]
        },
        {
          "p": 0.091,
          "acceptance": [
            0.022501874641706686,
            0.15496334583578267
          ]
        },
        {
          "p": 0.092,
          "acceptance": [
            0.02016968931688938,
            0.14954954718863517
          ]
        },
        {
          "p": 0.093,
          "acceptance": [
            0.018058259416035338,
            0.14429586517510753
          ]
        },
        {
          "p": 0.094,
          "acceptance": [
            0.016149360329773595,
            0.1391990468291788
          ]
        },
        {
          "p": 0.095,
          "acceptance": [
            0.014425934703759451,
            0.134255822475971
          ]
        },
        {
          "p": 0.096,
          "acceptance": [
            0.012872061295160426,
            0.12946291197340182
          ]
        },
        {
          "p": 0.097,
          "acceptance": [
            0.0114729181590053,
            0.12481703056108948
          ]
        },
        {
          "p": 0.098,
          "acceptance": [
            0.010214741343933922,
            0.12031489433123228
          ]
        },
        {
          "p": 0.099,
          "acceptance": [
            0.009084780158621948,
            0.11595322533606667
          ]
        },
        {
          "p": 0.1,
          "acceptance": [
            0.008071249955102727,
            0.11172875634634728
          ]
        },
        {
          "p": 0.101,
          "acceptance": [
            0.007163283264702196,
            0.10763823527510231
          ]
        },
        {
          "p": 0.102,
          "acceptance": [
            0.006350880017364422,
            0.10367842928069697
          ]
        },
        {
          "p": 0.103,
          "acceptance": [
            0.005624857476524246,
            0.09984612856299224
          ]
        },
        {
          "p": 0.104,
          "acceptance": [
            0.004976800429885929,
            0.09613814986611753
          ]
        },
        {
          "p": 0.105,
          "acceptance": [
            0.00439901209179529,
            0.09255133970109038
          ]
        },
        {
          "p": 0.106,
          "acceptance": [
            0.0038844660954717634,
            0.0890825773012133
          ]
        },
        {
          "p": 0.107,
          "acceptance": [
            0.003426759883177299,
            0.08572877732286098
          ]
        },
        {
          "p": 0.108,
          "acceptance": [
            0.0030200697393007172,
            0.0824868923039455
          ]
        },
        {
          "p": 0.109,
          "acceptance": [
            0.0026591076550946846,
            0.07935391489200964
          ]
        },
        {
          "p": 0.11,
          "acceptance": [
            0.0023390801641097045,
            0.07632687985355727
          ]
        },
        {
          "p": 0.111,
          "acceptance": [
            0.0020556492438625353,
            0.07340286587588007
          ]
        },
        {
          "p": 0.112,
          "acceptance": [
            0.001804895341554283,
            0.07057899717229053
          ]
        },
        {
          "p": 0.113,
          "acceptance": [
            0.0015832825492910828,
            0.06785244490131644
          ]
        },
        {
          "p": 0.114,
          "acceptance": [
            0.0013876259268207662,
            0.06522042841005948
          ]
        },
        {
          "p": 0.115,
          "acceptance": [
            0.001215060946842973,
            0.06268021631156684
          ]
        },
        {
          "p": 0.116,
          "acceptance": [
            0.0010630150190445778,
            0.060229127405713456
          ]
        },
        {
          "p": 0.117,
          "acceptance": [
            0.0009291810337362823,
            0.057864531452744485
          ]
        },
        {
          "p": 0.118,
          "acceptance": [
            0.0008114928539162922,
            0.05558384980828135
          ]
        },
        {
          "p": 0.119,
          "acceptance": [
            0.0007081026753809901,
            0.0533845559282553
          ]
        },
        {
          "p": 0.12,
          "acceptance": [
            0.0006173601677818343,
            0.051264175751895444
          ]
        },
        {
          "p": 0.121,
          "acceptance": [
            0.0005377933049595245,
            0.04922028797056897
          ]
        },
        {
          "p": 0.122,
          "acceptance": [
            0.00046809079016399055,
            0.0472505241899467
          ]
        },
        {
          "p": 0.123,
          "acceptance": [
            0.00040708598061217264,
            0.045352568992649805
          ]
        },
        {
          "p": 0.124,
          "acceptance": [
            0.00035374221599119063,
            0.043524159908222886
          ]
        },
        {
          "p": 0.125,
          "acceptance": [
            0.00030713945675447,
            0.04176308729697535
          ]
        },
        {
          "p": 0.126,
          "acceptance": [
            0.0002664621401794533,
            0.04006719415393732
          ]
        },
        {
          "p": 0.127,
          "acceptance": [
            0.00023098816497781595,
            0.038434375838887896
          ]
        },
        {
          "p": 0.128,
          "acceptance": [
            0.0002000789186147652,
            0.036862579738133894
          ]
        },
        {
          "p": 0.129,
          "acceptance": [
            0.00017317026526555664,
            0.035349804863444655
          ]
        },
        {
          "p": 0.13,
          "acceptance": [
            0.00014976441639619756,
            0.033894101393284616
          ]
        },
        {
          "p": 0.131,
          "acceptance": [
            0.00012942261019999722,
            0.032493570161229654
          ]
        },
        {
          "p": 0.132,
          "acceptance": [
            0.00011175853046634457,
            0.031146362096205124
          ]
        },
        {
          "p": 0.133,
          "acceptance": [
            9.643239983106569e-05,
            0.029850677618944492
          ]
        },
        {
          "p": 0.134,
          "acceptance": [
            8.314568669968884e-05,
            0.028604765998835827
          ]
        },
        {
          "p": 0.135,
          "acceptance": [
            7.163636939779584e-05,
            0.027406924675100287
          ]
        },
        {
          "p": 0.136,
          "acceptance": [
            6.167470524801075e-05,
            0.026255498546031576
          ]
        },
        {
          "p": 0.137,
          "acceptance": [
            5.3059456271257736e-05,
            0.02514887922981805
          ]
        },
        {
          "p": 0.138,
          "acceptance": [
            4.56145270382866e-05,
            0.024085504300269758
          ]
        },
        {
          "p": 0.139,
          "acceptance": [
            3.9185973840045386e-05,
            0.023063856500581074
          ]
        },
        {
          "p": 0.14,
          "acceptance": [
            3.3639347791600845e-05,
            0.022082462938075188
          ]
        },
        {
          "p": 0.141,
          "acceptance": [
            2.8857337727847487e-05,
            0.021139894262700548
          ]
        },
        {
          "p": 0.142,
          "acceptance": [
            2.4737681787868285e-05,
            0.02023476383187929
          ]
        },
        {
          "p": 0.143,
          "acceptance": [
            2.1191319419289027e-05,
            0.01936572686414603
          ]
        },
        {
          "p": 0.144,
          "acceptance": [
            1.8140758167602344e-05,
            0.01853147958385966
          ]
        },
        {
          "p": 0.145,
          "acceptance": [
            1.5518632053512294e-05,
            0.017730758359122464
          ]
        },
        {
          "p": 0.146,
          "acceptance": [
            1.3266430590712743e-05,
            0.016962338834898852
          ]
        },
        {
          "p": 0.147,
          "acceptance": [
            1.1333379565158004e-05,
            0.016225035063190524
          ]
        },
        {
          "p": 0.148,
          "acceptance": [
            9.675456593644387e-06,
            0.015517698631995685
          ]
        },
        {
          "p": 0.149,
          "acceptance": [
            8.254526213774465e-06,
            0.014839217794656587
          ]
        },
        {
          "p": 0.15,
          "acceptance": [
            7.03758083881767e-06,
            0.014188516601082553
          ]
        },
        {
          "p": 0.151,
          "acceptance": [
            5.996075349428518e-06,
            0.013564554032223819
          ]
        },
        {
          "p": 0.152,
          "acceptance": [
            5.105344399419137e-06,
            0.012966323139065516
          ]
        },
        {
          "p": 0.153,
          "acceptance": [
            4.344092694425524e-06,
            0.012392850187310293
          ]
        },
        {
          "p": 0.154,
          "acceptance": [
            3.6939495697144855e-06,
            0.01184319380882233
          ]
        },
        {
          "p": 0.155,
          "acceptance": [
            3.1390801555692454e-06,
            0.011316444160814915
          ]
        },
        {
          "p": 0.156,
          "acceptance": [
            2.6658462842896926e-06,
            0.010811722093677714
          ]
        },
        {
          "p": 0.157,
          "acceptance": [
            2.262511070036001e-06,
            0.010328178328258518
          ]
        },
        {
          "p": 0.158,
          "acceptance": [
            1.9189817892589635e-06,
            0.009864992643337475
          ]
        },
        {
          "p": 0.159,
          "acceptance": [
            1.6265863125479612e-06,
            0.00942137307395896
          ]
        },
        {
          "p": 0.16,
          "acceptance": [
            1.3778788951598438e-06,
            0.008996555121217865
          ]
        },
        {
          "p": 0.161,
          "acceptance": [
            1.1664716295636984e-06,
            0.008589800974032306
          ]
        },
        {
          "p": 0.162,
          "acceptance": [
            9.868883048749738e-07,
            0.008200398743373931
          ]
        },
        {
          "p": 0.163,
          "acceptance": [
            8.344378104316729e-07,
            0.007827661709369754
          ]
        },
        {
          "p": 0.164,
          "acceptance": [
            7.051045689238267e-07,
            0.007470927581635531
          ]
        },
        {
          "p": 0.165,
          "acceptance": [
            5.954537929483766e-07,
            0.007129557773150329
          ]
        },
        {
          "p": 0.166,
          "acceptance": [
            5.02549631755082e-07,
            0.006802936687934423
          ]
        },
        {
          "p": 0.167,
          "acceptance": [
            4.2388451603539346e-07,
            0.006490471022748428
          ]
        },
        {
          "p": 0.168,
          "acceptance": [
            3.5731822129960035e-07,
            0.0061915890829901095
          ]
        },
        {
          "p": 0.169,
          "acceptance": [
            3.010253577799793e-07,
            0.005905740112926533
          ]
        },
        {
          "p": 0.17,
          "acceptance": [
            2.534501596824548e-07,
            0.005632393640363236
          ]
        },
        {
          "p": 0.171,
          "acceptance": [
            2.1326759150410025e-07,
            0.005371038835818448
          ]
        },
        {
          "p": 0.172,
          "acceptance": [
            1.7934991630278676e-07,
            0.005121183886239215
          ]
        },
        {
          "p": 0.173,
          "acceptance": [
            1.5073798228021859e-07,
            0.0048823553832670966
          ]
        },
        {
          "p": 0.174,
          "acceptance": [
            1.2661658164034552e-07,
            0.004654097726035221
          ]
        },
        {
          "p": 0.175,
          "acceptance": [
            1.0629332103761084e-07,
            0.004435972538451649
          ]
        },
        {
          "p": 0.176,
          "acceptance": [
            8.918051748581967e-08,
            0.004227558100904343
          ]
        },
        {
          "p": 0.177,
          "acceptance": [
            7.477969864930217e-08,
            0.00402844879629825
          ]
        },
        {
          "p": 0.178,
          "acceptance": [
            6.26683431340019e-08,
            0.0038382545703196653
          ]
        },
        {
          "p": 0.179,
          "acceptance": [
            5.248854575505424e-08,
            0.003656600405801604
          ]
        },
        {
          "p": 0.18,
          "acceptance": [
            4.393733568413764e-08,
            0.003483125811051503
          ]
        },
        {
          "p": 0.181,
          "acceptance": [
            3.6758412672352714e-08,
            0.0033174843219845093
          ]
        },
        {
          "p": 0.182,
          "acceptance": [
            3.0735098909547455e-08,
            0.0031593430178956973
          ]
        },
        {
          "p": 0.183,
          "acceptance": [
            2.5684332140625227e-08,
            0.003008382050689535
          ]
        },
        {
          "p": 0.184,
          "acceptance": [
            2.145154996251761e-08,
            0.0028642941873772113
          ]
        },
        {
          "p": 0.185,
          "acceptance": [
            1.790633625384579e-08,
            0.0027267843656401222
          ]
        },
        {
          "p": 0.186,
          "acceptance": [
            1.49387188669074e-08,
            0.0025955692622520662
          ]
        },
        {
          "p": 0.187,
          "acceptance": [
            1.245602340960783e-08,
            0.0024703768741427597
          ]
        },
        {
          "p": 0.188,
          "acceptance": [
            1.0380201489102776e-08,
            0.002350946111881277
          ]
        },
        {
          "p": 0.189,
          "acceptance": [
            8.645563463651965e-09,
            0.002237026405350171
          ]
        },
        {
          "p": 0.19,
          "acceptance": [
            7.196855803530256e-09,
            0.0021283773213785604
          ]
        },
        {
          "p": 0.191,
          "acceptance": [
            5.987631812707251e-09,
            0.002024768193096439
          ]
        },
        {
          "p": 0.192,
          "acceptance": [
            4.978871899817379e-09,
            0.0019259777607713259
          ]
        },
        {
          "p": 0.193,
          "acceptance": [
            4.137815974330981e-09,
            0.0018317938238839706
          ]
        },
        {
          "p": 0.194,
          "acceptance": [
            3.4369760252263346e-09,
            0.0017420129041998062
          ]
        },
        {
          "p": 0.195,
          "acceptance": [
            2.8533016392392647e-09,
            0.0016564399195898684
          ]
        },
        {
          "p": 0.196,
          "acceptance": [
            2.3674752420384887e-09,
            0.0015748878683558367
          ]
        },
        {
          "p": 0.197,
          "acceptance": [
            1.9633172920086017e-09,
            0.0014971775238121097
          ]
        },
        {
          "p": 0.198,
          "acceptance": [
            1.6272846038568016e-09,
            0.0014231371388795917
          ]
        },
        {
          "p": 0.199,
          "acceptance": [
            1.3480474980808483e-09,
            0.0013526021604451663
          ]
        },
        {
          "p": 0.2,
          "acceptance": [
            1.116133623089088e-09,
            0.0012854149532433089
          ]
        }
      ],
      "evidence": {
        "title": "Binomial single-sampling operating characteristics — numerical alternative",
        "columns": [
          "Lot defective (%)",
          "Plan A acceptance probability",
          "Plan B acceptance probability"
        ],
        "rows": [
          [
            "0",
            "1.000000",
            "1.000000"
          ],
          [
            "1",
            "0.999993",
            "0.986183"
          ],
          [
            "2",
            "0.997469",
            "0.921572"
          ],
          [
            "4",
            "0.819979",
            "0.676714"
          ],
          [
            "5",
            "0.583067",
            "0.540533"
          ],
          [
            "6",
            "0.340709",
            "0.416246"
          ],
          [
            "8",
            "0.069127",
            "0.225974"
          ],
          [
            "10",
            "0.008071",
            "0.111729"
          ],
          [
            "15",
            "0.000007",
            "0.014189"
          ],
          [
            "20",
            "0.000000",
            "0.001285"
          ]
        ]
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-013",
    "optionRationales": [
      "Incorrect. A uses the larger sample, and a steep decline does not imply higher acceptance everywhere; at poor quality lower acceptance is desirable.",
      "Correct. The probabilities at the named good and poor quality levels establish the two risk comparisons, with a clear sample-size tradeoff.",
      "Incorrect. Consumer risk is the acceptance probability at the designated poor quality and is lower for A in the supplied comparison.",
      "Incorrect. Sharing a distributional model does not make different n and c values yield equal OC curves or risks."
    ],
    "trap": "Steepness alone cannot compare producer and consumer risks. Specify good and poor quality levels, read acceptance there, and account for the sample-size tradeoff.",
    "distractors": [
      "Incorrect. A uses the larger sample, and a steep decline does not imply higher acceptance everywhere; at poor quality lower acceptance is desirable.",
      "Correct. The probabilities at the named good and poor quality levels establish the two risk comparisons, with a clear sample-size tradeoff.",
      "Incorrect. Consumer risk is the acceptance probability at the designated poor quality and is lower for A in the supplied comparison.",
      "Incorrect. Sharing a distributional model does not make different n and c values yield equal OC curves or risks."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control (related acceptance-sampling application; not a separately named BoK subtopic)"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Choosing a single sampling plan",
        "url": "https://www.itl.nist.gov/div898/handbook/pmc/section2/pmc222.htm",
        "locator": "Binomial acceptance probabilities and producer/consumer risks at designated quality levels"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A grouped multi-vari display shows four diameter observations from each of three machines, measured in millimetres with the same adequate gage. Within each machine the span is 0.02 mm; the machine groups are separated. Lot, operator and collection-time effects have not been controlled. What conclusion and follow-up are most defensible?",
    "options": [
      "Machine-group differences dominate the displayed spread; investigate setup and measurement conditions with a balanced or blocked follow-up before attributing causation to machine identity.",
      "The display proves the machine mechanisms caused the offsets, so adjust all three machines to the pooled mean without checking product or setup differences.",
      "The 0.02 mm within-machine spans dominate the overall variation, so ignore the differences between machine means and study only individual handling.",
      "The display identifies time drift as the dominant source because connecting observations within each group establishes their chronological sequence across machines."
    ],
    "answer": 0,
    "why": "The group means are 10.02, 10.15 and 9.88 mm, a 0.27 mm spread, while each within-group range is 0.02 mm. Thus between-group separation is the main displayed feature. These descriptive differences do not identify machine identity as the causal mechanism: lot, time, operator or setup may be confounded. Review the production context and collect an appropriate balanced or blocked comparison, with replication and measurement checks, before adjusting equipment or generalizing to the full process. Source alignment: ASQ CMBB Body of Knowledge, VI.B.5 General linear models; VI.B.6 Components of variation. Sources support principles, not ASQ authorship of this original scenario.",
    "chart": {
      "type": "multi-vari",
      "title": "Diameter measurements grouped by machine",
      "altText": "Each marker is one observation; horizontal offsets separate the four readings in each group. Group order is not a time sequence.",
      "groups": [
        {
          "label": "Machine 1",
          "values": [
            10.02,
            10.01,
            10.03,
            10.02
          ]
        },
        {
          "label": "Machine 2",
          "values": [
            10.15,
            10.14,
            10.16,
            10.15
          ]
        },
        {
          "label": "Machine 3",
          "values": [
            9.88,
            9.87,
            9.89,
            9.88
          ]
        }
      ],
      "evidence": {
        "title": "Diameter measurements grouped by machine — numerical alternative",
        "columns": [
          "Machine",
          "Reading",
          "Diameter (mm)"
        ],
        "rows": [
          [
            "Machine 1",
            "1",
            "10.02"
          ],
          [
            "Machine 1",
            "2",
            "10.01"
          ],
          [
            "Machine 1",
            "3",
            "10.03"
          ],
          [
            "Machine 1",
            "4",
            "10.02"
          ],
          [
            "Machine 2",
            "1",
            "10.15"
          ],
          [
            "Machine 2",
            "2",
            "10.14"
          ],
          [
            "Machine 2",
            "3",
            "10.16"
          ],
          [
            "Machine 2",
            "4",
            "10.15"
          ],
          [
            "Machine 3",
            "1",
            "9.88"
          ],
          [
            "Machine 3",
            "2",
            "9.87"
          ],
          [
            "Machine 3",
            "3",
            "9.89"
          ],
          [
            "Machine 3",
            "4",
            "9.88"
          ]
        ]
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-014",
    "optionRationales": [
      "Correct. It quantifies the visible source of separation while requiring a design that can distinguish machine effects from confounding.",
      "Incorrect. Descriptive grouping does not prove cause, and automatic centering may be inappropriate if groups differ in product or intended setup.",
      "Incorrect. The 0.27 mm spread of group means is much larger than each 0.02 mm within-group span in these displayed data.",
      "Incorrect. The group order does not establish a time trend; collection-time confounding remains unassessed."
    ],
    "trap": "Between-group separation is not proof of a machine mechanism. Check lot, operator, time and setup confounding before adjusting equipment.",
    "distractors": [
      "Correct. It quantifies the visible source of separation while requiring a design that can distinguish machine effects from confounding.",
      "Incorrect. Descriptive grouping does not prove cause, and automatic centering may be inappropriate if groups differ in product or intended setup.",
      "Incorrect. The 0.27 mm spread of group means is much larger than each 0.02 mm within-group span in these displayed data.",
      "Incorrect. The group order does not establish a time trend; collection-time confounding remains unassessed."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.5 General linear models; VI.B.6 Components of variation"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Process modeling",
        "url": "https://www.itl.nist.gov/div898/handbook/ppc/section2/ppc22.htm",
        "locator": "Statistical process models and assumptions; descriptive groups alone do not identify causes"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A Black Belt claims sustained 'Six Sigma capability' from Cp = 2.0 calculated with within-subgroup variation on one shift. The report omits the process mean, stability over representative operation and overall performance across shifts. What should the MBB require before accepting the sustained-performance claim?",
    "options": [
      "Accept the claim because Cp = 2.0 establishes both adequate centering and the long-term defect rate, regardless of how the observations were collected.",
      "Subtract exactly 0.5 from Cp and call the result Ppk, using an assumed 1.5-sigma shift in place of collecting overall performance data.",
      "Require only a longer run of the same shift at the same settings; overall variation then necessarily equals within-subgroup variation without a centering check.",
      "Check centering with Cpk, measurement adequacy, stability and representative overall performance with Ppk or suitable tail analysis; do not assume a universal shift or ordering of estimates."
    ],
    "answer": 3,
    "why": "Cp measures specification width relative to within-subgroup spread and ignores the mean. Even a high Cp cannot establish actual tail clearance without centering information. Cpk adds centering, while Ppk uses overall rather than within-subgroup variation; the data must cover the operating conditions relevant to a sustained claim. These are estimator definitions, not guarantees of short or long observation duration. A fixed 1.5-sigma shift and a universal Ppk ordering cannot substitute for evidence, and neither index alone validates a defect rate when model assumptions fail. Source alignment: ASQ CMBB Body of Knowledge, VI.A Measurement Systems Analysis (MSA), Process Capability, and Control. Sources support principles, not ASQ authorship of this original scenario.",
    "set": 3,
    "qid": "mbb:set-3:d6-015",
    "optionRationales": [
      "Incorrect. Cp ignores the mean and does not by itself establish sustained performance or a defect probability.",
      "Incorrect. A conventional shift assumption is not a measurement of overall variation and does not define Ppk for these data.",
      "Incorrect. More data from one narrow operating condition may remain unrepresentative, and centering is still unassessed.",
      "Correct. It identifies missing centering and representative performance evidence while avoiding unsupported conversion or ordering rules."
    ],
    "trap": "Cp ignores the mean; Ppk uses overall spread. Representative data, centering and stability are needed, not a fixed shift or a universal ordering of index estimates.",
    "distractors": [
      "Incorrect. Cp ignores the mean and does not by itself establish sustained performance or a defect probability.",
      "Incorrect. A conventional shift assumption is not a measurement of overall variation and does not define Ppk for these data.",
      "Incorrect. More data from one narrow operating condition may remain unrepresentative, and centering is still unassessed.",
      "Correct. It identifies missing centering and representative performance evidence while avoiding unsupported conversion or ordering rules."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.A Measurement Systems Analysis (MSA), Process Capability, and Control"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: What is process capability?",
        "url": "https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm",
        "locator": "Cp, Cpu, Cpl, Cpk formulas, centering and normal-distribution interpretation"
      },
      {
        "title": "Minitab: Overall capability for Normal Capability Analysis",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/capability-analysis/how-to/capability-analysis/normal-capability-analysis/interpret-the-results/all-statistics-and-graphs/overall-capability/",
        "locator": "Overall standard deviation, Pp and Ppk; comparison with within capability"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "An observational ordinary least-squares model with an intercept predicts patient length of stay from five clinical variables and has training R² = 0.89. No intervention, causal identification strategy or independent validation has been performed. The sponsor proposes changing care based on the largest coefficients. Which review conclusion is best supported?",
    "options": [
      "Approve the intervention because explaining 89% of outcome variation establishes that the included predictors are the important causal levers.",
      "Approve the causal interpretation after cross-validation reproduces R² = 0.89; successful prediction removes the need to investigate confounding.",
      "Validate prediction separately; require causal identification before interpreting these observational coefficients as intervention effects.",
      "Discard the model because observational R² cannot provide useful information about either sample fit or predictive performance."
    ],
    "answer": 2,
    "why": "R² = 0.89 describes the fraction of centered response variation explained in this training sample. It neither identifies causal effects nor establishes generalization. Predictor timing, confounding, selection, reverse causation and leakage need consideration; merely collecting more observational data or validating prediction does not supply causal identification. A useful predictive model and a defensible intervention model answer different questions. Source alignment: ASQ CMBB Body of Knowledge, VI.B.2, Multiple regression analysis. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-016",
    "optionRationales": [
      "Incorrect. The proportion of training variation explained is not the proportion caused by these variables, and coefficient magnitude also depends on units.",
      "Incorrect. Held-out prediction can support generalization to comparable cases, but a noncausal proxy can predict well without being an effective intervention target.",
      "Correct. This separates descriptive fit, predictive validation and causal identification, preserving legitimate model uses without authorizing unsupported care changes.",
      "Incorrect. Observational models can provide useful descriptions and predictions; the unsupported step is equating either with a causal intervention effect."
    ],
    "trap": "Ask which claim is being made: sample fit, prediction or intervention. Strong evidence for one is not automatically evidence for the others.",
    "distractors": [
      "Incorrect. The proportion of training variation explained is not the proportion caused by these variables, and coefficient magnitude also depends on units.",
      "Incorrect. Held-out prediction can support generalization to comparable cases, but a noncausal proxy can predict well without being an effective intervention target.",
      "Correct. This separates descriptive fit, predictive validation and causal identification, preserving legitimate model uses without authorizing unsupported care changes.",
      "Incorrect. Observational models can provide useful descriptions and predictions; the unsupported step is equating either with a causal intervention effect."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.2, Multiple regression analysis"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Model validation",
        "url": "https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm",
        "locator": "4.4.4; residual analysis and limits of training fit"
      },
      {
        "title": "scikit-learn: Common pitfalls and recommended practices",
        "url": "https://scikit-learn.org/stable/common_pitfalls.html",
        "locator": "Data leakage; fit selection/preprocessing using training partitions only"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "The selected standardized residuals below come from an OLS yield model; they are an excerpt, not all fitted observations. The full residual diagnostic shows increasing spread at higher fitted yields without a clear mean trend. Conventional standard errors assume constant error variance. Which concern and response are most appropriate?",
    "options": [
      "Investigate heteroscedasticity; check the mean model and use justified variance modeling or robust inference rather than trusting the conventional standard errors.",
      "Diagnose curvature from the changing spread alone and add a quadratic term, leaving the original standard-error formula unchanged.",
      "Treat heteroscedasticity as proof that every OLS coefficient is biased and replace the model without examining its assumptions.",
      "Keep the conventional confidence and prediction intervals because heteroscedasticity affects only the visual appearance of residual plots."
    ],
    "answer": 0,
    "why": "Changing residual spread suggests nonconstant conditional error variance. Conventional homoscedastic standard errors and prediction intervals may be wrong. With a correctly specified conditional mean and exogeneity, OLS coefficients can remain unbiased; the plot alone does not establish those conditions. Heteroscedasticity-consistent covariance can address coefficient inference under its assumptions, but does not by itself model observation-level predictive spread. Consider a justified variance model, transformation or weighted fit and validate the result. Source alignment: ASQ CMBB Body of Knowledge, VI.B.2, Multiple regression analysis. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "chart": {
      "type": "regression-diagnostic",
      "title": "Selected standardized residuals versus fitted yield",
      "altText": "Nine selected residuals from the full-model diagnostic. These are not the complete fitted sample.",
      "panels": [
        {
          "title": "Residual diagnostic excerpt",
          "xs": [
            10,
            15,
            20,
            25,
            30,
            35,
            40,
            45,
            50
          ],
          "series": [
            {
              "name": "Standardized residual",
              "values": [
                0.2,
                -0.3,
                0.8,
                -1.1,
                1.6,
                -2,
                2.8,
                -3.2,
                3.9
              ],
              "connect": false
            }
          ],
          "range": [
            8,
            52,
            -5,
            5
          ],
          "xLabel": "Fitted yield (%)",
          "yLabel": "Residual (unitless)",
          "refs": [
            {
              "y": 0,
              "label": "Zero"
            }
          ]
        }
      ],
      "evidence": {
        "type": "data-table",
        "title": "Residual excerpt: exact plotted values",
        "columns": [
          "Fitted yield (%)",
          "Standardized residual"
        ],
        "rows": [
          [
            10,
            0.2
          ],
          [
            15,
            -0.3
          ],
          [
            20,
            0.8
          ],
          [
            25,
            -1.1
          ],
          [
            30,
            1.6
          ],
          [
            35,
            -2
          ],
          [
            40,
            2.8
          ],
          [
            45,
            -3.2
          ],
          [
            50,
            3.9
          ]
        ],
        "altText": "Numerical alternative to the residual excerpt."
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-017",
    "optionRationales": [
      "Correct. It targets the variance concern without assuming biased coefficients, a unique cause, or that robust coefficient errors alone fix predictive intervals.",
      "Incorrect. Spread and mean structure are different diagnostics; a funnel does not by itself establish a missing quadratic mean term.",
      "Incorrect. Nonconstant variance alone does not prove coefficient bias when the conditional mean and exogeneity assumptions hold.",
      "Incorrect. Constant-variance interval formulas depend on the assumption under challenge; an unchanged mean fit does not preserve interval validity."
    ],
    "trap": "Robust standard errors concern coefficient uncertainty. Individual prediction intervals still need a defensible model for prediction error at the relevant predictor values.",
    "distractors": [
      "Correct. It targets the variance concern without assuming biased coefficients, a unique cause, or that robust coefficient errors alone fix predictive intervals.",
      "Incorrect. Spread and mean structure are different diagnostics; a funnel does not by itself establish a missing quadratic mean term.",
      "Incorrect. Nonconstant variance alone does not prove coefficient bias when the conditional mean and exogeneity assumptions hold.",
      "Incorrect. Constant-variance interval formulas depend on the assumption under challenge; an unchanged mean fit does not preserve interval validity."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.2, Multiple regression analysis"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Model validation",
        "url": "https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm",
        "locator": "4.4.4; residual analysis and limits of training fit"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A predictive-maintenance OLS model with an intercept includes machine age, operating hours and ambient temperature. Age and hours have unstable coefficient signs across model specifications; their VIFs are shown below. The objective is reliable prediction, not estimating an intervention effect. What should the MBB recommend?",
    "options": [
      "Delete both age and hours because a VIF above 10 establishes that neither variable contains useful predictive information.",
      "Review shared information and coefficient uncertainty; evaluate justified simplification or regularization using held-out prediction rather than a mechanical VIF cutoff.",
      "Interpret both coefficient signs as stable independent physical effects because VIF measures only correlation with the response.",
      "Center age and hours and accept the model, since centering removes their linear dependence and reduces these VIFs to one."
    ],
    "answer": 1,
    "why": "VIF measures inflation of coefficient variance due to linear dependence among predictors, not dependence on the response. The values 14.2 and 13.8 warn that separate age/hour coefficients are imprecise. They do not identify a physical cause of sign changes or prove poor predictions. For age, the auxiliary R² is 1 - 1/14.2 = 0.92958; the corresponding standard-error multiplier is sqrt(14.2), not 14.2. Compare defensible models and predictions; centering cannot remove ordinary age/hour collinearity. Source alignment: ASQ CMBB Body of Knowledge, VI.B.2, Multiple regression analysis. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "chart": {
      "type": "data-table",
      "columns": [
        "Predictor",
        "VIF"
      ],
      "rows": [
        [
          "Machine age (years)",
          "14.2"
        ],
        [
          "Operating hours",
          "13.8"
        ],
        [
          "Ambient temperature",
          "1.3"
        ]
      ],
      "title": "Predictor variance inflation factors",
      "altText": "Reported conventional VIF values for the three predictors. These quantify predictor dependence, not response association."
    },
    "set": 3,
    "qid": "mbb:set-3:d6-018",
    "optionRationales": [
      "Incorrect. Correlated predictors may still jointly predict well; their individual coefficients can be unstable without the variables being useless.",
      "Correct. It uses the VIF warning to guide diagnosis and model comparison while keeping the stated predictive objective central.",
      "Incorrect. VIF is based on regressing a predictor on the other predictors; it warns against treating unstable partial slopes as established mechanisms.",
      "Incorrect. Subtracting constants does not eliminate ordinary linear dependence between age and operating hours in an intercept-containing model."
    ],
    "trap": "VIF is a variance multiplier; its square root is the standard-error multiplier under the usual comparison. Thresholds are screening guides, not universal deletion rules.",
    "distractors": [
      "Incorrect. Correlated predictors may still jointly predict well; their individual coefficients can be unstable without the variables being useless.",
      "Correct. It uses the VIF warning to guide diagnosis and model comparison while keeping the stated predictive objective central.",
      "Incorrect. VIF is based on regressing a predictor on the other predictors; it warns against treating unstable partial slopes as established mechanisms.",
      "Incorrect. Subtracting constants does not eliminate ordinary linear dependence between age and operating hours in an intercept-containing model."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.2, Multiple regression analysis"
      },
      {
        "title": "Minitab: Coefficients table for Fit Regression Model",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/regression/how-to/fit-regression-model/interpret-the-results/all-statistics-and-graphs/coefficients-table/",
        "locator": "Variance inflation factors and coefficient uncertainty"
      },
      {
        "title": "scikit-learn: Common pitfalls and recommended practices",
        "url": "https://scikit-learn.org/stable/common_pitfalls.html",
        "locator": "Data leakage; fit selection/preprocessing using training partitions only"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A binary logistic model uses failure as the event and a single indicator: long maintenance interval = 1, short interval = 0. The table contains all 200 observations, with no other predictors. The reported odds ratio is 2.3, rounded to one decimal. Which interpretation and probability comparison agree with these data?",
    "options": [
      "Long versus short has about 2.35 times the failure odds; observed risks are 34% versus 18%.",
      "Long versus short has about 2.35 times the failure probability; therefore the long-interval failure probability is approximately 42.2%.",
      "Changing the interval indicator from zero to one increases failure probability by 2.3 percentage points, from 18% to approximately 20.3%.",
      "Long versus short has about 0.43 times the failure odds because the event odds are calculated as nonfailures divided by failures."
    ],
    "answer": 0,
    "why": "The short-interval failure odds are 18/82 and the long-interval odds are 34/66. Their ratio is (34 × 82)/(66 × 18) = 2.34680, which rounds to 2.3 at one decimal. The observed risk ratio is 0.34/0.18 = 1.88889 and the risk difference is 16 percentage points. The one-unit change is the stated indicator contrast, not an unspecified number of days. This is an unadjusted association; these data alone do not establish the causal effect of changing maintenance intervals. Source alignment: ASQ CMBB Body of Knowledge, VI.B.3, Logistic regression analysis. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "chart": {
      "type": "data-table",
      "columns": [
        "Interval / model indicator",
        "Failures",
        "No failures"
      ],
      "rows": [
        [
          "Short / 0",
          18,
          82
        ],
        [
          "Long / 1",
          34,
          66
        ]
      ],
      "title": "Failure counts by interval indicator",
      "altText": "Long indicator 1 versus short indicator 0; failures are the modeled event. Both groups contain 100 observations."
    },
    "set": 3,
    "qid": "mbb:set-3:d6-019",
    "optionRationales": [
      "Correct. It uses failure odds in the specified comparison direction and distinguishes odds, risk ratio and the observed group probabilities.",
      "Incorrect. Multiplying 18% directly by an odds ratio confuses odds with probability; the table gives a long-interval risk of 34%.",
      "Incorrect. An odds ratio is multiplicative on odds, not an additive percentage-point change in failure probability.",
      "Incorrect. Nonfailures/failures are the odds of the opposite event. Reversing the event or comparison direction inverts the requested ratio."
    ],
    "trap": "Name the event, reference group and predictor increment before interpreting an odds ratio. Adjusted model odds ratios need not equal crude table odds ratios.",
    "distractors": [
      "Correct. It uses failure odds in the specified comparison direction and distinguishes odds, risk ratio and the observed group probabilities.",
      "Incorrect. Multiplying 18% directly by an odds ratio confuses odds with probability; the table gives a long-interval risk of 34%.",
      "Incorrect. An odds ratio is multiplicative on odds, not an additive percentage-point change in failure probability.",
      "Incorrect. Nonfailures/failures are the odds of the opposite event. Reversing the event or comparison direction inverts the requested ratio."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.3, Logistic regression analysis"
      },
      {
        "title": "Minitab: Methods and formulas for the estimated binary logistic equation",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/regression/how-to/fit-binary-logistic-model/methods-and-formulas/estimated-equation/",
        "locator": "Logit equation and odds ratios"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A model fitted to 18 months of production data has training R² = 0.94 but fails the agreed prediction-error target in the next three months. Those three months were not used in fitting, although the team has now inspected their errors. What is the strongest validation response before redeployment?",
    "options": [
      "Randomly mix all 21 months into folds so every validation fold contains future and past records, then report the best score.",
      "Tune repeatedly on the three new months and call their final improved score an independent estimate of future performance.",
      "Attribute the failure solely to overfitting and add interaction terms until the original training R² increases further.",
      "Investigate drift, leakage and model complexity; use time-respecting development validation and reserve fresh data for final evaluation after revision."
    ],
    "answer": 3,
    "why": "Poor future performance can reflect overfitting, changing operating conditions, measurement changes, leakage or a mismatch between training and deployment. The pattern alone does not identify one cause. The three months began as a genuine test but become development evidence once used to select revisions. Use chronological or rolling-origin validation appropriate to the forecast horizon, fit preprocessing within each training split, and seek a fresh final evaluation before making renewed performance claims. Source alignment: ASQ CMBB Body of Knowledge, VI.B.2, Multiple regression analysis. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-020",
    "optionRationales": [
      "Incorrect. For prospective time-dependent prediction, mixing future and past can leak information and understate deployment error.",
      "Incorrect. Once outcomes guide model selection, performance on those same records is no longer an independent final test.",
      "Incorrect. More terms can worsen overfitting and do not address drift, leakage or changed measurement processes.",
      "Correct. It addresses competing explanations and protects final evaluation from reuse of the already inspected holdout."
    ],
    "trap": "A holdout is independent of the decisions that created the model. Once it guides revisions, reserve new evidence for the final deployment claim.",
    "distractors": [
      "Incorrect. For prospective time-dependent prediction, mixing future and past can leak information and understate deployment error.",
      "Incorrect. Once outcomes guide model selection, performance on those same records is no longer an independent final test.",
      "Incorrect. More terms can worsen overfitting and do not address drift, leakage or changed measurement processes.",
      "Correct. It addresses competing explanations and protects final evaluation from reuse of the already inspected holdout."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.2, Multiple regression analysis"
      },
      {
        "title": "scikit-learn: Common pitfalls and recommended practices",
        "url": "https://scikit-learn.org/stable/common_pitfalls.html",
        "locator": "Data leakage; fit selection/preprocessing using training partitions only"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Model validation",
        "url": "https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm",
        "locator": "4.4.4; residual analysis and limits of training fit"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "Within the safe coded region −1 ≤ x₁, x₂ ≤ 1, a fitted response surface is ŷ = 80 − 2x₁² − 5x₂² (yield %). Its stationary point is (0,0). The team calls it the proven best operating point for the physical process. Which assessment correctly classifies the fitted point and limits that claim?",
    "options": [
      "The fitted stationary point is a maximum: Hessian eigenvalues are −4 and −10. Check model adequacy and confirm the candidate before treating it as a process optimum.",
      "The fitted stationary point is a minimum because concentric ellipses indicate the response increases toward their center.",
      "The fitted stationary point is a saddle because unequal quadratic coefficients imply that one direction must rise while the other falls.",
      "The fitted maximum proves a global physical optimum outside the studied region as well, so confirmation runs would add no useful information."
    ],
    "answer": 0,
    "why": "The gradient is (−4x₁, −10x₂), zero at the origin. The Hessian is diagonal with eigenvalues −4 and −10, so the fitted quadratic has a strict maximum there, with predicted yield 80%. Both directions curve downward. Unequal curvature does not imply a saddle. The algebra classifies the fitted model, not the unknown physical response outside its support; model adequacy, uncertainty and confirmation at feasible settings still matter. Source alignment: ASQ CMBB Body of Knowledge, VI.C.3, DOE approaches. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-021",
    "optionRationales": [
      "Correct. Negative Hessian eigenvalues classify the model maximum while confirmation and adequacy checks limit the physical-process claim.",
      "Incorrect. The supplied negative squared terms decrease yield away from the origin; the coefficients, not ellipse shape alone, determine the direction.",
      "Incorrect. A saddle requires opposing curvature signs; both eigenvalues here are negative despite their different magnitudes.",
      "Incorrect. A fitted optimum is conditional on model adequacy and the studied region, not proof of a global physical optimum."
    ],
    "trap": "An unlabeled ellipse alone does not distinguish maximum from minimum. Check contour values or curvature signs, then separate model classification from process validation.",
    "distractors": [
      "Correct. Negative Hessian eigenvalues classify the model maximum while confirmation and adequacy checks limit the physical-process claim.",
      "Incorrect. The supplied negative squared terms decrease yield away from the origin; the coefficients, not ellipse shape alone, determine the direction.",
      "Incorrect. A saddle requires opposing curvature signs; both eigenvalues here are negative despite their different magnitudes.",
      "Incorrect. A fitted optimum is conditional on model adequacy and the studied region, not proof of a global physical optimum."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C.3, DOE approaches"
      },
      {
        "title": "NIST: Optimization when there is adequate quadratic fit",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section5/pri5514.htm",
        "locator": "5.5.5.1.4; stationary point, eigenvalues, confirmation"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A team fits a logistic churn model with an intercept and 40 candidate one-degree-of-freedom predictors to 85 independent customers, only 12 of whom churned. It selects predictors on all 85 outcomes before cross-validation. What should the MBB challenge before accepting the prediction claims?",
    "options": [
      "The ratio of observations to predictors exceeds two, so the model has enough information regardless of the number of churn events.",
      "Address sparse events and complexity; perform selection inside validation folds, evaluate shrinkage, and seek representative outcome data.",
      "Cross-validation corrects selection bias automatically even when all outcome-based feature selection was performed before the folds were created.",
      "A significant global likelihood-ratio test would establish calibrated future probabilities and remove the need to validate the selected model."
    ],
    "answer": 1,
    "why": "There are 41 candidate coefficients including the intercept and only 12 events. This raises serious instability, separation and overfitting concerns, but no universal observations-per-predictor rule proves a model valid or invalid. Selecting on all outcomes leaks validation information. Model development, including preprocessing, selection and tuning, must be repeated within the appropriate resampling structure; separate outer evaluation is needed for tuning comparisons. Regularization can help but does not replace representative event information or calibration assessment. Source alignment: ASQ CMBB Body of Knowledge, VI.B.3, Logistic regression analysis. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-022",
    "optionRationales": [
      "Incorrect. The outcome event count and effective model complexity matter; 85/40 alone cannot establish adequate logistic-model information.",
      "Correct. It addresses both limited information and leakage, while treating regularization and new data as tools rather than guarantees.",
      "Incorrect. Validation outcomes have already influenced the chosen predictors, making the subsequent score optimistically biased.",
      "Incorrect. A global association test does not establish future discrimination, calibration or generalization after model selection."
    ],
    "trap": "For a binary outcome, check events and nonevents as well as total sample size. Cross-validation must include the entire modeling process, not only the last fit.",
    "distractors": [
      "Incorrect. The outcome event count and effective model complexity matter; 85/40 alone cannot establish adequate logistic-model information.",
      "Correct. It addresses both limited information and leakage, while treating regularization and new data as tools rather than guarantees.",
      "Incorrect. Validation outcomes have already influenced the chosen predictors, making the subsequent score optimistically biased.",
      "Incorrect. A global association test does not establish future discrimination, calibration or generalization after model selection."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.3, Logistic regression analysis"
      },
      {
        "title": "scikit-learn: Common pitfalls and recommended practices",
        "url": "https://scikit-learn.org/stable/common_pitfalls.html",
        "locator": "Data leakage; fit selection/preprocessing using training partitions only"
      },
      {
        "title": "Minitab: Methods and formulas for the estimated binary logistic equation",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/regression/how-to/fit-binary-logistic-model/methods-and-formulas/estimated-equation/",
        "locator": "Logit equation and odds ratios"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "For a full-rank, intercept-containing OLS model, the report labels 0.60 as the conventional centered VIF for one predictor. Its metadata define VIF = 1/(1 − Rⱼ²), where Rⱼ² comes from regressing that predictor on the others. What is the best audit response?",
    "options": [
      "Accept 0.60 as evidence that correlation with the other predictors reduces the coefficient variance by 40%.",
      "Interpret 0.60 as an auxiliary R² and report a VIF of 2.50 without checking the field definition.",
      "Round 0.60 up to one because small VIF reporting discrepancies cannot affect conclusions about individual coefficients.",
      "Flag the label or calculation; centered VIF cannot be below one. If 0.60 is tolerance instead, the corresponding VIF is 1.67."
    ],
    "answer": 3,
    "why": "Under the stated conventional definition, 0 ≤ Rⱼ² < 1 and VIF ≥ 1. A VIF of 0.60 would require Rⱼ² = 1 − 1/0.60 = −0.6667, inconsistent with that centered auxiliary regression. Tolerance is 1 − Rⱼ²; if the field is actually tolerance 0.60, VIF = 1/0.60 = 1.6667 and Rⱼ² = 0.40. Verify metadata rather than silently relabeling. The qualification matters because other diagnostics and conventions should not be conflated with this VIF. Source alignment: ASQ CMBB Body of Knowledge, VI.B.2, Multiple regression analysis. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-023",
    "optionRationales": [
      "Incorrect. The stated VIF measures inflation relative to an orthogonal-predictor comparison and has a lower bound of one.",
      "Incorrect. That conversion assumes a different reported quantity; the metadata must be checked before assigning an auxiliary R².",
      "Incorrect. Rounding does not repair a definition or reporting error and may hide the actual quantity being reported.",
      "Correct. It applies the stated mathematical bound and identifies a plausible tolerance-label error without assuming it is proven."
    ],
    "trap": "State the diagnostic convention before asserting a bound. Tolerance is the reciprocal of conventional VIF, not the same statistic.",
    "distractors": [
      "Incorrect. The stated VIF measures inflation relative to an orthogonal-predictor comparison and has a lower bound of one.",
      "Incorrect. That conversion assumes a different reported quantity; the metadata must be checked before assigning an auxiliary R².",
      "Incorrect. Rounding does not repair a definition or reporting error and may hide the actual quantity being reported.",
      "Correct. It applies the stated mathematical bound and identifies a plausible tolerance-label error without assuming it is proven."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.2, Multiple regression analysis"
      },
      {
        "title": "Minitab: Coefficients table for Fit Regression Model",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/regression/how-to/fit-regression-model/interpret-the-results/all-statistics-and-graphs/coefficients-table/",
        "locator": "Variance inflation factors and coefficient uncertainty"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "An illustrative daily call-volume OLS model has an intercept, one prespecified nonlagged predictor and 14 consecutive observations. The table provides observed calls, fitted values and residuals in time order; the predictor is assumed exogenous. The reported Durbin–Watson statistic is 0.45. What conclusion is justified before reporting uncertainty for future calls?",
    "options": [
      "The rising raw call-volume series proves positive error autocorrelation, so the residuals and the fitted mean model need no review.",
      "The residual statistic suggests positive dependence; review time structure, uncertainty methods and applicable formal-test bounds.",
      "The statistic is the exact lag-one residual correlation, so adjacent residuals have correlation 0.45 and conventional intervals remain valid.",
      "Any Durbin–Watson value below two proves biased OLS coefficients and uniquely identifies ARIMA(1,1,1) as the required replacement model."
    ],
    "answer": 1,
    "why": "Durbin–Watson is the sum of squared adjacent residual differences divided by the residual sum of squares; the supplied illustrative residuals give approximately 0.45. Small successive changes relative to residual magnitude suggest positive serial dependence. The approximation d ≈ 2(1 − r₁) is not an exact identity here. A formal test needs its applicable assumptions and critical bounds. Raw outcome trend is not residual dependence. With exogeneity OLS coefficients need not be biased solely by correlated errors, but conventional uncertainty and predictive-error modeling require review; no unique ARIMA order follows. Source alignment: ASQ CMBB Body of Knowledge, VI.B.1, Autocorrelation and forecasting. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "chart": {
      "type": "time-series",
      "title": "Daily calls and illustrative model residuals",
      "altText": "Top: all 14 original call counts. Bottom: added illustrative OLS residuals, not raw-call deviations. The fit is constructed for a reproducible diagnostic example, not an empirical case study.",
      "rawCalls": [
        210,
        225,
        240,
        255,
        248,
        260,
        275,
        268,
        280,
        295,
        288,
        300,
        315,
        308
      ],
      "fittedValues": [
        218.3287065927862,
        229.25007722528755,
        238.20719779074818,
        248.25419220992742,
        239.73799709008458,
        254.13442767692146,
        273.9804407283976,
        271.8268190226318,
        286.5589082239198,
        301.3193188857601,
        291.6299845346419,
        299.8501181850965,
        311.4432586755537,
        302.47855315824324
      ],
      "residuals": [
        -8.328706592786201,
        -4.250077225287544,
        1.792802209251819,
        6.745807790072581,
        8.262002909915417,
        5.865572323078529,
        1.0195592716024073,
        -3.8268190226318244,
        -6.558908223919766,
        -6.319318885760101,
        -3.6299845346418924,
        0.14988181490349237,
        3.556741324446296,
        5.52144684175678
      ],
      "panels": [
        {
          "title": "Observed daily call volume",
          "xs": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14
          ],
          "series": [
            {
              "name": "Observed calls",
              "values": [
                210,
                225,
                240,
                255,
                248,
                260,
                275,
                268,
                280,
                295,
                288,
                300,
                315,
                308
              ]
            }
          ],
          "range": [
            1,
            14,
            200,
            330
          ],
          "xLabel": "Day",
          "yLabel": "Calls",
          "refs": []
        },
        {
          "title": "Residuals in time order",
          "xs": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14
          ],
          "series": [
            {
              "name": "Model residual",
              "values": [
                -8.328706592786201,
                -4.250077225287544,
                1.792802209251819,
                6.745807790072581,
                8.262002909915417,
                5.865572323078529,
                1.0195592716024073,
                -3.8268190226318244,
                -6.558908223919766,
                -6.319318885760101,
                -3.6299845346418924,
                0.14988181490349237,
                3.556741324446296,
                5.52144684175678
              ]
            }
          ],
          "range": [
            1,
            14,
            -10,
            10
          ],
          "xLabel": "Day",
          "yLabel": "Residual (calls)",
          "refs": [
            {
              "y": 0,
              "label": "Zero"
            }
          ]
        }
      ],
      "evidence": {
        "type": "data-table",
        "title": "Daily model data (display rounded to 6 decimals)",
        "columns": [
          "Day",
          "Observed calls",
          "Fitted calls",
          "Residual (calls)"
        ],
        "rows": [
          [
            1,
            210,
            218.328707,
            -8.328707
          ],
          [
            2,
            225,
            229.250077,
            -4.250077
          ],
          [
            3,
            240,
            238.207198,
            1.792802
          ],
          [
            4,
            255,
            248.254192,
            6.745808
          ],
          [
            5,
            248,
            239.737997,
            8.262003
          ],
          [
            6,
            260,
            254.134428,
            5.865572
          ],
          [
            7,
            275,
            273.980441,
            1.019559
          ],
          [
            8,
            268,
            271.826819,
            -3.826819
          ],
          [
            9,
            280,
            286.558908,
            -6.558908
          ],
          [
            10,
            295,
            301.319319,
            -6.319319
          ],
          [
            11,
            288,
            291.629985,
            -3.629985
          ],
          [
            12,
            300,
            299.850118,
            0.149882
          ],
          [
            13,
            315,
            311.443259,
            3.556741
          ],
          [
            14,
            308,
            302.478553,
            5.521447
          ]
        ],
        "altText": "All observations, fitted values and residuals."
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-024",
    "optionRationales": [
      "Incorrect. A changing conditional mean can produce raw-series trend without serially correlated errors; the relevant diagnostic uses residuals.",
      "Correct. It distinguishes the diagnostic warning from a fully specified test and model choice, without claiming inevitable coefficient bias.",
      "Incorrect. Durbin–Watson is a ratio of quadratic forms, not the lag-one correlation coefficient itself.",
      "Incorrect. Neither universal coefficient bias nor a particular time-series model order follows from this one statistic."
    ],
    "trap": "Use meaningful time order and residuals, not raw outcomes, for an error-dependence diagnostic. Do not obtain a p-value or ARIMA order from d alone.",
    "distractors": [
      "Incorrect. A changing conditional mean can produce raw-series trend without serially correlated errors; the relevant diagnostic uses residuals.",
      "Correct. It distinguishes the diagnostic warning from a fully specified test and model choice, without claiming inevitable coefficient bias.",
      "Incorrect. Durbin–Watson is a ratio of quadratic forms, not the lag-one correlation coefficient itself.",
      "Incorrect. Neither universal coefficient bias nor a particular time-series model order follows from this one statistic."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.1, Autocorrelation and forecasting"
      },
      {
        "title": "Minitab: Test for autocorrelation using Durbin–Watson",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/regression/supporting-topics/model-assumptions/test-for-autocorrelation-by-using-the-durbin-watson-statistic/",
        "locator": "Time ordering, statistic and critical-bound assumptions"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Model validation",
        "url": "https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm",
        "locator": "4.4.4; residual analysis and limits of training fit"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "Using the same complete-case sample, project duration and complexity each have a significant simple-regression slope for cost overrun. In the combined OLS model neither partial slope is significant at the preselected 5% level; the predictors are strongly correlated. What is the best next interpretation and check?",
    "options": [
      "The two nonsignificant partial tests establish that both predictors are unrelated to overrun and should be removed together.",
      "The change in significance establishes a nonlinear relationship, so a quadratic model is justified without examining shared predictor information.",
      "Inspect shared predictor information, VIFs, joint evidence and intervals before concluding that these predictors lack useful association.",
      "Select whichever simple regression has the smaller p-value and interpret its slope as the independent causal effect of that predictor."
    ],
    "answer": 2,
    "why": "Simple slopes and partial slopes answer different questions. Correlated predictors can share information about the response, leaving large uncertainty in their separate conditional slopes. Neither partial p-value proves absence of association or lack of joint predictive value. Check design, VIFs, joint tests, intervals and intended use. The same-sample condition removes one alternative explanation, but sign or significance changes alone would not uniquely diagnose collinearity. Selection by the smaller simple-model p-value also does not identify a causal effect. Source alignment: ASQ CMBB Body of Knowledge, VI.B.2, Multiple regression analysis. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-025",
    "optionRationales": [
      "Incorrect. Nonsignificant partial slopes do not establish zero association or lack of joint value, especially with shared predictor information.",
      "Incorrect. A significance change does not establish curvature; diagnostic evidence and model comparisons are needed for that claim.",
      "Correct. It distinguishes marginal and conditional questions and evaluates shared information rather than interpreting p-values as relevance labels.",
      "Incorrect. A selected marginal slope is neither an independently adjusted effect nor a demonstrated causal effect."
    ],
    "trap": "A marginal association and a partial slope are different estimands. Compare models on the same records and inspect joint uncertainty, not only significance labels.",
    "distractors": [
      "Incorrect. Nonsignificant partial slopes do not establish zero association or lack of joint value, especially with shared predictor information.",
      "Incorrect. A significance change does not establish curvature; diagnostic evidence and model comparisons are needed for that claim.",
      "Correct. It distinguishes marginal and conditional questions and evaluates shared information rather than interpreting p-values as relevance labels.",
      "Incorrect. A selected marginal slope is neither an independently adjusted effect nor a demonstrated causal effect."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.2, Multiple regression analysis"
      },
      {
        "title": "Minitab: Coefficients table for Fit Regression Model",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/regression/how-to/fit-regression-model/interpret-the-results/all-statistics-and-graphs/coefficients-table/",
        "locator": "Variance inflation factors and coefficient uncertainty"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Model validation",
        "url": "https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm",
        "locator": "4.4.4; residual analysis and limits of training fit"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "For the same continuous manufacturing response and training sample, a simple model has R² = 0.71 and a model with 12 polynomial/interaction terms has R² = 0.93. Both will be considered for prediction inside the operating region, but neither has yet passed an independent error target. What should govern the choice?",
    "options": [
      "Choose the complex model because increasing training R² establishes that its added terms improve future prediction by the same amount.",
      "Compare appropriate held-out error, calibration of uncertainty and practical adequacy; prefer less complexity when performance is sufficiently comparable for the stated use.",
      "Choose the simple model because interpretability always overrides a validated, operationally important gain in predictive accuracy.",
      "Choose the complex model when its adjusted R² is larger, treating that internal statistic as a substitute for external validation."
    ],
    "answer": 1,
    "why": "Added terms can improve training fit without improving deployment performance. Compare models using evaluation data and splitting rules suited to the intended use, with transformations and tuning learned only from training records. Assess error, residual structure, uncertainty, extrapolation risk, cost and interpretability. Parsimony is valuable when simpler performance is adequate or comparable; it is not a rule to reject demonstrated useful complexity. Adjusted R² penalizes parameter count internally but does not replace independent evaluation. Source alignment: ASQ CMBB Body of Knowledge, VI.B.2, Multiple regression analysis. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-026",
    "optionRationales": [
      "Incorrect. Training improvement may reflect noise fitting and does not establish a matching improvement on new observations.",
      "Correct. It bases the choice on validated operational performance and uses simplicity as a consideration rather than an absolute rule.",
      "Incorrect. A simpler model can be inadequate; interpretation benefits should be weighed against a demonstrated material predictive gain.",
      "Incorrect. Adjusted R² is still computed from the development data and cannot substitute for validation of the selected model."
    ],
    "trap": "Avoid both shortcuts: always choosing the highest R² and always choosing the simplest model. The decision depends on validated fitness for the actual use.",
    "distractors": [
      "Incorrect. Training improvement may reflect noise fitting and does not establish a matching improvement on new observations.",
      "Correct. It bases the choice on validated operational performance and uses simplicity as a consideration rather than an absolute rule.",
      "Incorrect. A simpler model can be inadequate; interpretation benefits should be weighed against a demonstrated material predictive gain.",
      "Incorrect. Adjusted R² is still computed from the development data and cannot substitute for validation of the selected model."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.2, Multiple regression analysis"
      },
      {
        "title": "scikit-learn: Common pitfalls and recommended practices",
        "url": "https://scikit-learn.org/stable/common_pitfalls.html",
        "locator": "Data leakage; fit selection/preprocessing using training partitions only"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Model validation",
        "url": "https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm",
        "locator": "4.4.4; residual analysis and limits of training fit"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A prespecified adjusted regression slope for a supplier scheduling score is 0.02 days per score point, with two-sided p = 0.03 against a zero slope at α = 0.05. A feasible change is 50 points, inside the modeled range; the business threshold is 0.5 day. Treat the fitted relationship as linear over that range. Which interpretation is most defensible?",
    "options": [
      "The slope passes the stated test; the predicted 1.0-day contrast warrants evaluation of uncertainty, cost and causal feasibility.",
      "The slope is too small to matter operationally because 0.02 day per point is below the 0.5-day business threshold.",
      "The p-value establishes a 97% probability that changing the score will cause at least a one-day change in delivery delay.",
      "A p-value above 0.01 means the result fails the stated significance rule and should be ignored without calculating the feasible contrast."
    ],
    "answer": 0,
    "why": "At the specified 5% level, p = 0.03 rejects the zero-slope null for this prespecified test. Practical interpretation uses the feasible contrast: 50 × 0.02 = 1.0 day, not the per-point slope alone. That point prediction exceeds 0.5 day, but the coefficient p-value does not provide the uncertainty interval for this contrast, its probability of exceeding the threshold, or causal validity. A small numerical coefficient can be important across a large feasible predictor change; consider uncertainty and intervention costs before prioritizing. Source alignment: ASQ CMBB Body of Knowledge, VI.B.2, Multiple regression analysis. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-027",
    "optionRationales": [
      "Correct. It computes the relevant operational contrast and separates statistical detection, practical scale, uncertainty and causation.",
      "Incorrect. It compares a per-point slope with a threshold for the complete feasible change, a mismatch of scale.",
      "Incorrect. A p-value is not the probability that the causal claim is true or that an effect exceeds a practical threshold.",
      "Incorrect. The stated α is 0.05, not 0.01; changing the criterion after seeing the result misapplies the decision rule."
    ],
    "trap": "Always identify the predictor unit and feasible change before calling an effect trivial. Statistical significance does not quantify intervention value or threshold-exceedance probability.",
    "distractors": [
      "Correct. It computes the relevant operational contrast and separates statistical detection, practical scale, uncertainty and causation.",
      "Incorrect. It compares a per-point slope with a threshold for the complete feasible change, a mismatch of scale.",
      "Incorrect. A p-value is not the probability that the causal claim is true or that an effect exceeds a practical threshold.",
      "Incorrect. The stated α is 0.05, not 0.01; changing the criterion after seeing the result misapplies the decision rule."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.B.2, Multiple regression analysis"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Model validation",
        "url": "https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm",
        "locator": "4.4.4; residual analysis and limits of training fit"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "In a balanced 2² experiment, the same bond-strength scale (MPa) and coded low/high spacing are used in both main-effects panels. Marginal means are A: 42 and 68 MPa; B: 54 and 56 MPa. Replication variability and the four cell means are not supplied. Which conclusion follows from this display alone?",
    "options": [
      "The estimated main effects are A = +26 MPa and B = +2 MPa; A has the larger marginal contrast, but significance and interaction are not determined.",
      "Factor A is statistically significant and B is not, because the difference between their plotted slopes supplies the experimental error estimate.",
      "Factor B can be dropped because a small marginal contrast establishes that it cannot interact with A.",
      "The two effects are +13 MPa and +1 MPa, because high-minus-low effects equal the coefficients under −1/+1 coding."
    ],
    "answer": 0,
    "why": "The high-minus-low marginal contrasts are 68 − 42 = 26 MPa and 56 − 54 = 2 MPa. With −1/+1 coding the corresponding regression coefficients in a balanced orthogonal parameterization are half those effects, 13 and 1. The equal panel scales make visual comparison meaningful. Marginal means alone do not supply an error estimate or determine the A×B interaction; a small average B effect can conceal substantial opposing simple effects. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "chart": {
      "type": "main-effects-plot",
      "title": "Bond strength: marginal means",
      "altText": "Equal response scales and coded level spacing. Replicate variability and joint cell means are not supplied.",
      "panels": [
        {
          "title": "Factor A",
          "xs": [
            -1,
            1
          ],
          "series": [
            {
              "name": "A marginal mean",
              "values": [
                42,
                68
              ]
            }
          ],
          "range": [
            -1,
            1,
            35,
            75
          ],
          "xLabel": "A coded level",
          "yLabel": "Strength (MPa)",
          "refs": [
            {
              "y": 55,
              "label": "Mean"
            }
          ]
        },
        {
          "title": "Factor B",
          "xs": [
            -1,
            1
          ],
          "series": [
            {
              "name": "B marginal mean",
              "values": [
                54,
                56
              ]
            }
          ],
          "range": [
            -1,
            1,
            35,
            75
          ],
          "xLabel": "B coded level",
          "yLabel": "Strength (MPa)",
          "refs": [
            {
              "y": 55,
              "label": "Mean"
            }
          ]
        }
      ],
      "evidence": {
        "type": "data-table",
        "title": "Main-effect marginal means",
        "columns": [
          "Factor",
          "Low (−1), MPa",
          "High (+1), MPa"
        ],
        "rows": [
          [
            "A",
            42,
            68
          ],
          [
            "B",
            54,
            56
          ]
        ],
        "altText": "Means share an overall mean of 55 MPa."
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-028",
    "optionRationales": [
      "Correct. It computes both contrasts and limits the conclusion to the descriptive main effects supported by the supplied means.",
      "Incorrect. The relative slopes do not estimate random error or provide a significance test without replication or other valid error information.",
      "Incorrect. A factor may have a small average effect and a substantial interaction whose conditional effects cancel when averaged.",
      "Incorrect. Thirteen and one are coded regression coefficients, not the high-minus-low factorial effects requested."
    ],
    "trap": "Check equal scales before comparing slopes. In standard −1/+1 coding, a factorial effect is twice its coefficient; neither size nor steepness alone supplies a p-value.",
    "distractors": [
      "Correct. It computes both contrasts and limits the conclusion to the descriptive main effects supported by the supplied means.",
      "Incorrect. The relative slopes do not estimate random error or provide a significance test without replication or other valid error information.",
      "Incorrect. A factor may have a small average effect and a substantial interaction whose conditional effects cancel when averaged.",
      "Incorrect. Thirteen and one are coded regression coefficients, not the high-minus-low factorial effects requested."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "Minitab: Interpret Main Effects Plot",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/anova/how-to/main-effects-plot/interpret-the-results/key-results/",
        "locator": "Marginal means versus statistical significance"
      },
      {
        "title": "Minitab: What is an interaction?",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/anova/supporting-topics/anova-models/what-is-an-interaction/",
        "locator": "Conditional effects; plot does not establish significance"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "The interaction plot shows four cell means from a balanced 2² molding experiment. When B is low, increasing A changes mean strength from 40 to 70 MPa; when B is high, it changes strength from 60 to 45 MPa. Replicate observations, an error estimate and uncertainty intervals are unavailable. What can the MBB conclude?",
    "options": [
      "The crossing lines prove a statistically significant A×B interaction at α = 0.05, even without information about experimental error.",
      "The average effect of A is +7.5 MPa, so A increases strength at both B settings and B need not be considered.",
      "The nonparallel lines show that the experiment violated randomization and that all four means must be discarded.",
      "The estimated A effect reverses from +30 to −15 MPa across B levels; assess interaction uncertainty before claiming significance or selecting settings."
    ],
    "answer": 3,
    "why": "The displayed simple effects of A are 70 − 40 = +30 MPa at low B and 45 − 60 = −15 MPa at high B. Their difference is −45 MPa. The standard A×B factorial effect is half that difference, −22.5 MPa, and the coded interaction coefficient is −11.25 MPa. These are descriptive estimates. Without a valid error estimate the plot cannot establish statistical significance. The average A effect (+7.5 MPa) conceals the reversal and is incomplete for selecting settings. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "chart": {
      "type": "interaction-plot",
      "title": "Molding strength: cell means by A and B",
      "altText": "Supplied illustrative cell means; no replicate error or significance estimate is shown.",
      "panels": [
        {
          "title": "Strength at the two B levels",
          "xs": [
            -1,
            1
          ],
          "series": [
            {
              "name": "B low",
              "values": [
                40,
                70
              ]
            },
            {
              "name": "B high",
              "values": [
                60,
                45
              ],
              "dashed": true
            }
          ],
          "range": [
            -1,
            1,
            30,
            80
          ],
          "xLabel": "A coded level",
          "yLabel": "Strength (MPa)",
          "refs": []
        }
      ],
      "legend": "Solid line: B low (−1). Dashed line: B high (+1).",
      "evidence": {
        "type": "data-table",
        "title": "Four cell means",
        "columns": [
          "B level",
          "A low (−1), MPa",
          "A high (+1), MPa"
        ],
        "rows": [
          [
            "Low (−1)",
            40,
            70
          ],
          [
            "High (+1)",
            60,
            45
          ]
        ],
        "altText": "Exact means used in the interaction plot."
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-029",
    "optionRationales": [
      "Incorrect. The shape depicts an estimated interaction; statistical significance requires uncertainty or an appropriate inferential model.",
      "Incorrect. An average contrast can hide a crossover: at high B the observed A effect is negative, not positive.",
      "Incorrect. Nonparallel response means do not diagnose run-order or randomization violations.",
      "Correct. It identifies the conditional reversal while reserving inferential and operating decisions until uncertainty is assessed."
    ],
    "trap": "Nonparallel lines do not equal statistically significant interaction. Keep the simple-effect difference, factorial interaction effect and coded coefficient distinct.",
    "distractors": [
      "Incorrect. The shape depicts an estimated interaction; statistical significance requires uncertainty or an appropriate inferential model.",
      "Incorrect. An average contrast can hide a crossover: at high B the observed A effect is negative, not positive.",
      "Incorrect. Nonparallel response means do not diagnose run-order or randomization violations.",
      "Correct. It identifies the conditional reversal while reserving inferential and operating decisions until uncertainty is assessed."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "Minitab: What is an interaction?",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/anova/supporting-topics/anova-models/what-is-an-interaction/",
        "locator": "Conditional effects; plot does not establish significance"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "Before running an experiment, a team proposes replacing an eight-run 2³ factorial with the four-run regular half-fraction C = AB, using −1/+1 coding. The goal is to screen main effects; there are no replicate runs or independent error estimate. Which trade-off must the MBB communicate?",
    "options": [
      "Main effects remain clear of all two-factor interactions; only three-factor interactions are sacrificed by halving the runs.",
      "All three main effects and all three two-factor interactions remain separately estimable because the four rows are orthogonal.",
      "The four distinct settings provide four residual degrees of freedom after fitting an intercept and three main effects.",
      "I = ABC aliases A with BC, B with AC and C with AB; the model is saturated."
    ],
    "answer": 3,
    "why": "Multiplying C = AB by C gives I = ABC, a resolution III defining relation. Multiplication by A, B and C yields the main-effect/two-factor aliases A = BC, B = AC and C = AB. Four observations fit four main-model coefficients including the intercept, leaving zero residual degrees of freedom. The design is useful for screening under justified sparsity assumptions, but it cannot separate those aliased effects or provide a conventional residual-error test by itself. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-030",
    "optionRationales": [
      "Incorrect. In this specific three-factor half-fraction, every main effect is aliased with a two-factor interaction, not only a higher-order term.",
      "Incorrect. Orthogonality between the four distinct design columns does not create separate columns for effects that are identical within the fraction.",
      "Incorrect. Residual degrees of freedom are observations minus fitted rank: 4 − 4 = 0 here.",
      "Correct. It gives the actual alias structure and the lack of residual error information rather than relying on a generic fractionation warning."
    ],
    "trap": "Write the defining relation for the proposed fraction. Run count alone does not establish resolution, and a saturated model provides no residual error degrees of freedom.",
    "distractors": [
      "Incorrect. In this specific three-factor half-fraction, every main effect is aliased with a two-factor interaction, not only a higher-order term.",
      "Incorrect. Orthogonality between the four distinct design columns does not create separate columns for effects that are identical within the fraction.",
      "Incorrect. Residual degrees of freedom are observations minus fitted rank: 4 − 4 = 0 here.",
      "Correct. It gives the actual alias structure and the lack of residual error information rather than relying on a generic fractionation warning."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "NIST: Fractional factorial specifications and resolution",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri3344.htm",
        "locator": "5.3.3.4.4; defining relations and resolution"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "An eight-run regular 2⁴⁻¹ design uses D = ABC, hence I = ABCD. Its D/ABC alias contrast is large. The team can add eight runs under comparable conditions and must distinguish D from ABC without assuming ABC negligible. Which interpretation and augmentation are valid?",
    "options": [
      "Attribute the contrast to D and repeat the original fraction; repetition separates D from ABC by reducing random error.",
      "Attribute the contrast to ABC because a main effect cannot contribute when it is aliased with a three-factor interaction.",
      "Reverse every factor sign in the original fraction; this necessarily creates the complementary I = −ABCD fraction.",
      "Add the D-only sign reversal, I = −ABCD; combined fractions separate D and ABC if stages remain comparable."
    ],
    "answer": 3,
    "why": "In the original fraction the D and ABC columns are identical, so their contributions cannot be separated. Reversing D alone gives the complementary half with I = −ABCD; together the two halves cover all 16 combinations. Reversing all four signs leaves the four-letter product ABCD unchanged, reproducing the same fraction instead. Repeating original settings can improve precision but not break this alias. Stage effects and changing conditions must be addressed when augmenting sequentially. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-031",
    "optionRationales": [
      "Incorrect. Replication reduces random uncertainty but preserves the identical D and ABC columns and cannot by itself identify their separate contributions.",
      "Incorrect. Both contributions, including cancellation or reinforcement, are possible; aliasing does not privilege the higher-order interaction.",
      "Incorrect. Reversing four signs multiplies ABCD by (+1), so an all-factor mirror foldover does not create the complementary fraction here.",
      "Correct. A D-only sign reversal changes the defining word's sign and supplies the missing combinations under the stated comparability condition."
    ],
    "trap": "A mirror-image foldover is not universally de-aliasing. For an even-length defining word, reversing every factor preserves its sign; verify the actual follow-up columns.",
    "distractors": [
      "Incorrect. Replication reduces random uncertainty but preserves the identical D and ABC columns and cannot by itself identify their separate contributions.",
      "Incorrect. Both contributions, including cancellation or reinforcement, are possible; aliasing does not privilege the higher-order interaction.",
      "Incorrect. Reversing four signs multiplies ABCD by (+1), so an all-factor mirror foldover does not create the complementary fraction here.",
      "Correct. A D-only sign reversal changes the defining word's sign and supplies the missing combinations under the stated comparability condition."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "NIST: Alternative foldover designs",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri3382.htm",
        "locator": "5.3.3.8.2; reversing selected factor columns"
      },
      {
        "title": "NIST: Fractional factorial specifications and resolution",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri3344.htm",
        "locator": "5.3.3.4.4; defining relations and resolution"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A seven-factor, eight-run regular screening design starts with independent A, B and C columns and assigns D = AB, E = AC, F = BC and G = ABC. The table lists each main effect's complete two-factor alias set (higher-order aliases are omitted). No replication or external error estimate is available. What is the key interpretation limit?",
    "options": [
      "The table's three interactions per row can be estimated individually because each row names a different main effect.",
      "Each apparent main effect combines the listed aliases; this saturated resolution III screen requires justified interaction assumptions and targeted follow-up before attribution.",
      "Eight observations give one residual degree of freedom after fitting seven main effects and an intercept, so ordinary t-tests are available.",
      "Assigning interactions as factor columns removes their influence from the process, making a main-effects-only physical interpretation valid."
    ],
    "answer": 1,
    "why": "The generator columns give A = BD = CE = FG, with analogous three-interaction sets for the other factors. These equalities describe identical design columns, not separately observed effects. Intercept plus seven main-effect columns has rank eight, leaving zero residual degrees of freedom. The design can screen efficiently under defensible sparsity assumptions, but large contrasts cannot be uniquely attributed without assumptions or additional runs. Follow-up should break the aliases important to the engineering decision. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "chart": {
      "type": "data-table",
      "title": "Complete two-factor alias sets for the stated generators",
      "columns": [
        "Main-effect column",
        "Identical two-factor columns"
      ],
      "rows": [
        [
          "A",
          "BD = CE = FG"
        ],
        [
          "B",
          "AD = CF = EG"
        ],
        [
          "C",
          "AE = BF = DG"
        ],
        [
          "D",
          "AB = CG = EF"
        ],
        [
          "E",
          "AC = BG = DF"
        ],
        [
          "F",
          "AG = BC = DE"
        ],
        [
          "G",
          "AF = BE = CD"
        ]
      ],
      "altText": "All seven main effects. Higher-order aliases are omitted; equality denotes identical columns, not estimated separate effects."
    },
    "set": 3,
    "qid": "mbb:set-3:d6-032",
    "optionRationales": [
      "Incorrect. Identical columns within an alias set cannot be separated by relabeling them; each apparent contrast can combine multiple effects.",
      "Correct. It states the actual resolution, saturation and need for assumptions or augmentation before physical attribution.",
      "Incorrect. Eight observations minus eight fitted independent columns leaves zero, not one, residual degree of freedom.",
      "Incorrect. A design assignment affects identifiability; it does not remove physical interactions from the process."
    ],
    "trap": "Do not trust an alias table without generators. Derive it from the actual design and keep unestimated interactions separate from claims that they do not exist.",
    "distractors": [
      "Incorrect. Identical columns within an alias set cannot be separated by relabeling them; each apparent contrast can combine multiple effects.",
      "Correct. It states the actual resolution, saturation and need for assumptions or augmentation before physical attribution.",
      "Incorrect. Eight observations minus eight fitted independent columns leaves zero, not one, residual degree of freedom.",
      "Incorrect. A design assignment affects identifiability; it does not remove physical interactions from the process."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "NIST: Fractional factorial specifications and resolution",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri3344.htm",
        "locator": "5.3.3.4.4; defining relations and resolution"
      },
      {
        "title": "NIST: Alternative foldover designs",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri3382.htm",
        "locator": "5.3.3.8.2; reversing selected factor columns"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A coating experiment samples only the ±1 corners of a two-factor factorial. The response may contain β₁₁x₁² + β₂₂x₂² as well as an interaction. The team proposes adding replicated center points at (0,0) and then estimating both pure quadratic terms separately. Which assessment is correct?",
    "options": [
      "Corner points identify both pure quadratic coefficients because x₁² and x₂² have opposite signs at opposite corners.",
      "Center points identify an aggregate pure-curvature contrast, not separate quadratic terms; augment with suitable additional settings.",
      "Replicated center points separately estimate every quadratic coefficient because each additional observation creates a new independent design column.",
      "A two-level factorial cannot estimate any second-order response feature, including x₁x₂, so its interaction estimates must be discarded."
    ],
    "answer": 1,
    "why": "At every ±1 corner, x₁² = x₂² = 1; both columns are identical to the intercept. At the center both become zero, but remain identical to each other across the augmented design. Center observations can identify an aggregate pure-curvature contrast, with replication providing pure-error information, but cannot identify the two separate quadratic coefficients. Opposing quadratic contributions can cancel in that contrast. Two-level designs can estimate interactions, which are second-order terms; an appropriate response-surface augmentation adds independent information about pure quadratics. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-033",
    "optionRationales": [
      "Incorrect. Squaring either +1 or −1 yields +1; the pure quadratic columns do not change sign at the corners.",
      "Correct. It distinguishes pure-curvature detection from identification of individual quadratic coefficients and calls for an appropriate augmentation.",
      "Incorrect. Repeating the same center setting adds precision/error information, not independent geometric directions for the quadratic terms.",
      "Incorrect. An estimable cross-product interaction is a second-order response feature; the limitation concerns individual pure quadratic terms."
    ],
    "trap": "Center points can reveal net pure curvature, not necessarily each quadratic term; cancellation can hide it. Replication and new design locations solve different problems.",
    "distractors": [
      "Incorrect. Squaring either +1 or −1 yields +1; the pure quadratic columns do not change sign at the corners.",
      "Correct. It distinguishes pure-curvature detection from identification of individual quadratic coefficients and calls for an appropriate augmentation.",
      "Incorrect. Repeating the same center setting adds precision/error information, not independent geometric directions for the quadratic terms.",
      "Incorrect. An estimable cross-product interaction is a second-order response feature; the limitation concerns individual pure quadratic terms."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "NIST: Response surface designs",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri336.htm",
        "locator": "5.3.3.6; pure-quadratic terms and center-point limitations"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "The complete cube shows fitted etch rates (nm/min) from an additive model over three coded factors A, B and C. These eight model predictions—not raw replicates—use the same scale. The values at (−,−,−) and (+,+,+) are 42 and 89. What does the full display establish, and what does it not establish?",
    "options": [
      "The positive main effects establish that (+,+,+) is the statistically confirmed global optimum outside the tested ranges.",
      "Fitted effects are +9, +16 and +22 nm/min; significance and physical additivity are not established by this display.",
      "The difference 89 − 42 is the main effect of each factor separately because it compares the lowest and highest corners.",
      "The connecting cube edges represent activity dependencies, so the corner values should be added to obtain the process completion time."
    ],
    "answer": 1,
    "why": "Compare matched cube edges: changing A adds 9, B adds 16 and C adds 22 nm/min; 9 + 16 + 22 = 47, matching 89 − 42. Under the explicitly fitted additive model the other corners are 51, 58, 67, 64, 73 and 80. The all-high corner is its best tested corner for maximizing rate, but an additive display is not evidence that interactions are absent in the physical process. Replication/error information and model validation are needed for inference and operating recommendations. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "chart": {
      "type": "doe-cube",
      "title": "Complete 2³ cube: fitted additive etch rate",
      "altText": "Eight additive-model predictions in nm/min. Cube edges join settings differing in one factor; they are not activity dependencies.",
      "vertices": [
        {
          "a": -1,
          "b": -1,
          "c": -1,
          "value": 42
        },
        {
          "a": 1,
          "b": -1,
          "c": -1,
          "value": 51
        },
        {
          "a": -1,
          "b": 1,
          "c": -1,
          "value": 58
        },
        {
          "a": 1,
          "b": 1,
          "c": -1,
          "value": 67
        },
        {
          "a": -1,
          "b": -1,
          "c": 1,
          "value": 64
        },
        {
          "a": 1,
          "b": -1,
          "c": 1,
          "value": 73
        },
        {
          "a": -1,
          "b": 1,
          "c": 1,
          "value": 80
        },
        {
          "a": 1,
          "b": 1,
          "c": 1,
          "value": 89
        }
      ],
      "evidence": {
        "type": "data-table",
        "title": "All eight fitted treatment combinations",
        "columns": [
          "A (coded)",
          "B (coded)",
          "C (coded)",
          "Etch rate (nm/min)"
        ],
        "rows": [
          [
            -1,
            -1,
            -1,
            42
          ],
          [
            1,
            -1,
            -1,
            51
          ],
          [
            -1,
            1,
            -1,
            58
          ],
          [
            1,
            1,
            -1,
            67
          ],
          [
            -1,
            -1,
            1,
            64
          ],
          [
            1,
            -1,
            1,
            73
          ],
          [
            -1,
            1,
            1,
            80
          ],
          [
            1,
            1,
            1,
            89
          ]
        ],
        "altText": "The four formerly absent corners are explicitly additive-model predictions."
      }
    },
    "set": 3,
    "qid": "mbb:set-3:d6-034",
    "optionRationales": [
      "Incorrect. The plot has no inferential uncertainty and does not justify extrapolation or prove a global physical optimum.",
      "Correct. It computes the three model contrasts while distinguishing model predictions from experimental proof of significance or additivity.",
      "Incorrect. The 47-unit diagonal contrast combines all three additive effects; it is not each individual main effect.",
      "Incorrect. This is a factorial-response cube, not a project network; the etch-rate values are not activity durations."
    ],
    "trap": "A genuine 2³ cube has eight combinations. A plot of an additive fit necessarily looks additive; it cannot independently validate the assumption used to draw it.",
    "distractors": [
      "Incorrect. The plot has no inferential uncertainty and does not justify extrapolation or prove a global physical optimum.",
      "Correct. It computes the three model contrasts while distinguishing model predictions from experimental proof of significance or additivity.",
      "Incorrect. The 47-unit diagonal contrast combines all three additive effects; it is not each individual main effect.",
      "Incorrect. This is a factorial-response cube, not a project network; the etch-rate values are not activity durations."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "Minitab: Interpret Main Effects Plot",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/anova/how-to/main-effects-plot/interpret-the-results/key-results/",
        "locator": "Marginal means versus statistical significance"
      },
      {
        "title": "NIST: Fractional factorial specifications and resolution",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri3344.htm",
        "locator": "5.3.3.4.4; defining relations and resolution"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A team can afford 16 runs to study five two-level factors. It wants main effects and all two-factor interactions, and engineering judgment supports treating interactions of order three and above as negligible for initial screening. No external error estimate is available. Which design and limitation best fit this purpose?",
    "options": [
      "Use a 16-run half-fraction with I = ABC; all five main effects and all two-factor interactions will then be clear of each other.",
      "Use one-factor-at-a-time trials across all five factors; they recover two-factor interactions without alias assumptions at lower cost.",
      "Use I = ABCDE and fit the full second-order factorial model; its 16 parameters leave 15 residual degrees of freedom.",
      "Use I = ABCDE, resolution V; the mutually clear main-plus-two-factor model has 16 parameters and no residual degrees of freedom."
    ],
    "answer": 3,
    "why": "The length-five defining word gives resolution V. A main effect is aliased with a four-factor interaction and a two-factor interaction with a three-factor interaction; the five main effects and ten two-factor interactions are mutually clear under the stated higher-order assumptions. Including the intercept gives 1 + 5 + 10 = 16 parameters for 16 observations, leaving zero residual degrees of freedom. Plan subsequent error/confirmation information; run count alone does not specify the resolution, and negligible higher-order effects remain an assumption. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-035",
    "optionRationales": [
      "Incorrect. A length-three defining word gives resolution III, so the proposed fraction does not provide the requested separation of low-order effects.",
      "Incorrect. One-factor-at-a-time changes do not support joint interaction estimation over the factorial region as the requested design does.",
      "Incorrect. Sixteen observations minus rank sixteen leaves zero residual degrees of freedom, not fifteen.",
      "Correct. It identifies a specific resolution V fraction and explicitly acknowledges its saturated full main-plus-two-factor model."
    ],
    "trap": "Resolution V is not an automatic error estimate. Distinguish estimability under alias assumptions from precision and significance estimation in a saturated design.",
    "distractors": [
      "Incorrect. A length-three defining word gives resolution III, so the proposed fraction does not provide the requested separation of low-order effects.",
      "Incorrect. One-factor-at-a-time changes do not support joint interaction estimation over the factorial region as the requested design does.",
      "Incorrect. Sixteen observations minus rank sixteen leaves zero residual degrees of freedom, not fifteen.",
      "Correct. It identifies a specific resolution V fraction and explicitly acknowledges its saturated full main-plus-two-factor model."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "NIST: Fractional factorial specifications and resolution",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri3344.htm",
        "locator": "5.3.3.4.4; defining relations and resolution"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "For a safe temperature interval, planning evidence suggests a locally linear strength sensitivity of 0.5 MPa/°C and independent run-to-run strength SD of 3 MPa. The proposed low/high temperatures differ by 2 °C, with one independent run per level. Which planning assessment is best?",
    "options": [
      "The 2 °C spacing is smaller than 3 MPa of noise, so the experiment is invalid by direct comparison of these two numbers.",
      "The expected 1 MPa contrast exceeds the standard error because the standard error equals the 0.5 MPa/°C sensitivity.",
      "Changing to fewer replicates would improve detection by reducing the amount of response variation included in the comparison.",
      "The expected 1 MPa contrast has SE 4.24 MPa; assess safe wider spacing, replication or justified blocking."
    ],
    "answer": 3,
    "why": "Expected signal is sensitivity times spacing: 0.5 × 2 = 1 MPa. For two independent observations with SD 3 MPa, the planning SE of their difference is sqrt(3² + 3²) = sqrt(18) = 4.2426 MPa. This weak signal-to-SE comparison motivates a power/precision assessment, not a guarantee of a particular p-value. With r independent runs per level the planning SE is 3 sqrt(2/r). Widening levels must remain safe and respect local-model limits; blocking can help only when it accounts for a real nuisance source. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-036",
    "optionRationales": [
      "Incorrect. Temperature spacing and strength noise have different units; use a sensitivity model to translate spacing into response change.",
      "Incorrect. Sensitivity is a slope with units MPa/°C, not the standard error of the response contrast.",
      "Incorrect. Fewer independent replicates increase, not reduce, the uncertainty of the estimated level difference under this model.",
      "Correct. It compares signal and uncertainty on the same response scale and considers feasible design remedies rather than declaring failure certain."
    ],
    "trap": "Compare signal with noise in compatible units. Small factor spacing is not inherently wrong: sensitivity, replication, nuisance control and the decision target determine adequacy.",
    "distractors": [
      "Incorrect. Temperature spacing and strength noise have different units; use a sensitivity model to translate spacing into response change.",
      "Incorrect. Sensitivity is a slope with units MPa/°C, not the standard error of the response contrast.",
      "Incorrect. Fewer independent replicates increase, not reduce, the uncertainty of the estimated level difference under this model.",
      "Correct. It compares signal and uncertainty on the same response scale and considers feasible design remedies rather than declaring failure certain."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "NIST/SEMATECH e-Handbook: Model validation",
        "url": "https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm",
        "locator": "4.4.4; residual analysis and limits of training fit"
      },
      {
        "title": "NIST: Fractional factorial specifications and resolution",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri3344.htm",
        "locator": "5.3.3.4.4; defining relations and resolution"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "In a replicated, randomized 2³ extrusion experiment, a prespecified analysis with an adequate error model finds the A×B×C interaction significant. The main-effect and two-factor tests are not significant. The team proposes deleting all lower-order terms and reporting that no pair of factors interacts. What should the MBB recommend?",
    "options": [
      "Delete A×B×C because a higher-order interaction cannot be present unless every component main effect is significant.",
      "Delete the lower-order terms and state that the nonsignificant marginal A×B test proves no A×B interaction at either C level.",
      "Average the response over C and select settings solely from the resulting main-effects plot to avoid interpreting an unusual finding.",
      "Retain hierarchy and examine A×B at each C level; nonsignificant marginal tests do not establish zero conditional effects."
    ],
    "answer": 3,
    "why": "A three-way interaction means that a two-factor interaction changes with the third factor. Opposing A×B interactions at the two C levels can average to zero, so a nonsignificant marginal A×B term does not imply absence at each C level. Model hierarchy concerns retaining lower-order terms needed to interpret the higher-order structure, not requiring each to be statistically significant. For example, y = 50 + 10ABC has zero averaged main/two-factor effects but opposing conditional A×B patterns. Verify adequacy and uncertainty before operational recommendations. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-037",
    "optionRationales": [
      "Incorrect. Significance of the highest-order interaction does not mathematically require significance of every lower-order term.",
      "Incorrect. Marginal cancellation can hide conditional two-factor interactions; a nonsignificant test is not proof that those conditional effects are zero.",
      "Incorrect. Averaging over the conditioning factor can remove the very structure needed to choose and communicate settings.",
      "Correct. It preserves hierarchy and focuses on the conditional interpretation supported by a three-way interaction."
    ],
    "trap": "Hierarchy is a modeling principle, not a significance requirement. Distinguish an averaged two-factor term from the two-factor relationship conditional on the third factor.",
    "distractors": [
      "Incorrect. Significance of the highest-order interaction does not mathematically require significance of every lower-order term.",
      "Incorrect. Marginal cancellation can hide conditional two-factor interactions; a nonsignificant test is not proof that those conditional effects are zero.",
      "Incorrect. Averaging over the conditioning factor can remove the very structure needed to choose and communicate settings.",
      "Correct. It preserves hierarchy and focuses on the conditional interpretation supported by a three-way interaction."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "Minitab: What is an interaction?",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/anova/supporting-topics/anova-models/what-is-an-interaction/",
        "locator": "Conditional effects; plot does not establish significance"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "All high-temperature trials were run Monday and all low-temperature trials Tuesday, so temperature is completely confounded with day. Temperature is hard to change, but future work can include both levels on each of several days with independently replicated temperature periods. Which redesign best protects temperature estimation?",
    "options": [
      "Repeat the same high-Monday/low-Tuesday schedule with more subsamples, keeping day and temperature perfectly aligned.",
      "Use a justified restricted-randomization design with both temperatures represented across days, randomized feasible periods, independent whole-plot replication and the correct error strata.",
      "Fit day and temperature as separate fixed effects to the current confounded data; software can recover their unique effects without new information.",
      "Randomize only the order of subsample measurements within each existing day and treat all subsamples as independent temperature replications."
    ],
    "answer": 1,
    "why": "The present data cannot separate temperature from day. More subsamples under the same day/temperature alignment do not create independent information for that contrast. Hard-to-change factors can be studied using legitimate restricted randomization, such as split-plot structures, rather than insisting on unrestricted run order. Spread temperature levels across independently replicated periods, randomize within feasibility, and use whole-plot error for temperature where appropriate. Subsamples are not independent replications of the temperature assignment. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-038",
    "optionRationales": [
      "Incorrect. Repetition without breaking the alignment improves precision of a confounded contrast but cannot identify temperature separately from day.",
      "Correct. It breaks the complete confounding, respects physical constraints and matches inference to the actual randomization units.",
      "Incorrect. A rank-deficient model cannot identify separate day and temperature effects from perfectly confounded columns.",
      "Incorrect. Measurement-order randomization does not randomize treatment assignment, and subsamples do not replace whole-plot replication."
    ],
    "trap": "Randomization has levels. For hard-to-change factors, identify the experimental unit and error stratum; randomizing measurement order does not repair confounded assignments.",
    "distractors": [
      "Incorrect. Repetition without breaking the alignment improves precision of a confounded contrast but cannot identify temperature separately from day.",
      "Correct. It breaks the complete confounding, respects physical constraints and matches inference to the actual randomization units.",
      "Incorrect. A rank-deficient model cannot identify separate day and temperature effects from perfectly confounded columns.",
      "Incorrect. Measurement-order randomization does not randomize treatment assignment, and subsamples do not replace whole-plot replication."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "NIST: Fractional factorial specifications and resolution",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri3344.htm",
        "locator": "5.3.3.4.4; defining relations and resolution"
      },
      {
        "title": "Minitab: Create 2-Level Split-Plot Design — All statistics",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/doe/how-to/factorial/create-factorial-design/create-2-level-split-plot/examine-the-design/all-statistics/",
        "locator": "Whole plots, hard-to-change factors, whole-plot replicates and blocks"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A planned experiment has each operator run a complete replicate of every treatment combination. Treatment order is randomized within operator, and the initial analysis includes an additive operator block effect. What benefit does this provide, and what limitation should the MBB retain?",
    "options": [
      "Blocking removes operator differences from the physical process, so future production variation will necessarily be lower.",
      "It separates additive operator shifts from treatment comparisons and can improve precision; treatment-by-operator differences still require assessment when scientifically relevant.",
      "Blocking makes randomization unnecessary because identical treatment coverage eliminates all time-order and learning effects within an operator.",
      "Including operator as a block automatically estimates every treatment-by-operator interaction even with only one observation per combination."
    ],
    "answer": 1,
    "why": "Complete treatment coverage within each operator keeps additive operator shifts from being confounded with the treatment contrasts. Accounting for a real nuisance source can reduce residual variation and improve precision, but blocking does not remove physical operator variation or guarantee an improvement when block effects are negligible. Randomization within blocks is still needed. An additive block model assumes away treatment-by-operator structure; estimating and testing that structure requires an appropriate design and error information, not merely naming the block. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-039",
    "optionRationales": [
      "Incorrect. Blocking controls a source of variation in design and analysis; it does not change the physical operating process itself.",
      "Correct. It states the potential precision benefit under additive blocks and preserves the need to consider interactions and design adequacy.",
      "Incorrect. Time trends and order effects can remain within operators, so blocking is complementary to randomization, not a replacement.",
      "Incorrect. A block term does not automatically supply separately estimable and testable treatment-by-block interaction and error information."
    ],
    "trap": "Blocking is useful when it controls real nuisance variation without sacrificing the needed treatment contrasts. Check coverage, randomization and the additive-model assumption.",
    "distractors": [
      "Incorrect. Blocking controls a source of variation in design and analysis; it does not change the physical operating process itself.",
      "Correct. It states the potential precision benefit under additive blocks and preserves the need to consider interactions and design adequacy.",
      "Incorrect. Time trends and order effects can remain within operators, so blocking is complementary to randomization, not a replacement.",
      "Incorrect. A block term does not automatically supply separately estimable and testable treatment-by-block interaction and error information."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "NIST: Fractional factorial specifications and resolution",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri3344.htm",
        "locator": "5.3.3.4.4; defining relations and resolution"
      },
      {
        "title": "NIST: Randomized block designs",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm",
        "locator": "5.3.3.2; balanced coverage, within-block comparisons and additive block model"
      }
    ]
  },
  {
    "sub": "mbb-analytics",
    "stem": "A DFSS team proposes a standard 17-run definitive screening design for eight continuous factors at three coded levels. It expects only a few active effects and will validate any selected model. What advantage over a standard resolution III two-level screen is defensible, and what estimation claim must be rejected?",
    "options": [
      "The DSD protects main effects from second-order aliasing; its 17 runs cannot freely estimate all 45 quadratic-model coefficients.",
      "The DSD identifies all main effects, two-factor interactions and pure quadratic terms simultaneously because no pair of columns is fully aliased.",
      "The DSD's third levels eliminate uncertainty, so the best settings from the screen require neither error assessment nor confirmation.",
      "The DSD makes main effects identical to two-factor interaction columns, which is why it can use fewer runs than a full factorial."
    ],
    "answer": 0,
    "why": "For the stated standard continuous-factor DSD, main-effect columns are orthogonal to second-order terms, unlike the main-effect/two-factor aliasing of resolution III. Three levels provide information about pure curvature, and sparse active-factor models can be useful. However, a full quadratic in eight factors contains 1 + 8 + 8 + 28 = 45 coefficients. Seventeen observations cannot identify all 45 freely; absence of pairwise complete aliasing does not imply full joint estimability. Model selection, second-order correlations, uncertainty and confirmation or augmentation remain important. Source alignment: ASQ CMBB Body of Knowledge, VI.C, Design of Experiments. This is an original practice scenario, not an ASQ-authored or endorsed item.",
    "set": 3,
    "qid": "mbb:set-3:d6-040",
    "optionRationales": [
      "Correct. It gives the designed screening advantage and the parameter-count limit without promising a full unrestricted response surface.",
      "Incorrect. More columns than rows cannot all be jointly independent even when no two individual columns are identical.",
      "Incorrect. Additional levels improve design information but do not eliminate random error, selection uncertainty or the need for validation.",
      "Incorrect. Main-effect orthogonality to second-order terms is the advantage; making the columns identical would recreate the aliasing problem."
    ],
    "trap": "Not completely aliased pairwise is not the same as jointly estimable. Count parameters and respect the sparsity and follow-up assumptions behind an efficient screen.",
    "distractors": [
      "Correct. It gives the designed screening advantage and the parameter-count limit without promising a full unrestricted response surface.",
      "Incorrect. More columns than rows cannot all be jointly independent even when no two individual columns are identical.",
      "Incorrect. Additional levels improve design information but do not eliminate random error, selection uncertainty or the need for validation.",
      "Incorrect. Main-effect orthogonality to second-order terms is the advantage; making the columns identical would recreate the aliasing problem."
    ],
    "auditSources": [
      {
        "title": "ASQ Certified Master Black Belt Body of Knowledge",
        "url": "https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf",
        "locator": "VI.C, Design of Experiments"
      },
      {
        "title": "JMP: Definitive screening designs",
        "url": "https://www.jmp.com/en/statistics-knowledge-portal/design-of-experiments/screening-designs/definitive-screening-designs",
        "locator": "Main-effect orthogonality, curvature and sparse active-factor models"
      },
      {
        "title": "Minitab: Available definitive screening designs",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/doe/supporting-topics/factorial-and-screening-designs/available-definitive-screening-designs/",
        "locator": "Single replicate, all continuous factors: 7–8 factors, 17 runs"
      }
    ]
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