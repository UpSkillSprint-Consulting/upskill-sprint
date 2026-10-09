/* Presentation for CRE Set 2. Exploration exists only in completed-attempt review. */
(function (global) {
  'use strict';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const isQuestion = q => !!q && /^cre:set-2:\d{3}$/.test(q.qid);
  function table(c) {
    return '<div class="cre2-scroll" role="region" tabindex="0" aria-label="' + esc(c.title) + '; scroll horizontally when needed"><table><caption>' + esc(c.title) + '</caption><thead><tr>' + c.columns.map(s => '<th scope="col">' + esc(s) + '</th>').join('') + '</tr></thead><tbody>' + c.rows.map(row => '<tr>' + row.map((v,i) => '<' + (i ? 'td' : 'th scope="row"') + '>' + esc(v) + '</' + (i ? 'td' : 'th') + '>').join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  function svg(title, description, width, height, content) {
    return '<div class="cre2-scroll" role="region" tabindex="0" aria-label="' + esc(title) + '; scroll horizontally when needed"><svg class="cre2-diagram" viewBox="0 0 ' + width + ' ' + height + '" style="width:' + width + 'px" role="img" aria-label="' + esc(description) + '"><title>' + esc(title) + '</title><desc>' + esc(description) + '</desc>' + content + '</svg></div>';
  }
  const line = (x1,y1,x2,y2,extra='') => '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" '+extra+'/>';
  const text = (x,y,t,extra='') => '<text x="'+x+'" y="'+y+'" text-anchor="middle" '+extra+'>'+esc(t)+'</text>';
  function box(x,y,w,h,label) {return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="7"/>'+text(x+w/2,y+h/2+5,label);}
  function faultTree(c) {
    let s = box(230,18,160,40,'Top event T') + line(310,58,310,77) + box(277,77,66,34,'OR');
    s += line(310,111,310,131)+line(158,131,462,131)+line(158,131,158,152)+line(462,131,462,152);
    s += box(120,152,76,34,'AND')+box(424,152,76,34,'AND');
    for (const [cx,a,b] of [[158,83,233],[462,387,537]]) {
      s += line(cx,186,cx,207)+line(a,207,b,207)+line(a,207,a,228)+line(b,207,b,228);
    }
    for (const [x,l,p] of [[83,'A','0.10'],[233,'C','0.05'],[387,'B','0.20'],[537,'C','0.05']]) {
      s += '<circle cx="'+x+'" cy="255" r="27"/>'+text(x,260,l)+text(x,310,'Probability '+p);
    }
    s += text(310,352,'Both C symbols denote the same basic event.');
    return svg(c.title,c.description,620,375,s);
  }
  function rbd(c) {
    let s = line(18,165,45,165)+box(45,135,142,60,'Power: 0.98')+line(187,165,227,165);
    s += line(227,75,227,255)+line(227,75,290,75)+line(227,255,290,255);
    s += box(290,45,176,60,'Channel 1: 0.90')+box(290,225,176,60,'Channel 2: 0.90');
    s += line(466,75,522,75)+line(466,255,522,255)+line(522,75,522,255)+line(522,165,598,165);
    s += text(378,153,'At least one')+text(378,177,'active channel required');
    return svg(c.title,c.description,620,330,s);
  }
  function weibull(c, mission) {
    const w=640,h=345,left=64,right=610,top=30,bottom=267;
    const x=t=>left+t/2000*(right-left), y=r=>bottom-r*(bottom-top);
    let s='';
    for(let v=0;v<=10;v+=2){const r=v/10;s+=line(left,y(r),right,y(r),'class="cre2-grid"')+text(38,y(r)+5,r.toFixed(1));}
    for(let t=0;t<=2000;t+=500){s+=line(x(t),bottom,x(t),bottom+6)+text(x(t),292,String(t));}
    s+=line(left,top,left,bottom)+line(left,bottom,right,bottom)+text(330,330,'Mission time (hours)')+text(88,17,'Reliability');
    [c.betaA,c.betaB].forEach((b,i)=>{
      const points=Array.from({length:101},(_,j)=>{const t=j*20;return x(t).toFixed(2)+','+y(Math.exp(-Math.pow(t/c.eta,b))).toFixed(2);}).join(' ');
      s+='<polyline class="cre2-curve" points="'+points+'"'+(i?' stroke-dasharray="8 5"':'')+'/>';
    });
    s+=line(368,43,401,43)+text(474,48,'A: shape 1 (solid)');
    s+=line(368,69,401,69,'stroke-dasharray="8 5"')+text(474,74,'B: shape 2 (dashed)');
    if(Number.isFinite(mission))s+=line(x(mission),top,x(mission),bottom,'class="cre2-mission"');
    return svg(c.title,'Two Weibull reliability curves: A has shape 1 and B shape 2; both have characteristic life 1,000 hours. Exact values at selected times are in the accompanying table.',w,h,s);
  }
  function cpm(c) {
    const node=(x,y,id,label,days)=>'<rect x="'+x+'" y="'+y+'" width="212" height="62" rx="7"/>'+text(x+106,y+25,id+' · '+label)+text(x+106,y+48,days+' days');
    const arrow=(x1,y1,x2,y2)=>line(x1,y1,x2,y2)+'<polyline points="'+(x2-5)+','+(y2-8)+' '+x2+','+y2+' '+(x2+5)+','+(y2-8)+'"/>';
    let s=node(234,16,'A','Requirements',3);
    s+=line(340,78,340,99)+line(146,99,534,99)+arrow(146,99,146,122)+arrow(534,99,534,122);
    s+=node(40,122,'B','Design',6)+node(428,122,'C','Fixture design',4);
    s+=arrow(146,184,146,228)+arrow(534,184,534,228);
    s+=node(40,228,'D','Prototype',4)+node(428,228,'E','Fixture build',5);
    s+=line(146,290,146,314)+line(534,290,534,314)+line(146,314,534,314)+arrow(340,314,340,338);
    s+=node(234,338,'F','Demonstration',3)+text(340,428,'Original plan; apply the change to C stated in the question.');
    return svg(c.title,c.description,680,450,s);
  }
  function duane(c) {
    const left=78,right=600,top=46,bottom=290;
    const x=t=>left+Math.log(t/1000)/Math.log(8)*(right-left);
    const y=m=>bottom-Math.log(m/100)/Math.log(2.5)*(bottom-top);
    let s='';
    for(const m of [100,125,150,200,250])s+=line(left,y(m),right,y(m),'class="cre2-grid"')+text(47,y(m)+5,String(m));
    for(const t of [1000,2000,4000,8000])s+=line(x(t),top,x(t),bottom,'class="cre2-grid"')+text(x(t),317,t.toLocaleString('en-US'));
    s+=line(left,top,left,bottom)+line(left,bottom,right,bottom);
    s+=text(232,23,'Cumulative MTBF (hours; log scale)')+text(340,352,'Total test exposure (unit-hours; log scale)');
    s+=line(left,y(200),right,y(200),'stroke-dasharray="6 5"')+text(177,y(200)-10,'Target: 200 h');
    s+=line(x(1000),y(100),x(8000),y(100*Math.pow(8,.4)),'class="cre2-curve"');
    s+='<circle cx="'+x(1000)+'" cy="'+y(100)+'" r="5"/>'+text(183,276,'Current test point');
    s+=text(427,201,'Solid line: conditional forecast');
    return svg(c.title,c.description,650,375,s);
  }
  function eventTree(c) {
    const hArrow=(x1,y,x2)=>line(x1,y,x2,y)+'<polyline points="'+(x2-7)+','+(y-5)+' '+x2+','+y+' '+(x2-7)+','+(y+5)+'"/>';
    let s='<rect x="18" y="147" width="152" height="64" rx="7"/>'+text(94,173,'Demand')+text(94,195,'0.40 per year');
    s+=line(170,179,210,179)+line(210,52,210,257);
    s+=hArrow(210,52,365)+text(282,37,'A succeeds: 0.90')+box(365,30,160,44,'No release');
    s+=hArrow(210,257,365)+text(282,239,'A fails: 0.10');
    s+='<rect x="365" y="227" width="160" height="60" rx="7"/>'+text(445,251,'A has failed')+text(445,275,'Assess B');
    s+=line(525,257,555,257)+line(555,168,555,320);
    s+=hArrow(555,168,604)+text(626,134,'B succeeds: 0.75')+box(604,146,116,44,'No release');
    s+=hArrow(555,320,604)+text(626,286,'B fails: 0.25')+box(604,298,116,44,'Release');
    s+=text(370,381,'B branch probabilities are conditional on A having failed.');
    return svg(c.title,c.description,740,405,s);
  }
  function pChart(c, secondSample) {
    const rows=c.rows.map((r,i)=>({week:r[0],n:i===1&&secondSample?secondSample:r[1],d:i===1 && secondSample ? .045*secondSample : r[2]}));
    rows.forEach(r=>{r.p=r.d/r.n;r.u=.02+3*Math.sqrt(.02*.98/r.n);r.l=Math.max(0,.02-3*Math.sqrt(.02*.98/r.n));});
    const x=i=>100+160*i,y=p=>280-p/.08*224;
    let s='';
    for(const p of [0,.02,.04,.06,.08])s+=line(68,y(p),620,y(p),'class="cre2-grid"')+text(41,y(p)+5,(p*100).toFixed(0)+'%');
    s+=line(68,56,68,280)+line(68,280,620,280)+text(226,26,'Nonconforming proportion');
    const points=key=>rows.map((r,i)=>x(i)+','+y(r[key])).join(' ');
    s+=line(68,y(.02),620,y(.02),'stroke-dasharray="10 3 2 3"');
    s+='<polyline points="'+points('u')+'" stroke-dasharray="7 4"/><polyline points="'+points('l')+'" stroke-dasharray="2 4"/><polyline class="cre2-curve" points="'+points('p')+'"/>';
    rows.forEach((r,i)=>{s+='<circle cx="'+x(i)+'" cy="'+y(r.p)+'" r="4"/><rect x="'+(x(i)-4)+'" y="'+(y(r.u)-4)+'" width="8" height="8"/>'+text(x(i),307,'Week '+r.week)+text(x(i),327,'n = '+r.n);});
    s+=line(65,357,100,357)+'<circle cx="82" cy="357" r="4"/>'+text(178,362,'Observed')+line(329,357,364,357,'stroke-dasharray="7 4"')+'<rect x="342" y="353" width="8" height="8"/>'+text(443,362,'Upper limit');
    s+=line(65,382,100,382,'stroke-dasharray="10 3 2 3"')+text(183,387,'Baseline 2.0%')+line(329,382,364,382,'stroke-dasharray="2 4"')+text(443,387,'Lower limit');
    const description=rows.map(r=>'Week '+r.week+': n='+r.n+', observed '+(r.p*100).toFixed(2)+'%, upper limit '+(r.u*100).toFixed(2)+'%, lower limit '+(r.l*100).toFixed(2)+'%.').join(' ');
    return svg(c.title,description,660,408,s);
  }
  function interaction(c) {
    const x=[165,495],y=v=>280-(v-800)/800*210;let s='';
    for(const v of [800,1000,1200,1400,1600])s+=line(75,y(v),605,y(v),'class="cre2-grid"')+text(43,y(v)+5,v.toLocaleString('en-US'));
    s+=line(75,70,75,280)+line(75,280,605,280)+text(234,49,'Mean time to failure (hours)');
    s+=line(x[0],y(1000),x[1],y(1500),'class="cre2-curve"')+line(x[0],y(1400),x[1],y(900),'class="cre2-curve" stroke-dasharray="8 5"');
    for(const [i,a,b] of [[0,1000,1400],[1,1500,900]])s+='<circle cx="'+x[i]+'" cy="'+y(a)+'" r="5"/><rect x="'+(x[i]-5)+'" y="'+(y(b)-5)+'" width="10" height="10"/>';
    s+=line(94,20,129,20)+text(204,25,'B low (−1)')+line(358,20,393,20,'stroke-dasharray="8 5"')+text(474,25,'B high (+1)');
    s+=text(x[0],307,'A low (−1)')+text(x[1],307,'A high (+1)')+text(340,340,'Cell means; within-cell variation is not shown.');
    return svg(c.title,c.description,650,365,s);
  }
  const acceleration=t=>Math.exp(.70/8.617333262e-5*(1/328.15-1/(t+273.15)));
  function arrheniusPlot(temperature) {
    const x=t=>72+(t-55)/55*545,y=af=>263-af/40*212;let s='';
    for(const af of [0,10,20,30,40])s+=line(72,y(af),617,y(af),'class="cre2-grid"')+text(43,y(af)+5,String(af));
    for(const t of [55,65,75,85,95,105,110])s+=line(x(t),263,x(t),269)+text(x(t),292,String(t));
    s+=line(72,51,72,263)+line(72,263,617,263)+text(255,24,'Acceleration factor: use life / test life');
    const points=Array.from({length:111},(_,i)=>{const t=55+i/2;return x(t).toFixed(2)+','+y(acceleration(t)).toFixed(2);}).join(' ');
    s+='<polyline class="cre2-curve" points="'+points+'"/>'+line(x(temperature),51,x(temperature),263,'class="cre2-mission"')+'<circle cx="'+x(temperature)+'" cy="'+y(acceleration(temperature))+'" r="5"/>';
    s+=text(338,322,'Test temperature (°C); use temperature fixed at 55 °C')+text(327,349,'Model exploration assumes the same mechanism across this range.');
    return svg('Arrhenius temperature exploration','Activation energy 0.70 eV; use temperature 55 degrees Celsius. At test temperature '+temperature+' degrees Celsius, the life-ratio acceleration factor is '+acceleration(temperature).toFixed(2)+'. The curve increases with test temperature.',665,370,s);
  }
  function pDiagram(c) {
    const arrow=(x1,y1,x2,y2)=>line(x1,y1,x2,y2)+(y1===y2?'<polyline points="'+(x2-7)+','+(y2-5)+' '+x2+','+y2+' '+(x2-7)+','+(y2+5)+'"/>':'<polyline points="'+(x2-5)+','+(y2+(y2>y1?-7:7))+' '+x2+','+y2+' '+(x2+5)+','+(y2+(y2>y1?-7:7))+'"/>');
    let s='<rect x="217" y="20" width="286" height="70" rx="7"/>'+text(360,45,'Control factors')+text(360,69,'Impeller clearance; controller gain');
    s+=arrow(360,90,360,148)+box(265,148,190,74,'Pump controller');
    s+='<rect x="12" y="148" width="184" height="74" rx="7"/>'+text(104,175,'Signal input')+text(104,199,'Required flow command')+arrow(196,185,265,185);
    s+=arrow(455,185,524,185)+'<rect x="524" y="148" width="184" height="74" rx="7"/>'+text(616,173,'Intended response')+text(616,196,'Flow tracks command');
    s+='<rect x="211" y="288" width="298" height="75" rx="7"/>'+text(360,311,'Noise factors')+text(360,334,'Viscosity; supply-voltage variation')+arrow(360,288,360,222);
    s+=line(455,205,482,205)+line(482,205,482,261)+arrow(482,261,524,261);
    s+='<rect x="524" y="235" width="184" height="78" rx="7"/>'+text(616,256,'Error states')+text(616,279,'Flow deficit;')+text(616,301,'excessive overshoot');
    s+=text(360,393,'Roles refer to intended field use, not laboratory controllability.');
    return svg(c.title,c.description,720,415,s);
  }
  function conditionalLife(c) {
    const x=t=>70+t/1200*550,y=r=>280-r*225;let s='';
    for(const r of [0,.2,.4,.6,.8,1])s+=line(70,y(r),620,y(r),'class="cre2-grid"')+text(42,y(r)+5,r.toFixed(1));
    for(const t of [0,200,400,600,800,1000,1200])s+=line(x(t),280,x(t),286)+text(x(t),310,String(t));
    s+=line(70,55,70,280)+line(70,280,620,280)+text(243,25,'Survival probability measured from new');
    const points=Array.from({length:121},(_,i)=>{const t=i*10;return x(t).toFixed(2)+','+y(Math.exp(-((t/1000)**2))).toFixed(2);}).join(' ');
    s+='<polyline class="cre2-curve" points="'+points+'"/>';
    s+=line(x(800),55,x(800),280,'stroke-dasharray="7 4"')+line(x(1000),55,x(1000),280,'stroke-dasharray="2 4"');
    s+='<circle cx="'+x(800)+'" cy="'+y(Math.exp(-.64))+'" r="5"/><rect x="'+(x(1000)-5)+'" y="'+(y(Math.exp(-1))-5)+'" width="10" height="10"/>';
    s+=text(345,341,'Total operating age (hours)')+text(330,370,'Dashed / circle: mission start at 800 h')+text(330,395,'Dotted / square: mission end at 1,000 h');
    return svg(c.title,c.description,660,415,s);
  }
  const ratedPower=t=>2*Math.max(0,Math.min(1,(155-t)/85));
  function derating(c,temperature=100,review=false) {
    const x=t=>74+(t-25)/130*544,y=p=>279-p/2.2*226;let s='';
    for(const p of [0,.5,1,1.5,2])s+=line(74,y(p),618,y(p),'class="cre2-grid"')+text(43,y(p)+5,p.toFixed(1));
    for(const t of [25,50,70,100,125,155])s+=line(x(t),279,x(t),285)+text(x(t),308,String(t));
    s+=line(74,53,74,279)+line(74,279,618,279)+text(207,24,'Continuous power (watts)');
    const points=f=>[25,70,155].map(t=>x(t)+','+y(f*ratedPower(t))).join(' ');
    s+='<polyline class="cre2-curve" points="'+points(1)+'"/>'+line(x(temperature),53,x(temperature),279,'class="cre2-mission"')+'<circle cx="'+x(temperature)+'" cy="'+y(ratedPower(temperature))+'" r="5"/>';
    if(review)s+='<polyline points="'+points(.6)+'" stroke-dasharray="8 5"/><rect x="'+(x(temperature)-4)+'" y="'+(y(.6*ratedPower(temperature))-4)+'" width="8" height="8"/>';
    s+=text(345,340,'Ambient temperature (°C); specified mounting conditions')+text(335,369,'Solid / circle: manufacturer rating');
    s+=text(335,396,review?'Dashed / square: 60% company power limit':'Company limit has not yet been applied to this curve.');
    const description=review?'At '+temperature+' degrees Celsius, manufacturer power rating is '+ratedPower(temperature).toFixed(4)+' watts and the company power limit is '+(.6*ratedPower(temperature)).toFixed(4)+' watts. The separate 10-volt constraint is also enforced in the output.':c.description;
    return svg(review?'Temperature-derating exploration':c.title,description,660,417,s);
  }
  function sequentialPlot(failures) {
    const x=r=>72+r/8*546,y=l=>278-(l+3)/7*224,logRatio=r=>r*Math.log(2)-2.5;let s='';
    for(const l of [-3,-2,-1,0,1,2,3,4])s+=line(72,y(l),618,y(l),'class="cre2-grid"')+text(43,y(l)+5,String(l));
    for(let r=0;r<=8;r++)s+=line(x(r),278,x(r),284)+text(x(r),307,String(r));
    s+=line(72,54,72,278)+line(72,278,618,278)+text(268,25,'Natural logarithm of the likelihood ratio');
    s+=line(72,y(-Math.log(9)),618,y(-Math.log(9)),'stroke-dasharray="7 4"')+line(72,y(Math.log(9)),618,y(Math.log(9)),'stroke-dasharray="2 4"');
    s+=text(248,y(-Math.log(9))-10,'Accept at or below −2.197')+text(437,y(Math.log(9))-10,'Reject at or above +2.197');
    s+=line(x(0),y(logRatio(0)),x(8),y(logRatio(8)),'class="cre2-curve"')+'<circle cx="'+x(failures)+'" cy="'+y(logRatio(failures))+'" r="6"/>';
    s+=text(345,338,'Hypothetical cumulative failures at 2,500 unit-hours')+text(335,365,'Between boundaries: continue. This is not a test trajectory.');
    return svg('Sequential-test boundary exploration','At fixed exposure of 2,500 unit-hours, the log likelihood ratio increases linearly with the hypothetical failure count. Accept at or below minus log 9, reject at or above log 9, otherwise continue. Selected failures: '+failures+'. Selected log ratio: '+logRatio(failures).toFixed(3)+'.',660,388,s);
  }
  function weibullProbability(c) {
    const x=v=>80+(v-5.8)/1.1*525,y=v=>287-(v+2)/2.5*230;let s='';
    for(const v of [-2,-1.5,-1,-.5,0,.5])s+=line(80,y(v),605,y(v),'class="cre2-grid"')+text(46,y(v)+5,v.toFixed(1));
    for(const v of [5.8,6.0,6.2,6.4,6.6,6.8])s+=line(x(v),287,x(v),293)+text(x(v),316,v.toFixed(1));
    s+=line(80,57,80,287)+line(80,287,605,287)+text(322,24,'Vertical coordinate: transformed cumulative probability');
    s+=line(x(5.8),y(2*(5.8-Math.log(800))),x(6.9),y(2*(6.9-Math.log(800))),'class="cre2-curve"');
    const px=x(Math.log(400)),py=y(-Math.log(4)),qx=x(Math.log(800)),qy=y(0);
    s+='<circle cx="'+px+'" cy="'+py+'" r="5"/><rect x="'+(qx-5)+'" y="'+(qy-5)+'" width="10" height="10"/>';
    s+=text(px+118,py+29,'P: (5.99146, −1.38629)')+text(qx-131,qy-15,'Q: (6.68461, 0.00000)');
    s+=text(342,349,'Horizontal coordinate: natural log of life in hours')+text(330,378,'Use the axis transformations stated in the question.');
    return svg(c.title,c.description,660,400,s);
  }
  function missionProfile(c,high=2) {
    const x=t=>82+t/10*526,y=rate=>274-rate/.0035*217;let s='';
    for(const rate of [0,.001,.002,.003])s+=line(82,y(rate),608,y(rate),'class="cre2-grid"')+text(45,y(rate)+5,rate.toFixed(3));
    for(const t of [0,2,4,6,8,10])s+=line(x(t),274,x(t),280)+text(x(t),304,String(t));
    s+=line(82,57,82,274)+line(82,274,608,274)+text(237,25,'Conditional hazard (per operating hour)');
    if(high>0)s+=line(x(0),y(.003),x(high),y(.003),'class="cre2-curve"');
    if(high<10)s+=line(x(high),y(.0005),x(10),y(.0005),'class="cre2-curve"');
    if(high>0&&high<10)s+=line(x(high),y(.003),x(high),y(.0005),'stroke-dasharray="6 4"');
    s+=text(345,334,'Elapsed operating time (hours)')+text(330,363,'High-stress duration: '+high+' h; low-stress duration: '+(10-high)+' h')+text(330,389,'No additional startup, transition, or repair event.');
    return svg(c.title,'The first '+high+' hours have conditional hazard 0.003 per hour. The remaining '+(10-high)+' hours have conditional hazard 0.0005 per hour. Total mission duration is ten hours.',660,412,s);
  }
  const replacementPolicies=cost=>[
    {name:'100 h or failure',rate:(200*.98+cost*.02)/99},
    {name:'200 h or failure',rate:(200*.90+cost*.10)/193},
    {name:'300 h or failure',rate:(200*.70+cost*.30)/275},
    {name:'Failure only',rate:cost/500}
  ];
  function replacementPlot(cost) {
    const policies=replacementPolicies(cost),x=v=>151+v/8*435;let s='';
    for(const v of [0,2,4,6,8])s+=line(x(v),48,x(v),291,'class="cre2-grid"')+text(x(v),316,String(v));
    policies.forEach((p,i)=>{const y=63+i*60;s+=text(75,y+23,p.name)+'<rect x="151" y="'+y+'" width="'+(x(p.rate)-151)+'" height="32" rx="3"/>'+text(646,y+23,p.rate.toFixed(3));});
    s+=text(357,25,'Expected replacement cost per operating hour')+line(151,291,586,291)+text(370,348,'Dollars per operating hour; four supplied candidate policies');
    return svg('Replacement-policy cost exploration',policies.map(p=>p.name+': '+p.rate.toFixed(3)+' dollars per operating hour.').join(' '),710,371,s);
  }
  function capabilitySpread(c) {
    const x=v=>82+(v-75)/50*550;let s='';
    for(const [v,label] of [[80,'Lower specification: 80 N'],[120,'Upper specification: 120 N']])s+=line(x(v),49,x(v),280,'stroke-dasharray="7 4"')+text(v===80?158:538,28,label);
    for(const [low,high,y,label] of [[97,115,112,'Within-subgroup spread'],[91,121,225,'Overall spread']]){
      s+=text(352,y-38,label)+line(x(low),y,x(high),y,'class="cre2-curve"')+line(x(low),y-10,x(low),y+10)+line(x(high),y-10,x(high),y+10);
      s+='<circle cx="'+x(106)+'" cy="'+y+'" r="5"/>'+text(x(low),y+28,String(low))+text(x(106),y+28,'Mean 106')+text(x(high)+(high===121?22:0),y+28,String(high));
    }
    s+=line(82,286,632,286);
    for(const v of [80,90,100,110,120])s+=line(x(v),286,x(v),293)+text(x(v),316,String(v));
    s+=text(352,343,'Spring force at specified deflection (newtons)')+text(352,370,'Each interval extends three standard deviations from the mean.')+text(352,394,'Spread comparison, not a confidence interval.');
    return svg(c.title,c.description,710,417,s);
  }
  function degradationTrend(c) {
    const x=t=>76+t/700*548,y=d=>278-d/.7*219;let s='';
    for(const d of [0,.2,.4,.6])s+=line(76,y(d),624,y(d),'class="cre2-grid"')+text(43,y(d)+5,d.toFixed(2));
    for(const t of [0,200,400,600])s+=line(x(t),278,x(t),285)+text(x(t),310,String(t));
    s+=line(76,59,76,278)+line(76,278,624,278)+text(206,25,'Measured clearance (millimeters)');
    s+=line(76,y(.6),624,y(.6),'stroke-dasharray="7 4"')+text(350,y(.6)-15,'Failure threshold: 0.60 mm');
    s+=line(x(200),y(.12),x(600),y(.28),'class="cre2-curve"');
    for(const [t,d] of [[200,.12],[400,.20],[600,.28]])s+='<circle cx="'+x(t)+'" cy="'+y(d)+'" r="5"/>'+text(x(t),y(d)-(t===200?35:18),'('+t+', '+d.toFixed(2)+')');
    s+=text(350,341,'Total operating age (hours)')+text(350,370,'Fitted segment shown only across measured ages.');
    return svg(c.title,c.description,670,395,s);
  }
  function votingSystem(c,required=2) {
    let s='<rect x="24" y="35" width="450" height="315" rx="10"/>'+text(249,67,'Sensor group: at least '+required+' of 3 required');
    s+=line(8,205,60,205)+line(60,123,60,287)+line(425,123,425,287);
    for(const [label,y] of [['Sensor A',98],['Sensor B',180],['Sensor C',262]])s+=line(60,y+25,100,y+25)+box(100,y,275,50,label+' · reliability 0.90')+line(375,y+25,425,y+25);
    s+=line(425,205,520,205)+'<rect x="520" y="172" width="175" height="66" rx="7"/>'+text(607.5,197,'Required voter')+text(607.5,221,'Reliability 0.98')+line(695,205,732,205);
    s+=text(370,381,'All sensors are active; component outcomes are independent.');
    return svg(c.title,'At least '+required+' of three active sensors must operate correctly. Each has mission reliability 0.90. A separate required voter has reliability 0.98. All four component outcomes are independent.',740,405,s);
  }
  const chiSquareCount=b=>{
    const expectedFailures=(20+b)/2,expectedSurvivors=200-expectedFailures;
    return [20,b].reduce((sum,failures)=>sum+(failures-expectedFailures)**2/expectedFailures+(200-failures-expectedSurvivors)**2/expectedSurvivors,0);
  };
  function chiSquarePlot(count) {
    const x=n=>80+n/60*545,y=v=>278-v/30*223;let s='';
    for(const v of [0,10,20,30])s+=line(80,y(v),625,y(v),'class="cre2-grid"')+text(46,y(v)+5,String(v));
    for(const n of [0,10,20,30,40,50,60])s+=line(x(n),278,x(n),284)+text(x(n),309,String(n));
    s+=line(80,55,80,278)+line(80,278,625,278)+text(235,25,'Pearson chi-square statistic');
    s+=line(80,y(6.635),625,y(6.635),'stroke-dasharray="7 4"');
    const points=Array.from({length:61},(_,n)=>x(n)+','+y(chiSquareCount(n))).join(' ');
    s+='<polyline class="cre2-curve" points="'+points+'"/><circle cx="'+x(count)+'" cy="'+y(chiSquareCount(count))+'" r="6"/>';
    s+=text(350,340,'Line B failures out of 200; Line A stays at 20 out of 200')+text(350,368,'Dashed line: 1% critical value 6.635; one degree of freedom');
    return svg('Chi-square count exploration','Line B has '+count+' failures out of 200. Line A has 20 failures out of 200. The uncorrected Pearson statistic is '+chiSquareCount(count).toFixed(4)+'. Reject independence when the statistic exceeds 6.635. The curve reaches zero when both lines have 20 failures.',680,392,s);
  }
  const votingProbability=k=>[0,1,2,3].filter(n=>n>=k).reduce((sum,n)=>sum+[1,3,3,1][n]*Math.pow(.9,n)*Math.pow(.1,3-n),0);
  function minimalCuts(c) {
    let s=box(250,18,160,40,'Top event T')+line(330,58,330,76)+box(292,76,76,34,'AND');
    s+=line(330,110,330,130)+line(165,130,495,130)+line(165,130,165,151)+line(495,130,495,151);
    s+=box(129,151,72,34,'OR')+box(459,151,72,34,'OR');
    for(const [cx,a,b] of [[165,85,245],[495,415,575]])s+=line(cx,185,cx,207)+line(a,207,b,207)+line(a,207,a,230)+line(b,207,b,230);
    for(const [x,label] of [[85,'A'],[245,'B'],[415,'A'],[575,'C']])s+='<circle cx="'+x+'" cy="257" r="27"/>'+text(x,262,label);
    s+=text(330,321,'Both A symbols denote the same basic event.')+text(330,348,'Find sufficient sets that contain no smaller sufficient subset.');
    return svg(c.title,c.description,660,370,s);
  }
  const fatigueMedian=stress=>64000*Math.pow(60/stress,3);
  function fatigueModel(c,stress) {
    const x=v=>86+Math.log(v/60)/Math.log(2)*520,y=v=>284-Math.log(v/8000)/Math.log(8)*216;let s='';
    for(const v of [8000,16000,32000,64000])s+=line(86,y(v),606,y(v),'class="cre2-grid"')+text(47,y(v)+5,v.toLocaleString('en-US'));
    for(const v of [60,70,80,100,120])s+=line(x(v),284,x(v),290)+text(x(v),311,String(v));
    s+=line(86,68,86,284)+line(86,284,606,284)+text(330,22,'Median cycles to failure (logarithmic scale)');
    s+=line(x(60),y(64000),x(120),y(8000),'class="cre2-curve"');
    s+='<circle cx="'+x(60)+'" cy="'+y(64000)+'" r="5"/><rect x="'+(x(120)-5)+'" y="'+(y(8000)-5)+'" width="10" height="10"/>';
    s+=text(192,51,'60 MPa; 64,000 cycles')+text(504,51,'120 MPa; 8,000 cycles');
    if(stress!==undefined)s+=line(x(stress),68,x(stress),284,'class="cre2-mission"')+'<circle cx="'+x(stress)+'" cy="'+y(fatigueMedian(stress))+'" r="7"/>';
    s+=text(346,345,'Stress amplitude (MPa; logarithmic scale)')+text(330,375,stress===undefined?'Stipulated inverse-power fit; no uncertainty bounds shown.':'Selected stress: '+stress+' MPa; other test conditions fixed.');
    return svg(stress===undefined?c.title:'Fatigue-stress exploration',stress===undefined?c.description:'At '+stress+' MPa, the fitted median is '+Math.round(fatigueMedian(stress)).toLocaleString('en-US')+' cycles. Both axes are logarithmic; this is a median, not a minimum-life guarantee.',660,398,s);
  }
  function coldStandby(c) {
    let s=box(195,18,270,48,'A active; B idle and protected');
    s+=line(330,66,330,88)+line(150,88,510,88)+line(150,88,150,119)+line(510,88,510,119);
    s+=box(40,119,220,50,'A survives all 200 hours')+box(400,119,220,50,'A fails before 200 hours');
    s+=line(150,169,150,199)+line(150,235,150,305)+box(60,305,180,50,'Mission succeeds');
    s+=line(510,169,510,204)+box(391,204,238,50,'Transfer success: 90%');
    s+=line(510,254,510,262)+line(510,294,510,305)+box(391,305,238,50,'B must finish the mission');
    s+=text(150,225,'No transfer needed')+text(510,287,'If transfer succeeds')+text(330,395,'Failed transfer or failure of active B ends the mission.')+text(330,422,'B accumulates operating time only after activation.');
    return svg(c.title,c.description,660,445,s);
  }
  const standbyReliability=coverage=>Math.exp(-.2)*(1+.2*coverage);
  function standbyPlot(coverage) {
    const x=c=>82+c*526,y=r=>278-(r-.8)/.2*218;let s='';
    for(const r of [.8,.85,.9,.95,1])s+=line(82,y(r),608,y(r),'class="cre2-grid"')+text(46,y(r)+5,r.toFixed(2));
    for(const c of [0,.2,.4,.6,.8,1])s+=line(x(c),278,x(c),284)+text(x(c),308,(100*c).toFixed(0)+'%');
    s+=line(82,60,82,278)+line(82,278,608,278)+text(265,25,'200-hour system reliability');
    s+=line(x(0),y(standbyReliability(0)),x(1),y(standbyReliability(1)),'class="cre2-curve"')+line(x(coverage),60,x(coverage),278,'class="cre2-mission"')+'<circle cx="'+x(coverage)+'" cy="'+y(standbyReliability(coverage))+'" r="6"/>';
    s+=text(344,341,'Detection-and-transfer success probability')+text(330,372,'Vertical scale starts at 0.80; module lifetimes stay fixed.');
    return svg('Cold-standby transfer exploration','At transfer success '+(100*coverage).toFixed(0)+' percent, system reliability is '+standbyReliability(coverage).toFixed(5)+'. At zero coverage it equals the reliability of A alone; perfect coverage gives 0.98248. The vertical scale starts at 0.80.',660,395,s);
  }
  function repairWorkflow(c) {
    const x=t=>146+t*92;let s=text(330,25,'Class B only: 25% of repairs');
    for(let t=0;t<=5;t++)s+=line(x(t),62,x(t),69)+text(x(t),51,String(t));
    s+=line(x(0),69,x(5),69);
    for(const [label,start,end,y,crew] of [['Isolate',0,1,100,1],['Job X',1,3,164,2],['Job Y',1,4,228,1],['Verify',4,5,292,1]]){
      s+=text(69,y+27,label)+box(x(start),y,(end-start)*92,42,crew+(crew===1?' tech':' techs'));
    }
    s+=line(x(1),142,x(1),270,'stroke-dasharray="4 4"')+line(x(4),206,x(4),334,'stroke-dasharray="4 4"');
    s+=text(330,369,'Elapsed active-maintenance time (hours)')+text(330,397,'X and Y start together; verification waits for both.')+text(330,423,'Task crews are separate; Class A details are in the table.');
    return svg(c.title,c.description,660,447,s);
  }
  function lifetimeDensity(c, age=1500) {
    const x=t=>100+t/2000*530,y=f=>282-f/.001*212;
    let s='';
    for(const f of [0,.00025,.0005,.00075,.001])s+=line(100,y(f),630,y(f),'class="cre2-grid"')+text(52,y(f)+5,f.toFixed(5));
    for(const t of [0,500,1000,1500,2000])s+=line(x(t),282,x(t),288)+text(x(t),310,t.toLocaleString('en-US'));
    s+='<polygon points="100,282 '+x(age)+',282 '+x(age)+','+y(age/2000000)+'" fill="currentColor" opacity="0.10"/>';
    s+=line(100,70,100,282)+line(100,282,630,282)+line(100,282,630,70,'class="cre2-curve"');
    s+=line(x(age),70,x(age),282,'class="cre2-mission"')+'<circle cx="'+x(age)+'" cy="'+y(age/2000000)+'" r="5"/>';
    s+=text(240,28,'Probability density f(t), per hour')+text(365,345,'Age (hours)');
    s+=text(355,377,'Shaded area: probability of failure by the selected age.')+text(355,403,'Marker: '+age.toLocaleString('en-US')+' h; density is zero outside 0–2,000 h.');
    return svg(c.title,'A linear density rises from zero to 0.001 per hour over ages zero to 2,000 hours. The marker and shaded area extend to age '+age+' hours. The density height is '+(age/2000000).toFixed(6)+' per hour.',680,428,s);
  }
  function thermalExposure(c) {
    const x=t=>72+t/100*560,y=t=>309-(t-20)/70*210;let s='';
    for(const temp of [20,40,60,80,90])s+=line(72,y(temp),632,y(temp),'class="cre2-grid"')+text(43,y(temp)+5,String(temp));
    for(const minute of [0,20,40,60,80,100])s+=line(x(minute),309,x(minute),315)+text(x(minute),337,String(minute));
    s+='<rect x="72" y="'+y(87)+'" width="560" height="'+(y(83)-y(87))+'" style="fill:currentColor;opacity:0.12;stroke:none"/>';
    s+=line(72,99,72,309)+line(72,309,632,309)+text(163,79,'Temperature (°C)');
    s+=line(70,24,108,24)+text(216,29,'Product (solid)')+line(363,24,401,24,'stroke-dasharray="8 5"')+text(518,29,'Chamber (dashed)');
    s+=text(363,55,'Shaded product band: 83–87 °C');
    for(const [col,dash] of [[1,' stroke-dasharray="8 5"'],[2,'']])s+='<polyline class="cre2-curve" points="'+c.rows.map(r=>x(r[0])+','+y(r[col])).join(' ')+'"'+dash+'/>';
    c.rows.forEach(r=>{s+='<circle cx="'+x(r[0])+'" cy="'+y(r[2])+'" r="3"/>';});
    s+=line(x(40),y(83),x(40),309,'class="cre2-mission"')+line(x(90),y(85),x(90),309,'class="cre2-mission"');
    s+=text(345,370,'Elapsed test time (minutes)')+text(345,400,'Continuous record: first band entry at 40 min; assessment at 90 min.');
    return svg(c.title,c.description,690,425,s);
  }
  function diagnosticCoverage(c) {
    let s=box(235,18,210,44,'Diagnostic attempt')+line(340,62,340,82)+line(178,82,502,82)+line(178,82,178,92)+line(178,122,178,132)+line(502,82,502,92)+line(502,122,502,132);
    s+=text(178,115,'Probability c')+text(502,115,'Probability 1 − c');
    s+='<rect x="26" y="132" width="304" height="79" rx="7"/>'+text(178,160,'Correct initial module isolation')+text(178,191,'Total diagnosis: 0.25 h');
    s+='<rect x="350" y="132" width="304" height="79" rx="7"/>'+text(502,160,'Further fault isolation')+text(502,191,'Total diagnosis: 2.75 h');
    s+=line(178,211,178,241)+line(502,211,502,241)+line(178,241,502,241)+line(340,241,340,270);
    s+='<rect x="162" y="270" width="356" height="70" rx="7"/>'+text(340,297,'Replacement and verification')+text(340,324,'Additional time: 0.50 h');
    s+=text(340,374,'Each diagnostic duration already includes the initial attempt.');
    return svg(c.title,c.description,680,399,s);
  }
  function inspectionWindow(c) {
    const span=(y,x1,x2)=>line(x1,y,x2,y)+line(x1,y-8,x1,y+8)+line(x2,y-8,x2,y+8);
    let s=text(350,29,'Degradation interval, measured from condition appearance');
    s+=span(70,100,590)+text(345,61,'14 days')+text(100,103,'P: detectable')+text(590,103,'F: functional failure');
    s+=text(350,156,'Inspection schedule, with an unspecified phase relative to P');
    s+=span(196,100,450)+text(275,187,'10 days')+text(100,229,'Inspection')+text(450,229,'Next inspection');
    s+=text(350,282,'Response time, measured from detection at an inspection');
    s+=span(322,100,310)+text(205,313,'6 days')+text(100,355,'Detection')+text(310,355,'Intervention complete');
    s+=text(350,398,'Each strip has its own origin; their starting points are not aligned in time.');
    return svg(c.title,c.description,700,423,s);
  }
  const timelyIntervention=interval=>Math.min(1,8/interval);
  function inspectionPlot(interval) {
    const x=t=>78+(t-4)/16*530,y=p=>280-p*216;let s='';
    for(const p of [0,.2,.4,.6,.8,1])s+=line(78,y(p),608,y(p),'class="cre2-grid"')+text(43,y(p)+5,(p*100).toFixed(0)+'%');
    for(const t of [4,8,12,16,20])s+=line(x(t),280,x(t),286)+text(x(t),309,String(t));
    s+=line(78,64,78,280)+line(78,280,608,280)+text(324,26,'Probability of completing intervention before failure');
    const points=Array.from({length:161},(_,i)=>{const t=4+i/10;return x(t).toFixed(2)+','+y(timelyIntervention(t)).toFixed(2);}).join(' ');
    s+='<polyline class="cre2-curve" points="'+points+'"/>'+line(x(interval),64,x(interval),280,'class="cre2-mission"')+'<circle cx="'+x(interval)+'" cy="'+y(timelyIntervention(interval))+'" r="5"/>';
    s+=text(345,347,'Inspection spacing (days)')+text(345,380,'Fixed 14-day progression and 6-day response; uniform phase.');
    return svg('Inspection spacing and timely intervention','With '+interval+' days between inspections, the modeled probability of timely completed intervention is '+(100*timelyIntervention(interval)).toFixed(1)+' percent. The curve is 100 percent through eight days and declines for longer intervals.',660,405,s);
  }
  function exhibit(q) {
    const c=q.chart;if(!c)return '';
    const diagram = c.creKind==='fault-tree'?faultTree(c):c.creKind==='rbd'?rbd(c):c.creKind==='weibull'?weibull(c):c.creKind==='cpm'?cpm(c):c.creKind==='duane'?duane(c):c.creKind==='event-tree'?eventTree(c):c.creKind==='p-chart'?pChart(c):c.creKind==='interaction'?interaction(c):c.creKind==='p-diagram'?pDiagram(c):c.creKind==='conditional-life'?conditionalLife(c):c.creKind==='derating'?derating(c):c.creKind==='weibull-probability'?weibullProbability(c):c.creKind==='mission-profile'?missionProfile(c):c.creKind==='capability-spread'?capabilitySpread(c):c.creKind==='degradation-trend'?degradationTrend(c):c.creKind==='voting-system'?votingSystem(c):c.creKind==='minimal-cuts'?minimalCuts(c):c.creKind==='fatigue-model'?fatigueModel(c):c.creKind==='cold-standby'?coldStandby(c):c.creKind==='repair-workflow'?repairWorkflow(c):c.creKind==='lifetime-density'?lifetimeDensity(c):c.creKind==='thermal-exposure'?thermalExposure(c):c.creKind==='diagnostic-coverage'?diagnosticCoverage(c):c.creKind==='inspection-window'?inspectionWindow(c):'';
    return '<section class="cre2-exhibit" aria-label="Question evidence">'+
      (diagram?'<p class="cre2-caption">'+esc(c.title)+'</p>'+diagram+'<details class="cre2-alternative"><summary>Read the diagram description and data table</summary>'+(c.description?'<p>'+esc(c.description)+'</p>':'')+table(c)+'</details>':table(c))+
      '<p class="cre2-scroll-note">On a narrow screen, swipe or scroll within the exhibit to read it at full size.</p></section>';
  }
  function render(q,review) {
    if(!isQuestion(q))return '';
    return '<div class="cre-set2-question" data-cre-question="'+esc(q.qid)+'"><p class="cre2-item-label">CRE · Set 2 · Q'+String(q.number).padStart(3,'0')+'</p><div class="'+(review?'tb-review-stem':'tb-stem')+'" data-question-id="'+esc(q.qid)+'">'+esc(q.stem)+'</div>'+exhibit(q)+'</div>';
  }
  function reference(q) {
    if(!isQuestion(q))return '';
    let html='<p class="cre2-source"><strong>Study reference:</strong> ASQ CRE Handbook, 4th edition (2025), Chapter '+esc(q.handbook.chapter)+' — '+esc(q.handbook.section)+'. <strong>BoK:</strong> '+esc(q.bok)+'.</p>';
    if(q.studyReference) html+='<a class="tb-review-lesson" href="'+esc(q.studyReference.url)+'">Study: '+esc(q.studyReference.title)+'</a>';
    else html+='<p class="cre2-source">'+esc(q.lessonGap)+'</p>';
    return html;
  }
  function explorer(q) {
    const id='cre2-explore-'+q.number;
    const header='<details class="cre2-explorer" data-cre-explorer="'+q.explorer+'"><summary>Explore this concept</summary><p>Change the practice scenario to test your understanding. The original question, answer key, and score stay unchanged.</p>';
    if(q.explorer==='weibull')return header+'<label for="'+id+'">Mission duration (hours)</label><input id="'+id+'" type="range" min="100" max="1900" step="100" value="500"><div data-cre-explorer-plot>'+weibull(q.chart,500)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 500 hours</button></details>';
    if(q.explorer==='sample-size')return header+'<label for="'+id+'">One-sided confidence level</label><select id="'+id+'"><option value="0.90">90%</option><option value="0.95" selected>95% (question baseline)</option><option value="0.99">99%</option></select><p>Required mission reliability stays at 0.90; acceptance still requires zero failures.</p><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 95%</button></details>';
    if(q.explorer==='alarm-prevalence')return header+'<label for="'+id+'">Fault prevalence in the population</label><select id="'+id+'"><option value="0.01">1%</option><option value="0.02" selected>2% (question baseline)</option><option value="0.05">5%</option><option value="0.10">10%</option></select><p>Sensitivity stays at 90%; the false-alarm probability among healthy units stays at 5%. Counts below are expected values per 10,000 units.</p><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 2%</button></details>';
    if(q.explorer==='acceptance-risk')return header+'<label for="'+id+'">Maximum failures permitted for acceptance</label><select id="'+id+'"><option value="0">0 failures</option><option value="1" selected>1 failure (question baseline)</option><option value="2">2 failures</option></select><p>The sample stays at 20 independent completed missions; true mission reliability stays at the good-quality reference of 0.95. Changing this control changes the hypothetical acceptance rule.</p><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 1 failure</button></details>';
    if(q.explorer==='p-chart-sample')return header+'<label for="'+id+'">Week 2 sample size at the same 4.5% observed proportion</label><select id="'+id+'"><option value="200">200 units; 9 nonconforming</option><option value="400" selected>400 units; 18 nonconforming (question baseline)</option><option value="800">800 units; 36 nonconforming</option></select><p>The established baseline stays at 2.0%; the other weeks remain unchanged.</p><div data-cre-explorer-plot>'+pChart(q.chart,400)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 400 units</button></details>';
    if(q.explorer==='arrhenius-temperature')return header+'<label for="'+id+'">Test temperature (°C)</label><input id="'+id+'" type="range" min="60" max="110" step="5" value="85"><p>Use temperature stays at 55 °C and activation energy at 0.70 eV. This hypothetical exploration assumes the model remains valid; it does not authorize a higher test stress.</p><div data-cre-explorer-plot>'+arrheniusPlot(85)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 85 °C</button></details>';
    if(q.explorer==='sequential-failures')return header+'<label for="'+id+'">Hypothetical cumulative failure count</label><input id="'+id+'" type="range" min="0" max="8" step="1" value="4"><p>Total exposure stays at 2,500 unit-hours. This classifies separate hypothetical states, not a continuing test path. A real test stops at its first boundary or approved truncation limit.</p><div data-cre-explorer-plot>'+sequentialPlot(4)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 4 failures</button></details>';
    if(q.explorer==='derating-temperature')return header+'<label for="'+id+'">Applicable ambient temperature (°C)</label><input id="'+id+'" type="range" min="30" max="150" step="5" value="100"><p>Resistance stays at 100 Ω, the company power limit at 60% of the local manufacturer rating, and the independent voltage limit at 10.0 V RMS. The stated mounting conditions still apply.</p><div data-cre-explorer-plot>'+derating(q.chart,100,true)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 100 °C</button></details>';
    if(q.explorer==='mission-high-duration')return header+'<label for="'+id+'">High-stress duration within the 10-hour mission (hours)</label><input id="'+id+'" type="range" min="0" max="10" step="1" value="2"><p>The remaining hours use the low-stress rate. Both conditional hazards stay fixed; no extra startup or transition failure is added.</p><div data-cre-explorer-plot>'+missionProfile(q.chart,2)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 2 high-stress hours</button></details>';
    if(q.explorer==='replacement-failure-cost')return header+'<label for="'+id+'">Total failure-replacement cost (dollars)</label><input id="'+id+'" type="range" min="500" max="4000" step="100" value="1000"><p>Scheduled replacement stays at $200. The lifetime model, expected cycle lengths, and four candidate policies remain fixed. This compares only those candidates, not every possible replacement age.</p><div data-cre-explorer-plot>'+replacementPlot(1000)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to $1,000</button></details>';
    if(q.explorer==='chi-square-count')return header+'<label for="'+id+'">Line B failures out of 200 completed missions</label><input id="'+id+'" type="range" min="0" max="60" step="5" value="40"><p>Line A stays at 20 failures out of 200. The remaining units in each line are survivors. Use the same independent-sample model, uncorrected statistic, and 1% significance level.</p><div data-cre-explorer-plot>'+chiSquarePlot(40)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 40 Line B failures</button></details>';
    if(q.explorer==='voting-required')return header+'<label for="'+id+'">Minimum number of successful sensors required</label><select id="'+id+'"><option value="1">1 of 3</option><option value="2" selected>2 of 3 (question baseline)</option><option value="3">3 of 3</option></select><p>All sensor reliabilities remain 0.90; the required voter remains 0.98. Independence and all other assumptions stay fixed.</p><div data-cre-explorer-plot>'+votingSystem(q.chart,2)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 2 required sensors</button></details>';
    if(q.explorer==='fatigue-stress')return header+'<label for="'+id+'">Stress amplitude (MPa)</label><input id="'+id+'" type="range" min="60" max="120" step="5" value="80"><p>The fitted exponent stays at three. Explore only the stated 60–120 MPa interval with unchanged stress ratio, frequency, environment, and failure mechanism. Results are medians, not guaranteed lives.</p><div data-cre-explorer-plot>'+fatigueModel(q.chart,80)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 80 MPa</button></details>';
    if(q.explorer==='standby-coverage')return header+'<label for="'+id+'">Detection-and-transfer success probability</label><select id="'+id+'"><option value="0">0%</option><option value="0.5">50%</option><option value="0.9" selected>90% (question baseline)</option><option value="1">100%</option></select><p>The mission stays at 200 hours and both operating failure rates at 0.001 per hour. Idle failures and transfer delays remain excluded.</p><div data-cre-explorer-plot>'+standbyPlot(.9)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 90%</button></details>';
    if(q.explorer==='density-age')return header+'<label for="'+id+'">Surviving unit’s age (hours)</label><input id="'+id+'" type="range" min="200" max="1800" step="100" value="1500"><p>The specified density model stays fixed. The shaded area gives cumulative failure probability; hazard conditions on the remaining survivors.</p><div data-cre-explorer-plot>'+lifetimeDensity(q.chart,1500)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 1,500 hours</button></details>';
    if(q.explorer==='inspection-interval')return header+'<label for="'+id+'">Time between inspections (days)</label><input id="'+id+'" type="range" min="4" max="20" step="2" value="10"><p>The detectable-to-failure interval stays at 14 days and the complete response at 6 days. Detection is perfect; condition appearance has uniform phase. This explores only the stated hypothetical failure mode.</p><div data-cre-explorer-plot>'+inspectionPlot(10)+'</div><output for="'+id+'" role="status" aria-live="polite"></output><button type="button" data-cre-reset>Reset to 10 days</button></details>';
    return '';
  }
  function updateExplorer(el,q) {
    const control=el.querySelector('input,select'), value=Number(control.value),out=el.querySelector('output');
    if(q.explorer==='weibull'){
      const a=Math.exp(-value/1000), b=Math.exp(-Math.pow(value/1000,2));
      out.textContent=value+' hours: A reliability '+a.toFixed(4)+'; B reliability '+b.toFixed(4)+'. '+(Math.abs(a-b)<1e-10?'The designs are equal at this time.':(a>b?'A':'B')+' has higher reliability at this time.');
      el.querySelector('[data-cre-explorer-plot]').innerHTML=weibull(q.chart,value);
    } else if(q.explorer==='sample-size') {
      const n=Math.ceil(Math.log(1-value)/Math.log(0.9));
      out.textContent='Minimum sample: '+n+' independent units completing the full mission with zero failures. All-success probability at reliability 0.90: '+Math.pow(.9,n).toFixed(5)+'.';
    } else if(q.explorer==='alarm-prevalence') {
      const trueAlarms=10000*value*.9,falseAlarms=10000*(1-value)*.05;
      out.textContent='Expected true alarms: '+trueAlarms.toFixed(0)+'; false alarms: '+falseAlarms.toFixed(0)+'. Probability of a fault given an alarm: '+(100*trueAlarms/(trueAlarms+falseAlarms)).toFixed(1)+'%.';
    } else if(q.explorer==='acceptance-risk') {
      let term=Math.pow(.95,20),accept=term;
      for(let k=1;k<=value;k++){term*=((21-k)/k)*(.05/.95);accept+=term;}
      out.textContent='Acceptance probability: '+(100*accept).toFixed(1)+'%. Producer’s risk (rejection at reliability 0.95): '+(100*(1-accept)).toFixed(1)+'%.';
    } else if(q.explorer==='p-chart-sample') {
      const upper=.02+3*Math.sqrt(.02*.98/value);
      out.textContent='Week 2: '+(.045*value)+' / '+value+' = 4.5%. Upper limit: '+(100*upper).toFixed(2)+'%. '+(.045>upper?'Above the upper limit: investigate the signal.':'Within the upper limit under the stated single-point rule.');
      el.querySelector('[data-cre-explorer-plot]').innerHTML=pChart(q.chart,value);
    } else if(q.explorer==='arrhenius-temperature') {
      out.textContent='Test temperature: '+value+' °C = '+(value+273.15).toFixed(2)+' K. Acceleration factor: '+acceleration(value).toFixed(2)+'. Under this model, 100 hours at test temperature corresponds to '+(100*acceleration(value)).toFixed(1)+' equivalent hours at 55 °C.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=arrheniusPlot(value);
    } else if(q.explorer==='sequential-failures') {
      const ratio=Math.pow(2,value)*Math.exp(-2.5),decision=ratio<=1/9?'Accept':ratio>=9?'Reject':'Continue';
      out.textContent=value+' failures at 2,500 unit-hours. Likelihood ratio: '+ratio.toFixed(4)+'. Decision for this hypothetical state: '+decision+'. Boundaries remain one ninth and nine.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=sequentialPlot(value);
    } else if(q.explorer==='derating-temperature') {
      const rated=ratedPower(value),allowed=.6*rated,powerVoltage=Math.sqrt(100*allowed),voltage=Math.min(10,powerVoltage);
      out.textContent='Ambient: '+value+' °C. Manufacturer rating: '+rated.toFixed(4)+' W. Company power limit: '+allowed.toFixed(4)+' W. Maximum RMS voltage: '+voltage.toFixed(2)+' V. Governing constraint: '+(powerVoltage<10?'temperature-dependent power limit.':'independent 10.0 V working-voltage limit.');
      el.querySelector('[data-cre-explorer-plot]').innerHTML=derating(q.chart,value,true);
    } else if(q.explorer==='mission-high-duration') {
      const hazard=.003*value+.0005*(10-value);
      out.textContent='High stress: '+value+' h; low stress: '+(10-value)+' h. Accumulated hazard: '+hazard.toFixed(4)+'. Mission survival probability: '+Math.exp(-hazard).toFixed(5)+'.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=missionProfile(q.chart,value);
    } else if(q.explorer==='replacement-failure-cost') {
      const policies=replacementPolicies(value),best=policies.reduce((a,b)=>a.rate<b.rate?a:b);
      out.textContent='Failure-replacement cost: $'+value.toLocaleString('en-US')+'. '+policies.map(p=>p.name+': $'+p.rate.toFixed(3)+' per operating hour.').join(' ')+' Lowest among these candidates: '+best.name+'.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=replacementPlot(value);
    } else if(q.explorer==='chi-square-count') {
      const expected=(20+value)/2,statistic=chiSquareCount(value);
      out.textContent='Line B: '+value+' failures and '+(200-value)+' survivors. Expected per line: '+expected.toFixed(1)+' failures and '+(200-expected).toFixed(1)+' survivors. Chi-square: '+statistic.toFixed(4)+'. At 1%: '+(statistic>6.635?'Reject independence.':'Fail to reject independence.')+' Association alone does not establish a cause.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=chiSquarePlot(value);
    } else if(q.explorer==='voting-required') {
      const group=votingProbability(value);
      out.textContent='At least '+value+' of 3 sensors required. Sensor-group reliability: '+group.toFixed(5)+'. Including the required voter: system reliability '+(group*.98).toFixed(5)+'.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=votingSystem(q.chart,value);
    } else if(q.explorer==='fatigue-stress') {
      out.textContent='Stress amplitude: '+value+' MPa. Fitted median life: '+Math.round(fatigueMedian(value)).toLocaleString('en-US')+' cycles. This is a model median, not a lower confidence or tolerance bound.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=fatigueModel(q.chart,value);
    } else if(q.explorer==='standby-coverage') {
      const primary=Math.exp(-.2),standby=value*.2*primary;
      out.textContent='Transfer success: '+(100*value).toFixed(0)+'%. Success without transfer: '+primary.toFixed(5)+'. Additional success via the spare: '+standby.toFixed(5)+'. Total mission reliability: '+standbyReliability(value).toFixed(5)+'.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=standbyPlot(value);
    } else if(q.explorer==='density-age') {
      const density=value/2000000,cdf=value*value/4000000,survival=1-cdf;
      out.textContent='Age: '+value.toLocaleString('en-US')+' h. Density: '+density.toFixed(6)+' per hour. Cumulative failure probability: '+cdf.toFixed(4)+'. Survival probability: '+survival.toFixed(4)+'. Instantaneous hazard: '+(density/survival).toFixed(6)+' per hour; this is a conditional rate, not a finite-interval probability.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=lifetimeDensity(q.chart,value);
    } else if(q.explorer==='inspection-interval') {
      out.textContent='Inspection spacing: '+value+' days. Detection delay is uniform from 0 to '+value+' days. Completion must occur before day 14, so detection must occur before day 8. Probability of timely completed intervention: '+(100*timelyIntervention(value)).toFixed(1)+'%.';
      el.querySelector('[data-cre-explorer-plot]').innerHTML=inspectionPlot(value);
    }
  }
  let mathQueue=Promise.resolve();
  function typeset(root) {
    if(!root || root.dataset.creMathStarted || !global.UpskillMath)return;
    root.dataset.creMathStarted='true';
    mathQueue=mathQueue.catch(()=>{}).then(async()=>{
      if(!root.isConnected)return;
      await global.UpskillMath.typeset([root]);
      root.querySelectorAll('mjx-container[display="true"]').forEach(el=>{
        el.tabIndex=0;el.setAttribute('role','region');el.setAttribute('aria-label','Mathematical working; scroll horizontally when needed');
      });
    }).catch(()=>{root.removeAttribute('data-cre-math-started');});
  }
  function wire(host) {
    const quiz=host?.querySelector('.tb-quiz');
    if(quiz?.querySelector('.cre-set2-question'))typeset(quiz);
  }
  function wireReview(event) {
    const root=event.detail?.root || document;
    const cards=root.matches?.('.tb-review-card')?[root]:root.querySelectorAll('.tb-review-card');
    cards.forEach(card=>{
      const id=card.querySelector('[data-cre-question]')?.dataset.creQuestion;
      const q=(global.CRE_SET2||[]).find(q=>q.qid===id);if(!q)return;
      if(q.explorer&&!card.querySelector('.cre2-explorer')){
        card.querySelector('.tb-explanation')?.insertAdjacentHTML('beforeend',explorer(q));
        const el=card.querySelector('.cre2-explorer');
        if(el){
          const control=el.querySelector('input,select');
          control.addEventListener('input',()=>updateExplorer(el,q));
          control.addEventListener('change',()=>updateExplorer(el,q));
          const defaults={'weibull':'500','sample-size':'0.95','alarm-prevalence':'0.02','acceptance-risk':'1','p-chart-sample':'400','arrhenius-temperature':'85','sequential-failures':'4','derating-temperature':'100','mission-high-duration':'2','replacement-failure-cost':'1000','chi-square-count':'40','voting-required':'2','fatigue-stress':'80','standby-coverage':'0.9','density-age':'1500','inspection-interval':'10'};
          el.querySelector('[data-cre-reset]').addEventListener('click',()=>{control.value=defaults[q.explorer];updateExplorer(el,q);});
          updateExplorer(el,q);
        }
      }
      typeset(card);
    });
    const retry=root.closest?.('.tb-retry-panel')||root.querySelector('.tb-retry-panel');
    if(retry?.querySelector('.cre-set2-question')){
      // Retry UI updates its contents in place, so typeset the newly created child.
      typeset(retry.querySelector('.tb-retry-feedback'));
    }
    const quiz=root.closest?.('.tb-quiz');
    if(quiz?.querySelector('.cre-set2-question'))typeset(quiz.querySelector('#tb-revealed-answer'));
  }
  if(global.document)document.addEventListener('tb:review-rendered',wireReview);
  global.__CRESet2UI={isQuestion,render,reference,wire,exhibit};
})(window);
