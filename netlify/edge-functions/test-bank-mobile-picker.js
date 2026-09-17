const SIMPLE_MODE_MARKUP = `
<style id="tb-simple-mode-styles">
  [data-unseen],[data-missed],#tb-analytics,.tb-analytics,.tb-history,.tb-history-tab,[data-history],[data-analytics]{display:none!important}
  /* Normalize the collapsed native menu; full observations remain in the live
     readout below. Plot and data-table scrolling are deliberately unchanged. */
  #tb-feedback-loop [class$="-inspector"] select{
    appearance:none;-webkit-appearance:none;display:block;width:100%;min-width:0;max-width:100%;box-sizing:border-box;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:32px;
    background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
    background-position:calc(100% - 16px) 50%,calc(100% - 11px) 50%;background-size:5px 5px,5px 5px;background-repeat:no-repeat;
  }
</style>
<script id="tb-simple-mode-script">
(function(){
  'use strict';
  function simplify(){
    document.querySelectorAll('[data-unseen],[data-missed],[data-history],[data-analytics],#tb-analytics,.tb-analytics,.tb-history,.tb-history-tab').forEach(function(node){node.remove();});
    document.querySelectorAll('.tb-fieldrow').forEach(function(row){
      var label=row.querySelector('.tb-fieldrow-label');
      if(label&&/filters|history|analytics/i.test(label.textContent||'')) row.remove();
    });
  }
  function install(){
    simplify();
    var host=document.getElementById('tb-overview');
    if(host&&window.MutationObserver)new MutationObserver(function(){simplify();}).observe(host,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
</script>`;

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
  }
</style>
<script id="tb-mobile-certification-picker-script">
(function(){
  'use strict';
  function install(){
    var groups=document.getElementById('tb-groups');
    if(!groups||document.getElementById('tb-mobile-cert-select')) return;
    var tiles=Array.prototype.slice.call(groups.querySelectorAll('.tb-tile[data-exam]'));
    if(!tiles.length){window.setTimeout(install,40);return;}
    var wrap=document.createElement('div');wrap.className='tb-mobile-cert-picker';
    var label=document.createElement('label');label.htmlFor='tb-mobile-cert-select';label.textContent='Choose a certification exam';
    var select=document.createElement('select');select.id='tb-mobile-cert-select';select.setAttribute('aria-label','Choose a certification exam');
    tiles.forEach(function(tile){
      var option=document.createElement('option');option.value=tile.dataset.exam;
      var name=tile.querySelector('.tb-tn');var badge=tile.querySelector('.tb-badge');
      option.textContent=(name&&name.textContent.trim())||(badge&&badge.textContent.trim())||tile.dataset.exam.toUpperCase();
      option.selected=tile.classList.contains('active');select.appendChild(option);
    });
    select.addEventListener('change',function(){var tile=groups.querySelector('.tb-tile[data-exam="'+select.value+'"]');if(tile)tile.click();});
    wrap.appendChild(label);wrap.appendChild(select);groups.parentNode.insertBefore(wrap,groups);
    var sync=function(){var active=groups.querySelector('.tb-tile.active[data-exam]');if(active&&select.value!==active.dataset.exam)select.value=active.dataset.exam;};
    new MutationObserver(sync).observe(groups,{subtree:true,attributes:true,attributeFilter:['class'],childList:true});sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
</script>`;

function normalizedPath(source) {
  try { return new URL(source, 'https://upskillsprint.com').pathname; }
  catch (_) { return String(source || '').split('?')[0]; }
}

function keepTestBankScript(source) {
  const path = normalizedPath(source);
  if (path === '/test-bank-current-attempt-review.js') return true;
  if (path === '/test-bank-memory-learning.js' || path === '/test-bank-formulas.js' || path === '/test-bank-tables.js') return true;
  return /^\/test-bank-(?:cmq|cssgb|cssbb|cqe|mbb)(?:-|\.).*\.js$/i.test(path);
}

function stripPersistedExamRuntime(html) {
  return html.replace(/<script\b([^>]*\bsrc=["']([^"']+)["'][^>]*)>\s*<\/script>/gi, function (tag, attrs, source) {
    const path = normalizedPath(source);
    if (!/^\/test-bank-/i.test(path)) return tag;
    return keepTestBankScript(path) ? tag : '';
  }).replace(/<link\b[^>]*href=["'][^"']*test-bank-(?:analytics|ux-accessibility)\.css[^"']*["'][^>]*>/gi, '');
}

function injectMemoryRuntime(html) {
  if (html.includes('src="/test-bank-memory-learning.js"') || html.includes("src='/test-bank-memory-learning.js'")) return html;
  return html.replace('</head>', '<script src="/test-bank-memory-learning.js"></script>\n</head>');
}

export default async function handler(_request, context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  let html = await response.text();
  html = stripPersistedExamRuntime(html);
  html = injectMemoryRuntime(html);
  if (!html.includes('tb-simple-mode-script')) html = html.replace('</body>', `${SIMPLE_MODE_MARKUP}\n</body>`);
  if (!html.includes('tb-mobile-certification-picker-script')) html = html.replace('</body>', `${MOBILE_PICKER_MARKUP}\n</body>`);
  // Current-attempt feedback is independent of the removed persistence/analytics stack.
  if (!/<script\b[^>]*src=["']\/test-bank-current-attempt-review\.js(?:\?[^"']*)?["']/i.test(html)) {
    html = html.replace('</body>', '<script src="/test-bank-current-attempt-review.js" defer></script>\n</body>');
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('etag');
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
