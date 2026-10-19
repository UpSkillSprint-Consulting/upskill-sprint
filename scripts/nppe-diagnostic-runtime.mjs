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
  code = once(code, '  EXAMS.nppe.sets={};', '  EXAMS.nppe.sets={};\n  window.registerNPPEDiagnostic(EXAMS.nppe);\n  window.registerNPPELearning(EXAMS.nppe);\n  window.registerNPPEMockA(EXAMS.nppe);\n  window.registerNPPEMockB(EXAMS.nppe);\n' + releaseForms + helpers);
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
  code = once(code, '  function wireOverview(){', "  function wireOverview(){if(current==='nppe')return wireNPPEOwners();");
  code = once(code, "'+sessionTitle+' &middot; '", "'+(current==='nppe'?'NPPE':sessionTitle)+' &middot; '");
  code = once(code, '  function revealCurrentAnswer(){', "  function revealCurrentAnswer(){if(current==='nppe'&&(!session||session.setId!=='set-1-learning'||session.timed))return false;");
  code = once(code, '<div class="tb-status-key" aria-label="Question status legend">', '<div class="tb-status-key" role="group" aria-label="Question status legend">');
  return code;
}

const releaseForms = String.raw`
  // Editorially published, unofficial practice forms; server-side exam access remains mandatory.
  // This runs only in the authorized NPPE delivery package, never in public shell assets.
  (function(){
    var exam=EXAMS.nppe, forms=exam.forms, catalog=exam.formCatalog;
    var grok=forms['mock-d'],claude=forms['mock-e'];
    var a=forms['set-1-mock-a'],b=forms['set-1-mock-b'];
    function validBank(rows,owner){
      return Array.isArray(rows)&&rows.length===110&&
       rows.every(function(q){return q&&q.authorSet===owner&&q.options&&q.options.length===4;})&&
       rows.filter(function(q){return q.scored===true&&q.experimental===false;}).length===100&&
       rows.filter(function(q){return q.scored===false&&q.experimental===true;}).length===10&&
       new Set(rows.map(function(q){return q.qid;})).size===110;
    }
    if(!validBank(a,1)||!validBank(b,1)||!validBank(grok,2)||!validBank(claude,3))
      throw new Error('NPPE release validation failed: expected four complete, isolated 110-item mock banks');
    var old2=catalog.find(function(f){return f.id==='mock-d'&&f.authorSet===2;});
    var old3=catalog.find(function(f){return f.id==='mock-e'&&f.authorSet===3;});
    var oldA=catalog.find(function(f){return f.id==='set-1-mock-a'&&f.authorSet===1;});
    var oldB=catalog.find(function(f){return f.id==='set-1-mock-b'&&f.authorSet===1;});
    if(!old2||!old3||!oldA||!oldB||catalog.some(function(f){return f.id==='mock-c';}))
      throw new Error('NPPE release form catalog does not match approved author ownership');
    function rename(rows,id,sourceName,newName){
      return rows.map(function(q){
        var copy=Object.assign({},q,{form:id});
        if(typeof copy.sourceDocument==='string')
          copy.sourceDocument=copy.sourceDocument.replace(sourceName,newName);
        return copy;
      });
    }
    forms['mock-c']=rename(grok,'mock-c','Set 2, Mock D','Set 2, Mock C');
    forms['mock-d']=rename(claude,'mock-d','Set 3, Mock E','Set 3, Mock D');
    delete forms['mock-e'];
    old2.id='mock-c';old2.label='Mock C';
    old3.id='mock-d';old3.label='Mock D';
    oldA.releaseHold=false;oldB.releaseHold=false;
    exam.formCatalog=catalog.filter(function(f){return f.id!=='set-1-mock-c';});
    b.forEach(function(q){
      q.releaseStatus='released';
      if(typeof q.why==='string')q.why=q.why.replace(/Original held Mock B question|Original Mock B item, release held/g,'Original Mock B practice question');
    });
    if(exam.setPlans&&exam.setPlans[2]){exam.setPlans[2].form='mock-c';exam.setPlans[2].label='Mock C — 110 of 110';}
    if(exam.setPlans&&exam.setPlans[3]){exam.setPlans[3].form='mock-d';exam.setPlans[3].label='Mock D — 110 of 110';}
    exam.mockLaunchable=Object.assign({},exam.mockLaunchable,{'mock-c':true,'mock-d':true});
    delete exam.mockLaunchable['mock-e'];
    exam.bank=forms['mock-c'];
    exam.formatNote='Four complete, original unofficial NPPE practice forms, 110 questions each and 150 minutes timed. 100 questions are scored; ten simulated unscored items are hidden during the sitting. Practice percentages are not official NPPE scaled scores or pass predictions. These questions have not undergone independent legal/engineering validation or empirical calibration.';
    if(exam.formCatalog.length!==6||!exam.formCatalog.every(function(f){return f.id!=='mock-e'&&f.id!=='set-1-mock-c';}))
      throw new Error('Unexpected NPPE release catalog forms');
  })();
`;

const helpers = String.raw`
  // The dark theme's bright teal needs dark text on filled controls. Scope this
  // to the authorized NPPE package, including selected answers and review tabs.
  var nppeContrastStyle=document.createElement('style');
  nppeContrastStyle.id='nppe-control-contrast';
  nppeContrastStyle.textContent="\n/* NPPE's selector is intentionally scoped: other certification simulators retain their styles. */\n.tb-wrap{--nppe-score-good:#146c43;--nppe-score-low:#a52a25}\nhtml[data-theme=\"dark\"] .tb-wrap{--nppe-score-good:#6ee7b7;--nppe-score-low:#fca5a5}\nhtml[data-theme=\"dark\"] .tb-wrap .tb-seg button.on,\nhtml[data-theme=\"dark\"] .btn-teal,\nhtml[data-theme=\"dark\"] .tb-wrap .tb-opt.sel .k,\nhtml[data-theme=\"dark\"] #tb-feedback-loop .tb-review-tabs button.on{color:#082f35}\n.nppe-hub{min-width:0}\n.nppe-hub-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 16px}\n.nppe-hub .tb-title{margin:3px 0 8px}\n.nppe-eyebrow,.nppe-section-label{font-family:\"Work Sans\",sans-serif;letter-spacing:.105em;font-size:10.5px;text-transform:uppercase;font-weight:700;color:var(--muted);margin:0}\n.nppe-hub-intro{font-size:13.5px;line-height:1.6;color:var(--muted);max-width:68ch;margin:0}\n.nppe-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:22px}\n.nppe-fact{min-width:0;border:1px solid var(--line);background:var(--tint);padding:11px 14px;border-radius:10px}\n.nppe-fact strong{display:block;font-family:\"Source Serif 4\",serif;color:var(--ink);font-size:21px;font-weight:650;line-height:1.2}\n.nppe-fact span{display:block;font-size:11.5px;line-height:1.45;color:var(--muted);margin-top:3px}\n.nppe-bank-picker{border:1px solid var(--line);background:var(--card);border-radius:14px;padding:20px;margin:0 0 16px;min-width:0}\n.nppe-picker-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap}\n.nppe-picker-head h3{font-family:\"Source Serif 4\",serif;color:var(--ink);font-size:19px;margin:0}\n.nppe-picker-head p{font-size:12.5px;color:var(--muted);margin:0;line-height:1.5}\n.nppe-author-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;border-bottom:1px solid var(--line);padding-bottom:12px}\n.nppe-author-tab{min-width:0;border:1px solid var(--line);background:var(--tint);color:var(--ink);padding:11px 13px;min-height:57px;border-radius:9px;font:inherit;cursor:pointer;text-align:left;display:flex;flex-direction:column;justify-content:center;gap:2px;transition:border-color .15s,background-color .15s}\n.nppe-author-tab .nppe-tab-number{font-size:10.5px;color:var(--muted);letter-spacing:.05em}\n.nppe-author-tab .nppe-tab-name{font-size:14px;font-weight:700;line-height:1.25}\n.nppe-author-tab:hover{border-color:var(--teal)}\n.nppe-author-tab[aria-selected=\"true\"]{border-color:var(--teal);background:color-mix(in srgb,var(--teal) 9%,var(--card));box-shadow:inset 0 -3px 0 var(--teal)}\n.nppe-hub :is(.nppe-author-tab,.nppe-bank-card,.tb-mstart,.tb-seg button):focus-visible{outline:3px solid var(--teal);outline-offset:3px}\n.nppe-bank-panel{padding-top:16px}\n.nppe-bank-panel[hidden]{display:none!important}\n.nppe-bank-panel-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:12px}\n.nppe-bank-panel-head strong{font-family:\"Work Sans\",sans-serif;font-size:12px;font-weight:700;color:var(--ink)}\n.nppe-bank-panel-head span{font-size:11px;color:var(--muted)}\n.nppe-bank-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}\n.nppe-bank-grid[data-count=\"1\"]{grid-template-columns:minmax(0,1fr);max-width:470px}\n.nppe-bank-card{--nppe-accent:#247188;display:grid;grid-template-columns:40px minmax(0,1fr) auto;align-items:start;gap:10px;text-align:left;width:100%;min-width:0;min-height:122px;padding:16px 13px;border:1px solid var(--line);border-radius:11px;background:var(--paper);font:inherit;color:var(--ink);cursor:pointer;transition:border-color .15s,background-color .15s,box-shadow .15s}\n.nppe-bank-card[data-set=\"set-1-diagnostic\"]{--nppe-accent:#156e98}\n.nppe-bank-card[data-set=\"set-1-learning\"]{--nppe-accent:#72529f}\n.nppe-bank-card[data-set=\"set-1-mock-a\"]{--nppe-accent:#127766}\n.nppe-bank-card[data-set=\"set-1-mock-b\"]{--nppe-accent:#a16a23}\n.nppe-bank-card[data-set=\"mock-c\"]{--nppe-accent:#af4f68}\n.nppe-bank-card[data-set=\"mock-d\"]{--nppe-accent:#5365a2}\n.nppe-bank-card:hover{border-color:var(--nppe-accent);box-shadow:0 4px 16px rgba(0,0,0,.055)}\n.nppe-bank-card[aria-pressed=\"true\"]{border:2px solid var(--nppe-accent);padding:15px 12px;background:color-mix(in srgb,var(--nppe-accent) 6%,var(--paper));box-shadow:0 4px 18px rgba(0,0,0,.04)}\n.nppe-bank-card:disabled{opacity:.55;cursor:not-allowed;box-shadow:none}\n.nppe-bank-symbol{height:39px;width:39px;border-radius:9px;display:grid;place-items:center;font-weight:800;font-size:13px;background:color-mix(in srgb,var(--nppe-accent) 16%,var(--card));color:var(--nppe-accent)}\n.nppe-bank-copy{min-width:0;display:flex;flex-direction:column;gap:4px}\n.nppe-bank-copy .tb-setl{display:block;font-family:\"Source Serif 4\",serif;font-size:19px;font-weight:650;line-height:1.17;color:var(--ink)}\n.nppe-bank-kicker{font-size:10px;font-weight:700;letter-spacing:.085em;text-transform:uppercase;color:var(--muted)}\n.nppe-bank-description{font-size:12px;color:var(--muted);line-height:1.45;overflow-wrap:anywhere;margin-top:2px}\n.nppe-bank-counter{display:flex;align-items:center;gap:3px;flex-direction:column;white-space:nowrap;flex:none}\n.nppe-bank-counter .tb-sets{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--ink)}\n.nppe-bank-counter small{font-size:10px;color:var(--muted)}\n.nppe-bank-selected{grid-column:2/-1;display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--ink);font-weight:700;margin-top:1px}\n.nppe-bank-selected::before{content:\"✓\";font-weight:900;color:var(--nppe-accent)}\n.nppe-launch{border:1px solid var(--line);border-radius:13px;background:var(--tint);padding:20px;margin:0;min-width:0}\n.nppe-launch-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}\n.nppe-launch h3{font-family:\"Source Serif 4\",serif;font-size:22px;color:var(--ink);margin:4px 0 4px}\n.nppe-launch-head p{margin:0;font-size:12.5px;line-height:1.55;color:var(--muted)}\n.nppe-launch-badge{font-size:11px;border-radius:100px;border:1px solid var(--line);background:var(--card);color:var(--ink);padding:6px 10px;font-weight:600}\n.nppe-launch-metrics{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 16px}\n.nppe-launch-metric{display:inline-flex;align-items:baseline;gap:6px;border:1px solid var(--line);background:var(--card);border-radius:8px;padding:7px 10px;font-size:11.5px;color:var(--muted)}\n.nppe-launch-metric strong{color:var(--ink);font-size:12px;font-weight:700}\n.nppe-launch-actions{display:flex;align-items:end;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-top:14px;border-top:1px solid var(--line)}\n.nppe-launch-actions .tb-mode-controls{margin:0}\n.nppe-launch-actions .nppe-session-timing{display:flex;flex-direction:column;gap:7px}\n.nppe-launch-actions .tb-mstart{min-height:44px;padding:11px 18px;font-size:13px;white-space:normal;text-align:center;justify-content:center}\n.nppe-launch-actions .tb-seg button{min-height:42px}\n.nppe-launch-note{margin:11px 0 0;color:var(--muted);font-size:11.5px;line-height:1.5}\n.nppe-disclosure{border-top:1px solid var(--line);padding-top:14px;margin-top:15px;font-size:12px;color:var(--muted)}\n.nppe-disclosure summary{cursor:pointer;color:var(--ink);font-weight:600;line-height:1.4}\n.nppe-disclosure p{max-width:92ch;line-height:1.6;margin:8px 0 0}\n@media(max-width:700px){.nppe-bank-picker,.nppe-launch{padding:16px}.nppe-bank-grid{grid-template-columns:1fr}.nppe-bank-grid[data-count=\"1\"]{max-width:none}.nppe-bank-card{min-height:100px}}\n@media(max-width:460px){.nppe-hub-top{gap:4px}.nppe-hub .tb-title{font-size:23px}.nppe-facts{gap:6px}.nppe-fact{padding:10px 9px}.nppe-fact strong{font-size:19px}.nppe-fact span{font-size:10.5px}.nppe-author-tabs{gap:5px}.nppe-author-tab{padding:10px 8px;min-height:58px}.nppe-author-tab .nppe-tab-name{font-size:12.5px}.nppe-bank-card{grid-template-columns:38px minmax(0,1fr) auto;gap:8px}.nppe-launch-actions{align-items:stretch;flex-direction:column}.nppe-launch-actions .tb-mstart{width:100%}}\n@media(prefers-reduced-motion:reduce){.nppe-author-tab,.nppe-bank-card{transition:none}}\n";
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
    var bankNotes={
      'set-1-diagnostic':'Find your study priorities',
      'set-1-learning':'Build knowledge with explanations',
      'set-1-mock-a':'Full-length practice exam',
      'set-1-mock-b':'A second independent mock',
      'mock-c':'Full-length practice by Grok',
      'mock-d':'Full-length practice by Claude'
    };
    var symbols={'set-1-diagnostic':'Dg','set-1-learning':'L','set-1-mock-a':'A','set-1-mock-b':'B','mock-c':'C','mock-d':'D'};
    var tabs=[1,2,3].map(function(id){
      return '<button type="button" id="nppe-owner-'+id+'" class="nppe-author-tab" data-nppe-owner="'+id+
        '" role="tab" aria-selected="'+(owner===id)+'" aria-controls="nppe-banks-'+id+
        '" tabindex="'+(owner===id?'0':'-1')+'"><span class="nppe-tab-number">Author set '+id+
        '</span><span class="nppe-tab-name">'+names[id]+'</span></button>';
    }).join('');
    var panels=[1,2,3].map(function(id){
      var forms=e.formCatalog.filter(function(f){return f.authorSet===id;});
      var cards=forms.map(function(f){
        var n=formQuestionCount(e,f.id),ready=formReady(e,f.id),isSelected=selectedSet===f.id&&ready;
        var label=f.kind==='mock'?'Full mock exam':f.kind==='learning'?'Guided study':'Diagnostic assessment';
        var countLabel=f.kind==='mock'?'110 questions':n+' of '+(f.target||n)+' planned';
        var aria=f.label+', '+n+' questions'+(ready?'':f.releaseHold?', awaiting release review':', in preparation');
        return '<button type="button" class="nppe-bank-card" data-set="'+esc(f.id)+'" aria-pressed="'+isSelected+
          '" aria-label="'+esc(aria)+'"'+(ready?'':' disabled')+'><span class="nppe-bank-symbol" aria-hidden="true">'+
          esc(symbols[f.id]||f.label.substring(0,1))+'</span><span class="nppe-bank-copy">'+
          '<span class="nppe-bank-kicker">'+label+'</span><span class="tb-setl">'+esc(f.label)+'</span>'+
          '<span class="nppe-bank-description">'+esc(bankNotes[f.id]||'Independent practice questions')+'</span>'+
          '</span><span class="nppe-bank-counter"><span class="tb-sets">'+n+
          '</span><small>questions</small></span>'+
          (isSelected?'<span class="nppe-bank-selected">Selected for practice</span>':'')+'</button>';
      }).join('');
      var heading=id===1?'Diagnostic, learning and two mocks':id===2?'Grok · Mock C':'Claude · Mock D';
      return '<div id="nppe-banks-'+id+'" class="nppe-bank-panel" role="tabpanel" aria-labelledby="nppe-owner-'+id+
        '"'+(owner===id?'':' hidden style="display:none"')+'><div class="nppe-bank-panel-head"><strong>'+
        heading+'</strong><span>'+forms.length+' available bank'+(forms.length===1?'':'s')+'</span></div>'+
        '<div class="nppe-bank-grid" data-count="'+forms.length+'" role="group" aria-label="Choose a '+names[id]+
        ' practice bank">'+cards+'</div></div>';
    }).join('');
    return '<section class="nppe-bank-picker" aria-label="Choose a practice bank"><div class="nppe-picker-head">'+
      '<h3>Choose your question bank</h3><p>One bank per attempt. No mixed questions.</p></div>'+
      '<div class="nppe-author-tabs" role="tablist" aria-label="NPPE author sets">'+tabs+'</div>'+panels+'</section>';
  }
  function wireNPPEOwners(){
    var host=document.getElementById('tb-overview');
    function select(owner){
      var e=EXAMS.nppe,forms=e.formCatalog.filter(function(f){return f.authorSet===owner;}),currentForm=formMeta(e,selectedSet);
      if(!forms.length)return;
      if(!currentForm||currentForm.authorSet!==owner){
        var next=forms.find(function(f){return formReady(e,f.id);})||forms[0];
        selectedSet=next.id;
      }
      renderMain();
      var tab=document.getElementById('nppe-owner-'+owner);
      if(tab)tab.focus({preventScroll:true});
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
    Array.prototype.forEach.call(host.querySelectorAll('[data-set]'),function(button){
      button.addEventListener('click',function(){
        if(button.disabled)return;
        if(newOnlyReservationGate.active)cancelNewOnlyReservationGate();
        selectedSet=button.dataset.set;
        renderMain();
        var newButton=host.querySelector('[data-set="'+selectedSet+'"]');
        if(newButton)newButton.focus({preventScroll:true});
      });
    });
    wirePracticeModes(host.querySelector('.tb-modes'));
  }
  function nppeOverviewHTML(){
    var e=EXAMS.nppe,f=formMeta(e,selectedSet);
    if(!f||!formReady(e,selectedSet)){
      selectedSet='set-1-diagnostic';f=formMeta(e,selectedSet);
    }
    var n=formQuestionCount(e,selectedSet),ready=formReady(e,selectedSet);
    var status=!ready?'In preparation':f.kind==='diagnostic'&&n<f.target?'Partial diagnostic':
      f.kind==='learning'&&n<f.target?'Partial learning bank':'Available for practice';
    return '<div class="nppe-hub">'+
      '<div class="nppe-hub-top"><div><p class="nppe-eyebrow">National Professional Practice Examination</p>'+
      '<h2 class="tb-title">Choose your practice <span class="tb-soon sample">'+status+'</span></h2>'+
      '<p class="nppe-hub-intro">Prepare with two ChatGPT mocks, one Grok mock and one Claude mock. '+
      'Start with the diagnostic or use the learning bank to work on weaker topics.</p></div></div>'+
      '<div class="nppe-facts" aria-label="NPPE practice format">'+
      '<div class="nppe-fact"><strong>4</strong><span>Full-length mock exams</span></div>'+
      '<div class="nppe-fact"><strong>110</strong><span>Questions per mock</span></div>'+
      '<div class="nppe-fact"><strong>150 min</strong><span>Timed mock duration</span></div></div>'+
      nppeSelector(e)+'<div class="tb-modes nppe-modes">'+nppeModes(e)+'</div>'+
      '<details class="nppe-disclosure"><summary>About these practice exams and scoring</summary>'+
      '<p>'+esc(nppeDescription(e,selectedSet))+' Original independent practice material, not affiliated with '+
      'the NPPE programme or any regulator. Practice results are not an official scaled NPPE score or pass prediction.</p>'+
      '</details></div>';
  }
  function nppeModes(e){
    var f=formMeta(e,selectedSet),n=activeBank(e,selectedSet).length,ready=formReady(e,selectedSet);
    if(!f)return '<p>This bank is not ready.</p>';
    var minutes=f.kind==='mock'?150:Math.ceil(n*150/110);
    var details=f.kind==='mock'?'100 scored · 10 simulated unscored':f.kind==='learning'?'Study with answer explanations':'All diagnostic questions scored';
    var author={1:'ChatGPT',2:'Grok',3:'Claude'}[f.authorSet]||'NPPE';
    var statement=f.kind==='learning'?'Untimed mode supports answer reveal while studying.':
      'Questions stay unanswered until submission; full explanations appear afterward.';
    return '<section class="nppe-launch" data-nppe-bank="'+esc(f.id)+'" aria-label="'+esc(f.label)+' session options">'+
      '<div class="nppe-launch-head"><div><p class="nppe-section-label">Your selected bank · '+esc(author)+'</p>'+
      '<h3>'+esc(f.label)+'</h3><p>'+esc(statement)+'</p></div>'+
      '<span class="nppe-launch-badge">'+(ready?'Ready to practise':'Not yet available')+'</span></div>'+
      '<div class="nppe-launch-metrics" aria-label="Session details">'+
      '<span class="nppe-launch-metric"><strong>'+n+'</strong> questions</span>'+
      '<span class="nppe-launch-metric">'+esc(details)+'</span>'+
      '<span class="nppe-launch-metric"><strong>'+minutes+' minutes</strong> timed</span></div>'+
      '<div class="nppe-launch-actions"><div class="nppe-session-timing">'+
      '<span class="nppe-section-label">Choose your timing</span>'+
      '<div class="tb-mode-controls">'+timingControlHTML('full',mode.timed,false)+'</div></div>'+
      liveStart('full','Start '+esc(f.label),!ready)+'</div>'+
      '<p class="nppe-launch-note">'+(mode.timed?'Timed · closed-book practice':'Untimed · no time limit')+
      '. '+(f.kind==='learning'?'Learning mode includes optional assisted reveal.':'No answer reveal during the attempt.')+
      '</p></section>';
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
