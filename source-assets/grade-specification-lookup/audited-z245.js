/* Numerical requirements and paraphrased audit of the user-supplied CSA Z245.1:26.
 * PDF SHA-256 79e4f7190a8616cb5500c223a1770505fa565c9d2d79a7726183c68b3c10616a.
 * Tables were read from rendered source pages; this file contains no source PDF/OCR.
 */
const Z245_AUDIT = {
  edition: 'CSA Z245.1:26', publication: 'March 2026',
  sourceSha256: '79e4f7190a8616cb5500c223a1770505fa565c9d2d79a7726183c68b3c10616a',
  standardGrades: [241,290,359,386,414,448,483,550,620,690,825],
  // [SMYS, maximum YS, SMTS, maximum TS, maximum Y/T flattened, maximum Y/T other]
  tensile: [[241,495,414,760,.93,.93],[290,495,414,760,.93,.93],[359,530,455,760,.93,.93],[386,540,490,760,.93,.93],[414,565,517,760,.93,.93],[448,600,531,760,.93,.93],[483,620,565,760,.93,.93],[550,690,620,830,.93,.93],[620,760,690,900,.93,.95],[690,825,760,970,.93,.97],[825,1050,915,1145,.99,.99]],
  chemistryMax: {C:.26,Mn:2,P:.030,S:.035,Si:.50,Nb:.11,Ti:.11,V:.11,B:.001},
  ceFactorTable: [[.06,.54],[.07,.56],[.08,.58],[.09,.62],[.10,.66],[.11,.70],[.12,.75],[.13,.80],[.14,.85],[.15,.88],[.16,.92],[.17,.94],[.18,.96],[.19,.97],[.20,.98],[.21,.99]],
  ceFormula: 'C + F × (Mn/6 + Si/24 + Cu/15 + Ni/20 + (Cr+Mo+V+Nb)/5 + 5B)',
  ceSymbols: ['C','Mn','Si','Cu','Ni','Cr','Mo','V','Nb','B'],
  subSizeFactors: {'10x10':1,'10x7.5':.75,'10x6.7':.67,'10x5':.50,'10x3.3':.33,'10x2.5':.25},
  supplyConditions: [
    {value:'AS_MANUFACTURED',label:'As manufactured; no post-forming heat treatment ordered'},
    {value:'HN',label:'Normalized or normalized and tempered (HN)'},
    {value:'HQ',label:'Quenched and tempered (HQ)'},
    {value:'HS',label:'Subcritical stress relieved (HS)'},
    {value:'HA',label:'Subcritical age or precipitation hardened (HA)'}
  ],
  // Tables 1, 2, 4, 12, 15, 16 and 17 are retained as reference data.
  smallPipeHydro: {
    '21.3':[[2.1,4.8,20.7],[2.3,4.8,20.7],[2.8,4.8,20.7],[3.7,5.9,20.7],[4.8,6.2,20.7],[7.5,6.9,20.7]],
    '26.7':[[2.1,4.8,20.7],[2.3,4.8,20.7],[2.9,4.8,20.7],[3.2,5.1,20.7],[3.9,5.9,20.7],[5.6,6.6,20.7],[7.8,6.9,20.7]],
    '33.4':[[2.1,4.8,20.7],[2.3,4.8,20.7],[2.8,4.8,20.7],[3.4,4.8,20.7],[4.5,5.9,20.7],[6.4,6.6,20.7],[9.1,6.9,20.7]],
    '42.2':[[2.1,9.0,null],[2.3,9.0,null],[2.8,9.0,20.7],[3.2,9.0,20.7],[3.6,9.0,20.7],[4.9,13.0,20.7],[6.4,14.0,20.7],[9.7,15.9,20.7]],
    '48.3':[[2.1,9.0,null],[2.3,9.0,null],[2.8,9.0,null],[3.2,9.0,20.7],[3.7,9.0,20.7],[5.1,13.1,20.7],[7.1,14.2,20.7],[10.2,15.9,20.7]]
  },
  lengthTable: [[6,4,5,8],[12,4,11,16],[18,4,16,20],[24,4,21,26]],
  specialLightMassSizes: [[60.3,60.3,2.1,3.9],[73,168.3,2.1,4],[219.1,219.1,3.2,4],[273.1,273.1,4,5.2],[323.9,323.9,4.4,5.6],[355.6,508,4.8,7.1],[559,914,5.6,7.1],[965,1372,6.4,7.1]],
  // [weld-thickness upper edge, hole radiographic, hole fluoroscopic, wire radiographic, wire fluoroscopic]
  imageQualityIndicators: [[8,.25,.30,.16,.33],[11,.30,.38,.20,.41],[14,.38,.43,.25,.51],[18,.43,.51,.33,.64],[25,.51,.64,.41,.81],[null,.64,.76,.51,1.02]],
  guidedBendStrains: [[241,.1375],[290,.1375],[359,.125],[386,.1175],[414,.1125],[448,.11],[483,.105],[550,.095],[620,.0875],[690,.08],[825,.0675]],
  repairJigMaleWidthFactors: [[241,6],[290,6],[359,8],[386,8],[414,9],[448,9],[483,10],[550,11],[620,12],[690,13],[825,14]],
  // [OD lower, OD upper, wall boundary for 12.7mm specimen, wall boundary for 8.9mm specimen]
  roundSpecimenTable: [[219.1,273.1,null,28.1],[273.1,323.9,null,25.5],[323.9,355.6,null,23.9],[355.6,406.4,null,23.2],[406.4,457,30.9,22.2],[457,508,29.7,21.5],[508,559,28.8,21],[559,610,28.1,20.5],[610,660,27.5,20.1],[660,711,27,19.8],[711,762,26.5,19.5],[762,813,26.2,19.3],[813,864,25.8,19.1],[864,914,25.5,18.9],[914,965,25.3,18.7],[965,1016,25.1,18.6],[1016,1067,24.9,18.5],[1067,1118,24.7,18.3],[1118,1168,24.5,18.2],[1168,1219,24.4,18.1],[1219,1321,24.2,18.1],[1321,1422,24,17.9],[1422,1524,23.8,17.8],[1524,1626,23.6,17.6],[1626,1727,23.4,17.5],[1727,1829,23.3,17.4],[1829,1930,23.1,17.4],[1930,2032,23,17.3],[2032,null,22.9,17.2]],
  catalog: []
};

function z245Limit(value,bound,unit,clause,displayNote='') {
  return {value,bound,unit,clauseRef:`CSA Z245.1:26, ${clause}`,verified:true,footnoteIds:[],displayNote};
}
function z245Number(value) { return value === '' || value == null || !Number.isFinite(Number(value)) ? null : Number(value); }
function z245TensileValues(number) {
  const exact = Z245_AUDIT.tensile.find(x=>x[0]===number);
  if (exact) return exact.slice();
  const lo = [...Z245_AUDIT.tensile].reverse().find(x=>x[0]<number);
  const hi = Z245_AUDIT.tensile.find(x=>x[0]>number);
  if (!lo || !hi) return null;
  const f=(number-lo[0])/(hi[0]-lo[0]);
  return [number,...lo.slice(1).map((x,i)=>{const v=x+f*(hi[i+1]-x);return i<3?Math.round(v/5)*5:Math.round(v*100)/100;})];
}
function computeAuditedZ245CE(chemistry) {
  const symbols=Z245_AUDIT.ceSymbols.slice();
  const missing=symbols.filter(k=>z245Number(chemistry?.[k])===null);
  if(missing.length) return {value:null,F:null,symbols,missing,scope:'CSA Z245.1:26 Table 5; heat and product analyses'};
  const c=Object.fromEntries(symbols.map(k=>[k,Number(chemistry[k])]));
  const F=c.C<.06?.53:.75+.25*Math.tanh(20*(c.C-.12));
  const value=c.C+F*(c.Mn/6+c.Si/24+c.Cu/15+c.Ni/20+(c.Cr+c.Mo+c.V+c.Nb)/5+5*c.B);
  return {value,F,symbols,missing:[],scope:'CSA Z245.1:26, Table 5 formula option; heat and product analyses'};
}
function computeAuditedZ245Elongation(nominalAreaMM2,smts) {
  const area=z245Number(nominalAreaMM2),U=z245Number(smts);
  if(area===null||area<=0||U===null||U<=0)return null;
  const A=Math.min(500,Math.round(area));
  return {value:Math.round(1940*Math.pow(A,.2)/Math.pow(U,.9)),A,U,gaugeLengthMM:50,clauseRef:'CSA Z245.1:26, Table 8; nominal specimen area, specified minimum tensile strength'};
}
function z245BuildGrade(number,category) {
  const r=z245TensileValues(number), roman=category.replace('CAT_','');
  const max=(v,u,c,n='')=>z245Limit(v,'MAX',u,c,n), min=(v,u,c,n='')=>z245Limit(v,'MIN',u,c,n);
  const el={};
  for(const [name,value] of Object.entries(Z245_AUDIT.chemistryMax))el[name]={heat:{min:min(null,'wt_pct','Table 5','No minimum specified.'),max:max(value,'wt_pct','Table 5')},product:{min:min(null,'wt_pct','Table 5','No minimum specified.'),max:max(value,'wt_pct','Table 5; Clause 6.3.1','The same limits govern product analysis; no generic tolerance addition.')}};
  for(const name of ['Cu','Ni','Cr','Mo'])el[name]={heat:{min:min(null,'wt_pct','Table 5'),max:max(null,'wt_pct','Table 5','No general individual limit; required for CSA CE.')},product:{min:min(null,'wt_pct','Table 5'),max:max(null,'wt_pct','Table 5','No general individual limit; required for CSA CE.')}};
  const tc='Table 8 (printed p. 90; PDF p. 31)';
  const hardness=number>=483?30:27;
  return {
    displayName:`Grade ${number}${Z245_AUDIT.standardGrades.includes(number)?'':' (intermediate)'} Category ${roman}`,
    specEdition:Z245_AUDIT.edition,psl:null,category,
    verification:{lastVerifiedBy:'Attached-edition source audit',lastVerifiedDate:'2026-09-29',notes:'Numerical tables and relevant clauses checked against the attached March 2026 edition. Order-dependent and manufacturing acceptance requirements remain explicit contextual/manual checks.'},
    applicableForms:['SEAMLESS','ERW_HFW','SAWL','SAWH'],
    chemistry:{analysisTypes:['HEAT','PRODUCT'],elements:el,carbonEquivalent:{
      ceIiw:{limit:max(.40,'dimensionless','Table 5','CSA-specific CE; this field preserves the original engine slot and must be labelled CSA CE.'),formula:'CSA CE = C + F × (Mn/6 + Si/24 + Cu/15 + Ni/20 + (Cr+Mo+V+Nb)/5 + 5B); F = 0.53 if C < 0.06; otherwise 0.75 + 0.25 tanh(20(C - 0.12))'},
      cePcm:{limit:max(null,'dimensionless','Table 5','Pcm is not the acceptance formula for this edition.'),formula:'C + Si/30 + (Mn+Cu+Cr)/20 + Ni/60 + Mo/15 + V/10 + 5B'},
      selectionRule:{type:'CSA_Z245_26',threshold:null,clauseRef:'CSA Z245.1:26, Tables 5 and 6'}
    }},
    footnoteRules:[],
    mechanical:{thicknessBreakpoints:[{
      tMin_mm:0,tMax_mm:Number.MAX_SAFE_INTEGER,clauseRef:`CSA Z245.1:26, ${tc}; no grade thickness breaks`,
      yieldStrength:{min:min(r[0],'MPa',tc),max:max(null,'MPa',tc,'Select OD: maximum applies only at OD ≥219.1 mm.')},
      tensileStrength:{min:min(r[2],'MPa',tc),max:max(null,'MPa',tc,'Select OD: maximum applies only at OD ≥219.1 mm.')},
      ytRatio:{max:max(null,'ratio',tc,'Select OD and tensile specimen: maximum applies only at OD ≥355.6 mm.')},
      elongation:{type:'FIXED',formula:null,params:null,fixedMin:min(null,'pct',tc,'Context required: e = 1940 A^0.2 / U^0.9; nominal area capped at 500 mm², specified minimum TS, 50 mm gauge.'),clauseRef:`CSA Z245.1:26, ${tc}`,verified:true},
      hardness:{max:max(hardness,'HRC',number>=483?'Clause 8.6.1.2':'Clause 8.6.1.1','HV10 equivalent: '+(number>=483?302:279)+'. Sour service uses stricter Clause 16 limits.')}
    }]},
    charpy:{required:category!=='CAT_I',requiredBecause:category,testTemp:{value:null,unit:'degC',clauseRef:'CSA Z245.1:26, Clause 8.4.2.1; temperature specified in purchase order',verified:true},orientation:'TRANSVERSE',energyFullSize:{average:{min:min(category==='CAT_III'?18:null,'J',category==='CAT_III'?'Clause 8.4.5.2':'Clause 8.4.4.2','Category II requires OD to resolve 27/40 J; Category I has no base requirement.')},single:{min:min(category==='CAT_III'?12:null,'J','Clause 7.6.1.1 c)')}},energyBasis:'BODY',subSizeFactors:Object.entries(Z245_AUDIT.subSizeFactors).filter(([s])=>s!=='10x10').map(([specimen,factor])=>({specimen,factor,clauseRef:'CSA Z245.1:26, Table 7 and Clause 7.6.2.2',verified:true})),shearArea:{min:min(null,'pct','Clause 8.4.4.1','Category II: CVN shear at OD≤457 mm; DWTT at OD>457 mm.')},notes:[{text:'A test uses three adjacent CVN specimens; average rounded to whole J, at most one below the required average minimum, and none below two-thirds. Specimen size must be the largest feasible size.',clauseRef:'CSA Z245.1:26, Clauses 7.6.1 and 7.6.2',verified:true}]},
    dwtt:null,
    testing:{testUnitDefinition:{text:'Clause 3 grouping must be respected; heat, process/condition, dimensions and category are not interchangeable. See the detailed reference for cold expansion and Table 9 frequency.',clauseRef:'CSA Z245.1:26, Clause 3; Table 9',verified:true},frequencies:[{test:'CHEM_HEAT',frequency:'One analysis per heat.',clauseRef:'CSA Z245.1:26, Table 9 item 1',verified:true},{test:'CHEM_PRODUCT',frequency:'Two analyses per heat from different product items.',clauseRef:'CSA Z245.1:26, Table 9 item 2; Clause 6.3.2',verified:true},{test:'TENSILE',frequency:'Body: test unit ≤400 lengths at OD≤141.3; ≤200 at 141.3<OD≤323.9; ≤100 above 323.9 mm. Weld: OD≥219.1, ≤200 through323.9, ≤100 above 323.9 mm.',clauseRef:'CSA Z245.1:26, Table 9 items 3–8',verified:true}],retestProvisions:{text:'Product analysis, tensile, ductility, CVN, DWTT and hardness have separate retest rules. At grades ≥414, tensile failures require mother/daughter coil or plate bracketing with traceability. EW weld CVN/hardness failures require sequential-weld bracketing, independently of test units.',clauseRef:'CSA Z245.1:26, Clauses 6.3.5 and 7.2.6–7.8.5',verified:true},hydrotest:{formula:'P = 2·S·t/D',fiberStressPct:{value:null,clauseRef:'CSA Z245.1:26, Table 1 note 1; Clause 9.4.1',verified:true},notes:'OD-dependent hoop stress factors: 60/75/85/90%; Table 1 small-pipe pressures/caps govern. Each length is tested; minimum hold is 5 s for seamless and welded OD ≤457 mm, 10 s for welded OD >457 mm. Ordered higher pressure and agreed end-load compensation require separate review.'}},
    overlays:{SOUR_SERVICE:{displayName:'Sour service — Clause 16',available:number<=483,patches:[],addedRequirements:[{description:'Grade ≤483 only. Ni ≤1.0%; tensile strength ≤625/650/665 MPa by grade; macrohardness ≤22 HRC/250 HV10; microhardness ≤250 HV0.5. HIC applies when ordered with solution, frequency and criteria. This edition has no generic S ≤0.003% limit.',clauseRef:'CSA Z245.1:26, Clauses 1.2.2 and 16',verified:true}]},OFFSHORE:{displayName:'Offshore service',available:false,patches:[],addedRequirements:[]},CUSTOMER_SUPPLEMENT:{displayName:'Customer supplement',available:true,patches:[],addedRequirements:[]}},
    notes:[{id:'z245_audit',topic:'GENERAL',text:'The attached edition is CSA Z245.1:26, March 2026. This record replaces the earlier :22 assumptions; source audit and detailed applicability are available in the reference.',clauseRef:'CSA Z245.1:26, Preface printed p.17 / PDF p.104',verified:true},{id:'z245_context',topic:'ORDERING',text:'Specify manufacturing process, nominal OD and wall, category, ordered body toughness temperature, service conditions and specimen basis. Numeric screening does not certify workmanship, manufacturing, NDE, hydrotest execution or records.',clauseRef:'CSA Z245.1:26, Clauses 4, 7–19',verified:true}],equivalents:[]
  };
}
function applyAuditedZ245(data) {
  const standard=data.specBodies?.CSA_Z245_1;
  if(!standard)return data;
  standard.displayName='CSA Z245.1:26 — Steel pipe';
  standard.grades={};
  // Keep the existing intermediate317 searchable, explicitly marked as interpolated.
  for(const number of [...Z245_AUDIT.standardGrades,317].sort((a,b)=>a-b))for(const category of ['CAT_I','CAT_II','CAT_III'])standard.grades[`GR_${number}_${category}`]=z245BuildGrade(number,category);
  return data;
}
function resolveAuditedZ245(sourceGrade, context={}) {
  const grade=JSON.parse(JSON.stringify(sourceGrade));
  if(grade.specEdition!==Z245_AUDIT.edition)return {grade,missingContext:[],manualChecks:[],contextNotes:[]};
  const number=Number(grade.displayName.match(/Grade\s+(\d+)/)?.[1]), r=z245TensileValues(number);
  const od=z245Number(context.odMM??context.od),t=z245Number(context.thicknessMM??context.thickness);
  const missingContext=[],contextNotes=[],manualChecks=[],additionalChecks=[];
  const row=grade.mechanical.thicknessBreakpoints[0];
  const need=(label,condition)=>{if(!condition)missingContext.push(label);};
  need('Nominal outside diameter',od!==null&&od>0); need('Manufacturing method',grade.applicableForms.includes(context.form));
  need('Nominal wall thickness',t!==null&&t>0);
  need('Supply / post-forming heat-treatment condition',Z245_AUDIT.supplyConditions.some(x=>x.value===context.supplyCondition));
  if(od!==null&&(od<21.3||od>2032)) additionalChecks.push({name:'CSA pipe OD scope',status:'FAIL',detail:'Specified OD must be 21.3–2032 mm.',clauseRef:'CSA Z245.1:26, Clause 1.2.1'});
  const service=String(context.serviceCondition??'BASE').toUpperCase();
  const services=Array.isArray(context.annexSelections)?context.annexSelections.map(x=>String(x).toUpperCase()):[];
  const sour=service==='SOUR'||services.some(x=>x.includes('SOUR'));
  const elevated=service==='ELEVATED'||services.some(x=>x.includes('ELEVATED'));
  const strain=service==='STRAIN'||services.some(x=>x.includes('STRAIN'));
  if(sour&&number>483)additionalChecks.push({name:'Sour-service grade scope',status:'FAIL',detail:'The attached edition covers sour service only through Grade 483.',clauseRef:'CSA Z245.1:26, Clause 1.2.2 and 16.8'});
  if(od!==null&&od>=219.1){row.yieldStrength.max=z245Limit(r[1],'MAX','MPa','Table 8');row.tensileStrength.max=z245Limit(r[3],'MAX','MPa','Table 8');}
  else if(od!==null) contextNotes.push('Table 8 strength maxima do not apply at OD <219.1 mm.');
  const rawSpecimen=String(context.tensileSpecimen??context.specimenType??'').toUpperCase();
  const specimen=['FLATTENED_STRIP','OTHER','ROUND','FULL_SECTION','UNFLATTENED_STRIP'].includes(rawSpecimen)?rawSpecimen:'';
  if(od!==null&&od>=355.6){
    if(r[4]!==r[5])need('Tensile specimen type (flattened strip or other)',!!specimen);
    if(r[4]===r[5]||specimen)row.ytRatio.max=z245Limit(specimen==='FLATTENED_STRIP'?r[4]:r[5],'MAX','ratio','Table 8');
  }else if(od!==null)contextNotes.push('Table 8 yield/tensile ratio maxima do not apply at OD <355.6 mm.');
  // The elevated-service note increases ONLY the maximum yield strength, never maximum TS.
  if(elevated&&row.yieldStrength.max.value!==null){row.yieldStrength.max.value+=number<=448?75:100;row.yieldStrength.max.clauseRef='CSA Z245.1:26, Table 8 double-dagger note';contextNotes.push('Table 8 permits an elevated-service YS maximum increase of 75 MPa at grade ≤448, or 100 MPa at higher grades. Additional ordered elevated tests remain mandatory.');}
  if(sour){
    row.tensileStrength.max=z245Limit(number<=386?625:number<483?650:665,'MAX','MPa','Clause 16.8');
    row.hardness.max=z245Limit(22,'MAX','HRC','Clause 16.4','Also 250 HV10 macrohardness and 250 HV0.5 microhardness.');
    for(const analysis of ['heat','product'])grade.chemistry.elements.Ni[analysis].max=z245Limit(1,'MAX','wt_pct','Clause 16.10','Includes deposited weld metal.');
  }
  const area=z245Number(context.nominalAreaMM2)??((z245Number(context.stripWidth)!==null&&z245Number(context.stripThickness)!==null)?Number(context.stripWidth)*Number(context.stripThickness):z245Number(context.roundDiameter)!==null?Math.PI*Math.pow(Number(context.roundDiameter),2)/4:null);
  const elong=computeAuditedZ245Elongation(area,r[2]);
  const gauge=z245Number(context.gaugeLengthMM);
  need('Nominal tensile specimen cross-sectional area',elong!==null);
  need('Elongation gauge length / conversion to 50 mm',gauge!==null);
  row.elongation={type:'FIXED',formula:null,params:null,fixedMin:z245Limit(elong?.value??null,'MIN','pct','Table 8',elong?`50 mm basis; nominal A rounded and capped = ${elong.A} mm²; specified minimum TS = ${elong.U} MPa.`:'Requires nominal specimen area; the requirement is calculated, rather than a fixed 19%.'),clauseRef:'CSA Z245.1:26, Table 8; Clause 7.2.4.7',verified:true};
  if(gauge!==null&&gauge!==50){manualChecks.push('Convert measured elongation at gauge lengths <50 mm to 50 mm using ISO 2566-1 (7.2.4.7); other gauge bases require agreement. The screening input must use the 50 mm basis.');need('Confirmed ISO 2566-1 elongation conversion to 50 mm',context.elongationConvertedTo50MM===true);}
  const target=String(context.toughnessTarget??'BODY').toUpperCase();
  const cat=grade.category;
  need('Recognized toughness test location', ['BODY','WELD_HAZ','SAW_WELD','SAW_HAZ','EW_FUSION_LINE','EW_WELD_ZONE'].includes(target));
  const ordered=z245Number(context.orderTemperatureC??context.testTemperatureC);
  const form=String(context.form??'');
  const baseBody=cat==='CAT_III'?18:od!==null?(od<457?27:40):null;
  let energy=cat==='CAT_I'?null:baseBody, temp=ordered;
  const specificOrder=z245Number(context.orderedCvnEnergyJ);
  if(cat!=='CAT_I')need('Ordered body toughness test temperature',ordered!==null);
  if(target==='EW_FUSION_LINE'){
    if(form!=='ERW_HFW')additionalChecks.push({name:'Fusion-line toughness applicability',status:'FAIL',detail:'EW fusion-line tests apply to electric-welded pipe.',clauseRef:'CSA Z245.1:26, Clause 8.5.2.2'});
    energy=cat==='CAT_I'?null:18;temp=z245Number(context.fusionLineOrderTemperatureC)??-5;
    if(temp>-5)additionalChecks.push({name:'EW fusion-line ordered temperature',status:'FAIL',detail:'Fusion-line test temperature is -5°C, or colder by agreement.',clauseRef:'CSA Z245.1:26, Clause 8.5.2.2'});
  }else if(['WELD_HAZ','SAW_WELD','SAW_HAZ'].includes(target)){
    if(!['SAWL','SAWH'].includes(form))additionalChecks.push({name:'SAW weld/HAZ toughness applicability',status:'FAIL',detail:'This test target applies to submerged-arc-welded pipe.',clauseRef:'CSA Z245.1:26, Clause 8.5.1.3'});
    energy=cat==='CAT_I'?null:18;
    grade.charpy.required=cat!=='CAT_I'&&(ordered===null||ordered<-5||context.sawWeldToughnessOrdered===true);
    if(ordered!==null&&ordered>=-5&&context.sawWeldToughnessOrdered!==true)contextNotes.push('At body test temperature ≥-5°C, SAW weld/HAZ toughness is required only when specified by the purchaser.');
  }else if(target==='EW_WELD_ZONE'){
    if(form!=='ERW_HFW')additionalChecks.push({name:'EW weld-zone toughness applicability',status:'FAIL',detail:'This test target applies to electric-welded pipe.',clauseRef:'CSA Z245.1:26, Clause 8.5.2.3'});
    if(context.ewFusionLineAtBodyTemperaturePassed===true){grade.charpy.required=false;contextNotes.push('EW weld-zone test waiver claimed: verify fusion-line tests passed at the ordered body temperature under 8.5.2.1.');manualChecks.push('Document the fusion-line result supporting the weld-zone waiver (8.5.2.1).');}
  }
  if(specificOrder!==null){if(energy!==null&&specificOrder<energy)additionalChecks.push({name:'Ordered CVN energy',status:'FAIL',detail:'The order cannot lower the mandatory minimum absorbed energy.',clauseRef:'CSA Z245.1:26, Clauses 8.4–8.5'});else energy=specificOrder;}
  grade.charpy.testTemp={value:temp,unit:'degC',clauseRef:'CSA Z245.1:26, '+(target==='EW_FUSION_LINE'?'Clause 8.5.2.2':'Clauses 8.4.2.1 and 8.5'),verified:true};
  grade.charpy.energyFullSize.average.min=z245Limit(energy,'MIN','J',target==='BODY'?(cat==='CAT_III'?'Clause 8.4.5.2':'Clause 8.4.4.2'):'Clause 8.5');
  grade.charpy.energyFullSize.single.min=z245Limit(energy===null?null:energy*2/3,'MIN','J','Clause 7.6.1.1 c)');
  grade.charpy.orientation=form==='SEAMLESS'&&od!==null&&od<=114.3&&target==='BODY'?'LONGITUDINAL':'TRANSVERSE';
  grade.charpy.energyBasis=target==='BODY'?'BODY':'WELD';
  const cvnShear=cat==='CAT_II'&&target==='BODY'&&od!==null&&od<=457;
  grade.charpy.shearArea.min=z245Limit(cvnShear?60:null,'MIN','pct','Clause 8.4.4.1','Average ≥60%, each specimen ≥50%; order average ≥85% when five or more heats are supplied.');
  if(cat==='CAT_II'&&od!==null&&od>457){grade.dwtt={applicabilityRule:{odMin_mm:457,description:'Category II pipe strictly larger than 457 mm OD; 457 mm itself uses CVN shear.',clauseRef:'CSA Z245.1:26, Clause 8.4.4.1.2',verified:true},testTemp:{value:ordered,unit:'degC',clauseRef:'CSA Z245.1:26, Clause 8.4.2.1; API RP5L3',verified:true},shearAreaAvg:{min:z245Limit(60,'MIN','pct','Clause 8.4.4.1.3')},notes:[{text:'Two adjacent specimens; average rounded to the nearest percent; each specimen ≥50%; order average ≥85% when five or more heats are supplied. API RP 5L3 governs the method and any temperature correction.',clauseRef:'CSA Z245.1:26, Clauses 7.7 and 8.4',verified:true}]};}
  else grade.dwtt=null;
  if(od!==null){
    const fraction=od<168.3?.60:od<273.1?.75:od<508?.85:.90;
    grade.testing.hydrotest.fiberStressPct.value=fraction;
    const cap=number===241?(od<=88.9?17.2:19.3):20.7;
    const small=Z245_AUDIT.smallPipeHydro[String(od)]?.find(x=>t!==null&&Math.abs(x[0]-t)<1e-8);
    const tabulated=small?.[number===241?1:2];
    const computed=t!==null?Math.round(2*fraction*number*t/od*10)/10:null;
    const minimum=tabulated??(computed===null?null:Math.min(cap,computed));
    grade.testing.hydrotest.notes=`Minimum hydro pressure${minimum===null?' requires wall thickness':': '+minimum+' MPa'}; ${tabulated!=null?'Table 1 listed pressure':'formula 2St/D, rounded to 0.1 MPa, Table 1 note 2 cap'}; S=${fraction*100}% SMYS. Hold ≥${form==='SEAMLESS'||od<=457?5:10} s. Each pipe must withstand the pressure without leakage. Higher ordered pressure and agreed end-load compensation require separate review.`;
    const maxUnit=od<=141.3?400:od<=323.9?200:100;
    grade.testing.frequencies.push({test:'CVN',frequency:cat==='CAT_I'?'No base notch-toughness test requirement.':`One body/weld set per applicable test unit of ≤${maxUnit} lengths; each required target/orientation separately.`,clauseRef:'CSA Z245.1:26, Table 9 items 17–23',verified:true},{test:'HARDNESS',frequency:form==='ERW_HFW'?'EW weld, fusion line and parent metal: once per welding shift.':`Applicable SMLS/SAW locations: per Table 9 test unit; SMLS ≤${maxUnit} lengths, SAW OD >323.9 mm ≤100 lengths.`,clauseRef:'CSA Z245.1:26, Table 9 items 24–32',verified:true});
  }
  if(elevated){manualChecks.push('Elevated-service orders specify temperatures, test frequency, specimen details, body/weld properties, retests and supplementary toughness. ASTM E21 elevated tests and SAW all-weld-metal procedure tests are additional to room-temperature screening (Clause 17).');}
  if(strain){manualChecks.push('Strain-based design requires purchaser-defined longitudinal body, all-weld-metal and mill-jointer cross-weld tests; aging, uniform elongation, stress-strain shape and NDE supplements are order-dependent (Clause 18).');}
  if(sour){manualChecks.push('Sour-service microhardness/welding qualification, inclusion control reports, lamination assessment (width >20 mm and area >500 mm²), deposited-metal nickel, root bends for EW OD ≥60.3 mm and any ordered TM0284 HIC need documented checks (Clause 16).');}
  manualChecks.push('Verify manufacturing/welding qualification, sampling/test-unit traceability, ductility tests, all applicable weld/fusion/HAZ targets, dimensions and workmanship, full-length NDE, hydro execution, marking and certification. Numeric input screening covers only entered properties.');
  return {grade,missingContext:[...new Set(missingContext)],manualChecks,contextNotes,additionalChecks:additionalChecks.map(check=>({...check,category:'Applicability',verified:true,value:null,computed:null,limit:null})),allThicknesses:true};
}
function evaluateAuditedZ245(input={},context={},grade,resolvedAssessment=null) {
  const assessment=resolvedAssessment??resolveAuditedZ245(grade,{...context,...input,form:context.form??input.form,thicknessMM:context.thicknessMM??input.thicknessMM,odMM:context.odMM??input.odMM??input.od});
  const g=assessment.grade, checks=assessment.additionalChecks.slice();
  const add=(name,status,detail,clauseRef,limit=null,category='Charpy',value=null)=>{
    const temp=/temperature/i.test(name), unit=temp?'degC':/count/i.test(name)?'dimensionless':/shear|%/i.test(name)?'pct':'J';
    checks.push({name,status,detail,clauseRef,limit:limit===null?null:z245Limit(limit,temp?'MAX':'MIN',unit,clauseRef.replace(/^CSA Z245\.1:26, /,'')),category,value,computed:value,verified:true,unit});
  };
  const factor=Z245_AUDIT.subSizeFactors[String(input.cvnSize??context.cvnSize??'10x10')];
  if(g.charpy.required){
    const values=[input.cvn1,input.cvn2,input.cvn3].map(z245Number);
    const minimum=g.charpy.energyFullSize.average.min.value;
    if(factor===undefined)assessment.missingContext.push('Recognized CSA CVN specimen size');
    if(values.some(x=>x===null))assessment.missingContext.push('Three individual CVN energy results');
    if(values.every(x=>x!==null)&&factor!==undefined&&minimum!==null){
      const required=minimum*factor, mean=Math.round(values.reduce((a,b)=>a+b,0)/3);
      add('CVN average (rounded whole J)',mean>=required?'PASS':'FAIL',`Rounded average ${mean} J; required ${required} J for specimen factor ${factor}.`,'CSA Z245.1:26, Clause 7.6.1.1 a); Table 7',required,'Charpy',mean);
      const below=values.filter(x=>x<required).length;
      add('CVN count below required minimum',below<=1?'PASS':'FAIL',`${below} specimen(s) below ${required} J; at most one permitted.`,'CSA Z245.1:26, Clause 7.6.1.1 b)',null,'Charpy',below);
      const individualRequired=Math.max(required*2/3,(g.charpy.energyFullSize.single.min.value??0)*factor);
      add('CVN lowest individual energy',Math.min(...values)>=individualRequired?'PASS':'FAIL',`Lowest ${Math.min(...values)} J; each specimen ≥${individualRequired} J.`,'CSA Z245.1:26, Clause 7.6.1.1 c)',individualRequired,'Charpy',Math.min(...values));
    }
    const measured=z245Number(input.cvnTemp),maxTemp=g.charpy.testTemp.value;
    if(measured===null)assessment.missingContext.push('Actual CVN test temperature');
    if(measured!==null&&maxTemp!==null)add('CVN test temperature',measured<=maxTemp?'PASS':'FAIL',`Actual ${measured}°C; required ${maxTemp}°C or colder.`,'CSA Z245.1:26, Clauses 8.4.2 and 8.5',maxTemp,'Charpy',measured);
  }
  const shearRequired=g.charpy.shearArea.min.value!==null;
  if(shearRequired){
    const shear=[input.shear1,input.shear2,input.shear3].map(z245Number);
    if(shear.some(x=>x===null))assessment.missingContext.push('Three individual CVN shear areas');
    else {const avg=Math.round(shear.reduce((a,b)=>a+b,0)/3);add('CVN average shear area',avg>=60?'PASS':'FAIL',`Rounded average ${avg}%; required 60%.`,'CSA Z245.1:26, Clauses 7.6.1.1 and 8.4.4.1',60,'Charpy',avg);add('CVN minimum individual shear area',Math.min(...shear)>=50?'PASS':'FAIL',`Every individual requires ≥50%; minimum ${Math.min(...shear)}%.`,'CSA Z245.1:26, Clause 8.4.4.1.3',50,'Charpy',Math.min(...shear));add('CVN shear count below 60%',shear.filter(x=>x<60).length<=1?'PASS':'FAIL','At most one specimen may be below the specified 60% test minimum.','CSA Z245.1:26, Clause 7.6.1.1 b)',null,'Charpy',shear.filter(x=>x<60).length);}
  }
  if(g.dwtt){
    const shear=[input.dwtt1??input.dwttShear1,input.dwtt2??input.dwttShear2].map(z245Number);
    if(shear.some(x=>x===null))assessment.missingContext.push('Two individual DWTT shear areas');
    else {const mean=Math.round((shear[0]+shear[1])/2);add('DWTT average shear area',mean>=60?'PASS':'FAIL',`Rounded average ${mean}%; required 60%.`,'CSA Z245.1:26, Clauses 7.7.1 and 8.4.4.1.3',60,'DWTT',mean);add('DWTT minimum individual shear area',Math.min(...shear)>=50?'PASS':'FAIL',`Each specimen ≥50%; minimum ${Math.min(...shear)}%.`,'CSA Z245.1:26, Clause 8.4.4.1.3',50,'DWTT',Math.min(...shear));}
    const measured=z245Number(input.dwttTemp),required=g.dwtt.testTemp.value;
    if(measured===null)assessment.missingContext.push('Actual DWTT test temperature');
    else if(required!==null)add('DWTT test temperature',measured<=required?'PASS':'FAIL',`Actual ${measured}°C; ordered ${required}°C or colder; verify any API RP 5L3 correction separately.`,'CSA Z245.1:26, Clause 8.4.2',required,'DWTT',measured);
  }
  if(g.category==='CAT_II'){
    const heats=z245Number(input.orderHeatCount??context.orderHeatCount),mean=z245Number(input.orderAverageShear??context.orderAverageShear);
    if(heats===null){assessment.missingContext.push('Number of heats in the order item');assessment.manualChecks.push('Determine whether the order item includes five or more heats; if so, its order-average shear must be ≥85% (8.4.4.1.3).');}
    if(heats!==null&&heats>=5){if(mean===null)assessment.missingContext.push('Order average shear for an order with five or more heats');else add('Order-average shear',mean>=85?'PASS':'FAIL',`Order average ${mean}%; required 85% at five or more heats.`,'CSA Z245.1:26, Clause 8.4.4.1.3',85,'Order toughness',mean);}
  }
  return {...assessment,additionalChecks:checks,missingContext:[...new Set(assessment.missingContext)],replaceCategories:['Charpy','DWTT']};
}
function computeAuditedZ245Hydro(context={}, gradeOrNumber=null) {
  const grade=z245Number(gradeOrNumber)??z245Number(context.gradeNumber)??z245Number(context.grade?.displayName?.match(/Grade\s+(\d+)/)?.[1]);
  const od=z245Number(context.odMM??context.od),t=z245Number(context.thicknessMM??context.thickness);
  if(grade===null||od===null||t===null||od<=0||t<=0)return {minimumPressureMPa:null,missing:['Nominal OD, nominal wall thickness and numeric grade'],clauseRef:'CSA Z245.1:26, Table 1; Clause 9.4.1'};
  const fiberStressFraction=od<168.3?.60:od<273.1?.75:od<508?.85:.90;
  const pressureCapMPa=grade===241?(od<=88.9?17.2:19.3):20.7;
  const small=Z245_AUDIT.smallPipeHydro[String(od)]?.find(x=>Math.abs(x[0]-t)<1e-8);
  const tablePressure=small?.[grade===241?1:2];
  const formulaPressureMPa=Math.round(2*fiberStressFraction*grade*t/od*10)/10;
  const minimumPressureMPa=tablePressure??Math.min(pressureCapMPa,formulaPressureMPa);
  return {minimumPressureMPa,fiberStressFraction,formulaPressureMPa,pressureCapMPa,tablePressureMPa:tablePressure??null,holdSeconds:context.form==='SEAMLESS'||od<=457?5:10,missing:[],scope:'Each finished length; no leakage. Higher purchase-order pressure and agreed end-load compensation require separate review.',clauseRef:'CSA Z245.1:26, Table 1 notes 1–2; Clauses 9.1–9.4'};
}

Z245_AUDIT.catalog = [
  {
    "topic": "Scope and manufacturing routes",
    "clauseRef": "CSA Z245.1:26, Clauses 1.1–1.2.2; p.18",
    "text": "Applies to seamless, electric-welded and submerged arc welded pipe, primarily for oil and gas pipelines, with specified OD 21.3–2032 mm. Flash-welded, continuously welded and low-frequency electric-welded pipe below 70 kHz are excluded. Non-sour grades span 241–825; sour-service grades span 241–483. Standard grades are 241, 290, 359, 386, 414, 448, 483, 550, 620, 690 and 825, with intermediate grades permitted. A listed grade, diameter and category combination does not guarantee commercial availability.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Toughness category",
    "clauseRef": "CSA Z245.1:26, Clauses 1.2.3 and 8.4.3–8.4.5; pp.18,44–45",
    "text": "Category I has no requirement to demonstrate notch toughness. Category II requires both absorbed energy and shear fracture area. Category III requires absorbed energy only. Categories II and III require actual notch-toughness testing; a grade alone does not establish the category.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Mandatory purchase-order inputs",
    "clauseRef": "CSA Z245.1:26, Clause 4.1.1; pp.23–24",
    "text": "The order identifies the standard edition, quantity, grade, category, test temperature for Category II/III, manufacturing process, OD, wall thickness, nominal length, end finish, delivery date and shipping instructions. The test temperature must come from the order; there is no single body impact-test temperature shared by all grades.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Purchaser options and additional service requirements",
    "clauseRef": "CSA Z245.1:26, Clause 4.1.2; p.24",
    "text": "The purchase order activates or modifies options including expansion, weld/HAZ impact testing, electric-welded root bends, raised energy requirements, lower fusion-line test temperature, increased or alternative hydrostatic pressure, mill jointers, bevel and end-bead treatment, special end connections, alternative end measurement or dimensional/mass tolerances, sour/HIC requirements, elevated-temperature service, strain-based design and additional manufacturing reports. Evaluate these conditions before choosing applicable limits.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Definitions of analysis, grade and test unit",
    "clauseRef": "CSA Z245.1:26, Clause 3; pp.21–23",
    "text": "Heat analysis is the steel producer’s analysis representing the heat. Product analysis uses finished pipe or representative material. The grade designation numerically corresponds to minimum yield strength in MPa. A test unit has the same specified OD and wall thickness, hot rolling practice where applicable, pipe process, heat and pipe-manufacturing conditions; a pipe count alone is not enough to form a test unit.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Rounding and quality assurance",
    "clauseRef": "CSA Z245.1:26, Clauses 4.3–4.4; p.25",
    "text": "Use ASTM E29 rounding to the final stated digit of the limiting value when deciding conformance, except where a more specific rule applies. Slab/billet, coil/plate and pipe manufacturers each require a recognized national or international quality-management system.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Steelmaking, deoxidation and helical skelp",
    "clauseRef": "CSA Z245.1:26, Clauses 5.1–5.3.1; p.25",
    "text": "Steel may use open-hearth, electric-furnace or basic-oxygen processes and ingot, pressure or strand casting. Steel is semi-killed or killed. Helical pipe skelp width is between 0.8 and 3.0 times specified pipe OD.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Rolling-practice qualification",
    "clauseRef": "CSA Z245.1:26, Clauses 5.3.2–5.3.3; pp.25–26",
    "text": "Define and document critical rolling variables and tolerances so the complete coil/plate has suitable uniformity for finished-pipe properties. Validate with representative historical data and/or trials. For grades above 359 using externally purchased coil/plate, perform an initial supplier-mill on-site technical audit and periodic on-site or remote confirmation of continued rolling-practice performance.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Pipe production and heat treatment",
    "clauseRef": "CSA Z245.1:26, Clauses 5.4.1–5.4.5; p.26",
    "text": "Submerged arc welded pipe uses at least two passes, including one inside and one outside. Skelp end welds are restricted to helical pipe and use submerged arc welding or gas-metal-arc plus submerged-arc welding with suitable preparation and inside/outside passes. Expansion is optional unless the order specifies otherwise. Electric-welded weld zones receive normalizing or continuous in-line heat treatment reaching at least 620 °C, controlled to approximate parent-metal mechanical properties. Identify heat-treated pipe as required by marking provisions.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "SAW procedure qualification",
    "clauseRef": "CSA Z245.1:26, Clause 5.4.6; pp.26–27",
    "text": "Qualify longitudinal, helical and skelp-end SAW procedures to ASME BPVC Section IX. Qualification hardness tests of weld and HAZ follow 7.8 and meet 8.6. When ordered, qualification CVN weld/HAZ tests use the purchase-order temperature and at least 18 J full-size-equivalent average energy, or the higher ordered value. Section IX supplementary essential variables apply; sour-service qualification adds Clause 16.3.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Heat and product chemistry",
    "clauseRef": "CSA Z245.1:26, Clauses 6.1–6.3.4; p.27",
    "text": "Heat and product analyses each comply with Table 5, using ASTM A751 methods unless the retest provisions specify otherwise. Make two product analyses per heat from two distinct product items. Samples represent full thickness and the pipe body, with surface contamination removed. Welded-pipe samples may come from pipe or representative skelp; seamless samples may come from tension specimens or circumferential sampling.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Product-analysis retests",
    "clauseRef": "CSA Z245.1:26, Clause 6.3.5; pp.27–28",
    "text": "If one initial product sample fails, the manufacturer may reject the heat or analyze two more samples from the original failing length/location. Passing both accepts the heat. If both originals fail, or those retests fail, a further option is two additional pipe lengths; passing both accepts the heat except the original failing length. A further failure rejects affected lengths and leads to heat rejection or individual testing, which may be limited to the elements that failed.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Tension-test methods and orientation",
    "clauseRef": "CSA Z245.1:26, Clauses 7.2.1–7.2.5 and 8.2.1; pp.29–30,42",
    "text": "Use ASTM A370 at room temperature and round yield/ultimate tensile strength to the nearest MPa. Grades 241–620 use yield at 0.5% total extension under load; grades above 620 use 0.2% offset. Welded pipe OD ≥219.1 mm uses transverse body tests. Seamless pipe at that diameter may use transverse or longitudinal tests. Smaller pipe uses longitudinal body tests. Grades above 386 additionally require longitudinal tests for information when not otherwise required. Body tests measure yield, tensile strength, applicable yield/tensile ratio and elongation.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Tensile sampling and specimen preparation",
    "clauseRef": "CSA Z245.1:26, Clauses 7.2.3–7.2.5; pp.29–31",
    "text": "Longitudinal seam-pipe longitudinal body samples are approximately 90° from the seam; helical longitudinal samples are one quarter of the distance between seams. Transverse welded-pipe body samples are opposite a longitudinal seam or midway between helical seams, at 90° to pipe axis. Transverse strip coupons are flattened at room temperature to residual curvature ≤1.5 mm per 300 mm. Transverse weld samples span the seam and full wall; keep reinforcement unless agreed otherwise or removed as part of production. SAW weld tests include tensile strength and elongation; EW weld tests include tensile strength.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Tensile frequencies and SAW weld elongation",
    "clauseRef": "CSA Z245.1:26, Clauses 8.2.1.3–8.2.2; pp.42–43",
    "text": "Use Table 9 frequencies for body, longitudinal information and main-seam weld tests. Welded pipe OD ≥219.1 mm requires transverse weld tension testing. Skelp-end welds require one test per 100-length test unit containing those welds. SAW longitudinal, helical and skelp-end weld elongation in 50 mm is at least 10%, with tensile strength from Table 8.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Tensile retests and traceability",
    "clauseRef": "CSA Z245.1:26, Clause 7.2.6; p.31",
    "text": "A failed unit may be rejected or retested using two additional lengths. Below Grade 414, passing both can accept the unit; the initial length needs passing end tests. At Grade 414 and above, use individual traceability to mother coil/plate position and test surrounding lengths, including daughter-coil/plate neighbors, until passing results surround the failing section. Reject pipe from that section; initial-length end acceptance still applies. Further failures cause rejection or individual testing of the remaining unit.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Ductility-test selection",
    "clauseRef": "CSA Z245.1:26, Clause 8.3; pp.43–44",
    "text": "SAW pipe requires face/root guided bends. EW pipe OD ≥60.3 mm requires flattening; EW pipe OD <60.3 mm requires full-section bending. Root guided bends for EW OD ≥60.3 mm are additional when ordered, or as required by sour-service provisions. SAW seam bends occur per 100-length unit or welding shift, whichever is more frequent; skelp-end bends per 100 lengths containing those welds. Hot-reduced EW flattening and small EW bends use 400-length units.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Flattening and bend acceptance",
    "clauseRef": "CSA Z245.1:26, Clauses 7.3–7.5; pp.31–35",
    "text": "Flatten rings are at least 65 mm long; there must be no opening before plate separation reaches half specified OD. Test EW single-length ends or continuous coiled-skelp multiple-length boundaries with the seam at 0° and 90°; root-bend testing can replace the 0° flattening orientation. Small EW pipe bends cold through 90° on a mandrel no larger than 12 times OD with no outside opening. Guided bends are about 180° with no complete fracture and no weld/interface opening above 3 mm. SAW exceptions allow edge-origin openings <6 mm and body subsurface-related openings shallower than 12.5% wall thickness.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "CVN procedure and individual specimen acceptance",
    "clauseRef": "CSA Z245.1:26, Clause 7.6.1; p.36",
    "text": "Use ASTM A370 unless the purchaser specifies ISO 148-1 with a 2 mm striker. A CVN test uses three adjacent specimens; compare the rounded average with the specified minimum. At most one specimen may be below that minimum and none may be below two thirds of it. A separate Category II shear criterion also requires each specimen to reach 50% shear. Etch weld specimens before notching; EW fusion-line notch is within 0.5 mm of the line and weld-zone notch within 3 mm.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "CVN specimen size and sampling",
    "clauseRef": "CSA Z245.1:26, Clauses 7.6.2–7.6.3; pp.36–37",
    "text": "Use full-size specimens whenever feasible, otherwise the largest feasible subsize. Scale energy limits using Table 7 ratios. A smaller standard size may be selected if expected energy exceeds 80% of machine capacity. Use unflattened specimens unless even half-size is physically impossible. Body orientation is transverse and approximately 90° from a weld; seamless OD ≤114.3 mm uses longitudinal body specimens. Weld specimens run transverse to the weld axis.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Body toughness and temperature",
    "clauseRef": "CSA Z245.1:26, Clauses 8.4.1–8.4.5; pp.44–45",
    "text": "Use the purchase-order impact-test temperature; colder testing is acceptable if all applicable energy and shear limits are met. Category I has no proven toughness requirement. Category II uses CVN shear at OD ≤457 mm and DWTT shear at OD >457 mm: average shear ≥60%, each specimen ≥50%, and order average ≥85% when at least five heats supply the order. Category II body CVN energy is ≥27 J for OD <457 mm or ≥40 J for OD ≥457 mm, based on full size. Category III has no shear requirement and body CVN energy ≥18 J. Higher ordered energies override these minima.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "SAW weld and HAZ toughness",
    "clauseRef": "CSA Z245.1:26, Clause 8.5.1; p.45",
    "text": "For Category II/III SAW pipe, deposited-weld and HAZ CVN testing is required when the specified pipe-test temperature is below −5 °C. At −5 °C or warmer it is required when ordered. Test at the body temperature, or colder if acceptable, using ≥18 J full-size-equivalent average energy or the higher purchase-order requirement. Use Table 9 frequency.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "EW fusion-line and weld-zone toughness",
    "clauseRef": "CSA Z245.1:26, Clause 8.5.2; p.46",
    "text": "For Category II/III EW pipe, test the fusion line at −5 °C, or a lower temperature if agreed, with average energy ≥18 J full-size equivalent or the higher ordered value. Weld-zone tests use the body-test temperature and Category II body energy limits of 27 J below 457 mm OD or 40 J at/above 457 mm; Category III uses 18 J. Weld-zone testing can be omitted when the fusion line is tested at the body-test temperature and meets 8.5.2.2. Table 9 controls frequency.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "DWTT procedure and retests",
    "clauseRef": "CSA Z245.1:26, Clause 7.7; pp.39–40",
    "text": "Use API RP 5L3 and two adjacent specimens; the rounded average percent shear is the test result. Specimens run transverse to the pipe axis and approximately 90° from a weld. Planimetric measurement is the referee method in evaluation disputes. A failed body test may be rejected or retested with two additional lengths; passing both still requires passing ends of the original tested length/portion before accepting it. Further failures cause rejection or individual testing.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "CVN weld/body retests",
    "clauseRef": "CSA Z245.1:26, Clauses 7.6.4–7.6.5; pp.37–39",
    "text": "Body failures allow rejection or two-length retests, with original-length end acceptance and further-failure rejection/individual testing. SAW weld failures use two additional pipes or the purchaser’s frequency; remove failed skelp-end/circumferential welds and retest both ends of failed main seams. EW weld retests are a welding-process bracketing procedure, independent of the nominal test unit: isolate the failing sequential production between acceptable weld tests, reject that interval, and qualify initial pipe ends separately.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Hardness procedure and local body confirmation",
    "clauseRef": "CSA Z245.1:26, Clause 7.8; pp.40–42",
    "text": "Macrohardness uses ASTM E18 Rockwell A/B/C or ASTM E92 HV10; microhardness uses HV0.5 under ASTM E92/E384. Follow Figure 13 traverses. Below 6 mm thickness, use outside/inside traverses or only the middle traverse when indentation spacing makes the others impractical. For body/parent-metal exceedances only, 3–6 nearby additional readings may qualify the location if their average meets the limit and no such reading exceeds it by over 10 HV10 or 2 HRC. Weld/fusion-line failure retesting follows process-specific rules rather than this body exception.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Hardness limits",
    "clauseRef": "CSA Z245.1:26, Clause 8.6; pp.46–47",
    "text": "The general macrohardness ceiling is 27 HRC or 279 HV10, or the ASTM E140 equivalent. Non-sour Grades 483 and higher may reach 30 HRC or 302 HV10. Sour-service limits in Clause 16.4/16.5 take precedence. Apply Table 9 testing frequencies.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Hydrostatic testing and pressure",
    "clauseRef": "CSA Z245.1:26, Clause 9; pp.47–48",
    "text": "Every pipe length withstands the required mill hydrostatic pressure without leakage except the permitted jointer alternatives. Hold at least 5 seconds for all seamless pipe and welded OD ≤457 mm; hold at least 10 seconds for larger welded pipe. Record pressure/time or use an automatic interlock and retain evidence. Minimum pressure is the Table 1 value or 2St/D, rounded to 0.1 MPa, where S is SMYS times the applicable Table 1 percentage and dimensions are mm. Increased ordered pressure applies. End-load compensation requires purchaser/manufacturer agreement and required hoop stress above 90% SMYS. Mill test pressure is not a design or working-pressure rating.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Mass, wall thickness and measurement",
    "clauseRef": "CSA Z245.1:26, Clauses 10.1.2–10.5 and 11.4.4–11.4.6; pp.48–49,52–53",
    "text": "Calculate plain-end kg/m as 0.02466(D−t)t using mm dimensions. Every length meets wall limits from Table 3; the weld area is exempt from the positive wall tolerance, while EW flash trims still require at least 95% nominal wall. Calibrated nondestructive devices or calipers may measure wall; specified mechanical calipers govern disputes. Pipe OD >114.3 mm is weighed individually, with jointer alternatives; smaller pipe may be weighed individually or in lots. Table 4 controls mass and Table 2 length unless the order specifies permitted alternatives.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Mill jointers",
    "clauseRef": "CSA Z245.1:26, Clause 10.6; p.49",
    "text": "Mill jointers require purchase-order authorization and Clause 14 compliance. Each component is at least 1.5 m when joined. Two-piece lengths below 15 m are single jointers, limited to 5% of the order unless agreed otherwise. Two-piece lengths ≥15 m are double jointers, permitted for the whole order. Three-piece lengths ≥15 m are triple jointers, limited to 5% unless agreed otherwise.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Plain pipe end finish",
    "clauseRef": "CSA Z245.1:26, Clause 10.7.1; p.50",
    "text": "Unless changed by the order, provide a 30° bevel with +5°/−0° tolerance and 1.6 ±0.8 mm root face. Remove inside/outside burrs and keep end squareness within 1.6 mm. SAW inside bead is removed over at least 75 mm from both ends to ≤0.5 mm above the adjacent surface. If ordered, remove outside bead over at least 120 mm to ≤0.1 mm.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Special pipe ends",
    "clauseRef": "CSA Z245.1:26, Clause 10.7.2; pp.50–51",
    "text": "Mechanical-interference, threaded/coupled and special-coupling ends require the ordered configuration. Belled welded ends require weld-area nondestructive inspection. Threads follow ASME B1.20.1. Couplings are applied hand-tight unless power-tight is ordered. Special-coupling ends must permit proper makeup for 200 mm from each end.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Inspection and body OD",
    "clauseRef": "CSA Z245.1:26, Clauses 11.1–11.4.1; p.51",
    "text": "Inspect visually or with combined visual/NDT methods for dimensions and workmanship. Give production notice when purchaser inspection is ordered and provide access to relevant manufacturing areas. Body OD limits come from Table 10. At OD ≥114.3 mm make random body checks at least three times per working shift; diameter-tape results govern disputes unless agreed otherwise.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "End OD tolerance",
    "clauseRef": "CSA Z245.1:26, Clause 11.4.2; p.52",
    "text": "Within 100 mm of ends: OD ≤273.1 mm must be at least specified OD minus 0.4 mm and pass a ring gauge of specified OD plus 1.6 mm. At 273.1 < OD ≤457 mm, tolerance is ±0.50% OD, capped at ±1.6 mm. OD >457 mm uses ±1.6 mm. Applying the large-pipe end tolerance to ID instead of OD requires purchaser/manufacturer agreement.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "End ovality",
    "clauseRef": "CSA Z245.1:26, Clause 11.4.3; p.52",
    "text": "Within 100 mm of ends for OD >457 mm, D/t >75 allows maximum/minimum actual diameters within ±1% of specified OD. At D/t ≤75, maximum minus minimum diameter is ≤12.7 mm for OD ≤1067 mm or ≤15.9 mm for larger OD. Measure actual extreme diameters using a suitable gauge/caliper; diameter-tape mean circumference does not establish ovality.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Seam offset, flash and reinforcement",
    "clauseRef": "CSA Z245.1:26, Clauses 11.5.1–11.5.6; pp.53–54",
    "text": "EW seam radial offset is ≤max(10% wall, 0.8 mm). SAW uses that limit at ends and ≤max(10% wall, 1.5 mm) away from ends. SAW bead reinforcement is ≤4.0 mm and must not lie below the body surface except allowable undercuts; grind/machine as needed. EW outside flash is ≤0.2 mm; inside flash ≤1.5 mm, excluding localized upset thickening. EW trim areas retain ≥95% nominal wall; internal groove depth follows Table 11 and profile changes cannot exceed 0.5 mm.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Hard spots and weld seam locations",
    "clauseRef": "CSA Z245.1:26, Clauses 11.5.7–11.5.8; pp.54–55",
    "text": "Visually inspect welded OD ≥323.9 mm for hard-spot indications. A spot above 300 HV30 is defective; away from welds, a spot is also defective when >225 HV30 and >75 HV above surrounding material. Helical skelp-end/seam junctions remain ≥300 mm from finished ends/jointers; skelp-end welds at those locations need ≥150 mm circumferential separation. Jointer seams need ≥50 mm helical circumferential separation or 50–200 mm for longitudinal pipe.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Straightness and end geometry",
    "clauseRef": "CSA Z245.1:26, Clauses 11.5.9–11.5.10; p.55",
    "text": "OD ≥114.3 mm is randomly checked for straightness with deviation ≤0.2% of length; smaller pipe is reasonably straight. Forming/manufacturing deviations within 200 mm of an end cannot depart from the extended normal cylindrical contour by more than 3 mm.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Surface defects and disposition",
    "clauseRef": "CSA Z245.1:26, Clause 11.6.1; pp.55–56",
    "text": "Dents deeper than 6 mm or longer than half OD are defects; smaller dents with stress concentrators also need removal or qualifying grinding. Leaks, arc burns and surface cracks are defects. End/bevel laminations wider than 6 mm require cutback. Undercuts deeper than 0.5 mm and other surface imperfections deeper than 12.5% nominal wall are defects. Grinding requires the remaining wall to meet limits, smooth blending and confirmation of complete removal where specified. Repair welding is restricted by Clause 13.3; otherwise cut out the affected cylinder or reject the pipe.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Tensile table and diameter applicability",
    "clauseRef": "CSA Z245.1:26, Table 8; printed p.90 / PDF p.31",
    "text": "Audited tensile rows are [grade: yield range; tensile range], all MPa: 241:241–495;414–760, 290:290–495;414–760, 359:359–530;455–760, 386:386–540;490–760, 414:414–565;517–760, 448:448–600;531–760, 483:483–620;565–760, 550:550–690;620–830, 620:620–760;690–900, 690:690–825;760–970, 825:825–1050;915–1145. Maximum yield/tensile strengths apply only at OD ≥219.1 mm. Y/T limits apply only at OD ≥355.6 mm: 0.93 except other than flattened strip at Grade 620 (0.95) and 690 (0.97); Grade 825 is 0.99 for both specimen types. Intermediate grades interpolate: minimum yield rounded to 1 MPa, other strength limits to 5 MPa, and Y/T to 0.01. Elevated service permits a maximum YS increase of 75 MPa through Grade 448, or 100 MPa above Grade 448; maximum TS does not receive this allowance.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Elongation formula and nominal area",
    "clauseRef": "CSA Z245.1:26, Table 8 and Clause 7.2.4.7; printed pp.30,90 / PDF pp.91,31",
    "text": "For strip, round and full-section body specimens, minimum elongation is e = 1940 A^0.2 / U^0.9, rounded to the nearest whole percent on a 50 mm gauge basis. A is the nominal specimen cross-sectional area, rounded to the nearest mm² and capped at 500 mm². U is specified minimum tensile strength, never measured UTS. At gauge lengths below 50 mm, convert measured elongation to 50 mm using ISO 2566-1. Round transverse specimens come from non-flattened pipe and their nominal diameters follow Table 17. Several Table 17 thickness boundaries use strict inequalities: an exact boundary needs specimen-method review, rather than silently selecting a larger bar.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Strength and chemistry comparison precision",
    "clauseRef": "CSA Z245.1:26, Clauses 4.3 and7.2.1; printed pp.25,29 / PDF pp.96,92",
    "text": "Apply ASTM E29 rounding to the limiting value's last stated digit unless a specific test rule supersedes it. Yield/tensile results round to the nearest MPa; CVN averages round to the nearest joule; shear test averages round to the nearest percent. Preserve raw reported values and identify the rounded decision basis for near-boundary results.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Hydrostatic table, stress fractions and caps",
    "clauseRef": "CSA Z245.1:26, Table 1 notes 1–2; printed pp.84–85 / PDF pp.37–36",
    "text": "Use Table 1 prescribed pressures for listed small OD/wall combinations. Other combinations use P = 2St/D, rounded to 0.1 MPa. S is 60% of SMYS below OD 168.3 mm, 75% at 168.3 ≤ OD <273.1, 85% at 273.1 ≤ OD <508, and 90% at OD ≥508. For Grade 241, the minimum required pressure need not exceed 17.2 MPa at OD ≤88.9 mm, or 19.3 MPa above it. For higher grades, the minimum need not exceed 20.7 MPa. These caps limit the required minimum and do not prohibit higher ordered pressures.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Body and weld sampling frequencies",
    "clauseRef": "CSA Z245.1:26, Table 9 items1–8,17–23; printed pp.91–93 / PDF pp.30–28",
    "text": "Heat chemistry: one analysis per heat. Product chemistry: two analyses per heat from separate items. Body tension and applicable CVN tests: one per test unit of up to 400 lengths at OD ≤141.3 mm, 200 lengths at 141.3 < OD ≤323.9, or 100 lengths above 323.9. Transverse weld tension applies at OD ≥219.1, with up to 200 lengths through OD 323.9 and 100 above it. SAW skelp-end weld tension: one per test unit of up to 100 lengths containing end welds. Category II DWTT above OD 457: one per test unit of up to 100 lengths. Each mandatory body/weld/HAZ/fusion target is tested separately.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Ductility frequencies",
    "clauseRef": "CSA Z245.1:26, Table 9 items9–16; printed pp.91–92 / PDF pp.30–29",
    "text": "EW single lengths at OD ≥60.3 mm: flatten both ends at weld positions 0° and 90°. EW coiled skelp: test leading/trailing ends of each continuous multiple length. Hot-reduced EW: one per test unit of up to 400 lengths. SAW root and face bends: one per 100-length test unit or one per welding shift, whichever is more frequent; skelp-end bends: one per 100 lengths containing end welds. EW root guided bends, when ordered or required for sour service, test each end of each single length or leading first/trailing last ends of each coiled multiple length. EW below OD 60.3: one bend per 400-length test unit.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Hardness and dimensional inspection frequencies",
    "clauseRef": "CSA Z245.1:26, Table 9 items24–38 andnotes; printed pp.93–95 / PDF pp.28–26",
    "text": "EW macrohardness, and sour microhardness: one test per welding shift at weld zone, fusion line and parent metal. SMLS body hardness uses test units of up to 400 lengths at OD ≤141.3 mm, 200 through 323.9, and 100 above 323.9. SAW above OD 323.9 uses up to 100 lengths at body/parent metal, weld and HAZ. Sour Table 9 rows 29–32 also apply; sour macrohardness frequency satisfies ordinary macrohardness frequency. Hydrotest every pipe. Table 9 item 34 permits random wall measurements, while every length must meet Clause 10.3. Check mass individually or in convenient lots at OD ≤114.3, and each length above it. At OD ≥114.3, take at least three body OD measurements per shift. Nominal cold expansion within ±0.2% counts as the same expansion ratio.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Supplementary test frequencies",
    "clauseRef": "CSA Z245.1:26, Table 9 items39–44; printed pp.94–95 / PDF pp.27–26",
    "text": "The purchase order defines elevated-temperature tension and supplemental toughness frequencies. All-weld-metal tension at room and elevated temperatures forms part of each welding procedure qualification. Strain-based longitudinal body, all-weld-metal and mill-jointer cross-weld frequencies are also order-defined. A generic heat/lot frequency does not satisfy these supplemental tests.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Residual magnetism",
    "clauseRef": "CSA Z245.1:26, Clause 11.7; printed pp.57–58 / PDF pp.64–63",
    "text": "Measure longitudinal residual field at each end of a selected pipe at least once per four hours per shift, using a calibrated Hall-effect meter (the referee method) or equivalent. Below OD 168.3 mm, take at least two readings 180° apart per end; at larger sizes, at least four readings 90° apart. Each end's average is ≤3.0 mT and every reading ≤3.5 mT. Measurements on stacked/bundled pipe are invalid. A failure triggers containment back to the last accepted test. With documented production order, reverse bracketing may stop after three consecutive passing pipes; then measure forward until three consecutive passing pipes. Demagnetize and remeasure nonconforming pipe.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Full-length NDE and personnel",
    "clauseRef": "CSA Z245.1:26, Clauses 12.1–12.3; printed pp.58–60 / PDF pp.63–61",
    "text": "Inspect SMLS bodies and EW/SAW seams for their full lengths, with applicable checks for otherwise inaccessible end zones. NDE occurs after cold expansion and in the finished bare-metal heat-treatment condition. Personnel qualify to CAN/CGSB 48.9712/ISO 9712, ASNT SNT-TC-1A or equivalent; a Level II/III supervisor directs the program. Communicate the chosen optional inspection method when the purchaser requests it.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "EW, SAW, skelp and jointer NDE",
    "clauseRef": "CSA Z245.1:26, Clauses 12.2.1–12.2.5; printed pp.58–60 / PDF pp.63–61",
    "text": "EW longitudinal imperfections: UT or electromagnetic inspection below OD 273.1 mm, UT at larger sizes. For EW single plate-skelp lengths, inspect at least 200 mm of end seam by manual UT or agreed method. SAW longitudinal/transverse imperfections: UT and/or radiological inspection; field ends require at least 200 mm of film or non-film radiographic inspection. Grinding end beads, or end cold sizing above 0.4% after radiography, requires MT/PT of end weld areas. SAW skelp-end welds use UT/radiological methods; GMAW-containing end welds require UT. Seam junctions and circumferential jointers receive the specified UT/radiological inspection, with applicable CSA Z662 jointer acceptance. SMLS inspection addresses inside/outside longitudinal/transverse imperfections using documented UT/electromagnetic procedures.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Radiological technique and records",
    "clauseRef": "CSA Z245.1:26, Clauses 12.4.1–12.4.4; printed pp.60–62 / PDF pp.61–59",
    "text": "Use ASTM E94/E94M technique guidelines, ISO 5579 GI/GII film and exposed film density 1.5–4.0 through the area of interest. Hole IQIs conform to ASTM E1025; wire IQIs to ASTM E747 or ISO 19232-1; Table 12 sizes vary by weld thickness and method. The essential hole is 4T for fluoroscopy and 2T for radiography. Hole IQIs are adjacent to the weld and shimmed to weld-equivalent thickness; wire IQIs cross the weld perpendicular to its axis. IQI checks: every film, one per 50 pipes for fluoroscopy, each non-film image or a qualified interlocked/stable system at least twice per shift, before planned shutdown, and at production end. Failed sensitivity requires reinspection back to the last acceptable image. Keep results at least five years and traceable film/images at least two years.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Radiological acceptance limits",
    "clauseRef": "CSA Z245.1:26, Clause 12.4.5 andTable13; printed pp.62,97 / PDF pp.59,24",
    "text": "An elongated slag inclusion is at most 1.5 mm wide and 50 mm long; total inclusion length in any 300 mm weld is at most 50 mm. Circular slag/gas dimensions are at most the lesser of 3 mm and 25% of specified wall. Projected area within 150 mm of weld is at most 3% below weld thickness 14 mm, 4% at 14–18 mm, and 5% above 18 mm. Cracks, lack of penetration and incomplete fusion are unacceptable at any location. Grinding must retain specified wall; weld repair is limited to Clause 13 eligibility, with cutout/rejection alternatives.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Ultrasonic equipment, reference and calibration",
    "clauseRef": "CSA Z245.1:26, Clauses 12.5.1–12.5.3; printed pp.63–65 / PDF pp.58–56",
    "text": "UT needs sufficient pulses at production speed, shear-wave angles generally 45°–80°, search units on both sides, gating for weld/tracking variation, couplant monitoring, audible/visible alarms and location marking for unattended systems. The reference pipe/coupon matches production dimensions, acoustic properties, surface finish and heat-treatment history. Select Figure 7 indicators and required notches, except notches are unnecessary below OD 60.3 mm. Figure 7 N5/N10 notch depths are max(0.05t/0.10t, 0.3 mm), with ±15% depth tolerance and length ≤50 mm. Document standardization at simulated production speed and any permitted alternatives under 12.5.3.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Ultrasonic acceptance and sensitivity",
    "clauseRef": "CSA Z245.1:26, Clauses 12.5.4–12.5.6; printed pp.65–66 / PDF pp.56–55",
    "text": "UT acceptance derives from the selected reference indicator and documented procedure; set alarms at or below acceptance. Resolve signals exceeding acceptance using permitted verification, grinding, weld repair, cutout or rejection. Document UT indications accepted after radiographic verification. Check sensitivity at least twice per shift, before planned shutdown and at production end. A reference amplitude more than 3 dB below the acceptance limit triggers recalibration and reinspection back to the preceding acceptable standardization. Periodic metallographic examination of detected imperfections checks system sensitivity.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Electromagnetic NDE",
    "clauseRef": "CSA Z245.1:26, Clauses 12.6.1–12.6.2; printed pp.66–69 / PDF pp.55–52",
    "text": "Continuously inspect applicable inner/outer longitudinal seam and body imperfections, with audible/visible alarms and unattended location marking. Reference material properties/dimensions match production. Weld references include a hole ≤1.6 mm and inner/outer N10 notches at OD ≥60.3 mm. Body references use a hole ≤3.2 mm and applicable N10/T notches away from the weld. Standardize before production, after shutdown and after required sensitivity checks, with signal/noise ratio ≥2.5:1. Check at least twice per shift, before planned shutdown and at production end; a loss above 3 dB requires reinspection of affected production. Alarms are at or below acceptance; finished residual field meets 11.7. Grind repair needs MT/PT verification, a smooth contour and acceptable remaining wall.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Magnetic particle and liquid penetrant NDE",
    "clauseRef": "CSA Z245.1:26, Clauses 12.7–12.8; printed p.70 / PDF p.51",
    "text": "MT follows ASTM E709 and uses a circular field transverse to the weld strong enough to indicate weld defects. Provide a purchaser-requested demonstration on similar pipe with natural or artificial imperfections. PT follows ASTM E165/E165M. Defect removal and disposition follow Clause 11.6.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Weld repair eligibility and preparation",
    "clauseRef": "CSA Z245.1:26, Clauses 13.1–13.4; printed pp.70–71 / PDF pp.51–50",
    "text": "Repair welding is permitted only for defects in SAW weld seams. Completely remove/clean cracks and other defects; MT/PT confirms crack removal. Cavity rims extend at most 3 mm into parent metal perpendicular to the weld. Cavity depth is greater than 1.5 mm and at most two-thirds of specified wall, excluding bead height. Repair length is at least 50 mm; back-to-back repairs are prohibited. Use SAW, GMAW, SMAW or FCAW with qualified procedures/welders, subject to the automatic SAW procedure exception. Heat input below 1 kJ/mm requires preheat ≥120°C; heating above 200°C requires consideration of the time-temperature effects on properties. Repair UT is mandatory; radiographic reinspection is also required when the original defect was radiologically detected.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Repair procedure and welder qualification",
    "clauseRef": "CSA Z245.1:26, Clauses 13.5–13.6; printed pp.71–72 / PDF pp.50–49",
    "text": "Repair procedure qualification uses two specimens per grade, with CE no lower than production CE minus 0.05, thickness at least production thickness, and test temperature at or below the lowest repair temperature. Radiographic acceptance follows 12.4.5; transverse weld strength is at least grade SMTS; 180° guided bends use the Table 16 jig. Welders qualify with radiography and two guided bends. Immediate retesting requires four passing specimens, or two after further instruction. Qualification covers equal/lower grade and thickness. Requalify at least annually, after three months without the qualified procedure, or when ability is questioned.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Guided-bend and repair jigs",
    "clauseRef": "CSA Z245.1:26, Tables 14–16; printed pp.97–98 / PDF pp.24–23",
    "text": "The standard guided-bend jig uses A = 1.15(D − 2t)/(e(D/t) − 2e − 1) − t, rounded to 5 mm without exceeding 790 mm. Male radius is A/2; female width is A + 2t + 3.2 and radius is B/2. Table 15 strains are 0.1375 for 241/290, 0.1250 for 359, 0.1175 for 386, 0.1125 for 414, 0.1100 for 448, 0.1050 for 483, 0.0950 for 550, 0.0875 for 620, 0.0800 for 690 and 0.0675 for 825. Intermediate-grade strain interpolates by SMTS and rounds to 0.0025. Repair jig male widths are 6t, 8t, 9t, 10t, 11t, 12t, 13t and 14t for Table 16 grade groups, with male radius A/2, female width A + 2t + 3.0 and radius B/2. Smaller jig dimensions are permitted; intermediate grades must remain consistent with the table.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Mill-jointer manufacture and inspection",
    "clauseRef": "CSA Z245.1:26, Clause 14; printed pp.72–73 / PDF pp.49–48",
    "text": "Circumferential jointer procedures qualify to ASME IX. The portions being joined have passed inspection including hydrotest, or the completed jointer is hydrotested. Seam positions follow 11.5.8 and straightness follows 10.6; do not straighten by bending the jointer weld. Outside high-low is at most 2.5 mm. Outside bead heights are at most 2.5 mm at wall ≤10 mm, 3.5 mm at greater wall, and 5.0 mm at overlaps. Beads cannot lie below adjacent parent contour except the allowed undercut. Grinding/machining is permitted. Identify manual welders and inspect the full weld circumference under 12.2.4.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Required markings and traceability",
    "clauseRef": "CSA Z245.1:26, Clauses 15.1–15.2; printed pp.73–74 / PDF pp.48–47",
    "text": "Mark the manufacturer, Z245.1:26, nominal OD/wall, grade, Category II/III and certified toughness temperature when applicable, SS for sour service, S for seamless/E for EW, HN/HQ/HS/HA for ordered heat treatment, ET/SBD when applicable, length, ordered higher hydro pressure at OD ≥60.3 mm, and heat/code. Certified toughness temperature cannot be colder than certifiable actual body/EW weld-zone or SAW weld/HAZ tests, allowing the stated test-temperature exceptions; EW fusion-line testing has its separate −5°C rule. Mark length in metres to two decimal places; OD ≤48.3 mm permits bundle length.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Marking location, stamping and coating",
    "clauseRef": "CSA Z245.1:26, Clauses 15.3–15.6; printed pp.74–76 / PDF pp.47–45",
    "text": "At OD ≤48.3 mm, use outside paint/label or a bundle tag. At 48.3 < OD <508, use inside or outside paint/label unless otherwise ordered. At OD ≥508, use inside paint/label unless outside marking is agreed. Outside painted length is 300–600 mm from the end; other required outside painted marks and outside labels are near but at least 450 mm from the end, with heat-code position chosen by the manufacturer. Preserve the 15.4 sequence when individual meanings are not obvious. Die stamping is generally prohibited; permitted additional end-face marks are at least 25 mm from a weld, applied below 100°C with low-stress dies. Supply bare finish unless ordered otherwise; PO coating requirements include surfaces and end cutbacks.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Sour-service scope and mandatory limits",
    "clauseRef": "CSA Z245.1:26, Clauses 16.1–16.6,16.8–16.10; printed pp.76–77 / PDF pp.45–44",
    "text": "Sour service is explicitly ordered and limited to grades ≤483. Report inclusion shape control when used. Welding qualification microhardness at the hardest microstructure is ≤250 HV0.5. Production macrohardness is ≤22 HRC/250 HV10 and microhardness ≤250 HV0.5 at applicable body, weld, fusion and HAZ locations, with Table 9 frequencies. EW OD ≥60.3 requires root guided bends. TS is ≤625 MPa through Grade 386, ≤650 MPa between 386 and 483, and ≤665 MPa at 483. Body lamination defects exceed both 20 mm width and 500 mm² area. Nickel is ≤1.0% at every location, including deposited weld metal. Base Table 5 S ≤0.035% remains; this edition has no generic 0.003% sulfur limit.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Ordered HIC testing",
    "clauseRef": "CSA Z245.1:26, Clause 16.7; printed p.77 / PDF p.44",
    "text": "Hydrogen-induced cracking testing is required when specified by the purchaser. Follow ANSI/NACE TM0284, with solution, frequency and acceptance criteria defined in the order. Do not assume universal CLR/CTR/CSR criteria or establish HIC/SSC suitability from chemistry alone.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Elevated-temperature service",
    "clauseRef": "CSA Z245.1:26, Clause 17; printed pp.77–78 / PDF pp.44–43",
    "text": "Apply base clauses and other invoked service clauses with the stricter requirements of Clause 17. The order states elevated temperatures, tension frequency, specimen type/size/location/orientation, body/weld property limits, retests and supplemental toughness temperature/energy. ASTM E21 elevated tension is additional to ASTM A370 room-temperature tension. SAW grade and flux/electrode classification combinations are essential variables. Each PQR requires room/elevated all-weld-metal tension, with yield strength at least body SMYS at each temperature. Supplemental body, SAW weld/HAZ and EW zone/fusion toughness at minimum design temperature meets order energy; Category II shear still follows 8.4.4.1.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Strain-based design",
    "clauseRef": "CSA Z245.1:26, Clause 18; printed pp.79–81 / PDF pp.42–40",
    "text": "The order defines longitudinal body, all-weld-metal and mill-jointer cross-weld testing and acceptance. No universal strain-capacity criterion is specified. Optional strain-aging/aging tests identify strain, temperature, duration, heating method, specimen/test method, properties and retests. Body tests before/after aging may include YS/TS bands, Y/T, uniform elongation, longitudinal YS spread, full stress-strain curves and strain-hardening/curve shape. The order may tighten dimensions/hardness and add full-body or plate/coil UT. Longitudinal tests are additional to applicable transverse tests. SAW grade/flux/electrode classes are essential variables. Mill-jointer cross-weld tests follow ASTM A370 before/after aging as applicable and must fail outside weld/HAZ unless otherwise agreed.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Certificate and material test report",
    "clauseRef": "CSA Z245.1:26, Clauses 19.1–19.2; printed pp.81–83 / PDF pp.40–38",
    "text": "Provide a certificate for each order item and an MTR. The certificate identifies edition, dimensions, grade, category, certified toughness temperature, process, heat treatment, SS/ET/SBD and certified hydro pressure/duration. Each heat report includes deoxidation, heat/product chemistry, CSA CE, C/Mn/P/S/Si/Cu/Ni/Cr/Mo/V/Nb/B and intentionally added alloys, with steelmaking/rolling/pipe facility names and locations. Report applicable tensile test units and specimen locations/orientations/types/sizes; individual/average CVN/DWTT results and methods, striker, flattening, notch type, size, temperature and higher ordered acceptance; hardness scale/force/locations/results. Include elevated/strain/inclusion reports as applicable and manufacturing process/rolling mill type when requested. Separately identify hydro certification and any compensation values.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Chemical reporting zeros and record retention",
    "clauseRef": "CSA Z245.1:26, Clauses 19.2.4 and 19.3; printed pp.82,84 / PDF pp.39,37",
    "text": "An element other than B, P or S may be reported as zero when measured below 0.003%; boron may be reported as zero below 0.0005%. These reporting thresholds do not apply to P/S. Retain MTRs/certificates at least ten years, supporting chemistry/mechanical/NDE/calibration/procedure/WPS/PQR records at least five years and radiographic images at least two years. Protect records against loss, damage and degradation.",
    "status": "SOURCE_AUDITED"
  },
  {
    "topic": "Informative annexes",
    "clauseRef": "CSA Z245.1:26, Annexes A–C; printed pp.113–119 / PDF pp.8–2",
    "text": "Annexes A, B and C are informative. A provides dimensions, schedules and weight classes; B provides OD/NPS/DN nomenclature; C summarizes mandatory versus purchaser-option destructive tests without replacing normative clauses. The attached edition has no offshore-service annex, so an assumed offshore overlay must remain unavailable.",
    "status": "SOURCE_AUDITED"
  }
];
