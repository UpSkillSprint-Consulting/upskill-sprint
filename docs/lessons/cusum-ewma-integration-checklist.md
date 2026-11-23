> **Draft PR — not merge-ready.** This branch contains only the integration checklist. The completed lesson HTML, screenshots, reconstructed plots, CSV, XLSX and MPX have **not** been uploaded to GitHub. They are packaged as `UpSkillSprint_CUSUM_vs_EWMA_Complete_Lesson_Package.zip` in the originating ChatGPT conversation and must be transferred into this branch before merging. Do not add the lesson-library entry or deploy the route until every referenced file is committed and verified.

# UpSkill Sprint — CUSUM vs. EWMA Control Charts

## Production lesson

**Title:** CUSUM vs. EWMA Control Charts: Complete Guide and Minitab Practice  
**Category / slug:** Quality Engineering / `quality-engineering`  
**Level / duration:** Intermediate / 35 minutes  
**Interactive:** Yes  
**Card title:** CUSUM vs. EWMA: Detect the Hidden Shift  
**Card description:** Learn time-weighted control charts with real Minitab project outputs, a live simulator and four manufacturing case studies.  
**Search keywords:** CUSUM, EWMA, Minitab, control charts, statistical process control, SPC, small shift, quality engineering.

**Physical GitHub path (not yet committed):**

`lessons/quality-engineering/cusum-vs-ewma-control-charts.html`

**Clean public URL (proposed, not yet published):**

`https://upskillsprint.com/lessons/quality-engineering/cusum-vs-ewma-control-charts`

## Installation

1. Copy the included `lessons/quality-engineering/cusum-vs-ewma-control-charts.html` file and its sibling `cusum-ewma-assets/` directory into the website at the same relative paths.
2. The header expects the site's existing `/assets/logo-icon.png` and shared `/theme.js` files. These site-wide files are not duplicated here.
3. Add the entry below to the lesson library's Quality Engineering category.
4. Verify the clean-route rewrite and public URL, and perform a site-integrated theme-switch test. No GitHub files were modified during preparation.

## Ready-to-paste lesson-library entry

```html
<a
  class="lesson-row"
  href="/lessons/quality-engineering/cusum-vs-ewma-control-charts"
  data-lesson-item
  data-topic="quality-engineering"
  data-level="intermediate"
  data-interactive="true"
  data-search="CUSUM EWMA Minitab SPC control charts small shift time weighted process monitoring"
>
  <div>
    <div class="lesson-meta">
      <span>Intermediate</span>
      <span>Interactive · 35 min</span>
    </div>
    <h3>CUSUM vs. EWMA: Detect the Hidden Shift</h3>
    <p>Learn time-weighted control charts with real Minitab project outputs, a live simulator and four manufacturing case studies.</p>
  </div>
  <span class="lesson-action">Start lesson</span>
</a>
```

## Local assets

All assets reside in `lessons/quality-engineering/cusum-ewma-assets/`.

- `pipe-cusum-original-minitab.png` — cropped from supplied user screenshot, including highlighted lower CUSUM.
- `ore-cusum-original-minitab.png` — the supplied user screenshot.
- `pipe-ewma-reconstructed.png` — independent calculation of saved worksheet and chart parameters.
- `reactor-cusum-reconstructed.png` and `reactor-ewma-reconstructed.png` — independent calculations.
- `fill-cusum-reconstructed.png` and `fill-ewma-reconstructed.png` — independent calculations.
- `ore-ewma-reconstructed.png` — calculated companion example; **not** a saved Minitab plot.
- `CUSUM_EWMA_Minitab_Practice_Data.csv` — raw 100-row, four-process data.
- `CUSUM_EWMA_Minitab_Practice_Workbook.xlsx` — supplied calculation workbook.
- `CUSUM_EWMA_Minitab_Practice.mpx` — supplied original Minitab project containing seven charts.

**Minitab parameter checks:** 7 saved commands: Pipe CUSUM/EWMA, Reactor CUSUM/EWMA, Filling EWMA/CUSUM and Ore CUSUM. First signals independently recalculated under CUSUM h=4/k=.5, EWMA λ=.2/L=3.

## Validation performed

- HTML parsed; 38 unique element IDs, all required stable lesson hooks present.
- Local image and downloadable resource paths resolved.
- No inline event handler attributes; vanilla JavaScript syntax check passed.
- Headless Chromium desktop (1440px) and mobile (390px) passed interactive test runs: update, preset, invalid-input error, reset, answer reveal, quiz grade 5/5, quiz reset; zero page exceptions and no horizontal overflow.
- Chart SVG and MathML rendered in Chromium; light/dark CSS variable updates tested.
- Original screenshots and reconstructed charts clearly distinguished.
- References use official NIST/Minitab URLs; source pages were verified through search.
- Site's actual `/theme.js`, `/assets/logo-icon.png`, GitHub route rewriting, and deployed-page accessibility must still be tested in the real website; these cannot be validated in the isolated build.

No existing GitHub file was overwritten or committed.