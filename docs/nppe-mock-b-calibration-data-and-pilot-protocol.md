# NPPE Mock B — candidate pilot and psychometric calibration protocol

**Status:** STUDY DESIGN AND OFFLINE VALIDATION ONLY. **Zero empirical Mock B candidate observations have been collected or analyzed.** No pass threshold, equating claim, independent approval or release authorization follows from this document.

## Dependencies before recruitment

The pilot must not start until human engineering/geoscience and Canadian-law reviewers have signed off on the **same item versions** that the candidate will see; the categorical-language distractor cue must be adjudicated; manual accessibility and applicable accommodations must be evaluated; and the owner, privacy lead and qualified psychometrician approve recruitment, consent, security, scope and retention. Mock B stays `releaseHold:true` in production and PR #301 stays draft/unmerged. An isolated, explicitly authorized pilot system must not expose the unapproved bank to ordinary learners.

Current locked model: **NPPE-281–390**, 110 total, 100 provisionally scored, 10 **simulated** unscored (NPPE-282, 296, 320, 337, 349, 355, 382, 386, 389, 390), time limit **150 minutes**, six-domain scored targets **8 / 20 / 30 / 26 / 8 / 8**. These ten items are not truly field-calibrated merely because `experimental:true` is present.

## Consent and privacy requirements

- Recruit from the intended NPPE-preparation population without claiming official affiliation, exam predictive validity or a fixed success threshold.
- Obtain written informed consent describing purpose, voluntary participation, stopping/withdrawal rules, de-identified analysis, retention, possible reviewer access and contact channel. Have an approved process for accessibility/accommodations; avoid collecting diagnosis in analysis records.
- Minimize data: pseudonymous attempt ID, pinned full form SHA/item IDs/item versions, options 0–3, reached/omitted/not reached, optional timing, cohort classification and only justified approved covariates. Store consent-to-ID linkage separately, do not include names/email/IP/medical records in the analysis file.
- Restrict protected answer keys, raw attempts, identity linkage and exact review packet to approved personnel; set access logs, a deletion schedule and cross-border storage/privacy-law controls. Do not commit private attempts to GitHub or upload as CI artifacts.

## Data format and version locking

Generate a **new private reviewer packet** on the exact approved Git SHA using:

```bash
node scripts/nppe-mock-b-review-packets.cjs --out /secure/private/nppe-mock-b-review
```

The exporter provides `manifest.json`, `restricted-keyed/questions.json` and separate blind review data. All study attempts must match that revision and **every item version**, regardless of whether the item is scored. Example (illustrative syntax only; not actual candidate data):

```json
[
  {
    "attemptId": "random-pseudonymous-id",
    "cohort": "first_unassisted",
    "formRevision": "exact-40-character-Git-commit-SHA",
    "responses": [
      {"itemId":"NPPE-281","version":3,"status":"answered","answer":1,"seconds":45}
    ]
  }
]
```

An actual attempt must contain **all 110** item statuses: `answered`, `omitted` (reached but unanswered), or `not_reached`. Nonanswered records use `answer:null`. The example above is intentionally abbreviated and **cannot** pass validation. Version values must come from the exact manifest, not the illustrative number shown. Valid cohorts: `first_unassisted` (primary), `repeat`, `assisted`, `prior_exposure`, `accommodated`, `incomplete`. A qualified psychometrician must review inclusion rules; accommodated candidates must not be regarded as invalid or inferior.

## Offline analysis (never a production write)

After obtaining **genuine consented responses**, use the existing tested descriptive calibration engine:

```bash
node scripts/nppe-calibrate.cjs \
  /secure/private/nppe-mock-b-review/manifest.json \
  /secure/private/nppe-mock-b-review/restricted-keyed/questions.json \
  /secure/private/nppe-mock-b-candidate-attempts.json \
  /secure/private/nppe-mock-b-calibration-report.json
```

The engine rejects duplicate attempt/item IDs, stale form/item revisions, invalid answer values and missing status records. For each item it reports answered count, percent correct among answered, Wilson 95% descriptive interval, selection frequencies for four alternatives, omission/non-reach counts, observed duration where supplied, and corrected item-rest discrimination among complete scored forms. It calculates KR-20 only when the required sample size and nonzero score variance permit; otherwise values are **null**, not zero.

**100 scored items only** contribute to score totals, item-rest discrimination and KR-20 reliability. Ten simulated-unscored items may be described individually but must not influence score denominators. Analyses cannot infer official NPPE equated scaled scores, official pass/fail or candidate eligibility.

## Psychometric analysis plan (requires qualified approval)

Before the pilot, pre-register the target candidate population, recruitment quotas, planned cohort size and precision/uncertainty, accommodations/inclusion, repeated exposure policy, sample-size justification, missingness and speededness analyses, and interim/stop decisions. Do **not** invent a fixed numeric sample threshold as if it were an NPPE rule. A small convenience sample is not representative by default.

Assessment phases:
1. **Cognitive interviews and usability pilot:** ask participants to explain the stem, reasoning and interpretation of four alternatives; systematically document confusing terminology, plausible distractors and accessible presentation.
2. **Consented field trial:** first unassisted administration of the pinned form under recorded conditions; preserve omissions and not-reached separately; record any version or exposure differences.
3. **Item diagnostics:** response probability and interval, corrected item-rest, distractor functioning, unusual response distributions, response time, systematic guessing clues and subgroup/fairness patterns where sample support permits.
4. **Form diagnostics:** KR-20 with caveats, domain performance, speededness, score reliability uncertainty, score variance, potential dependence/overlap and sensitivity to exclusions or accommodations.
5. **Adjudication:** technical SME/Canadian-law reviewers reconsider any flagged items, update wording/version when necessary, and revalidate revised items; previously collected data cannot be silently pooled across materially different versions.
6. **External sign-off:** reviewer/reliability evidence plus manual accessibility, privacy/deletion and real permitted account checks are recorded. An owner issues any eventual release decision separately.

The existing calibration library is descriptive classical test theory (CTT); high-stakes validity evidence, equating and NPPE-specific item response modelling require professional research design beyond its outputs.

## Test fixtures vs empirical evidence

`tests/nppe-mock-b-calibration-contract.test.js` tests the scoring and manifest contract with **synthetic fixture records**, including one-attempt zero-variance conditions and stale revision rejection. These data **are not candidates**, the tests do not collect personal information and cannot establish item performance.

**Calibration gate disposition:** pending authorized recruitment, consent, actual observations and qualified psychometric review. Releasing Mock A or Mock B or changing a production grant solely on synthetic or preliminary CTT results is prohibited.
