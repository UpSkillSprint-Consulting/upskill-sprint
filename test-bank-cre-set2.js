/* Original CRE Set 2. Append validated batches here; never renumber released IDs.
 * Technical reference: Hulting & McShane-Vaughn (eds.), ASQ CRE Handbook,
 * 4th ed. (2025). Exam codes/weights follow ASQ's published 2025 CRE BoK.
 * No handbook text, figures, or released examination questions are reproduced.
 */
(function (global) {
  'use strict';
  const tex = String.raw;
  const reliabilityLesson = '/lessons/quality-engineering/introduction-to-reliability-and-maintainability';
  const questions = [
    {
      number: 1, qid: 'cre:set-2:001', sub: 'cre-fundamentals', bok: 'I.B.1',
      topic: 'Operational availability', cognitive: 'Apply', difficulty: 'Moderate', estimatedMinutes: 1.5,
      industry: 'Manufacturing', quantitative: true,
      stem: 'A packaging line is required continuously during a 1,000-hour observation period. The mutually exclusive time categories below account for the entire period. What is its observed operational availability, including all causes of downtime?',
      options: ['95.24%', '90.00%', '93.75%', '96.00%'], answer: 1,
      chart: {type: 'data-table', title: 'Line operating record', columns: ['Time category', 'Hours'], rows: [['Operating and able to perform the required function', 900], ['Active corrective maintenance', 45], ['Active preventive maintenance', 15], ['Waiting for spares or administrative release', 40]]},
      why: tex`<p>Operational availability includes every category that prevents the line from fulfilling its required function. The denominator is the entire required observation period.</p><p>\[A_o=\frac{T_{\mathrm{up}}}{T_{\mathrm{up}}+T_{\mathrm{down}}}=\frac{900}{900+45+15+40}=0.9000\]</p><p>Here, \(T_{\mathrm{up}}\) is operating time and \(T_{\mathrm{down}}\) includes corrective, preventive, logistics, and administrative downtime. The answer is <strong>90.00%</strong>.</p>`,
      optionRationales: ['95.24% divides 900 by 945 and excludes preventive maintenance and waiting time. That does not measure operational availability over the stated period.', '90.00% includes all 100 hours of downtime in the 1,000 required hours.', '93.75% divides 900 by 960, including active maintenance but excluding logistics and administrative delays.', '96.00% subtracts only the 40 waiting hours from the total, incorrectly treating the 60 active-maintenance hours as uptime.'],
      keyPoint: 'Choose the availability definition before selecting the downtime categories.',
      trap: 'An active-maintenance-only denominator overstates operational availability.',
      assumptions: ['The line is required throughout the observation period.', 'Time categories do not overlap; all downtime prevents the required function.'],
      handbook: {chapter: 2, section: 'Basic Reliability Terminology; operational, achieved, and inherent availability'},
      studyReference: {title: 'Availability concepts and calculator', url: reliabilityLesson + '#sec-availability'}
    },
    {
      number: 2, qid: 'cre:set-2:002', sub: 'cre-fundamentals', bok: 'I.A.7',
      topic: 'Ethical reporting of a failed demonstration', cognitive: 'Evaluate', difficulty: 'Moderate', estimatedMinutes: 1,
      industry: 'Medical devices', quantitative: false,
      stem: 'A reliability demonstration has an approved failure criterion: any loss of the required function is a failure. One device briefly loses that function, then passes a retest. The project manager asks the reliability engineer to exclude the original event because a planned firmware update is expected to prevent recurrence. Which response is MOST appropriate?',
      options: ['Replace the original result with the successful retest, retaining the original only in laboratory notes.', 'Change the failure criterion retrospectively for every unit so the final analysis uses one consistent definition.', 'Report the original failure and retest separately, investigate the event, and evaluate the update through approved change and verification processes.', 'Keep the original event out of the reliability estimate until enough similar events occur to establish statistical significance.'], answer: 2,
      why: '<p>The event meets the approved criterion and remains a failure in the original demonstration. A successful retest does not erase the event, and an expected firmware benefit is not verified evidence.</p><p>The engineer should preserve traceability, report the failure and retest accurately, investigate the cause, and assess the proposed change through the approved process. Any further demonstration must identify the configuration and acceptance criteria it actually evaluated.</p>',
      optionRationales: ['Retaining an event in private notes does not make a misleading demonstration result acceptable.', 'A consistent retrospective change can still bias acceptance. Criteria must not be changed merely to make observed failures disappear.', 'This preserves the original evidence and separates demonstrated performance from an unverified corrective action.', 'Statistical significance is not a prerequisite for recording an event that meets an approved failure criterion.'],
      keyPoint: 'Report observed evidence against the approved criteria and distinguish proposed corrections from verified results.',
      trap: 'A passing retest is additional evidence, not permission to overwrite a failure.',
      assumptions: ['The initial event is valid and meets the approved criterion.', 'The proposed firmware correction has not been verified.'],
      handbook: {chapter: 1, section: 'Ethics in Reliability Engineering'},
      lessonGap: 'A dedicated reliability ethics and demonstration-reporting lesson is planned; use the cited handbook section and the explanation above.'
    },
    {
      number: 3, qid: 'cre:set-2:003', sub: 'cre-risk', bok: 'II.B.1',
      topic: 'Fault tree with a repeated basic event', cognitive: 'Analyze', difficulty: 'Challenging', estimatedMinutes: 2,
      industry: 'Process equipment', quantitative: true,
      stem: 'The fault tree describes loss of a protection function during one mission. Basic events A, B, and C are mutually independent, with the mission probabilities shown. Both appearances of C represent the SAME event. What is the probability of the top event?',
      options: ['0.0150', '0.00005', '0.3160', '0.0140'], answer: 3,
      chart: {type: 'data-table', creKind: 'fault-tree', title: 'Protection-function fault tree', columns: ['Basic event', 'Mission probability', 'Tree role'], rows: [['A', '0.10', 'Left AND branch'], ['B', '0.20', 'Right AND branch'], ['C', '0.05', 'The same event in both AND branches']], description: 'Top event T is (A AND C) OR (B AND C). C is a single shared event, not two separate events.'},
      why: tex`<p>Factor out the repeated event before calculating. The two branch events overlap because both contain C.</p><p>\[T=(A\cap C)\cup(B\cap C)=C\cap(A\cup B)\]</p><p>\[\begin{aligned}\Pr(T)&=\Pr(C)\left[\Pr(A)+\Pr(B)-\Pr(A)\Pr(B)\right]\\&=0.05(0.10+0.20-0.02)\\&=0.0140\end{aligned}\]</p><p>The intersection term removes the double counting of missions in which A, B, and C all occur.</p>`,
      optionRationales: ['0.0150 simply adds the two AND-branch probabilities. It counts their shared intersection twice.', '0.00005 multiplies the two branch probabilities as though the top gate were AND and the repeated C events were separate.', '0.3160 is the probability of A OR B OR C, a different tree.', '0.0140 accounts for the shared event and subtracts the overlapping intersection once.'],
      keyPoint: 'Independent basic events do not make overlapping fault-tree branches independent.',
      trap: 'Repeated event labels identify the same physical event; never multiply them as independent copies.',
      assumptions: ['A, B, and C are mutually independent over the same mission.', 'C denotes one physical event in both branches.'],
      handbook: {chapter: 4, section: 'Fault Tree Analysis (FTA); AND and OR Gates'},
      lessonGap: 'A dedicated repeated-event fault-tree lesson is planned; use the cited handbook section and the worked solution above.'
    },
    {
      number: 4, qid: 'cre:set-2:004', sub: 'cre-risk', bok: 'II.B.2',
      topic: 'FMEA severity override', cognitive: 'Evaluate', difficulty: 'Foundational', estimatedMinutes: 1,
      industry: 'Industrial machinery', quantitative: false,
      stem: 'A design-review procedure requires immediate safety review of every credible failure mode rated severity 9 or 10, regardless of its risk priority number (RPN). Remaining modes are ranked by RPN. The ratings below are approved and the hazards are credible. Which action BEST follows the procedure?',
      options: ['Begin safety review of guard-interlock failure, then rank the remaining modes by RPN.', 'Begin with bearing seizure because its RPN is highest, then review the guard interlock.', 'Begin with coating blistering because it has the highest occurrence rating.', 'Defer guard-interlock review because its RPN is below 100 and occurrence is low.'], answer: 0,
      chart: {type: 'data-table', title: 'Approved design FMEA excerpt', columns: ['Failure mode', 'Severity', 'Occurrence', 'Detection', 'RPN'], rows: [['Bearing seizure', 8, 7, 6, 336], ['Guard-interlock failure', 10, 2, 3, 60], ['Coating blistering', 4, 8, 7, 224]]},
      why: '<p>The explicit severity rule takes precedence over the numerical RPN ordering. Guard-interlock failure has severity 10, so it requires immediate safety review despite having the lowest RPN.</p><p>After that review is initiated, the remaining modes rank bearing seizure first and coating blistering second. An RPN cutoff has not been authorized, and the low occurrence rating does not cancel the stated safety-review requirement.</p>',
      optionRationales: ['This applies the mandatory severity screen first, then uses the stated ranking method for the remaining modes.', 'The largest product of the ratings cannot override the explicit severity rule.', 'Occurrence alone is not the approved prioritization method.', 'The proposed threshold is invented and conflicts with the severity override.'],
      keyPoint: 'Apply the stated risk-acceptance and escalation rules before ranking by a composite score.',
      trap: 'A low RPN does not, by itself, establish that a severe hazard is acceptable.',
      assumptions: ['The stated procedure governs this review.', 'The question does not invoke an external action-priority lookup table.'],
      handbook: {chapter: 4, section: 'Failure Mode and Effects Analysis (FMEA); Action Priority'},
      lessonGap: 'A dedicated FMEA prioritization lesson is planned; use the cited handbook section and the decision rule above.'
    },
    {
      number: 5, qid: 'cre:set-2:005', sub: 'cre-statistics', bok: 'III.A.1',
      topic: 'Kaplan–Meier estimation with right censoring', cognitive: 'Analyze', difficulty: 'Challenging', estimatedMinutes: 2,
      industry: 'Electronics', quantitative: true,
      stem: 'Five independent components start a life test at time zero. The table gives their complete observation records. Censoring is unrelated to component condition, and there are no tied event times. Using the Kaplan–Meier estimator, what is the estimated probability of surviving beyond 250 hours?',
      options: ['0.4000', '0.6000', '0.5333', '0.6667'], answer: 2,
      chart: {type: 'data-table', title: 'Component life-test records', columns: ['Component', 'Observation time (h)', 'Status at that time'], rows: [['U1', 100, 'Failure'], ['U2', 150, 'Right censored; functioning at withdrawal'], ['U3', 200, 'Failure'], ['U4', 300, 'Failure'], ['U5', 400, 'Right censored; functioning at test end']]},
      why: tex`<p>At 100 hours, all five components are at risk and one fails. The withdrawal at 150 hours does not create a drop in survival; it removes one component from subsequent risk sets. At 200 hours, three components remain at risk and one fails.</p><p>\[\widehat R(250)=\prod_{t_i\le250}\left(1-\frac{d_i}{n_i}\right)=\left(1-\frac15\right)\left(1-\frac13\right)=\frac{8}{15}\approx0.5333\]</p><p>Here, \(d_i\) is the number of failures at failure time \(t_i\), and \(n_i\) is the number at risk immediately before that time. The failure at 300 hours is beyond the requested mission time.</p>`,
      optionRationales: ['0.4000 treats the withdrawal at 150 hours as another failure before 250 hours.', '0.6000 uses three survivors out of five and ignores how right censoring changes the risk set.', '0.5333 multiplies the survival fractions at the two failure times up to 250 hours, using the correct risk sets.', '0.6667 is only the conditional survival fraction at 200 hours; it omits the earlier survival factor.'],
      keyPoint: 'Censoring reduces future risk sets but does not directly reduce a Kaplan–Meier survival estimate.',
      trap: 'Neither treating a suspension as a failure nor ignoring it gives the product-limit estimate.',
      assumptions: ['All components enter at time zero.', 'Censoring is noninformative; no failures and censoring occur at the same time.'],
      handbook: {chapter: 6, section: 'Reliability Distribution Estimation Using the Kaplan-Meier Method'},
      lessonGap: 'A dedicated Kaplan–Meier and censoring lesson is planned; use the cited handbook section and the worked risk-set calculation above.'
    },
    {
      number: 6, qid: 'cre:set-2:006', sub: 'cre-statistics', bok: 'III.A.4',
      topic: 'Weibull reliability and hazard interpretation', cognitive: 'Analyze', difficulty: 'Moderate', estimatedMinutes: 1.5,
      industry: 'Transportation', quantitative: false,
      stem: 'Two nonrepairable actuator designs follow two-parameter Weibull lifetime models. Both have characteristic life 1,000 hours. Design A has shape 1; Design B has shape 2. Using the reliability curves and these model assumptions, which statement is correct?',
      options: ['Design B has higher reliability at both 500 and 1,500 hours because its shape parameter is larger.', 'The designs have identical reliability at every mission time because their characteristic lives are equal.', 'Design A has increasing hazard and Design B has constant hazard; prefer A at 500 hours.', 'Design B has higher reliability at 500 hours, Design A at 1,500 hours; B has increasing hazard.'], answer: 3,
      chart: {type: 'data-table', creKind: 'weibull', title: 'Predicted actuator reliability', columns: ['Mission time (h)', 'Design A reliability', 'Design B reliability'], rows: [[0, '1.0000', '1.0000'], [500, '0.6065', '0.7788'], [1000, '0.3679', '0.3679'], [1500, '0.2231', '0.1054'], [2000, '0.1353', '0.0183']], eta: 1000, betaA: 1, betaB: 2},
      why: tex`<p>Reliability rankings depend on mission duration. Design B is better at 500 hours, but its curve falls below A after 1,000 hours.</p><p>\[R(t)=\exp\left[-\left(\frac{t}{\eta}\right)^{\beta}\right],\qquad h(t)=\frac{\beta}{\eta}\left(\frac{t}{\eta}\right)^{\beta-1}\]</p><p>Here, \(t\) is mission time, \(\eta\) is characteristic life, \(\beta\) is shape, and \(h(t)\) is hazard rate. Shape 1 gives constant hazard; shape 2 gives increasing hazard. Equal characteristic life fixes one common point on the reliability curves, not the entire curves.</p>`,
      optionRationales: ['Increasing shape does not improve reliability at every mission time; the curves cross.', 'Equal characteristic life gives equal reliability at that characteristic life, not at every time.', 'The hazard interpretations are reversed. Shape 1 gives constant hazard and shape 2 gives increasing hazard.', 'This agrees with the two mission-time comparisons and the Weibull hazard relationship.'],
      keyPoint: 'Compare lifetime distributions at the mission time that matters to the decision.',
      trap: 'Characteristic life is not a guarantee of equal means or equal reliability at other times.',
      assumptions: ['Two-parameter Weibull models apply with zero location parameter.', 'Mission conditions are the same for both designs.'],
      handbook: {chapter: 6, section: 'Probability Functions; Reliability Functions; Hazard Functions'},
      studyReference: {title: 'Reliability and hazard-function explorer', url: reliabilityLesson + '#sec-calc-ref'},
      explorer: 'weibull'
    },
    {
      number: 7, qid: 'cre:set-2:007', sub: 'cre-testing', bok: 'IV.A.1',
      topic: 'Zero-failure demonstration sample size', cognitive: 'Apply', difficulty: 'Moderate', estimatedMinutes: 1.5,
      industry: 'Consumer products', quantitative: true,
      stem: 'A supplier must demonstrate mission reliability of at least 0.90 with a one-sided 95% confidence bound. Each independent, representative unit will complete one entire specified mission, and the plan accepts only if there are zero failures. Using an exact binomial zero-failure plan, what is the MINIMUM number of units to test?',
      options: ['28', '29', '22', '30'], answer: 1,
      why: tex`<p>For a zero-failure binomial demonstration, choose the smallest integer sample size for which the probability of all successes at the boundary reliability is no greater than the significance level.</p><p>\[R_0^n\le\alpha,\qquad n\ge\frac{\ln(\alpha)}{\ln(R_0)}=\frac{\ln(0.05)}{\ln(0.90)}\approx28.433\]</p><p>Here, \(R_0\) is the required mission reliability, \(n\) is the number of complete independent missions, and \(\alpha=1-0.95\). Round upward: <strong>29 units</strong>. The boundary probabilities are approximately 0.05233 for 28 units and 0.04710 for 29 units.</p>`,
      optionRationales: ['28 rounds downward and leaves the boundary all-success probability above 0.05.', '29 is the smallest integer meeting the one-sided 95% demonstration requirement.', '22 is sufficient for approximately 90% confidence, not the specified 95%.', '30 also satisfies the requirement, but it is not the minimum sample size.'],
      keyPoint: 'A minimum demonstration sample size is rounded upward after selecting the correct confidence level.',
      trap: 'Completing a longer total exposure is not interchangeable with complete independent missions without an additional lifetime-model assumption.',
      assumptions: ['Each unit supplies one independent Bernoulli mission outcome with a common success probability.', 'Zero failures are required; incomplete missions do not count as successes.'],
      handbook: {chapter: 8, section: 'Planning Zero-Failure Tests to Estimate Reliability'},
      lessonGap: 'A dedicated reliability-demonstration lesson is planned; use the cited handbook section and the sample-size explorer in answer review.',
      explorer: 'sample-size'
    },
    {
      number: 8, qid: 'cre:set-2:008', sub: 'cre-testing', bok: 'IV.C.1',
      topic: 'Series–parallel system reliability', cognitive: 'Apply', difficulty: 'Moderate', estimatedMinutes: 1.5,
      industry: 'Telecommunications', quantitative: true,
      stem: 'A communication function requires the power supply and at least one of two active channels to survive the mission. The diagram gives their mission reliabilities. Component failures are mutually independent, either channel alone has sufficient capacity, and all other connections are perfect. What is the system mission reliability?',
      options: ['0.9702', '0.9800', '0.9900', '0.7938'], answer: 0,
      chart: {type: 'data-table', creKind: 'rbd', title: 'Communication-system reliability block diagram', columns: ['Component or stage', 'Mission reliability', 'Requirement'], rows: [['Power supply', '0.98', 'Required'], ['Channel 1', '0.90', 'At least one channel required'], ['Channel 2', '0.90', 'At least one channel required']], description: 'Power supply in series with two active channels in parallel. Both channels are already active; no standby switching is needed.'},
      why: tex`<p>The channel stage succeeds unless both channels fail. The power supply is then a required series element.</p><p>\[\begin{aligned}R_{\mathrm{channels}}&=1-(1-0.90)(1-0.90)=0.99\\R_{\mathrm{system}}&=0.98\times0.99=0.9702\end{aligned}\]</p><p>Both probabilities describe the same mission. A common-cause failure or imperfect supporting connection would require additional modeling, but neither is part of this stated model.</p>`,
      optionRationales: ['0.9702 combines the parallel channel stage with the required power supply in series.', '0.9800 treats the channel stage as perfectly reliable.', '0.9900 is only the parallel-channel reliability; it omits the power supply.', '0.7938 multiplies all three reliabilities and incorrectly requires both channels to survive.'],
      keyPoint: 'Translate the required system function into series and parallel success logic before calculating.',
      trap: 'Physical duplication does not remove the reliability contribution of a shared required support component.',
      assumptions: ['Failures are mutually independent.', 'Either active channel alone supplies the required capacity; no repair occurs during the mission.'],
      handbook: {chapter: 10, section: 'Reliability Block Diagrams and Models; Series–Parallel System'},
      lessonGap: 'A dedicated system block-diagram lesson is planned; use the cited handbook section and the stage-by-stage solution above.'
    },
    {
      number: 9, qid: 'cre:set-2:009', sub: 'cre-lifecycle', bok: 'V.A.2',
      topic: 'Normal stress–strength interference', cognitive: 'Analyze', difficulty: 'Challenging', estimatedMinutes: 2,
      industry: 'Mechanical components', quantitative: true,
      stem: 'For a single load application, component strength is normal with mean 120 MPa and standard deviation 10 MPa. Applied stress is independently normal with mean 90 MPa and standard deviation 8 MPa. Treat these population parameters as known. Failure occurs when stress exceeds strength. What is the approximate probability of failure?',
      options: ['4.78%', '99.04%', '0.96%', '0.135%'], answer: 2,
      why: tex`<p>Define the strength margin as \(D=\text{strength}-\text{stress}\). Independent normal variables give a normal difference. Subtract the means and add the variances.</p><p>\[\mu_D=120-90=30\,\mathrm{MPa},\qquad\sigma_D=\sqrt{10^2+8^2}\approx12.806\,\mathrm{MPa}\]</p><p>\[\Pr(\text{failure})=\Pr(D<0)=\Phi\left(\frac{0-30}{12.806}\right)\approx0.009575=0.9575\%\]</p><p>Here, \(\Phi\) is the standard normal cumulative distribution function. Rounding gives <strong>0.96%</strong>. This is the probability for the stated single load application.</p>`,
      optionRationales: ['4.78% results from adding the standard deviations (10 + 8) instead of adding their variances.', '99.04% is approximately the probability of success, not failure.', '0.96% uses the lower tail of the normal strength-margin distribution with the correct variance.', '0.135% uses the strength standard deviation alone and ignores stress variation.'],
      keyPoint: 'For independent stress and strength, the difference variance is the sum of their variances.',
      trap: 'Do not add standard deviations or report reliability when the question asks for failure probability.',
      assumptions: ['Stress and strength are independent normal population distributions.', 'Parameters are known; the problem is not asking for a confidence bound or repeated-load lifetime.'],
      handbook: {chapter: 11, section: 'Stress–Strength Analysis for Normal Distributions'},
      lessonGap: 'A dedicated stress–strength interference lesson is planned; use the cited handbook section and the margin-distribution calculation above.'
    },
    {
      number: 10, qid: 'cre:set-2:010', sub: 'cre-lifecycle', bok: 'V.C.2',
      topic: 'When age-based preventive replacement is ineffective', cognitive: 'Apply', difficulty: 'Foundational', estimatedMinutes: 1,
      industry: 'Plant maintenance', quantitative: false,
      stem: 'Field evidence supports a constant failure hazard for a replaceable electronic module over its entire planned service life. Replacement restores it to as-new condition but requires planned downtime. There are no age-related failure modes, hidden failures, or mandated replacement intervals. A proposal recommends replacement every 500 operating hours solely to reduce the module’s age-related failure risk. Which conclusion is BEST supported?',
      options: ['Adopt the interval because every surviving module becomes less reliable per operating hour as it ages.', 'Do not justify the interval by age reduction; compare corrective or condition-based strategies using consequences, detectability, and downtime.', 'Adopt the interval because an as-new module has zero instantaneous failure hazard immediately after installation.', 'Reject all preventive and predictive tasks because an exponential lifetime means maintenance cannot improve any aspect of system performance.'], answer: 1,
      why: tex`<p>Constant hazard means that surviving age does not increase the failure risk over an additional equal operating interval. For an exponential lifetime,</p><p>\[\Pr(T>t+s\mid T>t)=\exp(-\lambda s)\]</p><p>where \(T\) is lifetime, \(t\) is the current surviving age, \(s\) is an additional operating interval, and \(\lambda\) is the constant hazard. The expression does not depend on age \(t\). Replacing the module solely to make it younger does not lower that hazard and adds planned downtime. Other maintenance decisions still require assessment of consequences, detection opportunities, and system effects.</p>`,
      optionRationales: ['This assumes increasing hazard, contrary to the evidence in the question.', 'This rejects the unsupported age-reduction rationale while retaining a consequence-based assessment of maintenance alternatives.', 'An as-new item governed by a positive constant hazard still has that hazard immediately after installation.', 'This overgeneralizes. Inspection, detection, restoration, and other system-level maintenance benefits are not ruled out by the lifetime model.'],
      keyPoint: 'Age-based replacement needs an age-dependent mechanism or another justified requirement.',
      trap: 'Memorylessness does not imply that all maintenance or monitoring is useless.',
      assumptions: ['Constant hazard is supported throughout the planned service life.', 'The proposed replacement has no separate regulatory, safety, or hidden-failure justification.'],
      handbook: {chapter: 13, section: 'Preventive Maintenance (PM) Analysis'},
      studyReference: {title: 'Failure hazard and the bathtub curve', url: reliabilityLesson + '#sec-bathtub'}
    }
  ];
  questions.forEach(q => {q.set = 2; q.batch = 1; q.sourceDocument = 'The ASQ Certified Reliability Engineer Handbook, 4th edition (2025)'; q.original = true;});
  global.CRE_SET2 = questions;

  // Merge only our set into the live definition. Existing Set 1 data is preserved.
  global.registerCRESet2 = function (exam, domainMetadata) {
    const existing = exam.sets || {};
    const first = existing[1] || exam.bank || [];
    exam.sets = Object.assign({}, existing, {1: first, 2: questions});
    if (!exam.bank || !exam.bank.length) exam.bank = questions;
    exam.defaultSet = first.length ? '1' : '2';
    exam.setPlans = Object.assign({}, exam.setPlans, {2: {target: 150, label: 'Batch 1 · Q001–010'}});
    exam.fullExamQuestionsBySet = Object.assign({}, exam.fullExamQuestionsBySet, {2: 150});
    // Actual CBT pace: 165 displayed items in 258 minutes; this bank targets 150 core items.
    exam.questions = 165; exam.minutes = 258;
    const domains = [
      ['cre-fundamentals', 'I. Reliability Fundamentals', 29, 'Fundamentals'],
      ['cre-risk', 'II. Risk Management', 25, 'Risk'],
      ['cre-statistics', 'III. Probability and Statistics for Reliability', 35, 'Statistics'],
      ['cre-testing', 'IV. Reliability Planning, Testing, and Modeling', 35, 'Testing & Models'],
      ['cre-lifecycle', 'V. Lifecycle Reliability', 26, 'Lifecycle']
    ];
    domains.forEach(([id, name, weight, short]) => {
      domainMetadata[id] = {name: name.replace(/^[IVX]+\. /, ''), short, color: '#97601c'};
    });
    const isPlaceholder = !first.length && !existing[2];
    if (isPlaceholder) {
      exam.bok = domains.map(([id, name, weight]) => ({domain: id, weight, subs: [{id, name, w: weight, lesson: reliabilityLesson, lessonName: 'Reliability and Maintainability'}]}));
    } else {
      // Future Set 1 integrations may use different subtopic IDs. Match by the
      // official domain name and add aliases without changing its question data.
      domains.forEach(([id, name, weight]) => {
        if (exam.bok.some(d => d.subs.some(s => s.id === id))) return;
        const target = exam.bok.find(d => (domainMetadata[d.domain]?.name || '').replace(/^[IVX]+\. /, '') === name.replace(/^[IVX]+\. /, ''));
        if (target) target.subs.push({id, name, w: 0, lesson: reliabilityLesson, lessonName: 'Reliability and Maintainability'});
        else exam.bok.push({domain: id, weight, subs: [{id, name, w: weight, lesson: reliabilityLesson, lessonName: 'Reliability and Maintainability'}]});
      });
    }
  };
})(window);
