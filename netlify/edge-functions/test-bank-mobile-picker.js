const MOBILE_PICKER_MARKUP = `
<style id="tb-mobile-certification-picker-styles">
  .tb-mobile-cert-picker{display:none}
  @media (max-width:860px){
    .tb-shell,.tb-main,.tb-rail,.tb-pane{min-width:0;max-width:100%}
    .tb-rail{width:100%;overflow:visible}
    .tb-groups{display:none!important}
    .tb-mobile-cert-picker{display:block;width:100%;margin:0 0 14px}
    .tb-mobile-cert-picker label{display:block;margin:0 0 7px;font:700 11px/1.3 "Work Sans",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .tb-mobile-cert-picker select{display:block;width:100%;max-width:100%;min-height:48px;box-sizing:border-box;border:1px solid var(--teal);border-radius:10px;padding:11px 42px 11px 13px;background:var(--card);color:var(--ink);font:600 15px/1.35 "Work Sans",sans-serif;appearance:auto}
    .tb-mobile-cert-picker select:focus-visible{outline:3px solid color-mix(in srgb,var(--teal) 35%,transparent);outline-offset:2px}
  }
</style>
<script id="tb-mobile-certification-picker-script">
(function(){
  'use strict';
  function install(){
    var rail=document.querySelector('.tb-rail');
    var groups=document.getElementById('tb-groups');
    if(!rail||!groups||document.getElementById('tb-mobile-cert-select')) return;
    var tiles=Array.prototype.slice.call(groups.querySelectorAll('.tb-tile[data-exam]'));
    if(!tiles.length){window.setTimeout(install,40);return;}

    var wrap=document.createElement('div');
    wrap.className='tb-mobile-cert-picker';
    var label=document.createElement('label');
    label.htmlFor='tb-mobile-cert-select';
    label.textContent='Choose a certification exam';
    var select=document.createElement('select');
    select.id='tb-mobile-cert-select';
    select.setAttribute('aria-label','Choose a certification exam');

    tiles.forEach(function(tile){
      var option=document.createElement('option');
      option.value=tile.dataset.exam;
      var name=tile.querySelector('.tb-tn');
      var badge=tile.querySelector('.tb-badge');
      option.textContent=(name&&name.textContent.trim())||(badge&&badge.textContent.trim())||tile.dataset.exam.toUpperCase();
      option.selected=tile.classList.contains('active');
      select.appendChild(option);
    });

    select.addEventListener('change',function(){
      var tile=groups.querySelector('.tb-tile[data-exam="'+select.value+'"]');
      if(tile) tile.click();
    });

    wrap.appendChild(label);
    wrap.appendChild(select);
    groups.parentNode.insertBefore(wrap,groups);

    var sync=function(){
      var active=groups.querySelector('.tb-tile.active[data-exam]');
      if(active&&select.value!==active.dataset.exam) select.value=active.dataset.exam;
    };
    new MutationObserver(sync).observe(groups,{subtree:true,attributes:true,attributeFilter:['class'],childList:true});
    sync();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
</script>`;

export default async function handler(_request, context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const html = await response.text();
  if (html.includes('tb-mobile-certification-picker-script')) {
    return new Response(html, response);
  }

  const updated = html.replace('</body>', `${MOBILE_PICKER_MARKUP}\n</body>`);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(updated, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
