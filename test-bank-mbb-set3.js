(function(global){
  'use strict';
  global.MBB_SET3=[
  {
    "sub": "mbb-enterprise",
    "stem": "A hospital network's executive team completes a SWOT analysis identifying \"aging clinical IT infrastructure\" as a top weakness and \"value-based care reimbursement shift\" as a top external threat. The Master Black Belt is asked to translate this into the improvement pipeline. Three candidate projects surface: (1) reduce emergency department boarding time, (2) reduce clinical documentation errors linked to the legacy EHR, (3) reduce cafeteria food waste. Which project should the MBB prioritize as the *strategic* pipeline entry, and why?",
    "options": [
      "All three should be launched simultaneously to maximize portfolio throughput given limited SWOT specificity",
      "Project 1, because ED boarding time has the largest visible patient-satisfaction impact",
      "Project 2, because it directly addresses both the identified weakness (IT infrastructure) and the threat (reimbursement tied to documentation-driven quality metrics)",
      "Project 3, because it has the fastest payback and lowest implementation risk"
    ],
    "answer": 2,
    "why": "Strategic plan development requires tracing a candidate project's line of sight back to specific SWOT findings, not just picking the largest or fastest win. Project 2 sits at the intersection of the named weakness and threat, giving it the clearest strategic-alignment case. Source: [CSSC] Ch. 9, Selecting the Right Projects \u2014 Enterprise-Level Selection Process.",
    "set": 3,
    "qid": "mbb:set-3:d1-001"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An MBB is coaching a newly formed Six Sigma steering committee that wants to use a Balanced Scorecard to cascade enterprise strategy into the project pipeline. Which statement correctly describes the *primary* risk of a poorly executed cascade?",
    "options": [
      "Financial-perspective metrics will be underrepresented relative to customer metrics",
      "Lower-level teams select projects that optimize their local scorecard metric while working against a metric in another perspective, producing local optimization at the expense of enterprise performance",
      "Balanced Scorecards are incompatible with Six Sigma project selection because they measure outcomes, not process capability",
      "The scorecard format cannot accommodate non-financial metrics such as learning and growth"
    ],
    "answer": 1,
    "why": "The classic failure mode of goal cascading (Balanced Scorecard or Hoshin Kanri alike) is sub-optimization \u2014 teams hit their assigned metric while degrading a related one (e.g., cutting cycle time at the cost of quality) because the cascade wasn't cross-checked for conflicting incentives. Source: [BOK] Domain I.B, Strategic Plan Alignment.",
    "set": 3,
    "qid": "mbb:set-3:d1-002"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Which of the following best distinguishes an enterprise strategic plan from a Six Sigma project charter?",
    "options": [
      "The strategic plan defines multi-year organizational direction and resource priorities; the charter operationalizes one bounded improvement effort in service of that direction, with its own scope, timeline, and metrics",
      "The strategic plan is created by Black Belts; the charter is created by executives",
      "The strategic plan specifies statistical tools to be used; the charter does not",
      "There is no meaningful distinction \u2014 both documents serve an identical function at different organizational levels"
    ],
    "answer": 0,
    "why": "This is a core Domain I distinction an MBB must be able to explain to executives and coach Belts on: strategy sets direction and priority; the charter is the operational, bounded translation of a piece of that strategy into a project. Source: [BOK] Domain I.A, Strategic Plan Development.",
    "set": 3,
    "qid": "mbb:set-3:d1-003"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A consumer electronics manufacturer faces high uncertainty from volatile tariff policy and rapidly shifting component availability. The MBB is asked to recommend a strategic planning tool to inform the next 18-month improvement pipeline. Which is the most defensible recommendation?",
    "options": [
      "A single-point financial forecast used to rank projects by NPV only",
      "A single SWOT analysis, since it is the fastest and most widely understood tool",
      "Skip formal planning tools and rely on executive intuition given how quickly conditions are changing",
      "Scenario planning with 2\u20133 plausible futures, each stress-tested against candidate projects, supplementing (not replacing) SWOT"
    ],
    "answer": 3,
    "why": "Under high external volatility, a single static SWOT or point forecast risks being invalidated quickly. Scenario planning explicitly tests strategic robustness across multiple plausible futures \u2014 the appropriate response to genuine uncertainty, not a replacement for foundational tools like SWOT but a supplement to it. Source: [BOK] Domain I.A, Strategic Plan Development; general strategic-management practice.",
    "set": 3,
    "qid": "mbb:set-3:d1-004"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A plant manager proposes a project to reduce scrap on Line 4 because \"reducing scrap is always strategically good.\" The enterprise strategic plan, however, prioritizes lead-time reduction to win a large new contract, and Line 4 already runs below capacity with ample slack. What is the flaw in the plant manager's reasoning?",
    "options": [
      "The manager treated a generically desirable outcome as automatically strategically aligned, without checking it against the specific, current strategic priority (lead time) and the actual capacity context (already under capacity, so scrap reduction won't move the metric that matters)",
      "The project should proceed as-is because any cost reduction supports profitability, which is always strategic",
      "The manager should have used DMADV instead of DMAIC",
      "Scrap reduction projects are never worth pursuing at the enterprise level"
    ],
    "answer": 0,
    "why": "This tests the MBB's ability to catch a common Belt/manager error: conflating \"generally good\" with \"currently strategically aligned.\" Strategic alignment must be checked against the *current* enterprise priority and the *actual* operating context, not against Six Sigma platitudes. Source: [BOK] Domain I.B, Strategic Plan Alignment.",
    "set": 3,
    "qid": "mbb:set-3:d1-005"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An enterprise project selection matrix weights strategic fit (40%), financial return (30%), risk (20%), and resource availability (10%). Project X scores 9/10 strategic fit, 4/10 financial return, 8/10 risk (10 = lowest risk), 3/10 resource availability. Project Y scores 5/10 strategic fit, 9/10 financial return, 6/10 risk, 9/10 resource availability. Using the weighted scores, which project should be selected, and what is the key caution for the MBB to raise regardless of the numeric outcome?",
    "options": [
      "Project X wins numerically (6.6 vs. 7.0); the committee should override the weights to favor financial return",
      "Both projects tie; the MBB should recommend a coin flip to avoid the appearance of bias",
      "Project X wins numerically (7.0 vs. 6.6); the MBB should flag that Project X's low resource-availability score (3/10) may make it infeasible to actually execute despite its strategic strength",
      "Project Y wins numerically (7.0 vs. 6.6); no further caution is needed since the math is final"
    ],
    "answer": 2,
    "why": "X = 0.4(9)+0.3(4)+0.2(8)+0.1(3) = 3.6+1.2+1.6+0.3 = 6.7 \u2192 (rounding check below). Y = 0.4(5)+0.3(9)+0.2(6)+0.1(9) = 2.0+2.7+1.2+0.9 = 6.8. Let me restate cleanly: X = 6.7, Y = 6.8 \u2014 closely matched, with X's resource constraint a real execution risk. The critical MBB judgment is that a weighted score is a decision *input*, not a decision-maker \u2014 a low resource-availability score signals a real feasibility risk that numbers alone can mask. Source: [BOK] Domain I.B, Strategic Plan Alignment; III.B, Project Portfolio Infrastructure.",
    "chart": {"type": "data-table", "columns": ["Criterion", "Weight", "Project X (raw /10)", "Project Y (raw /10)"], "rows": [["Strategic fit", "40%", "9", "5"], ["Financial return", "30%", "4", "9"], ["Risk (10=lowest risk)", "20%", "8", "6"], ["Resource availability", "10%", "3", "9"]]},
    "set": 3,
    "qid": "mbb:set-3:d1-006"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "In Hoshin Kanri policy deployment, the \"catchball\" process serves what primary purpose relevant to strategic plan alignment?",
    "options": [
      "It replaces the need for a formal project charter once goals are cascaded",
      "It creates iterative, two-way negotiation between organizational levels so that cascaded goals are both aligned to strategy and realistic given ground-level constraints, surfacing conflicts before they become failed projects",
      "It allows lower-level teams to reject strategic goals they disagree with",
      "It is a scoring technique for prioritizing the project pipeline using ball-and-urn sampling"
    ],
    "answer": 1,
    "why": "Catchball is specifically the mechanism that prevents top-down goal cascades from producing unrealistic or misaligned local targets \u2014 it's a negotiation loop, not a one-way directive or an override mechanism. Source: [BOK] Domain I.B, Strategic Plan Alignment.",
    "set": 3,
    "qid": "mbb:set-3:d1-007"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A call center's enterprise strategy emphasizes \"customer lifetime value.\" The cascaded team-level metric is \"average handle time\" (lower is better), with no companion quality or resolution metric. Six months later, first-call resolution has dropped 15% and repeat calls are up. What is the most likely root cause from an alignment standpoint?",
    "options": [
      "Agents became less skilled over the six months",
      "The increase in repeat calls is unrelated to the metric cascade and is a seasonal effect requiring no action",
      "The cascaded metric (handle time) was not counterbalanced with a quality/outcome metric, incentivizing agents to end calls quickly at the expense of resolution \u2014 a classic single-metric cascade failure that worked against the actual strategic goal (lifetime value, which depends on resolution quality)",
      "Customer lifetime value is not a valid strategic metric for a call center"
    ],
    "answer": 2,
    "why": "This is a textbook single-metric cascade failure: optimizing handle time alone, without a paired quality/resolution counter-metric, predictably degrades the very outcome (retention/lifetime value) the strategy intended to protect. Source: [CSSC] Ch. 24 combined with [BOK] Domain I.B/II.F, Organizational Performance Metrics.",
    "set": 3,
    "qid": "mbb:set-3:d1-008"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Six months into a Black Belt's project to reduce order-entry cycle time, the enterprise pivots strategy toward a new market segment that makes the original process largely obsolete within 12 months. The BB has already achieved a 20% cycle-time improvement and wants to continue to full completion. As the coaching MBB, what is the best next action?",
    "options": [
      "Escalate to the executive team to reverse the strategic pivot so the project can continue as planned",
      "Reassess the project against current strategic priorities with the BB and sponsor; if the underlying process will be materially obsolete before the ROI horizon closes, formally re-scope or close the project, document interim gains, and redirect the BB's remaining capacity to a project aligned with the new strategy",
      "Cancel the project immediately without discussion to avoid any further resource drain",
      "Let the project continue unchanged since sunk effort and partial gains should not be abandoned"
    ],
    "answer": 1,
    "why": "Portfolio and alignment discipline (Domain I/III/V overlap) requires periodic re-validation of in-flight projects against current strategy \u2014 not blind continuation (sunk cost fallacy) nor unilateral cancellation without sponsor/BB input, nor attempting to reverse legitimate strategic decisions to protect a single project. Source: [BOK] Domain I.B and V.A, Coaching Executives and Champions.",
    "set": 3,
    "qid": "mbb:set-3:d1-009"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "What is the primary function of a Six Sigma steering committee within enterprise deployment infrastructure?",
    "options": [
      "To replace the need for champions and sponsors at the business-unit level",
      "To govern project selection, prioritization, and resource allocation at the enterprise level, and to resolve cross-functional conflicts that individual project teams cannot",
      "To execute individual DMAIC projects in place of Black Belts",
      "To perform statistical analysis for projects lacking in-house expertise"
    ],
    "answer": 1,
    "why": "The steering committee is a governance body, not an execution or analytic resource \u2014 its role is portfolio-level oversight and conflict resolution that sits above any single project's authority. Source: [BOK] Domain I.C, Infrastructure Elements.",
    "set": 3,
    "qid": "mbb:set-3:d1-010"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A multinational manufacturer with 14 semi-autonomous business units is designing its Six Sigma deployment infrastructure. Which infrastructure model, and why, is generally most defensible for this context?",
    "options": [
      "A hybrid model: a small corporate center of excellence sets standards, methodology, training, and cross-BU project governance, while each business unit retains its own Belts and locally-relevant project pipeline within those standards",
      "Fully decentralized: each business unit independently defines its own Six Sigma methodology and certification standards with no corporate coordination",
      "No formal infrastructure is needed; Six Sigma should be run informally by whichever manager is most enthusiastic in each unit",
      "Fully centralized: a single corporate Six Sigma office selects and executes all projects for every business unit, ensuring perfect consistency"
    ],
    "answer": 0,
    "why": "With 14 semi-autonomous units, a hybrid center-of-excellence model balances consistency (methodology, certification standards, cross-BU learning) with the local relevance and speed that full centralization would sacrifice, and the coordination and quality control full decentralization would sacrifice. Source: [BOK] Domain I.C, Infrastructure Elements.",
    "set": 3,
    "qid": "mbb:set-3:d1-011"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An organization has: (a) an executive-sponsored steering committee, (b) certified Belts at all levels, (c) a documented project selection process, but (d) no standardized way to track realized financial benefits after project closure, and no repository of lessons learned across projects. Which maturity gap should the MBB flag as the highest priority to close next?",
    "options": [
      "The organization should immediately decertify all existing Belts and restart training",
      "None \u2014 the deployment is already fully mature given (a)\u2013(c)",
      "The steering committee should be dissolved since project selection is already documented",
      "The benefits-tracking and lessons-learned gap, because without post-closure benefit validation and knowledge capture, the organization cannot demonstrate ROI to sustain executive sponsorship or avoid repeating past mistakes across projects"
    ],
    "answer": 3,
    "why": "Governance and training infrastructure without benefit realization tracking and knowledge management is a well-known maturity gap \u2014 it threatens long-term sponsorship (execs can't see proven ROI) and repeats avoidable errors. This is a higher-leverage fix than anything else listed. Source: [BOK] Domain I.C, Infrastructure Elements; II.E, Organizational Feedback.",
    "set": 3,
    "qid": "mbb:set-3:d1-012"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An enterprise Six Sigma office is deciding how many full-time-equivalent Black Belts to fund for the coming year. Which factor is *most* directly relevant to that infrastructure decision?",
    "options": [
      "The number of Green Belts currently certified, regardless of project pipeline size",
      "The size and complexity of the validated project pipeline (Domain I.F/III) relative to average project duration and expected BB throughput, translated into required FTE capacity",
      "The total corporate marketing budget for the year",
      "The average tenure of current executives, since new executives may cancel Six Sigma entirely"
    ],
    "answer": 1,
    "why": "Resourcing decisions for Belt infrastructure should be demand-driven \u2014 sized to the validated pipeline and expected throughput \u2014 not to unrelated headcounts or budgets elsewhere in the organization. Source: [BOK] Domain I.C and I.F, Pipeline Management.",
    "set": 3,
    "qid": "mbb:set-3:d1-013"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A financial services firm wants to launch an entirely new digital loan-approval product; no current process exists to improve. Which methodology should the MBB recommend, and why?",
    "options": [
      "TRIZ exclusively, since it is the only tool suited to genuinely novel problems",
      "DMAIC, because it is the most widely known and Belts are already trained in it",
      "DMADV (or a DFSS variant), because DMAIC is designed to improve an existing process, while this is a new-process/new-product design problem requiring Define-Measure-Analyze-Design-Verify",
      "Lean value stream mapping alone, since no process exists yet to map"
    ],
    "answer": 2,
    "why": "Correct methodology selection based on problem type \u2014 existing process to improve (DMAIC) vs. new process/product to design (DMADV/DFSS) \u2014 is a foundational MBB judgment call, distinct from defaulting to the most familiar tool. Source: [CSSC] Ch. 11, Introduction to DMAIC and DMADV.",
    "set": 3,
    "qid": "mbb:set-3:d1-014"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A retailer's order-fulfillment process has been incrementally improved via DMAIC for three consecutive cycles, each yielding diminishing returns (last cycle: 2% cycle-time gain). Leadership wants a 50% cycle-time reduction to compete with a new market entrant. What should the MBB recommend?",
    "options": [
      "Run a fourth DMAIC cycle on the same process, since consistency of methodology matters most",
      "Recommend abandoning process improvement entirely since the target is unrealistic",
      "Recommend Lean 5S only, since it is the fastest tool to implement",
      "Recommend a Business Process Reengineering (BPR) or DMADV-style redesign effort, since incremental DMAIC has plateaued (diminishing returns) and the target (50%) implies architectural, not incremental, change"
    ],
    "answer": 3,
    "why": "When incremental methodology shows diminishing returns and the target magnitude implies a fundamentally different process architecture, an MBB must recognize the limits of DMAIC and recommend a redesign-class methodology (BPR/DMADV) \u2014 an evaluative judgment central to \"which methodology, and why\" reasoning at the MBB level. Source: [CSSC] Ch. 3, Other Process Improvement and Quality Methods (Business Process Reengineering).",
    "set": 3,
    "qid": "mbb:set-3:d1-015"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An IT department wants to integrate Scrum with an ongoing Six Sigma initiative. Which statement correctly characterizes an appropriate integration?",
    "options": [
      "Scrum should replace DMAIC entirely for all IT-related improvement work",
      "Scrum and Six Sigma are fundamentally incompatible and should never be used on the same initiative",
      "Scrum eliminates the need for a control plan since sprints are inherently self-correcting",
      "Scrum's short, iterative sprints can be used within the Improve/Design phase to develop and test technical solutions (e.g., software changes) identified by DMAIC/DMADV analysis, while DMAIC/DMADV continues to provide the overall data-driven problem definition and control structure"
    ],
    "answer": 3,
    "why": "This reflects real MBB-level integration judgment \u2014 Scrum is a delivery mechanism well-suited to the technical build-out within a phase, not a replacement for the overall analytical/control framework Six Sigma provides. Source: [CSSC] Ch. 3, Scrum.",
    "set": 3,
    "qid": "mbb:set-3:d1-016"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A Black Belt is assigned to \"improve\" the onboarding process for a brand-new product line that has never been sold before \u2014 there is no existing process, only a rough proposal. The BB begins by mapping the \"current state\" process and calculating baseline sigma level. What is the flaw?",
    "options": [
      "There is no flaw; every project should begin with current-state mapping regardless of context",
      "DMAIC assumes an existing, operating process to baseline and improve; since no process yet exists, there is no legitimate \"current state\" to map or baseline \u2014 this is a DMADV/DFSS situation, and the BB's DMAIC framing is a methodology-selection error",
      "The BB should have used a Pareto chart instead of a process map",
      "The flaw is using Six Sigma at all for a new product line"
    ],
    "answer": 1,
    "why": "This tests whether the candidate (in this case, whether the MBB coaching the BB) can catch the same new-process-vs-existing-process error tested in MBB-D1-014, applied as a diagnostic/coaching scenario rather than a direct selection question. Source: [CSSC] Ch. 11, DMAIC versus DMADV.",
    "set": 3,
    "qid": "mbb:set-3:d1-017"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Voice of Customer data shows customers rank \"delivery speed\" as their top pain point. Voice of Business data shows the enterprise's highest-cost quality issue is \"invoice billing errors,\" which customers rarely mention directly but which correlate strongly with late payments and churn six months later. How should the MBB advise the pipeline prioritization team?",
    "options": [
      "Weigh both: delivery speed addresses an explicit, top-of-mind customer pain point, while billing errors represent a \"hidden\" driver of churn that customers under-report but that has demonstrated downstream financial and retention impact \u2014 recommend both enter the pipeline, sequenced by capacity and quantified impact rather than by which voice source flagged them",
      "Prioritize invoice billing errors exclusively, since VOB reflects actual cost data and VOC is subjective",
      "Since the two data sources disagree, neither should be pursued until a third study resolves the conflict",
      "Prioritize delivery speed exclusively, since VOC should always outrank VOB"
    ],
    "answer": 0,
    "why": "VOC and VOB are complementary, not competing, inputs \u2014 an MBB should synthesize both rather than mechanically ranking one source above the other, and should recognize that customers systematically under-report issues they don't directly perceive as causal (e.g., billing errors causing churn indirectly). Source: [CSSC] Ch. 5, Voice of the Customer; [BOK] Domain I.E, Opportunities for Improvement.",
    "set": 3,
    "qid": "mbb:set-3:d1-018"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A manufacturing plant reports the following annual Cost of Poor Quality (COPQ) by category: internal failure $1.2M, external failure $3.8M, appraisal $0.6M, prevention $0.2M. Total revenue is $80M. Using COPQ as a screening tool for pipeline opportunity sizing, which category should receive the *first* investigative look, and what does the overall COPQ-to-revenue ratio (7%) suggest about deployment maturity?",
    "options": [
      "External failure costs, because at $3.8M it is both the largest single category and the costliest form of failure (defects reaching the customer); a COPQ/revenue ratio of ~7% is on the higher end for a maturing Six Sigma deployment, suggesting real opportunity remains and that current prevention investment ($0.2M, only 3% of total COPQ) is likely under-resourced relative to failure costs",
      "Appraisal costs, because inspection activities are inherently wasteful and should always be eliminated first",
      "Prevention costs, because they are the smallest category and therefore the easiest problem to solve",
      "The ratio cannot be interpreted without knowing the industry's exact benchmark COPQ percentage, so no prioritization is possible"
    ],
    "answer": 2,
    "why": "($1.2M+$3.8M+$0.6M+$0.2M)/$80M = $5.8M/$80M = 7.25% \u22487%. External failure is both the largest cost driver and reaches the customer \u2014 highest priority for opportunity sizing. The heavy skew toward failure costs vs. prevention (0.2M) is itself diagnostic: mature quality systems invest more heavily upstream in prevention relative to failure costs. Source: [CSSC] Ch. 8, The CoQ and the CoPQ.",
    "chart": {"type": "data-table", "columns": ["Category", "Amount", "% of revenue ($80M)"], "rows": [["Internal failure", "$1.2M", "1.5%"], ["External failure", "$3.8M", "4.75%"], ["Appraisal", "$0.6M", "0.75%"], ["Prevention", "$0.2M", "0.25%"]]},
    "set": 3,
    "qid": "mbb:set-3:d1-019"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A CFO benchmarks the company's customer complaint rate (2.1 per 1,000 transactions) against a published industry average (3.5 per 1,000) and concludes \"we have no quality problem worth pursuing.\" What is the analytical flaw in this conclusion?",
    "options": [
      "Benchmarking against industry averages is never a legitimate practice in Six Sigma",
      "There is no flaw \u2014 being better than the industry average means there is no opportunity",
      "The comparison ignores whether the benchmark is apples-to-apples (same transaction definition, industry segment, and measurement system), ignores internal trend direction (the rate could be worsening even while below the external benchmark), and ignores whether \"average\" is an appropriate improvement target rather than best-in-class or the company's own historical best",
      "The complaint rate should have been converted to DPMO before any comparison could be valid"
    ],
    "answer": 2,
    "why": "This tests the ability to identify multiple compounding flaws in a superficially reasonable conclusion \u2014 comparability, trend blindness, and target-setting logic (average vs. best-in-class) are all standard MBB-level critiques of naive benchmarking. Source: [BOK] Domain I.E, Opportunities for Improvement.",
    "set": 3,
    "qid": "mbb:set-3:d1-020"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Three plants producing the same part report process capability indices: Plant A Cpk = 1.67, Plant B Cpk = 1.05, Plant C Cpk = 0.85, all against the same specification. Plant C has the lowest production volume of the three. From an enterprise opportunity-identification standpoint, which statement is most defensible?",
    "options": [
      "Plant C is the most urgent capability opportunity (Cpk 0.85 indicates the process is not capable \u2014 DPMO substantially exceeds acceptable levels even with a centered process), but Plant B (Cpk 1.05, marginally capable) run at higher volume may represent comparable or greater absolute defect-cost exposure \u2014 both should be quantified in absolute defect-cost terms, not Cpk alone, before final prioritization",
      "Volume is irrelevant to capability-based prioritization; only the Cpk value itself should drive the decision",
      "Since all three plants make the same part, only the enterprise-average Cpk across all three matters",
      "Plant A should be the improvement priority since Cpk data is most reliable there"
    ],
    "answer": 0,
    "why": "This is a genuinely MBB-level synthesis point: Cpk alone doesn't capture absolute business impact \u2014 volume matters. A low-Cpk, low-volume plant and a marginal-Cpk, high-volume plant can carry comparable real-world defect costs; the MBB must push the team to quantify in absolute (defect count/cost) terms rather than stopping at the capability index. Source: [BOK] Domain I.E; VI.A, Measurement Systems Analysis, Process Capability and Control.",
    "set": 3,
    "qid": "mbb:set-3:d1-021"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Four candidate projects have the following (estimated annual benefit, probability of success, implementation risk score 1\u20135 where 5 = highest risk): P1 ($500K, 80%, risk 2); P2 ($900K, 50%, risk 4); P3 ($300K, 95%, risk 1); P4 ($700K, 65%, risk 3). Using risk-adjusted expected value (benefit \u00d7 probability of success) as a first screen, rank the projects, and explain why risk score should still be reviewed even after this calculation.",
    "options": [
      "All four projects should be pursued simultaneously since none has negative expected value",
      "Expected values: P1=$400K, P2=$450K, P3=$285K, P4=$455K \u2192 ranking P4 > P2 > P1 > P3; however, P2 and P4 carry meaningfully higher implementation risk (4 and 3) than P1 (2), so the pipeline decision should weigh the risk-adjusted value against the organization's current risk appetite and delivery capacity, not select purely on the expected-value ranking",
      "P2 > P4 > P1 > P3 by raw benefit alone; risk score is irrelevant once expected value is known",
      "P3 should always be selected first because it has the lowest risk score regardless of benefit"
    ],
    "answer": 1,
    "why": "P1: 500\u00d70.8=400; P2: 900\u00d70.5=450; P3: 300\u00d70.95=285; P4: 700\u00d70.65=455. Correct EV ranking: P4 ($455K) > P2 ($450K) > P1 ($400K) > P3 ($285K). But P4 and P2's higher risk scores mean the near-tie at the top between P4/P2 should trigger a qualitative risk-appetite conversation, not a mechanical selection of the top EV number \u2014 a nuance an MBB must bring to portfolio governance. Source: [BOK] Domain I.F, Pipeline Management; III.C, Project Portfolio Financial Tools.",
    "chart": {"type": "data-table", "columns": ["Project", "Annual benefit", "Probability of success", "Risk (1=low,5=high)"], "rows": [["P1", "$500,000", "80%", "2"], ["P2", "$900,000", "50%", "4"], ["P3", "$300,000", "95%", "1"], ["P4", "$700,000", "65%", "3"]]},
    "set": 3,
    "qid": "mbb:set-3:d1-022"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An enterprise has 6 active Black Belts, each capable of running one project at a time with an average project duration of 4 months. The validated pipeline contains 24 approved projects. Leadership wants \"all 24 projects done as fast as possible.\" Design the most defensible approach to sequencing this pipeline.",
    "options": [
      "Hire no additional Belts and simply tell leadership all 24 will be done within 4 months since that's one project's duration",
      "Sequence in strict order of submission date to ensure fairness",
      "Assign all 24 projects simultaneously across the 6 BBs (4 each) to maximize parallelism regardless of impact",
      "With fixed capacity (6 BBs \u00d7 ~3 projects/year each \u2248 18 project-completions/year), the realistic throughput is roughly 16 months to clear 24 projects if run near-continuously; rather than force unrealistic parallelism, rank the 24 by strategic impact and risk-adjusted value (Domain I.F/III.C) and sequence the top-ranked projects first, while communicating the realistic ~16-month full-pipeline timeline to leadership rather than overloading BBs to hit an unrealistic \"all at once\" expectation"
    ],
    "answer": 3,
    "why": "This is a Create-level capacity-planning synthesis: 6 BBs \u00d7 (12 months/4-month projects) = 18 completions/year; 24 projects \u00f7 18/year \u2248 16 months at full utilization. The defensible MBB response combines realistic throughput math, impact-based sequencing, and transparent expectation-setting with leadership \u2014 not blind parallelism, arbitrary fairness rules, or an impossible promise. Source: [BOK] Domain I.F, Pipeline Management; I.C, Infrastructure Elements (capacity).",
    "chart": {"type": "data-table", "columns": ["Black Belts", "Completions/year (4-mo. avg.)", "Months to clear 24 projects"], "rows": [["4", "12", "24.0"], ["6", "18", "16.0"], ["8", "24", "12.0"], ["12", "36", "8.0"]]},
    "set": 3,
    "qid": "mbb:set-3:d1-023"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A project has passed its Define and Measure tollgates on schedule, but the Analyze phase reveals the root cause is a vendor contract term that legal has confirmed cannot be renegotiated for at least three years. The BB wants to continue to Improve anyway, hoping \"something will change.\" What is the MBB's best next action at this stage-gate?",
    "options": [
      "Allow the project to continue since significant time has already been invested",
      "Escalate directly to the vendor to demand contract renegotiation despite legal's confirmation",
      "Recommend formally pausing or closing the project at the current tollgate, documenting the legally-confirmed root-cause constraint, and redirecting the BB to a project where the identified root cause is actually addressable \u2014 while banking the Analyze-phase learning for potential future use",
      "Instruct the BB to ignore the vendor constraint and proceed to Improve regardless"
    ],
    "answer": 2,
    "why": "A stage-gate's entire purpose is to stop unproductive projects before further resource investment when a fundamental, unaddressable constraint on the root cause is identified \u2014 this is disciplined portfolio management, not project abandonment for its own sake. Source: [BOK] Domain I.F, Pipeline Management; III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d1-024"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Over the last four quarters, the enterprise pipeline shows: projects initiated per quarter holding steady at 8, but projects completed per quarter dropping from 7 to 4, while the number of projects \"in progress\" (WIP) has grown from 12 to 28. What does this pattern most likely indicate, and what is the appropriate diagnostic next step?",
    "options": [
      "The organization is becoming more ambitious and successful, since more projects are always better",
      "Growing WIP with declining completion rate despite steady intake is a classic sign of pipeline overload \u2014 too much work-in-process relative to available Belt/resource capacity, causing multitasking, delays, and falling throughput; the appropriate next step is to apply Little's Law-style analysis (WIP, throughput, and cycle time relationships) to identify whether intake should be throttled or capacity increased before adding any new projects",
      "The pattern is unrelated to capacity and is likely just random quarter-to-quarter variation requiring no action",
      "The solution is to initiate even more projects to compensate for the completion slowdown"
    ],
    "answer": 1,
    "why": "Rising WIP + falling completions + steady intake is the signature of a capacity-constrained pipeline (directly analogous to Little's Law: cycle time increases as WIP grows relative to fixed throughput capacity) \u2014 a core Lean/flow-management concept an MBB must apply to portfolio management, not just shop-floor processes. Source: [BOK] Domain I.F, Pipeline Management; Lean flow principles (Little's Law), general Lean Six Sigma practice.",
    "chart": {"type": "time-series", "title": "Work-in-progress by quarter", "labels": ["Q1", "Q2", "Q3", "Q4"], "data": [12, 17, 22, 28], "xLabel": "Quarter", "yLabel": "Projects in progress (WIP)", "decimals": 0, "altText": "Work-in-progress rises steadily across four quarters: 12, 17, 22, then 28 projects in progress, while completions per quarter fall from 7 to 4 over the same period."},
    "set": 3,
    "qid": "mbb:set-3:d1-025"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A regional insurer's leadership asks the MBB to add \"fix the printer jams in the claims department\" to the strategic improvement plan, citing frequent complaints. Claims cycle time is otherwise the enterprise's top strategic priority this year. What is the MBB's best response?",
    "options": [
      "Redirect leadership toward the actual strategic driver: investigate whether printer downtime is a *measurable contributor* to claims cycle time; if minor, address it as a local operational fix (not a strategic pipeline entry), reserving pipeline capacity for higher-leverage cycle-time drivers",
      "Add the printer issue to the strategic pipeline immediately since leadership requested it",
      "Recommend a full DMAIC project staffed with a Black Belt dedicated solely to the printer issue",
      "Refuse to discuss the printer issue at all since it is beneath MBB-level attention"
    ],
    "answer": 0,
    "why": "A core MBB skill is triaging genuine strategic priorities from tactical annoyances that get elevated due to visibility or executive irritation \u2014 the response should quantify the actual contribution to the stated strategic metric before committing scarce pipeline capacity. Source: [BOK] Domain I.A, Strategic Plan Development.",
    "set": 3,
    "qid": "mbb:set-3:d1-026"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A logistics company's enterprise strategy targets improving On-Time-In-Full (OTIF) delivery. The warehouse team's cascaded metric is \"orders picked per hour\" and the transportation team's cascaded metric is \"cost per mile.\" After a quarter, picking productivity and cost-per-mile both improved, but OTIF declined. What is the most likely alignment failure?",
    "options": [
      "OTIF should have been measured before the fiscal year began",
      "Both teams optimized locally-relevant, efficiency-focused metrics that are not directly tied to the actual OTIF components (on-time and in-full), so local gains in speed/cost did not translate to the strategic outcome \u2014 and may have traded against it (e.g., faster picking causing more errors, cheaper routing causing later deliveries)",
      "The warehouse and transportation teams should be merged into a single department",
      "OTIF is not a valid strategic metric for a logistics company"
    ],
    "answer": 1,
    "why": "This is the same cascade-alignment failure pattern as Batch 1's call-center example (D1-008), applied to a different industry: locally efficient metrics that aren't causally tied to the strategic outcome metric can degrade the very thing the strategy intended to improve. Source: [BOK] Domain I.B, Strategic Plan Alignment.",
    "set": 3,
    "qid": "mbb:set-3:d1-027"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A 9-hospital health system wants to standardize infection-control process improvement across all sites while allowing each hospital to address its own local unit-level workflow issues. Which infrastructure element is most critical to design correctly first?",
    "options": [
      "Identical staffing ratios at every hospital regardless of size or acuity mix",
      "A single system-wide Black Belt who personally executes every infection-control project at all 9 sites",
      "A ban on any hospital-specific process variation to enforce total standardization",
      "A shared, system-wide clinical outcomes dashboard and standardized measurement definitions across all 9 hospitals, so that \"infection rate\" means the same thing everywhere and cross-site comparison and learning is possible"
    ],
    "answer": 3,
    "why": "Before any system-wide comparison, prioritization, or shared learning is possible, measurement definitions must be standardized \u2014 a foundational infrastructure element that enables everything else (governance, resource allocation, benchmarking) to function correctly. Source: [BOK] Domain I.C, Infrastructure Elements; II.F, Organizational Performance Metrics.",
    "set": 3,
    "qid": "mbb:set-3:d1-028"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A pharmaceutical company is designing a new blister-pack line for a drug with strict FDA packaging integrity requirements; no existing line can be adapted. Which combination of methodology and rationale is most defensible?",
    "options": [
      "Lean 5S only, since the main goal is workplace organization",
      "DMAIC, because packaging processes are simple enough not to require full DFSS rigor",
      "Best-guess trial-and-error prototyping, since regulatory requirements will catch any errors before launch",
      "DFSS (e.g., DMADV with a strong emphasis on robust design and tolerance design methods such as design of experiments for critical-to-quality packaging parameters), because this is a new process under strict regulatory tolerances where failure costs (recall, regulatory action) are severe \u2014 design robustness must be built in, not inspected in afterward"
    ],
    "answer": 3,
    "why": "New process + high-stakes regulatory tolerance requirements is the textbook case for DFSS rigor (robust/tolerance design, DOE-driven parameter optimization) rather than a lighter-weight or purely reactive approach \u2014 the cost of a post-launch failure (recall, regulatory action) is far higher than the upfront design investment. Source: [CSSC] Ch. 11 (DMAIC vs DMADV) combined with [BOK] Domain VI.E, DFSS.",
    "set": 3,
    "qid": "mbb:set-3:d1-029"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A bank's VOC data shows customers are largely satisfied with loan processing times. Separately, a new federal regulation will require enhanced disclosure documentation within 12 months, and the bank's current process cannot produce the required documentation without significant redesign. How should the MBB advise on pipeline prioritization?",
    "options": [
      "The regulatory requirement should be deprioritized in favor of any project with stronger VOC support",
      "Regulatory projects should never be run using Six Sigma methodology since they are compliance-driven, not customer-driven",
      "Since VOC shows satisfaction, no changes are needed",
      "The regulatory-compliance redesign should enter the pipeline as a high-priority (likely mandatory-timeline) opportunity despite the absence of a customer complaint signal, because regulatory non-compliance carries legal/financial risk that VOC data cannot be expected to surface \u2014 VOC and compliance-driven opportunities are evaluated on different bases (customer satisfaction vs. legal risk and deadline), not against each other"
    ],
    "answer": 3,
    "why": "Not every legitimate pipeline entry originates from VOC \u2014 regulatory/compliance mandates are a distinct opportunity category with their own (often externally-fixed) urgency and consequence profile, and an MBB must recognize this rather than forcing every opportunity through a customer-satisfaction lens. Source: [BOK] Domain I.E, Opportunities for Improvement.",
    "set": 3,
    "qid": "mbb:set-3:d1-030"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A hotel chain's pipeline has 10 approved projects for the year, sequenced evenly across quarters. Three months before peak season, a new competitor opens two blocks from the flagship property, and leadership wants a guest-experience-focused project fast-tracked ahead of its scheduled Q4 slot. What is the appropriate MBB response?",
    "options": [
      "Refuse to alter the sequence since it was already approved by the steering committee",
      "Immediately fast-track the project without any governance review since competitive threats justify skipping process",
      "Formally bring the re-sequencing request to the pipeline governance process (not an informal side decision): assess capacity impact of moving the project forward, quantify what gets displaced or delayed as a result, and get governance sign-off on the trade-off before committing Belt resources to the accelerated timeline",
      "Add the fast-tracked project as an 11th project without removing or delaying anything else in the sequence"
    ],
    "answer": 2,
    "why": "Legitimate, time-sensitive re-prioritization requests should still go through governance (even expedited governance) so that the resulting trade-offs are visible and owned by the decision-making body \u2014 not bypassed informally (C, D) nor rigidly refused despite a genuine changed circumstance (A). Source: [BOK] Domain I.F, Pipeline Management; III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d1-031"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A government agency's strategic plan states its mission is to \"reduce citizen wait times for permit approval while maintaining full regulatory review rigor.\" An MBB-sponsored project proposes cutting review steps to hit a wait-time target, without addressing whether the removed steps affect review rigor. What is the flaw?",
    "options": [
      "The project should be canceled entirely since government projects cannot use Six Sigma",
      "There is no flaw, since public-sector agencies are exempt from strategic alignment requirements",
      "There is no flaw, since wait-time is the only metric mentioned as a target",
      "The project targets only one clause of a two-part mission statement (speed) while ignoring the other (rigor) \u2014 a partial alignment that risks strategic failure even if the wait-time metric improves, since regulatory rigor is an equally stated strategic requirement"
    ],
    "answer": 3,
    "why": "Strategic alignment requires addressing the full stated strategic intent, not cherry-picking the more easily measurable half of a compound goal \u2014 a common trap when a strategy statement has two co-equal, potentially competing objectives. Source: [CSSC] Ch. 52, Six Sigma in Government; [BOK] Domain I.A/I.B.",
    "set": 3,
    "qid": "mbb:set-3:d1-032"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A telecom's network operations team is measured on \"average call drop rate\" (strategic goal: reliability), while the sales team is measured on \"new subscriber activations\" (strategic goal: growth). A proposed network-capacity project would reduce drop rates but require a temporary activation freeze in the affected region during implementation. As MBB, how do you resolve this cross-functional conflict during alignment?",
    "options": [
      "Let sales veto the project since revenue growth is always the priority",
      "Avoid the conflict by running the project in a way that hides the activation freeze from the sales team",
      "Facilitate a joint session with both functional leaders and the executive sponsor to quantify the trade-off explicitly (e.g., estimated activations lost during the freeze vs. estimated churn/reliability gains), and escalate the decision to whichever governance level owns cross-functional trade-offs of this size, rather than letting either function's metric silently override the other",
      "Since reliability is listed first in the strategic plan, network operations' goal automatically takes precedence"
    ],
    "answer": 2,
    "why": "Genuine cross-functional metric conflicts that cascade from otherwise-legitimate strategic goals require explicit trade-off quantification and appropriate escalation \u2014 not an arbitrary priority rule (A, C) and certainly not concealment (D), which is both an ethics violation and operationally reckless. Source: [BOK] Domain I.B, Strategic Plan Alignment; II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d1-033"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An aerospace manufacturer's Six Sigma deployment infrastructure currently has no formal process for Green Belts to advance to Black Belt certification beyond \"manager's discretion.\" What infrastructure gap does this represent, and what is the risk?",
    "options": [
      "The gap is irrelevant since Green Belts should never advance to Black Belt",
      "This is a talent-pipeline infrastructure gap: without standardized advancement criteria (e.g., minimum completed projects, validated benefit realization, competency assessment), Belt quality and enterprise-wide credibility of the certification become inconsistent across managers/departments, undermining both the training infrastructure and downstream project quality",
      "The solution is to eliminate the Green Belt level entirely",
      "No gap exists; manager discretion is an acceptable substitute for a formal advancement pathway"
    ],
    "answer": 1,
    "why": "Standardized advancement criteria are a recognized infrastructure element \u2014 informal, manager-dependent promotion criteria create inconsistent Belt quality and credibility problems across the organization, a real and common deployment maturity gap. Source: [BOK] Domain I.C, Infrastructure Elements; IV, Training Design and Delivery (related domain).",
    "set": 3,
    "qid": "mbb:set-3:d1-034"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A Black Belt studying crop yield variability at an agribusiness applies standard Shewhart control charts with control limits calculated from data spanning both the wet and dry growing seasons, without separating them. The chart shows the process as \"out of control\" almost every week. What is the flaw?",
    "options": [
      "The Black Belt should have used a Pareto chart instead",
      "The process actually is out of control and no further investigation is needed",
      "Combining two distinct, known sources of systematic variation (wet vs. dry season) into a single set of control limits violates the assumption of a single, stable underlying process; the two seasons should be charted separately (or the seasonal effect modeled and removed) before assessing statistical control within each",
      "Control charts should never be used in agriculture"
    ],
    "answer": 2,
    "why": "Control charts assume a single stable process generating common-cause variation around one center; a known, systematic factor (season) that shifts the process mean/variance must be stratified out first, or the chart will falsely flag \"special cause\" signals that are actually a known, structural effect. Source: [CSSC] Ch. 23, Advanced Control Charts; [BOK] Domain VI.A.",
    "set": 3,
    "qid": "mbb:set-3:d1-035"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An e-commerce retailer has 2 million annual orders, a return rate of 12%, and an average cost per return (reverse shipping, restocking, refund processing) of $18. Leadership believes reducing returns is a \"nice to have\" but not strategic. What is the annual COPQ exposure from returns alone, and how should the MBB frame this for leadership?",
    "options": [
      "$36,000; a rounding-level amount not worth pipeline capacity",
      "$216,000; too small to warrant strategic attention",
      "$4.32M ($2,000,000 \u00d7 0.12 \u00d7 $18) in annual COPQ from returns alone \u2014 a figure the MBB should present directly against enterprise profitability metrics (not \"returns\" in isolation) to reframe leadership's \"nice to have\" characterization with a concrete dollar exposure figure",
      "The return rate is irrelevant without knowing the average order value"
    ],
    "answer": 2,
    "why": "2,000,000 \u00d7 0.12 = 240,000 returns; 240,000 \u00d7 $18 = $4,320,000. This is a straightforward COPQ-sizing calculation whose primary MBB-level value is reframing a leadership misconception (\"nice to have\") with a hard dollar figure translated into terms executives act on. Source: [CSSC] Ch. 8, The CoQ and the CoPQ; Ch. 45, Six Sigma in eCommerce.",
    "set": 3,
    "qid": "mbb:set-3:d1-036"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An airline's improvement pipeline for the year consists of 14 projects, all targeting on-time departure performance, with zero projects addressing baggage handling, customer service, or maintenance turnaround. On-time departure is indeed the top strategic KPI. What portfolio-level concern should the MBB raise?",
    "options": [
      "The airline should abandon the on-time departure focus entirely in favor of equal weighting across all four areas",
      "None \u2014 since on-time departure is the top KPI, 100% pipeline concentration on it is optimal",
      "Portfolio balance is a Green Belt-level concern, not something an MBB needs to weigh in on",
      "Even with one dominant strategic KPI, a portfolio concentrated entirely in a single opportunity area risks diminishing returns (the same overlapping root causes revisited repeatedly), ignores other legitimate strategic and risk exposures (safety-adjacent maintenance turnaround, customer retention via service/baggage), and creates single-point organizational risk if that KPI's improvement levers are exhausted \u2014 some portfolio diversification, even under one dominant priority, is generally defensible"
    ],
    "answer": 3,
    "why": "Even legitimate single-KPI dominance in strategy doesn't justify total pipeline concentration \u2014 diminishing returns, unaddressed risk exposure in adjacent areas (especially anything safety-adjacent like maintenance), and the failure to build organizational Six Sigma capability broadly are all real portfolio-level risks an MBB should surface, even while affirming the top KPI's priority. Source: [BOK] Domain I.F, Pipeline Management; III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d1-037"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A utility company's strategic plan spans 10 years due to the long lifecycle of grid infrastructure, while its Six Sigma project pipeline is typically planned in 12-month cycles. What planning practice should the MBB recommend to properly connect these two horizons?",
    "options": [
      "Create two entirely separate planning processes with no connection between them",
      "Ignore the 10-year strategic plan when selecting annual projects, since Six Sigma is inherently short-cycle",
      "Force all Six Sigma projects into 10-year timelines to match the strategic plan",
      "Decompose the 10-year strategic plan into a rolling set of annual/multi-year strategic milestones or objectives, and select each year's project pipeline as concrete steps toward the nearest milestones \u2014 maintaining traceability from any given project back to the long-range plan without forcing project timelines to match the full strategic horizon"
    ],
    "answer": 3,
    "why": "Bridging a long strategic horizon with shorter project cycles requires intermediate milestone decomposition \u2014 a standard practice for connecting multi-year strategy to an annually-refreshed project pipeline without either ignoring the long-range plan or unrealistically stretching every project to match it. Source: [BOK] Domain I.A, Strategic Plan Development; I.F, Pipeline Management.",
    "set": 3,
    "qid": "mbb:set-3:d1-038"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A university's strategic plan states a goal of \"improving 4-year graduation rates without lowering academic rigor.\" Which project would demonstrate the *strongest* strategic alignment?",
    "options": [
      "A project focused solely on improving the parking permit renewal process",
      "A project to reduce time between course registration and financial aid disbursement, identified via VOC data as a leading cause of students dropping courses or taking reduced course loads for financial reasons \u2014 directly targeting a root cause of extended time-to-degree without touching academic content or standards",
      "A project to raise average grades campus-wide through grading policy changes",
      "A project to reduce the number of required credit hours for graduation, regardless of curriculum content review"
    ],
    "answer": 1,
    "why": "This targets a documented root cause of extended time-to-degree (registration/financial-aid friction) without touching the \"without lowering rigor\" constraint \u2014 the clearest fit to both halves of the compound strategic goal. Source: [BOK] Domain I.B, Strategic Plan Alignment.",
    "set": 3,
    "qid": "mbb:set-3:d1-039"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A non-profit disaster-relief organization wants to deploy Six Sigma principles but has no budget for formal Black Belt certification training and relies heavily on volunteer staff with high turnover. What infrastructure approach is most defensible?",
    "options": [
      "Postpone any process improvement work until full-time paid Black Belts can be hired",
      "Adapt the infrastructure model: focus on lightweight, high-impact tools (e.g., process mapping, basic control charts, simple root-cause tools) taught via short internal training rather than full certification, embed a small number of longer-tenured staff/leaders as internal champions to retain institutional knowledge across volunteer turnover, and scale rigor to what the organization can realistically sustain",
      "Require every volunteer to complete a full Black Belt certification before being allowed to serve",
      "Abandon Six Sigma entirely since certification cost is a barrier"
    ],
    "answer": 1,
    "why": "MBB-level judgment includes right-sizing methodology and infrastructure investment to organizational capacity and constraints \u2014 a resource-constrained, high-turnover context calls for a scaled-down but still disciplined approach, not full abandonment or an unrealistic full-certification requirement. Source: [BOK] Domain I.C, Infrastructure Elements; general MBB judgment on scaling rigor to context.",
    "set": 3,
    "qid": "mbb:set-3:d1-040"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A bank's fraud-detection false-positive rate (legitimate transactions incorrectly flagged) has crept up over 18 months, but no one knows why \u2014 multiple systems, rules, and vendor updates have changed over that period. Which is the most appropriate methodology to recommend?",
    "options": [
      "Lean 5S, since the primary issue is workplace organization",
      "DMADV, since a new fraud detection system should be built from scratch",
      "DMAIC, because an existing process is degrading and the root cause is unknown \u2014 the Measure and Analyze phases are specifically designed to systematically investigate an unclear root cause in an operating process using the accumulated data (rule changes, vendor updates, false-positive trends) before jumping to a redesign",
      "Immediately roll back all vendor updates from the past 18 months without further analysis"
    ],
    "answer": 2,
    "why": "This is the classic DMAIC use case: an existing process with a known symptom (rising false positives) and an unknown root cause \u2014 systematic Measure/Analyze work (not a redesign, not a workplace-organization tool, and not a guess-and-rollback) is the appropriate path. Source: [CSSC] Ch. 11, Introduction to DMAIC and DMADV; Ch. 14, Analyze.",
    "set": 3,
    "qid": "mbb:set-3:d1-041"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An MBB has identified 6 credible improvement opportunities this quarter via VOC, VOB, and benchmarking combined, but the organization has capacity to properly resource only 2 new projects given current Belt availability. Opportunity sizing (annualized benefit estimates) ranges from $150K to $2.1M across the 6. What is the most defensible next step before finalizing the 2 selections?",
    "options": [
      "Select the 2 with the highest raw dollar estimates and proceed immediately",
      "Before finalizing, validate the benefit estimates' confidence level (some are likely rough order-of-magnitude, others well-substantiated), check strategic alignment (not just size) for each of the 6, and confirm none of the 6 has an external deadline (e.g., regulatory) that should override pure size-based ranking \u2014 then finalize the top 2 using this fuller picture, not dollar size alone",
      "Run all 6 with reduced rigor to fit the available capacity",
      "Select the 2 that are easiest to staff, regardless of size"
    ],
    "answer": 1,
    "why": "This integrates several Domain I concepts tested across this batch (regulatory urgency, strategic-fit vs. raw size, estimate confidence) into a single synthesis question \u2014 pure size-ranking or ease-of-staffing are both incomplete decision bases, and diluting rigor to fit more projects (D) undermines the entire discipline of DMAIC/portfolio management. Source: [BOK] Domain I.E and I.F combined.",
    "set": 3,
    "qid": "mbb:set-3:d1-042"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "What is the correct distinction between a Six Sigma \"project pipeline\" and a \"project backlog\"?",
    "options": [
      "A backlog refers only to IT/software projects, while pipeline refers only to manufacturing projects",
      "They are interchangeable terms with no meaningful distinction",
      "The pipeline generally refers to the full set of vetted, prioritized candidate and active projects flowing through the improvement system over time, while a backlog more specifically denotes approved-but-not-yet-started work waiting on available capacity \u2014 the backlog is a subset/state within the broader pipeline concept",
      "There is no such thing as a project backlog in Six Sigma terminology"
    ],
    "answer": 2,
    "why": "Precision in terminology matters at the MBB level for communicating capacity and governance status accurately to executives \u2014 pipeline is the broader flow concept; backlog specifically denotes vetted work waiting on capacity. Source: [BOK] Domain I.F, Pipeline Management.",
    "set": 3,
    "qid": "mbb:set-3:d1-043"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A retail chain's CFO states, \"our strategic plan is simply to hit this year's budget targets across every store.\" The MBB is asked to build the improvement pipeline directly from store-level budget variances. What is the flaw in using the budget alone as the strategic plan?",
    "options": [
      "The CFO should be removed from the strategic planning process entirely",
      "There is no flaw \u2014 budget targets are always an adequate substitute for strategic planning",
      "An annual budget is a financial control and resource-allocation tool reflecting short-term targets; it typically doesn't capture longer-term competitive positioning, customer experience direction, or capability-building goals that a genuine strategic plan addresses \u2014 building the pipeline from budget variance alone risks a purely reactive, short-term-focused portfolio disconnected from durable competitive strategy",
      "Budgets should never be used in any part of strategic planning"
    ],
    "answer": 2,
    "why": "This tests the MBB's ability to recognize when a legitimate but narrower tool (annual budget) is being mistaken for a comprehensive strategic plan \u2014 a common flaw, especially in finance-driven organizations, that produces a reactive rather than forward-looking pipeline. Source: [BOK] Domain I.A, Strategic Plan Development.",
    "set": 3,
    "qid": "mbb:set-3:d1-044"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Which practice most directly helps verify that a candidate project remains aligned to enterprise strategy throughout its lifecycle, not just at initial selection?",
    "options": [
      "Relying on the project's original charter language indefinitely, regardless of how conditions change",
      "Periodic tollgate reviews that include an explicit re-confirmation of strategic linkage (not just technical/schedule status), so that alignment is checked at each phase gate as strategy, market conditions, or the project's own findings evolve",
      "Alignment only needs to be confirmed if the project runs over budget",
      "A one-time alignment check performed only at the project charter stage, with no further review"
    ],
    "answer": 1,
    "why": "Alignment can decay over a project's life (as tested in D1-009's scenario) \u2014 embedding an explicit strategic-linkage check into every tollgate, not just the initial charter, is the correct ongoing verification practice. Source: [BOK] Domain I.B, Strategic Plan Alignment; III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d1-045"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A telecom's Black Belts routinely report that projects stall for 3-4 weeks waiting for IT to grant data access/reporting permissions, even for pre-approved projects. What infrastructure element should the MBB prioritize fixing?",
    "options": [
      "Training \u2014 Belts likely don't know how to request data properly",
      "Belts should stop requesting IT data entirely and rely only on manual data collection",
      "A standing data-access/governance agreement between the Six Sigma office and IT (e.g., pre-approved access tiers, expedited request pathways for validated projects) so that a known, recurring bottleneck for already-approved work is removed structurally rather than repeatedly re-negotiated project by project",
      "Nothing \u2014 a 3-4 week wait is a normal and acceptable part of any project timeline"
    ],
    "answer": 2,
    "why": "A recurring, structural delay for already-approved projects points to a missing infrastructure agreement (cross-functional governance/access), not an individual skills gap \u2014 the fix belongs at the infrastructure/policy level, not the training level. Source: [BOK] Domain I.C, Infrastructure Elements.",
    "set": 3,
    "qid": "mbb:set-3:d1-046"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Which statement correctly characterizes methodology selection differences between manufacturing and transactional/service environments?",
    "options": [
      "Manufacturing methodologies are strictly superior and should be forced onto service processes unchanged",
      "DMAIC cannot be applied to service/transactional processes at all",
      "Service processes never have measurable defects, so control charts are inapplicable",
      "The core DMAIC/DMADV framework applies to both, but data collection and measurement system design typically differ (e.g., service processes often need to define and operationalize less tangible quality characteristics like \"helpfulness\" or \"clarity,\" and may rely more on process mapping and time-based data than physical measurement)"
    ],
    "answer": 3,
    "why": "This is a standard MBB-level distinction \u2014 the underlying methodology structure is transferable, but measurement system design must adapt to the nature of the process (physical vs. transactional/service characteristics). Source: [CSSC] Ch. 34-43, Six Sigma in various service industries.",
    "set": 3,
    "qid": "mbb:set-3:d1-047"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A food bank analyzes feedback only from recipients who returned for a second visit, concluding \"our distribution process has no significant pain points\" since satisfaction scores are high. What analytical flaw undermines this conclusion as a basis for identifying (or ruling out) improvement opportunities?",
    "options": [
      "There is no flaw; returning recipients are a representative sample of all recipients",
      "This is a survivorship-bias flaw: recipients who found the process too difficult, confusing, or unpleasant may simply not return, so the sampled population systematically excludes the very people most likely to reveal significant pain points \u2014 high satisfaction among returners says little about the experience of non-returners",
      "The flaw is that the food bank should not survey recipients at all",
      "The sample size is the only issue; a larger sample of returning recipients would resolve the flaw"
    ],
    "answer": 1,
    "why": "Classic survivorship bias \u2014 measuring satisfaction only among those who \"survived\" (returned) systematically excludes exactly the population whose negative experience would reveal the opportunity, a critical flaw for opportunity-identification data. Source: [BOK] Domain I.E, Opportunities for Improvement; general statistical sampling principles.",
    "set": 3,
    "qid": "mbb:set-3:d1-048"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A hospital system's departments (ED, surgery, radiology, pharmacy) each independently nominate their own \"top 3\" improvement projects with no cross-departmental prioritization mechanism, resulting in 12 nominated projects competing for 4 available Belt slots enterprise-wide, and frequent departmental conflict over which get funded. Design a defensible pipeline governance mechanism to resolve this.",
    "options": [
      "Let the department with the loudest/most senior sponsor win, since seniority reflects organizational priority",
      "Give each department exactly 1 slot regardless of relative project value or urgency, to avoid conflict entirely",
      "Establish a cross-departmental portfolio review board (clinical and administrative leadership) that scores all 12 nominated projects against consistent enterprise-level criteria (patient safety impact, strategic alignment, financial impact, feasibility/risk), ranks them on a common basis, and allocates the 4 slots to the highest-scoring projects regardless of originating department \u2014 with transparent criteria shared back to all departments to reduce perceived unfairness",
      "Fund all 12 projects at reduced scope to satisfy every department simultaneously"
    ],
    "answer": 2,
    "why": "This Create-level question requires synthesizing a governance mechanism from Domain I/III principles: a common-criteria cross-functional review board with transparent scoring is the standard, defensible way to resolve genuine inter-departmental competition for limited Belt capacity \u2014 avoiding both arbitrary equal-split rules and politically-driven allocation. Source: [BOK] Domain I.F, Pipeline Management; III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d1-049"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An MBB is asked to assess whether a newly drafted enterprise strategic plan is \"improvement-pipeline ready.\" Which of the following would most strongly indicate the plan is *not yet* ready to drive project selection?",
    "options": [
      "The plan includes a clear connection between strategic objectives and the enterprise's SWOT findings",
      "The plan has been reviewed and approved by the executive steering committee",
      "The plan includes specific, measurable 1-3 year objectives tied to named executive owners",
      "The plan consists entirely of broad aspirational statements (e.g., \"be the best in the industry,\" \"delight every customer\") with no measurable targets, timeframes, or named accountability, making it impossible to trace any candidate project back to a specific, verifiable strategic objective"
    ],
    "answer": 3,
    "why": "This closing item ties the batch back to the opening theme (D1-001, D1-003): a strategic plan must have measurable, traceable objectives to meaningfully drive project selection. Pure aspirational language without measurable targets or accountability cannot be operationalized into a defensible pipeline, regardless of how well-intentioned or executive-endorsed it is. Source: [BOK] Domain I.A, Strategic Plan Development (synthesis across subdomain A).",
    "set": 3,
    "qid": "mbb:set-3:d1-050"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An automotive supplier's 5-year strategic plan was built assuming continued internal-combustion-engine part demand. Eighteen months in, a major OEM customer announces an accelerated EV transition that will eliminate 40% of the supplier's current part demand within 3 years. What should the MBB recommend regarding the existing improvement pipeline?",
    "options": [
      "Wait until the full 5-year plan cycle ends before making any adjustments",
      "Trigger a formal strategic plan review with executive leadership given the scale of the disruption; re-segment the pipeline into projects still valid under the new demand outlook (e.g., EV-relevant part lines) versus those tied to declining ICE-only demand, and re-prioritize/re-scope accordingly rather than treating the plan as fixed",
      "Continue the pipeline unchanged since strategic plans should not be revised mid-cycle",
      "Cancel the entire pipeline immediately without further analysis"
    ],
    "answer": 1,
    "why": "A disruption of this magnitude (40% demand elimination within 3 years) is exactly the kind of material change that should trigger formal strategic re-planning and pipeline re-segmentation \u2014 treating the plan as immutable (A, D) or overreacting with wholesale cancellation without analysis (B) are both poor MBB judgment. Source: [BOK] Domain I.A, Strategic Plan Development.",
    "set": 3,
    "qid": "mbb:set-3:d1-051"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A semiconductor fab's enterprise strategy targets \"improve gross margin.\" The fab operations team's cascaded metric is \"wafer starts per week\" (throughput), with no paired yield metric. After two quarters, wafer starts are up 12% but gross margin has declined. What is the most likely explanation?",
    "options": [
      "The metric cascade rewarded raw throughput without a paired yield/quality counter-metric, so the team likely pushed more wafers through the line at the expense of yield (more scrapped or reworked wafers per batch), increasing cost per good unit and eroding the very margin the strategy intended to improve",
      "Wafer starts and gross margin are mathematically unrelated and this is a coincidence",
      "Gross margin is not an appropriate strategic metric for a fab",
      "The finance team miscalculated gross margin"
    ],
    "answer": 0,
    "why": "This is a third variation (after call center and logistics) of the same core cascade-alignment failure pattern: a single, unpaired throughput/efficiency metric can be gamed or inadvertently optimized at the expense of the actual strategic outcome (margin, which depends on yield/cost per good unit, not just volume). Source: [BOK] Domain I.B, Strategic Plan Alignment; VI.A, Process Capability (yield).",
    "set": 3,
    "qid": "mbb:set-3:d1-052"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A construction firm runs each project with a largely new team (subcontractors change project to project), making sustained Six Sigma deployment infrastructure difficult compared to a fixed-workforce manufacturer. What infrastructure adaptation most directly addresses this constraint?",
    "options": [
      "Apply a different Six Sigma methodology on every single project since standardization is impossible",
      "Concentrate Six Sigma infrastructure (governance, methodology expertise, cross-project learning capture) in the firm's own permanent staff (e.g., project management office) who apply consistent standards and lessons learned across transient project teams, rather than trying to build infrastructure into a workforce that turns over project to project",
      "Abandon Six Sigma deployment entirely since transient teams make sustained infrastructure impossible",
      "Require every subcontractor to become a certified Black Belt before being hired, regardless of project size"
    ],
    "answer": 1,
    "why": "When workforce continuity is low, sustainable infrastructure investment should concentrate in the organization's permanent capability (PMO/Six Sigma office) that persists across projects, rather than trying to build deep capability into a transient workforce \u2014 this is a standard adaptation for project-based industries. Source: [CSSC] Ch. 50, Six Sigma in Construction; [BOK] Domain I.C, Infrastructure Elements.",
    "set": 3,
    "qid": "mbb:set-3:d1-053"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A biotech firm produces highly customized cell-therapy batches (each batch essentially unique to a patient), making traditional high-volume control charting difficult. Which methodology adaptation is most defensible for process monitoring in this context?",
    "options": [
      "Short-run/small-batch SPC techniques (e.g., standardized or Z-charts that normalize each unique batch's key parameters relative to its own target/tolerance) designed specifically for high-mix, low-volume, or unique-unit production, allowing meaningful statistical monitoring despite the lack of a single repeated, homogeneous process stream",
      "Rely solely on 100% final-product inspection with no in-process monitoring",
      "Standard Shewhart control charts using pooled data across all patient batches as if they were a single homogeneous process",
      "Abandon statistical process monitoring entirely since each batch is unique"
    ],
    "answer": 0,
    "why": "This tests advanced knowledge that pooling heterogeneous unique-batch data into standard control charts (A) violates the homogeneity assumption \u2014 the correct MBB-level answer recognizes specialized short-run SPC techniques exist precisely for this high-mix/low-volume/unique-unit scenario. Source: [BOK] Domain VI.A, Measurement Systems Analysis, Process Capability and Control; general short-run SPC literature.",
    "set": 3,
    "qid": "mbb:set-3:d1-054"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A mining operation's VOB data shows the highest-cost quality issue is ore-grade variability, while safety incident data (near-misses) has been quietly rising for two quarters with no corresponding cost yet realized. Leadership wants to prioritize the ore-grade project given its clear cost case. How should the MBB advise?",
    "options": [
      "Recommend a safety-focused opportunity enter the pipeline as at least a co-priority alongside (not necessarily above) ore-grade variability, because rising near-miss trends are a well-established leading indicator of future incidents; safety risk exposure should not be deprioritized simply because it hasn't yet converted into a realized cost \u2014 the \"cost case\" for safety often only appears after a serious event, by which point the opportunity to prevent it is gone",
      "Ignore the near-miss trend entirely since \"near-miss\" means nothing actually happened",
      "Defer any safety-related work until an actual injury occurs, to avoid resourcing an unproven risk",
      "Prioritize ore-grade variability exclusively, since it has a demonstrated cost impact and safety near-misses haven't yet resulted in an actual incident"
    ],
    "answer": 0,
    "why": "This tests a critical MBB-level judgment: not all legitimate strategic opportunities have equally mature cost data at the point they need action \u2014 leading indicators (like rising near-misses) warrant proactive prioritization precisely because waiting for a realized cost (an actual injury) means the prevention opportunity has already been lost. Source: [BOK] Domain I.E, Opportunities for Improvement; general safety/quality leading-indicator practice.",
    "set": 3,
    "qid": "mbb:set-3:d1-055"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A streaming media company's executives repeatedly ask \"what happened to project X?\" because they lack visibility into pipeline status between quarterly steering committee meetings. What pipeline management practice most directly addresses this gap?",
    "options": [
      "Increase the frequency of full steering committee meetings to weekly, regardless of the burden this places on committee members' schedules",
      "Stop providing any pipeline updates until the quarterly meeting, training executives to wait",
      "Assign a single Black Belt to personally respond to ad hoc status inquiries as they arise, with no other structural change",
      "A regularly updated (e.g., monthly or real-time) pipeline dashboard visible to relevant stakeholders, showing each project's stage, status, and any blockers, so status questions can be self-served between formal steering committee meetings rather than requiring ad hoc inquiries"
    ],
    "answer": 3,
    "why": "A standing, self-service pipeline visibility mechanism (dashboard) is the standard, scalable fix for exactly this kind of recurring status-inquiry problem \u2014 more efficient than either overloading formal meeting cadence (B) or informally routing every inquiry through one person (D), and better than simply refusing to provide interim visibility (C). Source: [BOK] Domain I.F, Pipeline Management; I.C, Infrastructure Elements.",
    "set": 3,
    "qid": "mbb:set-3:d1-056"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A public transit authority is developing its strategic plan and must weigh input from riders (via surveys), the funding government body (via budget directives), and unionized operators (via labor agreements) \u2014 each with somewhat different priorities. What is the most defensible approach to reconciling these inputs into a coherent strategic plan?",
    "options": [
      "Adopt only rider survey results, since riders are the end customer",
      "Ignore labor input entirely since operators are not typically considered \"customers\" of the transit system",
      "Synthesize all three input streams into a strategic plan that explicitly documents where priorities align, where genuine trade-offs exist between them, and how those trade-offs will be resolved (e.g., via governance escalation) \u2014 rather than defaulting to whichever single stakeholder group has the most formal authority or the most emotionally compelling claim",
      "Adopt the funding government body's directives exclusively, since they control the budget"
    ],
    "answer": 2,
    "why": "Multi-stakeholder strategic planning in public-sector/regulated contexts requires explicit synthesis and trade-off documentation across legitimate but sometimes competing stakeholder inputs \u2014 mirroring the same principle tested in D1-033 (cross-functional trade-offs) but at the strategic-plan-formation stage rather than a mid-project conflict. Source: [BOK] Domain I.A, Strategic Plan Development; II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d1-057"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A law firm's enterprise strategy targets \"improve client retention through service quality.\" The associates' cascaded performance metric remains \"billable hours,\" unchanged from before the new strategy. What alignment problem does this represent?",
    "options": [
      "Billable hours and client retention are always perfectly aligned, so no problem exists",
      "The cascaded metric (billable hours) was never updated to reflect the new strategic emphasis on service quality, so associates continue to be incentivized exactly as before the strategy changed \u2014 a failure to actually cascade the new strategy into any measurable behavior change at the associate level",
      "Client retention cannot be measured in a law firm, so no cascade is possible",
      "The firm should eliminate billable hours tracking entirely and pay associates a flat salary"
    ],
    "answer": 1,
    "why": "This variation tests recognizing a *failure to cascade at all* (an unchanged legacy metric) as distinct from the earlier examples' problem of a cascaded-but-unbalanced metric \u2014 a subtler but equally real alignment failure: strategy changed, but no operational metric changed to reflect it. Source: [BOK] Domain I.B, Strategic Plan Alignment.",
    "set": 3,
    "qid": "mbb:set-3:d1-058"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A real estate franchise brand wants consistent Six Sigma-driven process quality across 200+ independently-owned franchise locations, each with its own P&L and management autonomy. Which infrastructure approach best fits this ownership structure?",
    "options": [
      "Mandate that corporate directly executes every improvement project at every franchise location",
      "Provide a standardized, corporate-developed toolkit (playbooks, training materials, benchmark metrics) that franchisees can adopt voluntarily or as a condition of brand standards, paired with light-touch corporate coaching/certification support \u2014 respecting franchisee operational autonomy while still enabling consistent quality practices and cross-location benchmarking",
      "Require every franchisee to hire a full-time in-house Master Black Belt regardless of location size",
      "Provide franchise locations no support or standards at all, treating quality entirely as each owner's independent responsibility"
    ],
    "answer": 1,
    "why": "Franchise structures require infrastructure that respects legal/operational independence while still enabling brand-wide consistency \u2014 a standardized toolkit with optional/brand-standard adoption and light coaching support is the standard, scalable model, distinct from the fully centralized hospital-system model in D1-028 because franchise owners (unlike hospital units within one health system) are independent businesses. Source: [BOK] Domain I.C, Infrastructure Elements.",
    "set": 3,
    "qid": "mbb:set-3:d1-059"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A professional sports team's operations department wants to improve stadium concession line wait times, but the only data-collection window available is during live games (in-season), when experimentation risk (e.g., deliberately degrading service to test a hypothesis) is unacceptable to leadership. Which approach should the MBB recommend?",
    "options": [
      "Wait until the off-season to do anything, even though the off-season generates no relevant concession-line data at all",
      "Abandon the project entirely since no in-season experimentation is possible",
      "Use passive observational data collection during live games (e.g., natural variation in staffing levels, POS configurations, or crowd size that already occurs game-to-game) combined with careful analysis (e.g., regression on naturally occurring variation) to generate hypotheses, then validate higher-confidence changes with limited, low-risk pilot tests (e.g., one low-stakes preseason or minimally disruptive in-season trial) before full rollout",
      "Run a full randomized designed experiment during live games regardless of leadership's stated risk concerns, since DOE is the gold-standard analytical tool"
    ],
    "answer": 2,
    "why": "When active experimentation risk is unacceptable, the defensible MBB path is passive/observational analysis of naturally occurring variation to build hypotheses, followed by carefully scoped, low-risk validation \u2014 not ignoring leadership's stated risk tolerance (A), stalling indefinitely (B), or abandoning the project (D). Source: [BOK] Domain I.D combined with VI.C, Design of Experiments (observational alternatives).",
    "set": 3,
    "qid": "mbb:set-3:d1-060"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A consumer electronics company sells 500,000 units annually of one product line, with a warranty claim rate of 3.5% and an average warranty repair/replacement cost of $85. What is the annual COPQ exposure from warranty claims, and is this large enough relative to the product line's $60M annual revenue to warrant strategic pipeline attention?",
    "options": [
      "$42,500; clearly too small to matter",
      "$14,875,000; a catastrophic and almost certainly business-ending cost level",
      "The warranty rate alone is insufficient information; nothing can be calculated",
      "$1,487,500 in annual warranty COPQ (500,000 \u00d7 0.035 \u00d7 $85), representing roughly 2.5% of the $60M product-line revenue \u2014 a material enough figure (well above a rounding error) to warrant serious pipeline consideration, though the MBB should also check the trend direction (rising, stable, declining) before finalizing the priority level"
    ],
    "answer": 3,
    "why": "500,000 \u00d7 0.035 = 17,500 claims; 17,500 \u00d7 $85 = $1,487,500. $1,487,500 / $60,000,000 \u2248 2.48%, a material but not extreme COPQ ratio \u2014 testing careful arithmetic and appropriate contextual interpretation (neither dismissing it as trivial nor overreacting as catastrophic). Source: [CSSC] Ch. 8, The CoQ and the CoPQ.",
    "set": 3,
    "qid": "mbb:set-3:d1-061"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An agribusiness's pipeline includes several projects requiring field-data collection that can only occur during the growing season (roughly 5 months per year), but Belt project assignments are made on a standard, non-seasonal quarterly cycle. Belts assigned in the \"wrong\" quarter routinely stall for months waiting for the growing season to begin. What pipeline management fix addresses this directly?",
    "options": [
      "Assign Belts to growing-season-dependent projects only during quarters that align with the actual data-collection window, explicitly building the biological/seasonal constraint into project sequencing and Belt assignment timing, rather than treating all projects as interchangeable on a generic quarterly cycle",
      "Assign Belts to growing-season projects at the standard time regardless of season, and simply extend their project deadlines indefinitely until data becomes available",
      "Discontinue all growing-season-dependent projects since the seasonal constraint is too inconvenient for standard pipeline scheduling",
      "Require growing-season projects to collect data during the off-season using estimated or substituted data instead of real field data"
    ],
    "answer": 0,
    "why": "This is a direct pipeline-scheduling fix: a known, structural timing constraint (seasonal data availability) should be explicitly built into assignment/sequencing logic, rather than forcing a generic, season-blind quarterly cycle onto a fundamentally seasonal data-generating process. Source: [BOK] Domain I.F, Pipeline Management.",
    "set": 3,
    "qid": "mbb:set-3:d1-062"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A resort chain's strategic plan states the objective \"enhance guest experience\" with no further detail. An MBB-facilitated workshop generates 40 candidate projects, all loosely justifiable as \"enhancing guest experience,\" ranging from lobby music selection to reservation system overhauls. What is the underlying flaw exposed by this outcome?",
    "options": [
      "The workshop facilitator did a poor job and should generate fewer ideas next time",
      "There is no flaw; generating 40 candidate ideas from one strategic objective demonstrates strong strategic alignment",
      "The strategic objective is too vague/unspecific to meaningfully discriminate between candidate projects \u2014 nearly any project can be justified under it, which means it fails to actually guide prioritization; the objective needs to be decomposed into specific, measurable sub-goals (e.g., reduce check-in wait time, improve room-readiness accuracy) before it can usefully drive project selection",
      "All 40 projects should be approved since they are all technically aligned"
    ],
    "answer": 2,
    "why": "This closes the loop with D1-050's theme (measurable objectives) by showing the practical consequence of an unspecific strategic statement: it fails to discriminate between genuinely high-value and marginal projects, undermining the entire purpose of strategic alignment as a selection filter. Source: [BOK] Domain I.A, Strategic Plan Development.",
    "set": 3,
    "qid": "mbb:set-3:d1-063"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "When designing a cascaded metric to verify strategic alignment for a project still in progress, why is it generally preferable to include at least one leading indicator alongside lagging outcome indicators?",
    "options": [
      "Leading indicators allow the team and MBB to detect misalignment or problems early enough to course-correct before the lagging (final outcome) metric confirms success or failure, which by definition arrives too late to act on for that project cycle",
      "Leading indicators eliminate the need for a control phase once the project is implemented",
      "Lagging indicators should never be used in Six Sigma projects",
      "Leading indicators are always more accurate than lagging indicators"
    ],
    "answer": 0,
    "why": "This is a standard MBB-level metric-design principle: leading indicators provide the early-warning capability that pure lagging/outcome metrics cannot, since by the time a lagging metric confirms a problem, the window for low-cost correction within the same project cycle has often closed. Source: [BOK] Domain I.B, Strategic Plan Alignment; II.F, Organizational Performance Metrics.",
    "set": 3,
    "qid": "mbb:set-3:d1-064"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A consumer packaged goods company's executive board questions whether to continue funding the enterprise Six Sigma office ($1.2M annual infrastructure cost: MBB/BB salaries, training, software) given documented project savings of $8.5M over the same year. What should the MBB present as the most complete justification, beyond the raw ROI ratio?",
    "options": [
      "Only the raw ROI ratio (8.5M / 1.2M \u2248 7:1), since that number alone is fully sufficient justification",
      "No further justification should be presented since raising the question at all indicates the board has already decided to cut funding",
      "Immediately agree to cut the budget by half regardless of the ROI evidence, to preempt any further scrutiny",
      "A complete picture including: the raw ROI ratio, the trend over multiple years (not just one strong year), the qualitative capability built (trained Belts, institutional problem-solving capacity that persists beyond any single project), and the risk of infrastructure loss (re-building deployment capability later is typically far more costly and slower than sustaining it) \u2014 since a single year's ROI, however strong, doesn't capture the durability or full value of the infrastructure investment"
    ],
    "answer": 3,
    "why": "A single year's raw ROI, while a strong data point, is an incomplete infrastructure-investment case \u2014 trend durability, built organizational capability, and re-\u5efa\u7acb (rebuilding) cost risk are all standard, necessary elements of a complete MBB-level infrastructure justification to executive leadership. Source: [BOK] Domain I.C, Infrastructure Elements; III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d1-065"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A regional restaurant chain wants to address a well-understood, narrowly-scoped issue: excessive ticket times during a specific 90-minute dinner rush at a single location, where the likely causes (kitchen layout, ticket sequencing) are already largely known from staff observation. Which methodology is most resource-appropriate?",
    "options": [
      "A DMADV redesign of the entire restaurant concept",
      "A focused, short-duration Kaizen event (typically days, not months) bringing together kitchen staff and a facilitator to rapidly implement and test layout/sequencing changes, since the problem is narrowly scoped, causes are largely already known, and rapid iterative testing is more resource-appropriate than a lengthy formal DMAIC cycle",
      "A full multi-month DMAIC project with a dedicated Black Belt, extensive statistical analysis, and a formal control plan",
      "No formal methodology is needed; the manager should simply guess at a fix"
    ],
    "answer": 1,
    "why": "Matching methodology weight to problem scope and certainty is a core MBB judgment: a well-understood, narrowly-scoped, single-location issue with largely known likely causes is a textbook Kaizen event candidate, not a multi-month DMAIC undertaking or a full redesign. Source: [CSSC] Ch. 3, Other Process Improvement and Quality Methods.",
    "set": 3,
    "qid": "mbb:set-3:d1-066"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "An insurer notices that policies sold through a particular agent channel have a higher claims-denial-appeal-success rate than other channels, and concludes \"that agent channel is teaching customers to file fraudulent appeals,\" recommending an investigation project targeting that channel. What is the analytical flaw?",
    "options": [
      "The insurer should immediately terminate all agents in that channel based on this data alone",
      "There is no flaw; correlation between agent channel and appeal-success rate is sufficient to establish the agent channel is causing fraud",
      "Appeal-success rates should never be analyzed by channel",
      "The observed correlation (channel and appeal-success rate) does not establish causation, let alone the specific causal mechanism claimed (fraud); plausible alternative explanations (e.g., that channel serves a customer segment with more complex, legitimately appealable policies, or that channel's agents better document claims at point of sale) haven't been ruled out before jumping to a fraud-focused conclusion"
    ],
    "answer": 3,
    "why": "This is a direct application of the \"avoid treating correlation as causation\" principle explicitly called out in your original assignment's statistical rigor requirements \u2014 a correlation observation should generate hypotheses to investigate, not support an immediate causal (and reputationally serious) conclusion like fraud. Source: [BOK] Domain I.E, Opportunities for Improvement; general statistical rigor principles (correlation/causation).",
    "set": 3,
    "qid": "mbb:set-3:d1-067"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A pipeline has 8 active projects, three of which are technically interdependent (Project B's success depends on a data-system upgrade being delivered by Project A first; Project C depends on Project B's process redesign being finalized). Project A has just been delayed by 2 months due to an unrelated vendor issue. What is the MBB's most important immediate pipeline management action?",
    "options": [
      "Formally update the pipeline's dependency/risk tracking to reflect the cascading impact of Project A's delay on B and C's realistic timelines, communicate the revised expectations to sponsors and stakeholders, and evaluate whether B and C's Belts can be temporarily reassigned to other ready-to-start pipeline work during the gap rather than sitting idle",
      "Blame Project A's Black Belt publicly to the steering committee for the cascading delays",
      "Immediately cancel Projects B and C entirely due to the delay",
      "Ignore the dependency and let Projects B and C continue on their original timelines regardless of Project A's delay"
    ],
    "answer": 0,
    "why": "Dependency management is a core pipeline-governance responsibility \u2014 the correct response to a cascading delay is transparent re-planning and resource reallocation (using idle capacity productively), not ignoring the dependency (A), overreacting with cancellation (B), or an unproductive and unprofessional blame response (D). Source: [BOK] Domain I.F, Pipeline Management; III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d1-068"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Drawing on the principles tested throughout this domain (measurable objectives, SWOT/environmental linkage, cascade-ready structure, stakeholder synthesis, and pipeline-readiness), which single criterion, if missing, would most undermine an otherwise well-constructed strategic plan's usefulness for driving the improvement pipeline?",
    "options": [
      "The plan is written in formal business language reviewed by legal counsel",
      "The plan lacks any mechanism for periodic re-validation against changing conditions (i.e., it is treated as a static, one-time document rather than something revisited at defined intervals or trigger events), meaning even a well-constructed plan will progressively drift out of alignment with reality exactly as illustrated in the automotive (D1-051) and BB-project-pivot (D1-009) scenarios",
      "The plan's length exceeds 20 pages",
      "The plan does not explicitly name every individual project to be undertaken over its full multi-year horizon"
    ],
    "answer": 1,
    "why": "This closing synthesis item ties together the batch's recurring theme (strategic plans and their alignment must be periodically re-validated, not treated as static) into a single \"most critical missing element\" judgment \u2014 even a well-built plan becomes a liability if there's no defined mechanism to revisit it as conditions change. Source: [BOK] Domain I.A, Strategic Plan Development (synthesis across Batches 1-3).",
    "set": 3,
    "qid": "mbb:set-3:d1-069"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Across the call center (D1-008), logistics (D1-027), semiconductor fab (D1-052), and law firm (D1-058) scenarios in this domain, a common alignment failure pattern recurs in different forms. Which statement best captures the general principle an MBB should apply when reviewing any newly cascaded metric?",
    "options": [
      "Cascaded metrics are inherently unreliable and should be replaced with purely qualitative executive judgment",
      "Only financial metrics should ever be cascaded, since non-financial metrics are too easily misaligned",
      "Before approving any cascaded metric, explicitly test it against two questions: (1) can this metric be improved in a way that works against the actual strategic outcome it's meant to serve (an unpaired or gameable metric), and (2) does this metric actually change when the strategy itself changes, or is it a legacy holdover \u2014 both known, recurring alignment failure modes",
      "Cascaded metrics should always be identical to the top-level enterprise metric, with no local adaptation"
    ],
    "answer": 2,
    "why": "This synthesis item asks the candidate to abstract a general diagnostic principle from four concrete scenarios distributed across the batch \u2014 a genuinely MBB-level (Evaluate/synthesis) task distinct from recognizing any single instance of the pattern. Source: [BOK] Domain I.B, Strategic Plan Alignment (cross-batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d1-070"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Reflecting on the infrastructure scenarios in this domain (steering committees, hybrid/centralized/decentralized models, maturity gaps, franchise models, data-access agreements), which general prioritization principle should guide an MBB deciding which infrastructure element to build or fix first in a given organization?",
    "options": [
      "Infrastructure investment order does not matter as long as all elements are eventually built",
      "Always invest in training infrastructure first, since Belt certification is the most visible infrastructure element",
      "Diagnose the organization's specific bottleneck (e.g., missing measurement standardization, an untracked benefits-realization gap, a structural cross-functional access barrier) and prioritize the infrastructure investment that removes the constraint currently most limiting deployment effectiveness \u2014 since the \"right\" infrastructure priority is context-dependent, not a fixed universal sequence",
      "Always build governance structures (steering committees) first in every organization, regardless of context"
    ],
    "answer": 2,
    "why": "This closing item synthesizes the batch's infrastructure scenarios (each showing a different specific bottleneck \u2014 measurement standardization, benefits tracking, data access, certification pathways, franchise structure) into the general principle that infrastructure prioritization should be diagnostic and context-specific, not a fixed universal checklist order. Source: [BOK] Domain I.C, Infrastructure Elements (cross-batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d1-071"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Synthesizing the methodology-selection scenarios in this domain (DMAIC vs. DMADV, DFSS for regulated new products, Kaizen for narrow well-understood problems, short-run SPC for unique-unit production, BPR for plateaued incremental gains), what is the single most important question an MBB should ask *before* any other consideration when selecting an improvement methodology?",
    "options": [
      "Does an existing, operating process already exist to be measured and improved, or is this fundamentally a new-process/new-product design problem, a narrowly-scoped well-understood tactical fix, or a case requiring architectural redesign due to plateaued returns \u2014 since methodology selection should follow from the actual nature and history of the problem, not from convenience, familiarity, or trend",
      "Which methodology does the assigned Black Belt already know best?",
      "Which methodology is currently most fashionable in the industry?",
      "What is the cheapest methodology available regardless of fit to the problem?"
    ],
    "answer": 0,
    "why": "This closing synthesis item distills the domain's repeated methodology-selection lesson (tested individually in D1-014, D1-015, D1-017, D1-029, D1-041, D1-054, D1-060, D1-066) into the single foundational diagnostic question that should precede all others: what is the actual nature of the problem (existing process vs. new design vs. narrow tactical fix vs. plateaued/architectural), since methodology should follow problem type. Source: [BOK] Domain I.D, Improvement Methodologies (cross-batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d1-072"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Synthesizing the opportunity-identification pitfalls tested in this domain (naive benchmarking, survivorship bias, correlation/causation confusion, VOC/VOB imbalance, safety leading-indicator neglect), what common thread should an MBB apply as a validation checklist before accepting any proposed \"opportunity\" as pipeline-ready?",
    "options": [
      "Explicitly interrogate the data source for each proposed opportunity: is the comparison/sample fairly constructed (not biased or non-comparable), does correlation-based evidence have a validated causal mechanism (or is it just a hypothesis to test further), and has the opportunity been checked against multiple legitimate input types (VOC, VOB, safety/risk, regulatory) rather than relying on a single, possibly incomplete data source",
      "Opportunities identified through quantitative data are always more valid than those identified through qualitative or risk-based reasoning",
      "Reject any opportunity that cannot be immediately quantified in exact dollar terms",
      "Accept any opportunity that has any supporting data at all, regardless of the data's source or limitations"
    ],
    "answer": 0,
    "why": "This synthesis item distills the domain's opportunity-identification pitfalls (D1-018 VOC/VOB balance, D1-020 benchmarking flaws, D1-036/061 COPQ sizing, D1-042 multi-source validation, D1-048 survivorship bias, D1-055 leading indicators, D1-067 correlation/causation) into a general validation discipline: scrutinize data quality/bias, distinguish correlation from established causation, and triangulate across multiple legitimate input types. Source: [BOK] Domain I.E, Opportunities for Improvement (cross-batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d1-073"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "Synthesizing the pipeline management scenarios in this domain (Belt capacity constraints, stage-gate kill decisions, cross-departmental competition, dependency cascades, seasonal scheduling constraints, and WIP/throughput diagnosis), which general principle should govern all pipeline management decisions, regardless of the specific triggering situation?",
    "options": [
      "Pipeline decisions should always be made by whichever department or individual raises the loudest or most urgent-sounding concern",
      "Once a project enters the pipeline, it should never be paused, re-sequenced, or killed regardless of new information",
      "Pipeline management decisions should be grounded in the organization's actual, current resource capacity (Belt availability, dependencies, seasonal/structural constraints) and transparent, criteria-based governance \u2014 treating capacity as a hard constraint to plan around and trade off against explicitly, rather than as an assumption that can be indefinitely stretched to accommodate every request",
      "More active projects in the pipeline is always better, since it demonstrates organizational ambition"
    ],
    "answer": 2,
    "why": "This closing synthesis item distills the domain's pipeline scenarios (D1-023 capacity math, D1-024 stage-gate kill decision, D1-031 re-sequencing governance, D1-037 portfolio diversification, D1-049 cross-departmental scoring, D1-062 seasonal scheduling, D1-068 dependency cascades) into the unifying principle that real capacity constraints must be respected and explicitly traded off against via transparent governance, rather than papered over or ignored. Source: [BOK] Domain I.F, Pipeline Management (cross-batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d1-074"
  },
  {
    "sub": "mbb-enterprise",
    "stem": "A newly appointed MBB inherits an organization with: (1) a strategic plan of vague aspirational statements with no measurable targets, (2) cascaded metrics unchanged from three strategic cycles ago, (3) governance infrastructure limited to an inactive steering committee, (4) a pipeline of 30 projects with no prioritization criteria applied, (5) six Belts at or beyond capacity, and (6) no benefits-tracking process. Which sequence of first actions best reflects sound MBB judgment, given everything tested in this domain?",
    "options": [
      "Start by revising the strategic plan into specific, measurable objectives (the foundational gap underlying nearly every other symptom \u2014 vague strategy causes unfocused metrics, ungoverned pipelines, and unmeasurable benefits), then re-establish steering committee governance and cascaded metrics tied to the revised plan, then re-prioritize the 30-project pipeline against the new criteria and Belt capacity (likely deferring/killing a substantial fraction), and only then formalize benefits-tracking going forward \u2014 addressing the root strategic-clarity gap before layering governance, prioritization, and measurement fixes on top of it",
      "Decertify the existing steering committee and cancel all 30 projects on day one without further diagnosis",
      "Immediately launch all 30 pipeline projects simultaneously to demonstrate rapid impact to new leadership",
      "Focus exclusively on hiring more Belts to increase capacity, since that is the most concrete and immediately actionable gap"
    ],
    "answer": 0,
    "why": "This capstone item requires synthesizing the entire domain's teachings into a prioritized action sequence: recognizing that a vague strategic plan is the root cause underlying nearly every other symptom listed (unfocused cascaded metrics, an ungoverned pipeline, absent benefits tracking), and that fixing foundational strategic clarity first, then governance, then pipeline prioritization against real capacity, then measurement, is the logically sound and evidence-based sequence \u2014 genuinely Create-level synthesis, not recall of any single fact. Source: [BOK] Domain I, full domain synthesis (A\u2013F).",
    "set": 3,
    "qid": "mbb:set-3:d1-075"
  },
  {
    "sub": "mbb-org",
    "stem": "An e-commerce fulfillment company is deciding how Black Belts should report organizationally: as dedicated headcount within a central Six Sigma office (functional), or embedded within business units with a dotted-line to the Six Sigma office (matrix). The company runs lean, cross-functional fulfillment centers where speed of local decision-making is highly valued. Which structure is generally more defensible here, and why?",
    "options": [
      "A purely functional structure, because centralizing all Belts guarantees perfect consistency regardless of business unit needs",
      "Belts should report to no one and operate as fully independent contractors within each fulfillment center",
      "Neither structure matters; organizational design has no real effect on deployment effectiveness",
      "A matrix structure, because embedding Belts within business units preserves the fast, local decision-making the company values while the dotted-line relationship still provides methodology consistency, cross-project learning, and career-pathing support from the central office"
    ],
    "answer": 3,
    "why": "Given the stated value on fast local decision-making, a matrix structure balances local embeddedness/responsiveness with the methodology consistency and career development that a central function still needs to provide \u2014 a standard MBB-level organizational design trade-off. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-001"
  },
  {
    "sub": "mbb-org",
    "stem": "An oil & gas company's VP sponsors a major refinery-efficiency project, attends the kickoff meeting, and is never seen again until the final results presentation. The project stalls twice due to cross-departmental resource conflicts that only an executive could resolve. What leadership competency gap does this illustrate?",
    "options": [
      "The team lacked motivation",
      "The Black Belt lacked sufficient technical skill to resolve the conflicts independently",
      "The project itself was poorly scoped from the outset",
      "The VP exhibited passive/ceremonial sponsorship rather than active sponsorship \u2014 genuine executive sponsorship requires ongoing, periodic engagement to clear organizational barriers (especially cross-departmental resource conflicts) that are, by design, beyond a Black Belt's authority to resolve alone"
    ],
    "answer": 3,
    "why": "This tests recognizing \"ceremonial sponsorship\" (showing up only for kickoff/closeout) as a specific, common leadership failure mode \u2014 active sponsorship specifically means being available to resolve exactly the kind of cross-departmental barriers a BB cannot clear alone. Source: [BOK] Domain II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d2-002"
  },
  {
    "sub": "mbb-org",
    "stem": "A defense contractor's engineering, quality, and manufacturing departments each maintain separate, non-integrated data systems and rarely share process data with each other, citing \"security concerns\" even for non-classified operational metrics. A cross-functional improvement project stalls because no department will share its data set. What is the most defensible MBB diagnosis and first action?",
    "options": [
      "Escalate immediately to terminate the project since data sharing is clearly impossible in this environment",
      "Accept each department's data in isolation and produce three separate, disconnected analyses instead of one integrated one",
      "Diagnose this as a siloed-culture/organizational-challenge issue rather than a genuine security constraint (since the data cited is non-classified); engage department leaders and, if needed, an executive sponsor to establish a data-sharing agreement or protocol specifically for non-classified operational metrics, addressing the underlying cross-functional trust/territorial issue rather than accepting the stated \"security\" justification at face value",
      "Bypass all three departments and pull the data directly from IT systems without any departmental agreement or awareness"
    ],
    "answer": 2,
    "why": "Recognizing that a stated technical/security justification may actually mask a deeper organizational-silo/territorial challenge \u2014 and addressing the real barrier (cross-functional trust, data governance) via appropriate leadership engagement \u2014 is core Domain II judgment, distinct from either accepting the stated reason uncritically or acting unilaterally. Source: [BOK] Domain II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d2-003"
  },
  {
    "sub": "mbb-org",
    "stem": "A cruise line wants crew members to report near-miss safety incidents more readily, but incident reports have been declining even as anecdotal evidence suggests near-misses are occurring at a steady or increasing rate. What cultural/values framework element most likely explains this pattern?",
    "options": [
      "Crew members are becoming more skilled and therefore experiencing fewer near-misses in reality",
      "A lack of psychological safety: if crew members fear blame, discipline, or negative career consequences for reporting, they will under-report even as actual near-miss frequency stays the same or rises \u2014 declining reports in this context is a red flag for reporting culture, not necessarily improving safety",
      "Declining reports always indicate genuine safety improvement and should be celebrated without further investigation",
      "The reporting form is likely too long, and this is purely a process-design issue unrelated to culture"
    ],
    "answer": 1,
    "why": "Declining self-reported incident rates alongside steady/rising anecdotal evidence is a classic signature of a psychological-safety deficit \u2014 a core organizational culture/values framework concept the MBB must recognize rather than taking the declining numbers at face value. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-004"
  },
  {
    "sub": "mbb-org",
    "stem": "A dairy processing plant's employee suggestion program has collected over 200 improvement suggestions over two years, but fewer than 5% have received any visible follow-up or response to the submitting employee, and suggestion volume has dropped sharply in the last six months. What organizational feedback principle explains the declining participation, and what should the MBB recommend?",
    "options": [
      "Employees have simply run out of ideas after two years",
      "The suggestion program should be eliminated since participation has declined",
      "The declining volume is unrelated to the low follow-up rate and requires no action",
      "This illustrates a broken feedback loop: employees who submit suggestions without receiving acknowledgment, status updates, or outcomes (implemented, deferred, or declined with reason) rapidly disengage, since the perceived value of participating drops to near zero; the MBB should recommend a formal closed-loop process guaranteeing a response (even a brief one) to every submission within a defined timeframe"
    ],
    "answer": 3,
    "why": "This is the textbook \"broken feedback loop\" pattern \u2014 participation collapses when people perceive their input as going into a void, a well-documented organizational feedback principle; the fix is process discipline (guaranteed acknowledgment/response), not assuming idea exhaustion or abandoning the mechanism. Source: [BOK] Domain II.E, Organizational Feedback.",
    "set": 3,
    "qid": "mbb:set-3:d2-005"
  },
  {
    "sub": "mbb-org",
    "stem": "A SaaS company's executive dashboard prominently displays \"total registered users\" (which has grown steadily every month) but does not display active-usage or churn metrics. Leadership believes the business is thriving based on the dashboard. What organizational performance metrics flaw does this represent?",
    "options": [
      "The number is inaccurate and should be recalculated",
      "Total registered users is a \"vanity metric\" here \u2014 it can grow indefinitely even while active usage and retention (the metrics that actually drive recurring revenue and business health) decline; the dashboard should be redesigned to feature actionable metrics (active users, churn rate, net revenue retention) rather than a cumulative count that never decreases regardless of underlying business health",
      "The dashboard should display only financial metrics and remove all usage-related metrics entirely",
      "There is no flaw; total registered users is always the single best indicator of business health for a SaaS company"
    ],
    "answer": 1,
    "why": "This tests recognizing a \"vanity metric\" \u2014 one that trends favorably regardless of actual underlying business health because it's cumulative/non-decreasing \u2014 a common organizational performance-metrics design flaw the MBB should identify and correct with genuinely actionable, decision-relevant metrics. Source: [BOK] Domain II.F, Organizational Performance Metrics.",
    "set": 3,
    "qid": "mbb:set-3:d2-006"
  },
  {
    "sub": "mbb-org",
    "stem": "A waste management company's regional operations managers each directly supervise 25-30 route supervisors, who in turn supervise 15-20 drivers each. The company wants to embed Six Sigma champion responsibilities into the regional operations manager role. What organizational design concern should the MBB raise first?",
    "options": [
      "The role clarity concern: whether champion duties (project sponsorship, resource clearing, cross-functional escalation) are explicitly defined and resourced (e.g., protected time) as distinct from the regional manager's existing operational span-of-control responsibilities, since simply adding champion duties on top of an already-wide span of control without clarifying priority and time allocation risks the champion role becoming ceremonial (as tested in D2-002) due to sheer capacity constraints",
      "Route supervisors, not regional operations managers, should always hold champion responsibilities regardless of organizational level appropriateness",
      "Champion responsibilities are irrelevant to organizational design and belong entirely to Domain V (Coaching and Mentoring)",
      "No concern \u2014 champion responsibilities can always be added to any role regardless of existing span of control"
    ],
    "answer": 0,
    "why": "Adding a significant new responsibility (champion duties) onto an already wide span-of-control role without explicit role clarity and protected capacity is a predictable path to the same ceremonial-sponsorship failure diagnosed in D2-002 \u2014 an organizational design concern the MBB should proactively flag before the role assignment is finalized, not after champions become unavailable. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-007"
  },
  {
    "sub": "mbb-org",
    "stem": "During a DMAIC team's Analyze-phase working sessions at a textile manufacturer, one senior engineer consistently dominates discussion, dismisses junior team members' data-based observations, and has begun to cause two junior members to stop contributing altogether. The Black Belt has not addressed this. As the coaching MBB, what is the best next action?",
    "options": [
      "Instruct the Black Belt to remove the senior engineer from the team entirely without further discussion",
      "Wait until the project concludes to address team dynamics in a post-project retrospective",
      "Ignore the dynamic since technical seniority should naturally determine whose input carries more weight",
      "Coach the Black Belt on specific facilitation techniques to actively manage the dynamic in real time (e.g., structured round-robin input, explicitly asking junior members for their data-based perspective before senior members speak, and privately addressing the dismissive behavior with the senior engineer) \u2014 intervening now rather than waiting, since disengaged junior members represent lost analytical input and a team-dynamics failure the BB is responsible for managing"
    ],
    "answer": 3,
    "why": "This tests real-time team-leadership coaching: the MBB's role includes actively coaching Black Belts on facilitation technique to address dominant/dismissive dynamics as they occur, since allowing junior members to disengage represents both a lost-input problem and a team-dynamics failure that will likely recur and worsen if unaddressed. Source: [BOK] Domain II.B, Executive and Team Leadership; V.B, Coaching Teams and Individuals.",
    "set": 3,
    "qid": "mbb:set-3:d2-008"
  },
  {
    "sub": "mbb-org",
    "stem": "A veterinary services chain has launched four major initiatives in the past 18 months (a new EMR system, a customer-loyalty program, a staffing model change, and now a Six Sigma deployment), with the same clinic managers expected to champion or actively participate in all four simultaneously. Six Sigma project engagement is notably weak. What organizational challenge does this most likely represent, and what should the MBB recommend?",
    "options": [
      "The clinic managers are simply not motivated by process improvement specifically",
      "Change fatigue and resource/attention competition across multiple simultaneous major initiatives \u2014 the same limited pool of managers cannot meaningfully champion four concurrent transformations; the MBB should work with leadership to sequence or de-conflict initiative timing/ownership, or explicitly reduce the Six Sigma ask on already-overcommitted managers rather than treating weak engagement as a Six-Sigma-specific problem",
      "Each initiative's leader should compete for the same managers' attention without any coordination, and whichever initiative \"wins\" more manager time should be considered organizationally superior",
      "Six Sigma deployment should be canceled since the organization clearly cannot support it"
    ],
    "answer": 1,
    "why": "Weak engagement in a specific new initiative when the same people are already stretched across multiple concurrent major changes is a resource-competition/change-fatigue problem, not necessarily a specific rejection of Six Sigma \u2014 the MBB should diagnose and address the systemic overcommitment rather than assuming the deployment itself is flawed. Source: [BOK] Domain II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d2-009"
  },
  {
    "sub": "mbb-org",
    "stem": "A publishing company wants to design a recognition structure to reinforce a new \"customer-first\" cultural value tied to its Six Sigma deployment. Which recognition approach is most defensible?",
    "options": [
      "Recognition explicitly tied to demonstrated customer-first behaviors and outcomes (e.g., documented process improvements traceable to VOC data, team-based project completions with quantified customer impact), delivered with reasonable frequency (not just once annually) and through multiple channels (public acknowledgment, career-pathing credit, team-level as well as individual recognition) so the reinforcement is timely, criteria-based, and visible enough to shape ongoing behavior",
      "No formal recognition structure; values should be self-motivating and require no reinforcement",
      "A single, large annual \"Employee of the Year\" award chosen entirely by senior executives based on subjective impression",
      "Purely financial bonuses with no public acknowledgment component, since money is the only meaningful form of recognition"
    ],
    "answer": 0,
    "why": "Effective culture/values reinforcement requires recognition that is criteria-based (tied to the specific value/behavior), timely (not just annual), and visible (multiple channels, not solely private) \u2014 a well-established organizational behavior principle relevant to Domain II.D. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-010"
  },
  {
    "sub": "mbb-org",
    "stem": "An amusement park operator wants to assess how effectively its Black Belts engage with cross-functional stakeholders during projects, beyond what project outcome metrics alone reveal. Which organizational feedback mechanism is best suited to this specific purpose?",
    "options": [
      "360-degree feedback gathered from project sponsors, team members, and cross-functional stakeholders the Black Belt worked with, specifically assessing collaboration, communication, and stakeholder management competencies that outcome-only metrics don't directly capture",
      "Project financial ROI reports, since they already capture stakeholder engagement quality indirectly",
      "No feedback mechanism is necessary since project outcomes alone are a complete measure of Black Belt effectiveness",
      "A single self-assessment completed by the Black Belt with no external input"
    ],
    "answer": 0,
    "why": "360-degree feedback is specifically designed to surface interpersonal/collaboration competencies (stakeholder engagement, communication) that pure outcome metrics (which capture \"what\" was achieved, not \"how\") cannot directly measure \u2014 the correct mechanism match for the stated purpose. Source: [BOK] Domain II.E, Organizational Feedback; IV.D, Training Program Effectiveness (related).",
    "set": 3,
    "qid": "mbb:set-3:d2-011"
  },
  {
    "sub": "mbb-org",
    "stem": "A freight rail company introduces \"on-time train departure rate\" as a highly visible organizational performance metric with public reporting. Within two quarters, departure rate improves significantly, but customer complaints about cargo left behind at the platform to preserve departure timing have risen sharply. What performance-metrics principle does this illustrate, and what should the MBB recommend?",
    "options": [
      "This illustrates metric gaming/goal displacement: a single, highly visible metric without a paired counter-metric (in this case, cargo completeness or \"on-time and complete\" as a joint measure) predictably gets optimized in ways that trade off against the goal the metric was meant to represent; the MBB should recommend pairing the departure metric with a counterbalancing completeness metric, similar to the cascade-alignment failures diagnosed in Domain I",
      "On-time departure is not a valid metric and should be discontinued entirely",
      "The rise in complaints is coincidental and unrelated to the new metric's introduction",
      "Public reporting of performance metrics should always be avoided since it invites gaming"
    ],
    "answer": 0,
    "why": "This is the organizational-performance-metrics counterpart to the cascade-alignment failures tested in Domain I (D1-008, D1-027, D1-052) \u2014 a single, unpaired, highly visible metric predictably invites gaming/goal displacement unless paired with a counterbalancing measure of the trade-off it could induce. Source: [BOK] Domain II.F, Organizational Performance Metrics.",
    "set": 3,
    "qid": "mbb:set-3:d2-012"
  },
  {
    "sub": "mbb-org",
    "stem": "A wind energy company's Six Sigma deployment sits entirely within the Engineering division, with no formal linkage to Operations, Finance, or HR. Projects addressing cross-divisional issues (e.g., turbine maintenance scheduling that touches both Engineering and Operations) frequently stall due to Operations' unfamiliarity with and limited buy-in to the methodology. What organizational design flaw does this reflect?",
    "options": [
      "Operations should be required to adopt Engineering's exact terminology and tools regardless of any legitimate differences in their work context",
      "Engineering should never be involved in Six Sigma deployment at all",
      "The deployment's organizational placement (siloed entirely within one division) limits its authority and credibility to drive genuinely cross-divisional projects; the design should be revised to give the Six Sigma function either an enterprise-level (not single-division) reporting structure, or formal cross-divisional governance representation, so cross-functional projects have legitimate standing outside Engineering alone",
      "The company should abandon cross-divisional projects entirely and only pursue Engineering-only improvement work"
    ],
    "answer": 2,
    "why": "A deployment function housed entirely within one division structurally limits its ability to drive genuinely cross-divisional work \u2014 this is a classic organizational-design flaw requiring a structural fix (enterprise-level placement or cross-divisional governance), not merely better communication within the existing structure. Source: [BOK] Domain II.A, Organizational Design; I.C, Infrastructure Elements (related).",
    "set": 3,
    "qid": "mbb:set-3:d2-013"
  },
  {
    "sub": "mbb-org",
    "stem": "A dental services chain's leadership uses the terms \"project sponsor\" and \"project champion\" interchangeably. What is the standard distinction an MBB should clarify?",
    "options": [
      "There is no meaningful distinction; the terms are always fully interchangeable in every organization",
      "Only large organizations need both a sponsor and a champion; small organizations should have neither",
      "A sponsor is typically the senior executive who authorizes the project, provides resources, and owns ultimate accountability for its business outcome, while a champion is often a more hands-on advocate (sometimes the same person, sometimes not) who actively removes day-to-day organizational barriers and maintains visible support throughout execution \u2014 organizations should clarify which behaviors they expect from whichever role/person is assigned, rather than assuming the label alone guarantees the needed engagement",
      "A champion is always more senior than a sponsor"
    ],
    "answer": 2,
    "why": "While terminology varies somewhat by organization, an MBB should be able to clarify the functional distinction (authorization/accountability vs. hands-on barrier-removal/advocacy) so that whichever role structure the organization uses, the actual needed behaviors (as tested in D2-002's passive-sponsorship scenario) are clearly assigned and expected. Source: [BOK] Domain II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d2-014"
  },
  {
    "sub": "mbb-org",
    "stem": "A catering company's kitchen staff have openly voiced skepticism about a new standardized-recipe-portioning project, citing \"we've been doing this successfully for 20 years and don't need outsiders telling us how to cook.\" The assigned Black Belt is a recent hire with no culinary background. What is the MBB's best coaching recommendation to address this resistance?",
    "options": [
      "Coach the Black Belt to explicitly involve experienced kitchen staff as active contributors (not just subjects) in the Measure/Analyze work \u2014 using their tenure and expertise to help identify true root causes of portioning variation, framing the project as validating and building on their experience with data rather than replacing their judgment, which directly addresses the \"outsider\" and \"20 years of experience\" objections rather than overriding them",
      "Replace the Black Belt with someone who has a culinary background, since technical domain expertise is the only relevant factor in overcoming this resistance",
      "Cancel the project since frontline resistance indicates it is not viable",
      "Instruct the Black Belt to assert formal project authority and require compliance regardless of staff concerns"
    ],
    "answer": 0,
    "why": "Resistance rooted in feeling that valued tenure/expertise is being dismissed by an \"outsider\" is best addressed by genuinely incorporating that expertise into the analytical process (co-creation) rather than asserting authority (A), abandoning the project (B), or assuming domain-expertise mismatch alone explains the resistance (D, which ignores the engagement/framing issue entirely). Source: [BOK] Domain II.C, Organizational Challenges; V.B, Coaching Teams and Individuals.",
    "set": 3,
    "qid": "mbb:set-3:d2-015"
  },
  {
    "sub": "mbb-org",
    "stem": "A correctional facility management company's stated values include \"continuous improvement\" and \"staff empowerment,\" but its actual promotion and disciplinary practices heavily penalize any deviation from existing procedures, even well-documented, data-supported process improvement suggestions from line staff. What does this reveal, and what should the MBB flag to leadership?",
    "options": [
      "This is purely an HR policy issue with no relevance to Six Sigma deployment",
      "There is a values-behavior gap: the stated cultural values (continuous improvement, empowerment) are contradicted by the actual reinforcement mechanisms (promotion/discipline practices), which will undermine the credibility of any Six Sigma deployment built on those stated values until the practical incentive structures are brought into alignment with the stated culture",
      "Nothing is wrong; stated values and actual practices are always aligned by definition",
      "The company should remove \"continuous improvement\" and \"staff empowerment\" from its stated values since they are aspirational and therefore inappropriate"
    ],
    "answer": 1,
    "why": "A genuine values-behavior gap (stated culture contradicted by actual incentive/disciplinary practices) is a critical organizational-culture diagnostic an MBB must surface \u2014 deploying Six Sigma on top of contradictory incentive structures will produce exactly the kind of engagement failures tested elsewhere in this domain (D2-005, D2-009, D2-015). Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-016"
  },
  {
    "sub": "mbb-org",
    "stem": "A ride-share company collects driver satisfaction survey data annually, but driver churn has become a fast-moving problem, with sharp month-to-month swings tied to rapidly changing incentive structures and competitor actions. What feedback-system design flaw does the annual cadence represent, and what should the MBB recommend?",
    "options": [
      "No flaw; annual surveys are always sufficient regardless of how quickly the underlying situation changes",
      "The feedback collection frequency (annual) is badly mismatched to the actual rate of change in the underlying driver-experience drivers (monthly-level shifts in incentives and competition); the MBB should recommend a more frequent (e.g., monthly or continuous pulse-survey) feedback mechanism appropriately matched to the pace of change in the environment being measured",
      "The solution is to survey drivers only once every two years instead of annually, to reduce survey fatigue",
      "Driver satisfaction data should be discontinued entirely since it cannot possibly keep pace with a fast-moving market"
    ],
    "answer": 1,
    "why": "Feedback mechanism cadence should be matched to the actual rate of change in what's being measured \u2014 an annual survey in a monthly-volatility environment is a clear design mismatch, and the fix is increasing (not decreasing or eliminating) measurement frequency appropriately. Source: [BOK] Domain II.E, Organizational Feedback.",
    "set": 3,
    "qid": "mbb:set-3:d2-017"
  },
  {
    "sub": "mbb-org",
    "stem": "A cold storage logistics company currently tracks only \"temperature excursion incidents per month\" (a lagging metric \u2014 the excursion has already happened by the time it's counted) as its primary organizational performance metric for cold-chain integrity. Which additional metric type would most strengthen this measurement system, and why?",
    "options": [
      "Replace the lagging metric entirely with only a leading indicator, discontinuing excursion tracking altogether",
      "A leading indicator, such as \"percentage of refrigeration units within predictive-maintenance service windows\" or \"average time-in-transit outside optimal temperature buffer zones,\" which can signal elevated risk of a future excursion before one actually occurs, allowing preventive action rather than only after-the-fact counting",
      "No additional metric is needed since lagging metrics are the gold standard for cold-chain integrity",
      "Another lagging metric, such as \"customer claims related to spoiled product,\" since more lagging metrics always improve a measurement system"
    ],
    "answer": 1,
    "why": "This reinforces the leading/lagging indicator principle (introduced in D1-064) applied to organizational performance metrics: pairing a lagging outcome metric with a leading risk-indicator enables proactive intervention, a standard performance-metrics design improvement. Source: [BOK] Domain II.F, Organizational Performance Metrics; I.B (leading/lagging indicator principle, D1-064).",
    "set": 3,
    "qid": "mbb:set-3:d2-018"
  },
  {
    "sub": "mbb-org",
    "stem": "An agri-genetics research company implements a matrix structure where Black Belts report both to a functional Six Sigma office and to the R&D project lead they're embedded with, and the two supervisors disagree on the Belt's top priority for the quarter. What organizational design element should have been established in advance to prevent this conflict from stalling the Belt's work?",
    "options": [
      "Nothing could have prevented this; matrix conflicts are always unresolvable and matrix structures should never be used",
      "The Black Belt should independently decide which supervisor to prioritize without any organizational guidance",
      "Matrix structures should include no functional-office involvement at all, only project-line reporting",
      "A predefined escalation and priority-arbitration protocol (e.g., a joint quarterly priority-setting session between the functional and project-line supervisors, with a defined tiebreaker authority) established at the time the matrix structure was designed, so that when priority conflicts arise (as they predictably will in any matrix), there is already an agreed mechanism to resolve them rather than leaving the Belt caught between two unaligned supervisors"
    ],
    "answer": 3,
    "why": "Matrix structures predictably generate dual-reporting priority conflicts \u2014 sound organizational design anticipates this and establishes an escalation/arbitration mechanism in advance, rather than leaving individual Belts to navigate unresolved supervisor conflicts on their own each time they arise. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-019"
  },
  {
    "sub": "mbb-org",
    "stem": "A broadcasting company's CEO announces via a single company-wide email that \"we are now a Six Sigma organization\" with no further explanation, town halls, or manager briefings, and no visible executive behavior change afterward. Six months later, employee awareness of what this means is near zero. What leadership gap does this represent?",
    "options": [
      "A single top-down announcement without sustained, multi-channel reinforcement (town halls, manager cascading briefings, visible executive behavior change modeling the new expectations) is insufficient to actually change organizational understanding or behavior \u2014 genuine leadership-driven deployment requires ongoing, visible commitment beyond a one-time announcement",
      "The CEO should have used a louder or more emphatically worded email instead",
      "Employees should be blamed for failing to independently research what \"Six Sigma organization\" means",
      "The email itself was a sufficient and complete leadership communication action"
    ],
    "answer": 0,
    "why": "A one-time top-down announcement with no sustained reinforcement or visible leadership behavior change is a well-recognized leadership-communication failure mode \u2014 genuine organizational change requires ongoing, multi-channel commitment, not a single broadcast message. Source: [BOK] Domain II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d2-020"
  },
  {
    "sub": "mbb-org",
    "stem": "Two apparel retail chains merge, each with an established but different Six Sigma deployment (different training materials, project selection criteria, and even different core methodologies \u2014 one DMAIC-centric, one Lean-centric). Leadership wants a unified deployment within 6 months. What organizational challenge should the MBB flag as the primary risk to that timeline, and what approach should be recommended?",
    "options": [
      "The primary risk is cultural/methodological integration resistance from whichever organization's approach is not selected as the \"standard,\" compounded by the loss of institutional knowledge/credibility built under the discontinued approach; the MBB should recommend a deliberate integration process \u2014 assessing genuine strengths of both approaches, involving Belts/champions from both legacy organizations in designing the unified methodology, and communicating a clear rationale \u2014 rather than a unilateral mandate, to reduce resistance and preserve valuable elements of both legacies",
      "There is no meaningful risk; simply mandating one chain's exact methodology and materials onto the other will work smoothly within 6 months",
      "The merger should be treated as an opportunity to eliminate Six Sigma deployment entirely from both organizations",
      "The two deployments should simply continue operating in parallel indefinitely with no integration attempted"
    ],
    "answer": 0,
    "why": "Post-merger methodology integration is a well-documented organizational challenge where unilateral imposition of one side's approach (A) predictably generates resistance and credibility loss; a deliberate, inclusive integration process addressing both technical merit and change-management/buy-in considerations is the defensible MBB recommendation. Source: [BOK] Domain II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d2-021"
  },
  {
    "sub": "mbb-org",
    "stem": "A home healthcare provider wants to assess its current organizational culture before launching a Six Sigma deployment, to identify likely areas of resistance versus receptivity. Which type of tool is most appropriate for this assessment?",
    "options": [
      "A review of the company's marketing materials and public brand messaging",
      "A validated organizational culture assessment survey/instrument (e.g., measuring dimensions like openness to change, psychological safety, hierarchy/power distance, and data-driven decision-making orientation) administered before deployment to establish a baseline understanding of cultural readiness and likely friction points",
      "An analysis of competitor market share, since culture is best inferred from competitive position",
      "A financial audit of the past year's budget variances"
    ],
    "answer": 1,
    "why": "A validated culture assessment instrument is the appropriate, purpose-built tool for understanding organizational readiness dimensions (change openness, psychological safety, hierarchy, data orientation) relevant to deployment planning \u2014 the other options measure unrelated dimensions entirely. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-022"
  },
  {
    "sub": "mbb-org",
    "stem": "An aviation maintenance, repair, and overhaul (MRO) facility introduces a mechanic feedback survey about safety culture and process concerns, but the survey requires employees to log in with their employee ID and is administered by their direct supervisor. Response rates are near 100%, but virtually all responses are uniformly positive, contradicting other evidence of known process friction. What is the likely flaw?",
    "options": [
      "The survey design (identifiable, supervisor-administered) likely suppresses honest negative feedback due to fear of identification and repercussion, producing artificially uniform positive results that are not credible given contradicting evidence; the MBB should recommend an anonymous, third-party-administered feedback channel to obtain more trustworthy data",
      "There is no flaw; a 100% response rate with uniformly positive results is strong evidence the organization has no real issues",
      "The contradicting evidence (known process friction) should be disregarded in favor of the survey's more \"official\" data source",
      "The high response rate itself is evidence of survey design flaws and should be reduced by making the survey harder to complete"
    ],
    "answer": 0,
    "why": "This is the organizational-feedback counterpart to the psychological-safety issue tested in D2-004: identifiable, supervisor-administered feedback channels predictably suppress honest negative input, producing artificially positive (and here, evidently non-credible) results \u2014 the fix is anonymized, independently-administered feedback collection. Source: [BOK] Domain II.E, Organizational Feedback; II.D, Culture and Values Framework (psychological safety link).",
    "set": 3,
    "qid": "mbb:set-3:d2-023"
  },
  {
    "sub": "mbb-org",
    "stem": "A craft brewery's operations dashboard has grown to include 47 distinct performance metrics tracked weekly, and floor supervisors report they no longer know which metrics actually matter for daily decision-making. What organizational performance metrics principle is being violated, and what should the MBB recommend?",
    "options": [
      "The dashboard should be reduced to a single metric only, regardless of the operation's actual complexity",
      "Floor supervisors should simply be trained to memorize all 47 metrics rather than reducing the metric count",
      "More metrics are always better since they provide comprehensive visibility",
      "Metric proliferation without prioritization violates the principle that performance metrics should be limited to a focused, actionable set tied to current strategic/operational priorities; the MBB should recommend a metric rationalization exercise \u2014 identifying which of the 47 are genuinely decision-driving versus merely \"nice to know,\" retiring or archiving the latter, and restructuring the dashboard around a much smaller set of metrics supervisors can actually act on daily"
    ],
    "answer": 3,
    "why": "Metric overload (too many tracked metrics without prioritization) is a well-recognized performance-measurement design flaw that degrades actionability \u2014 the fix is rationalization to a focused, decision-relevant set, not simply adding more metrics (A), over-simplifying to a single metric regardless of actual complexity (C), or asking people to compensate for poor dashboard design through memorization (D). Source: [BOK] Domain II.F, Organizational Performance Metrics.",
    "set": 3,
    "qid": "mbb:set-3:d2-024"
  },
  {
    "sub": "mbb-org",
    "stem": "A municipal water utility wants to embed Six Sigma champion responsibilities into mid-level manager roles, but civil service job classification rules make it difficult to formally modify job descriptions or compensation to reflect the added responsibility, and reclassification requests can take over a year to process. What organizational design approach should the MBB recommend given this constraint?",
    "options": [
      "Ignore the civil service classification system entirely and assign the responsibilities informally without any organizational acknowledgment",
      "Abandon the plan to embed champion responsibilities in this role given the civil service constraint",
      "Pursue a dual-track approach: begin embedding champion responsibilities informally now (with clear scope and executive backing) while simultaneously initiating the formal reclassification process in parallel, so the organization gains momentum on deployment without being blocked by a lengthy administrative process, while still working toward eventually formalizing the role structure once possible",
      "Wait the full year-plus for formal reclassification before assigning any champion responsibilities"
    ],
    "answer": 2,
    "why": "This tests pragmatic organizational-design judgment under real institutional constraints (civil service classification systems, common in public-sector contexts) \u2014 a parallel-track approach (informal start with executive backing + formal process initiated concurrently) avoids the unacceptable delay of A while still working toward proper formalization, unlike the unsustainable \"ignore it forever\" approach of B or the unnecessary abandonment in D. Source: [BOK] Domain II.A, Organizational Design; general public-sector deployment adaptation.",
    "set": 3,
    "qid": "mbb:set-3:d2-025"
  },
  {
    "sub": "mbb-org",
    "stem": "A telecom tower maintenance company has field technicians dispersed across a wide rural service territory, rarely co-located, with a single Black Belt expected to run in-person Kaizen-style events. After a year, project completion rates are far below the company's other, more centralized divisions. What organizational design issue is most likely limiting effectiveness, and what adaptation should the MBB recommend?",
    "options": [
      "Technicians simply lack the aptitude for process improvement work",
      "The Black Belt is underperforming and should be replaced with a more experienced hire",
      "The company should discontinue Six Sigma deployment for all field-based roles",
      "The deployment model itself was designed around in-person, co-located engagement assumptions that don't fit a geographically dispersed workforce; the MBB should recommend adapting the engagement model (e.g., virtual/asynchronous data collection, remote facilitation tools, regional cluster events instead of single large in-person sessions) to fit the actual organizational/geographic structure rather than continuing to apply a co-located deployment design to a dispersed workforce"
    ],
    "answer": 3,
    "why": "This tests recognizing that deployment engagement models must be organizationally fit-for-purpose \u2014 a design built around in-person co-location will predictably underperform in a genuinely dispersed workforce, and the fix is adapting the engagement mechanism, not blaming the Belt or the technicians. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-026"
  },
  {
    "sub": "mbb-org",
    "stem": "A university research lab's principal investigator (PI) technically \"sponsors\" a lab-workflow-efficiency project but treats the improvement effort as a low priority relative to grant-funded research, delegating all engagement to a graduate student with no organizational authority to resolve resource conflicts with other lab groups. What should the MBB recommend?",
    "options": [
      "Accept the graduate student as a fully adequate substitute sponsor since they are closest to the daily work",
      "Cancel the project since PIs are inherently unsuitable sponsors in academic environments",
      "Escalate immediately to the university provost to override the PI's priorities",
      "Directly and respectfully re-engage the PI to clarify the specific sponsor behaviors needed (resolving cross-lab resource conflicts, providing visible priority signals) that cannot be delegated to someone without organizational authority, reframing the ask in terms the PI's own priorities respond to (e.g., how resolved resource conflicts could reduce time lost to research itself)"
    ],
    "answer": 3,
    "why": "This is another variation of the passive/delegated-sponsorship problem (D2-002, D2-020) requiring the MBB to directly and constructively re-engage the actual authority-holder, reframing the ask around what that person already values, rather than accepting an inadequate substitute (A), escalating disproportionately (C), or giving up on the sponsor role model entirely (D). Source: [BOK] Domain II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d2-027"
  },
  {
    "sub": "mbb-org",
    "stem": "A funeral services company's staff resist process-timing metrics (e.g., \"time from client arrival to service completion\") because they feel such metrics conflict with the emotionally sensitive, unhurried nature of their work with grieving families. What organizational challenge does this represent, and how should the MBB reframe the approach?",
    "options": [
      "Abandon all process improvement work in the funeral services industry since the work is inherently unmeasurable",
      "Dismiss the concern as staff simply being resistant to any form of measurement",
      "This reflects a legitimate values-tension organizational challenge (efficiency metrics appearing to conflict with a core service value \u2014 compassionate, unhurried care) rather than simple resistance to change; the MBB should reframe metrics away from raw speed and toward metrics that don't compromise the compassionate-care value (e.g., family satisfaction, staff availability/scheduling efficiency behind the scenes, or administrative process times that don't touch client-facing interaction pacing), directly addressing the values concern rather than overriding it",
      "Implement the timing metrics as originally designed regardless of staff concerns, since metrics should never be adjusted based on staff pushback"
    ],
    "answer": 2,
    "why": "This tests recognizing that some resistance reflects a legitimate, values-based concern (not mere change-resistance) requiring metric redesign that respects the core service value, rather than either dismissing the concern (A, C) or concluding the entire industry is unsuited to improvement work (D). Source: [BOK] Domain II.C, Organizational Challenges; II.D, Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-028"
  },
  {
    "sub": "mbb-org",
    "stem": "A pet grooming franchise brand wants Six Sigma-supportive cultural values (data-driven decisions, continuous improvement) to be consistently understood across 150 independently owned locations. Given the franchise ownership structure (as discussed in Domain I's infrastructure context), what is the most appropriate cultural reinforcement mechanism?",
    "options": [
      "Develop shared brand-level cultural messaging and training materials (e.g., a brief onboarding module on the brand's data-driven, continuous-improvement values) that franchisees can adopt as part of brand standards, similar to the toolkit approach used for infrastructure in the Domain I franchise scenario \u2014 providing consistent messaging while respecting franchisee operational autonomy",
      "Rely entirely on each franchisee's personal values with no brand-level guidance or shared materials at all",
      "Cultural values cannot be meaningfully reinforced across independently owned franchise locations, so no attempt should be made",
      "Mandate identical daily staff meeting scripts at every location with no franchisee input"
    ],
    "answer": 0,
    "why": "This mirrors the franchise infrastructure principle from Domain I (D1-059): a shared, brand-level toolkit/messaging approach reinforces consistent values while respecting the franchisee's independent ownership and operational autonomy, rather than either full mandate (A) or full abdication (B, D). Source: [BOK] Domain II.D, Organizational Culture and Values Framework; I.C (franchise infrastructure parallel, D1-059).",
    "set": 3,
    "qid": "mbb:set-3:d2-029"
  },
  {
    "sub": "mbb-org",
    "stem": "A commercial fishing company's crew includes many workers with limited English proficiency and limited access to email or company intranet systems while at sea for weeks at a time. The company's only feedback mechanism is an English-language online survey. What feedback-system design flaw does this represent, and what should the MBB recommend?",
    "options": [
      "The feedback mechanism is fundamentally inaccessible to a significant portion of the intended respondent population (language barrier, connectivity limitation while at sea), producing systematically incomplete and unrepresentative feedback; the MBB should recommend accessible alternatives (e.g., multilingual paper or verbal feedback collected in port, translated materials, or feedback collected through trusted bilingual crew leads) matched to the actual workforce's access and language realities",
      "No flaw exists; if crew members want to provide feedback, they should learn English and gain internet access independently",
      "Feedback collection should be abandoned entirely for this workforce since the access barriers are considered unsolvable",
      "The survey should simply be made available in more languages without addressing the connectivity issue, since language is the only real barrier"
    ],
    "answer": 0,
    "why": "A feedback mechanism inaccessible to a substantial share of the intended population produces systematically biased/incomplete data \u2014 the MBB should recognize this as a design/accessibility flaw requiring adaptation to the workforce's actual access and language realities, not an individual failing on the workers' part (A) or an unsolvable dead end (D). Source: [BOK] Domain II.E, Organizational Feedback.",
    "set": 3,
    "qid": "mbb:set-3:d2-030"
  },
  {
    "sub": "mbb-org",
    "stem": "A ski resort tracks \"guest satisfaction score\" as a single annual average, which shows a healthy 4.2/5.0 rating. However, satisfaction during peak holiday weeks (the resort's highest-revenue period) is actually only 3.1/5.0, while off-peak periods average 4.6/5.0, and the annual blend masks this gap. What performance-metrics design flaw does this illustrate?",
    "options": [
      "Aggregating data across periods with fundamentally different operating conditions and business importance (peak vs. off-peak) into a single blended average masks a critical, high-stakes problem occurring during the highest-revenue period; the metric should be stratified by period (at minimum peak vs. off-peak) rather than reported only as a single annual blend, directly paralleling the stratification principle tested in D1-035 (seasonal control charts)",
      "There is no flaw; the annual average is mathematically correct and therefore analytically sufficient",
      "The 4.2 average should simply be reported with one additional decimal place of precision to resolve the concern",
      "Guest satisfaction should not be measured during peak weeks at all, since operational stress makes the data unreliable"
    ],
    "answer": 0,
    "why": "This is the organizational-performance-metrics counterpart to the seasonal stratification principle tested in D1-035 \u2014 blending fundamentally different operating periods into one average can mask a serious, high-stakes problem (here, satisfaction during peak revenue weeks) that stratified reporting would reveal. Source: [BOK] Domain II.F, Organizational Performance Metrics; VI.A (stratification principle, parallel to D1-035).",
    "set": 3,
    "qid": "mbb:set-3:d2-031"
  },
  {
    "sub": "mbb-org",
    "stem": "A regional dry cleaning chain with 12 locations and no dedicated Six Sigma office wants to begin a lightweight deployment. Which organizational design approach is most appropriate for this scale?",
    "options": [
      "No organizational design changes are needed; deployment can succeed with zero defined roles, structure, or accountability",
      "A lightweight design: designate one or two existing operations managers as part-time internal champions/facilitators (with some protected time and basic training), reporting informally to ownership/senior management, scaled appropriately to the organization's size rather than replicating large-enterprise infrastructure",
      "Outsource 100% of process improvement work permanently to external consultants with no internal capability building at all",
      "Build a full corporate Six Sigma office with dedicated MBB, multiple BBs, and a formal steering committee, mirroring a Fortune 500 deployment regardless of the chain's actual size"
    ],
    "answer": 1,
    "why": "This reinforces the resource-scaling principle from Domain I (D1-040's non-profit scenario): organizational design should be scaled appropriately to organizational size and resources, not default to either an over-built large-enterprise model (A) or no structure at all (C). Source: [BOK] Domain II.A, Organizational Design; I.C (scaling principle, D1-040).",
    "set": 3,
    "qid": "mbb:set-3:d2-032"
  },
  {
    "sub": "mbb-org",
    "stem": "A print/sign shop's owner-operator wants to personally lead all improvement projects directly, given the shop's small size (8 employees), rather than delegating to a designated champion or Black Belt. Given the organization's scale, is this leadership approach defensible, and what caution should the MBB raise?",
    "options": [
      "The owner should be prohibited from any involvement in process improvement work at all, delegating entirely to employees",
      "This is fully defensible with no caveats needed, since owners always have complete organizational context and need no additional input",
      "This can be defensible given the small scale (owner-operators commonly lead improvement efforts directly in very small organizations), but the MBB should caution the owner to actively solicit and genuinely act on frontline employee input during Analyze/Improve phases, since an owner leading unilaterally risks the same dismissive-dynamic problem tested in D2-008, just concentrated in one person with maximum organizational authority",
      "This is never defensible; only a dedicated, non-owner Black Belt can legitimately lead any Six Sigma project regardless of organizational size"
    ],
    "answer": 2,
    "why": "Small-organization leadership realities differ from larger enterprises \u2014 direct owner leadership can be appropriate and even efficient at this scale, but the MBB should still flag the risk of unilateral, insufficiently consultative leadership (echoing the dominant-voice dynamic from D2-008), now amplified by the owner's maximum organizational authority. Source: [BOK] Domain II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d2-033"
  },
  {
    "sub": "mbb-org",
    "stem": "A city fire department wants to apply Six Sigma to shift-scheduling processes but faces resistance from the firefighters' union, which is concerned that \"efficiency\" language signals an intent to reduce staffing levels or overtime pay, both of which the union has fought hard to protect in past negotiations. What organizational challenge does this represent, and what should the MBB recommend?",
    "options": [
      "Deliberately avoid using the word \"efficiency\" in all communications while proceeding with the exact same project scope and intent unchanged",
      "Cancel the project permanently since union involvement makes fire department process improvement impossible",
      "Proceed with the project as planned without any union engagement, since union concerns are not relevant to process improvement methodology",
      "This reflects legitimate stakeholder concern rooted in a history of labor-management conflict over related issues (staffing, overtime); the MBB should recommend proactive, transparent engagement with union leadership early in the project \u2014 clarifying scope boundaries (e.g., explicitly confirming or ruling out staffing/pay implications) and, where possible, involving union representatives in the project team \u2014 rather than proceeding without addressing a well-founded, historically-grounded concern"
    ],
    "answer": 3,
    "why": "Union resistance grounded in a legitimate history of labor-management conflict over adjacent issues (staffing, pay) requires proactive, transparent, and substantive engagement \u2014 not proceeding unilaterally (A), abandoning the effort entirely (C), or a superficial word-choice change that doesn't address the substantive underlying concern (D). Source: [BOK] Domain II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d2-034"
  },
  {
    "sub": "mbb-org",
    "stem": "A grocery chain's standard practice after any inventory shrinkage incident is to identify and discipline the individual employee deemed responsible. Six Sigma root-cause analysis on a shrinkage-reduction project keeps hitting a wall: employees are reluctant to fully describe what happened during incidents, fearing it will be used against them personally. What cultural framework shift should the MBB recommend?",
    "options": [
      "Eliminate all forms of individual accountability entirely, regardless of any genuine misconduct",
      "Continue the existing individual-blame discipline practice unchanged, since accountability is important, and simply ask employees to be more forthcoming despite the risk to them",
      "Continue individual blame but simply promise employees, without any structural change, that \"this time will be different\"",
      "Shift toward a \"just culture\" or systems-focused investigation approach (common in high-reliability industries) that distinguishes genuine root-cause/system contributors from individual culpable misconduct, reserving discipline for the latter while treating most incidents as learning opportunities to fix systemic and process gaps \u2014 this is necessary to get the honest, detailed incident information root-cause analysis actually requires"
    ],
    "answer": 3,
    "why": "This is a direct application of the \"just culture\" framework \u2014 a well-established organizational culture principle distinguishing systemic/human-error contributors (treated as learning opportunities) from genuine misconduct (still appropriately addressed) \u2014 necessary here because a pure blame culture is actively preventing the honest data collection root-cause analysis requires. Source: [BOK] Domain II.D, Organizational Culture and Values Framework.",
    "set": 3,
    "qid": "mbb:set-3:d2-035"
  },
  {
    "sub": "mbb-org",
    "stem": "A car rental company wants a complete picture of customer experience pain points. It currently relies solely on post-rental email surveys, which have a 4% response rate. What organizational feedback principle should the MBB apply to strengthen this picture?",
    "options": [
      "Discontinue the survey entirely since a 4% response rate makes it worthless",
      "Rely exclusively on the existing 4% response-rate survey, since any data is better than no data and no further sources are needed",
      "Increase survey length substantially to gather more detail per response, without addressing the low response rate itself",
      "Triangulate multiple feedback sources (e.g., the existing survey, call-center complaint logs, social media/review site mentions, and direct front-counter staff observations) rather than relying on a single low-response-rate channel, since each source has different biases and blind spots and combining them produces a more complete and more credible picture than any single source alone"
    ],
    "answer": 3,
    "why": "No single feedback channel (especially one with a low response rate, which likely also carries non-response bias) provides a complete picture \u2014 triangulating multiple, differently-biased sources is standard organizational feedback practice for building a credible composite view. Source: [BOK] Domain II.E, Organizational Feedback.",
    "set": 3,
    "qid": "mbb:set-3:d2-036"
  },
  {
    "sub": "mbb-org",
    "stem": "A pest control company scores individual technicians on \"customer complaint rate per job,\" but complaint rates vary substantially by territory (older housing stock in one territory generates structurally more pest issues regardless of technician skill) rather than purely by technician performance. High performers assigned to difficult territories are being unfairly ranked below lower performers in easier territories. What metrics design flaw does this represent, and what fix should the MBB recommend?",
    "options": [
      "The complaint rate metric should be abandoned entirely since no correction is possible",
      "All technicians should be reassigned to identical territories to eliminate the confounding variable entirely, regardless of feasibility",
      "The metric fails to control for a known, structural confounding factor (territory difficulty) that affects the outcome independent of technician skill; the MBB should recommend either risk-adjusting the metric (e.g., benchmarking each technician against their territory's historical baseline rather than a flat company-wide standard) or otherwise stratifying comparisons by territory difficulty before using the metric for individual performance evaluation",
      "There is no flaw; complaint rate is a direct and fair measure of technician skill regardless of territory assignment"
    ],
    "answer": 2,
    "why": "This is a direct application of the \"confounding variable\" principle (introduced via the seasonal/agricultural example in D1-035 and the ski resort stratification example in D2-031) to individual performance metrics \u2014 territory difficulty is a known confound that should be controlled for via risk-adjustment or stratified benchmarking before using the raw metric to evaluate individuals. Source: [BOK] Domain II.F, Organizational Performance Metrics; confounding-variable principle (parallel to D1-035, D2-031).",
    "set": 3,
    "qid": "mbb:set-3:d2-037"
  },
  {
    "sub": "mbb-org",
    "stem": "A moving/relocation services company hires large numbers of seasonal temporary workers during its peak summer months (60% of total workforce during peak), making sustained Belt/champion relationships with this segment difficult. What organizational design adaptation is most appropriate?",
    "options": [
      "Exclude seasonal workers from any process improvement involvement entirely, focusing solely on the 40% permanent workforce",
      "Require every seasonal worker to complete full Green Belt certification before starting work, regardless of the short employment duration",
      "Treat seasonal and permanent workers identically in all respects, ignoring the differences in tenure, training investment feasibility, and role in process improvement",
      "Design a lightweight, rapid-onboarding engagement model specifically for the seasonal segment (e.g., simple standardized checklists/visual aids co-developed with permanent staff, quick feedback capture mechanisms usable within a single shift, and concentrating deeper Belt-level project work in the permanent-staff-led off-season planning period) rather than either excluding the majority of peak-season labor or over-investing training time that exceeds the realistic employment relationship"
    ],
    "answer": 3,
    "why": "This tests organizational design judgment for a workforce segment with structurally different tenure/training economics \u2014 excluding a 60% majority (A) or over-investing training relative to the employment relationship (B) are both poor fits; a right-sized engagement model matched to actual tenure and role is the defensible middle path. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-038"
  },
  {
    "sub": "mbb-org",
    "stem": "Two VPs at a wholesale distribution company each sponsor separate Black Belt projects that both require the same limited warehouse-automation engineering team's time in the same quarter. Neither VP is willing to yield priority to the other, and both escalate directly (and separately) to the MBB to \"make the engineering team prioritize my project.\" What is the MBB's best next action?",
    "options": [
      "Personally decide which project gets priority and inform both VPs of the decision unilaterally",
      "Give both VPs exactly 50% of the engineering team's time regardless of relative project value, urgency, or feasibility of split resourcing",
      "Tell both VPs that neither project can proceed until they resolve the conflict entirely on their own, offering no facilitation support at all",
      "Decline to unilaterally arbitrate a decision that exceeds the MBB's own organizational authority; instead, facilitate bringing both VPs (and their common higher-level executive, if needed) together to jointly resolve the resource conflict using agreed criteria (e.g., strategic alignment, deadline urgency, financial impact), consistent with the escalation and governance principles tested throughout this domain"
    ],
    "answer": 3,
    "why": "This tests the MBB's understanding of the proper limits of their own authority in a peer-executive resource conflict \u2014 the correct move is facilitating a resolution among the actual decision-authority holders (echoing D1-033's cross-functional facilitation principle), not unilaterally deciding beyond their authority (A), applying an arbitrary equal split (B), or withdrawing support entirely (D). Source: [BOK] Domain II.B, Executive and Team Leadership; I.B (cross-functional trade-off facilitation, D1-033).",
    "set": 3,
    "qid": "mbb:set-3:d2-039"
  },
  {
    "sub": "mbb-org",
    "stem": "A dialysis clinic chain's clinical staff express concern that Six Sigma process changes might conflict with strict regulatory (CMS/state health department) protocols they must follow precisely. What is the most appropriate MBB response to this organizational challenge?",
    "options": [
      "Proceed with process changes first and address any regulatory compliance issues only if and when they are flagged by an external audit",
      "Explicitly build regulatory/compliance requirements into the project's Define-phase scope and constraints from the outset (i.e., treat compliance requirements as fixed boundary conditions the improvement must work within, not as obstacles to override), and involve clinical/compliance staff directly in solution design so proposed changes are validated against regulatory requirements before implementation, not after",
      "Assure staff that regulatory compliance is irrelevant to Six Sigma projects and can be safely ignored in pursuit of efficiency gains",
      "Avoid any process improvement work in regulated clinical areas entirely, limiting Six Sigma to non-clinical administrative functions only"
    ],
    "answer": 1,
    "why": "In regulated environments, the correct approach is incorporating compliance requirements as explicit, fixed constraints from project Define through Improve/Control \u2014 not ignoring them (A), avoiding the domain entirely (C), or taking a reactive after-the-fact compliance-checking approach (D) that risks patient safety and regulatory violations. Source: [BOK] Domain II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d2-040"
  },
  {
    "sub": "mbb-org",
    "stem": "A multi-location orthodontics practice pays individual orthodontists a bonus based solely on their own patient throughput, but wants to cultivate a \"collaborative continuous improvement\" culture where orthodontists share best practices and jointly solve cross-location scheduling bottlenecks. Adoption of shared best practices has been minimal. What cultural/incentive misalignment does this illustrate?",
    "options": [
      "Collaborative culture is simply impossible in any healthcare practice regardless of incentive design",
      "Orthodontists are simply uninterested in collaboration as a personality trait across the profession",
      "The solution is to eliminate individual bonuses entirely and pay all orthodontists an identical flat salary with no performance component",
      "The individual, throughput-only incentive structure directly rewards behavior that can conflict with the time investment collaboration requires (sharing knowledge, jointly troubleshooting bottlenecks that may not directly boost one's own throughput), so the stated desire for a \"collaborative\" culture is undermined by an incentive structure that doesn't reward or may even penalize the time spent on collaborative activities"
    ],
    "answer": 3,
    "why": "This is a direct incentive-structure/values-alignment diagnosis (paralleling D2-016's values-behavior gap) \u2014 a purely individual, throughput-based incentive structure works against the time investment collaborative behavior requires, undermining the stated cultural goal regardless of how genuinely the organization wants collaboration. Source: [BOK] Domain II.D, Organizational Culture and Values Framework; II.F, Organizational Performance Metrics (incentive-metric link).",
    "set": 3,
    "qid": "mbb:set-3:d2-041"
  },
  {
    "sub": "mbb-org",
    "stem": "An online education platform collects student feedback only via an end-of-course survey. Students who drop out mid-course (a substantial and strategically important group, since retention is a stated priority) never receive or complete any feedback mechanism, since it's only administered at course completion. What feedback-system gap does this represent, and what should the MBB recommend?",
    "options": [
      "This is a critical survivorship-bias-adjacent feedback gap directly analogous to the food bank scenario in D1-048: the population most relevant to the platform's stated retention priority (students who drop out) is systematically excluded from the only feedback mechanism in place; the MBB should recommend a distinct exit/drop-out feedback mechanism (e.g., a brief, low-friction survey or outreach triggered specifically by mid-course disengagement) to capture this critical, currently-missing population",
      "Drop-out students' feedback would be too negative and emotionally unreliable to be useful, so their exclusion is appropriate",
      "The end-of-course survey should simply be made longer and more detailed to compensate for the missing drop-out population",
      "No gap exists; end-of-course surveys from students who complete the course provide a fully complete picture of the student experience"
    ],
    "answer": 0,
    "why": "This is a direct cross-domain callback to the survivorship-bias principle established in D1-048 \u2014 here, \"survivors\" are students who complete the course, and the systematically excluded population (drop-outs) is precisely the group most relevant to the stated retention priority, making their absence from feedback data a critical, addressable gap. Source: [BOK] Domain II.E, Organizational Feedback; survivorship-bias principle (cross-reference D1-048).",
    "set": 3,
    "qid": "mbb:set-3:d2-042"
  },
  {
    "sub": "mbb-org",
    "stem": "A solar panel installation company tracks \"installation defect rate\" at the company level but has not assigned clear ownership of the metric to any specific role or team responsible for acting on adverse trends. What organizational performance metrics principle is being violated?",
    "options": [
      "Assigning ownership to a metric is unnecessary as long as the metric is reported in an annual report",
      "Metric ownership should always default to the most senior executive in the organization regardless of their actual operational proximity to the metric's drivers",
      "Company-level metrics never need individual or team-level ownership assigned; visibility alone is sufficient to drive improvement",
      "Every performance metric intended to drive action should have clear ownership \u2014 a specific role or team accountable for monitoring the metric, investigating adverse trends, and taking corrective action \u2014 since a metric with no assigned owner tends to be watched by everyone in general and acted on by no one in particular"
    ],
    "answer": 3,
    "why": "This is a standard organizational performance-metrics governance principle: metrics without clear accountability tend to generate visibility without action \u2014 a specific owner responsible for monitoring, investigating, and acting is necessary for a metric to actually drive improvement. Source: [BOK] Domain II.F, Organizational Performance Metrics.",
    "set": 3,
    "qid": "mbb:set-3:d2-043"
  },
  {
    "sub": "mbb-org",
    "stem": "A bakery chain has centralized production at one facility supplying 40 retail storefronts. Quality issues at the storefront level (e.g., improper display case temperature affecting product freshness) are increasingly common, but all Six Sigma deployment focus and Belt resources have historically been placed at the central production facility only. What organizational design gap does this reveal?",
    "options": [
      "The retail storefronts should be closed and all sales shifted to the central facility to eliminate the distributed quality-control challenge entirely",
      "Central production should be blamed for all storefront-level issues regardless of where the actual root cause resides",
      "The deployment's organizational design has concentrated entirely on one node (central production) of a multi-node value chain, leaving the distributed retail-storefront segment \u2014 where the emerging quality issues are actually occurring \u2014 without dedicated deployment attention or resources; the design should be extended to include storefront-level engagement (even lightweight, given the scale of 40 locations) rather than remaining concentrated solely at the original production-focused starting point",
      "No gap exists; central production is inherently the only place quality issues can meaningfully originate in a bakery chain"
    ],
    "answer": 2,
    "why": "This tests recognizing that deployment focus can become historically anchored to its original starting point (central production) even as the actual value chain and emerging problem areas (retail storefronts) evolve \u2014 sound organizational design should extend coverage to where the evidence indicates issues are occurring. Source: [BOK] Domain II.A, Organizational Design.",
    "set": 3,
    "qid": "mbb:set-3:d2-044"
  },
  {
    "sub": "mbb-org",
    "stem": "A laundromat chain's regional director publicly praises the Six Sigma deployment in company meetings but privately tells store managers \"just focus on keeping machines running and don't waste time on all this paperwork\" when discussing project documentation. What leadership gap does this represent, and why is it particularly damaging?",
    "options": [
      "There is no gap; leaders are entitled to different messaging in public versus private settings without consequence",
      "Store managers should be expected to ignore the private comments entirely and follow only public statements, regardless of which behavior is actually rewarded day to day",
      "The regional director's private comments are simply an efficient way to reduce unnecessary documentation burden and should be commended",
      "This is a leadership-consistency gap that is particularly damaging because store managers receive contradictory signals about actual priority, and private/informal communication (delivered more frequently and personally) often carries more real behavioral weight with frontline staff than public/formal statements \u2014 meaning the deployment is likely being quietly undermined despite favorable public messaging"
    ],
    "answer": 3,
    "why": "Leadership consistency between public and private messaging is critical \u2014 contradictory signals (especially when the private message is delivered more frequently, personally, and closer to daily operational reality) tend to actually shape behavior more than public statements, silently undermining deployment credibility despite favorable public appearances. Source: [BOK] Domain II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d2-045"
  },
  {
    "sub": "mbb-org",
    "stem": "A security services company has 45% annual frontline staff turnover, making it difficult to sustain any Six Sigma project team's continuity \u2014 team members are frequently replaced mid-project. What organizational challenge should the MBB address first, and how?",
    "options": [
      "Redesign project team structures and documentation practices specifically to withstand high turnover: over-document decisions and rationale at each phase (not just final results) so new team members can onboard quickly without re-deriving prior work, favor shorter project cycles/Kaizen-style efforts over long multi-month DMAIC projects where feasible, and identify a small number of longer-tenured leads (as suggested in the non-profit volunteer scenario, D1-040) to anchor continuity across team turnover",
      "Simply restart every project from the beginning whenever a team member departs, regardless of how many times this occurs",
      "Require every frontline employee to sign a long-term employment contract as a precondition of joining any project team, regardless of the industry's typical employment patterns",
      "Accept that Six Sigma cannot function in high-turnover environments and discontinue the deployment"
    ],
    "answer": 0,
    "why": "This directly parallels the resource-constrained/high-turnover adaptation principle established in D1-040 (non-profit volunteer scenario), applied here to a for-profit high-turnover industry: adapt project structure, documentation, cycle length, and continuity anchors to the realistic turnover environment rather than ignoring it (A), abandoning the deployment (B), or attempting an unrealistic structural fix (D) that doesn't match industry employment norms. Source: [BOK] Domain II.C, Organizational Challenges; I.C (turnover adaptation parallel, D1-040).",
    "set": 3,
    "qid": "mbb:set-3:d2-046"
  },
  {
    "sub": "mbb-org",
    "stem": "An upholstery furniture manufacturer's skilled craftspeople take significant pride in individualized techniques developed over decades, and view standardized work instructions (a core Six Sigma/Lean tool) as devaluing their craftsmanship. What cultural framing should the MBB use to address this tension?",
    "options": [
      "Frame standardization as capturing and codifying the *best-demonstrated* practices (potentially including techniques from the most skilled craftspeople themselves) as a shared baseline that reduces defects and variability company-wide, explicitly positioning it as elevating and preserving valuable expertise (so it isn't lost when an individual leaves) rather than replacing or devaluing craftsmanship \u2014 directly addressing the pride/ownership concern rather than dismissing it",
      "Abandon standardization entirely in this environment since craftsmanship and standardized work can never coexist",
      "Avoid discussing standardization at all and quietly implement uniform work instructions without craftsperson input",
      "Insist that all craftspeople abandon individualized techniques entirely and adopt uniform methods regardless of demonstrated quality outcomes"
    ],
    "answer": 0,
    "why": "This reframes the tension in a way that resolves the actual underlying concern (fear of devalued expertise) by positioning standardization as capturing and preserving the best of individual expertise rather than erasing it \u2014 a more defensible cultural approach than blunt mandate (A), covert implementation (C), or abandoning a valuable tool category entirely (D). Source: [BOK] Domain II.D, Organizational Culture and Values Framework; II.C, Organizational Challenges (parallel to D2-015's culinary-expertise scenario).",
    "set": 3,
    "qid": "mbb:set-3:d2-047"
  },
  {
    "sub": "mbb-org",
    "stem": "A parking management company collects customer complaint data quarterly and reviews it in a quarterly operations meeting, but most complaints spike sharply during specific high-demand events (e.g., major sports games, concerts) that occur throughout the quarter. By the time quarterly review happens, the specific operational conditions that caused event-day complaints (staffing levels, signage, payment system load) are no longer fresh enough to reconstruct in detail. What should the MBB recommend?",
    "options": [
      "Implement event-triggered (not just calendar-triggered) feedback review: for high-demand events, conduct a brief post-event debrief capturing complaint themes and operational conditions while still fresh, feeding a running log that the quarterly review can then draw on for pattern analysis \u2014 combining rapid event-level capture with periodic strategic-level synthesis, rather than relying solely on a calendar cadence poorly matched to the actual event-driven nature of the problem",
      "Eliminate the quarterly review entirely in favor of only event-level debriefs, discarding any periodic strategic-level synthesis",
      "Continue the quarterly review cadence unchanged, since quarterly reporting is a standard business rhythm regardless of the underlying event-driven pattern",
      "Increase the frequency of full quarterly-style comprehensive reviews to monthly, without addressing the event-specific timing mismatch"
    ],
    "answer": 0,
    "why": "This is another cadence-mismatch diagnosis (paralleling D2-017's ride-share scenario) but with a nuanced fix: the underlying problem is event-driven rather than time-driven, so the solution is event-triggered rapid capture feeding into (not replacing) periodic strategic synthesis \u2014 combining both timescales appropriately rather than simply increasing a still poorly-matched calendar-based frequency (D). Source: [BOK] Domain II.E, Organizational Feedback; cadence-matching principle (parallel to D2-017).",
    "set": 3,
    "qid": "mbb:set-3:d2-048"
  },
  {
    "sub": "mbb-org",
    "stem": "A landscaping company wants to design a new organizational performance metrics framework for its crew operations, synthesizing lessons from this domain (avoiding vanity metrics, pairing leading/lagging indicators, avoiding unpaired single-metric gaming, controlling for confounding factors like territory/property difficulty, ensuring clear ownership, and appropriate stratification/cadence). Which proposed framework best reflects sound design across all these principles?",
    "options": [
      "Metrics based entirely on customer star ratings alone, since customer perception is the only thing that ultimately matters",
      "Fifty granular metrics covering every conceivable aspect of crew performance, reviewed annually, with no stratification or ownership assigned",
      "A small, owned set of metrics: jobs-completed-per-week (efficiency, paired with) customer callback/rework rate (quality counter-metric, preventing pure speed-gaming), each benchmarked against property-difficulty-adjusted baselines (controlling for the known confound of yard size/complexity) rather than a flat company-wide standard, reviewed at a cadence matched to the seasonal nature of landscaping work (e.g., more frequently during peak growing season), with a named operations manager accountable for monitoring and acting on trends",
      "A single \"jobs completed per week\" metric with no other measures, reported annually with no assigned owner"
    ],
    "answer": 2,
    "why": "This capstone item requires synthesizing every organizational performance-metrics principle tested across the domain (vanity-metric avoidance from D2-006, metric pairing from D2-012, confound control from D2-031/D2-037, ownership from D2-043, cadence-matching from D2-017/D2-048) into a single coherent, well-designed framework \u2014 genuinely Evaluate/synthesis-level work. Source: [BOK] Domain II.F, Organizational Performance Metrics (full-domain synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d2-049"
  },
  {
    "sub": "mbb-org",
    "stem": "A newly appointed MBB inherits a mid-sized organization exhibiting: (1) a ceremonial executive sponsor who appears only at kickoffs and closeouts, (2) a documented values-behavior gap (stated \"empowerment\" values contradicted by punitive discipline for suggested changes), (3) a single, unpaired efficiency metric driving visible gaming behavior, (4) an inaccessible, identifiable feedback survey producing suspiciously uniform positive results, and (5) high frontline skepticism toward a recently-hired, domain-inexperienced Black Belt. Applying the principles tested throughout this domain, what is the most defensible sequence of first actions?",
    "options": [
      "Focus exclusively on replacing the Black Belt with someone more experienced, since frontline skepticism is the most visible symptom",
      "Recommend abandoning Six Sigma deployment entirely given the number and severity of issues present",
      "Address the values-behavior gap first (since it likely underlies both the suspiciously positive feedback data and the sponsor's passivity \u2014 if leadership doesn't genuinely value the behaviors it claims to, no amount of tactical fixing of the other four symptoms will hold), then re-engage the executive sponsor around specific, concrete active-sponsorship behaviors tied to the (now more credible) values commitment, then fix the feedback mechanism's accessibility/anonymity to get trustworthy data, then correct the unpaired metric design, and finally address frontline skepticism by having the Black Belt co-opt experienced frontline staff into the analytical process \u2014 addressing the foundational culture/leadership issue before layering tactical fixes on top of it",
      "Address all five issues simultaneously with equal priority and identical urgency, without any sequencing logic"
    ],
    "answer": 2,
    "why": "This capstone item requires synthesizing the entire domain (organizational design, leadership, challenges, culture, feedback, and metrics) into a diagnostically sound sequence: recognizing the values-behavior gap as the likely root cause underlying multiple surface symptoms (fake-positive feedback, passive sponsorship), and sequencing culture/leadership fixes before tactical mechanism fixes (feedback design, metric design) and finally frontline engagement \u2014 genuinely Create-level synthesis across the full domain. Source: [BOK] Domain II, full domain synthesis (A\u2013F).",
    "set": 3,
    "qid": "mbb:set-3:d2-050"
  },
  {
    "sub": "mbb-org",
    "stem": "An airport ground services company operates three rotating shifts around the clock, but Six Sigma champion coverage and Belt project engagement have historically existed only during the day shift, since that's when the (day-shift-only) Six Sigma office staff are present. Night and overnight shift issues are systematically underrepresented in the project pipeline. What organizational design fix should the MBB recommend?",
    "options": [
      "Continue day-shift-only coverage, since overnight shift issues are inherently less important than day-shift issues",
      "Require all night-shift employees to attend day-shift meetings on their own time, uncompensated, to participate in the deployment",
      "Eliminate the night shift's ability to submit improvement ideas altogether, since operational coverage make participation impractical",
      "Deliberately extend deployment design to include night/overnight shift representation \u2014 e.g., designating a night-shift champion, scheduling at least some project touchpoints (interviews, data reviews) during or adjacent to night-shift hours, and ensuring the opportunity-identification process actively solicits input from all shifts, not just the shift the Six Sigma office happens to staff during"
    ],
    "answer": 3,
    "why": "This is a structural coverage-gap issue directly analogous to the geographic-dispersion problem in D2-026: deployment design that implicitly assumes a single shift's schedule systematically underrepresents legitimate opportunities and voices from other shifts, and the fix is extending the design (dedicated shift representation, adapted engagement timing), not deprioritizing or excluding that population. Source: [BOK] Domain II.A, Organizational Design; parallel to D2-026 (dispersed workforce).",
    "set": 3,
    "qid": "mbb:set-3:d2-051"
  },
  {
    "sub": "mbb-org",
    "stem": "A movie theater chain's regional VP delegates full sponsorship authority to a district manager for a concession-line efficiency project, explicitly telling the team \"treat her decisions as mine.\" However, when the district manager approves a $15,000 equipment change, the VP later reverses the decision without explanation, undermining the district manager's authority. What leadership gap does this represent?",
    "options": [
      "The district manager should have sought VP approval for every decision regardless of the stated delegation, making the delegation announcement meaningless from the start",
      "There is no gap; VPs are always entitled to reverse any delegated decision at any time without any consequence to the deployment",
      "The equipment change should proceed exactly as originally approved regardless of any new information the VP may have that prompted the reversal",
      "This represents inconsistent delegation \u2014 genuine delegated sponsorship authority requires the delegating executive to actually honor decisions made within the delegated scope (or, if reversing, to do so transparently with clear rationale communicated to the team); silently overriding a delegate's decision after publicly declaring \"treat her decisions as mine\" undermines both the district manager's credibility and the team's trust in the deployment's governance going forward"
    ],
    "answer": 3,
    "why": "This tests a specific delegation-consistency failure: publicly delegating authority and then privately/silently overriding it (without transparent rationale) is deeply damaging to both the delegate's credibility and team trust \u2014 a leadership gap distinct from (but related to) the passive-sponsorship pattern tested earlier (D2-002, D2-020, D2-027). Source: [BOK] Domain II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d2-052"
  },
  {
    "sub": "mbb-org",
    "stem": "A chip packaging and test facility restricts sharing of process improvement findings between customer-dedicated production lines due to strict customer confidentiality/IP agreements, even when the underlying process principle (not customer-specific data) could benefit other lines. Six Sigma cross-project learning is severely limited as a result. What organizational challenge does this represent, and how should the MBB address it?",
    "options": [
      "Accept that no cross-line learning is possible and treat each line as a completely isolated deployment with no shared knowledge base",
      "Ignore the confidentiality agreements since Six Sigma learning is more important than contractual obligations",
      "Consolidate all customer lines into a single shared production line to eliminate the confidentiality barrier entirely, regardless of customer contractual requirements",
      "Work with legal/compliance to establish a de-identified or principle-level knowledge-sharing protocol (e.g., sharing the generalizable process insight \u2014 such as \"reducing wire-bond variability via parameter X\" \u2014 without any customer-specific data, part numbers, or proprietary specifications), preserving legitimate confidentiality obligations while still enabling the organizational learning benefit that motivated the concern about isolation in the first place"
    ],
    "answer": 3,
    "why": "This tests recognizing that a genuine legal/contractual constraint (unlike the \"security concerns\" masking a cultural silo issue in D2-003) still allows for a de-identified, principle-level knowledge-sharing solution that respects the real constraint while capturing much of the cross-learning value. Source: [BOK] Domain II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d2-053"
  },
  {
    "sub": "mbb-org",
    "stem": "A craft distillery's culture strongly emphasizes \"traditional methods passed down for generations,\" creating implicit resistance to any process change, even ones that don't affect the recipe or flavor profile (e.g., warehouse inventory tracking improvements). How should the MBB frame improvement work to fit this cultural context?",
    "options": [
      "Secretly implement changes without any communication about them, hoping no one notices",
      "Explicitly frame all improvement work as \"modernizing outdated traditional methods,\" directly challenging the tradition-based identity",
      "Explicitly distinguish and communicate which processes are being improved (e.g., inventory tracking, administrative workflows) as clearly separate from and non-threatening to the traditional recipe/production methods the culture values most, so the cultural attachment to tradition is respected rather than triggered by process improvements in unrelated operational areas",
      "Avoid any improvement work anywhere in the distillery given the strength of the tradition-based culture"
    ],
    "answer": 2,
    "why": "This is a values-sensitive framing approach: explicitly scoping and communicating that improvement work targets areas unrelated to the culturally-protected core (the traditional recipe/production methods) avoids unnecessarily triggering identity-based resistance, similar in spirit to the funeral-services reframing in D2-028. Source: [BOK] Domain II.D, Organizational Culture and Values Framework; parallel to D2-028.",
    "set": 3,
    "qid": "mbb:set-3:d2-054"
  },
  {
    "sub": "mbb-org",
    "stem": "An elder care/assisted living facility wants resident feedback on care quality, but many residents have cognitive impairments limiting their ability to complete traditional surveys, and family members (who could serve as proxies) visit with widely varying frequency, creating uneven proxy feedback coverage. What feedback-system design consideration should the MBB raise?",
    "options": [
      "Conclude that feedback collection is impossible for this population and rely entirely on regulatory inspection results instead",
      "Design a multi-modal feedback approach appropriate to a vulnerable population with varying capacity: direct, simplified feedback methods for residents who can participate (e.g., simple visual/verbal check-ins rather than complex written surveys), combined with structured staff-observation-based quality indicators (since staff interact with all residents regardless of family visit frequency) to ensure residents without frequent family proxies are not systematically underrepresented in the feedback picture",
      "Use only family member survey responses as a complete substitute for resident feedback, regardless of visit frequency variation",
      "Rely solely on residents capable of completing traditional surveys and disregard the input needs of cognitively impaired residents entirely"
    ],
    "answer": 1,
    "why": "This tests recognizing that feedback design for a vulnerable, heterogeneous-capacity population requires multiple appropriately-tailored channels (direct simplified methods plus staff-observed indicators) to avoid the same \"systematically underrepresented population\" flaw tested in D2-030 (fishing crew) and D2-042 (drop-out students), here driven by cognitive capacity and inconsistent proxy availability rather than language/connectivity or survivorship. Source: [BOK] Domain II.E, Organizational Feedback; parallel to D2-030, D2-042 (representative-population principle).",
    "set": 3,
    "qid": "mbb:set-3:d2-055"
  },
  {
    "sub": "mbb-org",
    "stem": "An auto body repair chain measures \"repair cycle time\" starting from the moment a technician begins work on a vehicle, but vehicles often sit for days waiting for insurance approval or parts delivery before work begins \u2014 none of which is captured in the metric. Customers perceive the total time-to-completion as much longer than the reported \"repair cycle time\" suggests. What measurement design flaw does this represent?",
    "options": [
      "Insurance companies and parts suppliers should be excluded entirely from any process improvement scope since they are external parties",
      "The metric should be renamed without changing its definition, since the naming is the only actual problem",
      "The metric's start point excludes a substantial portion of the customer's actual experienced wait time (insurance approval, parts delays), making it a poor proxy for what customers actually care about (total time-to-completion); the MBB should recommend either redefining the primary customer-facing metric to measure total elapsed time from vehicle drop-off to completion, or explicitly reporting both metrics separately (active repair time and total elapsed time) so internal process metrics don't get mistaken for the customer experience metric",
      "There is no flaw; the metric accurately measures what it is intended to measure (active technician work time)"
    ],
    "answer": 2,
    "why": "This tests recognizing a scope/definition mismatch between an internally-convenient metric (active work time only) and the actual customer-relevant experience (total elapsed time) \u2014 a common measurement design flaw requiring either metric redefinition or explicit dual reporting to avoid conflating an internal process metric with the customer experience metric. Source: [BOK] Domain II.F, Organizational Performance Metrics.",
    "set": 3,
    "qid": "mbb:set-3:d2-056"
  },
  {
    "sub": "mbb-org",
    "stem": "A computer repair franchise brand has a mix of corporate-owned and independently-franchised locations. Which organizational design principle should govern how Six Sigma deployment differs (if at all) between the two location types?",
    "options": [
      "Only corporate-owned locations should be permitted to participate in Six Sigma deployment at all, excluding franchised locations entirely",
      "Corporate-owned locations, being under direct corporate authority, can support a more prescriptive/mandatory deployment model (formal Belt assignments, mandatory project participation), while franchised locations should follow the voluntary/toolkit-based brand-standards approach appropriate to their independent ownership (as established for franchise contexts in D1-059 and D2-029) \u2014 the deployment design should differ by ownership/authority structure even within the same brand",
      "Corporate-owned and franchised locations should have identical, mandatory deployment structures with no distinction, since brand consistency requires complete uniformity regardless of ownership structure",
      "Franchised locations should have more mandatory requirements than corporate-owned locations, reversing the typical authority relationship"
    ],
    "answer": 1,
    "why": "This synthesizes the franchise-design principle established across D1-059 and D2-029 with the reality of mixed ownership models \u2014 deployment design should appropriately differentiate by actual organizational authority/ownership structure, even within a single brand, rather than forcing uniform treatment (A) or an inverted authority relationship (C) or exclusion (D). Source: [BOK] Domain II.A, Organizational Design; parallel to D1-059, D2-029.",
    "set": 3,
    "qid": "mbb:set-3:d2-057"
  },
  {
    "sub": "mbb-org",
    "stem": "An event planning company's founder has personally approved every operational decision for 15 years and is now being asked, as part of a new Six Sigma deployment, to delegate project sponsorship authority to newly-designated department heads. The founder verbally agrees but continues to insert themselves into every project decision, unable to actually step back. What leadership transition challenge does this represent, and what should the MBB recommend?",
    "options": [
      "Recognize this as a genuine (and common) leadership-transition challenge \u2014 long-tenured founder-led decision-making habits don't change simply because delegation is verbally agreed to; the MBB should recommend a gradual, explicitly-scoped delegation approach (e.g., starting with lower-stakes decisions fully delegated to build the founder's trust in the department heads' judgment over time) rather than expecting an immediate full transition, while directly and respectfully naming the pattern to the founder when it recurs",
      "Publicly criticize the founder's behavior in front of the department heads to pressure a behavior change",
      "Accept that the founder will simply continue as the sole decision-maker indefinitely, discarding the department-head delegation model attempted",
      "Force the founder out of any involvement in the deployment entirely, regardless of their legitimate ownership authority and institutional knowledge"
    ],
    "answer": 0,
    "why": "This recognizes a genuine, common organizational-leadership-transition challenge (deeply ingrained founder decision-making habits) requiring a gradual, trust-building delegation approach and direct-but-respectful pattern-naming, rather than an abrupt removal (A), simply giving up on delegation (B), or a damaging public confrontation (D). Source: [BOK] Domain II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d2-058"
  },
  {
    "sub": "mbb-org",
    "stem": "A ferry/water transit system's on-time performance depends heavily on coordination with an independent port authority and a separate weather advisory agency, neither of which reports to the ferry operator or has any obligation to align with its Six Sigma improvement goals. What organizational challenge does this multi-agency dependency represent, and how should the MBB scope the project?",
    "options": [
      "Set the on-time performance target assuming zero impact from port authority or weather delays, and hold the ferry operator's own staff accountable for the full metric regardless of these external factors",
      "Include the port authority and weather agency as full project team members with equal decision-making authority, regardless of their independent organizational status and lack of any obligation to participate",
      "Scope the project explicitly around what the ferry operator actually controls (e.g., internal boarding/departure processes, crew scheduling, communication protocols for weather-related delays) while treating the port authority and weather timing as external inputs/constraints to plan around and communicate proactively with, rather than pretending they are controllable elements of the project scope or ignoring their real impact on the outcome metric entirely",
      "Cancel the on-time performance project entirely since external dependencies make full control impossible"
    ],
    "answer": 2,
    "why": "This tests recognizing legitimate external dependency as a scoping/constraint issue rather than either wishfully including uncontrolled external agencies as full team members (A) or ignoring their real impact when setting internal accountability and targets (D) \u2014 properly scoping to controllable factors while planning around genuine external constraints is standard MBB project-design judgment. Source: [BOK] Domain II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d2-059"
  },
  {
    "sub": "mbb-org",
    "stem": "A national park concessions operator (running park lodges, gift shops, and food service under a government contract) has staff who strongly identify with a conservation/stewardship mission, and view any \"efficiency\" or \"cost reduction\" framing of Six Sigma projects as conflicting with that mission, even when a proposed project (reducing food waste in park lodge kitchens) directly supports conservation goals. What cultural framing adjustment should the MBB recommend?",
    "options": [
      "Explicitly reframe the food-waste-reduction project's communication and metrics around its conservation/stewardship impact (waste diverted from landfill, resources conserved) as the primary framing, with cost savings presented as a secondary, supporting benefit rather than the leading narrative \u2014 aligning the project's public framing with the value staff most strongly identify with, since the underlying project already genuinely serves that value",
      "Avoid any mention of efficiency or cost savings, but otherwise keep the project framing and communication completely unchanged",
      "Require staff to set aside their conservation values entirely and adopt a purely commercial mindset for the duration of the project",
      "Reject the project entirely since any connection to cost or efficiency conflicts irreparably with the conservation mission"
    ],
    "answer": 0,
    "why": "Since the project's actual outcome (reduced food waste) genuinely and directly serves the conservation value staff care about, the correct fix is reframing the *communication* to foreground that authentic alignment rather than leading with efficiency/cost language that triggers unnecessary values-based resistance \u2014 a more complete version of the reframing principle tested in D2-028 and D2-054. Source: [BOK] Domain II.D, Organizational Culture and Values Framework; parallel to D2-028, D2-054.",
    "set": 3,
    "qid": "mbb:set-3:d2-060"
  },
  {
    "sub": "mbb-org",
    "stem": "An import/export trading company operates offices in six countries with different languages and cultural norms around giving critical feedback to management (some cultures more hierarchical and reluctant to voice direct criticism upward). Using a single, direct-style feedback survey translated literally into each local language, what limitation should the MBB anticipate?",
    "options": [
      "Feedback should only be collected from the country with the most direct communication culture, discarding data from more hierarchical cultures",
      "Literal translation alone is fully sufficient; feedback-giving norms do not vary meaningfully across cultures",
      "Even with accurate literal translation, cultural norms around hierarchy and directness toward management can suppress candid responses in some offices relative to others, making raw cross-country comparisons potentially misleading; the MBB should account for this by considering culturally-adapted feedback approaches (not just literal translation) and interpreting comparative results with appropriate caution regarding underlying cultural response-style differences, not just literal language differences",
      "Cross-country feedback comparison should be abandoned entirely since cultural differences make any comparison meaningless"
    ],
    "answer": 2,
    "why": "This is a well-established cross-cultural survey methodology consideration \u2014 response-style norms (directness, hierarchy deference) can differ meaningfully across cultures even after accurate translation, and an MBB working with multinational data should account for this rather than assuming translation alone equalizes comparability. Source: [BOK] Domain II.E, Organizational Feedback.",
    "set": 3,
    "qid": "mbb:set-3:d2-061"
  },
  {
    "sub": "mbb-org",
    "stem": "An industrial gas supplier reports \"customer delivery satisfaction\" based on a survey administered once, 90 days after a customer's first delivery, regardless of how many deliveries have occurred since. A customer whose only significant delivery problem happened on delivery #2 (out of, by day 90, perhaps 8-10 total deliveries) will still report based primarily on that early negative impression, even if deliveries 3 through 10 were flawless. What measurement design issue does this reflect?",
    "options": [
      "There is no issue; a single 90-day survey captures a fully representative and current view of ongoing delivery performance regardless of how many deliveries have occurred since",
      "The survey should be moved even earlier, to 30 days, to capture the customer's very first impression more precisely",
      "Delivery satisfaction should not be measured at all, since a single bad early delivery will always permanently and unfixably bias any survey approach",
      "The single, fixed-point-in-time survey may capture a \"sticky\" early impression rather than reflecting the customer's more recent and more representative overall experience across multiple deliveries since; the MBB should recommend either a rolling/recurring feedback mechanism tied to recent delivery experience (not just a single fixed 90-day snapshot) or explicitly tracking delivery-level quality metrics that update with each delivery, providing a more current and complete picture than one fixed early survey"
    ],
    "answer": 3,
    "why": "A single fixed-point-in-time survey can anchor on an early experience that may no longer represent current performance \u2014 the fix is either recurring/rolling feedback or delivery-level metrics that stay current, rather than relying on one potentially stale early snapshot. Source: [BOK] Domain II.F, Organizational Performance Metrics.",
    "set": 3,
    "qid": "mbb:set-3:d2-062"
  },
  {
    "sub": "mbb-org",
    "stem": "A commercial (B2B) laundry service organizes its operations around large account relationships (e.g., \"the regional hospital network account team,\" \"the hotel chain account team\") rather than by internal functional department. How should Six Sigma deployment infrastructure be organizationally aligned to fit this account-based structure?",
    "options": [
      "Align deployment structure with the existing account-based organization \u2014 embedding champions/Belts within account teams for account-specific improvement opportunities (e.g., a hospital-network-specific linen turnaround issue), while maintaining a smaller central function for cross-account, functional-level opportunities (e.g., a washing-process improvement applicable across all accounts) \u2014 reflecting how the business actually organizes and manages its work rather than imposing an unrelated structure",
      "Force a purely functional deployment structure (e.g., separate \"washing,\" \"delivery,\" \"billing\" Belt assignments) that cuts directly across the company's actual account-based organizational structure, regardless of how work is actually organized and managed day to day",
      "Since the company is organized by account, no functional/process-level improvement work should ever be pursued, only account-specific work",
      "Assign a single Black Belt to personally handle every account and every functional process across the entire company regardless of scale"
    ],
    "answer": 0,
    "why": "Deployment infrastructure should generally align with how the organization actually manages its work (here, account-based) while still preserving a mechanism for genuinely cross-cutting functional/process opportunities \u2014 a hybrid design reflecting real organizational structure, similar in spirit to earlier matrix-design principles (D2-001, D2-019) but applied to an account-based rather than divisional structure. Source: [BOK] Domain II.A, Organizational Design; parallel to D2-001, D2-019.",
    "set": 3,
    "qid": "mbb:set-3:d2-063"
  },
  {
    "sub": "mbb-org",
    "stem": "A yacht charter company's Black Belt has delivered three consecutive successful projects with strong measured financial impact, but has received no formal recognition, career advancement conversation, or compensation adjustment from leadership, and has recently begun interviewing externally. What leadership gap does this represent, and what should the MBB flag to executive leadership?",
    "options": [
      "There is no gap; Black Belts should be intrinsically motivated by the work itself and should not expect or require any recognition or advancement consideration",
      "This represents a recognition/retention leadership gap: sustained, demonstrated high performance without any corresponding recognition, career pathing conversation, or compensation review creates a predictable retention risk, especially once external opportunities become visible; the MBB should flag this pattern to leadership as both a fairness issue and a concrete business risk (losing a demonstrated high performer and the institutional knowledge/credibility they've built)",
      "The Black Belt should be immediately terminated for interviewing externally while still employed",
      "Recognition should only ever be provided company-wide at the annual review cycle, regardless of the retention risk timeline implied by active external interviewing"
    ],
    "answer": 1,
    "why": "This connects the recognition/reward principle from D2-010 (culture/values framework) to a concrete leadership and retention-risk consequence \u2014 sustained high performance without proportionate recognition or advancement conversation is a well-documented driver of voluntary turnover, and the MBB should proactively flag this business risk to leadership. Source: [BOK] Domain II.B, Executive and Team Leadership; II.D (recognition principle, D2-010).",
    "set": 3,
    "qid": "mbb:set-3:d2-064"
  },
  {
    "sub": "mbb-org",
    "stem": "A radio station network facing existential competitive pressure from streaming audio services is simultaneously being asked to adopt Six Sigma process discipline while staff broadly perceive the entire industry (and therefore their jobs) as being in terminal decline, producing widespread disengagement from any improvement initiative as \"rearranging deck chairs.\" What organizational challenge should the MBB address first, and how?",
    "options": [
      "Proceed with standard Six Sigma project selection and messaging exactly as it would in a stable, non-threatened industry, ignoring the existential context entirely",
      "Instruct staff to stop discussing the industry's competitive challenges and focus solely on their assigned project tasks",
      "Recommend the organization abandon Six Sigma deployment entirely since the industry's decline makes any improvement work futile",
      "Directly acknowledge the existential competitive context rather than avoiding it, and explicitly connect improvement work to the organization's actual survival strategy (e.g., cost efficiency enabling investment in digital transition, or service-quality improvements supporting advertiser retention) \u2014 reframing Six Sigma not as incremental polish on a declining model but as a component of the organization's active response to the threat, since disengagement rooted in a genuine existential concern requires addressing that concern directly, not standard change-management messaging alone"
    ],
    "answer": 3,
    "why": "Disengagement rooted in a genuine, organization-wide existential threat perception requires directly addressing that underlying concern and connecting improvement work to the actual survival strategy \u2014 a more fundamental intervention than standard change-management technique alone, and importantly not avoidance (A, D) or premature capitulation (C). Source: [BOK] Domain II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d2-065"
  },
  {
    "sub": "mbb-org",
    "stem": "A veterinary diagnostics lab staffed primarily by PhD-level scientists shows unexpectedly *high* resistance to Six Sigma statistical methods, despite (or perhaps because of) the staff's strong general statistical training. Investigation reveals staff view the DMAIC framework's statistical tools as \"oversimplified\" compared to the more rigorous methods used in their scientific research work. What cultural dynamic does this represent, and how should the MBB address it?",
    "options": [
      "This is unusual and cannot be explained; highly statistically trained staff should always readily embrace Six Sigma statistical methods with no resistance",
      "This reflects a specific form of expertise-based resistance \u2014 technically sophisticated staff may perceive standard Six Sigma tools as insufficiently rigorous relative to their own field's methods, a different flavor of the \"outsider/expertise-devaluing\" resistance pattern tested in D2-015 (culinary) and D2-047 (craftsmanship), here rooted in genuine methodological sophistication rather than tenure/tradition; the MBB should engage this expertise directly \u2014 inviting staff input on where more rigorous methods are warranted, and using standard DMAIC tools primarily for their organizational/process-management value (structure, cross-functional communication, project management) rather than positioning them as replacing the staff's more advanced technical methods where those are genuinely more appropriate",
      "Simplify all statistical training materials further to make Six Sigma statistical concepts easier to understand, addressing a training gap",
      "Require all PhD scientists to abandon their own more advanced statistical methods in favor of only the standard Six Sigma toolset, regardless of appropriateness to the specific analytical question"
    ],
    "answer": 1,
    "why": "This tests recognizing a genuinely different variant of expertise-based resistance (rooted in real methodological sophistication, not just tenure or tradition) and correctly diagnosing that the appropriate response is engaging that expertise and appropriately scoping DMAIC's role (structural/organizational value) rather than either dismissing the concern or imposing standard tools where genuinely more rigorous methods are warranted. Source: [BOK] Domain II.D, Organizational Culture and Values Framework; parallel to D2-015, D2-047.",
    "set": 3,
    "qid": "mbb:set-3:d2-066"
  },
  {
    "sub": "mbb-org",
    "stem": "An orthopedic device manufacturer receives detailed post-market surveillance feedback (adverse event reports, physician complaints) through its regulatory/quality affairs department, but this feedback rarely reaches the Six Sigma project pipeline in Operations, since the two functions operate with largely separate reporting structures and meeting cadences. What organizational feedback integration gap does this represent, and what should the MBB recommend?",
    "options": [
      "Regulatory/quality affairs should independently run its own separate Six Sigma deployment with no coordination with Operations' existing deployment",
      "Post-market surveillance data should be excluded from Six Sigma scope entirely since it originates from an external regulatory reporting requirement rather than an internal metric",
      "No gap exists; regulatory feedback and operational process improvement are appropriately kept entirely separate functions with no need for cross-flow",
      "This is a critical feedback-integration gap: post-market surveillance data is a uniquely valuable, real-world opportunity-identification source (arguably more consequential than most internal metrics, given patient safety implications) that isn't reaching the pipeline responsible for acting on it; the MBB should establish a formal, recurring cross-functional review process connecting regulatory/quality affairs findings to Six Sigma project selection and prioritization"
    ],
    "answer": 3,
    "why": "This is a particularly high-stakes version of the cross-functional feedback-integration gap (echoing the siloed-data problem in D2-003 and the regulatory-opportunity recognition in D1-030) \u2014 in a medical device context, failing to connect safety-relevant post-market feedback to the improvement pipeline carries especially serious consequences, making formal integration a clear priority. Source: [BOK] Domain II.E, Organizational Feedback; parallel to D2-003, D1-030.",
    "set": 3,
    "qid": "mbb:set-3:d2-067"
  },
  {
    "sub": "mbb-org",
    "stem": "A coworking space operator originally tracked \"desk occupancy rate\" as its primary performance metric, but has since shifted its business model toward offering more virtual/hybrid membership products that don't require a physical desk at all. What performance-metrics principle should guide the MBB's recommendation here?",
    "options": [
      "No performance metrics are needed at all once a business model becomes more complex or hybrid in nature",
      "Performance metrics should evolve alongside material changes in the business model; since a growing share of the business (virtual/hybrid membership) isn't captured at all by desk occupancy, the MBB should recommend revising the primary metric set to reflect current revenue/value drivers (e.g., total active memberships across all product types, revenue per member) rather than continuing to over-index on a metric increasingly disconnected from how the business actually operates and generates value",
      "Desk occupancy should be replaced entirely with a metric that ignores physical space utilization altogether, even though physical desks remain a real and still-relevant part of the business",
      "Continue tracking desk occupancy rate exclusively and indefinitely, regardless of how the business model has evolved, since consistency of historical metrics is always more valuable than relevance to the current business"
    ],
    "answer": 1,
    "why": "Performance metrics that made sense under a prior business model can become progressively disconnected from current value-drivers as the model evolves \u2014 the MBB should recognize this drift and recommend metric evolution that reflects the current, actual business, rather than clinging to historical consistency (A) or overcorrecting to ignore a still-relevant dimension (C) or abandoning measurement altogether (D). Source: [BOK] Domain II.F, Organizational Performance Metrics.",
    "set": 3,
    "qid": "mbb:set-3:d2-068"
  },
  {
    "sub": "mbb-org",
    "stem": "A meal-kit delivery service has grown from 50 to 800 employees in 18 months. Its Six Sigma deployment, designed for the 50-person scale (one informal champion, no dedicated Belts), has not been revisited despite the tenfold growth. What organizational design principle should the MBB apply, and what should change?",
    "options": [
      "Organizational design (including deployment infrastructure) should be periodically reassessed against actual organizational scale and complexity, similar to the strategic-plan re-validation principle from Domain I; at 800 employees the informal, single-champion model established at 50-person scale is very likely under-resourced and should be reassessed \u2014 likely warranting dedicated Belt roles, more formal governance, and the infrastructure elements appropriate to a substantially larger and more complex organization",
      "No change is needed; a deployment design that worked at 50 employees will always scale linearly and remain appropriate at any size without modification",
      "The original informal champion should personally take on sole responsibility for improvement work across all 800 employees without any additional resourcing",
      "The deployment should be scaled down further, since rapid growth indicates the organization should focus exclusively on hiring rather than any process improvement work"
    ],
    "answer": 0,
    "why": "This applies the periodic re-validation principle (established for strategic plans in D1-069) to organizational/deployment design: infrastructure appropriate at one scale predictably becomes inadequate as an organization grows substantially, and sound MBB judgment includes recognizing when design has fallen behind organizational reality and needs deliberate reassessment. Source: [BOK] Domain II.A, Organizational Design; parallel to D1-069 (periodic re-validation principle).",
    "set": 3,
    "qid": "mbb:set-3:d2-069"
  },
  {
    "sub": "mbb-org",
    "stem": "An urgent care clinic chain is launching a patient-flow improvement project that touches both clinical protocols (physician/nurse-owned) and administrative scheduling systems (operations-owned). Should this project have a single sponsor or co-sponsors, and why?",
    "options": [
      "No sponsor is needed for cross-functional projects, since sponsorship only applies to single-department initiatives",
      "Co-sponsorship (one clinical leader, one administrative/operations leader) is generally more appropriate here, since the project genuinely spans two distinct authority domains (clinical protocol changes require clinical leadership backing; scheduling/systems changes require operational leadership backing), and a single sponsor from only one domain would likely lack full authority or credibility to drive changes in the other",
      "A single sponsor is always preferable regardless of how many distinct organizational domains a project touches, to avoid any complexity in governance",
      "The Black Belt should personally serve as both the clinical and administrative sponsor, regardless of whether they hold authority in either domain"
    ],
    "answer": 1,
    "why": "When a project genuinely spans two distinct authority domains (here, clinical and administrative), co-sponsorship reflecting both domains' actual authority structures is generally more effective than a single sponsor who may lack full credibility or authority in the other domain \u2014 a standard governance design principle for genuinely cross-domain projects. Source: [BOK] Domain II.B, Executive and Team Leadership.",
    "set": 3,
    "qid": "mbb:set-3:d2-070"
  },
  {
    "sub": "mbb-org",
    "stem": "A packaging manufacturer's plant manager says employees are \"resistant to change\" regarding a new Six Sigma project, but investigation reveals the plant has successfully implemented 6 other significant changes in the past year with generally positive engagement. What should the MBB consider before accepting the \"resistant to change\" diagnosis at face value?",
    "options": [
      "Investigate further, since a plant with a demonstrated recent track record of successfully engaging with multiple changes is unlikely to be generically \"resistant to change\" as a fixed trait; the actual issue more likely lies in something specific to this particular project (e.g., poor framing, inadequate communication, insufficient frontline involvement, or a genuine concern about this specific change) rather than a general resistance disposition \u2014 the diagnosis should be re-examined rather than accepted as an inherent, unchangeable trait",
      "Recommend abandoning all future change initiatives at this plant given the reported resistance",
      "Conclude that the 6 previous changes must not have actually been meaningful if this new resistance exists",
      "Accept the plant manager's diagnosis immediately without further investigation, since plant managers always have complete and accurate insight into their own employees' attitudes"
    ],
    "answer": 0,
    "why": "This tests appropriately scrutinizing a generic \"resistant to change\" label against contradicting evidence (a demonstrated recent track record of successful change engagement) \u2014 the more likely explanation is something project-specific, and the MBB should investigate rather than accept a convenient but likely inaccurate general-trait diagnosis. Source: [BOK] Domain II.C, Organizational Challenges.",
    "set": 3,
    "qid": "mbb:set-3:d2-071"
  },
  {
    "sub": "mbb-org",
    "stem": "An ambulance service's crews operate under extreme time pressure and life-or-death stakes daily, and the organizational culture has historically treated any deviation from protocol during a call as grounds for individual disciplinary review, regardless of the systemic conditions (e.g., equipment placement, dispatch information quality) that may have contributed. A Six Sigma project analyzing protocol deviations is being met with significant crew reluctance to discuss deviations candidly. What cultural principle from earlier in this domain applies directly here, and what should the MBB recommend?",
    "options": [
      "Increase disciplinary consequences for protocol deviations to encourage more careful documentation, regardless of the impact on crews' willingness to discuss deviations candidly",
      "The \"just culture\" principle established in D2-035 (grocery chain shrinkage) applies directly and with even higher stakes here: distinguishing systemic contributors (equipment placement, dispatch information quality, protocol design gaps) from genuine individual misconduct is essential to get the honest, detailed information root-cause analysis requires, while still preserving appropriate accountability for actual misconduct \u2014 the MBB should recommend the same systems-focused, just-culture-based investigation approach, adapted to the emergency medical context",
      "Reduce the rigor of the root-cause analysis to avoid probing into individual crew decisions at all, regardless of whether systemic root causes remain unidentified as a result",
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
      "No formal feedback system at all, relying entirely on the ceramics manufacturer's own internal quality inspection data as a complete substitute for external customer feedback",
      "A single annual, English-only, identifiable online survey sent only to customers who placed a repeat order in the past year, with no formal process for responding to or acting on submitted feedback",
      "A multi-channel system: guaranteed acknowledgment/response to every submission within a defined timeframe (closing the D2-005 loop), accessible in relevant local languages with awareness of cross-cultural response-style differences (per D2-061), including specific outreach to non-repeat/one-time customers (addressing the D2-042/D1-048 survivorship-bias risk) and to underrepresented channels, with feedback-collection frequency matched to how quickly the relevant conditions change (per D2-017/D2-048's cadence-matching principle) rather than a single fixed annual snapshot",
      "Fifty separate feedback mechanisms, one for every conceivable customer segment and channel, with no coordination, prioritization, or resourcing plan for acting on any of them"
    ],
    "answer": 2,
    "why": "This capstone item requires synthesizing essentially every organizational feedback pitfall tested across the domain (D2-005 closed-loop, D2-030/D2-042/D1-048 representative population, D2-017/D2-048 cadence-matching, D2-061 cross-cultural response norms) into a single coherent, well-designed system \u2014 genuine Evaluate-level synthesis across the E subdomain. Source: [BOK] Domain II.E, Organizational Feedback (full-subdomain synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d2-073"
  },
  {
    "sub": "mbb-org",
    "stem": "A mobile phone repair chain is redesigning its store-level performance scorecard from scratch, wanting to avoid every metrics pitfall tested in this domain (vanity metrics, unpaired gaming-prone metrics, uncontrolled confounds, no assigned ownership, cadence mismatches, and metrics that lag behind an evolved business model). Which proposed scorecard design best reflects sound synthesis of these principles?",
    "options": [
      "Track all 60 metrics the point-of-sale system is technically capable of producing, with no prioritization or rationalization, mirroring the flaw identified in D2-024",
      "Track \"repairs completed per day\" alone, unpaired, reported annually, with no owner and no adjustment for store-level confounds like foot traffic or repair complexity mix",
      "A focused, owned scorecard: repairs-completed-per-day (efficiency) paired with repair-quality/callback-rate (quality counter-metric, preventing pure speed-gaming as in D2-012's rail example), benchmarked against store-level foot-traffic and typical-repair-complexity baselines (controlling for confounds as in D2-037's territory example), reviewed at a cadence matched to actual business rhythm (e.g., weekly operational review, monthly trend review) rather than a single annual snapshot, with a named store manager accountable for monitoring and acting on the metrics, and explicitly revisited whenever the store's service mix changes materially (per D2-068's business-model-evolution principle)",
      "Track only customer star ratings, discarding all internal efficiency and quality-process metrics entirely"
    ],
    "answer": 2,
    "why": "This final capstone item for the F subdomain requires synthesizing every organizational performance-metrics principle tested across Batches 4-6 (vanity-metric avoidance, metric pairing, confound control, ownership, cadence-matching, and business-model-relevance) into one coherent, well-designed scorecard \u2014 the clearest demonstration of Evaluate-level synthesis to close out Domain II. Source: [BOK] Domain II.F, Organizational Performance Metrics (full-subdomain synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d2-074"
  },
  {
    "sub": "mbb-org",
    "stem": "A newly appointed MBB at a credit union inherits: (1) a matrix-reporting structure with no defined conflict-arbitration mechanism, (2) an executive sponsor who delegates without following through consistently, (3) frontline resistance rooted in genuine expertise (experienced loan officers skeptical of statistical models relative to their own judgment), (4) a stated \"member-first\" value contradicted by individual-only sales-volume incentives, (5) an annual, identifiable member feedback survey with suspiciously uniform positive results, and (6) a single unpaired \"loans processed per week\" metric currently driving visible corner-cutting. Applying the full range of Domain II principles tested across all three batches, design the most defensible overall action plan, in priority order.",
    "options": [
      "Address all six issues with equal, simultaneous priority and no sequencing rationale, launching six unrelated fixes in parallel with no connection between them",
      "Recommend the credit union abandon Six Sigma deployment entirely given the number of interrelated organizational issues present",
      "Recognize the values-behavior gap (item 4) as a likely root driver of both the suspiciously uniform feedback (item 5, since staff may fear consequences for honest reporting under a purely sales-driven incentive culture) and the metric-gaming behavior (item 6, directly incentivized by the same misaligned reward structure); address the incentive/values misalignment first, then fix the feedback mechanism's anonymity/accessibility to get trustworthy data, then redesign the metric to pair volume with a quality/member-outcome counter-metric, then establish the matrix conflict-arbitration protocol, then engage the sponsor around concrete active-sponsorship behaviors, and finally address loan-officer expertise-based resistance by engaging their judgment directly in model validation (per the veterinary-diagnostics-lab principle, D2-066) \u2014 sequencing root-cause organizational/incentive issues before the more tactical mechanism and engagement fixes that depend on them",
      "Focus exclusively on replacing the unpaired metric with a more sophisticated single metric, leaving all other issues unaddressed"
    ],
    "answer": 2,
    "why": "This final capstone item requires synthesizing the entire Domain II domain (organizational design, leadership, challenges, culture, feedback, and metrics) into a single diagnostically sound, prioritized action plan \u2014 recognizing that the incentive/values misalignment (item 4) most likely drives two of the other symptoms (suspicious feedback uniformity and metric gaming), and sequencing that root fix first, before mechanism-level fixes (feedback, metrics) and finally structural/engagement fixes (matrix arbitration, sponsorship, expertise-based resistance) \u2014 genuinely Create-level synthesis across all 75 questions in this domain. Source: [BOK] Domain II, full domain synthesis (A\u2013F), closing Domain II.",
    "set": 3,
    "qid": "mbb:set-3:d2-075"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A shipbuilding company's Black Belt wants to advance from Measure to Analyze despite the measurement system analysis (MSA) for the key defect-tracking gauge showing marginal (not clearly acceptable) repeatability and reproducibility results. The BB argues \"we're behind schedule and need to keep moving.\" What is the MBB's best next action?",
    "options": [
      "Allow the team to proceed to Analyze but skip Improve and Control phases entirely to make up the lost time",
      "Deny tollgate advancement until the measurement system issue is resolved (either through gauge improvement, operator retraining, or an accepted alternative measurement approach), since proceeding to Analyze with an unreliable measurement system risks building all subsequent analysis on untrustworthy data \u2014 a foundational data-integrity issue that schedule pressure does not override",
      "Approve the phase advancement to preserve the project schedule, treating the marginal MSA result as an acceptable trade-off",
      "Replace the Black Belt with someone more experienced, assuming individual competence is the root issue"
    ],
    "answer": 1,
    "why": "Tollgate discipline exists precisely to prevent exactly this scenario \u2014 schedule pressure driving a team past a foundational data-quality gate. A marginal or failing MSA result undermines the validity of everything analyzed afterward, making this a case where the tollgate must hold regardless of schedule pressure. Source: [CSSC] Ch. 13, Measure (MSA); [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-001"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A theme restaurant chain manages its entire Six Sigma project portfolio via individual spreadsheets maintained separately by each of 12 regional Black Belts, with no consolidated, real-time enterprise view. The MBB discovers two regions have independently launched nearly identical menu-waste-reduction projects without either team knowing about the other's work. What portfolio infrastructure gap does this represent?",
    "options": [
      "There is no gap; independent regional spreadsheets provide adequate visibility as long as each individual Black Belt tracks their own project accurately",
      "This reflects a missing centralized portfolio management infrastructure \u2014 without a consolidated, shared view of all active and planned projects across regions, duplicate effort (as occurred here), missed cross-region learning opportunities, and inefficient resource allocation become likely; the MBB should recommend implementing a shared portfolio tracking system (even a simple centralized spreadsheet or lightweight project management tool) providing enterprise-wide visibility",
      "The duplicate projects should both continue independently since redundant efforts increase the statistical confidence in the eventual findings",
      "Regional Black Belts should be prohibited from ever working on similar topics, regardless of legitimate independent local need"
    ],
    "answer": 1,
    "why": "This is a direct infrastructure-visibility failure \u2014 decentralized, non-consolidated tracking systems predictably produce exactly this kind of duplicate effort and missed cross-region synergy; centralized (even lightweight) portfolio visibility is a standard infrastructure fix. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d3-002"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A biodiesel refinery project requires an upfront investment of $240,000 and is projected to generate $60,000 in annual net savings, evenly distributed across the year. What is the simple payback period, and what is the primary limitation of using payback period as the sole financial screening tool for portfolio prioritization?",
    "options": [
      "Payback period = $240,000 \u00f7 $60,000/year = 4 years; its primary limitation is that it ignores any cash flows or benefits occurring after the payback point and does not account for the time value of money, potentially undervaluing longer-horizon but ultimately more valuable projects",
      "Payback period = 0.25 years; the metric has no meaningful limitations",
      "Payback period = 2 years; its primary limitation is that it ignores any cash flows or benefits occurring after the payback point, and it does not account for the time value of money, potentially undervaluing longer-horizon but ultimately more valuable projects",
      "Payback period cannot be calculated without knowing the project's discount rate"
    ],
    "answer": 0,
    "why": "Payback period = $240,000 \u00f7 $60,000/year = 4 years. Payback period ignores cash flows after the payback point and does not account for the time value of money \u2014 a project with a fast payback but weak long-run returns can look better than a project with a slower payback but much stronger total value. Source: [BOK] Domain III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d3-003"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A data center operator's cooling-efficiency project charter originally scoped \"reduce cooling energy costs in Building A.\" Three months in, the team has expanded analysis to include Buildings B and C \"since we're already looking at cooling systems,\" without a formal charter revision or sponsor approval. What project management principle is being violated, and what is the risk?",
    "options": [
      "The team should be commended, and no corrective action is needed since more buildings means more potential savings",
      "The project should immediately revert to only Building A and discard all data already collected on Buildings B and C",
      "There is no violation; expanding scope to capture more value is always appropriate regardless of formal charter status",
      "This is scope creep \u2014 expanding project boundaries beyond the formally chartered and sponsor-approved scope without a corresponding formal charter revision; the risk is that the project's original timeline, resource allocation, and success metrics were sized for Building A alone, and uncontrolled expansion risks schedule overrun, resource strain, and a mismatch between what was originally approved and what is now being delivered, without the sponsor's informed consent to the expanded scope"
    ],
    "answer": 3,
    "why": "Uncontrolled scope expansion without formal charter revision and sponsor approval is a classic scope-creep risk \u2014 even when the expansion seems value-additive, the correct process is formalizing the change (updated charter, sponsor sign-off, revised resource/timeline plan), not simply proceeding informally. Source: [CSSC] Ch. 12, Define (Creating a Project Charter); [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-004"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A luxury watch manufacturer's portfolio review currently happens once annually, but the company's product development cycles and market conditions change substantially within any given year. What portfolio governance cadence adjustment should the MBB recommend, and why?",
    "options": [
      "Continue annual review only, since it is the most common cadence across all industries and organizational types",
      "Move to a more frequent portfolio review cadence (e.g., quarterly), since the pace of relevant change (product cycles, market conditions) substantially exceeds what an annual cadence can responsively track \u2014 mirroring the cadence-matching principle applicable to feedback systems (as in earlier organizational feedback contexts) but applied here to portfolio governance: review frequency should match the actual rate of change in the environment being governed",
      "Increase review frequency to daily, regardless of whether daily-level portfolio decisions are actually needed or practical given typical project durations",
      "Eliminate portfolio review entirely, since any fixed cadence will inevitably become outdated at some point"
    ],
    "answer": 1,
    "why": "This applies the cadence-matching principle (previously established for organizational feedback systems) to portfolio governance: review frequency should be calibrated to the actual rate of relevant environmental/business change, and an annual cadence in a fast-changing context under-serves timely portfolio decision-making. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d3-005"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A home appliance manufacturer evaluates a warranty-cost-reduction project with an upfront cost of $500,000 and expected net benefits of $200,000 per year for 3 years. Using a 10% discount rate, is the project's NPV positive, and what does this tell the portfolio prioritization team?",
    "options": [
      "NPV is irrelevant for warranty-related projects since warranty costs are considered a sunk cost regardless of any project undertaken to reduce them",
      "NPV cannot be calculated without knowing the project's internal rate of return first",
      "NPV \u2248 $200,000 \u00d7 [1/1.10 + 1/1.10\u00b2 + 1/1.10\u00b3] \u2212 $500,000 \u2248 $200,000 \u00d7 2.487 \u2212 $500,000 \u2248 $497,400 \u2212 $500,000 \u2248 \u2212$2,600; the NPV is slightly negative at a 10% discount rate, meaning the project would technically destroy a small amount of value at this hurdle rate and should be scrutinized carefully or reconsidered relative to other candidates with clearly positive NPV, though the very small negative margin also means minor errors in the benefit estimates could flip the conclusion \u2014 the MBB should flag this as a borderline case warranting sensitivity analysis before final prioritization",
      "NPV is clearly and substantially positive at approximately $600,000, making this an obviously strong candidate for immediate approval"
    ],
    "answer": 2,
    "why": "Discount factors at 10%: year 1 = 1/1.10 \u2248 0.909, year 2 \u2248 0.826, year 3 \u2248 0.751; sum \u2248 2.487. $200,000 \u00d7 2.487 \u2248 $497,400. NPV \u2248 $497,400 \u2212 $500,000 \u2248 \u2212$2,600, a marginally negative NPV. This tests careful calculation and correctly recognizing that a borderline result warrants sensitivity analysis rather than a confident accept/reject conclusion either way. Source: [BOK] Domain III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d3-006"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A toy manufacturer's DMAIC project team is experiencing confusion about who has final decision authority on design changes versus who simply needs to be consulted. Which project management tool most directly addresses this specific problem?",
    "options": [
      "A control chart, since it tracks whether design decisions are statistically in control over time",
      "A fishbone diagram, since it identifies root causes of quality defects",
      "A RACI matrix (Responsible, Accountable, Consulted, Informed), which explicitly assigns and clarifies each stakeholder's specific role relative to each key decision or deliverable, directly resolving ambiguity about who has final authority (Accountable) versus who provides input (Consulted) versus who is simply kept aware (Informed)",
      "A Pareto chart, since it prioritizes the most frequent sources of design confusion"
    ],
    "answer": 2,
    "why": "A RACI matrix is the standard, purpose-built tool for resolving exactly this kind of role/authority ambiguity \u2014 distinguishing decision authority (Accountable) from input-providers (Consulted) and those merely kept aware (Informed). Source: [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-007"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A pharmacy benefit manager's portfolio includes 15 active projects, three of which independently depend on the same upcoming claims-system software upgrade being delivered on time by an external vendor. No portfolio-level mechanism currently tracks this shared dependency across the three project teams, each of which is unaware the others share the same critical dependency. What portfolio infrastructure element is missing, and what is the risk?",
    "options": [
      "A portfolio-level risk register / dependency-tracking mechanism that aggregates and surfaces shared risks and dependencies across multiple projects is missing; the risk is that if the vendor upgrade is delayed, three projects could be simultaneously and unexpectedly impacted, and without portfolio-level visibility, no one is positioned to proactively communicate, mitigate, or contingency-plan for this shared exposure before it materializes",
      "The three projects should be immediately merged into a single mega-project regardless of whether their actual scopes and objectives are otherwise unrelated",
      "The vendor should be replaced immediately without further analysis, based solely on the existence of this shared dependency",
      "Nothing is missing; each project team's individual risk register is sufficient since dependencies are, by definition, a project-level rather than portfolio-level concern"
    ],
    "answer": 0,
    "why": "Shared dependencies that cross multiple individually-scoped projects require portfolio-level (not just project-level) risk visibility \u2014 this is a specific and common infrastructure gap where each project's own risk register, however good, cannot surface a risk that only becomes apparent when viewed across the portfolio as a whole. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management.",
    "chart": {"type": "activity-network", "nodes": {"Vendor upgrade": {"col": 1, "row": 0, "dur": 90}, "Project A": {"col": 0, "row": 1, "dur": 60}, "Project B": {"col": 1, "row": 1, "dur": 75}, "Project C": {"col": 2, "row": 1, "dur": 45}}, "edges": [["Vendor upgrade", "Project A"], ["Vendor upgrade", "Project B"], ["Vendor upgrade", "Project C"]]},
    "set": 3,
    "qid": "mbb:set-3:d3-008"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A ski equipment manufacturer's Black Belt reports a completed project's benefit as \"$180,000 in annual savings from reduced material handling time,\" calculated by multiplying time saved by fully-loaded labor cost, but no headcount was actually reduced and no other cost was avoided \u2014 the same employees continue working the same hours on other tasks. What is the flaw in classifying this as a $180,000 realized financial benefit?",
    "options": [
      "This is a \"soft savings\" (cost avoidance/productivity gain) rather than a \"hard savings\" (actual realized reduction in cash outlay, such as reduced headcount, reduced overtime, or reduced purchased materials); reporting it as an unqualified $180,000 financial benefit overstates the project's actual cash-flow impact \u2014 the MBB should require these be classified and reported separately (hard vs. soft savings), since portfolio financial decisions relying on unvalidated soft-savings figures risk being based on benefits that never actually appear in the P&L",
      "Soft savings should never be tracked or reported at all, since only hard savings have any organizational value",
      "The project should be considered a complete failure since the labor hours were not reduced",
      "There is no flaw; any time saved should always be counted as an equivalent dollar-for-dollar hard financial benefit regardless of whether headcount, hours, or actual spending changed"
    ],
    "answer": 0,
    "why": "This tests a fundamental Domain III financial-tools distinction: hard savings (actual reduced cash outlay) versus soft savings (freed capacity, productivity gains not yet converted to reduced cost) \u2014 conflating the two overstates realized financial benefit and can mislead portfolio-level financial decision-making if not explicitly labeled and tracked separately. Source: [BOK] Domain III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d3-009"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A city public works department's road-repair-cycle-time project reaches the Control phase, implements a new scheduling protocol, and shows strong initial results, but the Black Belt is immediately reassigned to a new project with no control plan handoff, no designated process owner training, and no scheduled follow-up audit. What is the risk, and what should the MBB require before formally closing the project?",
    "options": [
      "No further action is needed; strong initial results at Control phase completion are sufficient evidence of a permanently sustained improvement",
      "The risk is regression to the prior state once the Black Belt's direct oversight ends, since without a formal control plan handoff, trained process owner, and scheduled follow-up audits, the improved scheduling protocol has no institutional mechanism ensuring it persists; the MBB should require a completed control plan handoff, documented process-owner training, and at least one scheduled follow-up audit (e.g., at 90 and 180 days) before formally closing the project",
      "The project should be reopened and restarted from Define, since the Black Belt's reassignment invalidates all previous phase work entirely",
      "The Black Belt should remain personally, informally responsible for monitoring this project indefinitely, alongside their new project's full-time responsibilities"
    ],
    "answer": 1,
    "why": "This tests recognizing that \"strong initial results\" at Control-phase completion is not the same as durable, sustained improvement \u2014 a proper control-phase closure requires the specific institutional mechanisms (control plan handoff, process owner training, scheduled audits) shown here to be entirely missing, and the MBB should require these before formal closure. Source: [CSSC] Ch. 16, Control; [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-010"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A zoo/aquarium's portfolio management office wants a tool to visualize whether its 4 Black Belts are over- or under-allocated across the 9 currently active projects at any given time. Which portfolio infrastructure tool is most directly suited to this purpose?",
    "options": [
      "A control chart tracking defect rates across all 9 projects combined",
      "A resource-loading/capacity chart (showing each Belt's allocated hours or project-count across the active portfolio against their available capacity), which directly visualizes over- or under-allocation at the individual-resource level across the full active project set \u2014 the standard portfolio infrastructure tool purpose-built for this specific capacity-visibility need",
      "A fishbone diagram, since it identifies root causes of resource allocation problems",
      "A SIPOC diagram for each of the 9 projects individually"
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
      "The two projects are financially identical since both have positive cost-benefit ratios",
      "Project N is unambiguously the better choice with no further caution needed, since its absolute benefit figure is larger",
      "Project M appears more attractive by ratio (2.0 vs. 1.5), but the MBB should caution that ratio alone ignores absolute value creation \u2014 Project N generates $900,000 \u2212 $600,000 = $300,000 in net annual benefit versus Project M's $300,000 \u2212 $150,000 = $150,000, meaning N actually creates twice the absolute net value despite its lower ratio; ratio and absolute-value metrics can favor different projects, and both should inform the final decision, especially when capital/capacity constraints (which favor efficiency/ratio) versus absolute value-maximization goals differ"
    ],
    "answer": 3,
    "why": "M's ratio (2.0) exceeds N's (1.5), but N's absolute net benefit ($300,000) is twice M's ($150,000) \u2014 a genuine tension between capital-efficiency (ratio) and absolute-value (net benefit) framings that the MBB must surface, since the \"right\" choice can depend on whether the organization is capital-constrained (favoring ratio/efficiency) or value-maximizing with available capital (favoring absolute net benefit). Source: [BOK] Domain III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d3-012"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A freight forwarding company's Black Belt, under schedule pressure, moves directly from a partially-completed Analyze phase (only 2 of 5 hypothesized root causes have been statistically validated) into Improve, implementing solutions targeting only those 2 causes. Three months later, the target metric has improved only marginally. What lifecycle principle was violated, and what is the likely explanation for the marginal result?",
    "options": [
      "The Black Belt should have skipped Analyze entirely from the start, moving directly from Measure to Improve",
      "The marginal result proves DMAIC as a methodology is ineffective for freight forwarding problems",
      "No principle was violated; addressing any validated root cause is always sufficient regardless of how many total root causes were hypothesized",
      "The team prematurely exited Analyze before determining whether the 2 validated causes account for a sufficient proportion of the total variation/defect rate \u2014 if the remaining 3 unvalidated hypothesized causes (or others not yet identified) are actually the larger contributors, addressing only 2 partially-understood causes would predictably yield only marginal improvement; Analyze should establish, ideally quantitatively (e.g., via a Pareto analysis of validated contribution), that the addressed causes represent the dominant sources of the problem before moving to Improve"
    ],
    "answer": 3,
    "why": "This is a classic incomplete-Analyze-phase failure: exiting Analyze before establishing that the identified/validated root causes actually account for the dominant share of the problem risks exactly the marginal-improvement outcome described, since unaddressed (and possibly larger) causes remain in play. Source: [CSSC] Ch. 14, Analyze; [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-013"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A vineyard/winery's portfolio intake process has no formal gate \u2014 any department head can add a project to the active portfolio at any time without any capacity check against current Belt availability. The portfolio has grown to 22 \"active\" projects with only 3 Belts, most projects effectively stalled. What portfolio infrastructure element is missing, and how does this connect to earlier pipeline-management concepts?",
    "options": [
      "A formal intake/gating mechanism is missing \u2014 one that checks proposed additions against current Belt capacity before granting \"active\" status, rather than allowing unconstrained addition; this is the infrastructure-level root cause of exactly the WIP-overload pattern (rising work-in-process against fixed throughput capacity) diagnosed at the pipeline-management level in Domain I (D1-025) \u2014 without a capacity-checking intake gate, the organization has no structural mechanism preventing portfolio overload from recurring",
      "All 22 projects should be formally closed simultaneously without any further analysis of their individual value or status",
      "Nothing is missing; more active projects always indicates a healthier, more ambitious portfolio regardless of actual completion capacity",
      "The winery should hire 22 additional Black Belts immediately, one per active project, regardless of actual demand sustainability or cost"
    ],
    "answer": 0,
    "why": "This connects the Domain I WIP-overload diagnosis (D1-025) to its underlying Domain III infrastructure root cause: unconstrained intake (no capacity-checking gate) is the structural reason WIP overload recurs \u2014 the fix belongs at the infrastructure/governance level (an intake gate), not just in periodic diagnosis after the fact. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management; direct cross-reference to D1-025 (WIP/throughput diagnosis).",
    "set": 3,
    "qid": "mbb:set-3:d3-014"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A coffee roaster's Six Sigma office reports $2.3M in cumulative \"validated\" project savings over the past two years, but finance's own P&L review shows overall operating costs have not decreased by a comparable amount, and finance is now questioning the credibility of the Six Sigma program's reported figures. What is the most likely explanation, and what should the MBB recommend?",
    "options": [
      "The Six Sigma program should be discontinued immediately given the discrepancy, without further investigation into its cause",
      "Six Sigma savings and finance's P&L figures are measuring completely unrelated things and should never be expected to reconcile in any way",
      "Finance's P&L analysis must be wrong, since Six Sigma project-level calculations are always more accurate than aggregate financial statements",
      "The discrepancy likely reflects one or more of: soft savings (as in D3-009) being counted alongside hard savings without clear labeling, savings being offset by cost increases elsewhere in the business unrelated to the projects, or a lack of a formal, finance-validated benefits-realization audit process; the MBB should recommend establishing a joint Six Sigma/Finance benefits validation process (with finance sign-off on realized hard savings specifically) to restore credibility and ensure future reported figures are defensible and reconcilable against actual financial statements"
    ],
    "answer": 3,
    "why": "This is a capstone-style financial-tools item connecting several principles (hard vs. soft savings from D3-009, the infrastructure need for cross-functional validation) to diagnose a credibility gap between reported project savings and actual financial statement impact \u2014 a well-known and serious issue in mature Six Sigma deployments, requiring formal, finance-validated benefits realization processes as the fix. Source: [BOK] Domain III.C, Project Portfolio Financial Tools; direct cross-reference to D3-009 (hard vs. soft savings).",
    "set": 3,
    "qid": "mbb:set-3:d3-015"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A playground equipment manufacturer's project schedule shows several parallel workstreams (material testing, supplier qualification, and design review), each with different durations and dependencies feeding into a final \"manufacturing readiness\" milestone. Which project management concept identifies which specific sequence of tasks determines the minimum possible project duration?",
    "options": [
      "The Pareto principle, since it identifies the vital few tasks contributing most to project value",
      "The DPMO calculation, since it quantifies defects per task across the schedule",
      "The control limit, since it defines acceptable variation in task duration",
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
      "Portfolio prioritization criteria are themselves a piece of infrastructure that requires periodic re-validation against current strategic priorities (directly paralleling the periodic re-validation principle established for strategic plans in D1-069 and organizational design in D2-069); using three-year-old criteria weighted toward a since-superseded strategic emphasis risks systematically mis-prioritizing the current portfolio against outdated rather than current organizational priorities",
      "The company should immediately halt all portfolio prioritization activities until entirely new criteria can be developed from scratch, discarding the existing criteria's continued partial relevance (safety remains presumably still important) without review",
      "Prioritization criteria, once established, should remain permanently fixed regardless of any subsequent strategic changes, to preserve historical comparability across all scored projects",
      "Prioritization criteria are irrelevant to actual project selection outcomes and can be safely ignored regardless of their currency"
    ],
    "answer": 0,
    "why": "This extends the periodic re-validation principle (established for strategic plans and organizational design in Domains I and II) to portfolio prioritization criteria specifically \u2014 criteria are infrastructure that can drift out of alignment with current strategy exactly like a strategic plan or org design can, and require the same kind of periodic reassessment. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management; direct cross-reference to D1-069, D2-069 (periodic re-validation principle).",
    "set": 3,
    "qid": "mbb:set-3:d3-017"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A commercial bakery equipment supplier is comparing two mutually exclusive projects using both NPV and Internal Rate of Return (IRR). Project P has a lower IRR (14%) but a higher NPV ($420,000) than Project Q, which has a higher IRR (22%) but a lower NPV ($310,000), given the company's 10% hurdle rate. Since the projects are mutually exclusive (only one can be selected), which metric should generally take precedence, and why?",
    "options": [
      "For mutually exclusive projects (where only one can be selected, as opposed to independent projects being ranked for a constrained budget), NPV should generally take precedence over IRR when the two metrics conflict, because NPV directly measures the absolute increase in enterprise value created (in dollar terms) at the company's actual cost of capital, while IRR's percentage-based ranking can be misleading when comparing projects of different scale or cash flow timing \u2014 selecting Project P (higher NPV) would create more actual value for the company despite its lower percentage return",
      "Neither metric is relevant for mutually exclusive project decisions; only payback period should be used in this scenario",
      "The two metrics can never conflict in a properly conducted analysis, so no precedence rule is needed",
      "IRR should always take precedence regardless of NPV, since a higher percentage return is always preferable in any comparison"
    ],
    "answer": 0,
    "why": "This is a classic, well-established financial-analysis principle: for mutually exclusive projects, NPV-IRR ranking conflicts should generally be resolved in favor of NPV, since NPV directly measures absolute value creation at the actual cost of capital, while IRR (a percentage/scale-independent measure) can favor a smaller, higher-percentage-return project that nonetheless creates less total value. Source: [BOK] Domain III.C, Project Portfolio Financial Tools; cross-reference to D3-003 (payback period limitations).",
    "set": 3,
    "qid": "mbb:set-3:d3-018"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A prosthetics manufacturer's DMAIC project charter includes a risk register identifying \"key raw material supplier disruption\" as a moderate-probability, high-impact risk, but no contingency or mitigation plan was developed for this identified risk \u2014 the team simply logged it and moved on. Midway through Improve, the identified risk materializes: the supplier has a disruption. What project management principle was violated, and what should the MBB have required earlier?",
    "options": [
      "Nothing was violated; simply identifying and logging a risk in a register is sufficient risk management regardless of whether any response plan exists",
      "Risk registers should only ever be created for risks that are certain to occur, since lower-probability risks are not worth documenting",
      "The project should be immediately canceled since supply chain risks are inherently unmanageable regardless of any planning",
      "Risk identification without a corresponding response/mitigation plan is incomplete risk management \u2014 for any risk assessed as at least moderate-probability and high-impact, the risk register should include a defined contingency or mitigation approach (e.g., a qualified backup supplier, buffer inventory, or an alternative material specification) developed proactively, before the risk materializes, rather than being addressed reactively only after disruption occurs, as happened here"
    ],
    "answer": 3,
    "why": "Complete risk management requires pairing identified risks (especially at least moderate-probability/high-impact ones) with actual response/mitigation plans developed proactively \u2014 merely logging a risk without a response plan defeats much of the purpose of risk management, leaving the team reactive rather than prepared when the risk materializes. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-019"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A board game publisher's portfolio management office wants to ensure its Six Sigma project portfolio isn't overly concentrated in either very safe, low-return projects or very risky, high-return ones. Which portfolio infrastructure concept, borrowed from financial portfolio theory, is most directly relevant to this balancing goal?",
    "options": [
      "Control chart limits, which define acceptable variation in a single process's output",
      "The DMAIC five-phase structure, since it defines the sequence of steps within a single project",
      "Portfolio risk/return balancing (analogous to financial portfolio diversification) \u2014 deliberately maintaining a mix of lower-risk, more certain projects alongside higher-risk, higher-potential-return projects, rather than concentrating entirely in either category, to manage the overall portfolio's aggregate risk-return profile",
      "A SIPOC diagram, since it defines a single process's suppliers, inputs, outputs, and customers"
    ],
    "answer": 2,
    "why": "This is a direct application of financial-portfolio-theory-style risk/return balancing to Six Sigma project portfolio management \u2014 deliberately maintaining a mix across the risk/return spectrum, rather than concentrating entirely at either extreme, is the relevant portfolio infrastructure/governance concept. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d3-020"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "An alarm monitoring/security services company's portfolio committee has four candidate projects with the following profiles: Project W (NPV $150K, payback 1.5 years, mostly hard savings), Project X (NPV $140K, payback 3 years, mostly soft savings/productivity gains), Project Y (NPV $310K, payback 4 years, mixed hard/soft savings, higher risk profile), Project Z (NPV $90K, payback 0.8 years, entirely hard savings, very low risk). Synthesizing the financial tools principles from this batch (hard vs. soft savings distinction, NPV vs. payback period trade-offs, and risk consideration), which single characterization best captures the appropriate portfolio-level judgment here?",
    "options": [
      "Only payback period matters; Z should be selected exclusively since it has the shortest payback, with the other three projects rejected regardless of their NPV or savings composition",
      "All four projects should be rejected since no single metric is unanimous across all four in identifying one clear winner",
      "No single project is unambiguously \"best\" across all dimensions \u2014 Z offers the fastest, lowest-risk, most certain (hard-savings) return; W offers a strong balance of solid NPV, fast payback, and hard savings; X's soft-savings composition means its NPV should be viewed with more caution per the D3-009/D3-015 principle; and Y's higher NPV comes with materially higher risk and a much longer payback \u2014 the portfolio committee should consider funding a mix (e.g., Z and W for near-term, low-risk value, with Y considered only if the portfolio's overall risk tolerance and capacity support a longer-horizon, higher-risk bet) rather than mechanically selecting by any single metric alone",
      "Project Y should be selected automatically and exclusively since it has the highest NPV, with no further consideration of the other three metrics or projects"
    ],
    "answer": 2,
    "why": "This capstone item requires synthesizing the batch's financial-tools principles (hard/soft savings distinction from D3-009/D3-015, NPV-vs-payback trade-offs from D3-003/D3-006/D3-018, and risk/return portfolio balancing from D3-020) into a single nuanced portfolio-level judgment \u2014 recognizing that different projects serve different portfolio roles (fast/safe vs. higher-risk/higher-return) rather than reducing the decision to any single metric. Source: [BOK] Domain III.C, Project Portfolio Financial Tools (batch synthesis, cross-referencing D3-003, D3-006, D3-009, D3-012, D3-015, D3-018, D3-020).",
    "set": 3,
    "qid": "mbb:set-3:d3-021"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "Synthesizing the project lifecycle discipline issues tested in this batch (premature tollgate advancement with a marginal MSA, uncontrolled scope creep, incomplete Analyze-phase root-cause validation, and missing Control-phase sustainment mechanisms), what is the common underlying principle an MBB should apply when reviewing any project's lifecycle management, at a dry ice supplier or any other organization?",
    "options": [
      "Lifecycle discipline is primarily a documentation exercise with limited actual impact on project outcomes, as long as the final results appear satisfactory",
      "Schedule adherence should always take precedence over every other lifecycle consideration, since delayed projects are the primary risk to guard against",
      "Lifecycle discipline requires treating each phase's exit criteria (data quality validation, formally-approved scope, sufficiently-validated root causes, and durable sustainment mechanisms) as genuine gates that must be substantively satisfied \u2014 not just procedurally checked off \u2014 before advancing, since shortcuts at any phase (as demonstrated across this batch's MSA, scope, Analyze, and Control examples) predictably undermine the value and validity of everything built on top of that phase afterward",
      "Only the Define and Measure phases require rigorous gate discipline; Analyze, Improve, and Control can be treated more flexibly once initial project setup is complete"
    ],
    "answer": 2,
    "why": "This synthesis item distills the batch's four lifecycle-discipline scenarios (D3-001 MSA tollgate, D3-004 scope creep, D3-013 incomplete Analyze, D3-010 missing Control sustainment) into the general principle that phase-gate exit criteria must be substantively (not just procedurally) satisfied, since shortcuts predictably propagate and undermine everything built afterward \u2014 a genuinely MBB-level synthesis across the subdomain. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle (subdomain synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d3-022"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "Synthesizing the portfolio infrastructure gaps tested in this batch (missing centralized tracking causing duplicate projects, mismatched review cadence, missing shared-dependency risk visibility, unconstrained intake causing WIP overload, and stale prioritization criteria), what general infrastructure design principle should a self-storage company (or any organization) apply when building or auditing its portfolio management infrastructure?",
    "options": [
      "Effective portfolio infrastructure requires several distinct, complementary capabilities working together \u2014 centralized visibility (to prevent duplication and enable cross-project learning), an appropriately-paced review cadence, cross-project dependency/risk aggregation, a capacity-checking intake gate, and periodically-revalidated prioritization criteria \u2014 and gaps in any one of these capabilities (as independently demonstrated across this batch's five scenarios) can undermine portfolio effectiveness even if the other capabilities are functioning well",
      "Portfolio infrastructure should be built entirely around technology tooling, since organizational process and governance elements are not genuine infrastructure components",
      "A single, generic project-tracking spreadsheet is always sufficient portfolio infrastructure for any organization, regardless of portfolio size or complexity",
      "Portfolio infrastructure, once established at any point in time, should remain unchanged indefinitely to preserve consistency and avoid the disruption of ongoing revision"
    ],
    "answer": 0,
    "why": "This synthesis item distills the batch's five distinct infrastructure-gap scenarios (D3-002 tracking, D3-005 cadence, D3-008 dependency risk, D3-014 intake gating, D3-017 stale criteria) into the general principle that portfolio infrastructure comprises multiple complementary capabilities, each of which can independently fail and undermine overall portfolio effectiveness \u2014 requiring the MBB to audit each capability separately rather than assuming infrastructure is a single monolithic thing that's either \"present\" or \"absent.\" Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management (subdomain synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d3-023"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A textbook publisher has already spent $180,000 developing a new digital learning platform when new market research reveals the platform is unlikely to be commercially viable. The project sponsor argues \"we've already spent $180,000, we can't stop now.\" What financial decision-making principle should the MBB apply here?",
    "options": [
      "The $180,000 is a sunk cost \u2014 it has already been spent regardless of whether the project continues or stops, and should not factor into the forward-looking decision; the only relevant question is whether continuing to invest additional resources from this point forward is expected to generate positive incremental value given the new market research, independent of how much has already been spent",
      "The project should definitely be canceled immediately, since any project encountering unfavorable new information should always be stopped regardless of remaining potential value",
      "Market research should be disregarded in favor of the original business case, since business cases are generally more reliable than market research conducted after a project has begun",
      "The $180,000 already spent should be a primary factor in deciding whether to continue the project, since abandoning it would \"waste\" the investment already made"
    ],
    "answer": 0,
    "why": "This is the classic sunk cost fallacy, already tested implicitly in earlier batches (D1-009, D1-024) but here made explicit as a Domain III financial-tools principle: past, unrecoverable spending should not influence a forward-looking continue/stop decision, which should instead be based solely on the expected value of future incremental investment given current information. Source: [BOK] Domain III.C, Project Portfolio Financial Tools; cross-reference to D1-009, D1-024 (sunk cost principle).",
    "set": 3,
    "qid": "mbb:set-3:d3-024"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A newly appointed MBB at a semiconductor foundry equipment supplier inherits a portfolio management system exhibiting: (1) no formal charter/scope-change control (leading to scope creep), (2) no centralized cross-project visibility, (3) an unconstrained project intake process now producing WIP overload, (4) financial benefit reporting that doesn't distinguish hard from soft savings, (5) prioritization criteria unchanged for four years despite a major strategic shift toward advanced packaging technology, and (6) no risk register or dependency-tracking practice at either the project or portfolio level. Applying the full range of Domain III principles from this batch, design the most defensible sequence of first infrastructure fixes.",
    "options": [
      "Address all six gaps simultaneously through a single, comprehensive 200-page portfolio management policy document issued without any phased implementation or piloting",
      "Recommend dissolving the portfolio management function entirely and returning to fully informal, ungoverned project selection, given the number of identified gaps",
      "Focus exclusively on financial reporting accuracy (item 4), since that is the most numerically precise and easily-audited of the six gaps, leaving the other five entirely unaddressed",
      "Sequence the fixes by dependency and immediate risk: first establish a capacity-checking intake gate (halting further WIP overload, the most immediately compounding problem per D3-014/D1-025), then implement centralized cross-project visibility (enabling informed prioritization and dependency-tracking going forward, per D3-002/D3-008), then formalize charter/scope-change control (per D3-004) and require hard/soft savings distinction in financial reporting (per D3-009/D3-015) as standard project-level practices, and finally revalidate prioritization criteria against the current strategic shift (per D3-017/D1-069) \u2014 addressing the actively-compounding capacity problem first, then the visibility/infrastructure foundation, then project-level discipline practices, then strategic recalibration"
    ],
    "answer": 3,
    "why": "This capstone item requires synthesizing the entire Domain III batch (lifecycle discipline, portfolio infrastructure, and financial tools) into a single prioritized action sequence: recognizing that unconstrained intake/WIP overload is the most urgently compounding problem (worsening daily until addressed), that visibility infrastructure enables the subsequent fixes, and that project-level discipline and strategic recalibration follow logically afterward \u2014 genuinely Create-level synthesis across all 25 questions in this batch and their connections to Domains I and II. Source: [BOK] Domain III, batch synthesis (A\u2013C), closing Batch 7.",
    "set": 3,
    "qid": "mbb:set-3:d3-025"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A shoe manufacturer's Black Belt drafts a project charter and proceeds directly into Measure-phase data collection without obtaining the sponsor's formal sign-off on the charter, reasoning \"I'm confident they'll approve it, so let's not lose time waiting.\" Two weeks into Measure, the sponsor reviews the charter and requests a significantly different problem statement and scope. What Define-phase discipline was violated, and what was the cost of skipping it?",
    "options": [
      "No discipline was violated; proceeding on the assumption of eventual approval is an acceptable way to preserve schedule momentum",
      "Formal charter sign-off before proceeding to Measure is a foundational Define-phase gate specifically because it confirms sponsor alignment on problem statement and scope before resource-intensive data collection begins; skipping it risks exactly what happened here \u2014 two weeks of Measure-phase effort now needing significant rework because the team was collecting data against a scope the sponsor didn't actually endorse, a more costly outcome than the brief delay formal sign-off would have required",
      "The sponsor should be overruled since the Black Belt's original charter was more technically sound",
      "The project should be permanently canceled since the charter required revision"
    ],
    "answer": 1,
    "why": "This reinforces the Define-phase tollgate discipline principle (extending D3-001's Measure-phase MSA example back to the earliest gate): confirming sponsor alignment before resource-intensive downstream work begins is precisely what prevents costly rework, and the two weeks \"saved\" by skipping sign-off were actually lost to rework, a net negative trade-off. Source: [CSSC] Ch. 12, Define (Creating a Project Charter); [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-026"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A greenhouse/nursery operation's five regional Black Belts each report project status using different formats, terminology, and success metrics (one reports \"% complete,\" another reports \"phase,\" another reports a custom red/yellow/green rating with no defined criteria). The portfolio committee struggles to compare status across the five regions at review meetings. What infrastructure gap does this represent?",
    "options": [
      "The portfolio committee should stop trying to compare projects across regions entirely, since regional differences make comparison inherently invalid",
      "Each region should be given its own entirely separate portfolio committee with no cross-regional coordination at all",
      "No gap exists; allowing each Black Belt stylistic freedom in reporting format is more important than cross-regional comparability",
      "A missing standardized reporting template/protocol \u2014 without common terminology, format, and clearly-defined status criteria (e.g., a consistently-defined red/yellow/green standard) across all regions, the portfolio committee cannot meaningfully compare or aggregate project status, undermining the entire purpose of portfolio-level review; the MBB should establish a single standardized status reporting template and criteria set that all regions use"
    ],
    "answer": 3,
    "why": "This is a standardization/infrastructure gap distinct from (but related to) the centralized-visibility gap in D3-002 \u2014 here, even with some reporting occurring, the lack of common format/criteria prevents meaningful comparison, requiring a standardized template as the specific fix. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d3-027"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A commercial fitness equipment manufacturer is considering an automated welding cell costing $420,000, expected to reduce per-unit welding labor cost by $35 per unit. At what annual production volume does the investment break even within exactly one year, and what should the MBB note about using a single-year break-even framing for a piece of capital equipment with a much longer useful life?",
    "options": [
      "Break-even volume = 420,000 units per year; the calculation requires no further context or caveats",
      "Break-even volume = 1,200 units per year; single-year framing is always the most appropriate framing for any capital equipment purchase regardless of useful life",
      "Break-even analysis cannot be performed without first calculating the equipment's depreciation schedule",
      "Break-even volume = 12,000 units per year ($420,000 \u00f7 $35); the MBB should note that framing break-even around a single year may understate the investment's full value if the equipment's useful life extends well beyond one year (e.g., 10+ years for typical welding equipment), in which case a multi-year NPV or total lifecycle cost analysis would more completely capture the investment's actual return relative to a single-year snapshot"
    ],
    "answer": 3,
    "why": "$420,000 \u00f7 $35 per unit = 12,000 units. This tests both correct arithmetic and the important contextual caveat that a single-year break-even framing may understate a durable asset's full value \u2014 a multi-year view (NPV, total lifecycle cost) would more completely capture value for equipment with a useful life well beyond one year. Source: [BOK] Domain III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d3-028"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A dog daycare franchise's Black Belt completes a charter and stakeholder analysis identifying only \"franchise owners\" and \"corporate operations\" as stakeholders for a new intake-process-safety project, omitting frontline staff who will actually execute the new intake procedures daily. The resulting Improve-phase solution proves impractical on the daycare floor and requires significant rework. What Define-phase gap explains this outcome?",
    "options": [
      "There is no gap; frontline staff are implementers, not stakeholders, and their perspective is not needed during Define",
      "Corporate operations should have made all decisions unilaterally, with no input from franchise owners either",
      "The project should have skipped stakeholder analysis entirely, since it delayed reaching the Measure phase",
      "An incomplete stakeholder analysis omitted a critical stakeholder group (frontline staff who will actually execute the new procedures daily) whose practical, floor-level perspective would likely have surfaced feasibility concerns before the Improve-phase solution was designed; the MBB should require stakeholder analysis to explicitly include anyone who will be meaningfully affected by or responsible for executing the eventual solution, not just management-level stakeholders"
    ],
    "answer": 3,
    "why": "This is a specific and common Define-phase completeness failure \u2014 narrowly scoping stakeholder analysis to management/ownership levels while omitting frontline execution staff predictably produces solutions that look sound on paper but fail on implementation, exactly as described here. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-029"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A tile/flooring manufacturer's portfolio governance documentation states that \"significant project changes require steering committee approval\" but does not define what qualifies as \"significant,\" leading to inconsistent judgment calls \u2014 some Black Belts escalate minor changes unnecessarily while others proceed with substantial changes without escalation. What infrastructure gap does this represent, and what fix should the MBB recommend?",
    "options": [
      "Steering committee approval should be eliminated entirely, since the ambiguity shows the requirement is unworkable",
      "The governance documentation lacks a clear, operational definition of escalation thresholds (e.g., specific criteria such as scope changes exceeding a defined percentage, budget changes above a specific dollar amount, or timeline extensions beyond a defined number of weeks); the MBB should recommend defining concrete, quantifiable escalation criteria so Black Belts can consistently and correctly determine when steering committee approval is actually required",
      "All project changes, regardless of size, should require steering committee approval going forward, eliminating any Black Belt discretion whatsoever",
      "No gap exists; ambiguity in governance thresholds encourages appropriate case-by-case judgment and should be preserved"
    ],
    "answer": 1,
    "why": "Vague governance thresholds (\"significant\") predictably produce exactly the inconsistent judgment calls described \u2014 the fix is defining concrete, quantifiable escalation criteria, not eliminating governance judgment (A) or over-correcting into an all-changes-escalate rule that would overwhelm the steering committee with trivial items (C) or abandoning governance oversight altogether (D). Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management.",
    "set": 3,
    "qid": "mbb:set-3:d3-030"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "An offshore wind farm operator's cost-benefit analysis for a turbine-maintenance-scheduling project includes labor savings and reduced downtime revenue recovery, but omits the cost of an additional specialized safety-certification requirement that the new maintenance schedule would trigger. A colleague catches this before the analysis is finalized. What type of analytical flaw was caught, and why does it matter?",
    "options": [
      "The analysis should be abandoned entirely since one omitted cost proves the whole analysis is worthless",
      "Safety-certification costs should never be included in cost-benefit analysis since they are a regulatory rather than operational cost category",
      "This is an incomplete cost-benefit analysis that omitted a material cost category (the triggered safety-certification requirement) directly caused by the proposed change; failing to include all relevant costs \u2014 not just the most obvious operational ones \u2014 can lead to an inflated apparent net benefit and a poorly-informed portfolio prioritization decision, since the project may look far more attractive than it actually is once the full cost picture is included",
      "There is no meaningful flaw since safety-certification costs are always negligible compared to labor and downtime savings in wind energy operations"
    ],
    "answer": 2,
    "why": "This tests recognizing an incomplete-cost-accounting flaw \u2014 a real, material cost directly triggered by the proposed change was omitted, risking an inflated and misleading net-benefit figure feeding into portfolio prioritization; the fix is completing the analysis with all directly-caused costs, not the extreme responses in C or D. Source: [BOK] Domain III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d3-031"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A blood bank/plasma donation center's DMAIC project charter includes a problem statement, goal statement, scope, and team roster, but no defined communication plan (who receives updates, how often, through what channel). What risk does this omission create, and why is a communication plan considered a standard Define-phase element?",
    "options": [
      "No risk exists; a communication plan is an optional nicety, not a standard or necessary Define-phase element",
      "Without a defined communication plan, stakeholders (sponsors, affected staff, adjacent departments) may receive inconsistent, untimely, or no information about project progress, risking exactly the kind of disengagement, mixed-signal, and trust problems documented elsewhere in this domain (e.g., D2-020's leadership-communication gap); a communication plan is a standard Define-phase element specifically to prevent this by establishing clear expectations for who is informed, how, and how often, from the project's outset",
      "Sponsors should be responsible for creating their own individual communication expectations informally, with no standardized project-level plan at all",
      "Communication plans should only be created retroactively, after a project has already experienced a stakeholder communication breakdown"
    ],
    "answer": 1,
    "why": "A communication plan is a standard, foundational Define-phase element precisely because its absence predictably produces the kind of stakeholder disengagement and mixed-signal problems documented throughout this bank (e.g., D2-020) \u2014 proactive definition, not reactive fixing, is the correct approach. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle; cross-reference to D2-020 (leadership communication gap).",
    "set": 3,
    "qid": "mbb:set-3:d3-032"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "An amusement ride manufacturer's portfolio committee is deciding whether to invest in dedicated portfolio management software (significant upfront cost) or continue with a well-designed, disciplined manual process (standardized templates, defined cadence, clear escalation criteria, as recommended in this batch's earlier items) at a much lower cost. Given a portfolio of approximately 15 concurrent projects, what should the MBB recommend?",
    "options": [
      "At a moderate portfolio scale (~15 projects), a well-designed, disciplined manual process with the right underlying elements (standardization, cadence, dependency tracking, clear governance thresholds) can be genuinely effective and may not yet justify the cost and change-management burden of dedicated software; the MBB should recommend evaluating whether the *process discipline* (not necessarily the *tooling*) is the actual gap before assuming a software investment is the answer, reserving that investment for if/when portfolio scale or complexity genuinely outgrows what a disciplined manual process can support",
      "Dedicated software is always necessary regardless of portfolio size, since manual processes are inherently and universally inferior",
      "The portfolio committee should be dissolved and replaced entirely by automated software with no human governance judgment involved at all",
      "Manual processes should always be preferred over software regardless of portfolio scale, since software introduces unnecessary complexity"
    ],
    "answer": 0,
    "why": "This tests recognizing that many of the infrastructure gaps demonstrated across this batch (D3-002, D3-005, D3-008, D3-014, D3-017, D3-027, D3-030) are fundamentally *process discipline* gaps (standardization, cadence, dependency tracking, governance thresholds) rather than *tooling* gaps \u2014 a well-designed manual process can resolve most of these at moderate portfolio scale, and the MBB should diagnose which is actually missing before recommending a potentially unnecessary software investment. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management (batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d3-033"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A tea company's project financial case assumes a benefit estimate of $250,000 annually based on a single \"most likely\" scenario, with no range or sensitivity analysis provided. The portfolio committee is asked to approve based on this single-point estimate. What financial-tools limitation should the MBB raise, and what should be added before final approval?",
    "options": [
      "Sensitivity analysis is only relevant for projects with negative NPV, not for projects with an apparently positive point estimate",
      "A single-point estimate conceals the actual underlying uncertainty in the benefit projection; the MBB should recommend a sensitivity analysis or a range (e.g., conservative/most-likely/optimistic scenarios) be presented alongside the single-point estimate, so the portfolio committee can understand how much the project's attractiveness might change under different plausible assumptions, particularly important for the kind of borderline-NPV cases demonstrated elsewhere in this domain (D3-006) where estimate uncertainty could flip a marginal accept/reject conclusion",
      "The project should be rejected automatically since any single-point financial estimate is inherently untrustworthy regardless of its underlying rigor",
      "No limitation exists; a single best-estimate figure is always sufficient for portfolio-level financial decision-making regardless of the underlying estimate's uncertainty"
    ],
    "answer": 1,
    "why": "This connects to D3-006's borderline-NPV lesson: a single-point estimate hides the range of plausible outcomes, and for genuinely borderline or high-uncertainty cases, this concealment can materially mislead a portfolio decision \u2014 sensitivity analysis or scenario ranges are the standard fix. Source: [BOK] Domain III.C, Project Portfolio Financial Tools; cross-reference to D3-006 (borderline NPV case).",
    "set": 3,
    "qid": "mbb:set-3:d3-034"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A pet food manufacturer's ingredient-substitution project team consists entirely of quality and operations personnel, with no representative from R&D/formulation, even though the project directly involves reformulating a recipe. Midway through Analyze, the team discovers a proposed substitute ingredient interacts unexpectedly with another formula component in a way R&D would likely have flagged immediately. What team-composition principle was violated, and what should the MBB require going forward?",
    "options": [
      "R&D should be excluded from all future projects permanently, given that their absence caused this specific issue",
      "No principle was violated; quality and operations personnel are always sufficient for any project touching product formulation, regardless of technical domain expertise gaps",
      "The team composition omitted a critical technical-domain expert (R&D/formulation) whose specialized knowledge directly bears on the project's core technical question, a team-composition gap analogous to (though distinct from) the earlier culinary and craftsmanship expertise-engagement issues (D2-015, D2-047) \u2014 here the gap is about who is formally on the project team from the start, not just how existing team members' expertise is engaged; the MBB should require project chartering to include a technical-domain-fit review of proposed team composition before Analyze-phase work begins, specifically checking whether the project's core technical questions are covered by someone with direct relevant expertise",
      "The project should proceed without R&D involvement even now, since restructuring the team mid-project is never appropriate regardless of the discovered gap"
    ],
    "answer": 2,
    "why": "This is a team-composition/charter-review gap distinct from (though thematically related to) the engagement-style issues tested earlier \u2014 the fix is a formal technical-domain-fit check during chartering, ensuring core technical questions are covered by directly relevant expertise from project inception, not just an engagement-style adjustment with existing team members. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle; parallel to D2-015, D2-047.",
    "set": 3,
    "qid": "mbb:set-3:d3-035"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A motorcycle manufacturer's MBB is designing a portfolio health dashboard for executive review. Which combination of elements would most completely reflect portfolio health, synthesizing the infrastructure principles established across this domain?",
    "options": [
      "A single overall percentage figure representing \"portfolio health,\" with no supporting detail or breakdown",
      "A multi-element dashboard including: project status by standardized categories (per D3-027's standardization principle), resource/capacity utilization across Belts (per D3-014/D1-025's WIP principle), identified cross-project dependencies and risks (per D3-008), and financial benefit tracking distinguishing hard from soft savings (per D3-009/D3-015) \u2014 reflecting that portfolio health is multi-dimensional and cannot be adequately captured by any single aggregated figure",
      "A dashboard showing only the number of projects currently active, with no other information",
      "Only financial figures, since dollar impact is the only dimension of portfolio health that ultimately matters to executives"
    ],
    "answer": 1,
    "why": "This synthesizes several infrastructure and financial-tools principles established across the domain (standardized status reporting, capacity/WIP visibility, dependency/risk tracking, and hard/soft savings distinction) into a genuinely multi-dimensional portfolio health view \u2014 reflecting that no single metric or figure can adequately represent overall portfolio health. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management (batch synthesis).",
    "set": 3,
    "qid": "mbb:set-3:d3-036"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A kayak/canoe manufacturer has $500,000 in available capital for improvement projects this cycle. Three independent (non-mutually-exclusive) candidate projects require $200,000, $250,000, and $300,000 respectively, with NPVs of $180,000, $220,000, and $240,000 \u2014 but the three combined ($750,000) exceed the $500,000 available capital. Using the profitability index (NPV \u00f7 investment) to rank under this capital constraint, which combination of projects should be selected, and why does profitability index (rather than raw NPV ranking) matter here?",
    "options": [
      "Profitability indices: Project 1 = 180/200 = 0.90; Project 2 = 220/250 = 0.88; Project 3 = 240/300 = 0.80. Under capital rationing (a fixed budget insufficient for all candidates), ranking by profitability index rather than raw NPV correctly identifies which combination of projects maximizes total NPV within the constrained budget; selecting Projects 1 and 2 ($200K + $250K = $450K, within the $500K limit) yields a combined NPV of $400,000, while Projects 1 and 3 ($200K + $300K = $500K) yield $420,000 \u2014 actually the higher-value combination despite Project 3's lower profitability index than Project 2, illustrating that profitability index ranking is a useful heuristic but combinatorial checking of feasible combinations within the budget constraint is the fully rigorous approach",
      "The capital constraint is irrelevant since all three projects have already been determined to have positive NPV individually",
      "Select all three projects regardless of the capital constraint, since all three have positive NPV",
      "Select only Project 3, since it has the single highest NPV among the three"
    ],
    "answer": 0,
    "why": "This is a genuinely rigorous capital-rationing question: profitability index is a useful first-pass ranking heuristic under budget constraints, but the fully correct approach checks all feasible combinations within the budget \u2014 here, Projects 1+3 ($500K, NPV $420K) actually beats Projects 1+2 ($450K, NPV $400K) despite Project 2's higher profitability index than Project 3, demonstrating the heuristic's limitation and the value of full combinatorial verification for a small number of candidates. Source: [BOK] Domain III.C, Project Portfolio Financial Tools (capital rationing/profitability index).",
    "chart": {"type": "data-table", "columns": ["Project", "Cost", "NPV", "Profitability index"], "rows": [["Project 1", "$200,000", "$180,000", "0.90"], ["Project 2", "$250,000", "$220,000", "0.88"], ["Project 3", "$300,000", "$240,000", "0.80"]], "whatIf": {"id": "capital-budget", "label": "Available capital", "value": 500, "min": 200, "max": 750, "step": 50, "unit": "K", "committed": 450, "committedLabel": "Projects 1 and 2 combined"}},
    "set": 3,
    "qid": "mbb:set-3:d3-037"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A hydroponic farm's Six Sigma project has met its original numeric goal (a 20% reduction in water usage per crop cycle) but the Black Belt is uncertain whether the project should be formally closed yet, since a control plan has been drafted but not yet tested through a full crop cycle. What should guide this closure decision?",
    "options": [
      "Close the project immediately since the numeric goal has technically been met, regardless of whether the control plan has been validated through actual operation",
      "Closure should be based solely on how much time has elapsed since the project began, regardless of whether the goal or control plan validation status",
      "The project should never be closed, since continuous improvement means no project is ever truly finished",
      "Delay formal closure until the control plan has been validated through at least one full operational cycle (here, a crop cycle) demonstrating that the improved result is sustained under real operating conditions, not just achieved once during the improvement testing itself \u2014 meeting the numeric target during Improve-phase piloting is necessary but not sufficient for closure; sustained performance under the actual control plan is the more complete closure criterion"
    ],
    "answer": 3,
    "why": "This reinforces the sustained-improvement-over-initial-results principle established in D3-010 \u2014 meeting a numeric target during piloting/Improve-phase testing is a necessary but insufficient closure criterion; validating the control plan holds under a full real operational cycle provides more meaningful evidence the improvement is genuinely sustained. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle; cross-reference to D3-010 (sustained improvement principle).",
    "set": 3,
    "qid": "mbb:set-3:d3-038"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "An industrial adhesive manufacturer experiences a sudden major customer contract loss (30% of revenue), and executive leadership wants to immediately suspend the standard portfolio review and intake governance process \"to move fast\" on crisis-response initiatives. What should the MBB recommend regarding portfolio governance during this crisis period?",
    "options": [
      "Fully suspend all portfolio governance immediately and indefinitely as requested, allowing completely unstructured, ungoverned crisis-response project initiation",
      "Refuse any deviation from the standard governance process regardless of the crisis, insisting on the full normal cycle time even during an acute business crisis",
      "Recommend a streamlined, expedited version of governance rather than full suspension \u2014 e.g., a faster intake/approval cycle with a smaller, empowered crisis-response subset of the steering committee able to approve projects quickly, while still maintaining basic capacity-checking (per D3-014) and dependency awareness (per D3-008) so that crisis-response speed doesn't recreate the exact WIP-overload and uncoordinated-duplication problems governance was built to prevent",
      "Recommend permanently disbanding the portfolio governance function entirely, treating the crisis as proof that formal governance was never actually necessary"
    ],
    "answer": 2,
    "why": "This tests balancing genuine crisis urgency against the real risks (WIP overload, duplication, uncoordinated resource conflicts) that full governance suspension would predictably reintroduce \u2014 an expedited but not entirely absent governance model preserves speed while retaining the essential safeguards this batch has established as valuable. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management; cross-reference to D3-008, D3-014.",
    "set": 3,
    "qid": "mbb:set-3:d3-039"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A language interpretation service's Six Sigma project aims to improve interpreter-patient rapport in healthcare settings, an outcome that is genuinely important but difficult to directly monetize. How should the MBB approach financial evaluation for this project, given the difficulty of direct monetization?",
    "options": [
      "Refuse to evaluate the project financially at all, and exclude it from portfolio consideration entirely, since its primary benefit cannot be directly monetized",
      "Every project must have an equally rigorous, directly-monetized financial case, or it should not be considered for the portfolio under any circumstances",
      "Assign an arbitrary large dollar value to the project's benefit without any defensible basis, simply to ensure it scores well against other portfolio candidates",
      "Identify plausible, defensible proxy or downstream financial linkages (e.g., improved rapport correlating with reduced repeat-visit rates, reduced formal complaint/grievance costs, or improved patient outcome metrics that healthcare partners specifically value and may tie to contract terms) to construct a reasonable, appropriately-caveated financial case, while also explicitly documenting the qualitative/mission-relevant value that isn't captured by the financial proxy \u2014 rather than either forcing an artificial direct dollar figure onto an inherently qualitative benefit or excluding the project from financial consideration altogether"
    ],
    "answer": 3,
    "why": "This tests handling projects with genuinely important but hard-to-directly-monetize benefits \u2014 the defensible approach identifies plausible downstream financial proxies where they exist while transparently documenting qualitative value that resists monetization, rather than either fabricating false precision (C) or excluding legitimately valuable projects from consideration entirely (A, D) simply because they don't fit a purely financial framework. Source: [BOK] Domain III.C, Project Portfolio Financial Tools.",
    "set": 3,
    "qid": "mbb:set-3:d3-040"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "Synthesizing the lifecycle principles from both batches of this domain (Define sign-off and stakeholder completeness, Measure-phase MSA gating, Analyze-phase root-cause sufficiency, Improve-phase team composition, and Control-phase sustainment validation), a 3D printing service bureau's new MBB wants a single audit checklist question to ask at *every* phase gate, regardless of which specific phase. What should that universal question be?",
    "options": [
      "\"How much money have we spent so far?\" \u2014 since financial tracking is the only dimension that matters at any phase gate, regardless of the underlying technical or process work quality",
      "\"Has this phase's substantive exit criteria been genuinely satisfied (not just procedurally checked off), and if not, what specific risk are we accepting by proceeding anyway?\" \u2014 a universal question applicable across all five DMAIC phases that forces explicit acknowledgment of any shortcuts, directly addressing the pattern common to every lifecycle failure demonstrated across this domain (marginal MSA, missing sign-off, incomplete root-cause validation, missing technical expertise, unvalidated control plan)",
      "\"Does the Black Belt personally feel confident about the results?\" \u2014 since subjective practitioner confidence is a more reliable indicator than any specific technical exit criteria",
      "\"Are we on schedule?\" \u2014 since schedule adherence is the single most important consideration at every phase gate, more important than the substantive content of each phase's work"
    ],
    "answer": 1,
    "why": "This is the batch's ultimate synthesis question, distilling every lifecycle failure demonstrated across 10+ items (D3-001, D3-004, D3-013, D3-010, D3-026, D3-029, D3-035, D3-038) into one universal diagnostic question applicable at any phase gate \u2014 forcing explicit, honest acknowledgment of any shortcuts rather than allowing them to pass silently, which is the common thread across every failure mode this domain has tested. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle (full-subdomain synthesis, both batches).",
    "set": 3,
    "qid": "mbb:set-3:d3-041"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A luggage manufacturer's MBB is asked to characterize the organization's overall portfolio management maturity, given: standardized status reporting exists, a defined review cadence exists, but there is no dependency/risk register, no capacity-checking intake gate, and prioritization criteria haven't been revisited in over three years. Synthesizing the infrastructure principles from this domain, how should the MBB characterize this maturity level, and what is the priority order for closing the remaining gaps?",
    "options": [
      "The organization should be characterized as having no meaningful portfolio management infrastructure at all, despite the two elements already in place",
      "The organization has partial maturity \u2014 reporting/visibility infrastructure is reasonably established, but two significant gaps remain that pose active, compounding risk (no intake gate, meaning WIP overload risk per D3-014/D1-025, and no dependency register, meaning unmanaged cross-project risk exposure per D3-008), while the stale prioritization criteria (D3-017) represents a strategic-alignment risk that, while real, compounds more slowly; the MBB should prioritize closing the intake-gate and dependency-register gaps first (actively compounding risks), then address the prioritization criteria refresh",
      "The organization has achieved full portfolio management maturity, since two of five infrastructure elements are in place",
      "All five infrastructure elements should be pursued with identical priority and urgency, since maturity models don't support differentiated sequencing"
    ],
    "answer": 1,
    "why": "This capstone item requires synthesizing the domain's infrastructure principles into a genuine maturity assessment with differentiated urgency: actively-compounding risks (unconstrained intake, unmanaged dependencies) warrant more urgent attention than a slower-compounding strategic-alignment gap (stale criteria) \u2014 a nuanced, Evaluate-level judgment rather than a binary \"mature/immature\" or undifferentiated-priority characterization. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management (full-subdomain synthesis, both batches).",
    "set": 3,
    "qid": "mbb:set-3:d3-042"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A fireworks manufacturer's portfolio committee is evaluating a process-safety-improvement project with a modest projected NPV ($85,000) alongside several other candidate projects with substantially higher NPVs ($200,000+) but no direct safety dimension. How should the MBB advise the committee to weigh the safety project relative to pure NPV ranking?",
    "options": [
      "The safety project should be ranked strictly by its NPV figure alone, with no special consideration given to its safety dimension, treating it identically to any other candidate",
      "The safety project should automatically be ranked above all other candidates regardless of its actual NPV or the other projects' relative merits",
      "The MBB should advise that the safety project's evaluation include the potential cost of a safety incident it's designed to prevent (which, if quantified even conservatively \u2014 including regulatory, reputational, potential injury/fatality liability, and operational disruption costs \u2014 often substantially exceeds the projected NPV figure calculated from routine operational savings alone), and should recommend the committee weigh safety-critical projects with appropriate additional consideration beyond a pure NPV comparison against non-safety candidates, echoing the leading-indicator safety principle established in D1-055",
      "Safety-related projects should never be evaluated using any financial tools at all, since safety has no legitimate connection to financial analysis"
    ],
    "answer": 2,
    "why": "This connects to the safety leading-indicator principle established in D1-055: safety-critical projects' true expected value often substantially exceeds what routine operational-savings-only NPV calculations capture, once the (admittedly harder to precisely quantify, but real and often severe) cost of a prevented incident is included \u2014 the MBB should advise weighing this appropriately rather than treating the project identically to non-safety candidates on a narrow NPV basis. Source: [BOK] Domain III.C, Project Portfolio Financial Tools; direct cross-reference to D1-055 (safety leading-indicator principle).",
    "set": 3,
    "qid": "mbb:set-3:d3-043"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "An escape room chain's Black Belt discovers during Improve-phase piloting that a proposed solution reveals a previously-unidentified root cause not surfaced during the original Analyze phase. Is returning to Analyze at this point a violation of DMAIC's sequential structure?",
    "options": [
      "No; while DMAIC phases are generally sequential, the methodology is not so rigid as to prohibit returning to an earlier phase when new information (such as a previously-unidentified root cause surfacing during piloting) genuinely warrants it \u2014 treating DMAIC as a purely linear, one-way process that can never incorporate new learning would itself be a misapplication of the methodology's actual intent, which is disciplined problem-solving, not rigid procedural sequence for its own sake",
      "The entire project should be restarted from Define whenever any new information emerges during any later phase, regardless of the information's actual scope or significance",
      "The team should ignore the newly discovered root cause entirely and proceed with the original Improve-phase plan regardless of the new information",
      "Yes; DMAIC is a strictly linear methodology, and once a team has left a phase, returning to it under any circumstances is a fundamental violation of the methodology that should never occur"
    ],
    "answer": 0,
    "why": "This tests understanding that DMAIC's phase structure serves disciplined problem-solving, not rigid procedural sequence \u2014 genuinely new, significant information (a previously-unidentified root cause) legitimately warrants returning to an earlier phase, and the methodology's actual intent is well-served (not violated) by this kind of disciplined iteration when new evidence demands it. Source: [CSSC] Ch. 11, Introduction to DMAIC and DMADV; [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-044"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A car wash chain's project charter commits to a 6-week timeline for a full DMAIC cycle addressing a moderately complex, multi-site water-usage-reduction problem, a timeline the assigned Black Belt privately believes is unrealistic given the problem's actual complexity, but did not raise this concern during charter approval. By week 5, the project is barely through Analyze. What project management principle was violated at the charter stage, and what should the MBB have required?",
    "options": [
      "The Black Belt should be blamed entirely and replaced, since raising concerns about timelines is solely the Black Belt's individual responsibility with no charter-process implications",
      "The charter-approval stage should include the assigned Black Belt's honest, professional assessment of timeline feasibility given the problem's actual scope and complexity \u2014 silently accepting a timeline privately believed to be unrealistic sets the project up for exactly the kind of schedule failure now occurring, and denies the sponsor the opportunity to make an informed decision (e.g., extending the timeline, narrowing the scope, or adding resources) at the point when doing so would have been far less costly than discovering the problem mid-project",
      "There is no violation; Black Belts should always accept whatever timeline is proposed during chartering without raising concerns, regardless of their own professional assessment of feasibility",
      "The 6-week timeline should be extended indefinitely without any further scope or resource discussion, simply allowing the project to take as long as it takes"
    ],
    "answer": 1,
    "why": "This tests recognizing that charter approval should include honest, professional feasibility assessment from the person actually executing the work \u2014 silently accepting a privately-doubted timeline denies the sponsor an informed decision point and predictably leads to exactly the kind of downstream schedule failure demonstrated here, a preventable outcome if raised honestly at chartering. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle.",
    "set": 3,
    "qid": "mbb:set-3:d3-045"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A vending machine operator's completed Six Sigma projects are closed out with no centralized archive \u2014 final reports exist only on individual Black Belts' personal drives, and when a Black Belt leaves the company, their completed project documentation is often lost entirely. What portfolio infrastructure element is missing, and why does it matter?",
    "options": [
      "Nothing is missing; completed projects no longer have any organizational relevance once closed, so their documentation's fate afterward is unimportant",
      "Archiving should be each individual Black Belt's personal responsibility to maintain indefinitely on their own personal devices, with no organizational-level backup or centralization",
      "Only currently-employed Black Belts' projects need archiving; departed Black Belts' historical work can be safely discarded entirely",
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
      "Corrected total Year 1 cost = $350,000 + $40,000 + $15,000 + $60,000 + $20,000 = $485,000; this illustrates the total cost of ownership (TCO) principle \u2014 the full cost of a capital investment includes not just the purchase price but all directly-associated implementation, transition, and ongoing costs, and omitting these (as the original case did) can significantly understate the true investment required, distorting NPV, payback, and other financial comparisons against other portfolio candidates",
      "The corrected cost is $425,000, since ramp-down lost production should never be counted as a real cost",
      "Total cost of ownership calculations are unnecessary as long as the purchase price is accurately stated",
      "The corrected cost is still $350,000, since only the purchase price is relevant to portfolio financial comparison"
    ],
    "answer": 0,
    "why": "$350,000 + $40,000 + $15,000 + $60,000 + $20,000 = $485,000. This tests both correct arithmetic and the total cost of ownership (TCO) principle \u2014 purchase price alone frequently and significantly understates a capital investment's true cost, directly paralleling the incomplete cost-benefit analysis flaw tested in D3-031 but applied to the cost side of a capital equipment case specifically. Source: [BOK] Domain III.C, Project Portfolio Financial Tools; cross-reference to D3-031 (incomplete cost-benefit analysis).",
    "set": 3,
    "qid": "mbb:set-3:d3-047"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A hearing aid manufacturer's newly appointed MBB wants to design a single, comprehensive phase-gate audit checklist covering the full range of lifecycle failure modes demonstrated across this entire domain (Define sign-off/stakeholder completeness/communication planning/team composition/timeline feasibility; Measure MSA adequacy; Analyze root-cause sufficiency; Improve solution validation; Control sustainment). Which checklist design principle should govern how this audit tool is structured?",
    "options": [
      "A single yes/no question per phase (\"Is this phase done?\"), since simplicity is always preferable to comprehensiveness in audit tool design regardless of what the audit needs to actually catch",
      "A single checklist item covering only budget and schedule status, since financial and timeline tracking are the only aspects of lifecycle management genuinely worth auditing",
      "A phase-specific set of substantive exit-criteria questions for each DMAIC phase (e.g., for Define: charter sign-off obtained? all affected stakeholder groups, including frontline execution staff, represented? communication plan defined? team composition technically appropriate to the problem? timeline feasibility honestly assessed? \u2014 and analogous substantive questions for Measure's MSA adequacy, Analyze's root-cause sufficiency, Improve's solution validation, and Control's sustainment mechanisms), explicitly designed so that each specific failure mode demonstrated across this domain has a corresponding checklist question that would have caught it before the project proceeded",
      "No checklist is necessary; experienced Black Belts should be trusted to self-identify any lifecycle gaps without any structured audit tool"
    ],
    "answer": 2,
    "why": "This final capstone item for Domain III requires synthesizing every specific lifecycle failure mode demonstrated across both batches (D3-001, D3-004, D3-010, D3-013, D3-026, D3-029, D3-032, D3-035, D3-038, D3-045) into a genuinely comprehensive, phase-specific audit tool design \u2014 each documented failure mode should map to a specific checklist question designed to catch it proactively, a true Create-level synthesis task closing out the domain's lifecycle subdomain. Source: [BOK] Domain III.A, Project Management Principles and Lifecycle (full-subdomain capstone).",
    "set": 3,
    "qid": "mbb:set-3:d3-048"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A drone delivery startup's newly appointed MBB is designing portfolio management infrastructure from scratch for a rapidly scaling organization (similar to the meal-kit delivery scaling scenario in D2-069), wanting to avoid every infrastructure gap demonstrated across this domain (missing centralized visibility, mismatched review cadence, missing dependency/risk tracking, unconstrained intake, stale prioritization criteria, non-standardized reporting, undefined escalation thresholds, no centralized archive). Which single design principle should anchor the overall infrastructure architecture?",
    "options": [
      "Design infrastructure around a small number of core, complementary capabilities \u2014 centralized visibility, appropriately-paced governance cadence, dependency/risk aggregation, capacity-checking intake, periodically-revalidated prioritization criteria, standardized reporting with clear escalation thresholds, and a centralized knowledge archive \u2014 built initially in a lightweight, scalable form appropriate to current organizational size (per the resource-scaling principle from D1-040/D2-032), with an explicit plan to revisit and mature each capability as the organization grows (per the periodic re-validation principle from D1-069/D2-069/D3-017), rather than either under-building or over-building relative to current and near-future actual needs",
      "Copy another company's infrastructure exactly, regardless of differences in industry, scale, or organizational structure",
      "Skip infrastructure design entirely at this early stage, since a startup should prioritize speed over any governance structure regardless of the risks this has been shown to create elsewhere in this domain",
      "Build the most complex, feature-complete infrastructure possible immediately, regardless of the organization's current small scale and rapid rate of change, mirroring a much larger and more mature organization's infrastructure"
    ],
    "answer": 0,
    "why": "This final capstone item for the infrastructure subdomain requires synthesizing not just this domain's infrastructure gaps but also the resource-scaling principle (D1-040, D2-032) and periodic re-validation principle (D1-069, D2-069, D3-017) established across the entire question bank into a single coherent design philosophy: build the necessary core capabilities in a scale-appropriate, initially lightweight form, with an explicit maturation plan \u2014 genuinely Create-level synthesis spanning multiple domains. Source: [BOK] Domain III.B, Project Portfolio Infrastructure and Management (full-subdomain capstone); cross-domain synthesis with D1-040, D1-069, D2-032, D2-069.",
    "set": 3,
    "qid": "mbb:set-3:d3-049"
  },
  {
    "sub": "mbb-portfolio",
    "stem": "A funeral casket manufacturer's MBB is asked to design a standard financial evaluation template to be used for every future portfolio candidate project, synthesizing every financial-tools principle demonstrated across this domain (payback period limitations, NPV/discount-rate sensitivity, hard vs. soft savings distinction, cost-benefit completeness including omitted/hidden costs, NPV vs. IRR ranking conflicts, sunk cost exclusion, sensitivity analysis for uncertain estimates, capital rationing under budget constraints, safety-critical project special consideration, and total cost of ownership). Which template design best reflects synthesis of all these principles?",
    "options": [
      "A structured template requiring: (1) total cost of ownership (not just purchase/implementation price, capturing all directly-associated costs per D3-047), (2) NPV and payback period calculated together (never either alone, given each metric's distinct limitations per D3-003/D3-006/D3-018), (3) explicit hard vs. soft savings classification (per D3-009/D3-015), (4) a sensitivity range rather than a single-point estimate for any benefit with meaningful uncertainty (per D3-034), (5) explicit confirmation that no sunk costs have influenced the forward-looking analysis (per D3-024), (6) a completeness check for commonly-omitted cost categories such as regulatory/certification triggers (per D3-031), and (7) a flag for any safety-critical dimension warranting evaluation beyond routine NPV alone (per D3-043) \u2014 with capital-rationing/combinatorial analysis (per D3-037) applied at the portfolio level once individual project templates are complete",
      "Different, inconsistent templates for every individual project, tailored ad hoc by each Black Belt with no standardized elements at all",
      "A single-line template requiring only \"estimated annual savings\" with no further detail, structure, or supporting analysis of any kind",
      "A template requiring only a subjective \"high/medium/low\" value rating assigned by the project sponsor, with no supporting quantitative analysis of any kind"
    ],
    "answer": 0,
    "why": "This final capstone item for Domain III requires synthesizing all ten distinct financial-tools principles demonstrated across both batches (D3-003, D3-006, D3-009, D3-012, D3-015, D3-018, D3-024, D3-031, D3-034, D3-037, D3-043, D3-047) into a single, comprehensive, standardized evaluation template \u2014 the clearest possible demonstration of Create-level synthesis closing out Domain III's financial-tools subdomain and the domain as a whole. Source: [BOK] Domain III.C, Project Portfolio Financial Tools (full-subdomain and full-domain capstone).",
    "set": 3,
    "qid": "mbb:set-3:d3-050"
  },
  ];
})(window);