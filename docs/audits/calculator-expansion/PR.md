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

- 17 calculator engine/interface/manual tests passed.
- 8 relevant contrast and tool-directory integration checks passed.
- Full site build succeeded; generated unrelated artifacts were excluded from the change.
- Reference fixtures cover independently calculated ANOVA, NIST I-chart limits, probability tails, regression, matrix/complex arithmetic, calculus, finance and bounded program control flow.
- New calculator validation workflow runs the focused suite on PRs.

## Remaining validation / delivery

- Local cloud-browser navigation was blocked by the browser client, so rendered desktop/mobile/light/dark QA must be completed on a deploy preview.
- The user explicitly authorized creating a new PR on October 4, 2026. This branch is for review; no merge or live deployment is requested.
- Next: inspect the deploy preview, fix any visual defects and confirm CI.

math.js 15.2.0 is served locally with its Apache-2.0 license. New workspaces process data locally without uploading it. Existing scientific-calculator history remains in browser storage; advanced variables are session-only.
