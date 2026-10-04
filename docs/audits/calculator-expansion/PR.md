# Guided analysis, reusable datasets and engineering calculator expansion

The calculator needed a path from a process question to a suitable analysis. Users otherwise had to choose a method, reshape data, transfer summary values and interpret the output separately.

This PR adds a Guided Analysis workspace as the starting tab:

- Local Excel `.xlsx`, CSV/TSV and pasted-table import, with explicit worksheet selection and import warnings.
- Up to five reusable datasets, editable cells/headers, data-quality summaries, filters, explicit exclusions and source-row traceability.
- Guided summary, independent/paired comparisons, target checks, regression, existing capability/I-MR and categorical association.
- Assumptions, two-sided confidence intervals, practical thresholds, interpretation and next steps; no automatic certification of assumptions.
- Versioned workspace save/restore, data and result CSVs, full analysis reports, and handoff to existing analysis tools.

It also retains the earlier PR expansion: raw-data quality analysis; graphing and calculus; advanced lists/matrices/complex math; finance and amortization; bounded calculation programs; and corrections to numeric validation, distribution boundaries/tails, TVM, angle modes, unsupported callbacks and stale results.

The manual preserves existing material and adds the complete guided workflow in section 22, with worked examples, import limits, privacy, exclusions, reports and saved projects. The TI capability map remains explicit: this is not complete TI-84 hardware/OS/app or TI-BASIC emulation.

## Verification

- 45 calculator engine/interface/manual tests pass.
- 360 fixed SciPy 1.17.0 distribution comparisons, plus five independent guided t-inference reference cases.
- Excel tests cover compressed/stored ZIPs, shared/inline strings, sheets, date conversion, caches and invalid/oversized/corrupt XML packages.
- UI tests cover worked examples, incorrect inputs, missing pairs, filters, edits, stale results, asynchronous imports, project restoration, exports and handoffs.
- Full site build succeeds. CI reruns the focused suite on PR updates.
- Scope, evidence and remaining limitations are documented in `docs/audits/calculator-expansion/ASSESSMENT.md`.

## Delivery and limits

- PR #236 remains open and unmerged. The live preview passed Excel import/regression and missing-value workflow checks. A discovered input-only edit defect is corrected and regression-tested; the corrected preview is awaiting final verification.
- Data stays in browser memory unless explicitly downloaded; workspace JSON files contain the datasets. Existing scientific-calculator history retains its prior browser-storage behavior.
- XLSX is a bounded, values-only importer. Recalculate/save formulas in Excel first; unsupported formats should be exported as CSV. Dedicated mobile-device and assistive-technology testing remains outstanding.
- Advanced SPC, MSA and cost-of-quality/verified savings are not part of this guided-workspace addition.
