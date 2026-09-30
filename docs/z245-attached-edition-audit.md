# CSA Z245.1 attached-edition audit

Audit date: 2026-09-29. Source: the user-supplied `CSA Z245.1.26.pdf`, 126 PDF pages. SHA-256: `79e4f7190a8616cb5500c223a1770505fa565c9d2d79a7726183c68b3c10616a`.

The source is **CSA Z245.1:26, Steel pipe, March 2026**. Its preface identifies the twelfth edition and replacement of the 2022 edition (printed p.17, PDF p.104). This establishes the edition of the attachment; it does not assert that separately referenced ASTM, API, ISO, ASME or NACE publications have also been independently audited. PDF page numbers below are one-based. The scan places most printed pages in reverse order: for the numbered body, PDF page = 121 minus printed page.

The PDF was OCR-assisted, and numerical tables, their notes, critical applicability clauses and the edition evidence were checked against rendered images. The implementation stores transcribed numerical limits and paraphrased requirements. Neither the source PDF nor a full OCR reproduction belongs in the repository.

## Implemented records and rules

`source-assets/grade-specification-lookup/audited-z245.js` replaces the earlier :22 data with 36 :26 records: all eleven listed grades (241, 290, 359, 386, 414, 448, 483, 550, 620, 690, 825), each in Categories I, II and III, plus the existing intermediate Grade 317 in those three categories. Grade 317 is identified as intermediate and derives limits using the Table 8 interpolation and rounding instructions. The source permits other intermediate grades; this change does not create every integer grade as a selectable record.

The resolver uses nominal OD, wall, manufacturing method, supply condition, nominal tensile specimen area, gauge basis, tensile specimen type, ordered toughness temperature, test location and service selections. It distinguishes order requirements from actual CVN/DWTT temperature/results. Unknown manufacturing routes and unknown supply conditions remain unresolved. Category I has no base notch-toughness requirement. Missing conditional context is reported rather than replaced with assumed 0°C/-20°C temperatures or fixed 19% elongation.

The former IIW engine field is a schema-preserving slot for **CSA CE**, with the complete CSA expression and carbon-dependent factor. It must be displayed and computed as CSA CE. Pcm is not an acceptance formula for this edition. Every element used by the formula is required; a blank is not a measured zero.

The numerical assessment checks the rounded CVN three-specimen mean, at-most-one-below-minimum condition, individual two-thirds energy floor, Category II average/individual shear and low-specimen count, two-specimen DWTT mean and individual shear, ordered versus actual test temperature, and the five-heat order-average shear requirement. DWTT applies **strictly above** 457 mm OD; 457 mm itself uses CVN shear. Body energy increases to 40 J **at** 457 mm. Weld/HAZ, EW fusion-line and EW weld-zone contexts retain separate energy, temperature and waiver rules.

The source hydro calculator uses the prescribed OD-specific 60/75/85/90% SMYS fractions, the listed small-pipe pressures when applicable, formula rounding to 0.1 MPa, the Grade 241 caps and the 5/10 second holds. Table 1 cells marked “See Note 1” use the formula; they are not treated as missing purchaser-agreement pressures. A cap limits the mandatory minimum pressure, not the maximum pressure that may be specified or applied.

## Tables checked against rendered source

| Source | Printed page(s) | PDF page(s) | Captured requirements |
| --- | --- | --- | --- |
| Table 1 and both notes | 84–85 | 37–36 | Every listed small OD/wall pressure, grade groups, 60/75/85/90% SMYS boundaries, 0.1 MPa rounding, 17.2/19.3/20.7 MPa caps |
| Table 2 | 86 | 35 | Nominal random length, individual minimum, minimum order average and individual maximum |
| Table 3 and note | 86 | 35 | OD/process/wall-dependent plus/minus wall tolerances, 0.1 mm rounding, purchaser tightening rule |
| Table 4 and both notes | 87 | 34 | Light/non-light mass tolerances, special light-mass OD/wall ranges, carload/order >20 Mg allowance |
| Table 5 and notes | 88 | 33 | Heat and product elemental limits, no fabricated product increments, no combined microalloy cap, CSA CE expression/factor, cerium agreement |
| Table 6 | 89 | 32 | Complete tabulated carbon/factor matrix and the alternate formula basis |
| Table 7 | 89 | 32 | All six specimen dimensions and energy factors, including 6.7/3.3/2.5 mm sizes |
| Table 8 and all notes | 90 | 31 | All eleven strength rows, two specimen-dependent ratio columns, OD applicability, intermediate interpolation, elongation formula, elevated YS-only allowances |
| Table 9, all 44 items | 91–95 | 30–26 | Chemistry; body/weld tension; flattening/bend/root-bend; body/fusion/weld/HAZ CVN; DWTT; body/weld/fusion/HAZ macro- and microhardness; test-unit/shift/qualification applicability |
| Table 10 and note | 96 | 25 | Expanded/non-expanded body OD tolerances and 0.1 mm rounding |
| Table 11 and note | 96 | 25 | ID flash-trim groove depth by wall and 0.1 mm rounding |
| Table 12 | 96 | 25 | Hole/wire IQI dimensions for radiographic and fluoroscopic methods, every weld-thickness range |
| Table 13 | 97 | 24 | Projected rounded-inclusion area limits by weld thickness |
| Table 14 and notes | 97 | 24 | Guided-bend jig geometry, equations, 5 mm rounding, 790 mm cap and permissible smaller jig |
| Table 15 | 98 | 23 | Every grade strain and intermediate-grade interpolation/0.0025 rounding |
| Table 16 and notes | 98 | 23 | Repair bend-jig widths by grade, radii/female width and intermediate-grade qualification |
| Table 17 and notes | 99 | 22 | Every OD/wall/round-specimen row, strict inequalities and permitted smaller specimens |

Table 17 is retained as detailed reference data; exact boundary cases are not silently mapped to a round specimen because the source uses strict inequalities. Nominal area remains an explicit input. The user must document the selected permitted specimen and any 50 mm elongation conversion.

## Clause coverage

The 69-entry searchable requirement catalog represents every normative main section and the informative annexes. Numerical context-sensitive rules are executable where the tool has the necessary inputs; manufacturing, inspection, qualification, special-service and record requirements remain detailed references/manual checks.

| Clauses | Coverage |
| --- | --- |
| 1–3 | Applicable processes, excluded low-frequency/flash/continuous processes, OD and grade scope, intermediate grades, category meaning, normative references and defined test-unit terms |
| 4 | Mandatory ordering information, purchaser options, categories/service combinations, measurement/rounding basis and inspection access |
| 5 | Steelmaking/deoxidation, heat treatment, seam processes and qualifications, cold expansion, untested special manufacture and purchaser-approved practices |
| 6 | Table 5 limits, CSA CE, heat/product sampling, whole-wall analysis, product-analysis retests and analysis-report requirements |
| 7.1–7.2 | Test methods, YS determination by grade, measured-strength rounding, orientation, longitudinal supplemental tests, weld minimum elongation, nominal-area body elongation and 50 mm/ISO 2566-1 gauge conversion; tensile retest bracketing and traceability |
| 7.3–7.5 | Flattening, bend and face/root guided-bend procedures, acceptance, frequencies and retests; jig dimensions and strain basis |
| 7.6–7.7 | Adjacent CVN/DWTT specimen counts and rounded averages, individual acceptance/count constraints, notch locations, largest feasible subsize, machine-capacity exception, body/weld orientations, API RP 5L3 DWTT procedure and retests |
| 7.8 | Hardness methods, locations, macro/micro procedures, parent/body additional-reading exceptions, and EW sequential-weld bracketing |
| 8.1–8.3 | Body/weld tensile limits and frequency, ratio applicability, SAW/EW ductility tests, test-unit sizes, process/diameter branches and skelp-end tests |
| 8.4–8.6 | Category-specific body energy/shear, OD boundaries, order temperature, five-heat order average, SAW weld/HAZ and EW fusion/weld-zone requirements, macro/microhardness limits and frequencies |
| 9 | Every-length hydrotest, absence of leakage, recording/interlock verification, prescribed pressure/hold, higher ordered pressure and permitted end-load compensation |
| 10 | Length, body/end OD, wall, mass, end roundness, straightness, bevel/root face/squareness, bead removal and purchaser alternatives |
| 11 | General surface/lamination/hard-spot defects, dents/arcs/leaks/cracks, seam high-low/bead/flash/groove limits, skelp/mill-jointer positioning, permitted disposition/repair and residual-magnetism readings |
| 12 | Qualification and timing of full-length/body/seam/end NDE, radiological procedure/IQI/inclusion acceptance, UT/EM equipment/reference/calibration/sensitivity/reinspection, and MT/PT standards |
| 13 | SAW-seam-only repair eligibility, excavation and depth/length limits, heat input/preheat, repair NDE, WPS/PQR/welder qualification and requalification |
| 14–15 | Mill-jointers, high-low and bead limits, ASME qualification/full circumference NDE, required markings, certified temperatures, mark placement/stamping, bare finish and ordered coating |
| 16 | Sour scope through Grade 483, inclusion reporting, welding qualification, 22 HRC/250 HV10 and 250 HV0.5, EW root bends, ordered HIC, 625/650/665 MPa TS bands, stricter laminations and Ni ≤1.0% including deposited metal |
| 17–18 | Elevated-temperature and strain-based order data, additional body/weld/jointer tests, essential variables, aging/uniform elongation/stress-strain properties, supplemental toughness, and stricter purchaser acceptance |
| 19 | Per-order certification, heat/facility/test specimen/property reporting, individual/average CVN/DWTT results, chemical zero-reporting thresholds, hydro certificate values and 10/5/2-year retention |
| Annexes A–C | Explicitly informative dimensions/schedules/weights, OD/NPS/DN nomenclature and destructive-test summary; no invented offshore annex |

## Deliberately unresolved or documented checks

- The calculator is a material-property screen. Full product conformance requires the manufacturing, inspection and records checks described in the reference; entering passing YS/TS/CVN numbers does not establish those checks.
- Missing OD, method, wall, supply condition, nominal specimen area/gauge or required order temperature blocks completion. A higher-grade ratio needs the specimen type when flattened-strip and other-specimen limits differ. Category II also needs the number of heats in the order item and, at five or more, its average shear.
- A non-50 mm elongation input needs the required ISO 2566-1 conversion or documented agreement. The implementation does not invent a conversion from unavailable external tables. Table 17 round-specimen boundaries, full-section feasibility and machining details remain source-guided checks.
- Each relevant toughness location requires its own documented set. EW weld-zone waiver depends on fusion-line tests at the body temperature. SAW weld/HAZ testing at −5°C or warmer depends on the order. Colder EW fusion-line test temperature requires agreement. API RP 5L3 DWTT method/temperature corrections require documented evaluation.
- Hardness scales are not interchangeable by an invented conversion. The source HRC/HV10 alternatives and sour HV0.5 limits are stated separately. Body/parent additional-reading exceptions do not automatically apply to weld readings.
- Elevated-temperature and strain-based limits, HIC solution/frequency/acceptance, tighter dimensions, higher hydro pressure, end-load compensation, special heat treatment and other purchaser options are order-dependent. No universal HIC ratios or strain-capacity pass criterion was invented.
- External referenced test standards and procedure qualifications must be available to the operator. The catalog identifies them and the requirements this attachment states, while preserving manual checks for execution details beyond these inputs.

## Verification

`tests/standards-z245.test.js` independently checks edition/grade/category coverage, CSA CE branches/missing elements, Grade 317 interpolation, nominal-area elongation and gauge requirements, OD/specimen applicability, elevated YS-only allowance, exact 457 mm energy/shear/DWTT boundaries, CVN rounding/count/floor/subsize/temperature, distinct body/EW/SAW targets, sour limits, source hydro factors/table overrides/caps/holds and cloned resolution. It also extracts the original strict validator and checks all 36 base records plus every record resolved in BASE and SOUR contexts.

No source PDF or full OCR text is included in this change.
