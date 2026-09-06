"""One-time presentation migration. Fails closed if the reviewed source changes."""
from pathlib import Path
import re, hashlib, json
P=Path('lessons/lean-six-sigma/signal-or-noise-arl-nelson-rules-control-limit-design.html')
s=P.read_text()
assert hashlib.sha1(b'blob '+str(len(s.encode())).encode()+b'\0'+s.encode()).hexdigest()=='25179b4cfd2fa987038294d6fd96109cf49fe0af', 'Unexpected lesson baseline'
s=s.replace('--arl-', '--lesson-arl-')
s=s.replace('Control Limit Design | UpSkill Sprint Consulting</title>', 'Control Limit Design</title>')
s=s.replace('content="width=device-width, initial-scale=1.0"', 'content="width=device-width, initial-scale=1"')
s=re.sub(r'"search_keywords": (\[[^\n]+\])', lambda m:'"search_keywords": '+json.dumps([k.lower() for k in json.loads(m[1])],ensure_ascii=False),s)
s=s.replace('<style>','<style id="signal-noise-style">',1)
s=s.replace('<link href="https://fonts.googleapis.com/css2?family=Barlow', '<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&amp;family=Work+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">\n<link href="https://fonts.googleapis.com/css2?family=Barlow',1)
a=s.index('<style id="signal-noise-style">')+len('<style id="signal-noise-style">'); b=s.index('</style>',a)
css=s[a:b]
def scope(m):
    lead=m[1]
    comments=''.join(re.findall(r'/\*[\s\S]*?\*/',lead))
    sel=re.sub(r'/\*[\s\S]*?\*/','',lead).strip()
    if sel.startswith('@'): return '\n'+comments+'\n'+sel+'{'
    out=[]
    for x in sel.split(','):
        x=x.strip()
        if x in (':root','html','body'): x='#lesson-content'
        elif x=='html[data-theme="dark"]': x+=' #lesson-content'
        else: x='#lesson-content '+x
        if x not in out:out.append(x)
    return '\n'+comments+'\n'+', '.join(out)+'{'
css=re.sub(r'([^{}]+)\{',scope,css)
dark=re.search(r'html\[data-theme="dark"\] #lesson-content\{[^{}]*\}',css).group()
css=css.replace(dark,'')
css+='''
/* Integration and responsive finishing; all selectors stay inside the lesson. */
#lesson-content { --lesson-arl-site-header-height:80px; --lesson-arl-toc-height:76px; min-width:0; }
#lesson-content .shell { width:100%; padding:0 24px 56px; }
#lesson-content header.hero { padding:44px 0 28px; }
#lesson-content header.hero .shell { padding-bottom:0; }
#lesson-content .part { padding:40px 0 24px; scroll-margin-top:calc(var(--lesson-arl-site-header-height) + var(--lesson-arl-toc-height) + 20px); }
#lesson-content .progress-rail { top:var(--lesson-arl-site-header-height); z-index:19; color:var(--lesson-arl-ink); }
#lesson-content .progress-fill { color:var(--lesson-arl-bg); }
#lesson-content nav.toc { top:calc(var(--lesson-arl-site-header-height) + 3px); z-index:18; background:#071120; color:var(--lesson-arl-console-ink); padding:10px 20px; }
#lesson-content nav.toc .shell-inner { min-width:max-content; }
#lesson-content nav.toc button { min-height:44px; flex-shrink:0; }
#lesson-content nav.toc button:focus-visible { outline-color:var(--lesson-arl-console-cyan); outline-offset:-3px; }
#lesson-content nav.toc button.active:focus-visible { outline-color:#071120; }
#lesson-content .hero-strip, #lesson-content .syllabus-grid, #lesson-content .takeaways { color:var(--lesson-arl-ink); }
#lesson-content .hero-strip > div, #lesson-content .syllabus-item, #lesson-content .card, #lesson-content .callout, #lesson-content .test-card, #lesson-content .takeaway, #lesson-content .quiz-item { color:var(--lesson-arl-ink); min-width:0; }
#lesson-content .card:hover { transform:none; box-shadow:none; }
#lesson-content .test-body { grid-template-columns:minmax(0,1fr) 200px; }
#lesson-content .test-body > *, #lesson-content .syllabus-item > *, #lesson-content .takeaway > * { min-width:0; }
#lesson-content .test-title { min-width:180px; }
#lesson-content .math { white-space:pre-wrap; overflow-wrap:anywhere; }
#lesson-content .math:focus-visible, #lesson-content .chart-scroll:focus-visible { outline:2px solid var(--lesson-arl-console-cyan); outline-offset:-3px; }
#lesson-content .chart-scroll { max-width:100%; overflow-x:auto; background:#081527; color:var(--lesson-arl-console-ink); border-radius:4px; }
#lesson-content .chart-scroll canvas { min-width:800px; max-width:none; }
#lesson-content .sparkline-wrap, #lesson-content .zone-diagram, #lesson-content .sim-wrap { color:var(--lesson-arl-console-ink); }
#lesson-content .sparkline-wrap { align-self:start; }
#lesson-content .table-scroll { max-width:100%; overflow-x:auto; }
#lesson-content .table-scroll:focus-visible { outline:2px solid var(--lesson-arl-cyan); outline-offset:2px; }
#lesson-content table { min-width:560px; }
#lesson-content tr:hover td { color:var(--lesson-arl-ink); }
#lesson-content .ctrl-row label { min-width:0; }
#lesson-content input[type=range] { min-width:100px; height:8px; background:#63778b; color:var(--lesson-arl-ink); }
#lesson-content input[type=range]::-webkit-slider-thumb { width:24px; height:24px; }
#lesson-content input[type=range]::-moz-range-thumb { width:24px; height:24px; }
#lesson-content input[type=range]:focus-visible { outline:2px solid var(--lesson-arl-cyan); outline-offset:5px; }
#lesson-content select { min-height:44px; max-width:100%; background:var(--lesson-arl-panel); color:var(--lesson-arl-ink); border:1px solid #63778b; border-radius:4px; padding:8px; }
#lesson-content .btn, #lesson-content .derive-toggle { min-height:44px; white-space:normal; overflow-wrap:anywhere; border:1px solid var(--lesson-arl-cyan); }
#lesson-content button.btn:not(.ghost) { background:#0e7c86; color:#ffffff; }
#lesson-content button.btn:not(.ghost):hover { background:#095b63; color:#ffffff; }
#lesson-content button.btn.ghost:hover, #lesson-content .derive-toggle:hover { background:var(--lesson-arl-cyan-dim); color:var(--lesson-arl-ink); }
#lesson-content button.btn.ghost, #lesson-content .derive-toggle { border-color:var(--lesson-arl-cyan); }
#lesson-content code { overflow-wrap:anywhere; word-break:break-word; white-space:normal; }
#lesson-content .nav-btns { flex-wrap:wrap; gap:12px; }
#lesson-content .quiz-q { min-height:44px; }
#lesson-content .quiz-q:focus-visible { outline-offset:-3px; }
#lesson-content .quiz-a { overflow-wrap:anywhere; }
@media(max-width:640px) {
 #lesson-content .shell { padding-left:16px; padding-right:16px; }
 #lesson-content .card, #lesson-content .test-card { padding:18px 14px; }
 #lesson-content .test-body { grid-template-columns:minmax(0,1fr); }
 #lesson-content .sparkline-wrap { width:min(100%,280px); }
 #lesson-content .ctrl-row { gap:12px; }
 #lesson-content .ctrl-row label { flex-basis:100%; }
 #lesson-content .nav-btns .btn { flex:1 1 140px; }
 #lesson-content .math { padding:14px 12px; font-size:13px; }
}
'''
s=s[:a]+css+s[b:]
labels={
'arlCanvas':'Normal distributions, control limits and detection power',
'runCanvas':'Paired live control chart on the same random data',
'zoneCanvas':'Control chart zones A, B and C on both sides of the mean',
'simCanvas':'Simulated in-control points with two-sigma and three-sigma limits',
'cusumShewhartCanvas':'Shewhart chart for the matched comparison',
'cusumCanvas':'CUSUM chart for the matched comparison'}
for ident,label in labels.items():
    pat=r'<canvas id="'+ident+r'"[^>]*></canvas>'
    original=re.search(pat,s).group()
    canvas=original.replace('<canvas ',f'<canvas role="img" aria-label="{label}" ',1)
    s=s.replace(original,f'<div class="chart-scroll" tabindex="0" role="region" aria-label="{label}; scroll horizontally">'+canvas+'</div>')
s=s.replace('<div style="overflow-x:auto"><table>', '<div class="table-scroll" style="overflow-x:auto" tabindex="0" role="region" aria-label="Lesson reference table; scroll horizontally"><table>')
s=s.replace('border:1px solid var(--lesson-arl-console-line);border-radius:3px;padding:6px 10px;', 'border:1px solid #607897;border-radius:3px;padding:6px 10px;')
s=s.replace('<section aria-label="Return to lesson category"', '<section id="signal-noise-return" aria-label="Return to lesson category"')
s=s.replace('<nav class="toc">','<nav class="toc" aria-label="Lesson sections">')
s=s.replace('id="nPoints" min="50" max="1000" step="50" value="370"','id="nPoints" min="50" max="1000" step="10" value="370"')
s=s.replace('id="cusumShiftSlider" min="0" max="3" step="0.1" value="0.75"','id="cusumShiftSlider" min="0" max="3" step="0.05" value="0.75"')
start=s.index('/* ================= NAV ================= */'); end=s.index('/* ================= NORMAL DIST HELPERS ================= */',start)
nav='''/* ================= NAV ================= */
// Navigation is presentation-only; the calculation and simulation code below is unchanged.
const lessonRoot = document.getElementById('lesson-content');
const lessonNav = lessonRoot.querySelector('nav.toc');
function measureLessonChrome(){
  const header = document.querySelector('header.site');
  const headerHeight = Math.ceil(header ? header.getBoundingClientRect().height : 0);
  lessonRoot.style.setProperty('--lesson-arl-site-header-height', headerHeight+'px');
  lessonRoot.style.setProperty('--lesson-arl-toc-height', Math.ceil(lessonNav.getBoundingClientRect().height)+'px');
  document.getElementById('quiz').style.setProperty('--lesson-arl-site-header-height', headerHeight+'px');
}
measureLessonChrome();
if(window.ResizeObserver){
  const observer = new ResizeObserver(measureLessonChrome);
  observer.observe(document.querySelector('header.site'));
  observer.observe(lessonNav);
}
window.addEventListener('resize', measureLessonChrome, {passive:true});
function goTo(id, pushHash){
  const target = lessonRoot.querySelector('section.part[id="'+id.replace(/[^a-z0-9-]/gi,'')+'"]');
  if(!target) return;
  lessonRoot.querySelectorAll('section.part').forEach(s=>s.classList.toggle('active',s===target));
  lessonRoot.querySelectorAll('nav.toc button').forEach(b=>{
    const active=b.dataset.target===id;
    b.classList.toggle('active',active);
    if(active){b.classList.add('visited');b.setAttribute('aria-current','step');}
    else b.removeAttribute('aria-current');
  });
  measureLessonChrome();
  if(pushHash!==false && history.replaceState){
    try{history.replaceState(null,'','#'+id);}catch(e){/* Restricted embedded context. */}
  }
  requestAnimationFrame(()=>{
    target.focus({preventScroll:true});
    target.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    updateProgress();
  });
}
lessonRoot.querySelectorAll('nav.toc button, .syllabus-item').forEach(b=>{
  b.setAttribute('aria-controls',b.dataset.target);
  b.addEventListener('click',()=>goTo(b.dataset.target));
});
lessonRoot.querySelectorAll('section.part').forEach(s=>{
  s.tabIndex=-1;
  const heading=s.querySelector('h2');
  heading.id=s.id+'-heading';
  s.setAttribute('aria-labelledby',heading.id);
});
window.addEventListener('hashchange',()=>goTo(location.hash.slice(1),false));
// Preserve the initial overview; a supplied part deep link opens that part directly.
if(/^#p[1-6]$/.test(location.hash)) goTo(location.hash.slice(1),false);
else lessonRoot.querySelector('nav.toc button[data-target="p1"]').setAttribute('aria-current','step');
lessonRoot.querySelector('nav.toc button[data-target="p1"]').classList.add('visited');
const progressFill = document.getElementById('progressFill');
function updateProgress(){
  const h=document.documentElement, max=h.scrollHeight-h.clientHeight;
  progressFill.style.width=(max>0?h.scrollTop/max*100:0)+'%';
}
window.addEventListener('scroll',updateProgress,{passive:true});
updateProgress();

'''
s=s[:start]+nav+s[end:]
s=s.replace("'#1c3153'", "'#607897'").replace("'#3a4f6e'", "'#8fa5c2'")
s=s.replace("zc.fillText('mean',cx-16,h-30)","zc.fillText('mean',cx-16,h-12)")
endstyle='''
<script id="signal-noise-accessibility">
(function(){
  'use strict';
  const root=document.getElementById('lesson-content');
  root.querySelectorAll('.math').forEach(e=>{
    e.tabIndex=0;e.setAttribute('role','region');e.setAttribute('aria-label','Formula or calculation');
  });
  root.querySelectorAll('.derive-toggle').forEach(button=>{
    const panel=document.getElementById('deriv-'+button.dataset.idx);
    if(!panel)return;
    button.setAttribute('aria-controls',panel.id);
    button.setAttribute('aria-expanded','false');
    button.addEventListener('click',()=>button.setAttribute('aria-expanded',String(panel.classList.contains('open'))));
  });
  root.querySelectorAll('#testCards .test-card').forEach(card=>{
    const canvas=card.querySelector('canvas');
    canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label',card.querySelector('.test-title').textContent+'; illustrative pattern shape');
  });
  ['arlMath','runNote','cusumNote'].forEach(id=>{
    const e=document.getElementById(id);e.setAttribute('aria-live','polite');e.setAttribute('aria-atomic','true');
  });
  ['stat3','stat2','statRatio'].forEach(id=>document.getElementById(id).setAttribute('aria-live','polite'));
  document.getElementById('arlCanvas').setAttribute('aria-describedby','arlMath');
  document.getElementById('runCanvas').setAttribute('aria-describedby','runNote');
  document.getElementById('cusumCanvas').setAttribute('aria-describedby','cusumNote');
})();
</script>
<style id="signal-noise-dark-overrides">
'''+dark+'''
#quiz { scroll-margin-top:calc(var(--lesson-arl-site-header-height,80px) + 20px); color:var(--ink); }
#quiz .quiz, #quiz .quiz-question, #quiz .quiz-feedback, #quiz .quiz-result { color:var(--ink); }
#quiz .quiz-option { border-color:#63778b; }
#quiz .quiz-question { min-width:0; }
#quiz .quiz-question legend, #quiz .quiz-option { overflow-wrap:anywhere; }
#quiz .quiz-actions button { min-height:44px; }
#quiz .quiz-actions button:hover { background:#09515d; color:#ffffff; }
html[data-theme="dark"] #lesson-content button.btn:not(.ghost) { background:#3fb6d8; color:#071120; }
html[data-theme="dark"] #lesson-content button.btn:not(.ghost):hover { background:#5cc9e6; color:#071120; }
html[data-theme="dark"] #quiz .lesson-kicker { color:#67d4df; }
html[data-theme="dark"] #quiz .quiz-option { border-color:#738ca8 !important; }
html[data-theme="dark"] #signal-noise-return a { color:#67d4df !important; }
</style>
'''
s=s.replace('</body>',endstyle+'</body>')
P.write_text(s)
print('Updated',P,'bytes',len(s.encode()))
