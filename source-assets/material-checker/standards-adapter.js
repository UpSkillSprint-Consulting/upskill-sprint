// Adapter only: numerical tables remain in the shared attachment audit modules.
const MaterialCheckerStandards = (() => {
  const VERSION = '1.0.0';
  const clone = value => JSON.parse(JSON.stringify(value));
  const norm = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const number = value => {if(typeof value==='number')return Number.isFinite(value)?value:null;if(typeof value!=='string'||!/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(value.trim()))return null;const result=Number(value.trim());return Number.isFinite(result)?result:null;};
  const roundEven = (value,increment=1) => {const scaled=value/increment,lo=Math.floor(scaled),fraction=scaled-lo;return (Math.abs(fraction-.5)<1e-9?(lo%2===0?lo:lo+1):Math.round(scaled))*increment;};
  const precision = value => Math.max(2,(String(value).split('.')[1]||'').length);
  const hash = value => {let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');};
  const symbols = {C:'carbon',Mn:'manganese',P:'phosphorus',S:'sulfur',Si:'silicon',Al:'aluminum',Nb:'niobium',V:'vanadium',Ti:'titanium',Cr:'chromium',Ni:'nickel',Mo:'molybdenum',Cu:'copper',B:'boron',N:'nitrogen'};
  const template = name => ({displayName:name,psl:null,category:null,chemistry:{elements:{},carbonEquivalent:{ceIiw:{},cePcm:{}}},mechanical:{},charpy:{},dwtt:null,testing:{},overlays:{},notes:[],equivalents:[],footnoteRules:[]});
  const data = {specBodies:{ASTM:{grades:{ASTM_A36_A36M_GRADE_A36:template('Grade A36')}},CSA_G40_21:{grades:{G40_350W:template('Grade 350W')}},CSA_Z245_1:{grades:{}}}};
  applyAuditedA36(data);applyAuditedG40(data);applyAuditedZ245(data);
  const registry = {
    A36:{edition:A36_AUDIT.edition,sourceHash:A36_AUDIT.source.sha256,grades:data.specBodies.ASTM.grades,catalog:A36_AUDIT.catalog,resolver:resolveAuditedA36},
    G40:{edition:G40_AUDIT.edition,sourceHash:G40_AUDIT.sourceSha256,grades:data.specBodies.CSA_G40_21.grades,catalog:G40_AUDIT.catalog,resolver:resolveAuditedG40},
    Z245:{edition:Z245_AUDIT.edition,sourceHash:Z245_AUDIT.sourceSha256,grades:data.specBodies.CSA_Z245_1.grades,catalog:Z245_AUDIT.catalog,resolver:resolveAuditedZ245}
  };
  const contextFields = {
    A36:['form','unitBasis','analysisType','shapeFlangeThicknessMM','shapeDesignation','gaugeLengthMM','bearingUse','floorPlate','copperSpecified','manufacturerTestRequired','impactSupplement'],
    G40:['form','unitBasis','analysisType','productSubtype','tensileOrientation','gaugeLengthMM','tensileSpecimenType','impactCategory','supplyCondition','shapeGroup','shapeTestLocation','flangeThicknessMM'],
    Z245:['form','analysisType','category','supplyCondition','odMM','nominalAreaMM2','gaugeLengthMM','elongationConvertedTo50MM','tensileSpecimen','orderTemperatureC','toughnessTarget','serviceCondition','annexSelections','orderedCvnEnergyJ','fusionLineOrderTemperatureC','sawWeldToughnessOrdered','ewFusionLineAtBodyTemperaturePassed']
  };
  function row(id,category,propertyCode,label,status,actual,acceptance,basis,detail) {
    return {id,category,propertyCode:propertyCode||'',label,status,actual:actual??'—',acceptance:acceptance??'—',basis:basis||'',detail:detail||'',mandatory:true,warnings:[]};
  }
  function editionMatches(family, raw) {
    const n=norm(raw);if(!n)return false;if(n===norm(registry[family].edition))return true;
    if(family==='A36')return ['19','2019','a36a36m19','astma3619'].includes(n);
    if(family==='Z245')return ['26','2026','z245126','csaz245126'].includes(n);
    return ['r2023','2013r2023','g402113r2023','csag402113r2023','csag402013g402113r2023'].includes(n);
  }
  function identify(value={}) {
    const standard=value.standard??value.targetStandard??'', grade=value.grade??value.targetGrade??'', requestedEdition=value.edition??value.targetEdition??'';
    const n=norm(standard);const family=/^(?:astm)?a36(?:a36m|m)?(?:\d{2})?$/.test(n)?'A36':n===norm(G40_AUDIT.edition)||/^(?:csa)?g402[01](?:13)?(?:g4021(?:13)?)?(?:r2023)?$/.test(n)?'G40':/^(?:csa)?z2451(?:\d{2})?$/.test(n)?'Z245':null;
    if(!family)return {supported:false,family:null};
    const source=registry[family];let gradeKey=null;const g=norm(grade);
    if(family==='A36'&&['a36','gradea36','astma36'].includes(g))gradeKey=A36_AUDIT.gradeKey;
    if(family==='G40')for(const [key,record] of Object.entries(source.grades)){if(norm(record.displayName)===g||record.displayName.split(' / ').some(label=>norm(label)===g||norm(label.replace('Grade ',''))===g)){gradeKey=key;break;}}
    const match=String(grade).match(/^(?:Grade\s*)?(\d+)(?:\s*\(intermediate\))?(?:\s+Category\s+(?:III|II|I))?\s*$/i);const normalizeCategory=v=>String(v??'').toUpperCase().replace(/^CATEGORY\s*/,'').replace(/^CAT_/, '');const gradeCategory=normalizeCategory(String(grade).match(/Category\s+(III|II|I)\b/i)?.[1]),contextCategory=normalizeCategory(value.standardContext?.category??value.category),category=gradeCategory||contextCategory,categoryConflict=!!gradeCategory&&!!contextCategory&&gradeCategory!==contextCategory;
    if(family==='Z245'&&match){const key=`GR_${Number(match[1])}_CAT_${category}`;if(source.grades[key])gradeKey=key;}
    const gradeNumberValid=family==='Z245'&&match&&[...Z245_AUDIT.standardGrades,317].includes(Number(match[1]));
    return {supported:true,family,edition:source.edition,sourceHash:source.sourceHash,requestedEdition,requestedGrade:grade,editionMatches:editionMatches(family,requestedEdition),gradeMatches:!!gradeKey||!!gradeNumberValid,gradeKey,gradeLabel:gradeKey?source.grades[gradeKey].displayName:null,category:family==='Z245'?category:null,categoryConflict:family==='Z245'&&categoryConflict};
  }
  function catalogue() {return Object.entries(registry).map(([family,source])=>({family,edition:source.edition,sourceHash:source.sourceHash,grades:Object.entries(source.grades).map(([key,g])=>({key,value:g.displayName,label:g.displayName,category:g.category,forms:g.applicableForms})),contextFields:contextFields[family],catalog:clone(source.catalog)}));}
  const unitAlias = unit => ({wt_pct:'%',pct:'%',degC:'°C',degF:'°F',ft_lbf:'ft-lb',dimensionless:'ratio'}[unit]||unit);
  function convert(value,from,to,engine) {
    const v=number(value);if(v===null||!from||!to)return null;from=unitAlias(from);to=unitAlias(to);if(from===to)return v;
    if(engine?.convert){const result=engine.convert(v,from,to);if(result!==null&&Number.isFinite(result))return result;}
    const pairs={'ppm>%':v=>v/10000,'%>ppm':v=>v*10000,'ksi>MPa':v=>v*6.894757293168361,'MPa>ksi':v=>v/6.894757293168361,'in>mm':v=>v*25.4,'mm>in':v=>v/25.4,'ft-lb>J':v=>v*1.3558179483314,'J>ft-lb':v=>v/1.3558179483314,'°F>°C':v=>(v-32)*5/9,'°C>°F':v=>v*9/5+32,'psi>MPa':v=>v*.006894757293168361};
    return pairs[`${from}>${to}`]?.(v)??null;
  }
  function domain(value,unit,code,engine) {
    const v=number(value);if(v===null)return 'A finite numeric value is required.';unit=unitAlias(unit);
    if(engine?.numericDomainError){const problem=engine.numericDomainError(v,unit,code,{limit:false});if(problem)return problem;}
    if(unit==='%'&&(v<0||v>100))return 'Percentage must be between 0 and 100.';
    if(unit==='°C'&&v< -273.15)return 'Temperature is below absolute zero.';
    if(unit==='°F'&&v< -459.67)return 'Temperature is below absolute zero.';
    if(unit!=='°C'&&unit!=='°F'&&v<0)return 'This physical quantity cannot be negative.';
    return '';
  }
  function contextOf(scope={},pkg={},engine,rows,identity) {
    const context={...(pkg.standardContext||{}),...(scope.standardContext||{})};
    const formMap={plate:'PLATE',coil:'COIL',sheet:'SHEET',structuralshape:'STRUCTURAL_SHAPE',bar:'BAR',hss:'HSS'};if(!context.form&&formMap[norm(scope.productForm)])context.form=formMap[norm(scope.productForm)];
    delete context.thicknessMM;delete context.widthMM;
    for(const key of ['odMM','nominalAreaMM2','gaugeLengthMM','shapeFlangeThicknessMM','flangeThicknessMM','orderTemperatureC','testTemperatureC','fusionLineOrderTemperatureC','orderedCvnEnergyJ','shapeGroup','stripWidth','stripThickness','roundDiameter'])if(context[key]!==undefined&&context[key]!==''&&context[key]!==null){const raw=context[key],value=number(raw);const temperature=/TemperatureC$/.test(key);if(value===null||(!temperature&&value<=0)||(temperature&&value< -273.15)){rows?.push(row(`std-${identity.family.toLowerCase()}-invalid-context-${key}`,'applicability','',key,'invalid',raw,'Valid source context',identity.edition,'This source context value is outside its physical domain.'));context[key]=null;}else context[key]=value;}
    for(const [key,target] of [['thickness','thicknessMM'],['width','widthMM']]){
      if(scope[key]!==''&&scope[key]!=null){const value=convert(scope[key],scope[`${key}Unit`]||'', 'mm',engine);if(value===null||value<=0)rows?.push(row(`std-${identity.family.toLowerCase()}-nominal-${key}`,'applicability','',`Nominal ${key}`,'invalid',scope[key],'Positive nominal dimension with a supported unit',identity.edition,'A nominal dimension cannot be inferred from a measured result.'));else context[target]=value;}
    }
    return context;
  }
  function documented(check,evidence) {
    const entry=evidence?.[check.id];const status=typeof entry==='object'?entry.value??entry.status:entry;
    if(status===false||status==='no')return row(check.id,'process','',check.label,'fail','No','Documented compliance required',check.basis,check.detail);
    const reference=typeof entry==='object'?String(entry.reference??entry.source??'').trim():'';
    const pass=(status===true||status==='yes')&&!!reference;
    return row(check.id,'process','',check.label,pass?'pass':status==='yes'||status===true?'review':'missing',pass?reference:'Not documented','Confirm with an identified source record',check.basis,check.detail);
  }
  function assessmentFor(identity,context) {
    if(!identity.gradeKey)return null;return registry[identity.family].resolver(registry[identity.family].grades[identity.gradeKey],context);
  }
  function checksFor(identity,assessment) {
    const prefix=`std-${identity.family.toLowerCase()}`;
    return [{id:`${prefix}-catalog-review`,label:'Complete attached-standard requirement review',basis:identity.edition,detail:`Review all ${registry[identity.family].catalog.length} source requirement groups, including applicability, manufacturing, testing, dimensions, inspection, marking and certification; record the controlling evidence. Source SHA-256 ${identity.sourceHash}.`},...(assessment?.manualChecks||[]).map(text=>({id:`${prefix}-manual-${hash(typeof text==='string'?text:JSON.stringify(text))}`,label:'Documented standard requirement',basis:identity.edition,detail:typeof text==='string'?text:JSON.stringify(text)}))];
  }
  function activeMechanical(assessment,context) {
    const t=number(context.thicknessMM);return assessment?.grade.mechanical.thicknessBreakpoints.find(r=>t!==null&&t>r.tMin_mm&&t<=r.tMax_mm)||null;
  }
  function requirementsFor(identity,assessment,context) {
    if(!assessment)return [];const requirements=[];
    const push=(code,label,category,pair)=>{const min=pair?.min,max=pair?.max;if(number(min?.value)===null&&number(max?.value)===null)return;requirements.push({code,label,category,unit:unitAlias(min?.unit||max?.unit),min:min?.value??null,max:max?.value??null,basis:[min?.clauseRef,max?.clauseRef].filter(Boolean).join('; '),verified:min?.verified!==false&&max?.verified!==false});};
    const analysis=String(context.analysisType||'HEAT').toLowerCase();
    for(const [symbol,entry] of Object.entries(assessment.grade.chemistry.elements))push(`chem_${symbols[symbol]||symbol.toLowerCase()}`,`${symbol} (${analysis} analysis)`,'chemistry',entry[analysis]);
    const mechanical=activeMechanical(assessment,context);if(mechanical){push('mech_yield_strength','Yield strength','mechanical',mechanical.yieldStrength);push('mech_tensile_strength','Tensile strength','mechanical',mechanical.tensileStrength);push('mech_elongation','Elongation','mechanical',{min:mechanical.elongation.fixedMin});push('mech_yt_ratio','Yield-to-tensile ratio','mechanical',{max:mechanical.ytRatio.max});push('mech_hardness_hrc','Rockwell C hardness','mechanical',{max:mechanical.hardness.max});}
    const ce=assessment.grade.chemistry.carbonEquivalent.ceIiw.limit;if(number(ce?.value)!==null){push(identity.family==='Z245'?'chem_cecsa':'chem_ceiiw',identity.family==='Z245'?'CSA carbon equivalent':'IIW carbon equivalent','chemistry',{max:ce});requirements[requirements.length-1].unit='%';}
    const formulaSymbols=identity.family==='Z245'?Z245_AUDIT.ceSymbols:number(ce?.value)!==null?['C','Mn','Cr','Mo','V','Ni','Cu']:identity.family==='A36'&&analysis==='heat'?['Mn']:[];
    for(const symbol of formulaSymbols){const code=`chem_${symbols[symbol]}`;if(!requirements.some(r=>r.code===code))requirements.push({code,label:symbol,category:'chemistry',unit:'%',min:null,max:null,basis:ce?.clauseRef||identity.edition,formulaInput:true,requiredReport:identity.family==='A36'&&symbol==='Mn'});}
    if(identity.family==='Z245')requirements.push({code:'mech_hardness_hv',label:'Vickers macrohardness (HV10 alternative)',category:'mechanical',unit:'HV',min:null,max:null,basis:'CSA Z245.1:26, Clauses 8.6 and 16.4',formulaInput:true,alternativeTo:'mech_hardness_hrc'});
    for(const footnote of assessment.grade.footnoteRules||[])if(footnote.type==='COMBINED_MAX')for(const symbol of footnote.elements)if(!requirements.some(r=>r.code===`chem_${symbols[symbol]}`))requirements.push({code:`chem_${symbols[symbol]}`,label:symbol,category:'chemistry',unit:'%',min:null,max:null,basis:footnote.clauseRef,formulaInput:true});
    return requirements;
  }
  function inspect(options={}) {
    const scope=options.scope||options, pkg=options.rulePackage||{}, identity=identify(options.rulePackage?{...pkg,standardContext:{...(pkg.standardContext||{}),...(scope.standardContext||{})}}:scope);
    if(!identity.supported)return identity;const context=contextOf(scope,pkg,options.engine,null,identity), assessment=assessmentFor(identity,context);
    return {...identity,context,grades:catalogue().find(item=>item.family===identity.family).grades,contextFields:contextFields[identity.family],catalog:clone(registry[identity.family].catalog),requiredProperties:requirementsFor(identity,assessment,context),requirements:requirementsFor(identity,assessment,context),documentaryChecks:checksFor(identity,assessment),missingContext:assessment?.missingContext||[]};
  }
  function evaluate(options={}) {
    const scope=options.scope||{},pkg=options.rulePackage||{},actuals=options.actuals||{},evidence={...(scope.standardEvidence||{}),...(options.evidence||{})},engine=options.engine;
    const identity=identify(options.rulePackage?{...pkg,standardContext:{...(pkg.standardContext||{}),...(scope.standardContext||{})}}:scope);
    if(!identity.supported)return {supported:false,rows:[]};
    const {family,edition,sourceHash}=identity,prefix=`std-${family.toLowerCase()}`,rows=[];
    const context=contextOf(scope,pkg,engine,rows,identity),tests={...(scope.standardTests||{})};
    const invalidCodes=new Set();
    const get=(code,unit)=>{const entry=actuals instanceof Map?actuals.get(code):actuals[code];if(entry===undefined||entry===null||entry==='')return null;const raw=typeof entry==='object'?entry.value:entry,from=typeof entry==='object'?entry.unit:unit;if(raw===''||raw==null)return null;const value=convert(raw,from,unit,engine),problem=value===null?'A finite value and supported explicit unit are required.':domain(value,unit,code,engine);if(problem&&!invalidCodes.has(code)){rows.push(row(`${prefix}-invalid-${code}`,'applicability',code,'Invalid actual result','invalid',`${raw} ${from||''}`,'A valid value in a compatible unit',edition,problem));invalidCodes.add(code);}return problem?null:value;};
    const addMissing=(label,basis=edition)=>rows.push(row(`${prefix}-context-${hash(label)}`,'applicability','',label,'missing','Not supplied','Required source context',basis,'Documentary confirmation cannot replace this missing or ambiguous input.'));
    if(!identity.editionMatches){rows.push(row(`${prefix}-edition`,'applicability','','Attached standard edition',identity.requestedEdition?'fail':'missing',identity.requestedEdition||'Missing',edition,edition,'Only the audited attachment edition can be applied automatically.'));return {supported:true,family,edition,sourceHash,rows,context,identity,requirements:[]};}
    if(!identity.gradeMatches){rows.push(row(`${prefix}-grade`,'applicability','','Audited grade','missing',identity.requestedGrade||'Missing','Select a grade covered by the attached audit',edition,'The selected grade is not a record in the attached-edition audit.'));return {supported:true,family,edition,sourceHash,rows,context,identity,requirements:[]};}
    if(identity.categoryConflict)rows.push(row(`${prefix}-category-conflict`,'applicability','','Pipe category agrees with grade designation','fail',`${identity.requestedGrade} / ${context.category}`,'One consistent ordered category',edition,'The category in the selected grade designation cannot be weakened by conflicting context.'));
    if(family==='Z245'&&!identity.gradeKey){addMissing('CSA Z245 pipe category (I, II or III)');return {supported:true,family,edition,sourceHash,rows,context,identity,requirements:[]};}
    if(pkg.attachedStandard){const m=pkg.attachedStandard;if(m.family!==family||m.edition!==edition||m.sourceHash!==sourceHash||(m.gradeKey&&m.gradeKey!==identity.gradeKey))rows.push(row(`${prefix}-metadata`,'applicability','','Audited package identity','fail','Metadata mismatch','Family, edition, source hash and grade must match',edition,'This package identity changed; rebuild its audited source association.'));}
    if(!['HEAT','PRODUCT'].includes(String(context.analysisType||'').toUpperCase()))addMissing('Chemistry analysis type (HEAT or PRODUCT)');
    if(!(number(context.thicknessMM)>0))addMissing('Positive nominal material thickness');
    if(!String(scope.productForm||'').trim())addMissing('Actual product form in material scope');
    if(family==='A36'){for(const flag of ['copperSpecified','impactSupplement',...(context.form==='PLATE'?['floorPlate']:[])])if(typeof context[flag]!=='boolean')addMissing(`Explicit order context: ${flag} (yes or no)`);if(context.form==='PLATE'&&!['NONE','NON_BRIDGE','BRIDGE'].includes(context.bearingUse))addMissing('Plate bearing-use context (none, non-bridge or bridge)');if(context.bearingUse==='NON_BRIDGE'&&typeof context.manufacturerTestRequired!=='boolean')addMissing('Non-bridge bearing-plate order mechanical-test requirement');}
    if(family==='Z245'){if(!['BASE','SOUR','ELEVATED','STRAIN'].includes(context.serviceCondition))addMissing('Explicit service condition (base, sour, elevated or strain-based)');if(!['BODY','WELD_HAZ','SAW_WELD','SAW_HAZ','EW_FUSION_LINE','EW_WELD_ZONE'].includes(context.toughnessTarget))addMissing('Actual toughness test location');if(['SAWL','SAWH'].includes(context.form)&&['WELD_HAZ','SAW_WELD','SAW_HAZ'].includes(context.toughnessTarget)&&number(context.orderTemperatureC)!==null&&number(context.orderTemperatureC)>=-5&&typeof context.sawWeldToughnessOrdered!=='boolean')addMissing('SAW weld/HAZ toughness order requirement at -5°C or warmer');}
    if(!['SI','IMPERIAL'].includes(context.unitBasis)&&family==='A36')addMissing('Separately standardized unit basis (SI or IMPERIAL)');
    if(family==='G40'){const enums={productSubtype:['PLATE','FLOOR_PLATE','COIL','SHEET','BAR','HSS','ROLLED','ROLLED_SHAPE','WELDED_SHAPE','SHEET_PILING','ANGLE','COLD_FORMED_CHANNEL','COLD_FORMED_Z'],supplyCondition:['AS_ROLLED','NORMALIZED','CONTROLLED_ROLLED','NORMALIZING_ROLLED','QT','QUENCHED_TEMPERED','QUENCHED_AND_TEMPERED','STRESS_RELIEVED','ANNEALED'],tensileOrientation:['LONGITUDINAL','TRANSVERSE'],tensileSpecimenType:['RECTANGULAR','STRIP','ROUND','FULL_SECTION'],shapeTestLocation:['FLANGE','WEB'],impactCategory:['1','2','3','4','5']};for(const [key,values] of Object.entries(enums))if(context[key]!==undefined&&context[key]!==null&&context[key]!==''&&!values.includes(String(context[key])))addMissing(`Recognized G40 source context: ${key}`);}
    if(family==='Z245'){if(context.tensileSpecimen&&!['FLATTENED_STRIP','UNFLATTENED_STRIP','ROUND','FULL_SECTION','OTHER'].includes(context.tensileSpecimen))addMissing('Recognized pipe tensile specimen type');if(context.annexSelections!==undefined&&(!Array.isArray(context.annexSelections)||context.annexSelections.some(value=>!['SOUR','SOUR_SERVICE','ELEVATED','ELEVATED_TEMPERATURE','STRAIN','STRAIN_BASED'].includes(String(value)))))addMissing('Recognized additional pipe service clauses');}
    if(family==='G40'&&context.productSubtype){const subtypeForms={PLATE:['PLATE','FLOOR_PLATE','ROLLED'],COIL:['COIL','SHEET','ROLLED'],SHEET:['SHEET','ROLLED'],BAR:['BAR','ROLLED'],STRUCTURAL_SHAPE:['ROLLED_SHAPE','WELDED_SHAPE','SHEET_PILING','ANGLE','COLD_FORMED_CHANNEL','COLD_FORMED_Z','ROLLED'],HSS:['HSS']};if(subtypeForms[context.form]&&!subtypeForms[context.form].includes(context.productSubtype))rows.push(row(`${prefix}-subtype-form-conflict`,'applicability','','Structural product subtype agrees with form','fail',`${context.form} / ${context.productSubtype}`,subtypeForms[context.form].join(', '),edition,'A subtype cannot substitute another product form or bypass its thickness coverage.'));}
    if(family==='G40'&&!context.productSubtype)addMissing('Actual structural product subtype (plate, floor plate, sheet, rolled/welded shape, angle or HSS)');
    if(family==='G40'&&context.tensileSpecimenType==='FULL_SECTION'&&(context.form==='STRUCTURAL_SHAPE'||context.productSubtype==='ANGLE')&&number(context.gaugeLengthMM)!==200)addMissing('Full-section structural-shape specimen requires 200 mm gauge (G40.20 Clause 7.2.1.3)');
    if(family==='G40'&&context.form==='STRUCTURAL_SHAPE'&&!['WELDED_SHAPE','COLD_FORMED_CHANNEL','COLD_FORMED_Z'].includes(context.productSubtype)&&![1,2,3].includes(number(context.shapeGroup)))addMissing('Rolled structural-shape test group (1, 2 or 3)');
    if(context.unitBasis==='IMPERIAL'&&family==='G40')addMissing('G40 inch-pound table assessment is not implemented in this audit resolver; select the SI assessment basis or use a separate controlled assessment');
    let assessment=assessmentFor(identity,context);
    if(context.form&&!assessment.grade.applicableForms.includes(context.form))rows.push(row(`${prefix}-form`,'applicability','','Applicable product form','fail',context.form,assessment.grade.applicableForms.join(', '),edition,'The selected actual product form is outside this grade record.'));
    const scopeForms={plate:['PLATE'],coil:['COIL'],sheet:['SHEET'],bar:['BAR'],structuralshape:['STRUCTURAL_SHAPE'],hss:['HSS'],linepipe:['SEAMLESS','ERW_HFW','SAWL','SAWH'],pipe:['SEAMLESS','ERW_HFW','SAWL','SAWH'],tube:family==='Z245'?['SEAMLESS','ERW_HFW','SAWL','SAWH']:['HSS']};
    const declaredForms=scopeForms[norm(scope.productForm)];if(declaredForms&&context.form&&!declaredForms.includes(context.form))rows.push(row(`${prefix}-form-consistency`,'applicability','','Product form context agrees with material scope','fail',`${scope.productForm} / ${context.form}`,'The scope and resolved source form must agree',edition,'A source context form cannot mask a different actual product form in material scope.'));
    const chemistry={};for(const [symbol,name] of Object.entries(symbols))chemistry[symbol]=get(`chem_${name}`,'%');
    // Apply only the source-declared carbon/manganese tradeoff, never a generic tolerance.
    for(const rule of assessment.grade.footnoteRules||[])if(rule.type==='TRADEOFF_ADJUST'){
      const pair=assessment.grade.chemistry.elements[rule.targetElement]?.heat,source=assessment.grade.chemistry.elements[rule.sourceElement]?.heat?.max?.value;
      if(pair?.max?.value!=null&&source!=null){if(chemistry[rule.sourceElement]===null)pair.max.value=null;else pair.max.value=Math.min(rule.ceiling,pair.max.value+Math.floor(Math.max(0,source-chemistry[rule.sourceElement])/rule.adjustPerUnit.sourceDecrement+1e-8)*rule.adjustPerUnit.targetIncrement);}
    }
    const input={...chemistry,ys:get('mech_yield_strength','MPa'),uts:get('mech_tensile_strength','MPa'),el:get('mech_elongation','%')};
    for(const [code,entry] of (actuals instanceof Map?[...actuals.entries()]:Object.entries(actuals))){const raw=typeof entry==='object'&&entry!==null?entry.value:entry,unit=typeof entry==='object'&&entry!==null?entry.unit:null;const target=code.startsWith('chem_')?'%':/mech_(?:yield_strength|tensile_strength)$/.test(code)?'MPa':/mech_(?:elongation|reduction_area)$/.test(code)?'%':code==='mech_yt_ratio'?'ratio':code==='mech_hardness_hrc'?'HRC':code==='mech_hardness_hv'?'HV':code==='mech_hardness_hbw'?'HB':code.startsWith('dim_')?'mm':null;if(raw!==''&&raw!=null&&(number(raw)===null||!unit||domain(number(raw),unit,code,engine)||(target&&convert(raw,unit,target,engine)===null))&&!invalidCodes.has(code)){rows.push(row(`${prefix}-invalid-${code}`,'applicability',code,'Invalid actual result','invalid',String(raw),'Finite physical value in an explicit compatible unit',edition,'Correct the raw value, physical domain or unit.'));invalidCodes.add(code);}}
    if(input.ys!==null&&input.uts!==null&&input.ys>input.uts)rows.push(row(`${prefix}-strength-consistency`,'mechanical','','Yield and tensile result consistency','invalid',`${input.ys} / ${input.uts} MPa`,'Yield strength must not exceed tensile strength',edition,'Check entered strength values, units and specimen records.'));
    const compare=(code,label,value,min,max,unit,basis,detail='')=>{if(min==null&&max==null)return;if(family==='G40'&&value!==null){const raw=value,limits=[min,max].filter(v=>v!==null),places=Math.max(...limits.map(v=>(String(v).split('.')[1]||'').length),code.startsWith('chem_')?2:0);value=unit==='MPa'?roundEven(value,5):unit==='J'?roundEven(value):roundEven(value,Math.pow(10,-places));if(value!==raw)detail+=` Raw result ${raw}; source conformance value ${value}.`;}const status=value===null?'missing':(min!==null&&value<min-1e-9)||(max!==null&&value>max+1e-9)?'fail':'pass';rows.push(row(`${prefix}-numeric-${code}`,code.startsWith('chem_')?'chemistry':'mechanical',code,label,invalidCodes.has(code)?'invalid':status,value===null?'Missing':`${value} ${unit}`,[min!==null?`≥ ${min} ${unit}`:'',max!==null?`≤ ${max} ${unit}`:''].filter(Boolean).join('; '),basis,detail));};
    const requirements=requirementsFor(identity,assessment,context);
    for(const req of requirements)if(req.requiredReport&&get(req.code,req.unit)===null)addMissing(`Reported ${req.label} heat analysis`,req.basis);
    const actualHRC=get('mech_hardness_hrc','HRC'),actualHV=get('mech_hardness_hv','HV'),alternativeHV=number(tests.hardnessHV10)??actualHV;
    for(const req of requirements){if(req.code==='mech_hardness_hrc'&&actualHRC===null&&(alternativeHV!==null||number(tests.hardnessHRC)!==null))continue;if(req.formulaInput||req.code==='chem_cecsa'||req.code==='chem_ceiiw'||req.code==='mech_yt_ratio')continue;let value=req.code.startsWith('chem_')?get(req.code,req.unit):get(req.code,req.unit);let detail='';if(value!==null&&['mech_yield_strength','mech_tensile_strength'].includes(req.code)){if(family==='Z245'){value=Math.round(value);detail='Compared after rounding the MPa result to the nearest whole MPa.';}else if(family==='G40'){value=roundEven(value,5);detail='G40.20 Clause 6.6: result rounded to nearest 5 MPa using the ASTM E29 half-even rule.';}}else if(value!==null&&family==='G40'&&req.code.startsWith('chem_')){const places=Math.max(...[req.min,req.max].filter(v=>v!==null).map(precision));value=roundEven(value,Math.pow(10,-places));detail='G40.20 Clause 6.6: chemistry rounded to the limiting precision, at least two decimal places.';}compare(req.code,req.label,value,req.min,req.max,req.unit,req.basis,detail);}
    for(const rule of assessment.grade.footnoteRules||[])if(rule.type==='COMBINED_MAX'){const values=rule.elements.map(symbol=>chemistry[symbol]);compare(`chem_sum_${rule.elements.join('_')}`,rule.elements.join(' + '),values.some(v=>v===null)?null:values.reduce((a,b)=>a+b,0),null,rule.limit,'%',rule.clauseRef);}
    const ceReq=requirements.find(r=>r.code==='chem_cecsa'||r.code==='chem_ceiiw');
    if(ceReq){const needed=family==='Z245'?Z245_AUDIT.ceSymbols:['C','Mn','Cr','Mo','V','Ni','Cu'];let value=null;if(needed.every(k=>chemistry[k]!==null))value=family==='Z245'?computeAuditedZ245CE(chemistry).value:chemistry.C+chemistry.Mn/6+(chemistry.Cr+chemistry.Mo+chemistry.V)/5+(chemistry.Ni+chemistry.Cu)/15;compare(ceReq.code,ceReq.label,value,null,ceReq.max,'%',ceReq.basis,`Calculated from ${needed.join(', ')}; a reported CE cannot substitute for missing formula elements.`);}
    const yt=requirements.find(r=>r.code==='mech_yt_ratio');if(yt){const ys=input.ys===null?null:family==='Z245'?Math.round(input.ys):input.ys,uts=input.uts===null?null:family==='Z245'?Math.round(input.uts):input.uts;compare(yt.code,yt.label,ys!==null&&uts!==null&&uts>0?ys/uts:null,null,yt.max,'ratio',yt.basis,'Derived from the source-basis tensile results.');}
    const testNumber=(raw,label,unit,code=label)=>{if(raw===''||raw==null)return null;const value=number(raw),problem=domain(value,unit,code,engine);if(problem){rows.push(row(`${prefix}-test-invalid-${hash(label)}`,'charpy','',label,'invalid',raw,'Valid test evidence',edition,problem));return null;}return value;};
    const energies=Array.isArray(tests.cvnEnergies)?tests.cvnEnergies.map((v,i)=>{if(v===''||v==null)return null;const n=convert(v,tests.cvnUnit||'', 'J',engine);if(n===null){rows.push(row(`${prefix}-cvn-unit-${i+1}`,'charpy','',`CVN energy ${i+1}`,'invalid',`${v} ${tests.cvnUnit||''}`,'Finite energy in an explicit supported unit',edition,'The energy value or unit cannot be converted to joules.'));return null;}return testNumber(n,`CVN energy ${i+1}`,'J');}):[];
    const cvnShears=Array.isArray(tests.cvnShears)?tests.cvnShears.map((v,i)=>testNumber(v,`CVN shear ${i+1}`,'%')):[];
    const dwttShears=Array.isArray(tests.dwttShears)?tests.dwttShears.map((v,i)=>testNumber(v,`DWTT shear ${i+1}`,'%')):[];
    if(family==='Z245'){
      const hardness=activeMechanical(assessment,context)?.hardness.max;
      const hrc=tests.hardnessHRC!==undefined?testNumber(tests.hardnessHRC,'Macrohardness HRC','HRC'):null,hv10=tests.hardnessHV10!==undefined?testNumber(tests.hardnessHV10,'Macrohardness HV10','HV10'):null;
      if(hrc!==null&&hardness?.value!==null)compare('mech_hardness_hrc_test','Macrohardness (HRC)',hrc,null,hardness.value,'HRC',hardness.clauseRef);
      const hvMax=number(hardness?.displayNote.match(/(?:equivalent:\s*)?(\d+(?:\.\d+)?)\s*(?:HV10|\.)/)?.[1]);
      if(actualHV!==null&&hvMax!==null)compare('mech_hardness_hv','Macrohardness (HV10)',actualHV,null,hvMax,'HV',hardness.clauseRef,'The source requires the HV10 test load; confirm scale, locations and production testing in the documented source checks.');
      if(hv10!==null&&hvMax!==null)compare('mech_hardness_hv10','Macrohardness (HV10)',hv10,null,hvMax,'HV10',hardness.clauseRef);
      const sour=context.serviceCondition==='SOUR'||(context.annexSelections||[]).some(v=>String(v).toUpperCase().includes('SOUR'));
      if(sour){const micro=testNumber(tests.microhardnessHV05,'Sour-service microhardness','HV0.5'),maximum=number(hardness?.displayNote.match(/(\d+(?:\.\d+)?)\s*HV0\.5/)?.[1]);if(maximum!==null)compare('mech_microhardness_hv05','Sour-service microhardness (HV0.5)',micro,null,maximum,'HV0.5','CSA Z245.1:26, Clause 16.5');}
    }
    const cvnTemperature=testNumber(tests.testTemperatureC,'Actual CVN temperature','°C'),dwttTemperature=testNumber(tests.dwttTemperatureC,'Actual DWTT temperature','°C');
    if(family==='Z245'){
      let heatCount=testNumber(tests.orderHeatCount,'Order item heat count','dimensionless');if(heatCount!==null&&(!Number.isInteger(heatCount)||heatCount<=0)){rows.push(row(`${prefix}-invalid-order-heats`,'charpy','','Order item heat count','invalid',heatCount,'Positive whole number of heats',edition,'The order-item population must be a positive integer.'));heatCount=null;}const orderShear=testNumber(tests.orderAverageShear,'Order average shear','%');
      const sourceInput={...input,cvn1:energies[0],cvn2:energies[1],cvn3:energies[2],cvnTemp:cvnTemperature,cvnSize:tests.cvnSize,shear1:cvnShears[0],shear2:cvnShears[1],shear3:cvnShears[2],dwtt1:dwttShears[0],dwtt2:dwttShears[1],dwttTemp:dwttTemperature,orderHeatCount:heatCount,orderAverageShear:orderShear};
      assessment=evaluateAuditedZ245(sourceInput,context,registry.Z245.grades[identity.gradeKey]);
      if(assessment.grade.charpy.required&&energies.length!==3)addMissing('Exactly three individual CVN energies');
      if(assessment.grade.charpy.shearArea.min.value!==null&&cvnShears.length!==3)addMissing('Exactly three individual CVN shear areas');
      if(assessment.grade.dwtt&&dwttShears.length!==2)addMissing('Exactly two individual DWTT shear areas');
      for(const check of assessment.additionalChecks||[])rows.push(row(`${prefix}-check-${hash(check.name)}`,check.category==='Applicability'?'applicability':'charpy','',check.name,check.status.toLowerCase(),check.value??'—',check.limit?`${check.limit.bound==='MAX'?'≤':'≥'} ${check.limit.value} ${unitAlias(check.limit.unit)}`:'Source acceptance condition',check.clauseRef,check.detail));
      const hydro=computeAuditedZ245Hydro(context,Number(identity.gradeLabel.match(/Grade\s+(\d+)/)?.[1]));
      const pressure=testNumber(tests.hydroPressureMPa,'Actual hydro pressure','MPa'),hold=testNumber(tests.hydroHoldSeconds,'Actual hydro hold','s');
      if(hydro.minimumPressureMPa!==null){rows.push(row(`${prefix}-hydro-pressure`,'process','', 'Hydrostatic pressure',pressure===null?'missing':pressure>=hydro.minimumPressureMPa?'pass':'fail',pressure===null?'Missing':`${pressure} MPa`,`≥ ${hydro.minimumPressureMPa} MPa`,hydro.clauseRef,hydro.scope));rows.push(row(`${prefix}-hydro-hold`,'process','','Hydrostatic hold duration',hold===null?'missing':hold>=hydro.holdSeconds?'pass':'fail',hold===null?'Missing':`${hold} s`,`≥ ${hydro.holdSeconds} s`,hydro.clauseRef,'Verify every-length execution without leakage and required recording/interlock evidence.'));}
    }else if(family==='G40'&&assessment.grade.charpy.required){
      const sizeAlias={'3/4 size':'10x7.5','2/3 size':'10x6.7','1/2 size':'10x5','1/3 size':'10x3.3','1/4 size':'10x2.5'},size=sizeAlias[tests.cvnSize]||tests.cvnSize;const charpy=assessment.grade.charpy,avg=charpy.energyFullSize.average.min.value,full=size==='10x10';const sub=charpy.subSizeFactors.find(x=>x.specimen===size);
      if(!full&&!sub)addMissing('Tabulated G40 CVN specimen size');
      if(energies.length!==3||energies.some(x=>x===null))addMissing('Exactly three individual G40 CVN energies');
      const factor=full?1:sub?.factor;
      if(avg!==null&&factor!=null&&energies.length===3&&energies.every(x=>x!==null)){
        const minimum=Math.round(avg*factor*1e9)/1e9,rawMean=energies.reduce((a,b)=>a+b,0)/3,mean=roundEven(rawMean),lowest=roundEven(Math.min(...energies));
        rows.push(row(`${prefix}-cvn-average`,'charpy','','CVN average absorbed energy',mean>=minimum?'pass':'fail',`${mean} J`,`≥ ${minimum} J`,charpy.energyFullSize.average.min.clauseRef,`Raw mean ${rawMean} J; rounded to the nearest joule under G40.20 Clause 6.6 / ASTM E29. Exact tabulated subsize acceptance.`));
        rows.push(row(`${prefix}-cvn-individual`,'charpy','','CVN minimum individual energy',lowest>=minimum*2/3?'pass':'fail',`${lowest} J`,`≥ ${minimum*2/3} J`,charpy.energyFullSize.single.min.clauseRef,'Every specimen must meet the individual floor; this standard has no below-average specimen-count limit.'));
      }
      if(charpy.testTemp.value!==null)rows.push(row(`${prefix}-cvn-temperature`,'charpy','','CVN test temperature',cvnTemperature===null?'missing':cvnTemperature<=charpy.testTemp.value?'pass':'fail',cvnTemperature===null?'Missing':`${cvnTemperature} °C`,`≤ ${charpy.testTemp.value} °C`,charpy.testTemp.clauseRef,'Testing at the ordered source temperature or colder is acceptable when energy acceptance is met.'));
    }
    for(const label of [...new Set(assessment.missingContext||[])])addMissing(typeof label==='string'?label:JSON.stringify(label));
    const documentaryChecks=checksFor(identity,assessment);for(const check of documentaryChecks)rows.push(documented(check,evidence));
    return {supported:true,family,edition,sourceHash,rows,context,identity,requirements,documentaryChecks,catalog:clone(registry[family].catalog),contextNotes:assessment.contextNotes||[],attachedStandard:{family,edition,sourceHash,gradeKey:identity.gradeKey}};
  }
  function computeCSAEquivalent(chemistry){const clean=Object.fromEntries(Z245_AUDIT.ceSymbols.map(k=>{const v=number(chemistry?.[k]);return [k,v!==null&&v>=0&&v<=100?v:null];})),r=computeAuditedZ245CE(clean);return {...r,ready:r.value!==null,formula:Z245_AUDIT.ceFormula,unit:'%'};}
  return {version:VERSION,identify,evaluate,inspect,describe:scope=>inspect({scope}),catalogue,computeCSAEquivalent};
})();
