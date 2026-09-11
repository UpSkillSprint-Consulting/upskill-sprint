(function () {
  'use strict';

  const VERSION='1.0.0';
  const STYLE_ID='tb-ux-accessibility-styles';
  const STATUS_ID='tb-a11y-status';
  const ALERT_ID='tb-a11y-alert';
  let scheduled=false;
  let frame=0;
  let observer=null;
  let lastOpener=null;

  function escText(value){return String(value==null?'':value).replace(/\s+/g,' ').trim();}
  function ensureLiveRegion(id,role,live){
    let node=document.getElementById(id);
    if(node)return node;
    node=document.createElement('div');node.id=id;node.className='tb-sr-only';node.setAttribute('role',role);node.setAttribute('aria-live',live);node.setAttribute('aria-atomic','true');
    document.body.appendChild(node);return node;
  }
  function announce(message,urgent){
    const text=escText(message);if(!text)return;
    const node=ensureLiveRegion(urgent?ALERT_ID:STATUS_ID,urgent?'alert':'status',urgent?'assertive':'polite');
    node.textContent='';window.setTimeout(function(){if(node.isConnected)node.textContent=text;},0);
  }
  function setId(node,prefix){if(!node)return'';if(!node.id)node.id=prefix+'-'+Math.random().toString(36).slice(2,9);return node.id;}
  function isInteractive(node){return node&&/^(BUTTON|A|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(node.tagName);}
  function numericPercent(text){const m=String(text||'').match(/(-?\d+(?:\.\d+)?)%/);return m?Math.max(0,Math.min(100,Number(m[1]))):null;}

  function enhanceAnalytics(){
    const panel=document.getElementById('tb-analytics-panel');if(!panel)return;
    const heading=panel.querySelector('h3');if(heading){setId(heading,'tb-analytics-title');panel.setAttribute('aria-labelledby',heading.id);}
    panel.setAttribute('role','region');
    const tabs=Array.from(panel.querySelectorAll('[data-analytics-tab]'));
    const body=panel.querySelector('[data-analytics-body]');
    if(tabs.length&&body){
      const bodyId=setId(body,'tb-analytics-tabpanel');body.setAttribute('role','tabpanel');
      tabs.forEach(function(tab,index){
        const id=setId(tab,'tb-analytics-tab');tab.setAttribute('role','tab');tab.setAttribute('aria-controls',bodyId);
        const selected=tab.getAttribute('aria-selected')==='true';tab.tabIndex=selected?0:-1;
        if(selected)body.setAttribute('aria-labelledby',id);
        if(!tab.dataset.tbA11yKeys){tab.dataset.tbA11yKeys='1';tab.addEventListener('keydown',function(event){
          let target=null;
          if(event.key==='ArrowRight')target=tabs[(index+1)%tabs.length];
          else if(event.key==='ArrowLeft')target=tabs[(index-1+tabs.length)%tabs.length];
          else if(event.key==='Home')target=tabs[0];
          else if(event.key==='End')target=tabs[tabs.length-1];
          if(!target)return;event.preventDefault();target.focus();target.click();
        });}
      });
    }
    const close=panel.querySelector('[data-close-analytics]');if(close&&!close.getAttribute('aria-label'))close.setAttribute('aria-label','Close full analytics');
    const ring=panel.querySelector('.tb-an-ring');if(ring){const value=escText(ring.querySelector('strong')&&ring.querySelector('strong').textContent);ring.setAttribute('role','img');ring.setAttribute('aria-label','Study readiness '+value);}
    panel.querySelectorAll('.tb-an-domain-row').forEach(function(row){
      const track=row.querySelector('.tb-an-bar-track'),head=row.querySelector('.tb-an-domain-head');if(!track)return;
      const label=escText(head&&head.textContent)||'Domain mastery';const value=numericPercent(label);
      track.setAttribute('role','progressbar');track.setAttribute('aria-label',label.replace(/\s+\d+(?:\.\d+)?%.*$/,''));track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');if(value!=null)track.setAttribute('aria-valuenow',String(value));
    });
    panel.querySelectorAll('.tb-an-heat-cell').forEach(function(cell){
      const label=cell.getAttribute('aria-label')||cell.getAttribute('title')||cell.dataset.label||'';
      if(label)cell.setAttribute('aria-label',label);
      cell.setAttribute('role','img');
    });
  }

  function enhanceQuiz(){
    const overview=document.getElementById('tb-overview');if(!overview)return;
    const quiz=overview.querySelector('.tb-quiz');if(quiz){
      quiz.setAttribute('role','region');
      const stem=quiz.querySelector('.tb-stem');if(stem){setId(stem,'tb-question-title');quiz.setAttribute('aria-labelledby',stem.id);}
    }
    overview.querySelectorAll('[data-goto],.tb-navcell').forEach(function(node){
      if(isInteractive(node))return;
      if(!node.hasAttribute('tabindex'))node.tabIndex=0;
      if(!node.hasAttribute('role'))node.setAttribute('role','button');
      if(!node.dataset.tbA11yActivate){node.dataset.tbA11yActivate='1';node.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();node.click();}});}
    });
    overview.querySelectorAll('[data-opt]').forEach(function(node){
      if(!node.hasAttribute('aria-label')){const text=escText(node.textContent);if(text)node.setAttribute('aria-label',text);}
    });
  }

  function enhanceStatusNodes(){
    document.querySelectorAll('.tb-error,[data-error],.error-message').forEach(function(node){if(!node.hasAttribute('role'))node.setAttribute('role','alert');});
    document.querySelectorAll('.tb-status,[data-status]').forEach(function(node){if(!node.hasAttribute('role'))node.setAttribute('role','status');if(!node.hasAttribute('aria-live'))node.setAttribute('aria-live','polite');});
  }

  function enhanceFooterContrast(){
    document.querySelectorAll('footer.site p').forEach(function(node){
      if(node.style.getPropertyValue('color')==='#cbd5e1'&&node.style.getPropertyPriority('color')==='important')return;
      node.style.setProperty('color','#cbd5e1','important');
    });
  }

  function enhance(){scheduled=false;ensureLiveRegion(STATUS_ID,'status','polite');ensureLiveRegion(ALERT_ID,'alert','assertive');enhanceAnalytics();enhanceQuiz();enhanceStatusNodes();enhanceFooterContrast();}
  function schedule(){if(scheduled)return;scheduled=true;frame=window.requestAnimationFrame(function(){frame=0;enhance();});}

  function ensureStyles(){if(document.getElementById(STYLE_ID))return;const style=document.createElement('style');style.id=STYLE_ID;style.textContent=
    '.tb-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}' +
    'body input,body select,body textarea{max-width:100%;box-sizing:border-box}' +
    'footer.site{--muted:#cbd5e1}' +
    'footer.site p{color:#cbd5e1!important}' +
    '#tb-overview :focus-visible,#tb-analytics-panel :focus-visible,[data-open-analytics]:focus-visible{outline:3px solid currentColor!important;outline-offset:3px!important}' +
    '#tb-overview button,#tb-overview [role="button"],#tb-overview a,.tb-an-tab,.tb-ghost{min-height:44px}' +
    '@media (prefers-reduced-motion:reduce){#tb-overview *,#tb-analytics-panel *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}}' +
    '@media (forced-colors:active){#tb-overview :focus-visible,#tb-analytics-panel :focus-visible{outline:3px solid Highlight!important}.tb-an-bar-fill,.tb-an-radar-mastery,.tb-an-radar-weight{forced-color-adjust:auto}}' +
    '@media print{#tb-a11y-status,#tb-a11y-alert{display:none!important}.tb-sr-only{display:none!important}}';document.head.appendChild(style);}

  function wireEvents(){
    document.addEventListener('click',function(event){const opener=event.target.closest&&event.target.closest('[data-open-analytics]');if(opener)lastOpener=opener;const close=event.target.closest&&event.target.closest('[data-close-analytics]');if(close&&lastOpener)window.setTimeout(function(){try{lastOpener.focus();}catch(error){}},0);});
    document.addEventListener('keydown',function(event){if(event.key!=='Escape')return;const panel=document.getElementById('tb-analytics-panel');if(panel&&!panel.hidden){const close=panel.querySelector('[data-close-analytics]');if(close){event.preventDefault();close.click();}}});
    document.addEventListener('tb:new-only-allocation',function(event){const d=event.detail||{};if(d.state==='blocked')announce('New-only quiz could not start. '+String(d.reason||'Please retry.'),true);else if(d.state==='reserved')announce('New-only questions reserved. Quiz is ready to start.',false);});
    document.addEventListener('tb:new-only-allocation-error',function(){announce('New-only progress could not be updated. Your existing question claim remains protected.',true);});
    document.addEventListener('tb:learning-sync-status',function(event){const d=event.detail||{};const phase=String(d.phase||'');if(phase==='offline')announce('Offline. Saved work will sync when the connection returns.',false);else if(phase==='conflict')announce('Session recovery is required. Saved progress remains on this device until you review the active session.',true);else if(phase==='error')announce('Progress sync needs attention.',true);else if(phase==='synced')announce('Progress synced.',false);});
    document.addEventListener('tb:learning-session-start-blocked',function(){announce('Another session must be continued, ended, or recovered before a new quiz can start.',true);});
    document.addEventListener('tb:session-handoff-error',function(){announce('Session transfer needs attention. The cloud-accepted session remains protected.',true);});
    document.addEventListener('tb:timing-recovery-required',function(){announce('Exam timing must be verified before this session can continue.',true);});
  }

  function destroy(){
    if(observer){observer.disconnect();observer=null;}
    if(frame){window.cancelAnimationFrame(frame);frame=0;}
    scheduled=false;
  }

  function mutationHandler(records){
    let footerChanged=false;
    records.forEach(function(record){
      const target=record.target&&record.target.nodeType===1?record.target:null;
      if(target&&(target.matches&&target.matches('footer.site,footer.site p')||target.closest&&target.closest('footer.site')))footerChanged=true;
      if(record.addedNodes)Array.from(record.addedNodes).forEach(function(node){if(node.nodeType===1&&(node.matches&&node.matches('footer.site,footer.site *')||node.querySelector&&node.querySelector('footer.site,footer.site p')))footerChanged=true;});
    });
    if(footerChanged)enhanceFooterContrast();
    schedule();
  }

  function initialize(){if(!document.body)return;ensureStyles();wireEvents();enhance();observer=new MutationObserver(mutationHandler);observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','aria-selected','data-question-id','class','style']});}

  window.__TBUXAccessibility={version:VERSION,enhance:enhance,announce:announce,destroy:destroy};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();
}());
