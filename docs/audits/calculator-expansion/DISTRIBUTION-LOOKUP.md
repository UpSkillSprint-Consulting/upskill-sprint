# Distribution lookup workspace — October 4, 2026

## Scope

Added a twelfth calculator workspace, Distribution Lookup Tables, reusing the exam renderer and all 18 registered options from 15 existing JSON files. The reference data files are unchanged. No exam session or timer is started. Tables load on demand and remain cached for the page session.

Desktop category buttons and a grouped mobile selector expose normal/Z, t, chi-square, F, exponential, binomial and Poisson PMF/CDF, Tukey q, Duncan, control-chart constants, sigma/DPMO, median ranks, normal scores, one-/two-sided normal tolerance factors and random digits. Each choice includes interpretation guidance. Manual section 25 documents the workflow, examples, tail conventions, numerical rounding and exact-grid limits.

Calculator lookup rejects non-tabulated keys, fractional counts/df and off-grid decimals instead of using the exam renderer's legacy next-row convention. This strict policy is opt-in on the calculator host; existing exam lookup selection behavior is retained. A button returns to the Distributions calculator for its supported continuous parameter calculations.

## Defects corrected while integrating

- Z rows labelled zero now have distinct negative/positive identities. Previously a positive z = 0.05 result could highlight the negative row's 0.4801 cell instead of 0.5199.
- Initial tolerance-factor grids now use the confidence actually displayed in the selector, rather than a different fallback confidence.
- Input edits and unsuccessful searches clear obsolete results/highlights. Matching column headers are highlighted alongside the row and cell.
- Lookup fields have associated labels; table selection exposes pressed state; result messages are live regions; scrollable grids have accessible names and keyboard focus.
- A live dark-theme check exposed shared table styles overriding the selected cell foreground. Scoped foreground/background overrides preserve readable selected cells, rows and column headers.

## Automated evidence

`NODE_PATH=/workspace/upskill-sprint/node_modules node --test tests/calculator-*.test.js tests/test-bank-tables-*.test.js`

**114 tests passed:** 86 calculator tests and 28 existing exam reference-table tests. Eight new integration tests exercise lazy initialization, workspace retention, mobile table selection, all 18 options, nine distribution examples, signed-zero highlighting, strict invalid-input handling, stale results, initial tolerance confidence and connection-error recovery.

Re-running the new integration suite with the pre-change shared renderer produced five failures, including signed-zero highlighting, strict/stale-result behavior and confidence/grid agreement; the repaired renderer passes all eight groups. The binomial, Poisson and exponential integration checks use independent closed-form arithmetic. The other example checks use standard rounded reference values. This is not a fresh exhaustive numerical audit of every existing JSON entry.

`npm run build:site` completed successfully. Build-generated changes were excluded. The calculator CI now also runs exam-table tests and triggers for shared renderer/data changes.

## Browser evidence

Verified deployed Z lookups at +0.05, −0.05 and 1.96, rejection of 1.965, and t(df=10, upper-tail alpha=0.025) = 2.228. Desktop and mobile t workflows return the same result. Manual section 25 is present and the contents contain 25 working section entries.

Reviewed normal, F, binomial, two-sided tolerance and random-number grids at 320/390-pixel iframe widths in both themes: 20 states without page overflow. The grid retains its own horizontal scrolling. At the narrower width the document content viewport is 305 pixels after its scrollbar. The manual also fits that narrow viewport in both themes.

Screenshots: `calculator-lookup-light.jpg` and `calculator-lookup-dark.jpg`. Responsive DOM evidence: `calculator-lookup-browser.json`.

After the CSS correction, active table buttons, Find, selected cells, row labels and column headers measure **5.36:1** foreground/background contrast in light mode and **10.75:1** in dark mode. Rechecked the final t-table layout and result at the 305-pixel content viewport in both themes after the spacing/contrast changes; neither overflows the page.

## Limits

The scope is all existing exam lookup options, not every probability distribution in mathematics. Printed-table precision, fixed grids and specialized method assumptions still apply. Two-sided normal tolerance factors use Howe's approximation; the 1.5-sigma shift is a convention. This work does not certify process assumptions or exam approval.

Browser checks use a cloud browser and responsive iframe, not physical mobile devices or a formal screen-reader audit. Existing whole-repository test limitations recorded in FINAL-QA-AUDIT.md remain separate from this focused passing suite. The PR remains unmerged for human review.
