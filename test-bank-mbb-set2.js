(function(global){
  'use strict';

  var DATASET='test-bank-assets/mbb-160/batch-01/datasets.json';
  var SPECS='test-bank-assets/mbb-160/batch-01/visual-specs.json';
  var VALIDATION='test-bank-assets/mbb-160/batch-01/validation.json';
  var FALLBACK='test-bank-assets/mbb-160/batch-01/static-fallbacks.html';

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

  global.MBB_SET2_BATCHES=global.MBB_SET2_BATCHES||{};
  global.MBB_SET2_BATCHES[1]=batch1;
  global.MBB_SET2=Object.keys(global.MBB_SET2_BATCHES).sort(function(a,b){return Number(a)-Number(b);}).reduce(function(all,key){return all.concat(global.MBB_SET2_BATCHES[key]);},[]);
})(typeof window!=='undefined'?window:globalThis);
