(function(){
'use strict';
var attempts=0,tool=document.getElementById('spx-tool');
if(!tool)return;

var modules=[
  {id:'navigator',label:'Guided start',family:'Integration',student:'Choose goals, lessons, and linked causal interpretation.',professional:'Frame the question and choose a defensible workflow.'},
  {id:'equilibrium',label:'Equilibrium diagram',family:'Foundations',student:'Identify phase fields and calculate equilibrium fractions.',professional:'Establish the equilibrium reference without claiming kinetic products.'},
  {id:'path',label:'Heating & cooling path',family:'Thermal processing',student:'Follow a cycle across critical boundaries.',professional:'Document the imposed thermal path and its assumptions.'},
  {id:'kinetics',label:'TTT / CCT',family:'Transformations',student:'Explore transformation time and cooling-rate effects.',professional:'Screen generalized transformation response and applicability.'},
  {id:'chemistry',label:'Chemistry & properties',family:'Material',student:'Connect alloy content to directional behaviour.',professional:'Screen heat chemistry, CE/Pcm, and model-domain cautions.'},
  {id:'hardenability',label:'Hardenability',family:'Heat treatment',student:'Separate hardness from depth of hardening.',professional:'Review section response at surface, quarter-depth, and centre.'},
  {id:'austenitization',label:'Austenitization',family:'Heat treatment',student:'Balance adequate austenite with overheating risk.',professional:'Review heat-through, dissolution, grain, and surface controls.'},
  {id:'quenching',label:'Quenching',family:'Heat treatment',student:'Compare hardening with distortion and cracking.',professional:'Screen quench severity, section response, and tempering trade-offs.'},
  {id:'process-data',label:'Process Data',family:'Plant evidence',student:'Read thermal records and measurement limitations.',professional:'Review provenance, sensors, chronology, rates, and candidate arrests.'},
  {id:'metallurgy-lab',label:'Metallurgy Lab',family:'Characterization',student:'Explore measurement, diffusion, testing, microscopy, casting, and rolling.',professional:'Plan traceable evidence across sampling, test method, and process route.'},
  {id:'reference-diagrams',label:'Reference diagrams',family:'Evidence',student:'Choose the correct diagram for the question.',professional:'Check material, process, section, and source applicability.'},
  {id:'learn',label:'Practice & exports',family:'Record',student:'Practise, save, share, and export.',professional:'Retain supporting scenario outputs without replacing governed reports.'}
];
var moduleById=Object.create(null);modules.forEach(function(m){moduleById[m.id]=m});

var activities={
  equilibrium:{objective:'Identify the equilibrium phase field and justify any lever-rule fractions.',predict:'Predict the field before moving the point.',change:'Change carbon or temperature one at a time.',evidence:'Record the point, boundary basis, phase field, and fraction calculation.',check:'Explain why the result does not predict rapid-cooling products.'},
  path:{objective:'Relate a heating/cooling path to equilibrium boundary crossings.',predict:'Predict which boundaries the selected cycle crosses.',change:'Change one cycle step while preserving the others.',evidence:'Record time, temperature, crossing order, and assumptions.',check:'Separate boundary crossing from transformation completion.'},
  kinetics:{objective:'Compare idealized TTT and CCT transformation response.',predict:'Predict how a faster cooling condition changes product tendency.',change:'Change only cooling rate, hold, or final temperature.',evidence:'Record diagram mode, inputs, constituent trend, and model caution.',check:'Explain why a generalized diagram is not grade qualification.'},
  chemistry:{objective:'Connect chemistry to CE/Pcm, critical temperatures, and directional properties.',predict:'Predict one benefit and one penalty of the selected alloy change.',change:'Change one element or the property cooling-rate control.',evidence:'Record chemistry, calculation versions, applicability, and observed direction.',check:'State which laboratory evidence is needed before a process decision.'},
  hardenability:{objective:'Evaluate why section location changes hardening response.',predict:'Predict the surface-to-centre response before changing diameter.',change:'Change section size or quench severity one at a time.',evidence:'Record geometry, quench basis, chemistry, and location-specific outputs.',check:'Distinguish maximum hardness from hardenability.'},
  austenitization:{objective:'Balance austenitization adequacy against grain and surface risks.',predict:'Predict the effect of more time or temperature.',change:'Change soak time or temperature while holding the other fixed.',evidence:'Record section, target, heat-through, dissolution, and risk indicators.',check:'Explain why furnace setpoint alone is insufficient.'},
  quenching:{objective:'Compare hardening benefit with distortion, cracking, and tempering consequences.',predict:'Predict both the benefit and risk of a more severe quench.',change:'Change one quench or tempering condition.',evidence:'Record geometry, medium/severity, response, and cautions.',check:'Recommend verification without turning the screen into a recipe.'},
  'process-data':{objective:'Interpret a thermal record with measurement and chronology controls.',predict:'Predict where cooling rate or a candidate arrest may change.',change:'Load an approved record or the labelled synthetic example and select a window.',evidence:'Record provenance, columns, units, sensor basis, time order, and results.',check:'Explain why a slope change is a hypothesis rather than a confirmed cause.'},
  'metallurgy-lab':{objective:'Design traceable characterization evidence for a metallurgical question.',predict:'Predict the feature or property that should change if the mechanism is true.',change:'Choose the relevant measurement, test, microscopy, or process panel.',evidence:'Record location, orientation, preparation, method, scale, and observation.',check:'Identify one alternative explanation and one confirmation test.'},
  'reference-diagrams':{objective:'Select and qualify the diagram family that answers the case question.',predict:'Choose equilibrium, TTT/CCT, quench, or tempering evidence before opening it.',change:'Compare two diagram families and their input bases.',evidence:'Record source, grade/process basis, axes, units, and applicability limits.',check:'Explain why a reference image cannot by itself approve the case.'},
  learn:{objective:'Demonstrate understanding and retain a traceable learning record.',predict:'Answer before revealing guidance.',change:'Complete one challenge and review the feedback.',evidence:'Record the question, answer, correction, and application example.',check:'State the limit of the exercise.'},
  navigator:{objective:'Build a complete chemistry-to-performance explanation.',predict:'State the expected causal chain before opening modules.',change:'Visit the minimum modules needed to test each link.',evidence:'Record assumptions, observations, conflicts, and verification needs.',check:'Separate evidence, inference, and decision.'}
};

var packs={
  chemistry:{title:'Heat chemistry screening',question:'Is this heat chemistry suitable for the intended preliminary screening question?',modules:['chemistry','kinetics','reference-diagrams'],checks:['Verified heat analysis and units','Material form and route stated','Model applicability reviewed','Grade-specific evidence identified','No specification or release claim from model output']},
  'heat-treatment':{title:'Austenitize–quench–temper review',question:'Does the proposed thermal route merit controlled plant or laboratory validation?',modules:['austenitization','hardenability','quenching','kinetics'],checks:['Section geometry and location defined','Austenite condition reviewed','Surface-to-centre response screened','Distortion/cracking controls considered','Tempering and test plan defined']},
  thermal:{title:'Thermal-record investigation',question:'What does the trace support, and what remains a measurement or mechanism hypothesis?',modules:['process-data','kinetics','reference-diagrams'],checks:['Source and chronology verified','Sensor location and method defined','Units and rate window controlled','Candidate arrests not overstated','Independent process evidence requested']},
  characterization:{title:'Microstructure and property investigation',question:'Does traceable characterization support the proposed process–structure–property mechanism?',modules:['metallurgy-lab','chemistry','process-data'],checks:['Sampling map and orientation defined','Preparation and test method controlled','Scale and measurement uncertainty recorded','Alternative mechanisms considered','Confirmation plan assigned']},
  qualification:{title:'Plant-model qualification review',question:'Is the frozen candidate supported within one pinned scope without implying specification acceptance?',modules:['chemistry','process-data','navigator'],checks:['Candidate and training fingerprints pinned','Independent new groups and protocol verified','Envelope and physical-output gates passed','Qualified authority and scope recorded','Specification acceptance remains separate']}
};

function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(ch){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
function download(name,text,type){
  var blob=new Blob([text],{type:type||'text/plain;charset=utf-8'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000)
}
function openModule(id){
  var module=moduleById[id];if(!module)return false;
  var panel=document.querySelector('[data-panel="'+id+'"]');
  if(!panel)return false;
  if(typeof window.switchTab==='function')window.switchTab(id);
  else panel.hidden=false;
  var tab=document.querySelector('.spx-tabs [data-tab="'+id+'"]');if(tab)tab.focus();
  return true
}
function buildActivity(moduleId,duration,evidence){
  var module=moduleById[moduleId]||moduleById.equilibrium,a=activities[module.id]||activities.equilibrium;
  duration=[20,45,90].indexOf(Number(duration))>=0?Number(duration):45;
  evidence=['worksheet','discussion','lab-note','report'].indexOf(evidence)>=0?evidence:'lab-note';
  return{schemaVersion:1,kind:'steel-phase-learning-activity',moduleId:module.id,module:module.label,durationMinutes:duration,evidenceType:evidence,objective:a.objective,sequence:[
    {stage:'Predict',instruction:a.predict},
    {stage:'Manipulate',instruction:a.change},
    {stage:'Observe',instruction:a.evidence},
    {stage:'Explain',instruction:'Explain the mechanism and identify the model or measurement limitation.'},
    {stage:'Check',instruction:a.check},
    {stage:'Apply',instruction:'Apply the same reasoning to a second steel, section, or process case without changing more than one comparison factor at a time.'}
  ],guardrail:'This activity uses teaching and engineering-screening estimates. It does not authorize a process, qualify a procedure, establish specification compliance, or release product.'}
}
function activityText(activity){
  return activity.module+' — '+activity.durationMinutes+' minute activity\n\nObjective\n'+activity.objective+'\n\n'+activity.sequence.map(function(s,i){return(i+1)+'. '+s.stage+': '+s.instruction}).join('\n')+'\n\nEvidence: '+activity.evidenceType+'\nGuardrail: '+activity.guardrail+'\n'
}
function buildReviewPack(id){
  var valid=Object.prototype.hasOwnProperty.call(packs,id),source=valid?packs[id]:packs.chemistry;
  return{schemaVersion:1,kind:'steel-phase-professional-review-pack',id:valid?id:'chemistry',title:source.title,question:source.question,modules:source.modules.map(function(moduleId){return{id:moduleId,label:moduleById[moduleId].label,purpose:moduleById[moduleId].professional}}),checks:source.checks.slice(),governance:{classification:'Engineering screening',acceptance:'Withheld',required:'Traceable evidence, applicability review, controlled verification, and responsible approval outside this browser tool.'}}
}
function renderCoverage(){
  var host=document.getElementById('spx-expansion-coverage');if(!host)return;
  var mode=tool.dataset.workspaceMode==='professional'?'professional':'student';
  host.innerHTML=modules.map(function(m){return'<button type="button" data-expansion-open="'+esc(m.id)+'"><span>'+esc(m.family)+'</span><strong>'+esc(m.label)+'</strong><small>'+esc(m[mode])+'</small></button>'}).join('')
}
function renderActivity(){
  var moduleId=document.getElementById('spx-activity-module').value,duration=document.getElementById('spx-activity-duration').value,evidence=document.getElementById('spx-activity-evidence').value;
  var activity=buildActivity(moduleId,duration,evidence),host=document.getElementById('spx-activity-preview');
  host.innerHTML='<h4>'+esc(activity.module)+'</h4><p><strong>Objective:</strong> '+esc(activity.objective)+'</p><ol>'+activity.sequence.map(function(s){return'<li><strong>'+esc(s.stage)+':</strong> '+esc(s.instruction)+'</li>'}).join('')+'</ol><p class="spx-expansion-guardrail">'+esc(activity.guardrail)+'</p>';
  host.dataset.activity=JSON.stringify(activity)
}
function renderPack(){
  var id=document.getElementById('spx-review-pack-select').value,pack=buildReviewPack(id),host=document.getElementById('spx-review-pack-preview');
  host.innerHTML='<h4>'+esc(pack.title)+'</h4><p><strong>Decision question:</strong> '+esc(pack.question)+'</p><ol>'+pack.modules.map(function(m){return'<li><button type="button" data-expansion-open="'+esc(m.id)+'"><strong>'+esc(m.label)+'</strong><span>'+esc(m.purpose)+'</span></button></li>'}).join('')+'</ol><ul>'+pack.checks.map(function(item){return'<li>'+esc(item)+'</li>'}).join('')+'</ul><p class="spx-expansion-guardrail"><strong>'+esc(pack.governance.classification)+':</strong> '+esc(pack.governance.required)+'</p>';
  host.dataset.pack=JSON.stringify(pack)
}
function markup(){
  return '<section class="spx-card spx-card-pad spx-release-section spx-expansion" id="spx-full-expansion" aria-labelledby="spx-expansion-title">'+
  '<div class="spx-card-title"><div><p class="spx-eyebrow">Step 8 · Complete dual-audience coverage</p><h2 id="spx-expansion-title">Every module, one connected experience</h2><p>Open any original module with role-specific purpose. The tools below create teaching and review structure; they do not change calculations, scenario inputs, governance state, or approval status.</p></div></div>'+
  '<div class="spx-expansion-coverage" id="spx-expansion-coverage"></div>'+
  '<section class="spx-expansion-tool spx-expansion-student" aria-labelledby="spx-instructor-title"><div><p class="spx-eyebrow">Student and instructor tool</p><h3 id="spx-instructor-title">Activity brief builder</h3><p>Create a Predict → Manipulate → Observe → Explain → Check → Apply activity for any module.</p></div>'+
  '<div class="spx-expansion-controls"><label>Module<select id="spx-activity-module">'+modules.filter(function(m){return m.id!=='navigator'}).map(function(m){return'<option value="'+esc(m.id)+'">'+esc(m.label)+'</option>'}).join('')+'</select></label><label>Duration<select id="spx-activity-duration"><option value="20">20 minutes</option><option value="45" selected>45 minutes</option><option value="90">90 minutes</option></select></label><label>Evidence<select id="spx-activity-evidence"><option value="lab-note">Lab note</option><option value="worksheet">Worksheet</option><option value="discussion">Discussion</option><option value="report">Short report</option></select></label></div>'+
  '<div class="spx-expansion-preview" id="spx-activity-preview" aria-live="polite"></div><div class="spx-expansion-actions"><button type="button" class="spx-btn primary" id="spx-activity-open">Open activity module</button><button type="button" class="spx-btn" id="spx-activity-download">Download activity brief</button></div></section>'+
  '<section class="spx-expansion-tool spx-expansion-professional" aria-labelledby="spx-review-pack-title"><div><p class="spx-eyebrow">Professional tool</p><h3 id="spx-review-pack-title">Engineering review packs</h3><p>Use a question-led module sequence and completion checklist without promoting a model or replacing controlled approval.</p></div>'+
  '<label class="spx-expansion-pack-select">Review pack<select id="spx-review-pack-select">'+Object.keys(packs).map(function(id){return'<option value="'+esc(id)+'">'+esc(packs[id].title)+'</option>'}).join('')+'</select></label><div class="spx-expansion-preview" id="spx-review-pack-preview" aria-live="polite"></div><div class="spx-expansion-actions"><button type="button" class="spx-btn" id="spx-review-pack-download">Download review checklist</button></div></section>'+
  '<div class="spx-note"><strong>Preservation rule:</strong> all 12 original tabs, calculations, saved/shared scenarios, URLs, exports, Step 5 calibration, Step 6 replay, and Step 7 qualification remain available and unchanged.</div></section>'
}
function bind(){
  document.getElementById('spx-expansion-coverage').addEventListener('click',function(e){var b=e.target.closest('[data-expansion-open]');if(b)openModule(b.dataset.expansionOpen)});
  ['spx-activity-module','spx-activity-duration','spx-activity-evidence'].forEach(function(id){document.getElementById(id).addEventListener('change',renderActivity)});
  document.getElementById('spx-activity-open').onclick=function(){openModule(document.getElementById('spx-activity-module').value)};
  document.getElementById('spx-activity-download').onclick=function(){var host=document.getElementById('spx-activity-preview'),activity=JSON.parse(host.dataset.activity||'{}');download('steel-phase-learning-activity.txt',activityText(activity))};
  document.getElementById('spx-review-pack-select').addEventListener('change',renderPack);
  document.getElementById('spx-review-pack-preview').addEventListener('click',function(e){var b=e.target.closest('[data-expansion-open]');if(b)openModule(b.dataset.expansionOpen)});
  document.getElementById('spx-review-pack-download').onclick=function(){var pack=buildReviewPack(document.getElementById('spx-review-pack-select').value);download('steel-phase-professional-review-pack.json',JSON.stringify(pack,null,2),'application/json')};
  document.addEventListener('spx:workspace-mode',function(){renderCoverage()})
}
function init(){
  if(!window.__SPX||!window.__SPX.release1||!window.__SPX.professional){if(attempts++<160)setTimeout(init,50);return}
  if(document.getElementById('spx-full-expansion'))return;
  var anchor=document.getElementById('spx-causal-card'),panel=document.getElementById('spx-tab-navigator');
  if(!anchor||!panel){if(attempts++<160)setTimeout(init,50);return}
  var wrap=document.createElement('div');wrap.innerHTML=markup();panel.insertBefore(wrap.firstElementChild,anchor);
  bind();renderCoverage();renderActivity();renderPack();
  window.__SPX.expansion={version:'1.0.0',modules:modules.map(function(m){return Object.assign({},m)}),buildActivity:buildActivity,buildReviewPack:buildReviewPack,openModule:openModule,render:function(){renderCoverage();renderActivity();renderPack()}}
  document.dispatchEvent(new CustomEvent('spx:expansion-ready',{detail:{version:'1.0.0'}}))
}
init()
})();