(function(){
'use strict';
var tool=document.getElementById('spx-tool');
if(!tool||typeof state==='undefined')return;

var selectedCriticalTerm='Ae';
var criticalTerms={
  Ae:'Ae denotes an equilibrium critical temperature. Ae₁ is the equilibrium eutectoid boundary; Ae₃ and Aecm bound the single-phase austenite field. These are reference conditions approached only with very slow heating or cooling.',
  Ac:'Ac denotes a critical temperature observed during heating (chauffage). Ac₁ marks the start of austenite formation; Ac₃ is the hypoeutectoid completion term, while Acm is the corresponding hypereutectoid boundary notation. Faster heating generally shifts the observed transformation upward.',
  Ar:'Ar denotes a critical temperature observed during cooling (refroidissement). Ar₃ or Arcm marks departure from the single-phase austenite field and Ar₁ is associated with lower-temperature austenite decomposition. Faster cooling generally shifts transformation downward.',
  Ms:'Ms is the temperature at which martensite begins to form during sufficiently rapid cooling. It depends strongly on chemistry and the prior austenite condition.',
  Mf:'Mf is the temperature at which the martensitic transformation is effectively complete. A generalized Mf value is not reported here because it is grade- and condition-dependent; retained austenite may remain even below an estimated Mf.'
};
var routeInfo={
  phase:{tab:'equilibrium',basis:'equilibrium',message:'Recommended workflow: open the equilibrium diagram, enter carbon and temperature, inspect the highlighted field, then reveal the tie line and lever-rule calculation in Engineer or Advanced mode.'},
  path:{tab:'path',message:'Recommended workflow: select a heat-treatment preset, edit the temperature-time steps, and scrub or play the path while comparing it with the equilibrium phase-field reference. Use TTT/CCT or Quenching for kinetic products.'},
  rapid:{tab:'kinetics',basis:'rapid',message:'Recommended workflow: use CCT mode, enter a cooling rate and final temperature, then compare predicted constituents with the equilibrium reference. Treat the result as a generalized teaching estimate.'},
  chemistry:{tab:'chemistry',message:'Recommended workflow: choose a grade preset or enter the heat chemistry, review CE/Pcm and critical temperatures, then move the cooling-rate control to see directional property changes.'},
  critical:{tab:'navigator',target:'spx-nomenclature-card',message:'Recommended workflow: compare Ae, Ac, and Ar at different heating and cooling rates, then distinguish those diffusional transformations from Ms and Mf.'},
  tradeoffs:{tab:'navigator',target:'spx-tradeoff-card',message:'Recommended workflow: move one slider at a time, identify the benefit and penalty, and apply the selected carbon and cooling rate only when you are ready to update the active scenario.'}
};
var startGoalInfo={
  'student-phases':{tab:'equilibrium',learningPath:'phases',label:'Equilibrium diagram',message:'Start by placing a carbon-temperature point, identifying the phase field, and then reading the lever-rule result.'},
  'student-cycle':{tab:'path',learningPath:'transformations',label:'Heating & cooling path',message:'Start with a preset thermal cycle, then edit one step at a time and compare each boundary crossing.'},
  'student-kinetics':{tab:'kinetics',learningPath:'transformations',label:'TTT / CCT',message:'Start with the generalized transformation diagram. Change one timing or cooling input at a time and treat the output as a learning estimate.'},
  'student-chemistry':{tab:'chemistry',learningPath:'heat-treatment',label:'Chemistry & properties',message:'Start with a grade preset, then change one alloying element at a time and observe the directional response.'},
  'student-heat-treatment':{tab:'austenitization',requires:'release2',learningPath:'heat-treatment',label:'Austenitization',message:'Start with the austenitizing window, then continue through hardenability, quenching, and tempering without resetting the scenario.'},
  'student-practice':{tab:'learn',label:'Learn & export',message:'Start with a phase-field challenge, use the boundary guide when needed, and save or export the scenario afterward.'},
  'professional-chemistry':{tab:'chemistry',label:'Chemistry & properties',message:'Enter verified heat chemistry, review model-domain cautions, then screen CE, Pcm, critical temperatures, and property trends.'},
  'professional-transformations':{tab:'kinetics',label:'TTT / CCT',message:'Review the current TTT or CCT setup and screen constituent trends without changing the selected inputs.'},
  'professional-heat-treatment':{tab:'austenitization',requires:'release2',label:'Austenitization',message:'Begin with austenitizing adequacy, then carry the same scenario through quench response and tempering trade-offs.'},
  'professional-hardenability':{tab:'hardenability',requires:'release2',label:'Hardenability',message:'Confirm chemistry, geometry, section size, prior-austenite grain number, and quench assumptions before interpreting the through-section estimate.'},
  'professional-process-data':{tab:'process-data',requires:'release3',label:'Process Data',message:'Load a time-temperature record, verify columns and units, then review cooling rate, candidate arrests, and measurement uncertainty.'},
  'professional-metallography':{tab:'metallurgy-lab',requires:'release4',subpanel:'metallography',label:'Metallography laboratory',message:'Set the relevant schematic microstructure and section orientation, then compare the visible features with verified microscopy.'}
};
var learningSteps=[
  {id:'predict',label:'Predict',summary:'State what you expect before changing the model.'},
  {id:'manipulate',label:'Manipulate',summary:'Change one input at a time.'},
  {id:'observe',label:'Observe',summary:'Compare the chart, values, and visual response.'},
  {id:'explain',label:'Explain',summary:'Connect the change to the underlying metallurgy.'},
  {id:'check',label:'Check',summary:'Answer a short question and review the feedback.'},
  {id:'apply',label:'Apply',summary:'Use the concept in a new steel or process scenario.'}
];
var learningPaths={
  phases:{
    title:'Phase Diagram Foundations',tab:'equilibrium',
    objective:'Identify an equilibrium phase field and explain how carbon and temperature move a steel across its boundaries.',
    predict:'At 0.20 wt% C and 750 °C, which equilibrium field do you expect?',
    predictionOptions:['Ferrite only','Ferrite + austenite','Austenite only'],
    manipulate:'Open the equilibrium diagram. Move one point across the A₃ boundary while keeping carbon constant.',
    explain:'A₃ separates the ferrite-plus-austenite field from single-phase austenite for hypoeutectoid steel. Temperature can change the equilibrium field even when chemistry stays constant.',
    misconception:'A phase field is an equilibrium reference; it does not by itself predict the room-temperature product after rapid cooling.',
    check:'At 0.20 wt% C and 900 °C, which equilibrium field is expected?',
    checkOptions:['Ferrite + cementite','Ferrite + austenite','Austenite'],checkAnswer:'Austenite',
    checkSuccess:'Correct. At this composition and temperature, the point is above A₃ in the single-phase austenite field.',
    checkRetry:'Not quite. Compare the temperature with A₃ for a 0.20 wt% C hypoeutectoid steel.',
    apply:'Choose a second carbon level, predict its field at 750 °C, and verify it on the diagram.'
  },
  transformations:{
    title:'Heating, Cooling & Transformation',tab:'kinetics',
    objective:'Separate equilibrium boundary crossings from transformation timing and final transformation products.',
    predict:'If the same austenitized steel cools faster, what product tendency usually increases?',
    predictionOptions:['Ferrite and pearlite','Martensite','Equilibrium cementite only'],
    manipulate:'Open TTT / CCT and change only the cooling rate. Compare the predicted constituents before changing another input.',
    explain:'Faster cooling leaves less time for diffusional ferrite and pearlite reactions. Bainite or martensite can therefore become more likely, depending on hardenability and the actual cooling path.',
    misconception:'Crossing an equilibrium line on a thermal-path plot is not proof that a kinetic transformation finished there.',
    check:'Which diagram is intended to represent transformation during continuous cooling?',
    checkOptions:['TTT','CCT','Fe–Fe₃C equilibrium diagram'],checkAnswer:'CCT',
    checkSuccess:'Correct. CCT represents continuous cooling; TTT represents an idealized isothermal hold.',
    checkRetry:'Try again. Look for the diagram whose name explicitly refers to continuous cooling.',
    apply:'Compare a slow and rapid cooling case, then explain why the predicted product mix changes.'
  },
  'heat-treatment':{
    title:'Chemistry & Heat Treatment',tab:'austenitization',requires:'release2',
    objective:'Connect chemistry, austenitizing, hardenability, quenching, and properties without confusing potential with achieved response.',
    predict:'If carbon increases while the process remains unchanged, which trade-off is most likely?',
    predictionOptions:['Lower hardness potential with better hardenability','Higher hardness potential with a growing toughness and weldability penalty','No meaningful response'],
    manipulate:'Review chemistry, then open austenitization or hardenability. Change one chemistry or process input and keep the others constant.',
    explain:'Chemistry sets transformation and hardness potential, while austenitizing and quenching determine how much of that potential is realized through the section. Section size, prior austenite, and tempering remain decisive.',
    misconception:'High surface hardness does not prove that the centre achieved the same structure or hardness.',
    check:'Which statement best separates hardness from hardenability?',
    checkOptions:['They are interchangeable','Hardness is local resistance; hardenability describes depth of hardening','Hardenability is only the surface hardness'],checkAnswer:'Hardness is local resistance; hardenability describes depth of hardening',
    checkSuccess:'Correct. Hardenability concerns the depth or distribution of hardening, not only the maximum local hardness.',
    checkRetry:'Try again. Think about why a thick section may be hard at the surface but softer at the centre.',
    apply:'Choose a section size and quench condition, then compare surface, quarter-depth, and centre response.'
  }
};
var studentAreaCopy={
  learn:['Learn steel metallurgy step by step','Follow a guided path, explore each model, and practise with feedback.'],
  explore:['Explore the metallurgy labs','Change inputs freely and inspect how the models respond.'],
  practice:['Practise with feedback','Check phase-diagram and metallography concepts using the existing activities.'],
  progress:['Continue your learning','Review completed lesson steps and labs explored on this browser.']
};
var studentPriority=['equilibrium','path','kinetics','chemistry','austenitization','learn'];
var professionalPriority=['kinetics','chemistry','hardenability','austenitization','process-data','metallurgy-lab'];
var workspaceTabs=['navigator','equilibrium','path','kinetics','chemistry','hardenability','austenitization','quenching','process-data','metallurgy-lab','reference-diagrams','learn'];

function safeLocalGet(key){try{return localStorage.getItem(key)}catch(e){return null}}
function safeLocalSet(key,value){try{localStorage.setItem(key,value)}catch(e){}}
function validWorkspaceMode(value){return value==='student'||value==='professional'}
function own(obj,key){return Object.prototype.hasOwnProperty.call(obj,key)}
function learningPathFor(id){return own(learningPaths,id)?learningPaths[id]:null}
function validLearningStep(value,fallback){var n=Number(value);return Number.isInteger(n)?clamp(n,0,learningSteps.length-1):fallback}
function firstIncompleteStep(completed){for(var i=0;i<learningSteps.length;i++)if(completed.indexOf(i)<0)return i;return learningSteps.length-1}
function freshPathProgress(){return{completed:[],prediction:'',checkAnswer:'',activeStep:0}}
function freshStudentProgress(){return{studentArea:'learn',activePath:'',activeStep:0,collapsed:false,paths:{phases:freshPathProgress(),transformations:freshPathProgress(),'heat-treatment':freshPathProgress()},visitedTabs:[]}}
function sanitizeStudentProgress(value){
  var clean=freshStudentProgress(),source=value&&typeof value==='object'?value:{};
  if(['learn','explore','practice','progress'].indexOf(source.studentArea)>=0)clean.studentArea=source.studentArea;
  if(learningPathFor(source.activePath))clean.activePath=source.activePath;
  clean.activeStep=validLearningStep(source.activeStep,0);
  clean.collapsed=source.collapsed===true;
  Object.keys(clean.paths).forEach(function(id){
    var incoming=source.paths&&source.paths[id]&&typeof source.paths[id]==='object'?source.paths[id]:{};
    clean.paths[id].completed=Array.isArray(incoming.completed)?incoming.completed.map(Number).filter(function(n,i,a){return Number.isInteger(n)&&n>=0&&n<learningSteps.length&&a.indexOf(n)===i}):[];
    clean.paths[id].prediction=typeof incoming.prediction==='string'?incoming.prediction.slice(0,240):'';
    clean.paths[id].checkAnswer=typeof incoming.checkAnswer==='string'?incoming.checkAnswer.slice(0,240):'';
    var fallback=id===clean.activePath?clean.activeStep:firstIncompleteStep(clean.paths[id].completed);
    clean.paths[id].activeStep=validLearningStep(incoming.activeStep,fallback);
  });
  if(clean.activePath)clean.activeStep=clean.paths[clean.activePath].activeStep;
  clean.visitedTabs=Array.isArray(source.visitedTabs)?source.visitedTabs.filter(function(x,i,a){return workspaceTabs.indexOf(x)>=0&&a.indexOf(x)===i}).slice(0,workspaceTabs.length):[];
  return clean;
}
function loadStudentProgress(){var raw=safeLocalGet('spx-student-progress-v1');if(!raw)return freshStudentProgress();try{return sanitizeStudentProgress(JSON.parse(raw))}catch(e){return freshStudentProgress()}}
function saveStudentProgress(){if(state.studentProgress)safeLocalSet('spx-student-progress-v1',JSON.stringify(state.studentProgress))}
function trend(value){return value<20?'Very low':value<40?'Low':value<60?'Moderate':value<80?'High':'Very high'}
function formatFractionObject(obj){return Object.keys(obj).map(function(k){return k+' '+round(pct(obj[k]),0)+'%'}).join(' · ')}
function chemistryWithCarbon(c){var x=Object.assign({},state.chem);x.C=c;return x}
function chemistryMetricsFor(x){
  var ce=x.C+x.Mn/6+(x.Cr+x.Mo+x.V)/5+(x.Ni+x.Cu)/15;
  var pcm=x.C+x.Si/30+(x.Mn+x.Cu+x.Cr)/20+x.Ni/60+x.Mo/15+x.V/10+5*x.B;
  var ms=539-423*x.C-30.4*x.Mn-17.7*x.Ni-12.1*x.Cr-7.5*x.Mo;
  /* Andrews uses +290As +6.38W here. Neither element is collected by this
     module, so both terms are zero; B must not be substituted for As. */
  var ac1=723-10.7*x.Mn-16.9*x.Ni+29.1*x.Si+16.9*x.Cr;
  /* Andrews' published term is +13.1W. W is not collected here, so it is zero. */
  var ac3=910-203*Math.sqrt(Math.max(0,x.C))-15.2*x.Ni+44.7*x.Si+104*x.V+31.5*x.Mo;
  var hard=clamp(20+55*x.C+12*x.Mn+18*x.Cr+22*x.Mo+8*x.Ni+180*x.B,0,100);
  return{ce:ce,pcm:pcm,ms:ms,ac1:ac1,ac3:ac3,hardenability:hard};
}
function propertyEstimateFor(x,rate){
  var m=chemistryMetricsFor(x),scope=dependentModelValidity(m,x.C);
  if(!scope.valid)return{valid:false,reason:scope.reason};
  var r=Math.max(.01,Number(rate)||.01),harden=m.hardenability/100,logRate=Math.log10(r);
  var martU=clamp((logRate-(1.2-1.2*harden))/2,0,1),martGate=martU*martU*(3-2*martU),martPotential=clamp(.08+.72*harden+.30*Math.max(0,x.C-.1),0,.98),mart=martGate*martPotential;
  var bainU=clamp((logRate+.5)/1.8,0,1),bainGate=bainU*bainU*(3-2*bainU),bain=clamp((1-mart)*bainGate*(.15+.35*harden)*(1-.75*martGate),0,1-mart);
  var fp=1-mart-bain;
  var hv=110+200*x.C+360*mart+110*bain+15*Math.log10(r+1);
  var uts=hv*3.15,ys=uts*(.55+.18*mart+.08*bain),elong=clamp(36-35*x.C-18*mart-8*bain,3,40);
  return{valid:true,reason:'',mart:mart,bain:bain,fp:fp,hv:hv,uts:uts,ys:ys,elong:elong};
}
function coolingSliderToRate(v){return Math.pow(10,Number(v)/25-1)}
function rateToPropertySlider(rate){return clamp(40*(Math.log10(Math.max(.1,rate))+1),0,160)}

function setExperience(mode,persist){
  if(['beginner','engineer','advanced'].indexOf(mode)<0)mode='beginner';
  state.experience=mode;
  tool.dataset.experience=mode;
  document.querySelectorAll('#spx-experience-selector [data-experience]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.experience===mode))});
  if(persist!==false)safeLocalSet('spx-experience-v1',mode);
  renderModeSummary();renderCausalChain();renderNomenclature();renderTradeoffs();
}
function renderWorkspaceNavigation(){
  var priorities=state.workspaceMode==='professional'?professionalPriority:studentPriority;
  document.querySelectorAll('.spx-tabs [data-tab]').forEach(function(tab){
    var priority=priorities.indexOf(tab.dataset.tab)>=0;
    tab.dataset.workspacePriority=tab.dataset.tab==='navigator'?'shared':priority?'recommended':'available';
    if(priority)tab.setAttribute('aria-description','Recommended in the '+(state.workspaceMode==='professional'?'Professional':'Student')+' workspace');
    else tab.removeAttribute('aria-description');
  });
}
function syncWorkspaceSelectors(mode){
  document.querySelectorAll('#spx-workspace-mode-selector [data-workspace-mode]').forEach(function(b){
    var active=b.dataset.workspaceMode===mode;b.setAttribute('aria-checked',String(active));b.tabIndex=active?0:-1;
  });
  document.querySelectorAll('#spx-start-audience-selector [data-start-audience]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.startAudience===mode))});
}
function setWorkspaceMode(mode,persist){
  mode=mode==='professional'?'professional':'student';
  state.workspaceMode=mode;state.startAudience=mode;
  tool.dataset.workspaceMode=mode;tool.dataset.startAudience=mode;
  syncWorkspaceSelectors(mode);renderWorkspaceNavigation();
  var title=$('spx-start-view-title'),description=$('spx-start-view-description');
  if(title)title.textContent=mode==='professional'?'Steel professional goals':'Student goals';
  if(description)description.textContent=mode==='professional'?'Start from a material, process, or investigation question. Results remain engineering-screening estimates.':'Build understanding with guided visuals, plain-language interpretation, and practice.';
  if(persist!==false){safeLocalSet('spx-workspace-mode-v1',mode);safeLocalSet('spx-start-audience-v1',mode)}
  renderStudentArea();renderLearningCoach();renderModeSummary();
}
function setStartAudience(audience,persist){setWorkspaceMode(audience,persist)}
function setBasis(mode,persist){
  mode=mode==='rapid'?'rapid':'equilibrium';
  state.thermalBasis=mode;
  document.querySelectorAll('#spx-basis-selector [data-basis]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.basis===mode))});
  if(mode==='rapid'){
    var currentRate=parseFloat($('spx-kin-cooling').value);if(isFinite(currentRate))state.rapidRate=clamp(currentRate,.01,1000);
    state.kinMode='cct';
    if(document.getElementById('spx-mode-cct'))$('spx-mode-cct').setAttribute('aria-pressed','true');
    if(document.getElementById('spx-mode-ttt'))$('spx-mode-ttt').setAttribute('aria-pressed','false');
    if(document.getElementById('spx-kin-cooling'))$('spx-kin-cooling').value=round(state.rapidRate||50,2);
    if(typeof renderKinetics==='function')renderKinetics();
  }
  if(persist!==false)safeLocalSet('spx-basis-v1',mode);
  renderModeSummary();renderCausalChain();
}
function renderModeSummary(){
  var box=$('spx-mode-summary');if(!box)return;
  var experience=state.experience||'beginner';
  var levelText=experience==='beginner'?'plain-language conclusions, key cautions, and minimal formulas':experience==='engineer'?'phase fractions, estimated values, operating assumptions, and engineering cautions':'model details, equations, validity limitations, and all comparison controls';
  var basisText=state.thermalBasis==='rapid'?'Rapid-cooling basis is active. The equilibrium diagram remains a reference map; expected room-temperature products must be interpreted through the kinetic model and cooling path.':'Equilibrium basis is active. Phase fields and lever-rule fractions assume sufficient time for equilibrium and do not predict bainite or martensite.';
  var workspace=state.workspaceMode==='professional'?'Professional workspace':'Student workspace';
  var workspaceText=state.workspaceMode==='professional'?'direct access to inputs, model scope, comparisons, and exports':'guided learning, grouped labs, practice, and browser-saved progress';
  box.innerHTML='<strong>'+workspace+':</strong> '+workspaceText+'. <strong>Explanation detail:</strong> '+levelText+'. <strong>Interpretation:</strong> '+basisText+' Switching workspace never changes the current scenario or calculations.';
}

function guideRoute(key){
  var info=routeInfo[key];if(!info)return;
  state.guideGoal=key;
  $('spx-guide-recommendation').innerHTML='<strong>'+info.message.split(':')[0]+':</strong>'+info.message.split(':').slice(1).join(':');
  if(state.workspaceMode==='student'&&info.tab==='navigator'&&info.target)setStudentArea('explore',false);
  if(info.basis)setBasis(info.basis);
  if(key==='rapid'){
    state.kinMode='cct';
    $('spx-mode-cct').setAttribute('aria-pressed','true');$('spx-mode-ttt').setAttribute('aria-pressed','false');
    $('spx-kin-cooling').value=round(state.rapidRate||50,2);
    renderKinetics();
  }
  switchTab(info.tab);
  if(info.target){setTimeout(function(){var el=$(info.target);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},60)}
}
function startGoalReady(info){return document.querySelector('[data-panel="'+info.tab+'"]')&&(!info.requires||(window.__SPX&&window.__SPX[info.requires]))}
function openStartGoal(key,attempt){
  var info=startGoalInfo[key];if(!info)return;
  attempt=Number(attempt)||0;state.guideGoal=key;
  var recommendation=$('spx-guide-recommendation');
  if(!startGoalReady(info)){
    if(recommendation)recommendation.innerHTML='<strong>Loading '+info.label+'&hellip;</strong> Your current scenario will be preserved.';
    if(attempt<100)setTimeout(function(){openStartGoal(key,attempt+1)},50);
    else if(recommendation)recommendation.innerHTML='<strong>Unable to open '+info.label+'.</strong> Use its module tab after the workspace finishes loading.';
    return;
  }
  if(state.workspaceMode==='student'&&info.learningPath)beginLearningPath(info.learningPath,false);
  if(recommendation)recommendation.innerHTML='<strong>Opened '+info.label+':</strong> '+(info.message||'Continue with the current scenario and use the module tabs whenever you want to change tasks.');
  switchTab(info.tab);
  if(info.subpanel){var selector=document.querySelector('#spx-r4-subnav [data-r4-panel="'+info.subpanel+'"]');if(selector)selector.click()}
  if(info.target)setTimeout(function(){var target=$(info.target);if(target&&typeof target.scrollIntoView==='function')target.scrollIntoView({behavior:'smooth',block:'start'})},60);
  if(info.focusTab)setTimeout(function(){var tab=document.querySelector('.spx-tabs [data-tab="'+info.tab+'"]');if(tab)tab.focus()},0);
}
function openStartShortcut(tab,label,requires,details){
  details=details||{};
  var key='shortcut-'+tab,info={tab:tab,label:label,requires:requires||'',subpanel:details.subpanel||'',target:details.target||'',focusTab:details.focusTab===true,message:'Continue with the current scenario; no inputs or results were reset.'};startGoalInfo[key]=info;openStartGoal(key,0);
}

function pathState(id){
  if(!state.studentProgress)state.studentProgress=freshStudentProgress();
  if(!state.studentProgress.paths[id])state.studentProgress.paths[id]=freshPathProgress();
  return state.studentProgress.paths[id];
}
function setActiveLearningStep(index){
  if(!state.studentProgress)return;
  var step=validLearningStep(index,0),id=state.studentProgress.activePath;
  state.studentProgress.activeStep=step;
  if(learningPathFor(id))pathState(id).activeStep=step;
}
function pathProgressText(id){
  var completed=pathState(id).completed.length;
  return completed===learningSteps.length?'Complete':completed?completed+' of '+learningSteps.length+' steps complete':'Not started';
}
function renderStudentArea(){
  if(!state.studentProgress)return;
  var area=['learn','explore','practice','progress'].indexOf(state.studentProgress.studentArea)>=0?state.studentProgress.studentArea:'learn';
  state.studentArea=area;tool.dataset.studentArea=area;
  document.querySelectorAll('#spx-student-nav [data-student-area]').forEach(function(b){
    if(b.dataset.studentArea===area)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-student-area-panel]').forEach(function(panel){panel.hidden=panel.dataset.studentAreaPanel!==area});
  var copy=studentAreaCopy[area]||studentAreaCopy.learn;
  if($('spx-student-shell-title'))$('spx-student-shell-title').textContent=copy[0];
  if($('spx-student-shell-description'))$('spx-student-shell-description').textContent=copy[1];
  Object.keys(learningPaths).forEach(function(id){
    document.querySelectorAll('[data-path-progress="'+id+'"]').forEach(function(el){el.textContent=pathProgressText(id)});
  });
  var active=learningPathFor(state.studentProgress.activePath),current=$('spx-progress-current'),resume=$('spx-progress-continue');
  if(current)current.textContent=active?'Continue '+active.title+' at '+learningSteps[state.studentProgress.activeStep].label+'. '+pathProgressText(state.studentProgress.activePath)+'.':'No learning activity yet. Choose a path to begin.';
  if(resume){resume.disabled=!active;resume.textContent=state.studentProgress.collapsed?'Continue lesson':'Review current lesson'}
  if($('spx-progress-paths'))$('spx-progress-paths').innerHTML=Object.keys(learningPaths).map(function(id){return'<div class="spx-progress-row"><span>'+learningPaths[id].title+'</span><strong>'+pathProgressText(id)+'</strong></div>'}).join('');
  if($('spx-progress-visited')){
    var visited=state.studentProgress.visitedTabs||[];
    $('spx-progress-visited').textContent=visited.length?visited.length+' lab'+(visited.length===1?'':'s')+' explored: '+visited.map(function(id){var b=document.querySelector('.spx-tabs [data-tab="'+id+'"]');return b?b.textContent.trim():id}).join(', ')+'.':'No labs visited yet.';
  }
}
function setStudentArea(area,moveFocus){
  if(['learn','explore','practice','progress'].indexOf(area)<0)area='learn';
  if(!state.studentProgress)state.studentProgress=freshStudentProgress();
  state.studentProgress.studentArea=area;saveStudentProgress();renderStudentArea();
  if(moveFocus!==false){
    if(state.tab!=='navigator')switchTab('navigator');
    setTimeout(function(){var panel=document.querySelector('[data-student-area-panel="'+area+'"]'),heading=panel&&panel.querySelector('h2');if(heading){heading.tabIndex=-1;heading.focus()}},0);
  }
}
function recordStudentVisit(tab){
  if(state.workspaceMode!=='student'||!tab||tab==='navigator'||!state.studentProgress)return;
  var visited=state.studentProgress.visitedTabs||[];if(visited.indexOf(tab)>=0)return;
  visited.push(tab);state.studentProgress.visitedTabs=visited.slice(-24);saveStudentProgress();
}
function openStudentRoute(button){
  var tab=button.dataset.studentRoute;if(!tab)return;
  var label=(button.querySelector('strong')||button).textContent.trim(),requires=button.dataset.requires||'';
  if(tab==='navigator')setStudentArea('explore',false);
  openStartShortcut(tab,label,requires,{subpanel:button.dataset.subpanel||'',target:button.dataset.studentTarget||''});
}
function beginLearningPath(id,openActivity){
  var path=learningPathFor(id);if(!path)return;
  if(!state.studentProgress)state.studentProgress=freshStudentProgress();
  state.studentProgress.activePath=id;
  setActiveLearningStep(pathState(id).activeStep);
  state.studentProgress.collapsed=false;saveStudentProgress();renderStudentArea();renderLearningCoach();
  if(openActivity)openStartShortcut(path.tab,path.title,path.requires||'');
}
function lessonObservation(id){
  try{
    if(id==='phases'){
      var p=activePoint(),f=phaseFractions(p.c,p.t);
      return 'Active point P'+p.id+' is '+fmt(p.c,3)+' wt% C at '+fmtT(p.t)+'. The equilibrium field is '+f.region.label+'.';
    }
    if(id==='transformations'){
      var validity=typeof kineticsValidity==='function'?kineticsValidity():{valid:true,reason:''};
      if(!validity.valid)return (state.kinMode==='cct'?'CCT':'TTT')+' quantitative constituent result unavailable: '+validity.reason;
      var fractions=kineticsFractions();
      return (state.kinMode==='cct'?'CCT':'TTT')+' view currently estimates '+formatFractionObject(fractions)+'. Compare this kinetic result with the equilibrium reference.';
    }
    var metrics=chemMetrics(),scope=dependentModelValidity(metrics,state.chem.C),formulaLabel=scope.valid?'':'raw-formula ';
    if(!scope.valid)return 'Current chemistry gives '+formulaLabel+'CE IIW '+metrics.ce.toFixed(3)+' and '+formulaLabel+'Pcm '+metrics.pcm.toFixed(3)+'. Ms unavailable — '+scope.reason;
    return 'Current chemistry gives CE IIW '+metrics.ce.toFixed(3)+', Pcm '+metrics.pcm.toFixed(3)+', and an estimated Ms of '+fmtT(metrics.ms)+'. These are screening calculations, not acceptance values.';
  }catch(e){return 'Open the linked lab and change one input. Return here to compare the updated chart and calculated values.'}
}
function learningStageMarkup(id,index){
  var path=learningPaths[id],saved=pathState(id),step=learningSteps[index];
  if(step.id==='predict')return'<h3 tabindex="-1">Before you move anything</h3><p>'+path.predict+'</p><fieldset class="spx-learning-choices"><legend>Lock in a prediction</legend>'+path.predictionOptions.map(function(option,i){return'<label><input type="radio" name="spx-learning-prediction" value="'+i+'" '+(saved.prediction===option?'checked':'')+'> <span>'+option+'</span></label>'}).join('')+'</fieldset>';
  if(step.id==='manipulate')return'<h3 tabindex="-1">Test your prediction</h3><p>'+path.manipulate+'</p><button class="spx-btn" type="button" data-learning-open>Open interactive lab</button>';
  if(step.id==='observe')return'<h3 tabindex="-1">What changed?</h3><p>'+lessonObservation(id)+'</p><div class="spx-note"><strong>Observation rule:</strong> compare what changed with what remained constant before drawing a conclusion.</div>';
  if(step.id==='explain')return'<h3 tabindex="-1">Why it changed</h3><p>'+path.explain+'</p><div class="spx-learning-misconception"><strong>Common misconception</strong><span>'+path.misconception+'</span></div>';
  if(step.id==='check')return'<h3 tabindex="-1">Try one on your own</h3><p>'+path.check+'</p><fieldset class="spx-learning-choices"><legend>Choose the best answer</legend>'+path.checkOptions.map(function(option,i){return'<label><input type="radio" name="spx-learning-check" value="'+i+'" '+(saved.checkAnswer===option?'checked':'')+'> <span>'+option+'</span></label>'}).join('')+'</fieldset>';
  return'<h3 tabindex="-1">Use it in an engineering situation</h3><p>'+path.apply+'</p><button class="spx-btn" type="button" data-learning-open>Open the lab with my current scenario</button>';
}
function renderLearningCoach(focusStage){
  var coach=$('spx-learning-coach');if(!coach||!state.studentProgress)return;
  var id=state.studentProgress.activePath,path=learningPathFor(id);
  coach.hidden=state.workspaceMode!=='student'||!path||state.studentProgress.collapsed;
  if(coach.hidden)return;
  var stepIndex=clamp(Number(state.studentProgress.activeStep)||0,0,learningSteps.length-1),saved=pathState(id),completed=saved.completed.length;
  setActiveLearningStep(stepIndex);
  $('spx-learning-path-label').textContent='Learn / '+path.title;
  $('spx-learning-title').textContent=learningSteps[stepIndex].label;
  $('spx-learning-objective').textContent=path.objective;
  $('spx-learning-progress-label').textContent='Step '+(stepIndex+1)+' of '+learningSteps.length;
  $('spx-learning-progress-count').textContent=completed+' of '+learningSteps.length+' complete';
  var track=coach.querySelector('[role="progressbar"]');track.setAttribute('aria-valuenow',String(completed));track.setAttribute('aria-valuetext',completed+' of '+learningSteps.length+' steps complete');
  $('spx-learning-progress-bar').style.width=(completed/learningSteps.length*100)+'%';
  $('spx-learning-steps').innerHTML=learningSteps.map(function(step,i){var done=saved.completed.indexOf(i)>=0,current=i===stepIndex;return'<li><button type="button" data-learning-step="'+i+'" class="'+(done?'is-complete ':'')+(current?'is-current':'')+'" '+(current?'aria-current="step"':'')+' aria-label="Step '+(i+1)+' of '+learningSteps.length+': '+step.label+', '+(done?'complete':current?'current':'not started')+'"><span>'+(i+1)+'</span><strong>'+step.label+'</strong><small>'+step.summary+'</small><em>'+(done?'Complete':current?'Current':'Not started')+'</em></button></li>'}).join('');
  $('spx-learning-stage').innerHTML=learningStageMarkup(id,stepIndex);
  $('spx-learning-previous').disabled=stepIndex===0;$('spx-learning-next').disabled=stepIndex===learningSteps.length-1;
  $('spx-learning-primary').textContent=['Record prediction','I’ve explored this','Explain the change','Check my understanding','Continue to apply','Complete lesson'][stepIndex];
  var status=$('spx-learning-status');
  if(stepIndex===0)status.textContent=saved.prediction?'Prediction recorded: '+saved.prediction+'.':'Choose an answer to record your prediction.';
  else if(stepIndex===4&&saved.checkAnswer)status.textContent=saved.checkAnswer===path.checkAnswer?path.checkSuccess:path.checkRetry;
  else if(saved.completed.indexOf(stepIndex)>=0)status.textContent=learningSteps[stepIndex].label+' is complete. You can review it or continue.';
  else status.textContent=learningSteps[stepIndex].summary;
  if(focusStage){var heading=$('spx-learning-stage').querySelector('h3');if(heading)heading.focus()}
}
function moveLearningStep(delta){
  if(!state.studentProgress||!learningPathFor(state.studentProgress.activePath))return;
  setActiveLearningStep(clamp(state.studentProgress.activeStep+delta,0,learningSteps.length-1));saveStudentProgress();renderLearningCoach(true);renderStudentArea();
}
function completeLearningStep(){
  var id=state.studentProgress&&state.studentProgress.activePath,path=learningPathFor(id);if(!path)return;
  var index=state.studentProgress.activeStep,saved=pathState(id),status=$('spx-learning-status');
  if(index===0&&!saved.prediction){status.textContent='Choose a prediction before continuing. Your answer will be kept for reflection.';return}
  if(index===4&&!saved.checkAnswer){status.textContent='Choose an answer before continuing. You can retry after reviewing the feedback.';return}
  if(saved.completed.indexOf(index)<0)saved.completed.push(index);
  saved.completed.sort(function(a,b){return a-b});
  if(index<learningSteps.length-1)setActiveLearningStep(index+1);else setActiveLearningStep(index);
  saveStudentProgress();renderStudentArea();renderLearningCoach(index<learningSteps.length-1);
  if(index===learningSteps.length-1)$('spx-learning-status').textContent='Lesson complete. Review any step, practise the topic, or explore the lab with your current scenario.';
}

function weldabilityText(ce){return ce<.4?'generally favourable':ce<.5?'moderate preheat sensitivity':'elevated hydrogen-cracking sensitivity'}
function renderCausalChain(){
  if(!$('spx-causal-chain'))return;
  var p=activePoint(),x=state.chem,m=chemMetrics(),scope=dependentModelValidity(m,x.C),basis=state.thermalBasis||'equilibrium',rate=state.rapidRate||50,propertyEligible=scope.valid,propertyUnavailable='Property estimate unavailable: '+scope.reason;
  var mismatch=Math.abs(x.C-p.c)>.02;
  var process,micro,microText,property,performance,summary;
  if(basis==='rapid'){
    var kinValid=typeof kineticsValidity==='function'?kineticsValidity():{valid:true,inputs:{rate:rate,finalT:kineticsInputC('spx-kin-final',25)}},rapidInputs=kinValid.inputs||{},pr=kinValid.valid&&propertyEligible?propertyEstimateFor(x,rapidInputs.rate):null;
    micro=kinValid.valid?kineticsFractions():{};
    microText=kinValid.valid?formatFractionObject(micro):'Constituent fractions unavailable because the rapid-cooling inputs or model scope are invalid.';
    process=kinValid.valid?(state.kinMode==='ttt'?'Idealized transfer and isothermal hold':'Continuous cooling')+' at approximately '+round(rapidInputs.rate,2)+' °C/s to '+fmtT(rapidInputs.finalT)+'.':'Rapid-cooling process unavailable: '+kinValid.reason;
    property=!kinValid.valid?'Property estimate unavailable because the rapid-cooling inputs are invalid: '+kinValid.reason:propertyEligible?'Chemistry/rate-only directional screen: '+Math.round(pr.hv-25)+'–'+Math.round(pr.hv+25)+' HV, '+Math.round(pr.uts*.9)+'–'+Math.round(pr.uts*1.1)+' MPa UTS, and '+Math.round(Math.max(2,pr.elong-3))+'–'+Math.round(pr.elong+3)+'% elongation. These property ranges are not recalculated from the displayed final-temperature constituent fractions.':propertyUnavailable;
    performance=kinValid.valid?'The transformation panel predicts '+formatFractionObject(micro)+'. Hardness, ductility, and distortion still depend on the actual section cooling history, prior austenite, and subsequent tempering.':'The constituent prediction is withheld: '+kinValid.reason;
    summary=kinValid.valid?'<strong>Rapid-cooling interpretation:</strong> the displayed path trends toward '+formatFractionObject(micro)+'. This is a generalized kinetic estimate, not an equilibrium phase fraction.':'<strong>Rapid-cooling interpretation unavailable:</strong> '+kinValid.reason;
  }else{
    var pf=phaseFractions(p.c,p.t),fm=finalMicro(p.c),slow=propertyEligible?propertyEstimateFor(x,.2):null;
    micro=pf.fractions;
    microText=Object.keys(micro).length?formatFractionObject(micro):'Invariant phase proportions unavailable: reaction extent is required to resolve α, γ, and Fe₃C amounts on the exact A₁ isotherm.';
    process='Equilibrium reference at '+fmtT(p.t)+' for P'+p.id+', followed conceptually by slow cooling to room temperature.';
    property=propertyEligible?'Slow-cooling directional estimate: '+Math.round(slow.hv-25)+'–'+Math.round(slow.hv+25)+' HV and '+Math.round(slow.uts*.9)+'–'+Math.round(slow.uts*1.1)+' MPa UTS.':propertyUnavailable;
    performance='The equilibrium field is '+pf.region.short+'. A slow-cooled room-temperature estimate is '+formatFractionObject(fm)+(scope.valid?', with weldability '+weldabilityText(m.ce)+'.':'. Weldability interpretation is unavailable: '+scope.reason);
    summary='<strong>Equilibrium interpretation:</strong> P'+p.id+' lies in <strong>'+pf.region.label+'</strong> at '+fmt(p.c,3)+' wt% C and '+fmtT(p.t)+'. Slow cooling is estimated to produce '+formatFractionObject(fm)+'.';
  }
  $('spx-causal-summary').innerHTML=summary;
  var stages=[
    ['1. Chemistry','What the steel contains','C '+fmt(x.C,3)+'%, Mn '+fmt(x.Mn,2)+'%, Cr '+fmt(x.Cr,2)+'%.<ul><li>CE IIW '+m.ce.toFixed(3)+(scope.valid?'':' (raw formula only)')+'</li><li>Pcm '+m.pcm.toFixed(3)+(scope.valid?'':' (raw formula only)')+'</li><li>Hardenability index '+(scope.valid?Math.round(m.hardenability)+'/100':'unavailable — '+scope.reason)+'</li></ul>'],
    ['2. Process','What the steel experiences',process+'<ul><li>Active point P'+p.id+': '+fmt(p.c,3)+'% C</li><li>Temperature '+fmtT(p.t)+'</li><li>Basis: '+(basis==='rapid'?'rapid cooling':'equilibrium')+'</li></ul>'],
    ['3. Microstructure','What forms',microText+'<ul><li>Shape, size, distribution, and prior grain condition are not fully represented.</li></ul>'],
    ['4. Properties','How it responds',property+'<ul class="spx-engineer-only"><li>Grain size, section thickness, tempering, inclusions, and test orientation can move the result substantially.</li></ul>'],
    ['5. Performance','What it means',performance+'<ul><li>Verify against grade-specific data and actual testing before process or disposition decisions.</li></ul>']
  ];
  $('spx-causal-chain').innerHTML=stages.map(function(s){return'<article class="spx-causal-stage"><span class="spx-stage-kicker">'+s[0]+'</span><h3>'+s[1]+'</h3><p>'+s[2]+'</p></article>'}).join('');
  var caution=mismatch?'The active phase-diagram point uses '+fmt(p.c,3)+' wt% C, while the chemistry model uses '+fmt(x.C,3)+' wt% C. Align the two values before comparing equilibrium and property outputs. ':'The active point carbon and chemistry-model carbon are aligned within 0.02 wt%. ';
  $('spx-causal-caution').innerHTML='<strong>Analysis caution:</strong> '+caution+'The chain describes direction and causality; it does not replace measured microstructure, cooling curves, or mechanical testing.';
}

function criticalPosition(t){return clamp(t/1000*100,0,100)}
function criticalRow(label,t,description){return'<div class="spx-critical-row"><strong>'+label+'</strong><div class="spx-critical-track"><i class="spx-critical-marker" style="left:'+criticalPosition(t)+'%"></i></div><span class="spx-critical-value">'+fmtT(t)+' · '+description+'</span></div>'}
function renderNomenclature(){
  if(!$('spx-critical-plot'))return;
  var heat=Number($('spx-heating-rate').value)||40,cool=Number($('spx-cooling-rate-coach').value)||120,m=chemMetrics();
  var heatShift=3+7*Math.log10(Math.max(1,heat)),coolShift=8+16*Math.log10(Math.max(1,cool));
  var c=clamp(state.chem.C,CFG.cMin,CFG.cMax),hyper=c>CFG.eutectoid.c,completion=austeniteCompletionReference(m,c);
  var ae1=bounds.A1,aeUpper=hyper?bounds.Acm(c):bounds.A3(c),ac1=m.ac1+heatShift,acUpper=(hyper?aeUpper:m.ac3)+1.15*heatShift,ar1=ae1-coolShift,arUpper=aeUpper-.85*coolShift;
  var scope=dependentModelValidity(m,c),aeLabel=hyper?'Aecm*':'Ae₃*',acLabel=hyper?'Acm*':'Ac₃*',arLabel=hyper?'Arcm*':'Ar₃*';
  $('spx-heating-rate-label').textContent=Math.round(heat)+' °C/min';
  $('spx-cooling-rate-coach-label').textContent=Math.round(cool)+' °C/min';
  $('spx-critical-chemistry').textContent='C '+fmt(state.chem.C,3)+'%, Mn '+fmt(state.chem.Mn,2)+'%, Cr '+fmt(state.chem.Cr,2)+'%';
  $('spx-critical-plot').innerHTML=criticalRow('Ae₁*',ae1,'equilibrium eutectoid reference')+criticalRow(aeLabel,aeUpper,'equilibrium upper boundary')+(scope.valid?criticalRow('Ac₁*',ac1,'illustrative heating-start estimate')+criticalRow('Ar₁*',ar1,'illustrative cooling estimate')+criticalRow(acLabel,acUpper,'illustrative heating-completion estimate')+criticalRow(arLabel,arUpper,'illustrative cooling-start estimate')+criticalRow('Ms',m.ms,'martensite-start estimate'):'<div class="spx-note"><strong>Ac, Ar, and Ms estimates unavailable:</strong> '+scope.reason+'</div>');
  document.querySelectorAll('[data-critical-term]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.criticalTerm===selectedCriticalTerm))});
  $('spx-nomenclature-explanation').innerHTML='<strong>'+selectedCriticalTerm+':</strong> '+criticalTerms[selectedCriticalTerm];
  $('spx-critical-model-note').textContent='Teaching approximation: heating shift = 3 + 7log₁₀(rate); cooling shift = 8 + 16log₁₀(rate). Ae₁, Ae₃, and Aecm are equilibrium references; Ac₁/Ac₃ and all rate shifts are empirical or illustrative. The shifts are not process set points.';
}

function tradeModel(){
  var c=Number($('spx-trade-carbon').value),rate=coolingSliderToRate($('spx-trade-cooling').value),superheat=Number($('spx-trade-superheat').value),temper=Number($('spx-trade-temper').value);
  var x=chemistryWithCarbon(c),m=chemistryMetricsFor(x),scope=dependentModelValidity(m,c);
  if(!scope.valid)return{valid:false,reason:scope.reason,c:c,rate:rate,superheat:superheat,temper:temper,ce:m.ce};
  var cn=clamp((c-.05)/.95,0,1),rn=clamp((Math.log10(rate)+1)/4,0,1),sn=clamp(superheat/180,0,1),tn=clamp((temper-100)/550,0,1);
  var alloy=clamp((x.Mn*.15+x.Cr*.25+x.Mo*.35+x.Ni*.1+x.B*1000*.15)/1.5,0,1);
  var mart=100*clamp(.05+.55*rn+.30*cn+.20*alloy,0,1);
  var hardness=100*clamp(.15+.45*cn+.35*mart/100-.25*tn,0,1);
  var toughness=100*clamp(.85-.35*cn-.30*mart/100-.20*sn+.30*tn,0,1);
  var ductility=100*clamp(.88-.42*cn-.25*mart/100+.22*tn,0,1);
  var weldability=100*clamp(1-(m.ce-.25)/.55,0,1);
  var retained=100*clamp(Math.max(0,(c-.45)/.55)*.55+mart/100*.25+sn*.20,0,1);
  var grain=100*clamp(sn*.80+(superheat>80?.12:0),0,1);
  var crack=100*clamp(.08+.34*mart/100+.25*cn+.20*rn+.15*grain/100-.20*tn,0,1);
  var relief=100*clamp((temper-100)/500,0,1);
  return{valid:true,reason:'',c:c,rate:rate,superheat:superheat,temper:temper,ce:m.ce,mart:mart,hardness:hardness,toughness:toughness,ductility:ductility,weldability:weldability,retained:retained,grain:grain,crack:crack,relief:relief};
}
function scoreCard(label,value,meaning){
  return'<article class="spx-trade-result"><strong>'+label+'<span>'+trend(value)+'</span></strong><div class="spx-score-track"><i style="width:'+clamp(value,0,100)+'%"></i></div><p>'+meaning+'</p></article>';
}
function renderTradeoffs(){
  if(!$('spx-trade-results'))return;
  var t=tradeModel();
  $('spx-trade-carbon-label').textContent=t.c.toFixed(2)+'%';$('spx-trade-cooling-label').textContent=round(t.rate,2)+' °C/s';$('spx-trade-superheat-label').textContent=Math.round(t.superheat)+' °C';$('spx-trade-temper-label').textContent=Math.round(t.temper)+' °C';
  if(!t.valid){$('spx-trade-results').innerHTML='<div class="spx-note"><strong>Trade-off outputs unavailable.</strong> '+t.reason+' No martensite, hardness, toughness, ductility, weldability, retained-austenite, grain-growth, cracking, or tempering score is claimed.</div>';$('spx-trade-narrative').innerHTML='<div class="spx-note">The superheat control requires a valid austenitization-completion reference. Correct the chemistry/model-domain issue before applying this hypothetical scenario.</div>';return}
  $('spx-trade-results').innerHTML=
    scoreCard('Martensite potential',t.mart,'Higher values favour as-quenched strength and hardness.')+
    scoreCard('Hardness potential',t.hardness,'Tempering reduces the as-quenched hardness trend.')+
    scoreCard('Toughness potential',t.toughness,'Higher is generally favourable; morphology and grain size remain decisive.')+
    scoreCard('Ductility potential',t.ductility,'Higher is generally favourable for deformation capacity.')+
    scoreCard('Weldability',t.weldability,'Based mainly on the chemistry-driven CE trend.')+
    scoreCard('Retained-austenite risk',t.retained,'Higher carbon, martensite potential, and superheat raise the tendency.')+
    scoreCard('Grain-growth risk',t.grain,'Higher superheat increases the risk unless grain-growth inhibitors are effective.')+
    scoreCard('Quench cracking risk',t.crack,'Rapid cooling, carbon, martensite, and coarse grains increase risk.')+
    scoreCard('Residual-stress relief',t.relief,'Higher tempering temperature generally improves stress relief.');
  var carbonText=t.c>.55?'Carbon is high enough to strongly raise hardness and retained-austenite risk while reducing weldability and ductility.':t.c>.25?'Carbon provides moderate hardening potential with a growing weldability penalty.':'Low carbon favours weldability and ductility but limits martensite hardness.';
  var coolingText=t.rate>100?'The cooling intensity strongly promotes martensite but also raises distortion and cracking risk.':t.rate>5?'The cooling intensity creates a mixed transformation regime where bainite or martensite may compete with ferrite/pearlite.':'Slow cooling favours diffusional ferrite/pearlite products and lower residual stress.';
  var heatText=t.superheat>90?'The austenitizing superheat may improve dissolution but creates substantial grain-growth and retained-austenite risk.':'The selected superheat is comparatively restrained, reducing grain-growth risk but potentially limiting dissolution or homogenization.';
  var temperText=t.temper>450?'High tempering strongly reduces hardness and residual stress and generally improves toughness, subject to alloy-specific embrittlement behaviour.':t.temper>180?'Moderate tempering trades some hardness for improved toughness and stress relief.':'Low-temperature tempering preserves hardness but provides limited stress relief and toughness recovery.';
  $('spx-trade-narrative').innerHTML='<article><h3>Carbon effect</h3><p>'+carbonText+'</p></article><article><h3>Cooling effect</h3><p>'+coolingText+'</p></article><article><h3>Austenitizing and tempering</h3><p>'+heatText+' '+temperText+'</p></article>';
}
function applyTradeoff(){
  var t=tradeModel(),p=activePoint();
  if(!t.valid){$('spx-trade-status').innerHTML='<strong>Not applied:</strong> '+t.reason+' The existing scenario was retained.';return}
  state.chem.C=t.c;p.c=t.c;state.rapidRate=t.rate;
  if($('spx-kin-cooling'))$('spx-kin-cooling').value=round(t.rate,2);
  if($('spx-property-rate'))$('spx-property-rate').value=rateToPropertySlider(t.rate);
  buildChemInputs();renderPointRows();buildEquilibrium();renderChemistry();renderKinetics();renderCompare();setBasis('rapid');
  var propertyRate=$('spx-property-rate')?Math.pow(10,Number($('spx-property-rate').value)/40-1):t.rate;
  $('spx-trade-status').innerHTML='<strong>Applied:</strong> active point and chemistry carbon set to '+t.c.toFixed(2)+' wt%; kinetic cooling rate set to '+round(t.rate,2)+' °C/s and the Chemistry property control set to '+round(propertyRate,2)+' °C/s. Austenitizing superheat and tempering temperature remain teaching controls until the dedicated models are added.';
}

function renderRelease1(){recordStudentVisit(state.tab);renderModeSummary();renderWorkspaceNavigation();renderStudentArea();renderLearningCoach();renderCausalChain();renderNomenclature();renderTradeoffs()}
function wrapAfter(name){
  var original=window[name];if(typeof original!=='function'||original.__spxRelease1Wrapped)return;
  var wrapped=function(){var out=original.apply(this,arguments);renderRelease1();return out};
  wrapped.__spxRelease1Wrapped=true;window[name]=wrapped;
}
function enhanceSerialization(){
  if(typeof window.serializable==='function'&&!window.serializable.__spxRelease1Wrapped){
    var baseSerializable=window.serializable;
    window.serializable=function(){var obj=baseSerializable();obj.experience=state.experience;obj.thermalBasis=state.thermalBasis;obj.rapidRate=state.rapidRate;obj.guideGoal=state.guideGoal;obj.release1={heatingRate:Number($('spx-heating-rate').value),coolingRate:Number($('spx-cooling-rate-coach').value),trade:{carbon:Number($('spx-trade-carbon').value),cooling:Number($('spx-trade-cooling').value),superheat:Number($('spx-trade-superheat').value),temper:Number($('spx-trade-temper').value)}};return obj};
    window.serializable.__spxRelease1Wrapped=true;
  }
  if(typeof window.restore==='function'&&!window.restore.__spxRelease1Wrapped){
    var baseRestore=window.restore;
    window.restore=function(obj){var ok=baseRestore(obj);if(ok)applyReleaseState(obj);return ok};
    window.restore.__spxRelease1Wrapped=true;
  }
}
function applyReleaseState(obj){
  if(!obj)return;
  if(obj.experience)state.experience=obj.experience;if(obj.thermalBasis)state.thermalBasis=obj.thermalBasis;if(finite(Number(obj.rapidRate)))state.rapidRate=clamp(Number(obj.rapidRate),.01,1000);if(obj.guideGoal)state.guideGoal=obj.guideGoal;
  if(obj.release1){
    if(finite(Number(obj.release1.heatingRate)))$('spx-heating-rate').value=Number(obj.release1.heatingRate);
    if(finite(Number(obj.release1.coolingRate)))$('spx-cooling-rate-coach').value=Number(obj.release1.coolingRate);
    var tr=obj.release1.trade||{};
    if(finite(Number(tr.carbon)))$('spx-trade-carbon').value=Number(tr.carbon);
    if(finite(Number(tr.cooling)))$('spx-trade-cooling').value=Number(tr.cooling);
    if(finite(Number(tr.superheat)))$('spx-trade-superheat').value=Number(tr.superheat);
    if(finite(Number(tr.temper)))$('spx-trade-temper').value=Number(tr.temper);
  }
  setExperience(state.experience||'beginner',false);setBasis(state.thermalBasis||'equilibrium',false);renderRelease1();
}
function loadReleaseStateFromHash(){
  var match=location.hash.match(/spx=([^&]+)/);if(!match)return;
  try{applyReleaseState(JSON.parse(decodeURIComponent(escape(atob(match[1])))))}catch(e){}
}
function bindReleaseEvents(){
  $('spx-workspace-mode-selector').addEventListener('click',function(e){var b=e.target.closest('[data-workspace-mode]');if(b)setWorkspaceMode(b.dataset.workspaceMode)});
  $('spx-workspace-mode-selector').addEventListener('keydown',function(e){
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].indexOf(e.key)<0)return;
    var buttons=Array.prototype.slice.call(this.querySelectorAll('[data-workspace-mode]')),current=buttons.indexOf(document.activeElement),next;
    if(e.key==='Home')next=0;else if(e.key==='End')next=buttons.length-1;else next=(current+((e.key==='ArrowRight'||e.key==='ArrowDown')?1:-1)+buttons.length)%buttons.length;
    e.preventDefault();buttons[next].focus();setWorkspaceMode(buttons[next].dataset.workspaceMode);
  });
  $('spx-experience-selector').addEventListener('click',function(e){if(e.target.dataset.experience)setExperience(e.target.dataset.experience)});
  $('spx-basis-selector').addEventListener('click',function(e){if(e.target.dataset.basis)setBasis(e.target.dataset.basis)});
  $('spx-start-audience-selector').addEventListener('click',function(e){var b=e.target.closest('[data-start-audience]');if(b)setWorkspaceMode(b.dataset.startAudience)});
  $('spx-student-nav').addEventListener('click',function(e){var b=e.target.closest('[data-student-area]');if(b)setStudentArea(b.dataset.studentArea,true)});
  $('spx-student-hub').addEventListener('click',function(e){
    var path=e.target.closest('[data-learning-path]');if(path){beginLearningPath(path.dataset.learningPath,true);return}
    var area=e.target.closest('[data-student-area-link]');if(area){setStudentArea(area.dataset.studentAreaLink,true);return}
    var route=e.target.closest('[data-student-route]');if(route)openStudentRoute(route);
  });
  $('spx-progress-continue').onclick=function(){if(!state.studentProgress.activePath)return;state.studentProgress.collapsed=false;saveStudentProgress();renderLearningCoach(true)};
  $('spx-learning-close').onclick=function(){state.studentProgress.collapsed=true;saveStudentProgress();renderLearningCoach();renderStudentArea();var nav=document.querySelector('#spx-student-nav [data-student-area="'+state.studentProgress.studentArea+'"]');if(nav)nav.focus()};
  $('spx-learning-previous').onclick=function(){moveLearningStep(-1)};
  $('spx-learning-next').onclick=function(){moveLearningStep(1)};
  $('spx-learning-primary').onclick=completeLearningStep;
  $('spx-learning-steps').addEventListener('click',function(e){var b=e.target.closest('[data-learning-step]');if(!b)return;setActiveLearningStep(Number(b.dataset.learningStep));saveStudentProgress();renderLearningCoach(true)});
  $('spx-learning-stage').addEventListener('click',function(e){
    if(!e.target.closest('[data-learning-open]'))return;
    var path=learningPathFor(state.studentProgress.activePath);if(!path)return;
    openStartShortcut(path.tab,path.title,path.requires||'',{focusTab:true});
  });
  $('spx-learning-stage').addEventListener('change',function(e){
    var id=state.studentProgress.activePath,path=learningPathFor(id);if(!path)return;
    var saved=pathState(id),index=Number(e.target.value),status=$('spx-learning-status');
    if(e.target.name==='spx-learning-prediction'){
      saved.prediction=path.predictionOptions[index]||'';
      if(status)status.textContent=saved.prediction?'Prediction recorded: '+saved.prediction+'.':'Choose an answer to record your prediction.';
    }
    if(e.target.name==='spx-learning-check'){
      saved.checkAnswer=path.checkOptions[index]||'';
      if(status)status.textContent=saved.checkAnswer===path.checkAnswer?path.checkSuccess:path.checkRetry;
    }
    saveStudentProgress();renderStudentArea();
  });
  $('spx-primary-goals').addEventListener('click',function(e){var b=e.target.closest('[data-start-goal]');if(b)openStartGoal(b.dataset.startGoal,0)});
  $('spx-question-grid').addEventListener('click',function(e){var b=e.target.closest('[data-guide-route]');if(b)guideRoute(b.dataset.guideRoute)});
  $('spx-resume-work').onclick=function(){openStartShortcut('equilibrium','full workspace')};
  $('spx-open-reference').onclick=function(){openStartShortcut('reference-diagrams','Reference diagrams','release5')};
  $('spx-open-learn').onclick=function(){openStartShortcut('learn','Learn & export')};
  $('spx-refresh-causal').onclick=renderCausalChain;
  ['spx-heating-rate','spx-cooling-rate-coach'].forEach(function(id){$(id).addEventListener('input',renderNomenclature)});
  $('spx-reset-critical').onclick=function(){$('spx-heating-rate').value=40;$('spx-cooling-rate-coach').value=120;renderNomenclature()};
  $('spx-nomenclature-grid').addEventListener('click',function(e){var b=e.target.closest('[data-critical-term]');if(!b)return;selectedCriticalTerm=b.dataset.criticalTerm;renderNomenclature()});
  ['spx-trade-carbon','spx-trade-cooling','spx-trade-superheat','spx-trade-temper'].forEach(function(id){$(id).addEventListener('input',renderTradeoffs)});
  $('spx-apply-tradeoff').onclick=applyTradeoff;
  document.addEventListener('input',function(e){if(!e.target)return;if(e.target.id==='spx-kin-cooling'){var r=parseFloat(e.target.value);if(isFinite(r))state.rapidRate=clamp(r,.01,1000)}if(/spx-input-|spx-chem-|spx-kin-cooling|spx-property-rate/.test(e.target.id||''))renderRelease1()});
}
function watchWorkspaceTabs(){
  var list=document.querySelector('.spx-tabs');if(!list||!window.MutationObserver)return;
  new MutationObserver(renderWorkspaceNavigation).observe(list,{childList:true,subtree:true});
}
function initRelease1(){
  var propertyRate=$('spx-property-rate');if(propertyRate)propertyRate.max='160';
  var storedExperience=safeLocalGet('spx-experience-v1');
  state.experience=state.experience||storedExperience||'beginner';
  if(['beginner','engineer','advanced'].indexOf(state.experience)<0)state.experience='beginner';
  state.thermalBasis=state.thermalBasis||safeLocalGet('spx-basis-v1')||'equilibrium';
  state.rapidRate=state.rapidRate||50;state.guideGoal=state.guideGoal||'';
  var storedWorkspaceMode=safeLocalGet('spx-workspace-mode-v1'),legacyAudience=safeLocalGet('spx-start-audience-v1');
  var initialWorkspaceMode=validWorkspaceMode(storedWorkspaceMode)?storedWorkspaceMode:validWorkspaceMode(legacyAudience)?legacyAudience:state.experience==='beginner'?'student':'professional';
  state.studentProgress=loadStudentProgress();state.studentArea=state.studentProgress.studentArea;
  ['renderEquilibrium','renderKinetics','renderChemistry','renderProperties','renderCycle','renderCompare','setUnit','setPoint','addPoint','removePoint','switchTab'].forEach(wrapAfter);
  enhanceSerialization();bindReleaseEvents();watchWorkspaceTabs();loadReleaseStateFromHash();setExperience(state.experience,false);setBasis(state.thermalBasis,false);setStudentArea(state.studentArea,false);setWorkspaceMode(initialWorkspaceMode,false);safeLocalSet('spx-workspace-mode-v1',initialWorkspaceMode);safeLocalSet('spx-start-audience-v1',initialWorkspaceMode);switchTab('navigator');
  if(window.__SPX){window.__SPX.release1={setExperience:setExperience,setBasis:setBasis,setStartAudience:setStartAudience,getStartAudience:function(){return state.workspaceMode},setWorkspaceMode:setWorkspaceMode,getWorkspaceMode:function(){return state.workspaceMode},setStudentArea:setStudentArea,startLearningPath:beginLearningPath,getStudentProgress:function(){return JSON.parse(JSON.stringify(state.studentProgress))},openGoal:openStartGoal,render:renderRelease1,route:guideRoute,tradeModel:tradeModel,propertyEstimate:propertyEstimateFor}}
}
initRelease1();
})();
