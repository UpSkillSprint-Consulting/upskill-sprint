# Guided analysis, advanced SPC and quality economics

The calculator needed a path from a process question to a suitable analysis. Users otherwise had to choose a method, reshape data, transfer summary values and interpret the output separately.

This PR adds a Guided Analysis workspace as the starting tab:

- Local Excel `.xlsx`, CSV/TSV and pasted-table import, with explicit worksheet selection and import warnings.
- Up to five reusable datasets, editable cells/headers, data-quality summaries, filters, explicit exclusions and source-row traceability.
- Guided summary, independent/paired comparisons, target checks, regression, existing capability/I-MR and categorical association.
- Assumptions, two-sided confidence intervals, practical thresholds, interpretation and next steps; no automatic certification of assumptions.
- Versioned workspace save/restore, data and result CSVs, full analysis reports, and handoff to existing analysis tools.

Recommendation #2 adds Advanced SPC: I-MR, X-bar/R, X-bar/S, p/np/c/u, EWMA and CUSUM; baseline/monitoring separation, frozen baseline JSON, source-traceable dataset handoff, selected run/trend rules, and baseline capability confidence intervals. Specification compliance remains distinct from chart stability. Manual section 23 documents methods, examples, assumptions and limits.

Recommendation #3 adds Cost & Savings: four-category COQ/COPQ, cost/frequency Pareto, product-mix/volume-adjusted baseline comparisons, independent cash NPV/ROI/payback and sensitivity scenarios, and a user-maintained verification register with source/evidence/owner records. Cash, cost avoidance and capacity stay separate. Manual §24, saved projects and full reports document the workflow. Verification is user-recorded, not authenticated by the tool.

It also retains the earlier PR expansion: raw-data quality analysis; graphing and calculus; advanced lists/matrices/complex math; finance and amortization; bounded calculation programs; and corrections to numeric validation, distribution boundaries/tails, TVM, angle modes, unsupported callbacks and stale results.

The manual preserves existing material and adds the complete guided workflow in section 22, with worked examples, import limits, privacy, exclusions, reports and saved projects. The TI capability map remains explicit: this is not complete TI-84 hardware/OS/app or TI-BASIC emulation.

## Verification

- 65 calculator engine/interface/manual tests pass, including 11 advanced-SPC and nine quality-economics tests; independent SciPy and 40-digit Decimal fixtures support the numerical checks.
- 360 fixed SciPy 1.17.0 distribution comparisons, plus five independent guided t-inference reference cases.
- Excel tests cover compressed/stored ZIPs, shared/inline strings, sheets, date conversion, caches and invalid/oversized/corrupt XML packages.
- UI tests cover worked examples, incorrect inputs, missing pairs, filters, edits, stale results, asynchronous imports, project restoration, exports and handoffs.
- Full site build succeeds. CI reruns the focused suite on PR updates.
- Live SPC preview checks pass for X-bar/R capability, frozen-baseline invariance, variable-size p, EWMA, CUSUM and guided dataset handoff. Browser review improved result focus, chart labels, numeric example readability and capability-table wrapping.
- Scope, evidence and remaining limitations are documented in `docs/audits/calculator-expansion/ASSESSMENT.md`.

## Delivery and limits

- PR #236 remains open and unmerged. The live preview passed Excel import/regression and missing-value workflow checks. A discovered input-only edit defect is corrected, regression-tested and verified on the deployed preview. Workspace restoration and light/dark desktop rendering also pass.
- Data stays in browser memory unless explicitly downloaded; workspace JSON files contain the datasets. Existing scientific-calculator history retains its prior browser-storage behavior.
- Export payloads pass validation, but the cloud browser did not capture live blob-download delivery.
- XLSX is a bounded, values-only importer. Recalculate/save formulas in Excel first; unsupported formats should be exported as CSV. Dedicated mobile-device and assistive-technology testing remains outstanding.
- MSA remains outside this addition. Cost comparisons do not automatically establish cash savings, project causation or independent verification. SPC supports equal-size numeric subgroups and selected rules; exact count limits, dispersion corrections, non-normal capability and streaming state are not implemented.
