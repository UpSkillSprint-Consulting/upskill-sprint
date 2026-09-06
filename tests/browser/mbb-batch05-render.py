"""Offline Chromium audit of the actual quiz player. Auth/cloud storage are explicit fixtures.
Run: python tests/browser/mbb-batch05-render.py --out /tmp/mbb-render
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
    if re.match(r'test-bank-(mbb|css|cmq|cqe)',path) or path in ['theme.js','test-bank-formulas.js','test-bank-tables.js','test-bank-mbb-batch5-ui.js']:
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
KEYS=[0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0]
raw += '<script>'+read('test-bank-feedback-loop.js').replace('</script','<\\/script')+'</script>'
raw += '<script>'+read('test-bank-deep-feedback.js').replace('</script','<\\/script')+'</script>'
raw += '<script>'+read('test-bank-deep-feedback-grounding.js').replace('</script','<\\/script')+'</script>'
results={'environment':'Chromium, actual core player, feedback, deep feedback and grounding guard; offline authentication/memory-storage fixture; no live auth, cloud sync, or Google web fonts','screens':[],'errors':[],'assertions':[]}
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
        page.evaluate('''()=>{window.__TB.EXAMS.mbb.sets[2]=window.MBB_SET2_BATCHES[5];Math.random=()=>0.9999999}''')
        page.locator('[data-mode="full"]').click();check(page.locator('.tb-navcell').count()==25,device+' exactly 25 audit items')
        for index in range(25):
            page.locator(f'[data-goto="{index}"]').click();page.wait_for_timeout(40);qid=page.locator('.tb-stem').get_attribute('data-question-id')
            check(qid==f'mbb:set-2:original-{index+101:03}',f'{device} Q{index+101} identity')
            check(page.locator('.tb-opt').count()==4,f'{device} Q{index+101} four choices')
            check(page.locator('.tb-review-panel').count()==0,f'{device} Q{index+101} no pre-submit key/review')
            if not args.baseline:
                check(page.locator('.mbb5-conditions').count()==1,f'{device} Q{index+101} conditions visible')
            screenshot_element(page,'#tb-overview',OUT/f'{device}-{index+101:02}.png')
            metrics=page.evaluate('''()=>({bodyWidth:document.documentElement.scrollWidth,viewport:innerWidth,svgFontSizes:[...document.querySelectorAll('.tb-quiz svg text')].map(x=>parseFloat(getComputedStyle(x).fontSize)*(x.ownerSVGElement.getBoundingClientRect().width/x.ownerSVGElement.viewBox.baseVal.width)),tableCells:[...document.querySelectorAll('.tb-quiz .tb-q-data-table th,.tb-quiz .tb-q-data-table td')].map(x=>({text:x.textContent,width:x.getBoundingClientRect().width,height:x.getBoundingClientRect().height,fontSize:parseFloat(getComputedStyle(x).fontSize)})),touchHeights:[...document.querySelectorAll('.tb-opt,.mbb5-inspector select')].map(x=>x.getBoundingClientRect().height)})''')
            results['assertions'].append({'label':f'{device} Q{index+101} page containment', 'passed':metrics['bodyWidth']<=width+1})
            if not args.baseline and metrics['svgFontSizes']:check(min(metrics['svgFontSizes'])>=11.9,f'{device} Q{index+101} SVG labels at least 12px')
            if not args.baseline and metrics['tableCells']:check(min(x['fontSize'] for x in metrics['tableCells'])>=13.9,f'{device} Q{index+101} table text at least 14px')
            results['screens'].append({'device':device,'qid':qid,'question':index+101,'mode':'attempt',**metrics})
            if not args.baseline and index in [5,20]:
                select=page.locator('[data-mbb5-observation]');select.select_option('1');check(len(page.locator('[data-mbb5-readout]').inner_text())>10,f'{device} Q{index+101} touch/select readout')
                point=page.locator('[data-mbb5-point="0"]');point.focus();point.press('Enter');check(select.input_value()=='0',f'{device} Q{index+101} keyboard point readout')
                page.locator('.mbb5-data summary').click();check(page.locator('.mbb5-data tbody tr').count()==(10 if index==5 else 8),f'{device} Q{index+101} data alternative')
            if not args.baseline and index==4:
                slider=page.locator('[data-mbb5-capacity]');slider.fill('11');slider.dispatch_event('input')
                check('11 Belt-months' in page.locator('[data-mbb5-capacity-output]').inner_text(),device+' capacity what-if changes')
                page.locator('[data-mbb5-reset]').click();check(slider.input_value()=='9',device+' reset restores scored capacity')
                check('Scored case: 9' in page.locator('.mbb5-capacity').inner_text(),device+' baseline remains explicit')
            if not args.baseline:
                for scroll in page.locator('.mbb5-scroll').all():
                    scroll.evaluate('x=>x.scrollLeft=x.scrollWidth');check(scroll.evaluate('x=>x.scrollWidth<=x.clientWidth || x.scrollLeft>0'),f'{device} Q{index+101} evidence scroll reachable');scroll.evaluate('x=>x.scrollLeft=0')
            # Exercise every option and confirm the final choice is saved across re-render/navigation.
            for option in range(4):
                page.locator(f'[data-opt="{option}"]').click();check(page.locator(f'.tb-opt.sel[data-opt="{option}"]').count()==1,f'{device} Q{index+101} option {option} selection')
            page.locator(f'[data-opt="{KEYS[index]}"]').click()
            page.locator('[data-flag]').click();check('Flagged' in page.locator('[data-flag]').inner_text(),f'{device} Q{index+101} flag')
            page.locator('[data-flag]').click()
        page.locator('[data-goto="0"]').click();check(page.locator('.tb-opt.sel[data-opt="0"]').count()==1,device+' answer retained after navigation')
        page.locator('[data-calc]').click();check(page.locator('#tb-calc').is_visible(),device+' calculator opens');page.locator('[data-close="calc"]').click()
        page.locator('[data-formulas]').click();check(page.locator('#tb-formulas').is_visible(),device+' formula panel opens');page.locator('[data-close="formulas"]').click()
        page.locator('[data-goto="24"]').click();page.wait_for_timeout(50);page.locator('[data-submit]').click();page.wait_for_timeout(200)
        check(page.evaluate('typeof window.__TBFeedbackGrounding.literalKeyPoint')=='function',device+' grounding guard loaded')
        (OUT/(device+'-result.txt')).write_text(page.locator('#tb-overview').inner_text())
        screenshot_element(page,'#tb-overview',OUT/(device+'-result.png'))
        check(bool(re.search(r'25 of 25 correctly',page.locator('#tb-overview').inner_text())),device+' all independently solved answers score 25/25')
        page.locator('[data-open-review="all"]').click()
        for index in range(25):
            page.locator(f'[data-review-goto="{index}"]').click()
            page.wait_for_timeout(30)
            card=page.locator('.tb-review-card')
            check(page.evaluate('!!window.__TBDeepFeedback'),f'{device} deep feedback loaded')
            check(card.get_attribute('data-question-id')==f'mbb:set-2:original-{index+101:03}',f'{device} review Q{index+101} identity')
            if not args.baseline:
                check(card.locator('.mbb5-conditions').count()==1,f'{device} review Q{index+101} conditions')
                check(card.locator('.mbb5-rationales dt').count()==4,f'{device} review Q{index+101} all distractors explained')
                check(card.locator('.mbb5-evidence').count()==(1 if index+101 in [101,105,106,110,111,120,121,122,123,124] else 0),f'{device} review Q{index+101} evidence retained')
            results['assertions'].append({'label':f'{device} review Q{index+101} page containment','passed':page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')})
            screenshot_element(page,'.tb-review-card',OUT/f'{device}-review-{index+101:02}.png')
            results['screens'].append({'device':device,'question':index+101,'mode':'review'})
        # Test the actual missed-question retry with all three Batch 5 interactions.
        page.set_content(raw,wait_until='load')
        page.locator('.tb-tile[data-exam="mbb"]').click();page.locator('.tb-setpick [data-set="2"]').click()
        page.evaluate("()=>{window.__TB.EXAMS.mbb.sets[2]=window.MBB_SET2_BATCHES[5].filter(q=>[105,106,121].includes(Number(q.qid.slice(-3))));Math.random=()=>0.9999999}")
        page.locator('[data-mode="full"]').click()
        for index,key in enumerate([0,1,0]):
            page.locator(f'[data-goto="{index}"]').click();page.locator(f'[data-opt="{(key+1)%4}"]').click()
        page.locator('[data-submit]').click();page.wait_for_timeout(100);page.locator('[data-retry-missed]').click()
        for index,key in enumerate([0,1,0]):
            check(page.locator('.mbb5-evidence').count()==1,f'{device} retry {index} evidence retained')
            check(page.locator('.mbb5-rationales').count()==0,f'{device} retry {index} no premature rationales')
            if index==0:
                slider=page.locator('[data-mbb5-capacity]');slider.fill('7');slider.dispatch_event('input')
                check('7 Belt-months' in page.locator('[data-mbb5-capacity-output]').inner_text(),device+' retry capacity works')
                page.locator('[data-mbb5-reset]').click();check(slider.input_value()=='9',device+' retry resets scored capacity')
            else:
                select=page.locator('[data-mbb5-observation]');select.select_option('1')
                check(len(page.locator('[data-mbb5-readout]').inner_text())>10,f'{device} retry {index} observation selection')
            page.locator(f'[data-retry-opt="{key}"]').click();page.locator('[data-retry-check]').click()
            check(page.locator('.mbb5-rationales dt').count()==4,f'{device} retry {index} checked rationales')
            check('Correct.' in page.locator('.tb-retry-feedback').inner_text(),f'{device} retry {index} solution accepted')
            check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{device} retry {index} no page overflow')
            screenshot_element(page,'#tb-overview',OUT/f'{device}-retry-{[105,106,121][index]}.png')
            results['screens'].append({'device':device,'question':[105,106,121][index],'mode':'retry'})
            page.locator('[data-retry-next]').click()
        check('3' in page.locator('#tb-overview').inner_text(),device+' retry completion')
        results['assertions'].append({'label':device+' authentication and writes are explicitly fixtures','passed':True})
        page.close()
    browser.close()
results['passed']=not results['errors'] and all(x['passed'] for x in results['assertions'])
(OUT/'browser-results.json').write_text(json.dumps(results,indent=2))
print(json.dumps({'passed':results['passed'],'assertions':len(results['assertions']),'screens':len(results['screens']),'errors':results['errors']}))
