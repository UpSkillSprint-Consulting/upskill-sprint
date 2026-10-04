# Expand engineering calculator with graphing, quality analysis and advanced math

The calculator silently discarded invalid data, guessed when two-column inputs meant regression, retained stale test output after input changes, and lacked direct raw-data quality analysis and graphing workflows.

This change adds five workspaces and extends the existing three:

- Raw-data summaries, intervals, seven regression models, ANOVA, chi-square independence/goodness-of-fit, capability and I-MR.
- Function, parametric, polar and first-order sequence graphs, trace, custom windows, zoom, tables and numerical calculus.
- A searchable advanced math workspace for lists, matrices, simultaneous equations, complex arithmetic, units and probability.
- TVM, amortization and NPV/IRR helpers.
- A bounded calculation-program editor with an explicitly documented subset of commands.

It corrects numeric input validation, discrete endpoint/quantile errors, tiny upper-tail cancellation, incorrect two-sample alternative labels, and stale output. Reports, result tables, graphs, tapes and program source have explicit downloads.

The calculator and manual are now readable source HTML instead of compressed runtime payloads. The manual preserves existing material and adds workflow examples, assumptions, formulas, exports, troubleshooting and a TI-84 Plus CE capability map. This does **not** claim complete TI hardware/OS/app or TI-BASIC compatibility; outstanding differences are listed in manual §20.

## Verification

- 28 calculator engine/interface/manual tests passed, including 360 distribution comparisons against fixed SciPy 1.17.0 references.
- 8 relevant contrast and tool-directory integration checks passed.
- Full site build succeeded; generated unrelated artifacts were excluded from the change.
- Reference fixtures cover all 16 distributions plus large-df chi-square, independently calculated ANOVA, NIST I-chart limits, regression, matrix/complex arithmetic, calculus, finance and bounded program control flow.
- Follow-up assessment fixed large-shape convergence, endpoint densities, small upper-tail accuracy/display, scaled roots and TVM, multi-line Ans, angle-mode consistency, unsupported callbacks, graph click tracing and stale outputs. See `docs/audits/calculator-expansion/ASSESSMENT.md`.
- New calculator validation workflow runs the focused suite on PRs.

## Delivery

- PR #236 is open for review; no merge or production deployment is requested.
- Refreshed preview verified: degree-mode/numerical corrections, multi-line Ans, TVM/amortization, graphing/tracing, light/dark desktop rendering, scientific keypad and manual navigation.
- SVG/CSV/program export payload tests pass; this cloud browser could not capture the live blob-download event.
- Mobile CSS and overflow behavior are included, but dedicated mobile-device rendering has not been verified in this environment.

math.js 15.2.0 is served locally with its Apache-2.0 license. New workspaces process data locally without uploading it. Existing scientific-calculator history remains in browser storage; advanced variables are session-only.
