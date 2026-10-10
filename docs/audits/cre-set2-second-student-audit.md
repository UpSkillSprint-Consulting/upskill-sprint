# CRE Set 2 — second student audit

Baseline: `1eb966b3f09fd4e782a70a78aea1731e2e591288` in PR #273. This is a fresh pass requested after the first final audit, covering the complete 150-question core.

## Assessment

The fresh read-through covered every stem, all four choices, worked explanations, and supplied evidence. No new numerical-key or answer-position error was found. Two wording gaps and two interactive-plot collisions warranted correction. The revised questions retain one best answer and their existing rationales and learning objectives.

| Item | Finding | Correction |
|---|---|---|
| Q006 | At a 1,500-hour review setting, the vertical mission marker ran through the Weibull legend. A grid line also crossed the second legend row. | Moved both legend rows below the axis and enlarged the SVG. The shared static exhibit receives the same clearer layout. |
| Q021 | The correct requirement specified a 0.99 success target that the customer scenario did not explicitly give. | Added that target to the stem; the answer remains C. |
| Q130 | “Seek authorization” and “contact the supplier” did not explicitly require receiving the authorization stipulated in the scenario. | The answer and explanation now require prompt notification, preserved records, and obtaining authorization before opening the drive. The answer remains B. |
| Q150 | At error SS 80 and 120, the critical-value boundary crossed or crowded the F label. | Moved the changing F label above the plotting area, retaining its horizontal alignment with the selected value. |

## Expanded visual and interaction coverage

All 30 review controls were exercised at **every available setting: 249 states**, including intermediate slider values. All produced nonempty finite results and finite SVG coordinates. The 27 visual tools were rendered across those states; 91 selected endpoint, intermediate, and categorical views were inspected on 16 contact sheets. The affected plots were rendered and inspected again after correction. The three remaining tools present numerical output without a plot.

The existing hosted Chromium/WebKit audit now checks text bounding boxes, text-to-text collisions, the two affected marker-to-label relationships, and reset behavior across all 249 states at each of four configurations: 1536px and 390px, light and dark. That is 996 state checks per browser, in addition to visiting all 150 live questions and their 88 exhibits in each configuration. Mobile checks also exercise horizontal exhibit scrolling with the keyboard. Existing checks retain the score and prevent review tools from appearing during a live attempt.

The two new annotation regressions were run against the previous presentation code and failed. They pass after the layout changes. The all-controls local regression was expanded from slider endpoints to every valid step. The existing independent quantitative checks cover all 74 calculation items, using numerical integration, state enumeration, likelihood checks, and raw-data reconstruction where appropriate.

## Preservation and quality judgment

- The bank still contains 150 original items, with domain counts **29/25/35/35/26**, keys **37/38/37/38**, 88 exhibits, and 30 review tools.
- The content mix remains 74 quantitative and 76 conceptual/engineering-decision items; editorial difficulty labels remain 16 foundational, 91 moderate, and 43 challenging.
- No numerical data, answer keys, IDs, BoK mappings, or other examination sets changed. The first audit's answer-length improvements and explanation fixes remain intact.
- The [second revision ledger](cre-set2-audit-round2-revisions.json) records the three exact content-field edits. Tests reverse those first, verify the complete first-audited bank hash, then apply the first ledger and verify all historical hashes. No general exemption from content locks was added.
- The set offers substantial application, interpretation, and engineering judgment practice. Some foundational items intentionally have readily distinguishable distractors. Editorial difficulty labels cannot establish live-exam equivalence, item discrimination, or candidate completion time without student response data.

## Verification and remaining limit

The Set 2 suite now contains 26 tests. The scoped suites, broader student regressions, site build, and hosted Chromium/WebKit audits are required before this update is marked ready; exact results and the tested commit are recorded in the PR.

The public preview and fixture-based student journeys are checked separately. Browser fixtures block external MathJax, so source preservation and typesetting requests are verified, but authenticated-page MathJax glyph layout remains unverified. This is the same access/rendering limit documented in the first audit. No claim of a live ASQ difficulty calibration or a comprehensive assistive-technology certification is made.

## Concurrent catalog integration

After all checks passed on `c37afc9ea73b89162ecd07921bb07bd7f727c8eb`, PR #277 added PMP to main at `f49ffef993a7f28952d18ff6bd0e5a53c70be346`. This introduced two merge conflicts in the shared exam overview and directory assertions. The integration retains both the completed CRE core and the new PMP catalog entry, including CRE's 345-question total. PMP source files are preserved exactly from main. The scoped tests, broader student regressions, PMP registration checks, site build, and hosted browser jobs are rerun on the combined tree; final results are recorded in the PR.
