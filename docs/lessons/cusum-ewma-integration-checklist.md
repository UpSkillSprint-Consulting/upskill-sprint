# CUSUM vs. EWMA — implementation and QA handoff

## Lesson integration
- Production lesson: `lessons/quality-engineering/cusum-vs-ewma-control-charts.html`
- Public route: `/lessons/quality-engineering/cusum-vs-ewma-control-charts`
- Library registration: `lessons.html` > Quality Engineering, Intermediate · Interactive · 35 min
- Search integration: shared `/site-sections.js` is loaded to support section deep links.
- Theme integration: shared `/theme.js` and brand logo `/assets/logo-icon.png` are reused.

## Included lesson materials
- 8 chart images stored under `lessons/quality-engineering/cusum-ewma-assets/` as self-contained SVG wrappers around the *original PNG pixels*, preserving exact visual content.
- The two user-supplied original Minitab screenshots are identified explicitly; the other six graphics are clearly labeled reconstructions from practice data.
- Raw practice observations: `CUSUM_EWMA_Minitab_Practice_Data.csv`.
- Original Excel workbook and Minitab project stored byte-for-byte as base64 text files. `cusum-ewma-downloads.js` reconstructs client-side downloadable `.xlsx` and `.mpx` files without modifying their bytes.
- Lesson teaches CUSUM/EWMA selection, formulas, numerical examples, parameter sensitivity, Minitab steps, real outputs, quiz, and practical exercises.

## Verification
- The source PNGs embedded in all eight SVGs decode byte-for-byte to the original chart images (checked locally).
- Both binary training files decode byte-for-byte to their original workbook/MPX files (checked locally).
- Repository copies of the two original Minitab SVG wrappers and the binary payloads were compared against their source content with matching results.
- HTML interaction tests on Chromium at desktop 1440×900 and mobile 390×844: calculator updates, input validation, reset, exercise reveal, quiz scoring (5/5), quiz reset, dark mode; no JS exceptions or horizontal overflow.
- Required HTML section hooks and IDs verified; no duplicate IDs.
- CI and Netlify deploy-preview results are the final merge gates. Deployment has **not** been made to main.

## Reviewer checks
1. Confirm Netlify deploy preview succeeded and the new clean URL resolves.
2. Review source chart provenance and reconstructed chart labeling.
3. Try CSV, XLSX, and MPX downloads from the deployed preview (including byte-integrity if desired).
4. Verify all chart images render, shared theme toggle works, and lesson search finds the new page.
5. Check GitHub Actions and any branch-protection requirements before merge.

This PR is intentionally unmerged; merge only after repository checks and reviewer requirements are satisfied.
