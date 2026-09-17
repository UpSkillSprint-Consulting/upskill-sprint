"""Validate rich MBB review layout without hiding scientific evidence."""
import argparse
import json
import runpy
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

parser=argparse.ArgumentParser()
parser.add_argument('--browser',choices=['chromium','webkit'],required=True)
parser.add_argument('--out',default='student-audit-evidence')
args=parser.parse_args()
out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
constants=runpy.run_path('scripts/student-review-browser.py')
report={'browser':args.browser,'errors':[],'measurements':[],'observations':[]}
with sync_playwright() as pw:
    browser=getattr(pw,args.browser).launch()
    page=browser.new_page(viewport={'width':390,'height':900})
    page.on('pageerror',lambda error:report['errors'].append(str(error)))
    def route(r):
        url=urlparse(r.request.url)
        if url.path=='/auth.js':r.fulfill(content_type='application/javascript',body=constants['AUTH'])
        elif url.netloc!='127.0.0.1:8765' or r.request.method not in ['GET','HEAD']:r.abort()
        else:r.continue_()
    page.route('**/*',route)
    try:
        page.goto('http://127.0.0.1:8765/test-bank');page.wait_for_selector('body.access-ready')
        page.locator('#tb-mobile-cert-select').select_option('mbb')
        page.locator('[data-set="2"]').click()
        page.locator('[data-timing-kind="full"][data-timed="1"]').click()
        page.locator('[data-mode="full"]').click()
        page.evaluate(constants['PREPARE'])
        page.locator('[data-goto]').last.click();page.locator('[data-submit]').click()
        page.wait_for_selector('#tb-feedback-loop');page.locator('[data-open-review="all"]').click()
        for width in [390,320]:
            page.set_viewport_size({'width':width,'height':900})
            measurement=page.evaluate("""()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,
              overflow:[...document.querySelectorAll('#tb-feedback-loop,.tb-review-card')].filter(e=>e.scrollWidth>e.clientWidth+2)
              .map(e=>({id:e.dataset.questionId||e.id,client:e.clientWidth,scroll:e.scrollWidth}))})""")
            report['measurements'].append(measurement)
            for number,batch in [('071',3),('097',4)]:
                card=page.locator('.tb-review-card[data-question-id="mbb:set-2:original-'+number+'"]')
                select=card.locator('[data-mbb'+str(batch)+'-observation]')
                output=card.locator('[data-mbb'+str(batch)+'-readout]')
                select.select_option('1')
                expected=select.locator('option').nth(1).text_content()
                expect(output).to_have_text(expected)
                expect(output).to_be_visible()
                select.focus();expect(select).to_be_focused()
                geometry=select.evaluate("e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {width:r.width,right:r.right,client:e.clientWidth,scroll:e.scrollWidth,appearance:s.appearance,overflow:s.overflowX,whiteSpace:s.whiteSpace};}")
                report['observations'].append({'question':number,'width':width,'selected_text':expected,'full_readout':output.text_content(),'geometry':geometry,'result':'PASS'})
                select.scroll_into_view_if_needed()
                page.screenshot(path=str(out/('layout-observation-'+number+'-'+str(width)+'.png')))
        for measurement in report['measurements']:
            assert measurement['document']<=measurement['viewport']+2 and not measurement['overflow'],measurement
        assert not report['errors'],report['errors']
        report['result']='PASS'
    except Exception as error:
        report['result']='FAIL';report['failure']=str(error)
    finally:
        (out/'layout-diagnostics.json').write_text(json.dumps(report,indent=2))
        print('LAYOUT_DIAGNOSTICS '+json.dumps(report),flush=True)
        browser.close()
raise SystemExit(0 if report['result']=='PASS' else 1)
