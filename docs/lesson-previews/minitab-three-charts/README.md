# Minitab chart introduction: review evidence

Lesson: `/lessons/power-bi-excel-sql/introduction-to-symmetry-variability-and-multi-vari-charts-in-minitab`

The user explicitly selected **Public** access and **Power BI, Excel & SQL**. The lesson uses the current Lesson Creation Guide's exact header, footer, quiz styles and grader, with one automatically injected progress card.

## Content and data checks

No recreated charts, chart sliders or chart-generation code remain. Three nonvisual prediction activities, chart-choice feedback, numeric practice and the quiz retain interactivity. Original output image hashes are locked in the regression tests and match the supplied uploads.


- Five user-supplied Minitab screenshots are preserved as original PNGs, inside native `details` elements closed on initial load. Every summary reads “Review Minitab output”; interpretation is inside the same dropdown.
- The workbook contains Guide, Symmetry_Data, Factor_Data and Data Dictionary. Numeric values and every row in both analysis sheets were compared with the downloadable CSVs and embedded activity data using an independent XLSX reader.
- Factor_Data has 60 distinct pipe IDs, 12 complete factor combinations and five different pipes per cell. It does not represent repeated measurements on the same pipe.
- Verified wall median 9.530 mm; downtime median 11.5 min; overall factor mean 9.5875 mm; B / Night / Leading mean 9.680 mm, range 0.160 mm and sample SD 0.06324555 mm; Line × Shift difference in shift changes 0.150 mm.
- Official Minitab documentation was used to check menu paths, factor ordering, optional displays and the Multi-Vari Chart coverage requirement. Links appear in the lesson.

## Standard-deviation output addition

The original supplied `image(10).png` is embedded unchanged below the average-response chart in the same closed review dropdown. The walkthrough now includes **Mean of standard deviations**. Its explanation covers the twelve five-pipe cells, SD ratios, the mean SD reference line, the difference between means and spread, and the limits of this exploratory chart. The new image hash is checked in the existing regression test.

The screenshots and 79-check browser report below document the preceding four-image version. All 130 focused checks pass with the fifth image. A direct deployed-browser check confirms five original images inside four initially closed dropdowns, the SD image loading at 1536 × 576, and its readable explanation in light and dark themes. See [the added SD output in the lesson](sd-output-preview.jpg). Current deployment checks are recorded in the PR.

## Automated and browser validation

- **130/130** lesson, search, catalog, metadata and category regression checks pass, including the eight lesson tests.
- `npm run build:site` succeeds. Build-mutated source and staged/generated pages were removed or restored; only the intended registration and deterministic source search index are retained.
- The browser report records **79 passing checks** with actual shared site scripts, Chromium 153 and axe-core 4.14.0, at 1440 px and 390 px in light and dark themes.
- Eight accessibility scans cover initial content plus open output dropdowns and correct/incorrect/unanswered feedback states. No accessibility violations were reported. Computed text contrast checks also pass.
- The controls were exercised through selection and buttons. Prediction feedback, numeric practice, quiz scoring, navigation and byte-identical XLSX download checks pass. Exact search links reveal the initially closed output section.
- Every full-page screenshot below is the initial state. The separate output screenshots demonstrate the expanded review in both themes. Component captures hide the sticky header only during capture to avoid including its overlay in a crop; full-page captures preserve the actual chrome.

## Existing repository test failures

The full repository suite remains failing on unchanged `main` at `d08d8e03e703ea8bd28a2071670a052147436643`. A separate worktree reproduces failures in legacy test-bank/account-sync checks, access-gate expectations, contrast-maintenance workflow expectations and student-audit fixtures. Those unrelated files are not changed by this lesson PR.

The unmodified main comparison reports 2,322 tests, 2,158 passing and 164 failing. The branch run reports 2,363 tests, 2,203 passing and 160 failing; file-level early exits in legacy tests make totals vary between runs. One additional controller-tag failure was caused by the ignored `public-site` build staging directory, which was then deleted. All 16 controller-tag checks pass after cleanup. The new lesson's eight tests and the full 130-check lesson/search scope remain green. These results do **not** claim that the repository-wide suite is green.

The initial exact `node --test tests/*.test.js` invocation did not terminate because existing test environments retain active handles. The full comparisons use `node --test --test-concurrency=4 --test-force-exit tests/*.test.js`; this runs the complete test set and permits the runner to exit after assertions finish.

## Screenshots

- [Desktop, light](desktop-light.jpg)
- [Desktop, dark](desktop-dark.jpg)
- [Mobile, light](mobile-light.jpg)
- [Mobile, dark](mobile-dark.jpg)
- [Expanded output, desktop light](desktop-light-output.jpg)
- [Expanded output, desktop dark](desktop-dark-output.jpg)
- [Expanded output, mobile light](mobile-light-output.jpg)
- [Expanded output, mobile dark](mobile-dark-output.jpg)

See [browser-audit.json](browser-audit.json) for per-state checks, contrast measurements and accessibility results.

## Publication

[Public lesson preview](https://deploy-preview-255--upskillsprint.netlify.app/lessons/power-bi-excel-sql/introduction-to-symmetry-variability-and-multi-vari-charts-in-minitab).

Production publication still requires Ernest’s protected-main human review and merge under Lesson Creation Guide section 17. The section 16 broad-suite requirement is not claimed satisfied; the reviewer must assess the documented pre-existing failures. No historical tests, authentication rules or exam behavior were changed.
