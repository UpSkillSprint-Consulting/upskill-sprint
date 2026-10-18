# NPPE Mock A — independent review and calibration preparation

Status: **PREPARATION ONLY — NOT INDEPENDENT APPROVAL**. Source branch `codex/nppe-three-set-architecture`, baseline `a66195499d2fb8b6d073d4a682d4e858605591df`. The authoritative item text and versions remain in the eleven Mock A batch modules. This document does not publish answer keys.

## Release controls

Mock A remains held. Do not merge, deploy, grant access, or remove `releaseHold:true`. No human reviewer has signed off, no candidate observations have been collected, and no official NPPE score equivalence is asserted.

## Reviewer workflow

1. Pin the exact commit and record the item ID, version and SHA-256 of each canonical item payload before generating packets. Produce a **blind packet** containing item ID, stem, options, jurisdiction and blueprint tag, but no keys, rationales or answer cues.
2. Produce a **separate restricted keyed packet** containing each answer, four option rationales, source title, locator, URL and item version. Do not place either packet in public-site assets or a public repository where confidentiality is required; the current repository itself is public.
3. Independently assess each of NPPE-171–280. Record reviewer name/role, professional qualifications, jurisdictional expertise, independence and conflict declaration, review date, reviewed revision, sources actually examined and limitations.
4. For each item record one-best-answer defensibility, distractor plausibility, legal currency and jurisdiction, source strength, blueprint fit, fairness, accessibility, overlap, difficulty/cognition assessment, reviewer notes, evidence locator and disposition: `pending`, `retain`, `revise`, `reject`, `adjudication_required`.
5. Severity: **critical** = unsafe/wrong legal proposition or multiple defensible keys; **major** = materially misleading or inaccessible; **minor** = nonmaterial clarity/copy; **observation** = improvement opportunity. Critical and major findings block release.
6. Resolve disagreements through a documented second independent reviewer and adjudicator, retaining both original opinions. Substantive changes increment item version and require renewed content/legal review and regression tests. An AI-generated opinion never counts as independent human approval.

## Source-access follow-up ledger

Every entry below is **pending direct primary-source confirmation**, unless separately evidenced by a reviewer. Record retrieval date, effective version, primary full text versus official indexed excerpt versus regulator reproduction, the exact proposition, uncertainty and reviewer decision.

| Items | Priority source/proposition | Jurisdiction | Status |
|---|---|---|---|
| 185, 256 | Southcott Estates, mitigation, paras 24–25 | Canada | pending |
| 186 | Limitations Act, 2002, ultimate period | Ontario | pending |
| 193, 252 | O. Reg. 941, attribution and commissions | Ontario | pending |
| 197 | Civil Code of Québec, art. 1470 | Quebec | pending |
| 206 | Sable Offshore, settlement privilege | Canada | pending |
| 208 | Occupational Health and Safety Act, work refusal disclosure | Ontario | pending |
| 224 | EGBC document retention and legal hold | British Columbia | pending |
| 237 | Haida Nation, consultation | Canada | pending |
| 238 | Guarantee Co. v. Gordon Capital, accrued rights | Canada | pending |
| 245 | NRCan flood terminology | Canada | pending |
| 248 | Arbitration Act, disclosure | Ontario | pending |
| 269 | Professional Engineers Act, offering services | Ontario | pending |

The whole-form audit and individual item source metadata control the precise URLs and locators. No entry is resolved solely because a link exists. Reconfirm the published NPPE blueprint version before legal/blueprint sign-off.

## Empirical calibration protocol (proposal; requires psychometric approval)

**Stages:** expert review → consented cognitive interviews/usability pilot → eligible target-candidate field trial → item/statistical analysis → review/revalidation after material changes. Define recruitment, inclusion criteria, consent, withdrawal, data retention and access controls before collection. Collect only minimal pseudonymous attempt identifiers, pinned form/item versions, answer selections, reached/omitted status, timestamps/durations and necessary consented covariates. Do not collect production telemetry without authorization.

Primary analysis: first unassisted exposure to the pinned form. Separately report repeats, prior exposure, assisted attempts, accommodations, incomplete attempts and any exclusions. Distinguish omitted questions reached but unanswered from not-reached questions. Preserve all ten simulated unscored items as unscored; their label is not evidence of field testing.

Report sample sizes and missingness for every metric. For each item, estimate proportion correct with uncertainty interval, corrected item-rest correlation using other **scored** items, distractor frequencies, omission and not-reached rates and response times. For the 100 scored items, estimate reliability (e.g., KR-20/alpha where assumptions hold) with uncertainty and caution about speededness, multidimensionality and restricted samples. Fairness/subgroup analysis requires consent, adequate sample sizes and privacy protections; avoid conclusions from sparse cells. For tiny samples or zero variance, output `insufficient_data` or `undefined`, not misleading zeroes.

Set sample-size targets based on desired precision, feasible recruitment and psychometric consultation, not an invented NPPE mandate. Neither a threshold nor an observed coefficient automatically authorizes release. Synthetic test records validate software only, not exam calibration.

## Accessibility and production gates

Investigate raw axe incomplete records for account menu ARIA state/relationships and navigation-indicator contrast. Test keyboard focus, menu opening/closing, state announcements, screen reader interaction, 200%/400% zoom, reflow, review cards and both themes. Preserve incomplete evidence until manually resolved; zero reported axe violations is not WCAG certification.

After explicit authorization only, test with a real non-admin learner and admin: request → administrator grant → attempt/review → expiry/revocation → denied access. Capture environment, revision, role, access decisions, cleanup and evidence without recording credentials. Fixture results are not production evidence.

## Gate register

| Gate | Status |
|---|---|
| Author/editor whole-form review | completed in earlier audit |
| Automated functional/security QA | passed at prior head; recheck after changes |
| Independent engineering/geoscience SME | pending |
| Independent Canadian-law review | pending |
| Primary-source access resolution | pending |
| Manual accessibility | pending |
| Consented empirical calibration | pending |
| Production-account verification | pending |
| Explicit release authorization | pending |
