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
  'mbb-enterprise': [2,4,5,16,17,18,24,33,34,41,53,59,64,86],
  'mbb-org': [9,11,12,13,14,19,20,22,23,25,27,28,31,32,36,43,44,45,71,73,78],
  'mbb-portfolio': [3,7,8,21,30,35,37,38,40,42,47,48,49,51,52,65,81,84,90,95,98,99],
  'mbb-training': [54,56,57,58,60,61,62,88,92],
  'mbb-coaching': [29,63,66,67,68,69,70,100],
  'mbb-analytics': [1,6,10,15,26,39,46,50,55,72,74,75,76,77,79,80,82,83,85,87,89,91,93,94,96,97]
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

const domainRationale = {
  'mbb-enterprise': 'This choice matches the enterprise-planning, deployment, governance, customer, or financial principle tested by the item.',
  'mbb-org': 'This choice matches the organizational-design, culture, change, leadership, or systems-thinking principle tested by the item.',
  'mbb-portfolio': 'This choice matches the project-selection, portfolio, risk, governance, or project-management principle tested by the item.',
  'mbb-training': 'This choice matches the training-needs, instructional-design, delivery, or evaluation principle tested by the item.',
  'mbb-coaching': 'This choice matches the coaching, mentoring, feedback, tollgate, or team-development principle tested by the item.',
  'mbb-analytics': 'This choice matches the advanced measurement, modeling, design-of-experiments, optimization, reliability, or time-series principle tested by the item.'
};

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
  } else {
    stem = clean(raw.stem);
    options = raw.options.filter(candidate => ['A','B','C','D'].includes(candidate.label)).map(candidate => clean(candidate.text));
    const answerLabel = answerKey[index];
    answer = ['A','B','C','D'].indexOf(answerLabel);
    if (options.length !== 4 || answer < 0) {
      throw new Error(`Question ${number} needs an explicit four-choice repair (source answer ${answerLabel})`);
    }
    rationale = domainRationale[subByQuestion.get(number)];
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
