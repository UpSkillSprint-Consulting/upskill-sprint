# CRE Set 2 — final student audit

Scope: all 150 original practice questions in PR #273, including every stem, option set, explanation, option rationale, assumption, mapping, and evidence exhibit. Baseline: `722c026434d55fb2b6436d2b2fbdefbd9c708970`. The user requested correction of content, aesthetics, and visual issues across the completed set.

## Assessment

The core provides substantial application and analysis practice: 74 quantitative items and 76 conceptual/engineering decisions, with 88 exhibits and 30 optional completed-review explorations. Its editorial difficulty mix is 16 foundational, 91 moderate, and 43 challenging. Cognitive labels are 27 Understand, 41 Apply, 48 Analyze, and 34 Evaluate. These are authoring judgments, not measured candidate difficulty or proof of equivalence to a live ASQ exam.

All 150 items were reviewed for sufficient information, one best answer, plausible misconception-based distractors, consistent feedback, stated assumptions, and useful evidence. The existing independent numerical checks were rerun, including numerical integration, state enumeration, likelihood searches, and explicit raw-data reconstructions. No answer-key or calculation correction was needed. No exact duplicate stems were found; recurring techniques occur in distinct engineering decisions or models. IDs, keys, BoK mappings, domain counts, and numerical data are unchanged.

| Area | Finding and disposition |
|---|---|
| Explanation integrity | Q026 contained a raw less-than sign before `T_X`. HTML parsed it as a tag and hid part of the inequality and following prose. Replaced it with TeX `\lt`. The global explanation audit now rejects unexpected HTML elements and verifies every delimited formula survives insertion. Reveal and completed-review checks explicitly cover Q026. |
| Answer clues | The correct choice was uniquely longest by character count in 62 of 76 nonquantitative items (81.6%). Tightened 41 keyed choices, removing redundant explanatory wording while preserving their decisions. The rate is now 30/76 (39.5%). This is a diagnostic, not a psychometric statistic or a mandated length quota. All revised choices were reread with their stems, distractors, and rationales. |
| Q018 Duane graph | Two annotations crowded the forecast line. Moved them to a separate legend and increased figure height. |
| Q033 parameter diagram | The signal-input label touched its box edges. Wrapped it across two lines within the existing box. |
| Q037 sequential-test review | Acceptance/rejection text intersected the likelihood line. Moved the boundary labels to a separate legend, retaining the dashed-line distinction and thresholds. |
| Other evidence visuals | Inspected all 45 question figures in light and dark palettes and all 27 baseline review plots. All 88 exhibits retain headings/captions and data alternatives. Three additional review tools are numeric-only. Corrected plots were rendered again and inspected. |
| Review tools | All 30 start collapsed. Every select choice and each slider minimum/default/maximum produces nonempty finite output, retains accessible SVG descriptions, resets correctly, and leaves question data unchanged. Production-player checks also preserve the original score. |
| Student flow | Full, Quick, Focused, answer reveal, completed review, retry, switching sets, and fallback presentation retain their existing regression coverage. Explanations and explorers remain unavailable as unintended hints during the live attempt. |

## Coverage and preservation

- Final domain counts remain **29/25/35/35/26**; answer positions remain **37/38/37/38**.
- Set 2 remains 150 questions, 43 table-only exhibits, 45 question figures, and 30 review tools. Set 1 and Set 3 source/presentation files are untouched.
- The [revision ledger](cre-set2-final-audit-revisions.json) records exact before/after values for 41 option edits and Q026's explanation. Tests validate each corrected value, reverse only those recorded fields in a copy, and verify every historical batch hash plus the complete 150-item baseline hash. Unlisted changes cannot silently pass the locks.
- No production deployment, merge, access change, database write, workflow change, or unrelated lesson edit is part of this audit.

## Verification and limits

The explanation and annotation regressions were first run against the old source and failed on Q026's malformed tag and Q018's in-plot annotation. They pass after correction. The Set 2 suite now has 24 tests. The broader scoped suites and site build are run before publication; exact local and hosted results are recorded in the PR.

The existing Chromium/WebKit audit visits every question at 1536px and 390px, in light and dark themes, and exercises all review tools. It now also checks every visible question-figure text bounding box against its SVG viewport and verifies Q026's restored explanation. Wide exhibits intentionally scroll inside labeled, keyboard-focusable regions instead of shrinking all labels on phones.

SVG inspection used the actual theme colors with a local sans-serif font; hosted browser checks cover the page's rendered layout. External MathJax is blocked by the browser fixture. Typesetting requests and source integrity are verified, but actual authenticated-page MathJax glyph layout remains unverified. Difficulty calibration, item discrimination, and timing should be evaluated later using candidate responses; no such dataset was available for this audit.
