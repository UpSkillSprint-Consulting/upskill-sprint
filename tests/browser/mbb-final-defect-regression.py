"""Reproduce final-review gaps using actual core and ALL four feedback consumers.
Offline auth/storage fixtures; no live-account or cloud acceptance is claimed.
Usage: python tests/browser/mbb-final-defect-regression.py --out /tmp/final-fixes
"""
from pathlib import Path
import re,json,hashlib,traceback
loader=Path(__file__).with_name('mbb-batch07-render.py')
exec(compile(loader.read_text().split('with sync_playwright() as p:')[0],str(loader),'exec'))
modules=['test-bank-feedback-loop.js','test-bank-deep-feedback.js','test-bank-deep-feedback-grounding.js','test-bank-phase2-hardening.js']
original=read('test-bank.html')
assert [original.index('src="/'+n+'"') for n in modules]==sorted(original.index('src="/'+n+'"') for n in modules)
raw=raw.replace('</head>','<style>'+read('test-bank-mbb-batch1-review.css')+'</style></head>')
raw+='<script>'+read(modules[-1]).replace('</script','<\\/script')+'</script>'
results={'environment':'Actual core and all four feedback consumers in production order. Offline authentication/in-memory storage. No live auth, cloud writes, or Safari claim.','modules':modules,'source_sha256':{n:hashlib.sha256((ROOT/n).read_bytes()).hexdigest() for n in ['test-bank.html','test-bank-mbb-set2.js',*modules]},'assertions':[],'screens':[],'errors':[],'quiescence':[]}

def settle(page):page.wait_for_timeout(200)
def plain(s):return re.sub(r'\s+',' ',re.sub(r'<[^>]*>','',s)).strip()
def sentence(s):return re.split(r'(?<=[.!?])\s+',plain(s),maxsplit=1)[0]
def check(v,label):
 results['assertions'].append({'label':label,'passed':bool(v)})
 if not v:raise AssertionError(label)
def press(page,selector):page.locator(selector).dispatch_event('click')
def bounds(page,where):return page.locator(where).evaluate('(el)=>{const b=el.getBoundingClientRect();return {left:b.left,right:b.right,viewport:innerWidth,scroll:document.documentElement.scrollWidth}}')

with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 try:
  for device,w,h,dark in [('desktop',1440,1000,False),('mobile-dark',390,844,True)]:
   page=browser.new_page(viewport={'width':w,'height':h},has_touch=dark,is_mobile=dark,color_scheme='dark' if dark else 'light');page.set_default_timeout(8000)
   page.on('pageerror',lambda e:results['errors'].append(str(e)))
   page.set_content(raw,wait_until='load')
   if dark:page.evaluate('document.documentElement.dataset.theme="dark"')
   page.locator('.tb-tile[data-exam="mbb"]').click();page.locator('.tb-setpick [data-set="2"]').click()
   page.evaluate('()=>{__TB.EXAMS.mbb.bank=[];__TB.EXAMS.mbb.sets={2:MBB_SET2};Math.random=()=>0.9999999}')
   page.locator('[data-mode="full"]').click()
   bank=page.evaluate('MBB_SET2');evidence={}
   for i,q in enumerate(bank):
    press(page,f'[data-goto="{i}"]')
    check(page.locator('.tb-stem').get_attribute('data-question-id')==q['qid'],f'{device} Q{i+1} real exam identity')
    evidence[i+1]=page.locator('#tb-overview').evaluate('el=>({svg:el.querySelectorAll("svg").length,table:el.querySelectorAll("table").length,conditions:[...el.querySelectorAll("[class$=conditions],.tb-student-context")].map(x=>x.textContent)})')
    press(page,f'[data-opt="{q["answer"]}"]')
   page.locator('[data-submit]').click();page.locator('[data-open-review="all"]').click();settle(page)
   # Every question's settled key point, plus all 75 B1 authored distractors.
   for i,q in enumerate(bank):
    press(page,f'[data-review-goto="{i}"]');page.wait_for_timeout(45)
    expected=plain(q.get('keyPoint','')) or sentence(q['why'])
    check(page.locator('.tb-key-point').inner_text()==expected,f'{device} Q{i+1} intact first sentence / authored key point')
    if i<25:
     page.locator('.tb-distractor-analysis summary').click();page.wait_for_timeout(40)
     for row,k in enumerate(j for j in range(4) if j!=q['answer']):
      el=page.locator('.tb-distractor-row').nth(row)
      check(el.locator('p').inner_text()==plain(q['optionRationales'][k]),f'{device} Q{i+1} choice {k} authored rationale retained: {el.locator("p").inner_text()!r} vs {plain(q["optionRationales"][k])!r}')
      check('pending' not in el.inner_text(),f'{device} Q{i+1} choice {k} not incorrectly pending')
    if i+1 in [14,25,49,161]:
     # Measure *all* descendant feedback text/DOM mutations once normalized.
     settle(page)
     page.evaluate('()=>{window.__settledMutations=0;window.__settledObserver=new MutationObserver(m=>__settledMutations+=m.length);__settledObserver.observe(document.querySelector("#tb-feedback-loop"),{subtree:true,childList:true,characterData:true})}')
     page.wait_for_timeout(1200)
     mutations=page.evaluate('()=>{__settledObserver.disconnect();return __settledMutations}')
     results['quiescence'].append({'device':device,'question':i+1,'mutationsOver1200ms':mutations})
     check(mutations==0,f'{device} Q{i+1} feedback reaches zero-mutation steady state')
     check(page.locator('.tb-key-point').inner_text()==expected,f'{device} Q{i+1} text remains intact after settle')
     screenshot_element(page,'.tb-review-card',OUT/f'{device}-review-{i+1}.png')
   # Every chart-bearing question, not a four-item sample, through the actual
   # similar-question button/candidate selection path. Retain the source subtopic.
   targets=[(i+1,q) for i,q in enumerate(bank) if q.get('chart')]
   results['visualQuestionCount']=len(targets)
   for n,q in targets:
    source=next(j for j,s in enumerate(bank) if s['sub']==q['sub'] and s['qid']!=q['qid'])
    page.evaluate('()=>{__TB.EXAMS.mbb.sets={2:MBB_SET2}}')
    press(page,f'[data-review-goto="{source}"]');settle(page)
    page.evaluate('([s,t])=>{__TB.EXAMS.mbb.sets={2:[MBB_SET2[s],MBB_SET2[t]]};__TB.EXAMS.mbb.bank=[]}',[source,n-1])
    if n in [5,69,155,170,174]:page.locator('.tb-review-card [data-practice-similar]').click()
    else:press(page,'.tb-review-card [data-practice-similar]')
    settle(page)
    print(device, 'similar', n, flush=True)
    panel=page.locator('#tb-similar-practice')
    check(panel.get_attribute('data-question-id')==q['qid'],f'{device} Q{n} real similar-practice selection')
    current=panel.evaluate('el=>({svg:el.querySelectorAll("svg").length,table:el.querySelectorAll("table").length,conditions:[...el.querySelectorAll("[class$=conditions],.tb-student-context")].map(x=>x.textContent)})')
    check(current==evidence[n],f'{device} Q{n} similar practice retains every chart/table/condition from exam')
    check(panel.locator('.tb-similar-feedback').count()==0,f'{device} Q{n} no pre-answer solution leakage')
    check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{device} Q{n} similar practice page containment')
    # Native controls and delegated event handlers must work on the new route.
    for select in panel.locator('select').all():
     if select.locator('option').count()>1:
      select.select_option(index=1)
      output=select.locator('xpath=..').locator('output')
      if output.count():check(output.first.inner_text().strip()!='',f'{device} Q{n} selection readout is populated')
    for slider in panel.locator('input[type=range]').all():
     old=slider.input_value();hi=slider.get_attribute('max') or old;slider.fill(hi);slider.dispatch_event('input');check(slider.input_value()==hi,f'{device} Q{n} range interaction');slider.fill(old);slider.dispatch_event('input')
    for point in panel.locator('[data-mbb2-point],[data-mbb3-point],[data-mbb4-point],[data-mbb5-point],[data-mbb6-point],[data-mbb7-point]').all()[:1]:
     point.focus();point.press('Enter')
    if n in [5,36,69,155,170,174]:screenshot_element(page,'#tb-similar-practice',OUT/f'{device}-similar-{n}.png')
    # Check one real choice, then return through the public UI.
    panel.locator(f'[data-similar-opt="{q["answer"]}"]').dispatch_event('click');panel.locator('[data-similar-check]').dispatch_event('click');settle(page)
    check(panel.locator('.tb-similar-feedback').inner_text().startswith('Correct.'),f'{device} Q{n} similar answer checking')
    check(panel.locator('svg').count()==evidence[n]['svg'] and panel.locator('table').count()==evidence[n]['table'],f'{device} Q{n} similar evidence remains after check')
    results['screens'].append({'device':device,'question':n,'route':'similar-practice','before':evidence[n],'after':current})
    panel.locator('[data-close-similar]').dispatch_event('click')
   page.close()
  check(not results['errors'],'No JavaScript errors with full feedback consumer group')
  results['passed']=True
 except Exception:
  results['passed']=False;results['exception']=traceback.format_exc();print(results['exception'],flush=True)
 finally:
  (OUT/'browser-results.json').write_text(json.dumps(results,indent=2));print(json.dumps({'passed':results.get('passed'),'assertions':len(results['assertions']),'visuals':results.get('visualQuestionCount'),'quiescence':results['quiescence'],'errors':results['errors']}),flush=True);browser.close()
 if not results['passed']:raise SystemExit(1)
