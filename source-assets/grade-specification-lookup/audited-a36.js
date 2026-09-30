// Attachment audit: ASTM A36/A36M-19. The attachment controls this record.
// Numeric requirements are facts paraphrased from the supplied standard.
// This module does not import or reproduce the licensed document.
const A36_AUDIT = {
  bodyKey: 'ASTM',
  gradeKey: 'ASTM_A36_A36M_GRADE_A36',
  edition: 'ASTM A36/A36M-19',
  source: {
    filename: 'A36_A36M-19.pdf',
    sha256: '2168f20e05fdf6a57d87df57f3af82831dff36d51eec29d315277c3d3c564e03',
    pdfPages: 3,
    printedPages: [1, 2, 3],
    auditedOn: '2026-09-29',
    method: 'All 3 PDF pages visually checked; Tables 1, 2 and 3 and their footnotes cross-checked against extracted text.'
  },
  dependencies: [{
    standard: 'ASTM A6/A6M, current edition required by A36/A36M-19 §4.1',
    availableInAttachments: false,
    appliesTo: ['general delivery requirements', 'product-analysis tolerances', 'tension-test orientation and specimen rules', 'elongation adjustments', 'test frequency and test units', 'retests', 'coil-derived product testing/reporting', 'supplementary impact tests'],
    reference: '§§1.3, 1.5, 4.1, 4.2, 7.2; Table 2 notes A and E; supplementary requirements'
  }],
  // Boundaries below are the separately standardized systems, not conversions.
  // Every range has an exclusive lower and inclusive upper boundary.
  chemistryCases: [
    { id: 'shape', form: 'STRUCTURAL_SHAPE', label: 'Shapes; flange thickness up to 75 mm / 3 in.', maxThickness: null, cMax: 0.26, mnMin: null, mnMax: null, pMax: 0.04, sMax: 0.05, siMin: null, siMax: 0.40 },
    { id: 'shape-heavy-flange', form: 'STRUCTURAL_SHAPE', label: 'Shapes; flange thickness over 75 mm / 3 in.', maxThickness: null, cMax: 0.26, mnMin: 0.85, mnMax: 1.35, pMax: 0.04, sMax: 0.05, siMin: 0.15, siMax: 0.40, footnotes: ['a36_chem_A'] },
    { id: 'plate-wide-20', form: 'PLATE', width: 'WIDE', tMinSI: 0, tMaxSI: 20, tMinIn: 0, tMaxIn: 0.75, cMax: 0.25, mnMin: null, mnMax: null, pMax: 0.030, sMax: 0.030, siMin: null, siMax: 0.40 },
    { id: 'plate-wide-40', form: 'PLATE', width: 'WIDE', tMinSI: 20, tMaxSI: 40, tMinIn: 0.75, tMaxIn: 1.5, cMax: 0.25, mnMin: 0.80, mnMax: 1.20, pMax: 0.030, sMax: 0.030, siMin: null, siMax: 0.40 },
    { id: 'plate-wide-65', form: 'PLATE', width: 'WIDE', tMinSI: 40, tMaxSI: 65, tMinIn: 1.5, tMaxIn: 2.5, cMax: 0.26, mnMin: 0.80, mnMax: 1.20, pMax: 0.030, sMax: 0.030, siMin: 0.15, siMax: 0.40 },
    { id: 'plate-wide-100', form: 'PLATE', width: 'WIDE', tMinSI: 65, tMaxSI: 100, tMinIn: 2.5, tMaxIn: 4, cMax: 0.27, mnMin: 0.85, mnMax: 1.20, pMax: 0.030, sMax: 0.030, siMin: 0.15, siMax: 0.40 },
    { id: 'plate-wide-over100', form: 'PLATE', width: 'WIDE', tMinSI: 100, tMaxSI: null, tMinIn: 4, tMaxIn: null, cMax: 0.29, mnMin: 0.85, mnMax: 1.20, pMax: 0.030, sMax: 0.030, siMin: 0.15, siMax: 0.40 },
    { id: 'bar-narrowplate-20', forms: ['BAR', 'PLATE'], width: 'NARROW', tMinSI: 0, tMaxSI: 20, tMinIn: 0, tMaxIn: 0.75, cMax: 0.26, mnMin: null, mnMax: null, pMax: 0.04, sMax: 0.05, siMin: null, siMax: 0.40 },
    { id: 'bar-narrowplate-40', forms: ['BAR', 'PLATE'], width: 'NARROW', tMinSI: 20, tMaxSI: 40, tMinIn: 0.75, tMaxIn: 1.5, cMax: 0.27, mnMin: 0.60, mnMax: 0.90, pMax: 0.04, sMax: 0.05, siMin: null, siMax: 0.40 },
    { id: 'bar-narrowplate-100', forms: ['BAR', 'PLATE'], width: 'NARROW', tMinSI: 40, tMaxSI: 100, tMinIn: 1.5, tMaxIn: 4, cMax: 0.28, mnMin: 0.60, mnMax: 0.90, pMax: 0.04, sMax: 0.05, siMin: null, siMax: 0.40 },
    { id: 'bar-narrowplate-over100', forms: ['BAR', 'PLATE'], width: 'NARROW', tMinSI: 100, tMaxSI: null, tMinIn: 4, tMaxIn: null, cMax: 0.29, mnMin: 0.60, mnMax: 0.90, pMax: 0.04, sMax: 0.05, siMin: null, siMax: 0.40 }
  ],
  tensile: {
    normalSI: { yieldMin: 250, tensileMin: 400, tensileMax: 550 },
    normalImperial: { yieldMin: 36, tensileMin: 58, tensileMax: 80 },
    thickPlateYield: { overMM: 200, overIn: 8, minimumMPa: 220, minimumKsi: 32, reference: 'Table 2 note C' },
    heavyWideFlange: { overMM: 75, overIn: 3, tensileMax: null, shortGaugeElongationPct: 19, reference: 'Table 2 note B' },
    elongation: {
      plateBar: { short: 23, long: 20 },
      shape: { short: 21, long: 20 },
      shortGaugeMM: 50, shortGaugeIn: 2, longGaugeMM: 200, longGaugeIn: 8,
      plateWidthReduction: { overMM: 600, overIn: 24, percentagePoints: 2, reference: 'Table 2 note E' },
      floorPlate: { required: false, reference: 'Table 2 note D' },
      additionalAdjustments: 'A6/A6M tension-test elongation adjustments and orientation provisions remain applicable (Table 2 notes A and E).'
    }
  },
  appurtenantMaterials: [
    ['Steel rivets', 'ASTM A502 Grade 1'],
    ['Ordinary bolts', 'ASTM A307 Grade A or F568M Class 4.6'],
    ['High-strength bolts', 'ASTM F3125/F3125M Grade A325 or A325M'],
    ['Steel nuts', 'ASTM A563 or A563M'],
    ['Steel castings', 'ASTM A27/A27M Grade 65-35 [450-240]'],
    ['Carbon-steel forgings', 'ASTM A668/A668M Class D'],
    ['Hot-rolled sheet/strip', 'ASTM A1011/A1011M SS Grade 36 [250] Type 1 or Type 2; or A1018/A1018M SS Grade 36 [250] Type 1 or Type 2'],
    ['Cold-formed tubing', 'ASTM A500 Grade B'],
    ['Hot-formed tubing', 'ASTM A501'],
    ['Anchor bolts', 'ASTM F1554 Grade 36']
  ],
  requirements: [
    { id: 'scope', topic: 'SCOPE', text: 'A36 applies to structural-quality carbon steel plates, shapes and bars for bolted, riveted or welded structures and general structural use.', clauseRef: '§1.1; PDF/printed p.1', verified: true },
    { id: 'supplement-order', topic: 'ORDERING', text: 'Supplementary tests and restrictions apply only when invoked in the purchase order. They are additional to the base grade.', clauseRef: '§1.2; PDF/printed p.1; supplementary requirements, p.3', verified: true },
    { id: 'welding', topic: 'WELDING', text: 'A welding procedure suited to the grade and intended service must be used; A6/A6M Appendix X3 provides weldability guidance.', clauseRef: '§1.3; PDF/printed p.1', verified: true },
    { id: 'mandatory-notes', topic: 'INTERPRETATION', text: 'Notes and footnotes in ordinary text are explanatory; table and figure notes/footnotes are excluded from that nonmandatory-note rule.', clauseRef: '§1.4; PDF/printed p.1', verified: true },
    { id: 'unit-systems', topic: 'UNITS', text: 'Use either the separately standardized inch-pound values or SI values throughout an assessment. Do not mix converted limits with the other system.', clauseRef: '§1.6; PDF/printed p.1', verified: true },
    { id: 'general-delivery', topic: 'DELIVERY', text: 'The current edition of A6/A6M applies to the ordered product; A36 prevails if the two specifications conflict. A6/A6M was not supplied and its detailed requirements have not been independently verified here.', clauseRef: '§4.1; PDF/printed p.2', verified: true },
    { id: 'coil', topic: 'PRODUCT FORM', text: 'An unprocessed coil does not qualify as A36. Coil-derived A36 products must be processed to finished structural products cut to individual lengths. The processor controls or is responsible for processing, inspection, testing, conditioning, packaging, marking, shipping and certification.', clauseRef: '§4.2; PDF/printed p.2', verified: true },
    { id: 'coil-report', topic: 'COIL-DERIVED TESTING', text: 'For products made from coil and supplied without heat treatment or with stress relief only, additional A6/A6M testing and reporting apply. The explanatory note points to two reported test results for each qualifying coil; verify the governing A6/A6M requirements.', clauseRef: '§1.5 and §4.2 Note 1; PDF/printed pp.1-2', verified: true },
    { id: 'bearing-bridge', topic: 'BEARING PLATES', text: 'Bridge bearing plates require mechanical tests to Section 8 unless the order specifies otherwise.', clauseRef: '§5.1; PDF/printed p.2', verified: true },
    { id: 'bearing-other', topic: 'BEARING PLATES', text: 'Unless specified otherwise, nonbridge bearing plates thicker than 40 mm in the SI system or 1.5 in. in the inch-pound system need no mechanical tests; heat carbon must be 0.20-0.33%, phosphorus and sulfur must satisfy Table 3, and sufficient discard must be made to obtain sound plates.', clauseRef: '§5.2; PDF/printed p.2', verified: true },
    { id: 'killed', topic: 'MANUFACTURE', text: 'The steel must be killed.', clauseRef: '§6.1; PDF/printed p.2', verified: true },
    { id: 'heat-chem', topic: 'HEAT ANALYSIS', text: 'Heat chemistry must meet the form- and dimension-dependent Table 3 requirements except for the Section 5.2 bearing-plate route. A blank Table 3 cell means no limit, not a zero limit. Manganese heat analysis must still be determined and reported under A6/A6M.', clauseRef: '§7.1; Table 3 Note 1; PDF/printed pp.2-3', verified: true },
    { id: 'product-chem', topic: 'PRODUCT ANALYSIS', text: 'Product chemistry is subject to Table 3 with the A6/A6M product-analysis tolerances. The attached A36 document does not state those tolerance values; heat limits are not substituted for product limits.', clauseRef: '§7.2; PDF/printed p.2', verified: true },
    { id: 'shape-flange', topic: 'CHEMISTRY CONDITIONS', text: 'Shapes with flange thickness above 75 mm / 3 in. require Mn 0.85-1.35% and Si 0.15-0.40%. This chemistry condition applies to shapes, while the separate heavy-section tensile exception specifies wide-flange shapes.', clauseRef: 'Table 3 note A; PDF/printed p.3', verified: true },
    { id: 'cmn-tradeoff', topic: 'CHEMISTRY CONDITIONS', text: 'For bars and plates, each full 0.01 percentage-point carbon decrease below its applicable maximum permits 0.06 percentage point more manganese above the applicable maximum, up to 1.35%. No manganese maximum is invented where Table 3 leaves manganese unspecified.', clauseRef: 'Table 3 note B; PDF/printed p.3', verified: true },
    { id: 'copper', topic: 'ORDERED CHEMISTRY', text: 'The 0.20% copper minimum applies when copper steel is ordered; it is not an unconditional A36 copper requirement.', clauseRef: 'Table 3 copper row; PDF/printed p.3', verified: true },
    { id: 'tensile', topic: 'TENSION TESTS', text: 'The test specimen represents material that must meet Table 2, except the bearing-plate and small-section provisions. The base requirements are yield point at least 250 MPa / 36 ksi and tensile strength 400-550 MPa / 58-80 ksi; apply the separately stated exceptions.', clauseRef: '§8.1; Table 2; PDF/printed p.2', verified: true },
    { id: 'thick-plate', topic: 'TENSION CONDITIONS', text: 'Plates thicker than 200 mm / 8 in. have a minimum yield point of 220 MPa / 32 ksi. This lower yield requirement does not apply to bars or shapes.', clauseRef: 'Table 2 note C; PDF/printed p.2', verified: true },
    { id: 'heavy-wideflange', topic: 'TENSION CONDITIONS', text: 'For wide-flange shapes with flange thickness above 75 mm / 3 in., the maximum tensile-strength limit is removed and the minimum short-gauge elongation is 19%.', clauseRef: 'Table 2 note B; PDF/printed p.2', verified: true },
    { id: 'elongation', topic: 'ELONGATION', text: 'For the selected specimen, plates/bars require 20% in 200 mm / 8 in. or 23% in 50 mm / 2 in.; shapes require 20% in the long gauge or 21% in the short gauge, subject to the heavy wide-flange exception. This is a specimen-dependent alternative, not two simultaneous elongation tests.', clauseRef: 'Table 2; PDF/printed p.2', verified: true },
    { id: 'elongation-plate', topic: 'ELONGATION CONDITIONS', text: 'For plates wider than 600 mm / 24 in., reduce the applicable minimum elongation by two percentage points. Floor plate does not require determination of elongation. A6/A6M orientation and other elongation-adjustment rules must also be applied.', clauseRef: 'Table 2 notes A, D and E; PDF/printed p.2', verified: true },
    { id: 'small-section', topic: 'TEST EXEMPTIONS', text: 'The manufacturer need not tension-test shapes below 645 mm² / 1 in.² area or nonflat bars below 12.5 mm / 0.5 in. thickness/diameter when their chemistry is suitable for Table 2 tensile properties. This does not remove the suitability requirement or a purchaser-required test.', clauseRef: '§8.2; PDF/printed p.2', verified: true },
    { id: 'impact', topic: 'OPTIONAL IMPACT TESTS', text: 'Base A36 does not prescribe an unconditional Charpy requirement. S5 invokes Charpy V-notch testing; S30 invokes structural-shape Charpy testing at an alternate core location. Obtain the applicable A6/A6M details and purchase-order acceptance criteria rather than inventing energy, temperature or subsize factors.', clauseRef: 'Supplementary requirements S5 and S30; PDF/printed p.3', verified: true },
    { id: 'single-heat', topic: 'OPTIONAL BUNDLING', text: 'When S32 is ordered, each bundle of shapes or bars must contain material from one heat.', clauseRef: 'S32.1; PDF/printed p.3', verified: true },
    { id: 'appurtenant', topic: 'RELATED PRODUCT FORMS', text: 'Components identified with the A36 designation but outside its scope must use the appropriate Table 1 specification unless otherwise ordered. Table 1 does not assign A36 chemistry or tensile limits to tubing, sheet, fasteners, castings or forgings; suitability for the intended use remains a design decision.', clauseRef: '§3.1; Table 1 and Note 1; PDF/printed p.2', verified: true }
  ]
};

// Kept separate from the strict grade schema so the UI can show complete
// requirement groups without introducing unsupported fields into imports.
A36_AUDIT.catalog = A36_AUDIT.requirements.map((item) => ({...item, status: 'verified in attached edition'}));

function applyAuditedA36(data) {
  const grade = data?.specBodies?.[A36_AUDIT.bodyKey]?.grades?.[A36_AUDIT.gradeKey];
  if (!grade) return data;
  const ref = (text, page = 3) => `${A36_AUDIT.edition}, ${text}; PDF/printed p.${page}`;
  const limit = (value, bound, unit, clauseRef, verified = true, displayNote = '') => ({value, bound, unit, clauseRef, verified, footnoteIds: [], displayNote});
  const pair = (unit, clauseRef, note = '', verified = false) => ({min: limit(null, 'MIN', unit, clauseRef, verified, note), max: limit(null, 'MAX', unit, clauseRef, verified, note)});
  const unresolved = 'Select product form, applicable dimensions and specimen context to resolve the correct requirement.';
  grade.specEdition = A36_AUDIT.edition;
  grade.applicableForms = ['PLATE', 'STRUCTURAL_SHAPE', 'BAR'];
  grade.verification = {
    lastVerifiedBy: 'Codex attachment source audit (not an ASTM certification)',
    lastVerifiedDate: A36_AUDIT.source.auditedOn,
    notes: 'A36/A36M-19 attachment, all 3 pages visually audited. Conditional requirements resolved from product/specimen context. Referenced A6/A6M was not attached; its requirements remain manual checks. Source SHA-256: ' + A36_AUDIT.source.sha256
  };
  grade.chemistry.analysisTypes = ['HEAT', 'PRODUCT'];
  grade.chemistry.elements = Object.fromEntries(['C', 'Mn', 'Si', 'P', 'S', 'Cu'].map((element) => [element, {
    heat: pair('wt_pct', ref('§7.1 and Table 3'), unresolved),
    product: pair('wt_pct', ref('§7.2 (A6/A6M product-analysis tolerances)', 2), 'A6/A6M product-analysis tolerances were not provided; do not assess against unadjusted heat limits.')
  }]));
  for (const key of ['ceIiw', 'cePcm']) grade.chemistry.carbonEquivalent[key].limit = limit(null, 'MAX', 'dimensionless', ref('§7 and Table 3'), true, 'A36/A36M-19 does not specify a base carbon-equivalent acceptance limit. Formula is an informational calculation.');
  grade.chemistry.carbonEquivalent.selectionRule = {type: 'NONE', threshold: null, clauseRef: ref('§7 and Table 3: no A36 carbon-equivalent selection rule')};
  grade.footnoteRules = [
    {id: 'a36_chem_A', type: 'TEXT_ONLY', displayText: 'For shape flange thickness >75 mm / 3 in., Mn 0.85-1.35% and Si 0.15-0.40%.', clauseRef: ref('Table 3 note A'), verified: true},
    {id: 'a36_context', type: 'TEXT_ONLY', displayText: unresolved, clauseRef: ref('Tables 2 and 3; §§5.2 and 8.2', 2), verified: true},
    {id: 'a36_copper', type: 'TEXT_ONLY', displayText: 'Copper minimum 0.20% applies only when copper steel is specified.', clauseRef: ref('Table 3 copper row'), verified: true}
  ];
  grade.mechanical.thicknessBreakpoints = [{
    tMin_mm: 0, tMax_mm: 1000000,
    clauseRef: ref('§8.1 and Table 2: context-dependent requirements, no upper thickness limit stated', 2),
    yieldStrength: pair('MPa', ref('Table 2 and note C', 2), unresolved),
    tensileStrength: pair('MPa', ref('Table 2 and note B', 2), unresolved),
    ytRatio: {max: limit(null, 'MAX', 'ratio', ref('Table 2: no base yield/tensile ratio limit', 2))},
    elongation: {type: 'FIXED', formula: null, params: null, fixedMin: limit(null, 'MIN', 'pct', ref('Table 2 and notes A/B/D/E', 2), false, unresolved), clauseRef: ref('Table 2 and notes A/B/D/E', 2), verified: false},
    hardness: {max: limit(null, 'MAX', 'HRC', ref('§8 and Table 2: no base hardness limit', 2))}
  }];
  const impactRef = ref('Supplementary requirements S5/S30');
  grade.charpy.required = false;
  grade.charpy.requiredBecause = 'Only when supplementary impact testing is ordered; S5 and S30 refer to A6/A6M. Purchase-order energy/temperature/specimen criteria must be confirmed.';
  grade.charpy.testTemp = {value: null, unit: 'degC', clauseRef: impactRef, verified: true};
  grade.charpy.orientation = 'EITHER';
  grade.charpy.energyFullSize = {average: {min: limit(null, 'MIN', 'J', impactRef)}, single: {min: limit(null, 'MIN', 'J', impactRef)}};
  grade.charpy.subSizeFactors = [];
  grade.charpy.shearArea = {min: limit(null, 'MIN', 'pct', impactRef)};
  grade.charpy.notes = ['No base Charpy temperature, energy, shear-area, orientation or subsize factor is stated in this A36 attachment. If impact testing is ordered, resolve the A6/A6M and order-specific acceptance criteria.'];
  grade.dwtt = null;
  grade.testing.testUnitDefinition = {text: 'A6/A6M defines the detailed test-unit rules; it was not attached. For coil-derived material, A36 §1.5 explicitly invokes additional A6/A6M testing and reporting.', clauseRef: ref('§§1.5, 4.1 and 4.2', 2), verified: true};
  grade.testing.frequencies = [
    {test: 'HEAT_ANALYSIS', frequency: 'Heat chemistry must meet Table 3 except §5.2. Determine/report heat manganese under A6/A6M even where no manganese limit is tabulated.', clauseRef: ref('§7.1; Table 3 Note 1'), verified: true},
    {test: 'TENSILE', frequency: 'Apply A6/A6M frequency, specimen and orientation rules; Table 2 governs properties. Bridge-bearing, nonbridge-bearing and small-section provisions are in §§5.1, 5.2 and 8.2.', clauseRef: ref('§§4.1, 5 and 8; Table 2', 2), verified: true},
    {test: 'CHEM_PRODUCT', frequency: 'Product analysis must meet Table 3 with A6/A6M tolerances. A6/A6M frequency/tolerances were not provided and are not invented.', clauseRef: ref('§7.2', 2), verified: true},
    {test: 'COIL_DERIVED', frequency: 'Additional A6/A6M requirements apply when supplied without heat treatment or with stress relieving only; verify its test/reporting details.', clauseRef: ref('§1.5 and §4.2 Note 1', 2), verified: true},
    {test: 'CVN_OPTIONAL', frequency: 'S5/S30 only if ordered; refer to A6/A6M and purchaser criteria.', clauseRef: impactRef, verified: true}
  ];
  grade.testing.retestProvisions = {text: 'A36 does not state stand-alone numerical retest rules. Use the current A6/A6M delivery/test provisions and purchase-order requirements; they were not supplied in this audit.', clauseRef: ref('§4.1', 2), verified: true};
  grade.testing.hydrotest = {formula: 'No hydrostatic-test requirement in the base A36 attachment', fiberStressPct: {value: null, clauseRef: ref('§8; Table 2', 2), verified: true}, notes: 'A36 plates, bars and shapes are not assigned a pipe hydrotest formula.'};
  grade.notes = A36_AUDIT.requirements.map((requirement) => ({id: `a36_${requirement.id}`, topic: requirement.topic === 'ORDERING' ? 'ORDERING' : requirement.topic === 'WELDING' ? 'WELDABILITY' : 'GENERAL', text: `${requirement.topic}: ${requirement.text}`, clauseRef: `${A36_AUDIT.edition}, ${requirement.clauseRef}`, verified: requirement.verified}));
  grade.notes.push({id: 'a36_appurtenant_list', topic: 'GENERAL', text: 'TABLE 1 REFERENCES: ' + A36_AUDIT.appurtenantMaterials.map(([form, spec]) => `${form}: ${spec}`).join('; '), clauseRef: ref('Table 1', 2), verified: true});
  if (grade.overlays?.CUSTOMER_SUPPLEMENT) grade.overlays.CUSTOMER_SUPPLEMENT.addedRequirements = [
    {description: 'Ordered supplementary requirements only: S5 Charpy V-notch; S30 alternate-core structural-shape Charpy; S32 single-heat shape/bar bundles. Obtain A6/A6M and purchase-order details.', clauseRef: impactRef, verified: true}
  ];
  return data;
}

function resolveAuditedA36(sourceGrade, context = {}) {
  const grade = JSON.parse(JSON.stringify(sourceGrade));
  const missingContext = [], manualChecks = [], contextNotes = [];
  const ref = (text, page = 3) => `${A36_AUDIT.edition}, ${text}; PDF/printed p.${page}`;
  const limit = (value, bound, unit, clauseRef, verified = true, displayNote = '', footnoteIds = []) => ({value, bound, unit, clauseRef, verified, footnoteIds, displayNote});
  const pair = (min, max, unit, clauseRef, note = '', footnotes = []) => ({min: limit(min, 'MIN', unit, clauseRef, true, note, footnotes), max: limit(max, 'MAX', unit, clauseRef, true, note, footnotes)});
  const numeric = (value) => value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value)) ? Number(value) : null;
  const form = context.form;
  const imperial = context.unitBasis === 'IMPERIAL';
  const thicknessMM = numeric(context.thicknessMM ?? context.tMM);
  const thickness = thicknessMM === null ? null : imperial ? thicknessMM / 25.4 : thicknessMM;
  const widthMM = numeric(context.widthMM);
  const width = widthMM === null ? null : imperial ? widthMM / 25.4 : widthMM;
  const flangeMM = numeric(context.shapeFlangeThicknessMM ?? context.flangeThicknessMM);
  const flange = flangeMM === null ? null : imperial ? flangeMM / 25.4 : flangeMM;
  const gaugeMM = numeric(context.gaugeLengthMM);
  const gauge = gaugeMM === null ? null : imperial ? gaugeMM / 25.4 : gaugeMM;
  const same = (a, b) => a !== null && Math.abs(a - b) < 1e-7;
  const above = (a, b) => a !== null && a - b > 1e-7;
  const need = (name) => { if (!missingContext.includes(name)) missingContext.push(name); };
  const basicValid = ['PLATE', 'BAR', 'STRUCTURAL_SHAPE'].includes(form);
  if (!basicValid) need('A36 product form: finished plate, bar or structural shape (unprocessed coils and tubing are outside this record)');
  if (thickness === null || thickness <= 0) need('Positive material thickness');
  if (form === 'PLATE' && (width === null || width <= 0)) need('Plate width');
  if (form === 'STRUCTURAL_SHAPE' && (flange === null || flange <= 0)) need('Shape flange thickness');
  const heavyShape = form === 'STRUCTURAL_SHAPE' && above(flange, imperial ? 3 : 75);
  if (heavyShape && !['WIDE_FLANGE', 'OTHER'].includes(context.shapeDesignation)) need('Shape designation: wide flange or other shape');
  const nonbridgeBearing = form === 'PLATE' && context.bearingUse === 'NON_BRIDGE' && above(thickness, imperial ? 1.5 : 40) && context.manufacturerTestRequired !== true;
  if (context.bearingUse === 'BRIDGE') contextNotes.push('Bridge bearing plates require mechanical testing unless the order specifies otherwise (§5.1).');
  if (nonbridgeBearing) {
    contextNotes.push('Section 5.2 nonbridge-bearing route selected: heat C 0.20-0.33%; Table 3 P/S; no required mechanical tests unless otherwise ordered.');
    manualChecks.push('Confirm sufficient discard to obtain sound bearing plates (§5.2).');
  }
  let chemicalCase = null;
  if (form === 'STRUCTURAL_SHAPE' && flange !== null && flange > 0) chemicalCase = A36_AUDIT.chemistryCases.find((row) => row.id === (heavyShape ? 'shape-heavy-flange' : 'shape'));
  if ((form === 'BAR' || form === 'PLATE') && thickness !== null && thickness > 0 && (form !== 'PLATE' || (width !== null && width > 0))) {
    const widthGroup = form === 'BAR' || !above(width, imperial ? 15 : 380) ? 'NARROW' : 'WIDE';
    chemicalCase = A36_AUDIT.chemistryCases.find((row) => row.width === widthGroup && (row.form === form || row.forms?.includes(form)) && above(thickness, imperial ? row.tMinIn : row.tMinSI) && ((imperial ? row.tMaxIn : row.tMaxSI) === null || !above(thickness, imperial ? row.tMaxIn : row.tMaxSI)));
  }
  grade.footnoteRules = grade.footnoteRules.filter((rule) => rule.id !== 'a36_chem_B');
  if (chemicalCase) {
    const footnotes = chemicalCase.footnotes || [];
    const chemRef = ref(`§7.1; Table 3, ${chemicalCase.id}${footnotes.length ? ', note A' : ''}`);
    const cMin = nonbridgeBearing ? 0.20 : null;
    const cMax = nonbridgeBearing ? 0.33 : chemicalCase.cMax;
    grade.chemistry.elements.C.heat = pair(cMin, cMax, 'wt_pct', nonbridgeBearing ? ref('§5.2', 2) : chemRef);
    grade.chemistry.elements.Mn.heat = pair(nonbridgeBearing ? null : chemicalCase.mnMin, nonbridgeBearing ? null : chemicalCase.mnMax, 'wt_pct', nonbridgeBearing ? ref('§5.2: only carbon and Table 3 phosphorus/sulfur prescribed', 2) : chemRef, '', footnotes);
    grade.chemistry.elements.Si.heat = pair(nonbridgeBearing ? null : chemicalCase.siMin, nonbridgeBearing ? null : chemicalCase.siMax, 'wt_pct', nonbridgeBearing ? ref('§5.2: only carbon and Table 3 phosphorus/sulfur prescribed', 2) : chemRef, '', footnotes);
    grade.chemistry.elements.P.heat = pair(null, chemicalCase.pMax, 'wt_pct', chemRef);
    grade.chemistry.elements.S.heat = pair(null, chemicalCase.sMax, 'wt_pct', chemRef);
    grade.chemistry.elements.Cu.heat = pair(context.copperSpecified === true ? 0.20 : null, null, 'wt_pct', ref('Table 3, copper-steel condition'), context.copperSpecified === true ? 'Copper steel specified.' : 'No copper-steel requirement selected.');
    if (!nonbridgeBearing && form !== 'STRUCTURAL_SHAPE' && chemicalCase.mnMax !== null) grade.footnoteRules.push({id: 'a36_chem_B', type: 'TRADEOFF_ADJUST', sourceElement: 'C', targetElement: 'Mn', adjustPerUnit: {sourceDecrement: 0.01, targetIncrement: 0.06}, ceiling: 1.35, unit: 'wt_pct', displayText: 'For each full 0.01 percentage-point C reduction below the applicable maximum, permit +0.06 percentage point Mn, capped at 1.35%.', clauseRef: ref('Table 3 note B'), verified: true});
    contextNotes.push('Heat chemistry: ' + (chemicalCase.label || chemicalCase.id) + '; ' + (imperial ? 'inch-pound table boundaries' : 'SI table boundaries') + '.');
  }
  // A36 incorporates A6 product tolerances; preserving nulls is intentional.
  if (String(context.analysisType || '').toUpperCase() === 'PRODUCT') {
    need('A6/A6M product-analysis acceptance tolerances (§7.2; referenced standard not supplied)');
    manualChecks.push('Product-analysis numerical limits require A6/A6M tolerances, which were not supplied (§7.2).');
  }
  const row = grade.mechanical.thicknessBreakpoints[0];
  const wideHeavy = heavyShape && context.shapeDesignation === 'WIDE_FLANGE';
  if (basicValid && thickness !== null && thickness > 0) {
    // The SI engine stores MPa. For inch-pound decisions, use exact standard ksi
    // converted to MPa, not the different standardized bracketed SI limits.
    const fromKsi = (value) => value === null ? null : value * 6.894757293168361;
    const normal = imperial ? A36_AUDIT.tensile.normalImperial : A36_AUDIT.tensile.normalSI;
    const asMPa = imperial ? fromKsi : (value) => value;
    const lowerYield = form === 'PLATE' && above(thickness, imperial ? 8 : 200);
    const yieldValue = lowerYield ? (imperial ? 32 : 220) : normal.yieldMin;
    const unitNote = imperial ? 'The separately standardized inch-pound limit is used; the engine stores its MPa conversion.' : '';
    row.yieldStrength = pair(asMPa(yieldValue), null, 'MPa', ref(`Table 2${lowerYield ? ' note C' : ''}`, 2), unitNote);
    row.tensileStrength = pair(asMPa(normal.tensileMin), heavyShape && !context.shapeDesignation ? null : wideHeavy ? null : asMPa(normal.tensileMax), 'MPa', ref(`Table 2${wideHeavy ? ' note B' : ''}`, 2), unitNote);
    if (heavyShape && !context.shapeDesignation) row.tensileStrength.max.verified = false;
    const shortGauge = same(gauge, imperial ? 2 : 50);
    const longGauge = same(gauge, imperial ? 8 : 200);
    let elongation = null;
    let elongationKnown = false;
    let elongationNote = '';
    if (form === 'PLATE' && context.floorPlate === true) {
      elongationKnown = true;
      elongationNote = 'Elongation need not be determined for floor plate (Table 2 note D).';
    } else if (!shortGauge && !longGauge) {
      need(imperial ? 'Tensile specimen gauge length: 2 in. or 8 in.' : 'Tensile specimen gauge length: 50 mm or 200 mm');
      elongationNote = 'Select the actual tensile specimen gauge length; also apply A6/A6M orientation and elongation-adjustment rules.';
    } else if (!(form === 'PLATE' && (width === null || width <= 0)) && !(shortGauge && heavyShape && !context.shapeDesignation)) {
      elongationKnown = true;
      elongation = longGauge ? 20 : form === 'STRUCTURAL_SHAPE' ? wideHeavy ? 19 : 21 : 23;
      if (form === 'PLATE' && above(width, imperial ? 24 : 600)) elongation -= 2;
      elongationNote = `${imperial ? gauge + ' in.' : gauge + ' mm'} specimen gauge; base Table 2 requirement${form === 'PLATE' && above(width, imperial ? 24 : 600) ? ' with 2 percentage-point wide-plate reduction' : ''}. A6/A6M adjustments may additionally apply.`;
    }
    row.elongation = {type: 'FIXED', formula: null, params: null, fixedMin: limit(elongation, 'MIN', 'pct', ref('Table 2 and notes A/B/D/E', 2), elongationKnown, elongationNote), clauseRef: ref('Table 2 and notes A/B/D/E', 2), verified: elongationKnown};
  }
  if (nonbridgeBearing) {
    row.yieldStrength = pair(null, null, 'MPa', ref('§5.2: mechanical testing not required unless otherwise specified', 2));
    row.tensileStrength = pair(null, null, 'MPa', ref('§5.2: mechanical testing not required unless otherwise specified', 2));
    row.elongation.fixedMin = limit(null, 'MIN', 'pct', ref('§5.2: mechanical testing not required unless otherwise specified', 2));
    row.elongation.verified = true;
    for (let index = missingContext.length - 1; index >= 0; index--) if (missingContext[index].startsWith('Tensile specimen gauge length:')) missingContext.splice(index, 1);
  }
  if (form === 'BAR' && thickness !== null && thickness < (imperial ? 0.5 : 12.5)) manualChecks.push('For a nonflat bar in this size range, §8.2 may exempt manufacturer tension testing if chemistry is suitable; confirm bar shape and purchase-order test requirements.');
  if (form === 'STRUCTURAL_SHAPE') manualChecks.push('If cross-sectional area is below 645 mm² / 1 in.², §8.2 may exempt manufacturer tension testing if chemistry is suitable; confirm area and purchase-order test requirements.');
  manualChecks.push('Confirm current A6/A6M general delivery, test-unit/frequency, retest, specimen orientation and any additional elongation adjustments; the referenced standard was not attached.');
  manualChecks.push('Verify killed-steel manufacture (§6.1), order-specific supplements and certification. Numeric lookup checks cannot establish these conditions.');
  if (context.impactSupplement === true) manualChecks.push('Impact supplement ordered: resolve S5/S30, A6/A6M and purchase-order acceptance temperature, energy and specimen criteria before acceptance.');
  return {grade, missingContext, manualChecks, contextNotes};
}
