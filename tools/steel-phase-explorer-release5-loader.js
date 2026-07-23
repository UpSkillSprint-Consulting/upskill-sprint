(function(){
'use strict';
var attempts=0;
function addCss(href){if(document.querySelector('link[href="'+href+'"]'))return;var l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)}
function addScript(src){if(document.querySelector('script[src="'+src+'"]'))return;var s=document.createElement('script');s.src=src;s.async=false;document.body.appendChild(s)}
function start(){
  var tool=document.getElementById('spx-tool'),tabs=tool&&tool.querySelector('.spx-tabs'),nav=document.getElementById('spx-tab-navigator');
  if(!tool||!tabs||!nav||!document.getElementById('spx-tab-metallurgy-lab')){if(attempts++<220)setTimeout(start,50);return}
  if(document.getElementById('spx-tab-reference-diagrams'))return;
  addCss('/tools/steel-phase-explorer-release5.css');
  var before=tabs.querySelector('[data-tab="learn"]'),button=document.createElement('button');
  button.type='button';button.setAttribute('role','tab');button.setAttribute('aria-selected','false');button.setAttribute('aria-controls','spx-tab-reference-diagrams');button.dataset.tab='reference-diagrams';button.textContent='Interactive diagrams';tabs.insertBefore(button,before||null);
  var q=document.getElementById('spx-question-grid');
  if(q)q.insertAdjacentHTML('beforeend',
    '<button type="button" class="spx-question-card" data-release5-route="rapid"><strong>What microconstituent region does rapid quenching enter?</strong><span>Use the color-coded carbon–temperature map for pearlite, bainite, martensite, and retained-austenite regions.</span></button>'+ 
    '<button type="button" class="spx-question-card" data-release5-route="full"><strong>Where is this composition on the full iron–carbon diagram?</strong><span>Explore the complete Fe–Fe₃C range from iron to cementite, including liquid, δ-ferrite, austenite, ferrite, and two-phase fields.</span></button>');
  var eyebrow=nav.querySelector('.spx-eyebrow');if(eyebrow)eyebrow.textContent='Releases 1–5 · Complete guided steel-metallurgy platform';
  var shell=document.createElement('div');shell.innerHTML=`
<section id="spx-tab-reference-diagrams" class="spx-panel" role="tabpanel" data-panel="reference-diagrams" hidden>
  <div class="spx-r5-hero spx-card spx-card-pad">
    <p class="spx-eyebrow">Release 5 · Interactive reference diagrams</p>
    <div class="spx-card-title"><div><h2>High-resolution transformation and iron–carbon maps</h2><p>Original vector redraws preserve the reference color logic while adding live coordinates, region explanations, multiple points, critical-line controls, and PNG export.</p></div><span class="spx-r3-badge">Two interactive maps</span></div>
    <div class="spx-note"><strong>Reference and scope:</strong> the maps are original educational redraws informed by the supplied rapid-quench figure and iron–carbon/cementite poster. Curves and region boundaries are simplified and must not replace controlled thermodynamic, TTT, CCT, or grade-specific data.</div>
  </div>
  <nav class="spx-r5-subnav" id="spx-r5-subnav" aria-label="Interactive reference diagrams">
    <button type="button" data-r5-map="rapid" aria-pressed="true">Rapid-quench microconstituents</button>
    <button type="button" data-r5-map="full" aria-pressed="false">Full Fe–Fe₃C diagram</button>
  </nav>
  <div class="spx-r5-layout">
    <section class="spx-card spx-r5-main-card">
      <div class="spx-card-pad">
        <div class="spx-card-title"><div><h2 id="spx-r5-title">Rapid-quench microconstituent map</h2><p id="spx-r5-subtitle">Move across carbon and temperature to compare pearlite, bainite, martensite, and retained-austenite regions.</p></div><div class="spx-toolbar"><button class="spx-btn primary" id="spx-r5-export" type="button">Export PNG</button><button class="spx-btn" id="spx-r5-example" type="button">Load examples</button></div></div>
        <div class="spx-r5-controls">
          <div class="spx-release-control"><span class="spx-control-label">Temperature units</span><div class="spx-segmented" id="spx-r5-unit" role="group" aria-label="Temperature units"><button type="button" data-r5-unit="metric" aria-pressed="true">Metric (°C)</button><button type="button" data-r5-unit="imperial" aria-pressed="false">Imperial (°F)</button></div></div>
          <div class="spx-checks spx-r5-checks"><label><input id="spx-r5-critical" type="checkbox" checked> Critical lines</label><label><input id="spx-r5-labels" type="checkbox" checked> Region labels</label><label><input id="spx-r5-crosshair-toggle" type="checkbox" checked> Crosshair</label><label><input id="spx-r5-legend-toggle" type="checkbox" checked> Legend</label><label id="spx-r5-graphite-label"><input id="spx-r5-graphite" type="checkbox" checked> Stable graphite overlay</label></div>
        </div>
        <div class="spx-r5-points-head"><div><h3>Comparison points</h3><p>Points are shared between the two new diagrams. Points above 1.2 wt% C are hidden on the rapid-quench map but retained for the full diagram.</p></div><div class="spx-toolbar"><button class="spx-btn primary" id="spx-r5-add" type="button">+ Add point</button><button class="spx-btn" id="spx-r5-remove" type="button">Remove active</button></div></div>
        <div id="spx-r5-points-list" class="spx-r5-points" aria-live="polite"></div>
      </div>
      <div class="spx-r5-svg-wrap" id="spx-r5-svg-wrap">
        <svg id="spx-r5-svg" viewBox="0 0 920 650" role="img" aria-label="Interactive steel metallurgy reference diagram" tabindex="0">
          <defs><filter id="spx-r5-shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity=".28"/></filter></defs>
          <g id="spx-r5-regions"></g><g id="spx-r5-grid"></g><g id="spx-r5-boundaries"></g><g id="spx-r5-label-layer"></g><g id="spx-r5-overlay"></g><g id="spx-r5-point-layer"></g>
        </svg>
        <div class="spx-tooltip spx-r5-tooltip" id="spx-r5-tooltip" hidden></div>
      </div>
      <div class="spx-card-pad spx-r5-status" id="spx-r5-status" aria-live="polite">Move the pointer over the diagram or tap to inspect a region.</div>
    </section>
    <aside class="spx-r5-side">
      <section class="spx-card spx-card-pad" id="spx-r5-legend-card"><div class="spx-card-title"><div><h2>Legend</h2><p>Colors and critical boundaries for the active map.</p></div></div><div id="spx-r5-legend" class="spx-r5-legend"></div></section>
      <section class="spx-card spx-card-pad"><div class="spx-card-title"><div><h2>Selected point analysis</h2><p id="spx-r5-active-summary">—</p></div></div><div id="spx-r5-analysis"></div></section>
      <section class="spx-card spx-card-pad"><div class="spx-card-title"><div><h2>What does this region mean?</h2><p>Select a point, hover, or tap a region.</p></div></div><div id="spx-r5-help"></div></section>
      <section class="spx-card spx-card-pad spx-advanced-only"><h2>Model construction</h2><div id="spx-r5-model-note" class="spx-formula"></div></section>
    </aside>
  </div>
</section>`;
  var learn=document.getElementById('spx-tab-learn');learn.parentNode.insertBefore(shell.firstElementChild,learn);
  addScript('/tools/steel-phase-explorer-release5.js');
}
start();
})();
