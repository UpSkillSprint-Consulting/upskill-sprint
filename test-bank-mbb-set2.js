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
      qid:'mbb:set-2:original-001',set:2,batch:1,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'A. Strategic Plan Development',topic:'Hoshin Kanri and strategic plan deployment'},
      difficulty:'Very Hard',cognitive:'Apply',questionType:'Visual evidence interpretation, non-statistical',industry:'Supply chain, logistics, and distribution',quantitative:false,
      stem:'The target-and-means cascade shown below was issued top-down. Each function then developed its proposed means independently, and leaders plan to lock the annual plan tomorrow. Which action should the Master Black Belt recommend before the plan is finalized?',
      options:[
        'Approve the cascade because every proposed means has a numeric target and functional owner, then review results at quarterly checkpoints',
        'Replace the unresolved constraints with stretch targets owned by each function and let annual performance reviews resolve any conflicts',
        'Run catchball across levels and functions to negotiate means, constraints, resources, and shared ownership',
        'Convert every target into an independent DMAIC charter before discussing cross-functional conflicts'
      ],answer:2,
      why:'Hoshin Kanri requires more than a top-down cascade. Catchball tests whether proposed means are feasible, reconciles shared constraints such as IT capacity and contracts, and creates vertical and horizontal alignment before commitments are locked. Numeric targets alone do not resolve conflicting means. <b>C. Run catchball across levels and functions to negotiate means, constraints, resources, and shared ownership</b> <span class="tb-source-ref">Source: Kubiak, Chapter 1, Hoshin Kanri, pp. 7-12.</span>',
      optionRationales:[
        'A target can be measurable while its means remain infeasible or mutually inconsistent.',
        'Relabeling constraints as stretch targets conceals capacity and dependency risk.',
        'Correct. Catchball negotiates targets and means vertically and coordinates them horizontally.',
        'Projects should follow strategic alignment; premature charters would institutionalize unresolved conflicts.'
      ],
      formula:null,assumptions:['The table is the complete information available before plan approval.','The unresolved constraints affect more than one organizational unit.'],estimatedMinutes:3,
      keywords:['Hoshin Kanri','catchball','strategic deployment','horizontal alignment','target and means'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 1 - Hoshin Kanri',sourcePages:'7-12',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 1 - Strategic Plan Deployment',section:'Hoshin Kanri',pages:'7-12'}],
      chart:{type:'data-table',columns:['Level / function','Target','Proposed means','Unresolved constraint'],rows:[
        ['Corporate','Reduce end-to-end lead-time variation 30%','Regional standard work','None recorded'],
        ['East distribution','Reduce picking cycle 25%','Add a shift and automate picking','Shared IT capacity unknown'],
        ['West transport','Reduce transport delay 20%','Consolidate carriers','Procurement contract conflict'],
        ['Customer service','Reduce status calls 40%','Launch self-service portal','Same IT capacity required']
      ]},
      visual:visual('mbb:set-2:original-001','data-table','A four-row deployment table shows corporate and functional targets, proposed means, and unresolved cross-functional constraints. East distribution and customer service require the same unconfirmed IT capacity, while West transport has a procurement conflict.')
    },
    {
      qid:'mbb:set-2:original-002',set:2,batch:1,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'B. Strategic Plan Alignment',topic:'Project alignment with strategic plans and business objectives'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Healthcare',quantitative:false,
      stem:'A health system has three proposed projects: automate central scheduling, reduce denied claims, and redesign community vaccination outreach. Its three strategic objectives are shorter access time, improved operating margin, and reduced rural health inequity. Each project sponsor claims strategic alignment, but none has defined a measurable contribution to an objective. What should the Master Black Belt do first?',
      options:[
        'Require each sponsor to map project CTQs and benefits to a strategic objective and quantify the expected contribution before ranking',
        'Rank the projects by sponsor seniority and stated urgency because executives are accountable for translating strategy into action',
        'Approve all three after recording a qualitative association to an objective, then quantify each contribution during Measure',
        'Select denied claims first because measurable margin improvements should precede access-time and health-equity outcomes'
      ],answer:0,
      why:'Strategic alignment must be testable. Mapping each project\'s CTQs, outcome measures, and expected benefits to a strategic objective creates the evidence needed for comparison and exposes weak or merely verbal alignment. Sponsor rank and a finance-first rule do not establish enterprise value. <b>A. Require each sponsor to map project CTQs and benefits to a strategic objective and quantify the expected contribution before ranking</b> <span class="tb-source-ref">Source: Kubiak, Chapter 2, Project Alignment with Strategic Plans and Business Objectives, pp. 23-27.</span>',
      optionRationales:['Correct. It creates a measurable line of sight from project outputs to enterprise outcomes.','Authority is not a substitute for quantified strategic contribution.','Qualitative association is insufficient for prioritization and benefit governance.','The strategy contains three legitimate dimensions; finance does not automatically dominate.'],
      formula:null,assumptions:['The objectives have already been approved.','No project is legally mandatory.'],estimatedMinutes:2,
      keywords:['strategic alignment','CTQ','business objectives','project selection','line of sight'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 2 - Project Alignment with Strategic Plans and Business Objectives',sourcePages:'23-27',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 2 - Strategic Plan Alignment',section:'Project Alignment with Strategic Plans; Project Alignment with Business Objectives',pages:'23-27'}]
    },
    {
      qid:'mbb:set-2:original-003',set:2,batch:1,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'C. Infrastructure Elements of Improvement Systems',topic:'Governance, assessment, resource planning, execution, and system improvement'},
      difficulty:'Very Hard',cognitive:'Apply',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Finance and insurance',quantitative:false,
      stem:'An insurer trained 92 Belts in one year. Thirty-eight projects are active, only nine have engaged sponsors, benefit calculations use four incompatible definitions, and no project has passed an independent finance review. The executive committee proposes training another 60 Belts to accelerate results. Which response best addresses the deployment system?',
      options:[
        'Train the new cohort, require each candidate to bring a fully screened project charter, and use training completion as the deployment-readiness gate',
        'Freeze every project until the organization adopts one statistical package and retrains all current Belts on that platform',
        'Move validation to the Belts with a standard self-certification worksheet and involve Finance only for disputed results',
        'Pause cohort expansion, assess deployment maturity, standardize governance and benefit rules, and align sponsor and project capacity'
      ],answer:3,
      why:'The constraint is the deployment infrastructure, not the number of trained people. More Belts would increase work in process while sponsorship, governance, project selection, and benefit validation remain unstable. A maturity assessment and resource-capacity plan should precede further expansion. <b>D. Pause cohort expansion, assess deployment maturity, standardize governance and benefit rules, and align sponsor and project capacity</b> <span class="tb-source-ref">Source: Kubiak, Chapter 3, Governance through Measure and Improve the System, pp. 28-52.</span>',
      optionRationales:['A project idea does not repair sponsorship, governance, or finance controls.','Software standardization is secondary and does not justify freezing all useful work.','Independent benefit validation is a governance control and should not be removed from Finance.','Correct. It treats the deployment as a system and matches demand with governing capacity.'],
      formula:null,assumptions:['The current projects are not subject to an immediate safety or regulatory stop.'],estimatedMinutes:2,
      keywords:['deployment maturity','governance','resource planning','benefit validation','work in process'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 3 - Deployment of Six Sigma Systems',sourcePages:'28-52',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 3 - Deployment of Six Sigma Systems',section:'Governance; Assessment; Resource Planning; Execution; Measure and Improve the System',pages:'28-52'}]
    },
    {
      qid:'mbb:set-2:original-004',set:2,batch:1,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'D. Improvement Methodologies',topic:'Integrated selection of DMAIC, DMADV, Lean, and theory of constraints'},
      difficulty:'Expert',cognitive:'Apply',questionType:'Advanced conceptual/method-selection',industry:'Product development and engineering',quantitative:false,
      stem:'A manufacturer must design a new connected service whose customer requirements are still being translated, improve the chronic installation defects in its existing service, and relieve a single certification laboratory that limits total throughput. Which deployment architecture is most defensible?',
      options:[
        'Use DMAIC for all three because a common roadmap and tollgate vocabulary are more important than differences in problem type',
        'Use DMADV for the new service, DMAIC for chronic defects, and constraint-focused flow improvement for the laboratory within one governance system',
        'Use Lean only, because waste elimination can be extended to customer design, chronic variation, laboratory capacity, and every related governance decision',
        'Use separate methodologies with separate executives, measures, benefit rules, and portfolio reviews so that each technical approach preserves its purity'
      ],answer:1,
      why:'The roadmap should match the nature of the work. DMADV fits a new design with requirements translation, DMAIC fits an existing underperforming process with unknown causes, and theory-of-constraints/Lean flow methods address the system bottleneck. Shared governance prevents competing local optimizations. <b>B. Use DMADV for the new service, DMAIC for chronic defects, and constraint-focused flow improvement for the laboratory within one governance system</b> <span class="tb-source-ref">Source: Kubiak, Chapter 4, Six Sigma Methodologies, pp. 53-69.</span>',
      optionRationales:['A single roadmap can force inappropriate assumptions about whether a process or design already exists.','Correct. It selects methods by problem type while integrating deployment governance.','Lean alone does not provide the complete design and advanced variation-analysis roadmaps required here.','Fragmented governance encourages conflicting objectives and incomparable benefits.'],
      formula:null,assumptions:['The new service has no stable existing design to improve.','The certification laboratory is the verified system constraint.'],estimatedMinutes:3,
      keywords:['DMAIC','DMADV','Lean','theory of constraints','method selection'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 4 - Six Sigma Methodologies',sourcePages:'53-69',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 4 - Six Sigma Methodologies',section:'DMAIC; DFSS; Lean; Business Systems and Process Management',pages:'53-69'}]
    },
    {
      qid:'mbb:set-2:original-005',set:2,batch:1,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'F. Pipeline Management',topic:'Pipeline creation, prioritization, life-cycle management, and risk'},
      difficulty:'Expert',cognitive:'Create',questionType:'Portfolio, finance, and risk scenario',industry:'Cross-industry enterprise/deployment case',quantitative:false,
      stem:'The enterprise has eight Black-Belt-months available for the next planning window. The portfolio snapshot is shown below. P1 is mandatory within the window; P6 cannot begin until an enterprise data foundation exists. Which pipeline decision best balances strategy, capacity, value, and risk?',
      options:[
        'Authorize P1 and P2, use the remaining capacity to define P6\'s prerequisite, and re-evaluate the deferred projects at the next gate',
        'Authorize P2 and P6 because their combined NPV is highest, then seek emergency resources for mandatory P1',
        'Authorize P1, P3, and P5 because their combined demand fills capacity and diversifies the portfolio',
        'Start every project at reduced staffing so none loses its sponsor or priority position during this window'
      ],answer:0,
      why:'P1 must be protected. P2 adds strong alignment and value using four more Black-Belt-months, leaving one month to define the missing data prerequisite for strategically attractive P6. This preserves capacity discipline and creates an explicit re-evaluation point instead of overloading the pipeline. <b>A. Authorize P1 and P2, use the remaining capacity to define P6\'s prerequisite, and re-evaluate the deferred projects at the next gate</b> <span class="tb-source-ref">Source: Kubiak, Chapter 6, Risk Management and Pipeline Creation/Management, pp. 88-99.</span>',
      optionRationales:['Correct. It satisfies the mandatory commitment, respects capacity, and manages P6\'s dependency explicitly.','P6 is not ready and this choice omits the mandatory project.','Filling capacity exactly does not compensate for weak alignment and lower value.','Starting all projects creates excessive work in process and hides the capacity constraint.'],
      formula:null,assumptions:['NPV estimates are comparable and already finance-validated.','Black-Belt-months are the binding resource.','Mandatory means P1 must be staffed during this window.'],estimatedMinutes:4,
      keywords:['pipeline management','capacity','portfolio risk','project prioritization','dependencies'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 6 - Risk Analysis of Projects and the Pipeline',sourcePages:'88-99',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 6 - Risk Analysis of Projects and the Pipeline',section:'Risk Management; Pipeline Creation; Pipeline Management',pages:'88-99'}],
      chart:{type:'data-table',columns:['Project','Strategic alignment (1-5)','Finance-validated NPV','BB-months','Readiness / constraint'],rows:[
        ['P1 - Regulatory complaints','5','$0.4M','3','Mandatory; ready'],
        ['P2 - Predictive maintenance','4','$1.5M','4','Ready; medium risk'],
        ['P3 - Billing rework','2','$0.9M','3','Ready; low risk'],
        ['P4 - Supplier digitization','4','$0.7M','2','Depends on P1 output'],
        ['P5 - Warehouse space','3','$0.5M','2','Ready; low risk'],
        ['P6 - Demand forecasting','5','$1.8M','5','Data foundation absent']
      ],whatIf:{id:'mbb-b01-q005-capacity',label:'Explore available capacity',min:6,max:12,step:1,value:8,unit:'BB-months',committed:3,committedLabel:'mandatory P1'}},
      visual:visual('mbb:set-2:original-005','data-table','A six-project portfolio table gives strategic-alignment ratings, finance-validated NPVs, Black-Belt-month demand, and readiness constraints. P1 is mandatory and needs three months. P2 is ready and needs four. P6 has the highest NPV but lacks its data foundation.','Adjust the available Black-Belt-month capacity to compare which portfolio remains feasible and which prerequisite work becomes fundable.')
    },
    {
      qid:'mbb:set-2:original-006',set:2,batch:1,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'A. Organizational Design',topic:'Systems thinking and unintended consequences'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Service and transactional operations',quantitative:false,
      stem:'A contact center reduced average handle time by 18% after agents were rewarded for ending calls quickly. Transfers increased 33%, repeat calls increased 28%, and total weekly labor hours rose 11%. Leaders want to tighten the handle-time target. What is the strongest systems-thinking response?',
      options:[
        'Tighten the target only for experienced agents and monitor repeat calls because those agents have lower learning-curve risk',
        'Remove every handle-time measure, replace it with customer-satisfaction survey results, and continue managing transfers and repeat demand within current functional boundaries',
        'Add rewards for low transfer and repeat-call rates while leaving the process boundary and handle-time target unchanged',
        'Map the end-to-end feedback effects and redesign the measures around resolution, repeat demand, customer outcome, and total system effort'
      ],answer:3,
      why:'The local target shifted work into transfers and repeat demand, increasing total effort. Systems thinking expands the boundary, examines feedback and delay, and prevents suboptimization by linking local actions to end-to-end outcomes. <b>D. Map the end-to-end feedback effects and redesign the measures around resolution, repeat demand, customer outcome, and total system effort</b> <span class="tb-source-ref">Source: Kubiak, Chapter 7, Systems Thinking, pp. 100-103.</span>',
      optionRationales:['Experience segmentation does not correct the incentive\'s system-level effect.','Handle time can remain useful as a balancing diagnostic; the issue is using it as the dominant reward target.','A second local target can create another gaming tradeoff without changing the system boundary.','Correct. It measures the full causal pathway and total-system result.'],
      formula:null,assumptions:['The changes occurred after the reward system and no major volume mix shift occurred.'],estimatedMinutes:3,
      keywords:['systems thinking','suboptimization','feedback loop','unintended consequences','metrics'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 7 - Systems Thinking',sourcePages:'100-103',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 7 - Organizational Design',section:'Systems Thinking',pages:'100-103'}]
    },
    {
      qid:'mbb:set-2:original-007',set:2,batch:1,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'B. Executive and Team Leadership Roles',topic:'Executive responsibilities for resources, change, and communication'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Public sector, nonprofit, and regulated operations',quantitative:false,
      stem:'A public agency\'s executive sponsor attends project kickoffs but delegates every review, line managers penalize Belt time as lost utilization, and Finance will not validate benefits without executive direction. The steering committee asks the Master Black Belt to compensate through stronger technical coaching. What should the MBB recommend?',
      options:[
        'Increase technical review frequency, let the MBB resolve resource conflicts at each tollgate, and postpone benefit validation until the projects succeed without sponsor intervention',
        'Require executive ownership of resource conflicts, benefit-governance decisions, and a consistent deployment message while the MBB continues technical coaching',
        'Move all Belts into a permanent central department, transfer staffing authority to the MBB, and prevent line managers from influencing project priorities or deployment',
        'Allow each project to define and self-certify benefits independently, while the MBB provides a consistent technical message until executive sponsorship improves'
      ],answer:1,
      why:'Technical coaching cannot replace executive responsibilities. Leaders must resolve resource conflicts, align incentives, authorize benefit governance, and communicate constancy of purpose. The MBB supports the system but cannot manufacture executive accountability. <b>B. Require executive ownership of resource conflicts, benefit-governance decisions, and a consistent deployment message while the MBB continues technical coaching</b> <span class="tb-source-ref">Source: Kubiak, Chapter 12, Executive Leadership Roles and Leadership for Deployment, pp. 183-190.</span>',
      optionRationales:['More reviews do not remove structural barriers or conflicting incentives.','Correct. It preserves the distinct but complementary executive and MBB roles.','Centralization may be useful in some contexts but does not automatically create executive ownership.','Inconsistent benefit definitions would further weaken governance.'],
      formula:null,assumptions:['The executive sponsor has authority over the affected line managers and Finance policy.'],estimatedMinutes:2,
      keywords:['executive leadership','sponsorship','resource conflict','benefit governance','constancy of purpose'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 12 - Executive and Team Leadership Roles',sourcePages:'183-190',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 12 - Executive and Team Leadership Roles',section:'Executive Leadership Roles; Leadership for Deployment',pages:'183-190'}]
    },
    {
      qid:'mbb:set-2:original-008',set:2,batch:1,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'C. Organizational Challenges',topic:'Situational intervention, communication, and influence'},
      difficulty:'Very Hard',cognitive:'Apply',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Manufacturing',quantitative:false,
      stem:'A technically respected plant manager rejects a proposed pilot because prior corporate programs overpromised benefits. Operators privately support the change but remain silent in meetings. Which first intervention is most likely to build valid commitment without bypassing the manager?',
      options:[
        'Escalate immediately and ask the division president to direct participation because the pilot requires stronger executive control',
        'Present generic industry benchmarks and the corporate business case in a leadership meeting until the manager concedes',
        'Diagnose the manager\'s concerns privately, review plant-specific evidence, co-design a bounded pilot, and create a safe channel for operator input',
        'Launch the pilot with supportive operators on another shift, exclude the manager during execution, and report after completion'
      ],answer:2,
      why:'The intervention should match the stakeholder and situation. Private diagnosis surfaces the history behind resistance, plant evidence improves credibility, co-design preserves the manager\'s legitimate authority, and protected operator input broadens the evidence. <b>C. Diagnose the manager\'s concerns privately, review plant-specific evidence, co-design a bounded pilot, and create a safe channel for operator input</b> <span class="tb-source-ref">Source: Kubiak, Chapter 11, Situational Leadership and Intervention Styles, pp. 169-176.</span>',
      optionRationales:['Premature escalation may produce compliance while deepening resistance.','Generic benchmarks do not answer the manager\'s plant-specific credibility concern.','Correct. It adapts influence, evidence, and participation to the situation.','Bypassing the manager damages trust and may invalidate implementation learning.'],
      formula:null,assumptions:['No immediate safety or legal requirement mandates the pilot.'],estimatedMinutes:3,
      keywords:['intervention style','situational leadership','resistance','stakeholder engagement','pilot'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 11 - Intervention Styles',sourcePages:'169-176',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 11 - Internal Organizational Challenges',section:'Situational Leadership; Intervention Styles',pages:'169-176'}]
    },
    {
      qid:'mbb:set-2:original-009',set:2,batch:1,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'D. Organizational Change Management',topic:'Organizational culture change techniques and aligned rewards'},
      difficulty:'Hard',cognitive:'Apply',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Finance and insurance',quantitative:false,
      stem:'A bank asks branch teams to improve first-contact resolution, but bonuses are based almost entirely on keeping each call below four minutes. Resolution-improvement pilots increase average call time and are being abandoned despite fewer repeat calls. Which change action is most appropriate?',
      options:[
        'Align performance appraisal and rewards with resolution and total customer effort, then communicate and review the new expectations consistently',
        'Keep the bonus rule, add first-contact-resolution training, and tell teams that improvement work remains a voluntary professional-development activity',
        'Hide average call time from branch managers until the pilots are complete, then restore the existing bonus formula after the new process is standardized',
        'Train employees and supervisors on first-contact resolution, publicize the repeat-call improvement, and retain the current recognition and bonus measures'
      ],answer:0,
      why:'The reward system is reinforcing the behavior that the change is meant to replace. Sustainable culture change requires aligned goals, appraisal, recognition, and repeated leadership communication. Training alone cannot overcome a contradictory incentive. <b>A. Align performance appraisal and rewards with resolution and total customer effort, then communicate and review the new expectations consistently</b> <span class="tb-source-ref">Source: Kubiak, Chapters 7-8, Cultural Change Techniques and Change Management, pp. 108-125.</span>',
      optionRationales:['Correct. It removes the structural contradiction between stated and rewarded behavior.','Voluntary framing leaves the dominant incentive unchanged.','Suppressing data weakens governance and does not correct the measure.','Knowledge is not the binding barrier when the reward system punishes the desired behavior.'],
      formula:null,assumptions:['First-contact resolution and repeat-call demand are measured reliably.'],estimatedMinutes:2,
      keywords:['change management','rewards and recognition','performance appraisal','culture','first-contact resolution'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 7-8 - Cultural Change and Change Management',sourcePages:'108-125',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapters 7-8',section:'Organizational Cultural Change Techniques; Change Management',pages:'108-125'}]
    },
    {
      qid:'mbb:set-2:original-010',set:2,batch:1,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'F. Organizational Performance Metrics',topic:'Balanced Scorecard and leading/lagging measures'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Portfolio, finance, and risk scenario',industry:'Service and transactional operations',quantitative:false,
      stem:'A service division reports that operating margin rose from 14% to 16%, first-contact resolution fell from 82% to 71%, customer renewal fell from 88% to 81%, and employee process-certification coverage remained at 42%. Executives propose another cost-reduction wave because the financial perspective improved. What is the best MBB response?',
      options:[
        'Approve the wave because operating margin is the only measure that directly funds future improvement, and treat the other indicators as local operating concerns',
        'Reject all cost projects until every nonfinancial indicator returns to its historical maximum, even if the causal links among the measures remain untested',
        'Average the four percentage changes into one composite score, give each perspective equal weight, and prioritize whichever project raises that score the most',
        'Treat the financial gain as incomplete evidence and prioritize causes linking capability, resolution, renewal, and margin using balanced leading and lagging measures'
      ],answer:3,
      why:'A Balanced Scorecard prevents a favorable lagging financial result from masking deterioration in customer, process, and learning capacity. The pattern may represent short-term cost extraction that weakens future revenue. The next portfolio decision should test the causal links and balance outcomes. <b>D. Treat the financial gain as incomplete evidence and prioritize causes linking capability, resolution, renewal, and margin using balanced leading and lagging measures</b> <span class="tb-source-ref">Source: Kubiak, Chapter 9, Financial and Business Performance Measures, pp. 126-143.</span>',
      optionRationales:['Margin is important but can improve temporarily while future performance deteriorates.','Absolute restoration of every indicator is not a rational portfolio rule.','A simple average combines unlike measures and hides causal direction and strategic importance.','Correct. It uses the perspectives together and investigates the system behind the tradeoff.'],
      formula:null,assumptions:['The reported measures are valid and comparable across the two periods.'],estimatedMinutes:3,
      keywords:['Balanced Scorecard','leading indicators','lagging indicators','customer loyalty','margin'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 9 - Organizational Finance and Business Performance Metrics',sourcePages:'126-143',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 9 - Organizational Finance and Business Performance Metrics',section:'Financial Measures; Business Performance Measures',pages:'126-143'}]
    },
    {
      qid:'mbb:set-2:original-011',set:2,batch:1,sub:'mbb-portfolio',
      bok:{domain:'III. Project Portfolio Management',subdomain:'A. Project Management Principles and Life Cycle',topic:'Integrated evaluation of scope, schedule, quality, communication, and risk'},
      difficulty:'Hard',cognitive:'Evaluate',questionType:'Portfolio, finance, and risk scenario',industry:'Product development and engineering',quantitative:false,
      stem:'A medical-device improvement project is six weeks behind after its FMEA identified a previously unrecognized use hazard. The sponsor asks the team to omit planned validation testing to preserve the launch date. Which MBB recommendation is most defensible?',
      options:[
        'Omit the testing because the FMEA already documents the risk qualitatively, obtain sponsor acceptance of the remaining exposure, and preserve the original launch baseline',
        'Use formal change control to evaluate risk, scope, schedule, cost, and regulatory impact; then mitigate and rebaseline rather than suppress validation',
        'Keep the original schedule, record the hazard as an open action, and move validation to the first production lot after the commercial launch',
        'Close the project as a failure, transfer the hazard to routine quality management, and restart only after a new charter removes every schedule variance'
      ],answer:1,
      why:'The new hazard changes the integrated project risk. Formal change control makes the tradeoffs visible, preserves required validation, and creates an authorized mitigation and rebaseline decision. Schedule protection cannot override quality, safety, or regulatory evidence. <b>B. Use formal change control to evaluate risk, scope, schedule, cost, and regulatory impact; then mitigate and rebaseline rather than suppress validation</b> <span class="tb-source-ref">Source: Kubiak, Chapter 14, Project Management Principles, pp. 202-211.</span>',
      optionRationales:['FMEA identifies and prioritizes risk; it does not replace verification or validation.','Correct. It evaluates the project as an integrated system and preserves evidence-based governance.','Post-launch validation transfers uncontrolled risk to customers and may breach regulation.','Schedule variance calls for evaluation and corrective action, not automatic closure.'],
      formula:null,assumptions:['Validation is required by the approved development and regulatory plan.'],estimatedMinutes:2,
      keywords:['project change control','FMEA','validation','risk','rebaseline'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 14 - Project Management Principles',sourcePages:'202-211',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 14 - Project Oversight and Management',section:'Project Management Principles',pages:'202-211'}]
    },
    {
      qid:'mbb:set-2:original-012',set:2,batch:1,sub:'mbb-portfolio',
      bok:{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Cross-functional project dependencies and sequencing'},
      difficulty:'Expert',cognitive:'Evaluate',questionType:'Multi-step quantitative',industry:'Finance and insurance',quantitative:true,
      stem:'Five projects share the precedence relationships shown. Durations are working days. A must finish before B and C; both B and C must finish before D; D must finish before E. Assuming unlimited nonshared resources and no lag, what is the earliest portfolio completion time, and what should the MBB correct in the current plan that starts all five projects on day 1?',
      options:[
        '70 days; retain the parallel start because unlimited nonshared resources remove predecessor constraints from every activity in the portfolio',
        '105 days; delay only E because independently resourced B and C can begin before A is complete',
        '110 days; replace the independent schedules with a portfolio dependency plan that enforces A -> B/C -> D -> E',
        '145 days; schedule B and C sequentially because activities sharing predecessor A cannot run in parallel'
      ],answer:2,
      why:'After A (30 days), B and C can run concurrently. D waits for the longer branch, B at 40 days, so the earliest finish is 30 + max(40,35) + 25 + 15 = 110 working days. Unlimited resources allow concurrency but do not remove logical precedence. <b>C. 110 days; replace the independent schedules with a portfolio dependency plan that enforces A -> B/C -> D -> E</b> <span class="tb-source-ref">Source: Kubiak, Chapter 13, Cross-Functional Project Assessment, pp. 196-200.</span>',
      optionRationales:['Seventy days omits downstream D and E and wrongly treats precedence as a resource issue.','B and C cannot start until A creates their required input.','Correct. The network merge at D is controlled by the longer B branch.', 'B and C may run concurrently once A finishes; a common predecessor does not force sequencing.'],
      formula:'Earliest completion = A + max(B, C) + D + E = 30 + 40 + 25 + 15 = 110 working days.',
      assumptions:['Durations are deterministic working days.','Resources are sufficient for B and C to run concurrently.','There are no leads, lags, or calendar differences.'],estimatedMinutes:4,
      keywords:['activity network','dependencies','critical path','portfolio sequencing','concurrency'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 13 - Cross-Functional Project Assessment',sourcePages:'196-200',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 13 - Project Execution',section:'Cross-Functional Project Assessment',pages:'196-200'}],
      chart:{type:'activity-network',nodes:{A:{col:0,row:1,dur:30},B:{col:1,row:0,dur:40},C:{col:1,row:2,dur:35},D:{col:2,row:1,dur:25},E:{col:3,row:1,dur:15}},edges:[['A','B'],['A','C'],['B','D'],['C','D'],['D','E']]},
      visual:visual('mbb:set-2:original-012','activity-network','An activity-on-node network shows A for 30 days splitting to B for 40 days and C for 35 days. B and C merge into D for 25 days, followed by E for 15 days.')
    },
    {
      qid:'mbb:set-2:original-013',set:2,batch:1,sub:'mbb-portfolio',
      bok:{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Project supply/demand management'},
      difficulty:'Very Hard',cognitive:'Create',questionType:'Portfolio, finance, and risk scenario',industry:'Public sector, nonprofit, and regulated operations',quantitative:false,
      stem:'For the next eight weeks, verified Black Belt capacity is nine full-time equivalents. Forecast demand rises from seven to thirteen, including two mandatory regulatory projects that require three FTEs during the peak and three discretionary projects that together require four FTEs. What is the best portfolio response?',
      options:[
        'Protect the mandatory work, smooth or defer lower-priority discretionary starts, verify any substitute skills, and reforecast commitments at the portfolio gate',
        'Start all projects, authorize overtime during the peak, and defer reforecasting because average demand across the full eight-week window may remain below capacity',
        'Divide each Belt equally among all projects, preserve every announced start date, and let individual sponsors negotiate for additional time when milestones slip',
        'Remove the regulatory projects from the discretionary capacity calculation, reserve their three FTEs informally, and publish the remaining demand as fully committed'
      ],answer:0,
      why:'Supply/demand management requires a time-phased view, not an average or an accounting exclusion. Mandatory work must be protected, discretionary starts should be sequenced to the constraint, and any cross-trained capacity must be competence-verified before commitments are revised. <b>A. Protect the mandatory work, smooth or defer lower-priority discretionary starts, verify any substitute skills, and reforecast commitments at the portfolio gate</b> <span class="tb-source-ref">Source: Kubiak, Chapter 14, Supply/Demand Management, pp. 217-218.</span>',
      optionRationales:['Correct. It protects constraints and priority while making the commitment change explicit.','Average capacity can conceal a peak overload; chronic overtime is not a capacity plan.','Excessive multitasking delays all projects and hides the bottleneck.','Mandatory work still consumes real capacity and must remain in the forecast.'],
      formula:null,assumptions:['Nine FTEs is a verified time-phased capacity, not a headcount estimate.'],estimatedMinutes:3,
      keywords:['supply demand management','capacity planning','portfolio gate','multitasking','regulatory priority'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 14 - Supply/Demand Management',sourcePages:'217-218',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 14 - Project Oversight and Management',section:'Supply/Demand Management',pages:'217-218'}]
    },
    {
      qid:'mbb:set-2:original-014',set:2,batch:1,sub:'mbb-portfolio',
      bok:{domain:'III. Project Portfolio Management',subdomain:'C. Project Portfolio Financial Tools',topic:'NPV and hard-versus-soft benefit validation'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Multi-step quantitative',industry:'Manufacturing',quantitative:true,
      stem:'At a 10% annual discount rate, Project X requires $600,000 now and produces $220,000 at each year-end for four years. Project Y requires $400,000 now and produces $155,000 at each year-end for four years. X\'s benefit is released capacity with no approved headcount, spending, or revenue action; Y\'s benefit is contractually avoided overtime. Which conclusion is correct?',
      options:[
        'Y has the higher NPV because its initial investment is lower, and contractually avoided overtime should be classified entirely as a soft-dollar benefit',
        'Both projects have negative NPV at 10%, so nominal payback should replace discounted cash flow',
        'X has the higher NPV, so its released capacity should automatically be booked as hard-dollar savings',
        'Both NPVs are positive and X is slightly higher, but Finance must still validate whether X\'s capacity benefit becomes realizable cash'
      ],answer:3,
      why:'The four-year annuity factor at 10% is 3.169865. NPV(X) = -600,000 + 220,000(3.169865) = about +$97,370. NPV(Y) = -400,000 + 155,000(3.169865) = about +$91,329. X ranks slightly higher by NPV, but an NPV model does not by itself turn released capacity into hard savings; realization needs an approved spending, headcount, throughput, or revenue action. <b>D. Both NPVs are positive and X is slightly higher, but Finance must still validate whether X\'s capacity benefit becomes realizable cash</b> <span class="tb-source-ref">Source: Kubiak, Chapter 9, Project Cash Flow, pp. 141-143; Chapter 16, Costing Concepts, pp. 225-232.</span>',
      optionRationales:['Lower initial cost does not guarantee higher NPV, and avoided overtime is ordinarily a realizable cost reduction.','Both discounted cash-flow results are positive; nominal payback is not a substitute for NPV.','NPV and benefit classification answer different governance questions.','Correct. It combines the verified calculation with disciplined benefit classification.'],
      formula:'NPV = -I0 + sum[CFt/(1+r)^t]; four-year annuity factor at 10% = 3.169865.',
      assumptions:['Cash flows occur at each year-end.','The discount rate is constant at 10%.','There is no terminal value, tax difference, or working-capital recovery beyond the stated flows.'],estimatedMinutes:5,
      keywords:['NPV','discounted cash flow','hard savings','soft savings','benefit realization'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 9 and 16 - Project Cash Flow and Costing Concepts',sourcePages:'141-143; 225-232',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 9',section:'Project Cash Flow',pages:'141-143'},{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 16',section:'Costing Concepts',pages:'225-232'}]
    },
    {
      qid:'mbb:set-2:original-015',set:2,batch:1,sub:'mbb-training',
      bok:{domain:'IV. Training Design and Delivery',subdomain:'A. Training Needs Analysis',topic:'Role-specific performance and skill-gap analysis'},
      difficulty:'Hard',cognitive:'Evaluate',questionType:'Visual evidence interpretation, non-statistical',industry:'Cross-industry enterprise/deployment case',quantitative:false,
      stem:'The training-needs matrix uses a 1-4 proficiency scale. The first release can support only 120 learner-hours. Which decision best follows a role-specific needs analysis rather than a one-size-fits-all curriculum?',
      options:[
        'Give every group the same eight-hour statistics refresher, use one common assessment, and defer role-specific gaps until the next release because this format is easiest to administer',
        'Prioritize Green Belt MSA and Champion selection skills, tailor delivery to each role, and use targeted remediation for the smaller Black Belt gap',
        'Train Process Owners first because control-plan ownership has the highest operational consequence, even though their current proficiency already equals the required level',
        'Train Black Belts only because advanced regression has the highest required proficiency rating, and use their post-course scores as a proxy for every other role'
      ],answer:1,
      why:'The largest high-impact gap by both depth and population is Green Belt MSA: a two-level gap across 60 learners. Champion project selection also has a two-level, high-impact gap. Process Owners show no measured gap, while Black Belts have a smaller one-level gap suitable for targeted remediation. <b>B. Prioritize Green Belt MSA and Champion selection skills, tailor delivery to each role, and use targeted remediation for the smaller Black Belt gap</b> <span class="tb-source-ref">Source: Kubiak, Chapter 17, Training Needs Analysis, pp. 236-244.</span>',
      optionRationales:['A common course ignores role, task, gap size, and business consequence.','Correct. It uses required-versus-current proficiency, population, and impact together.','High consequence does not create a training need when current proficiency meets the requirement.','Required level alone does not measure the size or reach of the actual gap.'],
      formula:null,assumptions:['The proficiency assessments are reliable.','Business impact ratings are comparable across roles.','No mandatory compliance training is omitted from the table.'],estimatedMinutes:3,
      keywords:['training needs analysis','gap analysis','proficiency','target group','prioritization'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 17 - Training Needs Analysis',sourcePages:'236-244',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 17 - Training Needs Analysis',section:'Defining the Extent and Nature of the Job; Training Needs Analysis Tools',pages:'236-244'}],
      chart:{type:'data-table',columns:['Target group / skill','Required proficiency','Observed proficiency','Learners','Business impact'],rows:[
        ['Champions - project selection','4','2','12','High'],
        ['Black Belts - regression diagnostics','4','3','24','Medium'],
        ['Green Belts - measurement systems','3','1','60','High'],
        ['Process Owners - control plans','3','3','18','High']
      ]},
      visual:visual('mbb:set-2:original-015','data-table','A role-by-skill table compares required and observed proficiency, learner population, and business impact. Green Belts have a two-level measurement-system gap across 60 learners; Champions have a two-level selection gap across 12; Black Belts have a one-level regression gap; Process Owners have no control-plan gap.')
    },
    {
      qid:'mbb:set-2:original-016',set:2,batch:1,sub:'mbb-training',
      bok:{domain:'IV. Training Design and Delivery',subdomain:'D. Training Program Effectiveness',topic:'Evaluation plan and isolation of training effects'},
      difficulty:'Very Hard',cognitive:'Create',questionType:'Coaching/training/failing-project diagnosis',industry:'Manufacturing',quantitative:false,
      stem:'After setup-reduction training, participant reaction averaged 4.8/5 and knowledge scores rose from 58% to 88%. On-job standard-work adherence moved from 62% to 64%; an untrained comparison area moved from 61% to 63%; defect rate did not change. Before claiming business impact, what evaluation plan should the MBB create?',
      options:[
        'Use the reaction and knowledge results as sufficient proof of organizational impact, calculate a training ROI from the score increase, and stop collecting transfer evidence',
        'Discard the training because the first post-training defect rate did not improve, return to the prior setup method, and omit further behavior measurement',
        'Track behavior and results over an appropriate period, use a credible comparison or phased design, investigate transfer barriers, and revise the intervention',
        'Retest knowledge monthly, treat a statistically significant correlation with defect rate as causal evidence, and avoid collecting separate measures of workplace transfer'
      ],answer:2,
      why:'Reaction and learning improved, but transfer to behavior is minimal and no result effect is established. Because the comparison area changed similarly, attribution is especially weak. The plan must measure sustained behavior and business results, isolate the training contribution where feasible, and diagnose environmental barriers to transfer. <b>C. Track behavior and results over an appropriate period, use a credible comparison or phased design, investigate transfer barriers, and revise the intervention</b> <span class="tb-source-ref">Source: Kubiak, Chapter 20, Training Effectiveness Evaluation, pp. 285-292.</span>',
      optionRationales:['Reaction and learning are necessary evidence but do not demonstrate transfer or results.','One early null result does not identify whether the problem is content, transfer, timing, or measurement.','Correct. It evaluates acquisition, transfer, outcomes, and attribution under real constraints.','Repeated knowledge tests cannot substitute for behavior and outcome evidence and may induce spurious searching.'],
      formula:null,assumptions:['The comparison area is reasonably similar but not randomized.','The observation window may be too short for a stable defect-rate effect.'],estimatedMinutes:3,
      keywords:['training effectiveness','transfer','comparison group','behavior','business results'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 20 - Training Effectiveness Evaluation',sourcePages:'285-292',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 20 - Training Effectiveness Evaluation',section:'Validation and Evaluation Models; Measurement Issues; Isolating the Effects of Training',pages:'285-292'}]
    },
    {
      qid:'mbb:set-2:original-017',set:2,batch:1,sub:'mbb-coaching',
      bok:{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'A. Executives and Champions',topic:'Constructive feedback to champions and executives'},
      difficulty:'Hard',cognitive:'Evaluate',questionType:'Coaching/training/failing-project diagnosis',industry:'Healthcare',quantitative:false,
      stem:'During tollgates, a champion answers technical questions for the Black Belt and publicly describes weak analyses as embarrassing. The team has stopped raising uncertainty. What is the most effective first coaching action for the MBB?',
      options:[
        'Meet privately with the champion, describe the observed behavior and impact, agree on role-appropriate review questions, rehearse the next tollgate, and follow up',
        'Correct the champion publicly at the next tollgate, demonstrate the preferred review language in front of the team, and use that confrontation to signal psychological safety',
        'Ask the Black Belt to defend the analysis more forcefully, document every technical disagreement, and treat the conflict as practice for building executive presence',
        'Remove the champion immediately, transfer sponsorship to the process owner, and resume tollgates only after the replacement sponsor completes role training'
      ],answer:0,
      why:'Constructive executive feedback should be specific, private, behavior-based, and linked to impact and an actionable alternative. Clarifying the champion\'s review role and rehearsing questions protects accountability without taking technical ownership from the Belt. <b>A. Meet privately with the champion, describe the observed behavior and impact, agree on role-appropriate review questions, rehearse the next tollgate, and follow up</b> <span class="tb-source-ref">Source: Kubiak, Chapter 21, Communications and Feedback, pp. 304-305.</span>',
      optionRationales:['Correct. It combines respectful feedback, role clarity, practice, and follow-through.','Public correction repeats the same humiliating pattern and may entrench defensiveness.','The Belt\'s assertiveness is not the root cause of the champion\'s role violation.','Immediate removal is disproportionate before a direct coaching attempt unless safety or ethics require it.'],
      formula:null,assumptions:['The behavior is serious but has not crossed a legal, safety, or ethics threshold requiring immediate escalation.'],estimatedMinutes:2,
      keywords:['executive coaching','constructive feedback','tollgate','psychological safety','role clarity'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 21 - Communications and Feedback',sourcePages:'304-305',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 21 - Mentoring Champions, Change Agents, and Executives',section:'Communications; Feedback',pages:'304-305'}]
    },
    {
      qid:'mbb:set-2:original-018',set:2,batch:1,sub:'mbb-coaching',
      bok:{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'B. Teams and Individuals',topic:'Diagnosing and intervening in a failing Belt project'},
      difficulty:'Expert',cognitive:'Create',questionType:'Coaching/training/failing-project diagnosis',industry:'Supply chain, logistics, and distribution',quantitative:false,
      stem:'A Black Belt is leading three projects. One has run nine months, spans four end-to-end processes, lacks a validated baseline and active sponsor, and is about to begin a large DOE. What recovery plan should the MBB create?',
      options:[
        'Approve the DOE across all four processes because experimental evidence may attract a sponsor, reveal the missing baseline, and compensate for weak charter definition',
        'Ask the Belt to work evenings, keep the original scope and schedule, and use weekly technical coaching to recover the project without escalating ownership gaps',
        'Transfer DOE execution to a Green Belt, let the Black Belt continue stakeholder work, and retain the original cross-process scope until experiment results are available',
        'Pause experimentation, re-scope and recharter, secure sponsor and process-owner accountability, validate the measurement/baseline, and set a recovery-or-reassignment gate'
      ],answer:3,
      why:'A DOE cannot repair an unbounded charter, absent ownership, or an untrusted baseline. The MBB should sequence the recovery: reduce scope to a defensible Y and process boundary, restore governance, validate measurement and performance evidence, then decide at an explicit gate whether to continue, reassign, or terminate. <b>D. Pause experimentation, re-scope and recharter, secure sponsor and process-owner accountability, validate the measurement/baseline, and set a recovery-or-reassignment gate</b> <span class="tb-source-ref">Source: Kubiak, Chapter 22, Belt Mentoring, Technical Reviews, and Team Facilitation, pp. 306-314.</span>',
      optionRationales:['Experimentation without a validated response or stable scope creates expensive but weak evidence.','Overtime does not correct governance, measurement, or scope failure.','Delegating the experiment adds coordination without resolving prerequisites.','Correct. It diagnoses root conditions and creates an accountable decision gate.'],
      formula:null,assumptions:['There is no immediate safety containment action that must proceed independently.'],estimatedMinutes:3,
      keywords:['failing project','recharter','sponsorship','baseline','project reassignment'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 22 - Mentoring Black Belts and Green Belts',sourcePages:'306-314',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 22 - Mentoring Black Belts and Green Belts',section:'Individuals; Technical Reviews; Team Facilitation and Meeting Management',pages:'306-314'}]
    },
    {
      qid:'mbb:set-2:original-019',set:2,batch:1,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. MSA, Process Capability, and Control',topic:'Propagation of measurement error'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Multi-step quantitative',industry:'Manufacturing',quantitative:true,
      stem:'Pipe wall thickness is calculated as t = (OD - ID)/2. The OD and ID errors are independent and unbiased, with standard uncertainties shown below. Ignoring model-form error, what is the standard uncertainty of the calculated thickness?',
      options:['0.010 mm','0.036 mm','0.050 mm','0.072 mm'],answer:1,
      why:'For independent inputs, u(t)^2 = (partial t/partial OD)^2u(OD)^2 + (partial t/partial ID)^2u(ID)^2. The sensitivity coefficients are +0.5 and -0.5, so u(t) = 0.5 sqrt(0.04^2 + 0.06^2) = 0.0361 mm, reported as 0.036 mm. <b>B. 0.036 mm</b> <span class="tb-source-ref">Source: Kubiak, Chapter 24, Propagation of Errors, pp. 318-321.</span>',
      optionRationales:['This incorrectly subtracts or over-cancels independent uncertainty components.','Correct. Variances, weighted by squared sensitivity coefficients, add for independent inputs.','This averages the two input standard uncertainties rather than propagating them.','This is sqrt(0.04^2 + 0.06^2) and omits the division-by-two sensitivity.'],
      formula:'u(t) = sqrt[(0.5uOD)^2 + (-0.5uID)^2] = 0.5 sqrt(0.04^2 + 0.06^2) = 0.0361 mm.',
      assumptions:['OD and ID errors are independent.','Input errors are unbiased.','The linear propagation approximation is adequate.'],estimatedMinutes:4,
      keywords:['propagation of error','measurement uncertainty','sensitivity coefficient','independence','wall thickness'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 24 - Propagation of Errors',sourcePages:'318-321',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 24 - Measurement Systems Analysis',section:'Propagation of Errors',pages:'318-321'}],
      chart:{type:'data-table',columns:['Input','Measured value','Standard uncertainty','Sensitivity coefficient'],rows:[['Outside diameter (OD)','508.00 mm','0.040 mm','+0.5'],['Inside diameter (ID)','492.00 mm','0.060 mm','-0.5']]},
      visual:visual('mbb:set-2:original-019','data-table','A two-row measurement table lists outside diameter 508.00 millimetres with standard uncertainty 0.040 and sensitivity coefficient plus 0.5, and inside diameter 492.00 millimetres with standard uncertainty 0.060 and sensitivity coefficient minus 0.5.')
    },
    {
      qid:'mbb:set-2:original-020',set:2,batch:1,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Multiple-regression residual diagnostics'},
      difficulty:'Expert',cognitive:'Analyze',questionType:'Statistical-output interpretation',industry:'Healthcare',quantitative:false,
      stem:'A multiple-regression model predicts emergency-department length of stay. VIFs are below 2, the residual normal probability plot is acceptably linear, and the residuals-versus-fits plot is shown. No data-transcription errors are found. What should the MBB recommend next?',
      options:[
        'Investigate missing curvature or an omitted nonlinear term before relying on predictions, while preserving model hierarchy',
        'Remove the observations with the two largest positive residuals, retain the same predictors, and refit the unchanged linear model until the pattern disappears',
        'Accept the model because low VIF and approximately normal residuals establish predictive adequacy',
        'Replace regression with a two-sample t test because residuals are not centered at every fitted value'
      ],answer:0,
      why:'The residuals form a U-shaped pattern: positive at low and high fitted values and negative in the middle. That is evidence of model-form bias, commonly missing curvature or a nonlinear relationship. Low collinearity and marginal normality do not repair a biased mean function, and points should not be deleted merely because they reveal the pattern. <b>A. Investigate missing curvature or an omitted nonlinear term before relying on predictions, while preserving model hierarchy</b> <span class="tb-source-ref">Source: Kubiak, Chapter 25, Multiple Regression and Residual Diagnostics, pp. 370-383 and 400-402.</span>',
      optionRationales:['Correct. The structured residual pattern diagnoses an inadequate functional form.','Deleting valid observations would hide rather than explain model bias.','VIF and normality address only two assumptions; residual structure still invalidates the fitted mean.','A t test cannot replace a multivariable prediction model or diagnose curvature.'],
      formula:null,assumptions:['Observations are independent.','The plotted residuals are standardized consistently.','No transcription or unit error explains the pattern.'],estimatedMinutes:3,
      keywords:['multiple regression','residuals versus fits','curvature','model hierarchy','VIF'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 25 - Multiple Regression Analysis and Testing the Assumptions',sourcePages:'370-383; 400-402',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25 - Measuring and Modeling Relationships Between Variables',section:'Multiple Regression Analysis; Testing the Assumptions',pages:'370-383; 400-402'}],
      chart:{type:'regression-diagnostic',title:'Standardized residuals versus fitted length of stay',xLabel:'Fitted length of stay (minutes)',yLabel:'Standardized residual',xTicks:[80,160,240],yTicks:[-2,0,2],points:[
        {fitted:80,residual:2.1},{fitted:100,residual:1.2},{fitted:120,residual:0.2},{fitted:140,residual:-0.8},{fitted:160,residual:-1.5},{fitted:180,residual:-0.9},{fitted:200,residual:0.1},{fitted:220,residual:1.1},{fitted:240,residual:2.2}
      ],altText:'Residuals versus fitted length of stay form a U shape: residuals are positive near fitted values 80 and 240 minutes, negative around 140 to 180 minutes, and near zero around 120 and 200 minutes.'},
      visual:visual('mbb:set-2:original-020','regression-diagnostic','Residuals versus fitted length of stay form a U shape: residuals are positive near fitted values 80 and 240 minutes, negative around 140 to 180 minutes, and near zero around 120 and 200 minutes.','Hover or select a residual to inspect its fitted value and standardized residual, then compare the low, middle, and high fitted-value regions.')
    },
    {
      qid:'mbb:set-2:original-021',set:2,batch:1,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. MSA, Process Capability, and Control',topic:'Automated process control used with statistical process control'},
      difficulty:'Very Hard',cognitive:'Understand',questionType:'Advanced conceptual/method-selection',industry:'Manufacturing',quantitative:false,
      stem:'A reactor temperature is measured each second. A feedback controller adjusts steam flow to hold the set point despite feed-temperature disturbances. Product-quality CTQs are sampled hourly and must be monitored for sustained process changes. Which control architecture is most appropriate?',
      options:[
        'Use SPC alone to calculate each steam-valve movement from hourly subgroups, and treat every control-limit signal as a direct command to the actuator',
        'Use APC alone for both second-by-second control and long-term CTQ assurance because continuous automatic adjustment proves the process is statistically stable',
        'Use APC for rapid dynamic regulation and SPC on suitable process or residual measures to detect stability and capability changes',
        'Disable feedback during each SPC sampling window, hold steam flow constant, and chart the resulting values so the limits represent only uncontrolled variation'
      ],answer:2,
      why:'APC and SPC serve different purposes. APC manipulates an input quickly to maintain a controlled variable near its set point. SPC evaluates variation patterns and longer-term stability; it may be applied to appropriate process measures or residuals when dynamics are accounted for. <b>C. Use APC for rapid dynamic regulation and SPC on suitable process or residual measures to detect stability and capability changes</b> <span class="tb-source-ref">Source: Kubiak, Chapter 27, Automated Process Control and Statistical Process Control, pp. 451-453.</span>',
      optionRationales:['Hourly SPC cannot perform second-by-second feedback manipulation.','Closed-loop control can mask or compensate for disturbances without proving statistical stability.','Correct. It integrates dynamic regulation with statistical monitoring.','Removing feedback changes the operating process and can create unsafe or unrepresentative data.'],
      formula:null,assumptions:['The feedback loop is properly tuned and safety interlocks remain active.'],estimatedMinutes:2,
      keywords:['APC','SPC','feedback control','set point','process stability'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 27 - Automated Process Control and Statistical Process Control',sourcePages:'451-453',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 27 - Automated Process Control and Statistical Process Control',section:'Terminology; Advantages; Basic Control Systems',pages:'451-453'}]
    },
    {
      qid:'mbb:set-2:original-022',set:2,batch:1,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'C. Design of Experiments',topic:'Recognizing a split-plot design for hard-to-change factors'},
      difficulty:'Hard',cognitive:'Understand',questionType:'DOE/optimization design and diagnosis',industry:'Product development and engineering',quantitative:false,
      stem:'Oven temperature is costly to change, so each temperature setting is held for four consecutive runs. Within each temperature block, coating formulation is randomized. The run matrix below is representative. Which design-and-analysis description is correct?',
      options:[
        'A completely randomized factorial; ignore the restricted randomization, treat all runs as exchangeable, and test every effect against one pooled residual error',
        'A split-plot design; temperature is the whole-plot factor and formulation is the subplot factor, so the analysis needs the corresponding error strata',
        'A randomized complete block design; treat formulation as the blocking variable because it changes within temperature, and estimate temperature from within-block variation',
        'An EVOP design; use the production order as the model, omit separate whole-plot and subplot errors, and avoid deliberate randomization within each temperature setting'
      ],answer:1,
      why:'Restricted randomization created two experimental-unit sizes. Temperature is assigned to whole plots because it changes only between four-run groups; formulation is randomized within those groups as the subplot factor. The analysis must use the appropriate whole-plot and subplot error terms. <b>B. A split-plot design; temperature is the whole-plot factor and formulation is the subplot factor, so the analysis needs the corresponding error strata</b> <span class="tb-source-ref">Source: Kubiak, Chapter 26, Split-Plot Designs, pp. 449-450.</span>',
      optionRationales:['Restricted randomization violates the single-error completely randomized structure.','Correct. The randomization restrictions define whole plots and subplots.','Formulation varies within the temperature groups and is not the blocking factor described.','EVOP is an evolutionary operating strategy, not a label for every production-order experiment.'],
      formula:null,assumptions:['Whole-plot order is randomized where operationally feasible.','Formulation order is randomized independently within each whole plot.'],estimatedMinutes:3,
      keywords:['split-plot','hard-to-change factor','whole plot','subplot','error strata'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 26 - Split-Plot Designs',sourcePages:'449-450',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 26 - Design of Experiments',section:'Split-Plot Designs',pages:'449-450'}],
      chart:{type:'data-table',columns:['Run order','Temperature setting','Formulation'],rows:[['1','Low','B'],['2','Low','D'],['3','Low','A'],['4','Low','C'],['5','High','C'],['6','High','A'],['7','High','D'],['8','High','B']]},
      visual:visual('mbb:set-2:original-022','data-table','An eight-run design matrix holds oven temperature low for runs one through four and high for runs five through eight. Coating formulations A through D are randomized within each four-run temperature group.')
    },
    {
      qid:'mbb:set-2:original-023',set:2,batch:1,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Autocorrelation, ARIMA, and residual monitoring'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Statistical-output interpretation',industry:'Supply chain, logistics, and distribution',quantitative:false,
      stem:'Daily distribution-center backlog is plotted in time order. Lag-1 autocorrelation is 0.78, and the upward movement is operationally plausible rather than a data error. A manager proposes an Individuals chart using limits estimated directly from the raw series. What should the MBB recommend?',
      options:[
        'Use the raw Individuals chart because moving ranges automatically remove serial correlation, then treat any limit violation as a special cause in the original backlog process',
        'Randomly reorder the days before calculating limits, retain those limits for chronological monitoring, and assume the shuffle permanently restores independence',
        'Widen the raw-chart limits until no point signals, preserve the raw serial dependence, and extrapolate the centerline as the operating forecast',
        'Model the time dependence and trend, validate approximately white residuals, and monitor the residual process while forecasting with the time-series model'
      ],answer:3,
      why:'Strong positive autocorrelation and trend violate the independence assumptions behind limits estimated directly from the raw series. Reordering destroys the time structure, and arbitrary widening hides evidence. A defensible approach models the serial structure, checks residual independence, and then monitors the residual process. <b>D. Model the time dependence and trend, validate approximately white residuals, and monitor the residual process while forecasting with the time-series model</b> <span class="tb-source-ref">Source: Kubiak, Chapter 25, Autocorrelation and Forecasting, pp. 353-373; Tang et al., Chapter 25, Control of Autocorrelated Processes, pp. 381-405.</span>',
      optionRationales:['Moving ranges do not automatically remove serial dependence from the observations.','Random reordering conceals the temporal mechanism and invalidates forecasting.','Limit inflation is not a model and suppresses detection without explaining the pattern.','Correct. It separates predictable time structure from innovation noise before monitoring.'],
      formula:null,assumptions:['The sampling interval is constant.','The series definition and measurement process are stable.','The lag-1 estimate is based on enough observations to be credible.'],estimatedMinutes:3,
      keywords:['autocorrelation','ARIMA','residual monitoring','Individuals chart','forecasting'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 25 - Autocorrelation and Forecasting',sourcePages:'353-373',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25 - Measuring and Modeling Relationships Between Variables',section:'Autocorrelation and Forecasting',pages:'353-373'},{id:'S2',document:'Six Sigma: Advanced Tools for Black Belts and Master Black Belts',chapter:'Chapter 25',section:'Integrated Approach for Statistical Control of Autocorrelated Processes',pages:'381-405'}],
      chart:{type:'time-series',title:'Daily distribution-center backlog',xLabel:'Day',yLabel:'Backlog (orders)',decimals:0,labels:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18'],data:[102,105,103,108,111,110,116,119,118,124,128,126,133,137,136,142,145,149],altText:'Daily backlog across 18 days generally rises from 102 to 149 orders. Adjacent days tend to be similar, with only small reversals around days 3, 6, 9, 12, and 15.'},
      visual:visual('mbb:set-2:original-023','time-series','Daily backlog across 18 days generally rises from 102 to 149 orders. Adjacent days tend to be similar, with only small reversals around days 3, 6, 9, 12, and 15.','Toggle between the raw backlog series and model residuals, then inspect whether serial structure remains after modeling.')
    },
    {
      qid:'mbb:set-2:original-024',set:2,batch:1,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Binary logistic-regression interpretation'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Statistical-output interpretation',industry:'Service and transactional operations',quantitative:false,
      stem:'A binary logistic model predicts whether a customer abandons a service request. The table reports adjusted coefficients and odds ratios. At alpha = 0.05, which interpretation is defensible?',
      options:[
        'Holding the other predictors constant, each additional 10 minutes of wait increases abandonment odds by about 52%; the new-agent indicator is not statistically supported',
        'Each additional 10 minutes increases abandonment probability by exactly 52 percentage points for every customer, regardless of baseline probability or other predictors',
        'New agents cause 20% more abandonment because their odds ratio is above 1, and the estimated direction should be treated as conclusive regardless of its p-value',
        'Case complexity is practically unimportant because logistic coefficients cannot be interpreted on a linear-probability scale or compared directly with ordinary slopes'
      ],answer:0,
      why:'For wait time, exp(0.42) = 1.52, so the adjusted odds multiply by about 1.52 for each 10-minute increase. That is an odds change, not a constant probability-point change. The new-agent coefficient has p = 0.39, so this model does not provide evidence of an adjusted effect at alpha = 0.05. <b>A. Holding the other predictors constant, each additional 10 minutes of wait increases abandonment odds by about 52%; the new-agent indicator is not statistically supported</b> <span class="tb-source-ref">Source: Tang et al., Chapter 12, Logistic Regression Approach, pp. 181-193; Kubiak, Chapter 25, Logistic Regression Analysis, pp. 384-392.</span>',
      optionRationales:['Correct. It interprets an adjusted odds ratio and respects the decision threshold.','Odds ratios do not translate to a constant change in probability across baseline risks.','An estimate above one is not sufficient evidence when uncertainty is large.','The complexity odds ratio of 3.00 is directly interpretable and potentially important.'],
      formula:'Odds ratio = exp(beta). For wait time, exp(0.42) = 1.52.',
      assumptions:['The binary outcome is coded consistently.','Observations are independent.','The logit functional form and other diagnostics are adequate.'],estimatedMinutes:3,
      keywords:['logistic regression','odds ratio','p-value','adjusted effect','probability'],
      sourceDocument:'Six Sigma: Advanced Tools for Black Belts and Master Black Belts',sourceSection:'Chapter 12 - Logistic Regression Approach',sourcePages:'181-193',
      sources:[{id:'S2',document:'Six Sigma: Advanced Tools for Black Belts and Master Black Belts',chapter:'Chapter 12 - Analysis of Categorical Data',section:'Logistic Regression Approach',pages:'181-193'},{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25',section:'Logistic Regression Analysis',pages:'384-392'}],
      chart:{type:'data-table',columns:['Predictor','Coefficient','SE','p-value','Adjusted odds ratio'],rows:[['Wait time (per 10 min)','0.42','0.11','<0.001','1.52'],['New agent (yes vs no)','0.18','0.21','0.39','1.20'],['Complex case (yes vs no)','1.10','0.24','<0.001','3.00']]},
      visual:visual('mbb:set-2:original-024','data-table','A logistic-regression table shows wait time coefficient 0.42, p below 0.001, odds ratio 1.52; new-agent coefficient 0.18, p 0.39, odds ratio 1.20; complex-case coefficient 1.10, p below 0.001, odds ratio 3.00.')
    },
    {
      qid:'mbb:set-2:original-025',set:2,batch:1,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Components of variation and nested studies'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Multi-step quantitative',industry:'Manufacturing',quantitative:true,
      stem:'A balanced nested study decomposes observed variance as shown. Management asks whether replacing the test instrument alone could reduce the observed standard deviation by at least 20%, assuming the replacement eliminates repeatability variance completely and leaves other components unchanged. Which conclusion is correct?',
      options:[
        'Yes; repeatability is 2 variance units, so removing it reduces observed standard deviation by 2 units',
        'Yes; repeatability is 9.1% of variance, which exceeds the 4% variance reduction needed for a 20% standard-deviation reduction',
        'No; eliminating repeatability changes standard deviation from sqrt(22) to sqrt(20), only about a 4.7% reduction',
        'No; repeatability, appraiser, part, and lot variance components cannot be added when the study design is nested'
      ],answer:2,
      why:'The total variance is 12 + 8 + 2 = 22, so the observed standard deviation is sqrt(22) = 4.690. Eliminating all repeatability variance leaves sqrt(20) = 4.472. The reduction is (4.690 - 4.472)/4.690 = 4.65%, far below 20%. Variance components add; standard deviations do not. <b>C. No; eliminating repeatability changes standard deviation from sqrt(22) to sqrt(20), only about a 4.7% reduction</b> <span class="tb-source-ref">Source: Kubiak, Chapter 25, Components of Variation, pp. 408-414; Tang et al., Chapter 6, Process Variations and Their Estimates, pp. 73-83.</span>',
      optionRationales:['Variance units cannot be subtracted directly from standard deviation units.','A 20% SD reduction requires variance to fall to 0.8^2 = 64% of its original value, a 36% variance reduction.','Correct. Removing the entire 2-unit component has only a small effect on total standard deviation.','Properly estimated nested variance components are additive under the model.'],
      formula:'sigma_total = sqrt(12 + 8 + 2) = sqrt(22); sigma_without repeatability = sqrt(20); reduction = 1 - sqrt(20/22) = 4.65%.',
      assumptions:['Variance-component estimates are nonnegative and based on an adequate balanced nested study.','Components are independent under the fitted random-effects model.','The replacement instrument eliminates only repeatability variance.'],estimatedMinutes:4,
      keywords:['variance components','nested design','repeatability','standard deviation','measurement system'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 25 - Components of Variation',sourcePages:'408-414',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25 - Measuring and Modeling Relationships Between Variables',section:'Components of Variation',pages:'408-414'},{id:'S2',document:'Six Sigma: Advanced Tools for Black Belts and Master Black Belts',chapter:'Chapter 6 - Process Variations and Their Estimates',section:'Process Variability; Nested Design',pages:'73-83'}],
      chart:{type:'data-table',columns:['Variance source','Estimated variance','Share of total variance'],rows:[['Lot-to-lot','12','54.5%'],['Unit within lot','8','36.4%'],['Test repeatability','2','9.1%'],['Total','22','100.0%']]},
      visual:visual('mbb:set-2:original-025','data-table','A variance-component table shows lot-to-lot variance 12, unit-within-lot variance 8, test-repeatability variance 2, and total variance 22. Their shares are 54.5, 36.4, 9.1, and 100 percent.')
    }
  ];

  var batch4=[
    {
      qid:'mbb:set-2:original-076',set:2,batch:4,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'A. Strategic Plan Development',topic:'Integrated strategic, tactical, and operational planning'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Visual strategy-evidence interpretation',industry:'Automotive manufacturing and aftermarket services',quantitative:false,
      stem:'An automotive group is six months into a three-year warranty strategy. The executive evidence below is the complete current deployment record. Leaders say the strategy is on track because the annual warranty-cost target has not yet been missed. Which recommendation best repairs the planning system?',
      options:[
        'Freeze every target for the full three years so regional leaders cannot dilute accountability when external conditions change',
        'Replace the operational measures with monthly warranty cost because one financial outcome makes regional comparisons consistent',
        'Let each function retain its preferred measures and reconcile differences only if the annual warranty result misses its target',
        'Build linked tactical and operational plans with owners, budget and capacity commitments, leading indicators, and a cross-functional review cadence'
      ],answer:3,
      why:'The evidence shows a lagging corporate result without the tactical and operational line of sight needed to manage it. Service, engineering, and IT are pursuing disconnected measures; resources and dependencies are unresolved; and no leading indicator can prompt correction before the annual result. Traditional linear planning often fails in exactly this way. <b>D. Build linked tactical and operational plans with owners, budget and capacity commitments, leading indicators, and a cross-functional review cadence</b> <span class="tb-source-ref">Source: Kubiak, Chapter 1, Strategic Planning, pp. 13-17.</span>',
      optionRationales:[
        'A rigid plan prevents justified adaptation and does not create the missing tactical and operational links.',
        'A single lagging financial result would remove early evidence about the processes that create warranty cost.',
        'Delayed reconciliation preserves local optimization and makes recovery dependent on an already missed outcome.',
        'Correct. The recommendation connects strategy to executable work, resources, leading evidence, and adaptive governance.'
      ],
      formula:null,assumptions:['The annual warranty-cost result is a lagging indicator.','No omitted tactical plan currently resolves the recorded conflicts.'],estimatedMinutes:3,
      keywords:['strategic planning','tactical planning','operational planning','leading indicators','line of sight'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 1 - Strategic Planning',sourcePages:'13-17',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 1 - Strategic Plan Development',section:'Strategic Planning; Traditional Strategic Planning',pages:'13-17'}],
      chart:{type:'data-table',columns:['Plan layer / owner','Current measure','Timing','Resource or dependency record'],rows:[
        ['Corporate strategy','Warranty cost per installed unit','Annual result','Capital envelope only'],
        ['Service operations','Calls closed per agent-hour','Weekly','No diagnostic-training capacity'],
        ['Product engineering','Design changes released','Quarterly','Shared test lab not scheduled'],
        ['Digital platform','Portal launch date','Single milestone','Service-data interface unresolved']
      ]},
      visual:visual4('mbb:set-2:original-076','data-table','A four-row strategy table shows one annual corporate warranty-cost outcome and three disconnected functional measures. Service lacks training capacity, engineering has not scheduled the shared test lab, and the digital platform has an unresolved service-data interface.','')
    },
    {
      qid:'mbb:set-2:original-077',set:2,batch:4,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'C. Infrastructure Elements of Improvement Systems',topic:'Deployment readiness and organizational maturity assessment'},
      difficulty:'Hard',cognitive:'Evaluate',questionType:'Deployment assessment design',industry:'Multi-site healthcare',quantitative:false,
      stem:'A health network wants a defensible baseline before expanding Six Sigma from two hospitals to fourteen. Executives propose one anonymous question asking employees whether the organization is ready. Which assessment design should the Master Black Belt endorse?',
      options:[
        'Use behaviorally anchored evidence across culture, infrastructure, leadership, people, processes, and technology, sampled by site and level, then triangulate ratings with operating records',
        'Use the single anonymous readiness question across every hospital because a very large response count and high confidence level will compensate for the absence of behaviorally anchored, dimension-specific evidence',
        'Score readiness only from the number of certified Belts and completed projects because objective counts eliminate cultural subjectivity',
        'Interview the deployment sponsor alone because executive commitment is the controlling variable for all other readiness dimensions'
      ],answer:0,
      why:'Readiness is multidimensional and varies across sites and organizational levels. Behaviorally anchored rating scales make maturity judgments observable; stratification exposes local variation; and operating records test whether perceptions match practice. A single sentiment item, credential counts, or one executive view cannot establish organizational and process maturity. <b>A. Use behaviorally anchored evidence across culture, infrastructure, leadership, people, processes, and technology, sampled by site and level, then triangulate ratings with operating records</b> <span class="tb-source-ref">Source: Kubiak, Chapter 3, Assessment, pp. 33-41.</span>',
      optionRationales:[
        'Correct. It creates a repeatable baseline across the readiness dimensions and reduces single-source bias.',
        'Sample size cannot repair a construct that is represented by one vague perception question.',
        'Credential and project counts omit leadership behavior, process maturity, technology, and cultural conditions.',
        'Sponsor commitment matters, but one perspective cannot represent a distributed deployment system.'
      ],
      formula:null,assumptions:['The purpose is a baseline for deployment decisions, not an employee-engagement poll.','Comparable operating records are available at each site.'],estimatedMinutes:3,
      keywords:['readiness assessment','organizational maturity','BARS','stratified sampling','triangulation'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 3 - Assessment',sourcePages:'33-41',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 3 - Deployment of Six Sigma Systems',section:'Assessment; Cultural and Operations Assessment',pages:'33-41'}]
    },
    {
      qid:'mbb:set-2:original-078',set:2,batch:4,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'D. Improvement Methodologies',topic:'Business process management life cycle and automation governance'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Method and governance selection',industry:'Banking and financial services',quantitative:false,
      stem:'A bank plans to automate a commercial-loan handoff. The current process has three undocumented routing variants, no end-to-end owner, unstable approval time, and frequent rework caused by incomplete applications. The technology team wants to configure workflow immediately. What should the Master Black Belt recommend?',
      options:[
        'Automate the most common routing variant first, route every deviation to a manual queue, and use exception logs after launch to discover the remaining requirements and ownership structure',
        'Install the workflow with every current routing variant and incomplete-application loop because faithfully digitizing actual practice is the least disruptive and fastest form of enterprise standardization',
        'Establish ownership, design and model the end-to-end process, remove major failure causes, define execution and monitoring controls, then automate validated work',
        'Delay all process work until approval time becomes statistically stable on its own, because BPM cannot begin with an unstable baseline'
      ],answer:2,
      why:'Business process management is a life cycle of design, modeling, execution, monitoring, and optimization. Automation can strengthen a capable process, but digitizing undefined routes and known rework embeds waste at scale. The bank first needs end-to-end ownership and a validated process model, followed by controls that make automation observable and governable. <b>C. Establish ownership, design and model the end-to-end process, remove major failure causes, define execution and monitoring controls, then automate validated work</b> <span class="tb-source-ref">Source: Kubiak, Chapter 4, Business Process Management, pp. 65-69.</span>',
      optionRationales:[
        'Post-launch logs are useful, but using customers to discover known design requirements creates avoidable failure demand.',
        'Digitizing every variant preserves undocumented complexity instead of designing an intentional end-to-end process.',
        'Correct. It follows the BPM life cycle and prevents automation from institutionalizing an unstable poor process.',
        'BPM is a means to improve instability; spontaneous stability is not an entry requirement.'
      ],
      formula:null,assumptions:['The automation is discretionary rather than required for an immediate regulatory deadline.','Incomplete applications are a confirmed source of rework.'],estimatedMinutes:3,
      keywords:['business process management','automation','process owner','BPM life cycle','process modeling'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 4 - Business Process Management',sourcePages:'65-69',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 4 - Six Sigma Methodologies',section:'Business Systems and Process Management',pages:'65-69'}]
    },
    {
      qid:'mbb:set-2:original-079',set:2,batch:4,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'E. Innovation and Design for Six Sigma',topic:'Creativity-to-innovation operating system'},
      difficulty:'Expert',cognitive:'Create',questionType:'Innovation-system design',industry:'Medical-device development',quantitative:false,
      stem:'A medical-device company runs energetic idea contests, but concepts disappear after voting and teams avoid unconventional proposals because senior engineers criticize them during brainstorming. Which operating system should the Master Black Belt design?',
      options:[
        'Ask senior engineers to rank ideas as they are voiced, then fund only concepts receiving unanimous technical approval in the session',
        'Frame opportunity statements, generate ideas without judgment using diverse participants, evaluate later against explicit criteria, and assign funded experiments with owners and learning gates',
        'Replace facilitated ideation with an anonymous suggestion box and implement the most frequently submitted concept each quarter',
        'Reward the largest number of raw ideas per employee and postpone feasibility, customer value, resources, and ownership until annual planning'
      ],answer:1,
      why:'Creativity produces ideas; innovation requires successful implementation. Separating a judgment-free workout from later evaluation protects divergent thinking, while explicit criteria, resources, ownership, and learning gates convert selected concepts into experiments and implementation. Popularity, unanimity, or idea counts alone do not create innovation. <b>B. Frame opportunity statements, generate ideas without judgment using diverse participants, evaluate later against explicit criteria, and assign funded experiments with owners and learning gates</b> <span class="tb-source-ref">Source: Kubiak, Chapter 5, Innovation and Creativity, pp. 83-87.</span>',
      optionRationales:[
        'Immediate expert judgment suppresses divergent thinking and confuses generation with evaluation.',
        'Correct. It connects opportunity framing and protected creativity to disciplined selection and implementation.',
        'Submission frequency is not evidence of customer value, feasibility, or successful implementation.',
        'Idea-volume rewards create raw material but leave the organization without an innovation pathway.'
      ],
      formula:null,assumptions:['The organization can fund a limited number of controlled experiments.','Patient safety and regulatory review remain mandatory at appropriate gates.'],estimatedMinutes:3,
      keywords:['innovation','creativity','idea generation','idea evaluation','learning gates'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 5 - Innovation and Creativity',sourcePages:'83-87',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 5 - Innovation and Creativity',section:'Innovation; Creativity; Idea Workout and Evaluation',pages:'83-87'}]
    },
    {
      qid:'mbb:set-2:original-080',set:2,batch:4,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'F. Pipeline Management',topic:'Dynamic portfolio risk monitoring and reprioritization'},
      difficulty:'Hard',cognitive:'Apply',questionType:'Portfolio-risk governance scenario',industry:'Energy and utilities',quantitative:false,
      stem:'After four projects were selected, a new cyber requirement doubled one project\'s expected cost, a supplier delay blocked another, and a high-value regulatory project entered the pipeline. Sponsors argue that the original ranking must remain fixed for fairness. What should the Master Black Belt do?',
      options:[
        'Keep the original sequence, preserve every original funding promise, and add the regulatory project without revisiting capacity because selection decisions create permanent sponsor commitments',
        'Cancel the blocked supplier project and transfer its budget to the cyber project without recalculating enterprise value or dependencies',
        'Wait until annual planning because changing priorities within the year makes benefit forecasts and sponsor accountability impossible to maintain',
        'Refresh risk-adjusted value, dependencies, readiness, and resource demand at a governance gate, then reprioritize transparently and record the decision basis'
      ],answer:3,
      why:'Portfolio risk is dynamic. Selection admits qualified work, while prioritization remains a comparative governance decision as value, risk, dependencies, and capacity change. A documented gate preserves fairness through consistent criteria rather than through a frozen ranking that ignores material new evidence. <b>D. Refresh risk-adjusted value, dependencies, readiness, and resource demand at a governance gate, then reprioritize transparently and record the decision basis</b> <span class="tb-source-ref">Source: Kubiak, Chapter 6, Pipeline Management, pp. 88-99.</span>',
      optionRationales:[
        'Adding work without a capacity decision hides overload and treats an old ranking as an entitlement.',
        'A unilateral budget transfer ignores comparative value, dependency effects, and the new regulatory demand.',
        'Annual-only review is too slow for material risk changes and undermines active pipeline management.',
        'Correct. It applies stable criteria to current evidence and creates an auditable reprioritization decision.'
      ],
      formula:null,assumptions:['The governance board has authority to change sequencing.','The cyber and regulatory changes are confirmed rather than speculative.'],estimatedMinutes:2,
      keywords:['pipeline management','dynamic risk','reprioritization','governance gate','resource capacity'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 6 - Pipeline Management',sourcePages:'88-99',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 6 - Risk Analysis of Projects and the Pipeline',section:'Risk Management; Project Selection; Pipeline Management',pages:'88-99'}]
    },
    {
      qid:'mbb:set-2:original-081',set:2,batch:4,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'B. Executive and Team Leadership Roles',topic:'Centralized-to-federated deployment structure'},
      difficulty:'Hard',cognitive:'Create',questionType:'Organizational operating-model design',industry:'Global industrial manufacturing',quantitative:false,
      stem:'A global manufacturer is beginning deployment in four regions with uneven improvement maturity. Corporate leaders need consistent standards and benefit rules, but regional presidents need adaptation for language, unions, customers, and geography. Which initial operating model is most defensible?',
      options:[
        'Start with a strong central deployment office and solid or dotted corporate reporting for standards and assurance, while granting bounded regional adaptation and reviewing decentralization as maturity grows',
        'Give each region full authority over methods, certification criteria, finance rules, technology, project gates, and portfolio decisions from the first day, then compare the four locally designed systems after benefit maturity develops',
        'Run every regional project, personnel assignment, tollgate, method decision, financial validation, and customer adaptation directly from headquarters indefinitely because local adaptation and enterprise consistency cannot coexist',
        'Place deployment in the training department, measure success through certification volume, and let that group negotiate with regional presidents because training is the common regional requirement'
      ],answer:0,
      why:'Early centralization can provide scarce expertise, consistent methods, finance rules, and governance while the regions build capability. Bounded local adaptation recognizes geography, culture, unions, and customers. As maturity develops, authority may move outward while corporate reporting retains assurance against each region doing its own incompatible version. <b>A. Start with a strong central deployment office and solid or dotted corporate reporting for standards and assurance, while granting bounded regional adaptation and reviewing decentralization as maturity grows</b> <span class="tb-source-ref">Source: Kubiak, Chapter 8, Organizational Structure, pp. 115-119.</span>',
      optionRationales:[
        'Correct. It combines early deployment control with explicit adaptation and a maturity-based transition path.',
        'Immediate full autonomy risks incompatible methods, credentials, benefit definitions, and governance.',
        'Permanent headquarters control prevents useful local capability and context-sensitive execution.',
        'Training is one deployment component and lacks the authority needed for enterprise governance.'
      ],
      formula:null,assumptions:['Regional presidents accept defined enterprise controls.','The organization expects regional capability to increase over time.'],estimatedMinutes:3,
      keywords:['organizational design','centralization','federated deployment','reporting structure','regional adaptation'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 8 - Organizational Structure',sourcePages:'115-119',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 8 - Organizational Structure',section:'Centralized and Decentralized Structures; Reporting Relationships',pages:'115-119'}]
    },
    {
      qid:'mbb:set-2:original-082',set:2,batch:4,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'F. Voice of the Customer and Voice of the Process',topic:'Integrated listening posts and closed-loop action'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Customer-process evidence integration',industry:'Omnichannel retail',quantitative:false,
      stem:'Retail surveys praise delivery speed, complaint calls report damaged packages, warehouse data show stable pick accuracy, and social posts increasingly mention crushed cartons. Each function publishes its own dashboard, and no one owns the end-to-end fulfillment process. What should the Master Black Belt establish first?',
      options:[
        'Use the structured survey as the official enterprise voice, weight it by response volume, and treat complaint calls and social comments as unrepresentative anecdotes until both pass a formal random-sampling standard',
        'Create independent listening posts and common definitions, appoint an end-to-end process owner, and use event and time triggers for senior action',
        'Normalize and average all four indicators into one satisfaction index, suppress source-specific variation, and use the composite trend as the only trigger for corrective action across fulfillment',
        'Ask each function to stabilize and improve its own dashboard, retain local ownership for every measure, and appoint an end-to-end process owner only after all four evidence streams move in the same direction'
      ],answer:1,
      why:'The sources provide different and potentially complementary signals. Independent listening posts reduce common-source bias, while common definitions and an end-to-end owner allow the organization to compare patterns, investigate contradiction, and connect customer evidence to process behavior. Event and time triggers close the loop with action and senior review. <b>B. Create independent listening posts and common definitions, appoint an end-to-end process owner, and use event and time triggers for senior action</b> <span class="tb-source-ref">Source: Kubiak, Chapter 10, Feedback, pp. 148-156.</span>',
      optionRationales:[
        'Structured surveys can contain sampling and timing blind spots and should not automatically override other signals.',
        'Correct. It integrates independent evidence through ownership, comparison, triggers, and governance.',
        'Averaging unlike signals can conceal the specific contradiction that requires investigation.',
        'Local stability can coexist with end-to-end failure and should not delay cross-functional ownership.'
      ],
      formula:null,assumptions:['The four evidence streams refer to the same fulfillment population and comparable periods.','No single source has yet been proven invalid.'],estimatedMinutes:3,
      keywords:['voice of customer','voice of process','listening posts','process owner','closed-loop feedback'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 10 - Feedback',sourcePages:'148-156',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 10 - Feedback',section:'Listening Posts; Voice of the Customer and Voice of the Process',pages:'148-156'}]
    },
    {
      qid:'mbb:set-2:original-083',set:2,batch:4,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'G. Organizational Culture and Maturity',topic:'Herzberg hygiene factors and motivators'},
      difficulty:'Hard',cognitive:'Understand',questionType:'Organizational-behavior interpretation',industry:'Public-sector shared services',quantitative:false,
      stem:'A shared-services unit corrected inequitable pay, unsafe working conditions, and confusing policies. Complaints declined, but voluntary improvement participation remains low; employees report little autonomy, recognition, achievement, or advancement. Under Herzberg\'s two-factor theory, what is the best interpretation?',
      options:[
        'The remaining problem is inadequate hygiene, so another broad increase in compensation should be the primary improvement intervention',
        'The reduced complaints prove employees are fully motivated; low participation therefore reflects only poor project selection',
        'Hygiene dissatisfaction was reduced, but motivation still requires enriched work, responsibility, achievement, recognition, and growth opportunities',
        'Pay and working conditions are motivators, while autonomy and achievement are hygiene factors that merely prevent dissatisfaction'
      ],answer:2,
      why:'Herzberg distinguishes hygiene factors, whose inadequacy creates dissatisfaction, from motivators that support satisfaction and engagement. Correcting pay, policy, and conditions can remove dissatisfaction without creating achievement, recognition, responsibility, or growth. Job enrichment and authentic improvement ownership address the missing motivational conditions. <b>C. Hygiene dissatisfaction was reduced, but motivation still requires enriched work, responsibility, achievement, recognition, and growth opportunities</b> <span class="tb-source-ref">Source: Kubiak, Chapter 11, Motivation Theories, pp. 157-165.</span>',
      optionRationales:[
        'Additional compensation may matter, but hygiene improvement alone does not supply the missing intrinsic motivators.',
        'Fewer complaints indicate reduced dissatisfaction rather than proof of positive motivation.',
        'Correct. It applies the distinction between preventing dissatisfaction and creating motivation.',
        'The categories are reversed: pay and conditions are hygiene factors, while achievement and responsibility motivate.'
      ],
      formula:null,assumptions:['Employee reports are credible indicators of the current work environment.'],estimatedMinutes:2,
      keywords:['Herzberg','hygiene factors','motivators','job enrichment','employee engagement'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 11 - Motivation Theories',sourcePages:'157-165',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 11 - Organizational Culture and Maturity',section:'Motivation Theories; Herzberg Two-Factor Theory',pages:'157-165'}]
    },
    {
      qid:'mbb:set-2:original-084',set:2,batch:4,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'H. Leadership Styles',topic:'Situational leadership using competence and commitment'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Interactive leadership-evidence interpretation',industry:'Pharmaceutical laboratory operations',quantitative:false,
      stem:'A laboratory team learned a new deviation-review method. The evidence plot uses a 1-to-10 anchored scale. At Week 8 the team can perform independently, but commitment fell after two approved recommendations were reversed without explanation. Which leadership response best fits the evidence?',
      options:[
        'Increase directive behavior, prescribe every analytical step, require daily compliance checks, and temporarily remove decision authority because falling commitment shows the team has lost technical competence',
        'Delegate all decisions and withdraw from the team because the competence series has reached the independent-performance threshold',
        'Return to basic technical training, restore novice-level supervision, and delay discussion of the reversals until commitment rises above the threshold',
        'Reduce task direction, use high supportive behavior to surface and resolve the commitment barrier, and agree on decision rights and review checkpoints'
      ],answer:3,
      why:'Situational leadership considers both competence and commitment. The team now demonstrates high competence, so renewed step-by-step direction would be mismatched. Commitment is low for a known organizational reason, making supportive behavior, listening, clarified decision rights, and shared checkpoints more appropriate than abandonment or retraining. <b>D. Reduce task direction, use high supportive behavior to surface and resolve the commitment barrier, and agree on decision rights and review checkpoints</b> <span class="tb-source-ref">Source: Kubiak, Chapter 11, Leadership Theories and Styles, pp. 165-176.</span>',
      optionRationales:[
        'The performance evidence shows competence increased; more direction would misdiagnose the commitment problem.',
        'Competence alone does not justify withdrawal when commitment has fallen and organizational barriers remain.',
        'Technical retraining does not address unexplained decision reversals and may further reduce commitment.',
        'Correct. High support and lower direction fit capable people whose commitment needs restoration.'
      ],
      formula:null,assumptions:['Scores are based on anchored behavioral evidence rather than uncalibrated opinion.','A score of 8 is the approved independent-performance threshold.'],estimatedMinutes:3,
      keywords:['situational leadership','competence','commitment','supportive behavior','decision rights'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 11 - Leadership Theories and Styles',sourcePages:'165-176',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 11 - Organizational Culture and Maturity',section:'Situational Leadership; Interventions',pages:'165-176'}],
      chart:{type:'multi-time-series',title:'Team readiness evidence',xLabel:'Week',yLabel:'Behaviorally anchored score (1-10)',labels:['1','2','3','4','5','6','7','8'],yDomain:[0,10],referenceValue:8,referenceLabel:'Independent-performance threshold',series:[
        {label:'Demonstrated competence',data:[2.0,3.0,4.5,5.5,6.5,7.5,8.5,9.0]},
        {label:'Observed commitment',data:[8.5,8.0,7.8,7.5,7.0,6.0,4.5,3.5]}
      ]},
      visual:visual4('mbb:set-2:original-084','multi-time-series','A two-series time plot covers Weeks 1 through 8 on a 1-to-10 behaviorally anchored scale. Demonstrated competence rises from 2.0 to 9.0 and crosses the independent-performance threshold of 8. Observed commitment falls from 8.5 to 3.5, with the steepest decline after Week 5.','Focus or hover over each plotted observation to compare the team’s competence and commitment trajectories before selecting a leadership response.')
    },
    {
      qid:'mbb:set-2:original-085',set:2,batch:4,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'I. Interpersonal Relations',topic:'Interest-based conflict resolution'},
      difficulty:'Very Hard',cognitive:'Apply',questionType:'Conflict-resolution scenario',industry:'Aerospace manufacturing',quantitative:false,
      stem:'Engineering demands a two-week test window to reduce technical risk; Operations refuses more than three days because customer deliveries are threatened. Positions have hardened, but both groups value safety, delivery credibility, and avoiding repeat tests. What should the Master Black Belt do next?',
      options:[
        'Separate people from the problem, surface interests and assumptions, generate options without commitment, and evaluate packages using agreed safety and delivery criteria',
        'Split the difference at eight days, divide the remaining delivery risk equally, and treat equal movement from stated positions as the most objective fairness standard available to both functions',
        'Escalate immediately, frame the dispute as a forced two-option decision, and ask the senior sponsor to choose one position before the teams discuss underlying interests or alternative packages',
        'Let Engineering decide because technical risk outranks operational and customer interests unless a quantified financial comparison proves otherwise'
      ],answer:0,
      why:'Interest-based bargaining moves the parties away from fixed positions and toward the needs that a solution must satisfy. Separating people from the problem, making assumptions visible, generating alternatives before judging them, and applying objective criteria can produce packages that protect both safety and delivery. A midpoint or authority decision may ignore feasible integrative options. <b>A. Separate people from the problem, surface interests and assumptions, generate options without commitment, and evaluate packages using agreed safety and delivery criteria</b> <span class="tb-source-ref">Source: Kubiak, Chapter 11, Conflict Resolution, pp. 177-182.</span>',
      optionRationales:[
        'Correct. It follows the interest-based sequence and uses criteria tied to both parties’ legitimate concerns.',
        'A numerical midpoint treats positions as facts and may be unsafe, infeasible, or unnecessarily costly.',
        'Premature escalation bypasses joint problem solving and conceals the interests needed to design options.',
        'Technical risk matters, but automatic priority prevents evaluation of alternatives that may satisfy both interests.'
      ],
      formula:null,assumptions:['Both groups can participate in a facilitated negotiation.','Safety and delivery performance can be expressed as objective decision criteria.'],estimatedMinutes:3,
      keywords:['interest-based bargaining','conflict resolution','objective criteria','positions and interests','facilitation'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 11 - Conflict Resolution',sourcePages:'177-182',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 11 - Organizational Culture and Maturity',section:'Conflict Resolution; Interest-Based Bargaining',pages:'177-182'}]
    },
    {
      qid:'mbb:set-2:original-086',set:2,batch:4,sub:'mbb-portfolio',
      bok:{domain:'III. Project Portfolio Management',subdomain:'A. Project Management Principles and Life Cycle',topic:'Cross-project dependencies and program governance'},
      difficulty:'Expert',cognitive:'Create',questionType:'Visual portfolio-architecture design',industry:'Enterprise software and customer operations',quantitative:false,
      stem:'Four independently chartered projects now share the dependency network below. Sponsors continue to manage scope and benefits separately, while the customer migration date depends on outputs from all four. What governance architecture should the Master Black Belt create?',
      options:[
        'Merge every activity into one charter and one benefit total so separate accountable owners and intermediate gates are no longer required',
        'Leave the charters independent and ask teams to report dependency failures only when their own milestone becomes late',
        'Create program-level governance with a dependency owner, integrated milestones and risks, while retaining bounded project charters, owners, gates, and benefit accountability',
        'Pause the two longest activities and complete the short activities first because duration alone determines portfolio sequencing'
      ],answer:2,
      why:'The network is a coordinated program, not evidence that every project should lose its bounded charter. Program-level governance makes shared dependencies, integrated milestones, and cumulative risks visible, while project-level ownership and benefit accountability remain intact. Waiting for a local milestone to fail manages dependencies too late. <b>C. Create program-level governance with a dependency owner, integrated milestones and risks, while retaining bounded project charters, owners, gates, and benefit accountability</b> <span class="tb-source-ref">Source: Kubiak, Chapter 13, Cross-Functional Project Assessment, pp. 196-201.</span>',
      optionRationales:[
        'A megacharter can obscure ownership and benefit realization even when program coordination is necessary.',
        'Local reporting after failure does not govern the upstream dependencies shown in the network.',
        'Correct. Program coordination integrates dependencies without eliminating bounded project accountability.',
        'Activity duration alone ignores precedence, shared outputs, benefit timing, and resource constraints.'
      ],
      formula:'Program finish requires completion of P, Q, R, and S along the documented precedence links; duration alone is not a sequencing rule.',assumptions:['Every displayed precedence link is mandatory.','Each project still has a distinct accountable owner and benefit case.'],estimatedMinutes:3,
      keywords:['program governance','project dependencies','cross-functional projects','megaproject','integrated milestones'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 13 - Cross-Functional Project Assessment',sourcePages:'196-201',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 13 - Project Management Principles and Life Cycle',section:'Cross-Functional Project Assessment; Multiple and Megaproject Coordination',pages:'196-201'}],
      chart:{type:'activity-network',nodes:{P:{dur:20,col:0,row:0},Q:{dur:30,col:1,row:0},R:{dur:15,col:1,row:1},S:{dur:25,col:2,row:0},M:{dur:0,col:3,row:0}},edges:[['P','Q'],['P','R'],['Q','S'],['R','S'],['S','M']]},
      visual:visual4('mbb:set-2:original-086','activity-network','An activity network shows Project P feeding both Projects Q and R. Q and R must both finish before Project S begins, and S feeds the customer-migration milestone M. Durations are P 20 days, Q 30, R 15, S 25, and milestone M zero days.','')
    },
    {
      qid:'mbb:set-2:original-087',set:2,batch:4,sub:'mbb-portfolio',
      bok:{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Earned-value performance and forecast'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Quantitative earned-value diagnosis',industry:'Construction and capital projects',quantitative:true,
      stem:'A capital-improvement project has BAC = $2.40 million. At the review date, PV = $1.20 million, EV = $0.96 million, and AC = $1.20 million. If current cost performance is expected to continue, which diagnosis and forecast are correct?',
      options:[
        'CPI = 1.25, SPI = 0.80, and EAC = $1.92 million; the project is under budget but behind schedule',
        'CPI = 0.80, SPI = 0.80, and EAC = $3.00 million; the project is over budget and behind schedule',
        'CPI = 0.80, SPI = 1.25, and EAC = $2.88 million; the project is over budget but ahead of schedule',
        'CPI = 1.00, SPI = 0.80, and EAC = $2.40 million; only schedule recovery is required'
      ],answer:1,
      why:'CPI = EV/AC = 0.96/1.20 = 0.80 and SPI = EV/PV = 0.96/1.20 = 0.80. Both indices are below 1, so the project is over budget for the value earned and behind schedule. Under the stated continued-cost-performance assumption, EAC = BAC/CPI = 2.40/0.80 = $3.00 million. <b>B. CPI = 0.80, SPI = 0.80, and EAC = $3.00 million; the project is over budget and behind schedule</b> <span class="tb-source-ref">Source: Kubiak, Chapter 14, Earned Value Analysis, pp. 212-215.</span>',
      optionRationales:[
        'This reverses the CPI ratio and therefore understates the forecast cost.',
        'Correct. Both performance indices equal 0.80 and BAC divided by CPI gives $3.00 million.',
        'SPI uses EV divided by PV, not PV divided by EV, and the stated EAC is unsupported.',
        'Actual cost equals planned value, but cost performance is evaluated against earned value.'
      ],
      formula:'CPI = EV / AC = 0.96 / 1.20 = 0.80; SPI = EV / PV = 0.96 / 1.20 = 0.80; EAC = BAC / CPI = 2.40 / 0.80 = $3.00 million.',assumptions:['Future cost performance continues at the current CPI.','BAC and earned-value inputs use the same approved baseline.'],estimatedMinutes:3,
      keywords:['earned value','CPI','SPI','EAC','project forecast'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 14 - Earned Value Analysis',sourcePages:'212-215',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 14 - Project Management Principles and Life Cycle',section:'Earned Value Analysis',pages:'212-215'}]
    },
    {
      qid:'mbb:set-2:original-088',set:2,batch:4,sub:'mbb-portfolio',
      bok:{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Decision-oriented project status communication'},
      difficulty:'Hard',cognitive:'Evaluate',questionType:'Project recovery communication',industry:'Telecommunications',quantitative:false,
      stem:'A network-upgrade project is six weeks late. The weekly report remains green because the team completed 92% of scheduled tasks, but a permit issue threatens the launch date and no owner or recovery decision is recorded. What should the Master Black Belt require?',
      options:[
        'Keep the report green until a contractual milestone is formally missed, but append a permit-risk narrative so forecasts remain separated from actual status and task completion',
        'Replace the report with a detailed chronological activity and correspondence log so executives can independently infer severity, critical-path impact, accountability, and required decisions',
        'Report the unfinished tasks, permit chronology, cumulative schedule variance, and every possible recovery alternative without identifying a recommended action or sponsor decision',
        'Report accomplishments, permit impact, owner, recovery dates, next-period plan, and the sponsor decision required now'
      ],answer:3,
      why:'A status report supports decisions, not activity counting. High task completion can coexist with a critical path threat. The report should make the issue, effect, ownership, corrective action, near-term plan, and required escalation explicit so the sponsor and team are not surprised and can act before launch failure. <b>D. Report accomplishments, permit impact, owner, recovery dates, next-period plan, and the sponsor decision required now</b> <span class="tb-source-ref">Source: Kubiak, Chapter 14, Project Status Reports and Corrective Action, pp. 215-218.</span>',
      optionRationales:[
        'Waiting for a missed milestone converts a forecastable risk into a preventable failure.',
        'An activity dump shifts synthesis to executives and leaves ownership and decision needs ambiguous.',
        'Accomplishments provide context, but a report limited to unfinished tasks still omits impact and action.',
        'Correct. It turns status evidence into accountable recovery and an explicit governance decision.'
      ],
      formula:null,assumptions:['The permit issue is on the launch critical path.','The sponsor has authority to approve the needed recovery action.'],estimatedMinutes:2,
      keywords:['status report','corrective action','exception reporting','project recovery','sponsor decision'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 14 - Project Status Reports',sourcePages:'215-218',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 14 - Project Management Principles and Life Cycle',section:'Project Status Reports; Corrective Action',pages:'215-218'}]
    },
    {
      qid:'mbb:set-2:original-089',set:2,batch:4,sub:'mbb-portfolio',
      bok:{domain:'III. Project Portfolio Management',subdomain:'C. Financial Tools and Measures',topic:'Hard savings, soft savings, and cost avoidance'},
      difficulty:'Hard',cognitive:'Understand',questionType:'Financial-benefit classification',industry:'Insurance claims operations',quantitative:false,
      stem:'A claims project saves ten analyst minutes on each of 60,000 annual cases. Salaries, headcount, overtime, and vendor spending are unchanged; the released time has not been assigned to additional work, and the budget will not be reduced. How should Finance classify the current benefit?',
      options:[
        'As released capacity or a soft benefit until a measurable workload, spending, or budget consequence is realized; do not book the summed time as hard savings',
        'As hard savings equal to every released minute multiplied by the fully burdened analyst labor rate, entered at project closure because any measured processing-time reduction automatically creates recoverable enterprise cash',
        'As recognized incremental revenue equal to the released hours multiplied by average contribution margin per analyst hour, even though no additional claims have been accepted, processed, or billed',
        'As cost avoidance and hard savings simultaneously so both operational productivity and estimated financial value appear in the portfolio'
      ],answer:0,
      why:'Time slices are not cash merely because they can be multiplied by a labor rate. With no headcount, overtime, vendor, workload, or budget consequence, the organization has released capacity whose value depends on later redeployment or a verified cost decision. Booking the same estimate as two benefit classes would also double count it. <b>A. As released capacity or a soft benefit until a measurable workload, spending, or budget consequence is realized; do not book the summed time as hard savings</b> <span class="tb-source-ref">Source: Kubiak, Chapter 15, Cost Concepts and Activity-Based Costing, pp. 225-234.</span>',
      optionRationales:[
        'Correct. The improvement is operationally useful, but a hard financial effect has not yet occurred.',
        'Multiplying unrecoverable time slices by a labor rate can create false savings without cash impact.',
        'Unused theoretical capacity is not revenue; an accepted and billed workload would need separate evidence.',
        'Dual classification overstates the same benefit and obscures whether any budget consequence exists.'
      ],
      formula:'Released capacity = 10 minutes x 60,000 cases = 600,000 minutes = 10,000 analyst-hours; financial classification still depends on realized use or cost impact.',assumptions:['The volume estimate is valid.','No contractual service-level penalty was reduced.'],estimatedMinutes:2,
      keywords:['hard savings','soft savings','cost avoidance','released capacity','false savings'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 15 - Financial Tools and Measures',sourcePages:'225-234',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 15 - Financial Tools and Measures',section:'Hard and Soft Savings; Cost Avoidance; Activity-Based Costing',pages:'225-234'}]
    },
    {
      qid:'mbb:set-2:original-090',set:2,batch:4,sub:'mbb-training',
      bok:{domain:'IV. Training Design and Delivery',subdomain:'A. Training Plan Elements',topic:'Training-needs analysis and nontraining causes'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Visual training-needs diagnosis',industry:'Food manufacturing',quantitative:false,
      stem:'A plant asks for refresher training after sanitation-release errors increase. The initial evidence is shown below. Before specifying content or delivery, what should the Master Black Belt do?',
      options:[
        'Build the refresher course around the three most common supervisor opinions, deploy it to all shifts immediately, and use course completion as the direct measure that the plant has closed the underlying skill gaps',
        'Complete performance and cause analysis by role and shift, verify required versus actual behavior, and quantify which gaps are knowledge or skill deficiencies rather than system barriers',
        'Train every sanitation employee on the entire procedure because uniform coverage is more defensible than diagnosing different causes',
        'Postpone analysis until the audit score declines materially because the current outcome measure is still within its historical range and no formal training trigger has fired'
      ],answer:1,
      why:'A request for training is not proof of a training need. The evidence contains opinion, a changed job aid, shift concentration, and a system-access barrier. Performance and cause analysis should define required behavior, locate the gap by audience, and determine whether knowledge or skill is deficient before a curriculum is designed. <b>B. Complete performance and cause analysis by role and shift, verify required versus actual behavior, and quantify which gaps are knowledge or skill deficiencies rather than system barriers</b> <span class="tb-source-ref">Source: Kubiak, Chapter 16, Training Needs Analysis, pp. 236-244.</span>',
      optionRationales:[
        'Interviews can generate hypotheses, but opinions alone are not a quantitative diagnosis of training need.',
        'Correct. It distinguishes trainable gaps from job-aid, access, process, and management causes.',
        'Universal retraining spends capacity without establishing who lacks which required competency.',
        'Waiting for a lagging audit result ignores current release errors and available diagnostic evidence.'
      ],
      formula:null,assumptions:['Release-error coding is consistent across shifts.','The job-aid revision and access logs can be independently verified.'],estimatedMinutes:3,
      keywords:['training needs analysis','performance analysis','skill gap','nontraining cause','audience analysis'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 16 - Training Needs Analysis',sourcePages:'236-244',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 16 - Training Needs Analysis',section:'Strategic, Preliminary, Performance, and Quantitative Analysis',pages:'236-244'}],
      chart:{type:'data-table',columns:['Evidence source','Observation','Current limitation'],rows:[
        ['Supervisor interviews','Three supervisors request refresher training','Opinions; no task observation'],
        ['Error records','74% of recent errors occur on night shift','Cause not coded'],
        ['Document control','Job aid changed six weeks ago','No comprehension check'],
        ['System access log','Night-shift access fails on 18% of releases','Not a knowledge measure']
      ]},
      visual:visual4('mbb:set-2:original-090','data-table','A four-row training-needs evidence table shows supervisor requests, concentration of errors on the night shift, a recently changed job aid without a comprehension check, and system-access failures on 18 percent of night-shift releases. Each row also identifies a limitation of the evidence.','')
    },
    {
      qid:'mbb:set-2:original-091',set:2,batch:4,sub:'mbb-training',
      bok:{domain:'IV. Training Design and Delivery',subdomain:'B. Training Program Design',topic:'Modular multilevel curriculum and delivery capacity'},
      difficulty:'Very Hard',cognitive:'Apply',questionType:'Training-program architecture',industry:'Regional banking',quantitative:false,
      stem:'A bank must develop 120 Green Belts in six months, but only six qualified coaches can supervise applied projects. Roles require a common foundation plus different competencies for branch, fraud, and operations work. Which training plan is strongest?',
      options:[
        'Deliver one continuous course to all 120 learners, allow projects to begin after graduation, and treat coaching demand as an operational issue',
        'Create three unrelated curricula so each function can optimize terminology, tollgates, project standards, and evaluation for its own work',
        'Use shared modular foundations, role pathways, mastery gates, staggered cohorts matched to coaching capacity, and planned transfer evaluation',
        'Shorten applied practice until all learners fit the six-month calendar, then restore full project requirements after the first certification cycle'
      ],answer:2,
      why:'A training plan must connect policy, competencies, content, delivery, resources, and evaluation. Modular common content creates enterprise consistency; role pathways preserve relevance; mastery gates protect prerequisites; and staggered cohorts match the binding coaching and project capacity. Compressing applied work or deferring capacity planning would undermine transfer and standards. <b>C. Use shared modular foundations, role pathways, mastery gates, staggered cohorts matched to coaching capacity, and planned transfer evaluation</b> <span class="tb-source-ref">Source: Kubiak, Chapter 17, Training Plan Elements and Curriculum Development, pp. 245-255.</span>',
      optionRationales:[
        'A single large cohort ignores the six-coach constraint and disconnects learning from applied transfer.',
        'Independent curricula fragment enterprise language, standards, tollgates, and credential meaning.',
        'Correct. The architecture integrates shared standards, audience needs, capacity, practice, and evaluation.',
        'Removing applied practice to meet a calendar target weakens competence and changes the certification standard.'
      ],
      formula:null,assumptions:['Six coaches are the binding delivery constraint.','Each certification still requires an applied project.'],estimatedMinutes:3,
      keywords:['training plan','modular curriculum','multilevel competencies','coaching capacity','learning transfer'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 17 - Training Plan Elements and Curriculum Development',sourcePages:'245-255',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 17 - Training Plan Elements and Curriculum Development',section:'Training Plan; Curriculum Development; Delivery Methods',pages:'245-255'}]
    },
    {
      qid:'mbb:set-2:original-092',set:2,batch:4,sub:'mbb-training',
      bok:{domain:'IV. Training Design and Delivery',subdomain:'D. Program Evaluation',topic:'Isolation of training effects using operational outcomes'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Training-effectiveness study design',industry:'Hospital emergency care',quantitative:false,
      stem:'An emergency department introduces triage training while staffing ratios, queue software, and escalation policy also change. Leaders want to attribute any reduction in door-to-provider time to the training. Which evaluation design provides the strongest feasible causal evidence?',
      options:[
        'Compare participant satisfaction immediately after class with the next month\'s department average and attribute any joint improvement to training',
        'Use a posttraining knowledge test only because operational outcomes are contaminated by the simultaneous process changes',
        'Compare the department\'s next quarter with its prior quarter and adjust the conclusion qualitatively for the three concurrent changes',
        'Use matched units or a phased rollout with pre/post operational outcomes, document exposure and fidelity, estimate the difference in changes, and monitor contamination'
      ],answer:3,
      why:'Reaction and knowledge are useful evaluation levels but do not isolate operational effect. A matched comparison or phased rollout measures the trained unit\'s change relative to a comparable untrained change while documenting whether the intervention was actually delivered and whether groups contaminated one another. This is stronger than an uncontrolled before-after inference. <b>D. Use matched units or a phased rollout with pre/post operational outcomes, document exposure and fidelity, estimate the difference in changes, and monitor contamination</b> <span class="tb-source-ref">Source: Kubiak, Chapter 20, Training Program Evaluation, pp. 285-291.</span>',
      optionRationales:[
        'Satisfaction is not behavior or result evidence, and the department average contains every concurrent change.',
        'A knowledge test measures learning but cannot demonstrate transfer to door-to-provider performance.',
        'A simple before-after comparison cannot separate training from staffing, software, policy, or secular effects.',
        'Correct. The comparison estimates incremental change while checking implementation and spillover threats.'
      ],
      formula:'Estimated training effect = (post - pre change in trained unit) - (post - pre change in matched comparison unit).',assumptions:['A comparable unit or defensible phased rollout is operationally feasible.','The outcome definition remains constant across periods and units.'],estimatedMinutes:4,
      keywords:['training evaluation','control group','difference in differences','learning transfer','causal attribution'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 20 - Training Program Evaluation',sourcePages:'285-291',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 20 - Program Evaluation',section:'Validation and Evaluation Models; Control Groups',pages:'285-291'}]
    },
    {
      qid:'mbb:set-2:original-093',set:2,batch:4,sub:'mbb-coaching',
      bok:{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'A. Executives and Champions',topic:'Champion accountability at tollgate reviews'},
      difficulty:'Hard',cognitive:'Understand',questionType:'Role-accountability interpretation',industry:'Chemical manufacturing',quantitative:false,
      stem:'At a Measure tollgate, the Champion asks the Black Belt to explain why the project still supports the business strategy, obtain cross-functional resources, and remove a plant-manager barrier. Which allocation of responsibility should the Master Black Belt reinforce?',
      options:[
        'The Champion owns alignment, resources, and barriers; the Belt and team own project analysis and recommendations',
        'The Belt owns every item because the project leader is solely accountable for alignment, resources, and barriers between charter approval and Control',
        'The Master Black Belt should assume the Champion\'s authority whenever a tollgate identifies a cross-functional barrier',
        'Finance owns strategic alignment, cross-functional resources, and barrier removal because it validates benefit assumptions and savings claims at every project tollgate'
      ],answer:0,
      why:'The Champion sponsors the project, confirms continuing strategic relevance, secures cross-functional resources, and removes organizational barriers. The Black Belt and team provide the process and analytical evidence needed for the go/no-go decision. The MBB coaches and assures technical quality but does not silently replace executive accountability. <b>A. The Champion owns alignment, resources, and barriers; the Belt and team own project analysis and recommendations</b> <span class="tb-source-ref">Source: Kubiak, Chapter 21, Project Reviews and Tollgates, pp. 294-298.</span>',
      optionRationales:[
        'Correct. It preserves executive sponsorship while keeping evidence creation with the project team.',
        'A Belt leads project work but does not possess executive authority for resources and barrier removal.',
        'Coaching and escalation support do not transfer the Champion’s organizational accountability to the MBB.',
        'Finance validates financial claims; it does not own the project’s full strategic and resource mandate.'
      ],
      formula:null,assumptions:['The project remains within its approved governance structure.'],estimatedMinutes:2,
      keywords:['Champion','tollgate','strategic alignment','barrier removal','role accountability'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 21 - Project Reviews and Tollgates',sourcePages:'294-298',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 21 - Executives and Champions',section:'Project Reviews; Tollgates; Roles and Responsibilities',pages:'294-298'}]
    },
    {
      qid:'mbb:set-2:original-094',set:2,batch:4,sub:'mbb-coaching',
      bok:{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'B. Teams and Individuals',topic:'Team-stage backsliding and intervention'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Team-coaching intervention',industry:'Medical claims administration',quantitative:false,
      stem:'A previously high-performing claims team adds two specialists after scope expands. Meetings become positional, old members bypass the new specialists, decisions are reopened, and actions leave without owners. The sponsor wants to replace the new members. What is the best coaching response?',
      options:[
        'Replace the new specialists immediately, restore the former membership, and preserve the original decision process because movement from performing back to storming proves poor person-team fit and insufficient commitment',
        'Recognize stage backsliding, facilitate renewed purpose, roles, norms, decision rules, and conflict handling, then monitor owned actions and performance evidence',
        'Avoid intervention until the team returns to performing, and let original members enforce informal norms because facilitation would prevent ownership',
        'Ask original members to make decisions privately, preserve their informal authority, and communicate final assignments to the specialists after meetings'
      ],answer:1,
      why:'Team stages are not permanently linear. Membership and scope changes can move a performing team back into conflict and norm formation. Timely facilitation should reestablish purpose, roles, communication and decision norms, constructively surface conflict, and restore meeting accountability. Removal is premature without evidence that the structural intervention failed. <b>B. Recognize stage backsliding, facilitate renewed purpose, roles, norms, decision rules, and conflict handling, then monitor owned actions and performance evidence</b> <span class="tb-source-ref">Source: Kubiak, Chapter 22, Team Performance, pp. 310-314.</span>',
      optionRationales:[
        'Backsliding after a membership change is predictable and is not sufficient evidence for immediate removal.',
        'Correct. It addresses the changed team system and establishes observable follow-through before personnel judgment.',
        'Nonintervention allows exclusion, repeated decisions, and unowned actions to harden into team norms.',
        'A private inner group institutionalizes exclusion and prevents the added expertise from contributing.'
      ],
      formula:null,assumptions:['The new specialists possess the required technical competencies.','No safety or ethics violation requires immediate removal.'],estimatedMinutes:3,
      keywords:['team stages','storming','performing','team norms','coaching intervention'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 22 - Team Performance',sourcePages:'310-314',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 22 - Teams and Individuals',section:'Team Stages; Team Performance; Meeting Management',pages:'310-314'}]
    },
    {
      qid:'mbb:set-2:original-095',set:2,batch:4,sub:'mbb-coaching',
      bok:{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'C. Training and Development',topic:'Non-Belt awareness, recruitment, and executive development'},
      difficulty:'Hard',cognitive:'Apply',questionType:'Development-pathway design',industry:'Municipal government',quantitative:false,
      stem:'A city wants broader improvement participation but has few Belt applicants. The mayor proposes awarding Green Belt credentials after a two-hour awareness session and waiving project work for directors. What should the Master Black Belt recommend?',
      options:[
        'Accept the proposal for one year because increasing credential volume is the fastest way to create an improvement culture',
        'Limit all learning to current Belts so non-Belts do not confuse awareness concepts with certification-level competence',
        'Provide role-based awareness and recruitment, focused executive development, and unchanged competency and project requirements for credentials',
        'Require every employee and director to complete the same full Belt curriculum regardless of role, project access, or decision responsibility'
      ],answer:2,
      why:'Non-Belt awareness can build literacy and a recruitment pipeline, while executives may benefit from focused individual development tied to their sponsorship role. Neither purpose justifies relabeling awareness as certification or removing the applied evidence required for Belt competence. Role relevance and credential integrity can be protected together. <b>C. Provide role-based awareness and recruitment, focused executive development, and unchanged competency and project requirements for credentials</b> <span class="tb-source-ref">Source: Kubiak, Chapter 22, Training and Development, pp. 315-316.</span>',
      optionRationales:[
        'Credential inflation can increase counts while reducing trust in competence and project requirements.',
        'Excluding non-Belts forfeits awareness, participation, and recruitment opportunities described in the development pathway.',
        'Correct. It differentiates role-based development while preserving the standard for formal credentials.',
        'Identical depth for every role wastes capacity and ignores distinct awareness, sponsor, and practitioner needs.'
      ],
      formula:null,assumptions:['The city controls its internal credential requirements.','Qualified projects are available for formal Belt candidates.'],estimatedMinutes:2,
      keywords:['non-Belt training','Belt recruitment','executive development','credential integrity','project requirement'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 22 - Training and Development',sourcePages:'315-316',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 22 - Teams and Individuals',section:'Training and Development; Non-Belt Training',pages:'315-316'}]
    },
    {
      qid:'mbb:set-2:original-096',set:2,batch:4,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. Measurement Systems Analysis',topic:'Bias and linearity across the operating range'},
      difficulty:'Expert',cognitive:'Analyze',questionType:'Interactive MSA regression interpretation',industry:'Precision machining',quantitative:true,
      stem:'A calibration study uses certified references across the full operating range. At reference values 20, 40, 60, 80, and 100 mm, estimated biases are 1.8, 1.0, 0.2, -0.6, and -1.4 mm. The mean bias is 0.2 mm. What is the correct conclusion?',
      options:[
        'The system is acceptable because the positive and negative biases cancel to a small grand mean across the certified references, and a near-zero overall bias is sufficient evidence across the operating range',
        'The system has poor repeatability because bias changes sign across the range, so an X-bar and R gage study is the only valid next analysis',
        'The system is stable over time because the five certified reference points form a straight line, so no calibration action is needed',
        'The near-zero mean conceals a linearity problem: bias changes by -0.04 mm per reference millimeter, requiring range-dependent correction or recalibration'
      ],answer:3,
      why:'Bias is accuracy error at a reference value; linearity is change in bias over the measurement range. The endpoint change is -1.4 - 1.8 = -3.2 mm over 80 mm, giving a slope of -0.04 mm bias per reference millimeter. Averaging cancels opposing biases and conceals the range effect. Repeatability and stability require different evidence. <b>D. The near-zero mean conceals a linearity problem: bias changes by -0.04 mm per reference millimeter, requiring range-dependent correction or recalibration</b> <span class="tb-source-ref">Source: Kubiak, Chapter 24, Variables Measurement Systems, pp. 335-346.</span>',
      optionRationales:[
        'Opposing systematic errors can cancel in the mean while remaining unacceptable at operating-range endpoints.',
        'Changing bias concerns accuracy and linearity; it does not by itself estimate short-term repeatability.',
        'A straight bias-reference relation indicates systematic linearity error, while stability requires time-ordered master measurements.',
        'Correct. The slope quantifies range-dependent bias that a single average would hide.'
      ],
      formula:'Linearity slope = (-1.4 - 1.8) / (100 - 20) = -3.2 / 80 = -0.04 mm bias per reference mm; mean bias = 0.2 mm.',assumptions:['Certified reference uncertainty is negligible for this decision.','Each plotted bias estimate is based on adequate repeated measurements.'],estimatedMinutes:4,
      keywords:['measurement system analysis','bias','linearity','calibration','regression slope'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 24 - Variables Measurement Systems',sourcePages:'335-346',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 24 - Measurement Systems Analysis',section:'Variables Measurement Systems; Accuracy; Bias; Linearity',pages:'335-346'}],
      chart:{type:'regression-diagnostic',title:'Bias across certified reference values',xLabel:'Certified reference (mm)',yLabel:'Estimated bias (mm)',xTicks:[20,40,60,80,100],yTicks:[-2,-1,0,1,2],points:[{fitted:20,residual:1.8},{fitted:40,residual:1.0},{fitted:60,residual:0.2},{fitted:80,residual:-0.6},{fitted:100,residual:-1.4}],altText:'A bias-versus-reference plot shows five points on a descending straight line: 1.8 millimeters bias at reference 20, 1.0 at 40, 0.2 at 60, negative 0.6 at 80, and negative 1.4 at 100. A horizontal zero-bias line crosses between the third and fourth points.'},
      visual:visual4('mbb:set-2:original-096','regression-diagnostic','A bias-versus-reference plot shows five points on a descending straight line: 1.8 millimeters bias at reference 20, 1.0 at 40, 0.2 at 60, negative 0.6 at 80, and negative 1.4 at 100. A horizontal zero-bias line crosses between the third and fourth points.','Focus or hover over each plotted reference to inspect its exact bias and determine whether the overall mean represents performance across the range.')
    },
    {
      qid:'mbb:set-2:original-097',set:2,batch:4,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships Between Variables',topic:'Reliability growth and TAAF model assumptions'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Interactive reliability-growth interpretation',industry:'Aerospace product development',quantitative:true,
      stem:'An engineering team plots cumulative MTBF during test-analyze-and-fix development. After a failure at 800 hours, testing continued to 1,200 hours before the associated design correction was installed. The fitted points appear approximately linear on log-log axes. What should the Master Black Belt conclude?',
      options:[
        'Do not claim valid growth yet; document the violated immediate-fix assumption, segment the affected exposure, and resume only after approved fixes are installed',
        'Accept the model because approximate log-log linearity and a rising cumulative MTBF are sufficient assumptions for either reliability-growth method, regardless of when approved design corrections enter the tested configuration',
        'Delete the failure at 800 hours and the associated exposure from the formal data record because a later design correction makes that event irrelevant to cumulative test time and current configuration performance',
        'Convert all cumulative MTBF points to a Weibull survival curve and discard the configuration timeline because reliability growth cannot use total test time and failure counts'
      ],answer:0,
      why:'Duane and AMSAA reliability-growth models use cumulative test time and failures and assume design changes are incorporated immediately after a failure and before testing resumes. Approximate log-log linearity does not repair the 400 hours accumulated under a known uncorrected design. The exposure must remain traceable and be segmented or otherwise analyzed consistently with the actual configuration history. <b>A. Do not claim valid growth yet; document the violated immediate-fix assumption, segment the affected exposure, and resume only after approved fixes are installed</b> <span class="tb-source-ref">Source: Kubiak, Chapter 25, Reliability Growth Models, pp. 427-428.</span>',
      optionRationales:[
        'Correct. It protects the configuration-time history and directly addresses the shared model assumption that was violated.',
        'Both models require more than visual linearity, including prompt incorporation of design changes before resumed testing.',
        'Deleting an observed failure corrupts the cumulative record and overstates reliability performance.',
        'Weibull life modeling answers a different question and does not repair the configuration-history violation.'
      ],
      formula:'Cumulative MTBF = total cumulative unit test time / cumulative failures. Displayed values: 200/10 = 20.0; 400/16 = 25.0; 800/24 = 33.3; 1200/30 = 40.0; 1600/32 = 50.0 hours.',assumptions:['The 800-hour failure required a design change.','The displayed cumulative counts are complete.'],estimatedMinutes:4,
      keywords:['reliability growth','Duane model','AMSAA','TAAF','cumulative MTBF'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 25 - Reliability Growth Models',sourcePages:'427-428',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25 - Measuring and Modeling Relationships Between Variables',section:'Reliability Growth Models; Duane and AMSAA Models',pages:'427-428'}],
      chart:{type:'reliability-growth',title:'Cumulative reliability-growth record',xLabel:'Cumulative unit test time (hours, log scale)',yLabel:'Cumulative MTBF (hours, log scale)',points:[{time:200,failures:10,mtbf:20},{time:400,failures:16,mtbf:25},{time:800,failures:24,mtbf:33.3},{time:1200,failures:30,mtbf:40},{time:1600,failures:32,mtbf:50}],xTicks:[200,400,800,1600],yTicks:[20,25,33.3,40,50],event:{time:800,resumeTime:1200,label:'Fix delayed while testing continued'}},
      visual:visual4('mbb:set-2:original-097','reliability-growth','A log-log reliability-growth plot shows cumulative MTBF increasing from 20 hours at 200 cumulative test hours to 50 hours at 1,600 hours. A shaded interval from 800 through 1,200 test hours identifies continued testing before the design fix associated with the 800-hour failure was installed.','Focus or hover over each reliability-growth point to inspect cumulative time, failures, and MTBF, and compare the fitted trend with the marked configuration-change interval.')
    },
    {
      qid:'mbb:set-2:original-098',set:2,batch:4,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'C. Design of Experiments',topic:'Mixture designs with lower bounds and pseudocomponents'},
      difficulty:'Expert',cognitive:'Apply',questionType:'Visual mixture-design transformation',industry:'Polymer formulation',quantitative:true,
      stem:'A three-component formulation must satisfy A + B + C = 1 with lower bounds A >= 0.30, B >= 0.40, and C >= 0.10. The experiment uses pseudocomponents z_i = (x_i - L_i)/(1 - sum L_i). What pseudocomponents represent the feasible blend A = 0.40, B = 0.45, C = 0.15?',
      options:[
        'zA = 0.40, zB = 0.45, zC = 0.15 because the original proportions already sum to one and lower bounds only define feasibility rather than a transformed coordinate system',
        'zA = 0.50, zB = 0.25, zC = 0.25 because the 0.20 proportion above all lower bounds is rescaled to a unit simplex',
        'zA = 0.10, zB = 0.05, zC = 0.05 because pseudocomponents are the unscaled excess above each lower bound and do not need to sum to one after the bounds are imposed',
        'zA = 2.00, zB = 2.25, zC = 0.75 because each original proportion is divided by the remaining 0.20 before checking the transformed simplex constraint'
      ],answer:1,
      why:'The lower bounds consume 0.30 + 0.40 + 0.10 = 0.80, leaving 0.20 to allocate. Subtracting bounds gives 0.10, 0.05, and 0.05; dividing each by 0.20 produces 0.50, 0.25, and 0.25, which sum to one in the transformed simplex. <b>B. zA = 0.50, zB = 0.25, zC = 0.25 because the 0.20 proportion above all lower bounds is rescaled to a unit simplex</b> <span class="tb-source-ref">Source: Kubiak, Chapter 26, Mixture Experiments, pp. 446-448.</span>',
      optionRationales:[
        'Original proportions locate the actual blend, but they do not remove and rescale the lower-bound region.',
        'Correct. Bound subtraction followed by division by 0.20 maps the feasible region to a unit simplex.',
        'The excesses sum to 0.20 and therefore are not yet normalized pseudocomponents.',
        'Dividing the original proportions ignores the required subtraction of each component’s lower bound.'
      ],
      formula:'1 - sum(L) = 1 - 0.80 = 0.20; z = [(0.40-0.30)/0.20, (0.45-0.40)/0.20, (0.15-0.10)/0.20] = [0.50, 0.25, 0.25].',assumptions:['Only the stated lower bounds constrain the blend.','Component proportions and lower bounds use the same basis.'],estimatedMinutes:4,
      keywords:['mixture experiment','simplex','lower bounds','pseudocomponents','constrained design'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 26 - Mixture Experiments',sourcePages:'446-448',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 26 - Design of Experiments',section:'Mixture Experiments; Lower-Bound Inference Space',pages:'446-448'}],
      chart:{type:'mixture-simplex',title:'Three-component mixture with lower bounds',components:['A','B','C'],lowerBounds:[0.30,0.40,0.10],point:[0.40,0.45,0.15],pointLabel:'Candidate blend'},
      visual:visual4('mbb:set-2:original-098','mixture-simplex','A triangular three-component mixture plot shows the full simplex and a smaller feasible triangle created by lower bounds A at least 0.30, B at least 0.40, and C at least 0.10. The candidate blend A 0.40, B 0.45, C 0.15 appears inside the feasible region.','')
    },
    {
      qid:'mbb:set-2:original-099',set:2,batch:4,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'C. Design of Experiments',topic:'D-optimal design under run and feasibility constraints'},
      difficulty:'Expert',cognitive:'Create',questionType:'Visual constrained-DOE selection',industry:'Semiconductor processing',quantitative:true,
      stem:'A constrained experiment must estimate a specified six-parameter response model and retain at least one lack-of-fit degree of freedom. The candidate designs below use the feasible-run set. Which design should the Master Black Belt select under the D-optimal criterion?',
      options:[
        'Select P because any full-rank design that estimates all six model parameters is equally D-optimal once the candidate set, run budget, and coding are fixed',
        'Select Q because two lack-of-fit degrees of freedom always dominate information about regression coefficients, model rank, determinant, prediction variance, and the stated optimality criterion',
        'Select R because it is full rank, retains lack-of-fit assessment, and has the largest determinant of X-prime-X among eligible designs',
        'Select S because dropping an unestimable coefficient reduces required information while retaining two lack-of-fit degrees of freedom for model checking'
      ],answer:2,
      why:'D-optimal selection is model-dependent and maximizes the determinant of X-prime-X to reduce regression-coefficient variance. Rank deficiency makes S ineligible and forces its determinant to zero; the requirement for at least one lack-of-fit degree of freedom excludes P. Among Q and R, R has the larger determinant, 6,900 versus 4,800. <b>C. Select R because it is full rank, retains lack-of-fit assessment, and has the largest determinant of X-prime-X among eligible designs</b> <span class="tb-source-ref">Source: Kubiak, Chapter 26, D-optimal Designs, pp. 449-450.</span>',
      optionRationales:[
        'P is full rank but violates the explicit requirement to retain lack-of-fit assessment.',
        'Q is eligible, but D-optimality still favors the larger determinant after constraints are satisfied.',
        'Correct. R satisfies rank and lack-of-fit constraints and maximizes determinant among eligible candidates.',
        'A rank-five matrix cannot estimate the specified six-parameter model, and its X-prime-X determinant is zero.'
      ],
      formula:'Eligible set = designs with rank 6 and lack-of-fit df >= 1 = {Q,R}; max det(X-prime-X) = max(4,800, 6,900) = 6,900 for R.',assumptions:['All rows use the same coding and specified six-parameter model.','Determinants were independently computed from the retained candidate matrices.'],estimatedMinutes:4,
      keywords:['D-optimal design','determinant','design matrix','model rank','constrained DOE'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 26 - D-optimal Designs',sourcePages:'449-450',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 26 - Design of Experiments',section:'D-optimal Designs',pages:'449-450'}],
      chart:{type:'data-table',columns:['Candidate design','Runs','Rank of X','Lack-of-fit df','det(X-prime-X)'],rows:[['P','8','6','0','7,200'],['Q','10','6','2','4,800'],['R','10','6','1','6,900'],['S','10','5','2','0']]},
      visual:visual4('mbb:set-2:original-099','data-table','A four-row candidate-design table lists runs, model-matrix rank, lack-of-fit degrees of freedom, and determinant of X-prime-X. P has rank 6, zero lack-of-fit degrees, and determinant 7,200; Q has rank 6, two degrees, and 4,800; R has rank 6, one degree, and 6,900; S has rank 5, two degrees, and determinant zero.','')
    },
    {
      qid:'mbb:set-2:original-100',set:2,batch:4,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'C. Design of Experiments',topic:'Taguchi inner and outer arrays for robust parameter design'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Visual robust-design interpretation',industry:'Metal cutting and machining',quantitative:true,
      stem:'A nominal-is-best machining response has target 54.0. Each inner-array setting is tested across four outer-array combinations of steel hardness and ambient temperature. Using the evidence below, which decision best reflects robust parameter design?',
      options:[
        'Select I1 because its first outer-array result is closest to target and its average is below target, regardless of the remaining deliberately imposed noise combinations and resulting dispersion',
        'Select I2 because a setting with responses on both sides of target is automatically robust to noise and provides more adjustment range than a tightly clustered response at the nominal value',
        'Select I4 because its highest average response and widest observed range demonstrate the strongest controllable-factor effect and the greatest opportunity for later process adjustment',
        'Select I3 because its mean is on target and its standard deviation across deliberately varied noise conditions is the smallest'
      ],answer:3,
      why:'The outer array intentionally perturbs uncontrollable conditions so the inner-array setting can be judged on both location and variation. I3 has responses 54, 55, 53, and 54, giving mean 54.0 and sample standard deviation about 0.82, smaller than the other settings. The highest mean or a single near-target observation is not the robust-design objective. <b>D. Select I3 because its mean is on target and its standard deviation across deliberately varied noise conditions is the smallest</b> <span class="tb-source-ref">Source: Kubiak, Chapter 26, Taguchi Inner and Outer Arrays, pp. 443-446.</span>',
      optionRationales:[
        'One noise condition does not characterize robustness across the intended outer-array extremes.',
        'Straddling the target can still produce large variability, as the I2 results demonstrate.',
        'A high mean is undesirable for a nominal-is-best target and does not establish noise insensitivity.',
        'Correct. I3 jointly meets the target and minimizes dispersion across the imposed noise conditions.'
      ],
      formula:'I3 mean = (54+55+53+54)/4 = 54.0; sample s = sqrt([0^2+1^2+(-1)^2+0^2]/3) = 0.82.',assumptions:['All outer-array combinations are equally relevant.','The displayed response uses the approved nominal-is-best quality characteristic.'],estimatedMinutes:4,
      keywords:['Taguchi methods','inner array','outer array','robust parameter design','noise factors'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 26 - Taguchi Inner and Outer Arrays',sourcePages:'443-446',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 26 - Design of Experiments',section:'Taguchi Methods; Inner and Outer Array Design',pages:'443-446'}],
      chart:{type:'data-table',columns:['Inner setting','Noise 1','Noise 2','Noise 3','Noise 4','Mean','Sample s'],rows:[['I1','50','52','49','51','50.5','1.29'],['I2','49','57','47','55','52.0','4.76'],['I3','54','55','53','54','54.0','0.82'],['I4','56','62','50','60','57.0','5.29']]},
      visual:visual4('mbb:set-2:original-100','data-table','A robust-design table compares four controllable inner settings across four combinations of hardness and temperature noise. I1 has mean 50.5 and sample standard deviation 1.29; I2 has 52.0 and 4.76; I3 has 54.0 and 0.82; I4 has 57.0 and 5.29. The nominal target is 54.0.','')
    }
  ];

  var batch2=[
    {
      qid:'mbb:set-2:original-026',set:2,batch:2,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'E. Opportunities for Improvement',topic:'Stakeholder engagement and action planning'},
      difficulty:'Hard',cognitive:'Apply',questionType:'Visual evidence interpretation, non-statistical',industry:'Public infrastructure and utilities',quantitative:false,
      stem:'A regional water utility is preparing to standardize emergency-repair dispatch. The stakeholder analysis below is complete. Which engagement plan best uses both influence and importance while protecting the deployment from avoidable resistance?',
      options:[
        'Ask the regulator to approve the finished design, invite union stewards to monthly status briefings, and survey residents after rollout',
        'Collaborate early with the regulator, give field crews a protected design voice, actively involve union stewards, and monitor the vendor through implementation',
        'Delegate the design to field crews because they have the highest importance, then obtain regulator and union acceptance at the final tollgate',
        'Concentrate resources on the software vendor because technical implementation is the immediate constraint and communicate broadly to all others'
      ],answer:1,
      why:'Stakeholder strategy must reflect both a stakeholder’s ability to affect the work and the importance of the outcome to that stakeholder. The regulator is high on both dimensions and should be engaged collaboratively; field crews are high-importance primary stakeholders who need a meaningful voice; union stewards have high influence and should be actively involved before opposition hardens. The low-low vendor can be monitored. <b>B. Collaborate early with the regulator, give field crews a protected design voice, actively involve union stewards, and monitor the vendor through implementation</b> <span class="tb-source-ref">Source: Kubiak, Chapter 5, Stakeholder Engagement, pp. 78-82.</span>',
      optionRationales:[
        'Late regulator involvement and passive union briefings ignore high-influence stakeholders during design.',
        'Correct. The actions follow the collaborate, protect-and-defend, actively involve, and monitor logic of the matrix.',
        'Importance gives field crews a voice but does not remove the regulator’s authority or the union’s influence.',
        'A technical constraint does not justify spending most engagement effort on a low-influence, low-importance stakeholder.'
      ],
      formula:null,assumptions:['The influence and importance ratings reflect the proposed dispatch change, not general organizational status.','No stakeholder has an undisclosed legal veto.'],estimatedMinutes:3,
      keywords:['stakeholder analysis','influence','importance','engagement plan','resistance'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 5 - Stakeholder Engagement',sourcePages:'78-82',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 5 - Opportunities for Improvement',section:'Stakeholder Engagement',pages:'78-82'}],
      chart:{type:'data-table',columns:['Stakeholder','Project impact','Influence','Importance','Current attitude'],rows:[['Safety regulator','High','High','High','Cautious'],['Field crews','High','Low','High','Mixed'],['Union stewards','Medium','High','Low','Opposed'],['Software vendor','Low','Low','Low','Supportive']]},
      visual:visual2('mbb:set-2:original-026','data-table','A stakeholder table lists four groups. The safety regulator is high influence and high importance; field crews are low influence and high importance; union stewards are high influence and low importance; and the software vendor is low on both dimensions.','')
    },
    {
      qid:'mbb:set-2:original-027',set:2,batch:2,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'E. Opportunities for Improvement',topic:'Project identification from integrated customer and process evidence'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Digital banking',quantitative:false,
      stem:'Executives want to charter a mobile-app redesign because an annual relationship survey rates the app 4.4 out of 5. During the same period, authenticated-session abandonment rose from 8% to 19%; complaint coding shows that 62% of abandonments occur at identity verification; and call listening reveals repeated confusion at that step. What should the Master Black Belt recommend?',
      options:[
        'Preserve the executive charter because the relationship survey is the broadest listening post and therefore dominates event-level process evidence',
        'Launch a customer-delight design project covering the entire app, using the 4.4 rating as the baseline outcome and complaints as anecdotal context',
        'Delay action until a new representative survey and a second independent operational dataset reproduce the abandonment finding, because behavioral measures are not Voice of the Customer',
        'Qualify a focused verification-flow opportunity by reconciling survey scope with behavioral, complaint, and process data before setting the charter boundary'
      ],answer:3,
      why:'The evidence is not truly contradictory: a broad relationship score can remain high while a specific transaction fails. Project identification should integrate listening posts and Voice of the Process evidence, clarify the affected customer segment and CTQs, and then qualify a tractable opportunity. Jumping to an app-wide redesign would obscure the concentrated failure mechanism. <b>D. Qualify a focused verification-flow opportunity by reconciling survey scope with behavioral, complaint, and process data before setting the charter boundary</b> <span class="tb-source-ref">Source: Kubiak, Chapter 5, Opportunities for Improvement, pp. 70-78; Chapter 10, Data Gathering, pp. 148-156.</span>',
      optionRationales:[
        'A broad survey measures a different experience level and should not override convergent transaction evidence.',
        'An app-wide scope is premature when several sources localize the opportunity to one verification step.',
        'Behavioral and process observations can corroborate customer evidence; waiting discards actionable convergence.',
        'Correct. It reconciles the measurement scopes and qualifies the opportunity before committing resources.'
      ],
      formula:null,assumptions:['The survey and operational data cover comparable customer populations and time periods.','Identity verification is not currently constrained by a mandated design.'],estimatedMinutes:3,
      keywords:['project identification','Voice of the Customer','Voice of the Process','listening posts','project qualification'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 5 and 10 - Opportunities for Improvement and Data Gathering',sourcePages:'70-78, 148-156',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 5 - Opportunities for Improvement',section:'Project Identification and Qualification',pages:'70-78'},{id:'S2',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 10 - Data Gathering',section:'Voice of the Customer and Voice of the Process',pages:'148-156'}]
    },
    {
      qid:'mbb:set-2:original-028',set:2,batch:2,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'I. Organizational Finance and Business Performance Metrics',topic:'Balanced scorecard and linked leading and lagging measures'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Visual evidence interpretation, non-statistical',industry:'Medical-device manufacturing',quantitative:false,
      stem:'The executive team claims its deployment scorecard is balanced and causally useful. Which assessment of the displayed measures is most defensible?',
      options:[
        'The scorecard is incomplete because it overweights lagging outcomes and lacks learning-capability and process-leading measures that could explain future customer and financial results',
        'The scorecard is balanced because revenue, margin, complaints, and recalls span the financial and customer perspectives, which are the only externally material perspectives needed for strategic deployment decisions',
        'The scorecard should replace complaint and recall rates with project counts so every measure can be influenced directly by the Lean Six Sigma deployment office',
        'The scorecard should retain the measures but combine them into one weighted index calibrated to shareholder value, because separate perspectives prevent executives from evaluating enterprise performance consistently over time'
      ],answer:0,
      why:'A balanced scorecard links financial, customer, internal-process, and learning-and-growth perspectives. The displayed measures are largely lagging outcomes; they do not show whether process capability, corrective-action cycle time, workforce skills, or information-system capability are improving. Those leading measures create the line of sight needed to manage future results. <b>A. The scorecard is incomplete because it overweights lagging outcomes and lacks learning-capability and process-leading measures that could explain future customer and financial results</b> <span class="tb-source-ref">Source: Kubiak, Chapter 9, Business Performance Measures, pp. 137-143.</span>',
      optionRationales:[
        'Correct. Two perspectives and mostly lagging results do not provide a balanced or diagnostic management system.',
        'Financial and customer outcomes are important but do not replace internal-process and learning-and-growth perspectives.',
        'Project counts measure activity and can invite gaming; they do not explain capability or customer outcomes.',
        'A composite index can hide tradeoffs and causal relationships that the separate perspectives are intended to expose.'
      ],
      formula:null,assumptions:['The table contains the complete executive scorecard.','All four measures are reported accurately and at a useful cadence.'],estimatedMinutes:3,
      keywords:['balanced scorecard','leading indicator','lagging indicator','KPI','business performance'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 9 - Business Performance Measures',sourcePages:'137-143',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 9 - Organizational Finance and Business Performance Metrics',section:'Balanced Scorecard and Key Performance Indicators',pages:'137-143'}],
      chart:{type:'data-table',columns:['Perspective claimed','Measure','Direction this quarter','Timing characteristic'],rows:[['Financial','Revenue growth','Down 1.8 points','Lagging outcome'],['Financial','Operating margin','Up 0.4 points','Lagging outcome'],['Customer','Complaint rate','Up 13%','Lagging outcome'],['Customer','Recall rate','Unchanged','Lagging outcome']]},
      visual:visual2('mbb:set-2:original-028','data-table','A four-row executive scorecard contains only financial and customer measures. Revenue growth, operating margin, complaint rate, and recall rate are each explicitly identified as lagging outcomes; no internal-process or learning-and-growth measure is present.','')
    },
    {
      qid:'mbb:set-2:original-029',set:2,batch:2,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'I. Organizational Finance and Business Performance Metrics',topic:'Sarbanes-Oxley financial control responsibilities'},
      difficulty:'Hard',cognitive:'Understand',questionType:'Advanced conceptual/method-selection',industry:'Publicly listed technology services',quantitative:false,
      stem:'A benefits dashboard for a publicly listed company lets each project leader edit the realized-savings field after Finance approval. The edit history is retained, but the dashboard immediately republishes the revised enterprise total without renewed review. What control concern should the Master Black Belt recognize?',
      options:[
        'The retained history makes the process adequate because traceability alone establishes management responsibility and authorization for every later change to enterprise totals',
        'The issue is limited to project governance because improvement benefits are operational estimates that remain outside every financial-reporting control boundary',
        'Post-approval edits can bypass authorization and change reported totals, so access, approval, and change controls must be redesigned with Finance',
        'The dashboard should permit edits only during quarter close because timing restrictions eliminate the need for segregated authorization responsibilities'
      ],answer:2,
      why:'An audit trail records what happened but does not prevent or authorize a change. When improvement benefits feed management or external financial reporting, the control design must address access, authorization, review, and accountability. The MBB should partner with Finance rather than declare the estimates outside financial control. <b>C. Post-approval edits can bypass authorization and change reported totals, so access, approval, and change controls must be redesigned with Finance</b> <span class="tb-source-ref">Source: Kubiak, Chapter 9, Sarbanes-Oxley Act, pp. 143-146.</span>',
      optionRationales:[
        'Traceability is detective evidence; it does not provide preventive authorization or independent approval.',
        'Operational estimates can enter financial reporting and therefore cannot be categorically excluded from control scope.',
        'Correct. The design permits an unauthorized value to alter a controlled aggregate after approval.',
        'A close-period restriction does not replace appropriate access, segregation, and approval controls.'
      ],
      formula:null,assumptions:['The enterprise total is used in management financial reporting.','Project leaders are not delegated final financial-approval authority.'],estimatedMinutes:2,
      keywords:['Sarbanes-Oxley','financial controls','authorization','audit trail','benefit validation'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 9 - Sarbanes-Oxley Act',sourcePages:'143-146',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 9 - Organizational Finance and Business Performance Metrics',section:'Sarbanes-Oxley Act',pages:'143-146'}]
    },
    {
      qid:'mbb:set-2:original-030',set:2,batch:2,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'F. Risk Analysis of Projects and the Pipeline',topic:'Risk-based pipeline governance and replenishment'},
      difficulty:'Expert',cognitive:'Create',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Multi-site industrial services',quantitative:false,
      stem:'A deployment office reviews only active projects. New charters are approved whenever a Belt becomes free; postponed projects retain their original scores indefinitely; and business units can reserve Belt capacity before Finance validates benefits. Which redesigned governance rule set would most improve the pipeline as a portfolio system?',
      options:[
        'Let business units retain reserved capacity, but require a quarterly report of active-project cycle time and the number of unassigned ideas',
        'Maintain one visible active-and-inactive pipeline; periodically refresh value, risk, alignment, and capacity data; and use explicit decision rights to start, defer, support, or close work',
        'Give Finance sole authority to rank all ideas by validated hard savings, then assign every available Belt to the highest-ranked proposal regardless of strategic balance, readiness, dependencies, or concentration of risk',
        'Freeze prioritization criteria for the fiscal year, remove postponed work after ninety days, and measure deployment success by keeping every trained Belt utilized'
      ],answer:1,
      why:'A healthy pipeline includes active, inactive, postponed, and proposed work and treats their economics and risks as time-sensitive. Regular reappraisal, capacity visibility, and explicit authority for start/defer/support/cancel decisions prevent stale priorities and local reservations from controlling the portfolio. Hard savings alone also miss strategy and dependencies. <b>B. Maintain one visible active-and-inactive pipeline; periodically refresh value, risk, alignment, and capacity data; and use explicit decision rights to start, defer, support, or close work</b> <span class="tb-source-ref">Source: Kubiak, Chapter 6, Risk Analysis of Projects and the Pipeline, pp. 88-99; Chapter 15, Performance Measurement, pp. 222-224.</span>',
      optionRationales:[
        'Reporting activity does not remove capacity reservations, stale economics, or incomplete portfolio decision rights.',
        'Correct. It creates a governed, refreshable system for both pipeline and active work.',
        'Finance validation is necessary, but a savings-only rank can violate strategy, capacity, and dependency constraints.',
        'Utilization and arbitrary aging rules can encourage excess work in process and discard still-relevant opportunities.'
      ],
      formula:null,assumptions:['No proposal is legally mandatory.','The deployment office can establish enterprise portfolio governance.'],estimatedMinutes:4,
      keywords:['project pipeline','portfolio governance','capacity management','risk refresh','decision rights'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 6 and 15 - Pipeline and Portfolio Performance',sourcePages:'88-99, 222-224',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 6 - Risk Analysis of Projects and the Pipeline',section:'Risk Management; Pipeline Creation and Management',pages:'88-99'},{id:'S2',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 15 - Project Management Infrastructure',section:'Performance Measurement',pages:'222-224'}]
    },
    {
      qid:'mbb:set-2:original-031',set:2,batch:2,sub:'mbb-org',
      bok:{domain:'II. Cross-functional Competencies',subdomain:'B. Internal Organizational Challenges',topic:'Change management and adoption barriers'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Interactive visual evidence interpretation',industry:'Healthcare administration',quantitative:false,
      stem:'After a health system replaced local referral workflows with one standardized process, formal training completion reached 96%. The plotted weekly rate of manual workarounds then rose steadily. Leaders propose disciplinary notices for noncompliance. What should the Master Black Belt recommend first?',
      options:[
        'Treat the trend as adoption evidence, engage affected users and informal leaders to identify uncertainty and workflow barriers, then correct the change plan and monitor the rate',
        'Issue disciplinary notices immediately because training completion establishes that remaining workarounds reflect individual resistance rather than usability, workload, communication, or process conditions',
        'Return permanently to local workflows because the upward trend proves that standardization is incompatible with the organization’s culture',
        'Wait for the workaround rate to stabilize across another quarter before investigating, because change-management action during a developing trend would confound the process baseline and prevent objective diagnosis'
      ],answer:0,
      why:'Training completion measures exposure, not internalization of a changed way of working. The sustained rise in workarounds is an early adoption signal that warrants open inquiry into fear, uncertainty, informal influence, and process barriers. Change agents should communicate, listen, engage informal leaders, remove obstacles, and continue measuring progress before choosing consequences. <b>A. Treat the trend as adoption evidence, engage affected users and informal leaders to identify uncertainty and workflow barriers, then correct the change plan and monitor the rate</b> <span class="tb-source-ref">Source: Kubiak, Chapter 8, Change Management, pp. 123-125.</span>',
      optionRationales:[
        'Correct. It uses the observed behavior to diagnose and manage adoption rather than equating attendance with acceptance.',
        'Completion data do not establish motivation or rule out usability, workload, communication, and local-system barriers.',
        'The trend shows a problem to investigate, not that enterprise standardization is inherently impossible.',
        'Waiting would allow resistance or process failure to become entrenched; the trend is already actionable evidence.'
      ],
      formula:'Weekly workaround rate = manually routed referrals / total referrals × 100.',assumptions:['The denominator and workaround definition remained constant across weeks.','No policy change independently increased manual routing.'],estimatedMinutes:3,
      keywords:['change management','adoption','informal leaders','resistance','leading indicator'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 8 - Change Management',sourcePages:'123-125',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 8 - Organizational Commitment',section:'Change Management',pages:'123-125'}],
      chart:{type:'time-series',title:'Manual referral workarounds after rollout',xLabel:'Week after rollout',yLabel:'Workarounds per 100 referrals',units:'workarounds per 100 referrals',labels:['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'],data:[3,4,5,7,9,12,16,21,26,31,35,39],decimals:0,altText:'A twelve-week time-series rises every week from 3 to 39 manual workarounds per 100 referrals after the standardized referral workflow was introduced.'},
      visual:visual2('mbb:set-2:original-031','time-series','A focusable time-series plot shows manual workarounds per 100 referrals increasing consecutively across twelve weeks: 3, 4, 5, 7, 9, 12, 16, 21, 26, 31, 35, and 39.','Explore each weekly point by hover or keyboard focus to verify the persistence and acceleration of the adoption signal.')
    },
    {
      qid:'mbb:set-2:original-032',set:2,batch:2,sub:'mbb-org',
      bok:{domain:'II. Cross-functional Competencies',subdomain:'B. Internal Organizational Challenges',topic:'Situational use of leadership styles'},
      difficulty:'Very Hard',cognitive:'Apply',questionType:'Advanced conceptual/method-selection',industry:'Aerospace engineering',quantitative:false,
      stem:'A highly competent, motivated engineering team has two weeks to reproduce a validated analysis for a regulatory response. The method and acceptance criteria are fixed, but execution speed has slipped because members are over-deliberating minor formatting choices. Which leadership response is most appropriate?',
      options:[
        'Use a commanding style for the entire assignment and suppress discussion or escalation, because any fixed regulatory deadline converts the work into a continuing emergency that warrants total control',
        'Use a coaching style to rebuild the team’s technical competence through detailed instruction and remedial practice, even though the validated method and criteria have already been mastered',
        'Use a time-bounded pace-setting intervention with clear standards and frequent checks, while preserving escalation for evidence that threatens validity',
        'Use an affiliative style alone and remove performance checkpoints and explicit deadlines, because harmony and autonomy are the principal requirements for every competent and motivated technical team'
      ],answer:2,
      why:'Leadership style should fit competence, commitment, and context. A competent, motivated team doing a known task can respond to a carefully bounded pace-setting intervention that raises execution tempo and clarifies standards. It should not silence validity concerns or become the permanent climate, because pace-setting can have negative effects when overused. <b>C. Use a time-bounded pace-setting intervention with clear standards and frequent checks, while preserving escalation for evidence that threatens validity</b> <span class="tb-source-ref">Source: Kubiak, Chapter 11, Leadership Styles, pp. 168-172.</span>',
      optionRationales:[
        'A short deadline is not automatically a crisis, and sustained commanding behavior can damage the organizational climate.',
        'Coaching develops capability; the stated gap is execution focus rather than technical competence.',
        'Correct. The intervention fits a capable, motivated team and includes safeguards against misuse of pace-setting.',
        'Affiliation may support relationships but does not directly address the missed tempo or need for clear standards.'
      ],
      formula:null,assumptions:['The analysis method is already validated.','The team has authority to escalate substantive evidence concerns.'],estimatedMinutes:3,
      keywords:['situational leadership','pace-setting','leadership style','team competence','organizational climate'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 11 - Leadership Styles',sourcePages:'168-172',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 11 - Internal Organizational Challenges',section:'Leadership Styles and Goleman Leadership Model',pages:'168-172'}]
    },
    {
      qid:'mbb:set-2:original-033',set:2,batch:2,sub:'mbb-org',
      bok:{domain:'II. Cross-functional Competencies',subdomain:'B. Internal Organizational Challenges',topic:'Interdepartmental conflict and interest-based bargaining'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Omnichannel retail',quantitative:false,
      stem:'E-commerce wants same-day order release; Fraud wants every high-value order held for manual review. Both directors defend their positions publicly, but their underlying interests are rapid customer confirmation, bounded fraud loss, and regulatory evidence. Which intervention is most defensible?',
      options:[
        'Escalate both positions to the executive sponsor for a majority vote, then require the losing function to document compliance with the selected position',
        'Average the proposed hold times and pilot that compromise, because splitting the difference is the most neutral way to preserve both relationships',
        'Separate the directors and have each optimize its own metric until enough data exist to determine which department creates more enterprise value',
        'Reframe the conflict around shared interests and objective criteria, generate options such as risk-tiered review, and jointly test effects on speed, loss, and evidence'
      ],answer:3,
      why:'Positions appear mutually exclusive, while the underlying interests are not. Interest-based bargaining separates people from the problem, clarifies interests, creates options for mutual gain, and uses objective criteria. A risk-tiered design can be tested against all three interests instead of forcing a political winner or an unprincipled midpoint. <b>D. Reframe the conflict around shared interests and objective criteria, generate options such as risk-tiered review, and jointly test effects on speed, loss, and evidence</b> <span class="tb-source-ref">Source: Kubiak, Chapter 11, Interdepartmental Conflicts, pp. 177-182.</span>',
      optionRationales:[
        'Authority can end debate without resolving the interests, evidence, or future working relationship.',
        'A midpoint is a positional compromise and may satisfy none of the operational or regulatory criteria.',
        'Local optimization prolongs the conflict and can damage the enterprise outcome both functions serve.',
        'Correct. It converts positions into testable options judged against shared, objective interests.'
      ],
      formula:null,assumptions:['Risk-tier rules are legally permissible if their performance is validated.','Both functions can participate in a controlled pilot.'],estimatedMinutes:3,
      keywords:['interdepartmental conflict','interest-based bargaining','objective criteria','shared interests','local optimization'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 11 - Interdepartmental Conflicts',sourcePages:'177-182',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 11 - Internal Organizational Challenges',section:'Interdepartmental Conflicts',pages:'177-182'}]
    },
    {
      qid:'mbb:set-2:original-034',set:2,batch:2,sub:'mbb-org',
      bok:{domain:'II. Cross-functional Competencies',subdomain:'C. Executive and Team Leadership Roles',topic:'Executive leadership responsibilities in deployment'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Regional transportation',quantitative:false,
      stem:'A chief operating officer attends launch events and praises completed projects, but allows functional managers to withdraw team members without replacement, delegates all barrier removal to the deployment office, and never reviews whether projects remain strategically relevant. Which diagnosis is strongest?',
      options:[
        'The executive role is adequate because visible recognition is the primary leadership control once certified Belts and a deployment office are in place',
        'The executive is communicating support but is not fulfilling governance duties for resources, barriers, strategic alignment, and accountability',
        'Give the deployment office authority over functional managers so executives can focus on communication and recognition',
        'Train more Belts because resource withdrawals show teams lack technical self-sufficiency overall'
      ],answer:1,
      why:'Visible support is useful but not sufficient. Executive leaders must provide and protect resources, remove organizational barriers, maintain strategic alignment, manage change, and hold the deployment system accountable. A deployment office normally cannot substitute for executive authority across functions. <b>B. The executive is communicating support but is not fulfilling governance duties for resources, barriers, strategic alignment, and accountability</b> <span class="tb-source-ref">Source: Kubiak, Chapter 12, Executive Leadership Roles, pp. 183-190.</span>',
      optionRationales:[
        'Recognition supports culture but does not discharge resource, alignment, barrier-removal, and accountability duties.',
        'Correct. The observed behaviors distinguish symbolic support from active executive deployment leadership.',
        'Giving staff authority does not replace the executive’s obligation to govern cross-functional commitments.',
        'Technical training does not correct managerial withdrawal of resources or absence of governance.'
      ],
      formula:null,assumptions:['Resource withdrawals materially threaten approved projects.','The chief operating officer is the accountable executive sponsor.'],estimatedMinutes:2,
      keywords:['executive leadership','deployment governance','resources','barrier removal','accountability'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 12 - Executive Leadership Roles',sourcePages:'183-190',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 12 - Executive and Team Leadership Roles',section:'Executive Leadership Roles',pages:'183-190'}]
    },
    {
      qid:'mbb:set-2:original-035',set:2,batch:2,sub:'mbb-org',
      bok:{domain:'II. Cross-functional Competencies',subdomain:'C. Executive and Team Leadership Roles',topic:'Leadership action plans for deployment roles and capability'},
      difficulty:'Expert',cognitive:'Evaluate',questionType:'Integrated governance scenario',industry:'Global food production',quantitative:false,
      stem:'A global company must choose a deployment operating model. Country A proposes central experts who own every project; Country B proposes part-time Belts selected locally with no common reviews; Country C proposes enterprise standards, regional portfolio councils, named champions and process owners, protected Belt capacity, role-based development, and common benefit validation. Which recommendation is most defensible?',
      options:[
        'Adopt Country C, while defining decision rights and feedback loops that preserve enterprise consistency and allow regional portfolios to respond to local strategy',
        'Adopt Country A because central ownership eliminates the need for local process owners, regional governance, adaptation of projects to operating context, and formal feedback from the regions into enterprise deployment decisions',
        'Adopt Country B because local selection and part-time staffing maximize ownership even when training, review standards, benefit definitions, and strategic prioritization differ substantially across operating regions',
        'Combine central project ownership from A with voluntary review standards from B, because formal champions and protected capacity would slow deployment'
      ],answer:0,
      why:'Country C contains the interacting elements of a deployable leadership system: standards, portfolio governance, explicit roles, resources, development, and comparable benefit controls. Adding clear decision rights and feedback loops avoids both rigid centralization and fragmented local optimization. The other models omit process ownership or common governance. <b>A. Adopt Country C, while defining decision rights and feedback loops that preserve enterprise consistency and allow regional portfolios to respond to local strategy</b> <span class="tb-source-ref">Source: Kubiak, Chapter 12, Leadership for Deployment, pp. 190-195; Chapter 7, Organizational Design, pp. 100-112.</span>',
      optionRationales:[
        'Correct. It joins enterprise controls with regional strategy, ownership, capability, and learning.',
        'Central experts cannot sustainably replace the process owners who control day-to-day operating systems.',
        'Local ownership without common capability and governance makes portfolio and benefit comparisons unreliable.',
        'Voluntary controls and unprotected capacity recreate the principal weaknesses of the rejected models.'
      ],
      formula:null,assumptions:['Regions face meaningfully different strategic priorities.','Enterprise Finance can support a common benefit-validation method.'],estimatedMinutes:4,
      keywords:['deployment action plan','decision rights','portfolio council','role clarity','global deployment'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 7 and 12 - Organizational Design and Leadership for Deployment',sourcePages:'100-112, 190-195',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 12 - Executive and Team Leadership Roles',section:'Leadership for Deployment',pages:'190-195'},{id:'S2',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 7 - Organizational Design',section:'Organizational Systems, Structure, Maturity, and Culture',pages:'100-112'}]
    },
    {
      qid:'mbb:set-2:original-036',set:2,batch:2,sub:'mbb-portfolio',
      bok:{domain:'III. Project Management',subdomain:'A. Project Execution',topic:'Risk-adjusted project prioritization under capacity and dependency constraints'},
      difficulty:'Expert',cognitive:'Evaluate',questionType:'Interactive quantitative portfolio decision',industry:'Property and casualty insurance',quantitative:true,
      stem:'Use the capacity control to set total available capacity to 12 FTE. Project A is mandatory and already committed. Optional projects are indivisible, and every stated dependency must be funded in the same portfolio. Using probability-adjusted NPV as the decision value, which feasible portfolio has the greatest total expected NPV?',
      options:[
        'Fund A and D; this uses only 8 FTE and produces an expected portfolio NPV of $2.20 million while deliberately preserving four FTE for later work',
        'Fund A and B; this uses 9 FTE and produces an expected portfolio NPV of $2.32 million without consuming any capacity for enabling Project C',
        'Fund A, C, and D; this uses 11 FTE and produces an expected portfolio NPV of $2.83 million while leaving one FTE available for support',
        'Fund A, C, and B; this uses all 12 FTE and produces an expected portfolio NPV of $2.95 million while satisfying B’s dependency'
      ],answer:3,
      why:'At 12 FTE, mandatory A consumes 4 and leaves 8. B cannot be funded without C. Probability-adjusted NPVs are A = 0.80×0.95 = 0.76, B = 2.40×0.65 = 1.56, C = 0.70×0.90 = 0.63, and D = 1.80×0.80 = 1.44 million. A+C+B uses 12 FTE and totals $2.95 million, exceeding A+C+D at $2.83 million. <b>D. Fund A, C, and B; this uses all 12 FTE and produces an expected portfolio NPV of $2.95 million while satisfying B’s dependency</b> <span class="tb-source-ref">Source: Kubiak, Chapter 13, Project Prioritization, pp. 196-201; Chapter 16, Budgets and Forecasts, pp. 225-232.</span>',
      optionRationales:[
        'A plus D is feasible, but it leaves value and capacity unused relative to other feasible combinations.',
        'B without enabling project C violates the stated dependency and is therefore not a feasible portfolio.',
        'A plus C plus D is feasible, but its adjusted value of $2.83 million is lower than the best feasible set.',
        'Correct. It satisfies capacity, mandatory-work, and dependency constraints and maximizes adjusted NPV.'
      ],
      formula:'Expected NPV = stated NPV × probability of realization; maximize the sum subject to 12 FTE, mandatory A, and B requiring C.',assumptions:['Project realization events are valued independently for this screening decision.','Partial funding produces no benefit.','FTE requirements are simultaneous peak requirements.'],estimatedMinutes:5,
      keywords:['portfolio optimization','expected NPV','capacity constraint','project dependency','prioritization'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 13 and 16 - Project Prioritization and Budgets and Forecasts',sourcePages:'196-201, 225-232',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 13 - Project Execution',section:'Cross-functional Project Assessment and Project Prioritization',pages:'196-201'},{id:'S2',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 16 - Project Financial Tools',section:'Budgets and Forecasts',pages:'225-232'}],
      chart:{type:'data-table',columns:['Project','NPV if realized ($M)','Realization probability','FTE required','Constraint'],rows:[['A - Regulatory traceability','0.80','0.95','4','Mandatory'],['B - Claims automation','2.40','0.65','5','Requires C'],['C - Data foundation','0.70','0.90','3','None'],['D - Retention workflow','1.80','0.80','4','None']],whatIf:{id:'mbb-q036-capacity',label:'Total available capacity',min:8,max:16,step:1,value:12,unit:'FTE',committed:4,committedLabel:'mandatory Project A'}},
      visual:visual2('mbb:set-2:original-036','data-table','A four-project portfolio table gives NPV, realization probability, FTE requirement, and constraints. Project A is mandatory at 4 FTE, Project B requires C, and the capacity slider ranges from 8 through 16 FTE with a default of 12.','Move the capacity slider to 12 FTE, verify that 8 FTE remain after mandatory Project A, and compare feasible dependency-respecting portfolios.')
    },
    {
      qid:'mbb:set-2:original-037',set:2,batch:2,sub:'mbb-portfolio',
      bok:{domain:'III. Project Management',subdomain:'B. Project Oversight and Management',topic:'Earned-value measurement and corrective action'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Multi-step quantitative',industry:'Pharmaceutical operations',quantitative:true,
      stem:'At a validation-program review, planned value is $600,000, earned value is $480,000, and actual cost is $540,000. The remaining work has not been re-estimated. Which interpretation and next governance action are most defensible?',
      options:[
        'SPI = 1.25 and CPI = 1.13; the program is ahead and under budget, so the remaining baseline should be released as management reserve',
        'SPI = 0.80 and CPI = 0.89; the program is behind and over cost for work performed, so causes and a defensible estimate at completion should be reviewed',
        'Schedule variance is negative $60,000 and cost variance is negative $120,000; cost is therefore the larger issue',
        'Percent complete is 80% because earned value is 80% of planned value; therefore only 20% of the total authorized work remains'
      ],answer:1,
      why:'SPI = EV/PV = 480/600 = 0.80, indicating less work was earned than planned. CPI = EV/AC = 480/540 = 0.889, indicating the work performed cost more than its budgeted value. These indices diagnose current performance but do not by themselves establish the remaining estimate, so management should investigate causes and produce a supportable forecast. <b>B. SPI = 0.80 and CPI = 0.89; the program is behind and over cost for work performed, so causes and a defensible estimate at completion should be reviewed</b> <span class="tb-source-ref">Source: Kubiak, Chapter 14, Project Measurement and Monitoring, pp. 211-216.</span>',
      optionRationales:[
        'The ratios are inverted; EV divided by PV and AC gives values below one.',
        'Correct. It calculates both indices properly and avoids inventing a completion forecast.',
        'Schedule variance is EV minus PV, or negative $120,000; cost variance is EV minus AC, or negative $60,000.',
        'EV divided by current PV is a schedule index, not percent of the total budgeted scope completed.'
      ],
      formula:'SPI = EV/PV = 480/600 = 0.80; CPI = EV/AC = 480/540 = 0.889; SV = EV-PV = -120; CV = EV-AC = -60 ($000).',assumptions:['Earned-value rules and the performance baseline are valid.','No approved scope change is awaiting baseline incorporation.'],estimatedMinutes:4,
      keywords:['earned value','schedule performance index','cost performance index','forecast','project monitoring'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 14 - Measurement and Monitoring',sourcePages:'211-216',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 14 - Project Oversight and Management',section:'Measurement; Monitoring',pages:'211-216'}]
    },
    {
      qid:'mbb:set-2:original-038',set:2,batch:2,sub:'mbb-portfolio',
      bok:{domain:'III. Project Management',subdomain:'B. Project Oversight and Management',topic:'Risk assessment and response planning'},
      difficulty:'Hard',cognitive:'Apply',questionType:'Visual evidence interpretation, non-statistical',industry:'Supply chain technology',quantitative:false,
      stem:'A warehouse-control project identifies a possible interface failure with severe operational impact. The reference matrix classifies that combination as high risk. The vendor can provide a production-like interface test during the next sprint for a modest cost. Which response is most appropriate?',
      options:[
        'Accept the possible risk, record its owner, and reserve interface testing for the final deployment rehearsal',
        'Transfer the risk by adding a warranty clause, because contractual recovery prevents operational disruption if the interface fails',
        'Mitigate early through the production-like interface test, define acceptance and contingency criteria, and monitor the residual risk',
        'Avoid the risk by removing every external interface from scope, even if the resulting warehouse system cannot deliver the chartered outcome'
      ],answer:2,
      why:'The matrix makes a possible/severe event high risk, and a feasible early test can reduce uncertainty or probability before deployment. Mitigation should include explicit acceptance, contingency, ownership, and residual-risk monitoring. A warranty transfers some financial consequence but not the warehouse disruption; scope removal would defeat the business objective. <b>C. Mitigate early through the production-like interface test, define acceptance and contingency criteria, and monitor the residual risk</b> <span class="tb-source-ref">Source: Kubiak, Chapter 6, Risk Management, pp. 88-94; Chapter 14, Project Management Principles, pp. 202-211.</span>',
      optionRationales:[
        'Possible likelihood combined with severe impact is high, and late testing wastes a practical mitigation opportunity.',
        'A warranty may shift cost but does not transfer operational continuity or customer consequences.',
        'Correct. Early testing directly reduces uncertainty and supports planned residual-risk decisions.',
        'Risk avoidance is not defensible when it removes the capability that justifies the project.'
      ],
      formula:null,assumptions:['The matrix is the approved project risk-classification rule.','The production-like test is representative and does not itself create unacceptable risk.'],estimatedMinutes:3,
      keywords:['risk matrix','risk mitigation','contingency','residual risk','interface testing'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 6 and 14 - Risk Management and Project Oversight',sourcePages:'88-94, 202-211',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 6 - Risk Analysis of Projects and the Pipeline',section:'Risk Management',pages:'88-94'},{id:'S2',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 14 - Project Oversight and Management',section:'Project Management Principles',pages:'202-211'}],
      chart:{type:'risk-matrix',rowAxis:'Operational impact',colAxis:'Likelihood',rows:['Severe','Moderate','Low'],cols:['Rare','Possible','Likely'],cells:[['medium','high','high'],['low','medium','high'],['low','low','medium']]},
      visual:visual2('mbb:set-2:original-038','risk-matrix','A three-by-three risk matrix has operational-impact rows Severe, Moderate, and Low and likelihood columns Rare, Possible, and Likely. The Severe and Possible cell is classified High.','')
    },
    {
      qid:'mbb:set-2:original-039',set:2,batch:2,sub:'mbb-portfolio',
      bok:{domain:'III. Project Management',subdomain:'C. Project Management Infrastructure',topic:'Portfolio review, project closure, and resource reallocation'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Integrated governance scenario',industry:'Telecommunications',quantitative:false,
      stem:'A network-optimization project has spent 70% of its budget. A strategy refresh eliminates the target service, the benefits forecast is now negative, and the specialized analysts are blocking two higher-priority regulatory projects. The sponsor argues that stopping would waste the sunk cost. What should the portfolio council do?',
      options:[
        'Close the project through the formal process, document results and lessons, update the portfolio record, and reallocate analysts based on current strategy and value',
        'Continue through at least two more tollgates because passing a budget-consumption threshold creates an obligation to recover the original business case before scarce resources can move to newer regulatory priorities',
        'Suspend the project without formal closure until the target service returns, while leaving its original priority, benefit estimate, governance status, and analyst reservations unchanged in the enterprise pipeline',
        'Reduce quality requirements enough to complete within the remaining budget, because a delivered output is preferable to a strategically obsolete cancellation'
      ],answer:0,
      why:'Sunk cost is not a reason to fund negative future value. Regular portfolio governance must refresh strategic alignment, economics, and resource constraints and may cancel active projects. Formal closure preserves results, approvals, accounts, and lessons learned before scarce analysts are reassigned. <b>A. Close the project through the formal process, document results and lessons, update the portfolio record, and reallocate analysts based on current strategy and value</b> <span class="tb-source-ref">Source: Kubiak, Chapter 14, Closing Process, pp. 211-212; Chapter 15, Performance Measurement, pp. 222-224.</span>',
      optionRationales:[
        'Correct. It applies current portfolio criteria and preserves organizational learning through controlled closure.',
        'Budget already spent is sunk; it does not restore strategic relevance or positive prospective value.',
        'Indefinite suspension retains stale priority and capacity claims while avoiding the required governance decision.',
        'Lowering quality cannot create strategic value and may add operational or compliance exposure.'
      ],
      formula:null,assumptions:['No contractual obligation requires completion.','The negative forecast excludes sunk cost and reflects prospective cash flows.'],estimatedMinutes:3,
      keywords:['project closure','sunk cost','portfolio review','resource reallocation','strategic alignment'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 14 and 15 - Closing Process and Performance Measurement',sourcePages:'211-212, 222-224',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 14 - Project Oversight and Management',section:'Closing Process',pages:'211-212'},{id:'S2',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 15 - Project Management Infrastructure',section:'Performance Measurement',pages:'222-224'}]
    },
    {
      qid:'mbb:set-2:original-040',set:2,batch:2,sub:'mbb-training',
      bok:{domain:'IV. Training Design and Delivery',subdomain:'B. Training Plans',topic:'Multilevel competency planning by target group'},
      difficulty:'Very Hard',cognitive:'Create',questionType:'Visual evidence interpretation, non-statistical',industry:'Precision manufacturing',quantitative:false,
      stem:'The mastery grid shows required end-state competencies. All groups currently meet Entry. The training director proposes one identical five-day statistics course for everyone. Which redesign best closes the specified gaps without making the curriculum one-size-fits-all?',
      options:[
        'Keep the common course but add a harder final exam for Belts, because assessment difficulty alone differentiates the competency required by each role while preserving one administratively consistent path across every site',
        'Use role paths: sponsors reach Practitioner in interpretation and risk communication; Belts reach Practitioner in application and coaching; metrology reaches Expert in diagnostics; assess each target.',
        'Train only metrology staff because they own the measurement system, then have them approve every analysis produced by sponsors and Belts and transfer the needed knowledge through mandatory sign-off meetings',
        'Move every group to Expert in every skill so future role changes require no additional development, all learners can attend the same advanced modules, and one proficiency target governs the organization'
      ],answer:1,
      why:'The grid calls for different skills and proficiency levels by target group. A defensible plan maps modular content, practice, and assessment to every displayed gap: sponsors practice interpretation and business-risk communication through Practitioner; Belts practice application and coaching through Practitioner; and metrology staff build Expert diagnostic capability. A common course or a common examination does not create the required role-specific proficiency. <b>B. Use role paths: sponsors reach Practitioner in interpretation and risk communication; Belts reach Practitioner in application and coaching; metrology reaches Expert in diagnostics; assess each target.</b> <span class="tb-source-ref">Source: Kubiak, Chapter 18, Training Plans and Mastery Grids, pp. 245-251.</span>',
      optionRationales:[
        'A harder test does not supply different learning experiences or demonstrate role-specific applied capability.',
        'Correct. It explicitly develops and assesses every target-group gap at the proficiency shown in the grid.',
        'Measurement ownership does not eliminate sponsor and Belt responsibilities for decisions and proper application.',
        'Universal expert training spends resources beyond the stated needs and still ignores role-specific application.'
      ],
      formula:null,assumptions:['Entry is the verified current level for each listed group and skill.','Blank cells mean the skill is not required for that group.'],estimatedMinutes:4,
      keywords:['training plan','mastery grid','target group','multilevel competency','modular curriculum'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 18 - Training Plans',sourcePages:'245-251',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 18 - Training Plans',section:'Components and Application of the Training Plan',pages:'245-251'}],
      chart:{type:'data-table',columns:['Skill','Sponsors target','Belts target','Metrology target'],rows:[['Interpret MSA decisions','Beginner','Practitioner','Expert'],['Coach study planning','—','Practitioner','Expert'],['Administer diagnostic studies','—','Beginner','Expert'],['Communicate business risk','Practitioner','Practitioner','Beginner']]},
      visual:visual2('mbb:set-2:original-040','data-table','A mastery grid lists four skills and different target levels for sponsors, Belts, and metrology staff. Sponsors emphasize interpretation and business risk, Belts emphasize application and coaching, and metrology staff require expert diagnostic capability.','')
    },
    {
      qid:'mbb:set-2:original-041',set:2,batch:2,sub:'mbb-training',
      bok:{domain:'IV. Training Design and Delivery',subdomain:'C. Training Materials and Curriculum Development',topic:'Adult-learning-aligned material and delivery selection'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Advanced conceptual/method-selection',industry:'Business-to-business services',quantitative:false,
      stem:'Experienced account managers must learn to translate customer narratives into measurable CTQs. A vendor offers four designs with the same content coverage. Which design is most consistent with adult learning and transfer to the job?',
      options:[
        'A lecture that defines every term in taxonomy order, followed by a closed-book recall test one month later and no workplace application',
        'A self-paced glossary with optional reading, because experienced adults learn best when the instructor avoids feedback and structured practice',
        'A generic simulation from an unrelated industry, scored only on participation so prior experience cannot affect the assessment outcome',
        'A brief concept model followed by authentic customer cases, learner choice among cases, coached practice, feedback, reflection, and a near-term workplace assignment'
      ],answer:3,
      why:'Adult learners bring relevant experience, value practical and problem-centered work, benefit from participation and self-direction, and need prompt opportunities to apply and receive feedback. The authentic-case design uses those characteristics while retaining structure and evidence of transfer. Recall-only or participation-only designs do not demonstrate performance. <b>D. A brief concept model followed by authentic customer cases, learner choice among cases, coached practice, feedback, reflection, and a near-term workplace assignment</b> <span class="tb-source-ref">Source: Kubiak, Chapter 19, Adult Learning Theory and Training Delivery, pp. 256-283.</span>',
      optionRationales:[
        'Taxonomy-order lecture and delayed recall underuse experience and provide weak evidence of workplace transfer.',
        'Self-direction does not mean absence of guided practice, feedback, standards, or assessment.',
        'An unrelated exercise and participation score weaken relevance and cannot verify CTQ translation skill.',
        'Correct. It combines relevance, experience, choice, practice, feedback, reflection, and immediate application.'
      ],
      formula:null,assumptions:['The account managers already know their customer domains.','The workplace assignment can be reviewed without exposing confidential customer data.'],estimatedMinutes:3,
      keywords:['adult learning','experiential learning','transfer','authentic practice','feedback'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 19 - Adult Learning Theory and Training Delivery',sourcePages:'256-283',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 19 - Training Materials and Curriculum Development',section:'Adult Learning Theory; Training Delivery',pages:'256-283'}]
    },
    {
      qid:'mbb:set-2:original-042',set:2,batch:2,sub:'mbb-training',
      bok:{domain:'IV. Training Design and Delivery',subdomain:'D. Training Effectiveness Evaluation',topic:'Multilevel evaluation and validation of training effects'},
      difficulty:'Expert',cognitive:'Create',questionType:'Integrated governance scenario',industry:'Hospital laboratory network',quantitative:false,
      stem:'A laboratory network is training supervisors to coach specimen-handling standard work. Leaders want credible evidence that the program improves performance rather than merely generating favorable class ratings. Which evaluation design is strongest?',
      options:[
        'Collect anonymous reaction ratings after class and treat an average above 4.5 as proof that coaching behavior and specimen quality improved in subsequent workplace practice',
        'Administer a difficult final knowledge test and compare sites by pass rate, without measuring baseline skill, workplace behavior, or operational outcomes',
        'Predefine objectives; measure reaction and pre/post learning; audit coached behavior after transfer; track specimen defects; and use phased rollout or comparison evidence to address rival causes',
        'Track specimen defects for one quarter after training and attribute the full observed change to training because operational results automatically subsume reaction, learning, behavior, baseline differences, secular trends, and every concurrent improvement'
      ],answer:2,
      why:'A credible evaluation is built from predefined objectives and tests multiple links in the causal chain: reaction, acquired learning, transferred behavior, and organizational results. Baselines and phased or comparison evidence help distinguish training effects from concurrent operational changes. No single level proves all others. <b>C. Predefine objectives; measure reaction and pre/post learning; audit coached behavior after transfer; track specimen defects; and use phased rollout or comparison evidence to address rival causes</b> <span class="tb-source-ref">Source: Kubiak, Chapter 20, Training Effectiveness Evaluation, pp. 285-292.</span>',
      optionRationales:[
        'Reaction indicates learner perception and cannot establish learning, behavior change, or quality results.',
        'Post-only knowledge scores omit the baseline, transfer behavior, and organizational performance.',
        'Correct. It links objectives to multiple evaluation levels and strengthens attribution with comparative evidence.',
        'Outcome movement may reflect staffing, workload, materials, or policy changes and does not verify the learning pathway.'
      ],
      formula:null,assumptions:['A phased rollout or comparable untreated period is operationally and ethically feasible.','Specimen-defect definitions remain stable during evaluation.'],estimatedMinutes:4,
      keywords:['Kirkpatrick','training evaluation','learning transfer','behavior','results attribution'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 20 - Training Effectiveness Evaluation',sourcePages:'285-292',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 20 - Training Effectiveness Evaluation',section:'Validation and Evaluation Models; Kirkpatrick Model',pages:'285-292'}]
    },
    {
      qid:'mbb:set-2:original-043',set:2,batch:2,sub:'mbb-coaching',
      bok:{domain:'V. Mentoring Responsibilities',subdomain:'A. Mentoring Champions, Change Agents, and Executives',topic:'Champion and MBB responsibilities during tollgate reviews'},
      difficulty:'Hard',cognitive:'Understand',questionType:'Advanced conceptual/method-selection',industry:'Consumer lending',quantitative:false,
      stem:'At an Analyze tollgate, the champion asks the team to decide whether the project still supports the current enterprise strategy and asks the MBB to remove a policy barrier owned by another executive. Which role correction is most appropriate?',
      options:[
        'The team should make both decisions because tollgates transfer strategic and organizational authority to the people closest to the analysis and implementation evidence',
        'The champion should own the strategic-alignment judgment and barrier escalation, while the MBB coaches an objective review of evidence and readiness',
        'The MBB should make both decisions because technical coaching authority includes final control over enterprise strategy, executive resources, cross-functional policy, and sponsor accountability',
        'Finance should decide alignment and remove the barrier because every Analyze tollgate requires Finance to replace the champion as decision maker'
      ],answer:1,
      why:'The team supplies evidence, but the champion is positioned to determine whether the project remains strategically aligned and to remove organizational barriers. The MBB supports the tollgate’s quality by coaching preparation, testing evidence, and advising on readiness without appropriating executive accountability. <b>B. The champion should own the strategic-alignment judgment and barrier escalation, while the MBB coaches an objective review of evidence and readiness</b> <span class="tb-source-ref">Source: Kubiak, Chapter 21, Tollgate Reviews, pp. 294-298.</span>',
      optionRationales:[
        'Proximity to analysis does not give the team authority over enterprise strategy or executive policy.',
        'Correct. It preserves champion accountability and the MBB’s evidence-focused coaching role.',
        'Technical authority and facilitation do not confer ownership of strategy or executive resource barriers.',
        'Finance may validate benefits at selected gates but does not categorically replace the champion.'
      ],
      formula:null,assumptions:['The champion has access to the current strategy and relevant executives.','The MBB has no delegated policy authority.'],estimatedMinutes:2,
      keywords:['tollgate review','champion','strategic alignment','barrier removal','MBB coaching'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 21 - Tollgate Reviews',sourcePages:'294-298',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 21 - Mentoring Champions, Change Agents, and Executives',section:'Tollgate Reviews',pages:'294-298'}]
    },
    {
      qid:'mbb:set-2:original-044',set:2,batch:2,sub:'mbb-coaching',
      bok:{domain:'V. Mentoring Responsibilities',subdomain:'B. Mentoring Black Belts and Green Belts',topic:'Distinguishing project coaching from career mentoring'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Energy generation',quantitative:false,
      stem:'A Black Belt needs immediate help selecting a valid sampling plan for an active project and also wants confidential guidance about moving into an operations-leadership role next year. The assigned MBB knows the project but participates in the promotion panel. What arrangement is most defensible?',
      options:[
        'Have the MBB coach the project decision, disclose and manage the promotion conflict, and arrange an independent career mentor for the longer-term discussion',
        'Have the MBB provide both services privately because detailed knowledge of the project makes the MBB the most informed person to evaluate readiness, career options, and the confidential promotion path',
        'Transfer all technical coaching to the line manager and let the MBB mentor the career decision confidentially, because technical coaching must never be provided by a senior Belt who sits on any review panel',
        'Defer both discussions until the project closes and the promotion panel finishes its work, so technical performance, sampling decisions, career planning, and advancement cannot influence one another in any way'
      ],answer:0,
      why:'Coaching focuses on applied Belt performance and project progress, while mentoring addresses broader career navigation. The MBB can coach the sampling decision, but participation in the promotion panel creates a conflict for confidential career mentoring. Disclosure and an independent mentor preserve both functions without withholding timely project support. <b>A. Have the MBB coach the project decision, disclose and manage the promotion conflict, and arrange an independent career mentor for the longer-term discussion</b> <span class="tb-source-ref">Source: Kubiak, Chapter 22, Coaching and Mentoring, pp. 306-310.</span>',
      optionRationales:[
        'Correct. It separates immediate role coaching from conflicted career mentoring while maintaining needed support.',
        'Project knowledge does not neutralize the promotion-panel conflict or protect confidential career exploration.',
        'Senior Belts are expected to coach technical application; the line manager is not automatically the proper substitute.',
        'Deferral unnecessarily exposes the active project and denies timely career support that can be arranged independently.'
      ],
      formula:null,assumptions:['An independent qualified mentor is available.','The promotion process permits disclosure and recusal where appropriate.'],estimatedMinutes:3,
      keywords:['coaching','mentoring','conflict of interest','career development','technical guidance'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 22 - Coaching and Mentoring',sourcePages:'306-310',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 22 - Mentoring Black Belts and Green Belts',section:'Individuals; Coaching; Mentoring',pages:'306-310'}]
    },
    {
      qid:'mbb:set-2:original-045',set:2,batch:2,sub:'mbb-coaching',
      bok:{domain:'V. Mentoring Responsibilities',subdomain:'C. Mentoring Non-belt Employees',topic:'Development pathway for non-belt participants'},
      difficulty:'Very Hard',cognitive:'Create',questionType:'Leadership, deployment, and best-next-action scenario',industry:'Municipal government',quantitative:false,
      stem:'A city wants to replenish its Green Belt pipeline from non-belt employees who have served on improvement teams. Current outreach is a generic intranet page; selection criteria are unpublished; and executives receive shortened training with no project requirement. Which development pathway should the MBB create?',
      options:[
        'Keep the intranet page as the sole channel and nominate candidates privately, because publishing criteria could discourage employees who lack statistical backgrounds',
        'Offer every employee the full Green Belt course immediately and award status on attendance, then use later project results to identify who was actually qualified',
        'Publish role and selection expectations, add active awareness and targeted outreach, provide staged skill-building and project exposure, and apply equivalent qualification standards to leaders',
        'Recruit only prior team leaders and exempt executives from project work, because visible leadership credentials are more important than consistent development requirements'
      ],answer:2,
      why:'A sustainable pipeline needs accessible information, active outreach, transparent expectations, staged development, and authentic project experience. Applying weaker requirements to executives damages constancy of purpose and signals that the standards are symbolic. The pathway should help non-belts build evidence of readiness before formal Belt selection. <b>C. Publish role and selection expectations, add active awareness and targeted outreach, provide staged skill-building and project exposure, and apply equivalent qualification standards to leaders</b> <span class="tb-source-ref">Source: Kubiak, Chapter 23, Mentoring Non-belt Employees, pp. 315-316.</span>',
      optionRationales:[
        'Passive information and hidden criteria limit access, succession, trust, and self-directed preparation.',
        'Attendance-based credentials dilute qualification and place unprepared candidates into costly formal training.',
        'Correct. It combines transparent information, active recruitment, development, experience, and consistent standards.',
        'Prior leadership is not the only source of Belt potential, and executive exemptions undermine credibility.'
      ],
      formula:null,assumptions:['The city can provide supervised project participation before formal Belt assignment.','Published criteria comply with employment policy.'],estimatedMinutes:3,
      keywords:['non-belt development','Green Belt pipeline','recruitment','qualification standards','awareness'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 23 - Mentoring Non-belt Employees',sourcePages:'315-316',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 23 - Mentoring Non-belt Employees',section:'Awareness, Information, Recruitment, and Executive Development',pages:'315-316'}]
    },
    {
      qid:'mbb:set-2:original-046',set:2,batch:2,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. Measurement Systems Analysis',topic:'Attribute agreement analysis and corrective action'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Visual statistical-output interpretation',industry:'Food safety inspection',quantitative:false,
      stem:'Three inspectors independently classified the same randomized reference images twice as Accept or Reject. The study summary is shown. The organization requires at least 90% repeatability and at least 90% agreement with the reference for each inspector. Which action is most defensible?',
      options:[
        'Approve all inspectors because overall repeatability exceeds 90%, then increase the number and diversity of reference images to improve individual accuracy without changing operational definitions or calibration',
        'Replace Inspector C because a stronger agreement with the reference indicates that C applied a different decision rule from the other inspectors',
        'Average the three reference-agreement rates and approve the system because the resulting 88% is close enough to the 90% requirement',
        'Do not approve the system; calibrate A and B to operational definitions with reference examples, then repeat a blinded agreement study for all inspectors'
      ],answer:3,
      why:'The acceptance rule applies to each inspector. A and B are sufficiently self-consistent but disagree with the known reference too often, indicating reproducible use of an inaccurate interpretation. C meets both thresholds. Operational-definition calibration with reference examples addresses the observed failure; a new blinded study verifies the system rather than assuming the training worked. <b>D. Do not approve the system; calibrate A and B to operational definitions with reference examples, then repeat a blinded agreement study for all inspectors</b> <span class="tb-source-ref">Source: Kubiak, Chapter 24, Attribute Measurement Systems, pp. 320-334.</span>',
      optionRationales:[
        'An overall average can conceal inspector-specific failures, and a larger sample does not correct systematic interpretation error.',
        'C is the only inspector meeting both stated criteria; superior reference agreement is not evidence of an invalid rule.',
        'The requirement is not an average threshold, and 88% would remain below 90% even if averaging were permitted.',
        'Correct. It targets the low reference accuracy while requiring independent verification after correction.'
      ],
      formula:'Within-inspector agreement is repeated self-agreement; agreement with reference is correct classifications divided by reference classifications.',assumptions:['Reference classifications are valid and mutually exclusive.','Images were independently and blindly rated in randomized order.'],estimatedMinutes:4,
      keywords:['attribute agreement','repeatability','reference accuracy','operational definition','measurement system'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 24 - Attribute Measurement Systems',sourcePages:'320-334',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 24 - Measurement Systems Analysis',section:'Attribute (Discrete) Measurement Systems',pages:'320-334'}],
      chart:{type:'data-table',columns:['Inspector','Within-inspector agreement','Agreement with reference','Meets both 90% criteria?'],rows:[['A','96%','82%','No'],['B','94%','84%','No'],['C','98%','98%','Yes'],['Overall','96%','88%','—']]},
      visual:visual2('mbb:set-2:original-046','data-table','An attribute agreement table shows Inspector A at 96 percent within-inspector agreement and 82 percent versus reference, B at 94 and 84 percent, C at 98 and 98 percent, and overall results of 96 and 88 percent.','')
    },
    {
      qid:'mbb:set-2:original-047',set:2,batch:2,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Multiple regression and variance inflation factors'},
      difficulty:'Hard',cognitive:'Apply',questionType:'Statistical-output interpretation',industry:'Chemical processing',quantitative:false,
      stem:'A yield model has R-squared 91% and adjusted R-squared 89%. Temperature has VIF 12.8 and p = 0.41; pressure has VIF 11.9 and p = 0.36; line speed has VIF 1.7 and p < 0.001. Temperature and pressure are strongly correlated by the operating recipe. What should the analyst conclude?',
      options:[
        'The high R-squared proves all three coefficients are stable and causal, so temperature and pressure should remain separately interpreted despite their p-values, inflated uncertainty, and recipe-driven correlation structure',
        'Temperature and pressure coefficients are unstable for separate interpretation; use process knowledge to redesign, combine, or select terms while validating prediction and residual behavior',
        'Line speed must be removed first because its low VIF shows that it contributes too little shared information to a multiple-regression model',
        'The model is unusable for prediction and must be discarded without further validation because any VIF above 10 necessarily makes fitted values, residual diagnostics, and all future predictions mathematically invalid'
      ],answer:1,
      why:'Large VIFs indicate that temperature and pressure carry overlapping predictor information, inflating coefficient uncertainty and making their individual effects difficult to interpret. Multicollinearity does not automatically destroy prediction. The response should follow the model purpose and process physics: redesign the data region, combine terms, or select a defensible representation, then validate predictions and residuals. <b>B. Temperature and pressure coefficients are unstable for separate interpretation; use process knowledge to redesign, combine, or select terms while validating prediction and residual behavior</b> <span class="tb-source-ref">Source: Kubiak, Chapter 25, Multiple Regression and Multicollinearity, pp. 374-383.</span>',
      optionRationales:[
        'Overall fit does not establish causal or stable individual coefficients when predictors are highly collinear.',
        'Correct. It distinguishes coefficient interpretation from prediction and proposes purpose-driven remediation.',
        'A low VIF is not a reason to remove a significant predictor; it indicates little variance inflation.',
        'Multicollinearity can impair coefficient interpretation without necessarily invalidating fitted values or predictions.'
      ],
      formula:'VIF_j = 1 / (1 - R_j²); large VIF indicates inflated variance for coefficient j.',assumptions:['The stated recipe correlation is representative of the fitted data.','Other regression assumptions still require separate verification.'],estimatedMinutes:3,
      keywords:['multiple regression','VIF','multicollinearity','coefficient interpretation','prediction'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 25 - Multiple Regression Analysis',sourcePages:'374-383',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25 - Measuring and Modeling Relationships Between Variables',section:'Multiple Regression Analysis; Multicollinearity',pages:'374-383'}]
    },
    {
      qid:'mbb:set-2:original-048',set:2,batch:2,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'C. Design of Experiments',topic:'Response surface methodology and steepest ascent'},
      difficulty:'Expert',cognitive:'Analyze',questionType:'Visual multi-step quantitative',industry:'Advanced materials development',quantitative:true,
      stem:'The fitted coded-factor response is y-hat = 90 - 6(A - 0.5)^2 - 2(B + 0.5)^2. The contour plot marks the current setting at A = -1, B = 1. Based on the local gradient, which first search direction follows steepest ascent?',
      options:[
        'Increase A and decrease B, using relative coded steps near 3 to 1 because the local gradient is proportional to positive 18 and negative 6',
        'Decrease A and increase B, using relative coded steps near 3 to 1 because movement toward successively lower fitted-response contours maximizes the response most efficiently',
        'Increase A and increase B in equal coded increments because steepest ascent must follow the long axis of the nearest elliptical contour toward its most distant boundary',
        'Hold A constant and decrease B in progressively larger coded steps because the contour center demonstrates that only factor B has a nonzero local derivative at the current setting'
      ],answer:0,
      why:'For the fitted surface, partial y/partial A = -12(A-0.5) and partial y/partial B = -4(B+0.5). At (-1,1), the gradient is (18,-6), so the locally steepest increase raises A and lowers B with a coded-step ratio of about 3:1. The direction is normal to, not along, a contour. <b>A. Increase A and decrease B, using relative coded steps near 3 to 1 because the local gradient is proportional to positive 18 and negative 6</b> <span class="tb-source-ref">Source: Kubiak, Chapter 26, Response Surface Methodology and Steepest Ascent, pp. 439-442.</span>',
      optionRationales:[
        'Correct. The signs and relative magnitudes match the gradient evaluated at the current setting.',
        'That is the direction of local descent, opposite the positive gradient.',
        'Travel along a contour produces approximately constant response rather than the steepest local increase.',
        'Both partial derivatives are nonzero at the current point; A has the larger local effect.'
      ],
      formula:'Gradient = [-12(A-0.5), -4(B+0.5)]; at (-1,1), gradient = [18,-6].',assumptions:['The quadratic model is adequate locally.','Both factors use comparable coded units and the first move remains within the experimental region.'],estimatedMinutes:4,
      keywords:['response surface methodology','contour plot','steepest ascent','gradient','coded factors'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 26 - Response Surface Methodology',sourcePages:'439-442',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 26 - Design of Experiments',section:'Response Surface Methodology; Steepest Ascent and Descent Experiments',pages:'439-442'}],
      chart:{type:'contour-plot',title:'Fitted response contours',xLabel:'Factor A (coded units)',yLabel:'Factor B (coded units)',xTicks:[-2,-1,0,1,2],yTicks:[-2,-1,0,1,2],xDomain:[-2.5,2.5],yDomain:[-2.5,2.5],center:[0.5,-0.5],contours:[{level:75,radiusX:1.5811,radiusY:2.7386},{level:80,radiusX:1.2910,radiusY:2.2361},{level:85,radiusX:0.9129,radiusY:1.5811}],current:{x:-1,y:1,label:'Current'},model:'y-hat = 90 - 6(A - 0.5)^2 - 2(B + 0.5)^2'},
      visual:visual2('mbb:set-2:original-048','contour-plot','An accessible contour plot of the fitted response shows elliptical contours at responses 75, 80, and 85 centered at coded factor settings A 0.5 and B negative 0.5. The current point is A negative 1 and B positive 1.','')
    },
    {
      qid:'mbb:set-2:original-049',set:2,batch:2,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Reliability modeling for series and parallel systems'},
      difficulty:'Very Hard',cognitive:'Apply',questionType:'Interactive visual multi-step quantitative',industry:'Renewable-energy equipment',quantitative:true,
      stem:'Each of two identical, independent inverter modules has Weibull reliability R(t) = exp[-(t/2500)^1.5]. Compare a system requiring both modules to operate with a system requiring either module to operate. At 1,000 hours, which conclusion is correct?',
      options:[
        'Component reliability is about 0.603; therefore series reliability is 0.364 and active-parallel reliability is 0.842 at 1,000 hours',
        'Both system reliabilities equal the component reliability of about 0.777 because identical independent modules have no configuration effect when they share the same Weibull scale and shape parameters',
        'Component reliability is about 0.777; series reliability is about 0.603 and active-parallel reliability is about 0.950, assuming independent failures',
        'Series reliability is about 0.950 and active-parallel reliability is about 0.603 because parallel paths multiply successful component probabilities'
      ],answer:2,
      why:'At 1,000 hours, the component reliability is exp[-(0.4)^1.5] = 0.7765. Two independent components in series require both to work, so Rseries = R² = 0.6030. Two active-parallel components fail only if both fail, so Rparallel = 1-(1-R)² = 0.9500. Independence is essential to the calculation. <b>C. Component reliability is about 0.777; series reliability is about 0.603 and active-parallel reliability is about 0.950, assuming independent failures</b> <span class="tb-source-ref">Source: Kubiak, Chapter 25, Reliability Modeling, pp. 423-427.</span>',
      optionRationales:[
        'It incorrectly treats the series-system value as component reliability and propagates that error.',
        'Configuration changes system success logic even when component distributions are identical.',
        'Correct. It applies the Weibull component model and the independent series and parallel formulas.',
        'The formulas are reversed: series multiplies successes, while parallel complements joint failures.'
      ],
      formula:'Rcomponent(1000)=exp[-(1000/2500)^1.5]=0.7765; Rseries=R²=0.6030; Rparallel=1-(1-R)²=0.9500.',assumptions:['The two modules are statistically independent.','Either active-parallel module can carry the required load without switching failure.'],estimatedMinutes:4,
      keywords:['Weibull reliability','series system','parallel system','mission time','independence'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 25 - Reliability Modeling',sourcePages:'423-427',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25 - Measuring and Modeling Relationships Between Variables',section:'Reliability Modeling; Series and Parallel Systems',pages:'423-427'}],
      chart:{type:'reliability-plot',title:'Two-module system reliability',xLabel:'Mission time (hours)',yLabel:'System reliability',xTicks:[0,500,1000,1500,2000],series:[{label:'Both modules required (series)',points:[[0,1],[500,0.8362],[1000,0.6029],[1500,0.3947],[2000,0.2390]]},{label:'Either module sufficient (active parallel)',points:[[0,1],[500,0.9927],[1000,0.9500],[1500,0.8618],[2000,0.7388]]}],missionTime:1000},
      visual:visual2('mbb:set-2:original-049','reliability-plot','A two-series reliability plot covers 0 to 2,000 hours. At 1,000 hours, the system requiring both modules has reliability about 0.603 and the active-parallel system requiring either module has reliability 0.9500.','Hover or keyboard-focus the plotted mission-time points to compare the two system configurations at the same hours.')
    },
    {
      qid:'mbb:set-2:original-050',set:2,batch:2,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Linear programming constraints and slack'},
      difficulty:'Hard',cognitive:'Understand',questionType:'Advanced conceptual/method-selection',industry:'Distribution planning',quantitative:false,
      stem:'A solved linear-programming model maximizes contribution under labor and dock-hour constraints. At the optimum, labor slack is 0 hours and dock slack is 18 hours. The sensitivity report is unavailable. Which interpretation is justified by this output alone?',
      options:[
        'Both constraints are binding because every constraint participates in the model even when its slack is positive at the reported solution',
        'The dock constraint is binding and labor is nonbinding because unused dock hours represent demand that the labor constraint cannot absorb',
        'Adding one labor hour must increase contribution by exactly the current contribution per labor hour because zero slack defines the shadow price',
        'Labor is binding and dock capacity has 18 unused hours; the value of more labor cannot be quantified without sensitivity or re-optimization evidence'
      ],answer:3,
      why:'Zero slack means the labor constraint is active at the reported optimum. Positive dock slack means 18 dock hours remain unused, so dock capacity is not binding there. Slack alone does not reveal a shadow price or its allowable range; quantifying the objective gain from another labor hour requires sensitivity information or resolving the model. <b>D. Labor is binding and dock capacity has 18 unused hours; the value of more labor cannot be quantified without sensitivity or re-optimization evidence</b> <span class="tb-source-ref">Source: Kubiak, Chapter 25, Linear Programming, pp. 417-422.</span>',
      optionRationales:[
        'Participation in a model does not make a constraint binding; positive slack demonstrates unused capacity.',
        'The interpretation is reversed: labor has zero slack, while dock capacity has 18 unused hours.',
        'Zero slack identifies a binding constraint but does not numerically identify its marginal value.',
        'Correct. It extracts exactly what slack establishes and avoids an unsupported sensitivity claim.'
      ],
      formula:'Slack = available resource - resource used; zero slack identifies an active constraint at the reported solution.',assumptions:['The reported solution is feasible and optimal.','Constraint units are hours and no integer restriction changes the meaning of reported slack.'],estimatedMinutes:3,
      keywords:['linear programming','slack variable','binding constraint','sensitivity analysis','optimization'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 25 - Linear Programming',sourcePages:'417-422',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25 - Measuring and Modeling Relationships Between Variables',section:'Linear Programming',pages:'417-422'}]
    }
  ];

  var batch3=[
    {
      qid:'mbb:set-2:original-051',set:2,batch:3,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'A. Strategic Plan Development',topic:'SWOT and PEST environmental scanning'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Visual evidence interpretation, strategic analysis',industry:'Pharmaceutical cold-chain logistics',quantitative:false,
      stem:'A pharmaceutical distributor is refreshing its three-year strategy. The planning team classified the five facts below and immediately proposed a broad automation program. Which Master Black Belt response best uses the evidence without confusing internal capability with the external environment?',
      options:[
        'Treat every unfavorable fact as an internal weakness, then charter one DMAIC project for each item before competitors can respond to the same conditions',
        'Treat every favorable fact as an external opportunity, rank the five facts by financial size, and select the highest-ranked item as the enterprise strategy',
        'Keep internal strengths and weaknesses distinct from external PEST conditions, then test strategies that leverage the sensor capability while mitigating key-person, regulatory, and technology exposure',
        'Remove the demographic evidence because social factors are not actionable by the distributor, then use only political and technological facts to set deployment priorities'
      ],answer:2,
      why:'SWOT separates internal strengths and weaknesses from external opportunities and threats, while PEST structures the external political, economic, social, and technological scan. The proprietary sensor and single-expert dependency are internal; regulation, demographics, and competitor technology are external. Strategy should combine these facts rather than turn each observation automatically into a project. <b>C. Keep internal strengths and weaknesses distinct from external PEST conditions, then test strategies that leverage the sensor capability while mitigating key-person, regulatory, and technology exposure</b> <span class="tb-source-ref">Source: Kubiak, Chapter 1, SWOT and PEST, pp. 2-7.</span>',
      optionRationales:[
        'External threats are not internal weaknesses, and environmental observations require strategic synthesis before project chartering.',
        'Favorable internal capabilities are strengths, not opportunities, and a single financial rank does not constitute a strategy.',
        'Correct. It preserves the internal-external distinction and converts the combined scan into testable strategic choices.',
        'Social trends are legitimate PEST evidence even when the organization must respond indirectly through its strategy.'
      ],
      formula:null,assumptions:['The five facts are current, independently verified inputs to the planning process.','No immediate regulatory violation requires emergency containment.'],estimatedMinutes:3,
      keywords:['SWOT','PEST','environmental scan','strategic planning','internal and external factors'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 1 - SWOT and PEST',sourcePages:'2-7',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 1 - Strategic Plan Deployment',section:'SWOT; PEST',pages:'2-7'}],
      chart:{type:'data-table',columns:['Verified fact','Planning classification'],rows:[
        ['Proprietary sensor accuracy exceeds competitors','Internal, favorable'],
        ['One specialist maintains the billing interface','Internal, unfavorable'],
        ['Regulator will require serialized temperature audits','External political/legal'],
        ['Regional population is aging toward home delivery','External social'],
        ['Competitor launched AI-based route scheduling','External technological']
      ]},
      visual:visual3('mbb:set-2:original-051','data-table','A five-row strategy evidence table classifies a proprietary sensor advantage and a single-specialist dependency as internal facts, and a new audit rule, aging population, and competitor AI scheduling as external PEST facts.','')
    },
    {
      qid:'mbb:set-2:original-052',set:2,batch:3,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'B. Strategic Plan Alignment',topic:'Strategic deployment goals and operational alignment'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Enterprise deployment and governance scenario',industry:'Public transportation',quantitative:false,
      stem:'A transit authority sets an enterprise goal to increase reliable access without increasing operating cost. Operations is rewarded for vehicle utilization, Maintenance for minimizing planned downtime, and Customer Service for reducing complaint-handling time. Each function meets its local target, yet missed connections and repeat complaints increase. What should the Master Black Belt recommend?',
      options:[
        'Use catchball to redesign the goal cascade around shared outcome and driver measures, reconcile functional tradeoffs, and assign joint accountability for end-to-end passenger reliability',
        'Keep the current local targets but raise each threshold enough that the combined stretch forces the enterprise outcome to improve during the next planning cycle and require departments to explain the remaining misses during each monthly review cycle',
        'Replace every functional measure with missed connections because one common lagging metric prevents departments from optimizing different definitions of performance',
        'Transfer accountability to Customer Service because repeat complaints provide the most direct voice-of-customer evidence and therefore dominate operational measures'
      ],answer:0,
      why:'The local measures are producing predictable suboptimization: utilization can reduce maintenance opportunity, downtime avoidance can defer needed work, and short calls can drive repeats. Strategic alignment requires vertical and horizontal negotiation of targets and means, with a balanced architecture connecting shared outcomes to controllable drivers and explicit tradeoffs. <b>A. Use catchball to redesign the goal cascade around shared outcome and driver measures, reconcile functional tradeoffs, and assign joint accountability for end-to-end passenger reliability</b> <span class="tb-source-ref">Source: Kubiak, Chapters 1-2, Strategic Plan Deployment and Alignment, pp. 7-27.</span>',
      optionRationales:[
        'Correct. It repairs the measurement system and governance relationships that are causing local optimization.',
        'Increasing incompatible thresholds can intensify the same cross-functional conflict rather than align the operating system.',
        'One lagging outcome cannot diagnose or manage the controllable drivers needed by different functions.',
        'Customer evidence is essential, but Customer Service cannot own vehicle reliability and maintenance tradeoffs alone.'
      ],
      formula:null,assumptions:['The enterprise goal is approved and all three functional measures are behaving as described.'],estimatedMinutes:3,
      keywords:['strategic alignment','catchball','local optimization','balanced measures','shared accountability'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 1-2 - Hoshin Kanri and Strategic Plan Alignment',sourcePages:'7-27',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapters 1-2 - Strategic Plan Deployment and Alignment',section:'Hoshin Kanri; Strategic Deployment Goals; Project Alignment',pages:'7-27'}]
    },
    {
      qid:'mbb:set-2:original-053',set:2,batch:3,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'C. Infrastructure Elements of Improvement Systems',topic:'Resource planning and development for deployment'},
      difficulty:'Expert',cognitive:'Create',questionType:'Deployment-system design scenario',industry:'Global financial services',quantitative:false,
      stem:'A global bank proposes certifying 120 additional Green Belts. The qualified project pipeline can support only 38 assignments, current Master Black Belts can actively coach 16 new projects, candidate backfill is unfunded, and annual Belt attrition is 22%. Which deployment design is most defensible?',
      options:[
        'Train all 120 candidates in one cohort, allow unassigned candidates to use hypothetical projects, and treat certification volume as the leading deployment indicator while using completion rate and examination scores to demonstrate enterprise deployment progress',
        'Cancel internal development and hire experienced Belts externally because attrition demonstrates that an internal career path cannot be economically sustained',
        'Allocate all coaching capacity to the highest-level candidates, while Green Belts complete projects independently until additional Master Black Belts are recruited and ask sponsors to absorb technical review responsibility during the capacity gap',
        'Build a time-phased supply-demand model linking qualified projects, selection criteria, backfill, coaching capacity, attrition, assignments, and career paths; release cohorts only at supported gates'
      ],answer:3,
      why:'Resource development must be driven by organizational need and supported by training, coaching, continuing education, real assignments, and career planning. Training 120 people against 38 projects and 16 coaching slots creates excess work in process and predictable failure. A gated, time-phased model makes the capacity constraints and replenishment logic explicit. <b>D. Build a time-phased supply-demand model linking qualified projects, selection criteria, backfill, coaching capacity, attrition, assignments, and career paths; release cohorts only at supported gates</b> <span class="tb-source-ref">Source: Kubiak, Chapter 3, Resource Planning and Resource Development, pp. 41-51.</span>',
      optionRationales:[
        'Hypothetical projects cannot replace verified business assignments, sponsorship, and coaching capacity in a deployment system.',
        'External hiring may be one input, but attrition alone does not justify abandoning internal capability development.',
        'Withholding coaching from less experienced Belts increases project and learning risk rather than resolving capacity.',
        'Correct. It integrates the linked demand, development, support, retention, and assignment decisions over time.'
      ],
      formula:'Supported cohort size is constrained by the minimum of qualified assignments, backfilled candidate capacity, and available coaching load over the release period.',assumptions:['All reported capacity values refer to the same planned intake period.','The bank can sequence cohorts rather than meet a fixed external certification deadline.'],estimatedMinutes:4,
      keywords:['resource development','coaching capacity','deployment pipeline','attrition','cohort gating'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 3 - Resource Planning and Resource Development',sourcePages:'41-51',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 3 - Deployment of Six Sigma Systems',section:'Resource Planning; Resource Development',pages:'41-51'}]
    },
    {
      qid:'mbb:set-2:original-054',set:2,batch:3,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'D. Improvement Methodologies',topic:'Evidence-based transition between DMAIC and DFSS'},
      difficulty:'Very Hard',cognitive:'Apply',questionType:'Integrated methodology-selection scenario',industry:'Healthcare technology',quantitative:false,
      stem:'A mature patient-scheduling platform misses a new accessibility CTQ. The current workflow also has chronic handoff defects, but engineering evidence suggests the existing architecture may be unable to meet the new CTQ at any practical operating setting. Which roadmap should govern the work?',
      options:[
        'Begin DMADV immediately and exclude current-process data because redesign work should not be constrained by defects in the legacy operating workflow, then establish new requirements without using legacy failure modes or customer evidence',
        'Use DMAIC to quantify and remove correctable process causes while defining an evidence gate that transitions the architectural gap to DMADV if the existing design cannot meet the CTQ',
        'Complete DMAIC through Control before discussing redesign because changing roadmaps at an interim gate invalidates the original charter and financial baseline, even if capability evidence demonstrates the architecture cannot satisfy the CTQ',
        'Run independent DMAIC and DMADV projects with separate CTQ definitions so each team can optimize its own technical scope without shared governance, and reconcile the requirements only after both teams recommend solutions'
      ],answer:1,
      why:'The organization has both an existing-process performance problem and a possible design-capability gap. DMAIC can establish what the current system can achieve after correctable causes are addressed; an explicit evidence gate prevents endless improvement of an architecture that cannot meet the new CTQ and supports transition to DMADV under common requirements and governance. <b>B. Use DMAIC to quantify and remove correctable process causes while defining an evidence gate that transitions the architectural gap to DMADV if the existing design cannot meet the CTQ</b> <span class="tb-source-ref">Source: Kubiak, Chapter 4, DMAIC and DFSS, pp. 54-63.</span>',
      optionRationales:[
        'Legacy data remain valuable for requirements, failure modes, and transition risk even when redesign becomes necessary.',
        'Correct. The roadmap separates correctable execution loss from a verified design limitation without fragmenting CTQs.',
        'A governed evidence gate can legitimately change the roadmap before resources are consumed by an incapable design.',
        'Different CTQ definitions would prevent a valid comparison and invite conflicting local optimization.'
      ],
      formula:null,assumptions:['The accessibility CTQ is valid and measurable.','No safety issue requires immediate retirement of the current platform.'],estimatedMinutes:3,
      keywords:['DMAIC','DMADV','DFSS','design capability','methodology transition'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 4 - DMAIC and DFSS',sourcePages:'54-63',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 4 - Six Sigma Methodologies',section:'DMAIC; DFSS',pages:'54-63'}]
    },
    {
      qid:'mbb:set-2:original-055',set:2,batch:3,sub:'mbb-enterprise',
      bok:{domain:'I. Enterprise-wide Planning',subdomain:'E. Opportunities for Improvement',topic:'Project qualification after creativity and innovation'},
      difficulty:'Hard',cognitive:'Understand',questionType:'Advanced conceptual governance question',industry:'Consumer products',quantitative:false,
      stem:'An innovation workshop produces 74 ideas and ranks them by participant enthusiasm. Leadership asks the Master Black Belt to move the top ten directly into Define. What qualification principle should be applied before those ideas enter the project pipeline?',
      options:[
        'Enthusiasm is sufficient if the facilitator used a structured creativity tool and every participant had an equal opportunity to vote',
        'Each idea should become a project because pipeline attrition will naturally remove weak ideas after teams begin collecting baseline data',
        'Screen each candidate for a verified problem or opportunity, strategic alignment, sponsor and customer relevance, measurable benefit, feasible scope, data access, and material risk',
        'Retain only ideas with an immediately calculable hard-dollar return because strategic, customer, regulatory, and capability benefits are too subjective for qualification'
      ],answer:2,
      why:'Creativity tools expand the solution or opportunity space; they do not qualify projects. Before work enters the pipeline, the organization needs evidence that the opportunity is real, aligned, measurable, sponsored, feasible, and worth its risk and resource demand. Early qualification prevents weak ideas from consuming scarce Belt and governance capacity. <b>C. Screen each candidate for a verified problem or opportunity, strategic alignment, sponsor and customer relevance, measurable benefit, feasible scope, data access, and material risk</b> <span class="tb-source-ref">Source: Kubiak, Chapter 5, Project Qualification and Creativity and Innovation Tools, pp. 73-87.</span>',
      optionRationales:[
        'A fair ideation process improves participation but does not establish business need, feasibility, or benefit.',
        'Launching weak projects transfers screening cost to Belts and overloads the deployment pipeline.',
        'Correct. These qualification dimensions distinguish promising ideas from executable improvement projects.',
        'Hard-dollar impact is important but does not exhaust legitimate strategic, compliance, customer, or capability value.'
      ],
      formula:null,assumptions:['The ideas are discretionary and have not yet been assigned resources.'],estimatedMinutes:2,
      keywords:['project qualification','innovation','pipeline screening','strategic alignment','feasibility'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 5 - Project Qualification and Creativity and Innovation Tools',sourcePages:'73-87',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 5 - Opportunities for Improvement',section:'Project Qualification; Creativity and Innovation Tools',pages:'73-87'}]
    },
    {
      qid:'mbb:set-2:original-056',set:2,batch:3,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'A. Organizational Design',topic:'Systems thinking, feedback, and unintended consequences'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Interactive time-series systems diagnosis',industry:'Healthcare contact center',quantitative:false,
      stem:'A hospital introduced an individual target to reduce average call time. Average call time fell from 9.2 to 6.5 minutes, but the plotted first-contact-resolution rate declined after a short delay. Staffing, call mix, and routing rules were unchanged. Which intervention best reflects systems thinking?',
      options:[
        'Suspend the local speed target, map the delayed feedback and work-transfer mechanisms, and redesign balanced measures around resolution, safety, demand, and total effort',
        'Keep the target because the intended measure improved, then coach agents to raise first-contact resolution without changing incentives or available call time and hold each agent accountable for meeting both targets simultaneously',
        'Increase the speed target further so agents gain enough aggregate capacity to return repeat calls immediately during periods of lower incoming demand',
        'Attribute the decline to individual resistance because unchanged staffing, call mix, and routing eliminate the operating system as a plausible source'
      ],answer:0,
      why:'The local target changed behavior and shifted work into repeat demand. The delay between faster handling and falling resolution is consistent with a feedback effect, not proof of agent resistance. Systems thinking requires examining boundaries, feedback, delays, and downstream consequences, then aligning measures with end-to-end performance. <b>A. Suspend the local speed target, map the delayed feedback and work-transfer mechanisms, and redesign balanced measures around resolution, safety, demand, and total effort</b> <span class="tb-source-ref">Source: Kubiak, Chapter 7, Systems Thinking, pp. 100-104.</span>',
      optionRationales:[
        'Correct. It treats the observed pattern as a system response and removes the incentive that may be generating failure demand.',
        'Coaching within the same conflicting target leaves the structural cause of the tradeoff unchanged.',
        'A stronger speed incentive is likely to amplify repeat demand and conceal total work rather than create capacity.',
        'Stable background conditions strengthen the case for examining the changed management rule and its feedback effects.'
      ],
      formula:null,assumptions:['The first-contact-resolution definition and measurement method remained stable.','The timing of the metric change is shown accurately.'],estimatedMinutes:3,
      keywords:['systems thinking','feedback loop','unintended consequences','local optimization','first-contact resolution'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 7 - Systems Thinking',sourcePages:'100-104',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 7 - Organizational Design',section:'Systems Thinking',pages:'100-104'}],
      chart:{type:'time-series',title:'First-contact resolution after speed target',xLabel:'Week after target launch',yLabel:'First-contact resolution (%)',units:'percent',decimals:0,labels:['W0','W1','W2','W3','W4','W5','W6','W7'],data:[82,82,80,76,71,66,61,58]},
      visual:visual3('mbb:set-2:original-056','time-series','A focusable weekly time-series plot shows first-contact resolution holding at 82 percent through week 1, then falling to 80, 76, 71, 66, 61, and 58 percent by week 7 after the call-speed target was launched.','Hover or keyboard-focus each weekly point to inspect the delayed deterioration after the local speed target.')
    },
    {
      qid:'mbb:set-2:original-057',set:2,batch:3,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'A. Organizational Design',topic:'Organizational maturity, culture, and change techniques'},
      difficulty:'Hard',cognitive:'Evaluate',questionType:'Change-strategy evaluation scenario',industry:'Mining and mineral processing',quantitative:false,
      stem:'A mining company plans one standardized Lean Six Sigma rollout for four sites. One site has stable daily management and trusted data; another has weak process ownership; a third has labor-relations tension; and the fourth recently changed leadership. What deployment approach should the Master Black Belt recommend?',
      options:[
        'Launch identical training, governance, targets, and timing at all sites so variation in implementation cannot be blamed for different business results, and compare adoption only after every site completes the same calendar milestones',
        'Begin only at the highest-maturity site and permanently exclude the other sites because weak readiness predicts an unacceptable probability of failure, using that site as the sole enterprise center of excellence and source of improvement resources',
        'Let every site define its own Belt roles, benefit rules, and tollgates so cultural autonomy is preserved during the adoption period without enterprise review',
        'Assess readiness by site, preserve common governance and benefit standards, and tailor sequencing, sponsorship, communication, and interventions to each local constraint'
      ],answer:3,
      why:'Organizational maturity and culture affect the sequence and support required for adoption. A common deployment architecture is still needed for role clarity, benefit integrity, and comparability, but local readiness evidence should determine pacing and intervention. Uniform timing ignores real system differences; unrestricted local designs fragment governance. <b>D. Assess readiness by site, preserve common governance and benefit standards, and tailor sequencing, sponsorship, communication, and interventions to each local constraint</b> <span class="tb-source-ref">Source: Kubiak, Chapters 7-8, Organizational Maturity, Culture, and Commitment, pp. 104-125.</span>',
      optionRationales:[
        'Identical implementation confuses standard governance with identical change conditions and can magnify site-specific barriers.',
        'A phased start may be appropriate, but permanent exclusion abandons capability-building without testing targeted interventions.',
        'Local adaptation should not redefine the controls required for enterprise accountability and comparable benefit validation.',
        'Correct. It combines enterprise standards with evidence-based adaptation to local maturity and cultural conditions.'
      ],
      formula:null,assumptions:['The company intends an enterprise deployment and can sequence site launches.'],estimatedMinutes:3,
      keywords:['organizational maturity','culture change','deployment readiness','site sequencing','standard governance'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 7-8 - Organizational Maturity, Culture, and Commitment',sourcePages:'104-125',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapters 7-8 - Organizational Design and Commitment',section:'Organizational Maturity and Culture; Cultural Change Techniques; Change Management',pages:'104-125'}]
    },
    {
      qid:'mbb:set-2:original-058',set:2,batch:3,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'B. Executive and Team Leadership Roles',topic:'Decision-oriented communication with management'},
      difficulty:'Very Hard',cognitive:'Apply',questionType:'Executive communication scenario',industry:'Government shared services',quantitative:false,
      stem:'An executive steering committee requests a single red-yellow-green status for a shared-services transformation. The program has a validated benefit range, a critical data-access dependency, and two recovery options with different schedule and risk consequences. How should the Master Black Belt structure the communication?',
      options:[
        'Select the most likely color and omit ranges and alternatives because executive communication should reduce uncertainty to one unambiguous conclusion, while retaining the assumptions and dependency evidence only in the working-team archive',
        'Lead with the decision required, show the status criteria, evidence range, assumptions, dependency, and consequences of each recovery option, then state the recommended action and owner',
        'Provide the complete analytical workbook without a recommendation so the committee can independently decide which assumptions and risk thresholds it prefers, then record its interpretation as the program baseline for subsequent reviews',
        'Report green while the expected benefit remains positive, and move schedule and dependency concerns to the appendix until either becomes an actual failure that requires a formal recovery decision'
      ],answer:1,
      why:'Management communication should be concise but must preserve decision-relevant uncertainty, criteria, dependencies, and consequences. A color without its basis can conceal material exposure, while a data dump transfers synthesis responsibility to the committee. The MBB should make the decision and ownership explicit and recommend a supportable response. <b>B. Lead with the decision required, show the status criteria, evidence range, assumptions, dependency, and consequences of each recovery option, then state the recommended action and owner</b> <span class="tb-source-ref">Source: Kubiak, Chapters 8 and 12, Communications with Management and Leadership for Deployment, pp. 119-123 and 183-195.</span>',
      optionRationales:[
        'Reducing the display to a color may hide uncertainty that materially changes the executive decision.',
        'Correct. It is concise, evidence-based, decision-oriented, and explicit about risk, action, and accountability.',
        'Executives need traceable evidence, but the MBB remains responsible for synthesis and a defensible recommendation.',
        'Expected benefit alone does not neutralize a critical dependency or a credible schedule risk.'
      ],
      formula:null,assumptions:['The committee has authority to choose among the recovery options.'],estimatedMinutes:3,
      keywords:['executive communication','decision framing','uncertainty','status criteria','recommended action'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 8 and 12 - Communications with Management and Leadership',sourcePages:'119-123, 183-195',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 8 - Organizational Commitment',section:'Communications with Management',pages:'119-123'},{id:'S2',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 12 - Executive and Team Leadership Roles',section:'Executive Leadership Roles; Leadership for Deployment',pages:'183-195'}]
    },
    {
      qid:'mbb:set-2:original-059',set:2,batch:3,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'A. Organizational Design',topic:'Organizational dynamics and intervention styles'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Organizational-dynamics intervention scenario',industry:'Aerospace engineering',quantitative:false,
      stem:'A functional vice president publicly endorses a reliability project but repeatedly delays access to engineering data because the proposed model may expose decisions made by the function. The Black Belt wants to escalate immediately to the chief operating officer. What should the Master Black Belt do first?',
      options:[
        'Approve immediate escalation and describe the vice president as resistant so the chief operating officer can enforce the published sponsorship commitment',
        'Remove the engineering data from scope and let the team use available production data, because formal authority should not be challenged during analysis',
        'Diagnose the interests, power, and perceived exposure behind the delay; use a collaborative intervention to agree safeguards, access, and decision rights, with a defined escalation path if unresolved',
        'Ask the Black Belt to negotiate privately without MBB involvement so the Belt develops political skill and the project retains independence from deployment leadership'
      ],answer:2,
      why:'The visible behavior suggests a conflict between public commitment and perceived functional risk. Before using formal escalation, the MBB should diagnose the organizational dynamics and select an intervention that surfaces interests, protects legitimate concerns, and clarifies access and decision rights. A pre-agreed escalation path preserves accountability if collaboration fails. <b>C. Diagnose the interests, power, and perceived exposure behind the delay; use a collaborative intervention to agree safeguards, access, and decision rights, with a defined escalation path if unresolved</b> <span class="tb-source-ref">Source: Kubiak, Chapter 11, Organizational Dynamics and Intervention Styles, pp. 157-176.</span>',
      optionRationales:[
        'Immediate labeling and escalation may harden defensiveness before the underlying interests and safeguards are understood.',
        'Removing necessary data protects hierarchy at the cost of analytical validity and does not resolve the conflict.',
        'Correct. It matches the intervention to the power and interest dynamics while retaining an accountable escalation route.',
        'Developing political skill matters, but the MBB should not leave a Belt unsupported in a senior-level access conflict.'
      ],
      formula:null,assumptions:['The requested data are necessary, lawful to use, and can be protected through appropriate controls.'],estimatedMinutes:3,
      keywords:['organizational dynamics','intervention style','power and interests','data access','escalation'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 11 - Organizational Dynamics and Intervention Styles',sourcePages:'157-176',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 11 - Internal Organizational Challenges',section:'Organizational Dynamics; Intervention Styles',pages:'157-176'}]
    },
    {
      qid:'mbb:set-2:original-060',set:2,batch:3,sub:'mbb-org',
      bok:{domain:'II. Organizational Competencies for Deployment',subdomain:'B. Executive and Team Leadership Roles',topic:'Governance roles and accountability for deployment'},
      difficulty:'Hard',cognitive:'Create',questionType:'Deployment-governance design',industry:'Municipal utilities',quantitative:false,
      stem:'A utility asks the Master Black Belt to design deployment accountability. In the current model, the MBB selects projects, approves benefits, removes political barriers, owns process controls after closure, and evaluates every sponsor. Which replacement most appropriately distributes leadership responsibilities?',
      options:[
        'Let the executive council own strategic priorities, champions own sponsorship and barrier removal, Finance validate benefits, process owners sustain controls, and the MBB govern methods, coaching, and portfolio evidence',
        'Retain all decisions with the MBB but create advisory committees for executives, champions, Finance, and process owners so technical consistency is not compromised',
        'Give project leaders full authority for selection, benefit validation, barrier removal, and sustainment because accountability is strongest when it is concentrated with the delivery team, and require the MBB to audit only the final reported outcome after closure',
        'Assign the executive council only to approve training budgets, while the MBB and Belts jointly own project outcomes and all post-project process performance now'
      ],answer:0,
      why:'A deployment system needs distinct but connected accountabilities. Executives set direction, champions sponsor and remove barriers, Finance protects benefit integrity, process owners own sustained performance, and the MBB provides technical leadership, coaching, standards, and portfolio evidence. Concentrating enterprise and operational ownership in the MBB weakens governance. <b>A. Let the executive council own strategic priorities, champions own sponsorship and barrier removal, Finance validate benefits, process owners sustain controls, and the MBB govern methods, coaching, and portfolio evidence</b> <span class="tb-source-ref">Source: Kubiak, Chapter 12, Executive Leadership Roles and Leadership for Deployment, pp. 183-195.</span>',
      optionRationales:[
        'Correct. It distributes authority to the roles that can legitimately make, validate, sponsor, and sustain each decision.',
        'Advisory participation does not correct the excessive concentration of decision rights in one technical role.',
        'Project teams cannot independently validate their own benefits or own enterprise barriers and post-project processes.',
        'Executives and process owners retain responsibilities that cannot be delegated permanently to the improvement organization.'
      ],
      formula:null,assumptions:['The named functions and roles exist and can be assigned formal decision rights.'],estimatedMinutes:3,
      keywords:['deployment governance','executive council','champion','process owner','MBB role'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 12 - Executive Leadership Roles and Leadership for Deployment',sourcePages:'183-195',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 12 - Executive and Team Leadership Roles',section:'Executive Leadership Roles; Leadership for Deployment',pages:'183-195'}]
    },
    {
      qid:'mbb:set-2:original-061',set:2,batch:3,sub:'mbb-portfolio',
      bok:{domain:'III. Project Management',subdomain:'A. Project Management Principles and Life Cycle',topic:'Risk-adjusted portfolio selection under capacity constraints'},
      difficulty:'Expert',cognitive:'Create',questionType:'Interactive portfolio optimization',industry:'Industrial manufacturing',quantitative:true,
      stem:'The portfolio has 12 Black-Belt-months available. Project R is mandatory and consumes 4 months. Select only data-ready projects, do not split projects, and maximize total risk-adjusted NPV. Which authorization package is optimal under the stated constraints?',
      options:[
        'Authorize R and C for 10 Black-Belt-months and $2.60 million risk-adjusted NPV, leaving two months for unplanned requests',
        'Authorize R, B, and D for 11 Black-Belt-months and $2.80 million risk-adjusted NPV, because three discretionary projects diversify execution risk',
        'Authorize R and A for nine Black-Belt-months and $2.20 million risk-adjusted NPV, reserving three months because no other project fits the capacity',
        'Authorize R, A, and D for all 12 Black-Belt-months and $3.10 million risk-adjusted NPV; hold C until its data-readiness gate is passed'
      ],answer:3,
      why:'After mandatory R consumes 4 months, 8 remain. Among ready projects, A plus D uses exactly 8 months and adds $2.70 million, so the full portfolio R+A+D uses 12 and returns $3.10 million. B+D uses 7 discretionary months and adds $2.40 million; C has a larger single value but is not data-ready. <b>D. Authorize R, A, and D for all 12 Black-Belt-months and $3.10 million risk-adjusted NPV; hold C until its data-readiness gate is passed</b> <span class="tb-source-ref">Source: Kubiak, Chapters 13 and 16, Project Prioritization and Financial Tools, pp. 196-202 and 225-232.</span>',
      optionRationales:[
        'C is explicitly blocked at the data-readiness gate, so its apparent portfolio value is not currently executable.',
        'R, B, and D are feasible, but their combined risk-adjusted NPV is lower than the feasible R, A, and D combination.',
        'D also fits with A, uses the remaining capacity exactly, and increases risk-adjusted NPV by $0.90 million.',
        'Correct. It satisfies the mandatory, readiness, indivisibility, and capacity constraints while maximizing stated value.'
      ],
      formula:'Capacity after R = 12 - 4 = 8 months; value(R+A+D) = 0.40 + 1.80 + 0.90 = $3.10 million.',assumptions:['Risk-adjusted NPVs are additive.','Projects are indivisible and no unlisted dependency exists.','Only projects marked ready may be authorized.'],estimatedMinutes:4,
      keywords:['portfolio optimization','capacity constraint','risk-adjusted NPV','project readiness','prioritization'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 13 and 16 - Project Prioritization and Financial Tools',sourcePages:'196-202, 225-232',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 13 - Project Execution',section:'Cross-Functional Project Assessment; Project Prioritization',pages:'196-202'},{id:'S2',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 16 - Project Financial Tools',section:'Budgets and Forecasts; Costing Concepts',pages:'225-232'}],
      chart:{type:'data-table',columns:['Project','BB-months','Risk-adjusted NPV','Mandatory','Data ready'],rows:[['R','4','$0.40M','Yes','Yes'],['A','5','$1.80M','No','Yes'],['B','4','$1.50M','No','Yes'],['C','6','$2.20M','No','No'],['D','3','$0.90M','No','Yes']],whatIf:{id:'mbb-q061-capacity',label:'Available capacity',min:8,max:16,step:1,value:12,unit:'BB-months',committed:4,committedLabel:'mandatory Project R'}},
      visual:visual3('mbb:set-2:original-061','data-table','A five-project portfolio table lists Black-Belt-month demand, risk-adjusted NPV, mandatory status, and data readiness. At the default 12-month capacity, mandatory Project R consumes four months and eight remain.','Move the capacity slider to determine how much discretionary capacity remains after mandatory Project R and compare feasible portfolios.')
    },
    {
      qid:'mbb:set-2:original-062',set:2,batch:3,sub:'mbb-portfolio',
      bok:{domain:'III. Project Management',subdomain:'B. Project Oversight and Management',topic:'Measurement, monitoring, and baseline integrity'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Project-control diagnosis scenario',industry:'Clinical research',quantitative:false,
      stem:'A clinical-data project reports that schedule variance returned to zero after the sponsor added three validation work packages and the project manager moved their planned dates into the next quarter. The additions were never approved through change control. What is the most defensible interpretation?',
      options:[
        'The project recovered because schedule variance is zero against the latest dates, and formal approval is unnecessary when the sponsor requested the work, provided the project manager preserves an informal record of the added packages for final closeout',
        'The reported recovery is not valid until performance is reconciled to the approved baseline and the added scope is separately authorized, time-phased, and incorporated through change control',
        'The project is necessarily late because any added work increases duration, even if the approved critical path and completion milestone remain unchanged, so the original schedule variance should be replaced with total added work-package duration',
        'Only the benefit forecast is affected because schedule measures may be rebased by the project manager whenever scope increases without additional budget, as long as the sponsor verbally confirms that the new work is strategically necessary'
      ],answer:1,
      why:'Variance has meaning only against an authorized baseline. Moving unapproved work into a later period can manufacture a zero schedule variance without recovering the original commitment. The team must preserve the original performance record, evaluate the scope decision, and establish a revised baseline only through authorized change control. <b>B. The reported recovery is not valid until performance is reconciled to the approved baseline and the added scope is separately authorized, time-phased, and incorporated through change control</b> <span class="tb-source-ref">Source: Kubiak, Chapter 14, Project Management Principles, Measurement, and Monitoring, pp. 202-218.</span>',
      optionRationales:[
        'Sponsor interest does not replace the approved change-control and baseline-governance process.',
        'Correct. It protects historical performance integrity while allowing authorized scope and baseline revision.',
        'Added work may or may not change the critical path, so lateness cannot be inferred without schedule analysis.',
        'Unauthorized rebasing affects schedule transparency and governance even when no immediate budget is added.'
      ],
      formula:null,assumptions:['The zero variance was calculated against the informally revised dates rather than the approved baseline.'],estimatedMinutes:3,
      keywords:['baseline integrity','change control','schedule variance','scope change','project monitoring'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 14 - Project Management Principles, Measurement, and Monitoring',sourcePages:'202-218',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 14 - Project Oversight and Management',section:'Project Management Principles; Measurement; Monitoring',pages:'202-218'}]
    },
    {
      qid:'mbb:set-2:original-063',set:2,batch:3,sub:'mbb-portfolio',
      bok:{domain:'III. Project Management',subdomain:'B. Project Oversight and Management',topic:'Corrective action and stakeholder response'},
      difficulty:'Hard',cognitive:'Apply',questionType:'Best-next-action project recovery scenario',industry:'Third-party logistics',quantitative:false,
      stem:'A warehouse-layout project will miss its pilot date because late carrier-interface requirements invalidated part of the design. No additional engineers are available, and shortening validation would increase customer risk. What should the Master Black Belt coach the project leader to do first?',
      options:[
        'Shorten validation and document the increased risk after launch because the approved date is the only project constraint visible to customers',
        'Remove the carrier-interface requirement from scope without sponsor approval so the original pilot date and earned-value baseline remain intact',
        'Contain immediate customer exposure, verify the root cause and critical-path impact, then present stakeholders with explicit scope, schedule, and risk recovery alternatives and a recommendation',
        'Accept the delay without further analysis because the lack of available engineers proves that no corrective action or stakeholder choice remains possible'
      ],answer:2,
      why:'Corrective action begins by containing the problem, understanding its cause and schedule effect, and developing feasible responses. When no option preserves every constraint, the project leader must make tradeoffs visible and obtain an informed stakeholder decision rather than silently reducing validation, scope, or accountability. <b>C. Contain immediate customer exposure, verify the root cause and critical-path impact, then present stakeholders with explicit scope, schedule, and risk recovery alternatives and a recommendation</b> <span class="tb-source-ref">Source: Kubiak, Chapter 14, Corrective Action, pp. 217-218.</span>',
      optionRationales:[
        'Reducing validation without an informed risk decision transfers schedule pressure into customer exposure.',
        'A project leader cannot silently remove an approved requirement to preserve a historical baseline.',
        'Correct. It follows containment and diagnosis with transparent, stakeholder-owned recovery tradeoffs.',
        'Resource scarcity limits options but does not eliminate analysis, containment, resequencing, or governance decisions.'
      ],
      formula:null,assumptions:['The interface requirement is valid and customer-relevant.','The pilot can be contained while stakeholders decide the recovery path.'],estimatedMinutes:3,
      keywords:['corrective action','containment','schedule recovery','stakeholder tradeoff','critical path'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 14 - Supply/Demand Management and Corrective Action',sourcePages:'217-218',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 14 - Project Oversight and Management',section:'Supply/Demand Management; Corrective Action',pages:'217-218'}]
    },
    {
      qid:'mbb:set-2:original-064',set:2,batch:3,sub:'mbb-portfolio',
      bok:{domain:'III. Project Management',subdomain:'D. Project Financial Tools',topic:'Hard-dollar NPV and separate treatment of cost avoidance'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Multi-step financial governance problem',industry:'Telecommunications',quantitative:true,
      stem:'A network-automation project requires $1.20 million now and is expected to produce $420,000 of validated annual bottom-line cash savings for four year-end periods. It also avoids an unbudgeted $250,000 future workload increase. At a 10% annual discount rate, the four-period annuity factor is 3.1699. Which benefit statement is most defensible?',
      options:[
        'Hard-dollar NPV is approximately positive $131,000; report the $250,000 cost avoidance separately and retain its assumptions rather than adding it automatically to cash flow',
        'Hard-dollar NPV is approximately negative $780,000 because only the first year of savings may be recognized before the process has demonstrated four years of control and Finance should defer every later cash flow until it is realized',
        'Total NPV is approximately positive $923,000 because both hard savings and unbudgeted cost avoidance are equivalent cash inflows at project authorization',
        'The project has zero NPV because validated annual savings should be treated as a reduction in the original investment rather than discounted operating cash flow'
      ],answer:0,
      why:'The present value of validated hard savings is $420,000(3.1699) = $1,331,358. Subtracting the $1.20 million investment gives an NPV of about $131,358. The unbudgeted workload is cost avoidance, not automatically a bottom-line cash flow, so it should be disclosed and governed separately. <b>A. Hard-dollar NPV is approximately positive $131,000; report the $250,000 cost avoidance separately and retain its assumptions rather than adding it automatically to cash flow</b> <span class="tb-source-ref">Source: Kubiak, Chapters 9 and 16, Project Cash Flow and Costing Concepts, pp. 141-143 and 225-232.</span>',
      optionRationales:[
        'Correct. It discounts the verified cash savings and preserves the hard-dollar versus cost-avoidance distinction.',
        'The supplied four-period cash-flow assumption should be evaluated, not arbitrarily reduced to one period.',
        'Unbudgeted workload avoidance is not automatically a realized cash inflow and should not be combined without evidence.',
        'Recurring savings are discounted future cash flows; they are not merely a nominal reduction of initial cost.'
      ],
      formula:'NPV = -$1,200,000 + $420,000(3.1699) = $131,358.',assumptions:['Savings occur at each year end for four years.','The 10% annuity factor is supplied and residual value is zero.','The $420,000 is independently validated bottom-line cash savings.'],estimatedMinutes:4,
      keywords:['net present value','hard-dollar savings','cost avoidance','annuity factor','benefit validation'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapters 9 and 16 - Project Cash Flow and Costing Concepts',sourcePages:'141-143, 225-232',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 9 - Organizational Finance and Business Performance Metrics',section:'Project Cash Flow',pages:'141-143'},{id:'S2',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 16 - Project Financial Tools',section:'Budgets and Forecasts; Costing Concepts',pages:'225-232'}]
    },
    {
      qid:'mbb:set-2:original-065',set:2,batch:3,sub:'mbb-training',
      bok:{domain:'IV. Training Design and Delivery',subdomain:'A. Training Needs Analysis',topic:'Role-specific needs analysis and nontraining causes'},
      difficulty:'Hard',cognitive:'Analyze',questionType:'Visual training-needs diagnosis',industry:'Food processing',quantitative:false,
      stem:'The deployment team collected the role-level evidence below. Leadership proposes mandatory advanced-DOE training for everyone because it supports next year\'s strategy. Which training-needs conclusion is most defensible?',
      options:[
        'Train every role in advanced DOE now because strategic relevance is sufficient even when a role has no frequent task, observed skill gap, or near-term application, then use course completion as the common readiness requirement for all four roles',
        'Train supervisors first on escalation coaching because high operational impact proves the observed gap is caused primarily by insufficient knowledge, and postpone operator and analyst development until the supervisory course changes escalation results',
        'Match training to verified job and task gaps, preserve targeted DOE development for analysts, and address incentive, ownership, or system causes with nontraining interventions',
        'Train only operators because daily task frequency should always outweigh strategic importance, business impact, and future capability requirements alone'
      ],answer:2,
      why:'A training needs analysis links strategy to actual job requirements, performance gaps, affected populations, frequency, and causes. Skill gaps can justify training; incentive, ownership, or system barriers require different interventions. Analysts may need targeted DOE capability for the approved strategy, but blanket training would not address the other evidence. <b>C. Match training to verified job and task gaps, preserve targeted DOE development for analysts, and address incentive, ownership, or system causes with nontraining interventions</b> <span class="tb-source-ref">Source: Kubiak, Chapter 17, Training Needs Analysis, pp. 236-244.</span>',
      optionRationales:[
        'Strategic relevance supports planned capability, but not identical content for roles without the task or application.',
        'High impact establishes priority, not whether the root cause is a knowledge or skill deficiency.',
        'Correct. It separates trainable gaps from organizational causes and aligns future training with role demand.',
        'Frequency is one input; risk, impact, strategic need, and causal evidence also shape the plan.'
      ],
      formula:null,assumptions:['The observations and causal assessments were validated with role incumbents and managers.'],estimatedMinutes:3,
      keywords:['training needs analysis','job-task analysis','nontraining cause','strategic capability','role segmentation'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 17 - Training Needs Analysis',sourcePages:'236-244',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 17 - Training Needs Analysis',section:'Defining the Job; Purposes and Types of Training; Analysis Tools and Techniques',pages:'236-244'}],
      chart:{type:'data-table',columns:['Role','Observed need','Task frequency','Impact','Likely primary cause'],rows:[['Operators','Interpret SPC signals','Daily','High','Skill gap'],['Supervisors','Escalate recurring signals','Weekly','High','Conflicting incentive'],['Analysts','Design multivariable experiments','Rare now; planned next year','High strategic','Capability gap'],['Process owners','Close control-plan actions','Monthly','High','Unclear ownership']]},
      visual:visual3('mbb:set-2:original-065','data-table','A role-level training-needs table shows an operator SPC skill gap, a supervisor escalation problem linked to conflicting incentives, an analyst future DOE capability gap, and a process-owner closure problem linked to unclear ownership.','')
    },
    {
      qid:'mbb:set-2:original-066',set:2,batch:3,sub:'mbb-training',
      bok:{domain:'IV. Training Design and Delivery',subdomain:'D. Training Program Evaluation',topic:'Mager learning objectives and multilevel evaluation'},
      difficulty:'Very Hard',cognitive:'Create',questionType:'Learning-objective and evaluation design',industry:'Engineering consulting',quantitative:false,
      stem:'A regression course uses the objective “participants will understand model assumptions” and evaluates success only with a satisfaction survey. Which redesign gives the strongest basis for judging competence and transfer?',
      options:[
        'Retain the objective, add a harder multiple-choice examination, and treat an average score above 80% as proof that workplace model selection has improved',
        'Change the objective to “know regression deeply,” add instructor observations, and compare participant satisfaction before and after the course and against attendance',
        'List all course topics as objectives, require perfect attendance, and use project savings as the sole measure because business impact subsumes learning',
        'Write observable performance, conditions, and criteria; align the assessment and later transfer and impact measures with stated attribution controls'
      ],answer:3,
      why:'Mager\'s principle requires observable performance, the conditions under which it occurs, and criteria for acceptable performance. Satisfaction measures reaction, not demonstrated competence or transfer. A strong evaluation aligns the learning assessment with the objective and extends to workplace application and business impact while addressing attribution. <b>D. Write observable performance, conditions, and criteria; align the assessment and later transfer and impact measures with stated attribution controls</b> <span class="tb-source-ref">Source: Kubiak, Chapter 20, Evaluation Models and Mager\'s Learning Objective Principle, pp. 285-292.</span>',
      optionRationales:[
        'A test can assess learning, but a score alone does not establish workplace application or a well-formed objective.',
        'Know is not directly observable, and satisfaction does not demonstrate diagnostic performance.',
        'Attendance and business results cannot by themselves locate learning, transfer, or competing causes.',
        'Correct. It creates an assessable objective and connects learning, application, impact, and attribution evidence.'
      ],
      formula:null,assumptions:['The organization can observe later project work and define a relevant business measure.'],estimatedMinutes:3,
      keywords:['Mager objective','performance conditions criteria','training evaluation','learning transfer','attribution'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 20 - Training Effectiveness Evaluation',sourcePages:'285-292',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 20 - Training Effectiveness Evaluation',section:'Validation and Evaluation Models; Mager\'s Learning Objective Principle; Isolating Training Effects',pages:'285-292'}]
    },
    {
      qid:'mbb:set-2:original-067',set:2,batch:3,sub:'mbb-coaching',
      bok:{domain:'V. Mentoring Responsibilities',subdomain:'A. Executives and Champions',topic:'Project sizing and dimensional scope'},
      difficulty:'Hard',cognitive:'Apply',questionType:'Coaching and project-scoping scenario',industry:'E-commerce retail',quantitative:false,
      stem:'A newly assigned Black Belt has a charter to “reduce product returns globally.” The team is floundering across products, markets, suppliers, and return reasons. How should the Master Black Belt coach the sponsor and Belt?',
      options:[
        'Select the return reason with the largest recent cost and prescribe its likely solution so the team can bypass additional scoping work',
        'Use Pareto and process evidence to bound the process, product, customer, geography, systems, and relationships; state what is out of scope and verify the boundary still permits root-cause discovery',
        'Keep the global scope because narrowing any dimension would prevent enterprise learning and make financial benefits too small for a Black Belt project',
        'Split the charter immediately into one project per country before checking whether return mechanisms, data definitions, and process ownership actually differ'
      ],answer:1,
      why:'The original charter is too broad to be executable. Project sizing should use evidence and explicit dimensions to define both in-scope and out-of-scope boundaries, while avoiding a boundary so narrow that plausible root causes are excluded. The MBB coaches the decision process rather than prescribing an untested solution. <b>B. Use Pareto and process evidence to bound the process, product, customer, geography, systems, and relationships; state what is out of scope and verify the boundary still permits root-cause discovery</b> <span class="tb-source-ref">Source: Kubiak, Chapter 21, Project Sizing, pp. 299-303.</span>',
      optionRationales:[
        'A costly category can guide scope, but prescribing a cause or solution before analysis biases the project.',
        'Correct. It uses the dimensional method and explicit exclusions without cutting off causal investigation.',
        'Enterprise relevance does not make an unbounded project executable within finite team resources.',
        'Country projects may be appropriate later, but an automatic split can duplicate work and hide common causes.'
      ],
      formula:null,assumptions:['The sponsor can revise the charter and no single return category is legally mandated.'],estimatedMinutes:3,
      keywords:['project sizing','dimensional scope','out of scope','coaching','Pareto'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 21 - Project Sizing',sourcePages:'299-303',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 21 - Mentoring Champions, Change Agents, and Executives',section:'Project Sizing',pages:'299-303'}]
    },
    {
      qid:'mbb:set-2:original-068',set:2,batch:3,sub:'mbb-coaching',
      bok:{domain:'V. Mentoring Responsibilities',subdomain:'B. Teams and Individuals',topic:'Technical reviews and failing-project diagnosis'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Technical-review coaching scenario',industry:'Specialty chemicals',quantitative:false,
      stem:'At an Analyze tollgate, a Black Belt reports p = 0.03 for a key predictor and asks to proceed. The residuals trend in run order, the measurement method changed halfway through data collection, and the presentation contains no data-provenance record. What should the Master Black Belt do?',
      options:[
        'Approve the tollgate because statistical significance at the agreed alpha level outweighs undocumented changes that have not been proven to bias the coefficient, and require the Belt to add a measurement-change footnote before the result is communicated to management',
        'Reject the project permanently because changing a measurement method makes every earlier observation unusable for any future analysis, regardless of calibration, overlap data, or stratification evidence',
        'Pause the causal conclusion, coach the Belt to reconcile provenance and measurement comparability, diagnose residual dependence and model assumptions, then return with evidence proportionate to the tollgate decision',
        'Replace the regression with a nonparametric test because rank-based methods automatically remove run-order dependence and all measurement-system discontinuities now'
      ],answer:2,
      why:'A p-value is conditional on the data and model being valid. The method change threatens comparability, missing provenance prevents traceability, and ordered residuals challenge independence. A technical review should identify these decision-critical gaps and coach a timely correction rather than approve unsupported causality or terminate without investigation. <b>C. Pause the causal conclusion, coach the Belt to reconcile provenance and measurement comparability, diagnose residual dependence and model assumptions, then return with evidence proportionate to the tollgate decision</b> <span class="tb-source-ref">Source: Kubiak, Chapter 22, Technical Reviews and Team Facilitation, pp. 309-314.</span>',
      optionRationales:[
        'Statistical significance does not repair invalid measurement comparability, dependence, or missing traceability.',
        'The observations may be reconciled, stratified, recalibrated, or partially reused after an evidence-based review.',
        'Correct. It protects the decision while using the review as focused technical coaching rather than punishment.',
        'Nonparametric methods do not automatically correct temporal dependence or a discontinuous measurement system.'
      ],
      formula:null,assumptions:['The tollgate decision can be paused without creating an immediate safety risk.'],estimatedMinutes:3,
      keywords:['technical review','measurement comparability','residual dependence','data provenance','coaching'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 22 - Technical Reviews and Team Facilitation',sourcePages:'309-314',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 22 - Mentoring Black Belts and Green Belts',section:'Technical Reviews; Team Facilitation and Meeting Management',pages:'309-314'}]
    },
    {
      qid:'mbb:set-2:original-069',set:2,batch:3,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. Measurement Systems Analysis',topic:'ANOVA gage R&R variance components'},
      difficulty:'Expert',cognitive:'Analyze',questionType:'Visual multi-step quantitative MSA interpretation',industry:'Precision machining',quantitative:true,
      stem:'An ANOVA gage R&R study reports the estimated standard-deviation components below. Include the part-by-appraiser interaction in measurement-system variation. Using % study variation = 100(GR&R SD / total study SD), which conclusion is correct?',
      options:[
        'GR&R SD is about 1.414 micrometers and % study variation is about 30.0%, placing the system at the upper edge of the marginal range and requiring context-specific improvement judgment',
        'GR&R SD is 2.400 micrometers and % study variation is 53.3%, because repeatability, appraiser, and interaction standard deviations must be added directly before the result is divided by part-to-part standard deviation',
        'GR&R SD is 1.000 micrometer and % study variation is 22.2%, because the part-by-appraiser interaction belongs entirely to part-to-part variation',
        'GR&R SD is about 1.414 micrometers and % study variation is 31.4%, because the denominator for study variation is the part-to-part standard deviation alone and interaction has already been included in the numerator'
      ],answer:0,
      why:'Independent variance components combine by adding variances, not standard deviations. GR&R variance = 0.8² + 0.6² + 1.0² = 2.00, so GR&R SD = 1.414. Total variance = 2.00 + 4.5² = 22.25, so total SD = 4.717 and % study variation = 100(1.414/4.717) = 29.98%. <b>A. GR&R SD is about 1.414 micrometers and % study variation is about 30.0%, placing the system at the upper edge of the marginal range and requiring context-specific improvement judgment</b> <span class="tb-source-ref">Source: Kubiak, Chapter 24, Variables Measurement Systems and ANOVA Method, pp. 335-346.</span>',
      optionRationales:[
        'Correct. It combines variance components correctly and applies the handbook\'s inclusive 10% to 30% marginal guideline with context.',
        'Standard deviations cannot be added directly when the independent components are combined into total variance.',
        'The specified part-by-appraiser interaction is measurement-system variation and cannot be discarded from GR&R.',
        'The total-study denominator includes measurement and part-to-part variation, not part variation alone.'
      ],
      formula:'GR&R SD = sqrt(0.8^2 + 0.6^2 + 1.0^2) = 1.414; total SD = sqrt(1.414^2 + 4.5^2) = 4.717; %GR&R = 29.98%.',assumptions:['Reported components are independent variance components from an adequate random-effects ANOVA model.','The interaction is retained as specified and values share micrometer units.'],estimatedMinutes:4,
      keywords:['gage R&R','variance components','repeatability','reproducibility','percent study variation'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 24 - Variables Measurement Systems and ANOVA Method',sourcePages:'335-346',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 24 - Measurement Systems Analysis',section:'Variables Measurement Systems; ANOVA Method',pages:'335-346'}],
      chart:{type:'data-table',columns:['Variance source','Estimated SD (micrometers)','Treatment in study'],rows:[['Repeatability','0.800','GR&R'],['Appraiser','0.600','GR&R'],['Part x appraiser','1.000','GR&R'],['Part to part','4.500','Total study only']]},
      visual:visual3('mbb:set-2:original-069','data-table','A variance-component table lists standard deviations of 0.800 micrometers for repeatability, 0.600 for appraiser, 1.000 for part-by-appraiser interaction, and 4.500 for part-to-part variation.','')
    },
    {
      qid:'mbb:set-2:original-070',set:2,batch:3,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. Measurement Systems Analysis',topic:'Process capability for nonnormal data'},
      difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Capability histogram and fitted-distribution interpretation',industry:'Healthcare revenue cycle',quantitative:true,
      stem:'A stable billing cycle-time process has a one-sided USL of 8 days. Normality is rejected (p < 0.005), while a Weibull probability plot is acceptable (p = 0.42) with shape 1.4 and scale 4.0 days. For R(t) = exp[-(t/scale)^shape], which capability conclusion is defensible?',
      options:[
        'Use a normal Cpk because the sample size of 200 makes the normal model valid; the histogram shape affects only confidence intervals, not estimated nonconformance',
        'Apply a Box-Cox transformation without checking its fit, calculate normal indices, and interpret the transformed specification limit directly in original-day units',
        'Use the observed 14 cycles above the USL as the exact long-term defect probability, because a fitted distribution adds avoidable model uncertainty and the empirical percentage is distribution-free',
        'Using the verified Weibull model, estimate P(T > 8) = exp[-(8/4)^1.4] about 0.071; report roughly 7.1% above the USL with model-fit and stability qualifications'
      ],answer:3,
      why:'The normal model is contradicted, while the supplied Weibull fit is acceptable. For a Weibull survival function, P(T>8)=exp[-(8/4)^1.4]=exp(-2.639)=0.0714, or about 7.1%. The empirical 14/200 is similar but is not an exact long-term probability. <b>D. Using the verified Weibull model, estimate P(T > 8) = exp[-(8/4)^1.4] about 0.071; report roughly 7.1% above the USL with model-fit and stability qualifications</b> <span class="tb-source-ref">Source: Kubiak, Chapter 24, Process Capability for Nonnormal Data, pp. 347-352.</span>',
      optionRationales:[
        'Large samples improve estimation but do not make a demonstrably nonnormal population normal for capability modeling.',
        'A transformation must be selected and validated, and specifications must be transformed consistently before interpretation.',
        'The empirical fraction is a sample estimate with uncertainty, not an exact long-term process probability.',
        'Correct. It uses the supported nonnormal model and retains the stability and goodness-of-fit conditions.'
      ],
      formula:'P(T > 8) = exp[-(8/4)^1.4] = exp(-2.6390) = 0.0714.',assumptions:['The process is stable and the 200 observations are representative and independent.','The two-parameter Weibull model and its supplied parameter estimates are adequate.','Cycle time is measured in positive days and the USL is 8 days.'],estimatedMinutes:4,
      keywords:['nonnormal capability','Weibull','upper specification limit','tail probability','goodness of fit'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 24 - Process Capability for Nonnormal Data',sourcePages:'347-352',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 24 - Measurement Systems Analysis',section:'Process Capability for Nonnormal Data',pages:'347-352'}],
      chart:{type:'histogram',title:'Billing cycle-time distribution',xLabel:'Cycle time (days)',yLabel:'Invoices',binEdges:[0,1,2,3,4,5,6,7,8,9,10],counts:[24,32,34,28,23,18,14,13,8,6],referenceValue:8,referenceLabel:'USL = 8 days'},
      visual:visual3('mbb:set-2:original-070','histogram','A right-skewed histogram of 200 billing cycle times uses ten one-day bins from 0 to 10 days. Counts are 24, 32, 34, 28, 23, 18, 14, 13, 8, and 6. A vertical reference line marks the USL at 8 days; 14 observations lie above it.','')
    },
    {
      qid:'mbb:set-2:original-071',set:2,batch:3,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Residual autocorrelation and ARIMA model adequacy'},
      difficulty:'Expert',cognitive:'Analyze',questionType:'Interactive autocorrelation diagnostic',industry:'Energy demand forecasting',quantitative:false,
      stem:'After fitting a trend-and-seasonality model to 100 equally spaced demand observations, the analyst plots the residual ACF shown below. The approximate 95% bounds are plus or minus 0.196. Which review conclusion should the Master Black Belt make?',
      options:[
        'The residuals are independent because all autocorrelations decay toward zero, so the current forecast intervals and coefficient tests require no revision',
        'Residual autocorrelation remains significant at the early lags; revisit the time-series structure, fit an appropriate autoregressive component, and require white-noise residual checks before release',
        'The residuals show only seasonality because the largest bar occurs at lag 1, so add a seasonal difference of 12 without examining the original series or residual pattern',
        'Replace the time-series model with ordinary multiple regression because regression coefficients are unbiased whenever the response has equally spaced observations'
      ],answer:1,
      why:'Residual autocorrelations at lags 1 and 2, and marginally lag 3, exceed the approximate bounds and decay in an autoregressive pattern. Residuals are therefore not white noise, so inferential precision and forecast intervals from the current model are not yet defensible. The time-series structure should be revised and rechecked. <b>B. Residual autocorrelation remains significant at the early lags; revisit the time-series structure, fit an appropriate autoregressive component, and require white-noise residual checks before release</b> <span class="tb-source-ref">Source: Kubiak, Chapter 25, Autocorrelation and Forecasting, pp. 353-369.</span>',
      optionRationales:[
        'Decay does not establish independence when bars exceed the significance bounds at multiple lags.',
        'Correct. It recognizes an autoregressive residual pattern and requires model adequacy before operational release.',
        'A lag-1 maximum is not evidence of a 12-period seasonal effect, and seasonal differencing cannot be selected from this claim.',
        'Equally spaced observations do not remove serial correlation or make ordinary-regression errors independent.'
      ],
      formula:'Approximate ACF bound = plus or minus 1.96/sqrt(100) = plus or minus 0.196.',assumptions:['Residuals correspond to the fitted model and are ordered at equal intervals.','The approximate bounds are appropriate for this diagnostic screen.'],estimatedMinutes:4,
      keywords:['autocorrelation function','ARIMA','white noise','residual diagnostics','forecast adequacy'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 25 - Autocorrelation and Forecasting',sourcePages:'353-369',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25 - Measuring and Modeling Relationships Between Variables',section:'Autocorrelation and Forecasting',pages:'353-369'}],
      chart:{type:'acf-plot',title:'Residual autocorrelation function',xLabel:'Lag',yLabel:'Autocorrelation',lags:[1,2,3,4,5,6,7,8,9,10],values:[0.61,0.37,0.20,0.08,-0.02,-0.09,-0.06,0.04,0.01,-0.03],confidence:0.196},
      visual:visual3('mbb:set-2:original-071','acf-plot','A residual autocorrelation plot for lags 1 through 10 has 95 percent reference bounds at plus and minus 0.196. The first three bars are 0.61, 0.37, and 0.20; later bars range from negative 0.09 to positive 0.08.','Hover or keyboard-focus each lag bar to compare its autocorrelation with the stated 95 percent bounds.')
    },
    {
      qid:'mbb:set-2:original-072',set:2,batch:3,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'GLM interaction and conditional effects'},
      difficulty:'Very Hard',cognitive:'Analyze',questionType:'Interaction-plot and GLM interpretation',industry:'Customer-service training',quantitative:false,
      stem:'A GLM evaluates two training methods under low and high workload. Adjusted mean first-contact-resolution percentages are plotted. The method main effect has p = 0.08, workload has p < 0.001, and method-by-workload interaction has p = 0.004. What should the Master Black Belt conclude?',
      options:[
        'Training method has no operational relevance because its averaged main-effect p-value exceeds 0.05, so only workload should appear in the final interpretation and both methods should be deployed interchangeably across workload conditions',
        'Method B is universally superior because it has a similar adjusted mean under low workload and therefore provides equivalent performance with greater flexibility',
        'The interaction makes method effectiveness conditional: results are similar at low workload, but Method B deteriorates sharply at high workload; use simple effects and operating conditions',
        'The lines demonstrate nonconstant residual variance, so the GLM must be discarded immediately before any factor or interaction can be interpreted'
      ],answer:2,
      why:'The nonparallel means correspond to a significant interaction: Method A changes from 62% to 58%, while Method B changes from 60% to 42% as workload increases. Because the method difference depends strongly on workload, the averaged method main effect is not the appropriate standalone decision summary. <b>C. The interaction makes method effectiveness conditional: results are similar at low workload, but Method B deteriorates sharply at high workload; use simple effects and operating conditions</b> <span class="tb-source-ref">Source: Kubiak, Chapter 25, General Linear Models and Assumptions Testing, pp. 399-402.</span>',
      optionRationales:[
        'A nonsignificant averaged main effect can conceal important conditional differences when the interaction is significant.',
        'The high-workload result contradicts a universal-superiority claim and is central to operational deployment.',
        'Correct. It interprets the interaction before the marginal main effect and connects it to operating conditions.',
        'An interaction plot of adjusted means does not diagnose residual variance; residual diagnostics are separate evidence.'
      ],
      formula:null,assumptions:['The GLM residual assumptions and adjusted-mean estimates are otherwise adequate.','Higher first-contact resolution is desirable.'],estimatedMinutes:3,
      keywords:['general linear model','interaction effect','simple effects','adjusted means','conditional interpretation'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 25 - General Linear Models',sourcePages:'399-402',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25 - Measuring and Modeling Relationships Between Variables',section:'General Linear Models; Testing the Assumptions',pages:'399-402'}],
      chart:{type:'two-level-interaction',factorA:'Workload',factorB:'Training method',xLowLabel:'Low workload',xHighLabel:'High workload',yLabel:'First-contact resolution (%)',yDomain:[40,65],yTicks:[40,45,50,55,60,65],lowLabel:'Method A',highLabel:'Method B',lowLine:[62,58],highLine:[60,42]},
      visual:visual3('mbb:set-2:original-072','two-level-interaction','An interaction plot shows workload on the horizontal axis and first-contact-resolution percentage on the vertical axis. Method A changes from 62 percent at low workload to 58 percent at high workload; Method B changes from 60 percent to 42 percent.','')
    },
    {
      qid:'mbb:set-2:original-073',set:2,batch:3,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Monte Carlo simulation verification and risk interpretation'},
      difficulty:'Expert',cognitive:'Evaluate',questionType:'Simulation-output and risk-distribution interpretation',industry:'Semiconductor capital investment',quantitative:true,
      stem:'A verified Monte Carlo model produced the 2,000 simulated project NPVs shown below, in millions of dollars. The approval policy requires an estimated probability of negative NPV no greater than 10%. What recommendation is supported by this simulation output?',
      options:[
        'Do not approve under current policy: 310 of 2,000 trials are below zero (15.5%), above the 10% limit; mitigate key risks and rerun the verified model',
        'Approve because the binned mean is approximately $1.235 million and a positive expected NPV overrides any tail-risk criterion based on fewer than half the trials',
        'Approve because 84.5% of trials are nonnegative, which exceeds a simple majority and therefore satisfies the 10% negative-outcome policy while preserving a positive portfolio success rate',
        'Reject the model because any negative trial proves the input distributions are infeasible and invalidates the simulation for this decision'
      ],answer:0,
      why:'The four bins below zero contain 20+35+80+175 = 310 trials. Dividing by 2,000 gives 0.155, or 15.5%, which exceeds the stated 10% limit even though the midpoint-weighted mean is positive. The correct response is to examine sensitivity and mitigation, then rerun the already verified model with justified changes. <b>A. Do not approve under current policy: 310 of 2,000 trials are below zero (15.5%), above the 10% limit; mitigate key risks and rerun the verified model</b> <span class="tb-source-ref">Source: Kubiak, Chapter 25, Simulation, pp. 414-416.</span>',
      optionRationales:[
        'Correct. It applies the explicit tail-risk policy and uses simulation to guide targeted risk reduction.',
        'A positive mean and a tail-probability constraint answer different governance questions; both must be respected.',
        'A 15.5% negative rate exceeds, rather than satisfies, the maximum 10% loss-probability policy.',
        'Negative outcomes can be legitimate consequences of uncertain feasible inputs and do not alone invalidate a model.'
      ],
      formula:'Estimated P(NPV < 0) = (20 + 35 + 80 + 175) / 2000 = 310 / 2000 = 15.5%.',assumptions:['The simulation model has been verified and validated for the decision context.','Trials are independent draws from the approved input distributions.','Bin endpoints at zero place zero and positive values in the nonnegative bin.'],estimatedMinutes:4,
      keywords:['Monte Carlo simulation','tail risk','negative NPV','model verification','sensitivity analysis'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 25 - Simulation',sourcePages:'414-416',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 25 - Measuring and Modeling Relationships Between Variables',section:'Simulation',pages:'414-416'}],
      chart:{type:'histogram',title:'Simulated project NPV',xLabel:'NPV ($ millions)',yLabel:'Simulation trials',binEdges:[-2,-1.5,-1,-0.5,0,0.5,1,1.5,2,2.5,3,3.5,4],counts:[20,35,80,175,240,300,320,290,230,170,100,40],referenceValue:0,referenceLabel:'NPV = $0'},
      visual:visual3('mbb:set-2:original-073','histogram','A histogram of 2,000 simulated project NPVs uses half-million-dollar bins from negative 2 million to positive 4 million. The four negative bins contain 20, 35, 80, and 175 trials, totaling 310. A vertical line marks zero NPV.','')
    },
    {
      qid:'mbb:set-2:original-074',set:2,batch:3,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'C. Design of Experiments',topic:'Balanced incomplete block design recognition'},
      difficulty:'Very Hard',cognitive:'Understand',questionType:'DOE design-matrix recognition',industry:'Biopharmaceutical development',quantitative:false,
      stem:'A laboratory must compare four formulations, but each raw-material lot can support only three formulations. The proposed incidence matrix shows which formulation is tested in each lot. Which description of the design is correct?',
      options:[
        'It is a randomized complete block design because every formulation appears somewhere in every set of four lots, even though each individual lot omits one formulation and has insufficient material for the complete treatment set',
        'It is a Latin square because each formulation occurs three times and the omitted cells serve as a second orthogonal blocking factor, with lots acting as rows and the remaining incidence positions acting as columns',
        'It is an unbalanced incomplete block design because no block contains all four formulations and therefore pairwise balance is impossible, even when every treatment and treatment pair has equal replication across the complete experiment',
        'It is a balanced incomplete block design: each lot contains three formulations, each formulation occurs in three lots, and every formulation pair occurs together twice'
      ],answer:3,
      why:'Every block is incomplete because lot capacity k=3 is smaller than v=4 treatments. The design is balanced: each treatment appears r=3 times, and each of the six treatment pairs appears together in exactly lambda=2 blocks. This permits treatment comparisons despite the physical block limit. <b>D. It is a balanced incomplete block design: each lot contains three formulations, each formulation occurs in three lots, and every formulation pair occurs together twice</b> <span class="tb-source-ref">Source: Kubiak, Chapter 26, Complex Blocking Structures and BIBD, pp. 434-438.</span>',
      optionRationales:[
        'A complete block must contain every treatment within each block; each lot here omits one formulation.',
        'A Latin square requires two blocking dimensions with each treatment appearing once per row and column.',
        'Incomplete blocks can be pairwise balanced, as the equal pair concurrence in this matrix demonstrates.',
        'Correct. The incidence counts satisfy v=4, b=4, k=3, r=3, and lambda=2.'
      ],
      formula:'BIBD checks: bk = vr = 4(3) = 4(3) = 12; lambda(v-1) = r(k-1) = 2(3) = 3(2) = 6.',assumptions:['Lot is the nuisance block and formulation is the treatment factor.','Run order is randomized within each lot.','Treatment-by-lot interaction is negligible for the intended model.'],estimatedMinutes:4,
      keywords:['balanced incomplete block design','BIBD','blocking','treatment concurrence','DOE matrix'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 26 - Complex Blocking Structures',sourcePages:'434-438',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 26 - Design of Experiments',section:'Complex Blocking Structures; Balanced Incomplete Block Design',pages:'434-438'}],
      chart:{type:'data-table',columns:['Formulation','Lot 1','Lot 2','Lot 3','Lot 4','Replications'],rows:[['A','Test','Test','-','Test','3'],['B','-','Test','Test','Test','3'],['C','Test','Test','Test','-','3'],['D','Test','-','Test','Test','3']]},
      visual:visual3('mbb:set-2:original-074','data-table','A four-by-four treatment incidence matrix shows Formulation A in Lots 1, 2, and 4; B in Lots 2, 3, and 4; C in Lots 1, 2, and 3; and D in Lots 1, 3, and 4. Each formulation appears three times and each pair appears together twice.','')
    },
    {
      qid:'mbb:set-2:original-075',set:2,batch:3,sub:'mbb-analytics',
      bok:{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'D. Automated Process Control and Statistical Process Control',topic:'Closed-loop feedback-system integrity'},
      difficulty:'Hard',cognitive:'Apply',questionType:'Automated-control system diagnosis',industry:'Pulp and paper processing',quantitative:false,
      stem:'A moisture controller measures sheet moisture at a sensor upstream of the steam valve it manipulates. The controller calculates an error and moves the valve correctly, but that valve cannot affect the upstream measurement. Operators keep retuning the controller to eliminate oscillation. What should the Master Black Belt recommend first?',
      options:[
        'Increase controller gain until the upstream sensor responds, because a sufficiently strong manipulated-variable change will always close a feedback loop even when the measurement is physically upstream of the final control element',
        'Correct the control architecture so the manipulated steam variable can affect the measured downstream moisture, verify sensor and actuator dynamics, then tune and monitor the closed loop',
        'Replace the moisture sensor with an attribute pass-fail inspection because feedback control is inappropriate whenever the process has transport delay and an attribute decision removes the need to characterize dynamic response',
        'Keep the architecture and add SPC limits to the upstream signal, because statistical limits make the measurement responsive to downstream valve changes'
      ],answer:1,
      why:'A closed feedback loop requires measurement, decision, and action in a causal path where the action returns to affect the next measurement. Here the sensor is upstream of the manipulated valve, so retuning cannot repair the broken loop and may amplify oscillation. The architecture and dynamics must be corrected before tuning or SPC interpretation. <b>B. Correct the control architecture so the manipulated steam variable can affect the measured downstream moisture, verify sensor and actuator dynamics, then tune and monitor the closed loop</b> <span class="tb-source-ref">Source: Kubiak, Chapter 27, Basic Control Systems, pp. 451-453.</span>',
      optionRationales:[
        'Controller gain cannot create a missing causal path from the final control element back to the sensor.',
        'Correct. It restores the required measurement-decision-action feedback relationship before optimization.',
        'Transport delay complicates tuning but does not require replacing a valid continuous measurement with attributes.',
        'SPC limits can monitor data but cannot make an upstream measurement respond to a downstream action.'
      ],
      formula:null,assumptions:['The valve is the intended final control element and the sensor location is described correctly.'],estimatedMinutes:3,
      keywords:['automated process control','closed-loop feedback','sensor location','final control element','controller tuning'],
      sourceDocument:'The Certified Six Sigma Master Black Belt Handbook',sourceSection:'Chapter 27 - Basic Control Systems',sourcePages:'451-453',
      sources:[{id:'S1',document:'The Certified Six Sigma Master Black Belt Handbook',chapter:'Chapter 27 - Automated Process Control and Statistical Process Control',section:'Terminology; Advantages of APC; Basic Control Systems',pages:'451-453'}]
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
    q5(101,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'B. Strategic Plan Alignment',topic:'X-matrix deployment traceability'},'Very Hard','Analyze','Visual evidence interpretation, non-statistical','Cross-industry enterprise/deployment case',
      'The deployment matrix shows one annual objective, three improvement priorities, and their measures. Which defect must be corrected before leadership treats the matrix as an executable strategy?',
      ['The customer-retention objective has no strong relationship to P3 even though P3 owns the only retention measure','Priority P1 has too many owners, so all but one owner must be removed before any work begins','Priority P2 uses a leading measure rather than a lagging financial result and therefore cannot support strategy','The matrix has fewer annual objectives than priorities, which makes catchball mathematically invalid'],0,
      'An X matrix should preserve a visible line of sight from strategic objective through priorities, measures, and accountability. Here retention is measured only under P3, yet the relationship cell linking P3 to the retention objective is blank. That broken causal trace makes ownership and review incoherent. The other structural features can be legitimate when responsibilities and causal logic are explicit.',
      ['Correct. The missing relationship breaks the strategy-to-measure accountability chain.','Multiple contributors can be appropriate when one accountable owner and interfaces are clear.','Leading measures are useful when paired with outcomes and supported by causal reasoning.','X matrices do not require equal counts of objectives, priorities, or measures.'],'Chapter 1 - Strategic Plan Development','7-17',
      {chart:{type:'data-table',columns:['Priority','Retention objective','Primary owner','Measure'],rows:[['P1: reduce onboarding delay','Strong','Operations','Median activation days'],['P2: prevent early service failures','Strong','Quality','30-day failure rate'],['P3: recover at-risk accounts','Blank','Customer success','90-day retention']]},altText:'A deployment matrix lists three priorities. P1 and P2 have strong links to the retention objective. P3 owns the only 90-day retention measure but its relationship to the retention objective is blank.',keywords:['X matrix','strategic alignment','line of sight','ownership','catchball']}),

    q5(102,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'A. Strategic Plan Development',topic:'Scenario planning and strategic assumptions'},'Hard','Evaluate','Leadership, deployment, and best-next-action scenario','Supply chain, logistics, and distribution',
      'A distribution company selected automation projects using a forecast of stable order mix. Two months later, regulation may sharply increase low-volume hazardous shipments. What should the Master Black Belt recommend at the strategy review?',
      ['Cancel automation because a changed external assumption invalidates every project selected under the original plan','Revisit the scenario assumptions, test portfolio sensitivity, and preserve options until the regulatory path is clearer','Keep the approved portfolio unchanged until annual planning because frequent review undermines strategic discipline','Add hazardous-shipment volume to every project charter without changing priorities, capacity, or benefit forecasts'],1,
      'Strategic planning is an evidence-driven cycle, not a once-a-year lock. A material external uncertainty should trigger scenario and sensitivity review of the portfolio while avoiding premature cancellation. Preserving options and explicit decision triggers protects value under uncertainty. Blindly retaining, cancelling, or relabeling projects fails to connect environmental change to resource allocation.',
      ['Immediate cancellation discards potentially robust projects before sensitivity is assessed.','Correct. It updates assumptions and stages commitments around a consequential uncertainty.','Governance discipline includes defined reassessment when material assumptions change.','Changing charter language alone does not update economics, dependencies, or capacity.'],'Chapter 1 - Strategic Plan Development','2-17',
      {keywords:['scenario planning','environmental scan','portfolio sensitivity','strategic assumptions','real options']}),

    q5(103,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'C. Infrastructure Elements of Improvement Systems',topic:'Governance escalation and decision rights'},'Expert','Create','Leadership, deployment, and best-next-action scenario','Finance and insurance',
      'A global insurer has a common tollgate standard, but regional champions repeatedly approve benefit baselines that Finance later rejects. Reviews now occur after implementation. Which governance redesign is strongest?',
      ['Give Finance unilateral authority to select projects and direct Belt methods so benefit disputes disappear','Let regions retain their definitions but convert every benefit to a common currency during annual reporting','Add a pre-charter Finance validation gate, publish benefit decision rights, and audit exceptions through the deployment council','Require Black Belts to obtain sponsor signatures on calculations and treat the signed charter as final evidence'],2,
      'The failure occurs because baseline definitions and decision rights are not controlled at the point of commitment. A pre-charter validation gate prevents invalid economics from entering the pipeline; published authority clarifies accountability; exception audits enable organizational learning. Finance should validate financial logic without owning technical selection or methods, and signatures do not substitute for controlled definitions.',
      ['Finance validation is essential, but unilateral control of project selection and technical work is excessive.','Currency conversion cannot reconcile inconsistent baseline, attribution, and realization definitions.','Correct. It moves control upstream and makes authority and exceptions transparent.','A signed calculation can still be conceptually wrong or based on an uncontrolled definition.'],'Chapter 3 - Deployment of Six Sigma Systems','28-52',
      {keywords:['governance','benefit validation','decision rights','tollgate','deployment council']}),

    q5(104,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'D. Improvement Methodologies',topic:'Method selection under unstable demand'},'Very Hard','Apply','Advanced conceptual/method-selection','Healthcare',
      'An emergency department has unstable arrival patterns, long diagnostic queues, and a known staffing constraint. Leaders want either a pure Lean event or a six-month DMAIC project. Which architecture is most defensible?',
      ['Launch DMADV because any unstable process must be redesigned rather than improved, regardless of existing flow knowledge','Choose the Lean event only because queue time is always waste and statistical modeling delays improvement','Choose DMAIC only and prohibit operational experiments until every source of common-cause variation is quantified','Run a rapid flow-stabilization effort around the verified constraint while a DMAIC workstream models arrival, service, and diagnostic variation'],3,
      'The problem contains both an immediate flow constraint and uncertain variation mechanisms. A coordinated architecture can protect patients and relieve obvious flow barriers while DMAIC establishes valid measures, models demand and service distributions, and tests deeper causes. A single-method rule ignores the different decisions, and instability alone does not prove that no improvable process exists.',
      ['DMADV is appropriate for a new design need, not automatically for every unstable process.','A short event alone may optimize locally and mistake demand variation for removable waste.','Analysis is necessary, but forbidding safe staged improvement delays learning and relief.','Correct. This integrated approach addresses the known constraint while preserving analytical discipline.'],'Chapter 4 - Six Sigma Methodologies','53-69',
      {keywords:['DMAIC','Lean','theory of constraints','queue variation','method integration']}),

    q5(105,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'F. Pipeline Management',topic:'Capacity-constrained pipeline replenishment'},'Expert','Create','Portfolio, finance, and risk scenario','Public sector, nonprofit, and regulated operations',
      'A public agency has nine Belt-months available. Project R is mandatory. Project U depends on completion of the data foundation in Project T. Use the capacity control and evidence table. Which authorization is defensible?',
      ['Authorize R and S, reserve one month to complete T discovery, and reassess U after its dependency gate','Authorize S and U because their combined stated benefit is largest and request an exception for R','Authorize R, T, and U simultaneously because dependency risk is removed when related projects start together','Start R, S, T, and U at partial allocation so every sponsor sees progress'],0,
      'Mandatory R consumes three months. S adds strong validated value for five, leaving one month for the defined T discovery that can resolve U readiness. This decision respects the nine-month constraint, protects the mandate, and turns U dependency uncertainty into a governed next decision. Starting dependent or excessive work merely hides overload and weakens flow.',
      ['Correct. The selection uses all capacity while explicitly retiring dependency uncertainty.','This omits mandatory work and treats an unready dependent project as selectable.','Starting U before the foundation gate is passed creates avoidable rework and false progress.','Fractional starts increase work in process and do not create additional Belt capacity.'],'Chapter 6 - Pipeline Management','88-99',
      {chart:{type:'data-table',columns:['Project','Belt-months','Validated benefit','Readiness','Constraint'],rows:[['R','3','$0.55M','Ready','Mandatory'],['S','5','$1.10M','Ready','None'],['T discovery','1','$0.10M option value','Ready','Defines data foundation'],['U','4','$1.40M','Not ready','Requires T gate']] ,whatIf:{id:'mbb-q105-capacity',label:'Available Belt-months',min:7,max:11,step:1,value:9,unit:'Belt-months',committed:8,committedLabel:'R plus S'}},altText:'A project table shows mandatory R needing three Belt-months, ready S needing five, T discovery needing one, and unready U needing four after T. The capacity control is set to nine Belt-months with eight committed.',interactionPurpose:'Adjust available Belt-months from seven through eleven and compare remaining capacity with project readiness and dependencies.',keywords:['pipeline management','capacity','dependency','mandatory project','replenishment']}),

    q5(106,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'A. Organizational Design',topic:'Systems thinking and policy-induced failure demand'},'Very Hard','Analyze','Statistical-output interpretation','Service and transactional operations',
      'The chart tracks a call center after a policy shortened allowable handle time in Week 5. Which interpretation best reflects systems thinking?',
      ['Agent compliance improved, so the later increase in repeat contacts must be unrelated customer behavior','The policy likely shifted work downstream: handle time fell immediately while repeat-contact demand rose with delay','Both series prove that individual agents intentionally created repeat contacts to protect performance scores','Because the measures move in opposite directions, no common system intervention could affect both'],1,
      'The intervention changed the local performance rule at Week 5. Handle time falls immediately, but repeat contacts then rise, a plausible delayed feedback effect in which incomplete first-contact resolution creates future demand. The chart does not prove individual intent or causality by itself, but it is strong system-level evidence for testing the policy mechanism rather than rewarding the local metric.',
      ['Local compliance cannot establish improvement when downstream demand and customer outcomes worsen.','Correct. The timing and opposing trajectories support a delayed failure-demand hypothesis.','Aggregate trends do not identify individual intent and should not be used as disciplinary proof.','A shared policy can improve one local metric while degrading a downstream outcome.'],'Chapter 7 - Organizational Design','100-112',
      {chart:{type:'multi-time-series',title:'Policy change and service response',xLabel:'Week',yLabel:'Weekly index',labels:['1','2','3','4','5','6','7','8','9','10'],series:[{label:'Average handle time (minutes)',data:[8.2,8.1,8.3,8.0,6.9,6.3,6.1,6.0,5.9,5.8]},{label:'Repeat contacts per 100 cases',data:[12,12,11,12,12,14,17,20,22,24]}],yDomain:[0,26],referenceValue:5,referenceLabel:'Policy introduced at Week 5'},altText:'A two-series weekly chart shows average handle time near eight minutes through Week 4 and falling below six after a Week 5 policy. Repeat contacts remain near twelve initially, then rise to twenty-four by Week 10.',interactionPurpose:'Focus or hover over the weekly points to compare the immediate handle-time change with the delayed repeat-contact response.',keywords:['systems thinking','failure demand','feedback delay','local optimization','service metrics']}),

    q5(107,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'B. Executive and Team Leadership Roles',topic:'Executive ownership of deployment barriers'},'Hard','Evaluate','Leadership, deployment, and best-next-action scenario','Manufacturing',
      'A plant manager asks the Master Black Belt to personally negotiate production access for every improvement trial because supervisors protect output targets. What response best preserves deployment accountability?',
      ['Accept permanently because the MBB owns project execution and should shield sponsors from operational conflict','Ask each Belt to negotiate alone so supervisors learn that projects are independent of executive sponsorship','Have the plant manager establish trial-access rules and resolve cross-functional conflicts, while the MBB supplies evidence and coaches execution','Pause every project until supervisors voluntarily change their priorities without executive intervention'],2,
      'Executives and champions own the environment in which projects can succeed, including priority conflicts, access, resources, and accountability. The MBB should provide evidence, facilitate decisions, and coach, but should not become a substitute sponsor. A standing rule addresses the system rather than repeatedly negotiating exceptions project by project.',
      ['Permanent substitution weakens sponsor accountability and makes the MBB an operational gatekeeper.','Belts lack the authority to resolve a conflict created by competing executive measures.','Correct. Leadership owns the barrier while the MBB enables an evidence-based solution.','Waiting for voluntary change leaves the misaligned management system untouched.'],'Chapter 11 - Executive and Team Leadership Roles','183-195',
      {keywords:['executive leadership','sponsorship','decision rights','resource access','MBB role']}),

    q5(108,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'C. Organizational Challenges',topic:'Interest-based resolution of resource conflict'},'Very Hard','Apply','Organizational-dynamics intervention scenario','Product development and engineering',
      'Engineering and Operations dispute ownership of a pilot. Engineering needs design learning; Operations fears schedule loss. Both demand final authority. What should the Master Black Belt do first?',
      ['Escalate immediately and ask the executive sponsor to choose the function whose objective has higher financial value','Transfer the pilot to Quality because a neutral department can own both product design and production scheduling','Divide authority equally so either function can veto any pilot decision without explaining the basis','Separate positions from interests, define shared success and risk limits, then agree decision rights for design changes and operating windows'],3,
      'The stated positions are competing claims to authority, but the underlying interests are learning, schedule protection, and risk control. Interest-based resolution creates a joint problem statement and explicit decision rights without erasing legitimate functional accountability. Immediate escalation may eventually be needed, but first-line diagnosis and structured agreement improve both commitment and decision quality.',
      ['Financial ranking alone does not resolve legitimate technical, schedule, and safety interests.','Neutral facilitation can help, but transferring accountability to Quality is inappropriate.','Mutual veto creates deadlock and hides the criteria required for a sound decision.','Correct. It converts positional conflict into explicit interests, safeguards, and authority.'],'Chapter 10 - Organizational Challenges','177-182',
      {keywords:['interest-based negotiation','conflict resolution','decision rights','pilot governance','stakeholders']}),

    q5(109,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'D. Organizational Change Management',topic:'Change commitment and reinforcement'},'Expert','Evaluate','Leadership, deployment, and best-next-action scenario','Healthcare',
      'A hospital achieved 95% training completion for a new medication-reconciliation process, yet sustained use is 42%. Interviews show physicians believe the old process is faster, managers still reward discharge speed alone, and the electronic workflow adds duplicate entry. What change plan is strongest?',
      ['Remove duplicate entry, rebalance manager measures, involve credible physicians in testing, and track behavior plus patient outcomes','Discipline nonusers immediately because knowledge has already been demonstrated by the completion record','Delay adoption communications until the electronic workflow is perfect and every objection disappears','Repeat mandatory training monthly and publish completion rankings by department until reported use improves'],0,
      'Completion is not adoption. The evidence identifies capability friction, conflicting reinforcement, and weak peer ownership. The strongest plan removes a real workflow barrier, aligns consequences with the desired behavior, uses credible participants to refine and advocate the change, and measures both use and purpose. More communication or punishment alone would leave the system producing nonuse.',
      ['Correct. It addresses ability, reinforcement, participation, and outcome feedback together.','Punishment before correcting workflow and reward conflicts risks compliance theater and concealment.','Waiting for perfection prevents iterative learning and leaves patient risk unmanaged.','Training repetition treats a motivation and system-design problem as a knowledge deficit.'],'Chapter 9 - Organizational Change Management','119-125',
      {keywords:['change management','reinforcement','adoption','workflow barrier','leading measure']}),

    q5(110,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'F. Organizational Performance Metrics',topic:'Balanced deployment performance metrics'},'Hard','Analyze','Visual evidence interpretation, non-statistical','Cross-industry enterprise/deployment case',
      'The executive dashboard is intended to show whether deployment is producing sustainable enterprise results. Which conclusion is most defensible?',
      ['Deployment is healthy because annualized submitted benefits exceed target and training completions are high','Deployment has a realization and sustainability gap despite strong activity, so leadership should investigate validation, control, and ownership','Deployment is financially proven because Finance validation is unnecessary when sponsor-submitted benefits exceed plan','Deployment should stop training immediately because any gap between submitted and validated benefits proves overtraining'],1,
      'The dashboard separates activity and claimed value from validated, sustained outcomes. Training and submitted benefits are high, but Finance validation, control-plan adherence, and process-owner acceptance are materially weaker. The correct conclusion is not that training caused the gap; it is that governance and benefit realization require diagnosis. Balanced measures prevent activity counts from masquerading as enterprise impact.',
      ['High activity and submitted claims do not establish realized or sustained enterprise value.','Correct. The dashboard exposes weak conversion from activity to validated, owned results.','This option incorrectly treats sponsor claims as a substitute for independent validation.','The evidence does not isolate training volume as the cause of the realization gap.'],'Chapter 8 - Organizational Performance Metrics','126-146',
      {chart:{type:'data-table',columns:['Metric','Target','Actual'],rows:[['Belts completing training','80','96'],['Submitted annualized benefit','$4.0M','$5.2M'],['Finance-validated benefit','$4.0M','$2.7M'],['Control plans followed at 90 days','85%','54%'],['Process-owner acceptance at closure','90%','61%']]},altText:'A dashboard table shows training completion and submitted benefits above target, while Finance-validated benefit, 90-day control-plan adherence, and process-owner acceptance are all substantially below target.',keywords:['performance metrics','benefit realization','leading and lagging','sustainability','dashboard']}),

    q5(111,'mbb-portfolio',{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Cross-project dependency and critical path governance'},'Very Hard','Analyze','Multi-step quantitative','Product development and engineering',
      'The portfolio network shows durations in weeks. Activities B and C begin after A; D begins after B; E begins after both C and D. Which governance action protects the committed finish most directly?',
      ['Track A-C-E as the only critical path because C has the longest individual duration','Expedite B without checking D because every predecessor of a merge point is critical','Protect A-B-D-E, whose 12-week duration exceeds A-C-E by two weeks, and monitor the two-week path float','Add the two branch durations together and manage the program as a 17-week sequential plan'],2,
      'Path A-B-D-E lasts 2+4+3+3=12 weeks. Path A-C-E lasts 2+5+3=10 weeks, so the B-D branch controls the earliest finish and the C branch has two weeks of total float under the stated network. Governance should protect the controlling path while monitoring float consumption and merge-point readiness.',
      ['A-C-E is ten weeks and is not the controlling path.','B matters through D, but expediting one activity without path evidence may not protect finish.','Correct. The critical path is twelve weeks and the alternate path has two weeks of float.','Parallel branches are not added as though they execute sequentially.'],'Chapter 13 - Project Portfolio Management','196-201',
      {quantitative:true,formula:'Path A-B-D-E = 2 + 4 + 3 + 3 = 12 weeks; path A-C-E = 2 + 5 + 3 = 10 weeks; total float = 2 weeks.',assumptions:['Durations are deterministic for this calculation.','Resources are available as scheduled and no hidden dependencies exist.'],estimatedMinutes:4,chart:{type:'activity-network',title:'Shared product-launch network',nodes:{A:{dur:2,col:0,row:1},B:{dur:4,col:1,row:0},C:{dur:5,col:1,row:2},D:{dur:3,col:2,row:0},E:{dur:3,col:3,row:1}},edges:[['A','B'],['A','C'],['B','D'],['C','E'],['D','E']]},altText:'An activity network shows A lasting two weeks, splitting to B for four weeks and C for five weeks. B leads to D for three weeks. C and D merge into E, which lasts three weeks.',keywords:['critical path','dependency','float','portfolio governance','network']}),

    q5(112,'mbb-portfolio',{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Scarce-resource conflict across projects'},'Hard','Evaluate','Portfolio, finance, and risk scenario','Manufacturing',
      'Two approved projects need the same validation engineer in the same month. One protects a regulatory deadline; the other has higher NPV but can move six weeks without losing benefit. What should the portfolio council do?',
      ['Split the engineer equally even if neither validation finishes on time, because approved projects have equal entitlement','Ask both Black Belts to negotiate privately and leave the approved baselines unchanged','Prioritize the higher-NPV project because financial rank must override schedule and compliance constraints','Prioritize the regulatory validation, rebaseline the movable project transparently, and confirm that its benefit remains intact'],3,
      'Portfolio management optimizes the whole system under dependencies and constraints. The regulatory deadline is time-critical, while the other project has documented schedule flexibility without value loss. Explicit reprioritization and rebaselining preserve governance truth. Fractional allocation, a finance-only rule, or hidden negotiation would create avoidable execution and reporting risk.',
      ['Equal fractional allocation can cause both projects to miss the outcome that justified approval.','Private negotiation bypasses accountable portfolio decisions and leaves misleading baselines.','NPV is important but does not erase mandatory constraints or timing flexibility.','Correct. It respects the binding deadline and updates the affected baseline openly.'],'Chapter 14 - Project Portfolio Infrastructure','202-218',
      {keywords:['resource constraint','portfolio governance','rebaseline','regulatory deadline','NPV']}),

    q5(113,'mbb-portfolio',{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Evidence-based project termination'},'Expert','Evaluate','Portfolio, finance, and risk scenario','Service and transactional operations',
      'A project has consumed 70% of budget. Its original CTQ improvement is no longer strategically relevant after a product exit, but the sponsor argues that termination would waste prior spending. What should the Master Black Belt recommend?',
      ['Evaluate only prospective value, risk, and opportunity cost; terminate if no current strategic case survives','Reframe the remaining work as training so prior spending can be reported as organizational capability','Continue until the original deliverables are complete so the sunk cost produces a tangible output','Transfer the project to another Belt because changing ownership restores the business case'],0,
      'Past spending is sunk and cannot be recovered by continuing. A gate decision should use incremental future cost, current strategic value, risk, dependencies, and the value of released capacity. If the product exit removes the benefit mechanism, finishing deliverables may deepen loss. A disciplined termination is portfolio management, not project failure.',
      ['Correct. Forward-looking value and opportunity cost govern the continue-or-stop decision.','Relabeling expenditure does not create learning value or restore strategic relevance.','Continuing only to justify sunk spending deepens loss without restoring strategic value.','New ownership cannot recreate a missing enterprise benefit mechanism.'],'Chapter 15 - Portfolio Monitoring and Closure','211-224',
      {keywords:['project termination','sunk cost','opportunity cost','strategic relevance','gate review']}),

    q5(114,'mbb-portfolio',{domain:'III. Project Portfolio Management',subdomain:'C. Project Portfolio Financial Tools',topic:'Risk-adjusted net present value'},'Very Hard','Apply','Multi-step quantitative','Finance and insurance',
      'A fraud-prevention project costs $300,000 now. It has a 0.70 probability of delivering $210,000 at each year-end for two years and a 0.30 probability of delivering $60,000 at each year-end. At a 10% discount rate, what is the expected NPV?',
      ['Approximately negative $18,300','Approximately negative $13,600','Approximately positive $34,700','Approximately positive $66,900'],1,
      'Expected annual benefit is 0.70($210,000)+0.30($60,000)=$165,000. Present value is $165,000/1.10+$165,000/1.10^2=$286,364. Subtracting the $300,000 initial cost gives expected NPV=-$13,636, which rounds to approximately negative $13,600. The probability weighting must precede discounting because the two scenarios are mutually exclusive.',
      ['This sign is plausible but the magnitude does not match discounted expected cash flows.','Correct. Probability-weighted discounted benefits produce an expected NPV near negative $13,600.','This value overstates expected benefits and does not subtract the initial investment correctly.','This value is consistent with little or no probability weighting and is not risk-adjusted.'],'Chapter 16 - Project Portfolio Financial Tools','225-232',
      {quantitative:true,formula:'E(benefit)=0.70(210000)+0.30(60000)=165000; NPV=-300000+165000/1.10+165000/1.10^2=-13636.',assumptions:['Scenario probabilities are mutually exclusive and stable across both years.','Benefits occur at each year-end and the initial cost occurs now.'],estimatedMinutes:4,keywords:['expected NPV','risk adjustment','discounting','probability','portfolio finance']}),

    q5(115,'mbb-training',{domain:'IV. Training Design and Delivery',subdomain:'A. Training Needs Analysis',topic:'Performance-gap diagnosis before training'},'Hard','Analyze','Visual evidence interpretation, non-statistical','Healthcare',
      'A hospital requests refresher training for specimen labeling. Knowledge scores are 92% against an 85% requirement, printer availability is 81% against 99%, interface matching is 88% against 99.5%, and compliant technique when systems work is 94% against 95%. Which response should the Master Black Belt make?',
      ['Train all roles because the overall error rate exceeds the target and training is the fastest universal countermeasure','Train phlebotomists only because they handle the largest sample volume and most visible labeling workload','Correct printer reliability and order-interface defects first, then assess the residual role-specific skill gap before designing training','Replace competency checks with manager observation because formal assessment delays corrective action'],2,
      'Training needs analysis separates knowledge or skill gaps from environmental, process, technology, and reinforcement causes. The table shows high demonstrated knowledge but poor printer reliability and substantial interface mismatches. Those conditions can produce labeling failures even when staff know the method. Correcting them first makes any remaining training targeted and measurable.',
      ['A high outcome gap does not establish that every role has a trainable deficiency.','Volume alone does not identify the causal performance gap or appropriate learner group.','Correct. It removes nontraining causes and then isolates the remaining competency need.','Informal observation alone weakens evidence and cannot replace a valid competency assessment.'],'Chapter 17 - Training Needs Analysis','236-244',
      {chart:{type:'data-table',columns:['Evidence','Result','Required level'],rows:[['Knowledge assessment','92%','85%'],['Label-printer availability','81%','99%'],['Order-interface match','88%','99.5%'],['Observed method compliance when systems work','94%','95%']]},altText:'A training-needs table shows knowledge above requirement, printer availability and order-interface matching far below requirement, and observed method compliance one point below requirement.',keywords:['training needs analysis','performance gap','nontraining cause','competency','system barrier']}),

    q5(116,'mbb-training',{domain:'IV. Training Design and Delivery',subdomain:'D. Training Program Effectiveness',topic:'Evaluation of transfer and business impact'},'Very Hard','Create','Coaching, training, and failing-project diagnosis','Supply chain, logistics, and distribution',
      'A warehouse course produced strong satisfaction scores and a 24-point knowledge gain. Leaders want to claim a 30% picking-error reduction observed afterward. Which evaluation design is strongest?',
      ['Use the satisfaction and knowledge results as sufficient proof because both precede the operational improvement','Compare pre/post errors only among graduates and attribute the complete change to training','Ask supervisors whether the improvement feels training-related and average their confidence ratings','Use a phased or matched comparison, verify behavior transfer, track exposure and competing changes, and estimate uncertainty'],3,
      'Reaction and learning are useful but do not establish on-job transfer or causal business effect. A phased rollout or credible matched comparison adds a counterfactual; behavior observation tests transfer; exposure and concurrent operational changes address contamination; uncertainty prevents false precision. The design should connect evaluation levels without claiming that timing alone proves attribution.',
      ['Reaction and knowledge are lower-level evidence and cannot isolate operational effect.','A single-group before-after comparison is vulnerable to trend, seasonality, and concurrent changes.','Manager belief may inform inquiry but is not a defensible causal estimate.','Correct. It evaluates transfer and impact with a credible comparison and explicit confounders.'],'Chapter 20 - Training Program Effectiveness','285-292',
      {keywords:['training effectiveness','transfer','counterfactual','Kirkpatrick','causal attribution']}),

    q5(117,'mbb-coaching',{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'A. Executives and Champions',topic:'Coaching a champion on scope and ownership'},'Hard','Apply','Coaching, training, and failing-project diagnosis','Public sector, nonprofit, and regulated operations',
      'A champion keeps expanding a licensing project whenever stakeholders mention another delay source. The Black Belt now has seven CTQs and four agencies in scope. What should the Master Black Belt do?',
      ['Coach the champion to separate the strategic problem from this project boundary, quantify the first value stream, and govern later opportunities in the pipeline','Rewrite the charter privately and instruct the Belt to enforce the smaller scope without involving the champion','Accept the additions because champion ownership overrides scope discipline at every tollgate and review','Close the project as failed because repeated scope growth proves the original selection was invalid and unrecoverable'],0,
      'The champion should own the business problem and scope decision, while the MBB makes the consequences visible. Mapping the initial value stream and quantifying boundaries supports a defensible charter; related opportunities can enter the pipeline rather than being lost. Private rewriting, unlimited expansion, or immediate closure either bypasses ownership or sacrifices portfolio discipline.',
      ['Correct. It restores champion accountability while protecting a governed opportunity pipeline.','Private correction would weaken ownership and leave the sponsor unable to defend the boundary.','Sponsor authority does not remove the need to manage capacity, risk, and independent deliverables.','Scope growth is recoverable and does not by itself prove the project should be terminated.'],'Chapter 21 - Coaching Executives and Champions','294-305',
      {keywords:['champion coaching','scope','charter','pipeline','stakeholder']}),

    q5(118,'mbb-coaching',{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'B. Teams and Individuals',topic:'Diagnosing a technically stalled Black Belt project'},'Very Hard','Analyze','Coaching, training, and failing-project diagnosis','Manufacturing',
      'A Black Belt repeatedly adds transformations until a regression reaches p<0.05, but residual structure persists and process experts cannot explain the model. What is the best MBB coaching intervention?',
      ['Approve the model because significance is the accepted tollgate criterion and interpretation can follow implementation','Return to the causal question, inspect data lineage and residuals, predefine candidate models, and validate out of sample with process experts','Ask the Belt to add more predictors until adjusted R-squared stops increasing and then freeze the specification','Replace regression with a neural network because predictive complexity removes the need for residual assumptions'],1,
      'The pattern suggests analysis-driven specification search, weak causal framing, and unaddressed model inadequacy. Coaching should reconnect the analysis to the decision, verify data and assumptions, limit researcher degrees of freedom, and test generalization and process plausibility. A low p-value or flexible algorithm does not repair residual dependence, leakage, or an uninterpretable causal story.',
      ['Statistical significance alone does not establish adequacy, usefulness, or causal validity.','Correct. It integrates technical validation with disciplined problem solving and expert review.','Adding predictors opportunistically compounds multiplicity and overfitting risk.','A more flexible model can hide rather than solve leakage, dependence, and decision-purpose problems.'],'Chapter 22 - Coaching Teams and Individuals','306-314',
      {keywords:['technical coaching','regression diagnostics','overfitting','data lineage','validation']}),

    q5(119,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. MSA, Process Capability, and Control',topic:'Destructive measurement system analysis'},'Expert','Create','DOE/optimization design and diagnosis','Manufacturing',
      'A peel-strength test destroys each bonded coupon. Production can create homogeneous panels, each cut into coupons. Which study design best separates measurement repeatability, appraiser effects, and panel-to-panel material variation?',
      ['Have every appraiser retest the same destroyed coupon and treat the second recorded result as repeatability','Give separate production panels to each appraiser and analyze all observed variation as reproducibility','Randomly allocate exchangeable coupons from each panel across appraisers and replicates, then fit a nested or crossed model matching the physical structure','Measure one coupon per panel with the most experienced appraiser and compare results with specification limits'],2,
      'A destructive response cannot be repeated on the identical physical unit. The design must create defensible exchangeability within homogeneous panels, randomize coupons across appraisers and replicates, and model panel, appraiser, interaction, and residual terms according to the actual nesting or crossing. Otherwise product heterogeneity is confounded with measurement-system components.',
      ['A destroyed coupon cannot be remeasured, so this design is physically impossible.','Assigning panels by appraiser fully confounds material and reproducibility effects.','Correct. It uses exchangeable subunits and an analysis structure consistent with destructive testing.','A single reading cannot estimate repeatability or reproducibility and capability is not MSA.'],'Chapter 24 - Measurement Systems Analysis','318-346',
      {chart:{type:'data-table',columns:['Panel','Coupon allocation'],rows:[['1','A1, B1, C1, A2, B2, C2'],['2','B1, C1, A1, C2, A2, B2'],['3','C1, A1, B1, B2, C2, A2'],['4','A1, C1, B1, C2, B2, A2']]},altText:'A destructive-study allocation table shows six exchangeable coupons from each of four panels distributed across appraisers A, B, and C with two randomized replicate coupons per appraiser.',keywords:['destructive MSA','nested study','crossed study','exchangeability','variance components']}),

    q5(120,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. MSA, Process Capability, and Control',topic:'Nonnormal capability using distribution modeling'},'Very Hard','Evaluate','Statistical-output interpretation','Service and transactional operations',
      'Cycle time is strongly right-skewed with an upper specification of 18 hours. A lognormal fit passes diagnostics; a normal fit does not. Which capability statement is defensible?',
      ['Report normal Cpk after removing the longest 5% because capability requires symmetric data','Declare the process incapable solely because the observed cycle-time histogram is visibly skewed','Transform the data, compute normal Cpk, and interpret that index directly in original hours without back-transformation','Use the fitted lognormal tail probability or percentile-based capability, with uncertainty and stability checks'],3,
      'Capability concerns the probability of meeting requirements for a stable process, not whether raw data look normal. When a substantively appropriate lognormal model fits, estimate the original-scale upper-tail nonconformance or a clearly defined percentile index and quantify uncertainty. Trimming changes the estimand; direct transformed-scale Cpk can be misleading; skewness alone is not incapability.',
      ['Removing valid long cycles biases the very tail that the upper specification controls.','Distribution shape alone does not determine the fraction beyond the specification.','A transformed index requires careful mapping and may not correspond to symmetric original-scale specifications.','Correct. It aligns the distribution model and reported risk with the original requirement.'],'Chapter 24 - Process Capability and Performance','347-352',
      {chart:{type:'histogram',title:'Service cycle-time distribution',xLabel:'Cycle time (hours)',yLabel:'Cases',binEdges:[0,3,6,9,12,15,18,21,24,27,30],counts:[3,10,22,31,25,17,10,6,3,1],referenceValue:18,referenceLabel:'USL = 18 h'},altText:'A histogram of service cycle time rises to a mode between nine and twelve hours and then tapers in a long right tail beyond the 18-hour upper specification.',keywords:['nonnormal capability','lognormal','tail probability','percentile','process stability']}),

    q5(121,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Regression influence and decision sensitivity'},'Hard','Analyze','Statistical-output interpretation','Finance and insurance',
      'A credit-loss model has acceptable aggregate R-squared, but the residual-versus-fitted display includes one isolated high-fitted case with a large negative residual. What should the Master Black Belt require before approving the model?',
      ['Examine data lineage, leverage and influence; refit with and without the case; and assess whether the decision changes','Retain it automatically because removing any real observation is data manipulation','Delete the point because unusual observations are incompatible with valid regression','Replace the fitted values with ranks so the isolated point can no longer have leverage'],0,
      'An unusual point may be an error, a legitimate rare exposure, or evidence that the model form fails in a decision-critical region. Approval requires traceable investigation, formal influence diagnostics, sensitivity analysis, and business interpretation. Automatic deletion or retention avoids the judgment an MBB must make, while ranking the predictor does not diagnose the underlying issue.',
      ['Correct. It combines provenance, statistical influence, and decision sensitivity.','Automatic retention is no more defensible than automatic deletion when influence may dominate a decision.','Automatic deletion discards information before its provenance and influence are understood.','Ranking changes the model and can conceal rather than explain a consequential observation.'],'Chapter 25 - Measuring and Modeling Relationships','370-402',
      {chart:{type:'regression-diagnostic',title:'Residuals versus fitted losses',xLabel:'Fitted loss ($000)',yLabel:'Standardized residual',xTicks:[0,50,100,150,200],yTicks:[-4,-2,0,2,4],points:[{fitted:18,residual:0.4},{fitted:31,residual:-0.3},{fitted:45,residual:0.6},{fitted:62,residual:-0.5},{fitted:78,residual:0.2},{fitted:91,residual:-0.2},{fitted:108,residual:0.5},{fitted:190,residual:-3.6}]},altText:'A residual-versus-fitted plot shows seven observations scattered near zero through fitted loss 108 thousand dollars and one isolated observation at fitted loss 190 with standardized residual negative 3.6.',interactionPurpose:'Focus or hover over each point to compare its fitted value and residual, especially the isolated high-fitted case.',keywords:['regression diagnostics','influence','leverage','sensitivity analysis','data lineage']}),

    q5(122,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Interrupted time series and autocorrelated errors'},'Very Hard','Analyze','Statistical-output interpretation','Healthcare',
      'Monthly infection rates fell after an intervention, but residual autocorrelations at lags 1 and 2 exceed the approximate 95% limits. Which conclusion is strongest?',
      ['The intervention is proven because the postintervention mean is lower regardless of residual dependence','Ordinary regression standard errors are suspect; model the autocorrelation and reassess the level or slope change','Difference the outcome repeatedly until every visible intervention effect disappears, then report no effect','Use a two-sample t test on pre/post months because equal sample sizes remove serial dependence'],1,
      'Residual autocorrelation violates the independence basis of ordinary regression standard errors and can exaggerate apparent precision. The intervention effect should be estimated in a time-series model that represents baseline trend, level or slope change, seasonality when present, and correlated errors. Mechanical differencing can erase meaningful structure, while equal group sizes do not cure dependence.',
      ['A visual mean shift does not establish uncertainty correctly when observations are serially dependent.','Correct. The model must account for residual dependence before inference on the intervention.','Differencing should be selected from the data-generating structure, not forced to erase an effect.','A t test treats months as independent and ignores trend and serial correlation.'],'Chapter 25 - Time Series and Autocorrelation','353-373',
      {chart:{type:'acf-plot',title:'Residual autocorrelation after segmented regression',xLabel:'Lag (months)',yLabel:'Residual ACF',lags:[1,2,3,4,5,6,7,8],values:[0.52,0.31,0.12,-0.05,-0.08,0.04,0.02,-0.03],confidence:0.24},altText:'A residual autocorrelation plot has approximate limits at plus or minus 0.24. Lag 1 is 0.52 and lag 2 is 0.31, while lags 3 through 8 remain within the limits.',keywords:['interrupted time series','autocorrelation','segmented regression','standard error','ACF']}),

    q5(123,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Reliability model selection under nonproportional hazards'},'Hard','Understand','Statistical-output interpretation','Product development and engineering',
      'Two component designs have crossing survival curves: Design A is more reliable early, while Design B is more reliable after 1,200 hours. What should the MBB conclude for selection?',
      ['Select A because early reliability always dominates total life-cycle performance','Select B because the design with the higher late survival must have the lower hazard at every time','Do not summarize the comparison with one proportional-hazards ratio; evaluate mission-specific reliability and time-varying risk','Average the two curves and select whichever mean survival probability exceeds 0.50'],2,
      'Crossing survival curves indicate that relative risk changes over time, undermining a constant proportional-hazards interpretation. Selection must be tied to the mission window, failure consequences, censoring, and an appropriate time-varying or stratified analysis. Neither early nor late dominance is universally decisive, and averaging probabilities across arbitrary times lacks a decision basis.',
      ['Early performance may matter, but it does not automatically dominate every mission profile.','Crossing curves directly contradict a constant ordering of hazards over time.','Correct. Mission-specific reliability and time-varying effects are required.','An unweighted average over arbitrary time points has no reliability decision interpretation.'],'Chapter 25 - Reliability Analysis','423-428',
      {chart:{type:'reliability-plot',title:'Design survival comparison',xLabel:'Operating time (hours)',yLabel:'Survival probability',xTicks:[0,400,800,1200,1600,2000],series:[{label:'Design A',points:[[0,1],[400,0.94],[800,0.83],[1200,0.68],[1600,0.49],[2000,0.31]]},{label:'Design B',points:[[0,1],[400,0.88],[800,0.77],[1200,0.68],[1600,0.58],[2000,0.46]]}],missionTime:1200},altText:'Two survival curves begin at one and cross at 1,200 hours near 0.68. Design A is higher before the crossing, while Design B is higher afterward.',keywords:['survival analysis','crossing curves','proportional hazards','mission reliability','time-varying risk']}),

    q5(124,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'C. Design of Experiments',topic:'Split-plot design and correct error terms'},'Very Hard','Apply','DOE/optimization design and diagnosis','Manufacturing',
      'Temperature is hard to change, so each furnace batch holds one temperature while four randomized line-speed settings run within that batch. The study repeats across six batches. Which analysis is required?',
      ['Treat all 24 runs as completely randomized and use one residual error for every factor','Average across speed and analyze temperature only because subplot factors are invalid in industrial experiments','Treat furnace batch as a fixed treatment and omit randomization restrictions from the model','Fit a split-plot mixed model with whole-plot error for temperature and subplot error for speed and interaction'],3,
      'The physical randomization creates two experimental-unit sizes. Temperature is assigned to whole plots defined by furnace batches, while speed is randomized within each batch. Their effects therefore have different error strata. A mixed split-plot model preserves valid tests and degrees of freedom; pretending complete randomization typically understates uncertainty for the hard-to-change factor.',
      ['One pooled residual ignores the restricted randomization and can inflate temperature significance.','Averaging discards estimable speed and interaction information.','Batch represents the whole-plot grouping structure, not simply another fixed treatment.','Correct. The model matches treatment assignment to the two error strata.'],'Chapter 26 - Design of Experiments','449-450',
      {chart:{type:'data-table',columns:['Furnace batch','Whole-plot temperature','Randomized speed sequence'],rows:[['1','Low','3, 1, 4, 2'],['2','High','2, 4, 1, 3'],['3','Low','1, 3, 2, 4'],['4','High','4, 2, 3, 1'],['5','Low','2, 1, 4, 3'],['6','High','3, 4, 2, 1']]},altText:'A DOE table shows six furnace batches. Each batch holds either low or high temperature as a whole-plot setting and contains four independently randomized line-speed subplot settings.',keywords:['split plot','hard-to-change factor','mixed model','whole-plot error','randomization']}),

    q5(125,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Overdispersed count regression'},'Hard','Understand','Advanced conceptual/method-selection','Public sector, nonprofit, and regulated operations',
      'Complaint counts are modeled by exposure hours. The Poisson model has residual deviance 418 on 96 degrees of freedom, and residuals show no single influential case. Which next modeling step is most appropriate?',
      ['Use a negative-binomial or quasi-Poisson approach, retain the exposure offset, and investigate heterogeneity','Convert counts to a binary any-complaint outcome so overdispersion no longer matters','Keep ordinary Poisson standard errors because deviance affects fit but not inference','Divide every count by exposure and use unweighted ordinary least squares'],0,
      'For a well-fitting Poisson model, residual deviance should be broadly commensurate with residual degrees of freedom. A ratio near 4.35 indicates substantial overdispersion, likely from unmodeled heterogeneity or dependence. A negative-binomial or quasi-Poisson treatment adjusts variance while preserving the count scale and exposure offset, followed by substantive investigation.',
      ['Correct. It preserves the rate structure while addressing extra-Poisson variance.','Dichotomizing discards count information and does not diagnose the source of extra variation.','Poisson variance misspecification directly distorts standard errors and inference.','Rate transformation plus unweighted OLS creates heteroscedasticity and ignores count support.'],'Chapter 25 - Logistic and Generalized Models','384-402',
      {quantitative:true,formula:'Dispersion diagnostic = residual deviance / residual df = 418 / 96 = 4.35.',assumptions:['Exposure hours are measured correctly and included as a log offset.','No single data error explains the excess deviance.'],chart:{type:'data-table',columns:['Model diagnostic','Value'],rows:[['Residual deviance','418'],['Residual degrees of freedom','96'],['Deviance / df','4.35'],['Maximum Cook distance','0.18']]},altText:'A model-diagnostic table shows residual deviance 418 on 96 degrees of freedom, a deviance-to-df ratio of 4.35, and maximum Cook distance 0.18.',keywords:['overdispersion','Poisson regression','negative binomial','offset','count model']})
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
    q6(126,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'A. Strategic Plan Development',topic:'Strategy deployment matrix coherence'},'Very Hard','Analyze','Visual evidence interpretation, non-statistical','Cross-industry enterprise/deployment case',
      'Leadership claims that the strategy map is ready for deployment. Which defect in the evidence table creates the greatest execution risk?',
      ['The margin objective has two linked initiatives instead of exactly one initiative and one owner','The reliability initiative has no accountable owner although it carries a target and strategic relationship','The access objective is measured in hours rather than converted into an annual financial result','The table contains both customer and financial objectives rather than one homogeneous objective type'],1,
      'A deployment matrix needs a traceable chain from objectives through initiatives, measures, and accountable ownership. The reliability initiative has strategic importance and a numeric target but no person or role answerable for decisions and escalation. Multiple initiatives per objective and balanced objective types are legitimate; operational measures need not all be converted into dollars.',
      ['Multiple initiatives may support one objective when interfaces and accountability are explicit.','Correct. A target without accountable ownership cannot be governed or escalated reliably.','A customer access measure can remain operational while its strategic contribution is validated.','Balanced strategies normally combine customer, process, people, and financial outcomes.'],'Chapter 1 - Strategic Plan Development','7-17',
      {chart:{type:'data-table',columns:['Objective','Initiative','Relationship','Measure / target','Accountable owner'],rows:[['Improve margin','Reduce rework','Strong','Cost of rework -25%','Operations VP'],['Improve margin','Simplify claims','Medium','Touch time -20%','Claims VP'],['Increase reliability','Predict failures','Strong','Unplanned failures -30%','Blank'],['Improve access','Level demand','Strong','Median delay under 8 h','Service VP']]},altText:'A strategy evidence table lists four objective-initiative rows. The predictive-failure reliability initiative has a strong relationship and a 30 percent target, but its accountable-owner cell is blank.',keywords:['strategy deployment','X matrix','accountability','traceability','governance']}),

    q6(127,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'B. Strategic Plan Alignment',topic:'Cascading goals without local optimization'},'Hard','Apply','Leadership, deployment, and best-next-action scenario','Healthcare',
      'A health system cascades a shorter length-of-stay objective to every unit. One unit can meet its target by transferring patients earlier, increasing downstream readmissions. What should the MBB add to the deployment design?',
      ['A stronger unit-level discharge-speed incentive so managers cannot trade speed for other priorities','An independent DMAIC charter for every readmission before changing the length-of-stay target','System-level balancing measures and shared ownership across discharge, community care, and readmission outcomes','A rule preventing local leaders from viewing enterprise measures until their own targets are achieved'],2,
      'Cascading a system objective into isolated functional targets can create displacement rather than improvement. Shared end-to-end ownership and balancing measures make downstream harm visible and align decisions across organizational boundaries. More local pressure or separate projects preserves the fragmented optimization that produced the readmission effect.',
      ['Stronger local incentives amplify the behavior that transfers cost and risk downstream.','Separate charters do not replace an integrated measure and decision architecture.','Correct. Balancing measures and shared ownership protect the total patient pathway.','Hiding enterprise outcomes prevents learning and weakens strategic line of sight.'],'Chapter 2 - Strategic Plan Alignment','23-27',
      {keywords:['strategic alignment','local optimization','balancing measure','shared ownership','healthcare']}),

    q6(128,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'C. Infrastructure Elements of Improvement Systems',topic:'Deployment maturity and scale readiness'},'Very Hard','Evaluate','Leadership, deployment, and best-next-action scenario','Finance and insurance',
      'A bank has three successful pilot projects, but each used a different benefit definition, sponsor behavior varied widely, and lessons are stored in personal files. Executives want immediate enterprise rollout. What is the strongest recommendation?',
      ['Scale immediately because three successful pilots prove that the deployment system is mature enough','Train more Belts first and allow governance to emerge after the project pipeline becomes large','Standardize only the statistical templates because technical variation is the principal barrier to scale','Stabilize benefit rules, sponsor accountabilities, knowledge capture, and portfolio governance before controlled expansion'],3,
      'Pilot results demonstrate potential, not a repeatable deployment capability. Scaling an inconsistent governance system multiplies benefit disputes, sponsor variability, and lost learning. The MBB should convert pilot knowledge into standard decision rights, validation rules, reusable assets, and a controlled expansion plan with feedback before increasing work in process.',
      ['Project success alone does not demonstrate a reliable enterprise operating system.','More trained capacity would increase demand on the unstable governance infrastructure.','Statistical templates do not resolve sponsorship, benefit validation, or organizational learning.','Correct. It makes the deployment system repeatable before expanding its load.'],'Chapter 3 - Deployment of Six Sigma Systems','28-52',
      {keywords:['deployment maturity','scale readiness','benefit rules','knowledge management','governance']}),

    q6(129,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'E. Opportunities for Improvement',topic:'Project qualification and problem ownership'},'Hard','Apply','Advanced conceptual/method-selection','Service and transactional operations',
      'An executive proposes a project titled “Install AI to improve customer service.” No baseline, CTQ, process boundary, or accountable process owner exists. What should the MBB do first?',
      ['Qualify the opportunity by defining the customer problem, baseline, boundary, owner, benefit mechanism, and evidence that a project is warranted','Approve a technology pilot because a working prototype will reveal the problem and create its own baseline','Assign a Black Belt and let the Define phase decide whether any customer problem exists or owner is accountable','Reject AI permanently because solution-first language is incompatible with Lean Six Sigma improvement work'],0,
      'The proposal is a preferred solution rather than a qualified opportunity. Before consuming project capacity, the deployment system needs a measurable problem, customer requirement, boundary, owner, strategic contribution, and plausible benefit mechanism. A limited discovery may follow, but it must be governed as discovery rather than disguising an unqualified implementation.',
      ['Correct. It turns solution enthusiasm into a testable, owned business opportunity.','A prototype without a decision question or baseline can create sunk-cost commitment.','Black Belt capacity should not be used to discover whether a business problem exists at all.','Solution-first wording is a warning, not evidence that the technology can never be useful.'],'Chapter 5 - Opportunities for Improvement','70-87',
      {keywords:['project qualification','problem statement','process owner','CTQ','solution bias']}),

    q6(130,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'F. Pipeline Management',topic:'Risk-adjusted portfolio selection with capacity'},'Expert','Create','Portfolio, finance, and risk scenario','Supply chain, logistics, and distribution',
      'The pipeline has ten Belt-months available. Project M is mandatory; Project D is not ready until its data gate passes. Which authorization best preserves value, capacity discipline, and optionality?',
      ['Authorize M and A, then leave three months idle because partial discovery work has no portfolio value','Authorize M and B, use the remaining month for D data-gate discovery, and review D at the next replenishment gate','Authorize A and D because their stated benefits are highest, then request emergency capacity for M','Start all projects at fractional staffing and use monthly benefit forecasts to decide which one finishes'],1,
      'Mandatory M consumes four months. Ready Project B consumes five and has strong risk-adjusted value, leaving one month to resolve D readiness without prematurely authorizing its full work. This uses the constraint while creating information for the next gate. Omitting M, leaving useful discovery undone, or spreading people across every project weakens flow and governance.',
      ['Leaving capacity unused ignores a defined, decision-relevant discovery activity.','Correct. It protects mandatory work, uses capacity, and buys information before commitment.','The selection omits mandatory work and treats an unready project as fully selectable.','Fractional starts inflate work in process and delay benefit realization across the portfolio.'],'Chapter 6 - Pipeline Management','88-99',
      {chart:{type:'data-table',columns:['Project','Belt-months','Risk-adjusted value','Readiness','Constraint'],rows:[['M','4','$0.7M','Ready','Mandatory'],['A','5','$0.9M','Ready','None'],['B','5','$1.2M','Ready','None'],['D discovery','1','$0.2M option value','Ready','Tests data gate'],['D full','4','$1.6M','Not ready','Requires data gate']],whatIf:{id:'mbb-q130-capacity',label:'Available Belt-months',min:8,max:13,step:1,value:10,unit:'Belt-months',committed:9,committedLabel:'M plus B'}},altText:'A portfolio table shows mandatory M requiring four Belt-months, ready A and B requiring five each, a one-month D discovery, and an unready four-month D full project. The capacity control is set to ten with nine committed.',interactionPurpose:'Adjust available Belt-months and compare residual capacity with readiness, mandatory work, and the D data-gate option.',keywords:['pipeline','capacity','risk-adjusted value','option value','replenishment']}),

    q6(131,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'A. Organizational Design',topic:'Federated deployment operating model'},'Very Hard','Analyze','Leadership, deployment, and best-next-action scenario','Cross-industry enterprise/deployment case',
      'A multinational uses one central MBB office. Local sites complain that project selection ignores regulation and language, while methods and benefit definitions vary whenever sites act alone. Which design is strongest?',
      ['Fully decentralize methods, certification, benefit definitions, and selection so each site owns its results','Centralize every charter and tollgate decision because consistency has greater value than local knowledge','Create a federated model with enterprise standards and assurance, plus local selection authority within explicit guardrails','Rotate the central MBB office among sites annually so authority and inconsistency are distributed equally'],2,
      'The problem requires both enterprise comparability and contextual adaptation. A federated model can centralize methodology, credential integrity, benefit rules, shared assets, and assurance while delegating locally informed opportunity selection and execution within clear decision rights. Either extreme sacrifices information or consistency; rotation changes location without fixing governance.',
      ['Full decentralization preserves the exact inconsistency that prevents enterprise learning.','Full centralization suppresses legitimate regulatory, cultural, and operational information.','Correct. Federated governance separates nonnegotiable standards from context-sensitive decisions.','Rotating authority does not define standards, interfaces, or accountable decision rights.'],'Chapter 7 - Organizational Design','100-119',
      {keywords:['federated model','centralization','local authority','enterprise standards','governance']}),

    q6(132,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'B. Executive and Team Leadership Roles',topic:'Champion and MBB role boundaries'},'Hard','Understand','Advanced conceptual/method-selection','Manufacturing',
      'At a tollgate, who should own the decision to continue funding a strategically aligned project, and what is the MBB’s primary contribution?',
      ['The Black Belt owns funding; the MBB verifies that meeting minutes were distributed','Finance owns funding; the MBB replaces the sponsor whenever benefit assumptions change','The MBB owns funding because technical authority includes capital-allocation authority','The champion or governance body owns the business decision; the MBB provides technical assurance and coaching'],3,
      'The champion and portfolio governance structure own the business case, resources, barrier removal, and continue-stop decision. The MBB independently examines method, evidence, risks, and learning while coaching the Belt and sponsor. Combining technical assurance with unilateral funding authority would weaken checks, accountability, and organizational ownership.',
      ['A Black Belt leads project work but normally does not control portfolio funding.','Finance validates economics but does not replace accountable sponsorship automatically.','Technical authority does not inherently confer enterprise capital-allocation authority.','Correct. Business accountability and technical assurance remain distinct but coordinated.'],'Chapter 11 - Executive and Team Leadership Roles','183-195',
      {keywords:['champion','MBB role','tollgate','funding decision','technical assurance']}),

    q6(133,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'C. Organizational Challenges',topic:'Influence strategy under informal power'},'Very Hard','Evaluate','Organizational-dynamics intervention scenario','Healthcare',
      'A respected senior clinician has no formal project role but can stop adoption through peer influence. The sponsor proposes excluding the clinician from meetings to avoid delay. What should the MBB recommend?',
      ['Map the clinician’s interests, involve them in bounded evidence review, and define escalation if patient-safety criteria remain unresolved','Exclude the clinician and use formal authority because informal influence is outside project governance','Give the clinician unilateral approval authority because peer credibility is stronger than the sponsor’s hierarchy','Delay the project until the clinician volunteers support without any structured engagement or sponsor action'],0,
      'Informal power is part of the organizational system and should be managed openly. Early interest diagnosis, meaningful evidence review, bounded authority, and safety-based escalation can convert resistance into useful scrutiny without surrendering governance. Exclusion drives opposition underground, while unilateral veto or passive waiting gives disproportionate control.',
      ['Correct. It acknowledges informal power while preserving explicit evidence and decision boundaries.','Formal exclusion does not remove peer influence and can intensify covert resistance.','Credibility earns involvement, not unlimited authority over enterprise decisions.','Passive waiting avoids the leadership and engagement work required for change.'],'Chapter 9 - Organizational Dynamics and Intervention','157-176',
      {keywords:['informal power','stakeholder influence','resistance','decision rights','clinical change']}),

    q6(134,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'D. Organizational Change Management',topic:'Adoption versus compliance metrics'},'Very Hard','Analyze','Statistical-output interpretation','Service and transactional operations',
      'A new case-management standard launched in Week 5. Which interpretation best fits the two-series adoption chart?',
      ['Training completion proves adoption; the falling independent-use series is probably random noise','Reported compliance improved, but independent correct use deteriorated after launch, suggesting compliance theater or unresolved workflow barriers','Both measures improved because a lower independent-use percentage means less unnecessary employee discretion','The chart proves intentional falsification by individual employees and supports immediate discipline'],1,
      'Self-reported compliance rises quickly after the launch, while independently verified correct use falls from the mid-eighties to the low sixties. The divergence is a system warning: incentives, usability, definitions, or local workarounds may be producing reported compliance without real adoption. Aggregate trends motivate investigation but cannot prove individual intent.',
      ['Training or reporting activity cannot override contradictory observed behavior.','Correct. Divergent leading measures distinguish claimed compliance from effective adoption.','Lower verified correct use represents deterioration, not reduced harmful discretion.','Aggregate series do not identify which people acted intentionally or why.'],'Chapter 9 - Organizational Change Management','119-125',
      {chart:{type:'multi-time-series',title:'Reported compliance and verified adoption',xLabel:'Week',yLabel:'Percent',labels:['1','2','3','4','5','6','7','8','9','10'],series:[{label:'Reported compliance',data:[42,48,51,55,73,82,88,92,94,95]},{label:'Verified independent correct use',data:[86,85,87,84,80,75,70,66,63,61]}],yDomain:[35,100],referenceValue:5,referenceLabel:'Launch at Week 5'},altText:'A weekly chart shows reported compliance rising from 42 to 95 percent, especially after Week 5. Independently verified correct use starts near 86 percent and falls to 61 percent after launch.',interactionPurpose:'Focus or hover over weekly points to compare reported compliance with independently verified correct use before and after launch.',keywords:['change adoption','compliance theater','behavior measure','verification','change management']}),

    q6(135,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'F. Organizational Performance Metrics',topic:'Metric cascade and unintended behavior'},'Hard','Analyze','Visual evidence interpretation, non-statistical','Supply chain, logistics, and distribution',
      'The dashboard compares enterprise and local outcomes after a warehouse incentive changed. What is the best diagnosis?',
      ['The incentive succeeded because picks per labor hour rose, and all other measures should be treated as external noise','The warehouse should raise the speed target again because overtime is the only lagging metric that worsened','A local productivity gain was purchased with quality, customer, and labor losses; redesign the metric set and incentive','The four metrics cannot be interpreted together because they use different units'],2,
      'Picks per labor hour improved, but mispicks, complaints, and overtime all worsened. This is a classic local-optimization pattern in which a narrow productivity target shifts cost and risk elsewhere. A balanced metric system should connect speed with quality, customer outcome, and workforce sustainability rather than rewarding one isolated numerator.',
      ['One favorable local measure cannot establish enterprise improvement when balancing outcomes deteriorate.','Raising the same narrow target would likely amplify the observed tradeoff.','Correct. The incentive optimized a subsystem at the expense of total performance.','Different units are normal in a balanced dashboard; direction and causal relationships remain interpretable.'],'Chapter 8 - Organizational Performance Metrics','126-146',
      {chart:{type:'data-table',columns:['Metric','Before','After','Desired direction'],rows:[['Picks per labor hour','42','51','Higher'],['Mispicks per 1,000','6.2','10.8','Lower'],['Customer complaints per week','18','31','Lower'],['Overtime hours per week','74','109','Lower']]},altText:'A before-and-after dashboard shows productivity increasing from 42 to 51 picks per labor hour, while mispicks, customer complaints, and overtime all increase despite having lower-is-better goals.',keywords:['balanced metrics','local optimization','incentive','productivity','customer outcome']}),

    q6(136,'mbb-portfolio',{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Program dependency and critical path'},'Very Hard','Analyze','Multi-step quantitative','Product development and engineering',
      'The program network shows durations in weeks. A precedes B and C; B precedes D; C and D precede E. What is the earliest finish and controlling path?',
      ['11 weeks on A-C-E because C is the longest individual activity','12 weeks on A-B-D-E because both branches must be added before the merge','14 weeks on A-C-D-E because every activity before E must be sequential','13 weeks on A-B-D-E; the A-C-E path has two weeks of float'],3,
      'Path A-B-D-E is 3+4+2+4=13 weeks. Path A-C-E is 3+4+4=11 weeks. Since E waits for both C and D, the longer B-D branch controls and the C branch has two weeks of total float. Parallel work is compared at the merge; its durations are not all added serially.',
      ['A-C-E is eleven weeks but does not control the merge into E.','The correct path is identified, but its duration is understated by one week.','C does not precede D; the branches operate in parallel after A.','Correct. The controlling path is thirteen weeks and the alternate branch has two weeks of float.'],'Chapter 13 - Cross-Functional Project Assessment','196-201',
      {quantitative:true,formula:'A-B-D-E = 3+4+2+4 = 13 weeks; A-C-E = 3+4+4 = 11 weeks; float = 2 weeks.',assumptions:['Durations are deterministic and resources do not add constraints.','There are no leads, lags, or calendar differences.'],estimatedMinutes:4,chart:{type:'activity-network',title:'Program dependency network',nodes:{A:{dur:3,col:0,row:1},B:{dur:4,col:1,row:0},C:{dur:4,col:1,row:2},D:{dur:2,col:2,row:0},E:{dur:4,col:3,row:1}},edges:[['A','B'],['A','C'],['B','D'],['C','E'],['D','E']]},altText:'An activity network shows A for three weeks splitting to B and C for four weeks each. B leads to D for two weeks. C and D merge into E for four weeks.',keywords:['critical path','dependency','float','program governance','network']}),

    q6(137,'mbb-portfolio',{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Portfolio corrective action under capacity loss'},'Hard','Evaluate','Portfolio, finance, and risk scenario','Public sector, nonprofit, and regulated operations',
      'A specialist supporting four projects becomes unavailable for eight weeks. Which portfolio response is strongest?',
      ['Re-evaluate priorities, critical dependencies, substitute competence, and benefit timing; then rebaseline or pause work through the portfolio council','Ask every project to absorb an equal two-week delay so the resource loss is distributed fairly','Keep all baselines unchanged and ask project managers to report schedule variance until the specialist returns','Move the specialist’s tasks to available staff without verifying competency because schedule protection has priority'],0,
      'A shared-resource loss is a portfolio event because it changes cross-project feasibility, risk, and benefit timing. The council should evaluate where the skill is truly critical, whether qualified substitutes exist, and which commitments should move or pause. Equal delay is not necessarily optimal, hidden baselines destroy forecast integrity, and unverified substitution creates quality risk.',
      ['Correct. It treats the capacity shock as a governed portfolio optimization decision.','Equal treatment can sacrifice mandatory or critical-path work without improving total value.','Unchanged baselines conceal information needed by sponsors and downstream stakeholders.','Headcount availability is not evidence of competence for specialized work.'],'Chapter 14 - Portfolio Monitoring and Corrective Action','202-218',
      {keywords:['portfolio correction','shared resource','capacity loss','rebaseline','competence']}),

    q6(138,'mbb-portfolio',{domain:'III. Project Portfolio Management',subdomain:'C. Project Portfolio Financial Tools',topic:'NPV and IRR conflict for mutually exclusive projects'},'Very Hard','Analyze','Multi-step quantitative','Finance and insurance',
      'Two mutually exclusive projects use the same scarce platform. At the 12% hurdle rate, X has NPV $420,000 and IRR 18%; Y has NPV $510,000 and IRR 16%. Risk and strategic alignment are equivalent. Which choice maximizes enterprise value?',
      ['Select X because its IRR is two percentage points higher than Y’s','Select Y because the higher NPV at the applicable hurdle rate adds more enterprise value','Fund both because each IRR exceeds the hurdle rate and positive projects should not be rationed','Select neither until both project payback periods are identical and directly comparable'],1,
      'For mutually exclusive alternatives of equivalent risk evaluated at the correct hurdle rate, NPV measures incremental value added in currency and is the appropriate ranking criterion. Both clear the hurdle, but the shared platform prevents doing both; Y adds $90,000 more present value. IRR can rank scale and timing differently and should not override NPV here.',
      ['A higher percentage return can correspond to less total value on a smaller or differently timed investment.','Correct. Y produces the larger present-value contribution under the stated assumptions.','Mutual exclusivity means the platform cannot support both projects simultaneously.','Equal payback is neither required nor superior to risk-adjusted value maximization.'],'Chapter 16 - Project Portfolio Financial Tools','225-232',
      {quantitative:true,formula:'Incremental NPV advantage of Y = $510,000 - $420,000 = $90,000.',assumptions:['The 12% hurdle rate correctly reflects both projects’ risk.','Capital and platform capacity permit exactly one project.'],keywords:['NPV','IRR','mutually exclusive','hurdle rate','value maximization']}),

    q6(139,'mbb-portfolio',{domain:'III. Project Portfolio Management',subdomain:'C. Project Portfolio Financial Tools',topic:'Benefit realization and attribution'},'Expert','Evaluate','Portfolio, finance, and risk scenario','Manufacturing',
      'A project claims $1.8M annual savings. The benefit bridge shows $0.5M volume growth, $0.4M commodity-price decline, $0.6M verified process reduction, and $0.3M forecast avoidance. What should Finance recognize as current hard savings?',
      ['$1.8M because every favorable bridge component occurred after project launch','$1.3M after excluding only forecast avoidance but retaining all other favorable movements','$0.6M verified process reduction, with growth, market movement, and avoidance reported separately','$0.9M because verified reduction and forecast avoidance are both equivalent cash realization'],2,
      'Benefit attribution should isolate the counterfactual effect of the process change. Volume growth and commodity prices are external or business effects, not savings caused by the project. The verified $0.6M process reduction is currently realized hard benefit; the $0.3M avoidance may be valuable but remains a distinct forecast category until its defined condition and validation occur.',
      ['Timing after launch does not establish causal attribution to the improvement.','Excluding avoidance alone still credits unrelated volume and market effects.','Correct. It recognizes realized attributable savings and keeps other categories transparent.','Avoided future cost is not automatically equivalent to realized cash reduction.'],'Chapter 16 - Project Portfolio Financial Tools','225-234',
      {chart:{type:'data-table',columns:['Bridge component','Annual amount','Evidence status'],rows:[['Volume growth','$0.5M','External business change'],['Commodity-price decline','$0.4M','Market movement'],['Process-cost reduction','$0.6M','Finance verified'],['Forecast cost avoidance','$0.3M','Condition not yet realized']]},altText:'A benefit bridge table totals 1.8 million dollars: 0.5 million from volume growth, 0.4 million from commodity prices, 0.6 million verified process reduction, and 0.3 million forecast avoidance.',keywords:['benefit attribution','hard savings','cost avoidance','counterfactual','finance validation']}),

    q6(140,'mbb-training',{domain:'IV. Training Design and Delivery',subdomain:'A. Training Needs Analysis',topic:'Role-specific competency diagnosis'},'Hard','Apply','Coaching, training, and failing-project diagnosis','Healthcare',
      'Nurses know the escalation rule but frequently miss it during peak demand because alerts are buried and staffing ratios deteriorate. What should the training-needs analysis conclude?',
      ['The gap is entirely motivational because knowledge has already been demonstrated','Every nurse needs the same refresher course before workflow changes are considered','Competency assessment should be removed because system causes make individual capability irrelevant','Correct alert visibility and workload barriers, then target training only to any residual skill or judgment gap'],3,
      'A performance gap can arise from knowledge, skill, motivation, process design, tools, workload, or reinforcement. Demonstrated knowledge plus buried alerts and workload deterioration points primarily to nontraining causes. Fixing those conditions first makes residual competency needs visible and prevents training from becoming a substitute for operational control.',
      ['Knowledge evidence does not establish poor motivation and the system barriers are explicit.','Universal retraining spends capacity without addressing alert and workload conditions.','System causes do not eliminate the value of valid role-specific competency evidence.','Correct. It sequences system correction before targeted capability development.'],'Chapter 17 - Training Needs Analysis','236-244',
      {keywords:['training needs','nontraining cause','workflow','workload','competency']}),

    q6(141,'mbb-training',{domain:'IV. Training Design and Delivery',subdomain:'B. Training Plan Elements',topic:'Scalable multi-level training architecture'},'Very Hard','Create','Coaching, training, and failing-project diagnosis','Cross-industry enterprise/deployment case',
      'An enterprise must train executives, champions, Green Belts, Black Belts, and process owners across three regions without diluting role accountability. Which architecture is strongest?',
      ['Define role outcomes and common governance, use modular regional delivery with calibrated faculty, and require coached application plus certification evidence','Give every role the complete Black Belt curriculum so all participants share identical statistical depth','Let each region define its own roles, methods, assessments, and credentials to maximize cultural fit','Use self-paced content only because instructor calibration creates unnecessary deployment overhead'],0,
      'A scalable plan differentiates what each role must decide and do while preserving common language, governance, and credential integrity. Modular delivery supports regional examples and schedules; faculty calibration controls variation; coached application and performance evidence go beyond attendance. Identical curricula waste effort, full autonomy fragments the system, and self-study alone cannot validate complex performance.',
      ['Correct. It combines role specificity, regional adaptation, transfer, and enterprise assurance.','Executives and owners need different competencies from technical Belt practitioners.','Independent role and credential definitions prevent enterprise comparability and mobility.','Self-paced learning can contribute but cannot replace facilitation, practice, coaching, and assessment.'],'Chapter 18 - Training Plan Elements','245-255',
      {keywords:['training plan','role-based learning','faculty calibration','certification','scalability']}),

    q6(142,'mbb-training',{domain:'IV. Training Design and Delivery',subdomain:'D. Training Program Effectiveness',topic:'Evaluation design for transfer'},'Hard','Evaluate','Coaching, training, and failing-project diagnosis','Service and transactional operations',
      'A course receives high satisfaction ratings, but supervisors report no change in escalation behavior. Which next evaluation step is most defensible?',
      ['Repeat the satisfaction survey with more response categories to improve measurement sensitivity','Observe behavior against a defined rubric, verify opportunity and reinforcement, and compare trained with credible baseline or phased groups','Claim success from satisfaction because behavior is controlled by supervisors rather than training','Add a harder final exam and assume any score increase will establish workplace transfer'],1,
      'Reaction data answer whether learners liked or valued the experience; they do not establish transfer. Direct behavioral evidence, opportunity to perform, manager reinforcement, and a credible comparison help distinguish course design from environmental constraints. A harder knowledge test may improve learning evidence but still cannot demonstrate that behavior changed at work.',
      ['More precise reaction data remain reaction data and do not measure transfer.','Correct. It measures behavior and examines conditions required for performance.','Supervisory influence is a factor to evaluate, not a reason to declare training successful.','Knowledge improvement is not equivalent to reliable on-job behavior.'],'Chapter 20 - Training Program Effectiveness','285-292',
      {keywords:['training evaluation','behavior transfer','comparison group','reinforcement','rubric']}),

    q6(143,'mbb-coaching',{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'A. Executives and Champions',topic:'Executive review operating system'},'Expert','Create','Leadership, deployment, and best-next-action scenario','Finance and insurance',
      'Executive project reviews have become ninety-minute presentations with no decisions, unresolved barriers, and repeated benefit disputes. What should the MBB redesign?',
      ['Shorten every presentation to ten minutes but retain the same agenda and decision process','Move all reviews to email so leaders can approve projects independently without shared discussion','Create a decision cadence with pre-read evidence, explicit gate criteria, named owners, logged actions, and prior Finance validation','Let each Black Belt choose the review format because project context determines whether decisions are necessary'],2,
      'Executive reviews should govern decisions, resources, risks, benefits, and learning rather than reward presentation volume. Pre-reads protect meeting time; gate criteria and owners clarify authority; action logs close barriers; prior Finance validation prevents recurring disputes. Merely shortening or digitizing the same weak process does not create accountable decisions.',
      ['Time limits may help, but they do not repair missing criteria, ownership, or preparation.','Asynchronous review alone can fragment decisions and obscure cross-project dependencies.','Correct. It turns the review into a repeatable governance and decision mechanism.','Project variation does not remove the need for consistent evidence and accountable decisions.'],'Chapter 21 - Coaching Executives and Champions','294-305',
      {keywords:['executive review','tollgate','decision rights','pre-read','finance validation']}),

    q6(144,'mbb-coaching',{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'B. Teams and Individuals',topic:'Recovery of a psychologically unsafe team'},'Very Hard','Create','Coaching, training, and failing-project diagnosis','Product development and engineering',
      'A Black Belt dominates meetings, dismisses operators, and presents only analyses supporting a preferred cause. Team members have stopped raising contradictory evidence. What should the MBB do?',
      ['Replace every operator immediately so the project can proceed without interpersonal distraction','Privately tell the team to challenge the Belt more forcefully while leaving meeting practices unchanged','Take over the project analysis permanently and reduce the Belt to routine data collection and reporting','Set behavioral expectations, surface disconfirming evidence through structured facilitation, coach the Belt, and monitor recovery with the sponsor'],3,
      'The technical and social systems are now coupled: confirmation bias and low psychological safety threaten evidence quality. The MBB should intervene explicitly, create equal evidence channels, invite disconfirmation, coach the Belt’s behavior and reasoning, and involve the sponsor in sustained accountability. Replacement or takeover may become necessary, but first-line recovery should build team capability and restore valid inquiry.',
      ['Immediate wholesale replacement discards knowledge before a structured recovery attempt.','Telling low-power members to push harder leaves the unsafe facilitation system intact.','Permanent takeover prevents the Belt and team from developing the required capability.','Correct. It addresses behavior, evidence integrity, coaching, facilitation, and accountability together.'],'Chapter 22 - Coaching Teams and Individuals','306-314',
      {keywords:['psychological safety','confirmation bias','team facilitation','coaching','disconfirming evidence']}),

    q6(145,'mbb-coaching',{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'B. Teams and Individuals',topic:'Mentoring boundaries and credential integrity'},'Hard','Understand','Advanced conceptual/method-selection','Cross-industry enterprise/deployment case',
      'A mentee asks the MBB to provide the final analysis file for a certification project so the mentee can meet a deadline. What is the appropriate response?',
      ['Decline to substitute for competence; coach the reasoning, provide practice, and escalate timeline or support needs transparently','Provide the final file but ask the mentee to rewrite the conclusion independently in their own words','Complete only the difficult model-selection section because partial substitution preserves credential integrity','Approve certification based on effort and require the mentee to demonstrate the analysis on a later project'],0,
      'Mentoring supports learning without misrepresenting who demonstrated competence. Giving the final analysis would undermine credential integrity and prevent diagnosis of the learner’s gap. The MBB can scaffold the work, review attempts, create practice, and work with the program owner on a transparent extension or support plan while preserving the assessment standard.',
      ['Correct. It supports development while keeping performance evidence authentic.','Rewording a supplied analysis does not demonstrate independent analytical competence.','Substituting on the hardest section still corrupts the evidence used for certification.','Effort matters developmentally but cannot replace required demonstrated competence.'],'Chapter 23 - Mentoring and Non-Belt Development','315-317',
      {keywords:['mentoring','credential integrity','competence','coaching boundary','certification']}),

    q6(146,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. MSA, Process Capability, and Control',topic:'Attribute agreement with prevalence effects'},'Hard','Apply','Statistical-output interpretation','Healthcare',
      'An attribute study has 96% overall agreement but kappa 0.38. The table shows that only 4% of cases are truly positive. What should the MBB conclude?',
      ['The measurement system is excellent because overall agreement exceeds 90% under every prevalence condition','High raw agreement is inflated by the dominant negative class; examine class agreement, appraiser bias, and prevalence effects before approval','Kappa must equal raw agreement when the reference standard is valid, so the calculation is necessarily wrong','Increase the number of negative cases because greater class imbalance will stabilize kappa and prove agreement'],1,
      'With rare positives, appraisers can agree frequently by calling nearly everything negative. Raw agreement therefore conceals clinically important positive misses, while kappa reflects chance agreement and may be sensitive to prevalence. Approval requires the confusion structure, positive and negative agreement, appraiser patterns, reference quality, and operational consequences rather than one summary statistic.',
      ['High overall agreement can be misleading when one category overwhelmingly dominates.','Correct. The prevalence imbalance requires class-specific and operational interpretation.','Raw agreement and chance-corrected agreement answer different questions and need not match.','Adding more dominant negatives increases imbalance and does not test positive discrimination.'],'Chapter 24 - Attribute Measurement Systems Analysis','318-334',
      {chart:{type:'data-table',columns:['Reference / rating','Positive call','Negative call','Total'],rows:[['Reference positive','27','53','80'],['Reference negative','27','1,893','1,920'],['Total','54','1,946','2,000']]},altText:'An attribute agreement table shows 80 reference-positive cases and 1,920 reference-negative cases. Appraisers correctly call 27 positives and 1,893 negatives, producing 96 percent overall agreement but many positive misses.',keywords:['attribute MSA','kappa','prevalence','class agreement','misclassification']}),

    q6(147,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'ARIMA residual adequacy'},'Very Hard','Apply','Statistical-output interpretation','Supply chain, logistics, and distribution',
      'After fitting a seasonal forecasting model, residual ACF spikes at lags 1 and 12 exceed the approximate 95% bounds. What is the best next action?',
      ['Approve the model because a residual mean of zero is sufficient for unbiased forecasting and uncertainty','Add arbitrary predictors until both spikes move inside the bounds, regardless of causal meaning','Revisit nonseasonal and seasonal dependence, refit parsimoniously, and validate residual whiteness and forecast performance out of sample','Difference the series at every lag from 1 through 12 and fit an ordinary regression model'],2,
      'Residuals should approximate white noise if the model has captured systematic time dependence. Significant lag-1 and lag-12 spikes indicate remaining short-run and seasonal structure, so standard errors and forecasts may be overconfident. The MBB should revisit orders or seasonal differencing with parsimonious diagnostics, then confirm out-of-sample performance rather than chase in-sample ACF mechanically.',
      ['Zero mean does not eliminate serial structure or guarantee calibrated forecast uncertainty.','Arbitrary predictors create overfitting and do not represent a defensible time-series mechanism.','Correct. It diagnoses both dependence scales and requires residual and forecast validation.','Differencing at every lag would overtransform the series and destroy interpretable structure.'],'Chapter 25 - Time Series and Autocorrelation','353-373',
      {chart:{type:'acf-plot',title:'Forecast-model residual ACF',xLabel:'Lag',yLabel:'Autocorrelation',lags:[1,2,3,4,5,6,7,8,9,10,11,12],values:[0.34,0.11,-0.08,0.04,0.02,-0.06,0.07,0.03,-0.05,0.09,0.12,0.41],confidence:0.22},altText:'A residual autocorrelation plot has approximate bounds plus or minus 0.22. Lag 1 is 0.34 and lag 12 is 0.41; all other lags remain within the bounds.',interactionPurpose:'Focus or hover over the bars to compare short-run lag 1 and seasonal lag 12 with the confidence bounds.',keywords:['ARIMA','residual ACF','seasonality','white noise','forecast validation']}),

    q6(148,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'C. Design of Experiments',topic:'Response-surface stationary point diagnosis'},'Expert','Analyze','DOE/optimization design and diagnosis','Manufacturing',
      'The fitted response surface is y = 82 + 6A + 4B - 3A² - 2B² - 2AB in coded units. The contour display closes around a point near A=0.8, B=0.6. Which interpretation is defensible?',
      ['The point is a saddle because every fitted model containing an interaction term has mixed curvature','The point is a minimum because both linear coefficients are positive and point upward from the origin','The model is strictly linear within the region because coded factors remove quadratic curvature','The stationary point is a local maximum if the quadratic-form eigenvalues are both negative; confirm with canonical analysis and validation runs'],3,
      'A stationary point is classified from the quadratic form, not from the mere presence of interaction or the signs of linear terms. Here the quadratic matrix has negative diagonal curvature and eigenvalues that are both negative, indicating concavity and a local maximum. Canonical analysis locates and classifies it, while confirmation runs test prediction and practical feasibility.',
      ['An interaction rotates contours but does not by itself imply a saddle.','Positive linear terms describe slope near the origin, not stationary-point curvature.','Coding changes scale and origin but does not remove fitted quadratic terms.','Correct. Negative eigenvalues classify a maximum, subject to confirmation and region validity.'],'Chapter 26 - Response Surface Methodology','439-442',
      {quantitative:true,formula:'Quadratic matrix Q=[[-3,-1],[-1,-2]] has eigenvalues (-5 ± sqrt(5))/2, both negative; stationary point solves [6,4] + 2Q[A,B]=0, giving A=0.8 and B=0.6.',assumptions:['The coded experimental region contains the stationary point.','Residual and lack-of-fit diagnostics are acceptable.'],estimatedMinutes:5,chart:{type:'contour-plot',title:'Fitted yield response surface',xLabel:'A: temperature (coded)',yLabel:'B: residence time (coded)',xDomain:[-1.5,1.5],yDomain:[-1.5,1.5],xTicks:[-1.5,-0.5,0.5,1.5],yTicks:[-1.5,-0.5,0.5,1.5],model:'82 + 6A + 4B - 3A² - 2B² - 2AB',center:[0.8,0.6],contours:[{level:70,radiusX:1.35,radiusY:1.1},{level:76,radiusX:1.0,radiusY:0.8},{level:81,radiusX:0.62,radiusY:0.48},{level:84,radiusX:0.28,radiusY:0.21}],current:{x:0,y:0,label:'Current setting'}},altText:'A response-surface contour plot shows nested closed contours centered near coded A equal to 0.8 and B equal to 0.6, with fitted response increasing toward the center.',keywords:['response surface','stationary point','canonical analysis','eigenvalues','local maximum']}),

    q6(149,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Monte Carlo decision risk and model governance'},'Expert','Evaluate','Multi-step quantitative','Finance and insurance',
      'A simulation estimates project NPV with mean $0.9M, 5th percentile -$0.8M, and 95th percentile $3.4M. The sponsor reports only the positive mean. What should the MBB require?',
      ['Report probability of loss and tail exposure, validate dependencies and inputs, and compare the risk profile with enterprise appetite','Approve the project because a positive expected NPV makes downside percentiles and liquidity risk irrelevant','Replace the simulation with one deterministic best case so leadership receives a clear decision','Reject the project automatically because any negative 5th percentile violates value maximization'],0,
      'Expected value is only one feature of a decision distribution. Leadership also needs probability and magnitude of loss, liquidity or safety consequences, correlations, model uncertainty, and sensitivity to influential inputs. The 5th percentile signals meaningful downside but does not dictate rejection without risk appetite and strategic context. Transparent model governance prevents false precision.',
      ['Correct. It turns a selective mean into a governed risk-and-value decision profile.','A positive mean can coexist with unacceptable downside or liquidity exposure.','A deterministic best case removes rather than communicates uncertainty.','Tail loss requires evaluation against risk appetite, not an automatic universal rule.'],'Chapter 25 - Monte Carlo Simulation','414-416',
      {quantitative:true,formula:'Decision evidence includes E(NPV), P(NPV<0), selected tail quantiles, sensitivities, and input-dependence validation.',assumptions:['The stated percentiles come from the same internally consistent simulation.'],keywords:['Monte Carlo','tail risk','probability of loss','risk appetite','model governance']}),

    q6(150,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. MSA, Process Capability, and Control',topic:'APC and SPC complementary roles'},'Very Hard','Understand','Advanced conceptual/method-selection','Manufacturing',
      'A feedback controller keeps furnace temperature close to set point, yet controller output gradually increases over several weeks. Why can SPC on controller output remain valuable?',
      ['SPC replaces the controller by calculating a new manipulated value after every observation','A controlled temperature proves all assignable causes have been eliminated, so output monitoring has no value','Controller output is a discrete attribute and therefore cannot be monitored statistically','The controller can mask process drift in the controlled variable; output SPC can reveal increasing compensation and maintenance needs'],1,
      'Automatic control acts to hold the response near target, so the controlled variable may look stable while the manipulated variable works progressively harder against fouling, wear, or disturbance. Monitoring controller output or residual error with an appropriate SPC strategy can expose that hidden process change. APC regulates; SPC detects changes and supports diagnosis.',
      ['SPC monitors evidence and signals change; it does not perform continuous feedback action.','Correct. Compensation can conceal deterioration in the controlled response.','Controller output is commonly continuous and can be modeled using time-ordered methods.','This option wrongly assumes a stable response proves the underlying process mechanism is unchanged.'],'Chapter 27 - Automated Process Control and SPC','451-453',
      {keywords:['APC','SPC','controller output','masked drift','feedback control']})
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
    q7(151,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'A. Strategic Plan Development',topic:'Strategy deployment leading-indicator integrity'},'Very Hard','Analyze','Visual evidence interpretation, non-statistical','Manufacturing',
      'An executive team proposes the strategy-deployment scorecard below. Which revision would most improve its ability to guide execution before year-end results are known?',
      ['Replace the customer outcome with monthly revenue because financial measures are always more actionable','Remove the process measure because operational indicators should remain outside strategic governance','Average every metric into one index so leaders cannot overreact to individual signals','Add a verified leading measure for the maintenance initiative and define its causal link to reliability'],3,
      'A deployment scorecard should connect strategic outcomes to the controllable means expected to create them. The maintenance row has a lagging reliability outcome but no measure of whether the critical preventive work is being executed effectively. A verified leading measure, such as risk-based work completed on time, gives leaders earlier evidence while retaining the outcome needed to validate the assumed causal relationship. Collapsing unlike measures or excluding operational drivers would weaken diagnosis.',
      ['Revenue is another lagging outcome and would not expose whether the initiative is being executed.','Strategic review requires the few operational drivers that test the deployment theory.','A composite index can conceal offsetting failures and destroys useful diagnostic information.','Correct. A causally linked leading measure permits timely action and later validation against reliability.'],'Chapter 1 - Strategic Plan Development','7-17',
      {chart:{type:'data-table',columns:['Strategic objective','Initiative','Leading measure','Outcome measure'],rows:[['Improve delivery reliability','Risk-based maintenance','Blank','On-time delivery'],['Reduce complaint recurrence','Closed-loop corrective action','Actions verified on time','Repeat complaints'],['Increase digital adoption','Role-based workflow coaching','Active weekly users','Digital completion rate']]},altText:'A three-row strategy scorecard shows leading and outcome measures. The maintenance initiative has a blank leading-measure cell while the other initiatives have both types.',keywords:['strategy deployment','leading indicator','lagging indicator','causal linkage','scorecard']}),

    q7(152,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'B. Strategic Plan Alignment',topic:'Scenario-triggered strategy adaptation'},'Hard','Evaluate','Leadership, deployment, and best-next-action scenario','Supply chain, logistics, and distribution',
      'A distribution network approved a two-year automation roadmap assuming stable order mix. Three months later, low-volume customized orders double and invalidate the capacity model. What should the MBB recommend first?',
      ['Reopen the explicit planning assumptions, quantify the trigger breach, and test revised scenarios before changing the portfolio','Continue the roadmap until annual planning because changing assumptions between cycles undermines leadership discipline','Cancel every automation project because the original business case no longer represents the observed order mix','Raise all project benefit targets enough to offset the modeled loss without changing scope or resource demand'],0,
      'Strategic plans are hypotheses built on assumptions about customers, demand, technology, regulation, and capability. When a predefined trigger or material environmental shift invalidates an assumption, disciplined adaptation begins by making the breach visible and evaluating coherent scenarios. That evidence may support continuation, redesign, resequencing, or termination. Automatic cancellation and artificial benefit inflation bypass governance, while waiting for the calendar preserves a plan whose decision basis is already obsolete.',
      ['Correct. It converts the changed environment into governed evidence before irreversible portfolio action.','Planning discipline includes controlled adaptation when critical assumptions fail, not blind calendar compliance.','Some initiatives may remain valuable after redesign, so universal cancellation is premature.','Changing benefit targets without changing causal means creates an unsupported financial promise.'],'Chapter 1 - Strategic Planning and Alignment','2-27',
      {keywords:['scenario planning','strategic assumptions','trigger','portfolio adaptation','environmental scan']}),

    q7(153,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'C. Infrastructure Elements of Improvement Systems',topic:'Federated governance with common standards'},'Expert','Understand','Leadership, deployment, and best-next-action scenario','Cross-industry enterprise/deployment case',
      'A global deployment has mature local improvement teams but inconsistent project definitions, financial validation, and certification decisions. Which operating model best preserves local responsiveness and enterprise comparability?',
      ['Centralize every improvement decision and require corporate approval for all local experiments and team meetings','Establish enterprise minimum standards, shared data and finance controls, and federated local execution with exception escalation','Allow each site to define savings and certification independently, then normalize the reported totals at year end','Replace local teams with a rotating corporate task force that owns all projects until deployment maturity is uniform'],1,
      'A mature deployment needs a stable enterprise backbone without suppressing local knowledge. Common charter criteria, data definitions, financial validation, competency standards, and escalation rules make performance comparable and protect credential integrity. Federated execution lets sites tailor methods and pace to their context within those guardrails. Full centralization becomes a bottleneck; complete autonomy institutionalizes incomparable evidence; a traveling task force does not build durable local capability.',
      ['Universal corporate approval would slow learning and move decisions away from process knowledge.','Correct. Common governance controls coexist with locally responsive execution and ownership.','Year-end normalization cannot repair inconsistent definitions or unvalidated decisions retrospectively.','A temporary central team creates dependence rather than a scalable improvement infrastructure.'],'Chapter 3 - Six Sigma Improvement Methodologies and Deployment Models','28-52',
      {keywords:['deployment infrastructure','federated governance','standards','local ownership','escalation']}),

    q7(154,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'E. Opportunities for Improvement',topic:'Innovation funnel evidence gates'},'Very Hard','Apply','Advanced conceptual/method-selection','Product development and engineering',
      'An innovation workshop produces 140 concepts, and executives want to charter the ten most popular ideas immediately. What should the MBB insert before project authorization?',
      ['A vote by senior leaders that ranks ideas solely by perceived strategic importance and visibility','A requirement that every idea begin as DMAIC because existing evidence is always sufficient to define defects','Evidence gates for customer need, strategic fit, feasibility, risk, value, and ownership before selecting the proper method','A rule that only ideas with immediate hard savings may proceed, regardless of learning or strategic option value'],2,
      'Divergent ideation should be followed by disciplined convergence. Popularity is not evidence that a concept addresses a validated customer or business need, is feasible, or has an accountable owner. Screening through explicit gates reduces advocacy bias and distinguishes an improvement opportunity from a design challenge, experiment, or exploratory learning option. The method should follow the problem and knowledge state; it should not be imposed before qualification.',
      ['Executive judgment matters, but an unstructured popularity vote amplifies status and advocacy bias.','DMAIC assumes an existing process and measurable problem, conditions not established for every concept.','Correct. Evidence gates qualify the opportunity and support defensible method selection.','Hard savings alone would reject regulatory, customer, capability, and strategic-option value.'],'Chapter 5 - Creativity and Innovation Tools','70-87',
      {keywords:['innovation funnel','evidence gate','project qualification','method selection','concept screening']}),

    q7(155,'mbb-enterprise',{domain:'I. Enterprise-wide Planning',subdomain:'F. Pipeline Management',topic:'Capacity-constrained pipeline selection'},'Expert','Create','Portfolio, finance, and risk scenario','Healthcare',
      'The portfolio table shows the only indivisible candidate projects. At most 10 Belt-months and $300,000 may be committed, and Project D may start only if Project B is selected. Which feasible portfolio has the highest total risk-adjusted value?',
      ['Projects A and C, using 10 Belt-months and $270,000 for $500,000 risk-adjusted value','Projects B and C, using 8 Belt-months and $210,000 for $430,000 risk-adjusted value','Projects A and B, using 9 Belt-months and $250,000 for $510,000 risk-adjusted value','Projects B and D, using 10 Belt-months and $280,000 for $540,000 risk-adjusted value'],3,
      'Feasible portfolio selection must honor resource, funding, and dependency constraints simultaneously before comparing value. A plus C is feasible and yields 500; A plus B yields 510; B plus C yields 430; and B plus D satisfies D’s dependency while yielding 540. Other combinations either exceed a constraint or violate the stated dependency. The correct decision is therefore based on the best feasible system of projects, not the highest individual project value or unused capacity alone.',
      ['This combination is feasible, but its risk-adjusted value is 40 thousand dollars lower.','This combination leaves capacity unused and produces the lowest listed feasible value.','This combination is feasible, but it produces 30 thousand dollars less risk-adjusted value.','This is the highest feasible value and it satisfies the stated dependency and both resource limits.'],'Chapter 6 - Project Pipeline Management','88-99',
      {quantitative:true,formula:'Compare feasible sums subject to Belt-months <= 10, funding <= $300k, and D implies B: AC=500, BD=540, AB=510, BC=430 ($000).',assumptions:['Projects are indivisible and all benefits use the same risk-adjusted basis.','No unlisted dependency or capacity constraint applies.'],estimatedMinutes:5,chart:{type:'data-table',columns:['Project','Belt-months','Funding ($000)','Risk-adjusted value ($000)','Dependency'],rows:[['A','5','150','300','None'],['B','4','100','210','None'],['C','5','120','200','None'],['D','6','180','330','Requires B']],whatIf:{id:'mbb-q155-capacity',label:'Available Belt-months',min:8,max:12,step:1,value:10,unit:'Belt-months',committed:10,committedLabel:'candidate portfolio B plus D'}},altText:'A candidate-project table lists Belt-months, funding, risk-adjusted value, and dependencies for four projects. A capacity control is set to 10 Belt-months, the amount needed by candidate portfolio B plus D.',interactionPurpose:'Adjust available Belt-months and compare the B-plus-D candidate with capacity, funding, dependency, and competing feasible portfolios.',keywords:['pipeline optimization','capacity constraint','dependency','risk-adjusted value','portfolio selection']}),

    q7(156,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'A. Organizational Design',topic:'Systems archetype and local optimization'},'Hard','Understand','Organizational-dynamics intervention scenario','Service and transactional operations',
      'A call center rewards agents for short calls. Calls become shorter, repeat contacts rise, queues grow, and managers respond by tightening the call-time target. Which diagnosis should guide the MBB?',
      ['The reinforcing policy creates failure demand, so redesign measures around end-to-end resolution and test the feedback loop','The agents need refresher training because repeat contacts prove they do not understand the call script','The target should be reduced further because stronger pressure will eventually eliminate variation in handling time','The repeat contacts are external noise and should be removed from the scorecard before evaluating agent performance'],0,
      'The pattern is a system response, not merely an individual skill gap. A narrow local metric rewards transferring work into the future: shorter initial contacts generate unresolved issues, repeat demand, and larger queues, which then provoke more pressure on call time. The MBB should make the feedback structure visible and balance efficiency with end-to-end resolution, customer outcome, and demand created by failure. Training without changing reinforcement leaves the causal policy intact.',
      ['Correct. It addresses the policy-generated feedback loop and the system outcome rather than blaming agents.','A script course cannot offset incentives that reward ending calls before durable resolution.','More pressure strengthens the same loop and is likely to increase failure demand.','Removing repeat demand conceals a critical consequence of the operating policy.'],'Chapter 7 - Systems Thinking','100-112',
      {keywords:['systems thinking','failure demand','local optimization','feedback loop','metric design']}),

    q7(157,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'B. Executive and Team Leadership Roles',topic:'Sponsor ownership and MBB escalation'},'Very Hard','Evaluate','Leadership, deployment, and best-next-action scenario','Finance and insurance',
      'A cross-functional project repeatedly misses milestones because two vice presidents will not release subject-matter experts. The sponsor asks the Black Belt to negotiate indefinitely. What is the MBB’s best response?',
      ['Take permanent ownership of staffing decisions so the sponsor can remain neutral during the project','Escalate the unresolved resource decision through the agreed governance path and coach the sponsor to exercise accountability','Tell the Black Belt to remove both functions from scope so the project can report schedule recovery','Suspend all analysis and certify the project complete because the delay is outside the team’s direct control'],1,
      'The Black Belt can facilitate and surface evidence, but cannot resolve an enterprise priority conflict that requires executive authority. The sponsor or champion is accountable for securing resources and removing organizational barriers. The MBB should coach that role, document impact and alternatives, and use the established escalation mechanism when the decision remains blocked. Quietly shrinking scope or assuming executive authority would obscure governance failure and threaten benefit realization.',
      ['An MBB supports governance but should not silently absorb executive decision rights.','Correct. It restores sponsor accountability while using transparent evidence and escalation.','Deleting affected functions may destroy the charter outcome and rewards resource withholding.','An external barrier is a reason for governance action, not unsupported project certification.'],'Chapter 14 - Executive and Team Leadership Roles','183-195',
      {keywords:['sponsor','champion','resource escalation','governance','role accountability']}),

    q7(158,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'D. Organizational Change Management',topic:'Adoption depth versus compliance'},'Very Hard','Analyze','Statistical-output interpretation','Public sector, nonprofit, and regulated operations',
      'A new case-management workflow reaches 96% recorded compliance after week 4, but independent use and exception-resolution performance follow the trends shown. What conclusion is most defensible?',
      ['The change is institutionalized because recorded compliance exceeds the customary 95% threshold','The trend proves the workflow itself is defective and should be removed without further diagnosis','Recorded compliance overstates adoption; diagnose workarounds and capability barriers before declaring sustainment','The organization should stop reinforcement because continued coaching creates dependence by definition'],2,
      'Institutionalization requires evidence that people can and do use the new process effectively under normal and exceptional conditions. The display separates a documentation-oriented compliance measure from independent use and correct exception handling, both of which plateau materially lower. That gap is consistent with workarounds, access barriers, weak confidence, or inadequate process design. The MBB should investigate those mechanisms and strengthen reinforcement rather than treating a high reporting rate as proof of embedded behavior.',
      ['A compliance threshold cannot substitute for behavior and outcome evidence across realistic conditions.','The evidence identifies an adoption gap but does not isolate the workflow as its cause.','Correct. Multiple behavioral measures show that nominal compliance is not equivalent to durable adoption.','Targeted reinforcement can build independence when based on diagnosed barriers and fading support.'],'Chapter 9 - Organizational Change Management','119-125',
      {chart:{type:'multi-time-series',title:'Workflow adoption evidence',xLabel:'Week',yLabel:'Percent',labels:['1','2','3','4','5','6','7','8'],yDomain:[0,100],series:[{label:'Recorded compliance',data:[42,68,88,96,97,96,97,96]},{label:'Independent use',data:[24,39,55,66,70,72,71,73]},{label:'Correct exception resolution',data:[20,31,44,53,57,59,58,60]}]},altText:'An eight-week chart shows recorded compliance rising to about 96 percent, while independent use levels near 73 percent and correct exception resolution near 60 percent.',interactionPurpose:'Focus or hover over weekly points to compare reported compliance with independent behavior and exception-handling performance.',keywords:['change adoption','compliance','independent use','workaround','sustainment']}),

    q7(159,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'C. Organizational Challenges',topic:'Interest-based conflict and decision criteria'},'Hard','Apply','Organizational-dynamics intervention scenario','Healthcare',
      'Operations and clinical leaders argue over a standardization proposal. Both repeat fixed positions, while their underlying concerns are flow stability and patient-specific judgment. What should the MBB do next?',
      ['Ask the more senior leader to decide immediately so the team can avoid further relationship conflict','Delay the decision until one group voluntarily withdraws its position after reviewing the same presentation','Split the available process steps equally between the two proposals even if neither meets the charter need','Separate positions from interests, establish shared decision criteria, and test options that protect both concerns'],3,
      'Position-based bargaining encourages advocacy and compromise disconnected from the problem. The MBB should surface the legitimate interests beneath each position, convert them into transparent criteria such as safety, variation, flow, and exception conditions, and facilitate evidence-based option generation. A standard with explicit clinical exception logic may satisfy both interests. Authority, arbitrary splitting, and passive delay can end a meeting but do not create a durable, fact-based agreement.',
      ['Authority may be needed later, but premature escalation suppresses information and joint problem solving.','Passive delay preserves the same positional conflict and provides no decision process.','Equal division is procedurally simple but may fail both safety and performance objectives.','Correct. Interests and shared criteria enable options that address the real system requirements.'],'Chapter 13 - Conflict Management','177-182',
      {keywords:['conflict management','positions','interests','decision criteria','facilitation']}),

    q7(160,'mbb-org',{domain:'II. Organizational Competencies for Deployment',subdomain:'F. Organizational Performance Metrics',topic:'Metric gaming and balanced evidence'},'Expert','Create','Leadership, deployment, and best-next-action scenario','Supply chain, logistics, and distribution',
      'A warehouse bonus is based only on orders shipped per labor hour. Productivity rises, but expedited freight, picking errors, and employee turnover also rise. Which redesign is strongest?',
      ['Retain the productivity target and exclude the other outcomes because they are owned by separate departments','Replace productivity with turnover alone so employees no longer experience pressure to meet customer demand','Use a balanced metric family with productivity, quality, service, workforce, and cost guardrails plus review of gaming signals','Average all available measures without weights or thresholds so no single metric can influence local behavior'],2,
      'Measures shape behavior, especially when tied to incentives. A single throughput ratio encourages shifting cost and risk into quality, service, freight, and people outcomes. A balanced family should include the strategic result, controllable leading drivers, and explicit guardrails that prevent apparent gains from degrading the wider system. Governance must also examine definitions and gaming behavior. Replacing one narrow metric with another or averaging unlike measures without decision rules does not solve the design problem.',
      ['Department ownership does not remove enterprise consequences or the incentive to transfer harm.','Turnover alone is another incomplete outcome and would conceal customer and cost performance.','Correct. A balanced family protects system performance while retaining accountable productivity evidence.','An unstructured average can hide a severe guardrail breach behind improvement elsewhere.'],'Chapter 10 - Organizational Performance Metrics','126-146',
      {keywords:['balanced metrics','gaming','guardrail','incentive design','system performance']}),

    q7(161,'mbb-portfolio',{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Earned-value recovery diagnosis'},'Very Hard','Analyze','Multi-step quantitative','Product development and engineering',
      'A program has BAC=$1.20M, PV=$600k, EV=$480k, and AC=$550k. If current cost efficiency continues, which diagnosis and estimate are most defensible?',
      ['CPI=1.15 and SPI=1.25; forecast completion below $1.05M because value exceeds both plans','CPI=0.87 and SPI=0.80; forecast about $1.38M and require recovery analysis before rebaselining','CPI=0.80 and SPI=0.87; forecast exactly $1.50M because schedule variance determines final cost','CPI=0.92 and SPI=1.09; retain the baseline because both indices remain within ten percent of one'],1,
      'Cost performance index is EV divided by AC, or 480/550=0.873. Schedule performance index is EV divided by PV, or 480/600=0.800. Both indicate adverse performance. Under the explicitly stated assumption that current cost efficiency continues, EAC=BAC/CPI=1.20/0.873, approximately $1.375M. The indices diagnose deviation; they do not authorize an automatic baseline reset. Governance should evaluate causes, remaining risk, dependencies, and credible corrective actions first.',
      ['Both ratios are inverted, which would incorrectly portray adverse performance as favorable.','Correct. The indices and forecast follow the stated formulas and preserve baseline integrity.','The labels are reversed and SPI alone does not mechanically determine the cost forecast.','None of these ratios matches the displayed earned-value inputs.'],'Chapter 16 - Project Portfolio Management','202-218',
      {quantitative:true,formula:'CPI=EV/AC=480/550=0.873; SPI=EV/PV=480/600=0.800; EAC=BAC/CPI=1.20/0.873=$1.375M.',assumptions:['Current cost efficiency continues for the remaining work.','BAC, PV, EV, and AC use the same status date and approved baseline.'],estimatedMinutes:5,chart:{type:'data-table',columns:['Earned-value measure','Amount ($000)'],rows:[['Budget at completion (BAC)','1,200'],['Planned value (PV)','600'],['Earned value (EV)','480'],['Actual cost (AC)','550']]},altText:'An earned-value table shows BAC 1.2 million dollars, PV 600 thousand, EV 480 thousand, and AC 550 thousand.',keywords:['earned value','CPI','SPI','EAC','baseline integrity']}),

    q7(162,'mbb-portfolio',{domain:'III. Project Portfolio Management',subdomain:'B. Project Portfolio Infrastructure and Management',topic:'Evidence-based project termination'},'Very Hard','Evaluate','Portfolio, finance, and risk scenario','Finance and insurance',
      'A project has spent 70% of its budget. New regulatory evidence eliminates most expected benefit, but the sponsor argues that stopping would waste the investment. What should govern the portfolio decision?',
      ['Compare remaining incremental value, cost, risk, strategic fit, and opportunity cost; treat prior spending as sunk','Continue because projects beyond the midpoint should be protected from changes in external assumptions','Suspend the project but reserve all assigned specialists so restart remains possible without remobilization','Complete the original scope, then classify the unrealized benefit as cost avoidance in the financial report'],0,
      'Money already spent cannot be recovered by continuing and therefore should not dominate the forward decision. Portfolio governance should compare the expected incremental benefits of remaining work with remaining cost, risk, strategic fit, regulatory feasibility, and the value of alternative uses for scarce resources. Termination may be correct even late in execution, but it should be evidence based and include orderly closure, learning capture, stakeholder communication, and resource reallocation.',
      ['Correct. Forward incremental economics and opportunity cost avoid the sunk-cost fallacy.','Stage or percent complete does not override a material change in the project value proposition.','Holding scarce resources without a justified option value preserves the portfolio constraint.','Relabeling an eliminated benefit would misrepresent financial performance and governance evidence.'],'Chapter 16 - Project Portfolio Management','211-224',
      {keywords:['project termination','sunk cost','opportunity cost','incremental value','portfolio governance']}),

    q7(163,'mbb-training',{domain:'IV. Training Design and Delivery',subdomain:'A. Training Needs Analysis',topic:'Performance-gap cause discrimination'},'Hard','Analyze','Visual evidence interpretation, non-statistical','Manufacturing',
      'The needs-analysis evidence is shown below. Which intervention should be prioritized for the largest performance gap?',
      ['Deliver the same statistical refresher to all roles because common content simplifies evaluation','Coach supervisors on motivation because low confidence is the only plausible cause of missed steps','Rewrite the analyst curriculum because analysts have the lowest observed compliance in the table','Repair operator system access and job-aid usability before assigning knowledge-based training'],3,
      'Training is appropriate when a meaningful gap is caused by missing knowledge or skill and the learner has a fair opportunity to perform. Operators show adequate knowledge but poor access and an unusable job aid, while their observed performance is lowest. Those environmental barriers would prevent transfer even after instruction. The MBB should correct them first and then reassess the residual skill gap. A uniform course wastes capacity and can falsely attribute system defects to learners.',
      ['Uniform delivery ignores different role requirements and distinct causes of the measured gaps.','The evidence does not identify supervisor motivation as the primary constraint.','Analyst performance is comparatively strong and does not represent the largest gap.','Correct. Opportunity-to-perform barriers must be removed before training is prescribed.'],'Chapter 18 - Training Needs Analysis','236-244',
      {chart:{type:'data-table',columns:['Role','Knowledge check','System access','Job aid usable','Observed correct use'],rows:[['Operators','88%','54%','42%','49%'],['Supervisors','81%','96%','91%','78%'],['Analysts','94%','100%','95%','92%']]},altText:'A role-based needs table shows operators with 88 percent knowledge but only 54 percent system access, 42 percent job-aid usability, and 49 percent correct use.',keywords:['training needs analysis','performance gap','opportunity to perform','job aid','system access']}),

    q7(164,'mbb-training',{domain:'IV. Training Design and Delivery',subdomain:'C. Training Methods and Adult Learning',topic:'Deliberate practice for complex judgment'},'Very Hard','Apply','Coaching, training, and failing-project diagnosis','Healthcare',
      'Experienced clinicians must learn to distinguish common-cause variation from clinically meaningful signals in noisy dashboards. Which learning design is strongest?',
      ['Use sequenced authentic cases with decisions, immediate explanatory feedback, reflection, and gradually reduced scaffolding','Provide a single expert lecture followed by a satisfaction survey because the learners already have domain experience','Assign the handbook for independent reading and certify anyone who completes every chapter by the deadline','Demonstrate one ideal dashboard and require learners to reproduce the instructor’s verbal explanation exactly'],0,
      'Complex pattern recognition and judgment improve through active retrieval, varied authentic examples, feedback, and reflection rather than passive exposure alone. Sequencing cases from supported to independent performance manages cognitive load while allowing learners to discriminate similar patterns and explain their decisions. Experienced adults also need relevance and the opportunity to connect new analytical concepts to prior clinical knowledge. Attendance, completion, or imitation does not demonstrate transferable judgment.',
      ['Correct. Authentic deliberate practice with fading support develops and tests transfer of judgment.','A lecture may introduce concepts, but satisfaction cannot establish accurate application in noisy cases.','Completion is exposure evidence and provides no observation of decision quality or transfer.','Exact imitation of one example encourages surface recall rather than discrimination across conditions.'],'Chapter 20 - Training Methods and Adult Learning','256-283',
      {keywords:['adult learning','deliberate practice','feedback','scaffolding','transfer']}),

    q7(165,'mbb-training',{domain:'IV. Training Design and Delivery',subdomain:'D. Training Program Effectiveness',topic:'Causal evaluation of training transfer'},'Hard','Create','Coaching, training, and failing-project diagnosis','Service and transactional operations',
      'A new problem-solving course is rolled out while software and incentive changes occur simultaneously. Leaders want to claim the subsequent defect reduction as training impact. What evaluation design should the MBB propose?',
      ['Compare post-course defects with the historical maximum and attribute any improvement below that value to training','Define behavior and result measures, use a credible comparison or staggered rollout, check baseline trends, and document co-interventions','Survey managers on whether graduates seem more analytical and convert the favorable ratings into estimated savings','Measure knowledge immediately after class and assume that the same percentage gain transfers to operational defects'],1,
      'A defensible evaluation distinguishes learning, workplace behavior, and business results while addressing alternative explanations. A comparison group or phased rollout, pre-intervention trend evidence, implementation fidelity, and explicit tracking of software and incentive changes strengthen attribution. No observational design guarantees perfect causality, so uncertainty should be reported. Historical extremes, perceptions, and immediate knowledge scores cannot isolate the contribution of training to later process performance.',
      ['A historical maximum is a biased reference and does not control trend or concurrent changes.','Correct. The design triangulates transfer and outcomes while making causal limitations visible.','Manager impressions can complement evidence but cannot support quantified causal savings alone.','Learning is necessary but does not guarantee opportunity, behavior, or operational results.'],'Chapter 22 - Training Program Effectiveness','285-292',
      {keywords:['training evaluation','comparison group','staggered rollout','transfer','causal attribution']}),

    q7(166,'mbb-coaching',{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'A. Executives and Champions',topic:'Champion decision quality at tollgates'},'Very Hard','Evaluate','Leadership, deployment, and best-next-action scenario','Cross-industry enterprise/deployment case',
      'A champion routinely approves tollgates after viewing only projected savings and asks the MBB to handle scope, risk, and stakeholder issues offline. What coaching intervention is strongest?',
      ['Provide a private technical tutorial on every statistical tool so the champion can recompute all analyses personally','Accept the approvals but add the omitted evidence to project files after the meeting for audit completeness','Redesign reviews around explicit decision criteria, require owner-present risk and benefit evidence, and coach the champion using observed decisions','Transfer tollgate authority permanently to the finance partner because savings are the champion’s only required concern'],2,
      'A tollgate is a governance decision, not a ceremonial presentation or a statistics examination. The champion should test continuing strategic fit, scope, risks, barriers, resources, stakeholder alignment, and benefit assumptions. The MBB can define a decision-focused agenda, model effective inquiry, observe the champion’s choices, and give specific feedback. Quiet documentation does not repair weak decisions, while transferring accountability prevents the leader from developing the required role.',
      ['The champion needs decision competence and appropriate inquiry, not mastery of every technical calculation.','Retrospective filing does not improve the quality or transparency of the approval decision.','Correct. Behaviorally anchored review criteria create practice, evidence, and accountable feedback.','Finance validates value but does not replace champion ownership of the overall business decision.'],'Chapter 23 - Executives and Champions','294-305',
      {keywords:['champion coaching','tollgate','decision criteria','feedback','governance']}),

    q7(167,'mbb-coaching',{domain:'V. Coaching and Mentoring Responsibilities',subdomain:'B. Teams and Individuals',topic:'Coaching inquiry versus expert rescue'},'Hard','Apply','Coaching, training, and failing-project diagnosis','Product development and engineering',
      'A capable Black Belt brings every ambiguous analysis choice to the MBB and waits for a direct answer. Quality is acceptable, but independent judgment is not developing. What should the MBB do?',
      ['Continue prescribing each answer because technical consistency is more important than developing judgment','Stop meeting with the Belt until the project is complete so dependence disappears through necessity','Take over the analysis and let the Belt observe an expert solution without participating in decisions','Use graded questions, require the Belt’s recommendation and evidence first, then give targeted feedback and fade support'],3,
      'Effective coaching builds the learner’s capacity to frame decisions, evaluate evidence, and recognize limits. Requiring a provisional recommendation exposes reasoning that the MBB can probe and correct. Support can begin with structured prompts and examples, then fade as competence and confidence grow, with escalation retained for high-risk decisions. Repeated expert rescue rewards dependence; abrupt withdrawal creates unmanaged project risk; passive observation does not provide accountable practice.',
      ['Prescriptive rescue may protect one decision while reinforcing long-term dependence on the MBB.','Abrupt withdrawal withholds feedback and may expose the project to avoidable analytical risk.','Observation can help, but the Belt must practice making and defending decisions to develop judgment.','Correct. Graded inquiry and fading support balance project assurance with capability development.'],'Chapter 24 - Teams and Individuals','306-316',
      {keywords:['coaching','inquiry','fading support','independent judgment','feedback']}),

    q7(168,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. MSA, Process Capability, and Control',topic:'Nested destructive gage R&R interpretation'},'Expert','Analyze','Statistical-output interpretation','Manufacturing',
      'A destructive measurement study nests specimens within parts because no specimen can be measured twice. The variance components below were estimated. Which conclusion is most defensible?',
      ['Measurement variation is 24% of total variance, but repeatability and reproducibility require a design that respects destructive nesting','The measurement system contributes only 6% because appraiser variance is the sole measurement component','Part-to-part variation is 76% of study variation, proving the measurement system is acceptable for every intended use','The nested design permits ordinary crossed repeatability estimates because different specimens are functionally identical'],0,
      'For destructive testing, repeat measurements on the same physical specimen are impossible, so a nested or specially structured study is required and interpretation depends on specimen homogeneity assumptions. The displayed measurement components sum to 18+6=24% of total study variance. That magnitude may be inadequate for some decisions, but acceptability also depends on discrimination, tolerance, process variation, and intended use. Large part-to-part variation does not by itself validate the measurement system.',
      ['Correct. The total and the destructive-design limitation are both represented without overclaiming acceptability.','Repeatability is also measurement variation and cannot be discarded from the total contribution.','A study-variation percentage alone cannot establish suitability for every classification or control decision.','Different specimens cannot be treated as repeated observations without a defensible homogeneity structure.'],'Chapter 23 - Measurement Systems Analysis','318-346',
      {quantitative:true,formula:'Measurement contribution = repeatability 18% + appraiser 6% = 24% of total variance.',assumptions:['Variance components are nonnegative and estimated from the stated nested design.','Specimens within each part are intended to be sufficiently homogeneous for the study purpose.'],chart:{type:'data-table',columns:['Variance source','Percent of total variance'],rows:[['Part to part','76%'],['Repeatability within nested specimens','18%'],['Appraiser','6%'],['Total','100%']]},altText:'A nested destructive measurement-study table attributes 76 percent of variance to parts, 18 percent to repeatability within nested specimens, and 6 percent to appraisers.',keywords:['destructive MSA','nested gage R&R','variance components','repeatability','reproducibility']}),

    q7(169,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. MSA, Process Capability, and Control',topic:'Transformation governance for capability'},'Hard','Evaluate','Advanced conceptual/method-selection','Manufacturing',
      'Cycle-time data are strongly right-skewed. A Box-Cox transformation yields approximately normal residuals, but specifications and customer risk are defined in seconds. What should the MBB require?',
      ['Report only transformed Cp and Cpk because normality on the modeled scale makes original units irrelevant','Validate the transformation and stability, compute tail risk consistently on that scale, and communicate results back in seconds','Discard the data because a nonnormal observed distribution cannot support any capability assessment','Move the specification limits until they are symmetric on the transformed scale, then use ordinary capability indices'],1,
      'A transformation can support modeling when its assumptions and stability are validated, but it does not change the engineering meaning of the specifications or customer experience. Limits must be transformed consistently, probabilities calculated on the modeled scale, and interpretations back-transformed into original units. The MBB should also consider a suitable nonnormal distribution and investigate physical sources of skew. Reporting only transformed indices can conceal practical tail risk and confuse decision makers.',
      ['A statistically convenient scale does not replace customer-facing units or interpretation.','Correct. It preserves mathematical consistency and communicates risk in meaningful engineering units.','Nonnormal data can be modeled through transformations or justified distributional methods.','Specifications represent requirements and cannot be changed merely to simplify statistical analysis.'],'Chapter 24 - Measuring Process Performance','347-352',
      {keywords:['Box-Cox','nonnormal capability','back transformation','tail risk','specification limits']}),

    q7(170,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Regression extrapolation and leverage'},'Very Hard','Analyze','Statistical-output interpretation','Finance and insurance',
      'A model predicting claim severity is supported by predictor values from 10 to 70. One proposed policy uses x=105, where the chart shows a narrow software-generated confidence interval. What is the strongest interpretation?',
      ['The narrow interval proves prediction at x=105 is safer than prediction near the center of the observed data','The point is valid because linear regression imposes a straight line beyond the observed predictor range','The estimate is an extrapolation with high leverage; the interval depends heavily on model form and should not be treated as empirical support','The observation should be added three times to the dataset so the fitted range includes the proposed policy value'],2,
      'Regression precision statements are conditional on the fitted model being correctly specified. At x=105 there is no nearby observed support, so the estimate is extrapolation and highly sensitive to curvature, omitted variables, or structural change outside the studied range. A displayed interval may look precise because it reflects assumed form, not evidence that the relationship remains linear there. The MBB should obtain relevant data, constrain the decision range, or conduct sensitivity analysis before relying on the prediction.',
      ['Graphical narrowness cannot overcome the absence of data supporting the assumed relationship.','A fitted equation can calculate an extrapolation but cannot validate its structural assumption.','Correct. High leverage and extrapolation make model-form uncertainty central to the decision.','Duplicating one unsupported observation would corrupt weighting and would not create independent evidence.'],'Chapter 25 - Multiple Regression and Model Diagnostics','370-402',
      {chart:{type:'regression-diagnostic',title:'Claim severity versus policy-risk score',xLabel:'Policy-risk score',yLabel:'Claim severity ($000)',xTicks:[10,30,50,70,90,110],yTicks:[20,40,60,80],points:[{fitted:10,residual:24},{fitted:18,residual:29},{fitted:25,residual:31},{fitted:34,residual:39},{fitted:42,residual:43},{fitted:51,residual:49},{fitted:60,residual:56},{fitted:70,residual:61},{fitted:105,residual:78}]},altText:'A scatterplot contains eight observed predictor values between 10 and 70 and one proposed point at 105, separated by a large unsupported gap.',interactionPurpose:'Focus or hover over points to compare the observed predictor range with the isolated proposed value at 105.',keywords:['regression','extrapolation','leverage','model uncertainty','prediction interval']}),

    q7(171,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Logistic interaction and conditional effects'},'Hard','Understand','Advanced conceptual/method-selection','Healthcare',
      'A logistic model contains treatment, severity, and treatment-by-severity terms, and the interaction is statistically and practically important. What does this imply?',
      ['The treatment odds ratio is constant because logistic models always estimate one multiplicative effect','The severity coefficient must be removed because interactions make main effects mathematically redundant','The outcome should be converted to a continuous variable so the interaction can be assessed by ordinary regression','The treatment effect should be interpreted at specified severity values rather than as one universal odds ratio'],3,
      'An interaction means the association between treatment and the log odds of the outcome changes with severity. The treatment coefficient alone describes the effect only at the reference value of severity, which may or may not be meaningful. The MBB should estimate contrasts or predicted probabilities at relevant severity values, include uncertainty, and assess practical importance. Interactions do not automatically require removing main effects or abandoning the binary-outcome model.',
      ['The interaction explicitly allows the treatment odds ratio to vary with severity.','Hierarchical interpretation ordinarily retains relevant lower-order terms with the interaction.','A binary outcome is appropriately modeled by logistic regression and need not be recoded continuously.','Correct. Conditional contrasts translate the model into decisions at meaningful severity levels.'],'Chapter 25 - Logistic and Generalized Models','384-402',
      {keywords:['logistic regression','interaction','conditional effect','odds ratio','predicted probability']}),

    q7(172,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Reliability allocation for series subsystems'},'Expert','Apply','Multi-step quantitative','Product development and engineering',
      'A system has three independent series subsystems with mission reliabilities 0.98, 0.95, and 0.97. Which result and improvement priority are correct if comparable engineering effort can raise only one subsystem by 0.01?',
      ['System reliability is about 0.903; improving the 0.95 subsystem gives the largest absolute system gain','System reliability is about 0.950; improving the 0.98 subsystem gives the largest relative system gain','System reliability is about 0.995; improving any subsystem reduces overall reliability because it is a series system','System reliability is about 0.903; every 0.01 subsystem improvement gives exactly the same absolute gain'],0,
      'For independent series elements, system reliability is the product: 0.98×0.95×0.97=0.90307. Raising one component by 0.01 increases the product by 0.01 times the product of the other two. The gains are 0.009215 for improving 0.98, 0.009506 for improving 0.95, and 0.00931 for improving 0.97. Thus the weakest subsystem gives the largest absolute gain under equal increments and comparable effort, although real allocation should also consider feasibility and cost.',
      ['Correct. The product is about 0.903 and the weakest element has the largest equal-increment leverage.','The series reliability cannot exceed its weakest component and the priority calculation is reversed.','Multiplication of three values below one cannot produce 0.995, and improvement cannot reduce reliability.','Absolute gains differ because each increment is multiplied by the reliabilities of the other subsystems.'],'Chapter 25 - Reliability Engineering','423-428',
      {quantitative:true,formula:'Rs=0.98(0.95)(0.97)=0.90307; gains for +0.01 are 0.009215, 0.009506, and 0.00931 respectively.',assumptions:['Subsystem failures are independent during the mission.','Each candidate improvement is exactly 0.01 and has comparable cost and feasibility.'],estimatedMinutes:5,chart:{type:'reliability-plot',title:'Series-subsystem mission reliability',xLabel:'Mission fraction',yLabel:'Reliability',xTicks:[0,0.25,0.5,0.75,1],series:[{label:'Subsystem A',points:[[0,1],[0.25,0.995],[0.5,0.99],[0.75,0.985],[1,0.98]]},{label:'Subsystem B',points:[[0,1],[0.25,0.987],[0.5,0.975],[0.75,0.962],[1,0.95]]},{label:'Subsystem C',points:[[0,1],[0.25,0.992],[0.5,0.985],[0.75,0.978],[1,0.97]]}],missionTime:1},altText:'Three reliability curves end at mission reliabilities 0.98, 0.95, and 0.97. Subsystem B is lowest at the mission endpoint.',keywords:['series reliability','reliability allocation','mission reliability','independence','improvement priority']}),

    q7(173,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'B. Measuring and Modeling Relationships',topic:'Monte Carlo input-dependence governance'},'Very Hard','Evaluate','Multi-step quantitative','Supply chain, logistics, and distribution',
      'Demand and replenishment lead time historically rise together during disruptions. A Monte Carlo inventory model samples them independently and reports only a 3% stockout probability. What should the MBB require?',
      ['Accept the result because independent sampling is conservative whenever both inputs have right-skewed distributions','Model and validate their dependence, test disruption regimes, and report sensitivity of tail risk to plausible correlation','Add more simulation trials because a sufficiently large sample automatically corrects a misspecified dependence structure','Replace both distributions with their means so the model cannot generate improbable combinations of input values'],1,
      'Simulation reproduces the assumptions supplied to it; more trials reduce Monte Carlo sampling error but do not repair structural misspecification. When high demand coincides with long lead time, independent sampling underrepresents the joint tail that drives stockouts. The MBB should examine dependence using suitable historical and causal evidence, represent disruption regimes or correlated sampling, and disclose sensitivity. A single precise probability from an invalid joint model creates false confidence.',
      ['Independence can materially understate joint extremes even when each marginal distribution is modeled well.','Correct. Joint-tail validation and sensitivity connect the simulation to the actual risk mechanism.','Additional trials converge more precisely to the wrong model when dependence remains misspecified.','Replacing distributions with means removes the uncertainty the simulation is intended to quantify.'],'Chapter 25 - Monte Carlo Simulation','414-416',
      {keywords:['Monte Carlo','correlation','joint tail','stockout risk','model validation']}),

    q7(174,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'C. Design of Experiments',topic:'Aliasing and foldover design augmentation'},'Very Hard','Analyze','DOE/optimization design and diagnosis','Manufacturing',
      'A 2^(4-1) screening design uses defining relation I=ABCD. The interaction plot suggests AB may be active. Which statement should drive the next experiment?',
      ['AB is clear of every two-factor interaction because a resolution IV design estimates all two-factor effects independently','AB is aliased only with the mean, so repeating the same eight runs will uniquely estimate it','AB is aliased with CD; use a purposeful foldover or other augmentation to separate the competing effects','AB is identical to factor C, so dropping factor D removes the alias without collecting additional evidence'],2,
      'From I=ABCD, multiplying both sides by AB gives AB=CD. The resolution IV fraction keeps main effects clear of two-factor interactions, but pairs two-factor interactions with one another. Therefore the observed contrast cannot identify whether AB, CD, or both are responsible. A chosen foldover or targeted augmentation can break the relevant alias while preserving efficiency. Merely replicating the same fraction improves pure-error estimation but leaves the alias structure unchanged.',
      ['Resolution IV protects main effects from two-factor aliases but does not separate all two-factor interactions.','Replication repeats the same contrast and cannot distinguish members of the alias set.','Correct. AB equals CD in the defining relation, so augmentation must break that alias.','AB is not aliased with the main effect C under this resolution IV defining relation.'],'Chapter 26 - Fractional Factorial Designs','429-450',
      {quantitative:true,formula:'I=ABCD; multiply by AB to obtain AB=CD. Likewise AC=BD and AD=BC.',assumptions:['The design is the regular one-half fraction defined by I=ABCD.','The proposed augmentation can be chosen before additional runs are collected.'],estimatedMinutes:4,chart:{type:'two-level-interaction',title:'Screening interaction contrast',factorA:'Factor A',factorB:'Factor B',xLowLabel:'A low',xHighLabel:'A high',lowLabel:'B low',highLabel:'B high',lowLine:[62,78],highLine:[80,66],yLabel:'Mean response',yDomain:[55,85],yTicks:[60,70,80]},altText:'A two-level interaction plot has crossing B-low and B-high lines across the low and high levels of factor A, indicating an interaction contrast without identifying its aliased source.',interactionPurpose:'Focus or hover over the plotted factor-level means to inspect the crossing contrast before considering the AB equals CD alias.',keywords:['fractional factorial','defining relation','alias','resolution IV','foldover']}),

    q7(175,'mbb-analytics',{domain:'VI. Advanced Data Management and Analytic Methods',subdomain:'A. MSA, Process Capability, and Control',topic:'APC-SPC layered monitoring architecture'},'Hard','Create','Advanced conceptual/method-selection','Manufacturing',
      'A reactor controller holds product temperature near target, while feed composition and valve demand drift. Which monitoring architecture best supports early detection without confusing feedback action with statistical evidence?',
      ['Chart only product temperature because a controlled output contains all information about process deterioration','Disable feedback during sampling periods so conventional control-chart independence assumptions are restored','Apply one control chart to every raw tag using identical limits and investigate any signal as a separate root cause','Monitor controlled output, controller error and demand, and key disturbances with time-aware models and an integrated response plan'],3,
      'Feedback can suppress visible movement in the controlled output while manipulated demand rises to compensate for fouling, feed change, or actuator wear. A layered architecture observes the outcome, residual or error, controller effort, and important disturbances, using methods appropriate for autocorrelated data. Signals must feed a coordinated diagnostic plan because the variables are causally linked. Disabling control creates operational risk, while isolated chart proliferation produces false alarms and fragmented investigation.',
      ['A stable controlled output can coexist with substantial hidden drift and increasing controller effort.','Turning off necessary control to simplify statistics may create unsafe or off-target operation.','Identical independent charts ignore time dependence, multiplicity, and the causal control structure.','Correct. Layered, time-aware evidence reveals compensation and guides coordinated diagnosis.'],'Chapter 27 - Automated Process Control and SPC','451-453',
      {keywords:['APC','SPC','controller demand','disturbance monitoring','autocorrelation','diagnostic plan']})
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
