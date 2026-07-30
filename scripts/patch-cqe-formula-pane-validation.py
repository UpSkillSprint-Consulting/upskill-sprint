from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_block(text: str, start: str, end: str, replacement: str, label: str) -> str:
    start_index = text.find(start)
    if start_index < 0:
        raise RuntimeError(f"Missing start marker for {label}: {start!r}")
    end_index = text.find(end, start_index + len(start))
    if end_index < 0:
        raise RuntimeError(f"Missing end marker for {label}: {end!r}")
    return text[:start_index] + replacement + text[end_index:]


def insert_before(text: str, marker: str, insertion: str, label: str) -> str:
    index = text.find(marker)
    if index < 0:
        raise RuntimeError(f"Missing insertion marker for {label}: {marker!r}")
    return text[:index] + insertion + text[index:]


formula_path = ROOT / "test-bank-formulas.js"
source = formula_path.read_text(encoding="utf-8")

source = replace_block(
    source,
    "    f('reliability-parallel'",
    "    f('availability'",
    r"""    f('reliability-parallel', ['design', 'risk'], 'Parallel-system reliability',
      'Rₚ = 1 − Π(1 − Rᵢ)',
      'Use when at least one independent parallel component must operate for system success.',
      'Rᵢ = reliability of component i.',
      'This form assumes active, independent parallel paths unless the question specifies standby redundancy.',
      [/parallel system|components?.*parallel|parallel.*components?|redundan|at least one.*operate|parallel reliability/i], ['parallel reliability']),
""",
    "parallel-system matching",
)

source = replace_block(
    source,
    "    f('p-chart'",
    "    f('np-chart'",
    r"""    f('p-chart', ['ppc'], 'p-chart limits',
      'Center = p̄;  UCL/LCL = p̄ ± 3√[p̄(1 − p̄)/nᵢ]',
      'Use for the fraction or proportion nonconforming when subgroup size may vary.',
      'p̄ = overall fraction nonconforming; nᵢ = subgroup size for subgroup i.',
      'Use an np chart for counts nonconforming only when subgroup size is constant. A calculated negative LCL is reported as 0.',
      [/\bp chart\b|p̄\s*=|p-bar|UCL.*p̄|LCL.*p̄|fraction nonconforming|proportion nonconforming|varying sample size.*defective/i], ['proportion chart']),
""",
    "p-chart",
)

source = replace_block(
    source,
    "    f('np-chart'",
    "    f('c-chart'",
    r"""    f('np-chart', ['ppc'], 'np-chart limits',
      'Center = np̄;  UCL/LCL = np̄ ± 3√[np̄(1 − p̄)]',
      'Use for the number of nonconforming units in equal-sized subgroups.',
      'n = constant subgroup size; p̄ = overall fraction nonconforming; np̄ = n × p̄.',
      'An np chart requires constant subgroup size. A calculated negative LCL is reported as 0.',
      [/\bnp chart\b|number nonconforming|count nonconforming.*constant/i], ['number defective chart']),
""",
    "np-chart",
)

source = replace_block(
    source,
    "    f('c-chart'",
    "    f('u-chart'",
    r"""    f('c-chart', ['ppc'], 'c-chart limits',
      'Center = c̄;  UCL/LCL = c̄ ± 3√c̄',
      'Use for the count of defects when the inspection opportunity or area is constant.',
      'c̄ = average defect count per inspection unit.',
      'Use a u chart when opportunity, area, or sample size varies. A calculated negative LCL is reported as 0.',
      [/\bc chart\b|count of defects|defects per unit.*constant|constant area/i], ['defect count chart']),
""",
    "c-chart",
)

source = replace_block(
    source,
    "    f('u-chart'",
    "    f('cp'",
    r"""    f('u-chart', ['ppc'], 'u-chart limits',
      'Center = ū;  UCL/LCL = ū ± 3√(ū/nᵢ)',
      'Use for defects per unit when the number of units or inspection opportunity varies.',
      'ū = overall defects per unit; nᵢ = units or opportunity in subgroup i.',
      'The limits change with subgroup size. A calculated negative LCL is reported as 0.',
      [/\bu chart\b|defects per unit|varying.*opportun|varying sample size.*defect/i], ['defects-per-unit chart']),
""",
    "u-chart",
)

source = replace_block(
    source,
    "    f('cp'",
    "    f('cpk'",
    r"""    f('cp', ['ppc', 'quant', 'ci'], 'Potential process capability, Cp',
      'Cp = (USL − LSL) / (6σwithin)',
      'Use to compare the natural within-process spread with two-sided specification width, ignoring centering.',
      'USL/LSL = specification limits; σwithin = short-term within-process standard deviation.',
      'Cp does not show whether the process mean is centered.',
      [/\bCp\b|potential capability|specification width.*6|capability.*spread|six sigma.*Cp|Cp.*six sigma/i], ['process capability']),
""",
    "Cp coverage",
)

source = insert_before(
    source,
    "    f('percent-grr'",
    r"""    f('gage-resolution', ['ppc'], 'Measurement resolution — 10:1 rule',
      'Recommended gage resolution ≤ Tolerance / 10',
      'Use when checking whether an instrument has adequate discrimination under the rule of tens.',
      'Tolerance = USL − LSL or the stated total tolerance width.',
      'The 10:1 rule is a guideline; the measurement-system study and application requirements still govern.',
      [/10:1|rule of tens|gage.*resolution|gauge.*resolution|caliper.*resolution|resolution.*tolerance/i], ['measurement discrimination', 'rule of ten']),
""",
    "gage resolution",
)

source = insert_before(
    source,
    "    f('aoq'",
    r"""    f('acceptance-binomial', ['ppc', 'quant'], 'Single-sampling probability of acceptance',
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
""",
    "acceptance sampling",
)

source = replace_block(
    source,
    "    f('mean'",
    "    f('weighted-mean'",
    r"""    f('mean', ['quant'], 'Arithmetic mean',
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
""",
    "mean and median",
)

source = insert_before(
    source,
    "    f('sample-variance'",
    r"""    f('population-variance', ['quant'], 'Population variance',
      'σ² = Σ(xᵢ − μ)² / N',
      'Use when the complete population is observed or the question explicitly asks for population variance.',
      'μ = population mean; N = population size.',
      'Sample variance uses n − 1 in the denominator instead of N.',
      [/population variance|formula.*variance|variance.*population/i], ['sigma squared']),
""",
    "population variance",
)

source = insert_before(
    source,
    "    f('one-sample-z'",
    r"""    f('normal-quantile', ['quant'], 'Normal-distribution percentile or quantile',
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
""",
    "normal distribution calculations",
)

source = insert_before(
    source,
    "    f('ci-proportion'",
    r"""    f('ci-variance', ['quant'], 'Confidence interval for a population variance',
      '[(n − 1)s² / χ²(1 − α/2, ν), (n − 1)s² / χ²(α/2, ν)],  ν = n − 1',
      'Use for a confidence interval on population variance when the population is normally distributed.',
      'χ²(q,ν) = chi-square quantile with cumulative probability q and ν degrees of freedom.',
      'The chi-square quantiles reverse between the lower and upper endpoints because they are in the denominator.',
      [/confidence interval.*variance|interval.*population variance|voltage.*variance/i], ['variance interval', 'chi-square variance interval']),
""",
    "variance confidence interval",
)

source = replace_block(
    source,
    "    f('sample-size-mean'",
    "    f('sample-size-proportion'",
    r"""    f('sample-size-mean', ['quant'], 'Sample size for estimating a mean',
      'n = (z*σ / E)²',
      'Use when a target margin of error E is specified for estimating a mean.',
      'σ = planning estimate of standard deviation; z* = confidence critical value.',
      'Round the calculated sample size up.',
      [/sample size.*mean|margin of error.*standard deviation|how many.*measurements|estimate.*average.*within|true average.*confidence.*σ/i], ['sample size']),
""",
    "sample size for mean",
)

source = insert_before(
    source,
    "    f('binomial'",
    r"""    f('probability-complement', ['quant', 'risk'], 'Complement rule',
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
""",
    "probability rules",
)

source = replace_block(
    source,
    "    f('poisson'",
    "    f('exponential'",
    r"""    f('poisson', ['quant', 'ppc'], 'Poisson probability',
      'P(X = x) = e⁻λ · λˣ / x!',
      'Use for event or defect counts in a fixed exposure when events occur independently at average rate λ.',
      'λ = expected count in the stated exposure.',
      'Scale λ when the exposure interval changes.',
      [/Poisson|average rate|events per|defects.*interval|count.*fixed interval/i], ['count distribution']),
""",
    "Poisson typography",
)

old_heading = "      html += '<section class=\"tb-refgroup\"><h4>' + (q ? 'Matching formulas in ' : 'Other formulas for ') + esc(sectionName) + '</h4>' + sectionCards + '</section>';"
new_heading = "      html += '<section class=\"tb-refgroup\"><h4>' + (q ? 'Matching formulas in ' : (currentFormulas.length ? 'Other formulas for ' : 'All formulas for ')) + esc(sectionName) + '</h4>' + sectionCards + '</section>';"
if old_heading not in source:
    raise RuntimeError("Missing conceptual-section heading target")
source = source.replace(old_heading, new_heading, 1)

formula_path.write_text(source, encoding="utf-8")


test_path = ROOT / "tests" / "test-bank-formula-pane-exhaustive.test.js"
tests = test_path.read_text(encoding="utf-8")

tests = replace_block(
    tests,
    "function quantitativeQuestion(question)",
    "test('formula enhancer still initializes",
    r"""function quantitativeQuestion(question) {
  const stem = String(question.stem || '');
  const why = String(question.why || '');
  const combined = `${stem} ${why}`;
  const numericCount = (stem.match(/(?:^|\s)[−-]?\d+(?:\.\d+)?%?/g) || []).length;
  const calculationLanguage = /\b(?:calculate|compute|computed|determine|probability|reliability|availability|mean|variance|standard deviation|standard error|confidence interval|sample size|capability|yield|defects? per|failure rate|risk priority number|RPN|OEE|takt|payback|present value|ROI|tolerance stack|correlation|regression|chi[- ]square|ANOVA|control limit|UCL|LCL|DPMO|DPU|DPO|PPM|MTBF|MTTR)\b/i;
  const workedArithmetic = /(?:=|×|÷|√|Σ|\^|\bdivid(?:e|ed|ing)\b|\bmultip(?:ly|lied|lication)\b|\bsubtract(?:ed|ion)?\b|\badd(?:ed|ition)?\b)/i;
  const conceptualOnly = /(?:long tail toward|Type II error|VIFs?.*consequence|compared to the standard normal.*t-distribution)/i;
  if (conceptualOnly.test(stem)) return false;
  return calculationLanguage.test(combined) && (numericCount >= 2 || workedArithmetic.test(why));
}

""",
    "calculation-question classifier",
)

tests = replace_block(
    tests,
    "test('search finds formulas by late bank-question numbers",
    "test('CQE formula registry has complete",
    r"""test('search finds formulas by late bank-question numbers, not only the first twelve mappings', async () => {
  const { window, document } = await loadRealPage();
  selectCqe(window, document);
  const api = window.__TB_FORMULAS_TEST__;
  const syntheticBank = Array.from({ length: 15 }, (_, index) => ({
    sub: 'ppc',
    stem: `Synthetic Cpk mapping question ${index + 1}: USL 20, LSL 10, mean 16, standard deviation 1. What is Cpk?`,
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
  assert.ok(card, 'Cpk is searchable by Question 15 even though the displayed mapping list is compacted');
});

""",
    "late question-number search test",
)

test_path.write_text(tests, encoding="utf-8")
print("CQE formula coverage and exhaustive validation patch applied.")
