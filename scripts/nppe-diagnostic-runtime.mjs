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
  code = once(code, 'function startQuick(){startQuickAfterFresh();}', "function startQuick(){if(current==='nppe')return nppeShortStart('quick');startQuickAfterFresh();}");
  code = once(code, 'function startFocused(){startFocusedAfterFresh();}', "function startFocused(){if(current==='nppe')return nppeShortStart('focus');startFocusedAfterFresh();}");
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
  code = once(code, tag, "(current==='nppe'&&session.kind!=='quick'&&session.kind!=='focus'?'':" + tag + ')');
  code = once(code, "    var deltaTxt=delta!=null?", "    if(current==='nppe')return nppeResults(gradeNotice,breakdown);\n    var deltaTxt=delta!=null?");
  code = once(code, '  function overviewHTML(){', "  function overviewHTML(){if(current==='nppe')return nppeOverviewHTML();");
  code = once(code, "ht.textContent=focusedExam?EXAMS[current].body:'Certification Test Bank';", "ht.textContent=focusedExam?(current==='nppe'?'NPPE Exam Practice':EXAMS[current].body):'Certification Test Bank';");
  code = once(code, "hp.textContent='Choose an exam set or practice mode for this certification. Return to All Certifications to open a different exam.';", "hp.textContent=current==='nppe'?'Choose a question bank and start a timed or untimed session.':'Choose an exam set or practice mode for this certification. Return to All Certifications to open a different exam.';");
  code = once(code, '  function wireOverview(){', "  function wireOverview(){if(current==='nppe')return wireNPPEOwners();");
  code = once(code, "'+sessionTitle+' &middot; '", "'+(current==='nppe'?'NPPE':sessionTitle)+' &middot; '");
  code = once(code, "mode={timed:true,quickTimed:false,focusTimed:false,quickSet:initial,focusSet:initial,quickN:20,focusDom:defaultFocusDomain(EXAMS[current],initial),focusN:20,quickUnseen:false,focusUnseen:false,quickMissed:false,focusMissed:false};selectedSet=initial;}",
    "mode={timed:true,quickTimed:false,focusTimed:false,quickSet:initial,focusSet:initial,quickN:20,focusDom:defaultFocusDomain(EXAMS[current],initial),focusN:20,quickUnseen:false,focusUnseen:false,quickMissed:false,focusMissed:false};selectedSet=initial;if(current==='nppe'){mode.quickN=20;mode.focusN=20;nppeQuizAreas.quick='all';nppeQuizAreas.focus='';}}");
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
  nppeContrastStyle.textContent="\n/* NPPE's selector is intentionally scoped: other certification simulators retain their styles. */\n.tb-wrap{--nppe-score-good:#146c43;--nppe-score-low:#a52a25}\nhtml[data-theme=\"dark\"] .tb-wrap{--nppe-score-good:#6ee7b7;--nppe-score-low:#fca5a5}\nhtml[data-theme=\"dark\"] .tb-wrap .tb-seg button.on,\nhtml[data-theme=\"dark\"] .btn-teal,\nhtml[data-theme=\"dark\"] .tb-wrap .tb-opt.sel .k,\nhtml[data-theme=\"dark\"] #tb-feedback-loop .tb-review-tabs button.on{color:#082f35}\n.nppe-hub{min-width:0}\n.nppe-hub-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 16px}\n.nppe-hub .tb-title{margin:3px 0 8px}\n.nppe-eyebrow,.nppe-section-label{font-family:\"Work Sans\",sans-serif;letter-spacing:.105em;font-size:10.5px;text-transform:uppercase;font-weight:700;color:var(--muted);margin:0}\n.nppe-hub-intro{font-size:13.5px;line-height:1.6;color:var(--muted);max-width:68ch;margin:0}\n.nppe-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:22px}\n.nppe-fact{min-width:0;border:1px solid var(--line);background:var(--tint);padding:11px 14px;border-radius:10px}\n.nppe-fact strong{display:block;font-family:\"Source Serif 4\",serif;color:var(--ink);font-size:21px;font-weight:650;line-height:1.2}\n.nppe-fact span{display:block;font-size:11.5px;line-height:1.45;color:var(--muted);margin-top:3px}\n.nppe-bank-picker{border:1px solid var(--line);background:var(--card);border-radius:14px;padding:20px;margin:0 0 16px;min-width:0}\n.nppe-picker-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap}\n.nppe-picker-head h3{font-family:\"Source Serif 4\",serif;color:var(--ink);font-size:19px;margin:0}\n.nppe-picker-head p{font-size:12.5px;color:var(--muted);margin:0;line-height:1.5}\n.nppe-author-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;border-bottom:1px solid var(--line);padding-bottom:12px}\n.nppe-author-tab{min-width:0;border:1px solid var(--line);background:var(--tint);color:var(--ink);padding:11px 13px;min-height:57px;border-radius:9px;font:inherit;cursor:pointer;text-align:left;display:flex;flex-direction:column;justify-content:center;gap:2px;transition:border-color .15s,background-color .15s}\n.nppe-author-tab .nppe-tab-number{font-size:10.5px;color:var(--muted);letter-spacing:.05em}\n.nppe-author-tab .nppe-tab-name{font-size:14px;font-weight:700;line-height:1.25}\n.nppe-author-tab:hover{border-color:var(--teal)}\n.nppe-author-tab[aria-selected=\"true\"]{border-color:var(--teal);background:color-mix(in srgb,var(--teal) 9%,var(--card));box-shadow:inset 0 -3px 0 var(--teal)}\n.nppe-hub :is(.nppe-author-tab,.nppe-bank-card,.tb-mstart,.tb-seg button):focus-visible{outline:3px solid var(--teal);outline-offset:3px}\n.nppe-bank-panel{padding-top:16px}\n.nppe-bank-panel[hidden]{display:none!important}\n.nppe-bank-panel-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:12px}\n.nppe-bank-panel-head strong{font-family:\"Work Sans\",sans-serif;font-size:12px;font-weight:700;color:var(--ink)}\n.nppe-bank-panel-head span{font-size:11px;color:var(--muted)}\n.nppe-bank-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}\n.nppe-bank-grid[data-count=\"1\"]{grid-template-columns:minmax(0,1fr);max-width:470px}\n.nppe-bank-card{--nppe-accent:#247188;display:grid;grid-template-columns:40px minmax(0,1fr) auto;align-items:start;gap:10px;text-align:left;width:100%;min-width:0;min-height:122px;padding:16px 13px;border:1px solid var(--line);border-radius:11px;background:var(--paper);font:inherit;color:var(--ink);cursor:pointer;transition:border-color .15s,background-color .15s,box-shadow .15s}\n.nppe-bank-card[data-set=\"set-1-diagnostic\"]{--nppe-accent:#156e98}\n.nppe-bank-card[data-set=\"set-1-learning\"]{--nppe-accent:#72529f}\n.nppe-bank-card[data-set=\"set-1-mock-a\"]{--nppe-accent:#127766}\n.nppe-bank-card[data-set=\"set-1-mock-b\"]{--nppe-accent:#a16a23}\n.nppe-bank-card[data-set=\"mock-c\"]{--nppe-accent:#af4f68}\n.nppe-bank-card[data-set=\"mock-d\"]{--nppe-accent:#5365a2}\n.nppe-bank-card:hover{border-color:var(--nppe-accent);box-shadow:0 4px 16px rgba(0,0,0,.055)}\n.nppe-bank-card[aria-pressed=\"true\"]{border:2px solid var(--nppe-accent);padding:15px 12px;background:color-mix(in srgb,var(--nppe-accent) 6%,var(--paper));box-shadow:0 4px 18px rgba(0,0,0,.04)}\n.nppe-bank-card:disabled{opacity:.55;cursor:not-allowed;box-shadow:none}\n.nppe-bank-symbol{height:39px;width:39px;border-radius:9px;display:grid;place-items:center;font-weight:800;font-size:13px;background:color-mix(in srgb,var(--nppe-accent) 16%,var(--card));color:var(--nppe-accent)}\n.nppe-bank-copy{min-width:0;display:flex;flex-direction:column;gap:4px}\n.nppe-bank-copy .tb-setl{display:block;font-family:\"Source Serif 4\",serif;font-size:19px;font-weight:650;line-height:1.17;color:var(--ink)}\n.nppe-bank-kicker{font-size:10px;font-weight:700;letter-spacing:.085em;text-transform:uppercase;color:var(--muted)}\n.nppe-bank-description{font-size:12px;color:var(--muted);line-height:1.45;overflow-wrap:anywhere;margin-top:2px}\n.nppe-bank-counter{display:flex;align-items:center;gap:3px;flex-direction:column;white-space:nowrap;flex:none}\n.nppe-bank-counter .tb-sets{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--ink)}\n.nppe-bank-counter small{font-size:10px;color:var(--muted)}\n.nppe-bank-selected{grid-column:2/-1;display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--ink);font-weight:700;margin-top:1px}\n.nppe-bank-selected::before{content:\"✓\";font-weight:900;color:var(--nppe-accent)}\n.nppe-launch{border:1px solid var(--line);border-radius:13px;background:var(--tint);padding:20px;margin:0;min-width:0}\n.nppe-launch-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}\n.nppe-launch h3{font-family:\"Source Serif 4\",serif;font-size:22px;color:var(--ink);margin:4px 0 4px}\n.nppe-launch-head p{margin:0;font-size:12.5px;line-height:1.55;color:var(--muted)}\n.nppe-launch-badge{font-size:11px;border-radius:100px;border:1px solid var(--line);background:var(--card);color:var(--ink);padding:6px 10px;font-weight:600}\n.nppe-launch-metrics{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 16px}\n.nppe-launch-metric{display:inline-flex;align-items:baseline;gap:6px;border:1px solid var(--line);background:var(--card);border-radius:8px;padding:7px 10px;font-size:11.5px;color:var(--muted)}\n.nppe-launch-metric strong{color:var(--ink);font-size:12px;font-weight:700}\n.nppe-launch-actions{display:flex;align-items:end;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-top:14px;border-top:1px solid var(--line)}\n.nppe-launch-actions .tb-mode-controls{margin:0}\n.nppe-launch-actions .nppe-session-timing{display:flex;flex-direction:column;gap:7px}\n.nppe-launch-actions .tb-mstart{min-height:44px;padding:11px 18px;font-size:13px;white-space:normal;text-align:center;justify-content:center}\n.nppe-launch-actions .tb-seg button{min-height:42px}\n.nppe-launch-note{margin:11px 0 0;color:var(--muted);font-size:11.5px;line-height:1.5}\n.nppe-disclosure{border-top:1px solid var(--line);padding-top:14px;margin-top:15px;font-size:12px;color:var(--muted)}\n.nppe-disclosure summary{cursor:pointer;color:var(--ink);font-weight:600;line-height:1.4}\n.nppe-disclosure p{max-width:92ch;line-height:1.6;margin:8px 0 0}\n@media(max-width:700px){.nppe-bank-picker,.nppe-launch{padding:16px}.nppe-bank-grid{grid-template-columns:1fr}.nppe-bank-grid[data-count=\"1\"]{max-width:none}.nppe-bank-card{min-height:100px}}\n@media(max-width:460px){.nppe-hub-top{gap:4px}.nppe-hub .tb-title{font-size:23px}.nppe-facts{gap:6px}.nppe-fact{padding:10px 9px}.nppe-fact strong{font-size:19px}.nppe-fact span{font-size:10.5px}.nppe-author-tabs{gap:5px}.nppe-author-tab{padding:10px 8px;min-height:58px}.nppe-author-tab .nppe-tab-name{font-size:12.5px}.nppe-bank-card{grid-template-columns:38px minmax(0,1fr) auto;gap:8px}.nppe-launch-actions{align-items:stretch;flex-direction:column}.nppe-launch-actions .tb-mstart{width:100%}}\n@media(prefers-reduced-motion:reduce){.nppe-author-tab,.nppe-bank-card{transition:none}}\n\n\n/* The author colours remain accessible in the dark theme, including small icon glyphs. */\nhtml[data-theme=\"dark\"] .nppe-bank-card[data-set=\"set-1-diagnostic\"]{--nppe-accent:#83cefb}\nhtml[data-theme=\"dark\"] .nppe-bank-card[data-set=\"set-1-learning\"]{--nppe-accent:#c3a7f4}\nhtml[data-theme=\"dark\"] .nppe-bank-card[data-set=\"set-1-mock-a\"]{--nppe-accent:#79ddc3}\nhtml[data-theme=\"dark\"] .nppe-bank-card[data-set=\"set-1-mock-b\"]{--nppe-accent:#f0c681}\nhtml[data-theme=\"dark\"] .nppe-bank-card[data-set=\"mock-c\"]{--nppe-accent:#f3a1b5}\nhtml[data-theme=\"dark\"] .nppe-bank-card[data-set=\"mock-d\"]{--nppe-accent:#b3baff}\n\n\n/* Selected tabs need at least 4.5:1 small-label contrast over the active tint. */\n.nppe-author-tab[aria-selected=\"true\"] .nppe-tab-number{color:var(--ink);font-weight:700}\n\n/* Desktop exam-workspace layout keeps the Start control visible beside bank cards. */\n.nppe-workspace{min-width:0}\n@media(min-width:1050px){\n  .nppe-workspace{display:grid;grid-template-columns:minmax(0,1.83fr) minmax(285px,1fr);align-items:start;gap:15px}\n  .nppe-workspace>.nppe-bank-picker{margin-bottom:0}\n  .nppe-workspace>.nppe-modes{margin:0;min-width:0}\n  .nppe-workspace .nppe-bank-card{padding:13px 11px;min-height:110px;grid-template-columns:36px minmax(0,1fr) auto;gap:8px}\n  .nppe-workspace .nppe-bank-card[aria-pressed=\"true\"]{padding:12px 10px}\n  .nppe-workspace .nppe-bank-symbol{width:35px;height:35px}\n  .nppe-workspace .nppe-bank-picker{padding:17px}\n  .nppe-workspace .nppe-launch{padding:17px}\n  .nppe-workspace .nppe-launch-head h3{margin-top:5px}\n  .nppe-workspace .nppe-launch-actions{align-items:stretch;flex-direction:column}\n  .nppe-workspace .nppe-launch-actions .tb-mstart{width:100%}\n}\n.nppe-fact strong{white-space:nowrap}\n\n\n\n/* NPPE mode cards reuse the same rows, selectors and actions as CRE/PMP/CQE. */\n.nppe-workspace{display:block!important}\n.nppe-workspace>.nppe-bank-picker{margin-bottom:18px}\n.nppe-workspace>.nppe-modes{margin:0;display:grid;gap:12px}\n.nppe-hub .nppe-mode-card{margin:0}\n.nppe-hub .nppe-mode-card .tb-mode-head{margin-bottom:13px}\n.nppe-hub .nppe-mode-card .tb-mode-ic{font-size:17px}\n.nppe-hub .nppe-mode-card .tb-mode-controls.stacked{margin-bottom:13px}\n.nppe-hub .nppe-mode-card .tb-fieldrow-label{width:83px}\n.nppe-hub .nppe-selected-bank{font-size:12px;font-weight:600;color:var(--ink)}\n.nppe-hub .nppe-area-select{min-height:42px;max-width:100%;min-width:205px}\n.nppe-hub .nppe-mode-card .tb-counts{display:flex;flex-wrap:wrap;gap:7px}\n.nppe-hub .nppe-mode-card .tb-count{min-width:45px;min-height:42px}\n.nppe-hub .nppe-mode-card .tb-mode-sum{flex:1 1 260px;line-height:1.6}\n.nppe-hub .nppe-mode-card .tb-mstart{min-height:44px}\n.nppe-hub .nppe-practice-heading{margin:0 0 11px}\n.nppe-hub .nppe-mode-card :is(.nppe-area-select,.tb-count):focus-visible{outline:3px solid var(--teal);outline-offset:2px}\n@media(max-width:560px){\n .nppe-hub .nppe-mode-card .tb-fieldrow{align-items:flex-start;gap:9px}\n .nppe-hub .nppe-mode-card .tb-fieldrow-label{width:65px}\n .nppe-hub .nppe-area-select{min-width:0;width:100%}\n .nppe-hub .nppe-mode-card .tb-fieldrow-value{flex:1;min-width:0}\n .nppe-hub .nppe-mode-card .tb-mode-foot{align-items:stretch;flex-direction:column}\n .nppe-hub .nppe-mode-card .tb-mode-foot .tb-mstart{width:100%;justify-content:center}\n}\n\n/* Bright teal selected-count controls require dark ink in dark mode. */\nhtml[data-theme=\"dark\"] .tb-wrap .nppe-mode-card .tb-count.on[data-nppe-count-kind],\nhtml[data-theme=\"dark\"] .tb-wrap .nppe-mode-card .upskill-contrast-on-light[data-nppe-count-kind]{\n  color:#082f35!important;\n}\n";
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

  // Each original NPPE item is already authored with a six-domain blueprint code and sub ID.
  // An item with conflicting metadata is NEVER silently assigned to another category.
  var NPPE_AREAS=[
    {code:'I',id:'nppe-professionalism',label:'Professionalism'},
    {code:'II',id:'nppe-ethics',label:'Ethics'},
    {code:'III',id:'nppe-practice',label:'Professional Practice'},
    {code:'IV',id:'nppe-law',label:'Law'},
    {code:'V',id:'nppe-professional-law',label:'Professional Law'},
    {code:'VI',id:'nppe-discipline',label:'Regulation and Discipline'}
  ];
    var nppeQuizAreas={quick:'all',focus:''};
  function nppeAreaOf(e,q){
    if(!q||typeof q.blueprint!=='string')return '';
    var match=/^(I|II|III|IV|V|VI)\.[0-9]+(?:\b|$)/.exec(q.blueprint);
    if(!match)return '';
    var area=NPPE_AREAS.find(function(x){return x.code===match[1];});
    if(!area||area.id!==q.sub||domainOf(e,q.sub)!==area.id||
       q.area!=null&&q.area!==area.code)return '';
    return area.id;
  }
  function nppeEligible(e,id){
    var bank=activeBank(e,id);
    if(!formReady(e,id)||bank.some(function(q){return !nppeAreaOf(e,q);}))return [];
    return bank.filter(function(q){return q.scored===true&&q.experimental===false;});
  }
  function nppeShortPool(e,kind){
    var pool=nppeEligible(e,selectedSet),area=nppeQuizAreas[kind];
    return area==='all'&&kind==='quick'?pool:pool.filter(function(q){return nppeAreaOf(e,q)===area;});
  }
  function nppeEnsureAreas(e){
    var pool=nppeEligible(e,selectedSet);
    function hasArea(id){return pool.some(function(q){return nppeAreaOf(e,q)===id;});}
    if(nppeQuizAreas.quick!=='all'&&!hasArea(nppeQuizAreas.quick))nppeQuizAreas.quick='all';
    if(!hasArea(nppeQuizAreas.focus)){
      var first=NPPE_AREAS.find(function(area){return hasArea(area.id);});
      nppeQuizAreas.focus=first?first.id:'';
    }
  }
  function nppeAreaChoices(e,kind){
    var pool=nppeEligible(e,selectedSet),isQuick=kind==='quick';
    var entries=(isQuick?[{code:'',id:'all',label:'All six areas'}]:[]).concat(NPPE_AREAS);
    var options=entries.map(function(a){
      var count=a.id==='all'?pool.length:pool.filter(function(q){return nppeAreaOf(e,q)===a.id;}).length;
      var selected=nppeQuizAreas[kind]===a.id;
      return '<option value="'+esc(a.id)+'"'+(selected?' selected':'')+(count?'':' disabled')+'>'+
        esc((a.code?a.code+' ':'')+a.label)+' ('+count+')</option>';
    }).join('');
    return '<select class="tb-select nppe-area-select" data-nppe-area-kind="'+kind+
      '" aria-label="'+(isQuick?'Quick Quiz':'Focused Quiz')+' Body of Knowledge area">'+options+'</select>';
  }
  function nppeCountChoices(kind,count){
    return '<span class="tb-counts" role="group" aria-label="'+(kind==='quick'?'Quick Quiz':'Focused Quiz')+
      ' question count">'+[10,20,30,50].map(function(n){
      return '<button type="button" data-nppe-count-kind="'+kind+'" data-nppe-count="'+n+
        '" class="tb-count'+(count===n?' on':'')+'" aria-pressed="'+(count===n)+'">'+n+'</button>';
    }).join('')+'</span>';
  }
  function nppeShortStart(kind){
    var e=EXAMS.nppe,id=selectedSet,f=formMeta(e,id);
    if((kind!=='quick'&&kind!=='focus')||!f||!formReady(e,id))return false;
    nppeEnsureAreas(e);
    var area=nppeQuizAreas[kind],pool=nppeShortPool(e,kind);
    if(!pool.length||kind==='focus'&&!NPPE_AREAS.some(function(x){return x.id===area;})||
       kind==='quick'&&area!=='all'&&!NPPE_AREAS.some(function(x){return x.id===area;}))return false;
    var desired=kind==='quick'?mode.quickN:mode.focusN,limit=Math.min(desired,pool.length);
    if(!Number.isInteger(desired)||![10,20,30,50].includes(desired)||limit<1)return false;
    var picked=[];
    if(kind==='focus'){
      // Prefer previously missed questions in this same bank AND area when history is available.
      // Never mix in other forms or use a missed-item pool to defeat access/area restrictions.
      var allowed=new Set(pool);
      var missed=missedOnly(pool).filter(function(q){return allowed.has(q);});
      shuffle(missed);picked=missed.slice(0,limit);
      var selectedIds=new Set(picked.map(function(q){return q.qid;}));
      var remaining=pool.filter(function(q){return !selectedIds.has(q.qid);});
      shuffle(remaining);picked=picked.concat(remaining.slice(0,limit-picked.length));
    }else{picked=shuffle(pool.slice()).slice(0,limit);}
    if(picked.length!==limit||new Set(picked.map(function(q){return q.qid;})).size!==limit||
       picked.some(function(q){return q.form!==id||q.authorSet!==f.authorSet||q.scored!==true||q.experimental!==false||
       area!=='all'&&nppeAreaOf(e,q)!==area;}))return false;
    return beginSession(e,picked,kind,kind==='quick'?mode.quickTimed:mode.focusTimed,
      Math.round(picked.length*150*60/110),null,id);
  }

  function nppeSelector(e){
    var selected=formMeta(e,selectedSet),owner=selected?selected.authorSet:1;
    var names={1:'Set #1',2:'Set #2',3:'Set #3'};
    var bankNotes={
      'set-1-diagnostic':'Find your study priorities',
      'set-1-learning':'Build knowledge with explanations',
      'set-1-mock-a':'Full-length practice exam',
      'set-1-mock-b':'A second independent mock',
      'mock-c':'Full-length practice exam',
      'mock-d':'Full-length practice exam'
    };
    var symbols={'set-1-diagnostic':'Dg','set-1-learning':'L','set-1-mock-a':'A','set-1-mock-b':'B','mock-c':'C','mock-d':'D'};
    var tabs=[1,2,3].map(function(id){
      return '<button type="button" id="nppe-owner-'+id+'" class="nppe-author-tab" data-nppe-owner="'+id+
        '" role="tab" aria-selected="'+(owner===id)+'" aria-controls="nppe-banks-'+id+
        '" tabindex="'+(owner===id?'0':'-1')+'"><span class="nppe-tab-name">Set #'+id+'</span></button>';
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
      var heading=id===1?'Diagnostic, learning and two mocks':id===2?'Mock C':'Mock D';
      return '<div id="nppe-banks-'+id+'" class="nppe-bank-panel" role="tabpanel" aria-labelledby="nppe-owner-'+id+
        '"'+(owner===id?'':' hidden style="display:none"')+'><div class="nppe-bank-panel-head"><strong>'+
        heading+'</strong><span>'+forms.length+' available bank'+(forms.length===1?'':'s')+'</span></div>'+
        '<div class="nppe-bank-grid" data-count="'+forms.length+'" role="group" aria-label="Choose a '+names[id]+
        ' practice bank">'+cards+'</div></div>';
    }).join('');
    return '<section class="nppe-bank-picker" aria-label="Choose a practice bank"><div class="nppe-picker-head">'+
      '<h3>Choose your question bank</h3><p>One bank per attempt. No mixed questions.</p></div>'+
      '<div class="nppe-author-tabs" role="tablist" aria-label="NPPE question sets">'+tabs+'</div>'+panels+'</section>';
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

    Array.prototype.forEach.call(host.querySelectorAll('select[data-nppe-area-kind]'),function(select){
      select.addEventListener('change',function(){
        var kind=select.dataset.nppeAreaKind,id=select.value;
        if(!['quick','focus'].includes(kind))return;
        nppeQuizAreas[kind]=id;
        renderMain();
        var next=host.querySelector('select[data-nppe-area-kind="'+kind+'"]');
        if(next)next.focus({preventScroll:true});
      });
    });
    Array.prototype.forEach.call(host.querySelectorAll('[data-nppe-count-kind]'),function(button){
      button.addEventListener('click',function(){
        var kind=button.dataset.nppeCountKind,n=Number(button.dataset.nppeCount);
        if(!['quick','focus'].includes(kind)||![10,20,30,50].includes(n))return;
        if(kind==='quick')mode.quickN=n;else mode.focusN=n;
        renderMain();
        var next=host.querySelector('[data-nppe-count-kind="'+kind+'"][data-nppe-count="'+n+'"]');
        if(next)next.focus({preventScroll:true});
      });
    });
    wirePracticeModes(host.querySelector('.tb-modes'));
  }
  function nppeOverviewHTML(){
    var e=EXAMS.nppe,f=formMeta(e,selectedSet);
    // Only an unknown initial set receives a default. An incomplete or invalid selected
    // form stays selected with its Start control disabled; never substitute Diagnostic.
    if(!f){selectedSet='set-1-diagnostic';f=formMeta(e,selectedSet);}
    var n=formQuestionCount(e,selectedSet),ready=formReady(e,selectedSet);
    var status=!ready?'In preparation':f.kind==='diagnostic'&&n<f.target?'Partial diagnostic':
      f.kind==='learning'&&n<f.target?'Partial learning bank':'Available for practice';
    return '<div class="nppe-hub">'+
      '<div class="nppe-hub-top"><div><p class="nppe-eyebrow">NPPE · Original practice</p>'+
      '<h2 class="tb-title">Choose your practice <span class="tb-soon sample">'+status+'</span></h2>'+
      '<p class="nppe-hub-intro">Four full mock exams plus Diagnostic and Learning. Choose a bank to begin.</p></div></div>'+
      '<div class="nppe-facts" role="group" aria-label="NPPE practice format">'+
      '<div class="nppe-fact"><strong>4</strong><span>Full mock exams</span></div>'+
      '<div class="nppe-fact"><strong>110</strong><span>Questions each</span></div>'+
      '<div class="nppe-fact"><strong>150</strong><span>Minutes per mock</span></div></div>'+
      '<div class="nppe-workspace">'+nppeSelector(e)+'<div class="tb-modes nppe-modes">'+nppeModes(e)+'</div></div>'+
      '<details class="nppe-disclosure"><summary>About these practice exams and scoring</summary>'+
      '<p>'+esc(nppeDescription(e,selectedSet))+' Original independent practice material, not affiliated with '+
      'the NPPE programme or any regulator. Practice results are not an official scaled NPPE score or pass prediction.</p>'+
      '</details></div>';
  }

  function nppeModes(e){
    nppeEnsureAreas(e);
    return '<div class="tb-sec nppe-practice-heading">Practice modes</div>'+
      nppeFullModeHTML(e)+nppeShortModeHTML(e,'quick')+nppeShortModeHTML(e,'focus');
  }
  function nppeFullModeHTML(e){
    var f=formMeta(e,selectedSet),n=activeBank(e,selectedSet).length,ready=formReady(e,selectedSet);
    if(!f)return '<p>This bank is not ready.</p>';
    var minutes=f.kind==='mock'?150:Math.ceil(n*150/110);
    var hint=f.kind==='mock'?'100 scored · 10 simulated unscored':f.kind==='learning'?
      'Untimed Learning offers optional answer reveal.':'All Diagnostic questions are scored.';
    return '<section class="tb-mode nppe-mode-card" data-nppe-bank="'+esc(f.id)+'" aria-label="'+esc(f.label)+' Full Exam">'+
      '<div class="tb-mode-head"><span class="tb-mode-ic" aria-hidden="true">▤</span><div>'+
      '<h4>'+esc(f.label)+' — Full Exam</h4><p>'+n+' questions from '+esc(f.label)+' only. '+hint+'</p>'+
      '</div></div><div class="tb-mode-controls">'+timingControlHTML('full',mode.timed)+'</div>'+
      '<div class="tb-mode-foot"><span class="tb-mode-sum">'+
      (mode.timed?'Strict <b>'+minutes+' minutes</b> · closed-book practice':'<b>Untimed</b> · work at your own pace')+
      '</span>'+liveStart('full','Start '+esc(f.label),!ready)+'</div></section>';
  }
  function nppeShortModeHTML(e,kind){
    var f=formMeta(e,selectedSet),ready=!!f&&formReady(e,selectedSet);
    if(!f)return '<p>Choose a bank above to begin.</p>';
    var quick=kind==='quick',label=quick?'Quick Quiz':'Focused Quiz';
    var desired=quick?mode.quickN:mode.focusN,timed=quick?mode.quickTimed:mode.focusTimed;
    var pool=nppeShortPool(e,kind),count=Math.min(pool.length,desired);
    var duration=fmtQuizDuration(Math.round(count*150*60/110)),areaId=nppeQuizAreas[kind];
    var subject=NPPE_AREAS.find(function(a){return a.id===areaId;});
    var areaName=areaId==='all'?'All six areas':subject?subject.code+' '+subject.label:'No available area';
    var description=quick?'A randomized quiz from your selected NPPE area or all six areas.':
      'Drill one Body of Knowledge area. Previously missed questions are prioritised when available.';
    return '<section class="tb-mode nppe-mode-card" data-nppe-bank="'+esc(f.id)+
      '" data-nppe-quiz-kind="'+kind+'" aria-label="'+esc(f.label)+' '+label+'">'+
      '<div class="tb-mode-head"><span class="tb-mode-ic" aria-hidden="true">'+(quick?'⚡':'◎')+
      '</span><div><h4>'+label+'</h4><p>'+description+'</p></div></div>'+
      '<div class="tb-mode-controls stacked">'+
      '<div class="tb-fieldrow"><span class="tb-fieldrow-label">Bank</span>'+
      '<div class="tb-fieldrow-value nppe-selected-bank">'+esc(f.label)+'</div></div>'+
      '<div class="tb-fieldrow"><label class="tb-fieldrow-label" for="nppe-area-'+kind+'">Area</label>'+
      '<div class="tb-fieldrow-value">'+nppeAreaChoices(e,kind).replace('data-nppe-area-kind="'+kind+'"','id="nppe-area-'+kind+'" data-nppe-area-kind="'+kind+'"')+'</div></div>'+
      '<div class="tb-fieldrow"><span class="tb-fieldrow-label">Questions</span><div class="tb-fieldrow-value">'+
      nppeCountChoices(kind,desired)+'</div></div>'+
      '<div class="tb-fieldrow"><span class="tb-fieldrow-label">Timing</span><div class="tb-fieldrow-value">'+
      timingControlHTML(kind,timed,false)+'</div></div></div>'+
      '<div class="tb-mode-foot"><span class="tb-mode-sum" aria-live="polite">'+
      (count?'<b>'+count+'</b> question'+(count===1?'':'s')+' from <b>'+esc(areaName)+'</b> in <b>'+esc(f.label)+'</b>'+
        (timed?' · '+duration+' time limit':' · Untimed'):'No eligible scored questions in this area.')+
      (pool.length&&pool.length<desired?' · '+pool.length+' available in this selection.':'')+
      (f.kind==='mock'?' Simulated unscored mock items are excluded.':'')+
      '</span>'+liveStart(kind,'Start quiz',!ready||!count)+'</div></section>';
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
    var shortKind=session.kind==='quick'||session.kind==='focus';
    var quizLabel=session.kind==='quick'?'Quick Quiz':'Focused Quiz';
    var areaId=shortKind?nppeQuizAreas[session.kind]:'';
    var area=NPPE_AREAS.find(function(a){return a.id===areaId;});
    var subjectName=areaId==='all'?'All areas':area?area.code+' '+area.label:'';
    var resultHeading=shortKind?(f?f.label:'NPPE')+' · '+quizLabel+(subjectName?' · '+subjectName:''):f?f.label:'NPPE';
    var retakeLabel=shortKind?quizLabel:f?f.label:'bank';
    return '<div class="tb-resbar"><button type="button" class="tb-ghost" data-back>&larr; Back to NPPE banks</button><span class="tb-restag">'+esc(f?f.label:'NPPE')+' result</span></div><h2>'+esc(resultHeading)+' — study feedback</h2>'+gradeNotice+'<p class="tb-srnote">'+(shortKind?'Only eligible scored questions from the selected bank and area are included. '+
       (f&&f.kind==='mock'?'Simulated unscored mock items are excluded. ':''):isDiagnostic?'This diagnostic reports only the questions in this attempt. Small domain samples are starting points for study, not proof of mastery. ':isLearning?'Learning scores measure practice accuracy. Any revealed answers are assisted practice and must not be treated as unseen readiness evidence. ':(session.kind==='quick'||session.kind==='focus'?'Each short-practice question counts toward the quiz score; simulated unscored mock items are excluded. ':'Scored results exclude the ten simulated unscored items. ' ))+'A raw practice percentage is not an official scaled NPPE score, a pass probability or a guarantee. Difficulty has not been empirically calibrated.</p><div class="tb-sec">This attempt: domain breakdown</div><div class="tb-breakdown">'+breakdown+'</div><button type="button" class="tb-ghost" data-retake>Retake '+esc(retakeLabel)+'</button><p class="tb-srnote">Retakes repeat this bank; they are not fresh readiness evidence. Results remain in this tab only and are lost when you leave or refresh.</p>';
  }
`;
