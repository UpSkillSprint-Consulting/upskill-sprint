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
      '.cre-ref{stroke:var(--muted);stroke-width:1.1;stroke-dasharray:5 4}'
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

  /* ---------- Weibull probability plot ---------- */
  function weibullY(fPercent){var f=Number(fPercent)/100;return Math.log(-Math.log(1-f));}
  function weibullPlot(spec){
    var xTicks=(spec.xTicks||[]).map(num).filter(function(v){return v>0;});
    var yTicks=(spec.yTicks||[]).map(num).filter(function(v){return v>0&&v<100;});
    var points=(spec.points||[]).filter(function(p){return Array.isArray(p)&&num(p[0])>0&&num(p[1])>0&&num(p[1])<100;});
    if(xTicks.length<2||yTicks.length<2||!points.length)return '';
    var w=580,h=360,left=58,right=24,top=34,bottom=54;
    var xMin=Math.log10(Math.min.apply(null,xTicks)),xMax=Math.log10(Math.max.apply(null,xTicks));
    var yMin=weibullY(Math.min.apply(null,yTicks)),yMax=weibullY(Math.max.apply(null,yTicks));
    function px(t){return left+(Math.log10(t)-xMin)/(xMax-xMin)*(w-left-right);}
    function py(f){return top+(yMax-weibullY(f))/(yMax-yMin)*(h-top-bottom);}
    var s='<svg viewBox="0 0 '+w+' '+h+'" class="tb-q-chart cre-chart cre-chart-wide" role="img" aria-label="'+esc(spec.altText||spec.title||'Weibull probability plot')+'">'+
      '<title>'+esc(spec.title||'Weibull probability plot')+'</title><desc>'+esc(spec.altText||'')+'</desc>'+
      '<text class="cre-title" x="'+left+'" y="18">'+esc(spec.title||'Weibull probability plot')+'</text>';
    // minor decade grid (2-9 within each decade)
    for(var d=Math.floor(xMin);d<xMax;d++){
      for(var m=2;m<=9;m++){var t=m*Math.pow(10,d);if(Math.log10(t)>xMax)break;s+='<line class="tb-chart-grid" style="opacity:.35" x1="'+px(t).toFixed(1)+'" y1="'+top+'" x2="'+px(t).toFixed(1)+'" y2="'+(h-bottom)+'"></line>';}
    }
    xTicks.forEach(function(t){var x=px(t).toFixed(1);s+='<line class="tb-chart-grid" x1="'+x+'" y1="'+top+'" x2="'+x+'" y2="'+(h-bottom)+'"></line><text class="cre-tick" x="'+x+'" y="'+(h-bottom+16)+'" text-anchor="middle">'+esc(fmt(t))+'</text>';});
    yTicks.forEach(function(f){
      var y=py(f).toFixed(1),ref=Math.abs(f-63.2)<0.05;
      s+='<line class="'+(ref?'cre-ref':'tb-chart-grid')+'" x1="'+left+'" y1="'+y+'" x2="'+(w-right)+'" y2="'+y+'"></line><text class="cre-tick" x="'+(left-6)+'" y="'+(Number(y)+3)+'" text-anchor="end">'+esc(f)+'</text>';
    });
    if(spec.line&&num(spec.line.beta)>0&&num(spec.line.eta)>0){
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
    return wrap('Weibull probability plot',s,true);
  }

  var RENDERERS={'cre-prob-tree':probTree,'cre-weibull-plot':weibullPlot};
  function render(chart){
    if(!chart||typeof chart.type!=='string'||!RENDERERS[chart.type])return '';
    ensureStyle();
    var html='';
    try{html=RENDERERS[chart.type](chart)||'';}catch(error){html='';}
    // A question must never lose its evidence: fall back to the full text description.
    if(!html&&chart.altText)html='<div class="tb-q-chart-wrap cre-visual cre-fallback"><span class="tb-q-chart-eyebrow">'+esc(chart.title||'Question visual')+'</span><p>'+esc(chart.altText)+'</p></div>';
    return html;
  }
  global.__CREVisuals={render:render,types:Object.keys(RENDERERS)};
})(window);
