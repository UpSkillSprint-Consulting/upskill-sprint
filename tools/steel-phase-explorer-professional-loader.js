(function(){
'use strict';
var attempts=0;
function fail(){
  if(document.getElementById('spx-professional-load-status'))return;
  var tool=document.getElementById('spx-tool'),tabs=tool&&tool.querySelector('.spx-tabs');if(!tool||!tabs)return;
  var note=document.createElement('div');note.id='spx-professional-load-status';note.className='spx-scenario-warning';note.setAttribute('role','alert');note.textContent='The Professional decision workspace could not be loaded. All original metallurgy modules remain available; reload the page before recording professional notes.';tabs.parentNode.insertBefore(note,tabs)
}
function verify(){setTimeout(function(){if(!window.__SPX||!window.__SPX.professional)fail()},1000)}
function start(){
  var tool=document.getElementById('spx-tool');
  if(!tool||!window.__SPX||!window.__SPX.release1||!window.__SPX.release2||!window.__SPX.release3||!window.__SPX.release4||!window.__SPX.release5){if(attempts++<160)setTimeout(start,50);else fail();return}
  if(!document.querySelector('link[href="/tools/steel-phase-explorer-professional.css"]')){var css=document.createElement('link');css.rel='stylesheet';css.href='/tools/steel-phase-explorer-professional.css';css.onerror=fail;document.head.appendChild(css)}
  var existing=document.querySelector('script[src="/tools/steel-phase-explorer-professional.js"]');if(existing){if(!window.__SPX.professional){existing.addEventListener('load',verify,{once:true});existing.addEventListener('error',fail,{once:true});verify()}return}
  var js=document.createElement('script');js.src='/tools/steel-phase-explorer-professional.js';js.async=false;js.onload=verify;js.onerror=fail;document.body.appendChild(js)
}
start();
})();
