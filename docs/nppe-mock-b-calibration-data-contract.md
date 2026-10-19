# Mock B — offline candidate-response calibration data contract

**Status: PREPARATION ONLY. No real candidate responses have been collected, no empirical calibration has occurred, and no release authorization follows from passing these tests.** Form: `set-1-mock-b`, original NPPE-281–390, **100 scored / 10 simulated unscored**.

## Secure preparation

1. Obtain independent technical/legal SME and item-writing reviews, address material findings, and pin the exact approved candidate-facing `sourceRevision` before recruitment. Avoid changing the items while collecting data; version any amendments as a separate form.
2. In a clean trusted checkout at that revision, generate review materials with `node scripts/nppe-mock-b-review-packets.cjs --out /secure/private/empty-mock-b-review`. Keep the resulting manifest and keyed packet privately access-controlled. Never commit or upload answer keys, review packets or candidate-response files to this public repository.
3. Obtain prospective, specific consent and a data governance plan, including target NPPE candidate eligibility, response/identifier separation, participant withdrawal rules, opt-in accommodation handling, retention/deletion, safe storage, cross-border processing, and permissible psychometric analysis. A source checkout or a Supabase account does **not** authorize collecting production telemetry.
4. Agree on primary analysis population, sample size and precision plan with a qualified psychometrician. Cognitive interviews/usability work precedes larger pilot field administration. Keep first unassisted responses separately from repeats, previously exposed/assisted attempts, partial attempts and accommodated conditions; accommodation status alone must not be interpreted as poor ability.
5. Collect **one response record for each of all 110 items**, not merely scored items. Record observed ordering, actual form revision and all item versions, but never include credentials, names, phone numbers, DOB, IP addresses, official NPPE scores, full accessibility diagnoses or unnecessary personal data.

## Input contract

The offline calibration engine `scripts/nppe-calibrate.cjs` takes a pinned `manifest.json`, a separately access-controlled `restricted-keyed/questions.json`, and one JSON array of pseudonymous attempt records:

```json
[
  {
    "attemptId": "random-pseudonymous-token",
    "cohort": "first_unassisted",
    "formRevision": "<exact Git commit SHA from the manifest>",
    "responses": [
      {
        "itemId": "NPPE-281",
        "version": 3,
        "status": "answered",
        "answer": 1,
        "seconds": 64
      },
      {
        "itemId": "NPPE-282",
        "version": 4,
        "status": "omitted",
        "answer": null
      }
    ]
  }
]
```

The sample above shows *structure only*. It is **not a complete attempt** and will intentionally fail input validation until entries for every remaining NPPE-283–390 are supplied. All versions shown are illustrations; the actual version must be read from the restricted keyed packet, not assumed.

- `cohort`: one of `first_unassisted`, `repeat`, `assisted`, `prior_exposure`, `accommodated`, `incomplete`.
- `status`: `answered`, `omitted` (reached and unanswered), or `not_reached` (not presented/reached). On omitted/not-reached, `answer:null`. On answered, `answer` must be a zero-based integer 0–3.
- `seconds`: optional finite nonnegative item time; avoid impossible durations and do not infer intent from time alone.
- Every `attemptId` must be unique and non-identifying; `formRevision` must equal the manifest; each item ID/version must match a unique keyed and hashed manifest entry. Exactly 110 unique response entries per attempt are required.

The current simulator's experimental status is **simulated unscored**, not a field trial completed by PMI, NPPE administrators or this project. Do not show scoring role to a candidate during the attempt. Scoring and psychometric aggregation include **only the 100 scored items**; the other ten can be descriptively reviewed.

## Execute offline — only after consent and real observations exist

```sh
node scripts/nppe-calibrate.cjs \
  /secure/private/empty-mock-b-review/manifest.json \
  /secure/private/empty-mock-b-review/restricted-keyed/questions.json \
  /secure/private/consented-attempts.json \
  /secure/private/mock-b-descriptive-analysis.json
```

The engine **refuses overwriting an existing output** and reports descriptive CTT statistics only. The use of a generic offline engine across Mock A/B is intentional; it reads the pinned manifest and question versions rather than hard-coding NPPE-171–280.

It computes item-level answer counts, proportions correct among answered, approximate Wilson 95% confidence intervals, A/B/C/D selection counts, omitted versus not reached, mean reported answering time, and corrected item-rest correlations for scored items on comparable completely answered first-unassisted forms. It reports form-level KR-20 only where the minimum sample and nonzero variance criteria are met. When insufficient/undefined, results are **null, not zero**.

The observed percent-correct, item-rest, speediness, distractor choice distributions, reliability and sampling uncertainty must be evaluated in context by a psychometric specialist. Convenience samples, speeded endings, prior exposure, accessibility accommodations and small subgroups can distort outcomes. No raw-score passing threshold or official NPPE scaled-score equivalence may be derived from these results.

## Automated synthetic QA (not calibration evidence)

`tests/nppe-mock-b-calibration-contract.test.js` uses *only synthetic responses* to verify:
- Exactly 110 records and the 100/10 role split
- Exclusion of simulated unscored items from reliability/item-rest calculations
- Manifest SHA-256 and item-version matching
- Rejection of stale form revisions, invalid responses and tiny/constant samples
- No invented empirical statistics from a single record

The task is **not complete** when these tests pass; it is ready only for an approved human-reviewed pilot. Retain private reports securely, document permitted distribution, and destroy according to the approved retention policy.

## Blocking release gates

Independent engineering/geoscience SME review, qualified Canadian-law review including primary effective dates, categorical distractor and one-best-answer adjudication, manual accessibility confirmation, authorized learner/admin request–grant–practice–revoke verification, consented pilot/calibration, and explicit release authorization are all **PENDING**. No source document or synthetic test result provides a substitute.

**Keep PR #301 draft/unmerged. Preserve release holds for both Mock A and Mock B. No production grants, migrations, deployments or data collection.**
