# ASQ MBB 160-question bank

## Scope and release rule

This bank is a new, original 160-question simulation built to the current ASQ Certified Master Black Belt Body of Knowledge. It is separate from the published 100-question source-backed simulation and from the excluded 100-question practice examination. Until all 160 questions pass review, `test-bank-mbb-set2.js` remains intentionally absent from `test-bank.html`; incomplete batches cannot appear in the learner set picker or any random draw.

The governing blueprint was frozen on 2026-09-02 from the [official ASQ CMBB Body of Knowledge](https://www.asq.org/cert/resource/pdf/certification/cmbb-cert-insert.pdf). The six domain weights are 20%, 20%, 15%, 10%, 10%, and 25%. The [official ASQ CMBB exam page](https://www.asq.org/cert/master-black-belt) remains the delivery-format reference. The project source `SPEC DATA SCHEMA.md` is explicitly excluded from question content and evidence.

## Batch plan

The user-approved cadence is six 25-question batches followed by a final 10-question batch. The allocation below preserves the exact 160-question blueprint and an exactly balanced A-D answer key.

| Batch | Enterprise | Organization | Portfolio | Training | Coaching | Analytics | Total | A / B / C / D | Visuals | Interactive |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 5 | 5 | 4 | 2 | 2 | 7 | 25 | 7 / 6 / 6 / 6 | 10 | 3 |
| 2 | 5 | 5 | 4 | 3 | 3 | 5 | 25 | 6 / 7 / 6 / 6 | 9 | 3 |
| 3 | 5 | 5 | 4 | 2 | 2 | 7 | 25 | 6 / 6 / 7 / 6 | 10 | 3 |
| 4 | 5 | 5 | 4 | 3 | 3 | 5 | 25 | 6 / 6 / 6 / 7 | 9 | 3 |
| 5 | 5 | 5 | 4 | 2 | 2 | 7 | 25 | 7 / 6 / 6 / 6 | 10 | 3 |
| 6 | 5 | 5 | 4 | 3 | 3 | 5 | 25 | 6 / 7 / 6 / 6 | 9 | 3 |
| 7 | 2 | 2 | 0 | 1 | 1 | 4 | 10 | 2 / 2 / 3 / 3 | 3 | 2 |
| **Total** | **32** | **32** | **24** | **16** | **16** | **40** | **160** | **40 / 40 / 40 / 40** | **60** | **20** |

## Batch 1 inventory

Batch 1 contains 25 original questions. Its difficulty mix is 9 Hard, 11 Very Hard, and 5 Expert. Its cognition mix is 2 Understand, 5 Apply, 8 Analyze, 6 Evaluate, and 4 Create. Correct-option length ranks are deliberately balanced 7/6/6/6 from longest to shortest to remove a common answer-length cue.

| Q | Domain | Topic | Difficulty | Cognition | Key | Visual | Source pages |
|---:|---|---|---|---|:---:|---|---|
| 001 | Enterprise | Hoshin Kanri and catchball | Very Hard | Apply | C | Data table | Kubiak 7-12 |
| 002 | Enterprise | Strategic project alignment | Hard | Analyze | A | — | Kubiak 23-27 |
| 003 | Enterprise | Deployment maturity and governance | Very Hard | Apply | D | — | Kubiak 28-52 |
| 004 | Enterprise | Integrated DMAIC, DMADV, Lean, and TOC | Expert | Apply | B | — | Kubiak 53-69 |
| 005 | Enterprise | Pipeline capacity, value, and risk | Expert | Create | A | Portfolio table + capacity slider | Kubiak 88-99 |
| 006 | Organization | Systems thinking and unintended effects | Very Hard | Analyze | D | — | Kubiak 100-103 |
| 007 | Organization | Executive deployment responsibilities | Hard | Analyze | B | — | Kubiak 183-190 |
| 008 | Organization | Situational intervention and influence | Very Hard | Apply | C | — | Kubiak 169-176 |
| 009 | Organization | Culture change and aligned rewards | Hard | Apply | A | — | Kubiak 108-125 |
| 010 | Organization | Balanced leading and lagging measures | Very Hard | Analyze | D | — | Kubiak 126-143 |
| 011 | Portfolio | Integrated project oversight and change control | Hard | Evaluate | B | — | Kubiak 202-211 |
| 012 | Portfolio | Project dependencies and sequencing | Expert | Evaluate | C | Activity network | Kubiak 196-200 |
| 013 | Portfolio | Time-phased supply/demand management | Very Hard | Create | A | — | Kubiak 217-218 |
| 014 | Portfolio | NPV and benefit realization | Very Hard | Evaluate | D | — | Kubiak 141-143, 225-232 |
| 015 | Training | Role-specific needs analysis | Hard | Evaluate | B | Needs matrix | Kubiak 236-244 |
| 016 | Training | Evaluation and isolation of training effects | Very Hard | Create | C | — | Kubiak 285-292 |
| 017 | Coaching | Constructive executive feedback | Hard | Evaluate | A | — | Kubiak 304-305 |
| 018 | Coaching | Recovery of a failing Belt project | Expert | Create | D | — | Kubiak 306-314 |
| 019 | Analytics | Propagation of measurement error | Very Hard | Evaluate | B | Input table | Kubiak 318-321 |
| 020 | Analytics | Multiple-regression residual diagnostics | Expert | Analyze | A | Focusable scatterplot with hover details | Kubiak 370-383, 400-402 |
| 021 | Analytics | APC used with SPC | Very Hard | Understand | C | — | Kubiak 451-453 |
| 022 | Analytics | Split-plot design recognition | Hard | Understand | B | DOE run matrix | Kubiak 449-450 |
| 023 | Analytics | Autocorrelation, ARIMA, and residual monitoring | Very Hard | Analyze | D | Focusable time series with hover details | Kubiak 353-373; Advanced Tools 381-405 |
| 024 | Analytics | Binary logistic-regression interpretation | Hard | Analyze | A | Model-output table | Advanced Tools 181-193; Kubiak 384-392 |
| 025 | Analytics | Variance components and nested studies | Hard | Analyze | C | Variance table | Kubiak 408-414; Advanced Tools 73-83 |

## Visual evidence and accessibility

Ten Batch 1 questions have retained, independently reviewable visual packages in `test-bank-assets/mbb-160/batch-01/`:

- `datasets.json` contains the exact underlying chart and table data with stable SHA-256 hashes.
- `visual-specs.json` documents renderer, variables, transformations, calculations, reference lines, responsive behavior, accessibility, interaction purpose, and neutral answer-cue policy.
- `validation.json` records dataset linkage, rendering, labels, scales/units, breakpoint review, static fallback, accessibility, and answer-cue checks.
- `static-fallbacks.html` renders all ten questions as a responsive desktop/tablet/mobile alternative.

Questions 005, 020, and 023 provide the first interactive set: a capacity what-if slider and keyboard-focusable plotted points with hover details. All ten retain complete text alternatives. No visual labels, series colors, annotations, or controls reveal the keyed answer.

## Independent validation

`tests/test-bank-mbb-set2-batch1.test.js` enforces:

- exact batch, domain, answer, difficulty, cognition, visual, and interaction allocations;
- stable identities, complete metadata, four distinct options, one valid key, specific rationales, locatable source evidence, and excluded-format checks;
- balanced correct-option length ranks and bounded within-item option-length spread;
- independent recomputation of the activity network, both NPVs, propagated uncertainty, logistic odds ratio, and variance-component standard-deviation change;
- exact question-to-dataset hashes, construction records, responsive fallback linkage, neutral answer presentation, semantic HTML/SVG output, keyboard-focusable plot details, and capacity-slider bounds;
- no duplicate or suspicious near-duplicate stems within Batch 1 or against the existing 100-question MBB simulation.

The asset build is deterministic through `npm run build:mbb160-assets`. Batch 1 is also included in the deploy-preview test gate so later UI or renderer changes cannot silently invalidate it.
