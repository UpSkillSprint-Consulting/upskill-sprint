from pathlib import Path
p=Path('test-bank.html')
s=p.read_text()
def one(a,b):
 global s
 assert s.count(a)==1,(a[:180],s.count(a))
 s=s.replace(a,b)
one("var selectedSet='1'; /* '1' | '2' | 'mix' — only exams with e.sets[2] expose the choice */", "var selectedSet='1'; /* Full Exam selection; Quick and Focused keep their own mode choices. */")
one("""  function activeBank(e){
    if(!hasTwoSets(e))return e.bank||[];
    var s=e.sets;
    if(selectedSet==='2')return s[2];
    if(selectedSet==='3'&&s[3])return s[3];
    if(selectedSet==='mix')return uniqueQuestionPool(s[3]?s[1].concat(s[2],s[3]):s[1].concat(s[2]));
    return s[1];
  }""", """  function availableSetIds(e){
    var ids=Object.keys(e&&e.sets||{}).filter(function(id){return /^\\d+$/.test(id)&&Array.isArray(e.sets[id])&&e.sets[id].length;}).sort(function(a,b){return Number(a)-Number(b);});
    return ids.length?ids:(hasBank(e)?['1']:[]);
  }
  function activeBank(e,setId){
    var ids=availableSetIds(e);
    if(!ids.length)return [];
    setId=setId==null?selectedSet:String(setId);
    if(setId==='mix')return uniqueQuestionPool(ids.reduce(function(rows,id){return rows.concat(e.sets&&e.sets[id]||e.bank||[]);},[]));
    if(ids.indexOf(setId)<0)setId=ids[0];
    return e.sets&&e.sets[setId]||e.bank||[];
  }""")
one("function setLabel(){return selectedSet==='2'?'Set 2':selectedSet==='3'?'Set 3':selectedSet==='mix'?'Mixed (all sets)':'Set 1';}", "function setLabel(setId){setId=setId==null?selectedSet:String(setId);return setId==='mix'?'Mixed (all sets)':'Set '+setId;}")
one("function activeSetLabel(e){return hasTwoSets(e)?setLabel():(e.setName||'Live');}","function activeSetLabel(e,setId){return hasTwoSets(e)?setLabel(setId):(e.setName||'Set 1');}")
one("var note=selectedSet==='mix'?'Questions are drawn at random from all sets, regardless of which set they came from.':selectedSet==='3'?'Practice draws only from Set 3 questions.':selectedSet==='2'?'Practice draws only from Set 2 questions.':'Practice draws only from Set 1 questions.';", "var note=selectedSet==='mix'?'The Full Exam draws questions from all available sets.':'The Full Exam draws only from '+setLabel()+' questions.';")
one("<div class=\"tb-setpick-lab\">Question set</div>", "<div class=\"tb-setpick-lab\">Full Exam test set</div>")
one('aria-label="Choose question set"','aria-label="Choose Full Exam question set"')
one("question'+(currentFullCount===1?'':'s')+'.</p></div>';", "question'+(currentFullCount===1?'':'s')+'. Quick and Focused quizzes have their own test-set buttons below.</p></div>';")
a='quickTimed:false,focusTimed:false,quickN:20'
assert s.count(a)==2
s=s.replace(a,"quickTimed:false,focusTimed:false,quickSet:'1',focusSet:'1',quickN:20")
anchor="  function counts(kind,val){"
assert s.count(anchor)==1
addition="""  function quizSetControlHTML(e,kind){
    var ids=availableSetIds(e);
    if(!ids.length)return '';
    var selected=kind==='quick'?mode.quickSet:mode.focusSet;
    var choices=ids.length>1?ids.concat('mix'):ids;
    if(choices.indexOf(selected)<0)selected=ids[0];
    if(kind==='quick')mode.quickSet=selected;else mode.focusSet=selected;
    var label=kind==='quick'?'Quick Quiz':'Focused Quiz';
    return '<div class="tb-fieldrow"><span class="tb-fieldrow-label">Test set</span><div class="tb-fieldrow-value">'+
      '<div class="tb-quiz-set-choices" role="group" aria-label="'+label+' test set" data-quiz-set-group="'+kind+'">'+
      choices.map(function(id){return '<button type="button" class="tb-count'+(selected===id?' on':'')+'" data-quiz-set-kind="'+kind+'" data-quiz-set="'+id+'" aria-pressed="'+(selected===id)+'" title="'+activeBank(e,id).length+' available questions">'+(id==='mix'?'Mixed':'Set '+id)+'</button>';}).join('')+
      '</div></div></div>';
  }
  function wireQuizSetKeyboard(group){
    group.addEventListener('keydown',function(event){
      if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].indexOf(event.key)<0)return;
      var buttons=Array.prototype.slice.call(group.querySelectorAll('[data-quiz-set]'));
      var index=buttons.indexOf(event.target);if(index<0)return;
      event.preventDefault();
      var next=event.key==='Home'?0:event.key==='End'?buttons.length-1:
        (index+((event.key==='ArrowLeft'||event.key==='ArrowUp')?-1:1)+buttons.length)%buttons.length;
      buttons[next].click();
    });
  }
"""
s=s.replace(anchor,addition+anchor)
one("var quickPoolTotal=live?activeBank(e).length:mode.quickN;","var quickSetControls=quizSetControlHTML(e,'quick');\n    var quickPoolTotal=live?activeBank(e,mode.quickSet).length:mode.quickN;")
one("var focusPoolTotal=live?activeBank(e).filter(function(q){return domainOf(e,q.sub)===mode.focusDom;}).length:mode.focusN;","var focusSetControls=quizSetControlHTML(e,'focus');\n    var focusPoolTotal=live?activeBank(e,mode.focusSet).filter(function(q){return domainOf(e,q.sub)===mode.focusDom;}).length:mode.focusN;")
lines=s.splitlines(True)
for i,l in enumerate(lines):
 if "quickEffN+'</b> question" in l and 'activeSetLabel(e)' in l: lines[i]=l.replace('activeSetLabel(e)','activeSetLabel(e,mode.quickSet)')
 if "focusPoolTotal<mode.focusN?'up to" in l: lines[i]=l.replace('activeSetLabel(e)','activeSetLabel(e,mode.focusSet)')
s=''.join(lines)
one("if(mode.focusUnseen&&newOnlyReservationGate.error)focusSum+=", "if(live&&!mode.focusUnseen&&!mode.focusMissed&&focusPoolTotal===0)focusSum='No questions are available in <b>'+esc(focusName)+'</b> for <b>'+esc(activeSetLabel(e,mode.focusSet))+'</b>. Choose another area or test set.';\n    if(mode.focusUnseen&&newOnlyReservationGate.error)focusSum+=")
for kind in ('quick','focus'):
 needle="'<div class=\"tb-mode-controls stacked\" data-unseen-active=\"'+(!!mode."+kind+"Unseen)+'\" data-missed-active=\"'+(!!mode."+kind+"Missed)+'\">'+"
 one(needle,needle+kind+"SetControls+")
one("liveStart('focus',newOnlyReservationGate.active?'Reserving…':'Start quiz',(mode.focusUnseen", "liveStart('focus',newOnlyReservationGate.active?'Reserving…':'Start quiz',(!mode.focusUnseen&&!mode.focusMissed&&focusPoolTotal===0)||(mode.focusUnseen")
one("""  function wirePracticeModes(host){
    if(!host)return;""", """  function wirePracticeModes(host){
    if(!host)return;
    Array.prototype.forEach.call(host.querySelectorAll('[data-quiz-set-kind]'),function(button){button.addEventListener('click',function(){
      var kind=button.dataset.quizSetKind,id=button.dataset.quizSet;
      if(newOnlyReservationGate.active)cancelNewOnlyReservationGate();
      if(kind==='quick')mode.quickSet=id;else mode.focusSet=id;
      // Repaint controls, not the whole page, and keep keyboard focus on the choice.
      refreshPracticeModes('[data-quiz-set-kind="'+kind+'"][data-quiz-set="'+id+'"]');
    });});
    Array.prototype.forEach.call(host.querySelectorAll('[data-quiz-set-group]'),wireQuizSetKeyboard);""")
one("All three modes run live on '+esc(examNoun(e))+' \\u2014 the current '+fullExamCount(e)+'-question Full Exam, quick quizzes, and focused single-area drills.","Full Exam uses '+esc(examNoun(e))+' ('+fullExamCount(e)+' questions). Choose a test set separately inside Quick Quiz and Focused Quiz.")
one("function beginSession(e,items,kind,timed,limitSeconds,filter){\n    buildTools();","function beginSession(e,items,kind,timed,limitSeconds,filter,setId){\n    if(!items||!items.length)return false;\n    setId=filter?'mix':String(setId==null?(kind==='quick'?mode.quickSet:kind==='focus'?mode.focusSet:selectedSet):setId);\n    buildTools();")
one("setId:filter?'mix':String(selectedSet)","setId:setId")
one("session={id:learningSessionId,kind:kind,filter", "session={id:learningSessionId,kind:kind,setId:setId,filter")
one("mode.quickMissed?missedOnly(mixedBank(e)):activeBank(e).slice()", "mode.quickMissed?missedOnly(mixedBank(e)):activeBank(e,mode.quickSet).slice()")
one("mode.focusMissed?missedOnly(mixedBank(e)):activeBank(e)","mode.focusMissed?missedOnly(mixedBank(e)):activeBank(e,mode.focusSet)")
one("if((mode.focusUnseen||mode.focusMissed)&&!qs.length)return;","if(!qs.length)return;")
one("var e=EXAMS[current],b=activeBank(e),limit=Math.min(10,b.length),picks=[];", "var practiceSet=view==='results'&&session?session.setId:selectedSet;\n    var e=EXAMS[current],b=activeBank(e,practiceSet),limit=Math.min(10,b.length),picks=[];")
one("beginSession(e,picks,'practice',false,null);","beginSession(e,picks,'practice',false,null,null,practiceSet);")
one("return {sessionId:session.id,examId:current,completed:!!session.completed,", "return {sessionId:session.id,examId:current,setId:session.setId,completed:!!session.completed,")
one("<div class=\"tb-diag-kick\">'+sessionTitle+(session.kind", "<div class=\"tb-diag-kick\">'+sessionTitle+' &middot; '+esc(activeSetLabel(EXAMS[current],session.setId))+(session.kind")
one("var gradeNotice='<div class=\"tb-score-result\" data-score-result data-score-percent=", "var gradeNotice='<div class=\"tb-score-result\" data-score-result data-session-set=\"'+esc(session.setId)+'\" data-score-percent=")
one("'+score.total+')</strong><p>'+targetText", "'+score.total+')</strong><p class=\"tb-result-set\">Test set: '+esc(activeSetLabel(EXAMS[current],session.setId))+'</p><p>'+targetText")
one("  .tb-counts{display:inline-flex;gap:6px}", """  .tb-counts{display:inline-flex;gap:6px}
  .tb-mode-controls.stacked .tb-fieldrow{width:100%;min-width:0}
  .tb-quiz-set-choices{display:flex;flex-wrap:wrap;gap:6px;min-width:0;max-width:100%}
  .tb-quiz-set-choices .tb-count{min-height:44px;min-width:56px;white-space:normal;transform:none}
  .tb-quiz-set-choices .tb-count:focus-visible{outline:2px solid var(--teal);outline-offset:2px}
  @media(max-width:420px){.tb-mode-controls.stacked .tb-fieldrow{gap:8px}.tb-mode-controls.stacked .tb-fieldrow-label{width:68px}.tb-mode-controls.stacked .tb-counts{flex-wrap:wrap}.tb-mode-controls.stacked .tb-select{min-width:0;max-width:100%}}
""".rstrip())
p.write_text(s)
