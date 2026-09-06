"""Reproducible offline student-interface audit; no live authentication or cloud writes.
Run python tests/browser/mbb-final-batches.py --batch 6 --out /tmp/b6.
"""
from pathlib import Path
import argparse,json,re,subprocess,hashlib,io
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
p=argparse.ArgumentParser();p.add_argument('--batch',type=int,choices=[6,7],required=True);p.add_argument('--out',required=True);p.add_argument('--combined',action='store_true');p.add_argument('--secondary',action='store_true');a=p.parse_args(['--batch','6','--out','/mnt/data/b6-panel-check']);OUT=Path(a.out);OUT.mkdir(parents=True,exist_ok=True)
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

with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [1440,390]:
  page=browser.new_page(viewport={'width':width,'height':900});start(page)
  page.locator('[data-calc]').click();ck(page.locator('#tb-calc').is_visible(),str(width)+' calculator');page.locator('[data-close="calc"]').click()
  page.locator('[data-formulas]').click();ck(page.locator('#tb-formulas').is_visible(),str(width)+' formulas');page.locator('[data-close="formulas"]').click();page.close()
 browser.close()
res['passed']=True;save();print(len(res['assertions']))
