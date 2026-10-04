/* Reuse the exam reference tables without loading or changing an exam session. */
(function () {
 'use strict';
 const host = document.getElementById('tb-tables');
 if (!host || !window.__TBTables) return;
 const help = document.getElementById('lookup-help');
 const picker = document.getElementById('lookup-table-choice');
 const groups = new Map();
 window.__TBTables.registry.forEach(entry => {
  if (!groups.has(entry.category)) { const group = document.createElement('optgroup'); group.label = entry.category; groups.set(entry.category, group); picker.append(group); }
  const option = document.createElement('option'); option.value = entry.id; option.textContent = entry.label; groups.get(entry.category).append(option);
 });
 picker.addEventListener('change', () => host.querySelector('[data-tbl-select="' + picker.value + '"]').click());
 const guides = {
  z: ['Standard normal (Z)', 'The cell is the cumulative probability P(Z ≤ z). The right tail is 1 − Φ(z); the area between a and b is Φ(b) − Φ(a). For a negative row, subtract the column offset. Enter z to two decimal places. Example: z = 1.96 gives 0.9750, leaving 0.0250 in the right tail.'],
  t: ["Student’s t", 'Rows give degrees of freedom; columns give upper-tail α: P(T > t) = α. For a two-sided test with total α = 0.05, use the 0.025 column and critical values ±t. Example: df = 10, α = 0.025 gives about 2.228. For non-tabulated or fractional df, use the Distributions calculator.'],
  chi_square: ['Chi-square', 'Rows give degrees of freedom; columns give upper-tail α: P(X > c) = α. Example: df = 10, α = 0.05 gives about 18.307. A two-sided variance interval uses separate α/2 and 1 − α/2 columns; chi-square is not symmetric.'],
  f: ['F distribution', 'Choose upper-tail α, numerator df (column) and denominator df (row). Their order matters. Example: α = 0.05, numerator df = 4 and denominator df = 20 gives about 2.866. Lower-tail critical values use the corresponding large upper-tail probability.'],
  binomial_pmf: ['Binomial — exact count', 'For n independent trials with constant success probability p, the cell gives P(X = x). Enter whole-number n and x with 0 ≤ x ≤ n. Example: n = 10, x = 2, p = 0.10 gives about 0.19371.'],
  binomial_cmf: ['Binomial — cumulative', 'The cell gives P(X ≤ x), including x. Use 1 − P(X ≤ x) for P(X > x), or 1 − P(X ≤ x − 1) for P(X ≥ x). Enter whole-number counts and choose a tabulated p.'],
  poisson_pmf: ['Poisson — exact count', 'The cell gives P(X = x), where λ is the expected count for the observation interval. Use a nonnegative whole-number x and a tabulated λ. Example: x = 3 and λ = 4 gives about 0.19537.'],
  poisson_cmf: ['Poisson — cumulative', 'The cell gives P(X ≤ x). For at least x events, use 1 − P(X ≤ x − 1). Scale λ to the same observation interval as the count.'],
  exponential: ['Exponential', 'X is standardized time: X = λt = t/mean lifetime. The two columns show failure probability 1 − exp(−X) and survival probability exp(−X). Example: X = 2 gives 0.86466 left and 0.13534 right. Use tabulated tenths; this model assumes a constant event rate.'],
  studentized_range: ['Studentized range — Tukey q', 'Select the family significance level α, number of groups k (column), and error degrees of freedom (row). These critical q values support Tukey multiple comparisons under the relevant ANOVA assumptions; they are not t critical values.'],
  duncan: ['Duncan’s multiple range', 'Select α, error df and p, the number of ordered means spanned by a comparison. Duncan uses a range-dependent significance level and does not provide Tukey’s strong familywise error control. Use only with a justified comparison procedure.'],
  control_chart: ['Control-chart constants', 'Enter subgroup size n to find A2, A3, d2, c4, D3, D4, B3 and B4. For X-bar/R charts, mean limits are grand mean ± A2 × average range; range limits are D3 and D4 × average range. Constants depend on subgroup size, not total observations.'],
  sigma_level: ['Sigma level / DPMO', 'The table distinguishes centered normal coverage from the conventional 1.5σ shift. Find highlights shifted PPM. Centered PPM is rounded to a whole number; shifted PPM to one decimal. A displayed zero is not proof of zero defects. The shift is a convention, not evidence that your process has shifted or is stable. Enter a tabulated tenth of a sigma level.'],
  median_ranks: ['Median ranks', 'For ordered failure rank i out of n, the table gives the plotting position (i − 0.3)/(n + 0.4). Use 1 ≤ i ≤ n. This approximation is not a method for handling censored observations.'],
  normal_scores: ['Normal scores', 'Blom’s plotting position (i − 0.375)/(n + 0.25) is transformed with the standard-normal inverse CDF. Use whole-number rank i and sample size n, with 1 ≤ i ≤ n. These are plotting scores, not test critical values.'],
  tolerance_one: ['One-sided normal tolerance factors', 'Choose confidence γ, population proportion P and sample size n. The factor k forms a normal-population bound x̄ + ks or x̄ − ks. Confidence and population coverage are different quantities; this is not a confidence interval for the mean.'],
  tolerance_two: ['Two-sided normal tolerance factors', 'Choose confidence γ, population proportion P and sample size n for x̄ ± ks. The stored two-sided factors use an approximation; check the table’s method notes and the normal-population assumption before use.'],
  random_numbers: ['Random-number table', 'Choose a starting point and reading direction before selecting observations. Read fixed-width digit groups; reject out-of-range values and, for sampling without replacement, duplicates. This is a fixed reference table, not a fresh random-number generator.']
 };
 function explain(id) {
  const guide = guides[id];
  if (!guide) return;
  picker.value = id;
  const title = document.createElement('h3'); title.textContent = guide[0];
  const text = document.createElement('p'); text.innerHTML = window.LookupMath.format(guide[1]);
  help.replaceChildren(title, text);
 }
 let initialized = false;
 function initialize() {
  if (initialized) return;
  initialized = true; explain('z'); window.__TBTables.onOpen();
 }
 document.querySelector('[data-page="pg-lookup"]').addEventListener('click', initialize);
 // The mobile picker can be used while the remaining scripts are downloading.
 if (document.getElementById('pg-lookup').classList.contains('active')) initialize();
 host.addEventListener('click', event => {
  const chip = event.target.closest('[data-tbl-select]');
  if (chip) explain(chip.dataset.tblSelect);
 });
 document.getElementById('lookup-open-distributions').addEventListener('click', () => document.querySelector('[data-page="pg-dist"]').click());
})();
