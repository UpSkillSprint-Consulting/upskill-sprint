(function(){
'use strict';
var canvas=document.getElementById('spx-crystal-canvas');
if(!canvas||!window.__SPX)return;
var ctx=canvas.getContext('2d'),mode=document.getElementById('spx-crystal-mode'),summary=document.getElementById('spx-crystal-summary'),title=document.getElementById('spx-crystal-title'),subtitle=document.getElementById('spx-crystal-subtitle'),carbonToggle=document.getElementById('spx-crystal-carbon'),spinToggle=document.getElementById('spx-crystal-spin');
var view={rotX:-.42,rotY:.68,zoom:1,drag:false,lastX:0,lastY:0,phases:[],fractions:{},tie:null,region:'',point:null,visible:true};
var reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,spinFrame=0;
var PHASE_META={
  Austenite:{structure:'Face-centred cubic (FCC)',color:'#f3c53f',className:'austenite',note:'FCC iron lattice with comparatively large interstitial sites for dissolved carbon.'},
  Ferrite:{structure:'Body-centred cubic (BCC)',color:'#4fb685',className:'ferrite',note:'BCC iron lattice. Carbon solubility is very limited at equilibrium.'},
  Cementite:{structure:'Orthorhombic Fe₃C',color:'#8b6bd1',className:'cementite',note:'Simplified 3:1 iron-to-carbon schematic of the complex orthorhombic cementite cell.'},
  Martensite:{structure:'Body-centred tetragonal (BCT)',color:'#65a9e8',className:'martensite',note:'Supersaturated carbon stretches the BCC-derived lattice along the c-axis. Martensite is not an equilibrium phase.'}
};
var EDGES=[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];
function corners(zScale){var z=zScale||1;return[[-1,-1,-z],[1,-1,-z],[-1,1,-z],[1,1,-z],[-1,-1,z],[1,-1,z],[-1,1,z],[1,1,z]]}
function lattice(name){
  var cell=corners(name==='Martensite'?1.32:name==='Cementite'?1.18:1),iron=cell.slice(),carbon=[];
  if(name==='Austenite'){iron=iron.concat([[0,0,-1],[0,0,1],[0,-1,0],[0,1,0],[-1,0,0],[1,0,0]]);carbon=[[0,0,0],[.48,0,0],[-.48,0,0],[0,.48,0],[0,-.48,0],[0,0,.48],[0,0,-.48],[.38,.38,.38],[-.38,-.38,-.38],[.38,-.38,-.38]]}
  else if(name==='Ferrite'){iron.push([0,0,0]);carbon=[[.5,0,0],[-.5,0,0],[0,.5,0],[0,-.5,0],[0,0,.5],[0,0,-.5]]}
  else if(name==='Martensite'){iron.push([0,0,0]);carbon=[[0,0,.64],[0,0,-.64],[.5,0,.32],[-.5,0,-.32],[0,.5,.32],[0,-.5,-.32],[.42,.42,0],[-.42,-.42,0],[.42,-.42,0],[-.42,.42,0]]}
  else if(name==='Cementite'){
    iron=[[-1,-1,-1.18],[1,-1,-1.18],[-1,1,-1.18],[1,1,-1.18],[-1,-1,1.18],[1,-1,1.18],[-1,1,1.18],[1,1,1.18],[-.45,0,-.28],[.45,0,.28],[0,-.45,.62],[0,.45,-.62]];
    carbon=[[0,0,-.78],[0,0,.78],[-.58,.58,0],[.58,-.58,0]];
  }
  return{cell:cell,iron:iron,carbon:carbon}
}
function phaseCarbon(name){
  if(name==='Cementite')return 6.67;
  if(name==='Martensite')return view.point?view.point.c:0;
  if(view.tie){
    if(name==='Ferrite'&&view.tie.leftName==='α')return view.tie.left;
    if(name==='Austenite')return view.tie.leftName==='γ'?view.tie.left:view.tie.rightName==='γ'?view.tie.right:(view.point?view.point.c:0)
  }
  return view.point?view.point.c:0
}
function markerCount(name,available){if(name==='Cementite')return available;var carbon=phaseCarbon(name);if(carbon<=0)return 0;return clamp(Math.round(carbon/1.2*available),1,available)}
function rotate(p){var x=p[0],y=p[1],z=p[2],cy=Math.cos(view.rotY),sy=Math.sin(view.rotY),cx=Math.cos(view.rotX),sx=Math.sin(view.rotX),x1=x*cy+z*sy,z1=-x*sy+z*cy,y1=y*cx-z1*sx,z2=y*sx+z1*cx;return[x1,y1,z2]}
function project(p,w,h,scale){var r=rotate(p),depth=5.6-r[2],perspective=4.7/depth,s=Math.min(w,h)*.17*view.zoom*(scale||1);return{x:w/2+r[0]*s*perspective,y:h/2-r[1]*s*perspective,z:r[2],k:perspective}}
function rgba(hex,alpha){var value=parseInt(hex.slice(1),16);return'rgba('+((value>>16)&255)+','+((value>>8)&255)+','+(value&255)+','+alpha+')'}
function sphere(atom,color,w,h,scale,isCarbon){var p=project(atom,w,h,scale),radius=(isCarbon?7.5:12)*p.k*view.zoom*(scale||1),g=ctx.createRadialGradient(p.x-radius*.35,p.y-radius*.35,1,p.x,p.y,radius);g.addColorStop(0,isCarbon?'#f7d3ff':'#fff5b8');g.addColorStop(.28,isCarbon?'#b55acb':color);g.addColorStop(1,isCarbon?'#532060':rgba(color,.72));ctx.beginPath();ctx.arc(p.x,p.y,Math.max(3,radius),0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=isCarbon?'rgba(255,255,255,.75)':'rgba(40,50,65,.65)';ctx.lineWidth=1;ctx.stroke()}
function drawCell(name,offset,scale,w,h){
  var data=lattice(name),meta=PHASE_META[name],points=data.cell.map(function(p){return[p[0]*scale+offset,p[1]*scale,p[2]*scale]}),projected=points.map(function(p){return project(p,w,h,1)});
  EDGES.forEach(function(edge){var a=projected[edge[0]],b=projected[edge[1]];ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='rgba(111,130,155,.72)';ctx.lineWidth=1.5;ctx.stroke()});
  var atoms=data.iron.map(function(p){return{p:[p[0]*scale+offset,p[1]*scale,p[2]*scale],carbon:false}});
  if(carbonToggle.checked)data.carbon.slice(0,markerCount(name,data.carbon.length)).forEach(function(p){atoms.push({p:[p[0]*scale+offset,p[1]*scale,p[2]*scale],carbon:true})});
  atoms.sort(function(a,b){return rotate(a.p)[2]-rotate(b.p)[2]}).forEach(function(atom){sphere(atom.p,meta.color,w,h,1,atom.carbon)});
  var label=project([offset,-1.58*scale,0],w,h,1);ctx.fillStyle=getComputedStyle(document.getElementById('spx-tool')).getPropertyValue('--spx-text')||'#172033';ctx.font='800 '+Math.max(12,15*scale)+'px system-ui';ctx.textAlign='center';ctx.fillText(name,label.x,label.y+18);ctx.font='600 '+Math.max(10,12*scale)+'px system-ui';ctx.fillStyle=getComputedStyle(document.getElementById('spx-tool')).getPropertyValue('--spx-muted')||'#667085';ctx.fillText(meta.structure,label.x,label.y+36)
}
function fitCanvas(){var rect=canvas.getBoundingClientRect(),cssWidth=Math.max(320,Math.round(rect.width||canvas.clientWidth||760)),cssHeight=Math.max(315,Math.round(Math.min(cssWidth*.82,620))),dpr=Math.min(2,window.devicePixelRatio||1);if(canvas.width!==Math.round(cssWidth*dpr)||canvas.height!==Math.round(cssHeight*dpr)){canvas.width=Math.round(cssWidth*dpr);canvas.height=Math.round(cssHeight*dpr);canvas.style.height=cssHeight+'px'}ctx.setTransform(dpr,0,0,dpr,0,0);return{w:cssWidth,h:cssHeight}}
function render(){
  var size=fitCanvas(),w=size.w,h=size.h;ctx.clearRect(0,0,w,h);var phases=view.phases.length?view.phases:['Austenite'];
  if(phases.length===1)drawCell(phases[0],0,1.18,w,h);
  else if(phases.length===2){drawCell(phases[0],-1.5,.76,w,h);drawCell(phases[1],1.5,.76,w,h)}
  else{drawCell(phases[0],-2.25,.57,w,h);drawCell(phases[1],0,.57,w,h);drawCell(phases[2],2.25,.57,w,h)}
}
function phaseList(){return view.phases.map(function(name){var value=view.fractions[name],amount=value==null?'':Math.round(value*1000)/10+'%',carbon=phaseCarbon(name),carbonText=name==='Cementite'?'6.67 wt% C':'≈ '+Math.round(carbon*1000)/1000+' wt% C';return'<span><i class="'+PHASE_META[name].className+'"></i>'+name+(amount?' '+amount:'')+' · '+carbonText+'</span>'}).join('')}
function updateText(manual){
  var labels=view.phases.map(function(name){return PHASE_META[name].structure}).join(' + '),point=view.point,pointText=point?'P'+point.id+' · '+Math.round(point.c*1000)/1000+' wt% C · '+Math.round(point.t)+' °C':'';
  title.textContent=manual?view.phases[0]+' crystal structure':view.region||'Active equilibrium phases';
  subtitle.textContent=manual?(view.phases[0]==='Martensite'?'Manual non-equilibrium reference':'Manual structure reference'):(pointText||'Follow the active equilibrium point');
  summary.innerHTML='<strong>'+labels+'</strong><div class="spx-crystal-phase-list">'+phaseList()+'</div><span>'+view.phases.map(function(name){return PHASE_META[name].note}).join(' ')+'</span>';
  canvas.setAttribute('aria-label',(manual?'Manual ':'Active equilibrium ')+view.phases.join(' and ')+' crystal structure. Drag to rotate; use arrow keys to rotate and plus or minus to zoom.');
}
function syncFromPoint(){
  var state=window.__SPX.getState(),pf=window.__SPX.phaseFractions(state.c,state.t),manual=mode.value!=='auto';view.point={id:state.activeId,c:state.c,t:state.t};view.region=pf.region.label;view.fractions=pf.fractions||{};view.tie=pf.tie||null;
  if(manual)view.phases=[mode.value];else{view.phases=Object.keys(view.fractions).filter(function(name){return PHASE_META[name]});if(!view.phases.length&&pf.region.key==='eutectoid')view.phases=['Ferrite','Austenite','Cementite']}
  updateText(manual);render()
}
function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
function zoom(delta){view.zoom=clamp(view.zoom+delta,.58,1.85);render()}
function reset(){view.rotX=-.42;view.rotY=.68;view.zoom=1;render()}
function action(name){if(name==='zoom-in')zoom(.12);else if(name==='zoom-out')zoom(-.12);else if(name==='reset')reset();else if(name==='fullscreen'){var stage=canvas.closest('.spx-crystal-card');if(stage&&stage.requestFullscreen)stage.requestFullscreen()}}
canvas.addEventListener('pointerdown',function(e){view.drag=true;view.lastX=e.clientX;view.lastY=e.clientY;canvas.classList.add('is-dragging');if(canvas.setPointerCapture)canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',function(e){if(!view.drag)return;view.rotY+=(e.clientX-view.lastX)*.009;view.rotX=clamp(view.rotX+(e.clientY-view.lastY)*.009,-1.45,1.45);view.lastX=e.clientX;view.lastY=e.clientY;render()});
function endDrag(e){view.drag=false;canvas.classList.remove('is-dragging');if(canvas.releasePointerCapture)try{canvas.releasePointerCapture(e.pointerId)}catch(ignore){}}
canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
canvas.addEventListener('wheel',function(e){e.preventDefault();zoom(e.deltaY<0?.1:-.1)},{passive:false});
canvas.addEventListener('keydown',function(e){var handled=true;if(e.key==='ArrowLeft')view.rotY-=.12;else if(e.key==='ArrowRight')view.rotY+=.12;else if(e.key==='ArrowUp')view.rotX=clamp(view.rotX-.12,-1.45,1.45);else if(e.key==='ArrowDown')view.rotX=clamp(view.rotX+.12,-1.45,1.45);else if(e.key==='+'||e.key==='=')zoom(.1);else if(e.key==='-'||e.key==='_')zoom(-.1);else if(e.key==='Home')reset();else handled=false;if(handled){e.preventDefault();render()}});
document.getElementById('spx-crystal-viewer').addEventListener('click',function(e){var button=e.target.closest('[data-crystal-action]');if(button)action(button.dataset.crystalAction)});
mode.addEventListener('change',syncFromPoint);carbonToggle.addEventListener('change',render);document.addEventListener('spx:equilibrium-change',syncFromPoint);window.addEventListener('upskill:themechange',render);window.addEventListener('resize',render);
if(window.IntersectionObserver)new IntersectionObserver(function(entries){view.visible=entries[0].isIntersecting},{rootMargin:'120px'}).observe(canvas);
function animate(){if(!spinToggle.checked||reduceMotion){spinFrame=0;return}if(view.visible&&!view.drag){view.rotY+=.006;render()}spinFrame=window.requestAnimationFrame(animate)}
spinToggle.addEventListener('change',function(){if(spinToggle.checked&&!reduceMotion&&!spinFrame)spinFrame=window.requestAnimationFrame(animate)});
if(reduceMotion){spinToggle.checked=false;spinToggle.disabled=true;spinToggle.closest('label').title='Auto rotation is disabled by your reduced-motion preference'}
syncFromPoint();
window.__SPX.crystal3d={version:'1.1.0',sync:syncFromPoint,reset:reset,getState:function(){var counts={};view.phases.forEach(function(name){counts[name]=markerCount(name,lattice(name).carbon.length)});return{mode:mode.value,phases:view.phases.slice(),carbonMarkers:counts,region:view.region,zoom:view.zoom,rotX:view.rotX,rotY:view.rotY,point:view.point&&Object.assign({},view.point)}}};
})();
