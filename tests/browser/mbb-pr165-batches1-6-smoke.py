"""Integration smoke test for all six audited batches on the actual player.
Uses each batch's recorded independently adjudicated answers, not the bank keys.
Offline authentication and memory storage; this does not test live services.
"""
from pathlib import Path
loader=Path(__file__).with_name('mbb-batch05-render.py')
exec(compile(loader.read_text().split('with sync_playwright() as p:')[0],str(loader),'exec'))
raw=raw.replace('</head>','<style>'+read('test-bank-mbb-batch1-review.css')+'</style></head>')
b1=json.loads(read('docs/audits/mbb-set2-batch1-tracker.json'))
b2=json.loads(read('docs/audits/mbb-set2-batch02/question-audit-tracker.json'))['question_records']
b4=json.loads(read('docs/audits/mbb-set2-batch04/question-audit-tracker.json'))
b3=json.loads(read('docs/audits/mbb-set2-batch03/question-audit-tracker.json'))
keys=['ABCD'.index(r['verified_key']) for r in b1]+['ABCD'.index(r['correct_letter']) for r in b2]+['ABCD'.index(r['key']) for r in b3]+['ABCD'.index(r['independent_answer']) for r in b4]+KEYS+[1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,3]
assert len(keys)==150
results={'environment':'Actual source; offline Chromium auth/memory fixtures; 150-question integration, not a new source-page audit','assertions':[],'screens':[],'errors':[]}
visuals={1,5,12,13,14,15,20,22,23,24,26,28,31,36,38,40,46,48,49,51,56,61,65,69,70,71,72,73,74,76,84,86,90,96,97,98,99,100}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for label,width,height in [('desktop',1440,1000),('tablet',768,1024),('mobile',390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height},has_touch=label=='mobile',is_mobile=label=='mobile');page.set_default_timeout(7000)
  page.on('pageerror',lambda e:results['errors'].append(str(e)))
  page.set_content(raw,wait_until='load');page.locator('.tb-tile[data-exam="mbb"]').click();page.locator('.tb-setpick [data-set="2"]').click()
  page.evaluate('()=>{window.__TB.EXAMS.mbb.sets[2]=[1,2,3,4,5,6].flatMap(b=>window.MBB_SET2_BATCHES[b]);Math.random=()=>0.9999999}')
  page.locator('[data-mode="full"]').click();check(page.locator('.tb-navcell').count()==150,label+' 150-question contiguous sequence')
  for i,key in enumerate(keys):
   n=i+1;page.locator(f'[data-goto="{i}"]').click()
   check(page.locator('.tb-stem').get_attribute('data-question-id')==f'mbb:set-2:original-{n:03}',f'{label} Q{n} identity')
   check(page.locator('.tb-opt').count()==4,f'{label} Q{n} options')
   check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{label} Q{n} page bounded')
   check(page.locator('.mbb2-rationales,.mbb3-rationales,.mbb4-rationales,.mbb5-rationales,.mbb6-rationales').count()==0,f'{label} Q{n} no premature rationales')
   page.locator(f'[data-opt="{key}"]').click()
   results['screens'].append({'device':label,'question':n,'mode':'attempt','capture':False})
  for n in [1,25,26,50,51,75,76,100,101,125,126,150]:
   page.locator(f'[data-goto="{n-1}"]').click();check(page.locator(f'[data-opt="{keys[n-1]}"].sel').count()==1,f'{label} Q{n} cross-batch retention')
  page.locator('[data-goto="149"]').click();page.locator('[data-submit]').click();page.wait_for_timeout(100)
  check('150 of 150 correctly' in page.locator('#tb-overview').inner_text(),label+' recorded independent answers score 150/150')
  page.locator('[data-open-review="all"]').click()
  for n in range(1,151):
   page.locator(f'[data-review-goto="{n-1}"]').click();card=page.locator('.tb-review-card')
   check(card.get_attribute('data-question-id')==f'mbb:set-2:original-{n:03}',f'{label} Q{n} review identity')
   check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{label} Q{n} review bounded')
   if n>25:
    batch=(n-1)//25+1;check(card.locator(f'.mbb{batch}-conditions').count()==1,f'{label} Q{n} correct batch conditions')
    check(card.locator(f'.mbb{batch}-rationales dt').count()==4,f'{label} Q{n} four rationales')
   if n in [5,36,61,84,105,130]:screenshot_element(page,'.tb-review-card',OUT/f'{label}-review-{n}.png')
   results['screens'].append({'device':label,'question':n,'mode':'review','capture':n in [5,36,61,84,105,130]})
  # One mixed retry queue proves all six renderer paths coexist.
  retry=[5,36,61,84,105,130];page.set_content(raw,wait_until='load');page.locator('.tb-tile[data-exam="mbb"]').click();page.locator('.tb-setpick [data-set="2"]').click()
  page.evaluate('(ids)=>{window.__TB.EXAMS.mbb.sets[2]=[1,2,3,4,5,6].flatMap(b=>window.MBB_SET2_BATCHES[b]).filter(q=>ids.includes(Number(q.qid.slice(-3))));Math.random=()=>0.9999999}',retry)
  page.locator('[data-mode="full"]').click()
  for i,n in enumerate(retry):page.locator(f'[data-goto="{i}"]').click();page.locator(f'[data-opt="{(keys[n-1]+1)%4}"]').click()
  page.locator('[data-submit]').click();page.locator('[data-retry-missed]').click()
  for i,n in enumerate(retry):
   if n>25:
    batch=(n-1)//25+1;check(page.locator(f'.mbb{batch}-evidence').count()==1,f'{label} Q{n} mixed retry evidence')
    check(page.locator(f'.mbb{batch}-rationales').count()==0,f'{label} Q{n} mixed retry no early rationale')
   else:check(page.locator('.tb-mbb-batch1').count()>0,label+' Q5 mixed retry Batch1 renderer')
   page.locator(f'[data-retry-opt="{keys[n-1]}"]').click();page.locator('[data-retry-check]').click()
   check('Correct.' in page.locator('.tb-retry-feedback').inner_text(),f'{label} Q{n} mixed retry key')
   check(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'{label} Q{n} mixed retry bounded')
   results['screens'].append({'device':label,'question':n,'mode':'retry','capture':False});page.locator('[data-retry-next]').click()
  page.close()
 browser.close()
results['passed']=not results['errors'] and all(a['passed'] for a in results['assertions'])
(OUT/'browser-results.json').write_text(json.dumps(results,indent=2))
print(json.dumps({'passed':results['passed'],'assertions':len(results['assertions']),'records':len(results['screens']),'errors':results['errors']}))
