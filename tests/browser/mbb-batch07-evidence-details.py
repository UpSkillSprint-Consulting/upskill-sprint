"""Supplemental actual-player capture of the two multi-table Batch 7 figures."""
from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[2]
s=Path(__file__).with_name('mbb-batch07-render.py').read_text()
# Reuse the same offline fixture and screenshot helper, not a substitute renderer.
exec(s.split('\nwith sync_playwright() as p:')[0],globals())
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for label,w,h in [('desktop',1440,1000),('mobile',390,844)]:
        page=browser.new_page(viewport={'width':w,'height':h},is_mobile=label=='mobile',has_touch=label=='mobile')
        page.on('pageerror',lambda e:results['errors'].append(str(e)))
        page.set_content(raw,wait_until='load');page.locator('.tb-tile[data-exam="mbb"]').click();page.locator('.tb-setpick [data-set="2"]').click()
        page.evaluate("()=>{__TB.EXAMS.mbb.sets[2]=MBB_SET2_BATCHES[7].filter(q=>[170,174].includes(Number(q.qid.slice(-3))));Math.random=()=>.9999999}")
        page.locator('[data-mode="full"]').click()
        for i,n in enumerate([170,174]):
            page.locator(f'[data-goto="{i}"]').click()
            for detail in page.locator('.mbb7-data').all():detail.locator('summary').click()
            check(page.locator('.mbb7-data[open]').count()==(1 if n==170 else 2),f'{label} Q{n} all disclosures open')
            for side in ['left','right']:
                page.locator('.mbb7-scroll').evaluate_all('(xs,right)=>xs.forEach(x=>x.scrollLeft=right?x.scrollWidth:0)',side=='right')
                check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{label} Q{n} {side} page containment')
                screenshot_element(page,'#tb-overview',OUT/f'{label}-expanded-{n}-{side}.png')
                results['screens'].append({'device':label,'question':n,'mode':'expanded-'+side})
        page.close()
    browser.close()
results['passed']=not results['errors'] and all(a['passed'] for a in results['assertions'])
(OUT/'browser-results.json').write_text(json.dumps(results,indent=2))
print(json.dumps({'passed':results['passed'],'assertions':len(results['assertions']),'records':len(results['screens']),'errors':results['errors']}))
