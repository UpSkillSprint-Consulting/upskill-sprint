"""Secondary Batch 6 checks: no-JS fallbacks, dark/mobile and 320px layouts.
Run: python tests/browser/mbb-batch06-secondary.py --out /tmp/mbb-secondary
Reuses the actual source/fixture loader from mbb-batch06-render.py; no live writes.
"""
from pathlib import Path
# The shared prelude defines the offline source loader and screenshot helper,
# but not the main player run. Both scripts live at the same repository depth.
loader=Path(__file__).with_name('mbb-batch06-render.py')
exec(compile(loader.read_text().split('with sync_playwright() as p:')[0],str(loader),'exec'))
results={'environment':'Offline Chromium; actual player, feedback and grounding guard; supplemental layouts only','assertions':[],'screens':[],'errors':[]}
def no_overflow(page,label):check(page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),label)
def inspect_evidence(page,scope,label):
    for element in scope.locator('details').all():element.evaluate('el=>el.open=true')
    for el in scope.locator('.mbb6-scroll').all():
        el.evaluate('el=>el.scrollLeft=el.scrollWidth')
        check(el.evaluate('el=>el.scrollWidth<=el.clientWidth || el.scrollLeft>0'),label+' scroll right reachable')
        el.evaluate('el=>el.scrollLeft=0')
    bad=scope.locator('svg text').evaluate_all('els=>els.filter(e=>{let r=e.getBBox(),v=e.ownerSVGElement.viewBox.baseVal;return r.x < -1 || r.y < -1 || r.x+r.width > v.width+1 || r.y+r.height>v.height+1}).map(e=>e.textContent)')
    check(not bad,label+' complete SVG labels '+str(bad))
    check(scope.locator('svg text').evaluate_all('els=>els.every(e=>parseFloat(getComputedStyle(e).fontSize)>=14)'),label+' unshrunk SVG labels')
    check(scope.locator('.mbb6-table th,.mbb6-table td').evaluate_all('els=>els.every(e=>parseFloat(getComputedStyle(e).fontSize)>=14)'),label+' readable table typography')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    fallback=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',read('test-bank-assets/mbb-160/batch-06/static-fallbacks.html'))
    for theme in ['light','dark']:
        for device,width,height in [('desktop',1440,1000),('tablet',768,1024),('mobile',390,844)]:
            page=browser.new_page(viewport={'width':width,'height':height},color_scheme=theme)
            page.on('pageerror',lambda e:results['errors'].append(str(e)))
            page.set_content(fallback);page.evaluate('(theme)=>document.documentElement.dataset.theme=theme',theme)
            check(page.locator('select,[data-mbb6-point]').count()==0,f'{theme} {device} no dead fallback controls')
            for card in page.locator('.fallback-card').all():
                n=int(card.get_attribute('data-question-id')[-3:]);label=f'{theme} {device} fallback Q{n}'
                no_overflow(page,label+' page bounded');inspect_evidence(page,card,label)
                check(card.locator('.mbb6-conditions').count()==1,label+' assumptions')
                check(card.locator('table caption').count()>0,label+' data alternative')
                screenshot_element(page,'#'+card.get_attribute('id'),OUT/f'{theme}-{device}-fallback-{n}.png')
                results['screens'].append({'theme':theme,'device':device,'question':n,'mode':'fallback'})
            page.close()
    for theme,width,label in [('dark',390,'dark-mobile'),('light',320,'narrow-mobile')]:
        page=browser.new_page(viewport={'width':width,'height':844},has_touch=True,is_mobile=True,color_scheme=theme)
        page.set_default_timeout(6000);page.on('pageerror',lambda e:results['errors'].append(str(e)))
        page.set_content(raw,wait_until='load');page.evaluate('(theme)=>document.documentElement.dataset.theme=theme',theme)
        page.locator('.tb-tile[data-exam="mbb"]').click();page.locator('.tb-setpick [data-set="2"]').click()
        page.evaluate('()=>{window.__TB.EXAMS.mbb.sets[2]=window.MBB_SET2_BATCHES[6];Math.random=()=>0.9999999}')
        page.locator('[data-mode="full"]').click()
        for i,key in enumerate(KEYS):
            page.locator(f'[data-goto="{i}"]').click();no_overflow(page,f'{label} Q{i+126} attempt page')
            inspect_evidence(page,page.locator('#tb-overview'),f'{label} Q{i+126}')
            if theme=='dark':check(page.locator('.tb-qtag').evaluate('(el)=>getComputedStyle(el).color===getComputedStyle(document.querySelector(".tb-stem")).color'),f'{label} Q{i+126} readable topic ink')
            page.locator(f'[data-opt="{key}"]').click()
            screenshot_element(page,'#tb-overview',OUT/f'{label}-attempt-{i+126}.png')
            results['screens'].append({'theme':theme,'device':label,'question':i+126,'mode':'attempt'})
        page.locator('[data-submit]').click();page.wait_for_timeout(100)
        check('25 of 25 correctly' in page.locator('#tb-overview').inner_text(),label+' independently solved score')
        page.locator('[data-open-review="all"]').click()
        for i in range(25):
            page.locator(f'[data-review-goto="{i}"]').click();page.wait_for_timeout(40)
            card=page.locator('.tb-review-card');inspect_evidence(page,card,f'{label} review Q{i+126}')
            no_overflow(page,f'{label} Q{i+126} review page')
            check(card.locator('.mbb6-rationales dt').count()==4,f'{label} Q{i+126} four rationales')
            if i+126==150:
                check('Monitor compensating output' in card.inner_text(),label+' corrected Q150 explanation retained')
            screenshot_element(page,'.tb-review-card',OUT/f'{label}-review-{i+126}.png')
            results['screens'].append({'theme':theme,'device':label,'question':i+126,'mode':'review'})
        page.close()
    browser.close()
results['passed']=not results['errors'] and all(x['passed'] for x in results['assertions'])
(OUT/'secondary-results.json').write_text(json.dumps(results,indent=2))
print(json.dumps({'passed':results['passed'],'assertions':len(results['assertions']),'screens':len(results['screens']),'errors':results['errors']}))
