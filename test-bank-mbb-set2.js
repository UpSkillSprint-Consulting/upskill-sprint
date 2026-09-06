(function(global){
  'use strict';

  var DATASET='test-bank-assets/mbb-160/batch-01/datasets.json';
  var SPECS='test-bank-assets/mbb-160/batch-01/visual-specs.json';
  var VALIDATION='test-bank-assets/mbb-160/batch-01/validation.json';
  var FALLBACK='test-bank-assets/mbb-160/batch-01/static-fallbacks.html';
  var DATASET2='test-bank-assets/mbb-160/batch-02/datasets.json';
  var SPECS2='test-bank-assets/mbb-160/batch-02/visual-specs.json';
  var VALIDATION2='test-bank-assets/mbb-160/batch-02/validation.json';
  var FALLBACK2='test-bank-assets/mbb-160/batch-02/static-fallbacks.html';
  var DATASET3='test-bank-assets/mbb-160/batch-03/datasets.json';
  var SPECS3='test-bank-assets/mbb-160/batch-03/visual-specs.json';
  var VALIDATION3='test-bank-assets/mbb-160/batch-03/validation.json';
  var FALLBACK3='test-bank-assets/mbb-160/batch-03/static-fallbacks.html';
  var DATASET4='test-bank-assets/mbb-160/batch-04/datasets.json';
  var SPECS4='test-bank-assets/mbb-160/batch-04/visual-specs.json';
  var VALIDATION4='test-bank-assets/mbb-160/batch-04/validation.json';
  var FALLBACK4='test-bank-assets/mbb-160/batch-04/static-fallbacks.html';
  var DATASET5='test-bank-assets/mbb-160/batch-05/datasets.json';
  var SPECS5='test-bank-assets/mbb-160/batch-05/visual-specs.json';
  var VALIDATION5='test-bank-assets/mbb-160/batch-05/validation.json';
  var FALLBACK5='test-bank-assets/mbb-160/batch-05/static-fallbacks.html';
  var DATASET6='test-bank-assets/mbb-160/batch-06/datasets.json';
  var SPECS6='test-bank-assets/mbb-160/batch-06/visual-specs.json';
  var VALIDATION6='test-bank-assets/mbb-160/batch-06/validation.json';
  var FALLBACK6='test-bank-assets/mbb-160/batch-06/static-fallbacks.html';
  var DATASET7='test-bank-assets/mbb-160/batch-07/datasets.json';
  var SPECS7='test-bank-assets/mbb-160/batch-07/visual-specs.json';
  var VALIDATION7='test-bank-assets/mbb-160/batch-07/validation.json';
  var FALLBACK7='test-bank-assets/mbb-160/batch-07/static-fallbacks.html';

  function visual(qid,type,altText,interactionPurpose){
    var anchor=qid.replace(/:/g,'-');
    return {
      type:type,
      datasetRef:DATASET+'#'+qid,
      specRef:SPECS+'#'+qid,
      staticAssetRef:FALLBACK+'#'+anchor,
      altText:altText,
      interactionPurpose:interactionPurpose||'',
      validationRef:VALIDATION+'#'+qid,
      breakpointsValidated:['desktop','tablet','mobile'],
      answerCueAudit:true
    };
  }

  function visual2(qid,type,altText,interactionPurpose){
    var anchor=qid.replace(/:/g,'-');
    return {
      type:type,
      datasetRef:DATASET2+'#'+qid,
      specRef:SPECS2+'#'+qid,
      staticAssetRef:FALLBACK2+'#'+anchor,
      altText:altText,
      interactionPurpose:interactionPurpose||'',
      validationRef:VALIDATION2+'#'+qid,
      breakpointsValidated:['desktop','tablet','mobile'],
      answerCueAudit:true
    };
  }

  function visual3(qid,type,altText,interactionPurpose){
    var anchor=qid.replace(/:/g,'-');
    return {
      type:type,
      datasetRef:DATASET3+'#'+qid,
      specRef:SPECS3+'#'+qid,
      staticAssetRef:FALLBACK3+'#'+anchor,
      altText:altText,
      interactionPurpose:interactionPurpose||'',
      validationRef:VALIDATION3+'#'+qid,
      breakpointsValidated:['desktop','tablet','mobile'],
      answerCueAudit:true
    };
  }

  function visual4(qid,type,altText,interactionPurpose){
    var anchor=qid.replace(/:/g,'-');
    return {
      type:type,
      datasetRef:DATASET4+'#'+qid,
      specRef:SPECS4+'#'+qid,
      staticAssetRef:FALLBACK4+'#'+anchor,
      altText:altText,
      interactionPurpose:interactionPurpose||'',
      validationRef:VALIDATION4+'#'+qid,
      breakpointsValidated:['desktop','tablet','mobile'],
      answerCueAudit:true
    };
  }

  function visual5(qid,type,altText,interactionPurpose){
    var anchor=qid.replace(/:/g,'-');
    return {
      type:type,datasetRef:DATASET5+'#'+qid,specRef:SPECS5+'#'+qid,
      staticAssetRef:FALLBACK5+'#'+anchor,altText:altText,
      interactionPurpose:interactionPurpose||'',validationRef:VALIDATION5+'#'+qid,
      breakpointsValidated:['desktop','tablet','mobile'],answerCueAudit:true
    };
  }

  function visual6(qid,type,altText,interactionPurpose){
    var anchor=qid.replace(/:/g,'-');
    return {type:type,datasetRef:DATASET6+'#'+qid,specRef:SPECS6+'#'+qid,
      staticAssetRef:FALLBACK6+'#'+anchor,altText:altText,interactionPurpose:interactionPurpose||'',
      validationRef:VALIDATION6+'#'+qid,breakpointsValidated:['desktop','tablet','mobile'],answerCueAudit:true};
  }

  function visual7(qid,type,altText,interactionPurpose){
    var anchor=qid.replace(/:/g,'-');
    return {type:type,datasetRef:DATASET7+'#'+qid,specRef:SPECS7+'#'+qid,
      staticAssetRef:FALLBACK7+'#'+anchor,altText:altText,interactionPurpose:interactionPurpose||'',
      validationRef:VALIDATION7+'#'+qid,breakpointsValidated:['desktop','tablet','mobile'],answerCueAudit:true};
  }

  var batch1=[
  {
    "qid": "mbb:set-2:original-001",
    "set": 2,
    "batch": 1,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "A. Strategic Plan Development",
      "topic": "Hoshin Kanri and strategic plan deployment"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": false,
    "stem": "The target-and-means cascade shown below was issued top-down. Each function then developed its proposed means independently, and leaders plan to lock the annual plan tomorrow. Which action should the Master Black Belt recommend before the plan is finalized?",
    "options": [
      "Approve the cascade because every proposed means has a numeric target and functional owner, then review results at quarterly checkpoints",
      "Replace the unresolved constraints with stretch targets owned by each function and let annual performance reviews resolve any conflicts",
      "Run catchball across levels and functions to negotiate means, constraints, resources, and shared ownership",
      "Convert every target into an independent DMAIC charter before discussing cross-functional conflicts"
    ],
    "answer": 2,
    "why": "Hoshin Kanri requires more than a top-down cascade. Catchball tests whether proposed means are feasible, reconciles shared constraints such as IT capacity and contracts, and creates vertical and horizontal alignment before commitments are locked. Numeric targets alone do not resolve conflicting means. <b>C. Run catchball across levels and functions to negotiate means, constraints, resources, and shared ownership</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 1, Hoshin Kanri, pp. 7-12.</span>",
    "optionRationales": [
      "A target can be measurable while its means remain infeasible or mutually inconsistent.",
      "Relabeling constraints as stretch targets conceals capacity and dependency risk.",
      "Correct. Catchball negotiates targets and means vertically and coordinates them horizontally.",
      "Projects should follow strategic alignment; premature charters would institutionalize unresolved conflicts."
    ],
    "formula": null,
    "assumptions": [
      "The table is the complete information available before plan approval.",
      "The unresolved constraints affect more than one organizational unit."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "Hoshin Kanri",
      "catchball",
      "strategic deployment",
      "horizontal alignment",
      "target and means"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 1 - Hoshin Kanri",
    "sourcePages": "7-12",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 1 - Strategic Plan Deployment",
        "section": "Hoshin Kanri",
        "pages": "7-12"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Level / function",
        "Target",
        "Proposed means",
        "Unresolved constraint"
      ],
      "rows": [
        [
          "Corporate",
          "Reduce end-to-end lead-time variation 30%",
          "Regional standard work",
          "None recorded"
        ],
        [
          "East distribution",
          "Reduce picking cycle 25%",
          "Add a shift and automate picking",
          "Shared IT capacity unknown"
        ],
        [
          "West transport",
          "Reduce transport delay 20%",
          "Consolidate carriers",
          "Procurement contract conflict"
        ],
        [
          "Customer service",
          "Reduce status calls 40%",
          "Launch self-service portal",
          "Same IT capacity required"
        ]
      ]
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-01/datasets.json#mbb:set-2:original-001",
      "specRef": "test-bank-assets/mbb-160/batch-01/visual-specs.json#mbb:set-2:original-001",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-01/static-fallbacks.html#mbb-set-2-original-001",
      "altText": "A four-row deployment table shows corporate and functional targets, proposed means, and unresolved cross-functional constraints. East distribution and customer service require the same unconfirmed IT capacity, while West transport has a procurement conflict.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-01/validation.json#mbb:set-2:original-001",
      "breakpointsValidated": [],
      "answerCueAudit": true,
      "validationScope": "Generated metadata is not a browser test; see docs/audits/mbb-set2-batch1.md for measured evidence."
    }
  },
  {
    "qid": "mbb:set-2:original-002",
    "set": 2,
    "batch": 1,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "B. Strategic Plan Alignment",
      "topic": "Project alignment with strategic plans and business objectives"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "A health system has three proposed projects: automate central scheduling, reduce denied claims, and redesign community vaccination outreach. Its three strategic objectives are shorter access time, improved operating margin, and reduced rural health inequity. Each project sponsor claims strategic alignment, but none has defined a measurable contribution to an objective. What should the Master Black Belt do first?",
    "options": [
      "Require each sponsor to map project CTQs and benefits to a strategic objective and quantify the expected contribution before ranking",
      "Rank the projects by sponsor seniority and stated urgency because executives are accountable for translating strategy into action",
      "Approve all three after recording a qualitative association to an objective, then quantify each contribution during Measure",
      "Select denied claims first because measurable margin improvements should precede access-time and health-equity outcomes"
    ],
    "answer": 0,
    "why": "Strategic alignment must be testable. Mapping each project's CTQs, outcome measures, and expected benefits to a strategic objective creates the evidence needed for comparison and exposes weak or merely verbal alignment. Sponsor rank and a finance-first rule do not establish enterprise value. <b>A. Require each sponsor to map project CTQs and benefits to a strategic objective and quantify the expected contribution before ranking</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 2, Project Alignment with Strategic Plans and Business Objectives, pp. 23-27.</span>",
    "optionRationales": [
      "Correct. It creates a measurable line of sight from project outputs to enterprise outcomes.",
      "Authority is not a substitute for quantified strategic contribution.",
      "Qualitative association is insufficient for prioritization and benefit governance.",
      "The strategy contains three legitimate dimensions; finance does not automatically dominate."
    ],
    "formula": null,
    "assumptions": [
      "The objectives have already been approved.",
      "No project is legally mandatory."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "strategic alignment",
      "CTQ",
      "business objectives",
      "project selection",
      "line of sight"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 2 - Project Alignment with Strategic Plans and Business Objectives",
    "sourcePages": "23-27",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 2 - Strategic Plan Alignment",
        "section": "Project Alignment with Strategic Plans; Project Alignment with Business Objectives",
        "pages": "23-27"
      }
    ],
    "studentContext": "The three strategic objectives have already been approved. None of the candidate projects is legally mandatory."
  },
  {
    "qid": "mbb:set-2:original-003",
    "set": 2,
    "batch": 1,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "C. Infrastructure Elements of Improvement Systems",
      "topic": "Governance, assessment, resource planning, execution, and system improvement"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Finance and insurance",
    "quantitative": false,
    "stem": "An insurer trained 92 Belts in one year. Thirty-eight projects are active, only nine have engaged sponsors, benefit calculations use four incompatible definitions, and no project has passed an independent finance review. The executive committee proposes training another 60 Belts to accelerate results. Which response best addresses the deployment system?",
    "options": [
      "Train the new cohort, require each candidate to bring a fully screened project charter, and use training completion as the deployment-readiness gate",
      "Freeze every project until the organization adopts one statistical package and retrains all current Belts on that platform",
      "Move validation to the Belts with a standard self-certification worksheet and involve Finance only for disputed results",
      "Pause cohort expansion, assess deployment maturity, standardize governance and benefit rules, and align sponsor and project capacity"
    ],
    "answer": 3,
    "why": "The constraint is the deployment infrastructure, not the number of trained people. More Belts would increase work in process while sponsorship, governance, project selection, and benefit validation remain unstable. A maturity assessment and resource-capacity plan should precede further expansion. <b>D. Pause cohort expansion, assess deployment maturity, standardize governance and benefit rules, and align sponsor and project capacity</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 3, Governance through Measure and Improve the System, pp. 28-52.</span>",
    "optionRationales": [
      "A project idea does not repair sponsorship, governance, or finance controls.",
      "Software standardization is secondary and does not justify freezing all useful work.",
      "Independent benefit validation is a governance control and should not be removed from Finance.",
      "Correct. It treats the deployment as a system and matches demand with governing capacity."
    ],
    "formula": null,
    "assumptions": [
      "The current projects are not subject to an immediate safety or regulatory stop."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "deployment maturity",
      "governance",
      "resource planning",
      "benefit validation",
      "work in process"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 3 - Deployment of Six Sigma Systems",
    "sourcePages": "28-52",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 3 - Deployment of Six Sigma Systems",
        "section": "Governance; Assessment; Resource Planning; Execution; Measure and Improve the System",
        "pages": "28-52"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-004",
    "set": 2,
    "batch": 1,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "D. Improvement Methodologies",
      "topic": "Integrated selection of DMAIC, DMADV, Lean, and theory of constraints"
    },
    "difficulty": "Expert",
    "cognitive": "Apply",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Product development and engineering",
    "quantitative": false,
    "stem": "A manufacturer must design a new connected service whose customer requirements are still being translated, improve the chronic installation defects in its existing service, and relieve a single certification laboratory that limits total throughput. Which deployment architecture is most defensible?",
    "options": [
      "Use DMAIC for all three because a common roadmap and tollgate vocabulary are more important than differences in problem type",
      "Use DMADV for the new service, DMAIC for chronic defects, and constraint-focused flow improvement for the laboratory within one governance system",
      "Use Lean only, because waste elimination can be extended to customer design, chronic variation, laboratory capacity, and every related governance decision",
      "Use separate methodologies with separate executives, measures, benefit rules, and portfolio reviews so that each technical approach preserves its purity"
    ],
    "answer": 1,
    "why": "The roadmap should match the nature of the work. DMADV fits a new design with requirements translation, DMAIC fits an existing underperforming process with unknown causes, and theory-of-constraints/Lean flow methods address the system bottleneck. Shared governance prevents competing local optimizations. <b>B. Use DMADV for the new service, DMAIC for chronic defects, and constraint-focused flow improvement for the laboratory within one governance system</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 4, Six Sigma Methodologies, pp. 53-69.</span>",
    "optionRationales": [
      "A single roadmap can force inappropriate assumptions about whether a process or design already exists.",
      "Correct. It selects methods by problem type while integrating deployment governance.",
      "Lean alone does not provide the complete design and advanced variation-analysis roadmaps required here.",
      "Fragmented governance encourages conflicting objectives and incomparable benefits."
    ],
    "formula": null,
    "assumptions": [
      "The new service has no stable existing design to improve.",
      "The certification laboratory is the verified system constraint."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "DMAIC",
      "DMADV",
      "Lean",
      "theory of constraints",
      "method selection"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 4 - Six Sigma Methodologies",
    "sourcePages": "53-69",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 4 - Six Sigma Methodologies",
        "section": "DMAIC; DFSS; Lean; Business Systems and Process Management",
        "pages": "53-69"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-005",
    "set": 2,
    "batch": 1,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "F. Pipeline Management",
      "topic": "Pipeline creation, prioritization, life-cycle management, and risk"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Cross-industry enterprise/deployment case",
    "quantitative": false,
    "stem": "The enterprise has eight Black-Belt-months available for this planning window. P1 is mandatory. Policy then maximizes the comparable, finance-validated NPVs of ready projects within capacity; the listed risks have already been judged acceptable. P4 cannot start until P1 finishes at the end of this window. P6 cannot start without its data foundation, but a separate prerequisite-scoping task needs exactly one BB-month and can run now. Which listed plan follows this policy?",
    "options": [
      "Authorize P1 and P2, use the remaining capacity to define P6's prerequisite, and re-evaluate the deferred projects at the next gate",
      "Authorize P2 and P6 because their combined NPV is highest, then seek emergency resources for mandatory P1",
      "Authorize P1, P3, and P5 because their combined demand fills capacity and diversifies the portfolio",
      "Start every project at reduced staffing so none loses its sponsor or priority position during this window"
    ],
    "answer": 0,
    "why": "The mandatory P1 uses 3 BB-months. Of the listed feasible plans, P1 + P2 uses 7 and has combined NPV $1.9M; P1 + P3 + P5 uses 8 but has combined NPV $1.8M. The stated policy therefore selects P1 + P2, with the remaining month used for the separately defined prerequisite-scoping task. P4 and P6 are not ready in this window. Scoping must not be credited with P6's full future benefit, and filling capacity is not itself the objective. <b>A. Authorize P1 and P2, use the remaining capacity to define P6's prerequisite, and re-evaluate the deferred projects at the next gate</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 6, Risk Management and Pipeline Creation/Management, pp. 88-99.</span>",
    "optionRationales": [
      "Correct. The plan meets the mandatory constraint, has the greater NPV among the listed feasible alternatives, and fits the defined scoping task.",
      "P6 is not ready and this choice omits the mandatory project.",
      "This feasible plan has NPV $1.8M versus $1.9M for P1 + P2; utilization and diversification do not override the stated decision policy.",
      "Starting all projects creates excessive work in process and hides the capacity constraint."
    ],
    "formula": null,
    "assumptions": [
      "NPVs are additive, comparable, and finance-validated.",
      "BB-months are the binding resource and no extra resources are available.",
      "P1 must be staffed this window; P4 and P6 cannot start this window.",
      "Scoping P6 uses one BB-month but does not earn P6's projected NPV."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "pipeline management",
      "capacity",
      "portfolio risk",
      "project prioritization",
      "dependencies"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 6 - Risk Analysis of Projects and the Pipeline",
    "sourcePages": "88-99",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 6 - Risk Analysis of Projects and the Pipeline",
        "section": "Risk Management; Pipeline Creation; Pipeline Management",
        "pages": "88-99"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Project",
        "Strategic alignment (1-5)",
        "Finance-validated NPV",
        "BB-months",
        "Readiness / constraint"
      ],
      "rows": [
        [
          "P1 - Regulatory complaints",
          "5",
          "$0.4M",
          "3",
          "Mandatory; ready"
        ],
        [
          "P2 - Predictive maintenance",
          "4",
          "$1.5M",
          "4",
          "Ready; medium risk"
        ],
        [
          "P3 - Billing rework",
          "2",
          "$0.9M",
          "3",
          "Ready; low risk"
        ],
        [
          "P4 - Supplier digitization",
          "4",
          "$0.7M",
          "2",
          "P1 output available next window"
        ],
        [
          "P5 - Warehouse space",
          "3",
          "$0.5M",
          "2",
          "Ready; low risk"
        ],
        [
          "P6 - Demand forecasting",
          "5",
          "$1.8M",
          "5",
          "Data foundation absent"
        ]
      ],
      "whatIf": {
        "id": "mbb-b01-q005-capacity",
        "label": "Explore capacity (answer using 8)",
        "min": 6,
        "max": 12,
        "step": 1,
        "value": 8,
        "unit": "BB-months",
        "committed": 3,
        "committedLabel": "mandatory P1"
      }
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-01/datasets.json#mbb:set-2:original-005",
      "specRef": "test-bank-assets/mbb-160/batch-01/visual-specs.json#mbb:set-2:original-005",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-01/static-fallbacks.html#mbb-set-2-original-005",
      "altText": "A six-project portfolio table gives strategic-alignment ratings, finance-validated NPVs, Black-Belt-month demand, and readiness constraints. P1 is mandatory and needs three months. P2 is ready and needs four. P6 has the highest NPV but lacks its data foundation.",
      "interactionPurpose": "Adjust the available Black-Belt-month capacity to compare which portfolio remains feasible and which prerequisite work becomes fundable.",
      "validationRef": "test-bank-assets/mbb-160/batch-01/validation.json#mbb:set-2:original-005",
      "breakpointsValidated": [],
      "answerCueAudit": true,
      "validationScope": "Generated metadata is not a browser test; see docs/audits/mbb-set2-batch1.md for measured evidence."
    },
    "studentContext": "Use the stated eight-month capacity for your answer. The slider is exploratory; changing it does not change the question or answer key.",
    "bokCognitiveMaximum": "Create"
  },
  {
    "qid": "mbb:set-2:original-006",
    "set": 2,
    "batch": 1,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "A. Organizational Design",
      "topic": "Systems thinking and unintended consequences"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Service and transactional operations",
    "quantitative": false,
    "stem": "A contact center reduced average handle time by 18% after agents were rewarded for ending calls quickly. Transfers increased 33%, repeat calls increased 28%, and total weekly labor hours rose 11%. Leaders want to tighten the handle-time target. What is the strongest systems-thinking response?",
    "options": [
      "Tighten the target only for experienced agents and monitor repeat calls because those agents have lower learning-curve risk",
      "Remove every handle-time measure, replace it with customer-satisfaction survey results, and continue managing transfers and repeat demand within current functional boundaries",
      "Add rewards for low transfer and repeat-call rates while leaving the process boundary and handle-time target unchanged",
      "Map the end-to-end feedback effects and redesign the measures around resolution, repeat demand, customer outcome, and total system effort"
    ],
    "answer": 3,
    "why": "The before-and-after pattern is consistent with work shifting into transfers and repeat demand, but timing alone does not prove that the incentive caused every change. Map and test the end-to-end mechanism, including competing explanations, before tightening the target. Systems thinking expands the boundary and uses resolution, customer outcomes, and total effort to avoid local optimization at the system's expense. <b>D. Map the end-to-end feedback effects and redesign the measures around resolution, repeat demand, customer outcome, and total system effort</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 7, Systems Thinking, pp. 100-103.</span>",
    "optionRationales": [
      "Experience segmentation alone does not investigate the suspected end-to-end mechanism or the wider increase in work.",
      "Handle time can remain useful as a balancing diagnostic; the issue is using it as the dominant reward target.",
      "A second local target can create another gaming tradeoff without changing the system boundary.",
      "Correct. It tests the suspected feedback mechanism and evaluates the total-system outcome rather than assuming causation from timing."
    ],
    "formula": null,
    "assumptions": [
      "The changes occurred after the reward system and no major volume mix shift occurred."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "systems thinking",
      "suboptimization",
      "feedback loop",
      "unintended consequences",
      "metrics"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 7 - Systems Thinking",
    "sourcePages": "100-103",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 7 - Organizational Design",
        "section": "Systems Thinking",
        "pages": "100-103"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-007",
    "set": 2,
    "batch": 1,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "B. Executive and Team Leadership Roles",
      "topic": "Executive responsibilities for resources, change, and communication"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Public sector, nonprofit, and regulated operations",
    "quantitative": false,
    "stem": "A public agency's executive sponsor attends project kickoffs but delegates every review, line managers penalize Belt time as lost utilization, and Finance will not validate benefits without executive direction. The steering committee asks the Master Black Belt to compensate through stronger technical coaching. What should the MBB recommend?",
    "options": [
      "Increase technical review frequency, let the MBB resolve resource conflicts at each tollgate, and postpone benefit validation until the projects succeed without sponsor intervention",
      "Require executive ownership of resource conflicts, benefit-governance decisions, and a consistent deployment message while the MBB continues technical coaching",
      "Move all Belts into a permanent central department, transfer staffing authority to the MBB, and prevent line managers from influencing project priorities or deployment",
      "Allow each project to define and self-certify benefits independently, while the MBB provides a consistent technical message until executive sponsorship improves"
    ],
    "answer": 1,
    "why": "Technical coaching cannot replace executive responsibilities. Leaders must resolve resource conflicts, align incentives, authorize benefit governance, and communicate constancy of purpose. The MBB supports the system but cannot manufacture executive accountability. <b>B. Require executive ownership of resource conflicts, benefit-governance decisions, and a consistent deployment message while the MBB continues technical coaching</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 12, Executive Leadership Roles and Leadership for Deployment, pp. 183-190.</span>",
    "optionRationales": [
      "More reviews do not remove structural barriers or conflicting incentives.",
      "Correct. It preserves the distinct but complementary executive and MBB roles.",
      "Centralization may be useful in some contexts but does not automatically create executive ownership.",
      "Inconsistent benefit definitions would further weaken governance."
    ],
    "formula": null,
    "assumptions": [
      "The executive sponsor has authority over the affected line managers and Finance policy."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "executive leadership",
      "sponsorship",
      "resource conflict",
      "benefit governance",
      "constancy of purpose"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 12 - Executive and Team Leadership Roles",
    "sourcePages": "183-190",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 12 - Executive and Team Leadership Roles",
        "section": "Executive Leadership Roles; Leadership for Deployment",
        "pages": "183-190"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-008",
    "set": 2,
    "batch": 1,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "C. Organizational Challenges",
      "topic": "Situational intervention, communication, and influence"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "A technically respected plant manager rejects a proposed pilot because prior corporate programs overpromised benefits. Operators privately support the change but remain silent in meetings. Which first intervention is most likely to build valid commitment without bypassing the manager?",
    "options": [
      "Escalate immediately and ask the division president to direct participation because the pilot requires stronger executive control",
      "Present generic industry benchmarks and the corporate business case in a leadership meeting until the manager concedes",
      "Diagnose the manager's concerns privately, review plant-specific evidence, co-design a bounded pilot, and create a safe channel for operator input",
      "Launch the pilot with supportive operators on another shift, exclude the manager during execution, and report after completion"
    ],
    "answer": 2,
    "why": "The intervention should match the stakeholder and situation. Private diagnosis surfaces the history behind resistance, plant evidence improves credibility, co-design preserves the manager's legitimate authority, and protected operator input broadens the evidence. <b>C. Diagnose the manager's concerns privately, review plant-specific evidence, co-design a bounded pilot, and create a safe channel for operator input</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 11, Situational Leadership and Intervention Styles, pp. 169-176.</span>",
    "optionRationales": [
      "Premature escalation may produce compliance while deepening resistance.",
      "Generic benchmarks do not answer the manager's plant-specific credibility concern.",
      "Correct. It adapts influence, evidence, and participation to the situation.",
      "Bypassing the manager damages trust and may invalidate implementation learning."
    ],
    "formula": null,
    "assumptions": [
      "No immediate safety or legal requirement mandates the pilot."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "intervention style",
      "situational leadership",
      "resistance",
      "stakeholder engagement",
      "pilot"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 11 - Intervention Styles",
    "sourcePages": "169-176",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 11 - Internal Organizational Challenges",
        "section": "Situational Leadership; Intervention Styles",
        "pages": "169-176"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-009",
    "set": 2,
    "batch": 1,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "D. Organizational Change Management",
      "topic": "Organizational culture change techniques and aligned rewards"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Finance and insurance",
    "quantitative": false,
    "stem": "A bank asks branch teams to improve first-contact resolution, but bonuses are based almost entirely on keeping each call below four minutes. Resolution-improvement pilots increase average call time and are being abandoned despite fewer repeat calls. Which change action is most appropriate?",
    "options": [
      "Align performance appraisal and rewards with resolution and total customer effort, then communicate and review the new expectations consistently",
      "Keep the bonus rule, add first-contact-resolution training, and tell teams that improvement work remains a voluntary professional-development activity",
      "Hide average call time from branch managers until the pilots are complete, then restore the existing bonus formula after the new process is standardized",
      "Set a higher first-contact-resolution target for branch managers, but preserve individual four-minute call bonuses so the existing pay structure stays unchanged"
    ],
    "answer": 0,
    "why": "The reward system is reinforcing the behavior that the change is meant to replace. Sustainable culture change requires aligned goals, appraisal, recognition, and repeated leadership communication. Training alone cannot overcome a contradictory incentive. <b>A. Align performance appraisal and rewards with resolution and total customer effort, then communicate and review the new expectations consistently</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapters 7-8, Cultural Change Techniques and Change Management, pp. 108-125.</span>",
    "optionRationales": [
      "Correct. It removes the structural contradiction between stated and rewarded behavior.",
      "Voluntary framing leaves the dominant incentive unchanged.",
      "Suppressing data weakens governance and does not correct the measure.",
      "A new management target leaves the contradictory employee incentive intact and can shift the conflict rather than resolve it."
    ],
    "formula": null,
    "assumptions": [
      "First-contact resolution and repeat-call demand are measured reliably."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "change management",
      "rewards and recognition",
      "performance appraisal",
      "culture",
      "first-contact resolution"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 7-8 - Cultural Change and Change Management",
    "sourcePages": "108-125",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapters 7-8",
        "section": "Organizational Cultural Change Techniques; Change Management",
        "pages": "108-125"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-010",
    "set": 2,
    "batch": 1,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "F. Organizational Performance Metrics",
      "topic": "Balanced Scorecard and leading/lagging measures"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Service and transactional operations",
    "quantitative": false,
    "stem": "A service division reports that operating margin rose from 14% to 16%, first-contact resolution fell from 82% to 71%, customer renewal fell from 88% to 81%, and employee process-certification coverage remained at 42%. Executives propose another cost-reduction wave because the financial perspective improved. What is the best MBB response?",
    "options": [
      "Approve the wave because operating margin is the only measure that directly funds future improvement, and treat the other indicators as local operating concerns",
      "Reject all cost projects until every nonfinancial indicator returns to its historical maximum, even if the causal links among the measures remain untested",
      "Average the four percentage changes into one composite score, give each perspective equal weight, and prioritize whichever project raises that score the most",
      "Treat the financial gain as incomplete evidence and prioritize causes linking capability, resolution, renewal, and margin using balanced leading and lagging measures"
    ],
    "answer": 3,
    "why": "A Balanced Scorecard prevents a favorable lagging financial result from masking deterioration in customer, process, and learning capacity. The pattern may represent short-term cost extraction that weakens future revenue. The next portfolio decision should test the causal links and balance outcomes. <b>D. Treat the financial gain as incomplete evidence and prioritize causes linking capability, resolution, renewal, and margin using balanced leading and lagging measures</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 9, Financial and Business Performance Measures, pp. 126-143.</span>",
    "optionRationales": [
      "Margin is important but can improve temporarily while future performance deteriorates.",
      "Absolute restoration of every indicator is not a rational portfolio rule.",
      "A simple average combines unlike measures and hides causal direction and strategic importance.",
      "Correct. It uses the perspectives together and investigates the system behind the tradeoff."
    ],
    "formula": null,
    "assumptions": [
      "The reported measures are valid and comparable across the two periods."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "Balanced Scorecard",
      "leading indicators",
      "lagging indicators",
      "customer loyalty",
      "margin"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 9 - Organizational Finance and Business Performance Metrics",
    "sourcePages": "126-143",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 9 - Organizational Finance and Business Performance Metrics",
        "section": "Financial Measures; Business Performance Measures",
        "pages": "126-143"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-011",
    "set": 2,
    "batch": 1,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "A. Project Management Principles and Life Cycle",
      "topic": "Integrated evaluation of scope, schedule, quality, communication, and risk"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Product development and engineering",
    "quantitative": false,
    "stem": "A medical-device improvement project is six weeks behind after its FMEA identified a previously unrecognized use hazard. The sponsor asks the team to omit planned validation testing to preserve the launch date. Which MBB recommendation is most defensible?",
    "options": [
      "Omit the testing because the FMEA already documents the risk qualitatively, obtain sponsor acceptance of the remaining exposure, and preserve the original launch baseline",
      "Use formal change control to evaluate risk, scope, schedule, cost, and regulatory impact; then mitigate and rebaseline rather than suppress validation",
      "Keep the original schedule, record the hazard as an open action, and move validation to the first production lot after the commercial launch",
      "Close the project as a failure, transfer the hazard to routine quality management, and restart only after a new charter removes every schedule variance"
    ],
    "answer": 1,
    "why": "The new hazard changes the integrated project risk. Formal change control makes the tradeoffs visible, preserves required validation, and creates an authorized mitigation and rebaseline decision. Schedule protection cannot override quality, safety, or regulatory evidence. <b>B. Use formal change control to evaluate risk, scope, schedule, cost, and regulatory impact; then mitigate and rebaseline rather than suppress validation</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 14, Project Management Principles, pp. 202-211.</span>",
    "optionRationales": [
      "FMEA identifies and prioritizes risk; it does not replace verification or validation.",
      "Correct. It evaluates the project as an integrated system and preserves evidence-based governance.",
      "Post-launch validation transfers uncontrolled risk to customers and may breach regulation.",
      "Schedule variance calls for evaluation and corrective action, not automatic closure."
    ],
    "formula": null,
    "assumptions": [
      "Validation is required by the approved development and regulatory plan."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "project change control",
      "FMEA",
      "validation",
      "risk",
      "rebaseline"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 14 - Project Management Principles",
    "sourcePages": "202-211",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Project Management Principles",
        "pages": "202-211"
      }
    ],
    "studentContext": "Validation is required by the approved development and regulatory plan; the schedule does not authorize waiving it."
  },
  {
    "qid": "mbb:set-2:original-012",
    "set": 2,
    "batch": 1,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "B. Project Portfolio Infrastructure and Management",
      "topic": "Cross-functional project dependencies and sequencing"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Multi-step quantitative",
    "industry": "Finance and insurance",
    "quantitative": true,
    "stem": "Five projects share the precedence relationships shown. Durations are working days. A must finish before B and C; both B and C must finish before D; D must finish before E. Assuming unlimited nonshared resources and no lag, what is the earliest portfolio completion time, and what should the MBB correct in the current plan that starts all five projects on day 1?",
    "options": [
      "70 days; retain the parallel start because unlimited nonshared resources remove predecessor constraints from every activity in the portfolio",
      "105 days; delay only E because independently resourced B and C can begin before A is complete",
      "110 days; replace the independent schedules with a portfolio dependency plan that enforces A -> B/C -> D -> E",
      "145 days; schedule B and C sequentially because activities sharing predecessor A cannot run in parallel"
    ],
    "answer": 2,
    "why": "After A (30 days), B and C can run concurrently. D waits for the longer branch, B at 40 days, so the earliest finish is 30 + max(40,35) + 25 + 15 = 110 working days. Unlimited resources allow concurrency but do not remove logical precedence. <b>C. 110 days; replace the independent schedules with a portfolio dependency plan that enforces A -> B/C -> D -> E</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 13, Cross-Functional Project Assessment, pp. 196-200.</span>",
    "optionRationales": [
      "Seventy days omits downstream D and E and wrongly treats precedence as a resource issue.",
      "B and C cannot start until A creates their required input.",
      "Correct. The network merge at D is controlled by the longer B branch.",
      "B and C may run concurrently once A finishes; a common predecessor does not force sequencing."
    ],
    "formula": "Earliest completion = A + max(B, C) + D + E = 30 + 40 + 25 + 15 = 110 working days.",
    "assumptions": [
      "Durations are deterministic working days.",
      "Resources are sufficient for B and C to run concurrently.",
      "There are no leads, lags, or calendar differences."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "activity network",
      "dependencies",
      "critical path",
      "portfolio sequencing",
      "concurrency"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 13 - Cross-Functional Project Assessment",
    "sourcePages": "196-200",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 13 - Project Execution",
        "section": "Cross-Functional Project Assessment",
        "pages": "196-200"
      }
    ],
    "chart": {
      "type": "activity-network",
      "nodes": {
        "A": {
          "col": 0,
          "row": 1,
          "dur": 30
        },
        "B": {
          "col": 1,
          "row": 0,
          "dur": 40
        },
        "C": {
          "col": 1,
          "row": 2,
          "dur": 35
        },
        "D": {
          "col": 2,
          "row": 1,
          "dur": 25
        },
        "E": {
          "col": 3,
          "row": 1,
          "dur": 15
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
    },
    "visual": {
      "type": "activity-network",
      "datasetRef": "test-bank-assets/mbb-160/batch-01/datasets.json#mbb:set-2:original-012",
      "specRef": "test-bank-assets/mbb-160/batch-01/visual-specs.json#mbb:set-2:original-012",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-01/static-fallbacks.html#mbb-set-2-original-012",
      "altText": "An activity-on-node network shows A for 30 days splitting to B for 40 days and C for 35 days. B and C merge into D for 25 days, followed by E for 15 days.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-01/validation.json#mbb:set-2:original-012",
      "breakpointsValidated": [],
      "answerCueAudit": true,
      "validationScope": "Generated metadata is not a browser test; see docs/audits/mbb-set2-batch1.md for measured evidence."
    }
  },
  {
    "qid": "mbb:set-2:original-013",
    "set": 2,
    "batch": 1,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "B. Project Portfolio Infrastructure and Management",
      "topic": "Project supply/demand management"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Public sector, nonprofit, and regulated operations",
    "quantitative": false,
    "stem": "For the next eight weeks, verified Black Belt capacity is nine full-time equivalents. Forecast demand rises from seven to thirteen, including two mandatory regulatory projects that require three FTEs during the peak and three discretionary projects that together require four FTEs. What is the best portfolio response?",
    "options": [
      "Protect the mandatory work, smooth or defer lower-priority discretionary starts, verify any substitute skills, and reforecast commitments at the portfolio gate",
      "Start all projects, authorize overtime during the peak, and defer reforecasting because average demand across the full eight-week window may remain below capacity",
      "Divide each Belt equally among all projects, preserve every announced start date, and let individual sponsors negotiate for additional time when milestones slip",
      "Remove the regulatory projects from the discretionary capacity calculation, reserve their three FTEs informally, and publish the remaining demand as fully committed"
    ],
    "answer": 0,
    "why": "Supply/demand management requires a time-phased view, not an average or an accounting exclusion. Mandatory work must be protected, discretionary starts should be sequenced to the constraint, and any cross-trained capacity must be competence-verified before commitments are revised. <b>A. Protect the mandatory work, smooth or defer lower-priority discretionary starts, verify any substitute skills, and reforecast commitments at the portfolio gate</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 14, Supply/Demand Management, pp. 217-218.</span>",
    "optionRationales": [
      "Correct. It protects constraints and priority while making the commitment change explicit.",
      "Average capacity can conceal a peak overload; chronic overtime is not a capacity plan.",
      "Excessive multitasking delays all projects and hides the bottleneck.",
      "Mandatory work still consumes real capacity and must remain in the forecast."
    ],
    "formula": null,
    "assumptions": [
      "Nine FTEs is a verified time-phased capacity, not a headcount estimate."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "supply demand management",
      "capacity planning",
      "portfolio gate",
      "multitasking",
      "regulatory priority"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 14 - Supply/Demand Management",
    "sourcePages": "217-218",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Supply/Demand Management",
        "pages": "217-218"
      }
    ],
    "bokCognitiveMaximum": "Create"
  },
  {
    "qid": "mbb:set-2:original-014",
    "set": 2,
    "batch": 1,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "C. Project Portfolio Financial Tools",
      "topic": "NPV and hard-versus-soft benefit validation"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Multi-step quantitative",
    "industry": "Manufacturing",
    "quantitative": true,
    "stem": "Use a 10% annual discount rate and a four-year horizon. X costs $600,000 now. Its business case assigns $220,000 per year to released staff capacity, but no spending reduction or additional revenue has been approved. Y costs $400,000 now and avoids $155,000 of otherwise payable overtime at each year-end. Finance has verified Y's cash saving. X's analyst discounts its capacity valuation as though it were cash. Which conclusion best distinguishes that illustration from a supported cash-flow NPV?",
    "options": [
      "Y has a supported NPV of about $91,329, so its lower initial cost also proves that it must have the higher NPV under every possible monetization plan for X",
      "Both projects have negative NPV at 10%, so nominal payback should replace discounted cash flow even though Y avoids otherwise payable overtime",
      "X has a supported cash-flow NPV of about $97,370, so its released capacity can be booked as hard-dollar savings without an approved monetary action",
      "X has illustrative value about $97,370, but only Y has a supported positive cash-flow NPV; X needs an approved cash-realization action"
    ],
    "answer": 3,
    "why": "The four-year annuity factor is 3.169865446. Discounting X's assigned capacity value gives -600,000 + 220,000(3.169865446) = +$97,370.40, but this is an illustration conditional on monetization, not a supported cash-flow NPV. Y's verified cash NPV is -400,000 + 155,000(3.169865446) = +$91,329.14. With no supported inflow or terminal value, X's cash-only case currently contains its $600,000 outlay, not a positive NPV. Capacity may have strategic or opportunity value; it must not automatically be booked as realized cash savings. <b>D. X has illustrative value about $97,370, but only Y has a supported positive cash-flow NPV; X needs an approved cash-realization action</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 9, Project Cash Flow, pp. 141-143; Chapter 16, Costing Concepts, pp. 225-232.</span>",
    "optionRationales": [
      "Y's stated cash NPV is positive, but lower initial investment does not establish its ranking under every alternative future cash-flow scenario.",
      "Y's discounted, finance-verified cash savings exceed its investment; nominal payback does not repair a false NPV conclusion.",
      "The $97,370 calculation assumes that X's capacity valuation becomes cash, an assumption not supported by the case.",
      "Correct. It separates conditional economic valuation from supported cash-flow NPV and requires an approved monetization action for X."
    ],
    "formula": "Four-year annuity factor = sum(t=1..4)(1.10)^(-t) = 3.169865446. X illustrative value = -600000 + 220000*factor = 97370.40 (conditional, not supported cash NPV). Y cash NPV = -400000 + 155000*factor = 91329.14. X cash NPV with no supported inflow = -600000.",
    "assumptions": [
      "All figures use the same currency and price basis.",
      "Y savings occur at each year-end; the illustrative X valuation uses the same timing.",
      "The discount rate is 10%; no terminal value, tax differences, other inflows, or working-capital recovery are included."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "NPV",
      "discounted cash flow",
      "hard savings",
      "soft savings",
      "benefit realization"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 9 and 16 - Project Cash Flow and Costing Concepts",
    "sourcePages": "141-143; 225-232",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 9",
        "section": "Project Cash Flow",
        "pages": "141-143"
      },
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 16",
        "section": "Costing Concepts",
        "pages": "225-232"
      }
    ],
    "studentContext": "Use the stated cash flows only. There is no terminal value, tax difference, other inflow, or working-capital recovery."
  },
  {
    "qid": "mbb:set-2:original-015",
    "set": 2,
    "batch": 1,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "A. Training Needs Analysis",
      "topic": "Role-specific performance and skill-gap analysis"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Cross-industry enterprise/deployment case",
    "quantitative": false,
    "stem": "The training-needs matrix uses an ordered 1–4 proficiency scale. Resources for the first release are limited. Before estimating module durations and building a feasible schedule, which priority decision best follows role-specific needs analysis rather than a one-size-fits-all curriculum?",
    "options": [
      "Give every group the same eight-hour statistics refresher, use one common assessment, and defer role-specific gaps until the next release because this format is easiest to administer",
      "Prioritize Green Belt MSA and Champion selection skills, tailor delivery to each role, and use targeted remediation for the smaller Black Belt gap",
      "Train Process Owners first because control-plan ownership has the highest operational consequence, even though their current proficiency already equals the required level",
      "Train Black Belts only because advanced regression has the highest required proficiency rating, and use their post-course scores as a proxy for every other role"
    ],
    "answer": 1,
    "why": "Green Belt MSA and Champion selection show the larger assessed proficiency shortfalls in high-impact skills. Green Belts also represent the largest learner group. The Black Belt gap is smaller and can receive targeted remediation; Process Owners already meet the assessed requirement. Proficiency categories are ordinal, not a validated interval scale for multiplying gap scores by headcount. This question selects training priorities only: module durations and delivery capacity must still be estimated before claiming a feasible schedule. <b>B. Prioritize Green Belt MSA and Champion selection skills, tailor delivery to each role, and use targeted remediation for the smaller Black Belt gap</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 17, Training Needs Analysis, pp. 236-244.</span>",
    "optionRationales": [
      "A common course ignores role, task, gap size, and business consequence.",
      "Correct. It uses required-versus-current proficiency, population, and impact together.",
      "High consequence does not create a training need when current proficiency meets the requirement.",
      "Required level alone does not measure the size or reach of the actual gap."
    ],
    "formula": null,
    "assumptions": [
      "The proficiency assessments are reliable.",
      "The business-impact categories are comparable across roles.",
      "No mandatory compliance training is omitted.",
      "Module duration and delivery capacity will be estimated after prioritization."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training needs analysis",
      "gap analysis",
      "proficiency",
      "target group",
      "prioritization"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 17 - Training Needs Analysis",
    "sourcePages": "236-244",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 17 - Training Needs Analysis",
        "section": "Defining the Extent and Nature of the Job; Training Needs Analysis Tools",
        "pages": "236-244"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Target group / skill",
        "Required proficiency",
        "Observed proficiency",
        "Learners",
        "Business impact"
      ],
      "rows": [
        [
          "Champions - project selection",
          "4",
          "2",
          "12",
          "High"
        ],
        [
          "Black Belts - regression diagnostics",
          "4",
          "3",
          "24",
          "Medium"
        ],
        [
          "Green Belts - measurement systems",
          "3",
          "1",
          "60",
          "High"
        ],
        [
          "Process Owners - control plans",
          "3",
          "3",
          "18",
          "High"
        ]
      ]
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-01/datasets.json#mbb:set-2:original-015",
      "specRef": "test-bank-assets/mbb-160/batch-01/visual-specs.json#mbb:set-2:original-015",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-01/static-fallbacks.html#mbb-set-2-original-015",
      "altText": "A role-by-skill table compares required and observed proficiency, learner population, and business impact. Green Belts have a two-level measurement-system gap across 60 learners; Champions have a two-level selection gap across 12; Black Belts have a one-level regression gap; Process Owners have no control-plan gap.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-01/validation.json#mbb:set-2:original-015",
      "breakpointsValidated": [],
      "answerCueAudit": true,
      "validationScope": "Generated metadata is not a browser test; see docs/audits/mbb-set2-batch1.md for measured evidence."
    }
  },
  {
    "qid": "mbb:set-2:original-016",
    "set": 2,
    "batch": 1,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "D. Training Program Effectiveness",
      "topic": "Evaluation plan and isolation of training effects"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Coaching/training/failing-project diagnosis",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "After setup-reduction training, participant reaction averaged 4.8/5 and knowledge scores rose from 58% to 88%. On-job standard-work adherence moved from 62% to 64%; an untrained comparison area moved from 61% to 63%; defect rate did not change. Before claiming business impact, which evaluation plan should the MBB select?",
    "options": [
      "Use the reaction and knowledge results as sufficient proof of organizational impact, calculate a training ROI from the score increase, and stop collecting transfer evidence",
      "Discard the training because the first post-training defect rate did not improve, return to the prior setup method, and omit further behavior measurement",
      "Track behavior and results over an appropriate period, use a credible comparison or phased design, investigate transfer barriers, and revise the intervention",
      "Retest knowledge monthly, treat a statistically significant correlation with defect rate as causal evidence, and avoid collecting separate measures of workplace transfer"
    ],
    "answer": 2,
    "why": "The reaction score is favorable, but no earlier reaction score is supplied, so improvement in reaction cannot be claimed. Observed knowledge scores increased by 30 percentage points. Adherence increased by 2 points in both areas: the descriptive difference-in-differences is (64−62)−(63−61)=0 points. This short, nonrandomized comparison neither establishes a training-attributable business benefit nor proves that training has no effect. Track sustained behavior and results with a credible comparison and investigate barriers to transfer. <b>C. Track behavior and results over an appropriate period, use a credible comparison or phased design, investigate transfer barriers, and revise the intervention</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 20, Training Effectiveness Evaluation, pp. 285-292.</span>",
    "optionRationales": [
      "Favorable reactions and higher knowledge scores alone do not establish job transfer or attributable business results.",
      "One early null result does not identify whether the problem is content, transfer, timing, or measurement.",
      "Correct. It evaluates acquisition, transfer, outcomes, and attribution under real constraints.",
      "Repeated knowledge tests cannot substitute for behavior and outcome evidence and may induce spurious searching."
    ],
    "formula": null,
    "assumptions": [
      "The comparison area is reasonably similar but not randomized.",
      "The observation window may be too short for a stable defect-rate effect."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training effectiveness",
      "transfer",
      "comparison group",
      "behavior",
      "business results"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 20 - Training Effectiveness Evaluation",
    "sourcePages": "285-292",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 20 - Training Effectiveness Evaluation",
        "section": "Validation and Evaluation Models; Measurement Issues; Isolating the Effects of Training",
        "pages": "285-292"
      }
    ],
    "bokCognitiveMaximum": "Create",
    "studentContext": "The comparison area is reasonably similar but was not randomized. The observation window may be too short to establish a sustained business effect."
  },
  {
    "qid": "mbb:set-2:original-017",
    "set": 2,
    "batch": 1,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "A. Executives and Champions",
      "topic": "Constructive feedback to champions and executives"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Coaching/training/failing-project diagnosis",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "During tollgates, a champion answers technical questions for the Black Belt and publicly describes weak analyses as embarrassing. The team has stopped raising uncertainty. What is the most effective first coaching action for the MBB?",
    "options": [
      "Meet privately with the champion, describe the observed behavior and impact, agree on role-appropriate review questions, rehearse the next tollgate, and follow up",
      "Correct the champion publicly at the next tollgate, demonstrate the preferred review language in front of the team, and use that confrontation to signal psychological safety",
      "Ask the Black Belt to defend the analysis more forcefully, document every technical disagreement, and treat the conflict as practice for building executive presence",
      "Remove the champion immediately, transfer sponsorship to the process owner, and resume tollgates only after the replacement sponsor completes role training"
    ],
    "answer": 0,
    "why": "Constructive executive feedback should be specific, private, behavior-based, and linked to impact and an actionable alternative. Clarifying the champion's review role and rehearsing questions protects accountability without taking technical ownership from the Belt. <b>A. Meet privately with the champion, describe the observed behavior and impact, agree on role-appropriate review questions, rehearse the next tollgate, and follow up</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 21, Communications and Feedback, pp. 304-305.</span>",
    "optionRationales": [
      "Correct. It combines respectful feedback, role clarity, practice, and follow-through.",
      "Public correction repeats the same humiliating pattern and may entrench defensiveness.",
      "The Belt's assertiveness is not the root cause of the champion's role violation.",
      "Immediate removal is disproportionate before a direct coaching attempt unless safety or ethics require it."
    ],
    "formula": null,
    "assumptions": [
      "The behavior is serious but has not crossed a legal, safety, or ethics threshold requiring immediate escalation."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "executive coaching",
      "constructive feedback",
      "tollgate",
      "psychological safety",
      "role clarity"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 21 - Communications and Feedback",
    "sourcePages": "304-305",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 21 - Mentoring Champions, Change Agents, and Executives",
        "section": "Communications; Feedback",
        "pages": "304-305"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-018",
    "set": 2,
    "batch": 1,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "B. Teams and Individuals",
      "topic": "Diagnosing and intervening in a failing Belt project"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Coaching/training/failing-project diagnosis",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": false,
    "stem": "A Black Belt is leading three projects. One has run nine months, spans four end-to-end processes, lacks a validated baseline and active sponsor, and is about to begin a large DOE. Which recovery plan should the MBB select?",
    "options": [
      "Approve the DOE across all four processes because experimental evidence may attract a sponsor, reveal the missing baseline, and compensate for weak charter definition",
      "Ask the Belt to work evenings, keep the original scope and schedule, and use weekly technical coaching to recover the project without escalating ownership gaps",
      "Transfer DOE execution to a Green Belt, let the Black Belt continue stakeholder work, and retain the original cross-process scope until experiment results are available",
      "Pause experimentation, re-scope and recharter, secure sponsor and process-owner accountability, validate the measurement/baseline, and set a recovery-or-reassignment gate"
    ],
    "answer": 3,
    "why": "A DOE cannot repair an unbounded charter, absent ownership, or an untrusted baseline. The MBB should sequence the recovery: reduce scope to a defensible Y and process boundary, restore governance, validate measurement and performance evidence, then decide at an explicit gate whether to continue, reassign, or terminate. <b>D. Pause experimentation, re-scope and recharter, secure sponsor and process-owner accountability, validate the measurement/baseline, and set a recovery-or-reassignment gate</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 22, Belt Mentoring, Technical Reviews, and Team Facilitation, pp. 306-314.</span>",
    "optionRationales": [
      "Experimentation without a validated response or stable scope creates expensive but weak evidence.",
      "Overtime does not correct governance, measurement, or scope failure.",
      "Delegating the experiment adds coordination without resolving prerequisites.",
      "Correct. It diagnoses root conditions and creates an accountable decision gate."
    ],
    "formula": null,
    "assumptions": [
      "There is no immediate safety containment action that must proceed independently."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "failing project",
      "recharter",
      "sponsorship",
      "baseline",
      "project reassignment"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 22 - Mentoring Black Belts and Green Belts",
    "sourcePages": "306-314",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 22 - Mentoring Black Belts and Green Belts",
        "section": "Individuals; Technical Reviews; Team Facilitation and Meeting Management",
        "pages": "306-314"
      }
    ],
    "bokCognitiveMaximum": "Create"
  },
  {
    "qid": "mbb:set-2:original-019",
    "set": 2,
    "batch": 1,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. MSA, Process Capability, and Control",
      "topic": "Propagation of measurement error"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Multi-step quantitative",
    "industry": "Manufacturing",
    "quantitative": true,
    "stem": "Pipe wall thickness is calculated as t = (OD - ID)/2. The OD and ID errors are independent and unbiased, with standard uncertainties shown below. Ignoring model-form error, what is the standard uncertainty of the calculated thickness?",
    "options": [
      "0.010 mm",
      "0.036 mm",
      "0.050 mm",
      "0.072 mm"
    ],
    "answer": 1,
    "why": "The sensitivity coefficients in t=(OD−ID)/2 are +0.5 and −0.5. With independent errors, Var(t)=0.25[0.04²+0.06²]=0.0013 mm²; therefore u(t)=0.0360555 mm, rounded to 0.036 mm. Because this measurement equation is linear, this variance calculation is exact under the stated model, rather than a first-order approximation. It is a standard uncertainty, not an expanded uncertainty or a worst-case bound. <b>B. 0.036 mm</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 24, Propagation of Errors, pp. 318-321.</span>",
    "optionRationales": [
      "This incorrectly subtracts or over-cancels independent uncertainty components.",
      "Correct. Variances, weighted by squared sensitivity coefficients, add for independent inputs.",
      "This averages the two input standard uncertainties rather than propagating them.",
      "This is sqrt(0.04^2 + 0.06^2) and omits the division-by-two sensitivity."
    ],
    "formula": "u(t) = sqrt[(0.5uOD)^2 + (-0.5uID)^2] = 0.5 sqrt(0.04^2 + 0.06^2) = 0.0361 mm.",
    "assumptions": [
      "OD and ID errors are independent.",
      "Input errors are unbiased.",
      "The measurement equation is linear, so variance propagation is exact under the stated independence assumption."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "propagation of error",
      "measurement uncertainty",
      "sensitivity coefficient",
      "independence",
      "wall thickness"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 24 - Propagation of Errors",
    "sourcePages": "318-321",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 24 - Measurement Systems Analysis",
        "section": "Propagation of Errors",
        "pages": "318-321"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Input",
        "Measured value",
        "Standard uncertainty",
        "Sensitivity coefficient"
      ],
      "rows": [
        [
          "Outside diameter (OD)",
          "508.00 mm",
          "0.040 mm",
          "+0.5"
        ],
        [
          "Inside diameter (ID)",
          "492.00 mm",
          "0.060 mm",
          "-0.5"
        ]
      ]
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-01/datasets.json#mbb:set-2:original-019",
      "specRef": "test-bank-assets/mbb-160/batch-01/visual-specs.json#mbb:set-2:original-019",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-01/static-fallbacks.html#mbb-set-2-original-019",
      "altText": "A two-row measurement table lists outside diameter 508.00 millimetres with standard uncertainty 0.040 and sensitivity coefficient plus 0.5, and inside diameter 492.00 millimetres with standard uncertainty 0.060 and sensitivity coefficient minus 0.5.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-01/validation.json#mbb:set-2:original-019",
      "breakpointsValidated": [],
      "answerCueAudit": true,
      "validationScope": "Generated metadata is not a browser test; see docs/audits/mbb-set2-batch1.md for measured evidence."
    }
  },
  {
    "qid": "mbb:set-2:original-020",
    "set": 2,
    "batch": 1,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Multiple-regression residual diagnostics"
    },
    "difficulty": "Expert",
    "cognitive": "Analyze",
    "questionType": "Statistical-output interpretation",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "A multiple-regression model predicts emergency-department length of stay. VIFs are below 2, the residual normal probability plot is acceptably linear, and the residuals-versus-fits plot is shown. No data-transcription errors are found. What should the MBB recommend next?",
    "options": [
      "Investigate missing curvature or an omitted nonlinear term before relying on predictions, while preserving model hierarchy",
      "Remove the observations with the two largest positive residuals, retain the same predictors, and refit the unchanged linear model until the pattern disappears",
      "Accept the model because low VIF and approximately normal residuals establish predictive adequacy",
      "Replace regression with a two-sample t test because residuals are not centered at every fitted value"
    ],
    "answer": 0,
    "why": "The residuals form a U-shaped pattern: positive at low and high fitted values and negative in the middle. That is evidence of model-form bias, commonly missing curvature or a nonlinear relationship. Low collinearity and marginal normality do not repair a biased mean function, and points should not be deleted merely because they reveal the pattern. <b>A. Investigate missing curvature or an omitted nonlinear term before relying on predictions, while preserving model hierarchy</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 25, Multiple Regression and Residual Diagnostics, pp. 370-383 and 400-402.</span>",
    "optionRationales": [
      "Correct. The structured residual pattern diagnoses an inadequate functional form.",
      "Deleting valid observations would hide rather than explain model bias.",
      "VIF and normality address only two assumptions; residual structure still invalidates the fitted mean.",
      "A t test cannot replace a multivariable prediction model or diagnose curvature."
    ],
    "formula": null,
    "assumptions": [
      "Observations are independent.",
      "The plotted residuals are standardized consistently.",
      "No transcription or unit error explains the pattern."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "multiple regression",
      "residuals versus fits",
      "curvature",
      "model hierarchy",
      "VIF"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 25 - Multiple Regression Analysis and Testing the Assumptions",
    "sourcePages": "370-383; 400-402",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Multiple Regression Analysis; Testing the Assumptions",
        "pages": "370-383; 400-402"
      }
    ],
    "chart": {
      "type": "regression-diagnostic",
      "title": "Standardized residuals versus fitted length of stay",
      "xLabel": "Fitted length of stay (minutes)",
      "yLabel": "Standardized residual",
      "xTicks": [
        80,
        160,
        240
      ],
      "yTicks": [
        -2,
        0,
        2
      ],
      "points": [
        {
          "fitted": 80,
          "residual": 2.1
        },
        {
          "fitted": 100,
          "residual": 1.2
        },
        {
          "fitted": 120,
          "residual": 0.2
        },
        {
          "fitted": 140,
          "residual": -0.8
        },
        {
          "fitted": 160,
          "residual": -1.5
        },
        {
          "fitted": 180,
          "residual": -0.9
        },
        {
          "fitted": 200,
          "residual": 0.1
        },
        {
          "fitted": 220,
          "residual": 1.1
        },
        {
          "fitted": 240,
          "residual": 2.2
        }
      ],
      "altText": "Residuals versus fitted length of stay form a U shape: residuals are positive near fitted values 80 and 240 minutes, negative around 140 to 180 minutes, and near zero around 120 and 200 minutes."
    },
    "visual": {
      "type": "regression-diagnostic",
      "datasetRef": "test-bank-assets/mbb-160/batch-01/datasets.json#mbb:set-2:original-020",
      "specRef": "test-bank-assets/mbb-160/batch-01/visual-specs.json#mbb:set-2:original-020",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-01/static-fallbacks.html#mbb-set-2-original-020",
      "altText": "Residuals versus fitted length of stay form a U shape: residuals are positive near fitted values 80 and 240 minutes, negative around 140 to 180 minutes, and near zero around 120 and 200 minutes.",
      "interactionPurpose": "Hover or select a residual to inspect its fitted value and standardized residual, then compare the low, middle, and high fitted-value regions.",
      "validationRef": "test-bank-assets/mbb-160/batch-01/validation.json#mbb:set-2:original-020",
      "breakpointsValidated": [],
      "answerCueAudit": true,
      "validationScope": "Generated metadata is not a browser test; see docs/audits/mbb-set2-batch1.md for measured evidence."
    },
    "studentContext": "The displayed points are a diagnostic excerpt from a larger fitted model, not the complete fitting dataset. Observations are independent and residuals are standardized consistently."
  },
  {
    "qid": "mbb:set-2:original-021",
    "set": 2,
    "batch": 1,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. MSA, Process Capability, and Control",
      "topic": "Automated process control used with statistical process control"
    },
    "difficulty": "Very Hard",
    "cognitive": "Understand",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "A reactor temperature is measured each second. A feedback controller adjusts steam flow to hold the set point despite feed-temperature disturbances. Product-quality CTQs are sampled hourly and must be monitored for sustained process changes. Which control architecture is most appropriate?",
    "options": [
      "Use SPC alone to calculate each steam-valve movement from hourly subgroups, and treat every control-limit signal as a direct command to the actuator",
      "Use APC alone for both second-by-second control and long-term CTQ assurance because continuous automatic adjustment proves the process is statistically stable",
      "Use APC for rapid regulation and SPC for stability; assess capability separately against CTQ specifications using an appropriate stable-data model",
      "Disable feedback during each SPC sampling window, hold steam flow constant, and chart the resulting values so the limits represent only uncontrolled variation"
    ],
    "answer": 2,
    "why": "APC changes a manipulated input rapidly to regulate a controlled variable near its set point. SPC evaluates variation and stability, using suitable process measures or model residuals when dynamics matter. A stable process is not automatically capable: capability is a separate comparison with CTQ specification limits using an appropriate model and stable data. Control limits describe process behavior; they are not specification limits. Retain the properly tuned controller and safety interlocks. <b>C. Use APC for rapid regulation and SPC for stability; assess capability separately against CTQ specifications using an appropriate stable-data model</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 27, Automated Process Control and Statistical Process Control, pp. 451-453.</span>",
    "optionRationales": [
      "Hourly SPC cannot perform second-by-second feedback manipulation.",
      "Closed-loop control can mask or compensate for disturbances without proving statistical stability.",
      "Correct. The architecture separates dynamic regulation, statistical stability assessment, and capability relative to specifications.",
      "Removing feedback changes the operating process and can create unsafe or unrepresentative data."
    ],
    "formula": null,
    "assumptions": [
      "The feedback loop is properly tuned and safety interlocks remain active."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "APC",
      "SPC",
      "feedback control",
      "set point",
      "process stability"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 27 - Automated Process Control and Statistical Process Control",
    "sourcePages": "451-453",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 27 - Automated Process Control and Statistical Process Control",
        "section": "Terminology; Advantages; Basic Control Systems",
        "pages": "451-453"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-022",
    "set": 2,
    "batch": 1,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "C. Design of Experiments",
      "topic": "Recognizing a split-plot design for hard-to-change factors"
    },
    "difficulty": "Hard",
    "cognitive": "Understand",
    "questionType": "DOE/optimization design and diagnosis",
    "industry": "Product development and engineering",
    "quantitative": false,
    "stem": "Oven temperature is costly to change. The complete design below uses four independently established oven batches (whole plots), with each temperature assigned to two batches by randomization. Within each batch, four separately treated specimens receive formulations A–D in randomized order. Each batch holds its temperature for all four specimen runs. Which design-and-analysis description is correct?",
    "options": [
      "A completely randomized factorial; ignore the restricted randomization, treat all runs as exchangeable, and test every effect against one pooled residual error",
      "A split-plot design; temperature is the whole-plot factor and formulation is the subplot factor, so the analysis needs the corresponding error strata",
      "A randomized complete block design; treat formulation as the blocking variable because it changes within temperature, and estimate temperature from within-block variation",
      "An EVOP design; use the production order as the model, omit separate whole-plot and subplot errors, and avoid deliberate randomization within each temperature setting"
    ],
    "answer": 1,
    "why": "The design has two experimental-unit sizes: independent oven batches for temperature, and individually treated specimens within a batch for formulation. Temperature is therefore the whole-plot factor and formulation the subplot factor. The four whole plots provide two independent replicates per temperature, rather than treating four within-batch specimens as four temperature replicates. Temperature must be tested against whole-plot variation; formulation and its interaction with temperature use the appropriate subplot error. Restricted randomization is not a completely randomized single-error design. <b>B. A split-plot design; temperature is the whole-plot factor and formulation is the subplot factor, so the analysis needs the corresponding error strata</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 26, Split-Plot Designs, pp. 449-450.</span>",
    "optionRationales": [
      "Restricted randomization violates the single-error completely randomized structure.",
      "Correct. The randomization restrictions define whole plots and subplots.",
      "Formulation varies within the temperature groups and is not the blocking factor described.",
      "EVOP is an evolutionary operating strategy, not a label for every production-order experiment."
    ],
    "formula": null,
    "assumptions": [
      "The four batches are independent whole-plot experimental units, including the separately established consecutive High batches.",
      "Temperature assignments and within-batch formulation orders follow the two stated randomizations."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "split-plot",
      "hard-to-change factor",
      "whole plot",
      "subplot",
      "error strata"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 26 - Split-Plot Designs",
    "sourcePages": "449-450",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 26 - Design of Experiments",
        "section": "Split-Plot Designs",
        "pages": "449-450"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Run order",
        "Whole plot",
        "Temperature setting",
        "Formulation"
      ],
      "rows": [
        [
          "1",
          "WP1",
          "Low",
          "B"
        ],
        [
          "2",
          "WP1",
          "Low",
          "D"
        ],
        [
          "3",
          "WP1",
          "Low",
          "A"
        ],
        [
          "4",
          "WP1",
          "Low",
          "C"
        ],
        [
          "5",
          "WP2",
          "High",
          "C"
        ],
        [
          "6",
          "WP2",
          "High",
          "A"
        ],
        [
          "7",
          "WP2",
          "High",
          "D"
        ],
        [
          "8",
          "WP2",
          "High",
          "B"
        ],
        [
          "9",
          "WP3",
          "High",
          "A"
        ],
        [
          "10",
          "WP3",
          "High",
          "C"
        ],
        [
          "11",
          "WP3",
          "High",
          "B"
        ],
        [
          "12",
          "WP3",
          "High",
          "D"
        ],
        [
          "13",
          "WP4",
          "Low",
          "D"
        ],
        [
          "14",
          "WP4",
          "Low",
          "B"
        ],
        [
          "15",
          "WP4",
          "Low",
          "C"
        ],
        [
          "16",
          "WP4",
          "Low",
          "A"
        ]
      ]
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-01/datasets.json#mbb:set-2:original-022",
      "specRef": "test-bank-assets/mbb-160/batch-01/visual-specs.json#mbb:set-2:original-022",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-01/static-fallbacks.html#mbb-set-2-original-022",
      "altText": "A complete 16-run split-plot matrix has four independently established whole plots. WP1 and WP4 use Low temperature; WP2 and WP3 use High. Each whole plot contains formulations A, B, C, and D once, in independently randomized specimen order. Whole-plot identifiers distinguish the two consecutive High batches.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-01/validation.json#mbb:set-2:original-022",
      "breakpointsValidated": [],
      "answerCueAudit": true,
      "validationScope": "Generated metadata is not a browser test; see docs/audits/mbb-set2-batch1.md for measured evidence."
    }
  },
  {
    "qid": "mbb:set-2:original-023",
    "set": 2,
    "batch": 1,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Autocorrelation, ARIMA, and residual monitoring"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Statistical-output interpretation",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": false,
    "stem": "The plot shows all 18 observed days of distribution-center backlog. Using the full-series mean and the common unadjusted sample-ACF definition, lag-1 autocorrelation is approximately 0.817. The upward movement is operationally plausible, not a recording error. A manager proposes an Individuals chart with limits estimated directly from these raw data. Which recommendation is most defensible?",
    "options": [
      "Use the raw Individuals chart because moving ranges automatically remove serial correlation, then treat any limit violation as a special cause in the original backlog process",
      "Randomly reorder the days before calculating limits, retain those limits for chronological monitoring, and assume the shuffle permanently restores independence",
      "Widen the raw-chart limits until no point signals, preserve the raw serial dependence, and extrapolate the centerline as the operating forecast",
      "Investigate the trend and collect sufficient history; validate a time-series model before residual monitoring, while continuing to track the raw backlog"
    ],
    "answer": 3,
    "why": "Recomputing the common sample ACF from the 18 plotted observations gives r1=0.8170927. The upward trend itself contributes to the high raw-series ACF, so this value is not an estimated stationary AR(1) coefficient. Limits estimated directly from this short, trending series are not a defensible stable-process baseline. Investigate the operational trend, obtain enough relevant history, and validate the time-series model and approximately white residuals before residual monitoring. Retain raw-backlog monitoring so detrending does not normalize away deteriorating service. Reordering or widening limits conceals evidence rather than resolving the problem. <b>D. Investigate the trend and collect sufficient history; validate a time-series model before residual monitoring, while continuing to track the raw backlog</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 25, Autocorrelation and Forecasting, pp. 353-373; Tang et al., Chapter 25, Control of Autocorrelated Processes, pp. 381-405.</span>",
    "optionRationales": [
      "Moving ranges do not automatically remove serial dependence from the observations.",
      "Random reordering conceals the temporal mechanism and invalidates forecasting.",
      "Limit inflation is not a model and suppresses detection without explaining the pattern.",
      "Correct. It avoids claiming an adequate model from 18 points, investigates the trend, and preserves visibility of the original operational outcome."
    ],
    "formula": "With mean 122.8888889, r1 = sum(t=2..18)[(y_t−mean)(y_(t−1)−mean)] / sum(t=1..18)[(y_t−mean)^2] = 3116.20987654 / 3813.77777778 = 0.8170926724.",
    "assumptions": [
      "The sampling interval and backlog definition are constant.",
      "Only 18 observations are available; no adequate forecasting model has yet been established.",
      "The raw upward trend itself may require an operational response."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "autocorrelation",
      "ARIMA",
      "residual monitoring",
      "Individuals chart",
      "forecasting"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 25 - Autocorrelation and Forecasting",
    "sourcePages": "353-373",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Autocorrelation and Forecasting",
        "pages": "353-373"
      },
      {
        "id": "S2",
        "document": "Six Sigma: Advanced Tools for Black Belts and Master Black Belts",
        "chapter": "Chapter 25",
        "section": "Integrated Approach for Statistical Control of Autocorrelated Processes",
        "pages": "381-405"
      }
    ],
    "chart": {
      "type": "time-series",
      "title": "Daily distribution-center backlog",
      "xLabel": "Day",
      "yLabel": "Backlog (orders)",
      "decimals": 0,
      "labels": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18"
      ],
      "data": [
        102,
        105,
        103,
        108,
        111,
        110,
        116,
        119,
        118,
        124,
        128,
        126,
        133,
        137,
        136,
        142,
        145,
        149
      ],
      "altText": "Daily backlog across 18 days generally rises from 102 to 149 orders. Adjacent days tend to be similar, with only small reversals around days 3, 6, 9, 12, and 15."
    },
    "visual": {
      "type": "time-series",
      "datasetRef": "test-bank-assets/mbb-160/batch-01/datasets.json#mbb:set-2:original-023",
      "specRef": "test-bank-assets/mbb-160/batch-01/visual-specs.json#mbb:set-2:original-023",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-01/static-fallbacks.html#mbb-set-2-original-023",
      "altText": "Daily backlog across 18 days generally rises from 102 to 149 orders. Adjacent days tend to be similar, with only small reversals around days 3, 6, 9, 12, and 15.",
      "interactionPurpose": "Toggle between the raw backlog series and model residuals, then inspect whether serial structure remains after modeling.",
      "validationRef": "test-bank-assets/mbb-160/batch-01/validation.json#mbb:set-2:original-023",
      "breakpointsValidated": [],
      "answerCueAudit": true,
      "validationScope": "Generated metadata is not a browser test; see docs/audits/mbb-set2-batch1.md for measured evidence."
    }
  },
  {
    "qid": "mbb:set-2:original-024",
    "set": 2,
    "batch": 1,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Binary logistic-regression interpretation"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Statistical-output interpretation",
    "industry": "Service and transactional operations",
    "quantitative": false,
    "stem": "A binary logistic model of observational service data uses abandonment = 1 and completion = 0. The table gives adjusted coefficients, standard errors, two-sided Wald p-values, and odds ratios. Wait is measured in 10-minute units, and the model contains no interactions. At alpha = 0.05, which interpretation is defensible?",
    "options": [
      "Holding other predictors constant, 10 minutes more wait is associated with about 52% higher abandonment odds; the new-agent coefficient is not significant",
      "Each additional 10 minutes increases abandonment probability by exactly 52 percentage points for every customer, regardless of baseline probability or other predictors",
      "New agents cause 20% more abandonment because their odds ratio is above 1, and the estimated direction should be treated as conclusive regardless of its p-value",
      "Case complexity is practically unimportant because logistic coefficients cannot be interpreted on a linear-probability scale or compared directly with ordinary slopes"
    ],
    "answer": 0,
    "why": "For wait time, exp(0.42)=1.52196: ten minutes more wait is associated with about 52% higher adjusted abandonment odds, holding the other model predictors constant. It is not a constant probability-point increase and does not establish causation. The new-agent Wald statistic is 0.18/0.21=0.857, with two-sided p≈0.391, so it is not statistically distinguishable from zero at alpha=0.05; that is not proof of no practical effect. For complexity, exp(1.10)≈3.004. Practical importance requires context, not the p-value alone. <b>A. Holding other predictors constant, 10 minutes more wait is associated with about 52% higher abandonment odds; the new-agent coefficient is not significant</b> <span class=\"tb-source-ref\">Source: Tang et al., Chapter 12, Logistic Regression Approach, pp. 181-193; Kubiak, Chapter 25, Logistic Regression Analysis, pp. 384-392.</span>",
    "optionRationales": [
      "Correct. It uses the specified event coding and units, interprets adjusted odds rather than probability, and avoids a causal claim.",
      "Odds ratios do not translate to a constant change in probability across baseline risks.",
      "An estimate above one is not sufficient evidence when uncertainty is large.",
      "The complexity odds ratio of 3.00 is directly interpretable and potentially important."
    ],
    "formula": "Odds ratio = exp(beta). For wait time, exp(0.42) = 1.52.",
    "assumptions": [
      "Observations are independent.",
      "The logit functional form and diagnostics are adequate.",
      "Indicators are coded 1 for yes and 0 for no.",
      "This observational analysis does not establish causation."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "logistic regression",
      "odds ratio",
      "p-value",
      "adjusted effect",
      "probability"
    ],
    "sourceDocument": "Six Sigma: Advanced Tools for Black Belts and Master Black Belts",
    "sourceSection": "Chapter 12 - Logistic Regression Approach",
    "sourcePages": "181-193",
    "sources": [
      {
        "id": "S2",
        "document": "Six Sigma: Advanced Tools for Black Belts and Master Black Belts",
        "chapter": "Chapter 12 - Analysis of Categorical Data",
        "section": "Logistic Regression Approach",
        "pages": "181-193"
      },
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 25",
        "section": "Logistic Regression Analysis",
        "pages": "384-392"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Predictor",
        "Coefficient",
        "SE",
        "p-value",
        "Adjusted odds ratio"
      ],
      "rows": [
        [
          "Wait time (per 10 min)",
          "0.42",
          "0.11",
          "<0.001",
          "1.52"
        ],
        [
          "New agent (yes vs no)",
          "0.18",
          "0.21",
          "0.39",
          "1.20"
        ],
        [
          "Complex case (yes vs no)",
          "1.10",
          "0.24",
          "<0.001",
          "3.00"
        ]
      ]
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-01/datasets.json#mbb:set-2:original-024",
      "specRef": "test-bank-assets/mbb-160/batch-01/visual-specs.json#mbb:set-2:original-024",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-01/static-fallbacks.html#mbb-set-2-original-024",
      "altText": "A logistic-regression table shows wait time coefficient 0.42, p below 0.001, odds ratio 1.52; new-agent coefficient 0.18, p 0.39, odds ratio 1.20; complex-case coefficient 1.10, p below 0.001, odds ratio 3.00.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-01/validation.json#mbb:set-2:original-024",
      "breakpointsValidated": [],
      "answerCueAudit": true,
      "validationScope": "Generated metadata is not a browser test; see docs/audits/mbb-set2-batch1.md for measured evidence."
    }
  },
  {
    "qid": "mbb:set-2:original-025",
    "set": 2,
    "batch": 1,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Components of variation and nested studies"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Multi-step quantitative",
    "industry": "Manufacturing",
    "quantitative": true,
    "stem": "A balanced nested study decomposes variance in a continuous response measured in MPa; all variance components in the table are in MPa². Management asks whether replacing the test instrument alone could reduce the observed standard deviation by at least 20%, assuming the replacement eliminates repeatability variance completely and leaves other components unchanged. Which conclusion is correct?",
    "options": [
      "Yes; repeatability is 2 MPa², so removing that variance component reduces the observed standard deviation by 2 MPa",
      "Yes; repeatability is 9.1% of variance, which exceeds the 4% variance reduction needed for a 20% standard-deviation reduction",
      "No; eliminating repeatability changes SD from √22 to √20 MPa, only about a 4.7% reduction in the observed standard deviation",
      "No; lot-to-lot, unit-within-lot, and repeatability variance components cannot be added under an independent nested random-effects model"
    ],
    "answer": 2,
    "why": "Under the stated independent random-effects model, variance components add: 12+8+2=22 MPa². The current SD is √22=4.69042 MPa. Eliminating only repeatability leaves variance 20 MPa² and SD √20=4.47214 MPa. The relative SD reduction is 1−√(20/22)=0.0465374, or 4.65% (about 4.7%), not 20%. A 20% SD reduction would require variance to fall by 1−0.8²=36%. Variance in MPa² must not be subtracted directly from SD in MPa. <b>C. No; eliminating repeatability changes SD from √22 to √20 MPa, only about a 4.7% reduction in the observed standard deviation</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 25, Components of Variation, pp. 408-414; Tang et al., Chapter 6, Process Variations and Their Estimates, pp. 73-83.</span>",
    "optionRationales": [
      "Variance units cannot be subtracted directly from standard deviation units.",
      "A 20% SD reduction requires variance to fall to 0.8^2 = 64% of its original value, a 36% variance reduction.",
      "Correct. Removing the entire 2-unit component has only a small effect on total standard deviation.",
      "Properly estimated nested variance components are additive under the model."
    ],
    "formula": "sigma_total = sqrt(12 + 8 + 2) = sqrt(22); sigma_without repeatability = sqrt(20); reduction = 1 - sqrt(20/22) = 4.65%.",
    "assumptions": [
      "Variance-component estimates are nonnegative and based on an adequate balanced nested study.",
      "Components are independent under the fitted random-effects model.",
      "The replacement instrument eliminates only repeatability variance."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "variance components",
      "nested design",
      "repeatability",
      "standard deviation",
      "measurement system"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 25 - Components of Variation",
    "sourcePages": "408-414",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Components of Variation",
        "pages": "408-414"
      },
      {
        "id": "S2",
        "document": "Six Sigma: Advanced Tools for Black Belts and Master Black Belts",
        "chapter": "Chapter 6 - Process Variations and Their Estimates",
        "section": "Process Variability; Nested Design",
        "pages": "73-83"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Variance source",
        "Estimated variance (MPa²)",
        "Share of total variance"
      ],
      "rows": [
        [
          "Lot-to-lot",
          "12",
          "54.5%"
        ],
        [
          "Unit within lot",
          "8",
          "36.4%"
        ],
        [
          "Test repeatability",
          "2",
          "9.1%"
        ],
        [
          "Total",
          "22",
          "100.0%"
        ]
      ]
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-01/datasets.json#mbb:set-2:original-025",
      "specRef": "test-bank-assets/mbb-160/batch-01/visual-specs.json#mbb:set-2:original-025",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-01/static-fallbacks.html#mbb-set-2-original-025",
      "altText": "A variance-component table in MPa squared lists lot-to-lot variance 12 (54.5%), unit-within-lot variance 8 (36.4%), and test-repeatability variance 2 (9.1%). The total variance is 22 MPa squared. The listed percentages are rounded independently to one decimal place.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-01/validation.json#mbb:set-2:original-025",
      "breakpointsValidated": [],
      "answerCueAudit": true,
      "validationScope": "Generated metadata is not a browser test; see docs/audits/mbb-set2-batch1.md for measured evidence."
    },
    "studentContext": "The balanced nested random-effects model is adequate, and its variance components are independent. Only repeatability changes after replacement."
  }
];

  var batch4=[
  {
    "qid": "mbb:set-2:original-076",
    "set": 2,
    "batch": 4,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "A. Strategic Plan Development",
      "topic": "Integrated strategic, tactical, and operational planning"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Visual strategy-evidence interpretation",
    "industry": "Automotive manufacturing and aftermarket services",
    "quantitative": false,
    "stem": "An automotive group is six months into a three-year warranty strategy. The executive evidence below is the complete current deployment record. Leaders say the strategy is on track because the annual warranty-cost target has not yet been missed. Which recommendation best repairs the planning system?",
    "options": [
      "Freeze every target for the full three years so regional leaders cannot dilute accountability when external conditions change",
      "Replace the operational measures with monthly warranty cost because one financial outcome makes regional comparisons consistent",
      "Let each function retain its preferred measures and reconcile differences only if the annual warranty result misses its target",
      "Build linked tactical and operational plans with owners, budget and capacity commitments, leading indicators, and a cross-functional review cadence"
    ],
    "answer": 3,
    "why": "An annual warranty-cost outcome cannot establish whether unresolved training, laboratory, and interface dependencies are being managed. Local activity measures are not a substitute for validated strategy-linked leading indicators. Tactical and operational plans must translate strategy into owned work, resources, dependencies, and a recurring cross-functional review. Frozen targets, replacing all operational evidence with one lagging result, and waiting for an annual miss leave these execution gaps unresolved. <b>D. Build linked tactical and operational plans with owners, budget and capacity commitments, leading indicators, and a cross-functional review cadence</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 1 - Strategic Plan Deployment; Traditional strategic planning, pp. 14-17.</span>",
    "optionRationales": [
      "A rigid plan prevents justified adaptation and does not create the missing tactical and operational links.",
      "A single lagging financial result would remove early evidence about the processes that create warranty cost.",
      "Delayed reconciliation preserves local optimization and makes recovery dependent on an already missed outcome.",
      "Correct. The recommendation connects strategy to executable work, resources, leading evidence, and adaptive governance."
    ],
    "formula": null,
    "assumptions": [
      "The annual warranty-cost result is a lagging indicator.",
      "No omitted tactical plan currently resolves the recorded conflicts."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "strategic planning",
      "tactical planning",
      "operational planning",
      "leading indicators",
      "line of sight"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 1 - Strategic Plan Deployment; Traditional strategic planning",
    "sourcePages": "14-17",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 1 - Strategic Plan Deployment",
        "section": "Traditional strategic planning",
        "pages": "14-17"
      },
      {
        "id": "S2",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 2 - Strategic Plan Alignment",
        "section": "Project alignment with the strategic plan and business objectives",
        "pages": "25-27"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Plan layer / owner",
        "Current measure",
        "Timing",
        "Resource or dependency record"
      ],
      "rows": [
        [
          "Corporate strategy",
          "Warranty cost per installed unit",
          "Annual result",
          "Capital envelope only"
        ],
        [
          "Service operations",
          "Calls closed per agent-hour",
          "Weekly",
          "No diagnostic-training capacity"
        ],
        [
          "Product engineering",
          "Design changes released",
          "Quarterly",
          "Shared test lab not scheduled"
        ],
        [
          "Digital platform",
          "Portal launch date",
          "Single milestone",
          "Service-data interface unresolved"
        ]
      ],
      "auditBatch": 4,
      "auditId": "mbb:set-2:original-076",
      "altText": "Deployment record: corporate warranty cost is annual; service calls per agent-hour are weekly; engineering changes are quarterly; the portal has a launch milestone. The table states resources and dependencies for each layer."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-04/datasets.json#mbb:set-2:original-076",
      "specRef": "test-bank-assets/mbb-160/batch-04/visual-specs.json#mbb:set-2:original-076",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-04/static-fallbacks.html#mbb-set-2-original-076",
      "altText": "Deployment record: corporate warranty cost is annual; service calls per agent-hour are weekly; engineering changes are quarterly; the portal has a launch milestone. The table states resources and dependencies for each layer.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-04/validation.json#mbb:set-2:original-076",
      "breakpointsValidated": [],
      "answerCueAudit": false,
      "validationNote": "Source/markup checks are generated; measured layout, interaction and cue inspection are documented in docs/audits/mbb-set2-batch04/report.md."
    }
  },
  {
    "qid": "mbb:set-2:original-077",
    "set": 2,
    "batch": 4,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "C. Infrastructure Elements of Improvement Systems",
      "topic": "Deployment readiness and organizational maturity assessment"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Deployment assessment design",
    "industry": "Multi-site healthcare",
    "quantitative": false,
    "stem": "A health network wants a defensible baseline before expanding Six Sigma from two hospitals to fourteen. Executives propose one anonymous question asking employees whether the organization is ready. Which assessment design should the Master Black Belt endorse?",
    "options": [
      "Use behaviorally anchored evidence across culture, infrastructure, leadership, people, processes, and technology, sampled by site and level, then triangulate ratings with operating records",
      "Use the single anonymous readiness question across every hospital because a very large response count and high confidence level will compensate for the absence of behaviorally anchored, dimension-specific evidence",
      "Score readiness only from the number of certified Belts and completed projects because objective counts eliminate cultural subjectivity",
      "Interview the deployment sponsor alone because executive commitment is the controlling variable for all other readiness dimensions"
    ],
    "answer": 0,
    "why": "Readiness is multidimensional and varies across sites and organizational levels. Behaviorally anchored rating scales make maturity judgments observable; stratification exposes local variation; and operating records test whether perceptions match practice. A single sentiment item, credential counts, or one executive view cannot establish organizational and process maturity. <b>A. Use behaviorally anchored evidence across culture, infrastructure, leadership, people, processes, and technology, sampled by site and level, then triangulate ratings with operating records</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 3 - Deployment of Six Sigma Systems; Assessment; cultural and operations assessment, pp. 33-41.</span>",
    "optionRationales": [
      "Correct. It creates a repeatable baseline across the readiness dimensions and reduces single-source bias.",
      "Sample size cannot repair a construct that is represented by one vague perception question.",
      "Credential and project counts omit leadership behavior, process maturity, technology, and cultural conditions.",
      "Sponsor commitment matters, but one perspective cannot represent a distributed deployment system."
    ],
    "formula": null,
    "assumptions": [
      "The purpose is a baseline for deployment decisions, not an employee-engagement poll.",
      "Comparable operating records are available at each site."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "readiness assessment",
      "organizational maturity",
      "BARS",
      "stratified sampling",
      "triangulation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 3 - Deployment of Six Sigma Systems; Assessment; cultural and operations assessment",
    "sourcePages": "33-41",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 3 - Deployment of Six Sigma Systems",
        "section": "Assessment; cultural and operations assessment",
        "pages": "33-41"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-078",
    "set": 2,
    "batch": 4,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "D. Improvement Methodologies",
      "topic": "Business process management life cycle and automation governance"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Method and governance selection",
    "industry": "Banking and financial services",
    "quantitative": false,
    "stem": "A bank plans to automate a commercial-loan handoff. The current process has three undocumented routing variants, no end-to-end owner, unstable approval time, and frequent rework caused by incomplete applications. The technology team wants to configure workflow immediately. What should the Master Black Belt recommend?",
    "options": [
      "Automate the most common routing variant first, route every deviation to a manual queue, and use exception logs after launch to discover the remaining requirements and ownership structure",
      "Install the workflow with every current routing variant and incomplete-application loop because faithfully digitizing actual practice is the least disruptive and fastest form of enterprise standardization",
      "Establish ownership, design and model the end-to-end process, remove major failure causes, define execution and monitoring controls, then automate validated work",
      "Delay all process work until approval time becomes statistically stable on its own, because BPM cannot begin with an unstable baseline"
    ],
    "answer": 2,
    "why": "Business process management is a life cycle of design, modeling, execution, monitoring, and optimization. Automation can strengthen a capable process, but digitizing undefined routes and known rework embeds waste at scale. The bank first needs end-to-end ownership and a validated process model, followed by controls that make automation observable and governable. <b>C. Establish ownership, design and model the end-to-end process, remove major failure causes, define execution and monitoring controls, then automate validated work</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 4 - Six Sigma Methodologies; Business systems and process management, pp. 65-69.</span>",
    "optionRationales": [
      "Post-launch logs are useful, but using customers to discover known design requirements creates avoidable failure demand.",
      "Digitizing every variant preserves undocumented complexity instead of designing an intentional end-to-end process.",
      "Correct. It follows the BPM life cycle and prevents automation from institutionalizing an unstable poor process.",
      "BPM is a means to improve instability; spontaneous stability is not an entry requirement."
    ],
    "formula": null,
    "assumptions": [
      "The automation is discretionary rather than required for an immediate regulatory deadline.",
      "Incomplete applications are a confirmed source of rework."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "business process management",
      "automation",
      "process owner",
      "BPM life cycle",
      "process modeling"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 4 - Six Sigma Methodologies; Business systems and process management",
    "sourcePages": "65-69",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 4 - Six Sigma Methodologies",
        "section": "Business systems and process management",
        "pages": "65-69"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-079",
    "set": 2,
    "batch": 4,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "E. Opportunities for Improvement",
      "topic": "Creativity-to-innovation operating system"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Innovation-system design",
    "industry": "Medical-device development",
    "quantitative": false,
    "stem": "A medical-device company runs energetic idea contests, but concepts disappear after voting and teams avoid unconventional proposals because senior engineers criticize them during brainstorming. Which approach should the Master Black Belt endorse?",
    "options": [
      "Ask senior engineers to rank ideas as they are voiced, then fund only concepts receiving unanimous technical approval in the session",
      "Frame opportunity statements, generate ideas without judgment using diverse participants, evaluate later against explicit criteria, and assign funded experiments with owners and learning gates",
      "Replace facilitated ideation with an anonymous suggestion box and implement the most frequently submitted concept each quarter",
      "Reward the largest number of raw ideas per employee and postpone feasibility, customer value, resources, and ownership until annual planning"
    ],
    "answer": 1,
    "why": "Creativity produces ideas; innovation requires successful implementation. Separating a judgment-free workout from later evaluation protects divergent thinking, while explicit criteria, resources, ownership, and learning gates convert selected concepts into experiments and implementation. Popularity, unanimity, or idea counts alone do not create innovation. <b>B. Frame opportunity statements, generate ideas without judgment using diverse participants, evaluate later against explicit criteria, and assign funded experiments with owners and learning gates</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 5 - Opportunities for Improvement; Creativity and innovation tools, pp. 83-87.</span>",
    "optionRationales": [
      "Immediate expert judgment suppresses divergent thinking and confuses generation with evaluation.",
      "Correct. It connects opportunity framing and protected creativity to disciplined selection and implementation.",
      "Submission frequency is not evidence of customer value, feasibility, or successful implementation.",
      "Idea-volume rewards create raw material but leave the organization without an innovation pathway."
    ],
    "formula": null,
    "assumptions": [
      "The organization can fund a limited number of controlled experiments.",
      "Patient safety and regulatory review remain mandatory at appropriate gates."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "innovation",
      "creativity",
      "idea generation",
      "idea evaluation",
      "learning gates"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 5 - Opportunities for Improvement; Creativity and innovation tools",
    "sourcePages": "83-87",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 5 - Opportunities for Improvement",
        "section": "Creativity and innovation tools",
        "pages": "83-87"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-080",
    "set": 2,
    "batch": 4,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "F. Pipeline Management",
      "topic": "Dynamic portfolio risk monitoring and reprioritization"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Portfolio-risk governance scenario",
    "industry": "Energy and utilities",
    "quantitative": false,
    "stem": "After four projects were selected, a new cyber requirement doubled one project's expected cost, a supplier delay blocked another, and a mandatory compliance project with a fixed legal deadline entered the pipeline. Sponsors argue that the original ranking must remain fixed for fairness. What should the Master Black Belt do?",
    "options": [
      "Keep the original sequence, preserve every original funding promise, and add the regulatory project without revisiting capacity because selection decisions create permanent sponsor commitments",
      "Cancel the blocked supplier project and transfer its budget to the cyber project without recalculating enterprise value or dependencies",
      "Wait until annual planning because changing priorities within the year makes benefit forecasts and sponsor accountability impossible to maintain",
      "Protect mandatory compliance obligations, refresh value, dependencies, readiness and resource demand at a governance gate, then reprioritize transparently and record the decision basis"
    ],
    "answer": 3,
    "why": "Pipeline priorities respond to confirmed changes in requirements, value, risk, dependencies, and available resources. The mandatory deadline is a constraint, not an optional benefit to trade away for a higher ranking. The board should assess how to meet it, escalate resource shortfalls, and reprioritize discretionary work on a documented basis. Keeping all original promises, moving budgets without analysis, or waiting for annual planning cannot resolve the changed portfolio conditions. <b>D. Protect mandatory compliance obligations, refresh value, dependencies, readiness and resource demand at a governance gate, then reprioritize transparently and record the decision basis</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 6 - Risk Analysis of Projects and the Pipeline; Project prioritization; pipeline management, pp. 98-99.</span>",
    "optionRationales": [
      "Adding work without a capacity decision hides overload and treats an old ranking as an entitlement.",
      "A unilateral budget transfer ignores comparative value, dependency effects, and the new regulatory demand.",
      "Annual-only review is too slow for material risk changes and undermines active pipeline management.",
      "Correct. Mandatory compliance is protected while governance transparently reassesses the discretionary portfolio and any resource shortfall."
    ],
    "formula": null,
    "assumptions": [
      "The governance board has authority to change sequencing.",
      "The cyber and regulatory changes are confirmed rather than speculative."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "pipeline management",
      "dynamic risk",
      "reprioritization",
      "governance gate",
      "resource capacity"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 6 - Risk Analysis of Projects and the Pipeline; Project prioritization; pipeline management",
    "sourcePages": "98-99",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 6 - Risk Analysis of Projects and the Pipeline",
        "section": "Project prioritization; pipeline management",
        "pages": "98-99"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-081",
    "set": 2,
    "batch": 4,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "D. Organizational Change Management",
      "topic": "Centralized-to-federated deployment structure"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Organizational operating-model design",
    "industry": "Global industrial manufacturing",
    "quantitative": false,
    "stem": "A global manufacturer is beginning deployment in four regions with uneven improvement maturity. Corporate leaders need consistent standards and benefit rules, but regional presidents need adaptation for language, unions, customers, and geography. Which initial operating model is most defensible?",
    "options": [
      "Start with a strong central deployment office and solid or dotted corporate reporting for standards and assurance, while granting bounded regional adaptation and reviewing decentralization as maturity grows",
      "Give each region full authority over methods, certification criteria, finance rules, technology, project gates, and portfolio decisions from the first day, then compare the four locally designed systems after benefit maturity develops",
      "Run every regional project, personnel assignment, tollgate, method decision, financial validation, and customer adaptation directly from headquarters indefinitely because local adaptation and enterprise consistency cannot coexist",
      "Place deployment in the training department, measure success through certification volume, and let that group negotiate with regional presidents because training is the common regional requirement"
    ],
    "answer": 0,
    "why": "Early centralization can provide scarce expertise, consistent methods, finance rules, and governance while the regions build capability. Bounded local adaptation recognizes geography, culture, unions, and customers. As maturity develops, authority may move outward while corporate reporting retains assurance against each region doing its own incompatible version. <b>A. Start with a strong central deployment office and solid or dotted corporate reporting for standards and assurance, while granting bounded regional adaptation and reviewing decentralization as maturity grows</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 8 - Organizational Commitment; Necessary organizational structure for deployment, pp. 115-119.</span>",
    "optionRationales": [
      "Correct. It combines early deployment control with explicit adaptation and a maturity-based transition path.",
      "Immediate full autonomy risks incompatible methods, credentials, benefit definitions, and governance.",
      "Permanent headquarters control prevents useful local capability and context-sensitive execution.",
      "Training is one deployment component and lacks the authority needed for enterprise governance."
    ],
    "formula": null,
    "assumptions": [
      "Regional presidents accept defined enterprise controls.",
      "The organization expects regional capability to increase over time."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "organizational design",
      "centralization",
      "federated deployment",
      "reporting structure",
      "regional adaptation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 8 - Organizational Commitment; Necessary organizational structure for deployment",
    "sourcePages": "115-119",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 8 - Organizational Commitment",
        "section": "Necessary organizational structure for deployment",
        "pages": "115-119"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-082",
    "set": 2,
    "batch": 4,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "E. Organizational Feedback",
      "topic": "Integrated listening posts and closed-loop action"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Customer-process evidence integration",
    "industry": "Omnichannel retail",
    "quantitative": false,
    "stem": "Retail surveys praise delivery speed, complaint calls report damaged packages, warehouse data show stable pick accuracy, and social posts increasingly mention crushed cartons. Each function publishes its own dashboard, and no one owns the end-to-end fulfillment process. What should the Master Black Belt establish first?",
    "options": [
      "Use the structured survey as the official enterprise voice, weight it by response volume, and treat complaint calls and social comments as unrepresentative anecdotes until both pass a formal random-sampling standard",
      "Retain distinct listening channels with common definitions and linked duplicate events, appoint an end-to-end process owner, and define event and time triggers for senior action",
      "Normalize and average all four indicators into one satisfaction index, suppress source-specific variation, and use the composite trend as the only trigger for corrective action across fulfillment",
      "Ask each function to stabilize and improve its own dashboard, retain local ownership for every measure, and appoint an end-to-end process owner only after all four evidence streams move in the same direction"
    ],
    "answer": 1,
    "why": "The streams measure different aspects of fulfillment: speed, damage, picking, and customer experience. Common definitions and end-to-end ownership make them actionable without collapsing unlike measures into an arbitrary average. Link reports of the same delivery to avoid double-counting; separate channels do not guarantee independent observations or representative sampling. Validate each source and establish time- and event-based escalation rather than dismissing inconvenient feedback or waiting for all dashboards to agree. <b>B. Retain distinct listening channels with common definitions and linked duplicate events, appoint an end-to-end process owner, and define event and time triggers for senior action</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 10 - Data Gathering; Voice of the customer and voice of the process; listening posts, pp. 148-156.</span>",
    "optionRationales": [
      "Structured surveys can contain sampling and timing blind spots and should not automatically override other signals.",
      "Correct. It preserves source-specific signals, avoids duplicate-event inflation, and supplies the ownership and triggers needed for action.",
      "Averaging unlike signals can conceal the specific contradiction that requires investigation.",
      "Local stability can coexist with end-to-end failure and should not delay cross-functional ownership."
    ],
    "formula": null,
    "assumptions": [
      "The four evidence streams refer to the same fulfillment population and comparable periods.",
      "No single source has yet been proven invalid."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "voice of customer",
      "voice of process",
      "listening posts",
      "process owner",
      "closed-loop feedback"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 10 - Data Gathering; Voice of the customer and voice of the process; listening posts",
    "sourcePages": "148-156",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 10 - Data Gathering",
        "section": "Voice of the customer and voice of the process; listening posts",
        "pages": "148-156"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-083",
    "set": 2,
    "batch": 4,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "C. Organizational Challenges",
      "topic": "Herzberg hygiene factors and motivators"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Organizational-behavior interpretation",
    "industry": "Public-sector shared services",
    "quantitative": false,
    "stem": "A shared-services unit corrected inequitable pay, unsafe working conditions, and confusing policies. Complaints declined, but voluntary improvement participation remains low; employees report little autonomy, recognition, achievement, or advancement. Using Herzberg's two-factor framework, which next intervention best addresses the remaining issue?",
    "options": [
      "Repeat broad pay and policy improvements as the primary participation intervention, without changing responsibility or recognition in improvement work",
      "Treat reduced complaints as proof of full motivation and require participation quotas without further discussion of the work environment",
      "Pilot enriched improvement roles with meaningful responsibility, achievement feedback, recognition and growth opportunities, then evaluate participation",
      "Reduce autonomy and achievement opportunities while retaining only pay and safe conditions, because the former factors merely prevent dissatisfaction"
    ],
    "answer": 2,
    "why": "Within Herzberg's framework, pay, policies and working conditions are hygiene factors: correcting them addresses dissatisfaction but does not by itself provide the satisfiers identified in the case. Responsibility, achievement, recognition and advancement therefore motivate the proposed role-enrichment pilot. The observations do not prove that motivation has a single cause or guarantee the pilot's effect; follow-up evidence is needed. Another hygiene-only intervention, forced quotas, or removing meaningful work does not address the stated gap. <b>C. Pilot enriched improvement roles with meaningful responsibility, achievement feedback, recognition and growth opportunities, then evaluate participation</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 11 - Internal Organizational Challenges; Herzberg's motivational factors, pp. 163-164.</span>",
    "optionRationales": [
      "The hygiene deficiencies were already addressed; repeating that intervention alone ignores the reported absence of meaningful responsibility and recognition.",
      "Fewer complaints do not establish full motivation, and quotas do not address the satisfiers missing from the reported work environment.",
      "Correct. The pilot targets the missing satisfiers within the stated framework and checks its effect rather than assuming success.",
      "This reverses the framework: responsibility and achievement are satisfiers, not hygiene factors to remove."
    ],
    "formula": null,
    "assumptions": [
      "Employee reports are credible indicators of the current work environment."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "Herzberg",
      "hygiene factors",
      "motivators",
      "job enrichment",
      "employee engagement"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 11 - Internal Organizational Challenges; Herzberg's motivational factors",
    "sourcePages": "163-164",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 11 - Internal Organizational Challenges",
        "section": "Herzberg's motivational factors",
        "pages": "163-164"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-084",
    "set": 2,
    "batch": 4,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "C. Organizational Challenges",
      "topic": "Situational leadership using competence and commitment"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Interactive leadership-evidence interpretation",
    "industry": "Pharmaceutical laboratory operations",
    "quantitative": false,
    "stem": "A laboratory team learned a new deviation-review method. The evidence plot uses a 1-to-10 anchored scale. At Week 8 the team can perform independently, but commitment fell after two approved recommendations were reversed without explanation. Which leadership response best fits the evidence?",
    "options": [
      "Increase directive behavior, prescribe every analytical step, require daily compliance checks, and temporarily remove decision authority because falling commitment shows the team has lost technical competence",
      "Delegate all decisions and withdraw from the team because the competence series has reached the independent-performance threshold",
      "Return to basic technical training, restore novice-level supervision, and defer discussion of the unexplained reversals until morale improves",
      "Reduce task direction, use high supportive behavior to surface and resolve the commitment barrier, and agree on decision rights and review checkpoints"
    ],
    "answer": 3,
    "why": "Situational leadership considers both competence and commitment. The team now demonstrates high competence, so renewed step-by-step direction would be mismatched. Commitment is low following a reported organizational barrier that warrants investigation, making supportive behavior, listening, clarified decision rights, and shared checkpoints more appropriate than abandonment or retraining. <b>D. Reduce task direction, use high supportive behavior to surface and resolve the commitment barrier, and agree on decision rights and review checkpoints</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 11 - Internal Organizational Challenges; Leadership styles; situational leadership and intervention styles, pp. 165-176.</span>",
    "optionRationales": [
      "The performance evidence shows competence increased; more direction would misdiagnose the commitment problem.",
      "Competence alone does not justify withdrawal when commitment has fallen and organizational barriers remain.",
      "Technical retraining does not address unexplained decision reversals and may further reduce commitment.",
      "Correct. High support and lower direction fit capable people whose commitment needs restoration."
    ],
    "formula": null,
    "assumptions": [
      "Scores are based on anchored behavioral evidence rather than uncalibrated opinion.",
      "A score of 8 is the approved independent-performance threshold.",
      "Scores are ordered, behaviorally anchored ratings, not measurements with demonstrated equal intervals.",
      "The threshold of 8 applies to independent technical performance only; no commitment cut-off is specified."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "situational leadership",
      "competence",
      "commitment",
      "supportive behavior",
      "decision rights"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 11 - Internal Organizational Challenges; Leadership styles; situational leadership and intervention styles",
    "sourcePages": "165-176",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 11 - Internal Organizational Challenges",
        "section": "Leadership styles; situational leadership and intervention styles",
        "pages": "165-176"
      }
    ],
    "chart": {
      "type": "multi-time-series",
      "title": "Team readiness evidence",
      "xLabel": "Week",
      "yLabel": "Behaviorally anchored score (1-10)",
      "labels": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8"
      ],
      "yDomain": [
        0,
        10
      ],
      "referenceValue": 8,
      "referenceLabel": "Competence threshold: 8",
      "series": [
        {
          "label": "Demonstrated competence",
          "data": [
            2,
            3,
            4.5,
            5.5,
            6.5,
            7.5,
            8.5,
            9
          ]
        },
        {
          "label": "Observed commitment",
          "data": [
            8.5,
            8,
            7.8,
            7.5,
            7,
            6,
            4.5,
            3.5
          ]
        }
      ],
      "auditBatch": 4,
      "auditId": "mbb:set-2:original-084",
      "altText": "Weekly competence scores: 2, 3, 4.5, 5.5, 6.5, 7.5, 8.5, 9. Weekly commitment scores: 8.5, 8, 7.8, 7.5, 7, 6, 4.5, 3.5. The competence threshold is 8."
    },
    "visual": {
      "type": "multi-time-series",
      "datasetRef": "test-bank-assets/mbb-160/batch-04/datasets.json#mbb:set-2:original-084",
      "specRef": "test-bank-assets/mbb-160/batch-04/visual-specs.json#mbb:set-2:original-084",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-04/static-fallbacks.html#mbb-set-2-original-084",
      "altText": "Weekly competence scores: 2, 3, 4.5, 5.5, 6.5, 7.5, 8.5, 9. Weekly commitment scores: 8.5, 8, 7.8, 7.5, 7, 6, 4.5, 3.5. The competence threshold is 8.",
      "interactionPurpose": "Inspect source observations with keyboard, touch or native selection; the same values are available in a table. No interaction changes the scored case.",
      "validationRef": "test-bank-assets/mbb-160/batch-04/validation.json#mbb:set-2:original-084",
      "breakpointsValidated": [],
      "answerCueAudit": false,
      "validationNote": "Source/markup checks are generated; measured layout, interaction and cue inspection are documented in docs/audits/mbb-set2-batch04/report.md."
    }
  },
  {
    "qid": "mbb:set-2:original-085",
    "set": 2,
    "batch": 4,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "C. Organizational Challenges",
      "topic": "Interest-based conflict resolution"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Conflict-resolution scenario",
    "industry": "Aerospace manufacturing",
    "quantitative": false,
    "stem": "Engineering demands a two-week test window to reduce technical risk; Operations refuses more than three days because customer deliveries are threatened. Positions have hardened, but both groups value safety, delivery credibility, and avoiding repeat tests. What should the Master Black Belt do next?",
    "options": [
      "Separate people from the problem, surface interests and assumptions, generate options without commitment, and evaluate packages using agreed safety and delivery criteria",
      "Split the difference between the stated test windows, divide the delivery risk equally, and treat equal movement from positions as sufficient evidence of a safe and feasible plan",
      "Escalate immediately, frame the dispute as a forced two-option decision, and ask the senior sponsor to choose one position before the teams discuss underlying interests or alternative packages",
      "Let Engineering decide because technical risk outranks operational and customer interests unless a quantified financial comparison proves otherwise"
    ],
    "answer": 0,
    "why": "Interest-based bargaining moves the parties away from fixed positions and toward the needs that a solution must satisfy. Separating people from the problem, making assumptions visible, generating alternatives before judging them, and applying objective criteria can produce packages that protect both safety and delivery. A midpoint or authority decision may ignore feasible integrative options. <b>A. Separate people from the problem, surface interests and assumptions, generate options without commitment, and evaluate packages using agreed safety and delivery criteria</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 11 - Internal Organizational Challenges; Interdepartmental conflicts; negotiation, pp. 177-182.</span>",
    "optionRationales": [
      "Correct. It follows the interest-based sequence and uses criteria tied to both parties’ legitimate concerns.",
      "A numerical midpoint treats positions as facts and may be unsafe, infeasible, or unnecessarily costly.",
      "Premature escalation bypasses joint problem solving and conceals the interests needed to design options.",
      "Technical risk matters, but automatic priority prevents evaluation of alternatives that may satisfy both interests."
    ],
    "formula": null,
    "assumptions": [
      "Both groups can participate in a facilitated negotiation.",
      "Safety and delivery performance can be expressed as objective decision criteria.",
      "Mandatory safety and regulatory requirements must be met by every option; no immediate hazard requires emergency action."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "interest-based bargaining",
      "conflict resolution",
      "objective criteria",
      "positions and interests",
      "facilitation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 11 - Internal Organizational Challenges; Interdepartmental conflicts; negotiation",
    "sourcePages": "177-182",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 11 - Internal Organizational Challenges",
        "section": "Interdepartmental conflicts; negotiation",
        "pages": "177-182"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-086",
    "set": 2,
    "batch": 4,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "B. Project Portfolio Infrastructure and Management",
      "topic": "Cross-project dependencies and program governance"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Visual portfolio-architecture design",
    "industry": "Enterprise software and customer operations",
    "quantitative": false,
    "stem": "Four independently chartered projects now share the dependency network below (durations in working days). Sponsors continue to manage scope and benefits separately, while the customer migration date depends on outputs from all four. What governance architecture should the Master Black Belt endorse?",
    "options": [
      "Merge every activity into one charter and one benefit total so separate accountable owners and intermediate gates are no longer required",
      "Leave the charters independent and ask teams to report dependency failures only when their own milestone becomes late",
      "Create program-level governance with a dependency owner, integrated milestones and risks, while retaining bounded project charters, owners, gates, and benefit accountability",
      "Pause the two longest activities and complete the short activities first because duration alone determines portfolio sequencing"
    ],
    "answer": 2,
    "why": "The network is a coordinated program, not evidence that every project should lose its bounded charter. Program-level governance makes shared dependencies, integrated milestones, and cumulative risks visible, while project-level ownership and benefit accountability remain intact. Waiting for a local milestone to fail manages dependencies too late. <b>C. Create program-level governance with a dependency owner, integrated milestones and risks, while retaining bounded project charters, owners, gates, and benefit accountability</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 14 - Project Oversight and Management; Project and program management; project management principles, pp. 202-204.</span>",
    "optionRationales": [
      "A megacharter can obscure ownership and benefit realization even when program coordination is necessary.",
      "Local reporting after failure does not govern the upstream dependencies shown in the network.",
      "Correct. Program coordination integrates dependencies without eliminating bounded project accountability.",
      "Activity duration alone ignores precedence, shared outputs, benefit timing, and resource constraints."
    ],
    "formula": "Program finish requires completion of P, Q, R, and S along the documented precedence links; duration alone is not a sequencing rule.",
    "assumptions": [
      "Every displayed precedence link is mandatory.",
      "Each project still has a distinct accountable owner and benefit case.",
      "Arrows mean finish-to-start dependencies with no lag. S needs both Q and R; M is the zero-duration migration milestone.",
      "The diagram describes project dependencies, not a resource-allocation optimization."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "program governance",
      "project dependencies",
      "cross-functional projects",
      "megaproject",
      "integrated milestones"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 14 - Project Oversight and Management; Project and program management; project management principles",
    "sourcePages": "202-204",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Project and program management; project management principles",
        "pages": "202-204"
      }
    ],
    "chart": {
      "type": "activity-network",
      "nodes": {
        "P": {
          "dur": 20,
          "col": 0,
          "row": 0
        },
        "Q": {
          "dur": 30,
          "col": 1,
          "row": 0
        },
        "R": {
          "dur": 15,
          "col": 1,
          "row": 1
        },
        "S": {
          "dur": 25,
          "col": 2,
          "row": 0
        },
        "M": {
          "dur": 0,
          "col": 3,
          "row": 0
        }
      },
      "edges": [
        [
          "P",
          "Q"
        ],
        [
          "P",
          "R"
        ],
        [
          "Q",
          "S"
        ],
        [
          "R",
          "S"
        ],
        [
          "S",
          "M"
        ]
      ],
      "durationUnit": "working days",
      "title": "Project dependencies and migration milestone",
      "auditBatch": 4,
      "auditId": "mbb:set-2:original-086",
      "altText": "P takes 20 working days and precedes Q (30) and R (15). Both Q and R precede S (25), which precedes the zero-duration migration milestone M."
    },
    "visual": {
      "type": "activity-network",
      "datasetRef": "test-bank-assets/mbb-160/batch-04/datasets.json#mbb:set-2:original-086",
      "specRef": "test-bank-assets/mbb-160/batch-04/visual-specs.json#mbb:set-2:original-086",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-04/static-fallbacks.html#mbb-set-2-original-086",
      "altText": "P takes 20 working days and precedes Q (30) and R (15). Both Q and R precede S (25), which precedes the zero-duration migration milestone M.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-04/validation.json#mbb:set-2:original-086",
      "breakpointsValidated": [],
      "answerCueAudit": false,
      "validationNote": "Source/markup checks are generated; measured layout, interaction and cue inspection are documented in docs/audits/mbb-set2-batch04/report.md."
    }
  },
  {
    "qid": "mbb:set-2:original-087",
    "set": 2,
    "batch": 4,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "B. Project Portfolio Infrastructure and Management",
      "topic": "Earned-value performance and forecast"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Quantitative earned-value diagnosis",
    "industry": "Construction and capital projects",
    "quantitative": true,
    "stem": "A capital-improvement project has BAC = $2.40 million. At the review date, PV = $1.20 million, EV = $0.96 million, and AC = $1.20 million. If current cost performance is expected to continue, which diagnosis and forecast are correct?",
    "options": [
      "CPI = 1.25, SPI = 0.80, and EAC = $1.92 million; the project is under budget but behind schedule",
      "CPI = 0.80, SPI = 0.80, and EAC = $3.00 million; the project is over budget and behind schedule",
      "CPI = 0.80, SPI = 1.25, and EAC = $2.88 million; the project is over budget but ahead of schedule",
      "CPI = 1.00, SPI = 0.80, and EAC = $2.40 million; only schedule recovery is required"
    ],
    "answer": 1,
    "why": "CPI = EV/AC = 0.96/1.20 = 0.80 and SPI = EV/PV = 0.96/1.20 = 0.80. Both indices are below 1, so the project is over budget for the value earned and behind schedule. Under the stated continued-cost-performance assumption, EAC = BAC/CPI = 2.40/0.80 = $3.00 million. <b>B. CPI = 0.80, SPI = 0.80, and EAC = $3.00 million; the project is over budget and behind schedule</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 14 - Project Oversight and Management; Measurement; earned value analysis, pp. 212-215.</span>",
    "optionRationales": [
      "This reverses the CPI ratio and therefore understates the forecast cost.",
      "Correct. Both performance indices equal 0.80 and BAC divided by CPI gives $3.00 million.",
      "SPI uses EV divided by PV, not PV divided by EV, and the stated EAC is unsupported.",
      "Actual cost equals planned value, but cost performance is evaluated against earned value."
    ],
    "formula": "CPI = EV / AC = 0.96 / 1.20 = 0.80; SPI = EV / PV = 0.96 / 1.20 = 0.80; EAC = BAC / CPI = 2.40 / 0.80 = $3.00 million.",
    "assumptions": [
      "Future cost performance continues at the current CPI.",
      "BAC and earned-value inputs use the same approved baseline."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "earned value",
      "CPI",
      "SPI",
      "EAC",
      "project forecast"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 14 - Project Oversight and Management; Measurement; earned value analysis",
    "sourcePages": "212-215",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Measurement; earned value analysis",
        "pages": "212-215"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-088",
    "set": 2,
    "batch": 4,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "B. Project Portfolio Infrastructure and Management",
      "topic": "Decision-oriented project status communication"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Project recovery communication",
    "industry": "Telecommunications",
    "quantitative": false,
    "stem": "A network-upgrade project is six weeks late. The weekly report remains green because the team completed 92% of scheduled tasks, but a permit issue threatens the launch date and no owner or recovery decision is recorded. What should the Master Black Belt require?",
    "options": [
      "Keep the report green until a contractual milestone is formally missed, but append a permit-risk narrative so forecasts remain separated from actual status and task completion",
      "Replace the report with a detailed chronological activity and correspondence log so executives can independently infer severity, critical-path impact, accountability, and required decisions",
      "Report the unfinished tasks, permit chronology, cumulative schedule variance, and every possible recovery alternative without identifying a recommended action or sponsor decision",
      "Report accomplishments, permit impact, owner, recovery dates, next-period plan, and the sponsor decision required now"
    ],
    "answer": 3,
    "why": "A status report supports decisions, not activity counting. High task completion can coexist with a critical path threat. The report should make the issue, effect, ownership, corrective action, near-term plan, and required escalation explicit so the sponsor and team are not surprised and can act before launch failure. <b>D. Report accomplishments, permit impact, owner, recovery dates, next-period plan, and the sponsor decision required now</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 14 - Project Oversight and Management; Project status communication; corrective action, pp. 215-218.</span>",
    "optionRationales": [
      "Waiting for a missed milestone converts a forecastable risk into a preventable failure.",
      "An activity dump shifts synthesis to executives and leaves ownership and decision needs ambiguous.",
      "The option includes schedule impact and alternatives, but omits an accountable recovery owner, recommended action and the specific sponsor decision needed now.",
      "Correct. It turns status evidence into accountable recovery and an explicit governance decision."
    ],
    "formula": null,
    "assumptions": [
      "The permit issue is on the launch critical path.",
      "The sponsor has authority to approve the needed recovery action."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "status report",
      "corrective action",
      "exception reporting",
      "project recovery",
      "sponsor decision"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 14 - Project Oversight and Management; Project status communication; corrective action",
    "sourcePages": "215-218",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Project status communication; corrective action",
        "pages": "215-218"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-089",
    "set": 2,
    "batch": 4,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "C. Project Portfolio Financial Tools",
      "topic": "Hard savings, soft savings, and cost avoidance"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Financial-benefit classification",
    "industry": "Insurance claims operations",
    "quantitative": false,
    "stem": "A claims project saves ten analyst minutes on each of 60,000 annual cases. Salaries, headcount, overtime, and vendor spending are unchanged; the released time has not been assigned to additional work, and the budget will not be reduced. How should Finance classify the current benefit?",
    "options": [
      "As released capacity or a soft benefit; book hard savings only when Finance verifies a corresponding expense or budget reduction against the baseline",
      "As hard savings equal to every released minute multiplied by the fully burdened analyst labor rate, entered at project closure because any measured processing-time reduction automatically creates recoverable enterprise cash",
      "As recognized incremental revenue equal to the released hours multiplied by average contribution margin per analyst hour, even though no additional claims have been accepted, processed, or billed",
      "As cost avoidance and hard savings simultaneously so both operational productivity and estimated financial value appear in the portfolio"
    ],
    "answer": 0,
    "why": "Ten minutes across 60,000 annual transactions is 600,000 minutes, or 10,000 hours of theoretical released capacity. The stated unchanged salaries, overtime, staffing and spending do not establish a hard-dollar reduction. Useful redeployment may support productivity or additional revenue, but neither is automatically a cash saving. Finance should validate any later financial effect against the baseline and avoid double-counting the same benefit as both soft and hard savings. <b>A. As released capacity or a soft benefit; book hard savings only when Finance verifies a corresponding expense or budget reduction against the baseline</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 16 - Project Financial Tools; Costing concepts; defining hard versus soft dollars, pp. 226-228.</span>",
    "optionRationales": [
      "Correct. The improvement is operationally useful, but a hard financial effect has not yet occurred.",
      "Multiplying unrecoverable time slices by a labor rate can create false savings without cash impact.",
      "Unused theoretical capacity is not revenue; an accepted and billed workload would need separate evidence.",
      "Dual classification overstates the same benefit and obscures whether any budget consequence exists."
    ],
    "formula": "Released capacity = 10 minutes x 60,000 cases = 600,000 minutes = 10,000 analyst-hours; financial classification still depends on realized use or cost impact.",
    "assumptions": [
      "The volume estimate is valid.",
      "No contractual service-level penalty was reduced."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "hard savings",
      "soft savings",
      "cost avoidance",
      "released capacity",
      "false savings"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 16 - Project Financial Tools; Costing concepts; defining hard versus soft dollars",
    "sourcePages": "226-228",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 16 - Project Financial Tools",
        "section": "Costing concepts; defining hard versus soft dollars",
        "pages": "226-228"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-090",
    "set": 2,
    "batch": 4,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "A. Training Needs Analysis",
      "topic": "Training-needs analysis and nontraining causes"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual training-needs diagnosis",
    "industry": "Food manufacturing",
    "quantitative": false,
    "stem": "A plant asks for refresher training after sanitation-release errors increase. The initial evidence is shown below. Before specifying content or delivery, what should the Master Black Belt do?",
    "options": [
      "Build the refresher course around the three most common supervisor opinions, deploy it to all shifts immediately, and use course completion as the direct measure that the plant has closed the underlying skill gaps",
      "Complete performance and cause analysis by role and shift, verify required versus actual behavior, and quantify which gaps are knowledge or skill deficiencies rather than system barriers",
      "Train every sanitation employee on the entire procedure because uniform coverage is more defensible than diagnosing different causes",
      "Postpone analysis until the audit score declines materially because the current outcome measure is still within its historical range and no formal training trigger has fired"
    ],
    "answer": 1,
    "why": "A request for training is not proof of a training need. The evidence contains opinion, a changed job aid, shift concentration, and a system-access barrier. Performance and cause analysis should define required behavior, locate the gap by audience, and determine whether knowledge or skill is deficient before a curriculum is designed. The share of errors alone cannot establish a higher night-shift error rate without its exposure denominator; collect release counts and link observations to the affected task. <b>B. Complete performance and cause analysis by role and shift, verify required versus actual behavior, and quantify which gaps are knowledge or skill deficiencies rather than system barriers</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 17 - Training Needs Analysis; Performance and quantitative analysis; identifying actual training needs, pp. 236-244.</span>",
    "optionRationales": [
      "Interviews can generate hypotheses, but opinions alone are not a quantitative diagnosis of training need.",
      "Correct. It distinguishes trainable gaps from job-aid, access, process, and management causes.",
      "Universal retraining spends capacity without establishing who lacks which required competency.",
      "Waiting for a lagging audit result ignores current release errors and available diagnostic evidence."
    ],
    "formula": null,
    "assumptions": [
      "Release-error coding is consistent across shifts.",
      "The job-aid revision and access logs can be independently verified.",
      "The 74% value is a share of all recorded errors, not the night-shift error rate. Shift release volumes are needed for rate comparisons."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training needs analysis",
      "performance analysis",
      "skill gap",
      "nontraining cause",
      "audience analysis"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 17 - Training Needs Analysis; Performance and quantitative analysis; identifying actual training needs",
    "sourcePages": "236-244",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 17 - Training Needs Analysis",
        "section": "Performance and quantitative analysis; identifying actual training needs",
        "pages": "236-244"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Evidence source",
        "Recorded observation"
      ],
      "rows": [
        [
          "Supervisor interviews",
          "Three supervisors request refresher training; no task observations have been collected"
        ],
        [
          "Error records",
          "Night shift accounts for 74% of recent errors; release counts by shift are not supplied"
        ],
        [
          "Document control",
          "Job aid changed six weeks ago; no comprehension assessment has been performed"
        ],
        [
          "System access log",
          "Access fails on 18% of night-shift releases"
        ]
      ],
      "auditBatch": 4,
      "auditId": "mbb:set-2:original-090",
      "altText": "Supervisor requests, error records, a job-aid revision and system-access logs are displayed with their observations and available denominators."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-04/datasets.json#mbb:set-2:original-090",
      "specRef": "test-bank-assets/mbb-160/batch-04/visual-specs.json#mbb:set-2:original-090",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-04/static-fallbacks.html#mbb-set-2-original-090",
      "altText": "Supervisor requests, error records, a job-aid revision and system-access logs are displayed with their observations and available denominators.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-04/validation.json#mbb:set-2:original-090",
      "breakpointsValidated": [],
      "answerCueAudit": false,
      "validationNote": "Source/markup checks are generated; measured layout, interaction and cue inspection are documented in docs/audits/mbb-set2-batch04/report.md."
    }
  },
  {
    "qid": "mbb:set-2:original-091",
    "set": 2,
    "batch": 4,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "B. Training Plan Elements",
      "topic": "Modular multilevel curriculum and delivery capacity"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Training-program architecture",
    "industry": "Regional banking",
    "quantitative": false,
    "stem": "A bank targets 120 qualified Green Belts within six months and has six qualified coaches for applied projects. Required competencies differ across branch, fraud and operations roles. Coach availability, concurrent project loads and project durations have not yet been estimated. Which planning approach should the Master Black Belt recommend before approving feasibility?",
    "options": [
      "Approve one cohort of 120 learners, defer applied projects until the course ends, and ask operations to absorb the coaching demand later",
      "Let each function set its own qualification criteria and approve delivery dates independently, without coordinating shared coaching resources",
      "Build common foundations and role pathways, quantify coaching and project demand, then stagger feasible cohorts or renegotiate resources and timing without weakening standards",
      "Approve the six-month promise immediately, shorten applied practice to fit the calendar, and restore project requirements for subsequent cohorts"
    ],
    "answer": 2,
    "why": "The proposed architecture must connect competencies, shared foundations, role-specific learning, applied projects and transfer evaluation to a quantified resource schedule. Six coaches alone do not show how many learners can qualify within six months. Staggering may help, but it cannot manufacture missing capacity; the plan must estimate project concurrency and duration, coach time and learner release, then escalate any shortfall. Independent standards or reduced applied practice would change qualification rather than solve the planning problem. <b>C. Build common foundations and role pathways, quantify coaching and project demand, then stagger feasible cohorts or renegotiate resources and timing without weakening standards</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 18 - Training Plans; Components of an effective training plan; applying training plans, pp. 248-251.</span>",
    "optionRationales": [
      "Approving the cohort before calculating demand defers rather than resolves the coaching and project bottleneck.",
      "Uncoordinated qualification criteria and shared-resource schedules undermine consistency and cannot establish feasible throughput.",
      "Correct. It makes feasibility conditional on an explicit demand/capacity model while preserving qualification standards and transfer evaluation.",
      "Reducing practice changes the qualification standard and cannot support the original promise of 120 competent Green Belts."
    ],
    "formula": null,
    "assumptions": [
      "Qualification requires demonstrated competency and completed applied project requirements, not attendance alone.",
      "Leaders can consider extra resources or a revised target date if the quantified plan is infeasible."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training plan",
      "modular curriculum",
      "multilevel competencies",
      "coaching capacity",
      "learning transfer"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 18 - Training Plans; Components of an effective training plan; applying training plans",
    "sourcePages": "248-251",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 18 - Training Plans",
        "section": "Components of an effective training plan; applying training plans",
        "pages": "248-251"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-092",
    "set": 2,
    "batch": 4,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "D. Training Program Effectiveness",
      "topic": "Isolation of training effects using operational outcomes"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Training-effectiveness study design",
    "industry": "Hospital emergency care",
    "quantitative": false,
    "stem": "An emergency-department network plans triage training while staffing ratios, queue software and escalation policy also change. Comparable units can receive the nontraining changes on the same schedule, and training can be phased without compromising care. Leaders want to estimate the training’s additional effect on door-to-provider time. Which evaluation design provides the strongest feasible causal evidence?",
    "options": [
      "Compare participant satisfaction after class with next-month department time, assigning any improvement to training without an untrained comparison",
      "Use only a posttraining knowledge test, treating a learning score as proof of improved door-to-provider performance despite the concurrent changes",
      "Compare units receiving the entire intervention bundle with units receiving none of it, attributing their difference in changes solely to training",
      "Keep nontraining changes comparable, randomize training timing where feasible, compare contemporaneous pre/post changes, and document fidelity, case mix and spillover"
    ],
    "answer": 3,
    "why": "To estimate the additional effect of training, the comparison must separate training exposure from the staffing, software and policy changes. Comparable nontraining conditions and randomized training timing, when feasible, make that distinction substantially more credible. Use contemporaneous pre/post measurements, assess case mix, fidelity and spillover, and quantify uncertainty. If allocation is not randomized, difference-in-differences relies on credible parallel untreated trends and no differential cointervention; a matched group or phased bundle alone does not isolate training. <b>D. Keep nontraining changes comparable, randomize training timing where feasible, compare contemporaneous pre/post changes, and document fidelity, case mix and spillover</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 20 - Training Effectiveness Evaluation; Isolating the effects of training, pp. 291.</span>",
    "optionRationales": [
      "Satisfaction is a reaction measure and the uncontrolled outcome also reflects staffing, software, policy and time effects.",
      "A learning score is useful but cannot by itself demonstrate transfer or isolate an operational causal effect.",
      "The contrast estimates the effect of the whole bundle, not the additional effect of training.",
      "Correct. The design isolates training exposure as far as feasible and records the implementation and comparability threats to inference."
    ],
    "formula": "Estimated training effect = (post - pre change in trained unit) - (post - pre change in matched comparison unit).",
    "assumptions": [
      "Training timing can be varied safely and ethically; all units still receive the required operational and care safeguards.",
      "Outcomes and case-mix measures have common definitions; exposure, staffing, software and policy changes are recorded.",
      "A nonrandomized comparison would additionally require a credible parallel-trends assumption absent training; matching alone does not establish it."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "training evaluation",
      "control group",
      "difference in differences",
      "learning transfer",
      "causal attribution"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 20 - Training Effectiveness Evaluation; Isolating the effects of training",
    "sourcePages": "291",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 20 - Training Effectiveness Evaluation",
        "section": "Isolating the effects of training",
        "pages": "291"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-093",
    "set": 2,
    "batch": 4,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "A. Executives and Champions",
      "topic": "Champion accountability at tollgate reviews"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Role-accountability interpretation",
    "industry": "Chemical manufacturing",
    "quantitative": false,
    "stem": "At a Measure tollgate, a Champion asks the Black Belt to take sole responsibility for approving continued strategic alignment, authorizing cross-functional resources and resolving a plant-manager barrier, without Champion participation. The Belt can provide project evidence but has no delegated executive authority. Which allocation of responsibility should the Master Black Belt reinforce?",
    "options": [
      "The Champion owns alignment, resources, and barriers; the Belt and team own project analysis and recommendations",
      "The Belt owns every item because the project leader is solely accountable for alignment, resources, and barriers between charter approval and Control",
      "The Master Black Belt should assume the Champion's authority whenever a tollgate identifies a cross-functional barrier",
      "Finance owns strategic alignment, cross-functional resources, and barrier removal because it validates benefit assumptions and savings claims at every project tollgate"
    ],
    "answer": 0,
    "why": "The Champion sponsors the project, confirms continuing strategic relevance, secures cross-functional resources, and removes organizational barriers. The Black Belt and team provide the process and analytical evidence needed for the go/no-go decision. The MBB coaches and assures technical quality but does not silently replace executive accountability. <b>A. The Champion owns alignment, resources, and barriers; the Belt and team own project analysis and recommendations</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 21 - Mentoring Champions, Change Agents, and Executives; Project reviews; tollgate reviews, pp. 294-298.</span>",
    "optionRationales": [
      "Correct. It preserves executive sponsorship while keeping evidence creation with the project team.",
      "A Belt leads project work but does not possess executive authority for resources and barrier removal.",
      "Coaching and escalation support do not transfer the Champion’s organizational accountability to the MBB.",
      "Finance validates financial claims; it does not own the project’s full strategic and resource mandate."
    ],
    "formula": null,
    "assumptions": [
      "The project remains within its approved governance structure."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "Champion",
      "tollgate",
      "strategic alignment",
      "barrier removal",
      "role accountability"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 21 - Mentoring Champions, Change Agents, and Executives; Project reviews; tollgate reviews",
    "sourcePages": "294-298",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 21 - Mentoring Champions, Change Agents, and Executives",
        "section": "Project reviews; tollgate reviews",
        "pages": "294-298"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-094",
    "set": 2,
    "batch": 4,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "B. Teams and Individuals",
      "topic": "Team-stage backsliding and intervention"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Team-coaching intervention",
    "industry": "Medical claims administration",
    "quantitative": false,
    "stem": "A previously high-performing claims team adds two specialists after scope expands. Meetings become positional, old members bypass the new specialists, decisions are reopened, and actions leave without owners. The sponsor wants to replace the new members. What is the best coaching response?",
    "options": [
      "Replace the new specialists immediately, restore the former membership, and preserve the original decision process because movement from performing back to storming proves poor person-team fit and insufficient commitment",
      "Recognize stage backsliding, facilitate renewed purpose, roles, norms, decision rules, and conflict handling, then monitor owned actions and performance evidence",
      "Avoid intervention until the team returns to performing, and let original members enforce informal norms because facilitation would prevent ownership",
      "Ask original members to make decisions privately, preserve their informal authority, and communicate final assignments to the specialists after meetings"
    ],
    "answer": 1,
    "why": "Team stages are not permanently linear. Membership and scope changes can move a performing team back into conflict and norm formation. Timely facilitation should reestablish purpose, roles, communication and decision norms, constructively surface conflict, and restore meeting accountability. Removal is premature without evidence that the structural intervention failed. <b>B. Recognize stage backsliding, facilitate renewed purpose, roles, norms, decision rules, and conflict handling, then monitor owned actions and performance evidence</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 22 - Mentoring Black Belts and Green Belts; Team facilitation and meeting management, pp. 310-314.</span>",
    "optionRationales": [
      "Backsliding after a membership change is predictable and is not sufficient evidence for immediate removal.",
      "Correct. It addresses the changed team system and establishes observable follow-through before personnel judgment.",
      "Nonintervention allows exclusion, repeated decisions, and unowned actions to harden into team norms.",
      "A private inner group institutionalizes exclusion and prevents the added expertise from contributing."
    ],
    "formula": null,
    "assumptions": [
      "The new specialists possess the required technical competencies.",
      "No safety or ethics violation requires immediate removal."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "team stages",
      "storming",
      "performing",
      "team norms",
      "coaching intervention"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 22 - Mentoring Black Belts and Green Belts; Team facilitation and meeting management",
    "sourcePages": "310-314",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 22 - Mentoring Black Belts and Green Belts",
        "section": "Team facilitation and meeting management",
        "pages": "310-314"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-095",
    "set": 2,
    "batch": 4,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "B. Teams and Individuals",
      "topic": "Non-belt coaching and mentoring; active recruitment and progression"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Development-pathway design",
    "industry": "Municipal government",
    "quantitative": false,
    "stem": "A city’s improvement intranet and awareness sessions attract many employees, but few apply for Belt roles. Informal interviews show uncertainty about eligibility and what a project assignment involves. Qualified mentors and suitable projects are available. Which next step best develops a sustainable non-Belt-to-Belt pipeline?",
    "options": [
      "Increase the number of awareness attendance certificates and count each recipient as a qualified Green Belt, leaving project expectations to be explained later",
      "Keep the passive intranet as the only recruitment route and admit only employees who can independently interpret the complete technical qualification requirements",
      "Use targeted information sessions and mentored project exposure, clarify eligibility and progression, and match ready candidates to sponsored projects while retaining qualification standards",
      "Assign every interested employee to the full Black Belt curriculum immediately, before checking role needs, entry readiness, project access or available coaching time"
    ],
    "answer": 2,
    "why": "A pipeline must help interested non-Belt employees understand both eligibility and the actual work before progressing to a qualification pathway. Active outreach, mentored exposure and clear entry criteria address the barriers identified here; matching ready candidates to sponsored projects makes progression practical. Retain formal competence and project requirements. Attendance certificates, continued passive-only recruitment, or automatic advanced training for everyone do not resolve this specific recruitment and readiness gap. <b>C. Use targeted information sessions and mentored project exposure, clarify eligibility and progression, and match ready candidates to sponsored projects while retaining qualification standards</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 23 - Mentoring Non-belt Employees; Awareness, recruitment and progression to Belt roles, pp. 315-316.</span>",
    "optionRationales": [
      "Awareness attendance is not demonstrated Belt competence; changing the label does not develop a sustainable qualified pipeline.",
      "Passive information has not resolved the observed eligibility and project-role uncertainty; this repeats the ineffective approach.",
      "Correct. Active outreach, realistic project exposure and mentoring address the stated barriers while preserving qualification meaning.",
      "A uniform advanced curriculum ignores assessed needs and prerequisites and may waste both learner and coaching resources."
    ],
    "formula": null,
    "assumptions": [
      "The immediate objective is a sustainable pipeline of ready applicants, not maximizing credentials issued.",
      "Formal Belt qualification still requires demonstrated competencies and applied project evidence."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "non-belt mentoring",
      "recruitment",
      "readiness",
      "project exposure",
      "qualification standards"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 23 - Mentoring Non-belt Employees; Awareness, recruitment and progression to Belt roles",
    "sourcePages": "315-316",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 23 - Mentoring Non-belt Employees",
        "section": "Awareness, recruitment and progression to Belt roles",
        "pages": "315-316"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-096",
    "set": 2,
    "batch": 4,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. Measurement Systems Analysis (MSA), Process Capability, and Control",
      "topic": "Bias and linearity across the operating range"
    },
    "difficulty": "Expert",
    "cognitive": "Analyze",
    "questionType": "Interactive MSA regression interpretation",
    "industry": "Precision machining",
    "quantitative": true,
    "stem": "A calibration study uses certified references across the full operating range. At reference values 20, 40, 60, 80, and 100 mm, estimated biases are 1.8, 1.0, 0.2, -0.6, and -1.4 mm. The mean bias is 0.2 mm. What is the correct conclusion?",
    "options": [
      "The system is acceptable because the positive and negative biases cancel to a small grand mean across the certified references, and a near-zero overall bias is sufficient evidence across the operating range",
      "The system has poor repeatability because bias changes sign across the range, so an X-bar and R gage study is the only valid next analysis",
      "The system is stable over time because the five certified reference points form a straight line, so no calibration action is needed",
      "The small grand mean conceals range-dependent bias of −0.04 mm per reference millimeter; investigate and validate any correction across the range before declaring acceptability"
    ],
    "answer": 3,
    "why": "The five means follow bias = 2.6 − 0.04 × reference, in millimeters. Their average is 0.2 mm, but opposite-signed biases can cancel without demonstrating accuracy at individual reference values. This is a range-dependent bias pattern, not evidence about repeatability or stability over time. Investigate the measurement model and validate an appropriate correction across the operating range; without stated tolerances and uncertainty limits, the chart alone does not provide a formal acceptance or rejection decision. <b>D. The small grand mean conceals range-dependent bias of −0.04 mm per reference millimeter; investigate and validate any correction across the range before declaring acceptability</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 24 - Measurement Systems Analysis (MSA); Variables measurement systems; bias and linearity, pp. 335-337.</span>",
    "optionRationales": [
      "Opposing systematic errors can cancel in the mean while remaining unacceptable at operating-range endpoints.",
      "Changing bias concerns accuracy and linearity; it does not by itself estimate short-term repeatability.",
      "A straight bias-reference relation indicates systematic linearity error, while stability requires time-ordered master measurements.",
      "Correct. The slope diagnoses range-dependent bias while explicitly separating that diagnosis from an unsupported tolerance-based acceptance decision."
    ],
    "formula": "Linearity slope = (-1.4 - 1.8) / (100 - 20) = -3.2 / 80 = -0.04 mm bias per reference mm; mean bias = 0.2 mm.",
    "assumptions": [
      "Certified reference uncertainty is negligible for this comparison.",
      "Bias-estimation uncertainty is small relative to the observed 3.2 mm change across the range.",
      "No numerical acceptance tolerance or confidence interval is supplied; this question diagnoses the pattern rather than performing a formal acceptance test."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "measurement system analysis",
      "bias",
      "linearity",
      "calibration",
      "regression slope"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 24 - Measurement Systems Analysis (MSA); Variables measurement systems; bias and linearity",
    "sourcePages": "335-337",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 24 - Measurement Systems Analysis (MSA)",
        "section": "Variables measurement systems; bias and linearity",
        "pages": "335-337"
      }
    ],
    "chart": {
      "type": "regression-diagnostic",
      "title": "Bias across certified reference values",
      "xLabel": "Certified reference (mm)",
      "yLabel": "Estimated bias (mm)",
      "xTicks": [
        20,
        40,
        60,
        80,
        100
      ],
      "yTicks": [
        -2,
        -1,
        0,
        1,
        2
      ],
      "points": [
        {
          "fitted": 20,
          "residual": 1.8
        },
        {
          "fitted": 40,
          "residual": 1
        },
        {
          "fitted": 60,
          "residual": 0.2
        },
        {
          "fitted": 80,
          "residual": -0.6
        },
        {
          "fitted": 100,
          "residual": -1.4
        }
      ],
      "altText": "Reference values 20, 40, 60, 80 and 100 mm have estimated biases 1.8, 1.0, 0.2, −0.6 and −1.4 mm, respectively. The horizontal reference line marks zero bias.",
      "auditBatch": 4,
      "auditId": "mbb:set-2:original-096"
    },
    "visual": {
      "type": "regression-diagnostic",
      "datasetRef": "test-bank-assets/mbb-160/batch-04/datasets.json#mbb:set-2:original-096",
      "specRef": "test-bank-assets/mbb-160/batch-04/visual-specs.json#mbb:set-2:original-096",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-04/static-fallbacks.html#mbb-set-2-original-096",
      "altText": "Reference values 20, 40, 60, 80 and 100 mm have estimated biases 1.8, 1.0, 0.2, −0.6 and −1.4 mm, respectively. The horizontal reference line marks zero bias.",
      "interactionPurpose": "Inspect source observations with keyboard, touch or native selection; the same values are available in a table. No interaction changes the scored case.",
      "validationRef": "test-bank-assets/mbb-160/batch-04/validation.json#mbb:set-2:original-096",
      "breakpointsValidated": [],
      "answerCueAudit": false,
      "validationNote": "Source/markup checks are generated; measured layout, interaction and cue inspection are documented in docs/audits/mbb-set2-batch04/report.md."
    }
  },
  {
    "qid": "mbb:set-2:original-097",
    "set": 2,
    "batch": 4,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships Between Variables",
      "topic": "Reliability growth and TAAF model assumptions"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Interactive reliability-growth interpretation",
    "industry": "Aerospace product development",
    "quantitative": true,
    "stem": "A development test adopts the immediate-corrective-change protocol summarized for Duane/AMSAA growth models in Kubiak’s Table 25.19. After a failure at 800 cumulative test hours, the team continues testing until 1,200 hours before installing the correction. The cumulative MTBF points appear approximately linear on log-log axes. What is the most defensible review decision?",
    "options": [
      "Withhold the planned immediate-change interpretation, retain all failures and configuration times, and assess a justified phased or delayed-fix analysis before making a growth claim",
      "Accept the model because approximate log-log linearity and a rising cumulative MTBF are sufficient assumptions for either reliability-growth method, regardless of when approved design corrections enter the tested configuration",
      "Delete the failure at 800 hours and the associated exposure from the formal data record because a later design correction makes that event irrelevant to cumulative test time and current configuration performance",
      "Convert all cumulative MTBF points to a Weibull survival curve and discard the configuration timeline because reliability growth cannot use total test time and failure counts"
    ],
    "answer": 0,
    "why": "The delayed implementation conflicts with the immediate-change assumption of the specified protocol; a visually straight cumulative plot does not repair that mismatch. Retain the complete failure and configuration timeline and assess whether a justified phased or delayed-fix treatment supports the desired inference. Do not delete inconvenient failures or transform cumulative counts into a lifetime survival distribution. This is not a claim that every NHPP model universally requires an immediate fix. The final cumulative ratio is 1,600/32 = 50 hours, not proof of the current configuration’s instantaneous MTBF. <b>A. Withhold the planned immediate-change interpretation, retain all failures and configuration times, and assess a justified phased or delayed-fix analysis before making a growth claim</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; Reliability growth models; Table 25.19 immediate-change assumptions, pp. 427-428.</span>",
    "optionRationales": [
      "Correct. It identifies the protocol mismatch and preserves the evidence needed for a justified alternative analysis rather than discarding affected observations.",
      "Both models require more than visual linearity, including prompt incorporation of design changes before resumed testing.",
      "Deleting an observed failure corrupts the cumulative record and overstates reliability performance.",
      "Weibull life modeling answers a different question and does not repair the configuration-history violation."
    ],
    "formula": "Cumulative MTBF = total cumulative unit test time / cumulative failures. Displayed values: 200/10 = 20.0; 400/16 = 25.0; 800/24 = 33.3; 1200/30 = 40.0; 1600/32 = 50.0 hours.",
    "assumptions": [
      "The 800-hour failure required a design change; the stated immediate-change protocol is the planned basis for the claim.",
      "Cumulative failure counts and test exposure are complete; the correction was installed at 1,200 hours.",
      "Cumulative MTBF is total test time divided by cumulative failures, not the instantaneous MTBF of the current design."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "reliability growth",
      "Duane model",
      "AMSAA",
      "TAAF",
      "cumulative MTBF"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Reliability growth models; Table 25.19 immediate-change assumptions",
    "sourcePages": "427-428",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Reliability growth models; Table 25.19 immediate-change assumptions",
        "pages": "427-428"
      }
    ],
    "chart": {
      "type": "reliability-growth",
      "title": "Cumulative reliability-growth record",
      "xLabel": "Cumulative unit test time (hours, log scale)",
      "yLabel": "Cumulative MTBF (hours, log scale)",
      "points": [
        {
          "time": 200,
          "failures": 10,
          "mtbf": 20
        },
        {
          "time": 400,
          "failures": 16,
          "mtbf": 25
        },
        {
          "time": 800,
          "failures": 24,
          "mtbf": 33.333333333333336
        },
        {
          "time": 1200,
          "failures": 30,
          "mtbf": 40
        },
        {
          "time": 1600,
          "failures": 32,
          "mtbf": 50
        }
      ],
      "xTicks": [
        200,
        400,
        800,
        1600
      ],
      "yTicks": [
        20,
        25,
        40,
        50
      ],
      "event": {
        "time": 800,
        "resumeTime": 1200,
        "label": "Failure: 800 h; correction: 1,200 h"
      },
      "auditBatch": 4,
      "auditId": "mbb:set-2:original-097",
      "altText": "At 200, 400, 800, 1,200 and 1,600 test hours, cumulative failures are 10, 16, 24, 30 and 32. Cumulative MTBF is the corresponding time divided by failures. The failure and correction times are 800 and 1,200 hours."
    },
    "visual": {
      "type": "reliability-growth",
      "datasetRef": "test-bank-assets/mbb-160/batch-04/datasets.json#mbb:set-2:original-097",
      "specRef": "test-bank-assets/mbb-160/batch-04/visual-specs.json#mbb:set-2:original-097",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-04/static-fallbacks.html#mbb-set-2-original-097",
      "altText": "At 200, 400, 800, 1,200 and 1,600 test hours, cumulative failures are 10, 16, 24, 30 and 32. Cumulative MTBF is the corresponding time divided by failures. The failure and correction times are 800 and 1,200 hours.",
      "interactionPurpose": "Inspect source observations with keyboard, touch or native selection; the same values are available in a table. No interaction changes the scored case.",
      "validationRef": "test-bank-assets/mbb-160/batch-04/validation.json#mbb:set-2:original-097",
      "breakpointsValidated": [],
      "answerCueAudit": false,
      "validationNote": "Source/markup checks are generated; measured layout, interaction and cue inspection are documented in docs/audits/mbb-set2-batch04/report.md."
    }
  },
  {
    "qid": "mbb:set-2:original-098",
    "set": 2,
    "batch": 4,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "C. Design of Experiments",
      "topic": "Mixture designs with lower bounds and pseudocomponents"
    },
    "difficulty": "Expert",
    "cognitive": "Apply",
    "questionType": "Visual mixture-design transformation",
    "industry": "Polymer formulation",
    "quantitative": true,
    "stem": "A three-component formulation (mass fractions) must satisfy A + B + C = 1 with lower bounds A >= 0.30, B >= 0.40, and C >= 0.10. The experiment uses pseudocomponents z_i = (x_i - L_i)/(1 - sum L_i). What pseudocomponents represent the feasible blend A = 0.40, B = 0.45, C = 0.15?",
    "options": [
      "zA = 0.40, zB = 0.45, zC = 0.15 because the original proportions already sum to one and lower bounds only define feasibility rather than a transformed coordinate system",
      "zA = 0.50, zB = 0.25, zC = 0.25 because the 0.20 proportion above all lower bounds is rescaled to a unit simplex",
      "zA = 0.10, zB = 0.05, zC = 0.05 because pseudocomponents are the unscaled excess above each lower bound and do not need to sum to one after the bounds are imposed",
      "zA = 2.00, zB = 2.25, zC = 0.75 because each original proportion is divided by the remaining 0.20 before checking the transformed simplex constraint"
    ],
    "answer": 1,
    "why": "The lower bounds consume 0.30 + 0.40 + 0.10 = 0.80, leaving 0.20 to allocate. Subtracting bounds gives 0.10, 0.05, and 0.05; dividing each by 0.20 produces 0.50, 0.25, and 0.25, which sum to one in the transformed simplex. <b>B. zA = 0.50, zB = 0.25, zC = 0.25 because the 0.20 proportion above all lower bounds is rescaled to a unit simplex</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 26 - Design of Experiments; Mixture experiments; lower-bound pseudocomponents, pp. 446-448.</span>",
    "optionRationales": [
      "Original proportions locate the actual blend, but they do not remove and rescale the lower-bound region.",
      "Correct. Bound subtraction followed by division by 0.20 maps the feasible region to a unit simplex.",
      "The excesses sum to 0.20 and therefore are not yet normalized pseudocomponents.",
      "Dividing the original proportions ignores the required subtraction of each component’s lower bound."
    ],
    "formula": "1 - sum(L) = 1 - 0.80 = 0.20; z = [(0.40-0.30)/0.20, (0.45-0.40)/0.20, (0.15-0.10)/0.20] = [0.50, 0.25, 0.25].",
    "assumptions": [
      "Only the stated lower bounds constrain the blend.",
      "All component proportions and lower bounds are dimensionless mass fractions."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "mixture experiment",
      "simplex",
      "lower bounds",
      "pseudocomponents",
      "constrained design"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 26 - Design of Experiments; Mixture experiments; lower-bound pseudocomponents",
    "sourcePages": "446-448",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 26 - Design of Experiments",
        "section": "Mixture experiments; lower-bound pseudocomponents",
        "pages": "446-448"
      }
    ],
    "chart": {
      "type": "mixture-simplex",
      "title": "Three-component mixture with lower bounds",
      "components": [
        "A",
        "B",
        "C"
      ],
      "lowerBounds": [
        0.3,
        0.4,
        0.1
      ],
      "point": [
        0.4,
        0.45,
        0.15
      ],
      "pointLabel": "Candidate blend",
      "auditBatch": 4,
      "auditId": "mbb:set-2:original-098",
      "altText": "The mixture triangle has pure A, B and C vertices. The lower bounds are 0.30, 0.40 and 0.10; the candidate point has mass fractions 0.40, 0.45 and 0.15."
    },
    "visual": {
      "type": "mixture-simplex",
      "datasetRef": "test-bank-assets/mbb-160/batch-04/datasets.json#mbb:set-2:original-098",
      "specRef": "test-bank-assets/mbb-160/batch-04/visual-specs.json#mbb:set-2:original-098",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-04/static-fallbacks.html#mbb-set-2-original-098",
      "altText": "The mixture triangle has pure A, B and C vertices. The lower bounds are 0.30, 0.40 and 0.10; the candidate point has mass fractions 0.40, 0.45 and 0.15.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-04/validation.json#mbb:set-2:original-098",
      "breakpointsValidated": [],
      "answerCueAudit": false,
      "validationNote": "Source/markup checks are generated; measured layout, interaction and cue inspection are documented in docs/audits/mbb-set2-batch04/report.md."
    }
  },
  {
    "qid": "mbb:set-2:original-099",
    "set": 2,
    "batch": 4,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "C. Design of Experiments",
      "topic": "D-optimal design under run and feasibility constraints"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Visual constrained-DOE selection",
    "industry": "Semiconductor processing",
    "quantitative": true,
    "stem": "A constrained experiment will fit the six-coefficient model y = β0 + β1A + β2B + β11A² + β12AB + β22B² using coded factors. Each listed candidate has 10 runs. A design must estimate all coefficients and retain at least one lack-of-fit and one pure-error degree of freedom. Using the supplied diagnostics, which listed eligible design is preferred under the D-optimal criterion?",
    "options": [
      "Select P because its determinant is largest and full rank is sufficient, even though it retains no lack-of-fit degrees of freedom",
      "Select Q because its extra lack-of-fit degree of freedom overrides the determinant criterion even when another eligible design has more information",
      "Select R because it has full rank, both required error components, and the largest information determinant among the eligible listed designs",
      "Select S because dropping an unestimable coefficient is acceptable whenever the resulting smaller model retains lack-of-fit degrees of freedom"
    ],
    "answer": 2,
    "why": "For the stated six-coefficient model, P has rank 6 but m = 6, so its lack-of-fit df is zero and it is ineligible despite det(XᵀX) = 546.75. S is ineligible because rank 5 cannot estimate the specified model. Q and R are eligible: their determinants are 9.546875 and 254.619140625, respectively, and both retain pure error. R therefore maximizes the determinant among the eligible listed choices. This minimizes generalized coefficient variance under the stated common error model, not necessarily every individual coefficient variance; it does not prove global optimality over all feasible designs. <b>C. Select R because it has full rank, both required error components, and the largest information determinant among the eligible listed designs</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 26 - Design of Experiments; D-optimal designs, pp. 449-450.</span>",
    "optionRationales": [
      "P has the largest determinant but violates the explicitly required lack-of-fit degree of freedom; full rank alone is insufficient.",
      "Q is eligible, but the selection criterion is the information determinant after meeting the error-degree requirements, not maximizing lack-of-fit df.",
      "Correct. R estimates all six coefficients with one lack-of-fit and three pure-error degrees of freedom and has the larger eligible determinant.",
      "S has rank 5, so dropping a coefficient changes the specified model rather than satisfying its estimability requirement."
    ],
    "formula": "X = [1, A, B, A², AB, B²]; choose max det(XᵀX) subject to rank(X)=6, m−rank(X)≥1, n−m≥1",
    "assumptions": [
      "All candidates use the same coding and model columns [1, A, B, A², AB, B²], with independent equal-variance errors.",
      "Feasible settings use A and B in {−1, −0.5, 0, 0.5, 1} and A + B ≤ 1.5; repeated settings are independent replicate runs.",
      "If m is the number of distinct settings, lack-of-fit df = m − rank(X) and pure-error df = n − m.",
      "These are original synthetic candidate matrices, supplied in the expandable run table; the decision compares the four listed designs, not all possible designs."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "D-optimal design",
      "determinant",
      "design matrix",
      "model rank",
      "constrained DOE"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 26 - Design of Experiments; D-optimal designs",
    "sourcePages": "449-450",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 26 - Design of Experiments",
        "section": "D-optimal designs",
        "pages": "449-450"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Design",
        "Runs n",
        "Rank X",
        "Lack-of-fit df",
        "det(XᵀX)",
        "Distinct settings m",
        "Pure-error df"
      ],
      "rows": [
        [
          "P",
          10,
          6,
          0,
          "546.75",
          6,
          4
        ],
        [
          "Q",
          10,
          6,
          2,
          "9.546875",
          8,
          2
        ],
        [
          "R",
          10,
          6,
          1,
          "254.619140625",
          7,
          3
        ],
        [
          "S",
          10,
          5,
          2,
          "0",
          7,
          3
        ]
      ],
      "designRuns": {
        "P": [
          [
            -1,
            1
          ],
          [
            1,
            -1
          ],
          [
            -1,
            -1
          ],
          [
            0.5,
            -0.5
          ],
          [
            -1,
            -0.5
          ],
          [
            1,
            0.5
          ],
          [
            -1,
            1
          ],
          [
            -1,
            -1
          ],
          [
            1,
            0.5
          ],
          [
            1,
            0.5
          ]
        ],
        "Q": [
          [
            1,
            -1
          ],
          [
            0.5,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            0
          ],
          [
            0,
            0.5
          ],
          [
            -1,
            0.5
          ],
          [
            1,
            0
          ],
          [
            -0.5,
            0
          ],
          [
            -0.5,
            0
          ],
          [
            0.5,
            0
          ]
        ],
        "R": [
          [
            0,
            0.5
          ],
          [
            0.5,
            1
          ],
          [
            -0.5,
            0.5
          ],
          [
            0.5,
            -1
          ],
          [
            1,
            0
          ],
          [
            1,
            -1
          ],
          [
            -1,
            -0.5
          ],
          [
            0.5,
            1
          ],
          [
            0.5,
            -1
          ],
          [
            -1,
            -0.5
          ]
        ],
        "S": [
          [
            0,
            -1
          ],
          [
            0,
            -0.5
          ],
          [
            0,
            0
          ],
          [
            0,
            0.5
          ],
          [
            1,
            -1
          ],
          [
            1,
            -0.5
          ],
          [
            1,
            0
          ],
          [
            0,
            -1
          ],
          [
            0,
            -0.5
          ],
          [
            0,
            0
          ]
        ]
      },
      "modelColumns": [
        "1",
        "A",
        "B",
        "A²",
        "AB",
        "B²"
      ],
      "auditBatch": 4,
      "auditId": "mbb:set-2:original-099",
      "altText": "Four ten-run designs have ranks 6, 6, 6 and 5. Lack-of-fit degrees of freedom are 0, 2, 1 and 2; determinants are 546.75, 9.546875, 254.619140625 and 0. Pure-error degrees of freedom are 4, 2, 3 and 3."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-04/datasets.json#mbb:set-2:original-099",
      "specRef": "test-bank-assets/mbb-160/batch-04/visual-specs.json#mbb:set-2:original-099",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-04/static-fallbacks.html#mbb-set-2-original-099",
      "altText": "Four ten-run designs have ranks 6, 6, 6 and 5. Lack-of-fit degrees of freedom are 0, 2, 1 and 2; determinants are 546.75, 9.546875, 254.619140625 and 0. Pure-error degrees of freedom are 4, 2, 3 and 3.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-04/validation.json#mbb:set-2:original-099",
      "breakpointsValidated": [],
      "answerCueAudit": false,
      "validationNote": "Source/markup checks are generated; measured layout, interaction and cue inspection are documented in docs/audits/mbb-set2-batch04/report.md."
    }
  },
  {
    "qid": "mbb:set-2:original-100",
    "set": 2,
    "batch": 4,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "C. Design of Experiments",
      "topic": "Taguchi inner and outer arrays for robust parameter design"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Visual robust-design interpretation",
    "industry": "Metal cutting and machining",
    "quantitative": true,
    "stem": "A nominal-is-best machined diameter has target 54.0 mm. Each inner-array setting is tested once at each of four outer-array combinations of steel hardness and ambient temperature. Which tested setting should be carried forward, as-is, to a confirmation study for on-target performance with low sensitivity to the imposed noise?",
    "options": [
      "Select I1 because its relatively small dispersion justifies adjusting the mean upward later, without validating that adjustment or comparing it with an already on-target setting",
      "Select I2 because a setting with responses on both sides of target is automatically robust to noise and provides more adjustment range than a tightly clustered response at the nominal value",
      "Select I4 because its highest average response and widest observed range demonstrate the strongest controllable-factor effect and the greatest opportunity for later process adjustment",
      "Select I3 because its mean is on target and its standard deviation across deliberately varied noise conditions is the smallest"
    ],
    "answer": 3,
    "why": "I3 has mean 54.0 mm and sample s = √(2/3) = 0.8165 mm, both preferable to the other tested settings for this comparison. I1 has mean 50.5 and s = 1.2910; I2 has mean 52.0 and s = 4.7610; I4 has mean 57.0 and s = 5.2915 mm. Equal-weight mean squared deviations from target are 13.5, 21.0, 0.5 and 30.0 mm², respectively. Carry I3 forward to confirmation, rather than claiming a global optimum or a production capability result from four unreplicated noise combinations. <b>D. Select I3 because its mean is on target and its standard deviation across deliberately varied noise conditions is the smallest</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 26 - Design of Experiments; Taguchi designs; inner and outer arrays, pp. 443-446.</span>",
    "optionRationales": [
      "I1 is farther from target and more variable than I3; an untested later adjustment cannot displace the better tested setting in an as-is comparison.",
      "Straddling the target can still produce large variability, as the I2 results demonstrate.",
      "A high mean is undesirable for a nominal-is-best target and does not establish noise insensitivity.",
      "Correct. I3 is on target and has the smallest descriptive noise-condition spread; confirmation is still required before deployment."
    ],
    "formula": "I3 mean = (54+55+53+54)/4 = 54.0; sample s = sqrt([0^2+1^2+(-1)^2+0^2]/3) = 0.82.",
    "assumptions": [
      "Responses, the target, means and sample standard deviations are in millimeters; each noise combination has equal weight in this comparison.",
      "Settings have equal implementation cost, and the selection is among the tested settings as-is.",
      "The four noise combinations are unreplicated: sample s describes these four responses, not a separately estimated repeatability error or the full production noise distribution."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "Taguchi methods",
      "inner array",
      "outer array",
      "robust parameter design",
      "noise factors"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 26 - Design of Experiments; Taguchi designs; inner and outer arrays",
    "sourcePages": "443-446",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 26 - Design of Experiments",
        "section": "Taguchi designs; inner and outer arrays",
        "pages": "443-446"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Inner setting",
        "Noise 1",
        "Noise 2",
        "Noise 3",
        "Noise 4",
        "Mean",
        "Sample s"
      ],
      "rows": [
        [
          "I1",
          "50",
          "52",
          "49",
          "51",
          "50.5",
          "1.29"
        ],
        [
          "I2",
          "49",
          "57",
          "47",
          "55",
          "52.0",
          "4.76"
        ],
        [
          "I3",
          "54",
          "55",
          "53",
          "54",
          "54.0",
          "0.82"
        ],
        [
          "I4",
          "56",
          "62",
          "50",
          "60",
          "57.0",
          "5.29"
        ]
      ],
      "auditBatch": 4,
      "auditId": "mbb:set-2:original-100",
      "altText": "Each inner setting has four measured diameters in millimeters. I1: 50, 52, 49, 51. I2: 49, 57, 47, 55. I3: 54, 55, 53, 54. I4: 56, 62, 50, 60. Target diameter: 54.0 mm."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-04/datasets.json#mbb:set-2:original-100",
      "specRef": "test-bank-assets/mbb-160/batch-04/visual-specs.json#mbb:set-2:original-100",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-04/static-fallbacks.html#mbb-set-2-original-100",
      "altText": "Each inner setting has four measured diameters in millimeters. I1: 50, 52, 49, 51. I2: 49, 57, 47, 55. I3: 54, 55, 53, 54. I4: 56, 62, 50, 60. Target diameter: 54.0 mm.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-04/validation.json#mbb:set-2:original-100",
      "breakpointsValidated": [],
      "answerCueAudit": false,
      "validationNote": "Source/markup checks are generated; measured layout, interaction and cue inspection are documented in docs/audits/mbb-set2-batch04/report.md."
    }
  }
];

  var batch2=[
  {
    "qid": "mbb:set-2:original-026",
    "set": 2,
    "batch": 2,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "E. Opportunities for Improvement",
      "topic": "Stakeholder engagement and action planning"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Public infrastructure and utilities",
    "quantitative": false,
    "stem": "A regional water utility is preparing to standardize emergency-repair dispatch. The stakeholder analysis below is complete. Which engagement plan best uses both influence and importance while protecting the deployment from avoidable resistance? Here, influence means ability to affect the project; importance means the priority the project must give to that stakeholder’s needs.",
    "options": [
      "Ask the regulator to approve the finished design, invite union stewards to monthly status briefings, and survey residents after rollout",
      "Collaborate early with the regulator, give field crews a protected design voice, actively involve union stewards, and monitor the vendor through implementation",
      "Delegate the design to field crews because they have the highest importance, then obtain regulator and union acceptance at the final tollgate",
      "Concentrate resources on the software vendor because technical implementation is the immediate constraint and communicate broadly to all others"
    ],
    "answer": 1,
    "why": "Stakeholder strategy distinguishes influence over the project from the priority of stakeholder needs. The regulator is high on both dimensions and warrants early collaboration. Field crews have high-priority needs despite low formal influence and need a protected design voice. Union stewards have high influence and should be involved before opposition hardens. The low-influence, low-importance vendor can be monitored. These ratings do not grant any group authority to bypass safety or legal requirements. <b>B. Collaborate early with the regulator, give field crews a protected design voice, actively involve union stewards, and monitor the vendor through implementation</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 5, Stakeholder Engagement, pp. 78-82.</span>",
    "optionRationales": [
      "Late regulator involvement and passive union briefings ignore high-influence stakeholders during design.",
      "Correct. The actions follow the collaborate, protect-and-defend, actively involve, and monitor logic of the matrix.",
      "Importance gives field crews a voice but does not remove the regulator’s authority or the union’s influence.",
      "A technical constraint does not justify spending most engagement effort on a low-influence, low-importance stakeholder."
    ],
    "formula": null,
    "assumptions": [
      "The influence and importance ratings reflect the proposed dispatch change, not general organizational status.",
      "No stakeholder has an undisclosed legal veto."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "stakeholder analysis",
      "influence",
      "importance",
      "engagement plan",
      "resistance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 5 - Stakeholder Engagement",
    "sourcePages": "78-82",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 5 - Opportunities for Improvement",
        "section": "Stakeholder Engagement",
        "pages": "78-82"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Stakeholder",
        "Project impact",
        "Influence",
        "Importance",
        "Current attitude"
      ],
      "rows": [
        [
          "Safety regulator",
          "High",
          "High",
          "High",
          "Cautious"
        ],
        [
          "Field crews",
          "High",
          "Low",
          "High",
          "Mixed"
        ],
        [
          "Union stewards",
          "Medium",
          "High",
          "Low",
          "Opposed"
        ],
        [
          "Software vendor",
          "Low",
          "Low",
          "Low",
          "Supportive"
        ]
      ],
      "auditBatch": 2,
      "auditId": "mbb:set-2:original-026",
      "altText": "A stakeholder table lists four groups. The safety regulator is high influence and high importance; field crews are low influence and high importance; union stewards are high influence and low importance; and the software vendor is low on both dimensions.",
      "title": "Dispatch stakeholder evidence"
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-02/datasets.json#mbb:set-2:original-026",
      "specRef": "test-bank-assets/mbb-160/batch-02/visual-specs.json#mbb:set-2:original-026",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-02/static-fallbacks.html#mbb-set-2-original-026",
      "altText": "A stakeholder table lists four groups. The safety regulator is high influence and high importance; field crews are low influence and high importance; union stewards are high influence and low importance; and the software vendor is low on both dimensions.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-02/validation.json#mbb:set-2:original-026",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-027",
    "set": 2,
    "batch": 2,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "E. Opportunities for Improvement",
      "topic": "Project identification from integrated customer and process evidence"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Digital banking",
    "quantitative": false,
    "stem": "Executives want to charter a mobile-app redesign because an annual relationship survey rates the app 4.4 out of 5. During the same period, app-session abandonment rose from 8% to 19%; session-event records locate 62% of recorded abandoned attempts at identity verification; and call listening reveals repeated confusion at that step. What should the Master Black Belt recommend?",
    "options": [
      "Preserve the executive charter because the relationship survey is the broadest listening post and therefore dominates event-level process evidence",
      "Launch a customer-delight design project covering the entire app, using the 4.4 rating as the baseline outcome and complaints as anecdotal context",
      "Delay action until a new representative survey and a second independent operational dataset reproduce the abandonment finding, because behavioral measures are not Voice of the Customer",
      "Qualify a focused verification-flow opportunity by reconciling survey scope with behavioral, complaint, and process data before setting the charter boundary"
    ],
    "answer": 3,
    "why": "The evidence need not be contradictory: a broad relationship score can remain high while a particular transaction fails. Session-event records, rather than a self-selected complaint sample, establish the stated concentration of recorded abandoned attempts. The MBB should reconcile listening posts, customer segments, CTQs, and process evidence before qualifying a focused opportunity. This identifies where to investigate; it does not prove a root cause or justify an app-wide redesign. <b>D. Qualify a focused verification-flow opportunity by reconciling survey scope with behavioral, complaint, and process data before setting the charter boundary</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 5, Opportunities for Improvement, pp. 70-78; Chapter 10, Data Gathering, pp. 148-156.</span>",
    "optionRationales": [
      "A broad survey measures a different experience level and should not override convergent transaction evidence.",
      "An app-wide scope is premature when several sources localize the opportunity to one verification step.",
      "Behavioral and process observations can corroborate customer evidence; waiting discards actionable convergence.",
      "Correct. It reconciles the measurement scopes and qualifies the opportunity before committing resources."
    ],
    "formula": null,
    "assumptions": [
      "The survey and operational data cover comparable customer populations and time periods.",
      "Identity verification is not currently constrained by a mandated design."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "project identification",
      "Voice of the Customer",
      "Voice of the Process",
      "listening posts",
      "project qualification"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 5 and 10 - Opportunities for Improvement and Data Gathering",
    "sourcePages": "70-78, 148-156",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 5 - Opportunities for Improvement",
        "section": "Project Identification and Qualification",
        "pages": "70-78"
      },
      {
        "id": "S2",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 10 - Data Gathering",
        "section": "Voice of the Customer and Voice of the Process",
        "pages": "148-156"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-028",
    "set": 2,
    "batch": 2,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "I. Organizational Finance and Business Performance Metrics",
      "topic": "Balanced scorecard and linked leading and lagging measures"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Medical-device manufacturing",
    "quantitative": false,
    "stem": "The executive team claims its deployment scorecard is balanced and causally useful. Which assessment of the displayed measures is most defensible?",
    "options": [
      "The scorecard is incomplete because it overweights lagging outcomes and lacks learning-capability and process-leading measures that could explain future customer and financial results",
      "The scorecard is balanced because revenue, margin, complaints, and recalls span the financial and customer perspectives, which are the only externally material perspectives needed for strategic deployment decisions",
      "The scorecard should replace complaint and recall rates with project counts so every measure can be influenced directly by the Lean Six Sigma deployment office",
      "The scorecard should retain the measures but combine them into one weighted index calibrated to shareholder value, because separate perspectives prevent executives from evaluating enterprise performance consistently over time"
    ],
    "answer": 0,
    "why": "A balanced scorecard covers financial, customer, internal-process, and learning-and-growth perspectives. This scorecard omits process performance and the development of people and systems. Its listed measures report achieved outcomes rather than the upstream capabilities intended to drive future results. Complementary leading measures create testable links between improvement work and outcomes; including them does not by itself establish causality. Percentage-point changes and relative percentage changes are different quantities. <b>A. The scorecard is incomplete because it overweights lagging outcomes and lacks learning-capability and process-leading measures that could explain future customer and financial results</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 9, Business Performance Measures, pp. 137-143.</span>",
    "optionRationales": [
      "Correct. Two perspectives and mostly lagging results do not provide a balanced or diagnostic management system.",
      "Financial and customer outcomes are important but do not replace internal-process and learning-and-growth perspectives.",
      "Project counts measure activity and can invite gaming; they do not explain capability or customer outcomes.",
      "A composite index can hide tradeoffs and causal relationships that the separate perspectives are intended to expose."
    ],
    "formula": null,
    "assumptions": [
      "The table contains the complete executive scorecard.",
      "All four measures are reported accurately and at a useful cadence."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "balanced scorecard",
      "leading indicator",
      "lagging indicator",
      "KPI",
      "business performance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 9 - Business Performance Measures",
    "sourcePages": "137-143",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 9 - Organizational Finance and Business Performance Metrics",
        "section": "Balanced Scorecard and Key Performance Indicators",
        "pages": "137-143"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Perspective claimed",
        "Measure",
        "Direction this quarter"
      ],
      "rows": [
        [
          "Financial",
          "Revenue growth",
          "Down 1.8 percentage points"
        ],
        [
          "Financial",
          "Operating margin",
          "Up 0.4 percentage points"
        ],
        [
          "Customer",
          "Complaint rate",
          "Up 13% relative to prior quarter"
        ],
        [
          "Customer",
          "Recall rate",
          "Unchanged"
        ]
      ],
      "auditBatch": 2,
      "auditId": "mbb:set-2:original-028",
      "altText": "The executive scorecard lists revenue growth down 1.8 percentage points, operating margin up 0.4 percentage points, complaint rate up 13% relative to the prior quarter, and recall rate unchanged. Financial and customer are its two reported perspectives.",
      "title": "Quarterly executive scorecard"
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-02/datasets.json#mbb:set-2:original-028",
      "specRef": "test-bank-assets/mbb-160/batch-02/visual-specs.json#mbb:set-2:original-028",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-02/static-fallbacks.html#mbb-set-2-original-028",
      "altText": "The executive scorecard lists revenue growth down 1.8 percentage points, operating margin up 0.4 percentage points, complaint rate up 13% relative to the prior quarter, and recall rate unchanged. Financial and customer are its two reported perspectives.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-02/validation.json#mbb:set-2:original-028",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-029",
    "set": 2,
    "batch": 2,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "I. Organizational Finance and Business Performance Metrics",
      "topic": "Sarbanes-Oxley financial control responsibilities"
    },
    "difficulty": "Hard",
    "cognitive": "Understand",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Publicly listed technology services",
    "quantitative": false,
    "stem": "A benefits dashboard for a US-listed company lets each project leader edit the realized-savings field after Finance approval. The totals feed financial reporting. The edit history is retained, but the dashboard immediately republishes the revised enterprise total without renewed review. What control concern should the Master Black Belt recognize?",
    "options": [
      "The retained history makes the process adequate because traceability alone establishes management responsibility and authorization for every later change to enterprise totals",
      "The issue is limited to project governance because improvement benefits are operational estimates that remain outside every financial-reporting control boundary",
      "Post-approval edits can bypass authorization and change reported totals, so access, approval, and change controls must be redesigned with Finance",
      "The dashboard should permit edits only during quarter close because timing restrictions eliminate the need for segregated authorization responsibilities"
    ],
    "answer": 2,
    "why": "An audit trail records what happened but does not prevent or authorize a change. When improvement benefits feed management or external financial reporting, the control design must address access, authorization, review, and accountability. The MBB should partner with Finance rather than declare the estimates outside financial control. <b>C. Post-approval edits can bypass authorization and change reported totals, so access, approval, and change controls must be redesigned with Finance</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 9, Sarbanes-Oxley Act, pp. 143-146.</span>",
    "optionRationales": [
      "Traceability is detective evidence; it does not provide preventive authorization or independent approval.",
      "Operational estimates can enter financial reporting and therefore cannot be categorically excluded from control scope.",
      "Correct. The design permits an unauthorized value to alter a controlled aggregate after approval.",
      "A close-period restriction does not replace appropriate access, segregation, and approval controls."
    ],
    "formula": null,
    "assumptions": [
      "Finance has confirmed that the dashboard lies within the company’s financial-reporting control boundary.",
      "Project leaders are not delegated final financial-approval authority."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "Sarbanes-Oxley",
      "financial controls",
      "authorization",
      "audit trail",
      "benefit validation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 9 - Sarbanes-Oxley Act",
    "sourcePages": "143-146",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 9 - Organizational Finance and Business Performance Metrics",
        "section": "Sarbanes-Oxley Act",
        "pages": "143-146"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-030",
    "set": 2,
    "batch": 2,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "F. Risk Analysis of Projects and the Pipeline",
      "topic": "Risk-based pipeline governance and replenishment"
    },
    "difficulty": "Expert",
    "cognitive": "Create",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Multi-site industrial services",
    "quantitative": false,
    "stem": "A deployment office reviews only active projects. New charters are approved whenever a Belt becomes free; postponed projects retain their original scores indefinitely; and business units can reserve Belt capacity before Finance validates benefits. Which redesigned governance rule set would most improve the pipeline as a portfolio system?",
    "options": [
      "Let business units retain reserved capacity, but require a quarterly report of active-project cycle time and the number of unassigned ideas",
      "Maintain one visible active-and-inactive pipeline; periodically refresh value, risk, alignment, and capacity data; and use explicit decision rights to start, defer, support, or close work",
      "Give Finance sole authority to rank all ideas by validated hard savings, then assign every available Belt to the highest-ranked proposal regardless of strategic balance, readiness, dependencies, or concentration of risk",
      "Freeze prioritization criteria for the fiscal year, remove postponed work after ninety days, and measure deployment success by keeping every trained Belt utilized"
    ],
    "answer": 1,
    "why": "A healthy pipeline includes active, inactive, postponed, and proposed work and treats their economics and risks as time-sensitive. Regular reappraisal, capacity visibility, and explicit authority for start/defer/support/cancel decisions prevent stale priorities and local reservations from controlling the portfolio. Hard savings alone also miss strategy and dependencies. <b>B. Maintain one visible active-and-inactive pipeline; periodically refresh value, risk, alignment, and capacity data; and use explicit decision rights to start, defer, support, or close work</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 6, Risk Analysis of Projects and the Pipeline, pp. 88-99; Chapter 15, Performance Measurement, pp. 222-224.</span>",
    "optionRationales": [
      "Reporting activity does not remove capacity reservations, stale economics, or incomplete portfolio decision rights.",
      "Correct. It creates a governed, refreshable system for both pipeline and active work.",
      "Finance validation is necessary, but a savings-only rank can violate strategy, capacity, and dependency constraints.",
      "Utilization and arbitrary aging rules can encourage excess work in process and discard still-relevant opportunities."
    ],
    "formula": null,
    "assumptions": [
      "No proposal is legally mandatory.",
      "The deployment office can establish enterprise portfolio governance."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "project pipeline",
      "portfolio governance",
      "capacity management",
      "risk refresh",
      "decision rights"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 6 and 15 - Pipeline and Portfolio Performance",
    "sourcePages": "88-99, 222-224",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 6 - Risk Analysis of Projects and the Pipeline",
        "section": "Risk Management; Pipeline Creation and Management",
        "pages": "88-99"
      },
      {
        "id": "S2",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 15 - Project Management Infrastructure",
        "section": "Performance Measurement",
        "pages": "222-224"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-031",
    "set": 2,
    "batch": 2,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Cross-functional Competencies",
      "subdomain": "B. Internal Organizational Challenges",
      "topic": "Change management and adoption barriers"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Interactive visual evidence interpretation",
    "industry": "Healthcare administration",
    "quantitative": false,
    "stem": "After a health system replaced local referral workflows with one standardized process, formal training completion reached 96%. The plotted weekly rate of manual workarounds is shown below. Leaders propose disciplinary notices for noncompliance. What should the Master Black Belt recommend first?",
    "options": [
      "Treat the trend as adoption evidence, engage affected users and informal leaders to identify uncertainty and workflow barriers, then correct the change plan and monitor the rate",
      "Issue disciplinary notices immediately because training completion establishes that remaining workarounds reflect individual resistance rather than usability, workload, communication, or process conditions",
      "Return permanently to local workflows because the upward trend proves that standardization is incompatible with the organization’s culture",
      "Wait for the workaround rate to stabilize across another quarter before investigating, because change-management action during a developing trend would confound the process baseline and prevent objective diagnosis"
    ],
    "answer": 0,
    "why": "Training completion measures exposure, not internalization of a changed way of working. The sustained rise in workarounds is an early adoption signal that warrants open inquiry into fear, uncertainty, informal influence, and process barriers. Change agents should communicate, listen, engage informal leaders, remove obstacles, and continue measuring progress before choosing consequences. <b>A. Treat the trend as adoption evidence, engage affected users and informal leaders to identify uncertainty and workflow barriers, then correct the change plan and monitor the rate</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 8, Change Management, pp. 123-125.</span>",
    "optionRationales": [
      "Correct. It uses the observed behavior to diagnose and manage adoption rather than equating attendance with acceptance.",
      "Completion data do not establish motivation or rule out usability, workload, communication, and local-system barriers.",
      "The trend shows a problem to investigate, not that enterprise standardization is inherently impossible.",
      "Waiting would allow resistance or process failure to become entrenched; the trend is already actionable evidence."
    ],
    "formula": "Weekly workaround rate = manually routed referrals / total referrals × 100.",
    "assumptions": [
      "The denominator and workaround definition remained constant across weeks.",
      "No policy change independently increased manual routing."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "change management",
      "adoption",
      "informal leaders",
      "resistance",
      "leading indicator"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 8 - Change Management",
    "sourcePages": "123-125",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 8 - Organizational Commitment",
        "section": "Change Management",
        "pages": "123-125"
      }
    ],
    "chart": {
      "type": "time-series",
      "title": "Manual referral workarounds after rollout",
      "xLabel": "Week after rollout",
      "yLabel": "Workarounds per 100 referrals",
      "units": "workarounds per 100 referrals",
      "labels": [
        "W1",
        "W2",
        "W3",
        "W4",
        "W5",
        "W6",
        "W7",
        "W8",
        "W9",
        "W10",
        "W11",
        "W12"
      ],
      "data": [
        3,
        4,
        5,
        7,
        9,
        12,
        16,
        21,
        26,
        31,
        35,
        39
      ],
      "decimals": 0,
      "altText": "Weekly manual-referral rates per 100 referrals for weeks 1 through 12 are 3, 4, 5, 7, 9, 12, 16, 21, 26, 31, 35, and 39. The horizontal axis is time after rollout; the vertical axis is the stated rate.",
      "auditBatch": 2,
      "auditId": "mbb:set-2:original-031"
    },
    "visual": {
      "type": "time-series",
      "datasetRef": "test-bank-assets/mbb-160/batch-02/datasets.json#mbb:set-2:original-031",
      "specRef": "test-bank-assets/mbb-160/batch-02/visual-specs.json#mbb:set-2:original-031",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-02/static-fallbacks.html#mbb-set-2-original-031",
      "altText": "Weekly manual-referral rates per 100 referrals for weeks 1 through 12 are 3, 4, 5, 7, 9, 12, 16, 21, 26, 31, 35, and 39. The horizontal axis is time after rollout; the vertical axis is the stated rate.",
      "interactionPurpose": "Inspect each weekly value using pointer, keyboard focus, or the observation selector; the data table supplies the same evidence without interaction.",
      "validationRef": "test-bank-assets/mbb-160/batch-02/validation.json#mbb:set-2:original-031",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-032",
    "set": 2,
    "batch": 2,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Cross-functional Competencies",
      "subdomain": "B. Internal Organizational Challenges",
      "topic": "Situational use of leadership styles"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Aerospace engineering",
    "quantitative": false,
    "stem": "A highly competent, motivated engineering team has two weeks to reproduce a validated analysis for a regulatory response. The method and acceptance criteria are fixed, but execution speed has slipped because members are over-deliberating minor formatting choices. Which leadership response is most appropriate?",
    "options": [
      "Use a commanding style for the entire assignment and suppress discussion or escalation, because any fixed regulatory deadline converts the work into a continuing emergency that warrants total control",
      "Use a coaching style to rebuild the team’s technical competence through detailed instruction and remedial practice, even though the validated method and criteria have already been mastered",
      "Use a time-bounded pace-setting intervention with clear standards and frequent checks, while preserving escalation for evidence that threatens validity",
      "Use an affiliative style alone and remove performance checkpoints and explicit deadlines, because harmony and autonomy are the principal requirements for every competent and motivated technical team"
    ],
    "answer": 2,
    "why": "Leadership style should fit competence, commitment, and context. A competent, motivated team doing a known task can respond to a carefully bounded pace-setting intervention that raises execution tempo and clarifies standards. It should not silence validity concerns or become the permanent climate, because pace-setting can have negative effects when overused. <b>C. Use a time-bounded pace-setting intervention with clear standards and frequent checks, while preserving escalation for evidence that threatens validity</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 11, Leadership Styles, pp. 168-172.</span>",
    "optionRationales": [
      "A short deadline is not automatically a crisis, and sustained commanding behavior can damage the organizational climate.",
      "Coaching develops capability; the stated gap is execution focus rather than technical competence.",
      "Correct. The intervention fits a capable, motivated team and includes safeguards against misuse of pace-setting.",
      "Affiliation may support relationships but does not directly address the missed tempo or need for clear standards."
    ],
    "formula": null,
    "assumptions": [
      "The analysis method is already validated.",
      "The team has authority to escalate substantive evidence concerns."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "situational leadership",
      "pace-setting",
      "leadership style",
      "team competence",
      "organizational climate"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 11 - Leadership Styles",
    "sourcePages": "168-172",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 11 - Internal Organizational Challenges",
        "section": "Leadership Styles and Goleman Leadership Model",
        "pages": "168-172"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-033",
    "set": 2,
    "batch": 2,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Cross-functional Competencies",
      "subdomain": "B. Internal Organizational Challenges",
      "topic": "Interdepartmental conflict and interest-based bargaining"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Omnichannel retail",
    "quantitative": false,
    "stem": "E-commerce wants same-day order release; Fraud wants every high-value order held for manual review. Both directors defend their positions publicly, but their underlying interests are rapid customer confirmation, bounded fraud loss, and regulatory evidence. Which intervention is most defensible?",
    "options": [
      "Escalate both positions to the executive sponsor for a majority vote, then require the losing function to document compliance with the selected position",
      "Average the proposed hold times and pilot that compromise, because splitting the difference is the most neutral way to preserve both relationships",
      "Separate the directors and have each optimize its own metric until enough data exist to determine which department creates more enterprise value",
      "Reframe the conflict around shared interests and objective criteria, generate options such as risk-tiered review, and jointly test effects on speed, loss, and evidence"
    ],
    "answer": 3,
    "why": "Positions appear mutually exclusive, while the underlying interests are not. Interest-based bargaining separates people from the problem, clarifies interests, creates options for mutual gain, and uses objective criteria. A risk-tiered design can be tested against all three interests instead of forcing a political winner or an unprincipled midpoint. <b>D. Reframe the conflict around shared interests and objective criteria, generate options such as risk-tiered review, and jointly test effects on speed, loss, and evidence</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 11, Interdepartmental Conflicts, pp. 177-182.</span>",
    "optionRationales": [
      "Authority can end debate without resolving the interests, evidence, or future working relationship.",
      "A midpoint is a positional compromise and may satisfy none of the operational or regulatory criteria.",
      "Local optimization prolongs the conflict and can damage the enterprise outcome both functions serve.",
      "Correct. It converts positions into testable options judged against shared, objective interests."
    ],
    "formula": null,
    "assumptions": [
      "Risk-tier rules are legally permissible if their performance is validated.",
      "Both functions can participate in a controlled pilot."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "interdepartmental conflict",
      "interest-based bargaining",
      "objective criteria",
      "shared interests",
      "local optimization"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 11 - Interdepartmental Conflicts",
    "sourcePages": "177-182",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 11 - Internal Organizational Challenges",
        "section": "Interdepartmental Conflicts",
        "pages": "177-182"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-034",
    "set": 2,
    "batch": 2,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Cross-functional Competencies",
      "subdomain": "C. Executive and Team Leadership Roles",
      "topic": "Executive decision rights and compliant cross-region resource allocation"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Regional transportation",
    "quantitative": false,
    "stem": "Three regions share one validation laboratory. Regional champions may sequence routine work, but the deployment council retains decisions that move capital across regions or affect a mandatory regulatory deadline. A proposed portfolio reshuffle increases expected NPV but would miss Region A’s mandatory deadline. The MBB has validated the capacity model and prepared an external-capacity alternative that preserves the deadline. What should executive leadership do next?",
    "options": [
      "Delegate approval to the regional champions because they own the projects; use their majority preference to settle the deadline and capital implications before recording the decision",
      "Have the council assess the compliant alternatives against enterprise priorities, authorize the cross-region resource decision, and assign accountable owners while preserving the mandatory deadline",
      "Authorize the MBB to implement the highest-NPV reshuffle because the capacity model is validated; ask the council to ratify the missed deadline at its next portfolio review",
      "Require each region to keep its original schedule and divide laboratory time equally; defer the external-capacity decision until the regions demonstrate that they can agree"
    ],
    "answer": 1,
    "why": "Technical review and executive authorization are different responsibilities. The model establishes capacity consequences; the council must decide among compliant, feasible alternatives using enterprise priorities and its reserved capital authority. Maximizing NPV does not permit missing a mandatory regulatory deadline. Protected compliance, explicit decision rights, authorized resources, and named owners distinguish the defensible response from a vote, retrospective ratification, or arbitrary equal allocation. <b>B. Have the council assess the compliant alternatives against enterprise priorities, authorize the cross-region resource decision, and assign accountable owners while preserving the mandatory deadline</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 12, Executive Leadership Roles, pp. 183-190.</span>",
    "optionRationales": [
      "A regional majority cannot override the council’s reserved authority or a mandatory regulatory obligation.",
      "Correct. Executive governance evaluates feasible alternatives, protects mandatory obligations, authorizes resources, and assigns accountability.",
      "A validated model informs the decision but cannot authorize noncompliance or transfer executive decision rights to the analyst.",
      "Equal allocation is not an evidence-based resolution of the constrained schedule and delays an available authorized decision."
    ],
    "formula": null,
    "assumptions": [
      "The regulatory deadline is mandatory and no approved extension exists.",
      "The council holds the stated capital and portfolio authority; technical model validation does not delegate it to the MBB.",
      "The external-capacity alternative is feasible, compliant, and within the council’s authority to evaluate."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "executive decision rights",
      "regulatory deadline",
      "portfolio governance",
      "resource allocation",
      "delegation",
      "enterprise priorities"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 12 - Executive Leadership Roles",
    "sourcePages": "183-190",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 12 - Executive and Team Leadership Roles",
        "section": "Executive Leadership Roles",
        "pages": "183-190"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-035",
    "set": 2,
    "batch": 2,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Cross-functional Competencies",
      "subdomain": "C. Executive and Team Leadership Roles",
      "topic": "Leadership action plans for deployment roles and capability"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Integrated governance scenario",
    "industry": "Global food production",
    "quantitative": false,
    "stem": "A global company must choose a deployment operating model. Country A proposes central experts who own every project; Country B proposes part-time Belts selected locally with no common reviews; Country C proposes enterprise standards, regional portfolio councils, named champions and process owners, protected Belt capacity, role-based development, and common benefit validation. Which recommendation is most defensible?",
    "options": [
      "Adopt Country C, while defining decision rights and feedback loops that preserve enterprise consistency and allow regional portfolios to respond to local strategy",
      "Adopt Country A because central ownership eliminates the need for local process owners, regional governance, adaptation of projects to operating context, and formal feedback from the regions into enterprise deployment decisions",
      "Adopt Country B because local selection and part-time staffing maximize ownership even when training, review standards, benefit definitions, and strategic prioritization differ substantially across operating regions",
      "Combine central project ownership from A with voluntary review standards from B, because formal champions and protected capacity would slow deployment"
    ],
    "answer": 0,
    "why": "Country C contains the interacting elements of a deployable leadership system: standards, portfolio governance, explicit roles, resources, development, and comparable benefit controls. Adding clear decision rights and feedback loops avoids both rigid centralization and fragmented local optimization. The other models omit process ownership or common governance. <b>A. Adopt Country C, while defining decision rights and feedback loops that preserve enterprise consistency and allow regional portfolios to respond to local strategy</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 12, Leadership for Deployment, pp. 190-195; Chapter 7, Organizational Design, pp. 100-112.</span>",
    "optionRationales": [
      "Correct. It joins enterprise controls with regional strategy, ownership, capability, and learning.",
      "Central experts cannot sustainably replace the process owners who control day-to-day operating systems.",
      "Local ownership without common capability and governance makes portfolio and benefit comparisons unreliable.",
      "Voluntary controls and unprotected capacity recreate the principal weaknesses of the rejected models."
    ],
    "formula": null,
    "assumptions": [
      "Regions face meaningfully different strategic priorities.",
      "Enterprise Finance can support a common benefit-validation method."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "deployment action plan",
      "decision rights",
      "portfolio council",
      "role clarity",
      "global deployment"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 7 and 12 - Organizational Design and Leadership for Deployment",
    "sourcePages": "100-112, 190-195",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 12 - Executive and Team Leadership Roles",
        "section": "Leadership for Deployment",
        "pages": "190-195"
      },
      {
        "id": "S2",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 7 - Organizational Design",
        "section": "Organizational Systems, Structure, Maturity, and Culture",
        "pages": "100-112"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-036",
    "set": 2,
    "batch": 2,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Management",
      "subdomain": "A. Project Execution",
      "topic": "Risk-adjusted project prioritization under capacity and dependency constraints"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Interactive quantitative portfolio decision",
    "industry": "Property and casualty insurance",
    "quantitative": true,
    "stem": "For the scored decision, total available capacity is fixed at 12 FTE. Project A is mandatory and already committed. Optional projects are indivisible, and every stated dependency must be funded in the same portfolio. Under the screening assumptions shown below, which feasible portfolio has the greatest total expected net present value (NPV)? The capacity slider explores other scenarios; it does not change the scored 12-FTE case.",
    "options": [
      "Fund A and D; this uses only 8 FTE and produces an expected portfolio NPV of $2.20 million while deliberately preserving four FTE for later work",
      "Fund A and B; this uses 9 FTE and produces an expected portfolio NPV of $2.32 million without consuming any capacity for enabling Project C",
      "Fund A, C, and D; this uses 11 FTE and produces an expected portfolio NPV of $2.83 million while leaving one FTE available for support",
      "Fund A, C, and B; this uses all 12 FTE and produces an expected portfolio NPV of $2.95 million while satisfying B’s dependency"
    ],
    "answer": 3,
    "why": "At the fixed 12-FTE capacity, A consumes 4 FTE. The stated two-outcome model gives expected NPVs of A = 0.80×0.95 = 0.76, B = 2.40×0.65 = 1.56, C = 0.70×0.90 = 0.63, and D = 1.80×0.80 = 1.44 million. Feasible portfolios containing A are A (0.76), A+C (1.39), A+D (2.20), A+C+D (2.83), and A+C+B (2.95). B alone with A violates its dependency; funding all four needs 16 FTE. A+C+B is the unique optimum. Linearity of expectation, not independence of project outcomes, justifies the additive expected values under the stated assumptions. <b>D. Fund A, C, and B; this uses all 12 FTE and produces an expected portfolio NPV of $2.95 million while satisfying B’s dependency</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 13, Project Prioritization, pp. 196-201; Chapter 16, Budgets and Forecasts, pp. 225-232.</span>",
    "optionRationales": [
      "A plus D is feasible, but it leaves value and capacity unused relative to other feasible combinations.",
      "B without enabling project C violates the stated dependency and is therefore not a feasible portfolio.",
      "A plus C plus D is feasible, but its adjusted value of $2.83 million is lower than the best feasible set.",
      "Correct. It satisfies capacity, mandatory-work, and dependency constraints and maximizes adjusted NPV."
    ],
    "formula": "E[NPV_i] = p_i × NPV_i + (1−p_i) × 0; sum expected NPVs subject to capacity 12 FTE, mandatory A, and B requiring C.",
    "assumptions": [
      "This simplified two-outcome screening model assigns each project the stated net NPV if realized and zero net NPV otherwise; all project costs are already included.",
      "Each probability is the marginal realization probability when that project and its stated prerequisites are funded. Do not multiply B’s probability by C’s again.",
      "NPVs share a valuation date and are additive without overlapping benefits. Independence of realization events is not required to add expected NPVs.",
      "Partial funding produces no benefit. FTE demands are simultaneous peak requirements. Every funded prerequisite is included in capacity and value totals."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "portfolio optimization",
      "expected NPV",
      "capacity constraint",
      "project dependency",
      "prioritization"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 13 and 16 - Project Prioritization and Budgets and Forecasts",
    "sourcePages": "196-201, 225-232",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapters 13 and 16",
        "section": "Project Prioritization; Budgets and Forecasts",
        "pages": "196-201, 225-232"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Project",
        "NPV if realized ($M)",
        "Realization probability",
        "FTE required",
        "Constraint"
      ],
      "rows": [
        [
          "A - Regulatory traceability",
          "0.80",
          "0.95",
          "4",
          "Mandatory"
        ],
        [
          "B - Claims automation",
          "2.40",
          "0.65",
          "5",
          "Requires C"
        ],
        [
          "C - Data foundation",
          "0.70",
          "0.90",
          "3",
          "None"
        ],
        [
          "D - Retention workflow",
          "1.80",
          "0.80",
          "4",
          "None"
        ]
      ],
      "whatIf": {
        "id": "mbb-q036-capacity",
        "label": "Total available capacity",
        "min": 8,
        "max": 16,
        "step": 1,
        "value": 12,
        "unit": "FTE",
        "committed": 4,
        "committedLabel": "mandatory Project A"
      },
      "auditBatch": 2,
      "auditId": "mbb:set-2:original-036",
      "altText": "A four-project portfolio table gives NPV, realization probability, FTE requirement, and constraints. Project A is mandatory at 4 FTE, Project B requires C, and the capacity slider ranges from 8 through 16 FTE with a default of 12.",
      "title": "Portfolio candidates — scored capacity: 12 FTE"
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-02/datasets.json#mbb:set-2:original-036",
      "specRef": "test-bank-assets/mbb-160/batch-02/visual-specs.json#mbb:set-2:original-036",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-02/static-fallbacks.html#mbb-set-2-original-036",
      "altText": "A four-project portfolio table gives NPV, realization probability, FTE requirement, and constraints. Project A is mandatory at 4 FTE, Project B requires C, and the capacity slider ranges from 8 through 16 FTE with a default of 12.",
      "interactionPurpose": "Move the capacity slider to 12 FTE, verify that 8 FTE remain after mandatory Project A, and compare feasible dependency-respecting portfolios.",
      "validationRef": "test-bank-assets/mbb-160/batch-02/validation.json#mbb:set-2:original-036",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-037",
    "set": 2,
    "batch": 2,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Management",
      "subdomain": "B. Project Oversight and Management",
      "topic": "Earned-value measurement and corrective action"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Multi-step quantitative",
    "industry": "Pharmaceutical operations",
    "quantitative": true,
    "stem": "At a validation-program review, planned value is $600,000, earned value is $480,000, and actual cost is $540,000. The remaining work has not been re-estimated. Which interpretation and next governance action are most defensible?",
    "options": [
      "SPI = 1.25 and CPI = 1.13; the program is ahead and under budget, so the remaining baseline should be released as management reserve",
      "SPI = 0.80 and CPI = 0.89; the program is behind and over cost for work performed, so causes and a defensible estimate at completion should be reviewed",
      "Schedule variance is negative $60,000 and cost variance is negative $120,000; cost is therefore the larger issue",
      "Percent complete is 80% because earned value is 80% of planned value; therefore only 20% of the total authorized work remains"
    ],
    "answer": 1,
    "why": "SPI = EV/PV = 480/600 = 0.80, indicating less work was earned than planned. CPI = EV/AC = 480/540 = 0.889, indicating the work performed cost more than its budgeted value. These indices diagnose current performance but do not by themselves establish the remaining estimate, so management should investigate causes and produce a supportable forecast. <b>B. SPI = 0.80 and CPI = 0.89; the program is behind and over cost for work performed, so causes and a defensible estimate at completion should be reviewed</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 14, Project Measurement and Monitoring, pp. 211-216.</span>",
    "optionRationales": [
      "The ratios are inverted; EV divided by PV and AC gives values below one.",
      "Correct. It calculates both indices properly and avoids inventing a completion forecast.",
      "Schedule variance is EV minus PV, or negative $120,000; cost variance is EV minus AC, or negative $60,000.",
      "EV divided by current PV is a schedule index, not percent of the total budgeted scope completed."
    ],
    "formula": "SPI = EV/PV = 480/600 = 0.80; CPI = EV/AC = 480/540 = 0.889; SV = EV-PV = -120; CV = EV-AC = -60 ($000).",
    "assumptions": [
      "Earned-value rules and the performance baseline are valid.",
      "No approved scope change is awaiting baseline incorporation."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "earned value",
      "schedule performance index",
      "cost performance index",
      "forecast",
      "project monitoring"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 14 - Measurement and Monitoring",
    "sourcePages": "211-216",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Measurement; Monitoring",
        "pages": "211-216"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-038",
    "set": 2,
    "batch": 2,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Management",
      "subdomain": "B. Project Oversight and Management",
      "topic": "Risk assessment and response planning"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Supply chain technology",
    "quantitative": false,
    "stem": "A warehouse-control project identifies a possible interface failure with severe operational impact. The reference matrix classifies that combination as high risk. The vendor can provide a production-like interface test during the next sprint for a modest cost. Which response is most appropriate?",
    "options": [
      "Accept the possible risk, record its owner, and reserve interface testing for the final deployment rehearsal",
      "Transfer the risk by adding a warranty clause, because contractual recovery prevents operational disruption if the interface fails",
      "Classify as High; test early under production-like conditions, remediate failures, verify acceptance criteria, and retain a contingency with an owner",
      "Avoid the risk by removing every external interface from scope, even if the resulting warehouse system cannot deliver the chartered outcome"
    ],
    "answer": 2,
    "why": "The Severe-impact/Possible-likelihood intersection is High under this organization’s matrix. The comparatively modest cost of early production-like testing supports action before deployment. Testing alone does not repair a defect or guarantee lower operational risk: failures must be remediated, acceptance criteria verified, and residual exposure governed by a contingency and accountable owner. Low purchase cost does not turn a severe operational consequence into low risk. <b>C. Classify as High; test early under production-like conditions, remediate failures, verify acceptance criteria, and retain a contingency with an owner</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 6, Risk Management, pp. 88-94; Chapter 14, Project Management Principles, pp. 202-211.</span>",
    "optionRationales": [
      "Possible likelihood combined with severe impact is high, and late testing wastes a practical mitigation opportunity.",
      "A warranty may shift cost but does not transfer operational continuity or customer consequences.",
      "Correct. The matrix locates a High risk; testing informs remediation, while verified acceptance and an owned contingency address residual exposure.",
      "Risk avoidance is not defensible when it removes the capability that justifies the project."
    ],
    "formula": null,
    "assumptions": [
      "The matrix is the approved project risk-classification rule.",
      "The production-like test is representative and does not itself create unacceptable risk."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "risk matrix",
      "risk mitigation",
      "contingency",
      "residual risk",
      "interface testing"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 6 and 14 - Risk Management and Project Oversight",
    "sourcePages": "88-94, 202-211",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 6 - Risk Analysis of Projects and the Pipeline",
        "section": "Risk Management",
        "pages": "88-94"
      },
      {
        "id": "S2",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Project Management Principles",
        "pages": "202-211"
      }
    ],
    "chart": {
      "type": "risk-matrix",
      "rowAxis": "Operational impact",
      "colAxis": "Likelihood",
      "rows": [
        "Severe",
        "Moderate",
        "Low"
      ],
      "cols": [
        "Rare",
        "Possible",
        "Likely"
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
      "auditBatch": 2,
      "auditId": "mbb:set-2:original-038",
      "altText": "A three-by-three risk matrix has impact rows Severe, Moderate, and Low and likelihood columns Rare, Possible, and Likely. Row entries are Medium/High/High, Low/Medium/High, and Low/Low/Medium, respectively. No cell is singled out."
    },
    "visual": {
      "type": "risk-matrix",
      "datasetRef": "test-bank-assets/mbb-160/batch-02/datasets.json#mbb:set-2:original-038",
      "specRef": "test-bank-assets/mbb-160/batch-02/visual-specs.json#mbb:set-2:original-038",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-02/static-fallbacks.html#mbb-set-2-original-038",
      "altText": "A three-by-three risk matrix has impact rows Severe, Moderate, and Low and likelihood columns Rare, Possible, and Likely. Row entries are Medium/High/High, Low/Medium/High, and Low/Low/Medium, respectively. No cell is singled out.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-02/validation.json#mbb:set-2:original-038",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-039",
    "set": 2,
    "batch": 2,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Management",
      "subdomain": "C. Project Management Infrastructure",
      "topic": "Portfolio review, project closure, and resource reallocation"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Integrated governance scenario",
    "industry": "Telecommunications",
    "quantitative": false,
    "stem": "A network-optimization project has spent 70% of its budget. A strategy refresh eliminates the target service, the benefits forecast is now negative, and the specialized analysts are blocking two higher-priority regulatory projects. The sponsor argues that stopping would waste the sunk cost. What should the portfolio council do?",
    "options": [
      "Close the project through the formal process, document results and lessons, update the portfolio record, and reallocate analysts based on current strategy and value",
      "Continue through at least two more tollgates because passing a budget-consumption threshold creates an obligation to recover the original business case before scarce resources can move to newer regulatory priorities",
      "Suspend the project without formal closure until the target service returns, while leaving its original priority, benefit estimate, governance status, and analyst reservations unchanged in the enterprise pipeline",
      "Reduce quality requirements enough to complete within the remaining budget, because a delivered output is preferable to a strategically obsolete cancellation"
    ],
    "answer": 0,
    "why": "Sunk cost is not a reason to fund negative future value. Regular portfolio governance must refresh strategic alignment, economics, and resource constraints and may cancel active projects. Formal closure preserves results, approvals, accounts, and lessons learned before scarce analysts are reassigned. <b>A. Close the project through the formal process, document results and lessons, update the portfolio record, and reallocate analysts based on current strategy and value</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 14, Closing Process, pp. 211-212; Chapter 15, Performance Measurement, pp. 222-224.</span>",
    "optionRationales": [
      "Correct. It applies current portfolio criteria and preserves organizational learning through controlled closure.",
      "Budget already spent is sunk; it does not restore strategic relevance or positive prospective value.",
      "Indefinite suspension retains stale priority and capacity claims while avoiding the required governance decision.",
      "Lowering quality cannot create strategic value and may add operational or compliance exposure."
    ],
    "formula": null,
    "assumptions": [
      "No contractual obligation requires completion.",
      "The negative forecast excludes sunk cost and reflects prospective cash flows."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "project closure",
      "sunk cost",
      "portfolio review",
      "resource reallocation",
      "strategic alignment"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 14 and 15 - Closing Process and Performance Measurement",
    "sourcePages": "211-212, 222-224",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Closing Process",
        "pages": "211-212"
      },
      {
        "id": "S2",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 15 - Project Management Infrastructure",
        "section": "Performance Measurement",
        "pages": "222-224"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-040",
    "set": 2,
    "batch": 2,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "B. Training Plans",
      "topic": "Multilevel competency planning by target group"
    },
    "difficulty": "Very Hard",
    "cognitive": "Create",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Precision manufacturing",
    "quantitative": false,
    "stem": "The mastery grid shows required end-state competencies. All groups currently meet Entry. The training director proposes one identical five-day statistics course for everyone. Which redesign best closes the specified gaps without making the curriculum one-size-fits-all?",
    "options": [
      "Keep the common course but add a harder final exam for Belts, because assessment difficulty alone differentiates the competency required by each role while preserving one administratively consistent path across every site",
      "Map each required grid cell to role-specific modules, practice, and assessment at its stated level; omit unrequired cells and retain distinct sponsor, Belt, and metrology pathways",
      "Train only metrology staff because they own the measurement system, then have them approve every analysis produced by sponsors and Belts and transfer the needed knowledge through mandatory sign-off meetings",
      "Move every group to Expert in every skill so future role changes require no additional development, all learners can attend the same advanced modules, and one proficiency target governs the organization"
    ],
    "answer": 1,
    "why": "The grid, not a common course or a desired answer, defines the requirements. Sponsors need Beginner interpretation and Practitioner risk communication. Belts need Practitioner interpretation, planning coaching, and risk communication, but Beginner administration of diagnostic studies. Metrology needs Expert interpretation, planning coaching, and diagnostic administration, but Beginner risk communication. A valid plan develops and assesses all ten required cells at those exact levels. Entry is the starting level; unrequired cells are not training gaps. <b>B. Map each required grid cell to role-specific modules, practice, and assessment at its stated level; omit unrequired cells and retain distinct sponsor, Belt, and metrology pathways</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 18, Training Plans and Mastery Grids, pp. 245-251.</span>",
    "optionRationales": [
      "A harder test does not supply different learning experiences or demonstrate role-specific applied capability.",
      "Correct. It explicitly develops and assesses every target-group gap at the proficiency shown in the grid.",
      "Measurement ownership does not eliminate sponsor and Belt responsibilities for decisions and proper application.",
      "Universal expert training spends resources beyond the stated needs and still ignores role-specific application."
    ],
    "formula": null,
    "assumptions": [
      "Entry is the verified current level for every listed group and skill.",
      "Entry, Beginner, Practitioner, and Expert are ordered proficiency categories, not equally spaced numerical scores.",
      "An em dash (—) means no target is required for that group and skill."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "training plan",
      "mastery grid",
      "target group",
      "multilevel competency",
      "modular curriculum"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 18 - Training Plans",
    "sourcePages": "245-251",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 18 - Training Plans",
        "section": "Components and Application of the Training Plan",
        "pages": "245-251"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Skill",
        "Sponsors target",
        "Belts target",
        "Metrology target"
      ],
      "rows": [
        [
          "Interpret MSA decisions",
          "Beginner",
          "Practitioner",
          "Expert"
        ],
        [
          "Coach study planning",
          "—",
          "Practitioner",
          "Expert"
        ],
        [
          "Administer diagnostic studies",
          "—",
          "Beginner",
          "Expert"
        ],
        [
          "Communicate business risk",
          "Practitioner",
          "Practitioner",
          "Beginner"
        ]
      ],
      "auditBatch": 2,
      "auditId": "mbb:set-2:original-040",
      "altText": "A four-skill mastery grid gives separate target levels for sponsors, Belts, and metrology. Cells contain Beginner, Practitioner, Expert, or an em dash for no requirement. The full semantic table preserves all ten required role-skill targets.",
      "title": "Required end-state competency by role"
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-02/datasets.json#mbb:set-2:original-040",
      "specRef": "test-bank-assets/mbb-160/batch-02/visual-specs.json#mbb:set-2:original-040",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-02/static-fallbacks.html#mbb-set-2-original-040",
      "altText": "A four-skill mastery grid gives separate target levels for sponsors, Belts, and metrology. Cells contain Beginner, Practitioner, Expert, or an em dash for no requirement. The full semantic table preserves all ten required role-skill targets.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-02/validation.json#mbb:set-2:original-040",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-041",
    "set": 2,
    "batch": 2,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "C. Training Materials and Curriculum Development",
      "topic": "Adult-learning-aligned material and delivery selection"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Business-to-business services",
    "quantitative": false,
    "stem": "Experienced account managers must learn to translate customer narratives into measurable CTQs. A vendor offers four designs with the same content coverage. Which design is most consistent with adult learning and transfer to the job?",
    "options": [
      "A lecture that defines every term in taxonomy order, followed by a closed-book recall test one month later and no workplace application",
      "A self-paced glossary with optional reading, because experienced adults learn best when the instructor avoids feedback and structured practice",
      "A generic simulation from an unrelated industry, scored only on participation so prior experience cannot affect the assessment outcome",
      "A brief concept model followed by authentic customer cases, learner choice among cases, coached practice, feedback, reflection, and a near-term workplace assignment"
    ],
    "answer": 3,
    "why": "Adult learners bring relevant experience, value practical and problem-centered work, benefit from participation and self-direction, and need prompt opportunities to apply and receive feedback. The authentic-case design uses those characteristics while retaining structure and evidence of transfer. Recall-only or participation-only designs do not demonstrate performance. <b>D. A brief concept model followed by authentic customer cases, learner choice among cases, coached practice, feedback, reflection, and a near-term workplace assignment</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 19, Adult Learning Theory and Training Delivery, pp. 256-283.</span>",
    "optionRationales": [
      "Taxonomy-order lecture and delayed recall underuse experience and provide weak evidence of workplace transfer.",
      "Self-direction does not mean absence of guided practice, feedback, standards, or assessment.",
      "An unrelated exercise and participation score weaken relevance and cannot verify CTQ translation skill.",
      "Correct. It combines relevance, experience, choice, practice, feedback, reflection, and immediate application."
    ],
    "formula": null,
    "assumptions": [
      "The account managers already know their customer domains.",
      "The workplace assignment can be reviewed without exposing confidential customer data."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "adult learning",
      "experiential learning",
      "transfer",
      "authentic practice",
      "feedback"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 19 - Adult Learning Theory and Training Delivery",
    "sourcePages": "256-283",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 19 - Training Materials and Curriculum Development",
        "section": "Adult Learning Theory; Training Delivery",
        "pages": "256-283"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-042",
    "set": 2,
    "batch": 2,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "D. Training Effectiveness Evaluation",
      "topic": "Multilevel evaluation and validation of training effects"
    },
    "difficulty": "Expert",
    "cognitive": "Create",
    "questionType": "Integrated governance scenario",
    "industry": "Hospital laboratory network",
    "quantitative": false,
    "stem": "A laboratory network is training supervisors to coach specimen-handling standard work. Leaders want credible evidence that the program improves performance rather than merely generating favorable class ratings. Which evaluation design is strongest?",
    "options": [
      "Collect anonymous reaction ratings after class and treat an average above 4.5 as proof that coaching behavior and specimen quality improved in subsequent workplace practice",
      "Administer a difficult final knowledge test and compare sites by pass rate, without measuring baseline skill, workplace behavior, or operational outcomes",
      "Predefine objectives; measure reaction and pre/post learning; audit coached behavior after transfer; track specimen defects; and use phased rollout or comparison evidence to address rival causes",
      "Track specimen defects for one quarter after training and attribute the full observed change to training because operational results automatically subsume reaction, learning, behavior, baseline differences, secular trends, and every concurrent improvement"
    ],
    "answer": 2,
    "why": "A credible evaluation is built from predefined objectives and tests multiple links in the causal chain: reaction, acquired learning, transferred behavior, and organizational results. Baselines and phased or comparison evidence help distinguish training effects from concurrent operational changes. No single level proves all others. <b>C. Predefine objectives; measure reaction and pre/post learning; audit coached behavior after transfer; track specimen defects; and use phased rollout or comparison evidence to address rival causes</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 20, Training Effectiveness Evaluation, pp. 285-292.</span>",
    "optionRationales": [
      "Reaction indicates learner perception and cannot establish learning, behavior change, or quality results.",
      "Post-only knowledge scores omit the baseline, transfer behavior, and organizational performance.",
      "Correct. It links objectives to multiple evaluation levels and strengthens attribution with comparative evidence.",
      "Outcome movement may reflect staffing, workload, materials, or policy changes and does not verify the learning pathway."
    ],
    "formula": null,
    "assumptions": [
      "A phased rollout or comparable untreated period is operationally and ethically feasible.",
      "Specimen-defect definitions remain stable during evaluation."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "Kirkpatrick",
      "training evaluation",
      "learning transfer",
      "behavior",
      "results attribution"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 20 - Training Effectiveness Evaluation",
    "sourcePages": "285-292",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 20 - Training Effectiveness Evaluation",
        "section": "Validation and Evaluation Models; Kirkpatrick Model",
        "pages": "285-292"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-043",
    "set": 2,
    "batch": 2,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Mentoring Responsibilities",
      "subdomain": "A. Mentoring Champions, Change Agents, and Executives",
      "topic": "Champion and MBB responsibilities during tollgate reviews"
    },
    "difficulty": "Hard",
    "cognitive": "Understand",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Consumer lending",
    "quantitative": false,
    "stem": "At an Analyze tollgate, the champion asks the team to decide whether the project still supports the current enterprise strategy and asks the MBB to remove a policy barrier owned by another executive. Which role correction is most appropriate?",
    "options": [
      "The team should make both decisions because tollgates transfer strategic and organizational authority to the people closest to the analysis and implementation evidence",
      "The champion should own the strategic-alignment judgment and barrier escalation, while the MBB coaches an objective review of evidence and readiness",
      "The MBB should make both decisions because technical coaching authority includes final control over enterprise strategy, executive resources, cross-functional policy, and sponsor accountability",
      "Finance should decide alignment and remove the barrier because every Analyze tollgate requires Finance to replace the champion as decision maker"
    ],
    "answer": 1,
    "why": "The team supplies evidence, but the champion is positioned to determine whether the project remains strategically aligned and to remove organizational barriers. The MBB supports the tollgate’s quality by coaching preparation, testing evidence, and advising on readiness without appropriating executive accountability. <b>B. The champion should own the strategic-alignment judgment and barrier escalation, while the MBB coaches an objective review of evidence and readiness</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 21, Tollgate Reviews, pp. 294-298.</span>",
    "optionRationales": [
      "Proximity to analysis does not give the team authority over enterprise strategy or executive policy.",
      "Correct. It preserves champion accountability and the MBB’s evidence-focused coaching role.",
      "Technical authority and facilitation do not confer ownership of strategy or executive resource barriers.",
      "Finance may validate benefits at selected gates but does not categorically replace the champion."
    ],
    "formula": null,
    "assumptions": [
      "The champion has access to the current strategy and relevant executives.",
      "The MBB has no delegated policy authority."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "tollgate review",
      "champion",
      "strategic alignment",
      "barrier removal",
      "MBB coaching"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 21 - Tollgate Reviews",
    "sourcePages": "294-298",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 21 - Mentoring Champions, Change Agents, and Executives",
        "section": "Tollgate Reviews",
        "pages": "294-298"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-044",
    "set": 2,
    "batch": 2,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Mentoring Responsibilities",
      "subdomain": "B. Mentoring Black Belts and Green Belts",
      "topic": "Distinguishing project coaching from career mentoring"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Energy generation",
    "quantitative": false,
    "stem": "A Black Belt needs immediate help selecting a valid sampling plan for an active project and also wants confidential guidance about moving into an operations-leadership role next year. The assigned MBB knows the project but participates in the promotion panel. What arrangement is most defensible?",
    "options": [
      "Have the MBB coach the project decision, disclose and manage the promotion conflict, and arrange an independent career mentor for the longer-term discussion",
      "Have the MBB provide both services privately because detailed knowledge of the project makes the MBB the most informed person to evaluate readiness, career options, and the confidential promotion path",
      "Transfer all technical coaching to the line manager and let the MBB mentor the career decision confidentially, because technical coaching must never be provided by a senior Belt who sits on any review panel",
      "Defer both discussions until the project closes and the promotion panel finishes its work, so technical performance, sampling decisions, career planning, and advancement cannot influence one another in any way"
    ],
    "answer": 0,
    "why": "Coaching focuses on applied Belt performance and project progress, while mentoring addresses broader career navigation. The MBB can coach the sampling decision, but participation in the promotion panel creates a conflict for confidential career mentoring. Disclosure and an independent mentor preserve both functions without withholding timely project support. <b>A. Have the MBB coach the project decision, disclose and manage the promotion conflict, and arrange an independent career mentor for the longer-term discussion</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 22, Coaching and Mentoring, pp. 306-310.</span> <span class=\"tb-source-ref\">Additional authority for disclosure and independence: ASQ, Code of Ethics, conflicts-of-interest provision (online; https://asq.org/about-asq/conferences-events-policies/code-of-ethics).</span>",
    "optionRationales": [
      "Correct. It separates immediate role coaching from conflicted career mentoring while maintaining needed support.",
      "Project knowledge does not neutralize the promotion-panel conflict or protect confidential career exploration.",
      "Senior Belts are expected to coach technical application; the line manager is not automatically the proper substitute.",
      "Deferral unnecessarily exposes the active project and denies timely career support that can be arranged independently."
    ],
    "formula": null,
    "assumptions": [
      "An independent qualified mentor is available.",
      "The promotion process permits disclosure and recusal where appropriate."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "coaching",
      "mentoring",
      "conflict of interest",
      "career development",
      "technical guidance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 22 - Coaching and Mentoring",
    "sourcePages": "306-310",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 22 - Mentoring Black Belts and Green Belts",
        "section": "Individuals; Coaching; Mentoring",
        "pages": "306-310"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-045",
    "set": 2,
    "batch": 2,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Mentoring Responsibilities",
      "subdomain": "C. Mentoring Non-belt Employees",
      "topic": "Development pathway for non-belt participants"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Municipal government",
    "quantitative": false,
    "stem": "A city wants to replenish its Green Belt pipeline from non-belt employees who have served on improvement teams. Current outreach is a generic intranet page; selection criteria are unpublished; and executives seeking Green Belt qualification receive shortened training with no project requirement. Which proposed development pathway should the MBB select?",
    "options": [
      "Keep the intranet page as the sole channel and nominate candidates privately, because publishing criteria could discourage employees who lack statistical backgrounds",
      "Offer every employee the full Green Belt course immediately and award status on attendance, then use later project results to identify who was actually qualified",
      "Publish role and selection expectations, add active awareness and targeted outreach, provide staged skill-building and project exposure, and apply equivalent qualification standards to leaders",
      "Recruit only prior team leaders and exempt executives from project work, because visible leadership credentials are more important than consistent development requirements"
    ],
    "answer": 2,
    "why": "A sustainable Belt pipeline needs accessible information, active outreach, transparent expectations, staged development, and authentic project experience. Equivalent qualification standards apply to executives who seek Green Belt status. Sponsor-awareness training serves a different role and need not include Belt qualification requirements. Lowering the qualification standard for executives seeking the same credential undermines its credibility. The selected pathway develops evidence of readiness before formal Belt selection. <b>C. Publish role and selection expectations, add active awareness and targeted outreach, provide staged skill-building and project exposure, and apply equivalent qualification standards to leaders</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 23, Mentoring Non-belt Employees, pp. 315-316.</span>",
    "optionRationales": [
      "Passive information and hidden criteria limit access, succession, trust, and self-directed preparation.",
      "Attendance-based credentials dilute qualification and place unprepared candidates into costly formal training.",
      "Correct. It combines transparent information, active recruitment, development, experience, and consistent standards.",
      "Prior leadership is not the only source of Belt potential, and executive exemptions undermine credibility."
    ],
    "formula": null,
    "assumptions": [
      "The city can provide supervised project participation before formal Belt assignment.",
      "Published criteria comply with employment policy."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "non-belt development",
      "Green Belt pipeline",
      "recruitment",
      "qualification standards",
      "awareness"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 23 - Mentoring Non-belt Employees",
    "sourcePages": "315-316",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 23 - Mentoring Non-belt Employees",
        "section": "Awareness, Information, Recruitment, and Executive Development",
        "pages": "315-316"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-046",
    "set": 2,
    "batch": 2,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. Measurement Systems Analysis",
      "topic": "Attribute agreement analysis and corrective action"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual statistical-output interpretation",
    "industry": "Food safety inspection",
    "quantitative": false,
    "stem": "Three inspectors classified the same 50 reference images twice as Accept or Reject, in separately randomized, blinded trials. Within-inspector agreement is the number of images given the same label in both trials divided by 50. Reference agreement is the number of correct individual ratings across both trials divided by 100. The organization’s screening rule requires each inspector’s point estimates to be at least 90% on both measures. Which action is most defensible?",
    "options": [
      "Approve all inspectors because overall repeatability exceeds 90%, then increase the number and diversity of reference images to improve individual accuracy without changing operational definitions or calibration",
      "Replace Inspector C because a stronger agreement with the reference indicates that C applied a different decision rule from the other inspectors",
      "Pool the three reference-agreement rates and approve the system because the resulting 87.3% is close enough to the 90% requirement",
      "Do not approve the system; calibrate A and B to operational definitions with reference examples, then repeat a blinded agreement study for all inspectors"
    ],
    "answer": 3,
    "why": "The rule is inspector-specific, not a pooled-average allowance. All three inspectors exceed 90% within-inspector agreement. A and B miss the reference threshold at 82% and 83%; C passes at 97%. Their disagreements warrant investigation of operational definitions, calibration, image conditions, and coding; the summary alone does not prove a single cause. Calibrate with reference examples and repeat a blinded study for everyone rather than assuming remediation worked. The pooled reference rate is 262/300 = 87.3%, but even a passing pooled rate could not override an individual failure. These are the stipulated point-estimate screening decisions, not confidence-bound acceptance decisions. <b>D. Do not approve the system; calibrate A and B to operational definitions with reference examples, then repeat a blinded agreement study for all inspectors</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 24, Attribute Measurement Systems, pp. 320-334.</span>",
    "optionRationales": [
      "An overall average can conceal inspector-specific failures, and a larger sample does not correct systematic interpretation error.",
      "C is the only inspector meeting both stated criteria; superior reference agreement is not evidence of an invalid rule.",
      "The requirement is not an average threshold, and 88% would remain below 90% even if averaging were permitted.",
      "Correct. It targets the low reference accuracy while requiring independent verification after correction."
    ],
    "formula": "Within-inspector agreement is repeated self-agreement; agreement with reference is correct classifications divided by reference classifications.",
    "assumptions": [
      "Reference classifications are valid and mutually exclusive; ratings were blinded and randomized separately for each trial.",
      "The stated screening rule uses point estimates, not confidence bounds. Passing it is not proof that population agreement exceeds 90%."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "attribute agreement",
      "repeatability",
      "reference accuracy",
      "operational definition",
      "measurement system"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 24 - Attribute Measurement Systems",
    "sourcePages": "320-334",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 24 - Measurement Systems Analysis",
        "section": "Attribute (Discrete) Measurement Systems",
        "pages": "320-334"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Inspector",
        "Within-inspector agreement",
        "Agreement with reference"
      ],
      "rows": [
        [
          "A",
          "48/50 = 96%",
          "82/100 = 82%"
        ],
        [
          "B",
          "47/50 = 94%",
          "83/100 = 83%"
        ],
        [
          "C",
          "49/50 = 98%",
          "97/100 = 97%"
        ],
        [
          "Overall",
          "144/150 = 96%",
          "262/300 ≈ 87.3%"
        ]
      ],
      "studyCounts": [
        {
          "inspector": "A",
          "bothCorrect": 40,
          "bothWrong": 8,
          "disagree": 2
        },
        {
          "inspector": "B",
          "bothCorrect": 40,
          "bothWrong": 7,
          "disagree": 3
        },
        {
          "inspector": "C",
          "bothCorrect": 48,
          "bothWrong": 1,
          "disagree": 1
        }
      ],
      "auditBatch": 2,
      "auditId": "mbb:set-2:original-046",
      "altText": "For inspectors A, B, and C, within-inspector agreement is 48 of 50, 47 of 50, and 49 of 50 image pairs. Reference agreement across 100 individual ratings per inspector is 82, 83, and 97 correct ratings. The table contains counts and rates, not pass/fail labels.",
      "title": "Blinded attribute-agreement study"
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-02/datasets.json#mbb:set-2:original-046",
      "specRef": "test-bank-assets/mbb-160/batch-02/visual-specs.json#mbb:set-2:original-046",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-02/static-fallbacks.html#mbb-set-2-original-046",
      "altText": "For inspectors A, B, and C, within-inspector agreement is 48 of 50, 47 of 50, and 49 of 50 image pairs. Reference agreement across 100 individual ratings per inspector is 82, 83, and 97 correct ratings. The table contains counts and rates, not pass/fail labels.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-02/validation.json#mbb:set-2:original-046",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-047",
    "set": 2,
    "batch": 2,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Multiple regression and variance inflation factors"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Statistical-output interpretation",
    "industry": "Chemical processing",
    "quantitative": false,
    "stem": "A yield model has R-squared 91% and adjusted R-squared 89%. Temperature has VIF 12.8 and p = 0.41; pressure has VIF 11.9 and p = 0.36; line speed has VIF 1.7 and p < 0.001. Temperature and pressure are strongly correlated by the operating recipe. What should the analyst conclude?",
    "options": [
      "The high R-squared proves all three coefficients are stable and causal, so temperature and pressure should remain separately interpreted despite their p-values, inflated uncertainty, and recipe-driven correlation structure",
      "Temperature and pressure coefficients are unstable for separate interpretation; use process knowledge to redesign, combine, or select terms while validating prediction and residual behavior",
      "Line speed must be removed first because its low VIF shows that it contributes too little shared information to a multiple-regression model",
      "The model is unusable for prediction and must be discarded without further validation because any VIF above 10 necessarily makes fitted values, residual diagnostics, and all future predictions mathematically invalid"
    ],
    "answer": 1,
    "why": "Large VIFs indicate that temperature and pressure carry overlapping predictor information, inflating coefficient uncertainty and making their individual effects difficult to interpret. Multicollinearity does not automatically destroy prediction. The response should follow the model purpose and process physics: redesign the data region, combine terms, or select a defensible representation, then validate predictions and residuals. <b>B. Temperature and pressure coefficients are unstable for separate interpretation; use process knowledge to redesign, combine, or select terms while validating prediction and residual behavior</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 25, Multiple Regression and Multicollinearity, pp. 374-383.</span>",
    "optionRationales": [
      "Overall fit does not establish causal or stable individual coefficients when predictors are highly collinear.",
      "Correct. It distinguishes coefficient interpretation from prediction and proposes purpose-driven remediation.",
      "A low VIF is not a reason to remove a significant predictor; it indicates little variance inflation.",
      "Multicollinearity can impair coefficient interpretation without necessarily invalidating fitted values or predictions."
    ],
    "formula": "VIF_j = 1 / (1 - R_j²); large VIF indicates inflated variance for coefficient j.",
    "assumptions": [
      "The stated recipe correlation is representative of the fitted data.",
      "Other regression assumptions still require separate verification."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "multiple regression",
      "VIF",
      "multicollinearity",
      "coefficient interpretation",
      "prediction"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 25 - Multiple Regression Analysis",
    "sourcePages": "374-383",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Multiple Regression Analysis; Multicollinearity",
        "pages": "374-383"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-048",
    "set": 2,
    "batch": 2,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "C. Design of Experiments",
      "topic": "Response surface methodology and steepest ascent"
    },
    "difficulty": "Expert",
    "cognitive": "Analyze",
    "questionType": "Visual multi-step quantitative",
    "industry": "Advanced materials development",
    "quantitative": true,
    "stem": "The fitted coded-factor response is y-hat = 90 - 6(A - 0.5)^2 - 2(B + 0.5)^2. The contour plot marks the current setting at A = -1, B = 1. Based on the local gradient, which first search direction follows steepest ascent?",
    "options": [
      "Increase A and decrease B, using relative coded steps near 3 to 1 because the local gradient is proportional to positive 18 and negative 6",
      "Decrease A and increase B, using relative coded steps near 3 to 1 because movement toward successively lower fitted-response contours maximizes the response most efficiently",
      "Increase A and increase B in equal coded increments because steepest ascent must follow the long axis of the nearest elliptical contour toward its most distant boundary",
      "Hold A constant and decrease B in progressively larger coded steps because the contour center demonstrates that only factor B has a nonzero local derivative at the current setting"
    ],
    "answer": 0,
    "why": "For the fitted surface, partial y/partial A = -12(A-0.5) and partial y/partial B = -4(B+0.5). At (-1,1), the gradient is (18,-6), so the locally steepest increase raises A and lowers B with a coded-step ratio of about 3:1. The direction is normal to, not along, a contour. <b>A. Increase A and decrease B, using relative coded steps near 3 to 1 because the local gradient is proportional to positive 18 and negative 6</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 26, Response Surface Methodology and Steepest Ascent, pp. 439-442.</span>",
    "optionRationales": [
      "Correct. The signs and relative magnitudes match the gradient evaluated at the current setting.",
      "That is the direction of local descent, opposite the positive gradient.",
      "Travel along a contour produces approximately constant response rather than the steepest local increase.",
      "Both partial derivatives are nonzero at the current point; A has the larger local effect."
    ],
    "formula": "Gradient = [-12(A-0.5), -4(B+0.5)]; at (-1,1), gradient = [18,-6].",
    "assumptions": [
      "The quadratic model is adequate locally.",
      "Both factors use comparable coded units and the first move remains within the experimental region."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "response surface methodology",
      "contour plot",
      "steepest ascent",
      "gradient",
      "coded factors"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 26 - Response Surface Methodology",
    "sourcePages": "439-442",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 26 - Design of Experiments",
        "section": "Response Surface Methodology; Steepest Ascent and Descent Experiments",
        "pages": "439-442"
      }
    ],
    "chart": {
      "type": "contour-plot",
      "title": "Fitted response contours",
      "xLabel": "Factor A (coded units)",
      "yLabel": "Factor B (coded units)",
      "xTicks": [
        -2,
        -1,
        0,
        1,
        2
      ],
      "yTicks": [
        -2,
        -1,
        0,
        1,
        2
      ],
      "xDomain": [
        -2.5,
        2.5
      ],
      "yDomain": [
        -2.5,
        2.5
      ],
      "center": [
        0.5,
        -0.5
      ],
      "contours": [
        {
          "level": 75,
          "radiusX": 1.5811388300841898,
          "radiusY": 2.7386127875258306
        },
        {
          "level": 80,
          "radiusX": 1.2909944487358056,
          "radiusY": 2.23606797749979
        },
        {
          "level": 85,
          "radiusX": 0.9128709291752769,
          "radiusY": 1.5811388300841898
        }
      ],
      "current": {
        "x": -1,
        "y": 1,
        "label": "Current"
      },
      "model": "y-hat = 90 - 6(A - 0.5)^2 - 2(B + 0.5)^2",
      "auditBatch": 2,
      "auditId": "mbb:set-2:original-048",
      "altText": "An accessible contour plot of the fitted response shows elliptical contours at responses 75, 80, and 85 centered at coded factor settings A 0.5 and B negative 0.5. The current point is A negative 1 and B positive 1."
    },
    "visual": {
      "type": "contour-plot",
      "datasetRef": "test-bank-assets/mbb-160/batch-02/datasets.json#mbb:set-2:original-048",
      "specRef": "test-bank-assets/mbb-160/batch-02/visual-specs.json#mbb:set-2:original-048",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-02/static-fallbacks.html#mbb-set-2-original-048",
      "altText": "An accessible contour plot of the fitted response shows elliptical contours at responses 75, 80, and 85 centered at coded factor settings A 0.5 and B negative 0.5. The current point is A negative 1 and B positive 1.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-02/validation.json#mbb:set-2:original-048",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-049",
    "set": 2,
    "batch": 2,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Reliability modeling for series and parallel systems"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Interactive visual multi-step quantitative",
    "industry": "Renewable-energy equipment",
    "quantitative": true,
    "stem": "Each of two identical, independent inverter modules has Weibull reliability R(t) = exp[-(t/2500)^1.5], with t and the scale 2500 in hours. Compare a system requiring both modules to operate with a system requiring either module to operate. At 1,000 hours, which conclusion is correct, rounding each final probability directly to three decimal places?",
    "options": [
      "Component reliability is about 0.603; therefore series reliability is 0.364 and active-parallel reliability is 0.842 at 1,000 hours",
      "Both system reliabilities equal the component reliability of about 0.776 because identical independent modules have no configuration effect when they share the same Weibull scale and shape parameters",
      "Component reliability is about 0.776; series reliability is about 0.603 and active-parallel reliability is about 0.950, assuming independent failures",
      "Series reliability is about 0.950 and active-parallel reliability is about 0.603 because parallel paths multiply successful component probabilities"
    ],
    "answer": 2,
    "why": "At 1,000 hours, component reliability is exp[−(1000/2500)^1.5] = 0.7764816931. Both-required reliability is R² = 0.6029238198. Either-sufficient reliability is 1−(1−R)² = 0.9500395665. Rounding directly from these unrounded values gives 0.776, 0.603, and 0.950. Rounding the component first to 0.7765 and then to three places would incorrectly produce 0.777. Independence and sufficient full-load capacity are essential to applying the active-parallel formula. <b>C. Component reliability is about 0.776; series reliability is about 0.603 and active-parallel reliability is about 0.950, assuming independent failures</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 25, Reliability Modeling, pp. 423-427.</span>",
    "optionRationales": [
      "It incorrectly treats the series-system value as component reliability and propagates that error.",
      "Configuration changes system success logic even when component distributions are identical.",
      "Correct. It applies the Weibull component model and the independent series and parallel formulas.",
      "The formulas are reversed: series multiplies successes, while parallel complements joint failures."
    ],
    "formula": "R = exp[−(1000/2500)^1.5] = 0.7764816931; R_series = R² = 0.6029238198; R_parallel = 1−(1−R)² = 0.9500395665. Round only final results.",
    "assumptions": [
      "The nonrepairable modules have independent mission failures. There are no common-cause, connection, or switching failures.",
      "Either active-parallel module can carry the full required load; the stated Weibull model remains valid after the other fails."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "Weibull reliability",
      "series system",
      "parallel system",
      "mission time",
      "independence"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 25 - Reliability Modeling",
    "sourcePages": "423-427",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Reliability Modeling; Series and Parallel Systems",
        "pages": "423-427"
      }
    ],
    "chart": {
      "type": "reliability-plot",
      "title": "Two-module system reliability",
      "xLabel": "Mission time (hours)",
      "yLabel": "System reliability",
      "xTicks": [
        0,
        500,
        1000,
        1500,
        2000
      ],
      "series": [
        {
          "label": "Both modules required (series)",
          "points": [
            [
              0,
              1
            ],
            [
              500,
              0.8362
            ],
            [
              1000,
              0.6029
            ],
            [
              1500,
              0.3947
            ],
            [
              2000,
              0.239
            ]
          ]
        },
        {
          "label": "Either module sufficient (active parallel)",
          "points": [
            [
              0,
              1
            ],
            [
              500,
              0.9927
            ],
            [
              1000,
              0.95
            ],
            [
              1500,
              0.8618
            ],
            [
              2000,
              0.7388
            ]
          ]
        }
      ],
      "missionTime": 1000,
      "auditBatch": 2,
      "auditId": "mbb:set-2:original-049",
      "altText": "A two-series reliability plot covers 0 to 2,000 hours. At 1,000 hours, the system requiring both modules has reliability about 0.603 and the active-parallel system requiring either module has reliability 0.9500.",
      "weibullModel": {
        "scaleHours": 2500,
        "shape": 1.5
      }
    },
    "visual": {
      "type": "reliability-plot",
      "datasetRef": "test-bank-assets/mbb-160/batch-02/datasets.json#mbb:set-2:original-049",
      "specRef": "test-bank-assets/mbb-160/batch-02/visual-specs.json#mbb:set-2:original-049",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-02/static-fallbacks.html#mbb-set-2-original-049",
      "altText": "A two-series reliability plot covers 0 to 2,000 hours. At 1,000 hours, the system requiring both modules has reliability about 0.603 and the active-parallel system requiring either module has reliability 0.9500.",
      "interactionPurpose": "Inspect each system/time value through pointer, keyboard focus, or a native observation selector; a semantic data table provides the same evidence.",
      "validationRef": "test-bank-assets/mbb-160/batch-02/validation.json#mbb:set-2:original-049",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-050",
    "set": 2,
    "batch": 2,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Linear programming constraints and slack"
    },
    "difficulty": "Hard",
    "cognitive": "Understand",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Distribution planning",
    "quantitative": false,
    "stem": "A solved linear-programming model maximizes contribution under labor and dock-hour constraints. At the optimum, labor slack is 0 hours and dock slack is 18 hours. The sensitivity report is unavailable. Which interpretation is justified by this output alone?",
    "options": [
      "Both constraints are binding because every constraint participates in the model even when its slack is positive at the reported solution",
      "The dock constraint is binding and labor is nonbinding because unused dock hours represent demand that the labor constraint cannot absorb",
      "Adding one labor hour must increase contribution by exactly the current contribution per labor hour because zero slack defines the shadow price",
      "Labor is binding and dock capacity has 18 unused hours; the value of more labor cannot be quantified without sensitivity or re-optimization evidence"
    ],
    "answer": 3,
    "why": "Zero slack means the labor constraint is active at the reported optimum. Positive dock slack means 18 dock hours remain unused, so dock capacity is not binding there. Slack alone does not reveal a shadow price or its allowable range; quantifying the objective gain from another labor hour requires sensitivity information or resolving the model. <b>D. Labor is binding and dock capacity has 18 unused hours; the value of more labor cannot be quantified without sensitivity or re-optimization evidence</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 25, Linear Programming, pp. 417-422.</span>",
    "optionRationales": [
      "Participation in a model does not make a constraint binding; positive slack demonstrates unused capacity.",
      "The interpretation is reversed: labor has zero slack, while dock capacity has 18 unused hours.",
      "Zero slack identifies a binding constraint but does not numerically identify its marginal value.",
      "Correct. It extracts exactly what slack establishes and avoids an unsupported sensitivity claim."
    ],
    "formula": "Slack = available resource - resource used; zero slack identifies an active constraint at the reported solution.",
    "assumptions": [
      "The reported solution is feasible and optimal.",
      "Constraint units are hours and no integer restriction changes the meaning of reported slack."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "linear programming",
      "slack variable",
      "binding constraint",
      "sensitivity analysis",
      "optimization"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 25 - Linear Programming",
    "sourcePages": "417-422",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Linear Programming",
        "pages": "417-422"
      }
    ]
  }
];

  var batch3=[
  {
    "qid": "mbb:set-2:original-051",
    "set": 2,
    "batch": 3,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "A. Strategic Plan Development",
      "topic": "SWOT and PEST environmental scanning"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, strategic analysis",
    "industry": "Pharmaceutical cold-chain logistics",
    "quantitative": false,
    "stem": "A pharmaceutical distributor is refreshing its three-year strategy. The planning team collected the five facts below and immediately proposed a broad automation program. Which Master Black Belt response best uses the evidence without confusing internal capability with the external environment?",
    "options": [
      "Treat every unfavorable fact as an internal weakness, then charter one DMAIC project for each item before competitors can respond to the same conditions",
      "Treat every favorable fact as an external opportunity, rank the five facts by financial size, and select the highest-ranked item as the enterprise strategy",
      "Keep internal strengths and weaknesses distinct from external PEST conditions, then test strategies that leverage the sensor capability while mitigating key-person, regulatory, and technology exposure",
      "Remove the demographic evidence because social factors are not actionable by the distributor, then use only political and technological facts to set deployment priorities"
    ],
    "answer": 2,
    "why": "SWOT separates internal strengths and weaknesses from external opportunities and threats, while PEST structures the external political, economic, social, and technological scan. The proprietary sensor and single-expert dependency are internal; regulation, demographics, and competitor technology are external. Strategy should combine these facts rather than turn each observation automatically into a project. <b>C. Keep internal strengths and weaknesses distinct from external PEST conditions, then test strategies that leverage the sensor capability while mitigating key-person, regulatory, and technology exposure</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 1, SWOT and PEST, pp. 2-7.</span>",
    "optionRationales": [
      "External threats are not internal weaknesses, and environmental observations require strategic synthesis before project chartering.",
      "Favorable internal capabilities are strengths, not opportunities, and a single financial rank does not constitute a strategy.",
      "Correct. It preserves the internal-external distinction and converts the combined scan into testable strategic choices.",
      "Social trends are legitimate PEST evidence even when the organization must respond indirectly through its strategy."
    ],
    "formula": null,
    "assumptions": [
      "The five facts are current, independently verified inputs to the planning process.",
      "No immediate regulatory violation requires emergency containment."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "SWOT",
      "PEST",
      "environmental scan",
      "strategic planning",
      "internal and external factors"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 1 - SWOT and PEST",
    "sourcePages": "2-7",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 1 - Strategic Plan Deployment",
        "section": "SWOT; PEST",
        "pages": "2-7"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Fact",
        "Observation"
      ],
      "rows": [
        [
          "1",
          "Proprietary sensor accuracy exceeds competitors"
        ],
        [
          "2",
          "One specialist maintains the billing interface"
        ],
        [
          "3",
          "Regulator will require serialized temperature audits"
        ],
        [
          "4",
          "Regional population is aging toward home delivery"
        ],
        [
          "5",
          "Competitor launched AI-based route scheduling"
        ]
      ],
      "auditBatch": 3,
      "auditId": "mbb:set-2:original-051",
      "altText": "Five observations: proprietary sensor accuracy, a single billing specialist, an audit rule, demographic change and competitor scheduling technology."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-03/datasets.json#mbb:set-2:original-051",
      "specRef": "test-bank-assets/mbb-160/batch-03/visual-specs.json#mbb:set-2:original-051",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-03/static-fallbacks.html#mbb-set-2-original-051",
      "altText": "Five observations: proprietary sensor accuracy, a single billing specialist, an audit rule, demographic change and competitor scheduling technology.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-03/validation.json#mbb:set-2:original-051",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-052",
    "set": 2,
    "batch": 3,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "B. Strategic Plan Alignment",
      "topic": "Strategic deployment goals and operational alignment"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Enterprise deployment and governance scenario",
    "industry": "Public transportation",
    "quantitative": false,
    "stem": "A transit authority sets an enterprise goal to increase reliable access without increasing operating cost. Operations is rewarded for vehicle utilization, Maintenance for minimizing planned downtime, and Customer Service for reducing complaint-handling time. Each function meets its local target, yet missed connections and repeat complaints increase. What should the Master Black Belt recommend?",
    "options": [
      "Use catchball to redesign the goal cascade around shared outcome and driver measures, reconcile functional tradeoffs, and assign joint accountability for end-to-end passenger reliability",
      "Keep the local targets and raise each threshold; require departments to explain remaining misses at monthly reviews before considering shared measures.",
      "Replace every functional measure with missed connections because one common lagging metric prevents departments from optimizing different definitions of performance",
      "Transfer accountability to Customer Service because repeat complaints provide the most direct voice-of-customer evidence and therefore dominate operational measures"
    ],
    "answer": 0,
    "why": "The local measures are producing predictable suboptimization: utilization can reduce maintenance opportunity, downtime avoidance can defer needed work, and short calls can drive repeats. Strategic alignment requires vertical and horizontal negotiation of targets and means, with a balanced architecture connecting shared outcomes to controllable drivers and explicit tradeoffs. <b>A. Use catchball to redesign the goal cascade around shared outcome and driver measures, reconcile functional tradeoffs, and assign joint accountability for end-to-end passenger reliability</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapters 1-2, Strategic Plan Deployment and Alignment, pp. 7-27.</span>",
    "optionRationales": [
      "Correct. It repairs the measurement system and governance relationships that are causing local optimization.",
      "Increasing incompatible thresholds can intensify the same cross-functional conflict rather than align the operating system.",
      "One lagging outcome cannot diagnose or manage the controllable drivers needed by different functions.",
      "Customer evidence is essential, but Customer Service cannot own vehicle reliability and maintenance tradeoffs alone."
    ],
    "formula": null,
    "assumptions": [
      "The enterprise goal is approved and all three functional measures are behaving as described."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "strategic alignment",
      "catchball",
      "local optimization",
      "balanced measures",
      "shared accountability"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 1-2 - Hoshin Kanri and Strategic Plan Alignment",
    "sourcePages": "7-27",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapters 1-2 - Strategic Plan Deployment and Alignment",
        "section": "Hoshin Kanri; Strategic Deployment Goals; Project Alignment",
        "pages": "7-27"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-053",
    "set": 2,
    "batch": 3,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "C. Infrastructure Elements of Improvement Systems",
      "topic": "Resource planning and development for deployment"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Deployment-system design scenario",
    "industry": "Global financial services",
    "quantitative": false,
    "stem": "A global bank proposes certifying 120 additional Green Belts. The qualified project pipeline can support only 38 assignments, current Master Black Belts can actively coach 16 new projects, candidate backfill is unfunded, and annual Belt attrition is 22%. Which deployment design is most defensible?",
    "options": [
      "Train all 120 candidates now, use hypothetical projects for those awaiting assignments, and judge deployment progress by certification counts and examination scores.",
      "Cancel internal development and hire experienced Belts externally because attrition demonstrates that an internal career path cannot be economically sustained",
      "Allocate coaching to experienced candidates first; let new Green Belts proceed independently and ask sponsors to absorb the technical reviews during the gap.",
      "Build a time-phased supply-demand model linking qualified projects, selection criteria, backfill, coaching capacity, attrition, assignments, and career paths; release cohorts only at supported gates"
    ],
    "answer": 3,
    "why": "Resource development must be driven by organizational need and supported by training, coaching, continuing education, real assignments, and career planning. Training 120 people against 38 projects and 16 coaching slots creates excess work in process and predictable failure. A gated, time-phased model makes the capacity constraints and replenishment logic explicit. <b>D. Build a time-phased supply-demand model linking qualified projects, selection criteria, backfill, coaching capacity, attrition, assignments, and career paths; release cohorts only at supported gates</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 3, Resource Planning and Resource Development, pp. 41-51.</span>",
    "optionRationales": [
      "Hypothetical projects cannot replace verified business assignments, sponsorship, and coaching capacity in a deployment system.",
      "External hiring may be one input, but attrition alone does not justify abandoning internal capability development.",
      "Withholding coaching from less experienced Belts increases project and learning risk rather than resolving capacity.",
      "Correct. It integrates the linked demand, development, support, retention, and assignment decisions over time."
    ],
    "formula": "Supported cohort size is constrained by the minimum of qualified assignments, backfilled candidate capacity, and available coaching load over the release period.",
    "assumptions": [
      "All reported capacity values refer to the same planned intake period.",
      "The bank can sequence cohorts rather than meet a fixed external certification deadline.",
      "Each candidate needs one qualified project assignment and appropriate coaching during the intake period. Sixteen coaching slots are an upper bound, not approval for a cohort before backfill is funded."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "resource development",
      "coaching capacity",
      "deployment pipeline",
      "attrition",
      "cohort gating"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 3 - Resource Planning and Resource Development",
    "sourcePages": "41-51",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 3 - Deployment of Six Sigma Systems",
        "section": "Resource Planning; Resource Development",
        "pages": "41-51"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-054",
    "set": 2,
    "batch": 3,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "D. Improvement Methodologies",
      "topic": "Evidence-based transition between DMAIC and DFSS"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Integrated methodology-selection scenario",
    "industry": "Healthcare technology",
    "quantitative": false,
    "stem": "A mature patient-scheduling platform misses a new accessibility CTQ. The current workflow also has chronic handoff defects, but engineering evidence suggests the existing architecture may be unable to meet the new CTQ at any practical operating setting. Which roadmap should govern the work?",
    "options": [
      "Begin DMADV immediately and exclude current-process data because redesign work should not be constrained by defects in the legacy operating workflow, then establish new requirements without using legacy failure modes or customer evidence",
      "Use DMAIC to quantify and remove correctable process causes while defining an evidence gate that transitions the architectural gap to DMADV if the existing design cannot meet the CTQ",
      "Complete DMAIC through Control before discussing redesign because changing roadmaps at an interim gate invalidates the original charter and financial baseline, even if capability evidence demonstrates the architecture cannot satisfy the CTQ",
      "Run independent DMAIC and DMADV projects with separate CTQ definitions so each team can optimize its own technical scope without shared governance, and reconcile the requirements only after both teams recommend solutions"
    ],
    "answer": 1,
    "why": "The organization has both an existing-process performance problem and a possible design-capability gap. DMAIC can establish what the current system can achieve after correctable causes are addressed; an explicit evidence gate prevents endless improvement of an architecture that cannot meet the new CTQ and supports transition to DMADV under common requirements and governance. <b>B. Use DMAIC to quantify and remove correctable process causes while defining an evidence gate that transitions the architectural gap to DMADV if the existing design cannot meet the CTQ</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 4, DMAIC and DFSS, pp. 54-63.</span>",
    "optionRationales": [
      "Legacy data remain valuable for requirements, failure modes, and transition risk even when redesign becomes necessary.",
      "Correct. The roadmap separates correctable execution loss from a verified design limitation without fragmenting CTQs.",
      "A governed evidence gate can legitimately change the roadmap before resources are consumed by an incapable design.",
      "Different CTQ definitions would prevent a valid comparison and invite conflicting local optimization."
    ],
    "formula": null,
    "assumptions": [
      "The accessibility CTQ is valid and measurable.",
      "No safety issue requires immediate retirement of the current platform."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "DMAIC",
      "DMADV",
      "DFSS",
      "design capability",
      "methodology transition"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 4 - DMAIC and DFSS",
    "sourcePages": "54-63",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 4 - Six Sigma Methodologies",
        "section": "DMAIC; DFSS",
        "pages": "54-63"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-055",
    "set": 2,
    "batch": 3,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "E. Opportunities for Improvement",
      "topic": "Project qualification after creativity and innovation"
    },
    "difficulty": "Hard",
    "cognitive": "Understand",
    "questionType": "Advanced conceptual governance question",
    "industry": "Consumer products",
    "quantitative": false,
    "stem": "An innovation workshop produces 74 ideas and ranks them by participant enthusiasm. Leadership asks the Master Black Belt to move the top ten directly into Define. What qualification principle should be applied before those ideas enter the project pipeline?",
    "options": [
      "Enthusiasm is sufficient if the facilitator used a structured creativity tool and every participant had an equal opportunity to vote",
      "Each idea should become a project because pipeline attrition will naturally remove weak ideas after teams begin collecting baseline data",
      "Screen each candidate for a verified problem or opportunity, strategic alignment, sponsor and customer relevance, measurable benefit, feasible scope, data access, and material risk",
      "Retain only ideas with an immediately calculable hard-dollar return because strategic, customer, regulatory, and capability benefits are too subjective for qualification"
    ],
    "answer": 2,
    "why": "Creativity tools expand the solution or opportunity space; they do not qualify projects. Before work enters the pipeline, the organization needs evidence that the opportunity is real, aligned, measurable, sponsored, feasible, and worth its risk and resource demand. Early qualification prevents weak ideas from consuming scarce Belt and governance capacity. <b>C. Screen each candidate for a verified problem or opportunity, strategic alignment, sponsor and customer relevance, measurable benefit, feasible scope, data access, and material risk</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 5, Project Qualification and Creativity and Innovation Tools, pp. 73-87.</span>",
    "optionRationales": [
      "A fair ideation process improves participation but does not establish business need, feasibility, or benefit.",
      "Launching weak projects transfers screening cost to Belts and overloads the deployment pipeline.",
      "Correct. These qualification dimensions distinguish promising ideas from executable improvement projects.",
      "Hard-dollar impact is important but does not exhaust legitimate strategic, compliance, customer, or capability value."
    ],
    "formula": null,
    "assumptions": [
      "The ideas are discretionary and have not yet been assigned resources."
    ],
    "estimatedMinutes": 2,
    "keywords": [
      "project qualification",
      "innovation",
      "pipeline screening",
      "strategic alignment",
      "feasibility"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 5 - Project Qualification and Creativity and Innovation Tools",
    "sourcePages": "73-87",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 5 - Opportunities for Improvement",
        "section": "Project Qualification; Creativity and Innovation Tools",
        "pages": "73-87"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-056",
    "set": 2,
    "batch": 3,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "A. Organizational Design",
      "topic": "Systems thinking, feedback, and unintended consequences"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Interactive time-series systems diagnosis",
    "industry": "Fleet maintenance",
    "quantitative": false,
    "stem": "A fleet operator rewards Purchasing for reducing spare-parts inventory. Inventory value fell from $9.2 million to $6.5 million after reorder quantities were cut. The plotted first-request fill rate then declined after a delay, while vehicle downtime and emergency freight increased. Demand mix, fleet size and supplier lead times were unchanged. Which intervention best reflects systems thinking?",
    "options": [
      "Pilot revised replenishment rules after mapping stock depletion, reorder delays and downtime; balance inventory cost against service availability and total operating cost.",
      "Restore every item to its former inventory level immediately and retain inventory value as the sole performance measure because the historical setting must be optimal.",
      "Tighten the inventory reduction target and charge emergency freight to Maintenance so Purchasing is evaluated only on costs within its own department.",
      "Replace the individual buyers with a centrally trained buying team before examining replenishment timing because lower fill rates establish a competence problem."
    ],
    "answer": 0,
    "why": "A local inventory target can shift cost and service consequences outside Purchasing. The delayed fill-rate decline and increases in downtime and freight justify investigating replenishment timing, stock depletion and downstream effects; the time series alone does not prove which mechanism caused the change. With immediate safety exposure contained, a measured pilot and balanced service/cost measures test a system-level response rather than assuming the old inventory or individual competence is optimal. <b>A. Pilot revised replenishment rules after mapping stock depletion, reorder delays and downtime; balance inventory cost against service availability and total operating cost.</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 7, Systems Thinking, pp. 100-104.</span>",
    "optionRationales": [
      "Correct. Map plausible mechanisms and test revised replenishment while considering service and total system cost.",
      "The prior inventory level is not established as optimal, and a single inventory-value measure omits service and downstream costs.",
      "Moving emergency costs to another department rewards local optimization and does not improve total system performance.",
      "The displayed aggregate pattern does not establish a buyer competence problem; replacing staff before examining the system is unsupported."
    ],
    "formula": null,
    "assumptions": [
      "Immediate safety-critical stockouts have been contained; this question concerns the next systemic intervention.",
      "First-request fill rate is the percentage of requested part lines supplied in full from stock on the first request; the definition is unchanged across weeks.",
      "The inventory policy change preceded W0. The time series is diagnostic evidence, not proof of a causal mechanism."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "systems thinking",
      "inventory policy",
      "delayed feedback",
      "fill rate",
      "total operating cost"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 7 - Systems Thinking",
    "sourcePages": "100-104",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 7 - Organizational Design",
        "section": "Systems Thinking",
        "pages": "100-104"
      }
    ],
    "chart": {
      "type": "time-series",
      "title": "Spare-parts first-request fill rate",
      "xLabel": "Week after inventory-policy change",
      "yLabel": "First-request fill rate (%)",
      "units": "percent",
      "decimals": 0,
      "labels": [
        "W0",
        "W1",
        "W2",
        "W3",
        "W4",
        "W5",
        "W6",
        "W7"
      ],
      "data": [
        82,
        82,
        80,
        76,
        71,
        66,
        61,
        58
      ],
      "auditBatch": 3,
      "auditId": "mbb:set-2:original-056",
      "altText": "Weekly first-request fill rate, percent for observations W0–W7: 82, 82, 80, 76, 71, 66, 61, 58."
    },
    "visual": {
      "type": "time-series",
      "datasetRef": "test-bank-assets/mbb-160/batch-03/datasets.json#mbb:set-2:original-056",
      "specRef": "test-bank-assets/mbb-160/batch-03/visual-specs.json#mbb:set-2:original-056",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-03/static-fallbacks.html#mbb-set-2-original-056",
      "altText": "Weekly first-request fill rate, percent for observations W0–W7: 82, 82, 80, 76, 71, 66, 61, 58.",
      "interactionPurpose": "Inspect the same chronological observation values using a native selector, keyboard focus or touch; an equivalent data table is provided.",
      "validationRef": "test-bank-assets/mbb-160/batch-03/validation.json#mbb:set-2:original-056",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-057",
    "set": 2,
    "batch": 3,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "A. Organizational Design",
      "topic": "Organizational maturity, culture, and change techniques"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Change-strategy evaluation scenario",
    "industry": "Mining and mineral processing",
    "quantitative": false,
    "stem": "A mining company plans one standardized Lean Six Sigma rollout for four sites. One site has stable daily management and trusted data; another has weak process ownership; a third has labor-relations tension; and the fourth recently changed leadership. What deployment approach should the Master Black Belt recommend?",
    "options": [
      "Launch identical training, governance, targets, and timing at all sites so variation in implementation cannot be blamed for different business results, and compare adoption only after every site completes the same calendar milestones",
      "Begin only at the highest-maturity site and permanently exclude the other sites because weak readiness predicts an unacceptable probability of failure, using that site as the sole enterprise center of excellence and source of improvement resources",
      "Let every site define its own Belt roles, benefit rules, and tollgates so cultural autonomy is preserved during the adoption period without enterprise review",
      "Assess readiness by site, preserve common governance and benefit standards, and tailor sequencing, sponsorship, communication, and interventions to each local constraint"
    ],
    "answer": 3,
    "why": "Organizational maturity and culture affect the sequence and support required for adoption. A common deployment architecture is still needed for role clarity, benefit integrity, and comparability, but local readiness evidence should determine pacing and intervention. Uniform timing ignores real system differences; unrestricted local designs fragment governance. <b>D. Assess readiness by site, preserve common governance and benefit standards, and tailor sequencing, sponsorship, communication, and interventions to each local constraint</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapters 7-8, Organizational Maturity, Culture, and Commitment, pp. 104-125.</span>",
    "optionRationales": [
      "Identical implementation confuses standard governance with identical change conditions and can magnify site-specific barriers.",
      "A phased start may be appropriate, but permanent exclusion abandons capability-building without testing targeted interventions.",
      "Local adaptation should not redefine the controls required for enterprise accountability and comparable benefit validation.",
      "Correct. It combines enterprise standards with evidence-based adaptation to local maturity and cultural conditions."
    ],
    "formula": null,
    "assumptions": [
      "The company intends an enterprise deployment and can sequence site launches."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "organizational maturity",
      "culture change",
      "deployment readiness",
      "site sequencing",
      "standard governance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 7-8 - Organizational Maturity, Culture, and Commitment",
    "sourcePages": "104-125",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapters 7-8 - Organizational Design and Commitment",
        "section": "Organizational Maturity and Culture; Cultural Change Techniques; Change Management",
        "pages": "104-125"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-058",
    "set": 2,
    "batch": 3,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "B. Executive and Team Leadership Roles",
      "topic": "Decision-oriented communication with management"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Executive communication scenario",
    "industry": "Government shared services",
    "quantitative": false,
    "stem": "An executive steering committee requests a single red-yellow-green status for a shared-services transformation. The program has a validated benefit range, a critical data-access dependency, and two recovery options with different schedule and risk consequences. How should the Master Black Belt structure the communication?",
    "options": [
      "Select the most likely color and omit ranges and alternatives because executive communication should reduce uncertainty to one unambiguous conclusion, while retaining the assumptions and dependency evidence only in the working-team archive",
      "Lead with the decision required, show the status criteria, evidence range, assumptions, dependency, and consequences of each recovery option, then state the recommended action and owner",
      "Provide the complete analytical workbook without a recommendation so the committee can independently decide which assumptions and risk thresholds it prefers, then record its interpretation as the program baseline for subsequent reviews",
      "Report green while the expected benefit remains positive, and move schedule and dependency concerns to the appendix until either becomes an actual failure that requires a formal recovery decision"
    ],
    "answer": 1,
    "why": "Management communication should be concise but must preserve decision-relevant uncertainty, criteria, dependencies, and consequences. A color without its basis can conceal material exposure, while a data dump transfers synthesis responsibility to the committee. The MBB should make the decision and ownership explicit and recommend a supportable response. <b>B. Lead with the decision required, show the status criteria, evidence range, assumptions, dependency, and consequences of each recovery option, then state the recommended action and owner</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapters 8 and 12, Communications with Management and Leadership for Deployment, pp. 119-123 and 183-195.</span>",
    "optionRationales": [
      "Reducing the display to a color may hide uncertainty that materially changes the executive decision.",
      "Correct. It is concise, evidence-based, decision-oriented, and explicit about risk, action, and accountability.",
      "Executives need traceable evidence, but the MBB remains responsible for synthesis and a defensible recommendation.",
      "Expected benefit alone does not neutralize a critical dependency or a credible schedule risk."
    ],
    "formula": null,
    "assumptions": [
      "The committee has authority to choose among the recovery options."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "executive communication",
      "decision framing",
      "uncertainty",
      "status criteria",
      "recommended action"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 8 and 12 - Communications with Management and Leadership",
    "sourcePages": "119-123, 183-195",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 8 - Organizational Commitment",
        "section": "Communications with Management",
        "pages": "119-123"
      },
      {
        "id": "S2",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 12 - Executive and Team Leadership Roles",
        "section": "Executive Leadership Roles; Leadership for Deployment",
        "pages": "183-195"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-059",
    "set": 2,
    "batch": 3,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "A. Organizational Design",
      "topic": "Organizational dynamics and intervention styles"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Organizational-dynamics intervention scenario",
    "industry": "Aerospace engineering",
    "quantitative": false,
    "stem": "A functional vice president publicly endorses a reliability project but repeatedly delays access to engineering data because the proposed model may expose decisions made by the function. The Black Belt wants to escalate immediately to the chief operating officer. What should the Master Black Belt do first?",
    "options": [
      "Approve immediate escalation and describe the vice president as resistant so the chief operating officer can enforce the published sponsorship commitment",
      "Remove the engineering data from scope and let the team use available production data, because formal authority should not be challenged during analysis",
      "Diagnose the interests, power, and perceived exposure behind the delay; use a collaborative intervention to agree safeguards, access, and decision rights, with a defined escalation path if unresolved",
      "Ask the Black Belt to negotiate privately without MBB involvement so the Belt develops political skill and the project retains independence from deployment leadership"
    ],
    "answer": 2,
    "why": "The visible behavior suggests a conflict between public commitment and perceived functional risk. Before using formal escalation, the MBB should diagnose the organizational dynamics and select an intervention that surfaces interests, protects legitimate concerns, and clarifies access and decision rights. A pre-agreed escalation path preserves accountability if collaboration fails. <b>C. Diagnose the interests, power, and perceived exposure behind the delay; use a collaborative intervention to agree safeguards, access, and decision rights, with a defined escalation path if unresolved</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 11, Organizational Dynamics and Intervention Styles, pp. 157-176.</span>",
    "optionRationales": [
      "Immediate labeling and escalation may harden defensiveness before the underlying interests and safeguards are understood.",
      "Removing necessary data protects hierarchy at the cost of analytical validity and does not resolve the conflict.",
      "Correct. It matches the intervention to the power and interest dynamics while retaining an accountable escalation route.",
      "Developing political skill matters, but the MBB should not leave a Belt unsupported in a senior-level access conflict."
    ],
    "formula": null,
    "assumptions": [
      "The requested data are necessary, lawful to use, and can be protected through appropriate controls.",
      "There is no imminent safety event or mandatory reporting deadline, and an agreed escalation deadline has not already been breached. Safeguards protect legitimate confidentiality, not suppression of unfavorable findings."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "organizational dynamics",
      "intervention style",
      "power and interests",
      "data access",
      "escalation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 11 - Organizational Dynamics and Intervention Styles",
    "sourcePages": "157-176",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 11 - Internal Organizational Challenges",
        "section": "Organizational Dynamics; Intervention Styles",
        "pages": "157-176"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-060",
    "set": 2,
    "batch": 3,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "B. Executive and Team Leadership Roles",
      "topic": "Governance roles and accountability for deployment"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Deployment-governance design",
    "industry": "Municipal utilities",
    "quantitative": false,
    "stem": "A utility asks the Master Black Belt to design deployment accountability. In the current model, the MBB selects projects, approves benefits, removes political barriers, owns process controls after closure, and evaluates every sponsor. Which replacement most appropriately distributes leadership responsibilities?",
    "options": [
      "Let the executive council own strategic priorities, champions own sponsorship and barrier removal, Finance validate benefits, process owners sustain controls, and the MBB govern methods, coaching, and portfolio evidence",
      "Retain all decisions with the MBB but create advisory committees for executives, champions, Finance, and process owners so technical consistency is not compromised",
      "Give project leaders full authority for selection, benefit validation, barrier removal, and sustainment because accountability is strongest when it is concentrated with the delivery team, and require the MBB to audit only the final reported outcome after closure",
      "Assign the executive council only to approve training budgets, while the MBB and Belts jointly own project outcomes and all post-project process performance"
    ],
    "answer": 0,
    "why": "A deployment system needs distinct but connected accountabilities. Executives set direction, champions sponsor and remove barriers, Finance protects benefit integrity, process owners own sustained performance, and the MBB provides technical leadership, coaching, standards, and portfolio evidence. Concentrating enterprise and operational ownership in the MBB weakens governance. <b>A. Let the executive council own strategic priorities, champions own sponsorship and barrier removal, Finance validate benefits, process owners sustain controls, and the MBB govern methods, coaching, and portfolio evidence</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 12, Executive Leadership Roles and Leadership for Deployment, pp. 183-195.</span>",
    "optionRationales": [
      "Correct. It distributes authority to the roles that can legitimately make, validate, sponsor, and sustain each decision.",
      "Advisory participation does not correct the excessive concentration of decision rights in one technical role.",
      "Project teams cannot independently validate their own benefits or own enterprise barriers and post-project processes.",
      "Executives and process owners retain responsibilities that cannot be delegated permanently to the improvement organization."
    ],
    "formula": null,
    "assumptions": [
      "The named functions and roles exist and can be assigned formal decision rights."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "deployment governance",
      "executive council",
      "champion",
      "process owner",
      "MBB role"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 12 - Executive Leadership Roles and Leadership for Deployment",
    "sourcePages": "183-195",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 12 - Executive and Team Leadership Roles",
        "section": "Executive Leadership Roles; Leadership for Deployment",
        "pages": "183-195"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-061",
    "set": 2,
    "batch": 3,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Management",
      "subdomain": "A. Project Management Principles and Life Cycle",
      "topic": "Risk-adjusted portfolio selection under capacity constraints"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Interactive portfolio optimization",
    "industry": "Industrial manufacturing",
    "quantitative": true,
    "stem": "The portfolio has 12 Black-Belt-months available. Project R is mandatory and consumes 4 months. Select only data-ready projects, do not split projects, and maximize total risk-adjusted NPV. Which authorization package is optimal under the stated constraints?",
    "options": [
      "Authorize R and C for 10 Black-Belt-months and $2.60 million risk-adjusted NPV, leaving two months for unplanned requests",
      "Authorize R, B, and D for 11 Black-Belt-months and $2.80 million risk-adjusted NPV, reserving one month rather than using all available capacity",
      "Authorize R and A for nine Black-Belt-months and $2.20 million risk-adjusted NPV, reserving three months because no other project fits the capacity",
      "Authorize R, A, and D for all 12 Black-Belt-months and $3.10 million risk-adjusted NPV; hold C until its data-readiness gate is passed"
    ],
    "answer": 3,
    "why": "After mandatory R consumes 4 months, 8 remain. Among ready projects, A plus D uses exactly 8 months and adds $2.70 million, so the full portfolio R+A+D uses 12 and returns $3.10 million. B+D uses 7 discretionary months and adds $2.40 million; C has a larger single value but is not data-ready. <b>D. Authorize R, A, and D for all 12 Black-Belt-months and $3.10 million risk-adjusted NPV; hold C until its data-readiness gate is passed</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapters 13 and 16, Project Prioritization and Financial Tools, pp. 196-202 and 225-232.</span>",
    "optionRationales": [
      "C is explicitly blocked at the data-readiness gate, so its apparent portfolio value is not currently executable.",
      "R is mandatory, not discretionary. R+B+D is feasible at 11 months and $2.80 million, but R+A+D is feasible and has the larger $3.10 million value.",
      "D also fits with A, uses the remaining capacity exactly, and increases risk-adjusted NPV by $0.90 million.",
      "Correct. It satisfies the mandatory, readiness, indivisibility, and capacity constraints while maximizing stated value."
    ],
    "formula": "Capacity after R = 12 - 4 = 8 months; value(R+A+D) = 0.40 + 1.80 + 0.90 = $3.10 million.",
    "assumptions": [
      "All resource demands fall within the same authorization horizon and are expressed in Black-Belt-months.",
      "The stated risk-adjusted NPVs use a common valuation date and basis, are additive and do not double-count benefits.",
      "Projects are indivisible, no unlisted dependencies exist, and only projects marked data-ready can be authorized.",
      "The scored case has 12 Black-Belt-months, including mandatory R. The optional slider changes hypothetical capacity only; it does not change the scored case or answer."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "portfolio optimization",
      "capacity constraint",
      "risk-adjusted NPV",
      "project readiness",
      "prioritization"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 13 and 16 - Project Prioritization and Financial Tools",
    "sourcePages": "196-202, 225-232",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 13 - Project Execution",
        "section": "Cross-Functional Project Assessment; Project Prioritization",
        "pages": "196-202"
      },
      {
        "id": "S2",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 16 - Project Financial Tools",
        "section": "Budgets and Forecasts; Costing Concepts",
        "pages": "225-232"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Project",
        "BB-months",
        "Risk-adjusted NPV",
        "Mandatory",
        "Data ready"
      ],
      "rows": [
        [
          "R",
          "4",
          "$0.40M",
          "Yes",
          "Yes"
        ],
        [
          "A",
          "5",
          "$1.80M",
          "No",
          "Yes"
        ],
        [
          "B",
          "4",
          "$1.50M",
          "No",
          "Yes"
        ],
        [
          "C",
          "6",
          "$2.20M",
          "No",
          "No"
        ],
        [
          "D",
          "3",
          "$0.90M",
          "No",
          "Yes"
        ]
      ],
      "whatIf": {
        "id": "mbb-q061-capacity",
        "label": "Hypothetical total capacity",
        "min": 8,
        "max": 16,
        "step": 1,
        "value": 12,
        "unit": "BB-months",
        "committed": 4,
        "committedLabel": "mandatory Project R",
        "baseline": 12
      },
      "auditBatch": 3,
      "auditId": "mbb:set-2:original-061",
      "altText": "Project resource, risk-adjusted NPV, mandatory status and data-readiness table; R requires 4 BB-months."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-03/datasets.json#mbb:set-2:original-061",
      "specRef": "test-bank-assets/mbb-160/batch-03/visual-specs.json#mbb:set-2:original-061",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-03/static-fallbacks.html#mbb-set-2-original-061",
      "altText": "Project resource, risk-adjusted NPV, mandatory status and data-readiness table; R requires 4 BB-months.",
      "interactionPurpose": "Explore hypothetical capacity with an explicit reset; the scored 12-BB-month case remains unchanged.",
      "validationRef": "test-bank-assets/mbb-160/batch-03/validation.json#mbb:set-2:original-061",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-062",
    "set": 2,
    "batch": 3,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Management",
      "subdomain": "B. Project Oversight and Management",
      "topic": "Measurement, monitoring, and baseline integrity"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Project-control diagnosis scenario",
    "industry": "Clinical research",
    "quantitative": false,
    "stem": "A clinical-data project reports that schedule variance returned to zero after the sponsor added three validation work packages and the project manager moved their planned dates into the next quarter. The additions were never approved through change control. What is the most defensible interpretation?",
    "options": [
      "The project recovered because schedule variance is zero against the latest dates, and formal approval is unnecessary when the sponsor requested the work, provided the project manager preserves an informal record of the added packages for final closeout",
      "The reported recovery is not valid until performance is reconciled to the approved baseline and the added scope is separately authorized, time-phased, and incorporated through change control",
      "The project is necessarily late because any added work increases duration, even if the approved critical path and completion milestone remain unchanged, so the original schedule variance should be replaced with total added work-package duration",
      "Only the benefit forecast is affected because schedule measures may be rebased by the project manager whenever scope increases without additional budget, as long as the sponsor verbally confirms that the new work is strategically necessary"
    ],
    "answer": 1,
    "why": "Variance has meaning only against an authorized baseline. Moving unapproved work into a later period can manufacture a zero schedule variance without recovering the original commitment. The team must preserve the original performance record, evaluate the scope decision, and establish a revised baseline only through authorized change control. <b>B. The reported recovery is not valid until performance is reconciled to the approved baseline and the added scope is separately authorized, time-phased, and incorporated through change control</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 14, Project Management Principles, Measurement, and Monitoring, pp. 202-218.</span>",
    "optionRationales": [
      "Sponsor interest does not replace the approved change-control and baseline-governance process.",
      "Correct. It protects historical performance integrity while allowing authorized scope and baseline revision.",
      "Added work may or may not change the critical path, so lateness cannot be inferred without schedule analysis.",
      "Unauthorized rebasing affects schedule transparency and governance even when no immediate budget is added."
    ],
    "formula": null,
    "assumptions": [
      "The zero variance was calculated against the informally revised dates rather than the approved baseline."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "baseline integrity",
      "change control",
      "schedule variance",
      "scope change",
      "project monitoring"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 14 - Project Management Principles, Measurement, and Monitoring",
    "sourcePages": "202-218",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Project Management Principles; Measurement; Monitoring",
        "pages": "202-218"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-063",
    "set": 2,
    "batch": 3,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Management",
      "subdomain": "B. Project Oversight and Management",
      "topic": "Corrective action and stakeholder response"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Best-next-action project recovery scenario",
    "industry": "Third-party logistics",
    "quantitative": false,
    "stem": "A warehouse-layout project will miss its pilot date because late carrier-interface requirements invalidated part of the design. No additional engineers are available, and shortening validation would increase customer risk. What should the Master Black Belt coach the project leader to do first?",
    "options": [
      "Shorten validation and document the increased risk after launch because the approved date is the only project constraint visible to customers",
      "Remove the carrier-interface requirement from scope without sponsor approval so the original pilot date and earned-value baseline remain intact",
      "Contain immediate customer exposure, verify the root cause and critical-path impact, then present stakeholders with explicit scope, schedule, and risk recovery alternatives and a recommendation",
      "Accept the delay without further analysis because the lack of available engineers proves that no corrective action or stakeholder choice remains possible"
    ],
    "answer": 2,
    "why": "Corrective action begins by containing the problem, understanding its cause and schedule effect, and developing feasible responses. When no option preserves every constraint, the project leader must make tradeoffs visible and obtain an informed stakeholder decision rather than silently reducing validation, scope, or accountability. <b>C. Contain immediate customer exposure, verify the root cause and critical-path impact, then present stakeholders with explicit scope, schedule, and risk recovery alternatives and a recommendation</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 14, Corrective Action, pp. 217-218.</span>",
    "optionRationales": [
      "Reducing validation without an informed risk decision transfers schedule pressure into customer exposure.",
      "A project leader cannot silently remove an approved requirement to preserve a historical baseline.",
      "Correct. It follows containment and diagnosis with transparent, stakeholder-owned recovery tradeoffs.",
      "Resource scarcity limits options but does not eliminate analysis, containment, resequencing, or governance decisions."
    ],
    "formula": null,
    "assumptions": [
      "The interface requirement is valid and customer-relevant.",
      "The pilot can be contained while stakeholders decide the recovery path."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "corrective action",
      "containment",
      "schedule recovery",
      "stakeholder tradeoff",
      "critical path"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 14 - Supply/Demand Management and Corrective Action",
    "sourcePages": "217-218",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Supply/Demand Management; Corrective Action",
        "pages": "217-218"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-064",
    "set": 2,
    "batch": 3,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Management",
      "subdomain": "D. Project Financial Tools",
      "topic": "Hard-dollar NPV and separate treatment of cost avoidance"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Multi-step financial governance problem",
    "industry": "Telecommunications",
    "quantitative": true,
    "stem": "A network-automation project requires $1.20 million now and is expected to produce $420,000 of validated annual bottom-line cash savings for four year-end periods. It also claims avoidance of $250,000 per year of unbudgeted future workload for the same four years, without an approved spending plan or demonstrable cash reduction. At a 10% annual discount rate, the four-period annuity factor is 3.1699. Which benefit statement is most defensible?",
    "options": [
      "Hard-dollar NPV is approximately positive $131,000; report the $250,000 cost avoidance separately and retain its assumptions rather than adding it automatically to cash flow",
      "Hard-dollar NPV is approximately negative $780,000 because only the first year of savings may be recognized before the process has demonstrated four years of control and Finance should defer every later cash flow until it is realized",
      "Total NPV is approximately positive $924,000 because both hard savings and unbudgeted cost avoidance are equivalent cash inflows at project authorization",
      "The project has zero NPV because validated annual savings should be treated as a reduction in the original investment rather than discounted operating cash flow"
    ],
    "answer": 0,
    "why": "The present value of validated hard savings is $420,000(3.1699) = $1,331,358. Subtracting the $1.20 million investment gives an NPV of about $131,358. The unbudgeted workload is cost avoidance, not automatically a bottom-line cash flow, so it should be disclosed and governed separately. <b>A. Hard-dollar NPV is approximately positive $131,000; report the $250,000 cost avoidance separately and retain its assumptions rather than adding it automatically to cash flow</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapters 9 and 16, Project Cash Flow and Costing Concepts, pp. 141-143 and 225-232.</span>",
    "optionRationales": [
      "Correct. It discounts the verified cash savings and preserves the hard-dollar versus cost-avoidance distinction.",
      "The supplied four-period cash-flow assumption should be evaluated, not arbitrarily reduced to one period.",
      "Including the unsubstantiated $250,000 per year produces $923,833, rounding to $924,000, but it improperly treats unbudgeted workload avoidance as verified cash savings.",
      "Recurring savings are discounted future cash flows; they are not merely a nominal reduction of initial cost."
    ],
    "formula": "NPV = -$1,200,000 + $420,000(3.1699) = $131,358.",
    "assumptions": [
      "Savings occur at each year end for four years.",
      "The 10% annuity factor is supplied and residual value is zero.",
      "The $420,000 is independently validated bottom-line cash savings.",
      "The stated cash flows and discount rate use a consistent pre-tax valuation basis. Use the supplied 3.1699 annuity factor; no terminal value or additional cash flow is assumed."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "net present value",
      "hard-dollar savings",
      "cost avoidance",
      "annuity factor",
      "benefit validation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapters 9 and 16 - Project Cash Flow and Costing Concepts",
    "sourcePages": "141-143, 225-232",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 9 - Organizational Finance and Business Performance Metrics",
        "section": "Project Cash Flow",
        "pages": "141-143"
      },
      {
        "id": "S2",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 16 - Project Financial Tools",
        "section": "Budgets and Forecasts; Costing Concepts",
        "pages": "225-232"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-065",
    "set": 2,
    "batch": 3,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "A. Training Needs Analysis",
      "topic": "Role-specific needs analysis and nontraining causes"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual training-needs diagnosis",
    "industry": "Food processing",
    "quantitative": false,
    "stem": "The deployment team collected the role-level evidence below. Leadership proposes mandatory advanced-DOE training for everyone because it supports next year's strategy. Which training-needs conclusion is most defensible?",
    "options": [
      "Train every role in advanced DOE now because strategic relevance is sufficient even when a role has no frequent task, observed skill gap, or near-term application, then use course completion as the common readiness requirement for all four roles",
      "Train supervisors first on escalation coaching because high operational impact proves the observed gap is caused primarily by insufficient knowledge, and postpone operator and analyst development until the supervisory course changes escalation results",
      "Match training to verified job and task gaps, preserve targeted DOE development for analysts, and address incentive, ownership, or system causes with nontraining interventions",
      "Train only operators because daily task frequency should always outweigh strategic importance, business impact, and future capability requirements alone"
    ],
    "answer": 2,
    "why": "A training needs analysis links strategy to actual job requirements, performance gaps, affected populations, frequency, and causes. Skill gaps can justify training; incentive, ownership, or system barriers require different interventions. Analysts may need targeted DOE capability for the approved strategy, but blanket training would not address the other evidence. <b>C. Match training to verified job and task gaps, preserve targeted DOE development for analysts, and address incentive, ownership, or system causes with nontraining interventions</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 17, Training Needs Analysis, pp. 236-244.</span>",
    "optionRationales": [
      "Strategic relevance supports planned capability, but not identical content for roles without the task or application.",
      "High impact establishes priority, not whether the root cause is a knowledge or skill deficiency.",
      "Correct. It separates trainable gaps from organizational causes and aligns future training with role demand.",
      "Frequency is one input; risk, impact, strategic need, and causal evidence also shape the plan."
    ],
    "formula": null,
    "assumptions": [
      "The observations and causal assessments were validated with role incumbents and managers."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training needs analysis",
      "job-task analysis",
      "nontraining cause",
      "strategic capability",
      "role segmentation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 17 - Training Needs Analysis",
    "sourcePages": "236-244",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 17 - Training Needs Analysis",
        "section": "Defining the Job; Purposes and Types of Training; Analysis Tools and Techniques",
        "pages": "236-244"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Role",
        "Observed need",
        "Task frequency",
        "Impact",
        "Assessment observation"
      ],
      "rows": [
        [
          "Operators",
          "Interpret SPC signals",
          "Daily",
          "High",
          "Fail standard signal-interpretation tasks in an observed assessment"
        ],
        [
          "Supervisors",
          "Escalate recurring signals",
          "Weekly",
          "High",
          "Explain the response correctly, but bonuses penalize signal escalation"
        ],
        [
          "Analysts",
          "Design multivariable experiments",
          "Rare now; planned next year",
          "High strategic",
          "Have not yet learned the DOE methods required by planned assignments"
        ],
        [
          "Process owners",
          "Close control-plan actions",
          "Monthly",
          "High",
          "Current responsibility documents assign contradictory decision rights"
        ]
      ],
      "auditBatch": 3,
      "auditId": "mbb:set-2:original-065",
      "altText": "Role-level observations list required tasks, their frequency, business impact and observed assessment evidence."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-03/datasets.json#mbb:set-2:original-065",
      "specRef": "test-bank-assets/mbb-160/batch-03/visual-specs.json#mbb:set-2:original-065",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-03/static-fallbacks.html#mbb-set-2-original-065",
      "altText": "Role-level observations list required tasks, their frequency, business impact and observed assessment evidence.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-03/validation.json#mbb:set-2:original-065",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-066",
    "set": 2,
    "batch": 3,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "D. Training Program Evaluation",
      "topic": "Mager learning objectives and multilevel evaluation"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Learning-objective and evaluation design",
    "industry": "Engineering consulting",
    "quantitative": false,
    "stem": "A regression course uses the objective “participants will understand model assumptions” and evaluates success only with a satisfaction survey. Which redesign gives the strongest basis for judging competence and transfer?",
    "options": [
      "Retain the objective, add a harder multiple-choice examination, and treat an average score above 80% as proof that workplace model selection has improved",
      "Change the objective to “know regression deeply,” add instructor observations, and compare participant satisfaction before and after the course and against attendance",
      "List all course topics as objectives, require perfect attendance, and use project savings as the sole measure because business impact subsumes learning",
      "Write observable performance, conditions, and criteria; align the assessment and later transfer and impact measures with stated attribution controls"
    ],
    "answer": 3,
    "why": "Mager's principle requires observable performance, the conditions under which it occurs, and criteria for acceptable performance. Satisfaction measures reaction, not demonstrated competence or transfer. A strong evaluation aligns the learning assessment with the objective and extends to workplace application and business impact while addressing attribution. <b>D. Write observable performance, conditions, and criteria; align the assessment and later transfer and impact measures with stated attribution controls</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 20, Evaluation Models and Mager's Learning Objective Principle, pp. 285-292.</span>",
    "optionRationales": [
      "A test can assess learning, but a score alone does not establish workplace application or a well-formed objective.",
      "Know is not directly observable, and satisfaction does not demonstrate diagnostic performance.",
      "Attendance and business results cannot by themselves locate learning, transfer, or competing causes.",
      "Correct. It creates an assessable objective and connects learning, application, impact, and attribution evidence."
    ],
    "formula": null,
    "assumptions": [
      "The organization can observe later project work and define a relevant business measure."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "Mager objective",
      "performance conditions criteria",
      "training evaluation",
      "learning transfer",
      "attribution"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 20 - Training Effectiveness Evaluation",
    "sourcePages": "285-292",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 20 - Training Effectiveness Evaluation",
        "section": "Validation and Evaluation Models; Mager's Learning Objective Principle; Isolating Training Effects",
        "pages": "285-292"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-067",
    "set": 2,
    "batch": 3,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Mentoring Responsibilities",
      "subdomain": "A. Executives and Champions",
      "topic": "Project sizing and dimensional scope"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Coaching and project-scoping scenario",
    "industry": "E-commerce retail",
    "quantitative": false,
    "stem": "A newly assigned Black Belt has a charter to “reduce product returns globally.” The team is floundering across products, markets, suppliers, and return reasons. How should the Master Black Belt coach the sponsor and Belt?",
    "options": [
      "Select the return reason with the largest recent cost and prescribe its likely solution so the team can bypass additional scoping work",
      "Use Pareto and process evidence to bound the process, product, customer, geography, systems, and relationships; state what is out of scope and verify the boundary still permits root-cause discovery",
      "Keep the global scope because narrowing any dimension would prevent enterprise learning and make financial benefits too small for a Black Belt project",
      "Split the charter immediately into one project per country before checking whether return mechanisms, data definitions, and process ownership actually differ"
    ],
    "answer": 1,
    "why": "The original charter is too broad to be executable. Project sizing should use evidence and explicit dimensions to define both in-scope and out-of-scope boundaries, while avoiding a boundary so narrow that plausible root causes are excluded. The MBB coaches the decision process rather than prescribing an untested solution. <b>B. Use Pareto and process evidence to bound the process, product, customer, geography, systems, and relationships; state what is out of scope and verify the boundary still permits root-cause discovery</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 21, Project Sizing, pp. 299-303.</span>",
    "optionRationales": [
      "A costly category can guide scope, but prescribing a cause or solution before analysis biases the project.",
      "Correct. It uses the dimensional method and explicit exclusions without cutting off causal investigation.",
      "Enterprise relevance does not make an unbounded project executable within finite team resources.",
      "Country projects may be appropriate later, but an automatic split can duplicate work and hide common causes."
    ],
    "formula": null,
    "assumptions": [
      "The sponsor can revise the charter and no single return category is legally mandated."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "project sizing",
      "dimensional scope",
      "out of scope",
      "coaching",
      "Pareto"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 21 - Project Sizing",
    "sourcePages": "299-303",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 21 - Mentoring Champions, Change Agents, and Executives",
        "section": "Project Sizing",
        "pages": "299-303"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-068",
    "set": 2,
    "batch": 3,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Mentoring Responsibilities",
      "subdomain": "B. Teams and Individuals",
      "topic": "Technical reviews and failing-project diagnosis"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Technical-review coaching scenario",
    "industry": "Specialty chemicals",
    "quantitative": false,
    "stem": "At an Analyze tollgate, a Black Belt reports p = 0.03 (the pre-specified significance level is 0.05) for a key predictor and asks to proceed. The residuals trend in run order, the measurement method changed halfway through data collection, and the presentation contains no data-provenance record. What should the Master Black Belt do?",
    "options": [
      "Approve the tollgate because statistical significance at the agreed alpha level outweighs undocumented changes that have not been proven to bias the coefficient, and require the Belt to add a measurement-change footnote before the result is communicated to management",
      "Reject the project permanently because changing a measurement method makes every earlier observation unusable for any future analysis, regardless of calibration, overlap data, or stratification evidence",
      "Pause the causal conclusion, coach the Belt to reconcile provenance and measurement comparability, diagnose residual dependence and model assumptions, then return with evidence proportionate to the tollgate decision",
      "Replace the regression with a nonparametric test because rank-based methods automatically remove run-order dependence and all measurement-system discontinuities"
    ],
    "answer": 2,
    "why": "A p-value is conditional on the data and model being valid. The method change threatens comparability, missing provenance prevents traceability, and ordered residuals challenge independence. A technical review should identify these decision-critical gaps and coach a timely correction rather than approve unsupported causality or terminate without investigation. <b>C. Pause the causal conclusion, coach the Belt to reconcile provenance and measurement comparability, diagnose residual dependence and model assumptions, then return with evidence proportionate to the tollgate decision</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 22, Technical Reviews and Team Facilitation, pp. 309-314.</span>",
    "optionRationales": [
      "Statistical significance does not repair invalid measurement comparability, dependence, or missing traceability.",
      "The observations may be reconciled, stratified, recalibrated, or partially reused after an evidence-based review.",
      "Correct. It protects the decision while using the review as focused technical coaching rather than punishment.",
      "Nonparametric methods do not automatically correct temporal dependence or a discontinuous measurement system."
    ],
    "formula": null,
    "assumptions": [
      "The tollgate decision can be paused without creating an immediate safety risk.",
      "The proposed interpretation is causal. The reported p-value is stipulated model output; raw observations for recalculating it are not supplied."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "technical review",
      "measurement comparability",
      "residual dependence",
      "data provenance",
      "coaching"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 22 - Technical Reviews and Team Facilitation",
    "sourcePages": "309-314",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 22 - Mentoring Black Belts and Green Belts",
        "section": "Technical Reviews; Team Facilitation and Meeting Management",
        "pages": "309-314"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-069",
    "set": 2,
    "batch": 3,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. Measurement Systems Analysis",
      "topic": "ANOVA gage R&R variance components"
    },
    "difficulty": "Expert",
    "cognitive": "Analyze",
    "questionType": "Visual multi-step quantitative MSA interpretation",
    "industry": "Precision machining",
    "quantitative": true,
    "stem": "An ANOVA gage R&R study reports the estimated standard-deviation components below. Include the part-by-appraiser interaction in measurement-system variation. Using % study variation = 100(GR&R SD / total study SD), which conclusion is correct?",
    "options": [
      "Total gage R&R SD is about 1.41 micrometers and its share of total study variation is about 30.0%; the unrounded result requires application-specific justification",
      "GR&R SD is 2.400 micrometers and % study variation is 53.3%, because repeatability, appraiser, and interaction standard deviations must be added directly before the result is divided by part-to-part standard deviation",
      "GR&R SD is 1.000 micrometer and % study variation is 22.2%, because the part-by-appraiser interaction belongs entirely to part-to-part variation",
      "GR&R SD is about 1.414 micrometers and % study variation is 31.4%, because the denominator for study variation is the part-to-part standard deviation alone and interaction has already been included in the numerator"
    ],
    "answer": 0,
    "why": "Add variances, not the displayed standard deviations: GR&R variance is 0.8²+0.6²+1.0²=2.00 µm², giving SD √2=1.414214 µm. Including part-to-part gives total variance 22.25 µm² and total SD 4.716991 µm. Thus %Study Variation is 100√(2/22.25)=29.981267%, within the stipulated 10–30% application-justification band. Its rounded display is 30.0%, but the decision uses the unrounded value. The variance contribution is only 8.988764%; it is a different ratio and must not be compared to an SD-based rule. <b>A. Total gage R&R SD is about 1.41 micrometers and its share of total study variation is about 30.0%; the unrounded result requires application-specific justification</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 24, Variables Measurement Systems and ANOVA Method, pp. 335-346.</span>",
    "optionRationales": [
      "Correct. Squaring and summing the SD components gives the proper GR&R and total SDs, and the unrounded SD ratio invokes the explicitly stated organizational criterion.",
      "Standard deviations cannot be added directly when the independent components are combined into total variance.",
      "The specified part-by-appraiser interaction is measurement-system variation and cannot be discarded from GR&R.",
      "The total-study denominator includes measurement and part-to-part variation, not part variation alone."
    ],
    "formula": "GR&R variance = 0.8² + 0.6² + 1.0² = 2.00 µm²; total variance = 2.00 + 4.5² = 22.25 µm²; %Study Variation = 100√(2/22.25) = 29.981267%. %Variance Contribution = 100(2/22.25) = 8.988764%.",
    "assumptions": [
      "Reported entries are standard deviations of uncorrelated random-effect components from an adequate random-effects ANOVA model.",
      "The interaction is retained as specified and values share micrometer units.",
      "The entries are standard deviations, not variances; retain the part-by-appraiser component in measurement variation.",
      "For this organization, %Study Variation below 10% is acceptable, from 10% through 30% requires application-specific justification, and above 30% is unacceptable. Apply the criterion to unrounded values; rounding is for display only."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "gage R&R",
      "variance components",
      "repeatability",
      "reproducibility",
      "percent study variation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 24 - Variables Measurement Systems and ANOVA Method",
    "sourcePages": "335-346",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 24 - Measurement Systems Analysis",
        "section": "Variables Measurement Systems; ANOVA Method",
        "pages": "335-346"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Variance source",
        "Estimated SD (micrometers)"
      ],
      "rows": [
        [
          "Repeatability",
          "0.800"
        ],
        [
          "Appraiser",
          "0.600"
        ],
        [
          "Part x appraiser",
          "1.000"
        ],
        [
          "Part to part",
          "4.500"
        ]
      ],
      "auditBatch": 3,
      "auditId": "mbb:set-2:original-069",
      "altText": "Standard deviations in micrometers: repeatability 0.800; appraiser 0.600; part-by-appraiser 1.000; part-to-part 4.500."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-03/datasets.json#mbb:set-2:original-069",
      "specRef": "test-bank-assets/mbb-160/batch-03/visual-specs.json#mbb:set-2:original-069",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-03/static-fallbacks.html#mbb-set-2-original-069",
      "altText": "Standard deviations in micrometers: repeatability 0.800; appraiser 0.600; part-by-appraiser 1.000; part-to-part 4.500.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-03/validation.json#mbb:set-2:original-069",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-070",
    "set": 2,
    "batch": 3,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. Measurement Systems Analysis",
      "topic": "Process capability for nonnormal data"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Capability histogram and fitted-distribution interpretation",
    "industry": "Healthcare revenue cycle",
    "quantitative": true,
    "stem": "A stable billing process has the 200 cycle times summarized below. For this exercise, assume a qualified model review selected an adequate two-parameter Weibull model with shape 1.4 and scale 4 days. The upper specification limit is 8 days. Which capability statement is most defensible?",
    "options": [
      "Use a normal Cpk because the sample size of 200 makes the normal model valid; the histogram shape affects only confidence intervals, not estimated nonconformance",
      "Apply a Box-Cox transformation without checking its fit, calculate normal indices, and interpret the transformed specification limit directly in original-day units",
      "Use the observed 14 cycles above the USL as the exact long-term defect probability, because a fitted distribution adds avoidable model uncertainty and the empirical percentage is distribution-free",
      "Using the stipulated Weibull model, estimate P(T > 8) = exp[-(8/4)^1.4] about 0.071; report roughly 7.1% above the USL with model-fit and stability qualifications"
    ],
    "answer": 3,
    "why": "Using the stipulated Weibull survival model, P(T>8)=exp[-(8/4)^1.4]=0.0714315364, or about 7.1%. The boundary issue is resolved by the stated (a,b] bins: the last two bins contain 14 observations strictly above 8 days, giving a sample fraction of 14/200=7.0%, not an exact long-term probability. Model validity, stability and representative independent observations remain conditions; no goodness-of-fit test or fitted parameters can be independently recovered from this grouped histogram alone. <b>D. Using the stipulated Weibull model, estimate P(T > 8) = exp[-(8/4)^1.4] about 0.071; report roughly 7.1% above the USL with model-fit and stability qualifications</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 24, Process Capability for Nonnormal Data, pp. 347-352.</span>",
    "optionRationales": [
      "A sample size of 200 does not itself justify a normal population model; use the explicitly stipulated adequate model rather than assuming a normal Cpk interpretation.",
      "A transformation must be selected and validated, and specifications must be transformed consistently before interpretation.",
      "The empirical fraction is a sample estimate with uncertainty, not an exact long-term process probability.",
      "Correct. It applies the stated adequate nonnormal model and keeps its modeling and stability qualifications."
    ],
    "formula": "P(T > 8) = exp[-(8/4)^1.4] = exp(-2.6390) = 0.0714.",
    "assumptions": [
      "The process is stable and the 200 observations are representative and independent.",
      "The two-parameter Weibull model and its supplied parameter estimates are adequate.",
      "Cycle time is measured in positive days and the USL is 8 days.",
      "Histogram bins are lower-exclusive and upper-inclusive: (0,1], (1,2], ..., (9,10] days. No observations lie outside the displayed bins.",
      "Model adequacy and parameters are stipulated for this original example; the grouped histogram is not enough to reconstruct a goodness-of-fit p-value or the fitted parameters."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "nonnormal capability",
      "Weibull",
      "upper specification limit",
      "tail probability",
      "goodness of fit"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 24 - Process Capability for Nonnormal Data",
    "sourcePages": "347-352",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 24 - Measurement Systems Analysis",
        "section": "Process Capability for Nonnormal Data",
        "pages": "347-352"
      }
    ],
    "chart": {
      "type": "histogram",
      "title": "Billing cycle-time distribution",
      "xLabel": "Cycle time (days)",
      "yLabel": "Invoices",
      "binEdges": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "counts": [
        24,
        32,
        34,
        28,
        23,
        18,
        14,
        13,
        8,
        6
      ],
      "referenceValue": 8,
      "referenceLabel": "USL = 8 days",
      "auditBatch": 3,
      "auditId": "mbb:set-2:original-070",
      "altText": "Cycle-time counts in successive one-day bins (0,1] through (9,10]: 24, 32, 34, 28, 23, 18, 14, 13, 8, 6. USL: 8 days."
    },
    "visual": {
      "type": "histogram",
      "datasetRef": "test-bank-assets/mbb-160/batch-03/datasets.json#mbb:set-2:original-070",
      "specRef": "test-bank-assets/mbb-160/batch-03/visual-specs.json#mbb:set-2:original-070",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-03/static-fallbacks.html#mbb-set-2-original-070",
      "altText": "Cycle-time counts in successive one-day bins (0,1] through (9,10]: 24, 32, 34, 28, 23, 18, 14, 13, 8, 6. USL: 8 days.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-03/validation.json#mbb:set-2:original-070",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-071",
    "set": 2,
    "batch": 3,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Residual autocorrelation and ARIMA model adequacy"
    },
    "difficulty": "Expert",
    "cognitive": "Analyze",
    "questionType": "Interactive autocorrelation diagnostic",
    "industry": "Energy demand forecasting",
    "quantitative": false,
    "stem": "After fitting a trend-and-seasonality model to 100 equally spaced demand observations, the analyst plots the residual ACF shown below. The approximate pointwise 95% reference bounds are plus or minus 0.196. Which review conclusion should the Master Black Belt make?",
    "options": [
      "The residuals are independent because all autocorrelations decay toward zero, so the current forecast intervals and coefficient tests require no revision",
      "The early-lag pattern indicates residual dependence; investigate time-series structure, compare suitable candidates and require residual diagnostics and forecast validation before release",
      "The residuals show only seasonality because the largest bar occurs at lag 1, so add a seasonal difference of 12 without examining the original series or residual pattern",
      "Replace the time-series model with ordinary multiple regression because regression coefficients are unbiased whenever the response has equally spaced observations"
    ],
    "answer": 1,
    "why": "Lags 1 and 2 have large positive residual correlations (0.61 and 0.37); lag 3 is 0.20, only slightly above the approximate 0.196 pointwise reference. This pattern warrants further model investigation rather than accepting residual independence. It does not uniquely identify an autoregressive order, establish 12-period seasonality, or replace residual diagnostics and forecast validation. The pointwise screen is not a simultaneous confidence envelope across all lags. <b>B. The early-lag pattern indicates residual dependence; investigate time-series structure, compare suitable candidates and require residual diagnostics and forecast validation before release</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 25, Autocorrelation and Forecasting, pp. 353-369.</span>",
    "optionRationales": [
      "Decay does not establish independence when bars exceed the significance bounds at multiple lags.",
      "Correct. The displayed early-lag dependence calls for comparing plausible models and validating residual and forecasting performance without claiming the ACF alone identifies one unique model.",
      "A lag-1 maximum is not evidence of a 12-period seasonal effect, and seasonal differencing cannot be selected from this claim.",
      "Equally spaced observations do not remove serial correlation or make ordinary-regression errors independent."
    ],
    "formula": "Approximate ACF bound = plus or minus 1.96/sqrt(100) = plus or minus 0.196.",
    "assumptions": [
      "Residuals correspond to the fitted model and are ordered at equal intervals.",
      "The ±1.96/√100 reference lines are an approximate pointwise diagnostic screen, not a simultaneous 95% guarantee or a complete test of a fitted model."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "autocorrelation function",
      "ARIMA",
      "white noise",
      "residual diagnostics",
      "forecast adequacy"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 25 - Autocorrelation and Forecasting",
    "sourcePages": "353-369",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Autocorrelation and Forecasting",
        "pages": "353-369"
      }
    ],
    "chart": {
      "type": "acf-plot",
      "title": "Residual autocorrelation function",
      "xLabel": "Lag",
      "yLabel": "Autocorrelation",
      "lags": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "values": [
        0.61,
        0.37,
        0.2,
        0.08,
        -0.02,
        -0.09,
        -0.06,
        0.04,
        0.01,
        -0.03
      ],
      "confidence": 0.196,
      "auditBatch": 3,
      "auditId": "mbb:set-2:original-071",
      "altText": "Residual ACF for lags 1–10: 0.61, 0.37, 0.20, 0.08, −0.02, −0.09, −0.06, 0.04, 0.01, −0.03. Approximate pointwise references: ±0.196."
    },
    "visual": {
      "type": "acf-plot",
      "datasetRef": "test-bank-assets/mbb-160/batch-03/datasets.json#mbb:set-2:original-071",
      "specRef": "test-bank-assets/mbb-160/batch-03/visual-specs.json#mbb:set-2:original-071",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-03/static-fallbacks.html#mbb-set-2-original-071",
      "altText": "Residual ACF for lags 1–10: 0.61, 0.37, 0.20, 0.08, −0.02, −0.09, −0.06, 0.04, 0.01, −0.03. Approximate pointwise references: ±0.196.",
      "interactionPurpose": "Inspect the same chronological observation values using a native selector, keyboard focus or touch; an equivalent data table is provided.",
      "validationRef": "test-bank-assets/mbb-160/batch-03/validation.json#mbb:set-2:original-071",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-072",
    "set": 2,
    "batch": 3,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "GLM interaction and conditional effects"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Interaction-plot and GLM interpretation",
    "industry": "Customer-service training",
    "quantitative": true,
    "stem": "In an original balanced 2×2 study, ten independent teams per cell use Method A or B under low or high workload. Each observation is a team's first-contact-resolution percentage. The four means are plotted, and the fixed-effects ANOVA uses a pooled within-cell mean square of 49 percentage-points squared with 36 error degrees of freedom. At α = 0.05, which interpretation should guide deployment?",
    "options": [
      "The average method difference is 9 percentage points, so replacing B with A improves first-contact resolution by 9 points under both workload conditions.",
      "The two-point mean difference at low workload establishes equivalence, so either method may be deployed interchangeably at low and high workload.",
      "The method difference depends on workload: compare the 2-point and 16-point simple effects with uncertainty and operating conditions rather than relying on the marginal mean alone.",
      "The nonparallel mean profiles establish unequal residual variances, so discard the factorial model before interpreting any method or workload effect."
    ],
    "answer": 2,
    "why": "The method means average 60% for A and 51% for B, but their 9-point marginal difference does not apply uniformly. A−B is 2 percentage points under low workload and 16 points under high workload. In the balanced ten-team-per-cell design, method, workload and interaction SS are 810, 1210 and 490; division by the stipulated MSE 49 gives F(1,36) values 16.530612, 24.693878 and 10, with p≈0.000249, 0.0000165 and 0.003173. Interpret this interaction using conditional effects and uncertainty, not a universal 9-point benefit. A small observed difference is not a test of equivalence, and nonparallel means are not a residual-variance diagnostic. <b>C. The method difference depends on workload: compare the 2-point and 16-point simple effects with uncertainty and operating conditions rather than relying on the marginal mean alone.</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 25, General Linear Models and Assumptions Testing, pp. 399-402.</span>",
    "optionRationales": [
      "Nine points is the marginal average, not the method difference under each workload; the simple effects are 2 and 16 points.",
      "Observed closeness is not equivalence evidence, and the high-workload difference directly contradicts interchangeability across both conditions.",
      "Correct. The interaction means method differences are conditional; examine simple effects, their uncertainty and operational relevance.",
      "An interaction plot describes conditional means. It cannot establish unequal residual variances; those require separate residual evidence."
    ],
    "formula": "Method SS=810, workload SS=1210, interaction SS=490; MSE=49 pp²; F(1,36)=16.530612, 24.693878, 10.000000. Error SS=49×36=1764. Method simple effects A−B: 2 pp (low), 16 pp (high).",
    "assumptions": [
      "This is an explicitly authored synthetic study, not recovered raw data from the textbook.",
      "Methods are randomly assigned to independent teams within each workload condition, with ten teams in each of four cells. The fixed-effects model includes method, workload and their interaction.",
      "Independent approximately normal errors with a common within-cell variance are assumed adequate; the response is a team-level percentage, not an individual binary outcome.",
      "Higher first-contact resolution is desirable; statistical significance does not establish a business threshold or low-workload equivalence."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "general linear model",
      "interaction effect",
      "simple effects",
      "adjusted means",
      "conditional interpretation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 25 - General Linear Models",
    "sourcePages": "399-402",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "General Linear Models; Testing the Assumptions",
        "pages": "399-402"
      }
    ],
    "chart": {
      "type": "two-level-interaction",
      "factorA": "Workload",
      "factorB": "Training method",
      "xLowLabel": "Low workload",
      "xHighLabel": "High workload",
      "yLabel": "First-contact resolution (%)",
      "yDomain": [
        0,
        100
      ],
      "yTicks": [
        0,
        20,
        40,
        60,
        80,
        100
      ],
      "lowLabel": "Method A",
      "highLabel": "Method B",
      "lowLine": [
        62,
        58
      ],
      "highLine": [
        60,
        42
      ],
      "title": "First-contact resolution by method and workload",
      "anova": {
        "columns": [
          "Source",
          "Sum of squares (pp²)",
          "df",
          "F",
          "p"
        ],
        "rows": [
          [
            "Method",
            810,
            1,
            "16.5306",
            "0.000249"
          ],
          [
            "Workload",
            1210,
            1,
            "24.6939",
            "0.000017"
          ],
          [
            "Method × workload",
            490,
            1,
            "10.0000",
            "0.003173"
          ],
          [
            "Error",
            1764,
            36,
            "—",
            "—"
          ]
        ],
        "replicatesPerCell": 10,
        "meanSquareError": 49,
        "errorDegreesOfFreedom": 36
      },
      "auditBatch": 3,
      "auditId": "mbb:set-2:original-072",
      "altText": "Team mean resolution: Method A 62% and 58%; Method B 60% and 42%, at low and high workload respectively. See the supplied ANOVA table."
    },
    "visual": {
      "type": "two-level-interaction",
      "datasetRef": "test-bank-assets/mbb-160/batch-03/datasets.json#mbb:set-2:original-072",
      "specRef": "test-bank-assets/mbb-160/batch-03/visual-specs.json#mbb:set-2:original-072",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-03/static-fallbacks.html#mbb-set-2-original-072",
      "altText": "Team mean resolution: Method A 62% and 58%; Method B 60% and 42%, at low and high workload respectively. See the supplied ANOVA table.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-03/validation.json#mbb:set-2:original-072",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-073",
    "set": 2,
    "batch": 3,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Monte Carlo simulation verification and risk interpretation"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Simulation-output and risk-distribution interpretation",
    "industry": "Semiconductor capital investment",
    "quantitative": true,
    "stem": "A verified Monte Carlo model produced the 2,000 simulated project NPVs shown below, in millions of dollars. The approval policy requires an estimated probability of negative NPV no greater than 10%. What recommendation is supported by this simulation output?",
    "options": [
      "Do not approve under current policy: 310 of 2,000 trials are below zero (15.5%), above the 10% limit; mitigate key risks and rerun the verified model",
      "Approve because the binned mean is approximately $1.235 million and a positive expected NPV overrides any tail-risk criterion based on fewer than half the trials",
      "Approve because 84.5% of trials are nonnegative, which exceeds a simple majority and therefore satisfies the 10% negative-outcome policy while preserving a positive portfolio success rate",
      "Reject the model because any negative trial proves the input distributions are infeasible and invalidates the simulation for this decision"
    ],
    "answer": 0,
    "why": "The four bins below zero contain 20+35+80+175 = 310 trials. Dividing by 2,000 gives 0.155, or 15.5%, which exceeds the stated 10% limit even though the midpoint-weighted mean is positive. The correct response is to examine sensitivity and mitigation, then rerun the already verified model with justified changes. <b>A. Do not approve under current policy: 310 of 2,000 trials are below zero (15.5%), above the 10% limit; mitigate key risks and rerun the verified model</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 25, Simulation, pp. 414-416.</span>",
    "optionRationales": [
      "Correct. It applies the explicit tail-risk policy and uses simulation to guide targeted risk reduction.",
      "A positive mean and a tail-probability constraint answer different governance questions; both must be respected.",
      "A 15.5% negative rate exceeds, rather than satisfies, the maximum 10% loss-probability policy.",
      "Negative outcomes can be legitimate consequences of uncertain feasible inputs and do not alone invalidate a model."
    ],
    "formula": "Estimated P(NPV < 0) = (20 + 35 + 80 + 175) / 2000 = 310 / 2000 = 15.5%.",
    "assumptions": [
      "The simulation model has been verified and validated for the decision context.",
      "Trials are independent draws from the approved input distributions.",
      "Bin endpoints at zero place zero and positive values in the nonnegative bin.",
      "Bins are lower-inclusive and upper-exclusive [a,b), except the final bin includes 4; these bins contain all 2,000 simulated outcomes."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "Monte Carlo simulation",
      "tail risk",
      "negative NPV",
      "model verification",
      "sensitivity analysis"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 25 - Simulation",
    "sourcePages": "414-416",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Simulation",
        "pages": "414-416"
      }
    ],
    "chart": {
      "type": "histogram",
      "title": "Simulated project NPV",
      "xLabel": "NPV ($ millions)",
      "yLabel": "Simulation trials",
      "binEdges": [
        -2,
        -1.5,
        -1,
        -0.5,
        0,
        0.5,
        1,
        1.5,
        2,
        2.5,
        3,
        3.5,
        4
      ],
      "counts": [
        20,
        35,
        80,
        175,
        240,
        300,
        320,
        290,
        230,
        170,
        100,
        40
      ],
      "referenceValue": 0,
      "referenceLabel": "NPV = $0",
      "auditBatch": 3,
      "auditId": "mbb:set-2:original-073",
      "altText": "Simulated NPV counts from −2 to 4 million dollars in half-million bins: 20, 35, 80, 175, 240, 300, 320, 290, 230, 170, 100, 40."
    },
    "visual": {
      "type": "histogram",
      "datasetRef": "test-bank-assets/mbb-160/batch-03/datasets.json#mbb:set-2:original-073",
      "specRef": "test-bank-assets/mbb-160/batch-03/visual-specs.json#mbb:set-2:original-073",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-03/static-fallbacks.html#mbb-set-2-original-073",
      "altText": "Simulated NPV counts from −2 to 4 million dollars in half-million bins: 20, 35, 80, 175, 240, 300, 320, 290, 230, 170, 100, 40.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-03/validation.json#mbb:set-2:original-073",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-074",
    "set": 2,
    "batch": 3,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "C. Design of Experiments",
      "topic": "Balanced incomplete block design recognition"
    },
    "difficulty": "Very Hard",
    "cognitive": "Understand",
    "questionType": "DOE design-matrix recognition",
    "industry": "Biopharmaceutical development",
    "quantitative": false,
    "stem": "A laboratory must compare four formulations, but each raw-material lot can support only three formulations. The proposed incidence matrix shows which formulation is tested in each lot. Which description of the design is correct?",
    "options": [
      "It is a randomized complete block design because every formulation appears somewhere in every set of four lots, even though each individual lot omits one formulation and has insufficient material for the complete treatment set",
      "It is a Latin square because each formulation occurs three times and the omitted cells serve as a second orthogonal blocking factor, with lots acting as rows and the remaining incidence positions acting as columns",
      "It is an unbalanced incomplete block design because no block contains all four formulations and therefore pairwise balance is impossible, even when every treatment and treatment pair has equal replication across the complete experiment",
      "It is a balanced incomplete block design: each lot contains three formulations, each formulation occurs in three lots, and every formulation pair occurs together twice"
    ],
    "answer": 3,
    "why": "Every block is incomplete because lot capacity k=3 is smaller than v=4 treatments. The design is balanced: each treatment appears r=3 times, and each of the six treatment pairs appears together in exactly lambda=2 blocks. This permits treatment comparisons despite the physical block limit. <b>D. It is a balanced incomplete block design: each lot contains three formulations, each formulation occurs in three lots, and every formulation pair occurs together twice</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 26, Complex Blocking Structures and BIBD, pp. 434-438.</span>",
    "optionRationales": [
      "A complete block must contain every treatment within each block; each lot here omits one formulation.",
      "A Latin square requires two blocking dimensions with each treatment appearing once per row and column.",
      "Incomplete blocks can be pairwise balanced, as the equal pair concurrence in this matrix demonstrates.",
      "Correct. The incidence counts satisfy v=4, b=4, k=3, r=3, and lambda=2."
    ],
    "formula": "BIBD checks: bk = vr = 4(3) = 4(3) = 12; lambda(v-1) = r(k-1) = 2(3) = 3(2) = 6.",
    "assumptions": [
      "Lot is the nuisance block and formulation is the treatment factor.",
      "Run order is randomized within each lot.",
      "Treatment-by-lot interaction is negligible for the intended model.",
      "Each Test entry represents a distinct experimental unit. A dash means that formulation is not run in that lot, not a missing result from a complete design."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "balanced incomplete block design",
      "BIBD",
      "blocking",
      "treatment concurrence",
      "DOE matrix"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 26 - Complex Blocking Structures",
    "sourcePages": "434-438",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 26 - Design of Experiments",
        "section": "Complex Blocking Structures; Balanced Incomplete Block Design",
        "pages": "434-438"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Formulation",
        "Lot 1",
        "Lot 2",
        "Lot 3",
        "Lot 4"
      ],
      "rows": [
        [
          "A",
          "Test",
          "Test",
          "-",
          "Test"
        ],
        [
          "B",
          "-",
          "Test",
          "Test",
          "Test"
        ],
        [
          "C",
          "Test",
          "Test",
          "Test",
          "-"
        ],
        [
          "D",
          "Test",
          "-",
          "Test",
          "Test"
        ]
      ],
      "auditBatch": 3,
      "auditId": "mbb:set-2:original-074",
      "altText": "The formulation-by-lot incidence matrix places A in Lots 1, 2, 4; B in 2, 3, 4; C in 1, 2, 3; D in 1, 3, 4."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-03/datasets.json#mbb:set-2:original-074",
      "specRef": "test-bank-assets/mbb-160/batch-03/visual-specs.json#mbb:set-2:original-074",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-03/static-fallbacks.html#mbb-set-2-original-074",
      "altText": "The formulation-by-lot incidence matrix places A in Lots 1, 2, 4; B in 2, 3, 4; C in 1, 2, 3; D in 1, 3, 4.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-03/validation.json#mbb:set-2:original-074",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-075",
    "set": 2,
    "batch": 3,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "D. Automated Process Control and Statistical Process Control",
      "topic": "Closed-loop feedback-system integrity"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Automated-control system diagnosis",
    "industry": "Pulp and paper processing",
    "quantitative": false,
    "stem": "A moisture controller measures sheet moisture at a sensor upstream of the steam valve it manipulates. The controller calculates an error and moves the valve correctly, but that valve cannot affect the upstream measurement. Operators keep retuning the controller to eliminate oscillation. What should the Master Black Belt recommend first?",
    "options": [
      "Increase controller gain until the upstream sensor responds, because a sufficiently strong manipulated-variable change will always close a feedback loop even when the measurement is physically upstream of the final control element",
      "Correct the control architecture so the manipulated steam variable can affect the measured downstream moisture, verify sensor and actuator dynamics, then tune and monitor the closed loop",
      "Replace the moisture sensor with an attribute pass-fail inspection because feedback control is inappropriate whenever the process has transport delay and an attribute decision removes the need to characterize dynamic response",
      "Keep the architecture and add SPC limits to the upstream signal, because statistical limits make the measurement responsive to downstream valve changes"
    ],
    "answer": 1,
    "why": "A closed feedback loop requires measurement, decision, and action in a causal path where the action returns to affect the next measurement. Here the sensor is upstream of the manipulated valve, so retuning cannot repair the broken loop and may amplify oscillation. The architecture and dynamics must be corrected before tuning or SPC interpretation. <b>B. Correct the control architecture so the manipulated steam variable can affect the measured downstream moisture, verify sensor and actuator dynamics, then tune and monitor the closed loop</b> <span class=\"tb-source-ref\">Source: Kubiak, Chapter 27, Basic Control Systems, pp. 451-453.</span>",
    "optionRationales": [
      "Controller gain cannot create a missing causal path from the final control element back to the sensor.",
      "Correct. It restores the required measurement-decision-action feedback relationship before optimization.",
      "Transport delay complicates tuning but does not require replacing a valid continuous measurement with attributes.",
      "SPC limits can monitor data but cannot make an upstream measurement respond to a downstream action."
    ],
    "formula": null,
    "assumptions": [
      "The valve is the intended final control element and the sensor location is described correctly."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "automated process control",
      "closed-loop feedback",
      "sensor location",
      "final control element",
      "controller tuning"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook",
    "sourceSection": "Chapter 27 - Basic Control Systems",
    "sourcePages": "451-453",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook",
        "chapter": "Chapter 27 - Automated Process Control and Statistical Process Control",
        "section": "Terminology; Advantages of APC; Basic Control Systems",
        "pages": "451-453"
      }
    ]
  }
];

  function q5(number,sub,bok,difficulty,cognitive,questionType,industry,stem,options,answer,explanation,rationales,sourceSection,sourcePages,extra){
    var qid='mbb:set-2:original-'+String(number).padStart(3,'0');
    var correct=String.fromCharCode(65+answer)+'. '+options[answer];
    var question={
      qid:qid,set:2,batch:5,sub:sub,bok:bok,difficulty:difficulty,cognitive:cognitive,
      questionType:questionType,industry:industry,quantitative:Boolean(extra&&extra.quantitative),stem:stem,options:options,answer:answer,
      why:explanation+' <b>'+correct+'</b> <span class="tb-source-ref">Source: Kubiak, '+sourceSection+', pp. '+sourcePages+'.</span>',
      optionRationales:rationales,formula:extra&&extra.formula||null,
      assumptions:extra&&extra.assumptions||['The scenario provides the material evidence needed for the decision.'],
      estimatedMinutes:extra&&extra.estimatedMinutes||3,keywords:extra&&extra.keywords||bok.topic.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0,6),
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:sourceSection,sourcePages:sourcePages,
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:sourceSection,section:bok.topic,pages:sourcePages}]
    };
    if(extra&&extra.chart){question.chart=extra.chart;question.visual=visual5(qid,extra.chart.type,extra.altText,extra.interactionPurpose);}
    return question;
  }

  var batch5=[
  {
    "qid": "mbb:set-2:original-101",
    "set": 2,
    "batch": 5,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "B. Strategic Plan Alignment",
      "topic": "2. Project alignment with strategic plan",
      "reference": "I.B.2"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Cross-industry enterprise/deployment case",
    "quantitative": false,
    "stem": "The matrix links an annual customer-retention objective to three improvement priorities. A blank relationship cell means the proposed link has not yet been reviewed, not that no relationship exists. Before approving the plan, which action best closes the traceability gap?",
    "options": [
      "Review and document how P3 supports retention, then align its owner, actions and measure with the objective",
      "Replace all three measures with 90-day retention so every team is evaluated only on the same lagging result",
      "Remove P3 from the portfolio because its blank relationship cell proves it cannot affect customer retention",
      "Assign all three priorities to Quality so a single functional owner can eliminate cross-functional dependencies"
    ],
    "answer": 0,
    "why": "A blank cell is incomplete planning evidence, not a statistical test or proof of no relationship. P3 names a retention measure but its proposed contribution has not been reviewed. Leadership should validate and document that logic, resolve ownership and resources, and retain useful operational measures. A shared lagging outcome alone does not establish actionable links, and changing a function label does not remove dependencies. <b>A. Review and document how P3 supports retention, then align its owner, actions and measure with the objective</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 1; Hoshin planning and strategic traceability, pp. 7–17.</span>",
    "optionRationales": [
      "Correct. The review establishes the missing planning link without assuming that a blank cell proves or disproves causation.",
      "One common lagging measure would remove useful leading/process evidence without resolving the missing strategic link.",
      "An unreviewed relationship is not evidence that the priority cannot contribute to the objective.",
      "Functional centralization neither validates P3’s contribution nor eliminates operational dependencies."
    ],
    "formula": null,
    "assumptions": [
      "Strong denotes a planning judgment, not an estimated causal effect.",
      "Blank denotes an unreviewed relationship. Each listed owner is accountable for that priority."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "X matrix",
      "strategic alignment",
      "line of sight",
      "ownership",
      "catchball"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 1; Hoshin planning and strategic traceability",
    "sourcePages": "7–17",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 1",
        "section": "Hoshin planning and strategic traceability",
        "pages": "7–17"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Priority",
        "Retention objective",
        "Primary owner",
        "Measure"
      ],
      "rows": [
        [
          "P1: reduce onboarding delay",
          "Strong",
          "Operations",
          "Median activation days"
        ],
        [
          "P2: prevent early service failures",
          "Strong",
          "Quality",
          "30-day failure rate"
        ],
        [
          "P3: recover at-risk accounts",
          "Blank",
          "Customer success",
          "90-day retention"
        ]
      ],
      "auditBatch": 5,
      "auditId": "mbb:set-2:original-101",
      "altText": "Three priorities, their reviewed relationship ratings, owners and operational measures. A blank is defined as unreviewed."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-05/datasets.json#mbb:set-2:original-101",
      "specRef": "test-bank-assets/mbb-160/batch-05/visual-specs.json#mbb:set-2:original-101",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-05/static-fallbacks.html#mbb-set-2-original-101",
      "altText": "Three priorities, their reviewed relationship ratings, owners and operational measures. A blank is defined as unreviewed.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-05/validation.json#mbb:set-2:original-101",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-102",
    "set": 2,
    "batch": 5,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "F. Pipeline Management",
      "topic": "4. Pipeline risk management",
      "reference": "I.F.4"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": false,
    "stem": "A distribution company selected automation projects using a forecast of stable order mix. Two months later, regulation may sharply increase low-volume hazardous shipments. What should the Master Black Belt recommend at the strategy review?",
    "options": [
      "Cancel automation because a changed external assumption invalidates every project selected under the original plan",
      "Reassess portfolio sensitivity to the proposed rule and set staged commitment and review triggers",
      "Keep the approved portfolio unchanged until annual planning because frequent review undermines strategic discipline",
      "Add hazardous-shipment volume to every project charter without changing priorities, capacity, or benefit forecasts"
    ],
    "answer": 1,
    "why": "Strategic planning is an evidence-driven cycle, not a once-a-year lock. A material external uncertainty should trigger scenario and sensitivity review of the portfolio while avoiding premature cancellation. Preserving options and explicit decision triggers protects value under uncertainty. Blindly retaining, cancelling, or relabeling projects fails to connect environmental change to resource allocation. <b>B. Reassess portfolio sensitivity to the proposed rule and set staged commitment and review triggers</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 1; Strategic planning review and environmental assumptions, pp. 2–17.</span>",
    "optionRationales": [
      "Immediate cancellation discards potentially robust projects before sensitivity is assessed.",
      "Correct. It updates assumptions and stages commitments around a consequential uncertainty.",
      "Governance discipline includes defined reassessment when material assumptions change.",
      "Changing charter language alone does not update economics, dependencies, or capacity."
    ],
    "formula": null,
    "assumptions": [
      "The regulation is proposed, not yet a binding requirement; no immediate compliance deadline has been established.",
      "Current projects can be reviewed and staged without an irreversible immediate commitment."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "scenario planning",
      "environmental scan",
      "portfolio sensitivity",
      "strategic assumptions",
      "real options"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 1; Strategic planning review and environmental assumptions",
    "sourcePages": "2–17",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 1",
        "section": "Strategic planning review and environmental assumptions",
        "pages": "2–17"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-103",
    "set": 2,
    "batch": 5,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "C. Infrastructure Elements of Improvement Systems",
      "topic": "1. Governance",
      "reference": "I.C.1"
    },
    "difficulty": "Expert",
    "cognitive": "Apply",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Finance and insurance",
    "quantitative": false,
    "stem": "A global insurer has a common tollgate standard, but regional champions repeatedly approve benefit baselines that Finance later rejects. Reviews now occur after implementation. Which governance redesign is strongest?",
    "options": [
      "Give Finance sole project-selection and technical-method authority so every future dispute has one decision maker",
      "Keep regional baseline definitions and reconcile their currency conversions only after implementation",
      "Validate benefit baselines with Finance before authorization; document decision rights and review exceptions",
      "Use sponsor approval as the final baseline and avoid later financial review once implementation begins"
    ],
    "answer": 2,
    "why": "The governance failure is late financial validation coupled with inconsistent baseline authority. Agree benefit definitions and validate estimates with Finance before authorizing the charter or investment; specify who approves priorities, financial evidence and technical methods. A controlled exception/change process can then revise assumptions transparently. This reduces the risk of invalid claims; no gate guarantees every forecast will be realized. <b>C. Validate benefit baselines with Finance before authorization; document decision rights and review exceptions</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 3 - Deployment of Six Sigma Systems; Governance, coordination and decision accountability, pp. 28–32.</span>",
    "optionRationales": [
      "Finance validates financial evidence, but assigning it every technical and selection decision does not establish appropriate shared governance.",
      "Currency conversion cannot reconcile incompatible definitions, counterfactuals or benefit baselines.",
      "Correct. Early validation, clear authority and controlled exceptions address the observed failure at the point of commitment.",
      "A signature records approval but does not make invalid calculations correct or remove the need to review changed assumptions."
    ],
    "formula": null,
    "assumptions": [
      "Finance is the designated validator of financial benefit definitions and baselines.",
      "The deployment council retains portfolio oversight; technical methods remain subject to qualified technical review."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "governance",
      "benefit validation",
      "decision rights",
      "tollgate",
      "deployment council"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 3 - Deployment of Six Sigma Systems; Governance, coordination and decision accountability",
    "sourcePages": "28–32",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 3 - Deployment of Six Sigma Systems",
        "section": "Governance, coordination and decision accountability",
        "pages": "28–32"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-104",
    "set": 2,
    "batch": 5,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "D. Improvement Methodologies",
      "topic": "Coordinated Lean, DMAIC and constraint management",
      "reference": "I.D"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "An emergency department has variable arrivals, long diagnostic queues and a verified staffing bottleneck. Immediate safety risks are contained. Leaders propose either a Lean event alone or a six-month DMAIC project with no early operational changes. Which approach is most defensible?",
    "options": [
      "Replace the existing process through DMADV before testing whether its known constraint can be relieved",
      "Run a Lean event and omit demand/service analysis because all observed queue time is removable waste",
      "Complete all DMAIC analysis before permitting any authorized, reversible operational pilot",
      "Test safe constraint-relief pilots while DMAIC models arrivals, service and diagnostic variation"
    ],
    "answer": 3,
    "why": "The case includes an actionable bottleneck and unresolved demand/service variation. Coordinate authorized, reversible flow experiments with reliable measurement and deeper DMAIC analysis; monitor safety, queues and downstream effects in both workstreams. Variable arrivals do not by themselves establish statistical instability, and some waiting can arise even in a stable stochastic service system. Neither a methodology label nor an arbitrary six-month wait determines the right intervention. <b>D. Test safe constraint-relief pilots while DMAIC models arrivals, service and diagnostic variation</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 4; Six Sigma methodologies and coordinated improvement, pp. 53–69.</span>",
    "optionRationales": [
      "A known improvable constraint does not establish that full redesign is required before any pilot.",
      "Stochastic variability and resource utilization can create queues; a Lean event alone does not establish the demand/service model.",
      "Delaying all safe, authorized pilots ignores an actionable constraint and confuses disciplined testing with uncontrolled change.",
      "Correct. The coordinated approach addresses the known flow issue and the uncertain variation mechanisms without bypassing safety."
    ],
    "formula": null,
    "assumptions": [
      "Clinical and operational owners approve pilots and retain patient-safety constraints.",
      "The data establish a bottleneck, not the complete causes of every queue."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "DMAIC",
      "Lean",
      "theory of constraints",
      "queue variation",
      "method integration"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 4; Six Sigma methodologies and coordinated improvement",
    "sourcePages": "53–69",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 4",
        "section": "Six Sigma methodologies and coordinated improvement",
        "pages": "53–69"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-105",
    "set": 2,
    "batch": 5,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "F. Pipeline Management",
      "topic": "2. Pipeline life-cycle management",
      "reference": "I.F.2"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Public sector, nonprofit, and regulated operations",
    "quantitative": false,
    "stem": "A public agency has nine Belt-months in the current planning window. R is mandatory. S is ready for authorization. T discovery defines the scope of a data foundation; it does not implement that foundation. U cannot start until the foundation is built and its gate is passed. Which authorization respects these conditions?",
    "options": [
      "Authorize R, S and T discovery; reassess U only after its built-foundation gate",
      "Authorize S and U because their combined stated benefit is largest and request an exception for R",
      "Authorize R, T, and U simultaneously because dependency risk is removed when related projects start together",
      "Start R, S, T, and U at partial allocation so every sponsor sees progress"
    ],
    "answer": 0,
    "why": "The authorized window can accommodate R (3 Belt-months), S (5) and T discovery (1): 3 + 5 + 1 = 9. Discovery creates information for a later foundation decision; it does not satisfy U’s implementation prerequisite. U is neither ready nor eligible for concurrent authorization. Starting all proposals at partial allocation cannot supply missing work or pass the prerequisite gate. The what-if capacity control is exploratory; the scored question always uses nine Belt-months. <b>A. Authorize R, S and T discovery; reassess U only after its built-foundation gate</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 6 - Risk Analysis of Projects and the Pipeline; Qualification, selection and prioritization, pp. 97–99.</span>",
    "optionRationales": [
      "Correct. The allocation respects the mandate and nine-month budget while obtaining information for a later prerequisite decision.",
      "S and U would omit mandatory R, and U has not passed the prerequisite implementation gate.",
      "Starting T discovery is not completing the data foundation; concurrent starts do not remove U’s dependency.",
      "Splitting allocations cannot make the 13 Belt-month total fit nine months or make an unready project eligible."
    ],
    "formula": "Authorized effort = 3 + 5 + 1 = 9 Belt-months",
    "assumptions": [
      "Work packages are indivisible within this window, and their effort is additive; there is no unlisted resource pool.",
      "T discovery is ready and costs one Belt-month. Any subsequent foundation implementation needs separate estimation and authorization.",
      "Benefits use comparable present-value bases; U’s indicative estimate has not passed financial/readiness validation.",
      "The scored case is fixed at nine Belt-months. Slider changes do not change the scored answer."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "pipeline management",
      "capacity",
      "dependency",
      "mandatory project",
      "replenishment"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 6 - Risk Analysis of Projects and the Pipeline; Qualification, selection and prioritization",
    "sourcePages": "97–99",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 6 - Risk Analysis of Projects and the Pipeline",
        "section": "Qualification, selection and prioritization",
        "pages": "97–99"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Work package",
        "Effort (Belt-months)",
        "Benefit estimate",
        "Readiness",
        "Condition"
      ],
      "rows": [
        [
          "R",
          "3",
          "$0.55M validated",
          "Ready",
          "Mandatory"
        ],
        [
          "S",
          "5",
          "$1.10M validated",
          "Ready",
          "None"
        ],
        [
          "T discovery",
          "1",
          "Not valued in this decision",
          "Ready",
          "Defines, but does not build, foundation"
        ],
        [
          "U",
          "4",
          "$1.40M indicative",
          "Not ready",
          "Requires built foundation and passed gate"
        ]
      ],
      "whatIf": {
        "id": "mbb-q105-capacity",
        "label": "Hypothetical available Belt-months",
        "min": 7,
        "max": 11,
        "step": 1,
        "value": 9,
        "unit": "Belt-months"
      },
      "auditBatch": 5,
      "auditId": "mbb:set-2:original-105",
      "altText": "Four proposed work packages with effort, benefit basis, readiness and prerequisites. The scored capacity is nine Belt-months."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-05/datasets.json#mbb:set-2:original-105",
      "specRef": "test-bank-assets/mbb-160/batch-05/visual-specs.json#mbb:set-2:original-105",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-05/static-fallbacks.html#mbb-set-2-original-105",
      "altText": "Four proposed work packages with effort, benefit basis, readiness and prerequisites. The scored capacity is nine Belt-months.",
      "interactionPurpose": "Inspect supplied evidence using native touch/keyboard controls; hypothetical settings do not change the scored case.",
      "validationRef": "test-bank-assets/mbb-160/batch-05/validation.json#mbb:set-2:original-105",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-106",
    "set": 2,
    "batch": 5,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "A. Organizational Design",
      "topic": "1. Systems thinking",
      "reference": "II.A.1"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Statistical-output interpretation",
    "industry": "Distribution and supply chain",
    "quantitative": false,
    "stem": "A distribution center changed its replenishment-order rule at the start of Week 5. Customer demand and orders sent to its supplier are shown in units per week. Which interpretation best applies systems thinking without claiming causation from this display alone?",
    "options": [
      "Treat the order swings as supplier noncompliance because customer demand remains comparatively steady",
      "Investigate ordering feedback and delays as possible sources of demand amplification",
      "Conclude that customer demand must have become equally volatile because replenishment orders changed",
      "Restore the previous rule permanently because the timing proves it is the sole cause of the order swings"
    ],
    "answer": 1,
    "why": "The supplier-facing orders fluctuate much more than customer demand after the rule change. This is evidence of demand amplification within the system, not evidence of a comparable change in end-customer demand. Investigate ordering/feedback rules, batching, inventory policies and information delays, while checking other contemporaneous changes and operational consequences. The time pattern motivates a test of the mechanism; it does not establish sole causation or assign blame to the supplier. <b>B. Investigate ordering feedback and delays as possible sources of demand amplification</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 7 - Organizational Design; Systems thinking and feedback, pp. 100–103.</span>",
    "optionRationales": [
      "The series describe the center’s orders, not supplier delivery compliance; the inference attributes a failure to the wrong process.",
      "Correct. It treats amplification as a system-level signal and investigates plausible feedback mechanisms without assuming a proven cause.",
      "The displayed customer-demand observations do not exhibit swings comparable to the replenishment-order series.",
      "The before/after timing does not isolate the policy from other changes or justify an untested permanent reversal."
    ],
    "formula": null,
    "assumptions": [
      "This is an audit-authored illustrative dataset; both series refer to the same product, unit and weekly boundary.",
      "Orders are issued by the distribution center; they are not supplier deliveries.",
      "No controlled causal comparison or evidence of intent is provided."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "systems thinking",
      "demand amplification",
      "ordering feedback",
      "information delay"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 7 - Organizational Design; Systems thinking and feedback",
    "sourcePages": "100–103",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 7 - Organizational Design",
        "section": "Systems thinking and feedback",
        "pages": "100–103"
      },
      {
        "id": "P1",
        "document": "MIT / Croson et al., Order stability in supply chains",
        "section": "Supplemental technical validation",
        "url": "https://web.mit.edu/~jsterman/www/Order_stability.html"
      }
    ],
    "chart": {
      "type": "multi-time-series",
      "title": "Customer demand and replenishment orders",
      "xLabel": "Week",
      "yLabel": "Units per week",
      "units": "units per week",
      "labels": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10"
      ],
      "series": [
        {
          "label": "Customer demand",
          "data": [
            100,
            102,
            98,
            100,
            101,
            99,
            102,
            98,
            100,
            100
          ]
        },
        {
          "label": "Replenishment orders",
          "data": [
            100,
            102,
            98,
            100,
            60,
            140,
            50,
            150,
            40,
            160
          ]
        }
      ],
      "yDomain": [
        0,
        180
      ],
      "referenceValue": 5,
      "referenceLabel": "Ordering rule changes at start of Week 5",
      "referenceOrientation": "vertical",
      "auditBatch": 5,
      "auditId": "mbb:set-2:original-106",
      "altText": "Two weekly series: customer demand and replenishment orders in units per week. A vertical marker identifies the ordering-rule change at the start of Week 5."
    },
    "visual": {
      "type": "multi-time-series",
      "datasetRef": "test-bank-assets/mbb-160/batch-05/datasets.json#mbb:set-2:original-106",
      "specRef": "test-bank-assets/mbb-160/batch-05/visual-specs.json#mbb:set-2:original-106",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-05/static-fallbacks.html#mbb-set-2-original-106",
      "altText": "Two weekly series: customer demand and replenishment orders in units per week. A vertical marker identifies the ordering-rule change at the start of Week 5.",
      "interactionPurpose": "Inspect supplied evidence using native touch/keyboard controls; hypothetical settings do not change the scored case.",
      "validationRef": "test-bank-assets/mbb-160/batch-05/validation.json#mbb:set-2:original-106",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-107",
    "set": 2,
    "batch": 5,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "B. Executive and Team Leadership Roles",
      "topic": "1. Executive leadership roles",
      "reference": "II.B.1"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "A plant manager asks the Master Black Belt to personally negotiate production access for every improvement trial because supervisors protect output targets. What response best preserves deployment accountability?",
    "options": [
      "Accept permanently because the MBB owns project execution and should shield sponsors from operational conflict",
      "Have each Belt negotiate independently; leave the executive production targets unchanged",
      "Have the manager set trial-access rules; the MBB supplies evidence and coaches implementation",
      "Pause every project until supervisors voluntarily change their priorities without executive intervention"
    ],
    "answer": 2,
    "why": "Executives and champions own the environment in which projects can succeed, including priority conflicts, access, resources, and accountability. The MBB should provide evidence, facilitate decisions, and coach, but should not become a substitute sponsor. A standing rule addresses the system rather than repeatedly negotiating exceptions project by project. <b>C. Have the manager set trial-access rules; the MBB supplies evidence and coaches implementation</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 12 - Executive and Team Leadership Roles; Executive authority, resources and barriers, pp. 183–185.</span>",
    "optionRationales": [
      "Permanent substitution weakens sponsor accountability and makes the MBB an operational gatekeeper.",
      "Belts lack the authority to resolve a conflict created by competing executive measures.",
      "Correct. Leadership owns the barrier while the MBB enables an evidence-based solution.",
      "Waiting for voluntary change leaves the misaligned management system untouched."
    ],
    "formula": null,
    "assumptions": [
      "The scenario provides the material evidence needed for the decision."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "executive leadership",
      "sponsorship",
      "decision rights",
      "resource access",
      "MBB role"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 12 - Executive and Team Leadership Roles; Executive authority, resources and barriers",
    "sourcePages": "183–185",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 12 - Executive and Team Leadership Roles",
        "section": "Executive authority, resources and barriers",
        "pages": "183–185"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-108",
    "set": 2,
    "batch": 5,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "C. Organizational Challenges",
      "topic": "3. Interdepartmental conflicts",
      "reference": "II.C.3"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Organizational-dynamics intervention scenario",
    "industry": "Product development and engineering",
    "quantitative": false,
    "stem": "Engineering and Operations dispute ownership of a pilot. Engineering needs design learning; Operations fears schedule loss. Both demand final authority. What should the Master Black Belt do first?",
    "options": [
      "Escalate immediately and ask the executive sponsor to choose the function whose objective has higher financial value",
      "Move design and scheduling authority to Quality because it is a neutral department",
      "Give both functions an unconditional veto over every pilot decision",
      "Agree shared success and risk criteria from the parties’ interests, then allocate decision rights"
    ],
    "answer": 3,
    "why": "The stated positions are competing claims to authority, but the underlying interests are learning, schedule protection, and risk control. Interest-based resolution creates a joint problem statement and explicit decision rights without erasing legitimate functional accountability. Immediate escalation may eventually be needed, but first-line diagnosis and structured agreement improve both commitment and decision quality. <b>D. Agree shared success and risk criteria from the parties’ interests, then allocate decision rights</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 11 - Internal Organizational Challenges; Interdepartmental conflict and negotiation, pp. 177–182.</span>",
    "optionRationales": [
      "Financial ranking alone does not resolve legitimate technical, schedule, and safety interests.",
      "Neutral facilitation can help, but transferring accountability to Quality is inappropriate.",
      "Mutual veto creates deadlock and hides the criteria required for a sound decision.",
      "Correct. It converts positional conflict into explicit interests, safeguards, and authority."
    ],
    "formula": null,
    "assumptions": [
      "No emergency, non-negotiable legal requirement or immediate safety containment determines the outcome.",
      "Both groups have legitimate objectives; the MBB facilitates a documented agreement and escalation path."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "interest-based negotiation",
      "conflict resolution",
      "decision rights",
      "pilot governance",
      "stakeholders"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 11 - Internal Organizational Challenges; Interdepartmental conflict and negotiation",
    "sourcePages": "177–182",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 11 - Internal Organizational Challenges",
        "section": "Interdepartmental conflict and negotiation",
        "pages": "177–182"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-109",
    "set": 2,
    "batch": 5,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "D. Organizational Change Management",
      "topic": "3. Techniques to overcome organizational barriers",
      "reference": "II.D.3"
    },
    "difficulty": "Expert",
    "cognitive": "Apply",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "A hospital achieved 95% training completion for a new medication-reconciliation process, yet sustained use is 42%. Interviews show physicians believe the old process is faster, managers still reward discharge speed alone, and the electronic workflow adds duplicate entry. What change plan is strongest?",
    "options": [
      "Repair duplicate entry and incentives with clinician input; verify adoption and patient outcomes",
      "Discipline nonusers because course completion has already established proficiency",
      "Delay adoption communications until every workflow defect and objection has disappeared",
      "Repeat mandatory training monthly and publish completion rankings by department until reported use improves"
    ],
    "answer": 0,
    "why": "Course completion is an activity measure, not proof of knowledge, skilled performance or transfer. The observed duplicate workflow and discharge-speed incentives are plausible implementation barriers that require process-owner review. Repair the workflow and reinforcement system while checking task competence and monitoring safe use; the available percentages do not quantify each barrier’s causal contribution. More mandatory attendance or punishment alone does not resolve the described conditions. <b>A. Repair duplicate entry and incentives with clinician input; verify adoption and patient outcomes</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 8 - Organizational Commitment; Change management and reinforcement, pp. 113–125.</span>",
    "optionRationales": [
      "Correct. It addresses ability, reinforcement, participation, and outcome feedback together.",
      "Punishment before correcting workflow and reward conflicts risks compliance theater and concealment.",
      "Waiting for perfection prevents iterative learning and leaves patient risk unmanaged.",
      "Training repetition treats a motivation and system-design problem as a knowledge deficit."
    ],
    "formula": null,
    "assumptions": [
      "The completion rate describes the intended training cohort; observed use is separately measured among eligible on-job opportunities.",
      "No evidence is supplied that completion alone establishes proficiency. Safety and clinical standards remain mandatory."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "change management",
      "reinforcement",
      "adoption",
      "workflow barrier",
      "leading measure"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 8 - Organizational Commitment; Change management and reinforcement",
    "sourcePages": "113–125",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 8 - Organizational Commitment",
        "section": "Change management and reinforcement",
        "pages": "113–125"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-110",
    "set": 2,
    "batch": 5,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "F. Organizational Performance Metrics",
      "topic": "Business and financial performance measures",
      "reference": "II.F"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Cross-industry enterprise/deployment case",
    "quantitative": false,
    "stem": "The executive dashboard is intended to show whether deployment is producing sustainable enterprise results. Which conclusion is most defensible?",
    "options": [
      "Declare deployment healthy based on submitted benefits and completed training",
      "Investigate the validation, control-sustainment and owner-acceptance gaps before claiming success",
      "Treat sponsor approval as sufficient financial validation and defer independent checking",
      "Deployment should stop training immediately because any gap between submitted and validated benefits proves overtraining"
    ],
    "answer": 1,
    "why": "The dashboard distinguishes submitted estimates, Finance-validated estimates, control-plan adherence and process-owner acceptance. Submitted benefits exceed the annualized target, but the validated estimate is below it and both the 90-day control and owner-acceptance results are below their own criteria. That is a validation and sustainability warning; it is not proof of realized cash loss or of a specific cause. Qualification/training throughput is useful activity evidence but cannot substitute for credible financial and sustained-process outcomes. <b>B. Investigate the validation, control-sustainment and owner-acceptance gaps before claiming success</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 9 - Organizational Finance and Business Performance Metrics; Financial and business performance measures, pp. 126–142.</span>",
    "optionRationales": [
      "High activity and submitted claims do not establish realized or sustained enterprise value.",
      "Correct. The dashboard exposes weak conversion from activity to validated, owned results.",
      "This option incorrectly treats sponsor claims as a substitute for independent validation.",
      "The evidence does not isolate training volume as the cause of the realization gap."
    ],
    "formula": null,
    "assumptions": [
      "Benefit figures refer to the same portfolio and annualized financial basis; submitted and validated figures are estimates, not audited realized cash.",
      "Training entries are counts of people, not percentages.",
      "The 90-day control metric is the proportion of eligible completed projects meeting the organization’s maintained-control criterion."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "performance metrics",
      "benefit realization",
      "leading and lagging",
      "sustainability",
      "dashboard"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 9 - Organizational Finance and Business Performance Metrics; Financial and business performance measures",
    "sourcePages": "126–142",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 9 - Organizational Finance and Business Performance Metrics",
        "section": "Financial and business performance measures",
        "pages": "126–142"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Portfolio measure",
        "Target",
        "Observed evidence"
      ],
      "rows": [
        [
          "People completing training (count)",
          "80",
          "96"
        ],
        [
          "Submitted annualized benefit estimates",
          "$4.0M",
          "$5.2M"
        ],
        [
          "Finance-validated annualized benefit estimates",
          "$4.0M",
          "$2.7M"
        ],
        [
          "Eligible projects following control plans at 90 days",
          "85%",
          "54%"
        ],
        [
          "Process-owner acceptance at closure",
          "90%",
          "61%"
        ]
      ],
      "auditBatch": 5,
      "auditId": "mbb:set-2:original-110",
      "altText": "Five portfolio measures with separate targets and observed counts, financial estimates, 90-day controls and owner-acceptance percentages."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-05/datasets.json#mbb:set-2:original-110",
      "specRef": "test-bank-assets/mbb-160/batch-05/visual-specs.json#mbb:set-2:original-110",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-05/static-fallbacks.html#mbb-set-2-original-110",
      "altText": "Five portfolio measures with separate targets and observed counts, financial estimates, 90-day controls and owner-acceptance percentages.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-05/validation.json#mbb:set-2:original-110",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-111",
    "set": 2,
    "batch": 5,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "A. Project Management Principles and Life Cycle",
      "topic": "1. Project management principles",
      "reference": "III.A.1"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Multi-step quantitative",
    "industry": "Product development and engineering",
    "quantitative": true,
    "stem": "The portfolio network shows durations in weeks. Activities B and C begin after A; D begins after B; E begins after both C and D. Which governance action protects the committed finish most directly?",
    "options": [
      "Track A-C-E as the only critical path because C has the longest individual duration",
      "Expedite B without checking D because every predecessor of a merge point is critical",
      "Protect A-B-D-E, whose 12-week duration exceeds A-C-E by two weeks, and monitor the two-week path float",
      "Treat all five activities as sequential and manage the program against their summed 17-week duration"
    ],
    "answer": 2,
    "why": "A takes 2 working weeks. The B–D branch then takes 4 + 3 = 7 weeks, versus 5 weeks for C. E must wait for both branches and then takes 3 weeks: 2 + max(4 + 3, 5) + 3 = 12. Thus A–B–D–E controls completion; A–C–E takes 10 weeks and C has two weeks of float. Adding every activity duration (17 weeks) incorrectly treats parallel work as sequential. <b>C. Protect A-B-D-E, whose 12-week duration exceeds A-C-E by two weeks, and monitor the two-week path float</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 14 - Project Oversight and Management; Project management principles and scheduling, pp. 202–212.</span>",
    "optionRationales": [
      "A-C-E is ten weeks and is not the controlling path.",
      "B matters through D, but expediting one activity without path evidence may not protect finish.",
      "Correct. The critical path is twelve weeks and the alternate path has two weeks of float.",
      "Parallel branches are not added as though they execute sequentially."
    ],
    "formula": "T = 2 + max(4 + 3, 5) + 3 = 12 working weeks",
    "assumptions": [
      "Durations are working weeks. All links are finish-to-start with zero lag.",
      "E requires both C and D to finish. No additional resource constraint changes this network."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "critical path",
      "dependency",
      "float",
      "portfolio governance",
      "network"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 14 - Project Oversight and Management; Project management principles and scheduling",
    "sourcePages": "202–212",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Project management principles and scheduling",
        "pages": "202–212"
      }
    ],
    "chart": {
      "type": "activity-network",
      "title": "Shared product-launch network",
      "nodes": {
        "A": {
          "dur": 2,
          "col": 0,
          "row": 1
        },
        "B": {
          "dur": 4,
          "col": 1,
          "row": 0
        },
        "C": {
          "dur": 5,
          "col": 1,
          "row": 2
        },
        "D": {
          "dur": 3,
          "col": 2,
          "row": 0
        },
        "E": {
          "dur": 3,
          "col": 3,
          "row": 1
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
          "E"
        ],
        [
          "D",
          "E"
        ]
      ],
      "durationUnit": "working weeks",
      "auditBatch": 5,
      "auditId": "mbb:set-2:original-111",
      "altText": "Directed activity network with durations in working weeks. A precedes B and C; B precedes D; both C and D precede E."
    },
    "visual": {
      "type": "activity-network",
      "datasetRef": "test-bank-assets/mbb-160/batch-05/datasets.json#mbb:set-2:original-111",
      "specRef": "test-bank-assets/mbb-160/batch-05/visual-specs.json#mbb:set-2:original-111",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-05/static-fallbacks.html#mbb-set-2-original-111",
      "altText": "Directed activity network with durations in working weeks. A precedes B and C; B precedes D; both C and D precede E.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-05/validation.json#mbb:set-2:original-111",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-112",
    "set": 2,
    "batch": 5,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "B. Project Portfolio Infrastructure and Management",
      "topic": "4. Prioritization; resource constraints",
      "reference": "III.B.4"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "Two approved projects need the same validation engineer in the same month. One protects a regulatory deadline; the other has higher NPV but can move six weeks without losing benefit. What should the portfolio council do?",
    "options": [
      "Split the engineer equally even if neither validation finishes on time, because approved projects have equal entitlement",
      "Ask both Black Belts to negotiate privately and leave the approved baselines unchanged",
      "Prioritize the higher-NPV project because financial rank must override schedule and compliance constraints",
      "Prioritize the deadline; transparently reschedule the other validation and reconfirm its benefits"
    ],
    "answer": 3,
    "why": "Portfolio management optimizes the whole system under dependencies and constraints. The regulatory deadline is time-critical, while the other project has documented schedule flexibility without value loss. Explicit reprioritization and rebaselining preserve governance truth. Fractional allocation, a finance-only rule, or hidden negotiation would create avoidable execution and reporting risk. <b>D. Prioritize the deadline; transparently reschedule the other validation and reconfirm its benefits</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 14 - Project Oversight and Management; Supply/demand management and resource allocation, pp. 217–218.</span>",
    "optionRationales": [
      "Equal fractional allocation can cause both projects to miss the outcome that justified approval.",
      "Private negotiation bypasses accountable portfolio decisions and leaves misleading baselines.",
      "NPV is important but does not erase mandatory constraints or timing flexibility.",
      "Correct. It respects the binding deadline and updates the affected baseline openly."
    ],
    "formula": null,
    "assumptions": [
      "The scenario provides the material evidence needed for the decision."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "resource constraint",
      "portfolio governance",
      "rebaseline",
      "regulatory deadline",
      "NPV"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 14 - Project Oversight and Management; Supply/demand management and resource allocation",
    "sourcePages": "217–218",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Supply/demand management and resource allocation",
        "pages": "217–218"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-113",
    "set": 2,
    "batch": 5,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "B. Project Portfolio Infrastructure and Management",
      "topic": "4. Prioritization; continuing or retiring investments",
      "reference": "III.B.4"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Service and transactional operations",
    "quantitative": false,
    "stem": "A project has consumed 70% of budget. Its original CTQ improvement is no longer strategically relevant after a product exit, but the sponsor argues that termination would waste prior spending. What should the Master Black Belt recommend?",
    "options": [
      "Evaluate future value and opportunity cost; stop if no current obligation or business case remains",
      "Reframe the remaining work as training so prior spending can be reported as organizational capability",
      "Continue until the original deliverables are complete so the sunk cost produces a tangible output",
      "Transfer the project to another Belt because changing ownership restores the business case"
    ],
    "answer": 0,
    "why": "Irrecoverable past expenditure is sunk and cannot be recovered by completing unnecessary work. Compare prospective continuation value with stopping, including remaining cost, cancellation obligations, recoveries, strategic relevance and alternative uses of scarce resources. Ending an obsolete project can be sound portfolio management, but it is not automatically justified by strategic change alone if other current obligations or benefits survive. <b>A. Evaluate future value and opportunity cost; stop if no current obligation or business case remains</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 12 - Executive and Team Leadership Roles; Termination of projects no longer strategically aligned, pp. 184–185.</span>",
    "optionRationales": [
      "Correct. Forward-looking value and opportunity cost govern the continue-or-stop decision.",
      "Relabeling expenditure does not create learning value or restore strategic relevance.",
      "Continuing only to justify sunk spending deepens loss without restoring strategic value.",
      "New ownership cannot recreate a missing enterprise benefit mechanism."
    ],
    "formula": null,
    "assumptions": [
      "The 70% already spent is irrecoverable. Any avoidable future expense, cancellation liability, salvage recovery and alternative use of capacity must enter the forward decision.",
      "The project has no unlisted mandatory commitment that would require continuation."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "project termination",
      "sunk cost",
      "opportunity cost",
      "strategic relevance",
      "gate review"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 12 - Executive and Team Leadership Roles; Termination of projects no longer strategically aligned",
    "sourcePages": "184–185",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 12 - Executive and Team Leadership Roles",
        "section": "Termination of projects no longer strategically aligned",
        "pages": "184–185"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-114",
    "set": 2,
    "batch": 5,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "C. Project Portfolio Financial Tools",
      "topic": "1. Budgets and forecasts",
      "reference": "III.C.1"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Multi-step quantitative",
    "industry": "Finance and insurance",
    "quantitative": true,
    "stem": "A fraud-prevention project costs $300,000 now. With probability 0.70 it produces net cash inflows of $210,000 at each of the next two year-ends; otherwise it produces $60,000 at each year-end. These are mutually exclusive whole-project scenarios. Using a fixed annual discount rate of 10%, what is expected NPV, rounded to the nearest $100?",
    "options": [
      "Approximately positive $30,000",
      "Approximately negative $13,600",
      "Approximately positive $64,500",
      "Approximately negative $150,000"
    ],
    "answer": 1,
    "why": "Expected cash inflow at each year-end is 0.70 × $210,000 + 0.30 × $60,000 = $165,000. Hence E(NPV) = −$300,000 + $165,000/1.10 + $165,000/1.10² = −$13,636.36, or negative $13,600 to the nearest $100. Equivalently, discount each scenario’s cash flows and then probability-weight the scenario NPVs. The two orders agree because expectation and discounting are linear for this fixed rate and timing; neither order is mandatory. <b>B. Approximately negative $13,600</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 9 - Organizational Finance and Business Performance Metrics; Net present value, pp. 130.</span>",
    "optionRationales": [
      "This subtracts the initial cost from two undiscounted expected inflows, ignoring their timing.",
      "Correct. Discounting the expected annual cash flows or weighting the discounted scenario NPVs gives the same result.",
      "This uses the high-inflow scenario alone and ignores the 0.30 probability of the lower outcome.",
      "This includes only the first year’s expected discounted cash inflow and omits year two."
    ],
    "formula": "E(NPV) = −300000 + 165000/1.10 + 165000/1.10²",
    "assumptions": [
      "Net inflows already reflect operating costs. There are no additional taxes, terminal values or other cash flows in this educational case.",
      "The same fixed rate and payment dates apply to both scenarios; the initial $300,000 outflow occurs in either scenario."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "expected NPV",
      "risk adjustment",
      "discounting",
      "probability",
      "portfolio finance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 9 - Organizational Finance and Business Performance Metrics; Net present value",
    "sourcePages": "130",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 9 - Organizational Finance and Business Performance Metrics",
        "section": "Net present value",
        "pages": "130"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-115",
    "set": 2,
    "batch": 5,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "A. Training Needs Analysis",
      "topic": "Knowledge, skill and operational-barrier assessment",
      "reference": "IV.A"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "A hospital requests refresher training for specimen labeling. Knowledge scores are 92% against an 85% requirement, printer availability is 81% against 99%, interface matching is 88% against 99.5%, and compliant technique when systems work is 94% against 95%. Which response should the Master Black Belt make?",
    "options": [
      "Require the same refresher course for every role before changing the printing or order-interface systems",
      "Target phlebotomists alone because high sample volume establishes that their skill is the primary cause",
      "Prioritize printer/interface repairs and assess the smaller technique gap in parallel for targeted support",
      "Replace competency criteria with supervisor impressions so corrective actions can proceed without measured standards"
    ],
    "answer": 2,
    "why": "The figures identify distinct performance gaps: printer availability is 18 percentage points below its requirement, matching is 11.5 points below, and observed technique is one point below. Knowledge exceeds its criterion, but knowledge is not identical to skill. Prioritize the clear infrastructure defects while assessing and addressing the smaller technique gap in parallel. The measures do not share a causal denominator and cannot establish how much of the final labeling-error rate each gap caused. No nonexistent table is required to answer the question. <b>C. Prioritize printer/interface repairs and assess the smaller technique gap in parallel for targeted support</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 17 - Training Needs Analysis; Nontraining barriers and recommendations, pp. 243–244.</span>",
    "optionRationales": [
      "An undifferentiated refresher does not repair unreliable printers or an order-interface defect.",
      "High volume is not evidence that a particular group’s skill caused the problem; exposure and error mechanisms differ.",
      "Correct. It addresses the observed system defects without ignoring the separately observed technique gap.",
      "Unstructured impressions cannot replace measurable performance requirements and documented competence checks."
    ],
    "formula": null,
    "assumptions": [
      "Requirements are organizational point-estimate screening criteria, not statistical confidence bounds.",
      "Each percentage describes its named assessment or operational opportunity; they are not interchangeable contribution-to-error percentages."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training needs analysis",
      "performance gap",
      "nontraining cause",
      "competency",
      "system barrier"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 17 - Training Needs Analysis; Nontraining barriers and recommendations",
    "sourcePages": "243–244",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 17 - Training Needs Analysis",
        "section": "Nontraining barriers and recommendations",
        "pages": "243–244"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-116",
    "set": 2,
    "batch": 5,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "D. Training Program Effectiveness",
      "topic": "Cluster-aware training evaluation",
      "reference": "IV.D"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Coaching, training, and failing-project diagnosis",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": false,
    "stem": "A warehouse course improved knowledge scores, but a subsequent fall in picking errors coincided with other changes. For a new evaluation, 16 comparable teams of 20 workers are available. Training must be delivered to whole teams because members share procedures. Which plan best estimates a training effect with valid uncertainty?",
    "options": [
      "Randomize workers within each team and assume untrained colleagues cannot learn the shared procedure",
      "Randomize teams, but treat the 320 individual workers as independent observations",
      "Let managers select teams for early training, then label an equal-sized wait-list group a randomized control",
      "Randomize eight teams per arm and use a cluster-aware comparison with safe delayed training"
    ],
    "answer": 3,
    "why": "Training is assigned at team level, so there are 16 independent randomized units, not 320 independent treatment assignments. Compare contemporaneous outcomes using a prespecified team-level or suitable cluster-aware analysis; measure picking exposure and behavior transfer, keep nontraining changes comparable, and assess spillover. Random allocation supports attribution under the stated conditions, while accounting for within-team dependence prevents false precision. Satisfaction or pre/post timing alone does not establish a causal effect. <b>D. Randomize eight teams per arm and use a cluster-aware comparison with safe delayed training</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 20 - Training Effectiveness Evaluation; Isolating effects of training, pp. 291.</span>",
    "optionRationales": [
      "The proposed sharing of procedures makes worker-level allocation vulnerable to contamination within a team.",
      "Team randomization is appropriate, but treating correlated workers as independent assignments can understate uncertainty.",
      "Balancing group sizes does not make manager-selected allocation random or remove selection bias.",
      "Correct. Team allocation matches delivery, and cluster-aware inference respects the true randomized-unit structure."
    ],
    "formula": "Independent randomized units = 16 teams; workers observed = 16 × 20 = 320",
    "assumptions": [
      "All 16 teams are independently available for random allocation; no worker changes team during follow-up.",
      "Delayed training is safe and acceptable. Other planned operational changes are comparable across arms.",
      "Use a common picking-opportunity denominator and assess adherence, spillover and missing outcome data."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training effectiveness",
      "transfer",
      "counterfactual",
      "Kirkpatrick",
      "causal attribution"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 20 - Training Effectiveness Evaluation; Isolating effects of training",
    "sourcePages": "291",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 20 - Training Effectiveness Evaluation",
        "section": "Isolating effects of training",
        "pages": "291"
      },
      {
        "id": "P1",
        "document": "NIH Collaboratory: Intraclass Correlation",
        "section": "Supplemental technical validation",
        "url": "https://rethinkingclinicaltrials.org/chapters/design/analysis-plan-top/intraclass-correlation/"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-117",
    "set": 2,
    "batch": 5,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "A. Executives and Champions",
      "topic": "1. Scoping and resourcing",
      "reference": "V.A.1"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Coaching, training, and failing-project diagnosis",
    "industry": "Public sector, nonprofit, and regulated operations",
    "quantitative": false,
    "stem": "A champion keeps expanding a licensing project whenever stakeholders mention another delay source. The Black Belt now has seven CTQs and four agencies in scope. What should the Master Black Belt do?",
    "options": [
      "Coach the champion to agree an evidence-based project boundary and route later opportunities through the pipeline",
      "Privately rewrite the charter and tell the Belt to enforce it without consulting the accountable champion",
      "Accept all additions until stakeholders stop identifying delays, then estimate the resources needed",
      "Close the project immediately because multiple agencies make a coherent improvement boundary impossible"
    ],
    "answer": 0,
    "why": "The champion should own the business problem and scope decision, while the MBB makes the consequences visible. Mapping the initial value stream and quantifying boundaries supports a defensible charter; related opportunities can enter the pipeline rather than being lost. Private rewriting, unlimited expansion, or immediate closure either bypasses ownership or sacrifices portfolio discipline. <b>A. Coach the champion to agree an evidence-based project boundary and route later opportunities through the pipeline</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 21 - Mentoring Champions, Change Agents, and Executives; Project sizing and constructive feedback, pp. 299–305.</span>",
    "optionRationales": [
      "Correct. It restores champion accountability while protecting a governed opportunity pipeline.",
      "Private correction would weaken ownership and leave the sponsor unable to defend the boundary.",
      "Sponsor authority does not remove the need to manage capacity, risk, and independent deliverables.",
      "Scope growth is recoverable and does not by itself prove the project should be terminated."
    ],
    "formula": null,
    "assumptions": [
      "Related opportunities may be staged in later projects; no mandatory safety or legal issue requires immediate scope expansion.",
      "The accountable champion approves scope changes through the agreed governance process."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "champion coaching",
      "scope",
      "charter",
      "pipeline",
      "stakeholder"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 21 - Mentoring Champions, Change Agents, and Executives; Project sizing and constructive feedback",
    "sourcePages": "299–305",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 21 - Mentoring Champions, Change Agents, and Executives",
        "section": "Project sizing and constructive feedback",
        "pages": "299–305"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-118",
    "set": 2,
    "batch": 5,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "B. Teams and Individuals",
      "topic": "2. Project reviews",
      "reference": "V.B.2"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Coaching, training, and failing-project diagnosis",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "A Black Belt is developing a regression to predict processing time. The Belt tries transformations until a coefficient has p < 0.05, yet residual patterns remain and process experts question the variables. What is the strongest coaching response?",
    "options": [
      "Approve the selected model because a significant coefficient proves predictive value",
      "Disclose the model search, diagnose data and residuals, and validate the next planned model on untouched data",
      "Add predictors until adjusted R-squared stops increasing and regard that stopping rule as independent validation",
      "Use a more flexible algorithm and skip residual/data checks because nonlinear prediction does not require validation"
    ],
    "answer": 1,
    "why": "Repeated significance-driven specification search can distort inferential claims and does not establish predictive validity. Reconnect the model with its intended prediction use, verify data lineage and leakage, investigate residual structure with domain experts, and disclose the exploratory search. Specify the next modeling/validation plan before using genuinely untouched validation data. This cannot retroactively make the earlier search prespecified. Good out-of-sample prediction also does not, by itself, establish a causal effect. <b>B. Disclose the model search, diagnose data and residuals, and validate the next planned model on untouched data</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 22 - Mentoring Black Belts and Green Belts; Technical review and coaching, pp. 306–314.</span>",
    "optionRationales": [
      "A selected p-value does not measure future predictive error and is particularly unreliable after undisclosed repeated searching.",
      "Correct. It addresses the data/model problems, reports exploration honestly, and protects an independent next validation.",
      "A training-data fit statistic and a stopping rule are not a substitute for independent validation.",
      "Algorithm flexibility does not eliminate dependence, leakage, distribution shift or the need for external validation."
    ],
    "formula": null,
    "assumptions": [
      "The stated goal is prediction, not estimating a causal intervention effect.",
      "A new, genuinely untouched validation sample can be reserved; data already used in model selection are not called a holdout."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "technical coaching",
      "regression diagnostics",
      "overfitting",
      "data lineage",
      "validation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 22 - Mentoring Black Belts and Green Belts; Technical review and coaching",
    "sourcePages": "306–314",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 22 - Mentoring Black Belts and Green Belts",
        "section": "Technical review and coaching",
        "pages": "306–314"
      },
      {
        "id": "P1",
        "document": "ASA Statement on Statistical Significance and P-Values (2016)",
        "section": "Supplemental technical validation",
        "url": "https://doi.org/10.1080/00031305.2016.1154108"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-119",
    "set": 2,
    "batch": 5,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. Measurement Systems Analysis (MSA), Process Capability, and Control",
      "topic": "4. Destructive measurement systems",
      "reference": "VI.A.4"
    },
    "difficulty": "Expert",
    "cognitive": "Analyze",
    "questionType": "DOE/optimization design and diagnosis",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "A peel-strength test destroys each coupon. Ten independently sampled production panels can each provide six coupons; within-panel homogeneity has been supported to a practically negligible level for this study. Three appraisers will each test two distinct coupons from every panel in randomized order. Which analysis and limitation are correct?",
    "options": [
      "Treat each appraiser’s second coupon as a retest of the identical physical specimen and exclude material variation",
      "Give only one different panel to each appraiser and attribute all between-panel differences to reproducibility",
      "Cross panel and appraiser with their interaction; residual variation still includes any remaining within-panel coupon variation",
      "Use only the most experienced appraiser and label between-panel dispersion total gage repeatability and reproducibility"
    ],
    "answer": 2,
    "why": "Panel and appraiser are crossed because every appraiser tests coupons from every panel. The two observations in each panel–appraiser cell are distinct destroyed coupons, not repeated readings of one physical item. A model with panel, appraiser, interaction and residual terms matches this structure. Residual variance combines measurement repeatability with any remaining within-panel coupon variation; treating it as approximately pure repeatability requires the stated negligible-heterogeneity justification. Randomization alone cannot separate those two residual sources. <b>C. Cross panel and appraiser with their interaction; residual variation still includes any remaining within-panel coupon variation</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 24 - Measurement Systems Analysis; Variables measurement systems; destructive-study limitations, pp. 335–346.</span>",
    "optionRationales": [
      "The second coupon is a different physical item; treating it as the same specimen hides within-panel variability.",
      "With one unique panel per appraiser, panel and appraiser are confounded rather than cleanly separated.",
      "Correct. Crossing matches the allocation, and the residual limitation is explicit despite the supported homogeneity assumption.",
      "One appraiser cannot estimate between-appraiser reproducibility, and between-panel material differences are not gage repeatability."
    ],
    "formula": "y_ijk = μ + P_i + A_j + (PA)_ij + ε_ijk; Var(ε) includes repeatability plus remaining within-panel coupon variation",
    "assumptions": [
      "The 60 results come from 10 panels × 3 appraisers × 2 coupons; panel identity is blinded during measurement where feasible.",
      "Appraisers and panels represent the populations of interest; include their interaction and assess variance-model assumptions.",
      "Homogeneity is a supported practical approximation, not proof that all coupon variation is exactly zero."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "destructive MSA",
      "nested study",
      "crossed study",
      "exchangeability",
      "variance components"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 24 - Measurement Systems Analysis; Variables measurement systems; destructive-study limitations",
    "sourcePages": "335–346",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 24 - Measurement Systems Analysis",
        "section": "Variables measurement systems; destructive-study limitations",
        "pages": "335–346"
      },
      {
        "id": "P1",
        "document": "Minitab: Gage studies with destructive testing",
        "section": "Supplemental technical validation",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/supporting-topics/gage-r-r-and-wheeler-s-emp-studies/gage-studies-with-destructive-testing/"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-120",
    "set": 2,
    "batch": 5,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. Measurement Systems Analysis (MSA), Process Capability, and Control",
      "topic": "5. Process capability for non-normal data",
      "reference": "VI.A.5"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Statistical-output interpretation",
    "industry": "Service and transactional operations",
    "quantitative": false,
    "stem": "The cycle-time histogram is right-skewed and the upper specification is 18 hours. A separate model assessment supports a lognormal distribution over the relevant range and rejects a normal fit to raw times. Which capability approach is defensible?",
    "options": [
      "Trim the slowest 5% and report normal Cpk as the original process capability",
      "Declare the process incapable because right-skewed raw observations cannot satisfy an upper specification",
      "Transform cycle times but compare them with the untransformed 18-hour limit when calculating capability",
      "Use the supported lognormal tail or a defined percentile index, checking stability and uncertainty"
    ],
    "answer": 3,
    "why": "The question supplies model-assessment conclusions, not enough raw observations or parameters to reproduce that fit. For a substantively appropriate lognormal model, estimate P(T > 18 hours) or an explicitly defined percentile-based index and quantify uncertainty. Establish stability from time-ordered evidence before treating the estimate as ongoing process capability. A consistent monotone transformation preserves tail events only when the specification is transformed too. Cpk is dimensionless; it is not expressed in original hours and needs no unit back-transformation. <b>D. Use the supported lognormal tail or a defined percentile index, checking stability and uncertainty</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 24 - Measurement Systems Analysis; Process capability for nonnormal data, pp. 347–352.</span>",
    "optionRationales": [
      "Removing the slowest cases changes the population represented and understates its nonconformance.",
      "Skewness alone does not determine whether a process meets a requirement.",
      "Comparing transformed observations with an untransformed limit mixes scales and describes the wrong event.",
      "Correct. This uses the supported distribution while retaining uncertainty, meaningful specification units and a separate stability assessment."
    ],
    "formula": null,
    "assumptions": [
      "The histogram shows 128 positive cycle times. Every interval is (lower edge, upper edge], so exactly 18 hours meets the upper specification.",
      "Distribution-fit diagnostics are supplied case facts, not deductions from the binned display.",
      "No time-order stability evidence is shown; obtain it before an ongoing capability claim."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "nonnormal capability",
      "lognormal",
      "tail probability",
      "percentile",
      "process stability"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 24 - Measurement Systems Analysis; Process capability for nonnormal data",
    "sourcePages": "347–352",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 24 - Measurement Systems Analysis",
        "section": "Process capability for nonnormal data",
        "pages": "347–352"
      },
      {
        "id": "P1",
        "document": "NIST/SEMATECH: What is Process Capability?",
        "section": "Stable-process comparison and dimensionless capability indices",
        "url": "https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm"
      }
    ],
    "chart": {
      "type": "histogram",
      "title": "Service cycle-time distribution",
      "xLabel": "Cycle time (hours)",
      "yLabel": "Cases",
      "binEdges": [
        0,
        3,
        6,
        9,
        12,
        15,
        18,
        21,
        24,
        27,
        30
      ],
      "counts": [
        3,
        10,
        22,
        31,
        25,
        17,
        10,
        6,
        3,
        1
      ],
      "referenceValue": 18,
      "referenceLabel": "USL = 18 h",
      "sampleSize": 128,
      "binConvention": "(lower, upper]",
      "auditBatch": 5,
      "auditId": "mbb:set-2:original-120",
      "altText": "Histogram of 128 cycle times in hours with ten right-closed intervals of width three hours and an upper specification at 18 hours."
    },
    "visual": {
      "type": "histogram",
      "datasetRef": "test-bank-assets/mbb-160/batch-05/datasets.json#mbb:set-2:original-120",
      "specRef": "test-bank-assets/mbb-160/batch-05/visual-specs.json#mbb:set-2:original-120",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-05/static-fallbacks.html#mbb-set-2-original-120",
      "altText": "Histogram of 128 cycle times in hours with ten right-closed intervals of width three hours and an upper specification at 18 hours.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-05/validation.json#mbb:set-2:original-120",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-121",
    "set": 2,
    "batch": 5,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships Between Variables",
      "topic": "2. Multiple regression analysis",
      "reference": "VI.B.2"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Statistical-output interpretation",
    "industry": "Finance and insurance",
    "quantitative": false,
    "stem": "A credit-loss model has acceptable aggregate R-squared, but the residual-versus-fitted display includes one isolated high-fitted case with a large negative residual. What should the Master Black Belt require before approving the model?",
    "options": [
      "Investigate data, predictor-space influence and decision sensitivity to this case",
      "Retain it automatically because removing any real observation is data manipulation",
      "Delete it because large residuals cannot occur under any valid regression model",
      "Replace the fitted values with ranks so the isolated point can no longer have leverage"
    ],
    "answer": 0,
    "why": "The isolated case may reflect a recording error, a legitimate rare exposure or model misspecification. Investigate lineage and predictor-space leverage, calculate influence and compare transparent fits with/without the observation as a sensitivity analysis. The fitted-value/residual display alone does not determine leverage or justify deletion. Domain relevance and prediction performance in the decision-critical range govern how the case should be modeled. Ranking fitted values for display does not refit the design matrix or remove influence. <b>A. Investigate data, predictor-space influence and decision sensitivity to this case</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; Multiple regression and diagnostic interpretation, pp. 370–383.</span>",
    "optionRationales": [
      "Correct. It combines provenance, statistical influence, and decision sensitivity.",
      "Automatic retention is no more defensible than automatic deletion when influence may dominate a decision.",
      "Automatic deletion discards information before its provenance and influence are understood.",
      "Ranking changes the model and can conceal rather than explain a consequential observation."
    ],
    "formula": null,
    "assumptions": [
      "The eight plotted cases are an excerpt from a larger fitted model, not a complete OLS dataset.",
      "The full predictor matrix and original records are available for the requested leverage/influence investigation.",
      "Sensitivity refitting is diagnostic, not authorization to discard a valid observation without justification."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "regression diagnostics",
      "influence",
      "leverage",
      "sensitivity analysis",
      "data lineage"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Multiple regression and diagnostic interpretation",
    "sourcePages": "370–383",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Multiple regression and diagnostic interpretation",
        "pages": "370–383"
      }
    ],
    "chart": {
      "type": "regression-diagnostic",
      "title": "Residuals versus fitted losses",
      "xLabel": "Fitted loss ($000)",
      "yLabel": "Standardized residual",
      "xTicks": [
        0,
        50,
        100,
        150,
        200
      ],
      "yTicks": [
        -4,
        -2,
        0,
        2,
        4
      ],
      "points": [
        {
          "fitted": 18,
          "residual": 0.4
        },
        {
          "fitted": 31,
          "residual": -0.3
        },
        {
          "fitted": 45,
          "residual": 0.6
        },
        {
          "fitted": 62,
          "residual": -0.5
        },
        {
          "fitted": 78,
          "residual": 0.2
        },
        {
          "fitted": 91,
          "residual": -0.2
        },
        {
          "fitted": 108,
          "residual": 0.5
        },
        {
          "fitted": 190,
          "residual": -3.6
        }
      ],
      "auditBatch": 5,
      "auditId": "mbb:set-2:original-121",
      "altText": "Eight selected fitted losses in thousands of dollars and standardized residuals from a larger model. Full predictor records are needed for leverage calculations."
    },
    "visual": {
      "type": "regression-diagnostic",
      "datasetRef": "test-bank-assets/mbb-160/batch-05/datasets.json#mbb:set-2:original-121",
      "specRef": "test-bank-assets/mbb-160/batch-05/visual-specs.json#mbb:set-2:original-121",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-05/static-fallbacks.html#mbb-set-2-original-121",
      "altText": "Eight selected fitted losses in thousands of dollars and standardized residuals from a larger model. Full predictor records are needed for leverage calculations.",
      "interactionPurpose": "Inspect supplied evidence using native touch/keyboard controls; hypothetical settings do not change the scored case.",
      "validationRef": "test-bank-assets/mbb-160/batch-05/validation.json#mbb:set-2:original-121",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-122",
    "set": 2,
    "batch": 5,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships Between Variables",
      "topic": "1. Autocorrelation and forecasting",
      "reference": "VI.B.1"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Statistical-output interpretation",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "Monthly infection rates fell after an intervention, but residual autocorrelations at lags 1 and 2 exceed the approximate 95% limits. Which conclusion is strongest?",
    "options": [
      "The intervention is proven because the postintervention mean is lower regardless of residual dependence",
      "Ordinary regression standard errors are suspect; model the autocorrelation and reassess the level or slope change",
      "Difference the outcome repeatedly until every visible intervention effect disappears, then report no effect",
      "Use a two-sample t test on pre/post months because equal sample sizes remove serial dependence"
    ],
    "answer": 1,
    "why": "Residual autocorrelation violates the independence basis of ordinary regression standard errors and can exaggerate apparent precision. The intervention effect should be estimated in a time-series model that represents baseline trend, level or slope change, seasonality when present, and correlated errors. Mechanical differencing can erase meaningful structure, while equal group sizes do not cure dependence. <b>B. Ordinary regression standard errors are suspect; model the autocorrelation and reassess the level or slope change</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; Autocorrelation and forecasting, pp. 353–369.</span>",
    "optionRationales": [
      "A visual mean shift does not establish uncertainty correctly when observations are serially dependent.",
      "Correct. The model must account for residual dependence before inference on the intervention.",
      "Differencing should be selected from the data-generating structure, not forced to erase an effect.",
      "A t test treats months as independent and ignores trend and serial correlation."
    ],
    "formula": null,
    "assumptions": [
      "These are supplied residual-ACF estimates from 68 monthly observations; ±0.24 is an approximate pointwise white-noise screening bound, not a simultaneous eight-lag confidence band.",
      "Use comparable case definitions and infection-exposure denominators; inspect trend, seasonality, concurrent changes and model assumptions.",
      "A corrected error model alone cannot remove all confounding in an observational intervention evaluation."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "interrupted time series",
      "autocorrelation",
      "segmented regression",
      "standard error",
      "ACF"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Autocorrelation and forecasting",
    "sourcePages": "353–369",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Autocorrelation and forecasting",
        "pages": "353–369"
      }
    ],
    "chart": {
      "type": "acf-plot",
      "title": "Residual autocorrelation after segmented regression",
      "xLabel": "Lag (months)",
      "yLabel": "Residual ACF",
      "lags": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "values": [
        0.52,
        0.31,
        0.12,
        -0.05,
        -0.08,
        0.04,
        0.02,
        -0.03
      ],
      "confidence": 0.24,
      "sampleSize": 68,
      "auditBatch": 5,
      "auditId": "mbb:set-2:original-122",
      "altText": "Residual autocorrelation estimates at monthly lags one through eight; approximate pointwise white-noise bounds at plus/minus0.24."
    },
    "visual": {
      "type": "acf-plot",
      "datasetRef": "test-bank-assets/mbb-160/batch-05/datasets.json#mbb:set-2:original-122",
      "specRef": "test-bank-assets/mbb-160/batch-05/visual-specs.json#mbb:set-2:original-122",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-05/static-fallbacks.html#mbb-set-2-original-122",
      "altText": "Residual autocorrelation estimates at monthly lags one through eight; approximate pointwise white-noise bounds at plus/minus0.24.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-05/validation.json#mbb:set-2:original-122",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-123",
    "set": 2,
    "batch": 5,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships Between Variables",
      "topic": "9. Reliability modeling",
      "reference": "VI.B.9"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Statistical-output interpretation",
    "industry": "Product development and engineering",
    "quantitative": false,
    "stem": "The reported survival estimates for two component designs cross at about 1,200 hours: A is higher early and B later. No uncertainty intervals or individual censoring records are supplied. What is the most defensible next step for selection?",
    "options": [
      "Select A for every mission because its higher early survival establishes uniformly lower failure risk",
      "Select B for every mission because its higher late survival establishes lower hazard at every earlier time",
      "Assess proportional-hazards adequacy and compare reliability over the required mission with appropriate uncertainty",
      "Average probabilities across the listed times and choose whichever arbitrary average exceeds 0.50"
    ],
    "answer": 2,
    "why": "Crossing estimated survival curves raises concern about a constant proportional-hazards summary; it is not, without uncertainty and individual event/censoring data, a formal rejection of that assumption. Obtain the underlying evidence, assess model adequacy and compare performance over the specified mission with failure consequences and uncertainty. Survival at a late time does not determine the hazard at every earlier time. The designs have equal reported survival at 1,200 hours, and no single mission-independent winner follows. <b>C. Assess proportional-hazards adequacy and compare reliability over the required mission with appropriate uncertainty</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; Reliability modeling, pp. 423–428.</span>",
    "optionRationales": [
      "Early superiority does not imply superiority over every mission or at later times.",
      "A higher late survival probability does not establish a uniformly smaller instantaneous hazard.",
      "Correct. It treats crossing estimates as a diagnostic concern and ties selection to the mission and uncertainty.",
      "An unweighted average across arbitrarily chosen times has no stated reliability requirement or decision basis."
    ],
    "formula": null,
    "assumptions": [
      "Displayed values are survival estimates; straight connecting segments are visual guides, not additional unobserved-time estimates.",
      "Independent event/censoring records and mission requirements must be obtained for a formal comparison.",
      "The vertical 1,200-hour line marks the reported crossing point, not a specified selection mission."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "survival analysis",
      "crossing curves",
      "proportional hazards",
      "mission reliability",
      "time-varying risk"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Reliability modeling",
    "sourcePages": "423–428",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "Reliability modeling",
        "pages": "423–428"
      },
      {
        "id": "P1",
        "document": "NIST: Proportional hazards model",
        "section": "Supplemental technical validation",
        "url": "https://www.itl.nist.gov/div898/handbook/apr/section1/apr167.htm"
      }
    ],
    "chart": {
      "type": "reliability-plot",
      "title": "Design survival comparison",
      "xLabel": "Operating time (hours)",
      "yLabel": "Survival probability",
      "xTicks": [
        0,
        400,
        800,
        1200,
        1600,
        2000
      ],
      "series": [
        {
          "label": "Design A",
          "points": [
            [
              0,
              1
            ],
            [
              400,
              0.94
            ],
            [
              800,
              0.83
            ],
            [
              1200,
              0.68
            ],
            [
              1600,
              0.49
            ],
            [
              2000,
              0.31
            ]
          ]
        },
        {
          "label": "Design B",
          "points": [
            [
              0,
              1
            ],
            [
              400,
              0.88
            ],
            [
              800,
              0.77
            ],
            [
              1200,
              0.68
            ],
            [
              1600,
              0.58
            ],
            [
              2000,
              0.46
            ]
          ]
        }
      ],
      "missionTime": 1200,
      "referenceLabel": "Reported crossing: 1,200 hours",
      "auditBatch": 5,
      "auditId": "mbb:set-2:original-123",
      "altText": "Reported Design A and Design B survival estimates at six times from zero to 2,000 hours. A vertical marker identifies the reported crossing at 1,200 hours."
    },
    "visual": {
      "type": "reliability-plot",
      "datasetRef": "test-bank-assets/mbb-160/batch-05/datasets.json#mbb:set-2:original-123",
      "specRef": "test-bank-assets/mbb-160/batch-05/visual-specs.json#mbb:set-2:original-123",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-05/static-fallbacks.html#mbb-set-2-original-123",
      "altText": "Reported Design A and Design B survival estimates at six times from zero to 2,000 hours. A vertical marker identifies the reported crossing at 1,200 hours.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-05/validation.json#mbb:set-2:original-123",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-124",
    "set": 2,
    "batch": 5,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships Between Variables",
      "topic": "5. General linear models: mixed-model error strata",
      "reference": "VI.B.5"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "DOE/optimization design and diagnosis",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "Six independent furnace batches are randomly assigned to two temperatures, three batches per temperature. Within each batch, four line speeds are run once in randomized order, giving 24 responses. For a balanced split-plot model including temperature, speed and their interaction, which error degrees of freedom apply?",
    "options": [
      "Use the pooled 16-degree-of-freedom residual to test temperature, speed and their interaction alike",
      "Use 20 error degrees of freedom for temperature because each speed run independently replicates temperature",
      "Use 4 error degrees of freedom for every effect because only the six furnace batches count as experimental units",
      "Use whole-plot error with 4 degrees of freedom for temperature and subplot error with 12 for speed and interaction"
    ],
    "answer": 3,
    "why": "Temperature has six whole-plot experimental units: its one degree of freedom leaves 6 − 2 = 4 for batch-within-temperature error. Each batch contains four randomized speed subplots. Speed and temperature×speed each have 3 degrees of freedom; subplot error has (6 − 2)(4 − 1) = 12. The decomposition is 23 total = 1 temperature + 4 whole-plot error + 3 speed + 3 interaction + 12 subplot error. Pooling both errors ignores the randomization and covariance structure. <b>D. Use whole-plot error with 4 degrees of freedom for temperature and subplot error with 12 for speed and interaction</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 26 - Design of Experiments; Split-plot randomization and error strata, pp. 449–450.</span>",
    "optionRationales": [
      "The two error strata represent different variance structures and cannot be indiscriminately pooled for every F test.",
      "The four speed runs share a batch temperature assignment and are not independent whole-plot temperature replications.",
      "Speed is randomized within batches, so its error stratum is not the four-degree-of-freedom whole-plot term.",
      "Correct. The whole-plot and subplot denominators follow the actual randomization and balanced model decomposition."
    ],
    "formula": "df_WP = 6 − 2 = 4; df_SP = (6 − 2)(4 − 1) = 12",
    "assumptions": [
      "Batch identifiers are labels, not chronological order; there are no paired blocks or additional randomization restrictions.",
      "Use a random batch-within-temperature intercept and independent homogeneous subplot errors; assess normality and model adequacy for classical F inference.",
      "Every batch contains all four speed settings and one response per speed; no missing observations."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "split plot",
      "hard-to-change factor",
      "mixed model",
      "whole-plot error",
      "randomization"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 26 - Design of Experiments; Split-plot randomization and error strata",
    "sourcePages": "449–450",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 26 - Design of Experiments",
        "section": "Split-plot randomization and error strata",
        "pages": "449–450"
      },
      {
        "id": "P1",
        "document": "NIST: Split plot designs",
        "section": "Supplemental technical validation",
        "url": "https://www.itl.nist.gov/div898/handbook/pri/section5/pri55.htm"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Furnace batch",
        "Whole-plot temperature",
        "Randomized speed sequence"
      ],
      "rows": [
        [
          "1",
          "Low",
          "3, 1, 4, 2"
        ],
        [
          "2",
          "High",
          "2, 4, 1, 3"
        ],
        [
          "3",
          "Low",
          "1, 3, 2, 4"
        ],
        [
          "4",
          "High",
          "4, 2, 3, 1"
        ],
        [
          "5",
          "Low",
          "2, 1, 4, 3"
        ],
        [
          "6",
          "High",
          "3, 4, 2, 1"
        ]
      ],
      "auditBatch": 5,
      "auditId": "mbb:set-2:original-124",
      "altText": "Six independently allocated furnace-batch labels, their temperatures, and each within-batch random speed sequence."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-05/datasets.json#mbb:set-2:original-124",
      "specRef": "test-bank-assets/mbb-160/batch-05/visual-specs.json#mbb:set-2:original-124",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-05/static-fallbacks.html#mbb-set-2-original-124",
      "altText": "Six independently allocated furnace-batch labels, their temperatures, and each within-batch random speed sequence.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-05/validation.json#mbb:set-2:original-124",
      "breakpointsValidated": [
        "desktop",
        "tablet",
        "mobile"
      ],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-125",
    "set": 2,
    "batch": 5,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships Between Variables",
      "topic": "5. General linear models: ANCOVA",
      "reference": "VI.B.5"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Quantitative interpretation",
    "industry": "Transactional processing",
    "quantitative": true,
    "stem": "An observational processing-time model uses ANCOVA with an interaction: ŷ = 12 − 2G + 0.4x + 0.6Gx, in minutes. G = 1 denotes the new workflow and G = 0 the standard workflow; x = (backlog − 100)/10. What are the fitted new-minus-standard differences at backlogs of 80 and 140 cases?",
    "options": [
      "−3.2 minutes and +0.4 minutes; the workflow difference depends on backlog",
      "−2.0 minutes and −2.0 minutes; the workflow coefficient is the difference at every backlog",
      "−14.0 minutes and +22.0 minutes; insert backlog minus 100 directly into the interaction",
      "+3.2 minutes and −0.4 minutes; the workflow difference has those signs in that order"
    ],
    "answer": 0,
    "why": "At the same backlog, subtracting the G = 0 fitted value from G = 1 cancels 12 + 0.4x and gives −2 + 0.6x. Backlogs of 80 and 140 correspond to x = −2 and x = 4, yielding −3.2 and +0.4 minutes. The coefficient −2 is the difference only at the reference backlog of 100 cases (x = 0). These are conditional fitted differences, not causal effects or claims of statistical significance; neither standard errors nor a randomized design is supplied. <b>A. −3.2 minutes and +0.4 minutes; the workflow difference depends on backlog</b> <span class=\"tb-source-ref\">Source: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; General Linear Models (GLMs); ANCOVA, pp. 399–400.</span>",
    "optionRationales": [
      "Correct. It uses the coded covariate and computes new minus standard at each stated backlog.",
      "The main workflow coefficient is conditional on x = 0; ignoring interaction incorrectly forces a constant difference.",
      "This omits division by 10 in the covariate coding and inflates the interaction contribution tenfold.",
      "These are the reverse standard-minus-new contrasts, not the requested new-minus-standard differences."
    ],
    "formula": "Δ(new − standard | x) = −2 + 0.6x; x = (backlog − 100)/10",
    "assumptions": [
      "This is an audit-authored educational fitted model with a continuous response, not a recovered textbook dataset.",
      "Both workflows have observations supporting comparisons at 80 and 140 cases; the task is algebraic interpretation, not assessing an extrapolated or causal effect.",
      "No standard errors are given; do not infer significance or equivalence from the fitted differences alone."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "general linear model",
      "ANCOVA",
      "interaction",
      "covariate coding",
      "conditional contrast"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; General Linear Models (GLMs); ANCOVA",
    "sourcePages": "399–400",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (T. M. Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables",
        "section": "General Linear Models (GLMs); ANCOVA",
        "pages": "399–400"
      },
      {
        "id": "P1",
        "document": "Minitab: What is a general linear model?",
        "section": "Supplemental technical validation",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/statistical-modeling/anova/supporting-topics/basics/what-is-a-general-linear-model/"
      }
    ]
  }
];

  [115,119,125].forEach(function(number){
    var question=batch5[number-101];
    delete question.chart;
    delete question.visual;
  });

  function q6(number,sub,bok,difficulty,cognitive,questionType,industry,stem,options,answer,explanation,rationales,sourceSection,sourcePages,extra){
    var qid='mbb:set-2:original-'+String(number).padStart(3,'0');
    var question={qid:qid,set:2,batch:6,sub:sub,bok:bok,difficulty:difficulty,cognitive:cognitive,
      questionType:questionType,industry:industry,quantitative:Boolean(extra&&extra.quantitative),stem:stem,options:options,answer:answer,
      why:explanation+' <b>'+String.fromCharCode(65+answer)+'. '+options[answer]+'</b> <span class="tb-source-ref">Source: Kubiak, '+sourceSection+', pp. '+sourcePages+'.</span>',
      optionRationales:rationales,formula:extra&&extra.formula||null,
      assumptions:extra&&extra.assumptions||['The scenario provides the material evidence needed for the decision.'],
      estimatedMinutes:extra&&extra.estimatedMinutes||3,keywords:extra&&extra.keywords||bok.topic.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0,6),
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:sourceSection,sourcePages:sourcePages,
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:sourceSection,section:bok.topic,pages:sourcePages}]};
    if(extra&&extra.chart){question.chart=extra.chart;question.visual=visual6(qid,extra.chart.type,extra.altText,extra.interactionPurpose);}
    return question;
  }

  var batch6=[
  {
    "qid": "mbb:set-2:original-126",
    "set": 2,
    "batch": 6,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "A. Strategic Plan Development",
      "topic": "Strategy deployment matrix coherence",
      "code": "I.A"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Cross-industry enterprise/deployment case",
    "quantitative": false,
    "stem": "Leadership claims that the strategy map is ready for deployment. Which defect in the evidence table creates the greatest execution risk?",
    "options": [
      "The margin objective has two linked initiatives instead of exactly one initiative and one owner",
      "The reliability initiative lacks an accountable owner for decisions and escalation",
      "The access objective is measured in hours rather than converted into an annual financial result",
      "The table contains both customer and financial objectives rather than one homogeneous objective type"
    ],
    "answer": 1,
    "why": "A deployment matrix needs a traceable chain from objectives through initiatives, measures, and accountable ownership. The reliability initiative has strategic importance and a numeric target but no person or role answerable for decisions and escalation. Multiple initiatives per objective and balanced objective types are legitimate; operational measures need not all be converted into dollars. <b>B. The reliability initiative lacks an accountable owner for decisions and escalation</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 1 - Strategic Plan Deployment, pp. 7-17. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Multiple initiatives may support one objective when interfaces and accountability are explicit.",
      "Correct. A target without accountable ownership cannot be governed or escalated reliably.",
      "A customer access measure can remain operational while its strategic contribution is validated.",
      "Balanced strategies normally combine customer, process, people, and financial outcomes."
    ],
    "formula": null,
    "assumptions": [
      "The table is an ownership extract; Blank means no accountable owner has been assigned.",
      "Target baselines and deadlines are already documented. Relationship strength is a planning judgment, not a measured causal effect."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "strategy deployment",
      "X matrix",
      "accountability",
      "traceability",
      "governance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 1 - Strategic Plan Deployment",
    "sourcePages": "7-17",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 1 - Strategic Plan Deployment",
        "section": "Strategy deployment matrix coherence",
        "pages": "7-17"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Objective",
        "Initiative",
        "Relationship",
        "Measure / target",
        "Accountable owner"
      ],
      "rows": [
        [
          "Improve margin",
          "Reduce rework",
          "Strong",
          "Cost of rework -25%",
          "Operations VP"
        ],
        [
          "Improve margin",
          "Simplify claims",
          "Medium",
          "Touch time -20%",
          "Claims VP"
        ],
        [
          "Increase reliability",
          "Predict failures",
          "Strong",
          "Unplanned failures -30%",
          "Blank"
        ],
        [
          "Improve access",
          "Level demand",
          "Strong",
          "Median delay under 8 h",
          "Service VP"
        ]
      ],
      "auditBatch": 6,
      "auditId": "mbb:set-2:original-126",
      "altText": "Four objectives/initiatives with planned relationships, targets and assigned owners."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-06/datasets.json#mbb:set-2:original-126",
      "specRef": "test-bank-assets/mbb-160/batch-06/visual-specs.json#mbb:set-2:original-126",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-06/static-fallbacks.html#mbb-set-2-original-126",
      "altText": "Four objectives/initiatives with planned relationships, targets and assigned owners.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-06/validation.json#mbb:set-2:original-126",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-127",
    "set": 2,
    "batch": 6,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "B. Strategic Plan Alignment",
      "topic": "Cascading goals without local optimization",
      "code": "I.B.3"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "A health system cascades a shorter length-of-stay objective to every unit. One unit can meet its target by transferring patients earlier, increasing downstream readmissions. What should the MBB add to the deployment design?",
    "options": [
      "A stronger unit-level discharge-speed incentive so managers cannot trade speed for other priorities",
      "An independent DMAIC charter for every readmission before changing the length-of-stay target",
      "Add pathway balancing measures and shared ownership across the care transitions",
      "A rule preventing local leaders from viewing enterprise measures until their own targets are achieved"
    ],
    "answer": 2,
    "why": "Cascading a system objective into isolated functional targets can create displacement rather than improvement. Shared end-to-end ownership and balancing measures make downstream harm visible and align decisions across organizational boundaries. More local pressure or separate projects preserves the fragmented optimization that produced the readmission effect. <b>C. Add pathway balancing measures and shared ownership across the care transitions</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 2 - Strategic Plan Alignment, pp. 23-27. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Stronger local incentives amplify the behavior that transfers cost and risk downstream.",
      "Separate charters do not replace an integrated measure and decision architecture.",
      "Correct. Balancing measures and shared ownership protect the total patient pathway.",
      "Hiding enterprise outcomes prevents learning and weakens strategic line of sight."
    ],
    "formula": null,
    "assumptions": [
      "The stated downstream readmission effect is established for this scenario; this is not clinical discharge advice."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "strategic alignment",
      "local optimization",
      "balancing measure",
      "shared ownership",
      "healthcare"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 2 - Strategic Plan Alignment",
    "sourcePages": "23-27",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 2 - Strategic Plan Alignment",
        "section": "Cascading goals without local optimization",
        "pages": "23-27"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-128",
    "set": 2,
    "batch": 6,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "C. Infrastructure Elements of Improvement Systems",
      "topic": "Deployment maturity and scale readiness",
      "code": "I.C.2"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Finance and insurance",
    "quantitative": false,
    "stem": "A bank has three successful pilot projects, but each used a different benefit definition, sponsor behavior varied widely, and lessons are stored in personal files. Executives want immediate enterprise rollout. What is the strongest recommendation?",
    "options": [
      "Scale immediately because three successful pilots prove that the deployment system is mature enough",
      "Train more Belts first and allow governance to emerge after the project pipeline becomes large",
      "Standardize only the statistical templates because technical variation is the principal barrier to scale",
      "Standardize benefit rules, sponsorship and knowledge capture before controlled expansion"
    ],
    "answer": 3,
    "why": "Pilot results demonstrate potential, not a repeatable deployment capability. Scaling an inconsistent governance system multiplies benefit disputes, sponsor variability, and lost learning. The MBB should convert pilot knowledge into standard decision rights, validation rules, reusable assets, and a controlled expansion plan with feedback before increasing work in process. <b>D. Standardize benefit rules, sponsorship and knowledge capture before controlled expansion</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 3 - Deployment of Six Sigma Systems, pp. 28-52. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Project success alone does not demonstrate a reliable enterprise operating system.",
      "Additional trained staff would increase demands on inconsistent governance without resolving its weaknesses.",
      "Statistical templates do not resolve sponsorship, benefit validation, or organizational learning.",
      "Correct. It makes the deployment system repeatable before expanding its load."
    ],
    "formula": null,
    "assumptions": [
      "The pilots establish potential benefits; a repeatable enterprise governance system has not yet been demonstrated."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "deployment maturity",
      "scale readiness",
      "benefit rules",
      "knowledge management",
      "governance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 3 - Deployment of Six Sigma Systems",
    "sourcePages": "28-52",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 3 - Deployment of Six Sigma Systems",
        "section": "Deployment maturity and scale readiness",
        "pages": "28-52"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-129",
    "set": 2,
    "batch": 6,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "E. Opportunities for Improvement",
      "topic": "Project qualification and problem ownership",
      "code": "I.E.2"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Service and transactional operations",
    "quantitative": false,
    "stem": "An executive proposes a project titled “Install AI to improve customer service.” No baseline, CTQ, process boundary, or accountable process owner exists. What should the MBB do first?",
    "options": [
      "Qualify the problem, baseline, boundary, owner and benefit mechanism before implementation",
      "Approve a technology pilot because a working prototype will reveal the problem and create its own baseline",
      "Authorize full implementation now and let the assigned Black Belt establish ownership later",
      "Reject AI permanently because solution-first language is incompatible with Lean Six Sigma improvement work"
    ],
    "answer": 0,
    "why": "The proposal is a preferred solution rather than a qualified opportunity. Before consuming project capacity, the deployment system needs a measurable problem, customer requirement, boundary, owner, strategic contribution, and plausible benefit mechanism. A limited discovery may follow, but it must be governed as discovery rather than disguising an unqualified implementation. <b>A. Qualify the problem, baseline, boundary, owner and benefit mechanism before implementation</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 5 - Opportunities for Improvement, pp. 73-75. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Correct. It turns solution enthusiasm into a testable, owned business opportunity.",
      "A prototype without a decision question or baseline can create sunk-cost commitment.",
      "Belts may support bounded discovery, but that does not justify committing full implementation capacity before ownership and qualification.",
      "Solution-first wording is a warning, not evidence that the technology can never be useful."
    ],
    "formula": null,
    "assumptions": [
      "Implementation is not authorized; a time-bounded discovery can be sponsored if qualification evidence is missing."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "project qualification",
      "problem statement",
      "process owner",
      "CTQ",
      "solution bias"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 5 - Opportunities for Improvement",
    "sourcePages": "73-75",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 5 - Opportunities for Improvement",
        "section": "Project qualification and problem ownership",
        "pages": "73-75"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-130",
    "set": 2,
    "batch": 6,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "F. Pipeline Management",
      "topic": "Risk-adjusted portfolio selection with capacity",
      "code": "I.F.2"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": true,
    "stem": "Ten Belt-months are available for the next planning period. M must finish in that period; D full is ineligible until a later data gate. Apply the stated portfolio policy. Which authorization is best?",
    "options": [
      "Authorize M and A; leave the remaining one Belt-month idle rather than fund discovery",
      "Authorize M and B plus D discovery; review D full only at a later gate",
      "Authorize A and D full; request extra capacity for mandatory M after work has started",
      "Authorize M, A and B at fractional staffing without extending the planning period"
    ],
    "answer": 1,
    "why": "M is mandatory and uses four of ten Belt-months. M+A and M+B each use nine, but their comparable ready-project NPVs are $1.6M and $1.9M respectively. M+A+B requires fourteen and is infeasible. The stated secondary policy assigns the spare one month to approved discovery. Its informational value is not added as an unsupported monetary benefit, and D full remains subject to a later gate. <b>B. Authorize M and B plus D discovery; review D full only at a later gate</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 6 - Risk Analysis of Projects and the Pipeline, pp. 88-99. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "M+A uses nine months, leaving one. Its $1.6M ready-project NPV is below the feasible $1.9M from M+B.",
      "Correct. M+B is the highest-value feasible ready portfolio; the remaining month funds separately authorized discovery.",
      "It omits a mandatory commitment and starts D full before eligibility; hoped-for emergency capacity is not available capacity.",
      "M+A+B needs fourteen Belt-months. Fractional staffing cannot fit that work into the ten-Belt-month capacity without changing the commitments."
    ],
    "formula": "Ready portfolios: M=4 months/$0.7M; M+A=9/$1.6M; M+B=9/$1.9M; M+A+B=14 (infeasible). Discovery uses the remaining month under the stated policy.",
    "assumptions": [
      "M, A and B are indivisible ready projects with comparable, additive, non-overlapping risk-adjusted net NPVs on a common financial basis. Cash budgets are sufficient; Belt-month capacity is the binding resource.",
      "Include mandatory M, then maximize ready-project NPV. After that selection, use spare capacity for the separately approved one-month discovery rather than leaving it idle.",
      "Discovery is budgeted information gathering, not an implemented prerequisite or a booked project benefit. It cannot make D full eligible within this period.",
      "The scored case always uses 10 Belt-months; changing the what-if slider does not change the answer."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "pipeline",
      "capacity",
      "risk-adjusted value",
      "option value",
      "replenishment"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 6 - Risk Analysis of Projects and the Pipeline",
    "sourcePages": "88-99",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 6 - Risk Analysis of Projects and the Pipeline",
        "section": "Risk-adjusted portfolio selection with capacity",
        "pages": "88-99"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Project",
        "Belt-months",
        "Risk-adjusted net NPV",
        "Readiness",
        "Constraint"
      ],
      "rows": [
        [
          "M",
          "4",
          "$0.7M",
          "Ready",
          "Mandatory"
        ],
        [
          "A",
          "5",
          "$0.9M",
          "Ready",
          "None"
        ],
        [
          "B",
          "5",
          "$1.2M",
          "Ready",
          "None"
        ],
        [
          "D discovery",
          "1",
          "Not booked as NPV",
          "Ready",
          "Tests later data gate"
        ],
        [
          "D full",
          "4",
          "$1.6M",
          "Not ready",
          "Requires data gate"
        ]
      ],
      "whatIf": {
        "id": "mbb-q130-capacity",
        "label": "Available Belt-months",
        "min": 8,
        "max": 13,
        "step": 1,
        "value": 10,
        "unit": "Belt-months",
        "baseline": 10
      },
      "auditBatch": 6,
      "auditId": "mbb:set-2:original-130",
      "altText": "Five candidate work packages with resource needs, financial evidence, readiness and constraints."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-06/datasets.json#mbb:set-2:original-130",
      "specRef": "test-bank-assets/mbb-160/batch-06/visual-specs.json#mbb:set-2:original-130",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-06/static-fallbacks.html#mbb-set-2-original-130",
      "altText": "Five candidate work packages with resource needs, financial evidence, readiness and constraints.",
      "interactionPurpose": "Adjust available Belt-months and compare residual capacity with readiness, mandatory work, and the D data-gate option.",
      "validationRef": "test-bank-assets/mbb-160/batch-06/validation.json#mbb:set-2:original-130",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-131",
    "set": 2,
    "batch": 6,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "D. Organizational Change Management",
      "topic": "Controlled exceptions within federated deployment",
      "code": "II.D.4"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Cross-industry enterprise/deployment case",
    "quantitative": false,
    "stem": "A federated deployment requires centrally comparable project benefits and common technical assurance. In one jurisdiction, the stated binding rule prohibits exporting identifiable case data. Local processing and release of approved aggregate results are permitted. The site proposes abandoning the common benefit definitions. Which response is strongest?",
    "options": [
      "Allow the site to use its own benefit definitions and omit it from enterprise assurance",
      "Require raw-data export because enterprise comparability overrides the stated local restriction",
      "Approve local processing with common definitions, documented exceptions and auditable aggregate evidence",
      "Suspend every project in the jurisdiction until the restriction on identifiable data is removed"
    ],
    "answer": 2,
    "why": "The two requirements are not mutually exclusive: comparability concerns definitions and assurance, while the stated restriction concerns identifiable-data movement. A controlled exception can preserve lawful local processing, common metrics, documented responsibilities and auditable approved outputs. A local legal constraint does not justify abandoning benefit definitions, violating the rule or stopping unrelated compliant work. <b>C. Approve local processing with common definitions, documented exceptions and auditable aggregate evidence</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 8 - Organizational Commitment; Necessary Organizational Structure for Deployment, pp. 115-118. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Different definitions defeat comparability and eliminate the technical assurance that the charter still requires.",
      "The scenario explicitly makes the data restriction binding; internal standardization cannot authorize prohibited disclosure.",
      "Correct. It adapts the data-handling mechanism while retaining comparable definitions, evidence and accountable assurance.",
      "Permitted local processing and aggregate evidence provide a compliant route, so an indefinite blanket suspension is unnecessary."
    ],
    "formula": null,
    "assumptions": [
      "The restriction and permitted aggregate route are stipulated educational case facts, not a description of a named jurisdiction.",
      "Privacy/legal reviewers confirm the allowable outputs; the exception is documented and periodically reviewed."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "federated governance",
      "controlled exception",
      "data residency",
      "benefit definitions",
      "assurance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 8 - Organizational Commitment; Necessary Organizational Structure for Deployment",
    "sourcePages": "115-118",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 8 - Organizational Commitment; Necessary Organizational Structure for Deployment",
        "section": "Controlled exceptions within federated deployment",
        "pages": "115-118"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-132",
    "set": 2,
    "batch": 6,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "B. Executive and Team Leadership Roles",
      "topic": "Champion and MBB role boundaries",
      "code": "II.B.1"
    },
    "difficulty": "Hard",
    "cognitive": "Understand",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "The governance charter reserves project funding decisions to the champion-led council; Finance validates economics and the MBB provides independent technical assurance. A tollgate finds a material analytical weakness in an otherwise strategically aligned project. Who decides whether to continue funding, and what is the MBB’s contribution?",
    "options": [
      "The Black Belt owns funding; the MBB verifies that meeting minutes were distributed",
      "Finance owns funding; the MBB replaces the sponsor whenever benefit assumptions change",
      "The MBB owns funding because technical authority includes capital-allocation authority",
      "The council decides funding; the MBB explains technical risk and coaches corrective work"
    ],
    "answer": 3,
    "why": "Under this charter the council retains the business continue/pause/stop decision. Finance supplies validated economics, and the MBB must make the analytical weakness and required corrective evidence visible while coaching the team. Strategic alignment does not waive technical review, and technical expertise does not itself override the documented funding authority. Another organization could allocate roles differently; the case states which rule applies. <b>D. The council decides funding; the MBB explains technical risk and coaches corrective work</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 12 - Executive and Team Leadership Roles, pp. 183-195. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "A Black Belt leads project work but normally does not control portfolio funding.",
      "Finance validates economics but does not replace accountable sponsorship automatically.",
      "Technical authority does not inherently confer enterprise capital-allocation authority.",
      "Correct. Business accountability and technical assurance remain distinct but coordinated."
    ],
    "formula": null,
    "assumptions": [
      "The written allocation of authority in the stem governs this case; no emergency delegation or conflicting charter applies."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "champion",
      "MBB role",
      "tollgate",
      "funding decision",
      "technical assurance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 12 - Executive and Team Leadership Roles",
    "sourcePages": "183-195",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 12 - Executive and Team Leadership Roles",
        "section": "Champion and MBB role boundaries",
        "pages": "183-195"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-133",
    "set": 2,
    "batch": 6,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "C. Organizational Challenges",
      "topic": "Influence strategy under informal power",
      "code": "II.C.2"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Organizational-dynamics intervention scenario",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "A respected senior clinician has no formal project role but can stop adoption through peer influence. The sponsor proposes excluding the clinician from meetings to avoid delay. What should the MBB recommend?",
    "options": [
      "Engage the clinician in bounded evidence review, with explicit authority and safety escalation",
      "Exclude the clinician and use formal authority because informal influence is outside project governance",
      "Give the clinician unilateral approval authority because peer credibility is stronger than the sponsor’s hierarchy",
      "Delay the project until the clinician volunteers support without any structured engagement or sponsor action"
    ],
    "answer": 0,
    "why": "Informal power is part of the organizational system and should be managed openly. Early interest diagnosis, meaningful evidence review, bounded authority, and safety-based escalation can convert resistance into useful scrutiny without surrendering governance. Exclusion drives opposition underground, while unilateral veto or passive waiting gives disproportionate control. <b>A. Engage the clinician in bounded evidence review, with explicit authority and safety escalation</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 11 - Internal Organizational Challenges, pp. 157-177. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Correct. It acknowledges informal power while preserving explicit evidence and decision boundaries.",
      "Formal exclusion does not remove peer influence and can intensify covert resistance.",
      "Credibility earns involvement, not unlimited authority over enterprise decisions.",
      "Passive waiting avoids the leadership and engagement work required for change."
    ],
    "formula": null,
    "assumptions": [
      "No unresolved immediate patient-safety hazard requires emergency action. Any safety concern raised during review goes to the designated safety authority.",
      "Peer influence does not create an unlimited veto; participation and escalation follow agreed decision rights."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "informal power",
      "stakeholder influence",
      "resistance",
      "decision rights",
      "clinical change"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 11 - Internal Organizational Challenges",
    "sourcePages": "157-177",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 11 - Internal Organizational Challenges",
        "section": "Influence strategy under informal power",
        "pages": "157-177"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-134",
    "set": 2,
    "batch": 6,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "D. Organizational Change Management",
      "topic": "Adoption versus compliance metrics",
      "code": "II.D.3"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Statistical-output interpretation",
    "industry": "Service and transactional operations",
    "quantitative": false,
    "stem": "A campaign to improve adherence to an existing case-management standard began at the start of Week 5. Which interpretation best fits the two series, given the stated measurement conditions?",
    "options": [
      "Reported compliance establishes adoption, so the independent-use series can be disregarded",
      "Reported compliance rises while verified use falls; investigate measurement and workflow barriers",
      "Lower verified correct use indicates improvement because employees exercise less discretion",
      "The aggregate divergence identifies intentional falsification and justifies individual discipline"
    ],
    "answer": 1,
    "why": "By Week 10, reported compliance is 95%, while independently verified correct use is 61%. From Week 4 to Week 10 those rates change by +40 and −23 percentage points. They describe diverging evidence, not a quantified causal effect of the campaign. Investigate reporting definitions, incentives, usability and workarounds, and use suitable denominators and sampling information before inference. Aggregate series cannot establish individual intent. <b>B. Reported compliance rises while verified use falls; investigate measurement and workflow barriers</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 8 - Organizational Commitment; Change Management, pp. 119-125. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "A reporting measure cannot establish implementation when independent behavioral evidence points in another direction.",
      "Correct. The descriptive divergence warrants investigation without treating temporal association as proven causation or misconduct.",
      "Under the stated definition, less correct use is deterioration; the series does not measure unnecessary discretion.",
      "Aggregate percentages neither identify individuals nor establish intent; disciplined investigation is required."
    ],
    "formula": null,
    "assumptions": [
      "Both series apply the same existing standard throughout Weeks 1–10; their respective opportunity definitions and case mix remain comparable over time.",
      "Verified use comes from independent audits; weekly percentages are descriptive summaries. Sample counts and sampling uncertainty are not supplied, so no formal significance or causal test is implied."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "change adoption",
      "compliance theater",
      "behavior measure",
      "verification",
      "change management"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 8 - Organizational Commitment; Change Management",
    "sourcePages": "119-125",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 8 - Organizational Commitment; Change Management",
        "section": "Adoption versus compliance metrics",
        "pages": "119-125"
      }
    ],
    "chart": {
      "type": "multi-time-series",
      "title": "Reported compliance and verified adoption",
      "xLabel": "Week",
      "yLabel": "Percent",
      "labels": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10"
      ],
      "series": [
        {
          "label": "Reported compliance",
          "data": [
            42,
            48,
            51,
            55,
            73,
            82,
            88,
            92,
            94,
            95
          ]
        },
        {
          "label": "Verified independent correct use",
          "data": [
            86,
            85,
            87,
            84,
            80,
            75,
            70,
            66,
            63,
            61
          ]
        }
      ],
      "yDomain": [
        0,
        100
      ],
      "referenceValue": 5,
      "referenceLabel": "Campaign begins: Week 5",
      "referenceAxis": "x",
      "auditBatch": 6,
      "auditId": "mbb:set-2:original-134",
      "altText": "Two percentage series over Weeks 1–10; the campaign begins in Week 5."
    },
    "visual": {
      "type": "multi-time-series",
      "datasetRef": "test-bank-assets/mbb-160/batch-06/datasets.json#mbb:set-2:original-134",
      "specRef": "test-bank-assets/mbb-160/batch-06/visual-specs.json#mbb:set-2:original-134",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-06/static-fallbacks.html#mbb-set-2-original-134",
      "altText": "Two percentage series over Weeks 1–10; the campaign begins in Week 5.",
      "interactionPurpose": "Focus or hover over weekly points to compare reported compliance with independently verified correct use before and after launch.",
      "validationRef": "test-bank-assets/mbb-160/batch-06/validation.json#mbb:set-2:original-134",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-135",
    "set": 2,
    "batch": 6,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "F. Organizational Performance Metrics",
      "topic": "Metric cascade and unintended behavior",
      "code": "II.F.2"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": false,
    "stem": "The dashboard compares enterprise and local outcomes after a warehouse incentive changed. What is the best diagnosis?",
    "options": [
      "Approve the incentive from picks per hour alone and treat all other changes as irrelevant",
      "Raise the speed target because overtime is the only balancing outcome that deteriorated",
      "Investigate the adverse balancing outcomes and revise incentive rules using system-wide evidence",
      "Refuse to review the dashboard because measures in different units cannot inform one decision"
    ],
    "answer": 2,
    "why": "Productivity rises from 42 to 51 picks per labor hour, but mispicks, complaints and overtime also rise. All three balancing outcomes worsen in their stated directions. With comparable exposure this is a warning about a possible local-versus-system tradeoff, not proof that the incentive caused each change. Check the causal mechanism and alternative explanations, then align incentives with quality, service and sustainable workload. <b>C. Investigate the adverse balancing outcomes and revise incentive rules using system-wide evidence</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 9 - Organizational Finance and Business Performance Metrics, pp. 137-140. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "A single favorable productivity rate does not override deteriorating quality, customer and labor measures.",
      "Mispicks and complaints also deteriorate; the premise that only overtime worsened is false.",
      "Correct. It responds to the system-level warning while requiring evidence before attributing all changes to the incentive.",
      "Balanced dashboards legitimately combine units; definitions, exposure and desired directions must be explicit."
    ],
    "formula": null,
    "assumptions": [
      "The before/after periods have comparable workload, case mix and duration for interpreting weekly complaint and overtime counts.",
      "The comparison is observational; other changes may explain some or all of the movement."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "balanced metrics",
      "local optimization",
      "incentive",
      "productivity",
      "customer outcome"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 9 - Organizational Finance and Business Performance Metrics",
    "sourcePages": "137-140",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 9 - Organizational Finance and Business Performance Metrics",
        "section": "Metric cascade and unintended behavior",
        "pages": "137-140"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Metric",
        "Before",
        "After",
        "Desired direction"
      ],
      "rows": [
        [
          "Picks per labor hour",
          "42",
          "51",
          "Higher"
        ],
        [
          "Mispicks per 1,000",
          "6.2",
          "10.8",
          "Lower"
        ],
        [
          "Customer complaints per week",
          "18",
          "31",
          "Lower"
        ],
        [
          "Overtime hours per week",
          "74",
          "109",
          "Lower"
        ]
      ],
      "auditBatch": 6,
      "auditId": "mbb:set-2:original-135",
      "altText": "Before and after values for productivity, mispicks, complaints and overtime."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-06/datasets.json#mbb:set-2:original-135",
      "specRef": "test-bank-assets/mbb-160/batch-06/visual-specs.json#mbb:set-2:original-135",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-06/static-fallbacks.html#mbb-set-2-original-135",
      "altText": "Before and after values for productivity, mispicks, complaints and overtime.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-06/validation.json#mbb:set-2:original-135",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-136",
    "set": 2,
    "batch": 6,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "A. Project Management Principles and Life Cycle",
      "topic": "Program dependency and critical path",
      "code": "III.A.1"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Multi-step quantitative",
    "industry": "Product development and engineering",
    "quantitative": true,
    "stem": "The program network shows durations in weeks. A precedes B and C; B precedes D; C and D precede E. What is the earliest finish and controlling path?",
    "options": [
      "11 working weeks on A–C–E; the shorter branch sets the finish date",
      "12 working weeks on A–B–D–E; the one-week difference can be ignored",
      "17 working weeks on A–B–C–D–E; all activities must be sequential",
      "13 working weeks on A–B–D–E; activity C has two weeks of total float"
    ],
    "answer": 3,
    "why": "Path A-B-D-E is 3+4+2+4=13 weeks. Path A-C-E is 3+4+4=11 weeks. Since E waits for both C and D, the longer B-D branch controls and the C branch has two weeks of total float. Parallel work is compared at the merge; its durations are not all added serially. <b>D. 13 working weeks on A–B–D–E; activity C has two weeks of total float</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 14 - Project Oversight and Management, pp. 202-218. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "A–C–E totals eleven weeks but E must also wait for the longer A–B–D branch.",
      "A–B–D–E totals 3+4+2+4=13; ignoring one week understates the controlling duration.",
      "The seventeen-week sum wrongly sequences B, C and D; C runs in parallel with the B–D branch.",
      "Correct. The controlling path is thirteen weeks and the alternate branch has two weeks of float."
    ],
    "formula": "A-B-D-E = 3+4+2+4 = 13 weeks; A-C-E = 3+4+4 = 11 weeks; float = 2 weeks.",
    "assumptions": [
      "Durations are deterministic working weeks on the same calendar; sufficient resources permit the shown parallel branches.",
      "Each edge is a finish-to-start dependency with zero lag. E waits for both C and D; there are no other constraints."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "critical path",
      "dependency",
      "float",
      "program governance",
      "network"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 14 - Project Oversight and Management",
    "sourcePages": "202-218",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Program dependency and critical path",
        "pages": "202-218"
      }
    ],
    "chart": {
      "type": "activity-network",
      "title": "Program dependency network",
      "nodes": {
        "A": {
          "dur": 3,
          "col": 0,
          "row": 1
        },
        "B": {
          "dur": 4,
          "col": 1,
          "row": 0
        },
        "C": {
          "dur": 4,
          "col": 1,
          "row": 2
        },
        "D": {
          "dur": 2,
          "col": 2,
          "row": 0
        },
        "E": {
          "dur": 4,
          "col": 3,
          "row": 1
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
          "E"
        ],
        [
          "D",
          "E"
        ]
      ],
      "durationUnit": "working weeks",
      "auditBatch": 6,
      "auditId": "mbb:set-2:original-136",
      "altText": "Activities A–E with durations in working weeks and directed prerequisite edges."
    },
    "visual": {
      "type": "activity-network",
      "datasetRef": "test-bank-assets/mbb-160/batch-06/datasets.json#mbb:set-2:original-136",
      "specRef": "test-bank-assets/mbb-160/batch-06/visual-specs.json#mbb:set-2:original-136",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-06/static-fallbacks.html#mbb-set-2-original-136",
      "altText": "Activities A–E with durations in working weeks and directed prerequisite edges.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-06/validation.json#mbb:set-2:original-136",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-137",
    "set": 2,
    "batch": 6,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "B. Project Portfolio Infrastructure and Management",
      "topic": "Portfolio corrective action under capacity loss",
      "code": "III.B.9"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Public sector, nonprofit, and regulated operations",
    "quantitative": false,
    "stem": "A specialist supporting four projects becomes unavailable for eight weeks. Which portfolio response is strongest?",
    "options": [
      "Update capacity-based forecasts and priorities; obtain council approval for pauses or baseline changes",
      "Assign every project an equal two-week delay without checking its dependency or resource needs",
      "Keep forecasts unchanged and record variances without considering substitutes or reprioritization",
      "Assign the specialist’s tasks to any available employee without a competency review"
    ],
    "answer": 0,
    "why": "A shared-resource loss changes feasible schedules and benefit timing across projects. Update forecasts, examine critical dependencies and competent substitutes, and ask the council to authorize reprioritization or pauses. Preserve the original approved baseline for variance and audit; rebaseline only through documented change control. An unchanged baseline is not concealment, but knowingly stale forecasts and lack of corrective decisions are inadequate. <b>A. Update capacity-based forecasts and priorities; obtain council approval for pauses or baseline changes</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 14 - Project Oversight and Management, pp. 212-218. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Correct. It updates decision information, respects qualified capacity and retains governed baseline/change records.",
      "Equal delay is not implied by the eight-week absence and may damage critical or mandatory commitments.",
      "Retaining the approved baseline is appropriate, but knowingly stale forecasts and no corrective assessment are not.",
      "Availability is not proof of competence; unqualified substitution can create safety, quality and delivery risks."
    ],
    "formula": null,
    "assumptions": [
      "The council controls portfolio priority and formal baseline changes. Original baseline versions remain available for audit."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "portfolio correction",
      "shared resource",
      "capacity loss",
      "rebaseline",
      "competence"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 14 - Project Oversight and Management",
    "sourcePages": "212-218",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 14 - Project Oversight and Management",
        "section": "Portfolio corrective action under capacity loss",
        "pages": "212-218"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-138",
    "set": 2,
    "batch": 6,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "C. Project Portfolio Financial Tools",
      "topic": "NPV and IRR conflict for mutually exclusive projects",
      "code": "III.C.1"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Multi-step quantitative",
    "industry": "Finance and insurance",
    "quantitative": true,
    "stem": "Two mutually exclusive projects use the same scarce platform. At the 12% hurdle rate, X has NPV $420,000 and IRR 18%; Y has NPV $510,000 and IRR 16%. Risk and strategic alignment are equivalent. Which choice maximizes enterprise value?",
    "options": [
      "Select X because its IRR exceeds Y’s by two percentage points",
      "Select Y because its higher NPV adds $90,000 more present value",
      "Fund both because each IRR exceeds the common hurdle rate",
      "Reject both until their payback periods are exactly equal"
    ],
    "answer": 1,
    "why": "For mutually exclusive alternatives of equivalent risk evaluated at the correct hurdle rate, NPV measures incremental value added in currency and is the appropriate ranking criterion. Both clear the hurdle, but the shared platform prevents doing both; Y adds $90,000 more present value. IRR can rank scale and timing differently and should not override NPV here. <b>B. Select Y because its higher NPV adds $90,000 more present value</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 9 - Organizational Finance and Business Performance Metrics; Net Present Value, pp. 130-132. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "A higher percentage return can correspond to less total value on a smaller or differently timed investment.",
      "Correct. Y produces the larger present-value contribution under the stated assumptions.",
      "Mutual exclusivity means the platform cannot support both projects simultaneously.",
      "Equal payback is neither required nor superior to risk-adjusted value maximization."
    ],
    "formula": "Incremental NPV advantage of Y = $510,000 - $420,000 = $90,000.",
    "assumptions": [
      "Both project NPVs include all incremental net cash flows on the same decision horizon at the appropriate common 12% hurdle rate.",
      "Both alternatives are fully feasible; the platform is mutually exclusive and no other binding resource constraint changes the comparison."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "NPV",
      "IRR",
      "mutually exclusive",
      "hurdle rate",
      "value maximization"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 9 - Organizational Finance and Business Performance Metrics; Net Present Value",
    "sourcePages": "130-132",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 9 - Organizational Finance and Business Performance Metrics; Net Present Value",
        "section": "NPV and IRR conflict for mutually exclusive projects",
        "pages": "130-132"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-139",
    "set": 2,
    "batch": 6,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "C. Project Portfolio Financial Tools",
      "topic": "Benefit realization and attribution",
      "code": "III.C.2"
    },
    "difficulty": "Expert",
    "cognitive": "Apply",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "A project reports a $1.8M annual benefit bridge. For the completed 12-month period, Finance has verified that the process change reduced actual expense by $0.6M, net of implementation and ongoing costs, against an adjusted baseline. Under the stated benefit policy, what is current project-attributable hard savings?",
    "options": [
      "$1.8M, recognizing every favorable bridge item as project savings",
      "$1.5M, excluding only forecast avoidance from the $1.8M claim",
      "$0.6M, separating volume, market and forecast effects from hard savings",
      "$0.9M, combining verified expense reduction and forecast avoidance"
    ],
    "answer": 2,
    "why": "Benefit attribution should isolate the counterfactual effect of the process change. Volume growth and commodity prices are external or business effects, not savings caused by the project. The verified $0.6M process reduction is currently realized hard benefit; the $0.3M avoidance may be valuable but remains a distinct forecast category until its defined condition and validation occur. <b>C. $0.6M, separating volume, market and forecast effects from hard savings</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 16 - Project Financial Tools; Costing Concepts, pp. 226-228. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Timing after launch does not establish causal attribution to the improvement.",
      "Excluding avoidance alone still credits unrelated volume and market effects.",
      "Correct. It recognizes realized attributable savings and keeps other categories transparent.",
      "Avoided future cost is not automatically equivalent to realized cash reduction."
    ],
    "formula": null,
    "assumptions": [
      "The benefit policy recognizes realized, attributable reductions from an approved spending baseline as hard savings.",
      "The volume and commodity-price effects are independently identified external effects. The $0.3M avoidance condition has not occurred; the bridge does not double count components."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "benefit attribution",
      "hard savings",
      "cost avoidance",
      "counterfactual",
      "finance validation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 16 - Project Financial Tools; Costing Concepts",
    "sourcePages": "226-228",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 16 - Project Financial Tools; Costing Concepts",
        "section": "Benefit realization and attribution",
        "pages": "226-228"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Bridge component",
        "Bridge amount ($M)",
        "Evidence status"
      ],
      "rows": [
        [
          "Volume growth",
          "$0.5M",
          "External business change"
        ],
        [
          "Commodity-price decline",
          "$0.4M",
          "Market movement"
        ],
        [
          "Process-cost reduction",
          "$0.6M",
          "Actual net expense reduction; Finance verified"
        ],
        [
          "Forecast cost avoidance",
          "$0.3M",
          "Condition not yet realized"
        ]
      ],
      "auditBatch": 6,
      "auditId": "mbb:set-2:original-139",
      "altText": "Four components of a reported financial benefit bridge and their evidence status."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-06/datasets.json#mbb:set-2:original-139",
      "specRef": "test-bank-assets/mbb-160/batch-06/visual-specs.json#mbb:set-2:original-139",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-06/static-fallbacks.html#mbb-set-2-original-139",
      "altText": "Four components of a reported financial benefit bridge and their evidence status.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-06/validation.json#mbb:set-2:original-139",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-140",
    "set": 2,
    "batch": 6,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "A. Training Needs Analysis",
      "topic": "Role-specific competency diagnosis",
      "code": "IV.A"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Coaching, training, and failing-project diagnosis",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "Nurses know the escalation rule but frequently miss it during peak demand because alerts are buried and staffing ratios deteriorate. What should the training-needs analysis conclude?",
    "options": [
      "Attribute the entire gap to motivation because knowledge has been demonstrated",
      "Repeat the same course for every nurse before addressing any operational barrier",
      "Remove competence assessment because system barriers make skills irrelevant",
      "Address visibility and workload barriers while assessing any role-specific skill gap"
    ],
    "answer": 3,
    "why": "The stated alert and workload barriers warrant operational action; another blanket refresher cannot remove them. Demonstrated rule knowledge does not establish performance under realistic conditions, so assess judgment and skill in parallel and target any demonstrated gap. Do not infer poor motivation from these facts. This is a training-needs decision, not a substitute for clinical safety protocols. <b>D. Address visibility and workload barriers while assessing any role-specific skill gap</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 17 - Training Needs Analysis, pp. 243-244. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Knowledge of the rule does not identify motivation as the cause, and the operational barriers are explicit.",
      "A universal refresher does not repair alert visibility or workload conditions and should not delay those remedies.",
      "Skills and judgment still matter; system findings do not invalidate an appropriate competency assessment.",
      "Correct. It addresses the observed nontraining barriers without postponing a targeted assessment of remaining capability needs."
    ],
    "formula": null,
    "assumptions": [
      "Immediate clinical risks are managed through existing safety procedures; the question concerns longer-term capability and work-design diagnosis."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training needs",
      "nontraining cause",
      "workflow",
      "workload",
      "competency"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 17 - Training Needs Analysis",
    "sourcePages": "243-244",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 17 - Training Needs Analysis",
        "section": "Role-specific competency diagnosis",
        "pages": "243-244"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-141",
    "set": 2,
    "batch": 6,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "B. Training Plan Elements",
      "topic": "Scalable multi-level training architecture",
      "code": "IV.B"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Coaching, training, and failing-project diagnosis",
    "industry": "Cross-industry enterprise/deployment case",
    "quantitative": false,
    "stem": "An enterprise must train executives, champions, Green Belts, Black Belts, and process owners across three regions without diluting role accountability. Which architecture is strongest?",
    "options": [
      "Use common role outcomes, calibrated regional delivery and role-appropriate application assessment",
      "Teach every role the full Black Belt curriculum with identical technical assessments",
      "Allow each region to define unrelated roles, methods and credential standards",
      "Rely only on self-paced completion records as evidence of applied competence"
    ],
    "answer": 0,
    "why": "A sound architecture differentiates role decisions and skills while keeping common governance and assessment standards. Regional modules and calibrated faculty can adapt language and cases without changing role responsibilities. Assess application appropriate to each role, and apply certification evidence only where a credential is required. A costed capacity plan is still necessary; a design choice alone does not prove that rollout is feasible. <b>A. Use common role outcomes, calibrated regional delivery and role-appropriate application assessment</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 18 - Training Plans, pp. 245-255. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Correct. It supports contextual delivery while retaining common role standards and appropriate performance evidence.",
      "Identical Black Belt depth ignores role needs and can consume time without improving the required decisions.",
      "Unrelated definitions and credentials destroy enterprise comparability and dilute accountability.",
      "Completion records show participation, not necessarily applied competence or workplace transfer."
    ],
    "formula": null,
    "assumptions": [
      "Role responsibilities and common competence criteria are approved. Budget, faculty availability and cohort schedules require a subsequent feasibility plan."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training plan",
      "role-based learning",
      "faculty calibration",
      "certification",
      "scalability"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 18 - Training Plans",
    "sourcePages": "245-255",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 18 - Training Plans",
        "section": "Scalable multi-level training architecture",
        "pages": "245-255"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-142",
    "set": 2,
    "batch": 6,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "D. Training Program Effectiveness",
      "topic": "Validity and reliability of training evaluation",
      "code": "IV.D"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Coaching, training, and failing-project diagnosis",
    "industry": "Service and transactional operations",
    "quantitative": false,
    "stem": "Two supervisors independently score the same recorded post-training escalation exercises. One applies an agreed job-performance rubric; the other awards points mainly for presentation style, reversing several pass/fail decisions. The training owner wants to compare regional effectiveness using these scores. What should the MBB do first?",
    "options": [
      "Average the two supervisors’ scores and report the resulting regional training rankings",
      "Align scoring to job objectives, calibrate raters on common cases and reassess agreement before comparison",
      "Collect more learner satisfaction surveys to replace the conflicting performance evidence",
      "Adopt the more generous supervisor’s ratings to avoid reducing reported training success"
    ],
    "answer": 1,
    "why": "The immediate defect is the measurement process: the raters are not applying a common, job-relevant construct. Align the rubric to observable job objectives and performance conditions, calibrate independent raters with shared anchor examples, and reassess agreement on fresh cases. Until adequate measurement evidence exists, differences in regional scores cannot be treated as differences in training effectiveness. Reliability alone also does not establish content validity. <b>B. Align scoring to job objectives, calibrate raters on common cases and reassess agreement before comparison</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 20 - Training Effectiveness Evaluation; Measurement Issues, pp. 289-290. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Averaging incompatible scoring constructs hides the disagreement instead of making the measure valid or reliable.",
      "Correct. It repairs the job-performance construct and checks consistent application before interpreting regional outcomes.",
      "Satisfaction is a different construct and cannot substitute for valid evidence of demonstrated escalation performance.",
      "Selecting generous ratings biases the conclusion and rewards the measurement defect rather than resolving it."
    ],
    "formula": null,
    "assumptions": [
      "The recordings are complete and comparable. No changed learner performance can explain different ratings of the same recording.",
      "This is an authored educational assessment case; reliable scoring is a prerequisite, not proof of a causal training effect."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training evaluation",
      "rubric",
      "validity",
      "inter-rater agreement",
      "calibration"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 20 - Training Effectiveness Evaluation; Measurement Issues",
    "sourcePages": "289-290",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 20 - Training Effectiveness Evaluation; Measurement Issues",
        "section": "Validity and reliability of training evaluation",
        "pages": "289-290"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-143",
    "set": 2,
    "batch": 6,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "A. Executives and Champions",
      "topic": "Executive review operating system",
      "code": "V.A.2"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Finance and insurance",
    "quantitative": false,
    "stem": "Executive project reviews have become ninety-minute presentations with no decisions, unresolved barriers, and repeated benefit disputes. What should the MBB redesign?",
    "options": [
      "Shorten every presentation to ten minutes but retain the same agenda and decision process",
      "Move all reviews to email so leaders can approve projects independently without shared discussion",
      "Use decision-focused pre-reads, gate criteria, named owners, action logs and Finance reconciliation",
      "Let each Black Belt choose the review format because project context determines whether decisions are necessary"
    ],
    "answer": 2,
    "why": "Executive reviews should produce accountable decisions on resources, risks, benefits and learning. Pre-reads and criteria focus meeting time; named decision owners and action logs support follow-through. Finance reconciliation reduces avoidable disputes but cannot guarantee agreement or eliminate changing assumptions; unresolved differences should be explicit in the decision record. Presentation speed or format alone does not repair missing decision rights. <b>C. Use decision-focused pre-reads, gate criteria, named owners, action logs and Finance reconciliation</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 21 - Mentoring Champions, Change Agents, and Executives, pp. 294-305. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Time limits may help, but they do not repair missing criteria, ownership, or preparation.",
      "Asynchronous review alone can fragment decisions and obscure cross-project dependencies.",
      "Correct. It turns the review into a repeatable governance and decision mechanism.",
      "Project variation does not remove the need for consistent evidence and accountable decisions."
    ],
    "formula": null,
    "assumptions": [
      "The scenario provides the material evidence needed for the decision."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "executive review",
      "tollgate",
      "decision rights",
      "pre-read",
      "finance validation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 21 - Mentoring Champions, Change Agents, and Executives",
    "sourcePages": "294-305",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 21 - Mentoring Champions, Change Agents, and Executives",
        "section": "Executive review operating system",
        "pages": "294-305"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-144",
    "set": 2,
    "batch": 6,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "B. Teams and Individuals",
      "topic": "Recovery of a psychologically unsafe team",
      "code": "V.B.3"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Coaching, training, and failing-project diagnosis",
    "industry": "Product development and engineering",
    "quantitative": false,
    "stem": "A Black Belt dominates meetings, dismisses operators, and presents only analyses supporting a preferred cause. Team members have stopped raising contradictory evidence. What should the MBB do?",
    "options": [
      "Replace every operator immediately so the project can proceed without interpersonal distraction",
      "Privately tell the team to challenge the Belt more forcefully while leaving meeting practices unchanged",
      "Take over the project analysis permanently and reduce the Belt to routine data collection and reporting",
      "Coach the Belt, structure disconfirming evidence review and monitor team recovery with the sponsor"
    ],
    "answer": 3,
    "why": "The technical and social systems are now coupled: confirmation bias and low psychological safety threaten evidence quality. The MBB should intervene explicitly, create equal evidence channels, invite disconfirmation, coach the Belt’s behavior and reasoning, and involve the sponsor in sustained accountability. Replacement or takeover may become necessary, but first-line recovery should build team capability and restore valid inquiry. <b>D. Coach the Belt, structure disconfirming evidence review and monitor team recovery with the sponsor</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 22 - Mentoring Black Belts and Green Belts, pp. 306-314. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Immediate wholesale replacement discards knowledge before a structured recovery attempt.",
      "Telling low-power members to push harder leaves the unsafe facilitation system intact.",
      "Permanent takeover prevents the Belt and team from developing the required capability.",
      "Correct. It addresses behavior, evidence integrity, coaching, facilitation, and accountability together."
    ],
    "formula": null,
    "assumptions": [
      "No immediate hazard or misconduct requiring separate formal action has been identified; any such issue is escalated under policy.",
      "The sponsor retains project accountability; the MBB can intervene and escalate further if recovery fails."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "psychological safety",
      "confirmation bias",
      "team facilitation",
      "coaching",
      "disconfirming evidence"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 22 - Mentoring Black Belts and Green Belts",
    "sourcePages": "306-314",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 22 - Mentoring Black Belts and Green Belts",
        "section": "Recovery of a psychologically unsafe team",
        "pages": "306-314"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-145",
    "set": 2,
    "batch": 6,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "B. Teams and Individuals",
      "topic": "Mentoring boundaries and credential integrity",
      "code": "V.B.1"
    },
    "difficulty": "Hard",
    "cognitive": "Understand",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Cross-industry enterprise/deployment case",
    "quantitative": false,
    "stem": "A mentee asks the MBB to provide the final analysis file for a certification project so the mentee can meet a deadline. What is the appropriate response?",
    "options": [
      "Decline substitution; coach practice and seek transparent support or an approved extension",
      "Provide the final file but ask the mentee to rewrite the conclusion independently in their own words",
      "Complete only the difficult model-selection section because partial substitution preserves credential integrity",
      "Approve certification based on effort and require the mentee to demonstrate the analysis on a later project"
    ],
    "answer": 0,
    "why": "Mentoring supports learning without misrepresenting who demonstrated competence. Giving the final analysis would undermine credential integrity and prevent diagnosis of the learner’s gap. The MBB can scaffold the work, review attempts, create practice, and work with the program owner on a transparent extension or support plan while preserving the assessment standard. <b>A. Decline substitution; coach practice and seek transparent support or an approved extension</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 22 - Mentoring Black Belts and Green Belts, pp. 306-310. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Correct. It supports development while keeping performance evidence authentic.",
      "Rewording a supplied analysis does not demonstrate independent analytical competence.",
      "Substituting on the hardest section still corrupts the evidence used for certification.",
      "Effort matters developmentally but cannot replace required demonstrated competence."
    ],
    "formula": null,
    "assumptions": [
      "The internal certification policy requires the mentee to independently demonstrate the assessed analysis. Coaching and practice are permitted, but submitting someone else’s solution is not."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "mentoring",
      "credential integrity",
      "competence",
      "coaching boundary",
      "certification"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 22 - Mentoring Black Belts and Green Belts",
    "sourcePages": "306-310",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 22 - Mentoring Black Belts and Green Belts",
        "section": "Mentoring boundaries and credential integrity",
        "pages": "306-310"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-146",
    "set": 2,
    "batch": 6,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. MSA, Process Capability, and Control",
      "topic": "Attribute agreement with prevalence effects",
      "code": "VI.A.2"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Statistical-output interpretation",
    "industry": "Healthcare",
    "quantitative": true,
    "stem": "One appraiser, blinded to independently validated reference classifications, rates each of 2,000 distinct cases once. The table yields 96% overall agreement and Cohen’s kappa of about 0.38. Which conclusion is defensible before approving this measurement process?",
    "options": [
      "Approve it from 96% agreement alone, regardless of errors within either reference class",
      "Examine class-specific errors and operational consequences; 96% agreement masks poor positive detection",
      "Reject the arithmetic because a valid reference requires kappa to equal raw agreement",
      "Add only reference-negative cases until a larger sample guarantees acceptable positive detection"
    ],
    "answer": 1,
    "why": "Observed agreement is (27+1893)/2000=0.96. Chance agreement from the margins is (80×54+1920×1946)/2000²=0.93516, giving kappa=(0.96−0.93516)/(1−0.93516)=0.383097. Positive detection is only 27/80=33.75%, versus negative detection 1893/1920=98.59375%. An always-negative rating also agrees with 96% of these references. Review the consequences and acceptance criteria rather than approving from one summary; a one-pass, one-appraiser study cannot establish repeatability or between-appraiser reproducibility. <b>B. Examine class-specific errors and operational consequences; 96% agreement masks poor positive detection</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 24 - Measurement Systems Analysis (MSA); Attribute Measurement Systems, pp. 320-334. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "The negative class dominates the sample; high pooled agreement conceals fifty-three missed reference-positive cases.",
      "Correct. The confusion matrix and task consequences expose limitations that raw agreement alone misses.",
      "Kappa corrects for agreement expected from the margins; it need not equal raw agreement even with valid references.",
      "More negative cases do not address positive-case detection or provide repeat measurements and additional appraisers."
    ],
    "formula": "Po=1920/2000=.96; Pe=(80×54+1920×1946)/2000²=.93516; kappa=(Po−Pe)/(1−Pe)=.383097; sensitivity=27/80=.3375; specificity=1893/1920=.9859375.",
    "assumptions": [
      "Reference labels are accepted as valid for this educational case; categories are mutually exclusive and each case is counted once.",
      "No universal acceptance threshold or error-cost model is assumed. Population prevalence and intended use must be considered before generalizing."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "attribute MSA",
      "kappa",
      "prevalence",
      "class agreement",
      "misclassification"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 24 - Measurement Systems Analysis (MSA); Attribute Measurement Systems",
    "sourcePages": "320-334",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 24 - Measurement Systems Analysis (MSA); Attribute Measurement Systems",
        "section": "Attribute agreement with prevalence effects",
        "pages": "320-334"
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Reference / rating",
        "Positive call",
        "Negative call",
        "Total"
      ],
      "rows": [
        [
          "Reference positive",
          "27",
          "53",
          "80"
        ],
        [
          "Reference negative",
          "27",
          "1,893",
          "1,920"
        ],
        [
          "Total",
          "54",
          "1,946",
          "2,000"
        ]
      ],
      "auditBatch": 6,
      "auditId": "mbb:set-2:original-146",
      "altText": "Reference classifications cross-tabulated against one appraiser’s ratings for 2,000 cases."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-06/datasets.json#mbb:set-2:original-146",
      "specRef": "test-bank-assets/mbb-160/batch-06/visual-specs.json#mbb:set-2:original-146",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-06/static-fallbacks.html#mbb-set-2-original-146",
      "altText": "Reference classifications cross-tabulated against one appraiser’s ratings for 2,000 cases.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-06/validation.json#mbb:set-2:original-146",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-147",
    "set": 2,
    "batch": 6,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "ARIMA residual adequacy",
      "code": "VI.B.1"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Statistical-output interpretation",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": false,
    "stem": "For 80 usable, equally spaced monthly residuals from a seasonal forecasting model, the displayed ACF has spikes at lags 1 and 12 beyond the stated pointwise reference bands. What is the best next action?",
    "options": [
      "Approve the model because a residual mean of zero establishes adequate forecast uncertainty",
      "Add arbitrary predictors until the in-sample ACF bars all lie inside the reference bands",
      "Reassess short-run and seasonal dependence, then check residuals and held-out forecasts",
      "Difference at every lag from 1 through 12 without checking stationarity or forecast performance"
    ],
    "answer": 2,
    "why": "The approximate pointwise reference magnitude is 1.96/sqrt(80)=0.219135, displayed as 0.22. Lag 1 (0.34) and lag 12 (0.41) warrant investigation of remaining short-run and annual dependence. These bands do not constitute a simultaneous model-adequacy test or identify unique ARIMA orders. Use parsimonious model diagnostics, an appropriate joint residual check that accounts for fitted parameters, and chronological holdout forecasts; assess uncertainty calibration as well as point accuracy. <b>C. Reassess short-run and seasonal dependence, then check residuals and held-out forecasts</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; Autocorrelation and Forecasting, pp. 353-369. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "A zero residual mean does not establish lack of serial dependence or calibrated forecast intervals.",
      "Chasing every in-sample bar with arbitrary predictors risks overfitting and lacks a defensible model-selection strategy.",
      "Correct. It treats the spikes as diagnostic evidence and validates the revised model on both residual and future-performance criteria.",
      "Indiscriminate differencing can overtransform the series; seasonal and nonseasonal structure need justified choices."
    ],
    "formula": null,
    "assumptions": [
      "The twelve displayed ACF values are supplied diagnostic summaries; the raw residuals needed to reconstruct them are not provided.",
      "The approximate ±1.96/√80 bands are pointwise white-noise reference bands, not simultaneous bounds or a formal fitted-model portmanteau test."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "ARIMA",
      "residual ACF",
      "seasonality",
      "white noise",
      "forecast validation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Autocorrelation and Forecasting",
    "sourcePages": "353-369",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Autocorrelation and Forecasting",
        "section": "ARIMA residual adequacy",
        "pages": "353-369"
      }
    ],
    "chart": {
      "type": "acf-plot",
      "title": "Forecast-model residual ACF",
      "xLabel": "Lag",
      "yLabel": "Autocorrelation",
      "lags": [
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
        12
      ],
      "values": [
        0.34,
        0.11,
        -0.08,
        0.04,
        0.02,
        -0.06,
        0.07,
        0.03,
        -0.05,
        0.09,
        0.12,
        0.41
      ],
      "confidence": 0.21913466179497937,
      "sampleSize": 80,
      "auditBatch": 6,
      "auditId": "mbb:set-2:original-147",
      "altText": "Twelve supplied residual autocorrelations with approximate pointwise reference bands."
    },
    "visual": {
      "type": "acf-plot",
      "datasetRef": "test-bank-assets/mbb-160/batch-06/datasets.json#mbb:set-2:original-147",
      "specRef": "test-bank-assets/mbb-160/batch-06/visual-specs.json#mbb:set-2:original-147",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-06/static-fallbacks.html#mbb-set-2-original-147",
      "altText": "Twelve supplied residual autocorrelations with approximate pointwise reference bands.",
      "interactionPurpose": "Focus or hover over the bars to compare short-run lag 1 and seasonal lag 12 with the confidence bounds.",
      "validationRef": "test-bank-assets/mbb-160/batch-06/validation.json#mbb:set-2:original-147",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-148",
    "set": 2,
    "batch": 6,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "C. Design of Experiments",
      "topic": "Response-surface stationary point diagnosis",
      "code": "VI.C.3"
    },
    "difficulty": "Expert",
    "cognitive": "Understand",
    "questionType": "DOE/optimization design and diagnosis",
    "industry": "Manufacturing",
    "quantitative": true,
    "stem": "The fitted yield response is y = 82 + 6A + 4B − 3A² − 2B² − 2AB, with A and B in coded units and y in percent yield. Which statement correctly classifies its stationary point?",
    "options": [
      "It is a saddle because any fitted interaction term forces opposite signs of curvature",
      "It is a minimum because both linear coefficients are positive at the coded origin",
      "It has no curvature because coding removes the physical units of both factors",
      "It is a model maximum; confirm the predicted setting with feasible validation runs"
    ],
    "answer": 3,
    "why": "Write Q=[[-3,−1],[−1,−2]] and b=[6,4]. Solving b+2Qx=0 gives A=0.8, B=0.6 and predicted yield 85.6%. The quadratic-form eigenvalues are (−5±√5)/2, approximately −3.618034 and −1.381966. Both are negative, so the stationary point is a maximum of the fitted model. The Hessian is 2Q, not Q. Its rotated contours must satisfy the same equation; confirmation runs and practical constraints still govern operation. <b>D. It is a model maximum; confirm the predicted setting with feasible validation runs</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 26 - Design of Experiments (DOE); Response Surface Methodology, pp. 439-442. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "The eigenvalue signs, not the mere presence of AB, determine whether a stationary point is a saddle.",
      "Linear coefficients set slope at the origin; they do not determine curvature at the stationary point.",
      "Coding changes coordinates and units but does not eliminate the squared terms or the interaction.",
      "Correct. Negative quadratic eigenvalues identify the model maximum; prediction alone is not a verified operating outcome."
    ],
    "formula": "Quadratic matrix Q=[[-3,-1],[-1,-2]] has eigenvalues (-5 ± sqrt(5))/2, both negative; stationary point solves [6,4] + 2Q[A,B]=0, giving A=0.8 and B=0.6.",
    "assumptions": [
      "A and B have comparable coded scales. The shown region contains the stationary point and represents the feasible experimental region.",
      "Residual and lack-of-fit diagnostics are stipulated acceptable for this case. Percent yield is a model prediction, not a claimed observed validation result."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "response surface",
      "stationary point",
      "canonical analysis",
      "eigenvalues",
      "local maximum"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 26 - Design of Experiments (DOE); Response Surface Methodology",
    "sourcePages": "439-442",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 26 - Design of Experiments (DOE); Response Surface Methodology",
        "section": "Response-surface stationary point diagnosis",
        "pages": "439-442"
      }
    ],
    "chart": {
      "type": "contour-plot",
      "title": "Fitted yield response surface",
      "xLabel": "A: temperature (coded)",
      "yLabel": "B: residence time (coded)",
      "xDomain": [
        -1.5,
        1.5
      ],
      "yDomain": [
        -1.5,
        1.5
      ],
      "xTicks": [
        -1.5,
        -1,
        -0.5,
        0,
        0.5,
        1,
        1.5
      ],
      "yTicks": [
        -1.5,
        -1,
        -0.5,
        0,
        0.5,
        1,
        1.5
      ],
      "model": "82 + 6A + 4B - 3A² - 2B² - 2AB",
      "center": [
        0.8,
        0.6
      ],
      "contours": [
        {
          "level": 70,
          "radiusX": 2.0764715156005216,
          "radiusY": 3.3598014889126513,
          "angleDegrees": 31.717474411461005
        },
        {
          "level": 76,
          "radiusX": 1.6289182734564065,
          "radiusY": 2.6356451313482614,
          "angleDegrees": 31.717474411461005
        },
        {
          "level": 81,
          "radiusX": 1.1275676167530244,
          "radiusY": 1.8244427285201088,
          "angleDegrees": 31.717474411461005
        },
        {
          "level": 84,
          "radiusX": 0.6650031004439243,
          "radiusY": 1.07599761914233,
          "angleDegrees": 31.717474411461005
        }
      ],
      "current": {
        "x": 0,
        "y": 0,
        "label": "Current setting"
      },
      "responseUnit": "percent yield",
      "quadraticMatrix": [
        [
          -3,
          -1
        ],
        [
          -1,
          -2
        ]
      ],
      "linearCoefficients": [
        6,
        4
      ],
      "intercept": 82,
      "stationaryResponse": 85.6,
      "auditBatch": 6,
      "auditId": "mbb:set-2:original-148",
      "altText": "Contours calculated from the displayed quadratic yield model, with equal coded-axis scales and the current setting at the origin."
    },
    "visual": {
      "type": "contour-plot",
      "datasetRef": "test-bank-assets/mbb-160/batch-06/datasets.json#mbb:set-2:original-148",
      "specRef": "test-bank-assets/mbb-160/batch-06/visual-specs.json#mbb:set-2:original-148",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-06/static-fallbacks.html#mbb-set-2-original-148",
      "altText": "Contours calculated from the displayed quadratic yield model, with equal coded-axis scales and the current setting at the origin.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-06/validation.json#mbb:set-2:original-148",
      "breakpointsValidated": [],
      "answerCueAudit": true
    }
  },
  {
    "qid": "mbb:set-2:original-149",
    "set": 2,
    "batch": 6,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Monte Carlo decision risk and model governance",
      "code": "VI.B.7"
    },
    "difficulty": "Expert",
    "cognitive": "Apply",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Finance and insurance",
    "quantitative": false,
    "stem": "A simulation estimates project NPV with mean $0.9M, 5th percentile -$0.8M, and 95th percentile $3.4M. The sponsor reports only the positive mean. What should the MBB require?",
    "options": [
      "Require loss probability, tail exposure, input validation and comparison with risk appetite",
      "Approve the project because a positive expected NPV makes downside percentiles and liquidity risk irrelevant",
      "Replace the simulation with one deterministic best case so leadership receives a clear decision",
      "Reject the project automatically because any negative 5th percentile violates value maximization"
    ],
    "answer": 0,
    "why": "A positive mean can coexist with material downside. The supplied fifth and ninety-fifth percentiles do not determine P(NPV<0), a unique distribution or liquidity needs. Request the simulation draws or a justified model, validate inputs and dependencies, examine sensitivities, and compare loss probability and magnitude with the enterprise risk appetite. The negative fifth percentile calls for evaluation; it is not by itself a universal rejection rule. <b>A. Require loss probability, tail exposure, input validation and comparison with risk appetite</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; Simulation, pp. 414-416. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "Correct. It turns a selective mean into a governed risk-and-value decision profile.",
      "A positive mean can coexist with unacceptable downside or liquidity exposure.",
      "A deterministic best case removes rather than communicates uncertainty.",
      "Tail loss requires evaluation against risk appetite, not an automatic universal rule."
    ],
    "formula": "Decision evidence includes E(NPV), P(NPV<0), selected tail quantiles, sensitivities, and input-dependence validation.",
    "assumptions": [
      "The supplied mean and percentiles describe the same simulation. No draws or fitted distribution are supplied, so exact probability of loss cannot be computed from these summaries alone."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "Monte Carlo",
      "tail risk",
      "probability of loss",
      "risk appetite",
      "model governance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Simulation",
    "sourcePages": "414-416",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Simulation",
        "section": "Monte Carlo decision risk and model governance",
        "pages": "414-416"
      }
    ]
  },
  {
    "qid": "mbb:set-2:original-150",
    "set": 2,
    "batch": 6,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. MSA, Process Capability, and Control",
      "topic": "APC and SPC complementary roles",
      "code": "VI.A.6"
    },
    "difficulty": "Very Hard",
    "cognitive": "Understand",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "A feedback controller keeps furnace temperature close to set point, yet controller output gradually increases over several weeks. Why can SPC on controller output remain valuable?",
    "options": [
      "Use SPC to replace the feedback controller’s continuous manipulated-variable adjustments",
      "Stop monitoring output because near-set-point temperature proves assignable causes are absent",
      "Treat the controller output as an attribute that cannot be monitored with statistical methods",
      "Monitor compensating output for hidden process changes while APC regulates temperature"
    ],
    "answer": 3,
    "why": "A feedback controller can keep temperature near target by progressively changing its output. With comparable operating conditions, that compensation can conceal a process change in the controlled response. SPC on suitably modeled output or residuals can flag change and support investigation of equipment, inputs or disturbances; the trend alone does not prove fouling or another specific cause. APC performs regulation, while SPC supplies statistical monitoring and diagnosis. <b>D. Monitor compensating output for hidden process changes while APC regulates temperature</b> <span class=\"tb-source-ref\">Topic reference: Kubiak (2012), Chapter 27 - Automated Process Control (APC) and Statistical Process Control (SPC), pp. 451-453. Educational scenario and audit calculations are not quoted textbook examples.</span>",
    "optionRationales": [
      "SPC monitoring is not the continuous feedback control law and does not replace the regulating controller.",
      "Near-set-point temperature can be maintained by compensation; it does not establish absence of underlying process changes.",
      "Controller output in this case is continuous; it can be monitored with a strategy appropriate to its dynamics.",
      "Correct. Monitoring compensating output can reveal changes masked in temperature while preserving the distinct APC role."
    ],
    "formula": null,
    "assumptions": [
      "Set point, production load and other known operating conditions are comparable, and output is a continuous manipulated-variable signal.",
      "Use a stable reference and account for feedback dynamics/autocorrelation; an SPC signal motivates diagnosis rather than proving a maintenance cause."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "APC",
      "SPC",
      "controller output",
      "masked drift",
      "feedback control"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 27 - Automated Process Control (APC) and Statistical Process Control (SPC)",
    "sourcePages": "451-453",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 27 - Automated Process Control (APC) and Statistical Process Control (SPC)",
        "section": "APC and SPC complementary roles",
        "pages": "451-453"
      }
    ]
  }
];

  function q7(number,sub,bok,difficulty,cognitive,questionType,industry,stem,options,answer,explanation,rationales,sourceSection,sourcePages,extra){
    var qid='mbb:set-2:original-'+String(number).padStart(3,'0');
    var question={qid:qid,set:2,batch:7,sub:sub,bok:bok,difficulty:difficulty,cognitive:cognitive,
      questionType:questionType,industry:industry,quantitative:Boolean(extra&&extra.quantitative),stem:stem,options:options,answer:answer,
      why:explanation+' <b>'+String.fromCharCode(65+answer)+'. '+options[answer]+'</b> <span class="tb-source-ref">Source: Kubiak, '+sourceSection+', pp. '+sourcePages+'.</span>',
      optionRationales:rationales,formula:extra&&extra.formula||null,
      assumptions:extra&&extra.assumptions||['The scenario provides the material evidence needed for the decision.'],
      estimatedMinutes:extra&&extra.estimatedMinutes||3,keywords:extra&&extra.keywords||bok.topic.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0,6),
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:sourceSection,sourcePages:sourcePages,
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:sourceSection,section:bok.topic,pages:sourcePages}]};
    if(extra&&extra.chart){question.chart=extra.chart;question.visual=visual7(qid,extra.chart.type,extra.altText,extra.interactionPurpose);}
    return question;
  }

  var batch7=[
  {
    "qid": "mbb:set-2:original-151",
    "set": 2,
    "batch": 7,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "A. Strategic Plan Development",
      "topic": "Strategy deployment leading-indicator integrity",
      "code": "I.A"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "The proposed strategy-deployment scorecard is shown below. \"Blank\" means no leading indicator has been selected. Which revision would best support action before year-end outcomes are known?",
    "options": [
      "Replace the delivery outcome with revenue alone to simplify the strategic scorecard",
      "Remove operational indicators and retain only year-end business outcomes",
      "Average the measures into a single index without preserving component signals",
      "Add a verified maintenance leading measure and test its link to reliability"
    ],
    "answer": 3,
    "why": "D fills the missing maintenance-execution indicator while retaining the outcome needed to test its usefulness. Define the measure, verify its data and assign an owner. A plausible relationship to delivery reliability is a hypothesis, not demonstrated causation. Removing operational evidence or collapsing unlike measures into an opaque index would weaken diagnosis. <b>D. Add a verified maintenance leading measure and test its link to reliability</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 1 - Strategic Planning, pp. 16.</span>",
    "optionRationales": [
      "Revenue alone does not supply the missing operational evidence for the delivery objective.",
      "Leading operational evidence is needed to guide action before lagging outcomes are known.",
      "An unqualified composite can hide conflicting signals and does not validate their relationships.",
      "Correct. It adds actionable evidence while retaining an outcome against which to test the proposed link."
    ],
    "formula": null,
    "assumptions": [
      "Targets, baselines and owners are documented separately; Blank specifically means an unselected indicator.",
      "The table is a proposed measurement design, not a causal study."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "strategy deployment",
      "leading indicator",
      "lagging indicator",
      "causal linkage",
      "scorecard"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 1 - Strategic Planning",
    "sourcePages": "16",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 1 - Strategic Planning",
        "section": "Strategy deployment leading-indicator integrity",
        "pages": "16",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Strategic objective",
        "Initiative",
        "Leading measure",
        "Outcome measure"
      ],
      "rows": [
        [
          "Improve delivery reliability",
          "Risk-based maintenance",
          "Blank",
          "On-time delivery"
        ],
        [
          "Reduce complaint recurrence",
          "Closed-loop corrective action",
          "Actions verified on time",
          "Repeat complaints"
        ],
        [
          "Increase digital adoption",
          "Role-based workflow coaching",
          "Active weekly users",
          "Digital completion rate"
        ]
      ],
      "auditBatch": 7,
      "auditId": "mbb:set-2:original-151",
      "altText": "A three-row strategy scorecard shows leading and outcome measures. The maintenance initiative has a blank leading-measure cell while the other initiatives have both types."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-07/datasets.json#mbb:set-2:original-151",
      "specRef": "test-bank-assets/mbb-160/batch-07/visual-specs.json#mbb:set-2:original-151",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-07/static-fallbacks.html#mbb-set-2-original-151",
      "altText": "A three-row strategy scorecard shows leading and outcome measures. The maintenance initiative has a blank leading-measure cell while the other initiatives have both types.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-07/validation.json#mbb:set-2:original-151",
      "breakpointsValidated": [],
      "answerCueAudit": true
    },
    "trap": "Do not treat a plausible leading indicator as proof of a causal relationship; retain the outcome needed to test it.",
    "distractors": [
      "Revenue alone does not supply the missing operational evidence for the delivery objective.",
      "Leading operational evidence is needed to guide action before lagging outcomes are known.",
      "An unqualified composite can hide conflicting signals and does not validate their relationships.",
      "Correct. It adds actionable evidence while retaining an outcome against which to test the proposed link."
    ]
  },
  {
    "qid": "mbb:set-2:original-152",
    "set": 2,
    "batch": 7,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "B. Strategic Plan Alignment",
      "topic": "Scenario-triggered strategy adaptation",
      "code": "I.B.2"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": false,
    "stem": "A distribution network approved a two-year automation roadmap assuming stable order mix. Three months later, low-volume customized orders double and invalidate the capacity model. What should the MBB recommend first?",
    "options": [
      "Reassess the changed assumption and test revised scenarios before reprioritizing",
      "Continue unchanged until annual planning because the roadmap is already approved",
      "Cancel every automation project without evaluating its revised business case",
      "Increase benefit targets to offset the loss without changing scope or resources"
    ],
    "answer": 0,
    "why": "A updates the evidence behind the roadmap before portfolio decisions are changed. Quantify the order-mix effect on capacity, benefits and resources, then compare coherent revised scenarios. The stem supplies a material assumption failure, not a numerical predefined trigger. Neither automatic cancellation nor unsupported target inflation follows from that evidence. <b>A. Reassess the changed assumption and test revised scenarios before reprioritizing</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 15 - Project Management Infrastructure, pp. 223–224.</span>",
    "optionRationales": [
      "Correct. It supports controlled adaptation without presuming that all projects should continue or stop.",
      "The planning calendar does not justify ignoring a material failure of a planning assumption.",
      "Some projects may retain value after redesign; blanket cancellation skips that assessment.",
      "Raising a target is not evidence that the lost capacity or benefits can actually be recovered."
    ],
    "formula": null,
    "assumptions": [
      "The changed order mix materially invalidates the stated capacity model.",
      "No emergency or mandatory deadline requires a separate immediate action."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "scenario planning",
      "strategic assumptions",
      "trigger",
      "portfolio adaptation",
      "environmental scan"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 15 - Project Management Infrastructure",
    "sourcePages": "223–224",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 15 - Project Management Infrastructure",
        "section": "Scenario-triggered strategy adaptation",
        "pages": "223–224",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "Neither an approved roadmap nor a changed assumption alone decides which projects should continue; reassess the evidence.",
    "distractors": [
      "Correct. It supports controlled adaptation without presuming that all projects should continue or stop.",
      "The planning calendar does not justify ignoring a material failure of a planning assumption.",
      "Some projects may retain value after redesign; blanket cancellation skips that assessment.",
      "Raising a target is not evidence that the lost capacity or benefits can actually be recovered."
    ]
  },
  {
    "qid": "mbb:set-2:original-153",
    "set": 2,
    "batch": 7,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "C. Infrastructure Elements of Improvement Systems",
      "topic": "Federated governance with common standards",
      "code": "I.C.1"
    },
    "difficulty": "Expert",
    "cognitive": "Apply",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Cross-industry enterprise/deployment case",
    "quantitative": false,
    "stem": "In an established federated deployment, regions assess the same Belt competencies using different rubrics. Pass rates are equal, but financial-evidence requirements and assessor judgments differ. Before treating credentials as comparable, what should the MBB implement?",
    "options": [
      "Accept equal pass rates as sufficient evidence of equivalent regional assessments",
      "Set common competency criteria, calibrate assessors and moderate local evidence",
      "Normalize regional score means without reviewing the underlying assessment criteria",
      "Require corporate approval of every local meeting while retaining the different rubrics"
    ],
    "answer": 1,
    "why": "B addresses the meaning and consistency of the competency judgments. Common minimum criteria, assessor calibration and evidence moderation can coexist with locally relevant cases. Equal pass rates or equal score means do not establish comparable competence. Corporate control of unrelated meetings would not repair the assessment process. <b>B. Set common competency criteria, calibrate assessors and moderate local evidence</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 3 - Deployment of Six Sigma Systems; Chapter 20 - Training Effectiveness Evaluation, pp. 28–29; 289–290. Scenario authored for this audit; not a reproduced textbook example.</span>",
    "optionRationales": [
      "Different criteria can produce equal pass rates, so those rates do not establish equivalent competence.",
      "Correct. Shared criteria and moderated evidence address comparability without eliminating local relevance.",
      "Matching score means can conceal differences in standards rather than resolve them.",
      "Approval of meetings does not change the criteria or reliability of assessment judgments."
    ],
    "formula": null,
    "assumptions": [
      "The regions assess the same internal credential and competency requirements.",
      "This is an internal governance scenario, not a statement about ASQ certification procedures."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "deployment infrastructure",
      "federated governance",
      "standards",
      "local ownership",
      "escalation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 3 - Deployment of Six Sigma Systems; Chapter 20 - Training Effectiveness Evaluation",
    "sourcePages": "28–29; 289–290",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 3 - Deployment of Six Sigma Systems; Chapter 20 - Training Effectiveness Evaluation",
        "section": "Federated governance with common standards",
        "pages": "28–29; 289–290",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "Equal pass rates can arise under different assessment standards; they do not demonstrate equivalent competence.",
    "distractors": [
      "Different criteria can produce equal pass rates, so those rates do not establish equivalent competence.",
      "Correct. Shared criteria and moderated evidence address comparability without eliminating local relevance.",
      "Matching score means can conceal differences in standards rather than resolve them.",
      "Approval of meetings does not change the criteria or reliability of assessment judgments."
    ]
  },
  {
    "qid": "mbb:set-2:original-154",
    "set": 2,
    "batch": 7,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "E. Opportunities for Improvement",
      "topic": "Innovation funnel evidence gates",
      "code": "I.E.2"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Product development and engineering",
    "quantitative": false,
    "stem": "An innovation workshop produces 140 concepts, and executives want to charter the ten most popular ideas immediately. What should the MBB insert before project authorization?",
    "options": [
      "Authorize the concepts with the most senior-leader votes, without further qualification",
      "Require every concept to enter DMAIC regardless of its process or knowledge state",
      "Screen need, fit, feasibility, risk, value and ownership before selecting an approach",
      "Require immediate hard savings, excluding customer, learning and strategic value"
    ],
    "answer": 2,
    "why": "C places transparent qualification between ideation and resource commitment. The depth of evidence should match the proposed next step: bounded discovery may be authorized to resolve uncertainty, whereas implementation needs stronger justification. Method selection should follow the problem and available knowledge, not popularity or a universal DMAIC rule. <b>C. Screen need, fit, feasibility, risk, value and ownership before selecting an approach</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 5 - Opportunities for Improvement, pp. 70–87.</span>",
    "optionRationales": [
      "Popularity can reflect advocacy or status rather than an adequately defined opportunity.",
      "DMAIC is not automatically appropriate for a new design or an unresolved discovery question.",
      "Correct. Proportionate evidence gates support qualification and defensible method selection.",
      "Hard savings alone exclude legitimate customer, mandatory, learning and strategic opportunities."
    ],
    "formula": null,
    "assumptions": [
      "The immediate decision concerns project authorization, not whether ideas may be explored at all.",
      "Evidence requirements should be proportionate to discovery, experimentation or implementation."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "innovation funnel",
      "evidence gate",
      "project qualification",
      "method selection",
      "concept screening"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 5 - Opportunities for Improvement",
    "sourcePages": "70–87",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 5 - Opportunities for Improvement",
        "section": "Innovation funnel evidence gates",
        "pages": "70–87",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "Popularity does not qualify an implementation project, but uncertainty need not prevent a bounded discovery step.",
    "distractors": [
      "Popularity can reflect advocacy or status rather than an adequately defined opportunity.",
      "DMAIC is not automatically appropriate for a new design or an unresolved discovery question.",
      "Correct. Proportionate evidence gates support qualification and defensible method selection.",
      "Hard savings alone exclude legitimate customer, mandatory, learning and strategic opportunities."
    ]
  },
  {
    "qid": "mbb:set-2:original-155",
    "set": 2,
    "batch": 7,
    "sub": "mbb-enterprise",
    "bok": {
      "domain": "I. Enterprise-wide Planning",
      "subdomain": "F. Pipeline Management",
      "topic": "Capacity-constrained pipeline selection",
      "code": "I.F.2"
    },
    "difficulty": "Expert",
    "cognitive": "Evaluate",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Healthcare",
    "quantitative": true,
    "stem": "The portfolio table shows the only indivisible candidate projects. At most 10 Belt-months and $300,000 may be committed, and Project D may start only if Project B is selected. Which feasible portfolio has the highest total risk-adjusted value?",
    "options": [
      "Projects A and C: 10 Belt-months, $270,000 funding, $500,000 risk-adjusted value",
      "Projects B and C: 9 Belt-months, $220,000 funding, $410,000 risk-adjusted value",
      "Projects A and B: 9 Belt-months, $250,000 funding, $510,000 risk-adjusted value",
      "Projects B and D: 10 Belt-months, $280,000 funding, $540,000 risk-adjusted value"
    ],
    "answer": 3,
    "why": "Enumerating all feasible subsets gives AC: 10 months/$270,000/$500,000; BC: 9 months/$220,000/$410,000; AB: 9 months/$250,000/$510,000; and BD: 10 months/$280,000/$540,000. BD includes B as required by D and has the highest value. Feasible single projects and the empty set also exist, but none improves on BD. Feasibility alone does not make AC or AB optimal. <b>D. Projects B and D: 10 Belt-months, $280,000 funding, $540,000 risk-adjusted value</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 6 - Pipeline Management, pp. 88–99.</span>",
    "optionRationales": [
      "Feasible, but its value is $40,000 below the best feasible portfolio.",
      "The corrected total is $410,000, which is $130,000 below the optimum.",
      "Feasible, but its value is $30,000 below the best feasible portfolio.",
      "Correct. It satisfies both resource limits and the dependency and maximizes value."
    ],
    "formula": "Maximize the sum of risk-adjusted values subject to funding ≤ $300,000, capacity ≤ 10 Belt-months, indivisibility and selection of D implying selection of B.",
    "assumptions": [
      "Projects are indivisible; values are additive, net, non-overlapping and on the same risk-adjusted financial horizon.",
      "D requires selection of B; no additional timing, sequencing or resource constraint applies.",
      "The scored case is fixed at 10 Belt-months and $300,000; the slider only explores hypothetical capacity."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "pipeline optimization",
      "capacity constraint",
      "dependency",
      "risk-adjusted value",
      "portfolio selection"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 6 - Pipeline Management",
    "sourcePages": "88–99",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 6 - Pipeline Management",
        "section": "Capacity-constrained pipeline selection",
        "pages": "88–99",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Project",
        "Belt-months",
        "Funding ($000)",
        "Risk-adjusted value ($000)",
        "Dependency"
      ],
      "rows": [
        [
          "A",
          "5",
          "150",
          "300",
          "None"
        ],
        [
          "B",
          "4",
          "100",
          "210",
          "None"
        ],
        [
          "C",
          "5",
          "120",
          "200",
          "None"
        ],
        [
          "D",
          "6",
          "180",
          "330",
          "Requires B"
        ]
      ],
      "whatIf": {
        "id": "mbb-q155-capacity",
        "label": "Hypothetical available Belt-months",
        "min": 8,
        "max": 12,
        "step": 1,
        "value": 10,
        "unit": "Belt-months"
      },
      "auditBatch": 7,
      "auditId": "mbb:set-2:original-155",
      "altText": "Four projects with Belt-months, funding, risk-adjusted value and dependency columns. The scored capacity is 10 Belt-months."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-07/datasets.json#mbb:set-2:original-155",
      "specRef": "test-bank-assets/mbb-160/batch-07/visual-specs.json#mbb:set-2:original-155",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-07/static-fallbacks.html#mbb-set-2-original-155",
      "altText": "Four projects with Belt-months, funding, risk-adjusted value and dependency columns. The scored capacity is 10 Belt-months.",
      "interactionPurpose": "Explore hypothetical capacity and reset to the fixed scored case without changing the question or answer.",
      "validationRef": "test-bank-assets/mbb-160/batch-07/validation.json#mbb:set-2:original-155",
      "breakpointsValidated": [],
      "answerCueAudit": true
    },
    "trap": "Check every resource total and the dependency before ranking value; a feasible portfolio need not be optimal.",
    "distractors": [
      "Feasible, but its value is $40,000 below the best feasible portfolio.",
      "The corrected total is $410,000, which is $130,000 below the optimum.",
      "Feasible, but its value is $30,000 below the best feasible portfolio.",
      "Correct. It satisfies both resource limits and the dependency and maximizes value."
    ]
  },
  {
    "qid": "mbb:set-2:original-156",
    "set": 2,
    "batch": 7,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "A. Organizational Design",
      "topic": "Systems archetype and local optimization",
      "code": "II.A.1"
    },
    "difficulty": "Hard",
    "cognitive": "Analyze",
    "questionType": "Organizational-dynamics intervention scenario",
    "industry": "Service and transactional operations",
    "quantitative": false,
    "stem": "A service manager reviews backlog weekly. Contractor capacity takes four weeks to arrive, but new requests ignore capacity already ordered. Repeated requests are followed by excess capacity after backlog falls; cancellations are then followed by renewed shortages. Which diagnosis should guide the next investigation?",
    "options": [
      "Test delayed adjustment and uncounted pipeline capacity as causes of overshoot",
      "Treat each shortage as an independent employee-effort problem and intensify individual targets",
      "Increase adjustment frequency while continuing to use only the current backlog",
      "Exclude pending contractor requests from the model because they are not yet producing output"
    ],
    "answer": 0,
    "why": "A accounts for the capacity already in the pipeline and the delay between a decision and its effect. Repeated adjustment using current backlog alone can overshoot, followed by overcorrection. The described pattern supports investigating that feedback mechanism, not a claim that it is the sole cause. Faster reactions to the same incomplete information need not stabilize the system. <b>A. Test delayed adjustment and uncounted pipeline capacity as causes of overshoot</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 7 - Organizational Design; Systems Thinking, pp. 100–103. Scenario authored for this audit; not a reproduced textbook example.</span>",
    "optionRationales": [
      "Correct. It investigates delayed feedback and pending capacity before changing the policy.",
      "The pattern does not establish that individual effort caused the time-lagged shortages.",
      "Faster adjustment with the same missing information can intensify overshoot.",
      "Pending capacity affects future supply and should not be omitted merely because it is not active."
    ],
    "formula": null,
    "assumptions": [
      "The four-week delay and request policy are supplied properties of this educational scenario.",
      "Demand changes and other potential causes still require investigation."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "systems thinking",
      "failure demand",
      "local optimization",
      "feedback loop",
      "metric design"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 7 - Organizational Design; Systems Thinking",
    "sourcePages": "100–103",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 7 - Organizational Design; Systems Thinking",
        "section": "Systems archetype and local optimization",
        "pages": "100–103",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "More frequent reactions can worsen delayed feedback when capacity already in the pipeline is ignored.",
    "distractors": [
      "Correct. It investigates delayed feedback and pending capacity before changing the policy.",
      "The pattern does not establish that individual effort caused the time-lagged shortages.",
      "Faster adjustment with the same missing information can intensify overshoot.",
      "Pending capacity affects future supply and should not be omitted merely because it is not active."
    ]
  },
  {
    "qid": "mbb:set-2:original-157",
    "set": 2,
    "batch": 7,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "B. Executive and Team Leadership Roles",
      "topic": "Sponsor ownership and MBB escalation",
      "code": "II.B.2"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Finance and insurance",
    "quantitative": false,
    "stem": "A cross-functional project repeatedly misses milestones because two vice presidents will not release subject-matter experts. The sponsor asks the Black Belt to negotiate indefinitely. What is the MBB’s best response?",
    "options": [
      "Take permanent ownership of executive staffing decisions to keep the sponsor neutral",
      "Use the agreed escalation route and coach the sponsor to resolve the resource decision",
      "Remove both functions from scope without approval to restore the reported schedule",
      "Certify the project complete because its resource barrier is outside the Belt's authority"
    ],
    "answer": 1,
    "why": "B restores the sponsor role rather than asking the Belt to negotiate indefinitely without the necessary authority. Document the conflict, consequences and feasible alternatives, coach the sponsor and use the agreed escalation route. Silently taking executive authority, removing necessary scope or certifying unfinished work does not resolve the governance failure. <b>B. Use the agreed escalation route and coach the sponsor to resolve the resource decision</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 12 - Executive and Team Leadership Roles, pp. 185–186.</span>",
    "optionRationales": [
      "The MBB should not silently replace the executive authority assigned in the governance plan.",
      "Correct. Sponsor coaching and transparent escalation support the required resource decision.",
      "Unapproved removal of necessary functions can destroy the charter outcome.",
      "An unresolved external barrier does not justify certifying incomplete work as complete."
    ],
    "formula": null,
    "assumptions": [
      "The governance plan assigns resource-priority resolution to the sponsor or designated executive body.",
      "Neither the Belt nor the MBB has unilateral authority to change the charter or staffing priorities."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "sponsor",
      "champion",
      "resource escalation",
      "governance",
      "role accountability"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 12 - Executive and Team Leadership Roles",
    "sourcePages": "185–186",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 12 - Executive and Team Leadership Roles",
        "section": "Sponsor ownership and MBB escalation",
        "pages": "185–186",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "Facilitating a staffing discussion does not give a Belt authority to resolve an executive resource-priority conflict.",
    "distractors": [
      "The MBB should not silently replace the executive authority assigned in the governance plan.",
      "Correct. Sponsor coaching and transparent escalation support the required resource decision.",
      "Unapproved removal of necessary functions can destroy the charter outcome.",
      "An unresolved external barrier does not justify certifying incomplete work as complete."
    ]
  },
  {
    "qid": "mbb:set-2:original-158",
    "set": 2,
    "batch": 7,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "D. Organizational Change Management",
      "topic": "Adoption depth versus compliance",
      "code": "II.D.3"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Statistical-output interpretation",
    "industry": "Public sector, nonprofit, and regulated operations",
    "quantitative": false,
    "stem": "A new case-management workflow records at least 96% checklist completion from Week 4. Independent use and correct exception resolution follow the trends shown. What conclusion is most defensible before claiming sustained proficient adoption?",
    "options": [
      "Recorded completion above 95% establishes proficiency under a universal adoption standard",
      "The gap proves the workflow is defective, so remove it without further investigation",
      "Completion alone is insufficient; investigate observed-use gaps before claiming sustainment",
      "Stop reinforcement because continued coaching necessarily prevents independent performance"
    ],
    "answer": 2,
    "why": "C distinguishes recorded completion from independent performance and correct handling of exceptions. The latter percentages remain lower in the supplied observations. These constructs have different denominators, so their gaps are not proof that records are false or that one cause explains the result. Investigate skills, usable support and workflow barriers, then assess sustainment using defined criteria. <b>C. Completion alone is insufficient; investigate observed-use gaps before claiming sustainment</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 8 - Organizational Commitment; Change Management, pp. 119–125.</span>",
    "optionRationales": [
      "No universal 95% proficiency rule is supplied; checklist completion is not a complete adoption measure.",
      "The observations do not isolate workflow design as the cause of the performance gaps.",
      "Correct. Multiple behavioral measures are needed before declaring sustained proficiency.",
      "Targeted reinforcement can develop independence; dependence is not an inevitable result of coaching."
    ],
    "formula": null,
    "assumptions": [
      "Completion uses eligible case checklists; independent use uses observed normal-workflow opportunities; exception resolution uses assessed exception cases.",
      "Each series uses comparable definitions and sampling over time. Raw counts are not supplied, so no causal or significance test is claimed."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "change adoption",
      "compliance",
      "independent use",
      "workaround",
      "sustainment"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 8 - Organizational Commitment; Change Management",
    "sourcePages": "119–125",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 8 - Organizational Commitment; Change Management",
        "section": "Adoption depth versus compliance",
        "pages": "119–125",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "chart": {
      "type": "multi-time-series",
      "title": "Workflow adoption evidence",
      "xLabel": "Week",
      "yLabel": "Percent",
      "labels": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8"
      ],
      "yDomain": [
        0,
        100
      ],
      "series": [
        {
          "label": "Recorded checklist completion",
          "data": [
            42,
            68,
            88,
            96,
            97,
            96,
            97,
            96
          ]
        },
        {
          "label": "Independent use",
          "data": [
            24,
            39,
            55,
            66,
            70,
            72,
            71,
            73
          ]
        },
        {
          "label": "Correct exception resolution",
          "data": [
            20,
            31,
            44,
            53,
            57,
            59,
            58,
            60
          ]
        }
      ],
      "units": "percent",
      "auditBatch": 7,
      "auditId": "mbb:set-2:original-158",
      "altText": "Eight weekly percentages for recorded checklist completion, independent use and correct exception resolution. Exact values are available in the data table."
    },
    "visual": {
      "type": "multi-time-series",
      "datasetRef": "test-bank-assets/mbb-160/batch-07/datasets.json#mbb:set-2:original-158",
      "specRef": "test-bank-assets/mbb-160/batch-07/visual-specs.json#mbb:set-2:original-158",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-07/static-fallbacks.html#mbb-set-2-original-158",
      "altText": "Eight weekly percentages for recorded checklist completion, independent use and correct exception resolution. Exact values are available in the data table.",
      "interactionPurpose": "Focus or hover over weekly points to compare reported compliance with independent behavior and exception-handling performance.",
      "validationRef": "test-bank-assets/mbb-160/batch-07/validation.json#mbb:set-2:original-158",
      "breakpointsValidated": [],
      "answerCueAudit": true
    },
    "trap": "Checklist completion, independent use and exception handling measure different constructs; no one percentage proves sustained proficiency.",
    "distractors": [
      "No universal 95% proficiency rule is supplied; checklist completion is not a complete adoption measure.",
      "The observations do not isolate workflow design as the cause of the performance gaps.",
      "Correct. Multiple behavioral measures are needed before declaring sustained proficiency.",
      "Targeted reinforcement can develop independence; dependence is not an inevitable result of coaching."
    ]
  },
  {
    "qid": "mbb:set-2:original-159",
    "set": 2,
    "batch": 7,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "C. Organizational Challenges",
      "topic": "Interest-based conflict and decision criteria",
      "code": "II.C.3"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Organizational-dynamics intervention scenario",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "Operations and clinical leaders argue over a standardization proposal. Both repeat fixed positions, while their underlying concerns are flow stability and patient-specific judgment. What should the MBB do next?",
    "options": [
      "Ask the more senior leader to decide immediately without exploring the competing concerns",
      "Wait for one group to withdraw its position after seeing the same presentation again",
      "Divide the steps equally between proposals regardless of safety and charter requirements",
      "Surface interests, agree decision criteria and test options that protect both concerns"
    ],
    "answer": 3,
    "why": "D turns fixed positions into explicit interests and criteria, including safety, flow and legitimate exception conditions. Evaluate alternatives against those criteria rather than assuming equal division is useful. Authority may be needed if the decision remains blocked, but the stated nonemergency situation permits joint problem solving first. No agreed option may waive a mandatory safety requirement. <b>D. Surface interests, agree decision criteria and test options that protect both concerns</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 11 - Internal Organizational Challenges; Conflict Resolution, pp. 177–182.</span>",
    "optionRationales": [
      "Premature use of hierarchy can suppress relevant information before joint options are explored.",
      "Passive delay supplies no new evidence or process for resolving the disagreement.",
      "An arbitrary split may fail both groups' requirements and does not protect mandatory constraints.",
      "Correct. Interests and transparent criteria support a defensible option rather than positional compromise."
    ],
    "formula": null,
    "assumptions": [
      "There is no immediate patient hazard requiring a separate urgent response.",
      "Safety and applicable mandatory requirements are constraints, not negotiable trade-offs."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "conflict management",
      "positions",
      "interests",
      "decision criteria",
      "facilitation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 11 - Internal Organizational Challenges; Conflict Resolution",
    "sourcePages": "177–182",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 11 - Internal Organizational Challenges; Conflict Resolution",
        "section": "Interest-based conflict and decision criteria",
        "pages": "177–182",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "An arbitrary compromise can fail both interests; shared criteria must retain mandatory safety requirements.",
    "distractors": [
      "Premature use of hierarchy can suppress relevant information before joint options are explored.",
      "Passive delay supplies no new evidence or process for resolving the disagreement.",
      "An arbitrary split may fail both groups' requirements and does not protect mandatory constraints.",
      "Correct. Interests and transparent criteria support a defensible option rather than positional compromise."
    ]
  },
  {
    "qid": "mbb:set-2:original-160",
    "set": 2,
    "batch": 7,
    "sub": "mbb-org",
    "bok": {
      "domain": "II. Organizational Competencies for Deployment",
      "subdomain": "F. Organizational Performance Metrics",
      "topic": "Metric gaming and balanced evidence",
      "code": "II.F.2"
    },
    "difficulty": "Expert",
    "cognitive": "Analyze",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": false,
    "stem": "A warehouse bonus is based only on orders shipped per labor hour. Productivity rises, but expedited freight, picking errors, and employee turnover also rise. Which redesign is strongest?",
    "options": [
      "Retain productivity alone and exclude outcomes assigned to other departments",
      "Replace productivity with turnover alone, dropping customer and cost evidence",
      "Use balanced performance guardrails and investigate possible metric gaming",
      "Average all measures without thresholds so adverse outcomes can offset favorable ones"
    ],
    "answer": 2,
    "why": "C retains productivity evidence while preventing local gains from concealing wider quality, service, workforce or cost deterioration. Definitions, guardrails and a response process are needed; a simple unweighted composite can hide a serious breach. The observed trends justify examining incentive and operating mechanisms, but do not prove intentional gaming or isolate the bonus as the cause. <b>C. Use balanced performance guardrails and investigate possible metric gaming</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 9 - Organizational Finance and Business Performance Metrics, pp. 137–140.</span>",
    "optionRationales": [
      "Organizational consequences do not disappear because another department owns their metric.",
      "Turnover alone is another narrow outcome that leaves customer and cost performance unassessed.",
      "Correct. A governed family of measures protects the wider system while retaining productivity accountability.",
      "Offsetting an important guardrail breach with an unrelated gain can conceal rather than resolve risk."
    ],
    "formula": null,
    "assumptions": [
      "The trends are supplied observations, not a randomized evaluation of the bonus policy.",
      "Guardrails and response thresholds require explicit business justification."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "balanced metrics",
      "gaming",
      "guardrail",
      "incentive design",
      "system performance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 9 - Organizational Finance and Business Performance Metrics",
    "sourcePages": "137–140",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 9 - Organizational Finance and Business Performance Metrics",
        "section": "Metric gaming and balanced evidence",
        "pages": "137–140",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "A rise in one productivity ratio does not establish an enterprise benefit, and correlated adverse outcomes do not prove intentional gaming.",
    "distractors": [
      "Organizational consequences do not disappear because another department owns their metric.",
      "Turnover alone is another narrow outcome that leaves customer and cost performance unassessed.",
      "Correct. A governed family of measures protects the wider system while retaining productivity accountability.",
      "Offsetting an important guardrail breach with an unrelated gain can conceal rather than resolve risk."
    ]
  },
  {
    "qid": "mbb:set-2:original-161",
    "set": 2,
    "batch": 7,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "B. Project Portfolio Infrastructure and Management",
      "topic": "Earned-value recovery diagnosis",
      "code": "III.B.6"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Multi-step quantitative",
    "industry": "Product development and engineering",
    "quantitative": true,
    "stem": "A program has BAC=$1.20M, PV=$600k, EV=$480k and AC=$550k. Assuming current cost efficiency continues for the remaining scope, which diagnosis and estimate are most defensible? Round indices to two decimals and EAC to the nearest $0.01M only at the end.",
    "options": [
      "CPI=1.15 and SPI=1.25; forecast completion below $1.05M because value exceeds both plans",
      "CPI=0.87 and SPI=0.80; forecast about $1.38M and require recovery analysis before rebaselining",
      "CPI=0.80 and SPI=0.87; forecast exactly $1.50M because schedule variance determines final cost",
      "CPI=0.92 and SPI=1.09; retain the baseline because both indices remain within ten percent of one"
    ],
    "answer": 1,
    "why": "CPI=EV/AC=480/550=0.872727… and SPI=EV/PV=480/600=0.80. Using the unrounded CPI, EAC=BAC/CPI=$1.20M×550/480=$1.375M, or $1.38M at the requested precision. Cost variance is −$70,000 and schedule variance is −$120,000 in earned-value units. Update the forecast and investigate recovery options; an adverse forecast is not authority to erase the approved baseline. <b>B. CPI=0.87 and SPI=0.80; forecast about $1.38M and require recovery analysis before rebaselining</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 14 - Project Oversight, pp. 217–218.</span>",
    "optionRationales": [
      "The indices are inverted, incorrectly portraying adverse cost and schedule performance as favorable.",
      "Correct. Both indices and EAC follow the stated assumption, without an unauthorized baseline reset.",
      "The index labels are reversed; SPI alone does not determine the forecast final cost.",
      "These ratios do not match the supplied inputs, and a ten-percent rule was not specified."
    ],
    "formula": "CPI=EV/AC=480/550=0.872727…; SPI=EV/PV=480/600=0.80; EAC=BAC/(EV/AC)=$1.20M*550/480=$1.375M, rounded to $1.38M only at the end.",
    "assumptions": [
      "All four amounts use the same currency, status date, scope and approved performance baseline.",
      "The estimate assumes current cost efficiency continues; other EAC assumptions would produce different forecasts."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "earned value",
      "CPI",
      "SPI",
      "EAC",
      "baseline integrity"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 14 - Project Oversight",
    "sourcePages": "217–218",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 14 - Project Oversight",
        "section": "Earned-value recovery diagnosis",
        "pages": "217–218",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Earned-value measure",
        "Amount ($000)"
      ],
      "rows": [
        [
          "Budget at completion (BAC)",
          "1,200"
        ],
        [
          "Planned value (PV)",
          "600"
        ],
        [
          "Earned value (EV)",
          "480"
        ],
        [
          "Actual cost (AC)",
          "550"
        ]
      ],
      "auditBatch": 7,
      "auditId": "mbb:set-2:original-161",
      "altText": "An earned-value table shows BAC 1.2 million dollars, PV 600 thousand, EV 480 thousand, and AC 550 thousand."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-07/datasets.json#mbb:set-2:original-161",
      "specRef": "test-bank-assets/mbb-160/batch-07/visual-specs.json#mbb:set-2:original-161",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-07/static-fallbacks.html#mbb-set-2-original-161",
      "altText": "An earned-value table shows BAC 1.2 million dollars, PV 600 thousand, EV 480 thousand, and AC 550 thousand.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-07/validation.json#mbb:set-2:original-161",
      "breakpointsValidated": [],
      "answerCueAudit": true
    },
    "trap": "Do not swap CPI and SPI or round CPI before forecasting. A revised forecast is not automatic permission to reset the baseline.",
    "distractors": [
      "The indices are inverted, incorrectly portraying adverse cost and schedule performance as favorable.",
      "Correct. Both indices and EAC follow the stated assumption, without an unauthorized baseline reset.",
      "The index labels are reversed; SPI alone does not determine the forecast final cost.",
      "These ratios do not match the supplied inputs, and a ten-percent rule was not specified."
    ]
  },
  {
    "qid": "mbb:set-2:original-162",
    "set": 2,
    "batch": 7,
    "sub": "mbb-portfolio",
    "bok": {
      "domain": "III. Project Portfolio Management",
      "subdomain": "B. Project Portfolio Infrastructure and Management",
      "topic": "Evidence-based project termination",
      "code": "III.B.4"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Portfolio, finance, and risk scenario",
    "industry": "Finance and insurance",
    "quantitative": false,
    "stem": "A project has spent 70% of its budget on irrecoverable work. A stipulated regulatory change eliminates most expected benefit, but the sponsor says stopping would waste the investment. What should govern the decision?",
    "options": [
      "Compare future incremental value, costs, risks and opportunity costs, including closure obligations",
      "Continue because passing the budget midpoint protects a project from new evidence",
      "Suspend indefinitely while reserving all specialists without valuing that option",
      "Finish the old scope and relabel eliminated benefits as realized cost avoidance"
    ],
    "answer": 0,
    "why": "A uses the consequences that differ between continuing, modifying and stopping. The already spent, explicitly irrecoverable amount is sunk. Future termination costs, contractual obligations, recoveries and alternative uses of resources still belong in the comparison. The question does not supply enough future economics to declare termination automatically correct; it identifies the appropriate decision basis. <b>A. Compare future incremental value, costs, risks and opportunity costs, including closure obligations</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 15 - Project Management Infrastructure, pp. 223–224.</span>",
    "optionRationales": [
      "Correct. Forward consequences determine the choice while irrecoverable historical spending is excluded.",
      "Percent spent does not override a material change in the future value of the project.",
      "Holding scarce resources indefinitely needs a justified option value rather than an assumption.",
      "Relabeling eliminated benefits does not create an actual financial result."
    ],
    "formula": null,
    "assumptions": [
      "The 70% already spent cannot be recovered by continuing or stopping.",
      "The regulatory change is a supplied scenario condition, not legal advice about a real jurisdiction."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "project termination",
      "sunk cost",
      "opportunity cost",
      "incremental value",
      "portfolio governance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 15 - Project Management Infrastructure",
    "sourcePages": "223–224",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 15 - Project Management Infrastructure",
        "section": "Evidence-based project termination",
        "pages": "223–224",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "Irrecoverable past spending is sunk, but future shutdown costs, recoveries and obligations still matter.",
    "distractors": [
      "Correct. Forward consequences determine the choice while irrecoverable historical spending is excluded.",
      "Percent spent does not override a material change in the future value of the project.",
      "Holding scarce resources indefinitely needs a justified option value rather than an assumption.",
      "Relabeling eliminated benefits does not create an actual financial result."
    ]
  },
  {
    "qid": "mbb:set-2:original-163",
    "set": 2,
    "batch": 7,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "A. Training Needs Analysis",
      "topic": "Performance-gap cause discrimination",
      "code": "IV.A"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Visual evidence interpretation, non-statistical",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "The role-based needs assessment below shows the lowest observed correct-use percentage for operators. Which initial intervention is best supported, without assuming the table identifies every cause?",
    "options": [
      "Deliver the same statistical refresher to every role without assessing its specific needs",
      "Treat supervisor motivation as the sole cause of the missed operating steps",
      "Rewrite the analyst curriculum because analysts supposedly have the lowest correct use",
      "Repair operator access and job aids while checking any remaining hands-on skill gaps"
    ],
    "answer": 3,
    "why": "D addresses the supplied barriers to performing the operator workflow while retaining assessment of skills and other causes. A knowledge score alone does not establish practical competence, and group percentages do not prove individual-level causation. The table supports targeted investigation and remediation, not a uniform statistical course or an unsupported motivation diagnosis. <b>D. Repair operator access and job aids while checking any remaining hands-on skill gaps</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 17 - Training Needs Analysis, pp. 243–244.</span>",
    "optionRationales": [
      "A common refresher ignores role-specific barriers and lacks evidence that statistics knowledge is the constraint.",
      "The table does not identify supervisor motivation as the sole or primary cause.",
      "Analysts have 92% observed correct use, not the lowest percentage.",
      "Correct. It addresses documented opportunity barriers without assuming adequate knowledge proves complete skill."
    ],
    "formula": null,
    "assumptions": [
      "Knowledge check is the mean role-specific test score; access and job-aid usability are percentages of assessed staff meeting their respective criteria.",
      "Correct use is the percentage of eligible observed workflow opportunities performed correctly. Measures are descriptive; no individual causal linkage is supplied."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training needs analysis",
      "performance gap",
      "opportunity to perform",
      "job aid",
      "system access"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 17 - Training Needs Analysis",
    "sourcePages": "243–244",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 17 - Training Needs Analysis",
        "section": "Performance-gap cause discrimination",
        "pages": "243–244",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Role",
        "Knowledge check",
        "System access",
        "Job aid usable",
        "Observed correct use"
      ],
      "rows": [
        [
          "Operators",
          "88%",
          "54%",
          "42%",
          "49%"
        ],
        [
          "Supervisors",
          "81%",
          "96%",
          "91%",
          "78%"
        ],
        [
          "Analysts",
          "94%",
          "100%",
          "95%",
          "92%"
        ]
      ],
      "auditBatch": 7,
      "auditId": "mbb:set-2:original-163",
      "altText": "A role-based needs table shows operators with 88 percent knowledge but only 54 percent system access, 42 percent job-aid usability, and 49 percent correct use."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-07/datasets.json#mbb:set-2:original-163",
      "specRef": "test-bank-assets/mbb-160/batch-07/visual-specs.json#mbb:set-2:original-163",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-07/static-fallbacks.html#mbb-set-2-original-163",
      "altText": "A role-based needs table shows operators with 88 percent knowledge but only 54 percent system access, 42 percent job-aid usability, and 49 percent correct use.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-07/validation.json#mbb:set-2:original-163",
      "breakpointsValidated": [],
      "answerCueAudit": true
    },
    "trap": "A high average knowledge score does not prove every worker is competent or that all performance gaps are motivational.",
    "distractors": [
      "A common refresher ignores role-specific barriers and lacks evidence that statistics knowledge is the constraint.",
      "The table does not identify supervisor motivation as the sole or primary cause.",
      "Analysts have 92% observed correct use, not the lowest percentage.",
      "Correct. It addresses documented opportunity barriers without assuming adequate knowledge proves complete skill."
    ]
  },
  {
    "qid": "mbb:set-2:original-164",
    "set": 2,
    "batch": 7,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "C. Training Materials and Curriculum Development",
      "topic": "Deliberate practice for complex judgment",
      "code": "IV.C.2"
    },
    "difficulty": "Very Hard",
    "cognitive": "Analyze",
    "questionType": "Coaching, training, and failing-project diagnosis",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "Experienced clinicians must learn to distinguish statistical special-cause signals from common-cause variation and separately assess practical importance in noisy dashboards. Which learning design best develops that judgment in simulated cases?",
    "options": [
      "Use varied cases, explanatory feedback and reflection, then fade instructional support",
      "Use one expert lecture and a satisfaction survey as the only evidence of mastery",
      "Assign handbook reading and qualify everyone who completes it by the deadline",
      "Use one ideal dashboard and require exact repetition of the instructor's explanation"
    ],
    "answer": 0,
    "why": "A requires learners to make and defend decisions across varied cases, learn from explanatory feedback and move toward independent performance. It separates statistical evidence of process change from the practical importance of an outcome. Domain experience does not replace this analytical practice. Satisfaction, completion and imitation alone do not demonstrate transferable judgment. <b>A. Use varied cases, explanatory feedback and reflection, then fade instructional support</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 19 - Training Materials and Curriculum Development, pp. 256–283.</span>",
    "optionRationales": [
      "Correct. Varied decision practice and fading support develop and reveal independent reasoning.",
      "Satisfaction measures reaction, not accurate interpretation and transfer across noisy cases.",
      "Reading completion is exposure evidence, not demonstrated performance.",
      "Repeating a single example can reward recall rather than discrimination between different conditions."
    ],
    "formula": null,
    "assumptions": [
      "The cases are simulated and do not direct care for actual patients.",
      "Statistical signals and practical importance are separate learning objectives."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "adult learning",
      "deliberate practice",
      "feedback",
      "scaffolding",
      "transfer"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 19 - Training Materials and Curriculum Development",
    "sourcePages": "256–283",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 19 - Training Materials and Curriculum Development",
        "section": "Deliberate practice for complex judgment",
        "pages": "256–283",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "Detecting a statistical signal and judging its practical importance are separate skills; course satisfaction proves neither.",
    "distractors": [
      "Correct. Varied decision practice and fading support develop and reveal independent reasoning.",
      "Satisfaction measures reaction, not accurate interpretation and transfer across noisy cases.",
      "Reading completion is exposure evidence, not demonstrated performance.",
      "Repeating a single example can reward recall rather than discrimination between different conditions."
    ]
  },
  {
    "qid": "mbb:set-2:original-165",
    "set": 2,
    "batch": 7,
    "sub": "mbb-training",
    "bok": {
      "domain": "IV. Training Design and Delivery",
      "subdomain": "D. Training Program Effectiveness",
      "topic": "Causal evaluation of training transfer",
      "code": "IV.D"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Coaching, training, and failing-project diagnosis",
    "industry": "Service and transactional operations",
    "quantitative": false,
    "stem": "A course, software upgrade and incentive change were introduced to every team on the same date. Available records contain no variation that separates those changes. Defects then declined. Which evaluation response is most defensible now and for the next rollout?",
    "options": [
      "Attribute all reduction below the historical maximum to the course alone",
      "Report the combined change; independently vary training in a future controlled rollout",
      "Enter three identical start-date indicators in a regression to identify three separate causal effects",
      "Convert the immediate knowledge-score gain into the same percentage defect reduction"
    ],
    "answer": 1,
    "why": "B recognizes that the current records do not isolate the training contribution. Three perfectly coincident intervention indicators are collinear; a regression cannot recover separate effects from them. Report the observed combined change with its limitations. A future comparison should create defensible independent variation in training while holding the other changes common, with appropriate randomization, outcome definitions and fidelity checks where feasible. <b>B. Report the combined change; independently vary training in a future controlled rollout</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 20 - Training Effectiveness Evaluation, pp. 285–290.</span>",
    "optionRationales": [
      "A historical extreme is a biased comparison and does not separate the simultaneous interventions.",
      "Correct. It limits the current attribution and proposes variation that can address the confounding in a future study.",
      "Identical intervention columns do not identify separate effects, regardless of the regression software.",
      "Knowledge and operational defect measures are different constructs and do not share an automatic effect size."
    ],
    "formula": null,
    "assumptions": [
      "No valid external comparison or independently staggered intervention is available in the current records.",
      "A future staggered training comparison is feasible and does not withhold mandatory or safety-critical instruction."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "training evaluation",
      "comparison group",
      "staggered rollout",
      "transfer",
      "causal attribution"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 20 - Training Effectiveness Evaluation",
    "sourcePages": "285–290",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 20 - Training Effectiveness Evaluation",
        "section": "Causal evaluation of training transfer",
        "pages": "285–290",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "Perfectly coincident changes cannot be separated by merely adding collinear indicators to a regression.",
    "distractors": [
      "A historical extreme is a biased comparison and does not separate the simultaneous interventions.",
      "Correct. It limits the current attribution and proposes variation that can address the confounding in a future study.",
      "Identical intervention columns do not identify separate effects, regardless of the regression software.",
      "Knowledge and operational defect measures are different constructs and do not share an automatic effect size."
    ]
  },
  {
    "qid": "mbb:set-2:original-166",
    "set": 2,
    "batch": 7,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "A. Executives and Champions",
      "topic": "Champion decision quality at tollgates",
      "code": "V.A.2"
    },
    "difficulty": "Very Hard",
    "cognitive": "Evaluate",
    "questionType": "Leadership, deployment, and best-next-action scenario",
    "industry": "Cross-industry enterprise/deployment case",
    "quantitative": false,
    "stem": "A champion routinely approves tollgates after viewing only projected savings and asks the MBB to handle scope, risk, and stakeholder issues offline. What coaching intervention is strongest?",
    "options": [
      "Train the champion to recompute every statistical analysis personally before each gate",
      "Accept the approvals and file omitted risk evidence after the decision has been made",
      "Coach criteria-led gate decisions with owner-present evidence and targeted feedback",
      "Transfer all gate authority to Finance because projected savings are the only concern"
    ],
    "answer": 2,
    "why": "C makes the review a decision about continuing fit, scope, risk, resources and benefits, with accountable evidence at the time of approval. The MBB can model useful questions, observe decisions and provide targeted feedback. Technical literacy is valuable, but personal recomputation of every analysis is not the champion role. Filing evidence later or delegating the whole business decision to Finance does not repair weak governance. <b>C. Coach criteria-led gate decisions with owner-present evidence and targeted feedback</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 21 - Mentoring Champions, Change Agents, and Executives, pp. 294–305.</span>",
    "optionRationales": [
      "The champion needs informed decision making, not personal mastery of every detailed calculation.",
      "Retrospective filing cannot change the evidence used for an already completed approval.",
      "Correct. Explicit criteria and observed-decision feedback build accountable review behavior.",
      "Finance validates financial evidence but does not replace ownership of the overall business decision."
    ],
    "formula": null,
    "assumptions": [
      "The organization assigns tollgate decisions to the champion using approved scope, risk, resource and benefit criteria."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "champion coaching",
      "tollgate",
      "decision criteria",
      "feedback",
      "governance"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 21 - Mentoring Champions, Change Agents, and Executives",
    "sourcePages": "294–305",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 21 - Mentoring Champions, Change Agents, and Executives",
        "section": "Champion decision quality at tollgates",
        "pages": "294–305",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "A tollgate is a business decision, not a savings presentation, a filing exercise or a personal statistics examination for the Champion.",
    "distractors": [
      "The champion needs informed decision making, not personal mastery of every detailed calculation.",
      "Retrospective filing cannot change the evidence used for an already completed approval.",
      "Correct. Explicit criteria and observed-decision feedback build accountable review behavior.",
      "Finance validates financial evidence but does not replace ownership of the overall business decision."
    ]
  },
  {
    "qid": "mbb:set-2:original-167",
    "set": 2,
    "batch": 7,
    "sub": "mbb-coaching",
    "bok": {
      "domain": "V. Coaching and Mentoring Responsibilities",
      "subdomain": "B. Teams and Individuals",
      "topic": "Coaching inquiry versus expert rescue",
      "code": "V.B.1"
    },
    "difficulty": "Hard",
    "cognitive": "Evaluate",
    "questionType": "Coaching, training, and failing-project diagnosis",
    "industry": "Product development and engineering",
    "quantitative": false,
    "stem": "A capable Black Belt brings every ambiguous analysis choice to the MBB and waits for a direct answer. Quality is acceptable, but independent judgment is not developing. What should the MBB do?",
    "options": [
      "Keep prescribing each answer to maximize consistency and avoid independent judgment",
      "Stop all meetings until completion so the Belt must develop judgment without feedback",
      "Take over the analysis and let the Belt observe without making or defending decisions",
      "Probe the Belt’s own recommendation and evidence, then progressively fade support"
    ],
    "answer": 3,
    "why": "D creates practice in framing, recommending and defending a decision. The MBB can identify gaps through questions and targeted feedback, then reduce scaffolding as competence grows. Retain escalation for high-risk or unfamiliar decisions. Repeated expert rescue can reinforce dependence, whereas abrupt withdrawal creates unmanaged risk and passive observation does not demonstrate independent judgment. <b>D. Probe the Belt’s own recommendation and evidence, then progressively fade support</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 22 - Mentoring Black Belts and Green Belts, pp. 306–310.</span>",
    "optionRationales": [
      "Repeated prescription rewards dependence rather than developing the capability that is missing.",
      "Withdrawing all support removes feedback and may expose the project to avoidable risk.",
      "Observation alone does not provide practice in owning and defending analytical decisions.",
      "Correct. Evidence-led inquiry and gradually reduced support balance assurance with development."
    ],
    "formula": null,
    "assumptions": [
      "There is no immediate hazard requiring the MBB to take direct control.",
      "The Belt may escalate decisions beyond demonstrated competence or delegated authority."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "coaching",
      "inquiry",
      "fading support",
      "independent judgment",
      "feedback"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 22 - Mentoring Black Belts and Green Belts",
    "sourcePages": "306–310",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 22 - Mentoring Black Belts and Green Belts",
        "section": "Coaching inquiry versus expert rescue",
        "pages": "306–310",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "Repeated expert answers reinforce dependence; abrupt withdrawal is not the same as gradually fading support.",
    "distractors": [
      "Repeated prescription rewards dependence rather than developing the capability that is missing.",
      "Withdrawing all support removes feedback and may expose the project to avoidable risk.",
      "Observation alone does not provide practice in owning and defending analytical decisions.",
      "Correct. Evidence-led inquiry and gradually reduced support balance assurance with development."
    ]
  },
  {
    "qid": "mbb:set-2:original-168",
    "set": 2,
    "batch": 7,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. MSA, Process Capability, and Control",
      "topic": "Nested destructive gage R&R interpretation",
      "code": "VI.A.4"
    },
    "difficulty": "Expert",
    "cognitive": "Analyze",
    "questionType": "Statistical-output interpretation",
    "industry": "Manufacturing",
    "quantitative": true,
    "stem": "In a destructive study, three appraisers each test two distinct coupons from each of five production batches assigned only to that appraiser. No coupon is tested twice. A nested random-effects model reports the variance percentages below. Coupon homogeneity within batches is intended but not demonstrated. Which conclusion is most defensible?",
    "options": [
      "Residual plus appraiser terms contribute 24% of modeled variance, not necessarily pure measurement variance",
      "Measurement contributes only 6% because the residual term can be excluded from all measurement concerns",
      "The 76% batch contribution proves that the gage is acceptable for every classification and control use",
      "Destruction permits ordinary same-specimen repeatability estimates because different coupons are interchangeable"
    ],
    "answer": 0,
    "why": "A adds the two reported terms, 18%+6%=24%, without mislabeling them. In this design, the residual can contain within-batch coupon heterogeneity as well as measurement variation. The homogeneity assumption must be justified before treating that residual as repeatability. Under an adequate pure-measurement interpretation, 24% variance would correspond to sqrt(0.24)=48.99% of total standard deviation, not 24% study variation. No universal suitability conclusion follows from the table. <b>A. Residual plus appraiser terms contribute 24% of modeled variance, not necessarily pure measurement variance</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 24 - Measurement Systems Analysis, pp. 335–346.</span>",
    "optionRationales": [
      "Correct. It reports the modeled sum while preserving the unresolved specimen-homogeneity limitation.",
      "The residual cannot simply be ignored; it includes variation relevant to interpreting the destructive study.",
      "The table gives variance contributions, not universal acceptability or a 76% standard-deviation fraction.",
      "Distinct destroyed coupons are not repeat measurements of the same specimen without a justified grouping assumption."
    ],
    "formula": "Residual 18% + appraiser 6% = 24% of modeled variance; this is not necessarily pure measurement variance. If a pure-measurement interpretation is justified, sqrt(0.24)*100 = 48.99% study variation.",
    "assumptions": [
      "Batches are nested within appraisers and represent comparable, randomly allocated process material. The model has appraiser, batch-within-appraiser and residual terms.",
      "The supplied model estimates are nonnegative; raw readings are unavailable for refitting. No appraiser-by-common-batch interaction is estimable in this allocation.",
      "This explicit allocation is audit-authored to resolve the original ambiguous study description."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "destructive MSA",
      "nested gage R&R",
      "variance components",
      "repeatability",
      "reproducibility"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 24 - Measurement Systems Analysis",
    "sourcePages": "335–346",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 24 - Measurement Systems Analysis",
        "section": "Nested destructive gage R&R interpretation",
        "pages": "335–346",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      },
      {
        "id": "S2",
        "document": "Minitab: Gage studies with destructive testing",
        "url": "https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/supporting-topics/gage-r-r-and-wheeler-s-emp-studies/gage-studies-with-destructive-testing/",
        "verificationScope": "Destructive crossed/nested designs and the batch-homogeneity requirement."
      }
    ],
    "chart": {
      "type": "data-table",
      "columns": [
        "Variance source",
        "Percent of total variance"
      ],
      "rows": [
        [
          "Batch within appraiser",
          "76%"
        ],
        [
          "Residual within batch",
          "18%"
        ],
        [
          "Appraiser",
          "6%"
        ],
        [
          "Total",
          "100%"
        ]
      ],
      "auditBatch": 7,
      "auditId": "mbb:set-2:original-168",
      "altText": "Nested-model variance contributions: batch within appraiser 76%, residual within batch 18%, appraiser 6%, total 100%."
    },
    "visual": {
      "type": "data-table",
      "datasetRef": "test-bank-assets/mbb-160/batch-07/datasets.json#mbb:set-2:original-168",
      "specRef": "test-bank-assets/mbb-160/batch-07/visual-specs.json#mbb:set-2:original-168",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-07/static-fallbacks.html#mbb-set-2-original-168",
      "altText": "Nested-model variance contributions: batch within appraiser 76%, residual within batch 18%, appraiser 6%, total 100%.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-07/validation.json#mbb:set-2:original-168",
      "breakpointsValidated": [],
      "answerCueAudit": true
    },
    "trap": "Twenty-four percent of modeled variance is not twenty-four percent of standard deviation, nor necessarily pure measurement error.",
    "distractors": [
      "Correct. It reports the modeled sum while preserving the unresolved specimen-homogeneity limitation.",
      "The residual cannot simply be ignored; it includes variation relevant to interpreting the destructive study.",
      "The table gives variance contributions, not universal acceptability or a 76% standard-deviation fraction.",
      "Distinct destroyed coupons are not repeat measurements of the same specimen without a justified grouping assumption."
    ]
  },
  {
    "qid": "mbb:set-2:original-169",
    "set": 2,
    "batch": 7,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. MSA, Process Capability, and Control",
      "topic": "Transformation governance for capability",
      "code": "VI.A.5"
    },
    "difficulty": "Hard",
    "cognitive": "Apply",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "Positive cycle-time observations are strongly right-skewed. A preliminary Box–Cox fit makes the transformed observations approximately normal, while engineering limits remain fixed in seconds. What must the MBB require before reporting capability?",
    "options": [
      "Report transformed indices alone because a convenient distribution makes engineering units irrelevant",
      "Validate stability and fit, transform fixed limits consistently, and report risk with original-unit limits",
      "Discard the observations because nonnormal data cannot support any capability assessment",
      "Move the engineering limits until they become symmetric on the transformed scale"
    ],
    "answer": 1,
    "why": "B requires a stable, adequately modeled process and consistent treatment of the original engineering limits. The same monotone transformation must be applied to the observations and applicable limits. Tail probabilities and capability indices are dimensionless: do not back-transform them into seconds. Communicate engineering limits or modeled quantiles in seconds and probabilities as probabilities. Approximate normality alone does not establish process stability or suitability of the model. <b>B. Validate stability and fit, transform fixed limits consistently, and report risk with original-unit limits</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 24 - Measurement Systems Analysis; Process Capability, pp. 347–352.</span>",
    "optionRationales": [
      "Indices alone omit model assumptions and original-unit engineering meaning.",
      "Correct. It preserves fixed requirements, consistent modeling and the distinction between units and probabilities.",
      "Appropriate nonnormal models or justified transformations can support capability analysis.",
      "Specifications express requirements; they cannot be moved to make a model look more convenient."
    ],
    "formula": null,
    "assumptions": [
      "All cycle times are positive and the selected Box–Cox transformation is fixed and monotone over the relevant domain.",
      "The question supplies no fitted parameters or process data for a numerical capability calculation."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "Box-Cox",
      "nonnormal capability",
      "back transformation",
      "tail risk",
      "specification limits"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 24 - Measurement Systems Analysis; Process Capability",
    "sourcePages": "347–352",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 24 - Measurement Systems Analysis; Process Capability",
        "section": "Transformation governance for capability",
        "pages": "347–352",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      },
      {
        "id": "S2",
        "document": "NIST: What is process capability?",
        "url": "https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm",
        "verificationScope": "Dimensionless capability indices and process stability."
      }
    ],
    "trap": "Normal transformed observations do not establish process stability. Capability indices and probabilities are dimensionless.",
    "distractors": [
      "Indices alone omit model assumptions and original-unit engineering meaning.",
      "Correct. It preserves fixed requirements, consistent modeling and the distinction between units and probabilities.",
      "Appropriate nonnormal models or justified transformations can support capability analysis.",
      "Specifications express requirements; they cannot be moved to make a model look more convenient."
    ]
  },
  {
    "qid": "mbb:set-2:original-170",
    "set": 2,
    "batch": 7,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Regression extrapolation and leverage",
      "code": "VI.B.5"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Statistical-output interpretation",
    "industry": "Finance and insurance",
    "quantitative": true,
    "stem": "An intercept-plus-linear-predictor model is fitted to the eight observed claim cases shown. At the proposed policy-risk score x=105, the plot displays a 95% confidence interval for the mean response. No case at x=105 was observed. What is the strongest interpretation?",
    "options": [
      "The displayed interval proves the proposed policy is supported as well as the observed range",
      "A straight-line equation validates predictions beyond the observed predictor range",
      "The mean is extrapolated; its interval does not validate model form beyond the observed data",
      "Adding the proposed fitted value three times as observations would create independent support"
    ],
    "answer": 2,
    "why": "C identifies extrapolation beyond the observed x range 10–70. OLS from the eight retained cases gives intercept 17.00163532, slope 0.63221586 and residual df=6. At x=105, the fitted mean is 83.3843 ($000) and the conditional 95% mean-response interval is [80.3463, 86.4223] ($000). New-point leverage is 1.560507; unlike an observed hat-matrix diagonal, it can exceed one. The interval covers sampling uncertainty under the assumed linear model, not whether that form remains valid outside the data. An individual prediction interval is wider; neither interval supplies missing empirical support. <b>C. The mean is extrapolated; its interval does not validate model form beyond the observed data</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; Regression, pp. 370–402.</span>",
    "optionRationales": [
      "An interval calculated under a model does not validate that model outside the observed range.",
      "The ability to calculate an extrapolation does not establish that its structural assumptions hold.",
      "Correct. The proposed predictor is unsupported by nearby observations and is sensitive to model-form error.",
      "A model output is not an observed case; duplicating it would create false information and inappropriate weighting."
    ],
    "formula": null,
    "assumptions": [
      "For the displayed conditional interval, assume independent normal errors with common variance and a linear conditional mean. These assumptions are not evidence of validity outside 10–70.",
      "Claim severity is in thousands of dollars. The eight observed pairs are the complete fitting data; the proposal is excluded from fitting."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "regression",
      "extrapolation",
      "leverage",
      "model uncertainty",
      "prediction interval"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Regression",
    "sourcePages": "370–402",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Regression",
        "section": "Regression extrapolation and leverage",
        "pages": "370–402",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      },
      {
        "id": "S2",
        "document": "NIST: Least Squares",
        "url": "https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd431.htm",
        "verificationScope": "OLS fitting and model-dependent interpretation."
      }
    ],
    "chart": {
      "type": "regression-diagnostic",
      "title": "Observed cases and proposed policy score",
      "xLabel": "Policy-risk score",
      "yLabel": "Claim severity ($000)",
      "xTicks": [
        10,
        30,
        50,
        70,
        90,
        110
      ],
      "yTicks": [
        20,
        40,
        60,
        80,
        100
      ],
      "points": [
        {
          "x": 10,
          "y": 24
        },
        {
          "x": 18,
          "y": 29
        },
        {
          "x": 25,
          "y": 31
        },
        {
          "x": 34,
          "y": 39
        },
        {
          "x": 42,
          "y": 43
        },
        {
          "x": 51,
          "y": 49
        },
        {
          "x": 60,
          "y": 56
        },
        {
          "x": 70,
          "y": 61
        }
      ],
      "model": {
        "intercept": 17.001635322976274,
        "slope": 0.63221586263287,
        "n": 8,
        "df": 6,
        "mse": 0.9877895884437159,
        "tCritical": 2.4469118511449786
      },
      "proposal": {
        "x": 105,
        "mean": 83.38430089942763,
        "meanCI": [
          80.34633146424565,
          86.4222703346096
        ],
        "predictionInterval": [
          79.4928323396618,
          87.27576945919346
        ],
        "confidenceLevel": 0.95,
        "newPointLeverage": 1.5605069501226492
      },
      "auditBatch": 7,
      "auditId": "mbb:set-2:original-170",
      "altText": "Eight observed claim-severity pairs at scores 10 through 70, a fitted line, and a distinct unobserved proposal at score 105 with its calculated 95% mean-response interval."
    },
    "visual": {
      "type": "regression-diagnostic",
      "datasetRef": "test-bank-assets/mbb-160/batch-07/datasets.json#mbb:set-2:original-170",
      "specRef": "test-bank-assets/mbb-160/batch-07/visual-specs.json#mbb:set-2:original-170",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-07/static-fallbacks.html#mbb-set-2-original-170",
      "altText": "Eight observed claim-severity pairs at scores 10 through 70, a fitted line, and a distinct unobserved proposal at score 105 with its calculated 95% mean-response interval.",
      "interactionPurpose": "Inspect observed values and the unobserved proposal separately, with keyboard/touch selection and a matching data table.",
      "validationRef": "test-bank-assets/mbb-160/batch-07/validation.json#mbb:set-2:original-170",
      "breakpointsValidated": [],
      "answerCueAudit": true
    },
    "trap": "A conditional confidence interval for a mean neither validates extrapolated model form nor covers an individual claim at the same level.",
    "distractors": [
      "An interval calculated under a model does not validate that model outside the observed range.",
      "The ability to calculate an extrapolation does not establish that its structural assumptions hold.",
      "Correct. The proposed predictor is unsupported by nearby observations and is sensitive to model-form error.",
      "A model output is not an observed case; duplicating it would create false information and inappropriate weighting."
    ]
  },
  {
    "qid": "mbb:set-2:original-171",
    "set": 2,
    "batch": 7,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Logistic interaction and conditional effects",
      "code": "VI.B.3"
    },
    "difficulty": "Hard",
    "cognitive": "Understand",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Healthcare",
    "quantitative": false,
    "stem": "A binary logistic model for an adverse event (Y=1) includes treatment (0/1), centered severity and their interaction. The interaction is stipulated to be statistically and practically important. How should the treatment association be reported?",
    "options": [
      "As one constant odds ratio, because all logistic treatment effects are universal multipliers",
      "After deleting severity, because interaction terms make lower-order effects redundant",
      "After recoding the event as continuous, because a binary model cannot contain interactions",
      "As conditional odds ratios or predicted probabilities at specified severity values"
    ],
    "answer": 3,
    "why": "D recognizes that the treatment contrast on the log-odds scale is beta_T + beta_TS*s at centered severity s. The corresponding conditional odds ratio is exp(beta_T + beta_TS*s). The treatment coefficient alone refers to severity zero on the centered scale. Retain appropriate lower-order terms, report uncertainty and distinguish odds ratios from probability changes. No causal effect follows solely from including the interaction in a fitted model. <b>D. As conditional odds ratios or predicted probabilities at specified severity values</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; Logistic Regression, pp. 384–402.</span>",
    "optionRationales": [
      "The interaction explicitly permits the conditional odds ratio to change with severity.",
      "Lower-order terms ordinarily remain for coherent hierarchical interpretation of the interaction.",
      "Binary logistic regression can include interactions; artificial continuous recoding is not required.",
      "Correct. Conditional contrasts and probabilities translate the interaction into relevant severity-specific statements."
    ],
    "formula": null,
    "assumptions": [
      "Treatment is coded 0/1 and severity is centered at a stated clinically meaningful reference in the fitted model.",
      "Importance of the interaction is given; coefficients and raw data are not supplied for recomputing a p-value."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "logistic regression",
      "interaction",
      "conditional effect",
      "odds ratio",
      "predicted probability"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Logistic Regression",
    "sourcePages": "384–402",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Logistic Regression",
        "section": "Logistic interaction and conditional effects",
        "pages": "384–402",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "With an interaction, the treatment coefficient alone describes the contrast only at the reference severity; odds are not probabilities.",
    "distractors": [
      "The interaction explicitly permits the conditional odds ratio to change with severity.",
      "Lower-order terms ordinarily remain for coherent hierarchical interpretation of the interaction.",
      "Binary logistic regression can include interactions; artificial continuous recoding is not required.",
      "Correct. Conditional contrasts and probabilities translate the interaction into relevant severity-specific statements."
    ]
  },
  {
    "qid": "mbb:set-2:original-172",
    "set": 2,
    "batch": 7,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Reliability allocation for series subsystems",
      "code": "VI.B.9"
    },
    "difficulty": "Expert",
    "cognitive": "Apply",
    "questionType": "Multi-step quantitative",
    "industry": "Product development and engineering",
    "quantitative": true,
    "stem": "Three independent, nonrepairable series subsystems have reliabilities 0.98, 0.95 and 0.97 at the same fixed mission endpoint. Comparable engineering effort can raise exactly one by an absolute 0.01. Which system result and improvement priority are correct?",
    "options": [
      "System reliability is about 0.903; improving the 0.95 subsystem gives the largest absolute system gain",
      "System reliability is about 0.950; improving the 0.98 subsystem gives the largest relative system gain",
      "System reliability is about 0.995; improving any subsystem reduces overall reliability because it is a series system",
      "System reliability is about 0.903; every 0.01 subsystem improvement gives exactly the same absolute gain"
    ],
    "answer": 0,
    "why": "For a series system that needs all three independent subsystems, reliability is 0.98×0.95×0.97=0.90307. Improving A, B or C by an absolute 0.01 gives system gains 0.009215, 0.009506 or 0.009310 respectively. B, the 0.95 subsystem, therefore gives the greatest gain under the stated equal-increment assumptions. The three resulting system reliabilities are 0.912285, 0.912576 and 0.912380. Real allocation still requires cost, feasibility and dependence checks. <b>A. System reliability is about 0.903; improving the 0.95 subsystem gives the largest absolute system gain</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; Reliability, pp. 423–428.</span>",
    "optionRationales": [
      "Correct. The product is approximately 0.903, and the 0.95 subsystem gives the largest specified equal-increment gain.",
      "The product is 0.90307, not 0.950, and the largest equal-increment gain is obtained from the 0.95 subsystem.",
      "Increasing a subsystem reliability cannot reduce this independent series product.",
      "Each increment is multiplied by a different product of the two unchanged subsystem reliabilities."
    ],
    "formula": "Rs=0.98(0.95)(0.97)=0.90307; gains for +0.01 are 0.009215, 0.009506, and 0.00931 respectively.",
    "assumptions": [
      "All three subsystems must work throughout the same mission; failure probabilities are independent.",
      "Other reliabilities and dependence do not change after the specified improvement. No additional common-mode failure is introduced.",
      "The supplied endpoint probabilities are not lifetime curves; no distribution of failure time is assumed."
    ],
    "estimatedMinutes": 5,
    "keywords": [
      "series reliability",
      "reliability allocation",
      "mission reliability",
      "independence",
      "improvement priority"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Reliability",
    "sourcePages": "423–428",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Reliability",
        "section": "Reliability allocation for series subsystems",
        "pages": "423–428",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      },
      {
        "id": "S2",
        "document": "NIST: Series model",
        "url": "https://www.itl.nist.gov/div898/handbook/apr/section1/apr182.htm",
        "verificationScope": "Independent series reliability product."
      }
    ],
    "chart": {
      "type": "reliability-plot",
      "plotMode": "mission-endpoints",
      "title": "Reliability at the fixed mission endpoint",
      "xLabel": "Mission reliability (probability)",
      "yLabel": "Subsystem",
      "components": [
        {
          "label": "Subsystem A",
          "reliability": 0.98
        },
        {
          "label": "Subsystem B",
          "reliability": 0.95
        },
        {
          "label": "Subsystem C",
          "reliability": 0.97
        }
      ],
      "auditBatch": 7,
      "auditId": "mbb:set-2:original-172",
      "altText": "At the same fixed mission endpoint: subsystem A reliability 0.98, B 0.95 and C 0.97. No intermediate-time curve is supplied."
    },
    "visual": {
      "type": "reliability-plot",
      "datasetRef": "test-bank-assets/mbb-160/batch-07/datasets.json#mbb:set-2:original-172",
      "specRef": "test-bank-assets/mbb-160/batch-07/visual-specs.json#mbb:set-2:original-172",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-07/static-fallbacks.html#mbb-set-2-original-172",
      "altText": "At the same fixed mission endpoint: subsystem A reliability 0.98, B 0.95 and C 0.97. No intermediate-time curve is supplied.",
      "interactionPurpose": "",
      "validationRef": "test-bank-assets/mbb-160/batch-07/validation.json#mbb:set-2:original-172",
      "breakpointsValidated": [],
      "answerCueAudit": true
    },
    "trap": "Equal absolute component improvements give different series-system gains because each is multiplied by the other component reliabilities.",
    "distractors": [
      "Correct. The product is approximately 0.903, and the 0.95 subsystem gives the largest specified equal-increment gain.",
      "The product is 0.90307, not 0.950, and the largest equal-increment gain is obtained from the 0.95 subsystem.",
      "Increasing a subsystem reliability cannot reduce this independent series product.",
      "Each increment is multiplied by a different product of the two unchanged subsystem reliabilities."
    ]
  },
  {
    "qid": "mbb:set-2:original-173",
    "set": 2,
    "batch": 7,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "B. Measuring and Modeling Relationships",
      "topic": "Monte Carlo input-dependence governance",
      "code": "VI.B.7"
    },
    "difficulty": "Very Hard",
    "cognitive": "Apply",
    "questionType": "Multi-step quantitative",
    "industry": "Supply chain, logistics, and distribution",
    "quantitative": false,
    "stem": "Demand and replenishment lead time historically rise together during disruptions. A Monte Carlo inventory model samples them independently and reports only a 3% stockout probability. What should the MBB require?",
    "options": [
      "Accept the estimate because independence is always conservative for right-skewed inputs",
      "Validate dependence and disruption regimes, including sensitivity of joint-tail risk",
      "Increase trial count until it automatically repairs the missing dependence structure",
      "Replace uncertain inputs with their means to eliminate unusual input combinations"
    ],
    "answer": 1,
    "why": "B evaluates whether the joint input model represents the disruption mechanism. Independence can distort simultaneous high-demand/long-lead-time events, and marginal distributions or a single correlation coefficient do not uniquely determine joint-tail behavior. More trials reduce Monte Carlo sampling error but not this structural error. The supplied information does not determine the true stockout probability or prove that every dependent alternative must exceed 3%. <b>B. Validate dependence and disruption regimes, including sensitivity of joint-tail risk</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 25 - Measuring and Modeling Relationships Between Variables; Monte Carlo Simulation, pp. 414–416.</span>",
    "optionRationales": [
      "Independence is not universally conservative; the result depends on the joint model and inventory decision rule.",
      "Correct. Joint-model validation and sensitivity address the risk mechanism rather than simulation precision alone.",
      "More trials converge to the assumptions already programmed; they do not repair a misspecified joint distribution.",
      "Replacing inputs with means removes the variability needed to assess tail events."
    ],
    "formula": null,
    "assumptions": [
      "The reported 3% is an output of the current model, not an independently established stockout rate.",
      "Raw joint data and the stockout function are not supplied, so no replacement probability can be calculated."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "Monte Carlo",
      "correlation",
      "joint tail",
      "stockout risk",
      "model validation"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Monte Carlo Simulation",
    "sourcePages": "414–416",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 25 - Measuring and Modeling Relationships Between Variables; Monte Carlo Simulation",
        "section": "Monte Carlo input-dependence governance",
        "pages": "414–416",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "More simulation trials cannot repair the wrong joint-input model; one correlation coefficient does not identify all joint-tail behavior.",
    "distractors": [
      "Independence is not universally conservative; the result depends on the joint model and inventory decision rule.",
      "Correct. Joint-model validation and sensitivity address the risk mechanism rather than simulation precision alone.",
      "More trials converge to the assumptions already programmed; they do not repair a misspecified joint distribution.",
      "Replacing inputs with means removes the variability needed to assess tail events."
    ]
  },
  {
    "qid": "mbb:set-2:original-174",
    "set": 2,
    "batch": 7,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "C. Design of Experiments",
      "topic": "Aliasing and foldover design augmentation",
      "code": "VI.C.3"
    },
    "difficulty": "Very Hard",
    "cognitive": "Understand",
    "questionType": "DOE/optimization design and diagnosis",
    "industry": "Manufacturing",
    "quantitative": true,
    "stem": "A regular 2^(4−1) screening fraction uses I=ABCD (D=ABC). The plotted means summarize its four A-by-B cells. To investigate the two-factor contrast, which follow-up is justified?",
    "options": [
      "AB is independently estimable; retain the fraction and replicate the original eight runs",
      "AB is aliased with CD; reverse all four factor signs in eight added runs to separate them",
      "AB is aliased with CD; reverse D alone in the eight added runs to separate them",
      "AB is aliased with C; omit D from the model to identify AB using the existing runs"
    ],
    "answer": 2,
    "why": "Multiplying I=ABCD by AB gives AB=CD for the original fraction: the columns share a contrast, not necessarily the same physical effect. Reversing D alone gives the complementary fraction I=−ABCD; adding its eight runs separates the two-factor effects. Reversing all four signs leaves the even product ABCD unchanged and reproduces the original fraction, so it does not break this alias. The plotted factorial contrast is −15 response units, but the plot does not identify how much is AB versus CD or establish significance without error information. <b>C. AB is aliased with CD; reverse D alone in the eight added runs to separate them</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 26 - Design of Experiments; Screening Designs, pp. 429–450.</span>",
    "optionRationales": [
      "Resolution IV protects main effects from two-factor aliases, not all two-factor effects from each other.",
      "Reversing four signs preserves ABCD=+1; the added settings repeat the same fraction and its alias.",
      "Correct. A D-only foldover generates the complementary fraction and breaks the AB/CD alias.",
      "AB is aliased with CD, not C; removing a fitted term cannot supply the missing experimental contrast."
    ],
    "formula": "I=ABCD implies AB=CD, AC=BD and AD=BC in the original fraction. Compare the defining-product sign before and after the proposed augmentation.",
    "assumptions": [
      "Factors are coded −1/+1; the original fraction has all eight combinations of A, B and C with D=ABC.",
      "Each displayed A-by-B mean averages two original runs. Raw response replicates and an error estimate are not supplied.",
      "Both stages can be randomized and run under comparable conditions, or their stage effects must be appropriately modeled."
    ],
    "estimatedMinutes": 4,
    "keywords": [
      "fractional factorial",
      "defining relation",
      "alias",
      "resolution IV",
      "foldover"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 26 - Design of Experiments; Screening Designs",
    "sourcePages": "429–450",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 26 - Design of Experiments; Screening Designs",
        "section": "Aliasing and foldover design augmentation",
        "pages": "429–450",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      },
      {
        "id": "S2",
        "document": "Stat-Ease: Foldover",
        "url": "https://www.statease.com/docs/v22.0/contents/advanced-topics/foldover/",
        "verificationScope": "Resolution IV single-factor foldover versus all-factor mirroring."
      }
    ],
    "chart": {
      "type": "two-level-interaction",
      "title": "Screening interaction contrast",
      "factorA": "Factor A",
      "factorB": "Factor B",
      "xLowLabel": "A low",
      "xHighLabel": "A high",
      "lowLabel": "B low",
      "highLabel": "B high",
      "lowLine": [
        62,
        78
      ],
      "highLine": [
        80,
        66
      ],
      "yLabel": "Mean response (response units)",
      "yDomain": [
        55,
        85
      ],
      "yTicks": [
        60,
        70,
        80
      ],
      "designRows": [
        [
          -1,
          -1,
          -1,
          -1
        ],
        [
          -1,
          -1,
          1,
          1
        ],
        [
          -1,
          1,
          -1,
          1
        ],
        [
          -1,
          1,
          1,
          -1
        ],
        [
          1,
          -1,
          -1,
          1
        ],
        [
          1,
          -1,
          1,
          -1
        ],
        [
          1,
          1,
          -1,
          -1
        ],
        [
          1,
          1,
          1,
          1
        ]
      ],
      "auditBatch": 7,
      "auditId": "mbb:set-2:original-174",
      "altText": "B-low means are 62 and 78 at A low/high; B-high means are 80 and 66. Original coded factor settings and the four means are available as tables."
    },
    "visual": {
      "type": "two-level-interaction",
      "datasetRef": "test-bank-assets/mbb-160/batch-07/datasets.json#mbb:set-2:original-174",
      "specRef": "test-bank-assets/mbb-160/batch-07/visual-specs.json#mbb:set-2:original-174",
      "staticAssetRef": "test-bank-assets/mbb-160/batch-07/static-fallbacks.html#mbb-set-2-original-174",
      "altText": "B-low means are 62 and 78 at A low/high; B-high means are 80 and 66. Original coded factor settings and the four means are available as tables.",
      "interactionPurpose": "Inspect the four displayed cell means with keyboard or touch; view the original factor coding without a precomputed alias label.",
      "validationRef": "test-bank-assets/mbb-160/batch-07/validation.json#mbb:set-2:original-174",
      "breakpointsValidated": [],
      "answerCueAudit": true
    },
    "trap": "Reversing all four signs preserves ABCD in this even-order fraction. Reverse one factor to obtain the complementary fraction.",
    "distractors": [
      "Resolution IV protects main effects from two-factor aliases, not all two-factor effects from each other.",
      "Reversing four signs preserves ABCD=+1; the added settings repeat the same fraction and its alias.",
      "Correct. A D-only foldover generates the complementary fraction and breaks the AB/CD alias.",
      "AB is aliased with CD, not C; removing a fitted term cannot supply the missing experimental contrast."
    ]
  },
  {
    "qid": "mbb:set-2:original-175",
    "set": 2,
    "batch": 7,
    "sub": "mbb-analytics",
    "bok": {
      "domain": "VI. Advanced Data Management and Analytic Methods",
      "subdomain": "A. MSA, Process Capability, and Control",
      "topic": "APC-SPC layered monitoring architecture",
      "code": "VI.A.6"
    },
    "difficulty": "Hard",
    "cognitive": "Understand",
    "questionType": "Advanced conceptual/method-selection",
    "industry": "Manufacturing",
    "quantitative": false,
    "stem": "A reactor controller must remain active during production. Planned product-grade changes require different temperature setpoints, and a pooled chart signals at nearly every change. Which monitoring architecture best distinguishes expected regime changes from deterioration?",
    "options": [
      "Treat every planned grade-transition signal as a separate unknown root cause",
      "Disable required feedback while sampling to guarantee independent observations",
      "Widen the same raw-temperature limits until all grade-transition signals disappear",
      "Use regime-adjusted, time-aware monitoring and a coordinated response plan"
    ],
    "answer": 3,
    "why": "D uses the known operating regime rather than treating all setpoints as one unchanged process. Suitable models can separate expected grade transitions from unexplained within-regime changes and account for feedback dynamics and time dependence. Controller effort and disturbances can reveal changes masked in the controlled output. Signals guide a coordinated investigation; they are not themselves proof of a specific cause. Disabling required control or widening limits without justification does not solve the statistical problem. <b>D. Use regime-adjusted, time-aware monitoring and a coordinated response plan</b> <span class=\"tb-source-ref\">Concept reference: Kubiak (2012), Chapter 27 - Automated Process Control and SPC, pp. 451–453.</span>",
    "optionRationales": [
      "Known planned transitions are not automatically separate unknown root causes requiring unrelated investigations.",
      "Turning off required control can be unsafe and does not guarantee that serial dependence disappears.",
      "Arbitrarily widening pooled limits can conceal deterioration rather than model the expected operating regimes.",
      "Correct. Regime-aware, time-aware evidence and a shared response plan complement necessary feedback control."
    ],
    "formula": null,
    "assumptions": [
      "Grade-dependent setpoints and transition conditions are authorized engineering requirements.",
      "The scenario concerns monitoring design, not changing the safety-critical control system."
    ],
    "estimatedMinutes": 3,
    "keywords": [
      "APC",
      "SPC",
      "controller demand",
      "disturbance monitoring",
      "autocorrelation",
      "diagnostic plan"
    ],
    "sourceDocument": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
    "sourceSection": "Chapter 27 - Automated Process Control and SPC",
    "sourcePages": "451–453",
    "sources": [
      {
        "id": "S1",
        "document": "The Certified Six Sigma Master Black Belt Handbook (Kubiak, 2012)",
        "chapter": "Chapter 27 - Automated Process Control and SPC",
        "section": "APC-SPC layered monitoring architecture",
        "pages": "451–453",
        "verificationScope": "Concept/topic locator. Case-specific reasoning is audit analysis; not every page of an inherited range has been independently verified."
      }
    ],
    "trap": "Expected grade/setpoint changes require regime-aware monitoring, not disabling required feedback or widening limits until alarms disappear.",
    "distractors": [
      "Known planned transitions are not automatically separate unknown root causes requiring unrelated investigations.",
      "Turning off required control can be unsafe and does not guarantee that serial dependence disappears.",
      "Arbitrarily widening pooled limits can conceal deterioration rather than model the expected operating regimes.",
      "Correct. Regime-aware, time-aware evidence and a shared response plan complement necessary feedback control."
    ]
  }
];

  global.MBB_SET2_BATCHES=global.MBB_SET2_BATCHES||{};
  global.MBB_SET2_BATCHES[1]=batch1;
  global.MBB_SET2_BATCHES[2]=batch2;
  global.MBB_SET2_BATCHES[3]=batch3;
  global.MBB_SET2_BATCHES[4]=batch4;
  global.MBB_SET2_BATCHES[5]=batch5;
  global.MBB_SET2_BATCHES[6]=batch6;
  global.MBB_SET2_BATCHES[7]=batch7;
  global.MBB_SET2=Object.keys(global.MBB_SET2_BATCHES).sort(function(a,b){return Number(a)-Number(b);}).reduce(function(all,key){return all.concat(global.MBB_SET2_BATCHES[key]);},[]);
})(typeof window!=='undefined'?window:globalThis);
