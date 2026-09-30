# Attached CSA G40.20/G40.21 edition audit

Source: user-provided `G40.20-13 G40.21-13.pdf`, 113 scanned PDF pages.

SHA-256: `b70949ce0d8afc203d8b55abaf8286e8867d4359afb09f42102a0a8bb9b00e91`.

The cover at PDF page 112 identifies **G40.20-13/G40.21-13, reaffirmed 2023**. PDF page 110 is **Update No. 1, May 2014**, which replaces G40.21 Table 3 on printed pages 61-62. The replacement pages at PDF pages 109/108 take precedence over the old pages. This audit uses the attached edition; it does not claim that it is the latest edition published globally.

The attachment is in reverse page order. G40.21 printed page `n` is PDF page `101-n` for the audited printed pages 51-99. G40.20 printed page `n` is PDF page `99-n` in the audited general-requirements section. These offsets differ: page mappings were established from visible printed page numbers, not assumed for the whole document.

## Visual source evidence

| Source | Printed page | PDF page | Audit use |
| --- | --- | --- | --- |
| Edition cover | unnumbered | 112 | Edition and reaffirmation |
| Update No. 1 | unnumbered | 110 | Replacement-table precedence |
| G40.21 Table 1 | 59 | 42 | Every actual grade/type and special form restrictions |
| G40.21 Table 2 | 60 | 41 | Chemical/tensile/impact test schedule |
| Amended G40.21 Table 3 | 61-62 | 109/108 | Heat chemistry and all lettered footnotes |
| G40.21 Table 4 | 63 | 38 | API plate chemistry exceptions |
| G40.21 Table 5 | 64 | 37 | HSS heat chemistry and footnotes |
| G40.21 Table 6 | 65-68 | 36-33 | Plate/bar/sheet/welded-shape SI and informational imperial mechanical properties |
| G40.21 Table 7 | 69-70 | 32-31 | Rolled-shape/sheet-piling properties and special specimen allowances |
| G40.21 Table 8 | 71-72 | 30-29 | HSS properties |
| G40.21 Table 9 | 73-74 | 28-27 | Category temperatures, full-size/subsize energies and footnotes |
| G40.21 Table 10 | 75 | 26 | Colour identification |
| G40.21 clauses 1-9 | 51-58 | 50-43 | Manufacturing, ordering, analyses, delivery, impact and marking |
| G40.20 clauses 1-18 | 3-29 | 96-70 | General requirements and exact test/retest rules |
| G40.20 Tables 1-3 | 29-30 | 70-69 | Shape groups, exact subsize energies and permitted full-section shapes |
| G40.20 dimensional Tables 4-24 | 31-46 | 68-53 | Actual table headings, scope and selection-dependent tolerance requirements |

OCR was used to locate clauses, followed by rendered-page checks. Normative grade tables, replacement notes, category/subsize values and specimen deductions were checked visually. No PDF pages, full OCR or licensed scan are committed or redistributed. The committed catalog contains paraphrased engineering requirements and references.

## Scope and changes

`audited-g40.js` implements 29 actual Table 1 grades, rather than inventing limits for legacy 230G, 260G, 300G or 230W choices that do not occur in this attached edition. Removed choices are recorded in `G40_AUDIT.legacyAliases`. Added actual grades include WM/WMT, 450W/WT, 550W/WT, R, the additional A/AT levels and Q/QT.

The current schema stores heat chemistry and mechanical values; `resolveAuditedG40` selects conditional requirements using actual form/subtype, thickness, gauge/orientation, coupon geometry, impact category and supply condition. It returns missing-context items and manual checks rather than asserting complete conformance from a few numeric results. It preserves the data schema and exposes the broader requirement catalog separately.

- HSS uses Tables 5/8, rolled shapes use Table 7, and flat products/bars/welded shapes use Table 6. For example, 350WT HSS has tensile 450-620 MPa and 50 mm elongation 22%; plate has tensile 450-650 MPa and transverse 50 mm elongation 20%; rolled shapes have tensile minimum 480 MPa.
- Plate yield changes strictly above 65 mm: 350W/WT becomes 320 MPa, rather than applying the previous unsupported 40 mm reduction. Grade-specific upper coverage and every Table 6 boundary are retained.
- Amended chemistry notes resolve C changes strictly above 100 mm and Type W Si minimum strictly above 40 mm. Nb/V combined maxima exclude Al. Conditional Al/Mn/Cu/API permissions are documented and remain explicit checks until a purchaser approval route is supplied.
- WM/WMT has its particular N/Nb/V/Mo and shape CE requirements: CE 0.45%, or 0.47% for shapes with flange over 50 mm; yield maximum 450 MPa and Y/T 0.85, with the required-web allowance 480 MPa/0.87. Nitrogen-binding and Al-killed routes require manufacturing evidence. Clause 7.7(c) expressly describes shapes, so the resolver does not assign a CE maximum to nonshape forms without applicability review.
- G40.21 clause 1.5 makes SI the units of record. Selecting imperial display does not substitute a separate acceptance system.
- Charpy category is an order requirement. Categories 1-4 are 0/-20/-30/-45°C. Category 5 requires agreed values. Full-size 350WT energy is 27 J average and 18 J individual, not the previous 20 J individual default. Standard subsize minima come from the discrete source table, not linear 0.75/0.5 fractions.
- Subsize energy fractions in the schema encode the exact source energy. The physical specimen dimensions are referenced to ASTM A370; the original tool's nominal dimension labels must be understood as specimen-fraction labels, not independent dimensional approval.
- Thin rectangular, sheet-specific and thick 50 mm-gauge elongation deductions are distinct. Floor plate has no required elongation; full-section angle specimens have the source-specific addition and shape-group restriction.

## Coverage beyond numeric limits

`G40_AUDIT.catalog` covers the G40.21 clauses and 111 separately audited G40.20 entries, including general manufacture, tolerances, sampling, specimen location/preparation, test methods, test frequency, heat treatment, conditioning, repairs, welded-shape inspection, identification, retests, certificate contents, purchaser inspection and rejection. Dimension tables are indexed by their actual headings and contextual selection rules; the tool does not pretend to numerically verify every geometric tolerance without dimensions and measurements.

The numerical testing facts include:

- Normally two tensile samples from different finished pieces per heat/form/size group; the less-than-50,000 kg reduction is conditional.
- One impact sample per 50,000 kg or less, with three specimens per sample; product-specific and treatment rules still apply.
- Q/QT plates are sampled after treatment at plate indices 1, 4, 7, 10 and so on for a common heat/thickness/prior-condition/treatment lot.
- Grouped-heat tensile testing is each 25,000 kg of each size; grouped heats are permitted only for the specified small-product 260W/300W/350W routes.
- Coiled sheet tensile sampling uses the distinct 45,000 kg and 0.64 mm rules. Impact sampling for coiled sheet is separately defined.
- Welded-shape production QC tests every 300 m or 3 hours, whichever is greater, with minimum sampling at each weld-size/procedure change.
- Tensile retests require two passing results. Impact retests require the allowed original shortfall, three further specimens and the six-result acceptance conditions; replacement specimens and heat retreatment have separate provisions.

G40.20 clause 6.6 requires tensile/yield results rounded to the nearest 5 MPa for conformance, and other values to the rightmost specified place using ASTM E29. G40.21 clauses 8.2.4-8.2.6 specify the three-specimen mean and every individual at least two thirds of the required mean; they do not impose an additional count of specimens allowed below the mean requirement. Calculated average results should retain input precision until final conformance rounding. The attachment does not supply the full E29 procedure or an explicit rounding convention for a fractional derived individual threshold (for example, 20 × 2/3 J); such boundary interpretations remain manual checks rather than silently rounding the requirement down.

Mandatory numeric values are flagged verified after attached-source checks. Optional purchaser requirements, permission-based alternatives and referenced methods are explicitly distinguished. No universal CE/PCM, hardness, shear-area or hydrostatic test minimum/maximum is invented for grades lacking one.

## Referenced standards and source anomalies

G40.21 product analysis invokes ASTM A6/A6M tolerances. ASTM A6/A6M and A370 details are not reproduced in this attachment, so product-analysis conformance and full specimen-geometry conformance remain incomplete until the appropriate referenced provisions are available. Atmospheric corrosion resistance requires ASTM G101 index at least 6.0; a complete G101 computation needs its referenced method. Cold-formed channel/Z coating and feedstock routes similarly need the referenced sheet standards.

The attached source itself has several internally inconsistent general-requirement cross-references. For example, clause 5.8.4 names Table 10 for HSS cross dimensions, whereas the actual Table 10 heading is mass and cross dimensions appear in Table 12. Other HSS/cold-formed table numbers and impact-retest references also disagree with the visible referenced subject. Clause 18.3 contains an apparent editorial sentence after the actual rejection provision; it is excluded from requirements. These anomalies are recorded in the catalog rather than silently treated as validated links.

At exactly 90 mm, the heavy-elongation prose says over 90 mm while its table begins at 90.00 mm. The resolver uses the table deduction and emits a manual boundary check. Exact 5,000 kg per-piece sampling likewise has a source prose boundary gap; the catalog flags it. Engineering interpretation is required for these exact-boundary cases.

## Validation

Focused tests are in `tests/standards-g40.test.js`: actual grade roster; SI basis; 65/100/200 mm limits; plate/HSS/shape distinctions; orientation/gauge and deduction selection; category missing/custom behavior; exact subsize energy values; WM/WMT flange/web restrictions; unknown product-analysis tolerances; Q/QT supply condition.

The added grade records pass the original strict schema validator with no G40 errors. Source audit verification is distinct from complete product certification; manual requirements remain visible and prevent a false complete-conformance verdict.
