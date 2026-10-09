/*
 * CRE question visuals for the test bank.
 *
 * The engine's renderQuestionChart() hands any chart whose type starts with "cre-" to
 * window.__CREVisuals.render(chart). Each renderer returns a complete chart wrapper
 * (eyebrow + SVG) built only from numbers and text in the question data; every string is
 * escaped, and no answer key is read or exposed. Colors come from the engine's chart
 * classes and CSS custom properties, so light and dark themes both work.
 *
 * Types:
 *   cre-prob-tree     probability / event tree with branch probabilities and outcomes
 *   cre-weibull-plot  Weibull probability paper with data points and a fitted line
 *   cre-lognormal-plot lognormal probability paper (log time, normal-quantile scale)
 *   cre-xy-plot       linear x–y plot with explicit round ticks and labelled points;
 *                     a series with line:false is a scatter, dashed:true a fitted/reference line
 *   cre-box-plot      horizontal box-and-whisker plots by group, with outliers
 *   cre-rbd           reliability block diagram: stages in series, blocks in parallel within a
 *                     stage, with an optional note per stage (e.g. "2 of 3 required")
 */
(function(global){
  'use strict';

  function esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function num(v){var n=Number(v);return Number.isFinite(n)?n:null;}
  function fmt(v){
    var n=Number(v);
    if(!Number.isFinite(n))return '';
    return n>=1000?n.toLocaleString('en-US',{maximumFractionDigits:0}):String(n);
  }

  var STYLE_ID='cre-visuals-style';
  function ensureStyle(){
    if(typeof document==='undefined'||document.getElementById(STYLE_ID))return;
    var style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '.cre-chart{min-width:280px}',
      '.cre-chart-wide{min-width:520px}',
      '.cre-scroll-hint{display:none;margin:0 0 8px;font-size:12.5px;line-height:1.5;color:var(--muted)}',
      '@media (max-width:600px){.cre-scroll-hint{display:block}}',
      '.cre-node rect{fill:var(--card);stroke:var(--ink);stroke-width:1.2}',
      '.cre-node text{fill:var(--ink);font-size:11.5px}',
      '.cre-node-root rect{fill:color-mix(in srgb,#6656b5 18%,var(--card))}',
      '.cre-out rect{stroke-width:1.2}',
      '.cre-out-scrap rect{fill:color-mix(in srgb,#c0453f 20%,var(--card));stroke:#c0453f}',
      '.cre-out-ship rect{fill:color-mix(in srgb,#0e8f86 18%,var(--card));stroke:#0e8f86}',
      '.cre-out text{fill:var(--ink);font-size:11px;font-weight:700}',
      '.cre-edge{stroke:var(--muted);stroke-width:1.4;fill:none}',
      '.cre-edge-tail{stroke:var(--muted);stroke-width:1.1;stroke-dasharray:3 3;fill:none}',
      '.cre-prob{fill:var(--ink);font-size:11px;font-weight:700;paint-order:stroke;stroke:var(--tint);stroke-width:4px;stroke-linejoin:round}',
      '.cre-axis-label{fill:var(--muted);font-size:10px}',
      '.cre-tick{fill:var(--muted);font-size:9.5px}',
      '.cre-title{fill:var(--ink);font-size:11.5px;font-weight:700}',
      '.cre-marker{fill:var(--ink);font-size:10px;font-weight:700;paint-order:stroke;stroke:var(--tint);stroke-width:4px;stroke-linejoin:round}',
      '.cre-ref{stroke:var(--muted);stroke-width:1.1;stroke-dasharray:5 4}',
      /* Display math in CRE Set 1 (guide §22.3): keep equations full size; if a line is wider than a
         phone card, scroll it inside a focusable region instead of shrinking the SVG. */
      ':is(.tb-quiz,.tb-review-card)[data-question-id^="cre:set-1:"] mjx-container[display="true"]{max-width:100%;overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;padding:4px 0;color:var(--ink)}',
      /* scoped under the page IDs so it outranks #tb-feedback-loop svg{max-width:100%} without !important */
      ':is(#tb-overview,#tb-feedback-loop,body) :is(.tb-quiz,.tb-review-card)[data-question-id^="cre:set-1:"] mjx-container[display="true"] > svg{max-width:none}',
      ':is(.tb-quiz,.tb-review-card)[data-question-id^="cre:set-1:"] mjx-container[display="true"]:focus-visible{outline:2px solid var(--teal);outline-offset:2px}',
      /* Wide exhibit tables: the deciding columns may start off-screen on a phone, so say so. */
      '@media (max-width:600px){:is(.tb-quiz,.tb-review-card)[data-question-id^="cre:set-1:"] .tb-q-chart-wrap:has(table.tb-q-data-table th:nth-child(4))::before{content:"Swipe sideways to see every column.";display:block;margin:0 0 8px;font-size:12.5px;line-height:1.5;color:var(--muted)}}',
      ':is(.tb-quiz,.tb-review-card)[data-question-id^="cre:set-1:"] .tb-q-chart-wrap[data-cre-table]:focus-visible{outline:2px solid var(--teal);outline-offset:2px}',
      '.cre-rbd-block rect{fill:color-mix(in srgb,#2c8fa6 14%,var(--card));stroke:var(--ink);stroke-width:1.2}',
      '.cre-rbd-block text{fill:var(--ink);font-size:11px}',
      '.cre-rbd-block .cre-rbd-r{font-weight:700}',
      '.cre-rbd-wire{stroke:var(--muted);stroke-width:1.4;fill:none}',
      '.cre-rbd-node{fill:var(--ink)}',
      '.cre-rbd-note{fill:var(--muted);font-size:10.5px;font-weight:700}',
      '.cre-rbd-stage{fill:var(--ink);font-size:10.5px;font-weight:700}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function wrap(eyebrow,svg,wide){
    return '<div class="tb-q-chart-wrap cre-visual"><span class="tb-q-chart-eyebrow">'+esc(eyebrow)+'</span>'+
      (wide?'<p class="cre-scroll-hint">Swipe sideways to see the whole diagram.</p>':'')+svg+'</div>';
  }

  /* ---------- probability tree ---------- */
  function probTree(spec){
    var children=Array.isArray(spec.children)?spec.children:[];
    if(!children.length)return '';
    var leaves=[],maxDepth=0;
    function walk(node,depth){
      node.__depth=depth;maxDepth=Math.max(maxDepth,depth);
      var kids=Array.isArray(node.children)?node.children:[];
      if(!kids.length){node.__row=leaves.length;leaves.push(node);return;}
      kids.forEach(function(k){walk(k,depth+1);});
    }
    var root={label:spec.root||'Start',children:children};
    walk(root,0);
    var rowH=46,top=40,left=12,boxH=26;
    var colW=[64].concat(new Array(maxDepth).fill(108));
    var gap=34,outW=58;
    var colX=[];var x=left;
    colW.forEach(function(w,i){colX.push(x);x+=w+gap;});
    var outX=x;
    var width=outX+outW+12,height=top+leaves.length*rowH+8;
    function place(node){
      var kids=Array.isArray(node.children)?node.children:[];
      if(kids.length){kids.forEach(place);node.__y=kids.reduce(function(s,k){return s+k.__y;},0)/kids.length;}
      else node.__y=top+node.__row*rowH+rowH/2;
    }
    place(root);
    var parts=[];
    var summary=spec.altText||spec.title||'Probability tree';
    function box(node){
      var d=node.__depth,bx=colX[d],bw=colW[d],y=node.__y;
      return '<g class="cre-node'+(d===0?' cre-node-root':'')+'"><rect x="'+bx+'" y="'+(y-boxH/2).toFixed(1)+'" width="'+bw+'" height="'+boxH+'" rx="5"></rect>'+
        '<text x="'+(bx+bw/2)+'" y="'+(y+4).toFixed(1)+'" text-anchor="middle">'+esc(node.label)+'</text></g>';
    }
    function draw(node){
      var kids=Array.isArray(node.children)?node.children:[];
      var d=node.__depth,x1=colX[d]+colW[d],y1=node.__y;
      kids.forEach(function(k){
        var x2=colX[k.__depth],y2=k.__y,mx=(x1+x2)/2;
        parts.push('<path class="cre-edge" d="M'+x1+' '+y1.toFixed(1)+' C'+mx+' '+y1.toFixed(1)+' '+mx+' '+y2.toFixed(1)+' '+x2+' '+y2.toFixed(1)+'"></path>');
        if(k.p!=null)parts.push('<text class="cre-prob" x="'+mx+'" y="'+((y1+y2)/2-5).toFixed(1)+'" text-anchor="middle">'+esc(k.p)+'</text>');
        draw(k);
      });
      parts.push(box(node));
      if(!kids.length&&node.outcome){
        var bx=colX[d]+colW[d],y=node.__y,kind=/scrap|fail|reject/i.test(node.outcome)?'scrap':'ship';
        parts.push('<path class="cre-edge-tail" d="M'+bx+' '+y.toFixed(1)+' H'+outX+'"></path>');
        parts.push('<g class="cre-out cre-out-'+kind+'"><rect x="'+outX+'" y="'+(y-11).toFixed(1)+'" width="'+outW+'" height="22" rx="11"></rect>'+
          '<text x="'+(outX+outW/2)+'" y="'+(y+4).toFixed(1)+'" text-anchor="middle">'+esc(node.outcome)+'</text></g>');
      }
    }
    draw(root);
    var svg='<svg viewBox="0 0 '+width+' '+height+'" class="tb-q-chart cre-chart cre-chart-wide" style="max-width:'+width+'px" role="img" aria-label="'+esc(summary)+'">'+
      '<title>'+esc(spec.title||'Probability tree')+'</title><desc>'+esc(summary)+'</desc>'+
      '<text class="cre-title" x="'+left+'" y="18">'+esc(spec.title||'Probability tree')+'</text>'+
      parts.join('')+'</svg>';
    return wrap('Probability tree',svg,true);
  }

  /* ---------- probability paper (Weibull or lognormal) ---------- */
  function weibullY(fPercent){var f=Number(fPercent)/100;return Math.log(-Math.log(1-f));}
  // Standard normal quantile (Acklam's rational approximation, |error| < 1.2e-9).
  function normInv(p){
    var a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269,-30.66479806614716,2.506628277459239],
        b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],
        c=[-0.007784894002430293,-0.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],
        d=[0.007784695709041462,0.3224671290700398,2.445134137142996,3.754408661907416],q,r;
    if(p<0.02425){q=Math.sqrt(-2*Math.log(p));return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
    if(p>1-0.02425)return -normInv(1-p);
    q=p-0.5;r=q*q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  }
  function lognormalY(fPercent){return normInv(Number(fPercent)/100);}
  function weibullPlot(spec){return probabilityPaper(spec,'weibull');}
  function lognormalPlot(spec){return probabilityPaper(spec,'lognormal');}
  function probabilityPaper(spec,paper){
    var logn=paper==='lognormal',yOf=logn?lognormalY:weibullY,name=logn?'Lognormal probability plot':'Weibull probability plot';
    var xTicks=(spec.xTicks||[]).map(num).filter(function(v){return v>0;});
    var yTicks=(spec.yTicks||[]).map(num).filter(function(v){return v>0&&v<100;});
    var points=(spec.points||[]).filter(function(p){return Array.isArray(p)&&num(p[0])>0&&num(p[1])>0&&num(p[1])<100;});
    if(xTicks.length<2||yTicks.length<2||!points.length)return '';
    var w=580,h=360,left=58,right=24,top=34,bottom=54;
    var xMin=Math.log10(Math.min.apply(null,xTicks)),xMax=Math.log10(Math.max.apply(null,xTicks));
    var yMin=yOf(Math.min.apply(null,yTicks)),yMax=yOf(Math.max.apply(null,yTicks));
    function px(t){return left+(Math.log10(t)-xMin)/(xMax-xMin)*(w-left-right);}
    function py(f){return top+(yMax-yOf(f))/(yMax-yMin)*(h-top-bottom);}
    var s='<svg viewBox="0 0 '+w+' '+h+'" class="tb-q-chart cre-chart cre-chart-wide" role="img" aria-label="'+esc(spec.altText||spec.title||name)+'">'+
      '<title>'+esc(spec.title||name)+'</title><desc>'+esc(spec.altText||'')+'</desc>'+
      '<text class="cre-title" x="'+left+'" y="18">'+esc(spec.title||name)+'</text>';
    // minor decade grid (2-9 within each decade)
    for(var d=Math.floor(xMin);d<xMax;d++){
      for(var m=2;m<=9;m++){var t=m*Math.pow(10,d);if(Math.log10(t)>xMax)break;s+='<line class="tb-chart-grid" style="opacity:.35" x1="'+px(t).toFixed(1)+'" y1="'+top+'" x2="'+px(t).toFixed(1)+'" y2="'+(h-bottom)+'"></line>';}
    }
    xTicks.forEach(function(t){var x=px(t).toFixed(1);s+='<line class="tb-chart-grid" x1="'+x+'" y1="'+top+'" x2="'+x+'" y2="'+(h-bottom)+'"></line><text class="cre-tick" x="'+x+'" y="'+(h-bottom+16)+'" text-anchor="middle">'+esc(fmt(t))+'</text>';});
    yTicks.forEach(function(f){
      var y=py(f).toFixed(1),ref=Math.abs(f-(logn?50:63.2))<0.05;
      s+='<line class="'+(ref?'cre-ref':'tb-chart-grid')+'" x1="'+left+'" y1="'+y+'" x2="'+(w-right)+'" y2="'+y+'"></line><text class="cre-tick" x="'+(left-6)+'" y="'+(Number(y)+3)+'" text-anchor="end">'+esc(f)+'</text>';
    });
    if(logn&&spec.line&&num(spec.line.median)>0&&num(spec.line.sigma)>0){
      // a lognormal fit is a straight line on this paper: draw it between the plotted probability limits
      var med=num(spec.line.median),sg=num(spec.line.sigma),pLo=Math.min.apply(null,yTicks),pHi=Math.max.apply(null,yTicks);
      var tLo=Math.max(Math.pow(10,xMin),med*Math.exp(sg*normInv(pLo/100))),tHi=Math.min(Math.pow(10,xMax),med*Math.exp(sg*normInv(pHi/100)));
      function fLog(t){return 100*(0.5*(1+erf(Math.log(t/med)/(sg*Math.SQRT2))));}
      s+='<path class="tb-chart-line" fill="none" d="M'+px(tLo).toFixed(1)+' '+py(fLog(tLo)).toFixed(1)+' L'+px(tHi).toFixed(1)+' '+py(fLog(tHi)).toFixed(1)+'"></path>';
    }
    if(!logn&&spec.line&&num(spec.line.beta)>0&&num(spec.line.eta)>0){
      var b=num(spec.line.beta),eta=num(spec.line.eta);
      var t0=Math.pow(10,xMin),t1=Math.pow(10,xMax);
      function fAt(t){return 100*(1-Math.exp(-Math.pow(t/eta,b)));}
      var fLo=Math.max(Math.min.apply(null,yTicks),Math.min(fAt(t0),99.99)),fHi=Math.min(Math.max.apply(null,yTicks),fAt(t1));
      function tAt(f){return eta*Math.pow(-Math.log(1-f/100),1/b);}
      var a=[Math.max(t0,tAt(fLo)),fLo],z=[Math.min(t1,tAt(fHi)),fHi];
      s+='<path class="tb-chart-line" fill="none" d="M'+px(a[0]).toFixed(1)+' '+py(a[1]).toFixed(1)+' L'+px(z[0]).toFixed(1)+' '+py(z[1]).toFixed(1)+'"></path>';
    }
    points.forEach(function(p){
      var label=fmt(p[0])+' hours, '+p[1]+'% unreliability';
      s+='<circle class="tb-chart-dot" cx="'+px(p[0]).toFixed(1)+'" cy="'+py(p[1]).toFixed(1)+'" r="4" tabindex="0" role="img" aria-label="'+esc(label)+'"><title>'+esc(label)+'</title></circle>';
    });
    (spec.markers||[]).forEach(function(mk){
      if(!(num(mk.t)>0&&num(mk.f)>0))return;
      var mx=px(mk.t),my=py(mk.f);
      s+='<circle cx="'+mx.toFixed(1)+'" cy="'+my.toFixed(1)+'" r="6" fill="none" stroke="var(--ink)" stroke-width="1.6"></circle>'+
        '<text class="cre-marker" x="'+(mx+9).toFixed(1)+'" y="'+(my+15).toFixed(1)+'">'+esc(mk.label||'')+'</text>';
    });
    s+='<text class="cre-axis-label" x="'+((left+w-right)/2)+'" y="'+(h-12)+'" text-anchor="middle">'+esc(spec.xLabel||'Time (log scale)')+'</text>'+
      '<text class="cre-axis-label" x="15" y="'+((top+h-bottom)/2)+'" text-anchor="middle" transform="rotate(-90 15 '+((top+h-bottom)/2)+')">'+esc(spec.yLabel||'Unreliability, %')+'</text></svg>';
    return wrap(name,s,true);
  }
  // Abramowitz–Stegun 7.1.26 (|error| < 1.5e-7), used only to place the fitted lognormal line.
  function erf(x){var sgn=x<0?-1:1;x=Math.abs(x);var t=1/(1+0.3275911*x);
    return sgn*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x));}

  /* ---------- linear x–y plot with explicit round ticks ---------- */
  function xyPlot(spec){
    var xTicks=(spec.xTicks||[]).map(num).filter(function(v){return v!=null;});
    var yTicks=(spec.yTicks||[]).map(num).filter(function(v){return v!=null;});
    var series=(spec.series||[]).filter(function(s){return Array.isArray(s.points)&&s.points.length;});
    if(xTicks.length<2||yTicks.length<2||!series.length)return '';
    var w=580,h=330,left=62,right=24,top=34,bottom=54;
    var xMin=Math.min.apply(null,xTicks),xMax=Math.max.apply(null,xTicks),yMin=Math.min.apply(null,yTicks),yMax=Math.max.apply(null,yTicks);
    function px(v){return left+(Number(v)-xMin)/(xMax-xMin)*(w-left-right);}
    function py(v){return top+(yMax-Number(v))/(yMax-yMin)*(h-top-bottom);}
    var s='<svg viewBox="0 0 '+w+' '+h+'" class="tb-q-chart cre-chart cre-chart-wide" role="img" aria-label="'+esc(spec.altText||spec.title||'Plot')+'">'+
      '<title>'+esc(spec.title||'Plot')+'</title><desc>'+esc(spec.altText||'')+'</desc>'+
      '<text class="cre-title" x="'+left+'" y="18">'+esc(spec.title||'')+'</text>';
    xTicks.forEach(function(t){var x=px(t).toFixed(1);s+='<line class="tb-chart-grid" x1="'+x+'" y1="'+top+'" x2="'+x+'" y2="'+(h-bottom)+'"></line><text class="cre-tick" x="'+x+'" y="'+(h-bottom+16)+'" text-anchor="middle">'+esc(fmt(t))+'</text>';});
    yTicks.forEach(function(t){var y=py(t).toFixed(1);s+='<line class="tb-chart-grid" x1="'+left+'" y1="'+y+'" x2="'+(w-right)+'" y2="'+y+'"></line><text class="cre-tick" x="'+(left-6)+'" y="'+(Number(y)+3)+'" text-anchor="end">'+esc(fmt(t))+'</text>';});
    series.forEach(function(item){
      var d=item.points.map(function(p,i){return (i?'L':'M')+px(p[0]).toFixed(1)+' '+py(p[1]).toFixed(1);}).join(' ');
      if(item.line!==false)s+='<path class="tb-chart-line" fill="none" d="'+d+'"'+(item.dashed?' stroke-dasharray="7 4" style="opacity:.75"':'')+'></path>';
      if(item.showPoints!==false)item.points.forEach(function(p){
        var label=(item.label?item.label+': ':'')+fmt(p[0])+', '+p[1];
        s+='<circle class="tb-chart-dot" cx="'+px(p[0]).toFixed(1)+'" cy="'+py(p[1]).toFixed(1)+'" r="3.5" tabindex="0" role="img" aria-label="'+esc(label)+'"><title>'+esc(label)+'</title></circle>';
      });
    });
    if(spec.legend){
      var lx=left+8,ly=top+12;
      series.forEach(function(item,i){
        if(!item.label)return;
        var yy=ly+i*16;
        s+=(item.line===false?'<circle class="tb-chart-dot" cx="'+(lx+9)+'" cy="'+yy+'" r="3.5"></circle>':
          '<line class="tb-chart-line" x1="'+lx+'" y1="'+yy+'" x2="'+(lx+18)+'" y2="'+yy+'"'+(item.dashed?' stroke-dasharray="7 4" style="opacity:.75"':'')+'></line>')+
          '<text class="cre-marker" x="'+(lx+24)+'" y="'+(yy+3.5)+'">'+esc(item.label)+'</text>';
      });
    }
    (spec.markers||[]).forEach(function(mk){
      if(num(mk.x)==null||num(mk.y)==null)return;
      var mx=px(mk.x),my=py(mk.y),anchor=mx>w-160?'end':'start',dx=anchor==='end'?-9:9;
      s+='<circle cx="'+mx.toFixed(1)+'" cy="'+my.toFixed(1)+'" r="6" fill="none" stroke="var(--ink)" stroke-width="1.6"></circle>'+
        '<text class="cre-marker" x="'+(mx+dx).toFixed(1)+'" y="'+(my-9).toFixed(1)+'" text-anchor="'+anchor+'">'+esc(mk.label||'')+'</text>';
    });
    s+='<text class="cre-axis-label" x="'+((left+w-right)/2)+'" y="'+(h-12)+'" text-anchor="middle">'+esc(spec.xLabel||'')+'</text>'+
      '<text class="cre-axis-label" x="15" y="'+((top+h-bottom)/2)+'" text-anchor="middle" transform="rotate(-90 15 '+((top+h-bottom)/2)+')">'+esc(spec.yLabel||'')+'</text></svg>';
    return wrap(spec.eyebrow||'Plot',s,true);
  }

  /* ---------- box-and-whisker plots (horizontal, one row per group) ---------- */
  function boxPlot(spec){
    var xTicks=(spec.xTicks||[]).map(num).filter(function(v){return v!=null;});
    var groups=(spec.groups||[]).filter(function(g){return ['min','q1','median','q3','max'].every(function(k){return num(g[k])!=null;});});
    if(xTicks.length<2||!groups.length)return '';
    var rowH=56,w=580,left=92,right=24,top=34,bottom=50,h=top+groups.length*rowH+bottom;
    var xMin=Math.min.apply(null,xTicks),xMax=Math.max.apply(null,xTicks);
    function px(v){return left+(Number(v)-xMin)/(xMax-xMin)*(w-left-right);}
    var s='<svg viewBox="0 0 '+w+' '+h+'" class="tb-q-chart cre-chart cre-chart-wide" role="img" aria-label="'+esc(spec.altText||spec.title||'Box plots')+'">'+
      '<title>'+esc(spec.title||'Box plots')+'</title><desc>'+esc(spec.altText||'')+'</desc>'+
      '<text class="cre-title" x="'+left+'" y="18">'+esc(spec.title||'')+'</text>';
    xTicks.forEach(function(t){var x=px(t).toFixed(1);s+='<line class="tb-chart-grid" x1="'+x+'" y1="'+top+'" x2="'+x+'" y2="'+(h-bottom)+'"></line><text class="cre-tick" x="'+x+'" y="'+(h-bottom+16)+'" text-anchor="middle">'+esc(fmt(t))+'</text>';});
    (spec.refLines||[]).forEach(function(r){if(num(r.x)==null)return;var x=px(r.x).toFixed(1);
      s+='<line class="cre-ref" x1="'+x+'" y1="'+(top-4)+'" x2="'+x+'" y2="'+(h-bottom)+'"></line><text class="cre-marker" x="'+(Number(x)+5)+'" y="'+(top+6)+'">'+esc(r.label||'')+'</text>';});
    groups.forEach(function(g,i){
      var cy=top+i*rowH+rowH/2,bh=22,label=g.label+': minimum '+fmt(g.min)+', first quartile '+fmt(g.q1)+', median '+fmt(g.median)+', third quartile '+fmt(g.q3)+', maximum '+fmt(g.max)+((g.outliers||[]).length?', outliers '+g.outliers.map(fmt).join(', '):'');
      s+='<g role="img" tabindex="0" aria-label="'+esc(label)+'"><title>'+esc(label)+'</title>'+
        '<text class="cre-tick" style="font-size:11px;fill:var(--ink)" x="'+(left-10)+'" y="'+(cy+4)+'" text-anchor="end">'+esc(g.label)+'</text>'+
        '<line class="tb-chart-whisker" x1="'+px(g.min).toFixed(1)+'" y1="'+cy+'" x2="'+px(g.q1).toFixed(1)+'" y2="'+cy+'"></line>'+
        '<line class="tb-chart-whisker" x1="'+px(g.q3).toFixed(1)+'" y1="'+cy+'" x2="'+px(g.max).toFixed(1)+'" y2="'+cy+'"></line>'+
        '<line class="tb-chart-whisker" x1="'+px(g.min).toFixed(1)+'" y1="'+(cy-7)+'" x2="'+px(g.min).toFixed(1)+'" y2="'+(cy+7)+'"></line>'+
        '<line class="tb-chart-whisker" x1="'+px(g.max).toFixed(1)+'" y1="'+(cy-7)+'" x2="'+px(g.max).toFixed(1)+'" y2="'+(cy+7)+'"></line>'+
        '<rect class="tb-chart-box" x="'+px(g.q1).toFixed(1)+'" y="'+(cy-bh/2)+'" width="'+(px(g.q3)-px(g.q1)).toFixed(1)+'" height="'+bh+'"></rect>'+
        '<line class="tb-chart-median" x1="'+px(g.median).toFixed(1)+'" y1="'+(cy-bh/2)+'" x2="'+px(g.median).toFixed(1)+'" y2="'+(cy+bh/2)+'"></line>';
      (g.outliers||[]).forEach(function(o){if(num(o)!=null)s+='<circle class="tb-chart-outlier" cx="'+px(o).toFixed(1)+'" cy="'+cy+'" r="4.5"></circle>';});
      s+='</g>';
    });
    s+='<text class="cre-axis-label" x="'+((left+w-right)/2)+'" y="'+(h-12)+'" text-anchor="middle">'+esc(spec.xLabel||'')+'</text></svg>';
    return wrap(spec.eyebrow||'Box plots',s,true);
  }

  /* ---------- reliability block diagram ---------- */
  function rbd(spec){
    var stages=(spec.stages||[]).filter(function(st){return Array.isArray(st.blocks)&&st.blocks.length;});
    if(!stages.length)return '';
    var bw=96,bh=38,vgap=12,colGap=46,pad=34,top=46;
    var maxN=Math.max.apply(null,stages.map(function(st){return st.blocks.length;}));
    var bodyH=maxN*bh+(maxN-1)*vgap,mid=top+bodyH/2;
    var w=pad*2+stages.length*(bw+28)+(stages.length-1)*colGap,h=top+bodyH+52;
    var parts=[],x=pad;
    parts.push('<circle class="cre-rbd-node" cx="'+(pad-14)+'" cy="'+mid+'" r="4"></circle><path class="cre-rbd-wire" d="M'+(pad-14)+' '+mid+' H'+x+'"></path>');
    stages.forEach(function(st,si){
      var n=st.blocks.length,stackH=n*bh+(n-1)*vgap,y0=mid-stackH/2,inX=x,bx=x+14,outX=bx+bw+14;
      st.blocks.forEach(function(b,i){
        var by=y0+i*(bh+vgap),cy=by+bh/2,label=(b.label||'')+(b.r!=null?', reliability '+b.r:'');
        if(n>1)parts.push('<path class="cre-rbd-wire" d="M'+inX+' '+cy.toFixed(1)+' H'+bx+' M'+(bx+bw)+' '+cy.toFixed(1)+' H'+outX+'"></path>');
        parts.push('<g class="cre-rbd-block" role="img" tabindex="0" aria-label="'+esc(label)+'"><title>'+esc(label)+'</title><rect x="'+bx+'" y="'+by.toFixed(1)+'" width="'+bw+'" height="'+bh+'" rx="5"></rect>'+
          '<text x="'+(bx+bw/2)+'" y="'+(by+15).toFixed(1)+'" text-anchor="middle">'+esc(b.label||'')+'</text>'+
          (b.r!=null?'<text class="cre-rbd-r" x="'+(bx+bw/2)+'" y="'+(by+30).toFixed(1)+'" text-anchor="middle">'+esc(b.r)+'</text>':'')+'</g>');
      });
      if(n>1){
        var ya=(y0+bh/2).toFixed(1),yb=(y0+stackH-bh/2).toFixed(1);
        parts.push('<path class="cre-rbd-wire" d="M'+inX+' '+ya+' V'+yb+' M'+outX+' '+ya+' V'+yb+'"></path>');
      } else parts.push('<path class="cre-rbd-wire" d="M'+inX+' '+mid+' H'+bx+' M'+(bx+bw)+' '+mid+' H'+outX+'"></path>');
      if(st.label)parts.push('<text class="cre-rbd-stage" x="'+(bx+bw/2)+'" y="'+(top-12)+'" text-anchor="middle">'+esc(st.label)+'</text>');
      if(st.note)parts.push('<text class="cre-rbd-note" x="'+(bx+bw/2)+'" y="'+(top+bodyH+20)+'" text-anchor="middle">'+esc(st.note)+'</text>');
      x=outX;
      if(si<stages.length-1){parts.push('<path class="cre-rbd-wire" d="M'+x+' '+mid+' H'+(x+colGap)+'"></path>');x+=colGap;}
    });
    parts.push('<path class="cre-rbd-wire" d="M'+x+' '+mid+' H'+(x+14)+'"></path><circle class="cre-rbd-node" cx="'+(x+14)+'" cy="'+mid+'" r="4"></circle>');
    w=x+pad;
    var svg='<svg viewBox="0 0 '+w+' '+h+'" class="tb-q-chart cre-chart cre-chart-wide" style="max-width:'+w+'px" role="img" aria-label="'+esc(spec.altText||spec.title||'Reliability block diagram')+'">'+
      '<title>'+esc(spec.title||'Reliability block diagram')+'</title><desc>'+esc(spec.altText||'')+'</desc>'+
      '<text class="cre-title" x="'+pad+'" y="16">'+esc(spec.title||'')+'</text>'+parts.join('')+'</svg>';
    return wrap(spec.eyebrow||'Reliability block diagram',svg,true);
  }

  var RENDERERS={'cre-prob-tree':probTree,'cre-weibull-plot':weibullPlot,'cre-lognormal-plot':lognormalPlot,'cre-xy-plot':xyPlot,'cre-box-plot':boxPlot,'cre-rbd':rbd};
  function render(chart){
    if(!chart||typeof chart.type!=='string'||!RENDERERS[chart.type])return '';
    ensureStyle();
    var html='';
    try{html=RENDERERS[chart.type](chart)||'';}catch(error){html='';}
    // A question must never lose its evidence: fall back to the full text description.
    if(!html&&chart.altText)html='<div class="tb-q-chart-wrap cre-visual cre-fallback"><span class="tb-q-chart-eyebrow">'+esc(chart.title||'Question visual')+'</span><p>'+esc(chart.altText)+'</p></div>';
    return html;
  }
  /* Make each typeset display equation in a CRE Set 1 question a labelled, keyboard-scrollable
     region (MathJax inserts the containers after the engine renders, so watch for them). */
  var SCOPE=':is(.tb-quiz,.tb-review-card)[data-question-id^="cre:set-1:"] mjx-container[display="true"]';
  var TABLE_SCOPE=':is(.tb-quiz,.tb-review-card)[data-question-id^="cre:set-1:"] .tb-q-chart-wrap';
  function each(root,selector,fn){
    var list=root.matches&&root.matches(selector)?[root]:root.querySelectorAll(selector);
    Array.prototype.forEach.call(list,fn);
  }
  function labelMath(root){
    if(!root||!root.querySelectorAll)return;
    each(root,SCOPE,function(el){
      if(el.hasAttribute('data-cre-math'))return;
      el.setAttribute('data-cre-math','');el.tabIndex=0;el.setAttribute('role','region');
      el.setAttribute('aria-label','Worked equation; scroll sideways if it is wider than the screen');
    });
    // Exhibit tables scroll inside their wrapper; make that region reachable by keyboard.
    each(root,TABLE_SCOPE,function(el){
      if(el.hasAttribute('data-cre-table')||!el.querySelector('table.tb-q-data-table'))return;
      el.setAttribute('data-cre-table','');el.tabIndex=0;el.setAttribute('role','region');
      el.setAttribute('aria-label','Exhibit table; scroll sideways to see every column');
    });
  }
  if(typeof document!=='undefined'){
    ensureStyle();
    if(typeof MutationObserver==='function'&&document.body){
      new MutationObserver(function(records){records.forEach(function(r){Array.prototype.forEach.call(r.addedNodes,function(n){if(n.nodeType===1)labelMath(n);});});})
        .observe(document.body,{childList:true,subtree:true});
    }
  }
  global.__CREVisuals={render:render,types:Object.keys(RENDERERS),labelMath:labelMath};
})(window);
