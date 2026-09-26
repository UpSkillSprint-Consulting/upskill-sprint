(function(){
'use strict';
var VERSION='1.0.0',MAX_BYTES=2097152,tool=document.getElementById('spx-tool'),dataset=null,selection=null,readToken=0;
if(!tool||!window.__SPX||window.__SPX.specificationHandoff)return;
var FORMS=['PLATE','COIL','SEAMLESS','ERW_HFW','SAWL','SAWH'],PSL=['PSL1','PSL2'],CATEGORIES=['CAT_I','CAT_II','CAT_III'];
function own(o,k){return Object.prototype.hasOwnProperty.call(o,k)}
function object(v){return v&&typeof v==='object'&&!Array.isArray(v)}
function text(v,max){return String(v==null?'':v).trim().slice(0,max||240)}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function issue(level,code,path,message){return{level:level,code:code,path:path,message:message}}
function validateDataset(input){
  var errors=[],warnings=[],data=input;
  if(!object(data)){errors.push(issue('error','TYPE','SPEC_DATA','Root must be an object.'));return{valid:false,errors:errors,warnings:warnings,data:null}}
  var version=text(data.schemaVersion,20),major=version.split('.')[0];
  if(!version)errors.push(issue('error','REQUIRED','schemaVersion','schemaVersion is required.'));
  else if(major!=='1')errors.push(issue('error','SCHEMA_MAJOR','schemaVersion','Only SPEC_DATA major version 1 is accepted.'));
  if(!object(data.specBodies))errors.push(issue('error','REQUIRED','specBodies','specBodies must be an object.'));
  var bodies=object(data.specBodies)?data.specBodies:{};
  Object.keys(bodies).forEach(function(bodyKey){
    var body=bodies[bodyKey],bp='specBodies.'+bodyKey;
    if(!/^[A-Z][A-Z0-9_]*$/.test(bodyKey))errors.push(issue('error','ID',bp,'Specification body keys must be uppercase stable IDs.'));
    if(!object(body)){errors.push(issue('error','TYPE',bp,'Specification body must be an object.'));return}
    if(!text(body.displayName,160))errors.push(issue('error','REQUIRED',bp+'.displayName','displayName is required.'));
    if(!object(body.grades)){errors.push(issue('error','REQUIRED',bp+'.grades','grades must be an object.'));return}
    Object.keys(body.grades).forEach(function(gradeKey){
      var grade=body.grades[gradeKey],gp=bp+'.grades.'+gradeKey;
      if(!/^[A-Z][A-Z0-9_]*$/.test(gradeKey))errors.push(issue('error','ID',gp,'Grade keys must be uppercase stable IDs.'));
      if(!object(grade)){errors.push(issue('error','TYPE',gp,'Grade must be an object.'));return}
      ['displayName','specEdition'].forEach(function(k){if(!text(grade[k],200))errors.push(issue('error','REQUIRED',gp+'.'+k,k+' is required.'))});
      if(grade.psl!=null&&PSL.indexOf(grade.psl)<0)errors.push(issue('error','ENUM',gp+'.psl','Unknown PSL value.'));
      if(grade.category!=null&&CATEGORIES.indexOf(grade.category)<0)errors.push(issue('error','ENUM',gp+'.category','Unknown category value.'));
      if(!Array.isArray(grade.applicableForms)||!grade.applicableForms.length)errors.push(issue('error','REQUIRED',gp+'.applicableForms','At least one applicable form is required.'));
      else grade.applicableForms.forEach(function(form,i){if(FORMS.indexOf(form)<0)errors.push(issue('error','ENUM',gp+'.applicableForms['+i+']','Unknown applicable form.'))});
      ['chemistry','mechanical','charpy','testing','overlays'].forEach(function(k){if(!own(grade,k))errors.push(issue('error','REQUIRED',gp+'.'+k,k+' is required by the schema contract.'))});
      ['footnoteRules','notes','equivalents'].forEach(function(k){if(!Array.isArray(grade[k]))errors.push(issue('error','TYPE',gp+'.'+k,k+' must be an array.'))});
      if(!object(grade.verification))errors.push(issue('error','REQUIRED',gp+'.verification','verification is required.'));
      else{
        var by=text(grade.verification.lastVerifiedBy,120),date=text(grade.verification.lastVerifiedDate,40);
        if(Boolean(by)!==Boolean(date))errors.push(issue('error','VERIFICATION_PAIR',gp+'.verification','Verifier and verification date must be supplied together.'));
        if(!by&&!date)warnings.push(issue('warning','UNVERIFIED_GRADE',gp,'Grade identity has no independent verification record.'))
      }
    })
  });
  if(!Object.keys(bodies).length)errors.push(issue('error','EMPTY','specBodies','At least one specification body is required.'));
  return{valid:errors.length===0,errors:errors,warnings:warnings,data:errors.length?null:data}
}
function parseDataset(raw){
  var parsed=raw;if(typeof raw==='string'){try{parsed=JSON.parse(raw)}catch(e){return{valid:false,errors:[issue('error','JSON','SPEC_DATA','File is not valid JSON.')],warnings:[],data:null}}}
  return validateDataset(parsed)
}
function getGrade(data,bodyKey,gradeKey){var bodies=data&&data.specBodies;if(!object(bodies)||!own(bodies,bodyKey))return null;var body=bodies[bodyKey];return object(body)&&object(body.grades)&&own(body.grades,gradeKey)?body.grades[gradeKey]:null}
function buildContext(data,bodyKey,gradeKey,form){
  var grade=getGrade(data,bodyKey,gradeKey);if(!grade)return null;
  var forms=Array.isArray(grade.applicableForms)?grade.applicableForms:[];if(forms.indexOf(form)<0)return null;
  var verification=object(grade.verification)?grade.verification:{};
  return{schemaVersion:'1.0',specBody:text(bodyKey,80),gradeKey:text(gradeKey,100),displayName:text(grade.displayName,160),specEdition:text(grade.specEdition,160),psl:grade.psl==null?null:grade.psl,category:grade.category==null?null:grade.category,applicableForm:form,verification:{lastVerifiedBy:text(verification.lastVerifiedBy,120)||null,lastVerifiedDate:text(verification.lastVerifiedDate,40)||null,notes:text(verification.notes,500)}}
}
function renderIssues(result){
  var host=document.getElementById('spx-spec-import-status');if(!host)return;
  if(!result){host.className='spx-spec-status';host.textContent='No SPEC_DATA file is loaded. Grade limits and acceptance logic are not available in this workspace.';return}
  var rows=result.errors.concat(result.warnings).slice(0,12);
  host.className='spx-spec-status '+(result.valid?'is-warning':'is-error');
  host.innerHTML='<strong>'+(result.valid?'Identity contract accepted for this session.':'Import rejected; previous valid session preserved.')+'</strong>'+(rows.length?'<ul>'+rows.map(function(x){return'<li>'+esc(x.path)+': '+esc(x.message)+'</li>'}).join('')+'</ul>':'')
}
function option(value,label){return'<option value="'+esc(value)+'">'+esc(label)+'</option>'}
function populateBodies(){
  var body=document.getElementById('spx-spec-body'),keys=dataset?Object.keys(dataset.specBodies):[];
  body.innerHTML=keys.map(function(k){return option(k,dataset.specBodies[k].displayName)}).join('');body.disabled=!keys.length;populateGrades()
}
function populateGrades(){
  var bodyKey=document.getElementById('spx-spec-body').value,grade=document.getElementById('spx-spec-grade'),grades=dataset&&dataset.specBodies[bodyKey]?dataset.specBodies[bodyKey].grades:{},keys=Object.keys(grades);
  grade.innerHTML=keys.map(function(k){return option(k,grades[k].displayName)}).join('');grade.disabled=!keys.length;populateForms()
}
function populateForms(){
  var bodyKey=document.getElementById('spx-spec-body').value,gradeKey=document.getElementById('spx-spec-grade').value,grade=getGrade(dataset,bodyKey,gradeKey),form=document.getElementById('spx-spec-form'),forms=grade&&Array.isArray(grade.applicableForms)?grade.applicableForms:[];
  form.innerHTML=forms.map(function(x){return option(x,x.replace(/_/g,' / '))}).join('');form.disabled=!forms.length;renderSelection()
}
function renderSelection(){
  var bodyKey=document.getElementById('spx-spec-body').value,gradeKey=document.getElementById('spx-spec-grade').value,form=document.getElementById('spx-spec-form').value;
  selection=dataset?buildContext(dataset,bodyKey,gradeKey,form):null;var host=document.getElementById('spx-spec-context-preview'),download=document.getElementById('spx-spec-context-download');download.disabled=!selection;
  if(!selection){host.innerHTML='<p>No specification identity selected.</p>';return}
  var verified=!!(selection.verification.lastVerifiedBy&&selection.verification.lastVerifiedDate);
  host.innerHTML='<dl><div><dt>Specification</dt><dd>'+esc(dataset.specBodies[bodyKey].displayName)+'</dd></div><div><dt>Grade</dt><dd>'+esc(selection.displayName)+'</dd></div><div><dt>Edition</dt><dd>'+esc(selection.specEdition)+'</dd></div><div><dt>Form</dt><dd>'+esc(selection.applicableForm)+'</dd></div><div><dt>PSL / category</dt><dd>'+esc([selection.psl,selection.category].filter(Boolean).join(' · ')||'Not applicable')+'</dd></div><div><dt>Verification</dt><dd>'+(verified?esc(selection.verification.lastVerifiedBy+' · '+selection.verification.lastVerifiedDate):'Not independently verified')+'</dd></div></dl><p class="spx-spec-boundary"><strong>Identity only.</strong> Chemistry, mechanical, Charpy, DWTT, testing, overlay, footnote, equivalence, and acceptance fields are deliberately excluded.</p>'
}
function onFile(event){
  var file=event.target.files&&event.target.files[0],token=++readToken;if(!file)return;
  if(file.size>MAX_BYTES){renderIssues({valid:false,errors:[issue('error','FILE_SIZE','SPEC_DATA','File exceeds the 2 MiB session import limit.')],warnings:[]});event.target.value='';return}
  var reader=new FileReader();reader.onload=function(){if(token!==readToken)return;var result=parseDataset(String(reader.result||''));if(result.valid){dataset=result.data;populateBodies()}renderIssues(result)};reader.onerror=function(){if(token!==readToken)return;renderIssues({valid:false,errors:[issue('error','FILE_READ','SPEC_DATA','The file could not be read.')],warnings:[]})};reader.readAsText(file)
}
function downloadContext(){if(!selection)return;var blob=new Blob([JSON.stringify(selection,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='steel-phase-specification-context.json';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000)}
function clear(){readToken++;dataset=null;selection=null;document.getElementById('spx-spec-file').value='';document.getElementById('spx-spec-body').innerHTML='';document.getElementById('spx-spec-grade').innerHTML='';document.getElementById('spx-spec-form').innerHTML='';['spx-spec-body','spx-spec-grade','spx-spec-form','spx-spec-context-download'].forEach(function(id){document.getElementById(id).disabled=true});renderIssues(null);renderSelection()}
function markup(){return '<section class="spx-card spx-card-pad spx-spec-handoff" id="spx-specification-handoff" aria-labelledby="spx-spec-title"><div class="spx-card-title"><div><p class="spx-eyebrow">Step 10 · Specification traceability</p><h2 id="spx-spec-title">Keep metallurgy screening and compliance decisions separate</h2><p>Load a controlled SPEC_DATA package to select grade identity for traceability. No specification limits enter Explorer calculations, and no acceptance verdict is produced here.</p></div></div><div class="spx-spec-flow" aria-label="Specification handoff boundaries"><div><strong>1. Explore</strong><span>Screen mechanisms and scenarios here.</span></div><div><strong>2. Identify</strong><span>Select a schema-valid specification identity.</span></div><div><strong>3. Verify</strong><span>Use controlled standards and the compliance checker.</span></div></div><div class="spx-spec-grid"><section><h3>Session-only identity import</h3><label class="spx-spec-file" for="spx-spec-file">SPEC_DATA JSON<input id="spx-spec-file" type="file" accept=".json,application/json" aria-describedby="spx-spec-file-help"></label><small id="spx-spec-file-help">Schema major version 1 only; maximum 2 MiB. The dataset is not persisted.</small><div id="spx-spec-import-status" class="spx-spec-status" role="status" aria-live="polite"></div><div class="spx-spec-selects"><label>Specification body<select id="spx-spec-body" disabled></select></label><label>Grade<select id="spx-spec-grade" disabled></select></label><label>Applicable form<select id="spx-spec-form" disabled></select></label></div><div class="spx-spec-actions"><button type="button" class="spx-btn" id="spx-spec-clear">Clear session import</button></div></section><section><h3>Traceability-only context</h3><div id="spx-spec-context-preview" class="spx-spec-preview" aria-live="polite"><p>No specification identity selected.</p></div><div class="spx-spec-actions"><button type="button" class="spx-btn" id="spx-spec-context-download" disabled>Download identity context</button></div></section></div><section class="spx-spec-destination" aria-labelledby="spx-spec-destination-title"><div><h3 id="spx-spec-destination-title">Continue in the governed specification tools</h3><p>The Material Specification Lookup reads the full schema. The Compliance Checker records actual evidence, controlled requirements, coverage, and disposition.</p></div><div class="spx-spec-actions"><a class="spx-btn" href="/engineering-tools/grade-specification-lookup/">Open specification lookup</a><a class="spx-btn primary" href="/tools/material-specification-compliance-checker">Open compliance checker</a></div></section><div class="spx-note"><strong>Non-negotiable boundary:</strong> a grade name, identity context, model estimate, calibration candidate, or Plant calibrated status cannot establish specification compliance or release product.</div></section>'}
function init(){var anchor=document.getElementById('spx-release-readiness'),panel=document.getElementById('spx-tab-navigator');if(!anchor||!panel)return;var wrap=document.createElement('div');wrap.innerHTML=markup();panel.insertBefore(wrap.firstElementChild,anchor);document.getElementById('spx-spec-file').addEventListener('change',onFile);document.getElementById('spx-spec-body').addEventListener('change',populateGrades);document.getElementById('spx-spec-grade').addEventListener('change',populateForms);document.getElementById('spx-spec-form').addEventListener('change',renderSelection);document.getElementById('spx-spec-clear').onclick=clear;document.getElementById('spx-spec-context-download').onclick=downloadContext;renderIssues(null);window.__SPX.specificationHandoff={version:VERSION,maxImportBytes:MAX_BYTES,forms:FORMS.slice(),validateDataset:validateDataset,parseDataset:parseDataset,buildContext:buildContext,getContext:function(){return selection?JSON.parse(JSON.stringify(selection)):null},clear:clear};if(window.__SPX.releaseReadiness&&typeof window.__SPX.releaseReadiness.getReport==='function')window.__SPX.releaseReadiness.getReport();document.dispatchEvent(new CustomEvent('spx:specification-handoff-ready',{detail:{version:VERSION}}))}
init();
})();
