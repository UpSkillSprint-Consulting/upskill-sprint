# Material Specification Compliance Checker — validation and remediation assessment

**Assessment date:** 2026-09-18  
**Tool:** `/tools/material-specification-compliance-checker`  
**Scope:** front-to-back user journey, calculation engine, rule packages, imports, batch screening, statistics, approval, reporting, storage, security, accessibility, and documentation

## Outcome

The checker was not safe to treat as a conservative material-compliance screen in its previous form. Several incomplete or invalid assessments could produce a clean **Pass**, obsolete worked-example context could be mistaken for current requirements, and workflow/reporting paths could imply more authority than the evidence supported.

The remediated version now follows fail-safe decision semantics:

- **Pass** requires traceability, exact source and target editions, a verified controlled requirement source, applicable configured rules, valid actuals and limits, compatible units, clause-level evidence, and 100% assessed coverage.
- **Pass with warnings** means every numerical rule passes but an involved package or rule is not fully controlled and verified; it is not a release-quality clean pass.
- **Fail** means a valid entered actual is outside a valid entered acceptance rule, or mandatory process/certification evidence is explicitly absent.
- **Conditional** means evidence, applicability, traceability, source control, or engineering review is unresolved.
- **Invalid input** means a value, rule, bound, unit, date, or physical domain is invalid and no compliance verdict can be issued.
- **Not applicable** is used only when enough applicability evidence exists to prove a real scope mismatch. Missing applicability data is a review condition, not a silent exclusion.

## User journeys assessed

1. Start a blank manual assessment.
2. Define material identity, produced/source specification, target specification, product form, editions, and evidence status.
3. Enter chemistry, mechanical, Charpy, dimensional, and process/certification evidence.
4. Mix metric and imperial units and inspect conversion basis.
5. Add derived chemistry and tensile-ratio requirements.
6. Change inputs after running and verify that stale results disappear.
7. Load the worked example.
8. Save, load, import, export, and print an assessment.
9. Create, edit, copy, import, approve, and apply a rule package.
10. Import batch data, confirm mappings and units, screen records, and calculate statistics.
11. Compare one material against multiple packages.
12. Record review, engineering disposition, approval, locking, reports, and certificates.
13. Use local and signed-in storage paths.
14. Exercise keyboard/tab semantics, status announcements, labels, and locked-control behavior.

## Material defects found and corrected

| Area | Previous behavior / risk | Correction and acceptance condition |
|---|---|---|
| Clean-pass gate | Blank material identifiers, product form, editions, or clauses could still produce Pass. | Missing traceability, scope, edition, controlled-source verification, or row basis now produces Conditional; a clean Pass requires 100% coverage. |
| Default source control | Requirement status defaulted to “controlled,” even when the user had not verified it. | Default is now “Not yet verified.” The user must explicitly attest to a controlled copy. |
| Physical values | A negative carbon percentage could satisfy a maximum limit. | Physical-domain validation rejects negative strength, energy, length, hardness, ratio, and chemistry values; percentages are bounded to 0–100 and temperatures cannot be below absolute zero. |
| Invalid rules | A minimum greater than a maximum was treated as a material failure. | Reversed bounds and malformed limits now return Invalid input, keeping material disposition separate from configuration error. |
| Applicability | Missing product form, PSL, route, or thickness could silently exclude rules as not applicable. | Missing discriminators now create review rows. Only a proven mismatch is Not applicable. |
| Units | A missing imported actual unit could be assumed to equal the rule unit. | Missing or incompatible units are unresolved review/invalid conditions; only defined conversions are performed. |
| Evidence freshness | Editing an input could leave old Pass rows visible. | Any relevant input/change event immediately clears the calculated verdict and result rows. |
| Worked example | The example used named, dated standards and could return a clean Pass with stale context. | It is now clearly generic training data, uses a working/unverified rule set, does not auto-run, and cannot return a production Pass. |
| Derived values | CE, Pcm, and yield/tensile ratio could be omitted or inconsistently transcribed. | The checker calculates them from complete canonical inputs, applies the entered rule, and identifies the calculation in the result basis. |
| Charpy | Temperature unit and specimen-count assumptions were incomplete. | Actual and requirement temperatures have independent units; actual and required specimen counts are explicit and enforced alongside average and individual energy. |
| Package governance | Draft or unverified packages could return an unqualified Pass. | Package and rule verification state is propagated; unverified inputs produce Pass with warnings at best. Approved-package saving requires valid limits, units, applicability, clauses, dates, and unique properties. |
| Batch mapping | Fuzzy mappings could be accepted silently, duplicated destinations were possible, and thickness/width were hard-coded as mm. | Only exact aliases auto-map. Every used mapping and numeric unit must be explicitly confirmed, duplicate canonical mappings are blocked, and dimension units follow the confirmed import mapping. |
| Capability math | Overall sample variation was labelled Cpk, and Individuals limits used the wrong sigma basis. | Cpk/Cp now use the I-MR estimate `MR-bar / 1.128`; Ppk/Pp use overall sample standard deviation. The UI shows both estimates, the unit, sample-size/stability cautions, and I-chart limits. |
| Approval | Any workflow status or an override could effectively imply approval, and reviewer/approver separation was weak. | “Approved” cannot be selected manually. Approval requires the Approver role, different named reviewer and approver, final disposition, exact Pass, and 100% coverage. Overrides never change the calculated verdict. |
| Locking | Re-rendering the review panel could re-enable controls after approval. | Approved assessments disable core and lockable advanced inputs, including new overrides, while retaining report and authorized unlock controls. |
| Certificate | A certificate/report path could be opened without a fully approved clean assessment. | Screening certificate generation requires current 100% Pass plus approved-and-locked workflow state; other reports are visibly DRAFT. |
| Authentication/storage | Organization storage used a Netlify Identity path even though the site uses Supabase authentication. | Client and server now use the existing Supabase session. The function validates the bearer session, authorization entitlement, same-origin writes, payload size, and a per-user blob namespace. |
| Audit wording | Local browser history was described as immutable. | The interface now states that browser data can be cleared or altered and is not a regulated immutable record. |
| UI stability | The hardening observer rewrote unchanged content and could create a continuous animation-frame/mutation loop. | DOM rewrites occur only when values actually differ; regression coverage exercises platform startup and validation. |

## Accuracy controls and limits

The checker intentionally does **not** embed proprietary acceptance tables or assert grade equivalency. Its designation catalogue helps identify a standard/grade, but it is not an acceptance-limit database. A user must transcribe requirements from a legally obtained, controlled source and cite the applicable clause, table, note, footnote, purchase requirement, or customer document.

Edition labels are never inferred as current. Publisher pages can change, and the contract may require an older edition. The user guide now requires direct publisher verification of edition, amendments, errata, contract date, and customer-specific requirements. At assessment time, official publisher information showed, for example:

- [CSA Z245.1:26 — Steel pipe](https://www.csagroup.org/store/product/CSA_Z245.1:26/) as the 2026 edition, superseding the 2022 edition.
- [CSA G40.20-13/G40.21-13 (R2023)](https://www.csagroup.org/store/product/G40.20-13-G40.21-13/) as the 2013 edition reaffirmed in 2023.
- [API standards catalogue](https://www.apiwebstore.org/standards/5L) as the publisher source to verify API Spec 5L purchasing/current-edition information.

These links establish catalogue currency only. They do not provide or authorize copying proprietary requirement limits, and they do not determine which edition a purchase contract invokes.

## Verification evidence

Automated targeted verification passes **27 of 27 tests**. Coverage includes:

- engine boundaries and unit conversion;
- proven versus unresolved applicability;
- verified/draft package semantics;
- missing import units and ambiguous mappings;
- I-MR Cpk versus overall Ppk;
- blank and traceable clean-pass journeys;
- missing clause, negative chemistry, reversed bounds, and stale results;
- Charpy specimen count and automatic yield/tensile ratio;
- generic unresolved worked example;
- approval/certificate rejection, manual-status bypass prevention, and locked-control behavior;
- Supabase identity integration, strict bearer-token parsing, and same-origin write enforcement;
- built-in accessibility/label and load-order validation.

Commands used for the release candidate:

```text
node --test tests/material-checker*.test.js
node --check tools/material-checker-engine.js
node --check tools/material-checker-platform.js
node --check tools/material-checker-platform-hardening.js
node --check tools/material-specification-compliance-checker.js
node --check netlify/functions/material-checker.mjs
git diff --check
```

## Residual limitations and operating controls

- The tool cannot determine whether a user-transcribed requirement matches a licensed standard; an authorized reviewer must verify every package and clause.
- Grade names alone never prove equivalence. Product form, dimensions, manufacturing route, heat treatment, category/PSL, testing frequency, sampling orientation, supplementary requirements, purchaser options, service conditions, and footnotes may control.
- Optical/PDF extraction and field mapping remain screening aids. Users must confirm mapping, units, decimal placement, qualifiers, and specimen/test/heat aggregation.
- Capability indices do not prove material compliance or process control. Preserve process order, investigate special causes, use an appropriate subgrouping strategy, and obtain enough independent observations.
- Local storage and local audit history are convenient records, not tamper-evident quality records. Use the approved organizational document-control system for regulated release evidence.
- A generated report records the entered evidence and calculated screen; it does not certify material or replace approval by the responsible engineer, customer, or authority.

## Release recommendation

The remediated build is suitable for merge as a **conservative screening and documentation tool**, subject to passing repository CI and deploy-preview smoke testing. It should continue to be presented as non-authoritative, and production users should be required by procedure to verify controlled sources and retain evidence in their governed quality system.
