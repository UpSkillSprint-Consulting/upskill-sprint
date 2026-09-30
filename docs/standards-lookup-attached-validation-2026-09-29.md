# Attached-standard lookup validation — 29 September 2026

The lookup now resolves the supplied ASTM A36/A36M-19, CSA G40.20-13/G40.21-13 (R2023) including the May 2014 replacement pages, and CSA Z245.1:26. Detailed source evidence, PDF hashes, table/page maps and conditional requirements are in the three adjacent attached-edition audit documents. Source PDFs and OCR are excluded from the repository.

## Automated and contextual coverage

The dataset has 268 selectable records; 66 records correspond to the three source audits (one A36, 29 G40 and 36 Z245 grade/category combinations). Other standards retain their disclosed unverified status. An imported record with a different edition does not inherit the supplied-edition badge.

- A36 selects chemistry by form, width and thickness; uses independently normative SI/inch-pound boundaries; handles copper ordering, carbon/manganese tradeoff, heavy flanges, gauge/width elongation, floor plates and the nonbridge-bearing exemption.
- G40 applies the amended heat tables, plate/shape/HSS mechanics, thickness/gauge/orientation deductions, ordered impact category, exact tabulated subsize energies, and shape-specific WM/WMT CE. Strength conformance uses nearest 5 MPa; other comparisons use the final-place precision invoked by Clause 6.6. Final CVN observations are rounded after calculating the mean, with the source's exact two-thirds threshold retained. Fractional derived-threshold interpretation remains documented for controlled review. ASTM's official reporting guidance supports half-to-even ties: https://marketing.astm.org/acton/attachment/9652/f-0b75/0/-/-/-/SO08-DP.pdf
- Z245 applies the CSA carbon-dependent CE equation, OD-dependent strength/ratio rules, specified-TS and nominal-area elongation, category/diameter/location toughness rules, rounded CVN mean and specimen-count requirements, CVN/DWTT individual shear and order-wide shear, sour/elevated/strain context, and Table 1 hydro pressure/caps/holds. Stronger customer CVN overlays remain in the assessment.
- Reverse lookup resolves the requested product form and flags unresolved selection context. Blank fields do not become measured zero. Prior reports are invalidated when edition, form, unit basis or stored order/specimen context changes.

## Display and scope

Primary chemistry and mechanical tables remain aligned and concise. Order/specimen details and the comprehensive requirement catalog are collapsed. Printing expands source/reference disclosures. Excel paste wording contains no reference to the removed product name.

Missing context, individual specimens or unavailable referenced acceptance limits result in INCOMPLETE. Numerical checks do not certify manufacturing, dimensional inspection, NDE, sampling/retests, marking or records: these remain explicitly documented checks. Referenced ASTM A6/A6M product-analysis tolerances are not invented. ASTM A370, ISO conversion and API RP 5L3 methods must be verified where applicable. Purchase-order permissions and requirements remain explicit, rather than universal assumptions.

## Validation

77 focused tests pass across the lookup integration and three standard suites. Coverage includes source-table boundaries and footnotes, strict dataset schema checks, source-specific CE and missing inputs, rounded energy and strength, both DWTT specimens, source-context controls, hydro selection, independent unit systems, imported editions, and customer overlays. The built application has no JSDOM runtime errors and zero dataset-validation errors. The full site build and git diff whitespace check pass.

A browser visual review of the signed-in production tool remains limited by its administrator sign-in gate. These changes are prepared in PR #229; this document does not claim production publication or product certification.
