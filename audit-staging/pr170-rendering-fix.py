from pathlib import Path
import hashlib
expected={'dmaic-encyclopedia-fixes.css':'9880c1ac5a8079334618e72f3be02fb8c5fc931b','test-bank-mbb-set3-batch6-ui.js':'09cb2e85c0a8565c205834e9ad07d2a9e3c26435','test-bank-feedback-loop.js':'c7ed918338113332aeb17d27c8f30b99fcf54236'}
for name,sha in expected.items():
 b=Path(name).read_bytes();assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==sha,name
p=Path('dmaic-encyclopedia-fixes.css');s=p.read_text();needle='@media print {\n';assert s.count(needle)==1
s=s.replace(needle,needle+'''  /* Printing can begin in the same frame as a theme switch. Transitions outrank
     even !important colours, so cancel motion before resolving the paper palette. */
  body.dmaic-encyclopedia-page,
  body.dmaic-encyclopedia-page *,
  body.dmaic-encyclopedia-page *::before,
  body.dmaic-encyclopedia-page *::after {
    transition: none !important;
    animation: none !important;
  }
''');p.write_text(s)
p=Path('test-bank-feedback-loop.js');s=p.read_text();needle='      .tb-review-reference{max-width:100%;overflow-wrap:anywhere;line-height:1.6}'
assert s.count(needle)==1;s=s.replace(needle,'''      /* Keep foreground and surface in the same theme frame. A background-only
         transition makes the back button unreadable during a rapid theme switch. */
      .tb-backsim{transition:none!important}
'''+needle);p.write_text(s)
p=Path('test-bank-mbb-set3-batch6-ui.js');s=p.read_text();needle=' if(global.document){';assert s.count(needle)==1
s=s.replace(needle,''' // Make horizontal keyboard navigation deterministic across browser engines
 // and during review-page scrolling. Never intercept keys in nested controls.
 function scrollEvidence(event){
  const region=event.target;
  if(event.defaultPrevented||event.isComposing||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||
     !region?.matches?.('.mbbs3b6-scroll'))return;
  const max=region.scrollWidth-region.clientWidth;
  if(max<=2)return;
  let next;
  switch(event.key){
   case 'ArrowRight':next=region.scrollLeft+40;break;
   case 'ArrowLeft':next=region.scrollLeft-40;break;
   case 'Home':next=0;break;
   case 'End':next=max;break;
   default:return;
  }
  event.preventDefault();
  region.scrollLeft=Math.max(0,Math.min(max,next));
 }
'''+needle)
s=s.replace("  const style=document.createElement('style');", "  document.addEventListener('keydown',scrollEvidence);\n  const style=document.createElement('style');",1)
p.write_text(s)
print('Applied three scoped repairs; question bank unchanged.')
