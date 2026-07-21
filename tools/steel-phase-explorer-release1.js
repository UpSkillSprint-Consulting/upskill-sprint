(function(){
'use strict';
var tool=document.getElementById('spx-tool');
if(!tool||typeof state==='undefined')return;

var selectedCriticalTerm='Ae';
var criticalTerms={
  Ae:'Ae denotes an equilibrium critical temperature. Ae₁ is the equilibrium eutectoid boundary; Ae₃ and Aecm bound the single-phase austenite field. These are reference conditions approached only with very slow heating or cooling.',
  Ac:'Ac denotes a critical temperature observed during heating (chauffage). Ac₁ marks the start of austenite formation and Ac₃ marks completion for a hypoeutectoid steel. Faster heating generally shifts the observed transformation upward.',
  Ar:'Ar denotes a critical temperature observed during cooling (refroidissement). Ar₃ marks the start of ferrite formation and Ar₁ is associated with the lower-temperature austenite decomposition. Faster cooling generally shifts transformation downward.',
  Ms:'Ms is the temperature at which martensite begins to form during sufficiently rapid cooling. It depends strongly on chemistry and the prior austenite condition.',
  Mf:'Mf is the temperature at which the martensitic transformation is effectively complete. A generalized Mf value is not reported here because it is grade- and condition-dependent; retained austenite may remain even below an estimated Mf.'
};
var routeInfo={
  phase:{tab:'equilibrium',basis:'equilibrium',message:'Recommended workflow: open the equilibrium diagram, enter carbon and temperature, inspect the highlighted field, then reveal the tie line and lever-rule calculation in Engineer or Advanced mode.'},
  path:{tab:'path',message:'Recommended workflow: select a heat-treatment preset, edit the temperature-time steps, and scrub or play the path while watching the transformation timeline and microstructure.'},
  rapid:{tab:'kinetics',basis:'rapid',message:'Recommended workflow: use CCT mode, enter a cooling rate and final temperature, then compare predicted constituents with the equilibrium reference. Treat the result as a generalized teaching estimate.'},
  chemistry:{tab:'chemistry',message:'Recommended workflow: choose a grade preset or enter the heat chemistry, review CE/Pcm and critical temperatures, then move the cooling-rate control to see directional property changes.'},
  critical:{tab:'navigator',target:'spx-nomenclature-card',message:'Recommended workflow: compare Ae, Ac, and Ar at different heating and cooling rates, then distinguish those diffusional transformations from Ms and Mf.'},
  tradeoffs:{tab:'navigator',target:'spx-tradeoff-card',message:'Recommended workflow: move one slider at a time, identify the benefit and penalty, and apply the selected carbon and cooling rate only when you are ready to update the active scenario.'}
};

function safeLocalGet(key){try{return localStorage.getItem(key)}catch(e){return null}}
function safeLocalSet(key,value){try{localStorage.setItem(key,value)}catch(e){}}
function trend(value){return value<20?'Very low':value<40?'Low':value<60?'Moderate':value<80?'High':'Very high'}
function formatFractionObject(obj){return Object.keys(obj).map(function(k){return k+' '+round(pct(obj[k]),0)+'%'}).join(' · ')}
function chemistryWithCarbon(c){var x=Object.assign({},state.chem);x.C=c;return x}
function chemistryMetricsFor(x){
  var ce=x.C+x.Mn/6+(x.Cr+x.Mo+x.V)/5+(x.Ni+x.Cu)/15;
  var pcm=x.C+x.Si/30+(x.Mn+x.Cu+x.Cr)/20+x.Ni/60+x.Mo/15+x.V/10+5*x.B;
  var ms=539-423*x.C-30.4*x.Mn-17.7*x.Ni-12.1*x.Cr-7.5*x.Mo;
  var ac1=723-10.7*x.Mn-16.9*x.Ni+29.1*x.Si+16.9*x.Cr+290*x.B;
  var ac3=910-203*Math.sqrt(Math.max(0,x.C))-15.2*x.Ni+44.7*x.Si+104*x.V+31.5*x.Mo+13.1*x.Cr;
  var hard=clamp(20+55*x.C+12*x.Mn+18*x.Cr+22*x.Mo+8*x.Ni+180*x.B,0,100);
  return{ce:ce,pcm:pcm,ms:ms,ac1:ac1,ac3:ac3,hardenability:hard};
}
function propertyEstimateFor(x,rate){
  var m=chemistryMetricsFor(x),r=Math.max(.01,rate),harden=m.hardenability/100;
  var mart=clamp((Math.log10(r+1)-.35)*.34+harden*.42+(x.C-.2)*.35,0,1);
  var bain=clamp((1-mart)*(.15+.28*harden+.12*Math.log10(r+1)),0,1-mart);
  var fp=1-mart-bain;
  var hv=110+310*x.C+115*mart+75*bain+18*Math.log10(r+1);
  var uts=hv*3.15,ys=uts*(.55+.18*mart+.08*bain),elong=clamp(36-35*x.C-18*mart-8*bain,3,40);
  return{mart:mart,bain:bain,fp:fp,hv:hv,uts:uts,ys:ys,elong:elong};
}
function coolingSliderToRate(v){return Math.pow(10,Number(v)/25-1)}
function rateToPropertySlider(rate){return clamp(40*(Math.log10(Math.max(.1,rate))+1),0,100)}

function setExperience(mode,persist){
  if(['beginner','engineer','advanced'].indexOf(mode)<0)mode='beginner';
  state.experience=mode;
  tool.dataset.experience=mode;
  document.querySelectorAll('#spx-experience-selector [data-experience]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.experience===mode))});
  if(persist!==false)safeLocalSet('spx-experience-v1',mode);
  renderModeSummary();renderCausalChain();renderNomenclature();renderTradeoffs();
}
function setBasis(mode,persist){
  mode=mode==='rapid'?'rapid':'equilibrium';
  state.thermalBasis=mode;
  document.querySelectorAll('#spx-basis-selector [data-basis]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.basis===mode))});
  if(mode==='rapid'){
    var currentRate=parseFloat($('spx-kin-cooling').value);if(isFinite(currentRate))state.rapidRate=Math.max(.01,currentRate);
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
  box.innerHTML='<strong>'+experience.charAt(0).toUpperCase()+experience.slice(1)+' view:</strong> '+levelText+'. <strong>Interpretation:</strong> '+basisText;
}

function guideRoute(key){
  var info=routeInfo[key];if(!info)return;
  state.guideGoal=key;
  $('spx-guide-recommendation').innerHTML='<strong>'+info.message.split(':')[0]+':</strong>'+info.message.split(':').slice(1).join(':');
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

function weldabilityText(ce){return ce<.4?'generally favourable':ce<.5?'moderate preheat sensitivity':'elevated hydrogen-cracking sensitivity'}
function renderCausalChain(){
  if(!$('spx-causal-chain'))return;
  var p=activePoint(),x=state.chem,m=chemMetrics(),basis=state.thermalBasis||'equilibrium',rate=state.rapidRate||50;
  var mismatch=Math.abs(x.C-p.c)>.02;
  var process,micro,property,performance,summary;
  if(basis==='rapid'){
    var pr=propertyEstimateFor(x,rate);
    micro={"Ferrite/Pearlite":pr.fp,Bainite:pr.bain,Martensite:pr.mart};
    process='Continuous cooling at approximately '+round(rate,2)+' °C/s to the selected final temperature.';
    property='Directional estimate: '+Math.round(pr.hv-25)+'–'+Math.round(pr.hv+25)+' HV, '+Math.round(pr.uts*.9)+'–'+Math.round(pr.uts*1.1)+' MPa UTS, and '+Math.round(Math.max(2,pr.elong-3))+'–'+Math.round(pr.elong+3)+'% elongation.';
    performance='Hardness potential is '+trend(clamp((pr.hv-100)/5,0,100)).toLowerCase()+', while ductility and distortion risk depend on the predicted martensite fraction and the actual section cooling history.';
    summary='<strong>Rapid-cooling interpretation:</strong> the chemistry model trends toward '+formatFractionObject(micro)+'. This is a kinetic estimate, not an equilibrium phase fraction.';
  }else{
    var pf=phaseFractions(p.c,p.t),fm=finalMicro(p.c),slow=propertyEstimateFor(x,.2);
    micro=pf.fractions;
    process='Equilibrium reference at '+fmtT(p.t)+' for P'+p.id+', followed conceptually by slow cooling to room temperature.';
    property='Slow-cooling directional estimate: '+Math.round(slow.hv-25)+'–'+Math.round(slow.hv+25)+' HV and '+Math.round(slow.uts*.9)+'–'+Math.round(slow.uts*1.1)+' MPa UTS.';
    performance='The equilibrium field is '+pf.region.short+'. A slow-cooled room-temperature estimate is '+formatFractionObject(fm)+', with weldability '+weldabilityText(m.ce)+'.';
    summary='<strong>Equilibrium interpretation:</strong> P'+p.id+' lies in <strong>'+pf.region.label+'</strong> at '+fmt(p.c,3)+' wt% C and '+fmtT(p.t)+'. Slow cooling is estimated to produce '+formatFractionObject(fm)+'.';
  }
  $('spx-causal-summary').innerHTML=summary;
  var stages=[
    ['1. Chemistry','What the steel contains','C '+fmt(x.C,3)+'%, Mn '+fmt(x.Mn,2)+'%, Cr '+fmt(x.Cr,2)+'%.<ul><li>CE IIW '+m.ce.toFixed(3)+'</li><li>Pcm '+m.pcm.toFixed(3)+'</li><li>Hardenability index '+Math.round(m.hardenability)+'/100</li></ul>'],
    ['2. Process','What the steel experiences',process+'<ul><li>Active point P'+p.id+': '+fmt(p.c,3)+'% C</li><li>Temperature '+fmtT(p.t)+'</li><li>Basis: '+(basis==='rapid'?'rapid cooling':'equilibrium')+'</li></ul>'],
    ['3. Microstructure','What forms',formatFractionObject(micro)+'<ul><li>Shape, size, distribution, and prior grain condition are not fully represented.</li></ul>'],
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
  var ae1=m.ac1,ae3=m.ac3,ac1=ae1+heatShift,ac3=ae3+1.15*heatShift,ar1=ae1-coolShift,ar3=ae3-.85*coolShift;
  $('spx-heating-rate-label').textContent=Math.round(heat)+' °C/min';
  $('spx-cooling-rate-coach-label').textContent=Math.round(cool)+' °C/min';
  $('spx-critical-chemistry').textContent='C '+fmt(state.chem.C,3)+'%, Mn '+fmt(state.chem.Mn,2)+'%, Cr '+fmt(state.chem.Cr,2)+'%';
  $('spx-critical-plot').innerHTML=criticalRow('Ae₁*',ae1,'baseline equilibrium estimate')+criticalRow('Ac₁*',ac1,'heating start estimate')+criticalRow('Ar₁*',ar1,'cooling transformation estimate')+criticalRow('Ae₃*',ae3,'baseline full-austenite estimate')+criticalRow('Ac₃*',ac3,'heating completion estimate')+criticalRow('Ar₃*',ar3,'cooling start estimate')+criticalRow('Ms',m.ms,'martensite-start estimate');
  document.querySelectorAll('[data-critical-term]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.criticalTerm===selectedCriticalTerm))});
  $('spx-nomenclature-explanation').innerHTML='<strong>'+selectedCriticalTerm+':</strong> '+criticalTerms[selectedCriticalTerm];
  $('spx-critical-model-note').textContent='Teaching approximation: heating shift = 3 + 7log₁₀(rate); cooling shift = 8 + 16log₁₀(rate). Ae* baselines use the explorer chemistry equations. The shifts are illustrative and must not be used as process set points.';
}

function tradeModel(){
  var c=Number($('spx-trade-carbon').value),rate=coolingSliderToRate($('spx-trade-cooling').value),superheat=Number($('spx-trade-superheat').value),temper=Number($('spx-trade-temper').value);
  var x=chemistryWithCarbon(c),m=chemistryMetricsFor(x),cn=clamp((c-.05)/.95,0,1),rn=clamp((Math.log10(rate)+1)/4,0,1),sn=clamp(superheat/180,0,1),tn=clamp((temper-100)/550,0,1);
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
  return{c:c,rate:rate,superheat:superheat,temper:temper,ce:m.ce,mart:mart,hardness:hardness,toughness:toughness,ductility:ductility,weldability:weldability,retained:retained,grain:grain,crack:crack,relief:relief};
}
function scoreCard(label,value,meaning){
  return'<article class="spx-trade-result"><strong>'+label+'<span>'+trend(value)+'</span></strong><div class="spx-score-track"><i style="width:'+clamp(value,0,100)+'%"></i></div><p>'+meaning+'</p></article>';
}
function renderTradeoffs(){
  if(!$('spx-trade-results'))return;
  var t=tradeModel();
  $('spx-trade-carbon-label').textContent=t.c.toFixed(2)+'%';$('spx-trade-cooling-label').textContent=round(t.rate,2)+' °C/s';$('spx-trade-superheat-label').textContent=Math.round(t.superheat)+' °C';$('spx-trade-temper-label').textContent=Math.round(t.temper)+' °C';
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
  state.chem.C=t.c;p.c=t.c;state.rapidRate=t.rate;
  if($('spx-kin-cooling'))$('spx-kin-cooling').value=round(t.rate,2);
  if($('spx-property-rate'))$('spx-property-rate').value=rateToPropertySlider(t.rate);
  buildChemInputs();renderPointRows();buildEquilibrium();renderChemistry();renderKinetics();renderCompare();setBasis('rapid');
  $('spx-trade-status').innerHTML='<strong>Applied:</strong> active point and chemistry carbon set to '+t.c.toFixed(2)+' wt%; kinetic and property cooling rate set to '+round(t.rate,2)+' °C/s. Austenitizing superheat and tempering temperature remain teaching controls until the dedicated models are added.';
}

function renderRelease1(){renderModeSummary();renderCausalChain();renderNomenclature();renderTradeoffs()}
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
  if(obj.experience)state.experience=obj.experience;if(obj.thermalBasis)state.thermalBasis=obj.thermalBasis;if(finite(Number(obj.rapidRate)))state.rapidRate=Number(obj.rapidRate);if(obj.guideGoal)state.guideGoal=obj.guideGoal;
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
  $('spx-experience-selector').addEventListener('click',function(e){if(e.target.dataset.experience)setExperience(e.target.dataset.experience)});
  $('spx-basis-selector').addEventListener('click',function(e){if(e.target.dataset.basis)setBasis(e.target.dataset.basis)});
  $('spx-question-grid').addEventListener('click',function(e){var b=e.target.closest('[data-guide-route]');if(b)guideRoute(b.dataset.guideRoute)});
  $('spx-resume-work').onclick=function(){switchTab('equilibrium')};$('spx-refresh-causal').onclick=renderCausalChain;
  ['spx-heating-rate','spx-cooling-rate-coach'].forEach(function(id){$(id).addEventListener('input',renderNomenclature)});
  $('spx-reset-critical').onclick=function(){$('spx-heating-rate').value=40;$('spx-cooling-rate-coach').value=120;renderNomenclature()};
  $('spx-nomenclature-grid').addEventListener('click',function(e){var b=e.target.closest('[data-critical-term]');if(!b)return;selectedCriticalTerm=b.dataset.criticalTerm;renderNomenclature()});
  ['spx-trade-carbon','spx-trade-cooling','spx-trade-superheat','spx-trade-temper'].forEach(function(id){$(id).addEventListener('input',renderTradeoffs)});
  $('spx-apply-tradeoff').onclick=applyTradeoff;
  document.addEventListener('input',function(e){if(!e.target)return;if(e.target.id==='spx-kin-cooling'){var r=parseFloat(e.target.value);if(isFinite(r))state.rapidRate=Math.max(.01,r)}if(/spx-input-|spx-chem-|spx-kin-cooling|spx-property-rate/.test(e.target.id||''))renderRelease1()});
}
function initRelease1(){
  state.experience=state.experience||safeLocalGet('spx-experience-v1')||'beginner';
  state.thermalBasis=state.thermalBasis||safeLocalGet('spx-basis-v1')||'equilibrium';
  state.rapidRate=state.rapidRate||50;state.guideGoal=state.guideGoal||'';
  ['renderEquilibrium','renderKinetics','renderChemistry','renderProperties','renderCycle','renderCompare','setUnit','setPoint','addPoint','removePoint','switchTab'].forEach(wrapAfter);
  enhanceSerialization();bindReleaseEvents();loadReleaseStateFromHash();setExperience(state.experience,false);setBasis(state.thermalBasis,false);switchTab('navigator');
  if(window.__SPX){window.__SPX.release1={setExperience:setExperience,setBasis:setBasis,render:renderRelease1,route:guideRoute,tradeModel:tradeModel}}
}
initRelease1();
})();
