# ASTM A36/A36M-19 attachment audit

The lookup uses the user's attached **ASTM A36/A36M-19** for this grade. This is an audit of that edition; it is not a claim that 2019 is the latest edition published globally.

Source: `A36_A36M-19.pdf`, 3 PDF pages, printed pages 1-3. SHA-256:

`2168f20e05fdf6a57d87df57f3af82831dff36d51eec29d315277c3d3c564e03`

Audited September 29, 2026. All three pages were rendered and visually inspected, including every column and footnote of Tables 1, 2 and 3. Extracted text was used as a cross-check. The attached PDF and extracted text are not committed or distributed by this change.

Implementation: `source-assets/grade-specification-lookup/audited-a36.js`. The module preserves the existing ASTM body and `ASTM_A36_A36M_GRADE_A36` key. `applyAuditedA36(data)` replaces the unverified generic A36 entry. `resolveAuditedA36(grade, context)` returns a clone with the correct conditions and `{missingContext, manualChecks, contextNotes}`; it does not mutate the dataset.

## Audit boundary and unresolved dependency

The A36 attachment delegates substantial requirements to the **current edition of ASTM A6/A6M** (§4.1). A6/A6M was not supplied. This audit captures that delegation and the complete requirements actually stated in the attached A36 edition, but cannot independently verify A6 dimensions, tolerances, test units, frequency, specimen/orientation rules, additional elongation adjustments, product-analysis tolerances, retesting, or detailed optional Charpy provisions.

The resolver keeps product-analysis numerical limits unresolved rather than substituting heat limits. Unavailable A6 product-analysis tolerances are an unresolved acceptance requirement and produce `INCOMPLETE` in the built compliance check; they are also listed as a manual check. Other missing A6 documentary requirements remain manual checks. Verification flags mean the attached A36 statement or numerical table cell was checked; they do not certify A6 compliance or the product's complete conformance.

The old generic entry had unsafe universal limits and artificial thickness intervals. A36 Table 3 is a form/width/thickness table; Table 2 elongation is dependent on gauge length and form. Those dependencies cannot be encoded as unconditional scalar limits. The separate `A36_AUDIT` catalog and conditional resolver retain them. A single broad mechanical schema envelope allows the existing interface to hold a resolved row; its upper endpoint is an implementation bound and **not** an A36 maximum permitted thickness. The interface should display the selected material/specimen context rather than present that endpoint as a normative range.

## Required resolution context

| Context | Meaning |
| --- | --- |
| `form` | `PLATE`, `BAR`, or `STRUCTURAL_SHAPE`; unprocessed `COIL` is excluded |
| `thicknessMM` | Material thickness/diameter stored in mm, positive |
| `unitBasis` | `SI` or `IMPERIAL`; choose one independently standardized system |
| `widthMM` | Plate width; Table 3 chemistry divides at 380 mm / 15 in. and elongation at 600 mm / 24 in. |
| `shapeFlangeThicknessMM` | Actual shape flange thickness; chemistry changes above 75 mm / 3 in. |
| `shapeDesignation` | `WIDE_FLANGE` or `OTHER`; needed for a heavy shape's tensile/elongation exception |
| `gaugeLengthMM` | Actual tensile specimen gauge length: 50 or 200 mm for SI; 50.8 or 203.2 mm representing 2 or 8 in. for inch-pound |
| `copperSpecified` | Whether copper steel was ordered; invokes Cu >=0.20% |
| `floorPlate` | Removes the requirement to determine elongation |
| `bearingUse` | `NONE`, `BRIDGE`, or `NON_BRIDGE`; can invoke §5.2 |
| `manufacturerTestRequired` | True when an order overrides the nonbridge-bearing mechanical-test exemption |
| `analysisType` | `HEAT` or `PRODUCT`; product numerical limits need A6 tolerances |
| `impactSupplement` | Ordered S5/S30 requires manual resolution of A6 and purchase-order acceptance criteria |

Shape area and bar shape determine the manufacturer's §8.2 tension-test exemption. This audit identifies those conditional exemptions in manual checks; it does not fabricate a universal exemption or remove purchaser-required testing. Missing conditional context must prevent a definitive compliance result.

## Heat chemistry: all Table 3 columns

All chemistry is weight percent. A dash means the table sets no limit. Every upper thickness boundary is inclusive; the next row starts strictly above it. Numeric SI boundaries below are the standard's bracketed values, not converted inch boundaries. Printed/PDF page 3, Table 3; §7.1 on page 2.

| Product and dimensional condition (SI) | C max | Mn range | P max | S max | Si range/max |
| --- | ---: | --- | ---: | ---: | --- |
| Shapes, flange thickness <=75 mm | 0.26 | - | 0.04 | 0.05 | <=0.40 |
| Shapes, flange thickness >75 mm (note A) | 0.26 | 0.85-1.35 | 0.04 | 0.05 | 0.15-0.40 |
| Plate width >380 mm, t<=20 mm | 0.25 | - | 0.030 | 0.030 | <=0.40 |
| Plate width >380 mm, 20<t<=40 mm | 0.25 | 0.80-1.20 | 0.030 | 0.030 | <=0.40 |
| Plate width >380 mm, 40<t<=65 mm | 0.26 | 0.80-1.20 | 0.030 | 0.030 | 0.15-0.40 |
| Plate width >380 mm, 65<t<=100 mm | 0.27 | 0.85-1.20 | 0.030 | 0.030 | 0.15-0.40 |
| Plate width >380 mm, t>100 mm | 0.29 | 0.85-1.20 | 0.030 | 0.030 | 0.15-0.40 |
| Bars / plate width <=380 mm, t<=20 mm | 0.26 | - | 0.04 | 0.05 | <=0.40 |
| Bars / plate width <=380 mm, 20<t<=40 mm | 0.27 | 0.60-0.90 | 0.04 | 0.05 | <=0.40 |
| Bars / plate width <=380 mm, 40<t<=100 mm | 0.28 | 0.60-0.90 | 0.04 | 0.05 | <=0.40 |
| Bars / plate width <=380 mm, t>100 mm | 0.29 | 0.60-0.90 | 0.04 | 0.05 | <=0.40 |

The separately standardized inch-pound chemistry ranges are:

| Group | Width condition | Thickness bands, in. |
| --- | --- | --- |
| Wide plates | >15 in. | <=0.75; >0.75 to 1.5; >1.5 to 2.5; >2.5 to 4; >4 |
| Bars / narrow plates | Plates <=15 in.; bars | <=0.75; >0.75 to 1.5; >1.5 to 4; >4 |
| Shapes | Flange condition | Chemistry note A applies above 3 in. flange thickness |

Table 3 additional requirements:

- **Copper:** Cu minimum 0.20% for every column only when copper steel is specified. It is not an unconditional grade limit.
- **Note A:** heavy-flange chemistry applies to shapes generally; it is distinct from the Table 2 heavy **wide-flange** tensile exception.
- **Note B:** for bars and plates, every full 0.01 percentage-point decrease in C below the applicable C maximum permits an extra 0.06 percentage point Mn above the applicable Mn maximum, capped at 1.35%. The resolver installs the existing engine's tradeoff rule only where a Table 3 Mn maximum exists. An unspecified Mn cell does not become an invented 1.35% maximum.
- **Note 1:** absence of a Mn limit does not remove determination/reporting of Mn heat analysis under A6/A6M.
- **Product analysis (§7.2):** Table 3 applies with A6/A6M tolerances. The attachment does not state numerical tolerance values. Product limits remain unresolved until that source is available.
- **Carbon equivalent:** the base attached A36 document states no CE(IIW) or PCM acceptance limit and no A36-specific selection rule. Any displayed CE calculations remain informational.

## Mechanical requirements: Table 2 and Section 8

Printed/PDF page 2. Values in each system must be used independently (§1.6).

| Property / condition | SI standard value | Inch-pound standard value | Evidence |
| --- | --- | --- | --- |
| Base yield point, plates/shapes/bars | >=250 MPa | >=36 ksi | Table 2 |
| Base tensile strength | 400-550 MPa | 58-80 ksi | Table 2 |
| Plate yield point above thick-plate boundary | >=220 MPa for t>200 mm | >=32 ksi for t>8 in. | Table 2 note C |
| Wide-flange shapes above heavy-flange boundary | No UTS maximum for flange t>75 mm | No UTS maximum for flange t>3 in. | Table 2 note B |
| Plates/bars, short tensile gauge | >=23% in 50 mm | >=23% in 2 in. | Table 2 |
| Plates/bars, long tensile gauge | >=20% in 200 mm | >=20% in 8 in. | Table 2 |
| Shapes, short tensile gauge | >=21% in 50 mm | >=21% in 2 in. | Table 2 |
| Shapes, long tensile gauge | >=20% in 200 mm | >=20% in 8 in. | Table 2 |
| Heavy wide-flange shapes, short gauge | >=19% in 50 mm | >=19% in 2 in. | Table 2 note B |
| Wide-plate elongation reduction | Subtract 2 percentage points if width>600 mm | Subtract 2 percentage points if width>24 in. | Table 2 note E |
| Floor-plate elongation | Determination not required | Determination not required | Table 2 note D |
| Additional orientation / elongation adjustments | A6/A6M-dependent | A6/A6M-dependent | Table 2 notes A and E |

The gauge alternatives describe the required result for the specimen actually used; they do not require two different elongation tests simultaneously. No fixed 20% universal elongation survives in the updated record. A6 adjustments still need review after the base Table 2 value is resolved. The standard states no base Y/T ratio or hardness acceptance limit.

The internal compliance engine stores MPa. With `unitBasis=IMPERIAL`, the resolver converts the exact 36/32/58/80 ksi limits to the engine's MPa representation rather than applying the independently standardized 250/220/400/550 MPa limits. This matters near acceptance boundaries. Dimensional conditions are likewise selected using the inch values after converting the stored actual mm dimensions back to inches.

## Bearing-plate routes and manufacturer test exemptions

Printed/PDF page 2, §§5.1, 5.2 and 8.2.

- Bridge bearing plates require Section 8 mechanical testing unless specified otherwise (§5.1).
- For nonbridge bearing plates above 40 mm / 1.5 in., mechanical testing is not required unless specified otherwise. This route requires **heat C 0.20-0.33%**, Table 3 P and S, and sufficient discard for sound plates (§5.2). Section 7.1 explicitly excepts this route from ordinary Table 3 heat-chemistry requirements. The resolver does not invent mandatory Mn or Si limits for this route. Ordered copper remains an order-specific condition.
- Shapes below 645 mm² / 1 in.² area and nonflat bars below 12.5 mm / 0.5 in. thickness or diameter may be exempt from manufacturer tension tests when chemistry is suitable for obtaining Table 2 tensile properties. This is not a blanket exemption from suitable material properties or order-specified testing (§8.2).

## Complete additional requirement catalog

`A36_AUDIT.catalog` contains the detailed paraphrased requirements with evidence references. Its coverage is:

| Requirement | Evidence | Captured treatment |
| --- | --- | --- |
| Structural-quality shapes, plates and bars; bolted/riveted/welded construction | §1.1, p.1 | Applicable forms and scope |
| Purchase-order activation of supplementary requirements | §1.2, p.1; supplementary introduction, p.3 | Base versus ordered requirements |
| Suitable welding procedure; A6 Appendix X3 guidance | §1.3, p.1 | Manual verification |
| Explanatory-text note rule; table/figure exception | §1.4, p.1 | Interpretation catalog |
| Additional coil-derived testing/reporting | §1.5, p.1; §4.2, p.2 | Explicit A6 dependency; no fabricated frequency |
| Independently standardized unit systems | §1.6, p.1 | Conditional SI/inch resolver |
| Appurtenant product forms follow Table 1 specifications | §3.1/Table 1, p.2 | Complete mapping below; not A36 limits |
| Current A6 general requirements; A36 controls conflicts | §4.1, p.2 | Visible unresolved dependency |
| Unprocessed coil excluded; processor responsibilities | §4.2, p.2 | COIL removed; manufacturing/processing catalog |
| Bridge and nonbridge bearing plates | §§5.1-5.2, p.2 | Conditional route, carbon/P/S and soundness |
| Killed steel | §6.1, p.2 | Manual manufacture check |
| Heat and product chemistry | §§7.1-7.2, p.2; Table 3, p.3 | Complete Table 3 heat cases; product tolerance dependency |
| Tensile representation and properties | §8.1/Table 2, p.2 | Contextual mechanical resolution |
| Small shapes / nonflat bars manufacturer test exception | §8.2, p.2 | Explicit conditional/manual check |
| S5 Charpy V-notch test | p.3 | Ordered-only; A6/order criteria required |
| S30 structural-shape Charpy at alternate core location | p.3 | Ordered-only; A6/order criteria required |
| S32 single-heat bundles for shapes/bars | S32.1, p.3 | Ordered-only bundling requirement |

A36 §1.7 describes standards-development principles; §2 lists referenced documents; §9 lists keywords. These contain no additional grade acceptance numbers to fabricate. The edition's Summary of Changes records the Table 1 fastener update and sheet/strip type additions, which are captured in the mapping below.

No hydrotest or DWTT requirement is stated for the base A36 products. No unconditional Charpy temperature, energy, shear-area, orientation, or subsize factor is supplied. Previously generic 0.75/0.50 subsize factors were removed. Do not apply an arbitrary pipe-test formula or assume a Charpy acceptance threshold.

## Table 1 appurtenant products

Printed/PDF page 2. These are different product specifications; their requirements must be obtained separately. A36 Table 1 Note 1 asks the specifier to assess suitability because chemistry/mechanical properties may differ from A36.

| Product | Table 1 specification |
| --- | --- |
| Steel rivets | A502 Grade 1 |
| Bolts | A307 Grade A or F568M Class 4.6 |
| High-strength bolts | F3125/F3125M Grade A325 or A325M |
| Steel nuts | A563 or A563M |
| Cast steel | A27/A27M Grade 65-35 [450-240] |
| Carbon-steel forgings | A668/A668M Class D |
| Hot-rolled sheet/strip | A1011/A1011M SS Grade 36 [250] Type 1 or Type 2; or A1018/A1018M SS Grade 36 [250] Type 1 or Type 2 |
| Cold-formed tubing | A500 Grade B |
| Hot-formed tubing | A501 |
| Anchor bolts | F1554 Grade 36 |

Table 1 lists F568M even though the referenced-documents list marks it withdrawn in 2012. The mapping reflects the supplied 2019 edition and does not imply that withdrawal is reversed.

## Integration notes

1. Load the audit module before hardening and call `applyAuditedA36(SPEC_DATA)` once.
2. Resolve the cloned grade with the selected context **before** applying customer overlays so ordered overlay limits survive.
3. Display `missingContext` and `manualChecks` distinctly. Missing context or unaudited A6 acceptance criteria must prevent a definitive complete-conformance claim.
4. Show `A36_AUDIT.catalog` in a collapsed comprehensive reference section; numeric tables can remain uncluttered.
5. The existing engine's `TRADEOFF_ADJUST` rule applies full 0.01% C decrement steps and includes the 1.35% Mn cap. Do not reinterpret this as a continuous unlimited adjustment.
6. For floor plate and the §5.2 mechanical-test exception, a resolved elongation minimum of null means determination is not required by the selected A36 route, not that the specimen context is unknown. Preserve the display note; the compliance completeness check should not demand a nonexistent elongation acceptance number.

## Verification

`node --test tests/standards-a36.test.js` passes. The 14 focused test groups load the original compressed dataset from the repository and independently transcribed requirements from the visually checked attachment. They cover all chemistry bands, inclusive/strict boundaries, plate widths 380/600 mm, distinct SI/inch boundaries and tensile values, plate yield above 200 mm / 8 in., heavy-shape versus heavy-wide-flange conditions, actual gauge lengths, floor plate, §5.2 bearing route and order override, optional copper, C/Mn rule installation, unavailable A6 product tolerances, missing context, and source-record immutability. The original strict schema validator reports zero errors for the updated A36 dataset. A JSDOM integration test builds the application and verifies that unavailable product-analysis acceptance tolerances produce `INCOMPLETE`. Separate local checks exercised 48 additional context scenarios successfully.
