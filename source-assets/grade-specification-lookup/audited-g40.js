/* Attached CSA G40.20-13/G40.21-13 (R2023), including Update No. 1 (May 2014).
 * Numeric tables checked against rendered source pages; see docs/g40-attached-edition-audit.md.
 * This is paraphrased engineering data, not a redistributed copy of the standard. */
const G40_AUDIT = {
  edition: 'CSA G40.20-13/G40.21-13 (R2023), Update No. 1 (May 2014)',
  sourceSha256: 'b70949ce0d8afc203d8b55abaf8286e8867d4359afb09f42102a0a8bb9b00e91',
  legacyAliases: ['230G', '260G', '300G', '230W'],
  conditionalContextFields: ['productSubtype', 'widthMM', 'tensileOrientation', 'gaugeLengthMM', 'tensileSpecimenType', 'impactCategory', 'supplyCondition', 'shapeGroup', 'shapeTestLocation', 'flangeThicknessMM'],
  impactCategories: {'1': 0, '2': -20, '3': -30, '4': -45},
  // Arrays are C max, Mn min/max, P min/max, S max, Si min/max, Nb+V max,
  // Cr min/max, Ni min/max, Cu min/max. Table 3 amended May 2014.
  plateChemistry: {
    '260W': [.20,.50,1.50,null,.04,.05,null,.40,.15],
    '300W': [.22,.50,1.50,null,.04,.05,null,.40,.15],
    '345WM': [.23,.50,1.60,null,.035,.045,.10,.40,.15,null,.35,null,.45,null,.60],
    '350W': [.23,.50,1.50,null,.04,.05,null,.40,.15],
    '380W': [.23,.50,1.50,null,.04,.05,null,.40,.15],
    '400W': [.23,.50,1.50,null,.04,.05,null,.40,.15],
    '450W': [.23,.50,1.50,null,.04,.05,null,.40,.15],
    '480W': [.26,.50,1.50,null,.04,.05,null,.40,.15],
    '550W': [.15,null,1.75,null,.04,.05,null,.40,.15],
    '260WT': [.20,.80,1.50,null,.03,.04,.15,.40,.15],
    '300WT': [.22,.80,1.50,null,.03,.04,.15,.40,.15],
    '345WMT': [.23,.80,1.50,null,.035,.045,.10,.40,.15,null,.35,null,.45,null,.60],
    '350WT': [.22,.80,1.50,null,.03,.04,.15,.40,.15],
    '400WT': [.22,.80,1.60,null,.03,.04,.15,.40,.15],
    '450WT': [.22,.80,1.50,null,.03,.04,.15,.40,.15],
    '480WT': [.26,.80,1.50,null,.03,.04,.15,.40,.15],
    '550WT': [.15,null,1.75,null,.03,.04,.15,.40,.15],
    '350R': [.16,null,.75,.05,.15,.04,null,.75,.15,.30,1.25,null,.90,.20,.60],
    '350A': [.20,.75,1.35,null,.03,.04,.15,.50,.15,null,.70,null,.90,.20,.60],
    '400A': [.20,.75,1.35,null,.03,.04,.15,.50,.15,null,.70,null,.90,.20,.60],
    '480A': [.20,1.00,1.60,null,.025,.035,.15,.50,.15,null,.70,.25,.50,.20,.60],
    '550A': [.15,null,1.75,null,.025,.035,.15,.50,.15,null,.70,.25,.50,.20,.60],
    '350AT': [.20,.75,1.35,null,.03,.04,.15,.50,.15,null,.70,null,.90,.20,.60],
    '400AT': [.20,.75,1.35,null,.03,.04,.15,.50,.15,null,.70,null,.90,.20,.60],
    '480AT': [.20,1.00,1.60,null,.025,.035,.15,.50,.15,null,.70,.25,.50,.20,.60],
    '550AT': [.15,null,1.75,null,.025,.035,.15,.50,.15,null,.70,.25,.50,.20,.60],
    '700Q': [.20,null,1.50,null,.03,.04,.15,.40,null],
    '700QT': [.20,null,1.50,null,.03,.04,.15,.40,null]
  },
  hssChemistry: {
    '300W': [.26,.30,1.20,null,.04,.05,null,.40,.10],
    '350W': [.23,.50,1.50,null,.04,.05,null,.40,.10],
    '380W': [.23,.50,1.50,null,.04,.05,null,.40,.10],
    '400W': [.20,null,1.65,null,.04,.05,null,.40,.10],
    '480W': [.20,null,1.75,null,.04,.05,null,.40,.12],
    '550W': [.15,null,1.85,null,.04,.05,null,.40,.15],
    '350WT': [.22,.50,1.50,null,.03,.04,.15,.40,.10],
    '380WT': [.22,.50,1.50,null,.03,.04,.15,.40,.10],
    '400WT': [.20,null,1.65,null,.03,.03,.15,.40,.10],
    '480WT': [.20,null,1.75,null,.03,.03,.15,.40,.12],
    '550WT': [.15,null,1.85,null,.03,.03,.15,.40,.15],
    '350A': [.20,.75,1.35,null,.03,.04,.15,.40,.10,null,.70,null,.90,.20,.60],
    '400A': [.20,null,1.65,null,.03,.03,.15,.40,.10,null,.70,null,.90,.20,.60],
    '480A': [.20,null,1.75,null,.03,.03,.15,.40,.12,null,.70,null,.90,.20,.60],
    '550A': [.15,null,1.85,null,.03,.03,.15,.40,.15,null,.70,null,.90,.20,.60],
    '350AT': [.20,.75,1.35,null,.03,.04,.15,.40,.10,null,.70,null,.90,.20,.60],
    '400AT': [.20,null,1.65,null,.03,.03,.15,.40,.10,null,.70,null,.90,.20,.60],
    '480AT': [.20,null,1.75,null,.03,.03,.15,.40,.12,null,.70,null,.90,.20,.60],
    '550AT': [.15,null,1.85,null,.03,.03,.15,.40,.15,null,.70,null,.90,.20,.60]
  },
  // Table 6: tensile min/max, yield <=65 / >65, elongation L200/L50/T200/T50, maximum table thickness.
  plateMechanical: {
    '260W': [410,590,260,250,20,23,18,21,200],
    '300W': [440,620,300,280,20,23,18,21,200],
    '345WM': [450,null,345,345,18,21,15,18,200],
    '350W': [450,650,350,320,19,22,17,20,200],
    '380W': [480,650,380,350,18,21,null,null,200],
    '400W': [520,690,400,370,16,18,13,15,200],
    '450W': [550,725,450,420,16,17,12,15,200],
    '480W': [590,790,480,450,15,17,12,14,200],
    '550W': [620,860,550,520,13,15,10,12,200],
    '260WT': [410,590,260,250,20,23,18,21,200],
    '300WT': [440,620,300,280,20,23,18,21,200],
    '345WMT': [450,null,345,345,18,21,15,18,200],
    '350WT': [450,650,350,320,19,22,17,20,200],
    '400WT': [520,690,400,370,16,18,13,15,200],
    '450WT': [550,725,450,420,16,17,12,15,200],
    '480WT': [590,790,480,450,15,17,12,14,200],
    '550WT': [620,860,550,520,13,15,10,12,200],
    '350R': [480,650,350,null,19,21,16,18,65],
    '350A': [480,650,350,350,19,21,17,19,100],
    '400A': [520,690,400,null,18,21,15,18,65],
    '480A': [590,790,480,null,15,17,12,14,65],
    '550A': [620,860,550,null,13,15,10,12,65],
    '350AT': [480,650,350,350,19,21,17,19,100],
    '400AT': [520,690,400,null,18,21,15,18,65],
    '480AT': [590,790,480,null,15,17,12,14,65],
    '550AT': [620,860,550,null,13,15,10,12,65],
    '700Q': [760,895,700,620,null,18,null,16,100],
    '700QT': [760,895,700,620,null,18,null,16,100]
  },
  // Table 7: tensile min/max, yield, L200/L50, commonly available size group.
  shapeMechanical: {
    '260W':[410,590,260,20,23,3], '300W':[440,620,300,20,23,3],
    '345WM':[450,null,345,18,21,3], '350W':[450,650,350,19,22,2],
    '380W':[480,650,380,18,21,2], '400W':[520,690,400,16,18,1],
    '480W':[590,790,480,15,17,1], '260WT':[410,590,260,20,23,3],
    '300WT':[440,620,300,20,23,3], '345WMT':[450,null,345,18,21,3],
    '350WT':[480,650,350,19,22,3], '400WT':[520,690,400,16,18,2],
    '480WT':[590,790,480,15,17,1], '350R':[480,650,350,19,21,3],
    '350A':[480,650,350,19,21,3], '400A':[520,690,400,18,21,2],
    '350AT':[480,650,350,19,21,3], '400AT':[520,690,400,18,21,2]
  },
  // Table 8: tensile min/max, yield, elongation in 50 mm.
  hssMechanical: {
    '300W':[410,590,300,23], '350W':[450,620,350,22], '380W':[480,650,380,21],
    '400W':[520,690,400,20], '480W':[590,790,480,17], '550W':[620,860,550,15],
    '350WT':[450,620,350,22], '380WT':[480,650,380,21], '400WT':[520,690,400,20],
    '480WT':[590,790,480,17], '550WT':[620,860,550,15],
    '350A':[480,650,350,21], '400A':[520,690,400,20], '480A':[590,790,480,17], '550A':[620,860,550,15],
    '350AT':[480,650,350,21], '400AT':[520,690,400,20], '480AT':[590,790,480,17], '550AT':[620,860,550,15]
  },
  impactSubsize: {
    20: {'10x7.5':15,'10x6.7':13,'10x5':11,'10x3.3':7,'10x2.5':5},
    27: {'10x7.5':20,'10x6.7':18,'10x5':14,'10x3.3':9,'10x2.5':7},
    34: {'10x7.5':26,'10x6.7':23,'10x5':17,'10x3.3':11,'10x2.5':8}
  },
  catalog: [
    {topic:'Attached edition and units',clauseRef:'G40.21-13 cl. 1.5; cover; Update No. 1 (May 2014)',text:'The attachment is the 2013 standard reaffirmed in 2023, with the May 2014 replacement Table 3. SI values are the units of record; imperial values are informational. This audit does not establish that a later market edition has not been published.',status:'AUDITED'},
    {topic:'Grade and form availability',clauseRef:'G40.21-13 cls. 1.2, 1.3, 4.2; Tables 1, 6-8',text:'W is weldable; WT is weldable notch tough; R is atmospheric corrosion resistant; A is corrosion resistant weldable; AT adds notch toughness; Q/QT are quenched and tempered plate. Grade 380W is available only in HSS, angles and bars; 380WT is HSS only. Tables 6, 7 and 8 distinguish flat products/bars/welded shapes, rolled shapes/sheet piling, and HSS. Manufacturer capability controls availability, and the commonly available shape group is not an unconditional prohibition on specially agreed manufacture.',status:'MANDATORY / MANUFACTURER AVAILABILITY'},
    {topic:'Ordering requirements',clauseRef:'G40.21-13 cls. 4.6-4.8',text:'Specify grade, form, dimensions, quantity, delivery or test-coupon condition, certification, impact category where required, API application, and invoked testing or special requirements. HSS orders identify class C or H and end condition. State a prohibition on plate made from coil when required. HSS defaults to square-cut ends with burr kept small; specified deburring is an order option.',status:'ORDER DEPENDENT'},
    {topic:'Tests by grade',clauseRef:'G40.21-13 cl. 4.3; Table 2',text:'Chemical composition and tensile properties apply to every listed grade. Impact tests are mandatory for WT, WMT, AT and QT types. Grain-size tests are performed when explicitly ordered; fine-grain production requirements and a mandatory grain-size test are different requirements.',status:'MANDATORY / ORDER DEPENDENT'},
    {topic:'Steelmaking and deoxidation',clauseRef:'G40.21-13 cls. 5.1-5.6',text:'Use basic electric or basic oxygen steelmaking. Rimmed/capped steel is permitted only for 300W HSS with wall thickness at most 16 mm. Type W thicker than 40 mm is killed and made to fine-grain practice; at 40 mm or below the purchaser may require that practice. Table 3 requires fine-grain practice for WT, A, AT, Q and QT. Where cl. 5.5 applies, meet austenitic grain number at least 5 over at least 70% of the inspected area, or the specified aluminium reporting route (acid soluble at least 0.015% or total at least 0.020%). Agreed Nb/V grain refinement is an alternative; cl. 5.6 exempts WT/AT/QT from the cl. 5.5 proof unless ordered.',status:'MANDATORY / ORDER DEPENDENT'},
    {topic:'Grouped heat lots',clauseRef:'G40.21-13 cls. 5.7, 7.4; G40.20-13 cl. 9.5',text:'Only 260W, 300W and 350W may group 2-5 heats within the permitted small product dimensions, not exceeding 25,000 kg of one size rolled together. Maximum dimensions are plate/bar thickness or bar diameter 14 mm, angle leg 125 mm, shape nominal depth 200 mm, and HSS perimeter 400 mm. Heats have common deoxidation/alloy practice and original CE values within 0.03% of the applicable reported analysis. Tensile-test each 25,000 kg of each size.',status:'CONDITIONAL PERMISSION'},
    {topic:'Delivery and heat treatment',clauseRef:'G40.21-13 cls. 4.4, 6.1-6.6',text:'Normal delivery is as rolled, except Q/QT. Controlled rolling, normalizing rolling or normalizing is permitted as provided by the order; notify the purchaser when used on as-rolled orders. HSS may be stress relieved, annealed or normalized. Normalized material requires specimens from the normalized material; separately normalized full-thickness coupons apply only as cl. 6.4 allows. Controlled/normalizing rolling can replace normalizing by purchaser agreement. Q/QT heat treatment heats to at least 900°C, liquid quenches below 320°C, and tempers at least 595°C; report treatment temperatures when required.',status:'MANDATORY / AGREEMENT DEPENDENT'},
    {topic:'Non-HSS heat chemistry',clauseRef:'G40.21-13 cl. 7.1; amended Table 3 pp. 61-62',text:'Apply the grade-specific C, Mn, P, S, Si, grain-refining and weathering-alloy limits. For 260W/260WT over 100 mm C max becomes 0.22%; for 300W/300WT and 350WT over 100 mm C max becomes 0.23%. Type W over 40 mm requires Si 0.15-0.40% unless the aluminium alternative applies. Grain-refining Nb+V totals exclude Al; when Nb is used in plate over 14 mm or a shape heavier than Group 1, Si is at least 0.15% unless the Al alternative applies. A purchaser may invoke Cu minimum 0.20% on any grade.',status:'MANDATORY / CONDITIONAL'},
    {topic:'Silicon and alloy alternatives',clauseRef:'G40.21-13 cl. 7.5; amended Table 3 notes (b),(c); Table 5 notes',text:'The purchaser or producer may omit the Si minimum where acid-soluble Al is at least 0.015% or total Al is at least 0.020%. Alternative chemistry cannot vary C/Mn/P/S, and requires mechanical compliance, producer evidence of equivalent required properties, and specific purchaser approval. Additional alloying in Table 3 needs purchaser approval; the HSS table permits producer use of additional alloys to obtain properties.',status:'APPROVAL / EVIDENCE REQUIRED'},
    {topic:'HSS heat chemistry',clauseRef:'G40.21-13 Table 5 p. 64',text:'HSS has its own chemistry table. The Mn minimum may be reduced to 0.30% only when Mn/C is at least 2 and Mn/S is at least 20. Si may use the qualified Al alternative. Nb/V combined maximum is grade dependent (0.10%, 0.12%, or 0.15%); Nb in wall thickness over 14 mm requires Si at least 0.15% unless the Al route applies. Weathering HSS requires Cr+Ni at least 0.40%. WT/AT HSS is made to fine-grain practice.',status:'MANDATORY / CONDITIONAL'},
    {topic:'Manganese permissions',clauseRef:'G40.21-13 amended Table 3 notes (g),(k)',text:'By prior purchaser agreement, the stated Mn maximum can be raised on grades covered by note (g) only while C+Mn/6 remains at most 0.40% for 350WT and 0.42% for 400WT/450WT/480WT/550W/550WT/550A/550AT. For 350A/400A/350AT/400AT, Mn can increase to 1.60% only while C+Mn/6 is at most 0.43%. These are conditional permissions, not a blanket IIW CE maximum.',status:'CONDITIONAL PERMISSION'},
    {topic:'Product analysis and reporting',clauseRef:'G40.21-13 cls. 7.2-7.3; G40.20-13 cl. 4',text:'Finished material must be capable of meeting product-analysis requirements; any product analysis follows ASTM A6/A6M tolerances. Those tolerances are referenced, rather than reproduced, in the attachment, so do not apply heat maxima directly to product analysis. Report heat analyses including required elements; plates, sheet, welded shapes and most hot-rolled shapes additionally report Cu/Cr/Ni/Mo/Nb/V. Certain values below 0.02% may be reported as less than 0.02% as specified.',status:'MANDATORY / REFERENCED STANDARD CHECK'},
    {topic:'Carbon equivalent',clauseRef:'G40.21-13 cls. 4.5, 7.7',text:'General CE maximum is purchaser/manufacturer agreed (Q/QT excluded from that permission); there is no generic fixed PCM maximum. IIW CE is C+Mn/6+(Cr+Mo+V)/5+(Ni+Cu)/15. WM/WMT clause 7.7(c) expressly specifies shapes: heat CE at most 0.45%, increased to 0.47% for flange thickness over 50 mm. Confirm applicability before assigning this clause to a nonshape form.',status:'ORDER DEPENDENT; WM/WMT SHAPE REQUIREMENT'},
    {topic:'WM/WMT additional restrictions',clauseRef:'G40.21-13 cl. 7.7; Tables 3, 6, 7',text:'Al-killed WM/WMT has total Al at least 0.015%. N is at most 0.015% with a nitrogen-binding addition, or at most 0.012% without that requirement. V at most 0.15%, Nb at most 0.05%, Nb+V at most 0.15%, and Mo at most 0.15%. Yield at most 450 MPa and Y/T at most 0.85; where a shape is required to be tested at the web, yield at most 480 MPa and Y/T at most 0.87.',status:'MANDATORY / CONDITIONAL'},
    {topic:'API plate additional chemistry',clauseRef:'G40.21-13 cl. 7.1.2; Table 4 p. 63',text:'API 620/650 plate adds maxima N 0.015%, Nb 0.05%, Mo 0.08%, Nb+V 0.10% with Nb at most 0.05%, V 0.10%, Cr 0.25%, Cu 0.35%, Ni 0.50%. Table 4 alloy additions not already specified require purchaser approval; supplementary N with V is reported and V/N is at least 4. Nb with/without V is limited to plate at most 14 mm unless Si is at least 0.15%. Applicable Table 6 tensile maxima become 140 MPa above the specified tensile minimum where its API footnote applies.',status:'API APPLICATION ONLY'},
    {topic:'Weathering steel',clauseRef:'G40.21-13 cl. 7.6; amended Table 3 notes (j),(l)',text:'Types R/A/AT require ASTM G101 atmospheric corrosion-resistance index at least 6.0. Type R requires Cr+Ni+Cu at least 1.00%; A/AT requires Cr+Ni at least 0.40%. The G101 predictive equation has a limited validated chemistry range, and actual service suitability must be assessed.',status:'MANDATORY / REFERENCED METHOD'},
    {topic:'Mechanical property selection',clauseRef:'G40.21-13 cl. 8.1; Tables 6-8',text:'Use Table 6 for plate, floor plate, bars, sheet and welded shapes; Table 7 for rolled shapes/sheet piling; Table 8 for HSS. Table 6 SI yield breakpoints are 65, 100, 150 and 200 mm, with grade-specific maximum coverage. HSS 350W/350WT tensile range is 450-620 MPa rather than the plate range of 450-650 MPa; rolled-shape 350WT tensile minimum is 480 MPa. No general hardness or hydrostatic-pressure requirement is provided by these grade tables.',status:'MANDATORY'},
    {topic:'Elongation selection and deductions',clauseRef:'G40.21-13 Tables 6-8; G40.20-13 cls. 7.2.1.2, 8.3.1-8.3.2',text:'Select actual gauge length and test orientation. Table 6 transverse elongation applies only to plate wider than 600 mm; when both gauge lengths are tabulated, only one must be reported. Floor plate has no required elongation. Full-section structural L specimens add 6 percentage points to elongation. Rectangular specimens below 8 mm use the thickness deduction schedule; sheet below 6 mm uses its distinct schedule. A 50 mm gauge at thickness over 90 mm uses the heavy-thickness deduction schedule. HSS gauge length is 50 mm. The actual coupon type and dimensions matter.',status:'MANDATORY / SPECIMEN DEPENDENT'},
    {topic:'Charpy category and full-size acceptance',clauseRef:'G40.21-13 cls. 8.2.1-8.2.6; Table 9(a),(b)',text:'WT/WMT/AT/QT orders identify category. Categories 1,2,3,4 test at 0,-20,-30,-45°C respectively. Category 5 has purchaser/manufacturer agreed temperature and/or energy. Standard full-size average of three longitudinal specimens is 20 J for 260WT/300WT, 27 J for the other WT/WMT/AT grades, and 34 J for 700QT. Every individual result is at least two thirds of the applicable average requirement. Actual temperature and all individual energies are reported; colder test temperatures are permitted if energy acceptance is met.',status:'MANDATORY'},
    {topic:'Charpy subsize and alternatives',clauseRef:'G40.21-13 cls. 8.2.5-8.2.7; Table 9(c); G40.20-13 Table 2',text:'Use the discrete tabulated subsize energy, not a generic proportional fraction. For full-size averages 20/27/34 J, 3/4-size values are 15/20/26; 2/3-size 13/18/23; 1/2-size 11/14/17; 1/3-size 7/9/11; 1/4-size 5/7/8 J. Individual minima remain two thirds of the selected subsize average. Transverse specimens need agreement and category 5 where values differ. By agreement lateral expansion can replace absorbed energy, requiring at least 0.40 mm for every specimen.',status:'MANDATORY / AGREEMENT DEPENDENT'},
    {topic:'Cold-formed channels and Z sections',clauseRef:'G40.21-13 cl. 6.7; Tables 11(f)-(h)',text:'Hot-rolled feed sheet follows the referenced A1011 SS Grade 340 or CSA 350W route; galvanized feed sheet follows the referenced A653 grade and at least Z180/G60 coating; 55% Al-Zn feed sheet follows A792 Grade 345A Class 1 with at least AZ150/AZ50 coating. Other published sheet specifications need yield at least 345 MPa, 50 mm elongation at least 10%, and actual UTS/YS at least 1.08.',status:'PRODUCT SUBTYPE / REFERENCED STANDARDS'},
    {topic:'Marking colour codes',clauseRef:'G40.21-13 cl. 9; Table 10',text:'Apply G40.20 identification. If colour identification is used, Table 10 gives primary/secondary colours by grade; add a copper-coloured stripe when minimum Cu is specified. Colour is an identification convention and does not replace certificate traceability or required grade/category information.',status:'MARKING METHOD DEPENDENT'}
  ]
};

function g40Limit(value, bound, unit, ref, displayNote = '') {
  return {value: value ?? null, bound, unit, clauseRef: `G40.21-13 (R2023), ${ref}`, verified: true, footnoteIds: [], displayNote};
}
function g40Pair(min, max, unit, ref) {return {min:g40Limit(min,'MIN',unit,ref),max:g40Limit(max,'MAX',unit,ref)};}
function g40Row(tMin, tMax, values, ref, elongation, maxYield = null, maxRatio = null) {
  return {tMin_mm:tMin,tMax_mm:tMax,clauseRef:`G40.21-13 (R2023), ${ref}`,
    yieldStrength:g40Pair(values[2],maxYield,'MPa',ref),tensileStrength:g40Pair(values[0],values[1],'MPa',ref),
    ytRatio:{max:g40Limit(maxRatio,'MAX','ratio',ref)},
    elongation:{type:'FIXED',formula:null,params:null,fixedMin:g40Limit(elongation,'MIN','pct',ref),clauseRef:`G40.21-13 (R2023), ${ref}`,verified:true},
    hardness:{max:g40Limit(null,'MAX','HRC',ref)}};
}
function g40ApplyChemistry(grade, designation, form, thickness) {
  const hss = form === 'HSS', ref = hss ? 'Table 5 (HSS heat analysis)' : 'Table 3 (May 2014 replacement, heat analysis)';
  const a = (hss ? G40_AUDIT.hssChemistry : G40_AUDIT.plateChemistry)[designation];
  grade.chemistry.elements = {};
  grade.footnoteRules = [];
  if (!a) return false;
  const add = (symbol,min,max) => {grade.chemistry.elements[symbol]={heat:g40Pair(min,max,'wt_pct',ref),product:null};};
  let carbon=a[0], siliconMin=a[6];
  if (!hss && thickness > 100) {
    if (['260W','260WT'].includes(designation)) carbon=.22;
    if (['300W','300WT','350WT'].includes(designation)) carbon=.23;
  }
  if (!hss && /W$|WM$/.test(designation) && thickness > 40) siliconMin=.15;
  add('C',null,carbon);add('Mn',a[1],a[2]);add('P',a[3],a[4]);add('S',null,a[5]);add('Si',siliconMin,a[7]);
  for (const [symbol,i] of [['Cr',9],['Ni',11],['Cu',13]]) if (a[i] != null || a[i+1] != null) add(symbol,a[i],a[i+1]);
  if (designation.startsWith('700')) add('B',.0005,.005);
  if (a[8] != null) grade.footnoteRules.push({id:'g40_nb_v_total',type:'COMBINED_MAX',elements:['Nb','V'],limit:a[8],unit:'wt_pct',displayText:`Nb + V at most ${a[8]}%; Al is excluded. Conditional silicon requirements still apply.`,clauseRef:`G40.21-13 ${ref}`,verified:true});
  if (designation.includes('WM')) {
    add('N',null,.015);add('Nb',null,.05);add('V',null,.15);add('Mo',null,.15);
  }
  grade.chemistry.analysisTypes=['HEAT','PRODUCT'];
  grade.chemistry.carbonEquivalent.ceIiw.limit=g40Limit(null,'MAX','dimensionless','cl. 4.5, agreed maximum only');
  grade.chemistry.carbonEquivalent.ceIiw.formula='C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15';
  grade.chemistry.carbonEquivalent.cePcm.limit=g40Limit(null,'MAX','dimensionless','cl. 4.5, no specified PCM limit');
  grade.chemistry.carbonEquivalent.selectionRule={type:'ALWAYS_IIW',threshold:null,clauseRef:'G40.21-13 cl. 4.5; cl. 7.7'};
  return true;
}
function g40SetImpact(grade, designation, category) {
  const impact=/WT$|WMT$|AT$|QT$/.test(designation), avg=designation==='700QT'?34:/^(260|300)WT$/.test(designation)?20:27;
  grade.charpy.required=impact;
  grade.charpy.requiredBecause=impact?'Impact testing and an ordered category are mandatory for this type.':'Table 2 does not require impact testing for this type; the order may add it.';
  grade.charpy.testTemp={value:impact?(G40_AUDIT.impactCategories[String(category)]??null):null,unit:'degC',clauseRef:'G40.21-13 Table 9(a); cl. 8.2.3',verified:true};
  grade.charpy.orientation='LONGITUDINAL';
  grade.charpy.energyFullSize={average:{min:g40Limit(impact?avg:null,'MIN','J','Table 9(b)')},single:{min:g40Limit(impact?avg*2/3:null,'MIN','J','cl. 8.2.6 (two thirds of required average)')}};
  grade.charpy.subSizeFactors=impact?Object.entries(G40_AUDIT.impactSubsize[avg]).map(([specimen,energy])=>({specimen,factor:energy/avg,clauseRef:'G40.21-13 Table 9(c), exact tabulated energy',verified:true})):[];
  grade.charpy.shearArea={min:g40Limit(null,'MIN','pct','cl. 8.2, no general shear-area minimum')};
  grade.charpy.notes=[{text:'Use the ordered impact category. Category 5 and lateral-expansion alternatives need documented agreed acceptance values. Subsize ratios encode exact Table 9(c) values.',clauseRef:'G40.21-13 cl. 8.2; Table 9',verified:true}];
}
function applyAuditedG40(data) {
  const body=data.specBodies?.CSA_G40_21;if(!body)return;
  const template=JSON.parse(JSON.stringify(body.grades.G40_350W));
  for(const key of Object.keys(body.grades)) if(!G40_AUDIT.plateChemistry[key.replace('G40_','')] && !G40_AUDIT.hssChemistry[key.replace('G40_','')]) delete body.grades[key];
  const designations=[...new Set([...Object.keys(G40_AUDIT.plateChemistry),...Object.keys(G40_AUDIT.hssChemistry)])];
  const imperial={260:38,300:44,345:50,350:50,380:55,400:60,450:65,480:70,550:80,700:100};
  for(const designation of designations){
    const grade=body.grades[`G40_${designation}`]||JSON.parse(JSON.stringify(template));
    const match=designation.match(/^(\d+)(.*)$/),alias=`${imperial[match[1]]}${match[2]}`;
    grade.displayName=`Grade ${designation} / Grade ${alias}`;grade.specEdition=G40_AUDIT.edition;
    grade.verification={lastVerifiedBy:'Attached-edition table and clause audit',lastVerifiedDate:'2026-09-29',notes:`Source SHA-256 ${G40_AUDIT.sourceSha256}. Tables and footnotes visually checked. Conditional context and referenced product-analysis tolerances remain explicit manual checks.`};
    grade.applicableForms=designation.startsWith('700')?['PLATE']:designation==='380WT'?['HSS']:designation==='380W'?['BAR','STRUCTURAL_SHAPE','HSS']:['PLATE','COIL','SHEET','BAR'];
    if(!designation.startsWith('700')&&designation!=='380WT'&&designation!=='380W'&&G40_AUDIT.shapeMechanical[designation])grade.applicableForms.push('STRUCTURAL_SHAPE');
    if(G40_AUDIT.hssChemistry[designation]&&!grade.applicableForms.includes('HSS'))grade.applicableForms.push('HSS');
    const initialForm=designation==='380WT'?'HSS':'PLATE';g40ApplyChemistry(grade,designation,initialForm,0);
    const a=G40_AUDIT.plateMechanical[designation]||G40_AUDIT.hssMechanical[designation];
    if(G40_AUDIT.plateMechanical[designation]){
      let lo=0;grade.mechanical.thicknessBreakpoints=[];
      for(const hi of [65,100,150,200].filter(v=>v<=a[8])){
        grade.mechanical.thicknessBreakpoints.push(g40Row(lo,hi,[a[0],a[1],lo===0?a[2]:a[3]],'Table 6(a), SI',a[5]));lo=hi;
      }
    }else grade.mechanical.thicknessBreakpoints=[g40Row(0,Number.MAX_SAFE_INTEGER,a,'Table 8(a), SI',a[3])];
    g40SetImpact(grade,designation,null);
    grade.psl=null;grade.category=null;grade.equivalents=[];
    grade.notes=[{id:'g40_attached_audit',topic:'GENERAL',text:'Select actual product form, specimen orientation/gauge and ordered impact category. Dimensional tolerances, production testing, manufacturing records and purchaser permissions require the detailed reference checks.',clauseRef:'G40.21-13 cls. 4-8; G40.20-13',verified:true}];
    grade.testing={testUnitDefinition:{text:'Heat, product form, shape size group and treatment define testing units; G40.20 clauses 9.1-9.6 set frequencies.',clauseRef:'G40.20-13 cl. 9',verified:true},frequencies:[{test:'TENSILE',frequency:'Normally two samples from different finished pieces per heat/product form/size group; cl. 9.1.1 reduction and Q/QT, grouped-heat, plate and coil rules apply.',clauseRef:'G40.20-13 cls. 9.1, 9.5, 9.6',verified:true},{test:'CHEM_PRODUCT',frequency:'Heat analysis and finished-product capability; product analysis, when performed, uses referenced ASTM A6/A6M tolerances.',clauseRef:'G40.20-13 cl. 4; G40.21-13 cls. 7.1-7.3',verified:true},...(grade.charpy.required?[{test:'CVN',frequency:'One sample per 50,000 kg or less of each heat/form/size group, each sample comprising three specimens; Q/QT and other conditional test units apply.',clauseRef:'G40.20-13 cls. 9.1.2, 9.2, 9.4',verified:true}]:[])],retestProvisions:{text:'Tensile requires two passing retests; impact retesting is restricted by the original shortfall and minimum individual results. Heat retreatment and specimen defects follow the separate provisions.',clauseRef:'G40.20-13 cl. 14',verified:true},hydrotest:{formula:'No general hydrostatic requirement in this standard',fiberStressPct:{value:null,clauseRef:'G40.21-13 Table 2',verified:true},notes:'HSS structural specification; do not substitute pipeline hydrostatic test criteria.'}};
    body.grades[`G40_${designation}`]=grade;
  }
}

function resolveAuditedG40(sourceGrade, context={}) {
  const grade=JSON.parse(JSON.stringify(sourceGrade));
  const designation=(grade.displayName.match(/Grade (\d+\w+)/)||[])[1];
  const result={grade,missingContext:[],manualChecks:[],contextNotes:[]};
  if(!G40_AUDIT.plateChemistry[designation]&&!G40_AUDIT.hssChemistry[designation])return result;
  const need=(text)=>result.missingContext.push(text),manual=(text)=>result.manualChecks.push(text);
  const t=Number(context.thicknessMM), form=context.form, subtype=context.productSubtype||form;
  if(!form||form==='ALL')need('Actual product form (plate, sheet, rolled/welded shape, bar or HSS)');
  const hss=form==='HSS'||subtype==='HSS';
  const rolled=(form==='STRUCTURAL_SHAPE'&&!['WELDED_SHAPE','COLD_FORMED_CHANNEL','COLD_FORMED_Z'].includes(subtype))||['ROLLED_SHAPE','ANGLE','SHEET_PILING'].includes(subtype);
  const floor=subtype==='FLOOR_PLATE',sheet=form==='COIL'||form==='SHEET'||subtype==='SHEET',ref=hss?'Table 8(a)':rolled?'Table 7(a)':'Table 6(a)';
  if(!g40ApplyChemistry(grade,designation,hss?'HSS':'PLATE',t)){need(`No heat-chemistry table covers ${designation} in this product form`);grade.mechanical.thicknessBreakpoints=[];return result;}
  const a=(hss?G40_AUDIT.hssMechanical:rolled?G40_AUDIT.shapeMechanical:G40_AUDIT.plateMechanical)[designation];
  if(!a){need(`No mechanical-property table covers ${designation} in this product form`);grade.mechanical.thicknessBreakpoints=[];return result;}
  if(designation==='380W'&&!hss&&form!=='BAR'&&subtype!=='ANGLE')need('380W is restricted to HSS, angles and bars (Table 1)');
  if(designation==='380WT'&&!hss)need('380WT is HSS only (Table 1)');
  const orientation=context.tensileOrientation||context.orientation;
  let gauge=Number(context.gaugeLengthMM),elongation=null,yieldMax=null,ratioMax=null;
  if(hss){gauge=50;elongation=a[3];if(orientation&&orientation!=='LONGITUDINAL')need('HSS tensile test uses the longitudinal specimen route');}
  else if(!floor){
    if(!['LONGITUDINAL','TRANSVERSE'].includes(orientation))need('Tensile specimen orientation (longitudinal or transverse)');
    if(![50,200].includes(gauge))need('Actual tensile gauge length (50 or 200 mm)');
    if(rolled){if(orientation==='TRANSVERSE')need('Table 7 gives longitudinal elongation only');elongation=gauge===200?a[3]:gauge===50?a[4]:null;}
    else{
      if(orientation==='TRANSVERSE'){
        if(form!=='PLATE'&&subtype!=='PLATE')need('Table 6 transverse elongation is applicable only to plate');
        if(!(Number(context.widthMM)>600))need('Transverse Table 6 elongation requires plate width over 600 mm');
        elongation=gauge===200?a[6]:gauge===50?a[7]:null;
      }else elongation=gauge===200?a[4]:gauge===50?a[5]:null;
    }
  }
  if(!floor&&elongation===null)need('No tabulated elongation covers the selected gauge/orientation');
  const coupon=context.tensileSpecimenType||context.specimenType;
  if(rolled&&subtype==='ANGLE'&&coupon==='FULL_SECTION'&&elongation!==null){
    if(![1,2].includes(Number(context.shapeGroup)))need('Full-section angle tests are permitted for shape groups 1 and 2 only (G40.20 Table 3)');
    elongation+=6;
  }
  if(!floor&&t<8&&elongation!==null){
    if(!coupon)need('Tensile specimen type is required for thin-material elongation deductions');
    if(coupon==='RECTANGULAR'||coupon==='STRIP'){
      const thresholds=sheet&&t<6?[[1.2,1.5,3.5],[1.5,2,3],[2,2.5,2.5],[2.5,3,2],[3,3.5,1.5],[3.5,4,1],[4,4.5,.5]]:[[1.1,3.2,7.5],[3.2,3.6,7],[3.6,3.9,6.5],[3.9,4.2,6],[4.2,4.6,5.5],[4.6,4.9,5],[4.9,5.2,4.5],[5.2,5.5,4],[5.5,5.9,3.5],[5.9,6.2,3],[6.2,6.6,2.5],[6.6,7,2],[7,7.3,1.5],[7.3,7.6,1],[7.6,7.9,.5]];
      const selected=thresholds.find(([lo,hi])=>t>=lo&&t<hi);
      if(selected){elongation-=selected[2];result.contextNotes.push(`Elongation reduced by ${selected[2]} percentage points under G40.20 cl. ${sheet&&t<6?'8.3.2':'8.3.1.1'}.`);}
      else if(t<(sheet&&t<6?1.2:1.1))need('Thickness is below the tabulated elongation deduction range');
    }
  }
  if(!floor&&gauge===50&&t>=90&&elongation!==null){
    if(t===90)manual('Heavy-thickness elongation boundary: cl. 8.3.1.2 prose says over 90 mm; its table starts at 90.00 mm. Confirm controlled acceptance at exactly 90 mm.');
    const deduction=Math.min(3,.5*(Math.floor((t-90)/12.5)+1));elongation-=deduction;
    result.contextNotes.push(`Elongation reduced by ${deduction} percentage points under G40.20 cl. 8.3.1.2.`);
  }
  if(designation.includes('WM')){
    const web=context.shapeTestLocation==='WEB';yieldMax=web?480:450;ratioMax=web?.87:.85;
    if(rolled&&!context.shapeTestLocation)need('WM/WMT shape tensile test location (flange or required web)');
    if(web)manual('WM/WMT web allowances apply only where the structural shape is required to be tested at the web (Table 6/7 footnote); verify the specimen record.');
    const flange=Number(context.flangeThicknessMM);
    if(rolled&&!(flange>0))need('WM/WMT flange thickness for carbon-equivalent limit');
    grade.chemistry.carbonEquivalent.ceIiw.limit=g40Limit(rolled?(flange>50?.47:.45):null,'MAX','dimensionless','cl. 7.7(c), specified shape limits');
    if(!rolled)manual('WM/WMT cl. 7.7(c) CE limits expressly describe shapes. Confirm applicability to the selected non-rolled-shape form; no CE maximum is automatically assigned.');
    manual('WM/WMT: confirm nitrogen-binding element or N ≤0.012% alternative; Al-killed steel requires total Al ≥0.015%.');
  }
  let rows=[];
  if(hss||rolled){rows=[g40Row(0,Number.MAX_SAFE_INTEGER,a,`${ref}, SI`,elongation,yieldMax,ratioMax)];result.contextNotes.push(`${ref} does not specify a numerical maximum thickness; manufacturing capability and general test provisions apply.`);}
  else{
    const bounds=[65,100,150,200].filter(v=>v<=a[8]);let lo=0;
    for(const hi of bounds){const values=[a[0],a[1],lo===0?a[2]:a[3]];rows.push(g40Row(lo,hi,values,`${ref}, SI`,floor?null:elongation,yieldMax,ratioMax));lo=hi;}
    if(t>a[8])need(`Selected thickness exceeds Table 6 coverage (${a[8]} mm for ${designation})`);
  }
  grade.mechanical.thicknessBreakpoints=rows;
  g40SetImpact(grade,designation,context.impactCategory);
  if(grade.charpy.required){
    if(!['1','2','3','4','5'].includes(String(context.impactCategory)))need('Ordered Charpy impact category (1-5)');
    if(String(context.impactCategory)==='5'){
      grade.charpy.energyFullSize.average.min.value=null;grade.charpy.energyFullSize.single.min.value=null;grade.charpy.subSizeFactors=[];
      need('Category 5 purchaser/manufacturer agreed test temperature and energy');
    }
    manual('Confirm Charpy sampling frequency, specimen location and orientation, actual test temperature, and retest history (G40.20 cl. 7, 9, 14).');
    manual('Apply G40.20 cl. 6.6 and referenced ASTM E29 conformance rounding; confirm boundary interpretation where the two-thirds individual-energy threshold is fractional. G40.21 cl. 8.2.6 does not impose a count limit on specimens below the required average.');
  }
  if(!context.supplyCondition)need('Actual supply/test condition (as rolled, normalized, controlled/normalizing rolled, or Q&T)');
  if(designation.startsWith('700')&&!['QT','QUENCHED_TEMPERED','QUENCHED_AND_TEMPERED'].includes(context.supplyCondition))need('700Q/700QT requires quenched and tempered supply/test condition');
  if(rolled){
    manual('Confirm structural shape size group and availability under G40.20 Table 1, G40.21 Table 7 and manufacturer agreement; groups 4/5 are not covered by the displayed Table 7 properties.');
    if(Number(context.shapeGroup)>3)need('Table 7 gives yield requirements for shape groups 1-3 only');
  }
  if(String(context.analysisType).toUpperCase()==='PRODUCT'){
    need('Product-analysis tolerances from referenced ASTM A6/A6M; attached G40 tables specify heat analysis');
  }
  manual('Confirm applicable dimensional/mass tolerances, surface quality and weld repair, sampling and retest records, traceability, marking, inspection and certificate contents (G40.20 clauses 4-18).');
  manual('Confirm purchaser options: Cu minimum, Si/Al alternative, Mn permission, optional CE maximum, API use, supplementary testing, and prohibited coil-derived plate where ordered.');
  manual('Verify Nb+V grain-refining sum and conditional Si minimum/qualified Al alternative; Al is excluded from the grain-refining total.');
  if(/(A|AT|R)$/.test(designation))manual('Verify required alloy sum (R: Cr+Ni+Cu ≥1%; A/AT: Cr+Ni ≥0.40%) and ASTM G101 corrosion-resistance index ≥6.0.');
  if(['COLD_FORMED_CHANNEL','COLD_FORMED_Z'].includes(subtype))need('Cold-formed channel/Z feedstock and coating route under cl. 6.7 requires referenced sheet-standard data');
  result.missingContext=[...new Set(result.missingContext)];result.manualChecks=[...new Set(result.manualChecks)];return result;
}

// General requirements: source clauses 1-18 and dimension table scopes, audited separately.
G40_AUDIT.catalog.push(...[
  {
    "topic": "Scope",
    "clauseRef": "G40.20-13 1.1",
    "text": "General requirements apply to G40.21 structural plates, shapes, sheet, sheet piling, cold-formed channels, hollow sections, Z sections, and bars, unless superseded by the purchase order or individual standard. G40.21 Tables 11(a)-(h) supply common structural section dimensions and unit masses.",
    "status": "verified"
  },
  {
    "topic": "Requirement language",
    "clauseRef": "G40.20-13 1.2",
    "text": "Shall is mandatory; should is recommendation; may is permission. Clause notes are explanatory, while table/figure notes form part of those tables/figures and can contain requirements. Annexes are designated normative or informative.",
    "status": "verified"
  },
  {
    "topic": "Units",
    "clauseRef": "G40.20-13 1.3",
    "text": "SI values are the units of record; parenthesized values are information/comparison. Do not freely intermingle unit systems in a calculation.",
    "status": "verified"
  },
  {
    "topic": "References",
    "clauseRef": "G40.20-13 2",
    "text": "Referenced publications apply at the editions listed in the standard; applying newer editions is suggested investigation, not an automatic substitution.",
    "status": "verified"
  },
  {
    "topic": "Product definitions",
    "clauseRef": "G40.20-13 3.1",
    "text": "Bars include rounds/squares/hexagons of any size; flats up to 150 mm width and over 5 mm thick, or over 150 to 200 mm width and over 6 mm thick. Bar-size flanged shapes/angles have maximum cross-section dimension < 75 mm; structural-size shapes have at least one cross-section dimension >= 75 mm.",
    "status": "verified"
  },
  {
    "topic": "Product definitions",
    "clauseRef": "G40.20-13 3.1",
    "text": "Plate normally is hot-rolled flat steel over 200 mm wide and >= 6 mm thick, or over 1200 mm wide and >= 4.5 mm thick. Sheet includes all widths and thickness < 6 mm, supplied in coils or cut lengths. Plate cut from coils is plate provided from coils; post-decoiling heat treatment beyond stress relief changes that classification.",
    "status": "verified"
  },
  {
    "topic": "Product definitions",
    "clauseRef": "G40.20-13 3.1",
    "text": "Coiled plate cannot be qualified until processed into individual plate lengths. Floor plate dimensions follow ASTM A786/A786M or agreement. Super light beams are I-type sections with nominal mass < 6.5 kg/m. Welded shapes are I-type sections fabricated from three components with automatic/mechanized welding.",
    "status": "verified"
  },
  {
    "topic": "Hollow section class",
    "clauseRef": "G40.20-13 3.1",
    "text": "Class C HSS is cold-formed seamless tubing or tubing with continuous automatic electric weld. Class H is hot-formed tubing made by the permitted seamless/furnace-butt/automatic-electric processes, or cold-formed seamless/electric-weld tubing subsequently stress relieved at >= 450 degrees C and air cooled. ERW longitudinal joints must weld through thickness and provide section structural design strength.",
    "status": "verified"
  },
  {
    "topic": "General definitions",
    "clauseRef": "G40.20-13 3.2",
    "text": "Fine grain practice normally yields austenitic grain size No. 5 or finer; acceptance requires that size over >= 70% examined area. Fine grain steel qualifies by grain size No. 5 or finer over >= 70%, or reported heat aluminum >= 0.020% total or >= 0.015% acid-soluble.",
    "status": "verified"
  },
  {
    "topic": "General definitions",
    "clauseRef": "G40.20-13 3.2",
    "text": "A grouped heat lot combines two to five heats rolled together and identified by a distinctive lot number. Heat number can mean cast number, grouped heat lot number, or welded shape number. A piece as rolled is product directly rolled from one slab/bloom/billet/ingot, not a description of heat-treatment condition.",
    "status": "verified"
  },
  {
    "topic": "Heat treatment definition",
    "clauseRef": "G40.20-13 3.2",
    "text": "Normalized plate is reheated above Ac3 (approximately 830-900 degrees C), air cooled, and designated N. Normalized rolled plate finishes rolling above upper transformation temperature and cools in still air, designated NR; the processes are distinct.",
    "status": "verified"
  },
  {
    "topic": "Chemistry testing",
    "clauseRef": "G40.20-13 4.1.1-4.1.3",
    "text": "Manufacturer analyzes every heat for each specified/restricted element using ASTM A751. Samples normally come from pouring; if unavailable/unrepresentative, analyze at least 3 random solid-steel samples and report their average. Documented heat composition must meet the grade.",
    "status": "verified"
  },
  {
    "topic": "Chemistry testing",
    "clauseRef": "G40.20-13 4.1.4",
    "text": "Grouped heat analysis is the average analysis of each original piece assigned to the group. Each individual analysis must meet restricted elements subject to ASTM A751 product tolerances; group average must meet specified grade.",
    "status": "verified"
  },
  {
    "topic": "Product analysis",
    "clauseRef": "G40.20-13 4.2",
    "text": "Purchaser may analyze representative finished-product samples per heat at mechanical-test pieces or Figure 1/2 locations. Apply specified product limits or ASTM A6/A6M product tolerances; an element must not vary both below and above a specified range in the same heat. Carbon/phosphorus/sulphur restrictions do not apply to rimmed/capped product analysis absent clear misapplication.",
    "status": "verified"
  },
  {
    "topic": "Dimensions scope",
    "clauseRef": "G40.20-13 5 notes,5.1",
    "text": "CSA tolerance tables take precedence over corresponding referenced ASTM tables. Use steel density 7850 kg/m^3.",
    "status": "verified"
  },
  {
    "topic": "Dimensions scope",
    "clauseRef": "G40.20-13 5.2-5.7",
    "text": "Plate dimensions/workmanship: ASTM A6/A6M, flatness Table 4. Structural-size shapes: mass/area within 2.5% theoretical and dimensional Tables 5, 6, 8, 9 plus ASTM A6/A6M. Sheet piling mass within 2.5% specified/theoretical. Uncoated sheet: Table 24 and ASTM A568/A568M; hot-dip metallic coated sheet: ASTM A924/A924M. Bars/bar-size shapes: ASTM A6/A6M. Welded shapes: Tables 8, 9. These tolerance selections require geometry/product context and are manual-review scope if that context is absent.",
    "status": "verified"
  },
  {
    "topic": "Hss tolerances",
    "clauseRef": "G40.20-13 5.8.1-5.8.2",
    "text": "HSS workmanship/dimensional scope references Tables 10-17. Actual mass of each HSS length must be within -3.5%/+10% of G40.21 Tables 11(c)-(e) theoretical mass.",
    "status": "verified"
  },
  {
    "topic": "Hss tolerances",
    "clauseRef": "G40.20-13 5.8.3-5.8.5",
    "text": "HSS wall thickness must be within -5%/+10% of ordered nominal, except the weld seam may exceed the upper limit. Rectangular wall thickness is measured at the middle of the flat. Actual cross-section dimension values are in Table 12 and outside corner radii in Table 13; printed clauses refer instead to Tables 10 and 11. Meeting wall tolerance does not automatically meet mandatory mass tolerance.",
    "status": "verified-source-cross-reference-anomaly"
  },
  {
    "topic": "Hss tolerances",
    "clauseRef": "G40.20-13 5.8.6-5.8.8",
    "text": "Rectangular corner angle is 90 degrees +/-1 degree hot formed or +/-2 degrees cold formed, determined from average side slopes. Straightness deviation <= total length/500. Actual twist values are in Table 16 and ordered lengths in Table 17; the printed clause instead names Tables 12 and 13.",
    "status": "verified-source-cross-reference-anomaly"
  },
  {
    "topic": "Super light beam tolerances",
    "clauseRef": "G40.20-13 5.9",
    "text": "Super light beam area/mass variation -2.5%/+7.5% theoretical G40.21 Table 11(b); dimensional tolerances Tables 5-7 and ASTM A6/A6M.",
    "status": "verified"
  },
  {
    "topic": "Cold formed tolerances",
    "clauseRef": "G40.20-13 5.10.1-5.10.6",
    "text": "Cold-formed channels/Z sectional dimensions are tabulated in actual Table 23, while the printed clause names Table 14. Minimum base steel excludes protective coatings. Delivered thickness >= 95% of design thickness; cut length +/-3 mm; straightness <= L/500; relevant corners 90 degrees +/-3 degrees measured >= 100 mm from end; inside corner radius 1-4 times nominal thickness.",
    "status": "verified-source-cross-reference-anomaly"
  },
  {
    "topic": "Test condition",
    "clauseRef": "G40.20-13 6.1-6.5",
    "text": "Default specimens from as-rolled material. Normalized/stress-relieved specimens from treated product or full-thickness/full-section same-piece/heat coupons treated similarly and simultaneously. Q&T specimens from material heat treated for use. By agreement, normalized steel may qualify from laboratory-normalized separate coupons, with treatment evidence on request. Manufacturer may normalize steel ordered as rolled and should advise purchaser.",
    "status": "verified"
  },
  {
    "topic": "Rounding",
    "clauseRef": "G40.20-13 6.6",
    "text": "Round tensile/yield strength to nearest 5 MPa (1 ksi) to determine conformance. Other limiting values round to nearest unit in the rightmost place, using ASTM E29 procedures.",
    "status": "verified"
  },
  {
    "topic": "Specimen location",
    "clauseRef": "G40.20-13 7.1.1",
    "text": "For as-rolled/heat-treated sampling, the tensile central portion or impact notch area is at least the lesser of 50 mm and the material thickness from the material edge or end or heat-treated coupon.",
    "status": "verified"
  },
  {
    "topic": "Tensile sampling",
    "clauseRef": "G40.20-13 7.1.2.1-7.1.2.2",
    "text": "Plate specimens follow ASTM A6/A6M. Plate from coils requires 2 tensile samples each tested coil: first immediately before first qualifying plate after sufficient discard, second approximately centre lap; both per ASTM A6/A6M.",
    "status": "verified"
  },
  {
    "topic": "Tensile sampling",
    "clauseRef": "G40.20-13 7.1.2.3",
    "text": "Shapes sampled at one end: super light beams/channels webs; angle/zee legs; rolled tee stems (Figure 1). Manufacturer may full-section test Table 3 permitted shapes. W/H/P/S/M sampled in web when flanges < 150 mm wide, flange when >= 150 mm.",
    "status": "verified"
  },
  {
    "topic": "Tensile sampling",
    "clauseRef": "G40.20-13 7.1.2.4-7.1.2.5",
    "text": "Welded-shape individual plates/bars tested by their own sampling requirements; specimens may come from finished shape if necessary. Bars sampled at one end and tested full size if possible, otherwise ASTM A6/A6M locations.",
    "status": "verified"
  },
  {
    "topic": "Tensile sampling",
    "clauseRef": "G40.20-13 7.1.2.6",
    "text": "HSS sample at one end in Figure 1 locations at least 90 degrees from weld. Gauge length 50 mm; specimen area determined by mean wall thickness or weighing. Full-size samples permitted within machine capacity.",
    "status": "verified"
  },
  {
    "topic": "Tensile sampling",
    "clauseRef": "G40.20-13 7.1.2.7.1",
    "text": "Sheet cut from coils requires 2 tensile samples each tested coil: first before first qualifying sheet following sufficient discard, second centre lap. Both midway between sheet centreline and one edge, following ASTM A6/A6M.",
    "status": "verified"
  },
  {
    "topic": "Tensile sampling",
    "clauseRef": "G40.20-13 7.1.2.7.2",
    "text": "Sheet in coils sampled midway between centreline and edge. Each heat >= 45000 kg requires 2 tensile tests; heat < 45000 kg requires 1. If thickness variation from one heat >= 0.64 mm, test thickest and thinnest regardless of represented weight. This 45000 kg sheet threshold is distinct from general 9.1.1 threshold 50000 kg.",
    "status": "verified"
  },
  {
    "topic": "Impact sampling",
    "clauseRef": "G40.20-13 7.1.3.1-7.1.3.2",
    "text": "Plate impact samples follow ASTM A6/A6M. Plate from coils requires 2 impact samples each tested coil: before first qualifying plate after discard and at approximate centre lap, following ASTM A6/A6M.",
    "status": "verified"
  },
  {
    "topic": "Impact sampling",
    "clauseRef": "G40.20-13 7.1.3.3-7.1.3.6",
    "text": "Shape impact sample from one end approximately 1/3 toe-to-web/heel distance (Figure 2). Welded-shape components follow plate/bar requirements; finished-shape sample permitted if necessary. Bar sample at one end per ASTM A6/A6M; HSS at one end Figure 2 and at least 90 degrees from weld.",
    "status": "verified"
  },
  {
    "topic": "Impact sampling",
    "clauseRef": "G40.20-13 7.1.3.7.1-7.1.3.7.2",
    "text": "Cut-length sheet requires 2 impact samples per tested coil, outer lap before first qualifying sheet after discard and centre lap per ASTM A6/A6M. Sheet supplied in coils requires one impact test per tested coil, sampled midway between centreline and edge.",
    "status": "verified"
  },
  {
    "topic": "Tensile preparation",
    "clauseRef": "G40.20-13 7.2.1.1-7.2.1.3",
    "text": "Where practical use full-thickness tensile specimens prepared per ASTM A6/A6M. Direction is manufacturer discretion unless specified; transverse normally for plates > 600 mm wide, longitudinal for other products; only chosen orientation evaluated. HSS machined specimens follow ASTM A370; round-section specimens must not be flattened between gauge marks.",
    "status": "verified"
  },
  {
    "topic": "Tensile preparation",
    "clauseRef": "G40.20-13 7.2.1.4-7.2.1.6",
    "text": "Full-section shape tensile specimens have 200 mm gauge. Angle full-section yield/tensile calculation uses theoretical area based on specimen mass. Sheet tensile specimen machining follows sheet-type ASTM A370 dimensions.",
    "status": "verified"
  },
  {
    "topic": "Impact preparation",
    "clauseRef": "G40.20-13 7.2.2.1-7.2.2.4",
    "text": "Use Charpy V-notch ASTM A370 dimensions except subsize allowance. Long direction parallel final rolling direction unless product requirement/agreement permits transverse; notch axis perpendicular rolled surface. For thickness >= 11 mm, specimen located as close as practical halfway between surface and mid-thickness. Machined specimen excludes material within 0.5 mm of rolled surface.",
    "status": "verified"
  },
  {
    "topic": "Impact preparation",
    "clauseRef": "G40.20-13 7.2.2.5",
    "text": "For thickness < 11 mm prepare largest feasible standard subsize specimen and use Table 2 minimum average energies. Table 2 gives size fractions but no physical specimen dimensions; those are delegated to ASTM A370. Do not invent dimension cutoffs from this PDF alone.",
    "status": "verified"
  },
  {
    "topic": "Test method",
    "clauseRef": "G40.20-13 8.1-8.2",
    "text": "Mechanical tests follow ASTM A370. Full-section angle grips engage both legs except fillet/apex.",
    "status": "verified"
  },
  {
    "topic": "Elongation adjustment",
    "clauseRef": "G40.20-13 8.3.1.1",
    "text": "Rectangular tensile specimen thin-material correction for nominal thickness < 8 mm: deduction in percentage points for mm bands 7.60-7.89: 0.5; 7.30-7.59: 1; 7.00-7.29: 1.5; 6.60-6.99: 2; 6.20-6.59: 2.5; 5.90-6.19: 3; 5.50-5.89: 3.5; 5.20-5.49: 4; 4.90-5.19: 4.5; 4.60-4.89: 5; 4.20-4.59: 5.5; 3.90-4.19: 6; 3.60-3.89: 6.5; 3.20-3.59: 7; 1.10-3.19: 7.5. Requires specimen geometry and actual band context; no table value is provided for 7.90-7.99 or below 1.10 mm.",
    "status": "verified"
  },
  {
    "topic": "Elongation adjustment",
    "clauseRef": "G40.20-13 8.3.1.2",
    "text": "For 50 mm gauge thick material, prose says over 90 mm and 0.5 percentage-point deduction per 12.5 mm increment above 90 capped at 3. Tabulated bands(mm: deduction): 90.00-102.49: 0.5; 102.50-114.99: 1; 115.00-127.49: 1.5; 127.50-139.99: 2; 140.00-152.49: 2.5; >= 152.50: 3. Table starts 90.00 whereas prose says over 90; flag exact 90 mm boundary for review.",
    "status": "verified-source-boundary-ambiguity"
  },
  {
    "topic": "Elongation adjustment",
    "clauseRef": "G40.20-13 8.3.2",
    "text": "Sheet is all widths and thickness < 6 mm. For sheet thickness < 4.5 mm apply percentage-point deductions(mm: deduction): 4.00-4.49: 0.5; 3.50-3.99: 1; 3.00-3.49: 1.5; 2.50-2.99: 2; 2.00-2.49: 2.5; 1.50-1.99: 3; 1.20-1.49: 3.5. Below 1.20 mm no deduction row supplied.",
    "status": "verified"
  },
  {
    "topic": "Grain size method",
    "clauseRef": "G40.20-13 8.4",
    "text": "Austenitic grain size measured on specimen per ASTM E112.",
    "status": "verified"
  },
  {
    "topic": "Tensile frequency",
    "clauseRef": "G40.20-13 9.1.1",
    "text": "For as-rolled/normalized material, 2 tensile samples from different finished pieces per heat, product form, and size group. 1 is enough when heat size or applicable size-group/thickness-variation product amount < 50000 kg. Additional tests for differing thicknesses follow 9.1.4. Plate/sheet cut from coils requires outer-lap and centre-lap sampling per 7.1.2.2. Tensile testing includes tensile strength, yield point, yield strength, elongation, and reduction of area.",
    "status": "verified"
  },
  {
    "topic": "Impact frequency",
    "clauseRef": "G40.20-13 9.1.2",
    "text": "When required, one impact sample for each 50000 kg or less of each heat/product form/size group; thickness variation requires 9.1.5 additional samples. Plate/sheet cut from coils requires outer-lap and centre-lap impact samples per 7.1.3.2.",
    "status": "verified"
  },
  {
    "topic": "Size groups",
    "clauseRef": "G40.20-13 9.1.3",
    "text": "Mechanical-testing thickness size groups: A <= 20 mm for plates, bars, HSS, super-light beams, channels, angles; B > 20-40 mm for plates, bars, angles; C > 40-65 mm for plates, bars; D > 65 mm for plates, bars. These are test-frequency groups, distinct from tensile-property shape Groups 1-3 in Table 1.",
    "status": "verified"
  },
  {
    "topic": "Additional tensile frequency",
    "clauseRef": "G40.20-13 9.1.4.1-9.1.4.2",
    "text": "Same heat/form/size group: add tensile sample for each thickness deviation above/below previous sample exceeding A: 5 mm/B: 10 mm/C: 15 mm/D: 20 mm; structural-size thickness means web thickness. Manufacturer may waive already-covered adjacent-group material within thinner-group tolerance if purchaser notified.",
    "status": "verified"
  },
  {
    "topic": "Additional tensile frequency",
    "clauseRef": "G40.20-13 9.1.4.3-9.1.4.4",
    "text": "Plate from same-heat coils: additional set each thickness deviation > 3 mm. Sheet same heat: additional set each deviation > 1.3 mm above/below first/subsequent sample thickness.",
    "status": "verified"
  },
  {
    "topic": "Additional impact frequency",
    "clauseRef": "G40.20-13 9.1.5.1-9.1.5.3",
    "text": "Test thickest product from each heat/form/size group; add impact sample for each thickness decrease > A: 5 mm/B: 10 mm/C: 15 mm/D: 20 mm, structural-size thickness measured as flange thickness. Previously tested thicker same-heat material may qualify thinner material within these limits. Adjacent thicker size-group tests suffice when thickness difference does not exceed thinner-group limit.",
    "status": "verified"
  },
  {
    "topic": "Additional impact frequency",
    "clauseRef": "G40.20-13 9.1.5.4-9.1.5.5",
    "text": "Plate from same-heat coils: test thickest and add set each thickness decrease > 3 mm. Sheet: test thickest and add set each thickness deviation > 1.3 mm above/below first/subsequent samples.",
    "status": "verified"
  },
  {
    "topic": "Quenched tempered frequency",
    "clauseRef": "G40.20-13 9.2",
    "text": "After heat treatment, take 1 sample at one end of first plate and every third plate thereafter (1, 4, 7, 10, etc.). Lot means plates with same heat, thickness, prior condition, and heat treatment.",
    "status": "verified"
  },
  {
    "topic": "Per piece frequency",
    "clauseRef": "G40.20-13 9.3.1",
    "text": "Purchaser may require mechanical test from every section > 5000 kg each and every plate, as rolled or heat treated.",
    "status": "verified"
  },
  {
    "topic": "Per piece frequency",
    "clauseRef": "G40.20-13 9.3.2",
    "text": "As-rolled per-piece testing is unavailable for sections < 5000 kg each, HSS, sheet piling, bars. Purchaser may require tests each 5000 kg same heat/nominal size/thickness/diameter for as-rolled or continuous-furnace treated material. Noncontinuous furnace requires 1 sample per furnace charge for each 5000 kg same size/thickness/diameter. Exactly 5000 kg sections fall between explicit > and < wordings; do not infer.",
    "status": "verified-source-boundary-ambiguity"
  },
  {
    "topic": "Samples tests",
    "clauseRef": "G40.20-13 9.4",
    "text": "Each test sample produces 1 tensile test and, when impact required, 3 impact specimens.",
    "status": "verified"
  },
  {
    "topic": "Grouped heat frequency",
    "clauseRef": "G40.20-13 9.5",
    "text": "1 tensile test per 25000 kg of product of each size produced from grouped heat material.",
    "status": "verified"
  },
  {
    "topic": "Grain test frequency",
    "clauseRef": "G40.20-13 9.6",
    "text": "Where fine grain steel is specified by G40.21/purchaser, product of each heat requires 1 ASTM E112 austenitic grain-size determination or 1 aluminum determination, unless purchaser specifically requires grain-size test.",
    "status": "verified"
  },
  {
    "topic": "Normalizing",
    "clauseRef": "G40.20-13 10.1",
    "text": "Uniformly heat to at/above upper critical transformation temperature then air cool substantially below lower critical temperature. For thickness > 50 mm manufacturer may accelerate cooling with uniform air blast/liquid spray to develop properties comparable to thinner normalized material.",
    "status": "verified"
  },
  {
    "topic": "Quench temper",
    "clauseRef": "G40.20-13 10.2",
    "text": "Q&T must achieve G40.21 mechanical properties: uniformly heat to >= 900 degrees C, quench with liquid immersion/sprays to < 320 degrees C, uniformly temper at >= 595 degrees C or product-stipulated temperature, then air cool or requench. Report heat-treatment temperature on certificate if required.",
    "status": "verified"
  },
  {
    "topic": "Quality",
    "clauseRef": "G40.20-13 11.1-11.3",
    "text": "Material must have good finish and be free from defects: cracks; internal discontinuities exceeding ASTM A435 ultrasonic limits; other flaws beyond supplier/purchaser agreed frequency/distribution. Surface finish/acceptance/repair follows CAN/CSA-G40.23. Purchaser may specify ultrasonic examination in order. Manufacturer may repair surface imperfections unless purchaser forbids mill welding. For Q&T plates/bars, remove defects before all treatments; necessary matching-electrode weld repairs occur after all heat treatment.",
    "status": "verified"
  },
  {
    "topic": "Plate conditioning",
    "clauseRef": "G40.20-13 11.4.1-11.4.2",
    "text": "Plate finish follows CAN/CSA-G40.23 unless agreed otherwise. Grinding must be smoothly faired; may not reduce as-rolled thickness more than 7% below nominal for plates ordered by weight/m^2, nor more than 3 mm, nor below permitted minimum thickness.",
    "status": "verified"
  },
  {
    "topic": "Plate weld repair",
    "clauseRef": "G40.20-13 11.4.3-11.4.4",
    "text": "Plate weld repair per Clause 12: preparation area <= 2% total conditioned surface; preweld thickness reduction <= 20% nominal, or <= 30% where projected deeper individual imperfection area <= 1200 mm^2. Edge-preparation depth inward <= plate thickness and <= 25 mm.",
    "status": "verified"
  },
  {
    "topic": "Shape conditioning",
    "clauseRef": "G40.20-13 11.5.1",
    "text": "Rolled structural/bar-size shapes and sheet piling grinding/chipping must be smoothly faired; depression below rolled surface <= 1 mm for thickness < 10 mm, <= 2 mm for 10-50 mm, <= 3 mm for > 50 mm.",
    "status": "verified"
  },
  {
    "topic": "Shape weld repair",
    "clauseRef": "G40.20-13 11.5.2",
    "text": "More severe shape/sheet-pile imperfections repaired by removal+weld per Clause 12. Preparation area <= 2% total surface; thickness reduction <= 30% nominal and depression <= 30 mm (sheet piling reduction <= 20%). Toes/stems/legs of named shapes: inward depth <= base thickness and <= 13 mm. Sheet-pile interlock build-up/grinding area <= 2% total surface.",
    "status": "verified"
  },
  {
    "topic": "Bar conditioning",
    "clauseRef": "G40.20-13 11.6.1-11.6.2",
    "text": "Bar grinding/chipping smoothly faired and sectional reduction within ASTM A6/A6M. More severe removal+weld preparation area <= 2% total surface; preweld nominal diameter/thickness reduction <= 5%; flat-bar edge preparation depth <= flat-bar thickness or 13 mm, whichever smaller.",
    "status": "verified"
  },
  {
    "topic": "Hss conditioning",
    "clauseRef": "G40.20-13 11.7.1-11.7.2",
    "text": "HSS grinding/chipping smoothly faired and wall remaining >= Clause 5.8 minimum. Removal+weld preparation area <= 2% total exterior area; preweld wall reduction <= 33% nominal.",
    "status": "verified"
  },
  {
    "topic": "Sheet conditioning",
    "clauseRef": "G40.20-13 11.8",
    "text": "Cut-sheet surface grinding must be smoothly faired and remaining thickness >= Clause 5.5 minimum.",
    "status": "verified"
  },
  {
    "topic": "Weld repair",
    "clauseRef": "G40.20-13 12.1-12.4",
    "text": "Manufacturer meets CSA W47.1; repair performed by W47.1-qualified competent welders using low-hydrogen process per W59/W48, with consumables protected from moisture per W59. Weld quality meets W59. Manufacturer inspection program verifies flaws removed, qualifications/procedures followed, acceptable weld quality, and qualified NDE personnel.",
    "status": "verified"
  },
  {
    "topic": "Plate marking",
    "clauseRef": "G40.20-13 13.1",
    "text": "Each plate > 10 mm thick carries legible heat number and manufacturer name/brand at a corner. Each plate marked standard/grade (manufacturer may use colour at one end), and ordered size/thickness or size/nominal mass, on piece or substantial attached tag.",
    "status": "verified"
  },
  {
    "topic": "Sheet marking",
    "clauseRef": "G40.20-13 13.2",
    "text": "Cut sheet heat/manufacturer marks at corner of each cut length or top of secured lift, or secured-lift tags. Standard/grade on cut length/top secured lift or tags, with manufacturer colour option. Coil tags/labels carry required markings. Secured lift means >= 2 identical-dimension, same-heat pieces secured for shipping.",
    "status": "verified"
  },
  {
    "topic": "Shape bar marking",
    "clauseRef": "G40.20-13 13.3-13.4",
    "text": "Structural-size shapes carry heat number, section size, length, mill marks per piece, and manufacturer raised-letter marks at length intervals. Standard/grade on piece, lift outside, or attached substantial tag, or permitted colour. Bars heat/manufacturer at end of piece/lift outside/tag; bundled small product tag includes heat/grade/size/length, count or actual weight, unique bundle number. Bars standard/grade similarly marked or permitted colour.",
    "status": "verified"
  },
  {
    "topic": "Hss marking",
    "clauseRef": "G40.20-13 13.5",
    "text": "Each HSS length legibly stamped/embossed/ink printed/stencilled with manufacturer, size, thickness, standard designation, grade, class, and heat number unless otherwise noted. Manufacturer may show standard/grade by colour on piece/bundle/lift end.",
    "status": "verified"
  },
  {
    "topic": "Cold formed marking",
    "clauseRef": "G40.20-13 13.6",
    "text": "Each cold-formed channel/Z length carries legible label/stencil/embossment at <= 1220 mm centres with manufacturer ID, minimum uncoated steel thickness, minimum yield strength, and minimum protective coating mass if applicable.",
    "status": "verified"
  },
  {
    "topic": "Identification",
    "clauseRef": "G40.20-13 13.7-13.10",
    "text": "Where per-piece testing specified, each as-rolled piece has distinctive number; subdivisions retain related numbers. Stamps characters >= 10 mm high; specify low-stress stamping if required. Colour must be distinct/visible; secondary colour adjoining or overlaying primary, covering about 1/3 primary visible area; G40.21 Table 10 defines colours. Barcodes are supplementary to required markings.",
    "status": "verified"
  },
  {
    "topic": "Retest lab",
    "clauseRef": "G40.20-13 14.1",
    "text": "Required retests performed by producing mill or ISO/IEC17025-accredited laboratory.",
    "status": "verified"
  },
  {
    "topic": "Tensile retest",
    "clauseRef": "G40.20-13 14.2.1-14.2.3",
    "text": "Initial tensile failure requires 2 further samples from same original plate/section/sheet/sheet pile/bar. Both passing qualifies represented material. Either failing rejects original piece; manufacturer may qualify remaining lot by testing two remaining pieces (or two remaining sheet coils) without further retesting; any failure rejects represented material.",
    "status": "verified"
  },
  {
    "topic": "Elongation retest",
    "clauseRef": "G40.20-13 14.2.4",
    "text": "If elongation is low, retest allowed when fracture more than 20 mm from 50 mm-gauge centre or outside middle half of 200 mm gauge, as shown by pretest scribe marks.",
    "status": "verified"
  },
  {
    "topic": "Impact retest",
    "clauseRef": "G40.20-13 14.3.1",
    "text": "A failing original 3-test average may be retested only if deficit <= 15% specified minimum average and no single value < 2/3 specified minimum value. Test 3 more specimens from same sample and recompute six-specimen average. Acceptance requires combined average >= specified average and none of three new results below specified individual amount.",
    "status": "verified"
  },
  {
    "topic": "Plate impact retest",
    "clauseRef": "G40.20-13 14.3.2.1-14.3.2.2",
    "text": "After unsuccessful impact re-average, thinner same-group material can qualify via thickest remaining plate passing. Other same/thicker plates can qualify by a passing impact test from every as-rolled piece. Original cross-reference to 14.2.1 is internally inconsistent because 14.2.1 is tensile clause; interpret only with reviewed source context.",
    "status": "verified-source-cross-reference-anomaly"
  },
  {
    "topic": "Section impact retest",
    "clauseRef": "G40.20-13 14.3.3.1-14.3.3.2",
    "text": "After unsuccessful impact re-average for sections/HSS/bars/sheet piling, remove tested material and test 2 additional same-size-group/lot pieces; both passing qualifies lot. If either fails, other material can qualify by testing each as-rolled piece. Printed cross-reference 14.2.1 and as-rolled definition 9.3 appear inconsistent; do not silently reproduce as valid links.",
    "status": "verified-source-cross-reference-anomaly"
  },
  {
    "topic": "Specimen replacement",
    "clauseRef": "G40.20-13 14.4",
    "text": "Manufacturer may discard specimen with faulty machining/flaws and substitute another.",
    "status": "verified"
  },
  {
    "topic": "Resubmission",
    "clauseRef": "G40.20-13 14.5",
    "text": "Manufacturer may heat treat/reheat treat any material, including previously failed material, and resubmit for testing. Treatment details documented.",
    "status": "verified"
  },
  {
    "topic": "Welded shape material",
    "clauseRef": "G40.20-13 15.1-15.2.3",
    "text": "Each component same material standard unless specified; fabricator W47.1-qualified. All welds including repair use W47.1-accepted procedures and W48 or appropriate AWS A5 consumables. Automatic-production welds must be uniform; nonconforming joins discarded unless completed with approved equivalent penetration/joint properties.",
    "status": "verified"
  },
  {
    "topic": "Welded shape strength",
    "clauseRef": "G40.20-13 15.2.4",
    "text": "For web thickness <= 20 mm, web-to-flange joint must develop specified minimum web-material tensile strength normal to longitudinal weld. For thicker webs, 20 mm-web-strength design is informative recommendation subject to stated section data; do not enforce note as mandatory requirement.",
    "status": "verified"
  },
  {
    "topic": "Welded shape splicing",
    "clauseRef": "G40.20-13 15.2.5-15.2.6",
    "text": "Splicing needs approval. Approved flange/web plate or bar butt joints allowed for member length beyond available rolled component length or required section transition. Butt-joint groove weld complete penetration, and component joint finished before component joined to member. Use/location documented.",
    "status": "verified"
  },
  {
    "topic": "Welded shape quality",
    "clauseRef": "G40.20-13 15.3",
    "text": "Fillet profiles/fusion discontinuities conform W59. Flange/web butt groove welds complete penetration with W59 profile/fusion quality. No arc strikes on surfaces and no weld cracks by specified macro/NDT.",
    "status": "verified"
  },
  {
    "topic": "Welded shape qc",
    "clauseRef": "G40.20-13 15.4",
    "text": "Inspect all welding visually. Take 1 normal-to-weld welded-tee tensile test each 300 m shape production or 3 h run, whichever greater, but at least 1 per weld-size/procedure change. Same frequency macro-weld examination and NDT of all welding on 1 representative finished shape. Inspect enough repair welds by NDT to establish production-equivalent quality. Test specimens/shape fully representative of production run and must not come from repaired/different weld locations; visual/NDT personnel qualification per W59.",
    "status": "verified"
  },
  {
    "topic": "Welded shape repair marking",
    "clauseRef": "G40.20-13 15.5-15.6",
    "text": "Repair all failing welds to production-weld requirements. Identify each shape prominently by production-lot or welded-shape number plus standard designation; manufacturer records map component heat numbers/standard designations to shape/lot numbers.",
    "status": "verified"
  },
  {
    "topic": "Certification",
    "clauseRef": "G40.20-13 16.1",
    "text": "Manufacturer certificate contains all applicable mechanical/chemical test results and conformity declaration, with IDs including heat numbers matching product. Welded shapes normally certified on thickest flange basis under Clauses 4 and 9; when multiple heats fabricated, report applicable tests for all heats and thicknesses.",
    "status": "verified"
  },
  {
    "topic": "Certification",
    "clauseRef": "G40.20-13 16.2-16.3",
    "text": "Make certificate and product identification available to end users. Decoiling processor responsible for mechanical testing, inspection, and certification of plate/sheet cut from coils. Report full-section angle qualification specimens explicitly.",
    "status": "verified"
  },
  {
    "topic": "Certification",
    "clauseRef": "G40.20-13 16.4-16.5",
    "text": "Certificate includes contact name and manufacturer identity; subsequent processor also identified and original manufacturer certificate included. Issuing organization responsible for certificate/MTR/inspection-document content, including when unsigned; document must meet invoked CSA/ASTM standards.",
    "status": "verified"
  },
  {
    "topic": "Inspection",
    "clauseRef": "G40.20-13 17",
    "text": "All tests/inspections other than product analysis performed at manufacturer before shipment without interfering with works.",
    "status": "verified"
  },
  {
    "topic": "Rejection",
    "clauseRef": "G40.20-13 18.1-18.2",
    "text": "Product-analysis rejection promptly reported unless specified otherwise. Defective material discovered after acceptance set aside, protected, identified; notify manufacturer as soon as possible.",
    "status": "verified"
  },
  {
    "topic": "Rejection",
    "clauseRef": "G40.20-13 18.3",
    "text": "Manufacturer may take rejected material back or request representative samples for additional tests. Scanned source appends an apparent editorial removal suggestion after this provision; exclude that suggestion from requirements.",
    "status": "verified-source-editorial-anomaly"
  },
  {
    "topic": "Tensile property shape groups",
    "clauseRef": "G40.20-13 Table 1",
    "text": "Group 1: super light beams <= 28.1 kg/m; C channels <= 30.8 kg/m; MC channels <= 42.4 kg/m; angles/bulb angles/zees/rolled tees <= 13 mm. Group 2: C > 30.8 kg/m, MC > 42.4 kg/m, angles/bulb angles/zees/rolled tees > 13-19 mm inclusive. Group 3: last family > 19 mm. Tees cut from W/C/S/M inherit parent shape group; W/H/S sizing groups refer ASTM A6/A6M.",
    "status": "verified"
  },
  {
    "topic": "Impact subsize energies",
    "clauseRef": "G40.20-13 Table 2",
    "text": "Full size minimum-average J categories 34/27/20 map to: 3/4 size 26/20/15; 2/3 size 23/18/13; 1/2 size 17/14/11; 1/3 size 11/9/7; 1/4 size 8/7/5. Table provides fraction identifiers, not actual specimen dimensions. Values are tabulated and cannot safely be replaced with a simple proportional formula.",
    "status": "verified"
  },
  {
    "topic": "Full section shape tests",
    "clauseRef": "G40.20-13 Table 3",
    "text": "Manufacturer may choose full-section tests only for L angle Groups 1 and 2; Group 3 not listed. Shape-group mapping is Table 1, not thickness test-frequency A-D.",
    "status": "verified"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 4",
    "text": "Restrictive flatness limits for carbon, HSLA, and alloy plates, as rolled or heat treated. Select using specified thickness and width. Some sizes have no published restrictive limit. Longer dimension is length; limits apply to plates up to 4000 mm long and any 4000 mm segment of longer plates. For longest dimension under 900 mm, flatness <= 6 mm; for 900-1800 mm inclusive, use 75% of width table value or 6 mm, whichever greater. Measure horizontally on a flat surface. Waviness tolerances for rectangular/universal mill/circular and sketch plates are excluded.",
    "status": "verified-manual-geometry-selection"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 5",
    "text": "Sectional tolerances for super light beams and channels, including depth, flange width, squareness, and flange parallelism. Select by product and nominal depth. Example: 100 mm super light beam depth +/-2 mm, flange width +/-3 mm; squareness and parallelism limits each 0.03 times flange width. Super light beam web thickness is separately controlled in Table 7.",
    "status": "verified-manual-geometry-selection"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 6",
    "text": "Straightness for super light beams and steel sheet piling. Super light beam camber or sweep <= L/500; steel sheet piling <= L/1000, with L and deviation in mm.",
    "status": "verified"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 7",
    "text": "Super light beam web thickness tolerance is +/-15% for specified size < 150 mm.",
    "status": "verified"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 8",
    "text": "Welded structural shape sectional dimensions, selected by nominal depth. Includes depth, flange width, combined flange warpage/tilt, web offset, and web flatness. Representative maxima: web offset 6 mm; web flatness A/150; flange warpage/tilt maximum is greater of B/100 or 6 mm.",
    "status": "verified-manual-geometry-selection"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 9",
    "text": "Welded shape straightness varies with use and specified camber/sweep. Columns/compression truss members <= 14000 mm: L/1000 but maximum 10 mm; longer members use 10+(L-14000)/1000 mm. Beams/girders without specified camber/sweep: L/1000; with specified camber: 6+L/4000 mm. Apply the correct member category.",
    "status": "verified-manual-geometry-selection"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Tables 10 and 11",
    "text": "Actual headings are HSS mass and wall thickness, respectively. Mass tolerance -3.5%/+10%; wall thickness -5%/+10%, with weld seam upper exception and rectangular measurement at centre of flat. The clause cross-references in 5.8.4 and 5.8.5 name these tables for other topics and are inconsistent.",
    "status": "verified-source-cross-reference-anomaly"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 12",
    "text": "Actual heading is HSS cross-sectional dimensions. Largest outside dimension across flats/diameter <= 65 mm: +/-0.5 mm; > 65-90 mm: +/-0.8 mm; > 90-140 mm: +/-1.0 mm; > 140 mm: +/-1%. Rectangular smaller flat uses larger-flat tolerance; increase that tolerance by 50% where dimension ratio is 1.5-3 and 100% where > 3. Measure at least 50 mm from either end; includes convexity/concavity allowance.",
    "status": "verified-manual-geometry-selection"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 13",
    "text": "Actual heading is rectangular HSS maximum outside corner radii. Select using wall thickness and perimeter <= 700 mm versus > 700 mm in SI table. Some combinations have no published radius. Representative: <= 3 mm wall and perimeter <= 700 mm permits radius <= 6 mm; > 13 mm wall and perimeter > 700 mm permits radius <= 3 times wall thickness. Do not intermingle SI and imperial perimeter cutoffs.",
    "status": "verified-manual-geometry-selection"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Tables 14 and 15",
    "text": "Actual headings are HSS corner squareness and straightness, respectively. Squareness is 90 degrees +/-1 degree hot formed or +/-2 degrees cold formed; straightness <= L/500. These repeat the inline requirements.",
    "status": "verified"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 16",
    "text": "Actual heading is HSS twist. Select by largest outside dimension; permitted twist per 1000 mm length is 1.3, 1.7, 2.1, 2.4, 2.8, or 3.1 mm for bands <= 40, > 40-65, > 65-105, > 105-155, > 155-205, or > 205 mm, respectively. Applies to rectangular/noncircular profiles; measurement at least 50 mm from either end.",
    "status": "verified-manual-geometry-selection"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 17",
    "text": "Actual heading is HSS ordered length tolerance. Cold-cut lengths <= 7500 mm: +12/-6 mm; > 7500 mm: +18/-6 mm. Hot-cut hot-rolled sections <= 7500 mm: +/-25 mm; > 7500 mm: +/-50 mm.",
    "status": "verified-manual-geometry-selection"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Tables 18-22",
    "text": "Actual cold-formed channel/Z headings cover delivered thickness, ordered length, straightness, corner squareness, and inside radius, respectively. Repeat inline limits: thickness >= 95% design; length +/-3 mm; straightness <= L/500; corners 90 degrees +/-3 degrees at least 100 mm from end; radius 1-4 times nominal thickness.",
    "status": "verified"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 23",
    "text": "Actual heading is cold-formed channel/Z sectional dimensions. For nominal depth 92-356 mm inclusive: depth +2/-1 mm; flange +2/-1 mm; lip +4/-0 mm. Measure outside across flats at least 100 mm from ends, including convexity/concavity allowance. Clause 5.10.1 instead names Table 14; flag that source cross-reference anomaly.",
    "status": "verified-manual-geometry-selection"
  },
  {
    "topic": "Dimensional tolerance table",
    "clauseRef": "G40.20-13 Table 24",
    "text": "Sheet thickness over-tolerance only, selected by specified minimum thickness and width. There is no under-tolerance. Measure across width at least 10 mm from cut edge and 20 mm from mill edge. If ordered to nominal rather than minimum thickness, divide tabulated tolerance equally over and under nominal.",
    "status": "verified-manual-geometry-selection"
  },
  {
    "topic": "Source cross reference anomalies",
    "clauseRef": "G40.20-13 5.8.4-5.8.8 and 5.10.1",
    "text": "Several inline dimensional table numbers disagree with actual headings: HSS cross dimensions refer to Table 10 but actual table is 12; corner radii refer to 11 but actual is 13; twist refers to 12 but actual is 16; length refers to 13 but actual is 17; cold-formed sectional dimensions refer to 14 but actual is 23. Table headings and normative values were visually verified. Resolve these source inconsistencies before using a cited table as an automatic acceptance rule.",
    "status": "verified-source-cross-reference-anomaly"
  }
]);
G40_AUDIT.generalNumericalFacts = {
  "testingFrequency": {
    "asRolledNormalizedTensile": {
      "clause": "9.1.1",
      "samplesPerHeatFormGroup": 2,
      "smallQuantityThresholdKgExclusive": 50000,
      "smallQuantitySamples": 1
    },
    "asRolledNormalizedImpact": {
      "clause": "9.1.2,9.4",
      "samplePerMassKg": 50000,
      "specimensPerSample": 3
    },
    "coiledSheetTensile": {
      "clause": "7.1.2.7.2",
      "heatThresholdKgInclusive": 45000,
      "testsAtOrAboveThreshold": 2,
      "testsBelowThreshold": 1,
      "thicknessVariationMmInclusive": 0.64,
      "variationRule": "Test thickest and thinnest regardless of represented mass"
    },
    "coiledSheetImpact": {
      "clause": "7.1.3.7.2",
      "testsPerTestedCoil": 1
    },
    "quenchedTemperedPlate": {
      "clause": "9.2",
      "plateIndices": [
        1,
        4,
        7,
        10
      ],
      "lotSameFields": [
        "heat",
        "thickness",
        "prior condition",
        "heat treatment"
      ]
    },
    "groupedHeatTensile": {
      "clause": "9.5",
      "samplePerMassKg": 25000,
      "sizeSpecific": true
    },
    "weldedShapeQC": {
      "clause": "15.4",
      "productionLengthM": 300,
      "productionRunHours": 3,
      "selection": "whichever is greater",
      "minimumPerWeldSizeOrProcedureChange": 1
    },
    "additionalTensileThicknessDeltaMmExclusive": {
      "clause": "9.1.4",
      "A": 5,
      "B": 10,
      "C": 15,
      "D": 20,
      "plateFromCoils": 3,
      "sheet": 1.3,
      "structuralSizeMeasurement": "web thickness"
    },
    "additionalImpactThicknessDeltaMmExclusive": {
      "clause": "9.1.5",
      "A": 5,
      "B": 10,
      "C": 15,
      "D": 20,
      "plateFromCoils": 3,
      "sheet": 1.3,
      "structuralSizeMeasurement": "flange thickness",
      "initialSelection": "thickest product"
    }
  },
  "retesting": {
    "tensile": {
      "clause": "14.2",
      "additionalTests": 2,
      "bothMustPass": true,
      "remainingLotTestsAfterFailedRetest": 2,
      "furtherRetestingForRemainingLot": false
    },
    "impact": {
      "clause": "14.3.1",
      "originalSpecimens": 3,
      "maximumAverageDeficiencyFraction": 0.15,
      "minimumOriginalIndividualFraction": 0.6666666666666666,
      "additionalSpecimens": 3,
      "combinedAverageSpecimens": 6,
      "additionalIndividualsMustMeetSpecifiedMinimum": true
    },
    "elongationFracture": {
      "clause": "14.2.4",
      "gaugeMm50MaximumCentralDistanceMm": 20,
      "gaugeMm200MustBeWithin": "middle half"
    }
  },
  "subsizeMinimumAverageEnergyJ": {
    "clause": "Table 2",
    "fullSizeBaseJ": [
      34,
      27,
      20
    ],
    "Full size": [
      34,
      27,
      20
    ],
    "3/4 size": [
      26,
      20,
      15
    ],
    "2/3 size": [
      23,
      18,
      13
    ],
    "1/2 size": [
      17,
      14,
      11
    ],
    "1/3 size": [
      11,
      9,
      7
    ],
    "1/4 size": [
      8,
      7,
      5
    ],
    "dimensions": "Not given in Table 2; referenced to ASTM A370"
  },
  "elongationDeductionPercentagePoints": {
    "rectangularThin": [
      [
        7.6,
        7.89,
        0.5
      ],
      [
        7.3,
        7.59,
        1
      ],
      [
        7.0,
        7.29,
        1.5
      ],
      [
        6.6,
        6.99,
        2
      ],
      [
        6.2,
        6.59,
        2.5
      ],
      [
        5.9,
        6.19,
        3
      ],
      [
        5.5,
        5.89,
        3.5
      ],
      [
        5.2,
        5.49,
        4
      ],
      [
        4.9,
        5.19,
        4.5
      ],
      [
        4.6,
        4.89,
        5
      ],
      [
        4.2,
        4.59,
        5.5
      ],
      [
        3.9,
        4.19,
        6
      ],
      [
        3.6,
        3.89,
        6.5
      ],
      [
        3.2,
        3.59,
        7
      ],
      [
        1.1,
        3.19,
        7.5
      ]
    ],
    "thick50MmGauge": [
      [
        90.0,
        102.49,
        0.5
      ],
      [
        102.5,
        114.99,
        1
      ],
      [
        115.0,
        127.49,
        1.5
      ],
      [
        127.5,
        139.99,
        2
      ],
      [
        140.0,
        152.49,
        2.5
      ],
      [
        152.5,
        null,
        3
      ]
    ],
    "sheet": [
      [
        4.0,
        4.49,
        0.5
      ],
      [
        3.5,
        3.99,
        1
      ],
      [
        3.0,
        3.49,
        1.5
      ],
      [
        2.5,
        2.99,
        2
      ],
      [
        2.0,
        2.49,
        2.5
      ],
      [
        1.5,
        1.99,
        3
      ],
      [
        1.2,
        1.49,
        3.5
      ]
    ]
  }
};
