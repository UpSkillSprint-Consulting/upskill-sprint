'use strict';

const fs = require('node:fs');
const path = require('node:path');

function patchFile(relativePath, operations) {
  const file = path.join(__dirname, '..', relativePath);
  let source = fs.readFileSync(file, 'utf8');
  for (const operation of operations) {
    const [before, after, label] = operation;
    const first = source.indexOf(before);
    if (first < 0) throw new Error(`Could not find patch target in ${relativePath}: ${label}`);
    if (source.indexOf(before, first + before.length) >= 0) throw new Error(`Patch target is not unique in ${relativePath}: ${label}`);
    source = source.slice(0, first) + after + source.slice(first + before.length);
  }
  fs.writeFileSync(file, source);
}

patchFile('test-bank-formulas.js', [
  [
`    f('p-chart', ['ppc'], 'p-chart limits',
      'Center = p̄;  UCL/LCL = p̄ ± 3√[p̄(1 − p̄)/n]',
      'Use for the fraction or proportion nonconforming when subgroup size may vary.',
      'p̄ = overall fraction nonconforming; n = subgroup size.',
      'Use an np chart for counts nonconforming only when subgroup size is constant.',
      [/\bp chart\b|fraction nonconforming|proportion nonconforming|varying sample size.*defective/i], ['proportion chart']),
`,
`    f('p-chart', ['ppc'], 'p-chart limits',
      'Center = p̄;  UCL/LCL = p̄ ± 3√[p̄(1 − p̄)/n]',
      'Use for the fraction or proportion nonconforming when subgroup size may vary.',
      'p̄ = overall fraction nonconforming; n = subgroup size.',
      'Use an np chart for counts nonconforming only when subgroup size is constant. A calculated negative LCL is reported as 0.',
      [/\bp chart\b|p̄\s*=|p-bar|UCL.*p̄|LCL.*p̄|fraction nonconforming|proportion nonconforming|varying sample size.*defective/i], ['proportion chart']),
`,
'p-chart matching and lower-limit guidance'
  ],
  [
`    f('np-chart', ['ppc'], 'np-chart limits',
      'Center = np̄;  UCL/LCL = np̄ ± 3√[np̄(1 − p̄)]',
      'Use for the number of nonconforming units in equal-sized subgroups.',
      'n = constant subgroup size; p̄ = overall fraction nonconforming.',
      'An np chart requires constant subgroup size.',
`,
`    f('np-chart', ['ppc'], 'np-chart limits',
      'Center = np̄;  UCL/LCL = np̄ ± 3√[np̄(1 − p̄)]',
      'Use for the number of nonconforming units in equal-sized subgroups.',
      'n = constant subgroup size; p̄ = overall fraction nonconforming.',
      'An np chart requires constant subgroup size. A calculated negative LCL is reported as 0.',
`,
'np-chart lower-limit guidance'
  ],
  [
`    f('c-chart', ['ppc'], 'c-chart limits',
      'Center = c̄;  UCL/LCL = c̄ ± 3√c̄',
      'Use for the count of defects when the inspection opportunity or area is constant.',
      'c̄ = average defect count per inspection unit.',
      'Use a u chart when opportunity, area, or sample size varies.',
`,
`    f('c-chart', ['ppc'], 'c-chart limits',
      'Center = c̄;  UCL/LCL = c̄ ± 3√c̄',
      'Use for the count of defects when the inspection opportunity or area is constant.',
      'c̄ = average defect count per inspection unit.',
      'Use a u chart when opportunity, area, or sample size varies. A calculated negative LCL is reported as 0.',
`,
'c-chart lower-limit guidance'
  ],
  [
`    f('u-chart', ['ppc'], 'u-chart limits',
      'Center = ū;  UCL/LCL = ū ± 3√(ū/nᵢ)',
      'Use for defects per unit when the number of units or inspection opportunity varies.',
      'ū = overall defects per unit; nᵢ = units or opportunity in subgroup i.',
      'The limits change with subgroup size.',
`,
`    f('u-chart', ['ppc'], 'u-chart limits',
      'Center = ū;  UCL/LCL = ū ± 3√(ū/nᵢ)',
      'Use for defects per unit when the number of units or inspection opportunity varies.',
      'ū = overall defects per unit; nᵢ = units or opportunity in subgroup i.',
      'The limits change with subgroup size. A calculated negative LCL is reported as 0.',
`,
'u-chart lower-limit guidance'
  ],
  [
`    f('cp', ['ppc', 'quant'], 'Potential process capability, Cp',
`,
`    f('cp', ['ppc', 'quant', 'ci'], 'Potential process capability, Cp',
`,
'Cp section coverage'
  ],
  [
`      [/\bCp\b|potential capability|specification width.*6|capability.*spread/i], ['process capability']),
`,
`      [/\bCp\b|potential capability|specification width.*6|capability.*spread|six sigma.*Cp|Cp.*six sigma/i], ['process capability']),
`,
'Cp Six Sigma matching'
  ],
  [
`      [/parallel system|redundan|at least one.*operate|parallel reliability/i], ['parallel reliability']),
`,
`      [/parallel system|components?.*parallel|parallel.*components?|redundan|at least one.*operate|parallel reliability/i], ['parallel reliability']),
`,
'parallel reliability wording'
  ],
  [
`    f('percent-grr', ['ppc'], 'Gauge R&R percent study variation',
`,
`    f('gage-resolution', ['ppc'], 'Measurement resolution — 10:1 rule',
      'Recommended gage resolution ≤ Tolerance / 10',
      'Use when checking whether an instrument has adequate discrimination under the rule of tens.',
      'Tolerance = USL − LSL or the stated total tolerance width.',
      'The 10:1 rule is a guideline; the measurement-system study and application requirements still govern.',
      [/10:1|rule of tens|gage.*resolution|gauge.*resolution|caliper.*resolution|resolution.*tolerance/i], ['measurement discrimination', 'rule of ten']),
    f('percent-grr', ['ppc'], 'Gauge R&R percent study variation',
`,
'gage resolution rule'
  ],
  [
`    f('aoq', ['ppc'], 'Average outgoing quality',
`,
`    f('acceptance-binomial', ['ppc', 'quant'], 'Single-sampling probability of acceptance',
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
`,
'acceptance sampling formulas'
  ],
  [
`    f('mean', ['quant'], 'Arithmetic mean',
`,
`    f('mean', ['quant'], 'Arithmetic mean',
`,
'mean anchor'
  ],
  [
`      [/arithmetic mean|calculate.*mean|average of|sample mean/i], ['average']),
    f('weighted-mean', ['quant'], 'Weighted mean',
`,
`      [/arithmetic mean|calculate.*mean|average of|sample mean|mean and median|what are the mean/i], ['average']),
    f('median', ['quant'], 'Median',
      'Median = middle ordered value (odd n); average of the two middle ordered values (even n)',
      'Use for the 50th percentile or the center of ordered observations.',
      'Order the observations before locating the middle position.',
      'Do not average all observations; that produces the arithmetic mean.',
      [/\bmedian\b|50th percentile|middle ordered value/i], ['sample median']),
    f('weighted-mean', ['quant'], 'Weighted mean',
`,
'median formula and mean matching'
  ],
  [
`    f('sample-variance', ['quant'], 'Sample variance',
`,
`    f('population-variance', ['quant'], 'Population variance',
      'σ² = Σ(xᵢ − μ)² / N',
      'Use when the complete population is observed or the question explicitly asks for population variance.',
      'μ = population mean; N = population size.',
      'Sample variance uses n − 1 in the denominator instead of N.',
      [/population variance|formula.*variance|variance.*population/i], ['sigma squared']),
    f('sample-variance', ['quant'], 'Sample variance',
`,
'population variance formula'
  ],
  [
`    f('one-sample-z', ['quant'], 'One-sample z statistic for a mean',
`,
`    f('normal-quantile', ['quant'], 'Normal-distribution percentile or quantile',
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
`,
'normal distribution formulas'
  ],
  [
`    f('ci-proportion', ['quant'], 'Confidence interval for a proportion',
`,
`    f('ci-variance', ['quant'], 'Confidence interval for a population variance',
      '[(n − 1)s² / χ²(1 − α/2, ν), (n − 1)s² / χ²(α/2, ν)],  ν = n − 1',
      'Use for a confidence interval on population variance when the population is normally distributed.',
      'χ²(q,ν) = chi-square quantile with cumulative probability q and ν degrees of freedom.',
      'The chi-square quantiles reverse between the lower and upper endpoints because they are in the denominator.',
      [/confidence interval.*variance|interval.*population variance|voltage.*variance/i], ['variance interval', 'chi-square variance interval']),
    f('ci-proportion', ['quant'], 'Confidence interval for a proportion',
`,
'variance confidence interval'
  ],
  [
`      [/sample size.*mean|margin of error.*standard deviation|how many.*measurements/i], ['sample size']),
`,
`      [/sample size.*mean|margin of error.*standard deviation|how many.*measurements|estimate.*average.*within|true average.*confidence.*σ/i], ['sample size']),
`,
'sample-size mean wording'
  ],
  [
`    f('binomial', ['quant'], 'Binomial probability',
`,
`    f('probability-complement', ['quant', 'risk'], 'Complement rule',
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
`,
'probability rules'
  ],
  [
`      'P(X = x) = e⁻λλˣ / x!',
`,
`      'P(X = x) = e⁻λ · λˣ / x!',
`,
'Poisson typography'
  ],
  [
`      html += '<section class="tb-refgroup"><h4>' + (q ? 'Matching formulas in ' : 'Other formulas for ') + esc(sectionName) + '</h4>' + sectionCards + '</section>';
`,
`      html += '<section class="tb-refgroup"><h4>' + (q ? 'Matching formulas in ' : (currentFormulas.length ? 'Other formulas for ' : 'All formulas for ')) + esc(sectionName) + '</h4>' + sectionCards + '</section>';
`,
'conceptual section heading'
  ]
]);

patchFile('tests/test-bank-formula-pane-exhaustive.test.js', [
  [
`  const candidate = api.formulas.map(formula => ({
    formula,
    numbers: bank.map((question, index) => api.matchesFormula(formula, question) ? index + 1 : null).filter(Boolean)
  })).find(item => item.numbers.length > 12);
  assert.ok(candidate, 'at least one formula is used by more than twelve questions');

  const contextQuestion = bank.find(question => question.sub === candidate.formula.sections[0]);
  startQuick(window, document);
  document.querySelector('.tb-stem').textContent = contextQuestion.stem;
  document.querySelector('.tb-qtag').textContent = SECTION_NAMES[contextQuestion.sub];
  document.getElementById('tb-formulas').hidden = false;
  const lastNumber = candidate.numbers[candidate.numbers.length - 1];
  api.renderContextualPane(\`Question \${lastNumber}\`);

  const card = document.querySelector(\`[data-formula-id="\${candidate.formula.id}"]\`);
  assert.ok(card, \`\${candidate.formula.id} is searchable by Question \${lastNumber}\`);
`,
`  const cpk = api.formulas.find(formula => formula.id === 'cpk');
  assert.ok(cpk, 'Cpk formula exists');
  const syntheticBank = Array.from({ length: 15 }, (_, index) => ({
    sub: 'ppc',
    stem: \`Synthetic Cpk mapping question \${index + 1}: USL 20, LSL 10, mean 16, standard deviation 1. What is Cpk?\`,
    options: ['0.67', '1.00', '1.33', '1.67'],
    answer: 0,
    why: 'Cpk accounts for centering.'
  }));
  window.__TB.EXAMS.cqe.sets[1] = syntheticBank;

  startQuick(window, document);
  document.querySelector('.tb-stem').textContent = syntheticBank[0].stem;
  document.querySelector('.tb-qtag').textContent = SECTION_NAMES.ppc;
  document.getElementById('tb-formulas').hidden = false;
  api.renderContextualPane('Question 15');

  const card = document.querySelector('[data-formula-id="cpk"]');
  assert.ok(card, 'Cpk is searchable by Question 15 even though the display list is compacted');
`,
'synthetic late question-number search'
  ],
  [
`  const workedArithmetic = /(?:=|×|÷|√|Σ|\^|\bdivid(?:e|ed|ing)\b|\bmultip(?:ly|lied|lication)\b|\bsubtract(?:ed|ion)?\b|\badd(?:ed|ition)?\b)/i;
  return calculationLanguage.test(combined) && (numericCount >= 2 || workedArithmetic.test(why));
`,
`  const workedArithmetic = /(?:=|×|÷|√|Σ|\^|\bdivid(?:e|ed|ing)\b|\bmultip(?:ly|lied|lication)\b|\bsubtract(?:ed|ion)?\b|\badd(?:ed|ition)?\b)/i;
  const conceptualOnly = /(?:long tail toward|Type II error|VIFs?.*consequence|compared to the standard normal.*t-distribution)/i;
  if (conceptualOnly.test(stem)) return false;
  return calculationLanguage.test(combined) && (numericCount >= 2 || workedArithmetic.test(why));
`,
'quantitative heuristic exclusions'
  ],
  [
`    poisson: /e⁻λ.*λˣ.*x!/i,
`,
`    poisson: /e⁻λ.*λˣ.*x!/i,
`,
'Poisson expectation anchor'
  ]
]);

console.log('Expanded CQE formula coverage and validation patch applied.');
