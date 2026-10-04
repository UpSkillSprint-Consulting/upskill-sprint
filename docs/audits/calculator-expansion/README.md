# Engineering calculator expansion — 2026-10-04

## Scope

The existing calculator and manual now load readable HTML and locally served modules instead of decompressing a concatenated page at runtime. Existing distribution, scientific-calculator and hypothesis-test workflows are preserved and extended. No authentication, membership or other lesson behavior is changed.

Eight workspaces: Distributions, Hypothesis Tests, Data & Quality, Graphing, Lists & Matrices, Finance, Programs, Scientific Calculator.

This is an independent browser implementation. Full TI-84 Plus CE parity is **not** claimed. The manual §20 explicitly records unsupported regression families, TI-BASIC/device/file commands, proprietary bundled apps and hardware features. The command subset is visible before a user runs a program.

## Corrected defects

- Replaced silent parseFloat/filter data loss with strict numeric parsing and row/cell errors.
- Replaced guessed two-column regression with an explicit STAT format selection.
- Clear hypothesis/analysis results when inputs or selected methods change.
- Validate integer sample sizes/counts, positive standard deviations, count bounds and meaningful specifications.
- Correct difference/ratio alternative hypothesis null values.
- Evaluate direct upper tails; fix binomial/negative-binomial endpoint PMFs.
- Expand discrete inverse-CDF brackets independently of plot limits.
- Label discrete inverse probabilities as actual inclusive regions; reject ambiguous discrete two-tail regions.
- Add tab semantics, associated labels, readable secondary text and wrapping navigation.

## Validation

Commands:

```
node --test tests/calculator-*.test.js
node --test tests/tool-access-labels.test.js tests/contrast-injection-workflow.test.js tests/contrast-theme-race.test.js
npm run build:site
```

Reference checks include:

- NIST individuals sequence: mean 50.81, MRbar 1.87777777778, I limits 45.8159101655 and 55.8040898345.
- NIST ANOVA observations: F(2,12) = 9.59110703644, p = 0.003248222600859306, independently checked using SciPy f_oneway.
- Pearson contingency example: chi-square 16.6666666667, df 2, p 0.000240369476420.
- Normal probability between 8 and 9: 6.21983198587e-16.
- Geometric p=.2 inverse CDF at .999999: 62, exceeding the old plotted support.
- Integral sin(x), 0 to pi = 2; derivative x^3 at 2 = 12; root x^2-2 = sqrt(2).
- PV 20000, 6% nominal, 60 monthly end payments: PMT -386.656030589; zero-interest payment -333.333333333.
- Matrix inverse, determinant, simultaneous equations, complex arithmetic, unit conversion, lists, four graph modes and bounded program control flow.
- DOM integration: examples, stale results, labels/IDs, tabs, graph/finance/program actions and worker responses.

Targeted tests do not establish a universal precision guarantee. Invalid/singular cases and limitations are explained in the UI and manual.

## Dependencies and privacy

math.js 15.2.0 browser distribution is served locally with its Apache-2.0 license. The worker isolates expression/program computation and has a main-thread timeout. Evaluation uses a function allowlist and bounded array creation; it does not execute arbitrary JavaScript. No external runtime CDN dependency was added.

New datasets, graphs and programs are processed in the browser and are not uploaded or automatically persisted. Scientific-calculator history retains its existing browser-storage behavior. Export is explicit.
