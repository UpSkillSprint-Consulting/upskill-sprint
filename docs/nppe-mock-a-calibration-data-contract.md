# NPPE Mock A offline calibration — response contract

Status: **research preparation only**. Does not collect production telemetry and does not provide NPPE pass thresholds or release authorization.

## Runbook

1. On a trusted local checkout at the approved, pinned source revision, run `node scripts/nppe-mock-a-review-packets.cjs --out /private/nppe-review-empty`. The destination must be an empty directory **outside this repository**.
2. Keep `restricted-keyed/questions.json`, `manifest.json` and candidate data access-controlled. Never commit any generated review packet or attempt data. Send only `blind/questions.json` to blind reviewers; do not reveal scoring roles.
3. After obtaining consent and an appropriate privacy/data-retention plan, create an array of offline attempt objects matching the contract below. These must be genuinely collected consented observations for empirical conclusions; synthetic fixtures are strictly for testing.
4. Run `node scripts/nppe-calibrate.cjs /private/nppe-review-empty/manifest.json /private/nppe-review-empty/restricted-keyed/questions.json /private/attempts.json /private/calibration-report.json`.
5. Review output with a qualified psychometric specialist. Version-pin all decisions; revise and re-review material changes. Never auto-approve release from any numeric result.

## Input JSON structure

```json
[
  {
    "attemptId": "pseudonymous-random-identifier",
    "cohort": "first_unassisted",
    "formRevision": "exact Git commit SHA from manifest",
    "responses": [
      {
        "itemId": "NPPE-171",
        "version": 2,
        "status": "answered",
        "answer": 1,
        "seconds": 42
      }
    ]
  }
]
```

Each attempt must record **all 110 item statuses**. Status is `answered`, `omitted` (item reached, unanswered), or `not_reached` (item never reached). For non-answered items set `answer:null`; `seconds` may be omitted. Zero-based answers must be integers 0–3. Version must equal the keyed packet and every attempt must use the exact pinned form revision. Records with missing, duplicate or unknown item IDs, invalid answers, duplicate attempt IDs, unsupported cohort, or mismatched form revision are rejected.

Cohorts: `first_unassisted` (primary), `repeat`, `assisted`, `prior_exposure`, `accommodated`, `incomplete`. This intentionally conservative primary cohort treats accommodated attempts separately for an initial descriptive report; accommodations are not evidence of poor performance and must not be used to exclude eligible candidates from an actual validity study. Define cohort rules with a psychometric specialist and assess supported inclusion/fairness appropriately.

**No names, email addresses, IP addresses, official NPPE marks, personal identifiers or detailed accommodation diagnoses are required.** Use pseudonyms stored separately from any consent records. Restrict access, set retention periods, and respect applicable privacy laws.

## Outputs and statistical limitations

For each item: number of first-unassisted attempts, number answered, correct count, proportion correct among answered, Wilson 95% interval, selection frequencies for all four options, omitted/not-reached counts, average answer duration when reported, and a corrected item-rest correlation calculated over answered responses on scored items. All ten simulated unscored items are excluded from scored totals, item-rest relationships and KR-20 reliability, but are described individually.

KR-20 is calculated only for at least three fully answered first-unassisted scored forms with nonzero observed total-score variance; otherwise null. Correlations require at least three valid pairs and nonzero variance. Null means undefined/insufficient evidence, **not zero performance**. Confidence intervals are descriptive binomial approximations with uncertainty under nonrandom recruitment; they are not proof of validity. A zero-variance sample is not a signal to manufacture spread.

An item-total analysis computed across a partially speeded assessment, varying candidate abilities or convenience sample can be misleading. Missingness, item exposure, demographics/fairness, scoring comparability, reliability uncertainty, and target-population representativeness require additional psychometric review. Never compare these proportions or KR-20 directly with official NPPE scaled-score decisions.

## QA

`node --test tests/nppe-mock-a-review-packets.test.js tests/nppe-calibrate.test.js`

The NPPE validation workflow also runs these tests. Synthetic examples used in tests are not real pilot observations. Review output is generated locally; CI does **not** upload keyed packets as build artifacts.
