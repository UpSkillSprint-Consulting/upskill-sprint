(function(){
'use strict';

var tool=document.getElementById('spx-tool');
if(!tool||!window.__SPX||window.__SPX.governance)return;

var REGISTRY_VERSION='1.0.0';
var SCHEMA_VERSION='1.0';
var CLASSIFICATIONS=['Teaching','Engineering screening','Plant calibrated','Specification acceptance'];
var VALIDITY_STATES=['In range','Near boundary','Out of domain','Not evaluated'];
var APPROVAL_STATES=['pending-qualified-review','approved','retired'];
var INTENDED_USES=['early-screening','compare-alternatives','investigation-support','acceptance-decision'];
/* Deliberately conservative internal envelopes for this release. They are not
   published alloy-system limits and therefore remain part of the unverified
   evidence record. Values outside them fail closed instead of being described
   as merely "inside the controls". */
var SCREENING_CHEMISTRY_MAX={Mn:2,Si:.6,Cr:1.5,Ni:1,Mo:.6,V:.15,Nb:.1,Ti:.05,B:.003,Cu:.6};
var EQUILIBRIUM_CHEMISTRY_MAX={Mn:1.2,Si:.6,Cr:.3,Ni:.3,Mo:.1,V:.05,Nb:.05,Ti:.05,B:.001,Cu:.5};
var SCREENING_COMBINED_MAX={ce:1,pcm:.6};

var MODEL_REGISTRY={
  'spx-equilibrium-v1':{
    id:'spx-equilibrium-v1',version:'1.0.0',title:'Simplified Fe–Fe₃C equilibrium model',
    classification:'Teaching',owner:'UpSkill Sprint Consulting',
    outputs:['phase-field','lever-rule-fractions'],
    dependencies:[],applicability:{scope:'Teaching and preliminary equilibrium screening for plain-carbon steel.',inputDomain:['0–1.2 wt% C','25–1250 °C','Shared chemistry inside the declared residual-alloy envelope'],exclusions:['Alloy-shifted boundaries','Transformation kinetics','Stable graphite equilibrium']},
    evidence:{level:'internal-implementation-tests',label:'Internal implementation tests',verified:false,validation:'Boundary, invariant, and lever-rule implementation behaviour are covered by automated regression tests; no qualified metallurgical validation record is attached.'},
    approval:{status:'pending-qualified-review',qualifiedMetallurgist:null,approvedAt:null,scope:null},
    sources:[
      {reference:'Simplified Fe–Fe₃C boundaries and lever-rule implementation in Steel Phase Explorer core',clauseRef:'Internal model record: steel-phase-explorer-core.js',verified:false},
      {reference:'Buehler / ASM International iron–carbon diagram is licensed reference artwork only',clauseRef:'Steel Phase Explorer How to Use — Sources and attribution',verified:false}
    ],
    assumptions:['Metastable Fe–Fe₃C equilibrium','Uniform bulk carbon','Sufficient time for equilibrium','Alloy shifts and kinetic products are excluded'],
    uncertainty:'Boundary geometry is simplified and not a thermodynamic database calculation.',
    requiredVerification:['Use validated thermodynamic software or an approved phase-diagram source for engineering decisions.']
  },
  'spx-chemistry-v1':{
    id:'spx-chemistry-v1',version:'1.0.0',title:'Chemistry and critical-temperature equations',
    classification:'Teaching',owner:'UpSkill Sprint Consulting',
    outputs:['ce-iiw','pcm','ac1','ac3','ms'],
    dependencies:[],applicability:{scope:'Preliminary chemistry and empirical critical-temperature screening.',inputDomain:['0.02–1.2 wt% C','Declared elemental and combined-alloy screening envelopes (not published applicability ranges)','Internal guardrails: CE IIW ≤ 1.0 and Pcm ≤ 0.6','Physically ordered Ac₁, Ac₃, and Mₛ results'],exclusions:['Grade conformance','Heat-treatment qualification','Specification acceptance']},
    evidence:{level:'equation-implementation-tests',label:'Equation implementation tests',verified:false,validation:'Equation implementation and invalid-sequence handling are regression tested; the source locators and applicability ranges have not been independently qualified for every chemistry shown.'},
    approval:{status:'pending-qualified-review',qualifiedMetallurgist:null,approvedAt:null,scope:null},
    sources:[
      {reference:'CE IIW and Pcm composition equations',clauseRef:'Steel Phase Explorer Chemistry & properties model note',verified:false},
      {reference:'Andrews empirical Ac₁, Ac₃, and Mₛ correlations; unavailable As and W terms are set to zero',clauseRef:'Steel Phase Explorer How to Use — Chemistry & properties',verified:false}
    ],
    assumptions:['Entered chemistry represents the material being screened','Missing As and W terms are zero','Empirical critical-temperature ordering must remain physically consistent'],
    uncertainty:'Heat-to-heat variation, segregation, analytical error, heating history, and published correlation error are not quantified.',
    requiredVerification:['Confirm measured chemistry and use grade/process-specific critical-temperature data.']
  },
  'spx-property-v1':{
    id:'spx-property-v1',version:'1.0.0',title:'Directional chemistry/rate property screen',
    classification:'Teaching',owner:'UpSkill Sprint Consulting',
    outputs:['estimated-hardness','estimated-martensite','estimated-uts','estimated-ys','estimated-elongation'],
    dependencies:['spx-chemistry-v1'],applicability:{scope:'Directional chemistry and cooling-rate response only.',inputDomain:['Chemistry gate passed','0.1–1000 °C/s effective cooling rate'],exclusions:['Statistical prediction','Tempering response','Plant-calibrated mechanical properties']},
    evidence:{level:'internal-heuristic-tests',label:'Internal heuristic tests',verified:false,validation:'Determinism, bounds, and fail-closed chemistry handling are tested. No plant calibration or predictive-error study is attached.'},
    approval:{status:'pending-qualified-review',qualifiedMetallurgist:null,approvedAt:null,scope:null},
    sources:[
      {reference:'Original directional chemistry and cooling-rate heuristic',clauseRef:'Internal model record: propertyEstimate / propertyEstimateFor',verified:false}
    ],
    assumptions:['One effective cooling-rate input','Uniform chemistry','No explicit section, prior-austenite, tempering, or transformation-history calibration'],
    uncertainty:'Displayed ranges are teaching envelopes, not confidence or prediction intervals.',
    requiredVerification:['Confirm hardness, tensile response, and microstructure using qualified tests on representative material.']
  },
  'spx-kinetics-v1':{
    id:'spx-kinetics-v1',version:'1.0.0',title:'Generalized TTT/CCT transformation screen',
    classification:'Teaching',owner:'UpSkill Sprint Consulting',
    outputs:['ttt-cct-fractions'],
    dependencies:['spx-chemistry-v1'],applicability:{scope:'Generalized transformation-behaviour teaching and early screening.',inputDomain:['Chemistry gate passed','Valid TTT hold or CCT cooling path','Configured temperature and time limits'],exclusions:['Certified grade-specific TTT/CCT data','Transformation acceptance criteria']},
    evidence:{level:'relationship-implementation-tests',label:'Relationship implementation tests',verified:false,validation:'Input quarantine and fraction bounds are regression tested; the relationship locator is unverified and curves are not certified grade-specific transformation data.'},
    approval:{status:'pending-qualified-review',qualifiedMetallurgist:null,approvedAt:null,scope:null},
    sources:[
      {reference:'Koistinen–Marburger martensite relationship with α = 0.011 °C⁻¹',clauseRef:'Steel Phase Explorer How to Use — TTT and CCT',verified:false},
      {reference:'Generalized transformation-curve construction',clauseRef:'Internal model record: steel-phase-explorer-analysis.js',verified:false}
    ],
    assumptions:['Generalized curve topology','Uniform austenite condition','Idealized isothermal hold or continuous-cooling input'],
    uncertainty:'Curve position, prior austenite, segregation, and real section cooling history are not calibrated to a grade.',
    requiredVerification:['Use measured or validated grade-specific TTT/CCT data and representative thermal histories.']
  },
  'spx-hardenability-v1':{
    id:'spx-hardenability-v1',version:'1.0.0',title:'Equivalent-Jominy and section hardenability screen',
    classification:'Teaching',owner:'UpSkill Sprint Consulting',
    outputs:['equivalent-jominy','section-hardness','section-martensite'],
    dependencies:['spx-chemistry-v1'],applicability:{scope:'Directional through-section hardenability screening.',inputDomain:['Chemistry gate passed','2–500 mm section','ASTM grain number 1–14','120–900 HV target'],exclusions:['ASTM A255 calculation','Achieved quench response','Product acceptance']},
    evidence:{level:'internal-heuristic-tests',label:'Internal heuristic tests',verified:false,validation:'Input limits, eligibility gates, and through-section trends are regression tested; this is not an ASTM A255 calculation.'},
    approval:{status:'pending-qualified-review',qualifiedMetallurgist:null,approvedAt:null,scope:null},
    sources:[
      {reference:'Original chemistry-calibrated equivalent-Jominy teaching model',clauseRef:'Steel Phase Explorer How to Use — Jominy and section-size hardenability',verified:false}
    ],
    assumptions:['Idealized geometry and quench severity','Uniform chemistry and prior-austenite grain size','Equivalent Jominy distance is a directional analogue'],
    uncertainty:'Quenchant condition, section geometry, segregation, grain size, and measured Jominy variability are not propagated.',
    requiredVerification:['Confirm with ASTM A255 data where applicable and measured through-section hardness/microstructure.']
  },
  'spx-austenitization-v1':{
    id:'spx-austenitization-v1',version:'1.0.0',title:'Austenitization and grain-growth window',
    classification:'Teaching',owner:'UpSkill Sprint Consulting',
    outputs:['heat-through','dissolution','homogenization','grain-growth'],
    dependencies:['spx-chemistry-v1'],applicability:{scope:'Directional austenitization-window screening.',inputDomain:['Chemistry gate passed','25–1300 °C','1–720 min','2–500 mm section','1–500 °C/min heating rate'],exclusions:['Qualified furnace recipe','Grade-specific kinetic calibration']},
    evidence:{level:'internal-heuristic-tests',label:'Internal heuristic tests',verified:false,validation:'Input validity, dependent-output quarantine, and directional trends are tested; no grade-specific kinetic calibration is attached.'},
    approval:{status:'pending-qualified-review',qualifiedMetallurgist:null,approvedAt:null,scope:null},
    sources:[
      {reference:'Original heat-through, dissolution, homogenization, and grain-growth teaching model',clauseRef:'Internal model record: steel-phase-explorer-release2.js',verified:false}
    ],
    assumptions:['Simplified section heat-through','Normalized carbide burden and boundary pinning','Uniform furnace and starting condition'],
    uncertainty:'Carbide populations, segregation, furnace uniformity, and grade-specific dissolution/grain-growth kinetics are not quantified.',
    requiredVerification:['Verify with calibrated thermocouples, metallography, hardness response, and grade-specific heat-treatment trials.']
  },
  'spx-quench-v1':{
    id:'spx-quench-v1',version:'1.0.0',title:'Quench response and risk-index screen',
    classification:'Teaching',owner:'UpSkill Sprint Consulting',
    outputs:['quench-cooling-rate','quench-martensite','quench-hardness','cracking-index','distortion-index'],
    dependencies:['spx-chemistry-v1','spx-austenitization-v1'],applicability:{scope:'Directional quench response and risk-index screening.',inputDomain:['Chemistry and austenitization gates passed','2–500 mm section','0–300 s transfer delay','Selected medium bath-temperature window'],exclusions:['Measured quenchant performance','Risk probability','Qualified quench procedure']},
    evidence:{level:'internal-heuristic-tests',label:'Internal heuristic tests',verified:false,validation:'Medium windows, invalid-path quarantine, and monotonic safeguards are tested; no quenchant calibration is attached.'},
    approval:{status:'pending-qualified-review',qualifiedMetallurgist:null,approvedAt:null,scope:null},
    sources:[
      {reference:'Original lumped-response quench teaching model',clauseRef:'Internal model record: steel-phase-explorer-release2.js',verified:false}
    ],
    assumptions:['Normalized medium severity','Simplified surface-to-centre cooling','Current austenitization model limits available austenite'],
    uncertainty:'Boiling regime, load density, transfer cooling, part orientation, bath condition, and agitation uniformity are simplified.',
    requiredVerification:['Use measured cooling curves, qualified procedures, hardness traverses, metallography, and distortion/crack inspection.']
  },
  'spx-process-record-v1':{
    id:'spx-process-record-v1',version:'1.0.0',title:'Thermal-record derived metrics',
    classification:'Teaching',owner:'UpSkill Sprint Consulting',
    outputs:['record-cooling-rate-800-500','record-cooling-rate-500-300','candidate-arrests'],
    dependencies:[],applicability:{scope:'Deterministic screening of a user-supplied thermal record.',inputDomain:['At least three valid time/temperature rows','Valid mapping, units, and numeric controls'],exclusions:['Sensor calibration','Record authenticity','Automatic transformation identification']},
    evidence:{level:'deterministic-analysis-tests',label:'Deterministic analysis tests',verified:false,validation:'Parsing limits, smoothing, crossing-rate calculations, trace fingerprints, and candidate-event behaviour are regression tested; sensor traceability is user supplied.'},
    approval:{status:'pending-qualified-review',qualifiedMetallurgist:null,approvedAt:null,scope:null},
    sources:[
      {reference:'Deterministic thermal-record parser and derived-metric implementation',clauseRef:'Internal model record: steel-phase-explorer-release3.js',verified:false}
    ],
    assumptions:['Mapped columns and units are correct','Time order and sensor values represent the intended location','Smoothing settings are appropriate for the signal'],
    uncertainty:'Calibration, response lag, location bias, sampling, emissivity, and representativeness are not automatically established.',
    requiredVerification:['Preserve the raw record and confirm calibration, sensor location, sampling, units, and process context.']
  },
  'spx-metallurgy-lab-v1':{
    id:'spx-metallurgy-lab-v1',version:'1.0.0',title:'Metallurgy laboratory directional models',
    classification:'Teaching',owner:'UpSkill Sprint Consulting',
    outputs:['schematic-microstructure','directional-mechanical-response','diffusion-tempering-solidification-trends'],
    dependencies:[],applicability:{scope:'Directional teaching models and schematic visualization.',inputDomain:['Configured metallurgy-lab control ranges'],exclusions:['Image classification','Quantitative microstructure acceptance','Material certification']},
    evidence:{level:'teaching-content-tests',label:'Teaching content + internal tests',verified:false,validation:'Controls, bounded outputs, and declared limitations are tested; imagery is schematic and not a classifier.'},
    approval:{status:'pending-qualified-review',qualifiedMetallurgist:null,approvedAt:null,scope:null},
    sources:[
      {reference:'Original directional teaching models and schematic fields',clauseRef:'Internal model record: steel-phase-explorer-release4.js',verified:false}
    ],
    assumptions:['Idealized microstructure family and uniform condition','Directional rather than material-specific response'],
    uncertainty:'Preparation, orientation, etchant, imaging, inclusions, segregation, and test-method variation are not inferred.',
    requiredVerification:['Use prepared specimens, calibrated microscopy, qualified reference images, and applicable mechanical tests.']
  }
};

var QUESTION_MODELS={
  chemistry:['spx-chemistry-v1','spx-property-v1'],
  phases:['spx-equilibrium-v1'],
  transformations:['spx-kinetics-v1'],
  'heat-treatment':['spx-austenitization-v1','spx-quench-v1'],
  hardenability:['spx-hardenability-v1'],
  'plant-data':['spx-process-record-v1'],
  microstructure:['spx-metallurgy-lab-v1'],
  other:[]
};

var OUTPUT_DEFINITIONS=[
  {id:'phase-field',label:'Equilibrium phase field',summaryKey:'phase',unit:'',modelId:'spx-equilibrium-v1'},
  {id:'lever-rule-fractions',label:'Equilibrium phase fractions',summaryKey:'phaseFractions',unit:'',modelId:'spx-equilibrium-v1'},
  {id:'ce-iiw',label:'CE IIW',summaryKey:'ceIiw',unit:'',modelId:'spx-chemistry-v1'},
  {id:'pcm',label:'Pcm',summaryKey:'pcm',unit:'',modelId:'spx-chemistry-v1'},
  {id:'ac1',label:'Ac₁ estimate',summaryKey:'ac1C',unit:'°C',modelId:'spx-chemistry-v1'},
  {id:'ac3',label:'Ac₃ estimate',summaryKey:'ac3C',unit:'°C',modelId:'spx-chemistry-v1'},
  {id:'ms',label:'Mₛ estimate',summaryKey:'msC',unit:'°C',modelId:'spx-chemistry-v1'},
  {id:'estimated-hardness',label:'Estimated hardness',summaryKey:'estimatedHV',unit:'HV',modelId:'spx-property-v1'},
  {id:'estimated-martensite',label:'Estimated martensite',summaryKey:'martensitePct',unit:'%',modelId:'spx-property-v1'},
  {id:'estimated-uts',label:'Estimated tensile strength',summaryKey:'estimatedUTS',unit:'MPa',modelId:'spx-property-v1'},
  {id:'estimated-ys',label:'Estimated yield strength',summaryKey:'estimatedYS',unit:'MPa',modelId:'spx-property-v1'},
  {id:'estimated-elongation',label:'Estimated elongation',summaryKey:'estimatedElongation',unit:'%',modelId:'spx-property-v1'},
  {id:'ttt-cct-fractions',label:'TTT / CCT final fractions',summaryKey:'kineticsFractions',unit:'',modelId:'spx-kinetics-v1'},
  {id:'equivalent-jominy',label:'Equivalent Jominy characteristic length',summaryKey:'hardEquivalentJominy',unit:'mm',modelId:'spx-hardenability-v1'},
  {id:'section-hardness',label:'Section centre hardness',summaryKey:'hardCenterHV',unit:'HV',modelId:'spx-hardenability-v1'},
  {id:'section-martensite',label:'Section centre martensite',summaryKey:'hardCenterMartensite',unit:'%',modelId:'spx-hardenability-v1'},
  {id:'heat-through',label:'Core heat-through',summaryKey:'austHeatThroughPct',unit:'%',modelId:'spx-austenitization-v1'},
  {id:'dissolution',label:'Carbide dissolution',summaryKey:'austDissolutionPct',unit:'%',modelId:'spx-austenitization-v1'},
  {id:'homogenization',label:'Homogenization',summaryKey:'austHomogenizationPct',unit:'%',modelId:'spx-austenitization-v1'},
  {id:'grain-growth',label:'Estimated final ASTM grain number',summaryKey:'austFinalGrain',unit:'',modelId:'spx-austenitization-v1'},
  {id:'quench-cooling-rate',label:'Quench centre 800→500 rate',summaryKey:'quenchCenterRate',unit:'°C/s',modelId:'spx-quench-v1'},
  {id:'quench-martensite',label:'Quench centre martensite',summaryKey:'quenchCenterMartensite',unit:'%',modelId:'spx-quench-v1'},
  {id:'quench-hardness',label:'Quench centre hardness',summaryKey:'quenchCenterHV',unit:'HV',modelId:'spx-quench-v1'},
  {id:'cracking-index',label:'Quench cracking index',summaryKey:'quenchCrackingIndex',unit:'/100',modelId:'spx-quench-v1'},
  {id:'distortion-index',label:'Quench distortion index',summaryKey:'quenchDistortionIndex',unit:'/100',modelId:'spx-quench-v1'},
  {id:'record-cooling-rate-800-500',label:'Thermal-record 800→500 rate',summaryKey:'processRate800500',unit:'°C/s',modelId:'spx-process-record-v1'},
  {id:'record-cooling-rate-500-300',label:'Thermal-record 500→300 rate',summaryKey:'processRate500300',unit:'°C/s',modelId:'spx-process-record-v1'},
  {id:'candidate-arrests',label:'Candidate thermal events',summaryKey:'processEvents',unit:'',modelId:'spx-process-record-v1'},
  {id:'schematic-microstructure',label:'Schematic microstructure',summaryKey:'schematicMicrostructure',unit:'',modelId:'spx-metallurgy-lab-v1'},
  {id:'directional-mechanical-response',label:'Directional mechanical response',summaryKey:'directionalMechanicalResponse',unit:'',modelId:'spx-metallurgy-lab-v1'},
  {id:'diffusion-tempering-solidification-trends',label:'Diffusion, tempering, and solidification trends',summaryKey:'labDirectionalTrends',unit:'',modelId:'spx-metallurgy-lab-v1'}
];

function own(o,k){return Object.prototype.hasOwnProperty.call(o,k)}
function clone(v){return JSON.parse(JSON.stringify(v))}
function unique(values){return values.filter(function(v,i,a){return a.indexOf(v)===i})}
function finite(v){return Number.isFinite(Number(v))}
function invalidIn(selector){return Array.prototype.some.call(document.querySelectorAll(selector+' [aria-invalid="true"]'),function(el){return el.getAttribute('aria-invalid')==='true'})}
function controlNumber(id){var el=document.getElementById(id);if(!el||String(el.value).trim()===''||!finite(el.value))return null;return Number(el.value)}
function propertyRate(){var el=document.getElementById('spx-property-rate'),v=el?Number(el.value):NaN,rate=isFinite(v)?Math.pow(10,v/40-1):NaN;return isFinite(rate)?rate:null}
function activePoint(){try{var scenario=window.serializable(),points=Array.isArray(scenario.points)?scenario.points:[],id=Number(scenario.activeId);return points.find(function(p){return Number(p.id)===id})||points[0]||null}catch(e){return null}}
function severity(stateName){return{'Out of domain':3,'Not evaluated':2,'Near boundary':1,'In range':0}[stateName]}
function worst(states){if(!states.length)return'Not evaluated';return states.slice().sort(function(a,b){return severity(b)-severity(a)})[0]}
function validity(stateName,reasons){return{state:VALIDITY_STATES.indexOf(stateName)>=0?stateName:'Not evaluated',reasons:unique((reasons||[]).filter(Boolean))}}
function nearRange(value,min,max,band,label){
  if(value==null||!finite(value))return validity('Not evaluated',[label+' is unavailable.']);
  value=Number(value);
  if(value<min||value>max)return validity('Out of domain',[label+' is outside '+min+'–'+max+'.']);
  if(value-min<=band||max-value<=band)return validity('Near boundary',[label+' is within the governance margin of the '+min+'–'+max+' domain boundary.']);
  return validity('In range',[])
}
function combineValidity(items,extraReasons){
  var stateName=worst(items.map(function(x){return x.state})),reasons=[];
  items.forEach(function(x){reasons=reasons.concat(x.reasons||[])});
  return validity(stateName,reasons.concat(extraReasons||[]))
}
function chemistryEnvelope(limits,label,chemistry){
  chemistry=chemistry||typeof state!=='undefined'&&state.chem;
  if(!chemistry)return validity('Not evaluated',['Chemistry state is unavailable.']);
  var reasons=[],near=false;
  Object.keys(limits).forEach(function(key){
    var value=Number(chemistry[key]),maximum=limits[key];
    if(!isFinite(value)||value<0||value>maximum)reasons.push(key+' is outside the declared '+label+' envelope of 0–'+maximum+' wt%.');
    else if(maximum>0&&maximum-value<=maximum*.05){near=true;reasons.push(key+' is within 5% of the declared '+label+' upper boundary ('+maximum+' wt%).')}
  });
  return reasons.some(function(reason){return reason.indexOf('outside')>=0})?validity('Out of domain',reasons):near?validity('Near boundary',reasons):validity('In range',[])
}
function chemistryValidity(context){
  context=context&&typeof context==='object'?context:{};var chemistry=context.chemistry||typeof state!=='undefined'&&state.chem;
  if(!chemistry)return validity('Not evaluated',['Chemistry state is unavailable.']);
  if(!context.chemistry&&invalidIn('#spx-tab-chemistry'))return validity('Out of domain',['A visible chemistry input is invalid.']);
  var values=Object.keys(chemistry).map(function(k){return chemistry[k]});
  if(values.some(function(v){return!finite(v)}))return validity('Out of domain',['One or more chemistry values are non-numeric.']);
  var metrics;
  try{
    metrics=context.chemistry?{ce:chemistry.C+chemistry.Mn/6+(chemistry.Cr+chemistry.Mo+chemistry.V)/5+(chemistry.Ni+chemistry.Cu)/15,pcm:chemistry.C+chemistry.Si/30+(chemistry.Mn+chemistry.Cu+chemistry.Cr)/20+chemistry.Ni/60+chemistry.Mo/15+chemistry.V/10+5*chemistry.B,ms:539-423*chemistry.C-30.4*chemistry.Mn-17.7*chemistry.Ni-12.1*chemistry.Cr-7.5*chemistry.Mo,ac1:723-10.7*chemistry.Mn-16.9*chemistry.Ni+29.1*chemistry.Si+16.9*chemistry.Cr,ac3:910-203*Math.sqrt(Math.max(0,chemistry.C))-15.2*chemistry.Ni+44.7*chemistry.Si+104*chemistry.V+31.5*chemistry.Mo}:window.__SPX.chemMetrics();var completion=Number(chemistry.C)>.77?(typeof bounds!=='undefined'?bounds.Acm(Number(chemistry.C)):NaN):metrics.ac3,sequenceValid=finite(metrics.ac1)&&finite(completion)&&completion>metrics.ac1;
    if(Number(chemistry.C)<.02||!sequenceValid)return validity('Out of domain',[Number(chemistry.C)<.02?'Carbon is below the 0.02 wt% lower scope of this steel-property and transformation screen.':'The empirical critical-temperature sequence is not physically ordered.']);
  }catch(e){return validity('Not evaluated',['The shared chemistry validity gate is unavailable.'])}
  var result=combineValidity([nearRange(Number(chemistry.C),.02,1.2,.02,'Carbon'),chemistryEnvelope(SCREENING_CHEMISTRY_MAX,'low-alloy screening',chemistry),nearRange(metrics.ce,0,SCREENING_COMBINED_MAX.ce,.05,'CE IIW combined-alloy screen index'),nearRange(metrics.pcm,0,SCREENING_COMBINED_MAX.pcm,.03,'Pcm combined-alloy screen index')]);
  if(result.state!=='Out of domain'&&result.state!=='Not evaluated')result.reasons.push('Inputs are inside conservative internal numeric guardrails; correlation-specific applicability has not been established by verified evidence or qualified review.');
  return result
}
function equilibriumValidity(){
  if(invalidIn('#spx-tab-equilibrium'))return validity('Out of domain',['A visible equilibrium input is invalid.']);
  var point=activePoint();if(!point)return validity('Not evaluated',['No active carbon–temperature point is available.']);
  var combined=combineValidity([nearRange(point.c,0,1.2,.02,'Carbon'),nearRange(point.t,25,1250,15,'Temperature'),chemistryEnvelope(EQUILIBRIUM_CHEMISTRY_MAX,'plain-carbon approximation')]);
  if(combined.state==='Out of domain'||combined.state==='Not evaluated')return combined;
  try{var fractions=window.__SPX.phaseFractions(point.c,point.t);if(fractions&&fractions.region&&fractions.region.key==='eutectoid')return validity('Near boundary',combined.reasons.concat(['The point lies on the exact A₁ invariant; unique phase amounts require reaction extent.']))}catch(e){return validity('Not evaluated',['The equilibrium evaluator is unavailable.'])}
  return combined
}
function propertyValidity(context){
  context=context&&typeof context==='object'?context:{};var chemistry=chemistryValidity(context);if(chemistry.state==='Out of domain'||chemistry.state==='Not evaluated')return chemistry;
  var rate=own(context,'propertyRate')?Number(context.propertyRate):propertyRate(),rateCheck=nearRange(rate,.1,1000,.05,'Cooling rate');
  return combineValidity([chemistry,rateCheck])
}
function kineticsModelValidity(){
  if(invalidIn('#spx-tab-kinetics'))return validity('Out of domain',['A visible kinetics input is invalid.']);
  var chemistry=chemistryValidity();if(chemistry.state==='Out of domain'||chemistry.state==='Not evaluated')return chemistry;
  try{
    if(typeof kineticRawInputs!=='function'||typeof austeniteCompletionReference!=='function'||typeof KINETIC_START_C==='undefined'||typeof bounds==='undefined')return validity('Not evaluated',['The pure kinetics applicability inputs are unavailable.']);
    var inputs=kineticRawInputs(),metrics=window.__SPX.chemMetrics(),completion=austeniteCompletionReference(metrics,state.chem.C),reason='';
    if(!inputs.valid)reason=inputs.reason;
    else if(!completion.valid)reason=completion.detail+'.';
    else if(KINETIC_START_C<completion.temperature+5)reason='The assumed '+KINETIC_START_C+' °C starting state is not above the '+completion.label+' completion reference for this chemistry.';
    else if(state.kinMode==='ttt'&&inputs.holdT>=bounds.A1)reason='This simplified TTT product model is limited to holds below A₁.';
    else if(state.kinMode==='ttt'&&inputs.finalT>inputs.holdT)reason='Final temperature exceeds the isothermal hold temperature.';
    else if(state.kinMode==='cct'&&inputs.finalT>=bounds.A1)reason='This simplified CCT product model does not calculate a path that stops at or above A₁.';
    if(reason)return validity('Out of domain',[reason]);
    var checks=[chemistry];if(finite(inputs.rate))checks.push(nearRange(inputs.rate,.01,1000,.01,'Cooling rate'));if(finite(inputs.finalT))checks.push(nearRange(inputs.finalT,-100,700,10,'Final temperature'));return combineValidity(checks)
  }catch(e){return validity('Not evaluated',['The pure kinetics applicability inputs are unavailable.'])}
}
function hardenabilityValidity(){
  if(invalidIn('#spx-tab-hardenability'))return validity('Out of domain',['A visible hardenability input is invalid.']);
  try{var model=window.__SPX.release2.hardModel();if(!model)return validity('Not evaluated',['The hardenability evaluator is unavailable.']);if(!model.eligible)return validity('Out of domain',[model.eligibility&&model.eligibility.reason?model.eligibility.reason:'The hardenability model is not eligible.']);var hard=state.r2&&state.r2.hard||{};return combineValidity([nearRange(hard.size,2,500,5,'Section size'),nearRange(hard.grain,1,14,.5,'Prior-austenite grain number'),nearRange(hard.targetHV,120,900,10,'Target hardness'),chemistryValidity()])}catch(e){return validity('Not evaluated',['The hardenability evaluator is unavailable.'])}
}
function austenitizationValidity(){
  if(invalidIn('#spx-tab-austenitization'))return validity('Out of domain',['A visible austenitization input is invalid.']);
  try{var model=window.__SPX.release2.austModel();if(!model)return validity('Not evaluated',['The austenitization evaluator is unavailable.']);if(!model.valid)return validity('Out of domain',[model.reason||'The austenitization model is invalid.']);var a=state.r2&&state.r2.aust||{};return combineValidity([nearRange(a.temp,25,1300,20,'Austenitizing temperature'),nearRange(a.hold,1,720,5,'Hold time'),nearRange(a.size,2,500,5,'Section size'),nearRange(a.heatRate,1,500,5,'Heating rate'),chemistryValidity()])}catch(e){return validity('Not evaluated',['The austenitization evaluator is unavailable.'])}
}
function quenchValidity(){
  if(invalidIn('#spx-tab-quenching'))return validity('Out of domain',['A visible quench input is invalid.']);
  try{var model=window.__SPX.release2.quenchModel();if(!model)return validity('Not evaluated',['The quench evaluator is unavailable.']);if(!model.valid||!model.outcomeValid){var reason=model.inputReason||model.austenitizationReason||model.validity&&model.validity.message||'The selected quench does not yield a complete quantitative outcome.';return validity('Out of domain',[reason])}var q=state.r2&&state.r2.quench||{},bath=model.medium&&model.medium.modelBath,checks=[nearRange(q.size,2,500,5,'Section size'),nearRange(q.delay,0,300,3,'Transfer delay'),chemistryValidity()];if(Array.isArray(bath))checks.push(nearRange(q.bath,bath[0],bath[1],Math.max(1,(bath[1]-bath[0])*.05),'Bath temperature'));return combineValidity(checks)}catch(e){return validity('Not evaluated',['The quench evaluator is unavailable.'])}
}
function processRecordValidity(){
  if(invalidIn('#spx-tab-process-data'))return validity('Out of domain',['A visible process-data input is invalid.']);
  try{var rows=window.__SPX.release3.getData();if(!rows.length)return validity('Not evaluated',['No thermal record is loaded.']);if(rows.length<3)return validity('Out of domain',['At least three valid thermal rows are required.']);var temperatures=rows.map(function(row){return Number(row.smooth)}).filter(isFinite),span=temperatures.length?Math.max.apply(null,temperatures)-Math.min.apply(null,temperatures):0;if(span<5)return validity('Out of domain',['The thermal record spans less than 5 °C; cooling intervals and candidate-event interpretation are not supported.']);return rows.length<10?validity('Near boundary',['The record contains fewer than 10 derived rows; rate and event interpretation is fragile.']):validity('In range',[])}catch(e){return validity('Not evaluated',['The thermal-record evaluator is unavailable.'])}
}
function metallurgyLabValidity(){
  if(invalidIn('#spx-tab-metallurgy-lab'))return validity('Out of domain',['A visible metallurgy-lab input is invalid.']);
  return validity('In range',[])
}
function evaluateValidity(modelId,context){
  if(modelId==='spx-equilibrium-v1')return equilibriumValidity();
  if(modelId==='spx-chemistry-v1')return chemistryValidity(context);
  if(modelId==='spx-property-v1')return propertyValidity(context);
  if(modelId==='spx-kinetics-v1')return kineticsModelValidity();
  if(modelId==='spx-hardenability-v1')return hardenabilityValidity();
  if(modelId==='spx-austenitization-v1')return austenitizationValidity();
  if(modelId==='spx-quench-v1')return quenchValidity();
  if(modelId==='spx-process-record-v1')return processRecordValidity();
  if(modelId==='spx-metallurgy-lab-v1')return metallurgyLabValidity();
  return validity('Not evaluated',['No registered validity evaluator exists for '+modelId+'.'])
}
function approvalLabel(approval){return approval&&approval.status==='approved'?'Qualified approval recorded':approval&&approval.status==='retired'?'Model retired':'Qualified review pending'}
function approvalCoversContext(record,context){
  if(!record.approval||record.approval.status!=='approved')return false;
  if(record.approval.scope==='global')return true;
  return!!(context.approvalScope&&record.approval.scope===context.approvalScope)
}
function canSupportIntendedUse(record,evaluation,context){
  context=context&&typeof context==='object'?context:{};var intendedUse=INTENDED_USES.indexOf(context.intendedUse)>=0?context.intendedUse:'';
  if(!intendedUse)return false;
  if(evaluation.validity.state==='Out of domain'||evaluation.validity.state==='Not evaluated')return false;
  if(record.approval.status==='retired')return false;
  if(context.enforceCaseProvenance===true&&(context.chemistrySource==='unknown'||context.processBasis==='unknown'))return false;
  if(context.enforceCaseProvenance===true&&context.hasConflictingEvidence===true)return false;
  if(record.id==='spx-process-record-v1'&&context.processBasis==='actual-record'&&context.thermalRecordKind==='synthetic-sample')return false;
  if(intendedUse==='acceptance-decision')return record.classification==='Specification acceptance'&&approvalCoversContext(record,context)&&record.sources.every(function(s){return s.verified===true});
  if(record.classification==='Plant calibrated'||record.classification==='Specification acceptance')return approvalCoversContext(record,context)&&record.sources.every(function(s){return s.verified===true});
  return true
}
function evaluate(modelId,context,stack){
  context=context&&typeof context==='object'?context:{};stack=Array.isArray(stack)?stack:[];
  var record=own(MODEL_REGISTRY,modelId)?MODEL_REGISTRY[modelId]:null;
  if(!record)return{modelId:modelId||'',modelTitle:'Unregistered model',modelVersion:'unregistered',classification:'Teaching',validity:validity('Not evaluated',['No versioned model record is registered.']),evidence:{level:'none',label:'No evidence record',verified:false},approval:{status:'pending-qualified-review',qualifiedMetallurgist:null,approvedAt:null,scope:null},sources:[],assumptions:[],uncertainty:'Unknown.',requiredVerification:['Assign a registered and reviewed model before interpreting an output.'],permitted:false,warnings:['Unregistered model output is withheld.']};
  if(stack.indexOf(modelId)>=0)return{modelId:modelId,modelTitle:record.title,modelVersion:record.version,classification:record.classification,validity:validity('Not evaluated',['A circular model dependency was detected.']),evidence:clone(record.evidence),approval:clone(record.approval),sources:clone(record.sources),applicability:clone(record.applicability),dependencies:clone(record.dependencies||[]),dependencyAssessments:[],assumptions:clone(record.assumptions),uncertainty:record.uncertainty,requiredVerification:clone(record.requiredVerification),permitted:false,warnings:['Circular model dependency; output withheld.']};
  var ownValidity=evaluateValidity(modelId,context),dependencyResults=(record.dependencies||[]).map(function(id){return evaluate(id,context,stack.concat([modelId]))}),currentValidity=combineValidity([ownValidity].concat(dependencyResults.map(function(x){return x.validity}))),result={
    modelId:record.id,modelTitle:record.title,modelVersion:record.version,classification:record.classification,
    validity:currentValidity,evidence:clone(record.evidence),approval:clone(record.approval),sources:clone(record.sources),
    applicability:clone(record.applicability),dependencies:clone(record.dependencies||[]),dependencyAssessments:dependencyResults.map(function(x){return{modelId:x.modelId,modelVersion:x.modelVersion,classification:x.classification,validity:clone(x.validity),permitted:x.permitted,evidence:clone(x.evidence),approval:clone(x.approval)}}),assumptions:clone(record.assumptions),uncertainty:record.uncertainty,requiredVerification:clone(record.requiredVerification)
  };
  result.permitted=canSupportIntendedUse(record,result,context)&&dependencyResults.every(function(x){return x.permitted});
  result.warnings=[];
  if(currentValidity.state==='Near boundary')result.warnings.push('Near a model-domain boundary; verify sensitivity and independent evidence.');
  if(currentValidity.state==='Out of domain')result.warnings.push('Output withheld because one or more inputs are outside the registered model domain.');
  if(currentValidity.state==='Not evaluated')result.warnings.push('Output withheld because applicability could not be evaluated.');
  if(record.evidence.verified!==true)result.warnings.push('Model evidence record is not independently verified.');
  if(record.approval.status!=='approved')result.warnings.push('Qualified metallurgist approval is not recorded.');
  if(context.enforceCaseProvenance===true&&(context.chemistrySource==='unknown'||context.processBasis==='unknown'))result.warnings.push('Case input provenance is incomplete; classify both the chemistry source and process basis before using governed values.');
  if(context.enforceCaseProvenance===true&&context.hasConflictingEvidence===true)result.warnings.push('User evidence marked as conflicting is unresolved; governed values are withheld for this case.');
  if(record.id==='spx-process-record-v1'&&context.thermalRecordKind==='synthetic-sample')result.warnings.push(context.processBasis==='actual-record'?'The bundled synthetic sample cannot be represented as an actual process record; output is withheld.':'The loaded thermal record is the bundled synthetic sample, not plant evidence.');
  dependencyResults.forEach(function(dependency){dependency.warnings.forEach(function(warning){result.warnings.push('Dependency '+dependency.modelId+': '+warning)})});
  if(INTENDED_USES.indexOf(context.intendedUse)<0)result.warnings.push('A recognized intended use was not supplied; output is withheld.');
  if(context.intendedUse==='acceptance-decision'&&!result.permitted)result.warnings.push('This model is not authorized for specification or acceptance decisions.');
  return result
}
function modelsForQuestion(questionType){return clone(own(QUESTION_MODELS,questionType)?QUESTION_MODELS[questionType]:[])}
function evaluateQuestion(questionType,context){
  context=context&&typeof context==='object'?context:{};
  var ids=modelsForQuestion(questionType),models=ids.map(function(id){return evaluate(id,context)});
  var currentValidity=models.length?worst(models.map(function(m){return m.validity.state})):'Not evaluated';
  var warnings=[];models.forEach(function(m){warnings=warnings.concat(m.warnings)});
  if(!models.length)warnings.push('No registered model is assigned to this question.');
  return{questionType:questionType||'',modelIds:ids,models:models,validity:currentValidity,permitted:models.length>0&&models.every(function(m){return m.permitted}),warnings:unique(warnings)}
}
function formatValue(value,unit){if(value==null||value==='')return null;return String(value)+(unit?' '+unit:'')}
function governedOutputs(summary,context){
  summary=summary&&typeof summary==='object'?summary:{};context=context&&typeof context==='object'?context:{};
  var selected=Array.isArray(context.modelIds)?context.modelIds:null;
  return OUTPUT_DEFINITIONS.filter(function(def){return!selected||selected.indexOf(def.modelId)>=0}).map(function(def){
    var result=evaluate(def.modelId,context),raw=own(summary,def.summaryKey)?summary[def.summaryKey]:null,available=raw!=null&&raw!==''&&result.validity.state!=='Out of domain'&&result.validity.state!=='Not evaluated'&&result.permitted;
    var outputValidity=result.validity;
    if((raw==null||raw==='')&&outputValidity.state!=='Out of domain')outputValidity=validity('Not evaluated',outputValidity.reasons.concat([def.label+' is not available in the current result snapshot.']));
    var policyStatus=context.enforceCaseProvenance===true&&(context.chemistrySource==='unknown'||context.processBasis==='unknown')?'Withheld — provenance incomplete':context.enforceCaseProvenance===true&&context.hasConflictingEvidence===true?'Withheld — conflicting evidence':def.modelId==='spx-process-record-v1'&&context.processBasis==='actual-record'&&context.thermalRecordKind==='synthetic-sample'?'Withheld — synthetic sample is not an actual record':'Withheld — intended use not permitted';
    return{
      outputId:def.id,label:def.label,value:available?raw:null,displayValue:available?formatValue(raw,def.unit):'Withheld',unit:def.unit,
      status:available?'Available — conditional':outputValidity.state==='Out of domain'?'Withheld — out of domain':!result.permitted?policyStatus:'Not evaluated',
      modelId:result.modelId,modelTitle:result.modelTitle,modelVersion:result.modelVersion,registryVersion:REGISTRY_VERSION,inputFingerprint:String(context.scenarioFingerprint||'').slice(0,160),classification:result.classification,
      validity:outputValidity,evidence:clone(result.evidence),approval:clone(result.approval),sources:clone(result.sources),
      applicability:clone(result.applicability),dependencies:clone(result.dependencies),dependencyAssessments:clone(result.dependencyAssessments||[]),assumptions:clone(result.assumptions),uncertainty:result.uncertainty,requiredVerification:clone(result.requiredVerification),
      warnings:unique(result.warnings.concat(outputValidity.reasons||[]))
    }
  })
}
function validateRegistry(candidate,outputDefinitions){
  var registry=candidate&&typeof candidate==='object'&&!Array.isArray(candidate)?candidate:MODEL_REGISTRY,definitions=Array.isArray(outputDefinitions)?outputDefinitions:OUTPUT_DEFINITIONS,errors=[],warnings=[],outputOwners={},definitionIds={},modelIds={};
  Object.keys(registry).forEach(function(key){
    var model=registry[key];
    if(!model||typeof model!=='object'){errors.push(key+': model record must be an object.');return}
    if(model.id!==key)errors.push(key+': registry key and id differ.');
    if(modelIds[model.id])errors.push(model.id+': duplicate model id.');modelIds[model.id]=true;
    if(!/^spx-[a-z0-9-]+-v\d+$/.test(model.id||''))errors.push(key+': id is not stable/versioned.');
    if(!/^\d+\.\d+\.\d+$/.test(model.version||''))errors.push(key+': version is not semantic.');
    if(typeof model.title!=='string'||!model.title.trim()||typeof model.owner!=='string'||!model.owner.trim())errors.push(key+': title and owner are required.');
    if(CLASSIFICATIONS.indexOf(model.classification)<0)errors.push(key+': invalid classification.');
    if(!Array.isArray(model.outputs)||!model.outputs.length)errors.push(key+': outputs are required.');
    if(!Array.isArray(model.dependencies))errors.push(key+': dependencies must be an array.');
    if(!model.applicability||!model.applicability.scope||!Array.isArray(model.applicability.inputDomain)||!Array.isArray(model.applicability.exclusions))errors.push(key+': complete applicability metadata is required.');
    (model.outputs||[]).forEach(function(output){if(own(outputOwners,output))errors.push(output+': assigned more than once.');outputOwners[output]=key});
    (model.dependencies||[]).forEach(function(dependency){if(!own(registry,dependency))errors.push(key+': unresolved dependency '+dependency+'.')});
    if(!model.evidence||typeof model.evidence.verified!=='boolean'||!model.evidence.level||!model.evidence.label||!model.evidence.validation)errors.push(key+': complete evidence metadata is required.');
    if(!model.approval||APPROVAL_STATES.indexOf(model.approval.status)<0)errors.push(key+': approval status is required.');
    if(!Array.isArray(model.sources)||!model.sources.length)errors.push(key+': at least one source is required.');
    (model.sources||[]).forEach(function(source,index){if(!source.reference||!source.clauseRef||typeof source.verified!=='boolean')errors.push(key+': source '+index+' lacks reference, clauseRef, or verified state.')});
    if(!Array.isArray(model.assumptions)||!model.assumptions.length||model.assumptions.some(function(item){return typeof item!=='string'||!item.trim()}))errors.push(key+': non-empty assumptions are required.');
    if(typeof model.uncertainty!=='string'||!model.uncertainty.trim())errors.push(key+': uncertainty metadata is required.');
    if(!Array.isArray(model.requiredVerification)||!model.requiredVerification.length||model.requiredVerification.some(function(item){return typeof item!=='string'||!item.trim()}))errors.push(key+': required verification metadata is required.');
    if(model.approval&&model.approval.status==='approved'&&(!model.approval.qualifiedMetallurgist||!/^\d{4}-\d{2}-\d{2}/.test(model.approval.approvedAt||'')||!model.approval.scope))errors.push(key+': approved model lacks qualified reviewer, date, or scope.');
    if((model.classification==='Plant calibrated'||model.classification==='Specification acceptance')&&(!model.approval||model.approval.status!=='approved'||!Array.isArray(model.sources)||!model.sources.every(function(s){return s.verified===true})))errors.push(key+': elevated classification requires qualified approval and verified sources.');
    if(model.approval&&model.approval.status!=='approved')warnings.push(key+': qualified metallurgist approval pending.');
    if(model.sources&&model.sources.some(function(s){return s.verified!==true}))warnings.push(key+': one or more source records are unverified.');
  });
  definitions.forEach(function(def){
    if(!def||!def.id||!def.label||!def.summaryKey||typeof def.unit!=='string'||!def.modelId){errors.push('Output definition lacks id, label, summaryKey, unit, or modelId.');return}
    if(definitionIds[def.id])errors.push(def.id+': duplicate output definition.');definitionIds[def.id]=true;
    var model=own(registry,def.modelId)?registry[def.modelId]:null;if(!model){errors.push(def.id+': output points to an unregistered model.');return}
    var declared=Array.isArray(model.outputs)?model.outputs:[];
    if(declared.indexOf(def.id)<0)errors.push(def.id+': output is not declared by its model record.')
  });
  Object.keys(registry).forEach(function(key){(registry[key]&&registry[key].outputs||[]).forEach(function(output){if(!definitionIds[output])errors.push(output+': declared output has no governed output definition.')})});
  return{valid:errors.length===0,errors:errors,warnings:unique(warnings)}
}
function auditRecord(options){
  options=options&&typeof options==='object'?options:{};
  var questionType=options.questionType||'',intendedUse=INTENDED_USES.indexOf(options.intendedUse)>=0?options.intendedUse:null,context={intendedUse:intendedUse,chemistrySource:options.chemistrySource||'unknown',processBasis:options.processBasis||'unknown',enforceCaseProvenance:true,hasConflictingEvidence:options.hasConflictingEvidence===true,thermalRecordKind:options.thermalRecordKind||'no-record'},question=evaluateQuestion(questionType,context);context.scenarioFingerprint=options.scenarioFingerprint||'';context.modelIds=question.modelIds;var outputs=governedOutputs(options.summary||{},context);
  var warnings=question.warnings.slice();outputs.forEach(function(output){warnings=warnings.concat(output.warnings)});
  if(!intendedUse)warnings.unshift('A recognized intended use was not supplied; every governed output is withheld.');
  if(options.applicability&&Array.isArray(options.applicability.checks))options.applicability.checks.forEach(function(check){if(check.status==='Output withheld'||check.status==='Not evaluated')warnings.push(check.title+': '+check.detail)});
  return{
    schemaVersion:SCHEMA_VERSION,registryVersion:REGISTRY_VERSION,generatedAt:options.generatedAt||new Date().toISOString(),
    toolVersion:options.toolVersion||'',scenarioFingerprint:options.scenarioFingerprint||'',
    question:{type:questionType,text:options.questionText||''},intendedUse:intendedUse,
    inputProvenance:{chemistrySource:context.chemistrySource,processBasis:context.processBasis,thermalRecordKind:context.thermalRecordKind,conflictingEvidenceUnresolved:context.hasConflictingEvidence},
    applicability:options.applicability?clone(options.applicability):null,
    questionGovernance:question,outputs:outputs,warnings:unique(warnings),registryValidation:validateRegistry()
  }
}
function deepFreeze(value){if(!value||typeof value!=='object'||Object.isFrozen(value))return value;Object.freeze(value);Object.keys(value).forEach(function(key){deepFreeze(value[key])});return value}

deepFreeze(MODEL_REGISTRY);deepFreeze(QUESTION_MODELS);deepFreeze(OUTPUT_DEFINITIONS);
var validation=validateRegistry();
if(!validation.valid&&window.console&&console.error)console.error('Steel Explorer model registry invalid:',validation.errors.join(' '));

window.__SPX.governance={
  schemaVersion:SCHEMA_VERSION,registryVersion:REGISTRY_VERSION,classifications:clone(CLASSIFICATIONS),validityStates:clone(VALIDITY_STATES),
  registry:function(){return clone(MODEL_REGISTRY)},getRegistry:function(){return clone(MODEL_REGISTRY)},getModel:function(id){return own(MODEL_REGISTRY,id)?clone(MODEL_REGISTRY[id]):null},outputDefinitions:function(){return clone(OUTPUT_DEFINITIONS)},
  validateRegistry:validateRegistry,evaluate:evaluate,modelsForQuestion:modelsForQuestion,evaluateQuestion:evaluateQuestion,
  assessModel:evaluate,assessQuestion:evaluateQuestion,governedOutputs:governedOutputs,auditRecord:auditRecord,approvalLabel:approvalLabel
};
})();
