// Inserted into the exact-qid-scoped Batch 5 presentation module.
// Plots use the displayed evidence data, never the answer index.
 const num=(n,d=3)=>Number(n.toFixed(d)).toString();
 function text(x,y,s,anchor='start'){return '<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+esc(s)+'</text>';}
 function line(x1,y1,x2,y2,cls='mbbs3b5-axis',extra=''){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'" '+extra+'/>';}
 function svg(title,body,w=660,h=340){return '<svg viewBox="0 0 '+w+' '+h+'" width="'+w+'" height="'+h+'" role="img" aria-label="'+esc(title)+'"><title>'+esc(title)+'</title>'+body+'</svg>';}
 function dot(x,y,label,extra=''){return '<circle cx="'+x+'" cy="'+y+'" r="4" data-point="true" '+extra+'><title>'+esc(label)+'</title></circle>';}
 function xyPlot(title,xs,series,range,xlabel,ylabel,refs=[]){
  const [xmin,xmax,ymin,ymax]=range,X=x=>70+(x-xmin)/(xmax-xmin)*550,Y=y=>270-(y-ymin)/(ymax-ymin)*220;
  let b=text(330,24,title,'middle')+text(330,326,xlabel,'middle')+text(16,43,ylabel);
  for(let i=0;i<=4;i++){let y=ymin+(ymax-ymin)*i/4;b+=line(70,Y(y),620,Y(y),'mbbs3b5-grid')+text(59,Y(y)+5,num(y,3),'end');}
  const xt=xs.length<=13?xs:[xmin,(xmin+xmax)/2,xmax];
  xt.forEach(x=>{b+=line(X(x),270,X(x),277)+text(X(x),296,num(x,3),'middle');});
  b+=line(70,50,70,270)+line(70,270,620,270);
  refs.forEach(r=>{if(r.y!==undefined){b+=line(70,Y(r.y),620,Y(r.y),'mbbs3b5-reference','stroke-dasharray="7 5"')+text(618,Y(r.y)-7,r.label+' '+num(r.y,4),'end');}else if(r.points){b+='<polyline class="mbbs3b5-reference" stroke-dasharray="7 5" points="'+r.points.map(p=>X(p[0])+','+Y(p[1])).join(' ')+'"/>';}});
  series.forEach((s,j)=>{if(s.connect!==false)b+='<polyline data-series="'+j+'" class="mbbs3b5-series" '+(s.dashed?'stroke-dasharray="8 5" ':'')+'points="'+s.values.map((v,i)=>X(xs[i])+','+Y(v)).join(' ')+'"/>';
   if(s.dots!==false)s.values.forEach((v,i)=>b+=dot(X(xs[i]),Y(v),s.name+'; '+xlabel+' '+xs[i]+'; value '+num(v,6),'data-x="'+xs[i]+'" data-y="'+v+'" data-series="'+j+'"'));
  });return svg(title,b);
 }
 function plot(c){
  let drawings='';
  if(c.type==='xbar-r'){
   drawings=xyPlot('Subgroup means',c.labels,[{name:'Mean',values:c.meanData}],[1,8,47.5,52.5],'Subgroup','Mean (g)',[{y:c.xbarLimits[0],label:'UCL'},{y:c.xbarLimits[1],label:'CL'},{y:c.xbarLimits[2],label:'LCL'}]);
   drawings+=xyPlot('Subgroup ranges',c.labels,[{name:'Range',values:c.rangeData}],[1,8,-1,10],'Subgroup','Range (g)',[{y:c.rLimits[0],label:'UCL'},{y:c.rLimits[1],label:'CL'},{y:c.rLimits[2],label:'LCL'}]);
  }else if(c.type==='control-single'){
   drawings=xyPlot('Fill-weight chart: points 37–48',c.labels,[{name:'Fill weight',values:c.data}],[37,48,493,507],'Observation number','Weight (g)',[{y:c.ucl,label:'UCL'},{y:c.cl,label:'CL'},{y:c.lcl,label:'LCL'}]);
  }else if(c.type==='normal-prob'){
   const r=c.reference;drawings=xyPlot('Normal probability plot',c.points.map(p=>p.z),[{name:'Ordered assay',values:c.points.map(p=>p.value),connect:false}],[-2.4,2.4,8,14.5],'Theoretical normal quantile','Purity (mass %)',[{points:[[-2.4,r.intercept-2.4*r.slope],[2.4,r.intercept+2.4*r.slope]]}]);
  }else if(c.type==='bias-diagram'){
   drawings=xyPlot('Bias at the three reference levels',c.referenceValues,[{name:'Mean minus reference',values:c.biases,connect:false}],[0,100,-1,4],'Reference value (mm)','Bias (mm)',[{y:0,label:'Zero'}]);
  }else if(c.type==='oc-curve'){
   const xs=c.curves.map(r=>r.p*100);drawings=xyPlot('Operating characteristic curves',xs,c.plans.map((p,j)=>({name:p.label,values:c.curves.map(r=>r.acceptance[j]),dots:false,dashed:j===1})),[0,20,0,1],'Lot percent defective','P(accept)',[]);
   drawings+='<p class="mbbs3b5-legend">Solid: Plan A (n = 200, c = 10). Dashed: Plan B (n = 50, c = 2). Larger samples require more inspection.</p>';
  }else if(c.type==='multi-vari'){
   const X=x=>75+x*155,Y=y=>270-(y-9.8)/.4*220;let b=text(330,24,'Diameter observations by machine','middle')+text(16,43,'Diameter (mm)');
   [9.8,9.9,10,10.1,10.2].forEach(v=>b+=line(70,Y(v),620,Y(v),'mbbs3b5-grid')+text(59,Y(v)+5,num(v,2),'end'));
   c.groups.forEach((g,j)=>{b+=text(X(j+1),304,g.label,'middle');g.values.forEach((v,k)=>b+=dot(X(j+1)+(k-1.5)*13,Y(v),g.label+' observation '+(k+1)+': '+v+' mm','data-x="'+(j+1)+'" data-y="'+v+'"'));});drawings=svg(c.title,b);
  }else if(c.type==='boxplot'){
   const X=x=>65+x/12*550,y=146;let b=text(330,24,'Claims cycle time: Tukey boxplot','middle')+text(330,294,'Cycle time (days)','middle');
   for(let x=0;x<=12;x+=2)b+=line(X(x),224,X(x),230)+text(X(x),253,String(x),'middle');b+=line(X(0),224,X(12),224);
   b+=line(X(c.lowerWhisker),y,X(c.q1),y)+line(X(c.q3),y,X(c.upperWhisker),y)+line(X(c.lowerWhisker),y-20,X(c.lowerWhisker),y+20)+line(X(c.upperWhisker),y-20,X(c.upperWhisker),y+20);
   b+='<rect x="'+X(c.q1)+'" y="106" width="'+(X(c.q3)-X(c.q1))+'" height="80" class="mbbs3b5-box"/>'+line(X(c.median),106,X(c.median),186);
   b+=text(X(c.q1),93,'Q1 3.4','end')+text(X(c.q3),93,'Q3 5.1')+text(X(c.median),207,'Median 4.2','middle');
   c.outliers.forEach(v=>b+=dot(X(v),y,v+' days','data-x="'+v+'" data-y="0"'));drawings=svg(c.title,b,660,320);
  }else if(c.type==='precision-accuracy'){
   let b=text(330,23,'Repeated errors on the same coordinate scale','middle');
   c.panels.forEach((p,i)=>{const cx=i%2===0?170:490,cy=i<2?157:430;[40,80].forEach(r=>b+='<circle class="mbbs3b5-target" cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>');b+=line(cx-92,cy,cx+92,cy,'mbbs3b5-grid')+line(cx,cy-92,cx,cy+92,'mbbs3b5-grid')+text(cx,cy-108,'Panel '+p.label,'middle')+text(cx,cy+115,'Reference = center; 1 unit = 10 px','middle');
    p.points.forEach((pt,j)=>b+=dot(cx+pt[0]*10,cy-pt[1]*10,'Panel '+p.label+' reading '+(j+1)+': errors ('+pt.join(', ')+')','data-panel="'+p.label+'" data-x="'+pt[0]+'" data-y="'+pt[1]+'"'));
   });drawings=svg(c.title,b,660,570);
  }else{throw new Error('Unsupported Batch 5 evidence type '+c.type);}
  return '<figure class="mbbs3b5-plot"><figcaption>'+esc(c.title)+'</figcaption><p>'+esc(c.altText)+'</p><p class="mbbs3b5-scroll-hint">Scroll or swipe horizontally to inspect the full-size figure. All plotted values are also in the table below.</p><div class="mbbs3b5-scroll" role="region" tabindex="0" aria-label="'+esc(c.title)+'; horizontally scrollable plot">'+drawings+'</div></figure>'+table(c.evidence);
 }
 function render(q,review){if(!isQuestion(q))return '';return '<div class="mbbs3b5-question"><div class="'+(review?'tb-review-stem':'tb-stem')+'" data-question-id="'+esc(q.qid)+'" tabindex="-1">'+esc(q.stem)+'</div>'+(q.chart?'<div class="mbbs3b5-evidence">'+(q.chart.type==='data-table'?table(q.chart):plot(q.chart))+'</div>':'')+'</div>';}
