/*
 * ASQ CRE Exam Set 1 — original questions written to the 2025 CRE Body of Knowledge.
 * Batch 1 of 15: III.A.1–III.A.3 (basic statistics, probability, distributions).
 *
 * Every calculated answer is recomputed independently in tests/test-bank-cre-set1.test.js.
 * Notation follows The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting &
 * McShane-Vaughn, 2025): Weibull shape β and scale η; lognormal μ and σ on the ln scale.
 * Visuals with a "cre-" type are drawn by test-bank-cre-ui.js; all others use engine renderers.
 */
(function(global){
  'use strict';
  var HB='The ASQ Certified Reliability Engineer Handbook, 4th ed. (Hulting & McShane-Vaughn, 2025)';
  var III_A={domain:'III. Probability and Statistics for Reliability',subdomain:'A. Basic Concepts'};
  function bok(code,topic){return {domain:III_A.domain,subdomain:III_A.subdomain,code:code,topic:topic};}
  function src(section,example){return [{id:'S1',document:HB,chapter:'Chapter 6 - Probability and Statistics for Reliability, Basic Concepts',section:section,example:example}];}

  global.CRE_SET1=[
  {
    qid:'cre:set-1:b01-q01',set:1,batch:1,sub:'cre-statistics',
    bok:bok('III.A.1','Sampling distribution of the mean and the central limit theorem'),
    difficulty:'Easy',cognitive:'Apply',questionType:'Calculation and concept',quantitative:true,
    stem:'Fatigue-test lives of a welded bracket are strongly right-skewed, with a population standard deviation of 18,000 cycles. An engineer will report the mean life of n = 36 randomly selected specimens. Which statement correctly describes the sampling distribution of that sample mean?',
    options:[
      'It is centered on the population mean, has a standard error of 3,000 cycles, and is approximately normal.',
      'It is centered on the population mean, has a standard error of 18,000 cycles, and is right-skewed like the population.',
      'It is centered on the population mean, has a standard error of 500 cycles, and is approximately normal.',
      'It is centered on the population mean, has a standard error of 3,000 cycles, and stays right-skewed because the central limit theorem requires a normal population.'
    ],
    answer:0,
    why:'The central limit theorem says the distribution of sample means approaches a normal shape as n grows, whatever the shape of the population, and n = 36 is usually large enough. Its spread is the standard error σ/√n = 18,000/√36 = 18,000/6 = 3,000 cycles. Individual lives stay skewed; only the means become approximately normal. <b>A. Centered on μ, standard error 3,000 cycles, approximately normal.</b> <span class="tb-source-ref">Source: CRE Handbook (4th ed.), Ch. 6, Basic Statistics — expectation and the central limit theorem.</span>',
    optionRationales:[
      'Correct. σ/√n = 18,000/6 = 3,000 cycles, and the CLT makes the mean approximately normal for n = 36.',
      'This is the spread and shape of individual lives (the population), not of the sample mean.',
      'Divides by n instead of √n: 18,000/36 = 500. The standard error uses the square root of the sample size.',
      'The CLT does not need a normal population; that independence from the parent shape is the whole point of the theorem.'
    ],
    keyPoint:'Standard error = σ/√n, and sample means are approximately normal for large n whatever the population shape.',
    trap:'Dividing by n instead of √n, or assuming the means keep the population\'s skew.',
    formula:'SE(x̄) = σ/√n = 18,000/√36 = 3,000 cycles',
    assumptions:['Specimens are a simple random sample from one population.','n = 36 is large enough for the central limit theorem to apply.'],
    estimatedMinutes:1,keywords:['central limit theorem','standard error','sampling distribution','population versus sample'],
    sourceDocument:HB,sourceSection:'Chapter 6 - Basic Statistics',sources:src('Basic Statistics — the central limit theorem',null)
  },
  {
    qid:'cre:set-1:b01-q02',set:1,batch:1,sub:'cre-statistics',
    bok:bok('III.A.2','Conditional probability and independence from a contingency table'),
    difficulty:'Medium',cognitive:'Analyze',questionType:'Visual evidence interpretation, calculation',quantitative:true,
    stem:'The table summarizes the confirmed failure mode of 400 field returns of a valve actuator built at two plants. A newly returned unit is found to have corrosion. What is the probability that it was built at the South plant, and what does that result show about plant and failure mode?',
    chart:{type:'data-table',title:'Field returns by plant and confirmed failure mode',
      columns:['Plant','Seal leak','Corrosion','Electrical','Total'],
      rows:[['North','90','30','80','200'],['South','60','70','70','200'],['Total','150','100','150','400']]},
    options:[
      '0.175; plant and failure mode are independent because each plant shipped half of the returns.',
      '0.35; plant and failure mode are dependent because corrosion makes up 35% of South returns.',
      '0.70; plant and failure mode are dependent because P(South | Corrosion) differs from P(South).',
      '0.70; plant and failure mode are independent because both plants returned exactly 200 units.'
    ],
    answer:2,
    why:'Condition on the corrosion column: P(South | Corrosion) = 70/100 = 0.70. With no information about the failure mode, P(South) = 200/400 = 0.50. Because knowing the mode changes the probability (0.70 ≠ 0.50), the events are dependent; corrosion is concentrated at the South plant. Equal plant totals only mean the marginal probabilities are equal; they say nothing about independence. <b>C. 0.70; dependent because P(South | Corrosion) ≠ P(South).</b> <span class="tb-source-ref">Source: CRE Handbook (4th ed.), Ch. 6, Basic Probability Concepts, Equation 6.11 and Examples 6.25–6.26 (conditional probability with a contingency table).</span>',
    optionRationales:[
      '70/400 = 0.175 is the joint probability P(South and Corrosion), not the conditional probability asked for.',
      '70/200 = 0.35 reverses the condition: it is P(Corrosion | South), not P(South | Corrosion).',
      'Correct. 70/100 = 0.70, which differs from the marginal P(South) = 0.50, so the events are dependent.',
      'The probability is right but the conclusion is wrong. Equal marginal totals do not show independence; compare the conditional with the marginal.'
    ],
    keyPoint:'Independence holds only if P(A | B) = P(A). Compare the conditional probability with the unconditional one.',
    trap:'Using the joint cell over the grand total, or conditioning on the wrong event.',
    formula:'P(South | Corr) = P(South ∩ Corr)/P(Corr) = (70/400)/(100/400) = 0.70; P(South) = 0.50',
    assumptions:['Each return has exactly one confirmed failure mode.'],
    estimatedMinutes:2,keywords:['conditional probability','independence','contingency table','joint probability'],
    sourceDocument:HB,sourceSection:'Chapter 6 - Basic Probability Concepts',sources:src('Basic Probability Concepts — conditional probability','Examples 6.25–6.26')
  },
  {
    qid:'cre:set-1:b01-q03',set:1,batch:1,sub:'cre-statistics',
    bok:bok('III.A.2','Bayes’ theorem with a probability tree: escapes from a two-stage screen'),
    difficulty:'Very Hard',cognitive:'Analyze',questionType:'Visual evidence interpretation, multi-step calculation',quantitative:true,
    stem:'Incoming power modules are screened as shown in the probability tree. Any module rejected by Screen 1 is retested by Screen 2. For a module of a given true condition, the two screen results are independent, and Screen 2 has the same detection and false-reject probabilities as Screen 1. Only modules rejected by both screens are scrapped; all others ship. What is the expected latent-defect level among shipped modules, in defective parts per million (ppm)?',
    chart:{type:'cre-prob-tree',title:'Two-stage screen for a latent defect',
      altText:'Probability tree. A module carries the latent defect with probability 0.03 or is good with probability 0.97. A defective module is rejected by Screen 1 with probability 0.92 and passes with 0.08; if rejected, Screen 2 rejects it with 0.92 and passes it with 0.08. A good module is rejected by Screen 1 with probability 0.04 and passes with 0.96; if rejected, Screen 2 rejects it with 0.04 and passes it with 0.96. Modules rejected twice are scrapped; all others ship.',
      root:'Module',
      children:[
        {label:'Latent defect',p:'0.03',children:[
          {label:'Screen 1 reject',p:'0.92',children:[{label:'Screen 2 reject',p:'0.92',outcome:'Scrap'},{label:'Screen 2 pass',p:'0.08',outcome:'Ship'}]},
          {label:'Screen 1 pass',p:'0.08',outcome:'Ship'}]},
        {label:'Good',p:'0.97',children:[
          {label:'Screen 1 reject',p:'0.04',children:[{label:'Screen 2 reject',p:'0.04',outcome:'Scrap'},{label:'Screen 2 pass',p:'0.96',outcome:'Ship'}]},
          {label:'Screen 1 pass',p:'0.96',outcome:'Ship'}]}
      ]},
    options:['2,400 ppm','2,466 ppm','4,608 ppm','4,736 ppm'],
    answer:3,
    why:'A defective module ships on two paths: it passes Screen 1 (0.03 × 0.08 = 0.002400), or it is rejected by Screen 1 and then passed by Screen 2 (0.03 × 0.92 × 0.08 = 0.002208). Together, P(Defect and Ship) = 0.004608. Equivalently, 0.03 − 0.03 × 0.92² = 0.03 − 0.025392. Every module that is not scrapped ships: P(Ship) = 1 − (0.03 × 0.92² + 0.97 × 0.04²) = 1 − (0.025392 + 0.001552) = 0.973056. Bayes’ theorem: P(Defect | Ship) = 0.004608/0.973056 = 0.004736, or about 4,736 ppm. As an expected-frequency check, per 10,000 modules about 46.1 defective modules ship among 9,730.6 shipped. <b>D. 4,736 ppm</b> <span class="tb-source-ref">Source: CRE Handbook (4th ed.), Ch. 6, Basic Probability Concepts, Equations 6.11–6.12 and Examples 6.30–6.32 (tree diagrams and expected frequencies).</span>',
    optionRationales:[
      'Counts only defective modules that escape Screen 1 (0.03 × 0.08). It misses the defective modules that Screen 2 passes, and it does not divide by the probability of shipping.',
      'Divides the Screen 1 escape path alone by P(Ship). It still misses the defective modules rescued by Screen 2.',
      'P(Defect and Ship) = 0.004608 is a joint probability over all modules. The question asks for the level among shipped modules, so divide by P(Ship) = 0.973.',
      'Correct. 0.004608/0.973056 = 0.004736, or about 4,736 ppm.'
    ],
    keyPoint:'Outgoing quality is a conditional probability: add every path where a defective unit ships, then divide by the total probability of shipping.',
    trap:'Missing the defective units that the second screen passes back, or forgetting to normalize by the shipped population.',
    formula:'P(D | Ship) = [P(D) − P(D)·d²]/[1 − P(D)·d² − P(G)·f²] = 0.004608/0.973056 = 0.004736 (d = 0.92, f = 0.04)',
    assumptions:['Screen results are conditionally independent given the module’s true condition.','A module rejected by Screen 1 and passed by Screen 2 ships.'],
    estimatedMinutes:4,keywords:['Bayes theorem','probability tree','expected frequency tree','outgoing quality','screening escapes'],
    sourceDocument:HB,sourceSection:'Chapter 6 - Basic Probability Concepts',sources:src('Basic Probability Concepts — tree diagrams','Examples 6.30–6.32')
  },
  {
    qid:'cre:set-1:b01-q04',set:1,batch:1,sub:'cre-statistics',
    bok:bok('III.A.3','Poisson distribution for spares provisioning'),
    difficulty:'Hard',cognitive:'Analyze',questionType:'Visual evidence interpretation, calculation',quantitative:true,
    stem:'A remote compressor station is resupplied only at the interval shown in the planning sheet. Seal failures occur at a constant rate, and each failed seal is replaced immediately from on-site stock. Using the Poisson distribution, what is the minimum number of spare seals to stock so that the probability that a seal fails when no spare is left (failures before resupply exceed the stock) is no more than 5%?',
    chart:{type:'data-table',title:'Station spares planning sheet',
      columns:['Item','Value'],
      rows:[['Compressors running continuously','4'],['Seals per compressor','1'],['Seal MTBF (constant failure rate)','2,400 h'],['Mean time to replace a seal','6 h'],['Resupply interval','2,100 h'],['Required protection against stock-out','95%']]},
    options:['3','4','7','8'],
    answer:2,
    why:'The expected number of seal failures across the station is λt = (4 seals × 2,100 h)/2,400 h = 3.5. The 6 h replacement time is not needed. Stock s spares so that P(X ≤ s) ≥ 0.95. From the cumulative Poisson table at λ = 3.5: P(X ≤ 6) = 0.9347, which is short of 0.95, and P(X ≤ 7) = 0.9733, which meets it. So s = 7. <b>C. 7</b> <span class="tb-source-ref">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions, Examples 6.39–6.40 (Poisson); Appendix C.2, Cumulative Poisson Distribution Table.</span>',
    optionRationales:[
      'Uses one compressor (λt = 2,100/2,400 = 0.875) instead of all four seals in service.',
      'Stocks the expected number of failures, rounded up. With λt = 3.5, four spares give only P(X ≤ 4) = 0.725 protection.',
      'Correct. P(X ≤ 6) = 0.935 < 0.95 and P(X ≤ 7) = 0.973 ≥ 0.95.',
      'Off by one: requires P(X ≤ s − 1) ≥ 0.95. With s spares, up to s failures can be covered, so the condition is P(X ≤ s) ≥ 0.95.'
    ],
    keyPoint:'For spares, find the smallest s with cumulative Poisson P(X ≤ s) at or above the required protection level, using the combined expected failures of every unit in service.',
    trap:'Using one unit\'s failure rate, or stocking only the mean number of failures.',
    formula:'λt = n·t/MTBF = 4 × 2,100/2,400 = 3.5;  choose the smallest s with P(X ≤ s | 3.5) ≥ 0.95 → s = 7',
    assumptions:['Failures follow a homogeneous Poisson process.','Replacement seals have the same constant failure rate.','Replacement time is negligible relative to the interval.'],
    estimatedMinutes:3,keywords:['Poisson distribution','spares provisioning','constant failure rate','cumulative Poisson table'],
    sourceDocument:HB,sourceSection:'Chapter 6 - Probability Distributions',sources:src('Probability Distributions — Poisson','Examples 6.39–6.40; Appendix C.2')
  },
  {
    qid:'cre:set-1:b01-q05',set:1,batch:1,sub:'cre-statistics',
    bok:bok('III.A.3','Binomial distribution for an at-least-k-of-n requirement'),
    difficulty:'Medium',cognitive:'Apply',questionType:'Calculation',quantitative:true,
    stem:'A pipeline leak-detection array uses 12 identical sensors that fail independently. The safety case is met if at least 10 sensors are still working at the end of a one-year inspection interval. Each sensor has a one-year reliability of 0.95. What is the probability that the array meets the safety case at the end of the interval?',
    options:['0.0988','0.5987','0.8816','0.9804'],
    answer:3,
    why:'The number of working sensors X is binomial with n = 12 and p = 0.95. P(X ≥ 10) = P(10) + P(11) + P(12). P(12) = 0.95¹² = 0.5404. P(11) = 12 × 0.95¹¹ × 0.05 = 0.3413. P(10) = 66 × 0.95¹⁰ × 0.05² = 0.0988. Sum = 0.9804. <b>D. 0.9804</b> <span class="tb-source-ref">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions, Examples 6.33–6.34 (binomial); Appendix B.2, Cumulative Binomial Distribution Table.</span>',
    optionRationales:[
      'This is P(X = 10) only. "At least 10" also includes 11 and 12 working sensors.',
      '0.95¹⁰ treats the 10 sensors as a fixed series set and ignores that any 10 of the 12 will do.',
      'This is P(X ≥ 11). It drops the case where exactly 10 sensors survive.',
      'Correct. P(10) + P(11) + P(12) = 0.0988 + 0.3413 + 0.5404 = 0.9804.'
    ],
    keyPoint:'"At least k of n" is a cumulative binomial: sum P(X = j) from j = k to n.',
    trap:'Taking only the single term P(X = k), or treating the k sensors as a series system.',
    formula:'P(X ≥ 10) = Σ C(12,j)(0.95)^j(0.05)^(12−j), j = 10, 11, 12',
    assumptions:['Sensor failures are independent.','All sensors share the same one-year reliability.'],
    estimatedMinutes:3,keywords:['binomial distribution','k-out-of-n','independent trials','cumulative probability'],
    sourceDocument:HB,sourceSection:'Chapter 6 - Probability Distributions',sources:src('Probability Distributions — binomial','Examples 6.33–6.34; Appendix B.2')
  },
  {
    qid:'cre:set-1:b01-q06',set:1,batch:1,sub:'cre-statistics',
    bok:bok('III.A.3','Weibull conditional reliability for a fleet already in service'),
    difficulty:'Hard',cognitive:'Analyze',questionType:'Software output interpretation, calculation',quantitative:true,
    stem:'Life data for a gearbox bearing were fitted with the two-parameter Weibull model shown in the output. Forty bearings in the field have each run 500 hours without failure. How many of these 40 bearings are expected to fail during their next 500 hours of operation?',
    chart:{type:'data-table',title:'Distribution Analysis: Bearing life (h) — Weibull, least squares estimates',
      columns:['Parameter','Estimate'],
      rows:[['Shape (β)','1.8'],['Scale (η)','2,000 h'],['Mean (MTTF)','1,778.6 h'],['B10 life','572.9 h'],['Failures / suspensions','14 / 6']]},
    options:['6.8','7.4','8.8','10.0'],
    answer:1,
    why:'These bearings have already survived 500 h, so use conditional reliability: R(500 more | 500) = R(1,000)/R(500). With β = 1.8 and η = 2,000 h: R(1,000) = exp[−(0.5)^1.8] = exp(−0.2872) = 0.7504, and R(500) = exp[−(0.25)^1.8] = exp(−0.0825) = 0.9209. So R(500 more | 500) = 0.7504/0.9209 = 0.8149. The conditional probability of failure is 1 − 0.8149 = 0.1851, and the expected number of failures is 40 × 0.1851 = 7.4 bearings. Because β > 1 the hazard increases with age, so these used bearings are about 2.3 times as likely to fail in the next 500 h as new ones (0.185 versus 0.079). <b>B. 7.4</b> <span class="tb-source-ref">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions, Examples 6.42–6.44 (Weibull calculations).</span>',
    optionRationales:[
      '40 × [F(1,000) − F(500)] = 40 × (0.9209 − 0.7504) = 6.8 is the unconditional chance that a new bearing fails between 500 h and 1,000 h. These bearings are known to have survived 500 h, so divide by R(500).',
      'Correct. 40 × [1 − R(1,000)/R(500)] = 40 × 0.1851 = 7.4.',
      '40 × [1 − exp(−500/2,000)] treats the scale η as an exponential MTBF. The output shows wear-out (β = 1.8), so the exponential model does not apply.',
      '40 × [1 − R(1,000)] uses the unconditional probability of failing by 1,000 h. That includes failures in the first 500 h, which these bearings have already survived.'
    ],
    keyPoint:'For units already in service, use conditional reliability R(T + t)/R(T). Only the exponential (β = 1) is memoryless.',
    trap:'Using the unconditional window F(1,000) − F(500) without dividing by R(500), or treating η as an exponential MTBF.',
    formula:'E[failures] = N × [1 − R(T + t)/R(T)] = 40 × [1 − exp(−(1,000/2,000)^1.8)/exp(−(500/2,000)^1.8)] = 7.4',
    assumptions:['The two-parameter Weibull fit is adequate.','Field use matches the test conditions.','Failed bearings are not replaced during the 500 h window.'],
    estimatedMinutes:3,keywords:['Weibull','conditional reliability','wear-out','memoryless property'],
    sourceDocument:HB,sourceSection:'Chapter 6 - Probability Distributions',sources:src('Probability Distributions — Weibull','Examples 6.42–6.44')
  },
  {
    qid:'cre:set-1:b01-q07',set:1,batch:1,sub:'cre-statistics',
    bok:bok('III.A.3','Lognormal percentile (B10 life)'),
    difficulty:'Medium',cognitive:'Apply',questionType:'Calculation',quantitative:true,
    stem:'Cycles to failure of a solder joint in thermal cycling are lognormally distributed. The fitted parameters of ln(cycles) are μ = 8.987 and σ = 0.60. What is the B10 life, the number of cycles by which 10% of joints are expected to fail?',
    options:['2,980 cycles','3,710 cycles','7,998 cycles','17,260 cycles'],
    answer:1,
    why:'For a lognormal, ln(T) is normal with mean μ and standard deviation σ. The 10th percentile of ln(T) is μ + z₀.₁₀σ, where z₀.₁₀ = −1.2816. So ln(B10) = 8.987 − 1.2816 × 0.60 = 8.218 and B10 = e^8.218 ≈ 3,710 cycles. (Using z = 1.28 from the table gives the same rounded value.) <b>B. 3,710 cycles</b> <span class="tb-source-ref">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions, Examples 6.47–6.48 (lognormal); Appendix D, Cumulative Standard Normal Table.</span>',
    optionRationales:[
      'Uses z = 1.645, which gives the 5th percentile (B5 life), not the 10th.',
      'Correct. exp(8.987 − 1.2816 × 0.60) ≈ 3,710 cycles.',
      'e^μ is the median life (B50), not the B10 life.',
      'Adds 1.2816σ instead of subtracting it, which gives the 90th percentile (the life by which 90% fail).'
    ],
    keyPoint:'Lognormal percentiles: work on the ln scale with the normal z value, then exponentiate.',
    trap:'Using the 5% z value, or adding zσ for a lower-tail percentile.',
    formula:'B10 = exp(μ − 1.2816σ) = exp(8.987 − 0.769) ≈ 3,710 cycles',
    assumptions:['The lognormal model fits the solder-joint data.'],
    estimatedMinutes:2,keywords:['lognormal','B10 life','percentile','thermal cycling'],
    sourceDocument:HB,sourceSection:'Chapter 6 - Probability Distributions',sources:src('Probability Distributions — lognormal','Examples 6.47–6.48; Appendix D')
  },
  {
    qid:'cre:set-1:b01-q08',set:1,batch:1,sub:'cre-statistics',
    bok:bok('III.A.1','Nonparametric Kaplan-Meier estimate with suspensions'),
    difficulty:'Hard',cognitive:'Analyze',questionType:'Visual evidence interpretation, calculation',quantitative:true,
    stem:'Ten prototype pumps were run on a test stand. Some were removed early for unrelated reasons (suspensions), and the test ended at 800 hours. Using the Kaplan-Meier (product-limit) method, what is the estimated reliability at 750 hours?',
    chart:{type:'data-table',title:'Prototype pump test log (n = 10)',
      columns:['Unit','Hours','Status'],
      rows:[['P‑07','150','Failed'],['P‑02','230','Suspended (removed for fixture rework)'],['P‑09','310','Failed'],['P‑04','400','Failed'],['P‑01','480','Suspended (removed for teardown study)'],['P‑10','560','Failed'],['P‑05','600','Suspended (stand power loss)'],['P‑03','720','Failed'],['P‑06','800','Survived to end of test'],['P‑08','800','Survived to end of test']]},
    options:['0.20','0.36','0.405','0.50'],
    answer:1,
    why:'Kaplan-Meier multiplies (n − d)/n at each failure time, where n is the number still at risk just before that time. Suspended units leave the risk set without counting as failures. 150 h: 10 at risk, R = 9/10 = 0.900. The 230 h suspension leaves 8. 310 h: R = 0.900 × 7/8 = 0.7875. 400 h: R = 0.7875 × 6/7 = 0.675. The 480 h suspension leaves 5. 560 h: R = 0.675 × 4/5 = 0.540. The 600 h suspension leaves 3. 720 h: R = 0.540 × 2/3 = 0.360. No other events occur before 750 h, so R(750) = 0.36. <b>B. 0.36</b> <span class="tb-source-ref">Source: CRE Handbook (4th ed.), Ch. 6, Basic Statistics (parametric versus nonparametric) and Examples 6.59–6.62 (Kaplan-Meier).</span>',
    optionRationales:[
      'Counts every suspension as a failure: 1 − 8/10 = 0.20. That understates reliability badly.',
      'Correct. 0.9 × 7/8 × 6/7 × 4/5 × 2/3 = 0.36.',
      'Misses the 600 h suspension, leaving 4 at risk at 720 h: 0.54 × 3/4 = 0.405.',
      '1 − 5/10 = 0.50 keeps the suspended units in the denominator as if they had been observed to 750 h.'
    ],
    keyPoint:'In Kaplan-Meier, suspensions shrink the risk set but never count as failures.',
    trap:'Treating suspensions as failures, or as survivors to the evaluation time.',
    formula:'R̂(t) = Π over failure times tᵢ ≤ t of (nᵢ − dᵢ)/nᵢ',
    assumptions:['Suspensions are unrelated to the pump failure mechanism (non-informative censoring).'],
    estimatedMinutes:4,keywords:['Kaplan-Meier','product-limit estimator','censored data','suspensions','nonparametric'],
    sourceDocument:HB,sourceSection:'Chapter 6 - Basic Statistics; Kaplan-Meier',sources:src('Kaplan-Meier analysis','Examples 6.59–6.62')
  },
  {
    qid:'cre:set-1:b01-q09',set:1,batch:1,sub:'cre-statistics',
    bok:bok('III.A.3','Chi-square goodness of fit to a Poisson model'),
    difficulty:'Very Hard',cognitive:'Evaluate',questionType:'Visual evidence interpretation, hypothesis test',quantitative:true,
    stem:'An engineer wants to check whether solder voids per circuit board follow a Poisson distribution before using that model for reliability predictions. The counts for 100 boards are shown (no board had more than 5 voids), and the Poisson mean is estimated from these same data. Expected cell counts must be at least 5. Which statement correctly reports the chi-square goodness-of-fit test at α = 0.05?',
    chart:{type:'data-table',title:'Solder voids per board (n = 100 boards)',
      columns:['Voids per board','0','1','2','3','4','5'],
      rows:[['Number of boards','27','46','13','9','4','1']]},
    options:[
      'χ² = 6.81 with 3 degrees of freedom (critical value 7.815): fail to reject the Poisson model.',
      'χ² = 7.28 with 3 degrees of freedom (critical value 7.815): fail to reject the Poisson model.',
      'χ² = 8.55 with 3 degrees of freedom (critical value 7.815): reject the Poisson model.',
      'χ² = 6.81 with 2 degrees of freedom (critical value 5.991): reject the Poisson model.'
    ],
    answer:3,
    why:'Step 1, estimate λ: (0×27 + 1×46 + 2×13 + 3×9 + 4×4 + 5×1)/100 = 120/100 = 1.2. Step 2, expected counts: 100 × P(X = k | 1.2) gives 30.12, 36.14, 21.69 and 8.67 for 0 to 3 voids, and only 3.38 for 4 or more. Because 3.38 < 5, pool into a "3 or more" cell (observed 14, expected 12.05). Step 3, χ² = Σ(O − E)²/E = 0.323 + 2.688 + 3.479 + 0.315 = 6.81. Step 4, df = k − 1 − m = 4 cells − 1 − 1 estimated parameter = 2, so the critical value is χ²₀.₀₅,₂ = 5.991. Since 6.81 > 5.991, reject the Poisson model (p ≈ 0.033). <b>D. χ² = 6.81 with 2 df: reject.</b> <span class="tb-source-ref">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions, Example 6.51 (chi-square goodness of fit) and Appendix G, Chi-Square Distribution Table.</span>',
    optionRationales:[
      'The statistic is right but the df is wrong. Estimating λ from the same data costs one more degree of freedom: df = 4 − 1 − 1 = 2, not 3.',
      'Does not pool the "4 or more" cell, whose expected count is 3.38 (below 5). That gives 5 cells and a different statistic.',
      'Divides by the observed counts instead of the expected counts: Σ(O − E)²/O = 8.55. The test statistic always uses E in the denominator.',
      'Correct. With pooled cells χ² = 6.81 > 5.991, the critical value for 2 df.'
    ],
    keyPoint:'Goodness-of-fit df = cells − 1 − number of parameters estimated from the data; pool cells until every expected count is at least 5.',
    trap:'Forgetting to subtract a degree of freedom for the estimated mean, which flips the decision here.',
    formula:'χ² = Σ (O − E)²/E;  df = k − 1 − m',
    assumptions:['Boards are independent.','The expected-count rule of at least 5 per cell is applied before computing the statistic.'],
    estimatedMinutes:6,keywords:['chi-square goodness of fit','Poisson','degrees of freedom','pooling cells','estimated parameter'],
    sourceDocument:HB,sourceSection:'Chapter 6 - Probability Distributions',sources:src('Probability Distributions — chi-square goodness of fit','Example 6.51; Appendix G')
  },
  {
    qid:'cre:set-1:b01-q10',set:1,batch:1,sub:'cre-statistics',
    bok:bok('III.A.3','Reading a Weibull probability plot and interpreting the shape parameter'),
    difficulty:'Hard',cognitive:'Evaluate',questionType:'Visual evidence interpretation, decision',quantitative:true,
    stem:'Ten failure times of a new electronic control unit are plotted on Weibull probability paper with the fitted line shown. Reading the fitted line, which conclusion and action are most appropriate?',
    chart:{type:'cre-weibull-plot',title:'Weibull probability plot — control unit failures (n = 10, median ranks)',
      altText:'Weibull probability plot with time in hours on a log scale from 1 to 10,000 and unreliability from 1% to 99%. Ten points at 5.4 h (6.7%), 27.4 h (16.3%), 99.4 h (26.0%), 180 h (35.6%), 383 h (45.2%), 568 h (54.8%), 1,154 h (64.4%), 1,728 h (74.0%), 3,412 h (83.7%) and 7,063 h (93.3%) fall close to a straight fitted line. The line crosses 10% unreliability at about 11 hours and the 63.2% reference line at 1,000 hours.',
      xTicks:[1,10,100,1000,10000],yTicks:[1,5,10,20,30,50,63.2,80,90,99],
      points:[[5.4,6.7],[27.4,16.3],[99.4,26.0],[180,35.6],[383,45.2],[568,54.8],[1154,64.4],[1728,74.0],[3412,83.7],[7063,93.3]],
      line:{beta:0.5,eta:1000},
      xLabel:'Time to failure (hours, log scale)',yLabel:'Unreliability F(t), %'},
    options:[
      'β ≈ 0.5: the hazard rate is decreasing (early-life failures). Fixed-interval preventive replacement would not help; investigate manufacturing escapes and consider burn-in or ESS.',
      'β ≈ 1.15: the hazard rate is nearly constant. Failures are random, so run the units to failure and keep spares.',
      'β ≈ 0.5: the hazard rate is decreasing. Lengthen the preventive replacement interval so units are replaced less often but still before they fail.',
      'β ≈ 2.0: the hazard rate is increasing (wear-out). Set a preventive replacement interval at the B10 life read from the plot.'
    ],
    answer:0,
    why:'On Weibull paper, the slope of the fitted line is β. Read two points from the line: it crosses the dashed 63.2% line at η ≈ 1,000 h and the 10% line at about 11 h. Then: β = [ln(−ln(1 − 0.632)) − ln(−ln(1 − 0.10))]/[ln(1,000) − ln(11)] = [0 − (−2.250)]/(6.908 − 2.398) = 2.250/4.51 ≈ 0.50. When β < 1 the hazard rate decreases with age, which signals infant mortality from defects that escaped manufacturing. Replacing a unit early swaps it for a new one with a higher hazard, so time-based preventive replacement makes things worse. The right response is to find and remove the defect source and, until then, screen with burn-in or ESS. <b>A. β ≈ 0.5, decreasing hazard: investigate escapes and consider burn-in or ESS.</b> <span class="tb-source-ref">Source: CRE Handbook (4th ed.), Ch. 6, Probability Distributions (Weibull) and Examples 6.54–6.57 (distribution identification).</span>',
    optionRationales:[
      'Correct. The slope is about 0.5, so β < 1 and the hazard is decreasing; preventive replacement would only add early failures.',
      'Mixes logarithm bases: the y-axis is ln(−ln(1 − F)) but log₁₀ was used on the time axis, giving 2.25/1.955 ≈ 1.15.',
      'The slope and hazard are read correctly, but the action is wrong. With β < 1 a replacement unit has a higher hazard than the one it replaces, so any time-based replacement adds failures; it also leaves the escape source in place.',
      'A slope of 2 would be a steep line. This line rises only about 2.25 units on the ln scale across two decades of time.'
    ],
    keyPoint:'β is the slope on Weibull paper: below 1 means a decreasing hazard (infant mortality), 1 means constant, above 1 means wear-out.',
    trap:'Using log₁₀ for time while the y-axis uses natural logs, or keeping any time-based replacement when β < 1.',
    formula:'β = [ln(−ln(1 − F₂)) − ln(−ln(1 − F₁))]/[ln t₂ − ln t₁]',
    assumptions:['A single failure mode is present.','The points follow the fitted straight line without curvature.'],
    estimatedMinutes:4,keywords:['Weibull probability plot','shape parameter','infant mortality','burn-in','bathtub curve'],
    sourceDocument:HB,sourceSection:'Chapter 6 - Probability Distributions',sources:src('Probability Distributions — Weibull; distribution identification','Examples 6.54–6.57')
  }
  ];
})(window);
