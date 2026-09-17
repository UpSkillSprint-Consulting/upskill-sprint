"""Collect focused cross-browser geometry evidence for the rich MBB review."""
import argparse
import json
import runpy
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--browser',choices=['chromium','webkit'],required=True)
parser.add_argument('--out',default='student-audit-evidence')
args=parser.parse_args()
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
constants=runpy.run_path('scripts/student-review-browser.py')
with sync_playwright() as pw:
    browser=getattr(pw,args.browser).launch()
    page=browser.new_page(viewport={'width':390,'height':900})
    errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
    def route(r):
        url=urlparse(r.request.url)
        if url.path=='/auth.js':r.fulfill(content_type='application/javascript',body=constants['AUTH'])
        elif url.netloc!='127.0.0.1:8765' or r.request.method not in ['GET','HEAD']:r.abort()
        else:r.continue_()
    page.route('**/*',route)
    page.goto('http://127.0.0.1:8765/test-bank');page.wait_for_selector('body.access-ready')
    page.locator('#tb-mobile-cert-select').select_option('mbb')
    page.locator('[data-set="2"]').click()
    page.locator('[data-timing-kind="full"][data-timed="1"]').click()
    page.locator('[data-mode="full"]').click()
    page.evaluate(constants['PREPARE'])
    page.locator('[data-goto]').last.click();page.locator('[data-submit]').click()
    page.wait_for_selector('#tb-feedback-loop');page.locator('[data-open-review="all"]').click()
    diagnostic=page.evaluate("""()=>{
      const root=document.querySelector('#tb-feedback-loop');
      const cards=[...root.querySelectorAll('.tb-review-card')].filter(e=>e.scrollWidth>e.clientWidth+2);
      const measure=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {tag:e.tagName,cls:String(e.className),text:e.textContent.slice(0,180),width:r.width,x:r.x,right:r.right,client:e.clientWidth,scroll:e.scrollWidth,min:s.minWidth,max:s.maxWidth,overflow:s.overflowX,whiteSpace:s.whiteSpace,display:s.display,grid:s.gridTemplateColumns};};
      return {viewport:innerWidth,document:document.documentElement.scrollWidth,root:measure(root),cards:cards.map(card=>{
        const edge=card.getBoundingClientRect().right;
        const children=[...card.querySelectorAll('*')].filter(e=>{
          if(e.ownerSVGElement)return false;
          const r=e.getBoundingClientRect();if(!r.width)return false;
          for(let p=e.parentElement;p&&p!==card;p=p.parentElement)if(['auto','scroll','hidden','clip'].includes(getComputedStyle(p).overflowX))return false;
          return r.right>edge+1||e.scrollWidth>e.clientWidth+2;
        }).slice(0,35).map(measure);
        return {id:card.dataset.questionId,box:measure(card),children};
      })};
    }""")
    diagnostic['errors']=errors
    (out/'layout-diagnostics.json').write_text(json.dumps(diagnostic,indent=2))
    print('LAYOUT_DIAGNOSTICS '+json.dumps(diagnostic),flush=True)
    if diagnostic['cards']:
        card=page.locator('[data-question-id="'+diagnostic['cards'][0]['id']+'"]')
        card.screenshot(path=str(out/'layout-diagnostic-card.png'))
    browser.close()
