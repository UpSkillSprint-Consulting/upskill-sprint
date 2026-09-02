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

  global.MBB_SET2_BATCHES=global.MBB_SET2_BATCHES||{};
  global.MBB_SET2_BATCHES[1]=batch1;
  global.MBB_SET2_BATCHES[2]=batch2;
  global.MBB_SET2_BATCHES[3]=batch3;
  global.MBB_SET2=Object.keys(global.MBB_SET2_BATCHES).sort(function(a,b){return Number(a)-Number(b);}).reduce(function(all,key){return all.concat(global.MBB_SET2_BATCHES[key]);},[]);
})(typeof window!=='undefined'?window:globalThis);
