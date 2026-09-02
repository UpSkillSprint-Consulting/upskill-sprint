#!/usr/bin/env node

/**
 * Convert the supplied Kubiak simulated-examination text into the browser bank.
 *
 * Reproducible source extraction (the page range is for the supplied PDF copy):
 *   pdftotext -f 674 -l 698 -layout \
 *     "The Certified Six Sigma Master Black Belt (T. M. Kubiak).pdf" mbb-simulation.txt
 *   node scripts/import-mbb-simulation.mjs mbb-simulation.txt test-bank-mbb-set1.js
 *
 * The source answer key contains five-choice, all/none, and combination answers.
 * This importer normalizes every item to four independently answerable choices
 * and records the deliberate repairs below. The separate practice examination is
 * outside this import and must not be supplied to this script.
 */

import fs from 'node:fs';
import path from 'node:path';

const [, , sourcePath, outputPath = 'test-bank-mbb-set1.js'] = process.argv;
if (!sourcePath) {
  console.error('Usage: node scripts/import-mbb-simulation.mjs <simulated-exam.txt> [output.js]');
  process.exit(1);
}

const answerKey = [
  'D','B','B','D','C','D','D','B','B','B','D','A','D','C','M','B','D','B','D','B',
  'C','A','C','C','B','A','D','C','C','A','A','F','C','B','C','B','D','E','O','B',
  'A','C','E','D','E','B','B','A','C','B','A','D','E','C','B','C','A','D','B','A',
  'B','C','C','C','A','D','E','D','C','B','B','D','D','C','B','A','A','A','D','C',
  'A','B','L','A','M','A','C','E','A','D','E','E','D','E','A','C','N','B','D','A'
];

const domainQuestions = {
  'mbb-enterprise': [2,3,4,5,24,33,34,53,55,59,86,95],
  'mbb-org': [9,11,12,13,14,18,19,20,22,23,25,27,28,29,31,32,36,41,43,44,45,64,71,73,78],
  'mbb-portfolio': [7,8,16,17,21,30,35,37,38,40,42,47,48,49,51,52,65,81,84,90,98,99],
  'mbb-training': [54,56,57,58,60,61,62,88,92],
  'mbb-coaching': [63,66,67,68,69,70,100],
  'mbb-analytics': [1,6,10,15,26,39,46,50,72,74,75,76,77,79,80,82,83,85,87,89,91,93,94,96,97]
};

const subByQuestion = new Map();
Object.entries(domainQuestions).forEach(([sub, numbers]) => {
  numbers.forEach(number => {
    if (subByQuestion.has(number)) throw new Error(`Question ${number} is mapped more than once`);
    subByQuestion.set(number, sub);
  });
});
if (subByQuestion.size !== 100) {
  const missing = Array.from({ length: 100 }, (_, index) => index + 1).filter(number => !subByQuestion.has(number));
  throw new Error(`MBB blueprint mapping is incomplete. Missing: ${missing.join(', ')}`);
}

const repairs = {
  1: {
    stem: 'Which three physical elements form the core of a basic feedback-control loop?',
    options: [
      'A sensor/transmitter, a controller, and a final control element',
      'A set point, a feedback report, and a project sponsor',
      'A sensor, a specification limit, and a capability index',
      'A controller, a control chart, and a risk register'
    ],
    answer: 0,
    why: 'The sensor or transmitter measures the process, the controller compares and decides, and the final control element changes the process input.'
  },
  15: {
    stem: 'Which assumptions are commonly used when calculating the reliability of a standby system?',
    options: [
      'Standby units are equivalent, the switching mechanism is perfect, and dormant units do not fail while waiting',
      'Only the switching mechanism is assumed perfect; standby units may differ and fail while dormant',
      'Standby units must operate simultaneously and share the load equally',
      'At least k of n standby units must run continuously from time zero'
    ],
    answer: 0,
    why: 'The elementary standby model commonly assumes equivalent units, perfect switching, and no dormant failures. Those assumptions isolate the reliability contribution of sequential activation.'
  },
  32: {
    stem: 'Which set lists the management-support dimensions used in a Lean Six Sigma deployment?',
    options: [
      'Visibility, engagement, active participation, knowledge, and communication',
      'Budget ownership, certification level, tenure, hierarchy, and span of control',
      'Charisma, technical depth, independence, urgency, and risk tolerance',
      'Planning, staffing, directing, auditing, and procurement'
    ],
    answer: 0,
    why: 'Management support is demonstrated through visible, engaged, active, knowledgeable, and communicative leadership—not merely through position or budget authority.'
  },
  38: {
    stem: 'Which sequence correctly states the standard project-management life cycle?',
    options: [
      'Initiating, planning, executing, monitoring and controlling, closing',
      'Planning, initiating, monitoring, executing, closing',
      'Initiating, executing, closing, planning, monitoring',
      'Executing, planning, initiating, closing, monitoring'
    ],
    answer: 0,
    why: 'A project is initiated and planned before execution; monitoring and control accompany execution, and formal closure completes the life cycle.'
  },
  39: {
    stem: 'Which combination describes defensible advantages of automated process control?',
    options: [
      'Reduced manual intervention, simultaneous monitoring of many variables, and quality levels that may be impractical manually',
      'Guaranteed zero defects, no maintenance requirement, and elimination of measurement error',
      'Lower capital cost in every application, no commissioning effort, and automatic regulatory approval',
      'Removal of all process variation, elimination of operators, and no need for control plans'
    ],
    answer: 0,
    why: 'Automation can react faster than manual control, coordinate many controlled variables, and hold quality levels that manual adjustment may not sustain. It does not guarantee zero defects or remove maintenance and validation needs.'
  },
  42: {
    stem: 'What is the primary value of formally announcing a newly authorized improvement project to the organization?',
    options: [
      'It makes the purpose, sponsorship, and priority visible so conflicts can be surfaced and support coordinated',
      'It grants the project team authority over every affected manager',
      'It guarantees the project will finish ahead of schedule',
      'It replaces the need for stakeholder analysis and a communication plan'
    ],
    answer: 0,
    why: 'A formal announcement makes authorization and priority visible, helping stakeholders coordinate support and identify conflicts. It does not confer unlimited authority or guarantee results.'
  },
  43: {
    stem: 'Which communication standard should an MBB establish for a project team?',
    options: [
      'Open, candid communication without retaliation, timely internal issue awareness, and direct performance feedback',
      'External escalation before the team discusses an issue internally',
      'Performance feedback only at formal annual reviews',
      'Restricting problem information to the project leader until a solution is selected'
    ],
    answer: 0,
    why: 'Healthy teams surface issues early, communicate without fear of retaliation, keep affected members informed, and provide direct performance feedback.'
  },
  45: {
    stem: 'Before setting new cultural objectives for a Lean Six Sigma transformation, what should leaders do first?',
    options: [
      'Assess the current culture, readiness, and problem-solving capability',
      'Publish the future-state objectives before gathering evidence',
      'Replace the performance-appraisal system immediately',
      'Launch certification training for every employee'
    ],
    answer: 0,
    why: 'A current-state assessment establishes the cultural and capability gaps that the future objectives and change plan must address.'
  },
  48: {
    stem: 'How should financially based project-selection methods be applied?',
    options: [
      'Model relevant cash flows, account for the time value of money when appropriate, and compare mutually exclusive alternatives consistently',
      'Use only ROI because discounting makes projects incomparable',
      'Use payback period alone and ignore cash flows after payback',
      'Select the project with the largest gross savings without considering investment or timing'
    ],
    answer: 0,
    why: 'Sound financial comparison uses incremental cash flows and consistent timing assumptions; mutually exclusive alternatives must be evaluated on the same basis.'
  },
  49: {
    stem: 'What is the primary value of governance at the individual-project level?',
    options: [
      'It establishes decision rights, accountability, review discipline, and escalation paths',
      'It eliminates the need for rigorous project reviews',
      'It guarantees that no legal dispute can occur',
      'It substitutes compliance reporting for project leadership'
    ],
    answer: 0,
    why: 'Project governance supplies structure and rigor through explicit authority, accountability, reviews, and escalation—not immunity from risk or a reduction in oversight.'
  },
  50: {
    stem: 'Which set contains the standard components used to describe a time series?',
    options: [
      'Trend, seasonal variation, cyclical variation, and irregular or residual variation',
      'Stationarity, consumer effect, specification width, and autocorrelation',
      'Mean shift, process capability, measurement bias, and seasonality',
      'Trend, tolerance, control limits, and sampling error'
    ],
    answer: 0,
    why: 'Classical decomposition represents a time series with trend, seasonal, cyclical, and irregular components. Stationarity is a property of a series, not one of these components.'
  },
  52: {
    stem: 'Which conditions support classifying project savings as hard-dollar savings?',
    options: [
      'A documented spending baseline, a budget or forecast impact, and a verified effect on financial results',
      'A favorable team estimate with no finance validation',
      'Improved employee sentiment without a monetized impact',
      'Avoided hypothetical spending that was never planned'
    ],
    answer: 0,
    why: 'Hard-dollar savings require a credible baseline and a verified financial impact that changes actual or planned spending or earnings.'
  },
  53: {
    stem: 'What should directly drive the human-resources strategic plan for a Lean Six Sigma deployment?',
    options: [
      'The organization’s strategic objectives and the workforce capabilities needed to execute them',
      'The current training catalog',
      'The preferences of individual project teams',
      'The prior year’s travel budget'
    ],
    answer: 0,
    why: 'Workforce planning derives from enterprise strategy: HR identifies the roles, capacity, and competencies required to execute the organization’s objectives.'
  },
  56: {
    stem: 'Which training-needs-analysis error occurs when leaders assume every performance gap is a skill or knowledge problem?',
    options: [
      'They prescribe training even when the cause is process design, resources, incentives, or another non-training factor',
      'They verify the root cause before selecting an intervention',
      'They distinguish can’t-do from won’t-do performance barriers',
      'They define measurable performance requirements before assessing the gap'
    ],
    answer: 0,
    why: 'Training corrects a demonstrated knowledge or skill deficiency. It will not repair a gap caused by poor process design, missing resources, misaligned incentives, or unclear expectations.'
  },
  58: {
    stem: 'How does learning contribute to an individual’s performance?',
    options: [
      'It builds the capability and potential to achieve results but does not by itself guarantee them',
      'It guarantees motivation regardless of the work environment',
      'It automatically produces organizational results without practice or support',
      'It replaces the need for performance objectives and feedback'
    ],
    answer: 0,
    why: 'Learning develops capability. Performance still depends on practice, opportunity, motivation, resources, and reinforcement in the work environment.'
  },
  61: {
    stem: 'What is the correct sequence of Kirkpatrick’s four levels of training evaluation?',
    options: [
      'Reaction, learning, behavior, results',
      'Learning, reaction, results, behavior',
      'Behavior, learning, reaction, results',
      'Results, behavior, reaction, learning'
    ],
    answer: 0,
    why: 'Kirkpatrick progresses from learner reaction to acquired learning, transfer into workplace behavior, and organizational results.'
  },
  63: {
    stem: 'Who is accountable for conducting a project tollgate review and deciding whether the project should proceed?',
    options: [
      'The project sponsor or champion',
      'The process operator',
      'The MBB acting alone',
      'The training coordinator'
    ],
    answer: 0,
    why: 'The sponsor or champion owns the business decision at a tollgate. The MBB may coach and test technical rigor but does not replace sponsor accountability.'
  },
  67: {
    stem: 'Which capabilities should an MBB use when giving feedback to champions or senior executives?',
    options: [
      'Influence without authority, adapt communication and interaction styles, and handle conflict constructively',
      'Rely on certification authority and avoid disagreement',
      'Use one standard presentation style regardless of audience',
      'Escalate every difference to the deployment leader'
    ],
    answer: 0,
    why: 'Executive coaching requires influence, audience-aware communication, adaptable interaction, and constructive conflict management.'
  },
  68: {
    stem: 'Which item is not a recognized stage in Tuckman’s team-development model?',
    options: ['Forming', 'Storming', 'Performing', 'Learning'],
    answer: 3,
    why: 'Tuckman’s model includes forming, storming, norming, performing, and later adjourning. Learning is not a named stage.'
  },
  73: {
    stem: 'A leader clarifies tasks and responsibilities, supplies needed resources, and links performance to agreed rewards or corrective action. Which leadership style is this?',
    options: ['Transformational', 'Autocratic', 'Directive coaching', 'Transactional'],
    answer: 3,
    why: 'Transactional leadership manages performance through clear roles, resources, monitoring, and explicit exchanges of rewards or corrective action.'
  },
  74: {
    stem: 'Which methods are appropriate for analyzing an attribute or discrete measurement system?',
    options: [
      'Percent agreement and kappa statistics',
      'Intraclass correlation and a variables gage R&R study',
      'A control chart of continuous measurement error only',
      'Cp and Cpk calculated from appraiser ratings'
    ],
    answer: 0,
    why: 'Attribute agreement analysis uses percent agreement and kappa-type statistics. Intraclass correlation and variables gage R&R address continuous measurements.'
  },
  76: {
    stem: 'Using the assumptions table below, which analysis is the best match for Tool 1 and Tool 2?',
    options: [
      'Tool 1 = kappa; Tool 2 = intraclass correlation coefficient (ICC)',
      'Tool 1 = ICC; Tool 2 = percent agreement',
      'Tool 1 = ICC; Tool 2 = kappa',
      'Tool 1 = percent agreement; Tool 2 = variables gage R&R'
    ],
    answer: 0,
    why: 'Tool 1 describes nominal classifications by independent raters, which calls for kappa. Tool 2 describes ordered, equally spaced ratings where misclassification distance matters, which supports an ICC analysis.',
    chart: {
      type: 'data-table',
      columns: ['Assumption', 'Tool 1', 'Tool 2'],
      rows: [
        ['Units', 'Independent', 'Independent'],
        ['Classification scale', 'Nominal categories', 'Ordered, equally spaced ratings'],
        ['Category use', 'Some categories may occur more often', 'Ranges such as −2, −1, 0, 1, 2'],
        ['Raters', 'Classify independently', 'Classify independently'],
        ['Categories', 'Mutually exclusive and exhaustive', 'Mutually exclusive and exhaustive'],
        ['Decision impact', 'Misclassification distance not specified', 'Misclassification consequences matter']
      ]
    }
  },
  81: {
    stem: 'Why is project-management discipline important when applying DMAIC?',
    options: [
      'It supplies scope, schedule, resource, risk, communication, and governance controls around the technical improvement work',
      'It replaces DMAIC whenever the root cause is unknown',
      'It guarantees every phase will finish in the same amount of time',
      'It removes the need for a sponsor once the charter is approved'
    ],
    answer: 0,
    why: 'DMAIC provides the improvement logic; project management controls the work needed to deliver it through planning, coordination, risk management, reporting, and governance.'
  },
  83: {
    stem: 'Which assumptions support the ordinary general linear model used for continuous responses?',
    options: [
      'A linear mean structure with independent, normally distributed, constant-variance residuals; predictors may be continuous or categorical',
      'A binary response with a logit link and binomial variance',
      'Count responses whose variance must equal the mean',
      'Correlated residuals with an unspecified nonlinear mean function'
    ],
    answer: 0,
    why: 'The ordinary general linear model assumes a linear mean structure and independent normal residuals with constant variance; predictors can be quantitative or coded categorical factors.'
  },
  85: {
    stem: 'Which analyses can be expressed within the general linear model framework?',
    options: [
      'Multiple linear regression, ANCOVA, and continuous measurement-system models',
      'Nonlinear regression only',
      'Attribute agreement analysis and a one-sample sign test only',
      'Poisson regression and Kaplan–Meier survival analysis only'
    ],
    answer: 0,
    why: 'Multiple regression, ANCOVA, and many continuous MSA models are linear in their parameters and fit within the general linear model framework.'
  },
  87: {
    stem: 'A components-of-variation analysis is especially useful when the sources of variation can be represented as what structure?',
    options: ['A multiple linear regression model', 'An unconstrained nonlinear model', 'A nested hierarchical structure', 'An ordinal logistic model'],
    answer: 2,
    why: 'Components-of-variation studies partition variation across nested levels such as pieces, locations, batches, instruments, and repeated measurements.'
  },
  88: {
    stem: 'Which accessibility considerations should an MBB address when designing training for adult learners?',
    options: [
      'Auditory and visual access, learning disabilities, and age-related access needs',
      'Only the preferred slide template',
      'Only reading speed, because other needs are outside instructional design',
      'None when the learners are experienced professionals'
    ],
    answer: 0,
    why: 'Accessible adult learning anticipates sensory, cognitive, and age-related needs and provides equivalent ways to perceive and use the material.'
  },
  91: {
    stem: 'Using the simplex tableau below and the convention that the largest positive reduced cost enters, which pivot is selected?',
    options: ['Enter x3; leave x2', 'Enter x3; leave x1', 'Enter x4; leave x1', 'Enter x4; leave x5'],
    answer: 0,
    why: 'x3 has the largest positive reduced cost (0.90). The positive ratio test gives 84,000/0.50 = 168,000 for x5 and 67,000/0.75 ≈ 89,333 for x2, so x2 leaves.',
    chart: {
      type: 'data-table',
      columns: ['Basis', 'RHS', 'x1', 'x2', 'x3', 'x4', 'x5'],
      rows: [
        ['Z', '$52,000', '0', '0', '0.90', '0.60', '0'],
        ['x5', '$84,000', '0', '0', '0.50', '−1.00', '1'],
        ['x2', '$67,000', '0', '1', '0.75', '−0.50', '0'],
        ['x1', '$70,000', '1', '0', '−0.50', '1.00', '0']
      ]
    }
  },
  92: {
    stem: 'Which set reflects recognized motivations for adults to participate in learning?',
    options: [
      'Meeting expectations, building networks, seeking stimulation, and learning for its own sake',
      'Avoiding all interaction and eliminating workplace expectations',
      'Pursuing certification only when compensation is guaranteed',
      'Learning only when content has an immediate technical application'
    ],
    answer: 0,
    why: 'Adults may learn for external expectations, social connection, stimulation, or intrinsic interest; no single motivation applies to every learner.'
  },
  93: {
    stem: 'An analyst reports a variance inflation factor (VIF) of 0.925 for a predictor. What should the MBB conclude?',
    options: [
      'The result is invalid because a conventional VIF cannot be below 1; verify the calculation and output',
      'The predictor has extremely high multicollinearity',
      'The predictor has moderate multicollinearity',
      'The predictor is proven independent of every other predictor'
    ],
    answer: 0,
    why: 'VIF = 1/(1 − R²) and R² is between 0 and 1, so VIF is at least 1. A reported value of 0.925 signals a calculation, transcription, or labeling error.'
  },
  94: {
    stem: 'Which applications can be formulated as linear-programming problems?',
    options: [
      'Assignment, scheduling, transportation, and mixture optimization',
      'Only assignment and transportation',
      'Only scheduling and mixture optimization',
      'None, because linear programming applies only to regression'
    ],
    answer: 0,
    why: 'All four are established linear-programming model families when their objectives and constraints are linear.'
  },
  97: {
    stem: 'Which assumptions are appropriate for a standard mixture experiment?',
    options: [
      'Normally distributed independent errors, a continuous response surface over the region, and response driven by proportions rather than total blend amount',
      'Independent component levels with no sum constraint',
      'Response driven only by total mixture volume and not by component proportions',
      'A categorical response with no model error'
    ],
    answer: 0,
    why: 'Mixture factors are proportions constrained to sum to a constant; the modeled response depends on composition, with the usual independent-error and response-surface assumptions.'
  },
  100: {
    stem: 'Across team-failure modes, which foundational weakness most often allows attendance, commitment, and support problems to persist unresolved?',
    options: [
      'Inadequate communication',
      'An overly detailed agenda',
      'Too many documented team norms',
      'Excessive use of neutral facilitation'
    ],
    answer: 0,
    why: 'Communication is the mechanism for surfacing expectations, commitments, conflicts, and support needs; when it fails, the other team problems remain hidden or unresolved.'
  }
};

/* The handbook simulation predates the current ASQ blueprint and contains a
   few stems whose keyed choice is technically imprecise, subjective without a
   decision rule, or no longer defensible as written. Keep those corrections
   explicit so source identity is preserved without publishing ambiguity. */
Object.assign(repairs, {
  10: {
    stem: 'When is an additive decomposition model appropriate for a time series?',
    options: [
      'When seasonal fluctuations have roughly constant absolute magnitude as the series level changes',
      'When seasonal fluctuations grow in direct proportion to the series level',
      'Only when the series has no trend and no seasonality',
      'Whenever the autocorrelation at lag 1 is exactly zero'
    ],
    answer: 0,
    why: 'Additive decomposition is appropriate when seasonal effects are expressed in roughly constant units. When seasonal amplitude scales with the level, a multiplicative model is generally more appropriate.'
  },
  13: {
    stem: 'In expectancy theory, what does valence mean?',
    options: [
      'The value or attractiveness an individual assigns to a possible outcome or reward',
      'The perceived probability that effort will produce the required performance',
      'The perceived probability that performance will lead to an outcome',
      'The amount of authority delegated to a self-directed team'
    ],
    answer: 0,
    why: 'Valence is the personal value attached to an outcome. Expectancy links effort to performance, while instrumentality links performance to the outcome.'
  },
  18: {
    stem: 'Which set contains recognized techniques for capturing the voice of the customer at listening posts?',
    options: [
      'Direct observation, comment cards, and mystery shopping',
      'Variance inflation factors, control limits, and residual plots',
      'Project charters, risk registers, and tollgate reviews',
      'Work breakdown structures, Gantt charts, and earned value'
    ],
    answer: 0,
    why: 'Observation, comment cards, and mystery shopping are customer-listening techniques. The other sets are analytics or project-management tools rather than VOC listening posts.'
  },
  23: {
    stem: 'Which author is best known for popularizing emotional intelligence as a set of leadership competencies?',
    options: ['Daniel Goleman', 'Paul Hersey', 'Douglas McGregor', 'Robert Blake'],
    answer: 0,
    why: 'Daniel Goleman popularized emotional intelligence in leadership through competencies such as self-awareness, self-management, empathy, and relationship management.'
  },
  25: {
    stem: 'Which combination of group dynamics can reinforce resistance during a culture-change effort when it is not actively managed?',
    options: [
      'Social loafing, group polarization, and strong local-group norms',
      'Process capability, takt time, and measurement resolution',
      'Randomization, replication, and blocking',
      'Net present value, payback period, and internal rate of return'
    ],
    answer: 0,
    why: 'Reduced individual effort, movement toward more extreme group positions, and entrenched local norms can all reinforce resistance. The other choices are technical tool sets, not group dynamics.'
  },
  33: {
    stem: 'Before choosing a Lean Six Sigma deployment structure, which organizational context should leaders explicitly assess?',
    options: [
      'Where the deployment function will sit, the labor or union environment, and relevant cultures and subcultures',
      'Only the preferred statistical software and slide template',
      'Only the number of employees who already hold Belt certificates',
      'The personal travel preferences of the steering committee'
    ],
    answer: 0,
    why: 'Placement, labor relationships, and culture affect authority, participation, communication, and adoption, so they must shape deployment design.'
  },
  34: {
    stem: 'A strategic objective is translated into named actions, owners, due dates, and resources for near-term execution. What type of plan is this?',
    options: ['An operational action plan', 'A vision statement', 'A scenario narrative', 'A project benefit hypothesis'],
    answer: 0,
    why: 'An operational action plan converts strategy into executable work by defining actions, responsibility, timing, and resources.'
  },
  36: {
    stem: 'Which set identifies people-related adoption issues an MBB should anticipate during a Lean Six Sigma deployment?',
    options: [
      'Fear of change, impatience for results, resistance to disciplined rigor, and unclear role structure',
      'Aliasing, multicollinearity, autocorrelation, and heteroscedasticity',
      'Inventory turns, takt time, cycle time, and throughput',
      'Depreciation, working capital, discount rate, and tax basis'
    ],
    answer: 0,
    why: 'Fear, unrealistic urgency, resistance to rigor, and role ambiguity are human adoption barriers that leadership and change-management actions must address.'
  },
  37: {
    stem: 'Two projects draw on the same constrained resource, and Project B cannot start until Project A delivers an interface. What must the portfolio review explicitly analyze?',
    options: [
      'Predecessor-successor dependencies and cross-project resource conflicts',
      'Only the certification level of each project leader',
      'Only the gross savings estimate of Project B',
      'The alphabetical order of the project titles'
    ],
    answer: 0,
    why: 'The interface creates a predecessor-successor dependency, while the shared constrained resource creates a portfolio-level conflict that must be sequenced and managed.'
  },
  46: {
    stem: 'What criterion defines a D-optimal experimental design for a specified regression model?',
    options: [
      "It maximizes det(X'X), thereby minimizing the generalized variance of the estimated coefficients",
      'It forces every interaction contrast to equal zero',
      'It guarantees orthogonality for any candidate set and model',
      'It minimizes residual variance without using a model matrix'
    ],
    answer: 0,
    why: "D-optimality maximizes the determinant of the information matrix X'X. Equivalently, it minimizes the determinant of the coefficient covariance matrix up to the error-variance multiplier."
  },
  47: {
    stem: 'Which set provides the core controls for authorizing a project, assessing its uncertainty, and planning its execution?',
    options: [
      'Project charter, risk analysis, and project plan',
      'Strategic plan, annual report, and organization chart',
      'Control chart, histogram, and normal probability plot',
      'Job description, training roster, and performance appraisal'
    ],
    answer: 0,
    why: 'The charter authorizes and bounds the work, risk analysis addresses uncertainty, and the project plan coordinates execution.'
  },
  51: {
    stem: 'Why are early cost and schedule estimates for a DMAIC project often uncertain?',
    options: [
      'The investigation has not yet established the causal path and final solution',
      'DMAIC projects are exempt from budget control',
      'Finance is not permitted to validate improvement benefits',
      'A project charter prohibits estimate refinement'
    ],
    answer: 0,
    why: 'DMAIC begins with an unsolved performance problem. Until causes and countermeasures are established, the work path, resources, and duration can only be progressively elaborated.'
  },
  54: {
    stem: 'Before performing a training gap analysis for a target role, what baseline must be defined?',
    options: [
      'The required job performance, tasks, and competencies',
      'The preferred vendor and classroom location',
      'The learner satisfaction survey score',
      'The number of slides in the current course'
    ],
    answer: 0,
    why: 'A gap is the difference between required and current performance. The role requirements must therefore be defined before knowledge and skill gaps can be measured.'
  },
  57: {
    stem: 'Which pair describes two common organizational funding models for training?',
    options: [
      'Charge the cost back to the receiving business unit, or fund it from a central overhead budget',
      'Charge every learner personally, or record no cost',
      'Use only capital funding, or defer all training indefinitely',
      'Fund only external courses, or prohibit internal instruction'
    ],
    answer: 0,
    why: 'Training is commonly funded through a chargeback to the receiving unit or through a centralized overhead budget. The choice affects incentives, demand, and accountability.'
  },
  60: {
    stem: "Which labels belong to Linksman's historical learning-style terminology?",
    options: [
      'Kinesthetic, visual, tactile, and auditory',
      'Logical, mathematical, verbal, and financial',
      'Directive, supportive, delegating, and coaching',
      'Concrete, statistical, strategic, and operational'
    ],
    answer: 0,
    why: "Linksman's terminology uses kinesthetic, visual, tactile, and auditory labels. An MBB should recognize the source vocabulary without using learning-style labels to restrict instruction; accessible multimodal design and observed performance are stronger guides."
  },
  64: {
    stem: 'Which governance mechanism best sustains an integrated voice-of-the-customer and voice-of-the-process system?',
    options: [
      'Regular senior-management review with visible ownership, accountability, and action follow-through',
      'Collecting customer comments without linking them to process measures',
      'Rotating marketing and operations managers regardless of business need',
      'Reporting only favorable measures at the annual strategy meeting'
    ],
    answer: 0,
    why: 'Regular executive review connects customer and process evidence to decisions, owners, and follow-through. Collection alone does not create an integrated management system.'
  },
  74: {
    stem: 'Which set contains methods that can be appropriate for an attribute or discrete measurement-system study, depending on the scale and design?',
    options: [
      'Percent agreement, kappa, Kendall-type concordance, and intraclass correlation for ordered ratings',
      'Cp, Cpk, and a variables gage R&R study only',
      'A continuous-data control chart and process capability indices only',
      'Ordinary least squares with no rater or item effects'
    ],
    answer: 0,
    why: 'Current ASQ MBB guidance includes percent agreement, kappa, Kendall, and ICC among methods for discrete measurement systems. The scale, raters, items, and intended agreement definition determine the appropriate statistic.'
  },
  75: {
    stem: 'A team classifies an attribute measurement system using this rule: accept as-is only if every category kappa is at least 0.80; reject and redesign if any category kappa is below 0.60; otherwise require application-specific review. With Koverall = 0.80 and category kappas 0.74, 0.78, and 0.86, what is the decision?',
    options: [
      'Accept as-is because the overall kappa equals 0.80',
      'Require application-specific review because at least one category is between 0.60 and 0.80',
      'Reject and redesign because at least one category is below 0.80',
      'No decision can be made because category kappas must all equal the overall kappa'
    ],
    answer: 1,
    why: 'The overall value does not override category performance. The lowest category kappa is 0.74: it is not below the rejection threshold, but it fails the all-categories acceptance threshold, so the stated rule requires application-specific review.'
  },
  77: {
    stem: 'A team uses this screening rule for six ICC estimates: all values at or above 0.75 are acceptable; any value from 0.40 to below 0.75 requires investigation and improvement; a value below 0.40 is unacceptable. The ICCs are 0.51, 0.62, 0.49, 0.64, 0.55, and 0.60. What is the decision?',
    options: [
      'Investigate and improve the measurement system',
      'Accept the measurement system without further review',
      'Reject it as automatically unusable because every ICC is below 0.75',
      'Average the ICCs and ignore the individual estimates'
    ],
    answer: 0,
    why: 'Every reported ICC lies between 0.40 and 0.75, so the supplied decision rule places the system in the investigate-and-improve band. The rule—not an unstated universal threshold—determines the answer.'
  },
  78: {
    stem: 'What is the primary purpose of an organizational maturity model in an improvement deployment?',
    options: [
      'Assess the current level of institutional capability and guide progression toward more mature, sustained practices',
      'Calculate the short-term Cp and Cpk of one production characteristic',
      'Replace strategy deployment with a certification count',
      'Prove that every business unit must use the same intervention sequence'
    ],
    answer: 0,
    why: 'A maturity model provides a staged view of institutional capability, helping leaders assess current state, identify gaps, and plan progression toward sustained transformation.'
  },
  82: {
    stem: 'Which technique can make the underlying pattern in a noisy time series easier to see?',
    options: ['A variance-stabilizing transformation only', 'Smoothing the series', 'Standardizing every value independently', 'Deleting every large residual'],
    answer: 1,
    why: 'Smoothing reduces short-term noise so level, trend, or seasonal structure is easier to see. It does not justify deleting special causes or outliers without investigation.'
  },
  97: {
    stem: 'For a fixed-total mixture experiment with a continuous response modeled by least squares, which assumptions are appropriate?',
    options: [
      'Component proportions sum to a constant, the response depends on composition, and model errors are independent with suitable variance and distributional behavior',
      'Component levels vary independently with no sum constraint',
      'Only total batch volume can affect the response; proportions cannot',
      'The response has no experimental or model error'
    ],
    answer: 0,
    why: 'Mixture factors are proportions constrained to a fixed total, so changing one component changes at least one other. Standard least-squares inference also requires an adequate mean model and appropriate error behavior.'
  },
  98: {
    stem: 'In the source deployment-finance taxonomy, which list contains the five portfolio benefit categories?',
    options: [
      'Efficiency, expense, intermediate, budget, and rollover',
      'Budget-impacting, efficiency, revenue growth, cost take-out, and working capital/cash flow',
      'Cost take-out, revenue growth, rollover, expense, and planned',
      'Baseline, planned, working capital/cash flow, efficiency, and budget'
    ],
    answer: 1,
    why: 'The source framework separates budget impact, efficiency, revenue growth, cost take-out, and working-capital or cash-flow effects. Organizations may use different labels, so the classification should be defined and reconciled with Finance.'
  }
});

const rationaleByQuestion = {
  2: 'Deployment sequence should account for urgency, competitive pressure, and actual process capability so the organization does not overextend resources or introduce changes in the wrong order.',
  3: 'The cause-and-effect sizing concept starts from Y = f(X): the response or business outcome depends on causal input variables whose breadth and complexity influence project scope.',
  4: 'Deployment governance is the full operating system of decision rights, processes, roles, responsibilities, rules, and review mechanisms—not a training package or a single tool.',
  5: 'An executive steering committee supplies sponsorship, a quality council provides cross-enterprise governance, and the deployment team coordinates execution.',
  6: 'Classical decomposition separates an observed time series into systematic components such as trend and seasonality plus residual variation.',
  7: 'General project management is appropriate when the desired deliverable or solution path is sufficiently known; DMAIC is designed for performance problems whose causes and solution are not yet known.',
  8: 'Risk arises from uncertain events or conditions—something may happen or fail to happen—and their consequences for objectives such as scope, time, cost, or resources.',
  9: 'Systems thinking broadens the unit of analysis to include interactions, feedback, delays, and consequences across the larger system rather than optimizing one component in isolation.',
  11: 'Technology limitations, human adoption barriers, and inadequate infrastructure can each prevent a deployment from being accepted, supported, or sustained.',
  12: 'Pacing the change, aligning rewards, setting clear objectives, and communicating consistently are complementary controls in a practical change plan.',
  14: 'Centralization and decentralization describe where decision authority resides: concentrated at higher levels or delegated closer to the work.',
  16: 'Activity-based costing traces resource costs to activities using cost drivers, then assigns those activity costs according to how products, services, or customers consume them.',
  17: 'IRR is the discount rate that makes the net present value of inflows and outflows equal to zero—equivalently, the present value of benefits equals the present value of costs.',
  19: 'Organizational dynamics examines how leadership, culture, and change processes influence behavior and performance within the organization.',
  20: 'Juran described a structured movement from awareness of the need for quality change through goals, organization, training, projects, reporting, recognition, and institutionalization.',
  21: 'FMEA identifies potential failure modes, their effects and causes, and prioritizes risk-reduction actions; it is therefore directly suited to risk analysis.',
  22: 'Ouchi’s Theory Z emphasizes long-term employment, consensual decisions, individual responsibility, relatively slow evaluation, and holistic concern for employees.',
  24: 'Hoshin kanri aligns breakthrough priorities vertically through levels of management and horizontally across functions, linking strategy with coordinated execution.',
  26: 'A split-plot design is used when at least one factor is hard or expensive to change, creating whole plots for that factor and subplots for easier-to-change factors.',
  27: 'Principles establish the purpose, culture reinforces expected behavior, practices turn the principles into routines, and tools support those practices.',
  28: 'Structural inertia causes organizations to preserve roles, reporting lines, and routines after the conditions that originally justified them have changed.',
  29: 'Heron groups intervention styles into authoritative interventions, which direct or challenge, and facilitative interventions, which help the client discover and act.',
  30: 'Once an identified risk event occurs, the preplanned contingency response should be invoked; ad hoc replanning is slower and may omit prepared controls.',
  31: 'Principled negotiation separates the people from the problem, focuses on interests rather than positions, creates options for mutual gain, and uses objective criteria.',
  35: 'A megaproject is defined by exceptional scale and complexity that challenge ordinary governance and coordination, not by a universal dollar or duration threshold.',
  40: 'A work breakdown structure decomposes the total project scope hierarchically into deliverables and manageable work packages.',
  41: 'Mail, telephone, and fax are communication media; observation, focus groups, and interviews are research methods that can be conducted through particular media.',
  44: 'The bullwhip effect is amplification of demand variability upstream when downstream orders or schedules change, leading suppliers to react more strongly than end demand warrants.',
  55: 'DMEDI, IDOV, DMADOV, and DMADV are established Design for Six Sigma roadmaps. DMAIC is primarily an improvement roadmap for existing processes.',
  59: 'Hoshin kanri is commonly translated as policy deployment or management by policy; policy execution is not the conventional name used in this source framework.',
  62: 'Mager’s formulation centers a learning objective on observable performance, the conditions under which it occurs, and the criterion for acceptable performance.',
  65: 'Reliable plans and completion dates let portfolio leaders forecast resource demand, sequence dependencies, and compare progress across concurrent projects.',
  66: 'A tollgate should confirm evidence, resources, stakeholder engagement, and conflicts before advancing. Broadening scope at the gate invites scope creep and should require explicit rechartering.',
  69: 'Mentoring is a longer-term developmental relationship that shares judgment, guidance, and career perspective; coaching is typically more immediate and performance-specific.',
  70: 'When team failure is imminent, the coach should intervene promptly to diagnose the failure mode, restore productive norms, and escalate only when the team cannot recover safely.',
  71: 'A lower certification standard for executives undermines procedural fairness and leadership credibility, which can demoralize employees and weaken the entire deployment.',
  72: 'Propagation of error quantifies how uncertainty in component dimensions or inputs combines to affect the variation or tolerance of the assembled output.',
  79: 'MAD summarizes absolute errors, MSD summarizes squared errors, and MAPE expresses absolute error relative to actual values; all three assess fitted or forecast accuracy.',
  80: 'Weak stationarity requires a constant mean and variance and an autocovariance structure that depends on lag rather than calendar time.',
  84: 'The balanced project constraints are time, cost, quality, and scope; changing one commonly forces tradeoffs in one or more of the others.',
  86: 'Traditional planning distinguishes strategic direction, tactical translation, and operational execution, with increasing specificity and shorter horizons.',
  89: 'Simulation exposes interactions and permits controlled comparison of many configurations without disrupting the real system; credible conclusions normally require validation and repeated runs.',
  90: 'ROI, IRR, NPV, and cost-benefit ratio all compare project economics. BAC and EAC are earned-value budget terms, not primary investment-selection measures.',
  95: 'The source pipeline sequence identifies opportunities, qualifies their suitability, selects and prioritizes them, assigns ownership and resources, and formally closes completed or retired work.',
  96: 'For independent parallel components, system reliability is 1 − (1 − 0.90)(1 − 0.92)(1 − 0.94) = 1 − 0.00048 = 0.99952.',
  99: 'Closure is a formal decision that work is complete or no longer viable; reassignment, sponsor departure, or exhausted funds can occur without satisfying closure requirements.'
};

const sourceWithRepairs = fs.readFileSync(sourcePath, 'utf8')
  .replace(/\f/g, '\n')
  .replace(/Â�/g, '')
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/–/g, '–')
  .split(/Simulated Examination Answers/)[0];

const ignoredLine = line => {
  const value = line.trim();
  return !value || /^Simulated Examination Questions/.test(value) || /^for Parts I/.test(value) ||
    /^There are 100 multiple-choice/.test(value) || /^Choose the best answer/.test(value) ||
    /^\d+\s+Simulated Examination Questions/.test(value) || /^\d+$/.test(value);
};

const parsed = [];
let question = null;
let option = null;

sourceWithRepairs.split(/\r?\n/).forEach(rawLine => {
  if (ignoredLine(rawLine)) return;
  const line = rawLine.replace(/\s+/g, ' ').trim();
  const questionStart = line.match(/^(\d{1,3})\.\s+(.*)$/);
  if (questionStart) {
    if (question) parsed.push(question);
    question = { number: Number(questionStart[1]), stem: questionStart[2], options: [] };
    option = null;
    return;
  }
  if (!question) return;
  const optionStart = line.match(/^([A-P])\.\s+(.*)$/);
  if (optionStart) {
    option = { label: optionStart[1], text: optionStart[2] };
    const duplicate = question.options.find(existing => existing.label === option.label && existing.text === option.text);
    if (!duplicate) question.options.push(option);
    return;
  }
  if (option) option.text += ` ${line}`;
  else question.stem += ` ${line}`;
});
if (question) parsed.push(question);

const byNumber = new Map();
parsed.forEach(item => {
  if (item.number >= 1 && item.number <= 100 && !byNumber.has(item.number)) byNumber.set(item.number, item);
});
if (byNumber.size !== 100) {
  const missing = Array.from({ length: 100 }, (_, index) => index + 1).filter(number => !byNumber.has(number));
  throw new Error(`Expected 100 simulated-exam questions; parsed ${byNumber.size}. Missing: ${missing.join(', ')}`);
}

const clean = value => value
  .replace(/\s+/g, ' ')
  .replace(/\bmak-\s+ing\b/g, 'making')
  .replace(/\bhierarchal\b/gi, 'hierarchical')
  .replace(/\s+([,.;:?])/g, '$1')
  .replace(/Â/g, '')
  .trim();

const bank = Array.from({ length: 100 }, (_, index) => {
  const number = index + 1;
  const raw = byNumber.get(number);
  const repair = repairs[number];
  let stem;
  let options;
  let answer;
  let rationale;
  let chart;

  if (repair) {
    ({ stem, options, answer, chart } = repair);
    rationale = repair.why;
    /* Do not let the normalization repairs create an answer-position cue.
       Preserve the source key position when it was already A-D; for source
       combination answers, distribute deterministically across A-D. */
    const sourceAnswerIndex = ['A','B','C','D'].indexOf(answerKey[index]);
    const targetAnswer = sourceAnswerIndex >= 0 ? sourceAnswerIndex : number % 4;
    if (answer !== targetAnswer) {
      const correctOption = options[answer];
      const distractors = options.filter((_, optionIndex) => optionIndex !== answer);
      options = distractors.slice();
      options.splice(targetAnswer, 0, correctOption);
      answer = targetAnswer;
    }
  } else {
    stem = clean(raw.stem);
    options = raw.options.filter(candidate => ['A','B','C','D'].includes(candidate.label)).map(candidate => clean(candidate.text));
    const answerLabel = answerKey[index];
    answer = ['A','B','C','D'].indexOf(answerLabel);
    if (options.length !== 4 || answer < 0) {
      throw new Error(`Question ${number} needs an explicit four-choice repair (source answer ${answerLabel})`);
    }
    rationale = rationaleByQuestion[number];
    if (!rationale) throw new Error(`Question ${number} needs a specific rationale`);
  }

  const correctLabel = String.fromCharCode(65 + answer);
  const sourceNote = `<span class="tb-source-ref">Source: The Certified Six Sigma Master Black Belt Handbook, simulated examination, Question ${number}; normalized for four-choice delivery.</span>`;
  return {
    sub: subByQuestion.get(number),
    stem: clean(stem),
    options: options.map(clean),
    answer,
    why: `${rationale} <b>${correctLabel}. ${clean(options[answer])}</b> ${sourceNote}`,
    ...(chart ? { chart } : {}),
    set: 1,
    sourceDocument: 'The Certified Six Sigma Master Black Belt Handbook',
    sourceAssessment: 'Simulated Examination Questions for Parts I–VI',
    sourceQuestion: number,
    sourceAnswer: answerKey[index],
    qid: `mbb:set-1:source-${number}`
  };
});

const output = `(function(global){\n  'use strict';\n  global.MBB_SET1=${JSON.stringify(bank, null, 2)};\n})(window);\n`;
fs.writeFileSync(path.resolve(outputPath), output);
console.log(`Wrote ${bank.length} normalized MBB simulated-exam questions to ${outputPath}`);
