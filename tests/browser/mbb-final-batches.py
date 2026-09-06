"""Reproducible offline student-interface audit; no live authentication or cloud writes.
Run python tests/browser/mbb-final-batches.py --batch 6 --out /tmp/b6.
"""
from pathlib import Path
import argparse,json,re,subprocess,hashlib,io
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
p=argparse.ArgumentParser();p.add_argument('--batch',type=int,choices=[6,7],required=True);p.add_argument('--out',required=True);p.add_argument('--combined',action='store_true');p.add_argument('--secondary',action='store_true');a=p.parse_args();OUT=Path(a.out);OUT.mkdir(parents=True,exist_ok=True)
B=a.batch;FIRST=1 if a.combined else (B-1)*25+1;N=B*25 if a.combined else 25
KEY6=[1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,3]
KEY7=[2,0,3,1,2,0,3,1,2,0,3,1,2,0,3,1,3,0,1,2,3,0,1,2,3] # Independently adjudicated before this run.
code="const fs=require('fs'),vm=require('vm');let c={};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('test-bank-mbb-set2.js','utf8'),c);console.log(JSON.stringify(c.MBB_SET2_BATCHES));"
banks=json.loads(subprocess.check_output(['node','-e',code],cwd=ROOT,text=True));questions=sum([banks[str(i)] for i in range(1,B+1)],[]) if a.combined else banks[str(B)]
keys=([q['answer'] for i in range(1,6) for q in banks[str(i)]]+KEY6+(KEY7 if B==7 else [])) if a.combined else KEY6 if B==6 else KEY7
assert len(keys)==N
read=lambda f:(ROOT/f).read_text()
def inline(m):
 src=re.search(r'src=["\x27]([^"\x27]+)',m[1])
 if not src:return m[0]
 name=src[1].lstrip('/')
 return '<script>'+read(name).replace('</script','<\\/script')+'</script>' if re.match(r'test-bank-(mbb|css|cmq|cqe)',name) or name in ['theme.js','test-bank-formulas.js','test-bank-tables.js'] else ''
raw=re.sub(r'<script\b([^>]*)>([\s\S]*?)</script>',inline,read('test-bank.html'));raw=re.sub(r'<link\b[^>]*>','',raw)
pre='''<script>function memoryStorage(){const data={};return{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=String(v),removeItem:k=>delete data[k],clear:()=>Object.keys(data).forEach(k=>delete data[k]),key:i=>Object.keys(data)[i]??null,get length(){return Object.keys(data).length}}}Object.defineProperty(window,'localStorage',{value:memoryStorage()});Object.defineProperty(window,'sessionStorage',{value:memoryStorage()});window.__TBLearning={status:()=>({signedIn:true,hydrated:true,writeAheadSaved:true}),hasSeen:()=>false,seenQuestionIds:()=>[],questionId:(e,q)=>q.qid,startSession:()=>({sessionId:'audit',saved:true}),recordAnswer:()=>({saved:true}),completeSession:()=>({saved:true}),abandonSession:()=>({saved:true})};</script>'''
raw=raw.replace('<head>','<head>'+pre+'<style>'+read('style.css')+'</style>').replace('<body data-require-auth>','<body data-require-auth class="auth-ready">')
for f in ['test-bank-feedback-loop.js','test-bank-deep-feedback.js','test-bank-deep-feedback-grounding.js']:raw+='<script>'+read(f).replace('</script','<\\/script')+'</script>'
res={'environment':'Actual application with offline authentication and memory-storage fixtures, Chromium only; not live-service acceptance','batch':B,'combined':a.combined,'assertions':[],'states':[],'errors':[],'sourceHashes':{f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in ['test-bank.html','test-bank-mbb-set2.js','test-bank-mbb-final-audit-ui.js','test-bank-feedback-loop.js']}}
def save(): (OUT/'results.json').write_text(json.dumps(res,indent=2))
def ck(x,label):
 res['assertions'].append({'label':label,'passed':bool(x)})
 if not x:save();raise AssertionError(label)
def shot(page,selector,name):
 page.evaluate('scrollTo(0,0)');el=page.locator(selector);box=el.evaluate('e=>{const r=e.getBoundingClientRect();return [r.left+scrollX,r.top+scrollY,r.right+scrollX,r.bottom+scrollY]}');im=Image.open(io.BytesIO(page.screenshot(full_page=True,animations='disabled',style='header.site{visibility:hidden!important}')));im.crop(tuple(map(int,box))).save(OUT/name)
def start(page,ids=None,dark=False):
 page.set_content(raw,wait_until='load')
 if dark:page.evaluate("document.documentElement.dataset.theme='dark';document.documentElement.classList.add('dark')")
 page.locator('.tb-tile[data-exam="mbb"]').click();page.locator('.tb-setpick [data-set="2"]').click()
 ids=ids or [q['qid'] for q in questions]
 page.evaluate('(ids)=>{window.__TB.EXAMS.mbb.sets[2]=Object.values(window.MBB_SET2_BATCHES).flat().filter(q=>ids.includes(q.qid));Math.random=()=>0.9999999}',ids)
 page.locator('[data-mode="full"]').click()
def contain(page,label):ck(page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),label+' page containment')
def interaction(page,label):
 selects=page.locator('[data-mbbf-observation]')
 if selects.count():
  selects.select_option('1');ck(len(page.locator('[data-mbbf-readout]').inner_text())>5,label+' native observation');pt=page.locator('[data-mbbf-point="0"]');pt.focus();pt.press('Enter');ck(selects.input_value()=='0',label+' keyboard inspection')
 inp=page.locator('[data-mbbf-capacity]')
 if inp.count():
  base=inp.get_attribute('data-baseline');inp.fill(inp.get_attribute('max'));inp.dispatch_event('input');ck(inp.input_value() in page.locator('[data-mbbf-capacity-output]').inner_text(),label+' what-if');page.locator('[data-mbbf-reset]').click();ck(inp.input_value()==base,label+' reset')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 layouts=[('dark-mobile',390,844,True),('narrow-mobile',320,800,False)] if a.secondary else [('desktop',1440,1000,False),('tablet',768,1024,False),('mobile',390,844,False)]
 for name,w,h,dark in layouts:
  page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<500,is_mobile=w<500);page.set_default_timeout(7000);page.on('pageerror',lambda e:res['errors'].append(str(e)));start(page,dark=dark);ck(page.locator('.tb-navcell').count()==N,name+' complete slice')
  for i,q in enumerate(questions):
   num=int(q['qid'][-3:]);label=f'{name} Q{num}';page.locator(f'[data-goto="{i}"]').click();ck(page.locator('.tb-stem').get_attribute('data-question-id')==q['qid'],label+' ID');ck(page.locator('.tb-opt').count()==4,label+' choices');contain(page,label)
   if q.get('auditRevision'):
    ck(page.locator('.mbbF-conditions').count()==1,label+' conditions');ck(page.locator('.mbbF-rationales').count()==0,label+' no premature rationale')
    if q.get('chart'):
     ck(page.locator('.mbbF-evidence').count()==1,label+' evidence');interaction(page,label)
     for detail in page.locator('.mbbF-evidence details').all(): detail.evaluate('e=>e.open=true')
     for scroll in page.locator('.mbbF-scroll').all():
      scroll.evaluate('e=>e.scrollLeft=e.scrollWidth');ck(scroll.evaluate('e=>e.scrollWidth<=e.clientWidth||e.scrollLeft>0'),label+' reachable evidence');scroll.evaluate('e=>e.scrollLeft=0')
     ck(page.locator('.mbbF-table thead th').count()>=2,label+' table headers')
   if not a.secondary:
    for choice in range(4):page.locator(f'[data-opt="{choice}"]').click();ck(page.locator(f'.tb-opt.sel[data-opt="{choice}"]').count()==1,label+' select '+str(choice))
    page.locator('[data-flag]').click();ck('Flagged' in page.locator('[data-flag]').inner_text(),label+' flag');page.locator('[data-flag]').click()
   page.locator(f'[data-opt="{keys[i]}"]').click()
   if not a.combined:shot(page,'#tb-overview',name+f'-{num}.png')
   res['states'].append({'layout':name,'qid':q['qid'],'mode':'attempt'})
  page.locator('[data-goto="0"]').click();ck(page.locator(f'.tb-opt.sel[data-opt="{keys[0]}"]').count()==1,name+' retention');page.locator(f'[data-goto="{N-1}"]').click();page.locator('[data-submit]').click();ck(f'{N} of {N} correctly' in page.locator('#tb-overview').inner_text(),name+' independent keys score '+str(N));page.locator('[data-open-review="all"]').click()
  for i,q in enumerate(questions):
   num=int(q['qid'][-3:]);page.locator(f'[data-review-goto="{i}"]').click();card=page.locator('.tb-review-card');ck(card.get_attribute('data-question-id')==q['qid'],name+f' review Q{num}');contain(page,name+f' review Q{num}')
   if q.get('auditRevision'):ck(card.locator('.mbbF-rationales dt').count()==4,name+f' review Q{num} rationales');ck(card.locator('.mbbF-evidence').count()==bool(q.get('chart')),name+f' review Q{num} evidence')
   if not a.combined:shot(page,'.tb-review-card',name+f'-review-{num}.png')
   res['states'].append({'layout':name,'qid':q['qid'],'mode':'review'})
  if not a.secondary:
   nums=[130,134,147,150] if B==6 else [155,158,170];ids=[f'mbb:set-2:original-{n}' for n in nums];k=[KEY6[n-126] if n<151 else KEY7[n-151] for n in nums];start(page,ids)
   for i,key in enumerate(k):page.locator(f'[data-goto="{i}"]').click();page.locator(f'[data-opt="{1 if nums[i]==150 else (key+1)%4}"]').click()
   page.locator('[data-submit]').click();page.locator('[data-retry-missed]').click()
   for i,key in enumerate(k):
    ck(page.locator('.mbbF-evidence').count()==(nums[i]!=150),name+f' retry {nums[i]} evidence');interaction(page,name+' retry');ck(page.locator('.mbbF-rationales').count()==0,name+' retry no key');page.locator(f'[data-retry-opt="{key}"]').click();page.locator('[data-retry-check]').click();ck('Correct.' in page.locator('.tb-retry-feedback').inner_text(),name+' retry scored');ck(page.locator('.mbbF-rationales dt').count()==4,name+' retry rationale');res['states'].append({'layout':name,'qid':ids[i],'mode':'retry'});page.locator('[data-retry-next]').click()
  page.close();save()
 if a.secondary:
  html=read(f'test-bank-assets/mbb-160/batch-0{B}/static-fallbacks.html');html=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',html)
  for name,w,h in [('desktop',1440,1000),('tablet',768,1024),('mobile',390,844)]:
   for theme in ['light','dark']:
    page=browser.new_page(viewport={'width':w,'height':h});page.set_content(html);page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme);ck(page.locator('input,select,button').count()==0,'fallback no dead controls')
    for q in questions:
     if not q.get('chart'):continue
     el=page.locator('#'+q['qid'].replace(':','-'));ck(el.locator('thead th').count()>=2,'fallback data '+q['qid']);contain(page,theme+' fallback');res['states'].append({'layout':name,'theme':theme,'qid':q['qid'],'mode':'fallback'})
    page.close()
 browser.close()
res['passed']=not res['errors'] and all(x['passed'] for x in res['assertions']);save();print(json.dumps({'passed':res['passed'],'assertions':len(res['assertions']),'states':len(res['states']),'errors':res['errors']}))
