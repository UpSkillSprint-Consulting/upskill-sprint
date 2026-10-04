# Calculator assessment — October 4, 2026

The assessment covers the nine workspaces in PR #236, including the guided analysis addition, numerical references, invalid inputs, state changes, worker isolation, and consistency with the user manual. The checked calculations pass after the corrections below. This is a browser implementation with documented scope limits; it is not complete TI-84 Plus CE emulation.

## Guided analysis addition

The new default workspace connects a reusable dataset to a question, a supported method, an interpretation and next steps. It implements recommendation #1; advanced SPC, measurement system analysis and cost-of-quality/verified savings remain separate future work.

- Local CSV/TSV parsing and bounded .xlsx import, including worksheet choice, shared/inline strings, cached formula values and common date types. Excel formulas and external links are not executed. Missing caches, hidden rows, filters and merged cells are identified. Package size, decompressed size, dimensions and checksums are checked.
- Up to five datasets; named columns; paginated cell editing; source row references; duplicate/blank profiling; explicit row exclusions; an exact category filter; opt-in complete-row analysis with paired rows kept together.
- Questions route to summary, Welch or paired t, one-sample t, classical ANOVA, linear regression, existing I-MR/capability or categorical independence. Guidance uses study design rather than an automated normality gate. Confidence, difference direction and practical thresholds are explicit.
- Session-only data with a versioned JSON save/restore workflow; reports include included values, settings, dataset revision, full exclusions and edit history. CSV exports guard formula-like text. Data and setting changes invalidate results.
- Handoffs use the current included values. Existing Data & Quality limits are respected; a valid Welch result with one zero-spread group stays in the guide because the legacy summary form requires positive standard deviations.
- Manual §22, quick start and TOC cover all workflows and limitations. The process-change example reports difference −0.5333333333 mm and 95% interval [−0.7515055393, −0.3151611274] mm.

Validation at implementation: **45 calculator tests pass**, including the original 360 distribution reference comparisons and five independent SciPy guided-inference cases (Welch, paired, one-sample, unequal variance/sample size, small scale, and multiple confidence levels). Import/UI tests cover quoted/multiline CSV, bad inputs, exclusions and filtering, missing pairs, both XLSX compression modes, shared strings, multiple worksheets, dates, missing formula caches, corrupt/oversized/DTD-containing workbooks, saved-project roundtrips, safe text rendering, asynchronous import races, state invalidation and analysis handoffs. The full site build passes. Live preview confirmed Excel worksheet selection and regression, CSV missing-value blocking/explicit complete-row analysis, and readable desktop layout without page overflow. It exposed a cell edit that updated the displayed value without committing to the dataset when no change event followed the input event. Cell edits now commit on input without replacing the active editor, edit history is coalesced within an editing session, and a regression test verifies the changed estimate. Dataset and column names also commit promptly, and invalid metadata blocks analysis/export. Final preview verification of this correction follows deployment. Live blob-download capture timed out; payload validation passed, but actual download delivery is not claimed.

References/fixtures: `tests/fixtures/calculator-guided-reference.json`, `tests/fixtures/calculator-guided-xlsx.json`; regenerate with `python docs/audits/calculator-expansion/generate-guided-fixtures.py` (SciPy 1.17.0 and openpyxl 3.1.5). The tests run without Python. The custom XLSX reader is a bounded values importer, not full spreadsheet compatibility. Dedicated mobile-device and assistive-technology validation remains outstanding.

## Findings and fixes

| Finding | Effect before correction | Correction and verification |
| --- | --- | --- |
| Incomplete gamma series stopped after 500 iterations | At the median of chi-square with 1,000,000 df, CDF was approximately 0.2602 instead of 0.5 | Convergence-driven iteration with a finite cap; unconverged values return failure. SciPy CDF, survival and inverse fixtures now pass. |
| Continuous density endpoints were forced to zero | Gamma/Weibull shape 1 and chi-square df 2 had incorrect density at zero; uniform Beta endpoints were wrong | Correct finite, zero and infinite endpoint limits; explicit endpoint tests. |
| Hypergeometric upper tail used subtraction from 1 | Small tail probabilities lost accuracy | Sum the upper-tail masses directly. |
| Small positive probabilities rounded to zero | Values such as 1e-8 displayed as 0 | Scientific notation for small positive probabilities; singular densities display infinity. |
| Root solver accepted any small residual as zero | `solve("1e-15*(x-2)",0,3)` returned 0 instead of 2 | Converge on bracket width, check scaled residual, reject reversed/nonfinite brackets and tested discontinuities. |
| TVM used differences of large nearly equal values for coefficients | Large valid balances could report an unidentifiable unknown or lose accuracy | Direct linear coefficients; discounted/scaled equations for rate/N; finite-result validation and rejection of all-zero non-unique cash flows. Addressed the PR review’s −99% case by deriving the rate bound from compounding frequency and expanding positive bounds; −1,188% nominal monthly and +10,000% annual fixtures also pass. |
| Multi-line Ans stored a result container | `A=2` followed by `A+3`, then `Ans*2`, failed | Ans now stores the final value; expected output 10. |
| Angle mode covered only part of the trig catalog | csc/sec/cot/atan2 ignored DEG; string helpers used RAD even in DEG | All circular trig/inverse helpers and nested numerical helpers honor the selected angle unit. Complex argument remains radians, as documented. |
| Unsupported functions could be passed as callbacks | `map(["2+2"],evaluate)` bypassed the intended catalog | Validate function references as well as direct calls; reject reserved loop variable names. Supported callbacks remain usable. |
| Old table/program/finance output could survive input edits or pending responses | Output could be mistaken for current input results | Clear old output and ignore outdated response versions. Math/program execution and worker resets also invalidate graphs based on shared variables. |
| Graph click trace used the full SVG width instead of plot geometry | Click position did not correctly identify the plotted point | Select the nearest sampled point on the chosen curve. |
| Value/derivative required an unused upper bound | Clearing b prevented an operation that only needs a | Only validate b for operations that use an interval. |
| Numerical failure could produce a misleading hypothesis decision | NaN comparisons could fall into “fail to reject” | Reject nonfinite p-values/critical values before producing a decision. |

## Executed validation

- 28 calculator tests pass. These include 360 numerical comparisons against fixed SciPy 1.17.0 output, covering PDF/PMF, CDF, inclusive upper tails and quantiles for all 16 distributions plus a large-df chi-square case.
- Fixture tolerance: 1e-8 relative, with 1e-20 absolute floor. This is a test tolerance, not a universal precision guarantee.
- 8 additional existing tests pass for contrast/theme behavior and tool-directory integration.
- Full `npm run build:site` succeeds. Generated unrelated lesson files are excluded from this PR.
- Deploy preview verification: multi-line Ans → 10; DEG csc(30) → 2, atan2(1,1) → 45, nDeriv(sin(x),0) → π/180, integral sin(x) over 0–180 → 360/π; scaled root → 2; large-df chi-square median CDF → approximately 0.5. TVM payment and 60-row amortization render successfully.
- Function graph and trace render in both light and dark desktop themes. Scientific keypad entry 2+3 returns 5. The manual loads, contains the corrected angle explanation, has no broken TOC targets, and retains its explicit partial-compatibility notice.
- Export payload tests validate parseable SVG, CSV mean output and preserved program source. The cloud browser could not capture the live blob-download event, so actual file delivery has not been verified through that browser.
- Manual updated for angle behavior, multi-line Ans, stale output, TVM equations/search limits and numerical limitations.

Fixtures are checked into `tests/fixtures/calculator-distributions.json`. To regenerate with SciPy installed, run `python docs/audits/calculator-expansion/generate-reference-fixtures.py` from the repository root. CI consumes the committed values and does not require Python/SciPy.

## Remaining limits

- Full TI-BASIC, TI device/file interfaces, proprietary apps, several regression families and TI-specific editors are not implemented. Manual §20 remains explicit about the gaps.
- Tests cover selected representative and edge cases. Floating-point overflow/underflow, ill-conditioned matrices and extreme inputs still require care.
- Sampled graphs/integration can miss narrow or highly oscillatory features; extrema searches assume a unimodal interval. A sign-changing bracket does not prove mathematical continuity.
- TVM rate searches use the compounding domain and up to 40 upper-bound expansions; N searches remain bounded; IRR can have multiple solutions. Financial examples are mathematical cash-flow checks, not lender-specific schedules.
- Worker limits reduce hangs and disallow unsupported function references; this assessment is not a formal security certification.
- Desktop rendering is checked on the deploy preview. Dedicated mobile-device and assistive-technology testing has not been completed in this environment.

## Primary references

- [SciPy continuous-distribution definitions](https://docs.scipy.org/doc/scipy/tutorial/stats/continuous.html)
- [NIST Gamma distribution](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366b.htm)
- [NIST Weibull distribution](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3668.htm)
- [math.js expression security](https://mathjs.org/docs/expressions/security.html)
