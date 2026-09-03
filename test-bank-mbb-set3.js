(function(global){
  'use strict';
  global.MBB_SET3=[
  {
    "sub": "mbb-enterprise",
    "stem": "A hospital network's executive team completes a SWOT analysis identifying \"aging clinical IT infrastructure\" as a top weakness and \"value-based care reimbursement shift\" as a top external threat. The Master Black Belt is asked to translate this into the improvement pipeline. Three candidate projects surface: (1) reduce emergency department boarding time, (2) reduce clinical documentation errors linked to the legacy EHR, (3) reduce cafeteria food waste. Which project should the MBB prioritize as the *strategic* pipeline entry, and why?",
    "options": [
      "Project 2, because it directly addresses both the identified weakness (IT infrastructure) and the threat (reimbursement tied to documentation-driven quality metrics)",
      "Project 1, because ED boarding time has the largest visible patient-satisfaction impact",
      "Project 3, because it has the fastest payback and lowest implementation risk",
      "All three should be launched simultaneously to maximize portfolio throughput given limited SWOT specificity"
    ],
    "answer": 0,
    "why": "Strategic plan development requires tracing a candidate project's line of sight back to specific SWOT findings, not just picking the largest or fastest win. Project 2 sits at the intersection of the named weakness and threat, giving it the clearest strategic-alignment case. Source: [CSSC] Ch. 9, Selecting the Right Projects \u2014 Enterprise-Level Selection Process.",
    "set": 3,
    "qid": "mbb:set-3:d1-001"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A consumer electronics manufacturer faces high uncertainty from volatile tariff policy and rapidly shifting component availability. The MBB is asked to recommend a strategic planning tool to inform the next 18-month improvement pipeline. Which is the most defensible recommendation?",
    "options": [
      "Skip formal planning tools and rely on executive intuition given how quickly conditions are changing",
      "A single SWOT analysis, since it is the fastest and most widely understood tool",
      "Scenario planning with 2\u20133 plausible futures, each stress-tested against candidate projects, supplementing (not replacing) SWOT",
      "A single-point financial forecast used to rank projects by NPV only"
    ],
    "answer": 2,
    "why": "Under high external volatility, a single static SWOT or point forecast risks being invalidated quickly. Scenario planning explicitly tests strategic robustness across multiple plausible futures \u2014 the appropriate response to genuine uncertainty, not a replacement for foundational tools like SWOT but a supplement to it. Source: [BOK] Domain I.A, Strategic Plan Development; general strategic-management practice.",
    "set": 3,
    "qid": "mbb:set-3:d1-004"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An enterprise project selection matrix weights strategic fit (40%), financial return (30%), risk (20%), and resource availability (10%). Project X scores 9/10 strategic fit, 4/10 financial return, 8/10 risk (10 = lowest risk), 3/10 resource availability. Project Y scores 5/10 strategic fit, 9/10 financial return, 6/10 risk, 9/10 resource availability. Using the weighted scores, which project should be selected, and what is the key caution for the MBB to raise regardless of the numeric outcome?",
    "options": [
      "Project Y wins numerically, but only by a very narrow margin (6.8 vs. 6.7); the MBB should treat this near-tie as inconclusive rather than decisive \u2014 Project X's low resource-availability score (3/10) remains a real feasibility risk despite its strategic strength, and a 0.1-point difference is far too thin a margin to settle the decision on the weighted score alone",
      "Project Y wins numerically (7.0 vs. 6.6); no further caution is needed since the math is final",
      "Both projects tie exactly at 6.75; the MBB should recommend a coin flip to avoid the appearance of bias",
      "Project Y wins numerically (6.8 vs. 6.7), and since the weighting scheme was formally agreed upon in advance, the committee should proceed with Y with no further discussion needed"
    ],
    "answer": 0,
    "why": "X = 0.4(9)+0.3(4)+0.2(8)+0.1(3) = 3.6+1.2+1.6+0.3 = 6.7. Y = 0.4(5)+0.3(9)+0.2(6)+0.1(9) = 2.0+2.7+1.2+0.9 = 6.8. Y wins numerically, but only by 0.1 points \u2014 closely matched, with X's resource constraint a real execution risk. The critical MBB judgment is that a weighted score is a decision input, not a decision-maker; a near-tie combined with a low resource-availability score should prompt further discussion rather than a mechanical selection of the higher number. Source: [BOK] Domain I.B, Strategic Plan Alignment; III.B, Project Portfolio Infrastructure.",
    "chart": {"type": "data-table", "columns": ["Criterion", "Weight", "Project X (raw /10)", "Project Y (raw /10)"], "rows": [["Strategic fit", "40%", "9", "5"], ["Financial return", "30%", "4", "9"], ["Risk (10=lowest risk)", "20%", "8", "6"], ["Resource availability", "10%", "3", "9"]]},
    "set": 3,
    "qid": "mbb:set-3:d1-006"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Six months into a Black Belt's project to reduce order-entry cycle time, the enterprise pivots strategy toward a new market segment that makes the original process largely obsolete within 12 months. The BB has already achieved a 20% cycle-time improvement and wants to continue to full completion. As the coaching MBB, what is the best next action?",
    "options": [
      "Reassess the project against current strategic priorities with the BB and sponsor; if the underlying process will be materially obsolete before the ROI horizon closes, formally re-scope or close the project, document interim gains, and redirect the BB's remaining capacity to a project aligned with the new strategy",
      "Cancel the project immediately without discussion to avoid any further resource drain",
      "Escalate to the executive team to reverse the strategic pivot so the project can continue as planned",
      "Let the project continue unchanged since sunk effort and partial gains should not be abandoned"
    ],
    "answer": 0,
    "why": "Portfolio and alignment discipline (Domain I/III/V overlap) requires periodic re-validation of in-flight projects against current strategy \u2014 not blind continuation (sunk cost fallacy) nor unilateral cancellation without sponsor/BB input, nor attempting to reverse legitimate strategic decisions to protect a single project. Source: [BOK] Domain I.B and V.A, Coaching Executives and Champions.",
    "set": 3,
    "qid": "mbb:set-3:d1-009"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An organization has: (a) an executive-sponsored steering committee, (b) certified Belts at all levels, (c) a documented project selection process, but (d) no standardized way to track realized financial benefits after project closure, and no repository of lessons learned across projects. Which maturity gap should the MBB flag as the highest priority to close next?",
    "options": [
      "None \u2014 the deployment is already fully mature given (a)\u2013(c)",
      "The organization should immediately decertify all existing Belts and restart training",
      "The benefits-tracking and lessons-learned gap, because without post-closure benefit validation and knowledge capture, the organization cannot demonstrate ROI to sustain executive sponsorship or avoid repeating past mistakes across projects",
      "The steering committee should be dissolved since project selection is already documented"
    ],
    "answer": 2,
    "why": "Governance and training infrastructure without benefit realization tracking and knowledge management is a well-known maturity gap \u2014 it threatens long-term sponsorship (execs can't see proven ROI) and repeats avoidable errors. This is a higher-leverage fix than anything else listed. Source: [BOK] Domain I.C, Infrastructure Elements; II.E, Organizational Feedback.",
    "set": 3,
    "qid": "mbb:set-3:d1-012"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An IT department wants to integrate Scrum with an ongoing Six Sigma initiative. Which statement correctly characterizes an appropriate integration?",
    "options": [
      "Scrum's short, iterative sprints can be used within the Improve/Design phase to develop and test technical solutions (e.g., software changes) identified by DMAIC/DMADV analysis, while DMAIC/DMADV continues to provide the overall data-driven problem definition and control structure",
      "Scrum and Six Sigma are fundamentally incompatible and should never be used on the same initiative",
      "Scrum eliminates the need for a control plan since sprints are inherently self-correcting",
      "Scrum should replace DMAIC entirely for all IT-related improvement work"
    ],
    "answer": 0,
    "why": "This reflects real MBB-level integration judgment \u2014 Scrum is a delivery mechanism well-suited to the technical build-out within a phase, not a replacement for the overall analytical/control framework Six Sigma provides. Source: [CSSC] Ch. 3, Scrum.",
    "set": 3,
    "qid": "mbb:set-3:d1-016"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A manufacturing plant reports the following annual Cost of Poor Quality (COPQ) by category: internal failure $1.2M, external failure $3.8M, appraisal $0.6M, prevention $0.2M. Total revenue is $80M. Using COPQ as a screening tool for pipeline opportunity sizing, which category should receive the *first* investigative look, and what does the overall COPQ-to-revenue ratio (7%) suggest about deployment maturity?",
    "options": [
      "The ratio cannot be interpreted without knowing the industry's exact benchmark COPQ percentage, so no prioritization is possible",
      "External failure costs, because at $3.8M it is both the largest single category and the costliest form of failure (defects reaching the customer); a COPQ/revenue ratio of ~7% is on the higher end for a maturing Six Sigma deployment, suggesting real opportunity remains and that current prevention investment ($0.2M, only 3% of total COPQ) is likely under-resourced relative to failure costs",
      "Prevention costs, because they are the smallest category and therefore the easiest problem to solve",
      "Appraisal costs, because inspection activities are inherently wasteful and should always be eliminated first"
    ],
    "answer": 1,
    "why": "($1.2M+$3.8M+$0.6M+$0.2M)/$80M = $5.8M/$80M = 7.25% \u22487%. External failure is both the largest cost driver and reaches the customer \u2014 highest priority for opportunity sizing. The heavy skew toward failure costs vs. prevention (0.2M) is itself diagnostic: mature quality systems invest more heavily upstream in prevention relative to failure costs. Source: [CSSC] Ch. 8, The CoQ and the CoPQ.",
    "chart": {"type": "data-table", "columns": ["Category", "Amount", "% of revenue ($80M)"], "rows": [["Internal failure", "$1.2M", "1.5%"], ["External failure", "$3.8M", "4.75%"], ["Appraisal", "$0.6M", "0.75%"], ["Prevention", "$0.2M", "0.25%"]]},
    "set": 3,
    "qid": "mbb:set-3:d1-019"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A CFO benchmarks the company's customer complaint rate (2.1 per 1,000 transactions) against a published industry average (3.5 per 1,000) and concludes \"we have no quality problem worth pursuing.\" What is the analytical flaw in this conclusion?",
    "options": [
      "The complaint rate should have been converted to DPMO before any comparison could be valid",
      "There is no flaw \u2014 being better than the industry average means there is no opportunity",
      "Benchmarking against industry averages is never a legitimate practice in Six Sigma",
      "The comparison ignores whether the benchmark is apples-to-apples (same transaction definition, industry segment, and measurement system), ignores internal trend direction (the rate could be worsening even while below the external benchmark), and ignores whether \"average\" is an appropriate improvement target rather than best-in-class or the company's own historical best"
    ],
    "answer": 3,
    "why": "This tests the ability to identify multiple compounding flaws in a superficially reasonable conclusion \u2014 comparability, trend blindness, and target-setting logic (average vs. best-in-class) are all standard MBB-level critiques of naive benchmarking. Source: [BOK] Domain I.E, Opportunities for Improvement.",
    "set": 3,
    "qid": "mbb:set-3:d1-020"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Four candidate projects have the following (estimated annual benefit, probability of success, implementation risk score 1\u20135 where 5 = highest risk): P1 ($500K, 80%, risk 2); P2 ($900K, 50%, risk 4); P3 ($300K, 95%, risk 1); P4 ($700K, 65%, risk 3). Using risk-adjusted expected value (benefit \u00d7 probability of success) as a first screen, rank the projects, and explain why risk score should still be reviewed even after this calculation.",
    "options": [
      "Expected values: P1=$400K, P2=$450K, P3=$285K, P4=$455K \u2192 ranking P4 > P2 > P1 > P3; however, P2 and P4 carry meaningfully higher implementation risk (4 and 3) than P1 (2), so the pipeline decision should weigh the risk-adjusted value against the organization's current risk appetite and delivery capacity, not select purely on the expected-value ranking",
      "All four projects should be pursued simultaneously since none has negative expected value",
      "P3 should always be selected first because it has the lowest risk score regardless of benefit",
      "P2 > P4 > P1 > P3 by raw benefit alone; risk score is irrelevant once expected value is known"
    ],
    "answer": 0,
    "why": "P1: 500\u00d70.8=400; P2: 900\u00d70.5=450; P3: 300\u00d70.95=285; P4: 700\u00d70.65=455. Correct EV ranking: P4 ($455K) > P2 ($450K) > P1 ($400K) > P3 ($285K). But P4 and P2's higher risk scores mean the near-tie at the top between P4/P2 should trigger a qualitative risk-appetite conversation, not a mechanical selection of the top EV number \u2014 a nuance an MBB must bring to portfolio governance. Source: [BOK] Domain I.F, Pipeline Management; III.C, Project Portfolio Financial Tools.",
    "chart": {"type": "data-table", "columns": ["Project", "Annual benefit", "Probability of success", "Risk (1=low,5=high)"], "rows": [["P1", "$500,000", "80%", "2"], ["P2", "$900,000", "50%", "4"], ["P3", "$300,000", "95%", "1"], ["P4", "$700,000", "65%", "3"]]},
    "set": 3,
    "qid": "mbb:set-3:d1-022"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An enterprise has 6 active Black Belts, each capable of running one project at a time with an average project duration of 4 months. The validated pipeline contains 24 approved projects. Leadership wants \"all 24 projects done as fast as possible.\" Design the most defensible approach to sequencing this pipeline.",
    "options": [
      "Assign all 24 projects simultaneously across the 6 BBs (4 each) to maximize parallelism regardless of impact",
      "With fixed capacity (6 BBs \u00d7 ~3 projects/year each \u2248 18 project-completions/year), the realistic throughput is roughly 16 months to clear 24 projects if run near-continuously; rather than force unrealistic parallelism, rank the 24 by strategic impact and risk-adjusted value (Domain I.F/III.C) and sequence the top-ranked projects first, while communicating the realistic ~16-month full-pipeline timeline to leadership rather than overloading BBs to hit an unrealistic \"all at once\" expectation",
      "Sequence in strict order of submission date to ensure fairness",
      "Hire no additional Belts and simply tell leadership all 24 will be done within 4 months since that's one project's duration"
    ],
    "answer": 1,
    "why": "This is a Create-level capacity-planning synthesis: 6 BBs \u00d7 (12 months/4-month projects) = 18 completions/year; 24 projects \u00f7 18/year \u2248 16 months at full utilization. The defensible MBB response combines realistic throughput math, impact-based sequencing, and transparent expectation-setting with leadership \u2014 not blind parallelism, arbitrary fairness rules, or an impossible promise. Source: [BOK] Domain I.F, Pipeline Management; I.C, Infrastructure Elements (capacity).",
    "chart": {"type": "data-table", "columns": ["Black Belts", "Completions/year (4-mo. avg.)", "Months to clear 24 projects"], "rows": [["4", "12", "24.0"], ["6", "18", "16.0"], ["8", "24", "12.0"], ["12", "36", "8.0"]]},
    "set": 3,
    "qid": "mbb:set-3:d1-023"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Over the last four quarters, the enterprise pipeline shows: projects initiated per quarter holding steady at 8, but projects completed per quarter dropping from 7 to 4, while the number of projects \"in progress\" (WIP) has grown from 12 to 28. What does this pattern most likely indicate, and what is the appropriate diagnostic next step?",
    "options": [
      "The organization is becoming more ambitious and successful, since more projects are always better",
      "The pattern is unrelated to capacity and is likely just random quarter-to-quarter variation requiring no action",
      "The solution is to initiate even more projects to compensate for the completion slowdown",
      "Growing WIP with declining completion rate despite steady intake is a classic sign of pipeline overload \u2014 too much work-in-process relative to available Belt/resource capacity, causing multitasking, delays, and falling throughput; the appropriate next step is to apply Little's Law-style analysis (WIP, throughput, and cycle time relationships) to identify whether intake should be throttled or capacity increased before adding any new projects"
    ],
    "answer": 3,
    "why": "Rising WIP + falling completions + steady intake is the signature of a capacity-constrained pipeline (directly analogous to Little's Law: cycle time increases as WIP grows relative to fixed throughput capacity) \u2014 a core Lean/flow-management concept an MBB must apply to portfolio management, not just shop-floor processes. Source: [BOK] Domain I.F, Pipeline Management; Lean flow principles (Little's Law), general Lean Six Sigma practice.",
    "chart": {"type": "time-series", "title": "Work-in-progress by quarter", "labels": ["Q1", "Q2", "Q3", "Q4"], "data": [12, 17, 22, 28], "xLabel": "Quarter", "yLabel": "Projects in progress (WIP)", "decimals": 0, "altText": "Work-in-progress rises steadily across four quarters: 12, 17, 22, then 28 projects in progress, while completions per quarter fall from 7 to 4 over the same period."},
    "set": 3,
    "qid": "mbb:set-3:d1-025"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A logistics company's enterprise strategy targets improving On-Time-In-Full (OTIF) delivery. The warehouse team's cascaded metric is \"orders picked per hour\" and the transportation team's cascaded metric is \"cost per mile.\" After a quarter, picking productivity and cost-per-mile both improved, but OTIF declined. What is the most likely alignment failure?",
    "options": [
      "OTIF is not a valid strategic metric for a logistics company",
      "OTIF should have been measured before the fiscal year began",
      "The warehouse and transportation teams should be merged into a single department",
      "Both teams optimized locally-relevant, efficiency-focused metrics that are not directly tied to the actual OTIF components (on-time and in-full), so local gains in speed/cost did not translate to the strategic outcome \u2014 and may have traded against it (e.g., faster picking causing more errors, cheaper routing causing later deliveries)"
    ],
    "answer": 3,
    "why": "This is the same cascade-alignment failure pattern seen elsewhere with unpaired efficiency metrics (e.g., a call center rewarding fast handle time at the expense of resolution quality): locally efficient metrics that aren't causally tied to the strategic outcome metric can degrade the very thing the strategy intended to improve. Source: [BOK] Domain I.B, Strategic Plan Alignment.",
    "set": 3,
    "qid": "mbb:set-3:d1-027"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A bank's VOC data shows customers are largely satisfied with loan processing times. Separately, a new federal regulation will require enhanced disclosure documentation within 12 months, and the bank's current process cannot produce the required documentation without significant redesign. How should the MBB advise on pipeline prioritization?",
    "options": [
      "Regulatory projects should never be run using Six Sigma methodology since they are compliance-driven, not customer-driven",
      "The regulatory requirement should be deprioritized in favor of any project with stronger VOC support",
      "The regulatory-compliance redesign should enter the pipeline as a high-priority (likely mandatory-timeline) opportunity despite the absence of a customer complaint signal, because regulatory non-compliance carries legal/financial risk that VOC data cannot be expected to surface \u2014 VOC and compliance-driven opportunities are evaluated on different bases (customer satisfaction vs. legal risk and deadline), not against each other",
      "Since VOC shows satisfaction, no changes are needed"
    ],
    "answer": 2,
    "why": "Not every legitimate pipeline entry originates from VOC \u2014 regulatory/compliance mandates are a distinct opportunity category with their own (often externally-fixed) urgency and consequence profile, and an MBB must recognize this rather than forcing every opportunity through a customer-satisfaction lens. Source: [BOK] Domain I.E, Opportunities for Improvement.",
    "set": 3,
    "qid": "mbb:set-3:d1-030"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An aerospace manufacturer's Six Sigma deployment infrastructure currently has no formal process for Green Belts to advance to Black Belt certification beyond \"manager's discretion.\" What infrastructure gap does this represent, and what is the risk?",
    "options": [
      "The gap is irrelevant since Green Belts should never advance to Black Belt",
      "This is a talent-pipeline infrastructure gap: without standardized advancement criteria (e.g., minimum completed projects, validated benefit realization, competency assessment), Belt quality and enterprise-wide credibility of the certification become inconsistent across managers/departments, undermining both the training infrastructure and downstream project quality",
      "No gap exists; manager discretion is an acceptable substitute for a formal advancement pathway",
      "The solution is to eliminate the Green Belt level entirely"
    ],
    "answer": 1,
    "why": "Standardized advancement criteria are a recognized infrastructure element \u2014 informal, manager-dependent promotion criteria create inconsistent Belt quality and credibility problems across the organization, a real and common deployment maturity gap. Source: [BOK] Domain I.C, Infrastructure Elements; IV, Training Design and Delivery (related domain).",
    "set": 3,
    "qid": "mbb:set-3:d1-034"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An airline's improvement pipeline for the year consists of 14 projects, all targeting on-time departure performance, with zero projects addressing baggage handling, customer service, or maintenance turnaround. On-time departure is indeed the top strategic KPI. What portfolio-level concern should the MBB raise?",
    "options": [
      "Portfolio balance is a Green Belt-level concern, not something an MBB needs to weigh in on",
      "The airline should abandon the on-time departure focus entirely in favor of equal weighting across all four areas",
      "None \u2014 since on-time departure is the top KPI, 100% pipeline concentration on it is optimal",
      "Even with one dominant strategic KPI, a portfolio concentrated entirely in a single opportunity area risks diminishing returns (the same overlapping root causes revisited repeatedly), ignores other legitimate strategic and risk exposures (safety-adjacent maintenance turnaround, customer retention via service/baggage), and creates single-point organizational risk if that KPI's improvement levers are exhausted \u2014 some portfolio diversification, even under one dominant priority, is generally defensible"
    ],
    "answer": 3,
    "why": "Even legitimate single-KPI dominance in strategy doesn't justify total pipeline concentration \u2014 diminishing returns, unaddressed risk exposure in adjacent areas (especially anything safety-adjacent like maintenance), and the failure to build organizational Six Sigma capability broadly are all real portfolio-level risks an MBB should surface, even while affirming the top KPI's priority. Source: [BOK] Domain I.F, Pipeline Management; III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d1-037"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A bank's fraud-detection false-positive rate (legitimate transactions incorrectly flagged) has crept up over 18 months, but no one knows why \u2014 multiple systems, rules, and vendor updates have changed over that period. Which is the most appropriate methodology to recommend?",
    "options": [
      "DMADV, since a new fraud detection system should be built from scratch",
      "Lean 5S, since the primary issue is workplace organization",
      "Immediately roll back all vendor updates from the past 18 months without further analysis",
      "DMAIC, because an existing process is degrading and the root cause is unknown \u2014 the Measure and Analyze phases are specifically designed to systematically investigate an unclear root cause in an operating process using the accumulated data (rule changes, vendor updates, false-positive trends) before jumping to a redesign"
    ],
    "answer": 3,
    "why": "This is the classic DMAIC use case: an existing process with a known symptom (rising false positives) and an unknown root cause \u2014 systematic Measure/Analyze work (not a redesign, not a workplace-organization tool, and not a guess-and-rollback) is the appropriate path. Source: [CSSC] Ch. 11, Introduction to DMAIC and DMADV; Ch. 14, Analyze.",
    "set": 3,
    "qid": "mbb:set-3:d1-041"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A retail chain's CFO states, \"our strategic plan is simply to hit this year's budget targets across every store.\" The MBB is asked to build the improvement pipeline directly from store-level budget variances. What is the flaw in using the budget alone as the strategic plan?",
    "options": [
      "Budgets should never be used in any part of strategic planning",
      "There is no flaw \u2014 budget targets are always an adequate substitute for strategic planning",
      "An annual budget is a financial control and resource-allocation tool reflecting short-term targets; it typically doesn't capture longer-term competitive positioning, customer experience direction, or capability-building goals that a genuine strategic plan addresses \u2014 building the pipeline from budget variance alone risks a purely reactive, short-term-focused portfolio disconnected from durable competitive strategy",
      "The CFO should be removed from the strategic planning process entirely"
    ],
    "answer": 2,
    "why": "This tests the MBB's ability to recognize when a legitimate but narrower tool (annual budget) is being mistaken for a comprehensive strategic plan \u2014 a common flaw, especially in finance-driven organizations, that produces a reactive rather than forward-looking pipeline. Source: [BOK] Domain I.A, Strategic Plan Development.",
    "set": 3,
    "qid": "mbb:set-3:d1-044"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A food bank analyzes feedback only from recipients who returned for a second visit, concluding \"our distribution process has no significant pain points\" since satisfaction scores are high. What analytical flaw undermines this conclusion as a basis for identifying (or ruling out) improvement opportunities?",
    "options": [
      "The flaw is that the food bank should not survey recipients at all",
      "The sample size is the only issue; a larger sample of returning recipients would resolve the flaw",
      "There is no flaw; returning recipients are a representative sample of all recipients",
      "This is a survivorship-bias flaw: recipients who found the process too difficult, confusing, or unpleasant may simply not return, so the sampled population systematically excludes the very people most likely to reveal significant pain points \u2014 high satisfaction among returners says little about the experience of non-returners"
    ],
    "answer": 3,
    "why": "Classic survivorship bias \u2014 measuring satisfaction only among those who \"survived\" (returned) systematically excludes exactly the population whose negative experience would reveal the opportunity, a critical flaw for opportunity-identification data. Source: [BOK] Domain I.E, Opportunities for Improvement; general statistical sampling principles.",
    "set": 3,
    "qid": "mbb:set-3:d1-048"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An automotive supplier's 5-year strategic plan was built assuming continued internal-combustion-engine part demand. Eighteen months in, a major OEM customer announces an accelerated EV transition that will eliminate 40% of the supplier's current part demand within 3 years. What should the MBB recommend regarding the existing improvement pipeline?",
    "options": [
      "Trigger a formal strategic plan review with executive leadership given the scale of the disruption; re-segment the pipeline into projects still valid under the new demand outlook (e.g., EV-relevant part lines) versus those tied to declining ICE-only demand, and re-prioritize/re-scope accordingly rather than treating the plan as fixed",
      "Wait until the full 5-year plan cycle ends before making any adjustments",
      "Continue the pipeline unchanged since strategic plans should not be revised mid-cycle",
      "Cancel the entire pipeline immediately without further analysis"
    ],
    "answer": 0,
    "why": "A disruption of this magnitude (40% demand elimination within 3 years) is exactly the kind of material change that should trigger formal strategic re-planning and pipeline re-segmentation \u2014 treating the plan as immutable (A, D) or overreacting with wholesale cancellation without analysis (B) are both poor MBB judgment. Source: [BOK] Domain I.A, Strategic Plan Development.",
    "set": 3,
    "qid": "mbb:set-3:d1-051"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A mining operation's VOB data shows the highest-cost quality issue is ore-grade variability, while safety incident data (near-misses) has been quietly rising for two quarters with no corresponding cost yet realized. Leadership wants to prioritize the ore-grade project given its clear cost case. How should the MBB advise?",
    "options": [
      "Ignore the near-miss trend entirely since \"near-miss\" means nothing actually happened",
      "Recommend a safety-focused opportunity enter the pipeline as at least a co-priority alongside (not necessarily above) ore-grade variability, because rising near-miss trends are a well-established leading indicator of future incidents; safety risk exposure should not be deprioritized simply because it hasn't yet converted into a realized cost \u2014 the \"cost case\" for safety often only appears after a serious event, by which point the opportunity to prevent it is gone",
      "Prioritize ore-grade variability exclusively, since it has a demonstrated cost impact and safety near-misses haven't yet resulted in an actual incident",
      "Defer any safety-related work until an actual injury occurs, to avoid resourcing an unproven risk"
    ],
    "answer": 1,
    "why": "This tests a critical MBB-level judgment: not all legitimate strategic opportunities have equally mature cost data at the point they need action \u2014 leading indicators (like rising near-misses) warrant proactive prioritization precisely because waiting for a realized cost (an actual injury) means the prevention opportunity has already been lost. Source: [BOK] Domain I.E, Opportunities for Improvement; general safety/quality leading-indicator practice.",
    "set": 3,
    "qid": "mbb:set-3:d1-055"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A law firm's enterprise strategy targets \"improve client retention through service quality.\" The associates' cascaded performance metric remains \"billable hours,\" unchanged from before the new strategy. What alignment problem does this represent?",
    "options": [
      "Client retention cannot be measured in a law firm, so no cascade is possible",
      "Billable hours and client retention are always perfectly aligned, so no problem exists",
      "The cascaded metric (billable hours) was never updated to reflect the new strategic emphasis on service quality, so associates continue to be incentivized exactly as before the strategy changed \u2014 a failure to actually cascade the new strategy into any measurable behavior change at the associate level",
      "The firm should eliminate billable hours tracking entirely and pay associates a flat salary"
    ],
    "answer": 2,
    "why": "This variation tests recognizing a *failure to cascade at all* (an unchanged legacy metric) as distinct from the earlier examples' problem of a cascaded-but-unbalanced metric \u2014 a subtler but equally real alignment failure: strategy changed, but no operational metric changed to reflect it. Source: [BOK] Domain I.B, Strategic Plan Alignment.",
    "set": 3,
    "qid": "mbb:set-3:d1-058"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An agribusiness's pipeline includes several projects requiring field-data collection that can only occur during the growing season (roughly 5 months per year), but Belt project assignments are made on a standard, non-seasonal quarterly cycle. Belts assigned in the \"wrong\" quarter routinely stall for months waiting for the growing season to begin. What pipeline management fix addresses this directly?",
    "options": [
      "Assign Belts to growing-season-dependent projects only during quarters that align with the actual data-collection window, explicitly building the biological/seasonal constraint into project sequencing and Belt assignment timing, rather than treating all projects as interchangeable on a generic quarterly cycle",
      "Assign Belts to growing-season projects at the standard time regardless of season, and simply extend their project deadlines indefinitely until data becomes available",
      "Require growing-season projects to collect data during the off-season using estimated or substituted data instead of real field data",
      "Discontinue all growing-season-dependent projects since the seasonal constraint is too inconvenient for standard pipeline scheduling"
    ],
    "answer": 0,
    "why": "This is a direct pipeline-scheduling fix: a known, structural timing constraint (seasonal data availability) should be explicitly built into assignment/sequencing logic, rather than forcing a generic, season-blind quarterly cycle onto a fundamentally seasonal data-generating process. Source: [BOK] Domain I.F, Pipeline Management.",
    "set": 3,
    "qid": "mbb:set-3:d1-062"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A consumer packaged goods company's executive board questions whether to continue funding the enterprise Six Sigma office ($1.2M annual infrastructure cost: MBB/BB salaries, training, software) given documented project savings of $8.5M over the same year. What should the MBB present as the most complete justification, beyond the raw ROI ratio?",
    "options": [
      "No further justification should be presented since raising the question at all indicates the board has already decided to cut funding",
      "Immediately agree to cut the budget by half regardless of the ROI evidence, to preempt any further scrutiny",
      "A complete picture including: the raw ROI ratio, the trend over multiple years (not just one strong year), the qualitative capability built (trained Belts, institutional problem-solving capacity that persists beyond any single project), and the risk of infrastructure loss (re-building deployment capability later is typically far more costly and slower than sustaining it) \u2014 since a single year's ROI, however strong, doesn't capture the durability or full value of the infrastructure investment",
      "Only the raw ROI ratio (8.5M / 1.2M \u2248 7:1), since that number alone is fully sufficient justification"
    ],
    "answer": 2,
    "why": "A single year's raw ROI, while a strong data point, is an incomplete infrastructure-investment case \u2014 trend durability, built organizational capability, and re-building deployment capability later is typically far more costly and slower than sustaining it are all standard, necessary elements of a complete MBB-level infrastructure justification to executive leadership. Source: [BOK] Domain I.C, Infrastructure Elements; III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d1-065"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Drawing on the principles tested throughout this domain (measurable objectives, SWOT/environmental linkage, cascade-ready structure, stakeholder synthesis, and pipeline-readiness), which single criterion, if missing, would most undermine an otherwise well-constructed strategic plan's usefulness for driving the improvement pipeline?",
    "options": [
      "The plan does not explicitly name every individual project to be undertaken over its full multi-year horizon",
      "The plan is written in formal business language reviewed by legal counsel",
      "The plan lacks any mechanism for periodic re-validation against changing conditions (i.e., it is treated as a static, one-time document rather than something revisited at defined intervals or trigger events), meaning even a well-constructed plan will progressively drift out of alignment with reality exactly as illustrated in the automotive (D1-051) and BB-project-pivot (D1-009) scenarios",
      "The plan's length exceeds 20 pages"
    ],
    "answer": 2,
    "why": "This closing synthesis item ties together the batch's recurring theme (strategic plans and their alignment must be periodically re-validated, not treated as static) into a single \"most critical missing element\" judgment \u2014 even a well-built plan becomes a liability if there's no defined mechanism to revisit it as conditions change. Source: [BOK] Domain I.A, Strategic Plan Development (synthesis across Batches 1-3).",
    "set": 3,
    "qid": "mbb:set-3:d1-069"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Several scenarios illustrate a recurring alignment failure pattern: a call center rewarding fast average handle time saw resolution quality fall; a logistics company's warehouse and transportation teams both hit their local efficiency metrics while on-time-in-full delivery declined; and a law firm's \"billable hours\" metric was never updated despite a new client-retention strategy. Which statement best captures the general principle an MBB should apply when reviewing any newly cascaded metric?",
    "options": [
      "Before approving any cascaded metric, explicitly test it against two questions: (1) can this metric be improved in a way that works against the actual strategic outcome it's meant to serve (an unpaired or gameable metric), and (2) does this metric actually change when the strategy itself changes, or is it a legacy holdover \u2014 both known, recurring alignment failure modes",
      "Cascaded metrics should always be identical to the top-level enterprise metric, with no local adaptation",
      "Cascaded metrics are inherently unreliable and should be replaced with purely qualitative executive judgment",
      "Only financial metrics should ever be cascaded, since non-financial metrics are too easily misaligned"
    ],
    "answer": 0,
    "why": "This synthesis item asks the candidate to abstract a general diagnostic principle from several concrete failure patterns \u2014 a genuinely MBB-level (Evaluate/synthesis) task distinct from recognizing any single instance of the pattern. Source: [BOK] Domain I.B, Strategic Plan Alignment (cross-scenario synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d1-070"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Reflecting on the infrastructure scenarios in this domain (steering committees, hybrid/centralized/decentralized models, maturity gaps, franchise models, data-access agreements), which general prioritization principle should guide an MBB deciding which infrastructure element to build or fix first in a given organization?",
    "options": [
      "Always invest in training infrastructure first, since Belt certification is the most visible infrastructure element",
      "Always build governance structures (steering committees) first in every organization, regardless of context",
      "Infrastructure investment order does not matter as long as all elements are eventually built",
      "Diagnose the organization's specific bottleneck (e.g., missing measurement standardization, an untracked benefits-realization gap, a structural cross-functional access barrier) and prioritize the infrastructure investment that removes the constraint currently most limiting deployment effectiveness \u2014 since the \"right\" infrastructure priority is context-dependent, not a fixed universal sequence"
    ],
    "answer": 3,
    "why": "This closing item synthesizes the batch's infrastructure scenarios (each showing a different specific bottleneck \u2014 measurement standardization, benefits tracking, data access, certification pathways, franchise structure) into the general principle that infrastructure prioritization should be diagnostic and context-specific, not a fixed universal checklist order. Source: [BOK] Domain I.C, Infrastructure Elements (cross-batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d1-071"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Synthesizing the methodology-selection scenarios in this domain (DMAIC vs. DMADV, DFSS for regulated new products, Kaizen for narrow well-understood problems, short-run SPC for unique-unit production, BPR for plateaued incremental gains), what is the single most important question an MBB should ask *before* any other consideration when selecting an improvement methodology?",
    "options": [
      "Does an existing, operating process already exist to be measured and improved, or is this fundamentally a new-process/new-product design problem, a narrowly-scoped well-understood tactical fix, or a case requiring architectural redesign due to plateaued returns \u2014 since methodology selection should follow from the actual nature and history of the problem, not from convenience, familiarity, or trend",
      "What is the cheapest methodology available regardless of fit to the problem?",
      "Which methodology is currently most fashionable in the industry?",
      "Which methodology does the assigned Black Belt already know best?"
    ],
    "answer": 0,
    "why": "This closing synthesis item distills the domain's repeated methodology-selection lesson (tested individually across scenarios spanning DMAIC-vs-DMADV problem framing, DFSS for regulated new products, Kaizen for narrow well-understood fixes, and BPR for plateaued incremental gains) into the single foundational diagnostic question that should precede all others: what is the actual nature of the problem (existing process vs. new design vs. narrow tactical fix vs. plateaued/architectural), since methodology should follow problem type. Source: [BOK] Domain I.D, Improvement Methodologies (cross-batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d1-072"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Synthesizing the opportunity-identification pitfalls tested in this domain (naive benchmarking, survivorship bias, correlation/causation confusion, VOC/VOB imbalance, safety leading-indicator neglect), what common thread should an MBB apply as a validation checklist before accepting any proposed \"opportunity\" as pipeline-ready?",
    "options": [
      "Accept any opportunity that has any supporting data at all, regardless of the data's source or limitations",
      "Reject any opportunity that cannot be immediately quantified in exact dollar terms",
      "Opportunities identified through quantitative data are always more valid than those identified through qualitative or risk-based reasoning",
      "Explicitly interrogate the data source for each proposed opportunity: is the comparison/sample fairly constructed (not biased or non-comparable), does correlation-based evidence have a validated causal mechanism (or is it just a hypothesis to test further), and has the opportunity been checked against multiple legitimate input types (VOC, VOB, safety/risk, regulatory) rather than relying on a single, possibly incomplete data source"
    ],
    "answer": 3,
    "why": "This synthesis item distills the domain's opportunity-identification pitfalls (VOC/VOB balance, benchmarking flaws, COPQ sizing, multi-source validation, survivorship bias, leading indicators, and correlation/causation confusion, each tested elsewhere in this domain) into a general validation discipline: scrutinize data quality/bias, distinguish correlation from established causation, and triangulate across multiple legitimate input types. Source: [BOK] Domain I.E, Opportunities for Improvement (cross-batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d1-073"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Synthesizing the pipeline management scenarios in this domain (Belt capacity constraints, stage-gate kill decisions, cross-departmental competition, dependency cascades, seasonal scheduling constraints, and WIP/throughput diagnosis), which general principle should govern all pipeline management decisions, regardless of the specific triggering situation?",
    "options": [
      "Pipeline management decisions should be grounded in the organization's actual, current resource capacity (Belt availability, dependencies, seasonal/structural constraints) and transparent, criteria-based governance \u2014 treating capacity as a hard constraint to plan around and trade off against explicitly, rather than as an assumption that can be indefinitely stretched to accommodate every request",
      "Pipeline decisions should always be made by whichever department or individual raises the loudest or most urgent-sounding concern",
      "More active projects in the pipeline is always better, since it demonstrates organizational ambition",
      "Once a project enters the pipeline, it should never be paused, re-sequenced, or killed regardless of new information"
    ],
    "answer": 0,
    "why": "This closing synthesis item distills the domain's pipeline scenarios (capacity math, stage-gate kill decisions, re-sequencing governance, portfolio diversification, cross-departmental scoring, seasonal scheduling, and dependency cascades, each tested elsewhere in this domain) into the unifying principle that real capacity constraints must be respected and explicitly traded off against via transparent governance, rather than papered over or ignored. Source: [BOK] Domain I.F, Pipeline Management (cross-batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d1-074"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A newly appointed MBB inherits an organization with: (1) a strategic plan of vague aspirational statements with no measurable targets, (2) cascaded metrics unchanged from three strategic cycles ago, (3) governance infrastructure limited to an inactive steering committee, (4) a pipeline of 30 projects with no prioritization criteria applied, (5) six Belts at or beyond capacity, and (6) no benefits-tracking process. Which sequence of first actions best reflects sound MBB judgment, given everything tested in this domain?",
    "options": [
      "Decertify the existing steering committee and cancel all 30 projects on day one without further diagnosis",
      "Focus exclusively on hiring more Belts to increase capacity, since that is the most concrete and immediately actionable gap",
      "Start by revising the strategic plan into specific, measurable objectives (the foundational gap underlying nearly every other symptom \u2014 vague strategy causes unfocused metrics, ungoverned pipelines, and unmeasurable benefits), then re-establish steering committee governance and cascaded metrics tied to the revised plan, then re-prioritize the 30-project pipeline against the new criteria and Belt capacity (likely deferring/killing a substantial fraction), and only then formalize benefits-tracking going forward \u2014 addressing the root strategic-clarity gap before layering governance, prioritization, and measurement fixes on top of it",
      "Immediately launch all 30 pipeline projects simultaneously to demonstrate rapid impact to new leadership"
    ],
    "answer": 2,
    "why": "This capstone item requires synthesizing the entire domain's teachings into a prioritized action sequence: recognizing that a vague strategic plan is the root cause underlying nearly every other symptom listed (unfocused cascaded metrics, an ungoverned pipeline, absent benefits tracking), and that fixing foundational strategic clarity first, then governance, then pipeline prioritization against real capacity, then measurement, is the logically sound and evidence-based sequence \u2014 genuinely Create-level synthesis, not recall of any single fact. Source: [BOK] Domain I, full domain synthesis (A\u2013F).",
    "set": 3,
    "qid": "mbb:set-3:d1-075"
  },
  {
    "sub": "mbb-org",
    "stem": "An e-commerce fulfillment company is deciding how Black Belts should report organizationally: as dedicated headcount within a central Six Sigma office (functional), or embedded within business units with a dotted-line to the Six Sigma office (matrix). The company runs lean, cross-functional fulfillment centers where speed of local decision-making is highly valued. Which structure is generally more defensible here, and why?",
    "options": [
      "A matrix structure, because embedding Belts within business units preserves the fast, local decision-making the company values while the dotted-line relationship still provides methodology consistency, cross-project learning, and career-pathing support from the central office",
      "Belts should report to no one and operate as fully independent contractors within each fulfillment center",
      "A purely functional structure, because centralizing all Belts guarantees perfect consistency regardless of business unit needs",
      "Neither structure matters; organizational design has no real effect on deployment effectiveness"
    ],
    "answer": 0,
    "why": "Given the stated value on fast local decision-making, a matrix structure balances local embeddedness/responsiveness with the methodology consistency and career development that a central function still needs to provide \u2014 a standard MBB-level organizational design trade-off. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-001"
  },
  {
    "sub": "mbb-org",
    "stem": "A cruise line wants crew members to report near-miss safety incidents more readily, but incident reports have been declining even as anecdotal evidence suggests near-misses are occurring at a steady or increasing rate. What cultural/values framework element most likely explains this pattern?",
    "options": [
      "Declining reports always indicate genuine safety improvement and should be celebrated without further investigation",
      "A lack of psychological safety: if crew members fear blame, discipline, or negative career consequences for reporting, they will under-report even as actual near-miss frequency stays the same or rises \u2014 declining reports in this context is a red flag for reporting culture, not necessarily improving safety",
      "The reporting form is likely too long, and this is purely a process-design issue unrelated to culture",
      "Crew members are becoming more skilled and therefore experiencing fewer near-misses in reality"
    ],
    "answer": 1,
    "why": "Declining self-reported incident rates alongside steady/rising anecdotal evidence is a classic signature of a psychological-safety deficit \u2014 a core organizational culture/values framework concept the MBB must recognize rather than taking the declining numbers at face value. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-004"
  },
  {
    "sub": "mbb-org",
    "stem": "A waste management company's regional operations managers each directly supervise 25-30 route supervisors, who in turn supervise 15-20 drivers each. The company wants to embed Six Sigma champion responsibilities into the regional operations manager role. What organizational design concern should the MBB raise first?",
    "options": [
      "Champion responsibilities are irrelevant to organizational design and belong entirely to Domain V (Coaching and Mentoring)",
      "The role clarity concern: whether champion duties (project sponsorship, resource clearing, cross-functional escalation) are explicitly defined and resourced (e.g., protected time) as distinct from the regional manager's existing operational span-of-control responsibilities, since simply adding champion duties on top of an already-wide span of control without clarifying priority and time allocation risks the champion role becoming ceremonial due to sheer capacity constraints",
      "Route supervisors, not regional operations managers, should always hold champion responsibilities regardless of organizational level appropriateness",
      "No concern \u2014 champion responsibilities can always be added to any role regardless of existing span of control"
    ],
    "answer": 1,
    "why": "Adding a significant new responsibility (champion duties) onto an already wide span-of-control role without explicit role clarity and protected capacity is a predictable path to the same kind of ceremonial-sponsorship failure that occurs when champion duties are added without protected time or role clarity \u2014 an organizational design concern the MBB should proactively flag before the role assignment is finalized, not after champions become unavailable. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-007"
  },
  {
    "sub": "mbb-org",
    "stem": "A publishing company wants to design a recognition structure to reinforce a new \"customer-first\" cultural value tied to its Six Sigma deployment. Which recognition approach is most defensible?",
    "options": [
      "Purely financial bonuses with no public acknowledgment component, since money is the only meaningful form of recognition",
      "A single, large annual \"Employee of the Year\" award chosen entirely by senior executives based on subjective impression",
      "No formal recognition structure; values should be self-motivating and require no reinforcement",
      "Recognition explicitly tied to demonstrated customer-first behaviors and outcomes (e.g., documented process improvements traceable to VOC data, team-based project completions with quantified customer impact), delivered with reasonable frequency (not just once annually) and through multiple channels (public acknowledgment, career-pathing credit, team-level as well as individual recognition) so the reinforcement is timely, criteria-based, and visible enough to shape ongoing behavior"
    ],
    "answer": 3,
    "why": "Effective culture/values reinforcement requires recognition that is criteria-based (tied to the specific value/behavior), timely (not just annual), and visible (multiple channels, not solely private) \u2014 a well-established organizational behavior principle relevant to Domain II.D. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-010"
  },
  {
    "sub": "mbb-org",
    "stem": "A wind energy company's Six Sigma deployment sits entirely within the Engineering division, with no formal linkage to Operations, Finance, or HR. Projects addressing cross-divisional issues (e.g., turbine maintenance scheduling that touches both Engineering and Operations) frequently stall due to Operations' unfamiliarity with and limited buy-in to the methodology. What organizational design flaw does this reflect?",
    "options": [
      "The company should abandon cross-divisional projects entirely and only pursue Engineering-only improvement work",
      "Engineering should never be involved in Six Sigma deployment at all",
      "Operations should be required to adopt Engineering's exact terminology and tools regardless of any legitimate differences in their work context",
      "The deployment's organizational placement (siloed entirely within one division) limits its authority and credibility to drive genuinely cross-divisional projects; the design should be revised to give the Six Sigma function either an enterprise-level (not single-division) reporting structure, or formal cross-divisional governance representation, so cross-functional projects have legitimate standing outside Engineering alone"
    ],
    "answer": 3,
    "why": "A deployment function housed entirely within one division structurally limits its ability to drive genuinely cross-divisional work \u2014 this is a classic organizational-design flaw requiring a structural fix (enterprise-level placement or cross-divisional governance), not merely better communication within the existing structure. Source: [BOK] Domain II.A, Organizational Design; I.C, Infrastructure Elements (related).",
    "set": 3,
    "qid": "mbb:set-3:d2-013"
  },
  {
    "sub": "mbb-org",
    "stem": "A correctional facility management company's stated values include \"continuous improvement\" and \"staff empowerment,\" but its actual promotion and disciplinary practices heavily penalize any deviation from existing procedures, even well-documented, data-supported process improvement suggestions from line staff. What does this reveal, and what should the MBB flag to leadership?",
    "options": [
      "There is a values-behavior gap: the stated cultural values (continuous improvement, empowerment) are contradicted by the actual reinforcement mechanisms (promotion/discipline practices), which will undermine the credibility of any Six Sigma deployment built on those stated values until the practical incentive structures are brought into alignment with the stated culture",
      "The company should remove \"continuous improvement\" and \"staff empowerment\" from its stated values since they are aspirational and therefore inappropriate",
      "This is purely an HR policy issue with no relevance to Six Sigma deployment",
      "Nothing is wrong; stated values and actual practices are always aligned by definition"
    ],
    "answer": 0,
    "why": "A genuine values-behavior gap (stated culture contradicted by actual incentive/disciplinary practices) is a critical organizational-culture diagnostic an MBB must surface \u2014 deploying Six Sigma on top of contradictory incentive structures will produce exactly the kind of engagement failures (disengaged staff, suppressed reporting, resistance to genuine collaboration) that predictably follow when stated values and actual incentive structures diverge. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-016"
  },
  {
    "sub": "mbb-org",
    "stem": "An agri-genetics research company implements a matrix structure where Black Belts report both to a functional Six Sigma office and to the R&D project lead they're embedded with, and the two supervisors disagree on the Belt's top priority for the quarter. What organizational design element should have been established in advance to prevent this conflict from stalling the Belt's work?",
    "options": [
      "The Black Belt should independently decide which supervisor to prioritize without any organizational guidance",
      "A predefined escalation and priority-arbitration protocol (e.g., a joint quarterly priority-setting session between the functional and project-line supervisors, with a defined tiebreaker authority) established at the time the matrix structure was designed, so that when priority conflicts arise (as they predictably will in any matrix), there is already an agreed mechanism to resolve them rather than leaving the Belt caught between two unaligned supervisors",
      "Nothing could have prevented this; matrix conflicts are always unresolvable and matrix structures should never be used",
      "Matrix structures should include no functional-office involvement at all, only project-line reporting"
    ],
    "answer": 1,
    "why": "Matrix structures predictably generate dual-reporting priority conflicts \u2014 sound organizational design anticipates this and establishes an escalation/arbitration mechanism in advance, rather than leaving individual Belts to navigate unresolved supervisor conflicts on their own each time they arise. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-019"
  },
  {
    "sub": "mbb-org",
    "stem": "A home healthcare provider wants to assess its current organizational culture before launching a Six Sigma deployment, to identify likely areas of resistance versus receptivity. Which type of tool is most appropriate for this assessment?",
    "options": [
      "A validated organizational culture assessment survey/instrument (e.g., measuring dimensions like openness to change, psychological safety, hierarchy/power distance, and data-driven decision-making orientation) administered before deployment to establish a baseline understanding of cultural readiness and likely friction points",
      "A review of the company's marketing materials and public brand messaging",
      "An analysis of competitor market share, since culture is best inferred from competitive position",
      "A financial audit of the past year's budget variances"
    ],
    "answer": 0,
    "why": "A validated culture assessment instrument is the appropriate, purpose-built tool for understanding organizational readiness dimensions (change openness, psychological safety, hierarchy, data orientation) relevant to deployment planning \u2014 the other options measure unrelated dimensions entirely. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-022"
  },
  {
    "sub": "mbb-org",
    "stem": "A telecom tower maintenance company has field technicians dispersed across a wide rural service territory, rarely co-located, with a single Black Belt expected to run in-person Kaizen-style events. After a year, project completion rates are far below the company's other, more centralized divisions. What organizational design issue is most likely limiting effectiveness, and what adaptation should the MBB recommend?",
    "options": [
      "The deployment model itself was designed around in-person, co-located engagement assumptions that don't fit a geographically dispersed workforce; the MBB should recommend adapting the engagement model (e.g., virtual/asynchronous data collection, remote facilitation tools, regional cluster events instead of single large in-person sessions) to fit the actual organizational/geographic structure rather than continuing to apply a co-located deployment design to a dispersed workforce",
      "Technicians simply lack the aptitude for process improvement work",
      "The company should discontinue Six Sigma deployment for all field-based roles",
      "The Black Belt is underperforming and should be replaced with a more experienced hire"
    ],
    "answer": 0,
    "why": "This tests recognizing that deployment engagement models must be organizationally fit-for-purpose \u2014 a design built around in-person co-location will predictably underperform in a genuinely dispersed workforce, and the fix is adapting the engagement mechanism, not blaming the Belt or the technicians. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-026"
  },
  {
    "sub": "mbb-org",
    "stem": "A pet grooming franchise brand wants Six Sigma-supportive cultural values (data-driven decisions, continuous improvement) to be consistently understood across 150 independently owned locations. Given the franchise ownership structure (as discussed in Domain I's infrastructure context), what is the most appropriate cultural reinforcement mechanism?",
    "options": [
      "Cultural values cannot be meaningfully reinforced across independently owned franchise locations, so no attempt should be made",
      "Mandate identical daily staff meeting scripts at every location with no franchisee input",
      "Rely entirely on each franchisee's personal values with no brand-level guidance or shared materials at all",
      "Develop shared brand-level cultural messaging and training materials (e.g., a brief onboarding module on the brand's data-driven, continuous-improvement values) that franchisees can adopt as part of brand standards, similar to the toolkit approach used for infrastructure in the Domain I franchise scenario \u2014 providing consistent messaging while respecting franchisee operational autonomy"
    ],
    "answer": 3,
    "why": "This mirrors the general franchise infrastructure principle: a shared, brand-level toolkit/messaging approach reinforces consistent values while respecting the franchisee's independent ownership and operational autonomy, rather than either full mandate (A) or full abdication (B, D). Source: [BOK] Domain II.D, Organizational Culture and Values Framework; I.C (franchise infrastructure parallel,).",
    "set": 3,
    "qid": "mbb:set-3:d2-029"
  },
  {
    "sub": "mbb-org",
    "stem": "A regional dry cleaning chain with 12 locations and no dedicated Six Sigma office wants to begin a lightweight deployment. Which organizational design approach is most appropriate for this scale?",
    "options": [
      "A lightweight design: designate one or two existing operations managers as part-time internal champions/facilitators (with some protected time and basic training), reporting informally to ownership/senior management, scaled appropriately to the organization's size rather than replicating large-enterprise infrastructure",
      "No organizational design changes are needed; deployment can succeed with zero defined roles, structure, or accountability",
      "Outsource 100% of process improvement work permanently to external consultants with no internal capability building at all",
      "Build a full corporate Six Sigma office with dedicated MBB, multiple BBs, and a formal steering committee, mirroring a Fortune 500 deployment regardless of the chain's actual size"
    ],
    "answer": 0,
    "why": "This reinforces the general resource-scaling principle seen elsewhere in resource-constrained contexts: organizational design should be scaled appropriately to organizational size and resources, not default to either an over-built large-enterprise model (A) or no structure at all (C). Source: [BOK] Domain II.A, Organizational Design; I.C (scaling principle).",
    "set": 3,
    "qid": "mbb:set-3:d2-032"
  },
  {
    "sub": "mbb-org",
    "stem": "A grocery chain's standard practice after any inventory shrinkage incident is to identify and discipline the individual employee deemed responsible. Six Sigma root-cause analysis on a shrinkage-reduction project keeps hitting a wall: employees are reluctant to fully describe what happened during incidents, fearing it will be used against them personally. What cultural framework shift should the MBB recommend?",
    "options": [
      "Continue individual blame but simply promise employees, without any structural change, that \"this time will be different\"",
      "Continue the existing individual-blame discipline practice unchanged, since accountability is important, and simply ask employees to be more forthcoming despite the risk to them",
      "Eliminate all forms of individual accountability entirely, regardless of any genuine misconduct",
      "Shift toward a \"just culture\" or systems-focused investigation approach (common in high-reliability industries) that distinguishes genuine root-cause/system contributors from individual culpable misconduct, reserving discipline for the latter while treating most incidents as learning opportunities to fix systemic and process gaps \u2014 this is necessary to get the honest, detailed incident information root-cause analysis actually requires"
    ],
    "answer": 3,
    "why": "This is a direct application of the \"just culture\" framework \u2014 a well-established organizational culture principle distinguishing systemic/human-error contributors (treated as learning opportunities) from genuine misconduct (still appropriately addressed) \u2014 necessary here because a pure blame culture is actively preventing the honest data collection root-cause analysis requires. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-035"
  },
  {
    "sub": "mbb-org",
    "stem": "A moving/relocation services company hires large numbers of seasonal temporary workers during its peak summer months (60% of total workforce during peak), making sustained Belt/champion relationships with this segment difficult. What organizational design adaptation is most appropriate?",
    "options": [
      "Require every seasonal worker to complete full Green Belt certification before starting work, regardless of the short employment duration",
      "Exclude seasonal workers from any process improvement involvement entirely, focusing solely on the 40% permanent workforce",
      "Design a lightweight, rapid-onboarding engagement model specifically for the seasonal segment (e.g., simple standardized checklists/visual aids co-developed with permanent staff, quick feedback capture mechanisms usable within a single shift, and concentrating deeper Belt-level project work in the permanent-staff-led off-season planning period) rather than either excluding the majority of peak-season labor or over-investing training time that exceeds the realistic employment relationship",
      "Treat seasonal and permanent workers identically in all respects, ignoring the differences in tenure, training investment feasibility, and role in process improvement"
    ],
    "answer": 2,
    "why": "This tests organizational design judgment for a workforce segment with structurally different tenure/training economics \u2014 excluding a 60% majority (A) or over-investing training relative to the employment relationship (B) are both poor fits; a right-sized engagement model matched to actual tenure and role is the defensible middle path. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-038"
  },
  {
    "sub": "mbb-org",
    "stem": "A multi-location orthodontics practice pays individual orthodontists a bonus based solely on their own patient throughput, but wants to cultivate a \"collaborative continuous improvement\" culture where orthodontists share best practices and jointly solve cross-location scheduling bottlenecks. Adoption of shared best practices has been minimal. What cultural/incentive misalignment does this illustrate?",
    "options": [
      "Orthodontists are simply uninterested in collaboration as a personality trait across the profession",
      "The solution is to eliminate individual bonuses entirely and pay all orthodontists an identical flat salary with no performance component",
      "The individual, throughput-only incentive structure directly rewards behavior that can conflict with the time investment collaboration requires (sharing knowledge, jointly troubleshooting bottlenecks that may not directly boost one's own throughput), so the stated desire for a \"collaborative\" culture is undermined by an incentive structure that doesn't reward or may even penalize the time spent on collaborative activities",
      "Collaborative culture is simply impossible in any healthcare practice regardless of incentive design"
    ],
    "answer": 2,
    "why": "This is a direct incentive-structure/values-alignment diagnosis (paralleling D2-016's values-behavior gap) \u2014 a purely individual, throughput-based incentive structure works against the time investment collaborative behavior requires, undermining the stated cultural goal regardless of how genuinely the organization wants collaboration. Source: [BOK] Domain II.D, Organizational Culture and Values Framework; II.F, Organizational Performance Metrics (incentive-metric link).",
    "set": 3,
    "qid": "mbb:set-3:d2-041"
  },
  {
    "sub": "mbb-org",
    "stem": "A bakery chain has centralized production at one facility supplying 40 retail storefronts. Quality issues at the storefront level (e.g., improper display case temperature affecting product freshness) are increasingly common, but all Six Sigma deployment focus and Belt resources have historically been placed at the central production facility only. What organizational design gap does this reveal?",
    "options": [
      "The deployment's organizational design has concentrated entirely on one node (central production) of a multi-node value chain, leaving the distributed retail-storefront segment \u2014 where the emerging quality issues are actually occurring \u2014 without dedicated deployment attention or resources; the design should be extended to include storefront-level engagement (even lightweight, given the scale of 40 locations) rather than remaining concentrated solely at the original production-focused starting point",
      "The retail storefronts should be closed and all sales shifted to the central facility to eliminate the distributed quality-control challenge entirely",
      "No gap exists; central production is inherently the only place quality issues can meaningfully originate in a bakery chain",
      "Central production should be blamed for all storefront-level issues regardless of where the actual root cause resides"
    ],
    "answer": 0,
    "why": "This tests recognizing that deployment focus can become historically anchored to its original starting point (central production) even as the actual value chain and emerging problem areas (retail storefronts) evolve \u2014 sound organizational design should extend coverage to where the evidence indicates issues are occurring. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-044"
  },
  {
    "sub": "mbb-org",
    "stem": "A parking management company collects customer complaint data quarterly and reviews it in a quarterly operations meeting, but most complaints spike sharply during specific high-demand events (e.g., major sports games, concerts) that occur throughout the quarter. By the time quarterly review happens, the specific operational conditions that caused event-day complaints (staffing levels, signage, payment system load) are no longer fresh enough to reconstruct in detail. What should the MBB recommend?",
    "options": [
      "Implement event-triggered (not just calendar-triggered) feedback review: for high-demand events, conduct a brief post-event debrief capturing complaint themes and operational conditions while still fresh, feeding a running log that the quarterly review can then draw on for pattern analysis \u2014 combining rapid event-level capture with periodic strategic-level synthesis, rather than relying solely on a calendar cadence poorly matched to the actual event-driven nature of the problem",
      "Increase the frequency of full quarterly-style comprehensive reviews to monthly, without addressing the event-specific timing mismatch",
      "Eliminate the quarterly review entirely in favor of only event-level debriefs, discarding any periodic strategic-level synthesis",
      "Continue the quarterly review cadence unchanged, since quarterly reporting is a standard business rhythm regardless of the underlying event-driven pattern"
    ],
    "answer": 0,
    "why": "This is another cadence-mismatch diagnosis (paralleling similar ride-share and feedback-timing scenarios seen elsewhere in this domain) but with a nuanced fix: the underlying problem is event-driven rather than time-driven, so the solution is event-triggered rapid capture feeding into (not replacing) periodic strategic synthesis \u2014 combining both timescales appropriately rather than simply increasing a still poorly-matched calendar-based frequency (D). Source: [BOK] Domain II.E, Organizational Feedback; cadence-matching principle.",
    "set": 3,
    "qid": "mbb:set-3:d2-048"
  },
  {
    "sub": "mbb-org",
    "stem": "An airport ground services company operates three rotating shifts around the clock, but Six Sigma champion coverage and Belt project engagement have historically existed only during the day shift, since that's when the (day-shift-only) Six Sigma office staff are present. Night and overnight shift issues are systematically underrepresented in the project pipeline. What organizational design fix should the MBB recommend?",
    "options": [
      "Require all night-shift employees to attend day-shift meetings on their own time, uncompensated, to participate in the deployment",
      "Deliberately extend deployment design to include night/overnight shift representation \u2014 e.g., designating a night-shift champion, scheduling at least some project touchpoints (interviews, data reviews) during or adjacent to night-shift hours, and ensuring the opportunity-identification process actively solicits input from all shifts, not just the shift the Six Sigma office happens to staff during",
      "Continue day-shift-only coverage, since overnight shift issues are inherently less important than day-shift issues",
      "Eliminate the night shift's ability to submit improvement ideas altogether, since operational coverage make participation impractical"
    ],
    "answer": 1,
    "why": "This is a structural coverage-gap issue directly analogous to the geographic-dispersion problem in D2-026: deployment design that implicitly assumes a single shift's schedule systematically underrepresents legitimate opportunities and voices from other shifts, and the fix is extending the design (dedicated shift representation, adapted engagement timing), not deprioritizing or excluding that population. Source: [BOK] Domain II.A, Organizational Design; parallel to D2-026 (dispersed workforce).",
    "set": 3,
    "qid": "mbb:set-3:d2-051"
  },
  {
    "sub": "mbb-org",
    "stem": "A craft distillery's culture strongly emphasizes \"traditional methods passed down for generations,\" creating implicit resistance to any process change, even ones that don't affect the recipe or flavor profile (e.g., warehouse inventory tracking improvements). How should the MBB frame improvement work to fit this cultural context?",
    "options": [
      "Explicitly frame all improvement work as \"modernizing outdated traditional methods,\" directly challenging the tradition-based identity",
      "Secretly implement changes without any communication about them, hoping no one notices",
      "Explicitly distinguish and communicate which processes are being improved (e.g., inventory tracking, administrative workflows) as clearly separate from and non-threatening to the traditional recipe/production methods the culture values most, so the cultural attachment to tradition is respected rather than triggered by process improvements in unrelated operational areas",
      "Avoid any improvement work anywhere in the distillery given the strength of the tradition-based culture"
    ],
    "answer": 2,
    "why": "This is a values-sensitive framing approach: explicitly scoping and communicating that improvement work targets areas unrelated to the culturally-protected core (the traditional recipe/production methods) avoids unnecessarily triggering identity-based resistance, similar in spirit to other values-sensitive reframing approaches used when a legitimate cultural value is unnecessarily triggered by an unrelated process change. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-054"
  },
  {
    "sub": "mbb-org",
    "stem": "A computer repair franchise brand has a mix of corporate-owned and independently-franchised locations. Which organizational design principle should govern how Six Sigma deployment differs (if at all) between the two location types?",
    "options": [
      "Corporate-owned locations, being under direct corporate authority, can support a more prescriptive/mandatory deployment model (formal Belt assignments, mandatory project participation), while franchised locations should follow the voluntary/toolkit-based brand-standards approach appropriate to their independent ownership (as established for franchise contexts elsewhere in this domain) \u2014 the deployment design should differ by ownership/authority structure even within the same brand",
      "Only corporate-owned locations should be permitted to participate in Six Sigma deployment at all, excluding franchised locations entirely",
      "Franchised locations should have more mandatory requirements than corporate-owned locations, reversing the typical authority relationship",
      "Corporate-owned and franchised locations should have identical, mandatory deployment structures with no distinction, since brand consistency requires complete uniformity regardless of ownership structure"
    ],
    "answer": 0,
    "why": "This synthesizes the franchise-design principle established elsewhere in this domain with the reality of mixed ownership models \u2014 deployment design should appropriately differentiate by actual organizational authority/ownership structure, even within a single brand, rather than forcing uniform treatment (A) or an inverted authority relationship (C) or exclusion (D). Source: [BOK] Domain II.A, Organizational Design; parallel to D2-029.",
    "set": 3,
    "qid": "mbb:set-3:d2-057"
  },
  {
    "sub": "mbb-org",
    "stem": "A national park concessions operator (running park lodges, gift shops, and food service under a government contract) has staff who strongly identify with a conservation/stewardship mission, and view any \"efficiency\" or \"cost reduction\" framing of Six Sigma projects as conflicting with that mission, even when a proposed project (reducing food waste in park lodge kitchens) directly supports conservation goals. What cultural framing adjustment should the MBB recommend?",
    "options": [
      "Reject the project entirely since any connection to cost or efficiency conflicts irreparably with the conservation mission",
      "Require staff to set aside their conservation values entirely and adopt a purely commercial mindset for the duration of the project",
      "Avoid any mention of efficiency or cost savings, but otherwise keep the project framing and communication completely unchanged",
      "Explicitly reframe the food-waste-reduction project's communication and metrics around its conservation/stewardship impact (waste diverted from landfill, resources conserved) as the primary framing, with cost savings presented as a secondary, supporting benefit rather than the leading narrative \u2014 aligning the project's public framing with the value staff most strongly identify with, since the underlying project already genuinely serves that value"
    ],
    "answer": 3,
    "why": "Since the project's actual outcome (reduced food waste) genuinely and directly serves the conservation value staff care about, the correct fix is reframing the *communication* to foreground that authentic alignment rather than leading with efficiency/cost language that triggers unnecessary values-based resistance \u2014 a more complete version of the reframing principle tested elsewhere in this domain, including D2-054. Source: [BOK] Domain II.D, Organizational Culture and Values Framework; parallel to D2-054.",
    "set": 3,
    "qid": "mbb:set-3:d2-060"
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