(function(){
'use strict';
var tool=document.getElementById('spx-tool');
if(!tool||!window.__SPX||window.__SPX.professional||typeof window.serializable!=='function')return;

var STORAGE_KEY='spx-professional-workflow-v1';
var VERSION='1.2.0-professional-workspace';
var STORAGE_LIMIT=900000;
var MAX_SNAPSHOT_CHARS=220000;
var STAGES=['define','question','applicability','compare','sensitivity','evidence','report'];
var STAGE_LABELS={
  define:'Define material/process',question:'Select engineering question',applicability:'Review applicability',
  compare:'Compare scenarios',sensitivity:'Inspect sensitivity/uncertainty',evidence:'Add plant evidence',report:'Generate report'
};
var QUESTIONS={
  chemistry:{title:'Screen a heat chemistry',prompt:'What chemistry-related behaviour or risk needs to be screened?',route:'chemistry',caveat:'Chemistry calculations are screening indicators; grade, product form, procedure, and measured response remain decisive.'},
  phases:{title:'Identify equilibrium phases',prompt:'Which equilibrium field or phase fraction needs to be examined?',route:'equilibrium',caveat:'The Fe–Fe₃C view is an equilibrium reference and does not predict rapid-cooling products.'},
  transformations:{title:'Assess transformation response',prompt:'How may cooling conditions change the predicted transformation response?',route:'kinetics',caveat:'Generalized TTT/CCT outputs are not certified grade-specific diagrams.'},
  'heat-treatment':{title:'Review a heat-treatment route',prompt:'Is the proposed austenitize–quench–temper route suitable for further evaluation?',route:'austenitization',caveat:'Modelled heat-through, dissolution, grain growth, quench response, and tempering trends require process qualification.'},
  hardenability:{title:'Screen through-section hardenability',prompt:'Can the selected section and assumptions achieve the required through-section response?',route:'hardenability',caveat:'Equivalent-Jominy potential is not proof of the selected quench outcome.'},
  'plant-data':{title:'Investigate a thermal record',prompt:'What does the measured time–temperature record suggest, and what must be verified?',route:'process-data',caveat:'Candidate arrests and mismatch metrics do not confirm transformations or validate a process.'},
  microstructure:{title:'Investigate a microstructure',prompt:'Which observed microstructural feature needs explanation or corroboration?',route:'metallurgy-lab',subpanel:'metallography',caveat:'The virtual metallography field is schematic and cannot identify or certify an actual specimen.'},
  other:{title:'Frame another engineering question',prompt:'State the decision or investigation this screening case should support.',route:'navigator',caveat:'Confirm that a suitable model and independent evidence exist before drawing an engineering conclusion.'}
};
var CHEMISTRY_SOURCES=['heat-analysis','product-analysis','nominal-grade','illustrative-preset','unknown'];
var PROCESS_BASES=['actual-record','target-recipe','hypothetical','unknown'];
var INTENDED_USES=['early-screening','compare-alternatives','investigation-support','acceptance-decision'];
var EVIDENCE_TYPES=['chemistry','thermal','hardness','metallography','mechanical','process','standard'];
var EVIDENCE_ASSESSMENTS=['supports','conflicts','inconclusive','not-assessed'];
var MODEL_STATUSES=['Calculation available — conditional','Output withheld','Not evaluated','User-record assisted'];
var SENSITIVITY_INPUTS=['carbon','cooling-rate'];
var SENSITIVITY_OUTPUTS=['estimated-hardness','martensite'];
var SNAPSHOT_SLOTS=['baseline','alternative','option3'];
var editingEvidenceId='';
var evidenceSequence=0;
var storageFailure=false;
var textSaveTimer=0;

function own(o,k){return Object.prototype.hasOwnProperty.call(o,k)}
function choice(v,allowed,fallback){return allowed.indexOf(v)>=0?v:fallback}
function text(v,max){return typeof v==='string'?v.slice(0,max):''}
function number(v,fallback,min,max){if(v==null||(typeof v==='string'&&!v.trim()))return fallback;var n=Number(v);return isFinite(n)?Math.min(max,Math.max(min,n)):fallback}
function bool(v){return v===true}
function clone(v){return JSON.parse(JSON.stringify(v))}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function label(v){return String(v||'').replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()})}
function isoDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(String(v||''))?String(v):''}
function finiteOrNull(v){if(v==null||(typeof v==='string'&&!v.trim()))return null;var n=Number(v);return isFinite(n)?n:null}
function safeGet(key){try{return localStorage.getItem(key)}catch(e){return null}}
function safeSet(key,value){try{localStorage.setItem(key,value);return true}catch(e){return false}}
function safeRemove(key){try{localStorage.removeItem(key);return true}catch(e){return false}}
function status(value){return choice(value,MODEL_STATUSES,'Not evaluated')}
function nowIso(){return new Date().toISOString()}
function pctValue(v){return isFinite(Number(v))?Math.round(Number(v)*100):null}
function roundValue(v,n){if(!isFinite(Number(v)))return null;var p=Math.pow(10,n||0);return Math.round(Number(v)*p)/p}

function freshState(){return{
  schemaVersion:1,activeStage:'define',
  definition:{caseTitle:'',materialId:'',chemistrySource:'unknown',processBasis:'unknown',context:'',reviewedFingerprint:''},
  question:{type:'',text:''},
  applicability:{intendedUse:'early-screening',reviewedFingerprint:''},
  snapshots:[],
  sensitivity:{input:'carbon',output:'estimated-hardness',low:null,high:null,uncertaintyNote:'',result:null},
  evidence:[],
  report:{interpretation:'',nextAction:'',owner:'',dueDate:''}
}}

function sanitizeScenario(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  var allowed=['unit','points','activeId','nextId','chem','cycle','kinetics','experience','thermalBasis','rapidRate','guideGoal','release1','release2','release3','release4','release5'],out={};
  allowed.forEach(function(k){if(own(raw,k))out[k]=raw[k]});
  try{var json=JSON.stringify(out);if(!json||json.length>MAX_SNAPSHOT_CHARS)return null;return JSON.parse(json)}catch(e){return null}
}
function sanitizeSummary(raw){
  raw=raw&&typeof raw==='object'?raw:{};
  return{
    carbon:finiteOrNull(raw.carbon),pointCarbon:finiteOrNull(raw.pointCarbon),pointTempC:finiteOrNull(raw.pointTempC),
    phase:text(raw.phase,120),coolingRate:finiteOrNull(raw.coolingRate),estimatedHV:finiteOrNull(raw.estimatedHV),
    martensitePct:finiteOrNull(raw.martensitePct),austStatus:text(raw.austStatus,100),hardCenterHV:finiteOrNull(raw.hardCenterHV),
    quenchCenterHV:finiteOrNull(raw.quenchCenterHV),processRows:number(raw.processRows,0,0,100000),processEvents:number(raw.processEvents,0,0,100000),
    recordFingerprint:text(raw.recordFingerprint,80),processDuration:finiteOrNull(raw.processDuration),processTempMinC:finiteOrNull(raw.processTempMinC),processTempMaxC:finiteOrNull(raw.processTempMaxC),processRate800500:finiteOrNull(raw.processRate800500),processRate500300:finiteOrNull(raw.processRate500300),
    modelStatus:status(raw.modelStatus),reason:text(raw.reason,600),pathCarbon:finiteOrNull(raw.pathCarbon),propertyRate:finiteOrNull(raw.propertyRate)
  }
}
function sanitizeSensitivityResult(raw){
  if(!raw||typeof raw!=='object')return null;
  var input=choice(raw.input,SENSITIVITY_INPUTS,''),output=choice(raw.output,SENSITIVITY_OUTPUTS,'');if(!input||!output)return null;
  var rows=Array.isArray(raw.rows)?raw.rows.slice(0,3).map(function(r){r=r&&typeof r==='object'?r:{};return{point:choice(r.point,['low','baseline','high'],'baseline'),input:finiteOrNull(r.input),value:finiteOrNull(r.value),status:status(r.status),reason:text(r.reason,400)}}):[];
  if(rows.length!==3)return null;
  return{input:input,output:output,low:finiteOrNull(raw.low),baseline:finiteOrNull(raw.baseline),high:finiteOrNull(raw.high),unit:text(raw.unit,30),rows:rows,fingerprint:text(raw.fingerprint,80),ranAt:text(raw.ranAt,40),uncertaintyNote:text(raw.uncertaintyNote,400)}
}
function sanitizeState(raw){
  var clean=freshState(),source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
  clean.activeStage=choice(source.activeStage,STAGES,'define');
  var d=source.definition&&typeof source.definition==='object'?source.definition:{};
  clean.definition={caseTitle:text(d.caseTitle,120),materialId:text(d.materialId,120),chemistrySource:choice(d.chemistrySource,CHEMISTRY_SOURCES,'unknown'),processBasis:choice(d.processBasis,PROCESS_BASES,'unknown'),context:text(d.context,1000),reviewedFingerprint:text(d.reviewedFingerprint,80)};
  var q=source.question&&typeof source.question==='object'?source.question:{};
  clean.question={type:own(QUESTIONS,q.type)?q.type:'',text:text(q.text,600)};
  var a=source.applicability&&typeof source.applicability==='object'?source.applicability:{};
  clean.applicability={intendedUse:choice(a.intendedUse,INTENDED_USES,'early-screening'),reviewedFingerprint:text(a.reviewedFingerprint,160)};
  clean.snapshots=(Array.isArray(source.snapshots)?source.snapshots:[]).slice(0,3).map(function(s){
    s=s&&typeof s==='object'?s:{};var scenario=sanitizeScenario(s.scenario);if(!scenario)return null;
    return{slot:choice(s.slot,SNAPSHOT_SLOTS,'baseline'),label:text(s.label,80),capturedAt:text(s.capturedAt,40),fingerprint:text(s.fingerprint,80),questionType:own(QUESTIONS,s.questionType)?s.questionType:'',questionFingerprint:text(s.questionFingerprint,80),version:text(s.version,60),unit:choice(s.unit,['metric','imperial'],'metric'),basis:choice(s.basis,['equilibrium','rapid','ttt','cct'],'equilibrium'),scenario:scenario,summary:sanitizeSummary(s.summary)}
  }).filter(function(s,i,a){return s&&a.findIndex(function(x){return x&&x.slot===s.slot})===i});
  var se=source.sensitivity&&typeof source.sensitivity==='object'?source.sensitivity:{};
  clean.sensitivity={input:choice(se.input,SENSITIVITY_INPUTS,'carbon'),output:choice(se.output,SENSITIVITY_OUTPUTS,'estimated-hardness'),low:finiteOrNull(se.low),high:finiteOrNull(se.high),uncertaintyNote:text(se.uncertaintyNote,800),result:sanitizeSensitivityResult(se.result)};
  clean.evidence=(Array.isArray(source.evidence)?source.evidence:[]).slice(0,20).map(function(e,i){e=e&&typeof e==='object'?e:{};return{id:text(e.id,80)||'evidence-'+(i+1),type:choice(e.type,EVIDENCE_TYPES,'process'),reference:text(e.reference,120),date:isoDate(e.date),observation:text(e.observation,500),assessment:choice(e.assessment,EVIDENCE_ASSESSMENTS,'not-assessed'),createdAt:text(e.createdAt,40)}}).filter(function(e){return e.reference&&e.observation});
  var r=source.report&&typeof source.report==='object'?source.report:{};
  clean.report={interpretation:text(r.interpretation,1500),nextAction:text(r.nextAction,800),owner:text(r.owner,120),dueDate:isoDate(r.dueDate)};
  return clean
}

function loadState(){var raw=safeGet(STORAGE_KEY);if(!raw||raw.length>STORAGE_LIMIT)return freshState();try{var parsed=JSON.parse(raw);return parsed&&parsed.schemaVersion===1?sanitizeState(parsed):freshState()}catch(e){return freshState()}}
var pro=loadState();
function saveState(){clearTimeout(textSaveTimer);textSaveTimer=0;pro=sanitizeState(pro);var raw=JSON.stringify(pro);storageFailure=raw.length>STORAGE_LIMIT||!safeSet(STORAGE_KEY,raw);if(storageFailure)announce('Professional workflow changes could not be saved in this browser. The active engineering scenario was not affected.','danger');updateStageStatuses()}
function scheduleSave(){clearTimeout(textSaveTimer);textSaveTimer=setTimeout(saveState,220)}

function currentScenario(){try{return clone(window.serializable())}catch(e){return null}}
function hashPayload(payload,prefix){
  var raw='';try{raw=JSON.stringify(payload||{})}catch(e){raw='{}'}
  var h=2166136261;for(var i=0;i<raw.length;i++){h^=raw.charCodeAt(i);h=Math.imul(h,16777619)}
  return(prefix||'SPX')+'-'+('00000000'+(h>>>0).toString(16)).slice(-8)+'-'+raw.length
}
function withoutKeys(raw,keys){var out=raw&&typeof raw==='object'&&!Array.isArray(raw)?clone(raw):{};keys.forEach(function(k){delete out[k]});return out}
function decisionInputs(){var path=document.getElementById('spx-path-carbon');return{pathCarbon:finiteOrNull(path&&path.value),propertyRate:propertyRate()}}
function engineeringFingerprintPayload(scenario,controls){
  var s=scenario&&typeof scenario==='object'?scenario:{},r4=s.release4||{},r5=s.release5||{};
  return{
    points:s.points,activeId:s.activeId,chem:s.chem,cycle:s.cycle,kinetics:s.kinetics,thermalBasis:s.thermalBasis,rapidRate:s.rapidRate,
    release1:s.release1,release2:s.release2,release3:s.release3,
    release4:{surface:r4.surface,temper:r4.temper,mech:withoutKeys(r4.mech,['chart']),meta:r4.meta,solid:withoutKeys(r4.solid,['stage']),family:r4.family,familyData:r4.familyData},
    release5:{map:r5.map,points:r5.points,activeId:r5.activeId},controls:controls||decisionInputs()
  }
}
function fingerprintScenario(scenario,controls){return hashPayload(engineeringFingerprintPayload(scenario,controls),'SPX')}
function fingerprint(){return fingerprintScenario(currentScenario(),decisionInputs())}
function questionFingerprint(){return hashPayload({type:pro.question.type,text:pro.question.text.trim()},'QUESTION')}
function processRecordFingerprint(){try{var rows=window.__SPX.release3.getData();return rows.length?hashPayload(rows,'RECORD'):'none'}catch(e){return'unavailable'}}
function applicabilityFingerprint(){return hashPayload({scenario:fingerprint(),question:{type:pro.question.type,text:pro.question.text},intendedUse:pro.applicability.intendedUse,chemistrySource:pro.definition.chemistrySource,processBasis:pro.definition.processBasis,evidence:pro.evidence.map(function(e){return{id:e.id,assessment:e.assessment}}),processRecord:processRecordFingerprint()},'APR')}
function currentPoint(scenario){var pts=scenario&&Array.isArray(scenario.points)?scenario.points:[],id=Number(scenario&&scenario.activeId);return pts.find(function(p){return Number(p.id)===id})||pts[0]||null}
function invalidIn(selectors){return selectors.some(function(selector){return Array.prototype.some.call(document.querySelectorAll(selector+' [aria-invalid="true"]'),function(el){return el.getAttribute('aria-invalid')==='true'})})}
function check(id,title,checkStatus,detail,route){return{id:id,title:title,status:status(checkStatus),detail:detail,route:route||''}}
function chemistryGate(){
  if(invalidIn(['#spx-tab-chemistry']))return{valid:false,reason:'A visible chemistry input is invalid. Stored prior values are not reported as current results.'};
  try{var m=window.__SPX.chemMetrics(),gate=typeof dependentModelValidity==='function'?dependentModelValidity(m,state.chem.C):{valid:Number(state.chem.C)>=.02,reason:'Carbon is outside the current screen.'};return gate}catch(e){return{valid:false,reason:'The chemistry validity gate is unavailable.'}}
}
function questionModelCheck(type){
  if(!type||!own(QUESTIONS,type))return check('question-model','Question-specific model','Not evaluated','Choose a primary engineering question before reviewing applicability.');
  if(type==='phases'){
    if(invalidIn(['#spx-tab-equilibrium']))return check('question-model','Equilibrium phase model','Output withheld','A visible equilibrium input is invalid.','equilibrium');
    var point=currentPoint(currentScenario());if(!point)return check('question-model','Equilibrium phase model','Not evaluated','No active carbon–temperature point is available.','equilibrium');
    var pf=window.__SPX.phaseFractions(point.c,point.t),invariant=pf&&pf.region&&pf.region.key==='eutectoid';
    return check('question-model','Equilibrium phase model','Calculation available — conditional',invariant?'The point lies on the exact A₁ invariant; phase amounts are not uniquely determined without reaction extent.':'The simplified Fe–Fe₃C equilibrium screen is available. It does not establish transformation kinetics.','equilibrium')
  }
  if(type==='chemistry'){
    var cg=chemistryGate();return check('question-model','Chemistry and property screen',cg.valid?'Calculation available — conditional':'Output withheld',cg.valid?'Numerical chemistry screens are available; grade, product, and process applicability are not established.':cg.reason,'chemistry')
  }
  if(type==='transformations'){
    if(invalidIn(['#spx-tab-kinetics']))return check('question-model','TTT/CCT transformation screen','Output withheld','A visible kinetics input is invalid; prior calculated values are not treated as current.','kinetics');
    try{var kv=typeof kineticsValidity==='function'?kineticsValidity():null;return check('question-model','TTT/CCT transformation screen',kv&&kv.valid?'Calculation available — conditional':kv?'Output withheld':'Not evaluated',kv&&kv.valid?'The generalized transformation screen is numerically available; use grade-specific diagrams for engineering decisions.':kv?kv.reason:'The kinetics validity gate is unavailable.','kinetics')}catch(e){return check('question-model','TTT/CCT transformation screen','Not evaluated','The kinetics validity gate is unavailable.','kinetics')}
  }
  if(type==='hardenability'){
    if(invalidIn(['#spx-tab-hardenability']))return check('question-model','Through-section hardenability screen','Output withheld','A visible hardenability input is invalid.','hardenability');
    var hm=window.__SPX.release2.hardModel();return check('question-model','Through-section hardenability screen',hm&&hm.eligible?'Calculation available — conditional':'Output withheld',hm&&hm.eligible?'Equivalent-Jominy potential is available; confirm with measured Jominy and hardness traverses.':hm&&hm.eligibility?hm.eligibility.reason:'The hardenability model is unavailable.','hardenability')
  }
  if(type==='heat-treatment'){
    if(invalidIn(['#spx-tab-austenitization','#spx-tab-quenching']))return check('question-model','Heat-treatment route screen','Output withheld','A visible austenitization or quench input is invalid.','austenitization');
    var am=window.__SPX.release2.austModel(),qm=window.__SPX.release2.quenchModel();var valid=am&&am.valid&&qm&&qm.valid&&qm.outcomeValid;
    return check('question-model','Heat-treatment route screen',valid?'Calculation available — conditional':'Output withheld',valid?'Austenitizing and quench screens are numerically available; they are not a qualified process window or risk probability.':am&&!am.valid?am.reason:'The selected quench does not yield a complete quantitative outcome.','austenitization')
  }
  if(type==='plant-data'){
    if(invalidIn(['#spx-tab-process-data']))return check('question-model','Thermal-record analysis','Output withheld','A visible process-data input is invalid; retained prior analysis is not reported as current.','process-data');
    var rows=window.__SPX.release3.getData();return check('question-model','Thermal-record analysis',rows.length?'User-record assisted':'Not evaluated',rows.length?'A session-only record is loaded. Calibration, traceability, representativeness, and transformation identity remain unverified.':'Load an actual record or the clearly labelled synthetic sample before interpreting this stage.','process-data')
  }
  if(type==='microstructure'){
    if(invalidIn(['#spx-tab-metallurgy-lab']))return check('question-model','Metallurgy-lab screen','Output withheld','A visible metallurgy-lab input is invalid.','metallurgy-lab');
    return check('question-model','Metallurgy-lab screen','Calculation available — conditional','Metallography and mechanical views are schematic or directional. Confirm observations on prepared specimens and qualified tests.','metallurgy-lab')
  }
  return check('question-model','Question-specific model','Not evaluated','No single model has been assigned. Select and document the appropriate independent method before drawing a conclusion.','navigator')
}
function applicability(){
  var checks=[],sourceKnown=pro.definition.chemistrySource!=='unknown'&&pro.definition.processBasis!=='unknown';
  checks.push(check('provenance','Input provenance',sourceKnown?'Calculation available — conditional':'Not evaluated',sourceKnown?'The user has classified chemistry and process sources; the tool has not verified them.':'Identify both the chemistry source and process basis.','chemistry'));
  var needsChem=['chemistry','transformations','heat-treatment','hardenability'].indexOf(pro.question.type)>=0,cg=chemistryGate();
  checks.push(check('chemistry','Chemistry/model domain',needsChem?(cg.valid?'Calculation available — conditional':'Output withheld'):'Not evaluated',needsChem?(cg.valid?'The current empirical chemistry gate passes; configured input limits are not a validated grade domain.':cg.reason):'This primary question does not use the shared chemistry-dependent screen.','chemistry'));
  checks.push(questionModelCheck(pro.question.type));
  checks.push(check('plant-evidence','Independent plant or test evidence',pro.evidence.length?'User-record assisted':'Not evaluated',pro.evidence.length?pro.evidence.length+' user-classified evidence item(s) are recorded. Their authenticity and sufficiency are not verified by the tool.':'No plant or test evidence is recorded; findings remain unverified screening estimates.','process-data'));
  var acceptance=pro.applicability.intendedUse==='acceptance-decision';
  checks.push(check('intended-use','Intended use',acceptance?'Output withheld':'Calculation available — conditional',acceptance?'Specification or acceptance decisions are outside the intended use of this tool. Use an independent qualified method and authorized review.':'The selected use remains preliminary screening, comparison, or investigation support.'));
  var overall=checks.some(function(c){return c.status==='Output withheld'})?'Output withheld':!sourceKnown||!pro.question.type||checks[2].status==='Not evaluated'?'Not evaluated':checks[2].status==='User-record assisted'?'User-record assisted':'Calculation available — conditional';
  return{status:overall,checks:checks,fingerprint:applicabilityFingerprint(),reviewed:pro.applicability.reviewedFingerprint===applicabilityFingerprint()}
}

function propertyRate(){var el=document.getElementById('spx-property-rate'),v=el?Number(el.value):NaN,rate=isFinite(v)?Math.pow(10,v/40-1):NaN;return isFinite(rate)&&rate>=.1&&rate<=1000?rate:null}
function captureSummary(){
  var scenario=currentScenario(),point=currentPoint(scenario),summary={carbon:Number(state.chem.C),pointCarbon:point?Number(point.c):null,pointTempC:point?Number(point.t):null,phase:'',coolingRate:finiteOrNull(document.getElementById('spx-kin-cooling')&&document.getElementById('spx-kin-cooling').value),estimatedHV:null,martensitePct:null,austStatus:'',hardCenterHV:null,quenchCenterHV:null,processRows:0,processEvents:0,recordFingerprint:'',processDuration:null,processTempMinC:null,processTempMaxC:null,processRate800500:null,processRate500300:null,modelStatus:'Not evaluated',reason:'',pathCarbon:finiteOrNull(document.getElementById('spx-path-carbon')&&document.getElementById('spx-path-carbon').value),propertyRate:propertyRate()};
  if(point){try{var pf=window.__SPX.phaseFractions(point.c,point.t);summary.phase=pf&&pf.region?pf.region.label:''}catch(e){summary.phase='Unavailable'}}
  var model=questionModelCheck(pro.question.type);summary.modelStatus=model.status;summary.reason=model.detail;
  if(!invalidIn(['#spx-tab-chemistry'])&&summary.propertyRate!=null){
    try{var pe=window.__SPX.release1.propertyEstimate(clone(state.chem),summary.propertyRate);if(pe&&pe.valid){summary.estimatedHV=roundValue(pe.hv,0);summary.martensitePct=pctValue(pe.mart)}}catch(e){}
  }
  if(!invalidIn(['#spx-tab-austenitization'])){try{var am=window.__SPX.release2.austModel();summary.austStatus=am&&am.valid?am.status:'Unavailable'}catch(e){summary.austStatus='Unavailable'}}
  if(!invalidIn(['#spx-tab-hardenability'])){try{var hm=window.__SPX.release2.hardModel();if(hm&&hm.eligible)summary.hardCenterHV=roundValue(hm.center.hv,0)}catch(e){}}
  if(!invalidIn(['#spx-tab-quenching'])){try{var qm=window.__SPX.release2.quenchModel();if(qm&&qm.valid&&qm.outcomeValid)summary.quenchCenterHV=roundValue(qm.center.hv,0)}catch(e){}}
  try{var data=window.__SPX.release3.getData(),events=window.__SPX.release3.getEvents();summary.processRows=data.length;summary.processEvents=events.length;if(data.length){summary.recordFingerprint=hashPayload(data,'RECORD');summary.processDuration=roundValue(data[data.length-1].time,2);var temps=data.map(function(p){return Number(p.smooth)}).filter(isFinite);if(temps.length){summary.processTempMinC=roundValue(Math.min.apply(null,temps),1);summary.processTempMaxC=roundValue(Math.max.apply(null,temps),1)}summary.processRate800500=roundValue(window.__SPX.release3.intervalRate(800,500),3);summary.processRate500300=roundValue(window.__SPX.release3.intervalRate(500,300),3)}}catch(e){}
  return sanitizeSummary(summary)
}
function normalSlot(slot){return{a:'baseline',b:'alternative',c:'option3'}[slot]||choice(slot,SNAPSHOT_SLOTS,'baseline')}
function snapshotFor(slot){slot=normalSlot(slot);return pro.snapshots.find(function(s){return s.slot===slot})||null}
function captureSnapshot(slot){
  slot=normalSlot(slot);var scenario=currentScenario();if(!scenario)return null;
  var safe=sanitizeScenario(scenario);if(!safe){announce('The current scenario is too large or incomplete to capture.','danger');return null}
  var existing=snapshotFor(slot),summary=captureSummary(),snap={slot:slot,label:existing&&existing.label?existing.label:slot==='baseline'?'Baseline':slot==='alternative'?'Alternative':'Option 3',capturedAt:nowIso(),fingerprint:fingerprintScenario(safe,{pathCarbon:summary.pathCarbon,propertyRate:summary.propertyRate}),questionType:pro.question.type,questionFingerprint:questionFingerprint(),version:VERSION,unit:safe.unit==='imperial'?'imperial':'metric',basis:safe.thermalBasis==='rapid'?'rapid':safe.kinetics&&safe.kinetics.mode==='cct'?'cct':safe.kinetics&&safe.kinetics.mode==='ttt'?'ttt':'equilibrium',scenario:safe,summary:summary};
  pro.snapshots=pro.snapshots.filter(function(s){return s.slot!==slot});pro.snapshots.push(snap);pro.snapshots.sort(function(a,b){return SNAPSHOT_SLOTS.indexOf(a.slot)-SNAPSHOT_SLOTS.indexOf(b.slot)});saveState();
  if(pro.activeStage==='compare')renderStage('compare',false,'[data-pro-capture="'+slot+'"]');announce(snap.label+' captured without changing the active scenario.','good');return clone(snap)
}
function removeSnapshot(slot){slot=normalSlot(slot);pro.snapshots=pro.snapshots.filter(function(s){return s.slot!==slot});saveState();renderStage('compare',false,'[data-pro-capture="'+slot+'"]');announce('Comparison snapshot removed. The active scenario was not changed.','')}
function swapSnapshots(){
  var a=snapshotFor('baseline'),b=snapshotFor('alternative');if(!a||!b){announce('Capture both a baseline and an alternative before swapping them.','warn');return}
  a.slot='alternative';b.slot='baseline';pro.snapshots.sort(function(x,y){return SNAPSHOT_SLOTS.indexOf(x.slot)-SNAPSHOT_SLOTS.indexOf(y.slot)});saveState();renderStage('compare',false,'[data-pro-swap]');announce('Baseline and alternative labels were swapped. Stored scenarios and the active scenario were unchanged.','good')
}
function comparisonStatus(){
  var a=snapshotFor('baseline'),b=snapshotFor('alternative');
  if(!a||!b)return{state:'review',label:pro.snapshots.length+' of 2 required snapshots captured',detail:'Capture a baseline and alternative.'};
  if(a.version!==b.version||a.unit!==b.unit||a.basis!==b.basis||a.questionType!==b.questionType||!a.questionFingerprint||a.questionFingerprint!==b.questionFingerprint||a.questionFingerprint!==questionFingerprint())return{state:'blocked',label:'Not comparable—different basis or question',detail:'Recapture both cases using the same tool version, units, interpretation basis, and current engineering question.'};
  if(a.summary.modelStatus==='Output withheld'||b.summary.modelStatus==='Output withheld')return{state:'blocked',label:'Unavailable—one or more results were withheld',detail:'Correct the invalid model input before recapturing.'};
  if(pro.question.type==='plant-data'&&(!a.summary.recordFingerprint||!b.summary.recordFingerprint))return{state:'blocked',label:'Not comparable—thermal record trace missing',detail:'Load and recapture each thermal record so its non-reversible record fingerprint and derived metrics are retained.'};
  if(a.fingerprint===b.fingerprint&&(pro.question.type!=='plant-data'||a.summary.recordFingerprint===b.summary.recordFingerprint))return{state:'review',label:'Needs attention—cases match',detail:'Change the active assumptions or thermal record before capturing the alternative.'};
  return{state:'ready',label:'Comparison ready',detail:'Differences are directional under the same saved model basis; no option is ranked as better.'}
}

function sensitivityBaseline(input){
  if(input==='carbon')return Number(state.chem.C);
  return propertyRate()
}
function compatibleOutput(input,output){return SENSITIVITY_INPUTS.indexOf(input)>=0&&SENSITIVITY_OUTPUTS.indexOf(output)>=0}
function defaultSensitivity(input){
  var b=sensitivityBaseline(input);
  if(input==='carbon')return{low:Math.max(.02,roundValue(b-.05,3)),high:Math.min(1.2,roundValue(b+.05,3)),output:'estimated-hardness'};
  return{low:Math.max(.01,roundValue(b/2,3)),high:Math.min(1000,roundValue(b*2,3)),output:'estimated-hardness'}
}
function evaluateSensitivityPoint(input,output,value){
  if(invalidIn(['#spx-tab-chemistry']))return{value:null,status:'Output withheld',reason:'A visible chemistry input is invalid.'};
  var chemistry=clone(state.chem),rate=sensitivityBaseline('cooling-rate');if(rate==null)return{value:null,status:'Output withheld',reason:'The property cooling-rate control is invalid or unavailable.'};if(input==='carbon')chemistry.C=value;else rate=value;
  try{var p=window.__SPX.release1.propertyEstimate(chemistry,rate);if(!p||!p.valid)return{value:null,status:'Output withheld',reason:p&&p.reason?p.reason:'Property output is unavailable.'};return{value:output==='martensite'?roundValue(p.mart*100,1):roundValue(p.hv,1),status:'Calculation available — conditional',reason:'Local one-factor response under the existing property-screen assumptions.'}}catch(e){return{value:null,status:'Not evaluated',reason:'Property evaluator is unavailable.'}}
}
function runSensitivity(config){
  config=config&&typeof config==='object'?config:{};var before=currentScenario(),beforeJson=JSON.stringify(before),input=choice(config.input||pro.sensitivity.input,SENSITIVITY_INPUTS,'carbon'),output=choice(config.output||pro.sensitivity.output,SENSITIVITY_OUTPUTS,'estimated-hardness');
  if(!compatibleOutput(input,output))output='estimated-hardness';
  var defaults=defaultSensitivity(input),baseline=sensitivityBaseline(input),min=input==='carbon'?.02:.01,max=input==='carbon'?1.2:1000,low=number(own(config,'low')?config.low:pro.sensitivity.low,defaults.low,min,max),high=number(own(config,'high')?config.high:pro.sensitivity.high,defaults.high,min,max);
  if(baseline==null){announce('The current sensitivity baseline is invalid or unavailable. Correct the source control before running the screen.','danger');return null}
  if(low>baseline||high<baseline||low>=high){announce('Use a low value below or equal to baseline and a high value above or equal to baseline.','danger');return null}
  var points=[['low',low],['baseline',baseline],['high',high]],rows=points.map(function(p){var r=evaluateSensitivityPoint(input,output,p[1]);return{point:p[0],input:p[1],value:r.value,status:r.status,reason:r.reason}}),afterJson=JSON.stringify(currentScenario());
  if(beforeJson!==afterJson){announce('Sensitivity was stopped because the active scenario changed during evaluation. No result was saved.','danger');return null}
  var result={input:input,output:output,low:low,baseline:baseline,high:high,unit:output==='estimated-hardness'?'HV':'%',rows:rows,fingerprint:fingerprintScenario(before),ranAt:nowIso(),uncertaintyNote:'Directional screening estimate only; verify uncertainty sources independently.'};
  var complete=rows.every(function(r){return r.status==='Calculation available — conditional'&&r.value!=null});pro.sensitivity.input=input;pro.sensitivity.output=output;pro.sensitivity.low=low;pro.sensitivity.high=high;pro.sensitivity.result=result;saveState();if(pro.activeStage==='sensitivity')renderStage('sensitivity',false,'[data-pro-run-sensitivity]');announce(complete?'One-factor sensitivity calculated without changing the active scenario.':'Sensitivity saved as incomplete because one or more outputs were withheld. Review each reason before continuing.',complete?'good':'danger');return clone(result)
}

function definitionCurrent(){return pro.definition.chemistrySource!=='unknown'&&pro.definition.processBasis!=='unknown'&&pro.definition.reviewedFingerprint===fingerprint()}
function sensitivityCurrent(){return!!(pro.sensitivity.result&&pro.sensitivity.result.fingerprint===fingerprint()&&pro.sensitivity.result.rows.every(function(r){return r.status==='Calculation available — conditional'&&r.value!=null}))}
function reportReadiness(){
  var app=applicability(),items=[
    {label:'Case inputs reviewed',ready:definitionCurrent()},
    {label:'Primary question recorded',ready:!!(pro.question.type&&pro.question.text.trim())},
    {label:'Applicability reviewed and not withheld',ready:app.reviewed&&app.status!=='Output withheld'&&app.status!=='Not evaluated'},
    {label:'Baseline and alternative captured',ready:comparisonStatus().state==='ready'},
    {label:'Sensitivity current',ready:sensitivityCurrent()},
    {label:'Plant or test evidence recorded',ready:pro.evidence.length>0},
    {label:'Interpretation and next action recorded',ready:!!(pro.report.interpretation.trim()&&pro.report.nextAction.trim())}
  ];
  return{ready:items.every(function(i){return i.ready}),items:items}
}
function stageStatus(stage){
  if(stage==='define')return definitionCurrent()?{label:'Ready',state:'ready'}:pro.definition.caseTitle||pro.definition.materialId||pro.definition.chemistrySource!=='unknown'?{label:'In progress',state:'review'}:{label:'Not started',state:'idle'};
  if(stage==='question')return pro.question.type&&pro.question.text.trim()?{label:'Ready',state:'ready'}:pro.question.type?{label:'In progress',state:'review'}:{label:'Not started',state:'idle'};
  if(stage==='applicability'){var a=applicability();return a.status==='Output withheld'||a.reviewed&&a.status==='Not evaluated'?{label:'Needs attention',state:'blocked'}:a.reviewed&&a.status!=='Not evaluated'?{label:'Ready',state:'ready'}:{label:pro.question.type?'In progress':'Not started',state:'review'}}
  if(stage==='compare'){var c=comparisonStatus();return c.state==='ready'?{label:'Ready',state:'ready'}:c.state==='blocked'?{label:'Needs attention',state:'blocked'}:pro.snapshots.length?{label:'In progress',state:'review'}:{label:'Not started',state:'idle'}}
  if(stage==='sensitivity')return sensitivityCurrent()?{label:'Ready',state:'ready'}:pro.sensitivity.result?{label:'Needs attention',state:'blocked'}:{label:'Not started',state:'idle'};
  if(stage==='evidence')return pro.evidence.length?{label:'Ready',state:'ready'}:{label:'Not started',state:'idle'};
  var rr=reportReadiness();return rr.ready?{label:'Ready',state:'ready'}:pro.report.interpretation.trim()||pro.report.nextAction.trim()?{label:'In progress',state:'review'}:{label:'Not started',state:'idle'}
}

function addEvidence(values){
  values=values&&typeof values==='object'?values:{};var reference=text(values.reference,120).trim(),observation=text(values.observation,500).trim();
  if(!reference||!observation){announce('Reference/title and observation/result are required.','danger');return null}
  var incoming={id:text(values.id,80),type:choice(values.type,EVIDENCE_TYPES,'process'),reference:reference,date:isoDate(values.date),observation:observation,assessment:choice(values.assessment,EVIDENCE_ASSESSMENTS,'not-assessed'),createdAt:text(values.createdAt,40)||nowIso()};
  if(incoming.id){var index=pro.evidence.findIndex(function(e){return e.id===incoming.id});if(index>=0){incoming.createdAt=pro.evidence[index].createdAt||incoming.createdAt;pro.evidence[index]=incoming}else incoming.id=''}
  if(!incoming.id){if(pro.evidence.length>=20){announce('The local evidence register is limited to 20 items.','danger');return null}incoming.id='evidence-'+Date.now().toString(36)+'-'+(++evidenceSequence);pro.evidence.push(incoming)}
  editingEvidenceId='';pro.applicability.reviewedFingerprint='';saveState();if(pro.activeStage==='evidence')renderStage('evidence',false,'[data-pro-save-evidence]');announce('Evidence metadata saved locally. The tool did not verify or classify the result.','good');return clone(incoming)
}
function removeEvidence(id){pro.evidence=pro.evidence.filter(function(e){return e.id!==id});editingEvidenceId='';pro.applicability.reviewedFingerprint='';saveState();renderStage('evidence',false,'#spx-pro-evidence-reference');announce('Evidence item removed from this browser.','')}

function reportStatusClass(s){return s==='Output withheld'?'blocked':s==='Not evaluated'?'review':'limited'}
function decisionBasisText(scenario){
  var r2=scenario&&scenario.release2||{},h=r2.hard||{},a=r2.aust||{},q=r2.quench||{};
  return'Hardenability: '+(h.geometry||'—')+', '+(h.size==null?'—':h.size+' mm')+', '+(h.medium||'—')+', '+(h.agitation||'—')+', grain '+(h.grain==null?'—':h.grain)+', target '+(h.targetHV==null?'—':h.targetHV+' HV')+'; Austenitize: '+(a.temp==null?'—':roundValue(a.temp,1)+' °C')+', '+(a.hold==null?'—':a.hold+' min')+', '+(a.size==null?'—':a.size+' mm')+', '+(a.start||'—')+', '+(a.carbide||'—')+', '+(a.pinning||'—')+', heat '+(a.heatRate==null?'—':a.heatRate+' °C/min')+'; Quench: '+(q.medium||'—')+', '+(q.bath==null?'—':q.bath+' °C')+', '+(q.agitation||'—')+', '+(q.size==null?'—':q.size+' mm')+', '+(q.geometry||'—')+', delay '+(q.delay==null?'—':q.delay+' s')+', final '+(q.final==null?'—':q.final+' °C')
}
function processSummaryText(summary){if(!summary.processRows)return'No thermal record';return'Thermal trace '+(summary.recordFingerprint||'fingerprint unavailable')+', '+summary.processRows+' rows, '+(summary.processDuration==null?'duration unavailable':summary.processDuration+' s')+', '+(summary.processTempMinC==null||summary.processTempMaxC==null?'temperature range unavailable':summary.processTempMinC+'–'+summary.processTempMaxC+' °C')+', 800→500 '+(summary.processRate800500==null?'unavailable':summary.processRate800500+' °C/s')+', 500→300 '+(summary.processRate500300==null?'unavailable':summary.processRate500300+' °C/s')+', '+summary.processEvents+' candidate event(s)'}
function decisionOutputText(summary){return'Property '+(summary.estimatedHV==null?'withheld':summary.estimatedHV+' HV')+'; martensite '+(summary.martensitePct==null?'withheld':summary.martensitePct+'%')+'; austenitizing '+(summary.austStatus||'unavailable')+'; hardenability centre '+(summary.hardCenterHV==null?'withheld':summary.hardCenterHV+' HV')+'; quench centre '+(summary.quenchCenterHV==null?'withheld':summary.quenchCenterHV+' HV')+'; '+processSummaryText(summary)}
function reportHtml(){
  var scenario=currentScenario()||{},point=currentPoint(scenario),summary=captureSummary(),app=applicability(),readiness=reportReadiness(),generated=nowIso(),question=pro.question.type&&QUESTIONS[pro.question.type]?QUESTIONS[pro.question.type]:null,currentBasis=decisionBasisText(scenario);
  var chem=scenario.chem||{},chemText=Object.keys(chem).map(function(k){return esc(k)+' '+esc(roundValue(chem[k],4))}).join(' · ')||'Not available';
  var checks=app.checks.map(function(c){return'<tr><td>'+esc(c.title)+'</td><td>'+esc(c.status)+'</td><td>'+esc(c.detail)+'</td></tr>'}).join('');
  var compare=pro.snapshots.length?pro.snapshots.map(function(s){return'<tr><td>'+esc(s.label)+'<br><span class="muted">'+esc(s.fingerprint)+'</span></td><td>'+esc((s.summary.carbon==null?'—':s.summary.carbon+' wt% C')+'; '+(s.summary.phase||'phase unavailable'))+'</td><td>'+esc(decisionBasisText(s.scenario))+'</td><td>'+esc(decisionOutputText(s.summary))+'</td><td>'+esc(s.summary.modelStatus+': '+(s.summary.reason||'No reason recorded'))+'</td></tr>'}).join(''):'<tr><td colspan="5">No comparison snapshots were captured.</td></tr>';
  var sr=pro.sensitivity.result,sensitivityRows=sr?sr.rows.map(function(r){return'<tr><td>'+esc(label(r.point))+'</td><td>'+esc(r.input)+'</td><td>'+esc(r.value==null?'Withheld':r.value+' '+sr.unit)+'</td><td>'+esc(r.status)+'</td><td>'+esc(r.reason||'No reason recorded')+'</td></tr>'}).join(''):'<tr><td colspan="5">No one-factor sensitivity was run.</td></tr>';
  var evidence=pro.evidence.length?pro.evidence.map(function(e){return'<tr><td>'+esc(label(e.type))+'</td><td>'+esc(e.reference)+'</td><td>'+esc(e.date||'—')+'</td><td>'+esc(e.observation)+'</td><td>'+esc(label(e.assessment))+'</td></tr>'}).join(''):'<tr><td colspan="5">No plant or test evidence was added. Model findings remain unverified screening estimates.</td></tr>';
  var readinessRows=readiness.items.map(function(i){return'<li>'+esc(i.ready?'Recorded: ':'Missing or stale: ')+esc(i.label)+'</li>'}).join('');
  var staleSensitivity=sr&&sr.fingerprint!==fingerprint();
  var processNote=summary.processRows?processSummaryText(summary)+'. The trace fingerprint identifies this derived record for comparison but is not a security signature. The filename and raw record are not embedded, saved, or shared; this report is therefore only partially reproducible.':'No thermal record is currently loaded.';
  return'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data: blob:"><title>Steel professional screening report</title><style>body{font:14px/1.5 system-ui,sans-serif;color:#17202a;max-width:1050px;margin:auto;padding:32px}h1,h2{line-height:1.2}h2{margin-top:28px;border-bottom:2px solid #0e7490;padding-bottom:6px}table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #cfd7e3;padding:7px;text-align:left;vertical-align:top;overflow-wrap:anywhere}th{background:#eef6f8}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.box,.caution{padding:12px;border:1px solid #cfd7e3;border-radius:8px}.caution{border-left:5px solid #b54708;background:#fff8ed}.draft{color:#b42318;font-weight:800;letter-spacing:.08em}.muted{color:#52606d}footer{margin-top:34px;padding-top:14px;border-top:2px solid #17202a;font-weight:800}@media print{body{padding:0}thead{display:table-header-group}h2{break-after:avoid}.box,table{break-inside:avoid}}</style></head><body>'+
    '<p class="draft">'+(readiness.ready?'ENGINEERING SCREENING RECORD':'DRAFT — INCOMPLETE ENGINEERING SCREEN')+'</p><h1>Steel professional screening report</h1><p class="caution"><strong>Professional screening report — not a material-acceptance decision, process approval, production setpoint, or substitute for qualified engineering review.</strong></p>'+
    '<h2>Traceability</h2><div class="meta"><div class="box"><strong>Tool version</strong><br>'+esc(VERSION)+'</div><div class="box"><strong>Generated</strong><br>'+esc(generated)+'</div><div class="box"><strong>Scenario fingerprint</strong><br>'+esc(fingerprint())+'</div></div>'+
    '<h2>1. Case definition</h2><table><tbody><tr><th>Case title / ID</th><td>'+esc(pro.definition.caseTitle||'Not recorded')+'</td><th>Material / heat ID</th><td>'+esc(pro.definition.materialId||'Not recorded')+'</td></tr><tr><th>Chemistry source</th><td>'+esc(label(pro.definition.chemistrySource))+'</td><th>Process basis</th><td>'+esc(label(pro.definition.processBasis))+'</td></tr><tr><th>Context</th><td colspan="3">'+esc(pro.definition.context||'Not recorded')+'</td></tr></tbody></table>'+
    '<h2>2. Engineering question</h2><p><strong>'+esc(question?question.title:'Not selected')+'</strong></p><p>'+esc(pro.question.text||'No engineering question was recorded.')+'</p><p class="muted">'+esc(question?question.caveat:'Assign an appropriate qualified method before drawing a conclusion.')+'</p>'+
    '<h2>3. Current input snapshot</h2><table><tbody><tr><th>Display units</th><td>'+esc(scenario.unit||'metric')+'</td></tr><tr><th>Chemistry</th><td>'+chemText+'</td></tr><tr><th>Active phase point</th><td>'+esc(point?roundValue(point.c,3)+' wt% C at '+roundValue(point.t,1)+' °C; '+(summary.phase||'field unavailable'):'Not available')+'</td></tr><tr><th>Kinetic cooling input</th><td>'+esc(summary.coolingRate==null?'Not available':summary.coolingRate+' °C/s')+'</td></tr><tr><th>Path/property controls omitted by legacy scenario schema</th><td>'+esc('Path carbon '+(summary.pathCarbon==null?'not available':summary.pathCarbon+' wt% C')+'; property cooling rate '+(summary.propertyRate==null?'not available':roundValue(summary.propertyRate,3)+' °C/s')+'. Captured in this report only.')+'</td></tr><tr><th>Hardenability / heat-treatment inputs</th><td>'+esc(currentBasis)+'</td></tr><tr><th>Current screening outputs</th><td>'+esc(decisionOutputText(summary))+'</td></tr><tr><th>Question-model status</th><td>'+esc(summary.modelStatus+': '+(summary.reason||'No reason recorded'))+'</td></tr></tbody></table>'+
    '<h2>4. Applicability and validity</h2><p><strong>Overall: '+esc(app.status)+'</strong></p><table><thead><tr><th>Check</th><th>Status</th><th>Interpretation</th></tr></thead><tbody>'+checks+'</tbody></table>'+
    '<h2>5. Scenario comparison</h2><p>'+esc(comparisonStatus().label)+'. '+esc(comparisonStatus().detail)+'</p><table><thead><tr><th>Scenario / fingerprint</th><th>Material point</th><th>Decision inputs</th><th>Screening outputs</th><th>Model status / reason</th></tr></thead><tbody>'+compare+'</tbody></table>'+
    '<h2>6. Sensitivity and uncertainty</h2><p><strong>Local one-factor model response only—not a confidence interval, tolerance study, robustness study, or statistical uncertainty propagation.</strong></p>'+(staleSensitivity?'<p class="caution">Sensitivity result is stale because the current scenario changed after it was run.</p>':'')+'<table><thead><tr><th>Point</th><th>Input</th><th>Output</th><th>Status</th><th>Reason</th></tr></thead><tbody>'+sensitivityRows+'</tbody></table><p>'+esc(pro.sensitivity.uncertaintyNote||'Chemistry tolerance, temperature measurement, time/cooling-rate variation, section variation, and model-form uncertainty are not quantified.')+'</p>'+
    '<h2>7. Plant and test evidence</h2><p>'+esc(processNote)+'</p><table><thead><tr><th>Type</th><th>Reference</th><th>Date</th><th>Observation/result</th><th>User assessment</th></tr></thead><tbody>'+evidence+'</tbody></table>'+
    '<h2>8. Engineering interpretation and action</h2><p><strong>Interpretation</strong><br>'+esc(pro.report.interpretation||'Not recorded')+'</p><p><strong>Recommended next action</strong><br>'+esc(pro.report.nextAction||'Not recorded')+'</p><p><strong>Owner / due date</strong><br>'+esc(pro.report.owner||'Not assigned')+' · '+esc(pro.report.dueDate||'No date')+'</p>'+
    '<h2>9. Limitations and required verification</h2><ul><li>Equilibrium outputs do not establish kinetic products; the exact A₁ invariant does not define unique phase amounts without reaction extent.</li><li>Heating/cooling paths show equilibrium boundary crossings, not completed transformations.</li><li>Property estimates are independent of displayed TTT/CCT final fractions; generalized diagrams are not grade-specific.</li><li>Hardenability is equivalent-Jominy potential, not achieved quench response. Quench hardness and risk indices are uncalibrated and are not probabilities.</li><li>Candidate thermal arrests are screening signals; RMSE is mismatch, not uncertainty or validation.</li><li>Metallurgy-lab and reference-diagram outputs are directional, schematic, or reference artwork.</li><li>Confirm with measured heat chemistry, grade-specific data, calibrated thermal histories, geometry, hardness traverses, metallography, mechanical tests, governing requirements, and authorized engineering review.</li></ul><h3>Readiness record</h3><ul>'+readinessRows+'</ul>'+
    '<footer>Screening report—not engineering approval, product acceptance, or a qualified procedure.</footer></body></html>'
}
function downloadReport(){var html=reportHtml(),blob=new Blob([html],{type:'text/html;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='steel-professional-screening-report.html';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000);announce('Engineering screening HTML downloaded. Existing exports were unchanged.','good')}
function printReport(){var popup=null;try{popup=window.open('about:blank','_blank');if(popup)popup.opener=null}catch(e){}if(!popup){announce('Print preview was blocked. Download the HTML report and print it from your browser.','danger');return false}try{popup.document.open();popup.document.write(reportHtml());popup.document.close();popup.focus();popup.print();announce('Print view opened.','good');return true}catch(e){try{popup.close()}catch(ignore){}announce('The print view could not be opened. Download the HTML report instead.','danger');return false}}

function option(value,current,copy){return'<option value="'+esc(value)+'" '+(value===current?'selected':'')+'>'+esc(copy||label(value))+'</option>'}
function badge(copy,stateName,attrs){return'<span class="spx-pro-status" data-state="'+esc(stateName||'review')+'"'+(attrs||'')+'>'+esc(copy)+'</span>'}
function panelHead(stage,title,copy){var s=stageStatus(stage);return'<div class="spx-pro-panel-head"><div><span class="spx-pro-kicker">Step '+(STAGES.indexOf(stage)+1)+' of 7</span><h2 id="spx-professional-'+stage+'-heading" tabindex="-1">'+esc(title)+'</h2><p>'+esc(copy)+'</p></div>'+badge(s.label,s.state,' data-pro-panel-status')+'</div>'}
function summaryItem(value,caption,detail){return'<div class="spx-pro-summary-item"><b>'+esc(value)+'</b><span>'+esc(caption)+'</span>'+(detail?'<small>'+esc(detail)+'</small>':'')+'</div>'}
function activeScenarioSummary(){
  var scenario=currentScenario()||{},point=currentPoint(scenario),r2=scenario.release2||{},hard=r2.hard||{},quench=r2.quench||{},cycle=Array.isArray(scenario.cycle)?scenario.cycle:[];
  return'<div class="spx-pro-summary">'+summaryItem(roundValue(state.chem.C,3)+' wt% C','Shared chemistry carbon',pro.definition.chemistrySource==='unknown'?'Source not classified':label(pro.definition.chemistrySource))+summaryItem(point?roundValue(point.c,3)+' wt% C · '+roundValue(point.t,0)+' °C':'Unavailable','Active equilibrium point',point&&Math.abs(Number(point.c)-Number(state.chem.C))>.0005?'Different from chemistry carbon':'Aligned with chemistry carbon')+summaryItem(cycle.length+' steps','Thermal path',pro.definition.processBasis==='unknown'?'Basis not classified':label(pro.definition.processBasis))+summaryItem(hard.size?roundValue(hard.size,1)+' mm · '+label(hard.geometry):'Not available','Hardenability section',quench.medium?'Quench: '+label(quench.medium):'Quench not set')+'</div>'
}
function defineMarkup(){
  var d=pro.definition,reviewed=!!d.reviewedFingerprint,current=d.reviewedFingerprint===fingerprint();
  return panelHead('define','Define the case','Identify what is known, what is assumed, and which current tool inputs belong to this case.')+activeScenarioSummary()+(reviewed&&!current?'<div class="spx-pro-callout warn"><strong>Changed since review.</strong> The current scenario fingerprint no longer matches the reviewed inputs.</div>':'')+'<div class="spx-pro-grid two"><section class="spx-pro-card"><h3>Case context</h3><div class="spx-pro-form spx-pro-form-grid"><div class="spx-pro-field"><label for="spx-pro-case-title">Case title / ID</label><input id="spx-pro-case-title" maxlength="120" data-pro-field="definition.caseTitle" value="'+esc(d.caseTitle)+'"></div><div class="spx-pro-field"><label for="spx-pro-material-id">Material / heat ID</label><input id="spx-pro-material-id" maxlength="120" data-pro-field="definition.materialId" value="'+esc(d.materialId)+'"></div><div class="spx-pro-field"><label for="spx-pro-chem-source">Chemistry source</label><select id="spx-pro-chem-source" data-pro-field="definition.chemistrySource">'+option('unknown',d.chemistrySource,'Unknown')+option('heat-analysis',d.chemistrySource,'Heat analysis')+option('product-analysis',d.chemistrySource,'Product analysis')+option('nominal-grade',d.chemistrySource,'Nominal grade')+option('illustrative-preset',d.chemistrySource,'Illustrative preset')+'</select></div><div class="spx-pro-field"><label for="spx-pro-process-basis">Process basis</label><select id="spx-pro-process-basis" data-pro-field="definition.processBasis">'+option('unknown',d.processBasis,'Unknown')+option('actual-record',d.processBasis,'Actual record')+option('target-recipe',d.processBasis,'Target / recipe')+option('hypothetical',d.processBasis,'Hypothetical scenario')+'</select></div><div class="spx-pro-field full"><label for="spx-pro-context">Context and assumptions</label><textarea id="spx-pro-context" maxlength="1000" data-pro-field="definition.context">'+esc(d.context)+'</textarea><small class="spx-pro-field-hint">State product form, section, condition, equipment, and known gaps. Notes stay in this browser.</small></div></div></section><section class="spx-pro-card"><h3>Review the active inputs</h3><p>Open the original modules to edit values. Returning here does not reset them.</p><div class="spx-pro-actions"><button class="spx-btn" type="button" data-pro-route="chemistry">Edit chemistry</button><button class="spx-btn" type="button" data-pro-route="path">Edit thermal path</button><button class="spx-btn" type="button" data-pro-route="hardenability">Edit section</button><button class="spx-btn" type="button" data-pro-route="quenching">Edit quench</button><button class="spx-btn" type="button" data-pro-refresh>Refresh summary</button></div><div class="spx-pro-callout"><strong>Scenario fingerprint:</strong> '+esc(fingerprint())+'. This trace detects input changes; it is not a security signature.</div></section></div><div class="spx-pro-stage-actions end"><button class="spx-btn primary" type="button" data-pro-review-definition>Mark inputs reviewed &amp; continue</button></div>'
}
function questionMarkup(){
  var q=pro.question,buttons=Object.keys(QUESTIONS).map(function(id){var x=QUESTIONS[id],active=q.type===id;return'<button type="button" class="spx-pro-card '+(active?'is-selected':'')+'" data-pro-question="'+esc(id)+'" aria-pressed="'+active+'"><span class="spx-pro-kicker">'+esc(id==='other'?'Custom question':label(id))+'</span><span class="spx-pro-card-title">'+esc(x.title)+'</span><span class="spx-pro-card-copy">'+esc(x.prompt)+'</span></button>'}).join(''),selected=q.type?QUESTIONS[q.type]:null;
  return panelHead('question','Frame the engineering question','Choose one primary decision. Relevant modules are recommended without hiding any of the others.')+'<div class="spx-pro-grid">'+buttons+'</div><div class="spx-pro-card" style="margin-top:10px"><div class="spx-pro-field"><label for="spx-pro-question-text">Decision or question</label><textarea id="spx-pro-question-text" maxlength="600" data-pro-field="question.text">'+esc(q.text)+'</textarea></div>'+(selected?'<div class="spx-pro-callout warn"><strong>Interpretation limit:</strong> '+esc(selected.caveat)+'</div>':'')+'<div class="spx-pro-stage-actions between"><button class="spx-btn" type="button" data-pro-open-question '+(selected?'':'disabled')+'>Open recommended module</button><button class="spx-btn primary" type="button" data-pro-next="applicability" '+(q.type&&q.text.trim()?'':'disabled')+'>Use this question &amp; continue</button></div></div>'
}
function applicabilityMarkup(){
  var a=applicability(),rows=a.checks.map(function(c){return'<li><div class="spx-pro-check-row"><div><strong>'+esc(c.title)+'</strong><small>'+esc(c.detail)+'</small></div>'+badge(c.status,reportStatusClass(c.status))+'</div>'+(c.route?'<div class="spx-pro-actions"><button class="spx-btn" type="button" data-pro-route="'+esc(c.route)+'">Open relevant model</button></div>':'')+'</li>'}).join('');
  return panelHead('applicability','Check whether the model can answer this question','Review input provenance, numerical gates, model scope, and required verification before interpreting outputs.')+'<div class="spx-pro-form-grid"><div class="spx-pro-field"><label for="spx-pro-intended-use">Intended use</label><select id="spx-pro-intended-use" data-pro-field="applicability.intendedUse">'+option('early-screening',pro.applicability.intendedUse,'Early screening')+option('compare-alternatives',pro.applicability.intendedUse,'Compare alternatives')+option('investigation-support',pro.applicability.intendedUse,'Investigation support')+option('acceptance-decision',pro.applicability.intendedUse,'Specification or acceptance decision')+'</select></div><div class="spx-pro-card"><strong>Overall applicability</strong><div style="margin-top:6px">'+badge(a.status,reportStatusClass(a.status))+'</div><p>'+(a.reviewed?'Reviewed against the current scenario and evidence record.':'Not yet reviewed, or the case changed after review.')+'</p></div></div><ul class="spx-pro-list">'+rows+'</ul><div class="spx-pro-callout danger"><strong>Acknowledgement never overrides a block.</strong> “Calculation available” means only that the tool’s current numerical screen can return a value. It does not mean validated, compliant, safe, or plant-proven.</div><div class="spx-pro-stage-actions end"><button class="spx-btn primary" type="button" data-pro-review-applicability>Record limitations review &amp; continue</button></div>'
}
function comparisonValue(s,key,unit){var v=s.summary[key];return v==null||v===''?'—':String(v)+(unit||'')}
function compareMarkup(){
  var current=fingerprint(),currentQuestion=questionFingerprint(),currentRecord=processRecordFingerprint(),cards=SNAPSHOT_SLOTS.map(function(slot){var s=snapshotFor(slot),stale=s&&(s.fingerprint!==current||s.questionFingerprint!==currentQuestion||pro.question.type==='plant-data'&&s.summary.recordFingerprint!==currentRecord);return'<section class="spx-pro-card spx-pro-scenario"><div class="spx-pro-scenario-head"><h3>'+esc(slot==='baseline'?'Baseline':slot==='alternative'?'Alternative':'Optional third case')+'</h3>'+(s?badge(stale?'Stale—case, question, or record changed':'Captured',stale?'review':'ready'):badge('Empty','idle'))+'</div>'+(s?'<div class="spx-pro-field"><label for="spx-pro-snapshot-'+slot+'">Snapshot name</label><input id="spx-pro-snapshot-'+slot+'" maxlength="80" data-pro-snapshot-label="'+slot+'" value="'+esc(s.label)+'"></div><p><strong>'+esc(s.fingerprint)+'</strong><br>'+esc(new Date(s.capturedAt).toLocaleString())+'</p><p>'+esc(s.summary.carbon==null?'Carbon unavailable':s.summary.carbon+' wt% C')+' · '+esc(s.summary.phase||'Phase field unavailable')+' · '+esc(s.summary.modelStatus)+'</p>':'<p>Capture the current scenario here. Capture is a deep copy and never changes the active model.</p>')+'<div class="spx-pro-actions"><button class="spx-btn '+(!s&&slot!=='option3'?'primary':'')+'" type="button" data-pro-capture="'+slot+'">'+(s?'Update snapshot':'Capture current')+'</button>'+(s?'<button class="spx-btn" type="button" data-pro-remove-snapshot="'+slot+'">Remove</button>':'')+'</div></section>'}).join(''),cs=comparisonStatus(),a=snapshotFor('baseline'),b=snapshotFor('alternative'),table='';
  if(a&&b){var metrics=[['Carbon','carbon',' wt%'],['Active point carbon','pointCarbon',' wt%'],['Active point temperature','pointTempC',' °C'],['Equilibrium phase field','phase',''],['Cooling rate','coolingRate',' °C/s'],['Estimated hardness','estimatedHV',' HV'],['Estimated martensite','martensitePct','%'],['Austenitizing result','austStatus',''],['Hardenability centre','hardCenterHV',' HV'],['Quench centre','quenchCenterHV',' HV'],['Thermal-record fingerprint','recordFingerprint',''],['Thermal-record rows','processRows',''],['Thermal duration','processDuration',' s'],['Thermal minimum','processTempMinC',' °C'],['Thermal maximum','processTempMaxC',' °C'],['800→500 cooling rate','processRate800500',' °C/s'],['500→300 cooling rate','processRate500300',' °C/s'],['Candidate thermal events','processEvents','']];table='<div class="spx-pro-table-wrap" tabindex="0" role="region" aria-label="Scrollable scenario comparison"><table class="spx-pro-table"><thead><tr><th>Metric</th><th>'+esc(a.label)+'</th><th>'+esc(b.label)+'</th></tr></thead><tbody>'+metrics.map(function(m){return'<tr><th>'+esc(m[0])+'</th><td>'+esc(comparisonValue(a,m[1],m[2]))+'</td><td>'+esc(comparisonValue(b,m[1],m[2]))+'</td></tr>'}).join('')+'</tbody></table></div>'}
  return panelHead('compare','Compare scenarios','Capture frozen baseline and alternative summaries. Capture and comparison do not restore or alter the active scenario.')+'<div class="spx-pro-callout"><strong>'+esc(cs.label)+'</strong> '+esc(cs.detail)+'</div><div class="spx-pro-grid">'+cards+'</div>'+table+'<div class="spx-pro-stage-actions between"><button class="spx-btn" type="button" data-pro-swap '+(a&&b?'':'disabled')+'>Swap baseline / alternative</button><button class="spx-btn primary" type="button" data-pro-next="sensitivity">Continue to sensitivity</button></div>'
}
function sensitivityMarkup(){
  var s=pro.sensitivity,defaults=defaultSensitivity(s.input),base=sensitivityBaseline(s.input),low=s.low==null?defaults.low:s.low,high=s.high==null?defaults.high:s.high,r=s.result,stale=r&&r.fingerprint!==fingerprint(),complete=r&&r.rows.every(function(x){return x.status==='Calculation available — conditional'&&x.value!=null}),rows=r?r.rows.map(function(x){return'<tr><th>'+esc(label(x.point))+'</th><td>'+esc(x.input)+'</td><td>'+esc(x.value==null?'Withheld':x.value+' '+r.unit)+'</td><td>'+esc(x.status)+'</td><td>'+esc(x.reason||'No reason recorded')+'</td></tr>'}).join(''):'';
  return panelHead('sensitivity','Test sensitivity and document uncertainty','Vary one input through a bounded low–baseline–high screen using the existing pure property evaluator.')+'<div class="spx-pro-callout warn"><strong>Sensitivity is not uncertainty.</strong> This is a local one-factor model response, not a confidence interval, tolerance study, robustness study, or statistical uncertainty propagation.</div><div class="spx-pro-card"><div class="spx-pro-form-grid"><div class="spx-pro-field"><label for="spx-pro-sens-input">Input to vary</label><select id="spx-pro-sens-input" data-pro-sensitivity-field="input">'+option('carbon',s.input,'Carbon (wt%)')+option('cooling-rate',s.input,'Cooling rate (°C/s)')+'</select></div><div class="spx-pro-field"><label for="spx-pro-sens-output">Output to track</label><select id="spx-pro-sens-output" data-pro-sensitivity-field="output">'+option('estimated-hardness',s.output,'Estimated hardness (HV)')+option('martensite',s.output,'Estimated martensite (%)')+'</select></div><div class="spx-pro-field"><label for="spx-pro-sens-low">Low</label><input id="spx-pro-sens-low" type="number" step="any" data-pro-sensitivity-field="low" value="'+esc(low)+'"></div><div class="spx-pro-field"><label for="spx-pro-sens-baseline">Baseline (current, read only)</label><input id="spx-pro-sens-baseline" value="'+esc(base==null?'Unavailable':base)+'" readonly aria-readonly="true"></div><div class="spx-pro-field"><label for="spx-pro-sens-high">High</label><input id="spx-pro-sens-high" type="number" step="any" data-pro-sensitivity-field="high" value="'+esc(high)+'"></div><div class="spx-pro-field full"><label for="spx-pro-uncertainty">Known uncertainty sources / notes</label><textarea id="spx-pro-uncertainty" maxlength="800" data-pro-field="sensitivity.uncertaintyNote">'+esc(s.uncertaintyNote)+'</textarea><small class="spx-pro-field-hint">Consider chemistry tolerance, measurement error, cooling-rate/time variation, section variation, and model form.</small></div></div><div class="spx-pro-actions"><button class="spx-btn primary" type="button" data-pro-run-sensitivity>Run one-factor sensitivity</button><button class="spx-btn" type="button" data-pro-reset-sensitivity>Reset range</button><button class="spx-btn" type="button" data-pro-route="navigator" data-pro-target="spx-tradeoff-card">Open trade-off dashboard</button><button class="spx-btn" type="button" data-pro-route="process-data" data-pro-target="spx-r3-measure-card">Review temperature measurement</button></div></div>'+(r?'<div class="spx-pro-card" style="margin-top:10px"><div class="spx-pro-scenario-head"><h3>Directional result</h3>'+badge(stale?'Stale—scenario changed':complete?'Current':'Incomplete—output withheld',stale||!complete?'blocked':'ready')+'</div><div class="spx-pro-table-wrap" tabindex="0" role="region" aria-label="Scrollable sensitivity results"><table class="spx-pro-table"><thead><tr><th>Point</th><th>Input</th><th>Output</th><th>Status</th><th>Reason</th></tr></thead><tbody>'+rows+'</tbody></table></div></div>':'<div class="spx-pro-callout">No sensitivity result has been run for this case.</div>')+'<div class="spx-pro-stage-actions end"><button class="spx-btn primary" type="button" data-pro-next="evidence">Continue to evidence</button></div>'
}

function evidenceMarkup(){
  var editing=editingEvidenceId?pro.evidence.find(function(e){return e.id===editingEvidenceId}):null,e=editing||{id:'',type:'process',reference:'',date:'',observation:'',assessment:'not-assessed'},rows=pro.evidence.length?pro.evidence.map(function(item){return'<article class="spx-pro-evidence-item"><div class="spx-pro-evidence-head"><div><span class="spx-pro-evidence-type">'+esc(label(item.type))+'</span><h3>'+esc(item.reference)+'</h3></div>'+badge(label(item.assessment),item.assessment==='conflicts'?'blocked':item.assessment==='supports'?'ready':'review')+'</div><p>'+esc(item.observation)+'</p><small>'+esc(item.date||'No date')+' · Recorded '+esc(item.createdAt?new Date(item.createdAt).toLocaleString():'locally')+'</small><div class="spx-pro-actions"><button class="spx-btn" type="button" data-pro-edit-evidence="'+esc(item.id)+'">Edit</button><button class="spx-btn" type="button" data-pro-remove-evidence="'+esc(item.id)+'">Remove</button></div></article>'}).join(''):'<div class="spx-pro-callout warn">No plant evidence has been added. Model findings remain unverified screening estimates.</div>',data=window.__SPX.release3.getData(),file=text(state.r3&&state.r3.fileName,140),synthetic=file==='sample-cooling-data.csv';
  return panelHead('evidence','Connect plant evidence','Record what was measured or observed. You—not the tool—classify whether it supports, conflicts with, or is inconclusive relative to the model.')+'<div class="spx-pro-grid two"><section class="spx-pro-card"><h3>'+(editing?'Edit evidence item':'Add evidence item')+'</h3><form class="spx-pro-form spx-pro-form-grid" id="spx-pro-evidence-form"><input type="hidden" id="spx-pro-evidence-id" value="'+esc(e.id)+'"><div class="spx-pro-field"><label for="spx-pro-evidence-type">Evidence type</label><select id="spx-pro-evidence-type">'+EVIDENCE_TYPES.map(function(x){return option(x,e.type)}).join('')+'</select></div><div class="spx-pro-field"><label for="spx-pro-evidence-date">Date</label><input id="spx-pro-evidence-date" type="date" value="'+esc(e.date)+'"></div><div class="spx-pro-field full"><label for="spx-pro-evidence-reference">Reference / title *</label><input id="spx-pro-evidence-reference" required maxlength="120" aria-describedby="spx-pro-evidence-reference-help" value="'+esc(e.reference)+'"><small id="spx-pro-evidence-reference-help" class="spx-pro-field-hint">Required. Use a traceable certificate, heat, lot, test, image, or record reference.</small></div><div class="spx-pro-field full"><label for="spx-pro-evidence-observation">Observation / result *</label><textarea id="spx-pro-evidence-observation" required maxlength="500" aria-describedby="spx-pro-evidence-observation-help">'+esc(e.observation)+'</textarea><small id="spx-pro-evidence-observation-help" class="spx-pro-field-hint">Required. Record the measured or observed result, including units where applicable.</small></div><div class="spx-pro-field full"><label for="spx-pro-evidence-assessment">Your assessment</label><select id="spx-pro-evidence-assessment">'+option('not-assessed',e.assessment,'Not assessed')+option('supports',e.assessment,'Supports')+option('conflicts',e.assessment,'Conflicts')+option('inconclusive',e.assessment,'Inconclusive')+'</select><small class="spx-pro-field-hint">This is a user assessment, not a tool validation.</small></div><div class="spx-pro-form-actions full"><button class="spx-btn primary" type="submit" data-pro-save-evidence '+(pro.evidence.length>=20&&!editing?'disabled':'')+'>'+(editing?'Update evidence':'Add evidence')+'</button>'+(editing?'<button class="spx-btn" type="button" data-pro-cancel-evidence>Cancel</button>':'')+'</div></form></section><section class="spx-pro-card"><h3>Session thermal-data context</h3><p>'+(data.length?(synthetic?'<strong>Synthetic sample loaded:</strong> ':'<strong>User record loaded:</strong> ')+esc(file||'unnamed record')+' · '+data.length+' derived rows. This is not added as evidence automatically.':'No thermal record is loaded in this session.')+'</p><div class="spx-pro-callout warn">Raw process data and filenames are session-only and are never copied into professional local storage, saved scenarios, share links, or this report.</div><div class="spx-pro-actions"><button class="spx-btn" type="button" data-pro-route="process-data">Analyze thermal record</button><button class="spx-btn" type="button" data-pro-route="metallurgy-lab" data-pro-subpanel="metallography">Open metallography</button><button class="spx-btn" type="button" data-pro-route="metallurgy-lab" data-pro-subpanel="mechanical">Open mechanical tests</button><button class="spx-btn" type="button" data-pro-route="hardenability">Open hardenability</button></div></section></div><section class="spx-pro-evidence-list" aria-label="Evidence register">'+rows+'</section><div class="spx-pro-stage-actions end"><button class="spx-btn primary" type="button" data-pro-next="report">Continue to report</button></div>'
}
function reportMarkup(){
  var rr=reportReadiness(),app=applicability(),items=rr.items.map(function(i,index){return'<li data-pro-readiness="'+index+'"><div class="spx-pro-check-row"><strong>'+esc(i.label)+'</strong>'+badge(i.ready?'Ready':'Missing or stale',i.ready?'ready':'review',' data-pro-readiness-status')+'</div></li>'}).join('');
  return panelHead('report','Build the engineering screening report','Review the case record, write the interpretation, and export a traceable report that preserves assumptions and cautions.')+'<div class="spx-pro-grid two"><section class="spx-pro-card"><h3>Report readiness</h3><ul class="spx-pro-list">'+items+'</ul><div class="spx-pro-callout '+(app.status==='Output withheld'?'danger':'warn')+'"><strong>Applicability: '+esc(app.status)+'.</strong> Incomplete reports can still be exported, but they remain visibly marked DRAFT.</div></section><section class="spx-pro-card"><h3>Engineering record</h3><div class="spx-pro-form spx-pro-form-grid"><div class="spx-pro-field full"><label for="spx-pro-interpretation">Engineering interpretation</label><textarea id="spx-pro-interpretation" maxlength="1500" data-pro-field="report.interpretation">'+esc(pro.report.interpretation)+'</textarea></div><div class="spx-pro-field full"><label for="spx-pro-next-action">Recommended next action</label><textarea id="spx-pro-next-action" maxlength="800" data-pro-field="report.nextAction">'+esc(pro.report.nextAction)+'</textarea></div><div class="spx-pro-field"><label for="spx-pro-owner">Owner</label><input id="spx-pro-owner" maxlength="120" data-pro-field="report.owner" value="'+esc(pro.report.owner)+'"></div><div class="spx-pro-field"><label for="spx-pro-due-date">Target date</label><input id="spx-pro-due-date" type="date" data-pro-field="report.dueDate" value="'+esc(pro.report.dueDate)+'"></div></div></section></div><div class="spx-pro-stage-actions"><button class="spx-btn primary" type="button" data-pro-preview-report>Preview report</button><button class="spx-btn" type="button" data-pro-download-report>Download HTML</button><button class="spx-btn" type="button" data-pro-print-report>Print / PDF</button><button class="spx-btn" type="button" data-pro-route="learn" data-pro-target="spx-export-status">Open existing export tools</button></div><div id="spx-professional-report-preview" class="spx-pro-report-preview" hidden><div class="spx-pro-scenario-head"><h3>Report preview</h3><button class="spx-btn" type="button" data-pro-close-preview>Close preview</button></div><iframe title="Engineering screening report preview" sandbox="" referrerpolicy="no-referrer"></iframe></div><div class="spx-pro-callout danger"><strong>Screening report—not engineering approval, product acceptance, or a qualified procedure.</strong></div>'
}
function stageContent(stage){return stage==='define'?defineMarkup():stage==='question'?questionMarkup():stage==='applicability'?applicabilityMarkup():stage==='compare'?compareMarkup():stage==='sensitivity'?sensitivityMarkup():stage==='evidence'?evidenceMarkup():reportMarkup()}
function allModulesMarkup(){var modules=[['navigator','Guided start'],['equilibrium','Equilibrium diagram'],['path','Heating & cooling path'],['kinetics','TTT / CCT'],['chemistry','Chemistry & properties'],['hardenability','Hardenability'],['austenitization','Austenitization'],['quenching','Quenching'],['process-data','Process Data'],['metallurgy-lab','Metallurgy Lab'],['reference-diagrams','Reference diagrams'],['learn','Learn & export']];return'<details class="spx-pro-all-modules"><summary>All modules <small>Every original module remains available</small></summary><div class="spx-pro-grid">'+modules.map(function(m){return'<button class="spx-btn" type="button" data-pro-route="'+m[0]+'">'+esc(m[1])+'</button>'}).join('')+'</div></details>'}

function announce(message,kind){var el=document.getElementById('spx-professional-action-status');if(!el)return;el.textContent=message||'';el.dataset.kind=kind||''}
function updateShellFingerprint(){var el=document.getElementById('spx-professional-current-fingerprint');if(el)el.textContent=fingerprint()}
function updateStageStatuses(){
  STAGES.forEach(function(stage){var b=document.querySelector('#spx-professional-nav [data-professional-stage="'+stage+'"]');if(!b)return;var s=stageStatus(stage),small=b.querySelector('[data-pro-stage-status]');if(small)small.textContent=s.label;b.classList.toggle('is-complete',s.state==='ready');b.dataset.state=s.state;if(stage===pro.activeStage)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
  var current=stageStatus(pro.activeStage),panelStatus=document.querySelector('[data-professional-panel="'+pro.activeStage+'"] [data-pro-panel-status]');if(panelStatus){panelStatus.textContent=current.label;panelStatus.dataset.state=current.state}
  if(pro.activeStage==='report'){var readiness=reportReadiness();readiness.items.forEach(function(item,index){var row=document.querySelector('[data-pro-readiness="'+index+'"]'),pill=row&&row.querySelector('[data-pro-readiness-status]');if(pill){pill.textContent=item.ready?'Ready':'Missing or stale';pill.dataset.state=item.ready?'ready':'review'}})}
  updateShellFingerprint()
}
function renderStage(stage,focusHeading,focusSelector){
  stage=choice(stage,STAGES,'define');pro.activeStage=stage;
  document.querySelectorAll('[data-professional-panel]').forEach(function(panel){var active=panel.dataset.professionalPanel===stage;panel.hidden=!active;if(active){panel.removeAttribute('aria-label');panel.setAttribute('aria-labelledby','spx-professional-'+stage+'-heading');panel.innerHTML=stageContent(stage)}else{panel.removeAttribute('aria-labelledby');panel.setAttribute('aria-label',STAGE_LABELS[panel.dataset.professionalPanel])}});
  updateStageStatuses();
  var focusTarget=focusSelector?document.querySelector(focusSelector):null;if(focusTarget)focusTarget.focus();else if(focusHeading){var heading=document.getElementById('spx-professional-'+stage+'-heading');if(heading)heading.focus()}
  var activeButton=document.querySelector('#spx-professional-nav [data-professional-stage="'+stage+'"]');if(activeButton&&activeButton.scrollIntoView&&window.matchMedia&&window.matchMedia('(max-width: 760px)').matches)activeButton.scrollIntoView({block:'nearest',inline:'center'})
}
function setStage(stage,moveFocus){
  stage=choice(stage,STAGES,'define');pro.activeStage=stage;saveState();
  if(typeof window.switchTab==='function'&&(!state||state.tab!=='navigator'))window.switchTab('navigator');
  renderStage(stage,moveFocus!==false);return stage
}
function openRoute(tab,target,subpanel){
  if(tab==='navigator'){if(typeof window.switchTab==='function')window.switchTab('navigator')}else if(typeof window.switchTab==='function')window.switchTab(tab);
  if(subpanel){var button=document.querySelector('#spx-r4-subnav [data-r4-panel="'+subpanel+'"]');if(button)button.click()}
  if(target)setTimeout(function(){var el=document.getElementById(target);if(el){el.scrollIntoView({behavior:window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});if(el.tabIndex<0)el.tabIndex=-1;el.focus({preventScroll:true})}},60)
}
function writeProfessionalField(path,value,persistNow){
  if(path==='definition.caseTitle')pro.definition.caseTitle=text(value,120);
  else if(path==='definition.materialId')pro.definition.materialId=text(value,120);
  else if(path==='definition.chemistrySource')pro.definition.chemistrySource=choice(value,CHEMISTRY_SOURCES,'unknown');
  else if(path==='definition.processBasis')pro.definition.processBasis=choice(value,PROCESS_BASES,'unknown');
  else if(path==='definition.context')pro.definition.context=text(value,1000);
  else if(path==='question.text')pro.question.text=text(value,600);
  else if(path==='applicability.intendedUse')pro.applicability.intendedUse=choice(value,INTENDED_USES,'early-screening');
  else if(path==='sensitivity.uncertaintyNote')pro.sensitivity.uncertaintyNote=text(value,800);
  else if(path==='report.interpretation')pro.report.interpretation=text(value,1500);
  else if(path==='report.nextAction')pro.report.nextAction=text(value,800);
  else if(path==='report.owner')pro.report.owner=text(value,120);
  else if(path==='report.dueDate')pro.report.dueDate=isoDate(value);
  if(path.indexOf('definition.')===0)pro.definition.reviewedFingerprint='';
  if(path.indexOf('definition.')===0||path.indexOf('question.')===0||path==='applicability.intendedUse')pro.applicability.reviewedFingerprint='';
  if(persistNow)saveState();else scheduleSave()
}
function saveEvidenceFromForm(){var form=document.getElementById('spx-pro-evidence-form');if(!form)return null;if(!form.checkValidity()){var invalid=form.querySelector(':invalid');if(invalid){invalid.setAttribute('aria-invalid','true');invalid.focus()}if(form.reportValidity)form.reportValidity();announce('Complete the required evidence fields before saving.','danger');return null}return addEvidence({id:document.getElementById('spx-pro-evidence-id').value,type:document.getElementById('spx-pro-evidence-type').value,reference:document.getElementById('spx-pro-evidence-reference').value,date:document.getElementById('spx-pro-evidence-date').value,observation:document.getElementById('spx-pro-evidence-observation').value,assessment:document.getElementById('spx-pro-evidence-assessment').value})}
function resetSensitivity(){var d=defaultSensitivity(pro.sensitivity.input);pro.sensitivity.low=d.low;pro.sensitivity.high=d.high;pro.sensitivity.output=d.output;pro.sensitivity.result=null;saveState();renderStage('sensitivity',false,'[data-pro-reset-sensitivity]');announce('Sensitivity range reset around the current baseline.','')}
function previewReport(){var box=document.getElementById('spx-professional-report-preview'),frame=box&&box.querySelector('iframe');if(!box||!frame)return;frame.setAttribute('srcdoc',reportHtml());box.hidden=false;box.tabIndex=-1;box.scrollIntoView({behavior:window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});box.focus({preventScroll:true});announce('Report preview generated from the current case.','good')}
function confirmAction(message){try{return window.confirm(message)}catch(e){return false}}

function bindEvents(shell,workspace){
  var nav=document.getElementById('spx-professional-nav');
  nav.addEventListener('click',function(e){var b=e.target.closest('[data-professional-stage]');if(b)setStage(b.dataset.professionalStage,true)});
  nav.addEventListener('keydown',function(e){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].indexOf(e.key)<0)return;var buttons=Array.prototype.slice.call(nav.querySelectorAll('[data-professional-stage]')),at=buttons.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(at+((e.key==='ArrowRight'||e.key==='ArrowDown')?1:-1)+buttons.length)%buttons.length;e.preventDefault();buttons[next].focus();setStage(buttons[next].dataset.professionalStage,false)});
  shell.addEventListener('click',function(e){if(e.target.closest('[data-pro-return]'))setStage(pro.activeStage,true);if(e.target.closest('[data-pro-clear]')&&confirmAction('Clear only the local Professional workflow record? The active engineering scenario will remain unchanged.')){if(!safeRemove(STORAGE_KEY)){storageFailure=true;announce('The browser could not clear the local Professional record. No on-screen data was removed; check browser storage permissions and try again.','danger');return}storageFailure=false;pro=freshState();editingEvidenceId='';renderStage('define',false,'#spx-pro-case-title');announce('Professional workflow data cleared. The engineering scenario was not changed.','')}});
  workspace.addEventListener('input',function(e){if(e.target.required&&e.target.value.trim())e.target.removeAttribute('aria-invalid');var f=e.target.closest('[data-pro-field]');if(f){writeProfessionalField(f.dataset.proField,f.value,false);if(f.dataset.proField==='question.text'){var next=document.querySelector('[data-pro-next="applicability"]');if(next)next.disabled=!(pro.question.type&&pro.question.text.trim())}return}var name=e.target.dataset.proSnapshotLabel;if(name){var snap=snapshotFor(name);if(snap){snap.label=text(e.target.value,80);scheduleSave()}}});
  workspace.addEventListener('change',function(e){var f=e.target.closest('[data-pro-field]');if(f){writeProfessionalField(f.dataset.proField,f.value,true);if(f.dataset.proField==='applicability.intendedUse')renderStage('applicability',false,'#spx-pro-intended-use');return}var sf=e.target.dataset.proSensitivityField;if(!sf)return;if(sf==='input'){pro.sensitivity.input=choice(e.target.value,SENSITIVITY_INPUTS,'carbon');var d=defaultSensitivity(pro.sensitivity.input);pro.sensitivity.output=d.output;pro.sensitivity.low=d.low;pro.sensitivity.high=d.high;pro.sensitivity.result=null;saveState();renderStage('sensitivity',false,'#spx-pro-sens-input')}else if(sf==='output'){pro.sensitivity.output=choice(e.target.value,SENSITIVITY_OUTPUTS,'estimated-hardness');pro.sensitivity.result=null;saveState()}else{pro.sensitivity[sf]=finiteOrNull(e.target.value);pro.sensitivity.result=null;saveState()}});
  workspace.addEventListener('submit',function(e){if(e.target.id==='spx-pro-evidence-form'){e.preventDefault();saveEvidenceFromForm()}});
  workspace.addEventListener('click',function(e){
    var stage=e.target.closest('[data-pro-next]');if(stage){setStage(stage.dataset.proNext,true);return}
    var route=e.target.closest('[data-pro-route]');if(route){openRoute(route.dataset.proRoute,route.dataset.proTarget||'',route.dataset.proSubpanel||'');return}
    var question=e.target.closest('[data-pro-question]');if(question){var id=question.dataset.proQuestion,previous=QUESTIONS[pro.question.type],wasDefault=previous&&pro.question.text===previous.prompt,custom=!!(pro.question.text.trim()&&!wasDefault);pro.question.type=own(QUESTIONS,id)?id:'';if(!pro.question.text.trim()||wasDefault)pro.question.text=QUESTIONS[id].prompt;pro.applicability.reviewedFingerprint='';saveState();renderStage('question',false,'[data-pro-question="'+id+'"]');if(custom)announce('The custom question text was preserved. Review it against the newly selected model.','warn');return}
    if(e.target.closest('[data-pro-open-question]')){var q=QUESTIONS[pro.question.type];if(q)openRoute(q.route,'',q.subpanel||'');return}
    if(e.target.closest('[data-pro-review-definition]')){if(pro.definition.chemistrySource==='unknown'||pro.definition.processBasis==='unknown'){announce('Classify the chemistry source and process basis before marking the case inputs reviewed.','danger');return}pro.definition.reviewedFingerprint=fingerprint();saveState();setStage('question',true);return}
    if(e.target.closest('[data-pro-review-applicability]')){pro.applicability.reviewedFingerprint=applicabilityFingerprint();saveState();setStage('compare',true);return}
    if(e.target.closest('[data-pro-refresh]')){renderStage('define',false,'[data-pro-refresh]');announce('Current scenario summary refreshed.','good');return}
    var capture=e.target.closest('[data-pro-capture]');if(capture){captureSnapshot(capture.dataset.proCapture);return}
    var remove=e.target.closest('[data-pro-remove-snapshot]');if(remove){if(confirmAction('Remove this local comparison snapshot? The active engineering scenario will remain unchanged.'))removeSnapshot(remove.dataset.proRemoveSnapshot);return}
    if(e.target.closest('[data-pro-swap]')){swapSnapshots();return}
    if(e.target.closest('[data-pro-run-sensitivity]')){runSensitivity({input:document.getElementById('spx-pro-sens-input').value,output:document.getElementById('spx-pro-sens-output').value,low:document.getElementById('spx-pro-sens-low').value,high:document.getElementById('spx-pro-sens-high').value});return}
    if(e.target.closest('[data-pro-reset-sensitivity]')){resetSensitivity();return}
    var edit=e.target.closest('[data-pro-edit-evidence]');if(edit){editingEvidenceId=edit.dataset.proEditEvidence;renderStage('evidence',false);var input=document.getElementById('spx-pro-evidence-reference');if(input)input.focus();return}
    var removeEvidenceButton=e.target.closest('[data-pro-remove-evidence]');if(removeEvidenceButton){if(confirmAction('Remove this local evidence item? This cannot be undone.'))removeEvidence(removeEvidenceButton.dataset.proRemoveEvidence);return}
    if(e.target.closest('[data-pro-cancel-evidence]')){editingEvidenceId='';renderStage('evidence',false,'#spx-pro-evidence-reference');return}
    if(e.target.closest('[data-pro-preview-report]')){previewReport();return}
    if(e.target.closest('[data-pro-download-report]')){downloadReport();return}
    if(e.target.closest('[data-pro-print-report]')){printReport();return}
    if(e.target.closest('[data-pro-close-preview]')){var box=document.getElementById('spx-professional-report-preview');if(box){box.hidden=true;var frame=box.querySelector('iframe');if(frame)frame.removeAttribute('srcdoc')}var preview=document.querySelector('[data-pro-preview-report]');if(preview)preview.focus();return}
  })
}

function inject(){
  var tabs=tool.querySelector('.spx-tabs'),navigator=document.getElementById('spx-tab-navigator'),student=document.getElementById('spx-student-shell');if(!tabs||!navigator)return false;
  var shell=document.createElement('section');shell.id='spx-professional-shell';shell.className='spx-professional-shell';shell.setAttribute('aria-labelledby','spx-professional-shell-title');shell.innerHTML='<div class="spx-pro-shell-head"><div><span class="spx-pro-kicker">Professional decision workspace</span><h2 id="spx-professional-shell-title">Build an engineering screening case</h2><p>Define the case, test assumptions, compare options, connect plant evidence, and export a traceable report. The models and calculations are unchanged.</p></div><div class="spx-pro-shell-meta"><span class="spx-pro-pill">Local fingerprint <b id="spx-professional-current-fingerprint"></b></span><button class="spx-btn primary" type="button" data-pro-return>Return to current step</button><button class="spx-btn" type="button" data-pro-clear>Clear professional record</button></div></div><p class="spx-pro-local-note">Workflow notes and evidence metadata stay in this browser and are not encrypted. They are excluded from saved scenarios, share links, and existing exports. Switching workspace never changes your scenario.</p>';
  if(student&&student.parentNode)student.parentNode.insertBefore(shell,student.nextSibling);else tabs.parentNode.insertBefore(shell,tabs);
  var workspace=document.createElement('section');workspace.id='spx-professional-workspace';workspace.className='spx-professional-workspace spx-card';workspace.setAttribute('aria-label','Professional decision workflow');workspace.innerHTML='<div class="spx-professional-layout"><nav class="spx-pro-rail" id="spx-professional-nav" aria-label="Professional engineering workflow stages"><span class="spx-pro-rail-label">Decision workflow</span><ol class="spx-pro-rail-list">'+STAGES.map(function(stage,i){return'<li><button type="button" class="spx-pro-stage" data-professional-stage="'+stage+'"><span class="spx-pro-stage-index">'+(i+1)+'</span><span class="spx-pro-stage-copy"><strong>'+esc(STAGE_LABELS[stage])+'</strong><small data-pro-stage-status>Not started</small></span></button></li>'}).join('')+'</ol></nav><div class="spx-pro-panel-wrap"><div id="spx-professional-action-status" class="spx-pro-action-status" role="status" aria-live="polite">Professional notes are local to this browser and separate from the engineering scenario.</div>'+STAGES.map(function(stage){return'<section class="spx-pro-panel" data-professional-panel="'+stage+'" aria-label="'+esc(STAGE_LABELS[stage])+'" hidden></section>'}).join('')+allModulesMarkup()+'</div></div>';
  navigator.insertBefore(workspace,navigator.firstChild);bindEvents(shell,workspace);renderStage(pro.activeStage,false);return true
}

document.addEventListener('spx:workspace-mode',function(e){if(e.detail&&e.detail.mode==='professional'){renderStage(pro.activeStage,false);updateStageStatuses()}});
var scenarioTimer=0;function scheduleScenarioStatus(delay){clearTimeout(scenarioTimer);scenarioTimer=setTimeout(updateStageStatuses,delay)}document.addEventListener('input',function(e){if(e.target.closest&&e.target.closest('#spx-professional-workspace'))return;scheduleScenarioStatus(80)},true);document.addEventListener('change',function(e){if(e.target.closest&&e.target.closest('#spx-professional-workspace'))return;scheduleScenarioStatus(20)},true);document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('#spx-professional-workspace, #spx-professional-shell'))return;scheduleScenarioStatus(20)},true);window.addEventListener('pagehide',function(){if(textSaveTimer)saveState()});

if(!inject())return;
window.__SPX.professional={
  getState:function(){return clone(pro)},setStage:setStage,applicability:applicability,captureSnapshot:captureSnapshot,
  runSensitivity:runSensitivity,addEvidence:addEvidence,reportHtml:reportHtml,sanitizeState:sanitizeState,fingerprint:fingerprint,
  render:function(){renderStage(pro.activeStage,false)},version:VERSION
};
})();
