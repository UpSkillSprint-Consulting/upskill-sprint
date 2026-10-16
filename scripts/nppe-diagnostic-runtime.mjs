/** Build-time integration for the NPPE-only authorized package.
 * Unique anchors fail closed when the shared runtime changes. The authoring
 * HTML and other exam packages are left intact; no client-side fetch of banks.
 */
function once(source, anchor, replacement) {
  if (source.split(anchor).length !== 2) throw new Error('NPPE integration anchor changed: ' + anchor.slice(0, 80));
  return source.replace(anchor, replacement);
}

export function integrateNPPEDiagnostic(source) {
  let code = source;
  code = once(code, '  EXAMS.nppe.sets={};', '  EXAMS.nppe.sets={};\n  window.registerNPPEDiagnostic(EXAMS.nppe);\n  window.registerNPPELearning(EXAMS.nppe);\n  window.registerNPPEMockA(EXAMS.nppe);\n' + helpers);
  code = once(code, "if(!formReady(e,setId)){var ready=availableSetIds(e);setId=ready.length?ready[0]:'';}", "if(!formReady(e,setId))return [];");
  code = once(code, 'function activeSetLabel(e,setId){return', 'function activeSetLabel(e,setId){if(e.formCatalog)return (formMeta(e,setId)||{}).label||\'Unavailable form\';return');
  code = once(code, 'function examNoun(e){return', 'function examNoun(e){if(e.formCatalog)return activeSetLabel(e,selectedSet);return');
  code = once(code, "if(current==='nppe')return e.formatNote||'';", "if(current==='nppe')return nppeDescription(e,selectedSet);");
  code = once(code, '  function nppeFormSelectorHTML(e){', '  function nppeFormSelectorHTML(e){return nppeSelector(e);');
  code = once(code, "(live?setSelectorHTML(e):'')", "(live||e.formCatalog?setSelectorHTML(e):'')");
  code = once(code, '  function modesHTML(e){', "  function modesHTML(e){if(current==='nppe')return nppeModes(e);");
  code = once(code, '  function diagnosticHTML(e){', "  function diagnosticHTML(e){if(current==='nppe')return '';");
  code = once(code, 'function startDiagnostic(){var e=', "function startDiagnostic(){if(current==='nppe')return nppeStart('set-1-diagnostic',diagTimed);var e=");
  code = once(code, 'function startFull(){var e=', "function startFull(){if(current==='nppe')return nppeStart(selectedSet,mode.timed);var e=");
  code = once(code, "var names={full:'Full Exam',quick:'Quick Quiz',focus:'Focused Quiz'};", "var names={full:current==='nppe'?examNoun(EXAMS[current]):'Full Exam',quick:'Quick Quiz',focus:'Focused Quiz'};");
  code = once(code, "'<p class=\"tb-modenote\">Full Exam uses '+esc(examNoun(e))+' ('+fullExamCount(e)+' questions). Choose a test set separately inside Quick Quiz and Focused Quiz.</p>'", "(current==='nppe'?'<p class=\"tb-modenote\">Choose one bank below. Diagnostic and mock questions are never mixed.</p>':'<p class=\"tb-modenote\">Full Exam uses '+esc(examNoun(e))+' ('+fullExamCount(e)+' questions). Choose a test set separately inside Quick Quiz and Focused Quiz.</p>')");
  code = once(code, "(!session.timed?'<button type=\"button\" class=\"tb-tbtn\" data-reveal", "((current!=='nppe'||session.setId==='set-1-learning')&&!session.timed?'<button type=\"button\" class=\"tb-tbtn\" data-reveal");
  code = once(code, "(!session.timed?'<p id=\"tb-reveal-hint\"", "((current!=='nppe'||session.setId==='set-1-learning')&&!session.timed?'<p id=\"tb-reveal-hint\"");
  for (const [attr, text] of [['formulas', '\\u2630 Formulas'], ['tables', '\\u25a4 Tables'], ['calc', '\\u00f7 Calc']]) {
    const anchor = "'<button type=\"button\" class=\"tb-tbtn\" data-" + attr + ">" + text + "</button>'";
    code = once(code, anchor, "(current==='nppe'?'':" + anchor + ')');
  }
  code = once(code, "var sessionTitle=session.kind==='diagnostic'?'Sample diagnostic':", "var sessionTitle=session.kind==='diagnostic'?(current==='nppe'?'Diagnostic':'Sample diagnostic'):");
  const tag = "'<div class=\"tb-qtag\" style=\"background:'+col+'22;color:'+col+'\"><i style=\"background:'+col+'\"></i>'+esc(DM[dm].name)+' &middot; '+esc(topic)+'</div>'";
  code = once(code, tag, "(current==='nppe'?'':" + tag + ')');
  code = once(code, "    var deltaTxt=delta!=null?", "    if(current==='nppe')return nppeResults(gradeNotice,breakdown);\n    var deltaTxt=delta!=null?");
  code = once(code, '  function overviewHTML(){', "  function overviewHTML(){if(current==='nppe')return nppeOverviewHTML();");
  code = once(code, '  function wireOverview(){', "  function wireOverview(){if(current==='nppe')wireNPPEOwners();");
  code = once(code, "'+sessionTitle+' &middot; '", "'+(current==='nppe'?'NPPE':sessionTitle)+' &middot; '");
  code = once(code, '  function revealCurrentAnswer(){', "  function revealCurrentAnswer(){if(current==='nppe'&&(!session||session.setId!=='set-1-learning'||session.timed))return false;");
  code = once(code, '<div class="tb-status-key" aria-label="Question status legend">', '<div class="tb-status-key" role="group" aria-label="Question status legend">');
  return code;
}

const helpers = String.raw`
  // The dark theme's bright teal needs dark text on filled controls. Scope this
  // to the authorized NPPE package, including selected answers and review tabs.
  var nppeContrastStyle=document.createElement('style');
  nppeContrastStyle.id='nppe-control-contrast';
  nppeContrastStyle.textContent='.tb-wrap{--nppe-score-good:#146c43;--nppe-score-low:#a52a25}html[data-theme="dark"] .tb-wrap{--nppe-score-good:#6ee7b7;--nppe-score-low:#fca5a5}html[data-theme="dark"] .tb-wrap .tb-seg button.on,html[data-theme="dark"] .btn-teal,html[data-theme="dark"] .tb-wrap .tb-opt.sel .k,html[data-theme="dark"] #tb-feedback-loop .tb-review-tabs button.on{color:#082f35}';
  document.head.appendChild(nppeContrastStyle);
  var nppeThemeGroup=document.querySelector('.theme-control');
  if(nppeThemeGroup)nppeThemeGroup.setAttribute('role','group');
  function nppeDescription(e,id){
    var form=formMeta(e,id),n=formQuestionCount(e,id);
    if(!form)return 'This bank is unavailable.';
    if(form.kind==='diagnostic')return 'Diagnostic: '+n+' of '+form.target+' planned questions available. '+(n<form.target?'This is a partial diagnostic, not the complete 50-question assessment. ':'')+'All diagnostic questions are scored. Results identify study gaps; they do not predict an official NPPE pass.';
    if(form.kind==='learning')return 'Learning: '+n+' of '+form.target+' planned questions available. '+(n<form.target?'This is a partial learning bank. ':'')+'Untimed Reveal Answer is available for study; revealed questions are assisted learning, not evidence of exam readiness.';
    return form.kind==='mock'?e.formatNote:'This bank is unavailable.';
  }
  function nppeSelector(e){
    var selected=formMeta(e,selectedSet),owner=selected?selected.authorSet:1;
    var names={1:'ChatGPT',2:'Grok',3:'Claude'};
    return '<div class="tb-setpick"><div class="tb-setseg" role="tablist" aria-label="NPPE author sets">'+[1,2,3].map(function(id){
      return '<button type="button" id="nppe-owner-'+id+'" class="tb-setbtn'+(owner===id?' on':'')+'" data-nppe-owner="'+id+'" role="tab" aria-selected="'+(owner===id)+'" aria-controls="nppe-banks-'+id+'" tabindex="'+(owner===id?'0':'-1')+'"><span class="tb-setl">Set '+id+' · '+names[id]+'</span></button>';
    }).join('')+'</div>'+[1,2,3].map(function(id){
      return '<div id="nppe-banks-'+id+'" role="tabpanel" aria-labelledby="nppe-owner-'+id+'"'+(owner===id?'':' hidden style="display:none"')+'><div class="tb-setpick-lab" style="margin-top:16px">'+(id===1?'Diagnostic, Learning and Mocks A–C':id===2?'Mock D':'Mock E')+'</div><div class="tb-setseg" role="group" aria-label="Set '+id+' banks">'+e.formCatalog.filter(function(f){return f.authorSet===id;}).map(function(f){
        var n=formQuestionCount(e,f.id),ready=formReady(e,f.id);
        return '<button type="button" class="tb-setbtn'+(selectedSet===f.id&&ready?' on':'')+'" data-set="'+esc(f.id)+'" aria-pressed="'+(selectedSet===f.id&&ready)+'" aria-label="'+esc(f.label)+', '+n+' questions'+(ready?'':', in preparation')+'"'+(ready?'':' disabled')+'><span class="tb-setl">'+esc(f.label)+'</span><span class="tb-sets">'+n+'</span></button>';
      }).join('')+'</div></div>';
    }).join('')+'<p class="tb-setnote">Counts show available questions only. Empty banks and incomplete full mocks remain disabled. Each bank is separate; questions are never borrowed from another set or mock.</p></div>';
  }
  function wireNPPEOwners(){
    var host=document.getElementById('tb-overview');
    function select(owner){
      var e=EXAMS.nppe,forms=e.formCatalog.filter(function(f){return f.authorSet===owner;}),currentForm=formMeta(e,selectedSet);
      if(!forms.length)return;
      if(!currentForm||currentForm.authorSet!==owner){var next=forms.find(function(f){return formReady(e,f.id);})||forms[0];selectedSet=next.id;}
      renderMain();
      var tab=document.getElementById('nppe-owner-'+owner);if(tab)tab.focus({preventScroll:true});
    }
    Array.prototype.forEach.call(host.querySelectorAll('[data-nppe-owner]'),function(button){
      button.addEventListener('click',function(){select(Number(button.dataset.nppeOwner));});
      button.addEventListener('keydown',function(event){
        var owner=Number(button.dataset.nppeOwner),next=owner;
        if(event.key==='ArrowRight')next=owner%3+1;
        else if(event.key==='ArrowLeft')next=(owner+1)%3+1;
        else if(event.key==='Home')next=1;
        else if(event.key==='End')next=3;
        else return;
        event.preventDefault();select(next);
      });
    });
  }
  function nppeOverviewHTML(){
    var e=EXAMS.nppe,f=formMeta(e,selectedSet),n=formQuestionCount(e,selectedSet),ready=formReady(e,selectedSet);
    var status=!ready?'In preparation':f.kind==='diagnostic'&&n<f.target?'Partial diagnostic':f.kind==='learning'&&n<f.target?'Partial learning bank':'Available for practice';
    return '<h2 class="tb-title">NPPE practice banks <span class="tb-soon sample">'+status+'</span></h2><p class="tb-modenote">Choose an author set, then one bank. Diagnostic and Learning remain separate from the five full mock forms.</p>'+nppeSelector(e)+'<div class="tb-modes">'+nppeModes(e)+'</div><p class="tb-modenote">'+esc(nppeDescription(e,selectedSet))+'</p><p class="tb-srnote">Independent practice material, not affiliated with the NPPE programme or any regulator. Planned totals are not released-question counts.</p>';
  }
  function nppeModes(e){
    var f=formMeta(e,selectedSet),n=activeBank(e,selectedSet).length,ready=formReady(e,selectedSet);
    if(!f)return '<p>This bank is not ready.</p>';
    var minutes=f.kind==='mock'?150:Math.ceil(n*150/110);
    return '<div class="tb-mode" data-nppe-bank="'+esc(f.id)+'"><div class="tb-mode-head"><div><h4>'+esc(f.label)+(f.kind==='diagnostic'&&n<f.target?' — partial diagnostic':'')+'</h4><p>'+n+' questions from this bank only. '+(f.kind==='learning'?'Untimed mode lets you reveal an answer while studying; all explanations appear after submission.':'Answers and explanations appear after submission.')+'</p></div></div><div class="tb-mode-controls">'+timingControlHTML('full',mode.timed)+'</div><div class="tb-mode-foot"><span class="tb-mode-sum">'+(mode.timed?'<b>'+minutes+' minutes</b> · closed-book practice':'<b>Untimed</b> · no time limit')+'</span>'+liveStart('full','Start '+esc(f.label),!ready)+'</div></div>';
  }
  function nppeStart(id,timed){
    var e=EXAMS.nppe,f=formMeta(e,id);
    if(!f||!formReady(e,id))return false;
    var bank=activeBank(e,id).slice();
    if(!bank.length||bank.some(function(q){return q.form!==id||q.authorSet!==f.authorSet;}))return false;
    if(f.kind==='learning'&&bank.some(function(q){return q.bank!=='learning'||q.scored!==true||q.experimental===true;}))return false;
    if(f.kind==='mock'&&(bank.length!==110||bank.filter(function(q){return q.scored!==false&&q.experimental!==true;}).length!==100))return false;
    selectedSet=id;
    if(f.kind==='diagnostic')diagTimed=timed;
    var seconds=(f.kind==='mock'?150:Math.ceil(bank.length*150/110))*60;
    var questions=pickBlueprintExam(e,bank,bank.length);
    return beginSession(e,questions,f.kind==='diagnostic'?'diagnostic':'exam',timed,seconds);
  }
  function nppeResults(gradeNotice,breakdown){
    breakdown=breakdown.replace(/color:#c0453f/g,'color:var(--nppe-score-low)').replace(/color:var\(--good,#1f9d6b\)/g,'color:var(--nppe-score-good)');
    var f=formMeta(EXAMS.nppe,session.setId),isDiagnostic=f&&f.kind==='diagnostic',isLearning=f&&f.kind==='learning';
    return '<div class="tb-resbar"><button type="button" class="tb-ghost" data-back>&larr; Back to NPPE banks</button><span class="tb-restag">'+esc(f?f.label:'NPPE')+' result</span></div><h2>'+esc(f?f.label:'NPPE')+' — study feedback</h2>'+gradeNotice+'<p class="tb-srnote">'+(isDiagnostic?'This diagnostic reports only the questions in this attempt. Small domain samples are starting points for study, not proof of mastery. ':isLearning?'Learning scores measure practice accuracy. Any revealed answers are assisted practice and must not be treated as unseen readiness evidence. ':'Scored results exclude the ten experimental items. ')+'A raw practice percentage is not an official scaled NPPE score, a pass probability or a guarantee. Difficulty has not been empirically calibrated.</p><div class="tb-sec">This attempt: domain breakdown</div><div class="tb-breakdown">'+breakdown+'</div><button type="button" class="tb-ghost" data-retake>Retake '+esc(f?f.label:'bank')+'</button><p class="tb-srnote">Retakes repeat this bank; they are not fresh readiness evidence. Results remain in this tab only and are lost when you leave or refresh.</p>';
  }
`;
