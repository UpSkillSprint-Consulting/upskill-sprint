# Material Specification Lookup — User Validation and Technical Assessment

Date: 2026-09-18

Route: `/engineering-tools/grade-specification-lookup/`

Scope: authenticated desktop journey, selection and search, compliance screening, batch mapping, calculators, reverse lookup, diagnostics, accessibility, source-data provenance, and user guide.

## Outcome

The original compliance flow was not safe to release as a decision aid: an empty form returned `PASS`, and a single Charpy result could be treated as a conforming set. The hardened implementation now distinguishes `INCOMPLETE`, `INVALID INPUT`, `FAIL`, `PASS WITH WARNINGS`, and `PASS`; it cannot return a passing state while applicable inputs are missing.

The embedded numerical dataset is still screening data, not a controlled specification. None of its 257 grade records or 12,659 machine-readable requirement records carries independent-verification metadata. A numerically conforming complete result therefore returns `PASS WITH WARNINGS` at best until the involved records are audited.

## User journeys assessed

| Journey | Before | Resolution |
|---|---|---|
| Authentication and route access | Sign-in gate works | Retained |
| Empty compliance form | Incorrect clean `PASS` | `INCOMPLETE`, with required/provided/missing coverage and a missing-input list |
| Partial chemistry or mechanical entry | Evaluated only entered fields and could imply success | All applicable inputs are now required before a complete verdict |
| One Charpy specimen | Average and minimum calculated from one result | Exactly three results are required; partial sets never receive energy acceptance rows |
| Charpy temperature above requirement | Warning only | Warmer than the maximum permitted temperature is `FAIL`; equal or colder is `PASS` for that row |
| Custom Charpy width | Proportional factor could receive a compliance status | Estimate-only; no automatic compliance status |
| DWTT | Requirements displayed but ignored by the checker | OD applicability, average shear, and maximum test temperature are checked |
| Reverse lookup | Mixed plate, sheet, structural, and pipe products | Product-form filter defaults to the active form; form and data status appear in results |
| Temperature-only reverse criterion | Ignored unless CVN energy was also entered | Applied independently |
| Physical input validation | Implausible values were warnings | Impossible/out-of-domain values produce `INVALID INPUT` |
| Saved reports | Earlier unsafe verdicts persisted | Compliance storage key versioned, invalidating old saved verdicts |
| Data diagnostics | Reported zero warnings despite a fully unaudited dataset | Aggregated unverified-data and superseded-edition warnings |
| API PSL2 M designations | X60M/X65M/X70M display labels omitted `M` | L415M/X60M, L450M/X65M, and L485M/X70M corrected consistently |
| Keyboard and assistive technology | Tabs/toggles/search lacked state semantics | Tablist/tabpanel, selected/pressed/expanded state, combobox/listbox, and live-result semantics added |
| Terminology | “Wall thickness” shown for plate and sheet | General context now uses “material thickness”; hydrotest retains “wall thickness” |

## Data-edition assessment

- Embedded API data identifies API 5L, 46th Edition (2018). API's official store now identifies API Spec 5L, 47th Edition. Current source: <https://www.apiwebstore.org/standards/5L>
- Embedded CSA line-pipe data identifies CSA Z245.1:22. CSA identifies CSA Z245.1:26 as the 12th edition and states that it supersedes the 2022 edition. Current source: <https://www.csagroup.org/store/product/CSA_Z245.1:26/>
- CSA G40.20/G40.21 records identify the R2023 reaffirmation. Official source: <https://www.csagroup.org/store/product/G40.20-13-G40.21-13/>
- ASTM records span several older embedded editions. They remain explicitly unaudited and must be checked against the user's controlled documents before use.

No paywalled standard values were guessed or silently substituted. The safer correction is to surface the edition state, prevent clean acceptance from unaudited values, and require controlled-document confirmation.

## Regression acceptance criteria

Automated coverage verifies:

1. The generated application boots with zero runtime errors.
2. Dataset diagnostics report zero structural errors and the expected three aggregate warnings.
3. Empty compliance input is `INCOMPLETE`, never `PASS`.
4. A partial Charpy set cannot create average/minimum acceptance rows.
5. A warmer Charpy test fails and an equal/colder test passes the temperature row.
6. Custom Charpy sizing remains estimate-only.
7. Physically invalid inputs produce `INVALID INPUT`.
8. DWTT applicability and result checks execute.
9. Reverse lookup filters product form and applies a temperature-only criterion.
10. Corrected API M-grade names render.
11. Extended validation detects malformed bound direction and verification types.
12. Core interactive controls expose accessible state.
13. The user guide documents the hardened behavior and data limitations.

## Remaining release limitation

The application is suitable for screening after these changes, but it is not suitable as the sole basis for material acceptance, substitution, purchasing, or disposition. Production-grade use requires a licensed, controlled-edition audit of every involved numerical requirement and clause reference, recorded through `lastVerifiedBy`, `lastVerifiedDate`, and `verified: true` only after evidence review.
