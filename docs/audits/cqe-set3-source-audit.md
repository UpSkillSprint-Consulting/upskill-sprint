# CQE Set 3 source-visual audit

Source: *The ASQ Certified Quality Engineer Study Guide*, second edition, Scott A. Laman (editor), user-supplied 279-page PDF. Printed page n is PDF page n + 27.

## Coverage and changes

- Matched all **613 existing Set 3 entries** to section, question number and PDF/printed page. The machine-readable map is `cqe-set3-source-audit.json`.
- Attached **47 exact source crops to 58 questions**, including tables, GD&T frames, probability and control charts, scatterplots, interaction plots, histograms, risk matrices, box plots, and reliability block diagrams.
- Source crops are rendered at 216 dpi, visually inspected, and verified by SHA-256 and PNG dimensions. Crops exclude solutions, answer options, unrelated questions and page furniture. All table totals, axes, legends and labels were checked; initial clipped totals/labels were corrected.
- Reused an identical source image for shared tables/diagrams while preserving each question's own source-question mapping. Each question carries the image directly, so randomized delivery does not depend on a preceding question.
- Replaced flat inline table text and descriptive answer hints with neutral prompts and original figures. Full-size image links and descriptive alternative text are available. Figure backgrounds stay white in dark mode.
- Removed invented sample histories from calculation-only Q365, Q533 and Q549; these guide questions do not contain plots.
- Preserved the 613-question pool, question identities, set membership, domain assignments and other exam banks.

## Corrective findings

| Set 3 question | Finding and correction |
| --- | --- |
| 42 | Completed the truncated product-development prompt. |
| 244, 245, 525 | Restored the actual feature control frame, including its parallelism symbol and circled L. Previous prose incorrectly called it perpendicularity. |
| 280, 281 | Removed displaced parameter subscripts in double-sampling prompts. |
| 317 | Corrected the description of 40.28%: it is the estimated share of total observed variance, including part-to-part variation. |
| 330 | Corrected the keyed critical value to 2.402, matching the guide solution and the right-tailed t test. |
| 340 | Corrected F critical value to approximately 3.89 for df 2 and 12. Replaced the claim of proven equality with insufficient evidence of a difference. |
| 391 | Preserved the source ANOVA image and explained its ABC F-ratio typo in feedback; the significant-term answer is unchanged. |
| 462, 533, 555 | Replaced feedback that repeated the question with an actual worked explanation. |
| 547 | Described −0.90 as a strong negative correlation. |
| 549 | Corrected the np-chart lower control limit to zero and UCL to approximately 14.37. |
| 555 | Used the correct chi-square decision without claiming independence is proven. |
| 596 | Corrected the answer key to ±2.069; removed the malformed minus/plus-minus option. |
| 599 | Retained the original table; explicitly bases the answer on df. Feedback notes the source MS/F inconsistency rather than presenting it as a valid worked ANOVA. |
| 611 | Restored the actual risk-treatment arrow/grid rather than an invented High-to-Low relocation. |

The guide's printed answer-letter errors in III.22, VI.20 and VI.39 were not reintroduced: the bank's corrected choices agree with the guide's worked explanations. III.49 has an already-expanded option representing the multidisciplinary FMEA team; its correct bank index is preserved.

## Existing source coverage notes

The 613 entries represent 611 distinct source questions: III.7 maps to Set 3 Q42/Q242 and IV.24 maps to Q79/Q280. These existing duplicate source relationships are recorded, not silently deleted or renumbered. Four guide questions (III.44, VI.58, Additional Practice 11 and 27) are outside the existing bank. VI.58's contingency table is still available to the dependent VI.59 question (Set 3 Q343). This restoration audits the existing Set 3 pool rather than expanding it.

## Verification

- `node --test tests/test-bank-cqe-source-visuals.test.js`: 10 passing tests, including all 613 mappings, all 47 asset checksums, all 58 quiz/review renderings, and six timed/untimed Full/Quick/Focused journeys through reveal, review and retry.
- `node scripts/validate-simple-test-bank.mjs`: passes.
- Existing stateless results, current-attempt review and answer-reveal suites: 49 passing tests.
- `scripts/extract-cqe-set3-source-visuals.py`: reproduces all 47 byte-identical crops from the supplied source. The PDF itself is not committed.
- Browser layout checks are wired into the existing Chromium/WebKit student-audit workflow: all 58 images at 1280, 390 and 320 px in light/dark themes, asset loading, overflow, full-size opening, and representative screenshots. See PR checks for the executed browser results.

This is a complete source-matching and visual-dependency audit of the existing pool, with targeted corrections to discrepancies encountered. It is not a claim that every original textbook calculation or statement is independently error-free.
