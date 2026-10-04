# Distribution lookup QA — 4 October 2026

## Numerical assessment

`validate-lookup-data.py` independently recalculates reference values with SciPy 1.17.0, closed-form probability expressions, and normal order-statistic integration. `lookup-data-validation.json` records **22,402 checks, zero failures** within stored rounding precision. All inexpensive cells are checked. Tukey and Duncan inverse distributions are sampled at 47 deliberately spread/seeded cases each; their entire grids are not exhaustively recalculated. Random digits are checked against the recorded generator/seed.

One-sided tolerance factors are checked against noncentral-t quantiles. Two-sided factors are checked against the stated Howe approximation; this does not certify exact confidence/coverage of the approximation. Initial discrepancies in centered PPM were caused by its whole-number rounding (shifted PPM uses one decimal), not incorrect source values. Guidance now states the precision and explains that a rounded zero is not proof of zero defects. Reference JSON is unchanged.

## Reproduced defects and corrections

- Scientific notation such as `n=1e1` was truncated to 1 by integer parsing. Numeric keys now preserve the entered value; exact-grid and integer validation still apply. Binomial, Poisson and t regressions cover this defect.
- A late response for an earlier request for the same table could clear a completed lookup. A request sequence now discards obsolete responses, including same-table responses.
- Rebuilding the table buttons discarded keyboard focus. Selection now updates existing buttons in place.
- At 320 px, the F table's frozen first column measured 328 px inside a 222 px grid and covered the selected cell. Corner labels now wrap; lookup scrolling centers the cell in the region excluding the frozen column.
- Table re-rendering now reapplies row/column header scopes.

## Professional equation typography

All 17 mathematical table options have reviewed LaTeX equations compiled to native MathML. Random digits require no equation. The one-sided formula now has a stacked fraction, square root, proper quantile notation, and explicit definitions of the noncentrality, degrees of freedom, coverage and confidence. The two-sided explanation explicitly distinguishes its lower-tail chi-square quantile from the upper-tail reference-table convention.

The manual includes the same full equation reference. Fractions and expressions in lookup guidance and manual prose are typeset. Copyable programming syntax remains literal code. Each MathML equation retains its source LaTeX annotation. No CDN script or client-side math library is needed; equations inherit theme colors and scroll independently on narrow screens. Regenerate with `node scripts/build-lookup-math.cjs /path/to/katex` using KaTeX 0.18.7.

## Verification

- **118 focused tests passed**: calculator numerical/UI/manual tests plus existing shared exam-table tests. Four new regression tests cover the first three defects and equation rendering across all mathematical tables.
- Full site build passed.
- Numerical report: 22,402 checks passed with the precision and sampling limits above.
- Live preview checks follow publication of this change; final browser evidence will be recorded separately.

This is an assistant QA pass with independent reference arithmetic, not third-party certification. Physical devices, screen readers and exhaustive parameter coverage remain outside this audit. PR #236 remains unmerged.
