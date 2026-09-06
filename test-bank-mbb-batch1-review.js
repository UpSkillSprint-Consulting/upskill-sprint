/* Scoped student-facing accessibility support for the audited Set 2 items only. */
(function(global){
  'use strict';
  var reviewSerial=0;
  function applies(q){return /^mbb:set-2:original-(00[1-9]|01\d|02[0-5])$/.test(q&&q.qid||'');}
  function render(q,renderChart,esc){
    var stem='<div class="tb-stem" data-question-id="'+esc(q.qid)+'">'+esc(q.stem)+'</div>';
    if(!applies(q))return renderChart(q.chart)+stem;
    var context=q.studentContext?'<p class="tb-student-context"><strong>Case assumptions:</strong> '+esc(q.studentContext)+'</p>':'';
    var chart=renderChart(q.chart),extra='';
    if(chart){
      chart=chart.replace('class="tb-q-chart-wrap"','class="tb-q-chart-wrap" tabindex="0" role="group" aria-label="Question visual. Scroll horizontally when needed."');
      extra='<p class="tb-chart-scroll-hint">On a narrow screen, scroll inside the visual to see every column and label.</p>';
    }
    if(q.chart&&(q.chart.type==='regression-diagnostic'||q.chart.type==='time-series')){
      chart=chart.replace('class="tb-q-chart" role="img"','class="tb-q-chart" role="group"');
      var c=q.chart,columns,rows;
      if(c.type==='regression-diagnostic'){columns=[c.xLabel,c.yLabel];rows=c.points.map(function(p){return [p.fitted,p.residual];});}
      else{columns=[c.xLabel,c.yLabel];rows=c.data.map(function(v,i){return [c.labels[i],v];});}
      extra+='<p class="tb-point-readout" data-tb-point-readout aria-live="polite">Focus, tap, or hover over a point to read its values. Arrow keys move between points.</p>';
      extra+='<details class="tb-plot-data"><summary>Read the plotted data as a table</summary>'+renderChart({type:'data-table',columns:columns,rows:rows})+'</details>';
    }
    return stem+context+chart+extra;
  }
  function wire(host){
    var quiz=host.querySelector('.tb-mbb-batch1');if(!quiz)return;
    var flag=quiz.querySelector('[data-flag]');if(flag)flag.setAttribute('aria-pressed',String(flag.classList.contains('on')));
    Array.prototype.forEach.call(quiz.querySelectorAll('[data-opt]'),function(button){button.setAttribute('aria-pressed',String(button.classList.contains('sel')));});
  }
  function review(q){
    if(!applies(q)||!global.__TB)return '';
    function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    var markup=render(q,global.__TB.renderQuestionChart,esc).replace('class="tb-stem"','class="tb-review-stem"');
    if(q.chart&&q.chart.whatIf){var id=esc(q.chart.whatIf.id);markup=markup.split(id).join(id+'-review-'+(++reviewSerial));}
    return '<div class="tb-mbb-batch1">'+markup+'</div>';
  }
  function pointEvent(event){
    var point=event.target.closest&&event.target.closest('circle[tabindex="0"]');
    var parent=point&&point.closest('.tb-mbb-batch1');if(!parent)return;
    var output=parent.querySelector('[data-tb-point-readout]');
    if(output)output.textContent=point.getAttribute('aria-label')||'';
    if(event.type!=='keydown')return;
    var points=Array.prototype.slice.call(parent.querySelectorAll('circle[tabindex="0"]')),index=points.indexOf(point);
    if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();points[(index+1)%points.length].focus();}
    else if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();points[(index+points.length-1)%points.length].focus();}
    else if(event.key==='Enter'||event.key===' '){event.preventDefault();}
  }
  document.addEventListener('input',function(event){
    var slider=event.target;
    if(!slider.matches||!slider.matches('[data-tb-whatif]')||!slider.closest('.tb-mbb-batch1'))return;
    var box=slider.closest('.tb-chart-whatif'),value=Number(slider.value),committed=Number(slider.dataset.committed||0);
    var output=box&&box.querySelector('[data-tb-whatif-value]'),remaining=box&&box.querySelector('[data-tb-whatif-remaining]');
    if(output)output.textContent=String(value);if(remaining)remaining.textContent=String(value-committed);
  });
  ['focusin','pointerover','click','keydown'].forEach(function(type){document.addEventListener(type,pointEvent);});
  global.__TBMbbBatch1Review={applies:applies,render:render,wire:wire,review:review};
})(window);
