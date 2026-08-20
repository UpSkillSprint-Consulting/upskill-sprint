(function () {
  'use strict';

  var VERSION = '1.0.0';
  var SECTION_ORDER = ['mgmt', 'qsys', 'design', 'ppc', 'ci', 'quant', 'risk'];
  var SECTION_META = {
    mgmt: { name: 'I. Management & Leadership' },
    qsys: { name: 'II. The Quality System' },
    design: { name: 'III. Product, Process & Service Design' },
    ppc: { name: 'IV. Product & Process Control' },
    ci: { name: 'V. Continuous Improvement' },
    quant: { name: 'VI. Quantitative Methods & Tools' },
    risk: { name: 'VII. Risk Management' }
  };

  function f(id, sections, name, formula, when, variables, caution, patterns, aliases) {
    return {
      id: id,
      sections: sections,
      name: name,
      formula: formula,
      when: when,
      variables: variables || '',
      caution: caution || '',
      patterns: patterns || [],
      aliases: aliases || []
    };
  }

  var FORMULAS = [
    f('coq-total', ['mgmt', 'qsys'], 'Total cost of quality',
      'COQ = Prevention + Appraisal + Internal failure + External failure',
      'Use when a question asks for the total cost of quality or asks you to combine prevention, appraisal, and failure costs.',
      'All terms must cover the same reporting period and use the same currency basis.',
      'Do not classify ordinary production cost as cost of quality unless the question identifies it as prevention, appraisal, or failure cost.',
      [/cost of quality|prevention cost|appraisal cost|internal failure|external failure/i], ['COQ', 'PAF model']),
    f('roi', ['mgmt', 'ci'], 'Return on investment',
      'ROI (%) = (Benefit − Cost) / Cost × 100',
      'Use when comparing the net benefit of an improvement with the amount invested.',
      'Benefit = monetary gain or avoided cost; Cost = required investment.',
      'Use net benefit in the numerator. Benefit divided by cost alone is a benefit-cost ratio, not ROI.',
      [/return on investment|\bROI\b|net benefit.*investment|investment.*benefit/i], ['financial return']),
    f('npv', ['mgmt'], 'Net present value',
      'NPV = Σ[CFₜ / (1 + r)ᵗ] − C₀',
      'Use when cash flows occur in different periods and must be discounted to present value.',
      'CFₜ = cash flow at time t; r = discount rate per period; C₀ = initial investment.',
      'Match the discount-rate period to the cash-flow period.',
      [/net present value|\bNPV\b|discount(?:ed| rate)|present value.*cash flow/i], ['discounted cash flow']),
    f('payback', ['mgmt'], 'Simple payback period',
      'Payback period = Initial investment / Annual net cash inflow',
      'Use for a simple payback question when annual net cash inflow is constant.',
      'Initial investment and annual inflow must use consistent currency units.',
      'Simple payback ignores the time value of money unless the question specifies discounted payback.',
      [/payback period|recover.*investment|initial investment.*annual/i], ['payback']),
    f('weighted-score', ['mgmt', 'risk'], 'Weighted decision score',
      'Weighted score = Σ(wᵢ × sᵢ)',
      'Use for supplier selection, project prioritization, or decision matrices with criterion weights and ratings.',
      'wᵢ = criterion weight; sᵢ = score for that criterion.',
      'Normalize weights when the question requires them to sum to 1 or 100%.',
      [/weighted score|decision matrix|weighted criteria|supplier.*weight|criteria.*rating/i], ['weighted matrix']),

    f('yield', ['qsys', 'ci', 'ppc'], 'Yield or percent conforming',
      'Yield (%) = Good units / Total units × 100',
      'Use when the question asks for the proportion of units that pass or conform.',
      'Good units = units meeting requirements; Total units = units entering the evaluated step.',
      'Clarify whether the question asks for first-pass yield, final yield, or rolled throughput yield.',
      [/\byield\b|percent conforming|good units|units pass/i], ['percent good']),
    f('ppm', ['qsys', 'ppc', 'ci'], 'Parts per million nonconforming',
      'PPM = Nonconforming units / Total units × 1,000,000',
      'Use for defective-unit rates expressed per million units.',
      'Count nonconforming units, not individual defects.',
      'Use DPMO when the denominator includes multiple defect opportunities per unit.',
      [/parts per million|\bPPM\b|per million.*nonconforming|nonconforming.*million/i], ['ppm defective']),
    f('dpmo', ['qsys', 'ci', 'quant'], 'Defects per million opportunities',
      'DPMO = Defects / (Units × Opportunities per unit) × 1,000,000',
      'Use when each unit can contain more than one independent defect opportunity.',
      'Defects = total observed defects; Units = units inspected; Opportunities = defect opportunities per unit.',
      'DPMO counts defects; PPM commonly counts nonconforming units.',
      [/DPMO|defects per million|opportunities per unit/i], ['defects per million opportunities']),

    f('worst-case-stack', ['design'], 'Worst-case tolerance stack',
      'Tᵂᶜ = Σ|Tᵢ|',
      'Use when every component tolerance is assumed to occur simultaneously in the worst direction.',
      'Tᵢ = bilateral component tolerance magnitude.',
      'Worst-case stacking is conservative and does not assume statistical independence.',
      [/worst[- ]case.*toler|tolerance stack|stack-up.*worst/i], ['arithmetic tolerance stack']),
    f('rss-stack', ['design'], 'RSS statistical tolerance stack',
      'Tᴿˢˢ = √Σ(Tᵢ²)',
      'Use for independent component tolerances combined statistically.',
      'Tᵢ = component tolerance magnitude.',
      'RSS requires a defensible independence and distribution assumption; it is not the guaranteed worst case.',
      [/\bRSS\b|root sum.*square|statistical.*tolerance|tolerance.*statistical/i], ['root-sum-square']),
    f('taguchi-loss', ['design', 'ci'], 'Taguchi quality loss',
      'L(y) = k(y − T)²',
      'Use when quality loss increases quadratically as the response departs from its target.',
      'y = observed response; T = target; k = loss coefficient.',
      'Deviation is from the target, not from the nearest specification limit.',
      [/Taguchi|quality loss|loss function|L\s*=\s*k/i], ['quadratic loss']),
    f('reliability-series', ['design', 'risk'], 'Series-system reliability',
      'Rₛ = ΠRᵢ',
      'Use when every component must operate for the system to succeed and component failures are independent.',
      'Rᵢ = reliability of component i.',
      'A series system becomes less reliable as required components are added.',
      [/series system|all components.*operate|series reliability/i], ['series reliability']),
    f('reliability-parallel', ['design', 'risk'], 'Parallel-system reliability',
      'Rₚ = 1 − Π(1 − Rᵢ)',
      'Use when at least one independent parallel component must operate for system success.',
      'Rᵢ = reliability of component i.',
      'This form assumes active, independent parallel paths unless the question specifies standby redundancy.',
      [/parallel system|components?.*parallel|parallel.*components?|redundan|at least one.*operate|parallel reliability/i], ['parallel reliability']),
    f('reliability-standby', ['design', 'risk'], 'Standby-system reliability',
      'Rₛ(t) = e⁻λᵗ Σᵢ₌₀ⁿ (λt)ⁱ / i!',
      'Use for a standby (cold-spare) system with n identical standby components and a constant failure rate, where the system survives as long as n or fewer failures have occurred.',
      'λ = constant failure rate of each component; n = number of standby components; t = mission time.',
      'Standby reliability is not the same as active-parallel reliability; use the parallel formula only when redundant units are all running simultaneously.',
      [/standby system|standby mode|standby redundan|standby component/i], ['standby reliability']),
    f('reliability-k-out-of-n', ['design', 'risk'], 'k-out-of-n system reliability',
      'Rₛ(t) = Σᵢ₌ₖⁿ C(n,i) pⁱ(1−p)ⁿ⁻ⁱ',
      "Use when a system needs at least k of its n identical subsystems to survive (or fails once more than n−k fail).",
      'n = number of subsystems; k = minimum number that must survive; p = reliability of each subsystem.',
      'Sum the binomial terms from i = k to n; a k-out-of-n system reduces to a series system when k = n and a parallel system when k = 1.',
      [/k-out-of-n|fail when (?:\w+\s+)?or more|will fail when \d|out of \d.*subsystems/i], ['k-out-of-n reliability']),
    f('reliability-empirical', ['design', 'risk'], 'Empirical reliability from a life table',
      'R̂(t) = nₛᵤᵣᵥᵢᵥᵢₙ𝓰(t) / N;  f̂(t) = (nₜ − nₜ₊₁) / [(Δt) × N];  ĥ(t) = (nₜ − nₜ₊₁) / [(Δt) × nₜ]',
      'Use when a table of observed failure counts over fixed time intervals is given and the question asks for estimated reliability, failure density, or instantaneous failure (hazard) rate.',
      'N = total units tested; nₜ = units still surviving at the start of an interval; Δt = interval width.',
      'Failure density divides by the original sample size N; the hazard rate divides by the survivors at the start of that interval, not N.',
      [/reliability test.*failures|observed failures.*interval|estimated reliability at time|estimated failure density|instantaneous rate of failure/i], ['empirical reliability', 'life table reliability']),
    f('availability', ['design', 'risk'], 'Steady-state availability',
      'A = MTBF / (MTBF + MTTR)',
      'Use for a repairable system when mean uptime and mean repair time are provided.',
      'MTBF = mean time between failures; MTTR = mean time to repair.',
      'Availability is not the same as reliability over a mission time.',
      [/availability|MTBF.*MTTR|uptime.*repair/i], ['operational availability']),
    f('mtbf', ['design', 'risk'], 'Mean time between failures',
      'MTBF = Total operating time / Number of failures',
      'Use for repairable equipment when accumulated operating time and failure count are given.',
      'Use operating time, not calendar time, unless the problem defines them as equivalent.',
      'For nonrepairable items, mean time to failure (MTTF) is usually the more appropriate metric.',
      [/mean time between failures|\bMTBF\b|operating time.*failures/i], ['mean time between failures']),
    f('mttr', ['design', 'risk'], 'Mean time to repair',
      'MTTR = Total corrective-repair time / Number of repairs',
      'Use when average restoration time is required.',
      'Include only the repair-time components defined by the question.',
      'Do not automatically include logistics or administrative delay unless stated.',
      [/mean time to repair|\bMTTR\b|repair time.*repairs/i], ['mean time to repair']),
    f('safety-factor', ['design', 'risk'], 'Factor of safety',
      'FoS = Allowable strength / Applied stress',
      'Use when comparing available strength or capacity with the applied demand.',
      'Use compatible stress or load units in numerator and denominator.',
      'Some disciplines define design factor differently; follow the convention stated in the question.',
      [/factor of safety|safety factor|allowable.*stress|strength.*applied/i], ['design factor']),

    f('xbar-r', ['ppc'], 'X̄ and R chart limits',
      'X̄ chart: UCL/LCL = X̿ ± A₂R̄;  R chart: UCL = D₄R̄, LCL = D₃R̄',
      'Use for variable data collected in rational subgroups, commonly with subgroup sizes 2–10.',
      'X̿ = grand mean; R̄ = average subgroup range; A₂, D₃, D₄ depend on subgroup size.',
      'Control limits describe process behavior; they are not specification limits.',
      [/X[-̄ ]?bar.*R chart|A2|D3|D4|average range|subgroup range/i], ['xbar-r', 'mean and range chart']),
    f('xbar-s', ['ppc'], 'X̄ and S chart limits',
      'X̄ chart: UCL/LCL = X̿ ± A₃s̄;  S chart: UCL = B₄s̄, LCL = B₃s̄',
      'Use for variable data in larger rational subgroups where subgroup standard deviation is preferred to range.',
      's̄ = average subgroup standard deviation; A₃, B₃, B₄ depend on subgroup size.',
      'Do not use overall standard deviation in place of average within-subgroup standard deviation.',
      [/X[-̄ ]?bar.*S chart|A3|B3|B4|subgroup standard deviation/i], ['xbar-s']),
    f('i-mr', ['ppc'], 'Individuals and moving-range chart limits',
      'I chart: UCL/LCL = X̄ ± 2.66MR̄;  MR chart: UCL = 3.267MR̄, LCL = 0',
      'Use for continuous measurements when only one observation is available at each time point.',
      'MR̄ is usually based on moving ranges of two consecutive observations.',
      'Strong autocorrelation can make conventional I-MR limits misleading.',
      [/individuals chart|I[- ]MR|moving range|one observation.*time/i], ['I-MR', 'XmR']),
    f('p-chart', ['ppc'], 'p-chart limits',
      'Center = p̄;  UCL/LCL = p̄ ± 3√[p̄(1 − p̄)/nᵢ]',
      'Use for the fraction or proportion nonconforming when subgroup size may vary.',
      'p̄ = overall fraction nonconforming; nᵢ = subgroup size for subgroup i.',
      'Use an np chart for counts nonconforming only when subgroup size is constant. A calculated negative LCL is reported as 0.',
      [/\bp chart\b|p̄\s*=|p-bar|UCL.*p̄|LCL.*p̄|fraction nonconforming|proportion nonconforming|varying sample size.*defective/i], ['proportion chart']),
    f('np-chart', ['ppc'], 'np-chart limits',
      'Center = np̄;  UCL/LCL = np̄ ± 3√[np̄(1 − p̄)]',
      'Use for the number of nonconforming units in equal-sized subgroups.',
      'n = constant subgroup size; p̄ = overall fraction nonconforming; np̄ = n × p̄.',
      'An np chart requires constant subgroup size. A calculated negative LCL is reported as 0.',
      [/\bnp chart\b|number nonconforming|count nonconforming.*constant/i], ['number defective chart']),
    f('c-chart', ['ppc'], 'c-chart limits',
      'Center = c̄;  UCL/LCL = c̄ ± 3√c̄',
      'Use for the count of defects when the inspection opportunity or area is constant.',
      'c̄ = average defect count per inspection unit.',
      'Use a u chart when opportunity, area, or sample size varies. A calculated negative LCL is reported as 0.',
      [/\bc chart\b|count of defects|defects per unit.*constant|constant area/i], ['defect count chart']),
    f('u-chart', ['ppc'], 'u-chart limits',
      'Center = ū;  UCL/LCL = ū ± 3√(ū/nᵢ)',
      'Use for defects per unit when the number of units or inspection opportunity varies.',
      'ū = overall defects per unit; nᵢ = units or opportunity in subgroup i.',
      'The limits change with subgroup size. A calculated negative LCL is reported as 0.',
      [/\bu chart\b|defects per unit|varying.*opportun|varying sample size.*defect/i], ['defects-per-unit chart']),
    f('cp', ['ppc', 'quant', 'ci'], 'Potential process capability, Cp',
      'Cp = (USL − LSL) / (6σwithin)',
      'Use to compare the natural within-process spread with two-sided specification width, ignoring centering.',
      'USL/LSL = specification limits; σwithin = short-term within-process standard deviation.',
      'Cp does not show whether the process mean is centered.',
      [/\bCp\b|potential capability|specification width.*6|capability.*spread|six sigma.*Cp|Cp.*six sigma/i], ['process capability']),
    f('cpk', ['ppc', 'quant'], 'Actual process capability, Cpk',
      'Cpk = min[(USL − μ)/(3σwithin), (μ − LSL)/(3σwithin)]',
      'Use for two-sided capability when both spread and process centering matter.',
      'μ = process mean; σwithin = within-process standard deviation.',
      'Use the smaller one-sided index because the nearest specification limit governs.',
      [/\bCpk\b|actual capability|off[- ]?center|capability.*center|nearest specification|capability.*mean/i], ['process capability index']),
    f('pp-ppk', ['ppc', 'quant'], 'Process performance, Pp and Ppk',
      'Pp = (USL − LSL)/(6soverall);  Ppk = min[(USL − x̄)/(3soverall), (x̄ − LSL)/(3soverall)]',
      'Use for long-term performance indices based on overall standard deviation.',
      'soverall includes within- and between-subgroup variation.',
      'Do not compare Ppk with Cpk without understanding the different standard-deviation estimates.',
      [/\bPp\b|\bPpk\b|overall standard deviation|long[- ]term performance/i], ['performance capability']),
    f('gage-resolution', ['ppc'], 'Measurement resolution — 10:1 rule',
      'Recommended gage resolution ≤ Tolerance / 10',
      'Use when checking whether an instrument has adequate discrimination under the rule of tens.',
      'Tolerance = USL − LSL or the stated total tolerance width.',
      'The 10:1 rule is a guideline; the measurement-system study and application requirements still govern.',
      [/10:1|rule of tens|gage.*resolution|gauge.*resolution|caliper.*resolution|resolution.*tolerance/i], ['measurement discrimination', 'rule of ten']),
    f('percent-grr', ['ppc'], 'Gauge R&R percent study variation',
      '%GRR = GRR variation / Total study variation × 100',
      'Use to express measurement-system variation as a percentage of total study variation.',
      'Use the variation metric specified by the method, often 6σ study variation.',
      'Do not confuse %study variation with %tolerance or %contribution.',
      [/gauge R&R|gage R&R|%GRR|measurement system variation|repeatability.*reproducibility/i], ['measurement system analysis']),
    f('ndc', ['ppc'], 'Number of distinct categories',
      'ndc = 1.41 × Part variation / GRR variation',
      'Use in variable Gauge R&R to estimate how many distinct process categories the measurement system can resolve.',
      'Use consistent variation estimates for part variation and GRR.',
      'Round down to a whole-number category count unless the question specifies otherwise.',
      [/distinct categor|\bndc\b|1\.41.*GRR/i], ['number of distinct categories']),
    f('acceptance-binomial', ['ppc', 'quant'], 'Single-sampling probability of acceptance',
      'Pₐ = Σ(x = 0 to c) C(n,x)pˣ(1 − p)ⁿ⁻ˣ',
      'Use for a single attributes sampling plan that accepts the lot when the sample contains at most c nonconforming units.',
      'n = sample size; c = acceptance number; p = incoming fraction nonconforming.',
      'Use the cumulative binomial probability, not only P(X = c).',
      [/sampling plan.*n\s*=.*c\s*=|probability of accept(?:ing|ance).*lot|acceptance probability|acceptance number/i], ['Pa', 'OC curve']),
    f('double-sampling-first-decision', ['ppc'], 'Double-sampling first-sample decision probability',
      'P(decide on sample 1) = P(X₁ ≤ c₁) + P(X₁ ≥ r₁)',
      'Use when a double-sampling plan asks for the probability of accepting or rejecting on the first sample.',
      'c₁ = first-sample acceptance number; r₁ = first-sample rejection number.',
      'The continuation region c₁ < X₁ < r₁ is excluded from the first-sample decision probability.',
      [/double sampling|decision.*first sample|first sample.*accept|n1.*c1.*r1/i], ['double sampling plan']),
    f('aoq', ['ppc'], 'Average outgoing quality',
      'AOQ = pPₐ(N − n) / N',
      'Use for rectifying acceptance sampling, where rejected lots are 100% screened and defectives are replaced.',
      'p = incoming fraction nonconforming; Pₐ = probability of acceptance; N = lot size; n = sample size.',
      'AOQ assumes rejected lots are rectified.',
      [/average outgoing quality|\bAOQ\b|rectifying inspection/i], ['AOQL']),
    f('ati', ['ppc'], 'Average total inspection',
      'ATI = nPₐ + N(1 − Pₐ) = n + (1 − Pₐ)(N − n)',
      'Use for rectifying sampling plans to estimate the average number inspected per lot.',
      'Pₐ = probability of acceptance; N = lot size; n = sample size.',
      'For accepted lots only the sample is inspected; rejected lots receive full inspection.',
      [/average total inspection|\bATI\b|average number inspected/i], ['rectifying sampling']),

    f('dpu', ['ci', 'quant'], 'Defects per unit',
      'DPU = Total defects / Total units',
      'Use when a unit may contain multiple defects and the average number of defects per unit is required.',
      'Defects and units must refer to the same inspection population.',
      'DPU can exceed 1; fraction nonconforming cannot.',
      [/defects per unit|\bDPU\b|average defects.*unit/i], ['defects per unit']),
    f('dpo', ['ci', 'quant'], 'Defects per opportunity',
      'DPO = Defects / (Units × Opportunities per unit)',
      'Use before converting to DPMO or when the per-opportunity defect rate is requested.',
      'Define opportunities consistently and defensibly.',
      'Do not inflate opportunity counts merely to improve the metric.',
      [/defects per opportunity|\bDPO\b/i], ['defect opportunity rate']),
    f('fty', ['ci'], 'First-time yield',
      'FTY = Units passing the step without rework / Units entering the step',
      'Use for the probability of passing a process step correctly the first time.',
      'Count reworked units as first-pass failures even if they later conform.',
      'Final yield can hide rework; first-time yield does not.',
      [/first[- ]time yield|first[- ]pass yield|without rework/i], ['FTY', 'FPY']),
    f('rty', ['ci'], 'Rolled throughput yield',
      'RTY = Π(FTYᵢ)',
      'Use for the probability that a unit passes every step in a multi-step process without rework.',
      'FTYᵢ = first-time yield at process step i.',
      'Do not average step yields; multiply them.',
      [/rolled throughput yield|\bRTY\b|multiple steps.*yield|product of.*yield/i], ['rolled yield']),
    f('takt', ['ci'], 'Takt time',
      'Takt time = Available production time / Customer demand',
      'Use to determine the required production rhythm needed to meet demand.',
      'Subtract planned unavailable time when the question defines net available time.',
      'Takt time is a demand rate, not the observed cycle time.',
      [/takt|customer demand.*available time|available production time/i], ['takt time']),
    f('oee', ['ci', 'ppc'], 'Overall equipment effectiveness',
      'OEE = Availability × Performance × Quality',
      'Use when the three OEE factors are supplied or can be calculated, including when a question asks only for the availability component (Loading Time − Downtime) / Loading Time.',
      'Express all three factors as decimals before multiplying unless using percentages consistently.',
      'OEE is multiplicative, not the arithmetic average of its factors.',
      [/overall equipment effectiveness|\bOEE\b|availability.*performance.*quality|loading time|availability/i], ['equipment effectiveness']),
    f('littles-law', ['ci'], "Little's law",
      'WIP = Throughput × Cycle time',
      'Use for a stable process when any two of work-in-process, throughput, and average cycle time are known.',
      'Use consistent time units.',
      'The relationship assumes a stable long-run system.',
      [/Little.?s law|work[- ]in[- ]process|\bWIP\b.*throughput|throughput.*cycle time/i], ['flow time']),
    f('percent-change', ['ci', 'mgmt'], 'Percent change or improvement',
      '% change = (New − Old) / Old × 100',
      'Use when comparing a new result with a baseline.',
      'For percent reduction, use (Old − New)/Old × 100.',
      'Always identify the baseline denominator.',
      [/percent improvement|percent reduction|percent change|improved from.*to/i], ['relative change']),

    f('mean', ['quant'], 'Arithmetic mean',
      'x̄ = Σxᵢ / n',
      'Use for the average of equally weighted numerical observations.',
      'n = number of observations.',
      'The mean is sensitive to extreme values.',
      [/arithmetic mean|calculate.*mean|average of|sample mean|mean and median|what are the mean/i], ['average']),
    f('median', ['quant'], 'Median',
      'Median = middle ordered value (odd n); average of the two middle ordered values (even n)',
      'Use for the 50th percentile or the center of ordered observations.',
      'Order the observations before locating the middle position.',
      'Do not average all observations; that produces the arithmetic mean.',
      [/\bmedian\b|50th percentile|middle ordered value/i], ['sample median']),
    f('weighted-mean', ['quant'], 'Weighted mean',
      'x̄w = Σ(wᵢxᵢ) / Σwᵢ',
      'Use when observations contribute unequally because of frequency, sample size, or assigned weight.',
      'wᵢ = weight for observation xᵢ.',
      'Do not divide by the number of categories unless all weights are equal.',
      [/weighted mean|weighted average|combined mean|different sample sizes/i], ['pooled average']),
    f('population-variance', ['quant'], 'Population variance',
      'σ² = Σ(xᵢ − μ)² / N',
      'Use when the complete population is observed or the question explicitly asks for population variance.',
      'μ = population mean; N = population size.',
      'Sample variance uses n − 1 in the denominator instead of N.',
      [/population variance|formula.*variance|variance.*population/i], ['sigma squared']),
    f('sample-variance', ['quant'], 'Sample variance',
      's² = Σ(xᵢ − x̄)² / (n − 1)',
      'Use to estimate population variance from a sample.',
      'n − 1 is the sample degrees-of-freedom correction.',
      'Population variance uses N in the denominator when the complete population is observed.',
      [/sample variance|calculate.*variance|degrees of freedom.*variance/i], ['variance']),
    f('sample-sd', ['quant'], 'Sample standard deviation',
      's = √[Σ(xᵢ − x̄)² / (n − 1)]',
      'Use for sample spread in the original measurement units.',
      's is the square root of sample variance.',
      'Do not add standard deviations directly unless a valid covariance relationship supports it.',
      [/sample standard deviation|standard deviation|calculate.*\bs\b/i], ['SD', 'sigma estimate']),
    f('coefficient-variation', ['quant'], 'Coefficient of variation',
      'CV (%) = s / x̄ × 100',
      'Use to compare relative variation between positive-scale datasets with different units or means.',
      's = standard deviation; x̄ = mean.',
      'CV is unstable or misleading when the mean is near zero.',
      [/coefficient of variation|\bCV\b|relative variability/i], ['relative standard deviation']),
    f('standard-error', ['quant'], 'Standard error of the mean',
      'SE(x̄) = s / √n',
      'Use for the sampling variability of a sample mean.',
      's = sample standard deviation; n = sample size.',
      'Standard error describes precision of the mean, not spread among individual observations.',
      [/standard error|sampling error.*mean|s\/sqrt|precision of.*mean/i], ['SEM']),
    f('z-score', ['quant'], 'Standard score',
      'z = (x − μ) / σ',
      'Use to express how many population standard deviations an observation lies from the mean.',
      'x = observation; μ = population mean; σ = population standard deviation.',
      'Use the appropriate sign; observations below the mean have negative z-scores.',
      [/z[- ]score|standard score|standard deviations.*from.*mean|normal probability/i], ['z value']),
    f('normal-quantile', ['quant'], 'Normal-distribution percentile or quantile',
      'xₚ = μ + zₚσ',
      'Use to convert a normal-distribution percentile or upper/lower tail probability to an observation value.',
      'zₚ = standard-normal quantile for cumulative probability p.',
      'For an upper-tail probability, first convert it to the corresponding cumulative probability.',
      [/~\s*N\s*\(|normal distribution.*exceed|only \d+%.*exceed|percentile.*normal|normal.*quantile/i], ['normal percentile']),
    f('normal-central-probability', ['quant'], 'Normal probability within k standard deviations',
      'P(μ − kσ ≤ X ≤ μ + kσ) = 2Φ(k) − 1',
      'Use for the proportion of a normal distribution lying symmetrically within ±kσ of the mean.',
      'Φ(k) = standard-normal cumulative probability at k.',
      'The 68–95–99.7 rule is exact only at the common approximations k = 1, 2, and 3.',
      [/within\s*±?\s*\d+(?:\.\d+)?σ|proportion.*within.*standard deviation|normal process.*within/i], ['normal central area', 'empirical rule']),
    f('one-sample-z', ['quant'], 'One-sample z statistic for a mean',
      'z = (x̄ − μ₀) / (σ/√n)',
      'Use for a hypothesis test or confidence interval for a mean when population σ is known or the stated large-sample approximation applies.',
      'μ₀ = null mean; σ = known population standard deviation.',
      'Use a t statistic when σ is unknown and estimated by s.',
      [/one[- ]sample z|population standard deviation.*known|z test.*mean/i], ['z test']),
    f('one-sample-t', ['quant'], 'One-sample t statistic',
      't = (x̄ − μ₀) / (s/√n)',
      'Use to test a population mean when σ is unknown and sample standard deviation s is used.',
      'Degrees of freedom = n − 1.',
      'Check the normality or large-sample conditions stated in the problem.',
      [/one[- ]sample t|t statistic|t test.*mean|unknown population standard deviation/i], ['t test']),
    f('ci-mean', ['quant'], 'Confidence interval for a mean',
      'x̄ ± critical value × standard error',
      'Use to estimate a population mean; use z* with known σ and t* with estimated s.',
      'Margin of error = critical value × standard error.',
      'Match the critical value and degrees of freedom to the stated confidence level.',
      [/confidence interval.*mean|margin of error.*mean|estimate.*population mean/i], ['mean confidence interval']),
    f('ci-variance', ['quant'], 'Confidence interval for a population variance',
      '[(n − 1)s² / χ²(1 − α/2, ν), (n − 1)s² / χ²(α/2, ν)],  ν = n − 1',
      'Use for a confidence interval on population variance when the population is normally distributed.',
      'χ²(q,ν) = chi-square quantile with cumulative probability q and ν degrees of freedom.',
      'The chi-square quantiles reverse between the lower and upper endpoints because they are in the denominator.',
      [/confidence interval.*variance|interval.*population variance|voltage.*variance/i], ['variance interval', 'chi-square variance interval']),
    f('ci-proportion', ['quant'], 'Confidence interval for a proportion',
      'p̂ ± z*√[p̂(1 − p̂)/n]',
      'Use for a large-sample confidence interval for a binomial proportion.',
      'p̂ = sample proportion; n = sample size.',
      'Verify that success-failure counts are adequate for the normal approximation.',
      [/confidence interval.*proportion|margin of error.*proportion|sample proportion/i], ['proportion interval']),
    f('sample-size-mean', ['quant'], 'Sample size for estimating a mean',
      'n = (z*σ / E)²',
      'Use when a target margin of error E is specified for estimating a mean.',
      'σ = planning estimate of standard deviation; z* = confidence critical value.',
      'Round the calculated sample size up.',
      [/sample size.*mean|margin of error.*standard deviation|how many.*measurements|estimate.*average.*within|true average.*confidence.*σ/i], ['sample size']),
    f('sample-size-proportion', ['quant'], 'Sample size for estimating a proportion',
      'n = z*²p(1 − p) / E²',
      'Use for a target margin of error E when estimating a proportion.',
      'Use p = 0.5 when no planning estimate is available and a conservative maximum sample size is desired.',
      'Round up and apply finite-population correction only when the problem calls for it.',
      [/sample size.*proportion|margin of error.*percent|how many.*proportion/i], ['proportion sample size']),
    f('correlation', ['quant'], 'Pearson correlation coefficient',
      'r = Σ[(xᵢ − x̄)(yᵢ − ȳ)] / √[Σ(xᵢ − x̄)² Σ(yᵢ − ȳ)²]',
      'Use for the strength and direction of a linear relationship between two quantitative variables.',
      '−1 ≤ r ≤ 1.',
      'Correlation does not establish causation and may be distorted by outliers or nonlinearity.',
      [/Pearson|correlation coefficient|linear relationship|\br\b.*correlation/i], ['Pearson r']),
    f('simple-regression', ['quant'], 'Simple linear regression prediction',
      'ŷ = b₀ + b₁x',
      'Use to predict the mean response from one quantitative predictor in a fitted linear model.',
      'b₀ = intercept; b₁ = slope.',
      'Avoid extrapolating far outside the observed predictor range.',
      [/regression equation|predict.*from|slope.*intercept|y[- ]hat/i], ['linear model']),
    f('r-squared', ['quant'], 'Coefficient of determination',
      'R² = SSR / SST = 1 − SSE / SST',
      'Use for the fraction of response variation explained by a regression model.',
      'SSR = regression sum of squares; SSE = error sum of squares; SST = total sum of squares.',
      'A high R² does not by itself prove model adequacy or causation.',
      [/R[- ]?squared|coefficient of determination|variation explained/i], ['R2']),
    f('chi-square', ['quant'], 'Chi-square statistic',
      'χ² = Σ[(Oᵢ − Eᵢ)² / Eᵢ]',
      'Use for goodness-of-fit or independence tests with frequency counts.',
      'Oᵢ = observed count; Eᵢ = expected count.',
      'Expected counts, not percentages, belong in the denominator.',
      [/chi[- ]square|goodness of fit|test of independence|observed.*expected/i], ['χ²']),
    f('f-statistic', ['quant'], 'F statistic',
      'F = MSbetween / MSwithin',
      'Use in ANOVA to compare explained between-group variation with unexplained within-group variation.',
      'MS = sum of squares divided by its degrees of freedom.',
      'For a conventional upper-tail ANOVA test, large F values provide evidence against equal means.',
      [/\bANOVA\b|F statistic|between[- ]group.*within[- ]group|mean square/i], ['analysis of variance']),
    f('probability-complement', ['quant', 'risk'], 'Complement rule',
      'P(Aᶜ) = 1 − P(A)',
      'Use when the required outcome is the event not occurring.',
      'Aᶜ = complement of event A.',
      'Confirm that A and Aᶜ are exhaustive and mutually exclusive.',
      [/not defective|probability.*not occur|complement probability|escapes?.*station/i], ['complement']),
    f('probability-independent-intersection', ['quant', 'risk'], 'Intersection of independent events',
      'P(A ∩ B) = P(A)P(B)',
      'Use when both independent events must occur.',
      'For more than two independent events, multiply all event probabilities.',
      'Do not multiply marginal probabilities when events are dependent.',
      [/independent.*both|both.*independent|stations?.*each.*probability|both events.*occur/i], ['multiplication rule']),
    f('probability-mutually-exclusive-intersection', ['quant'], 'Intersection of mutually exclusive events',
      'If A and B are mutually exclusive, P(A ∩ B) = 0',
      'Use when the question asks for both mutually exclusive events to occur.',
      'Mutually exclusive events cannot occur together.',
      'For the probability of either event, use P(A ∪ B) = P(A) + P(B).',
      [/mutually exclusive.*both|both.*mutually exclusive|A and B both occur.*mutually exclusive/i], ['disjoint events']),
    f('binomial', ['quant'], 'Binomial probability',
      'P(X = x) = C(n,x)pˣ(1 − p)ⁿ⁻ˣ',
      'Use for x successes in n independent trials with constant success probability p.',
      'C(n,x) = n!/[x!(n − x)!].',
      'The binomial model counts successes across a fixed number of trials.',
      [/binomial|exactly.*success|fixed number.*trials|success probability/i], ['Bernoulli trials']),
    f('poisson', ['quant', 'ppc'], 'Poisson probability',
      'P(X = x) = e⁻λ · λˣ / x!',
      'Use for event or defect counts in a fixed exposure when events occur independently at average rate λ.',
      'λ = expected count in the stated exposure.',
      'Scale λ when the exposure interval changes.',
      [/Poisson|average rate|events per|defects.*interval|count.*fixed interval/i], ['count distribution']),
    f('exponential', ['quant', 'risk', 'design'], 'Exponential reliability and failure time',
      'R(t) = e⁻λᵗ;  F(t) = 1 − e⁻λᵗ;  MTBF = 1/λ',
      'Use for time to failure under a constant hazard rate.',
      'λ = constant failure rate; t = mission time.',
      'The exponential model is memoryless and is inappropriate when hazard changes strongly with age.',
      [/exponential distribution|reliability.*(?:is|has).*exponential|exponential.*reliability|constant failure rate|constant hazard|memoryless|mission reliability/i], ['exponential life']),
    f('bayes', ['quant', 'risk'], "Bayes' theorem",
      'P(A|B) = P(B|A)P(A) / P(B)',
      'Use to update a prior probability after observing evidence.',
      'P(B) may require the law of total probability.',
      'Do not reverse conditional probabilities: P(A|B) is generally not P(B|A).',
      [/Bayes|posterior probability|given.*positive|conditional probability.*prior/i], ['posterior']),
    f('doe-effect', ['quant', 'design', 'ci'], 'Two-level factorial main effect',
      'Effect of A = Mean response at A+ − Mean response at A−',
      'Use for a two-level factorial design main effect.',
      'Interaction effects compare the effect of one factor across levels of another.',
      'Factor coding and sign conventions must match the design table.',
      [/factorial design|main effect|two[- ]level|interaction effect|DOE/i], ['design of experiments']),

    f('rpn', ['risk', 'design', 'ci'], 'FMEA risk priority number',
      'RPN = Severity × Occurrence × Detection',
      'Use when an FMEA question supplies the three traditional ratings.',
      'S = severity; O = occurrence; D = detection rating.',
      'RPN alone should not hide a very high severity; follow the prioritization rule stated in the question.',
      [/risk priority number|\bRPN\b|severity.*occurrence.*detection|FMEA/i], ['FMEA']),
    f('emv', ['risk', 'mgmt'], 'Expected monetary value',
      'EMV = Σ[pᵢ × monetary outcomeᵢ]',
      'Use for a decision or risk event with stated probabilities and monetary consequences.',
      'Include losses with the sign convention used by the question.',
      'Probabilities for mutually exclusive exhaustive outcomes should sum to 1.',
      [/expected monetary value|\bEMV\b|probability.*monetary|decision tree.*payoff/i], ['expected value']),
    f('risk-score', ['risk'], 'Basic risk score',
      'Risk score = Probability × Impact',
      'Use when a risk matrix or ranking method explicitly defines risk as likelihood times consequence.',
      'Use the rating scales specified in the problem.',
      'Ordinal risk-matrix scores are rankings, not precise physical quantities.',
      [/risk score|probability.*impact|likelihood.*consequence/i], ['risk matrix']),
    f('failure-rate', ['risk', 'design'], 'Failure rate estimate',
      'λ = Number of failures / Total exposure time',
      'Use to estimate a constant failure rate from aggregate exposure.',
      'Exposure may be component-hours, cycles, kilometres, or another defined unit.',
      'This estimate assumes comparable exposure and a roughly constant hazard over the period.',
      [/failure rate|failures per.*hour|total exposure|component[- ]hours/i], ['hazard rate']),
    f('fta-and', ['risk'], 'Fault-tree AND gate',
      'P(AND) = ΠPᵢ  (for independent basic events)',
      'Use when every input event must occur to produce the higher-level event.',
      'Pᵢ = probability of each independent input event.',
      'Do not multiply directly when input events are dependent.',
      [/fault tree.*AND|AND gate|all events.*occur/i], ['FTA AND']),
    f('fta-or', ['risk'], 'Fault-tree OR gate',
      'P(OR) = 1 − Π(1 − Pᵢ)  (independent events)',
      'Use when any one of the input events can produce the higher-level event.',
      'For two events, P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
      'Simple addition is valid only for mutually exclusive events or as a rare-event approximation.',
      [/fault tree.*OR|OR gate|any event.*occur|union probability/i], ['FTA OR'])
  ];

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalize(value) {
    return String(value == null ? '' : value)
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function formulaSearchText(item, questionLabel) {
    return normalize([
      item.name,
      item.formula,
      item.when,
      item.variables,
      item.caution,
      item.aliases.join(' '),
      questionLabel || ''
    ].join(' '));
  }

  function questionText(question) {
    if (!question) return '';
    return [question.stem || '', question.why || ''].join(' ');
  }

  function matchesFormula(item, question) {
    if (!question || item.sections.indexOf(question.sub) < 0) return false;
    var text = questionText(question);
    return item.patterns.some(function (pattern) { return pattern.test(text); });
  }

  function formulasForQuestion(question) {
    return FORMULAS.filter(function (item) { return matchesFormula(item, question); });
  }

  function activeExamId() {
    var active = document.querySelector('.tb-tile.active[data-exam]');
    if (active && active.getAttribute('data-exam')) return active.getAttribute('data-exam');
    var title = document.getElementById('tb-herotitle');
    var text = normalize(title && title.textContent);
    if (text.indexOf('quality engineer') >= 0) return 'cqe';
    return '';
  }

  function currentQuestionNumber() {
    var progress = document.querySelector('.tb-quizprog');
    var match = progress && progress.textContent.match(/Question\s+(\d+)\s+of\s+(\d+)/i);
    return match ? { current: Number(match[1]), total: Number(match[2]) } : { current: null, total: null };
  }

  function findQuestionInBanks(stem) {
    var tb = window.__TB;
    var exam = tb && tb.EXAMS && tb.EXAMS.cqe;
    var sets = exam && exam.sets;
    var target = normalize(stem);
    if (!sets || !target) return null;
    var setKeys = Object.keys(sets);
    for (var s = 0; s < setKeys.length; s += 1) {
      var setKey = setKeys[s];
      var bank = sets[setKey] || [];
      for (var i = 0; i < bank.length; i += 1) {
        if (normalize(bank[i].stem) === target) {
          return { set: String(setKey), bank: bank, bankIndex: i, question: bank[i] };
        }
      }
    }
    return null;
  }

  function inferSectionFromTag() {
    var tag = normalize(document.querySelector('.tb-qtag') && document.querySelector('.tb-qtag').textContent);
    var found = SECTION_ORDER.find(function (id) {
      return tag.indexOf(normalize(SECTION_META[id].name.replace(/^[IVX]+\.\s*/, ''))) >= 0;
    });
    return found || 'quant';
  }

  function getContext() {
    var stemNode = document.querySelector('.tb-stem');
    var stem = stemNode ? stemNode.textContent.trim() : '';
    var located = findQuestionInBanks(stem);
    var progress = currentQuestionNumber();
    return {
      examId: activeExamId(),
      stem: stem,
      sessionQuestion: progress.current,
      sessionTotal: progress.total,
      set: located ? located.set : null,
      bank: located ? located.bank : null,
      bankIndex: located ? located.bankIndex : null,
      question: located ? located.question : (stem ? { stem: stem, options: [], sub: inferSectionFromTag() } : null),
      sectionId: located ? located.question.sub : inferSectionFromTag()
    };
  }

  function usedByQuestions(item, context) {
    if (!context.bank) return [];
    var numbers = [];
    context.bank.forEach(function (question, index) {
      if (question.sub === context.sectionId && matchesFormula(item, question)) numbers.push(index + 1);
    });
    return numbers;
  }

  function compactQuestionList(numbers) {
    if (!numbers.length) return '';
    var shown = numbers.slice(0, 12).map(function (number) { return 'Q' + number; });
    if (numbers.length > shown.length) shown.push('+' + (numbers.length - shown.length) + ' more');
    return shown.join(', ');
  }

  function questionSearchLabel(numbers) {
    return numbers.map(function (number) { return 'Q' + number + ' Question ' + number; }).join(' ');
  }

  function formulaCard(item, options) {
    var used = options.used || [];
    var current = options.current;
    var mapping = '';
    if (current) {
      mapping = '<div class="tb-fqmap current"><strong>Use for:</strong> Question ' + esc(options.sessionQuestion || '') + ' currently open</div>';
    } else if (used.length) {
      mapping = '<div class="tb-fqmap"><strong>Used by Exam Set ' + esc(options.set || '') + ':</strong> ' + esc(compactQuestionList(used)) + '</div>';
    } else {
      mapping = '<div class="tb-fqmap muted"><strong>Use for:</strong> questions matching the condition described below.</div>';
    }
    return '<article class="tb-refitem tb-fcard' + (current ? ' is-current' : '') + '" data-formula-id="' + esc(item.id) + '">' +
      '<div class="tb-fhead"><div class="tb-refn">' + esc(item.name) + '</div>' + (current ? '<span class="tb-fbadge">Current question</span>' : '') + '</div>' +
      '<div class="tb-reff">' + esc(item.formula) + '</div>' +
      mapping +
      '<div class="tb-refnote2"><strong>Use when:</strong> ' + esc(item.when) + '</div>' +
      (item.variables ? '<div class="tb-refnote2"><strong>Variables / basis:</strong> ' + esc(item.variables) + '</div>' : '') +
      (item.caution ? '<div class="tb-fcaution"><strong>Watch for:</strong> ' + esc(item.caution) + '</div>' : '') +
      '</article>';
  }

  function conceptualCard(context) {
    return '<div class="tb-fconcept"><strong>Question ' + esc(context.sessionQuestion || '') + ' is conceptual.</strong>' +
      '<span>No mathematical formula is required for this question. Use the section reference below to review related calculations without revealing the answer.</span></div>';
  }

  function renderContextualPane(query) {
    var host = document.getElementById('tb-reflist');
    var drawer = document.getElementById('tb-formulas');
    if (!host || !drawer || drawer.hidden) return;
    if (activeExamId() !== 'cqe') return;

    var context = getContext();
    var sectionId = SECTION_META[context.sectionId] ? context.sectionId : 'quant';
    var sectionName = SECTION_META[sectionId].name;
    var currentFormulas = formulasForQuestion(context.question);
    var sectionFormulas = FORMULAS.filter(function (item) { return item.sections.indexOf(sectionId) >= 0; });
    var currentIds = {};
    currentFormulas.forEach(function (item) { currentIds[item.id] = true; });

    var q = normalize(query == null ? (document.getElementById('tb-refsearch') || {}).value : query);
    function include(item, used) {
      if (!q) return true;
      var label = used.length ? questionSearchLabel(used) : '';
      return formulaSearchText(item, label).indexOf(q) >= 0;
    }

    var html = '<div class="tb-fcontextbar"><span>' + esc(sectionName) + '</span>' +
      (context.set ? '<span>Exam Set ' + esc(context.set) + '</span>' : '') +
      (context.bankIndex != null ? '<span>Bank Q' + esc(context.bankIndex + 1) + '</span>' : '') + '</div>';

    if (!q) {
      html += '<section class="tb-refgroup tb-currentgroup"><h4>Recommended for the current question</h4>';
      if (currentFormulas.length) {
        html += currentFormulas.map(function (item) {
          return formulaCard(item, {
            current: true,
            sessionQuestion: context.sessionQuestion,
            set: context.set,
            used: usedByQuestions(item, context)
          });
        }).join('');
      } else {
        html += conceptualCard(context);
      }
      html += '</section>';
    }

    var sectionCards = sectionFormulas.map(function (item) {
      if (!q && currentIds[item.id]) return '';
      var used = usedByQuestions(item, context);
      if (!include(item, used)) return '';
      return formulaCard(item, {
        current: false,
        sessionQuestion: context.sessionQuestion,
        set: context.set,
        used: used
      });
    }).join('');

    if (sectionCards) {
      html += '<section class="tb-refgroup"><h4>' + (q ? 'Matching formulas in ' : (currentFormulas.length ? 'Other formulas for ' : 'All formulas for ')) + esc(sectionName) + '</h4>' + sectionCards + '</section>';
    } else if (q) {
      html += '<p class="tb-refempty">No formula matches “' + esc(query || '') + '” in ' + esc(sectionName) + '.</p>';
    } else {
      html += '<p class="tb-refempty">No additional formulas are required for this section.</p>';
    }

    host.innerHTML = html;
  }

  function installFallbackRefs() {
    var tb = window.__TB;
    if (!tb || !tb.REFS) return false;
    tb.REFS.cqe = SECTION_ORDER.map(function (sectionId) {
      return {
        group: SECTION_META[sectionId].name,
        items: FORMULAS.filter(function (item) { return item.sections.indexOf(sectionId) >= 0; }).map(function (item) {
          return {
            n: item.name,
            f: item.formula,
            note: item.when + (item.caution ? ' Watch for: ' + item.caution : '')
          };
        })
      };
    });
    return true;
  }

  function ensureStyles() {
    if (document.getElementById('tb-context-formula-styles')) return;
    var style = document.createElement('style');
    style.id = 'tb-context-formula-styles';
    style.textContent = [
      '.tb-fcontextbar{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 13px}',
      '.tb-fcontextbar span{display:inline-flex;padding:4px 8px;border:1px solid var(--line);border-radius:999px;background:var(--tint);color:var(--muted);font-size:10.5px;font-weight:700}',
      '.tb-currentgroup{padding:12px;border:1px solid color-mix(in srgb,var(--teal) 55%,var(--line));border-radius:10px;background:color-mix(in srgb,var(--teal) 7%,var(--paper));margin-bottom:18px}',
      '.tb-fcard{padding:12px}',
      '.tb-fcard.is-current{border-color:var(--teal);box-shadow:0 0 0 2px color-mix(in srgb,var(--teal) 14%,transparent)}',
      '.tb-fhead{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}',
      '.tb-fbadge{flex:none;border-radius:999px;padding:3px 7px;background:var(--teal);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}',
      '.tb-fqmap{margin:8px 0 0;padding:7px 8px;border-radius:7px;background:var(--tint);color:var(--muted);font-size:11.5px;line-height:1.4}',
      '.tb-fqmap.current{background:color-mix(in srgb,var(--teal) 12%,var(--card));color:var(--ink)}',
      '.tb-fqmap.muted{font-style:italic}',
      '.tb-fcaution{margin-top:7px;padding:7px 8px;border-left:3px solid var(--amber,#b8791b);background:color-mix(in srgb,var(--amber,#b8791b) 8%,var(--card));color:var(--muted);font-size:11.5px;line-height:1.45}',
      '.tb-fconcept{display:grid;gap:5px;padding:12px;border:1px solid var(--line);border-radius:9px;background:var(--card);color:var(--ink);font-size:12.5px;line-height:1.5}',
      '.tb-fconcept span{color:var(--muted)}',
      '.tb-refnote2 strong,.tb-fcaution strong,.tb-fqmap strong{color:var(--ink)}',
      '@media(max-width:520px){.tb-currentgroup{padding:9px}.tb-fhead{display:block}.tb-fbadge{display:inline-flex;margin:4px 0 2px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function scheduleRender() {
    window.setTimeout(function () {
      var search = document.getElementById('tb-refsearch');
      renderContextualPane(search ? search.value : '');
    }, 0);
  }

  function wireEvents() {
    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target.closest('[data-formulas]') : null;
      if (target) scheduleRender();
    }, true);

    document.addEventListener('input', function (event) {
      if (event.target && event.target.id === 'tb-refsearch') scheduleRender();
    }, true);

    var overview = document.getElementById('tb-overview');
    if (overview && typeof MutationObserver !== 'undefined') {
      new MutationObserver(function () {
        var drawer = document.getElementById('tb-formulas');
        if (drawer && !drawer.hidden) scheduleRender();
      }).observe(overview, { childList: true, subtree: true });
    }
  }

  var initialized = false;
  function initialize(attempt) {
    attempt = attempt || 0;
    if (initialized) return;
    if (!window.__TB) {
      if (attempt < 400) window.setTimeout(function () { initialize(attempt + 1); }, 25);
      return;
    }
    initialized = true;
    ensureStyles();
    installFallbackRefs();
    wireEvents();
  }

  window.__TB_FORMULAS_TEST__ = {
    version: VERSION,
    formulas: FORMULAS,
    sections: SECTION_META,
    matchesFormula: matchesFormula,
    formulasForQuestion: formulasForQuestion,
    compactQuestionList: compactQuestionList,
    renderContextualPane: renderContextualPane,
    getContext: getContext,
    installFallbackRefs: installFallbackRefs
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initialize(0); }, { once: true });
  } else {
    initialize(0);
  }
}());
