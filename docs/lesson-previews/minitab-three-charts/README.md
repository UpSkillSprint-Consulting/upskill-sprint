# Minitab chart introduction: review evidence

Lesson: `/lessons/power-bi-excel-sql/introduction-to-symmetry-variability-and-multi-vari-charts-in-minitab`

The user explicitly selected **Public** access and **Power BI, Excel & SQL**. The lesson uses the current Lesson Creation Guide's exact header, footer, quiz styles and grader, with one automatically injected progress card.

## Content and data checks

- Four user-supplied Minitab screenshots are preserved as original PNGs, inside native `details` elements closed on initial load. Every summary reads “Review Minitab output”; interpretation is inside the same dropdown.
- The workbook contains Guide, Symmetry_Data, Factor_Data and Data Dictionary. Numeric values and every row in both analysis sheets were compared with the downloadable CSVs and embedded activity data using an independent XLSX reader.
- Factor_Data has 60 distinct pipe IDs, 12 complete factor combinations and five different pipes per cell. It does not represent repeated measurements on the same pipe.
- Verified wall median 9.530 mm; downtime median 11.5 min; overall factor mean 9.5875 mm; B / Night / Leading mean 9.680 mm, range 0.160 mm and sample SD 0.06324555 mm; Line × Shift difference in shift changes 0.150 mm.
- Official Minitab documentation was used to check menu paths, factor ordering, optional displays and the Multi-Vari Chart coverage requirement. Links appear in the lesson.

## Automated and browser validation

- **131/131** lesson, search, catalog, metadata and category regression checks pass, including the nine new lesson tests.
- `npm run build:site` succeeds. Build-mutated source and staged/generated pages were removed or restored; only the intended registration and deterministic source search index are retained.
- The browser report records **83 passing checks** with actual shared site scripts, Chromium 153 and axe-core 4.14.0, at 1440 px and 390 px in light and dark themes.
- Eight accessibility scans cover initial content plus open output dropdowns and correct/incorrect/unanswered feedback states. No accessibility violations were reported. Computed text and chart-color contrast checks also pass.
- The controls were exercised through selection, keyboard range input and buttons. Reset, numeric practice, quiz scoring, navigation and byte-identical XLSX download checks pass. Exact search links reveal the initially closed output section.
- Every full-page screenshot below is the initial state. The separate output screenshots demonstrate the expanded review in both themes. Component captures hide the sticky header only during capture to avoid including its overlay in a crop; full-page captures preserve the actual chrome.

## Existing repository test failures

The full repository suite remains failing on unchanged `main` at `d08d8e03e703ea8bd28a2071670a052147436643`. A separate worktree reproduces failures in legacy test-bank/account-sync checks, access-gate expectations, contrast-maintenance workflow expectations and student-audit fixtures. Those unrelated files are not changed by this lesson PR.

The unmodified main comparison reports 2,322 tests, 2,158 passing and 164 failing. The branch run reports 2,363 tests, 2,203 passing and 160 failing; file-level early exits in legacy tests make totals vary between runs. One additional controller-tag failure was caused by the ignored `public-site` build staging directory, which was then deleted. All 16 controller-tag checks pass after cleanup. The new lesson's nine tests and the full 131-check lesson/search scope remain green. These results do **not** claim that the repository-wide suite is green.

The initial exact `node --test tests/*.test.js` invocation did not terminate because existing test environments retain active handles. The full comparisons use `node --test --test-concurrency=4 --test-force-exit tests/*.test.js`; this runs the complete test set and permits the runner to exit after assertions finish.

## Screenshots

- [Desktop, light](desktop-light.png)
- [Desktop, dark](desktop-dark.png)
- [Mobile, light](mobile-light.png)
- [Mobile, dark](mobile-dark.png)
- [Expanded output, desktop light](desktop-light-output.png)
- [Expanded output, desktop dark](desktop-dark-output.png)
- [Expanded output, mobile light](mobile-light-output.png)
- [Expanded output, mobile dark](mobile-dark-output.png)

See [browser-audit.json](browser-audit.json) for per-state checks, contrast measurements and accessibility results.

## Deployed preview verification

[Open the public lesson preview](https://deploy-preview-255--upskillsprint.netlify.app/lessons/power-bi-excel-sql/introduction-to-symmetry-variability-and-multi-vari-charts-in-minitab).

- Netlify's `netlify/upskillsprint/deploy-preview` status succeeds. All three GitHub workflows succeed: Smart lesson search validation, Stateless test bank, and Spread Lab lesson validation.
- The deployed preview passes **83/83** browser checks at 1440 px and 390 px, in both themes. All eight axe scans report zero violations, computed contrast checks pass, and no page JavaScript errors occur.
- For automated rendering, the preview's HTML and assets were fetched through a temporary local transport that validates remote TLS certificates. This accommodates the execution proxy's certificate configuration without disabling certificate validation. The report records the deployed origin and SHA-256 of every fetched resource. External requests were blocked, as in the local browser audit.
- A direct cloud-browser visit independently verifies the actual public URL in light and dark mode, all four initially closed output dropdowns, the live symmetry and interaction controls, and the original Minitab image. The downloaded workbook is byte-identical to the checked-in asset.
- See [deployed browser audit](netlify-browser-audit.json) and [direct cloud-browser screenshot](netlify-preview-20261005-5a5e7b.jpg).

The PR remains a draft because the Lesson Creation Guide's section 16 requires the full repository suite to be green; the unchanged-main failures above remain unresolved. Production publication requires the protected-main review and merge described in section 17.
