(function(){
'use strict';
var tool=document.getElementById('spx-tool');if(!tool||typeof state==='undefined')return;
var MEDIA={
  air:{label:'Still air',severity:.08,k:.0020,bathSensitivity:0,note:'Lowest thermal shock; generally limited hardening depth.'},
  forced:{label:'Forced air / gas',severity:.20,k:.0065,bathSensitivity:0,note:'Moderate gas cooling with lower cracking risk than liquids.'},
  oil:{label:'Conventional oil',severity:.55,k:.026,bathSensitivity:.0022,note:'Common compromise between hardening response, distortion, and cracking.'},
  fastoil:{label:'Accelerated oil',severity:.78,k:.041,bathSensitivity:.0020,note:'Faster oil response with increased thermal and transformation stress.'},
  polymer:{label:'Polymer solution',severity:.92,k:.055,bathSensitivity:.0028,note:'Adjustable severity in practice; concentration and contamination are not modelled.'},
  water:{label:'Water',severity:1.25,k:.082,bathSensitivity:.0040,note:'High cooling severity with elevated distortion and cracking sensitivity.'},
  brine:{label:'Brine',severity:1.50,k:.108,bathSensitivity:.0035,note:'Very severe cooling; strong safety and cracking cautions apply.'},
  salt:{label:'Molten-salt bath analogue',severity:.35,k:.017,bathSensitivity:.0010,note:'Represents interrupted/isothermal bath behaviour only; not operating guidance.'}
};
var AGITATION={still:.75,moderate:1,vigorous:1.28};
var CORNER={rounded:.75,normal:1,sharp:1.35};
var START_FACTOR={normalized:1,annealed:1.22,spheroidized:2.05,asrolled:.88};
var CARBIDE_FACTOR={plain:1,lowalloy:1.65,strong:3.25,microalloy:2.65};
var PIN_FACTOR={none:.75,moderate:1.25,strong:2.05};
var helpCopy={
  hardenability:{title:'How to interpret hardenability',html:'<p>The Jominy curve estimates how hardness falls as cooling intensity decreases with distance from the quenched end. The section model maps surface-to-centre locations to approximate Jominy distances.</p><h3>Read in this order</h3><ol><li>Confirm the chemistry and prior-austenite grain number.</li><li>Review the estimated Jominy curve.</li><li>Compare surface, quarter-depth, and centre hardness.</li><li>Check whether the target-hardness depth reaches the centre.</li></ol><p><strong>Do not confuse:</strong> high surface hardness does not prove adequate centre hardenability.</p>'},
  austenitization:{title:'How to interpret the austenitization window',html:'<p>The window balances four needs: heating the core, forming austenite, dissolving/homogenizing carbon and alloy carbides, and limiting grain growth.</p><h3>Read in this order</h3><ol><li>Check core heat-through time.</li><li>Check dissolution and homogenization completeness.</li><li>Review the final ASTM grain-number estimate.</li><li>Use the heatmap to find balanced temperature-time combinations.</li></ol><p>A higher temperature can shorten dissolution time while accelerating grain coarsening. The best cycle is therefore a window, not the maximum temperature or longest hold.</p>'},
  quenching:{title:'How to interpret quench comparison',html:'<p>The selected-quench chart separates surface, quarter-depth, and centre cooling. The table compares all media under the same geometry and chemistry assumptions.</p><h3>Read in this order</h3><ol><li>Compare the 800→500 °C cooling rates with the chemistry-dependent critical-rate estimate.</li><li>Compare surface and centre martensite fractions.</li><li>Review the hardness gradient.</li><li>Balance cracking and distortion risks against centre hardening.</li></ol><p>The most severe quench is not automatically the best quench. A slower medium may be preferable when hardenability is sufficient.</p>'}
};
function deepCopy(x){return JSON.parse(JSON.stringify(x))}
function ensureState(){
  var ac3=chemMetrics().ac3;
  state.r2=state.r2||{};
  state.r2.hard=Object.assign({geometry:'round',size:50,medium:'oil',agitation:'moderate',grain:8,targetHV:450},state.r2.hard||{});
  state.r2.aust=Object.assign({temp:ac3+40,hold:45,size:25,initialG:8,start:'normalized',carbide:'lowalloy',pinning:'moderate',heatRate:20},state.r2.aust||{});
  state.r2.quench=Object.assign({medium:'oil',bath:60,agitation:'moderate',size:50,geometry:'round',delay:8,corner:'normal',final:25},state.r2.quench||{});
}
function trend2(v){return v<20?'Very low':v<40?'Low':v<60?'Moderate':v<80?'High':'Very high'}
function metric2(label,value,sub){return'<div class="spx-metric"><b>'+value+'</b><span>'+label+(sub?'<br>'+sub:'')+'</span></div>'}
function statusPill(text,kind){return'<span class="spx-r2-status '+kind+'">'+text+'</span>'}
function riskCard(label,value,detail){return'<div class="spx-r2-risk"><strong>'+label+'<span>'+trend2(value)+'</span></strong><div class="spx-r2-risk-track"><i style="width:'+clamp(value,0,100)+'%"></i></div><span>'+detail+'</span></div>'}
function fillMediaSelect(id){var s=$(id);if(!s)return;var current=s.value;clear(s);Object.keys(MEDIA).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=MEDIA[k].label;s.appendChild(o)});if(current&&MEDIA[current])s.value=current}
function astmDiameter(G){var n=Math.pow(2,G-1);return 286.6/Math.sqrt(Math.max(.25,n))}
function maxMartensiteHV(c){return clamp(185+705*c,220,900)}
function baseHV(x){return clamp(105+190*x.C+20*x.Mn+24*x.Cr+32*x.Mo+8*x.Ni,110,420)}
function hardenabilityScale(grain){var m=chemMetrics(),gf=clamp(1+(8-grain)*.075,.65,1.55);return clamp(3+.35*m.hardenability*gf,4,48)}
function jominyAt(j,grain){var scale=hardenabilityScale(grain),x=state.chem,mart=Math.exp(-Math.pow(Math.max(0,j)/scale,1.38));var hv=baseHV(x)+(maxMartensiteHV(x.C)-baseHV(x))*mart;return{j:j,mart:clamp(mart,0,1),hv:hv}}
function sectionJ(depth,h){var med=MEDIA[h.medium],sev=med.severity*(AGITATION[h.agitation]||1),gf=h.geometry==='plate'?.88:1.08;return Math.max(0,depth*.60/Math.max(.08,sev)*gf*(1+h.size/220))}
function hardSectionModel(){
  var h=state.r2.hard,half=h.size/2,locs=[['Surface',0],['Quarter-depth',half/2],['Centre',half]],rows=[];
  locs.forEach(function(z){var j=sectionJ(z[1],h),r=jominyAt(j,h.grain);rows.push({name:z[0],depth:z[1],j:j,mart:r.mart,hv:r.hv})});
  var effective=0;for(var d=0;d<=half;d+=Math.max(.2,half/160)){if(jominyAt(sectionJ(d,h),h.grain).hv>=h.targetHV)effective=d}
  return{rows:rows,effective:effective,half:half,scale:hardenabilityScale(h.grain),surface:rows[0],center:rows[2]};
}
function renderJominy(){
  var svg=$('spx-jominy-svg');if(!svg)return;clear(svg);var x0=68,x1=730,y0=350,y1=30,jmax=50,hvmin=100,hvmax=900;
  function x(j){return x0+j/jmax*(x1-x0)}function y(h){return y0-(h-hvmin)/(hvmax-hvmin)*(y0-y1)}
  [0,10,20,30,40,50].forEach(function(j){svg.appendChild(se('line',{class:'spx-gridline',x1:x(j),x2:x(j),y1:y1,y2:y0}));svg.appendChild(se('text',{class:'spx-tick',x:x(j),y:y0+18,'text-anchor':'middle'},j))});
  [100,300,500,700,900].forEach(function(h){svg.appendChild(se('line',{class:'spx-gridline',x1:x0,x2:x1,y1:y(h),y2:y(h)}));svg.appendChild(se('text',{class:'spx-tick',x:x0-8,y:y(h)+4,'text-anchor':'end'},h))});
  svg.appendChild(se('text',{class:'spx-axis',x:(x0+x1)/2,y:395,'text-anchor':'middle'},'Distance from quenched end (mm)'));svg.appendChild(se('text',{class:'spx-axis',x:18,y:(y0+y1)/2,transform:'rotate(-90 18 '+(y0+y1)/2+')','text-anchor':'middle'},'Estimated hardness (HV)'));
  var pts=[];for(var j=0;j<=50;j+=1)pts.push([x(j),y(jominyAt(j,state.r2.hard.grain).hv)]);svg.appendChild(se('path',{d:pathPts(pts),fill:'none',stroke:'var(--spx-accent)','stroke-width':3}));
  var target=state.r2.hard.targetHV;svg.appendChild(se('line',{x1:x0,x2:x1,y1:y(target),y2:y(target),stroke:'var(--spx-warn)','stroke-width':1.5,'stroke-dasharray':'6 4'}));svg.appendChild(se('text',{class:'spx-tick',x:x1-4,y:y(target)-6,'text-anchor':'end'},'Target '+Math.round(target)+' HV'));
  var model=hardSectionModel();model.rows.forEach(function(r,i){var px=x(clamp(r.j,0,50)),py=y(r.hv);svg.appendChild(se('circle',{cx:px,cy:py,r:6,fill:pointColor(i),stroke:'#fff','stroke-width':2}));svg.appendChild(se('text',{class:'spx-point-label',x:px+9,y:py-7},r.name))});
}
function drawSection(canvas,rows,geometry){
  var ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle=getComputedStyle(tool).getPropertyValue('--spx-bg')||'#fff';ctx.fillRect(0,0,w,h);
  var left=40,right=w-40,top=44,bottom=h-50,max=maxMartensiteHV(state.chem.C),min=baseHV(state.chem),steps=100;
  for(var i=0;i<steps;i++){var f=i/(steps-1),depth=f*state.r2.hard.size/2,r=jominyAt(sectionJ(depth,state.r2.hard),state.r2.hard.grain),q=clamp((r.hv-min)/Math.max(1,max-min),0,1);ctx.fillStyle='hsl('+(205-165*q)+' 58% '+(72-24*q)+'%)';var x=left+f*(right-left)/2;ctx.fillRect(x,top,(right-left)/(2*steps)+1,bottom-top);ctx.fillRect(w-x-(right-left)/(2*steps),top,(right-left)/(2*steps)+1,bottom-top)}
  ctx.strokeStyle='#667085';ctx.lineWidth=2;ctx.strokeRect(left,top,right-left,bottom-top);if(geometry==='round'){ctx.save();ctx.globalCompositeOperation='destination-in';ctx.beginPath();ctx.ellipse(w/2,(top+bottom)/2,(right-left)/2,(bottom-top)/2,0,0,Math.PI*2);ctx.fill();ctx.restore();ctx.strokeStyle='#667085';ctx.beginPath();ctx.ellipse(w/2,(top+bottom)/2,(right-left)/2,(bottom-top)/2,0,0,Math.PI*2);ctx.stroke()}
  ctx.fillStyle=getComputedStyle(tool).getPropertyValue('--spx-text')||'#101828';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillText('Surface',left,bottom+24);ctx.fillText('Centre',w/2,bottom+24);ctx.fillText('Surface',right,bottom+24);ctx.textAlign='left';ctx.font='12px system-ui';ctx.fillText(Math.round(rows[0].hv)+' HV',left,24);ctx.textAlign='center';ctx.fillText(Math.round(rows[2].hv)+' HV',w/2,24);ctx.textAlign='right';ctx.fillText(Math.round(rows[0].hv)+' HV',right,24)
}
function renderHardenability(){
  var m=hardSectionModel(),h=state.r2.hard;renderJominy();drawSection($('spx-section-canvas'),m.rows,h.geometry);
  $('spx-hard-depth-body').innerHTML=m.rows.map(function(r){return'<tr><td>'+r.name+'</td><td>'+round(r.j,1)+' mm</td><td>'+round(pct(r.mart),0)+'%</td><td>'+Math.round(r.hv)+' HV</td></tr>'}).join('');
  var reaches=m.effective>=m.half*.98,ratio=m.center.hv/Math.max(1,m.surface.hv),kind=reaches?'good':ratio>.75?'warn':'bad';
  $('spx-hard-metrics').innerHTML=metric2('Jominy characteristic length',round(m.scale,1)+' mm','Chemistry + grain-size estimate')+metric2('Effective target depth',round(m.effective,1)+' mm','From each quenched surface')+metric2('Surface hardness',Math.round(m.surface.hv)+' HV',round(pct(m.surface.mart),0)+'% martensite')+metric2('Centre hardness',Math.round(m.center.hv)+' HV',round(pct(m.center.mart),0)+'% martensite');
  $('spx-hard-status').innerHTML=statusPill(reaches?'Target reaches centre':ratio>.75?'Partial through-hardening':'Surface-biased hardening',kind)+'<p>'+(reaches?'The estimated hardness remains above '+Math.round(h.targetHV)+' HV through the section.':ratio>.75?'The centre retains much of the surface hardness but does not meet the selected target through the full section.':'The selected section and quench produce a large surface-to-centre hardness gradient.')+'</p><p class="spx-r2-engineer"><strong>Analysis caution:</strong> validate with measured Jominy data, actual cooling curves, and hardness traverses.</p>';
}
function austModel(o){
  var a=Object.assign({},state.r2.aust,o||{}),m=chemMetrics(),superheat=a.temp-m.ac3,heatRate=Math.max(1,a.heatRate),coreTime=Math.pow(a.size/25,2)*8*Math.pow(20/heatRate,.35),effective=Math.max(0,a.hold-coreTime),start=START_FACTOR[a.start]||1,carb=CARBIDE_FACTOR[a.carbide]||1,pin=PIN_FACTOR[a.pinning]||1;
  var phaseFactor=clamp((a.temp-m.ac1)/Math.max(20,m.ac3-m.ac1),0,1),tauD=28*start*carb*Math.exp(-Math.max(-20,superheat)/55),tauH=52*start*Math.sqrt(carb)*Math.exp(-Math.max(-20,superheat)/72),diss=phaseFactor*(1-Math.exp(-effective/Math.max(2,tauD))),homog=phaseFactor*(1-Math.exp(-effective/Math.max(3,tauH)));
  var drive=Math.pow(clamp((superheat-20)/120,0,2),1.35)*Math.log1p(effective/15),deltaG=1.9*drive/pin+(a.temp>1050?(a.temp-1050)/90:0),finalG=clamp(a.initialG-deltaG,1,14),grainRisk=100*clamp(deltaG/4.5,0,1),heatThrough=clamp(a.hold/Math.max(1,coreTime),0,1);
  var status=(heatThrough<1||diss<.88||homog<.75)?'inadequate':grainRisk>55?'excessive':'balanced';
  return{a:a,m:m,superheat:superheat,coreTime:coreTime,effective:effective,diss:diss,homog:homog,finalG:finalG,initialD:astmDiameter(a.initialG),finalD:astmDiameter(finalG),grainRisk:grainRisk,heatThrough:heatThrough,status:status};
}
function drawAustWindow(){
  var c=$('spx-aust-window-canvas'),ctx=c.getContext('2d'),w=c.width,h=c.height,p={l:64,r:22,t:26,b:50},m=chemMetrics(),tmin=m.ac3+5,tmax=m.ac3+165,hmin=5,hmax=180,cols=40,rows=34;ctx.clearRect(0,0,w,h);ctx.fillStyle=getComputedStyle(tool).getPropertyValue('--spx-bg')||'#fff';ctx.fillRect(0,0,w,h);
  for(var i=0;i<cols;i++)for(var j=0;j<rows;j++){var temp=tmin+(tmax-tmin)*(i+.5)/cols,hold=hmin+(hmax-hmin)*(j+.5)/rows,r=austModel({temp:temp,hold:hold});ctx.fillStyle=r.status==='balanced'?'#12b76a':r.status==='excessive'?'#f79009':'#d0d5dd';var x=p.l+i*(w-p.l-p.r)/cols,y=p.t+(rows-j-1)*(h-p.t-p.b)/rows;ctx.fillRect(x,y,(w-p.l-p.r)/cols+1,(h-p.t-p.b)/rows+1)}
  ctx.strokeStyle='#667085';ctx.strokeRect(p.l,p.t,w-p.l-p.r,h-p.t-p.b);ctx.fillStyle=getComputedStyle(tool).getPropertyValue('--spx-text')||'#101828';ctx.font='12px system-ui';ctx.textAlign='center';[0,.25,.5,.75,1].forEach(function(f){var temp=tmin+(tmax-tmin)*f,x=p.l+(w-p.l-p.r)*f;ctx.fillText(Math.round(dispT(temp)),x,h-24)});ctx.fillText('Austenitizing temperature ('+tUnit()+')',p.l+(w-p.l-p.r)/2,h-5);ctx.save();ctx.translate(16,p.t+(h-p.t-p.b)/2);ctx.rotate(-Math.PI/2);ctx.fillText('Hold time (min)',0,0);ctx.restore();ctx.textAlign='right';[5,50,95,140,180].forEach(function(v){var y=p.t+(h-p.t-p.b)*(1-(v-hmin)/(hmax-hmin));ctx.fillText(v,p.l-8,y+4)});
  var a=state.r2.aust,mx=p.l+(a.temp-tmin)/(tmax-tmin)*(w-p.l-p.r),my=p.t+(h-p.t-p.b)*(1-(a.hold-hmin)/(hmax-hmin));ctx.strokeStyle='#101828';ctx.lineWidth=3;ctx.beginPath();ctx.arc(clamp(mx,p.l,w-p.r),clamp(my,p.t,h-p.b),7,0,Math.PI*2);ctx.stroke();
  ctx.textAlign='left';ctx.fillStyle='#667085';ctx.fillText('Grey = incomplete · Green = balanced · Orange = grain-growth dominated',p.l,p.t-8)
}
function drawGrains(){
  var c=$('spx-grain-canvas'),ctx=c.getContext('2d'),w=c.width,h=c.height,r=austModel();ctx.clearRect(0,0,w,h);ctx.fillStyle=getComputedStyle(tool).getPropertyValue('--spx-bg')||'#fff';ctx.fillRect(0,0,w,h);drawField(0,w/2-5,r.a.initialG,'Initial G '+round(r.a.initialG,1));drawField(w/2+5,w,r.finalG,'Estimated final G '+round(r.finalG,1));
  function drawField(x0,x1,G,label){var spacing=clamp(56-(G-3)*5,11,58);ctx.save();ctx.beginPath();ctx.rect(x0+8,32,x1-x0-16,h-48);ctx.clip();ctx.strokeStyle='rgba(102,112,133,.65)';ctx.lineWidth=1;for(var y=42,ri=0;y<h-20;y+=spacing*.86,ri++){for(var x=x0+18+(ri%2)*spacing/2;x<x1-8;x+=spacing){ctx.beginPath();for(var k=0;k<6;k++){var ang=Math.PI/3*k,xx=x+Math.cos(ang)*spacing*.55,yy=y+Math.sin(ang)*spacing*.55;if(!k)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}ctx.closePath();ctx.stroke()}}ctx.restore();ctx.fillStyle=getComputedStyle(tool).getPropertyValue('--spx-text')||'#101828';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillText(label,(x0+x1)/2,20)}
}
function recommendAust(){
  var m=chemMetrics(),best=[];for(var t=m.ac3+10;t<=m.ac3+150;t+=5){for(var h=10;h<=180;h+=5){var r=austModel({temp:t,hold:h});if(r.status==='balanced'&&r.diss>=.9&&r.homog>=.8){best.push(r);break}}}
  if(!best.length)return'<div class="spx-note"><strong>No balanced window was found</strong> inside Ac₃ + 10 to 150 °C and 10 to 180 min for the selected assumptions. Review section size, carbide burden, and pinning or use validated grade-specific data.</div>';
  best.sort(function(a,b){return(a.grainRisk+a.a.hold/5)-(b.grainRisk+b.a.hold/5)});var b=best[0],lo=Math.max(m.ac3+10,b.a.temp-15),hi=Math.min(m.ac3+150,b.a.temp+15);
  return'<div class="spx-metrics">'+metric2('Preferred temperature band',fmtT(lo)+'–'+fmtT(hi),'Teaching estimate')+metric2('Indicative minimum hold',Math.round(b.a.hold)+' min','Includes estimated heat-through')+metric2('Expected final grain',round(b.finalG,1)+' ASTM','Approx. '+Math.round(b.finalD)+' µm')+metric2('Dissolution / homogenization',Math.round(pct(b.diss))+'% / '+Math.round(pct(b.homog))+'%','Modelled completeness')+'</div><div class="spx-note" style="margin-top:9px"><strong>Use the window, not one exact point.</strong> Confirm furnace uniformity, actual workpiece temperature, carbide dissolution, and prior-austenite grain size experimentally.</div>';
}
function renderAustenitization(){
  var r=austModel(),kind=r.status==='balanced'?'good':r.status==='excessive'?'warn':'bad',label=r.status==='balanced'?'Balanced window':r.status==='excessive'?'Excessive grain-growth risk':'Incomplete austenitization';drawAustWindow();drawGrains();
  $('spx-aust-condition').innerHTML=statusPill(label,kind)+' &nbsp; Ac₃ estimate '+fmtT(r.m.ac3);
  $('spx-aust-metrics').innerHTML=metric2('Core heat-through',round(r.coreTime,1)+' min',Math.round(pct(r.heatThrough))+'% of estimated need')+metric2('Effective soak',round(r.effective,1)+' min','After estimated core heat-through')+metric2('Carbide dissolution',Math.round(pct(r.diss))+'%','Directional completeness')+metric2('Homogenization',Math.round(pct(r.homog))+'%','Directional completeness')+metric2('Final ASTM grain',round(r.finalG,1),'Approx. '+Math.round(r.finalD)+' µm')+metric2('Grain-growth risk',trend2(r.grainRisk),Math.round(r.grainRisk)+'/100');
  var msg=r.status==='balanced'?'The selected cycle is estimated to provide adequate heat-through and dissolution without dominant grain coarsening.':r.status==='excessive'?'The cycle likely achieves dissolution, but temperature-time exposure is estimated to coarsen the prior-austenite grains.':'The core may not be fully heated or dissolution/homogenization may be incomplete.';
  $('spx-aust-status').innerHTML='<strong>'+msg+'</strong><p>Superheat: '+Math.round(r.superheat)+' °C above Ac₃. Initial grain diameter ≈ '+Math.round(r.initialD)+' µm; estimated final ≈ '+Math.round(r.finalD)+' µm.</p><p class="spx-r2-engineer"><strong>Analysis caution:</strong> verify with thermocouples, metallography, hardness response, and grade-specific heat-treatment data.</p>';
  $('spx-grain-summary').innerHTML='ASTM grain number decreases as grains coarsen. The model estimates G '+round(r.a.initialG,1)+' → '+round(r.finalG,1)+'. Grain size affects toughness, hardenability, transformation kinetics, and distortion response.';
  $('spx-aust-recommendation').innerHTML=recommendAust();
}
function adjustedK(q,loc,mediumKey){
  var med=MEDIA[mediumKey||q.medium],ag=AGITATION[q.agitation]||1,bathFactor=med.bathSensitivity?clamp(1-(q.bath-25)*med.bathSensitivity,.45,1.15):1,sizeFactor=1+q.size/180,ks=med.k*ag*bathFactor/sizeFactor,geom=q.geometry==='plate'?.88:1;
  if(loc==='surface')return ks;if(loc==='quarter')return ks/(1+q.size/(75*geom));return ks/(1+q.size/(31*geom));
}
function quenchTemp(q,loc,time,mediumKey){
  var initial=Math.max(q.bath+30,(state.r2.aust.temp||870)-Math.min(180,q.delay*1.8)),k=adjustedK(q,loc,mediumKey),lag=loc==='surface'?0:loc==='quarter'?Math.pow(q.size,2)/900:Math.pow(q.size,2)/260;
  if(time<=lag)return initial-(initial-q.bath)*.03*time/Math.max(1,lag);return q.bath+(initial-q.bath)*Math.exp(-k*(time-lag));
}
function crossingTime(q,loc,target,mediumKey){var max=7200,prev=quenchTemp(q,loc,0,mediumKey);if(prev<=target)return 0;for(var t=1;t<=max;t*=1.08){var cur=quenchTemp(q,loc,t,mediumKey);if(cur<=target){var lo=t/1.08,hi=t;for(var i=0;i<28;i++){var mid=(lo+hi)/2;if(quenchTemp(q,loc,mid,mediumKey)>target)lo=mid;else hi=mid}return hi}}return Infinity}
function coolingRate800to500(q,loc,mediumKey){var t8=crossingTime(q,loc,800,mediumKey),t5=crossingTime(q,loc,500,mediumKey);return isFinite(t8)&&isFinite(t5)&&t5>t8?300/(t5-t8):0}
function quenchLocation(q,loc,mediumKey){
  var m=chemMetrics(),rate=coolingRate800to500(q,loc,mediumKey),critical=180*Math.exp(-.035*m.hardenability),bypass=1/(1+Math.exp(-1.9*Math.log(Math.max(.03,rate)/Math.max(.1,critical)))),km=q.final<m.ms?1-Math.exp(-.011*(m.ms-q.final)):0,mart=clamp(bypass*km,0,1),hv=baseHV(state.chem)+(maxMartensiteHV(state.chem.C)-baseHV(state.chem))*mart;
  return{loc:loc,rate:rate,critical:critical,bypass:bypass,mart:mart,hv:hv,tMs:crossingTime(q,loc,m.ms,mediumKey)};
}
function quenchModel(mediumKey){
  var q=Object.assign({},state.r2.quench,{medium:mediumKey||state.r2.quench.medium}),surface=quenchLocation(q,'surface',q.medium),quarter=quenchLocation(q,'quarter',q.medium),center=quenchLocation(q,'centre',q.medium),maxGrad=0,tMax=Math.max(60,crossingTime(q,'centre',100,q.medium));if(!isFinite(tMax))tMax=1800;tMax=Math.min(7200,tMax);
  for(var i=0;i<=120;i++){var t=tMax*i/120,g=Math.abs(quenchTemp(q,'surface',t,q.medium)-quenchTemp(q,'centre',t,q.medium));maxGrad=Math.max(maxGrad,g)}
  var med=MEDIA[q.medium],martMismatch=Math.abs(surface.mart-center.mart),gradientScore=clamp(maxGrad/500,0,1),carbon=clamp((state.chem.C-.15)/.65,0,1),grain=clamp((8-state.r2.hard.grain)/7,0,1),corner=CORNER[q.corner]||1,crack=100*clamp((.12+.28*carbon+.24*surface.mart+.20*gradientScore+.12*med.severity/1.5+.10*grain)*corner,0,1),dist=100*clamp((.10+.38*gradientScore+.32*martMismatch+.12*med.severity/1.5)*corner,0,1);
  return{q:q,medium:med,surface:surface,quarter:quarter,center:center,maxGrad:maxGrad,tMax:tMax,crack:crack,distortion:dist,mismatch:martMismatch};
}
function renderQuenchSvg(){
  var svg=$('spx-quench-svg');if(!svg)return;clear(svg);var r=quenchModel(),x0=68,x1=730,y0=370,y1=28,tmax=Math.max(10,r.tMax),tmin=Math.max(-100,Math.min(r.q.final,r.q.bath)-30),tmaxTemp=Math.max(950,state.r2.aust.temp+40);function x(t){return x0+t/tmax*(x1-x0)}function y(T){return y0-(T-tmin)/(tmaxTemp-tmin)*(y0-y1)}
  [0,.25,.5,.75,1].forEach(function(f){svg.appendChild(se('line',{class:'spx-gridline',x1:x(tmax*f),x2:x(tmax*f),y1:y1,y2:y0}));svg.appendChild(se('text',{class:'spx-tick',x:x(tmax*f),y:y0+18,'text-anchor':'middle'},round(tmax*f,0)))});[0,200,400,600,800].forEach(function(T){svg.appendChild(se('line',{class:'spx-gridline',x1:x0,x2:x1,y1:y(T),y2:y(T)}));svg.appendChild(se('text',{class:'spx-tick',x:x0-8,y:y(T)+4,'text-anchor':'end'},Math.round(dispT(T))))});svg.appendChild(se('text',{class:'spx-axis',x:(x0+x1)/2,y:415,'text-anchor':'middle'},'Elapsed time (s)'));svg.appendChild(se('text',{class:'spx-axis',x:18,y:(y0+y1)/2,transform:'rotate(-90 18 '+(y0+y1)/2+')','text-anchor':'middle'},'Temperature ('+tUnit()+')'));
  [['surface','spx-r2-line-surface'],['quarter','spx-r2-line-quarter'],['centre','spx-r2-line-centre']].forEach(function(z){var pts=[];for(var i=0;i<=150;i++){var t=tmax*i/150;pts.push([x(t),y(quenchTemp(r.q,z[0],t,r.q.medium))])}svg.appendChild(se('path',{d:pathPts(pts),fill:'none',class:z[1],'stroke-width':3}))});
  var ms=chemMetrics().ms;svg.appendChild(se('line',{x1:x0,x2:x1,y1:y(ms),y2:y(ms),stroke:'#364152','stroke-width':1.5,'stroke-dasharray':'6 4'}));svg.appendChild(se('text',{class:'spx-tick',x:x1-4,y:y(ms)-6,'text-anchor':'end'},'Ms '+fmtT(ms)));
  [['Surface','#0e7490'],['Quarter','#b45309'],['Centre','#7c3aed']].forEach(function(z,i){svg.appendChild(se('line',{x1:x0+15+i*105,x2:x0+35+i*105,y1:14,y2:14,stroke:z[1],'stroke-width':3}));svg.appendChild(se('text',{class:'spx-r2-legend-text',x:x0+40+i*105,y:18},z[0]))})
}
function drawQuenchSection(){
  var c=$('spx-quench-section-canvas'),ctx=c.getContext('2d'),w=c.width,h=c.height,q=state.r2.quench,left=38,right=w-38,top=38,bottom=h-48,steps=100,max=maxMartensiteHV(state.chem.C),min=baseHV(state.chem);ctx.clearRect(0,0,w,h);ctx.fillStyle=getComputedStyle(tool).getPropertyValue('--spx-bg')||'#fff';ctx.fillRect(0,0,w,h);
  var qr=quenchModel();for(var i=0;i<steps;i++){var f=i/(steps-1),loc=f<.15?'surface':f<.6?'quarter':'centre',blend=loc==='surface'?qr.surface:loc==='quarter'?qr.quarter:qr.center,qv=clamp((blend.hv-min)/Math.max(1,max-min),0,1);ctx.fillStyle='hsl('+(205-165*qv)+' 58% '+(72-24*qv)+'%)';var xx=left+f*(right-left)/2;ctx.fillRect(xx,top,(right-left)/(2*steps)+1,bottom-top);ctx.fillRect(w-xx-(right-left)/(2*steps),top,(right-left)/(2*steps)+1,bottom-top)}ctx.strokeStyle='#667085';ctx.lineWidth=2;ctx.strokeRect(left,top,right-left,bottom-top);if(q.geometry==='round'){ctx.save();ctx.globalCompositeOperation='destination-in';ctx.beginPath();ctx.ellipse(w/2,(top+bottom)/2,(right-left)/2,(bottom-top)/2,0,0,Math.PI*2);ctx.fill();ctx.restore();ctx.strokeStyle='#667085';ctx.beginPath();ctx.ellipse(w/2,(top+bottom)/2,(right-left)/2,(bottom-top)/2,0,0,Math.PI*2);ctx.stroke()}ctx.fillStyle=getComputedStyle(tool).getPropertyValue('--spx-text')||'#101828';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillText('Surface '+Math.round(qr.surface.hv)+' HV',left+30,22);ctx.fillText('Centre '+Math.round(qr.center.hv)+' HV',w/2,22);ctx.fillText('Surface '+Math.round(qr.surface.hv)+' HV',right-30,22);ctx.font='12px system-ui';ctx.fillText('Estimated hardness and martensite gradient',w/2,h-15)
}
function renderQuenching(){
  var r=quenchModel();renderQuenchSvg();drawQuenchSection();$('spx-quench-selected-label').textContent=r.medium.label+' · '+r.q.size+' mm '+(r.q.geometry==='round'?'round section':'plate');
  $('spx-quench-metrics').innerHTML=metric2('Surface 800→500 rate',round(r.surface.rate,1)+' °C/s','Critical estimate '+round(r.surface.critical,1)+' °C/s')+metric2('Centre 800→500 rate',round(r.center.rate,1)+' °C/s','Section-size controlled')+metric2('Surface martensite',Math.round(pct(r.surface.mart))+'%',Math.round(r.surface.hv)+' HV')+metric2('Centre martensite',Math.round(pct(r.center.mart))+'%',Math.round(r.center.hv)+' HV')+metric2('Maximum thermal gradient',Math.round(r.maxGrad)+' °C','Surface-to-centre')+metric2('Martensite mismatch',Math.round(pct(r.mismatch))+' points','Surface minus centre');
  $('spx-quench-risks').innerHTML=riskCard('Cracking risk',r.crack,'Carbon, severity, thermal gradient, grain size, and geometry.')+riskCard('Distortion risk',r.distortion,'Thermal gradient, transformation mismatch, severity, and geometry.');
  var centreOK=r.center.mart>.8,kind=centreOK&&r.crack<60?'good':r.crack>70?'bad':'warn';$('spx-quench-status').innerHTML=statusPill(centreOK?'High centre martensite':'Mixed centre transformation',kind)+'<p>'+r.medium.note+' '+(centreOK?'The selected setup is estimated to harden the centre substantially.':'The centre is estimated to transform partly before martensite can form.')+'</p><p class="spx-r2-engineer"><strong>Analysis caution:</strong> film boiling, nucleate boiling, convection, part orientation, load density, bath condition, and agitation uniformity are simplified.</p>';
  var rows=[['Surface',r.surface],['Quarter-depth',r.quarter],['Centre',r.center]];$('spx-quench-depth-body').innerHTML=rows.map(function(z){return'<tr><td>'+z[0]+'</td><td>'+round(z[1].rate,1)+' °C/s</td><td>'+Math.round(pct(z[1].mart))+'%</td><td>'+Math.round(z[1].hv)+' HV</td></tr>'}).join('');
  $('spx-quench-compare-body').innerHTML=Object.keys(MEDIA).map(function(k){var q=quenchModel(k);return'<tr'+(k===state.r2.quench.medium?' class="spx-r2-selected-row"':'')+'><td>'+MEDIA[k].label+'</td><td>'+round(q.surface.rate,1)+' °C/s</td><td>'+Math.round(pct(q.center.mart))+'%</td><td>'+Math.round(q.center.hv)+' HV</td><td>'+trend2(q.crack)+'</td><td>'+trend2(q.distortion)+'</td><td>'+MEDIA[k].note+'</td></tr>'}).join('');
}
function syncInputs(){
  ensureState();var h=state.r2.hard,a=state.r2.aust,q=state.r2.quench;
  $('spx-hard-geometry').value=h.geometry;$('spx-hard-size').value=h.size;$('spx-hard-medium').value=h.medium;$('spx-hard-agitation').value=h.agitation;$('spx-hard-grain').value=h.grain;$('spx-hard-target').value=h.targetHV;
  $('spx-aust-temp').value=Math.round(dispT(a.temp));$('spx-aust-hold').value=a.hold;$('spx-aust-size').value=a.size;$('spx-aust-grain').value=a.initialG;$('spx-aust-start').value=a.start;$('spx-aust-carbide').value=a.carbide;$('spx-aust-pinning').value=a.pinning;$('spx-aust-rate').value=a.heatRate;
  $('spx-quench-medium').value=q.medium;$('spx-quench-bath').value=Math.round(dispT(q.bath));$('spx-quench-agitation').value=q.agitation;$('spx-quench-geometry').value=q.geometry;$('spx-quench-size').value=q.size;$('spx-quench-delay').value=q.delay;$('spx-quench-corner').value=q.corner;$('spx-quench-final').value=Math.round(dispT(q.final));document.querySelectorAll('.spx-r2-temp-unit').forEach(function(n){n.textContent='('+tUnit()+')'})
}
function readInputs(target){
  var h=state.r2.hard,a=state.r2.aust,q=state.r2.quench,id=target.id,v=target.value;
  if(id==='spx-hard-geometry')h.geometry=v;if(id==='spx-hard-size')h.size=clamp(Number(v)||2,2,500);if(id==='spx-hard-medium')h.medium=v;if(id==='spx-hard-agitation')h.agitation=v;if(id==='spx-hard-grain')h.grain=clamp(Number(v)||8,1,14);if(id==='spx-hard-target')h.targetHV=clamp(Number(v)||450,120,900);
  if(id==='spx-aust-temp'){var tv=Number(v);if(finite(tv))a.temp=fromDispT(tv);}if(id==='spx-aust-hold')a.hold=clamp(Number(v)||1,1,720);if(id==='spx-aust-size')a.size=clamp(Number(v)||2,2,500);if(id==='spx-aust-grain')a.initialG=clamp(Number(v)||8,1,14);if(id==='spx-aust-start')a.start=v;if(id==='spx-aust-carbide')a.carbide=v;if(id==='spx-aust-pinning')a.pinning=v;if(id==='spx-aust-rate')a.heatRate=clamp(Number(v)||1,1,500);
  if(id==='spx-quench-medium')q.medium=v;if(id==='spx-quench-bath'){var bv=Number(v);if(finite(bv))q.bath=fromDispT(bv);}if(id==='spx-quench-agitation')q.agitation=v;if(id==='spx-quench-geometry')q.geometry=v;if(id==='spx-quench-size')q.size=clamp(Number(v)||2,2,500);if(id==='spx-quench-delay')q.delay=clamp(Number(v)||0,0,300);if(id==='spx-quench-corner')q.corner=v;if(id==='spx-quench-final'){var fv=Number(v);if(finite(fv))q.final=fromDispT(fv);}
}
function renderAppliedChain(){
  var old=$('spx-applied-chain-card');if(!old){var causal=$('spx-causal-card');if(!causal)return;var card=document.createElement('section');card.id='spx-applied-chain-card';card.className='spx-card spx-card-pad spx-release-section';causal.insertAdjacentElement('afterend',card);old=card}
  var h=hardSectionModel(),a=austModel(),q=quenchModel();old.innerHTML='<div class="spx-card-title"><div><h2>Applied depth check</h2><p>Release 2 extends the causal chain through section size and heat-treatment execution.</p></div></div><div class="spx-causal-chain"><article class="spx-causal-stage"><span class="spx-stage-kicker">Austenitize</span><h3>'+Math.round(pct(a.diss))+'% dissolution</h3><p>'+statusPill(a.status==='balanced'?'Balanced':a.status==='excessive'?'Coarsening risk':'Incomplete',a.status==='balanced'?'good':a.status==='excessive'?'warn':'bad')+' Final grain G '+round(a.finalG,1)+'.</p></article><article class="spx-causal-stage"><span class="spx-stage-kicker">Quench</span><h3>'+q.medium.label+'</h3><p>Surface '+Math.round(pct(q.surface.mart))+'% and centre '+Math.round(pct(q.center.mart))+'% martensite.</p></article><article class="spx-causal-stage"><span class="spx-stage-kicker">Section response</span><h3>'+Math.round(h.surface.hv)+' → '+Math.round(h.center.hv)+' HV</h3><p>Estimated surface-to-centre hardness for '+state.r2.hard.size+' mm '+state.r2.hard.geometry+'.</p></article></div><div class="spx-note"><strong>Interpret together:</strong> a good chemistry model can still underperform when the core is not fully austenitized, the section cools too slowly, or the quench creates unacceptable stress.</div>';
}
function renderRelease2(){ensureState();renderHardenability();renderAustenitization();renderQuenching();renderAppliedChain()}
function showHelp(key){var c=helpCopy[key];if(!c)return;var d=$('spx-r2-help-dialog');if(!d){d=document.createElement('div');d.id='spx-r2-help-dialog';d.className='spx-r2-help-dialog';d.hidden=true;d.innerHTML='<div class="spx-r2-help-card" role="dialog" aria-modal="true" aria-labelledby="spx-r2-help-title"><h2 id="spx-r2-help-title"></h2><div id="spx-r2-help-body"></div><div class="spx-r2-help-actions"><button class="spx-btn primary" id="spx-r2-help-close" type="button">Close</button></div></div>';document.body.appendChild(d);$('spx-r2-help-close').onclick=function(){d.hidden=true};d.addEventListener('click',function(e){if(e.target===d)d.hidden=true})}$('spx-r2-help-title').textContent=c.title;$('spx-r2-help-body').innerHTML=c.html;d.hidden=false}
function bind(){
  var ids=['spx-hard-geometry','spx-hard-size','spx-hard-medium','spx-hard-agitation','spx-hard-grain','spx-hard-target','spx-aust-temp','spx-aust-hold','spx-aust-size','spx-aust-grain','spx-aust-start','spx-aust-carbide','spx-aust-pinning','spx-aust-rate','spx-quench-medium','spx-quench-bath','spx-quench-agitation','spx-quench-geometry','spx-quench-size','spx-quench-delay','spx-quench-corner','spx-quench-final'];ids.forEach(function(id){$(id).addEventListener('input',function(){readInputs(this);renderRelease2()});$(id).addEventListener('change',function(){readInputs(this);renderRelease2()})});
  $('spx-aust-set-ac3').onclick=function(){state.r2.aust.temp=chemMetrics().ac3+40;syncInputs();renderRelease2()};
  $('spx-quench-apply-hard').onclick=function(){var q=state.r2.quench,h=state.r2.hard;h.medium=q.medium;h.agitation=q.agitation;h.geometry=q.geometry;h.size=q.size;syncInputs();renderRelease2();switchTab('hardenability')};
  $('spx-hard-sync').onclick=function(){var q=state.r2.quench,h=state.r2.hard;h.medium=q.medium;h.agitation=q.agitation;h.geometry=q.geometry;h.size=q.size;syncInputs();renderRelease2()};
  document.addEventListener('click',function(e){var route=e.target.closest('[data-release2-route]');if(route){var tab=route.dataset.release2Route;state.guideGoal=tab;$('spx-guide-recommendation').innerHTML='<strong>Recommended workflow:</strong> '+(tab==='hardenability'?'confirm chemistry, select geometry and section size, then compare surface and centre hardness.':tab==='austenitization'?'set temperature and hold time, verify heat-through and dissolution, then check grain-growth risk.':'select a medium and geometry, compare cooling curves, then balance centre hardening against cracking and distortion.');switchTab(tab)}var help=e.target.closest('[data-r2-help]');if(help)showHelp(help.dataset.r2Help)});
}
function wrap(name){var original=window[name];if(typeof original!=='function'||original.__spxRelease2Wrapped)return;var w=function(){var out=original.apply(this,arguments);if(name==='setUnit')syncInputs();renderRelease2();return out};w.__spxRelease2Wrapped=true;window[name]=w}
function persistence(){
  if(typeof window.serializable==='function'&&!window.serializable.__spxRelease2Wrapped){var base=window.serializable;window.serializable=function(){var o=base();o.release2=deepCopy(state.r2);return o};window.serializable.__spxRelease2Wrapped=true}
  if(typeof window.restore==='function'&&!window.restore.__spxRelease2Wrapped){var br=window.restore;window.restore=function(o){var ok=br(o);if(ok&&o.release2){state.r2=deepCopy(o.release2);ensureState();syncInputs();renderRelease2()}return ok};window.restore.__spxRelease2Wrapped=true}
}
function init(){
  ensureState();fillMediaSelect('spx-hard-medium');fillMediaSelect('spx-quench-medium');syncInputs();bind();['renderChemistry','renderKinetics','renderProperties','renderEquilibrium','setUnit','switchTab'].forEach(wrap);persistence();renderRelease2();
  if(window.__SPX)window.__SPX.release2={render:renderRelease2,hardModel:hardSectionModel,austModel:austModel,quenchModel:quenchModel,media:MEDIA};
}
init();
})();
