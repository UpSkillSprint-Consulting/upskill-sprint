# ASQ MBB simulation question bank

## Published scope

The initial MBB simulation contains one set of 100 questions. It is sourced only from **“Simulated Examination Questions for Parts I–VI”** in the supplied copy of *The Certified Six Sigma Master Black Belt Handbook*. The separate 100-question **Practice Examination Questions for Parts I–VI** is intentionally excluded.

The simulation uses the source assessment's 150-minute limit. Each published item has four distinct choices, one integer answer index, a rationale, a stable `qid`, its original source question number, and a current MBB Body of Knowledge mapping.

## Body of Knowledge configuration

The readiness and study-plan engine uses these current MBB blueprint weights:

| Domain | Weight | Initial source-item count |
|---|---:|---:|
| I. Enterprise-Wide Planning | 20% | 14 |
| II. Organizational Competencies for Deployment | 20% | 21 |
| III. Project Portfolio Management | 15% | 22 |
| IV. Training Design and Delivery | 10% | 9 |
| V. Coaching and Mentoring Responsibilities | 10% | 8 |
| VI. Advanced Data Management and Analytic Methods | 25% | 26 |
| **Total** | **100%** | **100** |

The counts describe the supplied source assessment; they are not presented as an official ASQ sampling allocation. Readiness calculations use the configured blueprint weights, while the full initial simulation delivers all 100 source questions.

## Construction and retained provenance

The bank is generated with `scripts/import-mbb-simulation.mjs`. For the supplied PDF copy, the source text was extracted with:

```sh
pdftotext -f 674 -l 698 -layout \
  "The Certified Six Sigma Master Black Belt (T. M. Kubiak).pdf" mbb-simulation.txt
node scripts/import-mbb-simulation.mjs mbb-simulation.txt test-bank-mbb-set1.js
```

The generated question schema retains:

| Field | Purpose |
|---|---|
| `qid` | Stable identity in the form `mbb:set-1:source-N` |
| `sourceDocument` | Supplied handbook title |
| `sourceAssessment` | Confirms the simulated examination—not the practice examination |
| `sourceQuestion` | Original question number 1–100 |
| `sourceAnswer` | Original answer-key letter before normalization |
| `sub` | Current MBB Body of Knowledge mapping |
| `chart` | Structured visual data when the source item depends on a table |

The importer removes extraction artifacts, converts every item to four answer choices, and replaces combination, “all of the above,” and “none of the above” formats. Explicit repairs are kept in the importer so they are reviewable and repeatable. These include an impossible VIF below 1, an ambiguous team-stage item, discrete-versus-continuous MSA terminology, and source keys that depended on missing “none of the above” choices.

## Visual construction data

Two questions depend on source tables. Both use the shared responsive `data-table` renderer, which produces semantic HTML table headers and rows and does not encode the correct answer through color or annotation.

### Question 76: method-selection assumptions

| Assumption | Tool 1 | Tool 2 |
|---|---|---|
| Classification scale | Nominal categories | Ordered, equally spaced ratings |
| Category use | Some categories may occur more often | Ranges such as −2, −1, 0, 1, 2 |
| Raters | Classify independently | Classify independently |
| Categories | Mutually exclusive and exhaustive | Mutually exclusive and exhaustive |
| Decision impact | Misclassification distance not specified | Misclassification consequences matter |

Construction: the source's two-column bullet layout was transcribed into `chart.columns` and `chart.rows`. The item asks the learner to identify kappa for Tool 1 and an intraclass correlation coefficient for Tool 2.

### Question 91: simplex tableau

| Basis | RHS | x1 | x2 | x3 | x4 | x5 |
|---|---:|---:|---:|---:|---:|---:|
| Z | $52,000 | 0 | 0 | 0.90 | 0.60 | 0 |
| x5 | $84,000 | 0 | 0 | 0.50 | −1.00 | 1 |
| x2 | $67,000 | 0 | 1 | 0.75 | −0.50 | 0 |
| x1 | $70,000 | 1 | 0 | −0.50 | 1.00 | 0 |

Construction: the values are retained in `chart.columns` and `chart.rows`. The stem explicitly supplies the pivot convention. The largest positive reduced cost selects x3; the positive-ratio test selects x2 to leave.

## Independent validation

`tests/test-bank-mbb-set1.test.js` verifies the source boundary, exact count and numbering, stable identities, four-choice structure, distinct options, valid answer indices, six-domain mapping, explanations, absence of extraction artifacts, repaired source defects, visual datasets, semantic rendering, and the live simulation controls. The global question-identity and test-bank page suites also include MBB, and the MBB suite is part of the deploy-preview gate.

