"""Offline Chromium audit of the actual quiz player. Auth/cloud storage are explicit fixtures.
Run: python tests/browser/mbb-batch02-render.py --out /tmp/mbb-render
Requires Python Playwright and Chromium. No network, account credentials, or live writes.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import argparse, json, re, subprocess, hashlib
ROOT=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser();parser.add_argument('--out',required=True);parser.add_argument('--baseline',action='store_true');parser.add_argument('--devices',default='desktop,tablet,mobile');args=parser.parse_args();OUT=Path(args.out);OUT.mkdir(parents=True,exist_ok=True)
def read(path):
    if args.baseline:
        return subprocess.check_output(['git','-c',f'safe.directory={ROOT}','show',f'HEAD:{path}'],cwd=ROOT,text=True)
    return (ROOT/path).read_text()
def inline(match):
    attrs=match.group(1);src=re.search(r'src=["\x27]([^"\x27]+)',attrs)
    if not src:return match.group(0)
    path=src.group(1).lstrip('/')
    if re.match(r'test-bank-(mbb|css|cmq|cqe)',path) or path in ['theme.js','test-bank-formulas.js','test-bank-tables.js','test-bank-mbb-batch2-ui.js']:
        return '<script>'+read(path).replace('</script','<\\/script')+'</script>'
    return ''
raw=re.sub(r'<script\b([^>]*)>([\s\S]*?)</script>',inline,read('test-bank.html'))
raw=re.sub(r'<link\b[^>]*>','',raw)
pre='''<script>
function memoryStorage(){const data={};return {getItem:k=>data[k]??null,setItem:(k,v)=>{data[k]=String(v)},removeItem:k=>delete data[k],clear:()=>Object.keys(data).forEach(k=>delete data[k]),key:i=>Object.keys(data)[i]??null,get length(){return Object.keys(data).length}}}
Object.defineProperty(window,'localStorage',{value:memoryStorage()});Object.defineProperty(window,'sessionStorage',{value:memoryStorage()});
window.__auditEvents=[];window.__TBLearning={status:()=>({signedIn:true,hydrated:true,writeAheadSaved:true}),hasSeen:()=>false,seenQuestionIds:()=>[],questionId:(e,q)=>q.qid,startSession:o=>{__auditEvents.push({type:'start',...o});return {sessionId:'audit-fixture',saved:true}},recordAnswer:o=>{__auditEvents.push({type:'answer',...o});return {saved:true}},completeSession:o=>{__auditEvents.push({type:'complete',...o});return {saved:true}},abandonSession:()=>({saved:true})};
</script>'''
raw=raw.replace('<head>','<head>'+pre+'<style>'+read('style.css')+'</style>').replace('<body data-require-auth>','<body data-require-auth class="auth-ready">')
# These keys were independently solved during the content audit, not read from the production key.
KEYS=[1,3,0,2,1,0,2,3,1,0,3,1,2,0,1,3,2,1,0,2,3,1,0,2,3]
raw += '<script>'+read('test-bank-feedback-loop.js').replace('</script','<\\/script')+'</script>'
results={'environment':'Chromium, actual core player and feedback module; offline authentication/memory-storage fixture; no live auth, cloud sync, or Google web fonts','screens':[],'errors':[],'assertions':[]}
def check(condition,label):
    results['assertions'].append({'label':label,'passed':bool(condition)})
    if not condition:
        (OUT/'browser-results.json').write_text(json.dumps(results,indent=2))
        raise AssertionError(label)
def screenshot_element(page,selector,path):
    # Capture the question card without the unrelated sticky site header. Only the capture hides it; interactions use the unmodified page.
    from PIL import Image
    import io
    page.evaluate('window.scrollTo(0,0)');page.wait_for_timeout(60)
    # Absolute document coordinates remain valid after mobile focus/viewport scrolling.
    box=page.locator(selector).evaluate("el=>{const r=el.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height}}")
    image=Image.open(io.BytesIO(page.screenshot(full_page=True,animations='disabled',style='header.site{visibility:hidden!important}')))
    bounds=(int(box['x']),int(box['y']),int(box['x']+box['width']),int(box['y']+box['height']))
    if bounds[0]<0 or bounds[1]<0 or bounds[2]>image.width+2 or bounds[3]>image.height+2:
        raise AssertionError(f'Invalid screenshot crop {bounds} within {image.size}')
    image.crop(bounds).save(path)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for device,width,height in [('desktop',1440,1000),('tablet',768,1024),('mobile',390,844)]:
        if device not in args.devices.split(','):continue
        # Each layout is a fresh browser context.
        page=browser.new_page(viewport={'width':width,'height':height},has_touch=device=='mobile',is_mobile=device=='mobile',device_scale_factor=1)
        page.set_default_timeout(6000)
        page.on('pageerror',lambda error:results['errors'].append(str(error)))
        page.set_content(raw,wait_until='load');page.locator('.tb-tile[data-exam="mbb"]').click();page.locator('.tb-setpick [data-set="2"]').click()
        page.evaluate('''()=>{window.__TB.EXAMS.mbb.sets[2]=window.MBB_SET2_BATCHES[2];Math.random=()=>0.9999999}''')
        page.locator('[data-mode="full"]').click();check(page.locator('.tb-navcell').count()==25,device+' exactly 25 audit items')
        for index in range(25):
            page.locator(f'[data-goto="{index}"]').click();page.wait_for_timeout(40);qid=page.locator('.tb-stem').get_attribute('data-question-id')
            check(qid==f'mbb:set-2:original-{index+26:03}',f'{device} Q{index+26} identity')
            check(page.locator('.tb-opt').count()==4,f'{device} Q{index+26} four choices')
            check(page.locator('.tb-review-panel').count()==0,f'{device} Q{index+26} no pre-submit key/review')
            if not args.baseline:
                check(page.locator('.mbb2-conditions').count()==1,f'{device} Q{index+26} conditions visible')
            screenshot_element(page,'#tb-overview',OUT/f'{device}-{index+26:02}.png')
            metrics=page.evaluate('''()=>({bodyWidth:document.documentElement.scrollWidth,viewport:innerWidth,svgFontSizes:[...document.querySelectorAll('.tb-quiz svg text')].map(x=>parseFloat(getComputedStyle(x).fontSize)*(x.ownerSVGElement.getBoundingClientRect().width/x.ownerSVGElement.viewBox.baseVal.width)),tableCells:[...document.querySelectorAll('.tb-quiz .tb-q-data-table th,.tb-quiz .tb-q-data-table td')].map(x=>({text:x.textContent,width:x.getBoundingClientRect().width,height:x.getBoundingClientRect().height,fontSize:parseFloat(getComputedStyle(x).fontSize)})),touchHeights:[...document.querySelectorAll('.tb-opt,.mbb2-inspector select')].map(x=>x.getBoundingClientRect().height)})''')
            check(metrics['bodyWidth']<=width+1,f'{device} Q{index+26} no page overflow')
            if not args.baseline and metrics['svgFontSizes']:check(min(metrics['svgFontSizes'])>=11.9,f'{device} Q{index+26} SVG labels at least 12px')
            if not args.baseline and metrics['tableCells']:check(min(x['fontSize'] for x in metrics['tableCells'])>=13.9,f'{device} Q{index+26} table text at least 14px')
            results['screens'].append({'device':device,'qid':qid,'question':index+26,**metrics})
            if not args.baseline and index in [5,23]:
                select=page.locator('[data-mbb2-observation]');select.select_option('1');check(len(page.locator('[data-mbb2-readout]').inner_text())>10,f'{device} Q{index+26} touch/select readout')
                point=page.locator('[data-mbb2-point="0"]');point.focus();point.press('Enter');check(select.input_value()=='0',f'{device} Q{index+26} keyboard point readout')
                page.locator('.mbb2-data summary').click();check(page.locator('.mbb2-data tbody tr').count()==(12 if index==5 else 10),f'{device} Q{index+26} data alternative')
            if index==10:
                slider=page.locator('[data-tb-whatif]');slider.evaluate("x=>{x.value='16';x.dispatchEvent(new Event('input',{bubbles:true}))}")
                check(page.locator('[data-tb-whatif-remaining]').inner_text()=='12',device+' Q36 slider 16-4=12')
                slider.evaluate("x=>{x.value='12';x.dispatchEvent(new Event('input',{bubbles:true}))}")
            if not args.baseline:
                for scroll in page.locator('.mbb2-scroll').all():
                    scroll.evaluate('x=>x.scrollLeft=x.scrollWidth');check(scroll.evaluate('x=>x.scrollWidth<=x.clientWidth || x.scrollLeft>0'),f'{device} Q{index+26} evidence scroll reachable');scroll.evaluate('x=>x.scrollLeft=0')
            # Exercise every option and confirm the final choice is saved across re-render/navigation.
            for option in range(4):
                page.locator(f'[data-opt="{option}"]').click();check(page.locator(f'.tb-opt.sel[data-opt="{option}"]').count()==1,f'{device} Q{index+26} option {option} selection')
            page.locator(f'[data-opt="{KEYS[index]}"]').click()
            page.locator('[data-flag]').click();check('Flagged' in page.locator('[data-flag]').inner_text(),f'{device} Q{index+26} flag')
            page.locator('[data-flag]').click()
        page.locator('[data-goto="0"]').click();check(page.locator('.tb-opt.sel[data-opt="1"]').count()==1,device+' answer retained after navigation')
        page.locator('[data-calc]').click();check(page.locator('#tb-calc').is_visible(),device+' calculator opens');page.locator('[data-close="calc"]').click()
        page.locator('[data-formulas]').click();check(page.locator('#tb-formulas').is_visible(),device+' formula panel opens');page.locator('[data-close="formulas"]').click()
        page.locator('[data-goto="24"]').click();page.wait_for_timeout(50);page.locator('[data-submit]').click();page.wait_for_timeout(200)
        (OUT/(device+'-result.txt')).write_text(page.locator('#tb-overview').inner_text())
        screenshot_element(page,'#tb-overview',OUT/(device+'-result.png'))
        check(bool(re.search(r'25 of 25 correctly',page.locator('#tb-overview').inner_text())),device+' all independently solved answers score 25/25')
        page.locator('[data-open-review="all"]').click()
        for index in range(25):
            page.locator(f'[data-review-goto="{index}"]').click()
            page.wait_for_timeout(30)
            card=page.locator('.tb-review-card')
            check(card.get_attribute('data-question-id')==f'mbb:set-2:original-{index+26:03}',f'{device} review Q{index+26} identity')
            if not args.baseline:
                check(card.locator('.mbb2-conditions').count()==1,f'{device} review Q{index+26} conditions')
                check(card.locator('.mbb2-rationales dt').count()==4,f'{device} review Q{index+26} all distractors explained')
                check(card.locator('.mbb2-evidence').count()==(1 if index+26 in [26,28,31,36,38,40,46,48,49] else 0),f'{device} review Q{index+26} evidence retained')
            check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{device} review Q{index+26} no page overflow')
            screenshot_element(page,'.tb-review-card',OUT/f'{device}-review-{index+26:02}.png')
            results['screens'].append({'device':device,'question':index+26,'mode':'review'})
        # Exercise a real wrong-answer correction flow with all three interactive visual types.
        page.set_content(raw,wait_until='load')
        page.locator('.tb-tile[data-exam="mbb"]').click();page.locator('.tb-setpick [data-set="2"]').click()
        page.evaluate("()=>{window.__TB.EXAMS.mbb.sets[2]=window.MBB_SET2_BATCHES[2].filter(q=>[31,36,49].includes(Number(q.qid.slice(-3))));Math.random=()=>0.9999999}")
        page.locator('[data-mode="full"]').click()
        for index,key in enumerate([0,3,2]):
            page.locator(f'[data-goto="{index}"]').click();page.wait_for_timeout(30)
            page.locator(f'[data-opt="{(key+1)%4}"]').click();page.wait_for_timeout(30)
        page.locator('[data-submit]').click();page.wait_for_timeout(100)
        page.locator('[data-retry-missed]').click()
        for index,key in enumerate([0,3,2]):
            if not args.baseline:
                check(page.locator('.mbb2-evidence').count()==1,f'{device} retry {index} evidence retained')
                check(page.locator('.mbb2-rationales').count()==0,f'{device} retry {index} no premature rationales')
            page.locator(f'[data-retry-opt="{key}"]').click();page.locator('[data-retry-check]').click()
            if not args.baseline:
                check(page.locator('.mbb2-rationales dt').count()==4,f'{device} retry {index} checked rationales')
            check('Correct.' in page.locator('.tb-retry-feedback').inner_text(),f'{device} retry {index} independent solution accepted')
            check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{device} retry {index} no page overflow')
            screenshot_element(page,'#tb-overview',OUT/f'{device}-retry-{[31,36,49][index]}.png')
            results['screens'].append({'device':device,'question':[31,36,49][index],'mode':'retry'})
            page.locator('[data-retry-next]').click()
        check('3' in page.locator('#tb-overview').inner_text(),device+' retry completion')
        results['assertions'].append({'label':device+' authentication and writes are explicitly fixtures','passed':True})
        page.close()
    browser.close()
results['passed']=not results['errors'] and all(x['passed'] for x in results['assertions'])
(OUT/'browser-results.json').write_text(json.dumps(results,indent=2))
print(json.dumps({'passed':results['passed'],'assertions':len(results['assertions']),'screens':len(results['screens']),'errors':results['errors']}))
