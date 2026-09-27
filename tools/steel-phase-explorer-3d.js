(function(){
'use strict';
var canvas=document.getElementById('spx-crystal-canvas');
if(!canvas||!window.__SPX)return;
var ctx=canvas.getContext('2d'),mode=document.getElementById('spx-crystal-mode'),styleSelect=document.getElementById('spx-crystal-style'),summary=document.getElementById('spx-crystal-summary'),title=document.getElementById('spx-crystal-title'),subtitle=document.getElementById('spx-crystal-subtitle'),carbonToggle=document.getElementById('spx-crystal-carbon'),labelsToggle=document.getElementById('spx-crystal-labels'),spinToggle=document.getElementById('spx-crystal-spin'),motionNote=document.getElementById('spx-crystal-motion-note'),live=document.getElementById('spx-crystal-live'),viewer=document.getElementById('spx-crystal-viewer'),fullscreenButton=viewer&&viewer.querySelector('[data-crystal-action="fullscreen"]');
if(!ctx||!mode||!styleSelect||!summary||!title||!subtitle||!carbonToggle||!labelsToggle||!spinToggle||!viewer)return;
var view={rotX:-.42,rotY:.68,zoom:1,style:styleSelect.value||'hybrid',drag:false,lastX:0,lastY:0,phases:[],equilibriumPhases:[],fractions:{},tie:null,region:'',regionKey:'',point:null,unit:'metric',visible:true,printing:false};
var motionQuery=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null,reduceMotion=!!(motionQuery&&motionQuery.matches),spinFrame=0,resizeFrame=0;
var PHASE_META={
  Austenite:{structure:'Face-centred cubic (FCC)',color:'#f3c53f',className:'austenite',note:'FCC iron lattice with comparatively large interstitial sites for dissolved carbon.'},
  Ferrite:{structure:'Body-centred cubic (BCC)',color:'#4fb685',className:'ferrite',note:'BCC iron lattice. Carbon solubility is very limited at equilibrium.'},
  Cementite:{structure:'Orthorhombic Fe₃C',color:'#8b6bd1',className:'cementite',note:'Schematic 12-Fe/4-C marker motif with orthorhombic axis proportions.'},
  Martensite:{structure:'Body-centred tetragonal (BCT)',color:'#65a9e8',className:'martensite',note:'Supersaturated carbon stretches the BCC-derived lattice along the c-axis. Martensite is a manual, non-equilibrium reference.'}
};
var STYLE_META={space:{label:'Space-filling',note:'unit-cell clipping reveals packed atom segments; carbon markers are overlaid so interstitial content remains visible'},lattice:{label:'Lattice',note:'clear nodes, strong cell edges, and dashed interstitial guides emphasize crystallographic positions'},hybrid:{label:'Hybrid',note:'balanced atoms, cell edges, carbon markers, and dimensions'}};
var EDGES=[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];
var EDGE_CENTERS=[[0,-1,-1],[0,1,-1],[0,-1,1],[0,1,1],[-1,0,-1],[1,0,-1],[-1,0,1],[1,0,1],[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0]];
var FACE_CENTERS=[[0,0,-1],[0,0,1],[0,-1,0],[0,1,0],[-1,0,0],[1,0,0]];
function corners(xScale,yScale,zScale){var x=xScale||1,y=yScale||1,z=zScale||1;return[[-x,-y,-z],[x,-y,-z],[-x,y,-z],[x,y,-z],[-x,-y,z],[x,-y,z],[-x,y,z],[x,y,z]]}
function martensiteRatio(){return 1+.045*clamp(view.point?view.point.c:0,0,1.2)}
function scaledPoint(p,dims){return[p[0]*dims[0],p[1]*dims[1],p[2]*dims[2]]}
function lattice(name){
  var dims=name==='Martensite'?[1,1,martensiteRatio()]:name==='Cementite'?[.9,1.19,.8]:[1,1,1],cell=corners(dims[0],dims[1],dims[2]),iron=cell.slice(),carbon=[];
  if(name==='Austenite'){iron=iron.concat(FACE_CENTERS);carbon=[[0,0,0]].concat(EDGE_CENTERS)}
  else if(name==='Ferrite'){iron.push([0,0,0]);carbon=FACE_CENTERS.concat(EDGE_CENTERS)}
  else if(name==='Martensite'){iron.push([0,0,0]);carbon=[[0,0,-dims[2]],[0,0,dims[2]],[-1,-1,0],[1,-1,0],[-1,1,0],[1,1,0]]}
  else if(name==='Cementite'){
    iron=cell.concat([[-.45,0,-.28],[.45,0,.28],[0,-.45,.62],[0,.45,-.62]].map(function(p){return scaledPoint(p,dims)}));
    carbon=[[0,0,-.78],[0,0,.78],[-.58,.58,0],[.58,-.58,0]].map(function(p){return scaledPoint(p,dims)});
  }
  return{cell:cell,iron:iron,carbon:carbon}
}
function formatCarbon(value){if(value>0&&value<.001)return value.toFixed(4);return String(Math.round(value*1000)/1000)}
function ferriteReference(){var t=view.point?view.point.t:25,b=window.__SPX.bounds;if(!b)return.022;if(t<b.A1)return b.solvus(t);return b.alphaMaxAboveA1(t)}
function phaseCarbonInfo(name){
  if(name==='Cementite')return{value:6.67,text:'6.67 wt% C'};
  if(name==='Martensite'){var nominal=view.point?view.point.c:0;return{value:nominal,text:'nominal '+formatCarbon(nominal)+' wt% C'}}
  if(view.regionKey==='eutectoid'){var invariant=name==='Ferrite'?.022:.77;return{value:invariant,text:'≈ '+formatCarbon(invariant)+' wt% C'}}
  var bulk=view.point?view.point.c:0,manual=mode.value!=='auto',available=view.equilibriumPhases.indexOf(name)!==-1;
  if(view.tie){
    if(name==='Ferrite'&&view.tie.leftName==='α')return{value:view.tie.left,text:'≈ '+formatCarbon(view.tie.left)+' wt% C'};
    if(name==='Austenite'&&(view.tie.leftName==='γ'||view.tie.rightName==='γ')){var endpoint=view.tie.leftName==='γ'?view.tie.left:view.tie.right;return{value:endpoint,text:'≈ '+formatCarbon(endpoint)+' wt% C'}}
  }
  if(manual&&!available&&name==='Ferrite'){var limit=Math.max(0,Math.min(.022,ferriteReference()));return{value:limit,text:'≤ '+formatCarbon(limit)+' wt% C solubility reference'}}
  if(manual&&!available&&name==='Austenite')return{value:bulk,text:'nominal '+formatCarbon(bulk)+' wt% C · out-of-field reference'};
  return{value:bulk,text:'≈ '+formatCarbon(bulk)+' wt% C'}
}
function phaseCarbon(name){return phaseCarbonInfo(name).value}
function markerCount(name,available){if(name==='Cementite')return available;var carbon=phaseCarbon(name);if(carbon<=0)return 0;return clamp(Math.round(carbon/1.2*available),1,available)}
function rotate(p){var x=p[0],y=p[1],z=p[2],cy=Math.cos(view.rotY),sy=Math.sin(view.rotY),cx=Math.cos(view.rotX),sx=Math.sin(view.rotX),x1=x*cy+z*sy,z1=-x*sy+z*cy,y1=y*cx-z1*sx,z2=y*sx+z1*cx;return[x1,y1,z2]}
function project(p,w,h,scale,anchorX){var r=rotate(p),depth=5.6-r[2],perspective=4.7/depth,s=Math.min(w,h)*.17*view.zoom*(scale||1);return{x:(anchorX==null?w/2:anchorX)+r[0]*s*perspective,y:h/2-r[1]*s*perspective,z:r[2],k:perspective}}
function rgba(hex,alpha){var value=parseInt(hex.slice(1),16);return'rgba('+((value>>16)&255)+','+((value>>8)&255)+','+(value&255)+','+alpha+')'}
function sphere(atom,color,w,h,radiusScale,isCarbon,opacity,packingFactor,anchorX){var p=project(atom,w,h,1,anchorX),scene=Math.min(w,h)*.17*p.k*view.zoom*(radiusScale||1),factor=isCarbon?(view.style==='space'?.13:view.style==='lattice'?.07:.08):(view.style==='space'?(packingFactor||.7):view.style==='lattice'?.09:.12),radius=Math.max(3,scene*factor);ctx.save();ctx.globalAlpha=opacity==null?1:opacity;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);if(view.style==='lattice'){ctx.fillStyle=isCarbon?'#a855c7':color;ctx.fill();ctx.strokeStyle=isCarbon?'#fff':'rgba(34,45,61,.9)';ctx.lineWidth=1.6;ctx.stroke()}else{var inner=Math.max(.2,radius*.06),g=ctx.createRadialGradient(p.x-radius*.35,p.y-radius*.35,inner,p.x,p.y,radius);g.addColorStop(0,isCarbon?'#f7d3ff':'#fff5b8');g.addColorStop(.28,isCarbon?'#b55acb':color);g.addColorStop(1,isCarbon?'#532060':rgba(color,.72));ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=isCarbon?'rgba(255,255,255,.9)':'rgba(40,50,65,.65)';ctx.lineWidth=1;ctx.stroke()}ctx.restore()}
function siteGuide(atom,w,h,scale,filled,anchorX){var p=project(atom,w,h,1,anchorX),radius=(filled?19:13)*p.k*view.zoom*(scale||1);ctx.save();ctx.beginPath();ctx.arc(p.x,p.y,Math.max(6,radius),0,Math.PI*2);if(filled){ctx.fillStyle='rgba(181,90,203,.13)';ctx.fill()}ctx.setLineDash(filled?[2,3]:[4,3]);ctx.strokeStyle=filled?'rgba(255,255,255,.8)':'rgba(181,90,203,.7)';ctx.lineWidth=1.2;ctx.stroke();ctx.restore()}
function convexHull(points){var pts=points.map(function(p){return{x:p.x,y:p.y}}).sort(function(a,b){return a.x===b.x?a.y-b.y:a.x-b.x});if(pts.length<3)return pts;function cross(o,a,b){return(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x)}var lower=[],upper=[];pts.forEach(function(p){while(lower.length>=2&&cross(lower[lower.length-2],lower[lower.length-1],p)<=0)lower.pop();lower.push(p)});for(var i=pts.length-1;i>=0;i--){var p=pts[i];while(upper.length>=2&&cross(upper[upper.length-2],upper[upper.length-1],p)<=0)upper.pop();upper.push(p)}lower.pop();upper.pop();return lower.concat(upper)}
function clipCell(projected){var hull=convexHull(projected);ctx.beginPath();hull.forEach(function(p,i){if(i)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y)});ctx.closePath();ctx.clip()}
function arrowHead(from,to){var angle=Math.atan2(to.y-from.y,to.x-from.x),size=5;ctx.beginPath();ctx.moveTo(to.x,to.y);ctx.lineTo(to.x-size*Math.cos(angle-.55),to.y-size*Math.sin(angle-.55));ctx.lineTo(to.x-size*Math.cos(angle+.55),to.y-size*Math.sin(angle+.55));ctx.closePath();ctx.fill()}
function darkCanvas(){return document.documentElement.getAttribute('data-theme')==='dark'&&!view.printing}
function dimension(a,b,label,w,h,anchorX){var p1=project(a,w,h,1,anchorX),p2=project(b,w,h,1,anchorX),dx=p2.x-p1.x,dy=p2.y-p1.y,len=Math.sqrt(dx*dx+dy*dy)||1,ox=-dy/len*9,oy=dx/len*9,q1={x:p1.x+ox,y:p1.y+oy},q2={x:p2.x+ox,y:p2.y+oy},color=darkCanvas()?'#ff9aa2':'#a6192e',tx=(q1.x+q2.x)/2+ox*.45,ty=(q1.y+q2.y)/2+oy*.45;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(q1.x,q1.y);ctx.lineTo(q2.x,q2.y);ctx.stroke();arrowHead(q2,q1);arrowHead(q1,q2);ctx.font='italic 800 12px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle=darkCanvas()?'#08111f':'#fff';if(ctx.strokeText)ctx.strokeText(label,tx,ty);ctx.fillStyle=color;ctx.fillText(label,tx,ty)}
function themeValue(name,fallback){if(view.printing)return fallback;return getComputedStyle(document.getElementById('spx-tool')).getPropertyValue(name).trim()||fallback}
function callout(atom,label,dx,dy,w,h,anchorX){var p=project(atom,w,h,1,anchorX),left=dx<0,color=label.indexOf('C')===0?(darkCanvas()?'#eda9ff':'#6b21a8'):themeValue('--spx-text','#172033');ctx.font='bold 13px system-ui';var width=ctx.measureText?ctx.measureText(label).width:label.length*8,x=left?clamp(p.x+dx,width+7,w-18):clamp(p.x+dx,18,w-width-7),y=clamp(p.y+dy,14,h-14),textX=x+(left?-3:3);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(x,y);ctx.stroke();ctx.textAlign=left?'right':'left';ctx.lineWidth=3;ctx.strokeStyle=darkCanvas()?'#08111f':'#fff';if(ctx.strokeText)ctx.strokeText(label,textX,y+4);ctx.fillStyle=color;ctx.fillText(label,textX,y+4)}
function drawCell(name,anchorX,scale,w,h){
  var data=lattice(name),meta=PHASE_META[name],points=data.cell.map(function(p){return[p[0]*scale,p[1]*scale,p[2]*scale]}),projected=points.map(function(p){return project(p,w,h,1,anchorX)});
  function drawEdges(foreground){var dark=darkCanvas(),color=view.style==='space'?(foreground?(dark?'rgba(190,207,228,.9)':'rgba(55,71,91,.9)'):(dark?'rgba(160,180,205,.42)':'rgba(67,83,104,.42)')):view.style==='lattice'?(dark?'rgba(190,207,228,.96)':'rgba(55,71,91,.96)'):(dark?'rgba(190,207,228,.82)':'rgba(55,71,91,.84)');EDGES.forEach(function(edge){var a=projected[edge[0]],b=projected[edge[1]];ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=view.style==='lattice'?2.2:foreground?1.4:1.6;ctx.stroke()})}
  drawEdges(false);
  var ironAtoms=data.iron.map(function(p){return{p:[p[0]*scale,p[1]*scale,p[2]*scale],carbon:false}}),atoms=ironAtoms.slice();
  var shownCarbon=carbonToggle.checked?data.carbon.slice(0,markerCount(name,data.carbon.length)):[];
  shownCarbon.forEach(function(p){atoms.push({p:[p[0]*scale,p[1]*scale,p[2]*scale],carbon:true})});
  if(view.style==='space'){
    var packing=name==='Ferrite'?.56:name==='Martensite'?.5:name==='Cementite'?.42:.46;
    ctx.save();clipCell(projected);
    ironAtoms.sort(function(a,b){return rotate(a.p)[2]-rotate(b.p)[2]}).forEach(function(atom){sphere(atom.p,meta.color,w,h,scale,false,.97,packing,anchorX)});
    shownCarbon.forEach(function(p){var cp=[p[0]*scale,p[1]*scale,p[2]*scale];siteGuide(cp,w,h,scale,true,anchorX);sphere(cp,meta.color,w,h,scale,true,1,packing,anchorX)});
    ctx.restore();drawEdges(true)
  }else{
    if(view.style==='lattice')shownCarbon.forEach(function(p){siteGuide([p[0]*scale,p[1]*scale,p[2]*scale],w,h,scale,false,anchorX)});
    atoms.sort(function(a,b){return rotate(a.p)[2]-rotate(b.p)[2]}).forEach(function(atom){sphere(atom.p,meta.color,w,h,scale,atom.carbon,1,null,anchorX)})
  }
  var detailed=labelsToggle.checked&&(view.phases.length===1||(view.phases.length===2&&w>=620)||(view.phases.length===3&&w>=1100));
  if(detailed){var dims=name==='Martensite'?['a','a','c']:name==='Cementite'?['a','b','c']:['a','a','a'];dimension(points[0],points[1],dims[0],w,h,anchorX);dimension(points[0],points[2],dims[1],w,h,anchorX);dimension(points[0],points[4],dims[2],w,h,anchorX);callout(points[7],'Fe',18,-17,w,h,anchorX);if(shownCarbon.length){var carbonPoint=shownCarbon[0];callout([carbonPoint[0]*scale,carbonPoint[1]*scale,carbonPoint[2]*scale],'C atom',-20,20,w,h,anchorX)}}
  var compact=w<560||view.phases.length===3,shortStructure=name==='Austenite'?'FCC':name==='Ferrite'?'BCC':name==='Martensite'?'BCT':'Fe3C',maxY=Math.max.apply(null,projected.map(function(p){return p.y})),clearance=view.style==='space'?20:Math.max(24,Math.min(w,h)*.17*view.zoom*scale*.12+15),wantedY=maxY+clearance,labelY=clamp(wantedY,26,h-(compact?32:45)),halo=darkCanvas()?'#08111f':'#fff';
  ctx.font='800 '+Math.max(12,15*scale)+'px system-ui';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle=halo;if(ctx.strokeText)ctx.strokeText(name,anchorX,labelY);ctx.fillStyle=themeValue('--spx-text','#172033');ctx.fillText(name,anchorX,labelY);ctx.font='600 '+Math.max(10,12*scale)+'px system-ui';ctx.lineWidth=3;if(ctx.strokeText)ctx.strokeText(compact?shortStructure:meta.structure,anchorX,labelY+17);ctx.fillStyle=themeValue('--spx-muted','#667085');ctx.fillText(compact?shortStructure:meta.structure,anchorX,labelY+17)
}
function fullscreenElement(){return document.fullscreenElement||document.webkitFullscreenElement||null}
function fitCanvas(){var rect=canvas.getBoundingClientRect(),cssWidth=Math.max(1,Math.round(rect.width||canvas.clientWidth||760)),viewportWidth=window.innerWidth||cssWidth,minHeight=viewportWidth<=420?315:viewportWidth<=760?360:420,cssHeight=Math.max(minHeight,Math.round(Math.min(cssWidth*.82,620))),stageRect=canvas.parentElement.getBoundingClientRect(),full=fullscreenElement()===viewer,dpr=Math.min(2,window.devicePixelRatio||1);if(full&&stageRect.height)cssHeight=Math.max(260,Math.round(stageRect.height));var pixelWidth=Math.round(cssWidth*dpr),pixelHeight=Math.round(cssHeight*dpr);if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight}canvas.style.height=cssHeight+'px';canvas.dataset.logicalWidth=String(cssWidth);canvas.dataset.logicalHeight=String(cssHeight);ctx.setTransform(dpr,0,0,dpr,0,0);return{w:cssWidth,h:cssHeight}}
function drawAxes(w,count){var compact=w<420&&count>1,radius=compact?23:30,ox=w-radius-8,oy=radius+8,length=compact?16:22,dark=darkCanvas(),palette=dark?['#ff9aa2','#66e0ad','#8bbcff']:['#a6192e','#05603a','#174ea6'],axes=[{v:[1,0,0],label:'a',color:palette[0]},{v:[0,1,0],label:'b',color:palette[1]},{v:[0,0,1],label:'c',color:palette[2]}],labels=[];ctx.save();ctx.beginPath();ctx.arc(ox,oy,radius,0,Math.PI*2);ctx.fillStyle=dark?'rgba(8,17,31,.9)':'rgba(255,255,255,.94)';ctx.fill();ctx.strokeStyle=dark?'rgba(203,213,225,.55)':'rgba(82,97,115,.5)';ctx.lineWidth=1;ctx.stroke();axes.map(function(axis){var r=rotate(axis.v);return{r:r,label:axis.label,color:axis.color}}).sort(function(a,b){return a.r[2]-b.r[2]}).forEach(function(axis,index){var screenLength=Math.sqrt(axis.r[0]*axis.r[0]+axis.r[1]*axis.r[1]),end={x:ox+axis.r[0]*length,y:oy-axis.r[1]*length},label={x:end.x+axis.r[0]*5,y:end.y-axis.r[1]*5+3};labels.forEach(function(previous){if(Math.hypot(label.x-previous.x,label.y-previous.y)<9)label.y+=index%2?8:-8});labels.push(label);ctx.globalAlpha=clamp(screenLength/.35,.45,1);ctx.strokeStyle=axis.color;ctx.fillStyle=axis.color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(end.x,end.y);ctx.stroke();arrowHead({x:ox,y:oy},end);ctx.font='italic 900 '+(compact?9:11)+'px system-ui';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle=dark?'#08111f':'#fff';if(ctx.strokeText)ctx.strokeText(axis.label,label.x,label.y);ctx.fillStyle=axis.color;ctx.fillText(axis.label,label.x,label.y)});ctx.restore()}
function phaseAnchors(w,count){return count===1?[w/2]:count===2?[w*.28,w*.72]:[w*.18,w*.5,w*.82]}
function render(){
  var size=fitCanvas(),w=size.w,h=size.h;ctx.clearRect(0,0,w,h);canvas.dataset.displayStyle=view.style;var phases=view.phases.length?view.phases:['Austenite'],anchors=phaseAnchors(w,phases.length);
  if(phases.length===1)drawCell(phases[0],anchors[0],1.18,w,h);
  else if(phases.length===2){var twoScale=w<520?.68:.76;drawCell(phases[0],anchors[0],twoScale,w,h);drawCell(phases[1],anchors[1],twoScale,w,h)}
  else{var threeScale=w<520?.48:.57;drawCell(phases[0],anchors[0],threeScale,w,h);drawCell(phases[1],anchors[1],threeScale,w,h);drawCell(phases[2],anchors[2],threeScale,w,h)}
  drawAxes(w,phases.length)
}
function phaseList(){return view.phases.map(function(name){var value=view.fractions[name],amount=value==null?'':Math.round(value*1000)/10+' mass %',carbon=phaseCarbonInfo(name);return'<span><i class="'+PHASE_META[name].className+'"></i>'+name+(amount?' '+amount:'')+' · '+carbon.text+'</span>'}).join('')}
function temperatureText(t){return view.unit==='imperial'?Math.round(t*9/5+32)+' °F':Math.round(t)+' °C'}
function updateText(manual){
  var labels=view.phases.map(function(name){return PHASE_META[name].structure}).join(' + '),point=view.point,pointText=point?'P'+point.id+' · '+formatCarbon(point.c)+' wt% C · '+temperatureText(point.t):'',help='Drag to rotate; use +/− or Ctrl/⌘ + scroll to zoom.',extra=[];
  title.textContent=manual?view.phases[0]+' crystal structure':view.region||'Active equilibrium phases';
  subtitle.textContent=(manual?(view.phases[0]==='Martensite'?'Manual non-equilibrium reference · '+pointText:'Manual structure reference · '+pointText):(pointText||'Follow the active equilibrium point'))+' · '+help;
  if(manual&&view.equilibriumPhases.indexOf(view.phases[0])===-1&&view.phases[0]!=='Martensite')extra.push('The selected structure is outside this point’s equilibrium phase field; its carbon label is explicitly a reference.');
  if(view.phases.indexOf('Martensite')!==-1)extra.push('Empirical tetragonality: c/a ≈ '+martensiteRatio().toFixed(3)+' for the nominal carbon level.');
  if(view.phases.length>1&&Object.keys(view.fractions).length)extra.push('Cells are equally sized for comparison; use the mass percentages above for phase amount.');
  else if(view.regionKey==='eutectoid')extra.push('At the eutectoid invariant, phase amounts depend on reaction progress; this point does not define unique mass percentages.');
  summary.innerHTML='<strong>'+labels+'</strong><div class="spx-crystal-phase-list">'+phaseList()+'</div><span><strong>'+STYLE_META[view.style].label+' view:</strong> '+STYLE_META[view.style].note+'.</span><span>'+view.phases.map(function(name){return PHASE_META[name].note}).join(' ')+'</span>'+extra.map(function(text){return'<span>'+text+'</span>'}).join('');
  canvas.setAttribute('aria-label',(manual?'Manual ':'Active equilibrium ')+view.phases.join(' and ')+' crystal structure in '+STYLE_META[view.style].label+' view. Drag to rotate; use arrow keys to rotate and plus or minus to zoom.');
}
function announce(message){if(!live)return;live.textContent='';window.setTimeout(function(){live.textContent=message},20)}
function syncFromPoint(shouldAnnounce){
  var state=window.__SPX.getState(),pf=window.__SPX.phaseFractions(state.c,state.t),manual=mode.value!=='auto',equilibrium=Object.keys(pf.fractions||{}).filter(function(name){return PHASE_META[name]});if(!equilibrium.length&&pf.region.key==='eutectoid')equilibrium=['Ferrite','Austenite','Cementite'];view.point={id:state.activeId,c:state.c,t:state.t};view.unit=state.unit||'metric';view.region=pf.region.label;view.regionKey=pf.region.key;view.fractions=pf.fractions||{};view.tie=pf.tie||null;view.equilibriumPhases=equilibrium;view.phases=manual?[mode.value]:equilibrium;
  updateText(manual);render();if(shouldAnnounce)announce((manual?'Manual '+view.phases[0]:'Following '+view.region)+' crystal view selected.')
}
function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
function changeZoom(delta){var old=view.zoom;view.zoom=clamp(view.zoom+delta,.58,1.85);return view.zoom!==old}
function zoom(delta,shouldAnnounce){if(changeZoom(delta)){render();if(shouldAnnounce)announce('Crystal zoom '+Math.round(view.zoom*100)+' percent.');return true}return false}
function reset(shouldAnnounce){view.rotX=-.42;view.rotY=.68;view.zoom=1;render();if(shouldAnnounce)announce('Crystal view reset.')}
function fullscreenRequest(){return viewer.requestFullscreen?viewer.requestFullscreen():viewer.webkitRequestFullscreen?viewer.webkitRequestFullscreen():null}
function fullscreenExit(){return document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():null}
function toggleFullscreen(){var result;try{result=fullscreenElement()===viewer?fullscreenExit():fullscreenRequest();if(result&&typeof result.catch==='function')result.catch(function(){announce('Full screen could not be changed in this browser.')});else if(result==null&&!viewer.requestFullscreen&&!viewer.webkitRequestFullscreen)announce('Full screen is not supported in this browser.')}catch(ignore){announce('Full screen could not be changed in this browser.')}}
function syncFullscreen(){var active=fullscreenElement()===viewer;if(fullscreenButton){fullscreenButton.textContent=active?'Exit full screen':'Full screen';fullscreenButton.setAttribute('aria-pressed',String(active))}window.setTimeout(render,0);announce(active?'Full screen opened.':'Full screen closed.')}
function action(name){if(name==='zoom-in')zoom(.12,true);else if(name==='zoom-out')zoom(-.12,true);else if(name==='reset')reset(true);else if(name==='tilt-up'||name==='tilt-down'){view.rotX=clamp(view.rotX+(name==='tilt-up'?-.12:.12),-1.45,1.45);render();announce(name==='tilt-up'?'Crystal tilted upward.':'Crystal tilted downward.')}else if(name==='fullscreen')toggleFullscreen()}
canvas.addEventListener('pointerdown',function(e){if(e.isPrimary===false||(e.pointerType==='mouse'&&e.button!==0))return;view.drag=true;view.lastX=e.clientX;view.lastY=e.clientY;canvas.classList.add('is-dragging');try{canvas.focus({preventScroll:true})}catch(ignore){canvas.focus()}if(canvas.setPointerCapture)canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',function(e){if(!view.drag)return;view.rotY+=(e.clientX-view.lastX)*.009;view.rotX=clamp(view.rotX+(e.clientY-view.lastY)*.009,-1.45,1.45);view.lastX=e.clientX;view.lastY=e.clientY;render()});
function endDrag(e){view.drag=false;canvas.classList.remove('is-dragging');if(e.type!=='lostpointercapture'&&canvas.releasePointerCapture)try{canvas.releasePointerCapture(e.pointerId)}catch(ignore){}}
canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
canvas.addEventListener('wheel',function(e){if((!e.ctrlKey&&!e.metaKey)||!e.deltaY)return;if(zoom(e.deltaY<0?.1:-.1,false))e.preventDefault()},{passive:false});
canvas.addEventListener('keydown',function(e){var handled=true,changed=true;if(e.key==='ArrowLeft')view.rotY-=.12;else if(e.key==='ArrowRight')view.rotY+=.12;else if(e.key==='ArrowUp')view.rotX=clamp(view.rotX-.12,-1.45,1.45);else if(e.key==='ArrowDown')view.rotX=clamp(view.rotX+.12,-1.45,1.45);else if(e.key==='+'||e.key==='=')changed=changeZoom(.1);else if(e.key==='-'||e.key==='_')changed=changeZoom(-.1);else if(e.key==='Home'){view.rotX=-.42;view.rotY=.68;view.zoom=1}else handled=false;if(handled){e.preventDefault();if(changed)render()}});
viewer.addEventListener('click',function(e){var button=e.target.closest('[data-crystal-action]');if(button)action(button.dataset.crystalAction)});
mode.addEventListener('change',function(){syncFromPoint(true)});styleSelect.addEventListener('change',function(){view.style=STYLE_META[styleSelect.value]?styleSelect.value:'hybrid';updateText(mode.value!=='auto');render();announce(STYLE_META[view.style].label+' crystal view selected.')});carbonToggle.addEventListener('change',function(){render();announce('Carbon site markers '+(carbonToggle.checked?'shown.':'hidden.'))});labelsToggle.addEventListener('change',function(){render();announce('Atom and lattice labels '+(labelsToggle.checked?'shown.':'hidden.'))});document.addEventListener('spx:equilibrium-change',function(){syncFromPoint(false)});window.addEventListener('upskill:themechange',render);
function scheduleResize(){if(resizeFrame)return;resizeFrame=window.requestAnimationFrame(function(){resizeFrame=0;render()})}
window.addEventListener('resize',scheduleResize);if(window.ResizeObserver)new ResizeObserver(scheduleResize).observe(canvas.parentElement);
document.addEventListener('fullscreenchange',syncFullscreen);document.addEventListener('webkitfullscreenchange',syncFullscreen);
window.addEventListener('beforeprint',function(){view.printing=true;render()});window.addEventListener('afterprint',function(){view.printing=false;render()});
function canSpin(){return spinToggle.checked&&!reduceMotion&&view.visible&&!document.hidden}
function stopSpin(){if(spinFrame)window.cancelAnimationFrame(spinFrame);spinFrame=0}
function animate(){spinFrame=0;if(!canSpin())return;if(!view.drag){view.rotY+=.006;render()}spinFrame=window.requestAnimationFrame(animate)}
function startSpin(){if(canSpin()&&!spinFrame)spinFrame=window.requestAnimationFrame(animate)}
if(window.IntersectionObserver)new IntersectionObserver(function(entries){view.visible=entries[0].isIntersecting;if(view.visible)startSpin();else stopSpin()},{rootMargin:'120px'}).observe(canvas);
document.addEventListener('visibilitychange',function(){if(document.hidden)stopSpin();else startSpin()});
spinToggle.addEventListener('change',function(){if(spinToggle.checked)startSpin();else stopSpin();announce('Auto rotate '+(spinToggle.checked?'started.':'stopped.'))});
function applyMotionPreference(matches){reduceMotion=!!matches;if(reduceMotion){spinToggle.checked=false;spinToggle.disabled=true;stopSpin()}else spinToggle.disabled=false;if(motionNote)motionNote.hidden=!reduceMotion;spinToggle.closest('label').title=reduceMotion?'Auto rotation is disabled by your reduced-motion preference':''}
if(motionQuery){var motionChange=function(e){applyMotionPreference(e.matches)};if(motionQuery.addEventListener)motionQuery.addEventListener('change',motionChange);else if(motionQuery.addListener)motionQuery.addListener(motionChange)}
applyMotionPreference(reduceMotion);
if(fullscreenButton){fullscreenButton.setAttribute('aria-pressed','false');if(!viewer.requestFullscreen&&!viewer.webkitRequestFullscreen){fullscreenButton.disabled=true;fullscreenButton.title='Full screen is not supported in this browser'}}
syncFromPoint(false);
window.__SPX.crystal3d={version:'1.4.0',sync:syncFromPoint,reset:reset,getState:function(){var counts={},compositions={},width=Number(canvas.dataset.logicalWidth)||0;view.phases.forEach(function(name){counts[name]=markerCount(name,lattice(name).carbon.length);compositions[name]=phaseCarbon(name)});return{mode:mode.value,style:view.style,phases:view.phases.slice(),equilibriumPhases:view.equilibriumPhases.slice(),carbonMarkers:counts,carbonVisible:carbonToggle.checked,labelsVisible:labelsToggle.checked,phaseCarbon:compositions,region:view.region,regionKey:view.regionKey,unit:view.unit,martensiteCA:martensiteRatio(),zoom:view.zoom,rotX:view.rotX,rotY:view.rotY,point:view.point&&Object.assign({},view.point),canvas:{width:width,height:Number(canvas.dataset.logicalHeight)||0},anchors:phaseAnchors(width,view.phases.length)}}};
})();
